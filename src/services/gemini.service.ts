import { GoogleGenAI } from '@google/genai';

import env from '../config/env';
import { ReviewDocument } from '../types/review.types';

const ai = new GoogleGenAI({ apiKey: env.GOOGLE_AI_API_KEY });

class GeminiService {
  async summarizeReviews(data: ReviewDocument[]): Promise<string> {
    const essentialData = data.map((review) => ({
      reviewText: review.comment,
    }));
    const parsedData = JSON.stringify(essentialData);

    const prompt = `Summarize the following product reviews, focusing on the overall sentiment, key pros, and cons. Present the information in a clear, concise, and easy-to-understand paragraph format, as if you're explaining it to a customer. Avoid using technical terms or structured data formats like JSON.\n ${parsedData}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.candidates?.[0]?.content?.parts?.[0]?.text as string;
  }
}

export default new GeminiService();
