Migration notes (CRA to Webpack)

- PUBLIC_URL: used in `frontend/src/App.tsx`, `frontend/src/service-worker.js`, and `frontend/src/serviceWorkerRegistration.js`.
- Service worker: Workbox-based service worker in `frontend/src/service-worker.js` with registration in `frontend/src/index.tsx`.
- Public assets: `frontend/public/` (icons, manifest, `static.html`, images) copied into the build output.
- Static entry: `frontend/public/static.html` expects `/service-worker.js` for offline support.
- No REACT_APP_* env vars, proxy config, SVG-as-React-component imports, or path aliases found.
