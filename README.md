# Toolshop Playwright Automation

![Playwright Tests](https://github.com/naaman123456/toolshop-playwright-automation/actions/workflows/playwright.yml/badge.svg)

End-to-end UI and API test automation for [Practice Software Testing (Toolshop)](https://practicesoftwaretesting.com), built with Playwright and TypeScript. The project combines API and UI testing: the API prepares test data quickly, and the UI tests the real user journeys.

## Tech Stack
- Playwright
- TypeScript
- Page Object Model (POM)
- GitHub Actions (CI)
- Jenkins (CI) — see `Jenkinsfile`

## Project Structure
```
├── .github/workflows/   # CI pipeline
├── pages/               # Page Objects: LoginPage, ProductPage, CheckoutPage
├── test-data/           # Static test data (API base URL)
├── tests/
│   ├── api/             # API tests: login, register
│   └── ui/              # UI tests: login, full purchase flow
├── utils/
│   ├── userFactory.ts   # Builds a unique user for every test
│   └── apiHelper.ts     # Registers a user through the API
└── playwright.config.ts
```

## Test Coverage

| Test | Type | What it checks |
| --- | --- | --- |
| Login with valid credentials | API | Returns 200 and an access token |
| Login with wrong password | API | Returns 401 and `Unauthorized` |
| Register a new customer | API | Returns 201 and the same email |
| Register with an existing email | API | Returns 409 and a duplicate email message |
| New customer can log in | Hybrid | User created via API, logs in via UI, name shown in menu |
| Customer can buy a product | Hybrid | User created via API, buys a product via UI with cash on delivery |

## Design Decisions

**A fresh user for every test.**
The demo accounts on the site are shared by everyone and got locked (`423 Locked`) during development. Each test now registers its own user through the API, so tests never depend on data they don't control.

**Unique emails with a timestamp and a random number.**
Tests run in parallel. Using only `Date.now()` caused two tests to get the same email and fail with `409 Conflict`. Adding a random number fixed the collision.

**API for setup, UI for the journey.**
Registering through the UI takes about 15 seconds; through the API it takes less than one. UI tests only exercise the part being tested (login, checkout).

**Waiting for proof before the next step.**
After login, tests wait for the user menu. After the first payment confirmation, they wait for `Payment was successful`. Without these waits, Playwright clicked faster than the site could respond.

**CI runs the API tests only.**
The site uses Cloudflare bot protection, which blocks the GitHub Actions servers with a "Verify you are human" page. The API is not protected, so CI runs the API suite and UI tests run locally. A future improvement is running the app in Docker inside CI.

## How to Run

```bash
git clone https://github.com/naaman123456/toolshop-playwright-automation.git
cd toolshop-playwright-automation
npm install
npx playwright install
```

Run all tests:
```bash
npx playwright test
```

Run only API or only UI tests:
```bash
npx playwright test tests/api
npx playwright test tests/ui
```

Open the HTML report:
```bash
npx playwright show-report
```

## Jenkins

The `Jenkinsfile` runs on Windows or Linux agents that have Node.js installed.

1. Install the plugins: Pipeline, Git, JUnit, HTML Publisher.
2. Create a **Pipeline** job → *Pipeline script from SCM* → Git → this repo URL, branch `*/main`, script path `Jenkinsfile`.
3. Run **Build with Parameters** and choose `TEST_SUITE` (`api`, `ui` or `all`).

Jenkins shows the test results from JUnit XML and publishes the Playwright HTML report on every build. It checks GitHub for new commits every 5 minutes.
Tests run automatically on Jenkins.