import { spawn } from "bun"

export async function runCLI(args: string[]) {
  const process = spawn(["bun", "run", "src/cli.ts", ...args], { cwd: import.meta.dir + "/..", stdout: "pipe", stderr: "pipe" })
  return {
    exitCode: await process.exited,
    stdout: await new Response(process.stdout).text(),
    stderr: await new Response(process.stderr).text(),
  }
}
