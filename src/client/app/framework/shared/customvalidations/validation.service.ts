export class ValidationService {

  static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
    let config: any = {
      'required': 'Required',
      'requiredEmail': 'Enter your email address',
      'requiredPassword': 'Enter your password',
      'requiredNewPassword': 'Enter a new password',
      'requiredConfirmPassword': 'Enter confirm password',
      'requiredCurrentPassword': 'Enter a current password',
      'requiredFirstName': "You can't leave this empty",
      'requiredLastName': "You can't leave this empty",
      'requiredMobileNumber': "You can't leave this empty.",
      'requiredPin': 'Enter your pin code',
      'requiredDescription': 'Enter a description',
      'requiredCompanyDescription': 'Please say something about your company ',
      'requiredCompanyName': "You can't leave this empty",
      'requiredOtp': 'Enter OTP received',
      'invalidEmailAddress': 'Enter valid email address',
      /*
       'invalidPassword': 'Passwords must contain at least 8 characters, including uppercase, lowercase letters, numbers and one special character($@_!%*?&).',
       */
      'invalidPassword': 'Passwords must contain at least 8 characters and must be alpha-numeric.',
      'maxlength': `Maximum ${validatorValue.requiredLength} characters`,
      'minlength': `Minimum ${validatorValue.requiredLength} characters`,
      'invalidMobile': 'This phone number format is not recognized. Please check the number.',
      'invalidBirthYear': "You can't leave this empty.",
      'invalidPin': 'Pin code should not be greater than 20 characters ',

    };
    return config[validatorName];
  }

  static emailValidator(control: any) {
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

  static requireEmailValidator(control: any) {
    if (control.value == "" || control.value == undefined) {
      return {'requiredEmail': true};
    }
    else {
      return null;
    }
  }

  static requireFirstNameValidator(control: any) {
    if (control.value == "" || control.value == undefined) {
      return {'requiredFirstName': true};
    }
    else {
      return null;
    }
  }

  static requireCompanyNameValidator(control: any) {
    if (control.value == "" || control.value == undefined) {
      return {'requiredCompanyName': true};
    }
    else {
      return null;
    }
  }

  static requireCompanyDescriptionValidator(control: any) {
    if (control.value == "" || control.value == undefined) {
      return {'requiredCompanyDescription': true};
    }
    else {
      return null;
    }
  }

  static requireLastNameValidator(control: any) {
    if (control.value == "" || control.value == undefined) {
      return {'requiredLastName': true};
    }
    else {
      return null;
    }
  }

  static requireMobileNumberValidator(control: any) {
    if (control.value == "" || control.value == undefined) {
      return {'requiredMobileNumber': true};
    }
    else {
      return null;
    }
  }


  static passwordValidator(control: any) {

    if (control.value.match(/(?=.*\d)(?=.*[a-zA-Z]).{8,}/)) {
      /*
       if (control.value.match(/(?=.*\d)(?=.*[a-z])(?=.*[$@_#!%*?&])(?=.*[A-Z]).{8,}/)) {
       */

      return null;

    } else {

      return {'invalidPassword': true};
    }
  }

  static requirePasswordValidator(control: any) {
    if (control.value == "" || control.value == undefined) {
      return {'requiredPassword': true};
    } else {
      return null;
    }
  }

  static requireNewPasswordValidator(control: any) {
    if (control.value == "" || control.value == undefined) {
      return {'requiredNewPassword': true};
    } else {
      return null;
    }
  }

  static requireCurrentPasswordValidator(control: any) {
    if (control.value == "" || control.value == undefined) {
      return {'requiredCurrentPassword': true};
    } else {
      return null;
    }
  }

  static requireOtpValidator(control: any) {
    if (control.value == "" || control.value == undefined) {
      return {'requiredOtp': true};
    } else {
      return null;
    }
  }

  static requireConfirmPasswordValidator(control: any) {
    if (control.value == "" || control.value == undefined) {
      return {'requiredConfirmPassword': true};
    } else {
      return null;
    }
  }

  static requirePinValidator(control: any) {
    if (control.value == "" || control.value == undefined) {
      return {'requiredPin': true};
    } else {
      return null;
    }
  }

  static requireDescriptionValidator(control: any) {
    if (control.value == "" || control.value == undefined) {
      return {'requiredDescription': true};
    } else {
      return null;
    }
  }

  static mobileNumberValidator(control: any) {
    var mobileNumber = control.value;
    var count = 0;

    while (mobileNumber > 1) {
      mobileNumber = (mobileNumber / 10);
      count += 1;
    }
    if (count === 10) {
      return null;
    } else {
      return {'invalidMobile': true};
    }
  }

  static birthYearValidator(control: any) {
    var birthYear = control.value;
    var count = 0;
    var isValid: boolean = false;
    var currentDate = new Date();
    var year = currentDate.getUTCFullYear() - 18;
    if (birthYear > year - 60 && birthYear <= year) {
      isValid = true;
    }
    while (birthYear > 1) {
      birthYear = (birthYear / 10);
      count += 1;

    }
    if (count === 4 && isValid === true) {
      return null;
    } else {
      return {'invalidBirthYear': true};
    }
  }

  static pinValidator(control: any) {
    var pin = control.value.length;

    if (pin <= 20) {
      return null;
    } else {
      return {'invalidPin': true};
    }
  }

}
