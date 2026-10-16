import Stripe from 'stripe'

export const AD_PACKAGES = {
  standard: { amount: 4900 },
  premium: { amount: 14900 },
  featured: { amount: 49900 },
} as const

export type AdPackageId = keyof typeof AD_PACKAGES

export function isAdPackageId(value: unknown): value is AdPackageId {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(AD_PACKAGES, value)
}

export function getStripeClient(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY
  return secretKey ? new Stripe(secretKey) : null
}
