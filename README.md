[![DREAM ON -- with Lloyd](https://img.youtube.com/vi/ElTHdSkNw_0/0.jpg)](https://www.youtube.com/watch?v=ElTHdSkNw_0)


# HYPERION: **Project Requirements Document (PRD)**

## **Owner:** ~poldec-tonteg  

---

## **1. Overview**
This project is a **local, self-contained, Urbit-like system optimized for LLMs** to write and debug scripts and text files. It will leverage **TypeScript (Deno) for the core event system** and **Python for AI/ML tasks**, ensuring a sandboxed, event-driven environment for safe execution and debugging of LLM-generated scripts.

Additionally, the system is optimized for **voice interaction**, allowing users to **dictate** script instructions to the LLM. The LLM will:
- Convert natural language into scripts.
- Perform initial debugging and provide high-level status updates.
- Execute scripts when commanded and report back results using voice.

---

## **2. Objectives**
- **Create a self-contained, local runtime** that does not depend on external cloud services.
- **Provide an FRP-inspired, event-driven architecture** to manage script execution and state transitions.
- **Enable LLMs to write, execute, and debug scripts safely** within a controlled environment.
- **Ensure strong observability and debugging tools**, including time-travel debugging and event snapshots.
- **Support Python-based AI/ML processing** for intelligent script generation and analysis.
- **Enable full voice-driven operation**, from script creation to execution and debugging.

---

## **3. Hyperion User Stories**

1. As a User, I would like to use speech only to interact with an LLM that will write a simple note taking app on my behalf.
  1. *Assume hyperion is running*
  2. I ask Hyperion to help me build a simple note taking app whose state would be legible to me as text files as well as manipulable by the LLM.
  3. After some discussion, we determine that such an application is beyond the capabiliity of the LLM as is because it requires reads and writes from the file system, which it doesn't have.
  4. Hyperion asks me if I'd like work on an application that would fulfill this purpose? I answer in the affirmative
  5. It breaks the logic into discrete steps that can be developed as scripts and suggests that we go through them one by one. I agree.
  6. We go through the necessary scripts to create a simple CRUD app. As each script is written, we develop a simple unit test that verifies the correctness of the script.
  7. Once we've written all of the scripts, we write some e2e tests, which hyperion runs. Hyperion tells me that everything is green.
  8. I use the app by requesting that hyperion find an existing note, update it before copying it and making a new one.

---

## **4. System Architecture**
### **4.1 Core Components**

| Component                             | Technology                                   | Description                                                               |
| ------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------- |
| **Core Event System (live)**                 | **TypeScript (Deno)**                        | Manages event-driven execution, script lifecycle, and state tracking.     |
| **Script Execution Layer (build)**            | **Wasm (WebAssembly) + Deno sandboxing**     | Ensures deterministic and secure execution of LLM-generated scripts.      |
| **Reactive State Management (ee)**         | **RxJS (FRP Streams) + Automerge (CRDTs)**   | Tracks file/script changes as event streams and supports rollback.        |
| **AI/ML Processing (tool)**                  | **Python (LLMs, LangChain, Pyodide)**        | Handles AI-powered script generation and analysis.                        |
| **Inter-process Communication (go)** | **WebSockets, JSON-RPC, or gRPC**            | Enables secure and efficient communication between TypeScript and Python. |
| **Observability & Debugging (zen)**         | **Event logs, time-travel debugging**        | Provides traceability and versioning for script execution.                |
| **User Interface (frame)**                    | **TUI (Terminal UI) + Optional Web UI**      | Allows local interaction with the system.                                 |
| **Voice Processing (STT & TTS) (speak)**      | **Whisper (OpenAI) / Coqui.ai / ElevenLabs** | Converts voice commands into text and provides spoken feedback.           |

---

## **5. Voice Interface Integration**

### **5.1 How It Works**
1. **User dictates a command** (e.g., “Create a script that renames all `.txt` files to `.md` in a folder”).
2. **LLM processes the request** into a structured script (TypeScript, Python, or DSL).
3. **LLM attempts initial debugging** before execution:
   - Runs static analysis for syntax and logic errors.
   - Suggests improvements if needed.
4. **User receives voice-based feedback**:
   - Status updates on script generation and execution.
   - Error summaries and possible fixes.
   - Progress reports in natural language.
5. **LLM can execute scripts on command**, monitor their execution, and report results via voice.

### **5.2 Interaction Flow**
1. **Voice-to-text conversion** using Whisper or Vosk.
2. **Natural language interpretation** via LLM.
3. **Event-driven execution** of generated scripts.
4. **Real-time voice feedback on execution status.**
5. **Voice-triggered script modifications and reruns.**

---

## **6. Development Plan**
The project will be developed in **five phases**, each with deliverables and milestones.

### **Phase 1: Core System Setup (2-3 Weeks)**
✅ **Deliverables:**
- [x] Set up a **Deno-based TypeScript environment**.
- [x] Implement **basic event-driven architecture** using RxJS.
- [ ] Establish **sandboxed script execution** using WebAssembly.
- [ ] Define **basic CLI commands** for running scripts.

🔹 **Milestone:** Working event loop with safe script execution.

---

### **Phase 2: AI Processing Engine (3-4 Weeks)**
✅ **Deliverables:**
1. Set up a **Python microservice or subprocess model**.
2. Implement **basic LLM integration** for script generation.
3. Establish **IPC (WebSockets or JSON-RPC) for communication** between TypeScript and Python.
4. Create **basic AI-assisted debugging** (e.g., explain script errors).

🔹 **Milestone:** AI-assisted script execution pipeline in place.

---

### **Phase 3: Voice Interface & Processing (4 Weeks)**
✅ **Deliverables:**
1. Integrate **Whisper (or another STT model)** for converting voice to text.
2. Use **LLM to process natural language** and generate scripts.
3. Implement **pre-execution debugging** (static analysis, potential issues).
4. Add **high-level spoken feedback** for user interaction.

🔹 **Milestone:** Voice commands successfully converted into structured scripts with debugging feedback.

---

### **Phase 4: Observability & Debugging (3 Weeks)**
✅ **Deliverables:**
1. Implement **structured logging and event snapshots**.
2. Add **time-travel debugging** (ability to replay events).
3. Integrate **change-tracking using CRDTs (Automerge)** for scripts.

🔹 **Milestone:** Reproducible script execution with debugging support.

---

### **Phase 5: User Interface & Interaction (4 Weeks)**
✅ **Deliverables:**
1. Build a **TUI (Terminal UI) for interaction**.
2. Implement **graph-based visualization** of script dependencies.
3. Add **optional Web UI (React/Svelte) for better UX**.

🔹 **Milestone:** Usable local interface for managing scripts and AI interactions.

