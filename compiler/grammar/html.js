// Minimal HTML grammar checks for Unilang
// Enforces: Doctype may appear at most once, and only before any HTML body statements.

const isBlank = (l) => l.trim() === "";
const isDoctype = (l) => /^declare\s+document\s+type\s+as\s+html$/i.test(l.trim());

// For now, treat "HTML body" as: any non-blank line that's not the doctype.
const isHtmlBodyLine = (l) => !isBlank(l) && !isDoctype(l);

export function checkHtmlGrammar(lines) {
  let seenDoctype = false;
  let sawHtmlBody = false;

  for (const raw of lines) {
    const line = raw.trim();
    if (isBlank(line)) continue;

    if (isDoctype(line)) {
      if (seenDoctype) {
        throw new Error("Doctype appears more than once.");
      }
      if (sawHtmlBody) {
        throw new Error("Doctype must appear before any HTML content.");
      }
      seenDoctype = true;
      continue;
    }

    // Anything else counts as HTML body (we’ll refine later as language grows)
    sawHtmlBody = true;
  }

  // If you ever want to require doctype, uncomment:
  // if (!seenDoctype) throw new Error("Missing doctype in HTML mode.");
}
