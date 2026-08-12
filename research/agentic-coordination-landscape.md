# Tier-one partner and research strategy for swarm.fail

**Research cutoff:** 13 August 2026

**Decision this memo supports:** Which frontier problem should Yukon turn into a public challenge, and which Tier‑1 company/research partner should own it with us?

**Status labels:** “peer reviewed” means a published or conference-accepted paper; “preprint” and “company experiment” are labelled as such. No organization below has endorsed or agreed to partner with Yukon.

## Executive answer

The earlier farm-company direction was wrong. A farm robotics vendor may be a future user or field-test site, but it is not the kind of launch anchor established by ECDSA.fail, MLX.fast, OpenFrontierCS, Flock, or Lighter.fast.

The strongest challenge direction is:

> **Can an agent-team orchestrator turn more compute into more verified software—rather than more conflicts, duplicated work, and cost?**

The strongest first coalition to pursue is:

1. **Cursor** — frontier product/problem owner. Cursor is already running hundreds of coding agents concurrently and publicly documenting the coordination failures that constrain its product.
2. **Stanford/SAP's CooperBench team, CMU's CAID team, or Google Research + MIT** — research/evaluation authority. CooperBench is the closest open coding-conflict evaluator; CAID is the strongest recent branch-and-merge intervention; Google/MIT published the strongest 2026 peer-reviewed evidence that multi-agent gains depend on task structure and architecture.
3. **Yukon** — converts the problem into a reproducible public competition, solver workflow, leaderboard, and playable hero artifact.

The recommended working challenge is:

> **SWARM.FAIL — Agent Team Efficiency**
>
> Given the same model pool, token budget, wall-clock budget, and hidden software tasks, write the orchestration policy that produces the most verified working software.

This is a better strategic fit than a generic robot-swarm maze because it has all four ingredients visible in Yukon's prior launches:

- a frontier company that visibly owns the problem;
- a recent and defensible research gap;
- deterministic evaluation and a public improvement trail;
- a hero artifact people can watch and understand.

### Recommendation in one line

**Pitch Cursor first; run Microsoft, Google, Salesforce, and SAP in parallel; use MIT and Stanford/SAP to attack the benchmark scientifically before making a novelty claim.**

### What not to pitch

- Do not pitch SwarmFarm, Burro, Eagle Ray, Percepto, or another application vendor as the headline legitimacy partner.
- Do not claim “agentic coordination” while evaluating only grid coverage.
- Do not call the current simulator decentralized while every agent can read and write one instantaneous global object.
- Do not lead with “Minecraft,” “robots,” or “swarms” as a theme. Lead with an owned bottleneck and a verifier.
- Do not ask a major company merely to sponsor a logo. Ask it to co-own a problem it already needs solved.

## 1. The Yukon standard

Yukon's previous challenges are not random competitions with impressive logos. Each joins a credible artifact owner to a sharp frontier target.

