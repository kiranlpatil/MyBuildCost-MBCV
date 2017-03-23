import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ValidationService } from './framework/shared/customvalidations/validation.service';
import { ControlMessagesComponent } from './framework/shared/customvalidations/controlmessages.component';
import { MessageService, AppRequestOptions, CustomHttp,LoaderService } from './framework/shared/index';
import { LoginComponent } from './framework/login/login.component';
import { DashboardComponent } from './framework/dashboard/dashboard.component';
 import { ChangePasswordComponent } from './framework/password/change-password/change-password.component';
 import { ForgotPasswordComponent } from './framework/password/forgot-password/forgot-password.component';
 import { DashboardProfileComponent } from './framework/dashboard/dashboard-profile/dashboard-profile.component';
 import { AboutComponent } from './framework/dashboard/about/about.component';
 import { ContactComponent } from './framework/dashboard/contact/contact.component';
 import { SettingsComponent } from './framework/dashboard/settings/settings.component';
 import { DashboardHomeComponent } from './framework/dashboard/dashboard-home/dashboard-home.component';

 import { FacebookService } from './framework/login/facebook.service';
 import { CommonService } from './framework/shared/common.service';
 import { FooterComponent } from './framework/shared/footer/footer.component';
 import { HeaderComponent } from './framework/shared/header/header.component';
 import { ChangePasswordService } from './framework/password/change-password/change-password.service';
 import { NotificationService } from './framework/shared/notification/notification.service';
 import { NotificationComponent } from './framework/shared/notification/notification.component';
 import { ForgotPasswordService } from './framework/password/forgot-password/forgot-password.service';
 import { SocialIconComponent } from './framework/shared/footer/social-icon/social-icon.component';
 import { RegistrationService } from './framework/registration/registration.service';
 import { LoaderComponent } from './framework/shared/loader/loader.component';
 import { ThemeChangeService } from './framework/shared/themechange.service';
 import { LoginService } from './framework/login/login.service';
 import { RegistrationComponent } from './framework/registration/registration.component';
 import { DashboardService } from './framework/dashboard/dashboard.service';
 import { ProfileService } from './framework/shared/profileservice/profile.service';
 import { ContactService } from './framework/dashboard/contact/contact.service';
 import { ActivateUserComponent } from './framework/registration/activate-user/activate-user.component';
 import { ResetPasswordComponent } from './framework/password/forgot-password/reset-password/reset-password.component';
 import { ActiveUserService } from './framework/registration/activate-user/activate-user.service';
 import { ResetPasswordService } from './framework/password/forgot-password/reset-password/reset-password.service';
 import { VerifyUserComponent } from './framework/registration/verify_user/verify-user.component';
 import { VerifyUserService } from './framework/registration/verify_user/verify-user.service';
 import { VerifyPhoneComponent } from './framework/registration/verify_phone/verify-phone.component';
 import { VerifyPhoneService } from './framework/registration/verify_phone/verify-phone.service';
 import { ChangeEmailComponent } from './framework/dashboard/settings/change-email/change-email.component';
 import { ChangeEmailService } from './framework/dashboard/settings/change-email/change-email.service';
 import { ActivateEmailComponent } from './framework/dashboard/settings/activate-email/activate-email.component';
 import { ActiveEmailService } from './framework/dashboard/settings/activate-email/activate-email.service';
 import { ChangeMobileComponent } from './framework/dashboard/settings/change-mobile/change-mobile.component';
 import { ChangeMobileService } from './framework/dashboard/settings/change-mobile/change-mobile.service';
 import {LandingPageComponent} from './framework/landing-page/landing-page.component';
 import {IndustryService} from "./cnext/framework/industryList/industryList.service";
 import {IndustryComponent} from "./cnext/framework/industryList/industryList.component";
 import {Ng2AutoCompleteModule} from "ng2-auto-complete/dist/ng2-auto-complete.module";
 import {EmployeeComponent} from "./framework/registration/employee/employee.component";
 import {EmployerComponent} from "./framework/registration/employer/employer.component";
 import {EmployeeService} from "./framework/registration/employee/employee.service";
 import {EmployerService} from "./framework/registration/employer/employer.service";

