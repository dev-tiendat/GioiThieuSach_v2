import React from 'react';
import {StyleSheet, View, Text, Image, ImageSourcePropType} from 'react-native';
import {COLORS, FONTS, SIZES} from '../../../constants/';

interface SlideProps {
  key: number;
  title: string;
  description: string;
  image: ImageSourcePropType;
}

const Slide: React.FC<SlideProps> = ({key, title, description, image}) => {
  return (
    <View style={styles.container}>
      <Image source={image} style={styles.image} resizeMode="stretch"></Image>
      <View style={{marginTop: SIZES.padding}}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: SIZES.width - 20,
    height: 220,
  },
  title: {
    ...FONTS.h2,
    marginVertical: SIZES.base,
    color: COLORS.black,
    textAlign: 'center',
  },
  description: {
    ...FONTS.body3,
    color: COLORS.darkGray,
    textAlign: 'center',
  },
});

export {Slide};
