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
var candidate_1 = require("../../../user/models/candidate");
var constants_1 = require("../../../shared/constants");
var session_service_1 = require("../../../shared/services/session.service");
var local_storage_service_1 = require("../../../shared/services/local-storage.service");
var profile_service_1 = require("../../shared/profileservice/profile.service");
var DashboardHeaderComponent = (function () {
    function DashboardHeaderComponent(_router, _eref, profileService) {
        var _this = this;
        this._router = _router;
        this._eref = _eref;
        this.profileService = profileService;
        this.isClassVisible = false;
        this.isOpenProfile = false;
        this.HEADER_LOGO = constants_1.ImagePath.HEADER_LOGO;
        this.MOBILE_LOGO = constants_1.ImagePath.MOBILE_WHITE_LOGO;
        this.user_first_name = session_service_1.SessionStorageService.getSessionValue(constants_1.SessionStorage.FIRST_NAME);
        profileService.profileUpdateObservable$.subscribe(function (user) {
            if (user.first_name) {
                _this.user_first_name = user.first_name;
            }
        });
    }
    DashboardHeaderComponent.prototype.onClick = function (event) {
        if (!this._eref.nativeElement.contains(event.target)) {
            this.isOpenProfile = false;
        }
    };
    DashboardHeaderComponent.prototype.getImagePath = function (imagePath) {
        if (imagePath !== undefined) {
            return constants_1.AppSettings.IP + imagePath.replace('"', '');
        }
        return null;
    };
    DashboardHeaderComponent.prototype.logOut = function () {
        if (parseInt(local_storage_service_1.LocalStorageService.getLocalValue(constants_1.LocalStorage.IS_LOGGED_IN)) != 1) {
            window.sessionStorage.clear();
            window.localStorage.clear();
        }
        var host = constants_1.AppSettings.HTTP_CLIENT + constants_1.AppSettings.HOST_NAME;
        window.location.href = host;
    };
    DashboardHeaderComponent.prototype.navigateToWithId = function (nav) {
        var userId = session_service_1.SessionStorageService.getSessionValue(constants_1.SessionStorage.USER_ID);
        this._router.navigate([nav, userId]);
    };
    DashboardHeaderComponent.prototype.navigateTo = function (nav) {
        this.deleteProjectDetailsFromSessionStorege();
        this._router.navigate([nav]);
        this.closeMenu();
    };
    DashboardHeaderComponent.prototype.deleteProjectDetailsFromSessionStorege = function () {
        sessionStorage.removeItem(constants_1.SessionStorage.CURRENT_PROJECT_ID);
        sessionStorage.removeItem(constants_1.SessionStorage.CURRENT_PROJECT_NAME);
        sessionStorage.removeItem(constants_1.SessionStorage.CURRENT_VIEW);
    };
    DashboardHeaderComponent.prototype.toggleMenu = function () {
        this.isClassVisible = !this.isClassVisible;
        this.isOpenProfile = false;
    };
    DashboardHeaderComponent.prototype.openDropdownProfile = function () {
        this.isOpenProfile = !this.isOpenProfile;
    };
    DashboardHeaderComponent.prototype.closeMenu = function () {
        this.isClassVisible = false;
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", candidate_1.Candidate)
    ], DashboardHeaderComponent.prototype, "candidate", void 0);
    __decorate([
        core_1.HostListener('document:click', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], DashboardHeaderComponent.prototype, "onClick", null);
    DashboardHeaderComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'tpl-dashboard-header',
            templateUrl: 'dashboard-header.component.html',
            styleUrls: ['dashboard-header.component.css'],
        }),
        __metadata("design:paramtypes", [router_1.Router, core_1.ElementRef,
            profile_service_1.ProfileService])
    ], DashboardHeaderComponent);
    return DashboardHeaderComponent;
}());
exports.DashboardHeaderComponent = DashboardHeaderComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGFzaGJvYXJkL2Rhc2hib2FyZC1oZWFkZXIvZGFzaGJvYXJkLWhlYWRlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxzQ0FBMkU7QUFDM0UsMENBQXlDO0FBQ3pDLDREQUEyRDtBQUMzRCx1REFBaUc7QUFDakcsNEVBQWlGO0FBQ2pGLHdGQUFxRjtBQUVyRiwrRUFBMkU7QUFTM0U7SUFpQkUsa0NBQW9CLE9BQWUsRUFBVSxLQUFpQixFQUN0RCxjQUE4QjtRQUR0QyxpQkFXQztRQVhtQixZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQVUsVUFBSyxHQUFMLEtBQUssQ0FBWTtRQUN0RCxtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFoQi9CLG1CQUFjLEdBQVksS0FBSyxDQUFDO1FBQ2hDLGtCQUFhLEdBQVksS0FBSyxDQUFDO1FBZ0JwQyxJQUFJLENBQUMsV0FBVyxHQUFHLHFCQUFTLENBQUMsV0FBVyxDQUFDO1FBQ3pDLElBQUksQ0FBQyxXQUFXLEdBQUcscUJBQVMsQ0FBQyxpQkFBaUIsQ0FBQztRQUMvQyxJQUFJLENBQUMsZUFBZSxHQUFHLHVDQUFxQixDQUFDLGVBQWUsQ0FBQywwQkFBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3hGLGNBQWMsQ0FBQyx3QkFBd0IsQ0FBQyxTQUFTLENBQy9DLFVBQUMsSUFBaUI7WUFDaEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLEtBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUN6QyxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBbEIyQywwQ0FBTyxHQUFQLFVBQVEsS0FBVTtRQUM1RCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JELElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO1FBRTdCLENBQUM7SUFDSCxDQUFDO0lBZUQsK0NBQVksR0FBWixVQUFhLFNBQWlCO1FBQzVCLEVBQUUsQ0FBQyxDQUFDLFNBQVMsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQzVCLE1BQU0sQ0FBQyx1QkFBVyxDQUFDLEVBQUUsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNyRCxDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCx5Q0FBTSxHQUFOO1FBQ0UsRUFBRSxDQUFBLENBQUMsUUFBUSxDQUFDLDJDQUFtQixDQUFDLGFBQWEsQ0FBQyx3QkFBWSxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3RSxNQUFNLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQzlCLE1BQU0sQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDOUIsQ0FBQztRQUNELElBQUksSUFBSSxHQUFHLHVCQUFXLENBQUMsV0FBVyxHQUFHLHVCQUFXLENBQUMsU0FBUyxDQUFDO1FBQzNELE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUM5QixDQUFDO0lBRUQsbURBQWdCLEdBQWhCLFVBQWlCLEdBQVU7UUFDekIsSUFBSSxNQUFNLEdBQUcsdUNBQXFCLENBQUMsZUFBZSxDQUFDLDBCQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDM0UsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBRUQsNkNBQVUsR0FBVixVQUFXLEdBQVU7UUFDbkIsSUFBSSxDQUFDLHNDQUFzQyxFQUFFLENBQUM7UUFDOUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNuQixDQUFDO0lBRUQseUVBQXNDLEdBQXRDO1FBQ0UsY0FBYyxDQUFDLFVBQVUsQ0FBQywwQkFBYyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDN0QsY0FBYyxDQUFDLFVBQVUsQ0FBQywwQkFBYyxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDL0QsY0FBYyxDQUFDLFVBQVUsQ0FBQywwQkFBYyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFRCw2Q0FBVSxHQUFWO1FBQ0UsSUFBSSxDQUFDLGNBQWMsR0FBRyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUM7UUFDM0MsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7SUFDN0IsQ0FBQztJQUVELHNEQUFtQixHQUFuQjtRQUNFLElBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDO0lBQzNDLENBQUM7SUFFRCw0Q0FBUyxHQUFUO1FBQ0UsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7SUFDOUIsQ0FBQztJQXpFUTtRQUFSLFlBQUssRUFBRTtrQ0FBWSxxQkFBUzsrREFBQztJQVNjO1FBQTNDLG1CQUFZLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7OzsyREFLMUM7SUFmVSx3QkFBd0I7UUFQcEMsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNuQixRQUFRLEVBQUUsc0JBQXNCO1lBQ2hDLFdBQVcsRUFBRSxpQ0FBaUM7WUFDOUMsU0FBUyxFQUFFLENBQUMsZ0NBQWdDLENBQUM7U0FDOUMsQ0FBQzt5Q0FtQjZCLGVBQU0sRUFBaUIsaUJBQVU7WUFDdEMsZ0NBQWM7T0FsQjNCLHdCQUF3QixDQTJFcEM7SUFBRCwrQkFBQztDQTNFRCxBQTJFQyxJQUFBO0FBM0VZLDREQUF3QiIsImZpbGUiOiJhcHAvZnJhbWV3b3JrL2Rhc2hib2FyZC9kYXNoYm9hcmQtaGVhZGVyL2Rhc2hib2FyZC1oZWFkZXIuY29tcG9uZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBIb3N0TGlzdGVuZXIsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XHJcbmltcG9ydCB7IENhbmRpZGF0ZSB9IGZyb20gJy4uLy4uLy4uL3VzZXIvbW9kZWxzL2NhbmRpZGF0ZSc7XHJcbmltcG9ydCB7IEFwcFNldHRpbmdzLCBJbWFnZVBhdGgsIFNlc3Npb25TdG9yYWdlLCBMb2NhbFN0b3JhZ2UgfSBmcm9tICcuLi8uLi8uLi9zaGFyZWQvY29uc3RhbnRzJztcclxuaW1wb3J0IHsgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vc2hhcmVkL3NlcnZpY2VzL3Nlc3Npb24uc2VydmljZSc7XHJcbmltcG9ydCB7IExvY2FsU3RvcmFnZVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zaGFyZWQvc2VydmljZXMvbG9jYWwtc3RvcmFnZS5zZXJ2aWNlJztcclxuaW1wb3J0IHtVc2VyUHJvZmlsZX0gZnJvbSBcIi4uLy4uLy4uL3VzZXIvbW9kZWxzL3VzZXJcIjtcclxuaW1wb3J0IHtQcm9maWxlU2VydmljZX0gZnJvbSBcIi4uLy4uL3NoYXJlZC9wcm9maWxlc2VydmljZS9wcm9maWxlLnNlcnZpY2VcIjtcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIG1vZHVsZUlkOiBtb2R1bGUuaWQsXHJcbiAgc2VsZWN0b3I6ICd0cGwtZGFzaGJvYXJkLWhlYWRlcicsXHJcbiAgdGVtcGxhdGVVcmw6ICdkYXNoYm9hcmQtaGVhZGVyLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnZGFzaGJvYXJkLWhlYWRlci5jb21wb25lbnQuY3NzJ10sXHJcbn0pXHJcblxyXG5leHBvcnQgY2xhc3MgRGFzaGJvYXJkSGVhZGVyQ29tcG9uZW50IHtcclxuICBASW5wdXQoKSBjYW5kaWRhdGU6IENhbmRpZGF0ZTtcclxuICBwdWJsaWMgaXNDbGFzc1Zpc2libGU6IGJvb2xlYW4gPSBmYWxzZTtcclxuICBwdWJsaWMgaXNPcGVuUHJvZmlsZTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIFBST0ZJTEVfSU1HX1BBVEg6IHN0cmluZztcclxuICB1c2VyX2ZpcnN0X25hbWU6IHN0cmluZztcclxuICB1c2VyX2xhc3RfbmFtZTogc3RyaW5nO1xyXG4gIEhFQURFUl9MT0dPOiBzdHJpbmc7XHJcbiAgTU9CSUxFX0xPR086IHN0cmluZztcclxuXHJcbiAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6Y2xpY2snLCBbJyRldmVudCddKSBvbkNsaWNrKGV2ZW50OiBhbnkpIHtcclxuICAgIGlmICghdGhpcy5fZXJlZi5uYXRpdmVFbGVtZW50LmNvbnRhaW5zKGV2ZW50LnRhcmdldCkpIHtcclxuICAgICAgdGhpcy5pc09wZW5Qcm9maWxlID0gZmFsc2U7XHJcblxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfcm91dGVyOiBSb3V0ZXIsIHByaXZhdGUgX2VyZWY6IEVsZW1lbnRSZWYsXHJcbiAgcHJpdmF0ZSBwcm9maWxlU2VydmljZTogUHJvZmlsZVNlcnZpY2UpIHtcclxuICAgIHRoaXMuSEVBREVSX0xPR08gPSBJbWFnZVBhdGguSEVBREVSX0xPR087XHJcbiAgICB0aGlzLk1PQklMRV9MT0dPID0gSW1hZ2VQYXRoLk1PQklMRV9XSElURV9MT0dPO1xyXG4gICAgdGhpcy51c2VyX2ZpcnN0X25hbWUgPSBTZXNzaW9uU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkZJUlNUX05BTUUpO1xyXG4gICAgcHJvZmlsZVNlcnZpY2UucHJvZmlsZVVwZGF0ZU9ic2VydmFibGUkLnN1YnNjcmliZShcclxuICAgICAgKHVzZXI6IFVzZXJQcm9maWxlKSA9PiB7XHJcbiAgICAgICAgaWYgKHVzZXIuZmlyc3RfbmFtZSkge1xyXG4gICAgICAgICAgdGhpcy51c2VyX2ZpcnN0X25hbWUgPSB1c2VyLmZpcnN0X25hbWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldEltYWdlUGF0aChpbWFnZVBhdGg6IHN0cmluZykge1xyXG4gICAgaWYgKGltYWdlUGF0aCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHJldHVybiBBcHBTZXR0aW5ncy5JUCArIGltYWdlUGF0aC5yZXBsYWNlKCdcIicsICcnKTtcclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgbG9nT3V0KCkge1xyXG4gICAgaWYocGFyc2VJbnQoTG9jYWxTdG9yYWdlU2VydmljZS5nZXRMb2NhbFZhbHVlKExvY2FsU3RvcmFnZS5JU19MT0dHRURfSU4pKSE9MSkge1xyXG4gICAgICB3aW5kb3cuc2Vzc2lvblN0b3JhZ2UuY2xlYXIoKTtcclxuICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5jbGVhcigpO1xyXG4gICAgfVxyXG4gICAgbGV0IGhvc3QgPSBBcHBTZXR0aW5ncy5IVFRQX0NMSUVOVCArIEFwcFNldHRpbmdzLkhPU1RfTkFNRTtcclxuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gaG9zdDtcclxuICB9XHJcblxyXG4gIG5hdmlnYXRlVG9XaXRoSWQobmF2OnN0cmluZykge1xyXG4gICAgdmFyIHVzZXJJZCA9IFNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuVVNFUl9JRCk7XHJcbiAgICB0aGlzLl9yb3V0ZXIubmF2aWdhdGUoW25hdiwgdXNlcklkXSk7XHJcbiAgfVxyXG5cclxuICBuYXZpZ2F0ZVRvKG5hdjpzdHJpbmcpIHtcclxuICAgIHRoaXMuZGVsZXRlUHJvamVjdERldGFpbHNGcm9tU2Vzc2lvblN0b3JlZ2UoKTtcclxuICAgIHRoaXMuX3JvdXRlci5uYXZpZ2F0ZShbbmF2XSk7XHJcbiAgICB0aGlzLmNsb3NlTWVudSgpO1xyXG4gIH1cclxuXHJcbiAgZGVsZXRlUHJvamVjdERldGFpbHNGcm9tU2Vzc2lvblN0b3JlZ2UoKSB7XHJcbiAgICBzZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKFNlc3Npb25TdG9yYWdlLkNVUlJFTlRfUFJPSkVDVF9JRCk7XHJcbiAgICBzZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKFNlc3Npb25TdG9yYWdlLkNVUlJFTlRfUFJPSkVDVF9OQU1FKTtcclxuICAgIHNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oU2Vzc2lvblN0b3JhZ2UuQ1VSUkVOVF9WSUVXKTtcclxuICB9XHJcblxyXG4gIHRvZ2dsZU1lbnUoKSB7XHJcbiAgICB0aGlzLmlzQ2xhc3NWaXNpYmxlID0gIXRoaXMuaXNDbGFzc1Zpc2libGU7XHJcbiAgICB0aGlzLmlzT3BlblByb2ZpbGUgPSBmYWxzZTtcclxuICB9XHJcblxyXG4gIG9wZW5Ecm9wZG93blByb2ZpbGUoKSB7XHJcbiAgICB0aGlzLmlzT3BlblByb2ZpbGUgPSAhdGhpcy5pc09wZW5Qcm9maWxlO1xyXG4gIH1cclxuXHJcbiAgY2xvc2VNZW51KCkge1xyXG4gICAgdGhpcy5pc0NsYXNzVmlzaWJsZSA9IGZhbHNlO1xyXG4gIH1cclxufVxyXG4iXX0=
