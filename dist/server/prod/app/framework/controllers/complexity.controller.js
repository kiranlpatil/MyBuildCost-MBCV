"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Messages = require("../shared/messages");
var ComplexityService = require("../services/complexity.service");
function retrieve(req, res, next) {
    try {
        var complexityService = new ComplexityService();
        var params = req.params.id;
        var rolesparam = req.query.roles;
        var capabilityparam = req.query.capability;
        var item = {
            'code': params,
            'roles': JSON.parse(rolesparam),
            'capabilities': JSON.parse(capabilityparam)
        };
        console.time('getComplexity');
        complexityService.findByName(item, function (error, result) {
            if (error) {
                next({
                    reason: 'Error In Retriving',
                    message: Messages.MSG_ERROR_WRONG_TOKEN,
                    stackTrace: new Error(),
                    code: 401
                });
            }
            else {
                console.timeEnd('getComplexity');
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
            code: 500
        });
    }
}
exports.retrieve = retrieve;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvY29udHJvbGxlcnMvY29tcGxleGl0eS5jb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsNkNBQWdEO0FBTWhELGtFQUFxRTtBQUlyRSxrQkFBeUIsR0FBb0IsRUFBRSxHQUFxQixFQUFFLElBQVM7SUFDN0UsSUFBSSxDQUFDO1FBQ0gsSUFBSSxpQkFBaUIsR0FBRyxJQUFJLGlCQUFpQixFQUFFLENBQUM7UUFDaEQsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7UUFDM0IsSUFBSSxVQUFVLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFDakMsSUFBSSxlQUFlLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUM7UUFDM0MsSUFBSSxJQUFJLEdBQVE7WUFDZCxNQUFNLEVBQUUsTUFBTTtZQUNkLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQztZQUMvQixjQUFjLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUM7U0FDNUMsQ0FBQztRQUNGLE9BQU8sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDOUIsaUJBQWlCLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxVQUFDLEtBQUssRUFBRSxNQUFNO1lBQy9DLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ1YsSUFBSSxDQUFDO29CQUNILE1BQU0sRUFBRSxvQkFBb0I7b0JBQzVCLE9BQU8sRUFBRSxRQUFRLENBQUMscUJBQXFCO29CQUN2QyxVQUFVLEVBQUUsSUFBSSxLQUFLLEVBQUU7b0JBQ3ZCLElBQUksRUFBRSxHQUFHO2lCQUNWLENBQUMsQ0FBQztZQUNMLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixPQUFPLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO2dCQUNqQyxHQUFHLENBQUMsSUFBSSxDQUFDO29CQUNQLFFBQVEsRUFBRSxTQUFTO29CQUNuQixNQUFNLEVBQUUsTUFBTTtpQkFDZixDQUFDLENBQUM7WUFDTCxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBQ0QsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNULElBQUksQ0FBQztZQUNILE1BQU0sRUFBRSxDQUFDLENBQUMsT0FBTztZQUNqQixPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU87WUFDbEIsVUFBVSxFQUFFLElBQUksS0FBSyxFQUFFO1lBQ3ZCLElBQUksRUFBRSxHQUFHO1NBQ1YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztBQUNILENBQUM7QUFyQ0QsNEJBcUNDIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvY29udHJvbGxlcnMvY29tcGxleGl0eS5jb250cm9sbGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZXhwcmVzcyBmcm9tIFwiZXhwcmVzc1wiO1xyXG5pbXBvcnQgQXV0aEludGVyY2VwdG9yID0gcmVxdWlyZSgnLi4vaW50ZXJjZXB0b3IvYXV0aC5pbnRlcmNlcHRvcicpO1xyXG5pbXBvcnQgTWVzc2FnZXMgPSByZXF1aXJlKCcuLi9zaGFyZWQvbWVzc2FnZXMnKTtcclxuaW1wb3J0IFJlc3BvbnNlU2VydmljZSA9IHJlcXVpcmUoJy4uL3NoYXJlZC9yZXNwb25zZS5zZXJ2aWNlJyk7XHJcbmltcG9ydCBSb2xlTW9kZWwgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3JvbGUubW9kZWwnKTtcclxuaW1wb3J0IFJvbGVTZXJ2aWNlID0gcmVxdWlyZSgnLi4vc2VydmljZXMvcm9sZS5zZXJ2aWNlJyk7XHJcbmltcG9ydCBJbmR1c3RyeVNlcnZpY2UgPSByZXF1aXJlKCcuLi9zZXJ2aWNlcy9pbmR1c3RyeS5zZXJ2aWNlJyk7XHJcbmltcG9ydCBDYXBhYmlsaXR5U2VydmljZSA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL2NhcGFiaWxpdHkuc2VydmljZScpO1xyXG5pbXBvcnQgQ29tcGxleGl0eVNlcnZpY2UgPSByZXF1aXJlKCcuLi9zZXJ2aWNlcy9jb21wbGV4aXR5LnNlcnZpY2UnKTtcclxuaW1wb3J0IFNjZW5hcmlvU2VydmljZSA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL3NjZW5hcmlvLnNlcnZpY2UnKTtcclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmV0cmlldmUocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7ICAvLyB0b2RvIGZpbmQgYmV0dGVyIHNvbHV0aW9uXHJcbiAgdHJ5IHtcclxuICAgIHZhciBjb21wbGV4aXR5U2VydmljZSA9IG5ldyBDb21wbGV4aXR5U2VydmljZSgpO1xyXG4gICAgdmFyIHBhcmFtcyA9IHJlcS5wYXJhbXMuaWQ7XHJcbiAgICB2YXIgcm9sZXNwYXJhbSA9IHJlcS5xdWVyeS5yb2xlcztcclxuICAgIHZhciBjYXBhYmlsaXR5cGFyYW0gPSByZXEucXVlcnkuY2FwYWJpbGl0eTtcclxuICAgIGxldCBpdGVtOiBhbnkgPSB7XHJcbiAgICAgICdjb2RlJzogcGFyYW1zLFxyXG4gICAgICAncm9sZXMnOiBKU09OLnBhcnNlKHJvbGVzcGFyYW0pLFxyXG4gICAgICAnY2FwYWJpbGl0aWVzJzogSlNPTi5wYXJzZShjYXBhYmlsaXR5cGFyYW0pXHJcbiAgICB9O1xyXG4gICAgY29uc29sZS50aW1lKCdnZXRDb21wbGV4aXR5Jyk7XHJcbiAgICBjb21wbGV4aXR5U2VydmljZS5maW5kQnlOYW1lKGl0ZW0sIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgcmVhc29uOiAnRXJyb3IgSW4gUmV0cml2aW5nJywvL01lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9DUkVERU5USUFMUyxcclxuICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9XUk9OR19UT0tFTixcclxuICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgY29kZTogNDAxXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc29sZS50aW1lRW5kKCdnZXRDb21wbGV4aXR5Jyk7XHJcbiAgICAgICAgcmVzLnNlbmQoe1xyXG4gICAgICAgICAgJ3N0YXR1cyc6ICdzdWNjZXNzJyxcclxuICAgICAgICAgICdkYXRhJzogcmVzdWx0XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuICBjYXRjaCAoZSkge1xyXG4gICAgbmV4dCh7XHJcbiAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICBjb2RlOiA1MDBcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuIl19
