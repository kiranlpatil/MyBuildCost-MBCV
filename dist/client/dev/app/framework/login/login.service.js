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
require("rxjs/add/operator/map");
require("rxjs/add/operator/catch");
var index_1 = require("../../shared/index");
var LoginService = (function (_super) {
    __extends(LoginService, _super);
    function LoginService(http, messageService) {
        var _this = _super.call(this) || this;
        _this.http = http;
        _this.messageService = messageService;
        return _this;
    }
    LoginService.prototype.userLogin = function (login) {
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        var body = JSON.stringify(login);
        return this.http.post(index_1.API.LOGIN, body, options)
            .map(this.extractData)
            .catch(this.handleError);
    };
    LoginService.prototype.setFBToken = function (fbToken) {
        var headers = new http_1.Headers({ 'Authorization': 'Bearer ' + fbToken });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.get(index_1.API.FB_LOGIN, options)
            .map(this.extractData)
            .catch(this.handleError);
    };
    LoginService.prototype.setGoogleToken = function (model) {
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        var body = JSON.stringify(model);
        return this.http.post(index_1.API.GOOGLE_LOGIN, body, options)
            .map(this.extractData)
            .catch(this.handleError);
    };
    LoginService.prototype.sendMailToAdmin = function (data) {
        var body = JSON.stringify(data);
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post(index_1.API.SEND_TO_ADMIN_MAIL, body, options)
            .map(this.extractDataWithoutToken)
            .catch(this.handleError);
    };
    LoginService.prototype.getUserData = function () {
        var url = index_1.API.USER_DATA;
        return this.http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
    };
    LoginService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http, index_1.MessageService])
    ], LoginService);
    return LoginService;
}(index_1.BaseService));
exports.LoginService = LoginService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvbG9naW4vbG9naW4uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzQ0FBMkM7QUFDM0Msc0NBQThEO0FBRTlELGlDQUErQjtBQUMvQixtQ0FBaUM7QUFDakMsNENBQXNFO0FBT3RFO0lBQWtDLGdDQUFXO0lBRTNDLHNCQUFzQixJQUFVLEVBQVksY0FBOEI7UUFBMUUsWUFDRSxpQkFBTyxTQUNSO1FBRnFCLFVBQUksR0FBSixJQUFJLENBQU07UUFBWSxvQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7O0lBRTFFLENBQUM7SUFFRCxnQ0FBUyxHQUFULFVBQVUsS0FBWTtRQUNwQixJQUFJLE9BQU8sR0FBRyxJQUFJLGNBQU8sQ0FBQyxFQUFDLGNBQWMsRUFBRSxrQkFBa0IsRUFBQyxDQUFDLENBQUM7UUFDaEUsSUFBSSxPQUFPLEdBQUcsSUFBSSxxQkFBYyxDQUFDLEVBQUMsT0FBTyxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUM7UUFDckQsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNqQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDO2FBQzVDLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO2FBQ3JCLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUVELGlDQUFVLEdBQVYsVUFBVyxPQUFZO1FBQ3JCLElBQUksT0FBTyxHQUFHLElBQUksY0FBTyxDQUFDLEVBQUMsZUFBZSxFQUFFLFNBQVMsR0FBRyxPQUFPLEVBQUMsQ0FBQyxDQUFDO1FBQ2xFLElBQUksT0FBTyxHQUFHLElBQUkscUJBQWMsQ0FBQyxFQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDO1FBQ3JELE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFHLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQzthQUN4QyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQzthQUNyQixLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFRCxxQ0FBYyxHQUFkLFVBQWUsS0FBa0I7UUFDL0IsSUFBSSxPQUFPLEdBQUcsSUFBSSxjQUFPLENBQUMsRUFBQyxjQUFjLEVBQUUsa0JBQWtCLEVBQUMsQ0FBQyxDQUFDO1FBQ2hFLElBQUksT0FBTyxHQUFHLElBQUkscUJBQWMsQ0FBQyxFQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDO1FBQ3JELElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDakMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQUcsQ0FBQyxZQUFZLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQzthQUNuRCxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQzthQUNyQixLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFDRCxzQ0FBZSxHQUFmLFVBQWdCLElBQVE7UUFDdEIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoQyxJQUFJLE9BQU8sR0FBRyxJQUFJLGNBQU8sQ0FBQyxFQUFDLGNBQWMsRUFBRSxrQkFBa0IsRUFBQyxDQUFDLENBQUM7UUFDaEUsSUFBSSxPQUFPLEdBQUcsSUFBSSxxQkFBYyxDQUFDLEVBQUMsT0FBTyxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUM7UUFDckQsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDO2FBQ3pELEdBQUcsQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUM7YUFDakMsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBRUQsa0NBQVcsR0FBWDtRQUNFLElBQUksR0FBRyxHQUFHLFdBQUcsQ0FBQyxTQUFTLENBQUM7UUFDeEIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQzthQUN0QixHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQzthQUNyQixLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUE3Q1UsWUFBWTtRQUZ4QixpQkFBVSxFQUFFO3lDQUlpQixXQUFJLEVBQTRCLHNCQUFjO09BRi9ELFlBQVksQ0ErQ3hCO0lBQUQsbUJBQUM7Q0EvQ0QsQUErQ0MsQ0EvQ2lDLG1CQUFXLEdBK0M1QztBQS9DWSxvQ0FBWSIsImZpbGUiOiJhcHAvZnJhbWV3b3JrL2xvZ2luL2xvZ2luLnNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEhlYWRlcnMsIEh0dHAsIFJlcXVlc3RPcHRpb25zIH0gZnJvbSAnQGFuZ3VsYXIvaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzL09ic2VydmFibGUnO1xyXG5pbXBvcnQgJ3J4anMvYWRkL29wZXJhdG9yL21hcCc7XHJcbmltcG9ydCAncnhqcy9hZGQvb3BlcmF0b3IvY2F0Y2gnO1xyXG5pbXBvcnQgeyBBUEksIEJhc2VTZXJ2aWNlLCBNZXNzYWdlU2VydmljZSB9IGZyb20gJy4uLy4uL3NoYXJlZC9pbmRleCc7XHJcbmltcG9ydCB7IEdvb2dsZVRva2VuIH0gZnJvbSAnLi4vLi4vdXNlci9tb2RlbHMvZ29vZ2xldG9rZW4nO1xyXG5pbXBvcnQgeyBMb2dpbiB9IGZyb20gJy4uLy4uL3VzZXIvbW9kZWxzL2xvZ2luJztcclxuXHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcblxyXG5leHBvcnQgY2xhc3MgTG9naW5TZXJ2aWNlIGV4dGVuZHMgQmFzZVNlcnZpY2Uge1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgaHR0cDogSHR0cCwgcHJvdGVjdGVkIG1lc3NhZ2VTZXJ2aWNlOiBNZXNzYWdlU2VydmljZSkge1xyXG4gICAgc3VwZXIoKTtcclxuICB9XHJcblxyXG4gIHVzZXJMb2dpbihsb2dpbjogTG9naW4pOiBPYnNlcnZhYmxlPExvZ2luPiB7XHJcbiAgICBsZXQgaGVhZGVycyA9IG5ldyBIZWFkZXJzKHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nfSk7XHJcbiAgICBsZXQgb3B0aW9ucyA9IG5ldyBSZXF1ZXN0T3B0aW9ucyh7aGVhZGVyczogaGVhZGVyc30pO1xyXG4gICAgdmFyIGJvZHkgPSBKU09OLnN0cmluZ2lmeShsb2dpbik7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QoQVBJLkxPR0lOLCBib2R5LCBvcHRpb25zKVxyXG4gICAgICAubWFwKHRoaXMuZXh0cmFjdERhdGEpXHJcbiAgICAgIC5jYXRjaCh0aGlzLmhhbmRsZUVycm9yKTtcclxuICB9XHJcblxyXG4gIHNldEZCVG9rZW4oZmJUb2tlbjogYW55KTogT2JzZXJ2YWJsZTxTdHJpbmc+IHtcclxuICAgIGxldCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoeydBdXRob3JpemF0aW9uJzogJ0JlYXJlciAnICsgZmJUb2tlbn0pO1xyXG4gICAgbGV0IG9wdGlvbnMgPSBuZXcgUmVxdWVzdE9wdGlvbnMoe2hlYWRlcnM6IGhlYWRlcnN9KTtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KEFQSS5GQl9MT0dJTiwgb3B0aW9ucylcclxuICAgICAgLm1hcCh0aGlzLmV4dHJhY3REYXRhKVxyXG4gICAgICAuY2F0Y2godGhpcy5oYW5kbGVFcnJvcik7XHJcbiAgfVxyXG5cclxuICBzZXRHb29nbGVUb2tlbihtb2RlbDogR29vZ2xlVG9rZW4pOiBPYnNlcnZhYmxlPFN0cmluZz4ge1xyXG4gICAgbGV0IGhlYWRlcnMgPSBuZXcgSGVhZGVycyh7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ30pO1xyXG4gICAgbGV0IG9wdGlvbnMgPSBuZXcgUmVxdWVzdE9wdGlvbnMoe2hlYWRlcnM6IGhlYWRlcnN9KTtcclxuICAgIHZhciBib2R5ID0gSlNPTi5zdHJpbmdpZnkobW9kZWwpO1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KEFQSS5HT09HTEVfTE9HSU4sIGJvZHksIG9wdGlvbnMpXHJcbiAgICAgIC5tYXAodGhpcy5leHRyYWN0RGF0YSlcclxuICAgICAgLmNhdGNoKHRoaXMuaGFuZGxlRXJyb3IpO1xyXG4gIH1cclxuICBzZW5kTWFpbFRvQWRtaW4oZGF0YTphbnkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgdmFyIGJvZHkgPSBKU09OLnN0cmluZ2lmeShkYXRhKTtcclxuICAgIGxldCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbid9KTtcclxuICAgIGxldCBvcHRpb25zID0gbmV3IFJlcXVlc3RPcHRpb25zKHtoZWFkZXJzOiBoZWFkZXJzfSk7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QoQVBJLlNFTkRfVE9fQURNSU5fTUFJTCwgYm9keSwgb3B0aW9ucylcclxuICAgICAgLm1hcCh0aGlzLmV4dHJhY3REYXRhV2l0aG91dFRva2VuKVxyXG4gICAgICAuY2F0Y2godGhpcy5oYW5kbGVFcnJvcik7XHJcbiAgfVxyXG5cclxuICBnZXRVc2VyRGF0YSgpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgdmFyIHVybCA9IEFQSS5VU0VSX0RBVEE7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmdldCh1cmwpXHJcbiAgICAgIC5tYXAodGhpcy5leHRyYWN0RGF0YSlcclxuICAgICAgLmNhdGNoKHRoaXMuaGFuZGxlRXJyb3IpO1xyXG4gIH1cclxuXHJcbn1cclxuIl19
