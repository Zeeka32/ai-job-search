---
name: job-gmail-sync
description: Review connected Gmail for application-status signals and propose approval-gated local tracker updates without sending mail.
---

Read `.agents/references/codex-runtime.md` and `.claude/commands/gmail-sync.md`
completely, then execute the canonical `/gmail-sync` workflow. Pass the
remainder of the user's request as `$ARGUMENTS`. Use a connected Gmail app or
plugin only; if none is available, report the optional prerequisite and stop.
