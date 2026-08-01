import { NextResponse } from 'next/server';

const SOURCES = [
  { name: 'TVN24', url: 'https://tvn24.pl/najnowsze.xml', color: '#005bbb' },
  { name: 'Rzeczpospolita', url: 'https://www.rp.pl/rss', color: '#003366' },
  { name: 'Interia', url: 'https://fakty.interia.pl/rss', color: '#f7d117' },
  { name: 'Onet.pl', url: 'https://www.onet.pl/rss', color: '#000000' },
];

function extractTagContent(xml: string, tag: string) {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i'));
  if (!match) return '';
  let content = match[1];
  // Remove CDATA
  content = content.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1');
  // Simple HTML entity decoding
  content = content.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#039;/g, "'");
  return content.trim();
}

async function fetchSourceNews(source: typeof SOURCES[0]) {
  try {
    const response = await fetch(source.url, {
      next: { revalidate: 300 },
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PolasveBot/1.0)' }
    });
    const xml = await response.text();

    // Split into items using regex to be more robust
    const items = xml.split(/<item[^>]*>/i).slice(1);

    return items.slice(0, 5).map(item => {
      // Ensure we don't pick up tags after the current item
      const itemEnd = item.search(/<\/item>/i);
      const itemContent = itemEnd !== -1 ? item.substring(0, itemEnd) : item;

      return {
        title: extractTagContent(itemContent, 'title'),
        link: extractTagContent(itemContent, 'link'),
        source: source.name,
        color: source.color,
        pubDate: extractTagContent(itemContent, 'pubDate')
      };
    }).filter(news => news.title && news.link);
  } catch (error) {
    console.error(`Error fetching news from ${source.name}:`, error);
    return [];
  }
}

export async function GET() {
  try {
    const allNewsResults = await Promise.all(SOURCES.map(fetchSourceNews));
    const flattenedNews = allNewsResults.flat();

    // Sort all news by date (latest first)
    const sortedNews = flattenedNews.sort((a, b) => {
      const dateA = a.pubDate ? new Date(a.pubDate).getTime() : 0;
      const dateB = b.pubDate ? new Date(b.pubDate).getTime() : 0;
      return dateB - dateA;
    });

    // Return the top 20 most recent news across all sources
    return NextResponse.json(sortedNews.slice(0, 20));
  } catch (error) {
    console.error("Critical error fetching Poland news:", error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}
