# DIVYANSH GAMING

## Current State
Premium Shop has demo purchase flow (no real payments). Sponsored game slot is static. Tournaments are free. Stripe component now available.

## Requested Changes (Diff)

### Add
- Stripe payment integration for Premium Shop (VIP, avatar items, badges, themes)
- Paid tournament entry via UPI payment link (Rs 10-50)
- Sponsored game slot inquiry form with pricing tiers and WhatsApp/email contact CTA
- Backend: Stripe checkout sessions, purchase records, tournament paid entry tracking

### Modify
- Premium Shop: replace demo buttons with real Stripe checkout
- Tournament section: add Pay Entry Fee step before joining
- Sponsored Game slot: add Advertise Here section with pricing

### Remove
- Mock purchase confirmations

## Implementation Plan
1. Generate backend with Stripe checkout, purchase records, tournament entry tracking, sponsor inquiries
2. Wire Stripe component
3. Frontend: real Stripe checkout in Premium Shop
4. Frontend: paid tournament entry with UPI fallback
5. Frontend: Sponsored Slot Advertise Here with pricing and contact
