export class AppSettings {
  public static IP = 'http://localhost:8080';
  //public static IP = 'http://52.66.120.228'; // build info staging
  public static HOST_NAME = 'localhost:8080';
  //public static HOST_NAME = '52.66.120.228';

  public static get API_ENDPOINT(): string {
    return this.IP + '/api/';
  }

  public static INITIAL_THEM = 'container-fluid dark-theme';
  public static LIGHT_THEM = 'container-fluid light-theme';
  public static IS_SOCIAL_LOGIN_YES = 'YES';
  public static IS_SOCIAL_LOGIN_NO = 'NO';
  public static HTTP_CLIENT = 'http://';
}


export class Messages {
  public static FROM_REGISTRATION = 'registration';
  public static FROM_ACCOUNT_DETAIL = 'accountdetail';

  public static MSG_SUCCESS_LOGIN: string = 'You are successfully signed in.';
  public static MSG_SUCCESS_REGISTRATION: string = 'Kindly verify your account.';
  public static MSG_SUCCESS_CHANGE_MOBILE_NUMBER: string = 'Mobile number updated successfully.';
  public static MSG_SUCCESS_RESEND_VERIFICATION_CODE: string = 'New OTP (One Time Password) has been sent to your registered mobile number';
  public static MSG_SUCCESS_RESEND_VERIFICATION_CODE_RESEND_OTP: string = 'New OTP (One Time Password) has been sent to your new mobile number';
  public static MSG_SUCCESS_MAIL_VERIFICATION: string = 'Verification e-mail sent successfully to your e-mail account.';
  public static MSG_SUCCESS_RESET_PASSWORD: string = 'Your password is reset successfully.Kindly login';
  public static MSG_SUCCESS_CHANGE_PASSWORD: string = 'Your password has been changed successfully.';
  public static MSG_SUCCESS_CHANGE_EMAIL: string = 'A verification email is sent to your new email id. Current email id will be active till you verify new email id.';
  public static MSG_SUCCESS_FORGOT_PASSWORD: string = 'Email for password reset has been sent successfully on your registered email id.';
  public static MSG_SUCCESS_DASHBOARD_PROFILE: string = 'Your profile updated successfully.';
  public static MSG_SUCCESS_ATTACH_DOCUMENT: string = 'Your document attached successfully.';
  public static MSG_SUCCESS_UPLOADED_DOCUMENT: string = 'Document successfully uploaded.';
  public static MSG_SUCCESS_CONTACT: string = 'Email sent successfully.';
  public static MSG_SUCCESS_CHANGE_THEME: string = 'Theme changed successfully.';
  public static MSG_SUCCESS_MAIL_VERIFICATION_RESULT_STATUS: string = 'Congratulations!';
  public static MSG_CHANGE_PASSWORD_SUCCESS_HEADER: string = 'Password Changed Successfully';
  public static MSG_SUCCESS_MAIL_VERIFICATION_BODY: string = 'Your account verified successfully.' +
    'You may start using it immediately by clicking on Sign In!';

  public static MSG_ERROR_MAIL_VERIFICATION_BODY: string = 'Your account verification failed due to invalid access token!';
  public static MSG_ERROR_MAIL_VERIFICATION_RESULT_STATUS: string = 'Sorry.';
  public static MSG_ERROR_REGISTRATION: string = 'Failed to register new user.';
  public static MSG_ERROR_CHANGE_PASSWORD: string = 'Failed to change password.';
  public static MSG_ERROR_CHANGE_EMAIL: string = 'Failed to change email.';
  public static MSG_ERROR_FORGOT_PASSWORD: string = 'Failed to reset password.';
  public static MSG_ERROR_DASHBOARD_PROFILE: string = 'Failed to update profile.';
  public static MSG_ERROR_CONTACT: string = 'Failed to send email.';
  public static MSG_ERROR_DASHBOARD_PROFILE_PIC: string = 'Failed to change profile picture.';
  public static MSG_ERROR_ATTACH_DOCUMENT: string = 'Failed to attach document.';
  public static MSG_ERROR_CHANGE_THEME: string = 'Failed to change theme.';
  public static MSG_ERROR_TOKEN_SESSION: string = 'Session has been expired.';
  public static MSG_ERROR_NETWORK: string = 'Internal Server Error.';
  public static MSG_ERROR_SERVER_ERROR: string = 'Server error.';
  public static MSG_ERROR_SOMETHING_WRONG: string = 'Internal Server Error.';
  public static MSG_ERROR_IMAGE_TYPE: string = 'Please try again. Make sure to upload only image file with extensions JPG, JPEG, GIF, PNG.';
  public static MSG_ERROR_IMAGE_SIZE: string = 'Please make sure the image size is less than 5 MB.';
  public static MSG_ERROR_DOCUMENT_SIZE: string = 'Please make sure the document size is less than 5 MB.';

