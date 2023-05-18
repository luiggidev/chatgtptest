import { Configuration, OpenAIApi } from "openai";

export function createOpenAIInstance(apiKey) {
  const configuration = new Configuration({
    apiKey: apiKey,
  });
  return new OpenAIApi(configuration);
}
