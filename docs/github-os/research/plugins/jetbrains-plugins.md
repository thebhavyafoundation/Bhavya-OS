# JetBrains Plugins — Knowledge Package

## Executive Summary

JetBrains IntelliJ IDEA and its sibling IDEs (PyCharm, WebStorm, GoLand, CLion) have a mature plugin ecosystem with thousands of plugins on the JetBrains Marketplace. In 2026, IntelliJ IDEA 2026.1 introduced the Agent Client Protocol (ACP) Registry, enabling seamless integration of external AI agents including Cursor, GitHub Copilot, and Codex. The plugin ecosystem covers productivity, code quality, framework support, DevOps integration, and AI assistance. Key trends include AI agent integration via ACP, improved Kotlin/JPA support, and Gradle best practices enforcement.

## Tools by Category

### AI Assistance

#### 1. GitHub Copilot (JetBrains)

- **Description:** AI code completion integrated into JetBrains IDEs. Same features as VS Code version — inline suggestions, chat, agent mode.
- **Use Case:** AI-assisted coding in JetBrains ecosystem
- **Installation:** JetBrains Marketplace → GitHub Copilot
- **Pricing:** $10/mo individual, $19/mo business
- **Maintenance:** Maintained by GitHub/Microsoft. Monthly updates.

#### 2. JetBrains AI / Junie

- **Description:** JetBrains' native AI assistant with chat, code generation, and the Junie autonomous agent. Supports next edit suggestions without consuming AI quota.
- **Use Case:** JetBrains-native AI workflows, autonomous coding tasks
- **Installation:** Built into IntelliJ IDEA (AI Pro subscription for advanced features)
- **Pricing:** Included in JetBrains subscription; AI Pro for advanced features
- **Maintenance:** JetBrains-maintained, core product feature.

#### 3. Tabnine

- **Description:** Privacy-focused AI code completion with on-device model option. Context-aware suggestions based on codebase patterns.
- **Use Case:** Privacy-conscious teams, enterprise environments
- **Installation:** JetBrains Marketplace → Tabnine
- **Pricing:** Free tier, Pro for teams
- **Maintenance:** Actively maintained by Tabnine.

#### 4. Amazon Q Developer (JetBrains)

- **Description:** AWS-native AI assistant with cloud-aware coding and service guidance.
- **Use Case:** AWS development, cloud-native applications
- **Installation:** JetBrains Marketplace → Amazon Q
- **Pricing:** Free tier available
- **Maintenance:** Amazon-maintained.

#### 5. ACP Registry Agents

- **Description:** New in IntelliJ IDEA 2026.1 — discover and install external agents (Cursor, Codex, Copilot) via Agent Client Protocol Registry.
- **Use Case:** Multi-agent workflows, agent flexibility
- **Installation:** Built into IntelliJ IDEA 2026.1+
- **Pricing:** Varies by agent
- **Maintenance:** JetBrains-maintained protocol.

### Productivity & Code Generation

#### 6. Lombok

- **Description:** Reduces Java boilerplate — getters, setters, constructors, builders, data classes via annotations. Eliminates hundreds of lines of repetitive code.
- **Use Case:** Java development, boilerplate reduction
- **Installation:** JetBrains Marketplace → Lombok
- **Pricing:** Free
- **Maintenance:** Very active, widely adopted.

#### 7. AceJump

- **Description:** Jump to any location in the editor by typing a character sequence. Faster than mouse or arrow key navigation.
- **Use Case:** Fast code navigation, editor productivity
- **Installation:** JetBrains Marketplace → AceJump
- **Pricing:** Free
- **Maintenance:** Community-maintained, stable.

#### 8. IdeaVim

- **Description:** Vim emulator supporting Normal, Insert, and Visual modes. Customizable via `.ideavimrc`. Extensions include EasyMotion, Quickscope, Which-Key.
- **Use Case:** Vim users in JetBrains IDEs
- **Installation:** JetBrains Marketplace → IdeaVim
- **Pricing:** Free
- **Maintenance:** Very active community.

#### 9. GenerateAllSetter

- **Description:** Automatically generates setter method calls for all fields of a class. One-click boilerplate elimination.
- **Use Case:** Java bean configuration, test data setup
- **Installation:** JetBrains Marketplace → GenerateAllSetter
- **Pricing:** Free
- **Maintenance:** Community-maintained.

#### 10. Rainbow Brackets

