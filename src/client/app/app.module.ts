import {NgModule} from "@angular/core";
import {AppComponent} from "./app.component";
import {BrowserModule} from "@angular/platform-browser";
import {APP_BASE_HREF} from "@angular/common";
import {RouterModule} from "@angular/router";
import {RecaptchaModule} from "ng2-recaptcha";
import {routes} from "./app.routes";
import {HttpModule, Http, XHRBackend, RequestOptions} from "@angular/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ValidationService} from "./framework/shared/customvalidations/validation.service";
import {ControlMessagesComponent} from "./framework/shared/customvalidations/controlmessages.component";
import {MessageService, AppRequestOptions, CustomHttp, LoaderService} from "./framework/shared/index";
import {LoginComponent} from "./framework/login/login.component";
import {DashboardComponent} from "./framework/dashboard/dashboard.component";
import {ChangePasswordComponent} from "./framework/password/change-password/change-password.component";
import {ForgotPasswordComponent} from "./framework/password/forgot-password/forgot-password.component";
import {DashboardProfileComponent} from "./framework/dashboard/dashboard-profile/dashboard-profile.component";
import {AboutComponent} from "./framework/dashboard/about/about.component";
import {ContactComponent} from "./framework/dashboard/contact/contact.component";
import {SettingsComponent} from "./framework/dashboard/settings/settings.component";
import {DashboardHomeComponent} from "./framework/dashboard/dashboard-home/dashboard-home.component";
import {FacebookService} from "./framework/login/facebook.service";
import {CommonService} from "./framework/shared/common.service";
import {FooterComponent} from "./framework/shared/footer/footer.component";
import {HeaderComponent} from "./framework/shared/header/header.component";
import {ChangePasswordService} from "./framework/password/change-password/change-password.service";
import {NotificationService} from "./framework/shared/notification/notification.service";
import {NotificationComponent} from "./framework/shared/notification/notification.component";
import {ForgotPasswordService} from "./framework/password/forgot-password/forgot-password.service";
import {SocialIconComponent} from "./framework/shared/footer/social-icon/social-icon.component";
import {RegistrationService} from "./framework/registration/registration.service";
import {LoaderComponent} from "./framework/shared/loader/loader.component";
import {ThemeChangeService} from "./framework/shared/themechange.service";
import {LoginService} from "./framework/login/login.service";
import {RegistrationComponent} from "./framework/registration/registration.component";
import {DashboardService} from "./framework/dashboard/dashboard.service";
import {ProfileService} from "./framework/shared/profileservice/profile.service";
import {ContactService} from "./framework/dashboard/contact/contact.service";
import {ActivateUserComponent} from "./framework/registration/activate-user/activate-user.component";
import {ResetPasswordComponent} from "./framework/password/forgot-password/reset-password/reset-password.component";
import {ActiveUserService} from "./framework/registration/activate-user/activate-user.service";
import {ResetPasswordService} from "./framework/password/forgot-password/reset-password/reset-password.service";
import {VerifyUserComponent} from "./framework/registration/verify_user/verify-user.component";
import {VerifyUserService} from "./framework/registration/verify_user/verify-user.service";
import {VerifyPhoneComponent} from "./framework/registration/verify_phone/verify-phone.component";
import {VerifyPhoneService} from "./framework/registration/verify_phone/verify-phone.service";
import {ChangeEmailComponent} from "./framework/dashboard/settings/change-email/change-email.component";
import {ChangeEmailService} from "./framework/dashboard/settings/change-email/change-email.service";
import {ActivateEmailComponent} from "./framework/dashboard/settings/activate-email/activate-email.component";
import {ActiveEmailService} from "./framework/dashboard/settings/activate-email/activate-email.service";
import {ChangeMobileComponent} from "./framework/dashboard/settings/change-mobile/change-mobile.component";
import {ChangeMobileService} from "./framework/dashboard/settings/change-mobile/change-mobile.service";
import {LandingPageComponent} from "./framework/landing-page/landing-page.component";
import {Ng2AutoCompleteModule} from "ng2-auto-complete/dist/ng2-auto-complete.module";
import {CandidateComponent} from "./framework/registration/candidate/candidate.component";
import {RecruiterComponent} from "./framework/registration/recruiter/recruiter.component";
import {CandidateService} from "./framework/registration/candidate/candidate.service";
import {RecruiterService} from "./framework/registration/recruiter/recruiter.service";
import {RecruitingService} from "./framework/shared/recruiting.service";
import {ScrollToModule} from "ng2-scroll-to";
import {ProfilePictureComponent} from "./cnext/framework/profile-picture/profile-picture.component";
import {MainHeaderComponent} from "./framework/main-header/main-header.component";
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
import {MyRoleService} from "./cnext/framework/role-service";
import {MyIndustryService} from "./cnext/framework/industry-service";
import {MyCapabilityService} from "./cnext/framework/capability-service";
import {CompanyDetailsComponent} from "./framework/registration/company_details/company-details.component";
import {CompanyDetailsService} from "./framework/registration/company_details/company-details.service";
import {RecruiterDashboardComponent} from "./cnext/framework/recruiter-dashboard/recruiter-dashboard.component";
import {JobFilterComponent} from "./cnext/framework/job-filter/job-filter.component";
import {MyJobRequirementService} from "./cnext/framework/jobrequirement-service";
import {IndustryListComponent} from "./cnext/framework/industry-list/industry-list.component";
import {IndustryListService} from "./cnext/framework/industry-list/industry-list.service";
import {DateService} from "./cnext/framework/date.service";
import {ProfessionalService} from "./cnext/framework/professional-service";
import {EducationalService} from "./cnext/framework/educational-service";
import {AwardService} from "./cnext/framework/award-service";
import {JobLocationService} from "./cnext/framework/job-location/job-location.service";
import {SingleSelectListComponent} from "./cnext/framework/single-select-list/single-select-list.component";
import {MyJobLocationService} from "./cnext/framework/myjob-location.service";
import {MyJobPostRoleTypeService} from "./cnext/framework/jobpost-roletype.service";
import {JonPostDescriptionService} from "./cnext/framework/job-post-description.service";
import {JobPostComplexityService} from "./cnext/framework/job-post-complexity.service";
import {JobPostProficiencyService} from "./cnext/framework/jobPostProficiency.service";
import {MyRoleListTestService} from "./cnext/framework/myRolelist.service";
import {RoleTypetListComponent} from "./cnext/framework/role-type/role-type.component";
import {MyRoTypeTestService} from "./cnext/framework/myRole-Type.service";
import {RoleTypeService} from "./cnext/framework/role-type/role-type.service";
import {IndustryExperienceListComponent} from "./cnext/framework/industry-experience/industry-experience.component";
import {IndustryExperienceService} from "./cnext/framework/industry-experience/industry-experience.service";
import {DisableTestService} from "./cnext/framework/disable-service";
import {MyJobInformationService} from "./cnext/framework/myJobInformation.service";
import {JobRequirementService} from "./cnext/framework/myJobRequirement.service";
import {JobIndustryShowService} from "./cnext/framework/myJobIndustryShow.service";
import {ShowJobFilterService} from "./cnext/framework/showJobFilter.service";
import {CandidateAwardService} from "./cnext/framework/awards/awards.service";
import {AboutCandidateService} from "./cnext/framework/more-about-myself/more-about-myself.service";
import {CandidateAcadmyDetailService} from "./cnext/framework/academic-details/academic-details.service";
import {JobPosterService} from "./cnext/framework/job-poster/job-poster.service";
import {DisableAwardGlyphiconService} from "./cnext/framework/disableGlyphiconAward.service";
import {DisableCertificateGlyphiconService} from "./cnext/framework/disableCertificateGlyphicon.service";
import {DisableAboutMyselfGlyphiconService} from "./cnext/framework/disableAboutMyself.service";
import {DisableEmployeeHistoryGlyphiconService} from "./cnext/framework/disableEmplyeeHistoryGlyphicon.service";
import {CandidateSummuryComponent} from "./cnext/framework/one-page-summury/candidate-summury/candidate-summury.component";
import {CandidateBasicInformationComponent} from "./cnext/framework/one-page-summury/candidate-summury/candidate-basic-information/candidate-basic-information.component";
import {VericalListViewComponent} from "./cnext/framework/one-page-summury/shared/vertical-list-view/vertical-list-view.component";
import {TabularListViewComponent} from "./cnext/framework/one-page-summury/shared/tabular-list-view/tabular-list-view.component";
import {HorizontalListViewComponent} from "./cnext/framework/one-page-summury/shared/horizontal-list-view/horizontal-list-view.component";
import {AdditionalDetailsComponent} from "./cnext/framework/one-page-summury/shared/additional-details/additional-details.component";
import {ProfileDescriptionComponent} from "./cnext/framework/profile-description/profile-description.component";
import {CandidateProfileComponent} from "./cnext/framework/candidate-profile/candidate-profile.component";
import {CandidateProfileService} from "./cnext/framework/candidate-profile/candidate-profile.service";
import {WorkAreaComponent} from "./cnext/framework/work-area/work-area.component";
import {RecruiterHeaderComponent} from "./cnext/framework/recruiter-dashboard/recruiter-dashboard-header/recruiter-header.component";
import {CapabilitiesComponent} from "./cnext/framework/capibilities/capabilities.component";
import {ComplexitiesComponent} from "./cnext/framework/complexities/complexities.component";
import {ProficienciesComponent} from "./cnext/framework/proficiencies/proficiencies.component";
import {ProficiencyDomainService} from "./cnext/framework/proficiencies/proficiencies.service";
import {BasicJobInformationComponent} from "./cnext/framework/basic-job-information/basic-job-information.component";
import {CompentansiesAndResponsibilitiesComponent} from "./cnext/framework/compentacies-and-responsibilities/compentacies-and-responsibilities.component";
import {BasicJobInformationService} from "./cnext/framework/basic-job-information/basic-job-information.service";

