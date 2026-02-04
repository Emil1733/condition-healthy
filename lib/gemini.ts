
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);

export const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });

/**
 * Generates text content using Gemini Flash
 * @param prompt The prompt to send to the AI
 * @returns The generated text response
 */
export async function generateContent(prompt: string) {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    // Return null or a generic string so the UI can handle it gracefully
    return ""; 
  }
}
