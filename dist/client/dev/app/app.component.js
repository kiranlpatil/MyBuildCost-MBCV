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
var themechange_service_1 = require("./shared/services/themechange.service");
var index_1 = require("./shared/index");
var AppComponent = (function () {
    function AppComponent(_router, themeChangeService, messageService, commonService, loaderService) {
        var _this = this;
        this._router = _router;
        this.themeChangeService = themeChangeService;
        this.messageService = messageService;
        this.commonService = commonService;
        this.loaderService = loaderService;
        this.isShowErrorMessage = true;
        this.isShowSuccessMessage = true;
        this.appTheme = index_1.AppSettings.INITIAL_THEM;
        this.subscription = themeChangeService.showTheme$.subscribe(function (theme) {
            _this.appTheme = theme;
        });
        this.subscription = messageService.messageObservable$.subscribe(function (message) {
            if (message.isError === true) {
                var err = message.error_msg.error;
                if (err === 'Could not attach click handler to the element. Reason: element not found.') {
                    message.isError = false;
                }
                else {
                    _this.showError(message);
                }
            }
            else {
                _this.showSuccess(message);
            }
        });
    }
    AppComponent.prototype.showError = function (message) {
        this.isShowErrorMessage = false;
        this.errorMessage = message.error_msg;
        this.customMessage = message.custom_message;
        if (message.error_code === 401) {
            this.isShowErrorMessage = false;
            setTimeout(function () {
                this.closeErrorMessage();
                this.logOut();
            }.bind(this), 5555);
        }
    };
    AppComponent.prototype.showSuccess = function (message) {
        this.isShowSuccessMessage = false;
        this.customMessage = message.custom_message;
        setTimeout(function () {
            this.isShowSuccessMessage = true;
        }.bind(this), 8888);
    };
    AppComponent.prototype.closeErrorMessage = function () {
        this.isShowErrorMessage = true;
    };
    AppComponent.prototype.closeSuccessMessage = function () {
        this.isShowSuccessMessage = true;
    };
    AppComponent.prototype.logOut = function () {
        window.sessionStorage.clear();
        window.localStorage.clear();
        var host = index_1.AppSettings.HTTP_CLIENT + index_1.AppSettings.HOST_NAME;
        window.location.href = host;
    };
    AppComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'tpl-app',
            templateUrl: 'app.component.html',
        }),
        __metadata("design:paramtypes", [router_1.Router,
            themechange_service_1.ThemeChangeService,
            index_1.MessageService,
            index_1.CommonService,
            index_1.LoaderService])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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QkFBb0IsR0FBRyxJQUFJLENBQUM7SUFDbkMsQ0FBQztJQUNELDZCQUFNLEdBQU47UUFDRSxNQUFNLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzlCLE1BQU0sQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDNUIsSUFBSSxJQUFJLEdBQUcsbUJBQVcsQ0FBQyxXQUFXLEdBQUcsbUJBQVcsQ0FBQyxTQUFTLENBQUM7UUFDM0QsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQzlCLENBQUM7SUFyRVUsWUFBWTtRQU54QixnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQ25CLFFBQVEsRUFBRSxTQUFTO1lBQ25CLFdBQVcsRUFBRSxvQkFBb0I7U0FDbEMsQ0FBQzt5Q0FVNkIsZUFBTTtZQUNLLHdDQUFrQjtZQUN0QixzQkFBYztZQUNmLHFCQUFhO1lBQ1gscUJBQWE7T0FadkMsWUFBWSxDQXNFeEI7SUFBRCxtQkFBQztDQXRFRCxBQXNFQyxJQUFBO0FBdEVZLG9DQUFZIiwiZmlsZSI6ImFwcC9hcHAuY29tcG9uZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XHJcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMvU3Vic2NyaXB0aW9uJztcclxuaW1wb3J0IHsgVGhlbWVDaGFuZ2VTZXJ2aWNlIH0gZnJvbSAnLi9zaGFyZWQvc2VydmljZXMvdGhlbWVjaGFuZ2Uuc2VydmljZSc7XHJcbmltcG9ydCB7XHJcbiAgQXBwU2V0dGluZ3MsXHJcbiAgQ29tbW9uU2VydmljZSxcclxuICBMb2FkZXJTZXJ2aWNlLFxyXG4gIE1lc3NhZ2UsXHJcbiAgTWVzc2FnZVNlcnZpY2VcclxufSBmcm9tICcuL3NoYXJlZC9pbmRleCc7XHJcblxyXG5cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIG1vZHVsZUlkOiBtb2R1bGUuaWQsXHJcbiAgc2VsZWN0b3I6ICd0cGwtYXBwJyxcclxuICB0ZW1wbGF0ZVVybDogJ2FwcC5jb21wb25lbnQuaHRtbCcsXHJcbn0pXHJcblxyXG5leHBvcnQgY2xhc3MgQXBwQ29tcG9uZW50IHtcclxuICBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcclxuICBhcHBUaGVtZTogc3RyaW5nO1xyXG4gIGVycm9yTWVzc2FnZTogYW55O1xyXG4gIGN1c3RvbU1lc3NhZ2U6IGFueTtcclxuICBpc1Nob3dFcnJvck1lc3NhZ2U6IGJvb2xlYW4gPSB0cnVlO1xyXG4gIGlzU2hvd1N1Y2Nlc3NNZXNzYWdlOiBib29sZWFuID0gdHJ1ZTtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfcm91dGVyOiBSb3V0ZXIsXHJcbiAgICAgICAgICAgICAgcHJpdmF0ZSB0aGVtZUNoYW5nZVNlcnZpY2U6IFRoZW1lQ2hhbmdlU2VydmljZSxcclxuICAgICAgICAgICAgICBwcml2YXRlIG1lc3NhZ2VTZXJ2aWNlOiBNZXNzYWdlU2VydmljZSxcclxuICAgICAgICAgICAgICBwcml2YXRlIGNvbW1vblNlcnZpY2U6IENvbW1vblNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgcHJvdGVjdGVkIGxvYWRlclNlcnZpY2U6IExvYWRlclNlcnZpY2UpIHtcclxuICAgIHRoaXMuYXBwVGhlbWUgPSBBcHBTZXR0aW5ncy5JTklUSUFMX1RIRU07XHJcblxyXG4gICAgdGhpcy5zdWJzY3JpcHRpb24gPSB0aGVtZUNoYW5nZVNlcnZpY2Uuc2hvd1RoZW1lJC5zdWJzY3JpYmUoXHJcbiAgICAgIHRoZW1lID0+IHtcclxuICAgICAgICB0aGlzLmFwcFRoZW1lID0gdGhlbWU7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgIHRoaXMuc3Vic2NyaXB0aW9uID0gbWVzc2FnZVNlcnZpY2UubWVzc2FnZU9ic2VydmFibGUkLnN1YnNjcmliZShcclxuICAgICAgKG1lc3NhZ2U6IE1lc3NhZ2UpID0+IHtcclxuICAgICAgICBpZiAobWVzc2FnZS5pc0Vycm9yID09PSB0cnVlKSB7XHJcbiAgICAgICAgICBsZXQgZXJyID0gbWVzc2FnZS5lcnJvcl9tc2cuZXJyb3I7XHJcbiAgICAgICAgICBpZiAoZXJyID09PSAnQ291bGQgbm90IGF0dGFjaCBjbGljayBoYW5kbGVyIHRvIHRoZSBlbGVtZW50LiBSZWFzb246IGVsZW1lbnQgbm90IGZvdW5kLicpIHtcclxuICAgICAgICAgICAgbWVzc2FnZS5pc0Vycm9yID0gZmFsc2U7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnNob3dFcnJvcihtZXNzYWdlKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5zaG93U3VjY2VzcyhtZXNzYWdlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBzaG93RXJyb3IobWVzc2FnZTogTWVzc2FnZSkge1xyXG4gICAgdGhpcy5pc1Nob3dFcnJvck1lc3NhZ2UgPSBmYWxzZTtcclxuICAgIHRoaXMuZXJyb3JNZXNzYWdlID0gbWVzc2FnZS5lcnJvcl9tc2c7XHJcbiAgICB0aGlzLmN1c3RvbU1lc3NhZ2UgPSBtZXNzYWdlLmN1c3RvbV9tZXNzYWdlO1xyXG4gICAgaWYobWVzc2FnZS5lcnJvcl9jb2RlPT09NDAxKSB7XHJcbiAgICAgIHRoaXMuaXNTaG93RXJyb3JNZXNzYWdlID0gZmFsc2U7XHJcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuY2xvc2VFcnJvck1lc3NhZ2UoKTtcclxuICAgICAgICB0aGlzLmxvZ091dCgpO1xyXG4gICAgICB9LmJpbmQodGhpcyksIDU1NTUpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc2hvd1N1Y2Nlc3MobWVzc2FnZTogTWVzc2FnZSkge1xyXG4gICAgdGhpcy5pc1Nob3dTdWNjZXNzTWVzc2FnZSA9IGZhbHNlO1xyXG4gICAgdGhpcy5jdXN0b21NZXNzYWdlID0gbWVzc2FnZS5jdXN0b21fbWVzc2FnZTtcclxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLmlzU2hvd1N1Y2Nlc3NNZXNzYWdlID0gdHJ1ZTtcclxuICAgIH0uYmluZCh0aGlzKSwgODg4OCk7XHJcbiAgfVxyXG5cclxuICBjbG9zZUVycm9yTWVzc2FnZSgpIHtcclxuICAgIHRoaXMuaXNTaG93RXJyb3JNZXNzYWdlID0gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGNsb3NlU3VjY2Vzc01lc3NhZ2UoKSB7XHJcbiAgICB0aGlzLmlzU2hvd1N1Y2Nlc3NNZXNzYWdlID0gdHJ1ZTtcclxuICB9XHJcbiAgbG9nT3V0KCkge1xyXG4gICAgd2luZG93LnNlc3Npb25TdG9yYWdlLmNsZWFyKCk7XHJcbiAgICB3aW5kb3cubG9jYWxTdG9yYWdlLmNsZWFyKCk7XHJcbiAgICBsZXQgaG9zdCA9IEFwcFNldHRpbmdzLkhUVFBfQ0xJRU5UICsgQXBwU2V0dGluZ3MuSE9TVF9OQU1FO1xyXG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBob3N0O1xyXG4gIH1cclxufVxyXG4iXX0=
