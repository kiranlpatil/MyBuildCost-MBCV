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
var OtpVerificationService = (function (_super) {
    __extends(OtpVerificationService, _super);
    function OtpVerificationService(http, messageService) {
        var _this = _super.call(this) || this;
        _this.http = http;
        _this.messageService = messageService;
        return _this;
    }
    OtpVerificationService.prototype.verifyPhone = function (user, userId) {
        var url = index_1.API.VERIFY_OTP + '/' + userId;
        var body = JSON.stringify(user);
        return this.http.put(url, body)
            .map(this.extractData)
            .catch(this.handleError);
    };
    OtpVerificationService.prototype.resendVerificationCode = function (userId, mobileNumber) {
        var url = index_1.API.GENERATE_OTP + '/' + userId;
        var body = { 'mobile_number': mobileNumber };
        return this.http.post(url, body)
            .map(this.extractData)
            .catch(this.handleError);
    };
    OtpVerificationService.prototype.resendChangeMobileVerificationCode = function (data) {
        var url = index_1.API.CHANGE_MOBILE + '/' + data.id;
        var body = { 'new_mobile_number': data.new_mobile_number };
        return this.http.put(url, body)
            .map(this.extractData)
            .catch(this.handleError);
    };
    OtpVerificationService.prototype.changeMobile = function (user, userid) {
        var url = index_1.API.VERIFY_MOBILE + '/' + userid;
        var body = JSON.stringify(user);
        return this.http.put(url, body)
            .map(this.extractData)
            .catch(this.handleError);
    };
    OtpVerificationService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http, index_1.MessageService])
    ], OtpVerificationService);
    return OtpVerificationService;
}(index_1.BaseService));
exports.OtpVerificationService = OtpVerificationService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC91c2VyL290cC12ZXJpZmljYXRpb24vb3RwLXZlcmlmaWNhdGlvbi5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHNDQUEyQztBQUMzQyxzQ0FBcUM7QUFFckMsNENBQXNFO0FBS3RFO0lBQTRDLDBDQUFXO0lBRXJELGdDQUFzQixJQUFVLEVBQVksY0FBOEI7UUFBMUUsWUFDRSxpQkFBTyxTQUNSO1FBRnFCLFVBQUksR0FBSixJQUFJLENBQU07UUFBWSxvQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7O0lBRTFFLENBQUM7SUFFRCw0Q0FBVyxHQUFYLFVBQVksSUFBZSxFQUFDLE1BQVU7UUFDcEMsSUFBSSxHQUFHLEdBQUcsV0FBRyxDQUFDLFVBQVUsR0FBRyxHQUFHLEdBQUcsTUFBTSxDQUFDO1FBQ3hDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDaEMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUM7YUFDNUIsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7YUFDckIsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBRUQsdURBQXNCLEdBQXRCLFVBQXVCLE1BQVUsRUFBQyxZQUFnQjtRQUNoRCxJQUFJLEdBQUcsR0FBRyxXQUFHLENBQUMsWUFBWSxHQUFHLEdBQUcsR0FBRyxNQUFNLENBQUM7UUFDMUMsSUFBSSxJQUFJLEdBQUcsRUFBQyxlQUFlLEVBQUUsWUFBWSxFQUFDLENBQUM7UUFDM0MsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUM7YUFDN0IsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7YUFDckIsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBRUQsbUVBQWtDLEdBQWxDLFVBQW1DLElBQVE7UUFDekMsSUFBSSxHQUFHLEdBQUcsV0FBRyxDQUFDLGFBQWEsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUM1QyxJQUFJLElBQUksR0FBRyxFQUFDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxpQkFBaUIsRUFBQyxDQUFDO1FBQ3pELE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDO2FBQzVCLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO2FBQ3JCLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUVELDZDQUFZLEdBQVosVUFBYSxJQUFlLEVBQUMsTUFBVTtRQUNyQyxJQUFJLEdBQUcsR0FBRyxXQUFHLENBQUMsYUFBYSxHQUFHLEdBQUcsR0FBRyxNQUFNLENBQUM7UUFDM0MsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQzthQUM1QixHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQzthQUNyQixLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFwQ1Usc0JBQXNCO1FBRGxDLGlCQUFVLEVBQUU7eUNBR2lCLFdBQUksRUFBNEIsc0JBQWM7T0FGL0Qsc0JBQXNCLENBcUNsQztJQUFELDZCQUFDO0NBckNELEFBcUNDLENBckMyQyxtQkFBVyxHQXFDdEQ7QUFyQ1ksd0RBQXNCIiwiZmlsZSI6ImFwcC91c2VyL290cC12ZXJpZmljYXRpb24vb3RwLXZlcmlmaWNhdGlvbi5zZXJ2aWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwIH0gZnJvbSAnQGFuZ3VsYXIvaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzL09ic2VydmFibGUnO1xyXG5pbXBvcnQgeyBBUEksIEJhc2VTZXJ2aWNlLCBNZXNzYWdlU2VydmljZSB9IGZyb20gJy4uLy4uL3NoYXJlZC9pbmRleCc7XHJcbmltcG9ydCB7IFZlcmlmeU90cCB9IGZyb20gJy4uL21vZGVscy92ZXJpZnktb3RwJztcclxuXHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBPdHBWZXJpZmljYXRpb25TZXJ2aWNlIGV4dGVuZHMgQmFzZVNlcnZpY2Uge1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgaHR0cDogSHR0cCwgcHJvdGVjdGVkIG1lc3NhZ2VTZXJ2aWNlOiBNZXNzYWdlU2VydmljZSkge1xyXG4gICAgc3VwZXIoKTtcclxuICB9XHJcblxyXG4gIHZlcmlmeVBob25lKHVzZXI6IFZlcmlmeU90cCx1c2VySWQ6YW55KTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIHZhciB1cmwgPSBBUEkuVkVSSUZZX09UUCArICcvJyArIHVzZXJJZDtcclxuICAgIHZhciBib2R5ID0gSlNPTi5zdHJpbmdpZnkodXNlcik7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLnB1dCh1cmwsIGJvZHkpXHJcbiAgICAgIC5tYXAodGhpcy5leHRyYWN0RGF0YSlcclxuICAgICAgLmNhdGNoKHRoaXMuaGFuZGxlRXJyb3IpO1xyXG4gIH1cclxuXHJcbiAgcmVzZW5kVmVyaWZpY2F0aW9uQ29kZSh1c2VySWQ6YW55LG1vYmlsZU51bWJlcjphbnkpIHtcclxuICAgIHZhciB1cmwgPSBBUEkuR0VORVJBVEVfT1RQICsgJy8nICsgdXNlcklkO1xyXG4gICAgdmFyIGJvZHkgPSB7J21vYmlsZV9udW1iZXInOiBtb2JpbGVOdW1iZXJ9O1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KHVybCwgYm9keSlcclxuICAgICAgLm1hcCh0aGlzLmV4dHJhY3REYXRhKVxyXG4gICAgICAuY2F0Y2godGhpcy5oYW5kbGVFcnJvcik7XHJcbiAgfVxyXG5cclxuICByZXNlbmRDaGFuZ2VNb2JpbGVWZXJpZmljYXRpb25Db2RlKGRhdGE6YW55KSB7XHJcbiAgICB2YXIgdXJsID0gQVBJLkNIQU5HRV9NT0JJTEUgKyAnLycgKyBkYXRhLmlkO1xyXG4gICAgdmFyIGJvZHkgPSB7J25ld19tb2JpbGVfbnVtYmVyJzogZGF0YS5uZXdfbW9iaWxlX251bWJlcn07XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLnB1dCh1cmwsIGJvZHkpXHJcbiAgICAgIC5tYXAodGhpcy5leHRyYWN0RGF0YSlcclxuICAgICAgLmNhdGNoKHRoaXMuaGFuZGxlRXJyb3IpO1xyXG4gIH1cclxuXHJcbiAgY2hhbmdlTW9iaWxlKHVzZXI6IFZlcmlmeU90cCx1c2VyaWQ6YW55KTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIHZhciB1cmwgPSBBUEkuVkVSSUZZX01PQklMRSArICcvJyArIHVzZXJpZDtcclxuICAgIHZhciBib2R5ID0gSlNPTi5zdHJpbmdpZnkodXNlcik7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLnB1dCh1cmwsIGJvZHkpXHJcbiAgICAgIC5tYXAodGhpcy5leHRyYWN0RGF0YSlcclxuICAgICAgLmNhdGNoKHRoaXMuaGFuZGxlRXJyb3IpO1xyXG4gIH1cclxufVxyXG4iXX0=
