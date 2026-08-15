import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const circleColor = searchParams.get('circleColor')

  // We use the stable Avataaars API via proxy to bypass CORB
  const avataaarsUrl = `https://avataaars.io/?${searchParams.toString()}`

  try {
    const response = await fetch(avataaarsUrl)
    let svgText = await response.text()

    if (svgText.startsWith('<svg') && circleColor) {
      if (circleColor === 'transparent') {
        svgText = svgText.replace(/<circle[^>]*fill="[^"]+"[^>]*\/>/i, '');
      } else {
        // Avataaars uses #65C9FF as the default blue circle color
        svgText = svgText.replace(/#65C9FF/gi, circleColor);
        // Fallback for cases where it might use lowercase or different attribute structure
        svgText = svgText.replace(/(<circle[^>]*fill=")([^"]+)("[^>]*\/>)/i, `$1${circleColor}$3`);
      }
    }

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
