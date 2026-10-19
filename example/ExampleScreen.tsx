/**
 * Example usage — not part of the published package, just a reference
 * showing the library's pieces working together in a real screen.
 */
import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  Container,
  Box,
  Row,
  Column,
  Spacer,
  FText,
  Grid,
  ContentWidth,
  flex,
  rp,
  rf,
  rw,
  rh,
  rr,
  rs,
  fonts,
  design,
  configure,
  useResponsive,
  useDevice,
  useTypography,
  useWindowClass,
  usePixelSheet,
  useA11yLayout,
  PixelFlowProvider,
  PixelFlowDebug,
} from 'react-native-pixelflow';

// Match your Figma frame once at app entry:
configure({ figma: 'iPhone 14', density: 'comfortable' });

function Content(): React.JSX.Element {
  const { isTablet, isLandscape, width, select, scale } = useResponsive();
  const { deviceType, orientation } = useDevice();
  const type = useTypography();
  const { widthClass, columns, nav, meets } = useWindowClass();
  const { preferStack, layout } = useA11yLayout();

  const styles = usePixelSheet(() => ({
    scroll: {
      paddingBottom: 40,
    },
    card: {
      ...flex.center,
      padding: 12,
      borderRadius: 12,
      minHeight: 88,
    },
    cardLabel: {
      color: '#fff',
      fontSize: 13,
      fontFamily: fonts.inter.medium,
      textAlign: 'center',
    },
    panel: {
      padding: 16,
      borderRadius: 12,
      backgroundColor: '#F5F6F8',
    },
  }));

  const cardWidth = rs({ phone: rw(43), tablet: rw(30), foldable: rw(40) });

  return (
    <Container>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ContentWidth>
          <FText style={type.h1}>react-native-PixelFlow</FText>
          <FText secondary>
            PixelSheet · window classes · grid · Figma presets · SplitView
          </FText>
          <Spacer size={16} />

          <Box
            p="md"
            radius="lg"
            bg="surface"
            flexDirection={preferStack ? 'column' : 'row'}
            justify="space-between"
            gap="sm"
          >
            <Column gap={4}>
              <FText variant="subtitle" weight="semibold">
                Window
              </FText>
              <FText size={13} color="textSecondary">
                {widthClass} · {nav} · {columns} cols · {deviceType} ·{' '}
                {Math.round(width)}px · scale {scale.toFixed(2)} · a11y {layout}
              </FText>
            </Column>
            <FText size={13} color="textSecondary">
              {meets('medium') ? 'split-ready' : 'phone layout'}
            </FText>
          </Box>

          <Spacer size={16} />

          <FText style={type.h3}>Grid (minItemWidth 160)</FText>
          <Spacer size={8} />
          <Grid minItemWidth={160} gap={12}>
            {['A', 'B', 'C', 'D'].map((label) => (
              <View key={label} style={[styles.card, { backgroundColor: '#4F46E5' }]}>
                <FText style={styles.cardLabel}>Cell {label}</FText>
              </View>
            ))}
          </Grid>

          <Spacer size={16} />

          <Row gap={12}>
            <Box
              style={[styles.card, { width: cardWidth, height: rh(14), backgroundColor: '#111827' }]}
              radius={12}
            >
              <FText style={styles.cardLabel}>design({design(16)})</FText>
            </Box>
            <Box style={[styles.panel, { flex: 1 }]}>
              <FText size={13} secondary>
                {orientation}
                {isLandscape ? ' · rotate for live PixelSheet' : ''}
                {isTablet ? ' · tablet' : ''}
                {' · '}
                {select({ phone: '1-col nav', tablet: 'rail', foldable: 'dual' })}
              </FText>
              <FText size={12} secondary>
                rf {rf(14)} · rr {rr(8)} · rp {rp(12)}
              </FText>
            </Box>
          </Row>
        </ContentWidth>
      </ScrollView>
    </Container>
  );
}

export default function ExampleScreen(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <PixelFlowProvider followSystem density="comfortable">
        <Content />
        <PixelFlowDebug />
      </PixelFlowProvider>
    </SafeAreaProvider>
  );
}