//C-NEXT IMPORTS

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),
    HttpModule,
    ReactiveFormsModule,
    RecaptchaModule.forRoot(), // Keep in mind the 'forRoot'-magic nuances!
    Ng2AutoCompleteModule,
    ScrollToModule.forRoot()
  ],
  declarations: [
    AppComponent,
    ControlMessagesComponent,
    LoaderComponent,
    LandingPageComponent,
    MainHeaderComponent,
    LoginComponent,
    RegistrationComponent,
    CandidateComponent,
    RecruiterComponent,
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
    CandidateSummuryComponent,
    CandidateBasicInformationComponent,
    VericalListViewComponent,
    TabularListViewComponent,
    AdditionalDetailsComponent,
    HorizontalListViewComponent,
    CandidateProfileComponent,
    ProfileDescriptionComponent,
    CapabilitiesComponent,
    ProficienciesComponent,
    IndustryListComponent,
    ComplexitiesComponent,
    JobPosterComponent,
    SingleSelectListComponent,
    BasicJobInformationComponent,
    CompentansiesAndResponsibilitiesComponent,
    JobInformationComponent,
    JobRequirementComponent,
    JobLocationComponent,
    JobFilterComponent,
    ProfessionalDataComponent,
    EmploymentHistoryComponent,
    AcademicDetailComponent,
    CertificationAccreditationComponent,
    AwardsComponent,
    DescriptionFieldComponent,
    CompanyDetailsComponent,
    MoreAboutMyselfComponent,
    RecruiterDashboardComponent,
    WorkAreaComponent,
    RecruiterHeaderComponent,
    RoleTypetListComponent,
    IndustryExperienceListComponent

  ],
  providers: [
    {
      provide: Http,
      useFactory: (backend:XHRBackend, defaultOptions:RequestOptions, messageService:MessageService,
                   loaderService:LoaderService) => new CustomHttp(backend, defaultOptions, messageService, loaderService),
      deps: [XHRBackend, RequestOptions, MessageService, LoaderService]
    },
    {provide: RequestOptions, useClass: AppRequestOptions},
    {
      provide: APP_BASE_HREF,
      useValue: '<%= APP_BASE %>'
    },
    MessageService,
    RecruitingService,
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
    CandidateService,
    RecruiterService,
    DashboardService,
    ProfileService,
    ContactService,
    ResetPasswordService,
    ActiveUserService,
    ActiveEmailService,
    VerifyUserService,
    BasicJobInformationService,
    JobLocationService,
    VerifyPhoneService,
    IndustryListService,
    MyCapabilityService,
    MyRoleService,
    MyIndustryService,
    MyJobRequirementService,
    AwardService,
    ProfessionalService,
    EducationalService,
    ProfessionalDataService,
    EmploymentHistoryService,
    ProficiencyDomainService,
    CompanyDetailsService,
    EmploymentHistoryService,
    DateService,
    MyJobRequirementService,
    MyJobInformationService,
    JobRequirementService,
    MyJobLocationService,
    MyJobPostRoleTypeService,
    JonPostDescriptionService,
    JobPostComplexityService,
    JobPostProficiencyService,
    MyRoleListTestService,
    MyRoTypeTestService,
    RoleTypeService,
    IndustryExperienceService,
    DisableTestService,
    JobIndustryShowService,
    ShowJobFilterService,
    CandidateAwardService,
    AboutCandidateService,
    JobPosterService,
    CandidateAcadmyDetailService,
    CandidateProfileService,
    DisableAwardGlyphiconService,
    DisableCertificateGlyphiconService,
    DisableAboutMyselfGlyphiconService,
    DisableEmployeeHistoryGlyphiconService

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

