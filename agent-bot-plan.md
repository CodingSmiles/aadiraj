# Agent Bot Plan: PDF/Website Knowledge + Voice Conversation

## Goal
Build a personal assistant that learns from PDFs or websites and holds voice conversations with answers grounded in the source repository content.

## Core Capabilities
- **Ingest sources:** Upload PDF(s) or provide website URLs.
- **Index knowledge:** Extract text, chunk it, and store embeddings in a vector database.
- **Grounded responses:** Use retrieval-augmented generation (RAG) to answer only from indexed sources.
- **Voice interface:** Speech-to-text (STT) for input and text-to-speech (TTS) for responses.
- **Conversation memory:** Maintain short-term context while citing or summarizing sources.

## Suggested Architecture
### 1) Ingestion & Processing
- **PDF pipeline:**
  - Extract text from PDF.
  - Normalize whitespace, remove headers/footers if needed.
  - Chunk by sections or fixed token size (e.g., 500–1,000 tokens with overlap).
- **Website pipeline:**
  - Fetch content, remove boilerplate, extract readable text.
  - Respect robots.txt and rate limits.
  - Chunk similarly to PDF pipeline.

### 2) Embeddings & Vector Store
- Generate embeddings for each chunk.
- Store embeddings and metadata (source URL/file, page, section) in a vector database.
- When asked a question, retrieve the most relevant chunks.

### 3) Retrieval-Augmented Generation (RAG)
- Combine retrieved chunks with the user’s question.
- Use a system prompt that **restricts answers to retrieved sources**.
- Optionally provide inline citations from chunk metadata.

### 4) Voice Conversation Layer
- **STT:** Convert user audio to text.
- **TTS:** Convert model output to audio.
- **Streaming:** Stream audio responses for a more conversational experience.

## Recommended Tech Stack (Example)
- **Backend:** Python + FastAPI
- **Embeddings:** OpenAI or local embeddings (e.g., sentence-transformers)
- **Vector DB:** FAISS (local), Chroma, or Pinecone
- **RAG Orchestration:** Lightweight custom pipeline or frameworks like LangChain/LlamaIndex
- **STT:** OpenAI Whisper or Deepgram
- **TTS:** ElevenLabs, OpenAI TTS, or Coqui TTS
- **Frontend:** Minimal web app with microphone input + audio output

## Data Flow
1. User uploads PDF or enters website URL.
2. Server extracts, chunks, and embeds content.
3. Vector DB stores embeddings + metadata.
4. User asks a question by voice.
5. STT converts voice to text.
6. RAG retrieves relevant chunks and generates a grounded response.
7. TTS converts the answer to speech and streams it back.

## Safety & Quality
- **Grounding:** Never answer without relevant chunks; ask follow-up questions if retrieval is weak.
- **Source citations:** Provide page numbers or URLs where possible.
- **Privacy:** Store user data locally or encrypt at rest if hosted.

## MVP Milestones
1. **Text-only RAG demo** (PDF + website ingestion, Q&A in text).
2. **Add STT + TTS** for voice input/output.
3. **UI polish** (conversation history, source citations, upload status).
4. **Performance tuning** (better chunking, caching, retrieval filters).

## Stretch Goals
- Multi-document collections with tags and filters.
- User-specific memory (preferences, frequently asked topics).
- Offline mode (local embeddings + local TTS/STT).
- Fine-grained permissions and access control.
