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
var index_1 = require("../../../shared/index");
var router_1 = require("@angular/router");
var profile_service_1 = require("../../shared/profileservice/profile.service");
var user_1 = require("../../../user/models/user");
var dashboard_service_1 = require("../../../user/services/dashboard.service");
var constants_1 = require("../../../shared/constants");
var session_service_1 = require("../../../shared/services/session.service");
var HeaderComponent = (function () {
    function HeaderComponent(_router, commonService, dashboardService, profileService, messageService, _eref) {
        var _this = this;
        this._router = _router;
        this.commonService = commonService;
        this.dashboardService = dashboardService;
        this.profileService = profileService;
        this.messageService = messageService;
        this._eref = _eref;
        this.model = new user_1.UserProfile();
        this.isClassVisible = false;
        this.isOpenProfile = false;
        this.isOpenNotification = false;
        this.subscription = profileService.profileUpdateObservable$.subscribe(function (user) {
            _this.onUserProfileSuccess(user);
        });
        this.PROFILE_IMG_PATH = constants_1.ImagePath.PROFILE_IMG_ICON;
        this.MY_LOGO = constants_1.ImagePath.MY_WHITE_LOGO;
    }
    HeaderComponent.prototype.onClick = function (event) {
        if (!this._eref.nativeElement.contains(event.target)) {
            this.isOpenProfile = false;
            this.isOpenNotification = false;
        }
    };
    HeaderComponent.prototype.ngOnInit = function () {
        this.newUser = parseInt(session_service_1.SessionStorageService.getSessionValue(constants_1.SessionStorage.IS_LOGGED_IN));
        if (this.newUser === 0) {
            this._router.navigate([constants_1.NavigationRoutes.APP_START]);
        }
        else {
            this.getUserProfile();
        }
    };
    HeaderComponent.prototype.getUserProfile = function () {
        var _this = this;
        this.dashboardService.getUserProfile()
            .subscribe(function (userprofile) { return _this.onUserProfileSuccess(userprofile); }, function (error) { return _this.OnUserProfileFailure(error); });
    };
    HeaderComponent.prototype.onUserProfileSuccess = function (user) {
        this.model = user.data;
        var socialLogin = session_service_1.SessionStorageService.getSessionValue(constants_1.SessionStorage.IS_SOCIAL_LOGIN);
        if (socialLogin === constants_1.AppSettings.IS_SOCIAL_LOGIN_YES) {
            this.PROFILE_IMG_PATH = this.model.social_profile_picture;
        }
        else if (!this.model.picture || this.model.picture === undefined) {
            this.PROFILE_IMG_PATH = constants_1.ImagePath.PROFILE_IMG_ICON;
        }
        else {
            this.PROFILE_IMG_PATH = constants_1.AppSettings.IP + this.model.picture;
        }
    };
    HeaderComponent.prototype.OnUserProfileFailure = function (error) {
        var message = new index_1.Message();
        message.error_msg = error.err_msg;
        message.isError = true;
        this.messageService.message(message);
    };
    HeaderComponent.prototype.navigateTo = function (nav) {
        if (nav !== undefined) {
            this._router.navigate([nav]);
        }
    };
    HeaderComponent.prototype.toggleMenu = function () {
        this.isClassVisible = !this.isClassVisible;
        this.isOpenNotification = false;
        this.isOpenProfile = false;
    };
    HeaderComponent.prototype.openDropdownNotification = function () {
        this.isOpenNotification = !this.isOpenNotification;
        this.isOpenProfile = false;
    };
    HeaderComponent.prototype.openDropdownProfile = function () {
        this.isOpenProfile = !this.isOpenProfile;
        this.isOpenNotification = false;
    };
    HeaderComponent.prototype.closeMenu = function () {
        this.isClassVisible = false;
    };
    HeaderComponent.prototype.logOut = function () {
        window.sessionStorage.clear();
        window.localStorage.clear();
        this._router.navigate([constants_1.NavigationRoutes.APP_START]);
    };
    HeaderComponent.prototype.closeNotificationDropdown = function () {
        this.isOpenNotification = false;
    };
    __decorate([
        core_1.HostListener('document:click', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], HeaderComponent.prototype, "onClick", null);
    HeaderComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'tpl-header',
            templateUrl: 'header.component.html',
            styleUrls: ['header.component.css'],
        }),
        __metadata("design:paramtypes", [router_1.Router, index_1.CommonService, dashboard_service_1.DashboardService,
            profile_service_1.ProfileService, index_1.MessageService,
            core_1.ElementRef])
    ], HeaderComponent);
    return HeaderComponent;
}());
exports.HeaderComponent = HeaderComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2hhcmVkL2hlYWRlci9oZWFkZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsc0NBQTRFO0FBQzVFLCtDQUErRTtBQUMvRSwwQ0FBeUM7QUFFekMsK0VBQTZFO0FBQzdFLGtEQUF3RDtBQUN4RCw4RUFBNEU7QUFDNUUsdURBQXFHO0FBQ3JHLDRFQUFpRjtBQVNqRjtJQWlCRSx5QkFBb0IsT0FBZSxFQUFVLGFBQTRCLEVBQVUsZ0JBQWtDLEVBQ2pHLGNBQThCLEVBQVUsY0FBOEIsRUFDdEUsS0FBaUI7UUFGckMsaUJBVUM7UUFWbUIsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUFVLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQVUscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNqRyxtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFBVSxtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFDdEUsVUFBSyxHQUFMLEtBQUssQ0FBWTtRQWxCckMsVUFBSyxHQUFHLElBQUksa0JBQVcsRUFBRSxDQUFDO1FBQ25CLG1CQUFjLEdBQVksS0FBSyxDQUFDO1FBQ2hDLGtCQUFhLEdBQVksS0FBSyxDQUFDO1FBQy9CLHVCQUFrQixHQUFZLEtBQUssQ0FBQztRQWdCekMsSUFBSSxDQUFDLFlBQVksR0FBRyxjQUFjLENBQUMsd0JBQXdCLENBQUMsU0FBUyxDQUNuRSxVQUFDLElBQWlCO1lBQ2hCLEtBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQyxDQUFDLENBQUMsQ0FBQztRQUVMLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxxQkFBUyxDQUFDLGdCQUFnQixDQUFDO1FBQ2pELElBQUksQ0FBQyxPQUFPLEdBQUcscUJBQVMsQ0FBQyxhQUFhLENBQUM7SUFDM0MsQ0FBQztJQWpCMkMsaUNBQU8sR0FBUCxVQUFRLEtBQVU7UUFDNUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FB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LCJmaWxlIjoiYXBwL2ZyYW1ld29yay9zaGFyZWQvaGVhZGVyL2hlYWRlci5jb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEhvc3RMaXN0ZW5lciwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENvbW1vblNlcnZpY2UsIE1lc3NhZ2UsIE1lc3NhZ2VTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vc2hhcmVkL2luZGV4JztcclxuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcclxuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcy9TdWJzY3JpcHRpb24nO1xyXG5pbXBvcnQgeyBQcm9maWxlU2VydmljZSB9IGZyb20gJy4uLy4uL3NoYXJlZC9wcm9maWxlc2VydmljZS9wcm9maWxlLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBVc2VyUHJvZmlsZSB9IGZyb20gJy4uLy4uLy4uL3VzZXIvbW9kZWxzL3VzZXInO1xyXG5pbXBvcnQgeyBEYXNoYm9hcmRTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vdXNlci9zZXJ2aWNlcy9kYXNoYm9hcmQuc2VydmljZSc7XHJcbmltcG9ydCB7IEFwcFNldHRpbmdzLCBJbWFnZVBhdGgsIFNlc3Npb25TdG9yYWdlLCBOYXZpZ2F0aW9uUm91dGVzIH0gZnJvbSAnLi4vLi4vLi4vc2hhcmVkL2NvbnN0YW50cyc7XHJcbmltcG9ydCB7IFNlc3Npb25TdG9yYWdlU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NoYXJlZC9zZXJ2aWNlcy9zZXNzaW9uLnNlcnZpY2UnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcclxuICBzZWxlY3RvcjogJ3RwbC1oZWFkZXInLFxyXG4gIHRlbXBsYXRlVXJsOiAnaGVhZGVyLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnaGVhZGVyLmNvbXBvbmVudC5jc3MnXSxcclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBIZWFkZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gIG1vZGVsID0gbmV3IFVzZXJQcm9maWxlKCk7XHJcbiAgcHVibGljIGlzQ2xhc3NWaXNpYmxlOiBib29sZWFuID0gZmFsc2U7XHJcbiAgcHVibGljIGlzT3BlblByb2ZpbGU6IGJvb2xlYW4gPSBmYWxzZTtcclxuICBwdWJsaWMgaXNPcGVuTm90aWZpY2F0aW9uOiBib29sZWFuID0gZmFsc2U7XHJcbiAgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XHJcbiAgUFJPRklMRV9JTUdfUEFUSDogc3RyaW5nO1xyXG4gIE1ZX0xPR086IHN0cmluZztcclxuICBuZXdVc2VyOiBudW1iZXI7XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ2RvY3VtZW50OmNsaWNrJywgWyckZXZlbnQnXSkgb25DbGljayhldmVudDogYW55KSB7XHJcbiAgICBpZiAoIXRoaXMuX2VyZWYubmF0aXZlRWxlbWVudC5jb250YWlucyhldmVudC50YXJnZXQpKSB7XHJcbiAgICAgIHRoaXMuaXNPcGVuUHJvZmlsZSA9IGZhbHNlO1xyXG4gICAgICB0aGlzLmlzT3Blbk5vdGlmaWNhdGlvbiA9IGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfcm91dGVyOiBSb3V0ZXIsIHByaXZhdGUgY29tbW9uU2VydmljZTogQ29tbW9uU2VydmljZSwgcHJpdmF0ZSBkYXNoYm9hcmRTZXJ2aWNlOiBEYXNoYm9hcmRTZXJ2aWNlLFxyXG4gICAgICAgICAgICAgIHByaXZhdGUgcHJvZmlsZVNlcnZpY2U6IFByb2ZpbGVTZXJ2aWNlLCBwcml2YXRlIG1lc3NhZ2VTZXJ2aWNlOiBNZXNzYWdlU2VydmljZSxcclxuICAgICAgICAgICAgICBwcml2YXRlIF9lcmVmOiBFbGVtZW50UmVmKSB7XHJcbiAgICB0aGlzLnN1YnNjcmlwdGlvbiA9IHByb2ZpbGVTZXJ2aWNlLnByb2ZpbGVVcGRhdGVPYnNlcnZhYmxlJC5zdWJzY3JpYmUoXHJcbiAgICAgICh1c2VyOiBVc2VyUHJvZmlsZSkgPT4ge1xyXG4gICAgICAgIHRoaXMub25Vc2VyUHJvZmlsZVN1Y2Nlc3ModXNlcik7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgIHRoaXMuUFJPRklMRV9JTUdfUEFUSCA9IEltYWdlUGF0aC5QUk9GSUxFX0lNR19JQ09OO1xyXG4gICAgICB0aGlzLk1ZX0xPR08gPSBJbWFnZVBhdGguTVlfV0hJVEVfTE9HTztcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgdGhpcy5uZXdVc2VyID0gcGFyc2VJbnQoU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLmdldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5JU19MT0dHRURfSU4pKTtcclxuICAgIGlmICh0aGlzLm5ld1VzZXIgPT09IDApIHtcclxuICAgICAgdGhpcy5fcm91dGVyLm5hdmlnYXRlKFtOYXZpZ2F0aW9uUm91dGVzLkFQUF9TVEFSVF0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5nZXRVc2VyUHJvZmlsZSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0VXNlclByb2ZpbGUoKSB7XHJcbiAgICB0aGlzLmRhc2hib2FyZFNlcnZpY2UuZ2V0VXNlclByb2ZpbGUoKVxyXG4gICAgICAuc3Vic2NyaWJlKFxyXG4gICAgICAgIHVzZXJwcm9maWxlID0+IHRoaXMub25Vc2VyUHJvZmlsZVN1Y2Nlc3ModXNlcnByb2ZpbGUpLFxyXG4gICAgICAgIGVycm9yID0+IHRoaXMuT25Vc2VyUHJvZmlsZUZhaWx1cmUoZXJyb3IpKTtcclxuICB9XHJcblxyXG4gIG9uVXNlclByb2ZpbGVTdWNjZXNzKHVzZXI6IGFueSkge1xyXG4gICAgdGhpcy5tb2RlbCA9IHVzZXIuZGF0YTtcclxuICAgIHZhciBzb2NpYWxMb2dpbjogc3RyaW5nID0gU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLmdldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5JU19TT0NJQUxfTE9HSU4pO1xyXG4gICAgaWYgKHNvY2lhbExvZ2luID09PSBBcHBTZXR0aW5ncy5JU19TT0NJQUxfTE9HSU5fWUVTKSB7XHJcbiAgICAgIHRoaXMuUFJPRklMRV9JTUdfUEFUSCA9IHRoaXMubW9kZWwuc29jaWFsX3Byb2ZpbGVfcGljdHVyZTtcclxuICAgIH0gZWxzZSBpZiAoIXRoaXMubW9kZWwucGljdHVyZSB8fCB0aGlzLm1vZGVsLnBpY3R1cmUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICB0aGlzLlBST0ZJTEVfSU1HX1BBVEggPSBJbWFnZVBhdGguUFJPRklMRV9JTUdfSUNPTjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuUFJPRklMRV9JTUdfUEFUSCA9IEFwcFNldHRpbmdzLklQICsgdGhpcy5tb2RlbC5waWN0dXJlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgT25Vc2VyUHJvZmlsZUZhaWx1cmUoZXJyb3I6IGFueSkge1xyXG4gICAgdmFyIG1lc3NhZ2UgPSBuZXcgTWVzc2FnZSgpO1xyXG4gICAgbWVzc2FnZS5lcnJvcl9tc2cgPSBlcnJvci5lcnJfbXNnO1xyXG4gICAgbWVzc2FnZS5pc0Vycm9yID0gdHJ1ZTtcclxuICAgIHRoaXMubWVzc2FnZVNlcnZpY2UubWVzc2FnZShtZXNzYWdlKTtcclxuICB9XHJcblxyXG4gIG5hdmlnYXRlVG8obmF2OiBzdHJpbmcpIHtcclxuICAgIGlmIChuYXYgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICB0aGlzLl9yb3V0ZXIubmF2aWdhdGUoW25hdl0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdG9nZ2xlTWVudSgpIHtcclxuICAgIHRoaXMuaXNDbGFzc1Zpc2libGUgPSAhdGhpcy5pc0NsYXNzVmlzaWJsZTtcclxuICAgIHRoaXMuaXNPcGVuTm90aWZpY2F0aW9uID0gZmFsc2U7XHJcbiAgICB0aGlzLmlzT3BlblByb2ZpbGUgPSBmYWxzZTtcclxuICB9XHJcblxyXG4gIG9wZW5Ecm9wZG93bk5vdGlmaWNhdGlvbigpIHtcclxuICAgIHRoaXMuaXNPcGVuTm90aWZpY2F0aW9uID0gIXRoaXMuaXNPcGVuTm90aWZpY2F0aW9uO1xyXG4gICAgdGhpcy5pc09wZW5Qcm9maWxlID0gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBvcGVuRHJvcGRvd25Qcm9maWxlKCkge1xyXG4gICAgdGhpcy5pc09wZW5Qcm9maWxlID0gIXRoaXMuaXNPcGVuUHJvZmlsZTtcclxuICAgIHRoaXMuaXNPcGVuTm90aWZpY2F0aW9uID0gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBjbG9zZU1lbnUoKSB7XHJcbiAgICB0aGlzLmlzQ2xhc3NWaXNpYmxlID0gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBsb2dPdXQoKSB7XHJcbiAgICB3aW5kb3cuc2Vzc2lvblN0b3JhZ2UuY2xlYXIoKTtcclxuICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2UuY2xlYXIoKTtcclxuICAgIHRoaXMuX3JvdXRlci5uYXZpZ2F0ZShbTmF2aWdhdGlvblJvdXRlcy5BUFBfU1RBUlRdKTtcclxuICB9XHJcblxyXG4gIGNsb3NlTm90aWZpY2F0aW9uRHJvcGRvd24oKSB7XHJcbiAgICB0aGlzLmlzT3Blbk5vdGlmaWNhdGlvbiA9IGZhbHNlO1xyXG4gIH1cclxufVxyXG4iXX0=
