type KnowledgeNode = {
  id: string;
  title: string;
  slug: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  description: string;
  whyItExists: string;
  history: string;
  prerequisites: string[];
  relatedConcepts: string[];
  examples: { title: string; description: string; code?: string }[];
  realWorldUseCases: string[];
  commonMistakes: string[];
  interviewQuestions: string[];
  glossary: { term: string; definition: string }[];
  references: {
    title: string;
    url: string;
    type: "paper" | "article" | "video" | "book";
  }[];
  estimatedMinutes: number;
  projects: string[];
};

export const mathematicsConcepts: KnowledgeNode[] = [
  {
    id: "linear-algebra",
    title: "Linear Algebra for AI",
    slug: "linear-algebra-for-ai",
    category: "mathematics",
    difficulty: "beginner",
    description:
      "Linear algebra is the mathematics of vectors, matrices, and linear transformations. In AI, every neural network computation—from embedding layers to attention mechanisms—is fundamentally matrix multiplication. Understanding vectors as data points, matrices as transformations, and operations like dot products and matrix multiplication is the single most important mathematical foundation for machine learning.",
    whyItExists:
      "Neural networks represent data as vectors and transform it through weight matrices. A single forward pass through a dense layer is literally y = Wx + b. Without linear algebra, you cannot understand how embeddings work, how convolutions operate, or how attention is computed. It is the language that GPUs are optimized for and that every deep learning framework speaks.",
    history:
      "Linear algebra originated in the study of systems of linear equations in the 17th century. The modern form emerged in the 19th century through the work of Gauss, Cauchy, and Cayley. Gilbert Strang at MIT revolutionized its teaching in the 20th century, emphasizing geometric intuition. The connection to computing was established when Alan Turing described the LU decomposition in 1948. Today, linear algebra underpins all of computational science.",
    prerequisites: [],
    relatedConcepts: [
      "calculus-ml",
      "matrix-decomposition",
      "optimization-theory",
      "kernel-methods",
    ],
    examples: [
      {
        title: "Vector Operations",
        description:
          "Vectors represent data points, features, or directions in space. The dot product measures similarity between two vectors, which is the basis of cosine similarity in recommendation systems.",
        code: `import numpy as np

# Feature vectors for two users (movie ratings)
user_a = np.array([5, 3, 0, 1, 4])
user_b = np.array([4, 0, 0, 1, 3])

# Dot product: measures overlap
dot_product = np.dot(user_a, user_b)
print(f"Dot product: {dot_product}")  # 33

# Cosine similarity: normalized dot product
cos_sim = dot_product / (np.linalg.norm(user_a) * np.linalg.norm(user_b))
print(f"Cosine similarity: {cos_sim:.3f}")  # 0.974`,
      },
      {
        title: "Matrix Multiplication as Transformation",
        description:
          "Multiplying by a matrix transforms the input space. A rotation matrix rotates vectors, a scaling matrix stretches them. Neural network layers are learned transformations.",
        code: `import numpy as np

# Identity matrix: no transformation
I = np.eye(3)
v = np.array([1, 2, 3])
print(f"Identity: {I @ v}")  # [1. 2. 3.]

# Scaling matrix: stretch x by 2, y by 3, z by 0.5
S = np.diag([2, 3, 0.5])
print(f"Scaled: {S @ v}")  # [2. 6. 1.5]

# Rotation matrix (90 degrees in xy-plane)
theta = np.pi / 2
R = np.array([
    [np.cos(theta), -np.sin(theta), 0],
    [np.sin(theta),  np.cos(theta), 0],
    [0, 0, 1]
])
print(f"Rotated: {R @ v}")  # [-2.  1.  3.]`,
      },
      {
        title: "Broadcasting in Practice",
        description:
          "NumPy broadcasting allows operations between arrays of different shapes, which is how batch processing works in neural networks. A weight matrix applied to a batch of inputs uses broadcasting.",
        code: `import numpy as np

# Batch of 4 input vectors (4 samples, 3 features each)
X = np.array([
    [1.0, 2.0, 3.0],
    [4.0, 5.0, 6.0],
    [7.0, 8.0, 9.0],
    [1.0, 0.0, 1.0]
])

# Weight matrix (3 inputs -> 2 outputs)
W = np.array([
    [0.2, 0.8],
    [0.5, 0.1],
    [0.3, 0.6]
])

# Forward pass: matrix multiplication
output = X @ W
print(f"Output shape: {output.shape}")  # (4, 2)
print(output)`,
      },
      {
        title: "Eigenvalues and Eigenvectors",
        description:
          "Eigenvectors are directions that remain unchanged under a transformation (only scaled). Eigenvalues tell you the scaling factor. This concept is foundational for PCA, spectral clustering, and understanding matrix behavior.",
        code: `import numpy as np

# Covariance matrix of a dataset
data = np.array([
    [2.5, 2.4],
    [0.5, 0.7],
    [2.2, 2.9],
    [1.9, 2.2],
    [3.1, 3.0]
])
cov_matrix = np.cov(data.T)

# Eigendecomposition
eigenvalues, eigenvectors = np.linalg.eig(cov_matrix)

print(f"Eigenvalues: {eigenvalues}")    # Variance explained
print(f"Eigenvectors:\\n{eigenvectors}") # Principal directions

# The first eigenvector points in the direction of maximum variance
# This is the basis of PCA (Principal Component Analysis)`,
      },
    ],
    realWorldUseCases: [
      "Neural network forward passes: every dense layer computes y = Wx + b",
      "Image processing: images are matrices, convolutions are linear filters",
      "Recommendation systems: user-item matrices factorized via SVD",
      "Natural language processing: word embeddings are vectors in high-dimensional space",
      "Computer graphics: 3D transformations (rotation, scaling, translation) are matrix operations",
    ],
    commonMistakes: [
      "Confusing matrix multiplication order: A @ B ≠ B @ A. Matrix multiplication is not commutative, and the order determines which space you are mapping from and to.",
      "Ignoring shape mismatches: A (4x3) matrix times a (2x1) vector is undefined. Always track shapes: (m×n) @ (n×p) = (m×p).",
      "Assuming matrices are invertible: singular matrices (determinant = 0) cannot be inverted. This causes numerical errors in linear solvers.",
    ],
    interviewQuestions: [
      "Why is matrix multiplication O(n³) and what are alternatives for large matrices? Answer: Naive multiplication requires n³ multiply-adds. Strassen's algorithm reduces this to O(n^2.81). In practice, GPU parallelism and cache-efficient tiling are used.",
      "What is the geometric interpretation of the dot product? Answer: The dot product A·B = |A||B|cos(θ), so it measures how aligned two vectors are. When vectors are unit length, the dot product equals cosine similarity.",
      "How does backpropagation use the transpose of the weight matrix? Answer: If the forward pass computes y = Wx, the gradient with respect to x is W^T times the upstream gradient, because the gradient flows backward through the same linear transformation.",
    ],
    glossary: [
      {
        term: "Vector",
        definition:
          "An ordered list of numbers representing a point or direction in n-dimensional space. In ML, a feature vector encodes the attributes of a data point.",
      },
      {
        term: "Matrix",
        definition:
          "A rectangular array of numbers arranged in rows and columns. Matrices represent linear transformations, datasets (rows=samples, columns=features), and neural network weights.",
      },
      {
        term: "Dot Product",
        definition:
          "The sum of element-wise products of two vectors. It measures the projection of one vector onto another and is the foundation of similarity measures.",
      },
      {
        term: "Eigenvalue",
        definition:
          "A scalar λ such that Av = λv for some non-zero vector v. Eigenvalues indicate how much the corresponding eigenvector is stretched by the transformation A.",
      },
    ],
    references: [
      {
        title: "MIT 18.06 Linear Algebra (Gilbert Strang)",
        url: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/",
        type: "video",
      },
      {
        title: "Immersive Linear Algebra",
        url: "http://immersivemath.com/ila/",
        type: "book",
      },
    ],
    estimatedMinutes: 90,
    projects: [
      "Implement cosine similarity search from scratch and compare it with a brute-force approach on 10k vectors",
      "Build a simple image compression tool using low-rank matrix approximation",
      "Visualize how 2D matrices transform the unit square in real-time",
    ],
  },
  {
    id: "calculus-ml",
    title: "Calculus for Machine Learning",
    slug: "calculus-for-machine-learning",
    category: "mathematics",
    difficulty: "intermediate",
    description:
      "Calculus for machine learning focuses on derivatives, gradients, the chain rule, and partial derivatives. These concepts enable gradient descent, the algorithm that trains every neural network. Understanding how small changes in parameters affect the loss function is the core of optimization and backpropagation.",
    whyItExists:
      "Neural networks learn by minimizing a loss function. To find the minimum, we need to know which direction to move each parameter—and that direction is given by the gradient (vector of partial derivatives). The chain rule makes backpropagation efficient by decomposing complex derivatives into simple steps. Without calculus, gradient-based learning is impossible.",
    history:
      "Calculus was independently developed by Newton and Leibniz in the late 17th century. The chain rule was formalized in the 18th century. The connection to optimization was established by Cauchy in 1847, who proposed gradient descent. In the 1980s, Rumelhart, Hinton, and Williams showed how backpropagation uses the chain rule to train neural networks, launching the modern deep learning era.",
    prerequisites: ["linear-algebra"],
    relatedConcepts: [
      "optimization-theory",
      "gradient-methods",
      "regularization-theory",
    ],
    examples: [
      {
        title: "Partial Derivatives and Gradients",
        description:
          "For a function f(x, y), the partial derivative ∂f/∂x measures how f changes when x changes while y stays fixed. The gradient is the vector of all partial derivatives and points in the direction of steepest ascent.",
        code: `import numpy as np

def f(x, y):
    return x**2 + 2*x*y + y**3

def gradient(x, y):
    df_dx = 2*x + 2*y
    df_dy = 2*x + 3*y**2
    return np.array([df_dx, df_dy])

# Gradient at point (1, 2)
g = gradient(1, 2)
print(f"Gradient at (1,2): {g}")  # [6. 14.]

# The gradient points in the direction of steepest ascent
# Negative gradient points toward steepest descent (used in optimization)`,
      },
      {
        title: "Chain Rule for Backpropagation",
        description:
          "The chain rule decomposes the derivative of a composite function. If y = f(g(x)), then dy/dx = f'(g(x)) · g'(x). In neural networks, this allows computing gradients layer by layer from output to input.",
        code: `import numpy as np

# Simple neural network: y = sigmoid(W @ x + b)
def sigmoid(z):
    return 1 / (1 + np.exp(-z))

def sigmoid_derivative(z):
    s = sigmoid(z)
    return s * (1 - s)

# Forward pass
x = np.array([1.0, 2.0, 3.0])
W = np.array([[0.1, 0.2], [0.3, 0.4], [0.5, 0.6]])
b = np.array([0.1, 0.2])

z = W @ x + b       # Pre-activation
a = sigmoid(z)       # Activation

# Backward pass using chain rule
# dL/da = (a - target)  (assuming MSE loss)
target = np.array([1.0, 0.0])
dL_da = 2 * (a - target)

# dL/dz = dL/da * da/dz (chain rule)
dL_dz = dL_da * sigmoid_derivative(z)

# dL/dW = dL/dz @ x.T
dL_dW = np.outer(dL_dz, x)

# dL/db = dL/dz
dL_db = dL_dz

print(f"Gradient dL/dW:\\n{dL_dW}")
print(f"Gradient dL/db: {dL_db}")`,
      },
      {
        title: "Numerical vs Analytical Gradients",
        description:
          "Numerical gradients approximate derivatives using finite differences. They are slow but easy to implement and useful for verifying analytical (backpropagation) gradients.",
        code: `import numpy as np

def f(x):
    return np.sum(x**2) + 3*x[0]*x[1]

def numerical_gradient(f, x, epsilon=1e-7):
    grad = np.zeros_like(x)
    for i in range(len(x)):
        x_plus = x.copy()
        x_minus = x.copy()
        x_plus[i] += epsilon
        x_minus[i] -= epsilon
        grad[i] = (f(x_plus) - f(x_minus)) / (2 * epsilon)
    return grad

def analytical_gradient(x):
    return np.array([2*x[0] + 3*x[1], 2*x[1] + 3*x[0]])

x = np.array([2.0, 3.0])
num_grad = numerical_gradient(f, x)
ana_grad = analytical_gradient(x)

print(f"Numerical: {num_grad}")  # [13.00000007 12.00000003]
print(f"Analytical: {ana_grad}") # [13.         12.        ]
print(f"Difference: {np.abs(num_grad - ana_grad)}")  # Should be ~1e-7`,
      },
    ],
    realWorldUseCases: [
      "Backpropagation in neural networks: the chain rule enables efficient gradient computation through arbitrarily deep architectures",
      "Learning rate optimization: understanding gradients helps tune how fast models converge",
      "Adversarial attacks: gradients of the loss with respect to input pixels create adversarial examples (FGSM attack)",
      "GAN training: generator and discriminator both use gradients to improve",
      "Physics-informed neural networks: gradients encode physical laws (PDEs) as loss terms",
    ],
    commonMistakes: [
      "Forgetting to zero gradients: PyTorch accumulates gradients by default. If you don't call optimizer.zero_grad() before each backward pass, gradients from previous batches add up, causing incorrect updates.",
      "Vanishing gradients in deep networks: when gradients are multiplied through many layers using the chain rule, they can shrink exponentially if activation derivatives are < 1. This is why ReLU, batch normalization, and residual connections exist.",
      "Confusing derivative of sigmoid with sigmoid itself: sigmoid'(z) = sigmoid(z) * (1 - sigmoid(z)), not just sigmoid(z). Many implementation bugs come from this.",
    ],
    interviewQuestions: [
      "Explain the chain rule and how it applies to a 3-layer neural network. Answer: If the network is f(x) = f3(f2(f1(x))), then df/dx = f3'(f2(f1(x))) · f2'(f1(x)) · f1'(x). Each layer's local gradient is multiplied by the upstream gradient.",
      "Why can't we use numerical differentiation to train large neural networks? Answer: Numerical gradients require one forward pass per parameter. A network with 1 million parameters would need 1 million forward passes per update, which is computationally prohibitive. Backpropagation computes all gradients in one forward + one backward pass.",
      "What happens to gradients when you use sigmoid activation in a deep network? Answer: The sigmoid derivative is at most 0.25 (at z=0). Multiplying many such values through layers causes gradients to vanish exponentially, making early layers learn very slowly or not at all.",
    ],
    glossary: [
      {
        term: "Derivative",
        definition:
          "The instantaneous rate of change of a function with respect to its input. Geometrically, it is the slope of the tangent line at a point.",
      },
      {
        term: "Gradient",
        definition:
          "A vector containing all partial derivatives of a multivariable function. It points in the direction of steepest ascent and is perpendicular to level curves.",
      },
      {
        term: "Chain Rule",
        definition:
          "The formula for differentiating composite functions: d/dx[f(g(x))] = f'(g(x)) · g'(x). In neural networks, it enables backpropagation through layers.",
      },
      {
        term: "Partial Derivative",
        definition:
          "The derivative of a function with respect to one variable while holding all others constant. Notated as ∂f/∂x.",
      },
    ],
    references: [
      {
        title: "Calculus Made Easy by Silvanus P. Thompson",
        url: "https://calculusmadeeasy.org/",
        type: "book",
      },
      {
        title: "Backpropagation (Rumelhart, Hinton, Williams, 1986)",
        url: "https://www.nature.com/articles/323533a0",
        type: "paper",
      },
    ],
    estimatedMinutes: 90,
    projects: [
      "Implement backpropagation from scratch for a 2-layer network and verify gradients numerically",
      "Visualize the loss landscape of a small neural network using gradient information",
      "Build a simple gradient-based optimizer that minimizes a 2D function with visual convergence tracking",
    ],
  },
  {
    id: "probability-statistics",
    title: "Probability & Statistics",
    slug: "probability-and-statistics",
    category: "mathematics",
    difficulty: "beginner",
    description:
      "Probability and statistics provide the mathematical framework for reasoning about uncertainty. In AI, this encompasses Bayes' theorem (updating beliefs with evidence), probability distributions (modeling data), expectation and variance (summarizing distributions), and hypothesis testing (evaluating models). These concepts are essential for statistical learning, generative models, and any system that deals with noisy or incomplete data.",
    whyItExists:
      "Machine learning is fundamentally about making predictions under uncertainty. Probability theory quantifies that uncertainty. Statistics provides tools to learn from data: estimating parameters, testing hypotheses, and quantifying confidence. Without probability and statistics, you cannot understand Bayesian inference, loss functions, regularization, or model evaluation.",
    history:
      "Probability theory originated in the 17th century from games of chance (Fermat, Pascal). Bayes' theorem was published posthumously in 1763. The modern framework was formalized by Kolmogorov in 1933 using measure theory. Fisher and Neyman developed statistical inference in the 1920s-30s. The Bayesian revival began in the 1990s with MCMC methods making posterior computation practical.",
    prerequisites: [],
    relatedConcepts: [
      "information-theory",
      "bayesian-inference",
      "optimization-theory",
    ],
    examples: [
      {
        title: "Bayes' Theorem for Medical Testing",
        description:
          "Bayes' theorem updates prior beliefs with evidence. P(A|B) = P(B|A) · P(A) / P(B). This example shows why even accurate tests can give misleading results when the disease is rare.",
        code: `import numpy as np

# Medical test scenario
p_disease = 0.01          # Prior: 1% prevalence
p_positive_given_disease = 0.95  # Sensitivity: 95% true positive rate
p_positive_given_healthy = 0.05  # False positive rate: 5%

# Bayes' theorem
p_positive = (p_positive_given_disease * p_disease +
              p_positive_given_healthy * (1 - p_disease))

p_disease_given_positive = (p_positive_given_disease * p_disease) / p_positive

print(f"Probability of disease given positive test: {p_disease_given_positive:.3f}")
# Output: 0.161 — only 16%! Most positives are false positives.

# To improve: use a second independent test
p_positive2_given_disease = 0.95
p_positive2_given_healthy = 0.05
p_positive2 = (p_positive2_given_disease * p_disease_given_positive +
               p_positive2_given_healthy * (1 - p_disease_given_positive))

p_disease_given_both = (p_positive2_given_disease * p_disease_given_positive) / p_positive2
print(f"Probability after two positive tests: {p_disease_given_both:.3f}")
# Output: 0.784 — much more confident`,
      },
      {
        title: "Probability Distributions",
        description:
          "Different distributions model different types of data: Normal for continuous measurements, Bernoulli for binary outcomes, Poisson for count data. Understanding which distribution fits your data is crucial for model selection.",
        code: `import numpy as np
from scipy import stats

np.random.seed(42)

# Normal distribution: height of adults (cm)
heights = np.random.normal(loc=170, scale=10, size=10000)
print(f"Mean: {heights.mean():.1f}, Std: {heights.std():.1f}")
print(f"P(height > 180): {(heights > 180).mean():.3f}")

# Bernoulli distribution: coin flips (success/failure)
flips = np.random.binomial(n=1, p=0.7, size=1000)
print(f"Heads rate: {flips.mean():.3f}")  # ~0.7

# Poisson distribution: customer arrivals per hour
arrivals = np.random.poisson(lam=5, size=1000)
print(f"Avg arrivals: {arrivals.mean():.1f}")
print(f"P(exactly 3 arrivals): {(arrivals == 3).mean():.3f}")

# Exponential distribution: time between events
inter_arrival = np.random.exponential(scale=1/5, size=1000)
print(f"Avg inter-arrival time: {inter_arrival.mean():.3f} hours")`,
      },
      {
        title: "Expectation, Variance, and Covariance",
        description:
          "Expectation (mean) summarizes the center of a distribution. Variance measures spread. Covariance measures how two variables move together. These are the building blocks of statistics and PCA.",
        code: `import numpy as np

# Dataset: student study hours and exam scores
study_hours = np.array([2, 3, 5, 7, 8, 10, 12, 14, 16, 18])
exam_scores = np.array([55, 60, 65, 72, 78, 82, 88, 90, 95, 98])

# Expectation (mean)
E_hours = np.mean(study_hours)
E_scores = np.mean(exam_scores)
print(f"E[hours] = {E_hours:.1f}, E[scores] = {E_scores:.1f}")

# Variance: average squared deviation from mean
var_hours = np.var(study_hours, ddof=1)  # ddof=1 for sample variance
var_scores = np.var(exam_scores, ddof=1)
print(f"Var(hours) = {var_hours:.2f}, Var(scores) = {var_scores:.2f}")

# Standard deviation: sqrt of variance (same units as data)
std_hours = np.std(study_hours, ddof=1)
print(f"Std(hours) = {std_hours:.2f}")

# Covariance: do they move together?
cov_matrix = np.cov(study_hours, exam_scores)
print(f"Covariance matrix:\\n{cov_matrix}")
# Positive covariance = positive correlation`,
      },
      {
        title: "Central Limit Theorem",
        description:
          "The Central Limit Theorem states that the sampling distribution of the mean approaches a normal distribution as sample size increases, regardless of the underlying distribution. This is why the normal distribution appears everywhere in statistics.",
        code: `import numpy as np

np.random.seed(42)

# Exponential distribution (very non-normal)
data = np.random.exponential(scale=2.0, size=100000)

# Sample means for different sample sizes
sample_sizes = [1, 5, 30, 100]
for n in sample_sizes:
    means = [np.mean(np.random.choice(data, size=n)) for _ in range(1000)]
    print(f"n={n:3d}: mean={np.mean(means):.2f}, "
          f"std={np.std(means):.2f}, "
          f"skew={float(np.mean(((means-np.mean(means))/np.std(means))**3)):.2f}")

# As n increases:
# - Mean stays the same (unbiased estimator)
# - Std decreases (by sqrt(n))
# - Distribution becomes more normal (skew approaches 0)
# This is why we can use z-tests and t-tests`,
      },
    ],
    realWorldUseCases: [
      "Spam filtering: naive Bayes classifiers compute P(spam|words) using Bayes' theorem",
      "A/B testing: statistics determine whether a new feature significantly improves metrics",
      "Fraud detection: probability models flag transactions that deviate from normal patterns",
      "Medical diagnosis: Bayesian networks combine symptoms and priors to estimate disease probability",
      "Reinforcement learning: probability distributions model state transitions and rewards",
    ],
    commonMistakes: [
      "Confusing correlation with causation: two variables can be correlated (high covariance) without one causing the other. A third confounding variable may explain both.",
      "Ignoring base rates: a 99% accurate test on a rare disease (1% prevalence) gives mostly false positives. Always consider the prior probability.",
      "Using sample statistics as population parameters: sample mean is an estimate of the true mean, not the true mean itself. Small samples have high variance.",
    ],
    interviewQuestions: [
      "What is Bayes' theorem and when would you use it? Answer: Bayes' theorem computes P(A|B) = P(B|A)P(A)/P(B). It's used in spam filtering (P(spam|email)), medical diagnosis (P(disease|symptoms)), and any scenario where you update prior beliefs with new evidence.",
      "Explain the difference between probability and statistics. Answer: Probability reasons from known parameters to data (forward direction). Statistics reasons from observed data to unknown parameters (inverse direction). ML uses both: probability models the data-generating process, statistics estimates model parameters.",
      "What is the Central Limit Theorem and why does it matter? Answer: The sample mean of any distribution approaches a normal distribution as sample size grows. This allows us to construct confidence intervals and perform hypothesis tests using the normal distribution, regardless of the underlying data distribution.",
    ],
    glossary: [
      {
        term: "Bayes' Theorem",
        definition:
          "P(A|B) = P(B|A)P(A)/P(B). A formula for updating the probability of a hypothesis given new evidence. The foundation of Bayesian inference.",
      },
      {
        term: "Expectation",
        definition:
          "The weighted average of a random variable: E[X] = Σx·P(x). It represents the long-run average value of repeated experiments.",
      },
      {
        term: "Variance",
        definition:
          "The average squared deviation from the mean: Var(X) = E[(X - E[X])²]. It measures the spread or dispersion of a distribution.",
      },
      {
        term: "Normal Distribution",
        definition:
          "A bell-shaped continuous distribution defined by its mean μ and variance σ². The most important distribution in statistics due to the Central Limit Theorem.",
      },
    ],
    references: [
      {
        title: "Think Stats by Allen B. Downey",
        url: "https://greenteapress.com/thinkstats/",
        type: "book",
      },
      {
        title:
          "Seeing Theory: A Visual Introduction to Probability and Statistics",
        url: "https://seeing-theory.brown.edu/",
        type: "article",
      },
    ],
    estimatedMinutes: 120,
    projects: [
      "Build a naive Bayes spam classifier from scratch using Python",
      "Implement a Bayesian update visualization where you adjust priors and see posteriors change",
      "Simulate the Central Limit Theorem with different underlying distributions and sample sizes",
    ],
  },
  {
    id: "optimization-theory",
    title: "Optimization Theory",
    slug: "optimization-theory",
    category: "mathematics",
    difficulty: "intermediate",
    description:
      "Optimization theory studies how to find the best solution from a set of feasible solutions. In machine learning, 'best' means minimizing (or maximizing) an objective function. This includes convex optimization (guaranteed global minima), gradient descent (iterative first-order methods), learning rates (step size control), and momentum (accelerating convergence). Understanding optimization is understanding how models actually learn.",
    whyItExists:
      "Every machine learning model has a loss function that measures how wrong its predictions are. Training = minimizing that loss function. Optimization theory tells us whether a minimum exists, whether we can find it, and how fast. Without it, we cannot choose between optimizers, set learning rates, or diagnose training failures.",
    history:
      "Optimization has roots in Fermat's calculus of variations (1638). Newton's method (17th century) finds roots using derivatives. Cauchy proposed gradient descent in 1847. Convex optimization was formalized by Rockafellar in 1970. The 1980s-90s saw the development of momentum (Polyak, 1964), conjugate gradients, and quasi-Newton methods. The 2010s brought Adam and adaptive methods that dominate modern deep learning.",
    prerequisites: ["calculus-ml"],
    relatedConcepts: [
      "gradient-methods",
      "regularization-theory",
      "linear-algebra",
    ],
    examples: [
      {
        title: "Gradient Descent from Scratch",
        description:
          "Gradient descent iteratively moves parameters in the negative gradient direction. The learning rate controls step size. Too large = overshooting; too small = slow convergence.",
        code: `import numpy as np

# Minimize f(x) = (x - 3)^2 + 1
# Minimum is at x = 3, f(3) = 1

def f(x):
    return (x - 3)**2 + 1

def f_prime(x):
    return 2 * (x - 3)

# Gradient descent
x = 0.0           # Starting point
lr = 0.1          # Learning rate
history = [x]

for step in range(20):
    grad = f_prime(x)
    x = x - lr * grad
    history.append(x)

print(f"Found minimum at x = {x:.6f}")
print(f"True minimum is at x = 3.0")
print(f"Steps to converge: {len(history)}")

# If lr is too large (e.g., 1.1), the algorithm diverges:
# x oscillates between increasingly large values`,
      },
      {
        title: "Convex vs Non-Convex Functions",
        description:
          "Convex functions have a single global minimum — any local minimum is also global. Most ML loss functions (linear regression, logistic regression) are convex. Neural networks have non-convex loss landscapes with many local minima.",
        code: `import numpy as np

# Convex function: f(x) = x^2 (single global minimum)
def convex(x):
    return x**2

# Non-convex function: f(x) = sin(x) + 0.1*x^2
def non_convex(x):
    return np.sin(x) + 0.1 * x**2

# Gradient descent on convex function
x_conv = 5.0
for _ in range(100):
    x_conv -= 0.1 * 2 * x_conv  # lr * f'(x)
print(f"Convex minimum: {x_conv:.6f}")  # Converges to 0

# On non-convex, starting point matters
x_nc = 5.0
for _ in range(100):
    grad = np.cos(x_nc) + 0.2 * x_nc
    x_nc -= 0.1 * grad
print(f"Non-convex found: {x_nc:.6f}")  # May find a local minimum`,
      },
      {
        title: "Learning Rate Schedules",
        description:
          "Fixed learning rates are suboptimal. Schedules reduce the learning rate over time: step decay, cosine annealing, warmup. This allows fast initial progress then fine-grained convergence.",
        code: `import numpy as np

# Simulated training loop with different schedules
epochs = 50
initial_lr = 0.1

# Constant learning rate
lr_constant = initial_lr

# Step decay: halve every 10 epochs
def step_decay(epoch, lr=initial_lr):
    return lr * (0.5 ** (epoch // 10))

# Cosine annealing
def cosine_annealing(epoch, total=50, lr=initial_lr):
    return lr * 0.5 * (1 + np.cos(np.pi * epoch / total))

# Warmup then decay
def warmup_schedule(epoch, warmup=5, total=50, lr=initial_lr):
    if epoch < warmup:
        return lr * epoch / warmup
    return lr * (1 - (epoch - warmup) / (total - warmup))

for epoch in range(0, 50, 10):
    print(f"Epoch {epoch:2d}: "
          f"constant={step_decay(epoch, lr_constant):.4f}, "
          f"step={step_decay(epoch):.4f}, "
          f"cosine={cosine_annealing(epoch):.4f}, "
          f"warmup={warmup_schedule(epoch):.4f}")`,
      },
    ],
    realWorldUseCases: [
      "Training neural networks: every optimizer (SGD, Adam, RMSProp) is a variant of gradient descent",
      "Hyperparameter tuning: Bayesian optimization minimizes validation loss over the hyperparameter space",
      "Support vector machines: finding the maximum-margin decision boundary is a convex optimization problem",
      "Logistic regression: the log-loss is convex, guaranteeing a global minimum",
      "Reinforcement learning: policy gradient methods optimize expected cumulative reward",
    ],
    commonMistakes: [
      "Using a learning rate that's too large: the loss diverges instead of converging. Symptom: loss oscillates wildly or explodes to NaN.",
      "Not normalizing features: when features have different scales, the loss landscape becomes elongated and gradient descent zig-zags. Always normalize or standardize inputs.",
      "Stopping too early: loss may plateau temporarily then continue decreasing. Use learning rate scheduling, not just a fixed number of epochs.",
    ],
    interviewQuestions: [
      "What is the difference between convex and non-convex optimization? Answer: Convex problems have a single global minimum (e.g., linear regression). Non-convex problems have many local minima (e.g., neural networks). For convex problems, any local minimum is global. For non-convex, we can only guarantee finding a local minimum, but in practice, many local minima have similar loss values.",
      "Why does Adam sometimes perform worse than SGD with momentum? Answer: Adam adapts learning rates per-parameter, which can lead to sharp generalization. SGD with momentum tends to find flatter minima that generalize better. This is why many vision tasks still use SGD.",
      "Explain the vanishing/exploding gradient problem in terms of optimization. Answer: In deep networks, gradients are products of many terms. If each term is < 1, the product vanishes exponentially. If > 1, it explodes. Both prevent effective learning in early layers. Solutions: careful initialization, batch normalization, residual connections.",
    ],
    glossary: [
      {
        term: "Gradient Descent",
        definition:
          "An iterative optimization algorithm that updates parameters by moving in the direction opposite to the gradient: θ = θ - α∇L(θ). The foundation of training in deep learning.",
      },
      {
        term: "Learning Rate",
        definition:
          "The step size α in gradient descent. It controls how far parameters move per update. Too large causes divergence; too small causes slow convergence.",
      },
      {
        term: "Convex Function",
        definition:
          "A function where the line segment between any two points on the graph lies above or on the graph. Has a single global minimum and no local minima.",
      },
      {
        term: "Momentum",
        definition:
          "A technique that accumulates velocity from past gradients to smooth updates. It accelerates convergence in consistent gradient directions and dampens oscillations.",
      },
    ],
    references: [
      {
        title: "Convex Optimization by Boyd and Vandenberghe",
        url: "https://web.stanford.edu/~boyd/cvxbook/",
        type: "book",
      },
      {
        title:
          "An overview of gradient descent optimization algorithms (Ruder, 2016)",
        url: "https://ruder.io/optimizing-gradient-descent/",
        type: "article",
      },
    ],
    estimatedMinutes: 120,
    projects: [
      "Implement gradient descent variants (SGD, momentum, Adam) and compare convergence on Rosenbrock function",
      "Build a learning rate finder that automatically suggests optimal learning rates",
      "Visualize loss landscapes of a small neural network using filter-normalized loss surfaces",
    ],
  },
  {
    id: "information-theory",
    title: "Information Theory",
    slug: "information-theory",
    category: "mathematics",
    difficulty: "intermediate",
    description:
      "Information theory, founded by Claude Shannon, quantifies information content and uncertainty. Key concepts include entropy (average information content), KL divergence (distance between distributions), and cross-entropy (a loss function used in classification). These concepts directly underpin loss functions in machine learning and provide theoretical limits on data compression and communication.",
    whyItExists:
      "Cross-entropy loss is the default loss for classification tasks. KL divergence measures how one probability distribution differs from another, which is central to variational autoencoders and knowledge distillation. Entropy measures uncertainty, which guides active learning and decision tree splits. Without information theory, you cannot understand why certain loss functions work or how to evaluate probabilistic models.",
    history:
      "Claude Shannon published 'A Mathematical Theory of Communication' in 1948, founding information theory. He defined entropy as the fundamental limit of data compression. Kullback and Leibler introduced their divergence in 1951. In machine learning, cross-entropy became the standard loss for classification in the 1990s. Variational inference using KL divergence gained prominence in the 2010s with variational autoencoders.",
    prerequisites: ["probability-statistics"],
    relatedConcepts: [
      "bayesian-inference",
      "optimization-theory",
      "regularization-theory",
    ],
    examples: [
      {
        title: "Shannon Entropy",
        description:
          "Entropy H(X) = -Σ p(x) log p(x) measures the average uncertainty in a distribution. A fair coin has maximum entropy (1 bit). A biased coin has less entropy because outcomes are more predictable.",
        code: `import numpy as np

def entropy(probs):
    """Calculate Shannon entropy in bits."""
    probs = np.array(probs)
    probs = probs[probs > 0]  # Avoid log(0)
    return -np.sum(probs * np.log2(probs))

# Fair coin: maximum entropy
print(f"Fair coin: {entropy([0.5, 0.5]):.3f} bits")  # 1.000

# Biased coin: less entropy (more predictable)
print(f"90% heads: {entropy([0.9, 0.1]):.3f} bits")  # 0.469

# Certain outcome: zero entropy
print(f"Certain: {entropy([1.0, 0.0]):.3f} bits")    # 0.000

# Fair die: log2(6) bits
print(f"Fair die: {entropy([1/6]*6):.3f} bits")       # 2.585

# In ML: entropy of label distribution indicates class balance
# Balanced dataset (50/50) has higher entropy than imbalanced (95/5)`,
      },
      {
        title: "Cross-Entropy Loss",
        description:
          "Cross-entropy measures the average number of bits needed to identify a sample from the true distribution using the predicted distribution. It is the standard loss for classification: H(p, q) = -Σ p(x) log q(x).",
        code: `import numpy as np

def cross_entropy(true_probs, pred_probs):
    """Cross-entropy loss between true and predicted distributions."""
    pred_probs = np.clip(pred_probs, 1e-15, 1 - 1e-15)  # Avoid log(0)
    return -np.sum(true_probs * np.log(pred_probs))

# True labels (one-hot encoded)
true_labels = [1, 0, 0]  # Class 0

# Good prediction: high probability for correct class
good_pred = [0.9, 0.05, 0.05]
print(f"Good prediction CE: {cross_entropy(true_labels, good_pred):.3f}")

# Bad prediction: low probability for correct class
bad_pred = [0.1, 0.7, 0.2]
print(f"Bad prediction CE: {cross_entropy(true_labels, bad_pred):.3f}")

# For batch of predictions (PyTorch style)
def batch_cross_entropy(true_labels, logits):
    """Numerically stable cross-entropy from logits."""
    # Softmax
    exp_logits = np.exp(logits - np.max(logits, axis=1, keepdims=True))
    probs = exp_logits / np.sum(exp_logits, axis=1, keepdims=True)
    # Cross-entropy
    n = len(true_labels)
    ce = -np.log(probs[np.arange(n), true_labels] + 1e-15)
    return np.mean(ce)

logits = np.array([[2.0, 1.0, 0.1], [0.5, 2.5, 0.3]])
labels = np.array([0, 1])
print(f"Batch CE: {batch_cross_entropy(labels, logits):.3f}")`,
      },
      {
        title: "KL Divergence",
        description:
          "KL divergence D_KL(P||Q) measures how much information is lost when Q is used to approximate P. It is asymmetric: D_KL(P||Q) ≠ D_KL(Q||P). Used in variational autoencoders and knowledge distillation.",
        code: `import numpy as np

def kl_divergence(p, q):
    """KL(P || Q) in bits."""
    p = np.array(p)
    q = np.array(q)
    # Avoid division by zero
    p = np.clip(p, 1e-15, 1.0)
    q = np.clip(q, 1e-15, 1.0)
    return np.sum(p * np.log2(p / q))

# True distribution vs approximations
true_dist = [0.5, 0.3, 0.2]
good_approx = [0.45, 0.35, 0.20]
bad_approx = [0.1, 0.1, 0.8]

print(f"KL(true || good): {kl_divergence(true_dist, good_approx):.4f}")  # Small
print(f"KL(true || bad):  {kl_divergence(true_dist, bad_approx):.4f}")   # Large

# Asymmetry: KL(P||Q) != KL(Q||P)
print(f"KL(good || true): {kl_divergence(good_approx, true_dist):.4f}")

# In VAE: total loss = reconstruction_loss + beta * KL(posterior || prior)
# The KL term forces the latent distribution to be close to the prior (usually N(0,I))`,
      },
      {
        title: "Mutual Information",
        description:
          "Mutual information I(X;Y) = H(X) - H(X|Y) measures how much knowing Y reduces uncertainty about X. If I(X;Y) = 0, X and Y are independent. It captures both linear and nonlinear dependencies.",
        code: `import numpy as np

def mutual_information(x, y, bins=10):
    """Estimate mutual information using histogram."""
    # Create 2D histogram
    hist_2d, _, _ = np.histogram2d(x, y, bins=bins)
    pxy = hist_2d / hist_2d.sum()
    px = pxy.sum(axis=1)
    py = pxy.sum(axis=0)

    # MI = sum p(x,y) * log(p(x,y) / (p(x) * p(y)))
    mi = 0
    for i in range(bins):
        for j in range(bins):
            if pxy[i,j] > 0 and px[i] > 0 and py[j] > 0:
                mi += pxy[i,j] * np.log2(pxy[i,j] / (px[i] * py[j]))
    return mi

# Perfect correlation: high MI
x = np.linspace(0, 10, 1000)
y = 2 * x + np.random.normal(0, 0.1, 1000)
print(f"MI (correlated): {mutual_information(x, y):.3f}")

# Independent: MI ≈ 0
y_rand = np.random.uniform(0, 20, 1000)
print(f"MI (independent): {mutual_information(x, y_rand):.3f}")

# Use case: feature selection
# High MI with target = useful feature
# Low MI with target = redundant feature`,
      },
    ],
    realWorldUseCases: [
      "Cross-entropy loss: the default loss function for training classifiers in PyTorch and TensorFlow",
      "Knowledge distillation: KL divergence transfers knowledge from a large model (teacher) to a small model (student)",
      "Variational autoencoders: KL divergence regularizes the latent space to be close to a standard normal",
      "Feature selection: mutual information identifies features most relevant to the target variable",
      "Decision trees: information gain (reduction in entropy) determines the best split at each node",
    ],
    commonMistakes: [
      "Confusing cross-entropy with KL divergence: cross-entropy = entropy + KL divergence. Cross-entropy is used as a loss; KL divergence is used to compare distributions.",
      "Using KL(Q||P) instead of KL(P||Q) in VAEs: forward KL (P||Q) mode-seeks, reverse KL (Q||P) mean-seeks. VAEs use reverse KL because it prevents the decoder from ignoring the latent code.",
      "Ignoring numerical stability: log(0) is undefined. Always clip probabilities before taking logs. In practice, use log_softmax + NLLLoss instead of computing softmax then log.",
    ],
    interviewQuestions: [
      "Why do we use cross-entropy loss instead of mean squared error for classification? Answer: Cross-entropy has steeper gradients for confident wrong predictions, pushing the model to correct large errors faster. MSE gradients flatten out when probabilities approach 0 or 1, causing slow learning. Cross-entropy is also derived from maximum likelihood estimation.",
      "What does KL divergence measure and why is it asymmetric? Answer: KL(P||Q) measures the expected extra bits needed when using Q to encode samples from P. It's asymmetric because encoding P with Q is different from encoding Q with P. KL(P||Q) penalizes Q for missing modes of P (mode-seeking), while KL(Q||P) penalizes Q for placing mass where P doesn't (mean-seeking).",
      "How does information theory relate to decision trees? Answer: Decision trees use information gain, which is the reduction in entropy after splitting on a feature. The split that maximizes information gain (reduces uncertainty the most) is chosen. This is equivalent to minimizing the weighted average entropy of child nodes.",
    ],
    glossary: [
      {
        term: "Entropy",
        definition:
          "H(X) = -Σ p(x) log p(x). The average uncertainty or information content in a distribution. Maximum when all outcomes are equally likely.",
      },
      {
        term: "Cross-Entropy",
        definition:
          "H(p,q) = -Σ p(x) log q(x). The average number of bits needed to encode data from distribution p using an encoding optimized for distribution q. Used as classification loss.",
      },
      {
        term: "KL Divergence",
        definition:
          "D_KL(P||Q) = Σ p(x) log(p(x)/q(x)). A measure of how one probability distribution diverges from another. Asymmetric and always non-negative.",
      },
      {
        term: "Mutual Information",
        definition:
          "I(X;Y) = H(X) - H(X|Y). The reduction in uncertainty about X given knowledge of Y. Captures both linear and nonlinear dependencies.",
      },
    ],
    references: [
      {
        title: "Elements of Information Theory by Cover and Thomas",
        url: "https://www.wiley.com/en-us/Elements+of+Information+Theory-p-9780471241959",
        type: "book",
      },
      {
        title:
          "Information Theory, Inference, and Learning Algorithms by David MacKay",
        url: "http://www.inference.org.uk/mackay/itila/",
        type: "book",
      },
    ],
    estimatedMinutes: 100,
    projects: [
      "Implement a decision tree from scratch using information gain for splitting",
      "Build a knowledge distillation pipeline that transfers knowledge from a large model to a small one using KL divergence",
      "Create a feature selection tool that ranks features by mutual information with the target",
    ],
  },
  {
    id: "matrix-decomposition",
    title: "Matrix Decomposition",
    slug: "matrix-decomposition",
    category: "mathematics",
    difficulty: "advanced",
    description:
      "Matrix decomposition factors a matrix into simpler, more meaningful components. Key techniques include Singular Value Decomposition (SVD), eigendecomposition, Principal Component Analysis (PCA), and Non-negative Matrix Factorization (NMF). These methods enable dimensionality reduction, feature extraction, noise removal, and data compression. Every data scientist should understand how and when to decompose matrices.",
    whyItExists:
      "High-dimensional data is noisy and redundant. Matrix decomposition reveals the underlying structure: the principal directions of variance (PCA), the latent factors (SVD), or the additive components (NMF). Without decomposition, you cannot perform dimensionality reduction, build recommender systems, or extract features from text. SVD alone powers search engines, recommendation systems, and image compression.",
    history:
      "Euler studied eigendecomposition in the 18th century. Cauchy proved the spectral theorem. Beltrami (1873) and Jordan (1874) developed SVD independently. PCA was invented by Karl Pearson in 1901 and independently by Harold Hotelling in 1933. NMF was popularized by Lee and Seung in 1999. The randomized SVD by Halko et al. (2011) made large-scale decompositions practical.",
    prerequisites: ["linear-algebra"],
    relatedConcepts: [
      "linear-algebra",
      "probability-statistics",
      "information-theory",
    ],
    examples: [
      {
        title: "Singular Value Decomposition (SVD)",
        description:
          "SVD factors any matrix A (m×n) as A = UΣV^T, where U and V are orthogonal and Σ contains singular values. It is the most general matrix decomposition and works for any matrix shape.",
        code: `import numpy as np

# Image compression example using SVD
# Create a synthetic image (grayscale)
np.random.seed(42)
image = np.random.rand(100, 100)

# Full SVD
U, sigma, Vt = np.linalg.svd(image, full_matrices=False)
print(f"U: {U.shape}, sigma: {sigma.shape}, Vt: {Vt.shape}")

# Reconstruct with k singular values
def reconstruct(U, sigma, Vt, k):
    return U[:, :k] @ np.diag(sigma[:k]) @ Vt[:k, :]

# Compare reconstruction quality
for k in [5, 20, 50]:
    recon = reconstruct(U, sigma, Vt, k)
    error = np.linalg.norm(image - recon) / np.linalg.norm(image)
    compression = (k * (100 + 1 + 100)) / (100 * 100)  # k*(m+n+1) / (m*n)
    print(f"k={k:2d}: relative error = {error:.4f}, compression = {compression:.1%}")

# sigma values tell us the "importance" of each component
print(f"Top 5 singular values: {sigma[:5]}")`,
      },
      {
        title: "Principal Component Analysis (PCA)",
        description:
          "PCA finds the directions of maximum variance in the data. It is equivalent to SVD on the centered data matrix. PCA is used for dimensionality reduction, visualization, and noise removal.",
        code: `import numpy as np

# Generate correlated 2D data
np.random.seed(42)
n = 500
x = np.random.randn(n)
y = 0.8 * x + 0.3 * np.random.randn(n)  # Correlated with x
data = np.column_stack([x, y])

# Center the data
mean = data.mean(axis=0)
centered = data - mean

# PCA via SVD
U, sigma, Vt = np.linalg.svd(centered, full_matrices=False)

# Principal components (rows of Vt)
pc1 = Vt[0]  # Direction of maximum variance
pc2 = Vt[1]  # Direction of second maximum variance

# Variance explained by each component
var_explained = sigma**2 / np.sum(sigma**2)
print(f"PC1 explains {var_explained[0]:.1%} of variance")
print(f"PC2 explains {var_explained[1]:.1%} of variance")
print(f"PC1 direction: {pc1}")  # Should be close to [0.78, 0.62] (along y=0.8x)

# Project onto first principal component (reduce from 2D to 1D)
projected = centered @ pc1.reshape(-1, 1)
print(f"Reduced shape: {projected.shape}")  # (500, 1)`,
      },
      {
        title: "Eigendecomposition for Spectral Clustering",
        description:
          "The eigenvectors of the Laplacian matrix of a graph encode the cluster structure. Spectral clustering uses the k smallest eigenvectors to embed data, then clusters in the embedding space.",
        code: `import numpy as np
from scipy.sparse import csgraph

# Similarity matrix for 3 clusters
np.random.seed(42)
n_per_cluster = 50
centers = [[0, 0], [5, 5], [10, 0]]

points = []
for c in centers:
    points.append(np.random.randn(n_per_cluster, 2) * 0.5 + c)
points = np.vstack(points)

# Build similarity graph (k-nearest neighbors)
from scipy.spatial.distance import cdist
distances = cdist(points, points)
sigma = 1.0
similarity = np.exp(-distances**2 / (2 * sigma**2))
np.fill_diagonal(similarity, 0)

# Laplacian: L = D - W
laplacian = csgraph.laplacian(similarity, normed=True)

# Eigen decomposition
eigenvalues, eigenvectors = np.linalg.eigh(laplacian)

# Use k=3 smallest eigenvectors (excluding eigenvalue 0)
k = 3
embedding = eigenvectors[:, 1:k+1]

print(f"Embedding shape: {embedding.shape}")
print(f"Smallest eigenvalues: {eigenvalues[:5]}")

# Now apply k-means to the embedding
from scipy.cluster.vq import kmeans2
_, labels = kmeans2(embedding, k)
print(f"Cluster assignments: {np.unique(labels, return_counts=True)[1]}")`,
      },
    ],
    realWorldUseCases: [
      "Recommendation systems: matrix factorization decomposes user-item ratings into latent factors (Netflix Prize)",
      "Image compression: SVD approximates images with fewer components, reducing storage requirements",
      "Topic modeling: NMF on term-document matrices extracts interpretable topics from text corpora",
      "Noise removal: reconstructing with top-k singular values removes high-frequency noise",
      "Dimensionality reduction: PCA reduces features before training, speeding up models and reducing overfitting",
    ],
    commonMistakes: [
      "Not centering data before PCA: PCA finds directions of maximum variance. If data isn't centered, the first component may just capture the mean rather than the true structure.",
      "Ignoring the explained variance ratio: using too many components retains noise. Check cumulative explained variance (e.g., 95%) to choose k.",
      "Applying NMF to data with negative values: NMF requires non-negative inputs. Apply absolute value or shift data to be non-negative first.",
    ],
    interviewQuestions: [
      "What is the difference between PCA and SVD? Answer: SVD decomposes any matrix A = UΣV^T. PCA is SVD applied to the centered data matrix. The right singular vectors (V) of centered data are the principal components. The singular values relate to the eigenvalues of the covariance matrix.",
      "How does matrix factorization power recommendation systems? Answer: The user-item matrix R is decomposed as R ≈ P × Q^T, where P has user latent factors and Q has item latent factors. Missing entries (unrated items) are predicted as p_u · q_i. This is done by minimizing the error on observed entries.",
      "When would you use NMF instead of PCA? Answer: NMF produces non-negative components that are more interpretable as additive parts. For images, NMF learns parts-based representations (eyes, nose, mouth) while PCA learns holistic eigenfaces. For text, NMF learns topics as word distributions.",
    ],
    glossary: [
      {
        term: "SVD",
        definition:
          "Singular Value Decomposition: A = UΣV^T. Factors any m×n matrix into orthogonal matrices U, V and a diagonal matrix Σ of singular values. The most general matrix decomposition.",
      },
      {
        term: "PCA",
        definition:
          "Principal Component Analysis: Finds orthogonal directions of maximum variance. Equivalent to SVD on centered data. Used for dimensionality reduction and visualization.",
      },
      {
        term: "Eigendecomposition",
        definition:
          "Factorizing a square matrix A = QΛQ^(-1), where Q contains eigenvectors and Λ contains eigenvalues. Only works for diagonalizable matrices.",
      },
      {
        term: "NMF",
        definition:
          "Non-negative Matrix Factorization: A ≈ WH where W, H ≥ 0. Produces parts-based, interpretable decompositions for non-negative data like images and text.",
      },
    ],
    references: [
      {
        title:
          "Understanding Machine Learning: From Theory to Algorithms (Shalev-Shwartz & Ben-David)",
        url: "https://www.cs.huji.ac.il/~shais/UnderstandingMachineLearning/",
        type: "book",
      },
      {
        title:
          "A randomized algorithm for the decomposition of matrices (Halko et al., 2011)",
        url: "https://arxiv.org/abs/1003.6053",
        type: "paper",
      },
    ],
    estimatedMinutes: 120,
    projects: [
      "Build an image compression tool using SVD and compare quality vs compression ratio for different k values",
      "Implement PCA from scratch and use it to visualize high-dimensional datasets in 2D",
      "Create a recommender system using matrix factorization with alternating least squares",
    ],
  },
  {
    id: "gradient-methods",
    title: "Gradient Methods",
    slug: "gradient-methods",
    category: "mathematics",
    difficulty: "intermediate",
    description:
      "Gradient methods are the algorithms that actually train neural networks. They range from basic SGD to adaptive methods like Adam. Each variant addresses specific challenges: noisy gradients, different learning rates for different parameters, and saddle points. Understanding these methods is essential for debugging training issues and achieving state-of-the-art performance.",
    whyItExists:
      "The choice of optimizer directly affects training speed, final performance, and generalization. SGD with momentum converges slowly but often generalizes better. Adam converges fast but may overfit. Learning rate schedules (cosine annealing, warmup) can make or break training. Without understanding gradient methods, you cannot tune training or diagnose failures.",
    history:
      "Stochastic gradient descent was popularized by Robbins and Monro (1951). Polyak introduced momentum in 1964. Nesterov accelerated gradient came in 1983. AdaGrad (Duchi et al., 2011) adapted learning rates per-parameter. RMSProp (Hinton, 2012, unpublished lecture) fixed AdaGrad's decaying learning rates. Adam (Kingma & Ba, 2015) combined momentum with adaptive rates and became the default optimizer.",
    prerequisites: ["optimization-theory"],
    relatedConcepts: [
      "calculus-ml",
      "regularization-theory",
      "optimization-theory",
    ],
    examples: [
      {
        title: "SGD vs Adam Comparison",
        description:
          "SGD updates all parameters with the same learning rate. Adam adapts the learning rate per-parameter using running averages of gradients and squared gradients.",
        code: `import numpy as np

def rosenbrock(x, y):
    return (1 - x)**2 + 100 * (y - x**2)**2

def rosenbrock_grad(x, y):
    dx = -2*(1 - x) - 400*x*(y - x**2)
    dy = 200*(y - x**2)
    return np.array([dx, dy])

# SGD with momentum
def sgd_momentum(grad_fn, x0, lr=0.001, momentum=0.9, steps=5000):
    x = x0.copy()
    v = np.zeros_like(x)
    history = [x.copy()]
    for _ in range(steps):
        g = grad_fn(x[0], x[1])
        v = momentum * v + g
        x = x - lr * v
        history.append(x.copy())
    return np.array(history), rosenbrock(x[0], x[1])

# Adam
def adam(grad_fn, x0, lr=0.001, beta1=0.9, beta2=0.999, eps=1e-8, steps=5000):
    x = x0.copy()
    m = np.zeros_like(x)
    v = np.zeros_like(x)
    history = [x.copy()]
    for t in range(1, steps + 1):
        g = grad_fn(x[0], x[1])
        m = beta1 * m + (1 - beta1) * g
        v = beta2 * v + (1 - beta2) * g**2
        m_hat = m / (1 - beta1**t)
        v_hat = v / (1 - beta2**t)
        x = x - lr * m_hat / (np.sqrt(v_hat) + eps)
        history.append(x.copy())
    return np.array(history), rosenbrock(x[0], x[1])

x0 = np.array([-1.0, 1.0])
hist_sgd, loss_sgd = sgd_momentum(rosenbrock_grad, x0)
hist_adam, loss_adam = adam(rosenbrock_grad, x0)

print(f"SGD final loss: {loss_sgd:.6f}, final pos: {hist_sgd[-1]}")
print(f"Adam final loss: {loss_adam:.6f}, final pos: {hist_adam[-1]}")
print(f"True minimum at (1, 1), loss = 0")`,
      },
      {
        title: "Learning Rate Warmup",
        description:
          "Warmup gradually increases the learning rate from near zero to the target rate. This prevents large initial gradients from destabilizing training, especially important for transformers.",
        code: `import numpy as np

def warmup_cosine_schedule(step, warmup_steps, total_steps, max_lr):
    """Linear warmup followed by cosine decay."""
    if step < warmup_steps:
        return max_lr * step / warmup_steps
    else:
        progress = (step - warmup_steps) / (total_steps - warmup_steps)
        return max_lr * 0.5 * (1 + np.cos(np.pi * progress))

# Visualize schedule
total = 100000
warmup = 5000
max_lr = 3e-4

print("Step\t\tLR")
for step in [0, 1000, 2500, 5000, 25000, 50000, 75000, 100000]:
    lr = warmup_cosine_schedule(step, warmup, total, max_lr)
    print(f"{step:8d}\t{lr:.6f}")

# This schedule is standard in transformer training (GPT, BERT, etc.)
# Warmup prevents early instability, cosine decay allows fine-tuning`,
      },
      {
        title: "Gradient Clipping",
        description:
          "Gradient clipping limits the maximum gradient norm to prevent exploding gradients. This is critical for training RNNs and transformers where gradients can grow exponentially.",
        code: `import numpy as np

def clip_grad_by_norm(grad, max_norm):
    """Clip gradient by total norm."""
    grad_norm = np.linalg.norm(grad)
    if grad_norm > max_norm:
        grad = grad * max_norm / grad_norm
    return grad, grad_norm

def clip_grad_by_value(grad, clip_value):
    """Clip each gradient element individually."""
    return np.clip(grad, -clip_value, clip_value)

# Simulated gradients during training
np.random.seed(42)
gradients = [np.random.randn(100) * np.exp(0.1 * i) for i in range(20)]

print("Step\tRaw Norm\tClipped Norm")
for i, g in enumerate(gradients):
    clipped, raw_norm = clip_grad_by_norm(g, max_norm=5.0)
    clipped_norm = np.linalg.norm(clipped)
    if i % 5 == 0:
        print(f"{i:4d}\t{raw_norm:10.2f}\t{clipped_norm:10.2f}")

# In PyTorch:
# torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
# torch.nn.utils.clip_grad_value_(model.parameters(), clip_value=0.5)`,
      },
    ],
    realWorldUseCases: [
      "Training transformers: Adam with warmup and cosine decay is the standard optimizer for LLMs",
      "GAN training: alternating gradient penalties (WGAN-GP) stabilize adversarial training",
      "Reinforcement learning: TRPO and PPO use constrained gradient updates to prevent destructive policy changes",
      "Fine-tuning pretrained models: low learning rates with gradient clipping prevent catastrophic forgetting",
      "Distributed training: gradient accumulation and clipping maintain stability across large batch sizes",
    ],
    commonMistakes: [
      "Using Adam's default learning rate (0.001) for all tasks: this is a starting point, not a universal default. Transformers typically use 3e-4; CNNs often use 1e-3 to 1e-2 with SGD.",
      "Not using warmup for transformers: transformers are very sensitive to large initial gradients. Without warmup, training often diverges in the first few hundred steps.",
      "Clipping gradients too aggressively: clipping to a very small norm prevents large but valid updates, slowing training. A good default is max_norm=1.0.",
    ],
    interviewQuestions: [
      "Explain the difference between SGD, SGD with momentum, and Adam. Answer: SGD updates θ = θ - α∇L. Momentum adds a velocity term: v = βv + ∇L, θ = θ - αv, which smooths updates. Adam adds adaptive per-parameter learning rates using running averages of gradients (first moment) and squared gradients (second moment), plus bias correction.",
      "Why might Adam generalize worse than SGD? Answer: Adam's adaptive learning rates can lead to sharp minima that generalize poorly. The per-parameter adaptation can cause the optimizer to settle in narrow valleys of the loss landscape. SGD's uniform learning rate tends to find flatter minima, which often generalize better to test data.",
      "What is gradient accumulation and when would you use it? Answer: Gradient accumulation sums gradients over multiple forward-backward passes before updating parameters. It simulates a larger batch size when GPU memory is limited. If you accumulate over 4 micro-batches, it's equivalent to 4x your actual batch size.",
    ],
    glossary: [
      {
        term: "SGD",
        definition:
          "Stochastic Gradient Descent: Updates parameters using the gradient computed on a mini-batch. θ = θ - α∇L_batch. The foundational optimizer for deep learning.",
      },
      {
        term: "Adam",
        definition:
          "Adaptive Moment Estimation: Combines momentum (first moment) with adaptive learning rates (second moment). θ = θ - α·m_hat / (√v_hat + ε). The most popular optimizer for deep learning.",
      },
      {
        term: "Momentum",
        definition:
          "A technique that accumulates a velocity vector from past gradients. It accelerates convergence in consistent gradient directions and dampens oscillations in high-curvature directions.",
      },
      {
        term: "Gradient Clipping",
        definition:
          "Limiting the maximum norm (or value) of gradients to prevent exploding gradients. Essential for training RNNs and transformers.",
      },
    ],
    references: [
      {
        title: "Adam: A Method for Stochastic Optimization (Kingma & Ba, 2015)",
        url: "https://arxiv.org/abs/1412.6980",
        type: "paper",
      },
      {
        title: "On the momentum of SGD (Roux et al., 2018)",
        url: "https://arxiv.org/abs/1706.04857",
        type: "paper",
      },
    ],
    estimatedMinutes: 100,
    projects: [
      "Implement SGD, momentum, and Adam from scratch and compare convergence on benchmark functions",
      "Build a training dashboard that visualizes gradient norms, learning rates, and loss curves in real-time",
      "Experiment with different learning rate schedules on a small image classification task and compare final accuracy",
    ],
  },
  {
    id: "regularization-theory",
    title: "Regularization Theory",
    slug: "regularization-theory",
    category: "mathematics",
    difficulty: "intermediate",
    description:
      "Regularization techniques prevent overfitting by adding constraints or penalties to the learning process. L1 and L2 regularization add penalty terms to the loss function. Dropout randomly deactivates neurons during training. Early stopping halts training before overfitting. Weight decay shrinks parameters toward zero. These techniques are the difference between a model that memorizes training data and one that generalizes to unseen data.",
    whyItExists:
      "Neural networks have far more parameters than training examples, making them prone to overfitting. Without regularization, they can memorize training data perfectly while failing on test data. Regularization trades off training accuracy for generalization. It is the most practical tool for improving real-world model performance.",
    history:
      "Ridge regression (L2) was introduced by Hoerl and Kennard in 1970. LASSO (L1) was proposed by Tibshirani in 1996. Early stopping was described by Morgan and Bourlard in 1990. Dropout was introduced by Hinton et al. in 2012 and refined by Srivastava et al. (2014). The theoretical foundations were laid by Tikhonov (1943) and Vapnik's VC theory (1971).",
    prerequisites: ["optimization-theory"],
    relatedConcepts: [
      "gradient-methods",
      "optimization-theory",
      "information-theory",
    ],
    examples: [
      {
        title: "L1 vs L2 Regularization",
        description:
          "L2 regularization (Ridge) adds λ||w||² to the loss, pushing weights toward zero but rarely to exactly zero. L1 (LASSO) adds λ||w||₁, producing sparse weights (many exactly zero), which acts as feature selection.",
        code: `import numpy as np

np.random.seed(42)

# Synthetic data: y = 3x1 + 0x2 + 2x3 + noise
n = 100
X = np.random.randn(n, 3)
y = 3 * X[:, 0] + 2 * X[:, 2] + 0.5 * np.random.randn(n)

# L2 (Ridge) regression: closed-form solution
def ridge_regression(X, y, lam):
    n, p = X.shape
    I = np.eye(p)
    w = np.linalg.solve(X.T @ X + lam * I, X.T @ y)
    return w

# L1 (LASSO) regression: coordinate descent (simplified)
def lasso_regression(X, y, lam, steps=1000, lr=0.01):
    n, p = X.shape
    w = np.zeros(p)
    for _ in range(steps):
        for j in range(p):
            residual = y - X @ w + X[:, j] * w[j]
            grad = -X[:, j] @ residual / n
            # Soft thresholding for L1
            w[j] = np.sign(w[j] - lr * grad) * max(0, abs(w[j] - lr * grad) - lr * lam / n)
    return w

# Compare
w_true = np.array([3, 0, 2])
for lam in [0, 0.1, 1.0]:
    w_ridge = ridge_regression(X, y, lam)
    w_lasso = lasso_regression(X, y, lam)
    print(f"lambda={lam}: Ridge={w_ridge.round(3)}, LASSO={w_lasso.round(3)}")
    print(f"  True: {w_true}")
    # LASSO zeros out irrelevant feature x2`,
      },
      {
        title: "Dropout Theory",
        description:
          "Dropout randomly zeros out neurons during training with probability p. At test time, all neurons are active but outputs are scaled by (1-p). This is equivalent to training an ensemble of exponentially many sub-networks.",
        code: `import numpy as np

def forward_with_dropout(X, W, p_drop=0.5, training=True):
    """Forward pass with dropout regularization."""
    # Linear transformation
    z = X @ W

    if training:
        # Generate dropout mask
        mask = (np.random.rand(*z.shape) > p_drop).astype(float)
        # Scale by 1/(1-p) during training (inverted dropout)
        z = z * mask / (1 - p_drop)
    # At test time: no dropout, outputs are already correct scale
    return z

# Example: 3-layer network with dropout
np.random.seed(42)
X = np.random.randn(32, 64)   # Batch of 32, 64 features
W1 = np.random.randn(64, 128) * 0.01
W2 = np.random.randn(128, 10) * 0.01

# Training forward pass
h1 = np.maximum(0, forward_with_dropout(X, W1, p_drop=0.3, training=True))
output = forward_with_dropout(h1, W2, p_drop=0.5, training=True)
print(f"Training output shape: {output.shape}")

# Inference forward pass (no dropout)
h1_test = np.maximum(0, forward_with_dropout(X, W1, p_drop=0.3, training=False))
output_test = forward_with_dropout(h1_test, W2, p_drop=0.5, training=False)
print(f"Inference output shape: {output_test.shape}")
# Outputs have similar scale because of inverted dropout scaling`,
      },
      {
        title: "Early Stopping",
        description:
          "Early stopping monitors validation loss and stops training when it starts increasing, even though training loss continues to decrease. This finds the sweet spot between underfitting and overfitting.",
        code: `import numpy as np

def train_with_early_stopping(X_train, y_train, X_val, y_val,
                               epochs=1000, lr=0.01, patience=10):
    """Simple neural network with early stopping."""
    n_features = X_train.shape[1]
    n_hidden = 64
    W1 = np.random.randn(n_features, n_hidden) * 0.01
    b1 = np.zeros(n_hidden)
    W2 = np.random.randn(n_hidden, 1) * 0.01
    b2 = np.zeros(1)

    best_val_loss = float('inf')
    best_params = None
    patience_counter = 0

    for epoch in range(epochs):
        # Forward pass (training)
        z1 = X_train @ W1 + b1
        h1 = np.maximum(0, z1)  # ReLU
        pred = h1 @ W2 + b2

        # Compute losses
        train_loss = np.mean((pred.flatten() - y_train)**2)

        # Validation
        z1_val = X_val @ W1 + b1
        h1_val = np.maximum(0, z1_val)
        pred_val = h1_val @ W2 + b2
        val_loss = np.mean((pred_val.flatten() - y_val)**2)

        # Early stopping check
        if val_loss < best_val_loss:
            best_val_loss = val_loss
            best_params = (W1.copy(), b1.copy(), W2.copy(), b2.copy())
            patience_counter = 0
        else:
            patience_counter += 1
            if patience_counter >= patience:
                print(f"Early stopping at epoch {epoch}")
                break

        # Backward pass (simplified)
        d_out = 2 * (pred.flatten() - y_train) / len(y_train)
        dW2 = h1.T @ d_out.reshape(-1, 1)
        dW1 = (d_out.reshape(-1, 1) @ W2.T * (z1 > 0)).T @ X_train

        W2 -= lr * dW2
        W1 -= lr * dW1

    W1, b1, W2, b2 = best_params
    print(f"Best validation loss: {best_val_loss:.6f}")
    return W1, b1, W2, b2`,
      },
    ],
    realWorldUseCases: [
      "Image classification: dropout in fully connected layers reduces overfitting in CNNs like AlexNet and VGG",
      "NLP models: dropout is standard in transformer attention and feed-forward layers (typically p=0.1)",
      "Tabular data: L1 regularization (LASSO) selects relevant features in high-dimensional tabular datasets",
      "GAN training: spectral normalization and weight clipping regularize the discriminator",
      "Transfer learning: early stopping prevents overfitting when fine-tuning with small datasets",
    ],
    commonMistakes: [
      "Applying dropout at test time: dropout should only be active during training. At test time, use model.eval() in PyTorch or training=False in TensorFlow.",
      "Using L1 and L2 together without understanding Elastic Net: combining L1 and L2 (Elastic Net) can be beneficial, but the interaction between sparsity (L1) and smoothness (L2) needs careful tuning.",
      "Stopping training too early: patience should be large enough to allow recovery from temporary validation loss increases. Too small patience causes premature stopping.",
    ],
    interviewQuestions: [
      "Explain why dropout works as an ensemble method. Answer: Each training step randomly deactivates neurons, creating a different sub-network. Over many steps, you train an ensemble of exponentially many sub-networks. At test time, using all neurons with scaled weights approximates the average prediction of all sub-networks.",
      "When would you prefer L1 over L2 regularization? Answer: L1 produces sparse solutions (many weights exactly zero), making it useful for feature selection when you suspect many features are irrelevant. L2 produces small but non-zero weights, better when all features are potentially useful but you want to prevent large weights.",
      "What is the relationship between weight decay and L2 regularization? Answer: In standard gradient descent, weight decay (w = w - αλw) and L2 regularization (adding λ||w||² to the loss) are equivalent. However, in Adam, they differ because Adam's adaptive learning rates interact differently with the penalty term. AdamW decouples weight decay from the gradient.",
    ],
    glossary: [
      {
        term: "L2 Regularization",
        definition:
          "Adding λ||w||² to the loss function. Also called Ridge regression or weight decay. Shrinks weights toward zero but rarely to exactly zero.",
      },
      {
        term: "L1 Regularization",
        definition:
          "Adding λ||w||₁ to the loss function. Also called LASSO. Produces sparse weights (many exactly zero), performing implicit feature selection.",
      },
      {
        term: "Dropout",
        definition:
          "Randomly zeroing out neurons during training with probability p. Prevents co-adaptation of neurons and acts as an ensemble of sub-networks.",
      },
      {
        term: "Early Stopping",
        definition:
          "Halting training when validation performance stops improving. A simple and effective regularization technique that requires no changes to the model or loss function.",
      },
    ],
    references: [
      {
        title:
          "Dropout: A Simple Way to Prevent Neural Networks from Overfitting (Srivastava et al., 2014)",
        url: "https://jmlr.org/papers/v15/srivastava14a.html",
        type: "paper",
      },
      {
        title:
          "Statistical Learning with Sparsity (Hastie, Tibshirani, Wainwright, 2015)",
        url: "https://hastie.su.domains/SPM_outliers/sparsity.html",
        type: "book",
      },
    ],
    estimatedMinutes: 90,
    projects: [
      "Implement L1, L2, and Elastic Net regularization from scratch and compare feature selection on synthetic data",
      "Build a training pipeline with dropout, early stopping, and weight decay, measuring their individual and combined effects",
      "Visualize how regularization changes the decision boundary of a classifier on a 2D dataset",
    ],
  },
  {
    id: "bayesian-inference",
    title: "Bayesian Inference",
    slug: "bayesian-inference",
    category: "mathematics",
    difficulty: "advanced",
    description:
      "Bayesian inference is a framework for updating beliefs in light of evidence. Starting from a prior distribution, it computes the posterior distribution using Bayes' theorem: P(θ|data) ∝ P(data|θ) · P(θ). Unlike frequentist statistics, Bayesian inference produces full probability distributions over parameters, enabling uncertainty quantification. Key methods include MCMC (Markov Chain Monte Carlo) for exact inference and variational inference for scalable approximation.",
    whyItExists:
      "Standard neural networks give point predictions without uncertainty. Bayesian inference provides calibrated uncertainty estimates, which are critical for high-stakes applications (medical diagnosis, autonomous driving). It also provides a principled framework for incorporating prior knowledge and combining evidence from multiple sources. Bayesian deep learning, Gaussian processes, and probabilistic programming all build on these foundations.",
    history:
      "Thomas Bayes' theorem was published posthumously in 1763. Laplace independently developed Bayesian reasoning in the 1770s. The frequentist vs Bayesian debate dominated 20th-century statistics. MCMC methods (Metropolis algorithm, 1953; Gibbs sampling, 1984) made Bayesian computation practical. Variational inference for scalable Bayes was developed in the 2000s. Bayesian neural networks gained traction in the 2010s with advances in variational Bayes and MC Dropout.",
    prerequisites: ["probability-statistics"],
    relatedConcepts: [
      "information-theory",
      "probability-statistics",
      "regularization-theory",
    ],
    examples: [
      {
        title: "Conjugate Bayesian Updating",
        description:
          "With conjugate priors, the posterior has the same distribution as the prior, making computation analytically tractable. The Beta-Binomial model for coin flips is the classic example.",
        code: `import numpy as np
from scipy import stats

# Beta-Binomial conjugate model for estimating coin bias
# Prior: Beta(alpha, beta)
# Likelihood: Binomial(n, theta)
# Posterior: Beta(alpha + successes, beta + failures)

alpha_prior, beta_prior = 2, 2  # Prior: slightly favoring fair coin

# Observe data: 7 heads, 3 tails
heads, tails = 7, 3

# Update posterior
alpha_post = alpha_prior + heads
beta_post = beta_prior + tails

# Prior, likelihood, posterior
prior = stats.beta(alpha_prior, beta_prior)
posterior = stats.beta(alpha_post, beta_post)

# Compute posterior statistics
print(f"Prior mean: {prior.mean():.3f}")      # 0.500
print(f"Posterior mean: {posterior.mean():.3f}")  # 0.636
print(f"95% CI: [{posterior.ppf(0.025):.3f}, {posterior.ppf(0.975):.3f}]")

# Sequential updating: more data narrows the posterior
for n_obs in [10, 50, 100, 500]:
    h = int(n_obs * 0.7)  # 70% heads
    t = n_obs - h
    post = stats.beta(alpha_prior + h, beta_prior + t)
    ci = [post.ppf(0.025), post.ppf(0.975)]
    print(f"n={n_obs:3d}: mean={post.mean():.3f}, CI=[{ci[0]:.3f}, {ci[1]:.3f}]")
    # As n increases, posterior concentrates around true value`,
      },
      {
        title: "MCMC Sampling with Metropolis-Hastings",
        description:
          "MCMC draws samples from the posterior distribution by constructing a Markov chain. Metropolis-Hastings proposes new samples and accepts/rejects based on the posterior ratio.",
        code: `import numpy as np

def metropolis_hastings(log_posterior, initial, n_samples, proposal_std):
    """Simple Metropolis-Hastings sampler."""
    samples = [initial]
    current = initial
    current_log_prob = log_posterior(current)
    n_accepted = 0

    for _ in range(n_samples - 1):
        # Propose new state
        proposal = current + np.random.randn() * proposal_std
        proposal_log_prob = log_posterior(proposal)

        # Accept/reject
        log_accept = proposal_log_prob - current_log_prob
        if np.log(np.random.rand()) < log_accept:
            current = proposal
            current_log_prob = proposal_log_prob
            n_accepted += 1

        samples.append(current)

    acceptance_rate = n_accepted / n_samples
    return np.array(samples), acceptance_rate

# Posterior for a normal distribution with known variance
# Data: x = [2.3, 2.5, 2.7, 2.6] (known sigma = 0.5)
data = np.array([2.3, 2.5, 2.7, 2.6])
sigma_known = 0.5
n = len(data)
x_bar = data.mean()

def log_posterior(mu):
    # Prior: N(0, 10) (weakly informative)
    log_prior = -0.5 * (mu / 10)**2
    # Likelihood: N(mu, sigma^2/n)
    log_lik = -0.5 * n * ((mu - x_bar) / sigma_known)**2
    return log_prior + log_lik

# True posterior is analytical: N(x_bar, sigma^2/n)
# But we demonstrate MCMC
samples, acc_rate = metropolis_hastings(log_posterior, initial=0.0,
                                         n_samples=10000, proposal_std=0.3)
burn_in = 1000
samples = samples[burn_in:]

print(f"Posterior mean (MCMC): {samples.mean():.3f}")
print(f"Posterior mean (exact): {x_bar:.3f}")
print(f"Posterior std (MCMC): {samples.std():.3f}")
print(f"Posterior std (exact): {sigma_known / np.sqrt(n):.3f}")
print(f"Acceptance rate: {acc_rate:.2%}")  # Ideal: 23-50%`,
      },
      {
        title: "Variational Inference",
        description:
          "Variational inference approximates the posterior with a simpler distribution (e.g., Gaussian) by minimizing KL divergence. It trades exactness for scalability, making Bayesian inference practical for large models.",
        code: `import numpy as np

# Variational inference for linear regression
# Approximate posterior q(w) = N(mu_q, sigma_q^2)

def variational_linear_regression(X, y, n_iterations=500, lr=0.01):
    """Simple variational inference for Bayesian linear regression."""
    n, d = X.shape

    # Initialize variational parameters
    mu_q = np.zeros(d)           # Mean of q(w)
    log_sigma_q = np.zeros(d)    # Log variance of q(w)

    for _ in range(n_iterations):
        sigma_q = np.exp(log_sigma_q)

        # Expected log-likelihood (ELBO gradient terms)
        # E_q[||y - Xw||^2] = ||y - X mu_q||^2 + sum_i sigma_q_i * X_i^T X_i
        pred = X @ mu_q
        residual_sq = np.sum((y - pred)**2)

        # Trace term: sum of diagonal of X^T X times sigma_q
        trace = np.sum(np.diag(X.T @ X) * sigma_q)

        # Gradient w.r.t. mu_q
        grad_mu = -(residual_sq + trace) / (2 * sigma_q.mean() + 1e-8) + mu_q / 10  # prior

        # Gradient w.r.t. log_sigma_q (reparameterization trick)
        grad_log_sigma = -0.5 * (trace / (sigma_q + 1e-8) - 1) + 0.5  # prior

        mu_q -= lr * grad_mu
        log_sigma_q -= lr * grad_log_sigma

    return mu_q, np.exp(log_sigma_q)

# Generate data
np.random.seed(42)
X = np.random.randn(100, 3)
true_w = np.array([1.0, -2.0, 0.5])
y = X @ true_w + 0.1 * np.random.randn(100)

mu_q, sigma_q = variational_linear_regression(X, y)
print(f"True weights: {true_w}")
print(f"VI mean: {mu_q.round(3)}")
print(f"VI std: {np.sqrt(sigma_q).round(3)}")  # Uncertainty estimates!`,
      },
    ],
    realWorldUseCases: [
      "Gaussian processes: Bayesian non-parametric models for regression with uncertainty estimates",
      "Bayesian neural networks: weight distributions instead of point estimates, enabling uncertainty quantification",
      "A/B testing: Bayesian A/B testing provides probability that variant A is better than B, not just p-values",
      "Medical diagnosis: posterior distributions over disease probability account for uncertainty in symptoms",
      "Reinforcement learning: Bayesian optimization tunes hyperparameters efficiently by modeling the objective",
    ],
    commonMistakes: [
      "Confusing posterior predictive with posterior: the posterior is P(θ|data); the posterior predictive is P(y_new|data) = ∫P(y_new|θ)P(θ|data)dθ. The predictive distribution accounts for both parameter uncertainty and observation noise.",
      "Using too few MCMC samples: MCMC requires enough samples to converge and explore the posterior. Always check convergence diagnostics (R-hat, effective sample size, trace plots).",
      "Choosing an inappropriate prior: highly informative priors can dominate the data, especially with small samples. Weakly informative priors (e.g., N(0,10)) are often safer defaults.",
    ],
    interviewQuestions: [
      "What is the difference between Bayesian and frequentist inference? Answer: Frequentists treat parameters as fixed unknowns and compute p-values P(data|H0). Bayesians treat parameters as random variables and compute posterior distributions P(θ|data). Bayesian inference incorporates prior knowledge and produces probability distributions, not just point estimates.",
      "Why is MCMC needed for Bayesian inference? Answer: Computing the posterior P(θ|data) = P(data|θ)P(θ)/P(data) requires integrating over all possible parameter values (the denominator). This integral is intractable for complex models. MCMC draws samples from the posterior without computing the integral directly.",
      "What is the ELBO in variational inference? Answer: The Evidence Lower Bound (ELBO) = E_q[log p(data|θ)] - KL(q(θ)||p(θ)). Maximizing the ELBO minimizes KL(q||posterior). It decomposes into expected log-likelihood (goodness of fit) minus KL divergence from prior (complexity penalty).",
    ],
    glossary: [
      {
        term: "Posterior",
        definition:
          "P(θ|data) ∝ P(data|θ) · P(θ). The updated belief about parameters after observing data. The core output of Bayesian inference.",
      },
      {
        term: "Prior",
        definition:
          "P(θ). The initial belief about parameters before seeing data. Encodes domain knowledge or assumptions. Should be updated as more data arrives.",
      },
      {
        term: "MCMC",
        definition:
          "Markov Chain Monte Carlo: A family of algorithms that draw samples from a probability distribution by constructing a Markov chain whose stationary distribution is the target distribution.",
      },
      {
        term: "Variational Inference",
        definition:
          "An approximate Bayesian inference method that fits a simple distribution q(θ) to approximate the posterior by minimizing KL(q||posterior). Faster than MCMC but approximate.",
      },
    ],
    references: [
      {
        title:
          "Pattern Recognition and Machine Learning (Bishop, 2006) - Chapter 3",
        url: "https://www.microsoft.com/en-us/research/publication/pattern-recognition-machine-learning/",
        type: "book",
      },
      {
        title:
          "Variational Inference: A Review for Statisticians (Blei et al., 2017)",
        url: "https://arxiv.org/abs/1601.00670",
        type: "paper",
      },
    ],
    estimatedMinutes: 150,
    projects: [
      "Implement MCMC from scratch to estimate parameters of a Bayesian linear regression model",
      "Build a Bayesian neural network using variational inference and compare uncertainty estimates with a standard network",
      "Create a Bayesian A/B testing calculator that computes the probability that variant A beats variant B",
    ],
  },
  {
    id: "kernel-methods",
    title: "Kernel Methods",
    slug: "kernel-methods",
    category: "mathematics",
    difficulty: "advanced",
    description:
      "Kernel methods implicitly map data into high-dimensional feature spaces where linear separation becomes possible. The kernel trick computes inner products in this high-dimensional space without explicitly transforming the data, making it computationally efficient. Support Vector Machines (SVMs) with kernel functions can learn non-linear decision boundaries. The theory of Reproducing Kernel Hilbert Spaces (RKHS) provides the mathematical foundation for understanding why kernels work and what functions they can represent.",
    whyItExists:
      "Real-world data is rarely linearly separable. Kernel methods provide a principled way to learn non-linear patterns without manually engineering features. SVMs with RBF kernels were the dominant classification method before deep learning and remain competitive for small-to-medium datasets. Kernel methods also underpin Gaussian processes, kernel PCA, and many modern techniques in representation learning.",
    history:
      "The kernel trick was introduced by Aizerman et al. (1964) for the perceptron. Vapnik developed SVMs in the 1960s-90s, combining kernels with maximum-margin classification. The connection to RKHS was formalized by Kimeldorf and Wahba (1970) and Schölkopf and Smola (2002). The NIPS 2003 paper on kernel methods catalyzed their adoption. While deep learning has superseded kernels for many tasks, kernel methods remain important for theoretical insights and small-data regimes.",
    prerequisites: ["linear-algebra", "optimization-theory"],
    relatedConcepts: [
      "linear-algebra",
      "optimization-theory",
      "probability-statistics",
    ],
    examples: [
      {
        title: "The Kernel Trick",
        description:
          "Instead of mapping data to high-dimensional space and computing dot products, kernel functions compute the same result directly. The RBF kernel implicitly maps to infinite-dimensional space.",
        code: `import numpy as np

# The kernel trick: compute dot products in high-dimensional space
# without explicitly mapping to that space

def linear_kernel(x1, x2):
    return np.dot(x1, x2)

def polynomial_kernel(x1, x2, degree=3):
    return (np.dot(x1, x2) + 1) ** degree

def rbf_kernel(x1, x2, gamma=1.0):
    return np.exp(-gamma * np.linalg.norm(x1 - x2)**2)

# Compare: explicit mapping vs kernel trick
# For polynomial kernel of degree 2
X = np.array([[1, 2], [3, 4]])

# Explicit mapping: phi(x) = [x1^2, x2^2, sqrt(2)*x1*x2, sqrt(2)*x1, sqrt(2)*x2, 1]
def phi(x):
    x1, x2 = x
    return np.array([x1**2, x2**2, np.sqrt(2)*x1*x2,
                     np.sqrt(2)*x1, np.sqrt(2)*x2, 1])

# Kernel trick
k_matrix = np.zeros((2, 2))
for i in range(2):
    for j in range(2):
        k_matrix[i, j] = polynomial_kernel(X[i], X[j], degree=2)

# Explicit computation
phi_matrix = np.array([phi(x) for x in X])
explicit = phi_matrix @ phi_matrix.T

print("Kernel trick:\\n", k_matrix)
print("Explicit:\\n", explicit)
print("Match:", np.allclose(k_matrix, explicit))

# RBF kernel: infinite-dimensional implicit mapping
print("\\nRBF kernel matrix:")
for i in range(2):
    for j in range(2):
        print(f"  K({X[i]}, {X[j]}) = {rbf_kernel(X[i], X[j]):.4f}")`,
      },
      {
        title: "SVM with Custom Kernel",
        description:
          "SVMs find the maximum-margin separating hyperplane. With kernel functions, the same algorithm learns non-linear decision boundaries by working in the implicit feature space.",
        code: `import numpy as np
from sklearn.svm import SVC
from sklearn.datasets import make_moons
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# Generate non-linear data
X, y = make_moons(n_samples=200, noise=0.2, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3)

# Linear SVM (will fail on non-linear data)
svm_linear = SVC(kernel='linear')
svm_linear.fit(X_train, y_train)
acc_linear = accuracy_score(y_test, svm_linear.predict(X_test))

# RBF kernel SVM (will succeed)
svm_rbf = SVC(kernel='rbf', gamma='scale', C=1.0)
svm_rbf.fit(X_train, y_train)
acc_rbf = accuracy_score(y_test, svm_rbf.predict(X_test))

# Polynomial kernel SVM
svm_poly = SVC(kernel='poly', degree=3, gamma='scale')
svm_poly.fit(X_train, y_train)
acc_poly = accuracy_score(y_test, svm_poly.predict(X_test))

print(f"Linear kernel accuracy: {acc_linear:.3f}")
print(f"RBF kernel accuracy: {acc_rbf:.3f}")
print(f"Poly kernel accuracy: {acc_poly:.3f}")

# Support vectors
print(f"\\nRBF SVM support vectors: {svm_rbf.n_support_}")
print(f"Total support vectors: {len(svm_rbf.support_vectors_)}")`,
      },
      {
        title: "Kernel PCA for Non-Linear Dimensionality Reduction",
        description:
          "Kernel PCA applies PCA in the implicit feature space, finding non-linear principal components. It can uncover structure that standard PCA misses.",
        code: `import numpy as np
from sklearn.decomposition import PCA, KernelPCA
from sklearn.datasets import make_circles

# Generate concentric circles (not linearly separable)
X, y = make_circles(n_samples=300, factor=0.1, noise=0.1, random_state=42)

# Standard PCA: fails to separate circles
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X)

# Kernel PCA with RBF kernel: succeeds
kpca = KernelPCA(n_components=2, kernel='rbf', gamma=2.0)
X_kpca = kpca.fit_transform(X)

# Compare variance explained
print("Standard PCA:")
print(f"  Components: {pca.components_.round(3)}")
print(f"  Explained variance: {pca.explained_variance_ratio_.round(3)}")

print("\\nKernel PCA (RBF):")
print(f"  First component separates the two circles")
print(f"  Shape of transformed data: {X_kpca.shape}")

# The kernel trick makes this computationally feasible
# without explicitly computing the infinite-dimensional mapping`,
      },
    ],
    realWorldUseCases: [
      "Text classification: string kernels and graph kernels classify documents and molecules without feature engineering",
      "Bioinformatics: kernel methods classify proteins based on sequence similarity kernels",
      "Image recognition: histogram intersection kernels compare image patches efficiently",
      "Time series analysis: dynamic time warping kernels measure similarity between temporal sequences",
      "Anomaly detection: one-class SVM with RBF kernel identifies outliers in high-dimensional data",
    ],
    commonMistakes: [
      "Using RBF kernel with too large gamma: gamma too large makes the kernel too local, overfitting to individual training points. Each point becomes its own island. Use grid search to tune gamma.",
      "Not scaling features before using kernels: kernels like RBF depend on distances between points. If features have different scales, the distance metric is dominated by the largest-scale feature. Always standardize.",
      "Assuming more complex kernels are better: a linear kernel often works well for high-dimensional data (text, genomics). The curse of dimensionality makes non-linear kernels less effective in high dimensions.",
    ],
    interviewQuestions: [
      "Explain the kernel trick and why it's useful. Answer: The kernel trick computes dot products in a high-dimensional feature space without explicitly mapping data to that space. K(x1, x2) = φ(x1)·φ(x2). The RBF kernel implicitly maps to infinite-dimensional space, which would be computationally impossible to compute explicitly. This allows SVMs to learn non-linear boundaries efficiently.",
      "Why are kernel methods less popular than deep learning? Answer: Kernel methods scale poorly with dataset size (SVM training is O(n²) to O(n³)), while deep learning scales to billions of examples. Kernel methods also require hand-crafted kernels for each domain, while deep networks learn representations automatically. However, kernel methods provide stronger theoretical guarantees and work better on small datasets.",
      "What is the connection between kernel methods and Gaussian processes? Answer: Gaussian processes with a kernel function k(x,x') define a distribution over functions where any finite set of function values is jointly Gaussian with covariance given by the kernel matrix. GP regression is equivalent to kernel ridge regression. Both use the kernel to define similarity between data points.",
    ],
    glossary: [
      {
        term: "Kernel Trick",
        definition:
          "Computing dot products in a high-dimensional feature space using a kernel function without explicitly mapping data to that space. K(x1, x2) = φ(x1)·φ(x2) where φ is the implicit feature map.",
      },
      {
        term: "SVM",
        definition:
          "Support Vector Machine: A classifier that finds the maximum-margin separating hyperplane. With kernel functions, it learns non-linear decision boundaries by working in the implicit feature space.",
      },
      {
        term: "RKHS",
        definition:
          "Reproducing Kernel Hilbert Space: A Hilbert space of functions where evaluation at any point can be expressed as an inner product with a kernel function. The theoretical foundation for kernel methods.",
      },
      {
        term: "RBF Kernel",
        definition:
          "Radial Basis Function kernel: K(x,x') = exp(-γ||x-x'||²). Maps to infinite-dimensional space. The most commonly used non-linear kernel. Parameter γ controls the kernel width.",
      },
    ],
    references: [
      {
        title: "Learning with Kernels (Schölkopf & Smola, 2002)",
        url: "https://mitpress.mit.edu/9780262194755/learning-with-kernels/",
        type: "book",
      },
      {
        title: "Support-Vector Networks (Cortes & Vapnik, 1995)",
        url: "https://link.springer.com/article/10.1007/BF00994018",
        type: "paper",
      },
    ],
    estimatedMinutes: 120,
    projects: [
      "Implement an SVM from scratch with custom kernel functions and compare with sklearn's SVC",
      "Build a kernel PCA visualization that shows how different kernels uncover different data structure",
      "Create a protein classification system using string kernels to compare amino acid sequences",
    ],
  },
];
