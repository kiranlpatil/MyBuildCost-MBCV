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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2hhcmVkL2xvZ2dlci9sb2dnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpQ0FBbUM7QUFHbkMsSUFBSSxNQUFNLEdBQUcsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDO0lBQzlCLFVBQVUsRUFBRTtRQUNWLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7WUFDMUIsS0FBSyxFQUFFLE1BQU07WUFDYixRQUFRLEVBQUUsaUJBQWlCO1lBQzNCLGdCQUFnQixFQUFFLElBQUk7WUFDdEIsSUFBSSxFQUFFLElBQUk7WUFDVixPQUFPLEVBQUUsT0FBTztZQUNoQixRQUFRLEVBQUUsQ0FBQztZQUNYLFFBQVEsRUFBRSxJQUFJO1NBQ2YsQ0FBQztRQUNGLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7WUFDN0IsS0FBSyxFQUFFLE9BQU87WUFDZCxnQkFBZ0IsRUFBRSxJQUFJO1lBQ3RCLElBQUksRUFBRSxLQUFLO1lBQ1gsUUFBUSxFQUFFLElBQUk7U0FDZixDQUFDO0tBQ0g7SUFDRCxXQUFXLEVBQUUsS0FBSztDQUNuQixDQUFDLENBQUM7QUFFSCxNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztBQUN4QixNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRztJQUN0QixLQUFLLEVBQUUsVUFBVSxPQUFZLEVBQUUsUUFBYTtRQUMxQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3ZCLENBQUM7Q0FDRixDQUFDIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvc2hhcmVkL2xvZ2dlci9sb2dnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyB3aW5zdG9uIGZyb20gXCJ3aW5zdG9uXCI7XG5cblxudmFyIGxvZ2dlciA9IG5ldyB3aW5zdG9uLkxvZ2dlcih7XG4gIHRyYW5zcG9ydHM6IFtcbiAgICBuZXcgd2luc3Rvbi50cmFuc3BvcnRzLkZpbGUoe1xuICAgICAgbGV2ZWw6ICdpbmZvJyxcbiAgICAgIGZpbGVuYW1lOiBcImNsaWVudEVycm9yTG9nc1wiLFxuICAgICAgaGFuZGxlRXhjZXB0aW9uczogdHJ1ZSxcbiAgICAgIGpzb246IHRydWUsXG4gICAgICBtYXhzaXplOiA1MjQyODgwLCAvLzVNQlxuICAgICAgbWF4RmlsZXM6IDUsXG4gICAgICBjb2xvcml6ZTogdHJ1ZVxuICAgIH0pLFxuICAgIG5ldyB3aW5zdG9uLnRyYW5zcG9ydHMuQ29uc29sZSh7XG4gICAgICBsZXZlbDogJ2RlYnVnJyxcbiAgICAgIGhhbmRsZUV4Y2VwdGlvbnM6IHRydWUsXG4gICAgICBqc29uOiBmYWxzZSxcbiAgICAgIGNvbG9yaXplOiB0cnVlXG4gICAgfSlcbiAgXSxcbiAgZXhpdE9uRXJyb3I6IGZhbHNlXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBsb2dnZXI7XG5tb2R1bGUuZXhwb3J0cy5zdHJlYW0gPSB7XG4gIHdyaXRlOiBmdW5jdGlvbiAobWVzc2FnZTogYW55LCBlbmNvZGluZzogYW55KSB7XG4gICAgbG9nZ2VyLmluZm8obWVzc2FnZSk7XG4gIH1cbn07XG4iXX0=
