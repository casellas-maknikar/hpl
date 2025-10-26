// Unilang dictionary: "Declare document type as html" → "<!DOCTYPE html>"

export default {
  name: "declare-doctype-html",
  when(line) {
    // matches the exact sentence, case-insensitive; tolerates extra spaces
    return /^declare\s+document\s+type\s+as\s+html$/i.test(line.trim());
  },
  emit() {
    return "<!DOCTYPE html>";
  }
};
