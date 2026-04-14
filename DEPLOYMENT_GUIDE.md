# 🚀 Ease2event Unified Deployment Guide: Full-Stack on Vercel

This is the **all-in-one** deployment strategy. If you do **not** want to use Render, you can host your entire platform (Frontend + Backend) on Vercel under a single project.

---

## 🏗️ 1. Project Configuration (Vercel Dashboard)

Import your repo and use these specific settings to handle the Turborepo structure:

| Setting | Value |
| :--- | :--- |
| **Framework Preset** | `Other` |
| **Root Directory** | `./` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

### Environment Variables
Set these in Vercel to allow the system to talk to itself:
*   **`VITE_API_URL`**: `/api` (This makes the frontend look at its own domain for the backend).
*   **`DATABASE_URL`**: Your Postgres link.
*   **`JWT_SECRET`**: Your secure secret key.
*   **`NODE_ENV`**: `production`

---

## 🛰️ 2. The Serverless "Bridge" (`api/index.ts`)

Since Vercel runs serverless functions, we use this bridge to run your NestJS backend. I have already created this file at the root. It handles:
*   Caching the app to reduce latency.
*   Routing all traffic to the NestJS `AppModule`.
*   Handling CORS and headers.

---

## 🚦 3. Unified Routing (`vercel.json`)

Your `vercel.json` is configured to act as a traffic controller:
1.  **`/api/*`** → Sent to the NestJS Serverless Function.
2.  **`/vendor/*`** → Serves the Vendor Dashboard SPA.
3.  **`/admin/*`** → Serves the Admin Panel SPA.
4.  **`/*`** → Serves the main User Website.

---

## 🛠️ 4. The Build Process

When you click "Deploy", Vercel runs the `npm run build` script at the root. Here is what happens behind the scenes:
1.  **Turbo builds** all apps simultaneously.
2.  **User Website** files are copied to the root of `/dist`.
3.  **Vendor Dashboard** files are copied to `/dist/vendor`.
4.  **Admin Panel** files are copied to `/dist/admin`.
*Result*: Everything is available in one "package" that Vercel serves.

---

## ❌ 5. Important Serverless Limitations

1.  **Socket.io**: WebSockets (Real-time chat) will **not** work natively on Vercel Serverless Functions because they require a persistent connection. 
    *   *Solution*: Switch to a dedicated WebSocket provider like **Pusher** or **Ably**, or use **Render** for the backend if real-time chat is non-negotiable.
2.  **Cold Starts**: The first request after a period of inactivity may take 2-3 seconds.
3.  **Timeouts**: Vercel Free plan has a 10s timeout. If your API takes longer (e.g., generating PDFs), it will fail.

---

## ✅ Deployment Checklist

- [ ] `VITE_API_URL` is set to `/api` in Vercel.
- [ ] Database is connected and schema is synced.
- [ ] You have pushed the latest code with `api/index.ts` and updated `vercel.json`.
