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
import {RegistrationService} from "./services/registration.service";
import {UserVerificationComponent} from "./user-verification/user-verification.component";
import {UserVerificationService} from "./user-verification/user-verification.service";
import {RecruiterSignUpComponent} from "./recruiter-sign-up/recruiter-sign-up.component";
import {RecruiterSignUpService} from "./recruiter-sign-up/recruiter-sign-up.service";
import {CompanyDetailsComponent} from "./company-details/company-details.component";
import {CompanyDetailsService} from "./company-details/company-details.service";
import {Ng2AutoCompleteModule} from "ng2-auto-complete";
import {ProfilePictureComponent} from "./profile-picture/profile-picture.component";
import {ChangePasswordComponent} from "./change-password/change-password.component";
import {ChangePasswordService} from "./change-password/change-password.service";
import {UserRoutingModule} from "./user.routing.module";
import {ActivateEmailComponent} from "./settings/activate-email/activate-email.component";
import {ActiveEmailService} from "./settings/activate-email/activate-email.service";
import {ChangeEmailComponent} from "./settings/change-email/change-email.component";
import {ChangeEmailService} from "./settings/change-email/change-email.service";
import {ChangeMobileComponent} from "./settings/change-mobile/change-mobile.component";
import {ChangeMobileService} from "./settings/change-mobile/change-mobile.service";
import {UserProfileComponent} from "./user-profile/user-profile.component";
import {CandidateDashboardHeaderComponent} from "./candidate-dashboard-header/candidate-dashboard-header.component";
import {CandidateHeaderComponent} from "./candidate-header/candidate-header.component";
import {RecruiterSharedHeaderComponent} from "./recruiter-shared-header/recruiter-shared-header.component";
import {SettingsComponent} from "./settings/settings.component";
import {SettingsService} from "./settings/settings.service";
import {AdminDashboardHeaderComponent} from "./admin-dashboard-header/admin-dashboard-header.component";

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule, Ng2AutoCompleteModule, UserRoutingModule],
  declarations: [UserHeaderComponent, LoginComponent, ResetPasswordComponent, ForgotPasswordComponent,
    CandidateSignUpComponent, CandidateSignUpVerificationComponent, UserVerificationComponent, RecruiterSignUpComponent,
    CompanyDetailsComponent, ProfilePictureComponent, ChangePasswordComponent, ActivateEmailComponent,
    ChangeEmailComponent, ChangeMobileComponent, UserProfileComponent, CandidateDashboardHeaderComponent,
    CandidateHeaderComponent, RecruiterSharedHeaderComponent, SettingsComponent, AdminDashboardHeaderComponent],
  exports: [UserHeaderComponent, LoginComponent, ResetPasswordComponent, ForgotPasswordComponent,
    CandidateSignUpComponent, CandidateSignUpVerificationComponent, UserVerificationComponent, RecruiterSignUpComponent,
    CompanyDetailsComponent, ProfilePictureComponent, ChangePasswordComponent, ActivateEmailComponent,
    ChangeEmailComponent, ChangeMobileComponent, UserProfileComponent, CandidateDashboardHeaderComponent,
    CandidateHeaderComponent, RecruiterSharedHeaderComponent, SettingsComponent, AdminDashboardHeaderComponent],
  providers: [LoginService, FacebookService, ForgotPasswordService, ResetPasswordService, CandidateSignUpService,
    CandidateSignUpVerificationService, RegistrationService, UserVerificationService, RecruiterSignUpService,
    CompanyDetailsService, ChangePasswordService, ActiveEmailService, ChangeEmailService, ChangeMobileService,
    RegistrationService, SettingsService]
})

export class UserModule {

}
