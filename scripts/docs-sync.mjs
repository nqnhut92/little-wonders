import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
const manifest = "docs/.translations.json";
const files = [
  "README.md",
  "AGENTS.md",
  "public/assets/PROVENANCE.md",
  ...readdirSync("docs")
    .filter((f) => f.endsWith(".md") && !f.endsWith(".vi.md"))
    .map((f) => "docs/" + f),
].sort();
const previous = existsSync(manifest)
  ? JSON.parse(readFileSync(manifest, "utf8"))
  : {};
const update = process.argv.includes("--update");
if (update && !process.argv.includes("--reviewed"))
  throw Error("Review both languages, then pass --reviewed.");
const next = {};
const errors = [];
for (const en of files) {
  const vi = en.replace(/\.md$/, ".vi.md");
  if (!existsSync(vi)) {
    errors.push("Missing translation: " + vi);
    continue;
  }
  const texts = [en, vi].map((p) => readFileSync(p, "utf8"));
  if (
    !texts[0].includes("](" + vi.split("/").pop() + ")") ||
    !texts[1].includes("](" + en.split("/").pop() + ")")
  )
    errors.push("Missing partner links: " + en);
  const hashes = texts.map((t) => createHash("sha256").update(t).digest("hex"));
  next[en] = { vi, hashes };
  const old = previous[en];
  if (update) {
    if (old && hashes.filter((h, i) => h !== old.hashes[i]).length === 1)
      errors.push("Only one language changed: " + en);
  } else if (!old || JSON.stringify(old) !== JSON.stringify(next[en]))
    errors.push("Translation review required: " + en);
}
for (const vi of readdirSync("docs").filter((f) => f.endsWith(".vi.md")))
  if (!existsSync("docs/" + vi.replace(".vi.md", ".md")))
    errors.push("Orphan translation: " + vi);
if (!update && Object.keys(previous).length !== files.length)
  errors.push("Manifest membership differs.");
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else if (update) {
  writeFileSync(manifest, JSON.stringify(next, null, 2) + "\n");
  console.log("Recorded " + files.length + " reviewed EN/VI pairs.");
} else console.log("Verified " + files.length + " synchronized EN/VI pairs.");
