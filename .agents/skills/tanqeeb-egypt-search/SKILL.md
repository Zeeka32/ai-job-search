---
name: tanqeeb-egypt-search
version: 1.0.0
description: Search public Tanqeeb Egypt jobs in English or Arabic. Use for Egypt vacancies, software jobs, banking jobs, وظائف مصر, وظائف بنوك, وظائف برمجيات, and تنقيب وظائف.
context: fork
allowed-tools: Bash(bun run .agents/skills/tanqeeb-egypt-search/cli/src/cli.ts *)
---

# Tanqeeb Egypt Search

Search Tanqeeb's public Egypt listings with `search`, then fetch a selected
posting with `detail <id|url>`. Keep volume low; Tanqeeb aggregates several
boards, so deduplicate results and prefer an employer's own careers page.

```bash
bun run .agents/skills/tanqeeb-egypt-search/cli/src/cli.ts search -q "software engineer" --location Cairo --jobage 14 --limit 10 --format table
bun run .agents/skills/tanqeeb-egypt-search/cli/src/cli.ts search -q "backend developer" --location Giza --jobage 7 --format json
bun run .agents/skills/tanqeeb-egypt-search/cli/src/cli.ts search -q "cybersecurity bank" --location Egypt --jobage 30 --format table
bun run .agents/skills/tanqeeb-egypt-search/cli/src/cli.ts search -q "مهندس برمجيات" --location Cairo --jobage 14 --format table
bun run .agents/skills/tanqeeb-egypt-search/cli/src/cli.ts detail <id|url> --format plain
```

Search supports `--query/-q` (required), `--location/-l` (`Egypt`, `Cairo`,
`Giza`, `Alexandria`), `--jobage` (`1|3|7|14|30|90`), `--page`, `--limit/-n`,
and `--format json|table|plain`. JSON follows the shared `{meta, results}`
contract; missing fields are `null`. See `url-reference.md` for live anchors.
