# Walkthrough - Stripe Betalningsintegration

Jag har nu implementerat ett komplett betalningsflöde med Stripe för Standard-, Premium- och Featured-annonser.

## Ändringar

### 1. Backend-stöd (API & Webhooks)
- **Checkout API:** [api/checkout/route.ts](file:///C:/Users/admin/Desktop/polasve/app/api/checkout/route.ts) skapar säkra betalsessioner hos Stripe.
- **Webhook Handler:** [api/webhook/stripe/route.ts](file:///C:/Users/admin/Desktop/polasve/app/api/webhook/stripe/route.ts) lyssnar efter slutförda betalningar och aktiverar annonserna automatiskt i databasen.

### 2. Uppdaterat Annonsflöde
- **Automatisering:** När en användare väljer ett betalpaket (t.ex. Premium) skickas de direkt till Stripes betalsida efter att de fyllt i annonsuppgifterna.
- **Säkerhet:** Annonsen sparas först som "pending_payment" och blir inte synlig för besökare förrän betalningen är bekräftad.
- **Gratisannonser:** Fungerar precis som tidigare och publiceras direkt.

### 3. Filtrering
- Jag har uppdaterat alla vyer (startsidan, kategorier, bazaren) så att endast betalda annonser visas för besökare.

## Viktiga steg för dig

För att detta ska fungera live behöver du:

1.  **Kör SQL i Supabase:**
    ```sql
    ALTER TABLE public.ads ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending_payment';
    ```
2.  **Lägg till Miljövariabler (.env.local):**
    - `STRIPE_SECRET_KEY`
    - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
    - `STRIPE_WEBHOOK_SECRET` (Hämtas från Stripe CLI eller Stripe Dashboard under Webhooks).

> [!TIP]
> För att testa lokalt kan du använda Stripes test-kortnummer (t.ex. 4242 4242 4242 4242).

Nu är portalen redo att börja tjäna pengar!
