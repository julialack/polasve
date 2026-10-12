import HomePageContent from "@/components/home/HomePageContent";
import { createClient } from "@/utils/supabase/server";

export const revalidate = 60; // Revalidate every minute

type SafeQueryResult<T> = {
  data: T | null
  error?: { message?: string; details?: string; hint?: string } | null
  status?: number
  statusText?: string
  count?: number | null
}

async function safeQuery<T>(query: PromiseLike<SafeQueryResult<T>>, fallback: SafeQueryResult<T>): Promise<SafeQueryResult<T>> {
  try {
    return await Promise.race([
      query,
      new Promise<SafeQueryResult<T>>((resolve) => setTimeout(() => resolve(fallback), 5000)),
    ]);
  } catch {
    return fallback;
  }
}

export default async function Home() {
  const supabase = await createClient();

  const [{ data: adsData }, { data: newsData }] = await Promise.all([
    safeQuery(
      supabase
      .from('ads')
      .select('*')
      .eq('is_premium', true)
      .eq('payment_status', 'paid')
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
