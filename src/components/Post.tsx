import React from 'react';
import {
  StyleProp,
  ViewStyle,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Image,
} from 'react-native';
import { FONTS, images, SIZES } from '../constants';

// interface PostProp{
//     containerStyle?: StyleProp<ViewStyle>,
//     image: string,
//     title: string,
//     description?: string,
//     user?:
//     onPressLike?: () => void,
//     onPressPost: () => void
// }

const Post: React.FC<any> = prop => {
  return (
    <View style={styles.container}>
      <Image
        style={{
          width: (SIZES.width / 2 - 30) * 0.9,
          height: (SIZES.width / 2 - 30) * 0.7,
          borderRadius: SIZES.radius,
        }}
        resizeMode="stretch"
        source={images.picture}
      />
      <Text style={styles.title}>{prop.bookTitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SIZES.width / 2 - 30,
    height: SIZES.width / 2 - 30,
    paddingHorizontal: SIZES.radius,
    margin: SIZES.base,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: SIZES.radius,
    elevation: 1,
  },
  title: {
    ...FONTS.h3,
    textAlign: 'center',
    padding: SIZES.base,
  },
});

export default Post;
