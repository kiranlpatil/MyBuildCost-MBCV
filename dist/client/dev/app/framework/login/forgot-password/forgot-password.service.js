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
var index_1 = require("../../../shared/index");
var http_1 = require("@angular/http");
var ForgotPasswordService = (function (_super) {
    __extends(ForgotPasswordService, _super);
    function ForgotPasswordService(http) {
        var _this = _super.call(this) || this;
        _this.http = http;
        return _this;
    }
    ForgotPasswordService.prototype.forgotPassword = function (email) {
        var body = JSON.stringify(email);
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post(index_1.API.FORGOT_PASSWORD, body, options)
            .map(this.extractData)
            .catch(this.handleError);
    };
    ForgotPasswordService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http])
    ], ForgotPasswordService);
    return ForgotPasswordService;
}(index_1.BaseService));
exports.ForgotPasswordService = ForgotPasswordService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvbG9naW4vZm9yZ290LXBhc3N3b3JkL2ZvcmdvdC1wYXNzd29yZC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHNDQUEyQztBQUczQywrQ0FBeUQ7QUFDekQsc0NBQThEO0FBRzlEO0lBQTJDLHlDQUFXO0lBQ3BELCtCQUFvQixJQUFVO1FBQTlCLFlBQ0UsaUJBQU8sU0FDUjtRQUZtQixVQUFJLEdBQUosSUFBSSxDQUFNOztJQUU5QixDQUFDO0lBRUQsOENBQWMsR0FBZCxVQUFlLEtBQXFCO1FBQ2xDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDakMsSUFBSSxPQUFPLEdBQUcsSUFBSSxjQUFPLENBQUMsRUFBQyxjQUFjLEVBQUUsa0JBQWtCLEVBQUMsQ0FBQyxDQUFDO1FBQ2hFLElBQUksT0FBTyxHQUFHLElBQUkscUJBQWMsQ0FBQyxFQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDO1FBQ3JELE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFHLENBQUMsZUFBZSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUM7YUFDdEQsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7YUFDckIsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBWlUscUJBQXFCO1FBRGpDLGlCQUFVLEVBQUU7eUNBRWUsV0FBSTtPQURuQixxQkFBcUIsQ0FjakM7SUFBRCw0QkFBQztDQWRELEFBY0MsQ0FkMEMsbUJBQVcsR0FjckQ7QUFkWSxzREFBcUIiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9sb2dpbi9mb3Jnb3QtcGFzc3dvcmQvZm9yZ290LXBhc3N3b3JkLnNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzL09ic2VydmFibGUnO1xyXG5pbXBvcnQgeyBGb3Jnb3RQYXNzd29yZCB9IGZyb20gJy4uLy4uLy4uL3VzZXIvbW9kZWxzL2ZvcmdvdC1wYXNzd29yZCc7XHJcbmltcG9ydCB7IEFQSSwgQmFzZVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zaGFyZWQvaW5kZXgnO1xyXG5pbXBvcnQgeyBIZWFkZXJzLCBIdHRwLCBSZXF1ZXN0T3B0aW9ucyB9IGZyb20gJ0Bhbmd1bGFyL2h0dHAnO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgRm9yZ290UGFzc3dvcmRTZXJ2aWNlIGV4dGVuZHMgQmFzZVNlcnZpY2Uge1xyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgaHR0cDogSHR0cCkge1xyXG4gICAgc3VwZXIoKTtcclxuICB9XHJcblxyXG4gIGZvcmdvdFBhc3N3b3JkKGVtYWlsOiBGb3Jnb3RQYXNzd29yZCk6IE9ic2VydmFibGU8Rm9yZ290UGFzc3dvcmQ+IHtcclxuICAgIHZhciBib2R5ID0gSlNPTi5zdHJpbmdpZnkoZW1haWwpO1xyXG4gICAgbGV0IGhlYWRlcnMgPSBuZXcgSGVhZGVycyh7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ30pO1xyXG4gICAgbGV0IG9wdGlvbnMgPSBuZXcgUmVxdWVzdE9wdGlvbnMoe2hlYWRlcnM6IGhlYWRlcnN9KTtcclxuICAgIHJldHVybiB0aGlzLmh0dHAucG9zdChBUEkuRk9SR09UX1BBU1NXT1JELCBib2R5LCBvcHRpb25zKVxyXG4gICAgICAubWFwKHRoaXMuZXh0cmFjdERhdGEpXHJcbiAgICAgIC5jYXRjaCh0aGlzLmhhbmRsZUVycm9yKTtcclxuICB9XHJcblxyXG59XHJcbiJdfQ==
