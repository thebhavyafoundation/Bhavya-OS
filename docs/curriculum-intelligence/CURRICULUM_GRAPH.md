# Curriculum Graph

## Overview

The Curriculum Graph represents knowledge as a directed acyclic graph. Every concept has prerequisites, dependents, and associated learning materials.

## Graph Structure

### Core AI Foundations

```
计算机科学基础
    │
    ▼
编程基础 (Python)
    │
    ▼
数据结构与算法
    │
    ▼
机器学习基础
    │
    ▼
深度学习基础
    │
    ▼
自然语言处理基础
    │
    ▼
大型语言模型 (LLMs)
    │
    ▼
提示工程
    │
    ▼
AI代理
    │
    ▼
模型上下文协议 (MCP)
    │
    ▼
浏览器自动化
    │
    ▼
知识系统
    │
    ▼
开源贡献
    │
    ▼
生产部署
    │
    ▼
AI产品开发
```

### Detailed Node Map

#### Node: 大型语言模型 (LLMs)

**Prerequisites:**

- 机器学习基础
- 深度学习基础
- 自然语言处理基础

**Dependent Topics:**

- 提示工程
- AI代理
- MCP
- 浏览器自动化

**Recommended Projects:**

- 构建聊天机器人
- 文本生成应用
- 代码生成工具

**Recommended Labs:**

- LLM API交互
- 提示工程实验
- 模型比较

**Recommended Knowledge Packages:**

- KP-AI-001: 什么是LLM?
- KP-AI-002: LLM如何工作?
- KP-AI-003: LLM API交互

**Competency Mapping:**

- 理解AI核心概念
- API集成能力
- 问题解决能力

#### Node: 提示工程

**Prerequisites:**

- 大型语言模型 (LLMs)

**Dependent Topics:**

- AI代理
- MCP

**Recommended Projects:**

- 提示库
- 提示优化工具
- 提示模板系统

**Recommended Labs:**

- 提示工程游乐场
- 提示比较实验
- 提示优化挑战

**Recommended Knowledge Packages:**

- KP-AI-004: 提示工程基础
- KP-AI-005: 高级提示技术
- KP-AI-006: 提示评估

**Competency Mapping:**

- 有效沟通能力
- 问题分解能力
- 创意思维能力

#### Node: AI代理

**Prerequisites:**

- 大型语言模型 (LLMs)
- 提示工程

**Dependent Topics:**

- MCP
- 浏览器自动化

**Recommended Projects:**

- 个人AI助手
- 任务自动化代理
- 研究代理

**Recommended Labs:**

- 代理开发环境
- 工具集成
- 代理协作

**Recommended Knowledge Packages:**

- KP-AI-007: 什么是AI代理?
- KP-AI-008: 代理架构
- KP-AI-009: 工具集成

**Competency Mapping:**

- 系统设计能力
- 自动化能力
- 问题解决能力

#### Node: 模型上下文协议 (MCP)

**Prerequisites:**

- 大型语言模型 (LLMs)
- AI代理

**Dependent Topics:**

- 浏览器自动化

**Recommended Projects:**

- MCP服务器
- MCP客户端
- MCP集成应用

**Recommended Labs:**

- MCP服务器设置
- MCP客户端开发
- MCP工具集成

**Recommended Knowledge Packages:**

- KP-AI-010: 什么是MCP?
- KP-AI-011: MCP服务器开发
- KP-AI-012: MCP客户端开发

**Competency Mapping:**

- 协议设计能力
- 系统集成能力
- 工具开发能力

#### Node: 浏览器自动化

**Prerequisites:**

- AI代理
- MCP

**Dependent Topics:**

- 真实项目

**Recommended Projects:**

- 网页抓取工具
- 表单自动填充
- 网页测试自动化

**Recommended Labs:**

- 你的第一个浏览器自动化
- 高级网页交互
- 自动化工作流

**Recommended Knowledge Packages:**

- KP-AI-013: 浏览器自动化基础
- KP-AI-014: 高级自动化技术
- KP-AI-015: 自动化最佳实践

**Competency Mapping:**

- 自动化能力
- 问题解决能力
- 技术集成能力

## Graph Properties

### Directed

Edges have direction. Prerequisites must come before dependents.

### Acyclic

No cycles. You can't need A to learn B and B to learn A.

### Weighted

Edges have weights representing strength of relationship.

### Typed

Nodes have types (concept, skill, project, assessment).

### Versioned

Graph evolves over time with version tracking.

## Graph Operations

### Traversal

- Find all prerequisites for a topic
- Find all dependents of a topic
- Find learning path between topics
- Find shortest learning path

### Analysis

- Identify critical path
- Identify bottlenecks
- Identify optional paths
- Identify parallel opportunities

### Evolution

- Add new nodes
- Add new edges
- Remove obsolete nodes
- Update relationships

## Graph Visualization

### Student View

- Simple, linear path
- Clear prerequisites
- Visible progress
- Portfolio integration

### Mentor View

- Complete graph
- Multiple paths
- Assessment criteria
- Teaching notes

### Administrator View

- Graph analytics
- Coverage analysis
- Gap identification
- Evolution tracking
