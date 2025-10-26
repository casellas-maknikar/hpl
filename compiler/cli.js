// Usage: node compiler/cli.js src/index.uni dist/index.html
import fs from "node:fs";
import path from "node:path";
import { getDictionaryForMode } from "./dictionary/index.js";
import { checkHtmlGrammar } from "./grammar/html.js";
import { parseModeAndEnforce } from "./grammar/mode.js";

function transpileUnilang(source) {
  const rawLines = source.split(/\r?\n/);

  // 1) First non-empty line must declare the mode (HTML/CSS/JS/ALL)
  const { mode, startIndex } = parseModeAndEnforce(rawLines);

  // 2) Mode-specific grammar checks (only HTML has one right now)
  if (mode === "html") {
    checkHtmlGrammar(rawLines.slice(startIndex));
  }

  // 3) Load only the rules for this mode (keeps rule files simple)
  const DICTIONARY = getDictionaryForMode(mode);

  // 4) Translate statements after the mode line
  const out = [];
  for (let i = startIndex; i < rawLines.length; i++) {
    const line = rawLines[i].trim();
    if (!line) continue;

    let handled = false;
    for (const entry of DICTIONARY) {
      if (entry.when(line)) {
        const chunk = entry.emit(line);
        if (chunk != null) out.push(String(chunk));
        handled = true;
        break;
      }
    }

    if (!handled) {
      out.push(`<!-- Unknown instruction: ${line} -->`);
    }
  }

  return out.join("\n") + "\n";
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function main() {
  const [,, inFile, outFile] = process.argv;
  if (!inFile || !outFile) {
    console.error('Usage: node compiler/cli.js <input.uni> <output.html>');
    process.exit(1);
  }

  const src = fs.readFileSync(inFile, "utf8");

  let output;
  try {
    output = transpileUnilang(src);
  } catch (err) {
    console.error(`❌ Grammar error: ${err.message}`);
    process.exit(1);
  }

  ensureDir(path.dirname(outFile));
  fs.writeFileSync(outFile, output, "utf8");
  console.log(`✅ Transpiled ${inFile} → ${outFile}`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();

export { transpileUnilang };
