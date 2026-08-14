import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'

const loadEnv = (file: string) => {
  try {
    const data = fs.readFileSync(file, 'utf8')
    data.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/)
      if (match) process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '')
    })
  } catch (e) {}
}
loadEnv('.env')
loadEnv('.env.local')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
const supabase = createClient(supabaseUrl!, supabaseKey!)

async function check() {
  const { data, error } = await supabase.rpc('get_schema') // Wait, RPC might not exist.
  // We can just try inserting with 'name', 'summary', 'body' and see the error.
  const res = await supabase.from('content_services').insert([{ name: 'x', summary: 'y', body: 'z', status: 'published' }])
  console.log('Insert test:', res.error)
}
check()
