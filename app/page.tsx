import HomePageContent from "@/components/home/HomePageContent";
import { createClient } from "@/utils/supabase/server";

export const revalidate = 60; // Revalidate every minute

type SafeQueryResult<T> = {
  data: T | null
  error?: { message?: string; details?: string; hint?: string } | null
  status?: number
  statusText?: string
}

async function safeQuery<T>(
  queryPromise: PromiseLike<SafeQueryResult<T>>,
  fallback: { data: T | null }
): Promise<SafeQueryResult<T>> {
  try {
    const result = await queryPromise
    if (result && !result.error) {
      return result
    }
    return fallback
  } catch (err: any) {
    return fallback
  }
}

export default async function Home() {
  const supabase = await createClient()

  const [
    { data: adsData },
    { data: newsData }
  ] = await Promise.all([
    safeQuery(
      supabase
      .from('ads')
      .select('id, title, image_url, price, location, is_premium, created_at, status')
      .eq('is_premium', true)
      .eq('payment_status', 'paid')
      .not('status', 'eq', 'finished')
      .order('created_at', { ascending: false })
      .limit(6),
      { data: null }
    ),
    safeQuery(
      supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(4),
      { data: null }
    )
  ]);

  const featuredAds = adsData || [];
  const news = newsData || [];

  return <HomePageContent featuredAds={featuredAds} news={news} />;
}
