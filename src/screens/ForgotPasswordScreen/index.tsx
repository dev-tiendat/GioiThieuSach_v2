import React, {useState} from 'react';
import {StyleSheet, SafeAreaView, View, Text} from 'react-native';
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
import {ForgotPasswordScreenProps} from '../../navigation/types';
import {Image} from 'react-native-animatable';
import {validateEmail} from '../../validate';

const ForgotPassword: React.FC<ForgotPasswordScreenProps> = ({navigation}) => {
  const [email, setEmail] = useState<string>('');
  const [indicatorEmail, setIndicatorEmail] = useState<string>('');
  const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
  const [isVisibleModalPopup, setIsVisibleModalPopup] =
    useState<boolean>(false);
  const [titleModalPopup, setTitleModalPopup] = useState<string>('');
  const [subTitleModalPopup, setSubTitleModalPopup] = useState<string>('');
  const sendPasswordResetMail = async () => {
    await auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        setTimeout(() => {
          navigation.navigate('SignIn');
        }, 3000);
        setIsVisibleModalPopup(true);
        setTitleModalPopup('Đặt lại mật khẩu');
        setSubTitleModalPopup(
          'Yêu cầu khôi phục mật khẩu đã được gửi,vui lòng kiểm tra lại email của bạn !',
        );
      })
      .catch(error => {
        if ((error.code = 'auth/user-not-found')) {
          setIsVisibleModalPopup(true);
          setTitleModalPopup('Email chưa đăng ký');
          setSubTitleModalPopup(
            'Tài khoản Email này chưa được đăng ký , vui lòng kiểm tra lại !',
          );
        }
      });
  };

  const onChangEmail = (text: string) => {
    setEmail(text);
    if (validateEmail(text)) {
      setIndicatorEmail(types.IndicatorEmail.VALID_EMAIL);
      setIsEmailValid(true);
    } else {
      setIndicatorEmail(types.IndicatorEmail.INVALID_EMAIL);
      setIsEmailValid(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <IconButton
          icon={icons.back_icon}
          iconStyle={{
            tintColor: COLORS.dark60,
            width: SIZES.h2,
            height: SIZES.h2,
          }}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.titleHeader}>Quên mật khẩu</Text>
      </View>
      <View style={{marginTop: SIZES.padding2}}>
        <Shadow>
          <View style={styles.forgotPasswordContainer}>
            <Text style={styles.title}>Nhập vào email để tiếp tục</Text>
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
              autoFocus={true}
              value={email}
              onChange={onChangEmail}
            />
            <Text
              style={[
                styles.indicatorEmail,
                {
                  color:
                    indicatorEmail === types.IndicatorEmail.INVALID_EMAIL
                      ? COLORS.error
                      : COLORS.darkGreen,
                },
              ]}>
              {indicatorEmail}
            </Text>
          </View>
        </Shadow>
      </View>
      <View style={{flex: 1, marginTop: SIZES.padding}}>
        <TextButton
          label="Gửi xác nhận"
          disabled={!isEmailValid}
          onPress={() => sendPasswordResetMail()}
          contentContainerStyle={{
            marginBottom: SIZES.padding * 2,
            backgroundColor: !isEmailValid ? COLORS.gray : COLORS.primary,
            borderRadius: SIZES.radius,
            paddingHorizontal: 15,
            paddingVertical: 18,
          }}
          labelStyle={{
            color: COLORS.light,
            ...FONTS.h3,
          }}
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.padding,
  },
  titleHeader: {
    color: COLORS.dark,
    marginLeft: SIZES.padding,
    ...FONTS.h2,
  },
  forgotPasswordContainer: {
    width: SIZES.width - SIZES.padding * 2,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.radius * 2,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.white,
  },
  indicatorEmail: {
    ...FONTS.body4,
    paddingHorizontal: SIZES.radius,
    marginTop: 3,
  },
  title: {
    width: '60%',
    color: COLORS.dark,
    ...FONTS.h1,
    lineHeight: 40,
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

export default ForgotPassword;
