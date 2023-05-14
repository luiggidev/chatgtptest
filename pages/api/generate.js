import { Configuration, OpenAIApi } from "openai";
import { handleErrorResponse } from "./errorHandler";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const thatIsNotGerman = [
  "Hoppla, da ist wohl jemand im Sprachlabyrinth verirrt! Bitte benutze Deutsch, damit ich dir helfen kann.",
  "Auf Deutsch sind die Antworten einfach magisch! Komm schon, lass uns in Deutsch zaubern!",
  "Spreche Deutsch, um das volle Potenzial meiner Antworten zu entfesseln!",
  "Achtung! Du bist gerade außerhalb der deutschen Sprachzone gelandet. Bitte kehre zurück und sprich Deutsch.",
  "Hände hoch! Dies ist eine deutschsprachige Zone. Keine Fremdsprachen erlaubt!",
  "Kannst du den deutschen Sprachcode knacken? Nur Deutsch ermöglicht eine Antwort!",
  "Deutsch ist wie eine Reise in eine zauberhafte Welt. Komm mit und entdecke die Magie!",
  "Schnapp dir einen Kaffee und tauche ein in das Wunderland der deutschen Sprache!",
  "Ich brauche dringend ein paar Worte Deutsch, um den Bot-Turbo zu aktivieren!",
  "Nicht auf Deutsch? Oh nein! Komm zurück ins Land der Worte, die wir verstehen.",
  "Du bist ein Sprachabenteurer! Setze deine Reise fort und erforsche die deutsche Sprache.",
  "Vergiss die Geheimcodes, aber erinnere dich daran, auf Deutsch zu schreiben! Lass uns Spaß haben!",
  "Tauche ein in den deutschen Sprachdschungel und lass uns gemeinsam auf Schatzsuche gehen!",
  "Es scheint, du hast ein Sprachrätsel für mich. Beantworte es auf Deutsch, damit wir weitermachen können!",
  "Willkommen in der deutschen Sprachakrobatik! Lass uns wortwörtlich Spaß haben!",
  "Keine Sorge, ich beiße nicht! Aber ich antworte nur, wenn du Deutsch sprichst. Los geht's!"
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
      responseText = thatIsNotGerman[Math.floor(Math.random() * thatIsNotGerman.length)];
    }

    res.status(200).json({ result: responseText });
  } catch (error) {
    handleErrorResponse(res, error);
  }
}

async function detectLanguage(text) {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `Which language is this (reply with the language info only): ${text}`,
    temperature: 0.3,
    max_tokens: 20, // Adjust the value based on your requirements
  });

  const language = completion.data.choices[0].text.trim().toLowerCase();
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
