"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dashboard_component_1 = require("./dashboard.component");
var index_1 = require("./dashboard-home/index");
var index_2 = require("./about/index");
var contact_component_1 = require("./contact/contact.component");
var dashboard_user_profile_component_1 = require("../../framework/dashboard/user-profile/dashboard-user-profile.component");
var user_change_password_component_1 = require("../../framework/dashboard/user-change-password/user-change-password.component");
var auth_guard_service_1 = require("../../shared/services/auth-guard.service");
exports.DashboardRoutes = [
    {
        path: 'dashboard',
        component: dashboard_component_1.DashboardComponent,
        canActivate: [auth_guard_service_1.AuthGuardService],
        children: [
            { path: '', component: index_1.DashboardHomeComponent },
            { path: 'details', component: dashboard_user_profile_component_1.DashboardProfileComponent },
            { path: 'change-password', component: user_change_password_component_1.UserChangePasswordComponent },
            { path: 'about', component: index_2.AboutComponent },
            { path: 'contact', component: contact_component_1.ContactComponent }
        ]
    }
];

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGFzaGJvYXJkL2Rhc2hib2FyZC5yb3V0ZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSw2REFBeUQ7QUFDekQsZ0RBQThEO0FBQzlELHVDQUE2QztBQUM3QyxpRUFBNkQ7QUFDN0QsNEhBQWtIO0FBQ2xILGdJQUEwSDtBQUMxSCwrRUFBMEU7QUFFN0QsUUFBQSxlQUFlLEdBQVk7SUFDdEM7UUFDRSxJQUFJLEVBQUUsV0FBVztRQUNqQixTQUFTLEVBQUUsd0NBQWtCO1FBQzdCLFdBQVcsRUFBRSxDQUFDLHFDQUFnQixDQUFDO1FBQy9CLFFBQVEsRUFBRTtZQUNSLEVBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsOEJBQXNCLEVBQUM7WUFDN0MsRUFBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSw0REFBeUIsRUFBQztZQUN2RCxFQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRSxTQUFTLEVBQUUsNERBQTJCLEVBQUM7WUFDakUsRUFBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxzQkFBYyxFQUFDO1lBQzFDLEVBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsb0NBQWdCLEVBQUM7U0FDL0M7S0FDRjtDQUNGLENBQUMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9kYXNoYm9hcmQvZGFzaGJvYXJkLnJvdXRlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Um91dGV9IGZyb20gXCJAYW5ndWxhci9yb3V0ZXJcIjtcclxuaW1wb3J0IHtEYXNoYm9hcmRDb21wb25lbnR9IGZyb20gXCIuL2Rhc2hib2FyZC5jb21wb25lbnRcIjtcclxuaW1wb3J0IHtEYXNoYm9hcmRIb21lQ29tcG9uZW50fSBmcm9tIFwiLi9kYXNoYm9hcmQtaG9tZS9pbmRleFwiO1xyXG5pbXBvcnQge0Fib3V0Q29tcG9uZW50fSBmcm9tIFwiLi9hYm91dC9pbmRleFwiO1xyXG5pbXBvcnQge0NvbnRhY3RDb21wb25lbnR9IGZyb20gXCIuL2NvbnRhY3QvY29udGFjdC5jb21wb25lbnRcIjtcclxuaW1wb3J0IHtEYXNoYm9hcmRQcm9maWxlQ29tcG9uZW50fSBmcm9tIFwiLi4vLi4vZnJhbWV3b3JrL2Rhc2hib2FyZC91c2VyLXByb2ZpbGUvZGFzaGJvYXJkLXVzZXItcHJvZmlsZS5jb21wb25lbnRcIjtcclxuaW1wb3J0IHtVc2VyQ2hhbmdlUGFzc3dvcmRDb21wb25lbnR9IGZyb20gXCIuLi8uLi9mcmFtZXdvcmsvZGFzaGJvYXJkL3VzZXItY2hhbmdlLXBhc3N3b3JkL3VzZXItY2hhbmdlLXBhc3N3b3JkLmNvbXBvbmVudFwiO1xyXG5pbXBvcnQge0F1dGhHdWFyZFNlcnZpY2V9IGZyb20gXCIuLi8uLi9zaGFyZWQvc2VydmljZXMvYXV0aC1ndWFyZC5zZXJ2aWNlXCI7XHJcblxyXG5leHBvcnQgY29uc3QgRGFzaGJvYXJkUm91dGVzOiBSb3V0ZVtdID0gW1xyXG4gIHtcclxuICAgIHBhdGg6ICdkYXNoYm9hcmQnLFxyXG4gICAgY29tcG9uZW50OiBEYXNoYm9hcmRDb21wb25lbnQsXHJcbiAgICBjYW5BY3RpdmF0ZTogW0F1dGhHdWFyZFNlcnZpY2VdLFxyXG4gICAgY2hpbGRyZW46IFtcclxuICAgICAge3BhdGg6ICcnLCBjb21wb25lbnQ6IERhc2hib2FyZEhvbWVDb21wb25lbnR9LFxyXG4gICAgICB7cGF0aDogJ2RldGFpbHMnLCBjb21wb25lbnQ6IERhc2hib2FyZFByb2ZpbGVDb21wb25lbnR9LFxyXG4gICAgICB7cGF0aDogJ2NoYW5nZS1wYXNzd29yZCcsIGNvbXBvbmVudDogVXNlckNoYW5nZVBhc3N3b3JkQ29tcG9uZW50fSxcclxuICAgICAge3BhdGg6ICdhYm91dCcsIGNvbXBvbmVudDogQWJvdXRDb21wb25lbnR9LFxyXG4gICAgICB7cGF0aDogJ2NvbnRhY3QnLCBjb21wb25lbnQ6IENvbnRhY3RDb21wb25lbnR9XHJcbiAgICBdXHJcbiAgfVxyXG5dO1xyXG5cclxuXHJcblxyXG4iXX0=
