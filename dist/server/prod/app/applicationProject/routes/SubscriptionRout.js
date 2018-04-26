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
var express = require("express");
var SubscriptionController = require("./../controllers/SubscriptionController");
var AuthInterceptor = require("./../../framework/interceptor/auth.interceptor");
var typescript_ioc_1 = require("typescript-ioc");
var RequestInterceptor = require("../interceptor/request/RequestInterceptor");
var ResponseInterceptor = require("../interceptor/response/ResponseInterceptor");
var ReportRequestValidator = require("../interceptor/request/validation/SubscriptionInterceptor");
var router = express.Router();
var SubscriptionRout = (function () {
    function SubscriptionRout() {
        this._subscriptionController = new SubscriptionController();
        this.authInterceptor = new AuthInterceptor();
        this.reportRequestValidator = new ReportRequestValidator();
    }
    Object.defineProperty(SubscriptionRout.prototype, "routes", {
        get: function () {
            var controller = this._subscriptionController;
            router.post('/', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept, this.reportRequestValidator.addSubscriptionPackage, controller.addSubscriptionPackage, this._responseInterceptor.exit);
            router.post('/by/name', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept, this.reportRequestValidator.getSubscriptionPackageByName, controller.getSubscriptionPackageByName, this._responseInterceptor.exit);
            return router;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        typescript_ioc_1.Inject,
        __metadata("design:type", RequestInterceptor)
    ], SubscriptionRout.prototype, "_requestInterceptor", void 0);
    __decorate([
        typescript_ioc_1.Inject,
        __metadata("design:type", ResponseInterceptor)
    ], SubscriptionRout.prototype, "_responseInterceptor", void 0);
    __decorate([
        typescript_ioc_1.Inject,
        __metadata("design:type", ReportRequestValidator)
    ], SubscriptionRout.prototype, "reportRequestValidator", void 0);
    return SubscriptionRout;
}());
Object.seal(SubscriptionRout);
module.exports = SubscriptionRout;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHBsaWNhdGlvblByb2plY3Qvcm91dGVzL1N1YnNjcmlwdGlvblJvdXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLGlDQUFvQztBQUNwQyxnRkFBbUY7QUFDbkYsZ0ZBQW1GO0FBRW5GLGlEQUF3QztBQUN4Qyw4RUFBaUY7QUFDakYsaUZBQW9GO0FBQ3BGLGtHQUFxRztBQUVyRyxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7QUFFOUI7SUFXRTtRQUNFLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxJQUFJLHNCQUFzQixFQUFFLENBQUM7UUFDNUQsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLGVBQWUsRUFBRSxDQUFDO1FBQzdDLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLHNCQUFzQixFQUFFLENBQUM7SUFDN0QsQ0FBQztJQUNELHNCQUFJLG9DQUFNO2FBQVY7WUFFRSxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUM7WUFHOUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsRUFDcEYsSUFBSSxDQUFDLHNCQUFzQixDQUFDLHNCQUFzQixFQUFFLFVBQVUsQ0FBQyxzQkFBc0IsRUFBRSxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFekgsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsRUFDM0YsSUFBSSxDQUFDLHNCQUFzQixDQUFDLDRCQUE0QixFQUFFLFVBQVUsQ0FBQyw0QkFBNEIsRUFBRSxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFckksTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNoQixDQUFDOzs7T0FBQTtJQXZCRDtRQURDLHVCQUFNO2tDQUNzQixrQkFBa0I7aUVBQUM7SUFFaEQ7UUFEQyx1QkFBTTtrQ0FDdUIsbUJBQW1CO2tFQUFDO0lBRWxEO1FBREMsdUJBQU07a0NBQ3lCLHNCQUFzQjtvRUFBQztJQW9CekQsdUJBQUM7Q0E3QkQsQUE2QkMsSUFBQTtBQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUM5QixpQkFBUyxnQkFBZ0IsQ0FBQyIsImZpbGUiOiJhcHAvYXBwbGljYXRpb25Qcm9qZWN0L3JvdXRlcy9TdWJzY3JpcHRpb25Sb3V0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGV4cHJlc3MgPSByZXF1aXJlKCdleHByZXNzJyk7XHJcbmltcG9ydCBTdWJzY3JpcHRpb25Db250cm9sbGVyID0gcmVxdWlyZSgnLi8uLi9jb250cm9sbGVycy9TdWJzY3JpcHRpb25Db250cm9sbGVyJyk7XHJcbmltcG9ydCBBdXRoSW50ZXJjZXB0b3IgPSByZXF1aXJlKCcuLy4uLy4uL2ZyYW1ld29yay9pbnRlcmNlcHRvci9hdXRoLmludGVyY2VwdG9yJyk7XHJcbmltcG9ydCBMb2dnZXJJbnRlcmNlcHRvciA9IHJlcXVpcmUoJy4vLi4vLi4vZnJhbWV3b3JrL2ludGVyY2VwdG9yL0xvZ2dlckludGVyY2VwdG9yJyk7XHJcbmltcG9ydCB7IEluamVjdCB9IGZyb20gJ3R5cGVzY3JpcHQtaW9jJztcclxuaW1wb3J0IFJlcXVlc3RJbnRlcmNlcHRvciA9IHJlcXVpcmUoJy4uL2ludGVyY2VwdG9yL3JlcXVlc3QvUmVxdWVzdEludGVyY2VwdG9yJyk7XHJcbmltcG9ydCBSZXNwb25zZUludGVyY2VwdG9yID0gcmVxdWlyZSgnLi4vaW50ZXJjZXB0b3IvcmVzcG9uc2UvUmVzcG9uc2VJbnRlcmNlcHRvcicpO1xyXG5pbXBvcnQgUmVwb3J0UmVxdWVzdFZhbGlkYXRvciA9IHJlcXVpcmUoJy4uL2ludGVyY2VwdG9yL3JlcXVlc3QvdmFsaWRhdGlvbi9TdWJzY3JpcHRpb25JbnRlcmNlcHRvcicpO1xyXG5cclxudmFyIHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKCk7XHJcblxyXG5jbGFzcyBTdWJzY3JpcHRpb25Sb3V0IHtcclxuICBwcml2YXRlIF9zdWJzY3JpcHRpb25Db250cm9sbGVyOiBTdWJzY3JpcHRpb25Db250cm9sbGVyO1xyXG4gIHByaXZhdGUgYXV0aEludGVyY2VwdG9yOiBBdXRoSW50ZXJjZXB0b3I7XHJcbiAgcHJpdmF0ZSBsb2dnZXJJbnRlcmNlcHRvcjogTG9nZ2VySW50ZXJjZXB0b3I7XHJcbiAgQEluamVjdFxyXG4gIHByaXZhdGUgX3JlcXVlc3RJbnRlcmNlcHRvcjogUmVxdWVzdEludGVyY2VwdG9yO1xyXG4gIEBJbmplY3RcclxuICBwcml2YXRlIF9yZXNwb25zZUludGVyY2VwdG9yOiBSZXNwb25zZUludGVyY2VwdG9yO1xyXG4gIEBJbmplY3RcclxuICBwcml2YXRlIHJlcG9ydFJlcXVlc3RWYWxpZGF0b3I6IFJlcG9ydFJlcXVlc3RWYWxpZGF0b3I7XHJcblxyXG4gIGNvbnN0cnVjdG9yICgpIHtcclxuICAgIHRoaXMuX3N1YnNjcmlwdGlvbkNvbnRyb2xsZXIgPSBuZXcgU3Vic2NyaXB0aW9uQ29udHJvbGxlcigpO1xyXG4gICAgdGhpcy5hdXRoSW50ZXJjZXB0b3IgPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XHJcbiAgICB0aGlzLnJlcG9ydFJlcXVlc3RWYWxpZGF0b3IgPSBuZXcgUmVwb3J0UmVxdWVzdFZhbGlkYXRvcigpO1xyXG4gIH1cclxuICBnZXQgcm91dGVzICgpIDogZXhwcmVzcy5Sb3V0ZXIge1xyXG5cclxuICAgIHZhciBjb250cm9sbGVyID0gdGhpcy5fc3Vic2NyaXB0aW9uQ29udHJvbGxlcjtcclxuXHJcbiAgICAvL0FkZCBTdWJzY3JpcHRpb24gUGFja2FnZVxyXG4gICAgcm91dGVyLnBvc3QoJy8nLCB0aGlzLmF1dGhJbnRlcmNlcHRvci5yZXF1aXJlc0F1dGgsIHRoaXMuX3JlcXVlc3RJbnRlcmNlcHRvci5pbnRlcmNlcHQsXHJcbiAgICAgIHRoaXMucmVwb3J0UmVxdWVzdFZhbGlkYXRvci5hZGRTdWJzY3JpcHRpb25QYWNrYWdlLCBjb250cm9sbGVyLmFkZFN1YnNjcmlwdGlvblBhY2thZ2UsIHRoaXMuX3Jlc3BvbnNlSW50ZXJjZXB0b3IuZXhpdCk7XHJcblxyXG4gICAgcm91dGVyLnBvc3QoJy9ieS9uYW1lJywgdGhpcy5hdXRoSW50ZXJjZXB0b3IucmVxdWlyZXNBdXRoLCB0aGlzLl9yZXF1ZXN0SW50ZXJjZXB0b3IuaW50ZXJjZXB0LFxyXG4gICAgICB0aGlzLnJlcG9ydFJlcXVlc3RWYWxpZGF0b3IuZ2V0U3Vic2NyaXB0aW9uUGFja2FnZUJ5TmFtZSwgY29udHJvbGxlci5nZXRTdWJzY3JpcHRpb25QYWNrYWdlQnlOYW1lLCB0aGlzLl9yZXNwb25zZUludGVyY2VwdG9yLmV4aXQpO1xyXG5cclxuICAgIHJldHVybiByb3V0ZXI7XHJcbiAgfVxyXG59XHJcblxyXG5PYmplY3Quc2VhbChTdWJzY3JpcHRpb25Sb3V0KTtcclxuZXhwb3J0ID0gU3Vic2NyaXB0aW9uUm91dDtcclxuIl19