- **Description:** Colorizes matching brackets in different colors. Dramatically improves code readability in deeply nested code.
- **Use Case:** Code readability, nested structure navigation
- **Installation:** JetBrains Marketplace → Rainbow Brackets
- **Pricing:** Free
- **Maintenance:** Community-maintained, stable.

### Code Quality & Analysis

#### 11. SonarQube for IDE (formerly SonarLint)

- **Description:** Real-time code quality and security analysis. Highlights issues and suggests improvements as you write code.
- **Use Case:** Code quality enforcement, security vulnerability detection
- **Installation:** JetBrains Marketplace → SonarQube for IDE
- **Pricing:** Free
- **Maintenance:** SonarSource-maintained, active.

#### 12. CheckStyle-IDEA

- **Description:** Integrates Checkstyle for Java code style enforcement. Customizable rulesets for team standards.
- **Use Case:** Java code style consistency
- **Installation:** JetBrains Marketplace → CheckStyle-IDEA
- **Pricing:** Free
- **Maintenance:** Community-maintained.

#### 13. FindBugs-IDEA

- **Description:** Bug detection plugin that analyzes Java bytecode for potential defects. Catches common programming mistakes.
- **Use Case:** Static analysis, bug prevention
- **Installation:** JetBrains Marketplace → FindBugs-IDEA
- **Pricing:** Free
- **Maintenance:** Community-maintained.

#### 14. Inspection Lens

- **Description:** Shows inspection results directly in the editor gutter. Immediate visibility into code quality issues.
- **Use Case:** Real-time code quality feedback
- **Installation:** JetBrains Marketplace → Inspection Lens
- **Pricing:** Free
- **Maintenance:** Community-maintained.

### Framework & DevOps

#### 15. JPA Buddy

- **Description:** Visual entity generation, repository creation, and query building for JPA/Hibernate. Generates entities, repositories, and queries visually.
- **Use Case:** Java persistence layer development
- **Installation:** JetBrains Marketplace → JPA Buddy
- **Pricing:** Free tier, Pro available
- **Maintenance:** Actively maintained.

#### 16. AWS Toolkit

- **Description:** AWS service integration — Lambda, S3, CloudWatch, ECS, and more. Deploy and manage AWS resources from IDE.
- **Use Case:** AWS development, cloud deployment
- **Installation:** JetBrains Marketplace → AWS Toolkit
- **Pricing:** Free
- **Maintenance:** Amazon-maintained, active.

#### 17. Docker Plugin

- **Description:** Built into IntelliJ IDEA Ultimate. Manage containers, images, volumes, and Compose files.
- **Use Case:** Container management
- **Installation:** Pre-installed in Ultimate; Marketplace for Community
- **Pricing:** Included with Ultimate
- **Maintenance:** JetBrains-maintained.

#### 18. GitToolBox

- **Description:** Enhanced Git integration — auto-fetch, branch coloring, inline blame, status bar information.
- **Use Case:** Git workflow enhancement
- **Installation:** JetBrains Marketplace → GitToolBox
- **Pricing:** Free
- **Maintenance:** Community-maintained.

### Visualization & Documentation

#### 19. PlantUML Integration

- **Description:** Create UML diagrams directly in IDE using PlantUML syntax. Visualize architecture and relationships.
- **Use Case:** Architecture documentation, design visualization
- **Installation:** JetBrains Marketplace → PlantUML Integration
- **Pricing:** Free
- **Maintenance:** Community-maintained.

#### 20. AsciiDoc

- **Description:** Full AsciiDoc support — preview, syntax highlighting, editor assistance. Write documentation in IDE.
- **Use Case:** Technical documentation, README writing
- **Installation:** JetBrains Marketplace → AsciiDoc
- **Pricing:** Free
- **Maintenance:** Community-maintained.

#### 21. CodeGlance Pro

- **Description:** Minimap-style code overview panel. Quick navigation through large files.
- **Use Case:** Code navigation, large file overview
- **Installation:** JetBrains Marketplace → CodeGlance Pro
- **Pricing:** Free
- **Maintenance:** Community-maintained.

### Database Tools

#### 22. Database Tools (Ultimate)

- **Description:** Built-in database management — SQL completion, data editor, schema visualization. Best-in-class database tooling.
- **Use Case:** Database development, SQL editing
- **Installation:** Pre-installed in IntelliJ IDEA Ultimate
- **Pricing:** Included with Ultimate
- **Maintenance:** JetBrains-maintained.

#### 23. MyBatis Log Free

