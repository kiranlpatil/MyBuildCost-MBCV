import {NgModule} from "@angular/core";
import {SharedModule} from "../shared/shared.module";
import {LoginComponent} from "./login/login.component";
import {LoginService} from "./login/login.service";
import {UserHeaderComponent} from "./user-header/user-header.component";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FacebookService} from "./login/facebook/facebook.service";
import {ResetPasswordComponent} from "./forgot-password/reset-password/reset-password.component";
import {ForgotPasswordComponent} from "./forgot-password/forgot-password.component";
import {ForgotPasswordService} from "./forgot-password/forgot-password.service";
import {ResetPasswordService} from "./forgot-password/reset-password/reset-password.service";
import {CandidateSignUpComponent} from "./candidate-sign-up/candidate-sign-up.component";
import {CandidateSignUpService} from "./candidate-sign-up/candidate-sign-up.service";
import {CandidateSignUpVerificationComponent} from "./candidate-sign-up-verification/candidate-sign-up-verification.component";
import {CandidateSignUpVerificationService} from "./candidate-sign-up-verification/candidate-sign-up-verification.service";
import {RegistrationService} from "./registration.service";
import {UserVerificationComponent} from "./user-verification/user-verification.component";
import {UserVerificationService} from "./user-verification/user-verification.service";

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule],
  declarations: [UserHeaderComponent, LoginComponent, ResetPasswordComponent, ForgotPasswordComponent,
    CandidateSignUpComponent, CandidateSignUpVerificationComponent, UserVerificationComponent],
  exports: [UserHeaderComponent, LoginComponent, ResetPasswordComponent, ForgotPasswordComponent,
    CandidateSignUpComponent, CandidateSignUpVerificationComponent, UserVerificationComponent],
  providers: [LoginService, FacebookService, ForgotPasswordService, ResetPasswordService, CandidateSignUpService,
    CandidateSignUpVerificationService, RegistrationService, UserVerificationService]
})

export class user {

}
