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
var user_change_password_service_1 = require("./user-change-password.service");
var index_1 = require("../../../shared/index");
var forms_1 = require("@angular/forms");
var loaders_service_1 = require("../../../shared/loader/loaders.service");
var validation_service_1 = require("../../../shared/customvalidations/validation.service");
var constants_1 = require("../../../shared/constants");
var error_service_1 = require("../../../shared/services/error.service");
var router_1 = require("@angular/router");
var user_1 = require("../../../user/models/user");
var change_password_1 = require("../../../user/models/change-password");
var UserChangePasswordComponent = (function () {
    function UserChangePasswordComponent(_router, activatedRoute, errorService, commonService, passwordService, messageService, formBuilder, loaderService) {
        this._router = _router;
        this.activatedRoute = activatedRoute;
        this.errorService = errorService;
        this.commonService = commonService;
        this.passwordService = passwordService;
        this.messageService = messageService;
        this.formBuilder = formBuilder;
        this.loaderService = loaderService;
        this.model = new change_password_1.ChangePassword();
        this.isShowErrorMessage = true;
        this.showModalStyle = false;
        this.userModel = new user_1.UserProfile();
        this.userForm = this.formBuilder.group({
            'new_password': ['', [validation_service_1.ValidationService.passwordValidator]],
            'confirm_password': ['', [validation_service_1.ValidationService.requireConfirmPasswordValidator, validation_service_1.ValidationService.passwordValidator]],
            'current_password': ['', [validation_service_1.ValidationService.requireCurrentPasswordValidator, validation_service_1.ValidationService.passwordValidator]]
        });
        this.PASSWORD_ICON = index_1.ImagePath.PASSWORD_ICON_GREY;
        this.NEW_PASSWORD_ICON = index_1.ImagePath.NEW_PASSWORD_ICON_GREY;
        this.CONFIRM_PASSWORD_ICON = index_1.ImagePath.CONFIRM_PASSWORD_ICON_GREY;
    }
    UserChangePasswordComponent.prototype.makePasswordConfirm = function () {
        if (this.model.confirm_password !== this.model.new_password) {
            this.isPasswordConfirm = true;
            return true;
        }
        else {
            this.isPasswordConfirm = false;
            return false;
        }
    };
    UserChangePasswordComponent.prototype.onSubmit = function () {
        var _this = this;
        this.model = this.userForm.value;
        if (!this.userForm.valid) {
            return;
        }
        if (!this.makePasswordConfirm()) {
            this.loaderService.start();
            this.passwordService.changePassword(this.model)
                .subscribe(function (body) { return _this.onChangePasswordSuccess(body); }, function (error) { return _this.onChangePasswordFailure(error); });
        }
        document.body.scrollTop = 0;
    };
    UserChangePasswordComponent.prototype.onChangePasswordSuccess = function (body) {
        this.loaderService.stop();
        this.showHideModal();
        this.error_msg = '';
    };
    UserChangePasswordComponent.prototype.onChangePasswordFailure = function (error) {
        this.loaderService.stop();
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
    UserChangePasswordComponent.prototype.goBack = function () {
        this.commonService.goBack();
    };
    UserChangePasswordComponent.prototype.showHideModal = function () {
        this.showModalStyle = !this.showModalStyle;
    };
    UserChangePasswordComponent.prototype.moveToDashboard = function () {
        this._router.navigate([constants_1.NavigationRoutes.APP_DASHBOARD]);
    };
    UserChangePasswordComponent.prototype.logOut = function () {
        this._router.navigate([constants_1.NavigationRoutes.APP_LOGIN]);
    };
    UserChangePasswordComponent.prototype.getStyle = function () {
        if (this.showModalStyle) {
            return 'block';
        }
        else {
            return 'none';
        }
    };
    UserChangePasswordComponent.prototype.getMessages = function () {
        return constants_1.Messages;
    };
    UserChangePasswordComponent.prototype.getLabels = function () {
        return constants_1.Label;
    };
    UserChangePasswordComponent.prototype.getButtons = function () {
        return constants_1.Button;
    };
    UserChangePasswordComponent.prototype.getHeadings = function () {
        return constants_1.Headings;
    };
    UserChangePasswordComponent.prototype.OnCandidateDataSuccess = function (candidateData) {
        this.model = candidateData.data[0];
    };
    UserChangePasswordComponent.prototype.goToDashboard = function () {
        this._router.navigate([constants_1.NavigationRoutes.APP_DASHBOARD]);
    };
    UserChangePasswordComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'dashboard-change-password',
            templateUrl: 'user-change-password.component.html',
            styleUrls: ['user-change-password.component.css'],
        }),
        __metadata("design:paramtypes", [router_1.Router, router_1.ActivatedRoute, error_service_1.ErrorService,
            index_1.CommonService, user_change_password_service_1.UserChangePasswordService,
            index_1.MessageService, forms_1.FormBuilder,
            loaders_service_1.LoaderService])
    ], UserChangePasswordComponent);
    return UserChangePasswordComponent;
}());
exports.UserChangePasswordComponent = UserChangePasswordComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGFzaGJvYXJkL3VzZXItY2hhbmdlLXBhc3N3b3JkL3VzZXItY2hhbmdlLXBhc3N3b3JkLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHNDQUEwQztBQUMxQywrRUFBMkU7QUFDM0UsK0NBQTBGO0FBQzFGLHdDQUF3RDtBQUN4RCwwRUFBdUU7QUFDdkUsMkZBQXlGO0FBQ3pGLHVEQUEwSDtBQUMxSCx3RUFBc0U7QUFDdEUsMENBQXlEO0FBQ3pELGtEQUF3RDtBQUN4RCx3RUFBc0U7QUFTdEU7SUFhRSxxQ0FBb0IsT0FBZSxFQUFVLGNBQThCLEVBQVUsWUFBMEIsRUFDM0YsYUFBNEIsRUFBVSxlQUEwQyxFQUNoRixjQUE4QixFQUFVLFdBQXdCLEVBQ2hFLGFBQTRCO1FBSDVCLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFBVSxtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFBVSxpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUMzRixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUFVLG9CQUFlLEdBQWYsZUFBZSxDQUEyQjtRQUNoRixtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFBVSxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUNoRSxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQWRoRCxVQUFLLEdBQUcsSUFBSSxnQ0FBYyxFQUFFLENBQUM7UUFHN0IsdUJBQWtCLEdBQVksSUFBSSxDQUFDO1FBQ25DLG1CQUFjLEdBQVksS0FBSyxDQUFDO1FBSWhDLGNBQVMsR0FBaUIsSUFBSSxrQkFBVyxFQUFFLENBQUM7UUFRMUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQztZQUNyQyxjQUFjLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxzQ0FBaUIsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQzNELGtCQUFrQixFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsc0NBQWlCLENBQUMs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QTNIWSwyQkFBMkI7UUFQdkMsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNuQixRQUFRLEVBQUUsMkJBQTJCO1lBQ3JDLFdBQVcsRUFBRSxxQ0FBcUM7WUFDbEQsU0FBUyxFQUFFLENBQUMsb0NBQW9DLENBQUM7U0FDbEQsQ0FBQzt5Q0FlNkIsZUFBTSxFQUEwQix1QkFBYyxFQUF3Qiw0QkFBWTtZQUM1RSxxQkFBYSxFQUEyQix3REFBeUI7WUFDaEUsc0JBQWMsRUFBdUIsbUJBQVc7WUFDakQsK0JBQWE7T0FoQnJDLDJCQUEyQixDQTZIdkM7SUFBRCxrQ0FBQztDQTdIRCxBQTZIQyxJQUFBO0FBN0hZLGtFQUEyQiIsImZpbGUiOiJhcHAvZnJhbWV3b3JrL2Rhc2hib2FyZC91c2VyLWNoYW5nZS1wYXNzd29yZC91c2VyLWNoYW5nZS1wYXNzd29yZC5jb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgVXNlckNoYW5nZVBhc3N3b3JkU2VydmljZSB9IGZyb20gJy4vdXNlci1jaGFuZ2UtcGFzc3dvcmQuc2VydmljZSc7XHJcbmltcG9ydCB7IENvbW1vblNlcnZpY2UsIEltYWdlUGF0aCwgTWVzc2FnZSwgTWVzc2FnZVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zaGFyZWQvaW5kZXgnO1xyXG5pbXBvcnQgeyBGb3JtQnVpbGRlciwgRm9ybUdyb3VwIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5pbXBvcnQgeyBMb2FkZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vc2hhcmVkL2xvYWRlci9sb2FkZXJzLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBWYWxpZGF0aW9uU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NoYXJlZC9jdXN0b212YWxpZGF0aW9ucy92YWxpZGF0aW9uLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBBcHBTZXR0aW5ncywgTWVzc2FnZXMsIExhYmVsLCBCdXR0b24sIEhlYWRpbmdzLCBOYXZpZ2F0aW9uUm91dGVzLExvY2FsU3RvcmFnZSB9IGZyb20gJy4uLy4uLy4uL3NoYXJlZC9jb25zdGFudHMnO1xyXG5pbXBvcnQgeyBFcnJvclNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zaGFyZWQvc2VydmljZXMvZXJyb3Iuc2VydmljZSc7XHJcbmltcG9ydCB7IEFjdGl2YXRlZFJvdXRlLCBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xyXG5pbXBvcnQgeyBVc2VyUHJvZmlsZSB9IGZyb20gJy4uLy4uLy4uL3VzZXIvbW9kZWxzL3VzZXInO1xyXG5pbXBvcnQgeyBDaGFuZ2VQYXNzd29yZCB9IGZyb20gJy4uLy4uLy4uL3VzZXIvbW9kZWxzL2NoYW5nZS1wYXNzd29yZCc7XHJcbmltcG9ydCB7IExvY2FsU3RvcmFnZVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zaGFyZWQvc2VydmljZXMvbG9jYWwtc3RvcmFnZS5zZXJ2aWNlJztcclxuQENvbXBvbmVudCh7XHJcbiAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcclxuICBzZWxlY3RvcjogJ2Rhc2hib2FyZC1jaGFuZ2UtcGFzc3dvcmQnLFxyXG4gIHRlbXBsYXRlVXJsOiAndXNlci1jaGFuZ2UtcGFzc3dvcmQuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWyd1c2VyLWNoYW5nZS1wYXNzd29yZC5jb21wb25lbnQuY3NzJ10sXHJcbn0pXHJcblxyXG5leHBvcnQgY2xhc3MgVXNlckNoYW5nZVBhc3N3b3JkQ29tcG9uZW50IHtcclxuICBpc1Bhc3N3b3JkQ29uZmlybTogYm9vbGVhbjtcclxuICBtb2RlbCA9IG5ldyBDaGFuZ2VQYXNzd29yZCgpO1xyXG4gIHVzZXJGb3JtOiBGb3JtR3JvdXA7XHJcbiAgZXJyb3JfbXNnOiBzdHJpbmc7XHJcbiAgaXNTaG93RXJyb3JNZXNzYWdlOiBib29sZWFuID0gdHJ1ZTtcclxuICBzaG93TW9kYWxTdHlsZTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIFBBU1NXT1JEX0lDT046IHN0cmluZztcclxuICBORVdfUEFTU1dPUkRfSUNPTjogc3RyaW5nO1xyXG4gIENPTkZJUk1fUEFTU1dPUkRfSUNPTjogc3RyaW5nO1xyXG4gIHVzZXJNb2RlbCA6IFVzZXJQcm9maWxlID0gbmV3IFVzZXJQcm9maWxlKCk7XHJcbiAgcm9sZTogc3RyaW5nO1xyXG4gIGlzU29jaWFsTG9naW46Ym9vbGVhbjtcclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9yb3V0ZXI6IFJvdXRlciwgcHJpdmF0ZSBhY3RpdmF0ZWRSb3V0ZTogQWN0aXZhdGVkUm91dGUsIHByaXZhdGUgZXJyb3JTZXJ2aWNlOiBFcnJvclNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgcHJpdmF0ZSBjb21tb25TZXJ2aWNlOiBDb21tb25TZXJ2aWNlLCBwcml2YXRlIHBhc3N3b3JkU2VydmljZTogVXNlckNoYW5nZVBhc3N3b3JkU2VydmljZSxcclxuICAgICAgICAgICAgICBwcml2YXRlIG1lc3NhZ2VTZXJ2aWNlOiBNZXNzYWdlU2VydmljZSwgcHJpdmF0ZSBmb3JtQnVpbGRlcjogRm9ybUJ1aWxkZXIsXHJcbiAgICAgICAgICAgICAgcHJpdmF0ZSBsb2FkZXJTZXJ2aWNlOiBMb2FkZXJTZXJ2aWNlKSB7XHJcblxyXG4gICAgdGhpcy51c2VyRm9ybSA9IHRoaXMuZm9ybUJ1aWxkZXIuZ3JvdXAoe1xyXG4gICAgICAnbmV3X3Bhc3N3b3JkJzogWycnLCBbVmFsaWRhdGlvblNlcnZpY2UucGFzc3dvcmRWYWxpZGF0b3JdXSxcclxuICAgICAgJ2NvbmZpcm1fcGFzc3dvcmQnOiBbJycsIFtWYWxpZGF0aW9uU2VydmljZS5yZXF1aXJlQ29uZmlybVBhc3N3b3JkVmFsaWRhdG9yLCBWYWxpZGF0aW9uU2VydmljZS5wYXNzd29yZFZhbGlkYXRvcl1dLFxyXG4gICAgICAnY3VycmVudF9wYXNzd29yZCc6IFsnJywgW1ZhbGlkYXRpb25TZXJ2aWNlLnJlcXVpcmVDdXJyZW50UGFzc3dvcmRWYWxpZGF0b3IsIFZhbGlkYXRpb25TZXJ2aWNlLnBhc3N3b3JkVmFsaWRhdG9yXV1cclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuUEFTU1dPUkRfSUNPTiA9IEltYWdlUGF0aC5QQVNTV09SRF9JQ09OX0dSRVk7XHJcbiAgICB0aGlzLk5FV19QQVNTV09SRF9JQ09OID0gSW1hZ2VQYXRoLk5FV19QQVNTV09SRF9JQ09OX0dSRVk7XHJcbiAgICB0aGlzLkNPTkZJUk1fUEFTU1dPUkRfSUNPTiA9IEltYWdlUGF0aC5DT05GSVJNX1BBU1NXT1JEX0lDT05fR1JFWTtcclxuICB9XHJcblxyXG4gIG1ha2VQYXNzd29yZENvbmZpcm0oKTogYm9vbGVhbiB7XHJcbiAgICBpZiAodGhpcy5tb2RlbC5jb25maXJtX3Bhc3N3b3JkICE9PSB0aGlzLm1vZGVsLm5ld19wYXNzd29yZCkge1xyXG4gICAgICB0aGlzLmlzUGFzc3dvcmRDb25maXJtID0gdHJ1ZTtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmlzUGFzc3dvcmRDb25maXJtID0gZmFsc2U7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG9uU3VibWl0KCkge1xyXG4gICAgdGhpcy5tb2RlbCA9IHRoaXMudXNlckZvcm0udmFsdWU7XHJcbiAgICBpZiAoIXRoaXMudXNlckZvcm0udmFsaWQpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgaWYgKCF0aGlzLm1ha2VQYXNzd29yZENvbmZpcm0oKSkge1xyXG4gICAgICB0aGlzLmxvYWRlclNlcnZpY2Uuc3RhcnQoKTtcclxuICAgICAgdGhpcy5wYXNzd29yZFNlcnZpY2UuY2hhbmdlUGFzc3dvcmQodGhpcy5tb2RlbClcclxuICAgICAgICAuc3Vic2NyaWJlKFxyXG4gICAgICAgICAgYm9keSA9PiB0aGlzLm9uQ2hhbmdlUGFzc3dvcmRTdWNjZXNzKGJvZHkpLFxyXG4gICAgICAgICAgZXJyb3IgPT4gdGhpcy5vbkNoYW5nZVBhc3N3b3JkRmFpbHVyZShlcnJvcikpO1xyXG4gICAgfVxyXG4gICAgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgPSAwO1xyXG4gIH1cclxuXHJcbiAgb25DaGFuZ2VQYXNzd29yZFN1Y2Nlc3MoYm9keTogQ2hhbmdlUGFzc3dvcmQpIHtcclxuICAgIHRoaXMubG9hZGVyU2VydmljZS5zdG9wKCk7XHJcbiAgICB0aGlzLnNob3dIaWRlTW9kYWwoKTtcclxuICAgIHRoaXMuZXJyb3JfbXNnID0gJyc7XHJcbiAgfVxyXG5cclxuICBvbkNoYW5nZVBhc3N3b3JkRmFpbHVyZShlcnJvcjogYW55KSB7XHJcbiAgICB0aGlzLmxvYWRlclNlcnZpY2Uuc3RvcCgpO1xyXG4gICAgaWYgKGVycm9yLmVycl9jb2RlID09PSA0MDQgfHwgZXJyb3IuZXJyX2NvZGUgPT09IDApIHtcclxuICAgICAgdmFyIG1lc3NhZ2UgPSBuZXcgTWVzc2FnZSgpO1xyXG4gICAgICBtZXNzYWdlLmVycm9yX21zZyA9IGVycm9yLmVycl9tc2c7XHJcbiAgICAgIG1lc3NhZ2UuaXNFcnJvciA9IHRydWU7XHJcbiAgICAgIHRoaXMubWVzc2FnZVNlcnZpY2UubWVzc2FnZShtZXNzYWdlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuaXNTaG93RXJyb3JNZXNzYWdlID0gZmFsc2U7XHJcbiAgICAgIHRoaXMuZXJyb3JfbXNnID0gZXJyb3IuZXJyX21zZztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdvQmFjaygpIHtcclxuICAgIHRoaXMuY29tbW9uU2VydmljZS5nb0JhY2soKTtcclxuICB9XHJcblxyXG4gIHNob3dIaWRlTW9kYWwoKSB7XHJcbiAgICB0aGlzLnNob3dNb2RhbFN0eWxlID0gIXRoaXMuc2hvd01vZGFsU3R5bGU7XHJcbiAgfVxyXG4gIG1vdmVUb0Rhc2hib2FyZCgpIHtcclxuICAgIHRoaXMuX3JvdXRlci5uYXZpZ2F0ZShbTmF2aWdhdGlvblJvdXRlcy5BUFBfREFTSEJPQVJEXSk7XHJcbiAgfVxyXG4gIGxvZ091dCgpIHtcclxuICAgLyogaWYoTG9jYWxTdG9yYWdlU2VydmljZS5nZXRMb2NhbFZhbHVlKExvY2FsU3RvcmFnZS5JU19MT0dHRURfSU4pPT09bnVsbCkge1xyXG4gICAgICB3aW5kb3cuc2Vzc2lvblN0b3JhZ2UuY2xlYXIoKTtcclxuICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5jbGVhcigpO1xyXG4gICAgfVxyXG4gICAgbGV0IGhvc3QgPSBBcHBTZXR0aW5ncy5IVFRQX0NMSUVOVCArIEFwcFNldHRpbmdzLkhPU1RfTkFNRTtcclxuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gaG9zdDsqL1xyXG4gICAgdGhpcy5fcm91dGVyLm5hdmlnYXRlKFtOYXZpZ2F0aW9uUm91dGVzLkFQUF9MT0dJTl0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0U3R5bGUoKSB7XHJcbiAgICBpZiAodGhpcy5zaG93TW9kYWxTdHlsZSkge1xyXG4gICAgICByZXR1cm4gJ2Jsb2NrJztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiAnbm9uZSc7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXRNZXNzYWdlcygpIHtcclxuICAgIHJldHVybiBNZXNzYWdlcztcclxuICB9XHJcblxyXG4gIGdldExhYmVscygpIHtcclxuICAgIHJldHVybiBMYWJlbDtcclxuICB9XHJcblxyXG4gIGdldEJ1dHRvbnMoKSB7XHJcbiAgICByZXR1cm4gQnV0dG9uO1xyXG4gIH1cclxuXHJcbiAgZ2V0SGVhZGluZ3MoKSB7XHJcbiAgICByZXR1cm4gSGVhZGluZ3M7XHJcbiAgfVxyXG5cclxuICBPbkNhbmRpZGF0ZURhdGFTdWNjZXNzKGNhbmRpZGF0ZURhdGE6IGFueSkge1xyXG4gICAgdGhpcy5tb2RlbCA9IGNhbmRpZGF0ZURhdGEuZGF0YVswXTtcclxuICB9XHJcblxyXG4gIGdvVG9EYXNoYm9hcmQoKSAge1xyXG4gIHRoaXMuX3JvdXRlci5uYXZpZ2F0ZShbTmF2aWdhdGlvblJvdXRlcy5BUFBfREFTSEJPQVJEXSk7XHJcbn1cclxuXHJcbn1cclxuIl19
