# 🚀 Hyperion: Project Requirements Document (PRD)

## 📌 Project Overview
Hyperion is a **local, self-contained, Urbit-like system** optimized for **LLMs to write and debug scripts and text files**. It leverages **TypeScript (Deno) for the core event system** and **Python for AI/ML tasks**, ensuring a **sandboxed, event-driven** environment for safe execution of **LLM-generated scripts**.

Additionally, Hyperion is **optimized for voice interaction**, allowing users to **dictate** script instructions. The LLM will:
- Convert natural language into scripts.
- Perform initial debugging and provide **high-level status updates**.
- Execute scripts when commanded and **report results via voice**.

---

## 🎯 Objectives
✔️ **Self-contained, local runtime** (no cloud dependency).  
✔️ **Event-driven architecture** for managing script execution.  
✔️ **Safe, sandboxed execution** for LLM-generated scripts.  
✔️ **Observability & debugging tools** (time-travel debugging, snapshots).  
✔️ **AI/ML processing** for intelligent script generation & analysis.  
✔️ **Full voice-driven operation**, from script creation to execution.  

---

## 🏗️ System Architecture
| Component                 | Technology                          | Description |
|---------------------------|-----------------------------------|-------------|
| **Core Event System**      | TypeScript (Deno)                 | Manages event-driven execution, script lifecycle, and state tracking. |
| **Script Execution Layer** | WebAssembly (Wasm) + Deno Sandbox | Ensures deterministic and secure execution of LLM-generated scripts. |
| **Reactive State Mgmt**    | RxJS (FRP Streams) + Automerge (CRDTs) | Tracks file/script changes as event streams and supports rollback. |
| **AI/ML Processing**       | Python (Ollama, LangChain, Pyodide) | Handles AI-powered script generation and analysis. |
| **IPC (Inter-process Comm.)** | WebSockets, JSON-RPC, gRPC       | Enables efficient communication between TypeScript & Python. |
| **Observability & Debugging** | Event logs, time-travel debugging | Provides traceability & versioning for script execution. |
| **User Interface**         | TUI (Terminal UI) + Optional Web UI | Allows local interaction with the system. |
| **Voice Processing**       | Whisper (OpenAI) / Coqui.ai / ElevenLabs | Converts voice commands into text & provides spoken feedback. |

---

## 🗣️ Voice Interface Integration
### 🔄 How It Works
1. **User dictates a command** (e.g., “Create a script to rename all `.txt` files to `.md`”).
2. **LLM processes the request** into a structured script (TypeScript, Python, or DSL).
3. **LLM attempts initial debugging**:
   - Runs **static analysis** for syntax and logic errors.
   - Suggests **improvements** if needed.
4. **User receives voice feedback**:
   - Status updates on script generation & execution.
   - Error summaries & possible fixes.
5. **LLM executes scripts on command**, monitors execution, and reports results via voice.

---

## 🔄 Development Plan

The project will be developed in **five phases**, each with deliverables and milestones.

### **Phase 1: Core System Setup (2-3 Weeks)**
- [x] **Set up a Deno-based TypeScript environment.**  
- [x] **Implement basic event-driven architecture using RxJS.**  
- [ ] **Establish sandboxed script execution using WebAssembly.**  
- [ ] **Define basic CLI commands for running scripts.**  
🔹 **Milestone:** Working event loop with safe script execution.

### **Phase 2: AI Processing Engine (3-4 Weeks)**
- [ ] **Set up a Python microservice or subprocess model.**  
- [ ] **Implement basic LLM integration for script generation.**  
- [ ] **Establish IPC (WebSockets or JSON-RPC) for communication between TypeScript & Python.**  
- [ ] **Create basic AI-assisted debugging (e.g., explain script errors).**  
🔹 **Milestone:** AI-assisted script execution pipeline in place.

### **Phase 3: Voice Interface & Processing (4 Weeks)**
- [ ] **Integrate Whisper (or another STT model) for voice-to-text conversion.**  
- [ ] **Use LLM to process natural language & generate scripts.**  
- [ ] **Implement pre-execution debugging (static analysis, potential issues).**  
- [ ] **Add high-level spoken feedback for user interaction.**  
🔹 **Milestone:** Voice commands successfully converted into structured scripts with debugging feedback.

### **Phase 4: Observability & Debugging (3 Weeks)**
- [ ] **Implement structured logging & event snapshots.**  
- [ ] **Add time-travel debugging (ability to replay events).**  
- [ ] **Integrate change-tracking using CRDTs (Automerge) for scripts.**  
🔹 **Milestone:** Reproducible script execution with debugging support.

### **Phase 5: User Interface & Interaction (4 Weeks)**
- [ ] **Build a TUI (Terminal UI) for interaction.**  
- [ ] **Implement graph-based visualization of script dependencies.**  
- [ ] **Add optional Web UI (React/Svelte) for better UX.**  
🔹 **Milestone:** Usable local interface for managing scripts and AI interactions.

---

## 🚀 Future Enhancements
- [ ] **Networked Peer-to-Peer Mode** (like Urbit, but optional).  
- [ ] **Custom DSL for AI Automation** (a simple scripting language for LLM workflows).  
- [ ] **Plugins & Extensions** (allow third-party contributions).  

---

## 📜 License
**Hyperion** is an open-source project. License details coming soon.

