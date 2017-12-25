import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {CandidateSignUpVerificationRoutes} from "./../framework/registration/candidate-sign-up-verification/candidate-sign-up-verification.routes";
import {CandidateSignUpRoutes} from "./../framework/registration/candidate-sign-up/candidate-sign-up.routes";
import {UserVerificationRoutes} from "./user-verification/verify-user.routes";
import {LoginRoutes} from "./../framework/login/login.routes";
import {ResetPasswordRoutes} from "../framework/login/forgot-password/reset-password/reset-password.routes";
import {ForgotPasswordRoutes} from "../framework/login/forgot-password/forgot-password.routes";
import {ActivateEmailRoutes} from "./settings/activate-email/activate-email.routes";
import {ChangeEmailRoutes} from "./settings/change-email/change-email.routes";
import {ChangeMobileRoutes} from "./settings/change-mobile/change-mobile.routes";

@NgModule({
  imports: [
    RouterModule.forChild([
      ...LoginRoutes,
      ...CandidateSignUpRoutes,
      ...CandidateSignUpVerificationRoutes,
      ...ForgotPasswordRoutes,
      ...ResetPasswordRoutes,
      ...UserVerificationRoutes,
      ...ActivateEmailRoutes,
      ...ChangeEmailRoutes,
      ...ChangeMobileRoutes
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class UserRoutingModule {
}
