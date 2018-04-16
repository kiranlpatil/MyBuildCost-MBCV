"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var http_1 = require("@angular/http");
var index_1 = require("../../../shared/index");
var NotificationService = (function (_super) {
    __extends(NotificationService, _super);
    function NotificationService(http, messageService) {
        var _this = _super.call(this) || this;
        _this.http = http;
        _this.messageService = messageService;
        return _this;
    }
    NotificationService.prototype.getNotification = function () {
        var url = index_1.API.NOTIFICATION + '/' + index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.USER_ID);
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.get(url, options)
            .map(this.extractData)
            .catch(this.handleError);
    };
    NotificationService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http, index_1.MessageService])
    ], NotificationService);
    return NotificationService;
}(index_1.BaseService));
exports.NotificationService = NotificationService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2hhcmVkL25vdGlmaWNhdGlvbi9ub3RpZmljYXRpb24uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzQ0FBMkM7QUFFM0Msc0NBQThEO0FBQzlELCtDQUFnSDtBQUloSDtJQUF5Qyx1Q0FBVztJQUVsRCw2QkFBc0IsSUFBVSxFQUFZLGNBQThCO1FBQTFFLFlBQ0UsaUJBQU8sU0FDUjtRQUZxQixVQUFJLEdBQUosSUFBSSxDQUFNO1FBQVksb0JBQWMsR0FBZCxjQUFjLENBQWdCOztJQUUxRSxDQUFDO0lBRUQsNkNBQWUsR0FBZjtRQUNFLElBQUksR0FBRyxHQUFHLFdBQUcsQ0FBQyxZQUFZLEdBQUcsR0FBRyxHQUFHLDZCQUFxQixDQUFDLGVBQWUsQ0FBQyxzQkFBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2pHLElBQUksT0FBTyxHQUFHLElBQUksY0FBTyxDQUFDLEVBQUMsY0FBYyxFQUFFLGtCQUFrQixFQUFDLENBQUMsQ0FBQztRQUNoRSxJQUFJLE9BQU8sR0FBRyxJQUFJLHFCQUFjLENBQUMsRUFBQyxPQUFPLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztRQUNyRCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQzthQUMvQixHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQzthQUNyQixLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFiVSxtQkFBbUI7UUFEL0IsaUJBQVUsRUFBRTt5Q0FHaUIsV0FBSSxFQUE0QixzQkFBYztPQUYvRCxtQkFBbUIsQ0FjL0I7SUFBRCwwQkFBQztDQWRELEFBY0MsQ0Fkd0MsbUJBQVcsR0FjbkQ7QUFkWSxrREFBbUIiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9zaGFyZWQvbm90aWZpY2F0aW9uL25vdGlmaWNhdGlvbi5zZXJ2aWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcy9SeCc7XHJcbmltcG9ydCB7IEhlYWRlcnMsIEh0dHAsIFJlcXVlc3RPcHRpb25zIH0gZnJvbSAnQGFuZ3VsYXIvaHR0cCc7XHJcbmltcG9ydCB7IEFQSSwgQmFzZVNlcnZpY2UsIFNlc3Npb25TdG9yYWdlLCBTZXNzaW9uU3RvcmFnZVNlcnZpY2UsIE1lc3NhZ2VTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vc2hhcmVkL2luZGV4JztcclxuaW1wb3J0IHsgTm90aWZpY2F0aW9uIH0gZnJvbSAnLi9ub3RpZmljYXRpb24nO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgTm90aWZpY2F0aW9uU2VydmljZSBleHRlbmRzIEJhc2VTZXJ2aWNlIHtcclxuXHJcbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGh0dHA6IEh0dHAsIHByb3RlY3RlZCBtZXNzYWdlU2VydmljZTogTWVzc2FnZVNlcnZpY2UpIHtcclxuICAgIHN1cGVyKCk7XHJcbiAgfVxyXG5cclxuICBnZXROb3RpZmljYXRpb24oKTogT2JzZXJ2YWJsZTxOb3RpZmljYXRpb25bXT4ge1xyXG4gICAgdmFyIHVybCA9IEFQSS5OT1RJRklDQVRJT04gKyAnLycgKyBTZXNzaW9uU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLlVTRVJfSUQpO1xyXG4gICAgbGV0IGhlYWRlcnMgPSBuZXcgSGVhZGVycyh7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ30pO1xyXG4gICAgbGV0IG9wdGlvbnMgPSBuZXcgUmVxdWVzdE9wdGlvbnMoe2hlYWRlcnM6IGhlYWRlcnN9KTtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KHVybCwgb3B0aW9ucylcclxuICAgICAgLm1hcCh0aGlzLmV4dHJhY3REYXRhKVxyXG4gICAgICAuY2F0Y2godGhpcy5oYW5kbGVFcnJvcik7XHJcbiAgfVxyXG59XHJcbiJdfQ==
