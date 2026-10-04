# WebXR - Interactive Educational STEM Platform

**WebXR** is an interactive STEM learning platform designed to help students master complex scientific and engineering concepts through interactive 3D simulations, virtual experiments, intelligent quizzes, and an AI tutor.

---

## 🛠️ Tech Stack

### Frontend (`/client`)
- **React (v18)** - UI Library
- **Vite** - High-speed build tool and dev server
- **Tailwind CSS** - Modern utility-first CSS styling
- **Three.js** - WebGL 3D graphics library
- **React Three Fiber (@react-three/fiber)** - Declarative React renderer for Three.js
- **React Three Drei (@react-three/drei)** - Useful helpers and abstractions for R3F
- **Lucide React** - Clean icons

### Backend (`/server`)
- **Node.js** - Runtime environment
- **Express.js** - REST API framework
- **MongoDB & Mongoose** - Database and Object Data Modeling (ODM)
- **CORS & Dotenv** - Cross-origin resource sharing & configuration management
- **Google Gemini API** *(Prepared)* - AI tutor & generative STEM assistance

---

## 📂 Project Structure

```text
WebXR/
├── client/                     # Frontend Application (React + Vite)
│   ├── public/                 # Static assets & icons
│   │   └── vite.svg
│   ├── src/
│   │   ├── assets/             # Images, fonts, textures
│   │   ├── components/
│   │   │   └── canvas/         # 3D canvas and R3F components
│   │   │       └── HeroScene.jsx
│   │   ├── pages/              # Future views (Dashboard, Simulations, etc.)
│   │   ├── App.jsx             # Project confirmation & status page
│   │   ├── index.css           # Tailwind CSS directives
│   │   └── main.jsx            # React root mount
│   ├── .env.example            # Frontend environment variable template
│   ├── index.html              # HTML entrypoint
│   ├── package.json            # Frontend dependencies & scripts
│   ├── postcss.config.js       # PostCSS config for Tailwind
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   └── vite.config.js          # Vite configuration
│
├── server/                     # Backend API (Node.js + Express)
│   ├── src/
│   │   ├── config/             # DB & service configurations
│   │   │   └── db.js
│   │   ├── controllers/        # Request controllers (auth, simulations, etc.)
│   │   ├── middleware/         # Custom Express middlewares
│   │   │   └── errorHandler.js
│   │   ├── models/             # Mongoose database models
│   │   ├── routes/             # API routing endpoints
│   │   │   └── api.js
│   │   ├── services/           # External services (Gemini AI service)
│   │   └── server.js           # Server entry point & Express setup
│   ├── .env.example            # Backend environment variable template
│   └── package.json            # Backend dependencies & scripts
│
├── .gitignore                  # Git ignore rules
├── package.json                # Root convenience scripts
└── README.md                   # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18 or higher (v24 recommended)
- **npm**: v9 or higher

---

### Step 1: Install Dependencies

You can install dependencies for both frontend and backend separately:

#### 1. Frontend:
```bash
cd client
npm install
```

#### 2. Backend:
```bash
cd server
npm install
```

*(Alternatively, from the root folder you can run: `npm run install:all`)*

---

### Step 2: Environment Variables Setup

#### Frontend:
In the `client/` folder:
```bash
cp .env.example .env
```
Default value:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

#### Backend:
In the `server/` folder:
```bash
cp .env.example .env
```
Configure your keys when ready:
```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/webxr
GEMINI_API_KEY=your_gemini_api_key_here
```
> **Security Note:** Never commit `.env` files to git. API keys should always remain on the backend and in ignored `.env` files.

---

### Step 3: Running the Application

Frontend and backend can be run completely independently in separate terminal windows.

#### Running the Frontend:
In your first terminal:
```bash
cd client
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

#### Running the Backend:
In a second terminal:
```bash
cd server
npm run dev
```
The API will run on [http://localhost:5000](http://localhost:5000).
Check health at: [http://localhost:5000/api/health](http://localhost:5000/api/health).

---

## 🧭 Next Steps
Now that the project foundation is verified and ready, subsequent development phases will include:
1. User Authentication & Profile Models
2. Interactive 3D Simulation Modules (Physics, Chemistry, Biology)
3. Gemini AI Tutor integration on the backend
4. Interactive STEM quizzes & progress tracking
5. WebXR device/VR mode integration
