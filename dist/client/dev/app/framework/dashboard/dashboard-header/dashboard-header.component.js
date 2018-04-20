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
            if (user.company_name) {
                session_service_1.SessionStorageService.setSessionValue(constants_1.SessionStorage.COMPANY_NAME, user.company_name);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGFzaGJvYXJkL2Rhc2hib2FyZC1oZWFkZXIvZGFzaGJvYXJkLWhlYWRlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxzQ0FBMkU7QUFDM0UsMENBQXlDO0FBQ3pDLDREQUEyRDtBQUMzRCx1REFBaUc7QUFDakcsNEVBQWlGO0FBQ2pGLHdGQUFxRjtBQUVyRiwrRUFBMkU7QUFTM0U7SUFpQkUsa0NBQW9CLE9BQWUsRUFBVSxLQUFpQixFQUN0RCxjQUE4QjtRQUR0QyxpQkFjQztRQWRtQixZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQVUsVUFBSyxHQUFMLEtBQUssQ0FBWTtRQUN0RCxtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFoQi9CLG1CQUFjLEdBQVksS0FBSyxDQUFDO1FBQ2hDLGtCQUFhLEdBQVksS0FBSyxDQUFDO1FBZ0JwQyxJQUFJLENBQUMsV0FBVyxHQUFHLHFCQUFTLENBQUMsV0FBVyxDQUFDO1FBQ3pDLElBQUksQ0FBQyxXQUFXLEdBQUcscUJBQVMsQ0FBQyxpQkFBaUIsQ0FBQztRQUMvQyxJQUFJLENBQUMsZUFBZSxHQUFHLHVDQUFxQixDQUFDLGVBQWUsQ0FBQywwQkFBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3hGLGNBQWMsQ0FBQyx3QkFBd0IsQ0FBQyxTQUFTLENBQy9DLFVBQUMsSUFBaUI7WUFDaEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLEtBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUN6QyxDQUFDO1lBQ0QsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0JBQ3RCLHVDQUFxQixDQUFDLGVBQWUsQ0FBQywwQkFBYyxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDeEYsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFD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QyxnQ0FBYztPQWxCM0Isd0JBQXdCLENBOEVwQztJQUFELCtCQUFDO0NBOUVELEFBOEVDLElBQUE7QUE5RVksNERBQXdCIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvZGFzaGJvYXJkL2Rhc2hib2FyZC1oZWFkZXIvZGFzaGJvYXJkLWhlYWRlci5jb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEhvc3RMaXN0ZW5lciwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcclxuaW1wb3J0IHsgQ2FuZGlkYXRlIH0gZnJvbSAnLi4vLi4vLi4vdXNlci9tb2RlbHMvY2FuZGlkYXRlJztcclxuaW1wb3J0IHsgQXBwU2V0dGluZ3MsIEltYWdlUGF0aCwgU2Vzc2lvblN0b3JhZ2UsIExvY2FsU3RvcmFnZSB9IGZyb20gJy4uLy4uLy4uL3NoYXJlZC9jb25zdGFudHMnO1xyXG5pbXBvcnQgeyBTZXNzaW9uU3RvcmFnZVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zaGFyZWQvc2VydmljZXMvc2Vzc2lvbi5zZXJ2aWNlJztcclxuaW1wb3J0IHsgTG9jYWxTdG9yYWdlU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NoYXJlZC9zZXJ2aWNlcy9sb2NhbC1zdG9yYWdlLnNlcnZpY2UnO1xyXG5pbXBvcnQge1VzZXJQcm9maWxlfSBmcm9tIFwiLi4vLi4vLi4vdXNlci9tb2RlbHMvdXNlclwiO1xyXG5pbXBvcnQge1Byb2ZpbGVTZXJ2aWNlfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3Byb2ZpbGVzZXJ2aWNlL3Byb2ZpbGUuc2VydmljZVwiO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcclxuICBzZWxlY3RvcjogJ3RwbC1kYXNoYm9hcmQtaGVhZGVyJyxcclxuICB0ZW1wbGF0ZVVybDogJ2Rhc2hib2FyZC1oZWFkZXIuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWydkYXNoYm9hcmQtaGVhZGVyLmNvbXBvbmVudC5jc3MnXSxcclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBEYXNoYm9hcmRIZWFkZXJDb21wb25lbnQge1xyXG4gIEBJbnB1dCgpIGNhbmRpZGF0ZTogQ2FuZGlkYXRlO1xyXG4gIHB1YmxpYyBpc0NsYXNzVmlzaWJsZTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIHB1YmxpYyBpc09wZW5Qcm9maWxlOiBib29sZWFuID0gZmFsc2U7XHJcbiAgUFJPRklMRV9JTUdfUEFUSDogc3RyaW5nO1xyXG4gIHVzZXJfZmlyc3RfbmFtZTogc3RyaW5nO1xyXG4gIHVzZXJfbGFzdF9uYW1lOiBzdHJpbmc7XHJcbiAgSEVBREVSX0xPR086IHN0cmluZztcclxuICBNT0JJTEVfTE9HTzogc3RyaW5nO1xyXG5cclxuICBASG9zdExpc3RlbmVyKCdkb2N1bWVudDpjbGljaycsIFsnJGV2ZW50J10pIG9uQ2xpY2soZXZlbnQ6IGFueSkge1xyXG4gICAgaWYgKCF0aGlzLl9lcmVmLm5hdGl2ZUVsZW1lbnQuY29udGFpbnMoZXZlbnQudGFyZ2V0KSkge1xyXG4gICAgICB0aGlzLmlzT3BlblByb2ZpbGUgPSBmYWxzZTtcclxuXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9yb3V0ZXI6IFJvdXRlciwgcHJpdmF0ZSBfZXJlZjogRWxlbWVudFJlZixcclxuICBwcml2YXRlIHByb2ZpbGVTZXJ2aWNlOiBQcm9maWxlU2VydmljZSkge1xyXG4gICAgdGhpcy5IRUFERVJfTE9HTyA9IEltYWdlUGF0aC5IRUFERVJfTE9HTztcclxuICAgIHRoaXMuTU9CSUxFX0xPR08gPSBJbWFnZVBhdGguTU9CSUxFX1dISVRFX0xPR087XHJcbiAgICB0aGlzLnVzZXJfZmlyc3RfbmFtZSA9IFNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuRklSU1RfTkFNRSk7XHJcbiAgICBwcm9maWxlU2VydmljZS5wcm9maWxlVXBkYXRlT2JzZXJ2YWJsZSQuc3Vic2NyaWJlKFxyXG4gICAgICAodXNlcjogVXNlclByb2ZpbGUpID0+IHtcclxuICAgICAgICBpZiAodXNlci5maXJzdF9uYW1lKSB7XHJcbiAgICAgICAgICB0aGlzLnVzZXJfZmlyc3RfbmFtZSA9IHVzZXIuZmlyc3RfbmFtZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHVzZXIuY29tcGFueV9uYW1lKSB7XHJcbiAgICAgICAgICBTZXNzaW9uU3RvcmFnZVNlcnZpY2Uuc2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkNPTVBBTllfTkFNRSwgdXNlci5jb21wYW55X25hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRJbWFnZVBhdGgoaW1hZ2VQYXRoOiBzdHJpbmcpIHtcclxuICAgIGlmIChpbWFnZVBhdGggIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICByZXR1cm4gQXBwU2V0dGluZ3MuSVAgKyBpbWFnZVBhdGgucmVwbGFjZSgnXCInLCAnJyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG4gIGxvZ091dCgpIHtcclxuICAgIGlmKHBhcnNlSW50KExvY2FsU3RvcmFnZVNlcnZpY2UuZ2V0TG9jYWxWYWx1ZShMb2NhbFN0b3JhZ2UuSVNfTE9HR0VEX0lOKSkhPTEpIHtcclxuICAgICAgd2luZG93LnNlc3Npb25TdG9yYWdlLmNsZWFyKCk7XHJcbiAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2UuY2xlYXIoKTtcclxuICAgIH1cclxuICAgIGxldCBob3N0ID0gQXBwU2V0dGluZ3MuSFRUUF9DTElFTlQgKyBBcHBTZXR0aW5ncy5IT1NUX05BTUU7XHJcbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IGhvc3Q7XHJcbiAgfVxyXG5cclxuICBuYXZpZ2F0ZVRvV2l0aElkKG5hdjpzdHJpbmcpIHtcclxuICAgIHZhciB1c2VySWQgPSBTZXNzaW9uU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLlVTRVJfSUQpO1xyXG4gICAgdGhpcy5fcm91dGVyLm5hdmlnYXRlKFtuYXYsIHVzZXJJZF0pO1xyXG4gIH1cclxuXHJcbiAgbmF2aWdhdGVUbyhuYXY6c3RyaW5nKSB7XHJcbiAgICB0aGlzLmRlbGV0ZVByb2plY3REZXRhaWxzRnJvbVNlc3Npb25TdG9yZWdlKCk7XHJcbiAgICB0aGlzLl9yb3V0ZXIubmF2aWdhdGUoW25hdl0pO1xyXG4gICAgdGhpcy5jbG9zZU1lbnUoKTtcclxuICB9XHJcblxyXG4gIGRlbGV0ZVByb2plY3REZXRhaWxzRnJvbVNlc3Npb25TdG9yZWdlKCkge1xyXG4gICAgc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbShTZXNzaW9uU3RvcmFnZS5DVVJSRU5UX1BST0pFQ1RfSUQpO1xyXG4gICAgc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbShTZXNzaW9uU3RvcmFnZS5DVVJSRU5UX1BST0pFQ1RfTkFNRSk7XHJcbiAgICBzZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKFNlc3Npb25TdG9yYWdlLkNVUlJFTlRfVklFVyk7XHJcbiAgfVxyXG5cclxuICB0b2dnbGVNZW51KCkge1xyXG4gICAgdGhpcy5pc0NsYXNzVmlzaWJsZSA9ICF0aGlzLmlzQ2xhc3NWaXNpYmxlO1xyXG4gICAgdGhpcy5pc09wZW5Qcm9maWxlID0gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBvcGVuRHJvcGRvd25Qcm9maWxlKCkge1xyXG4gICAgdGhpcy5pc09wZW5Qcm9maWxlID0gIXRoaXMuaXNPcGVuUHJvZmlsZTtcclxuICB9XHJcblxyXG4gIGNsb3NlTWVudSgpIHtcclxuICAgIHRoaXMuaXNDbGFzc1Zpc2libGUgPSBmYWxzZTtcclxuICB9XHJcbn1cclxuIl19
