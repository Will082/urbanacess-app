// components/common/Input.js
import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONTS } from '../../theme';

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  error,
  disabled = false,
  style,
  inputStyle,
  labelStyle,
  ...props
}) => {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          disabled && styles.inputDisabled,
          inputStyle,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.text.secondary}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        editable={!disabled}
        accessibilityLabel={label || placeholder}
        accessibilityState={{ disabled }}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.medium,
    width: '100%',
  },
  label: {
    fontSize: FONTS.sizes.small,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.text.primary,
    marginBottom: SPACING.tiny,
  },
  input: {
    backgroundColor: COLORS.secondary,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.medium,
    fontSize: FONTS.sizes.regular,
    color: COLORS.text.primary,
  },
  inputError: {
    borderColor: COLORS.accent.error,
  },
  inputDisabled: {
    backgroundColor: COLORS.background.light,
    color: COLORS.text.secondary,
  },
  errorText: {
    color: COLORS.accent.error,
    fontSize: FONTS.sizes.small,
    marginTop: SPACING.tiny,
  },
});

export default Input;
