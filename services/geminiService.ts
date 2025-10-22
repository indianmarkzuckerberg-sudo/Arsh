
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, Meal, MealSuggestion } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const mealSchema = {
  type: Type.OBJECT,
  properties: {
    totalCalories: {
      type: Type.INTEGER,
      description: "The estimated total calorie count for the entire meal."
    },
    items: {
      type: Type.ARRAY,
      description: "A list of food items identified in the meal.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.STRING,
            description: "The name of the food item."
          },
          calories: {
            type: Type.INTEGER,
            description: "The estimated calorie count for this specific food item."
          },
        },
        required: ["name", "calories"]
      }
    }
  },
  required: ["totalCalories", "items"]
};

export const analyzeMealFromText = async (description: string): Promise<Meal> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze this meal description: '${description}'. Provide a reasonable estimate of its total calories and a breakdown of the items.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: mealSchema,
      }
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error analyzing meal from text:", error);
    throw new Error("Failed to analyze meal description. Please try again.");
  }
};

export const analyzeMealFromImage = async (imageFile: File): Promise<Meal> => {
  try {
    const imagePart = await fileToGenerativePart(imageFile);
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { 
        parts: [
            { text: "Analyze the food items in this image. For each item, provide a reasonable estimate of its name and calorie count." },
            imagePart
        ] 
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: mealSchema,
      }
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error analyzing meal from image:", error);
    throw new Error("Failed to analyze meal image. Please try again.");
  }
};

export const getMealSuggestions = async (profile: UserProfile, targetCalories: number): Promise<MealSuggestion[]> => {
  const prompt = `I am a ${profile.age}-year-old ${profile.gender}, my weight is ${profile.weight} kg, and my height is ${profile.height} cm. My fitness goal is to ${profile.goal} weight. My activity level is ${profile.activityLevel}. My target daily calorie intake is ${targetCalories} calories. Suggest a one-day meal plan (breakfast, lunch, dinner) that aligns with my goals and calorie target. For each meal, provide the meal name and estimated calories.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  mealType: { type: Type.STRING },
                  name: { type: Type.STRING },
                  calories: { type: Type.INTEGER }
                },
                required: ["mealType", "name", "calories"]
              }
            }
          },
          required: ["suggestions"]
        }
      }
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    return result.suggestions;
  } catch (error) {
    console.error("Error getting meal suggestions:", error);
    throw new Error("Failed to get meal suggestions. Please try again.");
  }
};
