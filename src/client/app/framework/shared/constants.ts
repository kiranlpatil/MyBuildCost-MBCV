export class AppSettings {
  //public static IP = 'http://localhost:8080';
  // public static IP = 'http://ee802b7f.ngrok.io';
  //public static IP = 'http://10.192.33.77:8080';
  public static IP = 'http://34.208.115.60:3000';
  // public static IP = 'app.jobmosis.com';
  // public static IP = '';


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
  public static MSG_CANDIDATE_NOT_FOUND = "No registered applicant with this name. Avoid using multiple spaces while searching with complete names.";
  public static MSG_CANDIDATE_SEARCH_NOT_FOUND = "Applicant's profile does not match with any of your open job profiles.";
  public static MSG_CNADIDATE_VISIBILITY_OFF = "The selected applicant profile details are not displayed, since the applicant has marked it as private.";
  public static MSG_SUCCESS_LOGIN: string = 'You are successfully signed in.';
  public static MSG_SUCCESS_REGISTRATION: string = 'Kindly verify your account.';
  public static MSG_SUCCESS_CHANGE_MOBILE_NUMBER: string = 'Mobile number updated successfully.Kindly sign in';
  public static MSG_SUCCESS_RESEND_VERIFICATION_CODE: string = 'New OTP (One Time Password) has been sent to your registered mobile number';
  //public static MSG_SUCCESS_MAIL_VERIFICATION: string = 'Verification e-mail sent successfully to your e-mail account. Kindly proceed by clicking on the link pProvided in your e-mail';
  public static MSG_SUCCESS_MAIL_VERIFICATION: string = 'Verification e-mail sent successfully to your e-mail account.';
  public static MSG_SUCCESS_NEWREGISTRATION: string = 'Registration successful. Mobile number verified. Kindly sign in.';
  public static MSG_SUCCESS_RESET_PASSWORD: string = 'Your password is reset successfully.';
  public static MSG_SUCCESS_CHANGE_PASSWORD: string = 'Your password has been changed successfully.';
  public static MSG_SUCCESS_CHANGE_EMAIL: string = 'Kindly click on the link sent to your new email for email verification.';
  public static MSG_SUCCESS_CHANGE_MOBILE: string = 'Verify your new mobile number by entering OTP sent on your mobile number.';
  public static MSG_SUCCESS_FORGOT_PASSWORD: string = 'Email for password reset has been sent successfully on your registered email id.';
  public static MSG_SUCCESS_DASHBOARD_PROFILE: string = 'Your profile updated successfully.';
  public static MSG_SUCCESS_DASHBOARD_PROFILE_PIC: string = 'Your profile picture updated successfully.';
  public static MSG_SUCCESS_ATTACH_DOCUMENT: string = 'Your document attached successfully.';
  public static MSG_SUCCESS_UPLOADED_DOCUMENT: string = 'Document successfully uploaded.';
  public static MSG_SUCCESS_CONTACT: string = 'Email sent successfully.';
  public static MSG_SUCCESS_CHANGE_THEME: string = 'Theme changed successfully.';
  public static MSG_SUCCESS_MAIL_VERIFICATION_RESULT_STATUS: string = 'Congratulations!';
  public static MSG_SUCCESS_MAIL_VERIFICATION_BODY: string = 'Your account verified successfully.' +
    'You may start using it immediately by clicking on Sign In!';

  public static MSG_SUCCESS_FOR_PROFILE_CREATION_STATUS: string = 'Your profile created successfully.';
  public static MSG_SUCCESS_FOR_JOB_POST_STATUS: string = 'You have successfully posted the new job. You can search for matching candidates for this job through your dashboard.';

  public static MSG_ERROR_MAIL_VERIFICATION_BODY: string = 'Your account verification failed due to invalid access token!';
  public static MSG_ERROR_MAIL_VERIFICATION_RESULT_STATUS: string = 'Sorry.';
  public static MSG_ERROR_LOGIN: string = 'Failed to sign in.';
  public static MSG_ERROR_FB_LOGIN: string = 'Failed to Facebook sign in.';
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
  public static MSG_ERROR_FB_AUTH: string = 'User cancelled login or did not fully authorize.';
  public static MSG_ERROR_FB_domain_error: string = 'The domain of this URL is not included in the app domains.';
  public static MSG_WARNING_ON_EDIT_CANDIDATE: string = 'This section can be updated only after.';

  public static MSG_ERROR_VALIDATION_EMAIL_REQUIRED = 'Enter your e-mail address.';
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
  public static MSG_ERROR_VALIDATION_INVALID_NAME = 'Enter valid name.';
  public static MSG_ERROR_VALIDATION_INVALID_DATA = 'Enter valid data.';
  public static MSG_ERROR_VALIDATION_PASSWORD_MISMATCHED = 'Passwords do not match.';
  public static MSG_ERROR_VALIDATION_BIRTHYEAR_REQUIRED = 'This field can\'t be left blank.';
  public static MSG_ERROR_VALIDATION_LOCATION_REQUIRED = 'This field can\'t be left blank.';
  public static MSG_ERROR_VALIDATION_INVALID_LOCATION = 'Enter valid location';
  public static MSG_ERROR_VALIDATION_HEADQUARTER_REQUIRED = 'This field can\'t be left blank.';
  public static MSG_ERROR_VALIDATION_COMPANYSIZE_REQUIRED = 'This field can\'t be left blank.';
  public static MSG_ERROR_VALIDATION_JOBTITLE_REQUIRED = 'This field can\'t be left blank.';
  public static MSG_ERROR_VALIDATION_CURRENTCOMPANY_REQUIRED = 'This field can\'t be left blank.';
  public static MSG_ERROR_VALIDATION_EDUCATION_REQUIRED = 'This field can\'t be left blank.';
  public static MSG_ERROR_VALIDATION_EXPERIENCE_REQUIRED = 'This field can\'t be left blank.';
  public static MSG_ERROR_VALIDATION_INDUSTRY_REQUIRED = 'Please select an Industry';
  public static MSG_ERROR_VALIDATION_AREAS_WORKED_REQUIRED = 'Select areas you have worked.';
  public static MSG_ERROR_VALIDATION_FOR_RECRUITER_AREAS_WORKED_REQUIRED = 'Select areas in which the candidate is expected to work.';
  public static MSG_ERROR_VALIDATION_MAX_AREAS_WORKED_CROSSED = 'You have selected maximum work areas. To select a new work area, deselect any of the earlier ones.';
  public static MSG_ERROR_VALIDATION_CAPABILITIES_REQUIRED_CANDIDATE = 'Select your capabilities.';
  public static MSG_ERROR_VALIDATION_CAPABILITIES_REQUIRED_RECRUITER = 'Select capabilities that are required in the candidate';
  public static MSG_ERROR_VALIDATION_MAX_CAPABILITIES_CROSSED = 'You can select maximum 10 capabilities. To select a new capability, deselect any of the earlier selected capability.';
  public static MSG_ERROR_VALIDATION_COMPLEXITY_REQUIRED_CANDIDATE = 'Answer this question';
  public static MSG_ERROR_VALIDATION_COMPLEXITY_REQUIRED_RECRUITER = 'Do not leave any question blank. If a question is not relevant, select "Not applicable".';
  public static MSG_ERROR_VALIDATION_MAX_SKILLS_CROSSED = 'You can select maximum ';
  public static MSG_NO_MATCH_FOUND_TEXT ='This skill is not listed in our skills repository but you can still add this skill by pressing Add button on right.';
  public static MSG_ERROR_VALIDATION_KEYSKILLS_REQUIRED = 'Select a value from drop down.';
  public static MSG_ERROR_VALIDATION_INDUSTRY_EXPOSURE_REQUIRED = 'This field can\'t be left blank.';
  public static MSG_ERROR_VALIDATION_CURRENTSALARY_REQUIRED = 'This field can\'t be left blank.';
  public static MSG_ERROR_VALIDATION_RELOCATE_REQUIRED = 'This field can\'t be left blank.';
  public static MSG_ERROR_VALIDATION_NOTICEPERIOD_REQUIRED = 'This field can\'t be left blank.';
  public static MSG_ERROR_VALIDATION_MAX_WORD_ALLOWED = 'words remaining';
  public static MSG_ERROR_VALIDATION_DESIGNATION_REQUIRED = 'This field can\'t be left blank.';
  public static MSG_ERROR_VALIDATION_DEGREE_NAME_REQUIRED = 'Degree Name is required.';
  public static MSG_ERROR_VALIDATION_UNIVERSITY_NAME_REQUIRED = 'Board/University name is required.';
  public static MSG_ERROR_VALIDATION_YEAR_OF_PASSING_REQUIRED = 'Year Of passing is required.';
  public static MSG_ERROR_VALIDATION_CERTIFICATION_NAME_REQUIRED = 'Certification name is required.';
  public static MSG_ERROR_VALIDATION_CERTIFICATION_AUTHORITY_REQUIRED = 'Authority name is required.';
  public static MSG_ERROR_VALIDATION_CERTIFICATION_YEAR_REQUIRED = 'Year Of passing is required.';
  public static MSG_ERROR_VALIDATION_AWARD_NAME_REQUIRED = 'Award name is required.';
  public static MSG_ERROR_VALIDATION_AWARD_AUTHORITY_REQUIRED = 'Authority name is required.';
  public static MSG_ERROR_VALIDATION_AWARD_YEAR_REQUIRED = 'Issued year is required.';
  public static MSG_ERROR_VALIDATION_JOB_TITLE_REQUIRED = 'Enter job title.';
  public static MSG_ERROR_JOB_TITLE_INVALID_BLANK_SPACE = 'Enter valid job title.';
  public static MSG_ERROR_VALIDATION_HIRING_MANAGER_REQUIRED = 'Enter hiring manager name.';
  public static MSG_ERROR_VALIDATION_HIRING_DEPARTMENT_REQUIRED = 'Enter hiring department.';
  public static MSG_ERROR_VALIDATION_HIRING_COMPANY_REQUIRED = 'Enter hiring company name.';
  public static MSG_ERROR_VALIDATION_EDUCATIONAL_QUALIFICATION_REQUIRED = 'Select educational qualification.';
  public static MSG_ERROR_VALIDATION_MIN_EXPERIENCE_REQUIRED = 'Select minimum experience expected.';
  public static MSG_ERROR_VALIDATION_MAX_EXPERIENCE_REQUIRED = 'Select maximum experience expected.';
  public static MSG_ERROR_VALIDATION_EXPERIENCE = 'Select valid Minimum and Maximum experience.';
  public static MSG_ERROR_VALIDATION_MIN_SALARY_REQUIRED = 'Select minimum salary offered.';
  public static MSG_ERROR_VALIDATION_MAX_SALARY_REQUIRED = 'Select maximum salary offered.';
  public static MSG_ERROR_VALIDATION_SALARY = 'Select valid Minimum and Maximum salary band.';
  public static MSG_ERROR_VALIDATION_JOINING_PERIOD_REQUIRED = 'Select joining period.';
  public static MSG_ERROR_VALIDATION_OTP_MOBILE_NUMBER = 'Please provide a valid mobile number.';
  public static MSG_ERROR_VALIDATION_PASSWORD = 'Password Must be Alfa- Numeric having minimum 8 Characters.';
  public static MSG_ERROR_VALIDATION_BIRTH_YEAR = `This field can't be left blank.`;
  public static MSG_ERROR_VALIDATION_PIN_NUMBER = 'Pin code should not be greater than 20 characters.';
  public static SUGGESTION_MSG_FOR_RELEVENT_INDUSTRY = 'Based on the profile you have selected, we suggest to search ' +
    'candidate from following industries for matching profiles.\n Unselect if you don\'t want to search candidates from any specific industry.';
  public static SUGGESTION_MSG_ABOUT_DOMAIN =  'In addition to<br /> '+ 'this.choosedIndeustry' + ' industry, do you want the ' +
    'candidate to have mandatory experience in any specific Domain? If yes, select such MUST HAVE DOMAINS from below.';
  public static MSG_ERROR_VALIDATION_MAX_PROFICIENCIES =  ' Key skills. Click the cross sign to deselect existing one and add a new skill.';
  public static MSG_ERROR_VALIDATION_EMPLOYMENTHISTORY = 'Provide valid employment start and end date';


  public static MSG_LANDING_PAGE = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' +
    'Nullam sem turpis, sodales eu urna sed, posuere finibus leo finibus.' +
    'Sed et lorem eu mi tincidunt fringilla at non odio.' +
    'Vivamus auctor quam a lobortis tincidunt. Aliquam faucibus nulla lorem, sed imperdiet justo bibendum ac. In' +
    'semper rutrum metus fringilla mollis.';
  public static MSG_RESET_MOBILE_NUMBER = 'Enter your new mobile number and we will send you a verification code on mobile' +
    'number you have entered.';
  public static MSG_RESET_EMAIL_ADDRESS = 'Enter your new account email address and we will send you a link to reset your email' +
    'address.';
  public static MSG_EMAIL_ACTIVATION = 'Your email has been activated. You may start using your account with new email address' +
    'immediately.';
  public static MSG_CONTACT_US = 'Please provide the following details and we will get back to you soon.';
  public static MSG_YEAR_NO_MATCH_FOUND = 'The year doesn\'t look right. Be sure to use your actual year of birth.';
  public static MSG_FORGOT_PASSWORD = 'Enter your account e-mail address and we\'ll help you create a new password.';
  public static MSG_READY_FOR_JOB_SEARCH_FOR_FIRST_TIME = 'You are now ready to find your dream job. In a few seconds you will be taken to the job matching dashboard.';
  public static MSG_READY_FOR_JOB_SEARCH = 'Your profile edited successfully.You will be taken to the job matching dashboard.';
  public static MSG_JOB_POST = 'This job post will now be published. You can see matching candidates for this job in your dashboard view. Proceed?';
  public static MSG_CONFIRM_PASSWORD = ' Passwords do not match.';
  public static MSG_CHANGE_PASSWORD_SUCCESS = 'Password changed successfully. You can Sign In again with new password by clicking on "YES" button, Please' +
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
  public static MSG_MOBILE_VERIFICATION_MESSAGE = 'Please enter the verification code sent to your phone number.';
  public static MSG_MOBILE_VERIFICATION_SUCCUSS_1 = 'Congratulations!';
  public static MSG_MOBILE_VERIFICATION_SUCCUSS_2 = 'Registration successful. Kindly Sign In';
  public static CONTACT_US_ADDRESS = 'Blog. No. 14, 1st Floor, Electronic Estate, Parvati, Pune-Satara Road, Pune 411009, MH, INDIA.';
  public static CONTACT_US_CONTACT_NUMBER_1 = '+91 (20) 2421 8865';
  public static CONTACT_US_CONTACT_NUMBER_2 = '+91 98233 18865';
  public static CONTACT_US_EMAIL_1 = 'sales@techprimelab.com';
  public static CONTACT_US_EMAIL_2 = 'careers@techprimelab.com';
  public static MSG_ACTIVATE_USER_1 = 'Congratulations! Welcome To JobMosis.';
  public static MSG_ACTIVATE_USER_2 = 'You can now find candidates using the highly accurate, simpler, faster and powerful solution.';
  public static MSG_ACTIVATE_USER_3 = 'Your account has been created successfully. Kindly click Sign In.';
  public static MSG_COMPANY_DOCUMENTS = 'Please upload relevant company documents to activate your account.';
  public static MSG_UPLOAD_FILE = 'Please select a file to upload.';
  public static MSG_ABOUT_US_DISCRIPTION = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' +
    'Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s' +
  'when an unknown printer took a galley of type and scrambled it to make a type specimen book.' +
  'It has survived not only five centuries, but also the leap into electronic typesetting,remaining essentially ' +
  'unchanged. ' +
  'It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,' +
  'and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.';

}

