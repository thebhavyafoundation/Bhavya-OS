"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const lesson = {
  id: "linear-regression",
  moduleId: "foundations",
  moduleTitle: "Foundations",
  moduleNumber: 1,
  title: "Lesson 1.3: Linear Regression",
  duration: "45 min",
  difficulty: "Intermediate",
  objectives: [
    "Understand the mathematical foundation of linear regression",
    "Implement the cost function and gradient descent from scratch",
    "Apply linear regression to predict continuous outcomes",
    "Evaluate model fit using R-squared and residual analysis",
  ],
  content: [
    {
      type: "heading",
      text: "What is Linear Regression?",
    },
    {
      type: "paragraph",
      text: "Linear regression is the simplest and most fundamental algorithm in machine learning. It models the relationship between a dependent variable and one or more independent variables by fitting a linear equation to observed data.",
    },
    {
      type: "paragraph",
      text: "At its core, linear regression answers a deceptively simple question: given a set of data points, what is the best straight line that describes the relationship between them?",
    },
    {
      type: "heading",
      text: "The Equation: y = mx + b",
    },
    {
      type: "paragraph",
      text: "Every linear regression model can be expressed using the familiar equation of a line:",
    },
    {
      type: "code",
      language: "python",
      code: `# The fundamental equation of linear regression
# y = mx + b

# Where:
# y = predicted output (dependent variable)
# m = slope (weight) — how much y changes for each unit of x
# b = y-intercept (bias) — the value of y when x = 0

# Example: Predicting house prices based on square footage
# price = 150 * sq_footage + 50000

# If sq_footage = 1000:
price = 150 * 1000 + 50000
print(f"Predicted price: \${price:,}")  # $200,000

# If sq_footage = 2000:
price = 150 * 2000 + 50000
print(f"Predicted price: \${price:,}")  # $350,000`,
    },
    {
      type: "paragraph",
      text: "In machine learning terminology, we call m the weight (w) and b the bias. The goal of linear regression is to find the optimal values of w and b that minimize the error between our predictions and the actual data.",
    },
    {
      type: "heading",
      text: "The Cost Function",
    },
    {
      type: "paragraph",
      text: "To find the best line, we need a way to measure how wrong our predictions are. The most common metric is the Mean Squared Error (MSE):",
    },
    {
      type: "code",
      language: "python",
      code: `import numpy as np

def compute_cost(X, y, w, b):
    """
    Compute the mean squared error cost function.
    
    Args:
        X: feature values (n samples)
        y: actual values (n samples)
        w: current weight
        b: current bias
    
    Returns:
        Average squared difference between predictions and actuals
    """
    m = len(y)
    predictions = w * X + b
    squared_errors = (predictions - y) ** 2
    cost = (1 / (2 * m)) * np.sum(squared_errors)
    return cost

# Example data: house sizes vs prices
X = np.array([1.0, 1.5, 2.0, 2.5, 3.0])  # sq footage (hundreds)
y = np.array([100, 150, 200, 240, 310])    # price ($k)

# Try different weights
cost_w1 = compute_cost(X, y, w=100, b=0)
cost_w2 = compute_cost(X, y, w=90, b=10)

print(f"Cost with w=100, b=0: {cost_w1:.2f}")
print(f"Cost with w=90, b=10:  {cost_w2:.2f}")`,
    },
    {
      type: "heading",
      text: "Gradient Descent: Finding the Optimal Weights",
    },
    {
      type: "paragraph",
      text: "Gradient descent is the algorithm that allows us to automatically find the best weights. It works by iteratively adjusting w and b in the direction that reduces the cost function.",
    },
    {
      type: "paragraph",
      text: "Think of it like rolling a ball down a hill. The ball naturally finds the lowest point. Similarly, gradient descent takes steps proportional to the negative of the gradient (slope) at the current point.",
    },
    {
      type: "code",
      language: "python",
      code: `def gradient_descent(X, y, w_init, b_init, learning_rate, iterations):
    """
    Perform gradient descent to learn w and b.
    
    Args:
        X, y: training data
        w_init, b_init: initial parameter values
        learning_rate: step size (alpha)
        iterations: number of iterations
    
    Returns:
        w, b: optimized parameters
        cost_history: cost at each iteration
    """
    w = w_init
    b = b_init
    m = len(y)
    cost_history = []
    
    for i in range(iterations):
        # Forward pass: compute predictions
        predictions = w * X + b
        
        # Compute gradients
        dw = (1 / m) * np.sum((predictions - y) * X)
        db = (1 / m) * np.sum(predictions - y)
        
        # Update parameters
        w = w - learning_rate * dw
        b = b - learning_rate * db
        
        # Track cost
        cost = compute_cost(X, y, w, b)
        cost_history.append(cost)
        
        if i % 100 == 0:
            print(f"Iteration {i}: Cost = {cost:.4f}, w = {w:.4f}, b = {b:.4f}")
    
    return w, b, cost_history

# Run gradient descent
w_init = 0
b_init = 0
learning_rate = 0.1
iterations = 1000

w_optimal, b_optimal, costs = gradient_descent(
    X, y, w_init, b_init, learning_rate, iterations
)

print(f"\\nOptimal: w = {w_optimal:.4f}, b = {b_optimal:.4f}")`,
    },
    {
      type: "heading",
      text: "Making Predictions",
    },
    {
      type: "paragraph",
      text: "Once we have our trained model, making predictions is as simple as plugging new values into our equation:",
    },
    {
      type: "code",
      language: "python",
      code: `def predict(X_new, w, b):
    """Make predictions using the trained model."""
    return w * X_new + b

# Predict price for a 3500 sq ft house (3.5 in our scale)
new_house = 3.5
predicted_price = predict(new_house, w_optimal, b_optimal)

print(f"Predicted price for {new_house * 1000:.0f} sq ft:")
print(f"\${predicted_price * 1000:,.0f}")`,
    },
    {
      type: "heading",
      text: "Evaluating Model Performance",
    },
    {
      type: "paragraph",
      text: "R-squared (R²) measures how well our model explains the variance in the data. A value of 1.0 means perfect prediction; 0.0 means the model is no better than predicting the mean.",
    },
    {
      type: "code",
      language: "python",
      code: `def r_squared(X, y, w, b):
    """Compute R-squared (coefficient of determination)."""
    predictions = w * X + b
    ss_res = np.sum((y - predictions) ** 2)  # residual sum of squares
    ss_tot = np.sum((y - np.mean(y)) ** 2)   # total sum of squares
    return 1 - (ss_res / ss_tot)

r2 = r_squared(X, y, w_optimal, b_optimal)
print(f"R-squared: {r2:.4f}")  # Close to 1.0 = good fit`,
    },
  ],
  takeaways: [
    "Linear regression finds the best straight line through data by optimizing weight (m) and bias (b)",
    "The cost function (MSE) measures prediction error — gradient descent minimizes it iteratively",
    "Learning rate controls step size: too large diverges, too small converges slowly",
    "R-squared tells you what percentage of variance your model explains",
    "Linear regression is the foundation for understanding all of machine learning",
  ],
  checkpoints: [
    {
      question:
        "In the equation y = mx + b, what does 'm' represent in ML terminology?",
      options: [
        "The bias term",
        "The weight (slope)",
        "The learning rate",
        "The cost function",
      ],
      correct: 1,
      explanation:
        "In ML, 'm' is called the weight. It determines how much the output changes for each unit change in the input. A larger weight means a steeper slope.",
    },
    {
      question:
        "What happens if the learning rate is too large in gradient descent?",
      options: [
        "The model converges faster",
        "The cost function increases and the model diverges",
        "The model finds a better minimum",
        "Nothing changes",
      ],
      correct: 1,
      explanation:
        "A learning rate that's too large causes the algorithm to overshoot the minimum. Instead of converging, the cost oscillates or increases, leading to divergence.",
    },
  ],
  nextLesson: {
    id: "model-evaluation",
    title: "Model Evaluation",
  },
  prevLesson: {
    id: "types-of-learning",
    title: "Types of Learning",
  },
};

