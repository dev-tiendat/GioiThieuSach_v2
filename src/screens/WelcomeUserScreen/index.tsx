import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-crop-picker';
import firestore from '@react-native-firebase/firestore';
import { Shadow } from 'react-native-shadow-2';
import { WelcomeUserScreenProps } from '../../navigation/types';
import { COLORS, FONTS, SIZES, icons, types } from '../../constants';
import { FormInput, IconButton, TextButton } from '../../components';
import { validateUserName } from '../../validate';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const CROP_SIZE = 200;

const WelcomeUserScreen: React.FC<WelcomeUserScreenProps> = ({
  navigation,
}) => {
  const [pathImage, setPathImage] = useState<string>();
  const uuid = useRef<string>('');
  const reference = storage().ref(`AvatarImages/${uuid.current}.png`);
  const [indicatorUserName, setIndicatorUserName] = useState<string>('');
  const [isUserNameValid, setIsUserValid] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    uuid.current = auth().currentUser!.uid;
  }, []);

  const handlePressSelectImage = () => {
    ImagePicker.openPicker({
      width: CROP_SIZE,
      height: CROP_SIZE,
      cropping: true,
    }).then(image => {
      setPathImage(image.path);
    });
  };

  const onChangTextUserName = (text: string) => {
    setUserName(text);
    if (validateUserName(text)) {
      setIndicatorUserName(types.IndicatorUserName.VALID_USER_NAME);
      setIsUserValid(true);
    } else {
      setIndicatorUserName(types.IndicatorUserName.INVALID_USER_NAME);
      setIsUserValid(false);
    }
  };

  const handlePressCreateUserProfile = async () => {
    await reference
      .putFile(pathImage!)
      .then(() => {
        console.log('thành công');
      })
      .catch(error => {
        console.log(error);
      });

    const avatarUrl = await reference.getDownloadURL();

    await firestore()
      .collection('Users')
      .doc(uuid.current)
      .set({
        name: userName,
        avatarUrl: avatarUrl,
        uuid: uuid.current,
        likedPosts: [],
      })
      .then(() => {
        console.log('User added!');
      });

    navigation.reset({
      index: 0,
      routes: [{ name: 'BottomTab' }],
    });
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
      </View>
      <View style={{ marginTop: SIZES.padding }}>
        <Shadow>
          <View style={styles.formContainer}>
            <Text style={styles.title}>Cập nhật thông tin để tiếp tục</Text>
            <TouchableOpacity
              style={styles.avatarContainer}
              onPress={handlePressSelectImage}>
              <Image
                style={styles.avatar}
                source={pathImage ? { uri: pathImage } : icons.avatar_icon}
              />
              <Text style={styles.avatarText}>Ảnh đại diện</Text>
            </TouchableOpacity>
            <KeyboardAwareScrollView>
              <FormInput
                containerStyle={{
                  marginTop: SIZES.padding,
                  borderRadius: SIZES.radius,
                  backgroundColor: COLORS.error,
                }}
                inputStyle={{
                  color: COLORS.black,
                }}
                placeholder="Tên của bạn là gì ?"
                value={userName}
                onChange={onChangTextUserName}
              />
              <Text
                style={[
                  styles.indicatorText,
                  {
                    color:
                      indicatorUserName ===
                      types.IndicatorUserName.INVALID_USER_NAME
                        ? COLORS.error
                        : COLORS.darkGreen,
                  },
                ]}>
                {indicatorUserName}
              </Text>
            </KeyboardAwareScrollView>
          </View>
        </Shadow>
      </View>
      <View style={{ flex: 1, marginTop: SIZES.padding }}>
        <TextButton
          label="Tiếp tục"
          onPress={() => handlePressCreateUserProfile()}
          contentContainerStyle={[
            styles.continueBtn,
            !isUserNameValid ? styles.btn : styles.btnActive,
          ]}
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
    backgroundColor: COLORS.white,
    paddingHorizontal: SIZES.padding,
  },
  headerContainer: {
    alignItems: 'flex-start',
  },
  title: {
    width: '60%',
    color: COLORS.dark,
    ...FONTS.h1,
    lineHeight: 40,
  },
  formContainer: {
    width: SIZES.width - SIZES.padding * 2,
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.radius * 2,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.white,
  },
  avatarContainer: {
    marginTop: SIZES.padding,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 100,
  },
  avatarText: {
    ...FONTS.h3,
    color: COLORS.secondary,
    marginTop: SIZES.base,
  },
  indicatorText: {
    ...FONTS.body4,
    paddingHorizontal: SIZES.radius,
    marginTop: 3,
  },
  continueBtn: {
    marginBottom: SIZES.padding * 2,
    borderRadius: SIZES.radius,
    paddingHorizontal: 15,
    paddingVertical: 18,
  },
  btn: {
    backgroundColor: COLORS.gray,
  },
  btnActive: {
    backgroundColor: COLORS.primary,
  },
});

export default WelcomeUserScreen;
