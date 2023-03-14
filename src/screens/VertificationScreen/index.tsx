import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TextInput } from 'react-native';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Shadow } from 'react-native-shadow-2';
import { COLORS, FONTS, SIZES, icons } from '../../constants';
import { IconButton, ModalPopup, TextButton } from '../../components';
import { VertificationScreenProps } from '../../navigation/types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const VertificationScreen: React.FC<VertificationScreenProps> = ({
  navigation,
  route,
}) => {
  const pin1Ref = useRef<TextInput>(null);
  const pin2Ref = useRef<TextInput>(null);
  const pin3Ref = useRef<TextInput>(null);
  const pin4Ref = useRef<TextInput>(null);
  const pin5Ref = useRef<TextInput>(null);
  const pin6Ref = useRef<TextInput>(null);

  const [pin1, setPin1] = useState<string>('');
  const [pin2, setPin2] = useState<string>('');
  const [pin3, setPin3] = useState<string>('');
  const [pin4, setPin4] = useState<string>('');
  const [pin5, setPin5] = useState<string>('');
  const [pin6, setPin6] = useState<string>('');

  const [isVisibleModalPopup, setIsVisibleModalPopup] =
    useState<boolean>(false);
  const [isDisabledSend, setIsDisabledSend] = useState<boolean>(true);
  const [titleModalPopup, setTitleModalPopup] = useState<string>('');
  const [subTitleModalPopup, setSubTitleModalPopup] = useState<string>('');
  const [confirm, setConfirm] = useState<FirebaseAuthTypes.ConfirmationResult>(
    route.params.confirmation,
  );

  const [countdown, setCountdown] = useState<number>(30);
  const [isCountdownCompleted, setIsCountdownCompleted] = useState(false);
  let timer: any;

  useEffect(() => {
    if (!isCountdownCompleted) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      timer = setInterval(() => {
        if (countdown <= 1) {
          setIsCountdownCompleted(true);
        }
        setCountdown(countdown - 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }),
    [isCountdownCompleted];

  useEffect(() => {
    pin1 && pin2 && pin3 && pin4 && pin5 && pin6
      ? setIsDisabledSend(false)
      : setIsDisabledSend(true);
  }, [pin1, pin2, pin3, pin4, pin5, pin6]);

  async function confirmCode() {
    const code = pin1 + pin2 + pin3 + pin4 + pin5 + pin6;
    try {
      await confirm.confirm(code);
      const uuid = auth().currentUser!.uid;
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
    } catch (error: any) {
      console.log(error);

      switch (error.code) {
        case 'auth/session-expired':
          setIsVisibleModalPopup(true);
          setTitleModalPopup('Mã hết hạn');
          setSubTitleModalPopup(
            'Mã xác nhận của bạn đã hết hạn,vui lòng gửi lại mã!',
          );
          break;
        case 'auth/invalid-verification-code':
          setIsVisibleModalPopup(true);
          setTitleModalPopup('Mã xác nhận không đúng');
          setSubTitleModalPopup(
            'Mã xác nhận của bạn không đúng,vui lòng kiểm tra lại mã!',
          );
          break;
      }
    }
  }

  async function resendCode() {
    try {
      const confirm = await auth().signInWithPhoneNumber(
        route.params.phoneNumber,
      );
      setIsCountdownCompleted(false);
      setCountdown(30);
      setConfirm(confirm);
    } catch (error: any) {
      if (error.code === 'auth/too-many-requests') {
        setIsVisibleModalPopup(true);
        setTitleModalPopup('Gửi mã thất bại');
        setSubTitleModalPopup(
          'Bạn đã gửi mã xác nhận quá nhiều lần trong ngày,vui lòng thử lại vào lúc khác!',
        );
      }
    }
  }

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
        <Text style={styles.titleHeader}>Xác nhận</Text>
      </View>
      <View style={{ marginTop: SIZES.padding2 }}>
        <Shadow>
          <View style={styles.OTPInputFormContainer}>
            <Text style={styles.title}>
              Nhập mã OTP gửi đến điện thoại của bạn.
            </Text>
            <View style={{ marginTop: SIZES.padding }}>
              <KeyboardAwareScrollView
                enableOnAndroid={true}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="handled"
                extraScrollHeight={-300}
                contentContainerStyle={{
                  flexGrow: 1,
                  marginTop: SIZES.base,
                  justifyContent: 'center',
                }}>
                <View style={styles.otpContainer}>
                  <TextInput
                    ref={pin1Ref}
                    keyboardType="number-pad"
                    maxLength={1}
                    style={{
                      borderRadius: SIZES.radius,
                      borderWidth: 2,
                      borderColor: COLORS.secondary,
                      backgroundColor: COLORS.lightGray,
                      width: (SIZES.width - SIZES.padding * 2 - 30) / 6,
                      height: (SIZES.width - SIZES.padding * 2 - 30) / 6,
                      color: COLORS.black,
                      ...FONTS.h2,
                    }}
                    textAlign="center"
                    onChangeText={text => {
                      setPin1(text);
                      text != '' ? pin2Ref.current!.focus() : null;
                    }}
                  />
                  <TextInput
                    ref={pin2Ref}
                    keyboardType="number-pad"
                    maxLength={1}
                    style={{
                      borderRadius: SIZES.radius,
                      borderWidth: 2,
                      borderColor: COLORS.secondary,
                      backgroundColor: COLORS.lightGray,
                      width: (SIZES.width - SIZES.padding * 2 - 30) / 6,
                      height: (SIZES.width - SIZES.padding * 2 - 30) / 6,
                      color: COLORS.black,
                      ...FONTS.h2,
                    }}
                    textAlign="center"
                    onChangeText={text => {
                      setPin2(text);
                      text != ''
                        ? pin3Ref.current!.focus()
                        : pin1Ref.current!.focus();
                    }}
                  />
                  <TextInput
                    ref={pin3Ref}
                    keyboardType="number-pad"
                    maxLength={1}
                    style={{
                      borderRadius: SIZES.radius,
                      borderWidth: 2,
                      borderColor: COLORS.secondary,
                      backgroundColor: COLORS.lightGray,
                      width: (SIZES.width - SIZES.padding * 2 - 30) / 6,
                      height: (SIZES.width - SIZES.padding * 2 - 30) / 6,
                      color: COLORS.black,
                      ...FONTS.h2,
                    }}
                    textAlign="center"
                    onChangeText={text => {
                      setPin3(text);
                      text != ''
                        ? pin4Ref.current!.focus()
                        : pin2Ref.current!.focus();
                    }}
                  />
                </View>
                <View style={styles.otpContainer}>
                  <TextInput
                    ref={pin4Ref}
                    keyboardType="number-pad"
                    maxLength={1}
                    style={{
                      borderRadius: SIZES.radius,
                      borderWidth: 2,
                      borderColor: COLORS.secondary,
                      backgroundColor: COLORS.lightGray,
                      width: (SIZES.width - SIZES.padding * 2 - 30) / 6,
                      height: (SIZES.width - SIZES.padding * 2 - 30) / 6,
                      color: COLORS.black,
                      ...FONTS.h2,
                    }}
                    textAlign="center"
                    onChangeText={text => {
                      setPin4(text);
                      text != ''
                        ? pin5Ref.current!.focus()
                        : pin3Ref.current!.focus();
                    }}
                  />
                  <TextInput
                    ref={pin5Ref}
                    keyboardType="number-pad"
                    maxLength={1}
                    style={{
                      borderRadius: SIZES.radius,
                      borderWidth: 2,
                      borderColor: COLORS.secondary,
                      backgroundColor: COLORS.lightGray,
                      width: (SIZES.width - SIZES.padding * 2 - 30) / 6,
                      height: (SIZES.width - SIZES.padding * 2 - 30) / 6,
                      color: COLORS.black,
                      ...FONTS.h2,
                    }}
                    textAlign="center"
                    onChangeText={text => {
                      setPin5(text);
                      text != ''
                        ? pin6Ref.current!.focus()
                        : pin4Ref.current!.focus();
                    }}
                  />
                  <TextInput
                    ref={pin6Ref}
                    keyboardType="number-pad"
                    maxLength={1}
                    style={{
                      borderRadius: SIZES.radius,
                      borderWidth: 2,
                      borderColor: COLORS.secondary,
                      backgroundColor: COLORS.lightGray,
                      width: (SIZES.width - SIZES.padding * 2 - 30) / 6,
                      height: (SIZES.width - SIZES.padding * 2 - 30) / 6,
                      color: COLORS.black,
                      ...FONTS.h2,
                    }}
                    textAlign="center"
                    onChangeText={text => {
                      setPin6(text);
                      text != '' ? null : pin5Ref.current!.focus();
                    }}
                  />
                </View>
              </KeyboardAwareScrollView>

              <View style={{ alignItems: 'center' }}>
                <TextButton
                  onPress={() => resendCode()}
                  label={
                    'Gửi lại mã ' +
                    (!isCountdownCompleted ? `(${countdown})` : '')
                  }
                  contentContainerStyle={{
                    backgroundColor: 'transparent',
                  }}
                  labelStyle={{
                    color: isCountdownCompleted ? COLORS.primary : COLORS.gray,
                  }}
                  disabled={!isCountdownCompleted}
                />
              </View>
            </View>
          </View>
        </Shadow>
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
      <View style={{ flex: 1, marginTop: SIZES.padding }}>
        <TextButton
          label="Xác nhận"
          disabled={isDisabledSend}
          onPress={() => confirmCode()}
          contentContainerStyle={{
            marginBottom: SIZES.padding * 2,
            backgroundColor: !isDisabledSend ? COLORS.primary : COLORS.gray,
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
  OTPInputFormContainer: {
    width: SIZES.width - SIZES.padding * 2,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.radius * 2,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.white,
  },
  title: {
    width: '70%',
    color: COLORS.dark,
    ...FONTS.h1,
    lineHeight: 40,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: SIZES.padding,
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

export default VertificationScreen;
