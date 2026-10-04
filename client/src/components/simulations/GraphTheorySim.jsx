import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  RotateCcw, 
  Plus, 
  Trash2, 
  ArrowRight, 
  Share2, 
  Sparkles, 
  HelpCircle, 
  Navigation,
  Compass,
  CheckCircle2
} from 'lucide-react';

const INITIAL_NODES = [
  { id: 'A', x: 120, y: 180 },
  { id: 'B', x: 260, y: 90 },
  { id: 'C', x: 260, y: 270 },
  { id: 'D', x: 400, y: 90 },
  { id: 'E', x: 400, y: 270 },
  { id: 'F', x: 540, y: 180 },
];

const INITIAL_EDGES = [
  { id: 'e1', from: 'A', to: 'B', weight: 4 },
  { id: 'e2', from: 'A', to: 'C', weight: 2 },
  { id: 'e3', from: 'B', to: 'C', weight: 1 },
  { id: 'e4', from: 'B', to: 'D', weight: 5 },
  { id: 'e5', from: 'C', to: 'E', weight: 8 },
  { id: 'e6', from: 'C', to: 'D', weight: 10 },
  { id: 'e7', from: 'D', to: 'E', weight: 2 },
  { id: 'e8', from: 'D', to: 'F', weight: 6 },
  { id: 'e9', from: 'E', to: 'F', weight: 3 },
];

