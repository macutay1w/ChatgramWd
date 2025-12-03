import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message } from "../types";

// Initialize Gemini
// Note: In a production app, never expose API keys on the client.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const sendMessageToGemini = async (
  history: Message[],
  newMessage: string,
  file?: { data: string; type: string }
): Promise<string> => {
  try {
    const model = ai.models;
    
    // If there is an image, we use a vision-capable model
    // Using gemini-2.5-flash for speed and versatility
    const modelName = 'gemini-2.5-flash';

    let contentParts: any[] = [];

    // Add file if exists (checking for images)
    if (file && file.type.startsWith('image/')) {
       // Remove data URL prefix if present for the API call
       const base64Data = file.data.split(',')[1];
       contentParts.push({
         inlineData: {
           mimeType: file.type,
           data: base64Data
         }
       });
    }

    contentParts.push({
      text: newMessage
    });

    const response: GenerateContentResponse = await model.generateContent({
      model: modelName,
      contents: {
        role: 'user',
        parts: contentParts
      },
      config: {
        systemInstruction: "You are a helpful, witty, and friendly participant in a chat room. Keep your responses concise and conversational, similar to how people chat on Telegram. If sent an image, describe it or comment on it naturally.",
      }
    });

    return response.text || "I saw that, but I'm not sure what to say.";

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I'm having trouble connecting to the network right now.";
  }
};