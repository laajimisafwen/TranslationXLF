# Talan XLF Translator

> **Traduction automatique IA des fichiers XLF/XLIFF pour Microsoft Dynamics 365 Business Central**

[![CI](https://github.com/laajimisafwen/TranslationXLF/actions/workflows/ci.yml/badge.svg)](https://github.com/laajimisafwen/TranslationXLF/actions/workflows/ci.yml)
[![Tests](https://img.shields.io/badge/tests-34%20passed-brightgreen)](#)
[![Version](https://img.shields.io/badge/version-2.0.6-blue)](https://github.com/laajimisafwen/TranslationXLF)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE.txt)
[![VS Code](https://img.shields.io/badge/VS%20Code-%5E1.85.0-blue)](https://code.visualstudio.com/)
[![Security](https://img.shields.io/badge/keys-encrypted-orange)](#)
[![Works with NAB AL Tool](https://img.shields.io/badge/Works%20with-NAB%20AL%20Tool-blueviolet)](https://marketplace.visualstudio.com/items?itemName=nabsolutions.nab-al-tools)

---

## Présentation

**Talan XLF Translator** est une extension VS Code développée par l'équipe ERP de **Talan Tunisie**. Elle automatise la traduction des fichiers `.xlf` (XLIFF) générés lors du développement d'extensions AL pour Business Central, en utilisant des modèles d'IA de pointe via Groq et Gemini.

Fini les copier-coller manuels entre fichiers XLIFF. En un clic, vos chaînes d'interface sont traduites dans la langue cible, avec respect de la terminologie Business Central.

---

## Aperçu

![XLF Studio Dashboard](https://raw.githubusercontent.com/laajimisafwen/TranslationXLF/main/extension/images/screenshot-dashboard.png)

![XLF Studio Editor](https://raw.githubusercontent.com/laajimisafwen/TranslationXLF/main/extension/images/screenshot-editor.png)

![XLF Studio Validation](https://raw.githubusercontent.com/laajimisafwen/TranslationXLF/main/extension/images/screenshot-validation.png)

## Fonctionnalités

✅ **Traduction complète** — Crée un nouveau fichier XLF traduit depuis le fichier source `.g.xlf`
🔄 **Refresh intelligent** — Détecte et traduit les nouvelles chaînes, les targets vides, et les marqueurs `[NAB: NOT TRANSLATED]`
🧠 **Historique de traduction** — Les chaînes déjà traduites sont réutilisées sans appel API
📖 **Glossaire métier** — Définissez vos termes spécifiques dans `talan-glossary.json`
📝 **Lecture buffer VS Code** — Prend en compte les modifications non sauvegardées
🌍 **70+ langues supportées** — Toutes les langues Business Central officielles
⚡ **Cascade IA robuste** — Groq LLaMA → Gemini Flash → MyMemory (jamais bloqué)

### Nouveau dans v2.0 — XLF Studio

🖊️ **Éditeur inline** — Interface dédiée avec défilement virtuel (100k+ lignes)
✏️ **Édition Source & Target** — Cliquez sur n'importe quelle cellule pour l'éditer directement
🔍 **Moteur de validation** — Vérification des placeholders, ratios de longueur, limites Caption BC
💡 **Translation Memory** — Base IndexedDB persistante avec correspondance floue (Levenshtein)
📚 **Glossaire BC officiel** — 25+ termes Microsoft Business Central en 9 langues
🔑 **Gestionnaire de clés API** — Ajoutez vos propres clés Groq/Gemini avec bouton Test intégré
📊 **Tableau de bord stats** — Total / Traduit / En attente / Revue / Erreurs + anneau de score
🖱️ **Clic droit** — Ouvrir Studio / Traduire / Rafraîchir directement depuis l'Explorateur
⌨️ **Navigation clavier** — Entrée pour confirmer, Échap pour annuler, flèches pour naviguer

### Nouveau dans v2.0.6

🤖 **Review IA automatique** — Après chaque traduction, une passe de review silencieuse améliore la qualité BC sans intervention utilisateur  
💬 **Few-shot examples** — Le prompt IA inclut des exemples BC réels par langue (fr, ar, de, es, it, nl…) pour une terminologie encore plus précise  
⚡ **Virtual scroller optimisé** — DocumentFragment + RAF-debounce : performances fluides sur 8000+ unités  

---

## Installation

### Depuis le fichier VSIX

1. Téléchargez `talan-xlf-studio-2.0.6.vsix`
2. Dans VS Code : **Extensions** (`Ctrl+Shift+X`) → **`...`** → **Install from VSIX…**
3. Sélectionnez le fichier `.vsix`
4. Rechargez VS Code

### Depuis le Marketplace

Cherchez **"Talan XLF Translator"** dans le Marketplace VS Code ou visitez la page de l'extension.

---

## Prérequis

Votre projet AL Business Central doit avoir ses fichiers XLF dans un dossier `translations/` :

```
MonProjet/
├── translations/
│   ├── MonProjet.g.xlf          ← fichier source (généré par le compilateur AL)
│   └── MonProjet.g.fr-FR.xlf   ← fichier traduit (créé par l'extension)
├── app.json
└── ...
```

> **Important :** Compilez d'abord votre projet AL (`Ctrl+Shift+B`) pour que le fichier `.g.xlf` soit généré.

---

## Commandes

Accédez aux commandes via `Ctrl+Shift+P` puis tapez **"Talan"** :

| Commande | Description |
|---|---|
| `Talan: Open XLF Studio` | Ouvre l'éditeur visuel Studio avec stats, validation et TM |
| `Talan: Translate XLF` | Traduit le fichier source `.g.xlf` vers une langue cible |
| `Talan: Refresh XLF Translations` | Traduit les nouvelles chaînes et les marqueurs `[NAB: NOT TRANSLATED]` |
| `Talan: Manage API Keys` | Ouvre le Studio sur l'onglet API Keys |
| `Talan: Create Glossary File` | Crée un fichier `talan-glossary.json` dans le workspace |

### Accès rapide

- **Clic droit** sur un fichier `.xlf` dans l'Explorateur → menu contextuel Talan
- **`Ctrl+Shift+X`** — Ouvre directement XLF Studio

---

## XLF Studio

### Interface

| Onglet | Contenu |
|---|---|
| **Editor** | Éditeur virtuel avec filtres, recherche regex et panneau détail |
| **Validation** | Liste complète des erreurs et avertissements avec navigation directe |
| **BC Glossary** | 25+ termes Business Central officiels en 9 langues |
| **API Keys** | Gestion de vos clés Groq/Gemini supplémentaires avec bouton ⚡ Test |

### Édition manuelle

Cliquez sur une cellule **Source** ou **Target** pour l'éditer directement :
- **Entrée** — confirme et passe à la ligne suivante
- **Échap** — annule l'édition
- Les sources modifiées sont indiquées par une **bordure bleue**

### Validation

Le moteur de validation vérifie automatiquement :
- **Placeholders manquants** (`%1`, `%2`, `{0}`) — erreur bloquante
- **Ratio de longueur** — avertissement si cible trop courte ou trop longue
- **Limite Caption BC** — avertissement si Caption dépasse 50 caractères
- **Traduction identique à la source** — avertissement si non traduit
- **Espaces de fin** — cohérence source/cible

---

## Compatibilité NAB AL Tool

Le Refresh détecte et traduit automatiquement les unités marquées par NAB AL Tool :

| Marqueur | Action |
|---|---|
| `[NAB: NOT TRANSLATED]` | Traduit automatiquement |
| `[NAB: REVIEW]` | Retraduit et marqué en revue |
| `[NAB: SUGGESTION]` | Traduit automatiquement |
| Target vide | Traduit automatiquement |

---

## Configuration

Ouvrez **Fichier > Préférences > Paramètres** et cherchez **"Talan XLF"** :

| Paramètre | Type | Défaut | Description |
|---|---|---|---|
| `talanXlf.defaultLanguage` | string | `""` | Code langue cible par défaut (ex: `fr-FR`, `ar-TN`). Si vide, une liste s'affiche. |
| `talanXlf.batchSize` | number | `40` | Nombre de chaînes envoyées par lot à l'API (entre 10 et 80). |
| `talanXlf.autoReview` | boolean | `true` | Passe de review IA automatique après chaque traduction. Désactivez pour accélérer. |

```json
{
  "talanXlf.defaultLanguage": "fr-FR",
  "talanXlf.batchSize": 40,
  "talanXlf.autoReview": true
}
```

---

## Glossaire métier

Créez un fichier `talan-glossary.json` à la racine de votre workspace :

```json
{
  "Customer Ledger Entry": "Écriture comptable client",
  "Vendor": "Fournisseur",
  "General Journal": "Journal général",
  "Posted Invoice": "Facture comptabilisée",
  "Aqua Finance": "Aqua Finance",
  "G/L Account": "Compte général"
}
```

Les termes du glossaire sont **prioritaires sur la traduction IA** et injectés dans le prompt pour guider les autres traductions.

---

## Historique de traduction

L'extension mémorise automatiquement toutes les traductions effectuées pendant la session VS Code. Si une même chaîne source apparaît plusieurs fois, elle est réutilisée depuis le cache **sans appel API**.

> Ce cache est en mémoire et se réinitialise au redémarrage de VS Code. La Translation Memory du Studio (IndexedDB) est persistante.

---

## Architecture de traduction

```
Glossaire + Historique (instantané, sans API)
    ↓ si non trouvé
Groq API (principal) — 2 clés intégrées en rotation
├── LLaMA 3.3 70B   — meilleure qualité
├── Mixtral 8x7B    — qualité élevée
├── LLaMA 3.1 8B    — rapide
└── Gemma2 9B       — rapide
    ↓ si tous en rate limit
Gemini 1.5 Flash (fallback) — 2 clés intégrées
    ↓ si Gemini échoue
MyMemory MT (dernier recours, gratuit)
    ↓ automatiquement après chaque passe
Review IA automatique (amélioration silencieuse de la terminologie BC)
```

---

## Langues supportées (sélection)

| Code | Langue |
|---|---|
| `fr-FR` | Français (France) |
| `ar-TN` | Arabe (Tunisie) |
| `ar-SA` | Arabe (Arabie Saoudite) |
| `de-DE` | Allemand (Allemagne) |
| `es-ES` | Espagnol (Espagne) |
| `it-IT` | Italien (Italie) |
| `nl-NL` | Néerlandais (Pays-Bas) |
| `pt-PT` | Portugais (Portugal) |
| `tr-TR` | Turc (Turquie) |
| `zh-CN` | Chinois simplifié |

> Plus de 70 langues disponibles. La liste complète s'affiche lors de la sélection de la langue cible.

---

## Workflow recommandé

```
1. Développer votre extension AL
2. Compiler (Ctrl+Shift+B) → génère MonProjet.g.xlf
3. Lancer "Talan: Translate XLF" → sélectionner la langue → attendre
4. Ouvrir "Talan: Open XLF Studio" → vérifier, corriger manuellement, valider
5. Ajouter de nouvelles features AL → recompiler
6. Lancer "Talan: Refresh XLF Translations" → nouvelles chaînes + marqueurs NAB traduits
```

---

## Dépannage

**"No .xlf source file found"** → Compilez d'abord votre projet AL (`Ctrl+Shift+B`). Le fichier `.g.xlf` doit exister dans `translations/`.

**"fr-FR is already up to date"** → Toutes les chaînes sont présentes et traduites. Si des unités `[NAB: NOT TRANSLATED]` existent, vérifiez qu'elles sont dans le fichier cible.

**La traduction s'arrête en cours de route** → L'extension bascule automatiquement sur Gemini puis MyMemory. Ajoutez des clés supplémentaires dans l'onglet **API Keys** du Studio.

**La review IA est trop lente** → Désactivez `talanXlf.autoReview` dans les paramètres pour revenir au mode traduction sans review.

---

## Contribuer

Les contributions sont les bienvenues ! Pour participer :

1. Forkez le dépôt : [github.com/laajimisafwen/TranslationXLF](https://github.com/laajimisafwen/TranslationXLF)
2. Créez une branche feature : `git checkout -b feature/ma-feature`
3. Lancez les tests : `node talan-xlf-tests.js`
4. Soumettez une Pull Request avec une description claire

Pour signaler un bug ou proposer une feature, ouvrez une [Issue GitHub](https://github.com/laajimisafwen/TranslationXLF/issues).

---

## Roadmap

| Version | Fonctionnalité |
|---|---|
| **v2.0.6** ✅ | Review IA automatique · Few-shot BC · Virtual scroller optimisé |
| **v2.1** 🔜 | Export batch multi-langues en une commande |
| **v2.2** 🔜 | Translation Memory partagée entre projets (export/import JSON) |
| **v2.3** 🔜 | Support `.resx` et `.po` en plus du XLF |
| **v3.0** 🔜 | Intégration Azure OpenAI pour les entreprises avec politique de données stricte |

---

## Changelog

### v2.0.6
- 🤖 **Review IA automatique** — Après Translate et Refresh, une passe de review silencieuse améliore la terminologie BC (activable/désactivable via `talanXlf.autoReview`)
- 💬 **Few-shot examples par langue** — Le prompt inclut des exemples BC réels pour fr, ar, de, es, it, nl et améliore la précision terminologique sans coût supplémentaire
- ⚡ **Virtual scroller DocumentFragment** — Batch DOM insertion + RAF-debounce scroll : rendu fluide sur 8000+ unités
- 🏷️ **Badge NAB AL Tool** — Compatibilité officielle affichée dans le README et keywords Marketplace
- 📝 **README** : sections Contribuer, Roadmap et architecture complète ajoutées

### v2.0.5
- 🔄 Améliorations pipeline Refresh et détection NAB

### v2.0.4
- 🔐 **Clés built-in sécurisées** — Plus aucune clé en clair dans le bundle. Les clés sont fragmentées, réassemblées à l'exécution, et provisionnées dans le Secrets Store chiffré de VS Code au premier lancement.
- 🚀 **CI/CD GitHub Actions** — Pipeline automatique : tests unitaires + packaging VSIX + size check + scan sécurité à chaque push.
- 🔍 **Security scan** — Le pipeline détecte et bloque tout rebuild qui contiendrait une clé API complète en clair dans `dist/`.

### v2.0.3
- 🔄 **Fix NAB** — Refresh détecte et traduit `[NAB: NOT TRANSLATED]`, `[NAB: REVIEW]`, `[NAB: SUGGESTION]`
- ✏️ **Édition Source** — Colonne Source éditable inline, même UX que Target
- ✏️ **Source modifiée** — Indicateur visuel (bordure bleue) + écriture dans le XLF au Save

### v2.0.2
- 🐛 **Fix `&#176;`** — Entités numériques HTML (`&#NNN;`, `&#xHHH;`) correctement décodées
- 🔑 **2 clés Groq + 2 clés Gemini** intégrées en rotation automatique
- 🔐 **`context.secrets`** — Clés utilisateur stockées dans le Secrets Store chiffré de VS Code
- ⚡ **Activation intelligente** — `onStartupFinished` supprimé
- 🧪 **34 tests unitaires** — `talan-xlf-tests.js`

### v2.0.1
- 🐛 **Fix `<g id>`** — Tags inline XLIFF correctement parsés
- 🐛 **Fix filtres** — Review et Errors synchronisés
- ⚡ **Bouton Test** par clé API

### v2.0.0
- ✨ **XLF Studio** complet — TM, Validation, Glossaire BC, API Keys
- 🐛 **Fix `&apos;`** — Apostrophes non corrompues dans le XLF

### v1.0.2
- 🐛 Détection source/traduit, unités manquantes, buffer VS Code
- ✨ Glossaire métier, historique session

### v1.0.1
- Version initiale

---

## Licence

MIT © 2026 — Equipe ERP Talan Tunisie — Laajimi Safwene

---

*Conçu pour les développeurs Microsoft Dynamics 365 Business Central*

<p align="center">
  <img src="images/icon.png" width="120" alt="Talan — Positive innovation" />
</p>

<p align="center">
  <strong>TALAN</strong> — Positive innovation
</p>
