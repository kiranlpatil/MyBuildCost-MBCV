export class AppSettings {
  // public static IP = 'http://localhost:8080';
  public static IP = 'http://52.66.120.228:8080'; // build info staging
  // public static HOST_NAME = 'localhost:8080';
  public static HOST_NAME = '52.66.120.228:8080';

  public static INITIAL_THEM = 'container-fluid dark-theme';
  public static LIGHT_THEM = 'container-fluid light-theme';
  public static IS_SOCIAL_LOGIN_YES = 'YES';
  public static IS_SOCIAL_LOGIN_NO = 'NO';
  public static HTTP_CLIENT = 'http://';
  public static PUBLIC = '/server/public';
  public static ATTACHMENT_FILES = '/attachment-files/';

  public static get API_ENDPOINT(): string {
    return this.IP + '/api/';
  }
}


export class Messages {
  public static FROM_REGISTRATION = 'registration';
  public static FROM_ACCOUNT_DETAIL = 'accountdetail';
  public static MSG_ERROR_UNCAUGHT_EXCEPTION='The server was unable to complete your request. Please try again.';

  //Registraion Success messages
  public static MSG_SUCCESS_CHANGE_MOBILE_NUMBER: string = 'Mobile number updated successfully.';
  public static MSG_SUCCESS_RESEND_VERIFICATION_CODE: string = 'New OTP (One Time Password) has been sent to your registered mobile number.';
  public static MSG_SUCCESS_RESEND_VERIFICATION_CODE_RESEND_OTP: string = 'New OTP (One Time Password) has' +
    ' been sent to your new mobile number.';
  public static MSG_SUCCESS_MAIL_VERIFICATION: string = 'Verification email sent successfully to your email id.';
  public static MSG_SUCCESS_RESET_PASSWORD: string = 'Your password is reset successfully. Please login.';
  public static MSG_SUCCESS_CHANGE_EMAIL: string = 'A verification email is sent to your new email id. ' +
    'Current email id will be active till you verify new email id.';
  public static MSG_SUCCESS_FORGOT_PASSWORD: string = 'Email for password reset has been sent successfully on your registered email id.';
  public static MSG_SUCCESS_DASHBOARD_PROFILE: string = 'Your profile updated successfully.';
  public static MSG_SUCCESS_CONTACT: string = 'Email sent successfully.';
  public static MSG_SUCCESS_CHANGE_THEME: string = 'Theme changed successfully.';
  public static MSG_SUCCESS_MAIL_VERIFICATION_RESULT_STATUS: string = 'Congratulations!';
  public static MSG_CHANGE_PASSWORD_SUCCESS_HEADER: string = 'Password changed successfully';
  public static MSG_SUCCESS_MAIL_VERIFICATION_BODY: string = 'Your account verified successfully.' +
    'You may start using it immediately by clicking on Sign In.';

  //Registration Failure messages
  public static MSG_ERROR_MAIL_VERIFICATION_BODY: string = 'Your account verification failed due to invalid access token.';
  public static MSG_ERROR_MAIL_VERIFICATION_RESULT_STATUS: string = 'Sorry.';
  public static MSG_ERROR_DASHBOARD_PROFILE_PIC: string = 'Failed to change profile picture.';
  public static MSG_ERROR_CHANGE_THEME: string = 'Failed to change theme.';
  public static MSG_ERROR_SERVER_ERROR: string = 'Server error.';
  public static MSG_ERROR_SOMETHING_WRONG: string = 'Internal Server Error.';
  public static MSG_ERROR_IMAGE_TYPE: string = 'Please try again. Make sure to upload only image file with extensions JPG, JPEG, GIF, PNG.';
  public static MSG_ERROR_IMAGE_SIZE: string = 'Please make sure the image size is less than 5 MB.';

  //Registration validation messages
  public static MSG_ERROR_VALIDATION_EMAIL_REQUIRED = 'Enter your e-mail address';
  public static MSG_ERROR_VALIDATION_WEBSITE_REQUIRED = 'Enter company website';
  public static MSG_ERROR_VALIDATION_PASSWORD_REQUIRED = 'Enter your password';
  public static MSG_ERROR_VALIDATION_NEWPASSWORD_REQUIRED = 'Enter a new password';
  public static MSG_ERROR_VALIDATION_CONFIRMPASSWORD_REQUIRED = 'Confirm your password';
  public static MSG_ERROR_VALIDATION_CURRENTPASSWORD_REQUIRED = 'Enter your current password';
  public static MSG_ERROR_VALIDATION_FIRSTNAME_REQUIRED = 'Enter your name';
  public static MSG_ERROR_VALIDATION_LASTNAME_REQUIRED = 'This field can\'t be left blank';
  public static MSG_ERROR_VALIDATION_MOBILE_NUMBER_REQUIRED = 'This field can\'t be left blank';
  public static MSG_ERROR_VALIDATION_PIN_REQUIRED = 'Enter your pin code.';
  public static MSG_ERROR_VALIDATION_DESCRIPTION_REQUIRED = 'Enter the name of the document you are uploading.';
  public static MSG_ERROR_VALIDATION_ABOUT_COMPANY_REQUIRED = 'Give a brief description about your company. ' +
    'This will be seen by candidates as a part of the job profile.';
  public static MSG_ERROR_VALIDATION_COMPANYNAME_REQUIRED = 'This field can\'t be left blank.';
  public static MSG_ERROR_VALIDATION_OTP_REQUIRED = 'Enter received OTP.';
  public static MSG_ERROR_VALIDATION_INVALID_EMAIL_REQUIRED = 'Enter a valid email address';
  public static MSG_ERROR_VALIDATION_INVALID_URL_REQUIRED = 'Website is not valid.';
  public static MSG_ERROR_VALIDATION_INVALID_NAME = 'Enter valid name.';
  public static MSG_ERROR_VALIDATION_INVALID_DATA = 'Enter valid data.';
  public static MSG_ERROR_VALIDATION_PASSWORD_MISMATCHED = 'Passwords do not match';
  public static MSG_ERROR_VALIDATION_BIRTHYEAR_REQUIRED = 'This field can\'t be left blank.';
  public static MSG_ERROR_VALIDATION_BIRTHYEAR_INVALID = 'Enter valid birth-year';
  public static MSG_ERROR_VALIDATION_OTP_MOBILE_NUMBER = 'Please provide a valid mobile number.';
  public static MSG_ERROR_VALIDATION_PASSWORD = 'Password must be alphanumeric having minimum 6 characters';
  public static MSG_ERROR_VALIDATION_PIN_NUMBER = 'Pin code should not be greater than 20 characters.';
  public static MSG_ERROR_VALIDATION_ITEM_NAME_REQUIRED = 'Item name should not be blank. \nFill it.';

