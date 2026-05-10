import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function summarizeArticle(title: string, excerpt: string, content: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are an expert news analyst. 
      Summarize the following news article into 3 concise bullet points that capture the most important facts.
      
      Title: ${title}
      Excerpt: ${excerpt}
      Full Context: ${content}
      
      Format the output as a simple list.`,
    });
    return response.text ?? "Summary unavailable.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to generate AI summary. Please try again later.";
  }
}

export async function explainContext(title: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide a brief "Explain Like I'm Five" background context for this news topic: "${title}". 
      Explain why this matters or the history behind it in 2-3 sentences.`,
    });
    return response.text ?? "Context unavailable.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to fetch context.";
  }
}
