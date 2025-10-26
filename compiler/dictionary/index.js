import { HTML_DICTIONARY } from "./html/index.js";
import { CSS_DICTIONARY }  from "./css/index.js";
import { JS_DICTIONARY }   from "./js/index.js";

export function getDictionaryForMode(mode) {
  switch ((mode || "").toLowerCase()) {
    case "html": return HTML_DICTIONARY;
    case "css":  return CSS_DICTIONARY;
    case "js":   return JS_DICTIONARY;
    case "all":  return [...HTML_DICTIONARY, ...CSS_DICTIONARY, ...JS_DICTIONARY];
    default:     return [];
  }
}