  //Project validation messages
  public static MSG_ERROR_VALIDATION_PROJECT_NAME_REQUIRED = 'Enter project name';
  public static MSG_ERROR_VALIDATION_PROJECT_ADDRESS_REQUIRED = 'Enter project address';
  public static MSG_ERROR_VALIDATION_PLOT_AREA_REQUIRED = 'Enter plot area';
  public static MSG_ERROR_VALIDATION_PROJECT_DURATION_REQUIRED = 'Enter project duration';
  public static MSG_ERROR_VALIDATION_PLOT_PERIPHERY_REQUIRED = 'Enter plot periphery length';
  public static MSG_ERROR_VALIDATION_PODIUM_AREA_REQUIRED = 'Enter podium area';
  public static MSG_ERROR_VALIDATION_OPEN_SPACE_REQUIRED = 'Enter open space';
  public static MSG_ERROR_VALIDATION_SWIMMING_POOL_CAPACITY_REQUIRED = 'Enter swimming pool capacity';
  public static MSG_ERROR_VALIDATION_NUM_OF_BUILDINGS_REQUIRED = 'Enter total no. of buildings';

  //Building validation messages
  public static MSG_ERROR_VALIDATION_BUILDING_NAME_REQUIRED = 'Enter building name';
  public static MSG_ERROR_VALIDATION_SLAB_AREA_REQUIRED = 'Enter slab area';
  public static MSG_ERROR_VALIDATION_CARPET_AREA_REQUIRED = 'Enter carpet area';
  public static MSG_ERROR_VALIDATION_PARKING_AREA_REQUIRED = 'Enter parking area';
  public static MSG_ERROR_VALIDATION_SALEBLE_AREA_REQUIRED = 'Enter saleable area';
  public static MSG_ERROR_VALIDATION_PLINTH_AREA_REQUIRED = 'Enter plinth area';
  public static MSG_ERROR_VALIDATION_NO_OF_FLOORS_REQUIRED = 'Enter no. of floors';
  public static MSG_ERROR_VALIDATION_NO_OF_PARKING_FLOORS_REQUIRED = 'Enter no. of parking floors';
  public static MSG_ERROR_VALIDATION_CARPET_AREA_OF_PARKING_REQUIRED = 'Enter carpet area of parking floors';
  public static MSG_ERROR_VALIDATION_ONE_BHK_REQUIRED = 'Enter no. of one BHKs';
  public static MSG_ERROR_VALIDATION_TWO_BHK_REQUIRED = 'Enter no. of two BHKs';
  public static MSG_ERROR_VALIDATION_THREE_BHK_REQUIRED = 'Enter no. of three BHKs';
  public static MSG_ERROR_VALIDATION_NO_OF_SLABS_REQUIRED = 'Enter no. of slabs';
  public static MSG_ERROR_VALIDATION_NO_OF_LIFTS_REQUIRED = 'Enter no. of lifts';
  public static MSG_ERROR_VALIDATION_ALPHABATES = 'Enter alphabates only';

  public static MSG_ERROR_VALIDATION_ADD_AT_LEAST_ONE_APARTMENT_CONFIGURATION = 'Add at least one apartment details';
  public static MSG_ERROR_VALIDATION_NUMBER_OF_FLOORS = 'Total number of floors should be more than number of parking floors';
  public static MSG_ERROR_VALIDATION_SAME_BUILDING_NAME = 'Building with same name already exists.';

//payment error messages

  public static BUILDING_PURCHASED_ERROR = 'You can add only 5 buildings at once.';


  public static MSG_RESET_MOBILE_NUMBER = 'Enter your new mobile number and you will receive a verification code on it.';
  public static MSG_RESET_EMAIL_ADDRESS = 'Enter your new account email address and we will send you a link to reset your email.' ;
  public static MSG_EMAIL_ACTIVATION = 'Your email has been activated. You may start using your account with new email address' +
    ' immediately.';
  public static MSG_CONTACT_US = 'Please provide the following details and we will get back to you soon.';
  public static MSG_YEAR_NO_MATCH_FOUND = 'The year doesn\'t look right. Be sure to use your actual year of birth.';
  public static MSG_FORGOT_PASSWORD = 'Enter your e-mail address below and we\'ll get you back on track.';
  public static MSG_CONFIRM_PASSWORD = 'Passwords are not matching.';
  public static MSG_CHANGE_PASSWORD_SUCCESS = 'Password changed successfully. ' +
    'You can Sign In again with new password by clicking on "YES" button, Please click on "No" button to continue the session.';
  public static MSG_VERIFY_USER_1 = 'You are almost done!';
  public static MSG_VERIFY_USER_2 = 'We need to verify your mobile number before you can start using the system.';
  public static MSG_VERIFY_USER_3 = 'One Time Password(OTP) will be sent on following mobile number.';
  public static MSG_VERIFY_USER_4 = 'You are almost done! We need to verify your email id before you can start using the system.';
  public static MSG_EMAIL_NOT_MATCH = 'E-mail does not match.';
  public static MSG_CHANGE_PASSWORD = 'Your password protects your account so password must be strong. ' +
    'Changing your password will sign you out of all your devices, including your phone. ' +
    'You will need to enter your new password on all your devices.';
  public static MSG_MOBILE_NUMBER_NOT_MATCH = 'Mobile Number does not match.';
  public static MSG_MOBILE_NUMBER_Change_SUCCESS = 'Mobile number changed successfully.You can Sign In again by clicking on "yes" button,' +
    ' please click on "No" button to continue the session.';
  public static MSG_MOBILE_VERIFICATION_TITLE = 'Verify Your Mobile Number';
  public static MSG_MOBILE_NUMBER_CHANGE_VERIFICATION_TITLE = 'Verify Your  New Mobile Number';
  public static MSG_MOBILE_VERIFICATION_MESSAGE = 'Please enter the verification code sent to your mobile number.';
  public static MSG_MOBILE_NUMBER_CHANGE_VERIFICATION_MESSAGE = 'Please enter the verification code sent to your new mobile number.';
  public static CONTACT_US_ADDRESS = 'Blog. No. 14, 1st Floor, Electronic Estate, Parvati, Pune-Satara Road, Pune 411009, MH, INDIA.';
  public static CONTACT_US_CONTACT_NUMBER_1 = '+91 (20) 2421 8865';
  public static CONTACT_US_CONTACT_NUMBER_2 = '+91 98233 18865';
  public static CONTACT_US_EMAIL_1 = 'sales@techprimelab.com';
  public static CONTACT_US_EMAIL_2 = 'careers@techprimelab.com';
  public static MSG_EMAIL_VERIFICATION_HEADING = 'Your email is updated successfully.';
  public static MSG_EMAIL_VERIFICATION_MESSAGE = 'Kindly click on SIGN IN to use BuildInfo.';
  public static MSG_ACTIVATE_USER_HEADING = 'Congratulations!';
  public static MSG_ACTIVATE_USER_SUB_HEADING = 'You can now find candidates using the highly accurate,' +
    ' simpler, faster and powerful solution.';
  public static MSG_ACTIVATE_USER_MESSAGE = 'Your email has been confirmed, you can now login with your new email ID.';
  public static MSG_ABOUT_US_DISCRIPTION = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' +
    'Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s' +
    'when an unknown printer took a galley of type and scrambled it to make a type specimen book.' +
    'It has survived not only five centuries, but also the leap into electronic typesetting,remaining essentially ' +
    'unchanged. ' +
    'It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,' +
    'and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.';
  public static GUIDE_MESSAGE_FOR_NEW_VIEWER = 'Thank you for showing interest, ' +
    'we will need your basic information to create your value portrait on BuildInfo. Go ahead, ' +
    'fill the form and get your value portrait!';
  public static NOT_FOUND_INFORMATION = 'The page you are looking for doesn\'t exist<br/>' +
    'or an other error ocourred.';

