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
var session_service_1 = require("../../shared/services/session.service");
var constants_1 = require("../../shared/constants");
var themechange_service_1 = require("../../shared/services/themechange.service");
var message_1 = require("../../shared/models/message");
var message_service_1 = require("../../shared/services/message.service");
var RegistrationService = (function () {
    function RegistrationService(_router, themeChangeService, messageService) {
        this._router = _router;
        this.themeChangeService = themeChangeService;
        this.messageService = messageService;
        this.isShowErrorMessage = true;
    }
    RegistrationService.prototype.onGetUserDataSuccess = function (res) {
        session_service_1.SessionStorageService.setSessionValue(constants_1.SessionStorage.EMAIL_ID, res.data.email);
        session_service_1.SessionStorageService.setSessionValue(constants_1.SessionStorage.MOBILE_NUMBER, res.data.mobile_number);
        session_service_1.SessionStorageService.setSessionValue(constants_1.SessionStorage.FIRST_NAME, res.data.first_name);
        session_service_1.SessionStorageService.setSessionValue(constants_1.SessionStorage.LAST_NAME, res.data.last_name);
        if (res.data.current_theme) {
            session_service_1.SessionStorageService.setSessionValue(constants_1.SessionStorage.MY_THEME, res.data.current_theme);
            this.themeChangeService.change(res.data.current_theme);
        }
        if (res.isSocialLogin) {
            session_service_1.SessionStorageService.setSessionValue(constants_1.SessionStorage.IS_SOCIAL_LOGIN, constants_1.AppSettings.IS_SOCIAL_LOGIN_YES);
        }
        else {
            session_service_1.SessionStorageService.setSessionValue(constants_1.SessionStorage.IS_SOCIAL_LOGIN, constants_1.AppSettings.IS_SOCIAL_LOGIN_NO);
        }
        this.successRedirect(res);
    };
    RegistrationService.prototype.successRedirect = function (res) {
        session_service_1.SessionStorageService.setSessionValue(constants_1.SessionStorage.IS_LOGGED_IN, 1);
        session_service_1.SessionStorageService.setSessionValue(constants_1.SessionStorage.IS_USER_SIGN_IN, 0);
        session_service_1.SessionStorageService.setSessionValue(constants_1.SessionStorage.PROFILE_PICTURE, res.data.picture);
        this._router.navigate([constants_1.NavigationRoutes.APP_CREATE_NEW_PROJECT]);
    };
    RegistrationService.prototype.onLoginFailure = function (error) {
        session_service_1.SessionStorageService.setSessionValue(constants_1.SessionStorage.PASSWORD, '');
        if (error.err_code === 404 || error.err_code === 0) {
            var message = new message_1.Message();
            message.error_msg = error.message;
            message.isError = true;
            this.messageService.message(message);
        }
        else {
            this.isShowErrorMessage = false;
            this.error_msg = error.err_msg;
        }
    };
    RegistrationService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [router_1.Router, themechange_service_1.ThemeChangeService, message_service_1.MessageService])
    ], RegistrationService);
    return RegistrationService;
}());
exports.RegistrationService = RegistrationService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC91c2VyL3NlcnZpY2VzL3JlZ2lzdHJhdGlvbi5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsc0NBQTJDO0FBQzNDLDBDQUF5QztBQUN6Qyx5RUFBOEU7QUFDOUUsb0RBQXVGO0FBQ3ZGLGlGQUErRTtBQUMvRSx1REFBc0Q7QUFDdEQseUVBQXVFO0FBR3ZFO0lBR0EsNkJBQW9CLE9BQWUsRUFBVSxrQkFBc0MsRUFBVSxjQUE4QjtRQUF2RyxZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQVUsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFvQjtRQUFVLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQURqSCx1QkFBa0IsR0FBWSxJQUFJLENBQUM7SUFDaUYsQ0FBQztJQUU3SCxrREFBb0IsR0FBcEIsVUFBcUIsR0FBUTtRQUMzQix1Q0FBcUIsQ0FBQyxlQUFlLENBQUMsMEJBQWMsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMvRSx1Q0FBcUIsQ0FBQyxlQUFlLENBQUMsMEJBQWMsQ0FBQyxhQUFhLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUM1Rix1Q0FBcUIsQ0FBQyxlQUFlLENBQUMsMEJBQWMsQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN0Rix1Q0FBcUIsQ0FBQyxlQUFlLENBQUMsMEJBQWMsQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNwRixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7WUFDM0IsdUNBQXFCLENBQUMsZUFBZSxDQUFDLDBCQUFjLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDdkYsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3pELENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztZQUN0Qix1Q0FBcUIsQ0FBQyxlQUFlLENBQUMsMEJBQWMsQ0FBQyxlQUFlLEVBQUUsdUJBQVcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQ3pHLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLHVDQUFxQixDQUFDLGVBQWUsQ0FBQywwQkFBYyxDQUFDLGVBQWUsRUFBRSx1QkFBVyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDeEcsQ0FBQztRQUNELElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUVELDZDQUFlLEdBQWYsVUFBZ0IsR0FBUTtRQUN0Qix1Q0FBcUIsQ0FBQyxlQUFlLENBQUMsMEJBQWMsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDdEUsdUNBQXFCLENBQUMsZUFBZSxDQUFDLDBCQUFjLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3pFLHVDQUFxQixDQUFDLGVBQWUsQ0FBQywwQkFBYyxDQUFDLGVBQWUsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3RGLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsNEJBQWdCLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDO0lBQ3JFLENBQUM7SUFFRCw0Q0FBYyxHQUFkLFVBQWUsS0FBVTtRQUN2Qix1Q0FBcUIsQ0FBQyxlQUFlLENBQUMsMEJBQWMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDbkUsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLFFBQVEsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25ELElBQUksT0FBTyxHQUFHLElBQUksaUJBQU8sRUFBRSxDQUFDO1lBQzVCLE9BQU8sQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztZQUNsQyxPQUFPLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztZQUN2QixJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN2QyxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixJQUFJLENBQUMsa0JBQWtCLEdBQUcsS0FBSyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUNqQyxDQUFDO0lBQ0gsQ0FBQztJQXhDVSxtQkFBbUI7UUFEL0IsaUJBQVUsRUFBRTt5Q0FJZ0IsZUFBTSxFQUE4Qix3Q0FBa0IsRUFBMEIsZ0NBQWM7T0FIOUcsbUJBQW1CLENBeUMvQjtJQUFELDBCQUFDO0NBekNELEFBeUNDLElBQUE7QUF6Q1ksa0RBQW1CIiwiZmlsZSI6ImFwcC91c2VyL3NlcnZpY2VzL3JlZ2lzdHJhdGlvbi5zZXJ2aWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xyXG5pbXBvcnQgeyBTZXNzaW9uU3RvcmFnZVNlcnZpY2UgfSBmcm9tICcuLi8uLi9zaGFyZWQvc2VydmljZXMvc2Vzc2lvbi5zZXJ2aWNlJztcclxuaW1wb3J0IHsgU2Vzc2lvblN0b3JhZ2UsIEFwcFNldHRpbmdzLCBOYXZpZ2F0aW9uUm91dGVzIH0gZnJvbSAnLi4vLi4vc2hhcmVkL2NvbnN0YW50cyc7XHJcbmltcG9ydCB7IFRoZW1lQ2hhbmdlU2VydmljZSB9IGZyb20gJy4uLy4uL3NoYXJlZC9zZXJ2aWNlcy90aGVtZWNoYW5nZS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgTWVzc2FnZSB9IGZyb20gJy4uLy4uL3NoYXJlZC9tb2RlbHMvbWVzc2FnZSc7XHJcbmltcG9ydCB7IE1lc3NhZ2VTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2hhcmVkL3NlcnZpY2VzL21lc3NhZ2Uuc2VydmljZSc7XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBSZWdpc3RyYXRpb25TZXJ2aWNlIHtcclxuICBwcml2YXRlIGVycm9yX21zZzogc3RyaW5nO1xyXG4gIHByaXZhdGUgaXNTaG93RXJyb3JNZXNzYWdlOiBib29sZWFuID0gdHJ1ZTtcclxuY29uc3RydWN0b3IocHJpdmF0ZSBfcm91dGVyOiBSb3V0ZXIsIHByaXZhdGUgdGhlbWVDaGFuZ2VTZXJ2aWNlOiBUaGVtZUNoYW5nZVNlcnZpY2UsIHByaXZhdGUgbWVzc2FnZVNlcnZpY2U6IE1lc3NhZ2VTZXJ2aWNlKXsgfVxyXG5cclxuICBvbkdldFVzZXJEYXRhU3VjY2VzcyhyZXM6IGFueSkge1xyXG4gICAgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLnNldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5FTUFJTF9JRCwgcmVzLmRhdGEuZW1haWwpO1xyXG4gICAgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLnNldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5NT0JJTEVfTlVNQkVSLCByZXMuZGF0YS5tb2JpbGVfbnVtYmVyKTtcclxuICAgIFNlc3Npb25TdG9yYWdlU2VydmljZS5zZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuRklSU1RfTkFNRSwgcmVzLmRhdGEuZmlyc3RfbmFtZSk7XHJcbiAgICBTZXNzaW9uU3RvcmFnZVNlcnZpY2Uuc2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkxBU1RfTkFNRSwgcmVzLmRhdGEubGFzdF9uYW1lKTtcclxuICAgIGlmIChyZXMuZGF0YS5jdXJyZW50X3RoZW1lKSB7XHJcbiAgICAgIFNlc3Npb25TdG9yYWdlU2VydmljZS5zZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuTVlfVEhFTUUsIHJlcy5kYXRhLmN1cnJlbnRfdGhlbWUpO1xyXG4gICAgICB0aGlzLnRoZW1lQ2hhbmdlU2VydmljZS5jaGFuZ2UocmVzLmRhdGEuY3VycmVudF90aGVtZSk7XHJcbiAgICB9XHJcbiAgICBpZiAocmVzLmlzU29jaWFsTG9naW4pIHtcclxuICAgICAgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLnNldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5JU19TT0NJQUxfTE9HSU4sIEFwcFNldHRpbmdzLklTX1NPQ0lBTF9MT0dJTl9ZRVMpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLnNldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5JU19TT0NJQUxfTE9HSU4sIEFwcFNldHRpbmdzLklTX1NPQ0lBTF9MT0dJTl9OTyk7XHJcbiAgICB9XHJcbiAgICB0aGlzLnN1Y2Nlc3NSZWRpcmVjdChyZXMpO1xyXG4gIH1cclxuXHJcbiAgc3VjY2Vzc1JlZGlyZWN0KHJlczogYW55KSB7XHJcbiAgICBTZXNzaW9uU3RvcmFnZVNlcnZpY2Uuc2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLklTX0xPR0dFRF9JTiwgMSk7XHJcbiAgICBTZXNzaW9uU3RvcmFnZVNlcnZpY2Uuc2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLklTX1VTRVJfU0lHTl9JTiwgMCk7XHJcbiAgICBTZXNzaW9uU3RvcmFnZVNlcnZpY2Uuc2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLlBST0ZJTEVfUElDVFVSRSwgcmVzLmRhdGEucGljdHVyZSk7XHJcbiAgICAgIHRoaXMuX3JvdXRlci5uYXZpZ2F0ZShbTmF2aWdhdGlvblJvdXRlcy5BUFBfQ1JFQVRFX05FV19QUk9KRUNUXSk7XHJcbiAgfVxyXG5cclxuICBvbkxvZ2luRmFpbHVyZShlcnJvcjogYW55KSB7XHJcbiAgICBTZXNzaW9uU3RvcmFnZVNlcnZpY2Uuc2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLlBBU1NXT1JELCAnJyk7XHJcbiAgICBpZiAoZXJyb3IuZXJyX2NvZGUgPT09IDQwNCB8fCBlcnJvci5lcnJfY29kZSA9PT0gMCkge1xyXG4gICAgICB2YXIgbWVzc2FnZSA9IG5ldyBNZXNzYWdlKCk7XHJcbiAgICAgIG1lc3NhZ2UuZXJyb3JfbXNnID0gZXJyb3IubWVzc2FnZTtcclxuICAgICAgbWVzc2FnZS5pc0Vycm9yID0gdHJ1ZTtcclxuICAgICAgdGhpcy5tZXNzYWdlU2VydmljZS5tZXNzYWdlKG1lc3NhZ2UpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5pc1Nob3dFcnJvck1lc3NhZ2UgPSBmYWxzZTtcclxuICAgICAgdGhpcy5lcnJvcl9tc2cgPSBlcnJvci5lcnJfbXNnO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=
