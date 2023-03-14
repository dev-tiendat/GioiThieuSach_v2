import React, {useState} from 'react';
import {StyleSheet, SafeAreaView, View, Text, Image} from 'react-native';
import auth from '@react-native-firebase/auth';
import {Shadow} from 'react-native-shadow-2';
import {COLORS, FONTS, SIZES, images, icons, types} from '../../constants';
import {FormInput, IconButton, ModalPopup, TextButton} from '../../components';
import {PhoneAuthScreenProps} from '../../navigation/types';
import {validatePhoneNumber} from '../../validate';

const PhoneAuthScreen: React.FC<PhoneAuthScreenProps> = ({navigation}) => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [indicatorPhoneNumber, setIndicatorPhoneNumber] =
    useState<string>('');
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState<boolean>(false);
  const [isVisibleModalPopup, setIsVisibleModalPopup] =
    useState<boolean>(false);
  const [titleModalPopup, setTitleModalPopup] = useState<string>('');
  const [subTitleModalPopup, setSubTitleModalPopup] = useState<string>('');

  const send = async () => {
    const phoneNumberVN = '+84' + phoneNumber;

    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumberVN);
      navigation.navigate('Vertification', {
        confirmation: confirmation,
        phoneNumber: phoneNumberVN,
      });
    } catch (error: any) {
      if (error.code == 'auth/too-many-requests') {
        setIsVisibleModalPopup(true);
        setTitleModalPopup('Gửi mã thất bại');
        setSubTitleModalPopup(
          'Bạn đã gửi mã xác nhận quá nhiều lần trong ngày,vui lòng thử lại vào lúc khác!',
        );
      }
    }
  };

  const onChangeTextPhoneNumber = (phoneNumber: string) => {
    setPhoneNumber(phoneNumber);
    let phoneNumberVN =
      '+84' +
      (phoneNumber.charAt(0) === '0'
        ? phoneNumber.slice(1, phoneNumber.length)
        : phoneNumber);
    if (validatePhoneNumber(phoneNumberVN)) {
      setIndicatorPhoneNumber(
        types.IndicatorPhoneNumber.VALID_PHONE_NUMBER,
      );
      setIsPhoneNumberValid(true);
    } else {
      setIndicatorPhoneNumber(
        types.IndicatorPhoneNumber.INVALID_PHONE_NUMBER,
      );
      setIsPhoneNumberValid(false);
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
        <Text style={styles.titleHeader}>Đăng nhập với số điện thoại</Text>
      </View>
      <View style={{marginTop: SIZES.padding2}}>
        <Shadow>
          <View style={styles.signInWithPhoneNumberContainer}>
            <Text style={styles.title}>Nhập vào số điện thoại để tiếp tục</Text>
            <FormInput
              keyboardType="phone-pad"
              containerStyle={{
                marginTop: SIZES.padding,
                borderRadius: SIZES.radius,
                backgroundColor: COLORS.error,
              }}
              inputStyle={{
                color: COLORS.black,
                
              }}
              autoFocus={true}
              prependComponent={
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={icons.phone_icon}
                    style={{
                      width: 25,
                      height: 25,
                      marginRight: SIZES.base,
                      tintColor: COLORS.grey,
                    }}
                  />
                  <Text
                    style={{
                      ...FONTS.h3,
                      color: COLORS.dark,
                      
                    }}>
                    +84
                  </Text>
                </View>
              }
              value={phoneNumber}
              onChange={onChangeTextPhoneNumber}
            />
            <Text
              style={[
                styles.indicatorText,
                {
                  color:
                    indicatorPhoneNumber ===
                    types.IndicatorPhoneNumber.INVALID_PHONE_NUMBER
                      ? COLORS.error
                      : COLORS.darkGreen,
                },
              ]}>
              {indicatorPhoneNumber}
            </Text>
          </View>
        </Shadow>
      </View>
      <View style={{flex: 1, marginTop: SIZES.padding}}>
        <TextButton
          label="Gửi mã xác nhận"
          disabled={!isPhoneNumberValid}
          onPress={() => send()}
          contentContainerStyle={{
            marginBottom: SIZES.padding * 2,
            backgroundColor: !isPhoneNumberValid ? COLORS.gray : COLORS.primary,
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
  signInWithPhoneNumberContainer: {
    width: SIZES.width - SIZES.padding * 2,
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.radius * 2,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.white,
  },
  indicatorText: {
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

export default PhoneAuthScreen;
