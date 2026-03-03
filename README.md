# Playwright Form Tests — Elementor Contact Form

[![Playwright Tests](https://github.com/Oleg-Lukanov/Test_Task_QA_Elementor/actions/workflows/playwright.yml/badge.svg)](https://github.com/Oleg-Lukanov/Test_Task_QA_Elementor/actions/workflows/playwright.yml)
[![Allure Report](https://img.shields.io/badge/Allure-Report-brightgreen)](https://oleg-lukanov.github.io/Test_Task_QA_Elementor/)

> 📊 **Live Allure Report:** [https://oleg-lukanov.github.io/Test_Task_QA_Elementor/](https://oleg-lukanov.github.io/Test_Task_QA_Elementor/)

Automated end-to-end tests for the contact form at
[https://wtfqsbkm.elementor.cloud/elementor-36/](https://wtfqsbkm.elementor.cloud/elementor-36/)
written with **Playwright** and **TypeScript**.

---

## Test Scenarios

| # | Name | Description |
|---|------|-------------|
| 1 | Happy Path | Submits the form with valid data, asserts HTTP 200 and a success banner |
| 2 | Network Mock – 500 | Intercepts the AJAX request, returns 500, asserts an error banner and saves a screenshot |

---

## Project Structure

```
.
├── fixtures/
│   └── base.fixture.ts      # Custom Playwright fixture (ContactFormPage)
├── pages/
│   └── ContactFormPage.ts   # Page Object Model for the contact form
├── tests/
│   └── contact-form.spec.ts # Test scenarios
├── screenshots/             # Error screenshots generated at runtime
├── .env.example             # Environment variable template
├── playwright.config.ts     # Playwright configuration
└── .github/workflows/
    └── playwright.yml       # GitHub Actions CI workflow
```

---

## Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

> **Note (macOS):** WebKit requires macOS 13 (Ventura) or later.
> On older systems run only Chromium/Firefox: `npm run test:chromium`.
> WebKit runs normally in the GitHub Actions CI (ubuntu-latest).

---

## Local Setup

```bash
# 1. Clone the repo
git clone https://github.com/Oleg-Lukanov/Test_Task_QA_Elementor.git
cd Test_Task_QA_Elementor

# 2. Install Node dependencies
npm ci

# 3. Install Playwright browsers
npx playwright install --with-deps

# 4. Copy environment config
cp .env.example .env
# (optionally edit BASE_URL inside .env)
```

---

## Running Tests

### All browsers
```bash
npm test
```

### Single browser
```bash
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

### Interactive UI mode
```bash
npm run test:ui
```

---

## Viewing Reports

### Playwright HTML report
```bash
npm run report
# Opens http://localhost:9323 in your browser
```

### Allure report (requires Allure CLI)
```bash
# Install Allure CLI once (requires Java)
npm install -g allure-commandline

npm run allure:serve
```

---

## CI – GitHub Actions

The workflow is triggered **manually** from the Actions tab:

1. Go to **Actions → Playwright Tests → Run workflow**
2. (Optional) choose a specific browser: `chromium`, `firefox`, `webkit`, or `all` (default)
3. Click **Run workflow**

After the run:
- Test results are annotated directly in the run summary (GitHub reporter)
- The **Allure HTML report** is published to **GitHub Pages** and updated after every run (includes historical trend data):
  👉 [https://oleg-lukanov.github.io/Test_Task_QA_Elementor/](https://oleg-lukanov.github.io/Test_Task_QA_Elementor/)
- The **Playwright HTML report** is available as a downloadable artifact (`playwright-report`)
- **Allure results** are available as a downloadable artifact (`allure-results`)
- Error **screenshots** are available as a downloadable artifact (`screenshots`)

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `BASE_URL` | `https://wtfqsbkm.elementor.cloud` | Base URL of the site under test |

Set in `.env` locally or as a [repository variable](https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/store-information-in-variables) (`vars.BASE_URL`) in GitHub Actions.