import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, type, language = 'en' } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const languageInstructions = {
      en: "Write the improved text in English.",
      tr: "İyileştirilmiş metni Türkçe yaz.",
      de: "Schreibe den verbesserten Text auf Deutsch.",
      fr: "Écris le texte amélioré en français.",
      es: "Escribe el texto mejorado en español."
    };

    const typeInstructions = {
      summary: "This is a professional summary. Make it compelling, highlight key strengths, and keep it concise (3-4 sentences).",
      experience: "This is a job description/achievements. Use strong action verbs, quantify achievements, and focus on impact.",
      education: "This is educational background. Highlight relevant coursework, achievements, and skills gained.",
      skill: "This is a skill description. Make it sound professional and specific."
    };

    const systemPrompt = `You are an expert CV/Resume writer. Improve the provided text to be more professional, impactful, and ATS-friendly.

${languageInstructions[language as keyof typeof languageInstructions] || languageInstructions.en}

${typeInstructions[type as keyof typeof typeInstructions] || typeInstructions.summary}

Guidelines:
- Use active voice and strong action verbs
- Quantify achievements when possible
- Keep the content truthful but enhanced
- Optimize for ATS keyword matching
- Maintain professional tone`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Improve this ${type} text:\n\n${text}` }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "provide_improved_text",
              description: "Provide improved professional text",
              parameters: {
                type: "object",
                properties: {
                  improvedText: { type: "string" },
                  explanation: { type: "string" },
                  keyChanges: {
                    type: "array",
                    items: { type: "string" }
                  }
                },
                required: ["improvedText", "explanation", "keyChanges"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "provide_improved_text" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall) {
      throw new Error("No tool call in response");
    }

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("improve-text error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
