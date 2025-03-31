import express from "express";
import OpenAI from "openai";

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/", async (req, res) => {
  try {
    const { vibe } = req.body;
    const prompt = `Suggest a song that matches this vibe: "${vibe}"`;

    const response = await openai.completions.create({
      model: "gpt-3.5-turbo",
      prompt,
      max_tokens: 50,
    });

    const song = response.choices?.[0]?.text.trim();
    res.json({ song });
  } catch (error) {
    res.status(500).json({ error: "Error generating song suggestion" });
  }
});

export default router;
