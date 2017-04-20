
export class ValidationService {

  static getValidatorErrorMessage(validatorName:string, validatorValue?:any) {
    let config:any = {
      'required': 'Required',
      'requiredEmail': 'Please enter your email address',
      'requiredPassword': 'Please enter your password',
      'requiredNewPassword': 'Please enter new password',
      'requiredConfirmPassword': 'Please enter confirm password',
      'requiredCurrentPassword': 'Please enter current password',
      'requiredFirstName': 'Please enter your first name',
      'requiredLastName': 'Please enter your last name',
      'requiredMobileNumber': 'Please enter your mobile number',
      'requiredPin': 'Please enter your pin code',
      'requiredDescription': 'Please enter description',
      'requiredCompanyDescription': 'Please say something about your company ',
      'requiredCompanyName': 'Please enter company name',
      'requiredOtp': 'Please enter OTP',
      'invalidEmailAddress': 'Email incorrect',
      'invalidPassword': 'Passwords must contain at least 8 characters, including uppercase, lowercase letters, numbers and one special character($@_!%*?&).',
      'maxlength': `Maximum ${validatorValue.requiredLength} characters`,
      'minlength': `Minimum ${validatorValue.requiredLength} characters`,
      'invalidMobile': 'Mobile number should be of 10 digits ',
      'invalidBirthYear': 'Birth year should be of 4 digits ',
      'invalidPin': 'Pin code should not be greater than 20 characters ',

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

  static requireEmailValidator(control:any) {
    if (control.value =="" || control.value == undefined) {
        return {'requiredEmail': true};
    }
    else {
      return null;
    }
  }

  static requireFirstNameValidator(control:any) {
    if (control.value =="" || control.value == undefined) {
        return {'requiredFirstName': true};
    }
    else {
      return null;
    }
  }

  static requireCompanyNameValidator(control:any) {
    if (control.value =="" || control.value == undefined) {
      return {'requiredCompanyName': true};
    }
    else {
      return null;
    }
  }

  static requireCompanyDescriptionValidator(control:any) {
    if (control.value =="" || control.value == undefined) {
      return {'requiredCompanyDescription': true};
    }
    else {
      return null;
    }
  }

  static requireLastNameValidator(control:any) {
    if (control.value =="" || control.value == undefined) {
      return {'requiredLastName': true};
    }
    else {
      return null;
    }
  }

  static requireMobileNumberValidator(control:any) {
    if (control.value =="" || control.value == undefined) {
      return {'requiredMobileNumber': true};
    }
    else {
      return null;
    }
  }


  static passwordValidator(control:any) {

    if (control.value.match(/(?=.*\d)(?=.*[a-z])(?=.*[$@_#!%*?&])(?=.*[A-Z]).{8,}/)) {

      return null;

    } else {

      return {'invalidPassword': true};
    }
  }

  static requirePasswordValidator(control:any){
    if (control.value =="" || control.value == undefined) {
      return {'requiredPassword': true};
    } else {
      return null;
    }
  }

  static requireNewPasswordValidator(control:any){
    if (control.value =="" || control.value == undefined) {
      return {'requiredNewPassword': true};
    } else {
      return null;
    }
  }

  static requireCurrentPasswordValidator(control:any){
    if (control.value =="" || control.value == undefined) {
      return {'requiredCurrentPassword': true};
    } else {
      return null;
    }
  }

  static requireOtpValidator(control:any){
    if (control.value =="" || control.value == undefined) {
      return {'requiredOtp': true};
    } else {
      return null;
    }
  }

  static requireConfirmPasswordValidator(control:any){
    if (control.value =="" || control.value == undefined) {
      return {'requiredConfirmPassword': true};
    } else {
      return null;
    }
  }

  static requirePinValidator(control:any){
    if (control.value =="" || control.value == undefined) {
      return {'requiredPin': true};
    } else {
      return null;
    }
  }

  static requireDescriptionValidator(control:any){
    if (control.value =="" || control.value == undefined) {
      return {'requiredDescription': true};
    } else {
      return null;
    }
  }

  static mobileNumberValidator(control:any) {
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

  static birthYearValidator(control:any) {
    var birthYear = control.value;
    var count = 0;

    while (birthYear > 1) {
      birthYear = (birthYear / 10);
      count += 1;
    }
    if (count === 4) {
      return null;
    } else {
      return {'invalidBirthYear': true};
    }
  }

  static pinValidator(control:any) {
    var pin = control.value.length;

    if (pin <= 20) {
      return null;
    } else {
      return {'invalidPin': true};
    }
  }

}
