import images from './images';

const introSlidesOnboarding = [
  {
    key: 1,
    title: 'Chào mừng bạn đến với Book Introducation',
    description: '',
    image: images.onboarding_1,
  },
  {
    key: 2,
    title: 'Sự kết hợp hoàn hảo',
    description:
      'Ứng dụng là sự kết hợp giữa ứng dụng giới thiệu sản phẩm truyền thống và mạng xã hội . Giúp người dùng có thể chia sẻ những cuốn sách hay đến mọi người',
    image: images.onboarding_2,
  },
  {
    key: 3,
    title: 'Bắt đầu sử dụng',
    description: 'Chúc bạn có những trải nghiệm thú vị và thông tin hữu ích !',
    image: images.onboarding_3,
  },
];

const categories = [
  {
    label: 'Văn học',
    value: 'Văn học',
  },
  {
    label: 'Truyện',
    value: 'Truyện',
  },
  {
    label: 'Sách thiếu nhi',
    value: 'Sách thiếu nhi',
  },
  {
    label: 'Chính trị - xã hội',
    value: 'Chính trị - xã hội',
  },
  {
    label: 'Khoa học công nghệ',
    value: 'Khoa học công nghệ',
  },
];

export default { introSlidesOnboarding, categories };
