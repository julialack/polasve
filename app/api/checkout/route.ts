import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { AD_PACKAGES, getStripeClient, isAdPackageId } from '@/lib/stripe'

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON request' }, { status: 400 })
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid checkout request' }, { status: 400 })
  }

  const { adId, packageId } = body as { adId?: unknown; packageId?: unknown }
  if (typeof adId !== 'string' || !adId || !isAdPackageId(packageId)) {
    return NextResponse.json({ error: 'Invalid ad or package' }, { status: 400 })
  }

  const stripe = getStripeClient()
  if (!stripe) {
    console.error('Stripe checkout is unavailable: STRIPE_SECRET_KEY is not configured')
    return NextResponse.json({ error: 'Betalning är inte tillgänglig just nu' }, { status: 503 })
  }

  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError) {
    console.error('Could not verify checkout user:', authError)
    return NextResponse.json({ error: 'Kunde inte verifiera användaren' }, { status: 500 })
  }
  if (!user) {
    return NextResponse.json({ error: 'Du måste vara inloggad för att betala' }, { status: 401 })
  }

  const { data: ad, error: adError } = await supabase
    .from('ads')
    .select('id, title, user_id, payment_status')
    .eq('id', adId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (adError) {
    console.error('Could not load ad for checkout:', adError)
    return NextResponse.json({ error: 'Kunde inte hitta annonsen' }, { status: 500 })
  }
  if (!ad) {
    return NextResponse.json({ error: 'Annonsen hittades inte' }, { status: 404 })
  }
  if (ad.payment_status !== 'pending_payment') {
    return NextResponse.json({ error: 'Annonsen väntar inte på betalning' }, { status: 409 })
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'sek',
            product_data: {
              name: `Annons: ${ad.title}`,
              description: `Betalning för paket: ${packageId}`,
            },
            unit_amount: AD_PACKAGES[packageId].amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${new URL(process.env.NEXT_PUBLIC_SITE_URL || req.url).origin}/annonser/${ad.id}?payment=success`,
      cancel_url: `${new URL(process.env.NEXT_PUBLIC_SITE_URL || req.url).origin}/skapa-annons?payment=cancel`,
      metadata: {
        type: 'ad',
        adId: ad.id,
        userId: user.id,
        packageId,
      },
    })

    if (!session.url) {
      console.error('Stripe created a checkout session without a redirect URL')
      return NextResponse.json({ error: 'Betalningen kunde inte startas' }, { status: 502 })
    }

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe checkout session creation failed:', error)
    return NextResponse.json({ error: 'Betalningen kunde inte startas' }, { status: 502 })
  }
}
