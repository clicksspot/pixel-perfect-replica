# ClicksSpot — Build Plan

The brief is large, so it ships in phases. Each phase is usable on its own.

## Phase 1 — Foundation and public site (this turn)
- Enable Lovable Cloud.
- Design system: emerald #0F7B4F, forest #0B3D2E, mint #ECFDF3, DM Serif Display + DM Sans, light/dark toggle.
- Database: profiles, user_roles + has_role, categories, listings, listing_images, watchlist, settings, with strict RLS and grants. Private fields (URL, credentials) in a separate owner/deal-only table.
- Seed 12 demo listings across categories.
- Pages: Home (hero search, categories, featured, how it works, escrow explainer, stats, testimonials, FAQ, CTA), Browse (filters, sort, pagination, grid/list), Listing detail, plus About, How Escrow Works, Fees, FAQ, Contact, Terms, Privacy, Refund & Dispute, Prohibited Items. Each with its own SEO metadata.
- Auth: email/password signup with verification, role choice, forgot/reset password.

## Phase 2 — Seller and buyer
- Multi-step listing form with screenshot/proof uploads (private storage), status flow Draft → Pending → Approved/Rejected → Under Offer → Sold/Withdrawn/Expired.
- Offers: make, accept, reject, counter, withdraw, Buy Now.
- Seller and buyer dashboards, watchlist, profile with payout wallet details, seller verification upload.

## Phase 3 — Escrow deals
- Deals with database-enforced status transitions, deal_events log, visual stepper.
- Payment instructions with reference code and countdown, TXID + screenshot submission, delivery form, buyer approve/reject, auto-approve, payout recording, disputes, cancellation/refund.
- Reviews and seller reputation; receipt PDF.

## Phase 4 — Admin panel
- Overview metrics, listing review queue, users and KYC, payment verification and payout queues, dispute center, finance ledger with CSV export, settings (fee %, Binance details, deadlines, categories, FAQ, banner), reports, audit log.

## Phase 5 — Extras
- Realtime messaging with contact-detail blocking, notifications (bell + email), NDA gate, saved searches, recently viewed, view counters, anti-fraud checks, cookie banner, sitemap, multi-currency display, seller analytics, optional 2FA.

## Technical notes
- TanStack Start with server functions (not React Router); Lovable Cloud for auth, Postgres, storage, realtime.
- Status transitions enforced by Postgres triggers; admin-only actions via has_role checks.
- You'll make yourself admin by adding your user to user_roles after signup (I'll give the exact step).
