import React, {useEffect, useLayoutEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  RefreshControl,
  Keyboard,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {FONTS, SIZES, COLORS, images, icons} from '../../constants';
import Greeter from './components/Greeter';
import BookRanking from './components/BookRanking';
import {HomeScreenProps} from '../../navigation/types';
import {FormInput, IconButton} from '../../components';
import {Post} from '../../constants/interface';
import Categories from './components/Categories';
import PostList from './components/PostList';
import Banners from './components/Banners';
import FastImage from 'react-native-fast-image';

const HomeScreen: React.FC<HomeScreenProps> = ({navigation, route}) => {
  const [user, setUser] = useState<any>();
  const [searchText, setSearchText] = useState<string>('');
  const [refreshing, setRefreshing] = React.useState(false);
  const [bookRankingList, setBookRankingList] = useState<Post[]>();
  const [categorySelected, setCategorySelected] = useState<string>('Tất cả');
  const [posts, setPosts] = useState<Post[]>();
  const [postsSearch, setPostsSearch] = useState<Post[]>();
  const [ref, setRef] = useState<ScrollView>();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        ref?.scrollTo({y: 1, animated: true});
      },
    );

    return () => {
      keyboardDidShowListener.remove();
    };
  });

  useLayoutEffect(() => {
    getInfoUser();
    getBookRankingList();
  }, []);
  // console.log(postsSearch);
  useEffect(() => {
    firestore()
      .collection('Posts')
      .get()
      .then(querySnapshot => {
        const postList: any = [];
        querySnapshot.forEach(documentSnapshot => {
          const post = documentSnapshot.data();
          const bookTitle = post.bookTitle.trim().toUpperCase();
          const _searchText = searchText.trim().toUpperCase();

          if (bookTitle.includes(_searchText) && _searchText != '') {
            postList.push(post);
          }
        });
        setPostsSearch(postList);
      });
  }, [searchText]);

  useLayoutEffect(() => {
    getPosts();
  }, [categorySelected]);

  const getInfoUser = async () => {
    firestore()
      .collection('Users')
      .doc(auth().currentUser?.uid)
      .get()
      .then(documentSnapshot => {
        setUser(documentSnapshot.data());
      });
  };

  const getBookRankingList = async () => {
    firestore()
      .collection('Posts')
      .orderBy('numberOfLikes', 'desc')
      .limit(5)
      .get()
      .then(querySnapshot => {
        const posts: any = [];
        querySnapshot.forEach(documentSnapshot => {
          posts.push(documentSnapshot.data());
        });

        setBookRankingList(posts);
      });
  };

  const getPosts = async () => {
    categorySelected == 'Tất cả'
      ? firestore()
          .collection('Posts')
          .get()
          .then(querySnapshot => {
            const postList: any = [];
            querySnapshot.forEach(documentSnapshot => {
              postList.push(documentSnapshot.data());
            });
            setPosts(postList);
          })
      : firestore()
          .collection('Posts')
          .where('category', '==', categorySelected)
          .get()
          .then(querySnapshot => {
            const postList: any = [];
            querySnapshot.forEach(documentSnapshot => {
              postList.push(documentSnapshot.data());
            });

            setPosts(postList);
          });
  };

  const loadRefreshing = () => {
    setRefreshing(true);

    getPosts();
    getBookRankingList();
    getInfoUser();

    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEnabled={postsSearch?.length == 0 && searchText == ''}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadRefreshing}
            progressBackgroundColor={COLORS.gray}
          />
        }
        // ref={ref}
        ref={ref => {
          setRef(ref as any);
        }}>
        <View
          style={{
            paddingHorizontal: SIZES.padding,
          }}>
          <Greeter
            name={user?.name ? user.name : ''}
            avatarUrl={user?.avatarUrl ? user.avatarUrl : ''}
          />
          <View>
            <FormInput
              containerStyle={{
                borderRadius: 100,
                backgroundColor: COLORS.white,
                overflow: 'hidden',
              }}
              inputStyle={{
                color: COLORS.black,
                ...FONTS.body3,
              }}
              placeholder="Tìm kiếm"
              prependComponent={
                <Image
                  source={icons.search_icon}
                  style={{
                    width: 20,
                    height: 20,
                    marginHorizontal: SIZES.base,
                    tintColor: COLORS.grey,
                  }}
                />
              }
              appendComponent={
                searchText != '' ? (
                  <IconButton
                    icon={icons.close_icon}
                    onPress={() => setSearchText('')}
                    iconStyle={{
                      width: 15,
                      height: 15,
                      marginHorizontal: SIZES.base,
                      tintColor: COLORS.primary,
                    }}
                  />
                ) : null
              }
              value={searchText}
              onChange={(text: string) => {
                setSearchText(text);
              }}
            />
            {postsSearch?.length != 0 && (
              <ScrollView
                style={{
                  width: '100%',
                  paddingHorizontal: SIZES.padding,
                  maxHeight: 300,
                  backgroundColor: '#ecf0f1',
                  borderRadius: SIZES.radius,
                  position: 'absolute',
                  top: 60,
                  zIndex: 1,
                }}
                showsVerticalScrollIndicator={false}>
                {postsSearch?.map((item, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      style={{
                        width: '100%',
                        paddingVertical: SIZES.base,
                        marginBottom: SIZES.base,
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderBottomWidth: 1,
                        borderColor: COLORS.gray,
                      }}
                      onPress={() =>
                        navigation.navigate('BookDetails', {
                          postId: item.bookId,
                        })
                      }>
                      <FastImage
                        source={{uri: item.bookPicture}}
                        style={{
                          width: 50,
                          height: 80,
                        }}
                      />
                      <Text
                        style={{
                          ...FONTS.h4,
                          color: COLORS.black,
                          marginLeft: SIZES.padding,
                        }}>
                        {item.bookTitle}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
            {postsSearch?.length == 0 && searchText != '' && (
              <View
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#ecf0f1',
                  borderRadius: SIZES.radius,
                  padding: SIZES.radius,
                  position: 'absolute',
                  top: 60,
                  zIndex: 1,
                }}>
                <Text
                  style={{
                    ...FONTS.h3,
                    color: COLORS.gray,
                  }}>
                  Không tìm thấy kết quả nào...
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={{paddingHorizontal: SIZES.radius}}>
          <View
            style={{
              width: '100%',
              height: 230,
              marginTop: SIZES.padding,
              borderRadius: 30,
              overflow: 'hidden',
            }}>
            <Banners
              onPress={(link: string) =>
                navigation.navigate('LinkToBook', {link: link})
              }
            />
          </View>
        </View>

        <View style={styles.bookRankingContainer}>
          <Text style={styles.title}>Những cuốn sách nổi bật</Text>
          <BookRanking
            bookRankingList={bookRankingList!}
            onPress={(postId: string) =>
              navigation.navigate('BookDetails', {postId: postId})
            }
          />
        </View>

        <View
          style={{
            marginTop: SIZES.padding,
            overflow: 'visible',
          }}>
          <Text style={[styles.title, {paddingHorizontal: SIZES.padding}]}>
            Danh mục sản phẩm
          </Text>
          <Categories
            setCategorySelected={(value: string) => setCategorySelected(value)}
            categorySelected={categorySelected}
          />
        </View>
        <View
          style={{
            paddingHorizontal: SIZES.base,
            marginTop: SIZES.base,
            marginBottom: 110,
          }}>
          <PostList
            postList={posts!}
            onPress={(post: Post) =>
              navigation.navigate('BookDetails', {postId: post.bookId})
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  title: {
    ...FONTS.h2,
    color: COLORS.dark,
  },
  bookRankingContainer: {
    marginTop: SIZES.padding,
    paddingHorizontal: SIZES.padding,
  },
});

export default HomeScreen;
