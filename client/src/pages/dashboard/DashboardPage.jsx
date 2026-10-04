import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProgress } from '../../context/ProgressContext';
import { CONCEPTS_DATA, SUBJECTS_DATA } from '../../data/conceptsData';
import { 
  Flame, 
  Award, 
  BookOpen, 
  FlaskConical, 
  CheckCircle2, 
  ArrowRight, 
  Compass, 
  Sparkles, 
  Zap, 
  Waves, 
  Clock, 
  Play, 
  Star,
  Layers,
  Atom,
  Binary,
  Dna,
  Activity,
  Heart
} from 'lucide-react';

const subjectIconMap = {
  physics: Atom,
  chemistry: FlaskConical,
  mathematics: Binary,
  biology: Dna
};

const badgeIconMap = {
  Orbit: Atom,
  FlaskConical,
  Flame,
  Heart,
  Zap,
  Waves
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { progress } = useProgress();
  const navigate = useNavigate();

  const studentName = user ? user.name : 'Student Explorer';

  const exploredCount = progress.conceptsExplored.length;
  const totalConcepts = CONCEPTS_DATA.length;
  const progressPercent = Math.min(100, Math.round((exploredCount / totalConcepts) * 100));

  // Calculate per-subject progress
  const subjectProgress = SUBJECTS_DATA.map((subject) => {
    const subjectSims = CONCEPTS_DATA.filter((c) => c.subject === subject.id);
    const completedCount = subjectSims.filter((c) =>
      progress.conceptsExplored.includes(c.slug)
    ).length;
    const percent = Math.round((completedCount / (subjectSims.length || 1)) * 100);

    return {
      ...subject,
      total: subjectSims.length,
      completed: completedCount,
      percent
    };
  });

  // Recent activity list
  const activities = progress.recentActivity || [
    { id: '1', text: 'Completed Projectile & Circular Motion', timestamp: '1 hour ago' },
    { id: '2', text: 'Scored 90% in Chemical Bonding Quiz', timestamp: '3 hours ago' },
    { id: '3', text: 'Explored Heart Working Simulator', timestamp: 'Yesterday' },
    { id: '4', text: 'Completed Graph Theory Simulator', timestamp: '2 days ago' }
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Top Welcome Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0B132B] to-slate-900 border border-slate-800/80 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 blur-[120px] pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Active STEM Student Dashboard</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="bg-gradient-to-r from-cyan-400 to-indigo-300 bg-clip-text text-transparent">{studentName}</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Continue your interactive STEM journey. You have explored {exploredCount} of {totalConcepts} simulations across Physics, Chemistry, Mathematics, and Biology.
            </p>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/explore')}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all group"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explore All Labs</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={() => navigate('/quiz')}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-purple-300 bg-purple-950/40 hover:bg-purple-900/50 border border-purple-800/50 flex items-center gap-2 transition-all"
            >
              <Award className="w-3.5 h-3.5 text-purple-400" />
              <span>Take Quiz</span>
            </button>
          </div>
        </div>

        {/* Global Curriculum Progress Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-400 font-mono">Total Curriculum Completion</span>
            <span className="text-cyan-400 font-mono font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-500 rounded-full transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Concepts Explored */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Concepts Explored</span>
            <BookOpen className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{exploredCount}</div>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">Out of {totalConcepts} modules</p>
          </div>
        </div>

        {/* Simulations Completed */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Simulations Run</span>
            <FlaskConical className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{progress.simulationsCompleted || exploredCount}</div>
            <p className="text-[10px] text-emerald-400 font-mono mt-0.5">Active experiments</p>
          </div>
        </div>

        {/* Quizzes Completed & Avg Score */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Average Quiz Score</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{progress.quizScoreAverage}%</div>
            <p className="text-[10px] text-purple-400 font-mono mt-0.5">{progress.quizzesCompleted || 3} Quizzes completed</p>
          </div>
        </div>

        {/* Total XP Earned */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">STEM XP Points</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-amber-300">{progress.xp}</div>
            <p className="text-[10px] text-amber-500/80 font-mono mt-0.5">Gamified achievements</p>
          </div>
        </div>

        {/* Daily Learning Streak */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-2 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Learning Streak</span>
            <Flame className="w-4 h-4 text-rose-500" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-rose-400 flex items-center gap-1.5">
              <span>{progress.streakDays}</span>
              <span className="text-xs text-slate-400 font-normal">days</span>
            </div>
            <p className="text-[10px] text-rose-400/80 font-mono mt-0.5">Keep learning daily</p>
          </div>
        </div>
      </div>

      {/* ================= FOUR SUBJECT PROGRESS SECTION ================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <span>Subject Progress</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Progress breakdown across all four primary scientific subjects.</p>
          </div>

          <Link
            to="/explore"
            className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
          >
            <span>View All Subjects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {subjectProgress.map((sub) => {
            const SubIcon = subjectIconMap[sub.id] || Layers;

            return (
              <div
                key={sub.id}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{sub.emoji}</span>
                      <h3 className="text-base font-bold text-white">{sub.name}</h3>
                    </div>
                    <span className="text-xs font-mono text-cyan-400 font-bold">
                      {sub.completed}/{sub.total}
                    </span>
                  </div>

                  {/* ASCII / Visual Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-500"
                        style={{ width: `${sub.percent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-slate-500">
                      <span>Progress</span>
                      <span>{sub.percent}%</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate(sub.route)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 hover:text-white border border-slate-700 flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Explore {sub.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity & Earned Badges Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Recent Activity Feed */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Recent Activity</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">Latest actions</span>
          </div>

          <div className="space-y-3">
            {activities.map((act) => (
              <div
                key={act.id}
                className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                  <span className="text-white font-medium">{act.text}</span>
                </div>
                <span className="text-[11px] font-mono text-slate-500 shrink-0">{act.timestamp}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Badges & Achievements */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400" />
              <span>Earned Badges</span>
            </h3>
            <span className="text-xs font-mono text-amber-400">{progress.badges.length} Unlocked</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {progress.badges.map((badge) => {
              const BIcon = badgeIconMap[badge.icon] || Award;
              return (
                <div
                  key={badge.id}
                  className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5 hover:border-amber-500/40 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
                    <BIcon className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-white truncate">{badge.name}</h4>
                  <p className="text-[10px] text-slate-400 leading-tight line-clamp-2">{badge.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
