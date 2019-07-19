import { Messages } from '../constants';
import any = jasmine.any;

export class ValidationService {

  static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
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
      'requiredContactType': Messages.MSG_ERROR_VALIDATION_CONTACT_TYPE_REQUIRED,

      'requiredProjectName': Messages.MSG_ERROR_VALIDATION_PROJECT_NAME_REQUIRED,
      'requiredProjectAddress': Messages.MSG_ERROR_VALIDATION_PROJECT_ADDRESS_REQUIRED,
      'requiredPlotArea': Messages.MSG_ERROR_VALIDATION_PLOT_AREA_REQUIRED,
      'requiredProjectDuration': Messages.MSG_ERROR_VALIDATION_PROJECT_DURATION_REQUIRED,
      'requiredPlotPeriphery': Messages.MSG_ERROR_VALIDATION_PLOT_PERIPHERY_REQUIRED,
      'requiredPodiumArea': Messages.MSG_ERROR_VALIDATION_PODIUM_AREA_REQUIRED,
      'requiredOpenSpace': Messages.MSG_ERROR_VALIDATION_OPEN_SPACE_REQUIRED,
      'requiredSwimmingPoolCapacity': Messages.MSG_ERROR_VALIDATION_SWIMMING_POOL_CAPACITY_REQUIRED,
      'requiredNumOfBuildings': Messages.MSG_ERROR_VALIDATION_NUM_OF_BUILDINGS_REQUIRED,

      'requiredBuildingName': Messages.MSG_ERROR_VALIDATION_BUILDING_NAME_REQUIRED,
      'requiredSlabArea': Messages.MSG_ERROR_VALIDATION_SLAB_AREA_REQUIRED,
      'requiredCarpetArea': Messages.MSG_ERROR_VALIDATION_CARPET_AREA_REQUIRED,
      'requiredSalebleArea': Messages.MSG_ERROR_VALIDATION_SALEBLE_AREA_REQUIRED,
      'requiredPlinthArea': Messages.MSG_ERROR_VALIDATION_PLINTH_AREA_REQUIRED,
      'requiredTotalNumOfFloors': Messages.MSG_ERROR_VALIDATION_NO_OF_FLOORS_REQUIRED,
      'requiredNumOfParkingFloors': Messages.MSG_ERROR_VALIDATION_NO_OF_PARKING_FLOORS_REQUIRED,
      'requiredCarpetAreaOfParking': Messages.MSG_ERROR_VALIDATION_CARPET_AREA_OF_PARKING_REQUIRED,
      'requiredParkingArea': Messages.MSG_ERROR_VALIDATION_PARKING_AREA_REQUIRED,
      'requiredOneBHK': Messages.MSG_ERROR_VALIDATION_ONE_BHK_REQUIRED,
      'requiredTwoBHK': Messages.MSG_ERROR_VALIDATION_TWO_BHK_REQUIRED,
      'requiredThreeBHK': Messages.MSG_ERROR_VALIDATION_THREE_BHK_REQUIRED,
      'requiredNoOfSlabs': Messages.MSG_ERROR_VALIDATION_NO_OF_SLABS_REQUIRED,
      'requiredNoOfLifts': Messages.MSG_ERROR_VALIDATION_NO_OF_LIFTS_REQUIRED,
      'requireAlphabates': Messages.MSG_ERROR_VALIDATION_ALPHABATES,

      //Quantiry
      'requireItem': Messages.MSG_ERROR_VALIDATION_QUANTITY_ITEM_REQUIRED,
      'requireNumbers': Messages.MSG_ERROR_VALIDATION_QUANTITY_NUMBERS_REQUIRED,
      'requireLength': Messages.MSG_ERROR_VALIDATION_QUANTITY_LENGTH_REQUIRED,
      'requireBreadth': Messages.MSG_ERROR_VALIDATION_QUANTITY_BREADTH_REQUIRED,
      'requireHeight': Messages.MSG_ERROR_VALIDATION_QUANTITY_HEIGHT_REQUIRED,
      'requireQuantity': Messages.MSG_ERROR_VALIDATION_QUANTITY_QUANTITY_REQUIRED,
      'requireUnit': Messages.MSG_ERROR_VALIDATION_QUANTITY_UNIT_REQUIRED,


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

  static alphabatesValidator(control: any) {
    if (control.value) {
      if (control.value.match(/^[a-zA-Z]+$/)) {
        return null;
      } else {
        return {'requireAlphabates': true};
      }
    }
    return null;
  }

  static nameValidator(control: any) {
    if (control.value.match(/^[a-zA-Z](?:[a-zA-Z ]*[a-zA-Z])?$/)) {
      return null;
    } else {
      return {'invalidName': true};
    }
  }

  static passwordValidator(control: any) {

    if (control.value.match(/(?=.*\d)(?=.*[a-zA-Z]).{6,}/)) {
      return null;
    } else {
      return {'invalidPassword': true};
    }
  }