export class NavigationRoutes {
  public static APP_REGISTRATION: string = '/registration';
  public static APP_FORGOTPASSWORD: string = '/forgotpassword';
  public static APP_DASHBOARD: string = '/dashboard';
  public static APP_CANDIDATE_DASHBOARD: string = '/candidate_dashboard';
  public static APP_ADMIN_DASHBOARD: string = '/admin_dashboard';
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
  public static ISADMIN = 'is_admin';
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
  public static PASSWORD = 'password';
  public static MY_THEME = 'my_theme';
  public static VERIFY_PHONE_VALUE = 'verify_phone_value';
  public static CHANGE_MAIL_VALUE = 'change_mail_value';
  public static FROM_CANDIDATE_REGISTRATION = 'from_candidate_registration';
  public static AFTER_CANDIDATE_REGISTRATION_FORM = 'after_candidate_registration_form';
  public static AFTER_RECRUITER_REGISTRATION_FORM = 'after_recruiter_registration_form';
  public static VERIFY_CHANGE_PHONE_VALUE = 'verify_change_phone_value';
  public static CURRENT_JOB_POSTED_ID = 'current_job_posted_job_id';
  public static POSTED_JOB = 'posted_job';
  public static GUIDED_TOUR = 'guided_tour';
}

export class ValueConstant {
  public static MAX_CAPABILITIES: number = 10;
  public static MAX_CAPABILITIES_TO_SHOW: number = 5;
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
  public static PROFILE_COMPARISON_LIST: string = 'profile_comparison';
  public static APPLIED_CANDIDATE: string = 'applied';
  public static BLOCKED_CANDIDATE: string = 'blocked';
  public static MATCHED_CANDIDATE: string = 'matchedList';
  public static VALUE_FOR_CANDIDATES_PERCENT_MATCHING_LOWER_BOUND = 10;
}


