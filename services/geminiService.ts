import { GoogleGenAI, Type, Schema } from "@google/genai";
import { NewsAnalysis } from "../types";

const timelineSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    headline: {
      type: Type.STRING,
      description: "The main headline of the news article in Simplified Chinese.",
    },
    summary: {
      type: Type.STRING,
      description: "A brief executive summary of the news story (max 2 sentences) in Simplified Chinese.",
    },
    events: {
      type: Type.ARRAY,
      description: "A chronological list of events extracted from the article.",
      items: {
        type: Type.OBJECT,
        properties: {
          date: {
            type: Type.STRING,
            description: "The date of the event (YYYY-MM-DD or relative like 'Monday'). Try to normalize to YYYY-MM-DD if possible.",
          },
          time: {
            type: Type.STRING,
            description: "The time of the event if specified (e.g., '14:30' or 'Afternoon'). Optional.",
          },
          title: {
            type: Type.STRING,
            description: "A short, punchy title for the specific event in Simplified Chinese.",
          },
          description: {
            type: Type.STRING,
            description: "A detailed description of what happened in Simplified Chinese.",
          },
          sentimentScore: {
            type: Type.NUMBER,
            description: "A sentiment score for this specific event ranging from -10 (very negative/tragic) to 10 (very positive/celebratory).",
          },
          tags: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Relevant tags for this event in Simplified Chinese (e.g., '政治', '突发', '声明').",
          },
        },
        required: ["date", "title", "description", "sentimentScore", "tags"],
      },
    },
  },
  required: ["headline", "summary", "events"],
};

export const generateTimelineFromUrl = async (url: string): Promise<NewsAnalysis> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please set it in the environment.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Analyze the following news article URL: ${url}
    
    1.  Use Google Search to find the content of this article if you cannot access it directly. 
    2.  If the specific URL is inaccessible (e.g., 404 or paywall), search for the news story based on keywords found in the URL.
    3.  Extract a detailed chronological timeline of events described in the story.
    4.  Assign a sentiment score to each event.
    5.  **CRITICAL**: Return the data strictly in JSON format matching the schema.
    6.  **CRITICAL**: All text content (headline, summary, event titles, descriptions, tags) MUST be in Simplified Chinese (简体中文).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: timelineSchema,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response generated from Gemini.");
    }

    const data = JSON.parse(text) as NewsAnalysis;
    return data;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to analyze the article. Please check the URL or try again later.");
  }
};

export const generateNewsImage = async (headline: string, summary: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please set it in the environment.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Create a high-quality, editorial-style digital illustration for a news article with the headline: "${headline}". Summary: "${summary}". The style should be professional, compelling, and suitable for a top-tier news magazine. Do not include any text in the image.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data found in response.");
  } catch (error) {
    console.error("Gemini Image Gen Error:", error);
    throw new Error("Failed to generate image.");
  }
};