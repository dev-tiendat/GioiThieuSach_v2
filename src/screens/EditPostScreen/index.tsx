import React, {useState, useRef, useEffect} from 'react';
import {
  TextInput,
  Image,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-crop-picker';
import firestore from '@react-native-firebase/firestore';
import DropDownPicker from 'react-native-dropdown-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {FormInput, IconButton, AppLoader, TextButton} from '../../components';
import {COLORS, constants, FONTS, icons, images, SIZES} from '../../constants';
import {EditPostScreenProps} from '../../navigation/types';

const EditPostScreen: React.FC<EditPostScreenProps> = ({navigation, route}) => {
  const post = route.params.post;
  const [pathImage, setPathImage] = useState<string>(post.bookPicture);
  const uuid = useRef<string>(auth().currentUser!.uid);
  const bookId = useRef<string>(post.bookId);
  const reference = storage().ref(`BookPictures/${post.bookId}.png`);
  const [items, setItems] = useState(constants.categories);
  const [loading, setLoading] = useState<boolean>(false);

  const [bookTitle, setBookTitle] = useState<string>(post.bookTitle);
  const [authorBook, setAuthorBook] = useState<string>(post.authorBook);
  const [descriptionBook, setDescriptionBook] = useState<string>(
    post.descriptionBook,
  );
  const [linkToBook, setLinkToBook] = useState<string>(post.linkToBook);
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<string>(post.category);
  const check =
    pathImage != '' &&
    bookTitle != '' &&
    authorBook != '' &&
    descriptionBook != '' &&
    category != '';

  const handlePressSelectImage = () => {
    ImagePicker.openPicker({
      cropping: true,
    }).then(image => {
      setPathImage(image.path);
    });
  };

  const handleUpdatePost = async () => {
    setLoading(true);
    try {
      if (pathImage != post.bookPicture) {
        await reference.delete();

        await reference
          .putFile(pathImage!)
          .then(() => {
            console.log('thành công');
          })
          .catch(error => {
            console.log(error);
          });
      }

      const bookPicture = await reference.getDownloadURL();

      await firestore()
        .collection('Posts')
        .doc(bookId.current)
        .set({
          bookId: bookId.current,
          bookTitle: bookTitle,
          bookPicture: bookPicture,
          authorBook: authorBook,
          descriptionBook: descriptionBook,
          category: category,
          authorPostId: uuid.current,
          numberOfLikes: post.numberOfLikes,
          linkToBook: linkToBook,
        })
        .then(() => {
          console.log('book added!');
        });
      navigation.goBack();
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
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
        <Text style={styles.titleHeader}>Sửa bài viết</Text>
      </View>
      <TouchableOpacity
        style={[
          {
            flex: 0.4,
            backgroundColor: COLORS.white,
          },
          !pathImage && {
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
        onPress={handlePressSelectImage}>
        <Image
          style={{
            flex: 1,
          }}
          resizeMode="contain"
          source={{uri: pathImage}}
        />
      </TouchableOpacity>
      <View style={styles.detailsContainer}>
        <KeyboardAwareScrollView
          style={{paddingHorizontal: 20}}
          nestedScrollEnabled={true}>
          <View>
            <Text style={styles.label}>Tên sách</Text>
            <TextInput
              style={styles.textInput}
              value={bookTitle}
              placeholder="Nhập tên sách"
              onChangeText={text => setBookTitle(text)}
            />
          </View>
          <View style={{marginTop: SIZES.padding}}>
            <Text style={styles.label}>Tên tác giả </Text>
            <TextInput
              style={styles.textInput}
              value={authorBook}
              placeholder="Nhập tên tác giả"
              onChangeText={text => setAuthorBook(text)}
            />
          </View>
          <View style={{marginTop: SIZES.padding}}>
            <Text style={styles.label}>Thể loại </Text>
            <DropDownPicker
              open={open}
              value={category}
              items={items}
              setOpen={setOpen}
              setValue={setCategory}
              setItems={setItems}
              dropDownDirection={'BOTTOM'}
              listMode="SCROLLVIEW"
              placeholder="Chọn thể loại"
              style={{
                marginTop: SIZES.radius,
                borderRadius: SIZES.radius,
                borderWidth: 0,
                paddingHorizontal: SIZES.padding,
                paddingVertical: SIZES.radius,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 4,
              }}
              placeholderStyle={{
                ...FONTS.body3,
                color: COLORS.darkGray,
              }}
              selectedItemLabelStyle={{
                color: COLORS.primary,
              }}
              listItemLabelStyle={{
                ...FONTS.body3,
              }}
              listItemContainerStyle={
                {
                  // borderWidth: 1,
                  // borderColor: '#000',
                  // borderRadius: SIZES.radius,
                  // paddingHorizontal: SIZES.padding,
                  // paddingVertical: SIZES.base,
                  // marginTop:  2,
                }
              }
              textStyle={{
                ...FONTS.body3,
              }}
            />
          </View>
          <View style={{marginTop: SIZES.padding}}>
            <Text style={styles.label}>Nội dung</Text>
            <TextInput
              style={[styles.textInput, {paddingVertical: SIZES.padding}]}
              placeholder="Nhập nội dung"
              textAlignVertical="top"
              multiline
              numberOfLines={15}
              value={descriptionBook}
              onChangeText={text => setDescriptionBook(text)}
            />
          </View>

          <View style={{marginTop: SIZES.padding}}>
            <Text style={styles.label}>Đường dẫn đến sản phẩm</Text>
            <TextInput
              style={styles.textInput}
              value={linkToBook}
              placeholder="Nhập đường dẫn (Không bắt buộc)"
              onChangeText={text => setLinkToBook(text)}
            />
          </View>

          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <TextButton
              disabled={!check}
              label="Cập nhật bài viết"
              onPress={() => handleUpdatePost()}
              contentContainerStyle={{
                marginTop: SIZES.padding * 2,
                paddingVertical: SIZES.radius,
                paddingHorizontal: SIZES.padding,
                borderRadius: 100,
                backgroundColor: check ? COLORS.primary : COLORS.gray,
              }}
              labelStyle={{
                color: COLORS.white,
                ...FONTS.h2,
              }}
            />
          </View>
        </KeyboardAwareScrollView>
      </View>
      {loading && <AppLoader />}
      <View></View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
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
  detailsContainer: {
    marginTop: SIZES.padding,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 20,
    backgroundColor: COLORS.lightGray,
    flex: 0.6,
  },
  label: {
    ...FONTS.h2,
    fontSize: 19,
  },
  textInput: {
    marginTop: SIZES.base,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.radius,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    ...FONTS.body3,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 4,
  },
});

export default EditPostScreen;
