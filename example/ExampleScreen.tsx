/**
 * Example usage — not part of the published package, just a reference
 * showing the library's pieces working together in a real screen.
 */
import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
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
  rs,
  fonts,
  useResponsive,
  useDevice,
  useScaledStyles,
  useTypography,
  PixelFlowProvider,
  configure,
} from 'react-native-pixelflow';

// Optional: match your Figma frame once at app entry.
configure({ baseWidth: 375, baseHeight: 812 });

function Content(): React.JSX.Element {
  const { isTablet, isLandscape, width, select, scale } = useResponsive();
  const { deviceType, orientation } = useDevice();
  const type = useTypography();
  const styles = useScaledStyles(() => ({
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
  }));

  const columns = select({ phone: 1, tablet: 2, foldable: 2 });
  const cardWidth = rs({ phone: rw(43), tablet: rw(30), foldable: rw(40) });

  return (
    <Container>
      <ScrollView contentContainerStyle={styles.scroll}>
        <FText style={type.h1}>react-native-PixelFlow</FText>
        <FText secondary>One package for responsive React Native UI.</FText>
        <Spacer size={16} />

        <Box p={16} radius={12} bg="#F5F6F8" style={flex.between}>
          <Column gap={4}>
            <FText weight="semibold">Device</FText>
            <FText size={13} secondary>
              {deviceType} · {orientation} · {Math.round(width)}px · scale{' '}
              {scale.toFixed(2)}
            </FText>
          </Column>
          <FText size={13} secondary>
            {isTablet ? 'tablet layout' : `${columns} col`}
          </FText>
        </Box>

        <Spacer size={16} />

        <Row gap={12}>
          <Box
            style={[styles.card, { width: cardWidth, height: rh(14) }]}
            radius={12}
            bg="#4F46E5"
          >
            <FText style={styles.cardLabel}>rs() card</FText>
          </Box>
          <Box
            style={[styles.card, { width: cardWidth, height: rh(14) }]}
            radius={12}
            bg="#111827"
          >
            <FText style={styles.cardLabel}>useScaledStyles</FText>
          </Box>
        </Row>

        <Spacer size={16} />

        <FText style={type.h3}>Live StyleSheet</FText>
        <Box style={styles.legacyCard}>
          <FText style={styles.legacyTitle}>
            Styles recompute on rotation via useScaledStyles()
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
    <SafeAreaProvider>
      <PixelFlowProvider followSystem>
        <Content />
      </PixelFlowProvider>
    </SafeAreaProvider>
  );
}
