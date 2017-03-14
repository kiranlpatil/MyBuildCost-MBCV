import { Routes } from '@angular/router';
import { LoginRoutes } from './framework/login/index';
import { RegistrationRoutes } from './framework/registration/index';
import { DashboardRoutes } from './framework/dashboard/index';
import { ForgotPasswordRoutes } from './framework/password/forgot-password/index';
import { StartRoutes } from './framework/start/start.routes';
import { DashboardProfileRoutes } from './framework/dashboard/dashboard-profile/index';
import { ChangePasswordRoutes } from './framework/password/change-password/index';
import { AboutRoutes } from './framework/dashboard/about/index';
import { SettingsRoutes } from './framework/dashboard/settings/index';
import { ActivateUserRoutes } from './framework/registration/activate-user/activate-user.routes';
import { ResetPasswordRoutes } from './framework/password/forgot-password/reset-password/reset-password.routes';
import { VerifyUserRoutes } from './framework/registration/verify_user/verify-user.routes';
import { VerifyPhoneRoutes } from './framework/registration/verify_phone/verify-phone.routes';
import { ChangeEmailRoutes } from './framework/dashboard/settings/change-email/change-email.routes';
import { ActivateEmailRoutes } from './framework/dashboard/settings/activate-email/activate-email.routes';
import { ChangeMobileRoutes } from './framework/dashboard/settings/change-mobile/change-mobile.routes';
import {LandingPageRoutes} from './framework/landing-page/landing-page.routes';
import {EmployeeRoutes} from "./framework/registration/employee/employee.routes";
import {EmployerRoutes} from "./framework/registration/employer/employer.routes";
import {IndustryRoutes} from "./cnext/framework/industryList/industryList.routes";
import {ProfileCreator} from "./cnext/framework/profile-creator/profile-creator.routes";


export const routes: Routes = [
  ...IndustryRoutes,
  ...LandingPageRoutes,
  ...LoginRoutes,
  ...RegistrationRoutes,
  ...EmployeeRoutes,
  ...EmployerRoutes,
  ...ActivateUserRoutes,
  ...ActivateEmailRoutes,
  ...VerifyUserRoutes,
  ...VerifyPhoneRoutes,
  ...DashboardRoutes,
  ...ForgotPasswordRoutes,
  ...ResetPasswordRoutes,
  ...DashboardProfileRoutes,
  ...ChangePasswordRoutes,
  ...ChangeEmailRoutes,
  ...ChangeMobileRoutes,
  ...AboutRoutes,
  ...SettingsRoutes,
  ...ProfileCreator,
   ...StartRoutes,
];
