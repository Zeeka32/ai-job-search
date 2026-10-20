---
name: job-apply
description: Evaluate a job posting and, when appropriate, produce reviewed and verified tailored CV and cover-letter files.
---

Read `.agents/references/codex-runtime.md` and `.claude/commands/apply.md`
completely, then execute the canonical `/apply` workflow. Pass the remainder of
the user's request as `$ARGUMENTS`. Use the configured `posting_fetcher` and
`application_reviewer` roles where the workflow delegates those tasks.
