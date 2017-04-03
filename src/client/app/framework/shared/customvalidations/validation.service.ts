
export class ValidationService {

  static getValidatorErrorMessage(validatorName:string, validatorValue?:any) {
    let config:any = {
      'required': 'Required',
      'requiredname': 'Name is required',
      'invalidEmailAddress': 'Email is invalid.',
      'invalidPassword': 'Password is invalid.',
      'maxlength': `Maximum ${validatorValue.requiredLength} charcters`,
      'minlength': `Minimum ${validatorValue.requiredLength} charcters`,
      'invalidMobile': 'Mobile number should be of 10 digit ',
      'invalidBirthYear': 'Birth year should be of 4 digit ',
      'invalidPin': 'Pin should be of 6 digit ',

    };
    return config[validatorName];
  }

  static emailValidator(control:any) {
    if (control.value) {
      if (control.value.match(
          /[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?/)) {
        return null;
      } else {
        return {'invalidEmailAddress': true};
      }
    }
    return null;
  }


  static passwordValidator(control:any) {
    if (control.value.match(/(?=.*\d)(?=.*[a-z])(?=.*[$@$!%*?&])(?=.*[A-Z]).{8,}/)) {

      return null;

    } else {

      return {'invalidPassword': true};
    }
  }


  static mobileNumberValidator(control:any) {
    var mobileNumber = control.value;
    var count = 0;

    while (mobileNumber > 1) {
      mobileNumber = (mobileNumber / 10);
      count += 1;
    }
    if (count == 10) {
      return null;
    }
    else {
      return {'invalidMobile': true};
    }
  }
  static birthYearValidator(control:any) {
    var birthYear = control.value;
    var count = 0;

    while (birthYear > 1) {
      birthYear = (birthYear / 10);
      count += 1;
    }
    if (count == 4) {
      return null;
    }
    else {
      return {'invalidBirthYear': true};
    }
  }
  static pinValidator(control:any) {
    var pin = control.value;
    var count = 0;

    while (pin > 1) {
      pin = (pin / 10);
      count += 1;
    }
    if (count == 6) {
      return null;
    } else {
      return {'invalidPin': true};
    }
  }
}
