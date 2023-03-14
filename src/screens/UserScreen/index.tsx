import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  Image,
  ScrollView,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { COLORS, FONTS, images, SIZES } from '../../constants';
import { TextButton } from '../../components';

type User = {
  uuid: string;
  name: string;
  avatarUrl: string;
};

const UserScreen = ({ navigation, route }: any) => {
  const [profile, setProfile] = useState<User | null>(null);
  const uidUser = useRef<string>(auth().currentUser!.uid);
  const email = auth().currentUser?.email;
  const phoneNumber = auth().currentUser?.phoneNumber;

  useEffect(() => {
    getProfile();
    const subscriber = firestore()
      .collection('Users')
      .doc(uidUser.current)
      .onSnapshot(documentSnapshot => {
        setProfile(documentSnapshot.data() as User);
      });

    return () => subscriber();
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
            }
          });
        });
    } catch {}
  };

  const handleLogOut = async () => {
    try {
      await auth().signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: 'BottomTab' }],
      });
    } catch (error: any) {
      console.log(error);
    }
  };

  const handlePressEditButton = () => {
    navigation.navigate('EditProfile');
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titleHeader}>Thông tin tài khoản</Text>
      </View>
      {/* <ScrollView> */}
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={
            { uri: profile?.avatarUrl }
            // images.avatar
          }
          style={styles.avatar}
        />
        {email && <Text style={styles.uid}>Email :{email}</Text>}
        {phoneNumber && (
          <Text style={styles.uid}>Số điện thoại :{phoneNumber}</Text>
        )}
      </View>
      <View style={styles.infoUserContainer}>
        <Text style={styles.labelInfo}>Tên người dùng</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.textInfo}>{profile?.name}</Text>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          // height: '100%',
          alignItems: 'center',
          justifyContent: 'flex-end',
          marginBottom: 110,
          // backgroundColor: 'red'
        }}>
        <TextButton
          label="Sửa thông tin"
          onPress={() => handlePressEditButton()}
          contentContainerStyle={{
            paddingVertical: SIZES.radius,
            paddingHorizontal: SIZES.padding,
            borderRadius: 100,
          }}
          labelStyle={{
            color: COLORS.white,
            ...FONTS.h2,
          }}
        />
        <TextButton
          label="Đăng xuất"
          onPress={() => handleLogOut()}
          contentContainerStyle={{
            marginTop: SIZES.padding,
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
      {/* </ScrollView> */}
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SIZES.padding,
    paddingHorizontal: SIZES.padding,
  },
  titleHeader: {
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
  },
  labelInfo: {
    ...FONTS.h3,
    color: COLORS.dark,
  },
  infoContainer: {
    marginTop: SIZES.radius,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.radius,
    backgroundColor: COLORS.white,
    borderRadius: 50,
    elevation: 10,
  },
  textInfo: {
    ...FONTS.h2,
    color: COLORS.black,
  },
});

export default UserScreen;
