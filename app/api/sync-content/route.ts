import { NextResponse } from 'next/server'
import { createClient } from '../../../lib/supabase/server'
import { services, industries, projects, insights } from '../../../lib/content'

export async function GET() {
  const supabase = await createClient()
  
  // Clear existing data
  await supabase.from('content_services').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('content_industries').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('content_projects').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('content_insights').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  // Insert new data
  const mapData = (items: any[]) => items.map(item => ({
    slug: item.slug,
    title: item.name,
    excerpt: item.summary,
    content: item.body,
    status: 'published'
  }))

  const { error: err1 } = await supabase.from('content_services').insert(mapData(services))
  const { error: err2 } = await supabase.from('content_industries').insert(mapData(industries))
  const { error: err3 } = await supabase.from('content_projects').insert(mapData(projects))
  const { error: err4 } = await supabase.from('content_insights').insert(mapData(insights))

  return NextResponse.json({ 
    success: true, 
    errors: { err1, err2, err3, err4 }
  })
}