export class API {
  public static NOTIFICATION = 'notification';
  public static SEND_MAIL = 'sendmail';
  public static SEND_TO_ADMIN_MAIL = 'sendmailtoadmin';
  public static USER_PROFILE = 'users';
  public static UPDATE_USER = 'updateUser';
  public static ALL_USER_PROFILE = 'alluser';
  public static CANDIDATE_PROFILE = 'candidate';
  public static CANDIDATE_DETAIL_PROFILE = 'candidateDetails';
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
  public static RElEVENT_INDUSTRIES = 'releventindustries';
}

export class ImagePath {
  public static FAV_ICON = './assets/framework/images/logo/favicon.ico';
  public static BODY_BACKGROUND = './assets/framework/images/page_background/page-bg.png';
  public static MY_COLOR_LOGO = './assets/framework/images/logo/logo-color.png';
  public static MY_WHITE_LOGO = './assets/framework/images/logo/job-mosis-logo.png';
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

  //guided tour images for desktop
  public static BASE_ASSETS_PATH_DESKTOP = './assets/c-next/guided-tour/tour-for-desktop/';
  public static CANDIDATE_OERLAY_SCREENS_CAPABILITIES ='candidate_overlay-screens-capabilities.jpg';
  public static CANDIDATE_OERLAY_SCREENS_COMPLEXITIES='candidate_overlay-screens-complexities.jpg';
  public static CANDIDATE_OERLAY_SCREENS_DASHBOARD='candidate_overlay-screens-dashboard.jpg';
  public static CANDIDATE_OERLAY_SCREENS_EMPLOYMENT_HISTORY='candidate_overlay-screens-emloyment-history.jpg';
  public static CANDIDATE_OERLAY_SCREENS_KEY_SKILLS='candidate_overlay-screens-key-skills.jpg';
  public static CANDIDATE_OERLAY_SCREENS_PROFILE='candidate_overlay-screens-profile.jpg';
  public static CANDIDATE_OERLAY_SCREENS_STACK_VIEW='candidate_overlay-screens-stack-view.jpg';


}

