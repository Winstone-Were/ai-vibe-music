import "dotenv/config"
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import aiRoutes from "./routes/ai";
import spotifyRoutes from "./routes/spotify";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/ai", aiRoutes);
app.use("/spotify", spotifyRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
