import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

const ai = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// TEXT RESPONSE
async function generateTextResponse(prompt, field, numQuestions) {
  const model = ai.getGenerativeModel({
    model: "gemini-1.5-pro-latest",
    systemInstruction: `
You are a professional quiz generator AI.

Your job is to generate a quiz based on the provided prompt, field, and number of questions.
Generate a quiz in strict JSON format.

Here is the required JSON structure:
{
  "title": "Quiz Topic",
  "timeLimit": 5,
  "field": "Category",
  "numQuestions": Number of Questions,
  "questions": [
    {
      "question": "Question here?",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A"
    },
    ...
  ]
}

Rules:
- Only return the JSON object (do NOT wrap it in Markdown or explain anything).
- Each question must have 4 options and one correct answer from them.
- Keep questions short and relevant to the topic.
-Keep the title short 2 or 3 words and relevant to the topic.

Example input=>

Expected response format:
{
  "title": "JavaScript Basics",
  "timeLimit": 5,
  "field": "Programming",
  "numQuestions": 3,
  "questions": [
    {
      "question": "What keyword is used to declare a variable in JavaScript?",
      "options": ["var", "define", "let", "const"],
      "correctAnswer": "let"
    },
    ...
  ]
}
        `
  });

  const result = await model.generateContent(`${prompt} in the field of ${field} with ${numQuestions} number of questions`);
  const response = await result.response;
  const text = response.text();

  console.log(text);
  return text;
}

// IMAGE + TEXT (Vision)
async function generateImageResponse(imagePath, prompt) {
  const model = ai.getGenerativeModel({ model: "gemini-1.5-pro-vision" });

  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString("base64");

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: "image/png", // or "image/jpeg"
        data: base64Image,
      },
    },
    { text: prompt },
  ]);

  const response = await result.response;
  const text = response.text();

  console.log(text);
  return text;
}

export { generateTextResponse, generateImageResponse };