const difficultyColor: Record<string, string> = {
  Beginner: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Intermediate: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Advanced: "bg-red-500/10 text-red-400 border-red-500/20",
};

function Checkpoint({
  checkpoint,
  index,
}: {
  checkpoint: (typeof lesson.checkpoints)[0];
  index: number;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const isCorrect = selected === checkpoint.correct;
  const showFeedback = selected !== null;

  return (
    <div className="rounded-xl border border-[#c9a227]/20 bg-[#c9a227]/[0.03] p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/20 flex items-center justify-center">
          <span className="text-[10px] font-bold text-[#c9a227]">
            {index + 1}
          </span>
        </div>
        <span className="text-xs font-medium text-[#c9a227] uppercase tracking-wider">
          Checkpoint
        </span>
      </div>

      <p className="text-sm font-medium text-[#f5f1e6] mb-4">
        {checkpoint.question}
      </p>

      <div className="space-y-2">
        {checkpoint.options.map((option, i) => {
          const isSelected = selected === i;
          const isOptionCorrect = i === checkpoint.correct;
          let optionStyle =
            "border-white/10 bg-white/[0.02] hover:border-white/20";
          if (showFeedback && isOptionCorrect) {
            optionStyle = "border-emerald-500/40 bg-emerald-500/10";
          } else if (showFeedback && isSelected && !isCorrect) {
            optionStyle = "border-red-500/40 bg-red-500/10";
          }

          return (
            <button
              key={i}
              onClick={() => !showFeedback && setSelected(i)}
              disabled={showFeedback}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all duration-200 ${optionStyle}`}
            >
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                  showFeedback && isOptionCorrect
                    ? "border-emerald-500 bg-emerald-500/20"
                    : showFeedback && isSelected
                      ? "border-red-500 bg-red-500/20"
                      : "border-white/20"
                }`}
              >
                {showFeedback && isOptionCorrect && (
                  <svg
                    className="w-3 h-3 text-emerald-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
                {showFeedback && isSelected && !isOptionCorrect && (
                  <svg
                    className="w-3 h-3 text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </div>
              <span
                className={`text-sm ${
                  showFeedback && isOptionCorrect
                    ? "text-emerald-300"
                    : showFeedback && isSelected && !isCorrect
                      ? "text-red-300"
                      : "text-[#f5f1e6]/70"
                }`}
              >
                {option}
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div
              className={`mt-4 p-4 rounded-lg border ${
                isCorrect
                  ? "border-emerald-500/20 bg-emerald-500/5"
                  : "border-red-500/20 bg-red-500/5"
              }`}
            >
              <p
                className={`text-xs font-medium mb-1 ${
                  isCorrect ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {isCorrect ? "Correct!" : "Not quite."}
              </p>
              <p className="text-sm text-[#f5f1e6]/70 leading-relaxed">
                {checkpoint.explanation}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-white/5 bg-[#0d1210] overflow-hidden my-6">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          </div>
          <span className="text-[10px] text-[#8a7359] ml-2 uppercase tracking-wider">
            {language}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] text-[#8a7359] hover:text-[#f5f1e6] bg-white/5 hover:bg-white/10 rounded-md transition-all duration-200"
          >
            {copied ? (
              <>
                <svg
                  className="w-3 h-3 text-emerald-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Copy
              </>
            )}
          </button>
          <button className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] text-[#8a7359] hover:text-[#f5f1e6] bg-white/5 hover:bg-white/10 rounded-md transition-all duration-200">
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Run Code
          </button>
        </div>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm leading-relaxed">
          <code className="text-[#f5f1e6]/80 font-mono">{code}</code>
        </pre>
      </div>
    </div>
  );
}

export default function LessonPage() {
  const params = useParams();
  const progress = 60;

  return (
    <div className="min-h-screen bg-[#0a0f0d]">
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-[#1a3a2a] via-[#c9a227] to-[#1a3a2a]"
        />
      </div>

      <nav className="sticky top-0 z-40 border-b border-white/5 bg-[#0a0f0d]/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href={`/courses/${lesson.moduleId}`}
            className="text-sm text-[#8a7359] hover:text-[#f5f1e6] transition-colors duration-200"
          >
            ← Module {lesson.moduleNumber}: {lesson.moduleTitle}
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-xs text-[#8a7359]">{lesson.duration}</span>
            <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#c9a227] rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-6 py-12">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full border ${
                difficultyColor[lesson.difficulty]
              }`}
            >
              {lesson.difficulty}
            </span>
            <span className="text-sm text-[#8a7359]">{lesson.duration}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-[#f5f1e6] mb-4 tracking-tight">
            {lesson.title}
          </h1>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="rounded-xl border border-[#1a3a2a]/50 bg-[#1a3a2a]/10 p-6 mb-12"
        >
          <h2 className="text-sm font-semibold text-[#c9a227] mb-4 flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Learning Objectives
          </h2>
          <ul className="space-y-2.5">
            {lesson.objectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[10px] font-bold text-[#c9a227]">
                    {i + 1}
                  </span>
                </span>
                <span className="text-sm text-[#f5f1e6]/80 leading-relaxed">
                  {obj}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>

        <div className="space-y-8">
          {lesson.content.map((block, i) => {
            if (block.type === "heading") {
              return (
                <motion.h2
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.03 }}
                  className="text-xl font-semibold text-[#f5f1e6] mt-12 mb-4"
                >
                  {block.text}
                </motion.h2>
              );
            }

            if (block.type === "paragraph") {
              return (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.03 }}
                  className="text-[15px] text-[#f5f1e6]/70 leading-[1.8]"
                >
                  {block.text}
                </motion.p>
              );
            }

            if (block.type === "code") {
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.03 }}
                >
                  <CodeBlock
                    code={block.code as string}
                    language={block.language as string}
                  />
                </motion.div>
              );
            }

            return null;
          })}
        </div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 space-y-6"
        >
          <h2 className="text-xl font-semibold text-[#f5f1e6]">
            Knowledge Check
          </h2>
          {lesson.checkpoints.map((cp, i) => (
            <Checkpoint key={i} checkpoint={cp} index={i} />
          ))}
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 rounded-xl border border-[#1a3a2a]/50 bg-[#1a3a2a]/10 p-6"
        >
          <h2 className="text-xl font-semibold text-[#f5f1e6] mb-4">
            Key Takeaways
          </h2>
          <ul className="space-y-3">
            {lesson.takeaways.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <svg
                  className="w-4 h-4 text-[#c9a227] mt-1 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4"
                  />
                </svg>
                <span className="text-sm text-[#f5f1e6]/80 leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </motion.section>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-16 flex items-center justify-between gap-4"
        >
          <Link
            href={`/courses/foundations/lessons/${lesson.prevLesson.id}`}
            className="flex-1 group p-5 rounded-xl border border-white/5 bg-[#111916] hover:border-white/10 transition-all duration-200"
          >
            <span className="text-[10px] text-[#8a7359] uppercase tracking-wider">
              Previous
            </span>
            <p className="text-sm font-medium text-[#f5f1e6]/70 group-hover:text-[#f5f1e6] mt-1 transition-colors">
              ← {lesson.prevLesson.title}
            </p>
          </Link>

          <Link
            href={`/courses/foundations/lessons/${lesson.nextLesson.id}`}
            className="flex-1 group p-5 rounded-xl border border-white/5 bg-[#111916] hover:border-[#c9a227]/20 transition-all duration-200 text-right"
          >
            <span className="text-[10px] text-[#8a7359] uppercase tracking-wider">
              Next
            </span>
            <p className="text-sm font-medium text-[#f5f1e6]/70 group-hover:text-[#f5f1e6] mt-1 transition-colors">
              {lesson.nextLesson.title} →
            </p>
          </Link>
        </motion.div>
      </article>
    </div>
  );
}
