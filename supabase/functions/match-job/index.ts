import "https://deno.land/x/xhr@0.3.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const FREE_LIMIT = 5;
const PREMIUM_LIMIT = 50;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth kontrolü - ZORUNLU
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({
        error: 'Authentication required',
        message: 'Please sign in to use AI features'
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(JSON.stringify({
        error: 'Invalid token',
        message: 'Please sign in again'
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Kullanıcının plan'ını kontrol et
    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select('plan')
      .eq('user_id', user.id)
      .single();

    const isPremium = subscription?.plan === 'premium';
    const dailyLimit = isPremium ? PREMIUM_LIMIT : FREE_LIMIT;

    // Günlük kullanımı kontrol et
    const today = new Date().toISOString().split('T')[0];
    const { count } = await supabase
      .from('ai_usage')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('function_name', 'match-job')
      .gte('created_at', `${today}T00:00:00Z`);

    if ((count || 0) >= dailyLimit) {
      return new Response(JSON.stringify({
        error: 'Daily limit reached',
        message: isPremium
          ? `You have used all ${dailyLimit} daily job matches.`
          : `Free plan allows ${dailyLimit} job matches per day. Upgrade to Premium for more.`,
        limit: dailyLimit,
        used: count,
        isPremium
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Request body'yi al
    const { cvData, jobDescription, language = 'en' } = await req.json();
    const openAIKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const systemPrompt = language === 'tr'
      ? `CV ile iş ilanını karşılaştır ve JSON formatında yanıt ver:
{
  "score": 0-100,
  "matchedKeywords": ["eşleşen", "anahtar", "kelimeler"],
  "missingKeywords": ["eksik", "anahtar", "kelimeler"],
  "suggestions": ["CV'yi iyileştirmek için öneriler"],
  "optimizedSummary": "İş ilanına göre optimize edilmiş özet",
  "optimizedSkills": ["önerilen", "yeni", "beceriler"]
}`
      : `Compare the CV with the job description and respond in JSON format:
{
  "score": 0-100,
  "matchedKeywords": ["matched", "key", "words"],
  "missingKeywords": ["missing", "key", "words"],
  "suggestions": ["Suggestions to improve CV for this job"],
  "optimizedSummary": "Optimized summary for the job",
  "optimizedSkills": ["suggested", "new", "skills"]
}`;

    const userContent = `CV:\n${JSON.stringify(cvData)}\n\nJob Description:\n${jobDescription}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.5
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API error');
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    // Kullanımı kaydet
    const tokensUsed = data.usage?.total_tokens || 0;
    await supabase.from('ai_usage').insert({
      user_id: user.id,
      function_name: 'match-job',
      tokens_used: tokensUsed
    });

    // Kalan kullanım bilgisini response'a ekle
    return new Response(JSON.stringify({
      ...result,
      _usage: {
        remaining: dailyLimit - (count || 0) - 1,
        limit: dailyLimit,
        isPremium
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
