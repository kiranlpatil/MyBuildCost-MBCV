"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var app_component_1 = require("./app.component");
var platform_browser_1 = require("@angular/platform-browser");
var common_1 = require("@angular/common");
var router_1 = require("@angular/router");
var app_routes_1 = require("./app.routes");
var http_1 = require("@angular/http");
var forms_1 = require("@angular/forms");
var index_1 = require("./shared/index");
var dashboard_component_1 = require("./framework/dashboard/dashboard.component");
var about_component_1 = require("./framework/dashboard/about/about.component");
var contact_component_1 = require("./framework/dashboard/contact/contact.component");
var dashboard_home_component_1 = require("./framework/dashboard/dashboard-home/dashboard-home.component");
var header_component_1 = require("./framework/shared/header/header.component");
var notification_service_1 = require("./framework/shared/notification/notification.service");
var notification_component_1 = require("./framework/shared/notification/notification.component");
var social_icon_component_1 = require("./framework/shared/footer/social-icon/social-icon.component");
var dashboard_service_1 = require("./user/services/dashboard.service");
var contact_service_1 = require("./framework/dashboard/contact/contact.service");
var activate_user_component_1 = require("./framework/registration/activate-user/activate-user.component");
var activate_user_service_1 = require("./framework/registration/activate-user/activate-user.service");
var redirect_dashboard_service_1 = require("./user/services/redirect-dashboard.service");
var profile_detail_service_1 = require("./build-info/framework/profile-detail-service");
var my_error_handler_service_1 = require("./build-info/framework/my-error-handler.service");
var user_module_1 = require("./user/user.module");
var shared_module_1 = require("./shared/shared.module");
var custom_http_1 = require("./shared/services/http/custom.http");
var profile_service_1 = require("./framework/shared/profileservice/profile.service");
var landing_page_component_1 = require("./framework/landing-page/landing-page.component");
var shared_service_1 = require("./shared/services/shared-service");
var page_not_found_component_1 = require("./shared/page-not-found/page-not-found.component");
var analytic_service_1 = require("./shared/services/analytic.service");
var common_amenities_component_1 = require("./build-info/framework/project/cost-summary-report/common-amenities/common-amenities.component");
var dashboard_header_component_1 = require("./framework/dashboard/dashboard-header/dashboard-header.component");
var dashboard_user_profile_service_1 = require("./framework/dashboard/user-profile/dashboard-user-profile.service");
var user_change_password_service_1 = require("./framework/dashboard/user-change-password/user-change-password.service");
var auth_guard_service_1 = require("./shared/services/auth-guard.service");
var http_delegate_service_1 = require("./shared/services/http-delegate.service");
var project_service_1 = require("./build-info/framework/project/project.service");
var project_component_1 = require("./build-info/framework/project/project.component");
var create_project_component_1 = require("./build-info/framework/create-project/create-project.component");
var building_component_1 = require("./build-info/framework/project/building/building.component");
var create_building_component_1 = require("./build-info/framework/project/building/create-building/create-building.component");
var building_service_1 = require("./build-info/framework/project/building/building.service");
var project_list_component_1 = require("./build-info/framework/project-list/project-list.component");
var project_details_component_1 = require("./build-info/framework/project/project-details/project-details.component");
var building_list_component_1 = require("./build-info/framework/project/building/buildings-list/building-list.component");
var building_details_component_1 = require("./build-info/framework/project/building/building-details/building-details.component");
var project_header_component_1 = require("./build-info/framework/project-header/project-header.component");
var cost_summary_component_1 = require("./build-info/framework/project/cost-summary-report/cost-summary.component");
var cost_summary_service_1 = require("./build-info/framework/project/cost-summary-report/cost-summary.service");
var material_takeoff_component_1 = require("./build-info/framework/project/material-takeoff/material-takeoff.component");
var material_takeoff_service_1 = require("./build-info/framework/project/material-takeoff/material-takeoff.service");
var material_take_off_report_component_1 = require("./build-info/framework/project/material-takeoff/material-take-off-report/material-take-off-report.component");
var row_component_1 = require("./build-info/framework/project/material-takeoff/material-take-off-report/row/row.component");
var cost_head_component_1 = require("./build-info/framework/project/cost-summary-report/cost-head/cost-head.component");
var cost_summary_pipe_1 = require("./build-info/framework/project/cost-summary-report/cost-summary.pipe");
var get_quantity_component_1 = require("./build-info/framework/project/cost-summary-report/cost-head/get-quantity/get-quantity.component");
var project_list_header_component_1 = require("./build-info/framework/project-header/project-list-header/project-list-header.component");
var groupby_pipe_1 = require("../app/shared/services/custom-pipes/groupby.pipe");
var animations_1 = require("@angular/platform-browser/animations");
var get_rate_component_1 = require("./build-info/framework/project/cost-summary-report/cost-head/get-rate/get-rate.component");
var create_new_project_component_1 = require("./build-info/framework/create-new-project/create-new-project.component");
var project_item_component_1 = require("./build-info/framework/project-list/project-item/project-item.component");
var delete_confirmation_modal_component_1 = require("./shared/delete-confirmation-modal/delete-confirmation-modal.component");
var update_confirmation_modal_component_1 = require("./shared/update-confirmation-modal/update-confirmation-modal.component");
var project_form_component_1 = require("./build-info/framework/shared/project-form/project-form.component");
var building_form_component_1 = require("./build-info/framework/shared/building-form/building-form.component");
var share_print_page_component_1 = require("./build-info/framework/project-header/share-print-page/share-print-page.component");
var quantity_details_component_1 = require("./build-info/framework/project/cost-summary-report/cost-head/quantity-details/quantity-details.component");
var cost_head_report_component_1 = require("./build-info/framework/project/report-templates/cost-head-report/cost-head-report.component");
var cost_summary_report_component_1 = require("./build-info/framework/project/report-templates/cost-summary-report/cost-summary-report.component");
var common_amenities_report_component_1 = require("./build-info/framework/project/report-templates/common-amenities-report/common-amenities-report.component");
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_browser_1.BrowserModule,
                forms_1.FormsModule,
                router_1.RouterModule.forRoot(app_routes_1.routes),
                http_1.HttpModule,
                forms_1.ReactiveFormsModule,
                shared_module_1.SharedModule,
                user_module_1.UserModule,
                animations_1.BrowserAnimationsModule
            ],
            declarations: [
                app_component_1.AppComponent,
                landing_page_component_1.LandingPageComponent,
                activate_user_component_1.ActivateUserComponent,
                dashboard_component_1.DashboardComponent,
                about_component_1.AboutComponent,
                contact_component_1.ContactComponent,
                dashboard_home_component_1.DashboardHomeComponent,
                header_component_1.HeaderComponent,
                notification_component_1.NotificationComponent,
                social_icon_component_1.SocialIconComponent,
                dashboard_header_component_1.DashboardHeaderComponent,
                project_component_1.ProjectComponent,
                building_component_1.BuildingComponent,
                create_new_project_component_1.CreateNewProjectComponent,
                create_project_component_1.CreateProjectComponent,
                project_list_component_1.ProjectListComponent,
                create_building_component_1.CreateBuildingComponent,
                project_details_component_1.ProjectDetailsComponent,
                building_list_component_1.BuildingListComponent,
                project_header_component_1.ProjectHeaderComponent,
                project_list_header_component_1.ProjectListHeaderComponent,
                share_print_page_component_1.SharePrintPageComponent,
                building_details_component_1.BuildingDetailsComponent,
                cost_summary_component_1.CostSummaryComponent,
                cost_head_component_1.CostHeadComponent,
                cost_summary_pipe_1.CostSummaryPipe,
                get_quantity_component_1.GetQuantityComponent,
                material_takeoff_component_1.MaterialTakeoffComponent,
                material_take_off_report_component_1.MaterialTakeOffReportComponent,
                row_component_1.TableRowComponent,
                get_rate_component_1.GetRateComponent,
                project_item_component_1.ProjectItemComponent,
                quantity_details_component_1.QuantityDetailsComponent,
                groupby_pipe_1.GroupByPipe,
                delete_confirmation_modal_component_1.DeleteConfirmationModalComponent,
                update_confirmation_modal_component_1.UpdateConfirmationModalComponent,
                project_form_component_1.ProjectFormComponent,
                building_form_component_1.BuildingFormComponent,
                cost_head_report_component_1.CostHeadReportComponent,
                page_not_found_component_1.PageNotFoundComponent,
                common_amenities_component_1.CommonAmenitiesComponent,
                cost_summary_report_component_1.CostSummaryReportComponent,
                common_amenities_report_component_1.CommonAmenitiesReportComponent
            ],
            providers: [
                {
                    provide: http_1.Http,
                    useFactory: httpFactory,
                    deps: [http_1.XHRBackend, http_1.RequestOptions, index_1.MessageService, index_1.LoaderService]
                },
                { provide: http_1.RequestOptions, useClass: index_1.AppRequestOptions },
                my_error_handler_service_1.LoggerService, { provide: core_1.ErrorHandler, useClass: my_error_handler_service_1.MyErrorHandler },
                {
                    provide: common_1.APP_BASE_HREF,
                    useValue: '/'
                },
                notification_service_1.NotificationService,
                dashboard_service_1.DashboardService,
                dashboard_user_profile_service_1.DashboardUserProfileService,
                user_change_password_service_1.UserChangePasswordService,
                profile_service_1.ProfileService,
                contact_service_1.ContactService,
                activate_user_service_1.ActiveUserService,
                profile_detail_service_1.ProfileDetailsService,
                redirect_dashboard_service_1.RedirectRecruiterDashboardService,
                shared_service_1.SharedService,
                platform_browser_1.Title,
                analytic_service_1.AnalyticService,
                auth_guard_service_1.AuthGuardService,
                http_delegate_service_1.HttpDelegateService,
                project_service_1.ProjectService,
                building_service_1.BuildingService,
                cost_summary_service_1.CostSummaryService,
                material_takeoff_service_1.MaterialTakeOffService
            ],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