  public static MSG_ERROR_VALIDATION_EMAIL_REQUIRED = 'Enter your e-mail address.';
  public static MSG_ERROR_VALIDATION_WEBSITE_REQUIRED = 'Enter company website.';
  public static MSG_ERROR_VALIDATION_PASSWORD_REQUIRED = 'Enter your password.';
  public static MSG_ERROR_VALIDATION_NEWPASSWORD_REQUIRED = 'Enter a new password';
  public static MSG_ERROR_VALIDATION_CONFIRMPASSWORD_REQUIRED = 'Confirm your password';
  public static MSG_ERROR_VALIDATION_CURRENTPASSWORD_REQUIRED = 'Enter a current password';
  public static MSG_ERROR_VALIDATION_FIRSTNAME_REQUIRED = 'This field can\'t be left blank';
  public static MSG_ERROR_VALIDATION_LASTNAME_REQUIRED = 'This field can\'t be left blank';
  public static MSG_ERROR_VALIDATION_MOBILE_NUMBER_REQUIRED = 'This field can\'t be left blank.';
  public static MSG_ERROR_VALIDATION_PIN_REQUIRED = 'Enter your pin code.';
  public static MSG_ERROR_VALIDATION_DESCRIPTION_REQUIRED = 'Enter the name of the document you are uploading.';
  public static MSG_ERROR_VALIDATION_ABOUT_COMPANY_REQUIRED = 'Give a brief description about your company. This will be seen by candidates as a part of the job profile.';
  public static MSG_ERROR_VALIDATION_COMPANYNAME_REQUIRED = 'This field can\'t be left blank.';
  public static MSG_ERROR_VALIDATION_OTP_REQUIRED = 'Enter received OTP.';
  public static MSG_ERROR_VALIDATION_INVALID_EMAIL_REQUIRED = 'Enter a valid email address.';
  public static MSG_ERROR_VALIDATION_INVALID_URL_REQUIRED = 'Website is not valid.';
  public static MSG_ERROR_VALIDATION_INVALID_NAME = 'Enter valid name.';
  public static MSG_ERROR_VALIDATION_INVALID_DATA = 'Enter valid data.';
  public static MSG_ERROR_VALIDATION_PASSWORD_MISMATCHED = 'Passwords do not match.';
  public static MSG_ERROR_VALIDATION_BIRTHYEAR_REQUIRED = 'This field can\'t be left blank.';
  public static MSG_ERROR_VALIDATION_BIRTHYEAR_INVALID = 'Enter valid birth-year';
  public static MSG_ERROR_VALIDATION_LOCATION_REQUIRED = 'This field can\'t be left blank.';
  public static MSG_ERROR_VALIDATION_INVALID_LOCATION = 'Enter valid location';
  public static MSG_ERROR_VALIDATION_HEADQUARTER_REQUIRED = 'This field can\'t be left blank.';
  public static MSG_ERROR_VALIDATION_COMPANYSIZE_REQUIRED = 'This field can\'t be left blank.';
  public static MSG_ERROR_VALIDATION_OTP_MOBILE_NUMBER = 'Please provide a valid mobile number.';
  public static MSG_ERROR_VALIDATION_PASSWORD = 'Password must be Alfa-Numeric having minimum 8 Characters.';
  public static MSG_ERROR_VALIDATION_PIN_NUMBER = 'Pin code should not be greater than 20 characters.';
  public static MSG_ERROR_VALIDATION_TERMS_AND_CONDITIONS_REQUIRED = 'Please accept the terms and conditions.';

