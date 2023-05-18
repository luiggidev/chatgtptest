import LanguageDetect from "languagedetect";
import { debugFlag } from "./config";

const lngDetector = new LanguageDetect();

export async function detectLanguage(text, openai) {
  const quickLanguageCheck = lngDetector.detect(text)[0][0];
  if (debugFlag === true)
    console.log(`quickLanguageCheck: ${quickLanguageCheck}`);

  if (quickLanguageCheck !== "english" && quickLanguageCheck !== "german") {
    console.log("long language check");
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Which language is this, disconsider possible typos and that mostly the user is trying to reply in German (reply with the language info only): ${text}`,
      temperature: 0.3,
      max_tokens: 30, // Adjust the value based on your requirements
    });
    const longLanguageCheck = completion.data.choices[0].text
      .trim()
      .toLowerCase();
    if (debugFlag === true)
      console.log(`longLanguageCheck: ${longLanguageCheck}`);

    return longLanguageCheck;
  } else {
    return quickLanguageCheck;
  }
}
