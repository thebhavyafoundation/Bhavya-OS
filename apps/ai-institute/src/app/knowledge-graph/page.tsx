"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  color: string;
  mastery: number;
  prerequisites: string[];
  relatedLessons: string[];
  relatedLabs: string[];
  description: string;
}

const graphNodes: GraphNode[] = [
  {
    id: "ai",
    label: "AI",
    x: 400,
    y: 300,
    color: "#1a3a2a",
    mastery: 0,
    prerequisites: [],
    relatedLessons: ["AI Fundamentals", "History of AI"],
    relatedLabs: ["Lab 0: Setup"],
    description:
      "Artificial Intelligence — the broad field of creating systems that mimic human intelligence.",
  },
  {
    id: "ml",
    label: "ML",
    x: 250,
    y: 180,
    color: "#c9a227",
    mastery: 0,
    prerequisites: ["ai"],
    relatedLessons: ["Linear Regression", "Decision Trees"],
    relatedLabs: ["Lab 1: Data Prep"],
    description:
      "Machine Learning — algorithms that learn patterns from data without explicit programming.",
  },
  {
    id: "dl",
    label: "DL",
    x: 550,
    y: 180,
    color: "#8a7359",
    mastery: 0,
    prerequisites: ["ml"],
    relatedLessons: ["Neural Networks", "Backpropagation"],
    relatedLabs: ["Lab 2: Neural Nets"],
    description:
      "Deep Learning — neural networks with multiple layers that learn hierarchical representations.",
  },
  {
    id: "nlp",
    label: "NLP",
    x: 150,
    y: 350,
    color: "#4ade80",
    mastery: 0,
    prerequisites: ["ml"],
    relatedLessons: ["Text Processing", "Sentiment Analysis"],
    relatedLabs: ["Lab 3: NLP"],
    description:
      "Natural Language Processing — enabling computers to understand and generate human language.",
  },
  {
    id: "cv",
    label: "CV",
    x: 650,
    y: 350,
    color: "#60a5fa",
    mastery: 0,
    prerequisites: ["dl"],
    relatedLessons: ["Image Classification", "Object Detection"],
    relatedLabs: ["Lab 4: Computer Vision"],
    description:
      "Computer Vision — teaching machines to interpret and understand visual information.",
  },
  {
    id: "rl",
    label: "RL",
    x: 150,
    y: 500,
    color: "#f472b6",
    mastery: 0,
    prerequisites: ["ml"],
    relatedLessons: ["Reinforcement Learning", "Q-Learning"],
    relatedLabs: ["Lab 5: RL"],
    description:
      "Reinforcement Learning — training agents through reward and punishment signals.",
  },
  {
    id: "cnn",
    label: "CNN",
    x: 700,
    y: 220,
    color: "#60a5fa",
    mastery: 0,
    prerequisites: ["dl", "cv"],
    relatedLessons: ["Convolutional Layers", "Image Nets"],
    relatedLabs: ["Lab 4: CNN"],
    description:
      "Convolutional Neural Networks — specialized architectures for grid-like data such as images.",
  },
  {
    id: "rnn",
    label: "RNN",
    x: 350,
    y: 480,
    color: "#a78bfa",
    mastery: 0,
    prerequisites: ["dl"],
    relatedLessons: ["Sequential Data", "LSTM"],
    relatedLabs: ["Lab 6: RNN"],
    description:
      "Recurrent Neural Networks — networks designed for sequential data with memory of past inputs.",
  },
  {
    id: "transformers",
    label: "Transformers",
    x: 450,
    y: 120,
    color: "#fbbf24",
    mastery: 0,
    prerequisites: ["dl", "nlp"],
    relatedLessons: ["Attention Mechanism", "Self-Attention"],
    relatedLabs: ["Lab 7: Transformers"],
    description:
      "Transformers — attention-based architecture that revolutionized NLP and beyond.",
  },
  {
    id: "gans",
    label: "GANs",
    x: 600,
    y: 480,
    color: "#f472b6",
    mastery: 0,
    prerequisites: ["dl"],
    relatedLessons: ["Generative Models", "Adversarial Training"],
    relatedLabs: ["Lab 8: GANs"],
    description:
      "Generative Adversarial Networks — two networks competing to generate realistic outputs.",
  },
  {
    id: "bert",
    label: "BERT",
    x: 250,
    y: 100,
    color: "#34d399",
    mastery: 0,
    prerequisites: ["transformers", "nlp"],
    relatedLessons: ["Bidirectional Encoding", "Fine-tuning"],
    relatedLabs: ["Lab 9: BERT"],
    description:
      "BERT — bidirectional encoder representations from transformers for understanding language.",
  },
  {
    id: "gpt",
    label: "GPT",
    x: 550,
    y: 60,
    color: "#fbbf24",
    mastery: 0,
    prerequisites: ["transformers"],
    relatedLessons: ["Language Models", "Prompt Engineering"],
    relatedLabs: ["Lab 10: GPT"],
    description:
      "GPT — generative pre-trained transformer for natural language generation tasks.",
  },
];

