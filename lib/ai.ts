import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateFlashcards(content: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Extract 10-20 high-quality flashcards from the following content. 
    Return ONLY a JSON array of objects with "front" and "back" properties.
    Ensure "front" is a concise question or term, and "back" is a clear, informative answer.

    Content:
    ${content}
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  // Basic cleanup of potential markdown code blocks
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  
  throw new Error("Failed to parse Gemini response");
}
