import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

if (!process.env.OPENAI_API_KEY) {
  console.error("❌ Missing OPENAI_API_KEY in .env file");
  process.exit(1);
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/", (req, res) => {
  res.json({
    status: "ZODI Content Agent is running",
    endpoint: "/generate-package",
  });
});

app.post("/generate-package", async (req, res) => {
  try {
    const {
      brand = "ZODI",
      niche = "zodiac superhero cinematic shorts",
      platform = "YouTube Shorts and TikTok",
      videoLength = "60 seconds",
    } = req.body;

    const prompt = `
You are a world-class content strategist.

Create a complete short-form video package.

Brand: ${brand}
Niche: ${niche}
Platform: ${platform}
Length: ${videoLength}

Return VALID JSON ONLY.

{
  "topic": "",
  "hook": "",
  "script": "",
  "title_options": ["", "", "", "", ""],
  "description": "",
  "hashtags": ["", "", "", "", "", "", "", "", "", ""],
  "thumbnail_options": [
    {
      "concept": "",
      "image_prompt": "",
      "text_overlay": ""
    }
  ]
}
`;

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "Return valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8,
    });

    const text = response.choices[0].message.content;
    const parsed = JSON.parse(text);

    res.json({
      success: true,
      generated_at: new Date().toISOString(),
      package: parsed,
    });
  } catch (error) {
    console.error("Agent error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 ZODI Content Agent running at http://localhost:${PORT}`);
});