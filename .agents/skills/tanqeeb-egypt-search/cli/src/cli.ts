#!/usr/bin/env bun
import { runDetail } from "./commands/detail.ts"
import { runSearch, supportedLocation } from "./commands/search.ts"
import { writeError } from "./helpers.ts"

interface Flags { _: string[]; [key: string]: string | boolean | string[] }

function parseFlags(argv: string[]): Flags {
  const output: Flags = { _: [] }
  const aliases: Record<string, string> = { q: "query", l: "location", n: "limit", h: "help" }
  for (let index = 0; index < argv.length; index++) {
    const item = argv[index]
    if (!item.startsWith("-")) { output._.push(item); continue }
    const key = aliases[item.replace(/^-+/, "")] ?? item.replace(/^-+/, "")
    const next = argv[index + 1]
    if (next === undefined || next.startsWith("-")) output[key] = true
    else { output[key] = next; index++ }
  }
  return output
}

const HELP = `tanqeeb-egypt-cli — search public Tanqeeb Egypt job listings

USAGE
  bun run src/cli.ts search --query <text> [flags]
  bun run src/cli.ts detail <id|url> [--format json|plain]

SEARCH FLAGS
  --query, -q <text>       Job title, skill, company, or keyword. Required.
  --location, -l <place>  Egypt (default), Cairo, Giza, or Alexandria.
  --jobage <days>         1, 3, 7, 14, 30, or 90.
  --page <n>              1-indexed page. Default 1.
  --limit, -n <n>         Client-side result cap.
  --format <format>       json (default), table, or plain.
`

function positiveInteger(name: string, value: string | boolean | string[] | undefined, fallback?: number): number | null {
  if (value === undefined && fallback !== undefined) return fallback
  const parsed = typeof value === "string" ? Number(value) : Number.NaN
  if (!Number.isInteger(parsed) || parsed < 1) {
    writeError(`--${name} must be a whole number of at least 1`, "BAD_ARG")
    return null
  }
  return parsed
}

async function main(): Promise<number> {
  const flags = parseFlags(process.argv.slice(2))
  const command = flags._[0]
  if (!command || flags.help) { process.stdout.write(HELP); return command ? 0 : 1 }
  const known: Record<string, Set<string>> = {
    search: new Set(["query", "location", "jobage", "page", "limit", "format", "help"]),
    detail: new Set(["format", "help"]),
  }
  if (!known[command]) { writeError(`unknown command "${command}"`, "BAD_CMD"); return 1 }
  for (const key of Object.keys(flags)) {
    if (key !== "_" && !known[command].has(key)) { writeError(`unknown flag --${key}`, "UNKNOWN_FLAG"); return 1 }
  }

  if (command === "detail") {
    const input = flags._[1]
    if (!input) { writeError("detail requires an <id|url>", "MISSING_REQUIRED"); return 1 }
    const format = flags.format === undefined ? "json" : String(flags.format)
    if (format !== "json" && format !== "plain") { writeError("--format must be json or plain", "BAD_ARG"); return 1 }
    return runDetail(input, format)
  }

  const query = typeof flags.query === "string" ? flags.query.trim() : ""
  if (!query) { writeError("--query/-q requires a non-empty value", "MISSING_REQUIRED"); return 1 }
  const location = flags.location === undefined ? "Egypt" : String(flags.location)
  if (!supportedLocation(location)) { writeError("--location must be Egypt, Cairo, Giza, or Alexandria", "BAD_ARG"); return 1 }
  const page = positiveInteger("page", flags.page, 1)
  if (page === null) return 1
  const limit = flags.limit === undefined ? undefined : positiveInteger("limit", flags.limit)
  if (flags.limit !== undefined && limit === null) return 1
  const jobage = flags.jobage === undefined ? undefined : positiveInteger("jobage", flags.jobage)
  if (flags.jobage !== undefined) {
    if (jobage === null || jobage === undefined) return 1
    if (![1, 3, 7, 14, 30, 90].includes(jobage)) {
      writeError("--jobage must be one of 1, 3, 7, 14, 30, or 90", "BAD_ARG")
      return 1
    }
  }
  const format = flags.format === undefined ? "json" : String(flags.format)
  if (!["json", "table", "plain"].includes(format)) { writeError("--format must be json, table, or plain", "BAD_ARG"); return 1 }
  return runSearch({ query, location, jobage: jobage ?? undefined, page, limit: limit ?? undefined, format: format as "json" | "table" | "plain" })
}

main().then((code) => process.exit(code)).catch((error) => {
  writeError(error instanceof Error ? error.message : String(error), "INTERNAL_ERROR")
  process.exit(1)
})
