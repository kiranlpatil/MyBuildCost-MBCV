"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var winston = require("winston");
var logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: "clientErrorLogs",
            handleExceptions: true,
            json: true,
            maxsize: 5242880,
            maxFiles: 5,
            colorize: true
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
});
module.exports = logger;
module.exports.stream = {
    write: function (message, encoding) {
        logger.info(message);
    }
};

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2hhcmVkL2xvZ2dlci9sb2dnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpQ0FBbUM7QUFHbkMsSUFBSSxNQUFNLEdBQUcsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDO0lBQzlCLFVBQVUsRUFBRTtRQUNWLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7WUFDMUIsS0FBSyxFQUFFLE1BQU07WUFDYixRQUFRLEVBQUUsaUJBQWlCO1lBQzNCLGdCQUFnQixFQUFFLElBQUk7WUFDdEIsSUFBSSxFQUFFLElBQUk7WUFDVixPQUFPLEVBQUUsT0FBTztZQUNoQixRQUFRLEVBQUUsQ0FBQztZQUNYLFFBQVEsRUFBRSxJQUFJO1NBQ2YsQ0FBQztRQUNGLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7WUFDN0IsS0FBSyxFQUFFLE9BQU87WUFDZCxnQkFBZ0IsRUFBRSxJQUFJO1lBQ3RCLElBQUksRUFBRSxLQUFLO1lBQ1gsUUFBUSxFQUFFLElBQUk7U0FDZixDQUFDO0tBQ0g7SUFDRCxXQUFXLEVBQUUsS0FBSztDQUNuQixDQUFDLENBQUM7QUFFSCxNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztBQUN4QixNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRztJQUN0QixLQUFLLEVBQUUsVUFBVSxPQUFZLEVBQUUsUUFBYTtRQUMxQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3ZCLENBQUM7Q0FDRixDQUFDIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvc2hhcmVkL2xvZ2dlci9sb2dnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyB3aW5zdG9uIGZyb20gXCJ3aW5zdG9uXCI7XHJcblxyXG5cclxudmFyIGxvZ2dlciA9IG5ldyB3aW5zdG9uLkxvZ2dlcih7XHJcbiAgdHJhbnNwb3J0czogW1xyXG4gICAgbmV3IHdpbnN0b24udHJhbnNwb3J0cy5GaWxlKHtcclxuICAgICAgbGV2ZWw6ICdpbmZvJyxcclxuICAgICAgZmlsZW5hbWU6IFwiY2xpZW50RXJyb3JMb2dzXCIsXHJcbiAgICAgIGhhbmRsZUV4Y2VwdGlvbnM6IHRydWUsXHJcbiAgICAgIGpzb246IHRydWUsXHJcbiAgICAgIG1heHNpemU6IDUyNDI4ODAsIC8vNU1CXHJcbiAgICAgIG1heEZpbGVzOiA1LFxyXG4gICAgICBjb2xvcml6ZTogdHJ1ZVxyXG4gICAgfSksXHJcbiAgICBuZXcgd2luc3Rvbi50cmFuc3BvcnRzLkNvbnNvbGUoe1xyXG4gICAgICBsZXZlbDogJ2RlYnVnJyxcclxuICAgICAgaGFuZGxlRXhjZXB0aW9uczogdHJ1ZSxcclxuICAgICAganNvbjogZmFsc2UsXHJcbiAgICAgIGNvbG9yaXplOiB0cnVlXHJcbiAgICB9KVxyXG4gIF0sXHJcbiAgZXhpdE9uRXJyb3I6IGZhbHNlXHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBsb2dnZXI7XHJcbm1vZHVsZS5leHBvcnRzLnN0cmVhbSA9IHtcclxuICB3cml0ZTogZnVuY3Rpb24gKG1lc3NhZ2U6IGFueSwgZW5jb2Rpbmc6IGFueSkge1xyXG4gICAgbG9nZ2VyLmluZm8obWVzc2FnZSk7XHJcbiAgfVxyXG59O1xyXG4iXX0=