| Challenge | Artifact/problem owner | Research or ecosystem authority | Public frontier |
|---|---|---|---|
| [ECDSA.fail](https://ecdsa.fail/) | Eigen Labs | Google Quantum AI result as the target | Improve the known quantum-resource frontier for breaking ECDSA |
| [OpenFrontierCS](https://www.yukon.org/frontiercs) | Yukon challenge infrastructure | UC Berkeley + Princeton | Solve open computer-science problems with verifiable outputs |
| [MLX.fast](https://www.yukon.org/mlxfast) | Poolside | MLX ecosystem | Produce faster verified Apple-silicon kernels |
| [Flock](https://www.yukon.org/flock) | Ethereum ecosystem challenge | Ethereum Foundation, Succinct, Espresso | Improve concrete proving/distributed-infrastructure work |
| [Lighter.fast](https://www.yukon.org/lighter) | Lighter | Lighter's production stack | Improve a company-owned performance bottleneck |

These page relationships were rechecked at the research cutoff. Do not blur **partner** and **benchmark target** in external claims: ECDSA.fail is explicitly an Eigen Labs project and asks solvers to beat the Google result; that page does not establish Google as a formal challenge partner. OpenFrontierCS displays Berkeley and Princeton beside its ICML paper, MLX.fast displays Poolside, Flock displays Ethereum Foundation/Succinct/Espresso, and Lighter.fast says “with Lighter.”

The pattern is:

> **Tier‑1 artifact owner + recognized technical authority + exact measurable bottleneck + Yukon public solver trail.**

“A company uses many robots” is insufficient. A launch anchor must own the evaluator, the scarce resource, the production bottleneck, or the research result being improved.

## 2. The exact field and the exact problem

“Agentic swarms” mixes three different fields:

1. **LLM agent teams:** language-model agents delegate, communicate, use tools, review, and merge work.
2. **Multi-robot systems:** embodied robots coordinate under sensing, communication, and energy constraints.
3. **Multi-agent reinforcement learning:** multiple learned policies cooperate or compete in a formal environment.

The current commercial and research momentum most relevant to Yukon is the first category: **LLM agent-team orchestration**.

The hard question is not “can several agents run at once?” It is:

> For a new task, when should a system use one agent versus a team, and how should it choose team size, roles, models, communication topology, memory, verification, conflict resolution, and stopping so that coordination adds more value than cost and error?

That can be formalized as an orchestration policy `Ω` that chooses:

- one agent or many;
- how many agents;
- task decomposition and dependency graph;
- planner, worker, reviewer, verifier, or reconciler roles;
- which model fills each role;
- who can communicate with whom and when;
- shared memory and context budgets;
- how concurrent changes are merged;
- which results receive review;
- when to retry, replace a worker, prune a branch, or stop.

The submission should be `Ω`, not a prompt answer and not a stronger underlying model.

## 3. What the newest evidence actually says

### 3.1 Evidence-status matrix

| Date | Work | Status | What was measured | Finding that matters to a challenge |
|---|---|---|---|---|
| 11 Aug 2026 | [EvoX Genesis](https://arxiv.org/abs/2608.10450), Hong Kong Polytechnic University | **Preprint**, open AGPL system | 1,019 finite-lived agent episodes forming a Rust C compiler over 123.4 hours, plus model-switch continuation and a MESA-to-Rust redevelopment | Persistent-project, recursive-agent development already exists. The paper demonstrates capability, not that recursion beats flat alternatives; its authors explicitly call for controlled ablations. |
| Aug 2026 | [AssetOpsBench](https://github.com/IBM/AssetOpsBench), IBM Research | **KDD 2026 Datasets & Benchmarks paper**, open framework with active competitions | 141+ industrial scenarios, five specialist agents, multiple orchestration frameworks, MCP tools, replay, and public challenge history | IBM already owns a runnable multi-agent benchmark and challenge route. The current leaderboard uses an LLM judge, however, and an IJCAI 2026 industrial challenge is already live; Yukon needs a distinct deterministic orchestration-efficiency track, not a duplicate. |
| Aug 2026 | [Embodied Multi-Agent Coordination by Aligning World Models Through Dialogue](https://aclanthology.org/2026.sigdial-1.21/), UIUC | **Peer reviewed**, SIGDIAL 2026 | Two partially observable embodied agents on 100 PARTNR household episodes, comparing silent, costed synchronous, and free asynchronous dialogue across three LLMs | Dialogue cut action-conflict rate by 41–93 percentage points but reduced task success for every model. Removing message cost increased dialogue about 3.5× without recovering success: message volume and low collision are not outcome metrics. |
| 6 Aug 2026 | [How Cursor Router chooses the right model](https://cursor.com/blog/how-cursor-router-works), Cursor | **Company production study**, not peer reviewed | Hundreds of thousands of live turns, held-out policy selection, then live cost/satisfaction testing across task, domain, complexity, tool-use, and conversation signals | Model routing and switching cost are live product bottlenecks. A team challenge should expose model-role assignment under a fixed budget while using deterministic task tests rather than Cursor's private satisfaction proxy. |
| 28 Jul 2026 | [Rovo Long Horizon](https://www.atlassian.com/blog/rovo/long-horizon-whats-changed), Atlassian | **Shipping product and company A/B study**, not peer reviewed | Replaced a hierarchical Jira/Confluence/Slack multi-agent router with one long-context reasoning loop; reported 8.5% higher offline answer quality, 23% higher Confluence evaluation, and 37% lower perceived latency | A Tier‑1 product team publicly moved from many agents back to one because handoffs lost context. The challenge must let a policy choose solo or team; “more agents” cannot be the premise. |
| 28 Jul 2026 | [OrchBench](https://arxiv.org/abs/2607.25656) | **Preprint** | Deterministic simulation of orchestration plans over 240 task DAGs plus larger 200–1,000-node DAGs | Cheap plan evaluation is already possible, but it fixes the task DAG and does not execute workers. Its real-run correlation is promising but based on six model-level points. |
| 24 Jul 2026 | [Capable language models can outgrow the benefits of collaboration](https://www.nature.com/articles/s42256-026-01268-y), Google Research/DeepMind + MIT | **Peer reviewed**, Nature Machine Intelligence | 260 configurations, six agentic benchmarks, five architectures, three model families | Multi-agent impact ranged from **+80.8% to −70%**. Within tested domains, architecture choice was predictable 87% of the time; cross-domain absolute prediction was poor. |
| Jul 2026 | [Multi-Agent Teams Hold Experts Back](https://machinelearning.apple.com/research/multi-agent-teams-experts), Apple collaborators + Stanford + Emory | **Peer reviewed**, ICML 2026, open code | Self-organizing heterogeneous teams on human-inspired and frontier ML benchmarks, including conditions that explicitly identify the expert | Teams still failed to match their expert; the final project page reports losses up to 41.1% on ML benchmarks. Consensus-seeking diluted expertise more as team size grew, although it improved adversarial robustness. A policy must weight verified expertise, not merely solicit votes. |
| May 2026 | [Agent Executor](https://cloud.google.com/blog/products/ai-machine-learning/agent-executor-googles-distributed-agent-runtime), Google Cloud | **Open company runtime**, not a paper | Durable execution, event logs, snapshots, resumption, and deployment across Google and third-party agent frameworks | Google owns an operational fleet problem, not just a paper: long-running workflows are fragile and difficult to run reliably and efficiently. |
| Apr 2026 | [Gemini Enterprise Agent Platform](https://cloud.google.com/blog/products/ai-machine-learning/the-new-gemini-enterprise-one-platform-for-agent-development), Google Cloud | **Shipping company platform**, not a paper | Graph-based subagents, agent-to-agent delegation, persistent runtime, memory, governance, and optimization | Supplies a Tier‑1 product owner and open ADK/A2A surface for a cross-framework reliability challenge, if Google contributes an executable task family. |
| May 2026 | [SAP autonomous enterprise/Joule](https://news.sap.com/2026/05/future-enterprise-autonomous/), SAP | **Shipping/rolling-out company platform**, not a paper | Joule Assistants coordinate teams of agents across business processes; AI Agent Hub governs SAP and third-party agents; A2A and Joule Studio provide an execution surface | SAP joins a company-owned enterprise orchestration problem to SAP Labs' CooperBench work. It is launch-grade only if the product team supplies executable workflows and lets external policies compete. |
| Apr 2026 | [Copilot CLI `/fleet`](https://github.blog/ai-and-ml/github-copilot/run-multiple-agents-at-once-with-fleet-in-copilot-cli/), GitHub | **Shipping company feature**, not a paper | An orchestrator decomposes objectives and dispatches parallel coding subagents that share a filesystem | Makes GitHub/Microsoft a direct coding-orchestration owner as well as a research-market partner; shared-workspace conflicts and dependency quality are testable product questions. |
| 20 Jul 2026 | [Agent swarms and the new model economics](https://cursor.com/blog/agent-swarm-model-economics), Cursor | **Company experiment**, not peer reviewed | Long-running coding swarms rebuilding SQLite from its manual | Better orchestration cut conflict/churn dramatically; similar quality cost **$1,339 to $10,565** depending on model-role mix. |
| 21 Jul 2026 revision | [SWE-Milestone](https://arxiv.org/abs/2603.13428), ICML listing originally titled EvoClaw | **ICML 2026**, open MIT harness | Continuous milestone DAGs from seven real repositories; 12 models and four agent frameworks | Performance fell from above 80% on isolated tasks to 38.03% in continuous settings. It supplies a strong long-horizon substrate, but currently evaluates an agent through one persistent run rather than competing team orchestrators. |
| Mar 2026 | [CAID](https://arxiv.org/abs/2603.21489), Carnegie Mellon | **COLM 2026**, open code | Central manager, asynchronous engineers, isolated git worktrees, merge, and executable verification on PaperBench and Commit0 | A disciplined team beat solo baselines by 26.7 and 14.3 absolute accuracy points. Branch-and-merge is proven prior art; the open question is adaptive policy choice and generalization across hidden tasks under one budget. |
| Jun 2026 | [The Illusion of Multi-Agent Advantage](https://arxiv.org/abs/2606.13003), Salesforce Research collaborators | **Preprint** | Six automatic MAS frameworks versus budget-aware solo self-consistency on reasoning, search, coding, and a purpose-built decomposition task | Automatic MAS often underperformed while costing up to 10× more; a deterministic expert-designed MAS lifted GPT‑5 from 57.0% to 96.5% on the diagnostic task. Budget-matched solo and expert baselines are mandatory. |
| Jul 2026 | [SILO-BENCH](https://aclanthology.org/2026.acl-long.1354/), ACL 2026 | **Peer reviewed**, open code | 1,620 experiments across 30 exact-answer tasks, three communication protocols, six team sizes, and three frontier LLMs under information silos | Active communication did not imply useful distributed computation; on the hardest tasks, success fell to zero beyond 50 agents. Large-agent-count spectacle is not evidence of coordination. |
| Jul 2026 | [MAS-BENCH](https://aclanthology.org/2026.findings-acl.1698/), Findings of ACL 2026 | **Peer reviewed** | Distributed sorting with 1, 3, 5, 10, or 20 agents using broadcast, peer-to-peer, or shared-key-value communication | Success and token efficiency deteriorated as teams grew—even though local sorting is trivial. Its CAMOC protocol produced success-rate gains up to 40%, showing that shared-state and commitment rules are legitimate policy variables rather than implementation trivia. |
| Jul 2026 | [TAMAS](https://aclanthology.org/2026.acl-long.1442/), ACL 2026 | **Peer reviewed**, open Microsoft-hosted benchmark | 300 adversarial instances across six attack types and 211 tools, plus 100 harmless tasks, over ten models and three multi-agent configurations | Orchestration expands the attack surface. Hidden finals need malicious or compromised workers and must score effective robustness, not only benign completion. |
| Jun 2026 | [`alem`](https://arxiv.org/abs/2606.08340), University of Edinburgh collaborators | **Preprint**, open JAX environment | Procedurally generated long-horizon survival world with exploration, crafting, trading, combat, communication, memory, and soft specialization | The scientifically serious version of a “Minecraft swarm” already exists. Thirteen current LLMs averaged about 6% normalized return, but the project lacks a Tier‑1 company problem owner. |
| Jun 2026 | [ENPIRE](https://research.nvidia.com/labs/gear/enpire/), NVIDIA GEAR + CMU + Berkeley | **Preprint/company research** | 1, 4, and 8 coding agents conducting robot-policy autoresearch | Larger fleets reached success sooner, but robot utilization fell and token cost grew superlinearly. |
| May 2026 | [TeamBench](https://teambench.github.io/), Google/MIT collaborators | **Preprint** | 931 seeded instances with OS-enforced Planner/Executor/Verifier roles | Teams mainly helped hard tasks; the verifier falsely accepted 49.4% of grader-failing outputs in the role-mixing pool. |
| May 2026 | [MAS-Orchestra](https://arxiv.org/abs/2601.14652), Salesforce Research + collaborators | **ICML 2026**, open Apache-2.0 code | RL orchestration plus MASBench's Depth, Horizon, Breadth, Parallel, and Robustness axes | Learned holistic orchestration and task-conditioned team size already exist; evaluated domains are math, multi-hop QA, and search rather than persistent repository work. |
| Feb 2026 | [MAS-ProVe](https://arxiv.org/abs/2602.03053), Salesforce AI Research + Rutgers | **ICML 2026**, open middleware | Three verifier paradigms, two granularities, five verifiers, four context strategies, and six MAS frameworks | Process verification did not consistently improve results and remained high-variance. A finals leaderboard must use external deterministic outcomes; intermediate reviewers may be submitted policy components but cannot define truth. |
| Apr 2026 conference / Jan 2026 revision | [Multi-Agent Design (MASS)](https://research.google/pubs/multi-agent-design-optimizing-agents-with-better-prompts-and-topologies/), Google + Cambridge | **ICLR 2026** | Three-stage search over per-agent prompts, workflow topology, then global prompts on reasoning, multi-hop, and code-generation tasks | Automatic prompt-and-topology search is already peer-reviewed. It also shows that locally optimizing agents before scaling and pruning harmful modules can matter more than adding topology. |
| 2026 | [EvoMAS](https://arxiv.org/abs/2602.06511), AWS + Emory | **ICML 2026 accepted** | Evolution over roles, prompts, tools, models, and DAG topology | Automatic system design works, but depends on initial pools, task-time search, and an LLM-judge proxy; it does not close hidden cross-domain orchestration. |
| Feb 2026 | [AgentConductor](https://arxiv.org/abs/2602.17100), Shanghai Jiao Tong + Meituan | **ICML 2026** | Difficulty-aware, execution-feedback topology evolution over five code-generation datasets | Dynamic topology for code is already published: the authors report up to a 14.6% pass@1 improvement and 68% lower token cost. Its tasks are single contest/basic problems, not evolving repositories with merge and commitment failures. |
| Apr 2026 | [Learning to Orchestrate Agents with the Conductor](https://iclr.cc/virtual/2026/poster/10009267) | **ICLR 2026** | RL-trained 7B conductor selecting topology and prompts over worker pools | Learned orchestration can beat individual workers on reasoning tasks, so the competition cannot claim dynamic topology itself is new. |
| Apr 2026 | [Emergent Coordination in Multi-Agent Language Models](https://iclr.cc/virtual/2026/poster/10009408) | **ICLR 2026** | Information-theoretic measurement of higher-order coordination | Personas plus explicit theory-of-mind prompting created more complementary group behavior; emergence is measurable, not just visual. |
| Jan 2026 | [CooperBench](https://cooperbench.com/), Stanford + SAP Labs | **Preprint**, open benchmark | 652 cooperative coding tasks, 12 repositories, four languages | Agents averaged about **30% lower success together**; failures came from bad expectations, communication, and broken commitments. |
| Oct 2025 / Mar 2026 forum | [Magentic Marketplace](https://www.microsoft.com/en-us/research/blog/magentic-marketplace-an-open-source-simulation-environment-for-studying-agentic-markets/), Microsoft Research | **Technical report + active 2026 research program** | 100 customer agents, 300 business agents in synthetic markets | Welfare falls with scale/search friction; models show severe first-proposal bias and 10–30× speed advantages over quality. |

### 3.2 The strongest peer-reviewed result

The final Google/MIT Nature paper is stronger and more nuanced than the January Google blog post:

- 260 system configurations across six benchmarks;
- single-agent, independent, centralized, decentralized, and hybrid architectures;
- OpenAI, Google, and Anthropic model families;
- matched per-system compute;
- gains of +80.8% on decomposable financial work but losses as large as −70% on sequential planning;
- independent teams amplified trace errors 17.2×, versus 4.4× for centralized systems;
- hybrid systems used 44.3 reasoning turns on average versus 7.2 for a single agent;
- team-size experiments reached nine agents and showed superlinear turn growth;
- an approximately 45% single-agent capability threshold predicted the **sign** of multi-agent gain in 94% of 16 additional SWE-bench Verified and Terminal-Bench configurations, but the underlying baseline-by-team-size interaction did not survive cluster-robust correction, so the authors correctly present it as a practical rule rather than a universal scaling law;
- the architecture selector achieved 87% accuracy on held-out configurations **within tested domains**;
- leave-one-dataset-out absolute prediction was poor (`R² = −2.09`), so the result is not a universal router;
- mixed-model teams did not reliably beat the strongest homogeneous team;
- the authors identify sparse communication, early exit, distilled coordinators, role-specialized heterogeneous teams, and economic viability as open work.

Statistical caution matters here. The final article says the single-agent baseline coefficient survives both cluster-robust inference and Holm–Bonferroni correction, while baseline-scaled error amplification survives cluster-robust inference. Several attractive stories—including a tool-coordination trade-off and the baseline-by-team-size interaction—are directionally consistent but do not clear the same corrected significance bar. The challenge should test those hypotheses, not market them as laws.

This paper proves the problem is real while leaving a clean competition gap: **generalization to unseen task structures under operational cost and latency constraints**.

### 3.3 Cursor exposes the product bottleneck

Cursor's 2026 research is the cleanest company-specific evidence.

In its February system, 20 agents under coarse locking slowed to the throughput of roughly one to three. Flat agents avoided difficult work; an overloaded continuous executor slept, stopped workers, failed to merge, and declared completion early.

In its July system:

- a recursive planner/worker task tree replaced a fixed flat team;
- the company built a new version-control layer because Git could not support the experiment's activity;
- activity peaked around 1,000 commits per second;
- Cursor documented split-brain designs, planner contention, merge conflicts, “megafiles,” and architectural ossification;
- an old Grok run produced about 68,000 commits in two hours and accumulated more than 70,000 conflicts;
- its improved harness logged fewer than 1,000 conflicts across four hours;
- all tested improved configurations eventually passed the held-out SQL logic suite;
- similar quality cost from $1,339 to $10,565;
- workers consumed at least 69% of tokens and more than 90% in most runs;
- a frontier planner plus cheaper workers was dramatically cheaper than using the frontier model everywhere;
- Cursor explicitly calls its shared “Field Guide” early research and names writing knowledge for successor agents as follow-up work.

Cursor's August production-router study adds a second owned bottleneck. It learns task complexity and model strengths from hundreds of thousands of live turns, evaluates candidate policies on a held-out set, and then tests them online while accounting for model-switch cache misses. Cursor reported that no model dominated every work category, making heterogeneous role assignment an actual product question rather than a decorative benchmark option.

Cursor has therefore supplied the three things a Yukon pitch needs: **a frontier, visible failures, and measurable economics**. What it has not supplied is an open competition interface or a neutral benchmark of orchestration policies.

### 3.4 CooperBench makes the failure reproducible

CooperBench is unusually useful because it does not reward pretty conversations. It grades the merged code with deterministic tests.

- 652 tasks across 12 open-source repositories and four languages;
- each agent receives a potentially conflicting feature from the same repository state;
- 77.3% of tasks have conflicts in their ground-truth solutions;
- GPT‑5 and Claude Sonnet 4.5 reached about 25% cooperative success, roughly 50% below their solo condition on the project page;
- from two to four agents, a small experiment declined from 68.6% to 30.0%;
- communication consumed up to 20% of action budget and reduced merge conflicts without improving overall success;
- a Plan message in the first turn nearly halved merge-conflict rate (29.4% versus 51.5%), and concrete file/line references helped; the same analysis shows that spatial separation still does not guarantee semantically compatible implementations;
- annotated root causes were expectation failures (42%), commitment failures (32%), and communication failures (26%).

The authors explicitly invite new frameworks, model combinations, and communication systems. This makes Stanford/SAP a plausible evaluator co-anchor rather than a decorative academic logo.

### 3.5 TeamBench shows why “just add a verifier” is not enough

TeamBench uses isolated containers to enforce Planner, Executor, and Verifier roles, then removes roles to measure their marginal value.

- 851 templates and 931 deterministic seeded instances;
- 19 categories and five conditions;
- the lowest solo-performance task quintile gained 15.7 percentage points from teams;
- the top quintile lost performance to overhead;
- full teams averaged only +0.5 points over solo across the 155-task reference pool (`p = 0.20`);
- LLM verifiers approved 49.4% of outputs that failed the deterministic grader in the 27-configuration role-mixing pool;
- prompt-only teams exhibited 3.6× more role collapse/code takeover;
- mixed-provider role assignments sometimes improved cost-performance.

The implication is direct: **the challenge must use deterministic graders as ground truth and treat verifier behavior as a policy component, not as truth.**

### 3.6 The 2026 prior art removes several lazy novelty claims

The deeper pass found six lines of work that materially narrow what Yukon can claim:

- **Dynamic topology and automatic workflow search are not new.** AgentConductor adapts a coding-agent graph using task difficulty and execution feedback; MAS-Orchestra learns whole team designs with RL; Google's ICLR 2026 MASS jointly optimizes prompts and topology in stages.
- **Plan-only orchestration benchmarking is not new.** OrchBench evaluates agent assignment, handoffs, retention, quality, makespan, and token cost in a deterministic simulator. It is useful as a cheap development track, not a final product-grade evaluator: task decomposition is supplied as a DAG, workers do not run, and its headline Pearson correlation (`r = 0.816`, `p = 0.047`) is over six model-level observations; Spearman significance is weaker (`p = 0.103`).
- **Long-horizon repository evaluation is not new.** SWE-Milestone reconstructs real release histories into executable milestone DAGs and scores both new functionality and regressions.
- **Asynchronous isolated branch-and-merge is not new.** CMU's COLM 2026 CAID uses a manager, dependency-aware delegation, git worktrees, merge, and executable verification, beating solo baselines on two long-horizon task families. A Yukon submission must be able to choose or improve this policy, not rename it.
- **Large recursive coding teams are not new.** EvoX Genesis reports more than 1,000 finite-lived episodes building a roughly 249k-line compiler and continuing projects across model replacement. Its evidence package contains a small number of large runs, incomplete human-intervention logs, and no causal comparison proving recursion is superior.
- **Adding a process verifier is not a solved reliability recipe.** Salesforce/Rutgers' ICML 2026 MAS-ProVe finds high variance and no consistent improvement across verifier types, granularities, context strategies, and six MAS frameworks. Internal review can guide a policy, but final truth must come from the executable environment.
- **Heterogeneous teams do not automatically use their best member.** Apple/Stanford/Emory's ICML 2026 study finds that self-organizing teams average expert and non-expert views even when told who the expert is; this “integrative compromise” worsens with team size. Model-role assignment needs evidence-weighted acceptance and abstention, not consensus by headcount.
- **Large-team communication, shared-state agreement, and adversarial safety have dedicated benchmarks.** ACL 2026 SILO-BENCH shows communication can rise while exact-answer success collapses; Findings of ACL 2026 MAS-BENCH shows even distributed sorting degrades with team size and that explicit coordination scaffolding can produce success-rate gains up to 40%; ACL 2026 TAMAS tests attacks unique to multi-agent/tool interactions. SIGDIAL 2026 independently finds that embodied-agent dialogue can remove 41–93 points of action conflict while making task success worse. Agent count, message volume, and low collision are diagnostics, never success metrics.
- **A serious open-world game substrate now exists.** `alem` already combines procedural worlds, communication, memory, specialization, crafting, trading, and combat. Rebuilding a weaker maze would add little; a Yukon game-world lane would need a Tier‑1 owner and a question beyond `alem`'s current benchmark.
- **A long-horizon orchestration benchmark name is already occupied.** OrchestraBench advertises a seven-day campaign, an open SDK/evaluator, and 100–150 heterogeneous tasks. As of the cutoff, however, its “arXiv” link and BibTeX still contain placeholders, its private set and leaderboard are forthcoming, and it discloses ownership ties to the Cognio framework being evaluated. Treat it as market adjacency, not authoritative research.

These do not eliminate a Yukon challenge. They force the challenge to combine regimes that current projects separate: **real worker execution, hidden evolving repositories, adaptive heterogeneous teams, merge/commitment failure, fixed resource budgets, deterministic software tests, and a company adoption path.**

## 4. What already exists—and what is still open

Yes, many “strategies” already exist. They come from hand-designed systems, learned conductors, evolutionary search, multi-agent RL, and product teams hill-climbing their own harnesses.

| Existing work | What already exists | What remains open enough for a challenge |
|---|---|---|
| Cursor swarm | Recursive planners, workers, reconciler, stacked reviewers, shared Field Guide | Closed internal harness; no neutral submission protocol; no public held-out comparison of alternative orchestration policies |
| Google/MIT Nature study | Quantitative rules over five canonical architectures | Cross-domain selection, large teams, long horizons, learned/sparse protocols, heterogeneous role choice, real economics |
| CooperBench | Reproducible two-agent coding conflicts and deterministic tests | Dynamic teams, long-horizon dependencies, reviewer allocation, model routing, failure recovery, budget optimization |
| TeamBench | Structurally enforced fixed three-role pipeline | Let the submission choose roles/topology; test multi-hour repo work; prevent verifier gaming |
| Conductor | RL-learned topology and prompts | Repository-scale, tool-heavy, asynchronous, stateful work under deterministic verification and cost |
| AgentConductor | Difficulty-aware coding topology, execution feedback, sparse graphs | Multi-file repository evolution, concurrent branches, merge/review policy, long-lived state, heterogeneous models |
| MAS-Orchestra / MASBench | RL-generated whole teams and five structural task axes | Production repository actions, persistent state, deterministic end-to-end grading, conflicts and regressions |
| Google MASS | Automated prompt and topology search in a pruned module space | Hidden repository generalization, execution-time adaptation, merge/review policy, and a fixed end-to-end resource budget |
| EvoMAS | Evolution of roles, models, prompts, tools, and DAGs | Hidden generalization without per-task ground truth; reliable non-LLM rewards; bounded search cost; dynamic execution-time adaptation |
| OrchBench | Deterministic, cheap evaluation of a plan over a supplied task DAG | Agent-created decomposition and actual worker/tool/environment outcomes; robust validation beyond six model-level real-run points |
| SWE-Milestone | Real-repository, continuous milestone DAGs with regression-aware tests | Explicit multi-agent orchestration policy comparison under a shared fixed budget |
| CAID | Centralized delegation, asynchronous isolated worktrees, merge, and executable tests | Adaptive choice among solo/team/topology policies, hidden cross-family generalization, heterogeneous models, and shared budget accounting |
| EvoX Genesis | Persistent project history, path-scoped recursive delegation, parent acceptance, model replacement | Controlled topology/budget comparisons and hidden tasks; evidence that one policy wins rather than that one policy can work |
| OpenAI Symphony | Open issue-tracker orchestration spec and isolated workspaces | Comparative benchmark, adaptive coordination, dependency discovery quality, conflict economics |
| SILO-BENCH / MAS-BENCH / TAMAS | Exact distributed-computation stress, shared-state coordination, and adversarial multi-agent/tool safety | Embed scale and attack strata inside a production task; do not launch another abstract communication-only benchmark |
| `alem` | Procedural long-horizon open-world coordination with communication and specialization | Tier‑1 artifact owner, company adoption path, and a frontier beyond the existing open benchmark |

The defensible gap is therefore not “the first agent swarm,” “the first dynamic topology,” or “the first long-horizon coding team.” It is the following combination:

> **A company-anchored, end-to-end competition for budgeted adaptive coding-team orchestration on hidden evolving repositories, where deterministic software outcomes—not a simulated plan or LLM judge—decide the result.**

Do not prepend “first” without a co-anchor's formal literature review. The opportunity is the integration and company-owned target, not an unverified priority claim.

## 5. Recommended challenge design

### 5.1 Working title and public hook

**SWARM.FAIL — Agent Team Efficiency**

Public question:

> One coding agent is useful. Hundreds can produce a thousand commits a second—and still spend most of their effort fighting. Can your orchestrator make a team produce more verified software than one agent under the same budget?

### 5.2 What competitors submit

One executable orchestration policy. It may decide:

- whether to use one agent or several;
- task-tree shape and dependencies;
- model assignment by role;
- prompts and context passed to each role;
- communication edges and message timing;
- shared-memory writes and retention;
- workspace/branch allocation;
- merge and conflict-reconciliation policy;
- review lenses and verification allocation;
- retry, replacement, pruning, and stopping.

Competitors may not modify:

- the pinned model snapshots;
- hidden tasks or tests;
- sandbox resource accounting;
- evaluator or result attestations.

This still lets anyone write an algorithm. A hand-written heuristic, a learned router, an evolutionary generator, an RL conductor, or a hybrid can all compete behind the same interface.

### 5.3 Evaluation ladder

Use a cheap development track and four end-to-end strata so the competition measures coordination rather than only raw coding ability:

0. **Plan simulator:** an OrchBench-style public simulator for fast debugging of assignment, handoff, retention, and scheduling. It cannot determine the final leaderboard.
1. **Collision tasks:** CooperBench-style, individually tractable features whose correct implementations overlap.
2. **Dependency tasks:** multi-role tasks with hidden constraints and interdependent stages, informed by TeamBench and MASBench.
3. **Continuous evolution:** SWE-Milestone-style release sequences with regression tests, technical debt, and no reset between milestones.
4. **Partner final:** one stripped Cursor or other company-owned task family, executed end to end on a private final set.

Hidden evaluation varies:

- repository and language;
- task decomposability and sequential depth;
- model pool and price ratios;
- worker latency or failure;
- conflict density;
- tool availability;
- context and communication budgets.

### 5.4 Score

Avoid an arbitrary formula that trades one test for a dollar. Give every entry the **same hard resource envelope**:

- model-token budget;
- dollar budget at published frozen prices;
- wall-clock limit;
- maximum concurrent agents;
- tool-call and sandbox limits.

Then rank by:

1. geometric mean of deterministic verified task score across hidden task families;
2. regression/security gate;
3. tie-break: lower cost, then lower wall time.

Publish the Pareto plots too—verified quality versus dollars and time—even though the main leaderboard has one ordering.

Why this is safer:

- the resource envelope stops “buying” a win with unlimited agents;
- deterministic tests stop an LLM judge from becoming the target;
- geometric mean punishes a policy that only works on one task family;
- hidden families test generalization rather than memorized topology;
- cost/time tie-breakers do not swamp correctness.

### 5.5 Required baselines

- strongest single-agent run and budget-matched self-consistency under the same envelope;
- independent parallel workers with final aggregation;
- fixed centralized planner/worker hierarchy;
- fixed peer-to-peer team;
- fixed Planner/Executor/Verifier pipeline;
- one expert-written deterministic decomposition baseline, following the lesson from Salesforce's Illusion study;
- a simple task-property router using the Google/MIT findings;
- one dynamic code-topology baseline such as AgentConductor, if its released implementation reproduces;
- one open automatic design baseline such as MAS-Orchestra or EvoMAS, subject to domain, license, and reproducibility review.

### 5.6 Hero artifact

The playable submission is not a chart. It is a replay of the team at work:

- live task tree with planner/worker/reviewer roles;
- branches/isolated workspaces and commits;
- messages and shared-memory updates;
- conflicts, duplicate work, and reconciliations;
- tests turning red and green;
- token, dollar, and wall-clock meters;
- a synchronized solo baseline beside the entrant;
- final verified output and efficiency delta.

The public should understand the failure in ten seconds: **more agents can create more activity and less progress.**

### 5.7 Anti-gaming requirements

- private tests and held-out repositories;
- pinned model versions for a season;
- no network except allow-listed dependencies;
- isolated workspaces with signed event logs;
- deterministic build/test containers;
- replayable model-call metadata and resource accounting;
- secret rotation of task variants;
- audit for test deletion, evaluator tampering, hard-coded task IDs, and result fabrication;
- separate public development set and private final set;
- repeated runs where model nondeterminism materially affects ranking.

## 6. Tier-one partner shortlist

### 6.1 Scoring rubric

This is a decision aid, not an objective fact. Scores use only evidence available as of the cutoff.

| Criterion | Weight | What earns full credit |
|---|---:|---|
| Institutional legitimacy | 15 | Frontier company/lab or globally recognized research institution |
| Owned/open artifact | 15 | Partner owns the bottleneck and can expose a runnable evaluator or interface |
| Fresh authoritative evidence | 15 | Strong 2026 primary research, ideally peer reviewed |
| Objective verifier | 15 | Outputs can be graded deterministically and privately |
| Unsolved frontier | 15 | Exact gap remains open after reviewing current work |
| Partner adoption value | 10 | Winning methods could flow into the partner's product/research |
| Hero legibility | 5 | Public can see progress/failure, not just read a table |
| Reachability | 10 | Named team and credible partnership route exist |

### 6.2 Ranked coalitions

The total is the sum of the rubric columns above: legitimacy (`L`), artifact (`A`), evidence (`E`), verifier (`V`), unsolved frontier (`U`), adoption value (`D`), hero (`H`), and reachability (`R`). Showing the subscores prevents a polished narrative from hiding a weak artifact or route.

| Coalition | L /15 | A /15 | E /15 | V /15 | U /15 | D /10 | H /5 | R /10 | Total |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Cursor + academic evaluator | 15 | 11 | 15 | 15 | 15 | 10 | 5 | 7 | **93** |
| Microsoft Research/AARI | 15 | 15 | 13 | 14 | 14 | 10 | 4 | 7 | **92** |
| Google Cloud + Google Research/MIT | 15 | 14 | 15 | 12 | 14 | 10 | 4 | 7 | **91** |
| Salesforce AI Research + Agentforce | 15 | 14 | 15 | 12 | 13 | 10 | 4 | 7 | **90** |
| SAP Joule + SAP Labs/Stanford | 15 | 13 | 14 | 13 | 13 | 10 | 4 | 7 | **89** |
| IBM watsonx Orchestrate + Bob/ITBench | 15 | 15 | 14 | 11 | 9 | 10 | 5 | 8 | **87** |
| Atlassian Rovo/Jira | 14 | 15 | 12 | 10 | 13 | 10 | 4 | 8 | **86** |
| NASA Ames | 15 | 8 | 14 | 13 | 15 | 10 | 5 | 5 | **85** |
| Factory Missions + neutral evaluator | 11 | 14 | 9 | 14 | 14 | 10 | 5 | 7 | **84** |
| Replit Agent 4 + neutral evaluator | 13 | 14 | 10 | 11 | 14 | 10 | 5 | 7 | **84** |
| NVIDIA GEAR + CMU/Berkeley | 15 | 7 | 14 | 12 | 14 | 10 | 5 | 5 | **82** |
| AWS + Emory | 14 | 12 | 15 | 12 | 12 | 8 | 3 | 4 | **80** |
| OpenAI Symphony | 15 | 12 | 10 | 14 | 12 | 8 | 4 | 2 | **77** |

| Rank | Coalition / challenge | Score / 100 | Why it is launch-grade | Blocking dependency |
|---:|---|---:|---|---|
| 1 | **Cursor + independent academic evaluator — Agent Team Efficiency** | **93** | Tier‑1 product owner; newest direct swarm evidence; deterministic coding tests; powerful live artifact | Cursor must expose or approve a stripped public harness/model interface; Stanford/SAP, CMU, or Google/MIT must validate the design |
| 2 | **Microsoft Research/AARI — Agent Market Resilience** | **92** | Open Magentic Marketplace; explicit Grand Challenge program; 2026 active research; clear welfare/fairness/manipulation metrics | Position Yukon as execution/distribution partner, not a competing challenge program |
| 3 | **Google Cloud + Google Research/MIT — Agent Fleet Reliability** | **91** | Shipping Agent Platform, open Agent Executor/ADK/A2A surfaces, and July Nature result in one corporate research/product family | Must secure a product owner and exact executable workflow family; platform breadth alone is not a benchmark |
| 4 | **Salesforce AI Research + Agentforce — Enterprise Team Efficiency** | **90** | Tier‑1 company; live 2026 orchestration product; ICML system, open code, and unusually candid negative audit from its researchers | Must bridge research and product teams and supply deterministic private workflows, not just public QA benchmarks |
| 5 | **SAP Joule + SAP Labs/Stanford — Governed Enterprise Coordination** | **89** | Tier‑1 product owner; SAP Labs co-created CooperBench; 2026 Joule/Agent Hub/A2A rollout creates a direct adoption path | Must connect the research and product teams and expose exact, privacy-safe business-process state transitions to external policies |
| 6 | **IBM watsonx Orchestrate + Bob/ITBench — Governed Agent Delivery** | **87** | Tier‑1 enterprise owner; July multi-agent coding release plus open ITBench/AssetOpsBench environments, current 2026 benchmark activity, and proven challenge operations | AssetOpsBench already powers public challenges and uses an LLM judge; IBM must want a distinct fixed-budget orchestration track with deterministic state-based finals |
| 7 | **Atlassian Rovo/Jira — Solo-or-Team Enterprise Workflows** | **86** | Tier‑1 work platform; fresh production reversal from hierarchical agents to one loop; open MCP surface with five million daily tool calls | Private evaluator and simultaneous model/stack changes prevent causal comparison; Atlassian must expose stripped workflows and frozen worker options |
| 8 | **NASA Ames Starling/DSA — Distributed Spacecraft Autonomy Under Loss** | **85** | Literal operational swarm; active 2026 mission; NASA technical review and open MuSCAT seed simulator | Flight autonomy is not open; NASA must approve an abstraction and engagement |
| 9 | **Factory Missions — Long-Horizon Software Delivery** | **84** | Direct product owner; orchestrator/worker/validator system, hidden-test benchmark infrastructure, and observable cost/quality loop | Company evidence is self-reported and Legacy-Bench grades agents, not orchestration policies; neutral validation is required |
| 9 | **Replit Agent 4 — Parallel App Delivery** | **84** | Major direct product owner; parallel isolated tasks, automated dependency/merge handling, and public ViBench plus production A/B evaluation | ViBench evaluates finished apps but does not yet expose competing orchestration policies; parts of grading use an eval agent |
| 11 | **NVIDIA GEAR + CMU/Berkeley — Physical Autoresearch Efficiency** | **82** | June 2026 frontier system; scarce robot/GPU resource; obvious visual artifact | Hardware and full ENPIRE interface are not publicly challenge-ready |
| 12 | **AWS/Emory — Cross-Domain MAS Generation** | **80** | ICML 2026 EvoMAS and open implementation; direct architecture-search expertise | Non-commercial code license and overlap with already-solved components |
| 13 | **OpenAI Symphony — Autonomous Repo Operations** | **77** | Frontier product, open spec/reference, verified code, clear human-attention bottleneck | Low access probability and no current public research-partnership route identified |

The top five are credible for different reasons; IBM, Atlassian, and Factory are strong second-wave conversations, not filler:

- **Cursor has the best story and closest match to “swarm.fail.”**
- **Microsoft has the most ready-made open research substrate and explicit partnership machinery.**
- **Google combines the strongest peer-reviewed result with a shipping fleet platform and open runtime/protocol surfaces.**
- **Salesforce uniquely joins a shipping multi-agent product to an ICML research program and a recent internal critique of orchestration bloat.**
- **SAP joins the closest open coding-coordination benchmark to a shipping enterprise-agent control plane and a product partnership with Google Cloud.**
- **IBM owns enterprise fleet governance, multi-agent coding, and unusually mature open evaluators; the issue is differentiation and deterministic scoring, not missing infrastructure.**
- **Atlassian supplies a rare production counterexample: it replaced multi-agent handoffs with one reasoning loop, making solo-versus-team routing a company-owned question rather than a research abstraction.**
- **Factory and Replit own direct parallel-software products, but need independent policy evaluation to separate product evidence from a neutral research result.**

### 6.3 Why Cursor is the first call

Cursor resembles Poolside in MLX.fast more than a generic sponsor:

- it owns the coding-agent product;
- it owns the multi-agent harness and VCS experiments;
- it has published concrete failure modes and cost curves;
- winning orchestration policies could inform its product;
- it announced a broader partner strategy in July 2026;
- the hero artifact naturally demonstrates its frontier.

The pitch is not “sponsor our swarm site.” It is:

> You have shown that orchestration changes conflict rate, cost, and verified output more than raw commit volume. Yukon can turn that frontier into a neutral public competition, attract external solvers, and produce reproducible methods you can evaluate for your own swarm.

Contact route: [Cursor's partnership/contact form](https://www.cursor.com/contact-sales) with “Partnership,” addressed to the research team and Wilson Lin. The public contact page also lists `hi@cursor.com`. Do not use the hiring address for a partnership pitch.

### 6.4 Why Microsoft is the strongest fallback

Microsoft Research already has the exact ingredients:

- [Magentic Marketplace](https://github.com/microsoft/multi-agent-marketplace) is open source and uses a minimal REST protocol;
- its environment measures consumer welfare, market efficiency, fairness, search, negotiation, and manipulation;
- scale and imperfect discovery visibly degrade outcomes;
- first-proposal bias gives response speed a 10–30× advantage over quality;
- [AARI](https://www.microsoft.com/en-us/research/academic-program/agentic-ai-research-and-innovation/) explicitly works through Grand Challenges with academic partners;
- AARI includes Stanford work on risks in multi-agent collaboration and Northeastern work on agents as teammates.
- GitHub's April 2026 Copilot CLI `/fleet` separately makes the Microsoft group a coding-orchestration product owner: it decomposes objectives into dependent work and dispatches parallel agents into a shared filesystem.

Challenge version:

> Submit an agent policy or market mechanism that preserves welfare, fairness, and manipulation resistance as agent populations, information asymmetry, and strategic behavior change under a fixed interaction budget.

Hero artifact: a live market replay showing search, proposals, transactions, manipulation attempts, welfare, and who was unfairly excluded.

First technical contact: [Gagan Bansal](https://www.microsoft.com/en-us/research/people/gaganbansal/), Principal Researcher and Magentic Marketplace lead. AARI is the program route.

### 6.5 Why Salesforce is a real Tier-one alternative

Salesforce was missing from the earlier shortlist and should not have been. Four current facts align:

- Agentforce's Summer 2026 release added Multi-Agent Orchestration for a front-door agent to delegate across specialized agents with shared context;
- Salesforce AI Research's MAS-Orchestra was accepted to ICML 2026 and ships Apache-2.0 code, datasets, and trained orchestrators;
- the same research line's ICML 2026 MAS-ProVe shows that automatic process verification is high-variance and does not consistently improve multi-agent results;
- overlapping Salesforce researchers then published *The Illusion of Multi-Agent Advantage*, showing that six automatic MAS frameworks often lose to strong solo self-consistency while costing up to 10× more.

That apparent tension is an asset. The team has both a production reason to improve orchestration and researchers willing to show when it fails.

Salesforce also documents the operational version of the problem: Alcon accumulated more than 900 agents in silos, creating security and compliance risk. That makes governance, authority boundaries, and auditability—not just answer quality—credible challenge outputs.

Challenge version:

> Given a fixed set of specialized enterprise agents, permissions, tools, and a hard cost/latency budget, write the front-door routing and delegation policy that completes the most workflows without violating authority or losing context.

The evaluator should use synthetic but executable CRM/service/IT state transitions with exact postconditions, permission gates, injected subagent failures, and an immutable audit log. Public QA accuracy alone is insufficient. The hero artifact is a live workflow replay showing routing, handoffs, state changes, denied actions, retries, cost, latency, and the solo/front-door baseline.

First research route: `zixuan.ke@salesforce.com` and `sjoty@salesforce.com`, with a request to connect the research benchmark to the Agentforce Multi-Agent Orchestration product owner. The blocking question is whether Salesforce will contribute private executable workflow families and an internal adoption test—not whether it will provide branding.

### 6.6 Why Google is both product owner and science co-anchor

Google should not be approached only for a research logo. Its 2026 coalition has three layers:

- **product:** Gemini Enterprise Agent Platform builds, governs, and optimizes fleets with graph-based subagents and agent-to-agent delegation;
- **open infrastructure:** Agent Executor provides durable event logs, snapshots, resumption, and distributed deployment; ADK and A2A provide a public implementation surface;
- **science:** Google Research/DeepMind + MIT's July Nature paper gives the strongest peer-reviewed evidence that architecture choice is task-dependent.

Google frames the runtime at genuine fleet scale: Agent Substrate is designed for hundreds of millions of registered agents and millions of sub-second tool calls, while Agent Executor addresses workflows that run for hours or days and must survive outages and human approvals. Those are product claims, but they identify measurable systems constraints that a partner can expose.

Challenge version:

> Given A2A-compatible agents with different capabilities, permissions, latency, cost, and failure rates, write the orchestrator that completes the most stateful multi-system workflows while preserving authority, context, and auditability.

Grade exact environment state, policy compliance, cost, and latency under hidden outages, slow workers, stale memories, and malicious or incorrect agent responses. The replay can show the delegation graph, state snapshots, failures, resumptions, denied actions, and final verified state. Do not score natural-language helpfulness with another LLM.

Product routes named on Google's primary releases include Brian Delahunty and Michael Gerstenhaber for Agent Platform, and Jaana Dogan and Ethan Bao for Agent Executor. Ask the research team to help validate:

- hidden task-family construction;
- measures of decomposability, sequential depth, and tool density;
- within-domain versus cross-domain claims;
- architecture-selection baselines;
- cost/error-amplification reporting;
- whether the proposed benchmark tests a genuinely new regime.

Relevant public contacts:

- [Yubin Kim](https://www.media.mit.edu/people/ybkim95/overview/) — `ybkim95@media.mit.edu`;
- [Paul Pu Liang](https://www.media.mit.edu/people/ppliang/overview/) — `ppliang@media.mit.edu`;
- [Xin Liu](https://research.google/people/108533/) — Google Research profile and linked personal site.

### 6.7 Stanford/SAP as evaluator co-anchor

The CooperBench team is closer to the proposed challenge mechanics than a generic multi-agent lab. Ask them to:

- extend two-agent feature conflicts into dynamic team tasks;
- validate contamination controls and deterministic grading;
- co-design coordination-failure labels;
- provide a public development split while Yukon builds private finals;
- advise on the Solo–Team gap as a headline metric.

The public author list and project are on [CooperBench](https://cooperbench.com/); Diyi Yang's group is the senior academic route.

The academic/research outreach order should be explicit:

| Research lead/team | Fresh evidence | Exact role in a Yukon challenge | Public route |
|---|---|---|---|
| **Diyi Yang, Stanford SAIL/HAI + SAP Labs team** | CooperBench, Jan 2026; Microsoft AARI project on emerging risks in multi-agent collaboration | Co-design coding-conflict tasks, failure labels, human/team baselines, and novelty review | [`diyiy@cs.stanford.edu`](https://cs.stanford.edu/~diyiy/) plus the CooperBench author list |
| **Graham Neubig and Jiayi Geng, CMU LTI** | CAID, COLM 2026 | Supply the strongest open isolated-worktree/merge baseline and audit whether the challenge really tests beyond it | [`gneubig@andrew.cmu.edu`](https://www.csd.cs.cmu.edu/people/faculty/graham-neubig) and `{ogeng,gneubig}@cs.cmu.edu` in the CAID repository |
| **Paul Pu Liang and Yubin Kim, MIT; Google collaborators** | July Nature scaling study and TeamBench, May 2026 | Validate task-structure measures, solo/team crossover, enforced roles, statistical design, and cross-domain claims | [`ppliang@media.mit.edu`](https://www.media.mit.edu/people/ppliang/overview/) and [`ybkim95@media.mit.edu`](https://www.media.mit.edu/people/ybkim95/overview/) |
| **Christopher Amato, Northeastern** | ICML 2026 decentralized LLM collaboration; AAAI 2026 LLM multi-agent RL | Review learned decentralized policies, partial observability, costly communication, and physical-swarm crossover | [`c.amato@northeastern.edu`](https://www.khoury.northeastern.edu/people/chris-amato/) |
| **Amos Storkey / Tim Rocktäschel collaborators, Edinburgh** | `alem`, Jun 2026 | Only for an open-world/Minecraft-like lane: extend procedural coordination rather than rebuilding a maze | [`alem` project/code](https://github.com/alem-world/alem-env) and [BayesWatch](https://www.bayeswatch.com/) |

This list is not interchangeable. Stanford/SAP and CMU are closest to the recommended coding challenge; MIT/Google provides the strongest system-level science; Northeastern fits learned/decentralized policy work; Edinburgh fits the game-world alternative.

### 6.8 Why SAP belongs on the company shortlist too

SAP is more than an academic logo beside Stanford. It connects three pieces that most candidates keep separate:

- SAP Labs US researchers co-authored CooperBench and helped build its expert-written features, tests, and ground-truth implementations;
- SAP's 2026 Joule Assistants coordinate teams of specialized agents across governed business processes, while SAP AI Agent Hub inventories and governs SAP and third-party agents;
- SAP and Google Cloud announced a cross-platform multi-agent system in which Gemini Enterprise coordinates agents acting across both companies' products, with A2A and SAP agent gateway interfaces carrying context and actions.

A credible SAP challenge would be:

> Given a fixed catalogue of business-process agents, identities, permissions, costs, and deadlines, submit the routing, delegation, commitment, and recovery policy that completes the most hidden workflows without violating controls or corrupting enterprise state.

The evaluator should run against synthetic SAP-like state machines with exact ledger, order, support, or supply-chain postconditions; inject stale context, unavailable agents, conflicting writes, and permission changes; and measure verified completion, violations, rollback burden, latency, and cost. The public replay can show each handoff and state mutation without exposing customer data.

The route is unusually concrete: start with the SAP Labs co-authors listed on CooperBench and ask them to connect the benchmark to the Joule/AI Agent Hub product owner. SAP becomes stronger than a research co-anchor only if it contributes executable workflow families and an internal adoption review. Product claims such as time saved or agent counts are not substitutes for that evaluator.

### 6.9 NASA and NVIDIA are separate strategic lanes

Do not mix physical autonomy into the coding challenge merely to collect logos.

If Yukon deliberately chooses **space autonomy** as the vertical, NASA Ames is the credible anchor. Starling's four CubeSats demonstrated fully distributed autonomous multi-spacecraft operations, and NASA's 2026 multi-agent swarm report focuses on persistent lunar awareness, distributed autonomy, networking, navigation, and edge compute. [MuSCAT](https://github.com/nasa/muscat) is an Apache-2.0 low-fidelity multi-spacecraft simulator, but it is a concept tool rather than Starling's flight evaluator.

The challenge would be:

> Allocate science tasks and maneuver/communication resources across 20–100 spacecraft under link loss, power limits, delayed observations, and member failures.

NASA's public small-spacecraft technical contact is `arc-sst@mail.nasa.gov`; MuSCAT lists Saptarshi Bandyopadhyay as maintainer.

If Yukon deliberately chooses **physical autoresearch**, NVIDIA GEAR is the credible anchor. ENPIRE lets coding agents reset robots, edit learning code, run trials, verify results, and transfer recipes. Its open gap is resource utilization: scaling from one to eight agents reduces wall time but underuses robots and grows token cost superlinearly.

The challenge would be:

> Improve a robot policy fastest under a fixed robot-minute, GPU-minute, token, and safety budget.

That requires NVIDIA/CMU to expose an evaluator and a simulation-to-hardware final. Without that commitment, it is research inspiration, not a launchable challenge.

### 6.10 Why Atlassian is the cleanest solo-versus-team product case

Atlassian belongs on the Tier‑1 shortlist because it owns both sides of the architecture decision. Rovo initially used a hierarchical orchestrator with separate Jira, Confluence, and Slack agents. Its June engineering account says that lossy summaries, isolated contexts, rigid routing, redundant searches, and poor mid-task recovery became bottlenecks as workflows lengthened. On 28 July, Atlassian shipped Long Horizon: one model retaining the full conversation and raw tool context, with adaptive effort and up to 150 iterations.

Atlassian reports that the single-loop system improved offline answer quality by 8.5%, its Confluence evaluation by 23%, and perceived latency by 37% in offline evaluation and online A/B tests. Those are company-reported product results, not a controlled paper: the stack also adopted newer models, connectors, caching, and tool discovery, so they do not isolate architecture causally. But they establish a valuable owned problem. Atlassian's MCP surface separately handles more than five million tool calls per working day from over one million monthly users, and nearly one-third are writes. Jira's 2026 agent beta gives third-party agents a governed work surface; GitHub Copilot is already its first external coding-agent partner, and Atlassian exposes an A2A gateway rather than requiring a closed Rovo-only stack. Atlassian's own Jira Frontier product lead describes coordination among multiple humans and agents as an unsolved pattern the company wants to crack.

A credible challenge would ask:

> Given fixed models, tools, context, permissions, and cost, choose one reasoning loop or a specialist team at each point in a hidden cross-product workflow—and preserve enough state to complete the exact work correctly.

Grade exact Jira/Confluence/Bitbucket-like state transitions, permission violations, duplicated actions, dropped constraints, dollars, and time. The hero replay shows the policy deciding when to stay solo, fork, rejoin, or abandon a team. The block is evaluator access: Atlassian must contribute synthetic workflow state machines, frozen model options, and exact postconditions. The technical route is the Long Horizon author group—Kang Li, Sean Culatana, Neha Bora, Qi Sun, and Steven Yoo—plus Sanchan Saxena's Jira agent product group. Without that artifact, Atlassian remains unusually good evidence, not a challenge co-owner.

### 6.11 Why IBM, Factory, and Replit are credible but not first calls

**IBM** is a legitimate Tier‑1 company owner, not a framework vendor. Its May 2026 watsonx Orchestrate announcement describes a control plane for governing and auditing thousands of third-party agents. Its July IBM Bob release adds subagents, multi-agent execution, model-to-task routing, cost telemetry, and repeatable IBM Z, IBM i, and Java-modernization workflows.

The deeper audit found that IBM also owns far more evaluator infrastructure than the earlier draft credited. [ITBench](https://github.com/itbench-hub/ITBench) provides open Kubernetes-backed SRE, CISO, and FinOps environments, a managed leaderboard, and a May 2026 evaluation partnership with Artificial Analysis. [AssetOpsBench](https://github.com/IBM/AssetOpsBench) is accepted in KDD 2026's Datasets & Benchmarks track, exposes 141+ industrial scenarios and competing orchestration frameworks, and has already supported a 365-participant/500-submission 2025 challenge plus a live IJCAI 2026 competition. Public contacts are `agent-bench-automation@ibm.com`, `saurabh.jha@ibm.com`, and AssetOpsBench lead `pateldha@us.ibm.com`.

That creates both an opportunity and a warning. IBM is challenge-ready, but “run AssetOpsBench again” is not a Yukon frontier. AssetOpsBench's published leaderboard uses an LLM judge, while the IJCAI challenge already covers physics-grounded industrial reasoning. A Yukon partnership only makes sense if IBM wants a new policy-level question with exact postconditions, fixed model/tool budgets, and product adoption in Bob or watsonx Orchestrate. That yields a plausible challenge:

> Route and coordinate heterogeneous coding agents through a hidden legacy-modernization workflow while minimizing regressions, review load, spend, and policy violations.

IBM remains sixth rather than first because its strongest open substrate already serves other leaderboards and challenges, and AssetOpsBench's current judge is not deterministic ground truth. The partnership ask is specific: contribute stripped modernization or ITBench state machines, a fixed-budget policy interface, exact environment-state graders, and an internal adoption review. Neel Sundaresan, GM for Automation and AI, is the Bob/product route; the named benchmark contacts above are a substantially more concrete research route.

**Factory** is the strongest direct product-company watchlist addition after Cursor. Its April 2026 Missions architecture explicitly separates an orchestrator, fresh workers, and independent validators; externalizes state; and reports a 16.5-hour example using 185 runs and 778.5 million tokens. Legacy-Bench supplies containerized source environments, reference solutions, hidden tests, and hundreds of legacy-software tasks. Factory also reports a $150 million Series C at a $1.5 billion valuation and production use by companies including NVIDIA, Adobe, EY, Palo Alto Networks, and Adyen.

Factory's own launch note names exactly the unanswered variables Yukon would test: when parallelization stops helping, correctness over long horizons, narrow-worker focus versus coordination cost, and whether deeper recursive management becomes bureaucracy. It says serial execution with targeted parallelism has worked better than broad parallelism so far. This is unusually strong product-problem alignment even though it is not independent evidence.

Those facts establish relevance and reach, but not neutral superiority. Missions and the reported scale/cost figures are company-authored, while Legacy-Bench compares model-agent combinations rather than alternative orchestration policies. Factory becomes a strong co-anchor if it opens a long-horizon orchestration interface, permits budget-matched external policies, and accepts an independent evaluator. Until then, treat it as a second-wave direct product target—not as academic validation for Cursor.

**Replit** is also a real product owner. Agent 4 decomposes large work into parallel isolated tasks, sequences dependencies, merges approved changes, and invokes specialized agents when work conflicts. Replit's public ViBench evaluates completed applications from natural-language requirements, and its June evaluation write-up says the same backbone was adapted for Agent 4's parallel-and-merge and subagent-decomposition experiments. Replit becomes launch-grade if it lets entrants replace the orchestration layer while keeping Agent 4's workers, sandbox, and app evaluator fixed. It ranks below the top five because the public material does not yet provide a budget-matched orchestration ablation, and ViBench's flexible evaluator itself uses an agent rather than only deterministic assertions.

## 7. Companies reviewed and why most are not anchors

### 7.1 Product owners worth tracking

| Organization | Evidence of an owned coordination problem | Role in strategy |
|---|---|---|
| Cursor | Long-running coding swarms, custom VCS, task-tree orchestration, cost/conflict data | **Primary company target** |
| Microsoft Research + GitHub | Magentic Marketplace, AARI Grand Challenges, and Copilot CLI `/fleet` over parallel coding subagents | **Primary fallback / alternate challenge** |
| Google Cloud + Google Research | Gemini Enterprise Agent Platform, open Agent Executor/ADK/A2A, and July Nature study | **Tier-one product/research alternative** |
| Salesforce | Agentforce Multi-Agent Orchestration plus ICML MAS-Orchestra and open research code | **Tier-one product/research alternative** |
| SAP | Joule Assistants/AI Agent Hub/A2A product surface plus SAP Labs' CooperBench work and Google Cloud multi-agent partnership | **Tier-one product/research alternative** |
| IBM | watsonx Orchestrate/Bob plus open ITBench and AssetOpsBench environments, managed leaderboards, KDD 2026 benchmark work, and prior challenge operations | **Tier-one, challenge-ready prospect; must avoid duplicating its live competitions and replace LLM-judge finals** |
| Atlassian | Rovo's 2026 move from hierarchical agents to one reasoning loop, Jira agent governance, and a five-million-daily-call MCP surface | **Tier-one solo-versus-team product prospect; private evaluator and confounded company ablation require neutral validation** |
| Factory | Missions orchestrator/worker/validator architecture plus Legacy-Bench hidden-test infrastructure | **Direct product peer; second-wave target pending neutral evaluator** |
| Lovable | May subagents plus July internal coding-agent stacks and a verifiable offensive-security swarm | **Adjacent product owner; consider a scoped security track, not academic validation** |
| Replit | Agent 4 parallel tasks, isolated execution, dependency sequencing, and specialized conflict-resolution agents; ViBench/A/B evaluation stack | **Direct product peer; second-wave target pending an open orchestration evaluator** |
| Sourcegraph | CodeScaleBench and 1,281-run evidence on agent failure in large repositories | **Evaluator/context partner; does not itself own team orchestration** |
| ServiceNow | Enterprise agent platform plus 2026 WebArena-Pro and DRBench research | **Tier‑1 evaluator/product prospect, but reviewed benchmarks grade agents rather than team policies** |
| Snowflake | Cortex Agents, April 2026 Agent GPA evaluation, governed cross-system actions, and production tool orchestration | **Tier‑1 product watchlist; reviewed surface orchestrates tools more than competing agent teams and exposes no neutral policy benchmark** |
| Databricks | GA Supervisor Agent, custom orchestration surface, Unity Catalog governance, MLflow tracing/evaluation | **Tier‑1 product prospect; no qualifying neutral 2026 team-policy benchmark found** |
| Meta | Open Agents Research Environments/GAIA2 supports asynchronous environments, verifiers, collaboration, and budget studies | **Strong evaluator watchlist; central public evidence is a 2025 preprint rather than a 2026 company-owned coordination frontier** |
| OpenAI | [Symphony](https://openai.com/index/open-source-codex-orchestration-symphony/) turned issue trackers into control planes; some teams reported 500% more landed PRs | Aspirational artifact owner |
| Anthropic | [16-agent C-compiler experiment](https://www.anthropic.com/engineering/building-c-compiler) showed overwrite, shared-task, and verifier failures across roughly 2,000 sessions | Strong evidence source; no clear public challenge program found |
| Moonshot/Kimi | Public claims of very large subagent/tool-call scaling | Watchlist; no peer-reviewed coordination evaluator found |
| Amazon/AWS | EvoMAS and Bedrock model ecosystem | Research baseline or alternate partner |

Cognition/Devin and other major coding-agent vendors were also searched. They are not ranked here because the reviewed primary material did not expose a 2026 neutral multi-agent evaluator, a reproducible orchestration ablation, or a concrete public partnership route. Absence from the ranking means “insufficient qualifying public evidence,” not “the company lacks internal multi-agent work.”

### 7.2 Tooling companies

CrewAI, LangGraph/LangChain, orchestration platforms, observability vendors, and agent-framework startups may help with distribution, infrastructure, or compute. They generally do not own a unique research bottleneck at the level required for the launch headline.

Use them later as:

- framework adapters;
- compute credits;
- telemetry providers;
- participant-distribution partners.

Do not let the tooling vendor define the scientific question merely because it markets “multi-agent.”

### 7.3 Physical application vendors

Agriculture, warehouse, inspection, drone, and maritime companies were reviewed because they deploy multi-robot systems. They are downstream validators unless one offers all of the following:

- a real proprietary/open benchmark;
- a scarce operational resource;
- repeatable safety-constrained evaluation;
- enough technical authority to confer legitimacy;
- data or hardware access for finalists;
- an internal path to adopt winning methods.

No farm company identified in the earlier scan currently clears that bar for this launch. Keep them out of the headline shortlist.

## 8. Fit with the current swarm.fail repository

The current repository is a good **interaction prototype**, not yet the evaluator for the recommended challenge.

It currently has:

- one JavaScript policy cloned into 50–500 identical grid agents;
- deterministic 40×40 maps;
- 12 fixed public seeds across rooms, braided mazes, and caves;
- local walls, local crowding, a fading trail, and per-agent memory;
- an instantaneous shared `env.shared` object available to every agent;
- a score of `agents × mean steps to 95% coverage`;
- one open PR submission and reproducible CI/leaderboard flow.

What is reusable:

- immediate playable hero;
- one-file algorithm submission;
- deterministic local/CI/browser scoring;
- public git history as the progress trail;
- “watch it, understand it, then compete” onboarding.

What is not reusable without replacement:

- the grid engine does not run language-model agents;
- fixed public seeds do not measure hidden generalization;
- `env.shared` is a global shared brain, so strict decentralization claims are inaccurate;
- the score measures search coverage, not task decomposition, communication, verification, conflict resolution, or model economics;
- identical agents cannot test heterogeneous role/model allocation;
- the visual floor is not evidence of a partner-owned production bottleneck.

Therefore:

> Preserve the interaction pattern and submission simplicity. Replace the evaluator only after a partner agrees on the problem.

Do not spend engineering time turning the current map game into a speculative coding-agent benchmark before a ranked company owner and an evaluator team validate the target.

## 9. Outreach plan

### 9.1 The exact ask

Do not send “would you like to partner on an agent swarm competition?” Send a bounded research proposal:

1. We observed your published bottleneck.
2. Here is the exact public question and what a solver submits.
3. Here is the deterministic evaluator and private final split we propose.
4. Here is what Yukon builds and funds.
5. We need one technical owner, one evaluation artifact/task family, and permission to run a six-week design sprint.

### 9.2 First outreach sequence

1. **Cursor research / Wilson Lin:** validate whether a public stripped harness and one partner-owned task family are possible.
2. **Microsoft Research / Gagan Bansal + AARI:** parallel fallback using Magentic Marketplace, not a cold generic Microsoft pitch.
3. **Google Agent Platform / Agent Executor + Google/MIT paper team:** connect the shipping fleet problem to an exact executable workflow family and cross-domain baselines.
4. **Salesforce AI Research / Zixuan Ke and Shafiq Joty:** request a bridge to Agentforce's orchestration owner and an executable workflow family.
5. **SAP Labs CooperBench authors + Joule/AI Agent Hub:** connect the open coordination evidence to privacy-safe executable business workflows and an internal adoption owner.
6. **Stanford CooperBench + CMU CAID teams:** validate evaluator extension, branch/merge baselines, and scientific claims.
7. **IBM ITBench/AssetOpsBench + Bob:** propose a new deterministic policy track rather than duplicating the team's live industrial competition.
8. **Atlassian Long Horizon/Jira Frontier:** propose a controlled solo-versus-team workflow challenge on stripped Jira/Confluence state machines.
9. **NASA Ames or NVIDIA GEAR:** only if leadership deliberately selects space or physical autoresearch as the vertical.

### 9.3 Draft Cursor email

**Subject:** Turning Cursor's agent-swarm coordination frontier into an open challenge

Hi Wilson / Cursor Research,

Your July swarm work makes a rare frontier unusually measurable: the same underlying task produced similar quality with roughly an 8× cost spread, while orchestration changed conflict count from tens of thousands to under a thousand. CooperBench and the July Google/MIT Nature paper independently show that adding agents can reduce verified success when task structure and coordination architecture are mismatched.

Yukon builds public challenges around company-owned technical frontiers. We propose a challenge in which teams submit an orchestration policy—not a model—to control team size, decomposition, model-role assignment, communication, merging, review, and stopping on hidden repository tasks under one fixed token, dollar, and wall-clock budget. Deterministic tests grade the output; the public hero replays the task tree, conflicts, tests, and resource use against a solo baseline.

We would build the submission protocol, sandboxes, leaderboard, replay UI, private finals, and solver distribution. We are asking Cursor for a technical scoping conversation, one stripped evaluation interface or task family, and a research owner who can tell us where an external solver result would be genuinely useful.

Would you be open to a 30-minute technical review?

### 9.4 What not to promise in outreach

- Do not promise that the challenge will improve Cursor's production system.
- Do not call the proposed benchmark the first until a co-anchor reviews the literature and scope.
- Do not promise participant numbers before distribution partners commit.
- Do not imply any cited company or researcher is already involved.
- Do not offer to reproduce proprietary training data or model internals.

## 10. Thirty-day decision plan

### Days 1–3: partner packet

- two-page Cursor brief;
- one-page Microsoft fallback brief;
- one-page Google fleet-reliability brief;
- one-page Salesforce enterprise-workflow brief;
- one-page SAP governed-workflow brief;
- challenge interface pseudocode;
- three example hidden tasks;
- score and anti-gaming specification;
- 60-second hero storyboard;
- evidence appendix from this memo.

### Days 4–10: technical validation

- contact Cursor, Microsoft, Salesforce, SAP Labs/Joule, Stanford/CMU, and Google/MIT in parallel where introductions permit;
- ask each reviewer to attack novelty, evaluator validity, and adoption value;
- record which artifact/data/compute each partner could actually contribute;
- reject conversations offering only a logo.

### Days 11–17: choose one lane

Green-light Agent Team Efficiency only if:

- a company problem owner names a useful result;
- at least one evaluator can remain public and reproducible;
- private tasks can resist contamination;
- model/compute costs are fundable;
- an academic reviewer agrees the scope is not just CooperBench, TeamBench, or EvoMAS again.

Otherwise switch cleanly to Microsoft/Magentic Marketplace rather than weakening the ask.

### Days 18–30: smallest credible prototype

- one solo baseline;
- one fixed team baseline;
- one user-submitted orchestration policy;
- three deterministic task instances;
- signed event log;
- replay with task tree, conflicts, tests, tokens, dollars, and time;
- local command and CI score agreement.

No broad platform rewrite is justified before the coalition and evaluator exist.

## 11. Decision gates

### Green-light the Cursor lane if

- Cursor supplies a technical owner;
- an evaluator interface or acceptable abstraction can be public;
- a winning policy could be tested internally without exposing proprietary code;
- the partner accepts deterministic external grading and public results.

### Green-light Microsoft if

- AARI views Yukon as challenge execution/distribution rather than duplication;
- Magentic Marketplace can expose hidden dynamic-market scenarios;
- welfare/fairness/manipulation metrics can be made resistant to gaming;
- the technical report team wants external policy/mechanism submissions.

### Kill or defer a lane if

- the partner offers branding but no artifact, technical owner, or adoption path;
- the only metric is an LLM judge;
- the task can be won by purchasing more inference;
- the evaluator cannot be independently reproduced;
- the “research gap” is already the main result of a 2026 paper;
- the challenge is merely the current maze with a new story pasted onto it.

## 12. Bottom line for the founder

The opportunity is not “make a swarm game and find a robot company.”

It is:

> **Frontier AI companies can now run enormous teams of agents, but more agents routinely create more conflict, cost, and error. Yukon can become the neutral place where orchestration algorithms compete on turning a fixed compute budget into verified work.**

Cursor is the best first company because it publicly owns that bottleneck today. Microsoft is the strongest ready-to-build alternative because it has an open multi-agent market, GitHub's coding fleet, and an explicit Grand Challenge program. Google is the strongest full-stack product/research coalition: a shipping fleet platform, open runtime/protocols, and the July Nature result. Salesforce and SAP are the next strongest product/research alternatives: Salesforce joins a 2026 product to an ICML system and negative MAS audit; SAP joins Joule/Agent Hub execution to the CooperBench team and a Google Cloud multi-agent partnership. Stanford/SAP and MIT supply independent evaluation authority.

Farm vendors are not in the launch thesis.

## 13. Primary-source index

### Company-owned frontiers

- Cursor, [Agent swarms and the new model economics](https://cursor.com/blog/agent-swarm-model-economics), 20 Jul 2026.
- Cursor, [Towards self-driving codebases](https://cursor.com/blog/self-driving-codebases), 5 Feb 2026.
- Cursor, [Scaling long-running autonomous coding](https://cursor.com/blog/scaling-agents), 14 Jan 2026.
- Cursor, [Benchmark Partners](https://cursor.com/blog/benchmarkpartners), 30 Jul 2026.
- Cursor, [How Cursor Router chooses the right model for the task](https://cursor.com/blog/how-cursor-router-works), 6 Aug 2026.
- Microsoft Research, [Magentic Marketplace blog](https://www.microsoft.com/en-us/research/blog/magentic-marketplace-an-open-source-simulation-environment-for-studying-agentic-markets/), 5 Nov 2025.
- Microsoft Research, [Magentic Marketplace 2026 Forum](https://www.microsoft.com/en-us/research/video/magentic-marketplace-testing-societies-of-agents-at-scale/), 3 Mar 2026.
- Microsoft Research, [AARI](https://www.microsoft.com/en-us/research/academic-program/agentic-ai-research-and-innovation/), accessed Aug 2026.
- GitHub, [Run multiple agents at once with `/fleet` in Copilot CLI](https://github.blog/ai-and-ml/github-copilot/run-multiple-agents-at-once-with-fleet-in-copilot-cli/), 1 Apr 2026.
- Google Cloud, [Gemini Enterprise Agent Platform](https://cloud.google.com/blog/products/ai-machine-learning/the-new-gemini-enterprise-one-platform-for-agent-development), 22 Apr 2026.
- Google Cloud, [Agent Executor: Google's distributed agent runtime](https://cloud.google.com/blog/products/ai-machine-learning/agent-executor-googles-distributed-agent-runtime), 20 May 2026.
- Google Cloud, [13 Agent Platform demos](https://cloud.google.com/blog/products/ai-machine-learning/13-demos-on-gemini-enterprise-agent-platform), 17 Jul 2026.
- Salesforce, [Summer 2026 release: Multi-Agent Orchestration in Agentforce](https://www.salesforce.com/news/stories/summer-2026-product-release-announcement/), 11 May 2026.
- Salesforce Help, [Multi-Agent Orchestration for Agentforce](https://help.salesforce.com/s/articleView?id=ai.agent_multi_orch.htm&language=en_US&type=5), 2026 beta documentation.
- Salesforce, [Why orchestration is the next frontier for agents](https://www.salesforce.com/uk/news/stories/orchestration-next-frontier-for-agents/), 15 Apr 2026.
- Salesforce AI Research, [MAS-Orchestra](https://www.salesforceairesearch.com/mas-orchestra), 2026; [Apache-2.0 code](https://github.com/SalesforceAIResearch/MAS-Orchestra).
- SAP, [The Future of the Enterprise Is Autonomous](https://news.sap.com/2026/05/future-enterprise-autonomous/), 12 May 2026; [SAP and Google Cloud multi-agent partnership](https://news.sap.com/2026/04/sap-google-cloud-expand-partnership-deploy-multi-agent-ai/), 22 Apr 2026; [Joule Agents and AI Agent Hub](https://www.sap.com/products/artificial-intelligence/ai-agents.html), accessed Aug 2026.
- IBM, [Think 2026: next-generation watsonx Orchestrate](https://newsroom.ibm.com/2026-05-05-think-2026-ibm-delivers-the-blueprint-for-the-ai-operating-model-as-the-ai-divide-widens), 5 May 2026.
- IBM, [Bob multi-agent software development and modernization workflows](https://newsroom.ibm.com/2026-07-09-ibm-advances-enterprise-ai-software-development-with-multi-agent-capabilities-and-specialized-modernization-workflows), 9 Jul 2026.
- IBM Research, [ITBench open framework and 2026 updates](https://github.com/itbench-hub/ITBench); [AAAI 2026 ITBench lab](https://research.ibm.com/publications/developing-ai-agents-for-it-automation-tasks-with-itbench), Jan 2026.
- IBM Research, [AssetOpsBench open framework, KDD 2026 record, contacts, and competition history](https://github.com/IBM/AssetOpsBench); [official IJCAI 2026 competition listing](https://2026.ijcai.org/competitions/).
- Atlassian, [Long Horizon engineering account](https://www.atlassian.com/blog/how-we-build/rovo-long-horizon-reasoning-engine), 17 Jun 2026; [shipping product results](https://www.atlassian.com/blog/rovo/long-horizon-whats-changed), 28 Jul 2026; [Rovo MCP usage](https://www.atlassian.com/blog/company-news/inside-rovo-mcp-usage), 1 Jul 2026; [Jira external-agent integration](https://support.atlassian.com/jira-software-cloud/docs/collaborate-on-work-items-with-ai-agents/) and [A2A gateway](https://www.atlassian.com/platform/rovo-mcp), accessed Aug 2026.
- Factory, [How Missions Work](https://factory.ai/news/missions-architecture), 10 Apr 2026.
- Factory, [Legacy-Bench methodology](https://docs.factory.ai/benchmarks/legacy-bench), updated Apr 2026.
- Factory, [Factory 2.0](https://factory.ai/news/software-factory), 15 Jun 2026; [Series C](https://factory.ai/news/series-c), 16 Apr 2026.
- Lovable, [Introducing subagents](https://lovable.dev/blog/subagents-in-lovable), 27 May 2026; [scaling agentic coding](https://lovable.dev/blog/85000-in-tokens-later-scaling-agentic-coding-at-lovable), 3 Jul 2026; [offensive-security agent swarms](https://lovable.dev/blog/how-we-run-swarms-of-ai-hacking-agents-against-ourselves), 24 Jul 2026.
- Replit, [Introducing Agent 4](https://replit.com/blog/introducing-agent-4-built-for-creativity), 11 Mar 2026; [evaluating and improving Replit Agent at scale](https://replit.com/blog/evaluating-and-improving-agent-at-scale), 23 Jun 2026.
- Sourcegraph, [CodeScaleBench](https://sourcegraph.com/blog/codescalebench-testing-coding-agents-on-large-codebases-and-multi-repo-software-engineering-tasks), 3 Mar 2026; [1,281-run failure analysis](https://sourcegraph.com/blog/why-coding-agents-fail-large-codebases), 8 May 2026.
- ServiceNow AI Research, [WebArena-Pro](https://www.servicenow.com/research/publication/imene-kerboua-weba-icml-workshops2026.html), ICML workshop, Jul 2026; [DRBench](https://www.servicenow.com/research/publication/amirhossein-abaskohi-drbe-iclr2026.html), ICLR 2026.
- Snowflake, [Cortex Agents platform and Agent GPA evaluation](https://www.snowflake.com/en/blog/enterprise-ai-agent-platform/), 21 Apr 2026.
- Databricks, [Supervisor Agent](https://docs.databricks.com/aws/en/agents/agent-bricks/multi-agent-supervisor), updated Jul 2026; [custom multi-agent apps](https://docs.databricks.com/aws/en/generative-ai/agent-framework/multi-agent-apps), updated Jun 2026.
- Meta AI, [Agents Research Environments and GAIA2](https://ai.meta.com/research/publications/are-scaling-up-agent-environments-and-evaluations/), preprint/platform, Sep 2025.
- OpenAI, [An open-source spec for Codex orchestration: Symphony](https://openai.com/index/open-source-codex-orchestration-symphony/), 27 Apr 2026.
- Anthropic, [Building a C compiler with a team of parallel Claudes](https://www.anthropic.com/engineering/building-c-compiler), 5 Feb 2026.
- NVIDIA GEAR, [ENPIRE project](https://research.nvidia.com/labs/gear/enpire/), Jun 2026.

### 2026 research

- Kim et al., [Capable language models can outgrow the benefits of collaboration](https://doi.org/10.1038/s42256-026-01268-y), Nature Machine Intelligence, 24 Jul 2026.
- Huang et al., [Persistent Recursive Worlds Enable Autonomous Software Evolution](https://arxiv.org/abs/2608.10450), preprint, 11 Aug 2026; [Genesis project and AGPL code](https://genesis.evox.group/).
- Ren et al., [OrchBench: Evaluating Multi-Agent Orchestration Plans in Isolation via Deterministic Simulation](https://arxiv.org/abs/2607.25656), preprint, 28 Jul 2026.
- Pappu et al., [Multi-Agent Teams Hold Experts Back](https://machinelearning.apple.com/research/multi-agent-teams-experts), ICML 2026; [MIT-licensed code](https://github.com/apappu97/multi-agent-teams-hold-experts-back).
- Zhang et al., [SILO-BENCH](https://aclanthology.org/2026.acl-long.1354/), ACL 2026; [code](https://github.com/jwyjohn/acl26-silo-bench).
- Yang et al., [When 20 Agents Fail to Sort: MAS-BENCH](https://aclanthology.org/2026.findings-acl.1698/), Findings of ACL 2026.
- Kavathekar et al., [TAMAS](https://aclanthology.org/2026.acl-long.1442/), ACL 2026; [code](https://github.com/microsoft/TAMAS).
- Dongre and Hakkani-Tur, [Embodied Multi-Agent Coordination by Aligning World Models Through Dialogue](https://aclanthology.org/2026.sigdial-1.21/), SIGDIAL 2026.
- Tessera et al., [Benchmarking Open-Ended Multi-Agent Coordination in Language Agents (`alem`)](https://arxiv.org/abs/2606.08340), preprint, Jun 2026; [code](https://github.com/alem-world/alem-env).
- Kim et al., [TeamBench](https://arxiv.org/abs/2605.07073), preprint, May 2026; [code](https://github.com/ybkim95/TeamBench).
- Khatua et al., [CooperBench](https://arxiv.org/abs/2601.13295), preprint, Jan 2026; [project/code](https://cooperbench.com/).
- Deng et al., [SWE-Milestone: Evaluating AI Agents on Continuous Software Evolution](https://arxiv.org/abs/2603.13428), ICML 2026; [MIT-licensed harness](https://github.com/DeepCommit-ai/SWE-Milestone).
- Geng and Neubig, [Effective Strategies for Asynchronous Software Engineering Agents (CAID)](https://arxiv.org/abs/2603.21489), COLM 2026; [code](https://github.com/JiayiGeng/CAID).
- Ke et al., [MAS-Orchestra](https://arxiv.org/abs/2601.14652), ICML 2026; [code](https://github.com/SalesforceAIResearch/MAS-Orchestra).
- Venkataramani et al., [MAS-ProVe: Understanding the Process Verification of Multi-Agent Systems](https://arxiv.org/abs/2602.03053), ICML 2026; [code](https://github.com/Wang-ML-Lab/MAS-ProVe).
- Zhou et al., [Multi-Agent Design: Optimizing Agents with Better Prompts and Topologies](https://arxiv.org/abs/2502.02533), ICLR 2026; Google Research [publication record](https://research.google/pubs/multi-agent-design-optimizing-agents-with-better-prompts-and-topologies/).
- Jwalapuram et al., [The Illusion of Multi-Agent Advantage](https://arxiv.org/abs/2606.13003), preprint, Jun 2026.
- Wang et al., [AgentConductor](https://arxiv.org/abs/2602.17100), ICML 2026.
- Nielsen et al., [Learning to Orchestrate Agents in Natural Language with the Conductor](https://iclr.cc/virtual/2026/poster/10009267), ICLR 2026.
- Riedl, [Emergent Coordination in Multi-Agent Language Models](https://iclr.cc/virtual/2026/poster/10009408), ICLR 2026.
- Hu et al., [EvoMAS](https://arxiv.org/abs/2602.06511), ICML 2026; [code](https://github.com/amazon-science/EvoMAS).
- Liu et al., [Learning Decentralized LLM Collaboration with Multi-Agent Actor Critic](https://arxiv.org/abs/2601.21972), ICML 2026; [code](https://github.com/OpenMLRL/CoMLRL).
- Zhong et al., [AgentWebBench](https://arxiv.org/abs/2604.10938), ICML 2026.
- NVIDIA/CMU/Berkeley, [ENPIRE](https://arxiv.org/abs/2606.19980), preprint, Jun 2026.
- OrchestraBench, [v0.1 site and disclosure](https://orchestrabench.ai/), accessed Aug 2026; not treated as peer-reviewed evidence because its cited arXiv record is still a placeholder.

### Physical swarm lane

- NASA, [What is Starling?](https://www.nasa.gov/smallspacecraft/what-is-starling/), updated 19 Mar 2026.
- NASA, [Starling mission](https://www.nasa.gov/mission/starling/), updated 26 Jun 2026.
- NASA, [Multi-Agent Swarm State of the Art Report](https://ntrs.nasa.gov/citations/20260005089), NASA/TP‑20260005089, 4 Jun 2026.
- NASA/JPL, [MuSCAT](https://github.com/nasa/muscat), open-source multi-spacecraft concept simulator.

### Ecosystem-scale safety lane

- Google DeepMind, Schmidt Sciences, Cooperative AI Foundation, ARIA, and Google.org, [Investing in multi-agent AI safety research](https://deepmind.google/blog/investing-in-multi-agent-ai-safety-research/), 11 Jun 2026.
- [Cooperative AI Foundation](https://www.cooperativeai.com/), current programs and seminars.

## 14. Evidence and claim audit

- **Partner status:** all candidates are prospects; none is represented as engaged.
- **Paper status:** Nature article, ICLR papers, and ICML-accepted papers are distinguished from preprints and company experiments.
- **Recency:** the central evidence is 2026; the Microsoft technical report is retained because the project is open and remained active in a March 2026 Research Forum.
- **Cursor numbers:** figures are reported as Cursor's own experiments, not independent benchmarks.
- **ENPIRE 99%:** the project reports **99% pass@8**, where retries are conditioned on prior failures; it is not described here as 99% one-shot success.
- **Google/MIT 87%:** this is held-out configuration selection within tested domains, not universal cross-domain prediction.
- **Magentic Marketplace:** current published scenarios use synthetic, relatively simple transactions; richer dynamic and mixed human-agent markets remain future work.
- **IBM evaluator assets:** ITBench is an ICML 2025 benchmark with active 2026 environments and partnerships; AssetOpsBench's maintained IBM repository reports KDD 2026 acceptance and its tutorial appears on the official KDD program. AssetOpsBench currently uses an LLM judge and already powers public competitions, so it is evidence of readiness—not a turnkey novel Yukon question.
- **Atlassian:** the 8.5%, 23%, and 37% figures are Atlassian's offline/A/B product reports, not peer-reviewed or architecture-only ablations. Newer models and infrastructure changed alongside topology, so the evidence establishes a product problem, not causal superiority of one agent.
- **Expert-team loss:** the current Apple publication page reports losses up to 41.1% on ML benchmarks, while older arXiv abstracts report 37.6%. This memo follows the final company/conference publication record and scopes the number to its stated benchmark subset.
- **Embodied dialogue:** the ACL Anthology landing-page abstract says 40–83 percentage points, while the authoritative proceedings PDF and its per-model table report 41–93. This memo follows the PDF.
- **Salesforce:** MAS-Orchestra is ICML 2026; *The Illusion of Multi-Agent Advantage* is a June preprint. The latter's negative findings do not erase the former; they show that results depend on baseline strength, task design, and cost controls.
- **AgentConductor:** ICML confirms adaptive topology for coding is prior art, but its benchmark tasks are isolated contest/basic programs rather than continuous multi-file repositories.
- **SWE-Milestone:** ICML's listing used the earlier title EvoClaw; the current paper/project title is SWE-Milestone. It is a long-horizon evaluator, not yet a budget-matched orchestration-policy competition.
- **Genesis:** the August paper is a preprint and reports capability from a small number of large runs. It explicitly does not establish causal superiority of recursion, and its archives do not prove zero human intervention.
- **OrchBench:** its simulator-to-real headline Pearson correlation uses six model-level observations (`p = 0.047`); the corresponding Spearman result is not conventionally significant (`p = 0.103`). Use it for screening and diagnosis, not as the sole finals judge.
- **OrchestraBench:** the site describes a working release, but as of the cutoff its paper URL/BibTeX still has placeholder arXiv fields, the private set and leaderboard are forthcoming, and the operator discloses a framework-owner conflict. It is adjacency, not validated evidence.
- **NASA:** Starling/DSA flight autonomy is not open source. MuSCAT is an open concept simulator, not a substitute for the flight stack.
- **Novelty:** the proposed combination is an inference from gaps across sources. Dynamic topology, plan simulation, long-horizon coding, and large recursive teams each already exist. Do not make a public “first” claim without partner and academic validation.
- **Tier‑1 score:** the ranking is a strategic judgment using the stated rubric, not an external rating of company quality.

## 15. Research method and search log

This was a targeted landscape review, not a systematic-review claim. The cutoff was 13 August 2026.

### Source hierarchy

1. Final peer-reviewed paper or official conference record.
2. Paper preprint plus released code/data.
3. Official company engineering/research post, documentation, repository, or product release.
4. Official challenge, university, government, or program page.

Search snippets and third-party summaries were used to discover candidates, not to support final factual claims when a primary source was available. Company metrics remain company-reported unless an independent source is explicitly named.

### Search families

- recent papers: “multi-agent orchestration benchmark,” “LLM agent coordination,” “coding agent teams,” “dynamic topology,” “agent-team efficiency,” “distributed coordination,” “long-horizon software agents,” and “adversarial multi-agent systems,” filtered across January–August 2026;
- publication venues: ACL 2026, ICLR 2026, ICML 2026, Nature Machine Intelligence, arXiv, official university project pages, and linked repositories;
- company landscape: Cursor, Microsoft/GitHub, Google, Salesforce, SAP, IBM, Atlassian, Factory, Replit, Lovable, Sourcegraph, ServiceNow, Snowflake, Databricks, Meta, OpenAI, Anthropic, AWS, NVIDIA, Moonshot/Kimi, and Cognition official sites;
- physical lane: NASA Starling/MuSCAT, NVIDIA ENPIRE, current multi-agent safety programs, and previously reviewed agricultural/warehouse/drone vendors;
- Yukon precedent: live ECDSA.fail, OpenFrontierCS, MLX.fast, Flock, and Lighter.fast pages, including their displayed organization relationships and public evaluator descriptions.

### Inclusion and exclusion rules

- Central claims require 2026 evidence. Older work appears only when its artifact remains active in 2026 or is required to explain prior art.
- A company reaches the ranked shortlist only if it owns a current product, evaluator, scarce resource, or adoption path relevant to the exact challenge.
- A research paper is labelled peer reviewed only when a journal or official conference record was found; arXiv alone remains a preprint.
- A visual demo, funding announcement, customer logo, or “multi-agent” marketing phrase does not establish a scientific benchmark.
- A farm, robotics, or tooling vendor is excluded as the headline anchor unless it can contribute a repeatable evaluator and an adoption route for the winning method.

### Remaining uncertainty

The 2026 literature is moving weekly, proprietary evaluators are not visible, and partnership likelihood cannot be inferred from public technical fit. Before public launch, a co-anchor should repeat the novelty review, reproduce the selected baselines, and confirm that the partner-owned task family can be made public or privately audited without leaking production data.
