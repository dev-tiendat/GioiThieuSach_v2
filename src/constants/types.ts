enum IndicatorEmail {
  INVALID_EMAIL = 'Tài khoản email không hợp lệ',
  VALID_EMAIL = 'Tài khoản email hợp lệ',
}

enum IndicatorPhoneNumber {
  INVALID_PHONE_NUMBER = 'Số điện thoại không hợp lệ',
  VALID_PHONE_NUMBER = 'Số điện thoại hợp lệ',
}

enum IndicatorPassword {
  INVALID_PASSWORD = 'Mật khẩu cần phải trên 6 ký tự',
  VALID_PASSWORD = 'Mật khẩu hợp lệ',
}

enum IndicatorConfirmPassword {
  INVALID_CONFIRM_PASSWORD = 'Mật khẩu không khớp',
  VALID_CONFIRM_PASSWORD = 'Mật khẩu đã khớp',
}

enum IndicatorUserName {
  INVALID_USER_NAME = 'Tên đặt không hợp lệ',
  VALID_USER_NAME = 'Tên đặt hợp lệ',
}

export default {
  IndicatorEmail,
  IndicatorPhoneNumber,
  IndicatorPassword,
  IndicatorConfirmPassword,
  IndicatorUserName,
};
