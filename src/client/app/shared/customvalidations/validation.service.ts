import { Messages } from '../constants';
import any = jasmine.any;

export class ValidationService {

  static  getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
    let config: any = {
      'required': 'Required',
      'requiredEmail': Messages.MSG_ERROR_VALIDATION_EMAIL_REQUIRED,
      'requiredWebsite': Messages.MSG_ERROR_VALIDATION_WEBSITE_REQUIRED,
      'requiredPassword': Messages.MSG_ERROR_VALIDATION_PASSWORD_REQUIRED,
      'requiredNewPassword': Messages.MSG_ERROR_VALIDATION_NEWPASSWORD_REQUIRED,
      'requiredConfirmPassword': Messages.MSG_ERROR_VALIDATION_CONFIRMPASSWORD_REQUIRED,
      'requiredCurrentPassword': Messages.MSG_ERROR_VALIDATION_CURRENTPASSWORD_REQUIRED,
      'requiredFirstName': Messages.MSG_ERROR_VALIDATION_FIRSTNAME_REQUIRED,
      'requiredLastName': Messages.MSG_ERROR_VALIDATION_LASTNAME_REQUIRED,
      'requiredMobileNumber': Messages.MSG_ERROR_VALIDATION_MOBILE_NUMBER_REQUIRED,
      'requiredPin': Messages.MSG_ERROR_VALIDATION_PIN_REQUIRED,
      'requiredDescription': Messages.MSG_ERROR_VALIDATION_DESCRIPTION_REQUIRED,
      'requiredCompanyDescription': Messages.MSG_ERROR_VALIDATION_ABOUT_COMPANY_REQUIRED,
      'requiredCompanyName': Messages.MSG_ERROR_VALIDATION_COMPANYNAME_REQUIRED,
      'requiredOtp': Messages.MSG_ERROR_VALIDATION_OTP_REQUIRED,
      'requiredBirthYear': Messages.MSG_ERROR_VALIDATION_BIRTHYEAR_REQUIRED,
      'invalidEmailAddress': Messages.MSG_ERROR_VALIDATION_INVALID_EMAIL_REQUIRED,
      'invalidUrlAddress': Messages.MSG_ERROR_VALIDATION_INVALID_URL_REQUIRED,
      'invalidName': Messages.MSG_ERROR_VALIDATION_INVALID_NAME,
      'containsWhiteSpace': Messages.MSG_ERROR_VALIDATION_INVALID_DATA,
      'invalidPassword': Messages.MSG_ERROR_VALIDATION_PASSWORD,
      'invalidMobile': Messages.MSG_ERROR_VALIDATION_OTP_MOBILE_NUMBER,
      'invalidBirthYear': Messages.MSG_ERROR_VALIDATION_BIRTHYEAR_INVALID,
      'invalidPin': Messages.MSG_ERROR_VALIDATION_PIN_NUMBER,

      'maxlength': `Maximum ${validatorValue.requiredLength} characters`,
      'minlength': `Minimum ${validatorValue.requiredLength} characters`

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
    if (control.value === '' || control.value === undefined) {
      return {'requiredEmail': true};
    } else {
      return null;
    }
  }

  static requireFirstNameValidator(control: any) {
    if (control.value === '' || control.value === undefined) {
      return {'requiredFirstName': true};
    } else {
      return null;
    }
  }

  static nameValidator(control: any) {
    if (control.value.match(/^[a-zA-Z](?:[a-zA-Z ]*[a-zA-Z])?$/)) {
      return null;
    } else {
      return {'invalidName': true};
    }
  }

  static requireCompanyNameValidator(control: any) {
    if (control.value === '' || control.value === undefined) {
      return {'requiredCompanyName': true};
    } else {
      return null;
    }
  }

  static noWhiteSpaceValidator(control: any) {
    let isWhitespace = (control.value).trim().length === 0;
    if (isWhitespace) {
      return {'containsWhiteSpace': true};
    } else {
      return null;
    }
  }


  static requireCompanyDescriptionValidator(control: any) {
    if (control.value === '' || control.value === undefined) {
      return {'requiredCompanyDescription': true};
    } else {
      return null;
    }
  }

  static requireLastNameValidator(control: any) {
    if (control.value === '' || control.value === undefined) {
      return {'requiredLastName': true};
    } else {
      return null;
    }
  }

  static requireMobileNumberValidator(control: any) {
    if (control.value === '' || control.value === undefined) {
      return {'requiredMobileNumber': true};
    } else {
      return null;
    }
  }
  static requireWebsiteValidator(control: any) {
    if (control.value === '' || control.value === undefined) {
      return {'requiredWebsite': true};
    } else {
      return null;
    }
  }

  static passwordValidator(control: any) {

    if (control.value.match(/(?=.*\d)(?=.*[a-zA-Z]).{8,}/)) {
      return null;
    } else {
      return {'invalidPassword': true};
    }
  }

  static requirePasswordValidator(control: any) {
    if (control.value === '' || control.value === undefined) {
      return {'requiredPassword': true};
    } else {
      return null;
    }
  }

  static requireNewPasswordValidator(control: any) {
    if (control.value === '' || control.value === undefined) {
      return {'requiredNewPassword': true};
    } else {
      return null;
    }
  }

  static requireCurrentPasswordValidator(control: any) {
    if (control.value === '' || control.value === undefined) {
      return {'requiredCurrentPassword': true};
    } else {
      return null;
    }
  }

  static requireOtpValidator(control: any) {
    if (control.value === '' || control.value === undefined) {
      return {'requiredOtp': true};
    } else {
      return null;
    }
  }

  static requireConfirmPasswordValidator(control: any) {
    if (control.value === '' || control.value === undefined) {
      return {'requiredConfirmPassword': true};
    } else {
      return null;
    }
  }

  static requirePinValidator(control: any) {
    if (control.value === '' || control.value === undefined) {
      return {'requiredPin': true};
    } else {
      return null;
    }
  }

  static requireDescriptionValidator(control: any) {
    if (control.value === '' || control.value === undefined) {
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
  static urlValidator(control: any) {
    if (control.value) {
      if (control.value.match(
         /([a-z]|[A-z]|[0-9])(\.([a-z]|[A-Z]))/))
      {
        return null;
      } else {
        return {'invalidUrlAddress': true};
      }
    }
    return null;
  }


  static birthYearValidator(control: any) {
    if (control.value === '' || control.value === undefined) {
      return {'requiredBirthYear': true};
    };

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
