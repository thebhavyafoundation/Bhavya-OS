"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Filter, Maximize2, Minimize2, RotateCcw } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";

interface GraphNode {
  id: string;
  node_type: string;
  label: string;
  metadata: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

interface GraphEdge {
  id: string;
  source_id: string;
  target_id: string;
  relationship: string;
  weight: number;
}

interface Filters {
  nodeTypes: string[];
}

const nodeColors: Record<string, string> = {
  repository: "#3b82f6",
  pattern: "#a855f7",
  technology: "#22c55e",
  course: "#f59e0b",
  mcp: "#ec4899",
  plugin: "#06b6d4",
  framework: "#14b8a6",
  documentation: "#64748b",
};

const nodeShapes: Record<string, string> = {
  repository: "rect",
  pattern: "circle",
  technology: "diamond",
  course: "hexagon",
  mcp: "triangle",
  plugin: "square",
  framework: "circle",
  documentation: "rect",
};

export default function KnowledgeGraphPage() {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [filters, setFilters] = useState<Filters>({ nodeTypes: [] });
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [nodeType, setNodeType] = useState("");
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    fetchGraph();
  }, [nodeType]);

  useEffect(() => {
    if (nodes.length > 0 && edges.length > 0) {
      initializePositions();
    }
  }, [nodes, edges]);

  async function fetchGraph() {
    setLoading(true);
    const params = new URLSearchParams();
    if (nodeType) params.set("nodeType", nodeType);

    const res = await fetch(`/api/knowledge-graph?${params}`);
    const data = await res.json();
    setNodes(data.nodes);
    setEdges(data.edges);
    setFilters(data.filters);
    setLoading(false);
  }

  function initializePositions() {
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const radius = Math.min(dimensions.width, dimensions.height) / 3;

    const nodeTypeGroups: Record<string, GraphNode[]> = {};
    nodes.forEach((node) => {
      if (!nodeTypeGroups[node.node_type]) {
        nodeTypeGroups[node.node_type] = [];
      }
      nodeTypeGroups[node.node_type].push(node);
    });

    const types = Object.keys(nodeTypeGroups);
    const updatedNodes = nodes.map((node, i) => {
      const typeIndex = types.indexOf(node.node_type);
      const nodesInType = nodeTypeGroups[node.node_type];
      const indexInType = nodesInType.indexOf(node);
      const angle =
        (typeIndex / types.length) * Math.PI * 2 +
        (indexInType / nodesInType.length) * 0.5;
      const r = radius * (0.5 + (typeIndex % 2) * 0.5);

      return {
        ...node,
        x: centerX + Math.cos(angle) * r,
        y: centerY + Math.sin(angle) * r,
        vx: 0,
        vy: 0,
      };
    });

    setNodes(updatedNodes);
  }

  function getNodePosition(nodeId: string) {
    const node = nodes.find((n) => n.id === nodeId);
    return node ? { x: node.x || 0, y: node.y || 0 } : { x: 0, y: 0 };
  }

  function getConnectedNodes(nodeId: string) {
    const connected = new Set<string>();
    edges.forEach((edge) => {
      if (edge.source_id === nodeId) connected.add(edge.target_id);
      if (edge.target_id === nodeId) connected.add(edge.source_id);
    });
    return connected;
  }

  const connectedNodes = selectedNode
    ? getConnectedNodes(selectedNode.id)
    : new Set<string>();

  return (
    <div
      className={`flex min-h-screen bg-[#0a0a0a] ${isFullscreen ? "fixed inset-0 z-50" : ""}`}
    >
      {!isFullscreen && <Sidebar />}
      <main className={`${isFullscreen ? "w-full" : "ml-[240px]"} flex-1 p-8`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-[#fafafa]">
                Knowledge Graph
              </h1>
              <p className="text-sm text-[#71717a] mt-1">
                Visualize relationships between repositories, patterns,
                technologies, and courses
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={nodeType}
                onChange={(e) => setNodeType(e.target.value)}
                className="px-3 py-1.5 bg-[#111111] border border-[#27272a] rounded-md text-sm text-[#a1a1aa] appearance-none cursor-pointer"
              >
                <option value="">All Node Types</option>
                {filters.nodeTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <button
                onClick={() => {
                  initializePositions();
                }}
                className="p-2 bg-[#111111] border border-[#27272a] rounded-md text-[#71717a] hover:text-[#fafafa] transition-colors"
              >
                <RotateCcw size={14} />
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 bg-[#111111] border border-[#27272a] rounded-md text-[#71717a] hover:text-[#fafafa] transition-colors"
              >
                {isFullscreen ? (
                  <Minimize2 size={14} />
                ) : (
                  <Maximize2 size={14} />
                )}
              </button>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex-1 bg-[#111111] border border-[#27272a] rounded-lg overflow-hidden">
              {loading ? (
                <div className="h-[600px] flex items-center justify-center">
                  <div className="text-sm text-[#71717a]">Loading graph...</div>
                </div>
              ) : (
                <svg
                  ref={svgRef}
                  width="100%"
                  height={isFullscreen ? "calc(100vh - 160px)" : "600"}
                  viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
                  className="bg-[#0a0a0a]"
                >
                  <defs>
                    <marker
                      id="arrowhead"
                      markerWidth="10"
                      markerHeight="7"
                      refX="10"
                      refY="3.5"
                      orient="auto"
                    >
                      <polygon points="0 0, 10 3.5, 0 7" fill="#52525b" />
                    </marker>
                  </defs>

                  {edges.map((edge) => {
                    const source = getNodePosition(edge.source_id);
                    const target = getNodePosition(edge.target_id);
                    const isHighlighted =
                      selectedNode &&
                      (edge.source_id === selectedNode.id ||
                        edge.target_id === selectedNode.id);

                    return (
                      <g key={edge.id}>
                        <line
                          x1={source.x}
                          y1={source.y}
                          x2={target.x}
                          y2={target.y}
                          stroke={isHighlighted ? "#3b82f6" : "#27272a"}
                          strokeWidth={isHighlighted ? 2 : 1}
                          strokeDasharray={isHighlighted ? "none" : "4"}
                          markerEnd="url(#arrowhead)"
                          opacity={
                            selectedNode ? (isHighlighted ? 1 : 0.3) : 0.6
                          }
                        />
                        {isHighlighted && (
                          <text
                            x={(source.x + target.x) / 2}
                            y={(source.y + target.y) / 2 - 5}
                            textAnchor="middle"
                            fill="#71717a"
                            fontSize="10"
                          >
                            {edge.relationship}
                          </text>
                        )}
                      </g>
                    );
                  })}

                  {nodes.map((node) => {
                    const isSelected = selectedNode?.id === node.id;
                    const isConnected = connectedNodes.has(node.id);
                    const color = nodeColors[node.node_type] || "#71717a";
                    const size = isSelected ? 24 : isConnected ? 20 : 16;

                    return (
                      <g
                        key={node.id}
                        onClick={() =>
                          setSelectedNode(isSelected ? null : node)
                        }
                        className="cursor-pointer"
                        opacity={
                          selectedNode
                            ? isSelected || isConnected
                              ? 1
                              : 0.3
                            : 1
                        }
                      >
                        {node.node_type === "repository" ? (
                          <rect
                            x={(node.x || 0) - size / 2}
                            y={(node.y || 0) - size / 2}
                            width={size}
                            height={size}
                            rx={4}
                            fill={color}
                            stroke={isSelected ? "#fafafa" : "none"}
                            strokeWidth={2}
                          />
                        ) : node.node_type === "technology" ? (
                          <polygon
                            points={`${node.x || 0},${(node.y || 0) - size / 2} ${(node.x || 0) + size / 2},${node.y || 0} ${node.x || 0},${(node.y || 0) + size / 2} ${(node.x || 0) - size / 2},${node.y || 0}`}
                            fill={color}
                            stroke={isSelected ? "#fafafa" : "none"}
                            strokeWidth={2}
                          />
                        ) : (
                          <circle
                            cx={node.x || 0}
                            cy={node.y || 0}
                            r={size / 2}
                            fill={color}
                            stroke={isSelected ? "#fafafa" : "none"}
                            strokeWidth={2}
                          />
                        )}
                        <text
                          x={node.x || 0}
                          y={(node.y || 0) + size / 2 + 14}
                          textAnchor="middle"
                          fill="#a1a1aa"
                          fontSize="10"
                        >
                          {node.label.length > 15
                            ? node.label.slice(0, 15) + "..."
                            : node.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              )}
            </div>

            {selectedNode && (
              <div className="w-[320px] flex-shrink-0">
                <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5 sticky top-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span
                        className="inline-block px-2 py-0.5 rounded text-[10px] font-medium mb-2"
                        style={{
                          backgroundColor:
                            nodeColors[selectedNode.node_type] + "33",
                          color: nodeColors[selectedNode.node_type],
                        }}
                      >
                        {selectedNode.node_type}
                      </span>
                      <h2 className="text-lg font-semibold text-[#fafafa]">
                        {selectedNode.label}
                      </h2>
                    </div>
                    <button
                      onClick={() => setSelectedNode(null)}
                      className="text-[#71717a] hover:text-[#fafafa] transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xs text-[#71717a] uppercase tracking-wider mb-2">
                        Connections
                      </h3>
                      <div className="space-y-2">
                        {edges
                          .filter(
                            (e) =>
                              e.source_id === selectedNode.id ||
                              e.target_id === selectedNode.id,
                          )
                          .map((edge) => {
                            const connectedId =
                              edge.source_id === selectedNode.id
                                ? edge.target_id
                                : edge.source_id;
                            const connectedNode = nodes.find(
                              (n) => n.id === connectedId,
                            );
                            return (
                              <button
                                key={edge.id}
                                onClick={() =>
                                  connectedNode &&
                                  setSelectedNode(connectedNode)
                                }
                                className="w-full flex items-center justify-between p-2 bg-[#0a0a0a] border border-[#27272a] rounded text-left hover:border-[#3b82f6] transition-colors"
                              >
                                <span className="text-xs text-[#fafafa]">
                                  {connectedNode?.label}
                                </span>
                                <span className="text-[10px] text-[#52525b]">
                                  {edge.relationship}
                                </span>
                              </button>
                            );
                          })}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs text-[#71717a] uppercase tracking-wider mb-2">
                        Metadata
                      </h3>
                      <pre className="text-xs text-[#a1a1aa] bg-[#0a0a0a] border border-[#27272a] rounded p-2 overflow-x-auto">
                        {JSON.stringify(
                          JSON.parse(selectedNode.metadata),
                          null,
                          2,
                        )}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center gap-6">
            <div className="flex items-center gap-4">
              {Object.entries(nodeColors).map(([type, color]) => (
                <div key={type} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs text-[#71717a] capitalize">
                    {type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
