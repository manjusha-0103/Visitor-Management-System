import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const isConfigured = Boolean(supabaseUrl && supabaseKey)

const createMissingConfigError = () =>
  new Error(
    "Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment."
  )

const supabaseClient = isConfigured ? createClient(supabaseUrl, supabaseKey) : null

// Export a proxy so imports don't crash during startup when Supabase is not configured.
// The app will fail only when a Supabase-dependent code path is used.
const supabase = new Proxy(
  {},
  {
    get(_target, prop) {
      if (!supabaseClient) {
        throw createMissingConfigError()
      }
      return supabaseClient[prop]
    },
  }
)

export const isSupabaseConfigured = () => isConfigured

export default supabase