  public static MSG_ERROR_VALIDATION_PROJECT_NAME_REQUIRED = 'Enter project name.';
  public static MSG_ERROR_VALIDATION_PROJECT_ADDRESS_REQUIRED = 'Enter project address.';
  public static MSG_ERROR_VALIDATION_PLOT_AREA_REQUIRED = 'Enter plot area.';
  public static MSG_ERROR_VALIDATION_PROJECT_DURATION_REQUIRED = 'Enter project duration.';
  public static MSG_ERROR_VALIDATION_PLOT_PERIPHERY_REQUIRED = 'Enter plot periphery.';

    public static MSG_ERROR_VALIDATION_BUILDING_NAME_REQUIRED = 'Enter Building Name.';
    public static MSG_ERROR_VALIDATION_SLAB_AREA_REQUIRED = 'Enter Slab Area.';
    public static MSG_ERROR_VALIDATION_CARPET_AREA_REQUIRED = 'Enter Carpet Area.';
    public static MSG_ERROR_VALIDATION_PARKING_AREA_REQUIRED  = 'Enter Parking Area.';
    public static MSG_ERROR_VALIDATION_SALEBLE_AREA_REQUIRED  = 'Enter Saleble Area.';
    public static MSG_ERROR_VALIDATION_ONE_BHK_REQUIRED = 'Enter No of one BHKs.';
    public static MSG_ERROR_VALIDATION_TWO_BHK_REQUIRED = 'Enter No of two BHKs.';
    public static MSG_ERROR_VALIDATION_THREE_BHK_REQUIRED = 'Enter No of three BHKs.';
    public static MSG_ERROR_VALIDATION_NO_OF_SLABS_REQUIRED = 'Enter No of slabs.';
    public static MSG_ERROR_VALIDATION_NO_OF_LIFTS_REQUIRED = 'Enter No of lifts';

