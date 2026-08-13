import { createClient } from './supabase/server'

export async function createPrivateDownloadUrl(bucket: string, path: string, expiresIn = 3600) {
  const supabase = await createClient()
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn)
  if (error) throw new Error(error.message)
  return data.signedUrl
}
