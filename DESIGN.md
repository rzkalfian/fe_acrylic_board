# ResortLux Design System

## 1. Overview

ResortLux is a premium, romantic, and serene design system for luxury resorts and boutique hotel websites. It combines full-bleed hospitality imagery, a layered pink palette, elegant typography, selective glassmorphism, and decorative background ornaments.

The visual direction should feel:
- Elegant and premium
- Romantic, warm, and welcoming
- Serene and uncluttered
- Editorial and image-led
- Consistent and accessible

Use generous whitespace and strong visual hierarchy. Avoid overcrowding pages or using decorative effects where they reduce readability.

## 2. Brand Colors

### Core palette

| Token | Hex | Intended use |
|---|---|---|
| `color-primary` | `#E44D99` | Primary actions, booking CTAs, selected states |
| `color-rose` | `#BD5C80` | Accent headings, icon accents, emphasis |
| `color-dusty-pink` | `#D7869B` | Decorative details, borders, secondary accents |
| `color-blush` | `#F5B1BD` | Highlights, soft fills, glass tint |
| `color-soft-pink` | `#FAD9DB` | Soft backgrounds and subtle section fills |

### Neutral and semantic colors

| Token | Hex | Intended use |
|---|---|---|
| `color-background` | `#FFFFF0` | Main page background (ivory) |
| `color-surface` | `#FFFFFF` | Cards, dialogs, elevated surfaces |
| `color-text` | `#0F172A` | Primary text and headings (navy) |
| `color-success` | `#15803D` | Success states |
| `color-warning` | `#CA8A04` | Warning states |
| `color-error` | `#DC2626` | Error states |
| `color-info` | `#0369A1` | Informational states |

### Color usage rules

- Use `#E44D99` for primary actions, especially booking and reservation CTAs.
- Use white text on the primary pink button only when contrast is sufficient; verify contrast for the actual component size and font weight.
- Use navy (`#0F172A`) for body text on pale pink or ivory backgrounds.
- Keep `#FAD9DB` and `#F5B1BD` as supportive colors rather than using them for small text.
- Use rose and dusty pink for accents, borders, icon details, and decorative elements.
- Preserve ivory and white surfaces to balance the pink palette and keep the interface airy.
- Do not rely on color alone to communicate errors, success, or selected states.

## 3. Typography

ResortLux uses three font families with distinct roles.

### Qwigley — Decorative Latin script

**Token:** `font-script`

Use for:
- Short decorative phrases
- Hero script accents and romantic taglines
- Small editorial flourishes

Rules:
- Use sparingly and pair with a readable heading.
- Do not use for body copy, navigation, prices, form labels, or essential booking information.
- Avoid long sentences and small font sizes.

### Poppins — Headings

**Token:** `font-heading`

Use for:
- Page titles and section headings
- Room and suite names
- Feature headings and prominent promotional titles

Recommended weights: 500, 600, and 700, depending on hierarchy. Keep heading line lengths comfortable and avoid excessive all-caps text.

### Nunito Sans — Body and interface text

**Token:** `font-body`

Use for:
- Descriptions and paragraphs
- Navigation and buttons
- Form labels and helper text
- Room details, prices, policies, and booking information

Recommended weights: 400 for body copy, 600 for emphasis, and 700 for compact labels or buttons. Prioritize readability across desktop and mobile layouts.

### Typography hierarchy

| Element | Font | Guidance |
|---|---|---|
| Decorative tagline | Qwigley | Short, expressive, decorative |
| H1 | Poppins | Strongest page heading |
| H2 | Poppins | Section heading |
| H3 / card title | Poppins | Compact heading |
| Body / description | Nunito Sans | Readable, relaxed line-height |
| Navigation / button | Nunito Sans | Clear and action-oriented |
| Price / form label | Nunito Sans | Functional and legible |

## 4. Iconography — Solar Icons

Use **Solar Icons** as the standard icon family throughout the interface.

Recommended approach:
- Prefer the Outline style for a refined, lightweight appearance.
- Use Bold or filled variants selectively for active navigation, selected states, or high-priority actions.
- Keep icon style, stroke weight, and visual size consistent within the same context.
- Use icons for navigation, search, calendar, location, guests, amenities, account, menu, and close actions.
- Pair unfamiliar icons with text labels, especially in booking flows.
- Use accessible labels for icon-only buttons.
- Do not mix Solar Icons with unrelated icon families unless a required icon is unavailable.

Choose the Solar Icons package or asset format that matches the project's framework. Keep icon names and package usage consistent in implementation.

## 5. Imagery and Layout

### Image-first design

- Use high-quality resort, room, landscape, dining, spa, and hospitality photography.
- Hero sections may use full-bleed imagery with a clear text hierarchy.
- Add a subtle overlay when text sits on photography; ensure the text remains readable.
- Use consistent image ratios within related card groups.
- Prefer a small number of strong images over many competing images.

### Layout principles

- Preserve generous whitespace.
- Establish clear hierarchy between hero, content sections, room cards, amenities, and booking actions.
- Use consistent spacing and alignment across pages.
- Keep layouts responsive and touch-friendly on mobile.
- Avoid excessive borders, shadows, gradients, and decorative layers in a single section.

## 6. Glassmorphism

Glass effects may be used selectively for:
- Transparent navigation over hero imagery
- Floating booking/search panels
- Small overlays on photography
- Contextual floating controls

Suggested visual properties:
- Translucent white or blush-tinted surface
- `backdrop-filter: blur(12px)` to `blur(20px)`
- Thin, semi-transparent light border
- Soft shadow with low opacity
- Rounded corners consistent with the component

