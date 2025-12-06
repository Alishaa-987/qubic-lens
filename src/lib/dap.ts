// Rationale: Conforming to Microsoft's Debug Adapter Protocol (DAP)
// Spec: https://microsoft.github.io/debug-adapter-protocol/specification

export namespace DAP {
    
    // Base Message
    export interface ProtocolMessage {
        seq: number
        type: 'request' | 'response' | 'event'
    }

    // ==========================================
    // EVENTS (Server -> Client)
    // ==========================================
    
    export interface StoppedEvent extends ProtocolMessage {
        type: 'event'
        event: 'stopped'
        body: {
            reason: 'step' | 'breakpoint' | 'exception' | 'pause'
            threadId?: number
            description?: string
            text?: string
        }
    }

    // ==========================================
    // TYPES (Data Structures)
    // ==========================================

    export interface Thread {
        id: number
        name: string
    }

    export interface StackFrame {
        id: number
        name: string
        source?: Source
        line: number
        column: number
        instructionPointerReference?: string
    }

    export interface Source {
        name: string
        path?: string
        sourceReference?: number
    }

    export interface Scope {
        name: string
        variablesReference: number // Pointer to variables
        namedVariables?: number
        expensive: boolean
    }

    export interface Variable {
        name: string
        value: string
        type?: string
        variablesReference: number
    }

    // ==========================================
    // REQUESTS (Client -> Server)
    // ==========================================

    export interface Request extends ProtocolMessage {
        type: 'request'
        command: string
    }

    export interface NextRequest extends Request {
        command: 'next'
        arguments: {
            threadId: number
        }
    }

    export interface StackTraceRequest extends Request {
        command: 'stackTrace'
        arguments: {
            threadId: number
        }
    }

    export interface ScopesRequest extends Request {
        command: 'scopes'
        arguments: {
            frameId: number
        }
    }

    export interface VariablesRequest extends Request {
        command: 'variables'
        arguments: {
            variablesReference: number
        }
    }
}