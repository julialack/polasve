import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase-admin'
import { AD_PACKAGES, getStripeClient, isAdPackageId } from '@/lib/stripe'

export async function POST(req: Request) {
  const stripe = getStripeClient()
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!stripe || !webhookSecret) {
    console.error('Stripe webhook configuration missing: STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET')
    return NextResponse.json({ error: 'Stripe is not configured' }, { status: 500 })
  }

  const signature = req.headers.get('stripe-signature')
  if (!signature) {
    return NextResponse.json({ error: 'Missing Stripe signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(await req.text(), signature, webhookSecret)
  } catch (error) {
    console.error('Stripe webhook signature verification failed:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true })
  }

  const session = event.data.object
  if (session.mode !== 'payment' || session.payment_status !== 'paid') {
    return NextResponse.json({ received: true })
  }

  if (session.metadata?.type !== 'ad') {
    return NextResponse.json({ received: true })
  }

  const { adId, userId, packageId } = session.metadata
  if (
    !adId ||
    !userId ||
    !isAdPackageId(packageId) ||
    session.currency !== 'sek' ||
    session.amount_total !== AD_PACKAGES[packageId].amount
  ) {
    console.error('Completed Stripe ad checkout has invalid metadata or amount:', session.id)
    return NextResponse.json({ error: 'Invalid checkout session' }, { status: 400 })
  }

  const supabase = createAdminClient()
  if (!supabase) {
    console.error('Stripe webhook cannot update ads: Supabase service role configuration is missing')
    return NextResponse.json({ error: 'Database is not configured' }, { status: 500 })
  }

  const { data, error } = await supabase
    .from('ads')
    .update({
      payment_status: 'paid',
      is_premium: packageId !== 'standard',
    })
    .eq('id', adId)
    .eq('user_id', userId)
    .select('id')

  if (error) {
    console.error('Error updating ad payment status:', error)
    return NextResponse.json({ error: 'Database update failed' }, { status: 500 })
  }
  if (!data?.length) {
    console.error('No ad matched completed Stripe checkout:', adId)
    return NextResponse.json({ error: 'Ad not found for checkout' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
