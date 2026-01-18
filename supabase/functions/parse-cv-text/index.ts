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
    const { text, language = 'en' } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const languageInstructions = {
      en: "Parse the text and respond in English.",
      tr: "Metni ayrıştır ve Türkçe yanıt ver.",
      de: "Analysiere den Text und antworte auf Deutsch.",
      fr: "Analyse le texte et réponds en français.",
      es: "Analiza el texto y responde en español."
    };

    const systemPrompt = `You are an expert CV/Resume parser. Extract structured information from the provided free-text CV content.

${languageInstructions[language as keyof typeof languageInstructions] || languageInstructions.en}

Parse the text and extract:
1. Personal Information (name, email, phone, location, LinkedIn, website, professional title)
2. Professional Summary
3. Work Experience (company, position, dates, description, achievements)
4. Education (institution, degree, field, dates, GPA, achievements)
5. Skills (name and proficiency level)
6. Languages (name and proficiency level)
7. Certificates (name, issuer, date, URL)

If information is missing, leave those fields empty. Infer the best possible structure from the provided text.
Generate unique IDs for array items using random strings.`;

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
          { role: "user", content: `Parse this CV text into structured data:\n\n${text}` }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "parse_cv_data",
              description: "Parse CV text into structured CV data",
              parameters: {
                type: "object",
                properties: {
                  personalInfo: {
                    type: "object",
                    properties: {
                      fullName: { type: "string" },
                      email: { type: "string" },
                      phone: { type: "string" },
                      location: { type: "string" },
                      linkedin: { type: "string" },
                      website: { type: "string" },
                      title: { type: "string" }
                    },
                    required: ["fullName", "email", "phone", "location", "title"]
                  },
                  summary: { type: "string" },
                  experience: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        company: { type: "string" },
                        position: { type: "string" },
                        startDate: { type: "string" },
                        endDate: { type: "string" },
                        current: { type: "boolean" },
                        description: { type: "string" },
                        achievements: { type: "array", items: { type: "string" } }
                      },
                      required: ["id", "company", "position", "startDate", "endDate", "current", "description", "achievements"]
                    }
                  },
                  education: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        institution: { type: "string" },
                        degree: { type: "string" },
                        field: { type: "string" },
                        startDate: { type: "string" },
                        endDate: { type: "string" },
                        gpa: { type: "string" },
                        achievements: { type: "array", items: { type: "string" } }
                      },
                      required: ["id", "institution", "degree", "field", "startDate", "endDate", "achievements"]
                    }
                  },
                  skills: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                        level: { type: "string", enum: ["beginner", "intermediate", "advanced", "expert"] }
                      },
                      required: ["id", "name", "level"]
                    }
                  },
                  languages: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                        proficiency: { type: "string", enum: ["basic", "conversational", "professional", "native"] }
                      },
                      required: ["id", "name", "proficiency"]
                    }
                  },
                  certificates: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                        issuer: { type: "string" },
                        date: { type: "string" },
                        url: { type: "string" }
                      },
                      required: ["id", "name", "issuer", "date"]
                    }
                  }
                },
                required: ["personalInfo", "summary", "experience", "education", "skills", "languages", "certificates"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "parse_cv_data" } }
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
    console.error("parse-cv-text error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
