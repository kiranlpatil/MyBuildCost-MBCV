import {NgModule} from "@angular/core";
import {AppComponent} from "./app.component";
import {BrowserModule} from "@angular/platform-browser";
import {APP_BASE_HREF} from "@angular/common";
import {RouterModule} from "@angular/router";
import {RecaptchaModule} from "ng2-recaptcha";
import {routes} from "./app.routes";
import {Http, HttpModule, RequestOptions, XHRBackend} from "@angular/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ValidationService} from "./framework/shared/customvalidations/validation.service";
import {ControlMessagesComponent} from "./framework/shared/customvalidations/controlmessages.component";
import {AppRequestOptions, CustomHttp, LoaderService, MessageService} from "./framework/shared/index";
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
import {JobPosterComponent} from "./cnext/framework/job-poster/job-poster.component";
import {DescriptionFieldComponent} from "./cnext/framework/description-field/description-field.component";
import {CompanyDetailsComponent} from "./framework/registration/company_details/company-details.component";
import {CompanyDetailsService} from "./framework/registration/company_details/company-details.service";
import {RecruiterDashboardComponent} from "./cnext/framework/recruiter-dashboard/recruiter-dashboard.component";
import {IndustryListComponent} from "./cnext/framework/industry-list/industry-list.component";
import {IndustryListService} from "./cnext/framework/industry-list/industry-list.service";
import {DateService} from "./cnext/framework/date.service";
import {RoleTypetListComponent} from "./cnext/framework/role-type/role-type.component";
import {RoleTypeService} from "./cnext/framework/role-type/role-type.service";
import {IndustryExperienceListComponent} from "./cnext/framework/industry-experience/industry-experience.component";
import {IndustryExperienceService} from "./cnext/framework/industry-experience/industry-experience.service";
import {CandidateAwardService} from "./cnext/framework/awards/awards.service";
import {AboutCandidateService} from "./cnext/framework/more-about-myself/more-about-myself.service";
import {CandidateAcademyDetailService} from "./cnext/framework/academic-details/academic-details.service";
import {JobPosterService} from "./cnext/framework/job-poster/job-poster.service";
import {CandidateSummaryComponent} from "./cnext/framework/one-page-summary/candidate-summary/candidate-summary.component";
import {CandidateBasicInformationComponent} from "./cnext/framework/one-page-summary/candidate-summary/candidate-basic-information/candidate-basic-information.component";
import {VericalListViewComponent} from "./cnext/framework/one-page-summary/shared/vertical-list-view/vertical-list-view.component";
import {TabularListViewComponent} from "./cnext/framework/one-page-summary/shared/tabular-list-view/tabular-list-view.component";
import {HorizontalListViewComponent} from "./cnext/framework/one-page-summary/shared/horizontal-list-view/horizontal-list-view.component";
import {AdditionalDetailsComponent} from "./cnext/framework/one-page-summary/shared/additional-details/additional-details.component";
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
import {CompentenciesAndResponsibilitiesComponent} from "./cnext/framework/compentacies-and-responsibilities/compentacies-and-responsibilities.component";
import {BasicJobInformationService} from "./cnext/framework/basic-job-information/basic-job-information.service";
import {JobListerComponent} from "./cnext/framework/recruiter-dashboard/job-lister/job-lister.component";
import {QCardviewComponent} from "./cnext/framework/recruiter-dashboard/q-card-view/q-card-view.component";
import {QCardViewService} from "./cnext/framework/recruiter-dashboard/q-card-view/q-card-view.service";
import {ProgressBarComponent} from "./cnext/framework/progress-bar/progress-bar.component";
import {ShowQcardviewService} from "./cnext/framework/showQCard.service";
import {jobListerSortPipe} from "./cnext/framework/recruiter-dashboard/job-lister/job-lister.pipe";
import {RecruiterDashboardService} from "./cnext/framework/recruiter-dashboard/recruiter-dashboard.service";
import {RecruiterJobSummaryComponent} from "./cnext/framework/one-page-summary/recruiter-job-summary/recruiter-job-summary.component";
import {RecruiterJobInformation} from "./cnext/framework/one-page-summary/recruiter-job-summary/recruiter-job-information/recruiter-job-information.component";
import {MultiSelectComponent} from "./cnext/framework/multi-select/multi-select.component";
import {MultiSelectService} from "./cnext/framework/multi-select/multi-select.service";
import {JobProficienciesComponent} from "./cnext/framework/job-proficiency/job-proficiencies.component";
import {RecruiteQCardView2Service} from "./cnext/framework/recruiter-dashboard/recruiter-q-card-view2/recruiter-q-card-view2.service";
import {RecruiterQCardview2Component} from "./cnext/framework/recruiter-dashboard/recruiter-q-card-view2/recruiter-q-card-view2.component";


