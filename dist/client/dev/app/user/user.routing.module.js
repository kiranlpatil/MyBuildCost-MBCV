"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var candidate_sign_up_verification_routes_1 = require("./../framework/registration/candidate-sign-up-verification/candidate-sign-up-verification.routes");
var candidate_sign_up_routes_1 = require("./../framework/registration/candidate-sign-up/candidate-sign-up.routes");
var verify_user_routes_1 = require("./user-verification/verify-user.routes");
var login_routes_1 = require("./../framework/login/login.routes");
var reset_password_routes_1 = require("../framework/login/forgot-password/reset-password/reset-password.routes");
var forgot_password_routes_1 = require("../framework/login/forgot-password/forgot-password.routes");
var activate_email_routes_1 = require("./settings/activate-email/activate-email.routes");
var change_email_routes_1 = require("./settings/change-email/change-email.routes");
var change_mobile_routes_1 = require("./settings/change-mobile/change-mobile.routes");
var UserRoutingModule = (function () {
    function UserRoutingModule() {
    }
    UserRoutingModule = __decorate([
        core_1.NgModule({
            imports: [
                router_1.RouterModule.forChild(login_routes_1.LoginRoutes.concat(candidate_sign_up_routes_1.CandidateSignUpRoutes, candidate_sign_up_verification_routes_1.CandidateSignUpVerificationRoutes, forgot_password_routes_1.ForgotPasswordRoutes, reset_password_routes_1.ResetPasswordRoutes, verify_user_routes_1.UserVerificationRoutes, activate_email_routes_1.ActivateEmailRoutes, change_email_routes_1.ChangeEmailRoutes, change_mobile_routes_1.ChangeMobileRoutes))
            ],
            exports: [
                router_1.RouterModule
            ]
        })
    ], UserRoutingModule);
    return UserRoutingModule;
}());
exports.UserRoutingModule = UserRoutingModule;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC91c2VyL3VzZXIucm91dGluZy5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxzQ0FBdUM7QUFDdkMsMENBQTZDO0FBQzdDLDBKQUFtSjtBQUNuSixtSEFBNkc7QUFDN0csNkVBQThFO0FBQzlFLGtFQUE4RDtBQUM5RCxpSEFBNEc7QUFDNUcsb0dBQStGO0FBQy9GLHlGQUFvRjtBQUNwRixtRkFBOEU7QUFDOUUsc0ZBQWlGO0FBb0JqRjtJQUFBO0lBQ0EsQ0FBQztJQURZLGlCQUFpQjtRQWxCN0IsZUFBUSxDQUFDO1lBQ1IsT0FBTyxFQUFFO2dCQUNQLHFCQUFZLENBQUMsUUFBUSxDQUNoQiwwQkFBVyxRQUNYLGdEQUFxQixFQUNyQix5RUFBaUMsRUFDakMsNkNBQW9CLEVBQ3BCLDJDQUFtQixFQUNuQiwyQ0FBc0IsRUFDdEIsMkNBQW1CLEVBQ25CLHVDQUFpQixFQUNqQix5Q0FBa0IsRUFDckI7YUFDSDtZQUNELE9BQU8sRUFBRTtnQkFDUCxxQkFBWTthQUNiO1NBQ0YsQ0FBQztPQUNXLGlCQUFpQixDQUM3QjtJQUFELHdCQUFDO0NBREQsQUFDQyxJQUFBO0FBRFksOENBQWlCIiwiZmlsZSI6ImFwcC91c2VyL3VzZXIucm91dGluZy5tb2R1bGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge05nTW9kdWxlfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xyXG5pbXBvcnQge1JvdXRlck1vZHVsZX0gZnJvbSBcIkBhbmd1bGFyL3JvdXRlclwiO1xyXG5pbXBvcnQge0NhbmRpZGF0ZVNpZ25VcFZlcmlmaWNhdGlvblJvdXRlc30gZnJvbSBcIi4vLi4vZnJhbWV3b3JrL3JlZ2lzdHJhdGlvbi9jYW5kaWRhdGUtc2lnbi11cC12ZXJpZmljYXRpb24vY2FuZGlkYXRlLXNpZ24tdXAtdmVyaWZpY2F0aW9uLnJvdXRlc1wiO1xyXG5pbXBvcnQge0NhbmRpZGF0ZVNpZ25VcFJvdXRlc30gZnJvbSBcIi4vLi4vZnJhbWV3b3JrL3JlZ2lzdHJhdGlvbi9jYW5kaWRhdGUtc2lnbi11cC9jYW5kaWRhdGUtc2lnbi11cC5yb3V0ZXNcIjtcclxuaW1wb3J0IHtVc2VyVmVyaWZpY2F0aW9uUm91dGVzfSBmcm9tIFwiLi91c2VyLXZlcmlmaWNhdGlvbi92ZXJpZnktdXNlci5yb3V0ZXNcIjtcclxuaW1wb3J0IHtMb2dpblJvdXRlc30gZnJvbSBcIi4vLi4vZnJhbWV3b3JrL2xvZ2luL2xvZ2luLnJvdXRlc1wiO1xyXG5pbXBvcnQge1Jlc2V0UGFzc3dvcmRSb3V0ZXN9IGZyb20gXCIuLi9mcmFtZXdvcmsvbG9naW4vZm9yZ290LXBhc3N3b3JkL3Jlc2V0LXBhc3N3b3JkL3Jlc2V0LXBhc3N3b3JkLnJvdXRlc1wiO1xyXG5pbXBvcnQge0ZvcmdvdFBhc3N3b3JkUm91dGVzfSBmcm9tIFwiLi4vZnJhbWV3b3JrL2xvZ2luL2ZvcmdvdC1wYXNzd29yZC9mb3Jnb3QtcGFzc3dvcmQucm91dGVzXCI7XHJcbmltcG9ydCB7QWN0aXZhdGVFbWFpbFJvdXRlc30gZnJvbSBcIi4vc2V0dGluZ3MvYWN0aXZhdGUtZW1haWwvYWN0aXZhdGUtZW1haWwucm91dGVzXCI7XHJcbmltcG9ydCB7Q2hhbmdlRW1haWxSb3V0ZXN9IGZyb20gXCIuL3NldHRpbmdzL2NoYW5nZS1lbWFpbC9jaGFuZ2UtZW1haWwucm91dGVzXCI7XHJcbmltcG9ydCB7Q2hhbmdlTW9iaWxlUm91dGVzfSBmcm9tIFwiLi9zZXR0aW5ncy9jaGFuZ2UtbW9iaWxlL2NoYW5nZS1tb2JpbGUucm91dGVzXCI7XHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gIGltcG9ydHM6IFtcclxuICAgIFJvdXRlck1vZHVsZS5mb3JDaGlsZChbXHJcbiAgICAgIC4uLkxvZ2luUm91dGVzLFxyXG4gICAgICAuLi5DYW5kaWRhdGVTaWduVXBSb3V0ZXMsXHJcbiAgICAgIC4uLkNhbmRpZGF0ZVNpZ25VcFZlcmlmaWNhdGlvblJvdXRlcyxcclxuICAgICAgLi4uRm9yZ290UGFzc3dvcmRSb3V0ZXMsXHJcbiAgICAgIC4uLlJlc2V0UGFzc3dvcmRSb3V0ZXMsXHJcbiAgICAgIC4uLlVzZXJWZXJpZmljYXRpb25Sb3V0ZXMsXHJcbiAgICAgIC4uLkFjdGl2YXRlRW1haWxSb3V0ZXMsXHJcbiAgICAgIC4uLkNoYW5nZUVtYWlsUm91dGVzLFxyXG4gICAgICAuLi5DaGFuZ2VNb2JpbGVSb3V0ZXNcclxuICAgIF0pXHJcbiAgXSxcclxuICBleHBvcnRzOiBbXHJcbiAgICBSb3V0ZXJNb2R1bGVcclxuICBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBVc2VyUm91dGluZ01vZHVsZSB7XHJcbn1cclxuIl19