  //Application Success Messages
  public static MSG_SUCCESS_PROJECT_CREATION: string = 'Project has been created successfully.';
  public static MSG_SUCCESS_ADD_BUILDING_PROJECT: string = 'Building has been successfully added to project.\n' +
    'Please wait...';
  public static MSG_SUCCESS_COPY_BUILDING_PROJECT: string = 'Building has been successfully copied to project.\n' +
    'Please wait...';

  public static MSG_SUCCESS_CLONED_BUILDING_DETAILS: string = 'Your building is cloned successfully.';
  public static MSG_SUCCESS_UPDATE_PROJECT_DETAILS: string = 'Your project is updated successfully.';
  public static MSG_SUCCESS_UPDATE_BUILDING_DETAILS: string = 'Your building details are updated successfully.';
  public static MSG_SUCCESS_DELETE_BUILDING: string = 'Building deleted successfully.';
  public static MSG_SUCCESS_ADD_COSTHEAD: string = 'Cost head added successfully.';
  public static MSG_SUCCESS_DELETE_COSTHEAD: string = 'Cost head deleted successfully.';
  public static MSG_SUCCESS_DELETE_ITEM: string = 'Your item deleted successfully.';
  public static MSG_SUCCESS_UPDATE_RATE: string = 'Rate updated.';
  public static MSG_QUANTITY_SHOULD_NOT_ZERO_OR_NULL: string = 'Quantity should not be zero or blank.';
  public static MSG_SUCCESS_SAVED_COST_HEAD_ITEM: string = 'Your Cost Head items updated successfully.';
  public static MSG_SUCCESS_SAVED_COST_HEAD_ITEM_ERROR: string = 'There is an error in operation.';
  public static MSG_SUCCESS_ADD_CATEGORY: string = 'Category added successfully.';
  public static MSG_SUCCESS_DELETE_CATEGORY: string = 'Category deleted successfully.';
  public static MSG_SUCCESS_DELETE_QUANTITY_ITEM: string = 'Quantity item deleted successfully.';
  public static MSG_SUCCESS_DELETE_QUANTITY_DETAILS: string = 'Quantity details deleted successfully.';
  public static MSG_ALREADY_ADDED_ALL_CATEGORIES: string = 'Already added all Categories.';
  public static MSG_SUCCESS_ADD_WORKITEM: string = 'Work Item added successfully.';
  public static MSG_ALREADY_ADDED_ALL_WORKITEMS: string = 'Already added all Work Items.';
  public static MSG_SUCCESS_DELETE_WORKITEM: string = 'Your Work Item deleted successfully.';
  public static MSG_SUCCESS_UPDATE_THUMBRULE_RATE_COSTHEAD: string = 'Thumbrule rate for Cost Head updated successfully.';
  public static MSG_SUCCESS_UPDATE_DIRECT_QUANTITY_OF_WORKITEM: string = 'Quantity for Work Item updated successfully.';
  public static MSG_SUCCESS_UPDATE_DIRECT_RATE_OF_WORKITEM: string = 'Rate for Work Item updated successfully.';
  public static MSG_SUCCESS_UPDATE_QUANTITY_NAME_WORKITEM: string = 'Title for Work Item updated successfully.';

  //Quantity view required fields
  public static MSG_ERROR_VALIDATION_QUANTITY_ITEM_REQUIRED = 'Enter item';
  public static MSG_ERROR_VALIDATION_QUANTITY_NUMBERS_REQUIRED = 'Enter numbers';
  public static MSG_ERROR_VALIDATION_QUANTITY_LENGTH_REQUIRED = 'Enter length';
  public static MSG_ERROR_VALIDATION_QUANTITY_BREADTH_REQUIRED = 'Enter breadth';
  public static MSG_ERROR_VALIDATION_QUANTITY_HEIGHT_REQUIRED = 'Enter height';
  public static MSG_ERROR_VALIDATION_QUANTITY_QUANTITY_REQUIRED = 'Enter quantity';
  public static MSG_ERROR_VALIDATION_QUANTITY_UNIT_REQUIRED = 'Enter unit';
  public static MSG_ERROR_VALIDATION_QUANTITY_REQUIRED = 'Fields cannot be empty';
  public static MSG_ERROR_VALIDATION_QUANTITY_NAME_REQUIRED = 'Flat/Floor/Parking details can not be empty';
  public static LOGIN_INFO: string = 'Enter your details below';
  public static MSG_SUCCESS_ALREADY_ADDED_ALL_COSTHEADS: string = 'Already added all Cost Heads.';
  public static SUBSCRIPTION_PACKAGES_DETAILS_ARE_NOT_DEFINED: string = 'Subscription packages details are not defined.';

  //File Attachment messages

