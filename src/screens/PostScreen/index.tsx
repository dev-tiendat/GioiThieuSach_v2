import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import firestore from '@react-native-firebase/firestore';
import {firebase} from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import {IconButton, ModalPopup, TextButton} from '../../components';
import {COLORS, FONTS, icons, images, SIZES} from '../../constants';
import {PostsScreenProps} from '../../navigation/types';
import {Shadow} from 'react-native-shadow-2';

const PostsScreen: React.FC<PostsScreenProps> = ({navigation}) => {
  const [posts, setPosts] = useState<any>([]);
  const user = auth().currentUser!.uid;
  const [isVisibleModalPopup, setIsVisibleModalPopup] =
    useState<boolean>(false);
  const [titleModalPopup, setTitleModalPopup] = useState<string>('');
  const [subTitleModalPopup, setSubTitleModalPopup] = useState<string>('');
  const [deletePostId, setDeletePostId] = useState<string>('');

  useEffect(() => {
    const subscriber = firestore()
      .collection('Posts')
      .onSnapshot(() => {
        loadPost();
      });

    return subscriber;
  }, []);

  const loadPost = async () => {
    firestore()
      .collection('Posts')
      .get()
      .then(querySnapshot => {
        const data: any = [];
        querySnapshot.forEach(documentSnapshot => {
          const post = documentSnapshot.data();
          if (post.authorPostId == user) {
            data.push(post);
          }
        });
        setPosts(data);
      });
  };

  const handleDeletePost = async (id: string) => {
    try {
      await firebase
        .app()
        .database(
          'https://bookintroduction-b31d0-default-rtdb.asia-southeast1.firebasedatabase.app/',
        )
        .ref(`/PostComments/${id}/`)
        .remove();

      await firestore().collection('Posts').doc(id).delete();

      const reference = storage().ref(`BookPictures/${id}.png`);
      await reference.delete();
    } catch (error) {
      console.log(error);
    }
  };

  const handlePressDeletePost = (id: string) => {
    setDeletePostId(id);
    setIsVisibleModalPopup(true);
    setTitleModalPopup('Xóa bài viết');
    setSubTitleModalPopup('Bạn chắc chắn muốn xóa bài viết chứ ?');
  };

  const renderPost = ({item}: any) => {
    return (
      <View style={{margin: SIZES.base}}>
        <Shadow distance={4}>
          <TouchableOpacity
            style={{
              width: SIZES.width / 2 - 30,
              marginTop: SIZES.radius,
              paddingHorizontal: SIZES.radius,
              borderRadius: SIZES.radius,
            }}
            onPress={() =>
              navigation.navigate('BookDetails', {postId: item.bookId})
            }>
            <FastImage
              source={{uri: item.bookPicture}}
              style={{
                width: '100%',
                height: 180,
              }}
              resizeMode="contain"
            />
            <View style={{alignItems: 'center', marginTop: SIZES.radius}}>
              <Text style={{...FONTS.h3, color: COLORS.dark, height: 40}}>
                {item.bookTitle}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
                marginVertical: SIZES.radius,
              }}>
              <IconButton
                icon={icons.edit_icon}
                containerStyle={{
                  marginRight: SIZES.radius,
                }}
                iconStyle={{
                  width: 30,
                  height: 30,
                  tintColor: COLORS.primary,
                }}
                onPress={() => navigation.navigate('EditPost', {post: item})}
              />
              <IconButton
                icon={icons.delete_icon}
                iconStyle={{
                  width: 30,
                  height: 30,
                  tintColor: COLORS.primary,
                }}
                onPress={() => handlePressDeletePost(item.bookId)}
              />
            </View>
          </TouchableOpacity>
        </Shadow>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titleHeader}>Quản lý bài viết</Text>
      <IconButton
        icon={icons.plus_icon}
        containerStyle={styles.postCreateButton}
        iconStyle={{
          tintColor: COLORS.white,
        }}
        onPress={() => navigation.navigate('CreatePostScreen')}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{flex: 1}}>
          <ScrollView horizontal={true} style={{width: '100%'}}>
            <FlatList
              data={posts}
              renderItem={renderPost}
              horizontal={false}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              style={{
                marginBottom: 110,
              }}
            />
          </ScrollView>
        </View>
      </ScrollView>
      <ModalPopup visible={isVisibleModalPopup}>
        <View>
          <View>
            <Text style={styles.titleModal}>{titleModalPopup}</Text>
            <Text style={styles.subTitleModal}>{subTitleModalPopup}</Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            <TextButton
              contentContainerStyle={styles.buttonModal}
              label="Xác nhận xóa"
              labelStyle={{
                color: COLORS.white,
              }}
              onPress={() => {
                handleDeletePost(deletePostId);
                setIsVisibleModalPopup(!isVisibleModalPopup);
              }}
            />
            <TextButton
              contentContainerStyle={styles.buttonModal}
              label="Hủy"
              labelStyle={{
                color: COLORS.white,
              }}
              onPress={() => setIsVisibleModalPopup(!isVisibleModalPopup)}
            />
          </View>
        </View>
      </ModalPopup>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleHeader: {
    color: COLORS.dark,
    ...FONTS.h2,
    marginVertical: SIZES.padding,
  },
  postCreateButton: {
    position: 'absolute',
    bottom: 100,
    right: 30,
    zIndex: 1,
    width: 55,
    height: 55,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
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
    marginLeft: SIZES.padding,
    marginTop: SIZES.padding,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    alignSelf: 'flex-end',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
});

export default PostsScreen;
