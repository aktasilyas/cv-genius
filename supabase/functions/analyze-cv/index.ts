import "https://deno.land/x/xhr@0.3.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { cvData, language = 'en' } = await req.json();
    const openAIKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const systemPrompt = language === 'tr'
      ? `Sen profesyonel bir CV analistisin. CV'yi analiz et ve JSON formatında yanıt ver:
{
  "feedback": [
    { "id": "unique-id", "section": "experience|education|skills|summary|personalInfo", "type": "warning|suggestion|improvement", "message": "Türkçe mesaj", "suggestion": "Türkçe öneri" }
  ],
  "score": {
    "overall": 0-100,
    "breakdown": { "completeness": 0-100, "quality": 0-100, "atsCompatibility": 0-100, "impact": 0-100 },
    "recommendations": ["Türkçe öneri 1", "Türkçe öneri 2"]
  }
}`
      : `You are a professional CV analyst. Analyze the CV and respond in JSON format:
{
  "feedback": [
    { "id": "unique-id", "section": "experience|education|skills|summary|personalInfo", "type": "warning|suggestion|improvement", "message": "English message", "suggestion": "English suggestion" }
  ],
  "score": {
    "overall": 0-100,
    "breakdown": { "completeness": 0-100, "quality": 0-100, "atsCompatibility": 0-100, "impact": 0-100 },
    "recommendations": ["Recommendation 1", "Recommendation 2"]
  }
}`;

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
          { role: 'user', content: JSON.stringify(cvData) }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7
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
