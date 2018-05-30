import {NgModule} from "@angular/core";
import {SharedModule} from "../shared/shared.module";
import {LoginComponent} from "./../framework/login/login.component";
import {LoginService} from "./../framework/login/login.service";
import {UserHeaderComponent} from "./user-header/user-header.component";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ResetPasswordComponent} from "../framework/login/forgot-password/reset-password/reset-password.component";
import {ForgotPasswordComponent} from "../framework/login/forgot-password/forgot-password.component";
import {ForgotPasswordService} from "../framework/login/forgot-password/forgot-password.service";
import {ResetPasswordService} from "../framework/login/forgot-password/reset-password/reset-password.service";
import {CandidateSignUpComponent} from "./../framework/registration/candidate-sign-up/candidate-sign-up.component";
import {CandidateSignUpService} from "./../framework/registration/candidate-sign-up/candidate-sign-up.service";
import {CandidateSignUpVerificationComponent} from "./../framework/registration/candidate-sign-up-verification/candidate-sign-up-verification.component";
import {RegistrationService} from "./services/registration.service";
import {UserVerificationComponent} from "./user-verification/user-verification.component";
import {UserVerificationService} from "./user-verification/user-verification.service";
import {ProfilePictureComponent} from "./profile-picture/profile-picture.component";
import {UserChangePasswordComponent} from "./../framework/dashboard/user-change-password/user-change-password.component";
import {UserChangePasswordService} from "./../framework/dashboard/user-change-password/user-change-password.service";
import {UserRoutingModule} from "./user.routing.module";
import {ActivateEmailComponent} from "./settings/activate-email/activate-email.component";
import {ActiveEmailService} from "./settings/activate-email/activate-email.service";
import {ChangeEmailComponent} from "./settings/change-email/change-email.component";
import {ChangeEmailService} from "./settings/change-email/change-email.service";
import {ChangeMobileComponent} from "./settings/change-mobile/change-mobile.component";
import {ChangeMobileService} from "./settings/change-mobile/change-mobile.service";
import {DashboardProfileComponent} from "./../framework/dashboard/user-profile/dashboard-user-profile.component";
import {CandidateDashboardHeaderComponent} from "./candidate-dashboard-header/candidate-dashboard-header.component";
import {CandidateHeaderComponent} from "./candidate-header/candidate-header.component";
import {SettingsComponent} from "./settings/settings.component";
import {SettingsService} from "./settings/settings.service";
import { OtpVerificationComponent} from './otp-verification/otp-verification.component';
import { OtpVerificationService} from './otp-verification/otp-verification.service';
import { LoginauthGuard } from './../framework/login/login-auth-guard.service';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule, /*TODO Abhijeet Ng2AutoCompleteModule,*/ UserRoutingModule],
  declarations: [UserHeaderComponent, LoginComponent, ResetPasswordComponent, ForgotPasswordComponent,
    CandidateSignUpComponent, CandidateSignUpVerificationComponent,OtpVerificationComponent, UserVerificationComponent,
    ProfilePictureComponent, UserChangePasswordComponent, ActivateEmailComponent,
    ChangeEmailComponent, ChangeMobileComponent, DashboardProfileComponent, CandidateDashboardHeaderComponent,
    CandidateHeaderComponent, SettingsComponent],
  exports: [UserHeaderComponent, LoginComponent, ResetPasswordComponent,OtpVerificationComponent, ForgotPasswordComponent,
    CandidateSignUpComponent, CandidateSignUpVerificationComponent, UserVerificationComponent,
    ProfilePictureComponent, UserChangePasswordComponent, ActivateEmailComponent,
    ChangeEmailComponent, ChangeMobileComponent, DashboardProfileComponent, CandidateDashboardHeaderComponent,
    CandidateHeaderComponent, SettingsComponent],
  providers: [LoginService, ForgotPasswordService, ResetPasswordService,CandidateSignUpService,OtpVerificationService,
     RegistrationService, UserVerificationService,
    UserChangePasswordService, ActiveEmailService, ChangeEmailService, ChangeMobileService,
    RegistrationService, SettingsService,LoginauthGuard]
})

export class UserModule {

}
