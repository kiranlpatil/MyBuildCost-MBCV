"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AppSettings = (function () {
    function AppSettings() {
    }
    Object.defineProperty(AppSettings, "API_ENDPOINT", {
        get: function () {
            return this.IP + '/api/';
        },
        enumerable: true,
        configurable: true
    });
    AppSettings.IP = 'http://52.66.120.228:8080';
    AppSettings.HOST_NAME = '52.66.120.228:8080';
    AppSettings.INITIAL_THEM = 'container-fluid dark-theme';
    AppSettings.LIGHT_THEM = 'container-fluid light-theme';
    AppSettings.IS_SOCIAL_LOGIN_YES = 'YES';
    AppSettings.IS_SOCIAL_LOGIN_NO = 'NO';
    AppSettings.HTTP_CLIENT = 'http://';
    return AppSettings;
}());
exports.AppSettings = AppSettings;
var Messages = (function () {
    function Messages() {
    }
    Messages.FROM_REGISTRATION = 'registration';
    Messages.FROM_ACCOUNT_DETAIL = 'accountdetail';
    Messages.MSG_SUCCESS_CHANGE_MOBILE_NUMBER = 'Mobile number updated successfully.';
    Messages.MSG_SUCCESS_RESEND_VERIFICATION_CODE = 'New OTP (One Time Password) has been sent to your registered mobile number';
    Messages.MSG_SUCCESS_RESEND_VERIFICATION_CODE_RESEND_OTP = 'New OTP (One Time Password) has' +
        ' been sent to your new mobile number';
    Messages.MSG_SUCCESS_MAIL_VERIFICATION = 'Verification e-mail sent successfully to your e-mail account.';
    Messages.MSG_SUCCESS_RESET_PASSWORD = 'Your password is reset successfully.Kindly login';
    Messages.MSG_SUCCESS_CHANGE_EMAIL = 'A verification email is sent to your new email id. ' +
        'Current email id will be active till you verify new email id.';
    Messages.MSG_SUCCESS_FORGOT_PASSWORD = 'Email for password reset has been sent successfully on your registered email id.';
    Messages.MSG_SUCCESS_DASHBOARD_PROFILE = 'Your profile updated successfully.';
    Messages.MSG_SUCCESS_CONTACT = 'Email sent successfully.';
    Messages.MSG_SUCCESS_CHANGE_THEME = 'Theme changed successfully.';
    Messages.MSG_SUCCESS_MAIL_VERIFICATION_RESULT_STATUS = 'Congratulations!';
    Messages.MSG_CHANGE_PASSWORD_SUCCESS_HEADER = 'Password Changed Successfully';
    Messages.MSG_SUCCESS_MAIL_VERIFICATION_BODY = 'Your account verified successfully.' +
        'You may start using it immediately by clicking on Sign In!';
    Messages.MSG_ERROR_MAIL_VERIFICATION_BODY = 'Your account verification failed due to invalid access token!';
    Messages.MSG_ERROR_MAIL_VERIFICATION_RESULT_STATUS = 'Sorry.';
    Messages.MSG_ERROR_DASHBOARD_PROFILE_PIC = 'Failed to change profile picture.';
    Messages.MSG_ERROR_CHANGE_THEME = 'Failed to change theme.';
    Messages.MSG_ERROR_SERVER_ERROR = 'Server error.';
    Messages.MSG_ERROR_SOMETHING_WRONG = 'Internal Server Error.';
    Messages.MSG_ERROR_IMAGE_TYPE = 'Please try again. Make sure to upload only image file with extensions JPG, JPEG, GIF, PNG.';
    Messages.MSG_ERROR_IMAGE_SIZE = 'Please make sure the image size is less than 5 MB.';
    Messages.MSG_ERROR_VALIDATION_EMAIL_REQUIRED = 'Enter your e-mail address';
    Messages.MSG_ERROR_VALIDATION_WEBSITE_REQUIRED = 'Enter company website.';
    Messages.MSG_ERROR_VALIDATION_PASSWORD_REQUIRED = 'Enter your password';
    Messages.MSG_ERROR_VALIDATION_NEWPASSWORD_REQUIRED = 'Enter a new password';
    Messages.MSG_ERROR_VALIDATION_CONFIRMPASSWORD_REQUIRED = 'Confirm your password';
    Messages.MSG_ERROR_VALIDATION_CURRENTPASSWORD_REQUIRED = 'Enter your current password';
    Messages.MSG_ERROR_VALIDATION_FIRSTNAME_REQUIRED = 'Enter your name';
    Messages.MSG_ERROR_VALIDATION_LASTNAME_REQUIRED = 'This field can\'t be left blank';
    Messages.MSG_ERROR_VALIDATION_MOBILE_NUMBER_REQUIRED = 'This field can\'t be left blank';
    Messages.MSG_ERROR_VALIDATION_PIN_REQUIRED = 'Enter your pin code.';
    Messages.MSG_ERROR_VALIDATION_DESCRIPTION_REQUIRED = 'Enter the name of the document you are uploading.';
    Messages.MSG_ERROR_VALIDATION_ABOUT_COMPANY_REQUIRED = 'Give a brief description about your company. ' +
        'This will be seen by candidates as a part of the job profile.';
    Messages.MSG_ERROR_VALIDATION_COMPANYNAME_REQUIRED = 'This field can\'t be left blank.';
    Messages.MSG_ERROR_VALIDATION_OTP_REQUIRED = 'Enter received OTP.';
    Messages.MSG_ERROR_VALIDATION_INVALID_EMAIL_REQUIRED = 'Enter a valid email address';
    Messages.MSG_ERROR_VALIDATION_INVALID_URL_REQUIRED = 'Website is not valid.';
    Messages.MSG_ERROR_VALIDATION_INVALID_NAME = 'Enter valid name.';
    Messages.MSG_ERROR_VALIDATION_INVALID_DATA = 'Enter valid data.';
    Messages.MSG_ERROR_VALIDATION_PASSWORD_MISMATCHED = 'Passwords do not match';
    Messages.MSG_ERROR_VALIDATION_BIRTHYEAR_REQUIRED = 'This field can\'t be left blank.';
    Messages.MSG_ERROR_VALIDATION_BIRTHYEAR_INVALID = 'Enter valid birth-year';
    Messages.MSG_ERROR_VALIDATION_OTP_MOBILE_NUMBER = 'Please provide a valid mobile number.';
    Messages.MSG_ERROR_VALIDATION_PASSWORD = 'Password must be alphanumeric having minimum 6 characters';
    Messages.MSG_ERROR_VALIDATION_PIN_NUMBER = 'Pin code should not be greater than 20 characters.';
    Messages.MSG_ERROR_VALIDATION_ITEM_NAME_REQUIRED = 'Item name should not be blank. \nFill it.';
    Messages.MSG_ERROR_VALIDATION_PROJECT_NAME_REQUIRED = 'Enter project name';
    Messages.MSG_ERROR_VALIDATION_PROJECT_ADDRESS_REQUIRED = 'Enter project address';
    Messages.MSG_ERROR_VALIDATION_PLOT_AREA_REQUIRED = 'Enter plot area';
    Messages.MSG_ERROR_VALIDATION_PROJECT_DURATION_REQUIRED = 'Enter project duration';
    Messages.MSG_ERROR_VALIDATION_PLOT_PERIPHERY_REQUIRED = 'Enter plot periphery length';
    Messages.MSG_ERROR_VALIDATION_PODIUM_AREA_REQUIRED = 'Enter podium area';
    Messages.MSG_ERROR_VALIDATION_OPEN_SPACE_REQUIRED = 'Enter open space';
    Messages.MSG_ERROR_VALIDATION_SWIMMING_POOL_CAPACITY_REQUIRED = 'Enter swimming pool capacity';
    Messages.MSG_ERROR_VALIDATION_NUM_OF_BUILDINGS_REQUIRED = 'Enter total no. of buildings';
    Messages.MSG_ERROR_VALIDATION_BUILDING_NAME_REQUIRED = 'Enter building name';
    Messages.MSG_ERROR_VALIDATION_SLAB_AREA_REQUIRED = 'Enter slab area';
    Messages.MSG_ERROR_VALIDATION_CARPET_AREA_REQUIRED = 'Enter carpet area';
    Messages.MSG_ERROR_VALIDATION_PARKING_AREA_REQUIRED = 'Enter parking area';
    Messages.MSG_ERROR_VALIDATION_SALEBLE_AREA_REQUIRED = 'Enter saleable area';
    Messages.MSG_ERROR_VALIDATION_PLINTH_AREA_REQUIRED = 'Enter plinth area';
    Messages.MSG_ERROR_VALIDATION_NO_OF_FLOORS_REQUIRED = 'Enter no. of floors';
    Messages.MSG_ERROR_VALIDATION_NO_OF_PARKING_FLOORS_REQUIRED = 'Enter no. of parking floors';
    Messages.MSG_ERROR_VALIDATION_CARPET_AREA_OF_PARKING_REQUIRED = 'Enter carpet area of parking floors';
    Messages.MSG_ERROR_VALIDATION_ONE_BHK_REQUIRED = 'Enter no. of one BHKs';
    Messages.MSG_ERROR_VALIDATION_TWO_BHK_REQUIRED = 'Enter no. of two BHKs';
    Messages.MSG_ERROR_VALIDATION_THREE_BHK_REQUIRED = 'Enter no. of three BHKs';
    Messages.MSG_ERROR_VALIDATION_NO_OF_SLABS_REQUIRED = 'Enter no. of slabs';
    Messages.MSG_ERROR_VALIDATION_NO_OF_LIFTS_REQUIRED = 'Enter no. of lifts';
    Messages.MSG_ERROR_VALIDATION_ALPHABATES = 'Enter alphabates only';
    Messages.MSG_ERROR_VALIDATION_ADD_AT_LEAST_ONE_APARTMENT_CONFIGURATION = 'Add at least one Apartment Configuration';
    Messages.MSG_ERROR_VALIDATION_NUMBER_OF_FLOORS = 'Total number of floors should be more than number of parking floors';
    Messages.MSG_RESET_MOBILE_NUMBER = 'Enter your new mobile number and we will send you a verification code on mobile' +
        ' number you have entered.';
    Messages.MSG_RESET_EMAIL_ADDRESS = 'Enter your new account email address and we will send you a link to reset your email' +
        'address.';
    Messages.MSG_EMAIL_ACTIVATION = 'Your email has been activated. You may start using your account with new email address' +
        'immediately.';
    Messages.MSG_CONTACT_US = 'Please provide the following details and we will get back to you soon.';
    Messages.MSG_YEAR_NO_MATCH_FOUND = 'The year doesn\'t look right. Be sure to use your actual year of birth.';
    Messages.MSG_FORGOT_PASSWORD = 'Enter your e-mail address below and we\'ll get you back on track.';
    Messages.MSG_CONFIRM_PASSWORD = 'Passwords are not matching.';
    Messages.MSG_CHANGE_PASSWORD_SUCCESS = 'Password changed successfully. ' +
        'You can Sign In again with new password by clicking on "YES" button, Please click on "No" button to continue the session.';
    Messages.MSG_VERIFY_USER_1 = 'You are almost done!';
    Messages.MSG_VERIFY_USER_2 = 'We need to verify your mobile number before you can start using the system.';
    Messages.MSG_VERIFY_USER_3 = 'One Time Password(OTP) will be sent on following mobile number.';
    Messages.MSG_VERIFY_USER_4 = 'You are almost done! We need to verify your email id before you can start using the system.';
    Messages.MSG_EMAIL_NOT_MATCH = 'E-mail does not match.';
    Messages.MSG_CHANGE_PASSWORD = 'Your password protects your account so password must be strong.' +
        'Changing your password will sign you out of all your devices, including your phone.' +
        'You will need to enter your new password on all your devices.';
    Messages.MSG_MOBILE_NUMBER_NOT_MATCH = 'Mobile Number does not match.';
    Messages.MSG_MOBILE_NUMBER_Change_SUCCESS = 'Mobile number changed successfully.You can Sign In again by clicking on "yes" button,' +
        ' please click on "No" button to continue the session.';
    Messages.MSG_MOBILE_VERIFICATION_TITLE = 'Verify Your Mobile Number';
    Messages.MSG_MOBILE_NUMBER_CHANGE_VERIFICATION_TITLE = 'Verify Your  New Mobile Number';
    Messages.MSG_MOBILE_VERIFICATION_MESSAGE = 'Please enter the verification code sent to your mobile number.';
    Messages.MSG_MOBILE_NUMBER_CHANGE_VERIFICATION_MESSAGE = 'Please enter the verification code sent to your new mobile number.';
    Messages.CONTACT_US_ADDRESS = 'Blog. No. 14, 1st Floor, Electronic Estate, Parvati, Pune-Satara Road, Pune 411009, MH, INDIA.';
    Messages.CONTACT_US_CONTACT_NUMBER_1 = '+91 (20) 2421 8865';
    Messages.CONTACT_US_CONTACT_NUMBER_2 = '+91 98233 18865';
    Messages.CONTACT_US_EMAIL_1 = 'sales@techprimelab.com';
    Messages.CONTACT_US_EMAIL_2 = 'careers@techprimelab.com';
    Messages.MSG_EMAIL_VERIFICATION_HEADING = 'Your email is updated successfully.';
    Messages.MSG_EMAIL_VERIFICATION_MESSAGE = 'Kindly click on SIGN IN to use BuildInfo.';
    Messages.MSG_ACTIVATE_USER_HEADING = 'Congratulations! Welcome To BuildInfo.';
    Messages.MSG_ACTIVATE_USER_SUB_HEADING = 'You can now find candidates using the highly accurate,' +
        ' simpler, faster and powerful solution.';
    Messages.MSG_ACTIVATE_USER_MESSAGE = 'Your account has been created successfully. Kindly click Sign In.';
    Messages.MSG_ABOUT_US_DISCRIPTION = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' +
        'Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s' +
        'when an unknown printer took a galley of type and scrambled it to make a type specimen book.' +
        'It has survived not only five centuries, but also the leap into electronic typesetting,remaining essentially ' +
        'unchanged. ' +
        'It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,' +
        'and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.';
    Messages.GUIDE_MESSAGE_FOR_NEW_VIEWER = 'Thank you for showing interest, ' +
        'we will need your basic information to create your value portrait on BuildInfo. Go ahead, ' +
        'fill the form and get your value portrait!';
    Messages.NOT_FOUND_INFORMATION = 'The page you are looking for doesn\'t exist<br/>' +
        'or an other error ocourred.';
    Messages.MSG_SUCCESS_PROJECT_CREATION = 'Project has been created successfully.';
    Messages.MSG_SUCCESS_ADD_BUILDING_PROJECT = 'Building has been successfully added to project.\n' +
        'Please wait while we are synching data from rate analysis.';
    Messages.MSG_SUCCESS_CLONED_BUILDING_DETAILS = 'Your building cloned successfully.';
    Messages.MSG_SUCCESS_UPDATE_PROJECT_DETAILS = 'Your project updated successfully.';
    Messages.MSG_SUCCESS_UPDATE_BUILDING_DETAILS = 'Your building details updated successfully.';
    Messages.MSG_SUCCESS_DELETE_BUILDING = 'Building deleted successfully.';
    Messages.MSG_SUCCESS_ADD_COSTHEAD = 'Costhead added successfully.';
    Messages.MSG_SUCCESS_DELETE_COSTHEAD = 'Costhead deleted successfully.';
    Messages.MSG_SUCCESS_DELETE_ITEM = 'Your item deleted successfully.';
    Messages.MSG_SUCCESS_UPDATE_RATE = 'Rate updated.';
    Messages.MSG_QUANTITY_SHOULD_NOT_ZERO_OR_NULL = 'Quantity should not zero or null.';
    Messages.MSG_SUCCESS_SAVED_COST_HEAD_ITEM = 'Your cost head items updated successfully.';
    Messages.MSG_SUCCESS_SAVED_COST_HEAD_ITEM_ERROR = 'There is error in operation';
    Messages.MSG_SUCCESS_ADD_CATEGORY = 'Category added successfully.';
    Messages.MSG_SUCCESS_DELETE_CATEGORY = 'Category deleted successfully.';
    Messages.MSG_SUCCESS_DELETE_QUANTITY_ITEM = 'Quantity item deleted successfully.';
    Messages.MSG_SUCCESS_DELETE_QUANTITY_DETAILS = 'Quantity Details deleted successfully.';
    Messages.MSG_ALREADY_ADDED_ALL_CATEGORIES = 'Already added all Categories.';
    Messages.MSG_SUCCESS_ADD_WORKITEM = 'Workitem added successfully.';
    Messages.MSG_ALREADY_ADDED_ALL_WORKITEMS = 'Already added all workitems.';
    Messages.MSG_SUCCESS_DELETE_WORKITEM = 'Your workitem deleted successfully.';
    Messages.MSG_SUCCESS_UPDATE_THUMBRULE_RATE_COSTHEAD = 'Thumbrule rate for CostHead updated successfully.';
    Messages.MSG_SUCCESS_UPDATE_DIRECT_QUANTITY_OF_WORKITEM = 'Direct rate for workitem updated successfully.';
    Messages.MSG_ERROR_VALIDATION_QUANTITY_ITEM_REQUIRED = 'Enter item';
    Messages.MSG_ERROR_VALIDATION_QUANTITY_NUMBERS_REQUIRED = 'Enter numbers';
    Messages.MSG_ERROR_VALIDATION_QUANTITY_LENGTH_REQUIRED = 'Enter length';
    Messages.MSG_ERROR_VALIDATION_QUANTITY_BREADTH_REQUIRED = 'Enter breadth';
    Messages.MSG_ERROR_VALIDATION_QUANTITY_HEIGHT_REQUIRED = 'Enter height';
    Messages.MSG_ERROR_VALIDATION_QUANTITY_QUANTITY_REQUIRED = 'Enter quantity';
    Messages.MSG_ERROR_VALIDATION_QUANTITY_UNIT_REQUIRED = 'Enter unit';
    Messages.MSG_ERROR_VALIDATION_QUANTITY_REQUIRED = 'Fields can not be empty';
    Messages.MSG_ERROR_VALIDATION_QUANTITY_NAME_REQUIRED = 'Quantity details name is required';
    Messages.LOGIN_INFO = 'Enter your details below';
    return Messages;
}());
exports.Messages = Messages;
var NavigationRoutes = (function () {
    function NavigationRoutes() {
    }
    NavigationRoutes.APP_REGISTRATION = '/registration';
    NavigationRoutes.APP_FORGOTPASSWORD = '/forgot-password';
    NavigationRoutes.APP_PROJECT = '/project';
    NavigationRoutes.APP_BUILDING = 'building';
    NavigationRoutes.APP_CREATE_NEW_PROJECT = '/create-new-project';
    NavigationRoutes.APP_CREATE_PROJECT = '/create-project';
    NavigationRoutes.APP_VIEW_BUILDING_DETAILS = 'building/details';
    NavigationRoutes.APP_CREATE_BUILDING = '/create-building';
    NavigationRoutes.APP_LIST_PROJECT = 'project/list';
    NavigationRoutes.APP_COST_SUMMARY = 'cost-summary';
    NavigationRoutes.APP_COST_HEAD = 'cost-head';
    NavigationRoutes.APP_CATEGORY = 'category';
    NavigationRoutes.APP_COMMON_AMENITIES = 'common-amenities';
    NavigationRoutes.APP_DASHBOARD = '/dashboard';
    NavigationRoutes.APP_LOGIN = '/signin';
    NavigationRoutes.APP_START = '/';
    NavigationRoutes.VERIFY_PHONE = '/verify-phone';
    return NavigationRoutes;
}());
exports.NavigationRoutes = NavigationRoutes;
var SessionStorage = (function () {
    function SessionStorage() {
    }
    SessionStorage.ACCESS_TOKEN = 'access_token';
    SessionStorage.IS_SOCIAL_LOGIN = 'is_social_login';
    SessionStorage.PROFILE_PICTURE = 'profile_picture';
    SessionStorage.IS_LOGGED_IN = 'is_user_logged_in';
    SessionStorage.IS_USER_SIGN_IN = 'is_user_register';
    SessionStorage.CURRENT_VIEW = 'current_view';
    SessionStorage.USER_ID = 'user_id';
    SessionStorage.MOBILE_NUMBER = 'mobile_number';
    SessionStorage.VERIFIED_MOBILE_NUMBER = 'verified_mobile_number';
    SessionStorage.FIRST_NAME = 'first_name';
    SessionStorage.LAST_NAME = 'last_name';
    SessionStorage.EMAIL_ID = 'email_id';
    SessionStorage.PASSWORD = 'password';
    SessionStorage.MY_THEME = 'my_theme';
    SessionStorage.VERIFY_PHONE_VALUE = 'verify_phone_value';
    SessionStorage.CHANGE_MAIL_VALUE = 'change_mail_value';
    SessionStorage.CURRENT_PROJECT_ID = 'current_project_id';
    SessionStorage.CURRENT_PROJECT_NAME = 'current_project_name';
    SessionStorage.CURRENT_BUILDING = 'current_building_id';
    SessionStorage.CURRENT_COST_HEAD_ID = 'current_cost_head_id';
    SessionStorage.CURRENT_WORKITEM_ID = 'current_workitem_id';
    return SessionStorage;
}());
exports.SessionStorage = SessionStorage;
var LocalStorage = (function () {
    function LocalStorage() {
    }
    LocalStorage.ACCESS_TOKEN = 'access_token';
    LocalStorage.IS_LOGGED_IN = 'is_user_logged_in';
    LocalStorage.FIRST_NAME = 'first_name';
    return LocalStorage;
}());
exports.LocalStorage = LocalStorage;
var API = (function () {
    function API() {
    }
    API.NOTIFICATION = 'notification';
    API.SEND_NOTIFICATION_TO_RECRUITER = 'notify_recruiter';
    API.SEND_MAIL = 'sendmail';
    API.SEND_TO_ADMIN_MAIL = 'sendmailtoadmin';
    API.USER_PROFILE = 'user';
    API.CANDIDATE_PROFILE = 'user';
    API.USER_DATA = 'userData';
    API.LOGIN = 'user/login';
    API.FB_LOGIN = 'fbLogin';
    API.CHANGE_PASSWORD = 'user/change/password';
    API.CHANGE_MOBILE = 'user/change/mobileNumber';
    API.CHANGE_EMAIL = 'user/change/emailId';
    API.CHANGE_COMPANY_ACCOUNT_DETAILS = 'changerecruiteraccountdetails';
    API.VERIFY_CHANGED_EMAIL = 'user/verify/changedEmailId';
    API.VERIFY_EMAIL = 'user/verifyEmail';
    API.GENERATE_OTP = 'user/generateotp';
    API.VERIFY_OTP = 'user/verify/otp';
    API.VERIFY_MOBILE = 'user/verify/mobileNumber';
    API.SEND_VERIFICATION_MAIL = 'sendverificationmail';
    API.FORGOT_PASSWORD = 'user/forgotpassword';
    API.UPDATE_PICTURE = 'user/updatepicture';
    API.CHANGE_THEME = 'changetheme';
    API.RESET_PASSWORD = 'user/resetpassword';
    API.GOOGLE_LOGIN = 'googlelogin';
    API.USER_ALL_PROJECTS = 'user/all/project';
    API.PROJECT = 'project';
    API.BUILDING = 'building';
    API.COSTHEAD = 'costhead';
    API.COMMON_AMENITIES = 'common-amenities';
    API.ACTIVE_STATUS = 'activeStatus';
    API.ACTIVE_STATUS_FALSE = 'false';
    API.ACTIVE_STATUS_TRUE = 'true';
    API.CLONE = 'clone';
    API.CATEGORYLIST = 'categorylist';
    API.CATEGORY = 'category';
    API.WORKITEM = 'workitem';
    API.WORKITEMLIST = 'workitemlist';
    API.WORKITEM_ALL = 'workitem/all';
    API.QUANTITY = 'quantity';
    API.ITEM = 'item';
    API.DIRECT = 'direct';
    API.SYNC_RATE_ANALYSIS = 'syncWithRateAnalysis';
    API.THUMBRULE_RULE_RATE = 'report/thumbRuleRate';
    API.RATE = 'rate';
    API.RATES = 'rates';
    API.RATE_ITEM = 'rateItem';
    API.SQFT = 'sqft';
    API.SQM = 'sqmt';
    API.RS_PER_SQFT = 'Rs/Sqft';
    API.RS_PER_SQMT = 'Rs/Sqmt';
    API.AREA = 'area';
    API.SLAB_AREA = 'slabArea';
    API.SALEABLE_AREA = 'saleableArea';
    API.CARPET_AREA = 'carpetArea';
    API.BUDGETED_COST = 'budgetedCost';
    API.REPORT_MATERIAL_TAKE_OFF = 'report/materialtakeoff';
    API.MATERIAL_FILTERS_LIST = 'material/filters/list';
    return API;
}());
exports.API = API;
var ImagePath = (function () {
    function ImagePath() {
    }
    ImagePath.FAV_ICON = './assets/framework/images/logo/favicon.ico';
    ImagePath.BODY_BACKGROUND = './assets/build-info/page_background/page-bg.png';
    ImagePath.BODY_BACKGROUND_TRANSPARENT = './assets/build-info/page_background/page-bg-transparent.png';
    ImagePath.MY_WHITE_LOGO = './assets/build-info/header/buildinfo-logo.png';
    ImagePath.HEADER_LOGO = './assets/build-info/header/header-logo.png';
    ImagePath.MOBILE_WHITE_LOGO = './assets/build-info/header/buildinfo-logo.png';
    ImagePath.FACEBOOK_ICON = './assets/framework/images/footer/fb.svg';
    ImagePath.GOOGLE_ICON = './assets/framework/images/footer/google-plus.svg';
    ImagePath.LINKEDIN_ICON = './assets/framework/images/footer/linked-in.svg';
    ImagePath.PROFILE_IMG_ICON = './assets/framework/images/dashboard/default-profile.png';
    ImagePath.COMPANY_LOGO_IMG_ICON = './assets/framework/images/dashboard/default-company-buildinfo-logo.png';
    ImagePath.EMAIL_ICON = './assets/framework/images/icons/e-mail.svg';
    ImagePath.EMAIL_ICON_GREY = './assets/framework/images/icons/e-mail-grey.svg';
    ImagePath.NEW_EMAIL_ICON_GREY = './assets/framework/images/icons/new-e-mail-grey.svg';
    ImagePath.CONFIRM_EMAIL_ICON_GREY = './assets/framework/images/icons/confirm-e-mail-grey.svg';
    ImagePath.PASSWORD_ICON = './assets/framework/images/icons/password.svg';
    ImagePath.PASSWORD_ICON_GREY = './assets/framework/images/icons/password-grey.svg';
    ImagePath.NEW_PASSWORD_ICON_GREY = './assets/framework/images/icons/new-password-grey.svg';
    ImagePath.CONFIRM_PASSWORD_ICON_GREY = './assets/framework/images/icons/confirm-password-grey.svg';
    ImagePath.MOBILE_ICON_GREY = './assets/framework/images/icons/mobile-grey.svg';
    ImagePath.NEW_MOBILE_ICON_GREY = './assets/framework/images/icons/new-mobile-grey.svg';
    ImagePath.CONFIRM_MOBILE_ICON_GREY = './assets/framework/images/icons/confirm-mobile-grey.svg';
    return ImagePath;
}());
exports.ImagePath = ImagePath;
var ProjectAsset = (function () {
    function ProjectAsset() {
    }
    ProjectAsset._year = new Date();
    ProjectAsset.currentYear = ProjectAsset._year.getFullYear();
    ProjectAsset.APP_NAME = 'Cost Control';
    ProjectAsset.TAG_LINE = 'Help you to decide cost';
    ProjectAsset.UNDER_LICENECE = '© ' + ProjectAsset.currentYear + ' www.buildinfo.com';
    return ProjectAsset;
}());
exports.ProjectAsset = ProjectAsset;
var Headings = (function () {
    function Headings() {
    }
    Headings.CHANGE_PASSWORD = 'Change Password';
    Headings.CHANGE_EMAIL_HEADING = 'Change your Email';
    Headings.CHANGE_MOBILE_NUMBER_HEADING = 'Change Your Mobile Number';
    Headings.RESET_PASSWORD_HEADING = 'RESET PASSWORD';
    Headings.CREATE_YOUR_FIRST_PROJECT = 'Create Your First Project';
    Headings.CREATE_NEW_PROJECT = 'Create New Project';
    Headings.EDIT_BUILDING = 'Edit Building';
    Headings.LIST_BUILDING = 'Buildings List';
    Headings.ADD_NEW_BUILDING = 'Add Building in Project';
    Headings.COMMON_DEVELOPMENT = 'Common Development and Amenities';
    Headings.ELECTRIC_INFRASTRUCTURE = 'Electric Infrastructure ';
    Headings.CONSTRUCTION_COST = 'Construction Cost (Material + Labour)';
    Headings.QUANTITY = 'Quantity';
    Headings.COLON = ':';
    Headings.ITEM = 'Item';
    return Headings;
}());
exports.Headings = Headings;
var TableHeadings = (function () {
    function TableHeadings() {
    }
    TableHeadings.ITEM = 'Item';
    TableHeadings.QUANTITY = 'Qty.';
    TableHeadings.NUMBERS = 'Nos.';
    TableHeadings.LENGTH = 'Length';
    TableHeadings.BREADTH = 'Breadth';
    TableHeadings.HEIGHT = 'Height';
    TableHeadings.UNIT = 'Unit';
    TableHeadings.RATEANALYSIS = 'Rate Analysis/Unit';
    TableHeadings.AMOUNT = 'Amount';
    TableHeadings.COST = 'Cost';
    TableHeadings.TOTAL = 'Total';
    TableHeadings.DESCRIPTION = 'Description';
    TableHeadings.RATE_PER_UNIT = 'Rate/Unit';
    return TableHeadings;
}());
exports.TableHeadings = TableHeadings;
var Label = (function () {
    function Label() {
    }
    Label.CURRENT_PASSWORD_LABEL = 'Current Password';
    Label.NEW_PASSWORD_LABEL = 'New Password';
    Label.PASSWORD = 'Password';
    Label.CONFIRM_PASSWORD_LABEL = 'Confirm Password';
    Label.FIRST_NAME_LABEL = 'First Name';
    Label.COMPANY_NAME_LABEL = 'Company Name';
    Label.STATE_LABEL = 'State';
    Label.CITY_LABEL = 'City';
    Label.EMAIL_FIELD_LABEL = 'Work Email';
    Label.CONTACT_FIELD_LABEL = 'Mobile Number';
    Label.RESET_PASSWORD_MESSAGE = 'Please set new password for your';
    Label.NAME = 'Name';
    Label.ACCEPT_NAME = 'By clicking "Continue" I agree to Build Info\'s';
    Label.TERMS_AND_CONDITIONS_NAME = 'Terms of Service';
    Label.PRIVACY_POLICY = 'Privacy Policy';
    Label.START_FREE = 'Get started absolutely free';
    Label.REGISTRATION_INFO = 'See how the world\'s best Building Estimations are created.';
    Label.NOT_FOUND_ERROR = '404';
    Label.REMENBER_ME = 'Remember me';
    Label.GET_STARTED = 'Get Started';
    Label.PROJECT_NAME = 'Project Name';
    Label.PROJECT_ADDRESS = 'Project Address';
    Label.PLOT_AREA = 'Plot Area';
    Label.PLOT_PERIPHERY_LENGTH = 'Plot Periphery length';
    Label.PODIUM_AREA = 'Podium Area';
    Label.OPEN_SPACE = 'Open Space';
    Label.SLAB_AREA_OF_CLUB_HOUSE = 'Slab Area of club house';
    Label.SWIMMING_POOL_CAPACITY = 'Swimming pool capacity';
    Label.PROJECT_DURATION = 'Project Duration';
    Label.NUM_OF_BUILDINGS = 'Total No. of buildings';
    Label.UNIT_IN_LITERS = '(In ltrs)';
    Label.DURATION_IN_MONTHS = '(In months)';
    Label.AREA_UNIT_IN_RFT = '(In rft)';
    Label.BUILDING_NAME = 'Building Name';
    Label.SLAB_AREA = 'Slab Area ';
    Label.CARPET_AREA = 'Carpet area including Balconies/attached terraces ';
    Label.SALEABLE_AREA = 'Saleable Area ';
    Label.PLINTH_AREA = 'Plinth Area ';
    Label.NUM_OF_FLOORS = 'No. of floors ';
    Label.NUM_OF_PARKING_FLOORS = 'No. of parking floors';
    Label.CARPET_AREA_OF_PARKING = 'Carpet area of parking ';
    Label.APARTMENT_CONFIGURATION = 'Apartment Configuration';
    Label.NUM_OF_ONE_BHK = 'No. of 1 BHKs';
    Label.NUM_OF_TWO_BHK = 'No. of 2 BHKs';
    Label.NUM_OF_THREE_BHK = 'No. of 3 BHKs';
    Label.NUM_OF_FOUR_BHK = 'No. of 4 BHKs';
    Label.NUM_OF_FIVE_BHK = 'No. of 5 BHKs';
    Label.NUM_OF_LIFTS = 'No. of Lifts';
    Label.AREA_UNIT_IN_SQFT = '(In sqft)';
    Label.EXCLUDING_PARKING_FLOORS = '(Excluding parking floors)';
    Label.COSTING_BY_UNIT = 'Costing in ';
    Label.COSTING_PER_AREA = 'Costing per ';
    Label.TOTAL = 'Total ';
    Label.SUBTOTAL = 'Sub Total';
    Label.NOTES = 'Notes ';
    Label.BUDGETED_COST = 'Budgeted Cost ';
    Label.ESTIMATED_COST = 'Estimated Cost ';
    Label.COST_HEAD = 'Cost Head';
    Label.AMENITY_COST_HEAD = 'Amenity Cost Head';
    Label.REPORT_BY_THUMBRULE = 'By Thumbrule';
    Label.ESTIMATED = 'Estimated ';
    Label.AS_PER_PROJECT = '(as per project quantities & rates)';
    Label.GRAND_TOTAL = 'Grand Total ';
    Label.TOTAL_PROJECT = 'Total Project';
    Label.WORKITEMS = 'WorkItems';
    Label.GET_RATE = 'getRate';
    Label.GET_SYSTEM_RATE = 'getSystemRate';
    Label.GET_RATE_BY_QUANTITY = 'getRateByQuantity';
    Label.WORKITEM_RATE_TAB = 'rate';
    Label.WORKITEM_RATE_BY_QUANTITY_TAB = 'cost';
    Label.WORKITEM_SYSTEM_RATE_TAB = 'systemRA';
    Label.WORKITEM_QUANTITY_TAB = 'quantity';
    Label.GET_QUANTITY = 'Get Qty.';
    Label.QUANTITY_VIEW = 'default';
    Label.WORKITEM_DETAILED_QUANTITY_TAB = 'detailedQuantity';
    Label.DEFAULT_VIEW = 'default';
    return Label;
}());
exports.Label = Label;
var Button = (function () {
    function Button() {
    }
    Button.CHANGE_PASSWORD_BUTTON = 'Change Password';
    Button.RESET_PASSWORD_BUTTON = 'RESET PASSWORD';
    Button.CLONE_BUTTON = 'Clone';
    Button.CLOSE_BUTTON = 'Close';
    Button.CANCEL_BUTTON = 'Cancel';
    Button.VIEW_AND_EDIT = 'View and Edit';
    Button.PROCEED = 'Proceed';
    Button.NEXT = 'Next';
    Button.SUBMIT = 'Submit';
    Button.CREATE_NEW_PROJECT = 'Create New Project';
    Button.BACK_TO_HOME = 'Back to home';
    Button.GO_BACK = 'Back';
    Button.SAVE = 'Save';
    Button.GET_AMOUNT = 'Estimate Cost';
    Button.GET_RATE = 'Get Rate';
    Button.GET_QUANTITY = 'Get Qty.';
    Button.SYSTEM_RA = 'System RA';
    Button.ADD = 'Add ';
    Button.ADD_MORE_DETAILS = 'Add More Details';
    Button.CATEGORY = 'Category';
    Button.WORKITEM = 'WorkItem';
    Button.ITEM = 'Item';
    Button.ROW = 'Row';
    Button.COSTHEAD = 'Cost Head';
    return Button;
}());
exports.Button = Button;
var Units = (function () {
    function Units() {
    }
    Units.UNIT = 'sqft';
    return Units;
}());
exports.Units = Units;
var ProjectElements = (function () {
    function ProjectElements() {
    }
    ProjectElements.COST_HEAD = 'CostHead';
    ProjectElements.WORK_ITEM = 'WorkItem';
    ProjectElements.BUILDING = 'Building';
    ProjectElements.QUANTITY_ITEM = 'Quantity Item';
    ProjectElements.QUANTITY_DETAILS = 'Quantity Details';
    ProjectElements.CATEGORY = 'Category';
    ProjectElements.SLAB_AREA = 'Slab Area';
    ProjectElements.SALEABLE_AREA = 'Saleable Area';
    ProjectElements.CARPET_AREA = 'Carpet Area';
    ProjectElements.RS_PER_SQFT = 'Rs/Sqft';
    ProjectElements.RS_PER_SQMT = 'Rs/Sqmt';
    ProjectElements.SQUAREFEET = 'sqft';
    ProjectElements.SQUAREMETER = 'sqmt';
    return ProjectElements;
}());
exports.ProjectElements = ProjectElements;
var MaterialTakeOffElements = (function () {
    function MaterialTakeOffElements() {
    }
    MaterialTakeOffElements.COST_HEAD_WISE = 'Cost Head Wise';
    MaterialTakeOffElements.ALL_BUILDINGS = 'All Buildings';
    MaterialTakeOffElements.COST_HEAD = 'Cost Head';
    MaterialTakeOffElements.MATERIAL_WISE = 'Material Wise';
    MaterialTakeOffElements.MATERIAL = 'Material';
    MaterialTakeOffElements.CONTENT = 'content';
    MaterialTakeOffElements.HEADERS = 'headers';
    MaterialTakeOffElements.FOOTER = 'footer';
    MaterialTakeOffElements.SUB_CONTENT = 'subContent';
    MaterialTakeOffElements.COLUMN_ONE = 'columnOne';
    MaterialTakeOffElements.COLUMN_TWO = 'columnTwo';
    MaterialTakeOffElements.COLUMN_THREE = 'columnThree';
    MaterialTakeOffElements.ELEMENT_WISE_REPORT_COST_HEAD = 'costHead';
    MaterialTakeOffElements.ELEMENT_WISE_REPORT_MATERIAL = 'material';
    return MaterialTakeOffElements;
}());
exports.MaterialTakeOffElements = MaterialTakeOffElements;
var Menus = (function () {
    function Menus() {
    }
    Menus.COST_SUMMARY = 'Cost Summary';
    Menus.MATERIAL_TAKEOFF = 'Material Takeoff';
    Menus.PROJECT_DETAILS = 'Project Details';
    Menus.MY_PROJECTS = 'My Projects';
    Menus.CLONE = 'Clone';
    Menus.EDIT = 'Edit';
    Menus.DELETE = 'Delete';
    Menus.ADD_BUILDING = 'Add Building';
    Menus.ADD_BUILDING_TO_PROJECT = 'Add Building to Project';
    Menus.CREATE_NEW_PROJECT = 'Create New Project';
    return Menus;
}());
exports.Menus = Menus;
var ValueConstant = (function () {
    function ValueConstant() {
    }
    ValueConstant.NUMBER_OF_FRACTION_DIGIT = 2;
    return ValueConstant;
}());
exports.ValueConstant = ValueConstant;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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QUcsV0FBVyxDQUFDO0lBQ3pCLG9DQUFZLEdBQUcsYUFBYSxDQUFDO0lBQzdCLHFEQUE2QixHQUFHLFVBQVUsQ0FBQztJQUMzQyxvREFBNEIsR0FBRyxVQUFVLENBQUM7SUFDMUQsOEJBQUM7Q0FoQkQsQUFnQkMsSUFBQTtBQWhCWSwwREFBdUI7QUFrQnBDO0lBQUE7SUFXQSxDQUFDO0lBVmUsa0JBQVksR0FBRyxjQUFjLENBQUM7SUFDOUIsc0JBQWdCLEdBQUcsa0JBQWtCLENBQUM7SUFDdEMscUJBQWUsR0FBRyxpQkFBaUIsQ0FBQztJQUNwQyxpQkFBVyxHQUFHLGFBQWEsQ0FBQztJQUM1QixXQUFLLEdBQUcsT0FBTyxDQUFDO0lBQ2hCLFVBQUksR0FBRyxNQUFNLENBQUM7SUFDZCxZQUFNLEdBQUcsUUFBUSxDQUFDO0lBQ2xCLGtCQUFZLEdBQUcsY0FBYyxDQUFDO0lBQzlCLDZCQUF1QixHQUFHLHlCQUF5QixDQUFDO0lBQ3BELHdCQUFrQixHQUFXLG9CQUFvQixDQUFDO0lBQ2xFLFlBQUM7Q0FYRCxBQVdDLElBQUE7QUFYWSxzQkFBSztBQWFsQjtJQUFBO0lBR0EsQ0FBQztJQURlLHNDQUF3QixHQUFHLENBQUMsQ0FBQztJQUM3QyxvQkFBQztDQUhELEFBR0MsSUFBQTtBQUhZLHNDQUFhIiwiZmlsZSI6ImFwcC9zaGFyZWQvY29uc3RhbnRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIEFwcFNldHRpbmdzIHtcclxuICAvLyBwdWJsaWMgc3RhdGljIElQID0gJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MCc7XHJcbiAgcHVibGljIHN0YXRpYyBJUCA9ICdodHRwOi8vNTIuNjYuMTIwLjIyODo4MDgwJzsgLy8gYnVpbGQgaW5mbyBzdGFnaW5nXHJcbiAgLy8gcHVibGljIHN0YXRpYyBIT1NUX05BTUUgPSAnbG9jYWxob3N0OjgwODAnO1xyXG4gIHB1YmxpYyBzdGF0aWMgSE9TVF9OQU1FID0gJzUyLjY2LjEyMC4yMjg6ODA4MCc7XHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgZ2V0IEFQSV9FTkRQT0lOVCgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuSVAgKyAnL2FwaS8nO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHN0YXRpYyBJTklUSUFMX1RIRU0gPSAnY29udGFpbmVyLWZsdWlkIGRhcmstdGhlbWUnO1xyXG4gIHB1YmxpYyBzdGF0aWMgTElHSFRfVEhFTSA9ICdjb250YWluZXItZmx1aWQgbGlnaHQtdGhlbWUnO1xyXG4gIHB1YmxpYyBzdGF0aWMgSVNfU09DSUFMX0xPR0lOX1lFUyA9ICdZRVMnO1xyXG4gIHB1YmxpYyBzdGF0aWMgSVNfU09DSUFMX0xPR0lOX05PID0gJ05PJztcclxuICBwdWJsaWMgc3RhdGljIEhUVFBfQ0xJRU5UID0gJ2h0dHA6Ly8nO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIE1lc3NhZ2VzIHtcclxuICBwdWJsaWMgc3RhdGljIEZST01fUkVHSVNUUkFUSU9OID0gJ3JlZ2lzdHJhdGlvbic7XHJcbiAgcHVibGljIHN0YXRpYyBGUk9NX0FDQ09VTlRfREVUQUlMID0gJ2FjY291bnRkZXRhaWwnO1xyXG5cclxuICAvL1JlZ2lzdHJhaW9uIFN1Y2Nlc3MgbWVzc2FnZXNcclxuICBwdWJsaWMgc3RhdGljIE1TR19TVUNDRVNTX0NIQU5HRV9NT0JJTEVfTlVNQkVSOiBzdHJpbmcgPSAnTW9iaWxlIG51bWJlciB1cGRhdGVkIHN1Y2Nlc3NmdWxseS4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX1NVQ0NFU1NfUkVTRU5EX1ZFUklGSUNBVElPTl9DT0RFOiBzdHJpbmcgPSAnTmV3IE9UUCAoT25lIFRpbWUgUGFzc3dvcmQpIGhhcyBiZWVuIHNlbnQgdG8geW91ciByZWdpc3RlcmVkIG1vYmlsZSBudW1iZXInO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX1NVQ0NFU1NfUkVTRU5EX1ZFUklGSUNBVElPTl9DT0RFX1JFU0VORF9PVFA6IHN0cmluZyA9ICdOZXcgT1RQIChPbmUgVGltZSBQYXNzd29yZCkgaGFzJyArXHJcbiAgICAnIGJlZW4gc2VudCB0byB5b3VyIG5ldyBtb2JpbGUgbnVtYmVyJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19TVUNDRVNTX01BSUxfVkVSSUZJQ0FUSU9OOiBzdHJpbmcgPSAnVmVyaWZpY2F0aW9uIGUtbWFpbCBzZW50IHN1Y2Nlc3NmdWxseSB0byB5b3VyIGUtbWFpbCBhY2NvdW50Lic7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfU1VDQ0VTU19SRVNFVF9QQVNTV09SRDogc3RyaW5nID0gJ1lvdXIgcGFzc3dvcmQgaXMgcmVzZXQgc3VjY2Vzc2Z1bGx5LktpbmRseSBsb2dpbic7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfU1VDQ0VTU19DSEFOR0VfRU1BSUw6IHN0cmluZyA9ICdBIHZlcmlmaWNhdGlvbiBlbWFpbCBpcyBzZW50IHRvIHlvdXIgbmV3IGVtYWlsIGlkLiAnICtcclxuICAgICdDdXJyZW50IGVtYWlsIGlkIHdpbGwgYmUgYWN0aXZlIHRpbGwgeW91IHZlcmlmeSBuZXcgZW1haWwgaWQuJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19TVUNDRVNTX0ZPUkdPVF9QQVNTV09SRDogc3RyaW5nID0gJ0VtYWlsIGZvciBwYXNzd29yZCByZXNldCBoYXMgYmVlbiBzZW50IHN1Y2Nlc3NmdWxseSBvbiB5b3VyIHJlZ2lzdGVyZWQgZW1haWwgaWQuJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19TVUNDRVNTX0RBU0hCT0FSRF9QUk9GSUxFOiBzdHJpbmcgPSAnWW91ciBwcm9maWxlIHVwZGF0ZWQgc3VjY2Vzc2Z1bGx5Lic7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfU1VDQ0VTU19DT05UQUNUOiBzdHJpbmcgPSAnRW1haWwgc2VudCBzdWNjZXNzZnVsbHkuJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19TVUNDRVNTX0NIQU5HRV9USEVNRTogc3RyaW5nID0gJ1RoZW1lIGNoYW5nZWQgc3VjY2Vzc2Z1bGx5Lic7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfU1VDQ0VTU19NQUlMX1ZFUklGSUNBVElPTl9SRVNVTFRfU1RBVFVTOiBzdHJpbmcgPSAnQ29uZ3JhdHVsYXRpb25zISc7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfQ0hBTkdFX1BBU1NXT1JEX1NVQ0NFU1NfSEVBREVSOiBzdHJpbmcgPSAnUGFzc3dvcmQgQ2hhbmdlZCBTdWNjZXNzZnVsbHknO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX1NVQ0NFU1NfTUFJTF9WRVJJRklDQVRJT05fQk9EWTogc3RyaW5nID0gJ1lvdXIgYWNjb3VudCB2ZXJpZmllZCBzdWNjZXNzZnVsbHkuJyArXHJcbiAgICAnWW91IG1heSBzdGFydCB1c2luZyBpdCBpbW1lZGlhdGVseSBieSBjbGlja2luZyBvbiBTaWduIEluISc7XHJcblxyXG4gIC8vUmVnaXN0cmF0aW9uIEZhaWx1cmUgbWVzc2FnZXNcclxuICBwdWJsaWMgc3RhdGljIE1TR19FUlJPUl9NQUlMX1ZFUklGSUNBVElPTl9CT0RZOiBzdHJpbmcgPSAnWW91ciBhY2NvdW50IHZlcmlmaWNhdGlvbiBmYWlsZWQgZHVlIHRvIGludmFsaWQgYWNjZXNzIHRva2VuISc7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfRVJST1JfTUFJTF9WRVJJRklDQVRJT05fUkVTVUxUX1NUQVRVUzogc3RyaW5nID0gJ1NvcnJ5Lic7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfRVJST1JfREFTSEJPQVJEX1BST0ZJTEVfUElDOiBzdHJpbmcgPSAnRmFpbGVkIHRvIGNoYW5nZSBwcm9maWxlIHBpY3R1cmUuJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19FUlJPUl9DSEFOR0VfVEhFTUU6IHN0cmluZyA9ICdGYWlsZWQgdG8gY2hhbmdlIHRoZW1lLic7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfRVJST1JfU0VSVkVSX0VSUk9SOiBzdHJpbmcgPSAnU2VydmVyIGVycm9yLic7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfRVJST1JfU09NRVRISU5HX1dST05HOiBzdHJpbmcgPSAnSW50ZXJuYWwgU2VydmVyIEVycm9yLic7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfRVJST1JfSU1BR0VfVFlQRTogc3RyaW5nID0gJ1BsZWFzZSB0cnkgYWdhaW4uIE1ha2Ugc3VyZSB0byB1cGxvYWQgb25seSBpbWFnZSBmaWxlIHdpdGggZXh0ZW5zaW9ucyBKUEcsIEpQRUcsIEdJRiwgUE5HLic7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfRVJST1JfSU1BR0VfU0laRTogc3RyaW5nID0gJ1BsZWFzZSBtYWtlIHN1cmUgdGhlIGltYWdlIHNpemUgaXMgbGVzcyB0aGFuIDUgTUIuJztcclxuXHJcbiAgLy9SZWdpc3RyYXRpb24gdmFsaWRhdGlvbiBtZXNzYWdlc1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0VSUk9SX1ZBTElEQVRJT05fRU1BSUxfUkVRVUlSRUQgPSAnRW50ZXIgeW91ciBlLW1haWwgYWRkcmVzcyc7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfRVJST1JfVkFMSURBVElPTl9XRUJTSVRFX1JFUVVJUkVEID0gJ0VudGVyIGNvbXBhbnkgd2Vic2l0ZS4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0VSUk9SX1ZBTElEQVRJT05fUEFTU1dPUkRfUkVRVUlSRUQgPSAnRW50ZXIgeW91ciBwYXNzd29yZCc7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfRVJST1JfVkFMSURBVElPTl9ORVdQQVNTV09SRF9SRVFVSVJFRCA9ICdFbnRlciBhIG5ldyBwYXNzd29yZCc7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfRVJST1JfVkFMSURBVElPTl9DT05GSVJNUEFTU1dPUkRfUkVRVUlSRUQgPSAnQ29uZmlybSB5b3VyIHBhc3N3b3JkJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19FUlJPUl9WQUxJREFUSU9OX0NVUlJFTlRQQVNTV09SRF9SRVFVSVJFRCA9ICdFbnRlciB5b3VyIGN1cnJlbnQgcGFzc3dvcmQnO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0VSUk9SX1ZBTElEQVRJT05fRklSU1ROQU1FX1JFUVVJUkVEID0gJ0VudGVyIHlvdXIgbmFtZSc7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfRVJST1JfVkFMSURBVElPTl9MQVNUTkFNRV9SRVFVSVJFRCA9ICdUaGlzIGZpZWxkIGNhblxcJ3QgYmUgbGVmdCBibGFuayc7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfRVJST1JfVkFMSURBVElPTl9NT0JJTEVfTlVNQkVSX1JFUVVJUkVEID0gJ1RoaXMgZmllbGQgY2FuXFwndCBiZSBsZWZ0IGJsYW5rJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19FUlJPUl9WQUxJREFUSU9OX1BJTl9SRVFVSVJFRCA9ICdFbnRlciB5b3VyIHBpbiBjb2RlLic7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfRVJST1JfVkFMSURBVElPTl9ERVNDUklQVElPTl9SRVFVSVJFRCA9ICdFbnRlciB0aGUgbmFtZSBvZiB0aGUgZG9jdW1lbnQgeW91IGFyZSB1cGxvYWRpbmcuJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19FUlJPUl9WQUxJREFUSU9OX0FCT1VUX0NPTVBBTllfUkVRVUlSRUQgPSAnR2l2ZSBhIGJyaWVmIGRlc2NyaXB0aW9uIGFib3V0IHlvdXIgY29tcGFueS4gJyArXHJcbiAgICAnVGhpcyB3aWxsIGJlIHNlZW4gYnkgY2FuZGlkYXRlcyBhcyBhIHBhcnQgb2YgdGhlIGpvYiBwcm9maWxlLic7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfRVJST1JfVkFMSURBVElPTl9DT01QQU5ZTkFNRV9SRVFVSVJFRCA9ICdUaGlzIGZpZWxkIGNhblxcJ3QgYmUgbGVmdCBibGFuay4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0VSUk9SX1ZBTElEQVRJT05fT1RQX1JFUVVJUkVEID0gJ0VudGVyIHJlY2VpdmVkIE9UUC4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0VSUk9SX1ZBTElEQVRJT05fSU5WQUxJRF9FTUFJTF9SRVFVSVJFRCA9ICdFbnRlciBhIHZhbGlkIGVtYWlsIGFkZHJlc3MnO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0VSUk9SX1ZBTElEQVRJT05fSU5WQUxJRF9VUkxfUkVRVUlSRUQgPSAnV2Vic2l0ZSBpcyBub3QgdmFsaWQuJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19FUlJPUl9WQUxJREFUSU9OX0lOVkFMSURfTkFNRSA9ICdFbnRlciB2YWxpZCBuYW1lLic7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfRVJST1JfVkFMSURBVElPTl9JTlZBTElEX0RBVEEgPSAnRW50ZXIgdmFsaWQgZGF0YS4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0VSUk9SX1ZBTElEQVRJT05fUEFTU1dPUkRfTUlTTUFUQ0hFRCA9ICdQYXNzd29yZHMgZG8gbm90IG1hdGNoJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19FUlJPUl9WQUxJREFUSU9OX0JJUlRIWUVBUl9SRVFVSVJFRCA9ICdUaGlzIGZpZWxkIGNhblxcJ3QgYmUgbGVmdCBibGFuay4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0VSUk9SX1ZBTElEQVRJT05fQklSVEhZRUFSX0lOVkFMSUQgPSAnRW50ZXIgdmFsaWQgYmlydGgteWVhcic7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfRVJST1JfVkFMSURBVElPTl9PVFBfTU9CSUxFX05VTUJFUiA9ICdQbGVhc2UgcHJvdmlkZSBhIHZhbGlkIG1vYmlsZSBudW1iZXIuJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19FUlJPUl9WQUxJREFUSU9OX1BBU1NXT1JEID0gJ1Bhc3N3b3JkIG11c3QgYmUgYWxwaGFudW1lcmljIGhhdmluZyBtaW5pbXVtIDYgY2hhcmFjdGVycyc7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfRVJST1JfVkFMSURBVElPTl9QSU5fTlVNQkVSID0gJ1BpbiBjb2RlIHNob3VsZCBub3QgYmUgZ3JlYXRlciB0aGFuIDIwIGNoYXJhY3RlcnMuJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19FUlJPUl9WQUxJREFUSU9OX0lURU1fTkFNRV9SRVFVSVJFRCA9ICdJdGVtIG5hbWUgc2hvdWxkIG5vdCBiZSBibGFuay4gXFxuRmlsbCBpdC4nO1xyXG5cclxuICAvL1Byb2plY3QgdmFsaWRhdGlvbiBtZXNzYWdlc1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0VSUk9SX1ZBTElEQVRJT05fUFJPSkVDVF9OQU1FX1JFUVVJUkVEID0gJ0VudGVyIHByb2plY3QgbmFtZSc7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfRVJST1JfVkFMSURBVElPTl9QUk9KRUNUX0FERFJFU1NfUkVRVUlSRUQgPSAnRW50ZXIgcHJvamVjdCBhZGRyZXNzJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19FUlJPUl9WQUxJREFUSU9OX1BMT1RfQVJFQV9SRVFVSVJFRCA9ICdFbnRlciBwbG90IGFyZWEnO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0VSUk9SX1ZBTElEQVRJT05fUFJPSkVDVF9EVVJBVElPTl9SRVFVSVJFRCA9ICdFbnRlciBwcm9qZWN0IGR1cmF0aW9uJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19FUlJPUl9WQUxJREFUSU9OX1BMT1RfUEVSSVBIRVJZX1JFUVVJUkVEID0gJ0VudGVyIHBsb3QgcGVyaXBoZXJ5IGxlbmd0aCc7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfRVJST1JfVkFMSURBVElPTl9QT0RJVU1fQVJFQV9SRVFVSVJFRCA9ICdFbnRlciBwb2RpdW0gYXJlYSc7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfRVJST1JfVkFMSURBVElPTl9PUEVOX1NQQUNFX1JFUVVJUkVEID0gJ0VudGVyIG9wZW4gc3BhY2UnO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0VSUk9SX1ZBTElEQVRJT05fU1dJTU1JTkdfUE9PTF9DQVBBQ0lUWV9SRVFVSVJFRCA9ICdFbnRlciBzd2ltbWluZyBwb29sIGNhcGFjaXR5JztcclxuICBwdWJsaWMgc3RhdGljIE1TR19FUlJPUl9WQUxJREFUSU9OX05VTV9PRl9CVUlMRElOR1NfUkVRVUlSRUQgPSAnRW50ZXIgdG90YWwgbm8uIG9mIGJ1aWxkaW5ncyc7XHJcblxyXG4gIC8vQnVpbGRpbmcgdmFsaWRhdGlvbiBtZXNzYWdlc1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0VSUk9SX1ZBTElEQVRJT05fQlVJTERJTkdfTkFNRV9SRVFVSVJFRCA9ICdFbnRlciBidWlsZGluZyBuYW1lJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19FUlJPUl9WQUxJREFUSU9OX1NMQUJfQVJFQV9SRVFVSVJFRCA9ICdFbnRlciBzbGFiIGFyZWEnO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0VSUk9SX1ZBTElEQVRJT05fQ0FSUEVUX0FSRUFfUkVRVUlSRUQgPSAnRW50ZXIgY2FycGV0IGFyZWEnO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0VSUk9SX1ZBTElEQVRJT05fUEFSS0lOR19BUkVBX1JFUVVJUkVEICA9ICdFbnRlciBwYXJraW5nIGFyZWEnO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0VSUk9SX1ZBTElEQVRJT05fU0FMRUJMRV9BUkVBX1JFUVVJUkVEICA9ICdFbnRlciBzYWxlYWJsZSBhcmVhJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19FUlJPUl9WQUxJREFUSU9OX1BMSU5USF9BUkVBX1JFUVVJUkVEICA9ICdFbnRlciBwbGludGggYXJlYSc7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfRVJST1JfVkFMSURBVElPTl9OT19PRl9GTE9PUlNfUkVRVUlSRUQgID0gJ0VudGVyIG5vLiBvZiBmbG9vcnMnO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0VSUk9SX1ZBTElEQVRJT05fTk9fT0ZfUEFSS0lOR19GTE9PUlNfUkVRVUlSRUQgID0gJ0VudGVyIG5vLiBvZiBwYXJraW5nIGZsb29ycyc7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfRVJST1JfVkFMSURBVElPTl9DQVJQRVRfQVJFQV9PRl9QQVJLSU5HX1JFUVVJUkVEICA9ICdFbnRlciBjYXJwZXQgYXJlYSBvZiBwYXJraW5nIGZsb29ycyc7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfRVJST1JfVkFMSURBVElPTl9PTkVfQkhLX1JFUVVJUkVEID0gJ0VudGVyIG5vLiBvZiBvbmUgQkhLcyc7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfRVJST1JfVkFMSURBVElPTl9UV09fQkhLX1JFUVVJUkVEID0gJ0VudGVyIG5vLiBvZiB0d28gQkhLcyc7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfRVJST1JfVkFMSURBVElPTl9USFJFRV9CSEtfUkVRVUlSRUQgPSAnRW50ZXIgbm8uIG9mIHRocmVlIEJIS3MnO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0VSUk9SX1ZBTElEQVRJT05fTk9fT0ZfU0xBQlNfUkVRVUlSRUQgPSAnRW50ZXIgbm8uIG9mIHNsYWJzJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19FUlJPUl9WQUxJREFUSU9OX05PX09GX0xJRlRTX1JFUVVJUkVEID0gJ0VudGVyIG5vLiBvZiBsaWZ0cyc7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfRVJST1JfVkFMSURBVElPTl9BTFBIQUJBVEVTID0gJ0VudGVyIGFscGhhYmF0ZXMgb25seSc7XHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0VSUk9SX1ZBTElEQVRJT05fQUREX0FUX0xFQVNUX09ORV9BUEFSVE1FTlRfQ09ORklHVVJBVElPTiA9ICdBZGQgYXQgbGVhc3Qgb25lIEFwYXJ0bWVudCBDb25maWd1cmF0aW9uJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19FUlJPUl9WQUxJREFUSU9OX05VTUJFUl9PRl9GTE9PUlMgPSAnVG90YWwgbnVtYmVyIG9mIGZsb29ycyBzaG91bGQgYmUgbW9yZSB0aGFuIG51bWJlciBvZiBwYXJraW5nIGZsb29ycyc7XHJcblxyXG5cclxuICBwdWJsaWMgc3RhdGljIE1TR19SRVNFVF9NT0JJTEVfTlVNQkVSID0gJ0VudGVyIHlvdXIgbmV3IG1vYmlsZSBudW1iZXIgYW5kIHdlIHdpbGwgc2VuZCB5b3UgYSB2ZXJpZmljYXRpb24gY29kZSBvbiBtb2JpbGUnICtcclxuICAgICcgbnVtYmVyIHlvdSBoYXZlIGVudGVyZWQuJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19SRVNFVF9FTUFJTF9BRERSRVNTID0gJ0VudGVyIHlvdXIgbmV3IGFjY291bnQgZW1haWwgYWRkcmVzcyBhbmQgd2Ugd2lsbCBzZW5kIHlvdSBhIGxpbmsgdG8gcmVzZXQgeW91ciBlbWFpbCcgK1xyXG4gICAgJ2FkZHJlc3MuJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19FTUFJTF9BQ1RJVkFUSU9OID0gJ1lvdXIgZW1haWwgaGFzIGJlZW4gYWN0aXZhdGVkLiBZb3UgbWF5IHN0YXJ0IHVzaW5nIHlvdXIgYWNjb3VudCB3aXRoIG5ldyBlbWFpbCBhZGRyZXNzJyArXHJcbiAgICAnaW1tZWRpYXRlbHkuJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19DT05UQUNUX1VTID0gJ1BsZWFzZSBwcm92aWRlIHRoZSBmb2xsb3dpbmcgZGV0YWlscyBhbmQgd2Ugd2lsbCBnZXQgYmFjayB0byB5b3Ugc29vbi4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX1lFQVJfTk9fTUFUQ0hfRk9VTkQgPSAnVGhlIHllYXIgZG9lc25cXCd0IGxvb2sgcmlnaHQuIEJlIHN1cmUgdG8gdXNlIHlvdXIgYWN0dWFsIHllYXIgb2YgYmlydGguJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19GT1JHT1RfUEFTU1dPUkQgPSAnRW50ZXIgeW91ciBlLW1haWwgYWRkcmVzcyBiZWxvdyBhbmQgd2VcXCdsbCBnZXQgeW91IGJhY2sgb24gdHJhY2suJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19DT05GSVJNX1BBU1NXT1JEID0gJ1Bhc3N3b3JkcyBhcmUgbm90IG1hdGNoaW5nLic7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfQ0hBTkdFX1BBU1NXT1JEX1NVQ0NFU1MgPSdQYXNzd29yZCBjaGFuZ2VkIHN1Y2Nlc3NmdWxseS4gJyArXHJcbiAgICAnWW91IGNhbiBTaWduIEluIGFnYWluIHdpdGggbmV3IHBhc3N3b3JkIGJ5IGNsaWNraW5nIG9uIFwiWUVTXCIgYnV0dG9uLCBQbGVhc2UgY2xpY2sgb24gXCJOb1wiIGJ1dHRvbiB0byBjb250aW51ZSB0aGUgc2Vzc2lvbi4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX1ZFUklGWV9VU0VSXzEgPSAnWW91IGFyZSBhbG1vc3QgZG9uZSEnO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX1ZFUklGWV9VU0VSXzIgPSAnV2UgbmVlZCB0byB2ZXJpZnkgeW91ciBtb2JpbGUgbnVtYmVyIGJlZm9yZSB5b3UgY2FuIHN0YXJ0IHVzaW5nIHRoZSBzeXN0ZW0uJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19WRVJJRllfVVNFUl8zID0gJ09uZSBUaW1lIFBhc3N3b3JkKE9UUCkgd2lsbCBiZSBzZW50IG9uIGZvbGxvd2luZyBtb2JpbGUgbnVtYmVyLic7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfVkVSSUZZX1VTRVJfNCA9ICdZb3UgYXJlIGFsbW9zdCBkb25lISBXZSBuZWVkIHRvIHZlcmlmeSB5b3VyIGVtYWlsIGlkIGJlZm9yZSB5b3UgY2FuIHN0YXJ0IHVzaW5nIHRoZSBzeXN0ZW0uJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19FTUFJTF9OT1RfTUFUQ0ggPSAnRS1tYWlsIGRvZXMgbm90IG1hdGNoLic7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfQ0hBTkdFX1BBU1NXT1JEID0gJ1lvdXIgcGFzc3dvcmQgcHJvdGVjdHMgeW91ciBhY2NvdW50IHNvIHBhc3N3b3JkIG11c3QgYmUgc3Ryb25nLicgK1xyXG4gICAgJ0NoYW5naW5nIHlvdXIgcGFzc3dvcmQgd2lsbCBzaWduIHlvdSBvdXQgb2YgYWxsIHlvdXIgZGV2aWNlcywgaW5jbHVkaW5nIHlvdXIgcGhvbmUuJyArXHJcbiAgICAnWW91IHdpbGwgbmVlZCB0byBlbnRlciB5b3VyIG5ldyBwYXNzd29yZCBvbiBhbGwgeW91ciBkZXZpY2VzLic7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfTU9CSUxFX05VTUJFUl9OT1RfTUFUQ0ggPSAnTW9iaWxlIE51bWJlciBkb2VzIG5vdCBtYXRjaC4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX01PQklMRV9OVU1CRVJfQ2hhbmdlX1NVQ0NFU1MgPSAnTW9iaWxlIG51bWJlciBjaGFuZ2VkIHN1Y2Nlc3NmdWxseS5Zb3UgY2FuIFNpZ24gSW4gYWdhaW4gYnkgY2xpY2tpbmcgb24gXCJ5ZXNcIiBidXR0b24sJyArXHJcbiAgICAnIHBsZWFzZSBjbGljayBvbiBcIk5vXCIgYnV0dG9uIHRvIGNvbnRpbnVlIHRoZSBzZXNzaW9uLic7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfTU9CSUxFX1ZFUklGSUNBVElPTl9USVRMRSA9ICdWZXJpZnkgWW91ciBNb2JpbGUgTnVtYmVyJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19NT0JJTEVfTlVNQkVSX0NIQU5HRV9WRVJJRklDQVRJT05fVElUTEUgPSAnVmVyaWZ5IFlvdXIgIE5ldyBNb2JpbGUgTnVtYmVyJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19NT0JJTEVfVkVSSUZJQ0FUSU9OX01FU1NBR0UgPSAnUGxlYXNlIGVudGVyIHRoZSB2ZXJpZmljYXRpb24gY29kZSBzZW50IHRvIHlvdXIgbW9iaWxlIG51bWJlci4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX01PQklMRV9OVU1CRVJfQ0hBTkdFX1ZFUklGSUNBVElPTl9NRVNTQUdFID0gJ1BsZWFzZSBlbnRlciB0aGUgdmVyaWZpY2F0aW9uIGNvZGUgc2VudCB0byB5b3VyIG5ldyBtb2JpbGUgbnVtYmVyLic7XHJcbiAgcHVibGljIHN0YXRpYyBDT05UQUNUX1VTX0FERFJFU1MgPSAnQmxvZy4gTm8uIDE0LCAxc3QgRmxvb3IsIEVsZWN0cm9uaWMgRXN0YXRlLCBQYXJ2YXRpLCBQdW5lLVNhdGFyYSBSb2FkLCBQdW5lIDQxMTAwOSwgTUgsIElORElBLic7XHJcbiAgcHVibGljIHN0YXRpYyBDT05UQUNUX1VTX0NPTlRBQ1RfTlVNQkVSXzEgPSAnKzkxICgyMCkgMjQyMSA4ODY1JztcclxuICBwdWJsaWMgc3RhdGljIENPTlRBQ1RfVVNfQ09OVEFDVF9OVU1CRVJfMiA9ICcrOTEgOTgyMzMgMTg4NjUnO1xyXG4gIHB1YmxpYyBzdGF0aWMgQ09OVEFDVF9VU19FTUFJTF8xID0gJ3NhbGVzQHRlY2hwcmltZWxhYi5jb20nO1xyXG4gIHB1YmxpYyBzdGF0aWMgQ09OVEFDVF9VU19FTUFJTF8yID0gJ2NhcmVlcnNAdGVjaHByaW1lbGFiLmNvbSc7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfRU1BSUxfVkVSSUZJQ0FUSU9OX0hFQURJTkcgPSAnWW91ciBlbWFpbCBpcyB1cGRhdGVkIHN1Y2Nlc3NmdWxseS4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0VNQUlMX1ZFUklGSUNBVElPTl9NRVNTQUdFID0gJ0tpbmRseSBjbGljayBvbiBTSUdOIElOIHRvIHVzZSBCdWlsZEluZm8uJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19BQ1RJVkFURV9VU0VSX0hFQURJTkcgPSAnQ29uZ3JhdHVsYXRpb25zISBXZWxjb21lIFRvIEJ1aWxkSW5mby4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0FDVElWQVRFX1VTRVJfU1VCX0hFQURJTkcgPSAnWW91IGNhbiBub3cgZmluZCBjYW5kaWRhdGVzIHVzaW5nIHRoZSBoaWdobHkgYWNjdXJhdGUsJyArXHJcbiAgICAnIHNpbXBsZXIsIGZhc3RlciBhbmQgcG93ZXJmdWwgc29sdXRpb24uJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19BQ1RJVkFURV9VU0VSX01FU1NBR0UgPSAnWW91ciBhY2NvdW50IGhhcyBiZWVuIGNyZWF0ZWQgc3VjY2Vzc2Z1bGx5LiBLaW5kbHkgY2xpY2sgU2lnbiBJbi4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0FCT1VUX1VTX0RJU0NSSVBUSU9OID0gJ0xvcmVtIElwc3VtIGlzIHNpbXBseSBkdW1teSB0ZXh0IG9mIHRoZSBwcmludGluZyBhbmQgdHlwZXNldHRpbmcgaW5kdXN0cnkuJyArXHJcbiAgICAnTG9yZW0gSXBzdW0gaGFzIGJlZW4gdGhlIGluZHVzdHJ5XFwncyBzdGFuZGFyZCBkdW1teSB0ZXh0IGV2ZXIgc2luY2UgdGhlIDE1MDBzJyArXHJcbiAgICAnd2hlbiBhbiB1bmtub3duIHByaW50ZXIgdG9vayBhIGdhbGxleSBvZiB0eXBlIGFuZCBzY3JhbWJsZWQgaXQgdG8gbWFrZSBhIHR5cGUgc3BlY2ltZW4gYm9vay4nICtcclxuICAgICdJdCBoYXMgc3Vydml2ZWQgbm90IG9ubHkgZml2ZSBjZW50dXJpZXMsIGJ1dCBhbHNvIHRoZSBsZWFwIGludG8gZWxlY3Ryb25pYyB0eXBlc2V0dGluZyxyZW1haW5pbmcgZXNzZW50aWFsbHkgJyArXHJcbiAgICAndW5jaGFuZ2VkLiAnICtcclxuICAgICdJdCB3YXMgcG9wdWxhcmlzZWQgaW4gdGhlIDE5NjBzIHdpdGggdGhlIHJlbGVhc2Ugb2YgTGV0cmFzZXQgc2hlZXRzIGNvbnRhaW5pbmcgTG9yZW0gSXBzdW0gcGFzc2FnZXMsJyArXHJcbiAgICAnYW5kIG1vcmUgcmVjZW50bHkgd2l0aCBkZXNrdG9wIHB1Ymxpc2hpbmcgc29mdHdhcmUgbGlrZSBBbGR1cyBQYWdlTWFrZXIgaW5jbHVkaW5nIHZlcnNpb25zIG9mIExvcmVtIElwc3VtLic7XHJcbiAgcHVibGljIHN0YXRpYyBHVUlERV9NRVNTQUdFX0ZPUl9ORVdfVklFV0VSID0gJ1RoYW5rIHlvdSBmb3Igc2hvd2luZyBpbnRlcmVzdCwgJyArXHJcbiAgICAnd2Ugd2lsbCBuZWVkIHlvdXIgYmFzaWMgaW5mb3JtYXRpb24gdG8gY3JlYXRlIHlvdXIgdmFsdWUgcG9ydHJhaXQgb24gQnVpbGRJbmZvLiBHbyBhaGVhZCwgJyArXHJcbiAgICAnZmlsbCB0aGUgZm9ybSBhbmQgZ2V0IHlvdXIgdmFsdWUgcG9ydHJhaXQhJztcclxuICBwdWJsaWMgc3RhdGljIE5PVF9GT1VORF9JTkZPUk1BVElPTiA9ICdUaGUgcGFnZSB5b3UgYXJlIGxvb2tpbmcgZm9yIGRvZXNuXFwndCBleGlzdDxici8+JyArXHJcbiAgICAnb3IgYW4gb3RoZXIgZXJyb3Igb2NvdXJyZWQuJztcclxuXHJcbiAgLy9BcHBsaWNhdGlvbiBTdWNjZXNzIE1lc3NhZ2VzXHJcbiAgcHVibGljIHN0YXRpYyBNU0dfU1VDQ0VTU19QUk9KRUNUX0NSRUFUSU9OOiBzdHJpbmcgPSAnUHJvamVjdCBoYXMgYmVlbiBjcmVhdGVkIHN1Y2Nlc3NmdWxseS4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX1NVQ0NFU1NfQUREX0JVSUxESU5HX1BST0pFQ1Q6IHN0cmluZyA9ICdCdWlsZGluZyBoYXMgYmVlbiBzdWNjZXNzZnVsbHkgYWRkZWQgdG8gcHJvamVjdC5cXG4nICtcclxuICAgICdQbGVhc2Ugd2FpdCB3aGlsZSB3ZSBhcmUgc3luY2hpbmcgZGF0YSBmcm9tIHJhdGUgYW5hbHlzaXMuJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19TVUNDRVNTX0NMT05FRF9CVUlMRElOR19ERVRBSUxTOiBzdHJpbmcgPSAnWW91ciBidWlsZGluZyBjbG9uZWQgc3VjY2Vzc2Z1bGx5Lic7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfU1VDQ0VTU19VUERBVEVfUFJPSkVDVF9ERVRBSUxTOiBzdHJpbmcgPSAnWW91ciBwcm9qZWN0IHVwZGF0ZWQgc3VjY2Vzc2Z1bGx5Lic7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfU1VDQ0VTU19VUERBVEVfQlVJTERJTkdfREVUQUlMUzogc3RyaW5nID0gJ1lvdXIgYnVpbGRpbmcgZGV0YWlscyB1cGRhdGVkIHN1Y2Nlc3NmdWxseS4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX1NVQ0NFU1NfREVMRVRFX0JVSUxESU5HOiBzdHJpbmcgPSAnQnVpbGRpbmcgZGVsZXRlZCBzdWNjZXNzZnVsbHkuJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19TVUNDRVNTX0FERF9DT1NUSEVBRDogc3RyaW5nID0gJ0Nvc3RoZWFkIGFkZGVkIHN1Y2Nlc3NmdWxseS4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX1NVQ0NFU1NfREVMRVRFX0NPU1RIRUFEOiBzdHJpbmcgPSAnQ29zdGhlYWQgZGVsZXRlZCBzdWNjZXNzZnVsbHkuJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19TVUNDRVNTX0RFTEVURV9JVEVNOiBzdHJpbmcgPSAnWW91ciBpdGVtIGRlbGV0ZWQgc3VjY2Vzc2Z1bGx5Lic7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfU1VDQ0VTU19VUERBVEVfUkFURTogc3RyaW5nID0gJ1JhdGUgdXBkYXRlZC4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX1FVQU5USVRZX1NIT1VMRF9OT1RfWkVST19PUl9OVUxMOiBzdHJpbmcgPSAnUXVhbnRpdHkgc2hvdWxkIG5vdCB6ZXJvIG9yIG51bGwuJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19TVUNDRVNTX1NBVkVEX0NPU1RfSEVBRF9JVEVNOiBzdHJpbmcgPSAnWW91ciBjb3N0IGhlYWQgaXRlbXMgdXBkYXRlZCBzdWNjZXNzZnVsbHkuJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19TVUNDRVNTX1NBVkVEX0NPU1RfSEVBRF9JVEVNX0VSUk9SOiBzdHJpbmcgPSAnVGhlcmUgaXMgZXJyb3IgaW4gb3BlcmF0aW9uJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19TVUNDRVNTX0FERF9DQVRFR09SWTogc3RyaW5nID0gJ0NhdGVnb3J5IGFkZGVkIHN1Y2Nlc3NmdWxseS4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX1NVQ0NFU1NfREVMRVRFX0NBVEVHT1JZOiBzdHJpbmcgPSAnQ2F0ZWdvcnkgZGVsZXRlZCBzdWNjZXNzZnVsbHkuJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19TVUNDRVNTX0RFTEVURV9RVUFOVElUWV9JVEVNOiBzdHJpbmcgPSAnUXVhbnRpdHkgaXRlbSBkZWxldGVkIHN1Y2Nlc3NmdWxseS4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX1NVQ0NFU1NfREVMRVRFX1FVQU5USVRZX0RFVEFJTFM6IHN0cmluZyA9ICdRdWFudGl0eSBEZXRhaWxzIGRlbGV0ZWQgc3VjY2Vzc2Z1bGx5Lic7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfQUxSRUFEWV9BRERFRF9BTExfQ0FURUdPUklFUzogc3RyaW5nID0gJ0FscmVhZHkgYWRkZWQgYWxsIENhdGVnb3JpZXMuJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19TVUNDRVNTX0FERF9XT1JLSVRFTTogc3RyaW5nID0gJ1dvcmtpdGVtIGFkZGVkIHN1Y2Nlc3NmdWxseS4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0FMUkVBRFlfQURERURfQUxMX1dPUktJVEVNUzogc3RyaW5nID0gJ0FscmVhZHkgYWRkZWQgYWxsIHdvcmtpdGVtcy4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX1NVQ0NFU1NfREVMRVRFX1dPUktJVEVNOiBzdHJpbmcgPSAnWW91ciB3b3JraXRlbSBkZWxldGVkIHN1Y2Nlc3NmdWxseS4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX1NVQ0NFU1NfVVBEQVRFX1RIVU1CUlVMRV9SQVRFX0NPU1RIRUFEOiBzdHJpbmcgPSAnVGh1bWJydWxlIHJhdGUgZm9yIENvc3RIZWFkIHVwZGF0ZWQgc3VjY2Vzc2Z1bGx5Lic7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfU1VDQ0VTU19VUERBVEVfRElSRUNUX1FVQU5USVRZX09GX1dPUktJVEVNIDogc3RyaW5nID0gJ0RpcmVjdCByYXRlIGZvciB3b3JraXRlbSB1cGRhdGVkIHN1Y2Nlc3NmdWxseS4nO1xyXG5cclxuICAvL1F1YW50aXR5IHZpZXcgcmVxdWlyZWQgZmllbGRzXHJcbiAgcHVibGljIHN0YXRpYyBNU0dfRVJST1JfVkFMSURBVElPTl9RVUFOVElUWV9JVEVNX1JFUVVJUkVEID0gJ0VudGVyIGl0ZW0nO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0VSUk9SX1ZBTElEQVRJT05fUVVBTlRJVFlfTlVNQkVSU19SRVFVSVJFRCA9ICdFbnRlciBudW1iZXJzJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19FUlJPUl9WQUxJREFUSU9OX1FVQU5USVRZX0xFTkdUSF9SRVFVSVJFRCA9ICdFbnRlciBsZW5ndGgnO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0VSUk9SX1ZBTElEQVRJT05fUVVBTlRJVFlfQlJFQURUSF9SRVFVSVJFRCA9ICdFbnRlciBicmVhZHRoJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19FUlJPUl9WQUxJREFUSU9OX1FVQU5USVRZX0hFSUdIVF9SRVFVSVJFRCA9ICdFbnRlciBoZWlnaHQnO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0VSUk9SX1ZBTElEQVRJT05fUVVBTlRJVFlfUVVBTlRJVFlfUkVRVUlSRUQgPSAnRW50ZXIgcXVhbnRpdHknO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0VSUk9SX1ZBTElEQVRJT05fUVVBTlRJVFlfVU5JVF9SRVFVSVJFRCA9ICdFbnRlciB1bml0JztcclxuICBwdWJsaWMgc3RhdGljIE1TR19FUlJPUl9WQUxJREFUSU9OX1FVQU5USVRZX1JFUVVJUkVEID0gJ0ZpZWxkcyBjYW4gbm90IGJlIGVtcHR5JztcclxuICBwdWJsaWMgc3RhdGljIE1TR19FUlJPUl9WQUxJREFUSU9OX1FVQU5USVRZX05BTUVfUkVRVUlSRUQgPSAnUXVhbnRpdHkgZGV0YWlscyBuYW1lIGlzIHJlcXVpcmVkJztcclxuICBwdWJsaWMgc3RhdGljIExPR0lOX0lORk86IHN0cmluZyA9ICdFbnRlciB5b3VyIGRldGFpbHMgYmVsb3cnO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTmF2aWdhdGlvblJvdXRlcyB7XHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgQVBQX1JFR0lTVFJBVElPTjogc3RyaW5nID0gJy9yZWdpc3RyYXRpb24nO1xyXG4gIHB1YmxpYyBzdGF0aWMgQVBQX0ZPUkdPVFBBU1NXT1JEOiBzdHJpbmcgPSAnL2ZvcmdvdC1wYXNzd29yZCc7XHJcbiAgcHVibGljIHN0YXRpYyBBUFBfUFJPSkVDVDogc3RyaW5nID0gJy9wcm9qZWN0JztcclxuICBwdWJsaWMgc3RhdGljIEFQUF9CVUlMRElORzogc3RyaW5nID0gJ2J1aWxkaW5nJztcclxuICBwdWJsaWMgc3RhdGljIEFQUF9DUkVBVEVfTkVXX1BST0pFQ1Q6IHN0cmluZyA9ICcvY3JlYXRlLW5ldy1wcm9qZWN0JztcclxuICBwdWJsaWMgc3RhdGljIEFQUF9DUkVBVEVfUFJPSkVDVDogc3RyaW5nID0gJy9jcmVhdGUtcHJvamVjdCc7XHJcbiAgcHVibGljIHN0YXRpYyBBUFBfVklFV19CVUlMRElOR19ERVRBSUxTOiBzdHJpbmcgPSAnYnVpbGRpbmcvZGV0YWlscyc7XHJcbiAgcHVibGljIHN0YXRpYyBBUFBfQ1JFQVRFX0JVSUxESU5HOiBzdHJpbmcgPSAnL2NyZWF0ZS1idWlsZGluZyc7XHJcbiAgcHVibGljIHN0YXRpYyBBUFBfTElTVF9QUk9KRUNUOiBzdHJpbmcgPSAncHJvamVjdC9saXN0JztcclxuICBwdWJsaWMgc3RhdGljIEFQUF9DT1NUX1NVTU1BUlk6IHN0cmluZyA9ICdjb3N0LXN1bW1hcnknO1xyXG4gIHB1YmxpYyBzdGF0aWMgQVBQX0NPU1RfSEVBRDogc3RyaW5nID0gJ2Nvc3QtaGVhZCc7XHJcbiAgcHVibGljIHN0YXRpYyBBUFBfQ0FURUdPUlk6IHN0cmluZyA9ICdjYXRlZ29yeSc7XHJcbiAgcHVibGljIHN0YXRpYyBBUFBfQ09NTU9OX0FNRU5JVElFUyA9ICdjb21tb24tYW1lbml0aWVzJztcclxuICBwdWJsaWMgc3RhdGljIEFQUF9EQVNIQk9BUkQ6IHN0cmluZyA9ICcvZGFzaGJvYXJkJztcclxuICBwdWJsaWMgc3RhdGljIEFQUF9MT0dJTjogc3RyaW5nID0gJy9zaWduaW4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgQVBQX1NUQVJUOiBzdHJpbmcgPSAnLyc7XHJcbiAgcHVibGljIHN0YXRpYyBWRVJJRllfUEhPTkU6IHN0cmluZyA9ICcvdmVyaWZ5LXBob25lJztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFNlc3Npb25TdG9yYWdlIHtcclxuXHJcbiAgcHVibGljIHN0YXRpYyBBQ0NFU1NfVE9LRU4gPSAnYWNjZXNzX3Rva2VuJztcclxuICBwdWJsaWMgc3RhdGljIElTX1NPQ0lBTF9MT0dJTiA9ICdpc19zb2NpYWxfbG9naW4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgUFJPRklMRV9QSUNUVVJFID0gJ3Byb2ZpbGVfcGljdHVyZSc7XHJcbiAgcHVibGljIHN0YXRpYyBJU19MT0dHRURfSU4gPSAnaXNfdXNlcl9sb2dnZWRfaW4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgSVNfVVNFUl9TSUdOX0lOID0gJ2lzX3VzZXJfcmVnaXN0ZXInO1xyXG4gIHB1YmxpYyBzdGF0aWMgQ1VSUkVOVF9WSUVXID0gJ2N1cnJlbnRfdmlldyc7XHJcbiAgcHVibGljIHN0YXRpYyBVU0VSX0lEID0gJ3VzZXJfaWQnO1xyXG4gIHB1YmxpYyBzdGF0aWMgTU9CSUxFX05VTUJFUiA9ICdtb2JpbGVfbnVtYmVyJztcclxuICBwdWJsaWMgc3RhdGljIFZFUklGSUVEX01PQklMRV9OVU1CRVIgPSAndmVyaWZpZWRfbW9iaWxlX251bWJlcic7XHJcbiAgcHVibGljIHN0YXRpYyBGSVJTVF9OQU1FID0gJ2ZpcnN0X25hbWUnO1xyXG4gIHB1YmxpYyBzdGF0aWMgTEFTVF9OQU1FID0gJ2xhc3RfbmFtZSc7XHJcbiAgcHVibGljIHN0YXRpYyBFTUFJTF9JRCA9ICdlbWFpbF9pZCc7XHJcbiAgcHVibGljIHN0YXRpYyBQQVNTV09SRCA9ICdwYXNzd29yZCc7XHJcbiAgcHVibGljIHN0YXRpYyBNWV9USEVNRSA9ICdteV90aGVtZSc7XHJcbiAgcHVibGljIHN0YXRpYyBWRVJJRllfUEhPTkVfVkFMVUUgPSAndmVyaWZ5X3Bob25lX3ZhbHVlJztcclxuICBwdWJsaWMgc3RhdGljIENIQU5HRV9NQUlMX1ZBTFVFID0gJ2NoYW5nZV9tYWlsX3ZhbHVlJztcclxuICBwdWJsaWMgc3RhdGljIENVUlJFTlRfUFJPSkVDVF9JRCA9ICdjdXJyZW50X3Byb2plY3RfaWQnO1xyXG4gIHB1YmxpYyBzdGF0aWMgQ1VSUkVOVF9QUk9KRUNUX05BTUUgPSAnY3VycmVudF9wcm9qZWN0X25hbWUnO1xyXG4gIHB1YmxpYyBzdGF0aWMgQ1VSUkVOVF9CVUlMRElORyA9ICdjdXJyZW50X2J1aWxkaW5nX2lkJztcclxuICBwdWJsaWMgc3RhdGljIENVUlJFTlRfQ09TVF9IRUFEX0lEID0gJ2N1cnJlbnRfY29zdF9oZWFkX2lkJztcclxuICBwdWJsaWMgc3RhdGljIENVUlJFTlRfV09SS0lURU1fSUQgPSAnY3VycmVudF93b3JraXRlbV9pZCc7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBMb2NhbFN0b3JhZ2Uge1xyXG4gIHB1YmxpYyBzdGF0aWMgQUNDRVNTX1RPS0VOID0gJ2FjY2Vzc190b2tlbic7XHJcbiAgcHVibGljIHN0YXRpYyBJU19MT0dHRURfSU4gPSAnaXNfdXNlcl9sb2dnZWRfaW4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgRklSU1RfTkFNRSA9ICdmaXJzdF9uYW1lJztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEFQSSB7XHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgTk9USUZJQ0FUSU9OID0gJ25vdGlmaWNhdGlvbic7XHJcbiAgcHVibGljIHN0YXRpYyBTRU5EX05PVElGSUNBVElPTl9UT19SRUNSVUlURVIgPSAnbm90aWZ5X3JlY3J1aXRlcic7XHJcbiAgcHVibGljIHN0YXRpYyBTRU5EX01BSUwgPSAnc2VuZG1haWwnO1xyXG4gIHB1YmxpYyBzdGF0aWMgU0VORF9UT19BRE1JTl9NQUlMID0gJ3NlbmRtYWlsdG9hZG1pbic7XHJcbiAgcHVibGljIHN0YXRpYyBVU0VSX1BST0ZJTEUgPSAndXNlcic7XHJcbiAgcHVibGljIHN0YXRpYyBDQU5ESURBVEVfUFJPRklMRSA9ICd1c2VyJztcclxuICBwdWJsaWMgc3RhdGljIFVTRVJfREFUQSA9ICd1c2VyRGF0YSc7XHJcbiAgcHVibGljIHN0YXRpYyBMT0dJTiA9ICd1c2VyL2xvZ2luJztcclxuICBwdWJsaWMgc3RhdGljIEZCX0xPR0lOID0gJ2ZiTG9naW4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgQ0hBTkdFX1BBU1NXT1JEID0gJ3VzZXIvY2hhbmdlL3Bhc3N3b3JkJztcclxuICBwdWJsaWMgc3RhdGljIENIQU5HRV9NT0JJTEUgPSAndXNlci9jaGFuZ2UvbW9iaWxlTnVtYmVyJztcclxuICBwdWJsaWMgc3RhdGljIENIQU5HRV9FTUFJTCA9ICd1c2VyL2NoYW5nZS9lbWFpbElkJztcclxuICBwdWJsaWMgc3RhdGljIENIQU5HRV9DT01QQU5ZX0FDQ09VTlRfREVUQUlMUyA9ICdjaGFuZ2VyZWNydWl0ZXJhY2NvdW50ZGV0YWlscyc7XHJcbiAgcHVibGljIHN0YXRpYyBWRVJJRllfQ0hBTkdFRF9FTUFJTCA9ICd1c2VyL3ZlcmlmeS9jaGFuZ2VkRW1haWxJZCc7XHJcbiAgcHVibGljIHN0YXRpYyBWRVJJRllfRU1BSUwgPSAndXNlci92ZXJpZnlFbWFpbCc7XHJcbiAgcHVibGljIHN0YXRpYyBHRU5FUkFURV9PVFAgPSAndXNlci9nZW5lcmF0ZW90cCc7XHJcbiAgcHVibGljIHN0YXRpYyBWRVJJRllfT1RQID0gJ3VzZXIvdmVyaWZ5L290cCc7XHJcbiAgcHVibGljIHN0YXRpYyBWRVJJRllfTU9CSUxFID0gJ3VzZXIvdmVyaWZ5L21vYmlsZU51bWJlcic7XHJcbiAgcHVibGljIHN0YXRpYyBTRU5EX1ZFUklGSUNBVElPTl9NQUlMID0gJ3NlbmR2ZXJpZmljYXRpb25tYWlsJztcclxuICBwdWJsaWMgc3RhdGljIEZPUkdPVF9QQVNTV09SRCA9ICd1c2VyL2ZvcmdvdHBhc3N3b3JkJztcclxuICBwdWJsaWMgc3RhdGljIFVQREFURV9QSUNUVVJFID0gJ3VzZXIvdXBkYXRlcGljdHVyZSc7XHJcbiAgcHVibGljIHN0YXRpYyBDSEFOR0VfVEhFTUUgPSAnY2hhbmdldGhlbWUnO1xyXG4gIHB1YmxpYyBzdGF0aWMgUkVTRVRfUEFTU1dPUkQgPSAndXNlci9yZXNldHBhc3N3b3JkJztcclxuICBwdWJsaWMgc3RhdGljIEdPT0dMRV9MT0dJTiA9ICdnb29nbGVsb2dpbic7XHJcblxyXG4gIC8vUHJvamVjdFxyXG4gIHB1YmxpYyBzdGF0aWMgVVNFUl9BTExfUFJPSkVDVFMgPSAndXNlci9hbGwvcHJvamVjdCc7XHJcbiAgcHVibGljIHN0YXRpYyBQUk9KRUNUID0gJ3Byb2plY3QnO1xyXG4gIHB1YmxpYyBzdGF0aWMgQlVJTERJTkcgPSAnYnVpbGRpbmcnO1xyXG4gIHB1YmxpYyBzdGF0aWMgQ09TVEhFQUQgPSAnY29zdGhlYWQnO1xyXG4gIHB1YmxpYyBzdGF0aWMgQ09NTU9OX0FNRU5JVElFUyA9ICdjb21tb24tYW1lbml0aWVzJztcclxuICBwdWJsaWMgc3RhdGljIEFDVElWRV9TVEFUVVMgPSAnYWN0aXZlU3RhdHVzJztcclxuICBwdWJsaWMgc3RhdGljIEFDVElWRV9TVEFUVVNfRkFMU0UgPSAnZmFsc2UnO1xyXG4gIHB1YmxpYyBzdGF0aWMgQUNUSVZFX1NUQVRVU19UUlVFID0gJ3RydWUnO1xyXG4gIHB1YmxpYyBzdGF0aWMgQ0xPTkUgPSAnY2xvbmUnO1xyXG4gIHB1YmxpYyBzdGF0aWMgQ0FURUdPUllMSVNUID0gJ2NhdGVnb3J5bGlzdCc7XHJcbiAgcHVibGljIHN0YXRpYyBDQVRFR09SWSA9ICdjYXRlZ29yeSc7XHJcbiAgcHVibGljIHN0YXRpYyBXT1JLSVRFTSA9ICd3b3JraXRlbSc7XHJcbiAgcHVibGljIHN0YXRpYyBXT1JLSVRFTUxJU1QgPSAnd29ya2l0ZW1saXN0JztcclxuICBwdWJsaWMgc3RhdGljIFdPUktJVEVNX0FMTCA9ICd3b3JraXRlbS9hbGwnO1xyXG4gIHB1YmxpYyBzdGF0aWMgUVVBTlRJVFkgPSAncXVhbnRpdHknO1xyXG4gIHB1YmxpYyBzdGF0aWMgSVRFTSA9ICdpdGVtJztcclxuICBwdWJsaWMgc3RhdGljIERJUkVDVCA9ICdkaXJlY3QnO1xyXG4gIHB1YmxpYyBzdGF0aWMgU1lOQ19SQVRFX0FOQUxZU0lTID0gJ3N5bmNXaXRoUmF0ZUFuYWx5c2lzJztcclxuXHJcbiAgcHVibGljIHN0YXRpYyBUSFVNQlJVTEVfUlVMRV9SQVRFPSdyZXBvcnQvdGh1bWJSdWxlUmF0ZSc7XHJcbiAgcHVibGljIHN0YXRpYyBSQVRFPSdyYXRlJztcclxuICBwdWJsaWMgc3RhdGljIFJBVEVTPSdyYXRlcyc7XHJcbiAgcHVibGljIHN0YXRpYyBSQVRFX0lURU09J3JhdGVJdGVtJztcclxuICBwdWJsaWMgc3RhdGljIFNRRlQ9J3NxZnQnO1xyXG4gIHB1YmxpYyBzdGF0aWMgU1FNPSdzcW10JztcclxuICBwdWJsaWMgc3RhdGljIFJTX1BFUl9TUUZUID0gJ1JzL1NxZnQnO1xyXG4gIHB1YmxpYyBzdGF0aWMgUlNfUEVSX1NRTVQgPSAnUnMvU3FtdCc7XHJcbiAgcHVibGljIHN0YXRpYyBBUkVBPSdhcmVhJztcclxuICBwdWJsaWMgc3RhdGljIFNMQUJfQVJFQT0nc2xhYkFyZWEnO1xyXG4gIHB1YmxpYyBzdGF0aWMgU0FMRUFCTEVfQVJFQT0nc2FsZWFibGVBcmVhJztcclxuICBwdWJsaWMgc3RhdGljIENBUlBFVF9BUkVBPSdjYXJwZXRBcmVhJztcclxuICBwdWJsaWMgc3RhdGljIEJVREdFVEVEX0NPU1QgPSdidWRnZXRlZENvc3QnO1xyXG5cclxuICAvL01hdGVyaWFsIFRha2UgT2ZmXHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgUkVQT1JUX01BVEVSSUFMX1RBS0VfT0ZGID0ncmVwb3J0L21hdGVyaWFsdGFrZW9mZic7XHJcbiAgcHVibGljIHN0YXRpYyBNQVRFUklBTF9GSUxURVJTX0xJU1QgPSdtYXRlcmlhbC9maWx0ZXJzL2xpc3QnO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgSW1hZ2VQYXRoIHtcclxuICBwdWJsaWMgc3RhdGljIEZBVl9JQ09OID0gJy4vYXNzZXRzL2ZyYW1ld29yay9pbWFnZXMvbG9nby9mYXZpY29uLmljbyc7XHJcbiAgcHVibGljIHN0YXRpYyBCT0RZX0JBQ0tHUk9VTkQgPSAnLi9hc3NldHMvYnVpbGQtaW5mby9wYWdlX2JhY2tncm91bmQvcGFnZS1iZy5wbmcnO1xyXG4gIHB1YmxpYyBzdGF0aWMgQk9EWV9CQUNLR1JPVU5EX1RSQU5TUEFSRU5UID0gJy4vYXNzZXRzL2J1aWxkLWluZm8vcGFnZV9iYWNrZ3JvdW5kL3BhZ2UtYmctdHJhbnNwYXJlbnQucG5nJztcclxuICBwdWJsaWMgc3RhdGljIE1ZX1dISVRFX0xPR08gPSAnLi9hc3NldHMvYnVpbGQtaW5mby9oZWFkZXIvYnVpbGRpbmZvLWxvZ28ucG5nJztcclxuICBwdWJsaWMgc3RhdGljIEhFQURFUl9MT0dPID0gJy4vYXNzZXRzL2J1aWxkLWluZm8vaGVhZGVyL2hlYWRlci1sb2dvLnBuZyc7XHJcbiAgcHVibGljIHN0YXRpYyBNT0JJTEVfV0hJVEVfTE9HTyA9ICcuL2Fzc2V0cy9idWlsZC1pbmZvL2hlYWRlci9idWlsZGluZm8tbG9nby5wbmcnO1xyXG4gIHB1YmxpYyBzdGF0aWMgRkFDRUJPT0tfSUNPTiA9ICcuL2Fzc2V0cy9mcmFtZXdvcmsvaW1hZ2VzL2Zvb3Rlci9mYi5zdmcnO1xyXG4gIHB1YmxpYyBzdGF0aWMgR09PR0xFX0lDT04gPSAnLi9hc3NldHMvZnJhbWV3b3JrL2ltYWdlcy9mb290ZXIvZ29vZ2xlLXBsdXMuc3ZnJztcclxuICBwdWJsaWMgc3RhdGljIExJTktFRElOX0lDT04gPSAnLi9hc3NldHMvZnJhbWV3b3JrL2ltYWdlcy9mb290ZXIvbGlua2VkLWluLnN2Zyc7XHJcbiAgcHVibGljIHN0YXRpYyBQUk9GSUxFX0lNR19JQ09OID0gJy4vYXNzZXRzL2ZyYW1ld29yay9pbWFnZXMvZGFzaGJvYXJkL2RlZmF1bHQtcHJvZmlsZS5wbmcnO1xyXG4gIHB1YmxpYyBzdGF0aWMgQ09NUEFOWV9MT0dPX0lNR19JQ09OID0gJy4vYXNzZXRzL2ZyYW1ld29yay9pbWFnZXMvZGFzaGJvYXJkL2RlZmF1bHQtY29tcGFueS1idWlsZGluZm8tbG9nby5wbmcnO1xyXG4gIHB1YmxpYyBzdGF0aWMgRU1BSUxfSUNPTiA9ICcuL2Fzc2V0cy9mcmFtZXdvcmsvaW1hZ2VzL2ljb25zL2UtbWFpbC5zdmcnO1xyXG4gIHB1YmxpYyBzdGF0aWMgRU1BSUxfSUNPTl9HUkVZID0gJy4vYXNzZXRzL2ZyYW1ld29yay9pbWFnZXMvaWNvbnMvZS1tYWlsLWdyZXkuc3ZnJztcclxuICBwdWJsaWMgc3RhdGljIE5FV19FTUFJTF9JQ09OX0dSRVkgPSAnLi9hc3NldHMvZnJhbWV3b3JrL2ltYWdlcy9pY29ucy9uZXctZS1tYWlsLWdyZXkuc3ZnJztcclxuICBwdWJsaWMgc3RhdGljIENPTkZJUk1fRU1BSUxfSUNPTl9HUkVZID0gJy4vYXNzZXRzL2ZyYW1ld29yay9pbWFnZXMvaWNvbnMvY29uZmlybS1lLW1haWwtZ3JleS5zdmcnO1xyXG4gIHB1YmxpYyBzdGF0aWMgUEFTU1dPUkRfSUNPTiA9ICcuL2Fzc2V0cy9mcmFtZXdvcmsvaW1hZ2VzL2ljb25zL3Bhc3N3b3JkLnN2Zyc7XHJcbiAgcHVibGljIHN0YXRpYyBQQVNTV09SRF9JQ09OX0dSRVkgPSAnLi9hc3NldHMvZnJhbWV3b3JrL2ltYWdlcy9pY29ucy9wYXNzd29yZC1ncmV5LnN2Zyc7XHJcbiAgcHVibGljIHN0YXRpYyBORVdfUEFTU1dPUkRfSUNPTl9HUkVZID0gJy4vYXNzZXRzL2ZyYW1ld29yay9pbWFnZXMvaWNvbnMvbmV3LXBhc3N3b3JkLWdyZXkuc3ZnJztcclxuICBwdWJsaWMgc3RhdGljIENPTkZJUk1fUEFTU1dPUkRfSUNPTl9HUkVZID0gJy4vYXNzZXRzL2ZyYW1ld29yay9pbWFnZXMvaWNvbnMvY29uZmlybS1wYXNzd29yZC1ncmV5LnN2Zyc7XHJcbiAgcHVibGljIHN0YXRpYyBNT0JJTEVfSUNPTl9HUkVZID0gJy4vYXNzZXRzL2ZyYW1ld29yay9pbWFnZXMvaWNvbnMvbW9iaWxlLWdyZXkuc3ZnJztcclxuICBwdWJsaWMgc3RhdGljIE5FV19NT0JJTEVfSUNPTl9HUkVZID0gJy4vYXNzZXRzL2ZyYW1ld29yay9pbWFnZXMvaWNvbnMvbmV3LW1vYmlsZS1ncmV5LnN2Zyc7XHJcbiAgcHVibGljIHN0YXRpYyBDT05GSVJNX01PQklMRV9JQ09OX0dSRVkgPSAnLi9hc3NldHMvZnJhbWV3b3JrL2ltYWdlcy9pY29ucy9jb25maXJtLW1vYmlsZS1ncmV5LnN2Zyc7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBQcm9qZWN0QXNzZXQge1xyXG4gIHN0YXRpYyBfeWVhcjogRGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgc3RhdGljIGN1cnJlbnRZZWFyID0gUHJvamVjdEFzc2V0Ll95ZWFyLmdldEZ1bGxZZWFyKCk7XHJcbiAgcHVibGljIHN0YXRpYyBBUFBfTkFNRSA9ICdDb3N0IENvbnRyb2wnO1xyXG4gIHB1YmxpYyBzdGF0aWMgVEFHX0xJTkUgPSAnSGVscCB5b3UgdG8gZGVjaWRlIGNvc3QnO1xyXG4gIHB1YmxpYyBzdGF0aWMgVU5ERVJfTElDRU5FQ0UgPSAnwqkgJyArIFByb2plY3RBc3NldC5jdXJyZW50WWVhciArICcgd3d3LmJ1aWxkaW5mby5jb20nO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgSGVhZGluZ3Mge1xyXG4gIHB1YmxpYyBzdGF0aWMgQ0hBTkdFX1BBU1NXT1JEOiBzdHJpbmcgPSAnQ2hhbmdlIFBhc3N3b3JkJztcclxuICBwdWJsaWMgc3RhdGljIENIQU5HRV9FTUFJTF9IRUFESU5HOiBzdHJpbmcgPSAnQ2hhbmdlIHlvdXIgRW1haWwnO1xyXG4gIHB1YmxpYyBzdGF0aWMgQ0hBTkdFX01PQklMRV9OVU1CRVJfSEVBRElORzogc3RyaW5nID0gJ0NoYW5nZSBZb3VyIE1vYmlsZSBOdW1iZXInO1xyXG4gIHB1YmxpYyBzdGF0aWMgUkVTRVRfUEFTU1dPUkRfSEVBRElORzogc3RyaW5nID0gJ1JFU0VUIFBBU1NXT1JEJztcclxuICBwdWJsaWMgc3RhdGljIENSRUFURV9ZT1VSX0ZJUlNUX1BST0pFQ1Q6IHN0cmluZyA9ICdDcmVhdGUgWW91ciBGaXJzdCBQcm9qZWN0JztcclxuICBwdWJsaWMgc3RhdGljIENSRUFURV9ORVdfUFJPSkVDVDogc3RyaW5nID0gJ0NyZWF0ZSBOZXcgUHJvamVjdCc7XHJcbiAgcHVibGljIHN0YXRpYyBFRElUX0JVSUxESU5HOiBzdHJpbmcgPSAnRWRpdCBCdWlsZGluZyc7XHJcbiAgcHVibGljIHN0YXRpYyBMSVNUX0JVSUxESU5HOiBzdHJpbmcgPSAnQnVpbGRpbmdzIExpc3QnO1xyXG4gIHB1YmxpYyBzdGF0aWMgQUREX05FV19CVUlMRElORzogc3RyaW5nID0gJ0FkZCBCdWlsZGluZyBpbiBQcm9qZWN0JztcclxuICBwdWJsaWMgc3RhdGljIENPTU1PTl9ERVZFTE9QTUVOVCA6IHN0cmluZyA9ICdDb21tb24gRGV2ZWxvcG1lbnQgYW5kIEFtZW5pdGllcyc7XHJcbiAgcHVibGljIHN0YXRpYyBFTEVDVFJJQ19JTkZSQVNUUlVDVFVSRSA6IHN0cmluZyA9ICdFbGVjdHJpYyBJbmZyYXN0cnVjdHVyZSAnO1xyXG4gIHB1YmxpYyBzdGF0aWMgQ09OU1RSVUNUSU9OX0NPU1QgOiBzdHJpbmcgPSAnQ29uc3RydWN0aW9uIENvc3QgKE1hdGVyaWFsICsgTGFib3VyKSc7XHJcbiAgcHVibGljIHN0YXRpYyBRVUFOVElUWSA6IHN0cmluZyA9ICdRdWFudGl0eSc7XHJcbiAgcHVibGljIHN0YXRpYyBDT0xPTiA6IHN0cmluZyA9ICc6JztcclxuICBwdWJsaWMgc3RhdGljIElURU0gOiBzdHJpbmcgPSAnSXRlbSc7XHJcbiAgfVxyXG5cclxuZXhwb3J0IGNsYXNzIFRhYmxlSGVhZGluZ3Mge1xyXG4gIHB1YmxpYyBzdGF0aWMgSVRFTSA6IHN0cmluZyA9ICdJdGVtJztcclxuICBwdWJsaWMgc3RhdGljIFFVQU5USVRZIDogc3RyaW5nID0gJ1F0eS4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgTlVNQkVSUyA6IHN0cmluZyA9ICdOb3MuJztcclxuICBwdWJsaWMgc3RhdGljIExFTkdUSCA6IHN0cmluZyA9ICdMZW5ndGgnO1xyXG4gIHB1YmxpYyBzdGF0aWMgQlJFQURUSCA6IHN0cmluZyA9ICdCcmVhZHRoJztcclxuICBwdWJsaWMgc3RhdGljIEhFSUdIVCA6IHN0cmluZyA9ICdIZWlnaHQnO1xyXG4gIHB1YmxpYyBzdGF0aWMgVU5JVDogc3RyaW5nID0gJ1VuaXQnO1xyXG4gIHB1YmxpYyBzdGF0aWMgUkFURUFOQUxZU0lTIDogc3RyaW5nID0gJ1JhdGUgQW5hbHlzaXMvVW5pdCc7XHJcbiAgcHVibGljIHN0YXRpYyBBTU9VTlQgOiBzdHJpbmcgPSAnQW1vdW50JztcclxuICBwdWJsaWMgc3RhdGljIENPU1QgOiBzdHJpbmcgPSAnQ29zdCc7XHJcbiAgcHVibGljIHN0YXRpYyBUT1RBTDogc3RyaW5nID0gJ1RvdGFsJztcclxuICBwdWJsaWMgc3RhdGljIERFU0NSSVBUSU9OOiBzdHJpbmcgPSAnRGVzY3JpcHRpb24nO1xyXG4gIHB1YmxpYyBzdGF0aWMgUkFURV9QRVJfVU5JVDogc3RyaW5nID0gJ1JhdGUvVW5pdCc7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBMYWJlbCB7XHJcbiAgcHVibGljIHN0YXRpYyBDVVJSRU5UX1BBU1NXT1JEX0xBQkVMOiBzdHJpbmcgPSAnQ3VycmVudCBQYXNzd29yZCc7XHJcbiAgcHVibGljIHN0YXRpYyBORVdfUEFTU1dPUkRfTEFCRUw6IHN0cmluZyA9ICdOZXcgUGFzc3dvcmQnO1xyXG4gIHB1YmxpYyBzdGF0aWMgUEFTU1dPUkQ6IHN0cmluZyA9ICdQYXNzd29yZCc7XHJcbiAgcHVibGljIHN0YXRpYyBDT05GSVJNX1BBU1NXT1JEX0xBQkVMOiBzdHJpbmcgPSAnQ29uZmlybSBQYXNzd29yZCc7XHJcbiAgcHVibGljIHN0YXRpYyBGSVJTVF9OQU1FX0xBQkVMOiBzdHJpbmcgPSAnRmlyc3QgTmFtZSc7XHJcbiAgcHVibGljIHN0YXRpYyBDT01QQU5ZX05BTUVfTEFCRUw6IHN0cmluZyA9ICdDb21wYW55IE5hbWUnO1xyXG4gIHB1YmxpYyBzdGF0aWMgU1RBVEVfTEFCRUw6IHN0cmluZyA9ICdTdGF0ZSc7XHJcbiAgcHVibGljIHN0YXRpYyBDSVRZX0xBQkVMOiBzdHJpbmcgPSAnQ2l0eSc7XHJcbiAgcHVibGljIHN0YXRpYyBFTUFJTF9GSUVMRF9MQUJFTDogc3RyaW5nID0gJ1dvcmsgRW1haWwnO1xyXG4gIHB1YmxpYyBzdGF0aWMgQ09OVEFDVF9GSUVMRF9MQUJFTDogc3RyaW5nID0gJ01vYmlsZSBOdW1iZXInO1xyXG4gIHB1YmxpYyBzdGF0aWMgUkVTRVRfUEFTU1dPUkRfTUVTU0FHRTogc3RyaW5nID0gJ1BsZWFzZSBzZXQgbmV3IHBhc3N3b3JkIGZvciB5b3VyJztcclxuICBwdWJsaWMgc3RhdGljIE5BTUU6IHN0cmluZyA9ICdOYW1lJztcclxuICBwdWJsaWMgc3RhdGljIEFDQ0VQVF9OQU1FOiBzdHJpbmcgPSAnQnkgY2xpY2tpbmcgXCJDb250aW51ZVwiIEkgYWdyZWUgdG8gQnVpbGQgSW5mb1xcJ3MnO1xyXG4gIHB1YmxpYyBzdGF0aWMgVEVSTVNfQU5EX0NPTkRJVElPTlNfTkFNRTogc3RyaW5nID0gJ1Rlcm1zIG9mIFNlcnZpY2UnO1xyXG4gIHB1YmxpYyBzdGF0aWMgUFJJVkFDWV9QT0xJQ1k6IHN0cmluZyA9ICdQcml2YWN5IFBvbGljeSc7XHJcbiAgcHVibGljIHN0YXRpYyBTVEFSVF9GUkVFOiBzdHJpbmcgPSAnR2V0IHN0YXJ0ZWQgYWJzb2x1dGVseSBmcmVlJztcclxuICBwdWJsaWMgc3RhdGljIFJFR0lTVFJBVElPTl9JTkZPOiBzdHJpbmcgPSAnU2VlIGhvdyB0aGUgd29ybGRcXCdzIGJlc3QgQnVpbGRpbmcgRXN0aW1hdGlvbnMgYXJlIGNyZWF0ZWQuJztcclxuICBwdWJsaWMgc3RhdGljIE5PVF9GT1VORF9FUlJPUjogc3RyaW5nID0gJzQwNCc7XHJcbiAgcHVibGljIHN0YXRpYyBSRU1FTkJFUl9NRTogc3RyaW5nID0gJ1JlbWVtYmVyIG1lJztcclxuICBwdWJsaWMgc3RhdGljIEdFVF9TVEFSVEVEOiBzdHJpbmcgPSAnR2V0IFN0YXJ0ZWQnO1xyXG5cclxuICAvL3Byb2plY3QgZm9ybVxyXG4gIHB1YmxpYyBzdGF0aWMgUFJPSkVDVF9OQU1FIDogc3RyaW5nID0gJ1Byb2plY3QgTmFtZSc7XHJcbiAgcHVibGljIHN0YXRpYyBQUk9KRUNUX0FERFJFU1M6IHN0cmluZyA9ICdQcm9qZWN0IEFkZHJlc3MnO1xyXG4gIHB1YmxpYyBzdGF0aWMgUExPVF9BUkVBOiBzdHJpbmcgPSAnUGxvdCBBcmVhJztcclxuICBwdWJsaWMgc3RhdGljIFBMT1RfUEVSSVBIRVJZX0xFTkdUSCA6IHN0cmluZyA9ICdQbG90IFBlcmlwaGVyeSBsZW5ndGgnO1xyXG4gIHB1YmxpYyBzdGF0aWMgUE9ESVVNX0FSRUEgOiBzdHJpbmcgPSAnUG9kaXVtIEFyZWEnO1xyXG4gIHB1YmxpYyBzdGF0aWMgT1BFTl9TUEFDRSA6IHN0cmluZyA9ICdPcGVuIFNwYWNlJztcclxuICBwdWJsaWMgc3RhdGljIFNMQUJfQVJFQV9PRl9DTFVCX0hPVVNFIDogc3RyaW5nID0gJ1NsYWIgQXJlYSBvZiBjbHViIGhvdXNlJztcclxuICBwdWJsaWMgc3RhdGljIFNXSU1NSU5HX1BPT0xfQ0FQQUNJVFkgOiBzdHJpbmcgPSAnU3dpbW1pbmcgcG9vbCBjYXBhY2l0eSc7XHJcbiAgcHVibGljIHN0YXRpYyBQUk9KRUNUX0RVUkFUSU9OIDogc3RyaW5nID0gJ1Byb2plY3QgRHVyYXRpb24nO1xyXG4gIHB1YmxpYyBzdGF0aWMgTlVNX09GX0JVSUxESU5HUyA6IHN0cmluZyA9ICdUb3RhbCBOby4gb2YgYnVpbGRpbmdzJztcclxuICBwdWJsaWMgc3RhdGljIFVOSVRfSU5fTElURVJTIDogc3RyaW5nID0gJyhJbiBsdHJzKSc7XHJcbiAgcHVibGljIHN0YXRpYyBEVVJBVElPTl9JTl9NT05USFMgOiBzdHJpbmcgPSAnKEluIG1vbnRocyknO1xyXG4gIHB1YmxpYyBzdGF0aWMgQVJFQV9VTklUX0lOX1JGVCA6IHN0cmluZyA9ICcoSW4gcmZ0KSc7XHJcblxyXG4gIC8vQnVpbGRpbmcgZm9ybVxyXG4gIHB1YmxpYyBzdGF0aWMgQlVJTERJTkdfTkFNRSA6IHN0cmluZyA9ICdCdWlsZGluZyBOYW1lJztcclxuICBwdWJsaWMgc3RhdGljIFNMQUJfQVJFQTogc3RyaW5nID0gJ1NsYWIgQXJlYSAnO1xyXG4gIHB1YmxpYyBzdGF0aWMgQ0FSUEVUX0FSRUE6IHN0cmluZyA9ICdDYXJwZXQgYXJlYSBpbmNsdWRpbmcgQmFsY29uaWVzL2F0dGFjaGVkIHRlcnJhY2VzICc7XHJcbiAgcHVibGljIHN0YXRpYyBTQUxFQUJMRV9BUkVBOiBzdHJpbmcgPSAnU2FsZWFibGUgQXJlYSAnO1xyXG4gIHB1YmxpYyBzdGF0aWMgUExJTlRIX0FSRUEgOiBzdHJpbmcgPSAnUGxpbnRoIEFyZWEgJztcclxuICBwdWJsaWMgc3RhdGljIE5VTV9PRl9GTE9PUlMgOiBzdHJpbmcgPSAnTm8uIG9mIGZsb29ycyAnO1xyXG4gIHB1YmxpYyBzdGF0aWMgTlVNX09GX1BBUktJTkdfRkxPT1JTIDogc3RyaW5nID0gJ05vLiBvZiBwYXJraW5nIGZsb29ycyc7XHJcbiAgcHVibGljIHN0YXRpYyBDQVJQRVRfQVJFQV9PRl9QQVJLSU5HIDogc3RyaW5nID0gJ0NhcnBldCBhcmVhIG9mIHBhcmtpbmcgJztcclxuICBwdWJsaWMgc3RhdGljIEFQQVJUTUVOVF9DT05GSUdVUkFUSU9OOiBzdHJpbmcgPSAnQXBhcnRtZW50IENvbmZpZ3VyYXRpb24nO1xyXG4gIHB1YmxpYyBzdGF0aWMgTlVNX09GX09ORV9CSEs6IHN0cmluZyA9ICdOby4gb2YgMSBCSEtzJztcclxuICBwdWJsaWMgc3RhdGljIE5VTV9PRl9UV09fQkhLOiBzdHJpbmcgPSAnTm8uIG9mIDIgQkhLcyc7XHJcbiAgcHVibGljIHN0YXRpYyBOVU1fT0ZfVEhSRUVfQkhLOiBzdHJpbmcgPSAnTm8uIG9mIDMgQkhLcyc7XHJcbiAgcHVibGljIHN0YXRpYyBOVU1fT0ZfRk9VUl9CSEs6IHN0cmluZyA9ICdOby4gb2YgNCBCSEtzJztcclxuICBwdWJsaWMgc3RhdGljIE5VTV9PRl9GSVZFX0JISzogc3RyaW5nID0gJ05vLiBvZiA1IEJIS3MnO1xyXG4gIHB1YmxpYyBzdGF0aWMgTlVNX09GX0xJRlRTOiBzdHJpbmcgPSAnTm8uIG9mIExpZnRzJztcclxuICBwdWJsaWMgc3RhdGljIEFSRUFfVU5JVF9JTl9TUUZUOiBzdHJpbmcgPSAnKEluIHNxZnQpJztcclxuICBwdWJsaWMgc3RhdGljIEVYQ0xVRElOR19QQVJLSU5HX0ZMT09SUzogc3RyaW5nID0gJyhFeGNsdWRpbmcgcGFya2luZyBmbG9vcnMpJztcclxuXHJcbiAgLy9DT1NULVNVTU1BUlkgUkVQT1JUIExBQkVMU1xyXG4gIHB1YmxpYyBzdGF0aWMgQ09TVElOR19CWV9VTklUIDogc3RyaW5nID0gJ0Nvc3RpbmcgaW4gJztcclxuICBwdWJsaWMgc3RhdGljIENPU1RJTkdfUEVSX0FSRUEgOiBzdHJpbmcgPSAnQ29zdGluZyBwZXIgJztcclxuICBwdWJsaWMgc3RhdGljIFRPVEFMIDogc3RyaW5nID0gJ1RvdGFsICc7XHJcbiAgcHVibGljIHN0YXRpYyBTVUJUT1RBTCA6IHN0cmluZyA9ICdTdWIgVG90YWwnO1xyXG4gIHB1YmxpYyBzdGF0aWMgTk9URVMgOiBzdHJpbmcgPSAnTm90ZXMgJztcclxuICBwdWJsaWMgc3RhdGljIEJVREdFVEVEX0NPU1QgOiBzdHJpbmcgPSAnQnVkZ2V0ZWQgQ29zdCAnO1xyXG4gIHB1YmxpYyBzdGF0aWMgRVNUSU1BVEVEX0NPU1QgOiBzdHJpbmcgPSAnRXN0aW1hdGVkIENvc3QgJztcclxuICBwdWJsaWMgc3RhdGljIENPU1RfSEVBRCA6IHN0cmluZyA9ICdDb3N0IEhlYWQnO1xyXG4gIHB1YmxpYyBzdGF0aWMgQU1FTklUWV9DT1NUX0hFQUQgOiBzdHJpbmcgPSAnQW1lbml0eSBDb3N0IEhlYWQnO1xyXG4gIHB1YmxpYyBzdGF0aWMgUkVQT1JUX0JZX1RIVU1CUlVMRSA6IHN0cmluZyA9ICdCeSBUaHVtYnJ1bGUnO1xyXG4gIHB1YmxpYyBzdGF0aWMgRVNUSU1BVEVEIDogc3RyaW5nID0gJ0VzdGltYXRlZCAnO1xyXG4gIHB1YmxpYyBzdGF0aWMgQVNfUEVSX1BST0pFQ1QgOiBzdHJpbmcgPSAnKGFzIHBlciBwcm9qZWN0IHF1YW50aXRpZXMgJiByYXRlcyknO1xyXG4gIHB1YmxpYyBzdGF0aWMgR1JBTkRfVE9UQUwgOiBzdHJpbmcgPSAnR3JhbmQgVG90YWwgJztcclxuICBwdWJsaWMgc3RhdGljIFRPVEFMX1BST0pFQ1QgOiBzdHJpbmcgPSAnVG90YWwgUHJvamVjdCc7XHJcbiAgcHVibGljIHN0YXRpYyBXT1JLSVRFTVMgOiBzdHJpbmcgPSAnV29ya0l0ZW1zJztcclxuICBwdWJsaWMgc3RhdGljIEdFVF9SQVRFIDogc3RyaW5nID0gJ2dldFJhdGUnO1xyXG4gIHB1YmxpYyBzdGF0aWMgR0VUX1NZU1RFTV9SQVRFIDogc3RyaW5nID0gJ2dldFN5c3RlbVJhdGUnO1xyXG4gIHB1YmxpYyBzdGF0aWMgR0VUX1JBVEVfQllfUVVBTlRJVFkgOiBzdHJpbmcgPSAnZ2V0UmF0ZUJ5UXVhbnRpdHknO1xyXG4gIHB1YmxpYyBzdGF0aWMgV09SS0lURU1fUkFURV9UQUIgOiBzdHJpbmcgPSAncmF0ZSc7XHJcbiAgcHVibGljIHN0YXRpYyBXT1JLSVRFTV9SQVRFX0JZX1FVQU5USVRZX1RBQiA6IHN0cmluZyA9ICdjb3N0JztcclxuICBwdWJsaWMgc3RhdGljIFdPUktJVEVNX1NZU1RFTV9SQVRFX1RBQiA6IHN0cmluZyA9ICdzeXN0ZW1SQSc7XHJcbiAgcHVibGljIHN0YXRpYyBXT1JLSVRFTV9RVUFOVElUWV9UQUIgOiBzdHJpbmcgPSAncXVhbnRpdHknO1xyXG4gIHB1YmxpYyBzdGF0aWMgR0VUX1FVQU5USVRZIDogc3RyaW5nID0gJ0dldCBRdHkuJztcclxuICBwdWJsaWMgc3RhdGljIFFVQU5USVRZX1ZJRVcgOiBzdHJpbmcgPSAnZGVmYXVsdCc7XHJcbiAgcHVibGljIHN0YXRpYyBXT1JLSVRFTV9ERVRBSUxFRF9RVUFOVElUWV9UQUIgOiBzdHJpbmcgPSAnZGV0YWlsZWRRdWFudGl0eSc7XHJcblxyXG4gIC8vUXVhbnRpdHkgVmlld1xyXG4gIHB1YmxpYyBzdGF0aWMgREVGQVVMVF9WSUVXID0gJ2RlZmF1bHQnO1xyXG5cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEJ1dHRvbiB7XHJcbiAgcHVibGljIHN0YXRpYyBDSEFOR0VfUEFTU1dPUkRfQlVUVE9OOiBzdHJpbmcgPSAnQ2hhbmdlIFBhc3N3b3JkJztcclxuICBwdWJsaWMgc3RhdGljIFJFU0VUX1BBU1NXT1JEX0JVVFRPTjogc3RyaW5nID0gJ1JFU0VUIFBBU1NXT1JEJztcclxuICBwdWJsaWMgc3RhdGljIENMT05FX0JVVFRPTjogc3RyaW5nID0gJ0Nsb25lJztcclxuICBwdWJsaWMgc3RhdGljIENMT1NFX0JVVFRPTjogc3RyaW5nID0gJ0Nsb3NlJztcclxuICBwdWJsaWMgc3RhdGljIENBTkNFTF9CVVRUT046IHN0cmluZyA9ICdDYW5jZWwnO1xyXG4gIHB1YmxpYyBzdGF0aWMgVklFV19BTkRfRURJVDogc3RyaW5nID0gJ1ZpZXcgYW5kIEVkaXQnO1xyXG4gIHB1YmxpYyBzdGF0aWMgUFJPQ0VFRDogc3RyaW5nID0gJ1Byb2NlZWQnO1xyXG4gIHB1YmxpYyBzdGF0aWMgTkVYVDogc3RyaW5nID0gJ05leHQnO1xyXG4gIHB1YmxpYyBzdGF0aWMgU1VCTUlUOiBzdHJpbmcgPSAnU3VibWl0JztcclxuICBwdWJsaWMgc3RhdGljIENSRUFURV9ORVdfUFJPSkVDVDogc3RyaW5nID0gJ0NyZWF0ZSBOZXcgUHJvamVjdCc7XHJcbiAgcHVibGljIHN0YXRpYyBCQUNLX1RPX0hPTUU6IHN0cmluZyA9ICdCYWNrIHRvIGhvbWUnO1xyXG4gIHB1YmxpYyBzdGF0aWMgR09fQkFDSzogc3RyaW5nID0gJ0JhY2snO1xyXG4gIHB1YmxpYyBzdGF0aWMgU0FWRTogc3RyaW5nID0gJ1NhdmUnO1xyXG4gIHB1YmxpYyBzdGF0aWMgR0VUX0FNT1VOVDogc3RyaW5nID0gJ0VzdGltYXRlIENvc3QnO1xyXG4gIHB1YmxpYyBzdGF0aWMgR0VUX1JBVEU6IHN0cmluZyA9ICdHZXQgUmF0ZSc7XHJcbiAgcHVibGljIHN0YXRpYyBHRVRfUVVBTlRJVFk6IHN0cmluZyA9ICdHZXQgUXR5Lic7XHJcbiAgcHVibGljIHN0YXRpYyBTWVNURU1fUkE6IHN0cmluZyA9ICdTeXN0ZW0gUkEnO1xyXG4gIHB1YmxpYyBzdGF0aWMgQUREOiBzdHJpbmcgPSAnQWRkICc7XHJcbiAgcHVibGljIHN0YXRpYyBBRERfTU9SRV9ERVRBSUxTOiBzdHJpbmcgPSAnQWRkIE1vcmUgRGV0YWlscyc7XHJcbiAgcHVibGljIHN0YXRpYyBDQVRFR09SWTogc3RyaW5nID0gJ0NhdGVnb3J5JztcclxuICBwdWJsaWMgc3RhdGljIFdPUktJVEVNOiBzdHJpbmcgPSAnV29ya0l0ZW0nO1xyXG4gIHB1YmxpYyBzdGF0aWMgSVRFTTogc3RyaW5nID0gJ0l0ZW0nO1xyXG4gIHB1YmxpYyBzdGF0aWMgUk9XOiBzdHJpbmcgPSAnUm93JztcclxuICBwdWJsaWMgc3RhdGljIENPU1RIRUFEOiBzdHJpbmcgPSAnQ29zdCBIZWFkJztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFVuaXRzIHtcclxuXHJcbiAgcHVibGljIHN0YXRpYyBVTklUID0gJ3NxZnQnO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUHJvamVjdEVsZW1lbnRzIHtcclxuICBwdWJsaWMgc3RhdGljIENPU1RfSEVBRCA9ICdDb3N0SGVhZCc7XHJcbiAgcHVibGljIHN0YXRpYyBXT1JLX0lURU0gPSAnV29ya0l0ZW0nO1xyXG4gIHB1YmxpYyBzdGF0aWMgQlVJTERJTkcgPSAnQnVpbGRpbmcnO1xyXG4gIHB1YmxpYyBzdGF0aWMgUVVBTlRJVFlfSVRFTSA9ICdRdWFudGl0eSBJdGVtJztcclxuICBwdWJsaWMgc3RhdGljIFFVQU5USVRZX0RFVEFJTFMgPSAnUXVhbnRpdHkgRGV0YWlscyc7XHJcbiAgcHVibGljIHN0YXRpYyBDQVRFR09SWSA9ICdDYXRlZ29yeSc7XHJcbiAgcHVibGljIHN0YXRpYyBTTEFCX0FSRUEgPSAnU2xhYiBBcmVhJztcclxuICBwdWJsaWMgc3RhdGljIFNBTEVBQkxFX0FSRUEgPSAnU2FsZWFibGUgQXJlYSc7XHJcbiAgcHVibGljIHN0YXRpYyBDQVJQRVRfQVJFQSA9ICdDYXJwZXQgQXJlYSc7XHJcbiAgcHVibGljIHN0YXRpYyBSU19QRVJfU1FGVCA9ICdScy9TcWZ0JztcclxuICBwdWJsaWMgc3RhdGljIFJTX1BFUl9TUU1UID0gJ1JzL1NxbXQnO1xyXG4gIHB1YmxpYyBzdGF0aWMgU1FVQVJFRkVFVCA9ICdzcWZ0JztcclxuICBwdWJsaWMgc3RhdGljIFNRVUFSRU1FVEVSID0gJ3NxbXQnO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTWF0ZXJpYWxUYWtlT2ZmRWxlbWVudHMge1xyXG5cclxuICBwdWJsaWMgc3RhdGljIENPU1RfSEVBRF9XSVNFID0gJ0Nvc3QgSGVhZCBXaXNlJztcclxuICBwdWJsaWMgc3RhdGljIEFMTF9CVUlMRElOR1MgPSAnQWxsIEJ1aWxkaW5ncyc7XHJcbiAgcHVibGljIHN0YXRpYyBDT1NUX0hFQUQgPSAnQ29zdCBIZWFkJztcclxuICBwdWJsaWMgc3RhdGljIE1BVEVSSUFMX1dJU0UgPSAnTWF0ZXJpYWwgV2lzZSc7XHJcbiAgcHVibGljIHN0YXRpYyBNQVRFUklBTCA9ICdNYXRlcmlhbCc7XHJcbiAgcHVibGljIHN0YXRpYyBDT05URU5UID0gJ2NvbnRlbnQnO1xyXG4gIHB1YmxpYyBzdGF0aWMgSEVBREVSUyA9ICdoZWFkZXJzJztcclxuICBwdWJsaWMgc3RhdGljIEZPT1RFUiA9ICdmb290ZXInO1xyXG4gIHB1YmxpYyBzdGF0aWMgU1VCX0NPTlRFTlQgPSAnc3ViQ29udGVudCc7XHJcbiAgcHVibGljIHN0YXRpYyBDT0xVTU5fT05FID0gJ2NvbHVtbk9uZSc7XHJcbiAgcHVibGljIHN0YXRpYyBDT0xVTU5fVFdPID0gJ2NvbHVtblR3byc7XHJcbiAgcHVibGljIHN0YXRpYyBDT0xVTU5fVEhSRUUgPSAnY29sdW1uVGhyZWUnO1xyXG4gIHB1YmxpYyBzdGF0aWMgRUxFTUVOVF9XSVNFX1JFUE9SVF9DT1NUX0hFQUQgPSAnY29zdEhlYWQnO1xyXG4gIHB1YmxpYyBzdGF0aWMgRUxFTUVOVF9XSVNFX1JFUE9SVF9NQVRFUklBTCA9ICdtYXRlcmlhbCc7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBNZW51cyB7XHJcbiAgcHVibGljIHN0YXRpYyBDT1NUX1NVTU1BUlkgPSAnQ29zdCBTdW1tYXJ5JztcclxuICBwdWJsaWMgc3RhdGljIE1BVEVSSUFMX1RBS0VPRkYgPSAnTWF0ZXJpYWwgVGFrZW9mZic7XHJcbiAgcHVibGljIHN0YXRpYyBQUk9KRUNUX0RFVEFJTFMgPSAnUHJvamVjdCBEZXRhaWxzJztcclxuICBwdWJsaWMgc3RhdGljIE1ZX1BST0pFQ1RTID0gJ015IFByb2plY3RzJztcclxuICBwdWJsaWMgc3RhdGljIENMT05FID0gJ0Nsb25lJztcclxuICBwdWJsaWMgc3RhdGljIEVESVQgPSAnRWRpdCc7XHJcbiAgcHVibGljIHN0YXRpYyBERUxFVEUgPSAnRGVsZXRlJztcclxuICBwdWJsaWMgc3RhdGljIEFERF9CVUlMRElORyA9ICdBZGQgQnVpbGRpbmcnO1xyXG4gIHB1YmxpYyBzdGF0aWMgQUREX0JVSUxESU5HX1RPX1BST0pFQ1QgPSAnQWRkIEJ1aWxkaW5nIHRvIFByb2plY3QnO1xyXG4gIHB1YmxpYyBzdGF0aWMgQ1JFQVRFX05FV19QUk9KRUNUOiBzdHJpbmcgPSAnQ3JlYXRlIE5ldyBQcm9qZWN0JztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFZhbHVlQ29uc3RhbnQge1xyXG5cclxuICBwdWJsaWMgc3RhdGljIE5VTUJFUl9PRl9GUkFDVElPTl9ESUdJVCA9IDI7XHJcbn1cclxuIl19
