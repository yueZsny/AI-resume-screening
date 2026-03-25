/**
 * Rewrites Tailwind v4 canonical form: text-[var(--x,#f)] -> text-(--x)
 * Handles fallbacks with nested parens (e.g. rgba(...)).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const PREFIX = "[var(--";

function replaceTailwindVarSegments(str) {
  let result = "";
  let i = 0;
  while (i < str.length) {
    const start = str.indexOf(PREFIX, i);
    if (start === -1) {
      result += str.slice(i);
      break;
    }
    result += str.slice(i, start);
    let pos = start + PREFIX.length;
    let nameEnd = pos;
    while (nameEnd < str.length && /[\w-]/.test(str[nameEnd])) nameEnd++;
    const name = str.slice(pos, nameEnd);
    pos = nameEnd;

    if (str[pos] === ")" && str[pos + 1] === "]") {
      result += `(--${name})`;
      i = pos + 2;
      continue;
    }

    if (str[pos] === ",") {
      pos++;
      let depth = 0;
      let closed = false;
      while (pos < str.length) {
        const c = str[pos];
        if (c === "(") {
          depth++;
        } else if (c === ")") {
          if (depth > 0) {
            depth--;
          } else if (str[pos + 1] === "]") {
            result += `(--${name})`;
            i = pos + 2;
            closed = true;
            break;
          } else {
            break;
          }
        }
        pos++;
      }
      if (closed) continue;
    }

    result += str[start];
    i = start + 1;
  }
  return result;
}

function walk(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, acc);
    else if (/\.(tsx|ts|jsx|js)$/.test(ent.name)) acc.push(p);
  }
  return acc;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcRoot = path.join(__dirname, "..", "src");
const files = walk(srcRoot);
let changed = 0;
for (const f of files) {
  const raw = fs.readFileSync(f, "utf8");
  let next = raw;
  let prev;
  do {
    prev = next;
    next = replaceTailwindVarSegments(prev);
  } while (next !== prev);
  if (next !== raw) {
    fs.writeFileSync(f, next);
    changed++;
  }
}
console.log(`Updated ${changed} files under src/`);
