import { Alert, Pressable, Share, StyleSheet, Text, View } from 'react-native';
import { PiggyView } from '../piggyApi';
import { clearSession } from '../session';
import { colors, radius, spacing } from '../theme';

type Props = {
  piggy: PiggyView;
  memberId: string;
  onLeft: () => void;
};

export function FamilyScreen({ piggy, memberId, onLeft }: Props) {
  async function shareCode() {
    await Share.share({
      message: `Join our family piggy bank "${piggy.name}". Open Family Piggy and use code ${piggy.code}.`,
    });
  }

  function leave() {
    Alert.alert(
      'Leave this piggy?',
      'This phone will stop seeing the shared jar. The piggy stays for everyone else.',
      [
        { text: 'Stay', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: async () => {
            await clearSession();
            onLeft();
          },
        },
      ]
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Family</Text>
      <Text style={styles.subtitle}>Share the code so phones can see the same piggy.</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Join code</Text>
        <Text style={styles.code}>{piggy.code}</Text>
        <Pressable style={styles.share} onPress={shareCode}>
          <Text style={styles.shareText}>Send code to family</Text>
        </Pressable>
      </View>

      <Text style={styles.section}>People in this piggy</Text>
      {piggy.members.map((member) => (
        <View key={member.id} style={styles.member}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{member.name.slice(0, 1).toUpperCase()}</Text>
          </View>
          <Text style={styles.memberName}>
            {member.name}
            {member.id === memberId ? ' (you)' : ''}
          </Text>
        </View>
      ))}

      <Pressable style={styles.leave} onPress={leave}>
        <Text style={styles.leaveText}>Leave piggy on this phone</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, padding: spacing.lg },
  title: { fontSize: 28, fontWeight: '800', color: colors.ink },
  subtitle: { color: colors.muted, marginBottom: spacing.md },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.line,
  },
  label: { color: colors.muted, fontWeight: '600' },
  code: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: 4,
    color: colors.pigDeep,
    marginVertical: spacing.sm,
  },
  share: {
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  shareText: { color: colors.white, fontWeight: '800' },
  section: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    fontWeight: '800',
    color: colors.ink,
    fontSize: 18,
  },
  member: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.line,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FBE0E4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: { fontWeight: '800', color: colors.pigDeep },
  memberName: { fontWeight: '700', color: colors.ink, fontSize: 16 },
  leave: { marginTop: 'auto', paddingVertical: 16, alignItems: 'center' },
  leaveText: { color: colors.out, fontWeight: '700' },
});
