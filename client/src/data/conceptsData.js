export const SUBJECTS_DATA = [
  {
    id: 'physics',
    name: 'Physics',
    icon: 'Atom',
    emoji: '⚛️',
    color: 'cyan',
    accentColor: '#00F0FF',
    route: '/explore/physics',
    description: 'Explore motion, electromagnetic fields, quantum waves, oscillations, and collisions through interactive 3D simulations.',
    simCount: 5
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    icon: 'FlaskConical',
    emoji: '🧪',
    color: 'emerald',
    accentColor: '#10B981',
    route: '/explore/chemistry',
    description: 'Understand molecular bonding, electron shell sharing/transfer, and chemical reaction energy kinetics through interactive experiments.',
    simCount: 2
  },
  {
    id: 'mathematics',
    name: 'Mathematics',
    icon: 'Binary',
    emoji: '📐',
    color: 'purple',
    accentColor: '#A855F7',
    route: '/explore/mathematics',
    description: 'Visualize mathematical network structures, graph pathfinding algorithms, and 3D vector linear algebra interactively.',
    simCount: 2
  },
  {
    id: 'biology',
    name: 'Biology',
    icon: 'Dna',
    emoji: '🧬',
    color: 'rose',
    accentColor: '#F43F5E',
    route: '/explore/biology',
    description: 'Explore human biomechanics, antagonistic muscle-joint movements, and the 4-chamber cardiac cycle through interactive anatomical models.',
    simCount: 2
  }
];

