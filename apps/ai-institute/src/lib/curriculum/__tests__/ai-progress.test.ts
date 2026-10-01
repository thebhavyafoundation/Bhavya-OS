import { afterEach, describe, expect, it } from "vitest";
import {
  AI_PROGRESS_STORAGE_KEY,
  loadProgress,
  mergeAIProgress,
  saveProgress,
  toggleExpanded,
  toggleModuleComplete,
  type AIProgressState,
} from "../ai-progress";

type WindowStub = { localStorage: Storage };
const g = globalThis as { window?: WindowStub };

function installStorage(entries?: Record<string, string>): Map<string, string> {
  const store = new Map<string, string>(Object.entries(entries ?? {}));
  g.window = {
    localStorage: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value);
      },
      removeItem: (key: string) => {
        store.delete(key);
      },
      clear: () => {
        store.clear();
      },
      key: (index: number) => [...store.keys()][index] ?? null,
      get length() {
        return store.size;
      },
    } as Storage,
  };
  return store;
}

afterEach(() => {
  delete g.window;
});

describe("loadProgress", () => {
  it("returns an empty state when localStorage is unavailable", () => {
    const state = loadProgress();
    expect(state.completedModules).toEqual([]);
    expect(state.expandedModules).toEqual([]);
  });

  it("returns an empty state when nothing is stored", () => {
    installStorage();
    expect(loadProgress()).toEqual({
      completedModules: [],
      expandedModules: [],
    });
  });

  it("round-trips a saved state", () => {
    installStorage();
    const saved: AIProgressState = {
      completedModules: ["ja-01", "l0-m1"],
      expandedModules: ["adv-01"],
    };
    saveProgress(saved);
    expect(loadProgress()).toEqual(saved);
  });

  it("returns an empty state for malformed JSON", () => {
    installStorage({ [AI_PROGRESS_STORAGE_KEY]: "{not json" });
    expect(loadProgress()).toEqual({
      completedModules: [],
      expandedModules: [],
    });
  });

  it("returns an empty state when fields have the wrong shape", () => {
    installStorage({
      [AI_PROGRESS_STORAGE_KEY]: JSON.stringify({
        completedModules: "ja-01",
        expandedModules: [],
      }),
    });
    expect(loadProgress()).toEqual({
      completedModules: [],
      expandedModules: [],
    });
  });

  it("drops non-string entries", () => {
    installStorage({
      [AI_PROGRESS_STORAGE_KEY]: JSON.stringify({
        completedModules: ["ja-01", 42, null],
        expandedModules: [],
      }),
    });
    expect(loadProgress()).toEqual({
      completedModules: ["ja-01"],
      expandedModules: [],
    });
  });
});

describe("toggleModuleComplete", () => {
  it("adds an incomplete module id", () => {
    const next = toggleModuleComplete(
      { completedModules: [], expandedModules: [] },
      "l0-m1",
    );
    expect(next.completedModules).toEqual(["l0-m1"]);
  });

  it("removes a completed module id", () => {
    const next = toggleModuleComplete(
      { completedModules: ["l0-m1", "l0-m2"], expandedModules: [] },
      "l0-m1",
    );
    expect(next.completedModules).toEqual(["l0-m2"]);
  });

  it("does not mutate the previous state", () => {
    const prev: AIProgressState = {
      completedModules: [],
      expandedModules: [],
    };
    toggleModuleComplete(prev, "ja-01");
    expect(prev.completedModules).toEqual([]);
  });
});

describe("toggleExpanded", () => {
  it("adds an unexpanded module id", () => {
    const next = toggleExpanded(
      { completedModules: [], expandedModules: [] },
      "adv-01",
    );
    expect(next.expandedModules).toEqual(["adv-01"]);
  });

  it("removes an expanded module id", () => {
    const next = toggleExpanded(
      { completedModules: [], expandedModules: ["adv-01"] },
      "adv-01",
    );
    expect(next.expandedModules).toEqual([]);
  });

  it("does not mutate the previous state", () => {
    const prev: AIProgressState = {
      completedModules: [],
      expandedModules: [],
    };
    toggleExpanded(prev, "adv-01");
    expect(prev.expandedModules).toEqual([]);
  });
});

describe("mergeAIProgress", () => {
  it("unions completed modules with primary order first", () => {
    const merged = mergeAIProgress(
      { completedModules: ["l0-m1", "ja-01"], expandedModules: ["l0-m1"] },
      { completedModules: ["l0-m7", "l0-m1"], expandedModules: [] },
    );
    expect(merged.completedModules).toEqual(["l0-m1", "ja-01", "l0-m7"]);
  });

  it("keeps the primary expanded state", () => {
    const merged = mergeAIProgress(
      { completedModules: [], expandedModules: ["l0-m1"] },
      { completedModules: [], expandedModules: ["adv-01"] },
    );
    expect(merged.expandedModules).toEqual(["l0-m1"]);
  });

  it("returns an equivalent state when the secondary adds nothing", () => {
    const primary: AIProgressState = {
      completedModules: ["l0-m1"],
      expandedModules: ["l0-m7"],
    };
    const merged = mergeAIProgress(primary, {
      completedModules: ["l0-m1"],
      expandedModules: [],
    });
    expect(merged).toEqual(primary);
  });

  it("does not mutate either input state", () => {
    const primary: AIProgressState = {
      completedModules: ["l0-m1"],
      expandedModules: [],
    };
    const secondary: AIProgressState = {
      completedModules: ["l0-m7"],
      expandedModules: [],
    };
    mergeAIProgress(primary, secondary);
    expect(primary.completedModules).toEqual(["l0-m1"]);
    expect(secondary.completedModules).toEqual(["l0-m7"]);
  });
});
