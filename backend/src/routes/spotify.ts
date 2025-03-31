import express from "express";
import axios from "axios";

const router = express.Router();

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
      link: track.external_urls.spotify
    };
  } catch (error) {
    console.error("Error fetching song details:", error);
    return null;
  }
}

export default router;
