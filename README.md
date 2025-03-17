# Quiz Game Application

A full-stack quiz game application with a React frontend and Express backend.

## Setup

1. Install dependencies:

   ```
   npm run install-all
   ```

2. Start the application:

   ```
   npm run dev
   ```

   This will start both the client (on port 3001) and the server (on port 5000).

## Testing with Playwright

This application has been set up with Playwright for end-to-end testing. All components have been tagged with `data-testid` attributes to make them easily identifiable in tests.

### Running Tests

To run the tests in headless mode:

```
npm test
```

To run the tests with the Playwright UI:

```
npm run test:ui
```

To run the tests in headed mode (visible browser):

```
npm run test:headed
```

### Test Structure

The tests are located in the `tests` directory and are organized as follows:

- `quiz.spec.js`: Tests for the quiz game functionality

### Data Test IDs

The following data-testid attributes have been added to the application:

- `app-root`: The root element of the application
- `quiz-app`: The main application container
- `quiz-container`: The container for the quiz game
- `quiz-header`: The header section of the quiz
- `app-title`: The title of the application
- `stats-container`: The container for score and timer
- `score-display`: The score display
- `timer-display`: The timer display
- `question-card`: The card containing the question and answer options
- `question-text`: The text of the current question
- `answer-form`: The form for submitting answers
- `multiple-choice-options`: The container for multiple-choice options
- `option-{index}`: Individual multiple-choice options (e.g., `option-0`, `option-1`, etc.)
- `boolean-options`: The container for boolean options
- `option-true`: The "True" option for boolean questions
- `option-false`: The "False" option for boolean questions
- `text-answer-input`: The input field for text answers
- `submit-button`: The button to submit answers
- `feedback-message`: The feedback message after submitting an answer
- `loading-state`: The loading state of the application

These data-testid attributes can be used in Playwright tests with the `getByTestId` method:

```javascript
await page.getByTestId("app-title").click();
```

## Using with Playwright-MCP

To test the application with Playwright-MCP, you can use the data-testid attributes to identify elements:

```javascript
// Navigate to the application
await mcp__browser_navigate({ url: "http://localhost:3001" });

// Click on a multiple-choice option
await mcp__browser_click({ selector: '[data-testid="option-0"]' });

// Click the submit button
await mcp__browser_click({ selector: '[data-testid="submit-button"]' });
```