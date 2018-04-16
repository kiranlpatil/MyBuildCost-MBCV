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
var message_service_1 = require("../../../../shared/services/message.service");
var session_service_1 = require("../../../../shared/services/session.service");
var index_1 = require("../../../../shared/index");
var reset_password_service_1 = require("./reset-password.service");
var constants_1 = require("../../../../shared/constants");
var message_1 = require("../../../../shared/models/message");
var reset_password_1 = require("../../../../user/models/reset-password");
var forms_1 = require("@angular/forms");
var router_1 = require("@angular/router");
var validation_service_1 = require("../../../../shared/customvalidations/validation.service");
var ResetPasswordComponent = (function () {
    function ResetPasswordComponent(activatedRoute, _router, messageService, resetPasswordService, formBuilder) {
        this.activatedRoute = activatedRoute;
        this._router = _router;
        this.messageService = messageService;
        this.resetPasswordService = resetPasswordService;
        this.formBuilder = formBuilder;
        this.isShowErrorMessage = true;
        this.model = new reset_password_1.ResetPassword();
        this.userForm = this.formBuilder.group({
            'new_password': ['', [validation_service_1.ValidationService.requirePasswordValidator, validation_service_1.ValidationService.passwordValidator]],
            'confirm_password': ['', [validation_service_1.ValidationService.requirePasswordValidator]]
        });
        this.MY_LOGO_PATH = constants_1.ImagePath.MY_WHITE_LOGO;
        this.APP_NAME = constants_1.ProjectAsset.APP_NAME;
        this.MY_TAG_LINE = constants_1.ProjectAsset.TAG_LINE;
        this.UNDER_LICENCE = constants_1.ProjectAsset.UNDER_LICENECE;
        this.BODY_BACKGROUND = constants_1.ImagePath.BODY_BACKGROUND;
    }
    ResetPasswordComponent.prototype.ngOnInit = function () {
        this.activatedRoute.queryParams.subscribe(function (params) {
            var access_token = params['access_token'];
            var id = params['_id'];
            session_service_1.SessionStorageService.setSessionValue(index_1.SessionStorage.ACCESS_TOKEN, access_token);
            session_service_1.SessionStorageService.setSessionValue(index_1.SessionStorage.USER_ID, id);
        });
    };
    ResetPasswordComponent.prototype.onSubmit = function () {
        var _this = this;
        if (!this.userForm.valid) {
            this.submitStatus = true;
            return;
        }
        this.model = this.userForm.value;
        if (!this.makePasswordConfirm()) {
            this.resetPasswordService.newPassword(this.model)
                .subscribe(function (res) { return (_this.onNewPasswordSuccess(res)); }, function (error) { return (_this.onNewPasswordFailure(error)); });
        }
    };
    ResetPasswordComponent.prototype.onNewPasswordSuccess = function (res) {
        var message = new message_1.Message();
        message.isError = false;
        message.custom_message = constants_1.Messages.MSG_SUCCESS_RESET_PASSWORD;
        this.messageService.message(message);
        this._router.navigate([index_1.NavigationRoutes.APP_LOGIN]);
    };
    ResetPasswordComponent.prototype.onNewPasswordFailure = function (error) {
        if (error.err_code === 404 || error.err_code === 0) {
            var message = new message_1.Message();
            message.error_msg = error.err_msg;
            message.isError = true;
            this.messageService.message(message);
        }
        else {
            var message = new message_1.Message();
            this.isShowErrorMessage = false;
            this.error_msg = error.err_msg;
            message.error_msg = error.err_msg;
            message.isError = true;
            this.messageService.message(message);
        }
    };
    ResetPasswordComponent.prototype.makePasswordConfirm = function () {
        if (this.model.confirm_password !== this.model.new_password) {
            this.isPasswordConfirm = true;
            return true;
        }
        else {
            this.isPasswordConfirm = false;
            return false;
        }
    };
    ResetPasswordComponent.prototype.getLabels = function () {
        return constants_1.Label;
    };
    ResetPasswordComponent.prototype.getButtons = function () {
        return constants_1.Button;
    };
    ResetPasswordComponent.prototype.getHeadings = function () {
        return constants_1.Headings;
    };
    ResetPasswordComponent.prototype.getMessages = function () {
        return constants_1.Messages;
    };
    ResetPasswordComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'cn-reset-password',
            templateUrl: 'reset-password.component.html',
            styleUrls: ['reset-password.component.css'],
        }),
        __metadata("design:paramtypes", [router_1.ActivatedRoute, router_1.Router, message_service_1.MessageService,
            reset_password_service_1.ResetPasswordService, forms_1.FormBuilder])
    ], ResetPasswordComponent);
    return ResetPasswordComponent;
}());
exports.ResetPasswordComponent = ResetPasswordComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvbG9naW4vZm9yZ290LXBhc3N3b3JkL3Jlc2V0LXBhc3N3b3JkL3Jlc2V0LXBhc3N3b3JkLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHNDQUFrRDtBQUNsRCwrRUFBNkU7QUFDN0UsK0VBQW9GO0FBQ3BGLGtEQUE0RTtBQUM1RSxtRUFBZ0U7QUFDaEUsMERBQTBHO0FBQzFHLDZEQUE0RDtBQUM1RCx5RUFBdUU7QUFDdkUsd0NBQXdEO0FBQ3hELDBDQUFpRTtBQUNqRSw4RkFBNEY7QUFTNUY7SUFlRSxnQ0FBb0IsY0FBOEIsRUFBVSxPQUFlLEVBQVUsY0FBOEIsRUFDL0Ysb0JBQTBDLEVBQVUsV0FBd0I7UUFENUUsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBQVUsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUFVLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUMvRix5QkFBb0IsR0FBcEIsb0JBQW9CLENBQXNCO1FBQVUsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFkaEcsdUJBQWtCLEdBQVksSUFBSSxDQUFDO1FBR25DLFVBQUssR0FBRyxJQUFJLDhCQUFhLEVBQUUsQ0FBQztRQWExQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDO1lBQ3JDLGNBQWMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLHNDQUFpQixDQUFDLHdCQUF3QixFQUFFLHNDQUFpQixDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDdkcsa0JBQWtCLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxzQ0FBaUIsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1NBQ3ZFLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxZQUFZLEdBQUcscUJBQVMsQ0FBQyxhQUFhLENBQUM7UUFDNUMsSUFBSSxDQUFDLFFBQVEsR0FBRyx3QkFBWSxDQUFDLFFBQVEsQ0FBQztRQUN0QyxJQUFJLENBQUMsV0FBVyxHQUFH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cGFzc3dvcmQvcmVzZXQtcGFzc3dvcmQuY29tcG9uZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgTWVzc2FnZVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi9zaGFyZWQvc2VydmljZXMvbWVzc2FnZS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vc2hhcmVkL3NlcnZpY2VzL3Nlc3Npb24uc2VydmljZSc7XHJcbmltcG9ydCB7IFNlc3Npb25TdG9yYWdlLCBOYXZpZ2F0aW9uUm91dGVzIH0gZnJvbSAnLi4vLi4vLi4vLi4vc2hhcmVkL2luZGV4JztcclxuaW1wb3J0IHsgUmVzZXRQYXNzd29yZFNlcnZpY2UgfSBmcm9tICcuL3Jlc2V0LXBhc3N3b3JkLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBJbWFnZVBhdGgsIE1lc3NhZ2VzLCBQcm9qZWN0QXNzZXQsIExhYmVsLCBCdXR0b24sIEhlYWRpbmdzIH0gZnJvbSAnLi4vLi4vLi4vLi4vc2hhcmVkL2NvbnN0YW50cyc7XHJcbmltcG9ydCB7IE1lc3NhZ2UgfSBmcm9tICcuLi8uLi8uLi8uLi9zaGFyZWQvbW9kZWxzL21lc3NhZ2UnO1xyXG5pbXBvcnQgeyBSZXNldFBhc3N3b3JkIH0gZnJvbSAnLi4vLi4vLi4vLi4vdXNlci9tb2RlbHMvcmVzZXQtcGFzc3dvcmQnO1xyXG5pbXBvcnQgeyBGb3JtQnVpbGRlciwgRm9ybUdyb3VwIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSwgUGFyYW1zLCBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xyXG5pbXBvcnQgeyBWYWxpZGF0aW9uU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uL3NoYXJlZC9jdXN0b212YWxpZGF0aW9ucy92YWxpZGF0aW9uLnNlcnZpY2UnO1xyXG5cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIG1vZHVsZUlkOiBtb2R1bGUuaWQsXHJcbiAgc2VsZWN0b3I6ICdjbi1yZXNldC1wYXNzd29yZCcsXHJcbiAgdGVtcGxhdGVVcmw6ICdyZXNldC1wYXNzd29yZC5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJ3Jlc2V0LXBhc3N3b3JkLmNvbXBvbmVudC5jc3MnXSxcclxufSlcclxuZXhwb3J0IGNsYXNzIFJlc2V0UGFzc3dvcmRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gIGVycm9yX21zZzogc3RyaW5nO1xyXG4gIGlzU2hvd0Vycm9yTWVzc2FnZTogYm9vbGVhbiA9IHRydWU7XHJcbiAgdG9rZW46IHN0cmluZztcclxuICBpZDogc3RyaW5nO1xyXG4gIG1vZGVsID0gbmV3IFJlc2V0UGFzc3dvcmQoKTtcclxuICB1c2VyRm9ybTogRm9ybUdyb3VwO1xyXG4gIGlzUGFzc3dvcmRDb25maXJtOiBib29sZWFuO1xyXG4gIE1ZX0xPR09fUEFUSDogc3RyaW5nO1xyXG4gIEFQUF9OQU1FOiBzdHJpbmc7XHJcbiAgTVlfVEFHX0xJTkU6IHN0cmluZztcclxuICBVTkRFUl9MSUNFTkNFOiBzdHJpbmc7XHJcbiAgQk9EWV9CQUNLR1JPVU5EOiBzdHJpbmc7XHJcbiAgc3VibWl0U3RhdHVzOiBib29sZWFuO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFjdGl2YXRlZFJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSwgcHJpdmF0ZSBfcm91dGVyOiBSb3V0ZXIsIHByaXZhdGUgbWVzc2FnZVNlcnZpY2U6IE1lc3NhZ2VTZXJ2aWNlLFxyXG4gICAgICAgICAgICAgIHByaXZhdGUgcmVzZXRQYXNzd29yZFNlcnZpY2U6IFJlc2V0UGFzc3dvcmRTZXJ2aWNlLCBwcml2YXRlIGZvcm1CdWlsZGVyOiBGb3JtQnVpbGRlcikge1xyXG5cclxuICAgIHRoaXMudXNlckZvcm0gPSB0aGlzLmZvcm1CdWlsZGVyLmdyb3VwKHtcclxuICAgICAgJ25ld19wYXNzd29yZCc6IFsnJywgW1ZhbGlkYXRpb25TZXJ2aWNlLnJlcXVpcmVQYXNzd29yZFZhbGlkYXRvciwgVmFsaWRhdGlvblNlcnZpY2UucGFzc3dvcmRWYWxpZGF0b3JdXSxcclxuICAgICAgJ2NvbmZpcm1fcGFzc3dvcmQnOiBbJycsIFtWYWxpZGF0aW9uU2VydmljZS5yZXF1aXJlUGFzc3dvcmRWYWxpZGF0b3JdXVxyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5NWV9MT0dPX1BBVEggPSBJbWFnZVBhdGguTVlfV0hJVEVfTE9HTztcclxuICAgIHRoaXMuQVBQX05BTUUgPSBQcm9qZWN0QXNzZXQuQVBQX05BTUU7XHJcbiAgICB0aGlzLk1ZX1RBR19MSU5FID0gUHJvamVjdEFzc2V0LlRBR19MSU5FO1xyXG4gICAgdGhpcy5VTkRFUl9MSUNFTkNFID0gUHJvamVjdEFzc2V0LlVOREVSX0xJQ0VORUNFO1xyXG4gICAgdGhpcy5CT0RZX0JBQ0tHUk9VTkQgPSBJbWFnZVBhdGguQk9EWV9CQUNLR1JPVU5EO1xyXG4gIH1cclxuXHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG5cclxuICAgIHRoaXMuYWN0aXZhdGVkUm91dGUucXVlcnlQYXJhbXMuc3Vic2NyaWJlKChwYXJhbXM6IFBhcmFtcykgPT4ge1xyXG4gICAgICBsZXQgYWNjZXNzX3Rva2VuID0gcGFyYW1zWydhY2Nlc3NfdG9rZW4nXTtcclxuICAgICAgbGV0IGlkID0gcGFyYW1zWydfaWQnXTtcclxuICAgICAgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLnNldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5BQ0NFU1NfVE9LRU4sIGFjY2Vzc190b2tlbik7XHJcbiAgICAgIFNlc3Npb25TdG9yYWdlU2VydmljZS5zZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuVVNFUl9JRCwgaWQpO1xyXG4gICAgfSk7XHJcblxyXG4gIH1cclxuXHJcbiAgb25TdWJtaXQoKSB7XHJcbiAgICBpZiAoIXRoaXMudXNlckZvcm0udmFsaWQpIHtcclxuICAgICAgdGhpcy5zdWJtaXRTdGF0dXMgPSB0cnVlO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB0aGlzLm1vZGVsID0gdGhpcy51c2VyRm9ybS52YWx1ZTtcclxuICAgIGlmICghdGhpcy5tYWtlUGFzc3dvcmRDb25maXJtKCkpIHtcclxuICAgICAgdGhpcy5yZXNldFBhc3N3b3JkU2VydmljZS5uZXdQYXNzd29yZCh0aGlzLm1vZGVsKVxyXG4gICAgICAgIC5zdWJzY3JpYmUoXHJcbiAgICAgICAgICByZXMgPT4gKHRoaXMub25OZXdQYXNzd29yZFN1Y2Nlc3MocmVzKSksXHJcbiAgICAgICAgICBlcnJvciA9PiAodGhpcy5vbk5ld1Bhc3N3b3JkRmFpbHVyZShlcnJvcikpKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG9uTmV3UGFzc3dvcmRTdWNjZXNzKHJlczogYW55KSB7XHJcbiAgICB2YXIgbWVzc2FnZSA9IG5ldyBNZXNzYWdlKCk7XHJcbiAgICBtZXNzYWdlLmlzRXJyb3IgPSBmYWxzZTtcclxuICAgIG1lc3NhZ2UuY3VzdG9tX21lc3NhZ2UgPSBNZXNzYWdlcy5NU0dfU1VDQ0VTU19SRVNFVF9QQVNTV09SRDtcclxuICAgIHRoaXMubWVzc2FnZVNlcnZpY2UubWVzc2FnZShtZXNzYWdlKTtcclxuICAgIHRoaXMuX3JvdXRlci5uYXZpZ2F0ZShbTmF2aWdhdGlvblJvdXRlcy5BUFBfTE9HSU5dKTtcclxuXHJcbiAgfVxyXG5cclxuICBvbk5ld1Bhc3N3b3JkRmFpbHVyZShlcnJvcjogYW55KSB7XHJcbiAgICBpZiAoZXJyb3IuZXJyX2NvZGUgPT09IDQwNCB8fCBlcnJvci5lcnJfY29kZSA9PT0gMCkge1xyXG4gICAgICB2YXIgbWVzc2FnZSA9IG5ldyBNZXNzYWdlKCk7XHJcbiAgICAgIG1lc3NhZ2UuZXJyb3JfbXNnID0gZXJyb3IuZXJyX21zZztcclxuICAgICAgbWVzc2FnZS5pc0Vycm9yID0gdHJ1ZTtcclxuICAgICAgdGhpcy5tZXNzYWdlU2VydmljZS5tZXNzYWdlKG1lc3NhZ2UpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdmFyIG1lc3NhZ2UgPSBuZXcgTWVzc2FnZSgpO1xyXG4gICAgICB0aGlzLmlzU2hvd0Vycm9yTWVzc2FnZSA9IGZhbHNlO1xyXG4gICAgICB0aGlzLmVycm9yX21zZyA9IGVycm9yLmVycl9tc2c7XHJcbiAgICAgIG1lc3NhZ2UuZXJyb3JfbXNnID0gZXJyb3IuZXJyX21zZztcclxuICAgICAgbWVzc2FnZS5pc0Vycm9yID0gdHJ1ZTtcclxuICAgICAgdGhpcy5tZXNzYWdlU2VydmljZS5tZXNzYWdlKG1lc3NhZ2UpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbWFrZVBhc3N3b3JkQ29uZmlybSgpOiBib29sZWFuIHtcclxuICAgIGlmICh0aGlzLm1vZGVsLmNvbmZpcm1fcGFzc3dvcmQgIT09IHRoaXMubW9kZWwubmV3X3Bhc3N3b3JkKSB7XHJcbiAgICAgIHRoaXMuaXNQYXNzd29yZENvbmZpcm0gPSB0cnVlO1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuaXNQYXNzd29yZENvbmZpcm0gPSBmYWxzZTtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuICBnZXRMYWJlbHMoKSB7XHJcbiAgICByZXR1cm4gTGFiZWw7XHJcbiAgfVxyXG4gIGdldEJ1dHRvbnMoKSB7XHJcbiAgICByZXR1cm4gQnV0dG9uO1xyXG4gIH1cclxuICBnZXRIZWFkaW5ncygpIHtcclxuICAgIHJldHVybiBIZWFkaW5ncztcclxuICB9XHJcbiAgZ2V0TWVzc2FnZXMoKSB7XHJcbiAgICByZXR1cm4gTWVzc2FnZXM7XHJcbiAgfVxyXG5cclxufVxyXG5cclxuIl19
