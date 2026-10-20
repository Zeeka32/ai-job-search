import { BASE_URL, htmlFetch, outputPlain, outputTable, parseSearchPage, writeError } from "../helpers.ts"

export interface SearchOptions {
  query: string
  location?: string
  jobage?: number
  page: number
  limit?: number
  format: "json" | "table" | "plain"
}

const LOCATION_IDS: Record<string, string | null> = { egypt: null, all: null, cairo: "1", alexandria: "2", giza: "4" }

export function buildSearchUrl(options: SearchOptions): string {
  const pagePart = options.page > 1 ? `/page/${options.page}` : ""
  // Tanqeeb does not accept arbitrary text in /s/jobs/<slug>: unknown slugs
  // return the homepage with HTTP 200. Use the verified IT category and
  // filter its structured cards locally so a soft-200 can never become fake
  // search output. The dedicated Data-Analyst SEO route is also verified.
  const normalized = options.query.trim().toLowerCase()
  const route = normalized === "data analyst" ? "Data-Analyst-jobs" : "IT-jobs"
  const url = new URL(`/s/jobs/${route}${pagePart}`, BASE_URL)
  if (options.location) {
    const state = LOCATION_IDS[options.location.toLowerCase()]
    if (state) url.searchParams.set("state", state)
  }
  if (options.jobage) url.searchParams.set("refine[search_period]", String(options.jobage))
  url.searchParams.set("order_by", "most_recent")
  return url.toString()
}

export async function runSearch(options: SearchOptions): Promise<number> {
  try {
    const parsed = parseSearchPage(await htmlFetch(buildSearchUrl(options)))
    const terms = options.query.toLocaleLowerCase().split(/\s+/).filter((term) => term.length > 1)
    const matched = parsed.results.filter((result) => {
      const title = result.title.toLocaleLowerCase()
      return terms.every((term) => title.includes(term))
    })
    const results = options.limit ? matched.slice(0, options.limit) : matched
    const output = { meta: { count: results.length, page: options.page }, results }
    if (options.format === "json") console.log(JSON.stringify(output, null, 2))
    else if (options.format === "table") outputTable(results)
    else outputPlain(results)
    return 0
  } catch (error) {
    writeError(error instanceof Error ? error.message : String(error), "FETCH_ERROR")
    return 1
  }
}

export function supportedLocation(value: string): boolean {
  return Object.hasOwn(LOCATION_IDS, value.toLowerCase())
}
