import React, { useEffect, useState, useRef } from 'react';
import {
  ImageSourcePropType,
  StyleSheet,
  Image,
  View,
  TouchableOpacity,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {
  BottomTabBarButtonProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import auth from '@react-native-firebase/auth';
import { COLORS, SIZES, icons } from '../constants';
import { BottomTabNavigatorParamList } from './types';
import {
  HomeScreen,
  FavouriteScreen,
  UserScreen,
  PostsScreen,
} from '../screens';

const Tab = createBottomTabNavigator<BottomTabNavigatorParamList>();

interface IconBottomTabProps {
  icon: ImageSourcePropType;
  BottomTabBarButtonProps: BottomTabBarButtonProps;
  label: string;
}

const animate1 = {
  0: { scale: 0.5, translateY: 7 },
  0.92: { translateY: -34 },
  1: { scale: 1.2, translateY: -24 },
};
const animate2 = {
  0: { scale: 1.2, translateY: -24 },
  1: { scale: 1, translateY: 7 },
};

const circle1 = {
  0: { scale: 0 },
  0.3: { scale: 0.9 },
  0.5: { scale: 0.2 },
  0.8: { scale: 0.7 },
  1: { scale: 1 },
};
const circle2 = { 0: { scale: 1 }, 1: { scale: 0 } };

const IconBottomTab: React.FC<IconBottomTabProps> = ({
  icon,
  BottomTabBarButtonProps,
  label,
}) => {
  const { onPress, accessibilityState } = BottomTabBarButtonProps;
  const focused = accessibilityState!.selected;
  const viewRef = useRef<any>(null);
  const circleRef = useRef<any>(null);
  const textRef = useRef<any>(null);

  useEffect(() => {
    if (focused) {
      viewRef.current.animate(animate1);
      circleRef.current.animate(circle1);
      textRef.current.transitionTo({ scale: 1 });
    } else {
      viewRef.current.animate(animate2);
      circleRef.current.animate(circle2);
      textRef.current.transitionTo({ scale: 0 });
    }
  }, [focused]);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={1}>
      <Animatable.View ref={viewRef} duration={500} style={styles.container}>
        <View style={styles.btn}>
          <Animatable.View ref={circleRef} style={styles.circle} />
          <Image
            source={icon}
            style={[
              styles.iconBottom,
              { tintColor: focused ? COLORS.white : COLORS.gray },
              focused && {
                width: 20,
                height: 20,
              },
            ]}
          />
        </View>
        <Animatable.Text ref={textRef} style={styles.text}>
          {label}
        </Animatable.Text>
      </Animatable.View>
    </TouchableOpacity>
  );
};

const BottomTabNavigator = () => {
  const [user, setUser] = useState<any>();

  useEffect(() => {
    auth().onAuthStateChanged(user => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenListeners={({ navigation, route }) => ({
        tabPress: e => {
          if (route.name != 'Home' && !user) {
            e.preventDefault();
            navigation.navigate('SignIn');
          }
        },
      })}
      screenOptions={() => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      })}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarButton: props => (
            <IconBottomTab
              icon={icons.home_icon}
              label="Trang chủ"
              BottomTabBarButtonProps={props}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Favourite"
        component={FavouriteScreen}
        options={{
          tabBarButton: props => (
            <IconBottomTab
              icon={icons.favourite_icon}
              label="Yêu thích"
              BottomTabBarButtonProps={props}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Posts"
        component={PostsScreen}
        options={{
          tabBarButton: props => (
            <IconBottomTab
              icon={icons.book_icon}
              label="Quản lý bài viết"
              BottomTabBarButtonProps={props}
            />
          ),
        }}
      />
      <Tab.Screen
        name="User"
        component={UserScreen}
        options={{
          tabBarButton: props => (
            <IconBottomTab
              icon={icons.user_icon}
              label="Hồ sơ"
              BottomTabBarButtonProps={props}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBottom: {
    width: 30,
    height: 30,
  },
  tabBar: {
    width: SIZES.width - 50,
    height: 70,
    borderRadius: 25,
    position: 'absolute',
    left: 25,
    bottom: 20,
  },
  btn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 4,
    borderColor: COLORS.white,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 25,
  },
  text: {
    fontSize: 10,
    textAlign: 'center',
    color: COLORS.primary,
  },
});

export default BottomTabNavigator;
