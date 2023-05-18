import { detectLanguage } from "./generate";

test("Detects the correct language - German Case", async () => {
  const text = "Guten Tag!";
  const language = await detectLanguage(text);

  // Assert that the detected language is German
  expect(language).toBe("german");
});

test("Detects the correct language  - English Case", async () => {
  const text = "Hello there!";
  const language = await detectLanguage(text);

  // Assert that the detected language is English
  expect(language).toBe("english");
});
