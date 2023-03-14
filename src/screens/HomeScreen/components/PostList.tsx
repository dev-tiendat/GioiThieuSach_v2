import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import FastImage from 'react-native-fast-image';
import {Shadow} from 'react-native-shadow-2';
import {COLORS, FONTS, icons, SIZES} from '../../../constants';
import {Post} from '../../../constants/interface';
import {IconButton} from '../../../components';

interface PostListProps {
  postList: Post[];
  onPress: (Post: Post) => void;
}

interface PostItemProps {
  item: Post;
  onPress: (Post: Post) => void;
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
          onPress={() => onPress(item)}>
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

const PostList: React.FC<PostListProps> = ({postList, onPress}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {postList?.map(item => {
        return <PostItem item={item} onPress={onPress} key={item.bookId} />;
      })}
    </View>
  );
};

export default PostList;

const styles = StyleSheet.create({});
