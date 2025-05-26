// components/common/AccessibleButton.js
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';
import AccessibleText from './AccessibleText';

const AccessibleButton = ({
  title,
  onPress,
  type = 'primary',
  size = 'medium',
  disabled = false,
  style,
  textStyle,
  ...props
}) => {
  const buttonStyles = [
    styles.button,
    styles[`${type}Button`],
    styles[`${size}Button`],
    disabled && styles.disabledButton,
    style,
  ];

  const textVariant = size === 'small' ? 'bodySmall' : 'body';
  const textColor = type === 'primary' ? 'light' : 'accent';

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      accessibilityLabel={title}
      {...props}
    >
      <AccessibleText 
        variant={textVariant} 
        color={disabled ? 'secondary' : textColor} 
        style={textStyle}
      >
        {title}
      </AccessibleText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.medium,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  smallButton: {
    paddingVertical: SPACING.small,
    paddingHorizontal: SPACING.medium,
  },
  mediumButton: {
    paddingVertical: SPACING.medium,
    paddingHorizontal: SPACING.large,
  },
  largeButton: {
    paddingVertical: SPACING.large,
    paddingHorizontal: SPACING.xlarge,
  },
  disabledButton: {
    backgroundColor: COLORS.border,
    borderColor: COLORS.border,
  },
});

export default AccessibleButton;
