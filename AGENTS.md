# NexVaultX Frontend — Agent Standards

This project uses **Ultracite** (zero-config preset) on **Oxlint + Oxfmt** for linting and formatting, and treats **accessibility (a11y)** as a first-class requirement — not an afterthought.

---

## Tooling: Ultracite + Oxlint/Oxfmt

### Quick Reference

| Command                     | Description                                |
| --------------------------- | ------------------------------------------ |
| `pnpm check`                | Lint + format check (read-only, no writes) |
| `pnpm fix`                  | Lint + auto-fix issues                     |
| `pnpm dlx ultracite doctor` | Diagnose setup / configuration issues      |
| `pnpm typecheck`            | TypeScript type checking (`tsc --noEmit`)  |
| `pnpm test`                 | Run Vitest suite                           |

A **Husky pre-commit hook** runs `ultracite fix` automatically on staged files, so code should always be clean before it reaches the hook.

### What's Configured

**`oxlint.config.ts`** extends these Ultracite presets:

- `ultracite/oxlint/core` — base JS/TS rules (eslint, typescript, unicorn, oxc, import, jsdoc, node, promise)
- `ultracite/oxlint/react` — React-specific rules
- `ultracite/oxlint/tanstack` — TanStack Router/Start rules
- `ultracite/oxlint/vitest` — Vitest test rules
- `ultracite/oxlint/tanstack/js-plugins` — TanStack JS plugin settings
- `ultracite/oxlint/anti-slop` — anti-pattern rules
- `eslint-plugin-sonarjs` + `oxlint-plugin-react-doctor` — additional quality checks

**`oxfmt.config.ts`** extends `ultracite/oxfmt` for formatting.

### Workflow Rules

1. **Run `pnpm check` before committing** — it's read-only and catches everything the pre-commit hook would.
2. **Run `pnpm fix` to auto-fix** — most issues are mechanically fixable.
3. **Never disable a lint rule** without a strong, documented reason. If a rule fires, fix the code, don't silence the rule.
4. **Respect the formatter** — don't hand-format code to fight Oxfmt. Write naturally, let the formatter normalize.
5. **If `ultracite doctor` reports issues**, fix the setup before writing code.

---

## Accessibility (a11y) — First-Class Requirement

Every component and page must meet **WCAG 2.2 AA**. Accessibility is not a feature — it's a baseline. If a change breaks a11y, it's a regression.

### Semantic HTML & Landmarks

