import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zkkbandockklkohihplp.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpra2JhbmRvY2trbGtvaGlocGxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MDYwMTYsImV4cCI6MjA3NDI4MjAxNn0.bFCFKAOw7YKq7PPouLKBs_fe6bZyGARthYFp4xaQzWA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helper functions
export const auth = {
  signUp: (email: string, password: string) => 
    supabase.auth.signUp({ email, password }),
  
  signIn: (email: string, password: string) => 
    supabase.auth.signInWithPassword({ email, password }),
  
  signOut: () => 
    supabase.auth.signOut(),
  
  getUser: () => 
    supabase.auth.getUser(),
  
  onAuthStateChange: (callback: (event: string, session: any) => void) =>
    supabase.auth.onAuthStateChange(callback)
}

// Database helper functions
export const db = {
  // Checks table operations
  getChecks: () => 
    supabase.from('checks').select('*'),
  
  createCheck: (data: any) => 
    supabase.from('checks').insert(data),
  
  updateCheck: (id: string, data: any) => 
    supabase.from('checks').update(data).eq('id', id),
  
  deleteCheck: (id: string) => 
    supabase.from('checks').delete().eq('id', id)
}

// Storage helper functions
export const storage = {
  uploadFile: (bucket: string, path: string, file: File) =>
    supabase.storage.from(bucket).upload(path, file),
  
  downloadFile: (bucket: string, path: string) =>
    supabase.storage.from(bucket).download(path),
  
  getPublicUrl: (bucket: string, path: string) =>
    supabase.storage.from(bucket).getPublicUrl(path),
  
  deleteFile: (bucket: string, path: string) =>
    supabase.storage.from(bucket).remove([path])
}

export default supabase