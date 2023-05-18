import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const debugFlag = true;
const thatIsNotGerman = [
  "Hoppla, da ist wohl jemand im Sprachlabyrinth verirrt! Bitte benutze Deutsch, damit ich dir helfen kann.",
  "Auf Deutsch sind die Antworten einfach magisch! Komm schon, lass uns in Deutsch zaubern!",
  "Spreche Deutsch, um das volle Potenzial meiner Antworten zu entfesseln!",
];

export default async function handleRequest(req, res) {
  try {
    await validateRequest(req);

    const userReply = req.body.userReply;

    // Determine the language of the user's reply
    const language = await detectLanguage(userReply);

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

async function detectLanguage(text) {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `Which language is this, disconsider possible typos and that mostly the user is trying to reply in German (reply with the language info only): ${text}`,
    temperature: 0.3,
    max_tokens: 20, // Adjust the value based on your requirements
  });
  const language = completion.data.choices[0].text.trim().toLowerCase();
  if (debugFlag == true) console.log(`Language detected: ${language}`);
  return language;
}

function validateRequest(req) {
  return new Promise((resolve, reject) => {
    if (!configuration.apiKey) {
      reject(new Error("OpenAI API key is not configured."));
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
