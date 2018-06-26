"use strict";
var LoggerService = require("../shared/logger/LoggerService");
var logger = require('../shared/logger/logger');
var LoggerInterceptor = (function () {
    function LoggerInterceptor() {
    }
    LoggerInterceptor.prototype.logDetail = function (req, res, next) {
        var _loggerService = new LoggerService('API ENTRY');
        var tempBody = Object.assign({}, req.body);
        if (tempBody && tempBody.password) {
            tempBody.password = 'XXX';
        }
        if (tempBody && tempBody.new_password) {
            tempBody.new_password = 'XXX';
        }
        if (tempBody && tempBody.confirm_password) {
            tempBody.confirm_password = 'XXX';
        }
        var loggerObject = {
            'method': req.originalMethod,
            'url': req.originalUrl,
            'body': tempBody,
            'params': req.params,
            'query': req.query,
            'inTime': new Date()
        };
        var responseObject = JSON.stringify(loggerObject);
        _loggerService.logInfo(responseObject);
        next();
    };
    return LoggerInterceptor;
}());
module.exports = LoggerInterceptor;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvaW50ZXJjZXB0b3IvTG9nZ2VySW50ZXJjZXB0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhEQUFpRTtBQUNqRSxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUVoRDtJQUVFO0lBRUEsQ0FBQztJQUNELHFDQUFTLEdBQVQsVUFBVSxHQUFRLEVBQUUsR0FBUSxFQUFFLElBQVM7UUFDckMsSUFBSSxjQUFjLEdBQWtCLElBQUksYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ25FLElBQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzQyxFQUFFLENBQUEsQ0FBQyxRQUFRLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDakMsUUFBUSxDQUFDLFFBQVEsR0FBQyxLQUFLLENBQUM7UUFDMUIsQ0FBQztRQUNELEVBQUUsQ0FBQSxDQUFDLFFBQVEsSUFBSSxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUNyQyxRQUFRLENBQUMsWUFBWSxHQUFDLEtBQUssQ0FBQztRQUM5QixDQUFDO1FBQ0QsRUFBRSxDQUFBLENBQUMsUUFBUSxJQUFJLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7WUFDekMsUUFBUSxDQUFDLGdCQUFnQixHQUFDLEtBQUssQ0FBQztRQUNsQyxDQUFDO1FBQ0QsSUFBSSxZQUFZLEdBQUc7WUFDakIsUUFBUSxFQUFFLEdBQUcsQ0FBQyxjQUFjO1lBQzVCLEtBQUssRUFBQyxHQUFHLENBQUMsV0FBVztZQUNyQixNQUFNLEVBQUMsUUFBUTtZQUNmLFFBQVEsRUFBQyxHQUFHLENBQUMsTUFBTTtZQUNuQixPQUFPLEVBQUMsR0FBRyxDQUFDLEtBQUs7WUFDakIsUUFBUSxFQUFDLElBQUksSUFBSSxFQUFFO1NBQ3BCLENBQUM7UUFDRixJQUFJLGNBQWMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ2xELGNBQWMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDdkMsSUFBSSxFQUFFLENBQUM7SUFDVCxDQUFDO0lBQ0gsd0JBQUM7QUFBRCxDQTdCQSxBQTZCQyxJQUFBO0FBQ0QsaUJBQVMsaUJBQWlCLENBQUMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9pbnRlcmNlcHRvci9Mb2dnZXJJbnRlcmNlcHRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBMb2dnZXJTZXJ2aWNlID0gcmVxdWlyZSgnLi4vc2hhcmVkL2xvZ2dlci9Mb2dnZXJTZXJ2aWNlJyk7XHJcbmxldCBsb2dnZXIgPSByZXF1aXJlKCcuLi9zaGFyZWQvbG9nZ2VyL2xvZ2dlcicpO1xyXG5cclxuY2xhc3MgTG9nZ2VySW50ZXJjZXB0b3Ige1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgfVxyXG4gIGxvZ0RldGFpbChyZXE6IGFueSwgcmVzOiBhbnksIG5leHQ6IGFueSkge1xyXG4gICAgbGV0IF9sb2dnZXJTZXJ2aWNlOiBMb2dnZXJTZXJ2aWNlID0gbmV3IExvZ2dlclNlcnZpY2UoJ0FQSSBFTlRSWScpOyAvL1RPRE8gcmVtb3ZlIHBhc3N3b3JkIGZyb20gcGFybVxyXG4gICAgbGV0IHRlbXBCb2R5ID0gT2JqZWN0LmFzc2lnbih7fSwgcmVxLmJvZHkpO1xyXG4gICAgaWYodGVtcEJvZHkgJiYgdGVtcEJvZHkucGFzc3dvcmQpIHtcclxuICAgICAgdGVtcEJvZHkucGFzc3dvcmQ9J1hYWCc7XHJcbiAgICB9XHJcbiAgICBpZih0ZW1wQm9keSAmJiB0ZW1wQm9keS5uZXdfcGFzc3dvcmQpIHtcclxuICAgICAgdGVtcEJvZHkubmV3X3Bhc3N3b3JkPSdYWFgnO1xyXG4gICAgfVxyXG4gICAgaWYodGVtcEJvZHkgJiYgdGVtcEJvZHkuY29uZmlybV9wYXNzd29yZCkge1xyXG4gICAgICB0ZW1wQm9keS5jb25maXJtX3Bhc3N3b3JkPSdYWFgnO1xyXG4gICAgfVxyXG4gICAgbGV0IGxvZ2dlck9iamVjdCA9IHtcclxuICAgICAgJ21ldGhvZCc6IHJlcS5vcmlnaW5hbE1ldGhvZCxcclxuICAgICAgJ3VybCc6cmVxLm9yaWdpbmFsVXJsLFxyXG4gICAgICAnYm9keSc6dGVtcEJvZHksXHJcbiAgICAgICdwYXJhbXMnOnJlcS5wYXJhbXMsXHJcbiAgICAgICdxdWVyeSc6cmVxLnF1ZXJ5LFxyXG4gICAgICAnaW5UaW1lJzpuZXcgRGF0ZSgpXHJcbiAgICB9O1xyXG4gICAgbGV0IHJlc3BvbnNlT2JqZWN0ID0gSlNPTi5zdHJpbmdpZnkobG9nZ2VyT2JqZWN0KTtcclxuICAgIF9sb2dnZXJTZXJ2aWNlLmxvZ0luZm8ocmVzcG9uc2VPYmplY3QpO1xyXG4gICAgbmV4dCgpO1xyXG4gIH1cclxufVxyXG5leHBvcnQgPSBMb2dnZXJJbnRlcmNlcHRvcjtcclxuIl19
