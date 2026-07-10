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
