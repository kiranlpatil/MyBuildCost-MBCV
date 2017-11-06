"use strict";
var Messages = require("./messages");
var ResponseService = (function () {
    function ResponseService() {
    }
    ResponseService.errorMessage = function (reason, message, code) {
        var otherObject = {
            reason: reason,
            message: message,
            code: code
        };
        var sendData = otherObject;
        return sendData;
    };
    ResponseService.errorMessageWithToken = function (reason, message, code, token) {
        var otherObject = {
            "status": Messages.STATUS_ERROR,
            "error": {
                "reason": reason,
                "message": message,
                "code": code
            },
            access_token: token
        };
        var sendData = JSON.stringify(otherObject);
        return sendData;
    };
    return ResponseService;
}());
module.exports = ResponseService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2hhcmVkL3Jlc3BvbnNlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUVyQztJQUFBO0lBMEJBLENBQUM7SUF4QlEsNEJBQVksR0FBbkIsVUFBb0IsTUFBYyxFQUFFLE9BQWUsRUFBRSxJQUFZO1FBQy9ELElBQUksV0FBVyxHQUFHO1lBQ2hCLE1BQU0sRUFBRSxNQUFNO1lBQ2QsT0FBTyxFQUFFLE9BQU87WUFDaEIsSUFBSSxFQUFFLElBQUk7U0FFWCxDQUFDO1FBQ0YsSUFBSSxRQUFRLEdBQUcsV0FBVyxDQUFDO1FBQzNCLE1BQU0sQ0FBQyxRQUFRLENBQUM7SUFDbEIsQ0FBQztJQUVNLHFDQUFxQixHQUE1QixVQUE2QixNQUFjLEVBQUUsT0FBZSxFQUFFLElBQVksRUFBRSxLQUFVO1FBQ3BGLElBQUksV0FBVyxHQUFHO1lBQ2hCLFFBQVEsRUFBRSxRQUFRLENBQUMsWUFBWTtZQUMvQixPQUFPLEVBQUU7Z0JBQ1AsUUFBUSxFQUFFLE1BQU07Z0JBQ2hCLFNBQVMsRUFBRSxPQUFPO2dCQUNsQixNQUFNLEVBQUUsSUFBSTthQUNiO1lBQ0QsWUFBWSxFQUFFLEtBQUs7U0FDcEIsQ0FBQztRQUNGLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDM0MsTUFBTSxDQUFDLFFBQVEsQ0FBQztJQUNsQixDQUFDO0lBQ0gsc0JBQUM7QUFBRCxDQTFCQSxBQTBCQyxJQUFBO0FBQ0QsaUJBQU8sZUFBZSxDQUFDIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvc2hhcmVkL3Jlc3BvbnNlLnNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgTWVzc2FnZXMgPSByZXF1aXJlKFwiLi9tZXNzYWdlc1wiKTtcblxuY2xhc3MgUmVzcG9uc2VTZXJ2aWNlIHtcblxuICBzdGF0aWMgZXJyb3JNZXNzYWdlKHJlYXNvbjogc3RyaW5nLCBtZXNzYWdlOiBzdHJpbmcsIGNvZGU6IG51bWJlcikge1xuICAgIHZhciBvdGhlck9iamVjdCA9IHtcbiAgICAgIHJlYXNvbjogcmVhc29uLFxuICAgICAgbWVzc2FnZTogbWVzc2FnZSxcbiAgICAgIGNvZGU6IGNvZGVcblxuICAgIH07XG4gICAgdmFyIHNlbmREYXRhID0gb3RoZXJPYmplY3Q7XG4gICAgcmV0dXJuIHNlbmREYXRhO1xuICB9XG5cbiAgc3RhdGljIGVycm9yTWVzc2FnZVdpdGhUb2tlbihyZWFzb246IHN0cmluZywgbWVzc2FnZTogc3RyaW5nLCBjb2RlOiBudW1iZXIsIHRva2VuOiBhbnkpIHtcbiAgICB2YXIgb3RoZXJPYmplY3QgPSB7XG4gICAgICBcInN0YXR1c1wiOiBNZXNzYWdlcy5TVEFUVVNfRVJST1IsXG4gICAgICBcImVycm9yXCI6IHtcbiAgICAgICAgXCJyZWFzb25cIjogcmVhc29uLFxuICAgICAgICBcIm1lc3NhZ2VcIjogbWVzc2FnZSxcbiAgICAgICAgXCJjb2RlXCI6IGNvZGVcbiAgICAgIH0sXG4gICAgICBhY2Nlc3NfdG9rZW46IHRva2VuXG4gICAgfTtcbiAgICB2YXIgc2VuZERhdGEgPSBKU09OLnN0cmluZ2lmeShvdGhlck9iamVjdCk7XG4gICAgcmV0dXJuIHNlbmREYXRhO1xuICB9XG59XG5leHBvcnQ9UmVzcG9uc2VTZXJ2aWNlO1xuIl19
