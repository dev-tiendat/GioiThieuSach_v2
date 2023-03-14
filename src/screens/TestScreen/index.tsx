import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {COLORS} from '../../constants';

const TestScreen = () => {
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <TouchableOpacity
        style={{
          width: 200,
          height: 200,
          backgroundColor: COLORS.primary,
        }}>
        <Text>button</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TestScreen;

const styles = StyleSheet.create({});
