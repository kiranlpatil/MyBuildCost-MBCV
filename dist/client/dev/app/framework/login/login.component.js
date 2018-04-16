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
var login_service_1 = require("./login.service");
var login_1 = require("../../user/models/login");
var index_1 = require("../../shared/index");
var forms_1 = require("@angular/forms");
var validation_service_1 = require("../../shared/customvalidations/validation.service");
var constants_1 = require("../../shared/constants");
var shared_service_1 = require("../../shared/services/shared-service");
var registration_service_1 = require("../../user/services/registration.service");
var local_storage_service_1 = require("./../../shared/services/local-storage.service");
var LoginComponent = (function () {
    function LoginComponent(_router, loginService, themeChangeService, messageService, formBuilder, sharedService, activatedRoute, registrationService) {
        this._router = _router;
        this.loginService = loginService;
        this.themeChangeService = themeChangeService;
        this.messageService = messageService;
        this.formBuilder = formBuilder;
        this.sharedService = sharedService;
        this.activatedRoute = activatedRoute;
        this.registrationService = registrationService;
        this.model = new login_1.Login();
        this.isShowErrorMessage = true;
        this.isToasterVisible = true;
        this.isFromCareerPlugin = false;
        this.isRememberPassword = false;
        this.userForm = this.formBuilder.group({
            'email': ['', [validation_service_1.ValidationService.requireEmailValidator, validation_service_1.ValidationService.emailValidator]],
            'password': ['', [validation_service_1.ValidationService.requirePasswordValidator]]
        });
        this.MY_LOGO_PATH = index_1.ImagePath.MY_WHITE_LOGO;
        this.APP_NAME = constants_1.ProjectAsset.APP_NAME;
        this.MY_TAG_LINE = constants_1.ProjectAsset.TAG_LINE;
        this.UNDER_LICENCE = constants_1.ProjectAsset.UNDER_LICENECE;
        this.EMAIL_ICON = index_1.ImagePath.EMAIL_ICON;
        this.PASSWORD_ICON = index_1.ImagePath.PASSWORD_ICON;
        this.BODY_BACKGROUND = index_1.ImagePath.BODY_BACKGROUND;
        this.isChrome = this.sharedService.getUserBrowser();
        this.isToasterVisible = this.sharedService.getToasterVisiblity();
    }
    LoginComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.mainHeaderMenuHideShow = 'signin';
        this.activatedRoute.queryParams.subscribe(function (params) {
            if (params['email'] !== undefined) {
                _this.userForm.controls['email'].setValue(params['email']);
            }
            if (parseInt(local_storage_service_1.LocalStorageService.getLocalValue(constants_1.LocalStorage.IS_LOGGED_IN)) === 1) {
                _this.userForm.controls['email'].setValue(index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.EMAIL_ID));
                _this.userForm.controls['password'].setValue(index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.PASSWORD));
                _this.isRememberPassword = true;
            }
            else {
                _this.isRememberPassword = false;
            }
            _this.recruiterReferenceId = params['integrationKey'];
            _this.isFromCareerPlugin = (params['integrationKey'] !== undefined) ? true : false;
        });
        if (local_storage_service_1.LocalStorageService.getLocalValue(constants_1.LocalStorage.ACCESS_TOKEN)) {
            this.getUserData();
        }
    };
    LoginComponent.prototype.getUserData = function () {
        var _this = this;
        this.loginService.getUserData()
            .subscribe(function (data) {
            _this.registrationService.onGetUserDataSuccess(data);
        }, function (error) { _this.registrationService.onLoginFailure(error); });
    };
    LoginComponent.prototype.onSubmit = function () {
        this.model = this.userForm.value;
        if (this.model.email === '' || this.model.password === '') {
            this.submitStatus = true;
            return;
        }
        if (!this.userForm.valid) {
            return;
        }
        this.model.email = this.model.email.toLowerCase();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.currentPosition.bind(this), this.locationError.bind(this));
        }
        window.scrollTo(0, 0);
    };
    LoginComponent.prototype.currentPosition = function (position) {
        var _this = this;
        this.loginService.userLogin(this.model)
            .subscribe(function (res) { return (_this.onUserLoginSuccess(res)); }, function (error) { return (_this.onUserLoginFailure(error)); });
    };
    LoginComponent.prototype.onUserLoginSuccess = function (res) {
        if (this.isRememberPassword) {
            local_storage_service_1.LocalStorageService.setLocalValue(constants_1.LocalStorage.ACCESS_TOKEN, res.access_token);
            local_storage_service_1.LocalStorageService.setLocalValue(constants_1.LocalStorage.IS_LOGGED_IN, 1);
            local_storage_service_1.LocalStorageService.setLocalValue(constants_1.LocalStorage.FIRST_NAME, res.data.first_name);
            index_1.SessionStorageService.setSessionValue(index_1.SessionStorage.PASSWORD, this.model.password);
        }
        else {
            local_storage_service_1.LocalStorageService.setLocalValue(constants_1.LocalStorage.IS_LOGGED_IN, 0);
        }
        index_1.SessionStorageService.setSessionValue(index_1.SessionStorage.EMAIL_ID, res.data.email);
        index_1.SessionStorageService.setSessionValue(index_1.SessionStorage.MOBILE_NUMBER, res.data.mobile_number);
        index_1.SessionStorageService.setSessionValue(index_1.SessionStorage.FIRST_NAME, res.data.first_name);
        this.userForm.reset();
        if (res.data.current_theme) {
            index_1.SessionStorageService.setSessionValue(index_1.SessionStorage.MY_THEME, res.data.current_theme);
            this.themeChangeService.change(res.data.current_theme);
        }
        if (res.isSocialLogin) {
            index_1.SessionStorageService.setSessionValue(index_1.SessionStorage.IS_SOCIAL_LOGIN, index_1.AppSettings.IS_SOCIAL_LOGIN_YES);
        }
        else {
            index_1.SessionStorageService.setSessionValue(index_1.SessionStorage.IS_SOCIAL_LOGIN, index_1.AppSettings.IS_SOCIAL_LOGIN_NO);
        }
        this.successRedirect(res);
    };
    LoginComponent.prototype.onUserLoginFailure = function (error) {
        if (error.err_code === 404 || error.err_code === 0) {
            var message = new index_1.Message();
            message.error_msg = error.message;
            message.isError = true;
            this.messageService.message(message);
        }
        else {
            this.isShowErrorMessage = false;
            this.error_msg = error.err_msg;
        }
    };
    LoginComponent.prototype.locationError = function (error) {
        var _this = this;
        this.loginService.userLogin(this.model)
            .subscribe(function (res) { return (_this.onUserLoginSuccess(res)); }, function (error) { return (_this.onUserLoginFailure(error)); });
    };
    LoginComponent.prototype.successRedirect = function (res) {
        index_1.SessionStorageService.setSessionValue(index_1.SessionStorage.IS_LOGGED_IN, 1);
        index_1.SessionStorageService.setSessionValue(index_1.SessionStorage.IS_USER_SIGN_IN, 1);
        index_1.SessionStorageService.setSessionValue(index_1.SessionStorage.PROFILE_PICTURE, res.data.picture);
        this._router.navigate([index_1.NavigationRoutes.APP_DASHBOARD]);
    };
    LoginComponent.prototype.onSignUp = function () {
        this._router.navigate([index_1.NavigationRoutes.APP_REGISTRATION]);
    };
    LoginComponent.prototype.onForgotPassword = function () {
        this._router.navigate([index_1.NavigationRoutes.APP_FORGOTPASSWORD, { email: this.userForm.value.email }]);
    };
    LoginComponent.prototype.OnRememberPassword = function (event) {
        if (event.target.checked) {
            this.isRememberPassword = true;
        }
        else {
            this.isRememberPassword = false;
        }
    };
    LoginComponent.prototype.getMessages = function () {
        return constants_1.Messages;
    };
    LoginComponent.prototype.getLabel = function () {
        return constants_1.Label;
    };
    __decorate([
        core_1.ViewChild('toaster'),
        __metadata("design:type", core_1.ElementRef)
    ], LoginComponent.prototype, "toaster", void 0);
    LoginComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'tpl-login',
            templateUrl: 'login.component.html',
            styleUrls: ['login.component.css'],
        }),
        __metadata("design:paramtypes", [router_1.Router, login_service_1.LoginService, index_1.ThemeChangeService,
            index_1.MessageService, forms_1.FormBuilder,
            shared_service_1.SharedService, router_1.ActivatedRoute,
            registration_service_1.RegistrationService])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvbG9naW4vbG9naW4uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsc0NBQXlFO0FBQ3pFLDBDQUFpRTtBQUNqRSxpREFBK0M7QUFDL0MsaURBQWdEO0FBQ2hELDRDQVM0QjtBQUM1Qix3Q0FBd0Q7QUFDeEQsd0ZBQXNGO0FBQ3RGLG9EQUFxRjtBQUNyRix1RUFBcUU7QUFDckUsaUZBQStFO0FBQy9FLHVGQUFvRjtBQVNwRjtJQXFCRSx3QkFBb0IsT0FBZSxFQUFVLFlBQTBCLEVBQVUsa0JBQXNDLEVBQ25HLGNBQThCLEVBQVUsV0FBd0IsRUFDaEUsYUFBNEIsRUFBVSxjQUE4QixFQUNwRSxtQkFBdUM7UUFIdkMsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUFVLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBQVUsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFvQjtRQUNuRyxtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFBVSxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUNoRSxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUFVLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUNwRSx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQW9CO1FBdEJuRCxVQUFLLEdBQUcsSUFBSSxhQUFLLEVBQUUsQ0FBQztRQUc1Qix1QkFBa0IsR0FBWSxJQUFJLENBQUM7UUFXbkMscUJBQWdCLEdBQVksSUFBSSxDQUFDO1FBQ2pDLHVCQUFrQixHQUFZLEtBQUssQ0FBQztRQUVwQyx1QkFBa0IsR0FBWSxLQUFLLENBQUM7UUFNbEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQztZQUNyQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxzQ0FBaUIsQ0FBQyxxQkFBcUIsRUFBRSxzQ0FBaUIsQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUMxRixVQUFVLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxz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QzNCLEVBQUUsQ0FBQSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUN4QixJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDO1FBQ2pDLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxLQUFLLENBQUM7UUFDbEMsQ0FBQztJQUNILENBQUM7SUFFRCxvQ0FBVyxHQUFYO1FBQ0UsTUFBTSxDQUFDLG9CQUFRLENBQUM7SUFDbEIsQ0FBQztJQUVELGlDQUFRLEdBQVI7UUFDRSxNQUFNLENBQUMsaUJBQUssQ0FBQztJQUNmLENBQUM7SUFoTHFCO1FBQXJCLGdCQUFTLENBQUMsU0FBUyxDQUFDO2tDQUFVLGlCQUFVO21EQUFDO0lBRC9CLGNBQWM7UUFQMUIsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNuQixRQUFRLEVBQUUsV0FBVztZQUNyQixXQUFXLEVBQUUsc0JBQXNCO1lBQ25DLFNBQVMsRUFBRSxDQUFDLHFCQUFxQixDQUFDO1NBQ25DLENBQUM7eUNBdUI2QixlQUFNLEVBQXdCLDRCQUFZLEVBQThCLDBCQUFrQjtZQUNuRixzQkFBYyxFQUF1QixtQkFBVztZQUNqRCw4QkFBYSxFQUEwQix1QkFBYztZQUNoRCwwQ0FBbUI7T0F4QmhELGNBQWMsQ0FtTDFCO0lBQUQscUJBQUM7Q0FuTEQsQUFtTEMsSUFBQTtBQW5MWSx3Q0FBYyIsImZpbGUiOiJhcHAvZnJhbWV3b3JrL2xvZ2luL2xvZ2luLmNvbXBvbmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRWxlbWVudFJlZiwgT25Jbml0LCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGUsIFBhcmFtcywgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcclxuaW1wb3J0IHsgTG9naW5TZXJ2aWNlIH0gZnJvbSAnLi9sb2dpbi5zZXJ2aWNlJztcclxuaW1wb3J0IHsgTG9naW4gfSBmcm9tICcuLi8uLi91c2VyL21vZGVscy9sb2dpbic7XHJcbmltcG9ydCB7XHJcbiAgQXBwU2V0dGluZ3MsXHJcbiAgSW1hZ2VQYXRoLFxyXG4gIFNlc3Npb25TdG9yYWdlLFxyXG4gIFNlc3Npb25TdG9yYWdlU2VydmljZSxcclxuICBNZXNzYWdlLFxyXG4gIE1lc3NhZ2VTZXJ2aWNlLFxyXG4gIE5hdmlnYXRpb25Sb3V0ZXMsXHJcbiAgVGhlbWVDaGFuZ2VTZXJ2aWNlXHJcbn0gZnJvbSAnLi4vLi4vc2hhcmVkL2luZGV4JztcclxuaW1wb3J0IHsgRm9ybUJ1aWxkZXIsIEZvcm1Hcm91cCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuaW1wb3J0IHsgVmFsaWRhdGlvblNlcnZpY2UgfSBmcm9tICcuLi8uLi9zaGFyZWQvY3VzdG9tdmFsaWRhdGlvbnMvdmFsaWRhdGlvbi5zZXJ2aWNlJztcclxuaW1wb3J0IHsgTGFiZWwsIExvY2FsU3RvcmFnZSwgTWVzc2FnZXMsIFByb2plY3RBc3NldCB9IGZyb20gJy4uLy4uL3NoYXJlZC9jb25zdGFudHMnO1xyXG5pbXBvcnQgeyBTaGFyZWRTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2hhcmVkL3NlcnZpY2VzL3NoYXJlZC1zZXJ2aWNlJztcclxuaW1wb3J0IHsgUmVnaXN0cmF0aW9uU2VydmljZSB9IGZyb20gJy4uLy4uL3VzZXIvc2VydmljZXMvcmVnaXN0cmF0aW9uLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBMb2NhbFN0b3JhZ2VTZXJ2aWNlIH0gZnJvbSAnLi8uLi8uLi9zaGFyZWQvc2VydmljZXMvbG9jYWwtc3RvcmFnZS5zZXJ2aWNlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIG1vZHVsZUlkOiBtb2R1bGUuaWQsXHJcbiAgc2VsZWN0b3I6ICd0cGwtbG9naW4nLFxyXG4gIHRlbXBsYXRlVXJsOiAnbG9naW4uY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWydsb2dpbi5jb21wb25lbnQuY3NzJ10sXHJcbn0pXHJcblxyXG5leHBvcnQgY2xhc3MgTG9naW5Db21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gIEBWaWV3Q2hpbGQoJ3RvYXN0ZXInKSB0b2FzdGVyOiBFbGVtZW50UmVmO1xyXG4gIHByaXZhdGUgbW9kZWwgPSBuZXcgTG9naW4oKTtcclxuICB1c2VyRm9ybTogRm9ybUdyb3VwO1xyXG4gIGVycm9yX21zZzogc3RyaW5nO1xyXG4gIGlzU2hvd0Vycm9yTWVzc2FnZTogYm9vbGVhbiA9IHRydWU7XHJcbiAgcHJpdmF0ZSBNWV9MT0dPX1BBVEg6IHN0cmluZztcclxuICBwcml2YXRlIEVNQUlMX0lDT046IHN0cmluZztcclxuICBwcml2YXRlIFBBU1NXT1JEX0lDT046IHN0cmluZztcclxuICBwcml2YXRlIEFQUF9OQU1FOiBzdHJpbmc7XHJcbiAgcHJpdmF0ZSBNWV9UQUdfTElORTogc3RyaW5nO1xyXG4gIHByaXZhdGUgVU5ERVJfTElDRU5DRTogc3RyaW5nO1xyXG4gIHByaXZhdGUgQk9EWV9CQUNLR1JPVU5EOiBzdHJpbmc7XHJcbiAgc3VibWl0U3RhdHVzOiBib29sZWFuO1xyXG4gIG1haW5IZWFkZXJNZW51SGlkZVNob3c6IHN0cmluZztcclxuICBpc0Nocm9tZTogYm9vbGVhbjtcclxuICBpc1RvYXN0ZXJWaXNpYmxlOiBib29sZWFuID0gdHJ1ZTtcclxuICBpc0Zyb21DYXJlZXJQbHVnaW46IGJvb2xlYW4gPSBmYWxzZTtcclxuICByZWNydWl0ZXJSZWZlcmVuY2VJZDogc3RyaW5nO1xyXG4gIGlzUmVtZW1iZXJQYXNzd29yZDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9yb3V0ZXI6IFJvdXRlciwgcHJpdmF0ZSBsb2dpblNlcnZpY2U6IExvZ2luU2VydmljZSwgcHJpdmF0ZSB0aGVtZUNoYW5nZVNlcnZpY2U6IFRoZW1lQ2hhbmdlU2VydmljZSxcclxuICAgICAgICAgICAgICBwcml2YXRlIG1lc3NhZ2VTZXJ2aWNlOiBNZXNzYWdlU2VydmljZSwgcHJpdmF0ZSBmb3JtQnVpbGRlcjogRm9ybUJ1aWxkZXIsXHJcbiAgICAgICAgICAgICAgcHJpdmF0ZSBzaGFyZWRTZXJ2aWNlOiBTaGFyZWRTZXJ2aWNlLCBwcml2YXRlIGFjdGl2YXRlZFJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSxcclxuICAgICAgICAgICAgICBwcml2YXRlIHJlZ2lzdHJhdGlvblNlcnZpY2U6UmVnaXN0cmF0aW9uU2VydmljZSkge1xyXG4gICAgdGhpcy51c2VyRm9ybSA9IHRoaXMuZm9ybUJ1aWxkZXIuZ3JvdXAoe1xyXG4gICAgICAnZW1haWwnOiBbJycsIFtWYWxpZGF0aW9uU2VydmljZS5yZXF1aXJlRW1haWxWYWxpZGF0b3IsIFZhbGlkYXRpb25TZXJ2aWNlLmVtYWlsVmFsaWRhdG9yXV0sXHJcbiAgICAgICdwYXNzd29yZCc6IFsnJywgW1ZhbGlkYXRpb25TZXJ2aWNlLnJlcXVpcmVQYXNzd29yZFZhbGlkYXRvcl1dXHJcbiAgICB9KTtcclxuICAgIHRoaXMuTVlfTE9HT19QQVRIID0gSW1hZ2VQYXRoLk1ZX1dISVRFX0xPR087XHJcbiAgICB0aGlzLkFQUF9OQU1FID0gUHJvamVjdEFzc2V0LkFQUF9OQU1FO1xyXG4gICAgdGhpcy5NWV9UQUdfTElORSA9IFByb2plY3RBc3NldC5UQUdfTElORTtcclxuICAgIHRoaXMuVU5ERVJfTElDRU5DRSA9IFByb2plY3RBc3NldC5VTkRFUl9MSUNFTkVDRTtcclxuICAgIHRoaXMuRU1BSUxfSUNPTiA9IEltYWdlUGF0aC5FTUFJTF9JQ09OO1xyXG4gICAgdGhpcy5QQVNTV09SRF9JQ09OID0gSW1hZ2VQYXRoLlBBU1NXT1JEX0lDT047XHJcbiAgICB0aGlzLkJPRFlfQkFDS0dST1VORCA9IEltYWdlUGF0aC5CT0RZX0JBQ0tHUk9VTkQ7XHJcbiAgICB0aGlzLmlzQ2hyb21lID0gdGhpcy5zaGFyZWRTZXJ2aWNlLmdldFVzZXJCcm93c2VyKCk7XHJcbiAgICB0aGlzLmlzVG9hc3RlclZpc2libGUgPSB0aGlzLnNoYXJlZFNlcnZpY2UuZ2V0VG9hc3RlclZpc2libGl0eSgpO1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICB0aGlzLm1haW5IZWFkZXJNZW51SGlkZVNob3cgPSAnc2lnbmluJztcclxuICAgIC8vd2luZG93Lmhpc3RvcnkuZm9yd2FyZCgpO1xyXG4gICAgdGhpcy5hY3RpdmF0ZWRSb3V0ZS5xdWVyeVBhcmFtcy5zdWJzY3JpYmUoKHBhcmFtczogUGFyYW1zKSA9PiB7XHJcbiAgICAgIGlmIChwYXJhbXNbJ2VtYWlsJ10gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHRoaXMudXNlckZvcm0uY29udHJvbHNbJ2VtYWlsJ10uc2V0VmFsdWUocGFyYW1zWydlbWFpbCddKTtcclxuICAgICAgfVxyXG4gICAgICBpZihwYXJzZUludChMb2NhbFN0b3JhZ2VTZXJ2aWNlLmdldExvY2FsVmFsdWUoTG9jYWxTdG9yYWdlLklTX0xPR0dFRF9JTikpPT09MSkge1xyXG5cclxuICAgICAgICB0aGlzLnVzZXJGb3JtLmNvbnRyb2xzWydlbWFpbCddLnNldFZhbHVlKFNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuRU1BSUxfSUQpKTtcclxuICAgICAgICB0aGlzLnVzZXJGb3JtLmNvbnRyb2xzWydwYXNzd29yZCddLnNldFZhbHVlKFNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuUEFTU1dPUkQpKTtcclxuICAgICAgICB0aGlzLmlzUmVtZW1iZXJQYXNzd29yZD10cnVlO1xyXG4gICAgICB9ZWxzZSB7XHJcbiAgICAgICAgdGhpcy5pc1JlbWVtYmVyUGFzc3dvcmQ9ZmFsc2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMucmVjcnVpdGVyUmVmZXJlbmNlSWQgPSBwYXJhbXNbJ2ludGVncmF0aW9uS2V5J107XHJcbiAgICAgIHRoaXMuaXNGcm9tQ2FyZWVyUGx1Z2luID0gKHBhcmFtc1snaW50ZWdyYXRpb25LZXknXSAhPT0gdW5kZWZpbmVkKSA/IHRydWUgOiBmYWxzZTtcclxuICAgIH0pO1xyXG5cclxuXHJcblxyXG4gICAgaWYoTG9jYWxTdG9yYWdlU2VydmljZS5nZXRMb2NhbFZhbHVlKExvY2FsU3RvcmFnZS5BQ0NFU1NfVE9LRU4pKSB7XHJcbiAgICAgIHRoaXMuZ2V0VXNlckRhdGEoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldFVzZXJEYXRhKCkge1xyXG4gICAgdGhpcy5sb2dpblNlcnZpY2UuZ2V0VXNlckRhdGEoKVxyXG4gICAgICAuc3Vic2NyaWJlKFxyXG4gICAgICAgIGRhdGEgPT4ge1xyXG4gICAgICAgICAgdGhpcy5yZWdpc3RyYXRpb25TZXJ2aWNlLm9uR2V0VXNlckRhdGFTdWNjZXNzKGRhdGEpO1xyXG4gICAgICAgIH0sIGVycm9yID0+IHsgdGhpcy5yZWdpc3RyYXRpb25TZXJ2aWNlLm9uTG9naW5GYWlsdXJlKGVycm9yKTt9XHJcbiAgICAgICk7XHJcbiAgfVxyXG5cclxuICBvblN1Ym1pdCgpIHtcclxuICAgIHRoaXMubW9kZWwgPSB0aGlzLnVzZXJGb3JtLnZhbHVlO1xyXG4gICAgaWYgKHRoaXMubW9kZWwuZW1haWwgPT09ICcnIHx8IHRoaXMubW9kZWwucGFzc3dvcmQgPT09ICcnKSB7XHJcbiAgICAgIHRoaXMuc3VibWl0U3RhdHVzID0gdHJ1ZTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghdGhpcy51c2VyRm9ybS52YWxpZCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5tb2RlbC5lbWFpbCA9IHRoaXMubW9kZWwuZW1haWwudG9Mb3dlckNhc2UoKTtcclxuICAgIGlmIChuYXZpZ2F0b3IuZ2VvbG9jYXRpb24pIHtcclxuICAgICAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbih0aGlzLmN1cnJlbnRQb3NpdGlvbi5iaW5kKHRoaXMpLCB0aGlzLmxvY2F0aW9uRXJyb3IuYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcbiAgICB3aW5kb3cuc2Nyb2xsVG8oMCwwKTtcclxuICB9XHJcblxyXG4gIGN1cnJlbnRQb3NpdGlvbihwb3NpdGlvbjogYW55KSB7XHJcbiAgICB0aGlzLmxvZ2luU2VydmljZS51c2VyTG9naW4odGhpcy5tb2RlbClcclxuICAgICAgLnN1YnNjcmliZShcclxuICAgICAgICByZXMgPT4gKHRoaXMub25Vc2VyTG9naW5TdWNjZXNzKHJlcykpLFxyXG4gICAgICAgIGVycm9yID0+ICh0aGlzLm9uVXNlckxvZ2luRmFpbHVyZShlcnJvcikpKTtcclxuICB9XHJcblxyXG4gIG9uVXNlckxvZ2luU3VjY2VzcyhyZXM6IGFueSkge1xyXG4gICAgaWYodGhpcy5pc1JlbWVtYmVyUGFzc3dvcmQpIHtcclxuICAgICAgTG9jYWxTdG9yYWdlU2VydmljZS5zZXRMb2NhbFZhbHVlKExvY2FsU3RvcmFnZS5BQ0NFU1NfVE9LRU4sIHJlcy5hY2Nlc3NfdG9rZW4pO1xyXG4gICAgICBMb2NhbFN0b3JhZ2VTZXJ2aWNlLnNldExvY2FsVmFsdWUoTG9jYWxTdG9yYWdlLklTX0xPR0dFRF9JTiwgMSk7XHJcbiAgICAgIExvY2FsU3RvcmFnZVNlcnZpY2Uuc2V0TG9jYWxWYWx1ZShMb2NhbFN0b3JhZ2UuRklSU1RfTkFNRSwgcmVzLmRhdGEuZmlyc3RfbmFtZSk7XHJcbiAgICAgIFNlc3Npb25TdG9yYWdlU2VydmljZS5zZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuUEFTU1dPUkQsIHRoaXMubW9kZWwucGFzc3dvcmQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgTG9jYWxTdG9yYWdlU2VydmljZS5zZXRMb2NhbFZhbHVlKExvY2FsU3RvcmFnZS5JU19MT0dHRURfSU4sIDApO1xyXG4gICAgfVxyXG4gICAgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLnNldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5FTUFJTF9JRCwgcmVzLmRhdGEuZW1haWwpO1xyXG4gICAgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLnNldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5NT0JJTEVfTlVNQkVSLCByZXMuZGF0YS5tb2JpbGVfbnVtYmVyKTtcclxuICAgIFNlc3Npb25TdG9yYWdlU2VydmljZS5zZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuRklSU1RfTkFNRSwgcmVzLmRhdGEuZmlyc3RfbmFtZSk7XHJcblxyXG4gICAgdGhpcy51c2VyRm9ybS5yZXNldCgpO1xyXG4gICAgaWYgKHJlcy5kYXRhLmN1cnJlbnRfdGhlbWUpIHtcclxuICAgICAgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLnNldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5NWV9USEVNRSwgcmVzLmRhdGEuY3VycmVudF90aGVtZSk7XHJcbiAgICAgIHRoaXMudGhlbWVDaGFuZ2VTZXJ2aWNlLmNoYW5nZShyZXMuZGF0YS5jdXJyZW50X3RoZW1lKTtcclxuICAgIH1cclxuICAgIGlmIChyZXMuaXNTb2NpYWxMb2dpbikge1xyXG4gICAgICBTZXNzaW9uU3RvcmFnZVNlcnZpY2Uuc2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLklTX1NPQ0lBTF9MT0dJTiwgQXBwU2V0dGluZ3MuSVNfU09DSUFMX0xPR0lOX1lFUyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBTZXNzaW9uU3RvcmFnZVNlcnZpY2Uuc2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLklTX1NPQ0lBTF9MT0dJTiwgQXBwU2V0dGluZ3MuSVNfU09DSUFMX0xPR0lOX05PKTtcclxuICAgIH1cclxuICAgIHRoaXMuc3VjY2Vzc1JlZGlyZWN0KHJlcyk7XHJcbiAgfVxyXG5cclxuICBvblVzZXJMb2dpbkZhaWx1cmUoZXJyb3I6IGFueSkge1xyXG5cclxuICAgIGlmIChlcnJvci5lcnJfY29kZSA9PT0gNDA0IHx8IGVycm9yLmVycl9jb2RlID09PSAwKSB7XHJcbiAgICAgIHZhciBtZXNzYWdlID0gbmV3IE1lc3NhZ2UoKTtcclxuICAgICAgbWVzc2FnZS5lcnJvcl9tc2cgPSBlcnJvci5tZXNzYWdlO1xyXG4gICAgICBtZXNzYWdlLmlzRXJyb3IgPSB0cnVlO1xyXG5cclxuICAgICAgdGhpcy5tZXNzYWdlU2VydmljZS5tZXNzYWdlKG1lc3NhZ2UpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5pc1Nob3dFcnJvck1lc3NhZ2UgPSBmYWxzZTtcclxuICAgICAgdGhpcy5lcnJvcl9tc2cgPSBlcnJvci5lcnJfbXNnO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbG9jYXRpb25FcnJvcihlcnJvcjogYW55KSB7XHJcbiAgICB0aGlzLmxvZ2luU2VydmljZS51c2VyTG9naW4odGhpcy5tb2RlbClcclxuICAgICAgLnN1YnNjcmliZShcclxuICAgICAgICByZXMgPT4gKHRoaXMub25Vc2VyTG9naW5TdWNjZXNzKHJlcykpLFxyXG4gICAgICAgIGVycm9yID0+ICh0aGlzLm9uVXNlckxvZ2luRmFpbHVyZShlcnJvcikpKTtcclxuICB9XHJcblxyXG4gIHN1Y2Nlc3NSZWRpcmVjdChyZXM6IGFueSkge1xyXG4gICAgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLnNldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5JU19MT0dHRURfSU4sIDEpO1xyXG4gICAgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLnNldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5JU19VU0VSX1NJR05fSU4sIDEpO1xyXG4gICAgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLnNldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5QUk9GSUxFX1BJQ1RVUkUsIHJlcy5kYXRhLnBpY3R1cmUpO1xyXG4gICAgdGhpcy5fcm91dGVyLm5hdmlnYXRlKFtOYXZpZ2F0aW9uUm91dGVzLkFQUF9EQVNIQk9BUkRdKTtcclxuICB9XHJcblxyXG4gIG9uU2lnblVwKCkge1xyXG4gICAgdGhpcy5fcm91dGVyLm5hdmlnYXRlKFtOYXZpZ2F0aW9uUm91dGVzLkFQUF9SRUdJU1RSQVRJT05dKTtcclxuICB9XHJcblxyXG4gIG9uRm9yZ290UGFzc3dvcmQoKSB7XHJcbiAgICB0aGlzLl9yb3V0ZXIubmF2aWdhdGUoW05hdmlnYXRpb25Sb3V0ZXMuQVBQX0ZPUkdPVFBBU1NXT1JELCB7ZW1haWw6IHRoaXMudXNlckZvcm0udmFsdWUuZW1haWx9XSk7XHJcbiAgfVxyXG5cclxuICBPblJlbWVtYmVyUGFzc3dvcmQoZXZlbnQ6IGFueSkge1xyXG4gICAgaWYoZXZlbnQudGFyZ2V0LmNoZWNrZWQpIHtcclxuICAgICAgdGhpcy5pc1JlbWVtYmVyUGFzc3dvcmQgPSB0cnVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5pc1JlbWVtYmVyUGFzc3dvcmQgPSBmYWxzZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldE1lc3NhZ2VzKCkge1xyXG4gICAgcmV0dXJuIE1lc3NhZ2VzO1xyXG4gIH1cclxuXHJcbiAgZ2V0TGFiZWwoKSB7XHJcbiAgICByZXR1cm4gTGFiZWw7XHJcbiAgfVxyXG5cclxufVxyXG5cclxuIl19
