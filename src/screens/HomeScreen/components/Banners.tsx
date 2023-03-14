import {
  SliderBase,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import Swiper from 'react-native-swiper';
import React from 'react';
import {COLORS, images, SIZES} from '../../../constants';
import FastImage from 'react-native-fast-image';

const Banners = ({onPress}: any) => {
  return (
    <Swiper
      style={styles.wrapper}
      dotStyle={{
        backgroundColor: COLORS.white,
      }}
      containerStyle={{
        height: 230,
      }}
      activeDotColor={COLORS.secondary}
      autoplay={true}
      autoplayTimeout={5}>
      <View style={styles.slide} onMoveShouldSetResponderCapture={() => true}>
        <TouchableOpacity
          style={{
            width: '100%',
            height: '100%',
          }}
          onPress={() =>
            onPress(
              'https://tiki.vn/hoang-tu-be-tai-ban-2022-p166033489.html?spid=166033491',
            )
          }>
          <FastImage
            source={images.banner_1}
            style={{
              width: '100%',
              height: '100%',
            }}
            resizeMode="stretch"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.slide} onMoveShouldSetResponderCapture={() => true}>
        <TouchableOpacity
          style={{
            width: '100%',
            height: '100%',
          }}
          onPress={() =>
            onPress(
              'https://www.lazada.vn/products/toi-tai-gioi-ban-cung-the-tai-ban-2020-tang-bookmark-sieu-xinh-i1475357922-s6135157887.html?spm=a2o4n.tm80108895.4266666200.1.2466SWrLSWrLgt.2466SWrLSWrLgt&priceCompare=skuId%3A6135157887%3Bsource%3Alazada-om%3Bsn%3A7277f705-38ac-49a9-ab9b-7164bdbc1810%3BoriginPrice%3A60000%3BvoucherPrice%3A60000%3Btimestamp%3A1667875530333',
            )
          }>
          <FastImage
            source={images.banner_2}
            style={{
              width: '100%',
              height: '100%',
            }}
            resizeMode="stretch"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.slide} onMoveShouldSetResponderCapture={() => true}>
        <TouchableOpacity
          style={{
            width: '100%',
            height: '100%',
          }}
          onPress={() =>
            onPress(
              'https://pages.lazada.vn/wow/gcp/route/lazada/vn/upr_1000345_lazada/channel/vn/upr-router/vn?hybrid=1&data_prefetch=true&prefetch_replace=1&at_iframe=1&wh_pid=/lazada/channel/vn/marketing/mkt_lp_sem_v2&ntvtype=10&ntvab=12&use_dy=1&enable_use_dy=1&titan_ab=3134_8521_1017183&gwid=gwgg2hub1ghai349n1enm&om_gateway=1&om_gt_args=3134_8721_2c674a98455a40c081ed72e274dcd096&trigger_item=584650535&campaign_id=0&venture=vn&sku_id=1307188485&wh_skucount=1&entrance=mktlp&exlaz=d_1:mm_150050845_51350205_2010350205::12:18181600229!144183635401!!!pla-1730339609403!m!1730339609403!1307188485!585410434&gclid=CjwKCAiA9qKbBhAzEiwAS4yeDUBRMmdUpYFqE387qKO26fKZjO6SRfUzAoDizoPnhZ2Dn5XtrEogMhoC0e8QAvD_BwE&gt_channel=SEM',
            )
          }>
          <FastImage
            source={images.banner_3}
            style={{
              width: '100%',
              height: '100%',
            }}
            resizeMode="stretch"
          />
        </TouchableOpacity>
      </View>
    </Swiper>
  );
};

export default Banners;

const styles = StyleSheet.create({
  wrapper: {
    // flex: 1,
    // borderRadius: SIZES.padding,
    // overflow: 'visible'
    // padding: SIZES.base
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#9DD6EB',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
});
