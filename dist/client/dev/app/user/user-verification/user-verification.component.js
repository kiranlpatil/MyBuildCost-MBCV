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
var forms_1 = require("@angular/forms");
var constants_1 = require("../../shared/constants");
var validation_service_1 = require("../../shared/customvalidations/validation.service");
var verify_user_1 = require("../models/verify-user");
var user_verification_service_1 = require("./user-verification.service");
var session_service_1 = require("../../shared/services/session.service");
var message_1 = require("../../shared/models/message");
var message_service_1 = require("../../shared/services/message.service");
var analytic_service_1 = require("../../shared/services/analytic.service");
var UserVerificationComponent = (function () {
    function UserVerificationComponent(analyticService, _router, formBuilder, verifyUserService, messageService) {
        this.analyticService = analyticService;
        this._router = _router;
        this.formBuilder = formBuilder;
        this.verifyUserService = verifyUserService;
        this.messageService = messageService;
        this.model = new verify_user_1.VerifyUser();
        this.isShowErrorMessage = true;
        this.isCandidate = false;
        this.chkMobile = false;
        this.isMailSent = false;
        this.chkEmail = true;
        this.verifyUserMessage_1 = constants_1.Messages.MSG_VERIFY_USER_1;
        this.verifyUserMessage_2 = constants_1.Messages.MSG_VERIFY_USER_2;
        this.verifyUserMessage_3 = constants_1.Messages.MSG_VERIFY_USER_3;
        this.verifyUserMessage_4 = constants_1.Messages.MSG_VERIFY_USER_4;
        this.isShowLoader = false;
        this.userForm = this.formBuilder.group({
            'mobile_number': ['', [validation_service_1.ValidationService.requireMobileNumberValidator, validation_service_1.ValidationService.mobileNumberValidator]],
            'email': ['', [validation_service_1.ValidationService.requireEmailValidator, validation_service_1.ValidationService.emailValidator]]
        });
        fbq('track', 'PageView');
        this.analyticService.googleAnalyse(this._router);
        this.MY_LOGO_PATH = constants_1.ImagePath.MY_WHITE_LOGO;
        this.MY_TAG_LINE = constants_1.ProjectAsset.TAG_LINE;
        this.UNDER_LICENCE = constants_1.ProjectAsset.UNDER_LICENECE;
        this.BODY_BACKGROUND = constants_1.ImagePath.BODY_BACKGROUND;
    }
    UserVerificationComponent.prototype.ngOnInit = function () {
        this.model.mobile_number = session_service_1.SessionStorageService.getSessionValue(constants_1.SessionStorage.MOBILE_NUMBER);
        this.model.email = session_service_1.SessionStorageService.getSessionValue(constants_1.SessionStorage.EMAIL_ID);
        var val = true;
        if (val == true) {
            this.isCandidate = true;
            this.chkMobile = false;
            this.chkEmail = true;
        }
        else {
            this.isCandidate = false;
            this.chkMobile = true;
            this.chkEmail = false;
        }
    };
    UserVerificationComponent.prototype.navigateTo = function () {
        this._router.navigate([constants_1.NavigationRoutes.APP_LOGIN]);
    };
    UserVerificationComponent.prototype.onSubmit = function () {
        var _this = this;
        if (this.isCandidate && this.userForm.value.mobile_number == 'null') {
            this.submitMobileStatus = true;
            return;
        }
        else if (!this.isCandidate && this.userForm.value.email == 'null' && !this.userForm.get('email').valid) {
            this.submitEmailStatus = true;
            return;
        }
        if (this.isCandidate && this.userForm.value.mobile_number != 'null' && !this.userForm.get('mobile_number').valid) {
            this.submitMobileStatus = true;
            return;
        }
        else if (!this.isCandidate && this.userForm.value.email != 'null' && !this.userForm.get('email').valid) {
            this.submitEmailStatus = true;
            return;
        }
        if (!this.chkMobile) {
            this.model = this.userForm.value;
            session_service_1.SessionStorageService.setSessionValue(constants_1.SessionStorage.MOBILE_NUMBER, this.model.mobile_number);
            this.model.mobile_number = session_service_1.SessionStorageService.getSessionValue(constants_1.SessionStorage.MOBILE_NUMBER);
            this.verifyUserService.verifyUserByMobile(this.model)
                .subscribe(function (res) { return (_this.onVerifySuccess(res)); }, function (error) { return (_this.onVerifyFailure(error)); });
        }
        else {
            this.model.email = session_service_1.SessionStorageService.getSessionValue(constants_1.SessionStorage.EMAIL_ID);
            this.isShowLoader = true;
            this.verifyUserService.verifyUserByMail(this.model)
                .subscribe(function (res) {
                _this.onVerifySuccess(res);
                _this.isShowLoader = false;
            }, function (error) { return (_this.onVerifyFailure(error)); });
        }
    };
    UserVerificationComponent.prototype.onVerifySuccess = function (res) {
        if (!this.chkMobile) {
            session_service_1.SessionStorageService.setSessionValue(constants_1.SessionStorage.VERIFY_PHONE_VALUE, 'from_registration');
            this._router.navigate([constants_1.NavigationRoutes.VERIFY_PHONE]);
        }
        else {
            this.isMailSent = true;
            session_service_1.SessionStorageService.setSessionValue(constants_1.SessionStorage.CHANGE_MAIL_VALUE, 'from_registration');
            var message = new message_1.Message();
            message.isError = false;
            message.custom_message = constants_1.Messages.MSG_SUCCESS_MAIL_VERIFICATION;
            this.messageService.message(message);
        }
    };
    UserVerificationComponent.prototype.onVerifyFailure = function (error) {
        if (error.err_code === 404 || error.err_code === 0) {
            var message = new message_1.Message();
            message.error_msg = error.err_msg;
            message.isError = true;
            this.messageService.message(message);
        }
        else {
            this.isShowErrorMessage = false;
            this.error_msg = error.err_msg;
        }
    };
    UserVerificationComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'cn-user-verification',
            templateUrl: 'user-verification.component.html',
            styleUrls: ['user-verification.component.css'],
        }),
        __metadata("design:paramtypes", [analytic_service_1.AnalyticService, router_1.Router, forms_1.FormBuilder,
            user_verification_service_1.UserVerificationService, message_service_1.MessageService])
    ], UserVerificationComponent);
    return UserVerificationComponent;
}());
exports.UserVerificationComponent = UserVerificationComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC91c2VyL3VzZXItdmVyaWZpY2F0aW9uL3VzZXItdmVyaWZpY2F0aW9uLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHNDQUFrRDtBQUNsRCwwQ0FBeUM7QUFDekMsd0NBQXdEO0FBQ3hELG9EQUE2RztBQUM3Ryx3RkFBc0Y7QUFDdEYscURBQW1EO0FBQ25ELHlFQUFzRTtBQUN0RSx5RUFBOEU7QUFDOUUsdURBQXNEO0FBQ3RELHlFQUF1RTtBQUN2RSwyRUFBeUU7QUFTekU7SUFzQkUsbUNBQW9CLGVBQWdDLEVBQVUsT0FBZSxFQUFVLFdBQXdCLEVBQzNGLGlCQUEwQyxFQUFVLGNBQThCO1FBRGxGLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQUFVLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFBVSxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUMzRixzQkFBaUIsR0FBakIsaUJBQWlCLENBQXlCO1FBQVUsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBdEJ0RyxVQUFLLEdBQUcsSUFBSSx3QkFBVSxFQUFFLENBQUM7UUFHekIsdUJBQWtCLEdBQVksSUFBSSxDQUFDO1FBQ25DLGdCQUFXLEdBQVksS0FBSyxDQUFDO1FBQzdCLGNBQVMsR0FBWSxLQUFLLENBQUM7UUFDM0IsZUFBVSxHQUFZLEtBQUssQ0FBQztRQUM1QixhQUFRLEdBQVksSUFBSSxDQUFDO1FBT3pCLHdCQUFtQixHQUFVLG9CQUFRLENBQUMsaUJBQWlCLENBQUM7UUFDeEQsd0JBQW1CLEdBQVUsb0JBQVEsQ0FBQyxpQkFBaUIsQ0FBQztRQUN4RCx3QkFBbUIsR0FBVSxvQkFBUSxDQUFDLGlCQUFpQixDQUFDO1FBQ3hELHdCQUFtQixHQUFVLG9CQUFRLENBQUMsaUJBQWlCLENBQUM7UUFDeEQsaUJBQVksR0FBWSxLQUFLLENBQUM7UUFNNUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQztZQUNyQyxlQUFlLEVB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QUFRLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuRCxJQUFJLE9BQU8sR0FBRyxJQUFJLGlCQUFPLEVBQUUsQ0FBQztZQUM1QixPQUFPLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7WUFDbEMsT0FBTyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7WUFDdkIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdkMsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sSUFBSSxDQUFDLGtCQUFrQixHQUFHLEtBQUssQ0FBQztZQUNoQyxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFFakMsQ0FBQztJQUNILENBQUM7SUF2SFUseUJBQXlCO1FBTnJDLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsUUFBUSxFQUFFLHNCQUFzQjtZQUNoQyxXQUFXLEVBQUUsa0NBQWtDO1lBQy9DLFNBQVMsRUFBRSxDQUFDLGlDQUFpQyxDQUFDO1NBQy9DLENBQUM7eUNBdUJxQyxrQ0FBZSxFQUFtQixlQUFNLEVBQXVCLG1CQUFXO1lBQ3hFLG1EQUF1QixFQUEwQixnQ0FBYztPQXZCM0YseUJBQXlCLENBeUhyQztJQUFELGdDQUFDO0NBekhELEFBeUhDLElBQUE7QUF6SFksOERBQXlCIiwiZmlsZSI6ImFwcC91c2VyL3VzZXItdmVyaWZpY2F0aW9uL3VzZXItdmVyaWZpY2F0aW9uLmNvbXBvbmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XHJcbmltcG9ydCB7IEZvcm1CdWlsZGVyLCBGb3JtR3JvdXAgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XHJcbmltcG9ydCB7IEltYWdlUGF0aCwgU2Vzc2lvblN0b3JhZ2UsIE1lc3NhZ2VzLCBOYXZpZ2F0aW9uUm91dGVzLCBQcm9qZWN0QXNzZXQgfSBmcm9tICcuLi8uLi9zaGFyZWQvY29uc3RhbnRzJztcclxuaW1wb3J0IHsgVmFsaWRhdGlvblNlcnZpY2UgfSBmcm9tICcuLi8uLi9zaGFyZWQvY3VzdG9tdmFsaWRhdGlvbnMvdmFsaWRhdGlvbi5zZXJ2aWNlJztcclxuaW1wb3J0IHsgVmVyaWZ5VXNlciB9IGZyb20gJy4uL21vZGVscy92ZXJpZnktdXNlcic7XHJcbmltcG9ydCB7IFVzZXJWZXJpZmljYXRpb25TZXJ2aWNlIH0gZnJvbSAnLi91c2VyLXZlcmlmaWNhdGlvbi5zZXJ2aWNlJztcclxuaW1wb3J0IHsgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2hhcmVkL3NlcnZpY2VzL3Nlc3Npb24uc2VydmljZSc7XHJcbmltcG9ydCB7IE1lc3NhZ2UgfSBmcm9tICcuLi8uLi9zaGFyZWQvbW9kZWxzL21lc3NhZ2UnO1xyXG5pbXBvcnQgeyBNZXNzYWdlU2VydmljZSB9IGZyb20gJy4uLy4uL3NoYXJlZC9zZXJ2aWNlcy9tZXNzYWdlLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBBbmFseXRpY1NlcnZpY2UgfSBmcm9tICcuLi8uLi9zaGFyZWQvc2VydmljZXMvYW5hbHl0aWMuc2VydmljZSc7XHJcbmRlY2xhcmUgdmFyIGZicTogYW55O1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcclxuICBzZWxlY3RvcjogJ2NuLXVzZXItdmVyaWZpY2F0aW9uJyxcclxuICB0ZW1wbGF0ZVVybDogJ3VzZXItdmVyaWZpY2F0aW9uLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsndXNlci12ZXJpZmljYXRpb24uY29tcG9uZW50LmNzcyddLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgVXNlclZlcmlmaWNhdGlvbkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcbiAgbW9kZWwgPSBuZXcgVmVyaWZ5VXNlcigpO1xyXG4gIHVzZXJGb3JtOiBGb3JtR3JvdXA7XHJcbiAgZXJyb3JfbXNnOiBzdHJpbmc7XHJcbiAgaXNTaG93RXJyb3JNZXNzYWdlOiBib29sZWFuID0gdHJ1ZTtcclxuICBpc0NhbmRpZGF0ZTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIGNoa01vYmlsZTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIGlzTWFpbFNlbnQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICBjaGtFbWFpbDogYm9vbGVhbiA9IHRydWU7XHJcbiAgTVlfTE9HT19QQVRIOiBzdHJpbmc7XHJcbiAgTVlfVEFHX0xJTkU6IHN0cmluZztcclxuICBVTkRFUl9MSUNFTkNFOiBzdHJpbmc7XHJcbiAgQk9EWV9CQUNLR1JPVU5EOiBzdHJpbmc7XHJcbiAgc3VibWl0TW9iaWxlU3RhdHVzOiBib29sZWFuO1xyXG4gIHN1Ym1pdEVtYWlsU3RhdHVzOiBib29sZWFuO1xyXG4gIHZlcmlmeVVzZXJNZXNzYWdlXzE6IHN0cmluZz0gTWVzc2FnZXMuTVNHX1ZFUklGWV9VU0VSXzE7XHJcbiAgdmVyaWZ5VXNlck1lc3NhZ2VfMjogc3RyaW5nPSBNZXNzYWdlcy5NU0dfVkVSSUZZX1VTRVJfMjtcclxuICB2ZXJpZnlVc2VyTWVzc2FnZV8zOiBzdHJpbmc9IE1lc3NhZ2VzLk1TR19WRVJJRllfVVNFUl8zO1xyXG4gIHZlcmlmeVVzZXJNZXNzYWdlXzQ6IHN0cmluZz0gTWVzc2FnZXMuTVNHX1ZFUklGWV9VU0VSXzQ7XHJcbiAgaXNTaG93TG9hZGVyOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFuYWx5dGljU2VydmljZTogQW5hbHl0aWNTZXJ2aWNlLCBwcml2YXRlIF9yb3V0ZXI6IFJvdXRlciwgcHJpdmF0ZSBmb3JtQnVpbGRlcjogRm9ybUJ1aWxkZXIsXHJcbiAgICAgICAgICAgICAgcHJpdmF0ZSB2ZXJpZnlVc2VyU2VydmljZTogVXNlclZlcmlmaWNhdGlvblNlcnZpY2UsIHByaXZhdGUgbWVzc2FnZVNlcnZpY2U6IE1lc3NhZ2VTZXJ2aWNlKSB7XHJcblxyXG4gICAgdGhpcy51c2VyRm9ybSA9IHRoaXMuZm9ybUJ1aWxkZXIuZ3JvdXAoe1xyXG4gICAgICAnbW9iaWxlX251bWJlcic6IFsnJywgW1ZhbGlkYXRpb25TZXJ2aWNlLnJlcXVpcmVNb2JpbGVOdW1iZXJWYWxpZGF0b3IsIFZhbGlkYXRpb25TZXJ2aWNlLm1vYmlsZU51bWJlclZhbGlkYXRvcl1dLFxyXG4gICAgICAnZW1haWwnOiBbJycsIFtWYWxpZGF0aW9uU2VydmljZS5yZXF1aXJlRW1haWxWYWxpZGF0b3IsIFZhbGlkYXRpb25TZXJ2aWNlLmVtYWlsVmFsaWRhdG9yXV1cclxuICAgIH0pO1xyXG4gICAgZmJxKCd0cmFjaycsICdQYWdlVmlldycpO1xyXG4gICAgdGhpcy5hbmFseXRpY1NlcnZpY2UuZ29vZ2xlQW5hbHlzZSh0aGlzLl9yb3V0ZXIpO1xyXG4gICAgdGhpcy5NWV9MT0dPX1BBVEggPSBJbWFnZVBhdGguTVlfV0hJVEVfTE9HTztcclxuICAgIHRoaXMuTVlfVEFHX0xJTkUgPSBQcm9qZWN0QXNzZXQuVEFHX0xJTkU7XHJcbiAgICB0aGlzLlVOREVSX0xJQ0VOQ0UgPSBQcm9qZWN0QXNzZXQuVU5ERVJfTElDRU5FQ0U7XHJcbiAgICB0aGlzLkJPRFlfQkFDS0dST1VORCA9IEltYWdlUGF0aC5CT0RZX0JBQ0tHUk9VTkQ7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIHRoaXMubW9kZWwubW9iaWxlX251bWJlciA9IFNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuTU9CSUxFX05VTUJFUik7XHJcbiAgICB0aGlzLm1vZGVsLmVtYWlsID0gU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLmdldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5FTUFJTF9JRCk7XHJcbiAgICBsZXQgdmFsID0gdHJ1ZTtcclxuICAgIGlmICh2YWwgPT0gdHJ1ZSkge1xyXG4gICAgICB0aGlzLmlzQ2FuZGlkYXRlID0gdHJ1ZTtcclxuICAgICAgdGhpcy5jaGtNb2JpbGUgPSBmYWxzZTtcclxuICAgICAgdGhpcy5jaGtFbWFpbCA9IHRydWU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmlzQ2FuZGlkYXRlID0gZmFsc2U7XHJcbiAgICAgIHRoaXMuY2hrTW9iaWxlID0gdHJ1ZTtcclxuICAgICAgdGhpcy5jaGtFbWFpbCA9IGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbmF2aWdhdGVUbygpIHtcclxuICAgIHRoaXMuX3JvdXRlci5uYXZpZ2F0ZShbTmF2aWdhdGlvblJvdXRlcy5BUFBfTE9HSU5dKTtcclxuICB9XHJcblxyXG4gIG9uU3VibWl0KCkge1xyXG4gICAgaWYodGhpcy5pc0NhbmRpZGF0ZSAmJiB0aGlzLnVzZXJGb3JtLnZhbHVlLm1vYmlsZV9udW1iZXIgPT0gJ251bGwnKSB7XHJcbiAgICAgIHRoaXMuc3VibWl0TW9iaWxlU3RhdHVzID0gdHJ1ZTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfWVsc2UgaWYoIXRoaXMuaXNDYW5kaWRhdGUgJiYgdGhpcy51c2VyRm9ybS52YWx1ZS5lbWFpbCA9PSAnbnVsbCcgJiYgIXRoaXMudXNlckZvcm0uZ2V0KCdlbWFpbCcpLnZhbGlkKSB7XHJcbiAgICAgIHRoaXMuc3VibWl0RW1haWxTdGF0dXMgPSB0cnVlO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBpZih0aGlzLmlzQ2FuZGlkYXRlICYmIHRoaXMudXNlckZvcm0udmFsdWUubW9iaWxlX251bWJlciAhPSAnbnVsbCcgJiYgIXRoaXMudXNlckZvcm0uZ2V0KCdtb2JpbGVfbnVtYmVyJykudmFsaWQpIHtcclxuICAgICAgdGhpcy5zdWJtaXRNb2JpbGVTdGF0dXMgPSB0cnVlO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9ZWxzZSBpZighdGhpcy5pc0NhbmRpZGF0ZSAmJiB0aGlzLnVzZXJGb3JtLnZhbHVlLmVtYWlsICE9ICdudWxsJyAmJiAhdGhpcy51c2VyRm9ybS5nZXQoJ2VtYWlsJykudmFsaWQpIHtcclxuICAgICAgdGhpcy5zdWJtaXRFbWFpbFN0YXR1cyA9IHRydWU7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGlmICghdGhpcy5jaGtNb2JpbGUpIHtcclxuICAgICAgdGhpcy5tb2RlbCA9IHRoaXMudXNlckZvcm0udmFsdWU7XHJcbiAgICAgIFNlc3Npb25TdG9yYWdlU2VydmljZS5zZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuTU9CSUxFX05VTUJFUiwgdGhpcy5tb2RlbC5tb2JpbGVfbnVtYmVyKTtcclxuICAgICAgdGhpcy5tb2RlbC5tb2JpbGVfbnVtYmVyID0gU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLmdldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5NT0JJTEVfTlVNQkVSKTtcclxuICAgICAgdGhpcy52ZXJpZnlVc2VyU2VydmljZS52ZXJpZnlVc2VyQnlNb2JpbGUodGhpcy5tb2RlbClcclxuICAgICAgICAuc3Vic2NyaWJlKFxyXG4gICAgICAgICAgcmVzID0+ICh0aGlzLm9uVmVyaWZ5U3VjY2VzcyhyZXMpKSxcclxuICAgICAgICAgIGVycm9yID0+ICh0aGlzLm9uVmVyaWZ5RmFpbHVyZShlcnJvcikpKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMubW9kZWwuZW1haWwgPSBTZXNzaW9uU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkVNQUlMX0lEKTtcclxuICAgICAgdGhpcy5pc1Nob3dMb2FkZXIgPSB0cnVlO1xyXG4gICAgICB0aGlzLnZlcmlmeVVzZXJTZXJ2aWNlLnZlcmlmeVVzZXJCeU1haWwodGhpcy5tb2RlbClcclxuICAgICAgICAuc3Vic2NyaWJlKFxyXG4gICAgICAgICAgcmVzID0+IHtcclxuICAgICAgICAgICAgdGhpcy5vblZlcmlmeVN1Y2Nlc3MocmVzKTtcclxuICAgICAgICAgICAgdGhpcy5pc1Nob3dMb2FkZXIgPSBmYWxzZTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBlcnJvciA9PiAodGhpcy5vblZlcmlmeUZhaWx1cmUoZXJyb3IpKVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBvblZlcmlmeVN1Y2Nlc3MocmVzOiBhbnkpIHtcclxuICAgIGlmICghdGhpcy5jaGtNb2JpbGUpIHtcclxuICAgICAgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLnNldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5WRVJJRllfUEhPTkVfVkFMVUUsICdmcm9tX3JlZ2lzdHJhdGlvbicpO1xyXG4gICAgICB0aGlzLl9yb3V0ZXIubmF2aWdhdGUoW05hdmlnYXRpb25Sb3V0ZXMuVkVSSUZZX1BIT05FXSk7XHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5pc01haWxTZW50ID0gdHJ1ZTtcclxuICAgICAgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLnNldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5DSEFOR0VfTUFJTF9WQUxVRSwgJ2Zyb21fcmVnaXN0cmF0aW9uJyk7XHJcbiAgICAgIHZhciBtZXNzYWdlID0gbmV3IE1lc3NhZ2UoKTtcclxuICAgICAgbWVzc2FnZS5pc0Vycm9yID0gZmFsc2U7XHJcbiAgICAgIG1lc3NhZ2UuY3VzdG9tX21lc3NhZ2UgPSBNZXNzYWdlcy5NU0dfU1VDQ0VTU19NQUlMX1ZFUklGSUNBVElPTjtcclxuICAgICAgdGhpcy5tZXNzYWdlU2VydmljZS5tZXNzYWdlKG1lc3NhZ2UpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgb25WZXJpZnlGYWlsdXJlKGVycm9yOiBhbnkpIHtcclxuICAgIGlmIChlcnJvci5lcnJfY29kZSA9PT0gNDA0IHx8IGVycm9yLmVycl9jb2RlID09PSAwKSB7XHJcbiAgICAgIHZhciBtZXNzYWdlID0gbmV3IE1lc3NhZ2UoKTtcclxuICAgICAgbWVzc2FnZS5lcnJvcl9tc2cgPSBlcnJvci5lcnJfbXNnO1xyXG4gICAgICBtZXNzYWdlLmlzRXJyb3IgPSB0cnVlO1xyXG4gICAgICB0aGlzLm1lc3NhZ2VTZXJ2aWNlLm1lc3NhZ2UobWVzc2FnZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmlzU2hvd0Vycm9yTWVzc2FnZSA9IGZhbHNlO1xyXG4gICAgICB0aGlzLmVycm9yX21zZyA9IGVycm9yLmVycl9tc2c7XHJcblxyXG4gICAgfVxyXG4gIH1cclxuXHJcbn1cclxuIl19
