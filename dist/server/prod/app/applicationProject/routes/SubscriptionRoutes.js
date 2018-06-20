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
            router.get('/basepackageslist', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept, controller.getBaseSubscriptionPackageList, this._responseInterceptor.exit);
            router.post('/by/name', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept, this.reportRequestValidator.getSubscriptionPackageByName, controller.getSubscriptionPackageByName, this._responseInterceptor.exit);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHBsaWNhdGlvblByb2plY3Qvcm91dGVzL1N1YnNjcmlwdGlvblJvdXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsaUNBQW9DO0FBQ3BDLGdGQUFtRjtBQUNuRixnRkFBbUY7QUFFbkYsaURBQXdDO0FBQ3hDLDhFQUFpRjtBQUNqRixpRkFBb0Y7QUFDcEYsa0dBQXFHO0FBRXJHLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUU5QjtJQVdFO1FBQ0UsSUFBSSxDQUFDLHVCQUF1QixHQUFHLElBQUksc0JBQXNCLEVBQUUsQ0FBQztRQUM1RCxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksZUFBZSxFQUFFLENBQUM7UUFDN0MsSUFBSSxDQUFDLHNCQUFzQixHQUFHLElBQUksc0JBQXNCLEVBQUUsQ0FBQztJQUM3RCxDQUFDO0lBQ0Qsc0JBQUksc0NBQU07YUFBVjtZQUVFLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQztZQUc5QyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRyxVQUFVLENBQUMsc0JBQXNCLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBRXJGLE1BQU0sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsRUFDbkcsVUFBVSxDQUFDLDhCQUE4QixFQUFFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUU3RSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsU0FBUyxFQUMzRixJQUFJLENBQUMsc0JBQXNCLENBQUMsNEJBQTRCLEVBQUUsVUFBVSxDQUFDLDRCQUE0QixFQUFFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVySSxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2hCLENBQUM7OztPQUFBO0lBekJEO1FBREMsdUJBQU07a0NBQ3NCLGtCQUFrQjttRUFBQztJQUVoRDtRQURDLHVCQUFNO2tDQUN1QixtQkFBbUI7b0VBQUM7SUFFbEQ7UUFEQyx1QkFBTTtrQ0FDeUIsc0JBQXNCO3NFQUFDO0lBc0J6RCx5QkFBQztDQS9CRCxBQStCQyxJQUFBO0FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQ2hDLGlCQUFTLGtCQUFrQixDQUFDIiwiZmlsZSI6ImFwcC9hcHBsaWNhdGlvblByb2plY3Qvcm91dGVzL1N1YnNjcmlwdGlvblJvdXRlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBleHByZXNzID0gcmVxdWlyZSgnZXhwcmVzcycpO1xyXG5pbXBvcnQgU3Vic2NyaXB0aW9uQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vLi4vY29udHJvbGxlcnMvU3Vic2NyaXB0aW9uQ29udHJvbGxlcicpO1xyXG5pbXBvcnQgQXV0aEludGVyY2VwdG9yID0gcmVxdWlyZSgnLi8uLi8uLi9mcmFtZXdvcmsvaW50ZXJjZXB0b3IvYXV0aC5pbnRlcmNlcHRvcicpO1xyXG5pbXBvcnQgTG9nZ2VySW50ZXJjZXB0b3IgPSByZXF1aXJlKCcuLy4uLy4uL2ZyYW1ld29yay9pbnRlcmNlcHRvci9Mb2dnZXJJbnRlcmNlcHRvcicpO1xyXG5pbXBvcnQgeyBJbmplY3QgfSBmcm9tICd0eXBlc2NyaXB0LWlvYyc7XHJcbmltcG9ydCBSZXF1ZXN0SW50ZXJjZXB0b3IgPSByZXF1aXJlKCcuLi9pbnRlcmNlcHRvci9yZXF1ZXN0L1JlcXVlc3RJbnRlcmNlcHRvcicpO1xyXG5pbXBvcnQgUmVzcG9uc2VJbnRlcmNlcHRvciA9IHJlcXVpcmUoJy4uL2ludGVyY2VwdG9yL3Jlc3BvbnNlL1Jlc3BvbnNlSW50ZXJjZXB0b3InKTtcclxuaW1wb3J0IFJlcG9ydFJlcXVlc3RWYWxpZGF0b3IgPSByZXF1aXJlKCcuLi9pbnRlcmNlcHRvci9yZXF1ZXN0L3ZhbGlkYXRpb24vU3Vic2NyaXB0aW9uSW50ZXJjZXB0b3InKTtcclxuXHJcbnZhciByb3V0ZXIgPSBleHByZXNzLlJvdXRlcigpO1xyXG5cclxuY2xhc3MgU3Vic2NyaXB0aW9uUm91dGVzIHtcclxuICBwcml2YXRlIF9zdWJzY3JpcHRpb25Db250cm9sbGVyOiBTdWJzY3JpcHRpb25Db250cm9sbGVyO1xyXG4gIHByaXZhdGUgYXV0aEludGVyY2VwdG9yOiBBdXRoSW50ZXJjZXB0b3I7XHJcbiAgcHJpdmF0ZSBsb2dnZXJJbnRlcmNlcHRvcjogTG9nZ2VySW50ZXJjZXB0b3I7XHJcbiAgQEluamVjdFxyXG4gIHByaXZhdGUgX3JlcXVlc3RJbnRlcmNlcHRvcjogUmVxdWVzdEludGVyY2VwdG9yO1xyXG4gIEBJbmplY3RcclxuICBwcml2YXRlIF9yZXNwb25zZUludGVyY2VwdG9yOiBSZXNwb25zZUludGVyY2VwdG9yO1xyXG4gIEBJbmplY3RcclxuICBwcml2YXRlIHJlcG9ydFJlcXVlc3RWYWxpZGF0b3I6IFJlcG9ydFJlcXVlc3RWYWxpZGF0b3I7XHJcblxyXG4gIGNvbnN0cnVjdG9yICgpIHtcclxuICAgIHRoaXMuX3N1YnNjcmlwdGlvbkNvbnRyb2xsZXIgPSBuZXcgU3Vic2NyaXB0aW9uQ29udHJvbGxlcigpO1xyXG4gICAgdGhpcy5hdXRoSW50ZXJjZXB0b3IgPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XHJcbiAgICB0aGlzLnJlcG9ydFJlcXVlc3RWYWxpZGF0b3IgPSBuZXcgUmVwb3J0UmVxdWVzdFZhbGlkYXRvcigpO1xyXG4gIH1cclxuICBnZXQgcm91dGVzICgpIDogZXhwcmVzcy5Sb3V0ZXIge1xyXG5cclxuICAgIHZhciBjb250cm9sbGVyID0gdGhpcy5fc3Vic2NyaXB0aW9uQ29udHJvbGxlcjtcclxuXHJcbiAgICAvL0FkZCBTdWJzY3JpcHRpb24gUGFja2FnZVxyXG4gICAgcm91dGVyLnBvc3QoJy8nLCAgY29udHJvbGxlci5hZGRTdWJzY3JpcHRpb25QYWNrYWdlLCB0aGlzLl9yZXNwb25zZUludGVyY2VwdG9yLmV4aXQpO1xyXG5cclxuICAgIHJvdXRlci5nZXQoJy9iYXNlcGFja2FnZXNsaXN0JywgdGhpcy5hdXRoSW50ZXJjZXB0b3IucmVxdWlyZXNBdXRoLCB0aGlzLl9yZXF1ZXN0SW50ZXJjZXB0b3IuaW50ZXJjZXB0LFxyXG4gICAgICBjb250cm9sbGVyLmdldEJhc2VTdWJzY3JpcHRpb25QYWNrYWdlTGlzdCwgdGhpcy5fcmVzcG9uc2VJbnRlcmNlcHRvci5leGl0KTtcclxuXHJcbiAgICByb3V0ZXIucG9zdCgnL2J5L25hbWUnLCB0aGlzLmF1dGhJbnRlcmNlcHRvci5yZXF1aXJlc0F1dGgsIHRoaXMuX3JlcXVlc3RJbnRlcmNlcHRvci5pbnRlcmNlcHQsXHJcbiAgICAgIHRoaXMucmVwb3J0UmVxdWVzdFZhbGlkYXRvci5nZXRTdWJzY3JpcHRpb25QYWNrYWdlQnlOYW1lLCBjb250cm9sbGVyLmdldFN1YnNjcmlwdGlvblBhY2thZ2VCeU5hbWUsIHRoaXMuX3Jlc3BvbnNlSW50ZXJjZXB0b3IuZXhpdCk7XHJcblxyXG4gICAgcmV0dXJuIHJvdXRlcjtcclxuICB9XHJcbn1cclxuXHJcbk9iamVjdC5zZWFsKFN1YnNjcmlwdGlvblJvdXRlcyk7XHJcbmV4cG9ydCA9IFN1YnNjcmlwdGlvblJvdXRlcztcclxuIl19