  static urlValidator(control: any) {
    if (control.value) {
      if (control.value.match(
          /([a-z]|[A-z]|[0-9])(\.([a-z]|[A-Z]))/)) {
        return null;
      } else {
        return {'invalidUrlAddress': true};
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

  static requireContactTypeValidator(control: any) {
    if (control.value === '' || control.value === undefined) {
      return {'requiredContactType': true};
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

  static birthYearValidator(control: any) {
    if (control.value === '' || control.value === undefined) {
      return {'requiredBirthYear': true};
    }

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

  static required(control: any) {
    if (control.value === '' || control.value === undefined) {
      return {'requiredField': true};
    } else {
      return null;
    }
  }


  static requiredProjectName(control: any) {
    if (control.value === '' || control.value === undefined) {
      return {'requiredProjectName': true};
    } else {
      return null;
    }
  }


  static requiredProjectAddress(control: any) {
    if (control.value === '' || control.value === undefined) {
      return {'requiredProjectAddress': true};
    } else {
      return null;
    }
  }


  static requiredPlotArea(control: any) {
    if (control.value === '' || control.value === undefined) {
      return {'requiredPlotArea': true};
    } else {
      return null;
    }
  }


  static requiredProjectDuration(control: any) {
    if (control.value === '' || control.value === undefined) {
      return {'requiredProjectDuration': true};
    } else {
      return null;
    }
  }


  static requiredPlotPeriphery(control: any) {
    if (control.value === '' || control.value === undefined) {
      return {'requiredPlotPeriphery': true};
    } else {
      return null;
    }
  }


  static requiredBuildingName(control: any) {
    if (control.value === '' || control.value === undefined) {
      return {'requiredBuildingName': true};
    } else {
      return null;
    }
  }

  static requiredSlabArea(control: any) {
    if (control.value === '' || control.value === undefined) {
      return {'requiredSlabArea': true};
    } else {
      return null;
    }
  }

  static requiredCarpetArea(control: any) {
    if (control.value === '' || control.value === undefined) {
      return {'requiredCarpetArea': true};
    } else {
      return null;
    }
  }


  static requiredSalebleArea(control: any) {
    if (control.value === '' || control.value === undefined) {
      return {'requiredSalebleArea': true};
    } else {
      return null;
    }
  }

  static requiredPlinthArea(control: any) {
    if (control.value === '' || control.value === undefined) {
      return {'requiredPlinthArea': true};
    } else {
      return null;
    }
  }

  static requiredPodiumArea(control: any) {
    if (control.value === '' || control.value === undefined) {
      return {'requiredPodiumArea': true};
    } else {
      return null;
    }
  }

  static requiredNumOfParkingFloors(control: any) {
    if (control.value === '' || control.value === undefined) {
      return {'requiredNumOfParkingFloors': true};
    } else {
      return null;
    }
  }

  static requiredCarpetAreaOfParking(control: any) {
    if (control.value === '' || control.value === undefined) {
      return {'requiredCarpetAreaOfParking': true};
    } else {
      return null;
    }
  }

  static requiredTotalNumOfFloors(control: any) {
    if (control.value === '' || control.value === undefined) {
      return {'requiredTotalNumOfFloors': true};
    } else {
      return null;
    }
  }

  static requiredNumOfBuildings(control: any) {
    if (control.value === '' || control.value === undefined) {
      return {'requiredNumOfBuildings': true};
    } else {
      return null;
    }
  }

  static requiredParkingArea(control: any) {
    if (control.value === '' || control.value === undefined) {
      return {'requiredParkingArea': true};
    } else {
      return null;
    }
  }

  static requiredOneBHK(control: any) {
    if (control.value === '' || control.value === undefined) {
      return {'requiredOneBHK': true};
    } else {
      return null;
    }
  }

  static requiredTwoBHK(control: any) {
    if (control.value === '' || control.value === undefined) {
      return {'requiredTwoBHK': true};
    } else {
      return null;
    }
  }

  static requiredThreeBHK(control: any) {
    if (control.value === '' || control.value === undefined) {
      return {'requiredThreeBHK': true};
    } else {
      return null;
    }
  }

  static requiredFourBHK(control: any) {
    if (control.value === '' || control.value === undefined) {
      return {'requiredFourBHK': true};
    } else {
      return null;
    }
  }

  static requiredFiveBHK(control: any) {
    if (control.value === '' || control.value === undefined) {
      return {'requiredFiveBHK': true};
    } else {
      return null;
    }
  }


  static requiredOpenSpace(control: any) {
    if (control.value === '' || control.value === undefined) {
      return {'requiredOpenSpace': true};
    } else {
      return null;
    }
  }

  static requiredSwimmingPoolCapacity(control: any) {
    if (control.value === '' || control.value === undefined) {
      return {'requiredSwimmingPoolCapacity': true};
    } else {
      return null;
    }
  }

  static requiredNoOfSlabs(control: any) {
    if (control.value === '' || control.value === undefined) {
      return {'requiredNoOfSlabs': true};
    } else {
      return null;
    }
  }

  static requiredNumOfLifts(control: any) {
    if (control.value === '' || control.value === undefined) {
      return {'requiredNumOfLifts': true};
    } else {
      return null;
    }
  }

  static requiredItemName(control: any) {
    if (control.value === '' || control.value === undefined) {
      return {'requiredItemName': true};
    } else {
      return null;
    }
  }

  static requiredNumbers(control: any) {
    if (control.value === '' || control.value === undefined) {
      return {'requireNumbers': true};
    } else {
      return null;
    }
  }

  static requiredLength(control: any) {
    if (control.value === '' || control.value === undefined) {
      return {'requireLength': true};
    } else {
      return null;
    }
  }

  static requiredBreadth(control: any) {
    if (control.value === '' || control.value === undefined) {
      return {'requiredBreadth': true};
    } else {
      return null;
    }
  }

  static requiredHeight(control: any) {
    if (control.value === '' || control.value === undefined) {
      return {'requiredHeight': true};
    } else {
      return null;
    }
  }

  static requiredQuantity(control: any) {
    if (control.value === '' || control.value === undefined) {
      return {'requiredQuantity': true};
    } else {
      return null;
    }
  }

  static requiredUnit(control: any) {
    if (control.value === '' || control.value === undefined) {
      return {'requiredUnit': true};
    } else {
      return null;
    }
  }

}