export class ProjectAsset {
  public static APP_NAME = 'JobMosis';
  public static TAG_LINE = 'The Awesome Web Experience';
  public static UNDER_LICENECE = '© 2017 www.jobmosis.com';
}

export class Tooltip {
  public static ACADEMIC_DETAIL_TOOLTIP: string = 'An individual must provide latest qualification details first.';
  public static AWARDS_TOOLTIP: string = 'Award message.';
  public static BASIC_JOB_INFORMATION_TOOLTIP_1: string = 'This job name would be displayed in the posting.';
  public static BASIC_JOB_INFORMATION_TOOLTIP_2: string = 'Name of the manager who has given the requirement for this job.';
  public static BASIC_JOB_INFORMATION_TOOLTIP_3: string = 'Name of the department for which the candidate is being hired.';
  public static BASIC_JOB_INFORMATION_TOOLTIP_4: string = 'Choose from dropdown.';
  public static BASIC_JOB_INFORMATION_TOOLTIP_5: string = 'The target salary that you wish to offer for the job.';
  public static BASIC_JOB_INFORMATION_TOOLTIP_6: string = 'How much lead time are you willing to provide to the candidate for joining.';
  public static BASIC_JOB_INFORMATION_TOOLTIP_7: string = 'The location where the candidate will be required to work.';
  public static BASIC_JOB_INFORMATION_TOOLTIP_8: string = 'The industry for which you are hiring.';
  public static EMPTY_CANDIDATE_DASHBOARD_MESSAGE: string = 'Currently there are no jobs matching to your profile.' +
    'As the current jobs posted by recruiters demand a different set of capabilities than what you possess.' +
    'This dashboard shows job postings that match your capability profile.' +
    'It is recommended that you keep visiting this page frequently to see the best matching jobs.';
  public static APPLIED_JOB_MESSAGE: string = 'Presently you have not applied for any job.';
  public static NOT_INTRESTED_JOB_MESSAGE: string = 'Currently you have not marked any jobs as "Not Interested".';
  public static PROFILE_INFO_VISIBILIT_SET_TO_NO: string = 'If "No", your profile will not be visible to recruiter.' +
    'If you are on the lookout of job change, it is recommended to keep this setting to "Yes". You can change this setting later.';
  public static PROFILE_INFO_VISIBILIT_SET_TO_YES: string = 'If "Yes", your profile will be available in employer search.';
  public static CANDIDATE_CAPABILITY_TOOLTIP_1: string = 'Select those capabilities that describe your current strength. These capabilities would define you in the eyes of the recruiter and help you align with the best suitable job.';
  public static CANDIDATE_CAPABILITY_TOOLTIP_2: string = 'If there are capabilities that you have developed in past but are no more relevent, you should not select such capabilites as this would dilute the matching and alignment with the best job opportunity.';
  public static RECRUITER_CAPABILITY_TOOLTIP: string = 'These capabilities would form the core of the job profile. ' +
      'In next section, you would get to define these capabilities in detail.';
  public static CERTIFICATE_TOOLTIP: string = 'Certification/Accreditation Message';
  public static COMPETENCIES_AND_RESPONSIBILITIES_TOOLTIP_1: string = 'Additional Information';
  public static COMPETENCIES_AND_RESPONSIBILITIES_TOOLTIP_2: string = 'You can use this field to describe specific aspects of the job profile that will help the candidate to understand your expectations better.';
  public static COMPLEXITIES_CANDIDATE_TOOLTIP_1: string = 'This section provides a list of complexity scenarios for your selected capabilities.' +
    'If more than one options are applicable to you, choose the option where you can demonstrate a higher level of expertise.';
  public static COMPLEXITIES_CANDIDATE_TOOLTIP_2: string = 'If a scenario was applicable to you in past but is no more relevant to you, avoid choosing such scenarios.In such cases, choose "Not Applicable".';
  public static COMPLEXITIES_RECRUITER_TOOLTIP_1: string = 'This section provides a list of complexity scenarios for selected capabilities.' +
    'For each scenario, select the most appropriate level that candidate is required to handle.';
  public static COMPLEXITIES_RECRUITER_TOOLTIP_2: string = 'For scenarios that are not relevant to your job profile, choose "Not Applicable".';
  public static EMPLOYMENT_HISTORY_TOOLTIP: string = 'An individual may be exposed to multiple industries during his professional life.';
  public static INDUSTRY_EXPERIENCE_CANDIDATE_TOOLTIP_1: string = 'An individual may be exposed to multiple industries during their professional life. ' +
    'At times, organisations need individuals who have cross industry expertise.';
  public static INDUSTRY_EXPERIENCE_CANDIDATE_TOOLTIP_2: string = 'Select such industries where you can claim a reasonable exposure.';
  public static INDUSTRY_EXPERIENCE_RECRUITER_TOOLTIP: string = 'If you wish the candidate to have exposure to any industry besides his core industry, please select such additional industries.';
  public static INDUSTRY_LIST_TOOLTIP_1: string = 'Enter the industry from which you wish to hire the candidate. This Industry forms the core of your Job Profile posting. In next sections, you shall be shown questions and parameters that are relevant to this Industry.';
  public static INDUSTRY_LIST_TOOLTIP_2: string = 'If you wish the candidate to have worked in multiple Industries, choose the one that is most relevent as on date. You shall get option to include additional industries in Relevant Industry section.';
  public static JOB_PROFICIENCIES_TOOLTIP_1: string = 'Enter keywords for specialization in Technologies, Products, Tools, Domains etc. E.g Java, Oracle, SAP, Cognos, AWS, Agile, DevOps, CMM, Telecom Billing, Retail Banking etc.';
  public static JOB_PROFICIENCIES_TOOLTIP_2: string = 'Use the Top 5 "Must Have" keywords to describe the mandatory skills. You can provide additional 5 keywords that are "Nice to Have".';
  public static MORE_ABOUT_MYSELF_TOOLTIP: string = 'Please mention additional details about your personal and professional journey that would help the recruiter to know you better.';
  public static PROFESSIONAL_DATA_TOOLTIP_1: string = 'Please mention your current salary (CTC).';
  public static PROFESSIONAL_DATA_TOOLTIP_2: string = 'Select if you are open to relocate from your current location as per job demand.';
  public static PROFESSIONAL_DATA_TOOLTIP_3: string = 'Mention the notice period you have to serve before you can take up new job.';
  public static PROFICIENCIES_TOOLTIP_1: string = 'Enter all key words that describe your area of expertise or specialization.';
  public static PROFICIENCIES_TOOLTIP_2: string = 'Ensure that you cover all relevant aspects of Technologies, Products, Methodologies, Models,' +
    'Processes, Tools, Domain expertise and any additional key words that describe your work.';
  public static PROFICIENCIES_TOOLTIP_3: string = 'Selecting too many Key Skills would dilute the matching and alignment with the ' +
    'best job opportunity. Hence you should select maximum 25 Key Skills.';
  public static PROFILE_DESCRIPTION_TOOLTIP_1: string = 'Enter your current or latest job title.';
  public static PROFILE_DESCRIPTION_TOOLTIP_2: string = 'A profile photo helps the recruiter to associate a face to the name.';
  public static PROFILE_DESCRIPTION_TOOLTIP_3: string = 'Provide your current or latest company name.Freshers should mention "Fresher" as their company name.';
  public static RECRUITER_ENTRY_MESSAGE: string = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum has been the industrys' +
    ' standard dummy text ever since the 1500s,when an unknown printer took a galley of type and scrambled it to make' +
    ' a type specimen book.It has survived not only five centuries, but also the leap into electronic typesetting,' +
    'remaining essentially unchanged.';
  public static RECRUITER_DASHBOARD_MESSAGE: string = 'Welcome To Dashboard!';
  public static RELEVENT_INDUSTRY_LIST_TOOLTIP: string = 'Based on the profile you have selected, You can select industries to get more candidates with matching profiles.';
  public static SAVE_ROLES_MESSAGE: string = 'Saving role details. Once saved, you cannot change it for 3 months.';
  public static AREA_OF_WORK_TOOLTIP_1: string = 'Select those areas of work that best describe your current focus.';
  public static AREA_OF_WORK_TOOLTIP_2: string = 'If there are areas that you have worked in past but are no more relevent, you should not select such areas as they may fetch jobs that are no more relevant to you.';
  public static RECRUITER_AREA_OF_WORK_TOOLTIP: string = 'Select those areas in which the candidate is expected to work. You can select maximum 3 areas of work for a job profile in order to make your search more relevant.';
  public static EMPTY_LIST_MESSAGE: string = 'Currently there are no candidates matching to your job posting.' +
    'This is because the currently available candidates possess different set of capabilities than' +
    'what your job expects. This dashboard shows candidates that have best matches with your desired' +
    'capability profile. It is recommended that you keep visiting this page frequently to see the best matching candidates.';
  public static EMPTY_CART_MESSAGE: string = 'You have not added any candidates to the Cart for this job posting.';
  public static EMPTY_REJECTED_LIST_MESSAGE: string = 'There are no candidates rejected by you for this job posting.';
  public static CAPABILITY_COMPARE_ABOVE_MATCH: string = 'Candidate capabilities higher than desired';
  public static CAPABILITY_COMPARE_EXACT_MATCH: string = 'Candidate capabilities with exact match';
  public static CAPABILITY_COMPARE_BELOW_MATCH: string = 'Candidate capabilities slightly less than desired';
  public static CAPABILITY_COMPARE_MISSING_MATCH: string = 'Large mismatch of capabilities';
  public static COMPANY_DETAILS_TOOLTIP: string = 'Company Details Message';
}

