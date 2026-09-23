import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { isFirebaseConfigured } from './src/firebaseConfig';
import { subscribePiggy, PiggyView } from './src/piggyApi';
import { loadSession } from './src/session';
import { ActivityScreen } from './src/screens/ActivityScreen';
import { FamilyScreen } from './src/screens/FamilyScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { MoveScreen } from './src/screens/MoveScreen';
import { SetupScreen } from './src/screens/SetupScreen';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { colors } from './src/theme';
import { MoveType, Session } from './src/types';

type Tab = 'home' | 'activity' | 'family';

export default function App() {
  const configured = isFirebaseConfigured();
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [piggy, setPiggy] = useState<PiggyView | null>(null);
  const [tab, setTab] = useState<Tab>('home');
  const [moveType, setMoveType] = useState<MoveType | null>(null);
  const [liveError, setLiveError] = useState('');

  useEffect(() => {
    loadSession()
      .then(setSession)
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!configured || !session) {
      setPiggy(null);
      return;
    }
    const unsub = subscribePiggy(session.code, setPiggy, setLiveError);
    return unsub;
  }, [configured, session]);

  if (!configured) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.safe}>
          <StatusBar style="dark" />
          <SetupScreen />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  if (!ready) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={[styles.safe, styles.center]}>
          <ActivityIndicator color={colors.pigDeep} />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  if (!session) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.safe}>
          <StatusBar style="dark" />
          <WelcomeScreen
            onJoined={(next) => {
              setSession(next);
              setTab('home');
            }}
          />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  if (moveType) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.safe}>
          <StatusBar style="dark" />
          <MoveScreen
            type={moveType}
            session={session}
            balance={piggy?.balance ?? 0}
            currency={piggy?.currency ?? 'EUR'}
            onClose={() => setMoveType(null)}
            onDone={() => {
              setMoveType(null);
              setTab('activity');
            }}
          />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <StatusBar style="dark" />
        {!piggy ? (
          <View style={styles.center}>
            <ActivityIndicator color={colors.pigDeep} />
            {liveError ? <Text style={styles.error}>{liveError}</Text> : null}
          </View>
        ) : (
          <>
            {tab === 'home' ? (
              <HomeScreen
                piggy={piggy}
                memberName={session.memberName}
                onPutIn={() => setMoveType('in')}
                onTakeOut={() => setMoveType('out')}
              />
            ) : null}
            {tab === 'activity' ? <ActivityScreen piggy={piggy} /> : null}
            {tab === 'family' ? (
              <FamilyScreen
                piggy={piggy}
                memberId={session.memberId}
                onLeft={() => {
                  setSession(null);
                  setPiggy(null);
                }}
              />
            ) : null}
          </>
        )}

        <View style={styles.tabBar}>
          <TabButton label="Piggy" active={tab === 'home'} onPress={() => setTab('home')} />
          <TabButton
            label="Activity"
            active={tab === 'activity'}
            onPress={() => setTab('activity')}
          />
          <TabButton
            label="Family"
            active={tab === 'family'}
            onPress={() => setTab('family')}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function TabButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.tabBtn}>
      <Text style={[styles.tabLabel, active && styles.tabLabelOn]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  error: { marginTop: 12, color: colors.out, paddingHorizontal: 24, textAlign: 'center' },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: colors.surface,
    paddingVertical: 10,
  },
  tabBtn: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  tabLabel: { color: colors.muted, fontWeight: '700' },
  tabLabelOn: { color: colors.pigDeep },
});