export const CONCEPTS_DATA = [
  // ================= PHYSICS (5 MODULES) =================
  {
    id: 'projectile-circular-motion',
    slug: 'projectile-circular-motion',
    subject: 'physics',
    subjectName: 'Physics',
    title: 'Projectile & Circular Motion',
    category: 'Classical Mechanics',
    formula: 'R = (v₀² · sin(2θ)) / g  |  a_c = v² / r',
    law: 'Newtonian Kinematics & Centripetal Acceleration',
    shortExplanation: 'Investigate ballistic projectile trajectories with air gravity alongside uniform circular and orbital motion dynamics in real time.',
    difficulty: 'Fundamental',
    iconName: 'Orbit',
    route: '/lab/projectile-circular-motion',
    tags: ['Trajectory', 'Centripetal Force', 'Angular Velocity', 'Gravity', 'Kinematics'],
    defaultParameters: {
      velocity: 25,
      angle: 45,
      gravity: 9.8,
      radius: 10,
      angularVelocity: 3
    }
  },
  {
    id: 'electric-magnetic-fields',
    slug: 'electric-magnetic-fields',
    subject: 'physics',
    subjectName: 'Physics',
    title: 'Electric & Magnetic Fields',
    category: 'Electromagnetism',
    formula: 'E = k·q/r²  |  B = μ₀·I/(2πr)  |  ℰ = -N(dΦ_B/dt)',
    law: "Coulomb, Biot-Savart & Faraday's Law",
    shortExplanation: 'Visualize 3D electric dipole field lines, current-carrying wire magnetic loops, and dynamic Electromagnetic Induction with moving bar magnets.',
    difficulty: 'Advanced',
    iconName: 'Zap',
    route: '/lab/electric-magnetic-fields',
    tags: ['Field Lines', 'Coulomb Force', 'Magnetic Induction', 'Flux', 'Lenz Law'],
    defaultParameters: {
      chargeA: 1.0,
      chargeB: -1.0,
      current: 4.0,
      magnetVelocity: 2.5,
      coilTurns: 6
    }
  },
  {
    id: 'wave-functions-pes',
    slug: 'wave-functions-pes',
    subject: 'physics',
    subjectName: 'Physics',
    title: 'Wave Functions & Potential Energy Surfaces',
    category: 'Quantum Physics',
    formula: 'P(x) = |ψ(x)|²  |  V(x) = ½kx²',
    law: 'Schrödinger Equation & Born Interpretation',
    shortExplanation: 'Visualize quantum wavefunctions ψ(x), spatial probability density |ψ(x)|², finite potential barrier tunneling, and energy eigenvalues.',
    difficulty: 'Advanced',
    iconName: 'Waves',
    route: '/lab/wave-functions-pes',
    tags: ['Probability Density', 'Potential Wells', 'Eigenstates', 'Quantum Tunneling'],
    defaultParameters: {
      quantumN: 2,
      barrierHeight: 3.5,
      wellWidth: 4.0
    }
  },
  {
    id: 'oscillation-resonance',
    slug: 'oscillation-resonance',
    subject: 'physics',
    subjectName: 'Physics',
    title: 'Oscillation & Resonance',
    category: 'Oscillations & Waves',
    formula: 'A(ω) = F₀ / √((ω₀² - ω²)² + (2γω)²)',
    law: 'Driven Damped Harmonic Motion',
    shortExplanation: 'Simulate a 3D mass-spring oscillator undergoing driving frequencies and observe sharp resonant amplitude amplification as ω approaches ω₀.',
    difficulty: 'Intermediate',
    iconName: 'Activity',
    route: '/lab/oscillation-resonance',
    tags: ['Resonance Peak', 'Damping Factor', 'Natural Frequency', 'Q Factor'],
    defaultParameters: {
      drivingFreq: 1.0,
      naturalFreq: 1.0,
      damping: 0.12
    }
  },
  {
    id: 'collision',
    slug: 'collision',
    subject: 'physics',
    subjectName: 'Physics',
    title: 'Collision Simulation',
    category: 'Classical Mechanics',
    formula: 'm₁v₁ + m₂v₂ = m₁v₁\' + m₂v₂\'  |  e = (v₂\' - v₁\')/(v₁ - v₂)',
    law: 'Conservation of Linear Momentum & Restitution',
    shortExplanation: 'Investigate elastic, partially elastic, and completely inelastic collisions with real-time momentum conservation and kinetic energy loss calculations.',
    difficulty: 'Fundamental',
    iconName: 'CircleDot',
    route: '/lab/collision',
    tags: ['Elastic Collision', 'Inelastic', 'Momentum Conservation', 'Restitution'],
    defaultParameters: {
      mass1: 3.0,
      mass2: 2.0,
      vel1: 4.0,
      vel2: -3.0,
      restitution: 1.0
    }
  },

  // ================= MATHEMATICS (2 MODULES) =================
  {
    id: 'graph-theory',
    slug: 'graph-theory',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    title: 'Graph Theory Simulator',
    category: 'Discrete Mathematics',
    formula: 'G = (V, E)  |  d(u, v) = min Σ w(e)',
    law: "Dijkstra's Algorithm, BFS & Network Traversal",
    shortExplanation: 'Create custom graph topologies, add/delete nodes and weighted edges, and run Dijkstra, BFS, and DFS pathfinding with step animations.',
    difficulty: 'Intermediate',
    iconName: 'Share2',
    route: '/lab/graph-theory',
    tags: ['Graph Traversal', 'Shortest Path', 'Dijkstra', 'BFS & DFS', 'Adjacency'],
    defaultParameters: {
      algorithm: 'dijkstra',
      directed: false
    }
  },
  {
    id: 'vectors-3d',
    slug: 'vectors-3d',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    title: '3D Vector Linear Algebra',
    category: 'Linear Algebra & Geometry',
    formula: 'A · B = |A||B| cos(θ)  |  A × B = |A||B| sin(θ) n̂',
    law: 'Vector Operations & Euclidean Space',
    shortExplanation: 'Manipulate 3D vectors interactively, observe real-time vector addition, subtraction, dot products, cross products, and geometric angle calculations.',
    difficulty: 'Fundamental',
    iconName: 'Compass',
    route: '/lab/vectors-3d',
    tags: ['Dot Product', 'Cross Product', 'Vector Addition', '3D Space', 'Projection'],
    defaultParameters: {
      ax: 3, ay: 2, az: 1,
      bx: 1, by: 4, bz: -2
    }
  },

  // ================= CHEMISTRY (2 MODULES) =================
  {
    id: 'chemical-bonding',
    slug: 'chemical-bonding',
    subject: 'chemistry',
    subjectName: 'Chemistry',
    title: 'Chemical Bonding Simulator',
    category: 'Inorganic & Molecular Chemistry',
    formula: 'ΔEN = |EN_A - EN_B|  |  Octet Rule',
    law: 'Ionic & Covalent Chemical Bond Formation',
    shortExplanation: 'Simulate valence electron transfers in ionic bonding (NaCl) and electron pair sharing in covalent molecules (H₂O, O₂, CH₄) with Lewis structures.',
    difficulty: 'Fundamental',
    iconName: 'FlaskConical',
    route: '/lab/chemical-bonding',
    tags: ['Ionic Bonds', 'Covalent Bonds', 'Valence Electrons', 'Lewis Structure', 'Octet Rule'],
    defaultParameters: {
      bondType: 'ionic',
      molecule: 'NaCl'
    }
  },
  {
    id: 'chemical-energy',
    slug: 'chemical-energy',
    subject: 'chemistry',
    subjectName: 'Chemistry',
    title: 'Chemical Energy Simulator',
    category: 'Physical Chemistry & Thermodynamics',
    formula: 'ΔH = Σ BE(Reactants) - Σ BE(Products)  |  k = A·e^(-E_a / RT)',
    law: 'Reaction Coordinates & Arrhenius Kinetics',
    shortExplanation: 'Explore exothermic and endothermic reaction coordinates, activation energy barriers (E_a), catalyst effects, and enthalpy changes (ΔH).',
    difficulty: 'Intermediate',
    iconName: 'Flame',
    route: '/lab/chemical-energy',
    tags: ['Exothermic', 'Endothermic', 'Activation Energy', 'Enthalpy ΔH', 'Catalyst'],
    defaultParameters: {
      reactionType: 'exothermic',
      activationEnergy: 45,
      temperature: 300
    }
  },

  // ================= BIOLOGY (2 MODULES) =================
  {
    id: 'muscle-movement',
    slug: 'muscle-movement',
    subject: 'biology',
    subjectName: 'Biology',
    title: 'Muscle Movement Simulator',
    category: 'Human Anatomy & Biomechanics',
    formula: 'Torque = F · r · sin(θ)  |  Antagonistic Muscle Pairs',
    law: 'Sliding Filament Theory & Musculoskeletal Mechanics',
    shortExplanation: 'Interact with an anatomical human arm model to explore antagonistic muscle pairs: biceps flexion and triceps extension across the elbow joint.',
    difficulty: 'Fundamental',
    iconName: 'Activity',
    route: '/lab/muscle-movement',
    tags: ['Biceps & Triceps', 'Elbow Joint', 'Tendon Pull', 'Biomechanics', 'Flexion'],
    defaultParameters: {
      bicepsContraction: 60,
      tricepsContraction: 10
    }
  },
  {
    id: 'heart',
    slug: 'heart',
    subject: 'biology',
    subjectName: 'Biology',
    title: 'Heart Working Simulator',
    category: 'Cardiovascular Physiology',
    formula: 'CO = HR · SV  |  Cardiac Cycle (Systole & Diastole)',
    law: 'Hemodynamics & 4-Chamber Heart Cycle',
    shortExplanation: 'Simulate the four chambers of the heart, oxygenated vs deoxygenated blood circulation, heart valves, and adjustable BPM with live ECG waveforms.',
    difficulty: 'Intermediate',
    iconName: 'Heart',
    route: '/lab/heart',
    tags: ['Atria & Ventricles', 'Heart Valves', 'Cardiac Cycle', 'ECG Rhythm', 'Oxygenation'],
    defaultParameters: {
      bpm: 75,
      viewMode: 'cross-section'
    }
  }
];