  public static MSG_LANDING_PAGE = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' +
    'Nullam sem turpis, sodales eu urna sed, posuere finibus leo finibus.' +
    'Sed et lorem eu mi tincidunt fringilla at non odio.' +
    'Vivamus auctor quam a lobortis tincidunt. Aliquam faucibus nulla lorem, sed imperdiet justo bibendum ac. In' +
    'semper rutrum metus fringilla mollis.';
  public static MSG_RESET_MOBILE_NUMBER = 'Enter your new mobile number and we will send you a verification code on mobile' +
    ' number you have entered.';
  public static MSG_RESET_EMAIL_ADDRESS = 'Enter your new account email address and we will send you a link to reset your email' +
    'address.';
  public static MSG_EMAIL_ACTIVATION = 'Your email has been activated. You may start using your account with new email address' +
    'immediately.';
  public static MSG_CONTACT_US = 'Please provide the following details and we will get back to you soon.';
  public static MSG_YEAR_NO_MATCH_FOUND = 'The year doesn\'t look right. Be sure to use your actual year of birth.';
  public static MSG_FORGOT_PASSWORD = 'Enter your account e-mail address and we\'ll help you create a new password.';
  public static MSG_CONFIRM_PASSWORD = ' Passwords do not match.';
  public static MSG_CHANGE_PASSWORD_SUCCESS ='Password changed successfully. You can Sign In again with new password by clicking on "YES" button, Please' +
    ' click on "No" button to continue the session.';
  public static MSG_VERIFY_USER_1 = 'You are almost done!';
  public static MSG_VERIFY_USER_2 = 'We need to verify your mobile number before you can start using the system.';
  public static MSG_VERIFY_USER_3 = 'One Time Password(OTP) will be sent on following mobile number.';
  public static MSG_VERIFY_USER_4 = 'You are almost done! We need to verify your email id before you can start using the system.';
  public static MSG_EMAIL_NOT_MATCH = 'E-mail does not match.';
  public static MSG_CHANGE_PASSWORD = 'Your password protects your account so password must be strong.' +
    'Changing your password will sign you out of all your devices, including your phone.' +
    'You will need to enter your new password on all your devices.';
  public static MSG_CHANGE_THEME = 'Please click on the below option to change the theme.';
  public static MSG_MOBILE_NUMBER_NOT_MATCH = 'Mobile Number does not match.';
  public static MSG_MOBILE_NUMBER_Change_SUCCESS = 'Mobile number changed successfully.You can Sign In again by clicking on "yes" button, please click on "No"' +
    'button to continue the session.';
  public static MSG_MOBILE_VERIFICATION_TITLE = 'Verify Your Mobile Number';
  public static MSG_MOBILE_NUMBER_CHANGE_VERIFICATION_TITLE = 'Verify Your  New Mobile Number';
  public static MSG_MOBILE_VERIFICATION_MESSAGE = 'Please enter the verification code sent to your mobile number.';
  public static MSG_MOBILE_NUMBER_CHANGE_VERIFICATION_MESSAGE = 'Please enter the verification code sent to your new mobile number.';
  public static MSG_MOBILE_VERIFICATION_SUCCUSS_HEADING = 'Congratulations!';
  public static MSG_MOBILE_VERIFICATION_SUCCUSS_TEXT = 'Registration successful. Kindly Sign In';
  public static CONTACT_US_ADDRESS = 'Blog. No. 14, 1st Floor, Electronic Estate, Parvati, Pune-Satara Road, Pune 411009, MH, INDIA.';
  public static CONTACT_US_CONTACT_NUMBER_1 = '+91 (20) 2421 8865';
  public static CONTACT_US_CONTACT_NUMBER_2 = '+91 98233 18865';
  public static CONTACT_US_EMAIL_1 = 'sales@techprimelab.com';
  public static CONTACT_US_EMAIL_2 = 'careers@techprimelab.com';
  public static MSG_EMAIL_VERIFICATION_HEADING = 'Your email is updated successfully.';
  public static MSG_EMAIL_VERIFICATION_MESSAGE = 'Kindly click on SIGN IN to use JobMosis.';
  public static MSG_ACTIVATE_USER_HEADING = 'Congratulations! Welcome To JobMosis.';
  public static MSG_ACTIVATE_USER_SUB_HEADING = 'You can now find candidates using the highly accurate, simpler, faster and powerful solution.';
  public static MSG_ACTIVATE_USER_MESSAGE = 'Your account has been created successfully. Kindly click Sign In.';
  public static MSG_VERIFICATION_EMAIL = 'Your account has been created successfully. Kindly click Sign In.';
  public static MSG_COMPANY_DOCUMENTS = 'Please upload relevant company documents to activate your account.';
  public static MSG_UPLOAD_FILE = 'Please select a file to upload.';
  public static MSG_ABOUT_US_DISCRIPTION = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' +
    'Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s' +
    'when an unknown printer took a galley of type and scrambled it to make a type specimen book.' +
    'It has survived not only five centuries, but also the leap into electronic typesetting,remaining essentially ' +
    'unchanged. ' +
    'It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,' +
    'and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.';
  public static BROWSER_ALERT_MSG = 'This application is certified on Google chrome browser. Switch to chrome for better experience.';
  public static FAQ_CONTACT_NUMBER = '+91-123456789';
  public static FAQ_CONTACT_EMAIL = 'support@gmail.com';
  public static FAQ_MESSAGE = 'Have any questions?';
  public static GUIDE_MESSAGE_FOR_NEW_VIEWER = 'Thank you for showing interest, ' +
    'we will need your basic information to create your value portrait on JobMosis. Go ahead, ' +
    'fill the form and get your value portrait!';
  public static NOT_FOUND_INFORMATION = 'The page you are looking for doesn\'t exist<br/>' +
    'or an other error ocourred.';
  public static PAGE_NOT_FOUND = 'Page Not Found';
  public static PASSWORD_MESSAGE = 'Password must be alphanumeric having minimum 8 Characters.';

  //Application Messages
  public static MSG_SUCCESS_PROJECT_CREATION: string = 'Project has been successfully created.';
  public static MSG_SUCCESS_ADD_BUILDING_PROJECT: string = 'Building has been successfully added to Project.';
  public static MSG_SUCCESS_UPDATE_PROJECT_DETAILS: string = 'Your project updated successfully.';
  public static MSG_SUCCESS_UPDATE_BUILDING_DETAILS: string = 'Your building details updated successfully.';
  public static MSG_SUCCESS_DELETE_BUILDING: string = 'Your building deleted successfully.';

