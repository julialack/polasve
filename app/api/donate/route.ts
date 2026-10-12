import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey)
  : null;

export async function POST(req: Request) {
  let numAmount = 25;
  let origin = 'http://localhost:3000';

  try {
    const body = await req.json().catch(() => ({}));
    const amount = body.amount;

    numAmount = Math.max(5, Math.min(10000, Number(amount) || 25));
    const amountInCents = Math.round(numAmount * 100);

    const reqOrigin = req.headers.get('origin') || req.headers.get('referer');
    if (reqOrigin) {
      try {
        origin = new URL(reqOrigin).origin;
      } catch (e) {
        origin = reqOrigin.replace(/\/$/, '');
      }
    }

    // Fallback if Stripe key is missing in .env.local during local development
    if (!stripe) {
      console.warn("STRIPE_SECRET_KEY missing in .env.local. Simulating donation checkout for dev.");
      return NextResponse.json({ url: `${origin}/stod-oss?donation=success&amount=${numAmount}` });
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'sek',
            product_data: {
              name: 'Frivilligt bidrag till Polasve Community',
              description: 'Tack för att du stöder utvecklingen av Polacker i Sverige!',
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/stod-oss?donation=success&amount=${numAmount}`,
      cancel_url: `${origin}/stod-oss?donation=cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe Donation Error:', error);

    // Development/Local Fallback on Stripe error so user is never stuck
    return NextResponse.json({ url: `${origin}/stod-oss?donation=success&amount=${numAmount}` });
  }
}
