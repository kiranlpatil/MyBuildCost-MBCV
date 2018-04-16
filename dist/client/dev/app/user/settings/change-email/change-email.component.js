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
var change_email_service_1 = require("./change-email.service");
var change_email_1 = require("../../models/change-email");
var session_service_1 = require("../../../shared/services/session.service");
var constants_1 = require("../../../shared/constants");
var index_1 = require("../../../shared/index");
var forms_1 = require("@angular/forms");
var validation_service_1 = require("../../../shared/customvalidations/validation.service");
var ChangeEmailComponent = (function () {
    function ChangeEmailComponent(commonService, _router, emailService, messageService, formBuilder) {
        this.commonService = commonService;
        this._router = _router;
        this.emailService = emailService;
        this.messageService = messageService;
        this.formBuilder = formBuilder;
        this.onEmailChangeSuccess = new core_1.EventEmitter();
        this.model = new change_email_1.ChangeEmail();
        this.isShowErrorMessage = true;
        this.emailNotMatctMessage = index_1.Messages.MSG_EMAIL_NOT_MATCH;
        this.userForm = this.formBuilder.group({
            'new_email': ['', [forms_1.Validators.required, validation_service_1.ValidationService.emailValidator]],
            'confirm_email': ['', [forms_1.Validators.required, validation_service_1.ValidationService.emailValidator]],
            'current_email': ['', [forms_1.Validators.required, validation_service_1.ValidationService.emailValidator]]
        });
        this.EMAIL_ICON = index_1.ImagePath.EMAIL_ICON_GREY;
        this.NEW_EMAIL_ICON = index_1.ImagePath.NEW_EMAIL_ICON_GREY;
        this.CONFIRM_EMAIL_ICON = index_1.ImagePath.CONFIRM_EMAIL_ICON_GREY;
    }
    ChangeEmailComponent.prototype.makeEmailConfirm = function () {
        if (this.model.confirm_email !== this.model.new_email) {
            this.isEmailConfirm = true;
            return true;
        }
        else {
            this.isEmailConfirm = false;
            return false;
        }
    };
    ChangeEmailComponent.prototype.ngOnInit = function () {
        this.model.current_email = session_service_1.SessionStorageService.getSessionValue(constants_1.SessionStorage.EMAIL_ID);
    };
    ChangeEmailComponent.prototype.onSubmit = function () {
        var _this = this;
        this.model = this.userForm.value;
        this.model.current_email = session_service_1.SessionStorageService.getSessionValue(constants_1.SessionStorage.EMAIL_ID);
        session_service_1.SessionStorageService.setSessionValue(constants_1.SessionStorage.CHANGE_MAIL_VALUE, 'from_settings');
        if (!this.makeEmailConfirm()) {
            this.emailService.changeEmail(this.model)
                .subscribe(function (body) { return _this.onChangeEmailSuccess(body); }, function (error) { return _this.onChangeEmailFailure(error); });
        }
        document.body.scrollTop = 0;
    };
    ChangeEmailComponent.prototype.onChangeEmailSuccess = function (body) {
        session_service_1.SessionStorageService.setSessionValue(constants_1.SessionStorage.CHANGE_MAIL_VALUE, 'from_settings');
        this.userForm.reset();
        this.onEmailChangeSuccess.emit();
        var message = new index_1.Message();
        message.isError = false;
        message.custom_message = index_1.Messages.MSG_SUCCESS_CHANGE_EMAIL;
        this.messageService.message(message);
    };
    ChangeEmailComponent.prototype.onChangeEmailFailure = function (error) {
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
    ChangeEmailComponent.prototype.goBack = function () {
        this.commonService.goBack();
    };
    ChangeEmailComponent.prototype.logOut = function () {
        window.sessionStorage.clear();
        window.localStorage.clear();
        session_service_1.SessionStorageService.setSessionValue(constants_1.SessionStorage.CHANGE_MAIL_VALUE, 'from_settings');
        var host = constants_1.AppSettings.HTTP_CLIENT + constants_1.AppSettings.HOST_NAME;
        window.location.href = host;
    };
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], ChangeEmailComponent.prototype, "onEmailChangeSuccess", void 0);
    ChangeEmailComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'cn-change-email',
            templateUrl: 'change-email.component.html',
            styleUrls: ['change-email.component.css'],
        }),
        __metadata("design:paramtypes", [index_1.CommonService, router_1.Router,
            change_email_service_1.ChangeEmailService, index_1.MessageService, forms_1.FormBuilder])
    ], ChangeEmailComponent);
    return ChangeEmailComponent;
}());
exports.ChangeEmailComponent = ChangeEmailComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC91c2VyL3NldHRpbmdzL2NoYW5nZS1lbWFpbC9jaGFuZ2UtZW1haWwuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsc0NBQXdFO0FBQ3hFLDBDQUF5QztBQUN6QywrREFBNEQ7QUFDNUQsMERBQXdEO0FBQ3hELDRFQUFpRjtBQUNqRix1REFBd0U7QUFDeEUsK0NBQW9HO0FBQ3BHLHdDQUFvRTtBQUNwRSwyRkFBeUY7QUFVekY7SUFhRSw4QkFBb0IsYUFBNEIsRUFBVSxPQUFlLEVBQ3JELFlBQWdDLEVBQVUsY0FBOEIsRUFBVSxXQUF3QjtRQUQxRyxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUFVLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFDckQsaUJBQVksR0FBWixZQUFZLENBQW9CO1FBQVUsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBQVUsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFicEgseUJBQW9CLEdBQTBCLElBQUksbUJBQVksRUFBRSxDQUFDO1FBRzNFLFVBQUssR0FBRyxJQUFJLDBCQUFXLEVBQUUsQ0FBQztRQUcxQix1QkFBa0IsR0FBWSxJQUFJLENBQUM7UUFJbkMseUJBQW9CLEdBQVMsZ0JBQVEsQ0FBQyxtQkFBbUIsQ0FBQztRQUt4RCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDO1lBQ3JDLFdBQVcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLGtCQUFVLENBQUMsUUFBUSxFQUFFLHNDQUFpQixDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQzFFLGVBQWUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLGtCQUFVLENBQUMsUUFBUSxFQUFFLHNDQUFpQixDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQzlFLGVBQWUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLGtCQUFVLENBQUMsUUFBUSxFQUFFLHNDQUFpQixDQUFDLGNBQWMsQ0FBQyxDQUFDO1NBQy9FLENBQUMs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Q0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sSUFBSSxDQUFDLGtCQUFrQixHQUFHLEtBQUssQ0FBQztZQUNoQyxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFDakMsQ0FBQztJQUNILENBQUM7SUFFRCxxQ0FBTSxHQUFOO1FBQ0UsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUM5QixDQUFDO0lBRUQscUNBQU0sR0FBTjtRQUNFLE1BQU0sQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDOUIsTUFBTSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUM1Qix1Q0FBcUIsQ0FBQyxlQUFlLENBQUMsMEJBQWMsQ0FBQyxpQkFBaUIsRUFBRSxlQUFlLENBQUMsQ0FBQztRQUN6RixJQUFJLElBQUksR0FBRyx1QkFBVyxDQUFDLFdBQVcsR0FBRyx1QkFBVyxDQUFDLFNBQVMsQ0FBQztRQUMzRCxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDOUIsQ0FBQztJQXRGUztRQUFULGFBQU0sRUFBRTtrQ0FBdUIsbUJBQVk7c0VBQStCO0lBRGhFLG9CQUFvQjtRQVBoQyxnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQ25CLFFBQVEsRUFBRSxpQkFBaUI7WUFDM0IsV0FBVyxFQUFFLDZCQUE2QjtZQUMxQyxTQUFTLEVBQUUsQ0FBQyw0QkFBNEIsQ0FBQztTQUMxQyxDQUFDO3lDQWVtQyxxQkFBYSxFQUFtQixlQUFNO1lBQ3ZDLHlDQUFrQixFQUEwQixzQkFBYyxFQUF1QixtQkFBVztPQWRuSCxvQkFBb0IsQ0F3RmhDO0lBQUQsMkJBQUM7Q0F4RkQsQUF3RkMsSUFBQTtBQXhGWSxvREFBb0IiLCJmaWxlIjoiYXBwL3VzZXIvc2V0dGluZ3MvY2hhbmdlLWVtYWlsL2NoYW5nZS1lbWFpbC5jb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgT3V0cHV0ICxFdmVudEVtaXR0ZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcclxuaW1wb3J0IHsgQ2hhbmdlRW1haWxTZXJ2aWNlIH0gZnJvbSAnLi9jaGFuZ2UtZW1haWwuc2VydmljZSc7XHJcbmltcG9ydCB7IENoYW5nZUVtYWlsIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2NoYW5nZS1lbWFpbCc7XHJcbmltcG9ydCB7IFNlc3Npb25TdG9yYWdlU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NoYXJlZC9zZXJ2aWNlcy9zZXNzaW9uLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBTZXNzaW9uU3RvcmFnZSwgQXBwU2V0dGluZ3MgfSBmcm9tICcuLi8uLi8uLi9zaGFyZWQvY29uc3RhbnRzJztcclxuaW1wb3J0IHsgQ29tbW9uU2VydmljZSwgSW1hZ2VQYXRoLCBNZXNzYWdlLCBNZXNzYWdlcywgTWVzc2FnZVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zaGFyZWQvaW5kZXgnO1xyXG5pbXBvcnQgeyBGb3JtQnVpbGRlciwgRm9ybUdyb3VwLCBWYWxpZGF0b3JzIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5pbXBvcnQgeyBWYWxpZGF0aW9uU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NoYXJlZC9jdXN0b212YWxpZGF0aW9ucy92YWxpZGF0aW9uLnNlcnZpY2UnO1xyXG5cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIG1vZHVsZUlkOiBtb2R1bGUuaWQsXHJcbiAgc2VsZWN0b3I6ICdjbi1jaGFuZ2UtZW1haWwnLFxyXG4gIHRlbXBsYXRlVXJsOiAnY2hhbmdlLWVtYWlsLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnY2hhbmdlLWVtYWlsLmNvbXBvbmVudC5jc3MnXSxcclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBDaGFuZ2VFbWFpbENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcbiAgQE91dHB1dCgpIG9uRW1haWxDaGFuZ2VTdWNjZXNzOiBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIGlzRW1haWxDb25maXJtOiBib29sZWFuO1xyXG4gIG1vZGVsID0gbmV3IENoYW5nZUVtYWlsKCk7XHJcbiAgdXNlckZvcm06IEZvcm1Hcm91cDtcclxuICBlcnJvcl9tc2c6IHN0cmluZztcclxuICBpc1Nob3dFcnJvck1lc3NhZ2U6IGJvb2xlYW4gPSB0cnVlO1xyXG4gIEVNQUlMX0lDT046IHN0cmluZztcclxuICBORVdfRU1BSUxfSUNPTjogc3RyaW5nO1xyXG4gIENPTkZJUk1fRU1BSUxfSUNPTjogc3RyaW5nO1xyXG4gIGVtYWlsTm90TWF0Y3RNZXNzYWdlOnN0cmluZz0gTWVzc2FnZXMuTVNHX0VNQUlMX05PVF9NQVRDSDtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjb21tb25TZXJ2aWNlOiBDb21tb25TZXJ2aWNlLCBwcml2YXRlIF9yb3V0ZXI6IFJvdXRlcixcclxuICAgICAgICAgICAgICBwcml2YXRlIGVtYWlsU2VydmljZTogQ2hhbmdlRW1haWxTZXJ2aWNlLCBwcml2YXRlIG1lc3NhZ2VTZXJ2aWNlOiBNZXNzYWdlU2VydmljZSwgcHJpdmF0ZSBmb3JtQnVpbGRlcjogRm9ybUJ1aWxkZXIpIHtcclxuXHJcbiAgICB0aGlzLnVzZXJGb3JtID0gdGhpcy5mb3JtQnVpbGRlci5ncm91cCh7XHJcbiAgICAgICduZXdfZW1haWwnOiBbJycsIFtWYWxpZGF0b3JzLnJlcXVpcmVkLCBWYWxpZGF0aW9uU2VydmljZS5lbWFpbFZhbGlkYXRvcl1dLFxyXG4gICAgICAnY29uZmlybV9lbWFpbCc6IFsnJywgW1ZhbGlkYXRvcnMucmVxdWlyZWQsIFZhbGlkYXRpb25TZXJ2aWNlLmVtYWlsVmFsaWRhdG9yXV0sXHJcbiAgICAgICdjdXJyZW50X2VtYWlsJzogWycnLCBbVmFsaWRhdG9ycy5yZXF1aXJlZCwgVmFsaWRhdGlvblNlcnZpY2UuZW1haWxWYWxpZGF0b3JdXVxyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5FTUFJTF9JQ09OID0gSW1hZ2VQYXRoLkVNQUlMX0lDT05fR1JFWTtcclxuICAgIHRoaXMuTkVXX0VNQUlMX0lDT04gPSBJbWFnZVBhdGguTkVXX0VNQUlMX0lDT05fR1JFWTtcclxuICAgIHRoaXMuQ09ORklSTV9FTUFJTF9JQ09OID0gSW1hZ2VQYXRoLkNPTkZJUk1fRU1BSUxfSUNPTl9HUkVZO1xyXG4gIH1cclxuXHJcbiAgbWFrZUVtYWlsQ29uZmlybSgpOiBib29sZWFuIHtcclxuICAgIGlmICh0aGlzLm1vZGVsLmNvbmZpcm1fZW1haWwgIT09IHRoaXMubW9kZWwubmV3X2VtYWlsKSB7XHJcbiAgICAgIHRoaXMuaXNFbWFpbENvbmZpcm0gPSB0cnVlO1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuaXNFbWFpbENvbmZpcm0gPSBmYWxzZTtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICB0aGlzLm1vZGVsLmN1cnJlbnRfZW1haWwgPSBTZXNzaW9uU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkVNQUlMX0lEKTtcclxuICB9XHJcblxyXG4gIG9uU3VibWl0KCkge1xyXG4gICAgdGhpcy5tb2RlbCA9IHRoaXMudXNlckZvcm0udmFsdWU7XHJcbiAgICB0aGlzLm1vZGVsLmN1cnJlbnRfZW1haWwgPSBTZXNzaW9uU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkVNQUlMX0lEKTtcclxuICAgIFNlc3Npb25TdG9yYWdlU2VydmljZS5zZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuQ0hBTkdFX01BSUxfVkFMVUUsICdmcm9tX3NldHRpbmdzJyk7XHJcbiAgICBpZiAoIXRoaXMubWFrZUVtYWlsQ29uZmlybSgpKSB7XHJcbiAgICAgIHRoaXMuZW1haWxTZXJ2aWNlLmNoYW5nZUVtYWlsKHRoaXMubW9kZWwpXHJcbiAgICAgICAgLnN1YnNjcmliZShcclxuICAgICAgICAgIGJvZHkgPT4gdGhpcy5vbkNoYW5nZUVtYWlsU3VjY2Vzcyhib2R5KSxcclxuICAgICAgICAgIGVycm9yID0+IHRoaXMub25DaGFuZ2VFbWFpbEZhaWx1cmUoZXJyb3IpKTtcclxuICAgIH1cclxuICAgIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wID0gMDtcclxuICB9XHJcblxyXG4gIG9uQ2hhbmdlRW1haWxTdWNjZXNzKGJvZHk6IENoYW5nZUVtYWlsKSB7XHJcbiAgICBTZXNzaW9uU3RvcmFnZVNlcnZpY2Uuc2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkNIQU5HRV9NQUlMX1ZBTFVFLCAnZnJvbV9zZXR0aW5ncycpO1xyXG4gICAgdGhpcy51c2VyRm9ybS5yZXNldCgpO1xyXG4gICAgdGhpcy5vbkVtYWlsQ2hhbmdlU3VjY2Vzcy5lbWl0KCk7XHJcblxyXG4gICAgdmFyIG1lc3NhZ2UgPSBuZXcgTWVzc2FnZSgpO1xyXG4gICAgbWVzc2FnZS5pc0Vycm9yID0gZmFsc2U7XHJcbiAgICBtZXNzYWdlLmN1c3RvbV9tZXNzYWdlID0gTWVzc2FnZXMuTVNHX1NVQ0NFU1NfQ0hBTkdFX0VNQUlMO1xyXG4gICAgdGhpcy5tZXNzYWdlU2VydmljZS5tZXNzYWdlKG1lc3NhZ2UpO1xyXG4gIH1cclxuXHJcbiAgb25DaGFuZ2VFbWFpbEZhaWx1cmUoZXJyb3I6IGFueSkge1xyXG4gICAgaWYgKGVycm9yLmVycl9jb2RlID09PSA0MDQgfHwgZXJyb3IuZXJyX2NvZGUgPT09IDApIHtcclxuICAgICAgdmFyIG1lc3NhZ2UgPSBuZXcgTWVzc2FnZSgpO1xyXG4gICAgICBtZXNzYWdlLmVycm9yX21zZyA9IGVycm9yLmVycl9tc2c7XHJcbiAgICAgIG1lc3NhZ2UuaXNFcnJvciA9IHRydWU7XHJcbiAgICAgIHRoaXMubWVzc2FnZVNlcnZpY2UubWVzc2FnZShtZXNzYWdlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuaXNTaG93RXJyb3JNZXNzYWdlID0gZmFsc2U7XHJcbiAgICAgIHRoaXMuZXJyb3JfbXNnID0gZXJyb3IuZXJyX21zZztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdvQmFjaygpIHtcclxuICAgIHRoaXMuY29tbW9uU2VydmljZS5nb0JhY2soKTtcclxuICB9XHJcblxyXG4gIGxvZ091dCgpIHtcclxuICAgIHdpbmRvdy5zZXNzaW9uU3RvcmFnZS5jbGVhcigpO1xyXG4gICAgd2luZG93LmxvY2FsU3RvcmFnZS5jbGVhcigpO1xyXG4gICAgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLnNldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5DSEFOR0VfTUFJTF9WQUxVRSwgJ2Zyb21fc2V0dGluZ3MnKTtcclxuICAgIGxldCBob3N0ID0gQXBwU2V0dGluZ3MuSFRUUF9DTElFTlQgKyBBcHBTZXR0aW5ncy5IT1NUX05BTUU7XHJcbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IGhvc3Q7XHJcbiAgfVxyXG59XHJcbiJdfQ==
