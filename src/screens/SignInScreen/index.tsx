import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { Shadow } from 'react-native-shadow-2';
import firestore from '@react-native-firebase/firestore';
import { SignInProps } from '../../navigation/types';
import { COLORS, FONTS, SIZES, images, icons, types } from '../../constants';
import {
  CustomButton,
  FormInput,
  IconButton,
  ModalPopup,
  TextButton,
} from '../../components';
import { validateEmail, validatePassword } from '../../validate';

const SignInScreen: React.FC<SignInProps> = ({ navigation, route }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [indicatorEmail, setIndicatorEmail] = useState<string>('');
  const [indicatorPassword, setIndicatorPassword] = useState<string>('');
  const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);
  const [isVisiblePassword, setIsVisiblePasssword] = useState<boolean>(false);
  const [isVisibleModalPopup, setIsVisibleModalPopup] =
    useState<boolean>(false);
  const [titleModalPopup, setTitleModalPopup] = useState<string>('');
  const [subTitleModalPopup, setSubTitleModalPopup] = useState<string>('');

  const handleSignIn = async () => {
    await auth()
      .signInWithEmailAndPassword(email, password)
      .then(value => {
        const uuid = value.user.uid;
        firestore()
          .collection('Users')
          .get()
          .then(querySnapshot => {
            var isUserExists = false;
            querySnapshot.forEach(documentSnapshot => {
              console.log(documentSnapshot.data());
              if (documentSnapshot.data().uuid === uuid) {
                isUserExists = true;
                return;
              }
            });

            isUserExists
              ? navigation.reset({
                  index: 0,
                  routes: [{ name: 'BottomTab' }],
                })
              : navigation.navigate('WelcomeUser');
          });
      })
      .catch(error => {
        setIsVisibleModalPopup(true);
        setTitleModalPopup('Đăng nhập thất bại');
        setSubTitleModalPopup(
          'Mật khẩu hoặc tài khoản không đúng, vui lòng kiểm tra lại !',
        );
      });
  };

  const onChangTextEmail = (text: string) => {
    setEmail(text);
    if (validateEmail(text)) {
      setIndicatorEmail(types.IndicatorEmail.VALID_EMAIL);
      setIsEmailValid(true);
    } else {
      setIndicatorEmail(types.IndicatorEmail.INVALID_EMAIL);
      setIsEmailValid(false);
    }
  };

  const onChangTextPassword = (text: string) => {
    setPassword(text);
    if (validatePassword(text)) {
      setIndicatorPassword(types.IndicatorPassword.VALID_PASSWORD);
      setIsPasswordValid(true);
    } else {
      setIndicatorPassword(types.IndicatorPassword.INVALID_PASSWORD);
      setIsPasswordValid(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <IconButton
        containerStyle={{
          position: 'absolute',
          left: SIZES.padding,
          top: SIZES.padding - 5,
        }}
        icon={icons.back_icon}
        iconStyle={{
          tintColor: COLORS.dark60,
          width: 25,
          height: 25,
        }}
        onPress={() => navigation.goBack()}
      />
      <Image source={images.logo} style={styles.logo} />
      <View style={{ marginTop: SIZES.padding }}>
        <Shadow>
          <View style={styles.signInFormContainer}>
            <Text style={styles.title}>Đăng nhập để tiếp tục</Text>
            <FormInput
              containerStyle={{
                marginTop: SIZES.padding,
                borderRadius: SIZES.radius,
                backgroundColor: COLORS.error,
              }}
              inputStyle={{
                color: COLORS.black,
              }}
              placeholder="Email"
              prependComponent={
                <Image
                  source={icons.email_icon}
                  style={{
                    width: 25,
                    height: 25,
                    marginRight: SIZES.base,
                    tintColor: COLORS.grey,
                  }}
                />
              }
              value={email}
              onChange={onChangTextEmail}
            />
            <Text
              style={[
                styles.indicatorText,
                {
                  color:
                    indicatorEmail === types.IndicatorEmail.INVALID_EMAIL
                      ? COLORS.error
                      : COLORS.darkGreen,
                },
              ]}>
              {indicatorEmail}
            </Text>
            <FormInput
              containerStyle={{
                marginTop: SIZES.padding,
                borderRadius: SIZES.radius,
                backgroundColor: COLORS.error,
              }}
              inputStyle={{
                color: COLORS.black,
              }}
              placeholder="Mật khẩu"
              secureTextEntry={!isVisiblePassword}
              prependComponent={
                <Image
                  source={icons.padlock_icon}
                  style={{
                    width: 25,
                    height: 25,
                    marginRight: SIZES.base,
                    tintColor: COLORS.grey,
                  }}
                />
              }
              appendComponent={
                <IconButton
                  icon={isVisiblePassword ? icons.eye_icon : icons.eye_off_icon}
                  iconStyle={{
                    width: 20,
                    height: 20,
                    tintColor: COLORS.grey,
                  }}
                  onPress={() => setIsVisiblePasssword(!isVisiblePassword)}
                />
              }
              value={password}
              onChange={onChangTextPassword}
            />
            <Text
              style={[
                styles.indicatorText,
                {
                  color:
                    indicatorPassword ===
                    types.IndicatorPassword.INVALID_PASSWORD
                      ? COLORS.error
                      : COLORS.darkGreen,
                },
              ]}>
              {indicatorPassword}
            </Text>
            <View style={{ alignItems: 'flex-end' }}>
              <TextButton
                label="Quên mật khẩu ?"
                contentContainerStyle={{
                  marginTop: SIZES.radius,
                  backgroundColor: 'transparent',
                }}
                labelStyle={{
                  ...FONTS.h4,
                }}
                onPress={() => navigation.navigate('ForgotPassword')}
              />
            </View>
            <View style={{ marginTop: SIZES.padding }}>
              <CustomButton
                backgroundColor={
                  isEmailValid && isPasswordValid ? COLORS.primary : COLORS.gray
                }
                disabled={!isEmailValid || !isPasswordValid}
                color={COLORS.light}
                text="Đăng nhập"
                borderRadius={SIZES.radius}
                paddingHorizontal={15}
                paddingVertical={18}
                onPress={() => handleSignIn()}
              />
            </View>
          </View>
        </Shadow>
      </View>

      <View style={styles.footerContainer}>
        <Text style={styles.textFooter}>Bạn chưa có tài khoản ?</Text>
        <TextButton
          label="Tạo tài khoản"
          contentContainerStyle={{
            marginTop: SIZES.radius,
            backgroundColor: 'transparent',
          }}
          labelStyle={{
            ...FONTS.h4,
          }}
          onPress={() => navigation.navigate('RegisterByEmail')}
        />
      </View>

      <View style={styles.socicalLoginContainer}>
        <Text style={styles.titleSocicalLogin}>Hoặc đăng nhập với </Text>
        <View
          style={{
            flexDirection: 'row',
            marginTop: SIZES.radius,
          }}>
          <IconButton
            icon={icons.sms_icon}
            iconStyle={{
              tintColor: COLORS.dark,
            }}
            containerStyle={styles.socicalButtonContainer}
            onPress={() => navigation.navigate('PhoneAuth')}
          />
          <IconButton
            icon={icons.facebook_icon}
            iconStyle={{
              tintColor: COLORS.dark,
            }}
            containerStyle={[
              styles.socicalButtonContainer,
              { marginLeft: SIZES.radius },
            ]}
            onPress={() => {}}
          />
        </View>
      </View>
      <ModalPopup visible={isVisibleModalPopup}>
        <View>
          <View>
            <Text style={styles.titleModal}>{titleModalPopup}</Text>
            <Text style={styles.subTitleModal}>{subTitleModalPopup}</Text>
          </View>
          <TextButton
            contentContainerStyle={styles.buttonModal}
            label="Đóng"
            labelStyle={{
              color: COLORS.white,
            }}
            onPress={() => setIsVisibleModalPopup(!isVisibleModalPopup)}
          />
        </View>
      </ModalPopup>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
    backgroundColor: COLORS.lightGray,
  },
  logo: {
    alignSelf: 'center',
    width: 70,
    height: 70,
  },
  signInFormContainer: {
    width: SIZES.width - SIZES.padding * 2,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.radius * 2,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.white,
  },
  title: {
    width: '60%',
    color: COLORS.dark,
    ...FONTS.h1,
    lineHeight: 40,
  },
  forgotPasswordText: {
    color: COLORS.secondary,
    ...FONTS.h4,
  },
  footerContainer: {
    flexDirection: 'row',
    height: 80,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginTop: -30,
    backgroundColor: COLORS.light60,
    marginHorizontal: SIZES.radius,
    paddingBottom: SIZES.radius,
    borderBottomLeftRadius: SIZES.radius,
    borderBottomRightRadius: SIZES.radius,
    zIndex: -1,
  },
  textFooter: {
    color: COLORS.grey,
    marginRight: SIZES.radius,
    ...FONTS.body4,
  },
  socicalLoginContainer: {
    flex: 1,
    marginTop: SIZES.padding2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleSocicalLogin: {
    color: COLORS.dark,
    ...FONTS.h3,
  },
  socicalButtonContainer: {
    width: 55,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.grey20,
  },
  indicatorText: {
    ...FONTS.body4,
    paddingHorizontal: SIZES.radius,
    marginTop: 3,
  },
  titleModal: {
    ...FONTS.h3,
    color: COLORS.dark,
  },
  subTitleModal: {
    ...FONTS.body3,
    marginTop: SIZES.padding,
  },
  buttonModal: {
    marginTop: SIZES.padding,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    alignSelf: 'flex-end',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
});

export default SignInScreen;
