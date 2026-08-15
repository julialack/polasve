import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2026-07-29.dahlia',
    })
  : null;

const PRICES: Record<string, number> = {
  standard: 4900, // 49 SEK in cents
  premium: 14900, // 149 SEK in cents
  featured: 29900, // 299 SEK in cents
};

export async function POST(req: Request) {
  try {
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe is not configured' }, { status: 500 });
    }

    const { adId, packageId, adTitle } = await req.json();

    if (!PRICES[packageId]) {
      return NextResponse.json({ error: 'Invalid package' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'sek',
            product_data: {
              name: `Annons: ${adTitle}`,
              description: `Betalning för paket: ${packageId}`,
            },
            unit_amount: PRICES[packageId],
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/annonser/${adId}?payment=success`,
      cancel_url: `${req.headers.get('origin')}/skapa-annons?payment=cancel`,
      metadata: {
        adId,
        packageId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