  public static MSG_SUCCESS_DELETE_COSTHEAD: string = 'Your costhead deleted successfully.';
  public static MSG_SUCCESS_DELETE_ITEM: string = 'Your item deleted successfully.';
  public static MSG_SUCCESS_ADD_ITEM: string = 'Your item added successfully.';
  public static MSG_FAIL_ADD_ITEM: string = 'Add new item failed : ';
  public static MSG_SUCCESS_SAVED_COST_HEAD_ITEM: string = 'Your cost head items updated successfully.';
  public static MSG_SUCCESS_DELETE_COSTHEAD_WORKITEM: string = 'Your costhead workitem deleted successfully.';
}

export class NavigationRoutes {
  public static APP_REGISTRATION: string = '/registration';
  public static APP_FORGOTPASSWORD: string = '/forgot-password';
  public static APP_PROJECT: string = '/project';
  public static APP_CREATE_PROJECT: string = 'project/create';
  public static APP_VIEW_PROJECT: string = 'project/view';
  public static APP_VIEW_BUILDINGS: string = 'building/view';
  public static APP_LIST_BUILDINGS: string = 'building/list';
  public static APP_VIEW_BUILDING_DETAILS: string = 'building/details';
  public static APP_CREATE_BUILDING: string = 'building/create';
  public static APP_LIST_PROJECT: string = 'project/list';
  public static APP_COST_SUMMARY: string = 'project/cost-summary';
  public static APP_COST_HEAD: string = 'project/cost-summary/cost-head';
  public static APP_DASHBOARD: string = '/dashboard';
  public static APP_USER_DASHBOARD: string = '/user';
  public static APP_USER__DETAILS_DASHBOARD: string = '/user/details';
  public static APP_LOGIN: string = '/signin';
  public static APP_START: string = '/';
  public static APP_LANDING: string = '/signin';
  public static VERIFY_USER: string = '/verify-user';
  public static ACTIVATE_USER: string = '/activate-user';
  public static VERIFY_PHONE: string = '/verify-phone';
  public static APP_CHANGEEMAIL: string = '/change-email';
}

export class SessionStorage {
  public static ACCESS_TOKEN = 'access_token';
  public static IS_THEME_SELECTED = 'is_theme_selected';
  public static IS_SOCIAL_LOGIN = 'is_social_login';
  public static PROFILE_PICTURE = 'profile_picture';
  public static IS_LOGGED_IN = 'is_user_logged_in';
  public static USER_ID = 'user_id';
  public static _ID = '_id';
  public static MOBILE_NUMBER = 'mobile_number';
  public static VERIFIED_MOBILE_NUMBER = 'verified_mobile_number';
  public static COMPANY_NAME = 'company_name';
  public static FIRST_NAME = 'first_name';
  public static LAST_NAME = 'last_name';
  public static TEMP_MOBILE = 'temp_mobile';
  public static TEMP_EMAIL = 'temp_email';
  public static EMAIL_ID = 'email_id';
  public static PASSWORD = 'password';
  public static MY_THEME = 'my_theme';
  public static ROLE_NAME = 'role';
  public static VERIFY_PHONE_VALUE = 'verify_phone_value';
  public static CHANGE_MAIL_VALUE = 'change_mail_value';
  public static VERIFY_CHANGE_PHONE_VALUE = 'verify_change_phone_value';
  public static CURRENT_PROJECT = 'current_project_id';
  public static CURRENT_BUILDING = 'current_building_id';
}

export class LocalStorage {
  public static ACCESS_TOKEN = 'access_token';
  public static IS_LOGGED_IN = 'is_user_logged_in';
  public static _ID = '_id';
}

export class ValueConstant {
  public static MAX_YEAR_LIST: number = 60;
  public static MAX_ACADEMIC_YEAR_LIST: number = 50;
}


