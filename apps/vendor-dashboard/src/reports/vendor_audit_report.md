# 📊 Vendor Dashboard: Architectural Audit & Optimization Roadmap

## 1. Executive Summary
This report provides a multi-dimensional audit of the **Vendor Dashboard** within the Airion monorepo. While the UI layer is aesthetically premium and follows a "SaaS Intelligence Hub" philosophy, there is significant "mock-data" debt in several core modules—most notably in **Enquiries (Inbox)**, **Analytics**, and **payout tracking**.

---

## 2. Frontend Page Analysis
| Routing Node | Status | Component | Backend Logic / Integration |
| :--- | :--- | :--- | :--- |
| **Dashboard** | 🟠 Partial | `Dashboard.tsx` | Uses `/vendors/:id/stats/bookings`. UI is premium; needs better multi-metric integration. |
| **Events** | 🟢 Active | `Listings.tsx` | Linked to `ServicesModule`. CRUD is mostly functional. |
| **Bookings** | 🟢 Active | `Bookings.tsx` | Linked to `BookingsModule`. Real-time status updates are responsive. |
| **Calendar** | 🟢 Active | `Calendar.tsx` | Filtering `BookingsModule` by date. High structural integrity. |
| **Earnings** | 🟠 Native | `Earnings.tsx` | Uses `bookingService`. Payout history is currently static/mocked. |
| **Enquiries** | 🔴 Incomplete | `Inbox.tsx` | **CRITICAL GAP.** UI is 100% mocked. No socket or REST link to `LeadsModule`. |
| **Ads** | 🟠 Minimal | `Ads.tsx` | UI exists, but "Neural Engine" backend is not fully mapped to `AdsModule`. |
| **Gallery** | 🟠 Partial | `Gallery.tsx` | Basic `UploadsModule` link. Needs batch processing and service-level categorization. |
| **Products** | 🟢 Active | `Products.tsx` | Linked to `ServicesModule` (Inventory mode). High fidelity. |
| **Analytics** | 🔴 Mocked | `Analytics.tsx` | Recharts are using static constants. Needs dynamic `AggregationService` and BigQuery/Supabase logic. |
| **Settings** | 🟢 Active | `Settings.tsx` | Deeply integrated with `VendorsModule`. Profile & Security nodes are functional. |

---

## 3. Backend (API) Coverage Audit
Based on analysis of `apps/api/src/app.module.ts` and individual controllers:

### ✅ Implemented Modules
- **`VendorsModule`**: Profile management, categorization, and verification status.
- **`ServicesModule`**: Handle Listings/Products/Gallery items.
- **`BookingsModule`**: Reservation logic, status transitions, and calendar feeds.
- **`AuthModule`**: Zero-trust multi-role authentication.

### ⚠️ Incomplete / Gaps
- **`LeadsModule`**: Needs a `VendorEnquiryController` to bridge public enquiries with the `Inbox.tsx` frontend.
- **`ChatModule`**: WebSocket infrastructure exists but is not currently consumed by the Vendor Dashboard portal.
- **`AggregationService`**: Missing from `Analytics`. We need a service that calculates Growth Delta, Visibility Index, and Revenue Projections dynamically.
- **`PaymentsModule`**: Needs to handle "Vendor Wallets" and payout requests to drive the `Earnings.tsx` page.

---

## 4. Operational Gaps (Critical Priorities)

### BUG/GAP #1: Enquiry/Inbox Flow
- **Observed**: The Inbox shows "Rahul Kumar" and "Priya Singh" as static mocks.
- **Requirement**: Implement a `GET /leads/vendor/:vendorId` endpoint and a standard `EnquiryNode` entity.
- **Action**: Migrate `Inbox.tsx` from static arrays to `useQuery` hooks targeting the `LeadsModule`.

### BUG/GAP #2: Financial Intelligence (Earnings)
- **Observed**: Revenue projections and charts are hardcoded.
- **Requirement**: Calculate `totalEarnings` by summing `confirmed` and `paid` bookings minus commission.
- **Action**: Create a `FinanceService` in the backend to provide time-series revenue data.

### BUG/GAP #3: Analytics Matrix
- **Observed**: "Neural Analytics" is currently visual-only.
- **Requirement**: Real tracking of Page Views, conversion rates, and search impressions.
- **Action**: Initialize a `TrackingModule` in the API to log vendor profile impressions.

---

## 5. Proposed Phase-wise Implementation

### Phase 1: Communication Core (Week 1)
1. Initialize the `EnquiryController` in the backend.
2. Link `Inbox.tsx` to live lead data via TanStack Query.
3. Enable WebSocket listeners for new enquiry notifications.

### Phase 2: Financial & Analytics Engine (Week 2)
1. Build the `AggregationService` for dynamic dashboard stats.
2. Replace `CHART_DATA` mocks with API-driven timeseries data.
3. Implement the Payout Request flow in `Earnings.tsx`.

### Phase 3: Infrastructure Polish (Week 3)
1. Secure the `UploadsModule` for the Gallery section (Role-based access).
2. "Neural Ad Engine" integration with the `AdsModule`.
3. Finalizing the "Export Telemetry" (PDF/CSV) reporting logic.

---
> [!IMPORTANT]
> To proceed, I recommend starting with the **Enquiry/Inbox** migration, as it represents the highest friction point for vendors trying to respond to customers.
