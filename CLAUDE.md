# CLAUDE.md - Development Guide & Conventions

This guide outlines the commands and conventions for the FlyRank AI Front-End Engineering Track Capstone Project.

## Development Commands

### Package Manager
This project uses **npm** as its primary package manager.

### Key Commands
- **Start Local Dev Server**: `npm run dev`
- **Build Production Bundle**: `npm run build`
- **Preview Production Build**: `npm run preview`
- **Run Linter (ESLint)**: `npm run lint`
- **Run Tests**: `npm run test` (if configured)

---

## Code Style & Conventions

### React & Next.js / Vite
- **Component Style**: Modern, functional React components with React hooks.
- **State Management**: Utilize local React state (`useState`, `useReducer`), context API, or lightweight libraries where appropriate.
- **Routing**: App Router conventions if using Next.js.
- **Imports Order**:
  1. React core, standard hooks, and Next/Vite system imports.
  2. External third-party packages.
  3. Local utility functions, constants, or types.
  4. Local components.
  5. Local styling or assets.

### Styling & UI
- **Styling**: Utility-first CSS using Tailwind CSS.
- **Responsiveness**: Mobile-first approach using responsive utilities (`sm:`, `md:`, `lg:`).
- **Semantics**: Accessible semantic HTML layout structure (`<header>`, `<main>`, `<section>`, `<article>`, `<footer >`). Ensure all interactive elements have unique and descriptive IDs or ARIA attributes.
- **Interactions**: Implement smooth transition effects for hover states and state changes.

### TypeScript / JavaScript Conventions
- Prefer ES6+ syntax (arrow functions, template literals, destructuring).
- Ensure explicit variable declarations; avoid any unused variables.
- Write explanatory comments for complex business logic, but prioritize self-documenting code.

## Strict Project Rules

### 1. Form Validation Stack
- **Rule**: All forms must utilize `react-hook-form` coupled with `zod` for validation schemas. Custom local state validations or uncontrolled inputs are strictly prohibited.
- **Rule**: All form elements must have the `noValidate` attribute to bypass browser-native validation and prevent test suite interference in JSDOM.

### 2. Accessibility (a11y) & Input Structure
- **Rule**: Every `<input>` or `<select>` element must have a corresponding `<label>` linked via matching `id` and `htmlFor`. 
- **Rule**: Forms must implement screen-reader error propagation: inputs with validation errors must toggle `aria-invalid="true"` and define `aria-describedby` linking to the exact `id` of the error message container.

### 3. Masked Field UI & Testing Isolation
- **Rule**: Visibility toggles for password/API Key inputs must use generic labels (e.g. `aria-label="Show key"` or `aria-label="Hide key"`). Do not include the full field name in the button's label to prevent conflicts with `getByLabelText` queries in tests.

