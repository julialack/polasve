# Plan för Stripe-integration

Jag ska integrera Stripe för att hantera betalningar för Standard-, Premium- och Featured-annonser.

## Förutsättningar
- [ ] SQL: `ALTER TABLE ads ADD COLUMN payment_status TEXT DEFAULT 'pending_payment';`
- [ ] Miljövariabler för Stripe i `.env.local`.

## Föreslagna ändringar

### 1. API-rutten för Checkout
#### [NEW] [api/checkout/route.ts](file:///C:/Users/admin/Desktop/polasve/app/api/checkout/route.ts)
- Tar emot annons-ID och paket-typ.
- Skapar en Stripe Checkout Session med rätt pris (49 kr, 149 kr, eller 299 kr).
- Returnerar URL till Stripes betalsida.

### 2. Webhook för bekräftelse
#### [NEW] [api/webhook/stripe/route.ts](file:///C:/Users/admin/Desktop/polasve/app/api/webhook/stripe/route.ts)
- Lyssnar på `checkout.session.completed`.
- Uppdaterar annonsens `payment_status` till `'paid'` i Supabase när betalningen är verifierad.

### 3. Uppdatering av Skapa-sidan
#### [MODIFY] [app/skapa-annons/page.tsx](file:///C:/Users/admin/Desktop/polasve/app/skapa-annons/page.tsx)
- Om användaren väljer ett betalpaket: Skapa annonsen med `payment_status = 'pending_payment'` och skicka sedan användaren direkt till Stripe.
- Om användaren väljer Gratis: Skapa som vanligt med `payment_status = 'paid'`.

### 4. Filtrering av annonser
- Uppdatera alla flöden (`FeedList`, `CategoryLanding` etc.) att endast visa annonser där `payment_status == 'paid'`.

## Verifieringsplan
1. Skapa en gratis-annons -> Ska dyka upp direkt.
2. Skapa en Premium-annons -> Ska skickas till Stripe.
3. Betala med Stripes test-kort -> Annonsen ska dyka upp live efteråt.
