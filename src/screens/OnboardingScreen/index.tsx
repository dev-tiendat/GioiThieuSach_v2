import React from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import {useDispatch} from 'react-redux';
import { changeIsShowOnboardingScreen } from '../../redux/slices/showScreensSlice';
import {COLORS, constants} from '../../constants/';
import {Slide} from './components/Slide';
import {CustomButton} from '../../components/';
import {OnBoardingScreenProps} from '../../navigation/Navigator';

const OnboardingScreen: React.FC<OnBoardingScreenProps> = ({
  navigation,
  route,
}) => {
  const dispatch = useDispatch();

  const onDone = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'BottomTab'}],
    });
    dispatch(changeIsShowOnboardingScreen(false));
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <AppIntroSlider
        data={constants.introSlidesOnboarding}
        renderItem={({item}) => Slide(item)}
        showSkipButton
        renderNextButton={() => (
          <CustomButton
            text="Tiếp theo"
            backgroundColor={COLORS.primary}
            color={COLORS.white}
            borderRadius={20}
            paddingHorizontal={20}
            paddingVertical={15}
          />
        )}
        renderSkipButton={() => (
          <CustomButton
            text="Bỏ qua"
            backgroundColor={COLORS.primary}
            color={COLORS.white}
            borderRadius={20}
            paddingHorizontal={20}
            paddingVertical={15}
          />
        )}
        renderDoneButton={() => (
          <CustomButton
            text="Xong"
            backgroundColor={COLORS.primary}
            color={COLORS.white}
            borderRadius={20}
            paddingHorizontal={20}
            paddingVertical={15}
          />
        )}
        activeDotStyle={styles.activeDotStyle}
        onDone={onDone}></AppIntroSlider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  activeDotStyle: {
    width: 30,
    backgroundColor: COLORS.secondary,
  },
});

export default OnboardingScreen;
