import express from "express";
import axios from "axios";
import querystring from "querystring";
import dotenv from "dotenv";
import cors from "cors"

const router = express.Router();
router.use(cors())
dotenv.config();

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const REDIRECT_URI = process.env.REDIRECT_URI!;

router.get("/login", (req, res) => {
  const scope = "playlist-modify-public playlist-modify-private";
  const authUrl = `https://accounts.spotify.com/authorize?${querystring.stringify(
    {
      response_type: "code",
      client_id: CLIENT_ID,
      scope,
      redirect_uri: REDIRECT_URI,
    }
  )}`;

  res.redirect(authUrl);
});

router.get("/callback", async (req, res) => {
  const code = req.query.code as string;
  if (!code) {
    res.status(400).send("Auth code missing");
  }

  try {
    // Exchange code for access token
    const tokenResponse = await axios.post(
      "https://accounts.spotify.com/api/token",
      querystring.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    res.json(tokenResponse.data); // Send token to frontend
  } catch (error) {
    console.error("Error exchanging token:", error);
    res.status(500).send("Failed to authenticate");
  }
});

router.get("/:song", async (req, res) => {
  try {
    const { song } = req.params;

    // Get Spotify Access Token
    const authResponse = await axios.post(
      "https://accounts.spotify.com/api/token",
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const token = authResponse.data.access_token;

    // Search for the song
    const searchResponse = await axios.get(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        song
      )}&type=track&limit=1`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const track = searchResponse.data.tracks.items[0];
    res.json({
      title: track.name,
      artist: track.artists[0].name,
      albumCover: track.album.images[0].url,
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching song details" });
  }
});

export async function getSpotifySongDetails(song: string) {
  console.log(`\n Loading Song Details for ${song}`);
  try {
    // Get Spotify Access Token
    const authResponse = await axios.post(
      "https://accounts.spotify.com/api/token",
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const token = authResponse.data.access_token;

    // Search for the song
    const searchResponse = await axios.get(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        song
      )}&type=track&limit=1`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const track = searchResponse.data.tracks.items[0];

    if (!track) return null; // Return null if no track is found

    console.log(track.external_urls);

    return {
      title: track.name,
      artist: track.artists.map((artist: any) => artist.name).join(", "),
      albumCover: track.album.images[0]?.url || null,
      link: track.external_urls.spotify,
    };
  } catch (error) {
    console.error("Error fetching song details:", error);
    return null;
  }
}

export default router;
