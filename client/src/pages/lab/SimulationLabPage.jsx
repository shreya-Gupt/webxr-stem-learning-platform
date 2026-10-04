import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CONCEPTS_DATA, SUBJECTS_DATA } from '../../data/conceptsData';
import { useProgress } from '../../context/ProgressContext';
import { 
  ArrowLeft, 
  Award, 
  Sparkles,
  Compass,
  Layers,
  Atom,
  FlaskConical,
  Binary,
  Dna
} from 'lucide-react';

// Import all 11 Interactive Simulation Engines
import ProjectileCircularSim from '../../components/simulations/ProjectileCircularSim';
import ElectricMagneticSim from '../../components/simulations/ElectricMagneticSim';
import WaveFunctionsSim from '../../components/simulations/WaveFunctionsSim';
import OscillationResonanceSim from '../../components/simulations/OscillationResonanceSim';
import CollisionSim from '../../components/simulations/CollisionSim';
import GraphTheorySim from '../../components/simulations/GraphTheorySim';
import Vectors3DSim from '../../components/simulations/Vectors3DSim';
import ChemicalBondingSim from '../../components/simulations/ChemicalBondingSim';
import ChemicalEnergySim from '../../components/simulations/ChemicalEnergySim';
import MuscleMovementSim from '../../components/simulations/MuscleMovementSim';
import HeartSim from '../../components/simulations/HeartSim';

const subjectIconMap = {
  physics: Atom,
  chemistry: FlaskConical,
  mathematics: Binary,
  biology: Dna
};

export default function SimulationLabPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { recordConceptVisit } = useProgress();

  const concept = CONCEPTS_DATA.find((c) => c.slug === slug) || {
    id: slug,
    slug: slug,
    subject: 'physics',
    subjectName: 'Physics',
    title: slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) : 'Simulation Lab',
    category: 'STEM Laboratory',
    formula: 'Fundamental Scientific Law',
    law: 'Empirical Law',
    shortExplanation: 'Interactive scientific simulation environment.',
    difficulty: 'Advanced',
    defaultParameters: {}
  };

  const subjectInfo = SUBJECTS_DATA.find((s) => s.id === concept.subject) || SUBJECTS_DATA[0];
  const SubjectIcon = subjectIconMap[concept.subject] || Layers;

  // Record this concept visit in student progress
  useEffect(() => {
    if (concept && concept.slug) {
      recordConceptVisit(concept);
    }
  }, [concept.slug]);

  const goToQuiz = () => {
    navigate(`/quiz?topic=${concept.slug}`);
  };

  // Render the appropriate simulation engine
  const renderSimulation = () => {
    switch (slug) {
      case 'projectile-circular-motion':
        return <ProjectileCircularSim onQuizClick={goToQuiz} />;
      case 'electric-magnetic-fields':
      case 'electromagnetic-induction':
        return <ElectricMagneticSim onQuizClick={goToQuiz} />;
      case 'wave-functions-pes':
        return <WaveFunctionsSim onQuizClick={goToQuiz} />;
      case 'oscillation-resonance':
        return <OscillationResonanceSim onQuizClick={goToQuiz} />;
      case 'collision':
        return <CollisionSim onQuizClick={goToQuiz} />;
      case 'graph-theory':
        return <GraphTheorySim onQuizClick={goToQuiz} />;
      case 'vectors-3d':
        return <Vectors3DSim onQuizClick={goToQuiz} />;
      case 'chemical-bonding':
        return <ChemicalBondingSim onQuizClick={goToQuiz} />;
      case 'chemical-energy':
        return <ChemicalEnergySim onQuizClick={goToQuiz} />;
      case 'muscle-movement':
        return <MuscleMovementSim onQuizClick={goToQuiz} />;
      case 'heart':
        return <HeartSim onQuizClick={goToQuiz} />;
      default:
        // Default to projectile motion rather than an empty placeholder
        return <ProjectileCircularSim onQuizClick={goToQuiz} />;
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Top Breadcrumb & Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link to="/" className="hover:text-cyan-400 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/explore" className="hover:text-cyan-400 transition-colors">Explore</Link>
          <span>/</span>
          <Link to={`/explore/${concept.subject}`} className="hover:text-cyan-400 transition-colors capitalize">
            {concept.subjectName || concept.subject}
          </Link>
          <span>/</span>
          <span className="text-white font-medium">{concept.title}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/explore/${concept.subject}`)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to {concept.subjectName}</span>
          </button>

          <button
            onClick={goToQuiz}
            className="px-3 py-1.5 rounded-lg bg-purple-950/40 border border-purple-800/50 text-purple-300 hover:bg-purple-900/50 text-xs flex items-center gap-1.5 transition-colors"
          >
            <Award className="w-3.5 h-3.5 text-purple-400" />
            <span>Take Concept Quiz</span>
          </button>
        </div>
      </div>

      {/* Lab Header & Scientific Objective */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 flex items-center gap-1">
              <SubjectIcon className="w-3 h-3" />
              <span>{concept.category}</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              {concept.law}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {concept.title}
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            {concept.shortExplanation}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-right shrink-0">
          <p className="text-slate-500 text-[10px] uppercase">Governing Formula</p>
          <p className="text-cyan-300 font-bold text-sm mt-0.5">{concept.formula}</p>
        </div>
      </div>

      {/* Render the Active Interactive Simulation Component */}
      <div className="pt-2">
        {renderSimulation()}
      </div>
    </div>
  );
}
