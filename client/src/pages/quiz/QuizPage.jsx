import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { QUIZZES_DATA } from '../../data/quizData';
import { SUBJECTS_DATA, CONCEPTS_DATA } from '../../data/conceptsData';
import { useProgress } from '../../context/ProgressContext';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ArrowRight, 
  RotateCcw, 
  Sparkles,
  Zap,
  Waves,
  CircleDot,
  Atom,
  FlaskConical,
  Binary,
  Dna,
  ArrowLeft,
  Layers
} from 'lucide-react';

const subjectIconMap = {
  physics: Atom,
  chemistry: FlaskConical,
  mathematics: Binary,
  biology: Dna
};

export default function QuizPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { recordQuizResult } = useProgress();

  const topicParam = searchParams.get('topic');

  // Filter subject
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedQuizId, setSelectedQuizId] = useState(() => {
    if (topicParam && QUIZZES_DATA.some((q) => q.id === topicParam)) {
      return topicParam;
    }
    return QUIZZES_DATA[0].id;
  });

  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Sync if topicParam changes
  useEffect(() => {
    if (topicParam && QUIZZES_DATA.some((q) => q.id === topicParam)) {
      setSelectedQuizId(topicParam);
      setUserAnswers({});
      setSubmitted(false);
      const matched = QUIZZES_DATA.find((q) => q.id === topicParam);
      if (matched && matched.subject) {
        setSelectedSubject(matched.subject);
      }
    }
  }, [topicParam]);

  const activeQuiz = useMemo(() => {
    return QUIZZES_DATA.find((q) => q.id === selectedQuizId) || QUIZZES_DATA[0];
  }, [selectedQuizId]);

  const filteredQuizzes = useMemo(() => {
    if (selectedSubject === 'all') return QUIZZES_DATA;
    return QUIZZES_DATA.filter((q) => q.subject === selectedSubject);
  }, [selectedSubject]);

  const conceptInfo = useMemo(() => {
    return CONCEPTS_DATA.find((c) => c.slug === activeQuiz.id);
  }, [activeQuiz]);

  const SubjectIcon = subjectIconMap[activeQuiz.subject] || Layers;

  const handleSelectOption = (questionId, optionIndex) => {
    if (submitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setSubmitted(false);
  };

  const handleSubmitQuiz = () => {
    setSubmitted(true);

    // Calculate score
    let correctCount = 0;
    activeQuiz.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correct) {
        correctCount += 1;
      }
    });

    const percent = Math.round((correctCount / activeQuiz.questions.length) * 100);
    recordQuizResult(percent);
  };

  // Score statistics
  const scoreStats = useMemo(() => {
    if (!submitted) return null;
    let correctCount = 0;
    activeQuiz.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correct) {
        correctCount += 1;
      }
    });
    const percent = Math.round((correctCount / activeQuiz.questions.length) * 100);
    return {
      correctCount,
      total: activeQuiz.questions.length,
      percent
    };
  }, [submitted, userAnswers, activeQuiz]);

  const answeredCount = Object.keys(userAnswers).length;
  const isComplete = answeredCount === activeQuiz.questions.length;

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-xs font-mono text-purple-300">
            <Award className="w-3.5 h-3.5 text-purple-400" />
            <span>Interactive STEM Knowledge Testing</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Concept Mastery Quizzes
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Test your physical intuition and scientific formulas. Every quiz is simulation-specific with detailed step-by-step explanations.
          </p>
        </div>

        {conceptInfo && (
          <Link
            to={conceptInfo.route}
            className="z-10 px-4 py-2 rounded-xl text-xs font-semibold text-cyan-300 bg-cyan-950/40 border border-cyan-800/40 hover:bg-cyan-900/40 flex items-center gap-2 transition-all self-start md:self-auto"
          >
            <span>Open {conceptInfo.title} Lab</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Subject Filter Tabs & Quiz Picker */}
      <div className="space-y-4">
        {/* Subject Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => { setSelectedSubject('all'); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedSubject === 'all'
                ? 'bg-cyan-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Subjects (11)
          </button>
          {SUBJECTS_DATA.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setSelectedSubject(s.id);
                const firstInSubject = QUIZZES_DATA.find((q) => q.subject === s.id);
                if (firstInSubject) {
                  setSelectedQuizId(firstInSubject.id);
                  setUserAnswers({});
                  setSubmitted(false);
                }
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                selectedSubject === s.id
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>{s.emoji}</span>
              <span>{s.name}</span>
            </button>
          ))}
        </div>

        {/* Quiz Select Pills */}
        <div className="flex flex-wrap gap-2">
          {filteredQuizzes.map((q) => {
            const isSelected = selectedQuizId === q.id;
            return (
              <button
                key={q.id}
                onClick={() => {
                  setSelectedQuizId(q.id);
                  setUserAnswers({});
                  setSubmitted(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all border ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border-cyan-500 text-cyan-300 font-bold'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                {q.title.replace(' Quiz', '')}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Quiz Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-8">
        {/* Quiz Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 flex items-center gap-1 capitalize">
                <SubjectIcon className="w-3 h-3" />
                <span>{activeQuiz.subject}</span>
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                5 Concept Questions
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {activeQuiz.title}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400">
              Answered: <strong className="text-white">{answeredCount}</strong> / {activeQuiz.questions.length}
            </span>
            <button
              onClick={handleResetQuiz}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs flex items-center gap-1 border border-slate-700"
              title="Reset Quiz Answers"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Score Card on Submission */}
        {submitted && scoreStats && (
          <div className={`p-6 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            scoreStats.percent >= 80
              ? 'bg-emerald-950/40 border-emerald-500/40'
              : scoreStats.percent >= 60
              ? 'bg-cyan-950/40 border-cyan-500/40'
              : 'bg-amber-950/40 border-amber-500/40'
          }`}>
            <div className="space-y-1">
              <p className="text-xs font-mono uppercase tracking-wider text-slate-300">
                Quiz Evaluation Completed
              </p>
              <h3 className="text-2xl font-extrabold text-white">
                You Scored: {scoreStats.correctCount} / {scoreStats.total} ({scoreStats.percent}%)
              </h3>
              <p className="text-xs text-slate-300">
                {scoreStats.percent === 100
                  ? 'Flawless score! Mastered all concept nuances.'
                  : scoreStats.percent >= 60
                  ? 'Great effort! Review the explanations below to refine your understanding.'
                  : 'Review the theoretical models in the simulation lab and re-attempt!'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResetQuiz}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700"
              >
                Re-Attempt
              </button>

              {conceptInfo && (
                <Link
                  to={conceptInfo.route}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-md"
                >
                  Return to Simulation
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Questions List */}
        <div className="space-y-8">
          {activeQuiz.questions.map((q, idx) => {
            const isUserAnswered = userAnswers[q.id] !== undefined;
            const isCorrect = submitted && userAnswers[q.id] === q.correct;

            return (
              <div
                key={q.id}
                className={`p-6 rounded-2xl border transition-all ${
                  submitted
                    ? isCorrect
                      ? 'bg-emerald-950/20 border-emerald-800/40'
                      : 'bg-rose-950/20 border-rose-800/40'
                    : 'bg-slate-950/60 border-slate-800/80'
                }`}
              >
                {/* Question Prompt */}
                <div className="flex items-start gap-3 mb-4">
                  <span className="p-1.5 rounded-lg bg-slate-800 text-cyan-300 font-mono text-xs font-bold shrink-0">
                    Q{idx + 1}
                  </span>
                  <p className="text-sm sm:text-base font-semibold text-white leading-relaxed">
                    {q.question}
                  </p>
                </div>

                {/* Multiple Choice Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-8">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = userAnswers[q.id] === oIdx;
                    let optionStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/70';

                    if (submitted) {
                      if (oIdx === q.correct) {
                        optionStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-medium';
                      } else if (isSelected && oIdx !== q.correct) {
                        optionStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                      } else {
                        optionStyle = 'bg-slate-950 border-slate-800 text-slate-500 opacity-60';
                      }
                    } else if (isSelected) {
                      optionStyle = 'bg-cyan-950/70 border-cyan-500 text-cyan-200 font-medium shadow-md shadow-cyan-500/10';
                    }

                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleSelectOption(q.id, oIdx)}
                        disabled={submitted}
                        className={`p-3.5 rounded-xl border text-xs text-left transition-all flex items-center justify-between gap-2 ${optionStyle}`}
                      >
                        <span>{opt}</span>
                        {submitted && oIdx === q.correct && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                        {submitted && isSelected && oIdx !== q.correct && (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Banner on Submit */}
                {submitted && (
                  <div className="mt-4 pt-4 border-t border-slate-800/80 pl-8 text-xs space-y-1">
                    <p className="text-slate-400 font-bold flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                      Scientific Explanation:
                    </p>
                    <p className="text-slate-300 leading-relaxed font-sans text-[11px]">
                      {q.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit Quiz Action Button */}
        {!submitted && (
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
            <p className="text-xs text-slate-400">
              {isComplete
                ? 'All 5 questions answered. Ready to submit!'
                : `Please answer all questions (${5 - answeredCount} remaining).`}
            </p>

            <button
              onClick={handleSubmitQuiz}
              disabled={!isComplete}
              className={`px-6 py-3 rounded-xl text-xs font-bold text-white transition-all flex items-center gap-2 ${
                isComplete
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-lg shadow-cyan-500/25 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              <span>Submit Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
