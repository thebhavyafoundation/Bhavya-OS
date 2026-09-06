"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AttentionSimulator,
  TokenizationSimulator,
  EmbeddingSpaceExplorer,
  VectorSearchSimulator,
  TransformerPipelineVisualizer,
  RAGPipelineSimulator,
} from "@/components/simulations";
import { AIPromptPlayground } from "@/components/playground";
import { AssessmentEngine } from "@/components/assessment";
import { AITutor } from "@/components/tutor";
import { SemanticSearch } from "@/components/search";
import { ProgressIntelligence } from "@/components/progress";
import { ResearchLibrary } from "@/components/research";
import { ProjectStudio } from "@/components/projects";

type Tab =
  | "simulations"
  | "playground"
  | "assessment"
  | "tutor"
  | "search"
  | "progress"
  | "research"
  | "projects";

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: "simulations", label: "Simulations", icon: "🔬" },
  { id: "playground", label: "Playground", icon: "🧪" },
  { id: "assessment", label: "Assessment", icon: "📝" },
  { id: "tutor", label: "AI Tutor", icon: "🎓" },
  { id: "search", label: "Search", icon: "🔍" },
  { id: "progress", label: "Progress", icon: "📊" },
  { id: "research", label: "Research", icon: "📄" },
  { id: "projects", label: "Projects", icon: "🔨" },
];

const simulations = [
  {
    id: "attention",
    name: "Attention Mechanism",
    icon: "👁️",
    component: "attention",
  },
  {
    id: "tokenization",
    name: "Tokenization",
    icon: "🔤",
    component: "tokenization",
  },
  {
    id: "embeddings",
    name: "Embedding Space",
    icon: "📍",
    component: "embeddings",
  },
  {
    id: "vector-search",
    name: "Vector Search",
    icon: "🔍",
    component: "vector-search",
  },
  {
    id: "transformer",
    name: "Transformer Pipeline",
    icon: "🏗️",
    component: "transformer",
  },
  { id: "rag", name: "RAG Pipeline", icon: "📚", component: "rag" },
];

export default function PlaygroundPage() {
  const [activeTab, setActiveTab] = useState<Tab>("simulations");
  const [activeSimulation, setActiveSimulation] = useState("attention");

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {/* Experimental notice — Wave O: orphan route, not in canonical navigation */}
      <div className="bg-accent-gold/10 border-b border-accent-gold/20 px-6 py-2 text-center">
        <p className="text-xs text-accent-gold/70 font-medium">
          Experimental — not yet part of the canonical learning experience
        </p>
      </div>
      {/* Header */}
      <div className="border-b border-white/10 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/"
            className="text-sm text-white/50 hover:text-white/70 mb-4 inline-block"
          >
            ← Back to AI University
          </Link>
          <h1 className="text-3xl font-bold mb-2">Interactive AI Laboratory</h1>
          <p className="text-white/60 max-w-2xl">
            Explore, experiment, and master AI concepts through interactive
            simulations and hands-on practice.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Search Bar */}
        <div className="mb-6">
          <SemanticSearch />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white/5 rounded-lg p-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-white text-black"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "simulations" && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Simulation List */}
            <div className="lg:col-span-1">
              <h3 className="text-sm font-semibold text-white/60 mb-3">
                Simulations
              </h3>
              <div className="space-y-2">
                {simulations.map((sim) => (
                  <button
                    key={sim.id}
                    onClick={() => setActiveSimulation(sim.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      activeSimulation === sim.id
                        ? "bg-[#22c55e]/10 border border-[#22c55e]/30 text-[#22c55e]"
                        : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{sim.icon}</span>
                      <span className="text-sm">{sim.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Simulation */}
            <div className="lg:col-span-3">
              {activeSimulation === "attention" && <AttentionSimulator />}
              {activeSimulation === "tokenization" && <TokenizationSimulator />}
              {activeSimulation === "embeddings" && <EmbeddingSpaceExplorer />}
              {activeSimulation === "vector-search" && (
                <VectorSearchSimulator />
              )}
              {activeSimulation === "transformer" && (
                <TransformerPipelineVisualizer />
              )}
              {activeSimulation === "rag" && <RAGPipelineSimulator />}
            </div>
          </div>
        )}

        {activeTab === "playground" && <AIPromptPlayground />}
        {activeTab === "assessment" && <AssessmentEngine />}
        {activeTab === "tutor" && <AITutor />}
        {activeTab === "search" && (
          <div className="max-w-2xl mx-auto">
            <SemanticSearch />
          </div>
        )}
        {activeTab === "progress" && <ProgressIntelligence />}
        {activeTab === "research" && <ResearchLibrary />}
        {activeTab === "projects" && <ProjectStudio />}
      </div>
    </div>
  );
}
