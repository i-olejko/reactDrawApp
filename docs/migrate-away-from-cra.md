Goal:
Migrate a CRA (react-scripts) React+TypeScript app to a custom Webpack 5 build so we can use TypeScript 5.x and fully own webpack config. Remove react-scripts entirely.

Context:
Current Cloud Build fails due to peer dependency conflict: react-scripts@5 expects TS ^3.2.1 || ^4, project uses TS 5.x. We want a long-term solution, not legacy-peer-deps.

Deliverables:
1) Remove CRA dependency (react-scripts) and CRA scripts from package.json
2) Add Webpack 5 dev+prod build with React Fast Refresh
3) Add TypeScript 5 support, typecheck script, and TS path aliases if needed
4) Support CSS (and optionally SASS if used), images/assets, and env vars from .env
5) Ensure `npm ci` + `npm run build` works locally and in Cloud Build

Step-by-step tasks:

A) Audit and capture CRA-specific behavior
- Search project for: REACT_APP_ env vars, process.env.PUBLIC_URL, service worker, proxy setup, public/ assets usage, absolute import aliases, SVG imports as React components.
- Write a short migration notes file listing what must be replicated.

B) Dependencies
- Remove: react-scripts
- Add (baseline):
  - webpack, webpack-cli, webpack-dev-server
  - html-webpack-plugin
  - typescript
  - ts-loader (or babel-loader + @babel/preset-typescript; choose one approach and keep it consistent)
  - css-loader, style-loader (plus mini-css-extract-plugin for production)
  - webpack-merge
  - dotenv + dotenv-webpack OR use DefinePlugin to inject env
  - @pmmmwh/react-refresh-webpack-plugin + react-refresh (for Fast Refresh)

C) Files to add
- webpack/
  - webpack.common.js
  - webpack.dev.js
  - webpack.prod.js
- public/index.html (if not already)
- Ensure src/index.tsx or src/main.tsx is the entry

D) Webpack config requirements
- Entry: src/main.tsx (or existing entry)
- Output: dist/ with hashed filenames in prod
- Resolve extensions: .ts, .tsx, .js
- Module rules:
  - TS/TSX through ts-loader (transpileOnly true) OR babel-loader with presets
  - CSS handling
  - Asset modules for images/fonts (asset/resource)
- Plugins:
  - HtmlWebpackPlugin using public/index.html
  - ReactRefresh plugin in dev only
  - MiniCssExtractPlugin in prod only
  - DefinePlugin or dotenv-webpack for env vars
- DevServer:
  - historyApiFallback: true (SPA routing)
  - hot: true
  - port: configurable

E) TypeScript
- Keep TS 5.x
- Add `npm run typecheck` using `tsc --noEmit`
- Ensure tsconfig has "jsx": "react-jsx" and includes src

F) package.json scripts (replace CRA)
- "dev": webpack serve --config webpack/webpack.dev.js
- "build": webpack --config webpack/webpack.prod.js
- "preview": serve dist (or similar)
- "typecheck": tsc --noEmit

G) Fix code differences after removing CRA
- Replace CRA env access if needed:
  - If using REACT_APP_* keep the same prefix by injecting only those vars into DefinePlugin
- If CRA allowed importing SVG as components, add @svgr/webpack
- If proxy existed, replicate via devServer.proxy

H) Cloud Build update
- Ensure build step runs:
  - npm ci
  - npm run build
- Avoid --legacy-peer-deps
- Confirm Node version matches your package-lock expectations

Acceptance criteria
- `npm ci && npm run build` succeeds without legacy-peer-deps
- `npm run dev` starts dev server with Fast Refresh
- Production dist/ is generated and loads index.html correctly with SPA routing
- TypeScript 5.x remains installed
- Cloud Build passes with the same commands
