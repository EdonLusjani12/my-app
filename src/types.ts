export type MoveType = 'in' | 'out';

export type Member = {
  name: string;
  joinedAt: number;
};

export type Transaction = {
  type: MoveType;
  amount: number;
  note: string;
  memberId: string;
  memberName: string;
  createdAt: number;
};

export type Piggy = {
  name: string;
  currency: string;
  createdAt: number;
  members: Record<string, Member>;
  transactions?: Record<string, Transaction>;
};

export type Session = {
  code: string;
  memberId: string;
  memberName: string;
};