export default function GraphTheorySim({ onQuizClick }) {
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const [edges, setEdges] = useState(INITIAL_EDGES);

  const [selectedNode, setSelectedNode] = useState('A');
  const [targetNode, setTargetNode] = useState('F');
  const [edgeSource, setEdgeSource] = useState('A');
  const [edgeTarget, setEdgeTarget] = useState('D');
  const [edgeWeight, setEdgeWeight] = useState(3);
  const [isDirected, setIsDirected] = useState(false);

  const [algorithm, setAlgorithm] = useState('dijkstra'); // 'dijkstra' | 'bfs' | 'dfs'
  const [activeStep, setActiveStep] = useState(0);
  const [visitedNodes, setVisitedNodes] = useState([]);
  const [shortestPathEdges, setShortestPathEdges] = useState([]);
  const [pathNodes, setPathNodes] = useState([]);
  const [pathCost, setPathCost] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  // Dragging support for SVG nodes
  const [draggingNode, setDraggingNode] = useState(null);
  const svgRef = useRef(null);

  const handleMouseDownNode = (id, e) => {
    e.stopPropagation();
    setDraggingNode(id);
    setSelectedNode(id);
  };

  const handleMouseMove = (e) => {
    if (!draggingNode || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = Math.max(30, Math.min(rect.width - 30, e.clientX - rect.left));
    const y = Math.max(30, Math.min(rect.height - 30, e.clientY - rect.top));

    setNodes((prev) =>
      prev.map((n) => (n.id === draggingNode ? { ...n, x, y } : n))
    );
  };

  const handleMouseUp = () => {
    setDraggingNode(null);
  };

  // Node Management
  const addNode = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const existingIds = new Set(nodes.map((n) => n.id));
    let nextId = '';
    for (let char of letters) {
      if (!existingIds.has(char)) {
        nextId = char;
        break;
      }
    }
    if (!nextId) nextId = `N${nodes.length + 1}`;

    const newNode = {
      id: nextId,
      x: 100 + Math.random() * 400,
      y: 80 + Math.random() * 200,
    };
    setNodes((prev) => [...prev, newNode]);
    resetAlgorithmState();
  };

  const deleteNode = (idToDelete) => {
    setNodes((prev) => prev.filter((n) => n.id !== idToDelete));
    setEdges((prev) => prev.filter((e) => e.from !== idToDelete && e.to !== idToDelete));
    if (selectedNode === idToDelete) setSelectedNode(nodes.find((n) => n.id !== idToDelete)?.id || '');
    if (targetNode === idToDelete) setTargetNode(nodes.find((n) => n.id !== idToDelete)?.id || '');
    resetAlgorithmState();
  };

  // Edge Management
  const addEdge = () => {
    if (edgeSource === edgeTarget) return;
    const exists = edges.some(
      (e) =>
        (e.from === edgeSource && e.to === edgeTarget) ||
        (!isDirected && e.from === edgeTarget && e.to === edgeSource)
    );
    if (!exists) {
      const newEdge = {
        id: `e_${Date.now()}`,
        from: edgeSource,
        to: edgeTarget,
        weight: Number(edgeWeight) || 1,
      };
      setEdges((prev) => [...prev, newEdge]);
      resetAlgorithmState();
    }
  };

  const deleteEdge = (edgeId) => {
    setEdges((prev) => prev.filter((e) => e.id !== edgeId));
    resetAlgorithmState();
  };

  const resetAlgorithmState = () => {
    setVisitedNodes([]);
    setShortestPathEdges([]);
    setPathNodes([]);
    setPathCost(null);
    setLogs([]);
    setIsRunning(false);
  };

  const resetGraph = () => {
    setNodes(INITIAL_NODES);
    setEdges(INITIAL_EDGES);
    setSelectedNode('A');
    setTargetNode('F');
    resetAlgorithmState();
  };

  // ================= ALGORITHM IMPLEMENTATIONS =================
  const runAlgorithm = () => {
    if (!selectedNode || !targetNode) return;
    resetAlgorithmState();
    setIsRunning(true);

    if (algorithm === 'dijkstra') {
      runDijkstra();
    } else if (algorithm === 'bfs') {
      runBFS();
    } else if (algorithm === 'dfs') {
      runDFS();
    }
  };

  // Dijkstra's Algorithm
  const runDijkstra = () => {
    const distances = {};
    const previous = {};
    const unvisited = new Set(nodes.map((n) => n.id));
    const visitedOrder = [];
    const stepLogs = [];

    nodes.forEach((n) => {
      distances[n.id] = Infinity;
      previous[n.id] = null;
    });
    distances[selectedNode] = 0;

    stepLogs.push(`Initialized Dijkstra starting at source node ${selectedNode}.`);

    while (unvisited.size > 0) {
      // Find unvisited node with min distance
      let current = null;
      let minDistance = Infinity;

      unvisited.forEach((id) => {
        if (distances[id] < minDistance) {
          minDistance = distances[id];
          current = id;
        }
      });

      if (current === null || minDistance === Infinity) break;

      unvisited.delete(current);
      visitedOrder.push(current);
      stepLogs.push(`Visiting node ${current} (Current known distance: ${distances[current]}).`);

      if (current === targetNode) {
        stepLogs.push(`Target node ${targetNode} reached! Shortest path confirmed.`);
        break;
      }

      // Check neighbors
      const neighbors = edges.filter((e) => {
        if (isDirected) return e.from === current;
        return e.from === current || e.to === current;
      });

      neighbors.forEach((e) => {
        const neighbor = e.from === current ? e.to : e.from;
        if (unvisited.has(neighbor)) {
          const alt = distances[current] + e.weight;
          if (alt < distances[neighbor]) {
            distances[neighbor] = alt;
            previous[neighbor] = current;
            stepLogs.push(`Updated distance to node ${neighbor}: ${alt} (via edge weight ${e.weight}).`);
          }
        }
      });
    }

    // Reconstruct path
    const path = [];
    let curr = targetNode;
    while (curr) {
      path.unshift(curr);
      curr = previous[curr];
    }

    const finalPath = path[0] === selectedNode ? path : [];
    const pathEdgeIds = [];
    for (let i = 0; i < finalPath.length - 1; i++) {
      const u = finalPath[i];
      const v = finalPath[i + 1];
      const matchingEdge = edges.find(
        (e) => (e.from === u && e.to === v) || (!isDirected && e.from === v && e.to === u)
      );
      if (matchingEdge) pathEdgeIds.push(matchingEdge.id);
    }

    setVisitedNodes(visitedOrder);
    setPathNodes(finalPath);
    setShortestPathEdges(pathEdgeIds);
    setPathCost(distances[targetNode] !== Infinity ? distances[targetNode] : 'No path');
    setLogs(stepLogs);
    setIsRunning(false);
  };

  // Breadth-First Search (BFS)
  const runBFS = () => {
    const queue = [selectedNode];
    const visited = new Set([selectedNode]);
    const visitedOrder = [];
    const parent = {};
    const stepLogs = [`Started BFS from ${selectedNode}.`];

    while (queue.length > 0) {
      const current = queue.shift();
      visitedOrder.push(current);
      stepLogs.push(`Explored node ${current}.`);

      if (current === targetNode) {
        stepLogs.push(`Found target node ${targetNode}!`);
        break;
      }

      const neighbors = edges
        .filter((e) => (isDirected ? e.from === current : e.from === current || e.to === current))
        .map((e) => (e.from === current ? e.to : e.from));

      neighbors.forEach((nbr) => {
        if (!visited.has(nbr)) {
          visited.add(nbr);
          parent[nbr] = current;
          queue.push(nbr);
          stepLogs.push(`Enqueued neighbor ${nbr}.`);
        }
      });
    }

    // Path
    const path = [];
    let curr = targetNode;
    while (curr) {
      path.unshift(curr);
      curr = parent[curr];
    }
    const finalPath = path[0] === selectedNode ? path : [];

    setVisitedNodes(visitedOrder);
    setPathNodes(finalPath);
    setPathCost(`${finalPath.length - 1} hops`);
    setLogs(stepLogs);
    setIsRunning(false);
  };

  // Depth-First Search (DFS)
  const runDFS = () => {
    const visited = new Set();
    const visitedOrder = [];
    const parent = {};
    const stepLogs = [`Started DFS from ${selectedNode}.`];

    const dfs = (u) => {
      visited.add(u);
      visitedOrder.push(u);
      stepLogs.push(`Visiting node ${u}.`);

      if (u === targetNode) return true;

      const neighbors = edges
        .filter((e) => (isDirected ? e.from === u : e.from === u || e.to === u))
        .map((e) => (e.from === u ? e.to : e.from));

      for (let nbr of neighbors) {
        if (!visited.has(nbr)) {
          parent[nbr] = u;
          if (dfs(nbr)) return true;
        }
      }
      return false;
    };

    dfs(selectedNode);

    const path = [];
    let curr = targetNode;
    while (curr) {
      path.unshift(curr);
      curr = parent[curr];
    }
    const finalPath = path[0] === selectedNode ? path : [];

    setVisitedNodes(visitedOrder);
    setPathNodes(finalPath);
    setPathCost(`${finalPath.length - 1} hops`);
    setLogs(stepLogs);
    setIsRunning(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Ribbon */}
      <div className="flex flex-wrap items-center justify-between p-3 rounded-2xl bg-slate-900/80 border border-slate-800 gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Algorithm:</span>
          <button
            onClick={() => { setAlgorithm('dijkstra'); resetAlgorithmState(); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              algorithm === 'dijkstra'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Dijkstra Shortest Path
          </button>
          <button
            onClick={() => { setAlgorithm('bfs'); resetAlgorithmState(); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              algorithm === 'bfs'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Breadth-First Search (BFS)
          </button>
          <button
            onClick={() => { setAlgorithm('dfs'); resetAlgorithmState(); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              algorithm === 'dfs'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Depth-First Search (DFS)
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={runAlgorithm}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-md flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Run {algorithm.toUpperCase()}</span>
          </button>

          <button
            onClick={resetGraph}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Graph</span>
          </button>
        </div>
      </div>

      {/* Main Graph Canvas & Editor Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive SVG Graph Canvas */}
        <div className="lg:col-span-8 space-y-4">
          <div
            className="relative w-full h-[440px] rounded-2xl overflow-hidden bg-[#070A12] border border-slate-800 shadow-2xl select-none"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            {/* SVG Renderer */}
            <svg ref={svgRef} className="w-full h-full cursor-crosshair">
              {/* Define Arrowheads for Directed Mode */}
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="8"
                  markerHeight="6"
                  refX="18"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0, 8 3, 0 6" fill="#64748B" />
                </marker>
                <marker
                  id="arrowhead-active"
                  markerWidth="8"
                  markerHeight="6"
                  refX="18"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0, 8 3, 0 6" fill="#00F0FF" />
                </marker>
              </defs>

              {/* Render Edges */}
              {edges.map((e) => {
                const u = nodes.find((n) => n.id === e.from);
                const v = nodes.find((n) => n.id === e.to);
                if (!u || !v) return null;

                const isShortestPath = shortestPathEdges.includes(e.id);
                const midX = (u.x + v.x) / 2;
                const midY = (u.y + v.y) / 2;

                return (
                  <g key={e.id}>
                    <line
                      x1={u.x}
                      y1={u.y}
                      x2={v.x}
                      y2={v.y}
                      stroke={isShortestPath ? '#00F0FF' : '#334155'}
                      strokeWidth={isShortestPath ? 4 : 2}
                      strokeDasharray={isShortestPath ? 'none' : 'none'}
                      markerEnd={isDirected ? (isShortestPath ? 'url(#arrowhead-active)' : 'url(#arrowhead)') : undefined}
                      className="transition-all duration-300"
                    />

                    {/* Edge Weight Pill */}
                    <g transform={`translate(${midX}, ${midY})`}>
                      <rect
                        x="-14"
                        y="-10"
                        width="28"
                        height="20"
                        rx="6"
                        fill="#0B132B"
                        stroke={isShortestPath ? '#00F0FF' : '#1E293B'}
                        strokeWidth="1.5"
                      />
                      <text
                        x="0"
                        y="4"
                        textAnchor="middle"
                        fill={isShortestPath ? '#00F0FF' : '#94A3B8'}
                        fontSize="11"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        {e.weight}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Render Nodes */}
              {nodes.map((n) => {
                const isSelected = selectedNode === n.id;
                const isTarget = targetNode === n.id;
                const isVisited = visitedNodes.includes(n.id);
                const isPath = pathNodes.includes(n.id);

                let fillColor = '#0F172A';
                let strokeColor = '#38BDF8';
                if (isSelected) {
                  strokeColor = '#10B981'; // Green for Source
                  fillColor = '#064E3B';
                } else if (isTarget) {
                  strokeColor = '#F43F5E'; // Red/Pink for Target
                  fillColor = '#881337';
                } else if (isPath) {
                  strokeColor = '#00F0FF';
                  fillColor = '#083344';
                } else if (isVisited) {
                  strokeColor = '#A855F7';
                  fillColor = '#3B0764';
                }

                return (
                  <g
                    key={n.id}
                    transform={`translate(${n.x}, ${n.y})`}
                    onMouseDown={(e) => handleMouseDownNode(n.id, e)}
                    className="cursor-move group"
                  >
                    <circle
                      r="22"
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={isSelected || isTarget || isPath ? 3 : 2}
                      className="transition-colors duration-300 drop-shadow-lg"
                    />
                    <text
                      textAnchor="middle"
                      y="5"
                      fill="#FFFFFF"
                      fontSize="13"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {n.id}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Instruction Overlay */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-400">
              <span>Drag nodes to reposition. Click to select.</span>
            </div>
          </div>

          {/* Results & Distance Gauges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <p className="text-slate-400 text-[10px] uppercase">Source & Target</p>
              <p className="text-white font-bold text-base mt-1">
                {selectedNode || '-'} → {targetNode || '-'}
              </p>
              <p className="text-[10px] text-emerald-400 mt-0.5">Start to Finish</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <p className="text-slate-400 text-[10px] uppercase">Path Cost / Distance</p>
              <p className="text-cyan-300 font-bold text-base mt-1">
                {pathCost !== null ? pathCost : '-'}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Cumulative Edge Weight</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <p className="text-slate-400 text-[10px] uppercase">Calculated Path</p>
              <p className="text-purple-300 font-bold text-base mt-1 truncate">
                {pathNodes.length > 0 ? pathNodes.join(' → ') : 'None'}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">{pathNodes.length} Vertices</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <p className="text-slate-400 text-[10px] uppercase">Visited Vertices</p>
              <p className="text-emerald-400 font-bold text-base mt-1 truncate">
                {visitedNodes.length > 0 ? visitedNodes.join(', ') : '-'}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">{visitedNodes.length} Traversed</p>
            </div>
          </div>
        </div>

        {/* Right: Graph Editor & Node/Edge Controls */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Share2 className="w-4 h-4 text-cyan-400" />
              <span>Graph Editor</span>
            </h3>
            <span className="text-[11px] font-mono text-cyan-400">
              {nodes.length} Vertices, {edges.length} Edges
            </span>
          </div>

          {/* Source and Target Pickers */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-emerald-400 font-medium">Source Vertex</label>
              <select
                value={selectedNode}
                onChange={(e) => { setSelectedNode(e.target.value); resetAlgorithmState(); }}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-2 text-xs font-mono"
              >
                {nodes.map((n) => (
                  <option key={n.id} value={n.id}>Node {n.id}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-rose-400 font-medium">Target Vertex</label>
              <select
                value={targetNode}
                onChange={(e) => { setTargetNode(e.target.value); resetAlgorithmState(); }}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-2 text-xs font-mono"
              >
                {nodes.map((n) => (
                  <option key={n.id} value={n.id}>Node {n.id}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Add / Delete Node Buttons */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
            <button
              onClick={addNode}
              className="flex-1 py-2 px-3 rounded-lg bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-600/30 text-xs font-medium flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add Node
            </button>
            <button
              onClick={() => deleteNode(selectedNode)}
              className="py-2 px-3 rounded-lg bg-rose-950/40 text-rose-300 border border-rose-800/40 hover:bg-rose-900/40 text-xs font-medium flex items-center justify-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete ({selectedNode})
            </button>
          </div>

          {/* Connect Edge Section */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <p className="text-xs font-semibold text-white">Connect Vertices with Weighted Edge</p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-slate-400">From</span>
                <select
                  value={edgeSource}
                  onChange={(e) => setEdgeSource(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded p-1.5 text-xs font-mono mt-0.5"
                >
                  {nodes.map((n) => (
                    <option key={n.id} value={n.id}>{n.id}</option>
                  ))}
                </select>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">To</span>
                <select
                  value={edgeTarget}
                  onChange={(e) => setEdgeTarget(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded p-1.5 text-xs font-mono mt-0.5"
                >
                  {nodes.map((n) => (
                    <option key={n.id} value={n.id}>{n.id}</option>
                  ))}
                </select>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Weight</span>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={edgeWeight}
                  onChange={(e) => setEdgeWeight(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded p-1.5 text-xs font-mono mt-0.5"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="text-[11px] text-slate-300 flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDirected}
                  onChange={(e) => setIsDirected(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-cyan-500"
                />
                <span>Directed Edge</span>
              </label>

              <button
                onClick={addEdge}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium"
              >
                Add Edge
              </button>
            </div>
          </div>

          {/* Algorithm Step Log */}
          <div className="space-y-1.5">
            <p className="text-[11px] font-mono text-slate-400 uppercase">Traversal Log</p>
            <div className="h-32 overflow-y-auto p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1">
              {logs.length === 0 ? (
                <p className="text-slate-500 italic">Click 'Run {algorithm.toUpperCase()}' to view step-by-step traversal steps.</p>
              ) : (
                logs.map((log, idx) => (
                  <p key={idx} className="leading-snug">
                    <span className="text-cyan-400 font-bold">[{idx + 1}]</span> {log}
                  </p>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Educational Explanation & Algorithm Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            What is Graph Theory?
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            In discrete mathematics, a <strong>graph G = (V, E)</strong> consists of a set of vertices (nodes) V connected by edges E. Graphs model computer networks, flight trajectories, chemical molecules, and social topologies.
          </p>
          <div className="p-3 rounded-xl bg-slate-950 font-mono text-xs text-cyan-300 border border-slate-800">
            d(u, v) = min Σ w(e) for e ∈ Path(u, v)
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Edges can be <strong>undirected</strong> (bidirectional) or <strong>directed</strong> (one-way). In weighted graphs, each edge carries a numerical cost representing distance, latency, or bandwidth.
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Navigation className="w-4 h-4 text-purple-400" />
            How Does Dijkstra’s Algorithm Work?
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Dijkstra's greedy algorithm finds the shortest path between nodes with non-negative edge weights:
          </p>
          <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
            <li>Initialize source distance = 0 and all other vertices = ∞.</li>
            <li>Greedily visit the unvisited node with the minimum tentative distance.</li>
            <li>Relax distances to its immediate neighbors if a shorter route is found.</li>
            <li>Mark current node as visited; repeat until the target vertex is resolved.</li>
          </ul>
        </div>
      </div>

      {/* Action CTA: Take Concept Quiz */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-800/40">
        <div>
          <h4 className="text-sm font-bold text-white">Mastered graph traversal algorithms?</h4>
          <p className="text-xs text-slate-400">Take the 5-question Graph Theory quiz to test your algorithmic knowledge.</p>
        </div>
        <button
          onClick={onQuizClick}
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all"
        >
          <span>Take Concept Quiz (5 Questions)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
