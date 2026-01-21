import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const validateAuth = async (req: Request) => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return { user: null, error: 'Authentication required. Please sign in.' };
  }

  const { data: { user }, error } = await supabase.auth.getUser(
    authHeader.replace('Bearer ', '')
  );

  if (error || !user) {
    return { user: null, error: 'Invalid or expired token. Please sign in again.' };
  }

  return { user, error: null, supabase };
};
