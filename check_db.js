import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function check() {
  const { data, error } = await supabase.from('page_sections').select('*').eq('page_slug', 'home').eq('section_key', 'farm_banner')
  console.log('Error:', error)
  console.log('Data:', data)
}
check()
