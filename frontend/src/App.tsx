import { useEffect, useState } from "react";
import MusicApp from "./MusicApp";
import { FaSpotify } from "react-icons/fa";

function App() {
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("access_token") as string;

    if (accessToken) {
      setToken(accessToken);
      window.history.pushState({}, "", "/"); // Clean URL
    }
  });

  return (
    <>
      {token ? (
        <>
          <MusicApp token={token}/>
        </>
      ) : (
        <>
          <div className="min-h-screen text-white p-6 flex flex-col items-center relative overflow-hidden">
            {/* Cool Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#667db6] via-[#0082c8] via-[#0082c8] to-black opacity-50 blur-3xl -z-10" />

            {/* Top Bar with Glass UI */}
            <div className="w-full flex justify-between items-center p-4 bg-white/10 backdrop-blur-md shadow-lg rounded-lg mb-6 border border-white/20">
              <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#0082c8] to-blue-500">
                GET Gemini Suggested Songs
              </h1>
            </div>

            {/* Login Button or MusicApp */}
            <a
              href="http://localhost:5000/login"
              className="mt-6 bg-green-500 px-6 py-3 rounded-lg text-white flex items-center gap-2 hover:bg-green-600 transition"
            >
              <FaSpotify className="text-2xl" /> Login with Spotify
            </a>
          </div>
        </>
      )}
    </>
  );
}

export default App;
