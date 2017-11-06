"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Messages = require("../shared/messages");
var CapabilityService = require("../services/capability.service");
function retrieve(req, res, next) {
    try {
        var capabilityService = new CapabilityService();
        var rolesparam = req.query.roles;
        var item = {
            code: req.params.id,
            roles: JSON.parse(rolesparam)
        };
        console.time('getCapability');
        capabilityService.findByName(item, function (error, result) {
            if (error) {
                next({
                    reason: 'Error In Retriving',
                    message: Messages.MSG_ERROR_WRONG_TOKEN,
                    stackTrace: new Error(),
                    code: 401
                });
            }
            else {
                console.timeEnd('getCapability');
                res.send({
                    'status': 'success',
                    'data': result
                });
            }
        });
    }
    catch (e) {
        next({
            reason: e.message,
            message: e.message,
            stackTrace: new Error(),
            code: 403
        });
    }
}
exports.retrieve = retrieve;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvY29udHJvbGxlcnMvY2FwYWJpbGl0eS5jb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsNkNBQWdEO0FBS2hELGtFQUFxRTtBQUdyRSxrQkFBeUIsR0FBb0IsRUFBRSxHQUFxQixFQUFFLElBQVM7SUFDN0UsSUFBSSxDQUFDO1FBQ0gsSUFBSSxpQkFBaUIsR0FBRyxJQUFJLGlCQUFpQixFQUFFLENBQUM7UUFDaEQsSUFBSSxVQUFVLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFDakMsSUFBSSxJQUFJLEdBQVE7WUFDZCxJQUFJLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ25CLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQztTQUM5QixDQUFDO1FBQ0YsT0FBTyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUM5QixpQkFBaUIsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLFVBQUMsS0FBSyxFQUFFLE1BQU07WUFDL0MsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDVixJQUFJLENBQUM7b0JBQ0gsTUFBTSxFQUFFLG9CQUFvQjtvQkFDNUIsT0FBTyxFQUFFLFFBQVEsQ0FBQyxxQkFBcUI7b0JBQ3ZDLFVBQVUsRUFBRSxJQUFJLEtBQUssRUFBRTtvQkFDdkIsSUFBSSxFQUFFLEdBQUc7aUJBQ1YsQ0FBQyxDQUFDO1lBQ0wsQ0FBQztZQUNELElBQUksQ0FBQyxDQUFDO2dCQUNKLE9BQU8sQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7Z0JBQ2pDLEdBQUcsQ0FBQyxJQUFJLENBQUM7b0JBQ1AsUUFBUSxFQUFFLFNBQVM7b0JBQ25CLE1BQU0sRUFBRSxNQUFNO2lCQUNmLENBQUMsQ0FBQztZQUNMLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUVMLENBQUM7SUFDRCxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ1QsSUFBSSxDQUFDO1lBQ0gsTUFBTSxFQUFFLENBQUMsQ0FBQyxPQUFPO1lBQ2pCLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTztZQUNsQixVQUFVLEVBQUUsSUFBSSxLQUFLLEVBQUU7WUFDdkIsSUFBSSxFQUFFLEdBQUc7U0FDVixDQUFDLENBQUM7SUFDTCxDQUFDO0FBQ0gsQ0FBQztBQXBDRCw0QkFvQ0MiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9jb250cm9sbGVycy9jYXBhYmlsaXR5LmNvbnRyb2xsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBleHByZXNzIGZyb20gXCJleHByZXNzXCI7XG5pbXBvcnQgQXV0aEludGVyY2VwdG9yID0gcmVxdWlyZSgnLi4vaW50ZXJjZXB0b3IvYXV0aC5pbnRlcmNlcHRvcicpO1xuaW1wb3J0IE1lc3NhZ2VzID0gcmVxdWlyZSgnLi4vc2hhcmVkL21lc3NhZ2VzJyk7XG5pbXBvcnQgUmVzcG9uc2VTZXJ2aWNlID0gcmVxdWlyZSgnLi4vc2hhcmVkL3Jlc3BvbnNlLnNlcnZpY2UnKTtcbmltcG9ydCBSb2xlTW9kZWwgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3JvbGUubW9kZWwnKTtcbmltcG9ydCBSb2xlU2VydmljZSA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL3JvbGUuc2VydmljZScpO1xuaW1wb3J0IEluZHVzdHJ5U2VydmljZSA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL2luZHVzdHJ5LnNlcnZpY2UnKTtcbmltcG9ydCBDYXBhYmlsaXR5U2VydmljZSA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL2NhcGFiaWxpdHkuc2VydmljZScpO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiByZXRyaWV2ZShyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcbiAgdHJ5IHtcbiAgICB2YXIgY2FwYWJpbGl0eVNlcnZpY2UgPSBuZXcgQ2FwYWJpbGl0eVNlcnZpY2UoKTtcbiAgICB2YXIgcm9sZXNwYXJhbSA9IHJlcS5xdWVyeS5yb2xlcztcbiAgICBsZXQgaXRlbTogYW55ID0ge1xuICAgICAgY29kZTogcmVxLnBhcmFtcy5pZCxcbiAgICAgIHJvbGVzOiBKU09OLnBhcnNlKHJvbGVzcGFyYW0pXG4gICAgfTtcbiAgICBjb25zb2xlLnRpbWUoJ2dldENhcGFiaWxpdHknKTtcbiAgICBjYXBhYmlsaXR5U2VydmljZS5maW5kQnlOYW1lKGl0ZW0sIChlcnJvciwgcmVzdWx0KSA9PiB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgbmV4dCh7XG4gICAgICAgICAgcmVhc29uOiAnRXJyb3IgSW4gUmV0cml2aW5nJywvL01lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9DUkVERU5USUFMUyxcbiAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfV1JPTkdfVE9LRU4sXG4gICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICAgICAgY29kZTogNDAxXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGNvbnNvbGUudGltZUVuZCgnZ2V0Q2FwYWJpbGl0eScpO1xuICAgICAgICByZXMuc2VuZCh7XG4gICAgICAgICAgJ3N0YXR1cyc6ICdzdWNjZXNzJyxcbiAgICAgICAgICAnZGF0YSc6IHJlc3VsdFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICB9XG4gIGNhdGNoIChlKSB7XG4gICAgbmV4dCh7XG4gICAgICByZWFzb246IGUubWVzc2FnZSxcbiAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcbiAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgY29kZTogNDAzXG4gICAgfSk7XG4gIH1cbn1cblxuIl19
