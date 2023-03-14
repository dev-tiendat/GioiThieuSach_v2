import React from 'react';
// import {KeyboardAvoidingView} from 'react-native';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { COLORS } from '../constants';
import { RootStackParamList } from './types';
import {
  SplashScreen,
  OnboardingScreen,
  SignInScreen,
  ForgotPasswordScreen,
  RegisterByEmailScreen,
  VertificationScreen,
  PhoneAuthScreen,
  WelcomeUserScreen,
  CreatePostScreen,
  EditProfileScreen,
  EditPostScreen,
  BookDetailsScreen,
  LinkToBookScreen,
  PostCommentScreen,
  TestScreen,
} from '../screens';
import BottomTabNavigator from './BottomTabNavigator';

export type OnBoardingScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Onboarding',
  'BottomTab'
>;

export type TestScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Test',
  'BottomTab'
>;

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigator = () => {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <Stack.Navigator
        initialRouteName="Onboarding"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ animation: 'none' }}
        />
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{ animation: 'default' }}
        />
        <Stack.Screen name="BottomTab" component={BottomTabNavigator} />
        <Stack.Screen
          name="SignIn"
          component={SignInScreen}
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="RegisterByEmail"
          component={RegisterByEmailScreen}
          options={{ animation: 'slide_from_left' }}
        />
        <Stack.Screen
          name="PhoneAuth"
          component={PhoneAuthScreen}
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="Vertification"
          component={VertificationScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="WelcomeUser"
          component={WelcomeUserScreen}
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="CreatePostScreen"
          component={CreatePostScreen}
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="EditPost"
          component={EditPostScreen}
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="BookDetails"
          component={BookDetailsScreen}
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="LinkToBook"
          component={LinkToBookScreen}
          options={{
            animation: 'slide_from_right',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="PostComment"
          component={PostCommentScreen}
          options={{
            animation: 'slide_from_right',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
