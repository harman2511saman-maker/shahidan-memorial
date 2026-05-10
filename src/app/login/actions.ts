'use server';

import { createClient } from '@/utils/supabase/server';

export async function loginAction(email: string, password: string) {
  const supabase = createClient();
  
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: 'ئیمەیڵ یان پاسوۆردەکە هەڵەیە!' };
  }

  return { success: true };
}
