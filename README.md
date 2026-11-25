# SIS8 — Kazakhstan Places Redux Toolkit PWA

SIS8 continues the Kazakhstan Places app as an independently deployed, installable Progressive Web App. It preserves the SIS8 authentication, routing, CRUD, search, filters, pagination, dashboard, service worker and offline support, and moves shared application data to Redux Toolkit.

## Redux architecture

- `src/store/store.js` configures the Redux store with `configureStore`; `src/main.jsx` provides it through React Redux `Provider`.
- `src/features/places/placesSlice.js` owns the paginated list, query results, facets, and create/update lifecycle. Its `fetchPlaces` and `savePlace` thunks keep API calls in the existing service layer.
- `src/features/placeDetails/placeDetailsSlice.js` owns the selected place and visited/delete operations. Its `fetchPlace`, `toggleVisited`, and `removePlace` thunks keep details and mutations out of UI components.
- `src/features/dashboard/dashboardSlice.js` owns the dashboard catalogue request and its loading/error state.
- Each slice handles pending, fulfilled, and rejected actions. Request IDs prevent stale responses from replacing newer results; effects abort requests when the query or page unmounts. Retry buttons dispatch the same thunks again.
- `src/hooks/` contains the UI-facing data hooks. They use `useDispatch` to start requests and `useSelector` to read state. URL parameters remain the source of truth for list and dashboard filters; form drafts and notices remain local, while Firebase authentication remains in `AuthContext`.
- Selectors are reusable in `placesSlice.js` and `dashboardSlice.js`. Memoized `createSelector` selectors provide list items, count, facets, dashboard regions, and top-rated places.
- Successful create/update/visited/delete actions refresh the affected list, details, or dashboard data.

## Features

- Installable `manifest.json` with standalone display and 192×192 / 512×512 PNG icons.
- Content-versioned service worker that precaches the application shell and offline page, removes outdated caches on activation, and offers an in-app update button.
- Cache-first strategy for static assets and network-first strategy for public GET API requests, with entry limits and authentication paths excluded. Cached API fallbacks are labeled in the connection bar.
- Dedicated offline help at `#/offline`, plus a pre-cached `offline.html` fallback when a navigation request cannot complete.
- Firebase Authentication with Google sign-in, email/password login, account registration, and sign-out. The supplied fake API stores place data in localStorage, so previously loaded and edited records remain available offline; the connection bar says when the app is using device-saved data.
- Responsive navigation and layouts down to 320px.

## Routes

| Route | Page |
|---|---|
| `/` | Home |
| `/about` | About |
| `/places` | Search, filters, sorting, pagination |
| `/places/:id` | Place details |
| `/dashboard` | Statistics and filters |
| `/login` | Google sign-in, email/password login, registration |
| `/offline` | Offline help |

The app uses `HashRouter` for reliable refreshes and deep links on GitHub Pages.

The homework starter's fake API is localStorage-backed rather than a remote HTTP service. The service layer mirrors the known public seed catalogue into the service worker's versioned Cache Storage under `/api/places` keys, then reads that public snapshot if a local API read fails. It excludes user-added places and the personal `completed` flag. The service worker uses network-first for same-origin `/api/places` GET requests and announces cache fallbacks to the connection bar. The fake API's localStorage remains the source for edits and visited status.

## Run locally

```sh
npm ci
npm run dev
npm run build
npm run preview
npm run verify:pwa-cache
```

The service worker is registered in production builds. To check installability locally, use a secure origin such as `localhost` and open the production preview. Copy `.env.example` to `.env.local` and fill the Firebase web app settings for local sign-in.

## Deploy

The included GitHub Actions workflow publishes `dist/` to GitHub Pages whenever `main` is updated. Set the six Firebase Actions variables for this repository: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, and `VITE_FIREBASE_APP_ID`. In Firebase Authentication, enable Google sign-in and allow the GitHub Pages host in Authorized domains. After GitHub Pages finishes its first deployment, copy the deployment URL into the Teams submission.
