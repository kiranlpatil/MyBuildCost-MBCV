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
var SubscriptionRoutes = (function () {
    function SubscriptionRoutes() {
        this._subscriptionController = new SubscriptionController();
        this.authInterceptor = new AuthInterceptor();
        this.reportRequestValidator = new ReportRequestValidator();
    }
    Object.defineProperty(SubscriptionRoutes.prototype, "routes", {
        get: function () {
            var controller = this._subscriptionController;
            router.post('/', controller.addSubscriptionPackage, this._responseInterceptor.exit);
            router.post('/payUMoney', controller.generatePayUMoneyTransacction, this._responseInterceptor.exit);
            router.post('/payment/success', controller.successPayment, this._responseInterceptor.exit);
            router.post('/payment/failure', controller.failurePayment, this._responseInterceptor.exit);
            router.get('/basepackageslist', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept, controller.getBaseSubscriptionPackageList, this._responseInterceptor.exit);
            router.post('/by/name', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept, this.reportRequestValidator.getSubscriptionPackageByName, controller.getSubscriptionPackageByName, this._responseInterceptor.exit);
            router.post('/pay/success', controller.successPayuMoney, this._responseInterceptor.exit);
            return router;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        typescript_ioc_1.Inject,
        __metadata("design:type", RequestInterceptor)
    ], SubscriptionRoutes.prototype, "_requestInterceptor", void 0);
    __decorate([
        typescript_ioc_1.Inject,
        __metadata("design:type", ResponseInterceptor)
    ], SubscriptionRoutes.prototype, "_responseInterceptor", void 0);
    __decorate([
        typescript_ioc_1.Inject,
        __metadata("design:type", ReportRequestValidator)
    ], SubscriptionRoutes.prototype, "reportRequestValidator", void 0);
    return SubscriptionRoutes;
}());
Object.seal(SubscriptionRoutes);
module.exports = SubscriptionRoutes;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHBsaWNhdGlvblByb2plY3Qvcm91dGVzL1N1YnNjcmlwdGlvblJvdXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsaUNBQW9DO0FBQ3BDLGdGQUFtRjtBQUNuRixnRkFBbUY7QUFFbkYsaURBQXdDO0FBQ3hDLDhFQUFpRjtBQUNqRixpRkFBb0Y7QUFDcEYsa0dBQXFHO0FBRXJHLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUU5QjtJQVdFO1FBQ0UsSUFBSSxDQUFDLHVCQUF1QixHQUFHLElBQUksc0JBQXNCLEVBQUUsQ0FBQztRQUM1RCxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksZUFBZSxFQUFFLENBQUM7UUFDN0MsSUFBSSxDQUFDLHNCQUFzQixHQUFHLElBQUksc0JBQXNCLEVBQUUsQ0FBQztJQUM3RCxDQUFDO0lBQ0Qsc0JBQUksc0NBQU07YUFBVjtZQUVFLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQztZQUc5QyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRyxVQUFVLENBQUMsc0JBQXNCLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBRXJGLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFHLFVBQVUsQ0FBQyw2QkFBNkIsRUFBRSxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFckcsTUFBTSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRyxVQUFVLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUU1RixNQUFNLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFHLFVBQVUsQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBRTVGLE1BQU0sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsRUFDbkcsVUFBVSxDQUFDLDhCQUE4QixFQUFFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUU3RSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsU0FBUyxFQUMzRixJQUFJLENBQUMsc0JBQXNCLENBQUMsNEJBQTRCLEVBQUUsVUFBVSxDQUFDLDRCQUE0QixFQUFFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUdySSxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRyxVQUFVLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBRTFGLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDaEIsQ0FBQzs7O09BQUE7SUFsQ0Q7UUFEQyx1QkFBTTtrQ0FDc0Isa0JBQWtCO21FQUFDO0lBRWhEO1FBREMsdUJBQU07a0NBQ3VCLG1CQUFtQjtvRUFBQztJQUVsRDtRQURDLHVCQUFNO2tDQUN5QixzQkFBc0I7c0VBQUM7SUErQnpELHlCQUFDO0NBeENELEFBd0NDLElBQUE7QUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDaEMsaUJBQVMsa0JBQWtCLENBQUMiLCJmaWxlIjoiYXBwL2FwcGxpY2F0aW9uUHJvamVjdC9yb3V0ZXMvU3Vic2NyaXB0aW9uUm91dGVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGV4cHJlc3MgPSByZXF1aXJlKCdleHByZXNzJyk7XHJcbmltcG9ydCBTdWJzY3JpcHRpb25Db250cm9sbGVyID0gcmVxdWlyZSgnLi8uLi9jb250cm9sbGVycy9TdWJzY3JpcHRpb25Db250cm9sbGVyJyk7XHJcbmltcG9ydCBBdXRoSW50ZXJjZXB0b3IgPSByZXF1aXJlKCcuLy4uLy4uL2ZyYW1ld29yay9pbnRlcmNlcHRvci9hdXRoLmludGVyY2VwdG9yJyk7XHJcbmltcG9ydCBMb2dnZXJJbnRlcmNlcHRvciA9IHJlcXVpcmUoJy4vLi4vLi4vZnJhbWV3b3JrL2ludGVyY2VwdG9yL0xvZ2dlckludGVyY2VwdG9yJyk7XHJcbmltcG9ydCB7IEluamVjdCB9IGZyb20gJ3R5cGVzY3JpcHQtaW9jJztcclxuaW1wb3J0IFJlcXVlc3RJbnRlcmNlcHRvciA9IHJlcXVpcmUoJy4uL2ludGVyY2VwdG9yL3JlcXVlc3QvUmVxdWVzdEludGVyY2VwdG9yJyk7XHJcbmltcG9ydCBSZXNwb25zZUludGVyY2VwdG9yID0gcmVxdWlyZSgnLi4vaW50ZXJjZXB0b3IvcmVzcG9uc2UvUmVzcG9uc2VJbnRlcmNlcHRvcicpO1xyXG5pbXBvcnQgUmVwb3J0UmVxdWVzdFZhbGlkYXRvciA9IHJlcXVpcmUoJy4uL2ludGVyY2VwdG9yL3JlcXVlc3QvdmFsaWRhdGlvbi9TdWJzY3JpcHRpb25JbnRlcmNlcHRvcicpO1xyXG5cclxudmFyIHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKCk7XHJcblxyXG5jbGFzcyBTdWJzY3JpcHRpb25Sb3V0ZXMge1xyXG4gIHByaXZhdGUgX3N1YnNjcmlwdGlvbkNvbnRyb2xsZXI6IFN1YnNjcmlwdGlvbkNvbnRyb2xsZXI7XHJcbiAgcHJpdmF0ZSBhdXRoSW50ZXJjZXB0b3I6IEF1dGhJbnRlcmNlcHRvcjtcclxuICBwcml2YXRlIGxvZ2dlckludGVyY2VwdG9yOiBMb2dnZXJJbnRlcmNlcHRvcjtcclxuICBASW5qZWN0XHJcbiAgcHJpdmF0ZSBfcmVxdWVzdEludGVyY2VwdG9yOiBSZXF1ZXN0SW50ZXJjZXB0b3I7XHJcbiAgQEluamVjdFxyXG4gIHByaXZhdGUgX3Jlc3BvbnNlSW50ZXJjZXB0b3I6IFJlc3BvbnNlSW50ZXJjZXB0b3I7XHJcbiAgQEluamVjdFxyXG4gIHByaXZhdGUgcmVwb3J0UmVxdWVzdFZhbGlkYXRvcjogUmVwb3J0UmVxdWVzdFZhbGlkYXRvcjtcclxuXHJcbiAgY29uc3RydWN0b3IgKCkge1xyXG4gICAgdGhpcy5fc3Vic2NyaXB0aW9uQ29udHJvbGxlciA9IG5ldyBTdWJzY3JpcHRpb25Db250cm9sbGVyKCk7XHJcbiAgICB0aGlzLmF1dGhJbnRlcmNlcHRvciA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcclxuICAgIHRoaXMucmVwb3J0UmVxdWVzdFZhbGlkYXRvciA9IG5ldyBSZXBvcnRSZXF1ZXN0VmFsaWRhdG9yKCk7XHJcbiAgfVxyXG4gIGdldCByb3V0ZXMgKCkgOiBleHByZXNzLlJvdXRlciB7XHJcblxyXG4gICAgdmFyIGNvbnRyb2xsZXIgPSB0aGlzLl9zdWJzY3JpcHRpb25Db250cm9sbGVyO1xyXG5cclxuICAgIC8vQWRkIFN1YnNjcmlwdGlvbiBQYWNrYWdlXHJcbiAgICByb3V0ZXIucG9zdCgnLycsICBjb250cm9sbGVyLmFkZFN1YnNjcmlwdGlvblBhY2thZ2UsIHRoaXMuX3Jlc3BvbnNlSW50ZXJjZXB0b3IuZXhpdCk7XHJcblxyXG4gICAgcm91dGVyLnBvc3QoJy9wYXlVTW9uZXknLCAgY29udHJvbGxlci5nZW5lcmF0ZVBheVVNb25leVRyYW5zYWNjdGlvbiwgdGhpcy5fcmVzcG9uc2VJbnRlcmNlcHRvci5leGl0KTtcclxuXHJcbiAgICByb3V0ZXIucG9zdCgnL3BheW1lbnQvc3VjY2VzcycsICBjb250cm9sbGVyLnN1Y2Nlc3NQYXltZW50LCB0aGlzLl9yZXNwb25zZUludGVyY2VwdG9yLmV4aXQpO1xyXG5cclxuICAgIHJvdXRlci5wb3N0KCcvcGF5bWVudC9mYWlsdXJlJywgIGNvbnRyb2xsZXIuZmFpbHVyZVBheW1lbnQsIHRoaXMuX3Jlc3BvbnNlSW50ZXJjZXB0b3IuZXhpdCk7XHJcblxyXG4gICAgcm91dGVyLmdldCgnL2Jhc2VwYWNrYWdlc2xpc3QnLCB0aGlzLmF1dGhJbnRlcmNlcHRvci5yZXF1aXJlc0F1dGgsIHRoaXMuX3JlcXVlc3RJbnRlcmNlcHRvci5pbnRlcmNlcHQsXHJcbiAgICAgIGNvbnRyb2xsZXIuZ2V0QmFzZVN1YnNjcmlwdGlvblBhY2thZ2VMaXN0LCB0aGlzLl9yZXNwb25zZUludGVyY2VwdG9yLmV4aXQpO1xyXG5cclxuICAgIHJvdXRlci5wb3N0KCcvYnkvbmFtZScsIHRoaXMuYXV0aEludGVyY2VwdG9yLnJlcXVpcmVzQXV0aCwgdGhpcy5fcmVxdWVzdEludGVyY2VwdG9yLmludGVyY2VwdCxcclxuICAgICAgdGhpcy5yZXBvcnRSZXF1ZXN0VmFsaWRhdG9yLmdldFN1YnNjcmlwdGlvblBhY2thZ2VCeU5hbWUsIGNvbnRyb2xsZXIuZ2V0U3Vic2NyaXB0aW9uUGFja2FnZUJ5TmFtZSwgdGhpcy5fcmVzcG9uc2VJbnRlcmNlcHRvci5leGl0KTtcclxuXHJcbiAgICAvLyBSYXRlIEFwcCB0ZXN0IEFQSVxyXG4gICAgcm91dGVyLnBvc3QoJy9wYXkvc3VjY2VzcycsICBjb250cm9sbGVyLnN1Y2Nlc3NQYXl1TW9uZXksIHRoaXMuX3Jlc3BvbnNlSW50ZXJjZXB0b3IuZXhpdCk7XHJcblxyXG4gICAgcmV0dXJuIHJvdXRlcjtcclxuICB9XHJcbn1cclxuXHJcbk9iamVjdC5zZWFsKFN1YnNjcmlwdGlvblJvdXRlcyk7XHJcbmV4cG9ydCA9IFN1YnNjcmlwdGlvblJvdXRlcztcclxuIl19
