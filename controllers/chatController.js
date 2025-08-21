import fetch from "node-fetch"; // or native fetch in Node 18+
import dotenv from "dotenv";
dotenv.config();

export const getChatResponse = async (req, res) => {
  const text = req.body.text;

  const messages = [
    { role: "system", content: "You are a helpful assistant." },
    {
      role: "user",
      content: `Current weather forecast, clothes recommendation, and food in gen-z gender appropriate language (within 50 words and some emojis) don't use hashtags: ${text}`,
    },
  ];

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat-v3.1",
        messages: messages,
      }),
    });

    const data = await response.json();

    res.status(200).send({ message: data.choices[0].message });
  } catch (error) {
    console.error("OpenRouter Error:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
