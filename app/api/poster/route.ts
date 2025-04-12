// app/api/poster/route.ts
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const name = validateInput(searchParams.get('name') || 'MAHMOUD MATTER')
    const subtitle = validateInput(searchParams.get('subtitle') || 'Software Solutions')

    const svg = generateCosmicSVG(name, subtitle)

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600'
      }
    })
  } catch (error) {
    console.error('SVG generation error:', error)
    return new NextResponse(generateFallbackSVG(), {
      status: 500,
      headers: {
        'Content-Type': 'image/svg+xml'
      }
    })
  }
}

function validateInput(input: string): string {
  // Basic XSS protection
  return input.replace(/[<>]/g, '')
}

function generateCosmicSVG(name: string, subtitle: string): string {
  return `
    <svg width="1200" height="800" viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Deep space background -->
      <rect width="1200" height="800" fill="#020617" />
      
      <!-- Subtle cosmic glow -->
      <g filter="url(#softGlow)" opacity="0.7">
        <circle cx="400" cy="300" r="250" fill="url(#farGalaxy)" />
        <circle cx="900" cy="500" r="180" fill="url(#nebulaGlow)" />
      </g>
      
      <!-- Floating particles -->
      ${generateFloatingParticles()}
      
      <!-- Central cosmic orb -->
      <circle cx="600" cy="400" r="300" fill="url(#orbGradient)" opacity="0.12" />
      
      <!-- Main title -->
      <text x="600" y="380" font-family="'Arial Black', sans-serif" font-size="120" font-weight="bold" 
            text-anchor="middle" fill="url(#titleGradient)" letter-spacing="1">
        ${name}
      </text>
      
      <!-- Subtitle -->
      <text x="600" y="450" font-family="Arial" font-size="48" font-weight="600" 
            text-anchor="middle" fill="url(#subtitleGradient)">
        ${subtitle}
      </text>
      
      <!-- Binary code -->
      <text x="600" y="700" font-family="Courier New" font-size="16" text-anchor="middle" fill="#6366F1" opacity="0.25">
        ${generateBinaryCode()}
      </text>
      
      ${generateSVGDefs()}
    </svg>
  `
}

function generateFloatingParticles(): string {
  const particles = [
    { cx: 150, cy: 200, r: 2, fill: '#7DD3FC', opacity: 0.8, animate: 'cy', values: '200;190;200', dur: '8s' },
    { cx: 1050, cy: 400, r: 1.5, fill: '#22D3EE', opacity: 0.6, animate: 'cx', values: '1050;1060;1050', dur: '10s' },
    { cx: 300, cy: 600, r: 1.2, fill: '#6366F1', opacity: 0.5, animate: 'cy', values: '600;590;600', dur: '7s' },
    { cx: 800, cy: 150, r: 1.8, fill: '#22D3EE', opacity: 0.7, animate: 'cx', values: '800;790;800', dur: '9s' }
  ]

  return particles.map(p => `
    <circle cx="${p.cx}" cy="${p.cy}" r="${p.r}" fill="${p.fill}" opacity="${p.opacity}">
      <animate attributeName="${p.animate}" values="${p.values}" dur="${p.dur}" repeatCount="indefinite" />
    </circle>
  `).join('')
}

function generateBinaryCode(): string {
  const binaryStrings = []
  for (let i = 0; i < 4; i++) {
    binaryStrings.push(
      Array.from({length: 8}, () => Math.round(Math.random()).toString()).join('')
    )
  }
  return binaryStrings.join(' ')
}

function generateSVGDefs(): string {
  return `
    <defs>
      <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="20" />
      </filter>
      
      <radialGradient id="farGalaxy" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" 
                      gradientTransform="translate(400 300) scale(250)">
        <stop offset="0%" stop-color="#6366F1" stop-opacity="0.5" />
        <stop offset="100%" stop-color="#22D3EE" stop-opacity="0" />
      </radialGradient>
      
      <radialGradient id="nebulaGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" 
                      gradientTransform="translate(900 500) scale(180)">
        <stop offset="0%" stop-color="#7DD3FC" stop-opacity="0.4" />
        <stop offset="100%" stop-color="#6366F1" stop-opacity="0" />
      </radialGradient>
      
      <radialGradient id="orbGradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" 
                      gradientTransform="translate(600 400) scale(300)">
        <stop offset="0%" stop-color="#6366F1" />
        <stop offset="100%" stop-color="#22D3EE" stop-opacity="0" />
      </radialGradient>
      
      <linearGradient id="titleGradient" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#7DD3FC" />
        <stop offset="50%" stop-color="#22D3EE" />
        <stop offset="100%" stop-color="#6366F1" />
      </linearGradient>
      
      <linearGradient id="subtitleGradient" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#22D3EE" />
        <stop offset="100%" stop-color="#7DD3FC" />
      </linearGradient>
    </defs>
  `
}

function generateFallbackSVG(): string {
  return `
    <svg width="1200" height="800" viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="800" fill="#020617" />
      <text x="600" y="400" font-family="Arial" font-size="48" text-anchor="middle" fill="#7DD3FC">
        Error loading cosmic view
      </text>
    </svg>
  `
}