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
    Messages.MSG_SUCCESS_UPDATE_DIRECT_QUANTITY_OF_WORKITEM = 'Direct quantity for workitem updated successfully.';
    Messages.MSG_SUCCESS_UPDATE_DIRECT_RATE_OF_WORKITEM = 'Direct rate for workitem updated successfully.';
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
    Label.TOTAL_A = 'Total(A)';
    Label.TOTAL_A_B = 'Total(A+B)';
    Label.TOTAL_A_B_C = 'Total(A+B+C)';
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
    ProjectElements.DIRECT_QUANTITY = 'Direct Quantity';
    ProjectElements.QUANTITY_DETAILS = 'Quantity Details';
    ProjectElements.QUANTITY = 'Quantity';
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
    MaterialTakeOffElements.COST_HEAD_WISE = 'Cost Head wise';
    MaterialTakeOffElements.ALL_BUILDINGS = 'All Buildings';
    MaterialTakeOffElements.BUILDING = 'Building';
    MaterialTakeOffElements.COST_HEAD = 'Cost Head';
    MaterialTakeOffElements.MATERIAL_WISE = 'Material wise';
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
    MaterialTakeOffElements.ERROR_MESSAGE_MATERIAL_TAKE_OFF_REPORT_OF = 'Material take off report of ';
    MaterialTakeOffElements.ERROR_MESSAGE_IS_NOT_FOUND_FOR = ' is not found for ';
    MaterialTakeOffElements.ERROR_MESSAGE_BUILDING = ' building.';
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,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LGdDQUFRLEdBQUcsVUFBVSxDQUFDO0lBQ3RCLCtCQUFPLEdBQUcsU0FBUyxDQUFDO0lBQ3BCLCtCQUFPLEdBQUcsU0FBUyxDQUFDO0lBQ3BCLDhCQUFNLEdBQUcsUUFBUSxDQUFDO0lBQ2xCLG1DQUFXLEdBQUcsWUFBWSxDQUFDO0lBQzNCLGtDQUFVLEdBQUcsV0FBVyxDQUFDO0lBQ3pCLGtDQUFVLEdBQUcsV0FBVyxDQUFDO0lBQ3pCLG9DQUFZLEdBQUcsYUFBYSxDQUFDO0lBQzdCLHFEQUE2QixHQUFHLFVBQVUsQ0FBQztJQUMzQyxvREFBNEIsR0FBRyxVQUFVLENBQUM7SUFDMUMsaUVBQXlDLEdBQUcsOEJBQThCLENBQUM7SUFDM0Usc0RBQThCLEdBQUcsb0JBQW9CLENBQUM7SUFDdEQsOENBQXNCLEdBQUcsWUFBWSxDQUFDO0lBQ3RELDhCQUFDO0NBcEJELEFBb0JDLElBQUE7QUFwQlksMERBQXVCO0FBc0JwQztJQUFBO0lBV0EsQ0FBQztJQVZlLGtCQUFZLEdBQUcsY0FBYyxDQUFDO0lBQzlCLHNCQUFnQixHQUFHLGtCQUFrQixDQUFDO0lBQ3RDLHFCQUFlLEdBQUcsaUJBQWlCLENBQUM7SUFDcEMsaUJBQVcsR0FBRyxhQUFhLENBQUM7SUFDNUIsV0FBSyxHQUFHLE9BQU8sQ0FBQztJQUNoQixVQUFJLEdBQUcsTUFBTSxDQUFDO0lBQ2QsWUFBTSxHQUFHLFFBQVEsQ0FBQztJQUNsQixrQkFBWSxHQUFHLGNBQWMsQ0FBQztJQUM5Qiw2QkFBdUIsR0FBRyx5QkFBeUIsQ0FBQztJQUNwRCx3QkFBa0IsR0FBVyxvQkFBb0IsQ0FBQztJQUNsRSxZQUFDO0NBWEQsQUFXQyxJQUFBO0FBWFksc0JBQUs7QUFhbEI7SUFBQTtJQUdBLENBQUM7SUFEZSxzQ0FBd0IsR0FBRyxDQUFDLENBQUM7SUFDN0Msb0JBQUM7Q0FIRCxBQUdDLElBQUE7QUFIWSxzQ0FBYSIsImZpbGUiOiJhcHAvc2hhcmVkL2NvbnN0YW50cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjbGFzcyBBcHBTZXR0aW5ncyB7XHJcbiAgLy8gcHVibGljIHN0YXRpYyBJUCA9ICdodHRwOi8vbG9jYWxob3N0OjgwODAnO1xyXG4gIHB1YmxpYyBzdGF0aWMgSVAgPSAnaHR0cDovLzUyLjY2LjEyMC4yMjg6ODA4MCc7IC8vIGJ1aWxkIGluZm8gc3RhZ2luZ1xyXG4gIC8vIHB1YmxpYyBzdGF0aWMgSE9TVF9OQU1FID0gJ2xvY2FsaG9zdDo4MDgwJztcclxuICBwdWJsaWMgc3RhdGljIEhPU1RfTkFNRSA9ICc1Mi42Ni4xMjAuMjI4OjgwODAnO1xyXG5cclxuICBwdWJsaWMgc3RhdGljIGdldCBBUElfRU5EUE9JTlQoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLklQICsgJy9hcGkvJztcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgSU5JVElBTF9USEVNID0gJ2NvbnRhaW5lci1mbHVpZCBkYXJrLXRoZW1lJztcclxuICBwdWJsaWMgc3RhdGljIExJR0hUX1RIRU0gPSAnY29udGFpbmVyLWZsdWlkIGxpZ2h0LXRoZW1lJztcclxuICBwdWJsaWMgc3RhdGljIElTX1NPQ0lBTF9MT0dJTl9ZRVMgPSAnWUVTJztcclxuICBwdWJsaWMgc3RhdGljIElTX1NPQ0lBTF9MT0dJTl9OTyA9ICdOTyc7XHJcbiAgcHVibGljIHN0YXRpYyBIVFRQX0NMSUVOVCA9ICdodHRwOi8vJztcclxufVxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBNZXNzYWdlcyB7XHJcbiAgcHVibGljIHN0YXRpYyBGUk9NX1JFR0lTVFJBVElPTiA9ICdyZWdpc3RyYXRpb24nO1xyXG4gIHB1YmxpYyBzdGF0aWMgRlJPTV9BQ0NPVU5UX0RFVEFJTCA9ICdhY2NvdW50ZGV0YWlsJztcclxuXHJcbiAgLy9SZWdpc3RyYWlvbiBTdWNjZXNzIG1lc3NhZ2VzXHJcbiAgcHVibGljIHN0YXRpYyBNU0dfU1VDQ0VTU19DSEFOR0VfTU9CSUxFX05VTUJFUjogc3RyaW5nID0gJ01vYmlsZSBudW1iZXIgdXBkYXRlZCBzdWNjZXNzZnVsbHkuJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19TVUNDRVNTX1JFU0VORF9WRVJJRklDQVRJT05fQ09ERTogc3RyaW5nID0gJ05ldyBPVFAgKE9uZSBUaW1lIFBhc3N3b3JkKSBoYXMgYmVlbiBzZW50IHRvIHlvdXIgcmVnaXN0ZXJlZCBtb2JpbGUgbnVtYmVyJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19TVUNDRVNTX1JFU0VORF9WRVJJRklDQVRJT05fQ09ERV9SRVNFTkRfT1RQOiBzdHJpbmcgPSAnTmV3IE9UUCAoT25lIFRpbWUgUGFzc3dvcmQpIGhhcycgK1xyXG4gICAgJyBiZWVuIHNlbnQgdG8geW91ciBuZXcgbW9iaWxlIG51bWJlcic7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfU1VDQ0VTU19NQUlMX1ZFUklGSUNBVElPTjogc3RyaW5nID0gJ1ZlcmlmaWNhdGlvbiBlLW1haWwgc2VudCBzdWNjZXNzZnVsbHkgdG8geW91ciBlLW1haWwgYWNjb3VudC4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX1NVQ0NFU1NfUkVTRVRfUEFTU1dPUkQ6IHN0cmluZyA9ICdZb3VyIHBhc3N3b3JkIGlzIHJlc2V0IHN1Y2Nlc3NmdWxseS5LaW5kbHkgbG9naW4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX1NVQ0NFU1NfQ0hBTkdFX0VNQUlMOiBzdHJpbmcgPSAnQSB2ZXJpZmljYXRpb24gZW1haWwgaXMgc2VudCB0byB5b3VyIG5ldyBlbWFpbCBpZC4gJyArXHJcbiAgICAnQ3VycmVudCBlbWFpbCBpZCB3aWxsIGJlIGFjdGl2ZSB0aWxsIHlvdSB2ZXJpZnkgbmV3IGVtYWlsIGlkLic7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfU1VDQ0VTU19GT1JHT1RfUEFTU1dPUkQ6IHN0cmluZyA9ICdFbWFpbCBmb3IgcGFzc3dvcmQgcmVzZXQgaGFzIGJlZW4gc2VudCBzdWNjZXNzZnVsbHkgb24geW91ciByZWdpc3RlcmVkIGVtYWlsIGlkLic7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfU1VDQ0VTU19EQVNIQk9BUkRfUFJPRklMRTogc3RyaW5nID0gJ1lvdXIgcHJvZmlsZSB1cGRhdGVkIHN1Y2Nlc3NmdWxseS4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX1NVQ0NFU1NfQ09OVEFDVDogc3RyaW5nID0gJ0VtYWlsIHNlbnQgc3VjY2Vzc2Z1bGx5Lic7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfU1VDQ0VTU19DSEFOR0VfVEhFTUU6IHN0cmluZyA9ICdUaGVtZSBjaGFuZ2VkIHN1Y2Nlc3NmdWxseS4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX1NVQ0NFU1NfTUFJTF9WRVJJRklDQVRJT05fUkVTVUxUX1NUQVRVUzogc3RyaW5nID0gJ0NvbmdyYXR1bGF0aW9ucyEnO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0NIQU5HRV9QQVNTV09SRF9TVUNDRVNTX0hFQURFUjogc3RyaW5nID0gJ1Bhc3N3b3JkIENoYW5nZWQgU3VjY2Vzc2Z1bGx5JztcclxuICBwdWJsaWMgc3RhdGljIE1TR19TVUNDRVNTX01BSUxfVkVSSUZJQ0FUSU9OX0JPRFk6IHN0cmluZyA9ICdZb3VyIGFjY291bnQgdmVyaWZpZWQgc3VjY2Vzc2Z1bGx5LicgK1xyXG4gICAgJ1lvdSBtYXkgc3RhcnQgdXNpbmcgaXQgaW1tZWRpYXRlbHkgYnkgY2xpY2tpbmcgb24gU2lnbiBJbiEnO1xyXG5cclxuICAvL1JlZ2lzdHJhdGlvbiBGYWlsdXJlIG1lc3NhZ2VzXHJcbiAgcHVibGljIHN0YXRpYyBNU0dfRVJST1JfTUFJTF9WRVJJRklDQVRJT05fQk9EWTogc3RyaW5nID0gJ1lvdXIgYWNjb3VudCB2ZXJpZmljYXRpb24gZmFpbGVkIGR1ZSB0byBpbnZhbGlkIGFjY2VzcyB0b2tlbiEnO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0VSUk9SX01BSUxfVkVSSUZJQ0FUSU9OX1JFU1VMVF9TVEFUVVM6IHN0cmluZyA9ICdTb3JyeS4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0VSUk9SX0RBU0hCT0FSRF9QUk9GSUxFX1BJQzogc3RyaW5nID0gJ0ZhaWxlZCB0byBjaGFuZ2UgcHJvZmlsZSBwaWN0dXJlLic7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfRVJST1JfQ0hBTkdFX1RIRU1FOiBzdHJpbmcgPSAnRmFpbGVkIHRvIGNoYW5nZSB0aGVtZS4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0VSUk9SX1NFUlZFUl9FUlJPUjogc3RyaW5nID0gJ1NlcnZlciBlcnJvci4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0VSUk9SX1NPTUVUSElOR19XUk9ORzogc3RyaW5nID0gJ0ludGVybmFsIFNlcnZlciBFcnJvci4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0VSUk9SX0lNQUdFX1RZUEU6IHN0cmluZyA9ICdQbGVhc2UgdHJ5IGFnYWluLiBNYWtlIHN1cmUgdG8gdXBsb2FkIG9ubHkgaW1hZ2UgZmlsZSB3aXRoIGV4dGVuc2lvbnMgSlBHLCBKUEVHLCBHSUYsIFBORy4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0VSUk9SX0lNQUdFX1NJWkU6IHN0cmluZyA9ICdQbGVhc2UgbWFrZSBzdXJlIHRoZSBpbWFnZSBzaXplIGlzIGxlc3MgdGhhbiA1IE1CLic7XHJcblxyXG4gIC8vUmVnaXN0cmF0aW9uIHZhbGlkYXRpb24gbWVzc2FnZXNcclxuICBwdWJsaWMgc3RhdGljIE1TR19FUlJPUl9WQUxJREFUSU9OX0VNQUlMX1JFUVVJUkVEID0gJ0VudGVyIHlvdXIgZS1tYWlsIGFkZHJlc3MnO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0VSUk9SX1ZBTElEQVRJT05fV0VCU0lURV9SRVFVSVJFRCA9ICdFbnRlciBjb21wYW55IHdlYnNpdGUuJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19FUlJPUl9WQUxJREFUSU9OX1BBU1NXT1JEX1JFUVVJUkVEID0gJ0VudGVyIHlvdXIgcGFzc3dvcmQnO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0VSUk9SX1ZBTElEQVRJT05fTkVXUEFTU1dPUkRfUkVRVUlSRUQgPSAnRW50ZXIgYSBuZXcgcGFzc3dvcmQnO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0VSUk9SX1ZBTElEQVRJT05fQ09ORklSTVBBU1NXT1JEX1JFUVVJUkVEID0gJ0NvbmZpcm0geW91ciBwYXNzd29yZCc7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfRVJST1JfVkFMSURBVElPTl9DVVJSRU5UUEFTU1dPUkRfUkVRVUlSRUQgPSAnRW50ZXIgeW91ciBjdXJyZW50IHBhc3N3b3JkJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19FUlJPUl9WQUxJREFUSU9OX0ZJUlNUTkFNRV9SRVFVSVJFRCA9ICdFbnRlciB5b3VyIG5hbWUnO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0VSUk9SX1ZBTElEQVRJT05fTEFTVE5BTUVfUkVRVUlSRUQgPSAnVGhpcyBmaWVsZCBjYW5cXCd0IGJlIGxlZnQgYmxhbmsnO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0VSUk9SX1ZBTElEQVRJT05fTU9CSUxFX05VTUJFUl9SRVFVSVJFRCA9ICdUaGlzIGZpZWxkIGNhblxcJ3QgYmUgbGVmdCBibGFuayc7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfRVJST1JfVkFMSURBVElPTl9QSU5fUkVRVUlSRUQgPSAnRW50ZXIgeW91ciBwaW4gY29kZS4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0VSUk9SX1ZBTElEQVRJT05fREVTQ1JJUFRJT05fUkVRVUlSRUQgPSAnRW50ZXIgdGhlIG5hbWUgb2YgdGhlIGRvY3VtZW50IHlvdSBhcmUgdXBsb2FkaW5nLic7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfRVJST1JfVkFMSURBVElPTl9BQk9VVF9DT01QQU5ZX1JFUVVJUkVEID0gJ0dpdmUgYSBicmllZiBkZXNjcmlwdGlvbiBhYm91dCB5b3VyIGNvbXBhbnkuICcgK1xyXG4gICAgJ1RoaXMgd2lsbCBiZSBzZWVuIGJ5IGNhbmRpZGF0ZXMgYXMgYSBwYXJ0IG9mIHRoZSBqb2IgcHJvZmlsZS4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0VSUk9SX1ZBTElEQVRJT05fQ09NUEFOWU5BTUVfUkVRVUlSRUQgPSAnVGhpcyBmaWVsZCBjYW5cXCd0IGJlIGxlZnQgYmxhbmsuJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19FUlJPUl9WQUxJREFUSU9OX09UUF9SRVFVSVJFRCA9ICdFbnRlciByZWNlaXZlZCBPVFAuJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19FUlJPUl9WQUxJREFUSU9OX0lOVkFMSURfRU1BSUxfUkVRVUlSRUQgPSAnRW50ZXIgYSB2YWxpZCBlbWFpbCBhZGRyZXNzJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19FUlJPUl9WQUxJREFUSU9OX0lOVkFMSURfVVJMX1JFUVVJUkVEID0gJ1dlYnNpdGUgaXMgbm90IHZhbGlkLic7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfRVJST1JfVkFMSURBVElPTl9JTlZBTElEX05BTUUgPSAnRW50ZXIgdmFsaWQgbmFtZS4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0VSUk9SX1ZBTElEQVRJT05fSU5WQUxJRF9EQVRBID0gJ0VudGVyIHZhbGlkIGRhdGEuJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19FUlJPUl9WQUxJREFUSU9OX1BBU1NXT1JEX01JU01BVENIRUQgPSAnUGFzc3dvcmRzIGRvIG5vdCBtYXRjaCc7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfRVJST1JfVkFMSURBVElPTl9CSVJUSFlFQVJfUkVRVUlSRUQgPSAnVGhpcyBmaWVsZCBjYW5cXCd0IGJlIGxlZnQgYmxhbmsuJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19FUlJPUl9WQUxJREFUSU9OX0JJUlRIWUVBUl9JTlZBTElEID0gJ0VudGVyIHZhbGlkIGJpcnRoLXllYXInO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0VSUk9SX1ZBTElEQVRJT05fT1RQX01PQklMRV9OVU1CRVIgPSAnUGxlYXNlIHByb3ZpZGUgYSB2YWxpZCBtb2JpbGUgbnVtYmVyLic7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfRVJST1JfVkFMSURBVElPTl9QQVNTV09SRCA9ICdQYXNzd29yZCBtdXN0IGJlIGFscGhhbnVtZXJpYyBoYXZpbmcgbWluaW11bSA2IGNoYXJhY3RlcnMnO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0VSUk9SX1ZBTElEQVRJT05fUElOX05VTUJFUiA9ICdQaW4gY29kZSBzaG91bGQgbm90IGJlIGdyZWF0ZXIgdGhhbiAyMCBjaGFyYWN0ZXJzLic7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfRVJST1JfVkFMSURBVElPTl9JVEVNX05BTUVfUkVRVUlSRUQgPSAnSXRlbSBuYW1lIHNob3VsZCBub3QgYmUgYmxhbmsuIFxcbkZpbGwgaXQuJztcclxuXHJcbiAgLy9Qcm9qZWN0IHZhbGlkYXRpb24gbWVzc2FnZXNcclxuICBwdWJsaWMgc3RhdGljIE1TR19FUlJPUl9WQUxJREFUSU9OX1BST0pFQ1RfTkFNRV9SRVFVSVJFRCA9ICdFbnRlciBwcm9qZWN0IG5hbWUnO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0VSUk9SX1ZBTElEQVRJT05fUFJPSkVDVF9BRERSRVNTX1JFUVVJUkVEID0gJ0VudGVyIHByb2plY3QgYWRkcmVzcyc7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfRVJST1JfVkFMSURBVElPTl9QTE9UX0FSRUFfUkVRVUlSRUQgPSAnRW50ZXIgcGxvdCBhcmVhJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19FUlJPUl9WQUxJREFUSU9OX1BST0pFQ1RfRFVSQVRJT05fUkVRVUlSRUQgPSAnRW50ZXIgcHJvamVjdCBkdXJhdGlvbic7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfRVJST1JfVkFMSURBVElPTl9QTE9UX1BFUklQSEVSWV9SRVFVSVJFRCA9ICdFbnRlciBwbG90IHBlcmlwaGVyeSBsZW5ndGgnO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0VSUk9SX1ZBTElEQVRJT05fUE9ESVVNX0FSRUFfUkVRVUlSRUQgPSAnRW50ZXIgcG9kaXVtIGFyZWEnO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0VSUk9SX1ZBTElEQVRJT05fT1BFTl9TUEFDRV9SRVFVSVJFRCA9ICdFbnRlciBvcGVuIHNwYWNlJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19FUlJPUl9WQUxJREFUSU9OX1NXSU1NSU5HX1BPT0xfQ0FQQUNJVFlfUkVRVUlSRUQgPSAnRW50ZXIgc3dpbW1pbmcgcG9vbCBjYXBhY2l0eSc7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfRVJST1JfVkFMSURBVElPTl9OVU1fT0ZfQlVJTERJTkdTX1JFUVVJUkVEID0gJ0VudGVyIHRvdGFsIG5vLiBvZiBidWlsZGluZ3MnO1xyXG5cclxuICAvL0J1aWxkaW5nIHZhbGlkYXRpb24gbWVzc2FnZXNcclxuICBwdWJsaWMgc3RhdGljIE1TR19FUlJPUl9WQUxJREFUSU9OX0JVSUxESU5HX05BTUVfUkVRVUlSRUQgPSAnRW50ZXIgYnVpbGRpbmcgbmFtZSc7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfRVJST1JfVkFMSURBVElPTl9TTEFCX0FSRUFfUkVRVUlSRUQgPSAnRW50ZXIgc2xhYiBhcmVhJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19FUlJPUl9WQUxJREFUSU9OX0NBUlBFVF9BUkVBX1JFUVVJUkVEID0gJ0VudGVyIGNhcnBldCBhcmVhJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19FUlJPUl9WQUxJREFUSU9OX1BBUktJTkdfQVJFQV9SRVFVSVJFRCAgPSAnRW50ZXIgcGFya2luZyBhcmVhJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19FUlJPUl9WQUxJREFUSU9OX1NBTEVCTEVfQVJFQV9SRVFVSVJFRCAgPSAnRW50ZXIgc2FsZWFibGUgYXJlYSc7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfRVJST1JfVkFMSURBVElPTl9QTElOVEhfQVJFQV9SRVFVSVJFRCAgPSAnRW50ZXIgcGxpbnRoIGFyZWEnO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0VSUk9SX1ZBTElEQVRJT05fTk9fT0ZfRkxPT1JTX1JFUVVJUkVEICA9ICdFbnRlciBuby4gb2YgZmxvb3JzJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19FUlJPUl9WQUxJREFUSU9OX05PX09GX1BBUktJTkdfRkxPT1JTX1JFUVVJUkVEICA9ICdFbnRlciBuby4gb2YgcGFya2luZyBmbG9vcnMnO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0VSUk9SX1ZBTElEQVRJT05fQ0FSUEVUX0FSRUFfT0ZfUEFSS0lOR19SRVFVSVJFRCAgPSAnRW50ZXIgY2FycGV0IGFyZWEgb2YgcGFya2luZyBmbG9vcnMnO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0VSUk9SX1ZBTElEQVRJT05fT05FX0JIS19SRVFVSVJFRCA9ICdFbnRlciBuby4gb2Ygb25lIEJIS3MnO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0VSUk9SX1ZBTElEQVRJT05fVFdPX0JIS19SRVFVSVJFRCA9ICdFbnRlciBuby4gb2YgdHdvIEJIS3MnO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0VSUk9SX1ZBTElEQVRJT05fVEhSRUVfQkhLX1JFUVVJUkVEID0gJ0VudGVyIG5vLiBvZiB0aHJlZSBCSEtzJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19FUlJPUl9WQUxJREFUSU9OX05PX09GX1NMQUJTX1JFUVVJUkVEID0gJ0VudGVyIG5vLiBvZiBzbGFicyc7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfRVJST1JfVkFMSURBVElPTl9OT19PRl9MSUZUU19SRVFVSVJFRCA9ICdFbnRlciBuby4gb2YgbGlmdHMnO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0VSUk9SX1ZBTElEQVRJT05fQUxQSEFCQVRFUyA9ICdFbnRlciBhbHBoYWJhdGVzIG9ubHknO1xyXG5cclxuICBwdWJsaWMgc3RhdGljIE1TR19FUlJPUl9WQUxJREFUSU9OX0FERF9BVF9MRUFTVF9PTkVfQVBBUlRNRU5UX0NPTkZJR1VSQVRJT04gPSAnQWRkIGF0IGxlYXN0IG9uZSBBcGFydG1lbnQgQ29uZmlndXJhdGlvbic7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfRVJST1JfVkFMSURBVElPTl9OVU1CRVJfT0ZfRkxPT1JTID0gJ1RvdGFsIG51bWJlciBvZiBmbG9vcnMgc2hvdWxkIGJlIG1vcmUgdGhhbiBudW1iZXIgb2YgcGFya2luZyBmbG9vcnMnO1xyXG5cclxuXHJcbiAgcHVibGljIHN0YXRpYyBNU0dfUkVTRVRfTU9CSUxFX05VTUJFUiA9ICdFbnRlciB5b3VyIG5ldyBtb2JpbGUgbnVtYmVyIGFuZCB3ZSB3aWxsIHNlbmQgeW91IGEgdmVyaWZpY2F0aW9uIGNvZGUgb24gbW9iaWxlJyArXHJcbiAgICAnIG51bWJlciB5b3UgaGF2ZSBlbnRlcmVkLic7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfUkVTRVRfRU1BSUxfQUREUkVTUyA9ICdFbnRlciB5b3VyIG5ldyBhY2NvdW50IGVtYWlsIGFkZHJlc3MgYW5kIHdlIHdpbGwgc2VuZCB5b3UgYSBsaW5rIHRvIHJlc2V0IHlvdXIgZW1haWwnICtcclxuICAgICdhZGRyZXNzLic7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfRU1BSUxfQUNUSVZBVElPTiA9ICdZb3VyIGVtYWlsIGhhcyBiZWVuIGFjdGl2YXRlZC4gWW91IG1heSBzdGFydCB1c2luZyB5b3VyIGFjY291bnQgd2l0aCBuZXcgZW1haWwgYWRkcmVzcycgK1xyXG4gICAgJ2ltbWVkaWF0ZWx5Lic7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfQ09OVEFDVF9VUyA9ICdQbGVhc2UgcHJvdmlkZSB0aGUgZm9sbG93aW5nIGRldGFpbHMgYW5kIHdlIHdpbGwgZ2V0IGJhY2sgdG8geW91IHNvb24uJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19ZRUFSX05PX01BVENIX0ZPVU5EID0gJ1RoZSB5ZWFyIGRvZXNuXFwndCBsb29rIHJpZ2h0LiBCZSBzdXJlIHRvIHVzZSB5b3VyIGFjdHVhbCB5ZWFyIG9mIGJpcnRoLic7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfRk9SR09UX1BBU1NXT1JEID0gJ0VudGVyIHlvdXIgZS1tYWlsIGFkZHJlc3MgYmVsb3cgYW5kIHdlXFwnbGwgZ2V0IHlvdSBiYWNrIG9uIHRyYWNrLic7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfQ09ORklSTV9QQVNTV09SRCA9ICdQYXNzd29yZHMgYXJlIG5vdCBtYXRjaGluZy4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0NIQU5HRV9QQVNTV09SRF9TVUNDRVNTID0nUGFzc3dvcmQgY2hhbmdlZCBzdWNjZXNzZnVsbHkuICcgK1xyXG4gICAgJ1lvdSBjYW4gU2lnbiBJbiBhZ2FpbiB3aXRoIG5ldyBwYXNzd29yZCBieSBjbGlja2luZyBvbiBcIllFU1wiIGJ1dHRvbiwgUGxlYXNlIGNsaWNrIG9uIFwiTm9cIiBidXR0b24gdG8gY29udGludWUgdGhlIHNlc3Npb24uJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19WRVJJRllfVVNFUl8xID0gJ1lvdSBhcmUgYWxtb3N0IGRvbmUhJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19WRVJJRllfVVNFUl8yID0gJ1dlIG5lZWQgdG8gdmVyaWZ5IHlvdXIgbW9iaWxlIG51bWJlciBiZWZvcmUgeW91IGNhbiBzdGFydCB1c2luZyB0aGUgc3lzdGVtLic7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfVkVSSUZZX1VTRVJfMyA9ICdPbmUgVGltZSBQYXNzd29yZChPVFApIHdpbGwgYmUgc2VudCBvbiBmb2xsb3dpbmcgbW9iaWxlIG51bWJlci4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX1ZFUklGWV9VU0VSXzQgPSAnWW91IGFyZSBhbG1vc3QgZG9uZSEgV2UgbmVlZCB0byB2ZXJpZnkgeW91ciBlbWFpbCBpZCBiZWZvcmUgeW91IGNhbiBzdGFydCB1c2luZyB0aGUgc3lzdGVtLic7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfRU1BSUxfTk9UX01BVENIID0gJ0UtbWFpbCBkb2VzIG5vdCBtYXRjaC4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0NIQU5HRV9QQVNTV09SRCA9ICdZb3VyIHBhc3N3b3JkIHByb3RlY3RzIHlvdXIgYWNjb3VudCBzbyBwYXNzd29yZCBtdXN0IGJlIHN0cm9uZy4nICtcclxuICAgICdDaGFuZ2luZyB5b3VyIHBhc3N3b3JkIHdpbGwgc2lnbiB5b3Ugb3V0IG9mIGFsbCB5b3VyIGRldmljZXMsIGluY2x1ZGluZyB5b3VyIHBob25lLicgK1xyXG4gICAgJ1lvdSB3aWxsIG5lZWQgdG8gZW50ZXIgeW91ciBuZXcgcGFzc3dvcmQgb24gYWxsIHlvdXIgZGV2aWNlcy4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX01PQklMRV9OVU1CRVJfTk9UX01BVENIID0gJ01vYmlsZSBOdW1iZXIgZG9lcyBub3QgbWF0Y2guJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19NT0JJTEVfTlVNQkVSX0NoYW5nZV9TVUNDRVNTID0gJ01vYmlsZSBudW1iZXIgY2hhbmdlZCBzdWNjZXNzZnVsbHkuWW91IGNhbiBTaWduIEluIGFnYWluIGJ5IGNsaWNraW5nIG9uIFwieWVzXCIgYnV0dG9uLCcgK1xyXG4gICAgJyBwbGVhc2UgY2xpY2sgb24gXCJOb1wiIGJ1dHRvbiB0byBjb250aW51ZSB0aGUgc2Vzc2lvbi4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX01PQklMRV9WRVJJRklDQVRJT05fVElUTEUgPSAnVmVyaWZ5IFlvdXIgTW9iaWxlIE51bWJlcic7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfTU9CSUxFX05VTUJFUl9DSEFOR0VfVkVSSUZJQ0FUSU9OX1RJVExFID0gJ1ZlcmlmeSBZb3VyICBOZXcgTW9iaWxlIE51bWJlcic7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfTU9CSUxFX1ZFUklGSUNBVElPTl9NRVNTQUdFID0gJ1BsZWFzZSBlbnRlciB0aGUgdmVyaWZpY2F0aW9uIGNvZGUgc2VudCB0byB5b3VyIG1vYmlsZSBudW1iZXIuJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19NT0JJTEVfTlVNQkVSX0NIQU5HRV9WRVJJRklDQVRJT05fTUVTU0FHRSA9ICdQbGVhc2UgZW50ZXIgdGhlIHZlcmlmaWNhdGlvbiBjb2RlIHNlbnQgdG8geW91ciBuZXcgbW9iaWxlIG51bWJlci4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgQ09OVEFDVF9VU19BRERSRVNTID0gJ0Jsb2cuIE5vLiAxNCwgMXN0IEZsb29yLCBFbGVjdHJvbmljIEVzdGF0ZSwgUGFydmF0aSwgUHVuZS1TYXRhcmEgUm9hZCwgUHVuZSA0MTEwMDksIE1ILCBJTkRJQS4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgQ09OVEFDVF9VU19DT05UQUNUX05VTUJFUl8xID0gJys5MSAoMjApIDI0MjEgODg2NSc7XHJcbiAgcHVibGljIHN0YXRpYyBDT05UQUNUX1VTX0NPTlRBQ1RfTlVNQkVSXzIgPSAnKzkxIDk4MjMzIDE4ODY1JztcclxuICBwdWJsaWMgc3RhdGljIENPTlRBQ1RfVVNfRU1BSUxfMSA9ICdzYWxlc0B0ZWNocHJpbWVsYWIuY29tJztcclxuICBwdWJsaWMgc3RhdGljIENPTlRBQ1RfVVNfRU1BSUxfMiA9ICdjYXJlZXJzQHRlY2hwcmltZWxhYi5jb20nO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0VNQUlMX1ZFUklGSUNBVElPTl9IRUFESU5HID0gJ1lvdXIgZW1haWwgaXMgdXBkYXRlZCBzdWNjZXNzZnVsbHkuJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19FTUFJTF9WRVJJRklDQVRJT05fTUVTU0FHRSA9ICdLaW5kbHkgY2xpY2sgb24gU0lHTiBJTiB0byB1c2UgQnVpbGRJbmZvLic7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfQUNUSVZBVEVfVVNFUl9IRUFESU5HID0gJ0NvbmdyYXR1bGF0aW9ucyEgV2VsY29tZSBUbyBCdWlsZEluZm8uJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19BQ1RJVkFURV9VU0VSX1NVQl9IRUFESU5HID0gJ1lvdSBjYW4gbm93IGZpbmQgY2FuZGlkYXRlcyB1c2luZyB0aGUgaGlnaGx5IGFjY3VyYXRlLCcgK1xyXG4gICAgJyBzaW1wbGVyLCBmYXN0ZXIgYW5kIHBvd2VyZnVsIHNvbHV0aW9uLic7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfQUNUSVZBVEVfVVNFUl9NRVNTQUdFID0gJ1lvdXIgYWNjb3VudCBoYXMgYmVlbiBjcmVhdGVkIHN1Y2Nlc3NmdWxseS4gS2luZGx5IGNsaWNrIFNpZ24gSW4uJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19BQk9VVF9VU19ESVNDUklQVElPTiA9ICdMb3JlbSBJcHN1bSBpcyBzaW1wbHkgZHVtbXkgdGV4dCBvZiB0aGUgcHJpbnRpbmcgYW5kIHR5cGVzZXR0aW5nIGluZHVzdHJ5LicgK1xyXG4gICAgJ0xvcmVtIElwc3VtIGhhcyBiZWVuIHRoZSBpbmR1c3RyeVxcJ3Mgc3RhbmRhcmQgZHVtbXkgdGV4dCBldmVyIHNpbmNlIHRoZSAxNTAwcycgK1xyXG4gICAgJ3doZW4gYW4gdW5rbm93biBwcmludGVyIHRvb2sgYSBnYWxsZXkgb2YgdHlwZSBhbmQgc2NyYW1ibGVkIGl0IHRvIG1ha2UgYSB0eXBlIHNwZWNpbWVuIGJvb2suJyArXHJcbiAgICAnSXQgaGFzIHN1cnZpdmVkIG5vdCBvbmx5IGZpdmUgY2VudHVyaWVzLCBidXQgYWxzbyB0aGUgbGVhcCBpbnRvIGVsZWN0cm9uaWMgdHlwZXNldHRpbmcscmVtYWluaW5nIGVzc2VudGlhbGx5ICcgK1xyXG4gICAgJ3VuY2hhbmdlZC4gJyArXHJcbiAgICAnSXQgd2FzIHBvcHVsYXJpc2VkIGluIHRoZSAxOTYwcyB3aXRoIHRoZSByZWxlYXNlIG9mIExldHJhc2V0IHNoZWV0cyBjb250YWluaW5nIExvcmVtIElwc3VtIHBhc3NhZ2VzLCcgK1xyXG4gICAgJ2FuZCBtb3JlIHJlY2VudGx5IHdpdGggZGVza3RvcCBwdWJsaXNoaW5nIHNvZnR3YXJlIGxpa2UgQWxkdXMgUGFnZU1ha2VyIGluY2x1ZGluZyB2ZXJzaW9ucyBvZiBMb3JlbSBJcHN1bS4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgR1VJREVfTUVTU0FHRV9GT1JfTkVXX1ZJRVdFUiA9ICdUaGFuayB5b3UgZm9yIHNob3dpbmcgaW50ZXJlc3QsICcgK1xyXG4gICAgJ3dlIHdpbGwgbmVlZCB5b3VyIGJhc2ljIGluZm9ybWF0aW9uIHRvIGNyZWF0ZSB5b3VyIHZhbHVlIHBvcnRyYWl0IG9uIEJ1aWxkSW5mby4gR28gYWhlYWQsICcgK1xyXG4gICAgJ2ZpbGwgdGhlIGZvcm0gYW5kIGdldCB5b3VyIHZhbHVlIHBvcnRyYWl0ISc7XHJcbiAgcHVibGljIHN0YXRpYyBOT1RfRk9VTkRfSU5GT1JNQVRJT04gPSAnVGhlIHBhZ2UgeW91IGFyZSBsb29raW5nIGZvciBkb2VzblxcJ3QgZXhpc3Q8YnIvPicgK1xyXG4gICAgJ29yIGFuIG90aGVyIGVycm9yIG9jb3VycmVkLic7XHJcblxyXG4gIC8vQXBwbGljYXRpb24gU3VjY2VzcyBNZXNzYWdlc1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX1NVQ0NFU1NfUFJPSkVDVF9DUkVBVElPTjogc3RyaW5nID0gJ1Byb2plY3QgaGFzIGJlZW4gY3JlYXRlZCBzdWNjZXNzZnVsbHkuJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19TVUNDRVNTX0FERF9CVUlMRElOR19QUk9KRUNUOiBzdHJpbmcgPSAnQnVpbGRpbmcgaGFzIGJlZW4gc3VjY2Vzc2Z1bGx5IGFkZGVkIHRvIHByb2plY3QuXFxuJyArXHJcbiAgICAnUGxlYXNlIHdhaXQgd2hpbGUgd2UgYXJlIHN5bmNoaW5nIGRhdGEgZnJvbSByYXRlIGFuYWx5c2lzLic7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfU1VDQ0VTU19DTE9ORURfQlVJTERJTkdfREVUQUlMUzogc3RyaW5nID0gJ1lvdXIgYnVpbGRpbmcgY2xvbmVkIHN1Y2Nlc3NmdWxseS4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX1NVQ0NFU1NfVVBEQVRFX1BST0pFQ1RfREVUQUlMUzogc3RyaW5nID0gJ1lvdXIgcHJvamVjdCB1cGRhdGVkIHN1Y2Nlc3NmdWxseS4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX1NVQ0NFU1NfVVBEQVRFX0JVSUxESU5HX0RFVEFJTFM6IHN0cmluZyA9ICdZb3VyIGJ1aWxkaW5nIGRldGFpbHMgdXBkYXRlZCBzdWNjZXNzZnVsbHkuJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19TVUNDRVNTX0RFTEVURV9CVUlMRElORzogc3RyaW5nID0gJ0J1aWxkaW5nIGRlbGV0ZWQgc3VjY2Vzc2Z1bGx5Lic7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfU1VDQ0VTU19BRERfQ09TVEhFQUQ6IHN0cmluZyA9ICdDb3N0aGVhZCBhZGRlZCBzdWNjZXNzZnVsbHkuJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19TVUNDRVNTX0RFTEVURV9DT1NUSEVBRDogc3RyaW5nID0gJ0Nvc3RoZWFkIGRlbGV0ZWQgc3VjY2Vzc2Z1bGx5Lic7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfU1VDQ0VTU19ERUxFVEVfSVRFTTogc3RyaW5nID0gJ1lvdXIgaXRlbSBkZWxldGVkIHN1Y2Nlc3NmdWxseS4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX1NVQ0NFU1NfVVBEQVRFX1JBVEU6IHN0cmluZyA9ICdSYXRlIHVwZGF0ZWQuJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19RVUFOVElUWV9TSE9VTERfTk9UX1pFUk9fT1JfTlVMTDogc3RyaW5nID0gJ1F1YW50aXR5IHNob3VsZCBub3QgemVybyBvciBudWxsLic7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfU1VDQ0VTU19TQVZFRF9DT1NUX0hFQURfSVRFTTogc3RyaW5nID0gJ1lvdXIgY29zdCBoZWFkIGl0ZW1zIHVwZGF0ZWQgc3VjY2Vzc2Z1bGx5Lic7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfU1VDQ0VTU19TQVZFRF9DT1NUX0hFQURfSVRFTV9FUlJPUjogc3RyaW5nID0gJ1RoZXJlIGlzIGVycm9yIGluIG9wZXJhdGlvbic7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfU1VDQ0VTU19BRERfQ0FURUdPUlk6IHN0cmluZyA9ICdDYXRlZ29yeSBhZGRlZCBzdWNjZXNzZnVsbHkuJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19TVUNDRVNTX0RFTEVURV9DQVRFR09SWTogc3RyaW5nID0gJ0NhdGVnb3J5IGRlbGV0ZWQgc3VjY2Vzc2Z1bGx5Lic7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfU1VDQ0VTU19ERUxFVEVfUVVBTlRJVFlfSVRFTTogc3RyaW5nID0gJ1F1YW50aXR5IGl0ZW0gZGVsZXRlZCBzdWNjZXNzZnVsbHkuJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19TVUNDRVNTX0RFTEVURV9RVUFOVElUWV9ERVRBSUxTOiBzdHJpbmcgPSAnUXVhbnRpdHkgRGV0YWlscyBkZWxldGVkIHN1Y2Nlc3NmdWxseS4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0FMUkVBRFlfQURERURfQUxMX0NBVEVHT1JJRVM6IHN0cmluZyA9ICdBbHJlYWR5IGFkZGVkIGFsbCBDYXRlZ29yaWVzLic7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfU1VDQ0VTU19BRERfV09SS0lURU06IHN0cmluZyA9ICdXb3JraXRlbSBhZGRlZCBzdWNjZXNzZnVsbHkuJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19BTFJFQURZX0FEREVEX0FMTF9XT1JLSVRFTVM6IHN0cmluZyA9ICdBbHJlYWR5IGFkZGVkIGFsbCB3b3JraXRlbXMuJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19TVUNDRVNTX0RFTEVURV9XT1JLSVRFTTogc3RyaW5nID0gJ1lvdXIgd29ya2l0ZW0gZGVsZXRlZCBzdWNjZXNzZnVsbHkuJztcclxuICBwdWJsaWMgc3RhdGljIE1TR19TVUNDRVNTX1VQREFURV9USFVNQlJVTEVfUkFURV9DT1NUSEVBRDogc3RyaW5nID0gJ1RodW1icnVsZSByYXRlIGZvciBDb3N0SGVhZCB1cGRhdGVkIHN1Y2Nlc3NmdWxseS4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX1NVQ0NFU1NfVVBEQVRFX0RJUkVDVF9RVUFOVElUWV9PRl9XT1JLSVRFTSA6IHN0cmluZyA9ICdEaXJlY3QgcXVhbnRpdHkgZm9yIHdvcmtpdGVtIHVwZGF0ZWQgc3VjY2Vzc2Z1bGx5Lic7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfU1VDQ0VTU19VUERBVEVfRElSRUNUX1JBVEVfT0ZfV09SS0lURU0gOiBzdHJpbmcgPSAnRGlyZWN0IHJhdGUgZm9yIHdvcmtpdGVtIHVwZGF0ZWQgc3VjY2Vzc2Z1bGx5Lic7XHJcblxyXG4gIC8vUXVhbnRpdHkgdmlldyByZXF1aXJlZCBmaWVsZHNcclxuICBwdWJsaWMgc3RhdGljIE1TR19FUlJPUl9WQUxJREFUSU9OX1FVQU5USVRZX0lURU1fUkVRVUlSRUQgPSAnRW50ZXIgaXRlbSc7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfRVJST1JfVkFMSURBVElPTl9RVUFOVElUWV9OVU1CRVJTX1JFUVVJUkVEID0gJ0VudGVyIG51bWJlcnMnO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0VSUk9SX1ZBTElEQVRJT05fUVVBTlRJVFlfTEVOR1RIX1JFUVVJUkVEID0gJ0VudGVyIGxlbmd0aCc7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfRVJST1JfVkFMSURBVElPTl9RVUFOVElUWV9CUkVBRFRIX1JFUVVJUkVEID0gJ0VudGVyIGJyZWFkdGgnO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0VSUk9SX1ZBTElEQVRJT05fUVVBTlRJVFlfSEVJR0hUX1JFUVVJUkVEID0gJ0VudGVyIGhlaWdodCc7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfRVJST1JfVkFMSURBVElPTl9RVUFOVElUWV9RVUFOVElUWV9SRVFVSVJFRCA9ICdFbnRlciBxdWFudGl0eSc7XHJcbiAgcHVibGljIHN0YXRpYyBNU0dfRVJST1JfVkFMSURBVElPTl9RVUFOVElUWV9VTklUX1JFUVVJUkVEID0gJ0VudGVyIHVuaXQnO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0VSUk9SX1ZBTElEQVRJT05fUVVBTlRJVFlfUkVRVUlSRUQgPSAnRmllbGRzIGNhbiBub3QgYmUgZW1wdHknO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVNHX0VSUk9SX1ZBTElEQVRJT05fUVVBTlRJVFlfTkFNRV9SRVFVSVJFRCA9ICdRdWFudGl0eSBkZXRhaWxzIG5hbWUgaXMgcmVxdWlyZWQnO1xyXG4gIHB1YmxpYyBzdGF0aWMgTE9HSU5fSU5GTzogc3RyaW5nID0gJ0VudGVyIHlvdXIgZGV0YWlscyBiZWxvdyc7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBOYXZpZ2F0aW9uUm91dGVzIHtcclxuXHJcbiAgcHVibGljIHN0YXRpYyBBUFBfUkVHSVNUUkFUSU9OOiBzdHJpbmcgPSAnL3JlZ2lzdHJhdGlvbic7XHJcbiAgcHVibGljIHN0YXRpYyBBUFBfRk9SR09UUEFTU1dPUkQ6IHN0cmluZyA9ICcvZm9yZ290LXBhc3N3b3JkJztcclxuICBwdWJsaWMgc3RhdGljIEFQUF9QUk9KRUNUOiBzdHJpbmcgPSAnL3Byb2plY3QnO1xyXG4gIHB1YmxpYyBzdGF0aWMgQVBQX0JVSUxESU5HOiBzdHJpbmcgPSAnYnVpbGRpbmcnO1xyXG4gIHB1YmxpYyBzdGF0aWMgQVBQX0NSRUFURV9ORVdfUFJPSkVDVDogc3RyaW5nID0gJy9jcmVhdGUtbmV3LXByb2plY3QnO1xyXG4gIHB1YmxpYyBzdGF0aWMgQVBQX0NSRUFURV9QUk9KRUNUOiBzdHJpbmcgPSAnL2NyZWF0ZS1wcm9qZWN0JztcclxuICBwdWJsaWMgc3RhdGljIEFQUF9WSUVXX0JVSUxESU5HX0RFVEFJTFM6IHN0cmluZyA9ICdidWlsZGluZy9kZXRhaWxzJztcclxuICBwdWJsaWMgc3RhdGljIEFQUF9DUkVBVEVfQlVJTERJTkc6IHN0cmluZyA9ICcvY3JlYXRlLWJ1aWxkaW5nJztcclxuICBwdWJsaWMgc3RhdGljIEFQUF9MSVNUX1BST0pFQ1Q6IHN0cmluZyA9ICdwcm9qZWN0L2xpc3QnO1xyXG4gIHB1YmxpYyBzdGF0aWMgQVBQX0NPU1RfU1VNTUFSWTogc3RyaW5nID0gJ2Nvc3Qtc3VtbWFyeSc7XHJcbiAgcHVibGljIHN0YXRpYyBBUFBfQ09TVF9IRUFEOiBzdHJpbmcgPSAnY29zdC1oZWFkJztcclxuICBwdWJsaWMgc3RhdGljIEFQUF9DQVRFR09SWTogc3RyaW5nID0gJ2NhdGVnb3J5JztcclxuICBwdWJsaWMgc3RhdGljIEFQUF9DT01NT05fQU1FTklUSUVTID0gJ2NvbW1vbi1hbWVuaXRpZXMnO1xyXG4gIHB1YmxpYyBzdGF0aWMgQVBQX0RBU0hCT0FSRDogc3RyaW5nID0gJy9kYXNoYm9hcmQnO1xyXG4gIHB1YmxpYyBzdGF0aWMgQVBQX0xPR0lOOiBzdHJpbmcgPSAnL3NpZ25pbic7XHJcbiAgcHVibGljIHN0YXRpYyBBUFBfU1RBUlQ6IHN0cmluZyA9ICcvJztcclxuICBwdWJsaWMgc3RhdGljIFZFUklGWV9QSE9ORTogc3RyaW5nID0gJy92ZXJpZnktcGhvbmUnO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU2Vzc2lvblN0b3JhZ2Uge1xyXG5cclxuICBwdWJsaWMgc3RhdGljIEFDQ0VTU19UT0tFTiA9ICdhY2Nlc3NfdG9rZW4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgSVNfU09DSUFMX0xPR0lOID0gJ2lzX3NvY2lhbF9sb2dpbic7XHJcbiAgcHVibGljIHN0YXRpYyBQUk9GSUxFX1BJQ1RVUkUgPSAncHJvZmlsZV9waWN0dXJlJztcclxuICBwdWJsaWMgc3RhdGljIElTX0xPR0dFRF9JTiA9ICdpc191c2VyX2xvZ2dlZF9pbic7XHJcbiAgcHVibGljIHN0YXRpYyBJU19VU0VSX1NJR05fSU4gPSAnaXNfdXNlcl9yZWdpc3Rlcic7XHJcbiAgcHVibGljIHN0YXRpYyBDVVJSRU5UX1ZJRVcgPSAnY3VycmVudF92aWV3JztcclxuICBwdWJsaWMgc3RhdGljIFVTRVJfSUQgPSAndXNlcl9pZCc7XHJcbiAgcHVibGljIHN0YXRpYyBNT0JJTEVfTlVNQkVSID0gJ21vYmlsZV9udW1iZXInO1xyXG4gIHB1YmxpYyBzdGF0aWMgVkVSSUZJRURfTU9CSUxFX05VTUJFUiA9ICd2ZXJpZmllZF9tb2JpbGVfbnVtYmVyJztcclxuICBwdWJsaWMgc3RhdGljIEZJUlNUX05BTUUgPSAnZmlyc3RfbmFtZSc7XHJcbiAgcHVibGljIHN0YXRpYyBMQVNUX05BTUUgPSAnbGFzdF9uYW1lJztcclxuICBwdWJsaWMgc3RhdGljIEVNQUlMX0lEID0gJ2VtYWlsX2lkJztcclxuICBwdWJsaWMgc3RhdGljIFBBU1NXT1JEID0gJ3Bhc3N3b3JkJztcclxuICBwdWJsaWMgc3RhdGljIE1ZX1RIRU1FID0gJ215X3RoZW1lJztcclxuICBwdWJsaWMgc3RhdGljIFZFUklGWV9QSE9ORV9WQUxVRSA9ICd2ZXJpZnlfcGhvbmVfdmFsdWUnO1xyXG4gIHB1YmxpYyBzdGF0aWMgQ0hBTkdFX01BSUxfVkFMVUUgPSAnY2hhbmdlX21haWxfdmFsdWUnO1xyXG4gIHB1YmxpYyBzdGF0aWMgQ1VSUkVOVF9QUk9KRUNUX0lEID0gJ2N1cnJlbnRfcHJvamVjdF9pZCc7XHJcbiAgcHVibGljIHN0YXRpYyBDVVJSRU5UX1BST0pFQ1RfTkFNRSA9ICdjdXJyZW50X3Byb2plY3RfbmFtZSc7XHJcbiAgcHVibGljIHN0YXRpYyBDVVJSRU5UX0JVSUxESU5HID0gJ2N1cnJlbnRfYnVpbGRpbmdfaWQnO1xyXG4gIHB1YmxpYyBzdGF0aWMgQ1VSUkVOVF9DT1NUX0hFQURfSUQgPSAnY3VycmVudF9jb3N0X2hlYWRfaWQnO1xyXG4gIHB1YmxpYyBzdGF0aWMgQ1VSUkVOVF9XT1JLSVRFTV9JRCA9ICdjdXJyZW50X3dvcmtpdGVtX2lkJztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIExvY2FsU3RvcmFnZSB7XHJcbiAgcHVibGljIHN0YXRpYyBBQ0NFU1NfVE9LRU4gPSAnYWNjZXNzX3Rva2VuJztcclxuICBwdWJsaWMgc3RhdGljIElTX0xPR0dFRF9JTiA9ICdpc191c2VyX2xvZ2dlZF9pbic7XHJcbiAgcHVibGljIHN0YXRpYyBGSVJTVF9OQU1FID0gJ2ZpcnN0X25hbWUnO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQVBJIHtcclxuXHJcbiAgcHVibGljIHN0YXRpYyBOT1RJRklDQVRJT04gPSAnbm90aWZpY2F0aW9uJztcclxuICBwdWJsaWMgc3RhdGljIFNFTkRfTk9USUZJQ0FUSU9OX1RPX1JFQ1JVSVRFUiA9ICdub3RpZnlfcmVjcnVpdGVyJztcclxuICBwdWJsaWMgc3RhdGljIFNFTkRfTUFJTCA9ICdzZW5kbWFpbCc7XHJcbiAgcHVibGljIHN0YXRpYyBTRU5EX1RPX0FETUlOX01BSUwgPSAnc2VuZG1haWx0b2FkbWluJztcclxuICBwdWJsaWMgc3RhdGljIFVTRVJfUFJPRklMRSA9ICd1c2VyJztcclxuICBwdWJsaWMgc3RhdGljIENBTkRJREFURV9QUk9GSUxFID0gJ3VzZXInO1xyXG4gIHB1YmxpYyBzdGF0aWMgVVNFUl9EQVRBID0gJ3VzZXJEYXRhJztcclxuICBwdWJsaWMgc3RhdGljIExPR0lOID0gJ3VzZXIvbG9naW4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgRkJfTE9HSU4gPSAnZmJMb2dpbic7XHJcbiAgcHVibGljIHN0YXRpYyBDSEFOR0VfUEFTU1dPUkQgPSAndXNlci9jaGFuZ2UvcGFzc3dvcmQnO1xyXG4gIHB1YmxpYyBzdGF0aWMgQ0hBTkdFX01PQklMRSA9ICd1c2VyL2NoYW5nZS9tb2JpbGVOdW1iZXInO1xyXG4gIHB1YmxpYyBzdGF0aWMgQ0hBTkdFX0VNQUlMID0gJ3VzZXIvY2hhbmdlL2VtYWlsSWQnO1xyXG4gIHB1YmxpYyBzdGF0aWMgQ0hBTkdFX0NPTVBBTllfQUNDT1VOVF9ERVRBSUxTID0gJ2NoYW5nZXJlY3J1aXRlcmFjY291bnRkZXRhaWxzJztcclxuICBwdWJsaWMgc3RhdGljIFZFUklGWV9DSEFOR0VEX0VNQUlMID0gJ3VzZXIvdmVyaWZ5L2NoYW5nZWRFbWFpbElkJztcclxuICBwdWJsaWMgc3RhdGljIFZFUklGWV9FTUFJTCA9ICd1c2VyL3ZlcmlmeUVtYWlsJztcclxuICBwdWJsaWMgc3RhdGljIEdFTkVSQVRFX09UUCA9ICd1c2VyL2dlbmVyYXRlb3RwJztcclxuICBwdWJsaWMgc3RhdGljIFZFUklGWV9PVFAgPSAndXNlci92ZXJpZnkvb3RwJztcclxuICBwdWJsaWMgc3RhdGljIFZFUklGWV9NT0JJTEUgPSAndXNlci92ZXJpZnkvbW9iaWxlTnVtYmVyJztcclxuICBwdWJsaWMgc3RhdGljIFNFTkRfVkVSSUZJQ0FUSU9OX01BSUwgPSAnc2VuZHZlcmlmaWNhdGlvbm1haWwnO1xyXG4gIHB1YmxpYyBzdGF0aWMgRk9SR09UX1BBU1NXT1JEID0gJ3VzZXIvZm9yZ290cGFzc3dvcmQnO1xyXG4gIHB1YmxpYyBzdGF0aWMgVVBEQVRFX1BJQ1RVUkUgPSAndXNlci91cGRhdGVwaWN0dXJlJztcclxuICBwdWJsaWMgc3RhdGljIENIQU5HRV9USEVNRSA9ICdjaGFuZ2V0aGVtZSc7XHJcbiAgcHVibGljIHN0YXRpYyBSRVNFVF9QQVNTV09SRCA9ICd1c2VyL3Jlc2V0cGFzc3dvcmQnO1xyXG4gIHB1YmxpYyBzdGF0aWMgR09PR0xFX0xPR0lOID0gJ2dvb2dsZWxvZ2luJztcclxuXHJcbiAgLy9Qcm9qZWN0XHJcbiAgcHVibGljIHN0YXRpYyBVU0VSX0FMTF9QUk9KRUNUUyA9ICd1c2VyL2FsbC9wcm9qZWN0JztcclxuICBwdWJsaWMgc3RhdGljIFBST0pFQ1QgPSAncHJvamVjdCc7XHJcbiAgcHVibGljIHN0YXRpYyBCVUlMRElORyA9ICdidWlsZGluZyc7XHJcbiAgcHVibGljIHN0YXRpYyBDT1NUSEVBRCA9ICdjb3N0aGVhZCc7XHJcbiAgcHVibGljIHN0YXRpYyBDT01NT05fQU1FTklUSUVTID0gJ2NvbW1vbi1hbWVuaXRpZXMnO1xyXG4gIHB1YmxpYyBzdGF0aWMgQUNUSVZFX1NUQVRVUyA9ICdhY3RpdmVTdGF0dXMnO1xyXG4gIHB1YmxpYyBzdGF0aWMgQUNUSVZFX1NUQVRVU19GQUxTRSA9ICdmYWxzZSc7XHJcbiAgcHVibGljIHN0YXRpYyBBQ1RJVkVfU1RBVFVTX1RSVUUgPSAndHJ1ZSc7XHJcbiAgcHVibGljIHN0YXRpYyBDTE9ORSA9ICdjbG9uZSc7XHJcbiAgcHVibGljIHN0YXRpYyBDQVRFR09SWUxJU1QgPSAnY2F0ZWdvcnlsaXN0JztcclxuICBwdWJsaWMgc3RhdGljIENBVEVHT1JZID0gJ2NhdGVnb3J5JztcclxuICBwdWJsaWMgc3RhdGljIFdPUktJVEVNID0gJ3dvcmtpdGVtJztcclxuICBwdWJsaWMgc3RhdGljIFdPUktJVEVNTElTVCA9ICd3b3JraXRlbWxpc3QnO1xyXG4gIHB1YmxpYyBzdGF0aWMgV09SS0lURU1fQUxMID0gJ3dvcmtpdGVtL2FsbCc7XHJcbiAgcHVibGljIHN0YXRpYyBRVUFOVElUWSA9ICdxdWFudGl0eSc7XHJcbiAgcHVibGljIHN0YXRpYyBJVEVNID0gJ2l0ZW0nO1xyXG4gIHB1YmxpYyBzdGF0aWMgRElSRUNUID0gJ2RpcmVjdCc7XHJcbiAgcHVibGljIHN0YXRpYyBTWU5DX1JBVEVfQU5BTFlTSVMgPSAnc3luY1dpdGhSYXRlQW5hbHlzaXMnO1xyXG5cclxuICBwdWJsaWMgc3RhdGljIFRIVU1CUlVMRV9SVUxFX1JBVEU9J3JlcG9ydC90aHVtYlJ1bGVSYXRlJztcclxuICBwdWJsaWMgc3RhdGljIFJBVEU9J3JhdGUnO1xyXG4gIHB1YmxpYyBzdGF0aWMgUkFURVM9J3JhdGVzJztcclxuICBwdWJsaWMgc3RhdGljIFJBVEVfSVRFTT0ncmF0ZUl0ZW0nO1xyXG4gIHB1YmxpYyBzdGF0aWMgU1FGVD0nc3FmdCc7XHJcbiAgcHVibGljIHN0YXRpYyBTUU09J3NxbXQnO1xyXG4gIHB1YmxpYyBzdGF0aWMgUlNfUEVSX1NRRlQgPSAnUnMvU3FmdCc7XHJcbiAgcHVibGljIHN0YXRpYyBSU19QRVJfU1FNVCA9ICdScy9TcW10JztcclxuICBwdWJsaWMgc3RhdGljIEFSRUE9J2FyZWEnO1xyXG4gIHB1YmxpYyBzdGF0aWMgU0xBQl9BUkVBPSdzbGFiQXJlYSc7XHJcbiAgcHVibGljIHN0YXRpYyBTQUxFQUJMRV9BUkVBPSdzYWxlYWJsZUFyZWEnO1xyXG4gIHB1YmxpYyBzdGF0aWMgQ0FSUEVUX0FSRUE9J2NhcnBldEFyZWEnO1xyXG4gIHB1YmxpYyBzdGF0aWMgQlVER0VURURfQ09TVCA9J2J1ZGdldGVkQ29zdCc7XHJcblxyXG4gIC8vTWF0ZXJpYWwgVGFrZSBPZmZcclxuXHJcbiAgcHVibGljIHN0YXRpYyBSRVBPUlRfTUFURVJJQUxfVEFLRV9PRkYgPSdyZXBvcnQvbWF0ZXJpYWx0YWtlb2ZmJztcclxuICBwdWJsaWMgc3RhdGljIE1BVEVSSUFMX0ZJTFRFUlNfTElTVCA9J21hdGVyaWFsL2ZpbHRlcnMvbGlzdCc7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBJbWFnZVBhdGgge1xyXG4gIHB1YmxpYyBzdGF0aWMgRkFWX0lDT04gPSAnLi9hc3NldHMvZnJhbWV3b3JrL2ltYWdlcy9sb2dvL2Zhdmljb24uaWNvJztcclxuICBwdWJsaWMgc3RhdGljIEJPRFlfQkFDS0dST1VORCA9ICcuL2Fzc2V0cy9idWlsZC1pbmZvL3BhZ2VfYmFja2dyb3VuZC9wYWdlLWJnLnBuZyc7XHJcbiAgcHVibGljIHN0YXRpYyBCT0RZX0JBQ0tHUk9VTkRfVFJBTlNQQVJFTlQgPSAnLi9hc3NldHMvYnVpbGQtaW5mby9wYWdlX2JhY2tncm91bmQvcGFnZS1iZy10cmFuc3BhcmVudC5wbmcnO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVlfV0hJVEVfTE9HTyA9ICcuL2Fzc2V0cy9idWlsZC1pbmZvL2hlYWRlci9idWlsZGluZm8tbG9nby5wbmcnO1xyXG4gIHB1YmxpYyBzdGF0aWMgSEVBREVSX0xPR08gPSAnLi9hc3NldHMvYnVpbGQtaW5mby9oZWFkZXIvaGVhZGVyLWxvZ28ucG5nJztcclxuICBwdWJsaWMgc3RhdGljIE1PQklMRV9XSElURV9MT0dPID0gJy4vYXNzZXRzL2J1aWxkLWluZm8vaGVhZGVyL2J1aWxkaW5mby1sb2dvLnBuZyc7XHJcbiAgcHVibGljIHN0YXRpYyBGQUNFQk9PS19JQ09OID0gJy4vYXNzZXRzL2ZyYW1ld29yay9pbWFnZXMvZm9vdGVyL2ZiLnN2Zyc7XHJcbiAgcHVibGljIHN0YXRpYyBHT09HTEVfSUNPTiA9ICcuL2Fzc2V0cy9mcmFtZXdvcmsvaW1hZ2VzL2Zvb3Rlci9nb29nbGUtcGx1cy5zdmcnO1xyXG4gIHB1YmxpYyBzdGF0aWMgTElOS0VESU5fSUNPTiA9ICcuL2Fzc2V0cy9mcmFtZXdvcmsvaW1hZ2VzL2Zvb3Rlci9saW5rZWQtaW4uc3ZnJztcclxuICBwdWJsaWMgc3RhdGljIFBST0ZJTEVfSU1HX0lDT04gPSAnLi9hc3NldHMvZnJhbWV3b3JrL2ltYWdlcy9kYXNoYm9hcmQvZGVmYXVsdC1wcm9maWxlLnBuZyc7XHJcbiAgcHVibGljIHN0YXRpYyBDT01QQU5ZX0xPR09fSU1HX0lDT04gPSAnLi9hc3NldHMvZnJhbWV3b3JrL2ltYWdlcy9kYXNoYm9hcmQvZGVmYXVsdC1jb21wYW55LWJ1aWxkaW5mby1sb2dvLnBuZyc7XHJcbiAgcHVibGljIHN0YXRpYyBFTUFJTF9JQ09OID0gJy4vYXNzZXRzL2ZyYW1ld29yay9pbWFnZXMvaWNvbnMvZS1tYWlsLnN2Zyc7XHJcbiAgcHVibGljIHN0YXRpYyBFTUFJTF9JQ09OX0dSRVkgPSAnLi9hc3NldHMvZnJhbWV3b3JrL2ltYWdlcy9pY29ucy9lLW1haWwtZ3JleS5zdmcnO1xyXG4gIHB1YmxpYyBzdGF0aWMgTkVXX0VNQUlMX0lDT05fR1JFWSA9ICcuL2Fzc2V0cy9mcmFtZXdvcmsvaW1hZ2VzL2ljb25zL25ldy1lLW1haWwtZ3JleS5zdmcnO1xyXG4gIHB1YmxpYyBzdGF0aWMgQ09ORklSTV9FTUFJTF9JQ09OX0dSRVkgPSAnLi9hc3NldHMvZnJhbWV3b3JrL2ltYWdlcy9pY29ucy9jb25maXJtLWUtbWFpbC1ncmV5LnN2Zyc7XHJcbiAgcHVibGljIHN0YXRpYyBQQVNTV09SRF9JQ09OID0gJy4vYXNzZXRzL2ZyYW1ld29yay9pbWFnZXMvaWNvbnMvcGFzc3dvcmQuc3ZnJztcclxuICBwdWJsaWMgc3RhdGljIFBBU1NXT1JEX0lDT05fR1JFWSA9ICcuL2Fzc2V0cy9mcmFtZXdvcmsvaW1hZ2VzL2ljb25zL3Bhc3N3b3JkLWdyZXkuc3ZnJztcclxuICBwdWJsaWMgc3RhdGljIE5FV19QQVNTV09SRF9JQ09OX0dSRVkgPSAnLi9hc3NldHMvZnJhbWV3b3JrL2ltYWdlcy9pY29ucy9uZXctcGFzc3dvcmQtZ3JleS5zdmcnO1xyXG4gIHB1YmxpYyBzdGF0aWMgQ09ORklSTV9QQVNTV09SRF9JQ09OX0dSRVkgPSAnLi9hc3NldHMvZnJhbWV3b3JrL2ltYWdlcy9pY29ucy9jb25maXJtLXBhc3N3b3JkLWdyZXkuc3ZnJztcclxuICBwdWJsaWMgc3RhdGljIE1PQklMRV9JQ09OX0dSRVkgPSAnLi9hc3NldHMvZnJhbWV3b3JrL2ltYWdlcy9pY29ucy9tb2JpbGUtZ3JleS5zdmcnO1xyXG4gIHB1YmxpYyBzdGF0aWMgTkVXX01PQklMRV9JQ09OX0dSRVkgPSAnLi9hc3NldHMvZnJhbWV3b3JrL2ltYWdlcy9pY29ucy9uZXctbW9iaWxlLWdyZXkuc3ZnJztcclxuICBwdWJsaWMgc3RhdGljIENPTkZJUk1fTU9CSUxFX0lDT05fR1JFWSA9ICcuL2Fzc2V0cy9mcmFtZXdvcmsvaW1hZ2VzL2ljb25zL2NvbmZpcm0tbW9iaWxlLWdyZXkuc3ZnJztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFByb2plY3RBc3NldCB7XHJcbiAgc3RhdGljIF95ZWFyOiBEYXRlID0gbmV3IERhdGUoKTtcclxuICBzdGF0aWMgY3VycmVudFllYXIgPSBQcm9qZWN0QXNzZXQuX3llYXIuZ2V0RnVsbFllYXIoKTtcclxuICBwdWJsaWMgc3RhdGljIEFQUF9OQU1FID0gJ0Nvc3QgQ29udHJvbCc7XHJcbiAgcHVibGljIHN0YXRpYyBUQUdfTElORSA9ICdIZWxwIHlvdSB0byBkZWNpZGUgY29zdCc7XHJcbiAgcHVibGljIHN0YXRpYyBVTkRFUl9MSUNFTkVDRSA9ICfCqSAnICsgUHJvamVjdEFzc2V0LmN1cnJlbnRZZWFyICsgJyB3d3cuYnVpbGRpbmZvLmNvbSc7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBIZWFkaW5ncyB7XHJcbiAgcHVibGljIHN0YXRpYyBDSEFOR0VfUEFTU1dPUkQ6IHN0cmluZyA9ICdDaGFuZ2UgUGFzc3dvcmQnO1xyXG4gIHB1YmxpYyBzdGF0aWMgQ0hBTkdFX0VNQUlMX0hFQURJTkc6IHN0cmluZyA9ICdDaGFuZ2UgeW91ciBFbWFpbCc7XHJcbiAgcHVibGljIHN0YXRpYyBDSEFOR0VfTU9CSUxFX05VTUJFUl9IRUFESU5HOiBzdHJpbmcgPSAnQ2hhbmdlIFlvdXIgTW9iaWxlIE51bWJlcic7XHJcbiAgcHVibGljIHN0YXRpYyBSRVNFVF9QQVNTV09SRF9IRUFESU5HOiBzdHJpbmcgPSAnUkVTRVQgUEFTU1dPUkQnO1xyXG4gIHB1YmxpYyBzdGF0aWMgQ1JFQVRFX1lPVVJfRklSU1RfUFJPSkVDVDogc3RyaW5nID0gJ0NyZWF0ZSBZb3VyIEZpcnN0IFByb2plY3QnO1xyXG4gIHB1YmxpYyBzdGF0aWMgQ1JFQVRFX05FV19QUk9KRUNUOiBzdHJpbmcgPSAnQ3JlYXRlIE5ldyBQcm9qZWN0JztcclxuICBwdWJsaWMgc3RhdGljIEVESVRfQlVJTERJTkc6IHN0cmluZyA9ICdFZGl0IEJ1aWxkaW5nJztcclxuICBwdWJsaWMgc3RhdGljIExJU1RfQlVJTERJTkc6IHN0cmluZyA9ICdCdWlsZGluZ3MgTGlzdCc7XHJcbiAgcHVibGljIHN0YXRpYyBBRERfTkVXX0JVSUxESU5HOiBzdHJpbmcgPSAnQWRkIEJ1aWxkaW5nIGluIFByb2plY3QnO1xyXG4gIHB1YmxpYyBzdGF0aWMgQ09NTU9OX0RFVkVMT1BNRU5UIDogc3RyaW5nID0gJ0NvbW1vbiBEZXZlbG9wbWVudCBhbmQgQW1lbml0aWVzJztcclxuICBwdWJsaWMgc3RhdGljIEVMRUNUUklDX0lORlJBU1RSVUNUVVJFIDogc3RyaW5nID0gJ0VsZWN0cmljIEluZnJhc3RydWN0dXJlICc7XHJcbiAgcHVibGljIHN0YXRpYyBDT05TVFJVQ1RJT05fQ09TVCA6IHN0cmluZyA9ICdDb25zdHJ1Y3Rpb24gQ29zdCAoTWF0ZXJpYWwgKyBMYWJvdXIpJztcclxuICBwdWJsaWMgc3RhdGljIFFVQU5USVRZIDogc3RyaW5nID0gJ1F1YW50aXR5JztcclxuICBwdWJsaWMgc3RhdGljIENPTE9OIDogc3RyaW5nID0gJzonO1xyXG4gIHB1YmxpYyBzdGF0aWMgSVRFTSA6IHN0cmluZyA9ICdJdGVtJztcclxuICB9XHJcblxyXG5leHBvcnQgY2xhc3MgVGFibGVIZWFkaW5ncyB7XHJcbiAgcHVibGljIHN0YXRpYyBJVEVNIDogc3RyaW5nID0gJ0l0ZW0nO1xyXG4gIHB1YmxpYyBzdGF0aWMgUVVBTlRJVFkgOiBzdHJpbmcgPSAnUXR5Lic7XHJcbiAgcHVibGljIHN0YXRpYyBOVU1CRVJTIDogc3RyaW5nID0gJ05vcy4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgTEVOR1RIIDogc3RyaW5nID0gJ0xlbmd0aCc7XHJcbiAgcHVibGljIHN0YXRpYyBCUkVBRFRIIDogc3RyaW5nID0gJ0JyZWFkdGgnO1xyXG4gIHB1YmxpYyBzdGF0aWMgSEVJR0hUIDogc3RyaW5nID0gJ0hlaWdodCc7XHJcbiAgcHVibGljIHN0YXRpYyBVTklUOiBzdHJpbmcgPSAnVW5pdCc7XHJcbiAgcHVibGljIHN0YXRpYyBSQVRFQU5BTFlTSVMgOiBzdHJpbmcgPSAnUmF0ZSBBbmFseXNpcy9Vbml0JztcclxuICBwdWJsaWMgc3RhdGljIEFNT1VOVCA6IHN0cmluZyA9ICdBbW91bnQnO1xyXG4gIHB1YmxpYyBzdGF0aWMgQ09TVCA6IHN0cmluZyA9ICdDb3N0JztcclxuICBwdWJsaWMgc3RhdGljIFRPVEFMOiBzdHJpbmcgPSAnVG90YWwnO1xyXG4gIHB1YmxpYyBzdGF0aWMgREVTQ1JJUFRJT046IHN0cmluZyA9ICdEZXNjcmlwdGlvbic7XHJcbiAgcHVibGljIHN0YXRpYyBSQVRFX1BFUl9VTklUOiBzdHJpbmcgPSAnUmF0ZS9Vbml0JztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIExhYmVsIHtcclxuICBwdWJsaWMgc3RhdGljIENVUlJFTlRfUEFTU1dPUkRfTEFCRUw6IHN0cmluZyA9ICdDdXJyZW50IFBhc3N3b3JkJztcclxuICBwdWJsaWMgc3RhdGljIE5FV19QQVNTV09SRF9MQUJFTDogc3RyaW5nID0gJ05ldyBQYXNzd29yZCc7XHJcbiAgcHVibGljIHN0YXRpYyBQQVNTV09SRDogc3RyaW5nID0gJ1Bhc3N3b3JkJztcclxuICBwdWJsaWMgc3RhdGljIENPTkZJUk1fUEFTU1dPUkRfTEFCRUw6IHN0cmluZyA9ICdDb25maXJtIFBhc3N3b3JkJztcclxuICBwdWJsaWMgc3RhdGljIEZJUlNUX05BTUVfTEFCRUw6IHN0cmluZyA9ICdGaXJzdCBOYW1lJztcclxuICBwdWJsaWMgc3RhdGljIENPTVBBTllfTkFNRV9MQUJFTDogc3RyaW5nID0gJ0NvbXBhbnkgTmFtZSc7XHJcbiAgcHVibGljIHN0YXRpYyBTVEFURV9MQUJFTDogc3RyaW5nID0gJ1N0YXRlJztcclxuICBwdWJsaWMgc3RhdGljIENJVFlfTEFCRUw6IHN0cmluZyA9ICdDaXR5JztcclxuICBwdWJsaWMgc3RhdGljIEVNQUlMX0ZJRUxEX0xBQkVMOiBzdHJpbmcgPSAnV29yayBFbWFpbCc7XHJcbiAgcHVibGljIHN0YXRpYyBDT05UQUNUX0ZJRUxEX0xBQkVMOiBzdHJpbmcgPSAnTW9iaWxlIE51bWJlcic7XHJcbiAgcHVibGljIHN0YXRpYyBSRVNFVF9QQVNTV09SRF9NRVNTQUdFOiBzdHJpbmcgPSAnUGxlYXNlIHNldCBuZXcgcGFzc3dvcmQgZm9yIHlvdXInO1xyXG4gIHB1YmxpYyBzdGF0aWMgTkFNRTogc3RyaW5nID0gJ05hbWUnO1xyXG4gIHB1YmxpYyBzdGF0aWMgQUNDRVBUX05BTUU6IHN0cmluZyA9ICdCeSBjbGlja2luZyBcIkNvbnRpbnVlXCIgSSBhZ3JlZSB0byBCdWlsZCBJbmZvXFwncyc7XHJcbiAgcHVibGljIHN0YXRpYyBURVJNU19BTkRfQ09ORElUSU9OU19OQU1FOiBzdHJpbmcgPSAnVGVybXMgb2YgU2VydmljZSc7XHJcbiAgcHVibGljIHN0YXRpYyBQUklWQUNZX1BPTElDWTogc3RyaW5nID0gJ1ByaXZhY3kgUG9saWN5JztcclxuICBwdWJsaWMgc3RhdGljIFNUQVJUX0ZSRUU6IHN0cmluZyA9ICdHZXQgc3RhcnRlZCBhYnNvbHV0ZWx5IGZyZWUnO1xyXG4gIHB1YmxpYyBzdGF0aWMgUkVHSVNUUkFUSU9OX0lORk86IHN0cmluZyA9ICdTZWUgaG93IHRoZSB3b3JsZFxcJ3MgYmVzdCBCdWlsZGluZyBFc3RpbWF0aW9ucyBhcmUgY3JlYXRlZC4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgTk9UX0ZPVU5EX0VSUk9SOiBzdHJpbmcgPSAnNDA0JztcclxuICBwdWJsaWMgc3RhdGljIFJFTUVOQkVSX01FOiBzdHJpbmcgPSAnUmVtZW1iZXIgbWUnO1xyXG4gIHB1YmxpYyBzdGF0aWMgR0VUX1NUQVJURUQ6IHN0cmluZyA9ICdHZXQgU3RhcnRlZCc7XHJcblxyXG4gIC8vcHJvamVjdCBmb3JtXHJcbiAgcHVibGljIHN0YXRpYyBQUk9KRUNUX05BTUUgOiBzdHJpbmcgPSAnUHJvamVjdCBOYW1lJztcclxuICBwdWJsaWMgc3RhdGljIFBST0pFQ1RfQUREUkVTUzogc3RyaW5nID0gJ1Byb2plY3QgQWRkcmVzcyc7XHJcbiAgcHVibGljIHN0YXRpYyBQTE9UX0FSRUE6IHN0cmluZyA9ICdQbG90IEFyZWEnO1xyXG4gIHB1YmxpYyBzdGF0aWMgUExPVF9QRVJJUEhFUllfTEVOR1RIIDogc3RyaW5nID0gJ1Bsb3QgUGVyaXBoZXJ5IGxlbmd0aCc7XHJcbiAgcHVibGljIHN0YXRpYyBQT0RJVU1fQVJFQSA6IHN0cmluZyA9ICdQb2RpdW0gQXJlYSc7XHJcbiAgcHVibGljIHN0YXRpYyBPUEVOX1NQQUNFIDogc3RyaW5nID0gJ09wZW4gU3BhY2UnO1xyXG4gIHB1YmxpYyBzdGF0aWMgU0xBQl9BUkVBX09GX0NMVUJfSE9VU0UgOiBzdHJpbmcgPSAnU2xhYiBBcmVhIG9mIGNsdWIgaG91c2UnO1xyXG4gIHB1YmxpYyBzdGF0aWMgU1dJTU1JTkdfUE9PTF9DQVBBQ0lUWSA6IHN0cmluZyA9ICdTd2ltbWluZyBwb29sIGNhcGFjaXR5JztcclxuICBwdWJsaWMgc3RhdGljIFBST0pFQ1RfRFVSQVRJT04gOiBzdHJpbmcgPSAnUHJvamVjdCBEdXJhdGlvbic7XHJcbiAgcHVibGljIHN0YXRpYyBOVU1fT0ZfQlVJTERJTkdTIDogc3RyaW5nID0gJ1RvdGFsIE5vLiBvZiBidWlsZGluZ3MnO1xyXG4gIHB1YmxpYyBzdGF0aWMgVU5JVF9JTl9MSVRFUlMgOiBzdHJpbmcgPSAnKEluIGx0cnMpJztcclxuICBwdWJsaWMgc3RhdGljIERVUkFUSU9OX0lOX01PTlRIUyA6IHN0cmluZyA9ICcoSW4gbW9udGhzKSc7XHJcbiAgcHVibGljIHN0YXRpYyBBUkVBX1VOSVRfSU5fUkZUIDogc3RyaW5nID0gJyhJbiByZnQpJztcclxuXHJcbiAgLy9CdWlsZGluZyBmb3JtXHJcbiAgcHVibGljIHN0YXRpYyBCVUlMRElOR19OQU1FIDogc3RyaW5nID0gJ0J1aWxkaW5nIE5hbWUnO1xyXG4gIHB1YmxpYyBzdGF0aWMgU0xBQl9BUkVBOiBzdHJpbmcgPSAnU2xhYiBBcmVhICc7XHJcbiAgcHVibGljIHN0YXRpYyBDQVJQRVRfQVJFQTogc3RyaW5nID0gJ0NhcnBldCBhcmVhIGluY2x1ZGluZyBCYWxjb25pZXMvYXR0YWNoZWQgdGVycmFjZXMgJztcclxuICBwdWJsaWMgc3RhdGljIFNBTEVBQkxFX0FSRUE6IHN0cmluZyA9ICdTYWxlYWJsZSBBcmVhICc7XHJcbiAgcHVibGljIHN0YXRpYyBQTElOVEhfQVJFQSA6IHN0cmluZyA9ICdQbGludGggQXJlYSAnO1xyXG4gIHB1YmxpYyBzdGF0aWMgTlVNX09GX0ZMT09SUyA6IHN0cmluZyA9ICdOby4gb2YgZmxvb3JzICc7XHJcbiAgcHVibGljIHN0YXRpYyBOVU1fT0ZfUEFSS0lOR19GTE9PUlMgOiBzdHJpbmcgPSAnTm8uIG9mIHBhcmtpbmcgZmxvb3JzJztcclxuICBwdWJsaWMgc3RhdGljIENBUlBFVF9BUkVBX09GX1BBUktJTkcgOiBzdHJpbmcgPSAnQ2FycGV0IGFyZWEgb2YgcGFya2luZyAnO1xyXG4gIHB1YmxpYyBzdGF0aWMgQVBBUlRNRU5UX0NPTkZJR1VSQVRJT046IHN0cmluZyA9ICdBcGFydG1lbnQgQ29uZmlndXJhdGlvbic7XHJcbiAgcHVibGljIHN0YXRpYyBOVU1fT0ZfT05FX0JISzogc3RyaW5nID0gJ05vLiBvZiAxIEJIS3MnO1xyXG4gIHB1YmxpYyBzdGF0aWMgTlVNX09GX1RXT19CSEs6IHN0cmluZyA9ICdOby4gb2YgMiBCSEtzJztcclxuICBwdWJsaWMgc3RhdGljIE5VTV9PRl9USFJFRV9CSEs6IHN0cmluZyA9ICdOby4gb2YgMyBCSEtzJztcclxuICBwdWJsaWMgc3RhdGljIE5VTV9PRl9GT1VSX0JISzogc3RyaW5nID0gJ05vLiBvZiA0IEJIS3MnO1xyXG4gIHB1YmxpYyBzdGF0aWMgTlVNX09GX0ZJVkVfQkhLOiBzdHJpbmcgPSAnTm8uIG9mIDUgQkhLcyc7XHJcbiAgcHVibGljIHN0YXRpYyBOVU1fT0ZfTElGVFM6IHN0cmluZyA9ICdOby4gb2YgTGlmdHMnO1xyXG4gIHB1YmxpYyBzdGF0aWMgQVJFQV9VTklUX0lOX1NRRlQ6IHN0cmluZyA9ICcoSW4gc3FmdCknO1xyXG4gIHB1YmxpYyBzdGF0aWMgRVhDTFVESU5HX1BBUktJTkdfRkxPT1JTOiBzdHJpbmcgPSAnKEV4Y2x1ZGluZyBwYXJraW5nIGZsb29ycyknO1xyXG5cclxuICAvL0NPU1QtU1VNTUFSWSBSRVBPUlQgTEFCRUxTXHJcbiAgcHVibGljIHN0YXRpYyBDT1NUSU5HX0JZX1VOSVQgOiBzdHJpbmcgPSAnQ29zdGluZyBpbiAnO1xyXG4gIHB1YmxpYyBzdGF0aWMgQ09TVElOR19QRVJfQVJFQSA6IHN0cmluZyA9ICdDb3N0aW5nIHBlciAnO1xyXG4gIHB1YmxpYyBzdGF0aWMgVE9UQUwgOiBzdHJpbmcgPSAnVG90YWwgJztcclxuICBwdWJsaWMgc3RhdGljIFRPVEFMX0EgOiBzdHJpbmcgPSAnVG90YWwoQSknO1xyXG4gIHB1YmxpYyBzdGF0aWMgVE9UQUxfQV9CIDogc3RyaW5nID0gJ1RvdGFsKEErQiknO1xyXG4gIHB1YmxpYyBzdGF0aWMgVE9UQUxfQV9CX0MgOiBzdHJpbmcgPSAnVG90YWwoQStCK0MpJztcclxuICBwdWJsaWMgc3RhdGljIE5PVEVTIDogc3RyaW5nID0gJ05vdGVzICc7XHJcbiAgcHVibGljIHN0YXRpYyBCVURHRVRFRF9DT1NUIDogc3RyaW5nID0gJ0J1ZGdldGVkIENvc3QgJztcclxuICBwdWJsaWMgc3RhdGljIEVTVElNQVRFRF9DT1NUIDogc3RyaW5nID0gJ0VzdGltYXRlZCBDb3N0ICc7XHJcbiAgcHVibGljIHN0YXRpYyBDT1NUX0hFQUQgOiBzdHJpbmcgPSAnQ29zdCBIZWFkJztcclxuICBwdWJsaWMgc3RhdGljIEFNRU5JVFlfQ09TVF9IRUFEIDogc3RyaW5nID0gJ0FtZW5pdHkgQ29zdCBIZWFkJztcclxuICBwdWJsaWMgc3RhdGljIFJFUE9SVF9CWV9USFVNQlJVTEUgOiBzdHJpbmcgPSAnQnkgVGh1bWJydWxlJztcclxuICBwdWJsaWMgc3RhdGljIEVTVElNQVRFRCA6IHN0cmluZyA9ICdFc3RpbWF0ZWQgJztcclxuICBwdWJsaWMgc3RhdGljIEFTX1BFUl9QUk9KRUNUIDogc3RyaW5nID0gJyhhcyBwZXIgcHJvamVjdCBxdWFudGl0aWVzICYgcmF0ZXMpJztcclxuICBwdWJsaWMgc3RhdGljIEdSQU5EX1RPVEFMIDogc3RyaW5nID0gJ0dyYW5kIFRvdGFsICc7XHJcbiAgcHVibGljIHN0YXRpYyBUT1RBTF9QUk9KRUNUIDogc3RyaW5nID0gJ1RvdGFsIFByb2plY3QnO1xyXG4gIHB1YmxpYyBzdGF0aWMgV09SS0lURU1TIDogc3RyaW5nID0gJ1dvcmtJdGVtcyc7XHJcbiAgcHVibGljIHN0YXRpYyBHRVRfUkFURSA6IHN0cmluZyA9ICdnZXRSYXRlJztcclxuICBwdWJsaWMgc3RhdGljIEdFVF9TWVNURU1fUkFURSA6IHN0cmluZyA9ICdnZXRTeXN0ZW1SYXRlJztcclxuICBwdWJsaWMgc3RhdGljIEdFVF9SQVRFX0JZX1FVQU5USVRZIDogc3RyaW5nID0gJ2dldFJhdGVCeVF1YW50aXR5JztcclxuICBwdWJsaWMgc3RhdGljIFdPUktJVEVNX1JBVEVfVEFCIDogc3RyaW5nID0gJ3JhdGUnO1xyXG4gIHB1YmxpYyBzdGF0aWMgV09SS0lURU1fUkFURV9CWV9RVUFOVElUWV9UQUIgOiBzdHJpbmcgPSAnY29zdCc7XHJcbiAgcHVibGljIHN0YXRpYyBXT1JLSVRFTV9TWVNURU1fUkFURV9UQUIgOiBzdHJpbmcgPSAnc3lzdGVtUkEnO1xyXG4gIHB1YmxpYyBzdGF0aWMgV09SS0lURU1fUVVBTlRJVFlfVEFCIDogc3RyaW5nID0gJ3F1YW50aXR5JztcclxuICBwdWJsaWMgc3RhdGljIEdFVF9RVUFOVElUWSA6IHN0cmluZyA9ICdHZXQgUXR5Lic7XHJcbiAgcHVibGljIHN0YXRpYyBRVUFOVElUWV9WSUVXIDogc3RyaW5nID0gJ2RlZmF1bHQnO1xyXG4gIHB1YmxpYyBzdGF0aWMgV09SS0lURU1fREVUQUlMRURfUVVBTlRJVFlfVEFCIDogc3RyaW5nID0gJ2RldGFpbGVkUXVhbnRpdHknO1xyXG5cclxuICAvL1F1YW50aXR5IFZpZXdcclxuICBwdWJsaWMgc3RhdGljIERFRkFVTFRfVklFVyA9ICdkZWZhdWx0JztcclxuXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBCdXR0b24ge1xyXG4gIHB1YmxpYyBzdGF0aWMgQ0hBTkdFX1BBU1NXT1JEX0JVVFRPTjogc3RyaW5nID0gJ0NoYW5nZSBQYXNzd29yZCc7XHJcbiAgcHVibGljIHN0YXRpYyBSRVNFVF9QQVNTV09SRF9CVVRUT046IHN0cmluZyA9ICdSRVNFVCBQQVNTV09SRCc7XHJcbiAgcHVibGljIHN0YXRpYyBDTE9ORV9CVVRUT046IHN0cmluZyA9ICdDbG9uZSc7XHJcbiAgcHVibGljIHN0YXRpYyBDTE9TRV9CVVRUT046IHN0cmluZyA9ICdDbG9zZSc7XHJcbiAgcHVibGljIHN0YXRpYyBDQU5DRUxfQlVUVE9OOiBzdHJpbmcgPSAnQ2FuY2VsJztcclxuICBwdWJsaWMgc3RhdGljIFZJRVdfQU5EX0VESVQ6IHN0cmluZyA9ICdWaWV3IGFuZCBFZGl0JztcclxuICBwdWJsaWMgc3RhdGljIFBST0NFRUQ6IHN0cmluZyA9ICdQcm9jZWVkJztcclxuICBwdWJsaWMgc3RhdGljIE5FWFQ6IHN0cmluZyA9ICdOZXh0JztcclxuICBwdWJsaWMgc3RhdGljIFNVQk1JVDogc3RyaW5nID0gJ1N1Ym1pdCc7XHJcbiAgcHVibGljIHN0YXRpYyBDUkVBVEVfTkVXX1BST0pFQ1Q6IHN0cmluZyA9ICdDcmVhdGUgTmV3IFByb2plY3QnO1xyXG4gIHB1YmxpYyBzdGF0aWMgQkFDS19UT19IT01FOiBzdHJpbmcgPSAnQmFjayB0byBob21lJztcclxuICBwdWJsaWMgc3RhdGljIEdPX0JBQ0s6IHN0cmluZyA9ICdCYWNrJztcclxuICBwdWJsaWMgc3RhdGljIFNBVkU6IHN0cmluZyA9ICdTYXZlJztcclxuICBwdWJsaWMgc3RhdGljIEdFVF9BTU9VTlQ6IHN0cmluZyA9ICdFc3RpbWF0ZSBDb3N0JztcclxuICBwdWJsaWMgc3RhdGljIEdFVF9SQVRFOiBzdHJpbmcgPSAnR2V0IFJhdGUnO1xyXG4gIHB1YmxpYyBzdGF0aWMgR0VUX1FVQU5USVRZOiBzdHJpbmcgPSAnR2V0IFF0eS4nO1xyXG4gIHB1YmxpYyBzdGF0aWMgU1lTVEVNX1JBOiBzdHJpbmcgPSAnU3lzdGVtIFJBJztcclxuICBwdWJsaWMgc3RhdGljIEFERDogc3RyaW5nID0gJ0FkZCAnO1xyXG4gIHB1YmxpYyBzdGF0aWMgQUREX01PUkVfREVUQUlMUzogc3RyaW5nID0gJ0FkZCBNb3JlIERldGFpbHMnO1xyXG4gIHB1YmxpYyBzdGF0aWMgQ0FURUdPUlk6IHN0cmluZyA9ICdDYXRlZ29yeSc7XHJcbiAgcHVibGljIHN0YXRpYyBXT1JLSVRFTTogc3RyaW5nID0gJ1dvcmtJdGVtJztcclxuICBwdWJsaWMgc3RhdGljIElURU06IHN0cmluZyA9ICdJdGVtJztcclxuICBwdWJsaWMgc3RhdGljIFJPVzogc3RyaW5nID0gJ1Jvdyc7XHJcbiAgcHVibGljIHN0YXRpYyBDT1NUSEVBRDogc3RyaW5nID0gJ0Nvc3QgSGVhZCc7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBVbml0cyB7XHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgVU5JVCA9ICdzcWZ0JztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFByb2plY3RFbGVtZW50cyB7XHJcbiAgcHVibGljIHN0YXRpYyBDT1NUX0hFQUQgPSAnQ29zdEhlYWQnO1xyXG4gIHB1YmxpYyBzdGF0aWMgV09SS19JVEVNID0gJ1dvcmtJdGVtJztcclxuICBwdWJsaWMgc3RhdGljIEJVSUxESU5HID0gJ0J1aWxkaW5nJztcclxuICBwdWJsaWMgc3RhdGljIFFVQU5USVRZX0lURU0gPSAnUXVhbnRpdHkgSXRlbSc7XHJcbiAgcHVibGljIHN0YXRpYyBESVJFQ1RfUVVBTlRJVFkgPSAnRGlyZWN0IFF1YW50aXR5JztcclxuICBwdWJsaWMgc3RhdGljIFFVQU5USVRZX0RFVEFJTFMgPSAnUXVhbnRpdHkgRGV0YWlscyc7XHJcbiAgcHVibGljIHN0YXRpYyBRVUFOVElUWSA9ICdRdWFudGl0eSc7XHJcbiAgcHVibGljIHN0YXRpYyBDQVRFR09SWSA9ICdDYXRlZ29yeSc7XHJcbiAgcHVibGljIHN0YXRpYyBTTEFCX0FSRUEgPSAnU2xhYiBBcmVhJztcclxuICBwdWJsaWMgc3RhdGljIFNBTEVBQkxFX0FSRUEgPSAnU2FsZWFibGUgQXJlYSc7XHJcbiAgcHVibGljIHN0YXRpYyBDQVJQRVRfQVJFQSA9ICdDYXJwZXQgQXJlYSc7XHJcbiAgcHVibGljIHN0YXRpYyBSU19QRVJfU1FGVCA9ICdScy9TcWZ0JztcclxuICBwdWJsaWMgc3RhdGljIFJTX1BFUl9TUU1UID0gJ1JzL1NxbXQnO1xyXG4gIHB1YmxpYyBzdGF0aWMgU1FVQVJFRkVFVCA9ICdzcWZ0JztcclxuICBwdWJsaWMgc3RhdGljIFNRVUFSRU1FVEVSID0gJ3NxbXQnO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTWF0ZXJpYWxUYWtlT2ZmRWxlbWVudHMge1xyXG5cclxuICBwdWJsaWMgc3RhdGljIENPU1RfSEVBRF9XSVNFID0gJ0Nvc3QgSGVhZCB3aXNlJztcclxuICBwdWJsaWMgc3RhdGljIEFMTF9CVUlMRElOR1MgPSAnQWxsIEJ1aWxkaW5ncyc7XHJcbiAgcHVibGljIHN0YXRpYyBCVUlMRElORyA9ICdCdWlsZGluZyc7XHJcbiAgcHVibGljIHN0YXRpYyBDT1NUX0hFQUQgPSAnQ29zdCBIZWFkJztcclxuICBwdWJsaWMgc3RhdGljIE1BVEVSSUFMX1dJU0UgPSAnTWF0ZXJpYWwgd2lzZSc7XHJcbiAgcHVibGljIHN0YXRpYyBNQVRFUklBTCA9ICdNYXRlcmlhbCc7XHJcbiAgcHVibGljIHN0YXRpYyBDT05URU5UID0gJ2NvbnRlbnQnO1xyXG4gIHB1YmxpYyBzdGF0aWMgSEVBREVSUyA9ICdoZWFkZXJzJztcclxuICBwdWJsaWMgc3RhdGljIEZPT1RFUiA9ICdmb290ZXInO1xyXG4gIHB1YmxpYyBzdGF0aWMgU1VCX0NPTlRFTlQgPSAnc3ViQ29udGVudCc7XHJcbiAgcHVibGljIHN0YXRpYyBDT0xVTU5fT05FID0gJ2NvbHVtbk9uZSc7XHJcbiAgcHVibGljIHN0YXRpYyBDT0xVTU5fVFdPID0gJ2NvbHVtblR3byc7XHJcbiAgcHVibGljIHN0YXRpYyBDT0xVTU5fVEhSRUUgPSAnY29sdW1uVGhyZWUnO1xyXG4gIHB1YmxpYyBzdGF0aWMgRUxFTUVOVF9XSVNFX1JFUE9SVF9DT1NUX0hFQUQgPSAnY29zdEhlYWQnO1xyXG4gIHB1YmxpYyBzdGF0aWMgRUxFTUVOVF9XSVNFX1JFUE9SVF9NQVRFUklBTCA9ICdtYXRlcmlhbCc7XHJcbiAgcHVibGljIHN0YXRpYyBFUlJPUl9NRVNTQUdFX01BVEVSSUFMX1RBS0VfT0ZGX1JFUE9SVF9PRiA9ICdNYXRlcmlhbCB0YWtlIG9mZiByZXBvcnQgb2YgJztcclxuICBwdWJsaWMgc3RhdGljIEVSUk9SX01FU1NBR0VfSVNfTk9UX0ZPVU5EX0ZPUiA9ICcgaXMgbm90IGZvdW5kIGZvciAnO1xyXG4gIHB1YmxpYyBzdGF0aWMgRVJST1JfTUVTU0FHRV9CVUlMRElORyA9ICcgYnVpbGRpbmcuJztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIE1lbnVzIHtcclxuICBwdWJsaWMgc3RhdGljIENPU1RfU1VNTUFSWSA9ICdDb3N0IFN1bW1hcnknO1xyXG4gIHB1YmxpYyBzdGF0aWMgTUFURVJJQUxfVEFLRU9GRiA9ICdNYXRlcmlhbCBUYWtlb2ZmJztcclxuICBwdWJsaWMgc3RhdGljIFBST0pFQ1RfREVUQUlMUyA9ICdQcm9qZWN0IERldGFpbHMnO1xyXG4gIHB1YmxpYyBzdGF0aWMgTVlfUFJPSkVDVFMgPSAnTXkgUHJvamVjdHMnO1xyXG4gIHB1YmxpYyBzdGF0aWMgQ0xPTkUgPSAnQ2xvbmUnO1xyXG4gIHB1YmxpYyBzdGF0aWMgRURJVCA9ICdFZGl0JztcclxuICBwdWJsaWMgc3RhdGljIERFTEVURSA9ICdEZWxldGUnO1xyXG4gIHB1YmxpYyBzdGF0aWMgQUREX0JVSUxESU5HID0gJ0FkZCBCdWlsZGluZyc7XHJcbiAgcHVibGljIHN0YXRpYyBBRERfQlVJTERJTkdfVE9fUFJPSkVDVCA9ICdBZGQgQnVpbGRpbmcgdG8gUHJvamVjdCc7XHJcbiAgcHVibGljIHN0YXRpYyBDUkVBVEVfTkVXX1BST0pFQ1Q6IHN0cmluZyA9ICdDcmVhdGUgTmV3IFByb2plY3QnO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVmFsdWVDb25zdGFudCB7XHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgTlVNQkVSX09GX0ZSQUNUSU9OX0RJR0lUID0gMjtcclxufVxyXG4iXX0=
