import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProgressProvider } from './context/ProgressContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AIAssistantWidget from './components/ai/AIAssistantWidget';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ExplorePage from './pages/explore/ExplorePage';
import SubjectExplorePage from './pages/explore/SubjectExplorePage';
import ExperimentsPage from './pages/experiments/ExperimentsPage';
import QuizPage from './pages/quiz/QuizPage';
import AiTutorPage from './pages/ai/AiTutorPage';
import ProfilePage from './pages/profile/ProfilePage';
import SimulationLabPage from './pages/lab/SimulationLabPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProgressProvider>
          <div className="min-h-screen bg-[#05070D] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200 relative">
            {/* Top Navigation */}
            <Navbar />

            {/* Main Application Routes */}
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/explore/:subject" element={<SubjectExplorePage />} />
                <Route path="/experiments" element={<ExperimentsPage />} />
                <Route path="/quiz" element={<QuizPage />} />
                <Route path="/ai-tutor" element={<AiTutorPage />} />
                <Route path="/profile" element={<ProfilePage />} />

                {/* Simulation Laboratory Routes */}
                <Route path="/lab/:slug" element={<SimulationLabPage />} />
                
                {/* Fallback route */}
                <Route path="*" element={<HomePage />} />
              </Routes>
            </div>

            {/* Persistent Floating AI Assistant Widget */}
            <AIAssistantWidget />

            {/* Global Footer */}
            <Footer />
          </div>
        </ProgressProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
