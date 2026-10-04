export const QUIZZES_DATA = [
  // ================= PHYSICS QUIZZES =================
  {
    id: 'projectile-circular-motion',
    subject: 'physics',
    title: 'Projectile & Circular Motion Quiz',
    concept: 'Projectile & Circular Motion',
    questions: [
      {
        id: 1,
        question: 'At what launch angle (neglecting air resistance) is the horizontal range of a projectile maximized on flat ground?',
        options: ['30°', '45°', '60°', '90°'],
        correct: 1,
        explanation: 'Horizontal range R = (v₀² · sin(2θ)) / g. The term sin(2θ) reaches its maximum value of 1 when 2θ = 90°, meaning θ = 45°.'
      },
      {
        id: 2,
        question: 'At the apex (highest point) of a projectile’s parabolic trajectory, what is its vertical velocity component?',
        options: ['Equal to initial launch velocity', 'Equal to g', 'Exactly zero', 'Maximum negative value'],
        correct: 2,
        explanation: 'Gravity continually decelerates upward motion until the vertical velocity vy becomes 0 at the peak, before reversing downward.'
      },
      {
        id: 3,
        question: 'What happens to the centripetal force required to keep an object in circular motion if its tangential speed is doubled?',
        options: ['Remains the same', 'Doubles (2×)', 'Quadruples (4×)', 'Halves (0.5×)'],
        correct: 2,
        explanation: 'Centripetal force Fc = (m · v²) / r. Because force depends on the square of velocity, doubling v multiplies Fc by 2² = 4.'
      },
      {
        id: 4,
        question: 'In uniform circular motion, in what direction does the acceleration vector point?',
        options: ['Tangent to the circular path', 'Radially inward toward the center', 'Radially outward away from the center', 'Opposite to the velocity vector'],
        correct: 1,
        explanation: 'Centripetal acceleration always points radially inward toward the center of curvature, continually redirecting the velocity vector.'
      },
      {
        id: 5,
        question: 'How does doubling gravity (g) affect the total time of flight of a projectile with identical launch conditions?',
        options: ['Flight time doubles', 'Flight time is cut in half (½)', 'Flight time is multiplied by √2', 'Flight time remains unchanged'],
        correct: 1,
        explanation: 'Total flight time t = (2 · v₀ · sin(θ)) / g. Since time is inversely proportional to g, doubling g halves the flight time.'
      }
    ]
  },
  {
    id: 'electric-magnetic-fields',
    subject: 'physics',
    title: 'Electric & Magnetic Fields Quiz',
    concept: 'Electric & Magnetic Fields',
    questions: [
      {
        id: 1,
        question: 'According to Coulomb’s Law, what happens to electrostatic force when the distance between two point charges is halved?',
        options: ['Force decreases by 2×', 'Force increases by 2×', 'Force increases by 4×', 'Force remains constant'],
        correct: 2,
        explanation: 'Coulomb’s law states F = k·|q₁q₂| / r². Halving r (r/2) results in 1 / (½)² = 4 times the electrostatic force.'
      },
      {
        id: 2,
        question: 'In which direction do electric field lines emanate by universal convention?',
        options: ['Away from positive charges toward negative charges', 'Away from negative charges toward positive charges', 'Perpendicular to equipotential lines only', 'In closed circular loops'],
        correct: 0,
        explanation: 'Electric field lines represent the direction of force experienced by a positive test charge, thus originating on positive charges and terminating on negative charges.'
      },
      {
        id: 3,
        question: 'What is the shape of magnetic field lines produced by a long, straight current-carrying wire?',
        options: ['Radial lines pointing outward', 'Concentric circles centered on the wire', 'Hyperbolic curves', 'Helical corkscrews in all directions'],
        correct: 1,
        explanation: 'By the Right-Hand Rule and Ampère’s Law, magnetic field lines form concentric circular loops around the axis of the wire.'
      },
      {
        id: 4,
        question: 'According to Faraday’s Law, what must happen to induce an electromotive force (EMF) in a conducting coil?',
        options: ['The magnetic flux through the coil must change over time', 'The coil must be kept at absolute zero', 'A constant uniform magnetic field must be applied', 'The coil must be superconducting'],
        correct: 0,
        explanation: 'Faraday’s Law ℰ = -N(dΦ_B/dt) requires a non-zero time rate of change in magnetic flux (dΦ_B/dt ≠ 0) to induce EMF.'
      },
      {
        id: 5,
        question: 'What physical principle underlies the negative sign in Lenz’s Law?',
        options: ['Conservation of Electric Charge', 'Conservation of Energy', 'Heisenberg Uncertainty', 'Pauli Exclusion'],
        correct: 1,
        explanation: 'Lenz’s law ensures Conservation of Energy: the induced current produces an opposing field, preventing free perpetual kinetic energy generation.'
      }
    ]
  },
  {
    id: 'wave-functions-pes',
    subject: 'physics',
    title: 'Wave Functions & Potential Energy Surfaces Quiz',
    concept: 'Wave Functions & Potential Energy Surfaces',
    questions: [
      {
        id: 1,
        question: 'According to the Born rule, what does the quantity |ψ(x)|² represent physically?',
        options: ['The exact momentum of the particle', 'The probability density of finding the particle at position x', 'The kinetic energy of the wave packet', 'The speed of light in vacuum'],
        correct: 1,
        explanation: 'The Born interpretation states that the absolute square of the wavefunction |ψ(x)|² gives the spatial probability density of locating the particle at point x.'
      },
      {
        id: 2,
        question: 'In an infinite potential square well (particle in a box), what is the number of nodes inside the well for quantum state n = 3?',
        options: ['0 nodes', '1 node', '2 nodes', '3 nodes'],
        correct: 2,
        explanation: 'For an infinite square well, the number of internal nodes (where ψ(x) = 0) is given by n - 1. For n = 3, there are 3 - 1 = 2 internal nodes.'
      },
      {
        id: 3,
        question: 'What quantum mechanical phenomenon allows a particle to appear on the other side of a potential energy barrier higher than its total energy?',
        options: ['Quantum Hall Effect', 'Quantum Tunneling', 'Photoelectric Emission', 'Compton Scattering'],
        correct: 1,
        explanation: 'Quantum tunneling occurs because the wavefunction exponentially decays within a finite barrier rather than abruptly terminating at zero, yielding a non-zero transmission probability.'
      },
      {
        id: 4,
        question: 'What is the shape of the potential energy surface V(x) for a simple quantum harmonic oscillator?',
        options: ['Square step function', 'Parabolic well: V(x) = ½kx²', 'Linear ramp', 'Coulomb 1/r singularity'],
        correct: 1,
        explanation: 'The harmonic oscillator potential is parabolic: V(x) = ½kx² = ½mω²x², giving rise to equally spaced quantized energy levels En = (n + ½)ℏω.'
      },
      {
        id: 5,
        question: 'Why must a physical wavefunction ψ(x) be normalized so that ∫|ψ(x)|² dx = 1?',
        options: ['To conserve electric charge', 'Because the total probability of finding the particle anywhere in space must equal 100% (1)', 'To satisfy relativistic invariance', 'To force the wavelength to be positive'],
        correct: 1,
        explanation: 'Since the particle must exist somewhere in the universe, the sum of all probabilities over all space must be exactly 1.'
      }
    ]
  },
  {
    id: 'oscillation-resonance',
    subject: 'physics',
    title: 'Oscillation & Resonance Quiz',
    concept: 'Oscillation & Resonance',
    questions: [
      {
        id: 1,
        question: 'Under what condition does mechanical resonance occur in a driven oscillator?',
        options: ['When damping is infinite', 'When the driving frequency equals or approaches the natural frequency (ω ≈ ω₀)', 'When initial displacement is zero', 'When spring constant k is negative'],
        correct: 1,
        explanation: 'Resonance occurs when the external periodic driving frequency matches the system’s natural frequency, resulting in maximum energy transfer and peak amplitude.'
      },
      {
        id: 2,
        question: 'How does increasing the damping coefficient (γ) affect the amplitude response curve at resonance?',
        options: ['The peak becomes infinitely sharp and taller', 'The peak becomes broader and lower in height', 'The natural frequency shifts to infinity', 'No effect on amplitude'],
        correct: 1,
        explanation: 'Higher damping dissipates mechanical energy faster, lowering the peak resonant amplitude and broadening the bandwidth of the resonance curve.'
      },
      {
        id: 3,
        question: 'What is the natural angular frequency ω₀ of a simple mass-spring system with mass m and spring stiffness k?',
        options: ['ω₀ = k · m', 'ω₀ = √(k / m)', 'ω₀ = √(m / k)', 'ω₀ = 2π · k / m'],
        correct: 1,
        explanation: 'From Hooke’s law and Newton’s 2nd law (-kx = m·ẍ), the natural frequency is ω₀ = √(k / m).'
      },
      {
        id: 4,
        question: 'What is the phase difference between the driving force and oscillator displacement exactly at resonance (ω = ω₀)?',
        options: ['0° (in-phase)', '90° (π/2 radians)', '180° (π radians)', '270°'],
        correct: 1,
        explanation: 'At resonance, the displacement lags behind the driving force by exactly 90° (π/2), which means the driving force is perfectly in-phase with velocity.'
      },
      {
        id: 5,
        question: 'What does a high Quality Factor (Q) indicate about an oscillating system?',
        options: ['The system has extremely heavy damping and low energy retention', 'The system has low damping, sharp resonance, and stores energy efficiently', 'The system cannot oscillate', 'The system is non-linear'],
        correct: 1,
        explanation: 'Quality factor Q = ω₀ / (2γ). High Q implies minimal energy loss per cycle and a sharp, high-amplitude resonance curve.'
      }
    ]
  },
  {
    id: 'collision',
    subject: 'physics',
    title: 'Collision Simulation Quiz',
    concept: 'Collision Simulation',
    questions: [
      {
        id: 1,
        question: 'In an isolated system with no external forces, what quantity is ALWAYS conserved in both elastic and inelastic collisions?',
        options: ['Kinetic Energy', 'Total Linear Momentum', 'Mechanical Sound Energy', 'Angular Displacement'],
        correct: 1,
        explanation: 'By Newton’s third law (action and reaction forces balance out), total linear momentum is conserved in all collisions regardless of elasticity.'
      },
      {
        id: 2,
        question: 'What is the coefficient of restitution (e) for a perfectly elastic collision?',
        options: ['e = 0', 'e = 0.5', 'e = 1.0', 'e = -1.0'],
        correct: 2,
        explanation: 'For a perfectly elastic collision, kinetic energy is completely conserved and the relative speed of separation equals the relative speed of approach, so e = 1.0.'
      },
      {
        id: 3,
        question: 'What defines a completely inelastic collision?',
        options: ['Both objects bounce with increased kinetic energy', 'The colliding objects stick together and move with a common final velocity (e = 0)', 'One object stops and the other reverses', 'No momentum is transferred'],
        correct: 1,
        explanation: 'In a perfectly inelastic collision (e = 0), the maximum possible kinetic energy is dissipated and the colliding masses latch together into a single moving body.'
      },
      {
        id: 4,
        question: 'Object A (mass 2 kg, velocity +4 m/s) collides elastically with identical stationary Object B (mass 2 kg, velocity 0 m/s). What are the final velocities?',
        options: ['vA = +4 m/s, vB = 0 m/s', 'vA = 0 m/s, vB = +4 m/s', 'Both move forward at +2 m/s', 'Both bounce backward at -2 m/s'],
        correct: 1,
        explanation: 'In an elastic collision between equal masses where one is at rest, they completely swap velocities: Object A comes to a complete halt, and Object B moves forward at +4 m/s.'
      },
      {
        id: 5,
        question: 'Where does the lost kinetic energy go during an inelastic collision?',
        options: ['Destroyed completely from the universe', 'Converted into internal thermal energy, sound, and material deformation', 'Stored as nuclear potential', 'Reflected as gravitational waves'],
        correct: 1,
        explanation: 'Total energy is conserved: the decrease in macroscopic kinetic energy is converted into microscopic thermal vibration (heat), acoustic vibrations (sound), and permanent plastic deformation.'
      }
    ]
  },

  // ================= MATHEMATICS QUIZZES =================
  {
    id: 'graph-theory',
    subject: 'mathematics',
    title: 'Graph Theory Quiz',
    concept: 'Graph Theory Simulator',
    questions: [
      {
        id: 1,
        question: 'In graph theory, what is the degree of a node (vertex)?',
        options: ['The geometric length of its edges', 'The number of edges connected to that node', 'The coordinate angle in 2D space', 'The color assignment in graph coloring'],
        correct: 1,
        explanation: 'The degree of a vertex v is the number of edges incident to v (with self-loops counting twice).'
      },
      {
        id: 2,
        question: 'Which famous algorithm finds the shortest path between nodes in a weighted graph with non-negative edge weights?',
        options: ['Bubble Sort', 'Dijkstra’s Algorithm', 'Binary Search', 'Linear Regression'],
        correct: 1,
        explanation: 'Dijkstra’s algorithm greedily explores the nearest unvisited nodes to compute the minimum cumulative distance from a source vertex.'
      },
      {
        id: 3,
        question: 'What is a connected graph called if it contains no cycles and has exactly (V - 1) edges for V vertices?',
        options: ['Complete Graph', 'Tree', 'Bipartite Graph', 'Directed Acyclic Graph with cycles'],
        correct: 1,
        explanation: 'A connected acyclic graph is mathematically defined as a tree, which always has exactly V - 1 edges.'
      },
      {
        id: 4,
        question: 'What data structure is typically used to implement Breadth-First Search (BFS) in graph traversal?',
        options: ['Stack (LIFO)', 'Queue (FIFO)', 'Heap only', 'Static Array'],
        correct: 1,
        explanation: 'BFS explores vertices layer-by-layer using a First-In-First-Out (FIFO) Queue to visit all immediate neighbors before delving deeper.'
      },
      {
        id: 5,
        question: 'What is the maximum number of edges in a simple undirected graph with V vertices?',
        options: ['V · (V - 1)', 'V · (V - 1) / 2', 'V²', '2 · V'],
        correct: 1,
        explanation: 'In a complete graph K_V, each of the V vertices connects to every other (V - 1) vertex, giving V(V - 1) / 2 unique undirected edges.'
      }
    ]
  },
  {
    id: 'vectors-3d',
    subject: 'mathematics',
    title: '3D Vector Linear Algebra Quiz',
    concept: '3D Vector Linear Algebra',
    questions: [
      {
        id: 1,
        question: 'What does the dot product (scalar product) of two non-zero orthogonal (perpendicular) vectors equal?',
        options: ['1', '0', '-1', 'Infinity'],
        correct: 1,
        explanation: 'The dot product A · B = |A||B| cos(θ). Since cos(90°) = 0, the dot product of any two perpendicular vectors is always 0.'
      },
      {
        id: 2,
        question: 'What geometric orientation does the cross product A × B have relative to vectors A and B?',
        options: ['Parallel to vector A', 'Perpendicular (orthogonal) to the plane containing both A and B', 'Opposite to vector B', 'Always along the Z axis'],
        correct: 1,
        explanation: 'By the right-hand rule, the cross product A × B yields a new vector that is strictly perpendicular to both input vectors A and B.'
      },
      {
        id: 3,
        question: 'How is the Euclidean magnitude of a 3D vector V = (x, y, z) calculated?',
        options: ['|V| = x + y + z', '|V| = √(x² + y² + z²)', '|V| = x · y · z', '|V| = (x² + y² + z²)²'],
        correct: 1,
        explanation: 'By the 3D Pythagorean theorem, the distance from the origin to (x, y, z) is |V| = √(x² + y² + z²).'
      },
      {
        id: 4,
        question: 'If vector A = (2, 0, -1) and vector B = (1, 3, 4), what is their vector sum A + B?',
        options: ['(3, 3, 3)', '(1, -3, -5)', '(2, 0, -4)', '(3, 3, 5)'],
        correct: 0,
        explanation: 'Vector addition is performed component-wise: (2+1, 0+3, -1+4) = (3, 3, 3).'
      },
      {
        id: 5,
        question: 'What property describes the cross product operation under vector swapping (A × B vs B × A)?',
        options: ['Commutative: A × B = B × A', 'Anti-commutative: A × B = -(B × A)', 'Associative with scalars only', 'Identity invariant'],
        correct: 1,
        explanation: 'Swapping the order of vectors in a cross product reverses the direction of the resulting normal vector: A × B = -(B × A).'
      }
    ]
  },

  // ================= CHEMISTRY QUIZZES =================
  {
    id: 'chemical-bonding',
    subject: 'chemistry',
    title: 'Chemical Bonding Quiz',
    concept: 'Chemical Bonding Simulator',
    questions: [
      {
        id: 1,
        question: 'What fundamental process occurs between atoms during the formation of an ionic bond (such as in NaCl)?',
        options: ['Equal sharing of valence electrons', 'Complete transfer of one or more valence electrons from metal to nonmetal', 'Formation of metallic electron sea', 'Nuclear fusion of atomic cores'],
        correct: 1,
        explanation: 'Sodium (Na) transfers its 1 valence electron to chlorine (Cl), creating Na⁺ and Cl⁻ ions held together by strong electrostatic attraction.'
      },
      {
        id: 2,
        question: 'How many pairs of electrons are shared between the two oxygen atoms in an oxygen molecule (O₂)?',
        options: ['1 shared pair (single bond)', '2 shared pairs (double bond)', '3 shared pairs (triple bond)', '4 shared pairs'],
        correct: 1,
        explanation: 'Each oxygen atom has 6 valence electrons and needs 2 more to satisfy the octet rule, so they share two electron pairs forming a covalent double bond (O=O).'
      },
      {
        id: 3,
        question: 'According to the Octet Rule, main-group atoms generally form bonds until their outermost valence shell contains how many electrons?',
        options: ['2 electrons', '4 electrons', '8 electrons', '18 electrons'],
        correct: 2,
        explanation: 'The octet rule reflects the stable electronic configuration of noble gases (ns² np⁶), consisting of 8 valence electrons.'
      },
      {
        id: 4,
        question: 'Why is a water molecule (H₂O) classified as polar covalent rather than non-polar?',
        options: ['Hydrogen and Oxygen have identical electronegativities', 'Oxygen has much higher electronegativity and the bent geometry creates a net dipole moment', 'Electrons are completely transferred to hydrogen', 'Water is an ionic crystal'],
        correct: 1,
        explanation: 'Oxygen (electronegativity 3.44) pulls shared electrons closer than hydrogen (2.20), and the bent molecular geometry prevents dipole vectors from canceling.'
      },
      {
        id: 5,
        question: 'What energy change occurs when chemical bonds are formed between separated gaseous atoms?',
        options: ['Energy is absorbed (endothermic)', 'Energy is released (exothermic)', 'Energy remains exactly zero', 'Activation energy doubles'],
        correct: 1,
        explanation: 'Bond formation is always an exothermic process: atoms fall into a lower potential energy well, releasing bond energy as heat/photons.'
      }
    ]
  },
  {
    id: 'chemical-energy',
    subject: 'chemistry',
    title: 'Chemical Energy Quiz',
    concept: 'Chemical Energy Simulator',
    questions: [
      {
        id: 1,
        question: 'What is the sign of the enthalpy change (ΔH) for an exothermic chemical reaction?',
        options: ['ΔH > 0 (Positive)', 'ΔH < 0 (Negative)', 'ΔH = 0', 'ΔH is imaginary'],
        correct: 1,
        explanation: 'In an exothermic reaction, the products have lower potential energy than the reactants, releasing net heat to the surroundings, meaning ΔH is negative.'
      },
      {
        id: 2,
        question: 'What is activation energy (E_a) in a chemical reaction coordinate diagram?',
        options: ['The total heat of combustion', 'The minimum energy barrier reactant molecules must overcome to form the transition state', 'The equilibrium constant of the reaction', 'The energy difference between reactants and products'],
        correct: 1,
        explanation: 'Activation energy is the kinetic threshold required to distort electron clouds and break initial bonds to reach the activated transition state.'
      },
      {
        id: 3,
        question: 'How does the addition of a chemical catalyst speed up the rate of a chemical reaction?',
        options: ['It increases the temperature of the system', 'It makes the reaction more endothermic', 'It provides an alternative reaction pathway with a lower activation energy', 'It increases the enthalpy change ΔH'],
        correct: 2,
        explanation: 'A catalyst lowers the activation energy barrier without altering the overall thermodynamic enthalpy change (ΔH) or getting consumed in the reaction.'
      },
      {
        id: 4,
        question: 'In an endothermic reaction (such as photosynthesis or thermal decomposition), which statement is true?',
        options: ['Energy of products is higher than energy of reactants', 'Energy of reactants is higher than energy of products', 'Surroundings become extremely hot', 'No activation energy is needed'],
        correct: 0,
        explanation: 'Endothermic reactions absorb net thermal energy from the surroundings, resulting in products that possess higher chemical potential energy than reactants.'
      },
      {
        id: 5,
        question: 'According to the Arrhenius equation k = A·e^(-E_a / RT), what happens to reaction rate when temperature (T) increases?',
        options: ['The rate constant k decreases exponentially', 'The rate constant k increases because a higher fraction of collisions exceed E_a', 'The activation energy E_a decreases', 'The frequency factor A drops to zero'],
        correct: 1,
        explanation: 'Higher temperature increases average molecular kinetic energy, exponentially multiplying the proportion of collisions possessing energy greater than E_a.'
      }
    ]
  },

  // ================= BIOLOGY QUIZZES =================
  {
    id: 'muscle-movement',
    subject: 'biology',
    title: 'Muscle Movement Simulator Quiz',
    concept: 'Muscle Movement Simulator',
    questions: [
      {
        id: 1,
        question: 'In human arm biomechanics, why are the biceps and triceps referred to as an "antagonistic muscle pair"?',
        options: ['They always contract simultaneously to lock the elbow', 'They perform opposing actions: biceps flexes the elbow while triceps extends it', 'They are both attached to the same tendon', 'One is involuntary while the other is voluntary'],
        correct: 1,
        explanation: 'Muscles can only pull, not push. Therefore, the biceps pulls to bend (flex) the arm, while the opposing triceps pulls to straighten (extend) it.'
      },
      {
        id: 2,
        question: 'What connective tissue structure anchors skeletal muscle firmly to bone?',
        options: ['Ligament', 'Tendon', 'Cartilage', 'Synovial fluid'],
        correct: 1,
        explanation: 'Tendons attach muscles to bones, transmitting tensile force across joints. (Ligaments connect bone to bone).'
      },
      {
        id: 3,
        question: 'According to the Sliding Filament Theory, which microscopic protein filaments slide past each other during muscle contraction?',
        options: ['Keratin and Collagen', 'Actin and Myosin', 'Hemoglobin and Myoglobin', 'Tubulin and Dynein'],
        correct: 1,
        explanation: 'Myosin cross-bridges bind to actin thin filaments and perform the power stroke, shortening sarcomeres during muscle contraction.'
      },
      {
        id: 4,
        question: 'What ion is released from the sarcoplasmic reticulum to trigger muscle contraction upon nerve excitation?',
        options: ['Sodium (Na⁺)', 'Potassium (K⁺)', 'Calcium (Ca²⁺)', 'Chloride (Cl⁻)'],
        correct: 2,
        explanation: 'Action potentials trigger Ca²⁺ release, which binds to troponin, causing tropomyosin to shift and exposing actin binding sites to myosin heads.'
      },
      {
        id: 5,
        question: 'What type of synovial joint is the human elbow, and what primary movements does it permit?',
        options: ['Ball-and-socket joint allowing 360° rotation', 'Hinge joint permitting flexion and extension in a single plane', 'Pivot joint only', 'Saddle joint'],
        correct: 1,
        explanation: 'The humeroulnar joint of the elbow is a classic hinge joint, allowing rotational movement primarily around a single transverse axis (bending and straightening).'
      }
    ]
  },
  {
    id: 'heart',
    subject: 'biology',
    title: 'Heart Working Simulator Quiz',
    concept: 'Heart Working Simulator',
    questions: [
      {
        id: 1,
        question: 'Which chamber of the human heart receives deoxygenated blood returning from the systemic circulation via the vena cava?',
        options: ['Left Atrium', 'Left Ventricle', 'Right Atrium', 'Right Ventricle'],
        correct: 2,
        explanation: 'Oxygen-depleted blood from body tissues enters the Right Atrium, which then pumps it through the tricuspid valve into the Right Ventricle.'
      },
      {
        id: 2,
        question: 'Why does the Left Ventricle have a significantly thicker, more muscular myocardium wall than the Right Ventricle?',
        options: ['It stores more blood volume', 'It must generate high pressure to pump oxygenated blood throughout the entire systemic body circulation', 'It receives blood directly from the lungs', 'It lacks heart valves'],
        correct: 1,
        explanation: 'The right ventricle only pumps blood nearby to the low-resistance lungs (pulmonary circuit), whereas the left ventricle must pump blood throughout the high-resistance systemic circuit.'
      },
      {
        id: 3,
        question: 'What is the physiological function of heart valves (such as tricuspid and mitral valves)?',
        options: ['To oxygenate blood as it flows through', 'To prevent backward backflow of blood, ensuring strictly unidirectional circulation', 'To generate electrical pacemaker impulses', 'To regulate blood temperature'],
        correct: 1,
        explanation: 'Atrioventricular and semilunar valves open and close in response to pressure differentials, guaranteeing blood flows in only one direction.'
      },
      {
        id: 4,
        question: 'During which phase of the cardiac cycle do the ventricles contract, pumping blood into the pulmonary artery and aorta?',
        options: ['Atrial diastole', 'Ventricular systole', 'Ventricular diastole', 'Resting depolarization'],
        correct: 1,
        explanation: 'Systole refers to contraction (specifically ventricular systole pumps blood into circulation), while diastole refers to ventricular relaxation and refilling.'
      },
      {
        id: 5,
        question: 'What specialized group of cells in the right atrium acts as the natural pacemaker of the heart by generating rhythmic electrical impulses?',
        options: ['Sinoatrial (SA) Node', 'Atrioventricular (AV) Node', 'Bundle of His', 'Purkinje Fibers'],
        correct: 0,
        explanation: 'The Sinoatrial (SA) node spontaneously depolarizes to initiate each heartbeat rhythm, establishing normal sinus rhythm.'
      }
    ]
  }
];
