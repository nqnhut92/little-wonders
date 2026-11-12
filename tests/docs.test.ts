import { it, expect } from "vitest";
import { mkdtempSync, cpSync, appendFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
function fixture() {
  const dir = mkdtempSync(join(tmpdir(), "lw-docs-"));
  for (const f of [
    "README.md",
    "README.vi.md",
    "AGENTS.md",
    "AGENTS.vi.md",
    "docs",
    "public/assets",
  ])
    cpSync(f, join(dir, f), { recursive: true });
  return dir;
}
const run = (cwd: string, ...args: string[]) =>
  spawnSync(process.execPath, [resolve("scripts/docs-sync.mjs"), ...args], {
    cwd,
    encoding: "utf8",
  });
it("rejects one-sided translation changes and accepts reviewed paired updates", () => {
  const dir = fixture();
  try {
    expect(run(dir).status).toBe(0);
    appendFileSync(join(dir, "README.md"), "\nAn equivalent clarification.\n");
    expect(run(dir).status).toBe(1);
    expect(run(dir, "--update", "--reviewed").status).toBe(1);
    appendFileSync(
      join(dir, "README.vi.md"),
      "\nLời giải thích tương đương.\n",
    );
    expect(run(dir, "--update", "--reviewed").status).toBe(0);
    expect(run(dir).status).toBe(0);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
it("rejects missing translated documents", () => {
  const dir = fixture();
  try {
    rmSync(join(dir, "docs/ARCHITECTURE.vi.md"));
    expect(run(dir).status).toBe(1);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
