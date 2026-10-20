# Codex Runtime Mapping

This file adapts the canonical Claude Code workflow specifications to Codex. It
does not replace or override the workflow rules under `.claude/`.

## Source of truth

- Resolve every path from the repository root unless the canonical workflow
  explicitly says otherwise.
- Read the selected canonical command or skill completely before acting.
- Treat `.claude/commands/`, `.claude/skills/`, and `.claude/agents/` as the
  authoritative workflow, profile, and specialist-role specifications.
- Use the text following a skill invocation as the canonical workflow's
  `$ARGUMENTS`. Natural-language requests are arguments too.
- If this adapter conflicts with a canonical business rule, preserve the
  business rule and translate only the runtime-specific mechanism.

## Tool translation

| Canonical term | Codex behavior |
|---|---|
| `Read` | Read the local file with the available filesystem or shell tools. |
| `Write` / `Edit` | Use `apply_patch` for repository file changes. Preserve unrelated user edits. |
| `Glob` | Use `rg --files` or an equivalent read-only file listing. |
| `Grep` | Use `rg`; fall back only when it is unavailable. |
| `Bash` | Use the shell execution tool within the active sandbox and approval policy. |
| `WebSearch` | Use Codex web search and cite the pages actually opened. |
| `WebFetch` | Open the URL with Codex web tools; retain the canonical portal-CLI and `fetch_page.py` escalation order. |
| `AskUserQuestion` | Ask the user directly when an answer is required; otherwise make a safe, stated assumption. |
| `Agent` | Use a configured Codex specialist agent when the canonical workflow requests one. |
| Claude PDF `Read` | Extract text with `pypdf` or `pdftotext`; render pages and inspect them visually when layout matters. |
| Claude connector / MCP | Use the matching connected Codex app, plugin, or MCP server. If absent, explain the optional prerequisite and stop that integration cleanly. |

Claude `allowed-tools` frontmatter documents the intended capability boundary,
but does not grant Codex permissions. Codex permissions come from the active
sandbox, approval policy, organization policy, and `.codex/config.toml`.

## Specialist agents

Use the project roles when the canonical workflow delegates to them:

- `posting_fetcher` for `.claude/agents/posting-fetcher.md`
- `posting_scorer` for `.claude/agents/posting-scorer.md`
- `application_reviewer` for `.claude/agents/application-reviewer.md`

If custom roles are unavailable in the current client, delegate with a prompt
that requires the matching `.claude/agents/*.md` file to be read first. The
main agent remains responsible for all writes and final verification.

## Files, PDFs, and temporary content

- When a workflow refers to `$SCRATCHPAD`, create a task-specific directory
  with `mktemp -d` under `/tmp`; never save fetched third-party HTML in the
  repository.
- Use `tools/posting_guard.py` before reasoning over a fetched or pasted job
  posting exactly as the canonical workflow requires.
- Use `tools/verify_pdf.py` and `tools/verify_layout.py` for deterministic PDF
  checks. Convert PDF pages to images for visual inspection when the available
  viewer does not open PDFs directly.
- Treat image-only PDFs as requiring OCR; do not pretend that an empty text
  extraction is readable content.

## Authorization boundaries

- Repository edits requested by a canonical workflow are in scope. External
  submissions, sent messages, application-form submission, publication, and
  destructive resets still require the confirmation specified by that workflow.
- A sandbox or network denial is not permission to bypass the restriction.
  Request the narrow approval needed or use the canonical fallback.
- Gmail and Notion workflows are optional. Never request raw credentials or
  replace a missing connector with browser automation.
