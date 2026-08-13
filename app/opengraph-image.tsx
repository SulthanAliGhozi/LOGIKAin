import { ImageResponse } from 'next/og'

export const alt = 'LOGIKAin — Yang rumit, kami LOGIKAin.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(<div style={{ background: '#f5f0e9', color: '#151515', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px', fontFamily: 'Arial' }}><div style={{ color: '#c97539', fontSize: 24, letterSpacing: 5 }}>DIGITAL PARTNER UNTUK BISNIS YANG BERGERAK</div><div style={{ display: 'flex', flexDirection: 'column', fontSize: 92, fontWeight: 800, lineHeight: 1, marginTop: 35 }}>Yang rumit,<span style={{ color: '#c97539' }}>kami LOGIKAin.</span></div><div style={{ fontSize: 22, marginTop: 40, color: '#716d66' }}>Strategy · Product · Automation · AI Agent</div></div>, { ...size })
}
