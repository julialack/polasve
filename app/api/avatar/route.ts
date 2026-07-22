import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  // We use the stable Avataaars API via proxy to bypass CORB
  const avataaarsUrl = `https://avataaars.io/?${searchParams.toString()}`

  try {
    const response = await fetch(avataaarsUrl)
    const svgText = await response.text()

    // Returning SVG code directly from our own domain
    return new Response(svgText, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    return new Response('<svg xmlns="http://www.w3.org/2000/svg" />', {
      status: 500,
      headers: { 'Content-Type': 'image/svg+xml' }
    })
  }
}
