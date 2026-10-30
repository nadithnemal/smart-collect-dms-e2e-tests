# Smart Collect DMS: E2E UI Tests

End-to-end UI test automation for the Smart Collect Document Management System (DMS), built with [Playwright](https://playwright.dev/) (JavaScript).

These tests run in a real browser and check the DMS web app the way a user uses it. They live in a separate repository from the application code and treat the app as a black box.

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS version)
- Git
- The DMS backend and frontend running locally
- A test user account in the DMS test environment

## Setup

1. Clone the repository and open the folder:

   ```
   git clone https://github.com/nadithnemal/smart-collect-dms-e2e-tests.git
   cd smart-collect-dms-e2e-tests
   ```

2. Install dependencies and the Playwright browsers:

   ```
   npm install
   npx playwright install
   ```

3. Create your environment file from the example:

   ```
   Copy-Item .env.example .env      # Windows PowerShell
   cp .env.example .env             # macOS / Linux
   ```

4. Open `.env` and fill in the values:

   ```
   BASE_URL=http://localhost:3001
   TEST_USER_EMAIL=your-test-user@example.com
   TEST_USER_PASSWORD=your-test-password
   ```

   > `.env` is ignored by Git. Never commit real credentials.

## Running the Tests

Start the DMS frontend and backend first (the tests do not start the app), then:

```
npx playwright test                  # run all tests
npx playwright test login            # run files matching "login"
npx playwright test --headed         # watch the browser while tests run
npx playwright test --ui             # open Playwright's interactive UI mode
npx playwright show-report           # open the HTML report of the last run
```

## Project Structure

```
.
├── tests/                  # Test files (*.spec.js)
├── playwright.config.js    # Playwright configuration
├── .env.example            # Example environment variables
└── package.json
```

## Configuration Notes

- **Browser:** Chromium only for now. Firefox and WebKit can be enabled in `playwright.config.js`.
- **Evidence on failure:** a screenshot, video and trace are saved for each failed test (in `test-results/`).
- **Reports:** an HTML report is generated in `playwright-report/`.
- **CI:** not configured yet. It needs a test environment that GitHub can reach.

## Related

- Backend API tests (Jest and Supertest) are kept in the DMS project repository under `tests/api`.

## Author

Nadith, QA / Tester, Smart Collect DMS project
