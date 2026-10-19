/**
 * Copy this file into an Expo Snack (or Expo app) to try PixelFlow end-to-end.
 *
 * Snack setup:
 * 1. https://snack.expo.dev — blank TypeScript
 * 2. Dependencies: react-native-pixelflow, react-native-safe-area-context
 * 3. Paste this as App.tsx
 */
import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  Box,
  Button,
  configure,
  Container,
  ContentWidth,
  FText,
  Grid,
  PixelFlowDebug,
  PixelFlowProvider,
  Spacer,
  absoluteFill,
  hairline,
  useA11yLayout,
  useMedia,
  useMotion,
  usePixelSheet,
  useWindowClass,
} from 'react-native-pixelflow';

configure({ figma: 'iPhone 14', density: 'comfortable' });

function Demo(): React.JSX.Element {
  const { widthClass, columns } = useWindowClass();
  const media = useMedia();
  const motion = useMotion();
  const { preferStack } = useA11yLayout();

  const styles = usePixelSheet(() => ({
    card: {
      padding: 12,
      borderRadius: 12,
      minHeight: 72,
      borderWidth: hairline,
      borderColor: '#E5E7EB',
      justifyContent: 'center',
      alignItems: 'center',
    },
  }));

  return (
    <Container>
      <ScrollView>
        <ContentWidth>
          <FText variant="h1">PixelFlow Snack</FText>
          <FText color="fg.muted">
            {widthClass} · {columns} cols · media.lg={String(media.lg)} · motion{' '}
            {motion.durationOf('normal')}ms
          </FText>
          <Spacer size={16} />

          <Box
            p="md"
            bg="bg.subtle"
            radius="lg"
            borderColor="border.default"
            borderWidth={hairline}
            flexDirection={preferStack ? 'column' : 'row'}
            gap="sm"
          >
            <FText variant="subtitle">Token Box</FText>
            <FText color="fg.muted" size={13}>
              bg.subtle · border.default
            </FText>
          </Box>

          <Spacer size={16} />
          <Grid minItemWidth={140} gap={12}>
            {['One', 'Two', 'Three'].map((label) => (
              <View key={label} style={styles.card}>
                <FText weight="semibold">{label}</FText>
              </View>
            ))}
          </Grid>

          <Spacer size={16} />
          <Button intent="primary" size="lg" fullWidth onPress={() => {}}>
            Primary action
          </Button>
          <Spacer size={8} />
          <Button intent="ghost" onPress={() => {}}>
            Ghost
          </Button>

          <View style={{ height: 120, marginTop: 24 }}>
            <View style={[absoluteFill, { backgroundColor: '#EEF2FF', borderRadius: 12 }]} />
            <FText style={{ padding: 16 }}>absoluteFill demo layer</FText>
          </View>
        </ContentWidth>
      </ScrollView>
    </Container>
  );
}

export default function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <PixelFlowProvider followSystem density="comfortable">
        <Demo />
        {typeof __DEV__ !== 'undefined' && __DEV__ ? <PixelFlowDebug /> : null}
      </PixelFlowProvider>
    </SafeAreaProvider>
  );
}