export class API {
  public static NOTIFICATION = 'notification';
  public static SEND_CONFIRMATION_MAIL_TO_RECRUITER = 'response_to_recruiter';
  public static SEND_NOTIFICATION_TO_RECRUITER = 'notify_recruiter';
  public static USAGETRACKING = 'usagetracking';
  public static SEND_MAIL = 'sendmail';
  public static SEND_TO_ADMIN_MAIL = 'sendmailtoadmin';
  public static USER_PROFILE = 'user';
  public static UPDATE_USER = 'updateUser';
  public static ALL_USER_PROFILE = 'alluser';
  public static USAGE_DETAIL = 'usageDetails';
  public static KEY_SKILLS = 'keySkills';
  public static CANDIDATE_PROFILE = 'user';
  public static CANDIDATE_DETAIL_PROFILE = 'candidateDetails';
  public static RECRUITER_DETAIL_PROFILE = 'recruiterDetails';
  public static GET_CANDIDATE_DETAILS = 'getCandidateDetails';
  public static GET_RECRUITER_DETAILS = 'getRecruiterDetails';
  public static EXPORT_CANDIDATE_DETAIL_PROFILE = 'exportCandidateDetails';
  public static EXPORT_RECRUITER_DETAIL_PROFILE = 'exportRecruiterDetails';
  public static USER_DETAILS = 'userDetails';
  public static USER_DATA = 'userData';
  public static RECRUITER_PROFILE = 'recruiter';
  public static JOBS = 'jobs';
  public static PROFESSIONAL_DATA = 'professionaldata';
  public static EMPLOYMENTHISTORY = 'employmentdata';
  public static LOGIN = 'user/login';
  public static FB_LOGIN = 'fbLogin';
  public static SEARCHED_CANDIDATE = 'searchedcandidate';
  public static SEARCH_CANDIDATE = 'recruiter/candidate';
  public static CHANGE_PASSWORD = 'user/change/password';
  public static CHANGE_MOBILE = 'user/change/mobileNumber';
  public static CHANGE_EMAIL = 'user/change/emailId';
  public static CHANGE_COMPANY_ACCOUNT_DETAILS = 'changerecruiteraccountdetails';
  public static VERIFY_CHANGED_EMAIL = 'user/verify/changedEmailId';
  public static VERIFY_USER = 'user/verifyAccount';
  public static VERIFY_EMAIL = 'user/verifyEmail';
  public static GENERATE_OTP = 'user/generateotp';
  public static VERIFY_OTP = 'user/verify/otp';
  public static VERIFY_MOBILE = 'user/verify/mobileNumber';
  public static SEND_VERIFICATION_MAIL = 'sendverificationmail';
  public static FORGOT_PASSWORD = 'user/forgotpassword';
  public static UPDATE_PICTURE = 'user/updatepicture';
  public static UPLOAD_DOCUMENTS = 'uploaddocuments';
  public static CHANGE_THEME = 'changetheme';
  public static RESET_PASSWORD = 'user/resetpassword';
  public static GOOGLE_LOGIN = 'googlelogin';
  public static INDUSTRY_PROFILE = 'industryprofile';
  public static INDUSTRY_LIST = 'industry';
  public static REALOCATION = 'realocation';
  public static EDUCATION = 'education';
  public static EDUCATIONDEGREES = 'educationdegrees';
  public static EXPERIENCE = 'experience';
  public static CURRENTSALARY = 'currentsalary';
  public static NOTICEPERIOD = 'noticeperiod';
  public static INDUSTRYEXPOSURE = 'industryexposure';
  public static PROFICIENCYLIST = 'proficiency';
  public static CAPABILITY_MATRIX_FOR_CANDIDATE = 'capabilitymatrix/candidate';
  public static CAPABILITY_MATRIX_FOR_RECRUITER = 'capabilitymatrix/recruiter/jobProfile';
  public static DOMAINLIST = 'domain';
  public static CAPABILITY_LIST = 'capability';
  public static ROLE_LIST = 'roles';
  public static COMPANY_DETAILS: string = 'companydetails';
  public static ADDRESS = 'address';
  public static ROLE_TYPE = 'roletype';
  public static JOB_LIST = 'recruiter';
  public static JOB_DETAILS = 'recruiter/jobProfile';
  public static SHORTLIST_CANDIDATE = 'shortlistedcandidate';
  public static CANDIDATE_DETAILS = 'recruiter/jobProfile';
  public static CANDIDATES_FROM_LISTS = 'recruiter/jobProfile';
  public static RElEVENT_INDUSTRIES = 'releventindustries';
  public static JOB = 'job';
  public static FAQ = '/blog/index.php/faq/';
  public static ACCEPT_TERMS = '/terms-and-conditions.php';
  public static COUNT_OF_USERS = 'countofusers';
  public static FEEDBACK_QUESTIONS = 'userFeedback';
  public static RECRUITER_CANDIDATES_SUMMARY = 'recruiterCandidatesSummary';
  public static EXPORT_RECRUITER_CANDIDATES_SUMMARY = 'exportRecruiterCandidatesSummary';
  public static RECRUITER = 'recruiter';


