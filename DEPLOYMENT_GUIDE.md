# 🚀 Ease2event Production Deployment Guide: Vercel

This guide outlines the professional-grade deployment strategy for the Ease2event monorepo. It ensures that the **User Website**, **Vendor Dashboard**, **Admin Panel**, and the **NestJS API** are synchronized under a single domain with optimal performance.

---

## 🏗️ 1. Project Configuration (Vercel Dashboard)

When importing the repository into Vercel, use these specific settings:

| Setting | Value |
| :--- | :--- |
| **Framework Preset** | `Other` (Do not select Turborepo; our root config is custom) |
| **Root Directory** | `./` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

### Environment Variables
You **must** configure these variables in the Vercel Dashboard for both Build and Runtime:

*   `VITE_API_URL`: `/api` (Essential for same-domain communication)
*   `DATABASE_URL`: `postgresql://user:pass@host:5432/db`
*   `JWT_SECRET`: `[High-Entropy-String]`
*   `NODE_ENV`: `production`

---

## 🛰️ 2. Serverless API Entry Point (`api/index.ts`)

NestJS requires a bridge to run on Vercel Serverless Functions. This file caches the application instance to minimize "cold start" latency.

```typescript
// api/index.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../apps/api/src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

let cachedApp: any;

async function bootstrap() {
  if (!cachedApp) {
    const expressApp = express();
    const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
    app.setGlobalPrefix('api');
    app.enableCors();
    await app.init();
    cachedApp = expressApp;
  }
  return cachedApp;
}

export default async (req: any, res: any) => {
  const app = await bootstrap();
  app(req, res);
};
```

---

## 🚦 3. Routing & Rewrites (`vercel.json`)

The critical logic for serving multiple SPAs on subpaths while routing API calls correctly.

```json
{
    "rewrites": [
        { "source": "/api/:path*", "destination": "/api/index.ts" },
        { "source": "/vendor/:path*", "destination": "/vendor/index.html" },
        { "source": "/admin/:path*", "destination": "/admin/index.html" },
        { "source": "/:path*", "destination": "/index.html" }
    ]
}
```
> [!NOTE]
> Vercel's internal logic will serve static assets (JS/CSS) before applying these rewrites, ensuring that `dist/vendor/assets/...` works seamlessly.

---

## 🛠️ 4. Handling Build Outputs

The root `package.json` build script manages the consolidation of workspace outputs into the final `dist/` directory:

```bash
"build": "turbo build && mkdir -p dist/vendor dist/admin && cp -r apps/user-website/dist/* dist/ && cp -r apps/vendor-dashboard/dist/* dist/vendor/ && cp -r apps/admin-panel/dist/* dist/admin/"
```

---

## ❌ 5. Troubleshooting Common Errors

### API Returns 404 or "Internal Server Error"
*   **Cause**: The bridge file `api/index.ts` cannot find the `AppModule` or NestJS dependencies aren't installed at the root.
*   **Fix**: Ensure `package-lock.json` at the root includes all workspace dependencies (handled by default in NPM/Yarn/PNPM workspaces).

### Routing Issues (404 on Refresh)
*   **Cause**: Incorrect `rewrites` order in `vercel.json`.
*   **Fix**: Always place the specific subpaths (`/vendor`, `/admin`) **above** the catch-all root (`/:path*`).

### "Module Not Found" during Build
*   **Cause**: Turborepo doesn't have the outputs of shared packages.
*   **Fix**: Ensure `turbo.json` outputs are defined as `["dist/**"]` for all packages.

---

## 💹 6. Best Practices

### Database Connection Management
*   **Issue**: Serverless functions can exhaust PostgreSQL connection limits.
*   **Solution**: Use a connection pooler like **PgBouncer** or **NeonDB's Pooled Connection**. In TypeORM, set `poolSize: 1` in the `TypeOrmModule` config to prevent overconsumption.

### Cold Start Optimization
*   The `cachedApp` logic in `api/index.ts` is vital.
*   Consider upgrading to the **Pro plan** or using **Edge Functions** for logic that doesn't require the full NestJS stack, though for this architecture, Serverless Functions are the standard.

---

## ✅ 7. Final Verification Checklist

- [ ] Visit `your-domain.com/api/health` → Should return `200 OK`.
- [ ] Visit `your-domain.com/vendor` and refresh the page → Should stay on Vendor Dashboard.
- [ ] Inspect Network Tab → `VITE_API_URL` should resolve to `https://your-domain.com/api`.
- [ ] Upload an image via Profile Settings → Verify Cloudinary persistence.
