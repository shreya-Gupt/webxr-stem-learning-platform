import React from 'react';
import { Link } from 'react-router-dom';
import { Atom } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#030509] border-t border-slate-800/80 pt-16 pb-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800/60">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center">
                <Atom className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-wider">WebXR</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              "See What You Can't See." An interactive STEM learning platform helping students master abstract scientific and mathematical principles through real-time 3D exploration.
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-cyan-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              4 Subjects / 11 Simulations Ready
            </div>
          </div>

          {/* Col 2: Featured STEM Fields */}
          <div>
            <h4 className="text-slate-200 font-semibold text-sm mb-3">Disciplines</h4>
            <ul className="space-y-2">
              <li><Link to="/explore/physics" className="hover:text-cyan-400 transition-colors">Physics (5 Labs)</Link></li>
              <li><Link to="/explore/chemistry" className="hover:text-cyan-400 transition-colors">Chemistry (2 Labs)</Link></li>
              <li><Link to="/explore/mathematics" className="hover:text-cyan-400 transition-colors">Mathematics (2 Labs)</Link></li>
              <li><Link to="/explore/biology" className="hover:text-cyan-400 transition-colors">Biology (2 Labs)</Link></li>
            </ul>
          </div>

          {/* Col 3: Platform & Modules */}
          <div>
            <h4 className="text-slate-200 font-semibold text-sm mb-3">Platform</h4>
            <ul className="space-y-2">
              <li><Link to="/explore" className="hover:text-cyan-400 transition-colors">Interactive 3D Labs</Link></li>
              <li><Link to="/experiments" className="hover:text-cyan-400 transition-colors">Experiment Challenges</Link></li>
              <li><Link to="/quiz" className="hover:text-cyan-400 transition-colors">Mastery Quizzes</Link></li>
              <li><Link to="/dashboard" className="hover:text-cyan-400 transition-colors">Student Dashboard</Link></li>
            </ul>
          </div>

          {/* Col 4: Technology & Standards */}
          <div>
            <h4 className="text-slate-200 font-semibold text-sm mb-3">Architecture</h4>
            <p className="text-slate-400 text-xs mb-3">
              Engineered with React 18, Three.js, React Three Fiber, Node.js, and Google Gemini API integration.
            </p>
            <div className="flex flex-wrap gap-1.5 text-[10px] font-mono text-slate-400">
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">React 18</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">Three.js</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">Express</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">MongoDB</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">Gemini AI</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>&copy; {new Date().getFullYear()} WebXR STEM Platform. Multi-Subject Educational System.</p>
          <p className="flex items-center gap-1">
            Built for spatial learning across Physics, Chemistry, Mathematics, and Biology
          </p>
        </div>
      </div>
    </footer>
  );
}
