export class AppSettings {
  //public static IP = 'http://localhost:8080';
  // public static IP = 'http://ee802b7f.ngrok.io';
  //public static IP = 'http://10.192.33.252:8087';
  public static IP = 'http://52.89.221.23:8080';
 // public static IP = 'http://52.41.194.37:8080';
  //public static IP = '';


  public static get API_ENDPOINT(): string {
    return this.IP + '/api/';
  }

  public static INITIAL_THEM = 'container-fluid dark-theme';
  public static LIGHT_THEM = 'container-fluid light-theme';
  public static IS_SOCIAL_LOGIN_YES = 'YES';
  public static IS_SOCIAL_LOGIN_NO = 'NO';
}

export class Messages {
  public static MSG_SUCCESS_LOGIN: string = 'You are successfully signed in.';
  public static MSG_SUCCESS_REGISTRATION: string = 'Kindly verify your account.';
  public static MSG_SUCCESS_CHANGE_MOBILE_NUMBER: string = 'Mobile number changed successfully.';
  public static MSG_SUCCESS_RESEND_VERIFICATION_CODE: string = 'New One Time Password (OTP) sent on your mobile number.';
  public static MSG_SUCCESS_MAIL_VERIFICATION: string = 'Verification email sent successfully on your email account. Kindly proceed by clikcing on th elink provided in your email.';
  public static MSG_SUCCESS_NEWREGISTRATION: string = 'Registration successful. Mobile number verified. Kindly sign in.';
  public static MSG_SUCCESS_RESET_PASSWORD: string = 'Your password is reset successfully.';
  public static MSG_SUCCESS_CHANGE_PASSWORD: string = 'Your password has been changed successfully.';
  public static MSG_SUCCESS_CHANGE_EMAIL: string = 'Kindly click on the link sent to your new email for email verification.';
  public static MSG_SUCCESS_CHANGE_MOBILE: string = 'Verify your new mobile number by entering OTP sent on your mobile number.';
  public static MSG_SUCCESS_FORGOT_PASSWORD: string = 'Email has been sent successfully on your registered email to reset password.';
  public static MSG_SUCCESS_DASHBOARD_PROFILE: string = 'Your profile updated successfully.';
  public static MSG_SUCCESS_DASHBOARD_PROFILE_PIC: string = 'Your profile picture updated successfully.';
  public static MSG_SUCCESS_ATTACH_DOCUMENT: string = 'Your document attached successfully.';
  public static MSG_SUCCESS_UPLOADED_DOCUMENT: string = 'Your documents uploaded successfully.';
  public static MSG_SUCCESS_CONTACT: string = 'Email sent successfully.';
  public static MSG_SUCCESS_CHANGE_THEME: string = 'Theme changed successfully.';
  public static MSG_SUCCESS_MAIL_VERIFICATION_RESULT_STATUS: string = 'Congratulations!';
  public static MSG_SUCCESS_MAIL_VERIFICATION_BODY: string = 'Your account verified successfully.' +
    'You may start using it immediately right now.Click on Sign In!';

  public static MSG_SUCCESS_FOR_PROFILE_CREATION_STATUS: string = 'Your profile created successfully.';
  public static MSG_SUCCESS_FOR_JOB_POST_STATUS: string = 'You have successfully posted the new job. You can search for matching candidates for this job through your dashboard.';

  public static MSG_ERROR_MAIL_VERIFICATION_BODY: string = 'Your account verification failed due to invalid access token!';
  public static MSG_ERROR_MAIL_VERIFICATION_RESULT_STATUS: string = 'Sorry.';
  public static MSG_ERROR_LOGIN: string = 'Failed to sign in.';
  public static MSG_ERROR_FB_LOGIN: string = 'Failed to Facebook sign in.';
  public static MSG_ERROR_REGISTRATION: string = 'Failed to new user registration.';
  public static MSG_ERROR_CHANGE_PASSWORD: string = 'Failed to change password.';
  public static MSG_ERROR_CHANGE_EMAIL: string = 'Failed to change email.';
  public static MSG_ERROR_FORGOT_PASSWORD: string = 'Failed to reset password.';
  public static MSG_ERROR_DASHBOARD_PROFILE: string = 'Failed to update Profile.';
  public static MSG_ERROR_CONTACT: string = 'Failed to send email.';
  public static MSG_ERROR_DASHBOARD_PROFILE_PIC: string = 'Failed to change Profile Picture.';
  public static MSG_ERROR_ATTACH_DOCUMENT: string = 'Failed to attach Document.';
  public static MSG_ERROR_CHANGE_THEME: string = 'Failed to Change Theme.';
  public static MSG_ERROR_TOKEN_SESSION: string = 'Session has been expired.';
  public static MSG_ERROR_NETWORK: string = 'Internal Server Error.';
  public static MSG_ERROR_SERVER_ERROR: string = 'Server error.';
  public static MSG_ERROR_SOMETHING_WRONG: string = 'Internal Server Error.';
  public static MSG_ERROR_IMAGE_TYPE: string = 'Make sure to upload JPG,JPEG,GIF,PNG file and try again.';
  public static MSG_ERROR_IMAGE_SIZE: string = 'Please Make sure the image size is less than 5 MB.';
  public static MSG_ERROR_DOCUMENT_SIZE: string = 'Please Make sure the document size is less than 5 MB.';
  public static MSG_ERROR_FB_AUTH: string = 'User cancelled login or did not fully authorize.';
  public static MSG_ERROR_FB_domain_error: string = 'The domain of this URL isn not included in the app domains.';
  public static MSG_WARNING_ON_EDIT_CANDIDATE: string = 'This section can be updated only after.';
}

