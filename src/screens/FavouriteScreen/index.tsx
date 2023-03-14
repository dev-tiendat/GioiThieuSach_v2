import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  ScrollView,
  FlatList,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {Post} from '../../constants/interface';
import {Shadow} from 'react-native-shadow-2';
import FastImage from 'react-native-fast-image';
import {FavoriteScreenProps} from '../../navigation/types';
import {COLORS, FONTS, icons, SIZES} from '../../constants';

interface PostItemProps {
  item: Post;
  onPress: (postId: string) => void;
}

const PostItem: React.FC<PostItemProps> = ({item, onPress}) => {
  const [userInfo, setUserInfo] = useState<any>();

  useEffect(() => {
    const subscriber = firestore()
      .collection('Users')
      .doc(item.authorPostId)
      .onSnapshot(documentSnapshot => {
        setUserInfo(documentSnapshot.data());
      });

    return () => subscriber();
  }, []);

  return (
    <View
      style={{
        margin: SIZES.base,
      }}
      key={item.bookId}>
      <Shadow distance={4}>
        <TouchableOpacity
          style={{
            width: SIZES.width / 2 - 30,
            marginTop: SIZES.radius,
            paddingHorizontal: SIZES.radius,
            borderRadius: SIZES.radius,
          }}
          onPress={() => onPress(item.bookId)}>
          <FastImage
            source={{uri: item.bookPicture}}
            style={{
              width: '100%',
              height: 180,
              marginTop: SIZES.base,
            }}
            resizeMode="contain"
          />
          <View
            style={{
              alignItems: 'center',
              marginTop: SIZES.radius,
              justifyContent: 'space-between',
            }}>
            <Text style={{...FONTS.h3, color: COLORS.black, height: 50}}>
              {item.bookTitle}
            </Text>
          </View>
          {userInfo && (
            <View
              style={{
                flexDirection: 'row',
                marginVertical: SIZES.base,
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}>
                <FastImage
                  source={{uri: userInfo.avatarUrl}}
                  style={{
                    width: 30,
                    height: 30,
                    borderColor: COLORS.black,
                    borderRadius: 20,
                    borderWidth: 1,
                  }}
                />
                <Text
                  style={{
                    color: COLORS.black,
                    ...FONTS.h4,
                    fontSize: 10,
                    marginLeft: 5,
                  }}>
                  {userInfo.name}
                </Text>
              </View>

              <ImageBackground
                source={icons.like_icon}
                style={{
                  width: 40,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{...FONTS.h4, color: COLORS.white}}>
                  {item.numberOfLikes}
                </Text>
              </ImageBackground>
            </View>
          )}
        </TouchableOpacity>
      </Shadow>
    </View>
  );
};

const FavouriteScreen: React.FC<FavoriteScreenProps> = ({navigation}) => {
  const [favoritePostsId, setFavoritePostsId] = useState<string[]>();
  const [favoritePosts, setFavoritePosts] = useState<Post[]>();

  useEffect(() => {
    const subscriber = firestore()
      .collection('Users')
      .doc(auth().currentUser!.uid)
      .onSnapshot(documentSnapshot => {
        setFavoritePostsId(documentSnapshot.data()!.likedPosts as string[]);
      });

    return () => subscriber();
  }, []);

  useEffect(() => {
    let subscriber: any;

    if (favoritePostsId) {
      subscriber = firestore()
        .collection('Posts')
        .onSnapshot(querySnapshot => {
          const _favoritePosts: Post[] = [];

          querySnapshot.forEach(documentSnapshot => {
            const post = documentSnapshot.data() as Post;
            if (favoritePostsId.includes(post.bookId)) {
              _favoritePosts.push(post);
            }
          });
          setFavoritePosts(_favoritePosts);
        });
    }

    return () => subscriber?.();
  }, [favoritePostsId]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titleHeader}>Các bài viết yêu thích</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{flex: 1}}>
          <ScrollView horizontal={true} style={{width: '100%'}}>
            <FlatList
              data={favoritePosts}
              renderItem={({item}) => (
                <PostItem
                  item={item}
                  onPress={(postId: string) =>
                    navigation.navigate('BookDetails', {postId: postId})
                  }
                />
              )}
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
});

export default FavouriteScreen;
