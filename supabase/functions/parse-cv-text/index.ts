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
    const { text, pdfBase64, language = 'en' } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const languageInstructions = {
      en: "Parse the CV and respond in English.",
      tr: "CV'yi ayrıştır ve Türkçe yanıt ver.",
      de: "Analysiere den Lebenslauf und antworte auf Deutsch.",
      fr: "Analyse le CV et réponds en français.",
      es: "Analiza el CV y responde en español."
    };

    const systemPrompt = `You are an expert CV/Resume parser. Extract ALL structured information from the provided CV/Resume.

${languageInstructions[language as keyof typeof languageInstructions] || languageInstructions.en}

CRITICAL PARSING GUIDELINES:
1. Extract EVERY piece of information you can find - do not skip anything
2. For LinkedIn PDF exports: The name is at the very top, followed by the headline/title
3. Look carefully for:
   - Email addresses (containing @)
   - Phone numbers (various formats)
   - LinkedIn URLs
   - Location/Address
4. Work Experience: Extract ALL jobs with company names, positions, dates, and descriptions
5. Education: Extract ALL education entries with institutions, degrees, fields, and dates
6. Skills: List ALL skills mentioned, estimate proficiency based on context
7. Languages: Extract language proficiencies
8. Certifications: Extract any certificates or certifications

IMPORTANT: Parse the ENTIRE document thoroughly. LinkedIn PDFs contain valuable information - extract it all!

Generate unique IDs (like "exp_1", "edu_1", "skill_1") for array items.`;

    // Build the messages array based on whether we have a PDF or text
    const messages: any[] = [
      { role: "system", content: systemPrompt }
    ];

    if (pdfBase64) {
      // Use multimodal capability - send PDF as base64 image/document
      // Gemini can read PDF content when sent as base64
      console.log("Processing PDF with multimodal AI...");
      
      messages.push({
        role: "user",
        content: [
          {
            type: "text",
            text: "Please parse this CV/Resume PDF document and extract all structured information. Look at every section carefully and extract personal info, work experience, education, skills, languages, and certifications."
          },
          {
            type: "image_url",
            image_url: {
              url: `data:application/pdf;base64,${pdfBase64}`
            }
          }
        ]
      });
    } else if (text) {
      messages.push({
        role: "user",
        content: `Parse this CV/Resume text into structured data:\n\n${text.substring(0, 50000)}`
      });
    } else {
      throw new Error("No CV content provided. Please provide either text or a PDF file.");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
        tools: [
          {
            type: "function",
            function: {
              name: "parse_cv_data",
              description: "Parse CV/Resume into structured data with all sections",
              parameters: {
                type: "object",
                properties: {
                  personalInfo: {
                    type: "object",
                    description: "Personal and contact information",
                    properties: {
                      fullName: { type: "string", description: "Full name of the person" },
                      email: { type: "string", description: "Email address" },
                      phone: { type: "string", description: "Phone number" },
                      location: { type: "string", description: "City, Country or address" },
                      linkedin: { type: "string", description: "LinkedIn profile URL" },
                      website: { type: "string", description: "Personal website URL" },
                      title: { type: "string", description: "Professional title/headline" }
                    },
                    required: ["fullName", "title"]
                  },
                  summary: { 
                    type: "string", 
                    description: "Professional summary or About section" 
                  },
                  experience: {
                    type: "array",
                    description: "Work experience entries",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        company: { type: "string", description: "Company name" },
                        position: { type: "string", description: "Job title" },
                        startDate: { type: "string", description: "Start date (YYYY-MM or Month Year)" },
                        endDate: { type: "string", description: "End date or 'Present'" },
                        current: { type: "boolean", description: "Is this current job" },
                        description: { type: "string", description: "Job description and responsibilities" },
                        achievements: { 
                          type: "array", 
                          items: { type: "string" },
                          description: "Key achievements and accomplishments"
                        }
                      },
                      required: ["id", "company", "position"]
                    }
                  },
                  education: {
                    type: "array",
                    description: "Education entries",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        institution: { type: "string", description: "School/University name" },
                        degree: { type: "string", description: "Degree type (Bachelor, Master, etc.)" },
                        field: { type: "string", description: "Field of study" },
                        startDate: { type: "string" },
                        endDate: { type: "string" },
                        gpa: { type: "string" },
                        achievements: { type: "array", items: { type: "string" } }
                      },
                      required: ["id", "institution", "degree", "field"]
                    }
                  },
                  skills: {
                    type: "array",
                    description: "Skills with proficiency levels",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        name: { type: "string", description: "Skill name" },
                        level: { 
                          type: "string", 
                          enum: ["beginner", "intermediate", "advanced", "expert"],
                          description: "Proficiency level"
                        }
                      },
                      required: ["id", "name", "level"]
                    }
                  },
                  languages: {
                    type: "array",
                    description: "Language proficiencies",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        name: { type: "string", description: "Language name" },
                        proficiency: { 
                          type: "string", 
                          enum: ["basic", "conversational", "professional", "native"],
                          description: "Proficiency level"
                        }
                      },
                      required: ["id", "name", "proficiency"]
                    }
                  },
                  certificates: {
                    type: "array",
                    description: "Certifications and credentials",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        name: { type: "string", description: "Certificate name" },
                        issuer: { type: "string", description: "Issuing organization" },
                        date: { type: "string", description: "Issue date" },
                        url: { type: "string", description: "Credential URL" }
                      },
                      required: ["id", "name", "issuer"]
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
      console.error("No tool call in response:", JSON.stringify(data));
      throw new Error("Failed to parse CV - AI did not return structured data");
    }

    const result = JSON.parse(toolCall.function.arguments);
    
    // Normalize and ensure all required fields have default values
    const normalizedResult = {
      personalInfo: {
        fullName: result.personalInfo?.fullName || '',
        email: result.personalInfo?.email || '',
        phone: result.personalInfo?.phone || '',
        location: result.personalInfo?.location || '',
        linkedin: result.personalInfo?.linkedin || '',
        website: result.personalInfo?.website || '',
        title: result.personalInfo?.title || ''
      },
      summary: result.summary || '',
      experience: (result.experience || []).map((exp: any, i: number) => ({
        id: exp.id || `exp_${i + 1}`,
        company: exp.company || '',
        position: exp.position || '',
        startDate: exp.startDate || '',
        endDate: exp.endDate || '',
        current: exp.current || exp.endDate?.toLowerCase()?.includes('present') || false,
        description: exp.description || '',
        achievements: exp.achievements || []
      })),
      education: (result.education || []).map((edu: any, i: number) => ({
        id: edu.id || `edu_${i + 1}`,
        institution: edu.institution || '',
        degree: edu.degree || '',
        field: edu.field || '',
        startDate: edu.startDate || '',
        endDate: edu.endDate || '',
        gpa: edu.gpa || '',
        achievements: edu.achievements || []
      })),
      skills: (result.skills || []).map((skill: any, i: number) => ({
        id: skill.id || `skill_${i + 1}`,
        name: skill.name || '',
        level: skill.level || 'intermediate'
      })),
      languages: (result.languages || []).map((lang: any, i: number) => ({
        id: lang.id || `lang_${i + 1}`,
        name: lang.name || '',
        proficiency: lang.proficiency || 'conversational'
      })),
      certificates: (result.certificates || []).map((cert: any, i: number) => ({
        id: cert.id || `cert_${i + 1}`,
        name: cert.name || '',
        issuer: cert.issuer || '',
        date: cert.date || '',
        url: cert.url || ''
      }))
    };

    console.log("Successfully parsed CV:", {
      name: normalizedResult.personalInfo.fullName,
      experiences: normalizedResult.experience.length,
      education: normalizedResult.education.length,
      skills: normalizedResult.skills.length,
      languages: normalizedResult.languages.length,
      certificates: normalizedResult.certificates.length
    });

    return new Response(JSON.stringify(normalizedResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("parse-cv-text error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error occurred while parsing CV" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
