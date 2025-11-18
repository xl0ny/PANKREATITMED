# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Running in a desktop (Tauri) shell and using a LAN IP for the API

This repo now includes a minimal Tauri scaffold in `src-tauri/` and scripts in `package.json`.

To run the app in development and point API requests to a backend on your local network (not `localhost`):

1. Find your backend machine's LAN IP (for example `192.168.1.50`).
2. Set `VITE_API_BASE_URL` when running the dev server or Tauri dev.

Examples (macOS / zsh):

```bash
# Start Vite dev with proxy pointing to LAN backend
VITE_API_BASE_URL=http://192.168.1.50:80 npm run dev

# Start Tauri dev (this opens a desktop window). Ensure Rust + Tauri toolchain is installed.
VITE_API_BASE_URL=http://192.168.1.50:80 npm run tauri:dev
```

Notes:
- The app code uses `import.meta.env.VITE_API_BASE_URL` (see `src/api/config.ts`) to build absolute API URLs.
- In dev, if `VITE_API_BASE_URL` is empty the app uses a relative `/api` path and Vite's proxy handles requests. We updated `vite.config.ts` so you can override the proxy target via `VITE_API_BASE_URL`.
- Building a Tauri bundle requires the Rust toolchain and the Tauri CLI. See https://tauri.app/v1/guides/getting-started/intro for setup instructions.

If you'd like, I can also try to run `npm install` and `npm run tauri:dev` here to check for immediate errors (I may be blocked if Rust or Tauri are not installed). Say "run" and I'll attempt it and report results.

