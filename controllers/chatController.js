import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const getChatResponse = async (req, res) => {
  const text = req.body.text;

  const messages = [
    { role: "system", content: "You are a helpful assistant." },
    {
      role: "user",
      content: `Roast today's weather forecast, clothes recommendation, and food in gen-z gender appropriate language (within 50 words and some emojis) don't use hashtags: ${text}`,
    },
  ];

  try {
    const completion = await openai.chat.completions.create({
      messages,
      model: "gpt-3.5-turbo",
    });

    
    res.status(200).send(completion.choices[0]);
  } catch (error) {
    console.error("ChatGPT Error:", error);

    if (error.response) {
      res.status(error.response.status).send({
        error: error.response.data.error.message,
      });
    } else if (error.request) {
      res.status(503).send({
        error: "Service Unavailable: No response from OpenAI.",
      });
    } else {
      res.status(500).send({
        error: "Internal Server Error",
      });
    }
  }
};
