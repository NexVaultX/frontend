# Accessibility Standards

Every component and page must meet **WCAG 2.2 AA**. Accessibility is a
baseline requirement, not a feature. If a change breaks accessibility,
it is a regression.

## Semantic HTML

* Use semantic elements: `<header>`, `<nav>`, `<main>`, `<section>`,
  `<article>`, `<aside>`, `<footer>`, `<button>`, `<a>`, `<form>`,
  `<label>`, `<table>`.
* Use exactly one `<main>` per page.
* Use `<section aria-labelledby="...">` to associate sections with
  their headings.
* Keep the heading hierarchy `<h1>` → `<h2>` → `<h3>` without skipping
  levels.

## Keyboard navigation

* All interactive elements must be reachable and operable with the
  keyboard (Tab, Enter, Space, Arrow keys).
* Never trap focus. If a dialog traps focus, provide a clear escape
  (Esc to close, focus returns to the trigger).
* Keep visible focus indicators — never remove `outline` without a
  replacement.
* Support `prefers-reduced-motion` by disabling or minimizing
  animations.

## ARIA

* Prefer native HTML semantics over ARIA. A real `<button>` beats
  `role="button"` on a `<div>`.
* Use ARIA only when native semantics do not exist: `aria-expanded`
  on disclosure buttons, `aria-current` on active nav items,
  `role="alert"` for live errors.
* Use `aria-label` only when there is no visible text label.
* Use `aria-live` for dynamic content updates — `polite` for
  non-urgent, `assertive` for urgent.
* Use `aria-invalid` and `aria-describedby` together for form
  validation errors.

## Forms

* Every input must have a visible `<label>` (or `aria-label` for
  icon-only labels).
* Use the correct `type`: `email`, `password`, `search`, `tel`,
  `number`, and so on.
* Show validation errors inline, near the field, with `aria-invalid`
  and `aria-describedby`.
* Announce errors to screen readers with `role="alert"` or
  `aria-live="polite"`.
* Use `autocomplete` attributes where appropriate.
* Minimum touch target: 44×44px for interactive elements.

## Color and contrast

* Text contrast must meet WCAG AA: 4.5:1 for normal text, 3:1 for
  large text (18pt or 14pt bold).
* UI component contrast (borders, icons, focus rings): 3:1 minimum.
* Never rely on color alone to convey meaning — pair color with icons,
  text, or patterns.
* Test both light and dark themes.
* Use the project's OKLCH semantic tokens (`--primary`,
  `--muted-foreground`, and so on) — never hardcode colors.

## Images and media

* Every `<img>` needs meaningful `alt` text. Use `alt=""` for
  decorative images.
* Do not put critical information in images — use real text.
* Provide captions or transcripts for video and audio content.
* Do not autoplay media with sound.

## Motion

* All animations must respect `prefers-reduced-motion: reduce`.
* Keep animations under 400ms for UI interactions.
* Use `transform` and `opacity` for animations — never animate
  `width`, `height`, `top`, or `left`.
* Do not create flashing content (no more than 3 flashes per second).

## Testing

* Test with keyboard only — every flow must work.
* Test with a screen reader (NVDA, VoiceOver, or axe DevTools).
* Check contrast at all breakpoints and in both themes.
* Verify heading hierarchy and landmark structure.
* Query like a user in tests: `getByRole`, `getByLabelText`,
  `getByText` — never by CSS class.

## Related

* [Custom Theme](../theming/custom-theme.md)
* [Architecture Overview](../architecture/overview.md)