  //Project
  public static USER_ALL_PROJECTS = 'user/all/project';
  public static VIEW_PROJECT = 'project';
  public static PROJECT_BUILDINGS = 'user/all/building';
  public static ADD_BUILDING = 'building';
  public static VIEW_BUILDING = 'building';
  public static CLONE = 'clone';


  public static THUMBRULE_RULE_RATE='report/thumbRuleRate';
  public static RATE='rate';
  public static SQFT='sqft';
  public static SQM='sqmt';
  public static AREA='area';
  public static SLAB_AREA='slabArea';
  public static SALEABLE_AREA='saleableArea';

  public static QUANTITY='quantity/costhead';

}

export class ImagePath {
  public static FAV_ICON = './assets/framework/images/logo/favicon.ico';
  public static BODY_BACKGROUND = './assets/framework/images/page_background/page-bg.png';
  public static MY_WHITE_LOGO = './assets/c-next/header/job-mosis-logo.png';
  public static MOBILE_WHITE_LOGO = './assets/c-next/header/buildInfo-logo.jpg';
  public static FACEBOOK_ICON = './assets/framework/images/footer/fb.svg';
  public static GOOGLE_ICON = './assets/framework/images/footer/google-plus.svg';
  public static LINKEDIN_ICON = './assets/framework/images/footer/linked-in.svg';
  public static PROFILE_IMG_ICON = './assets/framework/images/dashboard/default-profile.png';
  public static COMPANY_LOGO_IMG_ICON = './assets/framework/images/dashboard/default-company-logo.png';
  public static EMAIL_ICON = './assets/framework/images/icons/e-mail.svg';
  public static EMAIL_ICON_GREY = './assets/framework/images/icons/e-mail-grey.svg';
  public static NEW_EMAIL_ICON = './assets/framework/images/icons/new-e-mail.svg';
  public static NEW_EMAIL_ICON_GREY = './assets/framework/images/icons/new-e-mail-grey.svg';
  public static CONFIRM_EMAIL_ICON = './assets/framework/images/icons/confirm-e-mail.svg';
  public static CONFIRM_EMAIL_ICON_GREY = './assets/framework/images/icons/confirm-e-mail-grey.svg';
  public static PASSWORD_ICON = './assets/framework/images/icons/password.svg';
  public static PASSWORD_ICON_GREY = './assets/framework/images/icons/password-grey.svg';
  public static NEW_PASSWORD_ICON = './assets/framework/images/icons/new-password.svg';
  public static NEW_PASSWORD_ICON_GREY = './assets/framework/images/icons/new-password-grey.svg';
  public static CONFIRM_PASSWORD_ICON = './assets/framework/images/icons/confirm-password.svg';
  public static CONFIRM_PASSWORD_ICON_GREY = './assets/framework/images/icons/confirm-password-grey.svg';
  public static MOBILE_ICON = './assets/framework/images/icons/mobile.svg';
  public static MOBILE_ICON_GREY = './assets/framework/images/icons/mobile-grey.svg';
  public static NEW_MOBILE_ICON = './assets/framework/images/icons/new-mobile.svg';
  public static NEW_MOBILE_ICON_GREY = './assets/framework/images/icons/new-mobile-grey.svg';
  public static CONFIRM_MOBILE_ICON = './assets/framework/images/icons/confirm-mobile.svg';
  public static CONFIRM_MOBILE_ICON_GREY = './assets/framework/images/icons/confirm-mobile-grey.svg';
  public static FIRST_NAME_ICON = './assets/framework/images/icons/first-name.svg';
  public static FIRST_NAME_ICON_GREY = './assets/framework/images/icons/first-name-grey.svg';
  public static LAST_NAME_ICON = './assets/framework/images/icons/last-name.svg';
  public static LAST_NAME_ICON_GREY = './assets/framework/images/icons/last-name-grey.svg';
  public static GET_SET_GO = './assets/c-next/get-set-go/get_set_go.gif';
  public static CALENDAR = './assets/c-next/post-job/calendar.png';
  public static CONTACT_PERSON = './assets/c-next/post-job/contact-person.png';
  public static INFO_RED = './assets/framework/images/dashboard/info-red.svg';
}

