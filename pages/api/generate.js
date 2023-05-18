// file name generate.js
import { createOpenAIInstance } from "./openai";
import { debugFlag } from "./config";
import { detectLanguage } from "./detectLanguage";

const thatIsNotGerman = [
  "Oops, looks like someone got lost in the language labyrinth! Please use German so that I can help you.",
  "Answers are simply magical in German! Come on, let's do some German magic!",
  "Attention! You have landed outside the German language zone. Please return and speak German.",
];

export default async function handleRequest(req, res) {
  try {
    const openai = createOpenAIInstance(process.env.OPENAI_API_KEY);
    if (debugFlag === true) console.log(`handleRequest openai: ${openai}`);

    await validateRequest(req, process.env.OPENAI_API_KEY);

    const userReply = req.body.userReply;

    // Determine the language of the user's reply
    const language = await detectLanguage(userReply, openai);

    const userPrompt = `
      Rule: only answer back in German, be short in reply and try to keep the conversation going.
      ${userReply}
    `;

    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: userPrompt,
      temperature: 0.3,
      max_tokens: 100, // Adjust the value based on your requirements
    });

    let responseText = completion.data.choices[0].text.trim();

    if (language !== "german") {
      // Randomly select a German phrase indicating the user hasn't written in German
      responseText =
        thatIsNotGerman[Math.floor(Math.random() * thatIsNotGerman.length)];
    }

    res.status(200).json({ result: responseText });
  } catch (error) {
    handleErrorResponse(res, error);
  }
}

async function validateRequest(req, key) {
  return new Promise((resolve, reject) => {
    if (!key) {
      reject(
        new Error("The OpenAI API key is missing or not configured correctly.")
      );
    }

    const userReply = req.body.userReply;
    if (!userReply || userReply.trim().length === 0) {
      reject(new Error("The user reply is missing or empty."));
    }

    resolve();
  });
}

function handleErrorResponse(res, error) {
  const statusCode = error.response ? error.response.status : 500;
  const errorMessage = error.response
    ? error.response.data
    : "An error occurred during your request.";

  console.error(`Error: ${error.message}`);
  res.status(statusCode).json({ error: { message: errorMessage } });
}
