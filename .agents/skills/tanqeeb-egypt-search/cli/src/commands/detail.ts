import { detailTarget, htmlFetch, parseDetailPage, writeError } from "../helpers.ts"

export async function runDetail(input: string, format: "json" | "plain"): Promise<number> {
  const target = detailTarget(input)
  if (!target) { writeError("detail requires a Tanqeeb Egypt job ID or posting URL", "BAD_DETAIL_TARGET"); return 1 }
  try {
    const html = await htmlFetch(target.url)
    if (!html) { writeError(`Tanqeeb posting ${target.id} was not found`, "NOT_FOUND"); return 1 }
    const result = parseDetailPage(html, target.id, target.url)
    if (format === "json") console.log(JSON.stringify(result, null, 2))
    else {
      console.log(`${result.title}\n${result.company ?? "-"}\n${result.location ?? "-"}`)
      console.log(`posted: ${result.date ?? "-"}`)
      console.log(`employment: ${result.employmentType ?? "-"}`)
      console.log(`deadline: ${result.deadline ?? "-"}`)
      console.log(`url: ${result.url}`)
      console.log(`apply: ${result.applyUrl ?? "-"}\n`)
      console.log(result.description ?? "")
    }
    return 0
  } catch (error) {
    writeError(error instanceof Error ? error.message : String(error), "FETCH_ERROR")
    return 1
  }
}
