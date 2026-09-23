import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native';
import { formatMoney } from '../format';
import { addMove } from '../piggyApi';
import { colors, radius, spacing } from '../theme';
import { MoveType, Session } from '../types';

type Props = {
  type: MoveType;
  session: Session;
  balance: number;
  currency: string;
  onClose: () => void;
  onDone: () => void;
};

export function MoveScreen({ type, session, balance, currency, onClose, onDone }: Props) {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const puttingIn = type === 'in';

  async function submit() {
    setError('');
    setBusy(true);
    try {
      await addMove({
        code: session.code,
        memberId: session.memberId,
        memberName: session.memberName,
        type,
        amount: Number(amount.replace(',', '.')),
        note,
        currentBalance: balance,
        currency,
      });
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Pressable onPress={onClose}>
        <Text style={styles.back}>‹ Back</Text>
      </Pressable>
      <Text style={styles.emoji}>{puttingIn ? '🪙' : '💸'}</Text>
      <Text style={styles.title}>{puttingIn ? 'Put money in' : 'Take money out'}</Text>
      <Text style={styles.hint}>
        {puttingIn
          ? 'Everyone in the family will see that you added this.'
          : `Everyone will see that you took this out. Piggy has ${formatMoney(balance, currency)}.`}
      </Text>

      <TextInput
        value={amount}
        onChangeText={setAmount}
        placeholder="0.00"
        placeholderTextColor={colors.muted}
        keyboardType="decimal-pad"
        style={styles.amount}
      />
      <TextInput
        value={note}
        onChangeText={setNote}
        placeholder={puttingIn ? 'From salary, leftover shopping…' : 'Groceries, bills…'}
        placeholderTextColor={colors.muted}
        style={styles.input}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable
        style={[styles.cta, { backgroundColor: puttingIn ? colors.in : colors.out }]}
        onPress={submit}
        disabled={busy}
      >
        {busy ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={styles.ctaText}>Tell the family</Text>
        )}
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, padding: spacing.lg, justifyContent: 'center' },
  back: { color: colors.accent, fontWeight: '700', marginBottom: spacing.lg, fontSize: 16 },
  emoji: { fontSize: 48, textAlign: 'center' },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    color: colors.ink,
    marginTop: spacing.sm,
  },
  hint: {
    textAlign: 'center',
    color: colors.muted,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  amount: {
    fontSize: 40,
    fontWeight: '800',
    textAlign: 'center',
    color: colors.ink,
    marginBottom: spacing.md,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.ink,
    borderWidth: 1,
    borderColor: colors.line,
  },
  error: { color: colors.out, textAlign: 'center', marginTop: spacing.sm },
  cta: {
    marginTop: spacing.lg,
    borderRadius: radius.pill,
    paddingVertical: 16,
    alignItems: 'center',
  },
  ctaText: { color: colors.white, fontWeight: '800', fontSize: 16 },
});
