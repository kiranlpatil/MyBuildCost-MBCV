class Messages {
  //Image Paths
  public static EMAIL_TEMPLATE_LOGO: string = './src/server/app/framework/public/images/logo/job-mosis-logo.png';

  //status
  public static STATUS_SUCCESS: string = 'Success';
  public static STATUS_ERROR: string = 'Error';

  //Email subject
  public static EMAIL_SUBJECT_REGISTRATION: string = ' Registration successful';
  public static EMAIL_SUBJECT_CHANGE_EMAILID: string = 'Confirmation for change in email address.';
  public static EMAIL_SUBJECT_USER_CONTACTED_YOU: string = 'Confirmation of user contact.';
  public static EMAIL_SUBJECT_FORGOT_PASSWORD: string = 'Reset your password';
  public static EMAIL_SUBJECT_CANDIDATE_REGISTRATION: string = 'Welcome to My Build Cost, an online solution for cost estimation of your construction projects.';
  public static EMAIL_SUBJECT_SERVER_ERROR: string = 'Server Error Info';
  public static EMAIL_SUBJECT_UPGRADED_SUBSCRIPTION: string = 'You have successfully upgraded the subscription of My Build Cost.';
  public static PROJECT_EXPIRY_WARNING: string = 'Project expiry warning';
  public static RA_NEW_USER_REGISTERED: string = 'RA new user registered';

  //Sendmail
  public static MSG_SUCCESS_EMAIL_REGISTRATION: string = 'Email sent on registered email address.';
  public static MSG_SUCCESS_EMAIL_CHANGE_EMAILID: string = 'Email sent on new email address.';
  public static MSG_SUCCESS_EMAIL_FORGOT_PASSWORD: string = 'E-mail has been sent successfully on your registered email ' +
    'to reset password.';
  public static MSG_ERROR_EMAIL: string = 'Email could not be sent.';
  public static MSG_SUCCESS_EMAIL: string = 'Email has been sent successfully';
  public static MSG_SUCCESS_LOGIN: string = 'You are successfully logged in';
  public static MSG_SUCCESS_REGISTRATION: string = 'Registration successful';
  public static MSG_SUCCESS_CHANGE_PASSWORD: string = 'Your password has been changed successfully';
  public static MSG_SUCCESS_SUBMITTED: string = 'Form submitted successfully';
  public static MSG_SUCCESS_PASSWORD_CHANGE: string = 'Password changed successfully.';
  public static MSG_SUCCESS_COMPANY_WEBSITE_CHANGE: string = 'Company website changed successfully.';
  public static MSG_SUCCESS_OTP: string = 'OTP has been sent on your verified mobile number.';
  public static MSG_SUCCESS_OTP_CHANGE_MOBILE_NUMBER: string = 'OTP has been sent on your new mobile number';
  public static MSG_SUCCESS_INDUSTRY_DATA_INSERTION: string = 'Data inserted Successfully in Industry';
  public static MSG_SUCCESS_SET_PASSWORD: string = 'Password has been set successfully.';
  public static MSG_SUCCESS_VERIFY_PASSWORD: string = 'Password has been verified successfully.';

  public static MSG_NO_RECORDS_FOUND: string = 'No records found';

  //Error Message
  public static MSG_ERROR_MESSAGE_SENDING: string = 'Message sending failed by server';
  public static MSG_ERROR_CREATING_USER: string = 'User registration failed';
  public static MSG_ERROR_REGISTRATION: string = 'User already present with this email address ';
  public static MSG_ERROR_REGISTRATION_MOBILE_NUMBER: string = 'This mobile number is already in use by an existing ' +
    'user. Please enter another mobile number.';//Dont Change It
  public static MSG_ERROR_USER_NOT_FOUND: string = 'Sorry. There is no user registered with this email address.';//Dont Change it
  public static MSG_ERROR_USER_NOT_FOUND_Mail_SEND: string = 'E-mail has been sent successfully on your ' +
    'registered email to reset password.';//Dont Change it
  public static MSG_ERROR_EMAIL_ACTIVE_NOW: string = 'User already has an account associated with this email address.';//DontChnge It
  public static MSG_ERROR_TOKEN_SESSION: string = 'Your session has expired.';
  public static MSG_ERROR_WRONG_TOKEN: string = 'Invalid access token';
  public static MSG_ERROR_INACTIVE_USER: string = 'Inactive user. Kindly click on Register Now!!!.';
  public static MSG_ERROR_WRONG_CURRENT_PASSWORD: string = 'Incorrect current password entered.';
  public static MSG_ERROR_SAME_NEW_PASSWORD: string = 'Current and new passwords can\'t be same.';
  public static MSG_ERROR_WRONG_CURRENT_EMAIL: string = 'Incorrect current email address entered.';
  public static MSG_ERROR_PROVIDE_TOKEN: string = 'Provide access token';
  public static MSG_ERROR_IS_BEARER: string = 'Invalid token strategy';
  public static MSG_ERROR_TOKEN_NOT_PROVIDED: string = 'Access token is not provided';
  public static MSG_ERROR_PROVIDE_ID: string = 'Provide user ID';
  public static MSG_ERROR_ACCOUNT_STATUS: string = 'Your account is still inactive.' +
    ' Verify your account by clicking the verification link sent on your email.';//dont change It
  public static MSG_ERROR_VERIFY_ACCOUNT: string = 'Your account is not active please contact Technical support' +
    ' team to activate your account.';//Dont CHange It
  public static MSG_ERROR_VERIFY_CANDIDATE_ACCOUNT: string = 'Please contact the administrator to activate your account.';//Dont CHange It
  public static MSG_ERROR_VERIFY_PASSWORD: string = 'Error in bycrpt compare function.';
  public static MSG_ERROR_BCRYPT_CREATION: string = 'Error in creating hash using bcrypt.';//Dont CHange It
  public static MSG_ERROR_INVALID_ID: string = 'Invalid Userid';
  public static MSG_ERROR_USER_NOT_PRESENT: string = 'Enter a valid login ID / password.';
  public static MSG_ERROR_USER_WITH_EMAIL_PRESENT: string = 'You are already a registered user. Kindly click on Login.';
  public static MSG_ERROR_DIRECTORY_NOT_FOUND: string = 'Image directory not found.';
  public static MSG_ERROR_INVALID_TOKEN: string = 'Invalid access token';
  public static MSG_ERROR_INVALID_TOKEN_2: string = 'Access token has expired or is invalid';
  public static MSG_ERROR_WRONG_OTP: string = 'The OTP entered is incorrect.';
  public static MSG_ERROR_WRONG_MOBILE_NUMBER: string = 'Please enter appropriate mobile number';
  public static MSG_ERROR_PROVIDE_EMAIL: string = 'Please provide email address';
  public static MSG_ERROR_INVALID_CREDENTIALS: string = 'The email address or phone number that you have entered does not match any account.';
  public static MSG_ERROR_WRONG_PASSWORD: string = 'Enter a valid login ID / password.';
  public static MSG_ERROR_NOT_USER: string = 'An access token is expired or is invalid';
  public static MSG_ERROR_FIELD_VERIFICATION: string = 'Fields Verification Failed';
  public static MSG_ERROR_FACEBOOK_AUTH: string = 'Facebook Authentication Failed';
  public static MSG_ERROR_GOOGLE_AUTH: string = 'Google plus Authentication Failed';
  public static MSG_ERROR_EMPTY_FIELD: string = 'Fields can\'t be empty';
  public static MSG_ERROR_WHILE_CONTACTING: string = 'Something went wrong. Try again.';
  public static MSG_ERROR_CONNECTION_TIMEOUT: string = 'Connection timeout. Try again.';
  public static MSG_ERROR_INCORRECT_INDUSTRY_NAME: string = 'Excel With this name is not present.Excel name must be NewIndustryDataExcel.xlsx';
  public static MSG_ERROR_IN_READING: string = 'Error In excel reading';
  public static MSG_ERROR_INDUSTRY_CODE_OR_SORT_NUMBER_MISSING: string = 'code or sort order is must for industry.';
  public static MSG_ERROR_COMPLEXITY_CODE_MISSING: string = 'Code is not given for complexity.';
  public static MSG_ERROR_CAPABILITY_CODE_MISSING: string = 'Code is not given for capability.';
  public static MSG_ERROR_AREA_OF_WORK_CODE_MISSING: string = 'Code is not given for area of work.';
  //

  // Error Reason
  // public static MSG_ERROR_RSN_MESSAGE_NOT_SENT:string = 'message could not send';
  public static MSG_ERROR_INSUFFICIENT_CREDITS: string = 'Insufficient credits to send sms';
  public static MSG_ERROR_RSN_USER_NOT_FOUND: string = 'User not found';
  public static MSG_ERROR_CREATE_JOB: string = 'error while creating job';
  public static MSG_ERROR_UPDATE_JOB: string = 'error while updating job';
  public static MSG_ERROR_USER_NOT_ACTIVATED: string = 'User account is not activated';
  public static MSG_ERROR_RSN_DIRECTORY_NOT_FOUND: string = 'Directory not found';
  //MSG_ERROR_RSN_REGISTRATION
  public static MSG_ERROR_RSN_REGISTRATION: string = 'User already present with this email address';
  public static MSG_ERROR_RSN_INVALID_CREDENTIALS: string = 'Invalid Credentials';
  public static MSG_ERROR_RSN_INVALID_REGISTRATION_STATUS: string = 'Invalid Registration Status';
  public static MSG_ERROR_RSN_NOT_ALLOW: string = 'Insufficient user permission to access public profile';
  public static MSG_ERROR_RSN_EXISTING_USER: string = 'User already exists.';
  public static MSG_ERROR_RSN_WHILE_CONTACTING: string = 'There may be a network problem.';

  public static MSG_ERROR_FAILED_TO_UPDATE_CANDIDATE_FIELD: string = 'Failed to update candidate field';


  //Building limit error message payment.
  public static MSG_ERROR_BUILDINGS_PURCHASED_LIMIT: string = 'You can not add more than 5 buildings at once.';


  //Verify errors
  public static MSG_ERROR_CHECK_EMAIL_ACCOUNT: string = 'User already has an account associated with this email address.'; //should be same to MSG_ERROR_EMAIL_ACTIVE_NOW


  public static MSG_HEADER_QUESTION_CANDIDATE: string = 'Tell us about your experience in';
  public static MSG_HEADER_QUESTION_RECRUITER: string = 'Which is the most appropriate level that candidate is required to handle as a part of';


  public static MSG_ERROR_CHECK_INACTIVE_ACCOUNT: string = 'Your account is still inactive. Verify your account' +
    ' by clicking the verification link sent on your email.'; //should be same to MSG_ERROR_ACCOUNT_STATUS
  public static MSG_ERROR_CHECK_INVALID_ACCOUNT: string = 'Error: Sorry. There is no user registered with this email address.'; // should be same to MSG_ERROR_USER_NOT_FOUND
  public static MSG_ERROR_CHECK_MOBILE_PRESENT: string = 'Error: This mobile number is already in use by an existing user. Please enter another mobile number.'; //should be same to MSG_ERROR_REGISTRATION_MOBILE_NUMBER
  public static MSG_ERROR_CHECK_EMAIL_PRESENT: string = 'Error: Please click on the link sent to your email in order to activate your account. ';

  public static MSG_ERROR_API_CHECK = 'Invalid access token';
  public static MSG_ERROR_IF_USER_ID_INVALID_FROM_URL_PARAMETER = 'Problem with id which you provided';
  public static MSG_ERROR_FETCH_SHARE_URL_FAILED = 'Fetch to share link url failed';
  public static MSG_ERROR_IF_STORE_TO_SHARE_LINK_FAILED = 'Share link failed when going to store';

  //admin module
  public static MSG_ERROR_UNAUTHORIZED_USER = 'You are unauthorized user';
  public static MSG_ERROR_RETRIEVING_USER = 'Error In Retrieving the Users';
  public static MSG_ERROR_RETRIEVING_USERS_COUNT = 'Error In Retrieving the Users Count';
  public static MSG_ERROR_RETRIEVING_USAGE_DETAIL = 'Error In Retrieving the Usage Detail';
  public static MSG_ERROR_UPDATING_USAGE_DETAIL = 'Error In Updating the Usage Detail';
  public static MSG_ERROR_RETRIEVING_KEY_SKILLS = 'Error In Retrieving the Key Skills';
  public static MSG_ERROR_ADDING_USAGE_DETAIL = 'Error In editing the Usage Detail';
  public static MSG_ERROR_SEPERATING_USER = 'Error In Seperating the Users';
  public static MSG_ERROR_CREATING_EXCEL = 'Error In creating csv file';
  public static MSG_ERROR_PROVIDE_MOBILE_NO = 'Please provide valid mobile number.';
  public static MSG_ERROR_FETCHING_MANAGED_CANDIDATES = 'Error In fetching managed candidates by recruiter';
  public static MSG_ERROR_EXPORTING_MANAGED_CANDIDATES = 'Error In exporting managed candidates by recruiter';
}

export = Messages;



