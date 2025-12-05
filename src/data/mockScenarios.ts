// Rationale: A "Database" of distinct debugging scenarios.
// 1. DEPOSIT (Success)
// 2. WITHDRAW (Fail - Insufficient Funds)
// 3. AIRDROP (High Gas Loop)

export interface TraceFrame {
    id: number
    line: number
    type: string
    label: string
    gas: number
    depth: number
    address: string
    memory: Record<string, any>
    diff: { var: string; old: any; new: any } | null
    stack: string[]
    aiAnalysis: string
    isError?: boolean
}

export const SCENARIOS: Record<string, { code: string; trace: TraceFrame[] }> = {
    // SCENARIO 1: The Happy Path (Deposit)
    '0x8f...2a': {
        code: `void deposit(uint64_t amount) {
    // 1. Check constraints
    if (amount <= 0) return;

    // 2. Transmute State
    state.balance += amount;
    state.totalDeposits += amount;
    
    // 3. Emit Energy
    emit_event(DEPOSIT_EVENT, amount);
}`,
        trace: [
            { id: 0, line: 1, type: 'CALL', label: 'deposit(100)', gas: 2100, depth: 0, address: '0x4f...01', memory: { balance: 1000 }, diff: null, stack: [], aiAnalysis: "Initializing deposit sequence." },
            { id: 1, line: 4, type: 'CHECK', label: 'VERIFY: amount > 0', gas: 2150, depth: 1, address: '0x4f...02', memory: { balance: 1000 }, diff: null, stack: ['100'], aiAnalysis: "Constraint check passed." },
            { id: 2, line: 7, type: 'WRITE', label: 'UPDATE: balance', gas: 2400, depth: 1, address: '0x4f...03', memory: { balance: 1100 }, diff: { var: 'balance', old: 1000, new: 1100 }, stack: [], aiAnalysis: "State mutation: Balance increased." },
            { id: 3, line: 8, type: 'WRITE', label: 'UPDATE: totalDeposits', gas: 2650, depth: 1, address: '0x4f...04', memory: { balance: 1100, deposits: 5100 }, diff: { var: 'deposits', old: 5000, new: 5100 }, stack: [], aiAnalysis: "State mutation: Global deposits updated." },
            { id: 4, line: 11, type: 'EVENT', label: 'EMIT: DEPOSIT', gas: 3100, depth: 0, address: '0x4f...05', memory: { balance: 1100 }, diff: null, stack: [], aiAnalysis: "Success event emitted." }
        ]
    },

    // SCENARIO 2: The Failure (Withdraw too much)
    '0x9c...bb': {
        code: `void withdraw(uint64_t amount) {
    // 1. Check constraints
    if (amount > state.balance) {
        throw_error("INSUFFICIENT_FUNDS");
    }

    // 2. Deduct
    state.balance -= amount;
}`,
        trace: [
            { id: 0, line: 1, type: 'CALL', label: 'withdraw(5000)', gas: 1500, depth: 0, address: '0x7a...01', memory: { balance: 1000 }, diff: null, stack: [], aiAnalysis: "Attempting to withdraw 5000 QU." },
            { id: 1, line: 3, type: 'CHECK', label: 'VERIFY: 5000 > 1000', gas: 1600, depth: 1, address: '0x7a...02', memory: { balance: 1000 }, diff: null, stack: ['5000', '1000'], aiAnalysis: "CRITICAL ALERT: Withdrawal amount exceeds balance." },
            { id: 2, line: 4, type: 'REVERT', label: 'ERROR: INSUFFICIENT_FUNDS', gas: 1650, depth: 1, address: '0x7a...03', memory: { balance: 1000 }, diff: null, stack: [], aiAnalysis: "Execution halted. Transaction reverted due to logic error.", isError: true }
        ]
    },

    // SCENARIO 3: High Gas Loop (Airdrop)
    '0x3d...ff': {
        code: `void airdrop(uint64_t users[]) {
    // Loop through users
    for(int i=0; i<3; i++) {
        state.balance -= 10;
        emit_event(SENT, users[i]);
    }
}`,
        trace: [
            { id: 0, line: 1, type: 'CALL', label: 'airdrop([A,B,C])', gas: 5000, depth: 0, address: '0x2b...01', memory: { balance: 1000, i: 0 }, diff: null, stack: [], aiAnalysis: "Batch operation started." },
            { id: 1, line: 3, type: 'LOOP', label: 'ITERATION i=0', gas: 5200, depth: 1, address: '0x2b...02', memory: { balance: 990, i: 0 }, diff: { var: 'balance', old: 1000, new: 990 }, stack: [], aiAnalysis: "Processing User A." },
            { id: 2, line: 3, type: 'LOOP', label: 'ITERATION i=1', gas: 5400, depth: 1, address: '0x2b...03', memory: { balance: 980, i: 1 }, diff: { var: 'balance', old: 990, new: 980 }, stack: [], aiAnalysis: "Processing User B." },
            { id: 3, line: 3, type: 'LOOP', label: 'ITERATION i=2', gas: 5600, depth: 1, address: '0x2b...04', memory: { balance: 970, i: 2 }, diff: { var: 'balance', old: 980, new: 970 }, stack: [], aiAnalysis: "Processing User C." },
            { id: 4, line: 5, type: 'RETURN', label: 'Batch Complete', gas: 6000, depth: 0, address: '0x2b...05', memory: { balance: 970 }, diff: null, stack: [], aiAnalysis: "Loop finished. High gas consumption detected." }
        ]
    }
}