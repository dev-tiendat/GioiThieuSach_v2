import React from 'react';
import {StyleSheet, View, Text, Image, ImageSourcePropType} from 'react-native';
import {FONTS, SIZES, COLORS} from '../../../constants';

interface GreeterProps {
  name: string;
  avatarUrl: string;
}

const Greeter: React.FC<GreeterProps> = ({name, avatarUrl}) => {
  return (
    <View style={styles.container}>
      <View style={{width: '80%'}}>
        <Text style={styles.title}>Xin chào {name ? name : ''}</Text>
        <Text style={styles.subTitle}>Bạn muốn tìm loại sách gì ?</Text>
      </View>
      {avatarUrl && (
        <Image
          style={styles.avatar}
          source={{
            uri: avatarUrl,
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 80,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  title: {
    ...FONTS.h2,
    color: COLORS.primary,
  },
  subTitle: {
    marginTop: 3,
    color: COLORS.gray,
    ...FONTS.body3,
  },
});

export default Greeter;
