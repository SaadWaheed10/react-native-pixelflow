import React, { useMemo, type ComponentType } from 'react';
import {
  View,
  Text,
  Pressable,
  type FlexStyle,
  type PressableProps,
  type StyleProp,
  type TextProps,
  type TextStyle,
  type ViewProps,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { useScalingVersion } from '../hooks/useScaling';
import {
  resolveColor,
  resolveRadius,
  resolveSpacing,
  type ColorInput,
  type RadiusInput,
  type SpacingInput,
} from '../tokens/resolveTokens';
import { resolveResponsiveValue } from '../responsive/resolveValue';
import type { ResponsiveValue } from '../types';
import { rf } from '../responsive/responsive';

/** Tokenized style props shared by `styled()` factories. */
export interface StyledProps {
  p?: SpacingInput;
  px?: SpacingInput;
  py?: SpacingInput;
  pt?: SpacingInput;
  pb?: SpacingInput;
  pl?: SpacingInput;
  pr?: SpacingInput;
  /** Logical padding start (RTL-aware). */
  ps?: SpacingInput;
  /** Logical padding end (RTL-aware). */
  pe?: SpacingInput;
  m?: SpacingInput;
  mx?: SpacingInput;
  my?: SpacingInput;
  mt?: SpacingInput;
  mb?: SpacingInput;
  ml?: SpacingInput;
  mr?: SpacingInput;
  ms?: SpacingInput;
  me?: SpacingInput;
  gap?: SpacingInput;
  radius?: RadiusInput;
  bg?: ColorInput;
  borderColor?: ColorInput;
  borderWidth?: number;
  flex?: number;
  flexDirection?: ResponsiveValue<FlexStyle['flexDirection']>;
  align?: ResponsiveValue<FlexStyle['alignItems']>;
  justify?: ResponsiveValue<FlexStyle['justifyContent']>;
  wrap?: boolean;
  /** Text-only: font size (design px → `rf`). */
  fontSize?: number;
  color?: ColorInput;
}

export function resolveStyledStyle(
  props: StyledProps,
  theme: ReturnType<typeof useTheme>,
): ViewStyle & TextStyle {
  const style: ViewStyle & TextStyle = {
    ...(props.p !== undefined && { padding: resolveSpacing(props.p, theme) }),
    ...(props.px !== undefined && {
      paddingHorizontal: resolveSpacing(props.px, theme),
    }),
    ...(props.py !== undefined && {
      paddingVertical: resolveSpacing(props.py, theme),
    }),
    ...(props.pt !== undefined && { paddingTop: resolveSpacing(props.pt, theme) }),
    ...(props.pb !== undefined && {
      paddingBottom: resolveSpacing(props.pb, theme),
    }),
    ...(props.pl !== undefined && {
      paddingLeft: resolveSpacing(props.pl, theme),
    }),
    ...(props.pr !== undefined && {
      paddingRight: resolveSpacing(props.pr, theme),
    }),
    ...(props.ps !== undefined && {
      paddingStart: resolveSpacing(props.ps, theme),
    }),
    ...(props.pe !== undefined && {
      paddingEnd: resolveSpacing(props.pe, theme),
    }),
    ...(props.m !== undefined && { margin: resolveSpacing(props.m, theme) }),
    ...(props.mx !== undefined && {
      marginHorizontal: resolveSpacing(props.mx, theme),
    }),
    ...(props.my !== undefined && {
      marginVertical: resolveSpacing(props.my, theme),
    }),
    ...(props.mt !== undefined && { marginTop: resolveSpacing(props.mt, theme) }),
    ...(props.mb !== undefined && {
      marginBottom: resolveSpacing(props.mb, theme),
    }),
    ...(props.ml !== undefined && {
      marginLeft: resolveSpacing(props.ml, theme),
    }),
    ...(props.mr !== undefined && {
      marginRight: resolveSpacing(props.mr, theme),
    }),
    ...(props.ms !== undefined && {
      marginStart: resolveSpacing(props.ms, theme),
    }),
    ...(props.me !== undefined && {
      marginEnd: resolveSpacing(props.me, theme),
    }),
    ...(props.gap !== undefined && { gap: resolveSpacing(props.gap, theme) }),
    ...(props.radius !== undefined && {
      borderRadius: resolveRadius(props.radius, theme),
    }),
    ...(props.bg !== undefined && {
      backgroundColor: resolveColor(props.bg, theme),
    }),
    ...(props.borderColor !== undefined && {
      borderColor: resolveColor(props.borderColor, theme),
    }),
    ...(props.borderWidth !== undefined && { borderWidth: props.borderWidth }),
    ...(props.flex !== undefined && { flex: props.flex }),
    ...(props.flexDirection !== undefined && {
      flexDirection: resolveResponsiveValue(props.flexDirection),
    }),
    ...(props.align !== undefined && {
      alignItems: resolveResponsiveValue(props.align),
    }),
    ...(props.justify !== undefined && {
      justifyContent: resolveResponsiveValue(props.justify),
    }),
    ...(props.wrap && { flexWrap: 'wrap' }),
    ...(props.fontSize !== undefined && { fontSize: rf(props.fontSize) }),
    ...(props.color !== undefined && { color: resolveColor(props.color, theme) }),
  };
  return style;
}

const STYLE_KEYS: (keyof StyledProps)[] = [
  'p',
  'px',
  'py',
  'pt',
  'pb',
  'pl',
  'pr',
  'ps',
  'pe',
  'm',
  'mx',
  'my',
  'mt',
  'mb',
  'ml',
  'mr',
  'ms',
  'me',
  'gap',
  'radius',
  'bg',
  'borderColor',
  'borderWidth',
  'flex',
  'flexDirection',
  'align',
  'justify',
  'wrap',
  'fontSize',
  'color',
];

function splitStyledProps<P extends Record<string, unknown>>(
  props: P,
): { styled: StyledProps; rest: Omit<P, keyof StyledProps> } {
  const styled: StyledProps = {};
  const rest = { ...props } as Record<string, unknown>;
  for (const key of STYLE_KEYS) {
    if (key in rest && rest[key] !== undefined) {
      (styled as Record<string, unknown>)[key] = rest[key];
      delete rest[key];
    }
  }
  return {
    styled,
    rest: rest as Omit<P, keyof StyledProps>,
  };
}

type AnyProps = { style?: StyleProp<ViewStyle | TextStyle>; children?: React.ReactNode };

/**
 * Create a component with baked-in token styles (StyleSheet-first, no CSS-in-JS).
 *
 * @example
 * const Card = styled(View, { p: 'md', bg: 'surface', radius: 'lg' });
 * const Title = styled(Text, { fontSize: 20, color: 'fg.default' });
 */
export function styled<P extends AnyProps>(
  Component: ComponentType<P>,
  base: StyledProps = {},
): ComponentType<P & StyledProps> {
  function StyledComponent(props: P & StyledProps): React.JSX.Element {
    const version = useScalingVersion();
    const theme = useTheme();
    const { styled: override, rest } = splitStyledProps(
      props as P & StyledProps & Record<string, unknown>,
    );
    const merged = { ...base, ...override };

    const computed = useMemo(
      () => resolveStyledStyle(merged, theme),
      [version, theme, merged],
    );

    const userStyle = (rest as AnyProps).style;
    return (
      <Component
        {...(rest as P)}
        style={[computed, userStyle] as P['style']}
      />
    );
  }

  StyledComponent.displayName = `Styled(${
    (Component as { displayName?: string; name?: string }).displayName ??
    (Component as { name?: string }).name ??
    'Component'
  })`;

  return StyledComponent;
}

/** Convenience: `styled.View({ p: 'md' })` */
styled.View = (base?: StyledProps) =>
  styled(View as ComponentType<AnyProps>, base);
/** Convenience: `styled.Text({ fontSize: 16 })` */
styled.Text = (base?: StyledProps) =>
  styled(Text as ComponentType<AnyProps>, base);
/** Convenience: `styled.Pressable({ p: 'sm', radius: 'md' })` */
styled.Pressable = (base?: StyledProps) =>
  styled(Pressable as ComponentType<AnyProps>, base);

export type { ViewProps, TextProps, PressableProps };
