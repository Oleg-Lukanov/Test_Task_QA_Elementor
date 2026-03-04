# Playwright Form Tests — Elementor Contact Form

[![Playwright Tests](https://github.com/Oleg-Lukanov/Test_Task_QA_Elementor/actions/workflows/playwright.yml/badge.svg)](https://github.com/Oleg-Lukanov/Test_Task_QA_Elementor/actions/workflows/playwright.yml)
[![Quality Gate](https://github.com/Oleg-Lukanov/Test_Task_QA_Elementor/actions/workflows/quality.yml/badge.svg)](https://github.com/Oleg-Lukanov/Test_Task_QA_Elementor/actions/workflows/quality.yml)
[![Allure Report](https://img.shields.io/badge/Allure-Report-brightgreen)](https://oleg-lukanov.github.io/Test_Task_QA_Elementor/)

> 📊 **Live Allure Report:** [https://oleg-lukanov.github.io/Test_Task_QA_Elementor/](https://oleg-lukanov.github.io/Test_Task_QA_Elementor/)

Automated end-to-end tests for the contact form at
[https://wtfqsbkm.elementor.cloud/elementor-36/](https://wtfqsbkm.elementor.cloud/elementor-36/)
written with **Playwright** and **TypeScript**.

---

## Test Scenarios

| #   | Name               | Description                                                                              |
| --- | ------------------ | ---------------------------------------------------------------------------------------- |
| 1   | Happy Path         | Submits the form with valid data, asserts HTTP 200 and a success banner                  |
| 2   | Network Mock – 500 | Intercepts the AJAX request, returns 500, asserts an error banner and saves a screenshot |

---

## Project Structure

```
.
├── src/
│   ├── constants/
│   │   └── index.ts              # Shared string constants (AJAX_GLOB, SCREENSHOTS_DIR)
│   ├── types/
│   │   └── index.ts              # Shared TS types (ContactFormFields, STATUS_CODES)
│   ├── pages/
│   │   ├── BasePage.ts           # Abstract base class: takeScreenshot, takeSnapshot
│   │   └── ContactFormPage.ts    # Page Object Model for the contact form
│   ├── mocks/
│   │   └── AjaxMock.ts           # Network interception helper (mockResponse<T>)
│   ├── fixtures/
│   │   └── base.fixture.ts       # Custom Playwright fixtures (test, expect)
│   ├── tests/
│   │   ├── contact-form.spec.ts  # Test scenarios
│   │   └── contact-form.spec.ts-snapshots/  # Visual regression baselines (Docker-generated)
│   └── screenshots/              # Runtime error screenshots (gitignored, dir tracked via .gitkeep)
├── docker-compose.yml            # Docker config for pixel-identical snapshot generation
├── playwright.config.ts          # Playwright configuration
├── eslint.config.js              # ESLint v9 flat config (typescript-eslint + playwright)
├── .prettierrc                   # Prettier configuration
├── .husky/
│   └── pre-commit                # Husky pre-commit hook (runs lint-staged)
└── .github/workflows/
    ├── playwright.yml            # CI: run tests in Docker, publish Allure to GitHub Pages
    └── quality.yml               # PR gate: tsc --noEmit, eslint, prettier --check
```

---

## Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- **Docker** (required for regenerating visual regression baselines)

---

## Local Setup

```bash
# 1. Clone the repo
git clone https://github.com/Oleg-Lukanov/Test_Task_QA_Elementor.git
cd Test_Task_QA_Elementor

# 2. Install dependencies (postinstall installs Chromium & Firefox automatically)
npm install

# 3. Copy environment config (optional — defaults to the live site)
cp .env.example .env
```

---

## Running Tests

### All browsers (local Playwright install)

```bash
npm test
```

### Single browser

```bash
npm run test:chromium
npm run test:firefox
```

### Inside Docker (pixel-identical to CI)

Running tests inside the official Playwright Docker image guarantees that
`toHaveScreenshot` baselines match exactly what GitHub Actions produces.

```bash
npm run test:docker
```

### Interactive UI mode

```bash
npm run test:ui
```

---

## Visual Regression Snapshots

Baseline PNGs live in `src/tests/contact-form.spec.ts-snapshots/` and are
committed to the repo. They are generated **inside Docker** to be pixel-identical
to the Linux CI environment.

To regenerate baselines after intentional UI changes:

```bash
npm run test:docker:update-snapshots
```

The `snapshotPathTemplate` in `playwright.config.ts` omits `{platform}`, so a
single PNG per browser works on both macOS (local) and Linux (CI).

---

## Code Quality

| Tool            | Purpose                                                                          |
| --------------- | -------------------------------------------------------------------------------- |
| **TypeScript**  | Strict type checking (`tsc --noEmit`)                                            |
| **ESLint**      | Linting with `typescript-eslint` + `eslint-plugin-playwright`                    |
| **Prettier**    | Consistent code formatting                                                       |
| **Husky**       | Git hooks — pre-commit runs lint-staged                                          |
| **lint-staged** | On commit: prettier + eslint --fix on `*.ts`; prettier on `*.{json,md,yml,yaml}` |

### Manual quality commands

```bash
npm run typecheck       # tsc --noEmit
npm run lint            # eslint .
npm run lint:fix        # eslint . --fix
npm run format          # prettier --write .
npm run format:check    # prettier --check .
```

---

## Viewing Reports

### Playwright HTML report

```bash
npm run report
# Opens http://localhost:9323 in your browser
```

### Allure report

```bash
# Generate static HTML from the last run's raw results
npm run allure:generate

# Open the generated report in your browser
npm run allure:open

# Or generate + serve with live reload in one step
npm run allure:serve
```

---

## CI – GitHub Actions

### `playwright.yml` — Test runner (manual trigger)

1. Go to **Actions → Playwright Tests → Run workflow**
2. (Optional) choose a browser: `chromium`, `firefox`, or `all` (default)
3. Click **Run workflow**

Tests run inside `mcr.microsoft.com/playwright:v1.58.2-noble` for deterministic
snapshots. After the run:

- **Allure HTML report** is published to **GitHub Pages** with historical trend data:
  👉 [https://oleg-lukanov.github.io/Test_Task_QA_Elementor/](https://oleg-lukanov.github.io/Test_Task_QA_Elementor/)
- **Playwright HTML report** — downloadable artifact (`playwright-report`)
- **Allure results** — downloadable artifact (`allure-results`)
- **Error screenshots** — downloadable artifact (`screenshots`)

### `quality.yml` — PR gate (automatic on every pull request)

Runs on every pull request to any branch:

1. `tsc --noEmit` — TypeScript compilation check
2. `eslint .` — linting
3. `prettier --check .` — formatting check

---

## Environment Variables

| Variable   | Default                            | Description                     |
| ---------- | ---------------------------------- | ------------------------------- |
| `BASE_URL` | `https://wtfqsbkm.elementor.cloud` | Base URL of the site under test |

Set in `.env` locally or as a [repository variable](https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/store-information-in-variables) (`vars.BASE_URL`) in GitHub Actions.
