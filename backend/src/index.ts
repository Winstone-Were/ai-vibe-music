import "dotenv/config"
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import aiRoutes from "./routes/ai";
import spotifyRoutes from "./routes/spotify";
import axios from "axios";
import cookieParser from "cookie-parser";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI as string;
const FRONTEND_URI = process.env.FRONTEND_URI;
const STATE_KEY = "spotify_auth_state";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/ai", aiRoutes);
app.use("/spotify", spotifyRoutes);

const generateRandomString = (length: number): string => {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

app.get("/login", (req, res) => {
    const state = generateRandomString(16);
    res.cookie(STATE_KEY, state);

    const scope = "user-read-private user-read-email user-read-playback-state app-remote-control user-modify-playback-state playlist-modify-private playlist-modify-public";
    const authUrl = `https://accounts.spotify.com/authorize?` +
        `client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
        `&scope=${encodeURIComponent(scope)}&state=${state}`;

    res.redirect(authUrl);
});


app.get("/callback", async (req, res) => {
    const code = req.query.code as string;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[STATE_KEY] : null;
  
    if (state === null || state !== storedState) {
      return res.redirect(`${FRONTEND_URI}/error`);
    }
  
    res.clearCookie(STATE_KEY);
  
    const authOptions = {
      method: "post",
      url: "https://accounts.spotify.com/api/token",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
      },
      data: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
      }).toString(),
    };
  
    try {
      const response = await axios(authOptions);
      res.redirect(`${FRONTEND_URI}/?access_token=${response.data.access_token}`);
    } catch (error) {
      console.error("Error fetching access token:", error);
      res.redirect(`${FRONTEND_URI}/error`);
    }
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
