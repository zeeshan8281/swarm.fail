# Agentic coordination research landscape for swarm.fail

**Research date:** 13 August 2026

**Decision this brief supports:** Which research question, launch-grade mission or artifact owner, benchmark design, and academic co-anchor could turn swarm.fail from a good interactive demo into a legitimate technical challenge?

## Executive recommendation

Do **not** launch this as a generic “make agents explore random mazes” contest. That is a playable artifact, but it is not yet a defensible research contribution.

Launch it as a benchmark for this question:

> **Can a frontier coding model synthesize one compact, decentralized controller whose local rules produce robust swarm-level behavior in environments it has never seen?**

This is unusually well timed. In April 2026, Volker Strobel, Marco Dorigo, and Mario Fritz argued in *Science Robotics* that foundation models can act as **swarm designers**: translating a desired collective behavior into code for individual robot controllers. They identify validation of the resulting collective behavior—the classic **micro–macro link problem**—as a central difficulty. That validation loop is almost exactly what swarm.fail can become: a model writes microscopic code; the simulator measures whether reliable macroscopic behavior emerges. ([paper](https://iridia.ulb.ac.be/~vstrobel/articles/StrDorFri2026scirob.pdf), [journal record](https://pubmed.ncbi.nlm.nih.gov/42054475/))

Use a launch-grade coalition, matching the pattern behind Yukon’s previous challenges:

- **Mission/problem owner:** pursue **NASA JPL/Caltech’s CADRE team** first. CADRE is a 2026 lunar technology demonstration in which three rovers autonomously cooperate, map the lunar surface and subsurface, and take distributed measurements. It is a field-defining artifact with a public mission, not merely a company use case. ([JPL mission](https://www.jpl.nasa.gov/missions/cadre/), [CADRE autonomy](https://ai.jpl.nasa.gov/public/projects/cadre/))
- **Academic legitimacy:** pair the mission owner with **Stanford’s CHORUS researchers** or **Volker Strobel and Marco Dorigo at IRIDIA/ULB**. CHORUS is the most recent one-shared-policy, decentralized heterogeneous-robot result; IRIDIA supplies the foundational swarm authority and the exact foundation-model-as-swarm-designer thesis. ([CHORUS](https://arxiv.org/abs/2606.12352), [LLM2Swarm](https://arxiv.org/abs/2410.11387))
- **Yukon’s role:** turn one real CADRE-class failure mode into the open verifier, hidden scenario suite, agent interface, leaderboard, and replay.

The serious industry alternatives are **Amazon Robotics** and **Shield AI**. Amazon owns the largest visible multi-robot coordination problem and published DeepFleet, but already sponsors the League of Robot Runners. Shield AI owns communication-denied multi-agent autonomy, but an open partnership faces defence and disclosure constraints. ([DeepFleet](https://arxiv.org/abs/2508.08574), [Hivemind](https://shield.ai/hivemind/))

An additional research collaborator is **Prof. Shiyu Zhao at Westlake University**, corresponding author of GenSwarm. GenSwarm turns natural-language instructions into white-box multi-robot code policies and deploys them in simulation and on real robots. It is valuable as a baseline and evaluation collaborator, but does not replace the launch anchor. ([GenSwarm](https://www.nature.com/articles/s44182-025-00065-w), [code](https://github.com/WindyLab/GenSwarm), [profile](https://www.shiyuzhao.net/))

The methodology target is **Prof. Amanda Prorok at Cambridge**: strict decentralization, learned communication, behavioral diversity, robustness, scaling, and a path from simulation to physical teams. ([profile](https://www.proroklab.org/people/amanda-prorok/), [decentralized coordination program](https://www.proroklab.org/research/decentralized-coordination/), [VMAS](https://arxiv.org/abs/2207.03530))

The recommended first challenge is **Autonomous Lunar Teams**: a coding model must generate a compact controller for cooperative exploration, mapping, and synchronized sensing across hidden lunar terrains while communication, energy, time, and rover availability vary. This remains a simulator challenge, but the constraints come from a top-tier mission program rather than a generic maze or a small commercial operator.

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

## Scope and method

This pass answers four questions:

1. What changed in swarm and multi-agent research from 2024 through 13 August 2026?
2. Which companies operate genuine multi-robot systems, and what concrete coordination problem do they own?
3. Which problems can become an open, objective, visually legible coding-agent challenge?
4. Who should Yukon contact first for academic legitimacy and commercial relevance?

Sources were included when they were a primary paper, official repository, official university/challenge page, official company product or deployment page, or a public regulatory/program record. Company performance claims are labeled as company-reported unless independently supported. Search-result snippets, generic listicles, and unsupported “largest/first/true swarm” claims were not used as proof.

Evidence labels used in the audit:

- **High:** peer-reviewed paper, official challenge/program, source code, or clearly verifiable deployment/regulatory record;
- **Medium:** preprint or detailed official company technical/deployment claim;
- **Low:** marketing claim without enough public technical or independent evidence. Low-confidence items are not used to drive the recommendation.

---

## The Yukon precedent: what qualifies as a launch partner

The earlier version of this brief studied the technical format of Yukon’s challenges but failed to apply their **institutional bar**. That was the central strategic error.

| Challenge | Launch-grade anchor | Exact artifact/frontier being improved | Why the partnership matters |
|---|---|---|---|
| **ECDSA.fail** | Eigen Labs, with Google Quantum AI’s published result as the frontier to beat | Quantum circuit construction for attacking ECDSA | Even without an external co-brand, the organizer is a major cryptography institution and the target is a Google frontier baseline. The homepage reports the open field surpassed that withheld benchmark. ([ECDSA.fail](https://ecdsa.fail/), [Yukon case study](https://www.yukon.org/)) |
| **OpenFrontierCS** | UC Berkeley and Princeton researchers; ICML 2026 paper | Open-ended, continuously scored computer-science research problems | The benchmark arrives with top universities, a research paper, and an existing problem suite—not a vertical customer looking for optimization. ([repository](https://github.com/FrontierCS/Frontier-CS), [Berkeley](https://sky.cs.berkeley.edu/news/frontier-cs-goes-live-2000-humans-vs-ai-on-an-open-ended-problem/)) |
| **MLX.fast** | Poolside | Poolside’s Laguna XS 2.1 inference runtime on Apple Silicon | The challenge directly improves the partner’s flagship open model and produces code the partner can adopt. ([challenge](https://www.yukon.org/mlxfast), [repository](https://github.com/Layr-Labs/mlxfast-challenge)) |
| **SNARK.fast / Flock** | Ethereum Foundation, Succinct, and Espresso | Flock, Succinct’s post-quantum proving system for Ethereum | Three field-defining organizations contribute protocol legitimacy, a real prover, and ecosystem distribution. ([challenge](https://www.yukon.org/flock)) |
| **Lighter.fast** | Lighter | Throughput of Lighter’s production zk prover | The asset owner is the partner and verified improvements can flow into a high-value live system. ([challenge](https://www.yukon.org/lighter)) |

The repeatable formula is:

```text
top-tier artifact or mission owner
        +
recognized research authority or frontier baseline
        +
one exact, verifiable bottleneck
        +
Yukon solver network and public progress trail
```

A company does not qualify merely because it operates multiple robots. A launch anchor must contribute at least three of these: **field-wide legitimacy, a frontier artifact, adoption path, distribution, proprietary problem knowledge, or a benchmark result that matters beyond the company**.

That disqualifies SwarmFarm, Burro, Eagle Ray, and Percepto as primary launch partners. They may validate applications later, but they cannot play the role that Poolside, Ethereum Foundation, Lighter, Berkeley/Princeton, or Google’s frontier baseline played in prior challenges.

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

### 2.5 What changed in the 2025–2026 literature

This is the recent-paper scan, not a historical survey.

| Work | Date/status | What it contributes | Consequence for swarm.fail |
|---|---|---|---|
| **LLM2Swarm** | 2024 preprint, active code | LLM-generated controllers plus validation in a canonical swarm stack | Treat controller synthesis as established early work; own independent, held-out evaluation |
| **GenSwarm** | 2025 article, published 2026 | Natural-language-to-white-box policies tested in simulation and on robots | White-box code and physical transfer are plausible; compare generalization, not a single demo |
| **Online automatic code generation for robot swarms** | 2025 preprint | Generates replacement code when a swarm gets stuck; six real robots and larger simulations | Add failure-triggered adaptation only as a later track; the first benchmark should keep one fixed controller ([paper](https://arxiv.org/abs/2510.04774)) |
| **SwarmBench** | 2025 preprint | Online LLM agents across five canonical swarm tasks | Direct overlap warning: differentiate on offline coding models, deterministic execution, and code budgets |
| **GradPS** | ICML 2025 | Learns when agents should share parameters rather than forcing identical behavior | One-policy versus bounded-role tracks are scientifically grounded |
| **Alem** | June 2026 preprint | Procedural long-horizon environment; low scores and strong communication ablation | Coordination is a separate capability; hidden procedural evaluation matters |
| **CHORUS** | June 2026 preprint | One shared VLA policy across heterogeneous robot bodies with local observation | Shared policies need not imply identical behavior; embodiment and observation can induce roles |
| **MECoBench** | June 2026 preprint | Measures embodied collaboration under coordination complexity and communication perturbations | Add coordination-complexity and communication axes rather than more decorative map types |
| **Mosaic** | July 2026 preprint | Diagnoses shared-state and redundant/conflicting-action failures | Publish failure replays and a coordination-tax card, not only completion scores |
| **TeamBench / CooperBench** | 2026 preprints | Controlled evaluation of role-separated language and coding-agent teams | Useful model-evaluation methodology, but not substitutes for embodied control |
| **When Is Diversity Rewarded?** | ICLR 2026 | Formal/empirical conditions under which agent diversity helps | Make diversity an experimentally priced resource, not an assumption |
| **MARS Challenge** | NeurIPS 2025 workshop challenge | Multi-agent robotic planning and control benchmark | Evidence of active competition demand; avoid claiming the category is empty ([paper](https://arxiv.org/abs/2601.18733)) |
| **ISRO Robotics Challenge 2026** | 2026 official challenge | Swarm expedition without external navigation infrastructure | Confirms interest in autonomous exploration under denied infrastructure ([challenge](https://www.ursc.gov.in/IRoC-U2026/challenge.jsp)) |

The literature does **not** say that “swarms are solved.” It says individual ingredients now work in demonstrations, while robust evaluation across unseen environments, communication constraints, heterogeneous teams, and failure remains open. That is the benchmark opportunity.

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

## 4. What the company research actually says

### 4.1 “Swarm company” is not one category

The market scan becomes misleading unless companies are separated by architecture rather than branding.

| Category | How decisions are made | Representative companies | What swarm.fail can learn |
|---|---|---|---|
| **Decentralized physical swarm** | Each vehicle acts from local state and peer messages; the group should survive lost links or members | Palladyne AI, Shield AI, Eagle Ray Robotics, SwarmFarm in some workflows | Closest scientific match: local policy, bounded communication, failure recovery |
| **Centrally orchestrated fleet** | A fleet manager assigns tasks/routes and maintains global state | Amazon Robotics, Ocado, Locus, Exotec, Symbotic, Percepto | Real industrial pain, but call it fleet coordination rather than decentralized swarm intelligence |
| **Heterogeneous embodied team** | Different robot types share missions, roles, or data | Anduril, Auterion, Helsing, Energy Robotics | Strong interoperability and dynamic-role problem; difficult public data and integration |
| **Software-agent orchestration** | Language/coding agents exchange messages and invoke tools | CrewAI, LangGraph, Swarms.ai, AutoGen | Possible model/harness sponsors; not owners of a physical coordination problem |
| **Unverified swarm branding** | Public copy makes scale claims without enough technical or deployment evidence | Several early drone and robotics vendors | Watchlist only; do not build a challenge thesis on company claims alone |

“True swarm” is not automatically better. A central controller can be correct for a warehouse with reliable networking. The research distinction is whether the challenge tests **decentralized emergence**, **fleet optimization**, or **multi-vendor orchestration**. The current product and the strongest papers point to the first.

### 4.2 The recurring problems across industries

Across official product pages, research papers, and deployed challenge programs, ten bottlenecks repeat:

1. **Task and role allocation:** who covers which region or handles which target without duplicated work?
2. **Limited communication:** what happens when bandwidth, range, latency, or packet loss prevents a global view?
3. **Heterogeneous interoperability:** how do vehicles from different vendors with different capabilities coordinate?
4. **Failure recovery:** can the mission continue when a robot, sensor, link, or planner fails?
5. **Collision, congestion, and deadlock:** do locally sensible movements create group-level blockage?
6. **One-human-to-many supervision:** how can one operator express intent without micromanaging every vehicle?
7. **Generalization:** does a controller survive a new layout, terrain, weather condition, or team size?
8. **Assurance:** how do we verify an emergent collective behavior before physical deployment?
9. **Edge budgets:** can the behavior run within energy, compute, sensing, and communication limits?
10. **Coordination tax:** how many messages, duplicate actions, delays, or conflicts are spent on teamwork itself?

Recent evidence reinforces this list. **MECoBench** finds that gains from collaboration depend on coordination complexity and that communication is a key variable. **Mosaic** traces failures to partial shared-state tracking and redundant or conflicting actions. **CHORUS** studies a single shared vision-language-action policy controlling heterogeneous robots using only local observations. **When Is Diversity Rewarded?** asks when heterogeneous policies actually help rather than add complexity. ([MECoBench](https://arxiv.org/abs/2606.31966), [Mosaic](https://arxiv.org/abs/2607.09603), [CHORUS](https://arxiv.org/abs/2606.12352), [Prorok Lab](https://www.proroklab.org/publications/iclr2026-diversity-rewarded/))

### 4.3 Application-company landscape by sector

The rows below remain useful for understanding commercial applications. They are **not** a launch-partner shortlist. The earlier report conflated domain fit with institutional legitimacy.

#### Agriculture and outdoor autonomy

| Company | Public evidence | Actual coordination problem | Challenge fit |
|---|---|---|---|
| **SwarmFarm Robotics** | Commercial field robots can work alone or cooperatively; the company explicitly invites partners and reports more than 5.1 million commercially farmed acres and 220,000 operating hours. These figures are company-reported. ([media](https://www.swarmfarm.com/media/), [journey](https://www.swarmfarm.com/journey/), [applications](https://www.swarmfarm.com/applications/)) | Coverage and treatment allocation across large fields; coordinating vehicles under changing field conditions; recovering when one unit cannot complete an area. The exact benchmark formulation is our inference from the deployment model. | Useful downstream application validator; **not a launch-grade legitimacy partner**. |
| **Burro** | Burro reports a large deployed outdoor fleet; robots compute locally, can share a learned route, and are managed through Burro Operating System Software. ([company](https://burro.ai/), [robot](https://burro.ai/burro/), [BOSS](https://burro.ai/boss/)) | Outdoor material movement, human-adaptive routing, docking/charging, and scheduling many robots around workers. | Credible application example; not a launch-grade anchor. |

**Verdict:** agriculture is an understandable later case study, not the field-defining wedge for launch.

#### Underwater and maritime autonomy

| Company / program | Public evidence | Actual coordination problem | Challenge fit |
|---|---|---|---|
| **Eagle Ray Robotics** | Positions hardware-agnostic underwater vehicles as a coordinated sensing network; its architecture runs on each asset and is designed for low-bandwidth acoustic links. The company was founded in 2023, so these remain emerging-company claims. ([official site](https://www.eaglerayrobotics.com/), [technology](https://www.eaglerayrobotics.com/technology)) | Distributed sensing, sparse acoustic communication, uncertain localization, heterogeneous vehicles, and reconnecting partial maps. | Sharp research example, but insufficient institutional weight for launch. |
| **Sedna Robotics** | Develops fleets of low-cost autonomous ocean robots intended to work alone or in groups. ([official site](https://sednarobotics.com/)) | Persistent ocean monitoring, mission allocation, energy-aware coverage, recovery, and sparse communications. | Good mission story; public evidence of sophisticated group coordination is still limited. |
| **European Defence Agency SABUVIS II** | A 2026 program for mixed underwater swarms cites bandwidth, latency, environmental unpredictability, and interoperability as core constraints. ([EDA](https://eda.europa.eu/news-and-events/news/2026/02/17/eda-project-develops-technology-for-underwater-drones-to-move-in-swarms)) | This is independent evidence that the underwater constraints are real, not just startup marketing. | Useful research anchor, but defence sponsorship adds procurement and policy friction. |

**Verdict:** underwater coordination has a clean scientific rationale, but the companies found do not clear the institutional bar for the first launch.

#### Warehousing and logistics

| Company | Public evidence | Actual coordination problem | Challenge fit |
|---|---|---|---|
| **Amazon Robotics** | DeepFleet is a suite of fleet foundation models trained on large-scale robot movement data; Amazon also sponsors the League of Robot Runners challenge. ([paper](https://arxiv.org/abs/2508.08574), [Amazon Science](https://www.amazon.science/blog/amazon-builds-first-foundation-model-for-multirobot-coordination), [League](https://www.leagueofrobotrunners.org/)) | Lifelong task scheduling, path planning, traffic, delays, and congestion at huge scale. | Excellent proof that challenge-backed legitimacy works; **poor first target because the public niche is already occupied**. |
| **Ocado** | Describes thousands of grid robots communicating frequently in difficult radio environments and, in 2026, an AMR offering spanning thousands of robots and many sites. ([robot evolution](https://www.ocadogroup.com/newsroom/stories/engineering-the-future-the-evolution-of-ocados-fulfilment-robots), [AMR systems](https://www.ocadogroup.com/newsroom/stories/introducing-ocados-amr-solutions)) | Wireless reliability, queueing, congestion, fulfillment sequencing, and layout-specific optimization. | Real owner, spectacular artifact, but algorithms and operational data are highly proprietary. |
| **Locus Robotics** | LocusONE manages heterogeneous fleets and advertises support for more than 1,000 robots at a site. ([LocusONE](https://locusrobotics.com/locusone)) | Work allocation across robot types and workflows while people share the floor. | Plausible future partner; centrally orchestrated and less differentiated from existing fleet benchmarks. |
| **Exotec** | SkyPod and Deepsky coordinate high-throughput storage robots; 2026 Decathlon deployments plan roughly 150–200 robots per site. ([SkyPod](https://www.exotec.com/news/exotec-launches-next-generation-of-skypod-system-an-all-in-one-robot-based-as-rs-that-addresses-the-majority-of-processes-within-a-warehouse/), [Decathlon](https://www.exotec.com/en-gb/news/decathlon-automates-seven-sites-with-exotec-skyfleet-program/)) | Storage/retrieval scheduling, workstation flow, congestion, and expansion to new layouts. | Commercially real, but not an open decentralized-swarm question. |
| **Symbotic** | Operates AI-coordinated autonomous warehouse robot systems at industrial scale. ([official site](https://www.symbotic.com/)) | End-to-end routing, sequencing, packing, and reliability. | Credible reference, unlikely early open partner. |

**Verdict:** do not pitch swarm.fail as a warehouse challenge. Cite the sector as evidence of economic value and copy its benchmark discipline, especially hidden execution delays, but do not clone it.

#### Inspection and industrial operations

| Company | Public evidence | Actual coordination problem | Challenge fit |
|---|---|---|---|
| **Percepto** | Reports FAA authorization for one operator to remotely manage up to 30 autonomous drone systems; AIM manages remote inspection fleets. ([FAA announcement](https://percepto.co/percepto-receives-significant-faa-approval-to-remotely-operate-full-drone-fleet-by-one-operator/), [AIM](https://percepto.co/aim/)) | Inspection coverage, priority replanning, exception handling, and one-to-many supervision across sites. | **Strong later problem owner.** The mission is legible, but coordination is mostly centralized fleet management. |
| **Energy Robotics / ANYbotics** | Energy Robotics offers hardware-agnostic management of heterogeneous robots and drones; ANYbotics deploys autonomous industrial inspection robots. ([Energy Robotics](https://www.energy-robotics.com/de/ki-software), [partnership](https://www.anybotics.com/news/anybotics-energy-robotics-partnership-achema-2024/)) | Multi-vendor mission scheduling, data fusion, handoffs, charging, and failure recovery in hazardous plants. | Strong interoperability story; public simulation assets and openness are unclear. |

**Verdict:** this sector supports a future **heterogeneous interoperability** challenge more than the first shared-controller challenge.

#### Defence and contested autonomy

This sector contains the clearest technical claims and the hardest partnership barriers. It should inform non-kinetic resilience tests, not determine the first challenge.

| Company | Public evidence | Actual coordination problem | Challenge fit |
|---|---|---|---|
| **Shield AI / Hivemind** | Hivemind describes coordinated teams operating without GPS or reliable communications; public demonstrations include multi-aircraft teaming. ([Hivemind](https://shield.ai/hivemind/), [swarming demo](https://shield.ai/hivemind-for-operational-read-and-react-swarming/)) | Communication-denied autonomy, composable behaviors, dynamic team decisions, and human command. | Exact technical relevance; low likelihood of an open first partnership and high safety/IP constraints. |
| **Anduril / Lattice** | Mission Autonomy teams heterogeneous systems under human command; a SOCOM contract covers integration, test, validation, and deployment. ([product](https://www.anduril.com/lattice/mission-autonomy), [program](https://www.anduril.com/article/special-operations-command-selects-anduril-as-mission-autonomy-systems-integration-partner/)) | Interoperability plus verification and validation across many vendors and domains. | Important evidence for the assurance problem; too closed and defence-specific for the first public challenge. |
| **Auterion / Nemyx** | Nemyx coordinates cross-manufacturer drone fleets through a resilient network and dynamic prioritization; Auterion raised a reported $130 million Series B in 2025. ([Nemyx](https://auterion.com/product/nemyx/), [launch](https://auterion.com/auterion-launches-nemyx-enabling-fully-coordinated-drone-swarms/), [financing](https://auterion.com/auterion-raises-130-million-series-b-as-their-ai-enabled-software-powering-low-cost-commercial-hardware-at-scale-transforms-warfare/)) | Vendor-neutral interoperability, lost links, dynamic task allocation, and reduced operator load. | Strong evidence of market demand; partnership and benchmark data would be sensitive. |
| **Palladyne AI / SwarmOS** | SwarmOS claims decentralized coordination, feature-based communication, dynamic roles, and heterogeneous teams; the company reported a 2026 U.S. Army exercise deployment. ([SwarmOS](https://www.palladyneai.com/products/ai-software/swarmos/), [deployment](https://www.palladyneai.com/press-releases/palladyne-ai-deploys-true-autonomy-drone-swarming-software-swarmos-during-u-s-army-4th-infantry-division-ivy-mass-exercise/)) | Bandwidth-efficient perception sharing, distributed roles, mixed platforms, and resilience. | Direct scientific match, but evidence is primarily company-reported and the domain is sensitive. |
| **Helsing / Altra** | Helsing markets swarm-compatible HX-2 systems and Altra software for one-operator control in contested environments, alongside a technical assurance agenda. ([HX-2](https://helsing.ai/hx-2), [Altra](https://helsing.ai/altra), [assurance paper](https://helsing.ai/assets/download/55c619c900d22049e894ea288be49bee0533eb9e.pdf)) | Assuring software-defined, heterogeneous systems whose collective behavior changes dynamically. | The **assurance** framing is highly relevant; use it as methodology, not the initial application vertical. |
| **Swarm Aero / Swarmbotics AI** | Both publish direct claims about multi-system autonomy; Swarm Aero reports one-operator heterogeneous exercises and Swarmbotics develops teams of ground robots. ([Swarm Aero](https://www.swarm.aero/), [exercise](https://www.swarm.aero/news-release/swarm-aeros-command-and-control-software-successfully-completes-manned-unmanned-teaming-exercises-at-u-s-navy-fleet-experimentation-flex-2026), [Swarmbotics](https://www.swarmbotics.ai/)) | Scaling human supervision and coordinating mixed vehicles or low-cost ground teams. | More approachable than defence primes, but still sensitive and dependent on company-reported validation. |

### 4.4 Software-agent “swarm” companies are adjacent, not problem owners

**CrewAI**, **LangGraph**, **Swarms.ai**, and **Microsoft AutoGen** coordinate language or coding agents. They matter because they can supply agent harnesses, model comparisons, or sponsorship, but they do not give a physical swarm challenge domain legitimacy. ([CrewAI](https://crewai.com/), [LangGraph](https://www.langchain.com/langgraph), [Swarms.ai](https://www.swarms.ai/products), [AutoGen](https://www.microsoft.com/en-us/research/uploads/prod/2025/01/WEF-2025_Leave-Behind_AutoGen.pdf))

The relevant opportunity is to let these systems compete as **controller designers** under a fixed budget. Do not turn swarm.fail into another chat-agent framework benchmark.

### 4.5 Launch-grade anchor shortlist

| Rank | Anchor configuration | Field-defining asset | Why it clears the Yukon bar | Main risk |
|---:|---|---|---|---|
| **1** | **NASA JPL/Caltech CADRE + Stanford CHORUS or IRIDIA** | A 2026 lunar mission with three cooperative autonomous rovers; recent shared-policy and swarm-design research | Global institution, real flight artifact, exact multi-agent problem, public mission narrative, research publication path, exceptional hero artifact | Government timelines and partnership process |
| **2** | **Amazon Robotics + IRIDIA or Cambridge Prorok Lab** | DeepFleet plus the world’s largest visible deployed robot-fleet learning problem | Tier-one industrial owner, foundation-model relevance, massive real data, direct adoption path | Amazon already sponsors League of Robot Runners; the proposed task must be clearly different |
| **3** | **Shield AI Hivemind + Stanford or IRIDIA** | Communication-denied multi-agent autonomy and composable swarm behaviors | Premier domain company, exact resilience problem, major technical credibility and distribution | Defence sensitivity, export controls, disclosure, and open-data constraints |
| **4** | **Stanford CHORUS + IRIDIA**, without a mission owner | One shared policy for decentralized heterogeneous teams plus foundation models as swarm designers | A top university and the foundational swarm lab can create Berkeley/Princeton-style academic legitimacy | Weaker adoption story unless a mission or platform owner joins |

**NVIDIA Robotics** could be a platform/compute sponsor, but is not enough as the sole anchor unless the task improves a specific NVIDIA artifact that the company intends to adopt.

The outreach message should say:

> We want to turn one open problem in your flagship multi-agent program into a public autoresearch challenge. Your team owns the problem definition and adoption path; the academic co-chair owns methodology; Yukon owns the verifier, solver network, leaderboard, and public progress record.

---

## 5. What the current repository gets right

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

## 6. What an academic reviewer will challenge

These are not cosmetic issues. They determine what the benchmark can honestly claim.

### 6.1 The current “local/decentralized” claim is too strong

In the [current engine](../lib/engine.mjs), every agent receives global coordinates (`a.x`, `a.y`) and access to `env.shared`, one global object that every agent can read and write. Agents are evaluated in fixed ID order, so higher-ID agents can see writes made by lower-ID agents during the same tick.

That is a **global blackboard with serial update semantics**, not strict local-only decentralized coordination. It is a valid practical architecture, but it must be named accurately.

**Recommendation:** create two explicit tracks:

- **Local-only:** local sensing, bounded local messages/trails, no global blackboard, no perfect global coordinates;
- **Shared-memory:** keep `env.shared` as a practical networked-team track.

The local-only track is the scientific core. The shared-memory track is still valuable as an ablation: how much does global communication buy?

### 6.2 The maps are public and fixed

All 12 seeds are public. This is excellent for exact local reproduction, but it allows direct specialization to the test set.

**Recommendation:** retain public development seeds, but score final submissions on private seeds sampled from versioned generators. Reveal those seeds after the competition. This preserves post-hoc reproducibility without allowing test-set tuning during the event.

### 6.3 The benchmark does not yet measure coding-model ability fairly

The current leaderboard permits humans and any model, with unlimited prompts, test runs, and manual edits. It measures the best policy a contestant eventually produces—not the capability of a model or coding agent.

**Recommendation:** separate two leaderboards:

1. **Open optimization:** humans and agents can iterate freely; best controller wins.
2. **Model benchmark:** fixed task prompt, tool access, wall-clock/token budget, number of attempts, and no human edits. Report model version, harness version, cost, and success distribution across repeated runs.

Without this separation, claims such as “Model X is better at coordination” would not be supported.

### 6.4 The score hides important behavior

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

### 6.5 The stated floor is not currently a strict lower bound

The README calls 931 a “provable floor,” but agents spawn across the open map and their initial cells count as covered before any step. Those cells are therefore free under an `agents × steps` score. The repository’s own [references](../REFERENCES.md) acknowledge this slack.

**Recommendation:** call 931 a **cell-count reference** in the current arena, not a provable bound. For a true work bound, charge initial placements or subtract them consistently in the derivation.

### 6.6 Other simulator artifacts need explicit treatment

- Multiple agents may occupy the same cell; there is no physical collision model.
- All maps are 40×40; scale generalization is not tested.
- Agents spawn throughout the map, which weakens the “unknown-world exploration” interpretation.
- IDs and exact swarm size allow deterministic role assignment even though the policy code is shared.
- `env.here` is effectively tautological in the current loop because the cell an agent occupies has already been marked covered.
- A source-size and wall-clock limit exists, but there is no cross-hardware instruction/compute budget for policy complexity.

None of these invalidate the prototype. They mean the first academic design session should define the benchmark’s threat model and claims before more UI work.

---

## 7. Candidate challenge directions

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

## 8. Recommended challenge: Autonomous Lunar Teams

The Yukon precedent changes the recommendation from a broad commercial use case to a mission-anchored research challenge.

### Public challenge brief

> Write one compact controller that lets a team of lunar rovers cooperatively explore, map, and take synchronized measurements in unknown terrain. During hidden tests, communications degrade, energy and time are limited, paths become unsafe, and rovers may become unavailable.

This is a simulator challenge inspired by NASA JPL’s CADRE mission, not a claim to reproduce flight software. CADRE’s public autonomy stack includes leader election, work division, hazard-free paths, map construction, formation driving, and synchronized ground-penetrating-radar measurements. ([JPL AI project](https://ai.jpl.nasa.gov/public/projects/cadre/), [AAMAS 2025 paper](https://ai.jpl.nasa.gov/public/documents/papers/rabideau-aamas2025-cadre.pdf))

### Why this version is strategically stronger

- **Mission-specific:** the constraints come from a real NASA/Caltech multi-rover program scheduled for a 2026 lunar demonstration.
- **Academically current:** it operationalizes multi-agent planning, micro–macro validation, bounded communication, failure recovery, shared-policy limitations, and diversity.
- **Compatible with the repo:** exploration, one-file policies, deterministic replay, and terrain generation already exist.
- **Hard to fake with visuals:** hidden link failures, agent failures, and unseen topologies expose brittle policies.
- **Easy to explain:** “Can an AI write the rules for a rover team to explore the Moon without waiting for Earth?”

### Hidden scenario families

| Family | What changes | Capability exposed |
|---|---|---|
| Lunar terrain | craters, ridges, rocks, slopes, bottlenecks, and occluded regions | spatial generalization and hazard-aware planning |
| Mesh degradation | range limits, packet loss, delay, and temporary blackout | dependence on global coordination |
| Rover unavailability | mobility, sensor, or full-rover dropout at unknown times | graceful degradation and reallocation |
| Distributed sensing | measurements must be taken at coordinated locations and times | formation, role allocation, and synchronization |
| Resource window | varying energy, compute, and mission-time budgets | useful science per constrained resource |
| Scale shift | team and terrain sizes outside public examples | whether local rules actually scale |

### Scorecard

Mission success is a gate. Among successful runs, publish a Pareto card before collapsing it into one leaderboard score:

- mapped area, map quality, and required measurement completion;
- completion time and exploration efficiency;
- distance/energy spent;
- messages and bytes transmitted;
- collisions, deadlocks, and unsafe proximity;
- performance retained after link loss or agent failure;
- public-to-private generalization gap;
- controller source size and runtime budget.

### Tracks

1. **One shared local policy:** the scientific core; no perfect global map.
2. **Bounded mesh:** same policy with an explicit communication budget and link model.
3. **Bounded roles:** up to `K` controllers or a small per-rover role vector, priced in the score.
4. **Model designer:** coding models receive identical prompts, tools, tokens, wall time, retries, and no human edits.

### Hero artifact

The landing-page replay should show a successful policy and a brittle baseline crossing the same lunar terrain. At a visible moment, the mesh drops and one rover becomes unavailable. The viewer immediately sees whether the team reallocates, preserves the synchronized measurement, duplicates work, freezes, or enters hazardous terrain. A small timeline shows mapped area, science goals, available rovers, energy, and link events.

### Partnership boundary

Do not publish this under CADRE or NASA branding without a real agreement. The initial outreach artifact should be labeled **“CADRE-inspired concept”** and ask JPL to choose the one abstraction it considers useful: planning and scheduling, cooperative mapping, synchronized sensing, failure recovery, or communication-aware execution. The final challenge should implement the partner-selected bottleneck rather than pretending Yukon already knows NASA’s highest-value problem.

---

## 9. Recommended benchmark specification

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

## 10. Ranked academic co-anchor shortlist

### Tier 1 — contact first

| Rank | Person / lab | Why this is a direct fit | Specific ask | Public contact |
|---:|---|---|---|---|
| **1** | **Prof. Chelsea Finn + Prof. Jeannette Bohg, Stanford** | Senior authors on CHORUS, the June 2026 result most directly matching a shared decentralized policy across heterogeneous robot teams; Stanford adds launch-level institutional distribution | Ask whether a public held-out controller-synthesis and robustness challenge would complement CHORUS, and whether their group would co-chair methodology | [Finn](https://profiles.stanford.edu/chelsea-finn) · [Bohg](https://profiles.stanford.edu/jeannette-bohg) · [CHORUS](https://arxiv.org/abs/2606.12352) |
| **2** | **Dr. Volker Strobel, IRIDIA/ULB** | Corresponding author of the 2026 FM-for-swarms viewpoint; creator of LLM2Swarm; works on controller validation and secure swarms | Ask whether a CADRE-inspired controller-synthesis benchmark advances the micro–macro validation agenda and what abstractions make it publishable | [profile](https://iridia.ulb.ac.be/~vstrobel/) · `volker.strobel@ulb.be` |
| **3** | **Prof. Marco Dorigo, IRIDIA/ULB** | Foundational swarm-intelligence researcher; co-author of the exact papers; IRIDIA has deep automatic swarm-controller design history | Approach through/with Strobel; ask IRIDIA to co-design the benchmark and baseline suite, not merely endorse it | [profile](https://iridia.ulb.ac.be/~mdorigo/) · `mdorigo@ulb.ac.be` |
| **4** | **Prof. Amanda Prorok, Cambridge** | Leading work on decentralized coordination, communication, diversity, scaling, VMAS, and sim-to-real | Ask for critique of decentralization claims, metric design, and a path to physical validation | [profile](https://www.proroklab.org/people/amanda-prorok/) · `asp45@cam.ac.uk` |
| **5** | **Prof. Shiyu Zhao, WINDY Lab, Westlake** | GenSwarm already generates white-box policies from natural language and deploys them on real robots | Propose swarm.fail as an independent held-out GenSwarm-style evaluation and public challenge; ask for one canonical task and baseline | [profile](https://www.shiyuzhao.net/) · `zhaoshiyu@westlake.edu.cn` |
| **6** | **Kai Ruan / Prof. Hao Sun, Renmin University** | Authors of the closest direct benchmark, SwarmBench; their code welcomes extension and collaboration | Propose a complementary **code-policy track**, not a competing clone; compare online LLM agents against offline model-generated controllers | [Kai Ruan](https://x66ccff.github.io/) · [Hao Sun](https://ai.ruc.edu.cn/academicfaculty/szdwn/sh/index.htm) · `haosun@ruc.edu.cn` |

### Tier 2 — high-value after the thesis is sharpened

| Person / organization | Relevance | Best use |
|---|---|---|
| **Prof. Sabine Hauert, Bristol** | Swarm engineering, real-world applications, public communication, responsible deployment | Problem framing, real-world narrative, trustworthy swarm metrics. ([profile](https://hauertlab.com/sabine-hauert/)) |
| **Prof. Jakob Foerster, Oxford FLAIR** | MARL, open-ended learning, JaxMARL ecosystem | Model/MARL baselines and open-ended coordination methodology. ([lab](https://foersterlab.com/)) |
| **Prof. Stefano Albrecht, Edinburgh AARG** | Parameter sharing, ad-hoc teams, multi-agent learning, alliance-aware robot foundation models | Role diversity and heterogeneous-team track. ([2026 viewpoint](https://doi.org/10.1126/scirobotics.aea1822)) |
| **Prof. Radhika Nagpal, Princeton SSR** | Foundational self-organization and large robot collectives | Scientific advisory credibility and classical swarm baselines; less direct for ML benchmark design. ([lab](https://ssr.princeton.edu/research)) |
| **Robotarium, Georgia Tech** | Free remote access to physical multi-robot experiments; Python and MATLAB simulation-to-real flow | Final-round hardware validation once the controller API is compatible. ([official site](https://www.robotarium.gatech.edu/get-started)) |
| **League of Robot Runners organizers** | Established Amazon/AAMAS competition with robust execution under uncertainty | Learn challenge operations or create a future controller-generation exhibition track; avoid duplicating MAPF. ([official site](https://www.leagueofrobotrunners.org/)) |

### Outreach sequence

1. Send the CADRE-inspired concept to **Jean-Pierre de la Croix**, CADRE principal investigator, asking which public abstraction—if any—would be useful enough to benchmark.
2. In parallel, contact **Chelsea Finn / Jeannette Bohg** and **Volker Strobel** with two different co-anchor proposals: shared-policy robustness and micro–macro controller validation.
3. Ask **Amanda Prorok** for methodological critique once one anchor shows interest.
4. Contact **Amazon Robotics** and **Shield AI** only with tailored alternative briefs, not as generic sponsors.
5. Contact GenSwarm and SwarmBench authors later as baseline and benchmark collaborators.

Avoid a mass “please partner with us” email. Each outreach should contain one research question, a working artifact, one diagram, and a specific 30-minute ask.

---

## 11. Draft outreach email to the best-fit partner

**Subject:** Could one CADRE autonomy problem become an open autoresearch challenge?

> Hi Dr. de la Croix,
>
> I’m working with Yukon, an open autoresearch challenge platform from Eigen Labs. Previous challenges have paired a field-defining partner and artifact with a deterministic public verifier—for example Poolside’s Laguna model, Lighter’s prover, and FrontierCS from Berkeley and Princeton researchers.
>
> We have built an early interactive benchmark where a coding agent writes one compact policy and that policy is evaluated across teams of simulated agents on hidden environments. After studying CADRE’s public mission and planning work, we think the same format might be useful for one carefully abstracted cooperative-autonomy problem: exploration and mapping, communication-aware execution, task reallocation, synchronized sensing, or rover unavailability.
>
> We are **not** proposing to imitate or validate flight software, use NASA branding without agreement, or decide the research problem ourselves. We would like to ask whether there is a public abstraction from CADRE that your team believes is both scientifically useful and appropriate for an open challenge.
>
> Yukon would provide the sandboxed evaluator, coding-agent network, verified leaderboard, and interactive replays. We would also recruit an academic co-chair in decentralized multi-robot learning or swarm-controller synthesis.
>
> Would you be open to a 30-minute scoping call? I can send a two-page CADRE-inspired concept and the working simulator beforehand.
>
> Best,
>
> Zeeshan

---

## 12. Suggested 30-day path

### Week 1 — partner-ready concept, no major build

- Turn this brief into a two-page concept note.
- Record a 30–45 second replay showing one controller succeeding and failing.
- Write the exact research question and the distinction from SwarmBench, Alem, GenSwarm, and League of Robot Runners.
- Send the first outreach to the CADRE principal investigator, then approach Stanford CHORUS and IRIDIA as possible academic co-anchors.
- Prepare one-page alternatives for Amazon Robotics and Shield AI. Do not send a generic swarm deck.

### Week 2 — methodology conversations

- Conduct calls with interested researchers.
- Ask the CADRE team which abstraction would create useful open research without exposing or pretending to validate flight software.
- If JPL is not responsive, test the same anchor-level proposition with Amazon Robotics and Shield AI before considering smaller application companies.
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

## 13. Decision summary

### What to say yes to

- **Field:** foundation models for decentralized swarm-controller synthesis.
- **First scientific question:** can a coding model turn a global objective into one robust local controller that survives communication loss and member failure?
- **First challenge:** Autonomous Lunar Teams, subject to mission-owner validation.
- **Mission narrative:** cooperative lunar exploration, mapping, and synchronized sensing under communication and resource limits.
- **Primary anchor outreach:** NASA JPL/Caltech CADRE team.
- **Academic co-anchor:** Stanford CHORUS researchers or Volker Strobel + Marco Dorigo / IRIDIA.
- **Methodology partner:** Amanda Prorok.
- **Industry alternatives:** Amazon Robotics, then Shield AI.
- **Application companies:** SwarmFarm, Eagle Ray, Burro, and Percepto only as later validators—not launch anchors.
- **Competitive distinction:** offline white-box code synthesis, not an LLM call for every agent action.
- **Product advantage:** deterministic, cheap, inspectable, and visually compelling.

### What to say no to for now

- a generic maze competition presented as new coordination research;
- a small vertical company presented as the source of field-wide legitimacy;
- calling every centrally managed robot fleet a decentralized swarm;
- a warehouse MAPF clone;
- Minecraft as the first substrate;
- defence as the initial challenge vertical;
- claiming strict decentralization while retaining a free global blackboard;
- claiming model comparisons without standardized attempt budgets;
- adding many scenario types before one task has a partner-backed metric.

### The strongest formulation

> **The challenge is not “can ants cover a maze?” It is “can an AI engineer a reliable society from one local rule?”**

For a company meeting, make it concrete:

> **We turn one open bottleneck in a flagship multi-agent mission into a public autoresearch challenge. The mission owner supplies the artifact and adoption path, the research partner supplies scientific legitimacy, and Yukon supplies the verifier and solver network.**

---

## 14. Primary-source reading list

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

---

## 15. Evidence audit

This table makes the reasoning traceable. “Use” is the conclusion the source supports; it is not a verbatim claim.

| Evidence | Type | Confidence | Used for |
|---|---|---|---|
| ECDSA.fail and Yukon case study | Live challenge + organizer case study | High | A frontier institution or benchmark can serve as the legitimacy anchor; a small problem-owner company is not required |
| OpenFrontierCS repository and Berkeley announcement | Public benchmark + university publication | High | Top-university authorship, ICML research, and an existing artifact create launch legitimacy |
| MLX.fast / Flock / Lighter challenge pages and repositories | Live challenges + public code | High | Yukon partners improve the anchor organization’s actual model, protocol, or production prover |
| NASA JPL CADRE mission, AI project, and AAMAS paper | Official mission pages + primary paper | High | Tier-one mission anchor and exact cooperative-autonomy task family for outreach |
| Stanford CHORUS paper and profiles | Preprint + university profiles | Medium–High | Top-tier academic co-anchor for shared decentralized heterogeneous policies |
| Strobel, Dorigo, Fritz, *How foundation models will revolutionize robot swarms* | 2026 peer-reviewed viewpoint | High | Foundation model as swarm designer; micro–macro validation problem |
| LLM2Swarm paper and repository | Preprint + public code | High | Generated swarm controllers already have a working research lineage |
| GenSwarm paper and repository | Published article + public code | High | Natural-language-to-white-box control and simulation-to-real evidence |
| SwarmBench paper and repository | Preprint + public code | High | Closest competing benchmark; online-agent overlap to avoid |
| Alem paper and environment | 2026 preprint + public code | High | Procedural evaluation and evidence that coordination remains difficult |
| CHORUS | 2026 preprint | Medium | One shared policy can control heterogeneous embodiments from local observations |
| MECoBench | 2026 preprint | Medium | Communication and coordination complexity should be evaluation axes |
| Mosaic | 2026 preprint | Medium | Redundant/conflicting action and partial shared state are measurable failure modes |
| GradPS | ICML 2025 paper | High | Identical sharing versus adaptive specialization is an active problem |
| When Is Diversity Rewarded? | ICLR 2026 paper/project | High | Diversity should be a controlled resource rather than an assumed benefit |
| TeamBench / CooperBench | 2026 preprints | Medium | Fixed roles, budgets, and collaboration-specific evaluation for model tracks |
| League of Robot Runners | Official AAMAS/Amazon challenge | High | Warehouse fleet challenge already exists and supplies an operational model |
| Amazon DeepFleet | Official research publication/blog | High | Foundation-model fleet coordination has direct commercial value |
| SwarmFarm product/application pages | Official company evidence | Medium | Deployed cooperative agricultural robots; application validation only, not launch legitimacy |
| Burro robot/BOSS pages | Official company evidence | Medium | Deployed outdoor autonomy, local compute, route sharing, and fleet operations |
| Eagle Ray product page | Official company technical claims | Medium | Hardware fragmentation and limited submerged communication are explicit pain points |
| EDA SABUVIS II | Official public program | High | Independent confirmation of underwater bandwidth, latency, environment, and interoperability constraints |
| Ocado engineering/product pages | Official company evidence | Medium | Large-fleet radio, traffic, and site-generalization problems are operationally real |
| LocusONE / Exotec / Symbotic pages | Official company evidence | Medium | Warehouse offerings are primarily centrally orchestrated fleets |
| Percepto FAA/inspection pages | Company report of regulatory approval + product evidence | Medium | One-operator-to-many inspection is a concrete owner problem |
| Energy Robotics / ANYbotics partnership pages | Official company evidence | Medium | Heterogeneous multi-vendor inspection is a plausible later challenge |
| Shield AI / Anduril / Auterion pages | Official product and program evidence | Medium | Lost-link autonomy and heterogeneous interoperability have market demand |
| Palladyne / Helsing / Swarm Aero pages | Official company evidence | Low–Medium | Decentralization and assurance themes; claims need independent validation before partnership thesis |
| DARPA SubT, NASA Swarmathon, ISRO 2026, MARS | Official challenges/programs or associated paper | High | Unknown-world and denied-infrastructure multi-agent challenges have precedent |
| Current swarm.fail engine and documentation | Repository inspection | High | Existing product strengths, blackboard semantics, public seeds, scoring, and simulator limitations |

### Citation-audit conclusions

- The **academic recommendation** rests on papers, code, and university profiles, not secondary summaries.
- The **launch-anchor ranking** applies the institutional pattern from Yukon’s previous challenges; partnership feasibility remains an outreach hypothesis until the organizations respond.
- The **defence-company section** is deliberately high level. It demonstrates demand for resilience and interoperability; it is not a recommendation to build an operational defence benchmark.
- No company is described as a proven decentralized swarm unless its public materials expose local/peer coordination or lost-link behavior. Centralized fleets are labeled as such.
- The recommended challenge is a synthesis of recurring constraints. No source is claimed to have endorsed swarm.fail or this exact benchmark.
