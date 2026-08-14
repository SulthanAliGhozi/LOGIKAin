import { NextResponse } from 'next/server'
import { createClient } from '../../../lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('media_assets')
      .select('id, file_name, alt_text, storage_path')
      .order('created_at', { ascending: false })
      
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(data || [])
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
