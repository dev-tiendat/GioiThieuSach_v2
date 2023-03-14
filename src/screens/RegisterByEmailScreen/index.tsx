import React, {useState} from 'react';
import {StyleSheet, SafeAreaView, View, Image, Text} from 'react-native';
import auth from '@react-native-firebase/auth';
import {Shadow} from 'react-native-shadow-2';
import {COLORS, FONTS, SIZES, images, icons, types} from '../../constants';
import {
  CustomButton,
  FormInput,
  IconButton,
  ModalPopup,
  TextButton,
} from '../../components';
import {RegisterByEmailScreenProps} from '../../navigation/types';
import {validateEmail, validatePassword} from '../../validate';

const RegisterByEmailScreen: React.FC<RegisterByEmailScreenProps> = ({
  navigation,
}) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [indicatorEmail, setIndicatorEmail] = useState<string>('');
  const [indicatorPassword, setIndicatorPassword] = useState<string>('');
  const [indicatorConfirmPassword, setIndicatorConfirmPassword] =
    useState<string>('');
  const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] =
    useState<boolean>(false);
  const [isVisiblePassword, setIsVisiblePassword] = useState<boolean>(false);
  const [isVisibleConfirmPassword, setIsVisibleConfirmPassword] =
    useState<boolean>(false);
  const [isVisibleModalPopup, setIsVisibleModalPopup] =
    useState<boolean>(false);
  const [titleModalPopup, setTitleModalPopup] = useState<string>('');
  const [subTitleModalPopup, setSubTitleModalPopup] = useState<string>('');

  const handleResigterByEmail = async () => {
    await auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        setTimeout(() => {
          navigation.navigate('SignIn');
        }, 2000);
        setIsVisibleModalPopup(true);
        setTitleModalPopup('Đăng ký thành công');
        setSubTitleModalPopup('Đang chuyển hướng đến trang đăng nhập !');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          setIsVisibleModalPopup(true);
          setTitleModalPopup('Tài khoản đã tồn tại');
          setSubTitleModalPopup(
            'Tài khoản đăng ký đã tồn tài, vui lòng kiểm tra lại !',
          );
        }
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

  const comparePassword = (password: string, confirmPassword: string) =>
    password == confirmPassword;

  const onChangTextConfirmPassword = (text: string) => {
    setConfirmPassword(text);

    if (!validatePassword(text)) {
      setIndicatorConfirmPassword(types.IndicatorPassword.INVALID_PASSWORD);
      setIsConfirmPasswordValid(false);
    } else if (comparePassword(password, text)) {
      setIndicatorConfirmPassword(
        types.IndicatorConfirmPassword.VALID_CONFIRM_PASSWORD,
      );
      setIsConfirmPasswordValid(true);
    } else {
      setIndicatorConfirmPassword(
        types.IndicatorConfirmPassword.INVALID_CONFIRM_PASSWORD,
      );
      setIsConfirmPasswordValid(false);
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
      <View style={{marginTop: SIZES.padding}}>
        <Shadow>
          <View style={styles.signInFormContainer}>
            <Text style={styles.title}>Tạo tài khoản mới</Text>
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
                  onPress={() => setIsVisiblePassword(!isVisiblePassword)}
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
            <FormInput
              containerStyle={{
                marginTop: SIZES.padding,
                borderRadius: SIZES.radius,
                backgroundColor: COLORS.error,
              }}
              inputStyle={{
                color: COLORS.black,
              }}
              secureTextEntry={!isVisibleConfirmPassword}
              placeholder="Xác nhận lại mật khẩu"
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
                  icon={
                    isVisibleConfirmPassword
                      ? icons.eye_icon
                      : icons.eye_off_icon
                  }
                  iconStyle={{
                    width: 20,
                    height: 20,
                    tintColor: COLORS.grey,
                  }}
                  onPress={() =>
                    setIsVisibleConfirmPassword(!isVisibleConfirmPassword)
                  }
                />
              }
              value={confirmPassword}
              onChange={onChangTextConfirmPassword}
            />
            <Text
              style={[
                styles.indicatorText,
                {
                  color: !(
                    indicatorConfirmPassword ===
                    types.IndicatorConfirmPassword.VALID_CONFIRM_PASSWORD
                  )
                    ? COLORS.error
                    : COLORS.darkGreen,
                },
              ]}>
              {indicatorConfirmPassword}
            </Text>

            <View style={{marginTop: SIZES.padding}}>
              <CustomButton
                backgroundColor={
                  isEmailValid && isPasswordValid && isConfirmPasswordValid
                    ? COLORS.primary
                    : COLORS.gray
                }
                color={COLORS.light}
                disabled={
                  !(isEmailValid && isPasswordValid && isConfirmPasswordValid)
                }
                text="Tạo tài khoản"
                borderRadius={SIZES.radius}
                paddingHorizontal={15}
                paddingVertical={18}
                onPress={() => handleResigterByEmail()}
              />
            </View>
          </View>
        </Shadow>
      </View>

      <View style={styles.footerContainer}>
        <Text style={styles.textFooter}>Bạn đã có tài khoản ?</Text>
        <TextButton
          label="Đăng nhập"
          contentContainerStyle={{
            marginTop: SIZES.radius,
            backgroundColor: 'transparent',
          }}
          labelStyle={{
            ...FONTS.h4,
          }}
          onPress={() => navigation.navigate('SignIn')}
        />
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
    // marginTop: SIZES.padding,
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

export default RegisterByEmailScreen;