export class ProjectAsset {
  static _year: Date = new Date();
  static currentYear = ProjectAsset._year.getFullYear();
  public static APP_NAME = 'Cost Control';
  public static TAG_LINE = 'Help you to decide cost';
  public static UNDER_LICENECE = '© ' + ProjectAsset.currentYear + ' www.buildinfo.com';
}

export class Tooltip {
}

export class Headings {
  public static ACADAMIC_DETAILS: string = 'Academic Details';
  public static OPTIONAL: string = '(Optional)';
  public static MANDATORY: string = '(Mandatory)';
  public static ANYONE: string = '(Any One)';
  public static ABOUT_MYSELF: string = 'About Myself';
  public static CHANGE_PASSWORD: string = 'Change Password';
  public static ACCOUNT_DETAILS_HEADING: string = 'Account Details';
  public static CHANGE_EMAIL_HEADING: string = 'Change your Email';
  public static CHANGE_MOBILE_NUMBER_HEADING: string = 'Change Your Mobile Number';
  public static CHANGE_COMPANY_WEBSITE_HEADING: string = 'Change Your Company Website';
  public static RESET_PASSWORD_HEADING: string = 'RESET PASSWORD';
}

export class Label {
  public static CURRENT_PASSWORD_LABEL: string = 'Current Password';
  public static NEW_PASSWORD_LABEL: string = 'New Password';
  public static PASSWORD: string = 'Password';
  public static YEAR_OF_BIRTH: string = 'Year of Birth';
  public static CONFIRM_PASSWORD_LABEL: string = 'Confirm Password';
  public static FIRST_NAME_LABEL: string = 'First Name';
  public static COMPANY_NAME_LABEL: string = 'Company Name';
  public static LAST_NAME_LABEL: string = 'Last Name';
  public static EMAIL_FIELD_LABEL: string = 'Email';
  public static CREATE_PROFILE_LABEL: string = 'Create Profile';
  public static COMPANY_WEBSITE_FIELD_LABEL: string = 'Website';
  public static CONTACT_FIELD_LABEL: string = 'Mobile Number';
  public static SAVE_PROFILE_LABEL: string = 'Save Profile';
  public static RESET_PASSWORD_MESSAGE: string = 'Please set new password for your';
  public static CURRENT_LOCATION: string = 'Current Location';
  public static ACTIVATION_STATUS: string = 'Activation Status';
  public static NAME: string = 'Name';
  public static ACTIONS: string = 'Actions';
  public static API_KEY: string = 'API Key';
  public static ACCEPT_NAME: string = 'I accept the';
  public static TERMS_AND_CONDITIONS_NAME: string = 'Terms and Conditions.';
  public static REGISTER_AS_APPLICANT: string = 'Register as an applicant';
  public static SUBMIT_PROFILE: string = 'Submit Your Profile';
  public static MORE: string = 'More';
  public static NOT_FOUND_ERROR: string = '404';
  public static YEARS: string = '(Years)';
  public static NONE: string = 'None';
  public static REMENBER_ME: string = 'Remember me';
}

export class Button {
  public static CHANGE_PASSWORD_BUTTON: string = 'Change Password';
  public static RESET_PASSWORD_BUTTON: string = 'RESET PASSWORD';
  public static CLONE_BUTTON: string = 'CLONE';
  public static CLOSE_BUTTON: string = 'CLOSE';
  public static CANCEL_BUTTON: string = 'Cancel';
  public static SUBMIT_PROFILE: string = 'Submit My Profile';
  public static VIEW_AND_EDIT: string = 'View and Edit';
  public static PROCEED: string = 'Proceed';
  public static NEXT: string = 'Next';
  public static SUBMIT: string = 'Submit';
  public static DOWNLOAD: string = 'Download';
  public static BACK_TO_HOME: string = 'Back to home';
  public static CREATE_MY_ACCOUNT: string = 'Create my account';
}
