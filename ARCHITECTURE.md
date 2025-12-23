# 🏗️ CommuteOS Architecture & Context

This file serves as the **Context Anchor** for this project. All AI agents working on this codebase should read this file first.

## 1. The Vision 🔭
**CommuteOS** is a privacy-first, real-time dashboard for daily commuters.
-   **Vibe**: "Glassmorphism in the cloud." Dark mode, translucent layers (`bg-white/10 backdrop-blur`), crisp typography.
-   **Core Value**: Actionable data (Weather + Commute + Outfit) at a glance.
-   **No Backend**: All logic lives in the client. Persistence via `localStorage`.

## 2. Tech Stack 🛠️
-   **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Maps**: `react-leaflet` + `leaflet` (OpenStreetMap tiles)
-   **Icons**: `lucide-react`

## 3. Data Layer (Real-Time APIs) 🌍
**Rule: NO MOCK DATA.**
We utilize free, public APIs to ground the application in reality.

| Feature | Provider | Endpoint / Function |
| :--- | :--- | :--- |
| **Weather** | [Open-Meteo](https://open-meteo.com/) | `fetchWeather()` in `api.ts` |
| **Routing** | [OSRM](http://project-osrm.org/) | `fetchRoute()` in `api.ts` |
| **Geocoding** | [Nominatim](https://nominatim.org/) | `searchAddress()` in `api.ts` |
| **Storage** | Browser LocalStorage | `useAppStore.ts` |

## 4. Key Components 🧩
-   **`App.tsx`**: Main layout grid. Handles modal visibility state.
-   **`useAppStore.ts`**: The "Brain". Manages `home`, `work`, `weather`, and `commute` state.
-   **`components/WeatherCard.tsx`**: Displays current conditions. Click -> `WeatherModal`.
-   **`components/CommuteCard.tsx`**: Displays driving/cycling comparison. Click -> `RouteMapModal`.
-   **`components/OutfitCard.tsx`**: Logic-driven clothing suggestions. Click -> `OutfitModal`.
-   **`components/LocationPicker.tsx`**: Map-based address selector using Leaflet.

## 5. Coding Guidelines 🚦
1.  **Iterative Development**: Build one component at a time. Verify often.
2.  **No Dead Code**: If you write a helper function, use it or delete it.
3.  **Visual Verification**: UI must look "Glassy" and premium. Use `backdrop-blur-md` and `border-white/10` heavily.
4.  **Error Handling**: APIs fail. Always wrap `fetch` calls in try/catch.
5.  **Keep It Simple (KISS)**: Prefer simple, readable code over clever abstractions.
6.  **Don't Repeat Yourself (DRY)**: Extract reusable logic into hooks or utility files.
7.  **Modularity**: 
    -   Avoid "God Files". If a file exceeds 200 lines, break it down.
    -   Separate Logic (`hooks/`) from UI (`components/`).
    -   One component per file.

## 6. Project Structure
```
src/
├── components/       # UI Widgets (Cards, Modals, Picker)
├── hooks/            # Logic & State (useAppStore - The Single Source of Truth)
├── lib/              # API Clients (api.ts) & Utilities
├── App.tsx           # Main Dashboard Layout
└── main.tsx          # Entry Point
```

## 7. Deployment 🚀
-   **Platform**: GitHub Pages
-   **Build Config**: `vite.config.ts` must include `base: '/repo-name/'` to handle subpath routing on GitHub.
-   **Process**: `npm run deploy` (via `gh-pages`).
