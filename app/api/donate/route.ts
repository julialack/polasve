import { NextResponse } from 'next/server'
import { getSiteOrigin, getStripeClient } from '@/lib/stripe'

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON request' }, { status: 400 })
  }

  const amount = body && typeof body === 'object' && 'amount' in body
    ? Number(body.amount)
    : Number.NaN
  if (!Number.isFinite(amount) || amount < 5 || amount > 10000) {
    return NextResponse.json({ error: 'Beloppet måste vara mellan 5 och 10 000 kr' }, { status: 400 })
  }

  const stripe = getStripeClient()
  if (!stripe) {
    console.error('Donation checkout is unavailable: STRIPE_SECRET_KEY is not configured')
    return NextResponse.json({ error: 'Betalning är inte tillgänglig just nu' }, { status: 503 })
  }

  const amountInCents = Math.round(amount * 100)
  const siteOrigin = getSiteOrigin(req.url)

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
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
      success_url: `${siteOrigin}/stod-oss?donation=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteOrigin}/stod-oss?donation=cancel`,
      metadata: {
        type: 'donation',
      },
    })

    if (!session.url) {
      console.error('Stripe created a donation session without a redirect URL')
      return NextResponse.json({ error: 'Betalningen kunde inte startas' }, { status: 502 })
    }

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe donation session creation failed:', error)
    const message = error instanceof Error ? error.message : 'Betalningen kunde inte startas'
    return NextResponse.json({ error: `Betalningen kunde inte startas: ${message}` }, { status: 502 })
  }
}

export async function GET(req: Request) {
  const sessionId = new URL(req.url).searchParams.get('session_id')
  if (!sessionId) {
    return NextResponse.json({ error: 'Missing checkout session ID' }, { status: 400 })
  }

  const stripe = getStripeClient()
  if (!stripe) {
    console.error('Donation verification is unavailable: STRIPE_SECRET_KEY is not configured')
    return NextResponse.json({ error: 'Betalning är inte tillgänglig just nu' }, { status: 503 })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (session.mode !== 'payment' || session.metadata?.type !== 'donation') {
      return NextResponse.json({ error: 'Ogiltig donationssession' }, { status: 404 })
    }

    const amount = session.payment_status === 'paid' && session.amount_total !== null
      ? session.amount_total / 100
      : null

    return NextResponse.json(
      { paid: amount !== null, amount },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch (error) {
    console.error('Stripe donation verification failed:', error)
    return NextResponse.json({ error: 'Kunde inte verifiera betalningen' }, { status: 502 })
  }
}
