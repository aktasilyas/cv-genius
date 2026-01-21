import "https://deno.land/x/xhr@0.3.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, language = 'en', pdfBase64 } = await req.json();
    const openAIKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const systemPrompt = language === 'tr'
      ? `CV metnini analiz et ve yapılandırılmış JSON formatına dönüştür:
{
  "personalInfo": { "fullName": "", "email": "", "phone": "", "location": "", "linkedin": "", "website": "", "title": "" },
  "summary": "",
  "experience": [{ "id": "unique-id", "company": "", "position": "", "startDate": "YYYY-MM", "endDate": "YYYY-MM", "current": false, "description": "", "achievements": [] }],
  "education": [{ "id": "unique-id", "institution": "", "degree": "", "field": "", "startDate": "YYYY-MM", "endDate": "YYYY-MM", "gpa": "", "achievements": [] }],
  "skills": [{ "id": "unique-id", "name": "", "level": "beginner|intermediate|advanced|expert" }],
  "languages": [{ "id": "unique-id", "name": "", "proficiency": "basic|conversational|professional|native" }],
  "certificates": [{ "id": "unique-id", "name": "", "issuer": "", "date": "YYYY-MM", "url": "" }]
}`
      : `Parse the CV text and convert to structured JSON format:
{
  "personalInfo": { "fullName": "", "email": "", "phone": "", "location": "", "linkedin": "", "website": "", "title": "" },
  "summary": "",
  "experience": [{ "id": "unique-id", "company": "", "position": "", "startDate": "YYYY-MM", "endDate": "YYYY-MM", "current": false, "description": "", "achievements": [] }],
  "education": [{ "id": "unique-id", "institution": "", "degree": "", "field": "", "startDate": "YYYY-MM", "endDate": "YYYY-MM", "gpa": "", "achievements": [] }],
  "skills": [{ "id": "unique-id", "name": "", "level": "beginner|intermediate|advanced|expert" }],
  "languages": [{ "id": "unique-id", "name": "", "proficiency": "basic|conversational|professional|native" }],
  "certificates": [{ "id": "unique-id", "name": "", "issuer": "", "date": "YYYY-MM", "url": "" }]
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
          { role: 'user', content: text || 'Empty CV' }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3
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
