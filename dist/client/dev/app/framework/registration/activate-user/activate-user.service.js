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
var ActiveUserService = (function (_super) {
    __extends(ActiveUserService, _super);
    function ActiveUserService(http, messageService) {
        var _this = _super.call(this) || this;
        _this.http = http;
        _this.messageService = messageService;
        return _this;
    }
    ActiveUserService.prototype.activeUser = function () {
        var url = index_1.API.VERIFY_CHANGED_EMAIL + '/' + index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.USER_ID);
        var body = { 'isActivated': true };
        return this.http.put(url, body)
            .map(this.extractData)
            .catch(this.handleError);
    };
    ActiveUserService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http, index_1.MessageService])
    ], ActiveUserService);
    return ActiveUserService;
}(index_1.BaseService));
exports.ActiveUserService = ActiveUserService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvcmVnaXN0cmF0aW9uL2FjdGl2YXRlLXVzZXIvYWN0aXZhdGUtdXNlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHNDQUEyQztBQUMzQyxzQ0FBcUM7QUFFckMsK0NBQWdIO0FBSWhIO0lBQXVDLHFDQUFXO0lBRWhELDJCQUFzQixJQUFVLEVBQVksY0FBOEI7UUFBMUUsWUFDRSxpQkFBTyxTQUNSO1FBRnFCLFVBQUksR0FBSixJQUFJLENBQU07UUFBWSxvQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7O0lBRTFFLENBQUM7SUFFRCxzQ0FBVSxHQUFWO1FBQ0ksSUFBSSxHQUFHLEdBQUcsV0FBRyxDQUFDLG9CQUFvQixHQUFHLEdBQUcsR0FBRyw2QkFBcUIsQ0FBQyxlQUFlLENBQUMsc0JBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN6RyxJQUFJLElBQUksR0FBRyxFQUFDLGFBQWEsRUFBRSxJQUFJLEVBQUMsQ0FBQztRQUNqQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQzthQUM1QixHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQzthQUNyQixLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFaVSxpQkFBaUI7UUFEN0IsaUJBQVUsRUFBRTt5Q0FHaUIsV0FBSSxFQUE0QixzQkFBYztPQUYvRCxpQkFBaUIsQ0FhN0I7SUFBRCx3QkFBQztDQWJELEFBYUMsQ0Fic0MsbUJBQVcsR0FhakQ7QUFiWSw4Q0FBaUIiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9yZWdpc3RyYXRpb24vYWN0aXZhdGUtdXNlci9hY3RpdmF0ZS11c2VyLnNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHAgfSBmcm9tICdAYW5ndWxhci9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMvT2JzZXJ2YWJsZSc7XHJcbmltcG9ydCB7IEFQSSwgQmFzZVNlcnZpY2UsIFNlc3Npb25TdG9yYWdlLCBTZXNzaW9uU3RvcmFnZVNlcnZpY2UsIE1lc3NhZ2VTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vc2hhcmVkL2luZGV4JztcclxuXHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBBY3RpdmVVc2VyU2VydmljZSBleHRlbmRzIEJhc2VTZXJ2aWNlIHtcclxuXHJcbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGh0dHA6IEh0dHAsIHByb3RlY3RlZCBtZXNzYWdlU2VydmljZTogTWVzc2FnZVNlcnZpY2UpIHtcclxuICAgIHN1cGVyKCk7XHJcbiAgfVxyXG5cclxuICBhY3RpdmVVc2VyKCk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICAgIHZhciB1cmwgPSBBUEkuVkVSSUZZX0NIQU5HRURfRU1BSUwgKyAnLycgKyBTZXNzaW9uU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLlVTRVJfSUQpO1xyXG4gICAgICB2YXIgYm9keSA9IHsnaXNBY3RpdmF0ZWQnOiB0cnVlfTtcclxuICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wdXQodXJsLCBib2R5KVxyXG4gICAgICAgIC5tYXAodGhpcy5leHRyYWN0RGF0YSlcclxuICAgICAgICAuY2F0Y2godGhpcy5oYW5kbGVFcnJvcik7XHJcbiAgfVxyXG59XHJcbiJdfQ==
