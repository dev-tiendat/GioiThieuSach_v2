import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {COLORS, FONTS, SIZES} from '../../../constants';
import {Post} from '../../../constants/interface';

interface BookRankingProps {
  bookRankingList: Post[];
  onPress: (postId: string) => void;
}

const BookRanking: React.FC<BookRankingProps> = ({
  bookRankingList,
  onPress,
}) => {
  return (
    <View>
      {bookRankingList &&
        bookRankingList.map((post, index) => {
          return (
            <TouchableOpacity
              key={index}
              style={styles.itemContainer}
              onPress={() => onPress(post.bookId)}>
              <Text style={[styles.index, {opacity: 1 / (index + 1)}]}>
                {index + 1}
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <FastImage
                  source={{
                    uri: post.bookPicture,
                    priority: FastImage.priority.high,
                  }}
                  style={styles.image}
                  resizeMode="contain"
                />
                <Text style={styles.title}>{post.bookTitle}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: SIZES.padding,
    backgroundColor: COLORS.white,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: SIZES.radius,
    alignItems: 'center',
  },
  index: {
    ...FONTS.h2,
    color: COLORS.dark,
    marginRight: SIZES.padding,
  },
  image: {
    width: 80,
    height: 80,
  },
  title: {
    ...FONTS.h3,
    marginLeft: SIZES.radius,
    color: COLORS.black,
  },
});

export default BookRanking;
