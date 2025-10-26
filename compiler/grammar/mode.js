// Decide and enforce output mode before anything else.
const MODE_RE = /^generate\s+file\s+as\s+(html|css|js|all)$/i;

export function parseModeAndEnforce(lines) {
  let mode = null;
  // find first non-empty line
  let firstIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim();
    if (!t) continue;
    firstIdx = i;
    if (!MODE_RE.test(t)) {
      throw new Error(
        'First statement must be a mode declaration, e.g. "Generate file as HTML".'
      );
    }
    mode = t.match(MODE_RE)[1].toLowerCase(); // html|css|js|all
    break;
  }
  if (!mode) {
    throw new Error('Missing mode. Start with "Generate file as HTML/CSS/JS/ALL".');
  }
  return { mode, startIndex: firstIdx + 1 };
}
