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
    const { cvData, language = 'en' } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const languageInstructions = {
      en: "Respond in English.",
      tr: "Türkçe yanıt ver.",
      de: "Antworte auf Deutsch.",
      fr: "Réponds en français.",
      es: "Responde en español."
    };

    const systemPrompt = `You are an expert CV/Resume analyst and career consultant. Analyze the provided CV data and provide actionable feedback.

${languageInstructions[language as keyof typeof languageInstructions] || languageInstructions.en}

Analyze these aspects:
1. Content Quality: Is the content professional and impactful?
2. Completeness: Are all important sections filled?
3. ATS Compatibility: Will it pass Applicant Tracking Systems?
4. Achievement Focus: Are accomplishments quantified and action-oriented?
5. Language & Grammar: Is it professionally written?

For each issue found, provide:
- A clear description of the problem
- A specific suggestion to fix it
- An explanation of why this matters
- If applicable, provide improved text that can be applied directly`;

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
          { role: "user", content: `Analyze this CV data and provide feedback:\n\n${JSON.stringify(cvData, null, 2)}` }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "provide_cv_analysis",
              description: "Provide structured CV analysis feedback",
              parameters: {
                type: "object",
                properties: {
                  feedback: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        section: { type: "string", enum: ["personalInfo", "summary", "experience", "education", "skills", "languages", "certificates"] },
                        type: { type: "string", enum: ["warning", "suggestion", "improvement"] },
                        message: { type: "string" },
                        suggestion: { type: "string" },
                        explanation: { type: "string" },
                        improvedText: { type: "string" }
                      },
                      required: ["id", "section", "type", "message"]
                    }
                  },
                  score: {
                    type: "object",
                    properties: {
                      overall: { type: "number", minimum: 0, maximum: 100 },
                      breakdown: {
                        type: "object",
                        properties: {
                          completeness: { type: "number", minimum: 0, maximum: 100 },
                          quality: { type: "number", minimum: 0, maximum: 100 },
                          atsCompatibility: { type: "number", minimum: 0, maximum: 100 },
                          impact: { type: "number", minimum: 0, maximum: 100 }
                        },
                        required: ["completeness", "quality", "atsCompatibility", "impact"]
                      },
                      recommendations: {
                        type: "array",
                        items: { type: "string" }
                      }
                    },
                    required: ["overall", "breakdown", "recommendations"]
                  }
                },
                required: ["feedback", "score"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "provide_cv_analysis" } }
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
    console.error("analyze-cv error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