- Use semantic elements: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`, `<button>`, `<a>`, `<form>`, `<label>`, `<table>`
- Never use `div` soup — a `<div>` with `role="button"` is worse than a real `<button>`
- Use exactly one `<main>` per page
- Use `<nav aria-label="...">` when multiple nav regions exist
- Use `<section aria-labelledby="...">` to associate sections with their headings
- Use `<h1>` → `<h2>` → `<h3>` hierarchy without skipping levels

### Keyboard Navigation

- All interactive elements must be reachable and operable via keyboard (Tab, Enter, Space, Arrow keys)
- Never trap focus — if a modal/dialog traps focus, provide a clear escape (Esc to close, focus returns to trigger)
- Use visible focus indicators — never remove `outline` without a replacement
- Implement proper focus management for: modals, dropdowns, menus, tabs, carousels, autocomplete
- Support `prefers-reduced-motion` — disable or minimize animations for users who request it

### ARIA — Use Sparingly and Correctly

- **Prefer native HTML semantics over ARIA.** A real `<button>` beats `role="button"` on a `<div>`
- Use ARIA only when native semantics don't exist (e.g., `aria-expanded` on disclosure buttons, `aria-current` on active nav items, `role="alert"` for live errors)
- Never override native roles (don't put `role="button"` on an `<a>` that navigates — use a real link)
- Use `aria-label` only when there's no visible text label
- Use `aria-live` for dynamic content updates (screen reader announcements) — `polite` for non-urgent, `assertive` for urgent
- Use `aria-describedby` to associate helper text with inputs
- Use `aria-invalid` + `aria-describedby` together for form validation errors

### Forms

- Every input must have a visible `<label>` (or `aria-label` if the label is icon-only)
- Use `type` correctly: `email`, `password`, `search`, `tel`, `number`, etc.
- Show validation errors inline, near the field, with `aria-invalid` and `aria-describedby`
- Error messages must be announced to screen readers (`role="alert"` or `aria-live="polite"`)
- Use `autocomplete` attributes where appropriate (`email`, `username`, `current-password`, etc.)
- Minimum touch target: **44×44px** for interactive elements

### Color & Contrast

- Text contrast must meet **WCAG AA: 4.5:1** for normal text, **3:1** for large text (≥18pt or ≥14pt bold)
- UI component contrast (borders, icons, focus rings): **3:1** minimum
- Never rely on color alone to convey meaning — pair color with icons, text, or patterns
- Test both light and dark themes — contrast that passes in one may fail in the other
- Use the project's OKLCH semantic tokens (`--primary`, `--muted-foreground`, etc.) — never hardcode colors

### Images & Media

- Every `<img>` needs meaningful `alt` text — empty `alt=""` for decorative images, descriptive text for informative ones
- Don't put critical information in images — use real text
- Provide captions/transcripts for video and audio content
- Don't autoplay media with sound

### Motion & Animation

- All animations must respect `prefers-reduced-motion: reduce`
- Keep animations under 400ms for UI interactions (see animation standards)
- Use `transform`/`opacity` for animations — never animate `width`/`height`/`top`/`left`
- Don't create flashing content (WCAG 2.3.1 — no more than 3 flashes per second)

### Testing a11y

- Test with keyboard only (no mouse) — every flow must work
- Test with a screen reader (NVDA, VoiceOver, or axe DevTools)
- Check contrast at all breakpoints and in both themes
- Verify heading hierarchy and landmark structure
- Use `@testing-library/react` queries that mirror user behavior: `getByRole`, `getByLabelText`, `getByText` — never query by CSS class

---

## Core Code Standards

Write code that is **accessible, performant, type-safe, and maintainable**. Focus on clarity and explicit intent over brevity.

### Type Safety & Explicitness

- Use explicit types for function parameters and return values when they enhance clarity
- Prefer `unknown` over `any` when the type is genuinely unknown
- Use const assertions (`as const`) for immutable values and literal types
- Leverage TypeScript's type narrowing instead of type assertions
- Use meaningful variable names instead of magic numbers — extract constants with descriptive names

### Modern JavaScript/TypeScript

- Use arrow functions for callbacks and short functions
- Prefer `for...of` loops over `.forEach()` and indexed `for` loops
- Use optional chaining (`?.`) and nullish coalescing (`??`) for safer property access
- Prefer template literals over string concatenation
- Use destructuring for object and array assignments
- Use `const` by default, `let` only when reassignment is needed, never `var`

### Async & Promises

- Always `await` promises in async functions — don't forget to use the return value
- Use `async/await` syntax instead of promise chains for better readability
- Handle errors appropriately in async code with try-catch blocks
- Don't use async functions as Promise executors

### React & JSX

- Use function components over class components
- Call hooks at the top level only, never conditionally
- Specify all dependencies in hook dependency arrays correctly
- Use the `key` prop for elements in iterables (prefer unique IDs over array indices)
- Nest children between opening and closing tags instead of passing as props
- Don't define components inside other components
- Use semantic HTML and ARIA attributes for accessibility (see a11y section above)

### Error Handling & Debugging

- Remove `console.log`, `debugger`, and `alert` statements from production code
- Throw `Error` objects with descriptive messages, not strings or other values
- Use `try-catch` blocks meaningfully — don't catch errors just to rethrow them
- Prefer early returns over nested conditionals for error cases

### Code Organization

- Keep functions focused and under reasonable cognitive complexity limits
- Extract complex conditions into well-named boolean variables
- Use early returns to reduce nesting
- Prefer simple conditionals over nested ternary operators
- Group related code together and separate concerns

### Security

- Add `rel="noopener"` when using `target="_blank"` on links
- Avoid `dangerouslySetInnerHTML` unless absolutely necessary
- Don't use `eval()` or assign directly to `document.cookie`
- Validate and sanitize user input

### Performance

- Avoid spread syntax in accumulators within loops
- Use top-level regex literals instead of creating them in loops
- Prefer specific imports over namespace imports
- Avoid barrel files (index files that re-export everything)
- Use proper image components (e.g., Next.js `<Image>`) over `<img>` tags

### Framework-Specific Guidance

**React 19+:**

- Use ref as a prop instead of `React.forwardRef`

**TanStack Start:**

- Use file-based routing under `src/routes/`
- Use `createFileRoute` for route definitions
- Use Server Functions for data fetching where appropriate
- Use `HeadContent`/`Scripts` in the root layout for head management

---

## Testing

- Write assertions inside `it()` or `test()` blocks
- Avoid done callbacks in async tests — use async/await instead
- Don't use `.only` or `.skip` in committed code
- Keep test suites reasonably flat — avoid excessive `describe` nesting
- Query like a user: `getByRole`, `getByLabelText`, `getByText` — never by CSS class
- Test both success and failure cases
- Mock external dependencies

---

## When Oxlint + Oxfmt Can't Help

Oxlint + Oxfmt's linter will catch most issues automatically. Focus your attention on:

1. **Business logic correctness** — Oxlint + Oxfmt can't validate your algorithms
2. **Meaningful naming** — Use descriptive names for functions, variables, and types
3. **Architecture decisions** — Component structure, data flow, and API design
4. **Edge cases** — Handle boundary conditions and error states
5. **User experience** — Accessibility, performance, and usability considerations
6. **Documentation** — Add comments for complex logic, but prefer self-documenting code

---

Most formatting and common issues are automatically fixed by Oxlint + Oxfmt. Run `pnpm fix` before committing to ensure compliance.
