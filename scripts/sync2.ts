import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import { services, industries, projects, insights } from '../lib/content'

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

async function sync() {
  console.log('Inserting new data...')
  
  const mapData = (items: any[]) => items.map(item => ({
    slug: item.slug,
    name: item.name,
    summary: item.summary,
    body: item.body,
    status: 'published'
  }))
  
  // For insights which might use title/excerpt/content
  const mapInsights = (items: any[]) => items.map(item => ({
    slug: item.slug,
    title: item.name,
    excerpt: item.summary,
    content: item.body,
    status: 'published'
  }))

  const res1 = await supabase.from('content_services').insert(mapData(services))
  const res2 = await supabase.from('content_industries').insert(mapData(industries))
  const res3 = await supabase.from('content_projects').insert(mapData(projects))
  // Insights already succeeded earlier, no need to insert again

  console.log('Done!', { res1, res2, res3 })
}

sync()
