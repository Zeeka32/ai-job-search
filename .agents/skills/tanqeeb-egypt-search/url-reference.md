# Tanqeeb Egypt URL reference

Validated on 2026-10-20 against public pages after `robots.txt` permitted the
search and detail paths for the repository's automation user agent.

## Search

`GET https://egypt.tanqeeb.com/s/jobs/IT-jobs[/page/<n>]`

Tanqeeb's `/s/jobs/` SEO routes are a fixed dictionary, not a general keyword
endpoint: an unknown slug returns the homepage with HTTP 200. The CLI uses the
verified `IT-jobs` category (or the dedicated `Data-Analyst-jobs` route) and
filters each structured card's title locally. A zero-result response therefore
means no matching title appeared on that page, not that an arbitrary slug was
accepted by the server.

| Filter | Parameter | Values |
|---|---|---|
| City | `state` | Cairo `1`, Alexandria `2`, Giza `4`; omit for all Egypt |
| Age | `refine[search_period]` | `1`, `3`, `7`, `14`, `30`, `90` days |
| Sort | `order_by` | `most_recent`, `relevance` |

Each result is an independent `<article data-drawer-trigger="job-card">`.
Stable `data-job-*` attributes expose the ID, title, company, location, source,
date, posting path, employment type, and other metadata. Pagination uses
`/page/<n>`. The total appears in `.results-header-count-num`.

## Detail

`GET https://egypt.tanqeeb.com/jobs-in-egypt/all/jobs/0<ID>.html`

Some aggregated postings use `jobs-in-middle-east` instead. Search always
returns the canonical path, so callers should retain it. The title is in
`.job-title-text`, company in `.job-meta-company`, timestamp in
`.job-date[data-datetime]`, description in `#jobDescriptionBody`, employment
type in the Job Details block, and the apply redirect in
`.apply-btn[data-url]`. Tanqeeb does not consistently expose a deadline.

## Access notes

- Public pages require no login or credential.
- Keep request volume low. The CLI uses an honest identifying user agent and
  bounded exponential backoff for 429/5xx responses.
- Tanqeeb aggregates other boards. Prefer the employer's own careers posting
  when `/apply` can resolve it, and deduplicate overlapping portal results.
