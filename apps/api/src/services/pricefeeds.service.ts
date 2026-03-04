// External price feed service. (Phase 9 implementation)
// Fetches current LNG/gas spot prices from external APIs.
// In Phase 0-8 this returns placeholder data.
// OWASP A10: Only whitelisted domains are ever fetched.
import { env } from "../config/env.js"

// Whitelist of allowed external domains for price data.
// Never fetch from user-provided or dynamic URLs.
const ALLOWED_PRICE_FEED_DOMAINS = [
  "api.example-price-feed.com",
  // Add real price API domain here in Phase 9
]

export const priceFeedsService = {
  // Returns the latest spot price for a given product.
  // Falls back to null if the API is unavailable.
  async getSpotPrice(product: "LNG" | "NG" | "CNG"): Promise<number | null> {
    if (!env.PRICE_FEED_API_KEY || !env.PRICE_FEED_BASE_URL) {
      // Phase 9 not yet configured - return placeholder
      return null
    }

    // Validate the base URL against the whitelist (OWASP A10: SSRF prevention)
    const feedUrl = new URL(env.PRICE_FEED_BASE_URL)
    if (!ALLOWED_PRICE_FEED_DOMAINS.includes(feedUrl.hostname)) {
      console.warn("Price feed URL not in whitelist - skipping fetch")
      return null
    }

    try {
      const response = await fetch(`${env.PRICE_FEED_BASE_URL}/spot/${product}`, {
        headers: { "Authorization": `Bearer ${env.PRICE_FEED_API_KEY}` },
        signal: AbortSignal.timeout(5000), // 5 second timeout
      })

      if (!response.ok) return null

      const data = await response.json() as { price: number }
      return data.price
    } catch {
      // Network error or timeout - return null, caller shows cached price
      return null
    }
  }
}
