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
var notification_service_1 = require("./notification.service");
var index_1 = require("../../../shared/index");
var constants_1 = require("../../../shared/constants");
var session_service_1 = require("../../../shared/services/session.service");
var loaders_service_1 = require("../../../shared/loader/loaders.service");
var NotificationComponent = (function () {
    function NotificationComponent(_router, notificationService, messageService, commonService, loaderService) {
        this._router = _router;
        this.notificationService = notificationService;
        this.messageService = messageService;
        this.commonService = commonService;
        this.loaderService = loaderService;
    }
    NotificationComponent.prototype.ngOnInit = function () {
        this.unreadNotifications = 0;
        this.newUser = parseInt(session_service_1.SessionStorageService.getSessionValue(constants_1.SessionStorage.IS_LOGGED_IN));
        if (this.newUser === 0) {
            this._router.navigate([constants_1.NavigationRoutes.APP_START]);
        }
        else {
            this.getNotification();
        }
    };
    NotificationComponent.prototype.getNotification = function () {
        var _this = this;
        this.notificationService.getNotification()
            .subscribe(function (notification) { return _this.onGetNotificationSuccess(notification); }, function (error) { return _this.onGetNotificationFailure(error); });
    };
    NotificationComponent.prototype.onGetNotificationSuccess = function (result) {
        if (result !== null) {
            this.notifications = result.data;
            for (var i = 0; i < result.data.length; i++) {
                if (result.data[i].is_read === false) {
                    this.unreadNotifications++;
                }
            }
        }
    };
    NotificationComponent.prototype.onGetNotificationFailure = function (error) {
        var message = new index_1.Message();
        message.isError = true;
        message.error_msg = error;
        message.custom_message = 'Network Not Found';
        this.messageService.message(message);
    };
    NotificationComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'tpl-notification',
            templateUrl: 'notification.component.html',
            styleUrls: ['notification.component.css'],
        }),
        __metadata("design:paramtypes", [router_1.Router, notification_service_1.NotificationService,
            index_1.MessageService, index_1.CommonService, loaders_service_1.LoaderService])
    ], NotificationComponent);
    return NotificationComponent;
}());
exports.NotificationComponent = NotificationComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2hhcmVkL25vdGlmaWNhdGlvbi9ub3RpZmljYXRpb24uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsc0NBQWtEO0FBQ2xELDBDQUF5QztBQUN6QywrREFBNkQ7QUFFN0QsK0NBQStFO0FBQy9FLHVEQUE2RTtBQUM3RSw0RUFBaUY7QUFDakYsMEVBQXVFO0FBU3ZFO0lBS0UsK0JBQW9CLE9BQWUsRUFBVSxtQkFBd0MsRUFDakUsY0FBOEIsRUFBVSxhQUE0QixFQUFVLGFBQTRCO1FBRDFHLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFBVSx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1FBQ2pFLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUFVLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQVUsa0JBQWEsR0FBYixhQUFhLENBQWU7SUFDOUgsQ0FBQztJQUVELHdDQUFRLEdBQVI7UUFDRSxJQUFJLENBQUMsbUJBQW1CLEdBQUcsQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLHVDQUFxQixDQUFDLGVBQWUsQ0FBQywwQkFBYyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7UUFDNUYsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsNEJBQWdCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUN0RCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDekIsQ0FBQztJQUNILENBQUM7SUFFRCwrQ0FBZSxHQUFmO1FBQUEsaUJBS0M7UUFKQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsZUFBZSxFQUFFO2FBQ3ZDLFNBQVMsQ0FDUixVQUFBLFlBQVksSUFBSSxPQUFBLEtBQUksQ0FBQyx3QkFBd0IsQ0FBQyxZQUFZLENBQUMsRUFBM0MsQ0FBMkMsRUFDM0QsVUFBQSxLQUFLLElBQUksT0FBQSxLQUFJLENBQUMsd0JBQXdCLENBQUMsS0FBSyxDQUFDLEVBQXBDLENBQW9DLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBRUQsd0RBQXdCLEdBQXhCLFVBQXlCLE1BQVc7UUFDbEMsRUFBRSxDQUFDLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDcEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ2pDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDNUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDckMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7Z0JBQzdCLENBQUM7WUFDSCxDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFHRCx3REFBd0IsR0FBeEIsVUFBeUIsS0FBVTtRQUNqQyxJQUFJLE9BQU8sR0FBRyxJQUFJLGVBQU8sRUFBRSxDQUFDO1FBQzVCLE9BQU8sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ3ZCLE9BQU8sQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQzFCLE9BQU8sQ0FBQyxjQUFjLEdBQUcsbUJBQW1CLENBQUM7UUFDN0MsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQTVDVSxxQkFBcUI7UUFQakMsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNuQixRQUFRLEVBQUUsa0JBQWtCO1lBQzVCLFdBQVcsRUFBRSw2QkFBNkI7WUFDMUMsU0FBUyxFQUFFLENBQUMsNEJBQTRCLENBQUM7U0FDMUMsQ0FBQzt5Q0FPNkIsZUFBTSxFQUErQiwwQ0FBbUI7WUFDakQsc0JBQWMsRUFBeUIscUJBQWEsRUFBeUIsK0JBQWE7T0FObkgscUJBQXFCLENBNkNqQztJQUFELDRCQUFDO0NBN0NELEFBNkNDLElBQUE7QUE3Q1ksc0RBQXFCIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvc2hhcmVkL25vdGlmaWNhdGlvbi9ub3RpZmljYXRpb24uY29tcG9uZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcclxuaW1wb3J0IHsgTm90aWZpY2F0aW9uU2VydmljZSB9IGZyb20gJy4vbm90aWZpY2F0aW9uLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBOb3RpZmljYXRpb24gfSBmcm9tICcuL25vdGlmaWNhdGlvbic7XHJcbmltcG9ydCB7IENvbW1vblNlcnZpY2UsIE1lc3NhZ2UsIE1lc3NhZ2VTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vc2hhcmVkL2luZGV4JztcclxuaW1wb3J0IHsgU2Vzc2lvblN0b3JhZ2UsIE5hdmlnYXRpb25Sb3V0ZXMgfSBmcm9tICcuLi8uLi8uLi9zaGFyZWQvY29uc3RhbnRzJztcclxuaW1wb3J0IHsgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vc2hhcmVkL3NlcnZpY2VzL3Nlc3Npb24uc2VydmljZSc7XHJcbmltcG9ydCB7IExvYWRlclNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zaGFyZWQvbG9hZGVyL2xvYWRlcnMuc2VydmljZSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxyXG4gIHNlbGVjdG9yOiAndHBsLW5vdGlmaWNhdGlvbicsXHJcbiAgdGVtcGxhdGVVcmw6ICdub3RpZmljYXRpb24uY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWydub3RpZmljYXRpb24uY29tcG9uZW50LmNzcyddLFxyXG59KVxyXG5cclxuZXhwb3J0IGNsYXNzIE5vdGlmaWNhdGlvbkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcbiAgbm90aWZpY2F0aW9uczogTm90aWZpY2F0aW9uW107XHJcbiAgbmV3VXNlcjogbnVtYmVyO1xyXG4gIHVucmVhZE5vdGlmaWNhdGlvbnM6IG51bWJlcjtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfcm91dGVyOiBSb3V0ZXIsIHByaXZhdGUgbm90aWZpY2F0aW9uU2VydmljZTogTm90aWZpY2F0aW9uU2VydmljZSxcclxuICAgICAgICAgICAgICBwcml2YXRlIG1lc3NhZ2VTZXJ2aWNlOiBNZXNzYWdlU2VydmljZSwgcHJpdmF0ZSBjb21tb25TZXJ2aWNlOiBDb21tb25TZXJ2aWNlLCBwcml2YXRlIGxvYWRlclNlcnZpY2U6IExvYWRlclNlcnZpY2UpIHtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgdGhpcy51bnJlYWROb3RpZmljYXRpb25zID0gMDtcclxuICAgIHRoaXMubmV3VXNlciA9IHBhcnNlSW50KFNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuSVNfTE9HR0VEX0lOKSk7XHJcbiAgICBpZiAodGhpcy5uZXdVc2VyID09PSAwKSB7XHJcbiAgICAgIHRoaXMuX3JvdXRlci5uYXZpZ2F0ZShbTmF2aWdhdGlvblJvdXRlcy5BUFBfU1RBUlRdKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuZ2V0Tm90aWZpY2F0aW9uKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXROb3RpZmljYXRpb24oKSB7XHJcbiAgICB0aGlzLm5vdGlmaWNhdGlvblNlcnZpY2UuZ2V0Tm90aWZpY2F0aW9uKClcclxuICAgICAgLnN1YnNjcmliZShcclxuICAgICAgICBub3RpZmljYXRpb24gPT4gdGhpcy5vbkdldE5vdGlmaWNhdGlvblN1Y2Nlc3Mobm90aWZpY2F0aW9uKSxcclxuICAgICAgICBlcnJvciA9PiB0aGlzLm9uR2V0Tm90aWZpY2F0aW9uRmFpbHVyZShlcnJvcikpO1xyXG4gIH1cclxuXHJcbiAgb25HZXROb3RpZmljYXRpb25TdWNjZXNzKHJlc3VsdDogYW55KSB7XHJcbiAgICBpZiAocmVzdWx0ICE9PSBudWxsKSB7XHJcbiAgICAgIHRoaXMubm90aWZpY2F0aW9ucyA9IHJlc3VsdC5kYXRhO1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3VsdC5kYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKHJlc3VsdC5kYXRhW2ldLmlzX3JlYWQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICB0aGlzLnVucmVhZE5vdGlmaWNhdGlvbnMrKztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG5cclxuICBvbkdldE5vdGlmaWNhdGlvbkZhaWx1cmUoZXJyb3I6IGFueSkge1xyXG4gICAgdmFyIG1lc3NhZ2UgPSBuZXcgTWVzc2FnZSgpO1xyXG4gICAgbWVzc2FnZS5pc0Vycm9yID0gdHJ1ZTtcclxuICAgIG1lc3NhZ2UuZXJyb3JfbXNnID0gZXJyb3I7XHJcbiAgICBtZXNzYWdlLmN1c3RvbV9tZXNzYWdlID0gJ05ldHdvcmsgTm90IEZvdW5kJztcclxuICAgIHRoaXMubWVzc2FnZVNlcnZpY2UubWVzc2FnZShtZXNzYWdlKTtcclxuICB9XHJcbn1cclxuIl19
