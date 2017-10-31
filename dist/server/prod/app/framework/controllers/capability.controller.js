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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvY29udHJvbGxlcnMvY2FwYWJpbGl0eS5jb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsNkNBQWdEO0FBS2hELGtFQUFxRTtBQUdyRSxrQkFBeUIsR0FBb0IsRUFBRSxHQUFxQixFQUFFLElBQVM7SUFDN0UsSUFBSSxDQUFDO1FBQ0gsSUFBSSxpQkFBaUIsR0FBRyxJQUFJLGlCQUFpQixFQUFFLENBQUM7UUFDaEQsSUFBSSxVQUFVLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFDakMsSUFBSSxJQUFJLEdBQVE7WUFDZCxJQUFJLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ25CLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQztTQUM5QixDQUFDO1FBQ0YsT0FBTyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUM5QixpQkFBaUIsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLFVBQUMsS0FBSyxFQUFFLE1BQU07WUFDL0MsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDVixJQUFJLENBQUM7b0JBQ0gsTUFBTSxFQUFFLG9CQUFvQjtvQkFDNUIsT0FBTyxFQUFFLFFBQVEsQ0FBQyxxQkFBcUI7b0JBQ3ZDLFVBQVUsRUFBRSxJQUFJLEtBQUssRUFBRTtvQkFDdkIsSUFBSSxFQUFFLEdBQUc7aUJBQ1YsQ0FBQyxDQUFDO1lBQ0wsQ0FBQztZQUNELElBQUksQ0FBQyxDQUFDO2dCQUNKLE9BQU8sQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7Z0JBQ2pDLEdBQUcsQ0FBQyxJQUFJLENBQUM7b0JBQ1AsUUFBUSxFQUFFLFNBQVM7b0JBQ25CLE1BQU0sRUFBRSxNQUFNO2lCQUNmLENBQUMsQ0FBQztZQUNMLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUVMLENBQUM7SUFDRCxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ1QsSUFBSSxDQUFDO1lBQ0gsTUFBTSxFQUFFLENBQUMsQ0FBQyxPQUFPO1lBQ2pCLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTztZQUNsQixVQUFVLEVBQUUsSUFBSSxLQUFLLEVBQUU7WUFDdkIsSUFBSSxFQUFFLEdBQUc7U0FDVixDQUFDLENBQUM7SUFDTCxDQUFDO0FBQ0gsQ0FBQztBQXBDRCw0QkFvQ0MiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9jb250cm9sbGVycy9jYXBhYmlsaXR5LmNvbnRyb2xsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBleHByZXNzIGZyb20gXCJleHByZXNzXCI7XHJcbmltcG9ydCBBdXRoSW50ZXJjZXB0b3IgPSByZXF1aXJlKCcuLi9pbnRlcmNlcHRvci9hdXRoLmludGVyY2VwdG9yJyk7XHJcbmltcG9ydCBNZXNzYWdlcyA9IHJlcXVpcmUoJy4uL3NoYXJlZC9tZXNzYWdlcycpO1xyXG5pbXBvcnQgUmVzcG9uc2VTZXJ2aWNlID0gcmVxdWlyZSgnLi4vc2hhcmVkL3Jlc3BvbnNlLnNlcnZpY2UnKTtcclxuaW1wb3J0IFJvbGVNb2RlbCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcm9sZS5tb2RlbCcpO1xyXG5pbXBvcnQgUm9sZVNlcnZpY2UgPSByZXF1aXJlKCcuLi9zZXJ2aWNlcy9yb2xlLnNlcnZpY2UnKTtcclxuaW1wb3J0IEluZHVzdHJ5U2VydmljZSA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL2luZHVzdHJ5LnNlcnZpY2UnKTtcclxuaW1wb3J0IENhcGFiaWxpdHlTZXJ2aWNlID0gcmVxdWlyZSgnLi4vc2VydmljZXMvY2FwYWJpbGl0eS5zZXJ2aWNlJyk7XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJldHJpZXZlKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gIHRyeSB7XHJcbiAgICB2YXIgY2FwYWJpbGl0eVNlcnZpY2UgPSBuZXcgQ2FwYWJpbGl0eVNlcnZpY2UoKTtcclxuICAgIHZhciByb2xlc3BhcmFtID0gcmVxLnF1ZXJ5LnJvbGVzO1xyXG4gICAgbGV0IGl0ZW06IGFueSA9IHtcclxuICAgICAgY29kZTogcmVxLnBhcmFtcy5pZCxcclxuICAgICAgcm9sZXM6IEpTT04ucGFyc2Uocm9sZXNwYXJhbSlcclxuICAgIH07XHJcbiAgICBjb25zb2xlLnRpbWUoJ2dldENhcGFiaWxpdHknKTtcclxuICAgIGNhcGFiaWxpdHlTZXJ2aWNlLmZpbmRCeU5hbWUoaXRlbSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICByZWFzb246ICdFcnJvciBJbiBSZXRyaXZpbmcnLC8vTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1dST05HX1RPS0VOLFxyXG4gICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICBjb2RlOiA0MDFcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICBjb25zb2xlLnRpbWVFbmQoJ2dldENhcGFiaWxpdHknKTtcclxuICAgICAgICByZXMuc2VuZCh7XHJcbiAgICAgICAgICAnc3RhdHVzJzogJ3N1Y2Nlc3MnLFxyXG4gICAgICAgICAgJ2RhdGEnOiByZXN1bHRcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gIH1cclxuICBjYXRjaCAoZSkge1xyXG4gICAgbmV4dCh7XHJcbiAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICBjb2RlOiA0MDNcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuIl19
