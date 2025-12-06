// src/types/engine.d.ts

// 1. The Static Context (The "Cartridge")
export interface SourceArtifact {
    fileName: string;
    code: string; // The raw C++ text
    compilerVersion?: string;
}

// 2. The Dynamic Frame (One step in time)
export interface ExecutionFrame {
    id: number;           // Sequence number
    line: number;         // Line number in source
    type: string;         // e.g., 'CALL', 'OPCODE', 'EVENT'
    gasCost: number;      // Gas used in this specific step
    gasTotal: number;     // Cumulative gas
    depth: number;        // Call stack depth
    memory: Record<string, any>; // Snapshot of variables
    stack: string[];      // Raw stack values
    
    // Optional diagnostics
    error?: string;       
    logs?: string[];
}

// 3. The Complete Session (What the Store holds)
export interface TraceSession {
    txHash: string;
    timestamp: number;
    artifact: SourceArtifact;
    frames: ExecutionFrame[];
    
    // Computed metadata
    totalGas: number;
    status: 'SUCCESS' | 'REVERT' | 'PANIC';
}