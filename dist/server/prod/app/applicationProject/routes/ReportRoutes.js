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
var ReportController = require("./../controllers/ReportController");
var AuthInterceptor = require("./../../framework/interceptor/auth.interceptor");
var typescript_ioc_1 = require("typescript-ioc");
var RequestInterceptor = require("../interceptor/request/RequestInterceptor");
var ResponseInterceptor = require("../interceptor/response/ResponseInterceptor");
var router = express.Router();
var ReportRoutes = (function () {
    function ReportRoutes() {
        this._reportController = new ReportController();
        this.authInterceptor = new AuthInterceptor();
    }
    Object.defineProperty(ReportRoutes.prototype, "routes", {
        get: function () {
            var controller = this._reportController;
            router.get('/:reportType/project/:projectId/rate/:costingUnit/area/:costingArea', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept, controller.getProject, this._responseInterceptor.exit);
            router.get('/costHeads', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept, controller.getRateAnalysisCostHeads, this._responseInterceptor.exit);
            router.get('/workItems', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept, controller.getRateAnalysisWorkItems, this._responseInterceptor.exit);
            return router;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        typescript_ioc_1.Inject,
        __metadata("design:type", RequestInterceptor)
    ], ReportRoutes.prototype, "_requestInterceptor", void 0);
    __decorate([
        typescript_ioc_1.Inject,
        __metadata("design:type", ResponseInterceptor)
    ], ReportRoutes.prototype, "_responseInterceptor", void 0);
    return ReportRoutes;
}());
Object.seal(ReportRoutes);
module.exports = ReportRoutes;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHBsaWNhdGlvblByb2plY3Qvcm91dGVzL1JlcG9ydFJvdXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsaUNBQW9DO0FBQ3BDLG9FQUF1RTtBQUN2RSxnRkFBbUY7QUFFbkYsaURBQXdDO0FBQ3hDLDhFQUFpRjtBQUNqRixpRkFBb0Y7QUFFcEYsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBRTlCO0lBU0U7UUFDRSxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO1FBQ2hELElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxlQUFlLEVBQUUsQ0FBQztJQUMvQyxDQUFDO0lBQ0Qsc0JBQUksZ0NBQU07YUFBVjtZQUVFLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztZQUd4QyxNQUFNLENBQUMsR0FBRyxDQUFDLHFFQUFxRSxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLEVBQ3JKLFVBQVUsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBR3pELE1BQU0sQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLEVBQzVGLFVBQVUsQ0FBQyx3QkFBd0IsRUFBRSxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUM7WUFHdkUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsRUFDNUYsVUFBVSxDQUFDLHdCQUF3QixFQUFFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN2RSxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2hCLENBQUM7OztPQUFBO0lBeEJEO1FBREMsdUJBQU07a0NBQ3NCLGtCQUFrQjs2REFBQztJQUVoRDtRQURDLHVCQUFNO2tDQUN1QixtQkFBbUI7OERBQUM7SUF1QnBELG1CQUFDO0NBOUJELEFBOEJDLElBQUE7QUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQzFCLGlCQUFTLFlBQVksQ0FBQyIsImZpbGUiOiJhcHAvYXBwbGljYXRpb25Qcm9qZWN0L3JvdXRlcy9SZXBvcnRSb3V0ZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZXhwcmVzcyA9IHJlcXVpcmUoJ2V4cHJlc3MnKTtcclxuaW1wb3J0IFJlcG9ydENvbnRyb2xsZXIgPSByZXF1aXJlKCcuLy4uL2NvbnRyb2xsZXJzL1JlcG9ydENvbnRyb2xsZXInKTtcclxuaW1wb3J0IEF1dGhJbnRlcmNlcHRvciA9IHJlcXVpcmUoJy4vLi4vLi4vZnJhbWV3b3JrL2ludGVyY2VwdG9yL2F1dGguaW50ZXJjZXB0b3InKTtcclxuaW1wb3J0IExvZ2dlckludGVyY2VwdG9yID0gcmVxdWlyZSgnLi8uLi8uLi9mcmFtZXdvcmsvaW50ZXJjZXB0b3IvTG9nZ2VySW50ZXJjZXB0b3InKTtcclxuaW1wb3J0IHsgSW5qZWN0IH0gZnJvbSAndHlwZXNjcmlwdC1pb2MnO1xyXG5pbXBvcnQgUmVxdWVzdEludGVyY2VwdG9yID0gcmVxdWlyZSgnLi4vaW50ZXJjZXB0b3IvcmVxdWVzdC9SZXF1ZXN0SW50ZXJjZXB0b3InKTtcclxuaW1wb3J0IFJlc3BvbnNlSW50ZXJjZXB0b3IgPSByZXF1aXJlKCcuLi9pbnRlcmNlcHRvci9yZXNwb25zZS9SZXNwb25zZUludGVyY2VwdG9yJyk7XHJcblxyXG52YXIgcm91dGVyID0gZXhwcmVzcy5Sb3V0ZXIoKTtcclxuXHJcbmNsYXNzIFJlcG9ydFJvdXRlcyB7XHJcbiAgcHJpdmF0ZSBfcmVwb3J0Q29udHJvbGxlcjogUmVwb3J0Q29udHJvbGxlcjtcclxuICBwcml2YXRlIGF1dGhJbnRlcmNlcHRvcjogQXV0aEludGVyY2VwdG9yO1xyXG4gIHByaXZhdGUgbG9nZ2VySW50ZXJjZXB0b3I6IExvZ2dlckludGVyY2VwdG9yO1xyXG4gIEBJbmplY3RcclxuICBwcml2YXRlIF9yZXF1ZXN0SW50ZXJjZXB0b3I6IFJlcXVlc3RJbnRlcmNlcHRvcjtcclxuICBASW5qZWN0XHJcbiAgcHJpdmF0ZSBfcmVzcG9uc2VJbnRlcmNlcHRvcjogUmVzcG9uc2VJbnRlcmNlcHRvcjtcclxuXHJcbiAgY29uc3RydWN0b3IgKCkge1xyXG4gICAgdGhpcy5fcmVwb3J0Q29udHJvbGxlciA9IG5ldyBSZXBvcnRDb250cm9sbGVyKCk7XHJcbiAgICB0aGlzLmF1dGhJbnRlcmNlcHRvciA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcclxuICB9XHJcbiAgZ2V0IHJvdXRlcyAoKSA6IGV4cHJlc3MuUm91dGVyIHtcclxuXHJcbiAgICB2YXIgY29udHJvbGxlciA9IHRoaXMuX3JlcG9ydENvbnRyb2xsZXI7XHJcblxyXG4gICAgLy9Qcm92aWRlIGFsbCBidWlsZGluZ3MgaW4gYSBQcm9qZWN0IHdpdGggdGh1bWJydWxlIGFuZCBlc3RpbWF0ZSByZXBvcnQgd2l0aCBwYXJ0aWN1bGFyIGFyZWEgYW5kIHVuaXQuXHJcbiAgICByb3V0ZXIuZ2V0KCcvOnJlcG9ydFR5cGUvcHJvamVjdC86cHJvamVjdElkL3JhdGUvOmNvc3RpbmdVbml0L2FyZWEvOmNvc3RpbmdBcmVhJywgdGhpcy5hdXRoSW50ZXJjZXB0b3IucmVxdWlyZXNBdXRoLCB0aGlzLl9yZXF1ZXN0SW50ZXJjZXB0b3IuaW50ZXJjZXB0LFxyXG4gICAgICBjb250cm9sbGVyLmdldFByb2plY3QsIHRoaXMuX3Jlc3BvbnNlSW50ZXJjZXB0b3IuZXhpdCk7XHJcblxyXG4gICAgLy9Qcm92aWRlIGFsbCBjb3N0aGVhZHMgZnJvbSByYXRlIGFuYWx5c2lzXHJcbiAgICByb3V0ZXIuZ2V0KCcvY29zdEhlYWRzJywgdGhpcy5hdXRoSW50ZXJjZXB0b3IucmVxdWlyZXNBdXRoLCB0aGlzLl9yZXF1ZXN0SW50ZXJjZXB0b3IuaW50ZXJjZXB0LFxyXG4gICAgICBjb250cm9sbGVyLmdldFJhdGVBbmFseXNpc0Nvc3RIZWFkcywgdGhpcy5fcmVzcG9uc2VJbnRlcmNlcHRvci5leGl0KTtcclxuXHJcbiAgICAvL1Byb3ZpZGUgYWxsIHdvcmtpdGVtcyBmcm9tIHJhdGUgYW5hbHlzaXNcclxuICAgIHJvdXRlci5nZXQoJy93b3JrSXRlbXMnLCB0aGlzLmF1dGhJbnRlcmNlcHRvci5yZXF1aXJlc0F1dGgsIHRoaXMuX3JlcXVlc3RJbnRlcmNlcHRvci5pbnRlcmNlcHQsXHJcbiAgICAgIGNvbnRyb2xsZXIuZ2V0UmF0ZUFuYWx5c2lzV29ya0l0ZW1zLCB0aGlzLl9yZXNwb25zZUludGVyY2VwdG9yLmV4aXQpO1xyXG4gICAgcmV0dXJuIHJvdXRlcjtcclxuICB9XHJcbn1cclxuXHJcbk9iamVjdC5zZWFsKFJlcG9ydFJvdXRlcyk7XHJcbmV4cG9ydCA9IFJlcG9ydFJvdXRlcztcclxuIl19
