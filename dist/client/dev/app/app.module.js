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
var project_form_component_1 = require("./build-info/framework/shared/project-form/project-form.component");
var building_form_component_1 = require("./build-info/framework/shared/building-form/building-form.component");
var share_print_page_component_1 = require("./build-info/framework/project-header/share-print-page/share-print-page.component");
var quantity_details_component_1 = require("./build-info/framework/project/cost-summary-report/cost-head/quantity-details/quantity-details.component");
var cost_head_report_component_1 = require("./build-info/framework/project/report-templates/cost-head-report/cost-head-report.component");
var cost_summary_report_component_1 = require("./build-info/framework/project/report-templates/cost-summary-report/cost-summary-report.component");
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
                project_form_component_1.ProjectFormComponent,
                building_form_component_1.BuildingFormComponent,
                cost_head_report_component_1.CostHeadReportComponent,
                page_not_found_component_1.PageNotFoundComponent,
                common_amenities_component_1.CommonAmenitiesComponent,
                cost_summary_report_component_1.CostSummaryReportComponent
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,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QkFDRSxPQUFPLEVBQUUsV0FBSTtvQkFDYixVQUFVLEVBQUUsV0FBVztvQkFDdkIsSUFBSSxFQUFFLENBQUMsaUJBQVUsRUFBRSxxQkFBYyxFQUFFLHNCQUFjLEVBQUUscUJBQWEsQ0FBQztpQkFDbEU7Z0JBQ0QsRUFBQyxPQUFPLEVBQUUscUJBQWMsRUFBRSxRQUFRLEVBQUUseUJBQWlCLEVBQUM7Z0JBQ3RELHdDQUFhLEVBQUUsRUFBQyxPQUFPLEVBQUUsbUJBQVksRUFBRSxRQUFRLEVBQUUseUNBQWMsRUFBQztnQkFDaEU7b0JBQ0UsT0FBTyxFQUFFLHNCQUFhO29CQUN0QixRQUFRLEVBQUUsaUJBQWlCO2lCQUM1QjtnQkFDRCwwQ0FBbUI7Z0JBQ25CLG9DQUFnQjtnQkFDaEIsNERBQTJCO2dCQUMzQix3REFBeUI7Z0JBQ3pCLGdDQUFjO2dCQUNkLGdDQUFjO2dCQUNkLHlDQUFpQjtnQkFDakIsOENBQXFCO2dCQUNyQiw4REFBaUM7Z0JBQ2pDLDhCQUFhO2dCQUNiLHdCQUFLO2dCQUNMLGtDQUFlO2dCQUNmLHFDQUFnQjtnQkFDaEIsMkNBQW1CO2dCQUduQixnQ0FBYztnQkFDZCxrQ0FBZTtnQkFDZix5Q0FBa0I7Z0JBQ2xCLGlEQUFzQjthQUN2QjtZQUNELFNBQVMsRUFBRSxDQUFDLDRCQUFZLENBQUM7U0FDMUIsQ0FBQztPQUVXLFNBQVMsQ0FDckI7SUFBRCxnQkFBQztDQURELEFBQ0MsSUFBQTtBQURZLDhCQUFTO0FBR3RCLHFCQUE0QixPQUFtQixFQUFFLGNBQThCLEVBQUUsY0FBOEIsRUFDbkYsYUFBNEI7SUFDdEQsTUFBTSxDQUFFLElBQUksd0JBQVUsQ0FBQyxPQUFPLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxhQUFhLENBQUMsQ0FBQztBQUNqRixDQUFDO0FBSEQsa0NBR0MiLCJmaWxlIjoiYXBwL2FwcC5tb2R1bGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFcnJvckhhbmRsZXIsIE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEFwcENvbXBvbmVudCB9IGZyb20gJy4vYXBwLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IEJyb3dzZXJNb2R1bGUsIFRpdGxlIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XHJcbmltcG9ydCB7IEFQUF9CQVNFX0hSRUYgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQgeyBSb3V0ZXJNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xyXG5pbXBvcnQgeyByb3V0ZXMgfSBmcm9tICcuL2FwcC5yb3V0ZXMnO1xyXG5pbXBvcnQgeyBIdHRwLCBIdHRwTW9kdWxlLCBSZXF1ZXN0T3B0aW9ucywgWEhSQmFja2VuZCB9IGZyb20gJ0Bhbmd1bGFyL2h0dHAnO1xyXG5pbXBvcnQgeyBGb3Jtc01vZHVsZSwgUmVhY3RpdmVGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuaW1wb3J0IHsgQXBwUmVxdWVzdE9wdGlvbnMsIExvYWRlclNlcnZpY2UsIE1lc3NhZ2VTZXJ2aWNlIH0gZnJvbSAnLi9zaGFyZWQvaW5kZXgnO1xyXG5pbXBvcnQgeyBEYXNoYm9hcmRDb21wb25lbnQgfSBmcm9tICcuL2ZyYW1ld29yay9kYXNoYm9hcmQvZGFzaGJvYXJkLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IEFib3V0Q29tcG9uZW50IH0gZnJvbSAnLi9mcmFtZXdvcmsvZGFzaGJvYXJkL2Fib3V0L2Fib3V0LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IENvbnRhY3RDb21wb25lbnQgfSBmcm9tICcuL2ZyYW1ld29yay9kYXNoYm9hcmQvY29udGFjdC9jb250YWN0LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IERhc2hib2FyZEhvbWVDb21wb25lbnQgfSBmcm9tICcuL2ZyYW1ld29yay9kYXNoYm9hcmQvZGFzaGJvYXJkLWhvbWUvZGFzaGJvYXJkLWhvbWUuY29tcG9uZW50JztcclxuaW1wb3J0IHsgSGVhZGVyQ29tcG9uZW50IH0gZnJvbSAnLi9mcmFtZXdvcmsvc2hhcmVkL2hlYWRlci9oZWFkZXIuY29tcG9uZW50JztcclxuaW1wb3J0IHsgTm90aWZpY2F0aW9uU2VydmljZSB9IGZyb20gJy4vZnJhbWV3b3JrL3NoYXJlZC9ub3RpZmljYXRpb24vbm90aWZpY2F0aW9uLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBOb3RpZmljYXRpb25Db21wb25lbnQgfSBmcm9tICcuL2ZyYW1ld29yay9zaGFyZWQvbm90aWZpY2F0aW9uL25vdGlmaWNhdGlvbi5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBTb2NpYWxJY29uQ29tcG9uZW50IH0gZnJvbSAnLi9mcmFtZXdvcmsvc2hhcmVkL2Zvb3Rlci9zb2NpYWwtaWNvbi9zb2NpYWwtaWNvbi5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBEYXNoYm9hcmRTZXJ2aWNlIH0gZnJvbSAnLi91c2VyL3NlcnZpY2VzL2Rhc2hib2FyZC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ29udGFjdFNlcnZpY2UgfSBmcm9tICcuL2ZyYW1ld29yay9kYXNoYm9hcmQvY29udGFjdC9jb250YWN0LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBBY3RpdmF0ZVVzZXJDb21wb25lbnQgfSBmcm9tICcuL2ZyYW1ld29yay9yZWdpc3RyYXRpb24vYWN0aXZhdGUtdXNlci9hY3RpdmF0ZS11c2VyLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IEFjdGl2ZVVzZXJTZXJ2aWNlIH0gZnJvbSAnLi9mcmFtZXdvcmsvcmVnaXN0cmF0aW9uL2FjdGl2YXRlLXVzZXIvYWN0aXZhdGUtdXNlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUmVkaXJlY3RSZWNydWl0ZXJEYXNoYm9hcmRTZXJ2aWNlIH0gZnJvbSAnLi91c2VyL3NlcnZpY2VzL3JlZGlyZWN0LWRhc2hib2FyZC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUHJvZmlsZURldGFpbHNTZXJ2aWNlIH0gZnJvbSAnLi9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9maWxlLWRldGFpbC1zZXJ2aWNlJztcclxuaW1wb3J0IHsgTG9nZ2VyU2VydmljZSwgTXlFcnJvckhhbmRsZXIgfSBmcm9tICcuL2J1aWxkLWluZm8vZnJhbWV3b3JrL215LWVycm9yLWhhbmRsZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IFVzZXJNb2R1bGUgfSBmcm9tICcuL3VzZXIvdXNlci5tb2R1bGUnO1xyXG5pbXBvcnQgeyBTaGFyZWRNb2R1bGUgfSBmcm9tICcuL3NoYXJlZC9zaGFyZWQubW9kdWxlJztcclxuaW1wb3J0IHsgQ3VzdG9tSHR0cCB9IGZyb20gJy4vc2hhcmVkL3NlcnZpY2VzL2h0dHAvY3VzdG9tLmh0dHAnO1xyXG5pbXBvcnQgeyBQcm9maWxlU2VydmljZSB9IGZyb20gJy4vZnJhbWV3b3JrL3NoYXJlZC9wcm9maWxlc2VydmljZS9wcm9maWxlLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBMYW5kaW5nUGFnZUNvbXBvbmVudCB9IGZyb20gJy4vZnJhbWV3b3JrL2xhbmRpbmctcGFnZS9sYW5kaW5nLXBhZ2UuY29tcG9uZW50JztcclxuaW1wb3J0IHsgU2hhcmVkU2VydmljZSB9IGZyb20gJy4vc2hhcmVkL3NlcnZpY2VzL3NoYXJlZC1zZXJ2aWNlJztcclxuaW1wb3J0IHsgUGFnZU5vdEZvdW5kQ29tcG9uZW50IH0gZnJvbSAnLi9zaGFyZWQvcGFnZS1ub3QtZm91bmQvcGFnZS1ub3QtZm91bmQuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQW5hbHl0aWNTZXJ2aWNlIH0gZnJvbSAnLi9zaGFyZWQvc2VydmljZXMvYW5hbHl0aWMuc2VydmljZSc7XHJcbmltcG9ydCB7IENvbW1vbkFtZW5pdGllc0NvbXBvbmVudCB9IGZyb20gJy4vYnVpbGQtaW5mby9mcmFtZXdvcmsvcHJvamVjdC9jb3N0LXN1bW1hcnktcmVwb3J0L2NvbW1vbi1hbWVuaXRpZXMvY29tbW9uLWFtZW5pdGllcy5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBEYXNoYm9hcmRIZWFkZXJDb21wb25lbnQgfSBmcm9tICcuL2ZyYW1ld29yay9kYXNoYm9hcmQvZGFzaGJvYXJkLWhlYWRlci9kYXNoYm9hcmQtaGVhZGVyLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IERhc2hib2FyZFVzZXJQcm9maWxlU2VydmljZSB9IGZyb20gJy4vZnJhbWV3b3JrL2Rhc2hib2FyZC91c2VyLXByb2ZpbGUvZGFzaGJvYXJkLXVzZXItcHJvZmlsZS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgVXNlckNoYW5nZVBhc3N3b3JkU2VydmljZSB9IGZyb20gJy4vZnJhbWV3b3JrL2Rhc2hib2FyZC91c2VyLWNoYW5nZS1wYXNzd29yZC91c2VyLWNoYW5nZS1wYXNzd29yZC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQXV0aEd1YXJkU2VydmljZSB9IGZyb20gJy4vc2hhcmVkL3NlcnZpY2VzL2F1dGgtZ3VhcmQuc2VydmljZSc7XHJcbmltcG9ydCB7IEh0dHBEZWxlZ2F0ZVNlcnZpY2UgfSBmcm9tICcuL3NoYXJlZC9zZXJ2aWNlcy9odHRwLWRlbGVnYXRlLnNlcnZpY2UnO1xyXG5cclxuLy9BcHBsaWNhdGlvbiBJTVBPUlRTXHJcblxyXG5pbXBvcnQgeyBQcm9qZWN0U2VydmljZSB9IGZyb20gJy4vYnVpbGQtaW5mby9mcmFtZXdvcmsvcHJvamVjdC9wcm9qZWN0LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBQcm9qZWN0Q29tcG9uZW50IH0gZnJvbSAnLi9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L3Byb2plY3QuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQ3JlYXRlUHJvamVjdENvbXBvbmVudCB9IGZyb20gJy4vYnVpbGQtaW5mby9mcmFtZXdvcmsvY3JlYXRlLXByb2plY3QvY3JlYXRlLXByb2plY3QuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQnVpbGRpbmdDb21wb25lbnQgfSBmcm9tICcuL2J1aWxkLWluZm8vZnJhbWV3b3JrL3Byb2plY3QvYnVpbGRpbmcvYnVpbGRpbmcuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQ3JlYXRlQnVpbGRpbmdDb21wb25lbnQgfSBmcm9tICcuL2J1aWxkLWluZm8vZnJhbWV3b3JrL3Byb2plY3QvYnVpbGRpbmcvY3JlYXRlLWJ1aWxkaW5nL2NyZWF0ZS1idWlsZGluZy5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBCdWlsZGluZ1NlcnZpY2UgfSBmcm9tICcuL2J1aWxkLWluZm8vZnJhbWV3b3JrL3Byb2plY3QvYnVpbGRpbmcvYnVpbGRpbmcuc2VydmljZSc7XHJcbmltcG9ydCB7IFByb2plY3RMaXN0Q29tcG9uZW50IH0gZnJvbSAnLi9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0LWxpc3QvcHJvamVjdC1saXN0LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFByb2plY3REZXRhaWxzQ29tcG9uZW50IH0gZnJvbSAnLi9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L3Byb2plY3QtZGV0YWlscy9wcm9qZWN0LWRldGFpbHMuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQnVpbGRpbmdMaXN0Q29tcG9uZW50IH0gZnJvbSAnLi9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L2J1aWxkaW5nL2J1aWxkaW5ncy1saXN0L2J1aWxkaW5nLWxpc3QuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQnVpbGRpbmdEZXRhaWxzQ29tcG9uZW50IH0gZnJvbSAnLi9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L2J1aWxkaW5nL2J1aWxkaW5nLWRldGFpbHMvYnVpbGRpbmctZGV0YWlscy5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBQcm9qZWN0SGVhZGVyQ29tcG9uZW50IH0gZnJvbSAnLi9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0LWhlYWRlci9wcm9qZWN0LWhlYWRlci5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBDb3N0U3VtbWFyeUNvbXBvbmVudCB9IGZyb20gJy4vYnVpbGQtaW5mby9mcmFtZXdvcmsvcHJvamVjdC9jb3N0LXN1bW1hcnktcmVwb3J0L2Nvc3Qtc3VtbWFyeS5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBDb3N0U3VtbWFyeVNlcnZpY2UgfSBmcm9tICcuL2J1aWxkLWluZm8vZnJhbWV3b3JrL3Byb2plY3QvY29zdC1zdW1tYXJ5LXJlcG9ydC9jb3N0LXN1bW1hcnkuc2VydmljZSc7XHJcbmltcG9ydCB7IE1hdGVyaWFsVGFrZW9mZkNvbXBvbmVudCB9IGZyb20gJy4vYnVpbGQtaW5mby9mcmFtZXdvcmsvcHJvamVjdC9tYXRlcmlhbC10YWtlb2ZmL21hdGVyaWFsLXRha2VvZmYuY29tcG9uZW50JztcclxuaW1wb3J0IHsgTWF0ZXJpYWxUYWtlT2ZmU2VydmljZSB9IGZyb20gJy4vYnVpbGQtaW5mby9mcmFtZXdvcmsvcHJvamVjdC9tYXRlcmlhbC10YWtlb2ZmL21hdGVyaWFsLXRha2VvZmYuc2VydmljZSc7XHJcbmltcG9ydCB7IE1hdGVyaWFsVGFrZU9mZlJlcG9ydENvbXBvbmVudCB9IGZyb20gJy4vYnVpbGQtaW5mby9mcmFtZXdvcmsvcHJvamVjdC9tYXRlcmlhbC10YWtlb2ZmL21hdGVyaWFsLXRha2Utb2ZmLXJlcG9ydC9tYXRlcmlhbC10YWtlLW9mZi1yZXBvcnQuY29tcG9uZW50JztcclxuaW1wb3J0IHsgVGFibGVSb3dDb21wb25lbnQgfSBmcm9tICcuL2J1aWxkLWluZm8vZnJhbWV3b3JrL3Byb2plY3QvbWF0ZXJpYWwtdGFrZW9mZi9tYXRlcmlhbC10YWtlLW9mZi1yZXBvcnQvcm93L3Jvdy5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBDb3N0SGVhZENvbXBvbmVudCB9IGZyb20gJy4vYnVpbGQtaW5mby9mcmFtZXdvcmsvcHJvamVjdC9jb3N0LXN1bW1hcnktcmVwb3J0L2Nvc3QtaGVhZC9jb3N0LWhlYWQuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQ29zdFN1bW1hcnlQaXBlIH0gZnJvbSAnLi9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L2Nvc3Qtc3VtbWFyeS1yZXBvcnQvY29zdC1zdW1tYXJ5LnBpcGUnO1xyXG5pbXBvcnQgeyBHZXRRdWFudGl0eUNvbXBvbmVudCB9IGZyb20gJy4vYnVpbGQtaW5mby9mcmFtZXdvcmsvcHJvamVjdC9jb3N0LXN1bW1hcnktcmVwb3J0L2Nvc3QtaGVhZC9nZXQtcXVhbnRpdHkvZ2V0LXF1YW50aXR5LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFByb2plY3RMaXN0SGVhZGVyQ29tcG9uZW50IH0gZnJvbSAnLi9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0LWhlYWRlci9wcm9qZWN0LWxpc3QtaGVhZGVyL3Byb2plY3QtbGlzdC1oZWFkZXIuY29tcG9uZW50JztcclxuaW1wb3J0IHsgR3JvdXBCeVBpcGUgfSBmcm9tICcuLi9hcHAvc2hhcmVkL3NlcnZpY2VzL2N1c3RvbS1waXBlcy9ncm91cGJ5LnBpcGUnO1xyXG5pbXBvcnQgeyBCcm93c2VyQW5pbWF0aW9uc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucyc7XHJcbmltcG9ydCB7IEdldFJhdGVDb21wb25lbnQgfSBmcm9tICcuL2J1aWxkLWluZm8vZnJhbWV3b3JrL3Byb2plY3QvY29zdC1zdW1tYXJ5LXJlcG9ydC9jb3N0LWhlYWQvZ2V0LXJhdGUvZ2V0LXJhdGUuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQ3JlYXRlTmV3UHJvamVjdENvbXBvbmVudCB9IGZyb20gJy4vYnVpbGQtaW5mby9mcmFtZXdvcmsvY3JlYXRlLW5ldy1wcm9qZWN0L2NyZWF0ZS1uZXctcHJvamVjdC5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBQcm9qZWN0SXRlbUNvbXBvbmVudCB9IGZyb20gJy4vYnVpbGQtaW5mby9mcmFtZXdvcmsvcHJvamVjdC1saXN0L3Byb2plY3QtaXRlbS9wcm9qZWN0LWl0ZW0uY29tcG9uZW50JztcclxuaW1wb3J0IHsgRGVsZXRlQ29uZmlybWF0aW9uTW9kYWxDb21wb25lbnQgfSBmcm9tICcuL3NoYXJlZC9kZWxldGUtY29uZmlybWF0aW9uLW1vZGFsL2RlbGV0ZS1jb25maXJtYXRpb24tbW9kYWwuY29tcG9uZW50JztcclxuaW1wb3J0IHsgUHJvamVjdEZvcm1Db21wb25lbnQgfSBmcm9tICcuL2J1aWxkLWluZm8vZnJhbWV3b3JrL3NoYXJlZC9wcm9qZWN0LWZvcm0vcHJvamVjdC1mb3JtLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IEJ1aWxkaW5nRm9ybUNvbXBvbmVudCB9IGZyb20gJy4vYnVpbGQtaW5mby9mcmFtZXdvcmsvc2hhcmVkL2J1aWxkaW5nLWZvcm0vYnVpbGRpbmctZm9ybS5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBTaGFyZVByaW50UGFnZUNvbXBvbmVudCB9IGZyb20gJy4vYnVpbGQtaW5mby9mcmFtZXdvcmsvcHJvamVjdC1oZWFkZXIvc2hhcmUtcHJpbnQtcGFnZS9zaGFyZS1wcmludC1wYWdlLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFF1YW50aXR5RGV0YWlsc0NvbXBvbmVudCB9XHJcbmZyb20gJy4vYnVpbGQtaW5mby9mcmFtZXdvcmsvcHJvamVjdC9jb3N0LXN1bW1hcnktcmVwb3J0L2Nvc3QtaGVhZC9xdWFudGl0eS1kZXRhaWxzL3F1YW50aXR5LWRldGFpbHMuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQ29zdEhlYWRSZXBvcnRDb21wb25lbnQgfSBmcm9tICcuL2J1aWxkLWluZm8vZnJhbWV3b3JrL3Byb2plY3QvcmVwb3J0LXRlbXBsYXRlcy9jb3N0LWhlYWQtcmVwb3J0L2Nvc3QtaGVhZC1yZXBvcnQuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQ29zdFN1bW1hcnlSZXBvcnRDb21wb25lbnQgfSBmcm9tICcuL2J1aWxkLWluZm8vZnJhbWV3b3JrL3Byb2plY3QvcmVwb3J0LXRlbXBsYXRlcy9jb3N0LXN1bW1hcnktcmVwb3J0L2Nvc3Qtc3VtbWFyeS1yZXBvcnQuY29tcG9uZW50J1xyXG5cclxuQE5nTW9kdWxlKHtcclxuICBpbXBvcnRzOiBbXHJcbiAgICBCcm93c2VyTW9kdWxlLFxyXG4gICAgRm9ybXNNb2R1bGUsXHJcbiAgICBSb3V0ZXJNb2R1bGUuZm9yUm9vdChyb3V0ZXMpLFxyXG4gICAgSHR0cE1vZHVsZSxcclxuICAgIFJlYWN0aXZlRm9ybXNNb2R1bGUsXHJcbiAgICBTaGFyZWRNb2R1bGUsXHJcbiAgICBVc2VyTW9kdWxlLFxyXG4gICAgQnJvd3NlckFuaW1hdGlvbnNNb2R1bGVcclxuICBdLFxyXG4gIGRlY2xhcmF0aW9uczogW1xyXG4gICAgQXBwQ29tcG9uZW50LFxyXG4gICAgTGFuZGluZ1BhZ2VDb21wb25lbnQsXHJcbiAgICBBY3RpdmF0ZVVzZXJDb21wb25lbnQsXHJcbiAgICBEYXNoYm9hcmRDb21wb25lbnQsXHJcbiAgICBBYm91dENvbXBvbmVudCxcclxuICAgIENvbnRhY3RDb21wb25lbnQsXHJcbiAgICBEYXNoYm9hcmRIb21lQ29tcG9uZW50LFxyXG4gICAgSGVhZGVyQ29tcG9uZW50LFxyXG4gICAgTm90aWZpY2F0aW9uQ29tcG9uZW50LFxyXG4gICAgU29jaWFsSWNvbkNvbXBvbmVudCxcclxuXHJcbiAgICAvL0FwcGxpY2F0aW9uIENPTVBPTkVOVFxyXG4gICAgRGFzaGJvYXJkSGVhZGVyQ29tcG9uZW50LFxyXG4gICAgUHJvamVjdENvbXBvbmVudCxcclxuICAgIEJ1aWxkaW5nQ29tcG9uZW50LFxyXG4gICAgQ3JlYXRlTmV3UHJvamVjdENvbXBvbmVudCxcclxuICAgIENyZWF0ZVByb2plY3RDb21wb25lbnQsXHJcbiAgICBQcm9qZWN0TGlzdENvbXBvbmVudCxcclxuICAgIENyZWF0ZUJ1aWxkaW5nQ29tcG9uZW50LFxyXG4gICAgUHJvamVjdERldGFpbHNDb21wb25lbnQsXHJcbiAgICBCdWlsZGluZ0xpc3RDb21wb25lbnQsXHJcbiAgICBQcm9qZWN0SGVhZGVyQ29tcG9uZW50LFxyXG4gICAgUHJvamVjdExpc3RIZWFkZXJDb21wb25lbnQsXHJcbiAgICBTaGFyZVByaW50UGFnZUNvbXBvbmVudCxcclxuICAgIEJ1aWxkaW5nRGV0YWlsc0NvbXBvbmVudCxcclxuICAgIENvc3RTdW1tYXJ5Q29tcG9uZW50LFxyXG4gICAgQ29zdEhlYWRDb21wb25lbnQsXHJcbiAgICBDb3N0U3VtbWFyeVBpcGUsXHJcbiAgICBHZXRRdWFudGl0eUNvbXBvbmVudCxcclxuICAgIE1hdGVyaWFsVGFrZW9mZkNvbXBvbmVudCxcclxuICAgIE1hdGVyaWFsVGFrZU9mZlJlcG9ydENvbXBvbmVudCxcclxuICAgIFRhYmxlUm93Q29tcG9uZW50LFxyXG4gICAgR2V0UmF0ZUNvbXBvbmVudCxcclxuICAgIFByb2plY3RJdGVtQ29tcG9uZW50LFxyXG4gICAgUXVhbnRpdHlEZXRhaWxzQ29tcG9uZW50LFxyXG4gICAgLy9NeURhc2hib2FyZENvbXBvbmVudCxcclxuXHJcbiAgICAvL1NoYXJlZCBDb21wb25lbnRzXHJcbiAgICBHcm91cEJ5UGlwZSxcclxuICAgIERlbGV0ZUNvbmZpcm1hdGlvbk1vZGFsQ29tcG9uZW50LFxyXG4gICAgUHJvamVjdEZvcm1Db21wb25lbnQsXHJcbiAgICBCdWlsZGluZ0Zvcm1Db21wb25lbnQsXHJcblxyXG4gICAgLy9yZXBvcnQgcGRmXHJcbiAgICBDb3N0SGVhZFJlcG9ydENvbXBvbmVudCxcclxuXHJcbiAgICBQYWdlTm90Rm91bmRDb21wb25lbnQsXHJcbiAgICBDb21tb25BbWVuaXRpZXNDb21wb25lbnQsXHJcbiAgICBDb3N0U3VtbWFyeVJlcG9ydENvbXBvbmVudFxyXG4gIF0sXHJcblxyXG4gIHByb3ZpZGVyczogW1xyXG4gICAge1xyXG4gICAgICBwcm92aWRlOiBIdHRwLFxyXG4gICAgICB1c2VGYWN0b3J5OiBodHRwRmFjdG9yeSxcclxuICAgICAgZGVwczogW1hIUkJhY2tlbmQsIFJlcXVlc3RPcHRpb25zLCBNZXNzYWdlU2VydmljZSwgTG9hZGVyU2VydmljZV1cclxuICAgIH0sXHJcbiAgICB7cHJvdmlkZTogUmVxdWVzdE9wdGlvbnMsIHVzZUNsYXNzOiBBcHBSZXF1ZXN0T3B0aW9uc30sXHJcbiAgICBMb2dnZXJTZXJ2aWNlLCB7cHJvdmlkZTogRXJyb3JIYW5kbGVyLCB1c2VDbGFzczogTXlFcnJvckhhbmRsZXJ9LFxyXG4gICAge1xyXG4gICAgICBwcm92aWRlOiBBUFBfQkFTRV9IUkVGLFxyXG4gICAgICB1c2VWYWx1ZTogJzwlPSBBUFBfQkFTRSAlPidcclxuICAgIH0sXHJcbiAgICBOb3RpZmljYXRpb25TZXJ2aWNlLFxyXG4gICAgRGFzaGJvYXJkU2VydmljZSxcclxuICAgIERhc2hib2FyZFVzZXJQcm9maWxlU2VydmljZSxcclxuICAgIFVzZXJDaGFuZ2VQYXNzd29yZFNlcnZpY2UsXHJcbiAgICBQcm9maWxlU2VydmljZSxcclxuICAgIENvbnRhY3RTZXJ2aWNlLFxyXG4gICAgQWN0aXZlVXNlclNlcnZpY2UsXHJcbiAgICBQcm9maWxlRGV0YWlsc1NlcnZpY2UsXHJcbiAgICBSZWRpcmVjdFJlY3J1aXRlckRhc2hib2FyZFNlcnZpY2UsXHJcbiAgICBTaGFyZWRTZXJ2aWNlLFxyXG4gICAgVGl0bGUsXHJcbiAgICBBbmFseXRpY1NlcnZpY2UsXHJcbiAgICBBdXRoR3VhcmRTZXJ2aWNlLFxyXG4gICAgSHR0cERlbGVnYXRlU2VydmljZSxcclxuXHJcbiAgICAvL0FwcGxpY2F0aW9uIFNlcnZpY2VzXHJcbiAgICBQcm9qZWN0U2VydmljZSxcclxuICAgIEJ1aWxkaW5nU2VydmljZSxcclxuICAgIENvc3RTdW1tYXJ5U2VydmljZSxcclxuICAgIE1hdGVyaWFsVGFrZU9mZlNlcnZpY2VcclxuICBdLFxyXG4gIGJvb3RzdHJhcDogW0FwcENvbXBvbmVudF1cclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBBcHBNb2R1bGUge1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaHR0cEZhY3RvcnkoYmFja2VuZDogWEhSQmFja2VuZCwgZGVmYXVsdE9wdGlvbnM6IFJlcXVlc3RPcHRpb25zLCBtZXNzYWdlU2VydmljZTogTWVzc2FnZVNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2FkZXJTZXJ2aWNlOiBMb2FkZXJTZXJ2aWNlKSB7XHJcbiAgcmV0dXJuICBuZXcgQ3VzdG9tSHR0cChiYWNrZW5kLCBkZWZhdWx0T3B0aW9ucywgbWVzc2FnZVNlcnZpY2UsIGxvYWRlclNlcnZpY2UpO1xyXG59XHJcblxyXG4iXX0=
