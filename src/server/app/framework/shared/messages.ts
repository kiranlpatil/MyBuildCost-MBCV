class Messages {

  //status
  public static STATUS_SUCCESS: string = 'Success';
  public static STATUS_ERROR: string = 'Error';

  //Email subject
  public static EMAIL_SUBJECT_REGISTRATION: string = ' Registration Successful';
  public static EMAIL_SUBJECT_CHANGE_EMAILID: string = 'Confirm change of EmailId';
  public static EMAIL_SUBJECT_FORGOT_PASSWORD: string = 'New Password for MobileSeed Project';
  public static EMAIL_SUBJECT_USER_CONTACTED_YOU: string = 'User Contacted you';

  //Sendmail
  public static MSG_SUCCESS_EMAIL_REGISTRATION: string = 'Email sent on registered emailId ';
  public static MSG_SUCCESS_EMAIL_CHANGE_EMAILID: string = 'Email sent on new emailId ';
  public static MSG_SUCCESS_EMAIL_FORGOT_PASSWORD: string = 'Email has been sent successfully on your registered email to reset password';
  public static MSG_ERROR_EMAIL: string = 'Email could not be sent';
  public static MSG_SUCCESS_EMAIL: string = 'Email has been sent successfully';
  public static MSG_SUCCESS_LOGIN: string = 'You are successfully logged in';
  public static MSG_SUCCESS_REGISTRATION: string = 'Registration Successful';
  public static MSG_SUCCESS_CHANGE_PASSWORD: string = 'Your password has been changed successfully';
  public static MSG_SUCCESS_SUBMITTED: string = 'Form Submitted Successfully';
  public static MSG_SUCCESS_OTP: string = 'OTP has been sent on your verified mobile number';
  public static MSG_SUCCESS_OTP_CHANGE_MOBILE_NUMBER: string = 'OTP has been sent on your new mobile number';

  //Error Message
  public static MSG_ERROR_MESSAGE_SENDING: string = 'Message sending failed by server';
  public static MSG_ERROR_CREATING_USER: string = 'User registration failed';
  public static MSG_ERROR_REGISTRATION: string = 'User already present with this emailId ';
  public static MSG_ERROR_REGISTRATION_MOBILE_NUMBER: string = 'User already present with this mobile number';
  public static MSG_ERROR_USER_NOT_FOUND: string = 'There is no user registerd with this email address.';
  public static MSG_ERROR_EMAIL_ACTIVE_NOW: string = 'User already has an account associated with this emailId';
  public static MSG_ERROR_TOKEN_SESSION: string = 'Your Session has Expired';
  public static MSG_ERROR_WRONG_TOKEN: string = 'Invalid access token';
  public static MSG_ERROR_INACTIVE_USER: string = 'Inactive user.Kindly click on Register Now!!!.';
  public static MSG_ERROR_WRONG_CURRENT_PASSWORD: string = 'Wrong current password entered';
  public static MSG_ERROR_WRONG_CURRENT_EMAIL: string = 'Wrong current emailId entered';
  public static MSG_ERROR_PROVIDE_TOKEN: string = 'Provide access token';
  public static MSG_ERROR_IS_BEARER: string = 'Invalid token strategy';
  public static MSG_ERROR_PROVIDE_ID: string = 'Provide user ID';
  public static MSG_ERROR_ACCOUNT_STATUS: string = 'Account is not active. Kindly verify your account by clicking the link sent after registration';
  public static MSG_ERROR_VERIFY_ACCOUNT: string = 'Please click on the link sent to your email in order to activate your account ';
  public static MSG_ERROR_INVALID_ID: string = 'Invalid Userid';
  public static MSG_ERROR_USER_NOT_PRESENT: string = 'You are not registered with us.Kindly click on Register!';
  public static MSG_ERROR_USER_WITH_EMAIL_PRESENT: string = 'You are already registered.Kindly click on login';
  public static MSG_ERROR_DIRECTORY_NOT_FOUND: string = 'Image directory not found';
  public static MSG_ERROR_INVALID_TOKEN: string = 'Invalid access token';
  public static MSG_ERROR_WRONG_OTP: string = 'The OTP you have entered is incorrect.';
  public static MSG_ERROR_WRONG_MOBILE_NUMBER: string = 'Please enter appropriate mobile number';
  public static MSG_ERROR_PROVIDE_EMAIL: string = 'Please Provide emailId';
  public static MSG_ERROR_INVALID_CREDENTIALS: string = 'The email address or phone number that you have entered doesnot match any account.';
  public static MSG_ERROR_WRONG_PASSWORD: string = 'Incorrect Password.';
  public static MSG_ERROR_NOT_USER: string = 'An access token is expired or is invalid';
  public static MSG_ERROR_FIELD_VERIFICATION: string = 'Fields verification failed';
  public static MSG_ERROR_FACEBOOK_AUTH: string = 'Facebook Authentication Failed';
  public static MSG_ERROR_GOOGLE_AUTH: string = 'Google plus Authentication Failed';
  public static MSG_ERROR_EMPTY_FIELD: string = 'Fields cannot be empty';
  public static MSG_ERROR_WHILE_CONTACTING: string = 'Something went wrong.Try again';
  public static MSG_ERROR_CONNECTION_TIMEOUT: string = 'Connection timeout.Try again';

  //

  // Error Reason
  // public static MSG_ERROR_RSN_MESSAGE_NOT_SENT:string = 'message could not send';
  public static MSG_ERROR_RSN_USER_NOT_FOUND: string = 'User not found';
  public static MSG_ERROR_USER_NOT_ACTIVATED: string = 'User Account is not Activated';
  public static MSG_ERROR_RSN_DIRECTORY_NOT_FOUND: string = 'Directory not found';
  //MSG_ERROR_RSN_REGISTRATION
  public static MSG_ERROR_RSN_REGISTRATION: string = 'User already present with this emailId';
  public static MSG_ERROR_RSN_INVALID_CREDENTIALS: string = 'Invalid Credentials';
  public static MSG_ERROR_RSN_INVALID_REGISTRATION_STATUS: string = 'Invalid Registration Status';
  public static MSG_ERROR_RSN_NOT_ALLOW: string = 'User has not permission to access public profile';
  public static MSG_ERROR_RSN_EXISTING_USER: string = 'User already exist';
  public static MSG_ERROR_RSN_WHILE_CONTACTING: string = 'There may be Network problem';

  //Verify errors
    public static MSG_ERROR_CHECK_EMAIL_ACCOUNT: string = "Error: User already has an account associated with this emailId";

  public static MSG_ERROR_CHECK_INACTIVE_ACCOUNT: string = "Error: Account is not active. Kindly verify your account by clicking the link sent after registration";
    public static MSG_ERROR_CHECK_INVALID_ACCOUNT: string = "Error: There is no user registerd with this email address.";
    public static MSG_ERROR_CHECK_MOBILE_PRESENT: string = "Error: User already present with this mobile number";
    public static MSG_ERROR_CHECK_EMAIL_PRESENT: string ="Error: Please click on the link sent to your email in order to activate your account "
}
export=Messages;



