"use strict";
var express = require("express");
var UserRoutes = require("./../UserRoutes");
var sharedService = require("../../shared/logger/shared.service");
var ProjectRoutes = require("./../../../applicationProject/routes/ProjectRoutes");
var ReportRoutes = require("./../../../applicationProject/routes/ReportRoutes");
var RateAnalysisRoutes = require("./../../../applicationProject/routes/RateAnalysisRoutes");
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
            app.use(sharedService.errorHandler);
            return app;
        },
        enumerable: true,
        configurable: true
    });
    return BaseRoutes;
}());
module.exports = BaseRoutes;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvcm91dGVzL2Jhc2UvQmFzZVJvdXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsaUNBQW9DO0FBQ3BDLDRDQUErQztBQUMvQyxrRUFBcUU7QUFDckUsa0ZBQXFGO0FBQ3JGLGdGQUFtRjtBQUNuRiw0RkFBK0Y7QUFFL0YsSUFBSSxHQUFHLEdBQUcsT0FBTyxFQUFFLENBQUM7QUFFcEI7SUFBQTtJQVVBLENBQUM7SUFSQyxzQkFBSSw4QkFBTTthQUFWO1lBQ0UsR0FBRyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsSUFBSSxVQUFVLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUMvQyxHQUFHLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxJQUFJLGFBQWEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3JELEdBQUcsQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLElBQUksWUFBWSxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDbkQsR0FBRyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxJQUFJLGtCQUFrQixFQUFFLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDL0QsR0FBRyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDcEMsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNiLENBQUM7OztPQUFBO0lBQ0gsaUJBQUM7QUFBRCxDQVZBLEFBVUMsSUFBQTtBQUNELGlCQUFTLFVBQVUsQ0FBQyIsImZpbGUiOiJhcHAvZnJhbWV3b3JrL3JvdXRlcy9iYXNlL0Jhc2VSb3V0ZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZXhwcmVzcyA9IHJlcXVpcmUoJ2V4cHJlc3MnKTtcclxuaW1wb3J0IFVzZXJSb3V0ZXMgPSByZXF1aXJlKCcuLy4uL1VzZXJSb3V0ZXMnKTtcclxuaW1wb3J0IHNoYXJlZFNlcnZpY2UgPSByZXF1aXJlKCcuLi8uLi9zaGFyZWQvbG9nZ2VyL3NoYXJlZC5zZXJ2aWNlJyk7XHJcbmltcG9ydCBQcm9qZWN0Um91dGVzID0gcmVxdWlyZSgnLi8uLi8uLi8uLi9hcHBsaWNhdGlvblByb2plY3Qvcm91dGVzL1Byb2plY3RSb3V0ZXMnKTtcclxuaW1wb3J0IFJlcG9ydFJvdXRlcyA9IHJlcXVpcmUoJy4vLi4vLi4vLi4vYXBwbGljYXRpb25Qcm9qZWN0L3JvdXRlcy9SZXBvcnRSb3V0ZXMnKTtcclxuaW1wb3J0IFJhdGVBbmFseXNpc1JvdXRlcyA9IHJlcXVpcmUoJy4vLi4vLi4vLi4vYXBwbGljYXRpb25Qcm9qZWN0L3JvdXRlcy9SYXRlQW5hbHlzaXNSb3V0ZXMnKTtcclxuXHJcbnZhciBhcHAgPSBleHByZXNzKCk7XHJcblxyXG5jbGFzcyBCYXNlUm91dGVzIHtcclxuXHJcbiAgZ2V0IHJvdXRlcygpIHtcclxuICAgIGFwcC51c2UoJy9hcGkvdXNlci8nLCBuZXcgVXNlclJvdXRlcygpLnJvdXRlcyk7XHJcbiAgICBhcHAudXNlKCcvYXBpL3Byb2plY3QvJywgbmV3IFByb2plY3RSb3V0ZXMoKS5yb3V0ZXMpO1xyXG4gICAgYXBwLnVzZSgnL2FwaS9yZXBvcnQvJywgbmV3IFJlcG9ydFJvdXRlcygpLnJvdXRlcyk7XHJcbiAgICBhcHAudXNlKCcvYXBpL3JhdGVBbmFseXNpcy8nLCBuZXcgUmF0ZUFuYWx5c2lzUm91dGVzKCkucm91dGVzKTtcclxuICAgIGFwcC51c2Uoc2hhcmVkU2VydmljZS5lcnJvckhhbmRsZXIpO1xyXG4gICAgcmV0dXJuIGFwcDtcclxuICB9XHJcbn1cclxuZXhwb3J0ID0gQmFzZVJvdXRlcztcclxuIl19
