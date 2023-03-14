import React, { useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { useEffect } from 'react';
import { useSelector } from 'react-redux/';
import { selectShowScreen } from '../../redux/slices/showScreensSlice';
import { COLORS } from '../../constants';

const SplashScreen: React.FC<any> = props => {
  const isShowOnboardingScreen = useSelector(selectShowScreen);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [animationLoaded, setAnimationLoaded] = useState(false);

  const ref = useRef<any>(null);

  useEffect(() => {
    setTimeout(() => {
      setAuthLoaded(true);
    }, 5000);
  }, []);

  const onAnimationFinish = () => {
    setAnimationLoaded(true);
  };

  useEffect(() => {
    if (authLoaded && animationLoaded) {
      props.navigation.replace(
        isShowOnboardingScreen ? 'Onboarding' : 'BottomTab',
      );
    }
  }, [authLoaded, animationLoaded, props.navigation, isShowOnboardingScreen]);

  return (
    <View style={styles.container}>
      <LottieView
        ref={animation => {
          ref.current = animation;
        }}
        style={styles.lottieView}
        source={require('../../assets/splash/book-loading.json')}
        autoPlay
        loop={false}
        onAnimationFinish={onAnimationFinish}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  lottieView: {
    width: '100%',
  },
});

export default SplashScreen;
