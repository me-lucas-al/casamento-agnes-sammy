import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const MAX_LINES = 150;
const SCANNED_ROOTS = ["src", "scripts"];
const SCANNED_EXTENSIONS = [".ts", ".tsx", ".mjs", ".css"];
const IGNORED_DIRECTORIES = ["node_modules", ".next", "migrations"];

function listFiles(directory) {
  return readdirSync(directory).flatMap((entry) => {
    if (IGNORED_DIRECTORIES.includes(entry)) return [];
    const path = join(directory, entry);
    return statSync(path).isDirectory() ? listFiles(path) : [path];
  });
}

function countLines(path) {
  return readFileSync(path, "utf8").split("\n").length;
}

const oversizedFiles = SCANNED_ROOTS.flatMap(listFiles)
  .filter((path) => SCANNED_EXTENSIONS.some((extension) => path.endsWith(extension)))
  .map((path) => ({ path, lines: countLines(path) }))
  .filter(({ lines }) => lines > MAX_LINES);

for (const { path, lines } of oversizedFiles) {
  console.error(`${path}: ${lines} lines (max ${MAX_LINES})`);
}

process.exit(oversizedFiles.length > 0 ? 1 : 0);
