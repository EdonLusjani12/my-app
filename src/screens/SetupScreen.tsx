import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../theme';

export function SetupScreen() {
  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Text style={styles.pig}>🐷</Text>
      <Text style={styles.title}>One more step</Text>
      <Text style={styles.body}>
        Family phones share one piggy bank over the internet. Create a free Firebase
        Realtime Database, then paste the web config into the app file
        src/firebaseConfig.ts and reload.
      </Text>

      <View style={styles.card}>
        <Text style={styles.step}>1. Open Firebase Console and create a project.</Text>
        <Text style={styles.step}>2. Add a Web app and copy the config object.</Text>
        <Text style={styles.step}>
          3. Build → Realtime Database → Create database (start in test mode).
        </Text>
        <Text style={styles.step}>
          4. Paste the config into src/firebaseConfig.ts. databaseURL must be filled in.
        </Text>
        <Text style={styles.step}>
          5. Optional: replace the database rules with the file database.rules.json.
        </Text>
      </View>

      <Pressable onPress={() => Linking.openURL('https://console.firebase.google.com/')}>
        <Text style={styles.link}>Open Firebase Console</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    backgroundColor: colors.bg,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  pig: { fontSize: 56, textAlign: 'center' },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.ink,
    textAlign: 'center',
    marginVertical: spacing.sm,
  },
  body: {
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.line,
    gap: spacing.sm,
  },
  step: { color: colors.ink, lineHeight: 22, fontSize: 15 },
  link: {
    marginTop: spacing.lg,
    textAlign: 'center',
    color: colors.pigDeep,
    fontWeight: '800',
  },
});