  public static  MSG_ERROR_VALIDATION_OF_FILE_EXTENSION = 'The file you are trying to attach is not supported.';
  public static  MSG_ERROR_VALIDATION_OF_FILE_SIZE = 'File size should not be greater than 5MB';
  public static  MSG_ERROR_VALIDATION_OF_FILE_ALREADY_EXITS = 'Selected file already exists';
  public static  MSG_ERROR_VALIDATION_OF_FILE_UPLOADED_SUCCESSFUL = 'File uploaded successfully';
  public static  MSG_ERROR_VALIDATION_OF_FILE_DELETED_SUCCESSFUL = 'File deleted successfully';
  public static  MSG_ERROR_CANNOT_SELECT_BUILDINGS = 'Cannot select more than 5 buildings.';
  public static ADD_MORE_DETAILS_TITLE: string = 'Add Flat/Floor/Parking Details';

  //Payment form
  public static PAYMENT_FORM_FILED_MISSING: string = 'Please fill all details.';

  //Payment Messages
  public static MSG_FOR_REMAINING_BUILDINGS: string = '(You can add';
  public static MSG_FOR_REMAINING_BUILDINGS_ADD: string = ' more buildings to this project)';
  public static MSG_ADD_BUILDING_PAYMENT: string = 'You have already consumed package of 5 buildings.<br />You can add more buildings by paying INR 500 per building.';
  public static MSG_CREATE_PROJECT_CONFIRMATION: string = 'Trial package contains only 1 project <br />with 5 buildings you can create new project<br /> by purchasing our <strong>premium package.</strong>';
  public static MSG_CONFIRMATION_CREATE_PROJECT: string = 'Are you sure to create new project?';
  public static MSG_ON_RETAIN_PROJECT: string = 'Would you like to retain estimated cost details from existing project ';
  public static MSG_ON_RETAIN_PROJECT2: string = ' or create a new project';
  public static WARNING_MESSAGE_ON_RETAIN_PROJECT: string = 'Creating new project will delete your existing project data';
  public static PAYMENT_CANCEL_MESSAGE: string = 'Your payment has been cancelled';
  public static PROJECT_EXPIRED: string = 'Project Expired';

}

export class NavigationRoutes {

  public static APP_REGISTRATION: string = '/registration';
  public static APP_FORGOTPASSWORD: string = '/forgot-password';
  public static APP_PROJECT: string = '/project';
  public static APP_BUILDING: string = 'building';
  public static APP_CREATE_NEW_PROJECT: string = '/create-new-project';
  public static APP_CREATE_PROJECT: string = '/create-project';
  public static APP_VIEW_BUILDING_DETAILS: string = 'building/details';
  public static APP_CREATE_BUILDING: string = '/create-building';
  public static APP_CLONE_BUILDING: string = '/clone-building';
  public static APP_LIST_PROJECT: string = 'project/list';
  public static APP_COST_SUMMARY: string = 'cost-summary';
  public static APP_COST_HEAD: string = 'cost-head';
  public static APP_CATEGORY: string = 'category';
  public static APP_COMMON_AMENITIES = 'common-amenities';
  public static APP_DASHBOARD: string = '/dashboard';
  public static PAYMENT: string = 'payment';
  public static SUCCESS: string = 'success';
  public static FAILURE: string = 'failure';
  public static APP_LOGIN: string = '/signin';
  public static APP_START: string = '/';
  public static VERIFY_PHONE: string = '/verify-phone';




  //PAYMENT
  public static APP_PACKAGE_DETAILS: string = '/package-details';
  public static APP_PACKAGE_SUMMARY: string = '/package-details/premium-package/';
  public static APP_RENEW_PACKAGE: string = '/package-details/renew-package';
  public static APP_RETAIN_PROJECT: string = '/package-details/retain-project';
  public static APP_PAYMENT_FAILURE: string = '/package-details/payment/failure';


}

export class SessionStorage {

  public static ACCESS_TOKEN = 'access_token';
  public static IS_SOCIAL_LOGIN = 'is_social_login';
  public static PROFILE_PICTURE = 'profile_picture';
  public static IS_LOGGED_IN = 'is_user_logged_in';
  public static IS_USER_SIGN_IN = 'is_user_register';
  public static CURRENT_VIEW = 'current_view';
  public static FROM_VIEW = 'from_view';
  public static USER_ID = 'user_id';
  public static MOBILE_NUMBER = 'mobile_number';
  public static VERIFIED_MOBILE_NUMBER = 'verified_mobile_number';
  public static FIRST_NAME = 'first_name';
  public static LAST_NAME = 'last_name';
  public static EMAIL_ID = 'email_id';
  public static PASSWORD = 'password';
  public static MY_THEME = 'my_theme';
  public static VERIFY_PHONE_VALUE = 'verify_phone_value';
  public static CHANGE_MAIL_VALUE = 'change_mail_value';
  public static CURRENT_PROJECT_ID = 'current_project_id';
  public static CURRENT_BUILDING_ID = 'current_project_id';
  public static CURRENT_PROJECT_NAME = 'current_project_name';
  public static NUMBER_OF_DAYS_TO_EXPIRE = 'number_of_days_to_expire';
  public static CURRENT_BUILDING_NAME = 'current_building_name';
  public static CURRENT_BUILDING = 'current_building_id';
  public static CURRENT_WINDOW_POSITION = 'current_window_position';
  public static CURRENT_COST_HEAD_ID = 'current_cost_head_id';
  public static CURRENT_COST_HEAD_NAME = 'current_cost_head';
  public static CURRENT_WORKITEM_ID = 'current_workitem_id';
  public static COMPANY_NAME = 'company_name';
  public static CREATED_AT = 'createdAt';
  public static PACKAGE_NAME = 'package_name';
  public static NO_OF_BUILDINGS_PURCHASED = 'no_of_buildings_purchased';
  public static CREATE_NEW_PROJECT = 'create_new_project';
  public static TOTAL_BILLED = 'total_billed';
  public static IS_SUBSCRIPTION_AVAILABLE = 'is_subscription_available';
  public static PREMIUM_PACKAGE_AVAILABLE = 'premium_package_available';

}

export class LocalStorage {
  public static ACCESS_TOKEN = 'access_token';
  public static IS_LOGGED_IN = 'is_user_logged_in';
  public static FIRST_NAME = 'first_name';
}

export class API {

