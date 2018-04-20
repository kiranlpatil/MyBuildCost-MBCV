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
var constants_1 = require("../../../shared/constants");
var session_service_1 = require("../../../shared/services/session.service");
var activate_user_service_1 = require("./activate-user.service");
var message_service_1 = require("../../../shared/services/message.service");
var ActivateUserComponent = (function () {
    function ActivateUserComponent(_router, activatedRoute, activeService, messageService) {
        this._router = _router;
        this.activatedRoute = activatedRoute;
        this.activeService = activeService;
        this.messageService = messageService;
        this.isEmailVerification = false;
        this.activationMessageHeading = constants_1.Messages.MSG_ACTIVATE_USER_HEADING;
        this.activationMessageSubHeading = constants_1.Messages.MSG_ACTIVATE_USER_SUB_HEADING;
        this.activationMessage = constants_1.Messages.MSG_ACTIVATE_USER_MESSAGE;
        this.emailVerificationMessageHeading = constants_1.Messages.MSG_EMAIL_VERIFICATION_HEADING;
        this.emailVerificationMessage = constants_1.Messages.MSG_EMAIL_VERIFICATION_MESSAGE;
        this.MY_LOGO_PATH = constants_1.ImagePath.MY_WHITE_LOGO;
        this.UNDER_LICENCE = constants_1.ProjectAsset.UNDER_LICENECE;
        this.MY_TAG_LINE = constants_1.ProjectAsset.TAG_LINE;
        this.BODY_BACKGROUND = constants_1.ImagePath.BODY_BACKGROUND;
    }
    ActivateUserComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.token = this._router.url.substr('activate-user?access_token'.length + 2);
        if (this._router.url.indexOf('isEmailVerification') !== -1) {
            this.isEmailVerification = true;
        }
        this.idPosition = this.token.indexOf('&') + 1;
        this.id = this.token.substring(this.idPosition + 28, this.idPosition + 4);
        this.token = this.token.substring(this.token.length - 29, 0);
        session_service_1.SessionStorageService.setSessionValue(constants_1.SessionStorage.ACCESS_TOKEN, this.token);
        session_service_1.SessionStorageService.setSessionValue(constants_1.SessionStorage.USER_ID, this.id);
        this.activeService.activeUser()
            .subscribe(function (res) { return (_this.OnNewRegistrationSuccess(res)); }, function (error) { return (_this.onNewRegistrationFailure(error)); });
    };
    ActivateUserComponent.prototype.OnNewRegistrationSuccess = function (res) {
        this.USER_ACTIVATION_STATUS = constants_1.Messages.MSG_SUCCESS_MAIL_VERIFICATION_RESULT_STATUS;
        this.USER_ACTIVATION_MESSAGE = constants_1.Messages.MSG_SUCCESS_MAIL_VERIFICATION_BODY;
    };
    ActivateUserComponent.prototype.onNewRegistrationFailure = function (error) {
        this.USER_ACTIVATION_STATUS = constants_1.Messages.MSG_ERROR_MAIL_VERIFICATION_RESULT_STATUS;
        this.USER_ACTIVATION_MESSAGE = constants_1.Messages.MSG_ERROR_MAIL_VERIFICATION_BODY;
    };
    ActivateUserComponent.prototype.navigateTo = function () {
        this._router.navigate([constants_1.NavigationRoutes.APP_LOGIN]);
    };
    ActivateUserComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'tpl-activate-user',
            templateUrl: 'activate-user.component.html',
            styleUrls: ['activate-user.component.css'],
        }),
        __metadata("design:paramtypes", [router_1.Router, router_1.ActivatedRoute, activate_user_service_1.ActiveUserService,
            message_service_1.MessageService])
    ], ActivateUserComponent);
    return ActivateUserComponent;
}());
exports.ActivateUserComponent = ActivateUserComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvcmVnaXN0cmF0aW9uL2FjdGl2YXRlLXVzZXIvYWN0aXZhdGUtdXNlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxzQ0FBa0Q7QUFDbEQsMENBQXlEO0FBQ3pELHVEQUFnSDtBQUNoSCw0RUFBaUY7QUFDakYsaUVBQTREO0FBQzVELDRFQUEwRTtBQU8xRTtJQWlCRSwrQkFBb0IsT0FBZSxFQUFVLGNBQThCLEVBQVUsYUFBZ0MsRUFDakcsY0FBOEI7UUFEOUIsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUFVLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUFVLGtCQUFhLEdBQWIsYUFBYSxDQUFtQjtRQUNqRyxtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFabEQsd0JBQW1CLEdBQVMsS0FBSyxDQUFDO1FBS2xDLDZCQUF3QixHQUFVLG9CQUFRLENBQUMseUJBQXlCLENBQUM7UUFDckUsZ0NBQTJCLEdBQVUsb0JBQVEsQ0FBQyw2QkFBNkIsQ0FBQztRQUM1RSxzQkFBaUIsR0FBVSxvQkFBUSxDQUFDLHlCQUF5QixDQUFDO1FBQzlELG9DQUErQixHQUFVLG9CQUFRLENBQUMsOEJBQThCLENBQUM7UUFDakYsNkJBQXdCLEdBQVUsb0JBQVEsQ0FBQyw4QkFBOEIsQ0FBQztRQUl4RSxJQUFJLENBQUMsWUFBWSxHQUFHLHFCQUFTLENBQUMsYUFBYSxDQUFDO1FBQzVDLElBQUksQ0FBQyxhQUFhLEdBQUcsd0JBQVksQ0FBQyxjQUFjLENBQUM7UUFDakQsSUFBSSxDQUFDLFdBQVcsR0FBRyx3QkFBWSxDQUFDLFFBQVEsQ0FBQztRQUN6QyxJQUFJLENBQUMsZUFBZSxHQUFHLHFCQUFTLENBQUMsZUFBZSxDQUFDO0lBQ25ELENBQUM7SUFFRCx3Q0FBUSxHQUFSO1FBQUEsaUJBY0M7UUFiQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyw0QkFBNEIsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDOUUsRUFBRSxDQUFBLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLHFCQUFxQixDQUFDLEtBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hELElBQUksQ0FBQyxtQkFBbUIsR0FBQyxJQUFJLENBQUM7UUFDaEMsQ0FBQztRQUNELElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzlDLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLEVBQUUsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUMxRSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM3RCx1Q0FBcUIsQ0FBQyxlQUFlLENBQUMsMEJBQWMsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQy9FLHVDQUFxQixDQUFDLGVBQWUsQ0FBQywwQkFBYyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDdkUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLEVBQUU7YUFDNUIsU0FBUyxDQUNSLFVBQUEsR0FBRyxJQUFJLE9BQUEsQ0FBQyxLQUFJLENBQUMsd0JBQXdCLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBcEMsQ0FBb0MsRUFDM0MsVUFBQSxLQUFLLElBQUksT0FBQSxDQUFDLEtBQUksQ0FBQyx3QkFBd0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUF0QyxDQUFzQyxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUVELHdEQUF3QixHQUF4QixVQUF5QixHQUFRO1FBQy9CLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxvQkFBUSxDQUFDLDJDQUEyQyxDQUFDO1FBQ25GLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxvQkFBUSxDQUFDLGtDQUFrQyxDQUFDO0lBQzdFLENBQUM7SUFFRCx3REFBd0IsR0FBeEIsVUFBeUIsS0FBVTtRQUNqQyxJQUFJLENBQUMsc0JBQXNCLEdBQUcsb0JBQVEsQ0FBQyx5Q0FBeUMsQ0FBQztRQUNqRixJQUFJLENBQUMsdUJBQXVCLEdBQUcsb0JBQVEsQ0FBQyxnQ0FBZ0MsQ0FBQztJQUMzRSxDQUFDO0lBRUQsMENBQVUsR0FBVjtRQUNFLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsNEJBQWdCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBckRVLHFCQUFxQjtRQU5qQyxnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQ25CLFFBQVEsRUFBRSxtQkFBbUI7WUFDN0IsV0FBVyxFQUFFLDhCQUE4QjtZQUMzQyxTQUFTLEVBQUUsQ0FBQyw2QkFBNkIsQ0FBQztTQUMzQyxDQUFDO3lDQWtCNkIsZUFBTSxFQUEwQix1QkFBYyxFQUF5Qix5Q0FBaUI7WUFDakYsZ0NBQWM7T0FsQnZDLHFCQUFxQixDQXNEakM7SUFBRCw0QkFBQztDQXRERCxBQXNEQyxJQUFBO0FBdERZLHNEQUFxQiIsImZpbGUiOiJhcHAvZnJhbWV3b3JrL3JlZ2lzdHJhdGlvbi9hY3RpdmF0ZS11c2VyL2FjdGl2YXRlLXVzZXIuY29tcG9uZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGUsIFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XHJcbmltcG9ydCB7IEltYWdlUGF0aCwgU2Vzc2lvblN0b3JhZ2UsIE1lc3NhZ2VzLCBOYXZpZ2F0aW9uUm91dGVzLCBQcm9qZWN0QXNzZXQgfSBmcm9tICcuLi8uLi8uLi9zaGFyZWQvY29uc3RhbnRzJztcclxuaW1wb3J0IHsgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vc2hhcmVkL3NlcnZpY2VzL3Nlc3Npb24uc2VydmljZSc7XHJcbmltcG9ydCB7IEFjdGl2ZVVzZXJTZXJ2aWNlIH0gZnJvbSAnLi9hY3RpdmF0ZS11c2VyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBNZXNzYWdlU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NoYXJlZC9zZXJ2aWNlcy9tZXNzYWdlLnNlcnZpY2UnO1xyXG5AQ29tcG9uZW50KHtcclxuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxyXG4gIHNlbGVjdG9yOiAndHBsLWFjdGl2YXRlLXVzZXInLFxyXG4gIHRlbXBsYXRlVXJsOiAnYWN0aXZhdGUtdXNlci5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJ2FjdGl2YXRlLXVzZXIuY29tcG9uZW50LmNzcyddLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgQWN0aXZhdGVVc2VyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuICBVU0VSX0FDVElWQVRJT05fTUVTU0FHRTogc3RyaW5nO1xyXG4gIFVTRVJfQUNUSVZBVElPTl9TVEFUVVM6IHN0cmluZztcclxuICB0b2tlbjogc3RyaW5nO1xyXG4gIGlkUG9zaXRpb246IG51bWJlcjtcclxuICBpZDogc3RyaW5nO1xyXG4gIGlzRW1haWxWZXJpZmljYXRpb246Ym9vbGVhbj1mYWxzZTtcclxuICBNWV9MT0dPX1BBVEg6IHN0cmluZztcclxuICBNWV9UQUdfTElORTogc3RyaW5nO1xyXG4gIFVOREVSX0xJQ0VOQ0U6IHN0cmluZztcclxuICBCT0RZX0JBQ0tHUk9VTkQ6IHN0cmluZztcclxuICBhY3RpdmF0aW9uTWVzc2FnZUhlYWRpbmc6IHN0cmluZz0gTWVzc2FnZXMuTVNHX0FDVElWQVRFX1VTRVJfSEVBRElORztcclxuICBhY3RpdmF0aW9uTWVzc2FnZVN1YkhlYWRpbmc6IHN0cmluZz0gTWVzc2FnZXMuTVNHX0FDVElWQVRFX1VTRVJfU1VCX0hFQURJTkc7XHJcbiAgYWN0aXZhdGlvbk1lc3NhZ2U6IHN0cmluZz0gTWVzc2FnZXMuTVNHX0FDVElWQVRFX1VTRVJfTUVTU0FHRTtcclxuICBlbWFpbFZlcmlmaWNhdGlvbk1lc3NhZ2VIZWFkaW5nOiBzdHJpbmc9IE1lc3NhZ2VzLk1TR19FTUFJTF9WRVJJRklDQVRJT05fSEVBRElORztcclxuICBlbWFpbFZlcmlmaWNhdGlvbk1lc3NhZ2U6IHN0cmluZz0gTWVzc2FnZXMuTVNHX0VNQUlMX1ZFUklGSUNBVElPTl9NRVNTQUdFO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9yb3V0ZXI6IFJvdXRlciwgcHJpdmF0ZSBhY3RpdmF0ZWRSb3V0ZTogQWN0aXZhdGVkUm91dGUsIHByaXZhdGUgYWN0aXZlU2VydmljZTogQWN0aXZlVXNlclNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgcHJpdmF0ZSBtZXNzYWdlU2VydmljZTogTWVzc2FnZVNlcnZpY2UpIHtcclxuICAgIHRoaXMuTVlfTE9HT19QQVRIID0gSW1hZ2VQYXRoLk1ZX1dISVRFX0xPR087XHJcbiAgICB0aGlzLlVOREVSX0xJQ0VOQ0UgPSBQcm9qZWN0QXNzZXQuVU5ERVJfTElDRU5FQ0U7XHJcbiAgICB0aGlzLk1ZX1RBR19MSU5FID0gUHJvamVjdEFzc2V0LlRBR19MSU5FO1xyXG4gICAgdGhpcy5CT0RZX0JBQ0tHUk9VTkQgPSBJbWFnZVBhdGguQk9EWV9CQUNLR1JPVU5EO1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICB0aGlzLnRva2VuID0gdGhpcy5fcm91dGVyLnVybC5zdWJzdHIoJ2FjdGl2YXRlLXVzZXI/YWNjZXNzX3Rva2VuJy5sZW5ndGggKyAyKTtcclxuICAgIGlmKHRoaXMuX3JvdXRlci51cmwuaW5kZXhPZignaXNFbWFpbFZlcmlmaWNhdGlvbicpIT09LTEpIHtcclxuICAgICAgdGhpcy5pc0VtYWlsVmVyaWZpY2F0aW9uPXRydWU7XHJcbiAgICB9XHJcbiAgICB0aGlzLmlkUG9zaXRpb24gPSB0aGlzLnRva2VuLmluZGV4T2YoJyYnKSArIDE7XHJcbiAgICB0aGlzLmlkID0gdGhpcy50b2tlbi5zdWJzdHJpbmcodGhpcy5pZFBvc2l0aW9uICsgMjgsIHRoaXMuaWRQb3NpdGlvbiArIDQpO1xyXG4gICAgdGhpcy50b2tlbiA9IHRoaXMudG9rZW4uc3Vic3RyaW5nKHRoaXMudG9rZW4ubGVuZ3RoIC0gMjksIDApO1xyXG4gICAgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLnNldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5BQ0NFU1NfVE9LRU4sIHRoaXMudG9rZW4pO1xyXG4gICAgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLnNldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5VU0VSX0lELCB0aGlzLmlkKTtcclxuICAgIHRoaXMuYWN0aXZlU2VydmljZS5hY3RpdmVVc2VyKClcclxuICAgICAgLnN1YnNjcmliZShcclxuICAgICAgICByZXMgPT4gKHRoaXMuT25OZXdSZWdpc3RyYXRpb25TdWNjZXNzKHJlcykpLFxyXG4gICAgICAgIGVycm9yID0+ICh0aGlzLm9uTmV3UmVnaXN0cmF0aW9uRmFpbHVyZShlcnJvcikpKTtcclxuICB9XHJcblxyXG4gIE9uTmV3UmVnaXN0cmF0aW9uU3VjY2VzcyhyZXM6IGFueSkge1xyXG4gICAgdGhpcy5VU0VSX0FDVElWQVRJT05fU1RBVFVTID0gTWVzc2FnZXMuTVNHX1NVQ0NFU1NfTUFJTF9WRVJJRklDQVRJT05fUkVTVUxUX1NUQVRVUztcclxuICAgIHRoaXMuVVNFUl9BQ1RJVkFUSU9OX01FU1NBR0UgPSBNZXNzYWdlcy5NU0dfU1VDQ0VTU19NQUlMX1ZFUklGSUNBVElPTl9CT0RZO1xyXG4gIH1cclxuXHJcbiAgb25OZXdSZWdpc3RyYXRpb25GYWlsdXJlKGVycm9yOiBhbnkpIHtcclxuICAgIHRoaXMuVVNFUl9BQ1RJVkFUSU9OX1NUQVRVUyA9IE1lc3NhZ2VzLk1TR19FUlJPUl9NQUlMX1ZFUklGSUNBVElPTl9SRVNVTFRfU1RBVFVTO1xyXG4gICAgdGhpcy5VU0VSX0FDVElWQVRJT05fTUVTU0FHRSA9IE1lc3NhZ2VzLk1TR19FUlJPUl9NQUlMX1ZFUklGSUNBVElPTl9CT0RZO1xyXG4gIH1cclxuXHJcbiAgbmF2aWdhdGVUbygpIHtcclxuICAgIHRoaXMuX3JvdXRlci5uYXZpZ2F0ZShbTmF2aWdhdGlvblJvdXRlcy5BUFBfTE9HSU5dKTtcclxuICB9XHJcbn1cclxuIl19
