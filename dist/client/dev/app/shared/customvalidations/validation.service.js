"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("../constants");
var ValidationService = (function () {
    function ValidationService() {
    }
    ValidationService.getValidatorErrorMessage = function (validatorName, validatorValue) {
        var config = {
            'required': 'Required',
            'requiredEmail': constants_1.Messages.MSG_ERROR_VALIDATION_EMAIL_REQUIRED,
            'requiredWebsite': constants_1.Messages.MSG_ERROR_VALIDATION_WEBSITE_REQUIRED,
            'requiredPassword': constants_1.Messages.MSG_ERROR_VALIDATION_PASSWORD_REQUIRED,
            'requiredNewPassword': constants_1.Messages.MSG_ERROR_VALIDATION_NEWPASSWORD_REQUIRED,
            'requiredConfirmPassword': constants_1.Messages.MSG_ERROR_VALIDATION_CONFIRMPASSWORD_REQUIRED,
            'requiredCurrentPassword': constants_1.Messages.MSG_ERROR_VALIDATION_CURRENTPASSWORD_REQUIRED,
            'requiredFirstName': constants_1.Messages.MSG_ERROR_VALIDATION_FIRSTNAME_REQUIRED,
            'requiredLastName': constants_1.Messages.MSG_ERROR_VALIDATION_LASTNAME_REQUIRED,
            'requiredMobileNumber': constants_1.Messages.MSG_ERROR_VALIDATION_MOBILE_NUMBER_REQUIRED,
            'requiredPin': constants_1.Messages.MSG_ERROR_VALIDATION_PIN_REQUIRED,
            'requiredDescription': constants_1.Messages.MSG_ERROR_VALIDATION_DESCRIPTION_REQUIRED,
            'requiredCompanyDescription': constants_1.Messages.MSG_ERROR_VALIDATION_ABOUT_COMPANY_REQUIRED,
            'requiredCompanyName': constants_1.Messages.MSG_ERROR_VALIDATION_COMPANYNAME_REQUIRED,
            'requiredOtp': constants_1.Messages.MSG_ERROR_VALIDATION_OTP_REQUIRED,
            'requiredBirthYear': constants_1.Messages.MSG_ERROR_VALIDATION_BIRTHYEAR_REQUIRED,
            'invalidEmailAddress': constants_1.Messages.MSG_ERROR_VALIDATION_INVALID_EMAIL_REQUIRED,
            'invalidUrlAddress': constants_1.Messages.MSG_ERROR_VALIDATION_INVALID_URL_REQUIRED,
            'invalidName': constants_1.Messages.MSG_ERROR_VALIDATION_INVALID_NAME,
            'containsWhiteSpace': constants_1.Messages.MSG_ERROR_VALIDATION_INVALID_DATA,
            'invalidPassword': constants_1.Messages.MSG_ERROR_VALIDATION_PASSWORD,
            'invalidMobile': constants_1.Messages.MSG_ERROR_VALIDATION_OTP_MOBILE_NUMBER,
            'invalidBirthYear': constants_1.Messages.MSG_ERROR_VALIDATION_BIRTHYEAR_INVALID,
            'invalidPin': constants_1.Messages.MSG_ERROR_VALIDATION_PIN_NUMBER,
            'requiredProjectName': constants_1.Messages.MSG_ERROR_VALIDATION_PROJECT_NAME_REQUIRED,
            'requiredProjectAddress': constants_1.Messages.MSG_ERROR_VALIDATION_PROJECT_ADDRESS_REQUIRED,
            'requiredPlotArea': constants_1.Messages.MSG_ERROR_VALIDATION_PLOT_AREA_REQUIRED,
            'requiredProjectDuration': constants_1.Messages.MSG_ERROR_VALIDATION_PROJECT_DURATION_REQUIRED,
            'requiredPlotPeriphery': constants_1.Messages.MSG_ERROR_VALIDATION_PLOT_PERIPHERY_REQUIRED,
            'requiredPodiumArea': constants_1.Messages.MSG_ERROR_VALIDATION_PODIUM_AREA_REQUIRED,
            'requiredOpenSpace': constants_1.Messages.MSG_ERROR_VALIDATION_OPEN_SPACE_REQUIRED,
            'requiredSwimmingPoolCapacity': constants_1.Messages.MSG_ERROR_VALIDATION_SWIMMING_POOL_CAPACITY_REQUIRED,
            'requiredNumOfBuildings': constants_1.Messages.MSG_ERROR_VALIDATION_NUM_OF_BUILDINGS_REQUIRED,
            'requiredBuildingName': constants_1.Messages.MSG_ERROR_VALIDATION_BUILDING_NAME_REQUIRED,
            'requiredSlabArea': constants_1.Messages.MSG_ERROR_VALIDATION_SLAB_AREA_REQUIRED,
            'requiredCarpetArea': constants_1.Messages.MSG_ERROR_VALIDATION_CARPET_AREA_REQUIRED,
            'requiredSalebleArea': constants_1.Messages.MSG_ERROR_VALIDATION_SALEBLE_AREA_REQUIRED,
            'requiredPlinthArea': constants_1.Messages.MSG_ERROR_VALIDATION_PLINTH_AREA_REQUIRED,
            'requiredTotalNumOfFloors': constants_1.Messages.MSG_ERROR_VALIDATION_NO_OF_FLOORS_REQUIRED,
            'requiredNumOfParkingFloors': constants_1.Messages.MSG_ERROR_VALIDATION_NO_OF_PARKING_FLOORS_REQUIRED,
            'requiredCarpetAreaOfParking': constants_1.Messages.MSG_ERROR_VALIDATION_CARPET_AREA_OF_PARKING_REQUIRED,
            'requiredParkingArea': constants_1.Messages.MSG_ERROR_VALIDATION_PARKING_AREA_REQUIRED,
            'requiredOneBHK': constants_1.Messages.MSG_ERROR_VALIDATION_ONE_BHK_REQUIRED,
            'requiredTwoBHK': constants_1.Messages.MSG_ERROR_VALIDATION_TWO_BHK_REQUIRED,
            'requiredThreeBHK': constants_1.Messages.MSG_ERROR_VALIDATION_THREE_BHK_REQUIRED,
            'requiredNoOfSlabs': constants_1.Messages.MSG_ERROR_VALIDATION_NO_OF_SLABS_REQUIRED,
            'requiredNoOfLifts': constants_1.Messages.MSG_ERROR_VALIDATION_NO_OF_LIFTS_REQUIRED,
            'requireAlphabates': constants_1.Messages.MSG_ERROR_VALIDATION_ALPHABATES,
            'requireItem': constants_1.Messages.MSG_ERROR_VALIDATION_QUANTITY_ITEM_REQUIRED,
            'requireNumbers': constants_1.Messages.MSG_ERROR_VALIDATION_QUANTITY_NUMBERS_REQUIRED,
            'requireLength': constants_1.Messages.MSG_ERROR_VALIDATION_QUANTITY_LENGTH_REQUIRED,
            'requireBreadth': constants_1.Messages.MSG_ERROR_VALIDATION_QUANTITY_BREADTH_REQUIRED,
            'requireHeight': constants_1.Messages.MSG_ERROR_VALIDATION_QUANTITY_HEIGHT_REQUIRED,
            'requireQuantity': constants_1.Messages.MSG_ERROR_VALIDATION_QUANTITY_QUANTITY_REQUIRED,
            'requireUnit': constants_1.Messages.MSG_ERROR_VALIDATION_QUANTITY_UNIT_REQUIRED,
            'maxlength': "Maximum " + validatorValue.requiredLength + " characters",
            'minlength': "Minimum " + validatorValue.requiredLength + " characters"
        };
        return config[validatorName];
    };
    ValidationService.emailValidator = function (control) {
        if (control.value) {
            if (control.value.match(/[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?/)) {
                return null;
            }
            else {
                return { 'invalidEmailAddress': true };
            }
        }
        return null;
    };
    ValidationService.alphabatesValidator = function (control) {
        if (control.value) {
            if (control.value.match(/^[a-zA-Z]+$/)) {
                return null;
            }
            else {
                return { 'requireAlphabates': true };
            }
        }
        return null;
    };
    ValidationService.nameValidator = function (control) {
        if (control.value.match(/^[a-zA-Z](?:[a-zA-Z ]*[a-zA-Z])?$/)) {
            return null;
        }
        else {
            return { 'invalidName': true };
        }
    };
    ValidationService.passwordValidator = function (control) {
        if (control.value.match(/(?=.*\d)(?=.*[a-zA-Z]).{6,}/)) {
            return null;
        }
        else {
            return { 'invalidPassword': true };
        }
    };
    ValidationService.urlValidator = function (control) {
        if (control.value) {
            if (control.value.match(/([a-z]|[A-z]|[0-9])(\.([a-z]|[A-Z]))/)) {
                return null;
            }
            else {
                return { 'invalidUrlAddress': true };
            }
        }
        return null;
    };
    ValidationService.requireEmailValidator = function (control) {
        if (control.value === '' || control.value === undefined) {
            return { 'requiredEmail': true };
        }
        else {
            return null;
        }
    };
    ValidationService.requireFirstNameValidator = function (control) {
        if (control.value === '' || control.value === undefined) {
            return { 'requiredFirstName': true };
        }
        else {
            return null;
        }
    };
    ValidationService.requireCompanyNameValidator = function (control) {
        if (control.value === '' || control.value === undefined) {
            return { 'requiredCompanyName': true };
        }
        else {
            return null;
        }
    };
    ValidationService.noWhiteSpaceValidator = function (control) {
        var isWhitespace = (control.value).trim().length === 0;
        if (isWhitespace) {
            return { 'containsWhiteSpace': true };
        }
        else {
            return null;
        }
    };
    ValidationService.requireCompanyDescriptionValidator = function (control) {
        if (control.value === '' || control.value === undefined) {
            return { 'requiredCompanyDescription': true };
        }
        else {
            return null;
        }
    };
    ValidationService.requireLastNameValidator = function (control) {
        if (control.value === '' || control.value === undefined) {
            return { 'requiredLastName': true };
        }
        else {
            return null;
        }
    };
    ValidationService.requireMobileNumberValidator = function (control) {
        if (control.value === '' || control.value === undefined) {
            return { 'requiredMobileNumber': true };
        }
        else {
            return null;
        }
    };
    ValidationService.requireWebsiteValidator = function (control) {
        if (control.value === '' || control.value === undefined) {
            return { 'requiredWebsite': true };
        }
        else {
            return null;
        }
    };
    ValidationService.requirePasswordValidator = function (control) {
        if (control.value === '' || control.value === undefined) {
            return { 'requiredPassword': true };
        }
        else {
            return null;
        }
    };
    ValidationService.requireNewPasswordValidator = function (control) {
        if (control.value === '' || control.value === undefined) {
            return { 'requiredNewPassword': true };
        }
        else {
            return null;
        }
    };
    ValidationService.requireCurrentPasswordValidator = function (control) {
        if (control.value === '' || control.value === undefined) {
            return { 'requiredCurrentPassword': true };
        }
        else {
            return null;
        }
    };
    ValidationService.requireOtpValidator = function (control) {
        if (control.value === '' || control.value === undefined) {
            return { 'requiredOtp': true };
        }
        else {
            return null;
        }
    };
    ValidationService.requireConfirmPasswordValidator = function (control) {
        if (control.value === '' || control.value === undefined) {
            return { 'requiredConfirmPassword': true };
        }
        else {
            return null;
        }
    };
    ValidationService.requirePinValidator = function (control) {
        if (control.value === '' || control.value === undefined) {
            return { 'requiredPin': true };
        }
        else {
            return null;
        }
    };
    ValidationService.requireDescriptionValidator = function (control) {
        if (control.value === '' || control.value === undefined) {
            return { 'requiredDescription': true };
        }
        else {
            return null;
        }
    };
    ValidationService.mobileNumberValidator = function (control) {
        var mobileNumber = control.value;
        var count = 0;
        while (mobileNumber > 1) {
            mobileNumber = (mobileNumber / 10);
            count += 1;
        }
        if (count === 10) {
            return null;
        }
        else {
            return { 'invalidMobile': true };
        }
    };
    ValidationService.birthYearValidator = function (control) {
        if (control.value === '' || control.value === undefined) {
            return { 'requiredBirthYear': true };
        }
        var birthYear = control.value;
        var count = 0;
        var isValid = false;
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
        }
        else {
            return { 'invalidBirthYear': true };
        }
    };
    ValidationService.pinValidator = function (control) {
        var pin = control.value.length;
        if (pin <= 20) {
            return null;
        }
        else {
            return { 'invalidPin': true };
        }
    };
    ValidationService.required = function (control) {
        if (control.value === '' || control.value === undefined) {
            return { 'requiredField': true };
        }
        else {
            return null;
        }
    };
    ValidationService.requiredProjectName = function (control) {
        if (control.value === '' || control.value === undefined) {
            return { 'requiredProjectName': true };
        }
        else {
            return null;
        }
    };
    ValidationService.requiredProjectAddress = function (control) {
        if (control.value === '' || control.value === undefined) {
            return { 'requiredProjectAddress': true };
        }
        else {
            return null;
        }
    };
    ValidationService.requiredPlotArea = function (control) {
        if (control.value === '' || control.value === undefined) {
            return { 'requiredPlotArea': true };
        }
        else {
            return null;
        }
    };
    ValidationService.requiredProjectDuration = function (control) {
        if (control.value === '' || control.value === undefined) {
            return { 'requiredProjectDuration': true };
        }
        else {
            return null;
        }
    };
    ValidationService.requiredPlotPeriphery = function (control) {
        if (control.value === '' || control.value === undefined) {
            return { 'requiredPlotPeriphery': true };
        }
        else {
            return null;
        }
    };
    ValidationService.requiredBuildingName = function (control) {
        if (control.value === '' || control.value === undefined) {
            return { 'requiredBuildingName': true };
        }
        else {
            return null;
        }
    };
    ValidationService.requiredSlabArea = function (control) {
        if (control.value === '' || control.value === undefined) {
            return { 'requiredSlabArea': true };
        }
        else {
            return null;
        }
    };
    ValidationService.requiredCarpetArea = function (control) {
        if (control.value === '' || control.value === undefined) {
            return { 'requiredCarpetArea': true };
        }
        else {
            return null;
        }
    };
    ValidationService.requiredSalebleArea = function (control) {
        if (control.value === '' || control.value === undefined) {
            return { 'requiredSalebleArea': true };
        }
        else {
            return null;
        }
    };
    ValidationService.requiredPlinthArea = function (control) {
        if (control.value === '' || control.value === undefined) {
            return { 'requiredPlinthArea': true };
        }
        else {
            return null;
        }
    };
    ValidationService.requiredPodiumArea = function (control) {
        if (control.value === '' || control.value === undefined) {
            return { 'requiredPodiumArea': true };
        }
        else {
            return null;
        }
    };
    ValidationService.requiredNumOfParkingFloors = function (control) {
        if (control.value === '' || control.value === undefined) {
            return { 'requiredNumOfParkingFloors': true };
        }
        else {
            return null;
        }
    };
    ValidationService.requiredCarpetAreaOfParking = function (control) {
        if (control.value === '' || control.value === undefined) {
            return { 'requiredCarpetAreaOfParking': true };
        }
        else {
            return null;
        }
    };
    ValidationService.requiredTotalNumOfFloors = function (control) {
        if (control.value === '' || control.value === undefined) {
            return { 'requiredTotalNumOfFloors': true };
        }
        else {
            return null;
        }
    };
    ValidationService.requiredNumOfBuildings = function (control) {
        if (control.value === '' || control.value === undefined) {
            return { 'requiredNumOfBuildings': true };
        }
        else {
            return null;
        }
    };
    ValidationService.requiredParkingArea = function (control) {
        if (control.value === '' || control.value === undefined) {
            return { 'requiredParkingArea': true };
        }
        else {
            return null;
        }
    };
    ValidationService.requiredOneBHK = function (control) {
        if (control.value === '' || control.value === undefined) {
            return { 'requiredOneBHK': true };
        }
        else {
            return null;
        }
    };
    ValidationService.requiredTwoBHK = function (control) {
        if (control.value === '' || control.value === undefined) {
            return { 'requiredTwoBHK': true };
        }
        else {
            return null;
        }
    };
    ValidationService.requiredThreeBHK = function (control) {
        if (control.value === '' || control.value === undefined) {
            return { 'requiredThreeBHK': true };
        }
        else {
            return null;
        }
    };
    ValidationService.requiredFourBHK = function (control) {
        if (control.value === '' || control.value === undefined) {
            return { 'requiredFourBHK': true };
        }
        else {
            return null;
        }
    };
    ValidationService.requiredFiveBHK = function (control) {
        if (control.value === '' || control.value === undefined) {
            return { 'requiredFiveBHK': true };
        }
        else {
            return null;
        }
    };
    ValidationService.requiredOpenSpace = function (control) {
        if (control.value === '' || control.value === undefined) {
            return { 'requiredOpenSpace': true };
        }
        else {
            return null;
        }
    };
    ValidationService.requiredSwimmingPoolCapacity = function (control) {
        if (control.value === '' || control.value === undefined) {
            return { 'requiredSwimmingPoolCapacity': true };
        }
        else {
            return null;
        }
    };
    ValidationService.requiredNoOfSlabs = function (control) {
        if (control.value === '' || control.value === undefined) {
            return { 'requiredNoOfSlabs': true };
        }
        else {
            return null;
        }
    };
    ValidationService.requiredNumOfLifts = function (control) {
        if (control.value === '' || control.value === undefined) {
            return { 'requiredNumOfLifts': true };
        }
        else {
            return null;
        }
    };
    ValidationService.requiredItemName = function (control) {
        if (control.value === '' || control.value === undefined) {
            return { 'requiredItemName': true };
        }
        else {
            return null;
        }
    };
    ValidationService.requiredNumbers = function (control) {
        if (control.value === '' || control.value === undefined) {
            return { 'requireNumbers': true };
        }
        else {
            return null;
        }
    };
    ValidationService.requiredLength = function (control) {
        if (control.value === '' || control.value === undefined) {
            return { 'requireLength': true };
        }
        else {
            return null;
        }
    };
    ValidationService.requiredBreadth = function (control) {
        if (control.value === '' || control.value === undefined) {
            return { 'requiredBreadth': true };
        }
        else {
            return null;
        }
    };
    ValidationService.requiredHeight = function (control) {
        if (control.value === '' || control.value === undefined) {
            return { 'requiredHeight': true };
        }
        else {
            return null;
        }
    };
    ValidationService.requiredQuantity = function (control) {
        if (control.value === '' || control.value === undefined) {
            return { 'requiredQuantity': true };
        }
        else {
            return null;
        }
    };
    ValidationService.requiredUnit = function (control) {
        if (control.value === '' || control.value === undefined) {
            return { 'requiredUnit': true };
        }
        else {
            return null;
        }
    };
    return ValidationService;
}());
exports.ValidationService = ValidationService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zaGFyZWQvY3VzdG9tdmFsaWRhdGlvbnMvdmFsaWRhdGlvbi5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMENBQXdDO0FBR3hDO0lBQUE7SUF3akJBLENBQUM7SUF0akJRLDBDQUF3QixHQUEvQixVQUFnQyxhQUFxQixFQUFFLGNBQW9CO1FBQ3pFLElBQUksTUFBTSxHQUFRO1lBQ2hCLFVBQVUsRUFBRSxVQUFVO1lBQ3RCLGVBQWUsRUFBRSxvQkFBUSxDQUFDLG1DQUFtQztZQUM3RCxpQkFBaUIsRUFBRSxvQkFBUSxDQUFDLHFDQUFxQztZQUNqRSxrQkFBa0IsRUFBRSxvQkFBUSxDQUFDLHNDQUFzQztZQUNuRSxxQkFBcUIsRUFBRSxvQkFBUSxDQUFDLHlDQUF5QztZQUN6RSx5QkFBeUIsRUFBRSxvQkFBUSxDQUFDLDZDQUE2QztZQUNqRix5QkFBeUIsRUFBRSxvQkFBUSxDQUFDLDZDQUE2QztZQUNqRixtQkFBbUIsRUFBRSxvQkFBUSxDQUFDLHVDQUF1QztZQUNyRSxrQkFBa0IsRUFBRSxvQkFBUSxDQUFDLHNDQUFzQztZQUNuRSxzQkFBc0IsRUFBRSxvQkFBUSxDQUFDLDJDQUEyQztZQUM1RSxhQUFhLEVBQUUsb0JBQVEsQ0FBQyxpQ0FBaUM7WUFDekQscUJBQXFCLEVBQUUsb0JBQVEsQ0FBQyx5Q0FBeUM7WUFDekUsNEJBQTRCLEVBQUUsb0JBQVEsQ0FBQywyQ0FBMkM7WUFDbEYscUJBQXFCLEVBQUUsb0JBQVEsQ0FBQyx5Q0FBeUM7WUFDekUsYUFBYSxFQUFFLG9CQUFRLENBQUMsaUNBQWlDO1lBQ3pELG1CQUFtQixFQUFFLG9CQUFRLENBQUMsdUNBQXVDO1lBQ3JFLHFCQUFxQixFQUFFLG9CQUFRLENBQUMsMkNBQTJDO1lBQzNFLG1CQUFtQixFQUFFLG9CQUFRLENBQUMseUNBQXlDO1lBQ3ZFLGFBQWEsRUFBRSxvQkFBUSxDQUFDLGlDQUFpQztZQUN6RCxvQkFBb0IsRUFBRSxvQkFBUSxDQUFDLGlDQUFpQztZ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T0FBTyxDQUFDLEtBQUssS0FBSyxFQUFFLElBQUksT0FBTyxDQUFDLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ3hELE1BQU0sQ0FBQyxFQUFDLGdCQUFnQixFQUFFLElBQUksRUFBQyxDQUFDO1FBQ2xDLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDZCxDQUFDO0lBQ0gsQ0FBQztJQUVNLGtDQUFnQixHQUF2QixVQUF3QixPQUFZO1FBQ2xDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEtBQUssRUFBRSxJQUFJLE9BQU8sQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztZQUN4RCxNQUFNLENBQUMsRUFBQyxrQkFBa0IsRUFBRSxJQUFJLEVBQUMsQ0FBQztRQUNwQyxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2QsQ0FBQztJQUNILENBQUM7SUFFTSw4QkFBWSxHQUFuQixVQUFvQixPQUFZO1FBQzlCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEtBQUssRUFBRSxJQUFJLE9BQU8sQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztZQUN4RCxNQUFNLENBQUMsRUFBQyxjQUFjLEVBQUUsSUFBSSxFQUFDLENBQUM7UUFDaEMsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sTUFBTSxDQUFDLElBQUksQ0FBQztRQUNkLENBQUM7SUFDSCxDQUFDO0lBRUgsd0JBQUM7QUFBRCxDQXhqQkEsQUF3akJDLElBQUE7QUF4akJZLDhDQUFpQiIsImZpbGUiOiJhcHAvc2hhcmVkL2N1c3RvbXZhbGlkYXRpb25zL3ZhbGlkYXRpb24uc2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1lc3NhZ2VzIH0gZnJvbSAnLi4vY29uc3RhbnRzJztcclxuaW1wb3J0IGFueSA9IGphc21pbmUuYW55O1xyXG5cclxuZXhwb3J0IGNsYXNzIFZhbGlkYXRpb25TZXJ2aWNlIHtcclxuXHJcbiAgc3RhdGljIGdldFZhbGlkYXRvckVycm9yTWVzc2FnZSh2YWxpZGF0b3JOYW1lOiBzdHJpbmcsIHZhbGlkYXRvclZhbHVlPzogYW55KSB7XHJcbiAgICBsZXQgY29uZmlnOiBhbnkgPSB7XHJcbiAgICAgICdyZXF1aXJlZCc6ICdSZXF1aXJlZCcsXHJcbiAgICAgICdyZXF1aXJlZEVtYWlsJzogTWVzc2FnZXMuTVNHX0VSUk9SX1ZBTElEQVRJT05fRU1BSUxfUkVRVUlSRUQsXHJcbiAgICAgICdyZXF1aXJlZFdlYnNpdGUnOiBNZXNzYWdlcy5NU0dfRVJST1JfVkFMSURBVElPTl9XRUJTSVRFX1JFUVVJUkVELFxyXG4gICAgICAncmVxdWlyZWRQYXNzd29yZCc6IE1lc3NhZ2VzLk1TR19FUlJPUl9WQUxJREFUSU9OX1BBU1NXT1JEX1JFUVVJUkVELFxyXG4gICAgICAncmVxdWlyZWROZXdQYXNzd29yZCc6IE1lc3NhZ2VzLk1TR19FUlJPUl9WQUxJREFUSU9OX05FV1BBU1NXT1JEX1JFUVVJUkVELFxyXG4gICAgICAncmVxdWlyZWRDb25maXJtUGFzc3dvcmQnOiBNZXNzYWdlcy5NU0dfRVJST1JfVkFMSURBVElPTl9DT05GSVJNUEFTU1dPUkRfUkVRVUlSRUQsXHJcbiAgICAgICdyZXF1aXJlZEN1cnJlbnRQYXNzd29yZCc6IE1lc3NhZ2VzLk1TR19FUlJPUl9WQUxJREFUSU9OX0NVUlJFTlRQQVNTV09SRF9SRVFVSVJFRCxcclxuICAgICAgJ3JlcXVpcmVkRmlyc3ROYW1lJzogTWVzc2FnZXMuTVNHX0VSUk9SX1ZBTElEQVRJT05fRklSU1ROQU1FX1JFUVVJUkVELFxyXG4gICAgICAncmVxdWlyZWRMYXN0TmFtZSc6IE1lc3NhZ2VzLk1TR19FUlJPUl9WQUxJREFUSU9OX0xBU1ROQU1FX1JFUVVJUkVELFxyXG4gICAgICAncmVxdWlyZWRNb2JpbGVOdW1iZXInOiBNZXNzYWdlcy5NU0dfRVJST1JfVkFMSURBVElPTl9NT0JJTEVfTlVNQkVSX1JFUVVJUkVELFxyXG4gICAgICAncmVxdWlyZWRQaW4nOiBNZXNzYWdlcy5NU0dfRVJST1JfVkFMSURBVElPTl9QSU5fUkVRVUlSRUQsXHJcbiAgICAgICdyZXF1aXJlZERlc2NyaXB0aW9uJzogTWVzc2FnZXMuTVNHX0VSUk9SX1ZBTElEQVRJT05fREVTQ1JJUFRJT05fUkVRVUlSRUQsXHJcbiAgICAgICdyZXF1aXJlZENvbXBhbnlEZXNjcmlwdGlvbic6IE1lc3NhZ2VzLk1TR19FUlJPUl9WQUxJREFUSU9OX0FCT1VUX0NPTVBBTllfUkVRVUlSRUQsXHJcbiAgICAgICdyZXF1aXJlZENvbXBhbnlOYW1lJzogTWVzc2FnZXMuTVNHX0VSUk9SX1ZBTElEQVRJT05fQ09NUEFOWU5BTUVfUkVRVUlSRUQsXHJcbiAgICAgICdyZXF1aXJlZE90cCc6IE1lc3NhZ2VzLk1TR19FUlJPUl9WQUxJREFUSU9OX09UUF9SRVFVSVJFRCxcclxuICAgICAgJ3JlcXVpcmVkQmlydGhZZWFyJzogTWVzc2FnZXMuTVNHX0VSUk9SX1ZBTElEQVRJT05fQklSVEhZRUFSX1JFUVVJUkVELFxyXG4gICAgICAnaW52YWxpZEVtYWlsQWRkcmVzcyc6IE1lc3NhZ2VzLk1TR19FUlJPUl9WQUxJREFUSU9OX0lOVkFMSURfRU1BSUxfUkVRVUlSRUQsXHJcbiAgICAgICdpbnZhbGlkVXJsQWRkcmVzcyc6IE1lc3NhZ2VzLk1TR19FUlJPUl9WQUxJREFUSU9OX0lOVkFMSURfVVJMX1JFUVVJUkVELFxyXG4gICAgICAnaW52YWxpZE5hbWUnOiBNZXNzYWdlcy5NU0dfRVJST1JfVkFMSURBVElPTl9JTlZBTElEX05BTUUsXHJcbiAgICAgICdjb250YWluc1doaXRlU3BhY2UnOiBNZXNzYWdlcy5NU0dfRVJST1JfVkFMSURBVElPTl9JTlZBTElEX0RBVEEsXHJcbiAgICAgICdpbnZhbGlkUGFzc3dvcmQnOiBNZXNzYWdlcy5NU0dfRVJST1JfVkFMSURBVElPTl9QQVNTV09SRCxcclxuICAgICAgJ2ludmFsaWRNb2JpbGUnOiBNZXNzYWdlcy5NU0dfRVJST1JfVkFMSURBVElPTl9PVFBfTU9CSUxFX05VTUJFUixcclxuICAgICAgJ2ludmFsaWRCaXJ0aFllYXInOiBNZXNzYWdlcy5NU0dfRVJST1JfVkFMSURBVElPTl9CSVJUSFlFQVJfSU5WQUxJRCxcclxuICAgICAgJ2ludmFsaWRQaW4nOiBNZXNzYWdlcy5NU0dfRVJST1JfVkFMSURBVElPTl9QSU5fTlVNQkVSLFxyXG5cclxuICAgICAgJ3JlcXVpcmVkUHJvamVjdE5hbWUnOiBNZXNzYWdlcy5NU0dfRVJST1JfVkFMSURBVElPTl9QUk9KRUNUX05BTUVfUkVRVUlSRUQsXHJcbiAgICAgICdyZXF1aXJlZFByb2plY3RBZGRyZXNzJzogTWVzc2FnZXMuTVNHX0VSUk9SX1ZBTElEQVRJT05fUFJPSkVDVF9BRERSRVNTX1JFUVVJUkVELFxyXG4gICAgICAncmVxdWlyZWRQbG90QXJlYSc6IE1lc3NhZ2VzLk1TR19FUlJPUl9WQUxJREFUSU9OX1BMT1RfQVJFQV9SRVFVSVJFRCxcclxuICAgICAgJ3JlcXVpcmVkUHJvamVjdER1cmF0aW9uJzogTWVzc2FnZXMuTVNHX0VSUk9SX1ZBTElEQVRJT05fUFJPSkVDVF9EVVJBVElPTl9SRVFVSVJFRCxcclxuICAgICAgJ3JlcXVpcmVkUGxvdFBlcmlwaGVyeSc6IE1lc3NhZ2VzLk1TR19FUlJPUl9WQUxJREFUSU9OX1BMT1RfUEVSSVBIRVJZX1JFUVVJUkVELFxyXG4gICAgICAncmVxdWlyZWRQb2RpdW1BcmVhJzogTWVzc2FnZXMuTVNHX0VSUk9SX1ZBTElEQVRJT05fUE9ESVVNX0FSRUFfUkVRVUlSRUQsXHJcbiAgICAgICdyZXF1aXJlZE9wZW5TcGFjZSc6IE1lc3NhZ2VzLk1TR19FUlJPUl9WQUxJREFUSU9OX09QRU5fU1BBQ0VfUkVRVUlSRUQsXHJcbiAgICAgICdyZXF1aXJlZFN3aW1taW5nUG9vbENhcGFjaXR5JzogTWVzc2FnZXMuTVNHX0VSUk9SX1ZBTElEQVRJT05fU1dJTU1JTkdfUE9PTF9DQVBBQ0lUWV9SRVFVSVJFRCxcclxuICAgICAgJ3JlcXVpcmVkTnVtT2ZCdWlsZGluZ3MnOiBNZXNzYWdlcy5NU0dfRVJST1JfVkFMSURBVElPTl9OVU1fT0ZfQlVJTERJTkdTX1JFUVVJUkVELFxyXG5cclxuICAgICAgJ3JlcXVpcmVkQnVpbGRpbmdOYW1lJzogTWVzc2FnZXMuTVNHX0VSUk9SX1ZBTElEQVRJT05fQlVJTERJTkdfTkFNRV9SRVFVSVJFRCxcclxuICAgICAgJ3JlcXVpcmVkU2xhYkFyZWEnOiBNZXNzYWdlcy5NU0dfRVJST1JfVkFMSURBVElPTl9TTEFCX0FSRUFfUkVRVUlSRUQsXHJcbiAgICAgICdyZXF1aXJlZENhcnBldEFyZWEnOiBNZXNzYWdlcy5NU0dfRVJST1JfVkFMSURBVElPTl9DQVJQRVRfQVJFQV9SRVFVSVJFRCxcclxuICAgICAgJ3JlcXVpcmVkU2FsZWJsZUFyZWEnOiBNZXNzYWdlcy5NU0dfRVJST1JfVkFMSURBVElPTl9TQUxFQkxFX0FSRUFfUkVRVUlSRUQsXHJcbiAgICAgICdyZXF1aXJlZFBsaW50aEFyZWEnOiBNZXNzYWdlcy5NU0dfRVJST1JfVkFMSURBVElPTl9QTElOVEhfQVJFQV9SRVFVSVJFRCxcclxuICAgICAgJ3JlcXVpcmVkVG90YWxOdW1PZkZsb29ycyc6IE1lc3NhZ2VzLk1TR19FUlJPUl9WQUxJREFUSU9OX05PX09GX0ZMT09SU19SRVFVSVJFRCxcclxuICAgICAgJ3JlcXVpcmVkTnVtT2ZQYXJraW5nRmxvb3JzJzogTWVzc2FnZXMuTVNHX0VSUk9SX1ZBTElEQVRJT05fTk9fT0ZfUEFSS0lOR19GTE9PUlNfUkVRVUlSRUQsXHJcbiAgICAgICdyZXF1aXJlZENhcnBldEFyZWFPZlBhcmtpbmcnOiBNZXNzYWdlcy5NU0dfRVJST1JfVkFMSURBVElPTl9DQVJQRVRfQVJFQV9PRl9QQVJLSU5HX1JFUVVJUkVELFxyXG4gICAgICAncmVxdWlyZWRQYXJraW5nQXJlYSc6IE1lc3NhZ2VzLk1TR19FUlJPUl9WQUxJREFUSU9OX1BBUktJTkdfQVJFQV9SRVFVSVJFRCxcclxuICAgICAgJ3JlcXVpcmVkT25lQkhLJzogTWVzc2FnZXMuTVNHX0VSUk9SX1ZBTElEQVRJT05fT05FX0JIS19SRVFVSVJFRCxcclxuICAgICAgJ3JlcXVpcmVkVHdvQkhLJzogTWVzc2FnZXMuTVNHX0VSUk9SX1ZBTElEQVRJT05fVFdPX0JIS19SRVFVSVJFRCxcclxuICAgICAgJ3JlcXVpcmVkVGhyZWVCSEsnOiBNZXNzYWdlcy5NU0dfRVJST1JfVkFMSURBVElPTl9USFJFRV9CSEtfUkVRVUlSRUQsXHJcbiAgICAgICdyZXF1aXJlZE5vT2ZTbGFicyc6IE1lc3NhZ2VzLk1TR19FUlJPUl9WQUxJREFUSU9OX05PX09GX1NMQUJTX1JFUVVJUkVELFxyXG4gICAgICAncmVxdWlyZWROb09mTGlmdHMnOiBNZXNzYWdlcy5NU0dfRVJST1JfVkFMSURBVElPTl9OT19PRl9MSUZUU19SRVFVSVJFRCxcclxuICAgICAgJ3JlcXVpcmVBbHBoYWJhdGVzJzogTWVzc2FnZXMuTVNHX0VSUk9SX1ZBTElEQVRJT05fQUxQSEFCQVRFUyxcclxuXHJcbiAgICAgIC8vUXVhbnRpcnlcclxuICAgICAgJ3JlcXVpcmVJdGVtJzogTWVzc2FnZXMuTVNHX0VSUk9SX1ZBTElEQVRJT05fUVVBTlRJVFlfSVRFTV9SRVFVSVJFRCxcclxuICAgICAgJ3JlcXVpcmVOdW1iZXJzJzogTWVzc2FnZXMuTVNHX0VSUk9SX1ZBTElEQVRJT05fUVVBTlRJVFlfTlVNQkVSU19SRVFVSVJFRCxcclxuICAgICAgJ3JlcXVpcmVMZW5ndGgnOiBNZXNzYWdlcy5NU0dfRVJST1JfVkFMSURBVElPTl9RVUFOVElUWV9MRU5HVEhfUkVRVUlSRUQsXHJcbiAgICAgICdyZXF1aXJlQnJlYWR0aCc6IE1lc3NhZ2VzLk1TR19FUlJPUl9WQUxJREFUSU9OX1FVQU5USVRZX0JSRUFEVEhfUkVRVUlSRUQsXHJcbiAgICAgICdyZXF1aXJlSGVpZ2h0JzogTWVzc2FnZXMuTVNHX0VSUk9SX1ZBTElEQVRJT05fUVVBTlRJVFlfSEVJR0hUX1JFUVVJUkVELFxyXG4gICAgICAncmVxdWlyZVF1YW50aXR5JzogTWVzc2FnZXMuTVNHX0VSUk9SX1ZBTElEQVRJT05fUVVBTlRJVFlfUVVBTlRJVFlfUkVRVUlSRUQsXHJcbiAgICAgICdyZXF1aXJlVW5pdCc6IE1lc3NhZ2VzLk1TR19FUlJPUl9WQUxJREFUSU9OX1FVQU5USVRZX1VOSVRfUkVRVUlSRUQsXHJcblxyXG5cclxuICAgICAgJ21heGxlbmd0aCc6IGBNYXhpbXVtICR7dmFsaWRhdG9yVmFsdWUucmVxdWlyZWRMZW5ndGh9IGNoYXJhY3RlcnNgLFxyXG4gICAgICAnbWlubGVuZ3RoJzogYE1pbmltdW0gJHt2YWxpZGF0b3JWYWx1ZS5yZXF1aXJlZExlbmd0aH0gY2hhcmFjdGVyc2BcclxuXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIGNvbmZpZ1t2YWxpZGF0b3JOYW1lXTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBlbWFpbFZhbGlkYXRvcihjb250cm9sOiBhbnkpIHtcclxuICAgIGlmIChjb250cm9sLnZhbHVlKSB7XHJcbiAgICAgIGlmIChjb250cm9sLnZhbHVlLm1hdGNoKFxyXG4gICAgICAgICAgL1thLXpBLVowLTkhIyQlJicqKy89P15fYHt8fX4tXSsoPzpcXC5bYS16QS1aMC05ISMkJSYnKisvPT9eX2B7fH1+LV0rKSpAKD86W2EtekEtWjAtOV0oPzpbYS16QS1aMC05LV0qW2EtekEtWjAtOV0pP1xcLikrW2EtekEtWjAtOV0oPzpbYS16QS1aMC05LV0qW2EtekEtWjAtOV0pPy8pKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHsnaW52YWxpZEVtYWlsQWRkcmVzcyc6IHRydWV9O1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBhbHBoYWJhdGVzVmFsaWRhdG9yKGNvbnRyb2w6IGFueSkge1xyXG4gICAgaWYgKGNvbnRyb2wudmFsdWUpIHtcclxuICAgICAgaWYgKGNvbnRyb2wudmFsdWUubWF0Y2goL15bYS16QS1aXSskLykpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4geydyZXF1aXJlQWxwaGFiYXRlcyc6IHRydWV9O1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBuYW1lVmFsaWRhdG9yKGNvbnRyb2w6IGFueSkge1xyXG4gICAgaWYgKGNvbnRyb2wudmFsdWUubWF0Y2goL15bYS16QS1aXSg/OlthLXpBLVogXSpbYS16QS1aXSk/JC8pKSB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIHsnaW52YWxpZE5hbWUnOiB0cnVlfTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHN0YXRpYyBwYXNzd29yZFZhbGlkYXRvcihjb250cm9sOiBhbnkpIHtcclxuXHJcbiAgICBpZiAoY29udHJvbC52YWx1ZS5tYXRjaCgvKD89LipcXGQpKD89LipbYS16QS1aXSkuezYsfS8pKSB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIHsnaW52YWxpZFBhc3N3b3JkJzogdHJ1ZX07XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgdXJsVmFsaWRhdG9yKGNvbnRyb2w6IGFueSkge1xyXG4gICAgaWYgKGNvbnRyb2wudmFsdWUpIHtcclxuICAgICAgaWYgKGNvbnRyb2wudmFsdWUubWF0Y2goXHJcbiAgICAgICAgICAvKFthLXpdfFtBLXpdfFswLTldKShcXC4oW2Etel18W0EtWl0pKS8pKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHsnaW52YWxpZFVybEFkZHJlc3MnOiB0cnVlfTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgcmVxdWlyZUVtYWlsVmFsaWRhdG9yKGNvbnRyb2w6IGFueSkge1xyXG4gICAgaWYgKGNvbnRyb2wudmFsdWUgPT09ICcnIHx8IGNvbnRyb2wudmFsdWUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICByZXR1cm4geydyZXF1aXJlZEVtYWlsJzogdHJ1ZX07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHN0YXRpYyByZXF1aXJlRmlyc3ROYW1lVmFsaWRhdG9yKGNvbnRyb2w6IGFueSkge1xyXG4gICAgaWYgKGNvbnRyb2wudmFsdWUgPT09ICcnIHx8IGNvbnRyb2wudmFsdWUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICByZXR1cm4geydyZXF1aXJlZEZpcnN0TmFtZSc6IHRydWV9O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgcmVxdWlyZUNvbXBhbnlOYW1lVmFsaWRhdG9yKGNvbnRyb2w6IGFueSkge1xyXG4gICAgaWYgKGNvbnRyb2wudmFsdWUgPT09ICcnIHx8IGNvbnRyb2wudmFsdWUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICByZXR1cm4geydyZXF1aXJlZENvbXBhbnlOYW1lJzogdHJ1ZX07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHN0YXRpYyBub1doaXRlU3BhY2VWYWxpZGF0b3IoY29udHJvbDogYW55KSB7XHJcbiAgICBsZXQgaXNXaGl0ZXNwYWNlID0gKGNvbnRyb2wudmFsdWUpLnRyaW0oKS5sZW5ndGggPT09IDA7XHJcbiAgICBpZiAoaXNXaGl0ZXNwYWNlKSB7XHJcbiAgICAgIHJldHVybiB7J2NvbnRhaW5zV2hpdGVTcGFjZSc6IHRydWV9O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgc3RhdGljIHJlcXVpcmVDb21wYW55RGVzY3JpcHRpb25WYWxpZGF0b3IoY29udHJvbDogYW55KSB7XHJcbiAgICBpZiAoY29udHJvbC52YWx1ZSA9PT0gJycgfHwgY29udHJvbC52YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHJldHVybiB7J3JlcXVpcmVkQ29tcGFueURlc2NyaXB0aW9uJzogdHJ1ZX07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHN0YXRpYyByZXF1aXJlTGFzdE5hbWVWYWxpZGF0b3IoY29udHJvbDogYW55KSB7XHJcbiAgICBpZiAoY29udHJvbC52YWx1ZSA9PT0gJycgfHwgY29udHJvbC52YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHJldHVybiB7J3JlcXVpcmVkTGFzdE5hbWUnOiB0cnVlfTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc3RhdGljIHJlcXVpcmVNb2JpbGVOdW1iZXJWYWxpZGF0b3IoY29udHJvbDogYW55KSB7XHJcbiAgICBpZiAoY29udHJvbC52YWx1ZSA9PT0gJycgfHwgY29udHJvbC52YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHJldHVybiB7J3JlcXVpcmVkTW9iaWxlTnVtYmVyJzogdHJ1ZX07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHN0YXRpYyByZXF1aXJlV2Vic2l0ZVZhbGlkYXRvcihjb250cm9sOiBhbnkpIHtcclxuICAgIGlmIChjb250cm9sLnZhbHVlID09PSAnJyB8fCBjb250cm9sLnZhbHVlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgcmV0dXJuIHsncmVxdWlyZWRXZWJzaXRlJzogdHJ1ZX07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHN0YXRpYyByZXF1aXJlUGFzc3dvcmRWYWxpZGF0b3IoY29udHJvbDogYW55KSB7XHJcbiAgICBpZiAoY29udHJvbC52YWx1ZSA9PT0gJycgfHwgY29udHJvbC52YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHJldHVybiB7J3JlcXVpcmVkUGFzc3dvcmQnOiB0cnVlfTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc3RhdGljIHJlcXVpcmVOZXdQYXNzd29yZFZhbGlkYXRvcihjb250cm9sOiBhbnkpIHtcclxuICAgIGlmIChjb250cm9sLnZhbHVlID09PSAnJyB8fCBjb250cm9sLnZhbHVlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgcmV0dXJuIHsncmVxdWlyZWROZXdQYXNzd29yZCc6IHRydWV9O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgcmVxdWlyZUN1cnJlbnRQYXNzd29yZFZhbGlkYXRvcihjb250cm9sOiBhbnkpIHtcclxuICAgIGlmIChjb250cm9sLnZhbHVlID09PSAnJyB8fCBjb250cm9sLnZhbHVlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgcmV0dXJuIHsncmVxdWlyZWRDdXJyZW50UGFzc3dvcmQnOiB0cnVlfTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc3RhdGljIHJlcXVpcmVPdHBWYWxpZGF0b3IoY29udHJvbDogYW55KSB7XHJcbiAgICBpZiAoY29udHJvbC52YWx1ZSA9PT0gJycgfHwgY29udHJvbC52YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHJldHVybiB7J3JlcXVpcmVkT3RwJzogdHJ1ZX07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHN0YXRpYyByZXF1aXJlQ29uZmlybVBhc3N3b3JkVmFsaWRhdG9yKGNvbnRyb2w6IGFueSkge1xyXG4gICAgaWYgKGNvbnRyb2wudmFsdWUgPT09ICcnIHx8IGNvbnRyb2wudmFsdWUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICByZXR1cm4geydyZXF1aXJlZENvbmZpcm1QYXNzd29yZCc6IHRydWV9O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgcmVxdWlyZVBpblZhbGlkYXRvcihjb250cm9sOiBhbnkpIHtcclxuICAgIGlmIChjb250cm9sLnZhbHVlID09PSAnJyB8fCBjb250cm9sLnZhbHVlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgcmV0dXJuIHsncmVxdWlyZWRQaW4nOiB0cnVlfTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc3RhdGljIHJlcXVpcmVEZXNjcmlwdGlvblZhbGlkYXRvcihjb250cm9sOiBhbnkpIHtcclxuICAgIGlmIChjb250cm9sLnZhbHVlID09PSAnJyB8fCBjb250cm9sLnZhbHVlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgcmV0dXJuIHsncmVxdWlyZWREZXNjcmlwdGlvbic6IHRydWV9O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgbW9iaWxlTnVtYmVyVmFsaWRhdG9yKGNvbnRyb2w6IGFueSkge1xyXG4gICAgdmFyIG1vYmlsZU51bWJlciA9IGNvbnRyb2wudmFsdWU7XHJcbiAgICB2YXIgY291bnQgPSAwO1xyXG5cclxuICAgIHdoaWxlIChtb2JpbGVOdW1iZXIgPiAxKSB7XHJcbiAgICAgIG1vYmlsZU51bWJlciA9IChtb2JpbGVOdW1iZXIgLyAxMCk7XHJcbiAgICAgIGNvdW50ICs9IDE7XHJcbiAgICB9XHJcbiAgICBpZiAoY291bnQgPT09IDEwKSB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIHsnaW52YWxpZE1vYmlsZSc6IHRydWV9O1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc3RhdGljIGJpcnRoWWVhclZhbGlkYXRvcihjb250cm9sOiBhbnkpIHtcclxuICAgIGlmIChjb250cm9sLnZhbHVlID09PSAnJyB8fCBjb250cm9sLnZhbHVlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgcmV0dXJuIHsncmVxdWlyZWRCaXJ0aFllYXInOiB0cnVlfTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgYmlydGhZZWFyID0gY29udHJvbC52YWx1ZTtcclxuICAgIHZhciBjb3VudCA9IDA7XHJcbiAgICB2YXIgaXNWYWxpZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgdmFyIGN1cnJlbnREYXRlID0gbmV3IERhdGUoKTtcclxuICAgIHZhciB5ZWFyID0gY3VycmVudERhdGUuZ2V0VVRDRnVsbFllYXIoKSAtIDE4O1xyXG4gICAgaWYgKGJpcnRoWWVhciA+IHllYXIgLSA2MCAmJiBiaXJ0aFllYXIgPD0geWVhcikge1xyXG4gICAgICBpc1ZhbGlkID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIHdoaWxlIChiaXJ0aFllYXIgPiAxKSB7XHJcbiAgICAgIGJpcnRoWWVhciA9IChiaXJ0aFllYXIgLyAxMCk7XHJcbiAgICAgIGNvdW50ICs9IDE7XHJcblxyXG4gICAgfVxyXG4gICAgaWYgKGNvdW50ID09PSA0ICYmIGlzVmFsaWQgPT09IHRydWUpIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4geydpbnZhbGlkQmlydGhZZWFyJzogdHJ1ZX07XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgcGluVmFsaWRhdG9yKGNvbnRyb2w6IGFueSkge1xyXG4gICAgdmFyIHBpbiA9IGNvbnRyb2wudmFsdWUubGVuZ3RoO1xyXG5cclxuICAgIGlmIChwaW4gPD0gMjApIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4geydpbnZhbGlkUGluJzogdHJ1ZX07XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgcmVxdWlyZWQoY29udHJvbDogYW55KSB7XHJcbiAgICBpZiAoY29udHJvbC52YWx1ZSA9PT0gJycgfHwgY29udHJvbC52YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHJldHVybiB7J3JlcXVpcmVkRmllbGQnOiB0cnVlfTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG4gIHN0YXRpYyByZXF1aXJlZFByb2plY3ROYW1lKGNvbnRyb2w6IGFueSkge1xyXG4gICAgaWYgKGNvbnRyb2wudmFsdWUgPT09ICcnIHx8IGNvbnRyb2wudmFsdWUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICByZXR1cm4geydyZXF1aXJlZFByb2plY3ROYW1lJzogdHJ1ZX07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG5cclxuICBzdGF0aWMgcmVxdWlyZWRQcm9qZWN0QWRkcmVzcyhjb250cm9sOiBhbnkpIHtcclxuICAgIGlmIChjb250cm9sLnZhbHVlID09PSAnJyB8fCBjb250cm9sLnZhbHVlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgcmV0dXJuIHsncmVxdWlyZWRQcm9qZWN0QWRkcmVzcyc6IHRydWV9O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgc3RhdGljIHJlcXVpcmVkUGxvdEFyZWEoY29udHJvbDogYW55KSB7XHJcbiAgICBpZiAoY29udHJvbC52YWx1ZSA9PT0gJycgfHwgY29udHJvbC52YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHJldHVybiB7J3JlcXVpcmVkUGxvdEFyZWEnOiB0cnVlfTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG4gIHN0YXRpYyByZXF1aXJlZFByb2plY3REdXJhdGlvbihjb250cm9sOiBhbnkpIHtcclxuICAgIGlmIChjb250cm9sLnZhbHVlID09PSAnJyB8fCBjb250cm9sLnZhbHVlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgcmV0dXJuIHsncmVxdWlyZWRQcm9qZWN0RHVyYXRpb24nOiB0cnVlfTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG4gIHN0YXRpYyByZXF1aXJlZFBsb3RQZXJpcGhlcnkoY29udHJvbDogYW55KSB7XHJcbiAgICBpZiAoY29udHJvbC52YWx1ZSA9PT0gJycgfHwgY29udHJvbC52YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHJldHVybiB7J3JlcXVpcmVkUGxvdFBlcmlwaGVyeSc6IHRydWV9O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgc3RhdGljIHJlcXVpcmVkQnVpbGRpbmdOYW1lKGNvbnRyb2w6IGFueSkge1xyXG4gICAgaWYgKGNvbnRyb2wudmFsdWUgPT09ICcnIHx8IGNvbnRyb2wudmFsdWUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICByZXR1cm4geydyZXF1aXJlZEJ1aWxkaW5nTmFtZSc6IHRydWV9O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgcmVxdWlyZWRTbGFiQXJlYShjb250cm9sOiBhbnkpIHtcclxuICAgIGlmIChjb250cm9sLnZhbHVlID09PSAnJyB8fCBjb250cm9sLnZhbHVlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgcmV0dXJuIHsncmVxdWlyZWRTbGFiQXJlYSc6IHRydWV9O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgcmVxdWlyZWRDYXJwZXRBcmVhKGNvbnRyb2w6IGFueSkge1xyXG4gICAgaWYgKGNvbnRyb2wudmFsdWUgPT09ICcnIHx8IGNvbnRyb2wudmFsdWUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICByZXR1cm4geydyZXF1aXJlZENhcnBldEFyZWEnOiB0cnVlfTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG4gIHN0YXRpYyByZXF1aXJlZFNhbGVibGVBcmVhKGNvbnRyb2w6IGFueSkge1xyXG4gICAgaWYgKGNvbnRyb2wudmFsdWUgPT09ICcnIHx8IGNvbnRyb2wudmFsdWUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICByZXR1cm4geydyZXF1aXJlZFNhbGVibGVBcmVhJzogdHJ1ZX07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHN0YXRpYyByZXF1aXJlZFBsaW50aEFyZWEoY29udHJvbDogYW55KSB7XHJcbiAgICBpZiAoY29udHJvbC52YWx1ZSA9PT0gJycgfHwgY29udHJvbC52YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHJldHVybiB7J3JlcXVpcmVkUGxpbnRoQXJlYSc6IHRydWV9O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgcmVxdWlyZWRQb2RpdW1BcmVhKGNvbnRyb2w6IGFueSkge1xyXG4gICAgaWYgKGNvbnRyb2wudmFsdWUgPT09ICcnIHx8IGNvbnRyb2wudmFsdWUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICByZXR1cm4geydyZXF1aXJlZFBvZGl1bUFyZWEnOiB0cnVlfTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc3RhdGljIHJlcXVpcmVkTnVtT2ZQYXJraW5nRmxvb3JzKGNvbnRyb2w6IGFueSkge1xyXG4gICAgaWYgKGNvbnRyb2wudmFsdWUgPT09ICcnIHx8IGNvbnRyb2wudmFsdWUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICByZXR1cm4geydyZXF1aXJlZE51bU9mUGFya2luZ0Zsb29ycyc6IHRydWV9O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgcmVxdWlyZWRDYXJwZXRBcmVhT2ZQYXJraW5nKGNvbnRyb2w6IGFueSkge1xyXG4gICAgaWYgKGNvbnRyb2wudmFsdWUgPT09ICcnIHx8IGNvbnRyb2wudmFsdWUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICByZXR1cm4geydyZXF1aXJlZENhcnBldEFyZWFPZlBhcmtpbmcnOiB0cnVlfTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc3RhdGljIHJlcXVpcmVkVG90YWxOdW1PZkZsb29ycyhjb250cm9sOiBhbnkpIHtcclxuICAgIGlmIChjb250cm9sLnZhbHVlID09PSAnJyB8fCBjb250cm9sLnZhbHVlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgcmV0dXJuIHsncmVxdWlyZWRUb3RhbE51bU9mRmxvb3JzJzogdHJ1ZX07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHN0YXRpYyByZXF1aXJlZE51bU9mQnVpbGRpbmdzKGNvbnRyb2w6IGFueSkge1xyXG4gICAgaWYgKGNvbnRyb2wudmFsdWUgPT09ICcnIHx8IGNvbnRyb2wudmFsdWUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICByZXR1cm4geydyZXF1aXJlZE51bU9mQnVpbGRpbmdzJzogdHJ1ZX07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHN0YXRpYyByZXF1aXJlZFBhcmtpbmdBcmVhKGNvbnRyb2w6IGFueSkge1xyXG4gICAgaWYgKGNvbnRyb2wudmFsdWUgPT09ICcnIHx8IGNvbnRyb2wudmFsdWUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICByZXR1cm4geydyZXF1aXJlZFBhcmtpbmdBcmVhJzogdHJ1ZX07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHN0YXRpYyByZXF1aXJlZE9uZUJISyhjb250cm9sOiBhbnkpIHtcclxuICAgIGlmIChjb250cm9sLnZhbHVlID09PSAnJyB8fCBjb250cm9sLnZhbHVlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgcmV0dXJuIHsncmVxdWlyZWRPbmVCSEsnOiB0cnVlfTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc3RhdGljIHJlcXVpcmVkVHdvQkhLKGNvbnRyb2w6IGFueSkge1xyXG4gICAgaWYgKGNvbnRyb2wudmFsdWUgPT09ICcnIHx8IGNvbnRyb2wudmFsdWUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICByZXR1cm4geydyZXF1aXJlZFR3b0JISyc6IHRydWV9O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgcmVxdWlyZWRUaHJlZUJISyhjb250cm9sOiBhbnkpIHtcclxuICAgIGlmIChjb250cm9sLnZhbHVlID09PSAnJyB8fCBjb250cm9sLnZhbHVlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgcmV0dXJuIHsncmVxdWlyZWRUaHJlZUJISyc6IHRydWV9O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgcmVxdWlyZWRGb3VyQkhLKGNvbnRyb2w6IGFueSkge1xyXG4gICAgaWYgKGNvbnRyb2wudmFsdWUgPT09ICcnIHx8IGNvbnRyb2wudmFsdWUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICByZXR1cm4geydyZXF1aXJlZEZvdXJCSEsnOiB0cnVlfTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc3RhdGljIHJlcXVpcmVkRml2ZUJISyhjb250cm9sOiBhbnkpIHtcclxuICAgIGlmIChjb250cm9sLnZhbHVlID09PSAnJyB8fCBjb250cm9sLnZhbHVlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgcmV0dXJuIHsncmVxdWlyZWRGaXZlQkhLJzogdHJ1ZX07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG5cclxuICBzdGF0aWMgcmVxdWlyZWRPcGVuU3BhY2UoY29udHJvbDogYW55KSB7XHJcbiAgICBpZiAoY29udHJvbC52YWx1ZSA9PT0gJycgfHwgY29udHJvbC52YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHJldHVybiB7J3JlcXVpcmVkT3BlblNwYWNlJzogdHJ1ZX07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHN0YXRpYyByZXF1aXJlZFN3aW1taW5nUG9vbENhcGFjaXR5KGNvbnRyb2w6IGFueSkge1xyXG4gICAgaWYgKGNvbnRyb2wudmFsdWUgPT09ICcnIHx8IGNvbnRyb2wudmFsdWUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICByZXR1cm4geydyZXF1aXJlZFN3aW1taW5nUG9vbENhcGFjaXR5JzogdHJ1ZX07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHN0YXRpYyByZXF1aXJlZE5vT2ZTbGFicyhjb250cm9sOiBhbnkpIHtcclxuICAgIGlmIChjb250cm9sLnZhbHVlID09PSAnJyB8fCBjb250cm9sLnZhbHVlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgcmV0dXJuIHsncmVxdWlyZWROb09mU2xhYnMnOiB0cnVlfTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc3RhdGljIHJlcXVpcmVkTnVtT2ZMaWZ0cyhjb250cm9sOiBhbnkpIHtcclxuICAgIGlmIChjb250cm9sLnZhbHVlID09PSAnJyB8fCBjb250cm9sLnZhbHVlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgcmV0dXJuIHsncmVxdWlyZWROdW1PZkxpZnRzJzogdHJ1ZX07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHN0YXRpYyByZXF1aXJlZEl0ZW1OYW1lKGNvbnRyb2w6IGFueSkge1xyXG4gICAgaWYgKGNvbnRyb2wudmFsdWUgPT09ICcnIHx8IGNvbnRyb2wudmFsdWUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICByZXR1cm4geydyZXF1aXJlZEl0ZW1OYW1lJzogdHJ1ZX07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHN0YXRpYyByZXF1aXJlZE51bWJlcnMoY29udHJvbDogYW55KSB7XHJcbiAgICBpZiAoY29udHJvbC52YWx1ZSA9PT0gJycgfHwgY29udHJvbC52YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHJldHVybiB7J3JlcXVpcmVOdW1iZXJzJzogdHJ1ZX07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHN0YXRpYyByZXF1aXJlZExlbmd0aChjb250cm9sOiBhbnkpIHtcclxuICAgIGlmIChjb250cm9sLnZhbHVlID09PSAnJyB8fCBjb250cm9sLnZhbHVlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgcmV0dXJuIHsncmVxdWlyZUxlbmd0aCc6IHRydWV9O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgcmVxdWlyZWRCcmVhZHRoKGNvbnRyb2w6IGFueSkge1xyXG4gICAgaWYgKGNvbnRyb2wudmFsdWUgPT09ICcnIHx8IGNvbnRyb2wudmFsdWUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICByZXR1cm4geydyZXF1aXJlZEJyZWFkdGgnOiB0cnVlfTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc3RhdGljIHJlcXVpcmVkSGVpZ2h0KGNvbnRyb2w6IGFueSkge1xyXG4gICAgaWYgKGNvbnRyb2wudmFsdWUgPT09ICcnIHx8IGNvbnRyb2wudmFsdWUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICByZXR1cm4geydyZXF1aXJlZEhlaWdodCc6IHRydWV9O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgcmVxdWlyZWRRdWFudGl0eShjb250cm9sOiBhbnkpIHtcclxuICAgIGlmIChjb250cm9sLnZhbHVlID09PSAnJyB8fCBjb250cm9sLnZhbHVlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgcmV0dXJuIHsncmVxdWlyZWRRdWFudGl0eSc6IHRydWV9O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgcmVxdWlyZWRVbml0KGNvbnRyb2w6IGFueSkge1xyXG4gICAgaWYgKGNvbnRyb2wudmFsdWUgPT09ICcnIHx8IGNvbnRyb2wudmFsdWUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICByZXR1cm4geydyZXF1aXJlZFVuaXQnOiB0cnVlfTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbn1cclxuIl19
