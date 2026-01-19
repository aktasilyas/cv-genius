import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple PDF text extraction for Deno environment
function extractTextFromPDFBuffer(buffer: Uint8Array): string {
  const decoder = new TextDecoder('latin1');
  const pdfContent = decoder.decode(buffer);
  
  const textChunks: string[] = [];
  
  // Extract text between stream and endstream markers
  const streamRegex = /stream[\r\n]+([\s\S]*?)[\r\n]+endstream/g;
  let match;
  
  while ((match = streamRegex.exec(pdfContent)) !== null) {
    const streamContent = match[1];
    
    // Try to extract text from BT/ET blocks (text objects)
    const textBlockRegex = /BT[\s\S]*?ET/g;
    let textMatch;
    
    while ((textMatch = textBlockRegex.exec(streamContent)) !== null) {
      const textBlock = textMatch[0];
      
      // Extract text from Tj, TJ, and ' operators
      const textOperatorRegex = /\(([^)]*)\)\s*(?:Tj|')/g;
      let opMatch;
      while ((opMatch = textOperatorRegex.exec(textBlock)) !== null) {
        textChunks.push(opMatch[1]);
      }
      
      // Extract text from TJ arrays
      const tjArrayRegex = /\[(.*?)\]\s*TJ/g;
      let tjMatch;
      while ((tjMatch = tjArrayRegex.exec(textBlock)) !== null) {
        const arrayContent = tjMatch[1];
        const stringRegex = /\(([^)]*)\)/g;
        let strMatch;
        while ((strMatch = stringRegex.exec(arrayContent)) !== null) {
          textChunks.push(strMatch[1]);
        }
      }
    }
  }
  
  // Also try to find plain text patterns
  const plainTextRegex = /\/T[dD]\s*\(([^)]+)\)/g;
  while ((match = plainTextRegex.exec(pdfContent)) !== null) {
    textChunks.push(match[1]);
  }
  
  // Decode PDF escape sequences
  let text = textChunks.join(' ')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\\\/g, '\\')
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/\\([0-7]{3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)));
  
  // Clean up and normalize whitespace
  text = text
    .replace(/[^\x20-\x7E\n\r\tğüşıöçĞÜŞİÖÇäöüÄÖÜßéèêëàâäùûüôôçñáíóúÁÉÍÓÚ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  return text;
}

// Alternative extraction using simpler patterns for LinkedIn PDFs
function extractLinkedInPDFText(buffer: Uint8Array): string {
  const decoder = new TextDecoder('utf-8', { fatal: false });
  let content = decoder.decode(buffer);
  
  // LinkedIn PDFs often have text in readable format between specific markers
  const textParts: string[] = [];
  
  // Look for text in parentheses (common PDF text format)
  const parenRegex = /\(([A-Za-z0-9\s\-\.\,\@\+\(\)\/\:\;\!\?\#\$\%\&\*\_\=\'\"àáâãäåæçèéêëìíîïñòóôõöøùúûüýÿğüşıöçĞÜŞİÖÇ]+)\)/g;
  let match;
  while ((match = parenRegex.exec(content)) !== null) {
    const text = match[1].trim();
    if (text.length > 2 && !/^[0-9.]+$/.test(text)) {
      textParts.push(text);
    }
  }
  
  // Also look for Unicode text streams
  const unicodeRegex = /<([0-9A-Fa-f]{4,})>/g;
  while ((match = unicodeRegex.exec(content)) !== null) {
    try {
      const hex = match[1];
      let decoded = '';
      for (let i = 0; i < hex.length; i += 4) {
        const code = parseInt(hex.substr(i, 4), 16);
        if (code > 31 && code < 127) {
          decoded += String.fromCharCode(code);
        } else if (code >= 127) {
          decoded += String.fromCharCode(code);
        }
      }
      if (decoded.trim().length > 1) {
        textParts.push(decoded.trim());
      }
    } catch {
      // Ignore decoding errors
    }
  }
  
  return textParts.join(' ').replace(/\s+/g, ' ').trim();
}

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

    let cvText = text || '';
    
    // If PDF base64 is provided, extract text from it
    if (pdfBase64 && !cvText) {
      console.log("Extracting text from PDF base64...");
      
      try {
        // Decode base64 to buffer
        const binaryString = atob(pdfBase64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        // Try multiple extraction methods
        let extractedText = extractTextFromPDFBuffer(bytes);
        
        // If first method yields poor results, try LinkedIn-specific extraction
        if (extractedText.length < 100) {
          console.log("Primary extraction yielded poor results, trying LinkedIn-specific method...");
          extractedText = extractLinkedInPDFText(bytes);
        }
        
        // If still poor, fall back to raw text scan
        if (extractedText.length < 100) {
          console.log("Trying raw text scan...");
          const decoder = new TextDecoder('latin1');
          const rawText = decoder.decode(bytes);
          
          // Extract any readable text patterns
          const readableRegex = /[A-Za-z][A-Za-z0-9\s\-\.\,\@\+\/\:\;\!\?\#\$\%\&\*\_\=\'\"]{10,}/g;
          const readableChunks = rawText.match(readableRegex) || [];
          extractedText = readableChunks.join(' ').substring(0, 50000);
        }
        
        cvText = extractedText;
        console.log(`Extracted ${cvText.length} characters from PDF`);
        
      } catch (pdfError) {
        console.error("PDF extraction error:", pdfError);
        throw new Error("Could not extract text from PDF. Please try copying and pasting your CV text instead.");
      }
    }

    if (!cvText || cvText.length < 50) {
      throw new Error("No valid text content found. Please paste your CV text directly or try a different PDF.");
    }

    const languageInstructions = {
      en: "Parse the text and respond in English.",
      tr: "Metni ayrıştır ve Türkçe yanıt ver.",
      de: "Analysiere den Text und antworte auf Deutsch.",
      fr: "Analyse le texte et réponds en français.",
      es: "Analiza el texto y responde en español."
    };

    const systemPrompt = `You are an expert CV/Resume parser. Extract structured information from the provided CV content.

${languageInstructions[language as keyof typeof languageInstructions] || languageInstructions.en}

IMPORTANT PARSING GUIDELINES:
1. The text may be extracted from a PDF and could have formatting issues - interpret it intelligently
2. LinkedIn PDF exports have a specific format - name is usually at the top, followed by headline/title
3. Look for patterns like email addresses (containing @), phone numbers, URLs
4. Work experience entries typically contain company names, job titles, and dates
5. Education entries contain institution names, degrees, and dates
6. Extract skills as individual items, estimating proficiency based on context
7. If something is ambiguous, make your best educated guess rather than leaving it empty

Parse and extract:
1. Personal Information (name, email, phone, location, LinkedIn URL, website, professional title/headline)
2. Professional Summary (often appears as "About" or "Summary" section)
3. Work Experience (company, position, dates, description, key achievements)
4. Education (institution, degree, field of study, dates, GPA if mentioned, achievements)
5. Skills (name and estimated proficiency level: beginner, intermediate, advanced, expert)
6. Languages (name and proficiency: basic, conversational, professional, native)
7. Certificates/Certifications (name, issuer, date, credential URL if available)

Generate unique IDs (like "exp_1", "edu_1", "skill_1") for array items.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Parse this CV/Resume text into structured data. The text may have been extracted from a PDF so please interpret it intelligently:\n\n${cvText.substring(0, 30000)}` }
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
                      fullName: { type: "string", description: "Full name of the person" },
                      email: { type: "string", description: "Email address" },
                      phone: { type: "string", description: "Phone number" },
                      location: { type: "string", description: "City, Country or full address" },
                      linkedin: { type: "string", description: "LinkedIn profile URL" },
                      website: { type: "string", description: "Personal website or portfolio URL" },
                      title: { type: "string", description: "Professional title or headline" }
                    },
                    required: ["fullName", "title"]
                  },
                  summary: { type: "string", description: "Professional summary or about section" },
                  experience: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        company: { type: "string" },
                        position: { type: "string" },
                        startDate: { type: "string", description: "Format: YYYY-MM or Month Year" },
                        endDate: { type: "string", description: "Format: YYYY-MM, Month Year, or 'Present'" },
                        current: { type: "boolean" },
                        description: { type: "string" },
                        achievements: { type: "array", items: { type: "string" } }
                      },
                      required: ["id", "company", "position", "startDate"]
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
                      required: ["id", "institution", "degree", "field"]
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
      throw new Error("Failed to parse CV - no structured response from AI");
    }

    const result = JSON.parse(toolCall.function.arguments);
    
    // Ensure all required fields have default values
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
        current: exp.current || false,
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

    console.log("Successfully parsed CV with:", {
      experiences: normalizedResult.experience.length,
      education: normalizedResult.education.length,
      skills: normalizedResult.skills.length
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
