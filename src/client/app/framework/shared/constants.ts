export class AppSettings {
  //public static IP = 'http://localhost:8080';
// public static IP = 'http://ee802b7f.ngrok.io';
// public static IP = 'http://10.192.33.252:8087';
  //public static IP = 'http://54.167.209.10:8080';
  public static IP = '';

    public static get API_ENDPOINT():string {
        return this.IP + '/api/';
    }

    public static INITIAL_THEM = 'container-fluid dark-theme';
    public static LIGHT_THEM = 'container-fluid light-theme';
    public static IS_SOCIAL_LOGIN_YES = 'YES';
    public static IS_SOCIAL_LOGIN_NO = 'NO';
}

export class Messages {
  public static MSG_SUCCESS_LOGIN: string = 'You are successfully logged in';
  public static MSG_SUCCESS_REGISTRATION: string = 'Kindly verify your account';
  public static MSG_SUCCESS_CHANGE_MOBILE_NUMBER: string = 'Mobile number changed successgully.';
  public static MSG_SUCCESS_RESEND_VERIFICATION_CODE: string = 'New One Time Password (OTP) sent on your mobile number.';
  public static MSG_SUCCESS_MAIL_VERIFICATION: string = 'Email has been sent successfully on your email.Kindly verify your account';
  public static MSG_SUCCESS_NEWREGISTRATION: string = 'Registration successful with Mobile Number verification.Kindly login';
  public static MSG_SUCCESS_RESET_PASSWORD: string = 'Your password reset successfully';
  public static MSG_SUCCESS_CHANGE_PASSWORD: string = 'Your password has been changed successfully';
  public static MSG_SUCCESS_CHANGE_EMAIL: string = 'Kindly click on the link sent on your new email to activate your account';
  public static MSG_SUCCESS_CHANGE_MOBILE: string = 'Verify your new mobile number by entering OTP sent on your number';
  public static MSG_SUCCESS_FORGOT_PASSWORD: string = 'Email has been sent successfully on your registered email to reset password';
  public static MSG_SUCCESS_DASHBOARD_PROFILE: string = 'Your Profile Updated Successfully';
  public static MSG_SUCCESS_DASHBOARD_PROFILE_PIC: string = 'Your profile picture updated successfully.';
  public static MSG_SUCCESS_UPLOAD_DOCUMENT: string = 'Your document uploaded successfully.';
  public static MSG_SUCCESS_CONTACT: string = 'Email sent successfully.';
  public static MSG_SUCCESS_CHANGE_THEME: string = 'Theme changed successfully.';
  public static MSG_SUCCESS_MAIL_VERIFICATION_RESULT_STATUS: string ='Congratulations';
  public static MSG_SUCCESS_MAIL_VERIFICATION_BODY: string = 'Your account verified successfully.' +
    'You may start using it immediatly right now.Click on Login!';
    public static MSG_ERROR_MAIL_VERIFICATION_BODY: string = 'Your account verification failed due to invalid access token!';
    public static MSG_ERROR_MAIL_VERIFICATION_RESULT_STATUS: string ='Sorry';
    public static MSG_ERROR_LOGIN:string = 'Failed to login';
    public static MSG_ERROR_FB_LOGIN:string = 'Failed to Facebook login';
    public static MSG_ERROR_REGISTRATION:string = 'Failed to new user registration';
    public static MSG_ERROR_CHANGE_PASSWORD:string = 'Failed to change password';
    public static MSG_ERROR_CHANGE_EMAIL:string = 'Failed to change email';
    public static MSG_ERROR_FORGOT_PASSWORD:string = 'Failed to reset password';
    public static MSG_ERROR_DASHBOARD_PROFILE:string = 'Failed to Update Profile ';
    public static MSG_ERROR_CONTACT:string = 'Failed to send mail';
    public static MSG_ERROR_DASHBOARD_PROFILE_PIC:string = 'Failed to Change Profile Picture';
    public static MSG_ERROR_UPLOAD_DOCUMENT:string = 'Failed to Upload Document';
    public static MSG_ERROR_CHANGE_THEME:string = 'Failed to Change Theme';

    public static MSG_ERROR_TOKEN_SESSION:string = 'Session has been Expired.';
    public static MSG_ERROR_NETWORK:string = 'Please check your internet connection.';
    public static MSG_ERROR_SERVER_ERROR:string = 'Server error.';
    public static MSG_ERROR_SOMETHING_WRONG:string = 'Check your internet connection and Try again.';

    public static MSG_ERROR_IMAGE_TYPE:string = 'Please select valid image type';
    public static MSG_ERROR_IMAGE_SIZE:string = 'Make sure image size is less than 500kb';
    public static MSG_ERROR_FB_AUTH:string = 'User cancelled login or did not fully authorize';
    public static MSG_ERROR_FB_domain_error:string = 'The domain of this URL isn not included in the app domains';
}

export class NavigationRoutes {
  public static APP_REGISTRATION: string = '/registration';
  public static APP_FORGOTPASSWORD: string = '/forgotpassword';
  public static APP_DASHBOARD: string = '/dashboard';
  public static APP_RECRUITER_DASHBOARD: string = '/recruiterdashboard';
  public static APP_LOGIN: string = '/login';
  public static APP_START: string = '/';
  public static APP_LANDING: string = '/landing';
  public static VERIFY_USER: string = '/verify_user';
  public static ACTIVATE_USER: string = '/activate_user';
  public static VERIFY_PHONE: string = '/verify_phone';
  public static APP_CHANGEEMAIL:string = '/change_email';
  public static APP_CREATEPROFILE:string = '/create_profile';
  public static APP_COMPANYDETAILS:string = '/company_details';

}

