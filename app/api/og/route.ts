import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 })
  }

  try {
    const response = await fetch(url)
    const text = await response.text()

    // Simple regex-based extraction to avoid heavy libraries
    const title = text.match(/<title[^>]*>(.*?)<\/title>/i)?.[1] || ''
    const description = text.match(/<meta[^>]*name="description"[^>]*content="(.*?)"[^>]*>/i)?.[1] ||
                       text.match(/<meta[^>]*property="og:description"[^>]*content="(.*?)"[^>]*>/i)?.[1] || ''
    const image = text.match(/<meta[^>]*property="og:image"[^>]*content="(.*?)"[^>]*>/i)?.[1] || ''

    return NextResponse.json({
      title,
      description,
      image,
      url
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch metadata' }, { status: 500 })
  }
}
