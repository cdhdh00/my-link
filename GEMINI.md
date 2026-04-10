# Gemini CLI Project Context: mylink

## Project Overview
This workspace is a repository containing a personal profile web application named `my-profile`. The project is built using the **Next.js 16** framework with **React 19** and **Tailwind CSS 4**. It uses **TypeScript** for type safety and follows the Next.js **App Router** architecture.

### Tech Stack
- **Framework:** [Next.js 16](https://nextjs.org/)
- **Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Fonts:** Geist & Geist Mono (via `next/font`)

---

## Directory Structure
- `my-profile/`: The main Next.js application directory.
  - `app/`: Contains the application's routes and layouts (App Router).
    - `layout.tsx`: Root layout with font and global style configurations.
    - `page.tsx`: The main landing page.
    - `globals.css`: Global CSS and Tailwind directives.
  - `public/`: Static assets like SVG icons and logos.
  - `next.config.ts`: Next.js configuration.
  - `tsconfig.json`: TypeScript configuration with `@/*` path aliases.
  - `package.json`: Project dependencies and scripts.
- `readme.md`: A simple placeholder file in the root.

---

## Building and Running
Commands should be executed from within the `my-profile` directory.

| Task | Command |
| :--- | :--- |
| **Development** | `npm run dev` |
| **Build** | `npm run build` |
| **Start Production** | `npm run start` |
| **Linting** | `npm run lint` |

---

## Development Conventions
- **App Router:** Use the `app/` directory for routing. All components in `app/` are Server Components by default unless marked with `"use client"`.
- **Styling:** Use Tailwind CSS 4 utility classes for styling.
- **Path Aliases:** Use `@/` to refer to the root of the `my-profile` directory (e.g., `@/app/globals.css`).
- **Icons:** Use SVG files located in the `public/` folder.
- **TypeScript:** Strict type checking is enabled. Ensure all new components and functions are properly typed.

---

## Usage for Gemini CLI
When working on this project, always prioritize the `my-profile` directory for code-related tasks. If asked to add new features or fix bugs, focus on the `app/` directory and ensure compatibility with React 19 and Next.js 16 patterns.
