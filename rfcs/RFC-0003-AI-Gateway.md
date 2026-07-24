# RFC-0003 — AI Gateway Abstraction & Routing Architecture

## Status
Accepted

## Abstract
This RFC details the architecture, routing pipeline, and failover strategy for the Bhavya OS AI Gateway.

## Topology
```
Bhavya OS Apps / Agents
         │
         ▼
  AI Gateway (http://localhost:8082)
         │
 ┌───────┼───────────┬───────────┬───────────┐
 ▼       ▼           ▼           ▼           ▼
NIM  OpenRouter  DeepSeek  LM Studio   Ollama
```

## Interface Specifications

### 1. `generate(prompt, model, options)`
Generates single-turn completions, structured outputs, or tool call responses.

### 2. `chat(messages, model, options)`
Streams multi-turn chat sessions in standard SSE event-stream format.

### 3. `embed(input, model)`
Generates vector representations for RAG and semantic indexing.

### 4. `transcribe(audio_file, model)`
Transcribes audio input to text via Whisper or Riva backends.

### 5. `reason(prompt, model, budget)`
Executes extended reasoning models with thinking token extraction.

## Failover Strategy
If the primary provider returns `429 Too Many Requests` or `5xx Server Error`, the gateway automatically retries with configured fallback models (e.g., NIM → OpenRouter → DeepSeek) without client disruption.