  public static NOTIFICATION = 'notification';
  public static SEND_NOTIFICATION_TO_RECRUITER = 'notify_recruiter';
  public static SEND_MAIL = 'sendmail';
  public static SEND_TO_ADMIN_MAIL = 'sendmailtoadmin';
  public static USER_PROFILE = 'user';
  public static CANDIDATE_PROFILE = 'user';
  public static USER_DATA = 'userData';
  public static LOGIN = 'user/login';
  public static FB_LOGIN = 'fbLogin';
  public static CHANGE_PASSWORD = 'user/change/password';
  public static CHANGE_MOBILE = 'user/change/mobileNumber';
  public static CHANGE_EMAIL = 'user/change/emailId';
  public static CHANGE_COMPANY_ACCOUNT_DETAILS = 'changerecruiteraccountdetails';
  public static VERIFY_CHANGED_EMAIL = 'user/verify/changedEmailId';
  public static VERIFY_EMAIL = 'user/verifyEmail';
  public static GENERATE_OTP = 'user/generateotp';
  public static VERIFY_OTP = 'user/verify/otp';
  public static VERIFY_MOBILE = 'user/verify/mobileNumber';
  public static SEND_VERIFICATION_MAIL = 'sendverificationmail';
  public static FORGOT_PASSWORD = 'user/forgotpassword';
  public static UPDATE_PICTURE = 'user/updatepicture';
  public static CHANGE_THEME = 'changetheme';
  public static RESET_PASSWORD = 'user/resetpassword';
  public static GOOGLE_LOGIN = 'googlelogin';
  public static USER = 'User';


  //Project
  public static USER_ALL_PROJECTS = 'user/all/project';
  public static PROJECT = 'project';
  public static PROJECT_NAME = 'projectName';
  public static CHECK_FOR_LIMITATION_OF_BUILDING = 'checkForLimitationOfBuilding';

  public static BUILDING = 'building';
  public static COSTHEAD = 'costhead';
  public static ADVERTSING_BANNER = 'user/advertising/banners';
  public static COMMON_AMENITIES = 'common-amenities';
  public static ACTIVE_STATUS = 'activeStatus';
  public static ACTIVE_STATUS_FALSE = 'false';
  public static ACTIVE_STATUS_TRUE = 'true';
  public static CLONE = 'clone';
  public static CATEGORYLIST = 'categorylist';
  public static CATEGORY = 'category';
  public static WORKITEM = 'workitem';
  public static WORKITEMLIST = 'workitemlist';
  public static WORKITEM_ALL = 'workitem/all';
  public static QUANTITY = 'quantity';
  public static QUANTITY_ITEM_DETAILS = 'quantityItemDetails';
  public static ITEM = 'item';
  public static DIRECT = 'direct';
  public static DIRECT_QUANTITY = 'directQuantity';
  public static FILE = 'uploadFile';
  public static FILE_LIST = 'fileNameList';
  public static DELETE_FILE = 'deleteFile';
  public static SYNC_RATE_ANALYSIS = 'syncWithRateAnalysis';

  public static THUMBRULE_RULE_RATE = 'report/thumbRuleRate';
  public static RATE = 'rate';
  public static RATES = 'rates';
  public static RATE_ITEM = 'rateItem';
  public static SQFT = 'sqft';
  public static SQM = 'sqmt';
  public static RS_PER_SQFT = 'Rs/Sqft';
  public static RS_PER_SQMT = 'Rs/Sqmt';
  public static AREA = 'area';
  public static SLAB_AREA = 'slabArea';
  public static SALEABLE_AREA = 'saleableArea';
  public static CARPET_AREA = 'carpetArea';
  public static BUDGETED_COST = 'budgetedCost';

  //Material Take Off

  public static REPORT_MATERIAL_TAKE_OFF = 'report/materialtakeoff';
  public static MATERIAL_FILTERS_LIST = 'material/filters/list';

  //
  public static SUBSCRIPTION = 'subscription';
  public static PAY_U_MONEY = 'payUMoney';
  public static BASE_PACKAGES_LIST = 'basepackageslist';
  public static BY_NAME = 'by/name';
  public static UPDATE_SUBSCRIPTION = 'updateSubscription';

}

export class ImagePath {
  public static FAV_ICON = './assets/framework/images/logo/favicon.ico';
  public static BODY_BACKGROUND = './assets/build-info/page_background/page-bg.png';
  public static BODY_BACKGROUND_TRANSPARENT = './assets/build-info/page_background/page-bg-transparent.png';
  public static MY_WHITE_LOGO = './assets/build-info/header/buildinfo-logo.png';
  public static HEADER_LOGO = './assets/build-info/header/header-logo.png';
  public static MOBILE_WHITE_LOGO = './assets/build-info/header/buildinfo-logo.png';
  public static FACEBOOK_ICON = './assets/framework/images/footer/fb.svg';
  public static GOOGLE_ICON = './assets/framework/images/footer/google-plus.svg';
  public static LINKEDIN_ICON = './assets/framework/images/footer/linked-in.svg';
  public static PROFILE_IMG_ICON = './assets/framework/images/dashboard/default-profile.png';
  public static COMPANY_LOGO_IMG_ICON = './assets/framework/images/dashboard/default-company-buildinfo-logo.png';
  public static EMAIL_ICON = './assets/framework/images/icons/e-mail.svg';
  public static EMAIL_ICON_GREY = './assets/framework/images/icons/e-mail-grey.svg';
  public static NEW_EMAIL_ICON_GREY = './assets/framework/images/icons/new-e-mail-grey.svg';
  public static CONFIRM_EMAIL_ICON_GREY = './assets/framework/images/icons/confirm-e-mail-grey.svg';
  public static PASSWORD_ICON = './assets/framework/images/icons/password.svg';
  public static PASSWORD_ICON_GREY = './assets/framework/images/icons/password-grey.svg';
  public static NEW_PASSWORD_ICON_GREY = './assets/framework/images/icons/new-password-grey.svg';
  public static CONFIRM_PASSWORD_ICON_GREY = './assets/framework/images/icons/confirm-password-grey.svg';
  public static MOBILE_ICON_GREY = './assets/framework/images/icons/mobile-grey.svg';
  public static NEW_MOBILE_ICON_GREY = './assets/framework/images/icons/new-mobile-grey.svg';
  public static CONFIRM_MOBILE_ICON_GREY = './assets/framework/images/icons/confirm-mobile-grey.svg';
}

export class ProjectAsset {
  static _year: Date = new Date();
  static currentYear = ProjectAsset._year.getFullYear();
  public static UNDER_LICENECE = '© ' + ProjectAsset.currentYear + ' www.buildinfo.com';
  public static APP_NAME = 'Cost Control';
  public static TAG_LINE = 'Help you to decide cost';
}

