import { Alert, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { formatMoney, timeAgo } from '../format';
import { PiggyView } from '../piggyApi';
import { colors, radius, spacing } from '../theme';

type Props = {
  piggy: PiggyView;
  memberName: string;
  onPutIn: () => void;
  onTakeOut: () => void;
};

export function HomeScreen({ piggy, memberName, onPutIn, onTakeOut }: Props) {
  const recent = piggy.transactions.slice(0, 4);

  async function shareCode() {
    await Share.share({
      message: `Join our family piggy bank "${piggy.name}" in Family Piggy. Code: ${piggy.code}`,
    });
  }

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.hello}>Hi {memberName}</Text>
      <Text style={styles.piggyName}>{piggy.name}</Text>

      <View style={styles.card}>
        <Text style={styles.pig}>🐷</Text>
        <Text style={styles.label}>In the piggy now</Text>
        <Text style={styles.balance}>{formatMoney(piggy.balance, piggy.currency)}</Text>
        <Pressable onPress={shareCode} style={styles.codeChip}>
          <Text style={styles.codeText}>Family code {piggy.code}</Text>
        </Pressable>
        <Text style={styles.members}>
          {piggy.members.length} {piggy.members.length === 1 ? 'person' : 'people'} sharing
          {' · '}
          {piggy.members.map((m) => m.name).join(', ')}
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable style={[styles.action, styles.inBtn]} onPress={onPutIn}>
          <Text style={styles.actionTitle}>Put money in</Text>
          <Text style={styles.actionHint}>Tell the family you added cash</Text>
        </Pressable>
        <Pressable
          style={[styles.action, styles.outBtn]}
          onPress={() => {
            if (piggy.balance <= 0) {
              Alert.alert('Empty piggy', 'There is no money to take out yet.');
              return;
            }
            onTakeOut();
          }}
        >
          <Text style={styles.actionTitle}>Take money out</Text>
          <Text style={styles.actionHint}>Tell the family you used some</Text>
        </Pressable>
      </View>

      <Text style={styles.section}>Latest</Text>
      {recent.length === 0 ? (
        <Text style={styles.empty}>Nothing yet. Put the first coins in.</Text>
      ) : (
        recent.map((tx) => (
          <View key={tx.id} style={styles.row}>
            <View
              style={[
                styles.dot,
                { backgroundColor: tx.type === 'in' ? colors.in : colors.out },
              ]}
            />
            <View style={styles.rowBody}>
              <Text style={styles.rowTitle}>
                {tx.memberName} {tx.type === 'in' ? 'put in' : 'took out'}
              </Text>
              <Text style={styles.rowMeta}>
                {tx.note || 'No note'} · {timeAgo(tx.createdAt)}
              </Text>
            </View>
            <Text
              style={[
                styles.rowAmount,
                { color: tx.type === 'in' ? colors.in : colors.out },
              ]}
            >
              {tx.type === 'in' ? '+' : '−'}
              {formatMoney(tx.amount, piggy.currency)}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: 120 },
  hello: { color: colors.muted, fontSize: 16 },
  piggyName: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.line,
  },
  pig: { fontSize: 56, marginBottom: spacing.xs },
  label: { color: colors.muted, fontWeight: '600' },
  balance: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.ink,
    marginVertical: spacing.xs,
  },
  codeChip: {
    backgroundColor: '#FBE0E4',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    marginTop: spacing.sm,
  },
  codeText: { fontWeight: '800', color: colors.pigDeep, letterSpacing: 0.6 },
  members: {
    marginTop: spacing.sm,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 20,
  },
  actions: { marginTop: spacing.md, gap: spacing.sm },
  action: {
    borderRadius: radius.md,
    padding: spacing.md,
  },
  inBtn: { backgroundColor: colors.inSoft },
  outBtn: { backgroundColor: colors.outSoft },
  actionTitle: { fontWeight: '800', fontSize: 16, color: colors.ink },
  actionHint: { color: colors.muted, marginTop: 2 },
  section: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    fontWeight: '800',
    color: colors.ink,
    fontSize: 18,
  },
  empty: { color: colors.muted },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.line,
  },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  rowBody: { flex: 1 },
  rowTitle: { fontWeight: '700', color: colors.ink },
  rowMeta: { color: colors.muted, marginTop: 2, fontSize: 13 },
  rowAmount: { fontWeight: '800' },
});
