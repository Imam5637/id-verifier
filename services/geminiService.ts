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
        documentType: {
            type: Type.STRING,
            description: "The identified type of the document (e.g., Passport, Driver's License, National ID)."
        },
        extractedData: {
            type: Type.OBJECT,
            properties: {
                fullName: { type: Type.STRING, description: "The full name of the person." },
                idNumber: { type: Type.STRING, description: "The ID number." },
                dateOfBirth: { type: Type.STRING, description: "The date of birth in YYYY-MM-DD format." },
                expiryDate: { type: Type.STRING, description: "The expiry date in YYYY-MM-DD format." },
                rawText: { type: Type.STRING, description: "All text extracted from the document using OCR." },
            },
        },
        confidenceScore: {
            type: Type.NUMBER,
            description: "A score from 0.0 to 1.0 indicating confidence in the verification status.",
        }
    },
    required: ["status", "reasoning", "documentType", "extractedData", "confidenceScore"]
};

export const verifyIdDocument = async (base64Image: string, mimeType: string): Promise<VerificationData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    You are an advanced AI identity verification system with powerful Optical Character Recognition (OCR) capabilities. Your task is to analyze the provided image of an identification document, extract all text, and determine its authenticity.

    Perform the following steps:
    1.  **Document Identification:** First, identify the type of document (e.g., Passport, Driver's License, National ID Card). Populate the 'documentType' field with your finding.
    2.  **OCR Extraction:** Perform a thorough OCR scan to extract all visible text from the document. Store this in the 'rawText' field.
    3.  **Data Parsing:** From the extracted text, parse the key information: full name, ID number, date of birth, and expiry date.
    4.  **Authenticity Analysis:** Based on the image, extracted text, and the identified document type, perform these checks:
        - **Authenticity Markers:** Look for features specific to the document type, such as holograms, watermarks, microprinting, and other security features.
        - **Data Consistency:** Ensure that dates are logical (e.g., date of birth is before expiry date).
        - **Image Integrity:** Check the primary photo for signs of tampering, such as unusual background or inconsistent lighting.
        - **Text & Font Analysis:** Verify that fonts are consistent with official documents of this type and that text is aligned properly. Check for inconsistencies between the extracted text and the visual presentation.
        - **Overall Layout:** Compare the layout to standard templates for the identified document type.

    After your analysis, provide a response in a strict JSON format that conforms to the provided schema. Do not include any text, markdown, or backticks outside of the JSON object. If any piece of data cannot be found (e.g. 'fullName', 'documentType'), its value should be null. The 'rawText' should contain all text found, or be null if no text is legible.
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
    throw new Error("error.api_communication_failure");
  }
};