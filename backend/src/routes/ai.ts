import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { getSpotifySongDetails } from "./spotify";

dotenv.config();

const router = express.Router();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post("/", async (req, res) => {
  try {
    const { vibe } = req.body;
    const prompt = `Give 5 song titles from spotify that matches this vibe: "${vibe}" in the format {Song:"song_name", Artist:"artist_name", Deescription: "2 sentence description"} no fancy formatting just text`;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
    });

    const songs = response.text
      ?.split("\n")
      .map((line) => line.trim())
      .filter((line) => line.startsWith("{") && line.endsWith("}"))
      .map((line) => {
        try {
          const parsed = JSON.parse(line.replace(/(\w+):/g, '"$1":')); // Convert to valid JSON

          const song = parsed.Song || "Unknown Song";
          const artist = parsed.Artist || "Unknown Artist";
          const comment = parsed.Description || "No comment provided.";

          return `Song: ${song}, Artist: ${artist}, Comment: ${comment}`;
        } catch (error) {
          console.error("Error parsing line:", line);
          return null;
        }
      })
      .filter(Boolean); // Remove null values

    const songTitles = songs
      ?.map((song) => song?.match(/Song: (.*?), Artist:/)?.[1])
      .filter((title): title is string => Boolean(title));
    console.log(songTitles);

    const songDetails = await Promise.all(
      (songTitles || []).map((title) => getSpotifySongDetails(title))
    );

    res.json(songDetails);
  } catch (error) {
    console.error("Error generating song suggestion:", error);
    res.status(500).json({ error: "Error generating song suggestion" });
  }
});

export default router;
