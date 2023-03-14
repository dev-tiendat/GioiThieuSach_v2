function validateEmail(email: string) {
  const regex = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;
  return regex.test(email);
}

function validatePassword(password: string) {
  return password.length > 6;
}

function validatePhoneNumber(phoneNumber: string) {
  return phoneNumber.length === 12;
}

function validateUserName(name: string) {
  var regex = /^[a-zA-Z ]{2,30}$/;
  return regex.test(name);
}

export {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
  validateUserName,
};
