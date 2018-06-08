"use strict";
var express = require("express");
var UserRoutes = require("./../UserRoutes");
var sharedService = require("../../shared/logger/shared.service");
var ProjectRoutes = require("./../../../applicationProject/routes/ProjectRoutes");
var ReportRoutes = require("./../../../applicationProject/routes/ReportRoutes");
var RateAnalysisRoutes = require("./../../../applicationProject/routes/RateAnalysisRoutes");
var SubscriptionRout = require("../../../applicationProject/routes/SubscriptionRout");
var app = express();
var BaseRoutes = (function () {
    function BaseRoutes() {
    }
    Object.defineProperty(BaseRoutes.prototype, "routes", {
        get: function () {
            app.use('/api/user/', new UserRoutes().routes);
            app.use('/api/project/', new ProjectRoutes().routes);
            app.use('/api/report/', new ReportRoutes().routes);
            app.use('/api/rateAnalysis/', new RateAnalysisRoutes().routes);
            app.use('/api/subscription/', new SubscriptionRout().routes);
            app.use(sharedService.errorHandler);
            return app;
        },
        enumerable: true,
        configurable: true
    });
    return BaseRoutes;
}());
module.exports = BaseRoutes;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvcm91dGVzL2Jhc2UvQmFzZVJvdXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsaUNBQW9DO0FBQ3BDLDRDQUErQztBQUMvQyxrRUFBcUU7QUFDckUsa0ZBQXFGO0FBQ3JGLGdGQUFtRjtBQUNuRiw0RkFBK0Y7QUFDL0Ysc0ZBQXlGO0FBRXpGLElBQUksR0FBRyxHQUFHLE9BQU8sRUFBRSxDQUFDO0FBRXBCO0lBQUE7SUFXQSxDQUFDO0lBVEMsc0JBQUksOEJBQU07YUFBVjtZQUNFLEdBQUcsQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLElBQUksVUFBVSxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDL0MsR0FBRyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsSUFBSSxhQUFhLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNyRCxHQUFHLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxJQUFJLFlBQVksRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ25ELEdBQUcsQ0FBQyxHQUFHLENBQUMsb0JBQW9CLEVBQUUsSUFBSSxrQkFBa0IsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQy9ELEdBQUcsQ0FBQyxHQUFHLENBQUMsb0JBQW9CLEVBQUUsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzdELEdBQUcsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ3BDLE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDYixDQUFDOzs7T0FBQTtJQUNILGlCQUFDO0FBQUQsQ0FYQSxBQVdDLElBQUE7QUFDRCxpQkFBUyxVQUFVLENBQUMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9yb3V0ZXMvYmFzZS9CYXNlUm91dGVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGV4cHJlc3MgPSByZXF1aXJlKCdleHByZXNzJyk7XHJcbmltcG9ydCBVc2VyUm91dGVzID0gcmVxdWlyZSgnLi8uLi9Vc2VyUm91dGVzJyk7XHJcbmltcG9ydCBzaGFyZWRTZXJ2aWNlID0gcmVxdWlyZSgnLi4vLi4vc2hhcmVkL2xvZ2dlci9zaGFyZWQuc2VydmljZScpO1xyXG5pbXBvcnQgUHJvamVjdFJvdXRlcyA9IHJlcXVpcmUoJy4vLi4vLi4vLi4vYXBwbGljYXRpb25Qcm9qZWN0L3JvdXRlcy9Qcm9qZWN0Um91dGVzJyk7XHJcbmltcG9ydCBSZXBvcnRSb3V0ZXMgPSByZXF1aXJlKCcuLy4uLy4uLy4uL2FwcGxpY2F0aW9uUHJvamVjdC9yb3V0ZXMvUmVwb3J0Um91dGVzJyk7XHJcbmltcG9ydCBSYXRlQW5hbHlzaXNSb3V0ZXMgPSByZXF1aXJlKCcuLy4uLy4uLy4uL2FwcGxpY2F0aW9uUHJvamVjdC9yb3V0ZXMvUmF0ZUFuYWx5c2lzUm91dGVzJyk7XHJcbmltcG9ydCBTdWJzY3JpcHRpb25Sb3V0ID0gcmVxdWlyZShcIi4uLy4uLy4uL2FwcGxpY2F0aW9uUHJvamVjdC9yb3V0ZXMvU3Vic2NyaXB0aW9uUm91dFwiKTtcclxuXHJcbnZhciBhcHAgPSBleHByZXNzKCk7XHJcblxyXG5jbGFzcyBCYXNlUm91dGVzIHtcclxuXHJcbiAgZ2V0IHJvdXRlcygpIHtcclxuICAgIGFwcC51c2UoJy9hcGkvdXNlci8nLCBuZXcgVXNlclJvdXRlcygpLnJvdXRlcyk7XHJcbiAgICBhcHAudXNlKCcvYXBpL3Byb2plY3QvJywgbmV3IFByb2plY3RSb3V0ZXMoKS5yb3V0ZXMpO1xyXG4gICAgYXBwLnVzZSgnL2FwaS9yZXBvcnQvJywgbmV3IFJlcG9ydFJvdXRlcygpLnJvdXRlcyk7XHJcbiAgICBhcHAudXNlKCcvYXBpL3JhdGVBbmFseXNpcy8nLCBuZXcgUmF0ZUFuYWx5c2lzUm91dGVzKCkucm91dGVzKTtcclxuICAgIGFwcC51c2UoJy9hcGkvc3Vic2NyaXB0aW9uLycsIG5ldyBTdWJzY3JpcHRpb25Sb3V0KCkucm91dGVzKTtcclxuICAgIGFwcC51c2Uoc2hhcmVkU2VydmljZS5lcnJvckhhbmRsZXIpO1xyXG4gICAgcmV0dXJuIGFwcDtcclxuICB9XHJcbn1cclxuZXhwb3J0ID0gQmFzZVJvdXRlcztcclxuIl19
