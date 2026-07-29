import { Annotation, END, START, StateGraph } from "@langchain/langgraph";
import type { ResearchDependencies, ResearchRequest, ResearchState } from "./types";

const state = Annotation.Root({
  request: Annotation<ResearchRequest>(),
  plan: Annotation<string[]>({ reducer: (_, next) => next, default: () => [] }),
  sources: Annotation<ResearchState["sources"]>({ reducer: (_, next) => next, default: () => [] }),
  synthesis: Annotation<string>({ reducer: (_, next) => next, default: () => "" }),
  memoryId: Annotation<string | undefined>({ reducer: (_, next) => next, default: () => undefined }),
  status: Annotation<ResearchState["status"]>({ reducer: (_, next) => next, default: () => "pending" }),
  error: Annotation<string | undefined>({ reducer: (_, next) => next, default: () => undefined }),
});

type GraphState = typeof state.State;

/** Build the long-running research workflow as explicit LangGraph nodes. */
export function buildResearchGraph(deps: ResearchDependencies) {
  const graph = new StateGraph(state)
    .addNode("plan", async (current: GraphState) => {
      const plan = await deps.model.complete(`Create a concise research plan for: ${current.request.question}\nTopic: ${current.request.topic}`);
      return { plan: plan.split("\n").map((line) => line.replace(/^[-*0-9. ]+/, "").trim()).filter(Boolean), status: "running" as const };
    })
    .addNode("gather", async (current: GraphState) => {
      const queries = current.plan.length ? current.plan : [current.request.question];
      const batches = await Promise.all(queries.map((query) => deps.web.search(query)));
      const sources = batches.flat().slice(0, 20);
      if (!sources.length) throw new Error("Research gather node found no sources");
      return { sources };
    })
    .addNode("synthesize", async (current: GraphState) => {
      const context = current.sources.map((source) => `SOURCE: ${source.title} (${source.url})\n${source.content}`).join("\n\n");
      const synthesis = await deps.model.complete(`Answer this research question with evidence and uncertainty clearly stated.\nQuestion: ${current.request.question}\n\n${context}`);
      return { synthesis };
    })
    .addNode("persist", async (current: GraphState) => {
      const memoryId = await deps.memory.upsert({ text: current.synthesis, source: "research-graph", metadata: { topic: current.request.topic, timestamp: new Date().toISOString(), urls: current.sources.map((source) => source.url) } });
      const completed = { ...current, memoryId, status: "completed" as const };
      await deps.structured.saveResearch({ request: current.request, state: completed });
      if (deps.workflow) await deps.workflow.notify("research.completed", { topic: current.request.topic, memoryId });
      return { memoryId, status: "completed" as const };
    })
    .addEdge(START, "plan")
    .addEdge("plan", "gather")
    .addEdge("gather", "synthesize")
    .addEdge("synthesize", "persist")
    .addEdge("persist", END);
  return graph.compile();
}

export async function runResearch(request: ResearchRequest, deps: ResearchDependencies): Promise<GraphState> {
  return (await buildResearchGraph(deps).invoke({ request })) as GraphState;
}
