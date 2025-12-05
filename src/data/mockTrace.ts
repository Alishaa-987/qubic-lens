// Rationale: This is our "Fake Backend". It mimics a decoded RPC trace.
// We define every single frame of the animation here.

export const MOCK_TRACE_DATA = [
  {
    id: 0,
    line: 1,
    type: 'CALL',
    label: 'main()',
    gas: 0,
    depth: 0,
    memory: { balance: 1000, deposits: 5000 },
    diff: null
  },
  {
    id: 1,
    line: 1,
    type: 'CALL',
    label: 'deposit(amount=100)',
    gas: 100,
    depth: 1,
    memory: { balance: 1000, deposits: 5000, amount: 100 },
    diff: null
  },
  {
    id: 2,
    line: 4,
    type: 'CHECK',
    label: 'VERIFY: amount > 0',
    gas: 150,
    depth: 1,
    memory: { balance: 1000, deposits: 5000 },
    diff: null
  },
  {
    id: 3,
    line: 7,
    type: 'WRITE',
    label: 'UPDATE: state.balance',
    gas: 250,
    depth: 1,
    memory: { balance: 1100, deposits: 5000 },
    diff: { var: 'balance', old: 1000, new: 1100 } // <--- THE GOLDEN NUGGET
  },
  {
    id: 4,
    line: 8,
    type: 'WRITE',
    label: 'UPDATE: state.totalDeposits',
    gas: 350,
    depth: 1,
    memory: { balance: 1100, deposits: 5100 },
    diff: { var: 'totalDeposits', old: 5000, new: 5100 }
  },
  {
    id: 5,
    line: 11,
    type: 'EVENT',
    label: 'EMIT: DEPOSIT_EVENT',
    gas: 500,
    depth: 1,
    memory: { balance: 1100, deposits: 5100 },
    diff: null
  },
  {
    id: 6,
    line: 12,
    type: 'RETURN',
    label: 'Execution Complete',
    gas: 510,
    depth: 0,
    memory: { balance: 1100, deposits: 5100 },
    diff: null
  }
]

export const SOURCE_CODE = `void deposit(uint64_t amount) {
    // 1. Check constraints
    // A simple guard clause to prevent zero deposits
    if (amount <= 0) return;

    // 2. Transmute State (The Core Logic)
    state.balance += amount;
    state.totalDeposits += amount;
    
    // 3. Emit Energy (Logging)
    emit_event(DEPOSIT_EVENT, amount);
}`