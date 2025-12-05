# 🔍 QUBIC LENS

> **X-Ray Vision for Qubic Smart Contracts.**  
> *Built for the "Hack the Future" Hackathon (Nostromo Track).*

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-DevNet_Alpha-green.svg)
![Stack](https://img.shields.io/badge/stack-Next.js_15_|_Tailwind_|_Zustand-000000.svg)

## ⚡ The Problem
Building on Qubic is powerful (bare-metal speed, 15.5M TPS), but debugging C++ smart contracts is currently **opaque**. Developers are forced to rely on "printf debugging" and guessing games to understand state changes, gas consumption, and logic errors.

## 🛠️ The Solution
**Qubic Lens** is a professional-grade observability platform. It introduces **"Time-Travel Debugging"** to the Qubic ecosystem.

Think of it as the **Redux DevTools** or **Tenderly** for Qubic.

### Key Features

*   **🐞 Time-Travel Debugger (VCR)**: Step forward and backward through transaction execution frame-by-frame.
*   **🧠 AI Insight Engine**: Real-time analysis of opcode execution and memory safety, explaining complex C++ logic in plain English.
*   **⚡ Gas & Opcode Profiling**: Visualize exactly how much QU (Energy) every line of code consumes.
*   **💾 State Diff Engine**: See the *exact* memory slots that changed during execution (Before vs. After).
*   **🌐 Network Command Center**: Live visualization of DevNet hashrate, block times, and peer latency.

---

## 🚀 Getting Started

### Prerequisites
*   Node.js 18+
*   npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/qubic-lens.git
    cd qubic-lens
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run the Development Server**
    ```bash
    npm run dev
    ```

4.  **Open the Dashboard**
    Visit [http://localhost:3000/dashboard](http://localhost:3000/dashboard) to launch the full suite.

---

## 🏗️ Architecture

Qubic Lens is built on a modern, performance-first stack:

*   **Frontend**: Next.js 15 (App Router), React 19.
*   **Styling**: TailwindCSS v4 + Shadcn UI (Custom "Cyber-Industrial" Theme).
*   **State Management**: Zustand (for high-frequency trace playback).
*   **Visualization**: Framer Motion (for fluid state transitions).
*   **Data Layer**: Custom Mock RPC Bridge (simulating decoded C++ traces).

---

## 🔮 Roadmap (Post-Hackathon)

*   [ ] **WASM Integration**: Run the Qubic C++ emulator directly in the browser for live compiling.
*   [ ] **Mainnet Bridge**: Connect to live public nodes for real-time transaction replay.
*   [ ] **Source Mapping**: Upload your original `.cpp` file to map bytecode back to source lines automatically.

---

## 🏆 Hackathon Context

This project specifically targets the **Developer Tooling** gap in the Qubic ecosystem. By lowering the barrier to entry for debugging, we enable more developers to build complex financial and logistical contracts with confidence.

---

*Built with 💙 and C++ tears.*
