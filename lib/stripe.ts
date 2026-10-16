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
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim()
  return secretKey ? new Stripe(secretKey) : null
}

export function getSiteOrigin(reqUrl?: string): string {
  const rawEnvUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (rawEnvUrl) {
    const formattedUrl = rawEnvUrl.startsWith('http://') || rawEnvUrl.startsWith('https://')
      ? rawEnvUrl
      : `https://${rawEnvUrl}`
    try {
      return new URL(formattedUrl).origin
    } catch {
      // Fallback below
    }
  }
  if (reqUrl) {
    try {
      return new URL(reqUrl).origin
    } catch {
      // Fallback below
    }
  }
  return 'https://polasve.vercel.app'
}
