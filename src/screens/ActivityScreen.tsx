import { FlatList, StyleSheet, Text, View } from 'react-native';
import { formatMoney, timeAgo } from '../format';
import { PiggyView } from '../piggyApi';
import { colors, radius, spacing } from '../theme';

type Props = {
  piggy: PiggyView;
};

export function ActivityScreen({ piggy }: Props) {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Family activity</Text>
      <Text style={styles.subtitle}>Every put-in and take-out, as it happens.</Text>
      <FlatList
        data={piggy.transactions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>The piggy is quiet. Make the first move.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View
              style={[
                styles.badge,
                { backgroundColor: item.type === 'in' ? colors.inSoft : colors.outSoft },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  { color: item.type === 'in' ? colors.in : colors.out },
                ]}
              >
                {item.type === 'in' ? 'IN' : 'OUT'}
              </Text>
            </View>
            <View style={styles.body}>
              <Text style={styles.name}>{item.memberName}</Text>
              <Text style={styles.meta}>
                {item.note || (item.type === 'in' ? 'Put money in' : 'Took money out')}
                {' · '}
                {timeAgo(item.createdAt)}
              </Text>
            </View>
            <Text
              style={[
                styles.amount,
                { color: item.type === 'in' ? colors.in : colors.out },
              ]}
            >
              {item.type === 'in' ? '+' : '−'}
              {formatMoney(item.amount, piggy.currency)}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, paddingTop: spacing.md },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.ink,
    paddingHorizontal: spacing.lg,
  },
  subtitle: {
    color: colors.muted,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  list: { paddingHorizontal: spacing.lg, paddingBottom: 120 },
  empty: { color: colors.muted, marginTop: spacing.md },
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
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    marginRight: 10,
  },
  badgeText: { fontWeight: '800', fontSize: 12 },
  body: { flex: 1 },
  name: { fontWeight: '700', color: colors.ink },
  meta: { color: colors.muted, marginTop: 2, fontSize: 13 },
  amount: { fontWeight: '800' },
});
