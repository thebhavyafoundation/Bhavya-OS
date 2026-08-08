"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";

function KnowledgeGraphAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      label: string;
      color: string;
    }

    interface Edge {
      from: number;
      to: number;
      strength: number;
    }

    const nodes: Node[] = [
      {
        x: 0,
        y: 0,
        vx: 0.2,
        vy: 0.1,
        radius: 4,
        label: "AI",
        color: "#c9a227",
      },
      {
        x: 0,
        y: 0,
        vx: -0.1,
        vy: 0.2,
        radius: 3,
        label: "ML",
        color: "#1a3a2a",
      },
      {
        x: 0,
        y: 0,
        vx: 0.15,
        vy: -0.1,
        radius: 3,
        label: "DL",
        color: "#1a3a2a",
      },
      {
        x: 0,
        y: 0,
        vx: -0.2,
        vy: -0.15,
        radius: 2.5,
        label: "NLP",
        color: "#8a7359",
      },
      {
        x: 0,
        y: 0,
        vx: 0.1,
        vy: 0.2,
        radius: 2.5,
        label: "CV",
        color: "#8a7359",
      },
      {
        x: 0,
        y: 0,
        vx: -0.15,
        vy: 0.1,
        radius: 2,
        label: "RL",
        color: "#1a3a2a",
      },
      {
        x: 0,
        y: 0,
        vx: 0.2,
        vy: -0.2,
        radius: 2,
        label: "LLM",
        color: "#c9a227",
      },
      {
        x: 0,
        y: 0,
        vx: -0.1,
        vy: -0.2,
        radius: 2,
        label: "Agents",
        color: "#c9a227",
      },
      {
        x: 0,
        y: 0,
        vx: 0.15,
        vy: 0.15,
        radius: 1.5,
        label: "RAG",
        color: "#8a7359",
      },
      {
        x: 0,
        y: 0,
        vx: -0.2,
        vy: 0.2,
        radius: 1.5,
        label: "Transformers",
        color: "#1a3a2a",
      },
      {
        x: 0,
        y: 0,
        vx: 0.1,
        vy: -0.15,
        radius: 1.5,
        label: "Embeddings",
        color: "#8a7359",
      },
      {
        x: 0,
        y: 0,
        vx: -0.15,
        vy: -0.1,
        radius: 1.5,
        label: "Attention",
        color: "#1a3a2a",
      },
    ];

    const edges: Edge[] = [
      { from: 0, to: 1, strength: 1 },
      { from: 0, to: 2, strength: 1 },
      { from: 0, to: 3, strength: 0.8 },
      { from: 0, to: 4, strength: 0.8 },
      { from: 1, to: 2, strength: 0.9 },
      { from: 1, to: 5, strength: 0.7 },
      { from: 2, to: 9, strength: 0.9 },
      { from: 3, to: 6, strength: 0.8 },
      { from: 4, to: 6, strength: 0.7 },
      { from: 6, to: 7, strength: 0.9 },
      { from: 6, to: 8, strength: 0.8 },
      { from: 9, to: 10, strength: 0.9 },
      { from: 9, to: 11, strength: 0.9 },
      { from: 10, to: 11, strength: 0.8 },
      { from: 7, to: 8, strength: 0.7 },
    ];

    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;

    nodes.forEach((node) => {
      node.x = Math.random() * w;
      node.y = Math.random() * h;
    });

    let mouseX = w / 2;
    let mouseY = h / 2;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    canvas.addEventListener("mousemove", handleMouseMove);

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > w) node.vx *= -1;
        if (node.y < 0 || node.y > h) node.vy *= -1;
        node.x = Math.max(0, Math.min(w, node.x));
        node.y = Math.max(0, Math.min(h, node.y));
      });

      edges.forEach((edge) => {
        const from = nodes[edge.from];
        const to = nodes[edge.to];
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          const opacity = (1 - dist / 200) * 0.3 * edge.strength;
          ctx.beginPath();
          ctx.moveTo(from.x, from.y);
          ctx.lineTo(to.x, to.y);
          ctx.strokeStyle = `rgba(201, 162, 39, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });

      nodes.forEach((node) => {
        const dx = mouseX - node.x;
        const dy = mouseY - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const glow = dist < 100 ? (1 - dist / 100) * 0.5 : 0;

        if (glow > 0) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 8, 0, Math.PI * 2);
          ctx.fillStyle = `${node.color}${Math.floor(glow * 255)
            .toString(16)
            .padStart(2, "0")}`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        if (dist < 150 || node.radius >= 3) {
          ctx.font = "11px Inter, sans-serif";
          ctx.fillStyle = `rgba(245, 241, 230, ${dist < 150 ? 1 - dist / 150 : 0.6})`;
          ctx.textAlign = "center";
          ctx.fillText(node.label, node.x, node.y - node.radius - 8);
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.6 }}
    />
  );
}

function SchoolCard({
  name,
  icon,
  description,
  color,
}: {
  name: string;
  icon: string;
  description: string;
  color: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative p-6 rounded-xl border border-[#1a2a1f] bg-[#111916] transition-all duration-300 cursor-pointer group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderColor: hovered ? color : undefined,
        boxShadow: hovered ? `0 0 30px ${color}20` : undefined,
      }}
    >
      <div
        className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-4 transition-colors duration-300"
        style={{ backgroundColor: `${color}20` }}
      >
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-[#f5f1e6] mb-2">{name}</h3>
      <p className="text-sm text-[#8a7359] leading-relaxed mb-4">
        {description}
      </p>
      <span
        className="text-xs font-medium transition-colors duration-300"
        style={{ color: hovered ? color : "#8a7359" }}
      >
        Explore →
      </span>
    </div>
  );
}

function PathCard({
  title,
  duration,
  difficulty,
  modules,
}: {
  title: string;
  duration: string;
  difficulty: string;
  modules: number;
}) {
  return (
    <div className="min-w-[280px] p-6 rounded-xl border border-[#1a2a1f] bg-[#111916] hover:border-[#1a3a2a] transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs px-2 py-1 rounded-full bg-[#1a3a2a]/20 text-[#1a3a2a]">
          {difficulty}
        </span>
        <span className="text-xs text-[#8a7359]">{duration}</span>
      </div>
      <h3 className="text-base font-semibold text-[#f5f1e6] mb-3">{title}</h3>
      <div className="flex items-center justify-between text-xs text-[#8a7359]">
        <span>{modules} modules</span>
        <span className="text-[#c9a227]">View →</span>
      </div>
    </div>
  );
}

function RoadmapStage({
  number,
  title,
  description,
  skills,
  active,
}: {
  number: string;
  title: string;
  description: string;
  skills: string[];
  active: boolean;
}) {
  return (
    <div className="relative flex flex-col items-center text-center">
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold mb-4 transition-all duration-500 ${
          active
            ? "bg-[#c9a227] text-[#0a0f0d] scale-110"
            : "bg-[#1a2a1f] text-[#8a7359]"
        }`}
      >
        {number}
      </div>
      <h3 className="text-base font-semibold text-[#f5f1e6] mb-2">{title}</h3>
      <p className="text-sm text-[#8a7359] mb-3 max-w-[200px]">{description}</p>
      <div className="flex flex-wrap justify-center gap-1">
        {skills.map((skill) => (
          <span
            key={skill}
            className="text-[10px] px-2 py-0.5 rounded-full bg-[#1a2a1f] text-[#8a7359]"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function FlagshipHomepage() {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % 5);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const schools = [
    {
      name: "AI Foundations",
      icon: "🧠",
      description: "Core AI concepts, Python, mathematics",
      color: "#1a3a2a",
    },
    {
      name: "Machine Learning",
      icon: "📊",
      description: "Supervised, unsupervised, reinforcement",
      color: "#1a3a2a",
    },
    {
      name: "Deep Learning",
      icon: "🔬",
      description: "Neural networks, architectures, optimization",
      color: "#1a3a2a",
    },
    {
      name: "LLM Engineering",
      icon: "💬",
      description: "Large language models, fine-tuning, deployment",
      color: "#c9a227",
    },
    {
      name: "AI Agents",
      icon: "🤖",
      description: "Autonomous systems, tool use, planning",
      color: "#c9a227",
    },
    {
      name: "Robotics",
      icon: "🦾",
      description: "Embodied AI, control systems, perception",
      color: "#8a7359",
    },
    {
      name: "Data Engineering",
      icon: "🗄️",
      description: "Pipelines, infrastructure, MLOps",
      color: "#8a7359",
    },
    {
      name: "Mathematics",
      icon: "📐",
      description: "Linear algebra, calculus, probability",
      color: "#1a3a2a",
    },
    {
      name: "Research",
      icon: "📝",
      description: "Methodology, papers, reproducibility",
      color: "#c9a227",
    },
    {
      name: "AI Systems",
      icon: "⚙️",
      description: "Infrastructure, deployment, scaling",
      color: "#8a7359",
    },
    {
      name: "AI Safety",
      icon: "🛡️",
      description: "Alignment, ethics, governance",
      color: "#c9a227",
    },
    {
      name: "Open Source",
      icon: "🌐",
      description: "Contributing, maintaining, community",
      color: "#1a3a2a",
    },
  ];

  const learningPaths = [
    {
      title: "AI Foundations",
      duration: "12 weeks",
      difficulty: "Beginner",
      modules: 8,
    },
    {
      title: "Machine Learning Engineer",
      duration: "16 weeks",
      difficulty: "Intermediate",
      modules: 12,
    },
    {
      title: "Deep Learning Specialist",
      duration: "20 weeks",
      difficulty: "Advanced",
      modules: 15,
    },
    {
      title: "LLM Engineer",
      duration: "14 weeks",
      difficulty: "Intermediate",
      modules: 10,
    },
    {
      title: "AI Agent Developer",
      duration: "10 weeks",
      difficulty: "Advanced",
      modules: 8,
    },
    {
      title: "MLOps Engineer",
      duration: "12 weeks",
      difficulty: "Intermediate",
      modules: 9,
    },
    {
      title: "Research Scientist",
      duration: "24 weeks",
      difficulty: "Expert",
      modules: 18,
    },
    {
      title: "AI Safety Researcher",
      duration: "16 weeks",
      difficulty: "Advanced",
      modules: 12,
    },
  ];

  const roadmapStages = [
    {
      number: "01",
      title: "Visitor",
      description: "Explore the institution",
      skills: ["Browse", "Assess"],
      active: activeStage === 0,
    },
    {
      number: "02",
      title: "Learner",
      description: "Begin your journey",
      skills: ["Python", "Math"],
      active: activeStage === 1,
    },
    {
      number: "03",
      title: "Practitioner",
      description: "Build real systems",
      skills: ["Projects", "Labs"],
      active: activeStage === 2,
    },
    {
      number: "04",
      title: "Researcher",
      description: "Advance the field",
      skills: ["Papers", "Innovation"],
      active: activeStage === 3,
    },
    {
      number: "05",
      title: "Mentor",
      description: "Teach others",
      skills: ["Lead", "Inspire"],
      active: activeStage === 4,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0f0d]">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <KnowledgeGraphAnimation />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <p className="text-sm text-[#c9a227] font-medium mb-6 tracking-widest uppercase">
            Bhavya Foundation
          </p>
          <h1 className="text-5xl md:text-7xl font-bold text-[#f5f1e6] mb-6 leading-tight">
            The Institution Where AI Is
            <br />
            <span className="text-[#c9a227]">Understood</span>, Not Just Used
          </h1>
          <p className="text-lg md:text-xl text-[#8a7359] mb-10 max-w-2xl mx-auto leading-relaxed">
            A 10-year mission to become the global benchmark for AI education.
            Not another course platform. A lasting institution.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/assessment"
              className="px-8 py-4 text-base font-semibold bg-[#c9a227] text-[#0a0f0d] rounded-lg hover:bg-[#c9a227]/90 transition-colors"
            >
              Begin Your Journey
            </Link>
            <Link
              href="/knowledge-graph"
              className="px-8 py-4 text-base font-medium text-[#f5f1e6] border border-[#1a2a1f] rounded-lg hover:border-[#1a3a2a] transition-colors"
            >
              Explore the Knowledge Graph
            </Link>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <span className="text-[#8a7359] text-sm">Scroll to explore</span>
        </div>
      </section>

      {/* 12 Schools */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm text-[#c9a227] font-medium mb-4 tracking-wide uppercase">
              Academic Structure
            </p>
            <h2 className="text-4xl font-bold text-[#f5f1e6] mb-4">
              12 Schools of AI
            </h2>
            <p className="text-[#8a7359] max-w-2xl mx-auto">
              Each school is a complete academic unit with its own curriculum,
              faculty, and research focus. Together, they form the most
              comprehensive AI education institution in the world.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {schools.map((school) => (
              <SchoolCard key={school.name} {...school} />
            ))}
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="py-24 px-6 bg-[#111916]/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm text-[#c9a227] font-medium mb-4 tracking-wide uppercase">
              Curriculum
            </p>
            <h2 className="text-4xl font-bold text-[#f5f1e6] mb-4">
              Flagship Learning Paths
            </h2>
            <p className="text-[#8a7359] max-w-2xl mx-auto">
              Complete, structured journeys from beginner to expert. Every path
              includes interactive lessons, labs, projects, and AI mentor
              support.
            </p>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x">
            {learningPaths.map((path) => (
              <PathCard key={path.title} {...path} />
            ))}
          </div>
        </div>
      </section>

      {/* Student Success Roadmap */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm text-[#c9a227] font-medium mb-4 tracking-wide uppercase">
              Your Journey
            </p>
            <h2 className="text-4xl font-bold text-[#f5f1e6] mb-4">
              Student Success Roadmap
            </h2>
            <p className="text-[#8a7359] max-w-2xl mx-auto">
              From curiosity to mastery. Five stages of transformation.
            </p>
          </div>
          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#1a2a1f] -translate-y-1/2" />
            <div className="relative grid grid-cols-5 gap-4">
              {roadmapStages.map((stage) => (
                <RoadmapStage key={stage.number} {...stage} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-24 px-6 bg-[#111916]/50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-[#c9a227] font-medium mb-4 tracking-wide uppercase">
            Vision
          </p>
          <h2 className="text-4xl font-bold text-[#f5f1e6] mb-8">
            Built for the Next Decade
          </h2>
          <blockquote className="text-xl text-[#8a7359] leading-relaxed mb-8 italic">
            &ldquo;We are not building another course platform. We are building
            an institution that will produce the AI researchers, engineers, and
            leaders of the next decade. Every decision we make increases
            Bhavya&apos;s long-term institutional value.&rdquo;
          </blockquote>
          <p className="text-sm text-[#8a7359]">— Bhavya Foundation</p>
        </div>
      </section>

      {/* Stats — Real structural counts only */}
      <section className="py-24 px-6 border-y border-[#1a2a1f]">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Schools", value: "12" },
            { label: "Learning Paths", value: "8" },
            { label: "Courses", value: "65+" },
            { label: "Interactive Labs", value: "100+" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl font-bold text-[#c9a227] mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-[#8a7359]">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-[#f5f1e6] mb-6">
            Ready to Begin?
          </h2>
          <p className="text-[#8a7359] mb-10 text-lg">
            5-minute assessment. Personalized roadmap. Start building today.
          </p>
          <Link
            href="/assessment"
            className="inline-block px-10 py-4 text-base font-semibold bg-[#c9a227] text-[#0a0f0d] rounded-lg hover:bg-[#c9a227]/90 transition-colors"
          >
            Start Your Journey
          </Link>
        </div>
      </section>
    </div>
  );
}
