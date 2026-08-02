
import { GoogleGenAI, Type } from "@google/genai";
import type { PatientData, PredictionResult } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const predictionSchema = {
    type: Type.OBJECT,
    properties: {
        prediction: { 
            type: Type.STRING,
            enum: ['No Disease', 'Low Risk', 'Moderate Risk', 'High Risk'],
            description: "The predicted risk category for liver disease."
        },
        explanation: { 
            type: Type.STRING,
            description: "A detailed but easy-to-understand explanation for the prediction, referencing the provided data points. This should be written for a non-medical person."
        },
        riskFactors: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of specific input values that are contributing most to the risk prediction."
        },
        recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of general, non-prescriptive wellness suggestions. Crucially, this must include a recommendation to consult a healthcare professional and must NOT be medical advice."
        }
    },
    required: ['prediction', 'explanation', 'riskFactors', 'recommendations']
};


export const predictLiverDisease = async (data: PatientData): Promise<PredictionResult> => {
    const prompt = `
        Analyze the following patient data to predict the likelihood of liver disease.
        The context is for a patient in a rural Indian setting, where factors like malnutrition and access to care can be relevant.

        Patient Data:
        - Age: ${data.Age}
        - Gender: ${data.Gender}
        - Total Bilirubin: ${data.Total_Bilirubin} mg/dL
        - Direct Bilirubin: ${data.Direct_Bilirubin} mg/dL
        - Alkaline Phosphatase: ${data.Alkaline_Phosphotase} IU/L
        - Alamine Aminotransferase (ALT): ${data.Alamine_Aminotransferase} IU/L
        - Aspartate Aminotransferase (AST): ${data.Aspartate_Aminotransferase} IU/L
        - Total Proteins: ${data.Total_Protiens} g/dL
        - Albumin: ${data.Albumin} g/dL
        - Albumin/Globulin Ratio: ${data.Albumin_and_Globulin_Ratio}

        Based on this data, provide a structured JSON response with your analysis.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: "You are an expert medical AI specializing in hepatology and public health in rural India. Your task is to analyze patient data and predict the likelihood of liver disease. You must return your analysis in a valid JSON format according to the provided schema. Do not provide direct medical advice; instead, offer general wellness suggestions and strongly recommend consulting a qualified doctor for a proper diagnosis and treatment plan. Your language should be clear and accessible to a layperson.",
                responseMimeType: "application/json",
                responseSchema: predictionSchema,
                temperature: 0.3,
            },
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText) as PredictionResult;
        return result;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error && error.message.includes('429')) {
             throw new Error("The service is currently busy. Please try again in a few moments.");
        }
        throw new Error("Failed to get a prediction from the AI model. The model may have returned an invalid format or an error occurred.");
    }
};
