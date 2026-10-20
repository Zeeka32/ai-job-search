# Tanqeeb Egypt CLI

Zero-runtime-dependency TypeScript CLI for Tanqeeb's public Egypt search and
detail pages. Run it with Bun from the repository root.

```bash
bun run .agents/skills/tanqeeb-egypt-search/cli/src/cli.ts search \
  -q "software engineer" --location Cairo --jobage 14 --format table
```

Development checks:

```bash
cd .agents/skills/tanqeeb-egypt-search/cli
bun install
bun run typecheck
bun run test
```
