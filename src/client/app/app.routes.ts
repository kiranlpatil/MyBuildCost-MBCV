import {  Routes  } from '@angular/router';
import {  LoginRoutes  } from './framework/login/index';
import {  RegistrationRoutes  } from './framework/registration/index';
import {  DashboardRoutes  } from './framework/dashboard/index';
import {  ForgotPasswordRoutes  } from './framework/password/forgot-password/index';
import {  StartRoutes  } from './framework/start/start.routes';
import {  DashboardProfileRoutes  } from './framework/dashboard/dashboard-profile/index';
import {  ChangePasswordRoutes  } from './framework/password/change-password/index';
import {  AboutRoutes  } from './framework/dashboard/about/index';
import {  SettingsRoutes  } from './framework/dashboard/settings/index';
import {  ActivateUserRoutes  } from './framework/registration/activate-user/activate-user.routes';
import {  ResetPasswordRoutes  } from './framework/password/forgot-password/reset-password/index';
import {  VerifyUserRoutes  } from './framework/registration/verify_user/index';
import {  VerifyPhoneRoutes  } from './framework/registration/verify_phone/verify-phone.routes';
import {  ChangeEmailRoutes  } from './framework/dashboard/settings/change-email/change-email.routes';
import {  ActivateEmailRoutes  } from './framework/dashboard/settings/activate-email/activate-email.routes';
import {  ChangeMobileRoutes  } from './framework/dashboard/settings/change-mobile/change-mobile.routes';
import {  LandingPageRoutes } from './framework/landing-page/landing-page.routes';
import {  CandidateRoutes } from './framework/registration/candidate/candidate.routes';
import {  RecruiterRoutes } from './framework/registration/recruiter/recruiter.routes';
import {  ProfileCreator } from './cnext/framework/profile-creator/profile-creator.routes';
import {  CompanyDetailsRoutes  } from './framework/registration/company_details/company-details.routes';
import {  RecruiterDashboard  } from './cnext/framework/recruiter-dashboard/recruiter-dashboard.routes';


export const routes: Routes = [
  ...LandingPageRoutes,
  ...LoginRoutes,
  ...RegistrationRoutes,
  ...CandidateRoutes,
  ...RecruiterRoutes,
  ...ActivateUserRoutes,
  ...ActivateEmailRoutes,
  ...VerifyUserRoutes,
  ...VerifyPhoneRoutes,
  ...DashboardRoutes,
  ...RecruiterDashboard,
  ...ForgotPasswordRoutes,
  ...ResetPasswordRoutes,
  ...DashboardProfileRoutes,
  ...ChangePasswordRoutes,
  ...ChangeEmailRoutes,
  ...ChangeMobileRoutes,
  ...AboutRoutes,
  ...SettingsRoutes,
  ...ProfileCreator,
  ...CompanyDetailsRoutes,
  ...StartRoutes,

];
