
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import path from 'path';

// Force load env before ANYTHING else
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const apiKey = process.env.GOOGLE_API_KEY!;

const genAI = new GoogleGenerativeAI(apiKey);

// Use gemini-2.0-flash as it's what the user verified
export const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function generateContent(prompt: string) {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("❌ Gemini API Error:", error.message || error);
    return ""; 
  }
}
