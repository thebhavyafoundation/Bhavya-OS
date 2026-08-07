"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NotebookCell {
  id: string;
  type: "code" | "markdown";
  content: string;
  output?: string;
}

interface NotebookViewerProps {
  cells?: NotebookCell[];
}

const defaultCells: NotebookCell[] = [
  {
    id: "cell-1",
    type: "code",
    content: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score`,
    output: ">>> All imports loaded successfully",
  },
  {
    id: "cell-2",
    type: "code",
    content: `X, y = make_classification(
    n_samples=1000,
    n_features=10,
    n_informative=5,
    n_classes=2,
    random_state=42
)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print(f"Training samples: {X_train.shape[0]}")
print(f"Test samples: {X_test.shape[0]}")
print(f"Features: {X_train.shape[1]}")`,
    output: `Training samples: 800
Test samples: 200
Features: 10`,
  },
  {
    id: "cell-3",
    type: "markdown",
    content: `## Model Training

We use a **Random Forest Classifier** with 100 estimators. This ensemble method combines multiple decision trees to improve prediction accuracy and reduce overfitting.`,
  },
  {
    id: "cell-4",
    type: "code",
    content: `model = RandomForestClassifier(
    n_estimators=100,
    max_depth=10,
    random_state=42
)

model.fit(X_train, y_train)

y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print(f"Model Accuracy: {accuracy:.2%}")
print(f"Feature Importances: {model.feature_importances_[:3]}")`,
    output: `Model Accuracy: 92.50%
Feature Importances: [0.15 0.12 0.11]`,
  },
];

export function NotebookViewer({
  cells: initialCells = defaultCells,
}: NotebookViewerProps) {
  const [cells, setCells] = useState<NotebookCell[]>(initialCells);
  const [collapsedCells, setCollapsedCells] = useState<Set<string>>(new Set());
  const [runningCell, setRunningCell] = useState<string | null>(null);

  const toggleCollapse = (id: string) => {
    setCollapsedCells((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleType = (id: string) => {
    setCells((prev) =>
      prev.map((cell) =>
        cell.id === id
          ? { ...cell, type: cell.type === "code" ? "markdown" : "code" }
          : cell,
      ),
    );
  };

  const runCell = (id: string) => {
    setRunningCell(id);
    setTimeout(() => {
      setCells((prev) =>
        prev.map((cell) =>
          cell.id === id
            ? { ...cell, output: ">>> Cell executed successfully" }
            : cell,
        ),
      );
      setRunningCell(null);
    }, 1000);
  };

  const addCell = () => {
    const newCell: NotebookCell = {
      id: `cell-${Date.now()}`,
      type: "code",
      content: "",
      output: "",
    };
    setCells((prev) => [...prev, newCell]);
  };

  const updateContent = (id: string, content: string) => {
    setCells((prev) =>
      prev.map((cell) => (cell.id === id ? { ...cell, content } : cell)),
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-mono font-bold text-[#c9a227]">
          Notebook Viewer
        </h3>
        <span className="text-xs font-mono text-[#8a7359]">
          {cells.length} cells
        </span>
      </div>

      {cells.map((cell, index) => (
        <motion.div
          key={cell.id}
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-lg border border-[#1a3a2a] overflow-hidden"
          style={{ backgroundColor: "#0a0f0d" }}
        >
          <div
            className="flex items-center justify-between px-3 py-2 border-b border-[#1a3a2a] cursor-pointer"
            style={{ backgroundColor: "#1a3a2a" }}
            onClick={() => toggleCollapse(cell.id)}
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-[#c9a227] bg-[#0a0f0d] px-2 py-0.5 rounded">
                [{index + 1}]
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleType(cell.id);
                }}
                className={`px-2 py-0.5 text-xs font-mono rounded transition-colors ${
                  cell.type === "code"
                    ? "bg-[#8a7359] text-[#0a0f0d]"
                    : "bg-[#0a0f0d] text-[#f5f1e6]"
                }`}
              >
                {cell.type}
              </button>
              {cell.type === "code" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    runCell(cell.id);
                  }}
                  disabled={runningCell === cell.id}
                  className="px-2 py-0.5 text-xs font-mono rounded bg-[#c9a227] text-[#0a0f0d] hover:bg-[#8a7359] transition-colors disabled:opacity-50"
                >
                  {runningCell === cell.id ? "..." : "▶ Run"}
                </button>
              )}
            </div>
            <span className="text-[#8a7359] text-sm">
              {collapsedCells.has(cell.id) ? "▶" : "▼"}
            </span>
          </div>

          <AnimatePresence>
            {!collapsedCells.has(cell.id) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <textarea
                  value={cell.content}
                  onChange={(e) => updateContent(cell.id, e.target.value)}
                  className={`w-full p-4 bg-transparent text-[#f5f1e6] font-mono text-sm resize-none focus:outline-none leading-5 ${
                    cell.type === "markdown" ? "prose prose-invert" : ""
                  }`}
                  style={{
                    backgroundColor: "transparent",
                    minHeight: cell.type === "markdown" ? "60px" : "80px",
                  }}
                  spellCheck={false}
                />

                {cell.type === "code" && cell.output && (
                  <div className="border-t border-[#1a3a2a]">
                    <div className="px-4 py-1 text-xs font-mono text-[#8a7359] border-b border-[#1a3a2a]">
                      Output
                    </div>
                    <pre
                      className="p-4 text-sm font-mono text-green-400 whitespace-pre-wrap leading-5"
                      style={{ backgroundColor: "#0a0f0d" }}
                    >
                      {cell.output}
                    </pre>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={addCell}
        className="w-full py-3 border-2 border-dashed border-[#1a3a2a] rounded-lg text-[#8a7359] font-mono text-sm hover:border-[#c9a227] hover:text-[#c9a227] transition-colors"
      >
        + Add Cell
      </motion.button>
    </div>
  );
}
