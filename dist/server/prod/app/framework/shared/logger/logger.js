"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var winston = require("winston");
var logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: 'clientErrorLogs',
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2hhcmVkL2xvZ2dlci9sb2dnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpQ0FBbUM7QUFFbkMsSUFBSSxNQUFNLEdBQUcsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDO0lBQzlCLFVBQVUsRUFBRTtRQUNWLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7WUFDMUIsS0FBSyxFQUFFLE1BQU07WUFDYixRQUFRLEVBQUUsaUJBQWlCO1lBQzNCLGdCQUFnQixFQUFFLElBQUk7WUFDdEIsSUFBSSxFQUFFLElBQUk7WUFDVixPQUFPLEVBQUUsT0FBTztZQUNoQixRQUFRLEVBQUUsQ0FBQztZQUNYLFFBQVEsRUFBRSxJQUFJO1NBQ2YsQ0FBQztRQUNGLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7WUFDN0IsS0FBSyxFQUFFLE9BQU87WUFDZCxnQkFBZ0IsRUFBRSxJQUFJO1lBQ3RCLElBQUksRUFBRSxLQUFLO1lBQ1gsUUFBUSxFQUFFLElBQUk7U0FDZixDQUFDO0tBQ0g7SUFDRCxXQUFXLEVBQUUsS0FBSztDQUNuQixDQUFDLENBQUM7QUFFSCxNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztBQUN4QixNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRztJQUN0QixLQUFLLEVBQUUsVUFBVSxPQUFZLEVBQUUsUUFBYTtRQUMxQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3ZCLENBQUM7Q0FDRixDQUFDIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvc2hhcmVkL2xvZ2dlci9sb2dnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyB3aW5zdG9uIGZyb20gJ3dpbnN0b24nO1xyXG5cclxubGV0IGxvZ2dlciA9IG5ldyB3aW5zdG9uLkxvZ2dlcih7XHJcbiAgdHJhbnNwb3J0czogW1xyXG4gICAgbmV3IHdpbnN0b24udHJhbnNwb3J0cy5GaWxlKHtcclxuICAgICAgbGV2ZWw6ICdpbmZvJyxcclxuICAgICAgZmlsZW5hbWU6ICdjbGllbnRFcnJvckxvZ3MnLFxyXG4gICAgICBoYW5kbGVFeGNlcHRpb25zOiB0cnVlLFxyXG4gICAgICBqc29uOiB0cnVlLFxyXG4gICAgICBtYXhzaXplOiA1MjQyODgwLCAvLzVNQlxyXG4gICAgICBtYXhGaWxlczogNSxcclxuICAgICAgY29sb3JpemU6IHRydWVcclxuICAgIH0pLFxyXG4gICAgbmV3IHdpbnN0b24udHJhbnNwb3J0cy5Db25zb2xlKHtcclxuICAgICAgbGV2ZWw6ICdkZWJ1ZycsXHJcbiAgICAgIGhhbmRsZUV4Y2VwdGlvbnM6IHRydWUsXHJcbiAgICAgIGpzb246IGZhbHNlLFxyXG4gICAgICBjb2xvcml6ZTogdHJ1ZVxyXG4gICAgfSlcclxuICBdLFxyXG4gIGV4aXRPbkVycm9yOiBmYWxzZVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbG9nZ2VyO1xyXG5tb2R1bGUuZXhwb3J0cy5zdHJlYW0gPSB7XHJcbiAgd3JpdGU6IGZ1bmN0aW9uIChtZXNzYWdlOiBhbnksIGVuY29kaW5nOiBhbnkpIHtcclxuICAgIGxvZ2dlci5pbmZvKG1lc3NhZ2UpO1xyXG4gIH1cclxufTtcclxuIl19
