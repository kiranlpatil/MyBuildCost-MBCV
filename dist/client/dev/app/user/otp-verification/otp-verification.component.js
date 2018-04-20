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
var forms_1 = require("@angular/forms");
var constants_1 = require("../../shared/constants");
var verify_otp_1 = require("../models/verify-otp");
var message_service_1 = require("../../shared/services/message.service");
var message_1 = require("../../shared/models/message");
var validation_service_1 = require("../../shared/customvalidations/validation.service");
var login_service_1 = require("../../framework/login/login.service");
var registration_service_1 = require("../services/registration.service");
var otp_verification_service_1 = require("./otp-verification.service");
var session_service_1 = require("../../shared/services/session.service");
var login_1 = require("../models/login");
var OtpVerificationComponent = (function () {
    function OtpVerificationComponent(formBuilder, verifyPhoneService, messageService, loginService, registrationService) {
        this.formBuilder = formBuilder;
        this.verifyPhoneService = verifyPhoneService;
        this.messageService = messageService;
        this.loginService = loginService;
        this.registrationService = registrationService;
        this.onMobileNumberChangeSuccess = new core_1.EventEmitter();
        this.onMobileVerificationSuccess = new core_1.EventEmitter();
        this.isShowErrorMessage = true;
        this.loginModel = new login_1.Login();
        this.userForm = this.formBuilder.group({
            'otp': ['', validation_service_1.ValidationService.requireOtpValidator]
        });
        this.verifyOtpModel = new verify_otp_1.VerifyOtp();
    }
    OtpVerificationComponent.prototype.onSubmit = function () {
        var _this = this;
        this.verifyOtpModel = this.userForm.value;
        if (this.verifyOtpModel.otp === '') {
            this.submitStatus = true;
            return;
        }
        if (!this.userForm.valid) {
            return;
        }
        if (this.actionName === this.getMessages().FROM_REGISTRATION) {
            this.verifyPhoneService.verifyPhone(this.verifyOtpModel, this.userID)
                .subscribe(function (res) { return (_this.onVerifyPhoneSuccess(res)); }, function (error) { return (_this.onVerifyPhoneFailure(error)); });
        }
        else {
            this.verifyPhoneService.changeMobile(this.verifyOtpModel, this.changeMobileNumberInfo.id)
                .subscribe(function (res) { return (_this.mobileVerificationSuccess(res)); }, function (error) { return (_this.onVerifyPhoneFailure(error)); });
        }
    };
    OtpVerificationComponent.prototype.resendVerificationCode = function () {
        var _this = this;
        if (this.actionName === this.getMessages().FROM_REGISTRATION) {
            this.verifyPhoneService.resendVerificationCode(this.userID, this.mobileNumber)
                .subscribe(function (res) { return (_this.resendOtpSuccess(constants_1.Messages.MSG_SUCCESS_RESEND_VERIFICATION_CODE)); }, function (error) { return (_this.resendOtpFailure(error)); });
        }
        else {
            this.verifyPhoneService.resendChangeMobileVerificationCode(this.changeMobileNumberInfo)
                .subscribe(function (res) { return (_this.resendOtpSuccess(constants_1.Messages.MSG_SUCCESS_RESEND_VERIFICATION_CODE_RESEND_OTP)); }, function (error) { return (_this.resendOtpFailure(error)); });
        }
    };
    OtpVerificationComponent.prototype.onVerifyPhoneSuccess = function (res) {
        this.onMobileVerificationSuccess.emit();
        this.navigateToDashboard();
    };
    OtpVerificationComponent.prototype.navigateToDashboard = function () {
        var _this = this;
        this.loginModel.email = session_service_1.SessionStorageService.getSessionValue(constants_1.SessionStorage.EMAIL_ID);
        this.loginModel.password = session_service_1.SessionStorageService.getSessionValue(constants_1.SessionStorage.PASSWORD);
        this.loginService.userLogin(this.loginModel)
            .subscribe(function (res) { return (_this.registrationService.onGetUserDataSuccess(res)); }, function (error) { return (_this.registrationService.onLoginFailure(error)); });
    };
    OtpVerificationComponent.prototype.mobileVerificationSuccess = function (res) {
        this.showInformationMessage(constants_1.Messages.MSG_SUCCESS_CHANGE_MOBILE_NUMBER);
        this.onMobileNumberChangeSuccess.emit();
    };
    OtpVerificationComponent.prototype.onVerifyPhoneFailure = function (error) {
        if (error.err_code === 404 || error.err_code === 0) {
            this.showErrorMessage(error);
        }
        else {
            this.isShowErrorMessage = false;
            this.error_msg = error.err_msg;
        }
    };
    OtpVerificationComponent.prototype.resendOtpSuccess = function (successMessage) {
        this.showInformationMessage(successMessage);
    };
    OtpVerificationComponent.prototype.resendOtpFailure = function (error) {
        if (error.err_code === 404 || error.err_code === 0) {
            this.showErrorMessage(error);
        }
        else {
            this.isShowErrorMessage = false;
            this.error_msg = error.err_msg;
            this.showErrorMessage(error);
        }
    };
    OtpVerificationComponent.prototype.getMessages = function () {
        return constants_1.Messages;
    };
    OtpVerificationComponent.prototype.showInformationMessage = function (customMessage) {
        var message = new message_1.Message();
        message.isError = false;
        message.custom_message = customMessage;
        this.messageService.message(message);
    };
    OtpVerificationComponent.prototype.showErrorMessage = function (error) {
        var message = new message_1.Message();
        message.error_msg = error.err_msg;
        message.isError = true;
        this.messageService.message(message);
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], OtpVerificationComponent.prototype, "verificationMessage", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], OtpVerificationComponent.prototype, "verificationHeading", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], OtpVerificationComponent.prototype, "actionName", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], OtpVerificationComponent.prototype, "changeMobileNumberInfo", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], OtpVerificationComponent.prototype, "userID", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], OtpVerificationComponent.prototype, "mobileNumber", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], OtpVerificationComponent.prototype, "onMobileNumberChangeSuccess", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], OtpVerificationComponent.prototype, "onMobileVerificationSuccess", void 0);
    OtpVerificationComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'cn-otp-verification',
            templateUrl: 'otp-verification.component.html',
            styleUrls: ['otp-verification.component.css'],
        }),
        __metadata("design:paramtypes", [forms_1.FormBuilder, otp_verification_service_1.OtpVerificationService,
            message_service_1.MessageService, login_service_1.LoginService,
            registration_service_1.RegistrationService])
    ], OtpVerificationComponent);
    return OtpVerificationComponent;
}());
exports.OtpVerificationComponent = OtpVerificationComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC91c2VyL290cC12ZXJpZmljYXRpb24vb3RwLXZlcmlmaWNhdGlvbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxzQ0FBd0U7QUFDeEUsd0NBQXdEO0FBQ3hELG9EQUFrRTtBQUNsRSxtREFBa0Q7QUFDbEQseUVBQXVFO0FBQ3ZFLHVEQUFzRDtBQUN0RCx3RkFBc0Y7QUFDdEYscUVBQW1FO0FBQ25FLHlFQUF1RTtBQUN2RSx1RUFBb0U7QUFDcEUseUVBQThFO0FBQzlFLHlDQUF3QztBQVF4QztJQWVFLGtDQUFvQixXQUF3QixFQUFVLGtCQUEwQyxFQUM1RSxjQUE4QixFQUFVLFlBQTBCLEVBQ2xFLG1CQUF3QztRQUZ4QyxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUFVLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBd0I7UUFDNUUsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBQVUsaUJBQVksR0FBWixZQUFZLENBQWM7UUFDbEUsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFxQjtRQVZsRCxnQ0FBMkIsR0FBMEIsSUFBSSxtQkFBWSxFQUFFLENBQUM7UUFDeEUsZ0NBQTJCLEdBQTBCLElBQUksbUJBQVksRUFBRSxDQUFDO1FBSWxGLHVCQUFrQixHQUFZLElBQUksQ0FBQztRQU1qQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksYUFBSyxFQUFFLENBQUM7UUFFOUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQztZQUNyQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUUsc0NBQWlCLENBQUMsbUJBQW1CLENBQUM7U0FDbkQsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLHNCQUFTLEVBQUUsQ0FBQztJQUN4QyxDQUFDO0lBQ0QsMkNBQVEsR0FBUjtRQUFBLGlCQXFCQztRQXBCQyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMs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b0I7SUFDbkI7UUFBUixZQUFLLEVBQUU7OzRFQUE0QjtJQUMzQjtRQUFSLFlBQUssRUFBRTs7NERBQVk7SUFDWDtRQUFSLFlBQUssRUFBRTs7a0VBQWtCO0lBQ2hCO1FBQVQsYUFBTSxFQUFFO2tDQUE4QixtQkFBWTtpRkFBK0I7SUFDeEU7UUFBVCxhQUFNLEVBQUU7a0NBQThCLG1CQUFZO2lGQUErQjtJQVJ2RSx3QkFBd0I7UUFOcEMsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNuQixRQUFRLEVBQUUscUJBQXFCO1lBQy9CLFdBQVcsRUFBRSxpQ0FBaUM7WUFDOUMsU0FBUyxFQUFFLENBQUMsZ0NBQWdDLENBQUM7U0FDOUMsQ0FBQzt5Q0FnQmlDLG1CQUFXLEVBQThCLGlEQUFzQjtZQUM1RCxnQ0FBYyxFQUF3Qiw0QkFBWTtZQUM3QywwQ0FBbUI7T0FqQmpELHdCQUF3QixDQW9IcEM7SUFBRCwrQkFBQztDQXBIRCxBQW9IQyxJQUFBO0FBcEhZLDREQUF3QiIsImZpbGUiOiJhcHAvdXNlci9vdHAtdmVyaWZpY2F0aW9uL290cC12ZXJpZmljYXRpb24uY29tcG9uZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPdXRwdXQsIElucHV0ICwgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEZvcm1CdWlsZGVyLCBGb3JtR3JvdXAgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XHJcbmltcG9ydCB7IE1lc3NhZ2VzLCBTZXNzaW9uU3RvcmFnZSB9IGZyb20gJy4uLy4uL3NoYXJlZC9jb25zdGFudHMnO1xyXG5pbXBvcnQgeyBWZXJpZnlPdHAgIH0gZnJvbSAnLi4vbW9kZWxzL3ZlcmlmeS1vdHAnO1xyXG5pbXBvcnQgeyBNZXNzYWdlU2VydmljZSB9IGZyb20gJy4uLy4uL3NoYXJlZC9zZXJ2aWNlcy9tZXNzYWdlLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBNZXNzYWdlIH0gZnJvbSAnLi4vLi4vc2hhcmVkL21vZGVscy9tZXNzYWdlJztcclxuaW1wb3J0IHsgVmFsaWRhdGlvblNlcnZpY2UgfSBmcm9tICcuLi8uLi9zaGFyZWQvY3VzdG9tdmFsaWRhdGlvbnMvdmFsaWRhdGlvbi5zZXJ2aWNlJztcclxuaW1wb3J0IHsgTG9naW5TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vZnJhbWV3b3JrL2xvZ2luL2xvZ2luLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBSZWdpc3RyYXRpb25TZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvcmVnaXN0cmF0aW9uLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBPdHBWZXJpZmljYXRpb25TZXJ2aWNlIH0gZnJvbSAnLi9vdHAtdmVyaWZpY2F0aW9uLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBTZXNzaW9uU3RvcmFnZVNlcnZpY2UgfSBmcm9tICcuLi8uLi9zaGFyZWQvc2VydmljZXMvc2Vzc2lvbi5zZXJ2aWNlJztcclxuaW1wb3J0IHsgTG9naW4gfSBmcm9tICcuLi9tb2RlbHMvbG9naW4nO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcclxuICBzZWxlY3RvcjogJ2NuLW90cC12ZXJpZmljYXRpb24nLFxyXG4gIHRlbXBsYXRlVXJsOiAnb3RwLXZlcmlmaWNhdGlvbi5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJ290cC12ZXJpZmljYXRpb24uY29tcG9uZW50LmNzcyddLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgT3RwVmVyaWZpY2F0aW9uQ29tcG9uZW50IHtcclxuICBASW5wdXQoKSB2ZXJpZmljYXRpb25NZXNzYWdlOiBzdHJpbmc7XHJcbiAgQElucHV0KCkgdmVyaWZpY2F0aW9uSGVhZGluZzogc3RyaW5nO1xyXG4gIEBJbnB1dCgpIGFjdGlvbk5hbWU6IHN0cmluZztcclxuICBASW5wdXQoKSBjaGFuZ2VNb2JpbGVOdW1iZXJJbmZvOmFueTtcclxuICBASW5wdXQoKSB1c2VySUQ6YW55O1xyXG4gIEBJbnB1dCgpIG1vYmlsZU51bWJlcjphbnk7XHJcbiAgQE91dHB1dCgpIG9uTW9iaWxlTnVtYmVyQ2hhbmdlU3VjY2VzczogRXZlbnRFbWl0dGVyPGJvb2xlYW4+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gIEBPdXRwdXQoKSBvbk1vYmlsZVZlcmlmaWNhdGlvblN1Y2Nlc3M6IEV2ZW50RW1pdHRlcjxib29sZWFuPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICB2ZXJpZnlPdHBNb2RlbDpWZXJpZnlPdHA7XHJcbiAgdXNlckZvcm06IEZvcm1Hcm91cDtcclxuICBlcnJvcl9tc2c6IHN0cmluZztcclxuICBpc1Nob3dFcnJvck1lc3NhZ2U6IGJvb2xlYW4gPSB0cnVlO1xyXG4gIHN1Ym1pdFN0YXR1czogYm9vbGVhbjtcclxuICBwcml2YXRlIGxvZ2luTW9kZWw6TG9naW47XHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBmb3JtQnVpbGRlcjogRm9ybUJ1aWxkZXIsIHByaXZhdGUgdmVyaWZ5UGhvbmVTZXJ2aWNlOiBPdHBWZXJpZmljYXRpb25TZXJ2aWNlLFxyXG4gICAgICAgICAgICAgIHByaXZhdGUgbWVzc2FnZVNlcnZpY2U6IE1lc3NhZ2VTZXJ2aWNlLCBwcml2YXRlIGxvZ2luU2VydmljZTogTG9naW5TZXJ2aWNlLFxyXG4gICAgICAgICAgICAgIHByaXZhdGUgcmVnaXN0cmF0aW9uU2VydmljZTogUmVnaXN0cmF0aW9uU2VydmljZSkge1xyXG4gICAgdGhpcy5sb2dpbk1vZGVsID0gbmV3IExvZ2luKCk7XHJcblxyXG4gICAgdGhpcy51c2VyRm9ybSA9IHRoaXMuZm9ybUJ1aWxkZXIuZ3JvdXAoe1xyXG4gICAgICAnb3RwJzogWycnLCBWYWxpZGF0aW9uU2VydmljZS5yZXF1aXJlT3RwVmFsaWRhdG9yXVxyXG4gICAgfSk7XHJcbiAgICB0aGlzLnZlcmlmeU90cE1vZGVsID0gbmV3IFZlcmlmeU90cCgpO1xyXG4gIH1cclxuICBvblN1Ym1pdCgpIHtcclxuICAgIHRoaXMudmVyaWZ5T3RwTW9kZWwgPSB0aGlzLnVzZXJGb3JtLnZhbHVlO1xyXG4gICAgaWYgKHRoaXMudmVyaWZ5T3RwTW9kZWwub3RwID09PSAnJykge1xyXG4gICAgICB0aGlzLnN1Ym1pdFN0YXR1cyA9IHRydWU7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGlmICghdGhpcy51c2VyRm9ybS52YWxpZCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuYWN0aW9uTmFtZT09PXRoaXMuZ2V0TWVzc2FnZXMoKS5GUk9NX1JFR0lTVFJBVElPTikge1xyXG4gICAgICB0aGlzLnZlcmlmeVBob25lU2VydmljZS52ZXJpZnlQaG9uZSh0aGlzLnZlcmlmeU90cE1vZGVsLHRoaXMudXNlcklEKVxyXG4gICAgICAgIC5zdWJzY3JpYmUoXHJcbiAgICAgICAgICByZXMgPT4gKHRoaXMub25WZXJpZnlQaG9uZVN1Y2Nlc3MocmVzKSksXHJcbiAgICAgICAgICBlcnJvciA9PiAodGhpcy5vblZlcmlmeVBob25lRmFpbHVyZShlcnJvcikpKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMudmVyaWZ5UGhvbmVTZXJ2aWNlLmNoYW5nZU1vYmlsZSh0aGlzLnZlcmlmeU90cE1vZGVsLHRoaXMuY2hhbmdlTW9iaWxlTnVtYmVySW5mby5pZClcclxuICAgICAgICAuc3Vic2NyaWJlKFxyXG4gICAgICAgICAgcmVzID0+ICh0aGlzLm1vYmlsZVZlcmlmaWNhdGlvblN1Y2Nlc3MocmVzKSksXHJcbiAgICAgICAgICBlcnJvciA9PiAodGhpcy5vblZlcmlmeVBob25lRmFpbHVyZShlcnJvcikpKTtcclxuICAgIH1cclxuICB9XHJcbiAgcmVzZW5kVmVyaWZpY2F0aW9uQ29kZSgpIHtcclxuICAgIGlmICh0aGlzLmFjdGlvbk5hbWU9PT10aGlzLmdldE1lc3NhZ2VzKCkuRlJPTV9SRUdJU1RSQVRJT04pIHtcclxuICAgICAgdGhpcy52ZXJpZnlQaG9uZVNlcnZpY2UucmVzZW5kVmVyaWZpY2F0aW9uQ29kZSh0aGlzLnVzZXJJRCx0aGlzLm1vYmlsZU51bWJlcilcclxuICAgICAgICAuc3Vic2NyaWJlKFxyXG4gICAgICAgICAgcmVzID0+ICh0aGlzLnJlc2VuZE90cFN1Y2Nlc3MoTWVzc2FnZXMuTVNHX1NVQ0NFU1NfUkVTRU5EX1ZFUklGSUNBVElPTl9DT0RFKSksXHJcbiAgICAgICAgICBlcnJvciA9PiAodGhpcy5yZXNlbmRPdHBGYWlsdXJlKGVycm9yKSkpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy52ZXJpZnlQaG9uZVNlcnZpY2UucmVzZW5kQ2hhbmdlTW9iaWxlVmVyaWZpY2F0aW9uQ29kZSh0aGlzLmNoYW5nZU1vYmlsZU51bWJlckluZm8pXHJcbiAgICAgICAgLnN1YnNjcmliZShyZXMgPT4gKHRoaXMucmVzZW5kT3RwU3VjY2VzcyhNZXNzYWdlcy5NU0dfU1VDQ0VTU19SRVNFTkRfVkVSSUZJQ0FUSU9OX0NPREVfUkVTRU5EX09UUCkpLFxyXG4gICAgICAgICAgZXJyb3IgPT4gKHRoaXMucmVzZW5kT3RwRmFpbHVyZShlcnJvcikpKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG9uVmVyaWZ5UGhvbmVTdWNjZXNzKHJlczogYW55KSB7XHJcbiAgICB0aGlzLm9uTW9iaWxlVmVyaWZpY2F0aW9uU3VjY2Vzcy5lbWl0KCk7XHJcbiAgICB0aGlzLm5hdmlnYXRlVG9EYXNoYm9hcmQoKTtcclxuICB9XHJcblxyXG4gIG5hdmlnYXRlVG9EYXNoYm9hcmQoKSB7XHJcbiAgICB0aGlzLmxvZ2luTW9kZWwuZW1haWwgPSBTZXNzaW9uU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkVNQUlMX0lEKTtcclxuICAgIHRoaXMubG9naW5Nb2RlbC5wYXNzd29yZCA9IFNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuUEFTU1dPUkQpO1xyXG4gICAgdGhpcy5sb2dpblNlcnZpY2UudXNlckxvZ2luKHRoaXMubG9naW5Nb2RlbClcclxuICAgICAgLnN1YnNjcmliZShcclxuICAgICAgICAocmVzOmFueSkgPT4gKHRoaXMucmVnaXN0cmF0aW9uU2VydmljZS5vbkdldFVzZXJEYXRhU3VjY2VzcyhyZXMpKSxcclxuICAgICAgICAoZXJyb3I6YW55KSA9PiAodGhpcy5yZWdpc3RyYXRpb25TZXJ2aWNlLm9uTG9naW5GYWlsdXJlKGVycm9yKSkpO1xyXG4gIH1cclxuICBtb2JpbGVWZXJpZmljYXRpb25TdWNjZXNzKHJlczogYW55KSB7XHJcbiAgICB0aGlzLnNob3dJbmZvcm1hdGlvbk1lc3NhZ2UoTWVzc2FnZXMuTVNHX1NVQ0NFU1NfQ0hBTkdFX01PQklMRV9OVU1CRVIpO1xyXG4gICAgdGhpcy5vbk1vYmlsZU51bWJlckNoYW5nZVN1Y2Nlc3MuZW1pdCgpO1xyXG4gIH1cclxuICBvblZlcmlmeVBob25lRmFpbHVyZShlcnJvcjogYW55KSB7XHJcbiAgICBpZiAoZXJyb3IuZXJyX2NvZGUgPT09IDQwNCB8fCBlcnJvci5lcnJfY29kZSA9PT0gMCkge1xyXG4gICAgICB0aGlzLnNob3dFcnJvck1lc3NhZ2UoZXJyb3IpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5pc1Nob3dFcnJvck1lc3NhZ2UgPSBmYWxzZTtcclxuICAgICAgdGhpcy5lcnJvcl9tc2cgPSBlcnJvci5lcnJfbXNnO1xyXG4gICAgfVxyXG5cclxuICB9XHJcbiAgcmVzZW5kT3RwU3VjY2VzcyhzdWNjZXNzTWVzc2FnZTogYW55KSB7XHJcbiAgICB0aGlzLnNob3dJbmZvcm1hdGlvbk1lc3NhZ2Uoc3VjY2Vzc01lc3NhZ2UpO1xyXG4gIH1cclxuICByZXNlbmRPdHBGYWlsdXJlKGVycm9yOiBhbnkpIHtcclxuICAgIGlmIChlcnJvci5lcnJfY29kZSA9PT0gNDA0IHx8IGVycm9yLmVycl9jb2RlID09PSAwKSB7XHJcbiAgICAgIHRoaXMuc2hvd0Vycm9yTWVzc2FnZShlcnJvcik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmlzU2hvd0Vycm9yTWVzc2FnZSA9IGZhbHNlO1xyXG4gICAgICB0aGlzLmVycm9yX21zZyA9IGVycm9yLmVycl9tc2c7XHJcbiAgICAgIHRoaXMuc2hvd0Vycm9yTWVzc2FnZShlcnJvcik7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGdldE1lc3NhZ2VzKCkge1xyXG4gICAgcmV0dXJuIE1lc3NhZ2VzO1xyXG4gIH1cclxuXHJcbiAgc2hvd0luZm9ybWF0aW9uTWVzc2FnZShjdXN0b21NZXNzYWdlOmFueSkge1xyXG4gICAgdmFyIG1lc3NhZ2UgPSBuZXcgTWVzc2FnZSgpO1xyXG4gICAgbWVzc2FnZS5pc0Vycm9yID0gZmFsc2U7XHJcbiAgICBtZXNzYWdlLmN1c3RvbV9tZXNzYWdlID0gY3VzdG9tTWVzc2FnZTtcclxuICAgIHRoaXMubWVzc2FnZVNlcnZpY2UubWVzc2FnZShtZXNzYWdlKTtcclxuICB9XHJcblxyXG4gIHNob3dFcnJvck1lc3NhZ2UoZXJyb3I6YW55KSB7XHJcbiAgICB2YXIgbWVzc2FnZSA9IG5ldyBNZXNzYWdlKCk7XHJcbiAgICBtZXNzYWdlLmVycm9yX21zZyA9IGVycm9yLmVycl9tc2c7XHJcbiAgICBtZXNzYWdlLmlzRXJyb3IgPSB0cnVlO1xyXG4gICAgdGhpcy5tZXNzYWdlU2VydmljZS5tZXNzYWdlKG1lc3NhZ2UpO1xyXG4gIH1cclxuXHJcbn1cclxuIl19
