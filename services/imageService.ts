import { getAI } from './geminiService';
import { Modality, GenerateContentResponse } from '@google/genai';

const base64FromFile = (file: File): Promise<string> => 
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });

export const removeImageBackground = async (imageFile: File): Promise<string> => {
    try {
        const ai = getAI();
        const base64Data = await base64FromFile(imageFile);
        
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64Data,
                            mimeType: imageFile.type,
                        },
                    },
                    {
                        text: 'Isolate the main clothing item from this image, remove the original background, and place it on a solid white background with the hex color #FFFFFF. The output should be a standard image format like JPEG or PNG. Only return the image, no text.',
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.mimeType.includes('image')) {
                const mimeType = part.inlineData.mimeType;
                const base64ImageBytes = part.inlineData.data;
                return `data:${mimeType};base64,${base64ImageBytes}`;
            }
        }
        
        // If no image is returned by the AI, throw an error to fall back to the original image.
        throw new Error("The AI did not return an image.");

    } catch (error) {
        console.error("Error removing image background:", error);
        // Fallback: return the original image as a data URL if the API fails.
        return new Promise((resolve, reject) => {
             const reader = new FileReader();
             reader.readAsDataURL(imageFile);
             reader.onload = () => resolve(reader.result as string);
             reader.onerror = err => reject(err);
        });
    }
};