export class Headings {
  public static ACADAMIC_DETAILS: string = 'Academic Details (Optional)';
  public static AWARDS: string = 'Awards (Optional)';
  public static JOB_DISCRIPTION: string = 'Job Description';
  public static HIDE_COMPANY_NAME: string = 'Hide company Name from applicant';
  public static GOT_IT: string = 'OK, Got it';
  public static CAPABILITIES_FOR_CANDIDATE: string = 'Select those capabilities that describe your current strength.';
  public static CAPABILITIES_FOR_RECRUITER: string = 'Select core capabilities that are required in the candidate.';
  public static CERTIFICATE_ACCREDITATION: string = 'Certification/Accreditation (Optional)';
  public static ADDITIONAL_INFORMATION: string = 'Additional information about the job';
  public static OPTIONAL: string = '(Optional)';
  public static CAPABITITIES_HEADING: string = 'Capabilities';
  public static EMPLOYMENT_HISTORY: string = 'Employment History';
  public static ADDITIONAL_DOMAIN_EXPOSURE: string = 'Additional domain exposure';
  public static INDUSTRY_FOR_CANDIDATE: string = 'Select your Industry (Any One)';
  public static INDUSTRY_FOR_RECRUITER: string = 'Select industry in which candidate is expected to work (Any One)';
  public static JOB_PROFICIENCIES: string = 'Keywords that describe candidate\'s area of expertise';
  public static MANDATORY_PROFICIENCIES: string = 'Mandatory Key Skills';
  public static ADDITIONAL_PROFICIENCIES: string = 'Additional Key Skills';
  public static ABOUT_MYSELF: string = 'About Myself';
  public static SUPPLIMENTARY_CAPABILITIES: string = 'Supplimentary Capabilities';
  public static ADDITIONAL_INFORMATION_TEXT: string = 'Additional Information';
  public static KEY_SKILLS: string = 'Key Skills';
}
