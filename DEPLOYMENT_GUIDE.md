# 🚀 Ease2event Production Deployment Guide

This guide contains the final, verified configurations for deploying the monorepo to **Render** (Backend) and **Vercel** (Frontend).

---

## 🏗️ 1. Backend Deployment (Render)

Deploy the NestJS API as a **Web Service**.

### Configuration:
- **Runtime**: `Node`
- **Region**: Select your preferred region.
- **Root Directory**: `.`
- **Build Command**: `npm install && npm run build:api`
- **Start Command**: `cd apps/api && node dist/main.js`

### Environment Variables:
| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | `postgresql://...` |
| `JWT_SECRET` | `your_secure_secret` |
| `FRONTEND_URL` | `https://your-user-app.vercel.app` |
| `VENDOR_URL` | `https://your-vendor-app.vercel.app` |
| `ADMIN_URL` | `https://your-admin-app.vercel.app` |

---

## 🌐 2. Frontend Deployment (Vercel)

Create three separate projects on Vercel for the User, Vendor, and Admin portals.

### Common Configuration (Apply to all):
- **Framework Preset**: `Vite`
- **Root Directory**: `.`

### Project-Specific Scripts:

#### A. User Website
- **Build Command**: `npx turbo run build --filter=@ease2event/user-website`
- **Output Directory**: `apps/user-website/dist`

#### B. Vendor Dashboard
- **Build Command**: `npx turbo run build --filter=@ease2event/vendor-dashboard`
- **Output Directory**: `apps/vendor-dashboard/dist`

#### C. Admin Panel
- **Build Command**: `npx turbo run build --filter=@ease2event/admin-panel`
- **Output Directory**: `apps/admin-panel/dist`

---

## 🛠️ 3. Handling SPA Routing (Vercel)

Ensure each frontend has a `vercel.json` in its **app directory** (e.g., `apps/user-website/vercel.json`) to handle client-side routing:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## ✅ 4. Verification Checklist
- [ ] Backend: Check logs for `🚀 Backend server is running`.
- [ ] Backend: Access `https://your-api.onrender.com/api/health` to verify.
- [ ] Frontend: Verify `VITE_API_URL` is set correctly in Vercel.
- [ ] Database: Ensure Render's outbound IP is allowed by your DB provider.

---
*Created with ❤️ by Antigravity (Senior Technical Lead)*
