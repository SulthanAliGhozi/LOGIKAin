import { NextResponse } from 'next/server'
import { createClient } from '../../../lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const entity = searchParams.get('entity')
  
  if (!entity) return NextResponse.json({ error: 'Entity required' }, { status: 400 })

  try {
    const supabase = await createClient()
    let query = supabase.from(entity).select('*').order('created_at', { ascending: false }).limit(100)
    
    if (entity === 'clients') {
      query = supabase.from('clients').select('id, name, company_name').order('name')
    } else if (entity === 'leads') {
      query = supabase.from('leads').select('id, name, company').order('created_at', { ascending: false })
    } else if (entity === 'business_projects') {
      query = supabase.from('business_projects').select('id, title, client_id').order('created_at', { ascending: false })
    }
    
    const { data, error } = await query
      
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(data || [])
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
