import { useState } from "react";
import { FaSpotify, FaGithubAlt } from "react-icons/fa";

const API_URL = "http://localhost:3000/ai";
const SPOTIFY_LOGIN_URL = "http://localhost:3000/spotify/login";

interface Song {
  title: string;
  artist: string;
  albumCover: string;
  link: string;
}

export default function MusicApp() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [vibe, setVibe] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchSongs = (vibe: string) => {
    setLoading(true);
    setError("");
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vibe }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch songs");
        }
        return res.json();
      })
      .then((data: Song[]) => setSongs(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (vibe.trim()) fetchSongs(vibe);
  };

  return (
    <div className="min-h-screen text-white p-6 flex flex-col items-center relative overflow-hidden">
      {/* Cool Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#667db6] via-[#0082c8] to-black opacity-50 blur-3xl -z-10" />

      {/* Top Bar with Glass UI */}
      <div className="w-full flex justify-between items-center p-4 bg-white/10 backdrop-blur-md shadow-lg rounded-lg mb-6 border border-white/20">
        <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#0082c8] to-blue-500">
          GET Gemini Suggested Songs
        </h1>
        <div className="flex gap-4">
          <a
            href={SPOTIFY_LOGIN_URL}
            className="flex items-center bg-green-500 px-4 py-2 rounded-lg text-white hover:bg-green-600 backdrop-blur-md border border-white/20"
          >
            <FaSpotify className="mr-2" /> Login with Spotify
          </a>
          <a
            href="https://github.com/Winstone-Were/ai-vibe-music"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center bg-white/10 px-4 py-2 rounded-lg text-white hover:bg-white/20 backdrop-blur-md border border-white/20"
          >
            <FaGithubAlt className="mr-2" /> GitHub
          </a>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mb-6 flex gap-4">
        <input
          type="text"
          value={vibe}
          onChange={(e) => setVibe(e.target.value)}
          placeholder="Enter a vibe..."
          className="p-2 rounded-lg text-black"
        />
        <button type="submit" className="bg-blue-500 px-4 py-2 rounded-lg">
          Search
        </button>
      </form>

      {loading && <p className="text-lg font-semibold">Loading songs...</p>}
      {error && <p className="text-red-500 font-semibold">Error: {error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {!loading &&
          !error &&
          songs.map((song, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg p-4 flex flex-col items-center border border-white/20"
            >
              <img
                src={song.albumCover}
                alt={song.title}
                className="w-40 h-40 object-cover rounded-lg"
              />
              <h2 className="text-xl font-semibold mt-4">{song.title}</h2>
              <p className="">{song.artist}</p>
              <a
                href={song.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 bg-green-500 px-4 py-2 rounded-lg text-white flex items-center gap-2 hover:bg-green-600"
              >
                <FaSpotify /> Listen
              </a>
            </div>
          ))}
      </div>
    </div>
  );
}