export class Headings {
  public static CHANGE_PASSWORD: string = 'Change Password';
  public static CHANGE_EMAIL_HEADING: string = 'Change your Email';
  public static CHANGE_MOBILE_NUMBER_HEADING: string = 'Change Your Mobile Number';
  public static RESET_PASSWORD_HEADING: string = 'Reset Password';
  public static CREATE_TRIAL_PROJECT: string = 'Create Trial Project';
  public static CREATE_YOUR_FIRST_PROJECT: string = 'Create Your First Project';
  public static CREATE_NEW_PROJECT: string = 'Create New Project';
  public static EDIT_BUILDING: string = 'Edit Building';
  public static LIST_BUILDING: string = 'Building List';
  public static ADD_NEW_BUILDING: string = 'Add Building to a Project';
  public static COMMON_DEVELOPMENT: string = 'Common Amenities and Development Cost';
  public static ELECTRIC_INFRASTRUCTURE: string = 'Electric Infrastructure ';
  public static CONSTRUCTION_COST: string = 'Construction Cost (Material + Labour)';
  public static QUANTITY: string = 'Quantity';
  public static COLON: string = ':';
  public static ITEM: string = 'Item';



  //Payment headings
  public static CONFIRM_PACKAGE_HEADING: string ='Confirm your package';
  public static CREATE_PROJECT_MODAL_HEADING: string ='Create New Project';
  public static PAYMENT_UNSUCCESSFUL: string ='Payment Unsuccessful';
}

export class TableHeadings {
  public static ITEM: string = 'Item';
  public static QUANTITY: string = 'Qty.';
  public static NUMBERS: string = 'Nos.';
  public static LENGTH: string = 'Length';
  public static BREADTH: string = 'Breadth';
  public static HEIGHT: string = 'Height';
  public static UNIT: string = 'Unit';
  public static RATEANALYSIS: string = 'Rate Analysis';
  public static AMOUNT: string = 'Amount';
  public static COST: string = 'Cost';
  public static TOTAL: string = 'Total';
  public static WEIGHT_IN_KG: string = 'Weight in kg';

  public static DESCRIPTION: string = 'Description';
  public static RATE_PER_UNIT: string = 'Rate/Unit';
  public static DIAMETER: string = 'Diameter';
  public static MM_UNIT: string = 'mm';
  public static MTR_UNIT: string = 'mtr';
  public static SIX_MM: string = '6mm';
  public static EIGHT_MM: string = '8mm';
  public static TEN_MM: string = '10mm';
  public static TWELVE_MM: string = '12mm';
  public static SIXTEEN_MM: string = '16mm';
  public static TWENTY_MM: string = '20mm';
  public static TWENTYFIVE_MM: string ='25mm';
  public static THIRTY_MM: string = '30mm';
}

export class Label {
  public static CURRENT_PASSWORD_LABEL: string = 'Current Password';
  public static NEW_PASSWORD_LABEL: string = 'New Password';
  public static PASSWORD: string = 'Password';
  public static CONFIRM_PASSWORD_LABEL: string = 'Confirm Password';
  public static FIRST_NAME_LABEL: string = 'First Name';
  public static COMPANY_NAME_LABEL: string = 'Company Name';
  public static STATE_LABEL: string = 'State';
  public static CITY_LABEL: string = 'City';
  public static EMAIL_FIELD_LABEL: string = 'Work Email';
  public static CONTACT_FIELD_LABEL: string = 'Mobile Number';
  public static RESET_PASSWORD_MESSAGE: string = 'Please set new password for your';
  public static NAME: string = 'Name';
  public static ACCEPT_NAME: string = 'By clicking "Continue" I agree to Build Info\'s';
  public static TERMS_AND_CONDITIONS_NAME: string = 'Terms of Service';
  public static PRIVACY_POLICY: string = 'Privacy Policy';
  public static START_FREE: string = 'Get started absolutely free';
  public static REGISTRATION_INFO: string = 'See how the world\'s best Building Estimations are created.';
  public static NOT_FOUND_ERROR: string = '404';
  public static REMENBER_ME: string = 'Remember me';
  public static GET_STARTED: string = 'Get Started';
  public static BILLING_INFO: string = 'Here is the summary of your account';
  public static VALID_TILL: string = 'Valid Till';
  public static NO_OF_BUILDINGS: string = 'Number of Buildings';

  //project form
  public static PROJECT_NAME: string = 'Project Name';
  public static PROJECT_ADDRESS: string = 'Project Address';
  public static PLOT_AREA: string = 'Plot Area';
  public static PLOT_PERIPHERY_LENGTH: string = 'Plot Periphery length';
  public static PODIUM_AREA: string = 'Podium Area';
  public static OPEN_SPACE: string = 'Open Space';
  public static SLAB_AREA_OF_CLUB_HOUSE: string = 'Slab Area of club house';
  public static SWIMMING_POOL_CAPACITY: string = 'Swimming pool capacity';
  public static PROJECT_DURATION: string = 'Project Duration';
  public static NUM_OF_BUILDINGS: string = 'Total No. of buildings';
  public static UNIT_IN_LITERS: string = '(In ltrs)';
  public static DURATION_IN_MONTHS: string = '(In months)';
  public static AREA_UNIT_IN_RFT: string = '(In rft)';

  //Building form
  public static BUILDING_NAME: string = 'Building Name';
  public static SLAB_AREA: string = 'Slab Area ';
  public static CARPET_AREA: string = 'Carpet area including Balconies/attached terraces ';
  public static SALEABLE_AREA: string = 'Saleable Area ';
  public static PLINTH_AREA: string = 'Plinth Area ';
  public static NUM_OF_FLOORS: string = 'No. of floors ';
  public static NUM_OF_PARKING_FLOORS: string = 'No. of parking floors';
  public static CARPET_AREA_OF_PARKING: string = 'Carpet area of parking ';
  public static APARTMENT_CONFIGURATION: string = 'Apartment Configuration';
  public static CLONE_BUILDING_MESSAGE: string = 'Also copy following details from building ';
  public static NUM_OF_ONE_BHK: string = 'No. of 1 BHKs';
  public static NUM_OF_TWO_BHK: string = 'No. of 2 BHKs';
  public static NUM_OF_THREE_BHK: string = 'No. of 3 BHKs';
  public static NUM_OF_FOUR_BHK: string = 'No. of 4 BHKs';
  public static NUM_OF_FIVE_BHK: string = 'No. of 5 BHKs';
  public static NUM_OF_LIFTS: string = 'No. of Lifts';
  public static AREA_UNIT_IN_SQFT: string = '(In sqft)';
  public static EXCLUDING_PARKING_FLOORS: string = '(Excluding parking floors)';

