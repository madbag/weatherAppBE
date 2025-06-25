import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import process from "process";
import OpenAI from "openai";

dotenv.config();

const PORT = 8000;
const app = express();
app.use(express.json());
app.use(cors());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/", async (req, res) => {
  const text = req.body.text; 
  const messages = [
    { role: "system", content: "You are a helpful assistant." },
    {
      role: "user",
      content: `Today's weather forecast, clothes recommendation and food in Gen Z language, 50 words and some emoticon: ${text}`,
    },
  ];
  try {
    const completion = await openai.chat.completions.create({
      messages,
      model: "gpt-3.5-turbo",
    });
    console.log(completion.choices[0]);
    res.send(completion.choices[0]);
  } catch (error) {
    console.error(error);

    if (error.response) {
      // If the error is a response from the OpenAI API
      res.status(error.response.status).send({
        error: error.response.data.error.message,
      });
    } else if (error.request) {
      // If the request was made but no response was received
      res.status(503).send({
        error: "Service Unavailable: No response received from the API.",
      });
    } else {
      // If something happened in setting up the request that triggered an Error
      res.status(500).send({
        error:
          "Internal Server Error: An error occurred while processing the request.",
      });
    }
  }
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}!`));
