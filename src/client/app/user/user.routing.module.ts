import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {CandidateSignUpVerificationRoutes} from "./candidate-sign-up-verification/candidate-sign-up-verification.routes";
import {CandidateSignUpRoutes} from "./candidate-sign-up/candidate-sign-up.routes";
import {UserVerificationRoutes} from "./user-verification/verify-user.routes";
import {LoginRoutes} from "./login/login.routes";
import {RecruiterSignUpRoutes} from "./recruiter-sign-up/recruiter.routes";
import {ResetPasswordRoutes} from "./forgot-password/reset-password/reset-password.routes";
import {ForgotPasswordRoutes} from "./forgot-password/forgot-password.routes";
import {CompanyDetailsRoutes} from "./company-details/company-details.routes";
import {ChangePasswordRoutes} from "./change-password/change-password.routes";
import {ActivateEmailRoutes} from "./settings/activate-email/activate-email.routes";
import {ChangeEmailRoutes} from "./settings/change-email/change-email.routes";
import {ChangeMobileRoutes} from "./settings/change-mobile/change-mobile.routes";
import {UserProfileRoutes} from "./user-profile/user-profile.routes";
import {SettingsRoutes} from "./settings/settings.routes";

@NgModule({
  imports: [
    RouterModule.forChild([
      ...LoginRoutes,
      ...CandidateSignUpRoutes,
      ...CandidateSignUpVerificationRoutes,
      ...ChangePasswordRoutes,
      ...CompanyDetailsRoutes,
      ...ForgotPasswordRoutes,
      ...ResetPasswordRoutes,
      ...RecruiterSignUpRoutes,
      ...UserVerificationRoutes,
      ...ActivateEmailRoutes,
      ...ChangeEmailRoutes,
      ...ChangeMobileRoutes,
      ...UserProfileRoutes,
      ...SettingsRoutes
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class UserRoutingModule {
}