const edges: [string, string][] = [
  ["ai", "ml"],
  ["ai", "nlp"],
  ["ai", "cv"],
  ["ai", "rl"],
  ["ml", "dl"],
  ["ml", "nlp"],
  ["ml", "rl"],
  ["dl", "cnn"],
  ["dl", "rnn"],
  ["dl", "transformers"],
  ["dl", "gans"],
  ["nlp", "transformers"],
  ["nlp", "bert"],
  ["cv", "cnn"],
  ["transformers", "bert"],
  ["transformers", "gpt"],
  ["rnn", "nlp"],
];

function getMasteryColor(mastery: number): string {
  if (mastery < 40) return "#ef4444";
  if (mastery < 70) return "#eab308";
  return "#22c55e";
}

export default function KnowledgeGraphPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [filter, setFilter] = useState<
    "all" | "mastered" | "in-progress" | "not-started"
  >("all");
  const offsetRef = useRef({ x: 0, y: 0 });
  const scaleRef = useRef(1);
  const isPanning = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const animFrame = useRef<number>(0);

  const getNodeAtPos = useCallback(
    (mx: number, my: number): GraphNode | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const x = (mx - rect.left - offsetRef.current.x) / scaleRef.current;
      const y = (my - rect.top - offsetRef.current.y) / scaleRef.current;
      for (const node of graphNodes) {
        const dx = x - node.x;
        const dy = y - node.y;
        if (dx * dx + dy * dy < 900) return node;
      }
      return null;
    },
    [],
  );

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const container = containerRef.current;
    if (!container) return;

    const dpr = window.devicePixelRatio || 1;
    const w = container.clientWidth;
    const h = container.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.translate(offsetRef.current.x, offsetRef.current.y);
    ctx.scale(scaleRef.current, scaleRef.current);

    const filteredNodes = graphNodes
      .filter((n) => {
        if (filter === "mastered") return n.mastery >= 70;
        if (filter === "in-progress") return n.mastery >= 40 && n.mastery < 70;
        if (filter === "not-started") return n.mastery < 40;
        return true;
      })
      .filter((n) => {
        if (!searchQuery) return true;
        return (
          n.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });

    const nodeIds = new Set(filteredNodes.map((n) => n.id));

    for (const [fromId, toId] of edges) {
      if (!nodeIds.has(fromId) || !nodeIds.has(toId)) continue;
      const from = graphNodes.find((n) => n.id === fromId)!;
      const to = graphNodes.find((n) => n.id === toId)!;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.strokeStyle =
        hoveredNode === fromId ||
        hoveredNode === toId ||
        selectedNode?.id === fromId ||
        selectedNode?.id === toId
          ? "rgba(201, 162, 39, 0.4)"
          : "rgba(255, 255, 255, 0.06)";
      ctx.lineWidth =
        hoveredNode === fromId ||
        hoveredNode === toId ||
        selectedNode?.id === fromId ||
        selectedNode?.id === toId
          ? 2
          : 1;
      ctx.stroke();
    }

    for (const node of filteredNodes) {
      const isSelected = selectedNode?.id === node.id;
      const isHovered = hoveredNode === node.id;
      const isPrereq = selectedNode?.prerequisites.includes(node.id);
      const isRelated = filteredNodes.some(
        (n) => n.id === selectedNode?.id && n.prerequisites.includes(node.id),
      );
      const radius = isSelected ? 32 : isHovered ? 28 : 24;
      const mColor = getMasteryColor(node.mastery);

      if (isSelected || isHovered) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius + 8, 0, Math.PI * 2);
        ctx.fillStyle = node.color + "15";
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      const grad = ctx.createRadialGradient(
        node.x - 4,
        node.y - 4,
        0,
        node.x,
        node.y,
        radius,
      );
      grad.addColorStop(0, node.color + "cc");
      grad.addColorStop(1, node.color + "66");
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.strokeStyle = isSelected
        ? "#c9a227"
        : isPrereq
          ? "#ef4444"
          : isRelated
            ? "#4ade80"
            : "rgba(255,255,255,0.1)";
      ctx.lineWidth = isSelected ? 2.5 : 1.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(node.x + radius * 0.6, node.y - radius * 0.6, 5, 0, Math.PI * 2);
      ctx.fillStyle = mColor;
      ctx.fill();

      ctx.fillStyle = "#f5f1e6";
      ctx.font = `${isSelected ? "bold " : ""}${radius < 28 ? 11 : 13}px system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(node.label, node.x, node.y);
    }

    ctx.restore();
    animFrame.current = requestAnimationFrame(draw);
  }, [selectedNode, hoveredNode, searchQuery, filter]);

  useEffect(() => {
    animFrame.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animFrame.current);
  }, [draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseDown = (e: MouseEvent) => {
      const node = getNodeAtPos(e.clientX, e.clientY);
      if (node) {
        setSelectedNode(node);
        return;
      }
      isPanning.current = true;
      lastMouse.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      const node = getNodeAtPos(e.clientX, e.clientY);
      setHoveredNode(node?.id || null);
      canvas.style.cursor = node
        ? "pointer"
        : isPanning.current
          ? "grabbing"
          : "grab";

      if (isPanning.current) {
        const dx = e.clientX - lastMouse.current.x;
        const dy = e.clientY - lastMouse.current.y;
        offsetRef.current.x += dx;
        offsetRef.current.y += dy;
        lastMouse.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseUp = () => {
      isPanning.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.92 : 1.08;
      const newScale = Math.max(0.3, Math.min(3, scaleRef.current * delta));
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      offsetRef.current.x =
        mx - (mx - offsetRef.current.x) * (newScale / scaleRef.current);
      offsetRef.current.y =
        my - (my - offsetRef.current.y) * (newScale / scaleRef.current);
      scaleRef.current = newScale;
    };

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        const node = getNodeAtPos(touch.clientX, touch.clientY);
        if (node) {
          setSelectedNode(node);
          return;
        }
        isPanning.current = true;
        lastMouse.current = { x: touch.clientX, y: touch.clientY };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length === 1 && isPanning.current) {
        const touch = e.touches[0];
        const dx = touch.clientX - lastMouse.current.x;
        const dy = touch.clientY - lastMouse.current.y;
        offsetRef.current.x += dx;
        offsetRef.current.y += dy;
        lastMouse.current = { x: touch.clientX, y: touch.clientY };
      }
    };

    const handleTouchEnd = (_e: TouchEvent) => {
      isPanning.current = false;
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseleave", handleMouseUp);
    canvas.addEventListener("wheel", handleWheel, { passive: false });
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseleave", handleMouseUp);
      canvas.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, [getNodeAtPos]);

  const _filteredGraphNodes = graphNodes
    .filter((n) => {
      if (filter === "mastered") return n.mastery >= 70;
      if (filter === "in-progress") return n.mastery >= 40 && n.mastery < 70;
      if (filter === "not-started") return n.mastery < 40;
      return true;
    })
    .filter((n) => {
      if (!searchQuery) return true;
      return (
        n.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/"
              className="text-xs text-white/30 hover:text-white/50 transition-colors mb-6 inline-flex items-center gap-1.5"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              AI Institute
            </Link>
            <h1
              className="text-4xl md:text-5xl font-bold tracking-tight mt-4 mb-2"
              style={{
                background: "linear-gradient(135deg, #f5f1e6 0%, #c9a227 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Knowledge Graph
            </h1>
            <p className="text-white/40 text-lg">
              Explore AI concepts and their relationships
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-white/30"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#c9a227]/40 transition-all"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "mastered", "in-progress", "not-started"] as const).map(
              (f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    filter === f
                      ? "bg-bg-tertiary text-accent-green-light"
                      : "bg-white/[0.04] text-white/40 hover:bg-white/[0.08]"
                  }`}
                >
                  {f === "all"
                    ? "All"
                    : f === "mastered"
                      ? "Mastered"
                      : f === "in-progress"
                        ? "In Progress"
                        : "Not Started"}
                </button>
              ),
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2" ref={containerRef}>
            <div
              className="relative bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden"
              style={{ height: "min(600px, 60vh)" }}
            >
              <canvas ref={canvasRef} className="absolute inset-0" />
              <div className="absolute bottom-4 left-4 flex items-center gap-4 px-4 py-2.5 bg-[#0a0a0a]/80 backdrop-blur-sm rounded-xl border border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-[10px] text-white/40">&lt; 40%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="text-[10px] text-white/40">40–70%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-[10px] text-white/40">&gt; 70%</span>
                </div>
              </div>
              <div className="absolute top-4 right-4 px-3 py-1.5 bg-[#0a0a0a]/80 backdrop-blur-sm rounded-lg border border-white/[0.06] text-[10px] text-white/30">
                Scroll to zoom • Drag to pan • Click node for details
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <AnimatePresence mode="wait">
              {selectedNode ? (
                <motion.div
                  key={selectedNode.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{
                    duration: 0.3,
                    ease: [0.25, 0.46, 0.45, 0.94] as const,
                  }}
                  className="sticky top-8 bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-text-primary">
                        {selectedNode.label}
                      </h2>
                      <p className="text-xs text-white/30 mt-1">
                        {selectedNode.description}
                      </p>
                    </div>
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold"
                      style={{
                        background: selectedNode.color + "22",
                        color: selectedNode.color,
                      }}
                    >
                      {selectedNode.mastery}%
                    </div>
                  </div>

                  <div className="mb-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-white/30 uppercase tracking-wider">
                        Mastery
                      </span>
                      <span
                        className="text-[10px] font-medium"
                        style={{ color: getMasteryColor(selectedNode.mastery) }}
                      >
                        {selectedNode.mastery < 40
                          ? "Beginner"
                          : selectedNode.mastery < 70
                            ? "Intermediate"
                            : "Advanced"}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedNode.mastery}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{
                          background: getMasteryColor(selectedNode.mastery),
                        }}
                      />
                    </div>
                  </div>

                  {selectedNode.prerequisites.length > 0 && (
                    <div className="mb-5">
                      <h3 className="text-[10px] text-white/30 uppercase tracking-wider mb-2">
                        Prerequisites
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedNode.prerequisites.map((pid) => {
                          const p = graphNodes.find((n) => n.id === pid);
                          return p ? (
                            <button
                              key={pid}
                              onClick={() => setSelectedNode(p)}
                              className="px-2.5 py-1 text-[11px] bg-white/[0.06] text-white/60 rounded-lg hover:bg-white/[0.1] transition-colors"
                            >
                              {p.label}
                            </button>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}

                  <div className="mb-5">
                    <h3 className="text-[10px] text-white/30 uppercase tracking-wider mb-2">
                      Related Lessons
                    </h3>
                    <div className="space-y-1.5">
                      {selectedNode.relatedLessons.map((lesson) => (
                        <div
                          key={lesson}
                          className="flex items-center gap-2 text-sm text-white/50"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
                          {lesson}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-5">
                    <h3 className="text-[10px] text-white/30 uppercase tracking-wider mb-2">
                      Related Labs
                    </h3>
                    <div className="space-y-1.5">
                      {selectedNode.relatedLabs.map((lab) => (
                        <div
                          key={lab}
                          className="flex items-center gap-2 text-sm text-white/50"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" />
                          {lab}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={`/concepts/${selectedNode.id}`}
                    className="block w-full text-center py-2.5 text-sm font-semibold rounded-lg bg-bg-tertiary text-accent-green-light hover:bg-bg-tertiary/80 transition-colors"
                  >
                    Learn This Concept →
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="sticky top-8 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/[0.04] flex items-center justify-center">
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="text-white/20"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4M12 8h.01" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-white/50 mb-1">
                    Select a Concept
                  </h3>
                  <p className="text-xs text-white/25">
                    Click any node on the graph to explore its details,
                    prerequisites, and learning resources.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
