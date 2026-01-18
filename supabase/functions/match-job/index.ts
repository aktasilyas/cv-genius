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
    const { cvData, jobDescription, language = 'en' } = await req.json();
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

    const systemPrompt = `You are an expert ATS (Applicant Tracking System) analyst and career consultant. Compare the provided CV against the job description.

${languageInstructions[language as keyof typeof languageInstructions] || languageInstructions.en}

Analyze:
1. Keyword matching between CV and job description
2. Skills alignment
3. Experience relevance
4. Missing qualifications

Provide specific, actionable suggestions to improve the CV for this job.`;

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
          { role: "user", content: `Compare this CV against the job description and provide optimization suggestions:\n\nCV DATA:\n${JSON.stringify(cvData, null, 2)}\n\nJOB DESCRIPTION:\n${jobDescription}` }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "provide_job_match_analysis",
              description: "Provide job matching analysis and optimization suggestions",
              parameters: {
                type: "object",
                properties: {
                  score: { type: "number", minimum: 0, maximum: 100 },
                  matchedKeywords: {
                    type: "array",
                    items: { type: "string" }
                  },
                  missingKeywords: {
                    type: "array",
                    items: { type: "string" }
                  },
                  suggestions: {
                    type: "array",
                    items: { type: "string" }
                  },
                  optimizedSummary: { type: "string" },
                  optimizedSkills: {
                    type: "array",
                    items: { type: "string" }
                  }
                },
                required: ["score", "matchedKeywords", "missingKeywords", "suggestions"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "provide_job_match_analysis" } }
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
    console.error("match-job error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
