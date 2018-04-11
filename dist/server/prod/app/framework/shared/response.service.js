"use strict";
var Messages = require('./messages');
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
            'status': Messages.STATUS_ERROR,
            'error': {
                'reason': reason,
                'message': message,
                'code': code
            },
            access_token: token
        };
        var sendData = JSON.stringify(otherObject);
        return sendData;
    };
    return ResponseService;
}());
module.exports = ResponseService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2hhcmVkL3Jlc3BvbnNlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUVyQztJQUFBO0lBMEJBLENBQUM7SUF4QlEsNEJBQVksR0FBbkIsVUFBb0IsTUFBYyxFQUFFLE9BQWUsRUFBRSxJQUFZO1FBQy9ELElBQUksV0FBVyxHQUFHO1lBQ2hCLE1BQU0sRUFBRSxNQUFNO1lBQ2QsT0FBTyxFQUFFLE9BQU87WUFDaEIsSUFBSSxFQUFFLElBQUk7U0FFWCxDQUFDO1FBQ0YsSUFBSSxRQUFRLEdBQUcsV0FBVyxDQUFDO1FBQzNCLE1BQU0sQ0FBQyxRQUFRLENBQUM7SUFDbEIsQ0FBQztJQUVNLHFDQUFxQixHQUE1QixVQUE2QixNQUFjLEVBQUUsT0FBZSxFQUFFLElBQVksRUFBRSxLQUFVO1FBQ3BGLElBQUksV0FBVyxHQUFHO1lBQ2hCLFFBQVEsRUFBRSxRQUFRLENBQUMsWUFBWTtZQUMvQixPQUFPLEVBQUU7Z0JBQ1AsUUFBUSxFQUFFLE1BQU07Z0JBQ2hCLFNBQVMsRUFBRSxPQUFPO2dCQUNsQixNQUFNLEVBQUUsSUFBSTthQUNiO1lBQ0QsWUFBWSxFQUFFLEtBQUs7U0FDcEIsQ0FBQztRQUNGLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDM0MsTUFBTSxDQUFDLFFBQVEsQ0FBQztJQUNsQixDQUFDO0lBQ0gsc0JBQUM7QUFBRCxDQTFCQSxBQTBCQyxJQUFBO0FBQ0QsaUJBQU8sZUFBZSxDQUFDIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvc2hhcmVkL3Jlc3BvbnNlLnNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgTWVzc2FnZXMgPSByZXF1aXJlKCcuL21lc3NhZ2VzJyk7XHJcblxyXG5jbGFzcyBSZXNwb25zZVNlcnZpY2Uge1xyXG5cclxuICBzdGF0aWMgZXJyb3JNZXNzYWdlKHJlYXNvbjogc3RyaW5nLCBtZXNzYWdlOiBzdHJpbmcsIGNvZGU6IG51bWJlcikge1xyXG4gICAgbGV0IG90aGVyT2JqZWN0ID0ge1xyXG4gICAgICByZWFzb246IHJlYXNvbixcclxuICAgICAgbWVzc2FnZTogbWVzc2FnZSxcclxuICAgICAgY29kZTogY29kZVxyXG5cclxuICAgIH07XHJcbiAgICBsZXQgc2VuZERhdGEgPSBvdGhlck9iamVjdDtcclxuICAgIHJldHVybiBzZW5kRGF0YTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBlcnJvck1lc3NhZ2VXaXRoVG9rZW4ocmVhc29uOiBzdHJpbmcsIG1lc3NhZ2U6IHN0cmluZywgY29kZTogbnVtYmVyLCB0b2tlbjogYW55KSB7XHJcbiAgICBsZXQgb3RoZXJPYmplY3QgPSB7XHJcbiAgICAgICdzdGF0dXMnOiBNZXNzYWdlcy5TVEFUVVNfRVJST1IsXHJcbiAgICAgICdlcnJvcic6IHtcclxuICAgICAgICAncmVhc29uJzogcmVhc29uLFxyXG4gICAgICAgICdtZXNzYWdlJzogbWVzc2FnZSxcclxuICAgICAgICAnY29kZSc6IGNvZGVcclxuICAgICAgfSxcclxuICAgICAgYWNjZXNzX3Rva2VuOiB0b2tlblxyXG4gICAgfTtcclxuICAgIGxldCBzZW5kRGF0YSA9IEpTT04uc3RyaW5naWZ5KG90aGVyT2JqZWN0KTtcclxuICAgIHJldHVybiBzZW5kRGF0YTtcclxuICB9XHJcbn1cclxuZXhwb3J0PVJlc3BvbnNlU2VydmljZTtcclxuIl19