export class NavigationRoutes {
  public static APP_REGISTRATION: string = '/registration';
  public static APP_FORGOTPASSWORD: string = '/forgotpassword';
  public static APP_DASHBOARD: string = '/dashboard';
  public static APP_CANDIDATE_DASHBOARD: string = '/candidate_dashboard';
  public static APP_RECRUITER_DASHBOARD: string = '/recruiterdashboard';
  public static APP_LOGIN: string = '/signin';
  public static APP_START: string = '/';
  public static APP_LANDING: string = '/landing';
  public static VERIFY_USER: string = '/verify_user';
  public static ACTIVATE_USER: string = '/activate_user';
  public static VERIFY_PHONE: string = '/verify_phone';
  public static APP_CHANGEEMAIL: string = '/change_email';
  public static APP_CREATEPROFILE: string = '/create_profile';
  public static APP_PROFILESUMMURY: string = '/profile_summary';
  public static APP_JOB_SUMMURY: string = '/job_summary';
  public static APP_COMPANYDETAILS: string = '/company_details';

}

export class LocalStorage {
  public static ACCESS_TOKEN = 'access_token';
  public static IS_THEME_SELECTED = 'is_theme_selected';
  public static IS_SOCIAL_LOGIN = 'is_social_login';
  public static PROFILE_PICTURE = 'profile_picture';
  public static IS_LOGGED_IN = 'is_user_logged_in';
  public static USER_ID = 'user_id';
  public static END_USER_ID = 'end_user_id';
  public static _ID = '_id';
  public static IS_CANDIDATE = 'is_candidate';
  public static IS_CANDIDATE_FILLED = 'is_candidate_filled';
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
  public static CURRENT_JOB_POSTED_ID = 'current_job_posted_job_id';
  public static POSTED_JOB = 'posted_job';
}

export class ValueConstant {
  public static MAX_CAPABILITIES: number = 10;
  public static MATCHING_PERCENTAGE: number = 10;
  public static MAX_WORKAREA: number = 3;
  public static MAX_INTERESTEDINDUSTRY: number = 7;
  public static MAX_PROFECIENCES: number = 25;
  public static MAX_MANDATORY_PROFECIENCES: number = 5;
  public static MAX_ADDITIONAL_PROFECIENCES: number = 5;
  public static MAX_YEAR_LIST: number = 60;
  public static MAX_ACADEMIC_YEAR_LIST: number = 50;
  public static SHORT_LISTED_CANDIDATE: string = 'shortListed';
  public static CART_LISTED_CANDIDATE: string = 'cartListed';
  public static REJECTED_LISTED_CANDIDATE: string = 'rejectedList';
  public static APPLIED_CANDIDATE: string = 'applied';
  public static BLOCKED_CANDIDATE: string = 'blocked';
  public static MATCHED_CANDIDATE: string = 'matchedList';
  public static VALUE_FOR_CNDIDATES_PERCENT_MATCHING_LOWER_BOUND = 40;
}


export class API {
  public static NOTIFICATION = 'notification';
  public static SEND_MAIL = 'sendmail';
  public static USER_PROFILE = 'users';
  public static CANDIDATE_PROFILE = 'candidate';
  public static RECRUITER_PROFILE = 'recruiter';
  public static PROFESSIONAL_DATA = 'professionaldata';
  public static EMPLOYMENTHISTORY = 'employmentdata';
  public static LOGIN = 'login';
  public static FB_LOGIN = 'fbLogin';
  public static SEARCHED_CANDIDATE = 'searchedcandidate';
  public static SEARCH_CANDIDATE = 'recruiter/candidate';
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
  public static CANDIDATESFROMLISTS = 'recruiter/jobProfile';
}

export class ImagePath {
  public static FAV_ICON = './assets/framework/images/logo/cnext-favicon.ico';
  public static BODY_BACKGROUND = './assets/framework/images/page_background/page-bg.png';
  public static MY_COLOR_LOGO = './assets/framework/images/logo/logo-color.png';
  public static MY_WHITE_LOGO = './assets/framework/images/logo/cnext-logo-white.png';
  public static FACEBOOK_ICON = './assets/framework/images/footer/fb.svg';
  public static GOOGLE_ICON = './assets/framework/images/footer/google-plus.svg';
  public static LINKEDIN_ICON = './assets/framework/images/footer/linked-in.svg';
  public static PROFILE_IMG_ICON = './assets/framework/images/dashboard/default-profile.png';
  public static COMPANY_LOGO_IMG_ICON = './assets/framework/images/dashboard/logo-Icon.png';
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
}

export class ProjectAsset {
  public static APP_NAME = 'C-NEXT';
  public static TAG_LINE = 'The Awesome Web Experience';
  public static UNDER_LICENECE = '&#169; 2016 Techprimelab Software Pvt. Ltd.';
}
