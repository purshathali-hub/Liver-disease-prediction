import { GoogleGenAI, Type } from "@google/genai";
import type { PatientData, PredictionResult } from "../types";

const API_KEY = import.meta.env.VITE_API_KEY;

if (!API_KEY) {
    throw new Error(
        "VITE_API_KEY environment variable not set. Please check your .env file."
    );
}

const ai = new GoogleGenAI({
    apiKey: API_KEY,
});

const MODEL_NAME = "gemini-3.5-flash-lite";

const MAX_RETRIES = 3;

const RETRY_DELAYS = [2000, 4000, 8000];

const predictionSchema = {
    type: Type.OBJECT,
    properties: {
        prediction: {
            type: Type.STRING,
            enum: [
                "No Disease",
                "Low Risk",
                "Moderate Risk",
                "High Risk",
            ],
            description:
                "The predicted liver disease risk category based on the provided input data.",
        },
        explanation: {
            type: Type.STRING,
            description:
                "A clear and easy-to-understand explanation of the prediction, referring to relevant patient data.",
        },
        riskFactors: {
            type: Type.ARRAY,
            items: {
                type: Type.STRING,
            },
            description:
                "The patient input values that contribute most to the estimated risk.",
        },
        recommendations: {
            type: Type.ARRAY,
            items: {
                type: Type.STRING,
            },
            description:
                "General non-prescriptive wellness suggestions. Must recommend consulting a qualified healthcare professional.",
        },
    },
    required: [
        "prediction",
        "explanation",
        "riskFactors",
        "recommendations",
    ],
};

const wait = (milliseconds: number): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
};

const getErrorStatus = (error: unknown): number | null => {
    if (!(error instanceof Error)) {
        return null;
    }

    const message = error.message;

    const jsonStatusMatch = message.match(
        /"code"\s*:\s*(\d{3})/
    );

    if (jsonStatusMatch) {
        return Number(jsonStatusMatch[1]);
    }

    const directStatusMatch = message.match(
        /\b(400|401|403|404|429|500|502|503|504)\b/
    );

    if (directStatusMatch) {
        return Number(directStatusMatch[1]);
    }

    return null;
};

const generatePredictionWithRetry = async (
    prompt: string
): Promise<string> => {
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
            console.log(
                `Gemini request attempt ${attempt + 1}/${MAX_RETRIES + 1}`
            );

            const response = await ai.models.generateContent({
                model: MODEL_NAME,
                contents: prompt,
                config: {
                    systemInstruction:
                        "You are an AI assistant for an educational liver disease risk-prediction application. " +
                        "Analyze the provided patient information and estimate a risk category for educational purposes. " +
                        "Do not claim that the result is a confirmed medical diagnosis. " +
                        "Do not prescribe medicines or treatments. " +
                        "Provide clear explanations suitable for a non-medical user. " +
                        "Always recommend consultation with a qualified healthcare professional for proper diagnosis and treatment.",
                    responseMimeType: "application/json",
                    responseSchema: predictionSchema,
                    thinkingConfig: {
                        thinkingLevel: "minimal",
                    },
                },
            });

            const jsonText = response.text?.trim();

            if (!jsonText) {
                throw new Error("Gemini returned an empty response.");
            }

            console.log("Gemini response received successfully.");

            return jsonText;
        } catch (error) {
            console.error(
                `Gemini API attempt ${attempt + 1} failed:`,
                error
            );

            const status = getErrorStatus(error);

            const shouldRetry =
                status === 429 ||
                status === 500 ||
                status === 502 ||
                status === 503 ||
                status === 504;

            if (shouldRetry && attempt < MAX_RETRIES) {
                const delay = RETRY_DELAYS[attempt];

                console.log(
                    `AI service busy. Retrying in ${
                        delay / 1000
                    } seconds...`
                );

                await wait(delay);
                continue;
            }

            if (status === 503) {
                throw new Error(
                    "AI service is temporarily unavailable. Please wait a few moments and try again."
                );
            }

            if (status === 429) {
                throw new Error(
                    "AI service rate limit reached. Please wait a few moments and try again."
                );
            }

            if (
                status === 500 ||
                status === 502 ||
                status === 504
            ) {
                throw new Error(
                    "The AI service temporarily encountered a server error. Please try again."
                );
            }

            if (status === 401 || status === 403) {
                throw new Error(
                    "Gemini API authentication failed. Please check your API key and Google AI Studio project settings."
                );
            }

            if (status === 404) {
                throw new Error(
                    `The Gemini model "${MODEL_NAME}" is unavailable for this API key or project.`
                );
            }

            if (status === 400) {
                throw new Error(
                    "The Gemini request was invalid. Please check the request configuration."
                );
            }

            if (error instanceof Error) {
                throw new Error(
                    `Gemini API Error: ${error.message}`
                );
            }

            throw new Error(
                "Unknown error occurred while calling Gemini API."
            );
        }
    }

    throw new Error(
        "The AI service could not complete the request. Please try again."
    );
};

export const predictLiverDisease = async (
    data: PatientData
): Promise<PredictionResult> => {
    const prompt = `
Analyze the following patient data and estimate the likelihood
of liver disease for educational risk assessment.

Important:
- This is NOT a confirmed medical diagnosis.
- Do not prescribe medication.
- Do not provide treatment instructions.
- Explain the result in simple language.
- Consider the provided laboratory values.
- Mention important values contributing to the estimated risk.
- Recommend consultation with a qualified healthcare professional.

Patient Data:

Age:
${data.Age}

Gender:
${data.Gender}

Total Bilirubin:
${data.Total_Bilirubin} mg/dL

Direct Bilirubin:
${data.Direct_Bilirubin} mg/dL

Alkaline Phosphatase:
${data.Alkaline_Phosphotase} IU/L

Alamine Aminotransferase (ALT):
${data.Alamine_Aminotransferase} IU/L

Aspartate Aminotransferase (AST):
${data.Aspartate_Aminotransferase} IU/L

Total Proteins:
${data.Total_Protiens} g/dL

Albumin:
${data.Albumin} g/dL

Albumin/Globulin Ratio:
${data.Albumin_and_Globulin_Ratio}

Return the result strictly according to the provided JSON schema.
`;

    try {
        const jsonText =
            await generatePredictionWithRetry(prompt);

        console.log(
            "Gemini final JSON response:",
            jsonText
        );

        const result =
            JSON.parse(jsonText) as PredictionResult;

        return result;
    } catch (error) {
        console.error(
            "========== GEMINI API ERROR =========="
        );

        console.error(error);

        console.error(
            "======================================"
        );

        if (error instanceof Error) {
            throw error;
        }

        throw new Error(
            "Unable to get a response from the AI service. Please try again."
        );
    }
};