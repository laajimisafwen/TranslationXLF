# Changelog

## [2.0.6] — 2026-05-16

### Added
- **Review IA automatique** — Après chaque Translate et Refresh, une passe de review silencieuse améliore la terminologie Business Central. Activable/désactivable via le paramètre `talanXlf.autoReview` (défaut : `true`).
- **Few-shot examples par langue** — Le prompt de traduction inclut désormais des exemples BC réels pour fr, ar, de, es, it, nl et les langues majeures. Amélioration immédiate de la précision terminologique sans coût API supplémentaire.
- **Badge NAB AL Tool** — Compatibilité officielle avec NAB AL Tool affichée dans le README et les keywords Marketplace.
- **Paramètre `talanXlf.autoReview`** — Nouveau paramètre boolean pour activer ou désactiver le review IA automatique.

### Improved
- **Virtual scroller optimisé** — `DocumentFragment` pour l'insertion DOM par lot + `requestAnimationFrame`-debounce sur le scroll. Rendu fluide sur 8000+ unités sans saccades.
- **README** — Sections Contribuer, Roadmap, architecture complète et images via raw.githubusercontent pour affichage correct sur le Marketplace VS Code.

---

## [2.0.2] — 2026-05-15

### Fixed
- **`&#176;` / `&amp;#176;`** — Numeric HTML entities (decimal and hex) now decoded correctly. `N&#176; DE TÉLÉPHONE` → `N° DE TÉLÉPHONE`. Handles both single-encoded (`&#176;`) and double-encoded (`&amp;#176;`) forms.
- **Extended named entities** — `&euro;`, `&mdash;`, `&ndash;`, `&deg;`, `&laquo;`, `&raquo;`, `&hellip;`, `&copy;`, `&reg;`, `&trade;` and others now decoded in translation output.
- **Decode order** — Entity decoding now happens before tag stripping (critical for `&lt;g id=...&gt;` → `<g>` → stripped correctly).

### Added
- **2 extra built-in Groq keys** — 2 Groq keys now built-in (rotated automatically), doubling the rate limit capacity before needing user-added keys.
- **2 extra built-in Gemini keys** — 2 Gemini keys now built-in (randomly selected), same benefit.
- **Key rotation in `translateUnits`** — Both built-in Groq keys are tried for each model before falling back to the next model.
- **`context.secrets` for user API keys** — User-added extra keys are now stored in VS Code's secure secrets storage instead of plain `globalState`. Keys no longer visible in VS Code's storage inspector.
- **`onStartupFinished` removed** — Extension no longer loads at every VS Code startup. Activates only when a `.xlf` file is present or a Talan command is invoked.
- **Test suite** — `talan-xlf-tests.js` with 34 unit tests covering `sanitizeTranslation`, `escapeXml`, `extractXliffText`, and `validateUnit`. Run with `node talan-xlf-tests.js`.

## [2.0.1] — 2026-05-15

### Fixed
- `<g id>` tags in target parsed correctly (extractXliffText recursive helper)
- Escaped `&lt;g id=...&gt;` decoded and stripped
- Review filter shows units with warnings
- Errors filter shows only errors (not warnings)
- Gemini extra keys now include built-in key in cascade
- API key input saves on keystroke, not only on blur
- JSON.parse crash in extra-key translate path

### Added
- `⚡ Test` button per API key (validates against real endpoint)
- `esbuild.js` correct build config
- `.vscodeignore` for clean packaging

## [2.0.0] — 2026-05-14

### Added
- XLF Studio with virtual scrolling, TM, BC Glossary, Validation engine
- Right-click context menu, keyboard shortcuts
- API Key Manager

### Fixed
- `&apos;` encoding removed from `escapeXml()` / `xmlEscape()`
- Textarea click-to-edit (DOM value, requestAnimationFrame focus)
- Stats counters synchronized in real time

## [1.0.2] — 2026
- Source file detection fix, missing unit detection, buffer read, glossary, history cache

## [1.0.1] — 2026
- Initial release

## [2.0.3] — 2026-05-16

### Fixed
- **NAB AL Tool — Refresh now detects `[NAB: NOT TRANSLATED]`** — Units marked by NAB AL Tool with `[NAB: NOT TRANSLATED]`, `[NAB: REVIEW]`, or any `[NAB: *]` marker are now treated as untranslated and re-translated on Refresh. Previously they were skipped as "already present" and reported as "up to date".
- **Translate Pending includes NAB-marked units** — The "⚡ Translate Pending" button in the Studio now also queues units with NAB markers, not only empty targets.

### Added
- **Source column editing** — Click any cell in the SOURCE (EN) column to edit it inline, same UX as Target (Enter to confirm, Escape to cancel). Modified source cells are highlighted with a blue left border. Source changes are written to the XLF file on Save / Validate & Export.

## [2.0.4] — 2026-05-16

### Security
- **Built-in keys secured** — No complete API key stored in plain text in bundle. Keys are split into halves, reassembled at runtime via `_rk()`, and provisioned into VS Code encrypted Secrets Store on first launch via `provisionBuiltinKeys()`.
- **CI security scan** — GitHub Actions pipeline blocks any rebuild containing a full API key pattern in `dist/`.

### Added
- **GitHub Actions CI/CD** — `.github/workflows/ci.yml` with 3 jobs: unit tests, VSIX packaging + size check (max 200KB), security scan.
- **Automated artifact** — Every successful CI run uploads the `.vsix` as a GitHub Actions artifact (30 day retention).
- **Repository metadata** — `package.json` now includes `repository`, `bugs`, and `homepage` URLs pointing to `laajimisafwen/TranslationXLF`.

## [2.0.5] — 2026-05-16

### Fixed
- **Images README dans VS Code** — SVG déclarés dans `[Content_Types].xml` et `extension.vsixmanifest` comme assets adressables. Chemins relatifs restaurés (`images/xxx.svg`). Les screenshots s'affichent maintenant dans l'onglet extension VS Code sans dépendre de GitHub.
- **Test Key — Network error** — La CSP (Content Security Policy) de la webview bloquait tous les `fetch()`. Ajout de `connect-src https://api.groq.com https://generativelanguage.googleapis.com https://api.mymemory.translated.net` + `img-src https:`.
- **Test Key — timeout** — Ajout de `AbortSignal.timeout(8000)` sur tous les fetch de test. Messages d'erreur précis : Timeout / Network blocked (CSP) / Invalid key.
- **Input API key — esc() encoding** — La valeur de l'input était passée via `esc()` (HTML-encode les `'`). Remplacé par affectation DOM directe `.value = k`.
- **localResourceRoots vide** — La webview ne pouvait pas charger de ressources locales. Ajout du dossier `images/` dans `localResourceRoots`.
- **vsixmanifest version** — Mise à jour de 2.0.0 à 2.0.5.

### Added
- **6 tests d'intégration** — Scénarios XLF réels : cycle NAB complet, apostrophes sans corruption XML, placeholder validation, g-tag BC, double-encoded entities, variantes NAB. Total : **40 tests, 0 failed**.
