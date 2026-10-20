export const BASE_URL = "https://egypt.tanqeeb.com"
const UA = "Mozilla/5.0 (compatible; tanqeeb-egypt-cli/1.0)"

export interface JobCard {
  id: string
  title: string
  company: string | null
  location: string | null
  date: string | null
  url: string
}

export interface JobDetail extends JobCard {
  description: string | null
  deadline: string | null
  employmentType: string | null
  applyUrl: string | null
}

export function writeError(error: string, code: string): void {
  process.stderr.write(JSON.stringify({ error, code }) + "\n")
}

export async function htmlFetch(url: string): Promise<string> {
  let delay = 500
  for (let attempt = 0; attempt <= 6; attempt++) {
    const response = await fetch(url, {
      headers: {
        "User-Agent": UA,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en,ar;q=0.9",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(20_000),
    })
    if (response.status === 429 || response.status >= 500) {
      if (attempt === 6) throw new Error(`Request failed: ${response.status} ${response.statusText}`)
      const jitter = Math.floor(Math.random() * 500)
      await new Promise((resolve) => setTimeout(resolve, delay + jitter))
      delay = Math.min(delay * 2, 8_000)
      continue
    }
    if (response.status === 404) return ""
    if (!response.ok) throw new Error(`Request failed: ${response.status} ${response.statusText}`)
    return response.text()
  }
  throw new Error("Request failed after maximum retries")
}

function numericEntity(value: string, radix: number): string {
  const point = Number.parseInt(value, radix)
  return point >= 0 && point <= 0x10ffff ? String.fromCodePoint(point) : ""
}

export function decodeHtml(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, value) => numericEntity(value, 10))
    .replace(/&#x([0-9a-f]+);/gi, (_, value) => numericEntity(value, 16))
    .replace(/&nbsp;/g, " ")
}

export function cleanHtml(markup: string): string {
  return decodeHtml(markup
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\/(p|li|ul|ol|div|h[1-6])>/gi, "\n")
    .replace(/<[^>]+>/g, " "))
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

function attr(openingTag: string, name: string): string | null {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const match = openingTag.match(new RegExp(`\\s${escaped}=(?:"([^"]*)"|'([^']*)')`, "i"))
  const value = match ? (match[1] ?? match[2]) : null
  return value === null ? null : decodeHtml(value).trim() || null
}

export function toIsoDate(value: string | null): string | null {
  if (!value) return null
  const relative = value.trim().toLowerCase()
  const ago = relative.match(/^(\d+)\s+(minute|hour|day)s?\s+ago$/)
  if (ago) {
    const amount = Number.parseInt(ago[1], 10)
    const unitMs = ago[2] === "minute" ? 60_000 : ago[2] === "hour" ? 3_600_000 : 86_400_000
    return new Date(Date.now() - amount * unitMs).toISOString().slice(0, 10)
  }
  if (relative === "today" || relative === "just now") return new Date().toISOString().slice(0, 10)
  if (relative === "yesterday") return new Date(Date.now() - 86_400_000).toISOString().slice(0, 10)
  const timestamp = Date.parse(value)
  return Number.isNaN(timestamp) ? null : new Date(timestamp).toISOString().slice(0, 10)
}

export function parseSearchPage(html: string): { total: number; results: JobCard[] } {
  const totalText = html.match(/class="results-header-count-num"[^>]*>([\d,]+)/i)?.[1]
  const total = totalText ? Number.parseInt(totalText.replace(/,/g, ""), 10) : 0
  const results: JobCard[] = []
  const cards = html.match(/<article\b[^>]*data-drawer-trigger="job-card"[\s\S]*?<\/article>/gi) ?? []
  for (const card of cards) {
    const openingTag = card.slice(0, card.indexOf(">") + 1)
    const id = attr(openingTag, "data-job-id")
    const title = attr(openingTag, "data-job-name")
    const path = attr(openingTag, "data-job-url")
    if (!id || !title || !path) continue
    results.push({
      id,
      title,
      company: attr(openingTag, "data-job-company"),
      location: attr(openingTag, "data-job-location"),
      date: toIsoDate(attr(openingTag, "data-job-date")),
      url: new URL(path, BASE_URL).toString(),
    })
  }
  return { total, results }
}

export function detailTarget(input: string): { id: string; url: string } | null {
  const value = input.trim()
  if (/^https?:\/\//i.test(value)) {
    let parsed: URL
    try { parsed = new URL(value) } catch { return null }
    if (parsed.hostname.toLowerCase() !== "egypt.tanqeeb.com") return null
    const match = parsed.pathname.match(/^\/jobs-in-(?:egypt|middle-east)\/all\/jobs\/(0?\d+)\.html$/i)
    if (!match) return null
    return { id: match[1].replace(/^0/, ""), url: `${BASE_URL}${parsed.pathname}` }
  }
  if (!/^0?\d+$/.test(value)) return null
  const id = value.replace(/^0/, "")
  return { id, url: `${BASE_URL}/jobs-in-egypt/all/jobs/0${id}.html` }
}

function classText(html: string, className: string): string | null {
  const escaped = className.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const match = html.match(new RegExp(`<[^>]+class="[^"]*${escaped}[^"]*"[^>]*>([\\s\\S]*?)<\\/[^>]+>`, "i"))
  return match ? cleanHtml(match[1]) || null : null
}

export function parseDetailPage(html: string, id: string, url: string): JobDetail {
  const title = classText(html, "job-title-text")
  if (!title) throw new Error("Failed to parse Tanqeeb job detail page")
  const dateRaw = html.match(/class="job-date"[^>]*data-datetime="([^"]+)"/i)?.[1] ?? null
  const locationBlock = html.match(/class="job-meta-item"[^>]*>([\s\S]*?)<\/div>/i)?.[1] ?? ""
  const descriptionBlock = html.match(/id="jobDescriptionBody"[^>]*>([\s\S]*?)<\/div>/i)?.[1] ?? ""
  const employment = html.match(/>\s*Employment\s*<\/span>\s*<span[^>]*>([\s\S]*?)<\/span>/i)?.[1]
  const applyTag = html.match(/<a\b[^>]*class="[^"]*apply-btn[^"]*"[^>]*>/i)?.[0] ?? ""
  const applyPath = attr(applyTag, "data-url")
  return {
    id,
    title,
    company: classText(html, "job-meta-company"),
    location: cleanHtml(locationBlock) || null,
    date: toIsoDate(dateRaw),
    url,
    description: cleanHtml(descriptionBlock) || null,
    deadline: null,
    employmentType: employment ? cleanHtml(employment) || null : null,
    applyUrl: applyPath ? new URL(decodeHtml(applyPath), BASE_URL).toString() : null,
  }
}

export function outputTable(results: JobCard[]): void {
  console.log("id         title                                    company                  location")
  for (const item of results) {
    console.log(`${item.id.padEnd(10)} ${item.title.slice(0, 40).padEnd(40)} ${(item.company ?? "-").slice(0, 24).padEnd(24)} ${item.location ?? "-"}`)
  }
}

export function outputPlain(results: JobCard[]): void {
  for (const item of results) {
    console.log(`id: ${item.id}`)
    console.log(`title: ${item.title}`)
    console.log(`company: ${item.company ?? "-"}`)
    console.log(`location: ${item.location ?? "-"}`)
    console.log(`date: ${item.date ?? "-"}`)
    console.log(`url: ${item.url}\n`)
  }
}
