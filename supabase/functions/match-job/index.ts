import "https://deno.land/x/xhr@0.3.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
