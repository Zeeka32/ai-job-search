import { describe, expect, test } from "bun:test"
import { runCLI } from "./helpers.ts"

describe("CLI validation", () => {
  test("rejects a missing query", async () => {
    const result = await runCLI(["search"])
    expect(result.exitCode).toBe(1)
    expect(JSON.parse(result.stderr).code).toBe("MISSING_REQUIRED")
  })
  test("rejects unknown flags", async () => {
    const result = await runCLI(["search", "-q", "software engineer", "--bogus", "yes"])
    expect(result.exitCode).toBe(1)
    expect(JSON.parse(result.stderr).code).toBe("UNKNOWN_FLAG")
  })
})
