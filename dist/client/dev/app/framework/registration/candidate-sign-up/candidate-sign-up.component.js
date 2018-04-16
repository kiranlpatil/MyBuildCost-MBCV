"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var candidate_sign_up_service_1 = require("./candidate-sign-up.service");
var candidate_details_1 = require("./../../../user/models/candidate-details");
var forms_1 = require("@angular/forms");
var validation_service_1 = require("../../../shared/customvalidations/validation.service");
var index_1 = require("../../../shared/index");
var constants_1 = require("../../../shared/constants");
var session_service_1 = require("../../../shared/services/session.service");
var shared_service_1 = require("../../../shared/services/shared-service");
var error_service_1 = require("../../../shared/services/error.service");
var analytic_service_1 = require("../../../shared/services/analytic.service");
var login_1 = require("../../../user/models/login");
var login_service_1 = require("../../../framework/login/login.service");
var registration_service_1 = require("../../../user/services/registration.service");
var CandidateSignUpComponent = (function () {
    function CandidateSignUpComponent(analyticService, commonService, _router, candidateService, messageService, formBuilder, sharedService, errorService, activatedRoute, loginService, registrationService) {
        this.analyticService = analyticService;
        this.commonService = commonService;
        this._router = _router;
        this.candidateService = candidateService;
        this.messageService = messageService;
        this.formBuilder = formBuilder;
        this.sharedService = sharedService;
        this.errorService = errorService;
        this.activatedRoute = activatedRoute;
        this.loginService = loginService;
        this.registrationService = registrationService;
        this.yearMatchNotFoundMessage = constants_1.Messages.MSG_YEAR_NO_MATCH_FOUND;
        this.model = new candidate_details_1.CandidateDetail();
        this.isShowErrorMessage = true;
        this.validBirthYearList = new Array(0);
        this.isToasterVisible = true;
        this.isGuideMessageVisible = false;
        this.isFromCareerPlugin = false;
        this.isFormSubmitted = false;
        this.userForm = this.formBuilder.group({
            'first_name': ['', [validation_service_1.ValidationService.requireFirstNameValidator]],
            'email': ['', [validation_service_1.ValidationService.requireEmailValidator, validation_service_1.ValidationService.emailValidator]],
            'password': ['', [validation_service_1.ValidationService.passwordValidator]],
        });
        this.loginModel = new login_1.Login();
        this.BODY_BACKGROUND = constants_1.ImagePath.BODY_BACKGROUND;
        this.MY_LOGO = constants_1.ImagePath.MY_WHITE_LOGO;
    }
    CandidateSignUpComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.mainHeaderMenuHideShow = 'applicant';
        this.activatedRoute.queryParams.subscribe(function (params) {
            if (params['phoneNumber']) {
                _this.userForm.controls['mobile_number']
                    .setValue(Number(params['phoneNumber']));
            }
        });
    };
    CandidateSignUpComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.activatedRoute.params.subscribe(function (params) {
            _this.isGuideMessageVisible = params['id'] === 'new_user' ? true : false;
        });
    };
    CandidateSignUpComponent.prototype.onSubmit = function () {
        var _this = this;
        this.model = this.userForm.value;
        if (this.model.first_name === '' || this.model.email === '' || this.model.password === '') {
            this.submitStatus = true;
            return;
        }
        if (!this.userForm.valid) {
            return;
        }
        this.model = this.userForm.value;
        this.model.first_name = this.model.first_name.trim();
        this.model.current_theme = index_1.AppSettings.LIGHT_THEM;
        this.model.isCandidate = true;
        this.model.isActivated = true;
        this.model.email = this.model.email.toLowerCase();
        this.isFormSubmitted = true;
        this.candidateService.addCandidate(this.model)
            .subscribe(function (candidate) { return _this.onRegistrationSuccess(candidate); }, function (error) { return _this.onRegistrationFalure(error); });
    };
    CandidateSignUpComponent.prototype.onRegistrationSuccess = function (candidate) {
        session_service_1.SessionStorageService.setSessionValue(constants_1.SessionStorage.USER_ID, candidate.data._id);
        session_service_1.SessionStorageService.setSessionValue(constants_1.SessionStorage.EMAIL_ID, this.userForm.value.email);
        session_service_1.SessionStorageService.setSessionValue(constants_1.SessionStorage.PASSWORD, this.model.password);
        session_service_1.SessionStorageService.setSessionValue(constants_1.SessionStorage.CHANGE_MAIL_VALUE, 'from_registration');
        this.navigateToDashboard();
    };
    CandidateSignUpComponent.prototype.navigateToDashboard = function () {
        var _this = this;
        this.loginModel.email = session_service_1.SessionStorageService.getSessionValue(constants_1.SessionStorage.EMAIL_ID);
        this.loginModel.password = session_service_1.SessionStorageService.getSessionValue(constants_1.SessionStorage.PASSWORD);
        this.loginService.userLogin(this.loginModel)
            .subscribe(function (res) { return (_this.registrationService.onGetUserDataSuccess(res)); }, function (error) { return (_this.registrationService.onLoginFailure(error)); });
    };
    CandidateSignUpComponent.prototype.onRegistrationFalure = function (error) {
        if (error.err_code === 404 || error.err_code === 0) {
            var message = new index_1.Message();
            message.error_msg = error.err_msg;
            message.isError = true;
            this.messageService.message(message);
        }
        else {
            this.isShowErrorMessage = false;
            this.error_msg = error.err_msg;
        }
    };
    CandidateSignUpComponent.prototype.goToSignIn = function () {
        this._router.navigate([index_1.NavigationRoutes.APP_LOGIN]);
    };
    CandidateSignUpComponent.prototype.getMessages = function () {
        return constants_1.Messages;
    };
    CandidateSignUpComponent.prototype.getLabel = function () {
        return constants_1.Label;
    };
    CandidateSignUpComponent.prototype.gtag_report_conversion = function (sendTo) {
        gtag('event', 'conversion', {
            'send_to': sendTo
        });
        return false;
    };
    __decorate([
        core_1.ViewChild('toaster'),
        __metadata("design:type", core_1.ElementRef)
    ], CandidateSignUpComponent.prototype, "toaster", void 0);
    CandidateSignUpComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'cn-candidate-registration',
            templateUrl: 'candidate-sign-up.component.html',
            styleUrls: ['candidate-sign-up.component.css'],
        }),
        __metadata("design:paramtypes", [analytic_service_1.AnalyticService, index_1.CommonService, router_1.Router,
            candidate_sign_up_service_1.CandidateSignUpService, index_1.MessageService,
            forms_1.FormBuilder, shared_service_1.SharedService, error_service_1.ErrorService,
            router_1.ActivatedRoute,
            login_service_1.LoginService, registration_service_1.RegistrationService])
    ], CandidateSignUpComponent);
    return CandidateSignUpComponent;
}());
exports.CandidateSignUpComponent = CandidateSignUpComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvcmVnaXN0cmF0aW9uL2NhbmRpZGF0ZS1zaWduLXVwL2NhbmRpZGF0ZS1zaWduLXVwLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHNDQUF3RjtBQUN4RiwwQ0FBaUU7QUFDakUseUVBQXFFO0FBQ3JFLDhFQUEyRTtBQUMzRSx3Q0FBb0U7QUFDcEUsMkZBQXlGO0FBQ3pGLCtDQUE4RztBQUM5Ryx1REFBMEY7QUFDMUYsNEVBQWlGO0FBQ2pGLDBFQUF3RTtBQUN4RSx3RUFBc0U7QUFDdEUsOEVBQTRFO0FBQzVFLG9EQUFtRDtBQUNuRCx3RUFBc0U7QUFDdEUsb0ZBQWtGO0FBWWxGO0lBdUJDLGtDQUFvQixlQUFnQyxFQUFVLGFBQTRCLEVBQVUsT0FBZSxFQUM5RixnQkFBd0MsRUFBVSxjQUE4QixFQUNqRixXQUF3QixFQUFVLGFBQTRCLEVBQVUsWUFBMEIsRUFDbEcsY0FBOEIsRUFDN0IsWUFBMkIsRUFBVSxtQkFBeUM7UUFKL0Usb0JBQWUsR0FBZixlQUFlLENBQWlCO1FBQVUsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQzlGLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBd0I7UUFBVSxtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFDakYsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFBVSxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUFVLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBQ2xHLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUM3QixpQkFBWSxHQUFaLFlBQVksQ0FBZTtRQUFVLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBc0I7UUF4QmxHLDZCQUF3QixHQUFXLG9CQUFRLENBQUMsdUJBQXVCLENBQUM7UUFDcEUsVUFBSyxHQUFHLElBQUksbUNBQWUsRUFBRSxDQUFDO1FBSTlCLHVCQUFrQixHQUFZLElBQUksQ0FBQztRQUVuQyx1QkFBa0IsR0FBRyxJ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aUJBQUssQ0FBQztJQUNmLENBQUM7SUFHRCx5REFBc0IsR0FBdEIsVUFBdUIsTUFBVTtRQUMvQixJQUFJLENBQUMsT0FBTyxFQUFFLFlBQVksRUFBRTtZQUMxQixTQUFTLEVBQUUsTUFBTTtTQUNsQixDQUFDLENBQUM7UUFDSCxNQUFNLENBQUMsS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQWhJcUI7UUFBckIsZ0JBQVMsQ0FBQyxTQUFTLENBQUM7a0NBQVUsaUJBQVU7NkRBQUM7SUFGL0Isd0JBQXdCO1FBUHBDLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsUUFBUSxFQUFFLDJCQUEyQjtZQUNyQyxXQUFXLEVBQUUsa0NBQWtDO1lBQy9DLFNBQVMsRUFBRSxDQUFDLGlDQUFpQyxDQUFDO1NBQy9DLENBQUM7eUNBeUJvQyxrQ0FBZSxFQUF5QixxQkFBYSxFQUFtQixlQUFNO1lBQzVFLGtEQUFzQixFQUEwQixzQkFBYztZQUNwRSxtQkFBVyxFQUF5Qiw4QkFBYSxFQUF3Qiw0QkFBWTtZQUNsRix1QkFBYztZQUNkLDRCQUFZLEVBQWdDLDBDQUFtQjtPQTNCdkYsd0JBQXdCLENBbUlwQztJQUFELCtCQUFDO0NBbklELEFBbUlDLElBQUE7QUFuSVksNERBQXdCIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvcmVnaXN0cmF0aW9uL2NhbmRpZGF0ZS1zaWduLXVwL2NhbmRpZGF0ZS1zaWduLXVwLmNvbXBvbmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFmdGVyVmlld0luaXQsIENvbXBvbmVudCwgRWxlbWVudFJlZiwgT25Jbml0LCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGUsIFBhcmFtcywgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcclxuaW1wb3J0IHsgQ2FuZGlkYXRlU2lnblVwU2VydmljZSB9IGZyb20gJy4vY2FuZGlkYXRlLXNpZ24tdXAuc2VydmljZSc7XHJcbmltcG9ydCB7IENhbmRpZGF0ZURldGFpbCB9IGZyb20gJy4vLi4vLi4vLi4vdXNlci9tb2RlbHMvY2FuZGlkYXRlLWRldGFpbHMnO1xyXG5pbXBvcnQgeyBGb3JtQnVpbGRlciwgRm9ybUdyb3VwLCBWYWxpZGF0b3JzIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5pbXBvcnQgeyBWYWxpZGF0aW9uU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NoYXJlZC9jdXN0b212YWxpZGF0aW9ucy92YWxpZGF0aW9uLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBBcHBTZXR0aW5ncywgQ29tbW9uU2VydmljZSwgTWVzc2FnZSwgTWVzc2FnZVNlcnZpY2UsIE5hdmlnYXRpb25Sb3V0ZXMgfSBmcm9tICcuLi8uLi8uLi9zaGFyZWQvaW5kZXgnO1xyXG5pbXBvcnQgeyBBUEksIEltYWdlUGF0aCwgTGFiZWwsIFNlc3Npb25TdG9yYWdlLE1lc3NhZ2VzfSBmcm9tICcuLi8uLi8uLi9zaGFyZWQvY29uc3RhbnRzJztcclxuaW1wb3J0IHsgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vc2hhcmVkL3NlcnZpY2VzL3Nlc3Npb24uc2VydmljZSc7XHJcbmltcG9ydCB7IFNoYXJlZFNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zaGFyZWQvc2VydmljZXMvc2hhcmVkLXNlcnZpY2UnO1xyXG5pbXBvcnQgeyBFcnJvclNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zaGFyZWQvc2VydmljZXMvZXJyb3Iuc2VydmljZSc7XHJcbmltcG9ydCB7IEFuYWx5dGljU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NoYXJlZC9zZXJ2aWNlcy9hbmFseXRpYy5zZXJ2aWNlJztcclxuaW1wb3J0IHsgTG9naW4gfSBmcm9tICcuLi8uLi8uLi91c2VyL21vZGVscy9sb2dpbic7XHJcbmltcG9ydCB7IExvZ2luU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL2ZyYW1ld29yay9sb2dpbi9sb2dpbi5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUmVnaXN0cmF0aW9uU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3VzZXIvc2VydmljZXMvcmVnaXN0cmF0aW9uLnNlcnZpY2UnO1xyXG5cclxuZGVjbGFyZSAgdmFyIGZicTphbnk7XHJcbmRlY2xhcmUgIHZhciBndGFnOmFueTtcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIG1vZHVsZUlkOiBtb2R1bGUuaWQsXHJcbiAgc2VsZWN0b3I6ICdjbi1jYW5kaWRhdGUtcmVnaXN0cmF0aW9uJyxcclxuICB0ZW1wbGF0ZVVybDogJ2NhbmRpZGF0ZS1zaWduLXVwLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnY2FuZGlkYXRlLXNpZ24tdXAuY29tcG9uZW50LmNzcyddLFxyXG59KVxyXG5cclxuZXhwb3J0IGNsYXNzIENhbmRpZGF0ZVNpZ25VcENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCB7XHJcblxyXG4gIEBWaWV3Q2hpbGQoJ3RvYXN0ZXInKSB0b2FzdGVyOiBFbGVtZW50UmVmO1xyXG4gIHllYXJNYXRjaE5vdEZvdW5kTWVzc2FnZTogc3RyaW5nID0gTWVzc2FnZXMuTVNHX1lFQVJfTk9fTUFUQ0hfRk9VTkQ7XHJcbiAgbW9kZWwgPSBuZXcgQ2FuZGlkYXRlRGV0YWlsKCk7XHJcbiAgaXNQYXNzd29yZENvbmZpcm06IGJvb2xlYW47XHJcbiAgdXNlckZvcm06IEZvcm1Hcm91cDtcclxuICBlcnJvcl9tc2c6IHN0cmluZztcclxuICBpc1Nob3dFcnJvck1lc3NhZ2U6IGJvb2xlYW4gPSB0cnVlO1xyXG4gIHBhc3NpbmdZZWFyOiBzdHJpbmc7XHJcbiAgdmFsaWRCaXJ0aFllYXJMaXN0ID0gbmV3IEFycmF5KDApO1xyXG4gIG1haW5IZWFkZXJNZW51SGlkZVNob3c6IHN0cmluZztcclxuICBzdWJtaXRTdGF0dXM6IGJvb2xlYW47XHJcbiAgaXNDaHJvbWU6IGJvb2xlYW47XHJcbiAgaXNUb2FzdGVyVmlzaWJsZTogYm9vbGVhbiA9IHRydWU7XHJcbiAgaXNHdWlkZU1lc3NhZ2VWaXNpYmxlOiBib29sZWFuID0gZmFsc2U7XHJcbiAgaXNGcm9tQ2FyZWVyUGx1Z2luOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gIHByaXZhdGUgaXNGb3JtU3VibWl0dGVkID0gZmFsc2U7XHJcbiAgcHJpdmF0ZSBCT0RZX0JBQ0tHUk9VTkQ6IHN0cmluZztcclxuICBwcml2YXRlIE1ZX0xPR086IHN0cmluZztcclxuICBwcml2YXRlIGxvZ2luTW9kZWw6TG9naW47XHJcblxyXG4gY29uc3RydWN0b3IocHJpdmF0ZSBhbmFseXRpY1NlcnZpY2U6IEFuYWx5dGljU2VydmljZSwgcHJpdmF0ZSBjb21tb25TZXJ2aWNlOiBDb21tb25TZXJ2aWNlLCBwcml2YXRlIF9yb3V0ZXI6IFJvdXRlcixcclxuICAgICAgICAgICAgICBwcml2YXRlIGNhbmRpZGF0ZVNlcnZpY2U6IENhbmRpZGF0ZVNpZ25VcFNlcnZpY2UsIHByaXZhdGUgbWVzc2FnZVNlcnZpY2U6IE1lc3NhZ2VTZXJ2aWNlLFxyXG4gICAgICAgICAgICAgcHJpdmF0ZSBmb3JtQnVpbGRlcjogRm9ybUJ1aWxkZXIsIHByaXZhdGUgc2hhcmVkU2VydmljZTogU2hhcmVkU2VydmljZSwgcHJpdmF0ZSBlcnJvclNlcnZpY2U6IEVycm9yU2VydmljZSxcclxuICAgICAgICAgICAgIHByaXZhdGUgYWN0aXZhdGVkUm91dGU6IEFjdGl2YXRlZFJvdXRlLFxyXG4gICAgICAgICAgICAgIHByaXZhdGUgbG9naW5TZXJ2aWNlIDogTG9naW5TZXJ2aWNlLCBwcml2YXRlIHJlZ2lzdHJhdGlvblNlcnZpY2UgOiBSZWdpc3RyYXRpb25TZXJ2aWNlKSB7XHJcblxyXG4gICAgdGhpcy51c2VyRm9ybSA9IHRoaXMuZm9ybUJ1aWxkZXIuZ3JvdXAoe1xyXG4gICAgICAnZmlyc3RfbmFtZSc6IFsnJywgW1ZhbGlkYXRpb25TZXJ2aWNlLnJlcXVpcmVGaXJzdE5hbWVWYWxpZGF0b3JdXSxcclxuICAgICAgJ2VtYWlsJzogWycnLCBbVmFsaWRhdGlvblNlcnZpY2UucmVxdWlyZUVtYWlsVmFsaWRhdG9yLCBWYWxpZGF0aW9uU2VydmljZS5lbWFpbFZhbGlkYXRvcl1dLFxyXG4gICAgICAncGFzc3dvcmQnOiBbJycsIFtWYWxpZGF0aW9uU2VydmljZS5wYXNzd29yZFZhbGlkYXRvcl1dLFxyXG4gICAgfSk7XHJcbiAgICB0aGlzLmxvZ2luTW9kZWwgPSBuZXcgTG9naW4oKTtcclxuICAgIHRoaXMuQk9EWV9CQUNLR1JPVU5EID0gSW1hZ2VQYXRoLkJPRFlfQkFDS0dST1VORDtcclxuICAgIHRoaXMuTVlfTE9HTyA9IEltYWdlUGF0aC5NWV9XSElURV9MT0dPO1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICB0aGlzLm1haW5IZWFkZXJNZW51SGlkZVNob3cgPSAnYXBwbGljYW50JztcclxuICAgIHRoaXMuYWN0aXZhdGVkUm91dGUucXVlcnlQYXJhbXMuc3Vic2NyaWJlKChwYXJhbXM6IFBhcmFtcykgPT4ge1xyXG4gICAgICBpZihwYXJhbXNbJ3Bob25lTnVtYmVyJ10pIHtcclxuICAgICAgICB0aGlzLnVzZXJGb3JtLmNvbnRyb2xzWydtb2JpbGVfbnVtYmVyJ11cclxuICAgICAgICAgIC5zZXRWYWx1ZShOdW1iZXIocGFyYW1zWydwaG9uZU51bWJlciddKSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgbmdBZnRlclZpZXdJbml0KCkge1xyXG4gICAgdGhpcy5hY3RpdmF0ZWRSb3V0ZS5wYXJhbXMuc3Vic2NyaWJlKHBhcmFtcyA9PiB7XHJcbiAgICAgIHRoaXMuaXNHdWlkZU1lc3NhZ2VWaXNpYmxlID0gcGFyYW1zWydpZCddID09PSAnbmV3X3VzZXInID8gdHJ1ZSA6IGZhbHNlO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBvblN1Ym1pdCgpIHtcclxuICAgIHRoaXMubW9kZWwgPSB0aGlzLnVzZXJGb3JtLnZhbHVlO1xyXG4gICAgaWYgKHRoaXMubW9kZWwuZmlyc3RfbmFtZSA9PT0gJycgfHwgdGhpcy5tb2RlbC5lbWFpbCA9PT0gJycgfHwgdGhpcy5tb2RlbC5wYXNzd29yZCA9PT0gJycgKSB7XHJcbiAgICAgIHRoaXMuc3VibWl0U3RhdHVzID0gdHJ1ZTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghdGhpcy51c2VyRm9ybS52YWxpZCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5tb2RlbCA9IHRoaXMudXNlckZvcm0udmFsdWU7XHJcbiAgICB0aGlzLm1vZGVsLmZpcnN0X25hbWUgPSB0aGlzLm1vZGVsLmZpcnN0X25hbWUudHJpbSgpO1xyXG4gICAgdGhpcy5tb2RlbC5jdXJyZW50X3RoZW1lID0gQXBwU2V0dGluZ3MuTElHSFRfVEhFTTtcclxuICAgIHRoaXMubW9kZWwuaXNDYW5kaWRhdGUgPSB0cnVlO1xyXG4gICAgdGhpcy5tb2RlbC5pc0FjdGl2YXRlZCA9IHRydWU7XHJcbiAgICB0aGlzLm1vZGVsLmVtYWlsID0gdGhpcy5tb2RlbC5lbWFpbC50b0xvd2VyQ2FzZSgpO1xyXG5cclxuICAgIHRoaXMuaXNGb3JtU3VibWl0dGVkID0gdHJ1ZTtcclxuICAgIHRoaXMuY2FuZGlkYXRlU2VydmljZS5hZGRDYW5kaWRhdGUodGhpcy5tb2RlbClcclxuICAgICAgLnN1YnNjcmliZShcclxuICAgICAgICBjYW5kaWRhdGUgPT4gdGhpcy5vblJlZ2lzdHJhdGlvblN1Y2Nlc3MoY2FuZGlkYXRlKSxcclxuICAgICAgICBlcnJvciA9PiB0aGlzLm9uUmVnaXN0cmF0aW9uRmFsdXJlKGVycm9yKSk7XHJcblxyXG4gIH1cclxuXHJcbiAgb25SZWdpc3RyYXRpb25TdWNjZXNzKGNhbmRpZGF0ZTogYW55KSB7XHJcbiAgICAvKmZicSgndHJhY2snLCAnQ29tcGxldGVSZWdpc3RyYXRpb24nKTtcclxuICAgIHRoaXMuZ3RhZ19yZXBvcnRfY29udmVyc2lvbignQVctODMxOTAzOTE3L2ZUWnZDUEMxcTNZUXJiSFhqQU0nKTsqL1xyXG5cclxuICAgIFNlc3Npb25TdG9yYWdlU2VydmljZS5zZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuVVNFUl9JRCwgY2FuZGlkYXRlLmRhdGEuX2lkKTtcclxuICAgIFNlc3Npb25TdG9yYWdlU2VydmljZS5zZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuRU1BSUxfSUQsIHRoaXMudXNlckZvcm0udmFsdWUuZW1haWwpO1xyXG4gICAgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLnNldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5QQVNTV09SRCwgdGhpcy5tb2RlbC5wYXNzd29yZCk7XHJcbiAgICBTZXNzaW9uU3RvcmFnZVNlcnZpY2Uuc2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkNIQU5HRV9NQUlMX1ZBTFVFLCAnZnJvbV9yZWdpc3RyYXRpb24nKTtcclxuICAgIHRoaXMubmF2aWdhdGVUb0Rhc2hib2FyZCgpO1xyXG4gIH1cclxuXHJcbiAgbmF2aWdhdGVUb0Rhc2hib2FyZCgpIHtcclxuICAgIHRoaXMubG9naW5Nb2RlbC5lbWFpbCA9IFNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuRU1BSUxfSUQpO1xyXG4gICAgdGhpcy5sb2dpbk1vZGVsLnBhc3N3b3JkID0gU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLmdldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5QQVNTV09SRCk7XHJcbiAgICB0aGlzLmxvZ2luU2VydmljZS51c2VyTG9naW4odGhpcy5sb2dpbk1vZGVsKVxyXG4gICAgICAuc3Vic2NyaWJlKFxyXG4gICAgICAgIChyZXM6YW55KSA9PiAodGhpcy5yZWdpc3RyYXRpb25TZXJ2aWNlLm9uR2V0VXNlckRhdGFTdWNjZXNzKHJlcykpLFxyXG4gICAgICAgIChlcnJvcjphbnkpID0+ICh0aGlzLnJlZ2lzdHJhdGlvblNlcnZpY2Uub25Mb2dpbkZhaWx1cmUoZXJyb3IpKSk7XHJcbiAgfVxyXG5cclxuICBvblJlZ2lzdHJhdGlvbkZhbHVyZShlcnJvcjogYW55KSB7XHJcbiAgICBpZiAoZXJyb3IuZXJyX2NvZGUgPT09IDQwNCB8fCBlcnJvci5lcnJfY29kZSA9PT0gMCkge1xyXG4gICAgICB2YXIgbWVzc2FnZSA9IG5ldyBNZXNzYWdlKCk7XHJcbiAgICAgIG1lc3NhZ2UuZXJyb3JfbXNnID0gZXJyb3IuZXJyX21zZztcclxuICAgICAgbWVzc2FnZS5pc0Vycm9yID0gdHJ1ZTtcclxuICAgICAgdGhpcy5tZXNzYWdlU2VydmljZS5tZXNzYWdlKG1lc3NhZ2UpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5pc1Nob3dFcnJvck1lc3NhZ2UgPSBmYWxzZTtcclxuICAgICAgdGhpcy5lcnJvcl9tc2cgPSBlcnJvci5lcnJfbXNnO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ29Ub1NpZ25JbigpIHtcclxuICAgIHRoaXMuX3JvdXRlci5uYXZpZ2F0ZShbTmF2aWdhdGlvblJvdXRlcy5BUFBfTE9HSU5dKTtcclxuICB9XHJcblxyXG4gIGdldE1lc3NhZ2VzKCkge1xyXG4gICAgcmV0dXJuIE1lc3NhZ2VzO1xyXG4gIH1cclxuICBnZXRMYWJlbCgpIHtcclxuICAgIHJldHVybiBMYWJlbDtcclxuICB9XHJcblxyXG5cclxuICBndGFnX3JlcG9ydF9jb252ZXJzaW9uKHNlbmRUbzphbnkpIHtcclxuICAgIGd0YWcoJ2V2ZW50JywgJ2NvbnZlcnNpb24nLCB7XHJcbiAgICAgICdzZW5kX3RvJzogc2VuZFRvXHJcbiAgICB9KTtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbn1cclxuIl19
