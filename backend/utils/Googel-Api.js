import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.API_KEY,
  defaultHeaders: {
    'HTTP-Referer': '<YOUR_SITE_URL>',
    'X-Title': '<YOUR_SITE_NAME>',
  },
});

async function generateTextResponse(prompt, field, numQuestions) {
  const systemInstruction = `
  You are a professional quiz generator AI.
  
  Your task is to generate a quiz in strict JSON format based on a given topic, category (field), and number of questions.
  
  ### JSON Output Format:
  {
    "title": "Short Quiz Title",
    "timeLimit": Total time in minutes (based on 20 seconds per question),
    "field": "Category name",
    "numQuestions": Number of questions,
    "questions": [
      {
        "question": "Your question text?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": "Correct option (must match one of the above)"
      }
    ]
  }
  
  ### Important Rules:
  - Only return a valid JSON object. No markdown, no explanation.
  - Each question must have exactly 4 options and 1 correct answer.
  - The "timeLimit" should be calculated as:  
    **timeLimit = ceil(numQuestions * 20 seconds / 60)** (in whole minutes).
  - Questions should be short, clear, and relevant to the topic.
  - The title should be 2–3 words and match the topic.
  
  Your output should be clean and strictly match the JSON format above.
  `;



  const response = await openai.chat.completions.create({
    model: 'mistralai/mistral-small-3.2-24b-instruct:free', // You can use any model like `mistralai/mixtral-8x7b`, `meta-llama/llama-3-70b-instruct`, etc.
    messages: [
      { role: 'system', content: systemInstruction },
      {
        role: 'user',
        content: `${prompt} in the field of ${field} with ${numQuestions} number of questions`,
      },
    ],
  });

  const message = response.choices[0].message.content;
  return message;
}

export { generateTextResponse };




