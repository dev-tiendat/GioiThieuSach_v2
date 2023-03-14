import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {COLORS, FONTS, icons, images, SIZES} from '../../constants';
import {IconButton, TextButton} from '../../components';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

type User = {
  uuid: string;
  name: string;
  avatarUrl: string;
};

const EditProfileScreen = ({navigation, route}: any) => {
  const [profile, setProfile] = useState<User | null>(null);
  const [userName, setUserName] = useState<string>('');
  const email = auth().currentUser?.email;
  const phoneNumber = auth().currentUser?.phoneNumber;
  const uidUser = useRef<string>(auth().currentUser!.uid);

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = () => {
    try {
      firestore()
        .collection('Users')
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(documentSnapshot => {
            const user = documentSnapshot.data();
            if (user.uuid == uidUser.current) {
              setProfile(user as User);
              setUserName(user.name);
            }
          });
        });
    } catch {}
  };

  const handleUpdateProfile = () => {
    try {
      firestore().collection('Users').doc(uidUser.current).update({
        name: userName,
      });

      navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon={icons.back_icon}
          iconStyle={{
            tintColor: COLORS.dark60,
            width: SIZES.h2,
            height: SIZES.h2,
          }}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.titleHeader}>Chỉnh sửa thông tin</Text>
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={
            {uri: profile?.avatarUrl}
            // images.avatar
          }
          style={styles.avatar}
        />
        {email && <Text style={styles.uid}>Email :{email}</Text>}
        {phoneNumber && (
          <Text style={styles.uid}>Số điện thoại :{phoneNumber}</Text>
        )}
      </View>
      {/* <KeyboardAwareScrollView style={{paddingVertical: SIZES.padding}}> */}
      <View style={styles.infoUserContainer}>
        <Text style={styles.labelInfo}>Tên người dùng</Text>
        <View style={styles.infoContainer}>
          <TextInput
            style={styles.textInfo}
            value={userName}
            onChangeText={text => setUserName(text)}
          />
        </View>
      </View>
      {/* </KeyboardAwareScrollView> */}
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          //   justifyContent: 'flex-start',
        }}>
        <TextButton
          label="Lưu thông tin"
          onPress={() => handleUpdateProfile()}
          contentContainerStyle={{
            // marginBottom: 110,
            paddingVertical: SIZES.radius,
            paddingHorizontal: SIZES.padding,
            borderRadius: 100,
          }}
          labelStyle={{
            color: COLORS.white,
            ...FONTS.h2,
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.padding,
    paddingHorizontal: SIZES.padding,
  },
  titleHeader: {
    marginLeft: SIZES.padding,
    color: COLORS.dark,
    ...FONTS.h2,
  },
  avatar: {
    width: 200,
    height: 200,
    marginTop: SIZES.padding,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: COLORS.gray,
  },
  uid: {
    ...FONTS.body4,
    color: COLORS.gray,
    marginTop: SIZES.base,
  },
  infoUserContainer: {
    marginTop: SIZES.padding,
    paddingHorizontal: SIZES.padding * 2,
    paddingBottom: SIZES.radius,
    height: SIZES.height * 0.4,
  },
  labelInfo: {
    ...FONTS.h3,
    color: COLORS.dark,
  },
  infoContainer: {
    marginTop: SIZES.radius,
    paddingHorizontal: SIZES.padding,
    // paddingVertical: SIZES.radius,
    backgroundColor: COLORS.white,
    borderRadius: 50,
    elevation: 10,
  },
  textInfo: {
    ...FONTS.h2,
    color: COLORS.black,
    // textAlign: 'center'
  },
});

export default EditProfileScreen;
