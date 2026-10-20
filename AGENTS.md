---
framework_version: 1.0.0
---

# Agent Guidelines: AI Job Search

This workspace is structured to manage job search activities, scraper tools, CVs, cover letters, and interview preparation.

## Thin-Pointer Design (Single Source of Truth)

To prevent duplication and configuration drift across different AI agent frameworks (Claude Code, Google Antigravity, Codex, Cursor, Gemini CLI, etc.), this workspace uses a unified thin-pointer design. All agent runtimes should load the canonical specifications and candidate profiles from the files and directories below:

1. **Personal Candidate Profile:**
   - The candidate profile, contact details, education, and target preferences are defined in [CLAUDE.md](CLAUDE.md) and the individual profile methodology files under [.claude/skills/job-application-assistant/](.claude/skills/job-application-assistant/) (specifically `01-*.md` etc.).
2. **Canonical Workflow Specifications:**
   - The step-by-step instructions and triggers for tasks (setup, scrape, rank, apply, upskill, interview) are defined in the [.claude/](.claude/) directory (specifically under `.claude/skills/` and `.claude/commands/`).
   - Do not duplicate these rules or specifications. Treat `.claude/` files as the single source of truth.
3. **Portal Search Skills:**
   - Job-portal search CLIs live under [.agents/skills/](.agents/skills/) in the portable Agent Skills format (with a `SKILL.md` per portal). Codex and Antigravity discover these automatically; the `/scrape` workflow in [.claude/skills/job-scraper/](.claude/skills/job-scraper/) orchestrates them.

## Egypt Market Adaptation

- The active search strategy targets software-engineering roles in Egypt, with
  banks and financial institutions prioritized. Load
  `.claude/skills/job-scraper/search-queries.md` and `egypt-sources.md` before a
  scrape.
- Use `tanqeeb-egypt-search` and the country-agnostic LinkedIn CLI as primary
  live sources. Wuzzuf, Bayt Egypt, Glassdoor Egypt, and Jooble Egypt are
  WebSearch fallbacks under their documented access constraints.
- The Danish portal skills are retained as disabled examples and must not be
  enabled for an Egypt search.

## Codex Workflow Adapters

Codex-facing skills are thin pointers under `.agents/skills/job-*/`. They must
not copy the canonical workflow text. When one is selected:

1. Read `.agents/references/codex-runtime.md` completely.
2. Read the canonical `.claude/commands/*.md` or `.claude/skills/*/SKILL.md`
   target named by the adapter completely.
3. Execute the canonical workflow, translating only runtime-specific tool names.
4. Treat the remainder of the user's invocation as `$ARGUMENTS`.

Codex users may invoke a skill explicitly (`$job-apply <url>`) or use the
equivalent natural-language request. Claude-style names remain useful aliases in
conversation (`/apply <url>`), but they are not files to duplicate under
`.codex/commands/`.

| Workflow | Codex skill | Canonical specification |
|---|---|---|
| Setup | `$job-setup` | `.claude/commands/setup.md` |
| Scrape | `$job-scrape` | `.claude/skills/job-scraper/SKILL.md` |
| Rank | `$job-rank` | `.claude/commands/rank.md` |
| Apply | `$job-apply` | `.claude/commands/apply.md` |
| Outcome/follow-up | `$job-outcome` | `.claude/commands/outcome.md` |
| Interview | `$job-interview` | `.claude/commands/interview.md` |
| Expand profile | `$job-expand` | `.claude/commands/expand.md` |
| Upskill | `$job-upskill` | `.claude/skills/upskill/SKILL.md` |
| Gmail sync | `$job-gmail-sync` | `.claude/commands/gmail-sync.md` |
| Notion sync | `$job-notion-sync` | `.claude/commands/notion-sync.md` |
| HTML report | `$job-html-report` | `.claude/commands/html-report.md` |
| Add template | `$job-add-template` | `.claude/commands/add-template.md` |
| Add portal | `$job-add-portal` | `.claude/commands/add-portal.md` |
| Reset | `$job-reset` | `.claude/commands/reset.md` |

The three optional Codex specialist roles are declared in `.codex/config.toml`
and adapt the read-only specifications under `.claude/agents/`. If the running
Codex client does not expose custom roles, the parent agent may delegate with
the canonical role file included by reference; the parent remains responsible
for repository writes and final verification.