  //COST-SUMMARY REPORT LABELS
  public static COSTING_BY_UNIT: string = 'Costing in ';
  public static COSTING_PER_AREA: string = 'Costing per ';
  public static TOTAL: string = 'Total ';
  public static TOTAL_A: string = 'Total(A)';
  public static TOTAL_A_B: string = 'Total(A+B)';
  public static TOTAL_A_B_C: string = 'Total(A+B+C)';
  public static NOTES: string = 'Notes ';
  public static BUDGETED_COST: string = 'Budgeted Cost ';
  public static ESTIMATED_COST: string = 'Estimated Cost ';
  public static COST_HEAD: string = 'Cost Head';
  public static AMENITY_COST_HEAD: string = 'Amenity Cost Head';
  public static REPORT_BY_THUMBRULE: string = 'By Thumbrule';
  public static ESTIMATED: string = 'Estimated ';
  public static AS_PER_PROJECT: string = '(as per project quantities & rates)';
  public static GRAND_TOTAL: string = 'Grand Total ';
  public static TOTAL_PROJECT: string = 'Total Project';
  public static WORKITEMS: string = 'WorkItems';
  public static GET_RATE: string = 'getRate';
  public static GET_SYSTEM_RATE: string = 'getSystemRate';
  public static GET_RATE_BY_QUANTITY: string = 'getRateByQuantity';
  public static WORKITEM_RATE_TAB: string = 'rate';
  public static WORKITEM_RATE_BY_QUANTITY_TAB: string = 'cost';
  public static WORKITEM_SYSTEM_RATE_TAB: string = 'systemRA';
  public static WORKITEM_QUANTITY_TAB: string = 'quantity';
  public static WORKITEM_STEEL_QUANTITY_TAB: string = 'steel';
  public static GET_QUANTITY: string = 'Get Qty.';
  public static QUANTITY_VIEW: string = 'default';
  public static WORKITEM_DETAILED_QUANTITY_TAB: string = 'detailedQuantity';
  public static ATTACH_FILE: string = 'Attach File';
  public static DIRECT_QUANTITY: string = 'directQty';

  //Quantity View
  public static DEFAULT_VIEW = 'default';

  //Package details
  public static PROJECT: string = 'Project';
  public static PROJECTS: string = 'Projects';
  public static BUILDING: string = 'Building';
  public static BUILDINGS: string = 'Buildings';
  public static NO_OF_PROJECTS: string = 'No.of Projects';
  public static NO_OF_BUILDING: string = 'No.of Buildings';
  public static DURATION: string = 'Duration';
  public static TOTAL_BILLED: string = 'Total Billed';
  public static NO_OF_BUILDINGS_TO_ADD: string = 'Number of building(s) to add';
  public static INR: string = 'INR';




  //Renew project
  public static YOUR_PROJECT: string = 'Your project';
  public static IS_ABOUT_TO_EXPIRE_IN: string = ' is about to expire in ';
  public static IS_ABOUT_TO_EXPIRED: string = ' is expired.';
  public static DAYS: string = 'days.';
  public static PLEASE_RENEW_TO_CONTINUE: string = 'Please renew to continue using features of BuildInfo.';
  public static START_DATE: string = 'Start Date';
  public static END_DATE: string = 'End Date';
  public static RENEW_PROJECT_BY: string = 'Renew Project by';
  public static PACKAGE_RENEW_PROJECT: string = 'RenewProject';
  public static PACKAGE_REATAIN_PROJECT: string = 'Retain';
  public static PACKAGE_PREMIUM: string = 'Premium';
  public static PREFIX_TRIAL_PROJECT: string = 'Trial Project';
  public static INITIAL_NUMBER_OF_DAYS_TO_EXPIRE: number = 15;

}

export class Button {
  public static CHANGE_PASSWORD_BUTTON: string = 'Change Password';
  public static RESET_PASSWORD_BUTTON: string = 'RESET PASSWORD';
  public static CLONE_BUTTON: string = 'Clone';
  public static CLOSE_BUTTON: string = 'Close';
  public static CANCEL_BUTTON: string = 'Cancel';
  public static VIEW_AND_EDIT: string = 'View and Edit';
  public static PROCEED: string = 'Proceed';
  public static NEXT: string = 'Next';
  public static SUBMIT: string = 'Submit';
  public static CREATE_NEW_PROJECT: string = 'Create New Project';
  public static CREATE: string = 'Create';
  public static CLICK_HERE: string = 'click here';
  public static BACK_TO_HOME: string = 'Back to home';
  public static GO_BACK: string = 'Back';
  public static SAVE: string = 'Save';
  public static GET_AMOUNT: string = 'Estimate Cost';
  public static GET_RATE: string = 'Get Rate';
  public static GET_QUANTITY: string = 'Get Qty';
  public static SYSTEM_RA: string = 'System RA';
  public static ADD: string = 'Add ';
  public static ADD_MORE_DETAILS: string = 'Add More Details';
  public static CATEGORY: string = 'Category';
  public static WORKITEM: string = 'WorkItem';
  public static ITEM: string = 'Item';
  public static ROW: string = 'Row';
  public static COSTHEAD: string = 'Cost Head';
  public static ATTACH_FILE: string = 'Attach File';
  public static STANDARD_NOTE: string = 'Standard Note / Disclaimer';
  public static ADD_PROJECT: string = 'Add Project';
  public static RENEW_NOW: string = 'Renew now';

  //Package details
  public static MSG_VIEW_PACKAGE_DETAILS: string = 'Your trial period is for 15 days,<br /> to view our package details';
  public static PACKAGE_DETAILS: string = 'Package details';
  public static CONTINUE_USING_TRIAL: string = 'Continue using trial';
  public static SWITCH_TO_PREMIUM: string = 'Switch to premium';
  public static GO_TO_DASHBOARD: string = 'Go to Dashboard';
  public static PAY_BUTTON: string = 'Pay';
  public static PROCEED_TO_PAY_BUTTON: string = 'Proceed to Pay';
  public static CREATE_NEW_PROJECT_BUTTON: string = 'Create new project';
  public static CONTINUE_WITH_EXISTING_PROJECT_BUTTON: string = 'Continue with existing project';