//C-NEXT IMPORTS
import {ProfilePictureComponent} from "./cnext/framework/profile-picture/profile-picture.component";
import {ProfileCreatorComponent} from "./cnext/framework/profile-creator/profile-creator.component";
import {CapabilityListComponent} from "./cnext/framework/capability-list/capability-list.component";
import {proficiencyDomainComponent} from "./cnext/framework/proficiency-domains/proficiency-domain.component";
import {ComplexityListComponent} from "./cnext/framework/complexity-list/complexity-list.component";
import {MainHeaderComponent} from "./framework/main-header/main-header.component";
import {TestService} from "./cnext/framework/test.service";
import {ComplexityService} from "./cnext/framework/complexity.service";
import {ProfessionalDataComponent} from "./cnext/framework/professional-data/professional-data.component";
import {ProfessionalDataService} from "./cnext/framework/professional-data/professional-data.service";
import {EmploymentHistoryComponent} from "./cnext/framework/employment-history/employment-history.component";
import {EmploymentHistoryService} from "./cnext/framework/employment-history/employment-history.service";
import {AcademicDetailComponent} from "./cnext/framework/academic-details/academic-details.component";
import {CertificationAccreditationComponent} from "./cnext/framework/certification-accreditation/certification-accreditation.component";
import {AwardsComponent} from "./cnext/framework/awards/awards.component";
import {MoreAboutMyselfComponent} from "./cnext/framework/more-about-myself/more-about-myself.component";
import {ProficiencyService} from "./cnext/framework/proficience.service";
import {JobPosterComponent} from "./cnext/framework/job-poster/job-poster.component";
import {JobInformationComponent} from "./cnext/framework/job-information/job-information.component";
import {JobRequirementComponent} from "./cnext/framework/job-requirement/job-requirement.component";
import {JobLocationComponent} from "./cnext/framework/job-location/job-location.component";
import {DescriptionFieldComponent} from "./cnext/framework/description-field/description-field.component";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),
    HttpModule,
    ReactiveFormsModule,
    Ng2AutoCompleteModule
  ],
  declarations: [
    AppComponent,
    ControlMessagesComponent,
    LoaderComponent,
    LandingPageComponent,
    MainHeaderComponent,
    LoginComponent,
    RegistrationComponent,
    EmployeeComponent,
    EmployerComponent,
    ActivateUserComponent,
    ActivateEmailComponent,
    VerifyUserComponent,
    VerifyPhoneComponent,
    DashboardComponent,
    ChangePasswordComponent,
    ChangeEmailComponent,
    ChangeMobileComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    DashboardProfileComponent,
    AboutComponent,
    ContactComponent,
    SettingsComponent,
    DashboardHomeComponent,
    HeaderComponent,
    FooterComponent,
    NotificationComponent,
    SocialIconComponent,

    //C-NEXT COMPONENT

    ProfilePictureComponent,
    ProfileCreatorComponent,
    CapabilityListComponent,
    proficiencyDomainComponent,
    ComplexityListComponent,
    IndustryComponent,
    JobPosterComponent,
    JobInformationComponent,
    JobRequirementComponent,
    JobLocationComponent,
    ProfessionalDataComponent,
    EmploymentHistoryComponent,
    AcademicDetailComponent,
    CertificationAccreditationComponent,
    AwardsComponent,
    MoreAboutMyselfComponent,
    DescriptionFieldComponent
  ],
  providers: [
    {
      provide: Http,
      useFactory: (backend:XHRBackend, defaultOptions:RequestOptions, messageService:MessageService,
                   loaderService:LoaderService) => new CustomHttp(backend, defaultOptions, messageService,loaderService),
      deps: [XHRBackend, RequestOptions, MessageService,LoaderService]
    },
    {provide: RequestOptions, useClass: AppRequestOptions},
    {
      provide: APP_BASE_HREF,
      useValue: '<%= APP_BASE %>'
    },
    MessageService,
    TestService,
    FacebookService,
    LoginService,
    LoaderService,
    CommonService,
    ValidationService,
    ComplexityService,
    ProficiencyService,
    ChangePasswordService,
    ChangeEmailService,
    ChangeMobileService,
    NotificationService,
    ForgotPasswordService,
    ThemeChangeService,
    RegistrationService,
    EmployeeService,
    EmployerService,
    DashboardService,
    ProfileService,
    ContactService,
    ResetPasswordService,
    ActiveUserService,
    ActiveEmailService,
    VerifyUserService,
    VerifyPhoneService,
    IndustryService,
    ProfessionalDataService,
    EmploymentHistoryService

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

