
import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { TestResult, UserProfile, Vitals, FoodData, AIReport } from '../types';

// API Key configured directly
const ai = new GoogleGenAI({ apiKey: 'AIzaSyA2TN2B7PJGG-0NeYOVfIqzHJRDVU3RjwM' });
const model = 'gemini-2.5-flash';

export const getFoodAnalysis = async (base64Data: string, healthContext: string): Promise<FoodData> => {
  const prompt = `Analyze this food item for a user in Ghana with the following health profile: "${healthContext}". Based on the image and their health, provide a JSON object with: 1. 'name' (string: identified food name), 2. 'nutrients' (array of objects with 'name' and 'value' strings, e.g., [{ "name": "Sodium", "value": "150 mg" }]. Include Phosphorus, Sugar, Protein, and other relevant micronutrients like Calcium or vitamins if identifiable), 3. 'impactScore' (string: 'Low Impact', 'Moderate Impact', or 'High Impact' *specifically for kidney health*), 4. 'consumptionImpact' (string: a brief, simple explanation of why high intake of this food might be a concern for kidney health, focusing on key nutrients. Example: 'Limit consumption. High intake may increase blood pressure due to its sodium content.'), 5. 'alternatives' (array of 3 strings: healthier Ghanaian food alternatives). Do not use markdown.`;

  const imagePart = { inlineData: { mimeType: "image/jpeg", data: base64Data } };
  const textPart = { text: prompt };

  const response = await ai.models.generateContent({
    model: model,
    contents: { parts: [textPart, imagePart] },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          nutrients: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                value: { type: Type.STRING },
              },
              required: ['name', 'value']
            }
          },
          impactScore: { type: Type.STRING },
          consumptionImpact: { type: Type.STRING },
          alternatives: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['name', 'nutrients', 'impactScore', 'consumptionImpact', 'alternatives']
      }
    }
  });

  return JSON.parse(response.text);
};

export const getTestStripInsights = async (result: TestResult): Promise<string> => {
  const biomarkersText = Object.entries(result.biomarkers).map(([key, value]) => `${key}: ${value}`).join(', ');
  const systemInstruction = "You are a health assistant for the Renal Care app, speaking to a user in Ghana. Your tone should be simple, encouraging, and clear. Do not use complex medical jargon. Your goal is to explain results and suggest next steps without causing alarm or providing a medical diagnosis.";
  const userQuery = `My kidney health test shows a result of "${result.status}". The specific biomarker readings are: ${biomarkersText}. Based on these results, explain in a simple paragraph what this might mean for me. Then, suggest 3 concrete, actionable next steps I can take, focusing on diet and lifestyle relevant to Ghana. End by strongly recommending I consult a healthcare professional.`;

  const response = await ai.models.generateContent({
    model,
    contents: userQuery,
    config: {
      systemInstruction,
    }
  });

  return response.text;
};

export const getMealPlan = async (preferences: string) => {
  const userQuery = `Generate a one-day sample meal plan that is low in sodium, potassium, and phosphorus, suitable for someone managing kidney health. The user has the following preferences: "${preferences || 'no specific preferences'}". The meal plan should consist of breakfast, lunch, and dinner, and should use ingredients commonly found in Ghanaian markets.`;

  const response = await ai.models.generateContent({
    model,
    contents: userQuery,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          breakfast: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, description: { type: Type.STRING } } },
          lunch: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, description: { type: Type.STRING } } },
          dinner: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, description: { type: Type.STRING } } },
        },
      },
    }
  });
  return JSON.parse(response.text);
};


export const generateHealthReport = async (latestTest: TestResult, latestVitals: Vitals, userProfile: UserProfile | null): Promise<AIReport> => {
    let prompt = `Analyze the following health data for a user in Ghana and provide a concise health report. User Profile: ${userProfile ? `Age ${userProfile.age}, Gender ${userProfile.gender}, Conditions: ${userProfile.conditions.join(', ') || 'None'}` : 'Guest User'}. `;
    prompt += `Latest Test Result (${new Date(latestTest.timestamp).toLocaleDateString()}): Status - ${latestTest.status}, Biomarkers - ${JSON.stringify(latestTest.biomarkers)}. `;
    prompt += `Latest Vitals (${new Date(latestVitals.timestamp).toLocaleDateString()}): BP - ${latestVitals.systolic}/${latestVitals.diastolic} mmHg, Glucose - ${latestVitals.glucose} mg/dL, BMI - ${latestVitals.bmi}. `;
    prompt += `Generate a JSON response with keys "summary" (string, overall status), "observations" (array of strings, 2-3 key points), and "recommendations" (array of strings, 2-3 actionable, simple tips relevant to Ghana). Keep explanations brief and easy to understand. Do not give medical advice, focus on lifestyle suggestions. Emphasize consulting a doctor if any concerns arise.`;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    summary: { type: Type.STRING },
                    observations: { type: Type.ARRAY, items: { type: Type.STRING } },
                    recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
                }
            }
        }
    });
    return JSON.parse(response.text);
};

export const getVitalsAnalysis = async (latestVitals: Vitals, userProfile: UserProfile | null): Promise<string> => {
    let prompt = `Analyze the following health vitals for a user in Ghana. User Profile: ${userProfile ? `Age ${userProfile.age}, Gender ${userProfile.gender}, Conditions: ${userProfile.conditions.join(', ') || 'None'}` : 'Guest User'}. `;
    prompt += `Latest Vitals: BP - ${latestVitals.systolic}/${latestVitals.diastolic} mmHg, Glucose - ${latestVitals.glucose} mg/dL, BMI - ${latestVitals.bmi}. `;
    prompt += `Provide a simple, one-paragraph analysis of these vitals. Explain what they might indicate for kidney health in an easy-to-understand way. Do not provide a medical diagnosis. Focus on encouragement and general lifestyle advice relevant to their situation. End by recommending a consultation with a doctor if there are any concerns.`;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
    });

    return response.text;
};


export const createChat = (): Chat => {
    const systemInstruction = "You are 'Renal Care AI,' a friendly and supportive health assistant. Your purpose is to provide general health information and answer questions about kidney health, diet, and lifestyle relevant to Ghana. You are not a doctor and cannot provide medical advice, diagnose conditions, or interpret test results. If asked for medical advice, you must gently decline and recommend the user 'Consult a Doctor' using the app's feature. Respond in the language of the user's query (e.g., Twi or English).";

    return ai.chats.create({
        model,
        config: {
            systemInstruction,
        },
        history: [
            { role: "user", parts: [{ text: "Hello." }] },
            { role: "model", parts: [{ text: "Hello! I'm Renal Care AI, your health assistant. How can I help you with your kidney health questions today?" }] }
        ]
    });
};