  //Renew project
  public static PROCEED_TO_PAY: string = 'Proceed to Pay';

}

export class Units {

  public static UNIT = 'sqft';
}

export class ProjectElements {
  public static COST_HEAD = 'CostHead';
  public static WORK_ITEM = ' a WorkItem';
  public static BUILDING = 'Building';
  public static QUANTITY_ITEM = 'Quantity Item';
  public static DIRECT_QUANTITY = 'Direct Quantity';
  public static QUANTITY_DETAILS = ' a Quantity Details';
  public static QUANTITY = 'Quantity';
  public static ATTACHMENT = ' an Attachment';
  public static CATEGORY = 'Category';
  public static SLAB_AREA = 'Slab Area';
  public static SALEABLE_AREA = 'Saleable Area';
  public static CARPET_AREA = 'Carpet Area';
  public static RS_PER_SQFT = 'Rs/Sqft';
  public static RS_SYMBOL_PER_SQFT = '&#8377;/Sqft';
  public static RS_PER_SQMT = 'Rs/Sqmt';
  public static RS_SYMBOL_PER_SQMT = '&#8377;/Sqmt';
  public static SQUAREFEET = 'sqft';
  public static SQUAREMETER = 'sqmt';
  public static RS = 'Rs';
  public static RS_SYMBOL = '&#8377;';
}

export class MaterialTakeOffElements {

  public static TOTAL_QUANTITY = 'Total Quantity';
  public static COST_HEAD_WISE = 'Cost Head wise';
  public static ALL_BUILDINGS = 'All Buildings';
  public static BUILDING = 'Building';
  public static COST_HEAD = 'Cost Head';
  public static MATERIAL_WISE = 'Material wise';
  public static MATERIAL = 'Material';
  public static CONTENT = 'content';
  public static HEADERS = 'headers';
  public static FOOTER = 'footer';
  public static SUB_CONTENT = 'subContent';
  public static COLUMN_ONE = 'columnOne';
  public static COLUMN_TWO = 'columnTwo';
  public static COLUMN_THREE = 'columnThree';
  public static ELEMENT_WISE_REPORT_COST_HEAD = 'costHead';
  public static ELEMENT_WISE_REPORT_MATERIAL = 'material';
  public static ERROR_MESSAGE_MATERIAL_TAKE_OFF_REPORT_OF = 'Material take off report of ';
  public static ERROR_MESSAGE_IS_NOT_FOUND_FOR = ' is not found for ';
  public static ERROR_MESSAGE_BUILDING = ' building.';
  public static SORT = 'sort';
  public static CHECK_SUB_CONTENT_PRESENT = 'checkSubContentPresent';
  public static MATERIAL_TAKE_OFF_REPORT_HEADING = 'Material Take Off Report';
  public static REPORT_EMPTY_MESSAGE = 'There is no estimate entered against any cost head. Kindly enter estimate to generate material take off report.';
}

export class PDFReportHeaders {
  public static COMPANY_NAME = 'Company Name: ';
  public static PROJECT_NAME = 'Project Name: ';
  public static BUILDING_NAME = 'Building Name: ';
  public static BUILDING = 'Building: ';
  public static GENERATED_ON = 'Generated on: ';
  public static DATE_FORMAT = 'dd MMM yyyy';
  public static COST_HEAD_NAME = 'Cost Head Name: ';
  public static MATERIAL_NAME = 'Material Name: ';
}

export class Menus {
  public static COST_SUMMARY = 'Cost Summary';
  public static MATERIAL_TAKEOFF = 'Material Takeoff';
  public static PROJECT_DETAILS = 'Project Details';
  public static MY_PROJECTS = 'My Projects';
  public static CLONE = 'Copy As New Building';
  public static EDIT = 'Edit';
  public static DELETE = 'Delete';
  public static ADD_BUILDING = 'Add Building';
  public static ADD_BUILDING_TO_PROJECT = 'Add Building to Project';
  public static COPY_BUILDING = 'Copy Building';
  public static CREATE_NEW_PROJECT: string = 'Create New Project';
  public static ACCOUNT_SUMMARY: string = 'Account Summary';
}

export class ValueConstant {
//array of actions for copy building
  public static CLONE_ITEMS: string[] = ['Cost Head', 'Category', 'Work Item', 'Quantity', 'Rate Analysis'];
  public static STEEL_DIAMETER_VALUES: Number[] = [6,8,10,12,16,20,25,30];
  public static STEEL_DIAMETER_STRING_VALUES: string[] = ['6mm Steel','8mm Steel','10mm Steel','12mm Steel','16mm Steel','20mm Steel','25mm Steel','30mm Steel'];
  public static TOTAL_STEEL_DIAMETER_STRING_VALUES: string[] = ['totalWeightOf6mm','totalWeightOf8mm','totalWeightOf10mm','totalWeightOf12mm','totalWeightOf16mm','totalWeightOf20mm','totalWeightOf25mm','totalWeightOf30mm'];
  public static NUMBER_OF_FRACTION_DIGIT = 2;
  public static FILE_SIZE = 5000000;
  public static NO_OF_BUILDINGS_VALUES :Number[]= [2,3,4,5];

}

export class FileAttachment {
  public static EXTENSIONS_FOR_FILE = new Array();
}

export class CurrentView {

  public static COST_SUMMARY = 'costSummary';
  public static MATERIAL_TAKE_OFF = 'materialTakeOff';
  public static PROJECT_DETAILS = 'projectDetails';
  public static BILLING_DETAILS = 'billingDetails';
}

export class ScrollView {

  public static GO_TO_RECENT_BUILDING = 'goToRecentBuilding';
}

export class StandardNotes {
  public static Notes = '<ul><li><p>The material consumption constants and rate are based on various sources' +
    ' from the construction industry. This information may vary from project-to-project or' +
    ' place-to-place depending on construction methods and practices.</p></li>' +
    '<li><p>The material consumption constants are including wastages as per standard practices.</p></li>' +
    '<li><p>The contents/services under this rate analysis shall be used only for reference. The user shall verify the' +
    ' content before using it. Big Slice Technologies Pvt. Ltd. (OPC) shall not be held responsible for any' +
    ' consequences resulted due to use of the contents/services of this rate analysis.</p></li></ul>';
}

export class Animations {

  public static defaultDelayFactor = 0.03;

  public static getListItemAnimationStyle(index : number, delayFactor : number) {
    return {
      'transition-delay': index * delayFactor + 's',
      'opacity': 1
    };
  }
}
