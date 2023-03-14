import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {v4 as uuidv4} from 'uuid';
import auth from '@react-native-firebase/auth';
import {firebase} from '@react-native-firebase/database';
import {COLORS, FONTS, icons, SIZES} from '../../constants';
import {PostCommentScreenProps} from '../../navigation/types';
import {IconButton} from '../../components';
import FastImage from 'react-native-fast-image';

const CommentItem: React.FC<any> = ({item}) => {
  const [userInfo, setUserInfo] = useState<any>();

  useEffect(() => {
    firestore()
      .collection('Users')
      .doc(item.uidUser)
      .get()
      .then(documentSnapshot => {
        setUserInfo(documentSnapshot.data());
      });
  }, []);

  if (userInfo) {
    return (
      <View
        style={{
          marginTop: SIZES.radius,
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
              width: 50,
              height: 50,
              borderColor: COLORS.black,
              borderRadius: 25,
              borderWidth: 1,
            }}
          />
          <View
            style={{
              padding: SIZES.base,
              overflow: 'hidden',
              marginLeft: SIZES.radius,
              borderRadius: 15,
              backgroundColor: '#dfe6e9',
              paddingRight: SIZES.padding,
            }}>
            <Text
              style={{
                color: COLORS.black,
                ...FONTS.h3,
              }}>
              {userInfo.name}
            </Text>
            <Text
              style={{
                color: COLORS.black,
                ...FONTS.body4,
              }}>
              {item.comment}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return null;
};

const PostCommentScreen: React.FC<PostCommentScreenProps> = ({
  navigation,
  route,
}) => {
  const reference = firebase
    .app()
    .database(
      'https://bookintroduction-b31d0-default-rtdb.asia-southeast1.firebasedatabase.app/',
    )
    .ref(`/PostComments/${route.params.postId}/`);

  const [comments, setComments] = useState<any>();
  const [textComment, setTextComment] = useState<string>('');

  useEffect(() => {
    const onValueChange = reference.on('value', snapshot => {
      setComments(snapshot.val());
    });

    return () => reference.off('value', onValueChange);
  }, []);

  const handleSendComment = async () => {
    setTextComment('');

    const comment = {
      id: uuidv4(),
      uidUser: auth().currentUser?.uid,
      comment: textComment,
    };

    let _comments: any[] = [];

    if (comments) {
      _comments = [...comments, comment];
    } else {
      _comments.push(comment);
    }

    await reference.set(_comments);
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
        <Text style={styles.titleHeader}>{route.params.bookTitle}</Text>
      </View>
 
      <FlatList
        data={comments}
        renderItem={({item}) => <CommentItem item={item} />}
        style={{
          paddingHorizontal: SIZES.padding,
        }}
      />
      <View
        style={{
          position: 'relative',
          bottom: 0,
          width: '100%',
          borderTopWidth: 1,
          borderColor: COLORS.gray,
          paddingVertical: SIZES.radius,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          // backgroundColor: 'red',
        }}>
        <TextInput
          style={{
            backgroundColor: '#dfe6e9',
            borderRadius: 100,
            marginLeft: SIZES.base,
            paddingHorizontal: SIZES.padding,
            flex: 1,
            ...FONTS.body3,
          }}
          placeholder="Viết bình luận..."
          value={textComment}
          onChangeText={text => setTextComment(text)}
        />
        <TouchableOpacity
          style={{
            marginHorizontal: SIZES.radius,
          }}
          onPress={handleSendComment}
          disabled={textComment == ''}>
          <FastImage
            source={icons.send_message_icon}
            style={{
              width: 25,
              height: 25,
            }}
            tintColor={textComment == '' ? COLORS.gray : undefined}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.padding,
    marginBottom: SIZES.base,
    paddingHorizontal: SIZES.padding,
  },
  titleHeader: {
    color: COLORS.dark,
    marginLeft: SIZES.padding,
    ...FONTS.h2,
  },
});

export default PostCommentScreen;
