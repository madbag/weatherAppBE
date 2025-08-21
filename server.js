import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chat.js";

const app = express();
const PORT = process.env.PORT || 8000;

const allowedOrigins = [
  "https://aiweatherforecast.netlify.app/",
  "http://localhost:5173",
];


app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

//middleware
app.use(express.json());

//routes
app.use("/", chatRoutes);

app.listen(PORT, () => console.log(`Listening on port ${PORT}!`));

