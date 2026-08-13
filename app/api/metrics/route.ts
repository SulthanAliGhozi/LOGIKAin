import { NextResponse } from 'next/server'

export async function GET() { return NextResponse.json({ service: 'logikain-platform', environment: process.env.VERCEL_ENV || 'local', uptime_seconds: Math.round(process.uptime()), timestamp: new Date().toISOString() }) }
