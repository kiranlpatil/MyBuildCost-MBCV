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
var UserChangePasswordService = (function (_super) {
    __extends(UserChangePasswordService, _super);
    function UserChangePasswordService(http, messageService) {
        var _this = _super.call(this) || this;
        _this.http = http;
        _this.messageService = messageService;
        return _this;
    }
    UserChangePasswordService.prototype.changePassword = function (model) {
        var url = index_1.API.CHANGE_PASSWORD + '/' + index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.USER_ID);
        var body = JSON.stringify(model);
        return this.http.put(url, body)
            .map(this.extractData)
            .catch(this.handleError);
    };
    UserChangePasswordService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http, index_1.MessageService])
    ], UserChangePasswordService);
    return UserChangePasswordService;
}(index_1.BaseService));
exports.UserChangePasswordService = UserChangePasswordService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGFzaGJvYXJkL3VzZXItY2hhbmdlLXBhc3N3b3JkL3VzZXItY2hhbmdlLXBhc3N3b3JkLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsc0NBQTJDO0FBQzNDLHNDQUFxQztBQUdyQywrQ0FBZ0g7QUFJaEg7SUFBK0MsNkNBQVc7SUFFeEQsbUNBQXNCLElBQVUsRUFBWSxjQUE4QjtRQUExRSxZQUNFLGlCQUFPLFNBQ1I7UUFGcUIsVUFBSSxHQUFKLElBQUksQ0FBTTtRQUFZLG9CQUFjLEdBQWQsY0FBYyxDQUFnQjs7SUFFMUUsQ0FBQztJQUVELGtEQUFjLEdBQWQsVUFBZSxLQUFxQjtRQUNsQyxJQUFJLEdBQUcsR0FBRyxXQUFHLENBQUMsZUFBZSxHQUFHLEdBQUcsR0FBRyw2QkFBcUIsQ0FBQyxlQUFlLENBQUMsc0JBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNwRyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2pDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDO2FBQzVCLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO2FBQ3JCLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQVpVLHlCQUF5QjtRQURyQyxpQkFBVSxFQUFFO3lDQUdpQixXQUFJLEVBQTRCLHNCQUFjO09BRi9ELHlCQUF5QixDQWNyQztJQUFELGdDQUFDO0NBZEQsQUFjQyxDQWQ4QyxtQkFBVyxHQWN6RDtBQWRZLDhEQUF5QiIsImZpbGUiOiJhcHAvZnJhbWV3b3JrL2Rhc2hib2FyZC91c2VyLWNoYW5nZS1wYXNzd29yZC91c2VyLWNoYW5nZS1wYXNzd29yZC5zZXJ2aWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwIH0gZnJvbSAnQGFuZ3VsYXIvaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzL09ic2VydmFibGUnO1xyXG5pbXBvcnQgeyBDaGFuZ2VQYXNzd29yZCB9IGZyb20gJy4uLy4uLy4uL3VzZXIvbW9kZWxzL2NoYW5nZS1wYXNzd29yZCc7XHJcbmltcG9ydCB7IEFQSSwgQmFzZVNlcnZpY2UsIFNlc3Npb25TdG9yYWdlLCBTZXNzaW9uU3RvcmFnZVNlcnZpY2UsIE1lc3NhZ2VTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vc2hhcmVkL2luZGV4JztcclxuXHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBVc2VyQ2hhbmdlUGFzc3dvcmRTZXJ2aWNlIGV4dGVuZHMgQmFzZVNlcnZpY2Uge1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgaHR0cDogSHR0cCwgcHJvdGVjdGVkIG1lc3NhZ2VTZXJ2aWNlOiBNZXNzYWdlU2VydmljZSkge1xyXG4gICAgc3VwZXIoKTtcclxuICB9XHJcblxyXG4gIGNoYW5nZVBhc3N3b3JkKG1vZGVsOiBDaGFuZ2VQYXNzd29yZCk6IE9ic2VydmFibGU8Q2hhbmdlUGFzc3dvcmQ+IHtcclxuICAgIHZhciB1cmwgPSBBUEkuQ0hBTkdFX1BBU1NXT1JEICsgJy8nICsgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLmdldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5VU0VSX0lEKTtcclxuICAgIHZhciBib2R5ID0gSlNPTi5zdHJpbmdpZnkobW9kZWwpO1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wdXQodXJsLCBib2R5KVxyXG4gICAgICAubWFwKHRoaXMuZXh0cmFjdERhdGEpXHJcbiAgICAgIC5jYXRjaCh0aGlzLmhhbmRsZUVycm9yKTtcclxuICB9XHJcblxyXG59XHJcbiJdfQ==
