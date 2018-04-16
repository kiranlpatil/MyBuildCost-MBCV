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
var dashboard_service_1 = require("../../user/services/dashboard.service");
var user_1 = require("../../user/models/user");
var index_1 = require("../../shared/index");
var DashboardComponent = (function () {
    function DashboardComponent(_router, dashboardService, messageService, profileService, zone) {
        this._router = _router;
        this.dashboardService = dashboardService;
        this.messageService = messageService;
        this.profileService = profileService;
        this.zone = zone;
        this.mode = 'Observable';
        this.model = new user_1.UserProfile();
        this.overlayStyle = false;
    }
    DashboardComponent.prototype.ngOnInit = function () {
        this.newUser = parseInt(index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.IS_LOGGED_IN));
        if (this.newUser === 0) {
            this._router.navigate([index_1.NavigationRoutes.APP_START]);
        }
        else {
            this.getUserProfile();
        }
    };
    DashboardComponent.prototype.getUserProfile = function () {
        var _this = this;
        this.dashboardService.getUserProfile()
            .subscribe(function (userprofile) { return _this.onUserProfileSuccess(userprofile); }, function (error) { return _this.onUserProfileError(error); });
    };
    DashboardComponent.prototype.onUserProfileSuccess = function (result) {
        var _this = this;
        index_1.SessionStorageService.setSessionValue(index_1.SessionStorage.EMAIL_ID, result.data.email);
        index_1.SessionStorageService.setSessionValue(index_1.SessionStorage.MOBILE_NUMBER, result.data.mobile_number);
        this.zone.run(function () {
            if (result !== null) {
                _this.model = result;
                _this.profileService.onProfileUpdate(result);
            }
        });
    };
    DashboardComponent.prototype.onUserProfileError = function (error) {
        var message = new index_1.Message();
        message.error_msg = error.err_msg;
        message.isError = true;
        this.messageService.message(message);
    };
    DashboardComponent.prototype.navigateTo = function (nav) {
        if (nav !== undefined) {
            this._router.navigate([nav]);
        }
        this.overlayStyle = !this.overlayStyle;
    };
    DashboardComponent.prototype.onLogout = function () {
        window.sessionStorage.clear();
        window.localStorage.clear();
        this._router.navigate([index_1.NavigationRoutes.APP_START]);
    };
    DashboardComponent.prototype.isShowSidebarMenu = function () {
        if (this.overlayStyle) {
            return '0';
        }
        else {
            return '0';
        }
    };
    DashboardComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'tpl-dashboard',
            templateUrl: 'dashboard.component.html',
            styleUrls: ['dashboard.component.css'],
        }),
        __metadata("design:paramtypes", [router_1.Router, dashboard_service_1.DashboardService, index_1.MessageService,
            index_1.ProfileService, core_1.NgZone])
    ], DashboardComponent);
    return DashboardComponent;
}());
exports.DashboardComponent = DashboardComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGFzaGJvYXJkL2Rhc2hib2FyZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxzQ0FBMEQ7QUFDMUQsMENBQXlDO0FBQ3pDLDJFQUF5RTtBQUN6RSwrQ0FBcUQ7QUFDckQsNENBTzRCO0FBVTVCO0lBTUUsNEJBQW9CLE9BQWUsRUFBVSxnQkFBa0MsRUFBVSxjQUE4QixFQUNuRyxjQUE4QixFQUFVLElBQVk7UUFEcEQsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUFVLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFBVSxtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFDbkcsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBQVUsU0FBSSxHQUFKLElBQUksQ0FBUTtRQU54RSxTQUFJLEdBQUcsWUFBWSxDQUFDO1FBQ3BCLFVBQUssR0FBRyxJQUFJLGtCQUFXLEVBQUUsQ0FBQztRQUMxQixpQkFBWSxHQUFHLEtBQUssQ0FBQztJQUtyQixDQUFDO0lBRUQscUNBQVEsR0FBUjtRQUNFLElBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLDZCQUFxQixDQUFDLGVBQWUsQ0FBQyxzQkFBYyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7UUFDNUYsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsd0JBQWdCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUN0RCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDeEIsQ0FBQztJQUNILENBQUM7SUFDRCwyQ0FBYyxHQUFkO1FBQUEsaUJBS0M7UUFKQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxFQUFFO2FBQ25DLFNBQVMsQ0FDUixVQUFBLFdBQVcsSUFBSSxPQUFBLEtBQUksQ0FBQyxvQkFBb0IsQ0FBQyxXQUFXLENBQUMsRUFBdEMsQ0FBc0MsRUFDckQsVUFBQSxLQUFLLElBQUksT0FBQSxLQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLEVBQTlCLENBQThCLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQsaURBQW9CLEdBQXBCLFVBQXFCLE1BQVc7UUFBaEMsaUJBU0M7UUFSQyw2QkFBcUIsQ0FBQyxlQUFlLENBQUMsc0JBQWMsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNsRiw2QkFBcUIsQ0FBQyxlQUFlLENBQUMsc0JBQWMsQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUMvRixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztZQUNaLEVBQUUsQ0FBQyxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNwQixLQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQztnQkFDcEIsS0FBSSxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDOUMsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELCtDQUFrQixHQUFsQixVQUFtQixLQUFVO1FBQzNCLElBQUksT0FBTyxHQUFHLElBQUksZUFBTyxFQUFFLENBQUM7UUFDNUIsT0FBTyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO1FBQ2xDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFRCx1Q0FBVSxHQUFWLFVBQVcsR0FBVztRQUNwQixFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztZQUN0QixJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDL0IsQ0FBQztRQUNELElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDO0lBQ3pDLENBQUM7SUFFRCxxQ0FBUSxHQUFSO1FBQ0UsTUFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUM5QixNQUFNLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzVCLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsd0JBQWdCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRUQsOENBQWlCLEdBQWpCO1FBQ0UsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFDdEIsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNiLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDYixDQUFDO0lBQ0gsQ0FBQztJQTlEVSxrQkFBa0I7UUFQOUIsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNuQixRQUFRLEVBQUUsZUFBZTtZQUN6QixXQUFXLEVBQUUsMEJBQTBCO1lBQ3ZDLFNBQVMsRUFBRSxDQUFDLHlCQUF5QixDQUFDO1NBQ3ZDLENBQUM7eUNBUTZCLGVBQU0sRUFBNEIsb0NBQWdCLEVBQTBCLHNCQUFjO1lBQ25GLHNCQUFjLEVBQWdCLGFBQU07T0FQN0Qsa0JBQWtCLENBK0Q5QjtJQUFELHlCQUFDO0NBL0RELEFBK0RDLElBQUE7QUEvRFksZ0RBQWtCIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvZGFzaGJvYXJkL2Rhc2hib2FyZC5jb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE5nWm9uZSwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XHJcbmltcG9ydCB7IERhc2hib2FyZFNlcnZpY2UgfSBmcm9tICcuLi8uLi91c2VyL3NlcnZpY2VzL2Rhc2hib2FyZC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgVXNlclByb2ZpbGUgfSBmcm9tICcuLi8uLi91c2VyL21vZGVscy91c2VyJztcclxuaW1wb3J0IHtcclxuICBTZXNzaW9uU3RvcmFnZSxcclxuICBTZXNzaW9uU3RvcmFnZVNlcnZpY2UsXHJcbiAgTWVzc2FnZSxcclxuICBNZXNzYWdlU2VydmljZSxcclxuICBOYXZpZ2F0aW9uUm91dGVzLFxyXG4gIFByb2ZpbGVTZXJ2aWNlXHJcbn0gZnJvbSAnLi4vLi4vc2hhcmVkL2luZGV4JztcclxuXHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxyXG4gIHNlbGVjdG9yOiAndHBsLWRhc2hib2FyZCcsXHJcbiAgdGVtcGxhdGVVcmw6ICdkYXNoYm9hcmQuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWydkYXNoYm9hcmQuY29tcG9uZW50LmNzcyddLFxyXG59KVxyXG5cclxuZXhwb3J0IGNsYXNzIERhc2hib2FyZENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcbiAgbW9kZSA9ICdPYnNlcnZhYmxlJztcclxuICBtb2RlbCA9IG5ldyBVc2VyUHJvZmlsZSgpO1xyXG4gIG92ZXJsYXlTdHlsZSA9IGZhbHNlO1xyXG4gIG5ld1VzZXI6IG51bWJlcjtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfcm91dGVyOiBSb3V0ZXIsIHByaXZhdGUgZGFzaGJvYXJkU2VydmljZTogRGFzaGJvYXJkU2VydmljZSwgcHJpdmF0ZSBtZXNzYWdlU2VydmljZTogTWVzc2FnZVNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgcHJpdmF0ZSBwcm9maWxlU2VydmljZTogUHJvZmlsZVNlcnZpY2UsIHByaXZhdGUgem9uZTogTmdab25lICkge1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICB0aGlzLm5ld1VzZXIgPSBwYXJzZUludChTZXNzaW9uU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLklTX0xPR0dFRF9JTikpO1xyXG4gICAgaWYgKHRoaXMubmV3VXNlciA9PT0gMCkge1xyXG4gICAgICB0aGlzLl9yb3V0ZXIubmF2aWdhdGUoW05hdmlnYXRpb25Sb3V0ZXMuQVBQX1NUQVJUXSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmdldFVzZXJQcm9maWxlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGdldFVzZXJQcm9maWxlKCkge1xyXG4gICAgdGhpcy5kYXNoYm9hcmRTZXJ2aWNlLmdldFVzZXJQcm9maWxlKClcclxuICAgICAgLnN1YnNjcmliZShcclxuICAgICAgICB1c2VycHJvZmlsZSA9PiB0aGlzLm9uVXNlclByb2ZpbGVTdWNjZXNzKHVzZXJwcm9maWxlKSxcclxuICAgICAgICBlcnJvciA9PiB0aGlzLm9uVXNlclByb2ZpbGVFcnJvcihlcnJvcikpO1xyXG4gIH1cclxuXHJcbiAgb25Vc2VyUHJvZmlsZVN1Y2Nlc3MocmVzdWx0OiBhbnkpIHtcclxuICAgIFNlc3Npb25TdG9yYWdlU2VydmljZS5zZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuRU1BSUxfSUQsIHJlc3VsdC5kYXRhLmVtYWlsKTtcclxuICAgIFNlc3Npb25TdG9yYWdlU2VydmljZS5zZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuTU9CSUxFX05VTUJFUiwgcmVzdWx0LmRhdGEubW9iaWxlX251bWJlcik7XHJcbiAgICB0aGlzLnpvbmUucnVuKCgpID0+IHtcclxuICAgICAgaWYgKHJlc3VsdCAhPT0gbnVsbCkge1xyXG4gICAgICAgIHRoaXMubW9kZWwgPSByZXN1bHQ7XHJcbiAgICAgICAgdGhpcy5wcm9maWxlU2VydmljZS5vblByb2ZpbGVVcGRhdGUocmVzdWx0KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBvblVzZXJQcm9maWxlRXJyb3IoZXJyb3I6IGFueSkge1xyXG4gICAgdmFyIG1lc3NhZ2UgPSBuZXcgTWVzc2FnZSgpO1xyXG4gICAgbWVzc2FnZS5lcnJvcl9tc2cgPSBlcnJvci5lcnJfbXNnO1xyXG4gICAgbWVzc2FnZS5pc0Vycm9yID0gdHJ1ZTtcclxuICAgIHRoaXMubWVzc2FnZVNlcnZpY2UubWVzc2FnZShtZXNzYWdlKTtcclxuICB9XHJcblxyXG4gIG5hdmlnYXRlVG8obmF2OiBzdHJpbmcpIHtcclxuICAgIGlmIChuYXYgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICB0aGlzLl9yb3V0ZXIubmF2aWdhdGUoW25hdl0pO1xyXG4gICAgfVxyXG4gICAgdGhpcy5vdmVybGF5U3R5bGUgPSAhdGhpcy5vdmVybGF5U3R5bGU7XHJcbiAgfVxyXG5cclxuICBvbkxvZ291dCgpIHtcclxuICAgIHdpbmRvdy5zZXNzaW9uU3RvcmFnZS5jbGVhcigpO1xyXG4gICAgd2luZG93LmxvY2FsU3RvcmFnZS5jbGVhcigpO1xyXG4gICAgdGhpcy5fcm91dGVyLm5hdmlnYXRlKFtOYXZpZ2F0aW9uUm91dGVzLkFQUF9TVEFSVF0pO1xyXG4gIH1cclxuXHJcbiAgaXNTaG93U2lkZWJhck1lbnUoKSB7XHJcbiAgICBpZiAodGhpcy5vdmVybGF5U3R5bGUpIHtcclxuICAgICAgcmV0dXJuICcwJztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiAnMCc7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==
