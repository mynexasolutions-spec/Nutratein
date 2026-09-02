import { supabase } from './supabaseClient';

/**
 * Fetch a single site_content row by key.
 * Returns `fallback` if the row doesn't exist yet or the request fails,
 * so the site never breaks before the admin has saved anything.
 */
export async function getSiteContent(key, fallback = null) {
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('value')
      .eq('key', key)
      .maybeSingle();

    if (error || !data) return fallback;
    return data.value ?? fallback;
  } catch {
    return fallback;
  }
}

/** Upsert a site_content row. Only succeeds for admins (enforced by RLS). */
export async function saveSiteContent(key, value) {
  return supabase
    .from('site_content')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
}
