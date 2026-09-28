import { NextResponse } from 'next/server';

const SOURCES = [
  { name: 'TVN24', url: 'https://tvn24.pl/najnowsze.xml', color: '#005bbb' },
  { name: 'Rzeczpospolita', url: 'https://www.rp.pl/rss/10', color: '#003366' },
  { name: 'Interia', url: 'https://wydarzenia.interia.pl/feed', color: '#f7d117' },
  { name: 'Onet.pl', url: 'https://wiadomosci.onet.pl/.feed', color: '#000000' },
  { name: 'Polsat News', url: 'https://www.polsatnews.pl/rss/wszystkie.xml', color: '#e60000' },
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

function extractImage(itemContent: string) {
  // Try to find image in media:content, enclosure or description
  const mediaMatch = itemContent.match(/<media:content[^>]*url="([^"]+)"/i);
  if (mediaMatch) return mediaMatch[1];

  const enclosureMatch = itemContent.match(/<enclosure[^>]*url="([^"]+)"/i);
  if (enclosureMatch) return enclosureMatch[1];

  const imgTagMatch = itemContent.match(/<img[^>]*src="([^"]+)"/i);
  if (imgTagMatch) return imgTagMatch[1];

  return null;
}

async function fetchSourceNews(source: typeof SOURCES[0]) {
  try {
    const response = await fetch(source.url, {
      next: { revalidate: 300 },
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });

    if (!response.ok) {
      console.warn(`Failed to fetch ${source.name}: status ${response.status}`);
      return [];
    }

    const xml = await response.text();
    const items = xml.split(/<item[^>]*>/i).slice(1);

    return items.slice(0, 10).map(item => {
      const itemEnd = item.search(/<\/item>/i);
      const itemContent = itemEnd !== -1 ? item.substring(0, itemEnd) : item;

      return {
        title: extractTagContent(itemContent, 'title'),
        link: extractTagContent(itemContent, 'link'),
        image: extractImage(itemContent),
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

/**
 * Balances the news list so that a dominant source (like TVN24)
 * accounts for at most `maxRatio` (e.g. 50%) of the total items.
 */
function balanceNewsSources(newsList: any[], maxRatio = 0.5, dominantSource = 'TVN24') {
  const tvn24Items = newsList.filter(item => item.source === dominantSource);
  const otherItems = newsList.filter(item => item.source !== dominantSource);

  if (otherItems.length === 0) {
    return newsList;
  }

  const result: any[] = [];
  let tvnIdx = 0;
  let othIdx = 0;

  while (tvnIdx < tvn24Items.length || othIdx < otherItems.length) {
    const nextTvn = tvn24Items[tvnIdx];
    const nextOth = otherItems[othIdx];

    const currentTvnCount = result.filter(r => r.source === dominantSource).length;
    const futureTotal = result.length + 1;
    const tvnRatioIfAdded = (currentTvnCount + 1) / futureTotal;

    if (nextTvn && nextOth) {
      const tvnDate = new Date(nextTvn.pubDate || 0).getTime();
      const othDate = new Date(nextOth.pubDate || 0).getTime();

      if (tvnDate >= othDate && tvnRatioIfAdded <= maxRatio) {
        result.push(nextTvn);
        tvnIdx++;
      } else {
        result.push(nextOth);
        othIdx++;
      }
    } else if (nextOth) {
      result.push(nextOth);
      othIdx++;
    } else if (nextTvn) {
      if (tvnRatioIfAdded <= maxRatio) {
        result.push(nextTvn);
      }
      tvnIdx++;
    }
  }

  return result;
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

    // Apply strict 50% maximum limit for TVN24
    const balancedNews = balanceNewsSources(sortedNews, 0.5, 'TVN24');

    // Return the top 20 most recent balanced news items
    return NextResponse.json(balancedNews.slice(0, 20));
  } catch (error) {
    console.error("Critical error fetching Poland news:", error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}
