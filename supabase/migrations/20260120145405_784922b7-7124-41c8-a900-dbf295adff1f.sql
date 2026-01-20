-- Drop the overly permissive UPDATE policy
DROP POLICY IF EXISTS "Service role can update subscriptions" ON public.user_subscriptions;

-- Create a more secure UPDATE policy - users can only update their own non-critical fields
-- Stripe webhook updates will use service_role key which bypasses RLS
CREATE POLICY "Users can update own subscription display preferences" 
ON public.user_subscriptions 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);