import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { createPiggy, joinPiggy } from '../piggyApi';
import { saveSession } from '../session';
import { colors, radius, spacing } from '../theme';
import { Session } from '../types';

type Props = {
  onJoined: (session: Session) => void;
};

export function WelcomeScreen({ onJoined }: Props) {
  const [mode, setMode] = useState<'create' | 'join'>('create');
  const [piggyName, setPiggyName] = useState('Family piggy');
  const [memberName, setMemberName] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const canSubmit = useMemo(() => {
    if (memberName.trim().length < 2) return false;
    if (mode === 'create') return piggyName.trim().length > 1;
    return code.trim().length >= 4;
  }, [mode, memberName, piggyName, code]);

  async function submit() {
    setError('');
    setBusy(true);
    try {
      const session =
        mode === 'create'
          ? await createPiggy({
              piggyName,
              memberName,
              currency: 'MKD',
            })
          : await joinPiggy({ code, memberName });
      await saveSession(session);
      onJoined(session);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not connect.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.pig}>🐷</Text>
      <Text style={styles.title}>Family Piggy</Text>
      <Text style={styles.subtitle}>
        One shared jar. Anyone in the family can put money in or take money out,
        and everyone sees it.
      </Text>

      <View style={styles.toggle}>
        <Pressable
          style={[styles.toggleBtn, mode === 'create' && styles.toggleOn]}
          onPress={() => setMode('create')}
        >
          <Text style={[styles.toggleText, mode === 'create' && styles.toggleTextOn]}>
            Create
          </Text>
        </Pressable>
        <Pressable
          style={[styles.toggleBtn, mode === 'join' && styles.toggleOn]}
          onPress={() => setMode('join')}
        >
          <Text style={[styles.toggleText, mode === 'join' && styles.toggleTextOn]}>
            Join family
          </Text>
        </Pressable>
      </View>

      {mode === 'create' ? (
        <TextInput
          value={piggyName}
          onChangeText={setPiggyName}
          placeholder="Piggy bank name"
          placeholderTextColor={colors.muted}
          style={styles.input}
        />
      ) : (
        <TextInput
          value={code}
          onChangeText={setCode}
          placeholder="Family code"
          autoCapitalize="characters"
          placeholderTextColor={colors.muted}
          style={styles.input}
        />
      )}

      <TextInput
        value={memberName}
        onChangeText={setMemberName}
        placeholder="Your name"
        placeholderTextColor={colors.muted}
        style={styles.input}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable
        style={[styles.cta, !canSubmit && styles.ctaDisabled]}
        disabled={!canSubmit || busy}
        onPress={submit}
      >
        {busy ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={styles.ctaText}>
            {mode === 'create' ? 'Create piggy bank' : 'Join piggy bank'}
          </Text>
        )}
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  pig: { fontSize: 64, textAlign: 'center', marginBottom: spacing.sm },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.ink,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    color: colors.muted,
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 22,
  },
  toggle: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    padding: 4,
    marginBottom: spacing.md,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radius.pill,
    alignItems: 'center',
  },
  toggleOn: { backgroundColor: colors.pig },
  toggleText: { fontWeight: '700', color: colors.muted },
  toggleTextOn: { color: colors.white },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.ink,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.line,
  },
  error: { color: colors.out, marginBottom: spacing.sm, textAlign: 'center' },
  cta: {
    marginTop: spacing.sm,
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
    paddingVertical: 16,
    alignItems: 'center',
  },
  ctaDisabled: { opacity: 0.45 },
  ctaText: { color: colors.white, fontWeight: '800', fontSize: 16 },
});
