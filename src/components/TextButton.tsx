import React from 'react';
import {
  StyleSheet,
  StyleProp,
  TextStyle,
  ViewStyle,
  TouchableOpacity,
  Text,
} from 'react-native';
import { FONTS, COLORS } from '../constants';

interface TextButtonProps {
  contentContainerStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  label: string;
  labelStyle?: StyleProp<TextStyle>;
  onPress: () => void;
}

const TextButton: React.FC<TextButtonProps> = ({
  contentContainerStyle,
  disabled = false,
  label,
  labelStyle,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, contentContainerStyle]}
      disabled={disabled}
      onPress={onPress}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
  },
  label: {
    color: COLORS.secondary,
    ...FONTS.h3,
  },
});

export default TextButton;
