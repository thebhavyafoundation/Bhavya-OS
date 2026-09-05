import fs from 'fs';
const path = 'F:/Bhavya Foundation/apps/ai-institute/src/data/academy-lessons.ts';
let content = fs.readFileSync(path, 'utf8');

const block = `
  // ═══════════════════════════════════════════════════════════════════
  // MATHEMATICS FOR AI
  // ═══════════════════════════════════════════════════════════════════

  "math-1-1": {
    id: "math-1-1",
    title: "Vectors and Vector Spaces",
    reading: \`
## Vectors - The Language of AI

Every piece of data in AI is a vector. An image is a vector of pixel values, a sentence is a sequence of word vectors, and a user profile is a vector of features. Understanding vectors is the first step to understanding how AI represents the world.

A vector is an ordered list of numbers. In 2D, a vector like [3, 4] represents a point or direction. In machine learning, vectors often live in hundreds or thousands of dimensions. Each number is a feature — for example, a house vector might be [1500, 3, 2] meaning 1500 sq ft, 3 bedrooms, 2 bathrooms.

## Vector Operations

The operations on vectors have geometric meaning. **Addition** combines directions: [1, 2] + [3, 1] = [4, 3]. Visually, you place vectors tip-to-tail. **Scalar multiplication** scales a vector: 2 * [1, 2] = [2, 4], stretching it. The **dot product** measures alignment: a . b = |a||b|cos(theta). If the dot product is zero, vectors are perpendicular. If positive, they point in similar directions. This is how AI measures similarity — two documents with a high dot product between their embedding vectors are semantically similar.

The **norm** (or length) of a vector is its magnitude. The L2 norm is sqrt(sum(x_i^2)). Normalizing a vector (dividing by its norm) gives a unit vector pointing in the same direction. Most ML models normalize inputs so that no single feature dominates due to scale.

## Vector Spaces and Linear Combinations

A vector space is a collection of vectors where you can add any two vectors and multiply any vector by a scalar and stay in the space. The set of all 3D vectors is a vector space. A **linear combination** of vectors v1, v2, ..., vk is c1*v1 + c2*v2 + ... + ck*vk. If you can reach any vector in the space via linear combinations of a set, that set **spans** the space.

A set of vectors is **linearly independent** if no vector can be written as a combination of the others. The number of independent vectors needed to span the space is its **dimension**. In AI, dimension equals the number of features. A dataset with 784 pixels per image lives in a 784-dimensional space.

## Why This Matters for AI

Neural networks are vector-to-vector transformations. Word embeddings like Word2Vec map words to vectors where arithmetic captures meaning: king - man + woman is close to queen. Understanding that data lives in vector spaces lets you reason about distance, similarity, and transformation — the core operations of every ML model.

When you compute cosine similarity between two embedding vectors, you are measuring the angle between them in high-dimensional space. That single geometric idea powers search, recommendation, and retrieval-augmented generation.
    \`,
    keyConcepts: [
      { term: "Vector", definition: "An ordered list of numbers representing a point or direction in space; the fundamental data structure for representing features, embeddings, and activations in AI." },
      { term: "Dot Product", definition: "The sum of element-wise products of two vectors; measures alignment and, when normalized, gives cosine similarity between vectors." },
      { term: "Vector Space", definition: "A set of vectors closed under addition and scalar multiplication; the mathematical space in which data and model parameters live." },
      { term: "Linear Independence", definition: "A property where no vector in a set can be expressed as a linear combination of the others; determines the true dimensionality of the data." },
    ],
    examples: [
      {
        title: "Document Similarity with Dot Products",
        code: "import numpy as np\\ndoc_a = np.array([0.8, 0.6, 0.0])\\ndoc_b = np.array([0.7, 0.5, 0.1])\\ncos_sim = np.dot(doc_a, doc_b) / (np.linalg.norm(doc_a) * np.linalg.norm(doc_b))\\n# cos_sim ~ 0.99 -> highly similar",
        explanation: "Two documents are embedded as 3D vectors. Their cosine similarity near 1.0 means they point in almost the same direction, indicating similar content. This is how semantic search ranks results.",
      },
    ],
    exercises: [
      { id: "math-1-1-ex-1", title: "Compute and Interpret", type: "reflection", instructions: "Given vectors u = [2, 3, 1] and v = [1, -1, 4], compute u+v, 3u, the dot product u.v, and the L2 norm of u. Interpret what the sign of the dot product tells you about their direction." },
      { id: "math-1-1-ex-2", title: "Spanning and Independence", type: "reflection", instructions: "Are the vectors [1,0,0], [0,1,0], and [1,1,0] linearly independent? Do they span R3? Explain why dimension matters when choosing how many features to collect for a model." },
    ],
    reflection: {
      prompt: "Why do you think AI systems represent everything — words, images, sounds — as vectors in high-dimensional spaces? What is gained and what is lost?",
      followUp: ["How does the choice of vector dimension affect what a model can represent?", "When might two very different inputs end up close together in vector space? Is that a problem?"],
    },
  },

  "math-1-2": {
    id: "math-1-2",
    title: "Matrices and Linear Transformations",
    reading: \`
## From Vectors to Matrices

If a vector is a list of numbers, a matrix is a table of numbers — rows and columns. In AI, matrices are everywhere: a dataset is a matrix (rows = examples, columns = features), an image is a matrix of pixel intensities, and the weights of a neural network layer are a matrix.

A matrix with shape (m x n) has m rows and n columns. A vector is a special case: an (n x 1) column vector or (1 x n) row vector.

## Matrix Multiplication

Matrix multiplication is the core computation of deep learning. If A is (m x n) and B is (n x p), their product C = A*B is (m x p) where C[i,j] = sum_k A[i,k]*B[k,j]. Each entry is a dot product of a row of A with a column of B.

In a neural network layer, the operation y = W*x + b is a matrix-vector product. W is the weight matrix, x is the input vector, b is the bias. Stacking many inputs into a batch matrix X, the layer computes Y = X*W^T + b for all examples at once — this is why GPUs, which excel at parallel matrix math, accelerated AI.

Matrix multiplication is not commutative: A*B is generally not equal to B*A. Order matters. This mirrors function composition: applying transformation A then B is different from B then A.

## Linear Transformations

Every matrix defines a linear transformation — it maps vectors to new vectors while preserving lines and the origin. A 2x2 matrix can rotate, scale, shear, or reflect 2D vectors. For example, the matrix [[0, -1],[1, 0]] rotates any vector 90 degrees counter-clockwise.

In ML, each layer of a neural network is a linear transformation followed by a non-linear activation. Without the non-linearity, stacking many matrices would collapse to a single matrix (since the product of matrices is another matrix), and the network could only learn linear functions. The activation functions like ReLU break this linearity, allowing deep networks to learn complex patterns.

## Transpose, Inverse, and Rank

The **transpose** A^T flips rows and columns. The **inverse** A^{-1} undoes the transformation: A^{-1}*A = I (identity). Not all matrices are invertible — only square matrices with full rank have inverses. The **rank** is the number of linearly independent rows or columns. A low-rank matrix has redundant information. This is exploited in model compression: approximating a large weight matrix with two smaller low-rank matrices saves memory with minimal accuracy loss.

Understanding these properties helps you debug models. If a covariance matrix is singular (not invertible), it means some features are perfectly correlated and one can be removed.
    \`,
    keyConcepts: [
      { term: "Matrix Multiplication", definition: "The operation where each entry of the product is the dot product of a row from the first matrix and a column from the second; the fundamental computation in neural network forward passes." },
      { term: "Linear Transformation", definition: "A mapping defined by a matrix that transforms vectors while preserving vector addition and scalar multiplication; geometrically rotates, scales, or shears space." },
      { term: "Rank", definition: "The number of linearly independent rows or columns in a matrix; indicates the true information content and whether the matrix is invertible." },
      { term: "Transpose", definition: "The matrix obtained by swapping rows and columns; used extensively in backpropagation and in computing projections and covariances." },
    ],
    examples: [
      {
        title: "Neural Network Layer as Matrix Multiplication",
        code: "import numpy as np\\nW = np.array([[0.5, -0.2, 0.1],[0.3, 0.8, -0.4]])  # 2x3 weight matrix\\nx = np.array([1.0, 2.0, 3.0])  # 3D input\\nb = np.array([0.1, -0.1])\\ny = W @ x + b  # shape (2,) -> output of layer with 2 neurons\\n# y = [0.5*1 + -0.2*2 + 0.1*3 + 0.1, 0.3*1 + 0.8*2 + -0.4*3 -0.1]",
        explanation: "A layer with 3 inputs and 2 neurons stores weights as a 2x3 matrix. Multiplying the matrix by the input vector (plus bias) produces 2 activations. Batching stacks many x vectors into a matrix for efficient parallel computation.",
      },
    ],
    exercises: [
      { id: "math-1-2-ex-1", title: "Matrix Shapes and Products", type: "reflection", instructions: "If matrix A is 4x3 and matrix B is 3x5, what is the shape of A*B and B*A (if defined)? A neural network layer has weight matrix shape (128x768). How many parameters does it have, and what input/output dimensions does it imply?" },
      { id: "math-1-2-ex-2", title: "When Matrices Fail", type: "reflection", instructions: "A dataset has features where column 3 = 2*column 1 + column 2 exactly. What does this imply about the rank of the data matrix? Why would this cause problems when trying to invert X^T X in linear regression?" },
    ],
    reflection: {
      prompt: "Matrix multiplication dominates the compute cost of training large models. Why does this single operation matter so much, and what does it imply about hardware design for AI?",
      followUp: ["Why do we batch inputs into matrices instead of processing vectors one at a time?", "What happens geometrically when you multiply by a matrix with very small or very large entries?"],
    },
  },

  "math-1-3": {
    id: "math-1-3",
    title: "Eigenvalues and Decompositions",
    reading: \`
## The Special Directions

When a matrix transforms a vector, most vectors change direction. But some vectors only get stretched or shrunk — they keep their direction. These special vectors are called **eigenvectors**, and the stretch factor is the **eigenvalue**.

Formally, for square matrix A, a non-zero vector v is an eigenvector if A*v = lambda*v, where lambda is the eigenvalue. The eigenvalue tells you how much the matrix scales the eigenvector. If lambda > 1, the direction is stretched; if 0 < lambda < 1, it is compressed; if lambda is negative, the direction is flipped.

## Why Eigenvalues Matter

Eigenvalues reveal the character of a transformation. Consider the covariance matrix of a dataset. Its eigenvectors point in the directions of greatest variance, and the eigenvalues tell you how much variance lies along each direction. This is the foundation of Principal Component Analysis (PCA) — the eigenvectors with the largest eigenvalues are the principal components that capture most of the data's spread.

In dynamical systems and recurrent neural networks, eigenvalues determine stability. If the largest eigenvalue of a weight matrix exceeds 1, repeated multiplication can cause activations or gradients to explode. If it is much less than 1, they vanish. This is the exploding/vanishing gradient problem that architectures like LSTM and careful initialization aim to solve.

## Matrix Decompositions

Decompositions factor a matrix into simpler pieces that reveal structure.

**Eigendecomposition:** A symmetric matrix A can be written as A = Q * Lambda * Q^T, where Q holds the eigenvectors and Lambda is a diagonal matrix of eigenvalues. This only works for square, diagonalizable matrices.

**Singular Value Decomposition (SVD):** Any matrix A (even rectangular) can be written as A = U * Sigma * V^T. Sigma is diagonal with **singular values** (non-negative, sorted largest first), U holds left singular vectors, V holds right singular vectors. SVD is the most general and numerically stable decomposition. It powers recommendation systems (factorizing the user-item rating matrix), image compression (keeping only the largest singular values), and latent semantic analysis.

**Other decompositions:** QR factors a matrix into an orthogonal and an upper-triangular piece (used in solving least squares). Cholesky factors a positive-definite matrix as L*L^T (used in Gaussian processes and optimization).

## From Theory to Practice

In AI, you rarely compute eigenvalues by hand. Libraries do it. What matters is intuition: eigenvalues measure importance, eigenvectors show directions, and decompositions separate signal from noise. When you choose to keep the top 50 principal components out of 784, you are keeping the 50 eigenvectors with the largest eigenvalues — the 50 directions that matter most.
    \`,
    keyConcepts: [
      { term: "Eigenvector and Eigenvalue", definition: "A vector whose direction is unchanged by a matrix transformation, scaled by its eigenvalue; reveals the principal directions and scaling behavior of the matrix." },
      { term: "Singular Value Decomposition (SVD)", definition: "Factorization of any matrix A into U Sigma V^T; generalizes eigendecomposition to rectangular matrices and orders components by importance via singular values." },
      { term: "Spectral Properties", definition: "The set of eigenvalues and eigenvectors of a matrix; determines stability, variance distribution, and conditioning of linear systems." },
    ],
    examples: [
      {
        title: "PCA via Eigendecomposition",
        code: "import numpy as np\\nX = np.random.randn(100, 5)  # 100 points in 5D\\ncov = np.cov(X, rowvar=False)  # 5x5 covariance\\neigenvalues, eigenvectors = np.linalg.eig(cov)\\nidx = np.argsort(eigenvalues)[::-1]  # sort descending\\neigenvalues, eigenvectors = eigenvalues[idx], eigenvectors[:, idx]\\n# Top 2 eigenvectors capture most variance -> project onto them",
        explanation: "Computing the eigendecomposition of the covariance matrix gives principal components ordered by variance. Projecting data onto the top k eigenvectors reduces dimension while preserving the most informative directions.",
      },
    ],
    exercises: [
      { id: "math-1-3-ex-1", title: "Eigen-Intuition", type: "reflection", instructions: "The matrix [[3,0],[0,0.5]] has eigenvectors [1,0] and [0,1] with eigenvalues 3 and 0.5. Describe geometrically what this matrix does to any vector. Which direction is amplified, which is suppressed? How would repeated application (A^n * v) behave?" },
      { id: "math-1-3-ex-2", title: "SVD Truncation", type: "reflection", instructions: "An image matrix has singular values [120, 45, 12, 3, 0.5, ...]. If you keep only the top 3 singular values and reconstruct, will the image look reasonable? Why does keeping larger singular values preserve more visual quality? What tradeoff are you making?" },
    ],
    reflection: {
      prompt: "If eigenvalues tell you which directions matter most in your data, what are the implications for collecting vs. discarding data? When is compression via decomposition beneficial versus harmful?",
      followUp: ["How might the eigenvalue spectrum of a dataset tell you whether PCA will be effective?", "Why does the stability of a recurrent network depend on eigenvalue magnitudes?"],
    },
  },

  "math-2-1": {
    id: "math-2-1",
    title: "Derivatives and Gradients",
    reading: \`
## The Idea of a Derivative

A derivative measures how fast a function changes. If f(x) is your position over time, f'(x) is your velocity — the rate of change. Formally, f'(x) = limit as h->0 of [f(x+h) - f(x)]/h, the slope of the tangent line at x.

For AI, the function is usually the **loss** — how wrong the model is. The derivative of loss with respect to a parameter tells you: if I nudge this parameter a little, does the loss go up or down, and how steeply? That signal is what lets the model learn.

## Rules You Use Constantly

A few rules handle most derivatives in ML:

- **Power rule:** d/dx x^n = n*x^{n-1}
- **Sum rule:** d/dx [f+g] = f' + g'
- **Product rule:** d/dx [f*g] = f'*g + f*g'
- **Chain rule:** d/dx f(g(x)) = f'(g(x)) * g'(x) — the most important rule in deep learning, as it lets you differentiate through compositions.

For example, if your model computes z = w*x + b and loss = (z - y)^2, the chain rule gives d(loss)/dw = 2*(z - y) * x. This tells you exactly how to adjust w to reduce loss.

## From Derivatives to Gradients

When a function has many inputs — f(x1, x2, ..., xn) — the **gradient** collects all partial derivatives into a vector: grad f = [df/dx1, df/dx2, ..., df/dxn]. The gradient points in the direction of steepest ascent. To minimize a function, you step in the opposite direction: -grad f.

Geometrically, imagine a hilly terrain where height is the loss. The gradient at your current position is an arrow pointing straight uphill. Walking downhill means stepping opposite to the gradient. This is gradient descent.

## Derivatives in Practice

Modern frameworks (PyTorch, TensorFlow, JAX) compute derivatives automatically via **automatic differentiation (autodiff)**. You define the forward computation, and the framework applies the chain rule backward to get every gradient. You rarely differentiate by hand, but you must understand what the gradient means.

Key intuitions: a gradient of zero means you are at a flat spot — possibly a minimum, maximum, or saddle point. A large gradient means the loss is very sensitive to that parameter. A gradient that is consistently zero for a parameter means that parameter is not learning — a symptom of dead ReLUs or vanishing gradients.

Understanding derivatives as sensitivity — how much does the output wiggle when I wiggle the input — makes it easier to reason about learning dynamics, regularization, and why some architectures train more easily than others.
    \`,
    keyConcepts: [
      { term: "Derivative", definition: "The instantaneous rate of change of a function at a point; the slope of the tangent line, indicating how the output responds to small changes in input." },
      { term: "Gradient", definition: "The vector of partial derivatives of a scalar function with respect to each of its inputs; points in the direction of steepest increase." },
      { term: "Partial Derivative", definition: "The derivative of a multivariable function with respect to one variable while holding others fixed; measures sensitivity along a single axis." },
      { term: "Automatic Differentiation", definition: "A technique that computes exact derivatives by systematically applying the chain rule to elementary operations; how deep learning frameworks obtain gradients." },
    ],
    examples: [
      {
        title: "Gradient of Mean Squared Error",
        code: "import numpy as np\\n# Loss = (w*x + b - y)^2 for single example\\nx, y = 2.0, 5.0\\nw, b = 1.0, 0.5\\nz = w*x + b  # 2.5\\nloss = (z - y)**2  # 6.25\\ndloss_dz = 2*(z - y)  # -5.0\\ndloss_dw = dloss_dz * x  # -10.0\\ndloss_db = dloss_dz * 1  # -5.0\\n# Negative gradients -> increasing w and b will reduce loss",
        explanation: "Using the chain rule, we compute how the loss changes with respect to each parameter. Both gradients are negative, so increasing w and b moves loss downward. The magnitude tells you w has twice the influence of b for this example.",
      },
    ],
    exercises: [
      { id: "math-2-1-ex-1", title: "Chain Rule Practice", type: "reflection", instructions: "Let f(x) = (3x^2 + 2x)^4. Compute f'(x) using the chain rule step by step. Then consider loss = sigmoid(w*x) with sigmoid(z)=1/(1+e^-z). Derive d(loss)/dw and explain why the gradient vanishes when sigmoid saturates." },
      { id: "math-2-1-ex-2", title: "Gradient Direction", type: "reflection", instructions: "A loss function L(a,b) = a^2 + 5*b^2 has gradient [2a, 10b]. At point (2,1), what is the gradient? Which direction should you step to reduce loss fastest? Why does the b-dimension dominate, and what problem does this cause for gradient descent?" },
    ],
    reflection: {
      prompt: "If the gradient tells you the direction of steepest ascent, why do we follow the negative gradient? Are there situations where following the gradient exactly is not the best strategy?",
      followUp: ["What does it mean when a gradient is exactly zero — have you necessarily found the best solution?", "How does the scale of different parameters affect gradient-based learning?"],
    },
  },

  "math-2-2": {
    id: "math-2-2",
    title: "Multivariable Calculus and Chain Rule",
    reading: \`
## Functions of Many Variables

Most ML functions take many inputs: a model with a million parameters has a loss function L(w1, w2, ..., w1000000). Multivariable calculus studies how such functions behave.

The **partial derivative** df/dxi measures change along one axis, holding others fixed. The **gradient** assembles all partial derivatives into a vector. The **Jacobian** generalizes the gradient to vector-valued functions: if f maps R^n to R^m, its Jacobian is the m x n matrix of all partial derivatives J[i,j] = df_i/dx_j. It describes how every output wiggles in response to every input.

The **Hessian** is the matrix of second derivatives H[i,j] = d^2f/dx_i dx_j. It describes curvature — whether the loss surface is bowl-shaped (positive definite Hessian, a minimum), upside-down bowl (negative definite, a maximum), or saddle-shaped (mixed eigenvalues).

## The Chain Rule — The Engine of Deep Learning

Deep learning models are compositions: input -> layer1 -> activation -> layer2 -> loss. The chain rule tells you how to differentiate through any composition.

In single-variable form: if y = f(g(x)), then dy/dx = f'(g(x)) * g'(x). In multivariable form with Jacobians, if y = f(g(x)), then J_yx = J_yg * J_gx — you multiply the Jacobians.

During **backpropagation**, the network computes the forward pass, caching intermediate values. Then it walks backward: starting from dLoss/dOutput, it multiplies by each local Jacobian to get dLoss/dWeights for every layer. This backward chain of Jacobian-vector products is why we can train networks with billions of parameters.

## Computational Graphs

You can visualize any computation as a directed graph where nodes are operations and edges carry values. The chain rule corresponds to traversing this graph backward, accumulating gradients. For example, computing L = (W2 * relu(W1 * x + b1) + b2 - y)^2 creates a graph with nodes for matmul, add, relu, and square. Backprop visits them in reverse, applying the local derivative at each node.

This graph view reveals why some operations are tricky: relu has derivative 0 for negative inputs (killing gradients), and repeated multiplication by small Jacobians causes gradients to shrink exponentially with depth — the vanishing gradient problem.

## Practical Implications

Understanding multivariable calculus helps you reason about optimization geometry. A narrow valley in the loss landscape has a Hessian with one large and one small eigenvalue — gradients point steeply across the valley but barely along it, causing oscillations. Techniques like momentum and adaptive learning rates (Adam) are designed precisely to handle this uneven curvature.

When you read that batch normalization smooths the loss landscape, it means it makes the Hessian better conditioned — more bowl-like, easier for gradient descent to navigate.
    \`,
    keyConcepts: [
      { term: "Jacobian", definition: "The matrix of all partial derivatives of a vector-valued function; describes how each output changes with respect to each input." },
      { term: "Hessian", definition: "The matrix of second-order partial derivatives; describes the local curvature of a loss surface and determines the nature of critical points." },
      { term: "Chain Rule (Multivariable)", definition: "The rule that the derivative of a composition is the product of Jacobians; the mathematical foundation of backpropagation." },
      { term: "Computational Graph", definition: "A directed graph representing a computation as nodes (operations) and edges (data flow); traversed backward to compute gradients via the chain rule." },
    ],
    examples: [
      {
        title: "Chain Rule Through Two Layers",
        code: "import numpy as np\\n# Forward: h = relu(W1 @ x), y_pred = W2 @ h\\nx = np.array([1.0, 2.0])\\nW1 = np.array([[0.5, -0.3],[0.2, 0.8]])\\nW2 = np.array([1.0, -0.5])\\nh = np.maximum(0, W1 @ x)  # relu\\ny_pred = W2 @ h\\ndL_dy = 2*(y_pred - 1.0)  # if loss = (y_pred - y_true)^2\\ndL_dh = dL_dy * W2\\ndL_dh[h == 0] = 0  # relu derivative is 0 where h==0\\n# dL_dW1 = dL_dh outer x (chain rule continues)",
        explanation: "Gradients flow backward: from loss to y_pred to hidden activations h, masking by ReLU derivative, then to W1. Each step is a local Jacobian-vector product — the chain rule in action.",
      },
    ],
    exercises: [
      { id: "math-2-2-ex-1", title: "Jacobian Shape", type: "reflection", instructions: "A layer maps a 10-dimensional input to a 20-dimensional output via y = Wx + b where W is 20x10. What is the shape of the Jacobian dy/dx? What is the shape of dy/dW? Why does the Jacobian with respect to weights have more entries than the one with respect to inputs?" },
      { id: "math-2-2-ex-2", title: "Second-Order Insight", type: "reflection", instructions: "The Hessian of f(x,y)= x^2 + 8xy + y^2 at the origin has eigenvalues 9 and -7. Is the origin a minimum, maximum, or saddle point? Sketch the landscape intuition and explain why gradient descent might stall near a saddle point despite a non-zero gradient existing nearby." },
    ],
    reflection: {
      prompt: "Backpropagation is just the chain rule applied efficiently on a computational graph. Why was this simple idea so transformative for training deep networks?",
      followUp: ["How does the computational graph determine the memory cost of backpropagation?", "Why does depth make the chain rule product particularly sensitive to vanishing or exploding gradients?"],
    },
  },

  "math-2-3": {
    id: "math-2-3",
    title: "Optimization and Gradient Descent",
    reading: \`
## Learning as Optimization

Training a model means finding parameters that minimize the loss function. This is an optimization problem: given L(theta), find theta that makes L as small as possible.

For a simple convex function like a bowl, there is one global minimum and any downhill walk reaches it. But neural network loss surfaces are highly non-convex — full of hills, valleys, saddle points, and flat plateaus. Finding the global minimum is intractable. Fortunately, we do not need the global minimum; a good local minimum often generalizes well.

## Gradient Descent

The core algorithm is gradient descent: start with random parameters, then iterate: theta = theta - learning_rate * grad(L). Each step moves opposite to the gradient, downhill.

**Stochastic Gradient Descent (SGD)** uses a single random example (or small minibatch) to estimate the gradient. The estimate is noisy but much cheaper to compute. The noise can even help escape shallow local minima and saddle points. **Minibatch SGD** balances efficiency (vectorized computation) with noise (regularization effect). Batch sizes of 32-256 are common.

**Learning rate** is the most important hyperparameter. Too large, and you overshoot the valley and diverge. Too small, and training crawls. Learning rate schedules — decaying the rate over time, warmup periods, cosine annealing — are essential for large models.

## Beyond Vanilla Gradient Descent

Several extensions improve convergence:

- **Momentum:** Keeps a velocity vector that accumulates past gradients: velocity = momentum * velocity + grad; theta -= lr * velocity. This dampens oscillations in narrow valleys and accelerates along consistent directions. Think of a ball rolling downhill gaining inertia.

- **Adam (Adaptive Moment Estimation):** Tracks both the moving average of gradients (first moment) and squared gradients (second moment) per parameter. Each parameter gets its own adaptive learning rate. Adam converges faster and is more forgiving of learning rate choice, making it the default for most deep learning.

- **Second-order methods:** Newton's method uses the Hessian to account for curvature, converging in fewer steps but requiring expensive Hessian computation. Approximations like L-BFGS are used for smaller problems.

## Regularization and Generalization

Minimizing training loss alone leads to overfitting. Optimization must balance fitting the data with keeping the model simple. Techniques like weight decay add a penalty lambda*||theta||^2 to the loss, pulling parameters toward zero. Early stopping halts optimization when validation loss stops improving. Dropout randomly zeroes activations during training, preventing reliance on any single feature.

The goal is not the lowest possible training loss but the best performance on unseen data. Optimization and regularization are two sides of the same coin.
    \`,
    keyConcepts: [
      { term: "Gradient Descent", definition: "Iterative optimization that steps parameters opposite to the loss gradient; the fundamental algorithm for training neural networks." },
      { term: "Learning Rate", definition: "The step-size multiplier controlling how far parameters move per gradient step; critical for convergence speed and stability." },
      { term: "Stochastic Gradient Descent (SGD)", definition: "Gradient descent using noisy estimates from random minibatches; cheaper per step and provides implicit regularization through noise." },
      { term: "Adam", definition: "An adaptive optimizer that maintains per-parameter learning rates using moving averages of gradients and squared gradients; the most widely used optimizer in deep learning." },
    ],
    examples: [
      {
        title: "Gradient Descent in Python",
        code: "import numpy as np\\n# Minimize f(w) = (w-3)^2, minimum at w=3\\nw = 0.0\\nlr = 0.1\\nfor i in range(20):\\n    grad = 2*(w - 3)  # derivative\\n    w = w - lr * grad\\n    # w moves: 0 -> 0.6 -> 1.08 -> 1.46 ... converging to 3",
        explanation: "Even this trivial 1D example shows the dynamics: large gradients far from the minimum cause big steps, small gradients near the minimum cause fine adjustments. The learning rate determines the speed of this convergence.",
      },
    ],
    exercises: [
      { id: "math-2-3-ex-1", title: "Learning Rate Effects", type: "reflection", instructions: "You train a model with learning rate 0.1 and loss decreases smoothly. With lr=1.0, loss oscillates wildly. With lr=0.001, loss barely moves after 1000 steps. Explain each behavior in terms of step size relative to loss landscape curvature. How would a learning rate schedule help?" },
      { id: "math-2-3-ex-2", title: "SGD vs Full Batch", type: "code", instructions: "Write pseudocode for both full-batch gradient descent and minibatch SGD (batch size 32). For a dataset of 1M examples, compare computation per step, gradient accuracy, and why minibatch noise can act as a regularizer. When would you prefer full-batch?" },
    ],
    reflection: {
      prompt: "Optimization finds parameters that minimize training loss, but our real goal is generalization to new data. How do these two objectives conflict, and what does that tell you about when to stop training?",
      followUp: ["Why might a noisy gradient estimate generalize better than the exact gradient?", "How does the geometry of the loss landscape (sharp vs flat minima) relate to generalization?"],
    },
  },

  "math-3-1": {
    id: "math-3-1",
    title: "Probability Foundations",
    reading: \`
## Uncertainty Is the Core Problem

AI deals with uncertainty everywhere: noisy sensor readings, ambiguous language, incomplete information. Probability is the mathematics of uncertainty. It lets us reason rigorously about what we do not know for certain.

A **random variable** is a variable whose value is uncertain — like the word that comes next in a sentence, or whether an image contains a cat. A **probability distribution** assigns probabilities to each possible value. For a fair coin, P(heads)=0.5, P(tails)=0.5. For a language model, the distribution over the next token might be P(the)=0.3, P(a)=0.2, and so on.

## Key Rules

**Joint probability** P(A, B) is the probability that both A and B happen. **Conditional probability** P(A|B) is the probability of A given that B happened. They are related by P(A, B) = P(A|B)*P(B). **Marginal probability** P(A) sums over all possibilities of B: P(A) = sum_B P(A, B).

**Bayes' Theorem** inverts conditional probabilities: P(A|B) = P(B|A)*P(A) / P(B). This is the foundation of learning from evidence. If A is a disease and B is a test result, Bayes tells you how to update your belief about the disease after seeing the test. In ML, A might be model parameters and B the data — Bayes tells you how to update your beliefs about good parameters after observing data.

**Independence** means P(A, B) = P(A)*P(B) — knowing B tells you nothing about A. **Conditional independence** means P(A,B|C) = P(A|C)*P(B|C) — once you know C, A and B carry no extra information about each other. Naive Bayes classifiers assume features are conditionally independent given the class, which is often wrong but surprisingly effective.

## Expectation and Variance

The **expected value** E[X] is the probability-weighted average: sum_x x*P(x). It is what you expect on average. The **variance** Var(X) = E[(X - E[X])^2] measures spread — how far values typically deviate from the mean. **Covariance** measures how two variables move together: positive covariance means they increase together, negative means one increases when the other decreases.

These concepts appear everywhere: the loss function is an expected value over the data distribution, regularization can be viewed as imposing low variance on parameters, and the bias-variance tradeoff decomposes prediction error into systematic error (bias) and sensitivity to training data (variance).

## Distributions in AI

Common distributions each suit different data types: **Bernoulli** for binary outcomes (click/no-click), **Categorical** for discrete choices (next word among vocabulary), **Gaussian** for continuous values (height, temperature), **Beta** for probabilities themselves. Choosing the right output distribution determines the loss function: Gaussian outputs lead to mean squared error, categorical outputs to cross-entropy.
    \`,
    keyConcepts: [
      { term: "Bayes' Theorem", definition: "Formula for updating beliefs: P(A|B) = P(B|A)P(A)/P(B); connects prior beliefs, likelihood of evidence, and posterior beliefs after observation." },
      { term: "Conditional Probability", definition: "The probability of an event given that another event has occurred; P(A|B) quantifies how evidence B changes the likelihood of A." },
      { term: "Expected Value", definition: "The probability-weighted average of a random variable; represents the long-run average outcome and the basis for defining loss as expected error." },
      { term: "Independence", definition: "When the occurrence of one event does not affect the probability of another; P(A,B) = P(A)P(B), a key assumption in many simple models." },
    ],
    examples: [
      {
        title: "Bayes in Spam Filtering",
        code: "P_spam = 0.3  # 30% of emails are spam\\nP_free_given_spam = 0.4  # 40% of spam contains 'free'\\nP_free_given_ham = 0.05  # 5% of ham contains 'free'\\nP_free = P_free_given_spam*P_spam + P_free_given_ham*(1-P_spam)\\nP_spam_given_free = P_free_given_spam*P_spam / P_free\\n# = 0.4*0.3 / 0.155 = 0.774 -> 77% chance spam if contains 'free'",
        explanation: "Bayes' theorem combines the base rate of spam with the likelihood of seeing the word 'free' to produce a posterior belief. Even though 'free' appears in ham, its higher rate in spam makes it strong evidence.",
      },
    ],
    exercises: [
      { id: "math-3-1-ex-1", title: "Bayes with Medical Testing", type: "reflection", instructions: "A disease affects 1% of people. A test is 95% accurate (true positive 95%, false positive 5%). If a random person tests positive, what is P(disease|positive)? Many find the result surprisingly low — explain why base rates matter. How does this relate to precision vs recall in ML classification?" },
      { id: "math-3-1-ex-2", title: "Expectation of Loss", type: "reflection", instructions: "A model makes a 0/1 error. On 70% of inputs it is correct (loss 0), on 30% wrong (loss 1). What is the expected loss? If you weight wrong predictions on class A twice as heavily, how does the expectation change? Why does expected loss matter more than loss on any single example?" },
    ],
    reflection: {
      prompt: "Probability lets us quantify uncertainty, but where do the probabilities themselves come from? Are they objective frequencies or subjective degrees of belief — and does the distinction matter for building AI?",
      followUp: ["When is it reasonable to assume independence between features, and what happens when the assumption fails?", "How does thinking in terms of distributions rather than single predictions change how you evaluate a model?"],
    },
  },

  "math-3-2": {
    id: "math-3-2",
    title: "Statistical Inference and Distributions",
    reading: \`
## From Data to Knowledge

Statistics is the science of learning from data. You observe a sample (training data) and want to infer properties of the population (the true data distribution). This is exactly what ML does: infer a model from finite training examples that generalizes to the population.

## Estimating Distributions

Given data points x1, x2, ..., xn, how do you estimate the distribution they came from?

**Maximum Likelihood Estimation (MLE)** chooses parameters that make the observed data most probable. For a Gaussian, the MLE for the mean is the sample average, and for the variance is the sample variance. For a categorical distribution (like next-token prediction), MLE sets each probability to the observed frequency. Training a language model with cross-entropy loss is exactly MLE: you maximize the probability the model assigns to the actual next tokens.

**Maximum A Posteriori (MAP)** adds a prior belief P(theta) about parameters before seeing data. MAP chooses theta maximizing P(data|theta)*P(theta). The prior acts as regularization. An L2 penalty corresponds to a Gaussian prior that says weights should be small. MLE is MAP with a uniform prior — no preference.

## The Central Limit Theorem and Confidence

The **Central Limit Theorem** says the average of many independent random variables is approximately Gaussian, regardless of the original distribution. This is why Gaussian assumptions appear everywhere and why averaging reduces variance. It also justifies confidence intervals: with n samples, the sample mean has standard deviation sigma/sqrt(n), so collecting 4x more data halves your uncertainty.

**Hypothesis testing** asks: is an observed effect real or due to chance? You compute a p-value — the probability of seeing data this extreme if the null hypothesis were true. In ML, you might test whether model A is truly better than model B or whether the difference is noise from the finite test set.

## Key Distributions for ML

- **Gaussian (Normal):** Bell-shaped, parameterized by mean and variance. Models continuous data and appears as the limiting distribution of averages. Used in regression with MSE loss.
- **Bernoulli/Categorical:** Models discrete outcomes. Bernoulli for binary (spam/not spam), Categorical for K choices (vocabulary of 50K tokens). Cross-entropy is the MLE loss for these.
- **Beta/Dirichlet:** Distributions over probabilities themselves. Beta is the prior for a Bernoulli probability (useful in A/B testing), Dirichlet for categorical.
- **Exponential/Poisson:** Models waiting times and count data, useful for event-based features.

Understanding which distribution matches your data type determines the right loss function, the right evaluation metric, and whether your model's assumptions are valid. Using MSE on categorical data or cross-entropy on continuous data is a mismatch that leads to poor training.

## Bias, Variance, and Sampling

An **estimator** is a rule for guessing a population quantity from a sample. Its **bias** is systematic error (does it over/underestimate on average?), its **variance** is sensitivity to the specific sample. A good estimator balances both. More data reduces variance but not bias — if your model class cannot represent the truth, no amount of data fixes it.
    \`,
    keyConcepts: [
      { term: "Maximum Likelihood Estimation (MLE)", definition: "The principle of choosing parameters that maximize the probability of the observed data; equivalent to minimizing cross-entropy or MSE depending on the assumed distribution." },
      { term: "Central Limit Theorem", definition: "The result that averages of many independent variables converge to a Gaussian distribution; justifies confidence intervals and explains the ubiquity of normal distributions." },
      { term: "Prior and Posterior", definition: "The prior P(theta) encodes beliefs before data; the posterior P(theta|data) combines prior and likelihood to represent beliefs after observing data." },
      { term: "Bias-Variance Tradeoff", definition: "The decomposition of prediction error into systematic deviation from truth (bias) and sensitivity to training sample (variance); central to model selection." },
    ],
    examples: [
      {
        title: "MLE for a Biased Coin",
        code: "import numpy as np\\nflips = [1,0,1,1,0,1,1,1,0,1]  # 1=heads\\np_mle = np.mean(flips)  # 0.7\\n# Likelihood: p^7 * (1-p)^3, maximized at p=0.7\\n# With Beta(2,2) prior (MAP): p_map = (7+1)/(10+2) = 0.667 (pulled toward 0.5)",
        explanation: "MLE sets the coin bias to the observed frequency 0.7. MAP with a Beta prior that favors 0.5 pulls the estimate toward the center, especially when data is scarce — a form of regularization that prevents overconfidence from few samples.",
      },
    ],
    exercises: [
      { id: "math-3-2-ex-1", title: "MLE vs MAP", type: "reflection", instructions: "You have 3 coin flips: H, H, H. MLE says p=1.0 (always heads). MAP with Beta(2,2) prior gives p=0.8. Which is more reasonable? How does the choice of prior strength (e.g., Beta(10,10) vs Beta(2,2)) affect the estimate, and when would you want a stronger vs weaker prior?" },
      { id: "math-3-2-ex-2", title: "Distribution Choice", type: "reflection", instructions: "You are modeling: (a) time between user clicks, (b) number of support tickets per day, (c) which product category a user picks among 10 options. For each, which distribution is most appropriate and what loss function does MLE imply?" },
    ],
    reflection: {
      prompt: "Statistical inference assumes data comes from some true distribution. In practice, training data is biased, incomplete, and non-stationary. How should this affect how you interpret model predictions and confidence scores?",
      followUp: ["Why does more data reduce variance but not necessarily bias?", "How does the choice of prior in MAP relate to regularization techniques you have seen?"],
    },
  },

  "math-3-3": {
    id: "math-3-3",
    title: "Information Theory and Entropy",
    reading: \`
## Measuring Information

How much information is in a message? Information theory gives a precise answer. The **information content** (or surprisal) of an event with probability p is -log(p). Rare events carry more information: learning that a fair coin landed heads (-log 0.5 = 1 bit) is less informative than learning a stock jumped 20% (-log 0.01 = 6.6 bits).

**Entropy** is the expected information content: H(X) = -sum_x P(x) log P(x). It measures uncertainty. A fair coin has entropy 1 bit (maximum uncertainty for binary). A coin that always lands heads has entropy 0 (no uncertainty). A language model that is very confident about the next word has low entropy; one that is unsure has high entropy.

## Cross-Entropy and KL Divergence

**Cross-entropy** H(P, Q) = -sum_x P(x) log Q(x) measures how many bits you need if you encode events from true distribution P using a code optimized for Q. In ML, P is the true data distribution (one-hot labels) and Q is the model's predicted distribution. Minimizing cross-entropy makes Q match P — it is the standard loss for classification.

**KL Divergence** D_KL(P || Q) = sum_x P(x) log(P(x)/Q(x)) measures how different Q is from P. It is the extra bits wasted by using Q instead of P. Cross-entropy and KL divergence are related: H(P, Q) = H(P) + D_KL(P || Q). Since H(P) is fixed (it depends only on true labels), minimizing cross-entropy is equivalent to minimizing KL divergence — making the model distribution close to the true distribution.

An important property: KL divergence is not symmetric. D_KL(P||Q) is not equal to D_KL(Q||P). This matters in variational methods and generative modeling where the direction you choose changes the behavior (mode-seeking vs mode-covering).

## Mutual Information

**Mutual information** I(X; Y) measures how much knowing X tells you about Y: I(X; Y) = H(X) - H(X|Y) = H(Y) - H(Y|X). If X and Y are independent, mutual information is zero. If Y is a deterministic function of X, mutual information equals H(Y) — knowing X fully determines Y.

In feature selection, you want features with high mutual information with the target — they reduce uncertainty about what you are predicting. In representation learning, you want embeddings that preserve high mutual information with the task-relevant signal while discarding noise.

## Entropy in Practice

Entropy appears throughout AI:

- **Decision trees** split on the feature that maximizes information gain (reduces entropy of the label distribution the most).
- **Language model evaluation** uses perplexity = 2^{cross-entropy}, measuring how surprised the model is by the test text. Lower perplexity means better prediction.
- **Regularization:** Entropy regularization encourages the model to be more or less confident. Label smoothing increases entropy of targets to prevent overconfidence.
- **Compression:** Entropy is the theoretical limit of lossless compression. A model that predicts well can compress well — this connection between prediction and compression runs deep in AI.

Understanding entropy as expected surprisal and cross-entropy as the cost of being wrong gives you a unified lens for loss functions, evaluation, and model design.
    \`,
    keyConcepts: [
      { term: "Entropy", definition: "The expected information content of a random variable; H(X) = -sum P(x) log P(x), measuring average uncertainty or unpredictability." },
      { term: "Cross-Entropy", definition: "The loss that measures bits needed to encode true distribution P using model Q; H(P,Q) = -sum P(x) log Q(x), the standard classification loss." },
      { term: "KL Divergence", definition: "A measure of how one probability distribution differs from another; D_KL(P||Q) = sum P(x) log(P(x)/Q(x)), the extra cost of using Q instead of P." },
      { term: "Mutual Information", definition: "The reduction in uncertainty about one variable given knowledge of another; I(X;Y) = H(X) - H(X|Y), used for feature selection and representation analysis." },
    ],
    examples: [
      {
        title: "Entropy of a Language Model's Prediction",
        code: "import numpy as np\\nprobs = np.array([0.5, 0.3, 0.15, 0.05])  # model predictions over 4 words\\nentropy = -np.sum(probs * np.log2(probs))  # ~1.65 bits\\ncross_ent = -np.log2(probs[0])  # if true word is index 0: -log2(0.5)=1.0 bit\\n# Low cross-entropy (1.0) < entropy (1.65) -> model is less surprised than average uncertainty suggests",
        explanation: "Entropy 1.65 bits reflects overall uncertainty across 4 words. Cross-entropy of 1.0 bit for the true word shows the loss for this example. Averaging cross-entropy over many examples and exponentiating gives perplexity, the standard LM metric.",
      },
    ],
    exercises: [
      { id: "math-3-3-ex-1", title: "Entropy Calculations", type: "reflection", instructions: "Compute entropy for: (a) a fair 4-sided die, (b) a distribution [0.9, 0.05, 0.05], (c) a deterministic variable. Which has highest entropy? Relate each to how confident vs uncertain a classifier is, and what that implies for decision-making." },
      { id: "math-3-3-ex-2", title: "Cross-Entropy as Loss", type: "reflection", instructions: "A classifier predicts [0.7, 0.2, 0.1] but the true label is class 2 (one-hot [0,1,0]). Compute the cross-entropy loss. What would the loss be if the prediction were [0.1, 0.9, 0.0]? Why does cross-entropy penalize confident wrong predictions more harshly than MSE?" },
    ],
    reflection: {
      prompt: "Cross-entropy loss and KL divergence both measure the gap between what the model believes and what is true. Why is it natural that the same math describes both compression and learning?",
      followUp: ["How does label smoothing (softening one-hot targets) change cross-entropy and what behavior does it encourage?", "When would you want a model with high entropy predictions versus low entropy?"],
    },
  },

  // ═══════════════════════════════════════════════════════════════════
  // MACHINE LEARNING
  // ═══════════════════════════════════════════════════════════════════

  "ml-1-1": {
    id: "ml-1-1",
    title: "Supervised Learning Fundamentals",
    reading: \`
## Learning from Labeled Examples

Supervised learning is the most common form of machine learning. You have a dataset of input-output pairs (x, y) — for example, an email (x) labeled as spam or not spam (y). The goal is to learn a function f that maps new inputs to correct outputs.

The process has three components: **data**, **model**, and **loss**. Data provides the examples. The model (e.g., a neural network, decision tree, or linear function) is a parameterized family of functions f_theta. The loss measures how far the prediction f_theta(x) is from the true label y. Training adjusts theta to minimize the average loss over the dataset.

## The Training Loop

Training follows a consistent loop:

1. **Forward pass:** For a batch of examples, compute predictions f_theta(x).
2. **Compute loss:** Average the loss across the batch. For regression, mean squared error; for classification, cross-entropy.
3. **Backward pass:** Compute gradients of the loss with respect to every parameter (backpropagation).
4. **Update:** Step parameters opposite to the gradient: theta = theta - lr * grad.

This loop repeats for many epochs (passes over the full dataset). The loss generally decreases, though not monotonically with stochastic gradients. Crucially, you monitor loss on a held-out validation set — when validation loss stops improving, you stop training to avoid overfitting.

## Generalization — The Real Goal

A model that memorizes training data is useless. What matters is **generalization**: performance on new, unseen data drawn from the same distribution. The gap between training error and test error measures generalization. A large gap means overfitting — the model learned idiosyncrasies of the training set rather than true patterns.

The **bias-variance tradeoff** frames this tension. A model with high bias is too simple (underfitting) — it cannot capture the true function. A model with high variance is too sensitive to the training sample (overfitting). Modern deep learning complicates this picture: very large models with millions of parameters can generalize well despite classical expectations, partly due to implicit regularization from SGD and architecture design.

## Hypothesis Space and Inductive Bias

No model can learn without assumptions. The **hypothesis space** is the set of functions the model can represent (e.g., all linear functions, all depth-3 neural networks). **Inductive bias** is the set of assumptions that guide the model toward certain solutions within that space. A convolutional network assumes nearby pixels are related (locality), a recurrent network assumes sequence order matters. Choosing the right architecture means choosing the right inductive bias for your problem.

Dataset size also matters enormously. A flexible model with little data will overfit; a simple model with abundant data may underfit. The art of supervised learning is matching model capacity, inductive bias, and data to achieve generalization.
    \`,
    keyConcepts: [
      { term: "Supervised Learning", definition: "Learning a mapping from inputs to outputs using labeled input-output pairs; the model is trained to minimize prediction error on known examples." },
      { term: "Loss Function", definition: "A measure of prediction error that the training process minimizes; chosen to match the task, e.g., cross-entropy for classification, MSE for regression." },
      { term: "Generalization", definition: "The ability of a model to perform well on new, unseen data; the central measure of whether learning has succeeded beyond memorization." },
      { term: "Inductive Bias", definition: "The set of assumptions a model makes about the target function; determines which solutions the model prefers among those that fit the training data." },
    ],
    examples: [
      {
        title: "Linear Regression as Supervised Learning",
        code: "from sklearn.linear_model import LinearRegression\\nX = [[1], [2], [3], [4], [5]]  # features (e.g., area)\\ny = [2.1, 3.9, 6.2, 8.0, 9.8]  # labels (e.g., price)\\nmodel = LinearRegression().fit(X, y)\\nprint(model.coef_, model.intercept_)  # slope ~2.0, intercept ~0.1\\npred = model.predict([[6]])  # predict for new input",
        explanation: "The simplest supervised learner fits a line through labeled points. The model class is y = w*x + b, the loss is MSE, and training finds w and b that minimize it. Despite simplicity, this pattern — model + loss + optimization — generalizes to all supervised learning.",
      },
    ],
    exercises: [
      { id: "ml-1-1-ex-1", title: "Design a Supervised Task", type: "reflection", instructions: "Pick a real-world task (e.g., predicting house prices, detecting spam, recommending movies). Define what x (input features) and y (label) would be, what type of model might suit it, and what loss function you would use. Explain your choices." },
      { id: "ml-1-1-ex-2", title: "Training vs Test Error", type: "reflection", instructions: "Model A has 2% training error and 15% test error. Model B has 8% training error and 10% test error. Which model would you deploy and why? What does Model A's gap suggest about bias vs variance?" },
    ],
    reflection: {
      prompt: "Supervised learning requires labeled data, which is often expensive to obtain. How does the need for labels shape which problems are easy versus hard to solve with AI?",
      followUp: ["What are the hidden costs of collecting labels at scale (bias, consistency, privacy)?", "How might you approach a problem where labeled data is scarce?"],
    },
  },

  "ml-1-2": {
    id: "ml-1-2",
    title: "Classification and Regression",
    reading: \`
## Two Types of Prediction

Supervised learning splits into two fundamental tasks based on what you are predicting.

**Regression** predicts a continuous number: house price, temperature, response time. The output is a scalar (or vector) on a continuous scale. You care about how close the prediction is: predicting 100 when the answer is 105 is better than predicting 200.

**Classification** predicts a discrete category: spam or not spam, cat vs dog vs bird, positive/negative/neutral sentiment. The output is a class label. You care about whether the prediction is correct. For binary classification there are two classes; for multiclass there are many; for multilabel an example can belong to multiple classes simultaneously.

## Regression in Detail

Linear regression models y as a weighted sum of features: y = w^T x + b. Nonlinear regression might use a neural network that can capture curved relationships. The standard loss is **Mean Squared Error (MSE)**: average of (y_pred - y_true)^2. MSE penalizes large errors quadratically — an error of 4 costs 16x more than an error of 1, so outliers have outsized influence. Alternatives like **Mean Absolute Error (MAE)** penalize linearly and are more robust to outliers, while **Huber loss** combines both.

Evaluation uses MSE, MAE, and R-squared (fraction of variance explained). Always look at residual plots (prediction vs error) to check whether errors are systematic.

## Classification in Detail

Classification models output probabilities over classes. A neural classifier ends with a **softmax** layer that converts raw scores (logits) into probabilities summing to 1. For binary classification, a single sigmoid output gives P(class=1).

The loss is **cross-entropy** (also called log loss): -sum y_true * log(y_pred). If the true class is cat (one-hot [1,0,0]) and the model predicts [0.7, 0.2, 0.1], loss is -log(0.7) = 0.35. If it confidently predicts the wrong class ([0.1, 0.8, 0.1]), loss is -log(0.1) = 2.3 — much larger. Cross-entropy strongly penalizes confident wrong answers, pushing the model toward calibrated probabilities.

At inference, you typically pick the class with highest probability (argmax). But the threshold matters: for imbalanced problems like fraud detection (0.1% fraud), predicting the majority class always gives 99.9% accuracy but catches zero fraud. You must choose thresholds based on the costs of false positives versus false negatives.

## Choosing Between Them

Sometimes the framing is a choice. Predicting a star rating (1-5) could be regression (predict a number) or classification (predict a category). Regression respects ordering (3 is between 2 and 4) but classification can capture that the gap between 1 and 2 stars is not the same as between 4 and 5. Consider whether your output is truly continuous, whether ordering matters, and whether you need probabilities or point estimates.

For ordinal tasks, specialized losses exist that combine both perspectives. The key is to match the task structure to the right formulation, loss, and evaluation metric as a coherent whole.
    \`,
    keyConcepts: [
      { term: "Regression", definition: "Predicting a continuous numeric value; evaluated by distance between prediction and truth using losses like MSE or MAE." },
      { term: "Classification", definition: "Predicting a discrete category from a fixed set; outputs probabilities over classes and is evaluated by accuracy, precision, recall, and related metrics." },
      { term: "Softmax", definition: "A function that converts raw model scores into a probability distribution summing to 1; used as the final layer in multiclass classifiers." },
      { term: "Decision Boundary", definition: "The surface in feature space where the classifier switches from one predicted class to another; its shape reveals model complexity." },
    ],
    examples: [
      {
        title: "Regression vs Classification Framing",
        code: "from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor\\n# Regression: predict exact review score 1.0-5.0\\nreg = RandomForestRegressor().fit(X_train, y_continuous)\\n# Classification: predict star category 1-5\\nclf = RandomForestClassifier().fit(X_train, y_category)\\n# Same features, different task formulation and loss",
        explanation: "The same product review data can be framed either way. Regression predicts a precise score and is penalized by distance; classification predicts a category and is penalized by cross-entropy. The choice affects loss, metrics, and what the model learns about ordering versus distinct categories.",
      },
    ],
    exercises: [
      { id: "ml-1-2-ex-1", title: "Frame the Task", type: "reflection", instructions: "For each scenario, decide whether it is regression or classification and justify: (a) predicting tomorrow's stock price, (b) detecting whether an email is phishing, (c) predicting the number of likes a post will get, (d) tagging an article with zero or more topics. For (c), argue both framings." },
      { id: "ml-1-2-ex-2", title: "Imbalanced Classification", type: "reflection", instructions: "A fraud dataset has 99.5% legitimate and 0.5% fraud transactions. A model that always predicts 'legitimate' gets 99.5% accuracy. Explain why accuracy is misleading here. Propose better metrics and a strategy (threshold tuning, class weighting, or resampling) to handle the imbalance." },
    ],
    reflection: {
      prompt: "Many real-world outcomes are not cleanly regression or classification — for example, predicting how long a customer will stay (churn time) or grading essay quality. How would you decide which framework to use?",
      followUp: ["When does treating an ordinal rating as regression lose important information?", "How does the choice of loss function encode your assumptions about what errors matter most?"],
    },
  },

  "ml-1-3": {
    id: "ml-1-3",
    title: "Model Evaluation and Cross-Validation",
    reading: \`
## You Cannot Improve What You Do Not Measure

Building a model is only half the work. Evaluating it correctly determines whether you can trust it. Poor evaluation leads to false confidence, missed biases, and models that fail in deployment.

## Train, Validation, and Test Splits

Never evaluate on training data. The standard split is:

- **Training set (60-70%):** Used to fit model parameters.
- **Validation set (15-20%):** Used to tune hyperparameters, select models, and make decisions during development. You may look at it many times.
- **Test set (15-20%):** Used exactly once at the end to estimate real-world performance. Treating the test set as another validation set leaks information and inflates results.

For small datasets, a single split is noisy. **Cross-validation** provides a more robust estimate.

## Cross-Validation

In **k-fold cross-validation**, you split the data into k equal folds. For each of k rounds, train on k-1 folds and evaluate on the remaining fold. Average the k scores. With k=5, every example is used for validation exactly once, and for training k-1 times. This reduces variance from any single lucky or unlucky split.

**Stratified** k-fold preserves class proportions in each fold — essential for imbalanced datasets where a random fold might contain zero minority examples. **Time-series splits** respect temporal order: training on the past, validating on the future, never the reverse.

Cross-validation is used for model selection: try several models or hyperparameters, pick the one with the best average CV score, then do a final evaluation on the held-out test set.

## Metrics — Choosing the Right Ruler

Different metrics reveal different strengths and weaknesses:

- **Accuracy:** Fraction correct. Simple but misleading when classes are imbalanced.
- **Precision:** Of predicted positives, how many were truly positive? High precision means few false alarms.
- **Recall (Sensitivity):** Of actual positives, how many were caught? High recall means few missed cases.
- **F1 Score:** Harmonic mean of precision and recall, balancing both.
- **ROC-AUC:** Area under the curve trading off true positive vs false positive rate across thresholds. Useful for ranking quality.
- **Confusion Matrix:** The full table of true vs predicted classes, showing exactly where the model confuses categories.

For regression: MSE penalizes large errors heavily, MAE is robust to outliers, and R-squared measures variance explained relative to a mean baseline.

## Beyond Aggregate Metrics

A single number hides disparities. Slice metrics by subgroup (demographics, geography, input length) to surface biased performance. Analyze errors qualitatively: what do the worst mistakes have in common? Check calibration — does a predicted probability of 0.8 correspond to 80% accuracy on those examples? A well-calibrated model knows when it is uncertain, which is critical for human-AI collaboration.
    \`,
    keyConcepts: [
      { term: "Cross-Validation", definition: "An evaluation technique that partitions data into k folds, training on k-1 and validating on the remaining fold repeatedly to obtain a robust performance estimate." },
      { term: "Precision and Recall", definition: "Precision measures correctness of positive predictions (TP/(TP+FP)); recall measures coverage of actual positives (TP/(TP+FN)); the tradeoff is central to classification evaluation." },
      { term: "Test Set", definition: "A held-out portion of data used exactly once to estimate real-world generalization; must remain untouched during development to avoid leakage." },
      { term: "Confusion Matrix", definition: "A table showing counts of true vs predicted classes for each category; reveals which specific classes the model confuses." },
    ],
    examples: [
      {
        title: "Stratified 5-Fold Cross-Validation",
        code: "from sklearn.model_selection import StratifiedKFold, cross_val_score\\nfrom sklearn.linear_model import LogisticRegression\\nskf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)\\nscores = cross_val_score(LogisticRegression(), X, y, cv=skf, scoring='f1')\\nprint(f'F1: {scores.mean():.3f} +/- {scores.std():.3f}')\\n# Each fold preserves class balance, mean and std show robustness",
        explanation: "Stratified 5-fold CV evaluates logistic regression across 5 different train/validation splits. The mean F1 estimates performance; the standard deviation shows how sensitive the model is to the specific data split. A large std suggests the model or data is unstable.",
      },
    ],
    exercises: [
      { id: "ml-1-3-ex-1", title: "Design an Evaluation Plan", type: "reflection", instructions: "You have 10,000 customer records to build a churn predictor. Design a train/validation/test split and cross-validation strategy. Explain when you would use the validation set vs test set, and what would go wrong if you tuned hyperparameters on the test set." },
      { id: "ml-1-3-ex-2", title: "Metric Selection", type: "reflection", instructions: "A medical screening model has high accuracy (98%) but low recall (40%) for the disease. A spam filter has high recall (99%) but low precision (30%). Explain which metric failure is more dangerous in each case and how you would adjust the model or threshold to trade off precision vs recall." },
    ],
    reflection: {
      prompt: "If cross-validation gives a more reliable estimate than a single split, why not always use it? What are the costs, and when is a single split sufficient?",
      followUp: ["How can evaluation itself be biased if the test set does not represent deployment data?", "Why is it important to slice metrics by subgroup rather than only looking at aggregate performance?"],
    },
  },

  "ml-2-1": {
    id: "ml-2-1",
    title: "Unsupervised Learning and Clustering",
    reading: \`
## Learning Without Labels

Supervised learning needs labeled examples, but labels are expensive. Unsupervised learning finds structure in data without any labels. It answers: what patterns exist naturally in this data?

The most common unsupervised task is **clustering**: grouping similar examples together. Customers who buy similar products, genes with similar expression, documents about similar topics — clustering reveals these natural groupings. Other unsupervised tasks include density estimation (modeling the data distribution), anomaly detection (finding outliers), and association mining (items frequently bought together).

## K-Means Clustering

K-Means is the simplest and most widely used clustering algorithm:

1. Choose k (the number of clusters).
2. Initialize k centroids randomly.
3. Assign each point to its nearest centroid.
4. Move each centroid to the mean of its assigned points.
5. Repeat steps 3-4 until centroids stop moving.

K-Means minimizes within-cluster variance — it tries to make each cluster tight. It works well for spherical, equally-sized clusters but fails for elongated or differently sized ones. It requires you to specify k in advance, and results depend on initialization, so you run it multiple times and keep the best.

Choosing k is an art. The **elbow method** plots the objective (sum of squared distances to centroids) versus k and looks for a kink where adding more clusters yields diminishing returns. **Silhouette scores** measure how similar each point is to its own cluster versus the nearest other cluster — higher is better.

## Beyond K-Means

Different clustering algorithms capture different notions of a cluster:

- **Hierarchical clustering** builds a tree of clusters (a dendrogram) by repeatedly merging the closest pairs (agglomerative) or splitting. You can cut the tree at any height to get any number of clusters. Useful when you want multiple granularities.

- **DBSCAN** defines clusters as dense regions separated by sparse regions. It does not require k, can find arbitrarily shaped clusters, and automatically identifies outliers as noise points. Parameters are epsilon (neighborhood radius) and min_samples (minimum points to form a cluster).

- **Gaussian Mixture Models (GMM)** model each cluster as a Gaussian distribution. Points have soft assignments — a probability of belonging to each cluster rather than a hard label. GMM can capture overlapping, elliptical clusters and is trained via the EM algorithm.

## Evaluating Clustering

Without labels, evaluation is harder. **Internal metrics** like silhouette score and Davies-Bouldin index measure compactness and separation without ground truth. **External metrics** like Adjusted Rand Index compare against known labels when available. But the best evaluation is often qualitative: do the clusters make sense to a domain expert? Do customers in the same cluster actually behave similarly?

Clustering is also a preprocessing tool: cluster features can be added to supervised models, clusters can be used to sample diverse training data, and anomaly clusters can flag fraud.
    \`,
    keyConcepts: [
      { term: "Clustering", definition: "Grouping data points so that points within a group are more similar to each other than to points in other groups; the core unsupervised task for discovering natural structure." },
      { term: "K-Means", definition: "An iterative algorithm that partitions data into k clusters by alternating between assigning points to the nearest centroid and recomputing centroids as cluster means." },
      { term: "DBSCAN", definition: "A density-based clustering method that finds clusters as dense regions and marks sparse points as noise; does not require specifying the number of clusters." },
      { term: "Silhouette Score", definition: "A metric measuring how well each point fits its assigned cluster versus the nearest other cluster; ranges from -1 (wrong cluster) to +1 (well clustered)." },
    ],
    examples: [
      {
        title: "K-Means for Customer Segmentation",
        code: "from sklearn.cluster import KMeans\\nfrom sklearn.preprocessing import StandardScaler\\nX_scaled = StandardScaler().fit_transform(X)  # always scale for K-Means\\nkmeans = KMeans(n_clusters=4, n_init=10, random_state=42).fit(X_scaled)\\nlabels = kmeans.labels_\\ncentroids = kmeans.cluster_centers_\\n# Each centroid represents a prototypical customer profile",
        explanation: "Customers described by spending and frequency features are standardized (K-Means is distance-based, so scale matters) and clustered into 4 segments. Each centroid is an archetype — e.g., high spend/low frequency vs low spend/high frequency — that marketing can target differently.",
      },
    ],
    exercises: [
      { id: "ml-2-1-ex-1", title: "Choosing K and Algorithm", type: "reflection", instructions: "You have 2D data with two crescent-shaped (moon) clusters that intertwine. Would K-Means work well? What about DBSCAN or GMM? Explain how the shape and density assumptions of each algorithm match or mismatch this data. How would you choose k in practice?" },
      { id: "ml-2-1-ex-2", title: "Clustering as Feature Engineering", type: "reflection", instructions: "A dataset has 10,000 unlabeled images. Describe how you could use clustering to: (a) discover categories without labels, (b) create features for a downstream classifier, (c) detect anomalous images. What preprocessing and distance metric would you use for images?" },
    ],
    reflection: {
      prompt: "Clustering has no ground truth — there is no single correct grouping. How do you decide whether a clustering result is useful or meaningful when you cannot compute accuracy?",
      followUp: ["How does the choice of distance metric (Euclidean vs cosine vs Manhattan) change what 'similar' means?", "When might hierarchical clustering be more informative than flat clustering like K-Means?"],
    },
  },

  "ml-2-2": {
    id: "ml-2-2",
    title: "Dimensionality Reduction",
    reading: \`
## The Curse of Dimensionality

High-dimensional data is the norm in AI: images with thousands of pixels, text with tens of thousands of vocabulary entries, sensor arrays with hundreds of readings. But high dimensions bring problems: distances become less meaningful, data becomes sparse (you need exponentially more samples to fill the space), and computation grows expensive.

Dimensionality reduction compresses high-dimensional data into fewer dimensions while preserving the important structure. It helps with visualization (humans can see 2D/3D), noise reduction (dropping low-variance dimensions removes noise), compression, and speeding up downstream models.

## Principal Component Analysis (PCA)

PCA is the workhorse of dimensionality reduction. It finds orthogonal directions (principal components) ordered by how much variance they capture. The first component is the direction of greatest spread, the second is the next greatest orthogonal to the first, and so on.

Mathematically, PCA is the eigendecomposition of the covariance matrix (or SVD of the centered data matrix). You center the data (subtract the mean), compute the covariance, find its eigenvectors sorted by eigenvalue, and project onto the top k. The fraction of variance retained is sum(top k eigenvalues) / sum(all eigenvalues). Choosing k to retain 90-95% of variance is a common heuristic.

PCA is linear — it can only capture linear structure. It is sensitive to feature scaling (always standardize first) and is optimal for Gaussian data in the sense of minimizing reconstruction error.

## Beyond PCA

- **t-SNE (t-Distributed Stochastic Neighbor Embedding):** A nonlinear method designed for visualization in 2D/3D. It converts pairwise distances into probabilities and tries to preserve local neighborhoods — points close in high dimensions stay close in the embedding. t-SNE is excellent for seeing clusters but distances between clusters in the plot are not meaningful, and it is stochastic (different runs give different layouts). Use it for exploration, not for producing features for downstream models.

- **UMAP (Uniform Manifold Approximation and Projection):** Similar goals to t-SNE but faster, more scalable, and better at preserving global structure. It has become the preferred method for large-scale single-cell genomics and is increasingly used as a general visualization tool.

- **Autoencoders:** Neural networks that learn to compress and reconstruct. An encoder maps input to a low-dimensional bottleneck, a decoder reconstructs the input from the bottleneck. Unlike PCA, autoencoders can learn nonlinear manifolds and can be tailored with different architectures (convolutional for images). Variational autoencoders add a probabilistic interpretation useful for generation.

## Practical Workflow

The typical workflow: standardize features, apply PCA to reduce to a manageable dimension (e.g., 50), then optionally use t-SNE/UMAP for 2D visualization or feed the PCA features into a classifier. Always fit the reducer on training data only and transform test data with the same parameters — fitting on the full dataset leaks information.

When choosing the reduced dimension, consider the tradeoff: too few dimensions lose signal, too many retain noise and cost. Plot the cumulative variance curve for PCA, or try downstream task performance across several k values to find the sweet spot.
    \`,
    keyConcepts: [
      { term: "Curse of Dimensionality", definition: "The phenomenon where data becomes sparse and distances less discriminating as dimensions increase, requiring exponentially more samples and computation." },
      { term: "PCA", definition: "A linear technique that projects data onto orthogonal directions of maximum variance; minimizes reconstruction error and is computed via eigendecomposition or SVD." },
      { term: "t-SNE", definition: "A nonlinear embedding method that preserves local neighborhoods for 2D/3D visualization; emphasizes cluster structure but distorts global distances." },
      { term: "Manifold Hypothesis", definition: "The assumption that high-dimensional data lies near a lower-dimensional manifold; motivates why dimensionality reduction can succeed." },
    ],
    examples: [
      {
        title: "PCA on Image Data",
        code: "from sklearn.decomposition import PCA\\nfrom sklearn.preprocessing import StandardScaler\\nX_scaled = StandardScaler().fit_transform(X_train)  # X_train: 5000 images x 784 pixels\\npca = PCA(n_components=50).fit(X_scaled)\\nprint(f'Variance retained: {pca.explained_variance_ratio_.sum():.2%}')\\nX_reduced = pca.transform(X_scaled)  # 5000 x 50\\nX_reconstructed = pca.inverse_transform(X_reduced)  # approximate original",
        explanation: "784-pixel images are compressed to 50 dimensions while retaining ~85% of variance. The reduced features train faster and often generalize better. Reconstruction from 50 components gives a recognizable but slightly blurred image — the lost variance is mostly noise.",
      },
    ],
    exercises: [
      { id: "ml-2-2-ex-1", title: "Linear vs Nonlinear Reduction", type: "reflection", instructions: "Data lies on a 2D Swiss roll curled in 3D space. Would PCA successfully flatten it to 2D? What about t-SNE or an autoencoder? Explain why linearity is the limiting factor and what the manifold hypothesis says about this data." },
      { id: "ml-2-2-ex-2", title: "Choosing the Number of Components", type: "reflection", instructions: "PCA eigenvalues for a 100-feature dataset are [40, 30, 10, 5, 3, 2, 1, 0.5, ...]. Plot the cumulative variance and decide how many components to keep for 90% and 95% thresholds. What factors beyond variance would influence your choice?" },
    ],
    reflection: {
      prompt: "Dimensionality reduction discards information intentionally. How do you reason about what is safe to discard versus what might be critical for your downstream task?",
      followUp: ["Why is scaling crucial before PCA but less important for tree-based models?", "When would you prefer a nonlinear autoencoder over PCA despite its added complexity?"],
    },
  },

  "ml-2-3": {
    id: "ml-2-3",
    title: "Feature Engineering",
    reading: \`
## Data Is Not Ready to Model

Raw data is rarely in the right form for ML. A date string, a free-text address, or a high-cardinality category must be transformed into numeric vectors before a model can use them. Feature engineering is the art and science of creating informative input representations. It is often said that 80% of ML work is data preparation — and much of that is feature engineering.

## Types of Features

**Numerical features** are already numbers but may need scaling. Standardization (subtract mean, divide by standard deviation) gives zero mean and unit variance. Min-max scaling maps to [0,1]. Scaling matters for distance-based and gradient-based models (K-Means, neural networks, SVMs) but not for tree-based models.

**Categorical features** have discrete values like color or city. **One-hot encoding** creates a binary column per category. **Ordinal encoding** maps ordered categories (low/medium/high) to integers. For high-cardinality categories (e.g., 10,000 product IDs), one-hot creates too many columns — alternatives include target encoding (replace category with mean target value), hashing tricks, or learned embeddings.

**Text features** require tokenization, vocabulary building, and vectorization. Classical approaches use bag-of-words or TF-IDF (term frequency weighted by inverse document frequency, highlighting distinctive words). Modern approaches use learned embeddings where each word or document maps to a dense vector capturing semantic similarity.

**Temporal features** extract components from timestamps: hour of day, day of week, days since last event, rolling averages. Time-based features often carry strong predictive signal but must respect causality — never use future information to predict the past.

## Feature Creation and Selection

Creating features means combining or transforming existing ones: polynomial features (x^2, x1*x2) for nonlinear models, interaction terms, binning continuous variables into categories, or domain-specific features like BMI from height and weight.

**Feature selection** prunes irrelevant or redundant features. Too many features cause overfitting, slow training, and obscure interpretation. Methods include filter methods (correlation with target, mutual information), wrapper methods (greedy forward/backward selection), and embedded methods (Lasso's L1 penalty drives some weights to exactly zero).

A key principle: create many candidate features and let selection or regularization decide, but beware of **leakage** — a feature that contains information about the target that would not be available at prediction time (e as including the label itself or a future measurement).

## Modern Perspective

Deep learning reduces manual feature engineering — convolutional layers learn image features, transformers learn text representations automatically. But feature engineering remains critical for tabular data (where deep learning is less dominant), for incorporating domain knowledge, and for building strong baselines. Even with deep models, thoughtful input preprocessing (normalization, handling missing values, encoding) significantly impacts performance.

The best features encode domain insight. A fraud model benefits from a feature like transaction amount divided by the user's historical average — a signal no generic architecture would discover without guidance.
    \`,
    keyConcepts: [
      { term: "Feature Engineering", definition: "The process of transforming raw data into informative numeric representations that models can learn from; includes encoding, scaling, creation, and selection." },
      { term: "One-Hot Encoding", definition: "Representing a categorical variable with K categories as K binary columns; the standard approach for low-cardinality nominal features." },
      { term: "TF-IDF", definition: "Term Frequency-Inverse Document Frequency; weights words by how often they appear in a document versus how rare they are across all documents, highlighting distinctive terms." },
      { term: "Data Leakage", definition: "When features contain information derived from the target or future data not available at prediction time, causing inflated evaluation and failure in deployment." },
    ],
    examples: [
      {
        title: "Encoding and Scaling Pipeline",
        code: "import pandas as pd\\nfrom sklearn.preprocessing import OneHotEncoder, StandardScaler\\ndf['days_since_last'] = (df['today'] - df['last_purchase']).dt.days\\ndf['price_per_unit'] = df['total_price'] / df['quantity']\\n# One-hot for low-cardinality: df['region'] has 4 values\\n# Target encoding for high-cardinality: df['product_id'] has 5000 values",
        explanation: "Domain features like days_since_last and price_per_unit are derived from raw columns. Region is one-hot encoded while product_id uses target encoding to avoid 5000 extra columns. Each transformation is fit on training data only to prevent leakage.",
      },
    ],
    exercises: [
      { id: "ml-2-3-ex-1", title: "Engineer Features for a Task", type: "reflection", instructions: "You have a dataset of customer transactions with columns: timestamp, product_name (free text), price, quantity, user_id, and city. List at least 6 engineered features you would create, categorize each as numerical/categorical/text/temporal, and explain why each might help predict whether the customer will churn." },
      { id: "ml-2-3-ex-2", title: "Spot the Leakage", type: "reflection", instructions: "A model to predict loan default achieves 99% accuracy. Its features include: income, credit_score, loan_amount, and months_until_default (which is 0 for non-defaulters). Identify the leakage, explain why evaluation is inflated, and describe how to fix it." },
    ],
    reflection: {
      prompt: "If deep learning can learn features automatically, when is manual feature engineering still worth the effort? What does human domain knowledge provide that learned representations might miss?",
      followUp: ["How do you know when you have enough features versus too many?", "Why is it dangerous to create target-encoded features without cross-validation?"],
    },
  },

  "ml-3-1": {
    id: "ml-3-1",
    title: "Ensemble Methods",
    reading: \`
## Many Models Are Better Than One

The no-free-lunch theorem says no single algorithm is best for every problem. Ensembles combine multiple models so that their collective prediction is better than any individual one. The key idea: if each model makes different errors, averaging cancels errors while preserving correct predictions.

Ensembles work when individual models are **accurate** (better than random) and **diverse** (they err on different examples). A set of identical models provides no benefit. Diversity comes from training on different data subsets, using different features, or using different algorithms.

## Bagging — Bootstrap Aggregating

Bagging reduces variance by training many copies of the same model on different random subsets of data.

**Random Forest** is the flagship bagging method. It builds many decision trees, each trained on a bootstrap sample (sampling with replacement) and using a random subset of features at each split. For classification, the forest predicts the majority vote; for regression, the average. This randomness decorrelates the trees — without it, the trees would be nearly identical.

Random forests are robust, handle mixed data types, need little tuning, and provide feature importance scores. They rarely overfit as you add more trees (more trees just make the average more stable). The main hyperparameters are tree depth, number of trees, and features per split.

**Out-of-bag (OOB) evaluation** is a bonus: each tree was trained on roughly 63% of the data, so the remaining 37% serves as a free validation set. Averaging OOB predictions gives an unbiased performance estimate without a separate validation split.

## Boosting — Sequential Correction

Boosting reduces bias by building models sequentially, each one correcting the errors of the previous ensemble.

**Gradient Boosting** fits each new tree to the residuals (gradients of the loss) of the current ensemble. The ensemble prediction is the sum of all trees, each weighted by a learning rate. Popular implementations include XGBoost, LightGBM, and CatBoost — all dominant in tabular data competitions.

Boosting can achieve very high accuracy but is more prone to overfitting than bagging (too many trees memorize the data) and requires careful tuning of learning rate, tree depth, and number of trees. Early stopping on a validation set is essential.

## Stacking

Stacking trains diverse model types (e.g., a random forest, a gradient-boosted tree, and a neural network) and then trains a meta-model to combine their predictions. The meta-model learns which base model to trust for which inputs. Stacking often wins competitions but is more complex to implement and maintain than bagging or boosting.

In practice, start with a random forest as a strong baseline, try gradient boosting for tabular data where you need maximum accuracy, and reserve stacking for when you need the last few percent of performance.
    \`,
    keyConcepts: [
      { term: "Ensemble", definition: "A method that combines predictions from multiple models to produce a more accurate and robust prediction than any single model alone." },
      { term: "Bagging", definition: "Training many models on random subsets of data and averaging their predictions; reduces variance and is exemplified by random forests." },
      { term: "Boosting", definition: "Sequentially building models where each new model corrects errors of the previous ensemble; reduces bias and is exemplified by gradient-boosted trees." },
      { term: "Bootstrap Sample", definition: "A random sample drawn with replacement from the dataset, same size as the original; the resampling technique underlying bagging." },
    ],
    examples: [
      {
        title: "Random Forest vs Single Tree",
        code: "from sklearn.ensemble import RandomForestClassifier\\nfrom sklearn.tree import DecisionTreeClassifier\\ntree = DecisionTreeClassifier(max_depth=8).fit(X_train, y_train)\\nforest = RandomForestClassifier(n_estimators=200, max_depth=8, random_state=42).fit(X_train, y_train)\\n# forest averages 200 decorrelated trees -> lower variance, smoother decision boundary",
        explanation: "A single tree overfits — its boundary is jagged and sensitive to training data. The forest averages 200 trees trained on different bootstrap samples and feature subsets, producing a smoother, more stable boundary that typically generalizes better.",
      },
    ],
    exercises: [
      { id: "ml-3-1-ex-1", title: "Bias vs Variance of Ensembles", type: "reflection", instructions: "Explain why bagging primarily reduces variance while boosting primarily reduces bias. If your model has high bias (underfitting), which ensemble would you try first? If it has high variance (overfitting), which one? What happens if you apply boosting to a high-variance model?" },
      { id: "ml-3-1-ex-2", title: "Design an Ensemble", type: "reflection", instructions: "You have three models: a linear regression (fast, low variance), a deep neural network (powerful but unstable), and a k-NN (local patterns). Propose how stacking could combine them. What would the meta-model learn? How would you prevent the stacking from overfitting?" },
    ],
    reflection: {
      prompt: "Ensembles improve accuracy but increase complexity, cost, and opacity. When is the tradeoff worth it, and when would you prefer a single simpler model even if it is slightly less accurate?",
      followUp: ["How does ensemble diversity relate to the idea that different models capture different aspects of the data?", "In what sense does a random forest's OOB score give you 'free' validation?"],
    },
  },

  "ml-3-2": {
    id: "ml-3-2",
    title: "Hyperparameter Tuning",
    reading: \`
## Parameters vs Hyperparameters

Model **parameters** are learned from data — the weights and biases of a neural network. **Hyperparameters** are set before training and control how learning happens: learning rate, batch size, number of layers, tree depth, regularization strength. Choosing good hyperparameters is often the difference between a model that works and one that does not.

Hyperparameters interact in non-obvious ways. A larger batch size may need a larger learning rate. Deeper trees need stronger regularization. Tuning requires systematic search, not guesswork.

## Search Strategies

**Grid search** tries every combination from a manually specified set. If you test 3 learning rates, 4 batch sizes, and 2 optimizers, grid search evaluates 24 configurations. It is exhaustive but suffers from the curse of dimensionality — adding one more hyperparameter dimension multiplies the search space.

**Random search** samples configurations randomly. Surprisingly, it often finds better hyperparameters than grid search with fewer evaluations because it explores more distinct values per dimension. If only one hyperparameter matters, grid search wastes most evaluations repeating the same value for that dimension while random search tries many different values.

**Bayesian optimization** builds a probabilistic model (often a Gaussian process) of the objective function — the mapping from hyperparameters to validation performance. It balances exploration (trying uncertain regions) with exploitation (refining near good configurations). Tools like Optuna, Hyperopt, and Ray Tune implement this and are far more sample-efficient than random search for expensive evaluations.

**Successive halving and Hyperband** allocate more resources to promising configurations and stop poor ones early. Train many configurations for a few epochs, keep the top half, train them longer, repeat. This finds good configurations faster when training is expensive.

## Validation Protocol

Hyperparameter tuning is itself a form of learning — you are fitting choices to the validation set. With enough search, you will overfit the validation set. That is why the test set must remain untouched during tuning. The correct protocol:

1. Split into train / validation / test.
2. Search hyperparameters using cross-validation within the training set, or using the validation set.
3. Select the best configuration based on validation performance.
4. Evaluate exactly once on the test set for the final reported performance.

**Nested cross-validation** adds an outer loop for unbiased evaluation when data is scarce: the inner loop tunes hyperparameters, the outer loop estimates generalization.

## Practical Tips

Log every experiment (hyperparameters, metrics, time). Use learning rate ranges on a logarithmic scale (0.0001, 0.001, 0.01, 0.1) rather than linear. Start with random search to identify important hyperparameters, then use Bayesian optimization to refine. Automate early stopping and checkpointing so failed configurations do not waste compute.

Remember that the best hyperparameters for one dataset, architecture, or data size may not transfer. Re-tune when you change preprocessing, add data, or update the model.
    \`,
    keyConcepts: [
      { term: "Hyperparameter", definition: "A configuration set before training that controls the learning process itself, such as learning rate, batch size, regularization strength, or tree depth." },
      { term: "Bayesian Optimization", definition: "A sequential search strategy that models the objective function probabilistically and uses an acquisition function to balance exploration and exploitation." },
      { term: "Grid Search vs Random Search", definition: "Grid search exhaustively tries all combinations; random search samples randomly and often finds better hyperparameters more efficiently in high dimensions." },
      { term: "Nested Cross-Validation", definition: "An outer CV loop for unbiased performance estimation wrapped around an inner loop for hyperparameter tuning; prevents validation overfitting." },
    ],
    examples: [
      {
        title: "Random Search with Optuna",
        code: "import optuna\\ndef objective(trial):\\n    lr = trial.suggest_float('lr', 1e-5, 1e-1, log=True)\\n    depth = trial.suggest_int('depth', 3, 10)\\n    model = train_model(lr=lr, max_depth=depth)\\n    return evaluate(model, valid_set)  # minimize this\\nstudy = optuna.create_study(direction='minimize')\\nstudy.optimize(objective, n_trials=50)\\nprint(study.best_params)",
        explanation: "Optuna samples learning rate log-uniformly and depth uniformly, trains the model, and evaluates on the validation set. Bayesian optimization within Optuna learns which regions of hyperparameter space are promising and focuses future trials there.",
      },
    ],
    exercises: [
      { id: "ml-3-2-ex-1", title: "Compare Search Strategies", type: "reflection", instructions: "You have budget for 100 model trainings. Compare grid search (10 values x 10 values for 2 hyperparams) vs random search (100 random points) vs Bayesian optimization. When would each be most appropriate? Why does random search explore each dimension more thoroughly than grid search?" },
      { id: "ml-3-2-ex-2", title: "Detect Validation Overfitting", type: "reflection", instructions: "After tuning 200 hyperparameter configurations, your best validation accuracy is 92% but test accuracy is 84%. What happened? Explain how nested CV or a held-out test set would have revealed this, and propose a protocol to avoid reporting inflated results." },
    ],
    reflection: {
      prompt: "Hyperparameter tuning can consume far more compute than training a single model. How do you decide when tuning is worth the cost versus when the current model is good enough?",
      followUp: ["How should you prioritize which hyperparameters to tune when you have limited search budget?", "Why is it important to search learning rate on a logarithmic rather than linear scale?"],
    },
  },

  "ml-3-3": {
    id: "ml-3-3",
    title: "ML Pipelines and Production",
    reading: \`
## From Notebook to Production

A model that works in a Jupyter notebook is not a product. Production ML requires a **pipeline**: a reproducible, automated sequence that takes raw data to served predictions. The pipeline is where many ML projects succeed or fail — not because the model was wrong but because the system around it was fragile.

A typical pipeline has stages: ingest raw data, validate and clean it, engineer features, train or load the model, evaluate it, and serve predictions. Each stage must be versioned, monitored, and testable.

## Pipeline Components

**Data validation:** Check that incoming data matches expectations — correct schema, no missing critical columns, value ranges within bounds, no sudden distribution shift. Libraries like Great Expectations or TensorFlow Data Validation automate these checks. Without validation, a renamed column or a broken upstream feed silently degrades predictions.

**Feature pipeline:** The transformations applied at training must be applied identically at serving. If you standardized features using training mean and variance, you must use those same values at inference — recomputing on serving data leaks information and causes skew. Feature stores (Feast, Tecton) centralize feature definitions so training and serving use the same code.

**Training pipeline:** Should be reproducible — same data plus same code plus same seed yields the same model. Version data, code, and hyperparameters together (using DVC, MLflow, or Weights and Biases). Automate retraining on schedules or triggers (e.g., when new labeled data arrives or performance degrades).

**Evaluation and model registry:** Before deploying, evaluate on a held-out test set and check slice metrics for fairness. Register the model with its metrics, artifacts, and metadata. Require a promotion gate: a new model replaces the old one only if it passes tests.

## Deployment Patterns

- **Batch prediction:** Score a large dataset on a schedule (e.g., nightly churn predictions for all customers). Simple, efficient for non-interactive use cases.
- **Online prediction (real-time):** Serve predictions via an API with low latency (e.g., fraud detection at checkout). Requires a scalable serving system with autoscaling, caching, and fallback logic.
- **Edge deployment:** Run the model on the device (phone, sensor). Reduces latency and preserves privacy but constrains model size — you may need quantization or distillation.

Use **shadow deployment** (new model runs alongside old but does not affect users) and **canary deployment** (new model serves a small fraction of traffic) to catch production bugs before full rollout.

## Monitoring and Maintenance

Models decay. **Data drift** means input distributions change (e.g., user behavior shifts after a product redesign). **Concept drift** means the relationship between inputs and targets changes (e.g., what constitutes spam evolves). Both cause performance drops that no amount of initial accuracy can prevent.

Monitor input feature distributions, prediction distributions, and — when labels become available — actual accuracy. Set alerts for anomalies. Log predictions and inputs for debugging. Plan for **retraining**: decide triggers (time-based, performance-based, or data-volume-based) and automate the loop from monitoring to retraining to redeployment.

Production ML is 10% modeling and 90% engineering, monitoring, and maintenance. The teams that succeed treat the pipeline, not the model, as the product.
    \`,
    keyConcepts: [
      { term: "ML Pipeline", definition: "An automated sequence of stages — data ingestion, validation, feature engineering, training, evaluation, and serving — that moves a model from raw data to production predictions reproducibly." },
      { term: "Data Drift", definition: "A change in the input data distribution over time relative to training data; degrades model performance and triggers the need for retraining." },
      { term: "Feature Store", definition: "A centralized system that defines, computes, and serves features consistently for both training and inference, preventing training-serving skew." },
      { term: "Canary Deployment", definition: "A rollout strategy where a new model serves a small fraction of live traffic alongside the old model to detect production issues before full replacement." },
    ],
    examples: [
      {
        title: "Pipeline with Training-Serving Consistency",
        code: "# Fit preprocessing on training data only\\nscaler = StandardScaler().fit(X_train)\\nX_train_s = scaler.transform(X_train)\\nX_valid_s = scaler.transform(X_valid)\\nmodel.fit(X_train_s, y_train)\\n# At serving: SAME scaler, not refit\\nX_live_s = scaler.transform(X_live)  # reuse training scaler\\npreds = model.predict(X_live_s)",
        explanation: "The scaler is fit once on training data and reused everywhere. Refitting on live or validation data would compute different mean/variance and cause training-serving skew — the model sees differently scaled inputs than it was trained on.",
      },
    ],
    exercises: [
      { id: "ml-3-3-ex-1", title: "Design a Production Pipeline", type: "reflection", instructions: "Sketch a pipeline for a real-time recommendation system: what are the stages from raw user events to served recommendations? Identify where data validation, feature store, and monitoring would fit, and what metrics you would monitor at each stage." },
      { id: "ml-3-3-ex-2", title: "Handle Model Decay", type: "reflection", instructions: "A loan approval model trained in 2022 performs poorly in 2024 after economic changes. Is this data drift or concept drift? Propose a monitoring strategy that would have caught the degradation early and a retraining plan that avoids using stale data." },
    ],
    reflection: {
      prompt: "Many ML projects fail not because the model was inaccurate but because the pipeline broke in production. What does this tell you about where to invest engineering effort?",
      followUp: ["How would you detect that your model is making predictions on data very different from its training distribution?", "When would you choose batch prediction versus real-time serving, and what are the tradeoffs?"],
    },
  },
`;

const marker = '  },\n};\n\n// \u2550';
const idx = content.indexOf(marker);
if (idx === -1) {
  console.error('marker not found');
  process.exit(1);
}
const before = content.slice(0, idx + 4); // includes "  },"
const after = content.slice(idx + 4);
const newContent = before + ',' + block + after.slice(0, after.indexOf('\n\n// \u2550') >=0 ? 0 : 0) // placeholder
// Simpler: insert block before the final };
let finalContent = content.slice(0, idx + 4) + ',' + block + content.slice(idx + 4);
fs.writeFileSync(path, finalContent, 'utf8');
console.log('Inserted, new length', finalContent.length);
console.log('done');
