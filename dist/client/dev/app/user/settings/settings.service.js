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
var index_1 = require("../../shared/index");
var SettingsService = (function (_super) {
    __extends(SettingsService, _super);
    function SettingsService(http, messageService) {
        var _this = _super.call(this) || this;
        _this.http = http;
        _this.messageService = messageService;
        return _this;
    }
    SettingsService.prototype.changeTheme = function (userbody) {
        var url = index_1.API.CHANGE_THEME + '/' + index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.USER_ID);
        var obj = { current_theme: '' };
        obj.current_theme = userbody;
        var body = JSON.stringify(obj);
        return this.http.put(url, body)
            .map(this.extractDataWithoutToken)
            .catch(this.handleError);
    };
    SettingsService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http, index_1.MessageService])
    ], SettingsService);
    return SettingsService;
}(index_1.BaseService));
exports.SettingsService = SettingsService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC91c2VyL3NldHRpbmdzL3NldHRpbmdzLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsc0NBQXlDO0FBQ3pDLHNDQUFtQztBQUVuQyw0Q0FBMkc7QUFJM0c7SUFBcUMsbUNBQVc7SUFFOUMseUJBQXNCLElBQVUsRUFBWSxjQUE4QjtRQUExRSxZQUNFLGlCQUFPLFNBQ1I7UUFGcUIsVUFBSSxHQUFKLElBQUksQ0FBTTtRQUFZLG9CQUFjLEdBQWQsY0FBYyxDQUFnQjs7SUFFMUUsQ0FBQztJQUVELHFDQUFXLEdBQVgsVUFBWSxRQUFnQjtRQUMxQixJQUFJLEdBQUcsR0FBRyxXQUFHLENBQUMsWUFBWSxHQUFHLEdBQUcsR0FBRyw2QkFBcUIsQ0FBQyxlQUFlLENBQUMsc0JBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNqRyxJQUFJLEdBQUcsR0FBUSxFQUFDLGFBQWEsRUFBRSxFQUFFLEVBQUMsQ0FBQztRQUNuQyxHQUFHLENBQUMsYUFBYSxHQUFHLFFBQVEsQ0FBQztRQUM3QixJQUFJLElBQUksR0FBUSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3BDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDO2FBQzVCLEdBQUcsQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUM7YUFDakMsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBZFUsZUFBZTtRQUYzQixpQkFBVSxFQUFFO3lDQUlpQixXQUFJLEVBQTRCLHNCQUFjO09BRi9ELGVBQWUsQ0FlM0I7SUFBRCxzQkFBQztDQWZELEFBZUMsQ0Fmb0MsbUJBQVcsR0FlL0M7QUFmWSwwQ0FBZSIsImZpbGUiOiJhcHAvdXNlci9zZXR0aW5ncy9zZXR0aW5ncy5zZXJ2aWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xyXG5pbXBvcnQge0h0dHB9IGZyb20gXCJAYW5ndWxhci9odHRwXCI7XHJcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSBcInJ4anMvT2JzZXJ2YWJsZVwiO1xyXG5pbXBvcnQge0FQSSwgQmFzZVNlcnZpY2UsIFNlc3Npb25TdG9yYWdlLCBTZXNzaW9uU3RvcmFnZVNlcnZpY2UsIE1lc3NhZ2VTZXJ2aWNlfSBmcm9tIFwiLi4vLi4vc2hhcmVkL2luZGV4XCI7XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcblxyXG5leHBvcnQgY2xhc3MgU2V0dGluZ3NTZXJ2aWNlIGV4dGVuZHMgQmFzZVNlcnZpY2Uge1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgaHR0cDogSHR0cCwgcHJvdGVjdGVkIG1lc3NhZ2VTZXJ2aWNlOiBNZXNzYWdlU2VydmljZSkge1xyXG4gICAgc3VwZXIoKTtcclxuICB9XHJcblxyXG4gIGNoYW5nZVRoZW1lKHVzZXJib2R5OiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgdmFyIHVybCA9IEFQSS5DSEFOR0VfVEhFTUUgKyAnLycgKyBTZXNzaW9uU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLlVTRVJfSUQpO1xyXG4gICAgbGV0IG9iajogYW55ID0ge2N1cnJlbnRfdGhlbWU6ICcnfTtcclxuICAgIG9iai5jdXJyZW50X3RoZW1lID0gdXNlcmJvZHk7XHJcbiAgICBsZXQgYm9keTogYW55ID0gSlNPTi5zdHJpbmdpZnkob2JqKTtcclxuICAgIHJldHVybiB0aGlzLmh0dHAucHV0KHVybCwgYm9keSlcclxuICAgICAgLm1hcCh0aGlzLmV4dHJhY3REYXRhV2l0aG91dFRva2VuKVxyXG4gICAgICAuY2F0Y2godGhpcy5oYW5kbGVFcnJvcik7XHJcbiAgfVxyXG59XHJcbiJdfQ==
