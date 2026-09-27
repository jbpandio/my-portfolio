<p align="center">
  <img src="app/icon.svg" width="72" height="72" alt="jb logo">
</p>

<h1 align="center">James Benedict Pandio — Portfolio</h1>

<p align="center">
  Personal portfolio of a full stack developer &amp; AI automation builder from Pampanga, PH.<br>
  Designed to feel like a terminal.
</p>

---

## Features

- **Terminal-style intro.** The hero types out `whoami`, `cat role.txt` and `ls ./work` on load.
- **Command palette.** Press <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>K</kbd> (or <kbd>/</kbd>) to jump to sections, open projects, copy the email or toggle the theme.
- **Keyboard shortcuts.** <kbd>1</kbd>–<kbd>4</kbd> jump to sections, <kbd>T</kbd> toggles dark/light, <kbd>Esc</kbd> closes overlays, and <kbd>←</kbd>/<kbd>→</kbd> step through case studies.
- **Case-study sheets.** Each project opens in a bottom sheet with its details, a screenshot and sections for the problem, the build and the result.
- **Dark and light themes.** The choice is saved between visits and applied before the first paint, so there's no flash.
- **Motion.** Smooth scrolling with [Lenis](https://github.com/darkroomengineering/lenis), sections that fade in on scroll, titles that decode from random characters, a scroll progress bar and a custom cursor. All of it is disabled when the visitor's system asks for reduced motion.
- **Responsive.** Below 760px the nav becomes a full-screen menu.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router) with React 19 and TypeScript
- Plain CSS with custom-property theme tokens (`app/globals.css`)
- [Geist Mono](https://vercel.com/font) via `next/font`
- [Lenis](https://github.com/darkroomengineering/lenis) for smooth scrolling

## Getting started

Requires Node.js 20.9 or later.

```bash
git clone https://github.com/jbpandio/my-portfolio.git
cd my-portfolio
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

| Script          | What it does                     |
| --------------- | -------------------------------- |
| `npm run dev`   | Start the dev server             |
| `npm run build` | Create a production build        |
| `npm run start` | Serve the production build       |
| `npm run lint`  | Run ESLint                       |

## Project structure

```
app/
├── _components/
│   ├── Portfolio.tsx       # Page shell: header, sections, shortcuts, theme, scrolling
│   ├── Hero.tsx            # Typed terminal intro and status bar
│   ├── ProjectSheet.tsx    # Case-study bottom sheet
│   ├── CommandPalette.tsx  # Ctrl/⌘ K palette
│   ├── Logo.tsx            # "jb" mark, coloured by the theme tokens
│   ├── primitives.tsx      # Scroll reveal, scramble title, image slot, cursor, progress bar
│   └── data.ts             # All content: projects, stack, links
├── globals.css             # Theme tokens and all styles
├── layout.tsx              # Font, metadata, theme bootstrap script
├── manifest.ts             # Web app manifest
└── icon.svg, apple-icon.png, favicon.ico
```

## Editing content

Almost everything you'd want to change lives in [`app/_components/data.ts`](app/_components/data.ts):

- **Projects:** title, description, case-study details, and an optional `image` path (put screenshots in `public/work/`).
- **Stack:** the groups and items in the stack grid.
- **Links:** email, GitHub, LinkedIn and the résumé path (`public/resume.pdf`).

The About and Experience copy is in `Portfolio.tsx`.

## Deployment

The site is a fully static Next.js app. The simplest way to host it is to import the repo on [Vercel](https://vercel.com/new); every push to `main` then redeploys.

## Contact

- Email: [jamesbenedictpandio@gmail.com](mailto:jamesbenedictpandio@gmail.com)
- GitHub: [@jbpandio](https://github.com/jbpandio)
- LinkedIn: [James Benedict Pandio](https://www.linkedin.com/in/james-benedict-pandio-642317255/)

© 2026 James Benedict Pandio
