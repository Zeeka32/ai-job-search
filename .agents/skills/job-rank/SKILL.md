---
name: job-rank
description: Batch-score newly scraped jobs against the candidate profile and return a ranked shortlist with honest strengths and gaps.
---

Read `.agents/references/codex-runtime.md` and `.claude/commands/rank.md`
completely, then execute the canonical `/rank` workflow. Pass the remainder of
the user's request as `$ARGUMENTS`. Use the configured `posting_scorer` role
when the workflow delegates scoring.
