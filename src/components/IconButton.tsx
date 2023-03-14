import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  StyleProp,
  ViewStyle,
  ImageSourcePropType,
  ImageStyle,
} from 'react-native';

interface IconButtonProps {
  containerStyle?: StyleProp<ViewStyle>;
  icon: ImageSourcePropType;
  iconStyle?: StyleProp<ImageStyle>;
  onPress: () => void;
}

const IconButton: React.FC<IconButtonProps> = ({
  containerStyle,
  icon,
  iconStyle,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={onPress}>
      <Image
        source={icon}
        resizeMode="contain"
        style={[styles.icon, iconStyle]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 30,
    height: 30,
  },
});

export default IconButton;
