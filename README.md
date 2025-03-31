# AI Vibe Music

An AI-powered app that suggests songs based on your current vibe. Built with **React (Vite) for frontend**, **Node.js for backend**, and deployed on **Vercel (frontend)** and **Render (backend)**.

## 🚀 Features
- Uses **Spotify API** to fetch song data.
- AI-powered vibe detection using **OpenAI API**.
- Cool graphics & simple UI.

## 🌐 Live Demo
[AI Vibe Music](https://ai-vibe-music.vercel.app/)

## 🛠 Tech Stack
- ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) **React (Vite)** – Frontend
- ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white) **Node.js** – Backend
- ![Spotify](https://img.shields.io/badge/Spotify-1DB954?style=for-the-badge&logo=spotify&logoColor=white) **Spotify API** – Fetching song data
- ![Gemini](https://img.shields.io/badge/Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white) **Gemini AI (OpenAI API)** – Vibe detection

---
## 📂 Project Structure
```
ai-vibe-music/
│── frontend/  # React + Vite (Vercel)
│── backend/   # Node.js + Express (Render)
│── .github/
│   ├── workflows/
│       ├── frontend.yml  # GitHub Actions for frontend CI/CD
│       ├── backend.yml   # GitHub Actions for backend CI/CD
│── README.md
```

---

## 🛠️ Setup and Installation

### 1️⃣ Clone the repository
```sh
git clone https://github.com/yourusername/ai-vibe-music.git
cd ai-vibe-music
```

### 2️⃣ Install dependencies
#### **Frontend** (React + Vite)
```sh
cd frontend
npm install
```
#### **Backend** (Node.js + Express)
```sh
cd ../backend
npm install
```

---

## ⚙️ Environment Variables
Set up the required API keys.

### **Frontend (`frontend/.env`):**
```sh
VITE_BACKEND_URL=https://your-backend.onrender.com
```

### **Backend (`backend/.env`):**
```sh
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
OPENAI_API_KEY=your_openai_api_key
```

---

## ▶️ Running the Project Locally

### **Start the Backend**
```sh
cd backend
npm run dev  # Starts the Express server
```

### **Start the Frontend**
```sh
cd frontend
npm run dev  # Starts Vite development server
```

The app should be running at: `http://localhost:5173`

---

## 🔄 CI/CD Setup
This project uses **GitHub Actions** for automated deployment.

### **Vercel Deployment (Frontend)**
1. Install Vercel CLI:
   ```sh
   npm i -g vercel
   ```
2. Link to Vercel:
   ```sh
   cd frontend
   vercel init
   ```
3. Add a **GitHub Secret** called `VERCEL_TOKEN` with your **Vercel API token**.

### **Render Deployment (Backend)**
1. Create a **Render Web Service** and connect it to `backend/`.
2. Get your **Render Deploy Hook** and add it as a GitHub Secret called `RENDER_DEPLOY_HOOK`.

Now, every `git push` to `main` will auto-deploy your app! 🚀

---

## 📜 License
MIT License © 2025 Winstone Were

---

## 💡 Future Improvements
- 📊 Add cool visualizations.
- 🗣️ Voice-based vibe detection.

---

## 💬 Contributing
Feel free to fork, open issues, or submit PRs!

```sh
git checkout -b feature/new-feature
git push origin feature/new-feature
```

