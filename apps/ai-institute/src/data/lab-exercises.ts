export interface TestCase {
  input: string;
  expectedOutput: string;
  description: string;
}

export interface LabExercise {
  id: string;
  title: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  description: string;
  problemStatement: string;
  initialCode: string;
  solutionCode: string;
  hints: string[];
  testCases: TestCase[];
  concepts: string[];
  estimatedTime: number;
  walkthroughSteps: string[];
}

export const labExercises: LabExercise[] = [
  {
    id: "first-ml-model",
    title: "Your First ML Model",
    difficulty: "Beginner",
    duration: "30 min",
    description:
      "Build and evaluate a linear regression model using scikit-learn to predict house prices from square footage.",
    problemStatement:
      "You have a dataset of houses with their square footage and selling prices. Build a linear regression model that can predict the price of a house given its square footage. Split the data into training and test sets, train the model, and evaluate it using mean squared error and R-squared score.",
    initialCode: `import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

np.random.seed(42)
square_footage = np.random.randint(600, 4000, 100).reshape(-1, 1)
prices = square_footage * 150 + np.random.randn(100) * 20000 + 50000

X_train, X_test, y_train, y_test = train_test_split(
    square_footage, prices, test_size=0.2, random_state=42
)

model = LinearRegression()

model.fit(X_train, y_train)

y_pred = model.predict(X_test)

mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f'Model Coefficients: {model.coef_[0]:.2f}')
print(f'Model Intercept: {model.intercept_:.2f}')
print(f'Mean Squared Error: {mse:.2f}')
print(f'R-squared: {r2:.4f}')

new_house = np.array([[2000]])
predicted_price = model.predict(new_house)
print(f'Predicted price for 2000 sq ft: \${predicted_price[0]:.2f}')`,
    solutionCode: `import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

np.random.seed(42)
square_footage = np.random.randint(600, 4000, 100).reshape(-1, 1)
prices = square_footage * 150 + np.random.randn(100) * 20000 + 50000

X_train, X_test, y_train, y_test = train_test_split(
    square_footage, prices, test_size=0.2, random_state=42
)

model = LinearRegression()
model.fit(X_train, y_train)

y_pred = model.predict(X_test)

mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f'Model Coefficients: {model.coef_[0]:.2f}')
print(f'Model Intercept: {model.intercept_:.2f}')
print(f'Mean Squared Error: {mse:.2f}')
print(f'R-squared: {r2:.4f}')

new_house = np.array([[2000]])
predicted_price = model.predict(new_house)
print(f'Predicted price for 2000 sq ft: \${predicted_price[0]:.2f}')`,
    hints: [
      "LinearRegression from scikit-learn expects 2D arrays for features — use .reshape(-1, 1) on your input data.",
      "The fit() method trains the model on training data. Call model.fit(X_train, y_train) before making predictions.",
      "Use model.predict(X_test) to generate predictions, then pass both y_test and y_pred to mean_squared_error and r2_score.",
    ],
    testCases: [
      {
        input: "model.coef_[0]",
        expectedOutput: "A positive float near 150",
        description: "Coefficient should be close to the true slope of 150",
      },
      {
        input: "r2",
        expectedOutput: "Greater than 0.85",
        description: "R-squared should indicate a strong fit",
      },
      {
        input: "len(y_pred)",
        expectedOutput: "20",
        description: "Test set should contain 20% of 100 samples",
      },
    ],
    concepts: [
      "Linear Regression",
      "Train-Test Split",
      "Mean Squared Error",
      "R-squared",
      "Model Fitting",
    ],
    estimatedTime: 30,
    walkthroughSteps: [
      "Import numpy and the required scikit-learn modules for model, splitting, and metrics.",
      "Generate synthetic data: square footage as features and prices as a linear function with noise.",
      "Split data into 80% training and 20% test sets using train_test_split.",
      "Instantiate a LinearRegression model and fit it on the training data.",
      "Generate predictions on the test set and compute MSE and R-squared.",
      "Print the model coefficients, intercept, and evaluation metrics.",
      "Use the trained model to predict the price of a new 2000 sq ft house.",
    ],
  },
  {
    id: "data-cleaning-pipeline",
    title: "Data Cleaning Pipeline",
    difficulty: "Beginner",
    duration: "35 min",
    description:
      "Build a pandas preprocessing pipeline that handles missing values, duplicates, outliers, and type conversions.",
    problemStatement:
      "You are given a messy DataFrame representing employee records. It contains missing values, duplicates, inconsistent data types, and outliers. Write a cleaning pipeline that handles all of these issues and outputs a clean, validated DataFrame.",
    initialCode: `import pandas as pd
import numpy as np

data = {
    'name': ['Alice', 'Bob', 'Charlie', 'Alice', 'Diana', None, 'Eve', 'Frank'],
    'age': [28, 35, 42, 28, 150, 31, 25, -5],
    'salary': [70000, 85000, None, 70000, 95000, 60000, None, 45000],
    'department': ['Engineering', 'Marketing', 'Engineering', 'Engineering',
                   'Sales', 'Marketing', 'Engineering', 'Sales'],
    'start_date': ['2021-01-15', '2019-06-20', '2015-03-10', '2021-01-15',
                   '2020-11-05', '2022-08-01', '2023-02-28', '2021-07-12']
}

df = pd.DataFrame(data)

def clean_dataframe(df):
    cleaned = df.copy()

    cleaned = cleaned.drop_duplicates()

    cleaned['age'] = cleaned['age'].clip(lower=18, upper=100)

    cleaned['salary'] = cleaned.groupby('department')['salary'].transform(
        lambda x: x.fillna(x.median())
    )

    cleaned['name'] = cleaned['name'].fillna('Unknown')

    cleaned['start_date'] = pd.to_datetime(cleaned['start_date'])

    cleaned['department'] = cleaned['department'].str.strip().str.title()

    return cleaned

clean_df = clean_dataframe(df)
print('Shape before:', df.shape)
print('Shape after:', clean_df.shape)
print('\\nCleaned Data:')
print(clean_df.to_string())
print('\\nNull counts:')
print(clean_df.isnull().sum())`,
    solutionCode: `import pandas as pd
import numpy as np

data = {
    'name': ['Alice', 'Bob', 'Charlie', 'Alice', 'Diana', None, 'Eve', 'Frank'],
    'age': [28, 35, 42, 28, 150, 31, 25, -5],
    'salary': [70000, 85000, None, 70000, 95000, 60000, None, 45000],
    'department': ['Engineering', 'Marketing', 'Engineering', 'Engineering',
                   'Sales', 'Marketing', 'Engineering', 'Sales'],
    'start_date': ['2021-01-15', '2019-06-20', '2015-03-10', '2021-01-15',
                   '2020-11-05', '2022-08-01', '2023-02-28', '2021-07-12']
}

df = pd.DataFrame(data)

def clean_dataframe(df):
    cleaned = df.copy()
    cleaned = cleaned.drop_duplicates()
    cleaned['age'] = cleaned['age'].clip(lower=18, upper=100)
    cleaned['salary'] = cleaned.groupby('department')['salary'].transform(
        lambda x: x.fillna(x.median())
    )
    cleaned['name'] = cleaned['name'].fillna('Unknown')
    cleaned['start_date'] = pd.to_datetime(cleaned['start_date'])
    cleaned['department'] = cleaned['department'].str.strip().str.title()
    return cleaned

clean_df = clean_dataframe(df)
print(f'Shape before: {df.shape}')
print(f'Shape after: {clean_df.shape}')
print(f'\\nCleaned Data:')
print(clean_df.to_string())
print(f'\\nNull counts:')
print(clean_df.isnull().sum())`,
    hints: [
      "Use df.drop_duplicates() first to remove duplicate rows before any other transformation.",
      "For outlier handling, use pd.Series.clip(lower=18, upper=100) to cap values outside a reasonable range.",
      'Group by department before filling salary NaNs so each department uses its own median: cleaned.groupby("department")["salary"].transform(lambda x: x.fillna(x.median())).',
    ],
    testCases: [
      {
        input: "clean_df.shape[0]",
        expectedOutput: "6",
        description:
          "After removing 1 duplicate, 7 rows remain; after clipping age outliers the count stays at 7 but values are corrected",
      },
      {
        input: 'clean_df["age"].min()',
        expectedOutput: "18",
        description: "Minimum age should be clipped to 18",
      },
      {
        input: 'clean_df["age"].max()',
        expectedOutput: "100",
        description: "Maximum age should be clipped to 100",
      },
      {
        input: 'clean_df["salary"].isnull().sum()',
        expectedOutput: "0",
        description:
          "No null values should remain in salary after group-based imputation",
      },
      {
        input: 'clean_df["start_date"].dtype',
        expectedOutput: "datetime64[ns]",
        description: "start_date should be converted to datetime type",
      },
    ],
    concepts: [
      "Pandas",
      "Data Cleaning",
      "Missing Value Imputation",
      "Outlier Handling",
      "Duplicate Removal",
      "Type Conversion",
    ],
    estimatedTime: 35,
    walkthroughSteps: [
      "Create the raw DataFrame from the provided dictionary with messy data.",
      "Make a copy to avoid mutating the original data.",
      "Remove duplicates with drop_duplicates().",
      "Clip the age column to a valid range (18-100) to handle outliers.",
      "Fill missing salary values using the median salary within each department group.",
      'Fill missing name values with "Unknown".',
      "Convert start_date to datetime type using pd.to_datetime().",
      "Normalize department names by stripping whitespace and applying title case.",
      "Return the cleaned DataFrame and inspect the results.",
    ],
  },
  {
    id: "neural-network-scratch",
    title: "Neural Network from Scratch",
    difficulty: "Advanced",
    duration: "50 min",
    description:
      "Implement a two-layer neural network using only numpy to classify synthetic spiral data.",
    problemStatement:
      "Implement a two-layer neural network from scratch using only numpy. The network should classify points on a 2D spiral dataset into 3 classes. You must implement the forward pass, compute the cross-entropy loss, and perform backpropagation to update weights. The network architecture is: input(2) -> hidden(64, ReLU) -> output(3, Softmax).",
    initialCode: `import numpy as np

np.random.seed(42)

def generate_spiral_data(points_per_class=100, num_classes=3):
    X = np.zeros((points_per_class * num_classes, 2))
    y = np.zeros(points_per_class * num_classes, dtype=int)
    for c in range(num_classes):
        ix = range(points_per_class * c, points_per_class * (c + 1))
        r = np.linspace(0.0, 1, points_per_class)
        t = np.linspace(c * 4, (c + 1) * 4, points_per_class) + np.random.randn(points_per_class) * 0.2
        X[ix] = np.c_[r * np.sin(t * 2.5), r * np.cos(t * 2.5)]
        y[ix] = c
    return X, y

X, y = generate_spiral_data()

input_size = 2
hidden_size = 64
output_size = 3
learning_rate = 0.1

W1 = np.random.randn(input_size, hidden_size) * 0.01
b1 = np.zeros((1, hidden_size))
W2 = np.random.randn(hidden_size, output_size) * 0.01
b2 = np.zeros((1, output_size))

def relu(z):
    return np.maximum(0, z)

def relu_derivative(z):
    return (z > 0).astype(float)

def softmax(z):
    exp_z = np.exp(z - np.max(z, axis=1, keepdims=True))
    return exp_z / np.sum(exp_z, axis=1, keepdims=True)

def forward(X, W1, b1, W2, b2):
    z1 = X @ W1 + b1
    a1 = relu(z1)
    z2 = a1 @ W2 + b2
    a2 = softmax(z2)
    return z1, a1, z2, a2

def compute_loss(y_true, y_pred):
    m = y_true.shape[0]
    log_likelihood = -np.log(y_pred[np.arange(m), y_true] + 1e-8)
    return np.sum(log_likelihood) / m

def backward(X, y, z1, a1, z2, a2, W2):
    m = X.shape[0]

    dz2 = a2.copy()
    dz2[np.arange(m), y] -= 1
    dz2 /= m

    dW2 = a1.T @ dz2
    db2 = np.sum(dz2, axis=0, keepdims=True)

    da1 = dz2 @ W2.T
    dz1 = da1 * relu_derivative(z1)

    dW1 = X.T @ dz1
    db1 = np.sum(dz1, axis=0, keepdims=True)

    return dW1, db1, dW2, db2

def update_weights(W1, b1, W2, b2, dW1, db1, dW2, db2, lr):
    W1 -= lr * dW1
    b1 -= lr * db1
    W2 -= lr * dW2
    b2 -= lr * db2
    return W1, b1, W2, b2

for epoch in range(1000):
    z1, a1, z2, a2 = forward(X, W1, b1, W2, b2)
    loss = compute_loss(y, a2)
    dW1, db1, dW2, db2 = backward(X, y, z1, a1, z2, a2, W2)
    W1, b1, W2, b2 = update_weights(W1, b1, W2, b2, dW1, db1, dW2, db2, learning_rate)

    if epoch % 100 == 0:
        predictions = np.argmax(a2, axis=1)
        accuracy = np.mean(predictions == y)
        print(f'Epoch {epoch:4d} | Loss: {loss:.4f} | Accuracy: {accuracy:.4f}')

final_predictions = np.argmax(a2, axis=1)
final_accuracy = np.mean(final_predictions == y)
print(f'\\nFinal Accuracy: {final_accuracy:.4f}')`,
    solutionCode: `import numpy as np

np.random.seed(42)

def generate_spiral_data(points_per_class=100, num_classes=3):
    X = np.zeros((points_per_class * num_classes, 2))
    y = np.zeros(points_per_class * num_classes, dtype=int)
    for c in range(num_classes):
        ix = range(points_per_class * c, points_per_class * (c + 1))
        r = np.linspace(0.0, 1, points_per_class)
        t = np.linspace(c * 4, (c + 1) * 4, points_per_class) + np.random.randn(points_per_class) * 0.2
        X[ix] = np.c_[r * np.sin(t * 2.5), r * np.cos(t * 2.5)]
        y[ix] = c
    return X, y

X, y = generate_spiral_data()

input_size = 2
hidden_size = 64
output_size = 3
learning_rate = 0.1

W1 = np.random.randn(input_size, hidden_size) * 0.01
b1 = np.zeros((1, hidden_size))
W2 = np.random.randn(hidden_size, output_size) * 0.01
b2 = np.zeros((1, output_size))

def relu(z):
    return np.maximum(0, z)

def relu_derivative(z):
    return (z > 0).astype(float)

def softmax(z):
    exp_z = np.exp(z - np.max(z, axis=1, keepdims=True))
    return exp_z / np.sum(exp_z, axis=1, keepdims=True)

def forward(X, W1, b1, W2, b2):
    z1 = X @ W1 + b1
    a1 = relu(z1)
    z2 = a1 @ W2 + b2
    a2 = softmax(z2)
    return z1, a1, z2, a2

def compute_loss(y_true, y_pred):
    m = y_true.shape[0]
    log_likelihood = -np.log(y_pred[np.arange(m), y_true] + 1e-8)
    return np.sum(log_likelihood) / m

def backward(X, y, z1, a1, z2, a2, W2):
    m = X.shape[0]
    dz2 = a2.copy()
    dz2[np.arange(m), y] -= 1
    dz2 /= m
    dW2 = a1.T @ dz2
    db2 = np.sum(dz2, axis=0, keepdims=True)
    da1 = dz2 @ W2.T
    dz1 = da1 * relu_derivative(z1)
    dW1 = X.T @ dz1
    db1 = np.sum(dz1, axis=0, keepdims=True)
    return dW1, db1, dW2, db2

def update_weights(W1, b1, W2, b2, dW1, db1, dW2, db2, lr):
    W1 -= lr * dW1
    b1 -= lr * db1
    W2 -= lr * dW2
    b2 -= lr * db2
    return W1, b1, W2, b2

for epoch in range(1000):
    z1, a1, z2, a2 = forward(X, W1, b1, W2, b2)
    loss = compute_loss(y, a2)
    dW1, db1, dW2, db2 = backward(X, y, z1, a1, z2, a2, W2)
    W1, b1, W2, b2 = update_weights(W1, b1, W2, b2, dW1, db1, dW2, db2, learning_rate)
    if epoch % 100 == 0:
        predictions = np.argmax(a2, axis=1)
        accuracy = np.mean(predictions == y)
        print(f'Epoch {epoch:4d} | Loss: {loss:.4f} | Accuracy: {accuracy:.4f}')

final_predictions = np.argmax(a2, axis=1)
final_accuracy = np.mean(final_predictions == y)
print(f'\\nFinal Accuracy: {final_accuracy:.4f}')`,
    hints: [
      "The forward pass computes z1 = X @ W1 + b1, applies ReLU activation to get a1, then computes z2 = a1 @ W2 + b2 with softmax for the output.",
      "For backpropagation, the gradient of softmax + cross-entropy simplifies to dz2 = (a2 - one_hot(y)) / m. Subtract 1 from the predicted probability at the true class index.",
      "Update weights by subtracting the learning rate times the gradient: W1 -= learning_rate * dW1. Repeat for all weight and bias matrices.",
    ],
    testCases: [
      {
        input: "a2.shape",
        expectedOutput: "(300, 3)",
        description: "Output should have 300 samples and 3 class probabilities",
      },
      {
        input: "np.allclose(np.sum(a2, axis=1), 1.0)",
        expectedOutput: "True",
        description:
          "Softmax output probabilities should sum to 1 for each sample",
      },
      {
        input: "final_accuracy",
        expectedOutput: "Greater than 0.85",
        description:
          "The network should achieve at least 85% accuracy on the training set",
      },
    ],
    concepts: [
      "Neural Networks",
      "Forward Pass",
      "Backpropagation",
      "ReLU Activation",
      "Softmax",
      "Cross-Entropy Loss",
      "Gradient Descent",
    ],
    estimatedTime: 50,
    walkthroughSteps: [
      "Generate spiral data using polar coordinates with noise for 3 classes.",
      "Initialize weight matrices W1 and W2 with small random values and biases b1, b2 with zeros.",
      "Implement ReLU activation: max(0, z) and its derivative for backpropagation.",
      "Implement softmax: subtract the max for numerical stability, exponentiate, then normalize.",
      "Forward pass: compute z1 = X @ W1 + b1, a1 = relu(z1), z2 = a1 @ W2 + b2, a2 = softmax(z2).",
      "Compute cross-entropy loss: -log of the predicted probability at the true class index.",
      "Backward pass: compute dz2 = (a2 - one_hot(y)) / m, then propagate gradients through W2, ReLU, and W1.",
      "Update all weights and biases using gradient descent with the given learning rate.",
      "Train for 1000 epochs, printing loss and accuracy every 100 epochs.",
      "Evaluate final accuracy on the training data.",
    ],
  },
  {
    id: "image-classification",
    title: "Image Classification",
    difficulty: "Intermediate",
    duration: "45 min",
    description:
      "Build and train a CNN with PyTorch to classify images from the CIFAR-10 dataset.",
    problemStatement:
      "Build a convolutional neural network using PyTorch to classify 32x32 RGB images from the CIFAR-10 dataset into 10 classes. The network should have at least two convolutional layers with pooling, followed by fully connected layers. Train the model for 5 epochs and achieve at least 60% test accuracy.",
    initialCode: `import torch
import torch.nn as nn
import torch.optim as optim
import torchvision
import torchvision.transforms as transforms

transform = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))
])

trainset = torchvision.datasets.CIFAR10(root='./data', train=True, download=True, transform=transform)
trainloader = torch.utils.data.DataLoader(trainset, batch_size=64, shuffle=True)

testset = torchvision.datasets.CIFAR10(root='./data', train=False, download=True, transform=transform)
testloader = torch.utils.data.DataLoader(testset, batch_size=64, shuffle=False)

class CIFAR10Net(nn.Module):
    def __init__(self):
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(3, 32, 3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(32, 64, 3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(64, 128, 3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(128 * 4 * 4, 256),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(256, 10)
        )

    def forward(self, x):
        x = self.features(x)
        x = self.classifier(x)
        return x

model = CIFAR10Net()
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

for epoch in range(5):
    model.train()
    running_loss = 0.0
    for images, labels in trainloader:
        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        running_loss += loss.item()

    model.eval()
    correct = 0
    total = 0
    with torch.no_grad():
        for images, labels in testloader:
            outputs = model(images)
            _, predicted = torch.max(outputs, 1)
            total += labels.size(0)
            correct += (predicted == labels).sum().item()

    accuracy = 100 * correct / total
    print(f'Epoch {epoch + 1}/5 | Loss: {running_loss / len(trainloader):.4f} | Test Accuracy: {accuracy:.2f}%')

print(f'\\nFinal Test Accuracy: {accuracy:.2f}%')`,
    solutionCode: `import torch
import torch.nn as nn
import torch.optim as optim
import torchvision
import torchvision.transforms as transforms

transform = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))
])

trainset = torchvision.datasets.CIFAR10(root='./data', train=True, download=True, transform=transform)
trainloader = torch.utils.data.DataLoader(trainset, batch_size=64, shuffle=True)

testset = torchvision.datasets.CIFAR10(root='./data', train=False, download=True, transform=transform)
testloader = torch.utils.data.DataLoader(testset, batch_size=64, shuffle=False)

class CIFAR10Net(nn.Module):
    def __init__(self):
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(3, 32, 3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(32, 64, 3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(64, 128, 3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(128 * 4 * 4, 256),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(256, 10)
        )

    def forward(self, x):
        x = self.features(x)
        x = self.classifier(x)
        return x

model = CIFAR10Net()
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

for epoch in range(5):
    model.train()
    running_loss = 0.0
    for images, labels in trainloader:
        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        running_loss += loss.item()
    model.eval()
    correct = 0
    total = 0
    with torch.no_grad():
        for images, labels in testloader:
            outputs = model(images)
            _, predicted = torch.max(outputs, 1)
            total += labels.size(0)
            correct += (predicted == labels).sum().item()
    accuracy = 100 * correct / total
    print(f'Epoch {epoch + 1}/5 | Loss: {running_loss / len(trainloader):.4f} | Test Accuracy: {accuracy:.2f}%')

print(f'\\nFinal Test Accuracy: {accuracy:.2f}%')`,
    hints: [
      "CIFAR-10 images are 32x32 with 3 color channels. After three rounds of MaxPool2d(2), the spatial dimensions become 4x4 with 128 channels, so the linear layer input is 128 * 4 * 4.",
      "Use nn.CrossEntropyLoss() which combines LogSoftmax and NLLLoss — no need to apply softmax in the forward pass.",
      "Set model.eval() and wrap inference in torch.no_grad() to disable gradient computation during testing for efficiency.",
    ],
    testCases: [
      {
        input: "model.features[0].in_channels",
        expectedOutput: "3",
        description: "First conv layer should accept 3-channel RGB input",
      },
      {
        input: "model.classifier[-1].out_features",
        expectedOutput: "10",
        description: "Output layer should produce 10 class logits",
      },
      {
        input: "accuracy",
        expectedOutput: "Greater than 60",
        description: "Test accuracy should exceed 60% after 5 epochs",
      },
    ],
    concepts: [
      "CNN",
      "Conv2d",
      "MaxPool2d",
      "PyTorch",
      "DataLoader",
      "CrossEntropyLoss",
      "Image Classification",
      "Transfer Learning",
    ],
    estimatedTime: 45,
    walkthroughSteps: [
      "Define image transforms: convert to tensor and normalize with mean and std of 0.5 for each channel.",
      "Load CIFAR-10 datasets with the defined transforms and create DataLoaders with batch size 64.",
      "Define the CNN architecture with three Conv2d+ReLU+MaxPool2d blocks in the feature extractor.",
      "Add a classifier head with Flatten, Linear(128*4*4, 256), ReLU, Dropout(0.5), and Linear(256, 10).",
      "Initialize the model, CrossEntropyLoss criterion, and Adam optimizer with lr=0.001.",
      "Train for 5 epochs: forward pass, compute loss, backward pass, optimizer step.",
      "Evaluate on test set: set model to eval mode, compute predictions, calculate accuracy.",
      "Print loss and accuracy per epoch.",
    ],
  },
  {
    id: "sentiment-analysis",
    title: "Sentiment Analysis",
    difficulty: "Intermediate",
    duration: "40 min",
    description:
      "Build a text classification pipeline that analyzes sentiment using TF-IDF features and a logistic regression classifier.",
    problemStatement:
      "Build a sentiment analysis system that classifies movie reviews as positive or negative. Use TF-IDF vectorization to convert text to features and train a logistic regression classifier. The system should handle preprocessing, feature extraction, model training, and prediction on new text inputs.",
    initialCode: `import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score

reviews = [
    'This movie was fantastic and truly inspiring',
    'Terrible film, complete waste of time',
    'Absolutely loved every minute of it',
    'Boring and predictable storyline',
    'A masterpiece of modern cinema',
    'The worst movie I have ever seen',
    'Brilliant performances by the entire cast',
    'Dull, lifeless, and completely forgettable',
    'An emotional rollercoaster with a great ending',
    'Painfully slow and poorly written',
    'One of the best films of the year',
    'Awful acting and terrible dialogue',
    'A beautiful and touching story',
    'I could not wait for it to end',
    'Outstanding direction and stunning visuals',
    'A complete disaster from start to finish',
    'Highly recommended for all movie lovers',
    'Do not waste your money on this garbage',
    'The plot was engaging and well crafted',
    'An absolute trainwreck of a movie',
    'Captivating from beginning to end',
    'Flat characters and a weak script',
    'A wonderful surprise, exceeded expectations',
    'Predictable and utterly boring',
    'Gripping tension and superb acting',
    'Annoying and repetitive throughout',
    'A triumph of storytelling',
    'Lazy writing and poor execution',
    'Feel good movie with a heart',
    'Disappointing and uninspired',
]

labels = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]

vectorizer = TfidfVectorizer(max_features=5000, ngram_range=(1, 2), stop_words='english')
X = vectorizer.fit_transform(reviews)

X_train, X_test, y_train, y_test = train_test_split(X, labels, test_size=0.25, random_state=42)

classifier = LogisticRegression(max_iter=1000)
classifier.fit(X_train, y_train)

y_pred = classifier.predict(X_test)

print('Accuracy:', accuracy_score(y_test, y_pred))
print('\\nClassification Report:')
print(classification_report(y_test, y_pred, target_names=['Negative', 'Positive']))

def predict_sentiment(text):
    features = vectorizer.transform([text])
    prediction = classifier.predict(features)[0]
    probability = classifier.predict_proba(features)[0]
    sentiment = 'Positive' if prediction == 1 else 'Negative'
    confidence = max(probability) * 100
    return sentiment, confidence

test_texts = [
    'This is the best thing I have ever watched',
    'What a terrible waste of talent',
    'A decent movie with some good moments',
]
for text in test_texts:
    sentiment, confidence = predict_sentiment(text)
    print(f'Text: {text}')
    print(f'Sentiment: {sentiment} ({confidence:.1f}% confidence)\\n')`,
    solutionCode: `import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score

reviews = [
    'This movie was fantastic and truly inspiring',
    'Terrible film, complete waste of time',
    'Absolutely loved every minute of it',
    'Boring and predictable storyline',
    'A masterpiece of modern cinema',
    'The worst movie I have ever seen',
    'Brilliant performances by the entire cast',
    'Dull, lifeless, and completely forgettable',
    'An emotional rollercoaster with a great ending',
    'Painfully slow and poorly written',
    'One of the best films of the year',
    'Awful acting and terrible dialogue',
    'A beautiful and touching story',
    'I could not wait for it to end',
    'Outstanding direction and stunning visuals',
    'A complete disaster from start to finish',
    'Highly recommended for all movie lovers',
    'Do not waste your money on this garbage',
    'The plot was engaging and well crafted',
    'An absolute trainwreck of a movie',
    'Captivating from beginning to end',
    'Flat characters and a weak script',
    'A wonderful surprise, exceeded expectations',
    'Predictable and utterly boring',
    'Gripping tension and superb acting',
    'Annoying and repetitive throughout',
    'A triumph of storytelling',
    'Lazy writing and poor execution',
    'Feel good movie with a heart',
    'Disappointing and uninspired',
]

labels = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]

vectorizer = TfidfVectorizer(max_features=5000, ngram_range=(1, 2), stop_words='english')
X = vectorizer.fit_transform(reviews)

X_train, X_test, y_train, y_test = train_test_split(X, labels, test_size=0.25, random_state=42)

classifier = LogisticRegression(max_iter=1000)
classifier.fit(X_train, y_train)

y_pred = classifier.predict(X_test)

print(f'Accuracy: {accuracy_score(y_test, y_pred)}')
print(f'\\nClassification Report:')
print(classification_report(y_test, y_pred, target_names=['Negative', 'Positive']))

def predict_sentiment(text):
    features = vectorizer.transform([text])
    prediction = classifier.predict(features)[0]
    probability = classifier.predict_proba(features)[0]
    sentiment = 'Positive' if prediction == 1 else 'Negative'
    confidence = max(probability) * 100
    return sentiment, confidence

test_texts = [
    'This is the best thing I have ever watched',
    'What a terrible waste of talent',
    'A decent movie with some good moments',
]
for text in test_texts:
    sentiment, confidence = predict_sentiment(text)
    print(f'Text: {text}')
    print(f'Sentiment: {sentiment} ({confidence:.1f}% confidence)\\n')`,
    hints: [
      "TfidfVectorizer converts text to a matrix of TF-IDF features. Use ngram_range=(1, 2) to capture both unigrams and bigrams.",
      "LogisticRegression needs max_iter=1000 because TF-IDF features are high-dimensional and may require more iterations to converge.",
      "Use vectorizer.transform([text]) (not fit_transform) when predicting on new text to use the vocabulary learned from training data.",
    ],
    testCases: [
      {
        input: "X.shape[1]",
        expectedOutput: "Less than or equal to 5000",
        description: "Number of TF-IDF features should not exceed max_features",
      },
      {
        input: "accuracy_score(y_test, y_pred)",
        expectedOutput: "Greater than 0.7",
        description: "Accuracy should be above 70% on the test set",
      },
      {
        input: 'predict_sentiment("great movie")[0]',
        expectedOutput: "Positive",
        description: "Clearly positive text should be classified as positive",
      },
      {
        input: 'predict_sentiment("awful film")[0]',
        expectedOutput: "Negative",
        description: "Clearly negative text should be classified as negative",
      },
    ],
    concepts: [
      "NLP",
      "TF-IDF",
      "Text Classification",
      "Logistic Regression",
      "Sentiment Analysis",
      "Feature Extraction",
      "N-grams",
    ],
    estimatedTime: 40,
    walkthroughSteps: [
      "Create a labeled dataset of positive (1) and negative (0) movie review texts.",
      "Instantiate TfidfVectorizer with max_features=5000, bigram support, and English stop words.",
      "Fit and transform the review texts to create the TF-IDF feature matrix.",
      "Split data into 75% training and 25% test sets.",
      "Train a LogisticRegression classifier with max_iter=1000 on the training data.",
      "Evaluate predictions on the test set using accuracy_score and classification_report.",
      "Build a predict_sentiment function that transforms new text and returns sentiment with confidence.",
      "Test the function on sample texts and print results.",
    ],
  },
  {
    id: "rag-pipeline",
    title: "RAG Pipeline",
    difficulty: "Advanced",
    duration: "55 min",
    description:
      "Build a retrieval-augmented generation pipeline that searches a document corpus and generates answers using context.",
    problemStatement:
      "Build a complete Retrieval-Augmented Generation (RAG) pipeline from scratch. Create a document store with chunking, build a vector index using sentence embeddings, implement cosine similarity search, and generate answers by constructing prompts with retrieved context. Do not use any external LLM APIs — simulate the generation step with a template-based approach that extracts relevant sentences from retrieved chunks.",
    initialCode: `import numpy as np
from typing import List, Dict, Tuple

class SimpleTokenizer:
    def __init__(self):
        self.vocab = {}
        self.id_to_token = {}

    def build_vocab(self, texts: List[str], min_freq: int = 1):
        freq = {}
        for text in texts:
            for token in text.lower().split():
                freq[token] = freq.get(token, 0) + 1
        self.vocab = {t: i for i, (t, c) in enumerate(
            sorted(freq.items(), key=lambda x: -x[1]))
            if c >= min_freq}
        self.id_to_token = {i: t for t, i in self.vocab.items()}

    def encode(self, text: str) -> List[int]:
        return [self.vocab.get(t, 0) for t in text.lower().split()]

class DocumentStore:
    def __init__(self):
        self.documents: List[Dict] = []
        self.chunks: List[Dict] = []
        self.embeddings: np.ndarray = None
        self.tokenizer = SimpleTokenizer()

    def add_document(self, title: str, content: str, source: str = ''):
        doc = {'title': title, 'content': content, 'source': source}
        self.documents.append(doc)
        sentences = [s.strip() for s in content.replace('. ', '.|').split('|') if s.strip()]
        for i, sentence in enumerate(sentences):
            self.chunks.append({
                'text': sentence,
                'doc_title': title,
                'chunk_index': i,
                'source': source,
            })

    def build_index(self):
        all_texts = [c['text'] for c in self.chunks]
        self.tokenizer.build_vocab(all_texts)
        self.embeddings = np.array([
            self._embed(text) for text in all_texts
        ])

    def _embed(self, text: str) -> np.ndarray:
        ids = self.tokenizer.encode(text)
        vec = np.zeros(len(self.tokenizer.vocab))
        for idx in ids:
            if idx < len(vec):
                vec[idx] += 1
        norm = np.linalg.norm(vec)
        if norm > 0:
            vec = vec / norm
        return vec

    def search(self, query: str, top_k: int = 3) -> List[Dict]:
        q_emb = self._embed(query)
        similarities = np.dot(self.embeddings, q_emb)
        top_indices = np.argsort(similarities)[-top_k:][::-1]
        results = []
        for idx in top_indices:
            chunk = self.chunks[idx].copy()
            chunk['score'] = float(similarities[idx])
            results.append(chunk)
        return results

class RAGPipeline:
    def __init__(self, store: DocumentStore):
        self.store = store

    def retrieve(self, query: str, top_k: int = 3) -> List[Dict]:
        return self.store.search(query, top_k)

    def generate(self, query: str, context_chunks: List[Dict]) -> str:
        context = '\\n'.join([c['text'] for c in context_chunks])
        answer_parts = [query]
        for chunk in context_chunks:
            answer_parts.append(chunk['text'])
        answer = f'Based on the retrieved context:\\n\\n{context}\\n\\nQuery: {query}'
        return answer

    def query(self, question: str, top_k: int = 3) -> Dict:
        chunks = self.retrieve(question, top_k)
        answer = self.generate(question, chunks)
        return {
            'question': question,
            'answer': answer,
            'sources': [{'title': c['doc_title'], 'score': c['score']} for c in chunks],
        }

store = DocumentStore()

store.add_document(
    'Python Basics',
    'Python is a high-level programming language. Python uses dynamic typing. Python supports multiple paradigms including object-oriented and functional programming.',
    source='python-guide'
)
store.add_document(
    'Machine Learning',
    'Machine learning is a subset of artificial intelligence. Supervised learning uses labeled data. Unsupervised learning finds patterns in unlabeled data. Neural networks are inspired by biological neurons.',
    source='ml-handbook'
)
store.add_document(
    'Data Science',
    'Data science combines statistics and programming. Pandas is the most popular data manipulation library. NumPy provides efficient array operations. Data visualization helps communicate findings.',
    source='ds-textbook'
)

store.build_index()

rag = RAGPipeline(store)

questions = [
    'What is machine learning?',
    'How does Python handle data?',
    'What libraries are used in data science?',
]
for q in questions:
    result = rag.query(q)
    print(f'Q: {result["question"]}')
    print(f'A: {result["answer"][:200]}...')
    print(f'Sources: {result["sources"]}')
    print()`,
    solutionCode: `import numpy as np
from typing import List, Dict, Tuple

class SimpleTokenizer:
    def __init__(self):
        self.vocab = {}
        self.id_to_token = {}

    def build_vocab(self, texts: List[str], min_freq: int = 1):
        freq = {}
        for text in texts:
            for token in text.lower().split():
                freq[token] = freq.get(token, 0) + 1
        self.vocab = {t: i for i, (t, c) in enumerate(
            sorted(freq.items(), key=lambda x: -x[1]))
            if c >= min_freq}
        self.id_to_token = {i: t for t, i in self.vocab.items()}

    def encode(self, text: str) -> List[int]:
        return [self.vocab.get(t, 0) for t in text.lower().split()]

class DocumentStore:
    def __init__(self):
        self.documents: List[Dict] = []
        self.chunks: List[Dict] = []
        self.embeddings: np.ndarray = None
        self.tokenizer = SimpleTokenizer()

    def add_document(self, title: str, content: str, source: str = ''):
        doc = {'title': title, 'content': content, 'source': source}
        self.documents.append(doc)
        sentences = [s.strip() for s in content.replace('. ', '.|').split('|') if s.strip()]
        for i, sentence in enumerate(sentences):
            self.chunks.append({
                'text': sentence,
                'doc_title': title,
                'chunk_index': i,
                'source': source,
            })

    def build_index(self):
        all_texts = [c['text'] for c in self.chunks]
        self.tokenizer.build_vocab(all_texts)
        self.embeddings = np.array([self._embed(text) for text in all_texts])

    def _embed(self, text: str) -> np.ndarray:
        ids = self.tokenizer.encode(text)
        vec = np.zeros(len(self.tokenizer.vocab))
        for idx in ids:
            if idx < len(vec):
                vec[idx] += 1
        norm = np.linalg.norm(vec)
        if norm > 0:
            vec = vec / norm
        return vec

    def search(self, query: str, top_k: int = 3) -> List[Dict]:
        q_emb = self._embed(query)
        similarities = np.dot(self.embeddings, q_emb)
        top_indices = np.argsort(similarities)[-top_k:][::-1]
        results = []
        for idx in top_indices:
            chunk = self.chunks[idx].copy()
            chunk['score'] = float(similarities[idx])
            results.append(chunk)
        return results

class RAGPipeline:
    def __init__(self, store: DocumentStore):
        self.store = store

    def retrieve(self, query: str, top_k: int = 3) -> List[Dict]:
        return self.store.search(query, top_k)

    def generate(self, query: str, context_chunks: List[Dict]) -> str:
        context = '\\n'.join([c['text'] for c in context_chunks])
        answer_parts = [query]
        for chunk in context_chunks:
            answer_parts.append(chunk['text'])
        answer = f'Based on the retrieved context:\\n\\n{context}\\n\\nQuery: {query}'
        return answer

    def query(self, question: str, top_k: int = 3) -> Dict:
        chunks = self.retrieve(question, top_k)
        answer = self.generate(question, chunks)
        return {
            'question': question,
            'answer': answer,
            'sources': [{'title': c['doc_title'], 'score': c['score']} for c in chunks],
        }

store = DocumentStore()

store.add_document(
    'Python Basics',
    'Python is a high-level programming language. Python uses dynamic typing. Python supports multiple paradigms including object-oriented and functional programming.',
    source='python-guide'
)
store.add_document(
    'Machine Learning',
    'Machine learning is a subset of artificial intelligence. Supervised learning uses labeled data. Unsupervised learning finds patterns in unlabeled data. Neural networks are inspired by biological neurons.',
    source='ml-handbook'
)
store.add_document(
    'Data Science',
    'Data science combines statistics and programming. Pandas is the most popular data manipulation library. NumPy provides efficient array operations. Data visualization helps communicate findings.',
    source='ds-textbook'
)

store.build_index()

rag = RAGPipeline(store)

questions = [
    'What is machine learning?',
    'How does Python handle data?',
    'What libraries are used in data science?',
]
for q in questions:
    result = rag.query(q)
    print(f'Q: {result["question"]}')
    print(f'A: {result["answer"][:200]}...')
    print(f'Sources: {result["sources"]}')
    print()`,
    hints: [
      'Split documents into chunks at the sentence level. Use content.replace(". ", ".|").split("|") to split on periods followed by spaces.',
      "Build a bag-of-words embedding by counting token frequencies in a vector sized to the vocabulary. Normalize with L2 norm for cosine similarity.",
      "The search method computes cosine similarity as np.dot(embeddings, query_embedding) since both vectors are already L2-normalized.",
    ],
    testCases: [
      {
        input: "len(store.chunks)",
        expectedOutput: "Greater than 10",
        description:
          "Documents should be split into multiple sentence-level chunks",
      },
      {
        input: "store.embeddings.shape[1]",
        expectedOutput: "Greater than 0",
        description: "Embedding dimension should match vocabulary size",
      },
      {
        input: 'rag.retrieve("machine learning", top_k=1)[0]["doc_title"]',
        expectedOutput: "Machine Learning",
        description:
          "Querying about ML should retrieve chunks from the ML document",
      },
      {
        input: 'len(rag.query("What is Python?")["sources"])',
        expectedOutput: "3",
        description: "Should return top_k source references",
      },
    ],
    concepts: [
      "RAG",
      "Vector Search",
      "Document Chunking",
      "TF-IDF Embeddings",
      "Cosine Similarity",
      "Retrieval-Augmented Generation",
    ],
    estimatedTime: 55,
    walkthroughSteps: [
      "Implement a SimpleTokenizer that builds a vocabulary from a corpus and encodes text to token ID sequences.",
      "Create a DocumentStore that holds documents and splits them into sentence-level chunks.",
      "Build a bag-of-words embedding for each chunk: count token frequencies in a vocabulary-sized vector and L2-normalize.",
      "Build the index by tokenizing all chunks and computing their embedding vectors.",
      "Implement search: embed the query, compute cosine similarity against all chunk embeddings, return top-k results.",
      "Build the RAGPipeline class with retrieve (calls search) and generate (constructs context from retrieved chunks).",
      "Add a query method that chains retrieve and generate, returning the answer and source metadata.",
      "Populate the store with documents, build the index, and test with sample questions.",
    ],
  },
];

export function getLabExercise(id: string): LabExercise | undefined {
  return labExercises.find((lab) => lab.id === id);
}

export function getLabExercisesByDifficulty(
  difficulty: LabExercise["difficulty"],
): LabExercise[] {
  return labExercises.filter((lab) => lab.difficulty === difficulty);
}

export function getLabExercisesByConcept(concept: string): LabExercise[] {
  return labExercises.filter((lab) =>
    lab.concepts.some((c) => c.toLowerCase().includes(concept.toLowerCase())),
  );
}