function httpFactory(backend, defaultOptions, messageService, loaderService) {
    return new custom_http_1.CustomHttp(backend, defaultOptions, messageService, loaderService);
}
exports.httpFactory = httpFactory;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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bmRsZXIsIE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEFwcENvbXBvbmVudCB9IGZyb20gJy4vYXBwLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IEJyb3dzZXJNb2R1bGUsIFRpdGxlIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XHJcbmltcG9ydCB7IEFQUF9CQVNFX0hSRUYgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQgeyBSb3V0ZXJNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xyXG5pbXBvcnQgeyByb3V0ZXMgfSBmcm9tICcuL2FwcC5yb3V0ZXMnO1xyXG5pbXBvcnQgeyBIdHRwLCBIdHRwTW9kdWxlLCBSZXF1ZXN0T3B0aW9ucywgWEhSQmFja2VuZCB9IGZyb20gJ0Bhbmd1bGFyL2h0dHAnO1xyXG5pbXBvcnQgeyBGb3Jtc01vZHVsZSwgUmVhY3RpdmVGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuaW1wb3J0IHsgQXBwUmVxdWVzdE9wdGlvbnMsIExvYWRlclNlcnZpY2UsIE1lc3NhZ2VTZXJ2aWNlIH0gZnJvbSAnLi9zaGFyZWQvaW5kZXgnO1xyXG5pbXBvcnQgeyBEYXNoYm9hcmRDb21wb25lbnQgfSBmcm9tICcuL2ZyYW1ld29yay9kYXNoYm9hcmQvZGFzaGJvYXJkLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IEFib3V0Q29tcG9uZW50IH0gZnJvbSAnLi9mcmFtZXdvcmsvZGFzaGJvYXJkL2Fib3V0L2Fib3V0LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IENvbnRhY3RDb21wb25lbnQgfSBmcm9tICcuL2ZyYW1ld29yay9kYXNoYm9hcmQvY29udGFjdC9jb250YWN0LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IERhc2hib2FyZEhvbWVDb21wb25lbnQgfSBmcm9tICcuL2ZyYW1ld29yay9kYXNoYm9hcmQvZGFzaGJvYXJkLWhvbWUvZGFzaGJvYXJkLWhvbWUuY29tcG9uZW50JztcclxuaW1wb3J0IHsgSGVhZGVyQ29tcG9uZW50IH0gZnJvbSAnLi9mcmFtZXdvcmsvc2hhcmVkL2hlYWRlci9oZWFkZXIuY29tcG9uZW50JztcclxuaW1wb3J0IHsgTm90aWZpY2F0aW9uU2VydmljZSB9IGZyb20gJy4vZnJhbWV3b3JrL3NoYXJlZC9ub3RpZmljYXRpb24vbm90aWZpY2F0aW9uLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBOb3RpZmljYXRpb25Db21wb25lbnQgfSBmcm9tICcuL2ZyYW1ld29yay9zaGFyZWQvbm90aWZpY2F0aW9uL25vdGlmaWNhdGlvbi5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBTb2NpYWxJY29uQ29tcG9uZW50IH0gZnJvbSAnLi9mcmFtZXdvcmsvc2hhcmVkL2Zvb3Rlci9zb2NpYWwtaWNvbi9zb2NpYWwtaWNvbi5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBEYXNoYm9hcmRTZXJ2aWNlIH0gZnJvbSAnLi91c2VyL3NlcnZpY2VzL2Rhc2hib2FyZC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ29udGFjdFNlcnZpY2UgfSBmcm9tICcuL2ZyYW1ld29yay9kYXNoYm9hcmQvY29udGFjdC9jb250YWN0LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBBY3RpdmF0ZVVzZXJDb21wb25lbnQgfSBmcm9tICcuL2ZyYW1ld29yay9yZWdpc3RyYXRpb24vYWN0aXZhdGUtdXNlci9hY3RpdmF0ZS11c2VyLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IEFjdGl2ZVVzZXJTZXJ2aWNlIH0gZnJvbSAnLi9mcmFtZXdvcmsvcmVnaXN0cmF0aW9uL2FjdGl2YXRlLXVzZXIvYWN0aXZhdGUtdXNlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUmVkaXJlY3RSZWNydWl0ZXJEYXNoYm9hcmRTZXJ2aWNlIH0gZnJvbSAnLi91c2VyL3NlcnZpY2VzL3JlZGlyZWN0LWRhc2hib2FyZC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUHJvZmlsZURldGFpbHNTZXJ2aWNlIH0gZnJvbSAnLi9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9maWxlLWRldGFpbC1zZXJ2aWNlJztcclxuaW1wb3J0IHsgTG9nZ2VyU2VydmljZSwgTXlFcnJvckhhbmRsZXIgfSBmcm9tICcuL2J1aWxkLWluZm8vZnJhbWV3b3JrL215LWVycm9yLWhhbmRsZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IFVzZXJNb2R1bGUgfSBmcm9tICcuL3VzZXIvdXNlci5tb2R1bGUnO1xyXG5pbXBvcnQgeyBTaGFyZWRNb2R1bGUgfSBmcm9tICcuL3NoYXJlZC9zaGFyZWQubW9kdWxlJztcclxuaW1wb3J0IHsgQ3VzdG9tSHR0cCB9IGZyb20gJy4vc2hhcmVkL3NlcnZpY2VzL2h0dHAvY3VzdG9tLmh0dHAnO1xyXG5pbXBvcnQgeyBQcm9maWxlU2VydmljZSB9IGZyb20gJy4vZnJhbWV3b3JrL3NoYXJlZC9wcm9maWxlc2VydmljZS9wcm9maWxlLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBMYW5kaW5nUGFnZUNvbXBvbmVudCB9IGZyb20gJy4vZnJhbWV3b3JrL2xhbmRpbmctcGFnZS9sYW5kaW5nLXBhZ2UuY29tcG9uZW50JztcclxuaW1wb3J0IHsgU2hhcmVkU2VydmljZSB9IGZyb20gJy4vc2hhcmVkL3NlcnZpY2VzL3NoYXJlZC1zZXJ2aWNlJztcclxuaW1wb3J0IHsgUGFnZU5vdEZvdW5kQ29tcG9uZW50IH0gZnJvbSAnLi9zaGFyZWQvcGFnZS1ub3QtZm91bmQvcGFnZS1ub3QtZm91bmQuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQW5hbHl0aWNTZXJ2aWNlIH0gZnJvbSAnLi9zaGFyZWQvc2VydmljZXMvYW5hbHl0aWMuc2VydmljZSc7XHJcbmltcG9ydCB7IENvbW1vbkFtZW5pdGllc0NvbXBvbmVudCB9IGZyb20gJy4vYnVpbGQtaW5mby9mcmFtZXdvcmsvcHJvamVjdC9jb3N0LXN1bW1hcnktcmVwb3J0L2NvbW1vbi1hbWVuaXRpZXMvY29tbW9uLWFtZW5pdGllcy5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBEYXNoYm9hcmRIZWFkZXJDb21wb25lbnQgfSBmcm9tICcuL2ZyYW1ld29yay9kYXNoYm9hcmQvZGFzaGJvYXJkLWhlYWRlci9kYXNoYm9hcmQtaGVhZGVyLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IERhc2hib2FyZFVzZXJQcm9maWxlU2VydmljZSB9IGZyb20gJy4vZnJhbWV3b3JrL2Rhc2hib2FyZC91c2VyLXByb2ZpbGUvZGFzaGJvYXJkLXVzZXItcHJvZmlsZS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgVXNlckNoYW5nZVBhc3N3b3JkU2VydmljZSB9IGZyb20gJy4vZnJhbWV3b3JrL2Rhc2hib2FyZC91c2VyLWNoYW5nZS1wYXNzd29yZC91c2VyLWNoYW5nZS1wYXNzd29yZC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQXV0aEd1YXJkU2VydmljZSB9IGZyb20gJy4vc2hhcmVkL3NlcnZpY2VzL2F1dGgtZ3VhcmQuc2VydmljZSc7XHJcbmltcG9ydCB7IEh0dHBEZWxlZ2F0ZVNlcnZpY2UgfSBmcm9tICcuL3NoYXJlZC9zZXJ2aWNlcy9odHRwLWRlbGVnYXRlLnNlcnZpY2UnO1xyXG5cclxuXHJcbi8vQXBwbGljYXRpb24gSU1QT1JUU1xyXG5cclxuaW1wb3J0IHsgUHJvamVjdFNlcnZpY2UgfSBmcm9tICcuL2J1aWxkLWluZm8vZnJhbWV3b3JrL3Byb2plY3QvcHJvamVjdC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUHJvamVjdENvbXBvbmVudCB9IGZyb20gJy4vYnVpbGQtaW5mby9mcmFtZXdvcmsvcHJvamVjdC9wcm9qZWN0LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IENyZWF0ZVByb2plY3RDb21wb25lbnQgfSBmcm9tICcuL2J1aWxkLWluZm8vZnJhbWV3b3JrL2NyZWF0ZS1wcm9qZWN0L2NyZWF0ZS1wcm9qZWN0LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IEJ1aWxkaW5nQ29tcG9uZW50IH0gZnJvbSAnLi9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L2J1aWxkaW5nL2J1aWxkaW5nLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IENyZWF0ZUJ1aWxkaW5nQ29tcG9uZW50IH0gZnJvbSAnLi9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L2J1aWxkaW5nL2NyZWF0ZS1idWlsZGluZy9jcmVhdGUtYnVpbGRpbmcuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQnVpbGRpbmdTZXJ2aWNlIH0gZnJvbSAnLi9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L2J1aWxkaW5nL2J1aWxkaW5nLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBQcm9qZWN0TGlzdENvbXBvbmVudCB9IGZyb20gJy4vYnVpbGQtaW5mby9mcmFtZXdvcmsvcHJvamVjdC1saXN0L3Byb2plY3QtbGlzdC5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBQcm9qZWN0RGV0YWlsc0NvbXBvbmVudCB9IGZyb20gJy4vYnVpbGQtaW5mby9mcmFtZXdvcmsvcHJvamVjdC9wcm9qZWN0LWRldGFpbHMvcHJvamVjdC1kZXRhaWxzLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IEJ1aWxkaW5nTGlzdENvbXBvbmVudCB9IGZyb20gJy4vYnVpbGQtaW5mby9mcmFtZXdvcmsvcHJvamVjdC9idWlsZGluZy9idWlsZGluZ3MtbGlzdC9idWlsZGluZy1saXN0LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IEJ1aWxkaW5nRGV0YWlsc0NvbXBvbmVudCB9IGZyb20gJy4vYnVpbGQtaW5mby9mcmFtZXdvcmsvcHJvamVjdC9idWlsZGluZy9idWlsZGluZy1kZXRhaWxzL2J1aWxkaW5nLWRldGFpbHMuY29tcG9uZW50JztcclxuaW1wb3J0IHsgUHJvamVjdEhlYWRlckNvbXBvbmVudCB9IGZyb20gJy4vYnVpbGQtaW5mby9mcmFtZXdvcmsvcHJvamVjdC1oZWFkZXIvcHJvamVjdC1oZWFkZXIuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQ29zdFN1bW1hcnlDb21wb25lbnQgfSBmcm9tICcuL2J1aWxkLWluZm8vZnJhbWV3b3JrL3Byb2plY3QvY29zdC1zdW1tYXJ5LXJlcG9ydC9jb3N0LXN1bW1hcnkuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQ29zdFN1bW1hcnlTZXJ2aWNlIH0gZnJvbSAnLi9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L2Nvc3Qtc3VtbWFyeS1yZXBvcnQvY29zdC1zdW1tYXJ5LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBNYXRlcmlhbFRha2VvZmZDb21wb25lbnQgfSBmcm9tICcuL2J1aWxkLWluZm8vZnJhbWV3b3JrL3Byb2plY3QvbWF0ZXJpYWwtdGFrZW9mZi9tYXRlcmlhbC10YWtlb2ZmLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IE1hdGVyaWFsVGFrZU9mZlNlcnZpY2UgfSBmcm9tICcuL2J1aWxkLWluZm8vZnJhbWV3b3JrL3Byb2plY3QvbWF0ZXJpYWwtdGFrZW9mZi9tYXRlcmlhbC10YWtlb2ZmLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBNYXRlcmlhbFRha2VPZmZSZXBvcnRDb21wb25lbnQgfSBmcm9tICcuL2J1aWxkLWluZm8vZnJhbWV3b3JrL3Byb2plY3QvbWF0ZXJpYWwtdGFrZW9mZi9tYXRlcmlhbC10YWtlLW9mZi1yZXBvcnQvbWF0ZXJpYWwtdGFrZS1vZmYtcmVwb3J0LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFRhYmxlUm93Q29tcG9uZW50IH0gZnJvbSAnLi9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L21hdGVyaWFsLXRha2VvZmYvbWF0ZXJpYWwtdGFrZS1vZmYtcmVwb3J0L3Jvdy9yb3cuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQ29zdEhlYWRDb21wb25lbnQgfSBmcm9tICcuL2J1aWxkLWluZm8vZnJhbWV3b3JrL3Byb2plY3QvY29zdC1zdW1tYXJ5LXJlcG9ydC9jb3N0LWhlYWQvY29zdC1oZWFkLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IENvc3RTdW1tYXJ5UGlwZSB9IGZyb20gJy4vYnVpbGQtaW5mby9mcmFtZXdvcmsvcHJvamVjdC9jb3N0LXN1bW1hcnktcmVwb3J0L2Nvc3Qtc3VtbWFyeS5waXBlJztcclxuaW1wb3J0IHsgR2V0UXVhbnRpdHlDb21wb25lbnQgfSBmcm9tICcuL2J1aWxkLWluZm8vZnJhbWV3b3JrL3Byb2plY3QvY29zdC1zdW1tYXJ5LXJlcG9ydC9jb3N0LWhlYWQvZ2V0LXF1YW50aXR5L2dldC1xdWFudGl0eS5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBQcm9qZWN0TGlzdEhlYWRlckNvbXBvbmVudCB9IGZyb20gJy4vYnVpbGQtaW5mby9mcmFtZXdvcmsvcHJvamVjdC1oZWFkZXIvcHJvamVjdC1saXN0LWhlYWRlci9wcm9qZWN0LWxpc3QtaGVhZGVyLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IEdyb3VwQnlQaXBlIH0gZnJvbSAnLi4vYXBwL3NoYXJlZC9zZXJ2aWNlcy9jdXN0b20tcGlwZXMvZ3JvdXBieS5waXBlJztcclxuaW1wb3J0IHsgQnJvd3NlckFuaW1hdGlvbnNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnO1xyXG5pbXBvcnQgeyBHZXRSYXRlQ29tcG9uZW50IH0gZnJvbSAnLi9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L2Nvc3Qtc3VtbWFyeS1yZXBvcnQvY29zdC1oZWFkL2dldC1yYXRlL2dldC1yYXRlLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IENyZWF0ZU5ld1Byb2plY3RDb21wb25lbnQgfSBmcm9tICcuL2J1aWxkLWluZm8vZnJhbWV3b3JrL2NyZWF0ZS1uZXctcHJvamVjdC9jcmVhdGUtbmV3LXByb2plY3QuY29tcG9uZW50JztcclxuaW1wb3J0IHsgUHJvamVjdEl0ZW1Db21wb25lbnQgfSBmcm9tICcuL2J1aWxkLWluZm8vZnJhbWV3b3JrL3Byb2plY3QtbGlzdC9wcm9qZWN0LWl0ZW0vcHJvamVjdC1pdGVtLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IERlbGV0ZUNvbmZpcm1hdGlvbk1vZGFsQ29tcG9uZW50IH0gZnJvbSAnLi9zaGFyZWQvZGVsZXRlLWNvbmZpcm1hdGlvbi1tb2RhbC9kZWxldGUtY29uZmlybWF0aW9uLW1vZGFsLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFVwZGF0ZUNvbmZpcm1hdGlvbk1vZGFsQ29tcG9uZW50IH0gZnJvbSAnLi9zaGFyZWQvdXBkYXRlLWNvbmZpcm1hdGlvbi1tb2RhbC91cGRhdGUtY29uZmlybWF0aW9uLW1vZGFsLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFByb2plY3RGb3JtQ29tcG9uZW50IH0gZnJvbSAnLi9idWlsZC1pbmZvL2ZyYW1ld29yay9zaGFyZWQvcHJvamVjdC1mb3JtL3Byb2plY3QtZm9ybS5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBCdWlsZGluZ0Zvcm1Db21wb25lbnQgfSBmcm9tICcuL2J1aWxkLWluZm8vZnJhbWV3b3JrL3NoYXJlZC9idWlsZGluZy1mb3JtL2J1aWxkaW5nLWZvcm0uY29tcG9uZW50JztcclxuaW1wb3J0IHsgU2hhcmVQcmludFBhZ2VDb21wb25lbnQgfSBmcm9tICcuL2J1aWxkLWluZm8vZnJhbWV3b3JrL3Byb2plY3QtaGVhZGVyL3NoYXJlLXByaW50LXBhZ2Uvc2hhcmUtcHJpbnQtcGFnZS5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBRdWFudGl0eURldGFpbHNDb21wb25lbnQgfVxyXG5mcm9tICcuL2J1aWxkLWluZm8vZnJhbWV3b3JrL3Byb2plY3QvY29zdC1zdW1tYXJ5LXJlcG9ydC9jb3N0LWhlYWQvcXVhbnRpdHktZGV0YWlscy9xdWFudGl0eS1kZXRhaWxzLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IENvc3RIZWFkUmVwb3J0Q29tcG9uZW50IH0gZnJvbSAnLi9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L3JlcG9ydC10ZW1wbGF0ZXMvY29zdC1oZWFkLXJlcG9ydC9jb3N0LWhlYWQtcmVwb3J0LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IENvc3RTdW1tYXJ5UmVwb3J0Q29tcG9uZW50IH0gZnJvbSAnLi9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L3JlcG9ydC10ZW1wbGF0ZXMvY29zdC1zdW1tYXJ5LXJlcG9ydC9jb3N0LXN1bW1hcnktcmVwb3J0LmNvbXBvbmVudCdcclxuaW1wb3J0IHsgQ29tbW9uQW1lbml0aWVzUmVwb3J0Q29tcG9uZW50IH0gZnJvbSBcIi4vYnVpbGQtaW5mby9mcmFtZXdvcmsvcHJvamVjdC9yZXBvcnQtdGVtcGxhdGVzL2NvbW1vbi1hbWVuaXRpZXMtcmVwb3J0L2NvbW1vbi1hbWVuaXRpZXMtcmVwb3J0LmNvbXBvbmVudFwiO1xyXG5ATmdNb2R1bGUoe1xyXG4gIGltcG9ydHM6IFtcclxuICAgIEJyb3dzZXJNb2R1bGUsXHJcbiAgICBGb3Jtc01vZHVsZSxcclxuICAgIFJvdXRlck1vZHVsZS5mb3JSb290KHJvdXRlcyksXHJcbiAgICBIdHRwTW9kdWxlLFxyXG4gICAgUmVhY3RpdmVGb3Jtc01vZHVsZSxcclxuICAgIFNoYXJlZE1vZHVsZSxcclxuICAgIFVzZXJNb2R1bGUsXHJcbiAgICBCcm93c2VyQW5pbWF0aW9uc01vZHVsZVxyXG4gIF0sXHJcbiAgZGVjbGFyYXRpb25zOiBbXHJcbiAgICBBcHBDb21wb25lbnQsXHJcbiAgICBMYW5kaW5nUGFnZUNvbXBvbmVudCxcclxuICAgIEFjdGl2YXRlVXNlckNvbXBvbmVudCxcclxuICAgIERhc2hib2FyZENvbXBvbmVudCxcclxuICAgIEFib3V0Q29tcG9uZW50LFxyXG4gICAgQ29udGFjdENvbXBvbmVudCxcclxuICAgIERhc2hib2FyZEhvbWVDb21wb25lbnQsXHJcbiAgICBIZWFkZXJDb21wb25lbnQsXHJcbiAgICBOb3RpZmljYXRpb25Db21wb25lbnQsXHJcbiAgICBTb2NpYWxJY29uQ29tcG9uZW50LFxyXG5cclxuICAgIC8vQXBwbGljYXRpb24gQ09NUE9ORU5UXHJcbiAgICBEYXNoYm9hcmRIZWFkZXJDb21wb25lbnQsXHJcbiAgICBQcm9qZWN0Q29tcG9uZW50LFxyXG4gICAgQnVpbGRpbmdDb21wb25lbnQsXHJcbiAgICBDcmVhdGVOZXdQcm9qZWN0Q29tcG9uZW50LFxyXG4gICAgQ3JlYXRlUHJvamVjdENvbXBvbmVudCxcclxuICAgIFByb2plY3RMaXN0Q29tcG9uZW50LFxyXG4gICAgQ3JlYXRlQnVpbGRpbmdDb21wb25lbnQsXHJcbiAgICBQcm9qZWN0RGV0YWlsc0NvbXBvbmVudCxcclxuICAgIEJ1aWxkaW5nTGlzdENvbXBvbmVudCxcclxuICAgIFByb2plY3RIZWFkZXJDb21wb25lbnQsXHJcbiAgICBQcm9qZWN0TGlzdEhlYWRlckNvbXBvbmVudCxcclxuICAgIFNoYXJlUHJpbnRQYWdlQ29tcG9uZW50LFxyXG4gICAgQnVpbGRpbmdEZXRhaWxzQ29tcG9uZW50LFxyXG4gICAgQ29zdFN1bW1hcnlDb21wb25lbnQsXHJcbiAgICBDb3N0SGVhZENvbXBvbmVudCxcclxuICAgIENvc3RTdW1tYXJ5UGlwZSxcclxuICAgIEdldFF1YW50aXR5Q29tcG9uZW50LFxyXG4gICAgTWF0ZXJpYWxUYWtlb2ZmQ29tcG9uZW50LFxyXG4gICAgTWF0ZXJpYWxUYWtlT2ZmUmVwb3J0Q29tcG9uZW50LFxyXG4gICAgVGFibGVSb3dDb21wb25lbnQsXHJcbiAgICBHZXRSYXRlQ29tcG9uZW50LFxyXG4gICAgUHJvamVjdEl0ZW1Db21wb25lbnQsXHJcbiAgICBRdWFudGl0eURldGFpbHNDb21wb25lbnQsXHJcbiAgICAvL015RGFzaGJvYXJkQ29tcG9uZW50LFxyXG5cclxuICAgIC8vU2hhcmVkIENvbXBvbmVudHNcclxuICAgIEdyb3VwQnlQaXBlLFxyXG4gICAgRGVsZXRlQ29uZmlybWF0aW9uTW9kYWxDb21wb25lbnQsXHJcbiAgICBVcGRhdGVDb25maXJtYXRpb25Nb2RhbENvbXBvbmVudCxcclxuICAgIFByb2plY3RGb3JtQ29tcG9uZW50LFxyXG4gICAgQnVpbGRpbmdGb3JtQ29tcG9uZW50LFxyXG5cclxuICAgIC8vcmVwb3J0IHBkZlxyXG4gICAgQ29zdEhlYWRSZXBvcnRDb21wb25lbnQsXHJcblxyXG4gICAgUGFnZU5vdEZvdW5kQ29tcG9uZW50LFxyXG4gICAgQ29tbW9uQW1lbml0aWVzQ29tcG9uZW50LFxyXG4gICAgQ29zdFN1bW1hcnlSZXBvcnRDb21wb25lbnQsXHJcbiAgICBDb21tb25BbWVuaXRpZXNSZXBvcnRDb21wb25lbnRcclxuICBdLFxyXG5cclxuICBwcm92aWRlcnM6IFtcclxuICAgIHtcclxuICAgICAgcHJvdmlkZTogSHR0cCxcclxuICAgICAgdXNlRmFjdG9yeTogaHR0cEZhY3RvcnksXHJcbiAgICAgIGRlcHM6IFtYSFJCYWNrZW5kLCBSZXF1ZXN0T3B0aW9ucywgTWVzc2FnZVNlcnZpY2UsIExvYWRlclNlcnZpY2VdXHJcbiAgICB9LFxyXG4gICAge3Byb3ZpZGU6IFJlcXVlc3RPcHRpb25zLCB1c2VDbGFzczogQXBwUmVxdWVzdE9wdGlvbnN9LFxyXG4gICAgTG9nZ2VyU2VydmljZSwge3Byb3ZpZGU6IEVycm9ySGFuZGxlciwgdXNlQ2xhc3M6IE15RXJyb3JIYW5kbGVyfSxcclxuICAgIHtcclxuICAgICAgcHJvdmlkZTogQVBQX0JBU0VfSFJFRixcclxuICAgICAgdXNlVmFsdWU6ICc8JT0gQVBQX0JBU0UgJT4nXHJcbiAgICB9LFxyXG4gICAgTm90aWZpY2F0aW9uU2VydmljZSxcclxuICAgIERhc2hib2FyZFNlcnZpY2UsXHJcbiAgICBEYXNoYm9hcmRVc2VyUHJvZmlsZVNlcnZpY2UsXHJcbiAgICBVc2VyQ2hhbmdlUGFzc3dvcmRTZXJ2aWNlLFxyXG4gICAgUHJvZmlsZVNlcnZpY2UsXHJcbiAgICBDb250YWN0U2VydmljZSxcclxuICAgIEFjdGl2ZVVzZXJTZXJ2aWNlLFxyXG4gICAgUHJvZmlsZURldGFpbHNTZXJ2aWNlLFxyXG4gICAgUmVkaXJlY3RSZWNydWl0ZXJEYXNoYm9hcmRTZXJ2aWNlLFxyXG4gICAgU2hhcmVkU2VydmljZSxcclxuICAgIFRpdGxlLFxyXG4gICAgQW5hbHl0aWNTZXJ2aWNlLFxyXG4gICAgQXV0aEd1YXJkU2VydmljZSxcclxuICAgIEh0dHBEZWxlZ2F0ZVNlcnZpY2UsXHJcblxyXG4gICAgLy9BcHBsaWNhdGlvbiBTZXJ2aWNlc1xyXG4gICAgUHJvamVjdFNlcnZpY2UsXHJcbiAgICBCdWlsZGluZ1NlcnZpY2UsXHJcbiAgICBDb3N0U3VtbWFyeVNlcnZpY2UsXHJcbiAgICBNYXRlcmlhbFRha2VPZmZTZXJ2aWNlXHJcbiAgXSxcclxuICBib290c3RyYXA6IFtBcHBDb21wb25lbnRdXHJcbn0pXHJcblxyXG5leHBvcnQgY2xhc3MgQXBwTW9kdWxlIHtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGh0dHBGYWN0b3J5KGJhY2tlbmQ6IFhIUkJhY2tlbmQsIGRlZmF1bHRPcHRpb25zOiBSZXF1ZXN0T3B0aW9ucywgbWVzc2FnZVNlcnZpY2U6IE1lc3NhZ2VTZXJ2aWNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9hZGVyU2VydmljZTogTG9hZGVyU2VydmljZSkge1xyXG4gIHJldHVybiAgbmV3IEN1c3RvbUh0dHAoYmFja2VuZCwgZGVmYXVsdE9wdGlvbnMsIG1lc3NhZ2VTZXJ2aWNlLCBsb2FkZXJTZXJ2aWNlKTtcclxufVxyXG5cclxuIl19