import {RecruiterCandidatesListsService} from "./cnext/framework/candidate-lists.service";
import {CandidateDashboardComponent} from "./cnext/framework/candidate-dashboard/candidate-dashboard.component";
import {CandidateDashboardService} from "./cnext/framework/candidate-dashboard/candidate-dashboard.service";
import {QcardListComponent} from "./cnext/framework/candidate-dashboard/candidate-q-card-list/q-card-list.component";
import {CandidateQCardComponent} from "./cnext/framework/candidate-dashboard/candidate-q-card/candidate-q-card.component";
import {CandidateHeaderComponent} from "./cnext/framework/candidate-dashboard/candidate-header/candidate-header.component";
import {FilterComponent} from "./cnext/framework/filters/filter/filter.component";
import {JobViewComponent} from "./cnext/framework/one-page-summary/recruiter-job-summary/job-view/job-view.component";
import {CandidateJobListComponent} from "./cnext/framework/candidate-dashboard/candidate-job-list/candidate-job-list.component";
import {CandidateJobListService} from "./cnext/framework/candidate-dashboard/candidate-job-list/candidate-job-list.service";
import {CandidateViewComponent} from "./cnext/framework/one-page-summary/candidate-summary/candidate-view/candidate-view.component";
import {CandidateInCartService} from "./cnext/framework/candidate-in-cart.service";
import {FilterService} from "./cnext/framework/filters/filter/filter.service";
import {RecruiterSharedHeaderComponent} from "./cnext/framework/recruiter-dashboard/recruiter-shared-header/recruiter-shared-header.component";
import {QCardFilterService} from "./cnext/framework/filters/q-card-filter.service";
import {QCardListSortPipe} from "./cnext/framework/filters/q-card-list-sort.pipe";
import {MinRangeValidation} from "./cnext/framework/filters/min-range-validation.pipe";
import {MaxRangeValidation} from "./cnext/framework/filters/max-range-validation.pipe";
import {RecuirterQCardMatchingPipe} from "./cnext/framework/filters/recuirter-q-card-matching.pipe";
import {EmployeeHistoryComponent} from "./cnext/framework/employment-history/employee-history/employee-history.component";
import {QCardListFilterPipe} from "./cnext/framework/filters/q-card-list-filter.pipe";
import {MyGoogleDirective} from "./framework/registration/candidate/google-our-place/googleplace.directive";
import {CandidateDashboardHeaderComponent} from "./cnext/framework/candidate-dashboard/candidate-dashboard-header/candidate-dashboard-header.component";
import {JobDashboardComponent} from "./cnext/framework/recruiter-dashboard/job-dashboard/job-dashboard.component";
import {JobDashboardService} from "./cnext/framework/recruiter-dashboard/job-dashboard/job-dashboard.service";
import {ReferenceService} from "./cnext/framework/model/newClass";
import {AcademicsComponent} from "./cnext/framework/academic-details/academics/academics.component";
import {CandidateCompareViewComponent} from "./cnext/framework/single-page-compare-view/candidate-compare-view/candidate-compare-view.component";
import {CapabilityCompareComponent} from "./cnext/framework/single-page-compare-view/shared/capability-compare/capability-compare.component";
import {CertificatesComponent} from "./cnext/framework/certification-accreditation/cerificates/certificates.component";
import {AwardComponent} from "./cnext/framework/awards/award/award.component";
import {ProficiencyCompareComponent} from "./cnext/framework/single-page-compare-view/shared/proficiency-compare/proficiency-compare.component";
import {CandidateCompareService} from "./cnext/framework/single-page-compare-view/candidate-compare-view/candidate-compare-view.service";
import {TooltipComponent} from "./cnext/framework/tool-tip-component/tool-tip-component";
import {JobCompareService} from "./cnext/framework/single-page-compare-view/job-compare-view/job-compare-view.service";
import {JobCompareViewComponent} from "./cnext/framework/single-page-compare-view/job-compare-view/job-compare-view.component";
import {GuidedTourComponent} from "./cnext/framework/guided-tour/guided-tour.component";

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
    MyGoogleDirective,
    LoaderComponent,
    LandingPageComponent,
    MainHeaderComponent,
    TooltipComponent,
    LoginComponent,
    RegistrationComponent,
    CandidateComponent,
    RecruiterComponent,
    CandidateDashboardHeaderComponent,
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
    CandidateSummaryComponent,
    CandidateBasicInformationComponent,
    VericalListViewComponent,
    TabularListViewComponent,
    AcademicsComponent,
    RecruiterSharedHeaderComponent,
    AdditionalDetailsComponent,
    HorizontalListViewComponent,
    CandidateProfileComponent,
    ProfileDescriptionComponent,
    CapabilitiesComponent,
    GuidedTourComponent,
    JobProficienciesComponent,
    ProficienciesComponent,
    IndustryListComponent,
    ComplexitiesComponent,
    EmployeeHistoryComponent,
    JobPosterComponent,
    MultiSelectComponent,
    BasicJobInformationComponent,
    CompentenciesAndResponsibilitiesComponent,
    CandidateJobListComponent,
    CandidateDashboardComponent,
    ProfessionalDataComponent,
    EmploymentHistoryComponent,
    CandidateCompareViewComponent,
    ProficiencyCompareComponent,
    CapabilityCompareComponent,
    AcademicDetailComponent,
    CertificationAccreditationComponent,
    AwardsComponent,
    DescriptionFieldComponent,
    CompanyDetailsComponent,
    MoreAboutMyselfComponent,
    CandidateHeaderComponent,
    FilterComponent,
    CertificatesComponent,
    AwardComponent,
    RecruiterDashboardComponent,
    ProgressBarComponent,
    CandidateViewComponent,
    WorkAreaComponent,
    JobViewComponent,
    JobCompareViewComponent,
    QcardListComponent,
    CandidateQCardComponent,
    RecruiterHeaderComponent,
    RoleTypetListComponent,
    IndustryExperienceListComponent,
    JobListerComponent,
    QCardviewComponent,
    QCardListSortPipe,
    jobListerSortPipe,
    RecruiterJobSummaryComponent,
    RecruiterJobInformation,
    RecruiterQCardview2Component,
    QCardListFilterPipe,
    RecuirterQCardMatchingPipe,
    MinRangeValidation,
    MaxRangeValidation,
    JobDashboardComponent

  ],
  providers: [
    {
      provide: Http,
      useFactory: (backend: XHRBackend, defaultOptions: RequestOptions, messageService: MessageService,
                   loaderService: LoaderService) => new CustomHttp(backend, defaultOptions, messageService, loaderService),
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
    JobCompareService,
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
    CandidateCompareService,
    ResetPasswordService,
    ActiveUserService,
    ActiveEmailService,
    VerifyUserService,
    BasicJobInformationService,
    VerifyPhoneService,
    IndustryListService,
    CandidateJobListService,
    ProfessionalDataService,
    EmploymentHistoryService,
    ProficiencyDomainService,
    CompanyDetailsService,
    EmploymentHistoryService,
    DateService,
    CandidateDashboardService,
    RoleTypeService,
    IndustryExperienceService,
    ShowQcardviewService,
    CandidateAwardService,
    MultiSelectService,
    AboutCandidateService,
    JobPosterService,
    CandidateAcademyDetailService,
    CandidateProfileService,
    RecruiterDashboardService,
    QCardViewService,
    FilterService,
    RecruiteQCardView2Service,
    RecruiterCandidatesListsService,
    CandidateInCartService,
    RecruiterCandidatesListsService,
    QCardFilterService,
    JobDashboardService,
    ReferenceService

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

