import { execFileSync } from "node:child_process";
import { readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(__filename), "..");
const rootsToCheck = [path.join(root, "src"), path.join(root, "scripts")];

function collectJavaScriptFiles(directory) {
  return readdirSync(directory).flatMap((name) => {
    const fullPath = path.join(directory, name);
    return statSync(fullPath).isDirectory()
      ? collectJavaScriptFiles(fullPath)
      : fullPath.endsWith(".js")
        ? [fullPath]
        : [];
  });
}

const files = rootsToCheck.flatMap(collectJavaScriptFiles);

for (const file of files) {
  execFileSync(process.execPath, ["--check", file], { stdio: "pipe" });
  console.log(`✓ ${path.relative(root, file)}`);
}

console.log(`\n✅ Sintaxis validada en ${files.length} archivos JavaScript.`);
