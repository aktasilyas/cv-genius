import "https://deno.land/x/xhr@0.3.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, type, language = 'en' } = await req.json();
    const openAIKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const typeInstructions: Record<string, string> = {
      summary: language === 'tr' ? 'Profesyonel CV özeti olarak iyileştir' : 'Improve as a professional CV summary',
      experience: language === 'tr' ? 'İş deneyimi açıklaması olarak güçlendir, başarıları vurgula' : 'Enhance as job experience description, highlight achievements',
      education: language === 'tr' ? 'Eğitim açıklaması olarak iyileştir' : 'Improve as education description',
      skill: language === 'tr' ? 'Beceri açıklaması olarak profesyonelleştir' : 'Professionalize as skill description'
    };

    const systemPrompt = language === 'tr'
      ? `Sen CV yazım uzmanısın. ${typeInstructions[type] || 'Metni iyileştir'}. JSON formatında yanıt ver:
{
  "improvedText": "İyileştirilmiş metin",
  "explanation": "Yapılan değişikliklerin açıklaması",
  "keyChanges": ["Değişiklik 1", "Değişiklik 2"]
}`
      : `You are a CV writing expert. ${typeInstructions[type] || 'Improve the text'}. Respond in JSON format:
{
  "improvedText": "Improved text",
  "explanation": "Explanation of changes made",
  "keyChanges": ["Change 1", "Change 2"]
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
          { role: 'user', content: text }
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
