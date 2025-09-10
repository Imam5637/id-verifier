
import { GoogleGenAI, Type } from "@google/genai";
import type { VerificationData } from '../types';
import { VerificationStatus } from '../types';

const verificationSchema = {
    type: Type.OBJECT,
    properties: {
        status: {
            type: Type.STRING,
            enum: [VerificationStatus.VERIFIED, VerificationStatus.REJECTED, VerificationStatus.UNSURE],
            description: "The final verification decision.",
        },
        reasoning: {
            type: Type.STRING,
            description: "A concise explanation for the decision.",
        },
        extractedData: {
            type: Type.OBJECT,
            properties: {
                fullName: { type: Type.STRING, description: "The full name of the person.", nullable: true },
                idNumber: { type: Type.STRING, description: "The ID number.", nullable: true },
                dateOfBirth: { type: Type.STRING, description: "The date of birth in YYYY-MM-DD format.", nullable: true },
                expiryDate: { type: Type.STRING, description: "The expiry date in YYYY-MM-DD format.", nullable: true },
            },
            required: ["fullName", "idNumber", "dateOfBirth", "expiryDate"]
        },
        confidenceScore: {
            type: Type.NUMBER,
            description: "A score from 0.0 to 1.0 indicating confidence in the verification status.",
        }
    },
    required: ["status", "reasoning", "extractedData", "confidenceScore"]
};

// Fix: Removed apiKey parameter to use environment variables directly as per guidelines.
export const verifyIdDocument = async (base64Image: string, mimeType: string): Promise<VerificationData> => {
  // Fix: Initializing GoogleGenAI with API key from environment variable as per guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    You are an advanced AI identity verification system. Your task is to analyze the provided image of an identification document and determine its authenticity.

    Based on the image, perform the following checks:
    1.  **Authenticity Markers:** Look for holograms, watermarks, microprinting, and other security features.
    2.  **Data Consistency:** Ensure that dates are logical.
    3.  **Image Integrity:** Check the primary photo for signs of tampering, such as unusual background or inconsistent lighting.
    4.  **Text & Font Analysis:** Verify that fonts are consistent with official documents and that text is aligned properly.
    5.  **Overall Layout:** Compare the layout to standard templates for the identified document type if possible.

    After your analysis, provide a response in a strict JSON format that conforms to the provided schema. Do not include any text, markdown, or backticks outside of the JSON object.
  `;

  const imagePart = {
    inlineData: {
      data: base64Image,
      mimeType,
    },
  };

  const textPart = {
    text: prompt,
  };

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: { parts: [imagePart, textPart] },
        config: {
            responseMimeType: "application/json",
            responseSchema: verificationSchema
        }
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString) as VerificationData;
    return result;

  } catch (error) {
    console.error("Gemini API call failed:", error);
    // Fix: Updated error message to be more generic and not expose API key details to the user.
    throw new Error("Failed to communicate with the AI verification service. Please try again later.");
  }
};