- **Description:** Displays full SQL queries with parameter binding for MyBatis ORM debugging.
- **Use Case:** ORM debugging, SQL analysis
- **Installation:** JetBrains Marketplace → MyBatis Log Free
- **Pricing:** Free
- **Maintenance:** Community-maintained.

### Collaboration

#### 24. Code With Me

- **Description:** Real-time code sharing and collaboration within JetBrains IDEs. Multiple developers edit simultaneously.
- **Use Case:** Pair programming, remote collaboration
- **Installation:** Built into JetBrains IDEs
- **Pricing:** Free tier, paid for advanced features
- **Maintenance:** JetBrains-maintained.

## Productivity Gain

**Rating: 4/5**

JetBrains plugins provide strong productivity gains, especially for Java/Kotlin/Spring development. The AI integration via ACP Registry is a game-changer for 2026, allowing developers to bring their preferred AI agents. However, the ecosystem is more fragmented than VS Code, and some plugins can slow IDE startup if too many are installed.

## Maintenance

| Plugin         | Update Frequency | Community Size | Reliability |
| -------------- | ---------------- | -------------- | ----------- |
| GitHub Copilot | Monthly          | Millions       | Very High   |
| JetBrains AI   | Monthly          | Large          | High        |
| Lombok         | Monthly          | Very Large     | Very High   |
| SonarQube      | Monthly          | Large          | High        |
| IdeaVim        | Quarterly        | Large          | High        |
| JPA Buddy      | Monthly          | Medium         | High        |

### Key 2026 Updates

- **IntelliJ IDEA 2026.1:** ACP Registry, next edit suggestions free, improved Kotlin/JPA, Gradle best practices
- **C/C++ Plugin:** New native C/C++ support in IntelliJ IDEA Ultimate
- **Agent Client Protocol:** Discover and install external agents (Cursor, Codex) via registry

## Hardware Impact

- **Base IDE:** 1-2GB RAM (IntelliJ IDEA)
- **Plugins:** Each plugin adds 10-100MB depending on complexity
- **AI Plugins:** Additional 200-500MB for AI language models
- **Recommendation:** Monitor via Help → Diagnostic Tools → Profile IDE; disable unused plugins

## Compatibility

- **Platforms:** Windows, macOS, Linux
- **IDEs:** IntelliJ IDEA, PyCharm, WebStorm, GoLand, CLion, Rider
- **Java:** JDK 17+ for IDE 2022.3+, JDK 21+ for IDE 2024.2+
- **Languages:** Java, Kotlin, Scala, Groovy, Python, JavaScript, TypeScript, Go, Rust, C/C++
- **AI Agents:** Cursor, Codex, Copilot via ACP Registry

## Bhavya Usefulness

**Rating: 4/5**

JetBrains IDEs are essential for teams doing Java/Kotlin/Spring development. The plugin ecosystem is mature and well-curated. The 2026 ACP Registry makes JetBrains IDEs more flexible than ever, allowing developers to bring their preferred AI tools. For Bhavya Foundation, JetBrains is the right choice for backend Java services; VS Code is better for frontend/web work.

## Reusable Ideas for GitHub OS

1. **ACP Pattern:** Agent Client Protocol as a standard for IDE-agent integration
2. **Plugin Quality Gates:** JetBrains' review process for marketplace plugins as a model
3. **Rules Enforcement:** CheckStyle + SonarQube integration pattern for automated code quality
4. **Visual Documentation:** PlantUML integration for architecture-as-code
5. **Database-First Development:** JPA Buddy pattern for visual schema-to-code workflows

## Evidence

- **Source:** https://www.docuwriter.ai/posts/intellij-idea-plugins
- **Source:** https://www.jetbrains.com/idea/whatsnew/2026-1/
- **Source:** https://www.besthub.dev/articles/top-intellij-idea-plugins-for-2026-boost-your-java-development-efficiency-f5d981d3f6de
- **Source:** https://javaworldmag.com/java-developers-toolbox-essential-vs-code-intellij-plugins/
- **Date collected:** 2026-08-03
- **Why it matters:** JetBrains IDEs dominate enterprise Java development; plugins directly impact team productivity
- **Trade-offs:** Premium pricing ($149-649/yr per IDE); plugins can slow startup; more fragmented than VS Code ecosystem
- **Expected value:** 25-40% productivity improvement for Java/Kotlin teams with curated plugin set
- **Maintenance burden:** Medium — IDE updates may break plugins; quarterly plugin review recommended
