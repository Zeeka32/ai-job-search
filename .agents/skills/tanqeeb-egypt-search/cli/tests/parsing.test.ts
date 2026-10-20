import { describe, expect, test } from "bun:test"
import { detailTarget, parseDetailPage, parseSearchPage } from "../src/helpers.ts"
import { buildSearchUrl } from "../src/commands/search.ts"

describe("Tanqeeb Egypt parsing", () => {
  test("parses independent job cards", () => {
    const html = `<span class="results-header-count-num">1,234</span><article data-drawer-trigger="job-card" data-job-id="2123" data-job-name="Software Engineer" data-job-company="CIB" data-job-location="Egypt - Cairo" data-job-date="20 October 2026" data-job-url="/jobs-in-egypt/all/jobs/000002123.html"></article>`
    const parsed = parseSearchPage(html)
    expect(parsed.total).toBe(1234)
    expect(parsed.results[0]).toEqual({ id: "2123", title: "Software Engineer", company: "CIB", location: "Egypt - Cairo", date: "2026-10-20", url: "https://egypt.tanqeeb.com/jobs-in-egypt/all/jobs/000002123.html" })
  })

  test("builds filtered search URLs", () => {
    const url = buildSearchUrl({ query: "software engineer", location: "Cairo", jobage: 14, page: 2, limit: 5, format: "json" })
    expect(url).toContain("/s/jobs/IT-jobs/page/2")
    expect(url).toContain("state=1")
    expect(url).toContain("search_period%5D=14")
  })

  test("rejects non-Tanqeeb detail URLs", () => {
    expect(detailTarget("https://example.com/jobs/123")).toBeNull()
  })

  test("parses detail fields", () => {
    const html = `<h3 class="job-title-text">Software Engineer</h3><a class="job-meta-company">CIB</a><div class="job-meta-item">Egypt, <a>Cairo</a></div><div class="job-date" data-datetime="2026-10-20T10:00:00+03:00"></div><span>Employment</span><span>Full Time</span><a class="apply-btn" data-url="/jobs/view/2123/sid:"></a><div id="jobDescriptionBody"><p>Build secure banking software.</p></div>`
    const result = parseDetailPage(html, "2123", "https://egypt.tanqeeb.com/jobs-in-egypt/all/jobs/000002123.html")
    expect(result.title).toBe("Software Engineer")
    expect(result.company).toBe("CIB")
    expect(result.description).toContain("secure banking software")
  })
})
