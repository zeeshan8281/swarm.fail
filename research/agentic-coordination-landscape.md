# Agentic coordination research landscape for swarm.fail

**Research date:** 13 August 2026

**Decision this brief supports:** Which research question, benchmark design, and academic partner could turn swarm.fail from a good interactive demo into a legitimate technical challenge?

## Executive recommendation

Do **not** launch this as a generic “make agents explore random mazes” contest. That is a playable artifact, but it is not yet a defensible research contribution.

Launch it as a benchmark for this question:

> **Can a frontier coding model synthesize one compact, decentralized controller whose local rules produce robust swarm-level behavior in environments it has never seen?**

This is unusually well timed. In April 2026, Volker Strobel, Marco Dorigo, and Mario Fritz argued in *Science Robotics* that foundation models can act as **swarm designers**: translating a desired collective behavior into code for individual robot controllers. They identify validation of the resulting collective behavior—the classic **micro–macro link problem**—as a central difficulty. That validation loop is almost exactly what swarm.fail can become: a model writes microscopic code; the simulator measures whether reliable macroscopic behavior emerges. ([paper](https://iridia.ulb.ac.be/~vstrobel/articles/StrDorFri2026scirob.pdf), [journal record](https://pubmed.ncbi.nlm.nih.gov/42054475/))

The strongest first partnership target is **Dr. Volker Strobel at IRIDIA/ULB**, approached together with **Prof. Marco Dorigo**. Their LLM2Swarm project already synthesizes and validates swarm controllers, but it is presented through proofs of concept rather than a broad public coding-model benchmark. ([LLM2Swarm paper](https://arxiv.org/abs/2410.11387), [code](https://github.com/Pold87/LLM2Swarm), [Strobel profile](https://iridia.ulb.ac.be/~vstrobel/))

The second target is **Prof. Shiyu Zhao at Westlake University**, corresponding author of GenSwarm. GenSwarm turns natural-language instructions into white-box multi-robot code policies and deploys them in simulation and on real robots. An independent, held-out evaluation challenge is a natural complement to that work. ([GenSwarm](https://www.nature.com/articles/s44182-025-00065-w), [code](https://github.com/WindyLab/GenSwarm), [profile](https://www.shiyuzhao.net/))

The third target is **Prof. Amanda Prorok at Cambridge** for benchmark methodology: strict decentralization, learned communication, behavioral diversity, robustness, scaling, and a path from simulation to physical teams. ([profile](https://www.proroklab.org/people/amanda-prorok/), [decentralized coordination program](https://www.proroklab.org/research/decentralized-coordination/), [VMAS](https://arxiv.org/abs/2207.03530))

### The one-line founder pitch

> **swarm.fail measures whether an AI can write one tiny rule that makes hundreds of independent agents behave intelligently together—even when the world changes and nobody is in charge.**

### The academic pitch

> **swarm.fail is a reproducible benchmark for foundation-model-based synthesis of decentralized swarm controllers. It evaluates the micro–macro link: whether code generated for an individual agent generalizes into robust collective behavior across held-out environments, team sizes, communication constraints, and failures.**

### The strategic pitch

The five challenge properties that matter are the same ones visible across ECDSA.fail and the Yukon challenges:

1. a real unresolved bottleneck;
2. a credible problem owner or academic partner;
3. an objective, hard-to-game verifier;
4. a public frontier where winning work becomes useful;
5. a hero artifact that makes the result immediately legible.

swarm.fail already has most of (3) and (5). The research partnership must supply (1), (2), and a path for (4).

---

## 1. What field are we actually entering?

Several related fields use the word “agents,” but they ask different questions. The challenge will be easier to explain and partner around if we name the field precisely.

| Field | What an “agent” is | Typical question | Relationship to swarm.fail |
|---|---|---|---|
| **Swarm robotics** | Many relatively simple robots using local rules | How can local interaction produce scalable, robust collective behavior? | The closest conceptual field |
| **Multi-robot systems** | A team of robots, often with central planning or explicit roles | How should tasks, routes, and information be allocated? | Relevant, but broader and not necessarily decentralized |
| **Multi-agent reinforcement learning (MARL)** | Learned policies controlling multiple agents | How can agents learn cooperation, credit assignment, and communication? | Supplies baselines and evaluation methods |
| **LLM multi-agent systems** | Multiple language-model instances reasoning and messaging online | Do multiple LLM agents collaborate better than one? | A different and increasingly crowded benchmark category |
| **Foundation models for robot control** | A model generates or executes robot policies | Can models generalize across tasks, bodies, and environments? | The best bridge to a current high-value research vertical |
| **Multi-agent path finding (MAPF)** | Many moving agents sharing routes | Can a large fleet route without collisions or congestion? | Strong industrial field, but already has a major challenge ecosystem |

The best positioning is at the intersection of **swarm robotics** and **foundation-model code generation**, not the generic “multi-agent LLM” category.

That distinction matters:

- In **SwarmBench**, an LLM instance acts as each agent and chooses actions online at every step.
- In **Alem**, language agents communicate, specialize, craft, trade, and fight over long horizons.
- In the proposed **swarm.fail**, a coding model acts once as the *designer*, produces a small white-box controller, and that controller is then cloned and evaluated cheaply and deterministically.

This makes the benchmark more reproducible, interpretable, and inexpensive than running hundreds of model calls during every episode.

---

## 2. Why this is a real 2026 research opportunity

### 2.1 Foundation models as swarm designers

The strongest primary source is the 2026 *Science Robotics* viewpoint by Strobel, Dorigo, and Fritz. It describes two roles for foundation models:

- **swarm designer:** synthesize controller code and high-level plans;
- **swarm operator:** enable robot-to-robot and human-to-swarm interaction.

The paper explicitly proposes using natural language, sketches, or diagrams to specify desired collective behavior, then generating code for the individual robot controller. It also says validating the emergent group behavior is hard because programmers act at the microscopic level while objectives exist at the macroscopic level. ([author manuscript](https://iridia.ulb.ac.be/~vstrobel/articles/StrDorFri2026scirob.pdf))

That gap is the cleanest academic “hook” available to swarm.fail:

```text
Collective goal
      ↓
Coding model writes one local controller
      ↓
Controller is cloned into N agents
      ↓
Hidden simulations stress-test the group
      ↓
Score + replay + interpretable failure modes
```

### 2.2 The idea has proofs of concept, but not a settled public benchmark

Three recent systems show that this is no longer speculative:

1. **LLM2Swarm** explores indirect controller synthesis and validation as well as direct LLM integration on individual robots. Its authors release ARGoS/e-puck software and videos. ([paper](https://arxiv.org/abs/2410.11387), [repository](https://github.com/Pold87/LLM2Swarm))
2. **GenSwarm** converts natural-language instructions into white-box Python policies, refines them using feedback, and deploys them on simulated and physical robot teams. It emphasizes reproducibility and interpretability. ([paper](https://www.nature.com/articles/s44182-025-00065-w), [repository](https://github.com/WindyLab/GenSwarm))
3. **Online automatic code generation for robot swarms** uses an external LLM to generate new code when a self-organizing robot hierarchy gets stuck. It reports experiments with six physical robots and simulations with more than 30 robots, with 85% mission success. ([preprint](https://arxiv.org/abs/2510.04774))

These projects validate the direction. They also create the opening: there is not yet a widely recognized, model-comparative, held-out public challenge focused specifically on **coding models as swarm controller designers**.

### 2.3 Coordination is measurably distinct from individual intelligence

The June 2026 **Alem** benchmark evaluates 13 LLMs in a procedurally generated, Craftax-like multi-agent world. The reported average normalized return is only about 6%, and the authors find that strong individual task performance does not imply strong coordination. Communication is the largest contributor in their ablations. ([paper](https://arxiv.org/abs/2606.08340), [environment](https://github.com/alem-world/alem-env))

This supports a useful benchmark claim: swarm coordination is not merely another presentation of coding or reasoning ability. It can expose a separate capability.

### 2.4 A shared policy creates a real scientific question

swarm.fail clones one policy across the whole team. That design connects to active work on parameter sharing and behavioral diversity:

- **GradPS** notes that identical shared policy parameters are sample-efficient but can produce homogeneous behavior that limits performance. ([ICML 2025 paper](https://proceedings.mlr.press/v267/qin25c.html))
- **Selective Parameter Sharing** shows that sharing can help scaling but that the right grouping depends on the environment. ([ICML 2021 paper](https://proceedings.mlr.press/v139/christianos21a.html))
- **DiCo** explicitly controls behavioral diversity using a shared component plus agent-specific components. ([OpenReview](https://openreview.net/forum?id=qQjUgItPq4))
- Prorok Lab’s 2026 work asks when diversity is actually rewarded in cooperative multi-agent learning. ([ICLR 2026 paper](https://openreview.net/forum?id=uJCGMBO6Qx))

This yields a second publishable question:

> **When is one shared controller sufficient, and when does reliable coordination require role diversity?**

That can become a later track without changing the core brand.

---

## 3. Existing benchmarks and where the white space is

### Directly adjacent work

| Project | What it evaluates | Strength | Why swarm.fail must differ |
|---|---|---|---|
| **SwarmBench** | LLMs acting online as decentralized agents in pursuit, synchronization, foraging, flocking, and transport | Closest name and task overlap; local perception and communication; open toolkit | Do not duplicate online LLM agents. Evaluate a coding model that produces a static white-box controller once. ([paper](https://arxiv.org/abs/2505.04364), [code](https://github.com/RUC-GSAI/YuLan-SwarmIntell)) |
| **Alem** | Long-horizon coordination by language agents in a Craftax-like survival world | Open-ended, procedural, communication and soft specialization | Much heavier and noisier. swarm.fail can own compact, deterministic controller synthesis. ([paper](https://arxiv.org/abs/2606.08340)) |
| **GenSwarm** | Natural-language-to-code multi-robot deployment | Real robots, white-box policies, end-to-end workflow | Treat it as a potential partner/baseline; supply independent held-out evaluation rather than a competing system. ([paper](https://www.nature.com/articles/s44182-025-00065-w)) |
| **LLM2Swarm** | Indirect controller synthesis plus direct LLM-on-robot integration | Exact conceptual match and leading swarm-intelligence lab | Build the benchmark/competition layer their research agenda calls for. ([paper](https://arxiv.org/abs/2410.11387)) |
| **League of Robot Runners** | Task allocation, path planning, and robust execution for large fleets | Amazon Robotics sponsor, AAMAS 2026, real industrial problem, uncertainty track | Warehouse MAPF is already occupied. Partner later or use it as a standard to emulate, not a first topic to clone. ([official challenge](https://www.leagueofrobotrunners.org/)) |
| **VMAS / BenchMARL / JaxMARL** | Fast, standardized MARL environments and training | Mature research infrastructure and baselines | Reuse concepts or adapters; do not claim a new simulator is the contribution. ([VMAS](https://arxiv.org/abs/2207.03530), [BenchMARL](https://www.jmlr.org/papers/v25/23-1612.html), [JaxMARL](https://arxiv.org/abs/2311.10090)) |
| **Robotarium** | Remote execution of multi-robot control code on physical robots | A direct simulation-to-real path, free remote access | Potential final-round validation partner rather than the first software benchmark substrate. ([official site](https://www.robotarium.gatech.edu/)) |

### Broader agent-coordination benchmarks reviewed

There is also a fast-growing benchmark category for language-agent teams outside robotics:

- **TeamBench** uses operating-system-enforced role separation across 851 task templates and 931 seeded instances. It is relevant to future role-budget or information-boundary tracks, but it does not study embodied swarm control. ([paper](https://arxiv.org/abs/2605.07073))
- **CooperBench** evaluates whether coding agents can work as teammates on conflicting tasks in real repositories. It strengthens the case that team capability needs its own evaluation, but the agents collaborate on software rather than through a physical environment. ([paper](https://arxiv.org/abs/2601.13295), [benchmark](https://cooperbench.com/index.html))
- **LLM-Coordination** evaluates pure coordination settings and distinguishes coordination reasoning from general language capability. ([ACL Anthology](https://aclanthology.org/2025.findings-naacl.448/))

These are useful methodological references for controlled model evaluation. They are not substitutes for the proposed controller-synthesis benchmark.

### The “Open Front” reference from the meeting

The identifiable **OpenFront** is an open-source browser real-time-strategy game, not a recognized academic coordination benchmark. It could become a visually compelling multi-player substrate, but it does not currently supply the academic hook or problem owner the team is seeking. Confirm whether the meeting meant this game or FrontierCS before investing in it. ([official repository](https://github.com/openfrontio/OpenFrontIO))

### The white space

The most defensible gap is the combination of:

- a **coding model**, not an LLM at every timestep;
- a **small executable controller**, not prose coordination;
- **one shared controller** with local observations;
- **hidden, procedural stress tests**;
- explicit measurement of **generalization, robustness, communication, and scale**;
- **open model provenance and attempt budgets**;
- a visual replay that exposes how microscopic code creates macroscopic behavior.

No source reviewed here combines all seven as a public challenge.

---

## 4. What the current repository gets right

The existing product is not wasted work. It is a strong prototype of the future hero artifact.

- **One-file policy:** A submission is legible and inspectable.
- **One policy cloned across many agents:** This creates the micro–macro link directly.
- **Deterministic execution:** Scores can be replayed without trusting a hosted service.
- **Fast browser visualization:** Collective behavior is visible, not buried in a chart.
- **Automatic scoring and PR workflow:** The benchmark is easy for coding agents to enter.
- **Multiple environment topologies:** A policy cannot rely on one simple geometric pattern.
- **Existing coordination channels:** private state, local density, stigmergic trails, and a shared blackboard offer useful ablation points.

The right move is therefore not a rewrite. It is to turn the current engine into the **public dev arena**, then add a scientifically cleaner evaluator beside it.

---

## 5. What an academic reviewer will challenge

These are not cosmetic issues. They determine what the benchmark can honestly claim.

### 5.1 The current “local/decentralized” claim is too strong

In the [current engine](../lib/engine.mjs), every agent receives global coordinates (`a.x`, `a.y`) and access to `env.shared`, one global object that every agent can read and write. Agents are evaluated in fixed ID order, so higher-ID agents can see writes made by lower-ID agents during the same tick.

That is a **global blackboard with serial update semantics**, not strict local-only decentralized coordination. It is a valid practical architecture, but it must be named accurately.

**Recommendation:** create two explicit tracks:

- **Local-only:** local sensing, bounded local messages/trails, no global blackboard, no perfect global coordinates;
- **Shared-memory:** keep `env.shared` as a practical networked-team track.

The local-only track is the scientific core. The shared-memory track is still valuable as an ablation: how much does global communication buy?

### 5.2 The maps are public and fixed

All 12 seeds are public. This is excellent for exact local reproduction, but it allows direct specialization to the test set.

**Recommendation:** retain public development seeds, but score final submissions on private seeds sampled from versioned generators. Reveal those seeds after the competition. This preserves post-hoc reproducibility without allowing test-set tuning during the event.

### 5.3 The benchmark does not yet measure coding-model ability fairly

The current leaderboard permits humans and any model, with unlimited prompts, test runs, and manual edits. It measures the best policy a contestant eventually produces—not the capability of a model or coding agent.

**Recommendation:** separate two leaderboards:

1. **Open optimization:** humans and agents can iterate freely; best controller wins.
2. **Model benchmark:** fixed task prompt, tool access, wall-clock/token budget, number of attempts, and no human edits. Report model version, harness version, cost, and success distribution across repeated runs.

Without this separation, claims such as “Model X is better at coordination” would not be supported.

### 5.4 The score hides important behavior

`agents × mean steps` is simple and useful for the game, but one scalar cannot explain robustness, communication cost, collisions, or performance across scales. It also encourages teams to cluster at the minimum allowed number of agents.

**Recommendation:** keep one headline score, but compute it from a published metric card:

- task success gate;
- normalized completion time or coverage efficiency;
- collision/safety penalty;
- communication bytes/messages;
- energy or distance traveled;
- robustness under agent dropout and sensor noise;
- generalization gap between public and held-out scenarios;
- scaling curve across team sizes.

### 5.5 The stated floor is not currently a strict lower bound

The README calls 931 a “provable floor,” but agents spawn across the open map and their initial cells count as covered before any step. Those cells are therefore free under an `agents × steps` score. The repository’s own [references](../REFERENCES.md) acknowledge this slack.

**Recommendation:** call 931 a **cell-count reference** in the current arena, not a provable bound. For a true work bound, charge initial placements or subtract them consistently in the derivation.

### 5.6 Other simulator artifacts need explicit treatment

- Multiple agents may occupy the same cell; there is no physical collision model.
- All maps are 40×40; scale generalization is not tested.
- Agents spawn throughout the map, which weakens the “unknown-world exploration” interpretation.
- IDs and exact swarm size allow deterministic role assignment even though the policy code is shared.
- `env.here` is effectively tautological in the current loop because the cell an agent occupies has already been marked covered.
- A source-size and wall-clock limit exists, but there is no cross-hardware instruction/compute budget for policy complexity.

None of these invalidate the prototype. They mean the first academic design session should define the benchmark’s threat model and claims before more UI work.

---

## 6. Candidate challenge directions

Scores are 1–5, where 5 is strongest. “Buildability” means a higher score is easier to ship from the current repository.

| Direction | Research legitimacy | Differentiation | Hero artifact | Partner fit | Buildability | Total |
|---|---:|---:|---:|---:|---:|---:|
| **Foundation models for swarm-controller synthesis** | 5 | 5 | 5 | 5 | 4 | **24** |
| **One shared policy vs bounded role diversity** | 5 | 5 | 4 | 5 | 4 | **23** |
| **Robust decentralized search and exploration** | 5 | 3 | 5 | 5 | 3 | **21** |
| **Warehouse fleet coordination / MAPF** | 5 | 1 | 4 | 4 | 3 | **17** |
| **Open-ended Minecraft/Craftax coordination** | 4 | 2 | 5 | 3 | 1 | **15** |

### Direction A — recommended: Foundation Models for Swarm Controller Synthesis

**Research question:** Given a task specification and controller API, can a coding model generate a compact policy that produces reliable collective behavior on unseen scenarios?

**Why it works:** It directly implements the 2026 “foundation model as swarm designer” agenda, fits the current one-file submission loop, and differs clearly from SwarmBench and Alem.

**Initial task:** Unknown-environment coverage with local sensing. Keep the first challenge narrow enough to ship and study well.

**Future task families:** foraging, transport, rendezvous/synchronization, formation, dynamic task allocation, and recovery from failures.

### Direction B — strongest second track: One Shared Policy vs Role Diversity

**Research question:** When can a shared controller create useful behavioral specialization through memory, randomness, or agent identity, and when are multiple role-specific controllers necessary?

**Track design:**

- `1×`: exactly one shared controller;
- `K×`: at most K role controllers, with K priced in the score;
- continuous: shared core plus a bounded per-agent parameter budget.

This is scientifically strong but should follow the core benchmark, not block it.

### Direction C — real-world narrative: Robust Decentralized Search

**Problem story:** A team must map and search a dangerous environment despite blocked paths, noisy sensing, lost communications, and failed agents.

This connects to DARPA SubT’s tunnel, urban-underground, and cave scenarios and to RoboCup Rescue’s objective evaluation of systems for hazardous environments. ([DARPA SubT](https://www.darpa.mil/research/programs/darpa-subterranean-challenge), [RoboCup Rescue](https://rrl.robocup.org/league-overview/))

Use this as the **application narrative**, but avoid claiming operational rescue relevance until the environment and metrics are co-designed with domain experts.

### Direction D — do not lead with: Warehouse MAPF

It is commercially credible, but the League of Robot Runners already has Amazon Robotics, AAMAS, task scheduling, lifelong planning, and a 2026 uncertainty/execution-policy track. Amazon has also announced DeepFleet, a foundation model trained on fulfillment-center robot data. ([League](https://www.leagueofrobotrunners.org/), [DeepFleet](https://www.amazon.science/blog/amazon-builds-first-foundation-model-for-multirobot-coordination))

This direction is better as a later collaboration or benchmark adapter than as swarm.fail’s first claim to legitimacy.

### Direction E — do not lead with: Minecraft

Minecraft-like worlds make excellent videos, but Alem already supplies a procedurally generated Craftax-style environment with exploration, crafting, trading, combat, communication, and specialization. A new Minecraft substrate would be expensive and difficult to evaluate cleanly.

The lazy and stronger move is to prove the controller-synthesis question in the compact swarm arena first.

---

## 7. Recommended benchmark specification

### Core research question

> Can a coding agent translate a global collective objective into local controller code that generalizes across unseen environments and perturbations?

### Two different objects to score

#### A. Controller score

This answers: “How good is the submitted policy?”

- same submitted source on every scenario;
- deterministic replay;
- public dev suite plus hidden test suite;
- success gate across every required scenario family;
- headline efficiency score plus a full metric card.

#### B. Designer/model score

This answers: “How good is the coding model at discovering that policy?”

- fresh repository/task context per run;
- fixed prompt and tool permissions;
- fixed token, time, and evaluation-call budget;
- no human edits;
- multiple independent attempts;
- report success rate, median controller score, cost, and variance.

This separation is essential. A brilliant controller and a capable controller-generating model are related but different research results.

### Evaluation split

| Split | Visible during development? | Purpose |
|---|---|---|
| Public examples | Yes | Explain API and expected behavior |
| Public dev seeds | Yes | Local iteration and exact reproduction |
| Private validation seeds | Score only | Live leaderboard without exposing layouts |
| Frozen final seeds | No, until close | Final ranking and resistance to adaptive overfitting |

After the event, publish all seeds and artifacts. A future season can use a new frozen set.

### Scenario axes

Do not multiply map skins. Vary scientifically meaningful pressures:

- topology: open, corridor, clustered, bottlenecked;
- scale: map size and team size;
- observability: sensor radius and noise;
- communication: range, bandwidth, delay, packet loss;
- reliability: agent dropout or Byzantine/malfunctioning agents;
- dynamics: blocked passages or changing targets;
- initialization: common deployment point versus distributed spawn.

### Tracks

1. **Local-only:** no global blackboard or perfect global coordinates.
2. **Shared-memory:** current blackboard-style coordination, with message/memory cost measured.
3. **Resilience:** failures, communication loss, or adversarial agents.
4. **Role budget** *(later)*: one shared policy versus bounded specialization.

### Headline score

Keep it explainable:

```text
must pass every required scenario family

score = normalized work
      + communication penalty
      + safety penalty
      + robustness penalty

lower is better
```

Do not finalize weights without partner input. During research, publish all raw metrics and Pareto plots so a weighting choice does not hide tradeoffs.

### Baselines

At minimum:

- random/correlated walk;
- Lévy-style search;
- classical frontier-based exploration;
- stigmergic/pheromone controller;
- shared-blackboard frontier assignment;
- one learned or optimized controller from a canonical toolkit;
- controllers generated by several fixed coding models under the same budget.

The baseline suite should be more important than the map generator. It tells researchers what capability a result actually beats.

### Hero artifact

For every ranked entry, show:

- controller source;
- model/prompt/attempt provenance;
- winning replay on a held-out scenario;
- side-by-side replay against a named baseline;
- coordination timeline: explored area, active roles, messages, collisions, dropouts;
- worst failure replay, not only the best run;
- compact metric card and generalization gap.

That gives the team the playable “hero artifact” discussed in the meeting without reducing the result to spectacle.

---

## 8. Ranked academic partner shortlist

### Tier 1 — contact first

| Rank | Person / lab | Why this is a direct fit | Specific ask | Public contact |
|---:|---|---|---|---|
| **1** | **Dr. Volker Strobel, IRIDIA/ULB** | Corresponding author of the 2026 FM-for-swarms viewpoint; creator of LLM2Swarm; works on controller validation and secure swarms | 30-minute methodology call; ask whether a public controller-synthesis benchmark would advance the research agenda and what task/constraints make it publishable | [profile](https://iridia.ulb.ac.be/~vstrobel/) · `volker.strobel@ulb.be` |
| **2** | **Prof. Marco Dorigo, IRIDIA/ULB** | Foundational swarm-intelligence researcher; co-author of the exact papers; IRIDIA has deep automatic swarm-controller design history | Approach through/with Strobel; ask IRIDIA to co-design the benchmark and baseline suite, not merely endorse it | [profile](https://iridia.ulb.ac.be/~mdorigo/) · `mdorigo@ulb.ac.be` |
| **3** | **Prof. Shiyu Zhao, WINDY Lab, Westlake** | GenSwarm already generates white-box policies from natural language and deploys them on real robots | Propose swarm.fail as an independent held-out GenSwarm-style evaluation and public challenge; ask for one canonical task and baseline | [profile](https://www.shiyuzhao.net/) · `zhaoshiyu@westlake.edu.cn` |
| **4** | **Prof. Amanda Prorok, Cambridge** | Leading work on decentralized coordination, communication, diversity, scaling, VMAS, and sim-to-real | Ask for critique of decentralization claims, metric design, and a path to physical validation | [profile](https://www.proroklab.org/people/amanda-prorok/) · `asp45@cam.ac.uk` |
| **5** | **Kai Ruan / Prof. Hao Sun, Renmin University** | Authors of the closest direct benchmark, SwarmBench; their code welcomes extension and collaboration | Propose a complementary **code-policy track**, not a competing clone; compare online LLM agents against offline model-generated controllers | [Kai Ruan](https://x66ccff.github.io/) · [Hao Sun](https://ai.ruc.edu.cn/academicfaculty/szdwn/sh/index.htm) · `haosun@ruc.edu.cn` |

### Tier 2 — high-value after the thesis is sharpened

| Person / organization | Relevance | Best use |
|---|---|---|
| **Prof. Sabine Hauert, Bristol** | Swarm engineering, real-world applications, public communication, responsible deployment | Problem framing, real-world narrative, trustworthy swarm metrics. ([profile](https://hauertlab.com/sabine-hauert/)) |
| **Prof. Jakob Foerster, Oxford FLAIR** | MARL, open-ended learning, JaxMARL ecosystem | Model/MARL baselines and open-ended coordination methodology. ([lab](https://foersterlab.com/)) |
| **Prof. Stefano Albrecht, Edinburgh AARG** | Parameter sharing, ad-hoc teams, multi-agent learning, alliance-aware robot foundation models | Role diversity and heterogeneous-team track. ([Edinburgh faculty page](https://informatics.ed.ac.uk/eliai/people/faculty), [2026 viewpoint](https://doi.org/10.1126/scirobotics.aea1822)) |
| **Prof. Radhika Nagpal, Princeton SSR** | Foundational self-organization and large robot collectives | Scientific advisory credibility and classical swarm baselines; less direct for ML benchmark design. ([lab](https://ssr.princeton.edu/research)) |
| **Robotarium, Georgia Tech** | Free remote access to physical multi-robot experiments; Python and MATLAB simulation-to-real flow | Final-round hardware validation once the controller API is compatible. ([official site](https://www.robotarium.gatech.edu/get-started)) |
| **League of Robot Runners organizers** | Established Amazon/AAMAS competition with robust execution under uncertainty | Learn challenge operations or create a future controller-generation exhibition track; avoid duplicating MAPF. ([official site](https://www.leagueofrobotrunners.org/)) |

### Outreach sequence

1. Send a tightly scoped note to **Volker Strobel**, copying or referencing Marco Dorigo only if appropriate.
2. In parallel, contact **Shiyu Zhao** with the independent-evaluation angle.
3. Ask **Amanda Prorok** for methodological critique once a two-page draft spec exists.
4. Contact the **SwarmBench** authors with a collaboration/complementarity proposal.
5. Explore **Robotarium** only after the action/observation API and safety layer are stable.

Avoid a mass “please partner with us” email. Each outreach should contain one research question, a working artifact, one diagram, and a specific 30-minute ask.

---

## 9. Draft outreach email to the best-fit partner

**Subject:** A public benchmark for foundation-model-generated swarm controllers

> Hi Dr. Strobel,
>
> I’m building swarm.fail, a small open benchmark where a coding model writes one controller, that controller is cloned across a swarm, and we evaluate the resulting collective behavior on unseen environments.
>
> Your *Science Robotics* viewpoint and LLM2Swarm work gave us a much sharper framing: the interesting problem is the foundation model as a **swarm designer**, and the benchmark is a public test of the **micro–macro link**—whether generated individual-level code reliably produces the intended swarm-level behavior.
>
> We have a working deterministic simulator, one-file controller format, automated verifier, and interactive replay. Before turning it into a challenge, we want to correct the research design: strict local versus shared-memory tracks, held-out procedural environments, communication and robustness metrics, and a fair budget for comparing coding models.
>
> Would you be open to a 30-minute call to tell us whether this benchmark would be useful to the field, and what task or evaluation design would make it scientifically meaningful? If there is alignment, we would love to explore co-designing the benchmark with IRIDIA rather than asking for a superficial endorsement.
>
> Working artifact: [link]
>
> Two-page concept: [link]
>
> Best,
>
> Zeeshan

For Shiyu Zhao, replace the second paragraph with the GenSwarm connection and ask whether a held-out, model-comparative challenge could serve as an independent evaluation layer for white-box code-policy generation.

---

## 10. Suggested 30-day path

### Week 1 — partner-ready concept, no major build

- Turn this brief into a two-page concept note.
- Record a 30–45 second replay showing one controller succeeding and failing.
- Write the exact research question and the distinction from SwarmBench, Alem, GenSwarm, and League of Robot Runners.
- Send the first two targeted emails: Strobel and Zhao.

### Week 2 — methodology conversations

- Conduct calls with interested researchers.
- Decide whether the first challenge is pure coverage or a small multi-task suite.
- Lock definitions of local observation, communication, simultaneity, collision, and agent identity.
- Decide what the academic partner will genuinely own: task, metric, baseline, paper, or hardware validation.

### Week 3 — evaluator v2 specification

- Specify public/private scenario splits.
- Specify controller and model leaderboards separately.
- Specify baseline suite and raw metrics.
- Write a threat model for test leakage, unsafe code, timing, nondeterminism, and manual intervention.

### Week 4 — smallest credible implementation

- Keep the current arena as the public dev experience.
- Add only the partner-approved evaluator changes required for a pilot.
- Run 3–5 coding models under the same harness budget.
- Publish a pilot report with replays and failure analysis before announcing a full competition.

Do not build Minecraft, real-robot integration, five task families, or a new simulator during this month. They become justified only after a partner confirms the core research question.

---

## 11. Decision summary

### What to say yes to

- **Field:** foundation models for decentralized swarm-controller synthesis.
- **First scientific question:** can a coding model turn a global objective into one robust local controller?
- **Application narrative:** robust exploration/search in unknown environments.
- **Primary partner:** Volker Strobel + Marco Dorigo / IRIDIA.
- **Secondary partner:** Shiyu Zhao / GenSwarm.
- **Methodology partner:** Amanda Prorok.
- **Competitive distinction:** offline white-box code synthesis, not an LLM call for every agent action.
- **Product advantage:** deterministic, cheap, inspectable, and visually compelling.

### What to say no to for now

- a generic maze competition presented as new coordination research;
- a warehouse MAPF clone;
- Minecraft as the first substrate;
- claiming strict decentralization while retaining a free global blackboard;
- claiming model comparisons without standardized attempt budgets;
- adding many scenario types before one task has a partner-backed metric.

### The strongest formulation

> **The challenge is not “can ants cover a maze?” It is “can an AI engineer a reliable society from one local rule?”**

---

## 12. Primary-source reading list

### Read first

1. Strobel, Dorigo, Fritz (2026), **How foundation models will revolutionize robot swarms** — the core strategic thesis and exact micro–macro validation hook. [Author manuscript](https://iridia.ulb.ac.be/~vstrobel/articles/StrDorFri2026scirob.pdf)
2. Strobel, Dorigo, Fritz (2024), **LLM2Swarm** — the closest research implementation. [Paper](https://arxiv.org/abs/2410.11387) · [Code](https://github.com/Pold87/LLM2Swarm)
3. Ji et al. (2026), **GenSwarm** — natural-language-to-white-box-policy deployment in simulation and on robots. [Paper](https://www.nature.com/articles/s44182-025-00065-w) · [Code](https://github.com/WindyLab/GenSwarm)
4. Ruan et al. (2025), **SwarmBench** — the closest existing LLM swarm benchmark and the main differentiation requirement. [Paper](https://arxiv.org/abs/2505.04364) · [Code](https://github.com/RUC-GSAI/YuLan-SwarmIntell)
5. Tessera et al. (2026), **Alem** — evidence that coordination is a distinct bottleneck from individual competence. [Paper](https://arxiv.org/abs/2606.08340) · [Code](https://github.com/alem-world/alem-env)

### Benchmark and simulator methodology

6. Bettini et al. (2022), **VMAS** — fast vectorized multi-agent simulation. [Paper](https://arxiv.org/abs/2207.03530) · [Code](https://github.com/proroklab/VectorizedMultiAgentSimulator)
7. Bettini et al. (2024), **BenchMARL** — standardized MARL benchmarking. [JMLR](https://www.jmlr.org/papers/v25/23-1612.html)
8. Rutherford et al. (2024), **JaxMARL** — accelerated multi-agent evaluation and SMAX. [Paper](https://arxiv.org/abs/2311.10090) · [Code](https://github.com/FLAIROx/JaxMARL)
9. Leibo et al. (2021), **Melting Pot** — generalization to novel social situations. [PMLR](https://proceedings.mlr.press/v139/leibo21a.html)
10. **ARGoS** — established large-scale swarm simulator used by IRIDIA work. [Official project](https://www.argos-sim.info/)

### Shared policies, diversity, and decentralized control

11. Qin et al. (2025), **GradPS** — identical parameter sharing versus behavioral diversity. [PMLR](https://proceedings.mlr.press/v267/qin25c.html)
12. Christianos et al. (2021), **Selective Parameter Sharing**. [PMLR](https://proceedings.mlr.press/v139/christianos21a.html)
13. Bettini et al. (2023), **DiCo: Controlling Behavioral Diversity**. [OpenReview](https://openreview.net/forum?id=qQjUgItPq4)
14. Prorok Lab (2026), **When Is Diversity Rewarded in Cooperative Multi-Agent Learning?** [OpenReview](https://openreview.net/forum?id=uJCGMBO6Qx)
15. Li et al. (2019), **Graph neural networks for decentralized multi-robot path planning**. [arXiv](https://arxiv.org/abs/1912.06095)

### Real-world problem anchors

16. **DARPA Subterranean Challenge** — autonomy, perception, networking, and mobility in tunnel, urban, and cave environments. [Official program](https://www.darpa.mil/research/programs/darpa-subterranean-challenge)
17. **RoboCup Rescue Robot League** — objective evaluation for hazardous response scenarios. [League overview](https://rrl.robocup.org/league-overview/)
18. **NASA Swarmathon** — teams wrote autonomous search/foraging algorithms for robot swarms. [NASA](https://www.nasa.gov/learning-resources/stem-engagement-at-nasa/students-develop-robotic-code-in-first-swarmathon-challenge/)
19. **League of Robot Runners 2026** — large-fleet planning, scheduling, and robust execution under delay. [Official challenge](https://www.leagueofrobotrunners.org/)
20. **Robotarium** — remotely accessible multi-robot physical testbed. [Official project](https://www.robotarium.gatech.edu/)

### Evidence quality note

This brief prioritizes papers, official project repositories, university profiles, and official challenge sites. The newest 2026 works should still be treated as early evidence: several are viewpoints, preprints, or first-generation systems rather than settled consensus. The central recommendation is therefore a partner-backed pilot and benchmark paper, not an immediate claim that the research problem has already been solved.
