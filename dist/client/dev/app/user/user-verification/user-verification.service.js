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
var UserVerificationService = (function (_super) {
    __extends(UserVerificationService, _super);
    function UserVerificationService(http, messageService) {
        var _this = _super.call(this) || this;
        _this.http = http;
        _this.messageService = messageService;
        return _this;
    }
    UserVerificationService.prototype.verifyUserByMail = function (user) {
        index_1.SessionStorageService.setSessionValue(index_1.SessionStorage.CHANGE_MAIL_VALUE, 'from_registration');
        var url = index_1.API.SEND_VERIFICATION_MAIL + '/' + index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.USER_ID);
        var body = JSON.stringify(user);
        return this.http.post(url, body)
            .map(this.extractData)
            .catch(this.handleError);
    };
    UserVerificationService.prototype.verifyUserByMobile = function (user) {
        var url = index_1.API.GENERATE_OTP + '/' + index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.USER_ID);
        var body = JSON.stringify(user);
        return this.http.post(url, body)
            .map(this.extractData)
            .catch(this.handleError);
    };
    UserVerificationService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http, index_1.MessageService])
    ], UserVerificationService);
    return UserVerificationService;
}(index_1.BaseService));
exports.UserVerificationService = UserVerificationService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC91c2VyL3VzZXItdmVyaWZpY2F0aW9uL3VzZXItdmVyaWZpY2F0aW9uLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsc0NBQTJDO0FBQzNDLHNDQUFxQztBQUVyQyw0Q0FBNkc7QUFLN0c7SUFBNkMsMkNBQVc7SUFFdEQsaUNBQXNCLElBQVUsRUFBWSxjQUE4QjtRQUExRSxZQUNFLGlCQUFPLFNBQ1I7UUFGcUIsVUFBSSxHQUFKLElBQUksQ0FBTTtRQUFZLG9CQUFjLEdBQWQsY0FBYyxDQUFnQjs7SUFFMUUsQ0FBQztJQUVELGtEQUFnQixHQUFoQixVQUFpQixJQUFnQjtRQUMvQiw2QkFBcUIsQ0FBQyxlQUFlLENBQUMsc0JBQWMsQ0FBQyxpQkFBaUIsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1FBQzdGLElBQUksR0FBRyxHQUFHLFdBQUcsQ0FBQyxzQkFBc0IsR0FBRyxHQUFHLEdBQUcsNkJBQXFCLENBQUMsZUFBZSxDQUFDLHNCQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDM0csSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQzthQUM3QixHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQzthQUNyQixLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFRCxvREFBa0IsR0FBbEIsVUFBbUIsSUFBZ0I7UUFDakMsSUFBSSxHQUFHLEdBQUcsV0FBRyxDQUFDLFlBQVksR0FBRyxHQUFHLEdBQUcsNkJBQXFCLENBQUMsZUFBZSxDQUFDLHNCQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDakcsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQzthQUM3QixHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQzthQUNyQixLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFyQlUsdUJBQXVCO1FBRG5DLGlCQUFVLEVBQUU7eUNBR2lCLFdBQUksRUFBNEIsc0JBQWM7T0FGL0QsdUJBQXVCLENBc0JuQztJQUFELDhCQUFDO0NBdEJELEFBc0JDLENBdEI0QyxtQkFBVyxHQXNCdkQ7QUF0QlksMERBQXVCIiwiZmlsZSI6ImFwcC91c2VyL3VzZXItdmVyaWZpY2F0aW9uL3VzZXItdmVyaWZpY2F0aW9uLnNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHAgfSBmcm9tICdAYW5ndWxhci9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMvT2JzZXJ2YWJsZSc7XHJcbmltcG9ydCB7IEFQSSwgQmFzZVNlcnZpY2UsIFNlc3Npb25TdG9yYWdlLCBTZXNzaW9uU3RvcmFnZVNlcnZpY2UsIE1lc3NhZ2VTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2hhcmVkL2luZGV4JztcclxuaW1wb3J0IHsgVmVyaWZ5VXNlciB9IGZyb20gJy4uL21vZGVscy92ZXJpZnktdXNlcic7XHJcblxyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgVXNlclZlcmlmaWNhdGlvblNlcnZpY2UgZXh0ZW5kcyBCYXNlU2VydmljZSB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBodHRwOiBIdHRwLCBwcm90ZWN0ZWQgbWVzc2FnZVNlcnZpY2U6IE1lc3NhZ2VTZXJ2aWNlKSB7XHJcbiAgICBzdXBlcigpO1xyXG4gIH1cclxuXHJcbiAgdmVyaWZ5VXNlckJ5TWFpbCh1c2VyOiBWZXJpZnlVc2VyKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIFNlc3Npb25TdG9yYWdlU2VydmljZS5zZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuQ0hBTkdFX01BSUxfVkFMVUUsICdmcm9tX3JlZ2lzdHJhdGlvbicpO1xyXG4gICAgdmFyIHVybCA9IEFQSS5TRU5EX1ZFUklGSUNBVElPTl9NQUlMICsgJy8nICsgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLmdldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5VU0VSX0lEKTtcclxuICAgIHZhciBib2R5ID0gSlNPTi5zdHJpbmdpZnkodXNlcik7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QodXJsLCBib2R5KVxyXG4gICAgICAubWFwKHRoaXMuZXh0cmFjdERhdGEpXHJcbiAgICAgIC5jYXRjaCh0aGlzLmhhbmRsZUVycm9yKTtcclxuICB9XHJcblxyXG4gIHZlcmlmeVVzZXJCeU1vYmlsZSh1c2VyOiBWZXJpZnlVc2VyKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIHZhciB1cmwgPSBBUEkuR0VORVJBVEVfT1RQICsgJy8nICsgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLmdldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5VU0VSX0lEKTtcclxuICAgIHZhciBib2R5ID0gSlNPTi5zdHJpbmdpZnkodXNlcik7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QodXJsLCBib2R5KVxyXG4gICAgICAubWFwKHRoaXMuZXh0cmFjdERhdGEpXHJcbiAgICAgIC5jYXRjaCh0aGlzLmhhbmRsZUVycm9yKTtcclxuICB9XHJcbn1cclxuIl19
