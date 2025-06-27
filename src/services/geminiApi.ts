import axios from 'axios';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export const summarizeArticle = async (articleContent: string): Promise<string> => {
  if (!API_KEY) {
    throw new Error('Gemini API key not configured');
  }

  const prompt = `Summarize the following article in 3 bullet points, keeping each point concise and informative:

${articleContent}

Please format the response as:
• [First key point]
• [Second key point] 
• [Third key point]`;

  try {
    const response = await axios.post(
      `${BASE_URL}?key=${API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const summary = response.data.candidates[0]?.content?.parts[0]?.text;
    return summary || 'Unable to generate summary at this time.';
  } catch (error) {
    console.error('Error generating summary:', error);
    throw new Error('Failed to generate article summary');
  }
};