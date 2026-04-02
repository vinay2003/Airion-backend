# Airion Production Deployment Checklist 🚀

Ensure these steps are completed before final rollout to Vercel/Render.

## 1. Environment Variable Sync
All portals must have these variables set in their respective platform dashboards.

### Frontend (User, Vendor, Admin)
- [ ] `VITE_API_URL`: The production URL of your backend (e.g., `https://api.airion.com/api`)
- [ ] `VITE_VENDOR_URL`: Main vendor subdomain (e.g., `https://vendor.airion.com`)
- [ ] `VITE_ADMIN_URL`: Main admin subdomain (e.g., `https://admin.airion.com`)
- [ ] `NODE_ENV`: Should be set to `production`

### Backend (NestJS)
- [ ] `DATABASE_URL`: Your production NeonDB/Postgres connection string
- [ ] `JWT_SECRET`: A high-entropy 64-character string
- [ ] `FRONTEND_URL`: `https://airion.com`
- [ ] `VENDOR_URL`: `https://vendor.airion.com`
- [ ] `ADMIN_URL`: `https://admin.airion.com`

## 2. Infrastructure & Database
- [ ] **Migrations**: Run `npm run typeorm:migration:run` against the production DB.
- [ ] **CORS Verification**: Confirm `api/src/main.ts` whitelists the actual subdomains you end up using.
- [ ] **SSL/HTTPS**: Ensure all URLs in environment variables use `https`.

## 3. Auth Flow Sanity Test
- [ ] **Login Redirect**: Verify that logging in on `airion.com` as a vendor correctly handovers to the vendor subdomain with the token.
- [ ] **Token Storage**: Confirm no `localStorage` keys except `airion_token` are being used for primary identity.
- [ ] **Refresh Rate**: Ensure `JWT_EXPIRES_IN` is set to a reasonable production value (e.g., `7d`).

## 4. Performance & Assets
- [ ] **Compression Check**: Verify that `br` or `gzip` is active for static assets.
- [ ] **Image Optimization**: Ensure background images are served from an optimized (Cloudinary) source, not just raw Unsplash URLs if possible.
- [ ] **Turbo Cache**: Verify that `turbo build` exhibits a Cache Hit on unchanged shared packages in your CI environment.