export class LocalStorage {
    public static ACCESS_TOKEN = 'access_token';
    public static IS_THEME_SELECTED = 'is_theme_selected';
    public static IS_SOCIAL_LOGIN = 'is_social_login';
    public static PROFILE_PICTURE = 'profile_picture';
    public static IS_LOGED_IN = 'is_user_loged_in';
    public static USER_ID = 'user_id';
    public static IS_CANDIDATE = 'is_candidate';
    public static MOBILE_NUMBER = 'mobile_number';
    public static COMPANY_NAME = 'company_name';
    public static COMPANY_SIZE = 'company_size';
    public static FIRST_NAME = 'first_name';
    public static LAST_NAME = 'last_name';
    public static TEMP_MOBILE = 'temp_mobile';
    public static TEMP_EMAIL = 'temp_email';
    public static EMAIL_ID = 'email_id';
    public static MY_THEME = 'my_theme';
    public static VERIFY_PHONE_VALUE = 'verify_phone_value';
    public static CHANGE_MAIL_VALUE = 'change_mail_value';
    public static FROM_CANDIDATE_REGISTRATION = 'from_candidate_registration';
    public static VERIFY_CHANGE_PHONE_VALUE = 'verify_change_phone_value';
}

export class ValueConstant {
  public static MAX_CAPABILITIES :number=2;
  public static MAX_PROFECIENCES :number=25;
  public static MAX_DOMAINS :number=10;
  public static MAX_YEAR_LIST :number=30;
  public static MAX_ACADEMIC_YEAR_LIST :number=50;
}


export class API {
  public static NOTIFICATION = 'notification';
  public static SEND_MAIL = 'sendmail';
  public static USER_PROFILE = 'users';
  public static CANDIDATE_PROFILE = 'candidate';
  public static RECRUITER_PROFILE = 'recruiter';
  public static PROFESSIONAL_DATA = 'professionaldata';
  public static EMPLOYMENTHISTORY='employmentdata';
  public static LOGIN = 'login';
  public static FB_LOGIN = 'fbLogin';
  public static CHANGE_PASSWORD = 'changepassword';
  public static CHANGE_MOBILE = 'changemobilenumber';
  public static CHANGE_EMAIL = 'changeemailid';
  public static VERIFY_CHANGED_EMAIL = 'verifychangedemailid';
  public static VERIFY_USER = 'verifyAccount';
  public static VERIFY_EMAIL = 'verifyEmail';
  public static GENERATE_OTP = 'generateotp';
  public static VERIFY_OTP = 'verifyotp';
  public static VERIFY_MOBILE = 'verifymobilenumber';
  public static SEND_VERIFICATION_MAIL = 'sendverificationmail';
  public static FORGOT_PASSWORD = 'forgotpassword';
  public static UPDATE_PICTURE = 'updatepicture';
  public static UPLOAD_DOCUMENTS = 'uploaddocuments';
  public static CHANGE_THEME = 'changetheme';
  public static RESET_PASSWORD = 'resetpassword';
  public static GOOGLE_LOGIN = 'googlelogin';
  public static INDUSTRY_PROFILE = 'industryprofile';
  public static INDUSTRY_LIST = 'industry';
  public static REALOCATION = 'realocation';
  public static EDUCATION = 'education';
  public static EXPERIENCE = 'experience';
  public static CURRENTSALARY ='currentsalary';
  public static NOTICEPERIOD='noticeperiod';
  public static PROFICIENCYLIST='proficiency';
  public static DOMAINLIST='domain';


  public static CAPABILITY_LIST = 'capability';
  public static ROLE_LIST = 'roles';
  public static COMPANY_DETAILS:string = 'companydetails';
  public static ADDRESS = 'address';
  public static ROLE_TYPE= 'roletype';


}

export class ImagePath {

    public static FAV_ICON = './assets/framework/images/logo/tpl-favicon.ico';
    public static BODY_BACKGROUND = './assets/framework/images/page_background/page-bg.png';
    public static MY_COLOR_LOGO = './assets/framework/images/logo/logo-color.png';
    public static MY_WHITE_LOGO = './assets/framework/images/logo/logo-white.png';
    public static FACEBOOK_ICON = './assets/framework/images/footer/fb.svg';
    public static GOOGLE_ICON = './assets/framework/images/footer/google-plus.svg';
    public static LINKEDIN_ICON = './assets/framework/images/footer/linked-in.svg';
    public static PROFILE_IMG_ICON = './assets/framework/images/dashboard/profile.png';
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
    public static FIRST_NAME_ICON= './assets/framework/images/icons/first-name.svg';
    public static FIRST_NAME_ICON_GREY= './assets/framework/images/icons/first-name-grey.svg';
    public static LAST_NAME_ICON = './assets/framework/images/icons/last-name.svg';
    public static LAST_NAME_ICON_GREY = './assets/framework/images/icons/last-name-grey.svg';

}

export class ProjectAsset {
    public static APP_NAME = 'C-NEXT';
    public static TAG_LINE = 'The Awesome Web Experience';
    public static UNDER_LICENECE = '� 2016 Techprimelab Software Pvt. Ltd.';
}
