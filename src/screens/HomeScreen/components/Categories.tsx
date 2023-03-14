import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {TextButton} from '../../../components';
import {COLORS, constants, SIZES} from '../../../constants';

interface CategoriesProps {
  categorySelected: string;
  setCategorySelected: (value : string) => void;
}

const Categories: React.FC<CategoriesProps> = ({
  categorySelected,
  setCategorySelected,
}) => {
  const categories = [
    {
      label: 'Tất cả',
      value: 'Tất cả',
    },
    ...constants.categories,
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}>
      {categories.map((item, index) => {
        return (
          <View key={index} style={{padding: 5, overflow: 'visible'}}>
            <TextButton
              label={item.value}
              contentContainerStyle={[
                styles.item,
                styles.shadow,
                {
                  backgroundColor:
                    categorySelected == item.value
                      ? COLORS.primary
                      : COLORS.white,
                },
              ]}
              labelStyle={{
                color:
                  categorySelected == item.value ? COLORS.white : COLORS.black,
              }}
              onPress={() => setCategorySelected(item.value)}
            />
          </View>
        );
      })}
    </ScrollView>
  );
};

export default Categories;

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
  },
  container: {
    paddingLeft: SIZES.padding,
    marginTop: SIZES.base,
  },
  item: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: SIZES.radius,
  },
});
