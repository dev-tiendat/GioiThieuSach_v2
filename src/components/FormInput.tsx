import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';

import { FONTS, SIZES, COLORS } from '../constants';

const FormInput: React.FC<any> = ({
  containerStyle,
  inputContainerStyle,
  placeholder,
  inputStyle,
  value = '',
  prependComponent,
  appendComponent,
  onChange,
  onPress,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  maxLength,
  autoFocus,
  textAlign,
  ref,
  placeholderTextColor = COLORS.grey60,
}) => {
  return (
    <View style={{ ...containerStyle }}>
      <View style={[styles.inputContainer, { ...inputContainerStyle }]}>
        {prependComponent}
        <TextInput
          ref={ref}
          style={[styles.input, { ...inputStyle }]}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          maxLength={maxLength}
          onChangeText={text => onChange(text)}
          onPressIn={onPress}
          autoFocus={autoFocus}
          textAlign={textAlign}
        />
        {appendComponent}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    height: 55,
    paddingHorizontal: SIZES.radius,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
  },
  input: {
    flex: 1,
    ...FONTS.h3,
  },
});

export default FormInput;
