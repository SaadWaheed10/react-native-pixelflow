/**
 * Example usage — not part of the published package, just a reference
 * showing the library's pieces working together in a real screen.
 */
import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import {
  Container,
  Box,
  Row,
  Column,
  Spacer,
  FText,
  flex,
  rp,
  rm,
  rf,
  rw,
  rh,
  rr,
  fonts,
  typography,
  useResponsive,
  useDevice,
  PixelFlowProvider,
  lightTheme,
} from 'react-native-pixelflow';

function Content(): React.JSX.Element {
  const { isTablet, isLandscape, width } = useResponsive();
  const { deviceType, orientation } = useDevice();

  return (
    <Container>
      <ScrollView contentContainerStyle={styles.scroll}>
        <FText style={typography.h1}>react-native-PixelFlow</FText>
        <FText secondary>One package for responsive React Native UI.</FText>
        <Spacer size={20} />

        <Box p={16} radius={12} bg="#F5F6F8" style={flex.between}>
          <Column gap={4}>
            <FText weight="semibold">Device</FText>
            <FText size={13} secondary>
              {deviceType} · {orientation} · {Math.round(width)}px wide
            </FText>
          </Column>
          <FText size={13} secondary>
            {isTablet ? 'tablet layout' : 'phone layout'}
          </FText>
        </Box>

        <Spacer size={16} />

        <Row gap={12}>
          <Box
            style={[styles.card, { width: rw(43), height: rh(14) }]}
            radius={12}
            bg="#4F46E5"
          >
            <FText style={styles.cardLabel}>rw(43) × rh(14)</FText>
          </Box>
          <Box
            style={[styles.card, { width: rw(43), height: rh(14) }]}
            radius={12}
            bg="#111827"
          >
            <FText style={styles.cardLabel}>Responsive card</FText>
          </Box>
        </Row>

        <Spacer size={16} />

        <FText style={typography.h3}>Custom StyleSheet</FText>
        <Box style={styles.legacyCard}>
          <FText style={styles.legacyTitle}>
            Works with StyleSheet.create() directly
          </FText>
        </Box>

        {isLandscape && (
          <FText size={12} secondary>
            (Rotate back to portrait to see the layout adapt.)
          </FText>
        )}
      </ScrollView>
    </Container>
  );
}

export default function ExampleScreen(): React.JSX.Element {
  return (
    <PixelFlowProvider theme={lightTheme}>
      <Content />
    </PixelFlowProvider>
  );
}

// This is exactly the pattern the library is designed for: plain
// StyleSheet.create(), values wrapped in react-native-PixelFlow's responsive functions.
const styles = StyleSheet.create({
  scroll: {
    paddingBottom: rp(40),
  },
  card: {
    ...flex.center,
  },
  cardLabel: {
    color: '#fff',
    fontSize: rf(13),
    fontFamily: fonts.inter.medium,
    textAlign: 'center',
    paddingHorizontal: rp(8),
  },
  legacyCard: {
    padding: rp(16),
    marginTop: rm(8),
    borderRadius: rr(12),
    backgroundColor: '#F5F6F8',
  },
  legacyTitle: {
    fontSize: rf(15),
    fontFamily: fonts.inter.regular,
  },
});
