# Tapstead Button Testing

This directory contains tests to verify button styling and functionality across the Tapstead website.

## Automated Testing with Playwright

The `comprehensive-button-test.js` file contains automated tests that check all buttons across the site for:
- Proper gradient styling (teal to blue)
- Text readability
- Correct link destinations
- Emergency button styling (red)

### Setup Instructions

1. Install Playwright and its dependencies:
   ```bash
   npm install @playwright/test --save-dev
   npx playwright install
   ```

2. Create a playwright.config.js file in the project root:
   ```bash
   npx playwright init
   ```

3. Run the tests:
   ```bash
   npx playwright test tests/comprehensive-button-test.js
   ```

## Manual Testing

If you prefer to test manually, use the checklists:

- `manual-button-test.md` - Basic button functionality checklist
- `site-wide-button-test-checklist.md` - Comprehensive site-wide button testing checklist

These files provide structured guidance for manually verifying button styling and functionality without needing to set up the testing framework.
