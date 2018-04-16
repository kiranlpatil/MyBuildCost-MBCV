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
var message_service_1 = require("../../shared/services/message.service");
var message_1 = require("../../shared/models/message");
var LoggerService = (function () {
    function LoggerService(messageService) {
        this.messageService = messageService;
    }
    LoggerService.prototype.log = function (error) {
        var message = new message_1.Message();
        message.error_msg = error.message;
        message.isError = true;
        this.messageService.message(message);
    };
    LoggerService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [message_service_1.MessageService])
    ], LoggerService);
    return LoggerService;
}());
exports.LoggerService = LoggerService;
var MyErrorHandler = (function (_super) {
    __extends(MyErrorHandler, _super);
    function MyErrorHandler(logger) {
        var _this = _super.call(this, true) || this;
        _this.logger = logger;
        return _this;
    }
    MyErrorHandler.prototype.handleError = function (error) {
        this.logger.log(error);
        _super.prototype.handleError.call(this, error);
    };
    MyErrorHandler = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [LoggerService])
    ], MyErrorHandler);
    return MyErrorHandler;
}(core_1.ErrorHandler));
exports.MyErrorHandler = MyErrorHandler;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9teS1lcnJvci1oYW5kbGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsc0NBQXlEO0FBQ3pELHlFQUF1RTtBQUN2RSx1REFBc0Q7QUFHdEQ7SUFDRSx1QkFBb0IsY0FBOEI7UUFBOUIsbUJBQWMsR0FBZCxjQUFjLENBQWdCO0lBQUUsQ0FBQztJQUVyRCwyQkFBRyxHQUFILFVBQUksS0FBUztRQUNYLElBQUksT0FBTyxHQUFHLElBQUksaUJBQU8sRUFBRSxDQUFDO1FBQzVCLE9BQU8sQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUNsQyxPQUFPLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztRQUN2QixJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBUlUsYUFBYTtRQUR6QixpQkFBVSxFQUFFO3lDQUV5QixnQ0FBYztPQUR2QyxhQUFhLENBU3pCO0lBQUQsb0JBQUM7Q0FURCxBQVNDLElBQUE7QUFUWSxzQ0FBYTtBQVkxQjtJQUFvQyxrQ0FBWTtJQUU5Qyx3QkFBb0IsTUFBcUI7UUFBekMsWUFHRSxrQkFBTSxJQUFJLENBQUMsU0FDWjtRQUptQixZQUFNLEdBQU4sTUFBTSxDQUFlOztJQUl6QyxDQUFDO0lBRUQsb0NBQVcsR0FBWCxVQUFZLEtBQVM7UUFDbkIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdkIsaUJBQU0sV0FBVyxZQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFYVSxjQUFjO1FBRDFCLGlCQUFVLEVBQUU7eUNBR2lCLGFBQWE7T0FGOUIsY0FBYyxDQVkxQjtJQUFELHFCQUFDO0NBWkQsQUFZQyxDQVptQyxtQkFBWSxHQVkvQztBQVpZLHdDQUFjIiwiZmlsZSI6ImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9teS1lcnJvci1oYW5kbGVyLnNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFcnJvckhhbmRsZXIsIEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgTWVzc2FnZVNlcnZpY2UgfSBmcm9tICcuLi8uLi9zaGFyZWQvc2VydmljZXMvbWVzc2FnZS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgTWVzc2FnZSB9IGZyb20gJy4uLy4uL3NoYXJlZC9tb2RlbHMvbWVzc2FnZSc7XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBMb2dnZXJTZXJ2aWNlIHtcclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIG1lc3NhZ2VTZXJ2aWNlOiBNZXNzYWdlU2VydmljZSl7fVxyXG5cclxuICBsb2coZXJyb3I6YW55KSB7XHJcbiAgICB2YXIgbWVzc2FnZSA9IG5ldyBNZXNzYWdlKCk7XHJcbiAgICBtZXNzYWdlLmVycm9yX21zZyA9IGVycm9yLm1lc3NhZ2U7XHJcbiAgICBtZXNzYWdlLmlzRXJyb3IgPSB0cnVlO1xyXG4gICAgdGhpcy5tZXNzYWdlU2VydmljZS5tZXNzYWdlKG1lc3NhZ2UpO1xyXG4gIH1cclxufVxyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgTXlFcnJvckhhbmRsZXIgZXh0ZW5kcyBFcnJvckhhbmRsZXIge1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGxvZ2dlcjogTG9nZ2VyU2VydmljZSkge1xyXG4gICAgLy8gV2UgcmV0aHJvdyBleGNlcHRpb25zLCBzbyBvcGVyYXRpb25zIGxpa2UgJ2Jvb3RzdHJhcCcgd2lsbCByZXN1bHQgaW4gYW4gZXJyb3JcclxuICAgIC8vIHdoZW4gYW4gZXJyb3IgaGFwcGVucy4gSWYgd2UgZG8gbm90IHJldGhyb3csIGJvb3RzdHJhcCB3aWxsIGFsd2F5cyBzdWNjZWVkLlxyXG4gICAgc3VwZXIodHJ1ZSk7XHJcbiAgfVxyXG5cclxuICBoYW5kbGVFcnJvcihlcnJvcjphbnkpIHtcclxuICAgIHRoaXMubG9nZ2VyLmxvZyhlcnJvcik7XHJcbiAgICBzdXBlci5oYW5kbGVFcnJvcihlcnJvcik7XHJcbiAgfVxyXG59XHJcbiJdfQ==
