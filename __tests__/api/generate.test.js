import { detectLanguage } from "../../pages/api/detectLanguage";
import { createOpenAIInstance } from "../../pages/api/openai";
const openai = createOpenAIInstance(process.env.OPENAI_API_KEY);

test("Detects the correct language  - English Case", async () => {
  const text = "Hello there!";
  const language = await detectLanguage(text, openai);
  console.log("English test language retireved is: ", language);

  // Assert that the detected language is English
  expect(language).toBe("english");
});

test("Detects the correct language - German Case", async () => {
  const text = "Hallo guten Tag!";
  const language = await detectLanguage(text, openai);
  console.log("German test language retireved is: ", language);

  // Assert that the detected language is German
  expect(language).toBe("german");
});
