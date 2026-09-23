import { initializeApp, getApps } from 'firebase/app';
import { get, getDatabase, onValue, push, ref, set, Unsubscribe } from 'firebase/database';
import { firebaseConfig } from './firebaseConfig';
import { formatMoney, roundMoney } from './format';
import { memberId, normalizeCode, piggyCode } from './ids';
import { Piggy, Session, Transaction } from './types';

function db() {
  const app = getApps()[0] ?? initializeApp(firebaseConfig);
  return getDatabase(app);
}

export type PiggyView = {
  code: string;
  name: string;
  currency: string;
  balance: number;
  members: { id: string; name: string; joinedAt: number }[];
  transactions: (Transaction & { id: string })[];
};

export function toPiggyView(code: string, data: Piggy | null): PiggyView | null {
  if (!data) return null;
  const transactions = Object.entries(data.transactions ?? {})
    .map(([id, tx]) => ({ id, ...tx }))
    .sort((a, b) => b.createdAt - a.createdAt);
  const balance = roundMoney(
    transactions.reduce((sum, tx) => sum + (tx.type === 'in' ? tx.amount : -tx.amount), 0)
  );
  const members = Object.entries(data.members ?? {}).map(([id, member]) => ({
    id,
    name: member.name,
    joinedAt: member.joinedAt,
  }));
  return {
    code,
    name: data.name,
    currency: data.currency || 'EUR',
    balance,
    members,
    transactions,
  };
}

export async function createPiggy(input: {
  piggyName: string;
  memberName: string;
  currency: string;
}): Promise<Session> {
  const code = piggyCode();
  const id = memberId();
  const piggy: Piggy = {
    name: input.piggyName.trim(),
    currency: input.currency,
    createdAt: Date.now(),
    members: {
      [id]: { name: input.memberName.trim(), joinedAt: Date.now() },
    },
  };
  await set(ref(db(), `piggies/${code}`), piggy);
  return { code, memberId: id, memberName: input.memberName.trim() };
}

export async function joinPiggy(input: { code: string; memberName: string }): Promise<Session> {
  const code = normalizeCode(input.code);
  if (code.length < 4) {
    throw new Error('Enter the family code.');
  }
  const snapshot = await get(ref(db(), `piggies/${code}`));
  if (!snapshot.exists()) {
    throw new Error('No piggy bank uses that code.');
  }
  const id = memberId();
  await set(ref(db(), `piggies/${code}/members/${id}`), {
    name: input.memberName.trim(),
    joinedAt: Date.now(),
  });
  return { code, memberId: id, memberName: input.memberName.trim() };
}

export function subscribePiggy(
  code: string,
  onData: (view: PiggyView | null) => void,
  onError?: (message: string) => void
): Unsubscribe {
  return onValue(
    ref(db(), `piggies/${code}`),
    (snapshot) => {
      onData(toPiggyView(code, snapshot.val() as Piggy | null));
    },
    (error) => {
      onError?.(error.message);
    }
  );
}

export async function addMove(input: {
  code: string;
  memberId: string;
  memberName: string;
  type: 'in' | 'out';
  amount: number;
  note: string;
  currentBalance: number;
  currency: string;
}): Promise<void> {
  const amount = roundMoney(input.amount);
  if (!(amount > 0)) {
    throw new Error('Enter an amount greater than 0.');
  }
  if (input.type === 'out' && amount > input.currentBalance + 0.0001) {
    throw new Error(
      `The piggy only has ${formatMoney(input.currentBalance, input.currency)}.`
    );
  }
  const transaction: Transaction = {
    type: input.type,
    amount,
    note: input.note.trim(),
    memberId: input.memberId,
    memberName: input.memberName,
    createdAt: Date.now(),
  };
  await push(ref(db(), `piggies/${input.code}/transactions`), transaction);
}