Rules:
- Use glass only when it improves layering or context.
- Maintain readable contrast for text, icons, and buttons.
- Avoid glass effects behind long blocks of body text.
- Provide a solid or sufficiently opaque fallback where `backdrop-filter` is unsupported.
- Do not stack multiple glass layers unnecessarily.

## 7. Background Ornaments and Assets

Decorative assets are available in `assets/background` and should be reused where appropriate.

Usage guidelines:
- Inspect the available assets before choosing one for a specific page.
- Use ornaments as supporting decoration, not as the main content.
- Position ornaments around section edges, corners, or open whitespace.
- Keep decorative opacity and scale subtle enough to preserve content hierarchy.
- Use `background-size: cover` for assets intended to fill an area and `contain` for distinct ornamental shapes that must remain fully visible.
- Use `background-position` and responsive adjustments to prevent awkward cropping.
- Ensure ornaments do not obscure text, buttons, or interactive controls.
- Avoid repeating a complex ornament so frequently that the page feels busy.
- If an asset is purely decorative, hide it from assistive technology; meaningful images should have appropriate alternative text.

Do not assume filenames or asset contents. Review the actual files in `assets/background` before referencing them in code.

## 8. Buttons and Booking CTAs

Booking actions are a primary conversion goal.

### Primary CTA
- Background: `#E44D99`
- Text: white, after contrast verification
- Shape: pill or consistently rounded rectangle
- Typography: Nunito Sans, weight 700
- Use for actions such as “Book Now”, “Check Availability”, or “Reserve a Room”

### Secondary CTA
- Use a white or ivory surface with a rose border or navy text.
- Make its hierarchy visibly lower than the primary CTA.
- Maintain clear hover, focus, pressed, and disabled states.

### Interaction rules
- Make booking CTAs easy to locate without making every action equally prominent.
- Provide visible keyboard focus.
- Use descriptive action labels.
- Ensure buttons have comfortable touch targets on mobile.
- Do not communicate disabled, loading, or error states by color alone.

## 9. Cards, Surfaces, and Shape

- Use white surfaces for room cards, booking forms, and content panels.
- Use pale pink fills for selected highlights or secondary information.
- Apply rounded corners consistently; a starting range of 16–24px works well for large cards.
- Use soft shadows sparingly to establish depth.
- Prefer subtle borders over heavy outlines.
- Keep room imagery prominent and information concise.

## 10. Motion and Interaction

- Keep transitions smooth and restrained.
- Use subtle fades, opacity changes, and small positional shifts for hover and entrance states.
- Avoid distracting motion that competes with resort imagery or booking actions.
- Respect reduced-motion preferences.
- Ensure hover-only interactions have equivalent touch and keyboard behavior.

## 11. Accessibility and Responsive Design

- Maintain readable contrast for text and controls.
- Test the actual pink-and-white combinations before shipping.
- Do not use Qwigley for essential information.
- Give icon-only controls accessible names.
- Preserve visible keyboard focus and logical tab order.
- Ensure forms have persistent labels and clear validation messages.
- Support mobile, tablet, and desktop breakpoints.
- Keep booking controls easy to use on small screens.
- Provide fallbacks for decorative effects such as `backdrop-filter`.

## 12. CSS Design Tokens

```css
:root {
  /* Brand colors */
  --color-primary: #E44D99;
  --color-rose: #BD5C80;
  --color-dusty-pink: #D7869B;
  --color-blush: #F5B1BD;
  --color-soft-pink: #FAD9DB;

  /* Neutral colors */
  --color-background: #FFFFF0;
  --color-surface: #FFFFFF;
  --color-text: #0F172A;

  /* Semantic colors */
  --color-success: #15803D;
  --color-warning: #CA8A04;
  --color-error: #DC2626;
  --color-info: #0369A1;

  /* Typography */
  --font-script: "Qwigley", cursive;
  --font-heading: "Poppins", sans-serif;
  --font-body: "Nunito Sans", sans-serif;

  /* Glass */
  --glass-background: rgb(255 255 255 / 58%);
  --glass-border: rgb(255 255 255 / 72%);
  --glass-blur: 16px;

  /* Shape and elevation */
  --radius-card: 20px;
  --radius-button: 999px;
  --shadow-soft: 0 8px 32px rgb(15 23 42 / 8%);
}

body {
  background: var(--color-background);
  color: var(--color-text);
  font-family: var(--font-body);
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: var(--font-heading);
}

.font-script {
  font-family: var(--font-script);
}

.glass {
  background: var(--glass-background);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-soft);
  -webkit-backdrop-filter: blur(var(--glass-blur));
  backdrop-filter: blur(var(--glass-blur));
}

.button-primary {
  border-radius: var(--radius-button);
  background: var(--color-primary);
  color: #FFFFFF;
  font-family: var(--font-body);
  font-weight: 700;
}
```

Load Qwigley, Poppins, and Nunito Sans through the project's approved font hosting or local font assets. Ensure the font files are loaded before relying on the typography tokens.

## 13. Implementation Checklist

- [ ] Use the ResortLux pink palette consistently.
- [ ] Keep ivory as the primary page background and white for surfaces.
- [ ] Use Qwigley only for short decorative Latin-script accents.
- [ ] Use Poppins for headings.
- [ ] Use Nunito Sans for body copy and interface text.
- [ ] Use Solar Icons consistently.
- [ ] Make primary booking CTAs pink and clearly recognizable.
- [ ] Use full-bleed resort imagery where it adds value.
- [ ] Apply glassmorphism selectively and preserve contrast.
- [ ] Review and reuse appropriate assets from `assets/background`.
- [ ] Test responsive behavior, accessibility, and keyboard focus.
- [ ] Avoid clutter and keep the overall experience serene and premium.
