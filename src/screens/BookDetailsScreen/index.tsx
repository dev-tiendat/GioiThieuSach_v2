import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { IconButton, TextButton } from '../../components';
import { COLORS, FONTS, icons, SIZES } from '../../constants';
import { Post } from '../../constants/interface';

const BookDetailsScreen = ({ navigation, route }: any) => {
  const [post, setPost] = useState<Post>();
  const [likedPost, setLikedPost] = useState<boolean>();
  const [likedPostList, setLikedPostList] = useState<string[]>([]);
  const uidUser = auth().currentUser?.uid;
  const [authorPostInfo, setAuthorPostInfo] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const subscriber = firestore()
      .collection('Posts')
      .doc(route.params.postId)
      .onSnapshot((documentSnapshot: any) => {
        setPost(documentSnapshot.data());
      });

    return () => subscriber();
  }, []);

  useEffect(() => {
    if (post) {
      firestore()
        .collection('Users')
        .doc(post.authorPostId)
        .get()
        .then(documentSnapshot => {
          setAuthorPostInfo(documentSnapshot.data());
        });
    }
  }, [post]);

  useEffect(() => {
    let subscriber: any;
    if (uidUser) {
      subscriber = firestore()
        .collection('Users')
        .doc(uidUser)
        .onSnapshot((documentSnapshot: any) => {
          let likedList: string[] = [];
          let likedPost = false;

          documentSnapshot.data().likedPosts.forEach((item: string) => {
            likedList.push(item);
            if (item == route.params.postId) {
              likedPost = true;
            }
          });

          setLikedPost(likedPost);
          setLikedPostList(likedList);
        });
    }

    return () => subscriber();
  }, []);

  const handlePressLike = async () => {
    if (uidUser && post) {
      setLoading(true);

      let list: string[] = [...likedPostList];
      let numberOfLikes = post.numberOfLikes;
      if (likedPost) {
        list = list.filter(item => item != post.bookId);
        numberOfLikes -= 1;
      } else {
        list.push(post.bookId);
        numberOfLikes += 1;
      }
      setLikedPostList(list);

      await firestore().collection('Users').doc(uidUser).update({
        likedPosts: list,
      });

      await firestore().collection('Posts').doc(post.bookId).update({
        numberOfLikes: numberOfLikes,
      });

      setLoading(false);
    }

    if (!uidUser) {
      navigation.navigate('SignIn');
    }
  };

  if (post) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
        <View style={styles.header}>
          <IconButton
            icon={icons.back_icon}
            iconStyle={{
              tintColor: COLORS.dark60,
              width: SIZES.h2,
              height: SIZES.h2,
              position: 'absolute',
            }}
            onPress={() => navigation.goBack()}
          />
          <View>
            <View>
              {authorPostInfo && (
                <Text
                  style={{
                    color: COLORS.dark,
                    ...FONTS.h2,
                    marginLeft: SIZES.padding,
                  }}>
                  Bài viết của {authorPostInfo.name}
                </Text>
              )}
            </View>
          </View>
        </View>
        <View
          style={{
            flex: 0.4,
            backgroundColor: COLORS.white,
          }}>
          <FastImage
            style={{
              flex: 1,
            }}
            source={{ uri: post.bookPicture }}
            resizeMode={'contain'}
          />
        </View>
        <View style={styles.detailsContainer}>
          <TouchableOpacity
            disabled={loading}
            style={styles.likeIconContainer}
            onPress={() => handlePressLike()}>
            <ImageBackground
              source={icons.like_icon}
              style={[
                {
                  width: 40,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}
              imageStyle={[!likedPost && { tintColor: COLORS.gray }]}>
              <Text
                style={{
                  ...FONTS.h4,
                  fontSize: 12,
                  color: COLORS.white,
                }}>
                {post.numberOfLikes}
              </Text>
            </ImageBackground>
          </TouchableOpacity>
          <View style={styles.chatIconContainer}>
            <IconButton
              icon={icons.chat_icon}
              iconStyle={{
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
                tintColor: COLORS.primary,
              }}
              onPress={() => {
                if (!uidUser) {
                  navigation.navigate('SignIn');
                } else {
                  navigation.navigate('PostComment', {
                    postId: route.params.postId,
                    bookTitle: post.bookTitle,
                  });
                }
              }}
            />
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ paddingHorizontal: SIZES.padding }}>
              <Text style={styles.bookTitle}>{post.bookTitle}</Text>
              <Text style={styles.authorBook}>
                Tác giả sách : {post.authorBook}
              </Text>
            </View>
            <View
              style={{
                paddingHorizontal: SIZES.padding,
                marginTop: SIZES.base,
                alignItems: 'flex-start',
              }}>
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 8,
                  backgroundColor: COLORS.secondary,
                  borderRadius: 30,
                }}>
                <Text style={styles.category}>{post.category} </Text>
              </View>
              <View
                style={{
                  width: '100%',
                  height: 2,
                  backgroundColor: COLORS.gray,
                  marginVertical: SIZES.base,
                  borderRadius: 10,
                }}></View>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                {authorPostInfo && (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      // marginTop: SIZES.padding,
                    }}>
                    <FastImage
                      source={{ uri: authorPostInfo.avatarUrl }}
                      style={{
                        width: 50,
                        height: 50,
                        borderColor: COLORS.black,
                        borderRadius: 25,
                        borderWidth: 1,
                      }}
                    />

                    <Text
                      style={{
                        color: COLORS.grey,
                        ...FONTS.h3,
                        marginLeft: SIZES.radius,
                        textAlign: 'center',
                      }}>
                      {authorPostInfo.name}
                    </Text>
                  </View>
                )}
                <TextButton
                  label="Đến nơi mua sách"
                  disabled={post.linkToBook == ''}
                  onPress={() =>
                    navigation.navigate('LinkToBook', {
                      link: post.linkToBook,
                    })
                  }
                  labelStyle={{
                    ...FONTS.h4,
                    color: COLORS.white,
                  }}
                  contentContainerStyle={{
                    paddingHorizontal: 10,
                    paddingVertical: 12,
                    borderRadius: 10,
                    backgroundColor:
                      post.linkToBook == '' ? COLORS.gray : COLORS.primary,
                  }}
                />
              </View>
              <Text
                style={{
                  marginTop: SIZES.padding,
                  ...FONTS.body4,
                  color: COLORS.black,
                }}>
                {post.descriptionBook}
              </Text>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  } else {
    return <View></View>;
  }
};
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    // justifyContent: 'center',
    // alignItems: 'center',
    paddingVertical: SIZES.padding,
    paddingHorizontal: SIZES.padding,
  },
  detailsContainer: {
    marginTop: SIZES.padding,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 20,
    backgroundColor: COLORS.lightGray,
    flex: 0.6,
  },
  likeIconContainer: {
    height: 60,
    width: 60,
    position: 'absolute',
    top: -30,
    backgroundColor: COLORS.white,
    borderRadius: 30,
    right: 20,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  chatIconContainer: {
    height: 60,
    width: 60,
    position: 'absolute',
    top: -110,
    backgroundColor: COLORS.white,
    borderRadius: 30,
    right: 20,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  bookTitle: {
    color: COLORS.dark,
    ...FONTS.h2,
    fontSize: 25,
  },
  authorBook: {
    ...FONTS.h3,
    color: COLORS.grey,
  },
  category: {
    ...FONTS.h4,
    color: COLORS.white,
  },
});

export default BookDetailsScreen;
