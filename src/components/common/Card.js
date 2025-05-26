// components/common/Card.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../../theme';

const Card = ({ children, style, ...props }) => {
  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.secondary,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.medium,
    marginVertical: SPACING.small,
    ...SHADOWS.light,
  },
});

export default Card;
