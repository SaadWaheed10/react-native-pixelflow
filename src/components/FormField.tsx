import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { useScalingVersion } from '../hooks/useScaling';
import { rp } from '../responsive/responsive';
import { hairline } from '../layout/helpers';
import { FText } from './FText';
import { Spacer } from './Layout';

export interface FormFieldProps {
  label?: string;
  helper?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** When true, wraps children in a bordered input chrome. Default false. */
  chrome?: boolean;
}

/**
 * Label + helper/error wrapper around any input.
 *
 * @example
 * <FormField label="Email" error={errors.email} helper="Work email" chrome>
 *   <TextInput value={email} onChangeText={setEmail} />
 * </FormField>
 */
export function FormField({
  label,
  helper,
  error,
  required,
  children,
  style,
  chrome = false,
}: FormFieldProps): React.JSX.Element {
  useScalingVersion();
  const theme = useTheme();
  const hasError = Boolean(error);

  return (
    <View style={[{ width: '100%' }, style]}>
      {label ? (
        <>
          <FText size={13} weight="medium" color={hasError ? 'danger' : 'fg.default'}>
            {label}
            {required ? ' *' : ''}
          </FText>
          <Spacer size={6} />
        </>
      ) : null}

      {chrome ? (
        <View
          style={{
            borderWidth: hairline * (hasError ? 2 : 1),
            borderColor: hasError ? theme.colors.danger : theme.colors.border,
            borderRadius: rp(10),
            paddingHorizontal: rp(12),
            paddingVertical: rp(10),
            backgroundColor: theme.colors.surface,
          }}
        >
          {children}
        </View>
      ) : (
        children
      )}

      {(helper || error) && (
        <>
          <Spacer size={6} />
          <FText size={12} color={hasError ? 'danger' : 'fg.muted'}>
            {error ?? helper}
          </FText>
        </>
      )}
    </View>
  );
}
