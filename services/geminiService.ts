import { GoogleGenAI, Chat } from "@google/genai";
import { Outfit } from '../types';

let ai: GoogleGenAI | null = null;
let chat: Chat | null = null;

export const getAI = () => {
  if (!ai) {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

const getChat = (outfits: Outfit[]) => {
  const aiInstance = getAI();
  if (!chat) {
    const outfitsContext = outfits.map(o => `- Name: ${o.name}\n  Description: ${o.description}`).join('\n');
    const systemInstruction = `You are a helpful fashion assistant. Your goal is to help the user choose an outfit from their virtual closet based on their mood, the weather, or any constraints they provide.
Below is a list of their available outfits. ONLY recommend outfits from this list.
When you recommend an outfit, state its name clearly in your response, enclosed in double asterisks, like **Outfit Name**. Do not recommend more than one outfit.

Available Outfits:
${outfitsContext || 'No outfits available.'}`;
    
    chat = aiInstance.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemInstruction,
      },
    });
  }
  return chat;
};

export const getOutfitRecommendation = async (prompt: string, outfits: Outfit[]) => {
  try {
    const chatInstance = getChat(outfits);
    const response = await chatInstance.sendMessage({ message: prompt });
    return response.text;
  } catch (error) {
    console.error("Error getting outfit recommendation:", error);
    chat = null; // Reset chat on error
    return "Sorry, I encountered an error while thinking of an outfit for you.";
  }
};
