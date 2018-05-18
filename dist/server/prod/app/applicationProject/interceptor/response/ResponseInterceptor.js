"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var CostControllException = require("../../exception/CostControllException");
var typescript_ioc_1 = require("typescript-ioc");
var log4js = require("log4js");
var logger = log4js.getLogger('ResponseInterceptor');
var ResponseInterceptor = (function () {
    function ResponseInterceptor() {
    }
    ResponseInterceptor.prototype.exit = function (response, req, res, next) {
        if (response instanceof CostControllException) {
            var error = response.errorDetails();
            var data = {
                message: error.message,
                cause: error.cause
            };
            logger.error('Response to URL => ' + req.baseUrl);
            logger.error('Data => ' + JSON.stringify(data));
            if (!error.status) {
                res.status(500).send(data);
            }
            else {
                res.status(error.status).send(data);
            }
        }
        else if (response instanceof Error) {
            var data = {
                message: response.message,
                cause: response.stack
            };
            logger.error('Response to URL => ' + req.baseUrl);
            logger.error('Data => ' + JSON.stringify(data));
            res.status(500).send(data);
        }
        else {
            logger.info('Response to URL => ' + req.baseUrl);
            logger.info('Data => ' + JSON.stringify(response.data));
            res.status(response.status).send(response.data);
        }
    };
    ResponseInterceptor = __decorate([
        typescript_ioc_1.Singleton
    ], ResponseInterceptor);
    return ResponseInterceptor;
}());
module.exports = ResponseInterceptor;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHBsaWNhdGlvblByb2plY3QvaW50ZXJjZXB0b3IvcmVzcG9uc2UvUmVzcG9uc2VJbnRlcmNlcHRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUEsNkVBQWdGO0FBQ2hGLGlEQUEyQztBQUMzQywrQkFBa0M7QUFFbEMsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBR3JEO0lBQUE7SUE2QkEsQ0FBQztJQTVCQyxrQ0FBSSxHQUFKLFVBQUssUUFBYSxFQUFFLEdBQW9CLEVBQUUsR0FBcUIsRUFBRSxJQUFTO1FBQ3hFLEVBQUUsQ0FBQSxDQUFDLFFBQVEsWUFBWSxxQkFBcUIsQ0FBQyxDQUFDLENBQUM7WUFDN0MsSUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3BDLElBQUksSUFBSSxHQUFHO2dCQUNULE9BQU8sRUFBRyxLQUFLLENBQUMsT0FBTztnQkFDdkIsS0FBSyxFQUFHLEtBQUssQ0FBQyxLQUFLO2FBQ3BCLENBQUM7WUFDRixNQUFNLENBQUMsS0FBSyxDQUFDLHFCQUFxQixHQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNqRCxNQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDL0MsRUFBRSxDQUFBLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDakIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDN0IsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN0QyxDQUFDO1FBQ0gsQ0FBQztRQUFBLElBQUksQ0FBQyxFQUFFLENBQUEsQ0FBRSxRQUFRLFlBQVksS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNwQyxJQUFJLElBQUksR0FBRztnQkFDVCxPQUFPLEVBQUcsUUFBUSxDQUFDLE9BQU87Z0JBQzFCLEtBQUssRUFBRyxRQUFRLENBQUMsS0FBSzthQUN2QixDQUFDO1lBQ0YsTUFBTSxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsR0FBRSxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDakQsTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQy9DLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdCLENBQUM7UUFBQSxJQUFJLENBQUMsQ0FBQztZQUNMLE1BQU0sQ0FBQyxJQUFJLENBQUMscUJBQXFCLEdBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ2hELE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDdkQsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsRCxDQUFDO0lBQ0gsQ0FBQztJQTVCRyxtQkFBbUI7UUFEeEIsMEJBQVM7T0FDSixtQkFBbUIsQ0E2QnhCO0lBQUQsMEJBQUM7Q0E3QkQsQUE2QkMsSUFBQTtBQUNELGlCQUFTLG1CQUFtQixDQUFDIiwiZmlsZSI6ImFwcC9hcHBsaWNhdGlvblByb2plY3QvaW50ZXJjZXB0b3IvcmVzcG9uc2UvUmVzcG9uc2VJbnRlcmNlcHRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDb3N0Q29udHJvbGxFeGNlcHRpb24gPSByZXF1aXJlKCcuLi8uLi9leGNlcHRpb24vQ29zdENvbnRyb2xsRXhjZXB0aW9uJyk7XHJcbmltcG9ydCB7IFNpbmdsZXRvbiB9IGZyb20gJ3R5cGVzY3JpcHQtaW9jJztcclxuaW1wb3J0IGxvZzRqcyA9IHJlcXVpcmUoJ2xvZzRqcycpO1xyXG5pbXBvcnQgKiBhcyBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xyXG5sZXQgbG9nZ2VyID0gbG9nNGpzLmdldExvZ2dlcignUmVzcG9uc2VJbnRlcmNlcHRvcicpO1xyXG5cclxuQFNpbmdsZXRvblxyXG5jbGFzcyBSZXNwb25zZUludGVyY2VwdG9yIHtcclxuICBleGl0KHJlc3BvbnNlOiBhbnksIHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gICAgaWYocmVzcG9uc2UgaW5zdGFuY2VvZiBDb3N0Q29udHJvbGxFeGNlcHRpb24pIHtcclxuICAgICAgbGV0IGVycm9yID0gcmVzcG9uc2UuZXJyb3JEZXRhaWxzKCk7XHJcbiAgICAgIGxldCBkYXRhID0ge1xyXG4gICAgICAgIG1lc3NhZ2UgOiBlcnJvci5tZXNzYWdlLFxyXG4gICAgICAgIGNhdXNlIDogZXJyb3IuY2F1c2VcclxuICAgICAgfTtcclxuICAgICAgbG9nZ2VyLmVycm9yKCdSZXNwb25zZSB0byBVUkwgPT4gJysgcmVxLmJhc2VVcmwpO1xyXG4gICAgICBsb2dnZXIuZXJyb3IoJ0RhdGEgPT4gJysgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG4gICAgICBpZighZXJyb3Iuc3RhdHVzKSB7XHJcbiAgICAgICAgcmVzLnN0YXR1cyg1MDApLnNlbmQoZGF0YSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmVzLnN0YXR1cyhlcnJvci5zdGF0dXMpLnNlbmQoZGF0YSk7XHJcbiAgICAgIH1cclxuICAgIH1lbHNlIGlmKCByZXNwb25zZSBpbnN0YW5jZW9mIEVycm9yKSB7XHJcbiAgICAgIGxldCBkYXRhID0ge1xyXG4gICAgICAgIG1lc3NhZ2UgOiByZXNwb25zZS5tZXNzYWdlLFxyXG4gICAgICAgIGNhdXNlIDogcmVzcG9uc2Uuc3RhY2tcclxuICAgICAgfTtcclxuICAgICAgbG9nZ2VyLmVycm9yKCdSZXNwb25zZSB0byBVUkwgPT4gJysgcmVxLmJhc2VVcmwpO1xyXG4gICAgICBsb2dnZXIuZXJyb3IoJ0RhdGEgPT4gJysgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG4gICAgICByZXMuc3RhdHVzKDUwMCkuc2VuZChkYXRhKTtcclxuICAgIH1lbHNlIHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Jlc3BvbnNlIHRvIFVSTCA9PiAnKyByZXEuYmFzZVVybCk7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdEYXRhID0+ICcrIEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlLmRhdGEpKTtcclxuICAgICAgcmVzLnN0YXR1cyhyZXNwb25zZS5zdGF0dXMpLnNlbmQocmVzcG9uc2UuZGF0YSk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbmV4cG9ydCA9IFJlc3BvbnNlSW50ZXJjZXB0b3I7XHJcbiJdfQ==
