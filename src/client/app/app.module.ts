import {ErrorHandler, NgModule} from "@angular/core";
import {AppComponent} from "./app.component";
import {BrowserModule, Title} from "@angular/platform-browser";
import {APP_BASE_HREF} from "@angular/common";
import {RouterModule} from "@angular/router";
import {RecaptchaModule} from "ng2-recaptcha";
import {routes} from "./app.routes";
import {Http, HttpModule, RequestOptions, XHRBackend} from "@angular/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AppRequestOptions, LoaderService, MessageService} from "./shared/index";
import {DashboardComponent} from "./framework/dashboard/dashboard.component";
import {AboutComponent} from "./framework/dashboard/about/about.component";
import {ContactComponent} from "./framework/dashboard/contact/contact.component";
import {DashboardHomeComponent} from "./framework/dashboard/dashboard-home/dashboard-home.component";
import {FooterComponent} from "./framework/shared/footer/footer.component";
import {HeaderComponent} from "./framework/shared/header/header.component";
import {NotificationService} from "./framework/shared/notification/notification.service";
import {NotificationComponent} from "./framework/shared/notification/notification.component";
import {SocialIconComponent} from "./framework/shared/footer/social-icon/social-icon.component";
import {DashboardService} from "./user/services/dashboard.service";
import {ContactService} from "./framework/dashboard/contact/contact.service";
import {ActivateUserComponent} from "./framework/registration/activate-user/activate-user.component";
import {ActiveUserService} from "./framework/registration/activate-user/activate-user.service";
import {Ng2AutoCompleteModule} from "ng2-auto-complete/dist/ng2-auto-complete.module";
import {ScrollToModule} from "ng2-scroll-to";
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
import {RecruiterDashboardComponent} from "./cnext/framework/recruiter-dashboard/recruiter-dashboard.component";
import {IndustryListComponent} from "./cnext/framework/industry-list/industry-list.component";
import {IndustryListService} from "./cnext/framework/industry-list/industry-list.service";
import {DateService} from "./cnext/framework/date.service";
import {RoleTypeListComponent} from "./cnext/framework/role-type/role-type.component";
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
import {CompetenciesAndResponsibilitiesComponent} from "./cnext/framework/compentacies-and-responsibilities/compentacies-and-responsibilities.component";
import {BasicJobInformationService} from "./cnext/framework/basic-job-information/basic-job-information.service";
import {JobListerComponent} from "./cnext/framework/recruiter-dashboard/job-lister/job-lister.component";
import {QCardviewComponent} from "./cnext/framework/recruiter-dashboard/q-card-view/q-card-view.component";
import {QCardViewService} from "./cnext/framework/recruiter-dashboard/q-card-view/q-card-view.service";
import {ProgressBarComponent} from "./cnext/framework/progress-bar/progress-bar.component";
import {ShowQcardviewService} from "./cnext/framework/showQCard.service";
import {JobListerSortPipe} from "./cnext/framework/recruiter-dashboard/job-lister/job-lister.pipe";
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
import {FilterComponent} from "./cnext/framework/filters/filter/filter.component";
import {JobViewComponent} from "./cnext/framework/one-page-summary/recruiter-job-summary/job-view/job-view.component";
import {CandidateJobListComponent} from "./cnext/framework/candidate-dashboard/candidate-job-list/candidate-job-list.component";
import {CandidateJobListService} from "./cnext/framework/candidate-dashboard/candidate-job-list/candidate-job-list.service";
import {CandidateViewComponent} from "./cnext/framework/one-page-summary/candidate-summary/candidate-view/candidate-view.component";
import {ValuePortraitContainerComponent} from "./cnext/framework/value-portrait/value-portrait-container.component";
import {ValuePortraitComponent} from "./cnext/framework/value-portrait/value-portrait-component/value-portrait.component";
import {ValuePortraitHeader} from "./cnext/framework/value-portrait/value-portrait-component/value-portrait-header/value-portrait-header.component";
import {CandidateInfoBlock} from "./cnext/framework/value-portrait/value-portrait-component/candidate-info-block/candidate-info-block.component";
import {CandidateCapabilityPortrait} from "./cnext/framework/value-portrait/value-portrait-component/candidate-capability-portrait/candidate-capability-portrait.component";
import {CandidateInCartService} from "./cnext/framework/candidate-in-cart.service";
import {FilterService} from "./cnext/framework/filters/filter/filter.service";
import {QCardFilterService} from "./cnext/framework/filters/q-card-filter.service";
import {QCardListSortPipe} from "./cnext/framework/filters/q-card-list-sort.pipe";
import {MinRangeValidation} from "./cnext/framework/filters/min-range-validation.pipe";
import {MaxRangeValidation} from "./cnext/framework/filters/max-range-validation.pipe";
import {RecuirterQCardMatchingPipe} from "./cnext/framework/filters/recuirter-q-card-matching.pipe";
import {EmployeeHistoryComponent} from "./cnext/framework/employment-history/employee-history/employee-history.component";
import {QCardListFilterPipe} from "./cnext/framework/filters/q-card-list-filter.pipe";
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
import {JobCompareService} from "./cnext/framework/single-page-compare-view/job-compare-view/job-compare-view.service";
import {JobCompareViewComponent} from "./cnext/framework/single-page-compare-view/job-compare-view/job-compare-view.component";
import {GuidedTourComponent} from "./cnext/framework/guided-tour/guided-tour.component";
import {RedirectRecruiterDashboardService} from "./user/services/redirect-dashboard.service";
import {QuestionAnswerComponent} from "./cnext/framework/question-answer/question-answer.component";
import {ComplexityComponentService} from "./cnext/framework/complexities/complexity.service";
import {ReleventIndustryListComponent} from "./cnext/framework/relevent-industry-list/relevent-industry-list.component";
import {ReleventIndustryListService} from "./cnext/framework/relevent-industry-list/relevent-industry-list.service";
import {MultipleQuestionAnswerComponent} from "./cnext/framework/multiple-question-answer/multiple-question-answer.component";
import {ProfessionalDetailsService} from "./cnext/framework/professional-detail-service";
import {ProfessionalDetailsDirective} from "./cnext/framework/shared-directives/professional-details.directive";
import {ProfileDetailsService} from "./cnext/framework/profile-detail-service";
import {ProfileDetailsDirective} from "./cnext/framework/shared-directives/profile-details.directive";
import {ProficiencyDetailsDirective} from "./cnext/framework/shared-directives/proficiency-details.directive";
import {ProficiencyDetailsService} from "./cnext/framework/proficiency-detail-service";
import {IndustryDetailsService} from "./cnext/framework/industry-detail-service";
import {IndustryDetailsDirective} from "./cnext/framework/shared-directives/industry-details.directive";
import {IndustryDataDirective} from "./cnext/framework/shared-directives/industry-data.directive";
import {IndustryDataService} from "./cnext/framework/industry-data-service";
import {ProfileComparisonComponent} from "./cnext/framework/profile-comparison/profile-comparison.component";
import {ProfileComparisonService} from "./cnext/framework/profile-comparison/profile-comparison.service";
import {ProfileComparisonHeaderComponent} from "./cnext/framework/profile-comparison/profile-comparison-header/profile-comparison-header.component";
import {ProfileCapabilityComparisonComponent} from "./cnext/framework/profile-comparison/profile-capability-comparison/profile-capability-comparison.component";
import {ProfileCapabilityComparisonMetaComponent} from "./cnext/framework/profile-comparison/profile-capability-comparison/profile-capability-comparison-meta/profile-capability-comparison-meta.component";
import {ProfileComparisonHeaderMetaComponent} from "./cnext/framework/profile-comparison/profile-comparison-header/profile-comparison-header-meta/profile-comparison-header-meta.component";
import {ProfileAttributeComparisonComponent} from "./cnext/framework/profile-comparison/profile-attribute-comparison/profile-attribute-comparison.component";
import {ProfileComparisonPipe} from "./cnext/framework/profile-comparison/profile-capability-comparison/profile-comparison.pipe";
import {ColorShadeDirective} from "./cnext/framework/profile-comparison/profile-capability-comparison/color-shade.directive";
import {AttributeFilterPipe} from "./cnext/framework/profile-comparison/profile-attribute-comparison/attribute-filter.pipe";
import {ValueSortFilterPipe} from "./cnext/framework/profile-comparison/value-sort.pipe";
import {GuidedTourService} from "./cnext/framework/guided-tour.service";
import {ErrorService} from "./cnext/framework/error.service";
import {LoggerService, MyErrorHandler} from "./cnext/framework/my-error-handler.service";
import {AdminDashboardComponent} from "./cnext/framework/admin-dashboard/admin-dashboard.component";
import {RecruiterDetailListComponent} from "./cnext/framework/admin-dashboard/recruiter-detail-list/recruiter-detail-list.component";
import {CandidateDetailListComponent} from "./cnext/framework/admin-dashboard/candidate-detail-list/candidate-detail-list.component";
import {KeyskillsDetailListComponent} from "./cnext/framework/admin-dashboard/keyskills-detail-list/keyskills-detail-list.component";
import {AdminDashboardService} from "./cnext/framework/admin-dashboard/admin-dashboard.service";
import {CandidateSearchComponent} from "./cnext/framework/candidate-search/candidate-search.component";
import {CandidateSearchService} from "./cnext/framework/candidate-search/candidate-search.service";
import {UserModule} from "./user/user.module";
import {SharedModule} from "./shared/shared.module";
import {CustomHttp} from "./shared/services/http/custom.http";
import {ProfileService} from "./framework/shared/profileservice/profile.service";
import {LandingPageComponent} from "./framework/landing-page/landing-page.component";
import {ShareComponent} from "./cnext/framework/share/share.component";
import {ShareService} from "./cnext/framework/share/share.service";
import {SharedService} from "./shared/services/shared-service";
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
    ScrollToModule.forRoot(),
    SharedModule,
    UserModule
  ],
  declarations: [
    AppComponent,
    LandingPageComponent,
    ActivateUserComponent,
    DashboardComponent,
    AboutComponent,
    ContactComponent,
    DashboardHomeComponent,
    HeaderComponent,
    FooterComponent,
    NotificationComponent,
    SocialIconComponent,

    //C-NEXT COMPONENT

    CandidateSummaryComponent,
    CandidateBasicInformationComponent,
    VericalListViewComponent,
    TabularListViewComponent,
    AcademicsComponent,
    ProfileDetailsDirective,
    ProfessionalDetailsDirective,
    AdditionalDetailsComponent,
    RecruiterDetailListComponent,
    CandidateDetailListComponent,
    KeyskillsDetailListComponent,
    HorizontalListViewComponent,
    CandidateProfileComponent,
    ProfileDescriptionComponent,
    CapabilitiesComponent,
    GuidedTourComponent,
    AdminDashboardComponent,
    MultipleQuestionAnswerComponent,
    JobProficienciesComponent,
    ProficienciesComponent,
    IndustryListComponent,
    ComplexitiesComponent,
    EmployeeHistoryComponent,
    JobPosterComponent,
    QuestionAnswerComponent,
    MultiSelectComponent,
    BasicJobInformationComponent,
    CompetenciesAndResponsibilitiesComponent,
    CandidateJobListComponent,
    CandidateDashboardComponent,
    ProfessionalDataComponent,
    ProficiencyDetailsDirective,
    EmploymentHistoryComponent,
    CandidateCompareViewComponent,
    ProficiencyCompareComponent,
    CapabilityCompareComponent,
    AcademicDetailComponent,
    CertificationAccreditationComponent,
    AwardsComponent,
    DescriptionFieldComponent,
    MoreAboutMyselfComponent,
    FilterComponent,
    CertificatesComponent,
    AwardComponent,
    RecruiterDashboardComponent,
    ProgressBarComponent,
    CandidateViewComponent,
    ValuePortraitContainerComponent,
    ValuePortraitComponent,
    ValuePortraitHeader,
    CandidateInfoBlock,
    CandidateCapabilityPortrait,
    WorkAreaComponent,
    IndustryDetailsDirective,
    IndustryDataDirective,
    JobViewComponent,
    JobCompareViewComponent,
    QcardListComponent,
    CandidateQCardComponent,
    RecruiterHeaderComponent,
    RoleTypeListComponent,
    IndustryExperienceListComponent,
    JobListerComponent,
    QCardviewComponent,
    QCardListSortPipe,
    JobListerSortPipe,
    RecruiterJobSummaryComponent,
    RecruiterJobInformation,
    RecruiterQCardview2Component,
    QCardListFilterPipe,
    RecuirterQCardMatchingPipe,
    MinRangeValidation,
    MaxRangeValidation,
    JobDashboardComponent,
    ReleventIndustryListComponent,
    ProfileComparisonComponent,
    ProfileComparisonHeaderComponent,
    ProfileCapabilityComparisonComponent,
    ProfileCapabilityComparisonMetaComponent,
    ProfileComparisonHeaderMetaComponent,
    ProfileAttributeComparisonComponent,
    ProfileComparisonPipe,
    ColorShadeDirective,
    AttributeFilterPipe,
    ValueSortFilterPipe,
    CandidateSearchComponent,
    ShareComponent
  ],
  providers: [
    {
      provide: Http,
      useFactory: (backend: XHRBackend, defaultOptions: RequestOptions, messageService: MessageService,
                   loaderService: LoaderService) => new CustomHttp(backend, defaultOptions, messageService, loaderService),
      deps: [XHRBackend, RequestOptions, MessageService, LoaderService]
    },
    {provide: RequestOptions, useClass: AppRequestOptions},
    LoggerService, {provide: ErrorHandler, useClass: MyErrorHandler},
    {
      provide: APP_BASE_HREF,
      useValue: '<%= APP_BASE %>'
    },
    ComplexityComponentService,
    ComplexityService,
    JobCompareService,
    NotificationService,
    DashboardService,
    ProfileService,
    ContactService,
    CandidateCompareService,
    ActiveUserService,
    BasicJobInformationService,
    ErrorService,
    IndustryListService,
    CandidateJobListService,
    ProfessionalDataService,
    EmploymentHistoryService,
    ProficiencyDomainService,
    EmploymentHistoryService,
    DateService,
    CandidateDashboardService,
    RoleTypeService,
    IndustryExperienceService,
    ShowQcardviewService,
    CandidateAwardService,
    MultiSelectService,
    ProfileDetailsService,
    AboutCandidateService,
    JobPosterService,
    ProfessionalDetailsService,
    CandidateAcademyDetailService,
    CandidateProfileService,
    RecruiterDashboardService,
    QCardViewService,
    IndustryDetailsService,
    ProficiencyDetailsService,
    AdminDashboardService,
    FilterService,
    IndustryDataService,
    RecruiteQCardView2Service,
    RecruiterCandidatesListsService,
    CandidateInCartService,
    RecruiterCandidatesListsService,
    QCardFilterService,
    JobDashboardService,
    ReferenceService,
    RedirectRecruiterDashboardService,
    ReleventIndustryListService,
    ProfileComparisonService,
    GuidedTourService,
    CandidateSearchService,
    SharedService,
    ShareService,
    Title
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

