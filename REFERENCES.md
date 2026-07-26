# References

Where the pieces of this benchmark come from. Nothing here is novel — every
mechanic is a known result from swarm robotics or procedural content
generation, wired together into one deterministic score. This page says which
is which, so you can go read the source material instead of reverse-engineering
`lib/engine.mjs`.

Each entry: **what the code does** → **where it's from**.

---

## The task: multi-robot coverage of unknown terrain

N robots with no map, local sensing only, must visit every cell of an unknown
region. That's a named problem with 25 years of literature behind it.

- **Coverage as a robotics problem.** Choset, *Coverage for robotics — a survey
  of recent results*, Annals of Mathematics and AI 31 (2001).
  [link](https://link.springer.com/article/10.1023/A:1016639210559) — the survey
  that frames "cover every point of a region" as its own problem class, distinct
  from path planning.
- **Frontier-based exploration.** Yamauchi, *A frontier-based approach for
  autonomous exploration*, IEEE CIRA '97, pp. 146–151.
  [link](https://www.semanticscholar.org/paper/a1875055e9c526cbdc7abb161959d76d14b58266)
  — "go to the boundary between known and unknown" is the single most effective
  idea in the whole field. Every good submission on the board is some local,
  memory-free approximation of it. `zeeshan-edge` is named for it.
- **Ant-robot coverage with evaporating traces.** Wagner, Lindenbaum &
  Bruckstein, *Distributed covering by ant-robots using evaporating traces*,
  IEEE Trans. Robotics & Automation 15(5) (1999), pp. 918–933.
  [link](https://www.researchgate.net/publication/3298981_Distributed_covering_by_ant-robots_using_evaporating_traces)
  — this is the closest published ancestor of the whole benchmark: simple robots,
  no map, no comms, covering unknown graphs using only a decaying chemical trace
  they drop and smell. `env.trail` is that paper.

## The coordination channels

The three ways agents can talk, and why each exists.

- **`env.trail` — stigmergy.** Coordination by modifying the shared environment
  rather than by messaging. Coined by Grassé, *La reconstruction du nid et les
  coordinations interindividuelles chez Bellicositermes natalensis et Cubitermes
  sp. — la théorie de la stigmergie*, Insectes Sociaux 6 (1959), pp. 41–81.
  [link](https://link.springer.com/article/10.1007/BF02223791) — termites appear
  coordinated while each works alone, because the half-built nest itself carries
  the plan.
  The engineering descendant is ant colony optimization (Dorigo & Stützle, *Ant
  Colony Optimization*, MIT Press 2004). Our deposit/evaporate loop
  (`trail = trail * 0.9 + deposit`) is the standard ACO pheromone update, minus
  the objective function.
- **`env.near` — local density sensing.** Radius-1 neighbour counts, enough for
  dispersion without a global map. Standard in swarm robotics as the minimal
  repulsion primitive (the "separation" rule of Reynolds' boids, reduced to a
  grid).
- **`env.shared` — an explicit shared blackboard.** This one is *not* classical
  swarm robotics; it's deliberately more powerful, closer to a blackboard system
  or shared-memory multi-robot SLAM. It exists because pretending 100 real robots
  can't sync a map in 2026 is a fiction, and because it makes the benchmark's
  frontier interesting rather than capped by what pheromones alone can do. It's
  the one channel here that a purist would call cheating.

## The maps

Three families, one per seed (`seed % 3`), in `lib/engine.mjs:37`.

### rooms — scattered rectangles

Drop 14–22 random axis-aligned blocks. Descended straight from the original
*Rogue* (1980) dungeon generator and its thousand descendants; the "random
rectangles, keep what's left" idea needs no citation beyond the genre itself.
Good survey context: Shaker, Togelius & Nelson, *Procedural Content Generation
in Games* (Springer, 2016), the free book at
[pcgbook.com](http://pcgbook.com).

### maze — randomized DFS, then braided

- **Generation:** the recursive backtracker (randomized depth-first search) on
  odd coordinates. Carve two cells at a time so untouched even cells become the
  1-thick walls; only ever carve into unvisited cells, so the result is a
  *perfect* maze — exactly one path between any two points, zero loops. Textbook
  treatment: Buck, *Mazes for Programmers* (Pragmatic Bookshelf, 2015), ch. 5;
  algorithm zoo at
  [Think Labyrinth: Maze Algorithms](https://www.astrolog.org/labyrnth/algrithm.htm).
- **Braiding:** a perfect maze is a coverage nightmare — every wrong turn is a
  dead end you must retrace in full, and it wrecked three of the four reference
  policies. So 160 random interior walls are knocked out afterwards, adding
  loops. The term is Walter Pullen's: a *braid* maze is one whose passages coil
  back into each other instead of dead-ending.
  [Think Labyrinth: Maze Glossary](https://www.astrolog.org/labyrnth/glossary.htm).
  160 is tuned, not principled — see the ceiling note in the code.

### cave — cellular automata

Fill 45% of cells at random, then 4 smoothing passes of: *count the 8
neighbours that are wall (off-grid counts as wall); >4 → wall, <4 → floor,
exactly 4 → unchanged.* Noise erodes, blobs consolidate.

- That is exactly the **4–5 rule** from RogueBasin's
  [Cellular Automata Method for Generating Random Cave-Like Levels](https://www.roguebasin.com/index.php/Cellular_Automata_Method_for_Generating_Random_Cave-Like_Levels)
  (attributed to Jim Babcock), just written as a symmetric threshold: a tile is
  wall iff its 3×3 neighbourhood holds ≥5 walls.
- Academic treatment, including why 4 passes is about right and why it's cheap
  enough for real time: Johnson, Yannakakis & Togelius, *Cellular automata for
  real-time generation of infinite cave levels*, PCGames '10.
  [link](https://dl.acm.org/doi/10.1145/1814256.1814266)

### the shared post-step

All three go through one 4-connected flood fill; the largest open component is
kept and every other pocket is filled solid (`lib/engine.mjs:87`). This is the
standard PCG fix for "the generator made an unreachable room" — RogueBasin's
cave article recommends the same connectivity pass — and it's what makes the
benchmark honest: `openCount` is exactly the reachable set, so 95% coverage is
always achievable and the floor is always well defined.

## Determinism

- **PRNG:** mulberry32, by Tommy Ettinger —
  [gist](https://gist.github.com/tommyettinger/46a874533244883189143505d203312c).
  32 bits of state, ~6 lines, identical output in every JS engine. Chosen for
  reproducibility, not statistical quality: the author himself
  [no longer recommends it](https://github.com/bryc/code/discussions/21) because
  it isn't equidistributed. That's fine here — we need *the same* random maps
  everywhere, not cryptographically good ones.
- **Fixed seed list, no hidden set.** 12 public seeds, so a score is fully
  reproducible on your laptop. The tradeoff is that overfitting to the 12 maps is
  possible; the three map families exist partly to raise the cost of doing so.
- **Sandbox:** submitted policies run in a bare `node:vm` context with no
  globals and a wall-clock timeout (`lib/score.mjs`), so an infinite loop is a
  FAIL rather than a hung CI job.

## The score

`score = agents × mean steps to 95% coverage`, lower wins.

- **Why a product.** It prices both resources at once — you can't win by
  throwing 500 robots at the problem, and you can't win by taking forever with
  one. Product-of-resources objectives are standard in distributed algorithms
  (work × time), and it's what makes the floor provable.
- **The floor.** Every covered cell needs at least one agent-step, so
  `agents × steps ≥ cells covered`. Mean of `⌈0.95 × openCount⌉` over the 12
  maps = **931**. No policy can go below it. This is the same trick as a
  work-optimality bound in parallel algorithms.
- **The ≥50-agent gate.** Because the floor is achieved by *one* robot walking a
  perfect Hamiltonian-ish sweep, an unconstrained product score is really a
  single-robot path-planning benchmark. `MIN_AGENTS = 50` (`lib/score.mjs`)
  makes it a swarm benchmark again.
- **Lévy Flight as the named baseline.** Its step lengths are drawn from an
  inverse-square power law, which is the optimal blind-search distribution for
  sparse targets: Viswanathan et al., *Optimizing the success of random
  searches*, Nature 401 (1999), pp. 911–914.
  [link](https://pubmed.ncbi.nlm.nih.gov/10553906/) — so "beat the Lévy forager"
  is a meaningful bar, not an arbitrary one.
- **OK/FAIL gate over a fixed suite.** Format borrowed from
  [ecdsa.fail](https://ecdsa.fail) — every case must pass or you're logged but
  unranked. Partial credit hides broken policies.

## Considered and deliberately not done

- **Hidden/holdout seeds.** Would kill overfitting, but also kills "run it on
  your laptop and get the same number", which is the point.
- **Continuous space, diagonal moves, sensor noise, robot collisions.** Each is
  more realistic and each adds a tuning knob that turns the score into a
  simulator-fitting exercise.
- **Per-policy pheromone decay.** The 0.9 evaporation rate is fixed for
  everyone; exposing it makes the leaderboard a hyperparameter search.
- **Perfect (unbraided) mazes.** Tried, rejected — see above.

---

*Links checked July 2026. Corrections welcome as a PR.*
