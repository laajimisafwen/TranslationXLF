// ════════════════════════════════════════════════════════════
//  TALAN XLF TRANSLATOR — Unit Tests
//  Run: node talan-xlf-tests.js
//  Place in: test/talan-xlf-tests.js
// ════════════════════════════════════════════════════════════

let passed = 0, failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (e) {
    console.log(`  ❌ ${name}`);
    console.log(`     ${e.message}`);
    failed++;
  }
}

function assert(actual, expected, msg) {
  if (actual !== expected)
    throw new Error(`${msg || ''}\n     Got:      "${actual}"\n     Expected: "${expected}"`);
}

// ── Import functions from extension bundle ──────────────────
// In a real test setup, these would be imported from source TS.
// Here we inline them for standalone testing.

function sanitizeTranslation(text) {
  if (!text || typeof text !== "string") return text;
  let clean = text;
  clean = clean.replace(/&amp;/g, "\x00AMP\x00");
  clean = clean
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/&apos;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/&euro;/g, "\u20AC").replace(/&pound;/g, "\u00A3").replace(/&yen;/g, "\u00A5")
    .replace(/&copy;/g, "\u00A9").replace(/&reg;/g, "\u00AE").replace(/&trade;/g, "\u2122")
    .replace(/&deg;/g, "\u00B0").replace(/&middot;/g, "\u00B7")
    .replace(/&laquo;/g, "\u00AB").replace(/&raquo;/g, "\u00BB")
    .replace(/&mdash;/g, "\u2014").replace(/&ndash;/g, "\u2013")
    .replace(/&hellip;/g, "\u2026").replace(/&acute;/g, "\u00B4");
  clean = clean.replace(/\x00AMP\x00/g, "&");
  clean = clean.replace(/&#x([0-9a-fA-F]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)));
  clean = clean.replace(/&#([0-9]+);/g, (_, d) => { const cp = parseInt(d,10); return cp>0&&cp<65536?String.fromCharCode(cp):_; });
  clean = clean.replace(/<\/?(?:g|x|ph|it|mrk|sub|bpt|ept|bx|ex)(?:\s[^>]*)?\/?>|<[^>]+>/gi, "");
  return clean.replace(/  +/g, " ").trim();
}

function escapeXml(text) {
  if (text === null || text === undefined) return "";
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function extractXliffText(el) {
  if (el === null || el === undefined) return "";
  if (typeof el === "string" || typeof el === "number") return String(el);
  if (typeof el !== "object") return "";
  const INLINE = ["g","ph","it","mrk","sub","bpt","ept","bx","ex","x"];
  let text = el["#text"] !== undefined ? String(el["#text"]) : "";
  for (const tag of INLINE) {
    if (el[tag]) {
      const ch = Array.isArray(el[tag]) ? el[tag] : [el[tag]];
      for (const c of ch) text += extractXliffText(c);
    }
  }
  return text;
}

function validateUnit(unit, langCode) {
  const errors = [];
  const src = unit.source || '';
  const tgt = unit.target || '';
  if (!tgt.trim()) { if (src.trim()) errors.push({type:'error', msg:'Missing translation'}); return errors; }
  const srcPH = [...(src.matchAll(/%\d+|#\d+|\{[^}]+\}/g))].map(m=>m[0]);
  const tgtPH = [...(tgt.matchAll(/%\d+|#\d+|\{[^}]+\}/g))].map(m=>m[0]);
  for (const ph of srcPH) if (!tgtPH.includes(ph)) errors.push({type:'error', msg:`Missing placeholder: ${ph}`});
  for (const ph of tgtPH) if (!srcPH.includes(ph)) errors.push({type:'warning', msg:`Extra placeholder: ${ph}`});
  if (src.length > 5 && tgt.length > 0) {
    const r = tgt.length / src.length;
    if (r > 3.5) errors.push({type:'warning', msg:`Target unusually long`});
    if (r < 0.2) errors.push({type:'warning', msg:`Target unusually short`});
  }
  if (unit.property === 'Caption' && tgt.length > 50) errors.push({type:'warning', msg:`Caption exceeds 50 chars`});
  if (src === tgt && langCode && !langCode.startsWith('en') && src.length > 6 && !/^[a-zA-Z0-9_]+$/.test(src))
    errors.push({type:'warning', msg:'Target identical to source'});
  return errors;
}

// ════════════════════════════════════════════════════════════
console.log("\n📋 sanitizeTranslation");
// ════════════════════════════════════════════════════════════

test("plain text unchanged", () => {
  assert(sanitizeTranslation("Nom du client"), "Nom du client");
});
test("apostrophe preserved", () => {
  assert(sanitizeTranslation("Canal d'acquisition"), "Canal d'acquisition");
});
test("&apos; decoded to apostrophe", () => {
  assert(sanitizeTranslation("Montant d&apos;avoir (DS)"), "Montant d'avoir (DS)");
});
test("&#176; (degree/numero) decoded to °", () => {
  assert(sanitizeTranslation("N&#176; DE TÉLÉPHONE"), "N° DE TÉLÉPHONE");
});
test("&amp;#176; (double-encoded) decoded to °", () => {
  assert(sanitizeTranslation("N&amp;#176; DE TÉLÉPHONE"), "N° DE TÉLÉPHONE");
});
test("&#x00B0; hex entity decoded to °", () => {
  assert(sanitizeTranslation("Réf. &#x00B0;"), "Réf. °");
});
test("&euro; decoded to €", () => {
  assert(sanitizeTranslation("Prix &euro; HT"), "Prix € HT");
});
test("&mdash; decoded to —", () => {
  assert(sanitizeTranslation("Coût &mdash; TTC"), "Coût — TTC");
});
test("real & preserved (R&D)", () => {
  assert(sanitizeTranslation("R&amp;D Budget"), "R&D Budget");
});
test("<g id> tags stripped", () => {
  assert(sanitizeTranslation('<g id="1">Canal d\'acq</g>'), "Canal d'acq");
});
test("escaped &lt;g&gt; tags stripped", () => {
  assert(sanitizeTranslation("&lt;g id=\"105\"&gt;Canal d&apos;acquisition&lt;/g&gt;&lt;g id=\"106\"&gt; &lt;/g&gt;&lt;g id=\"107\"&gt;:&lt;/g&gt;"), "Canal d'acquisition :");
});
test("multiple spaces collapsed", () => {
  assert(sanitizeTranslation("Bonjour   monde"), "Bonjour monde");
});
test("null returns null", () => {
  assert(sanitizeTranslation(null), null);
});
test("empty string preserved", () => {
  assert(sanitizeTranslation(""), "");
});

// ════════════════════════════════════════════════════════════
console.log("\n📋 escapeXml");
// ════════════════════════════════════════════════════════════

test("& escaped to &amp;", () => {
  assert(escapeXml("R&D"), "R&amp;D");
});
test("< escaped to &lt;", () => {
  assert(escapeXml("<test>"), "&lt;test&gt;");
});
test("> escaped to &gt;", () => {
  assert(escapeXml("a > b"), "a &gt; b");
});
test("apostrophe NOT escaped (valid in XML text content)", () => {
  assert(escapeXml("Canal d'acquisition"), "Canal d'acquisition");
});
test("null returns empty string", () => {
  assert(escapeXml(null), "");
});
test("undefined returns empty string", () => {
  assert(escapeXml(undefined), "");
});
test("Montant d'avoir (DS) - no &apos; corruption", () => {
  assert(escapeXml("Montant d'avoir (DS)"), "Montant d'avoir (DS)");
});

// ════════════════════════════════════════════════════════════
console.log("\n📋 extractXliffText");
// ════════════════════════════════════════════════════════════

test("simple #text", () => {
  assert(extractXliffText({"#text": "Nom du client", "@_state": "translated"}), "Nom du client");
});
test("g-tag children concatenated", () => {
  const el = {"g": [{"#text":"Canal d'acquisition","@_id":"105"},{"@_id":"106"},{"#text":":","@_id":"107"}],"@_state":"translated"};
  assert(extractXliffText(el), "Canal d'acquisition:");
});
test("mixed #text + g child", () => {
  const el = {"#text": "Prefix ", "g": [{"#text": "suffix"}]};
  assert(extractXliffText(el), "Prefix suffix");
});
test("plain string passthrough", () => {
  assert(extractXliffText("plain"), "plain");
});
test("null returns empty string", () => {
  assert(extractXliffText(null), "");
});
test("nested g-tags", () => {
  const el = {"g": [{"g": [{"#text":"nested"}]}]};
  assert(extractXliffText(el), "nested");
});

// ════════════════════════════════════════════════════════════
console.log("\n📋 validateUnit");
// ════════════════════════════════════════════════════════════

test("missing translation = error", () => {
  const errs = validateUnit({source:"Hello", target:""}, "fr-FR");
  assert(errs.some(e=>e.type==='error'), true, "should have error");
});
test("missing %1 placeholder = error", () => {
  const errs = validateUnit({source:"Item %1 not found", target:"Article introuvable"}, "fr-FR");
  assert(errs.some(e=>e.msg.includes('%1')), true);
});
test("correct placeholders = no error", () => {
  const errs = validateUnit({source:"Item %1 %2", target:"Article %1 %2"}, "fr-FR");
  assert(errs.filter(e=>e.type==='error').length, 0);
});
test("Caption > 50 chars = warning", () => {
  const errs = validateUnit({source:"Short", target:"This is a very long caption that definitely exceeds the fifty character limit", property:"Caption"}, "fr-FR");
  assert(errs.some(e=>e.type==='warning'), true);
});
test("identical source=target for long string = warning", () => {
  const errs = validateUnit({source:"Application Name", target:"Application Name"}, "fr-FR");
  assert(errs.some(e=>e.msg.includes('identical')), true);
});
test("identical source=target short string = no warning", () => {
  const errs = validateUnit({source:"Page", target:"Page"}, "fr-FR");
  assert(errs.filter(e=>e.msg.includes('identical')).length, 0);
});
test("identical source=target for identifier = no warning", () => {
  const errs = validateUnit({source:"talProjectAPI", target:"talProjectAPI"}, "fr-FR");
  assert(errs.filter(e=>e.msg.includes('identical')).length, 0);
});

// ════════════════════════════════════════════════════════════
console.log("\n📋 Integration tests — Real XLF scenarios");
// ════════════════════════════════════════════════════════════

// ── Simulate parseXlf12 output structure ────────────────────
function parseXlf12Sim(units) {
  // Returns parsed unit array as the real function would
  return units.map(u => ({
    id: u.id,
    source: u.source,
    target: u.target || '',
    state: u.state || 'needs-translation',
    errors: []
  }));
}

// ── Simulate injectTranslations logic ───────────────────────
function buildXlf12(units) {
  const body = units.map(u => `        <trans-unit id="${u.id}" size-unit="char" translate="yes" xml:space="preserve">
          <source>${escapeXml(u.source)}</source>
          <target state="${u.state}">${escapeXml(u.target)}</target>
        </trans-unit>`).join('\n');
  return `<?xml version="1.0" encoding="utf-8"?>
<xliff version="1.2">
  <file datatype="xml" source-language="en-US" target-language="fr-FR">
    <body>
      <group id="body">
${body}
      </group>
    </body>
  </file>
</xliff>`;
}

// Integration Test 1: Full cycle — NAB unit gets translated
test("NAB: NOT TRANSLATED unit detected as pending", () => {
  const units = parseXlf12Sim([
    { id: "Table 123 - Field 456 - Property 789", source: "Customer Name", target: "[NAB: NOT TRANSLATED]", state: "translated" },
    { id: "Table 123 - Field 457 - Property 789", source: "Vendor Name", target: "Nom du fournisseur", state: "translated" }
  ]);
  const NAB_RE = /^\[NAB:/i;
  const pending = units.filter(u => !u.target || !u.target.trim() || NAB_RE.test(u.target.trim()));
  assert(pending.length, 1, "Should detect 1 NAB unit as pending");
  assert(pending[0].source, "Customer Name", "Should be the NAB unit");
});

// Integration Test 2: Source with apostrophe — no XML corruption
test("apostrophe in source/target: escapeXml preserves '", () => {
  const xml = buildXlf12([
    { id: "test-1", source: "Customer's Name", target: "Nom du client", state: "translated" },
    { id: "test-2", source: "Vendor's Account", target: "Compte d'avoir", state: "translated" }
  ]);
  assert(xml.includes("Customer's Name"), true, "apostrophe in source preserved");
  assert(xml.includes("Compte d'avoir"), true, "apostrophe in target preserved");
  assert(!xml.includes("&apos;"), true, "no &apos; encoding");
  assert(!xml.includes("&#x27;"), true, "no &#x27; encoding");
});

// Integration Test 3: Placeholder validation — full XLF unit
test("XLF unit with %1 %2: missing placeholder caught", () => {
  const u = { source: "%1 must be greater than %2.", target: "Doit être supérieur.", errors: [] };
  const errs = validateUnit(u, "fr-FR");
  assert(errs.some(e => e.type === 'error' && e.msg.includes('%1')), true, "%1 error detected");
  assert(errs.some(e => e.type === 'error' && e.msg.includes('%2')), true, "%2 error detected");
});

// Integration Test 4: g-tag extraction — real BC XLF structure
test("extractXliffText: real BC g-tag structure from MyMemory", () => {
  const parsed = {
    "g": [
      { "#text": "N°", "@_id": "1" },
      { "#text": " DE TÉLÉPHONE", "@_id": "2" }
    ],
    "@_state": "translated"
  };
  const result = extractXliffText(parsed);
  assert(result, "N° DE TÉLÉPHONE", "g-tags concatenated correctly");
});

// Integration Test 5: Double-encoded entity chain
test("sanitize chain: &amp;#176; → &#176; → °", () => {
  const input = "Réf. N&amp;#176; DE TÉLÉPHONE";
  const result = sanitizeTranslation(input);
  assert(result, "Réf. N° DE TÉLÉPHONE", "double-encoded entity resolved");
});

// Integration Test 6: NAB markers — all variants
test("isNabOrEmpty: all NAB variants detected", () => {
  function isNabOrEmpty(t) {
    if (!t || String(t).trim() === "") return true;
    const s = String(t).trim();
    if (/^\[NAB:/i.test(s)) return true;
    if (s === "[NOT TRANSLATED]" || s === "[EMPTY]") return true;
    return false;
  }
  assert(isNabOrEmpty("[NAB: NOT TRANSLATED]"), true);
  assert(isNabOrEmpty("[NAB: REVIEW]"), true);
  assert(isNabOrEmpty("[NAB: SUGGESTION]"), true);
  assert(isNabOrEmpty(""), true);
  assert(isNabOrEmpty(null), true);
  assert(isNabOrEmpty("Nom du client"), false, "real translation not flagged");
});

// ════════════════════════════════════════════════════════════
console.log(`\n${'═'.repeat(50)}`);
console.log(`  Results: ${passed} passed, ${failed} failed`);
console.log(`  ${failed === 0 ? '🎉 All tests passed!' : '⚠️  Some tests failed — review above'}`);
console.log('═'.repeat(50));
process.exit(failed > 0 ? 1 : 0);

