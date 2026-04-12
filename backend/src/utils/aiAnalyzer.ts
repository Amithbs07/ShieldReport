import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface AIAnalysisResult {
  urgencyScore: number;
  summary: string;
  tags: string;
}

/**
 * Analyzes the incident description to parse critical signals before encryption.
 * This ensures admins can prioritize without exposing the raw report.
 */
export const analyzeReport = async (
  description: string, 
  category: string, 
  severity: string
): Promise<AIAnalysisResult | null> => {
  if (!process.env.OPENAI_API_KEY) {
    console.log('OpenAI API Key not configured. Skipping AI Analysis.');
    return null;
  }

  try {
    const prompt = `
      You are an expert HR and whistleblower incident classification system.
      Analyze the following incident report.
      
      Category: ${category}
      User-rated Severity: ${severity}
      Description:
      "${description}"
      
      Return a STRICT JSON response exactly matching this format, with no extra text:
      {
        "urgencyScore": (number from 0 to 100, where 100 is life-threatening or massive legal liability),
        "summary": (a highly concise 2-sentence objective summary of the incident),
        "tags": (a comma-separated string of 3-5 relevant keywords like 'fraud', 'harassment')
      }
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'system', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.1,
    });

    const choice = response.choices[0];
    if (!choice || !choice.message.content) return null;
    const content = choice.message.content;

    const parsed = JSON.parse(content) as AIAnalysisResult;
    return parsed;
  } catch (error) {
    console.error('Error during AI Analysis:', error);
    return null; 
    // Fall back gracefully if OpenAI goes down; we NEVER want to block a submission due to AI failure.
  }
};
