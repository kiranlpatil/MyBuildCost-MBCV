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
        res.status(403).send({ message: e.message });
    }
}
exports.retrieve = retrieve;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvY29udHJvbGxlcnMvY29tcGxleGl0eS5jb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsNkNBQWdEO0FBTWhELGtFQUFxRTtBQUlyRSxrQkFBeUIsR0FBb0IsRUFBRSxHQUFxQixFQUFFLElBQVM7SUFDN0UsSUFBSSxDQUFDO1FBQ0gsSUFBSSxpQkFBaUIsR0FBRyxJQUFJLGlCQUFpQixFQUFFLENBQUM7UUFDaEQsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7UUFDM0IsSUFBSSxVQUFVLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFDakMsSUFBSSxlQUFlLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUM7UUFDM0MsSUFBSSxJQUFJLEdBQVE7WUFDZCxNQUFNLEVBQUUsTUFBTTtZQUNkLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQztZQUMvQixjQUFjLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUM7U0FDNUMsQ0FBQztRQUNGLE9BQU8sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDOUIsaUJBQWlCLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxVQUFDLEtBQUssRUFBRSxNQUFNO1lBQy9DLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ1YsSUFBSSxDQUFDO29CQUNILE1BQU0sRUFBRSxvQkFBb0I7b0JBQzVCLE9BQU8sRUFBRSxRQUFRLENBQUMscUJBQXFCO29CQUN2QyxJQUFJLEVBQUUsR0FBRztpQkFDVixDQUFDLENBQUM7WUFDTCxDQUFDO1lBQUEsSUFBSSxDQUFDLENBQUM7Z0JBQ0wsT0FBTyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztnQkFDakMsR0FBRyxDQUFDLElBQUksQ0FBQztvQkFDUCxRQUFRLEVBQUUsU0FBUztvQkFDbkIsTUFBTSxFQUFFLE1BQU07aUJBQ2YsQ0FBQyxDQUFDO1lBQ0wsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUNELEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDVCxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFDLENBQUMsQ0FBQztJQUM3QyxDQUFDO0FBQ0gsQ0FBQztBQS9CRCw0QkErQkMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9jb250cm9sbGVycy9jb21wbGV4aXR5LmNvbnRyb2xsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IEF1dGhJbnRlcmNlcHRvciA9IHJlcXVpcmUoJy4uL2ludGVyY2VwdG9yL2F1dGguaW50ZXJjZXB0b3InKTtcbmltcG9ydCBNZXNzYWdlcyA9IHJlcXVpcmUoJy4uL3NoYXJlZC9tZXNzYWdlcycpO1xuaW1wb3J0IFJlc3BvbnNlU2VydmljZSA9IHJlcXVpcmUoJy4uL3NoYXJlZC9yZXNwb25zZS5zZXJ2aWNlJyk7XG5pbXBvcnQgUm9sZU1vZGVsID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9yb2xlLm1vZGVsJyk7XG5pbXBvcnQgUm9sZVNlcnZpY2UgPSByZXF1aXJlKCcuLi9zZXJ2aWNlcy9yb2xlLnNlcnZpY2UnKTtcbmltcG9ydCBJbmR1c3RyeVNlcnZpY2UgPSByZXF1aXJlKCcuLi9zZXJ2aWNlcy9pbmR1c3RyeS5zZXJ2aWNlJyk7XG5pbXBvcnQgQ2FwYWJpbGl0eVNlcnZpY2UgPSByZXF1aXJlKCcuLi9zZXJ2aWNlcy9jYXBhYmlsaXR5LnNlcnZpY2UnKTtcbmltcG9ydCBDb21wbGV4aXR5U2VydmljZSA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL2NvbXBsZXhpdHkuc2VydmljZScpO1xuaW1wb3J0IFNjZW5hcmlvU2VydmljZSA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL3NjZW5hcmlvLnNlcnZpY2UnKTtcblxuXG5leHBvcnQgZnVuY3Rpb24gcmV0cmlldmUocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7ICAvLyB0b2RvIGZpbmQgYmV0dGVyIHNvbHV0aW9uXG4gIHRyeSB7XG4gICAgdmFyIGNvbXBsZXhpdHlTZXJ2aWNlID0gbmV3IENvbXBsZXhpdHlTZXJ2aWNlKCk7XG4gICAgdmFyIHBhcmFtcyA9IHJlcS5wYXJhbXMuaWQ7XG4gICAgdmFyIHJvbGVzcGFyYW0gPSByZXEucXVlcnkucm9sZXM7XG4gICAgdmFyIGNhcGFiaWxpdHlwYXJhbSA9IHJlcS5xdWVyeS5jYXBhYmlsaXR5O1xuICAgIGxldCBpdGVtOiBhbnkgPSB7XG4gICAgICAnY29kZSc6IHBhcmFtcyxcbiAgICAgICdyb2xlcyc6IEpTT04ucGFyc2Uocm9sZXNwYXJhbSksXG4gICAgICAnY2FwYWJpbGl0aWVzJzogSlNPTi5wYXJzZShjYXBhYmlsaXR5cGFyYW0pXG4gICAgfTtcbiAgICBjb25zb2xlLnRpbWUoJ2dldENvbXBsZXhpdHknKTtcbiAgICBjb21wbGV4aXR5U2VydmljZS5maW5kQnlOYW1lKGl0ZW0sIChlcnJvciwgcmVzdWx0KSA9PiB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgbmV4dCh7XG4gICAgICAgICAgcmVhc29uOiAnRXJyb3IgSW4gUmV0cml2aW5nJywvL01lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9DUkVERU5USUFMUyxcbiAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfV1JPTkdfVE9LRU4sXG4gICAgICAgICAgY29kZTogNDAxXG4gICAgICAgIH0pO1xuICAgICAgfWVsc2Uge1xuICAgICAgICBjb25zb2xlLnRpbWVFbmQoJ2dldENvbXBsZXhpdHknKTtcbiAgICAgICAgcmVzLnNlbmQoe1xuICAgICAgICAgICdzdGF0dXMnOiAnc3VjY2VzcycsXG4gICAgICAgICAgJ2RhdGEnOiByZXN1bHRcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgY2F0Y2ggKGUpIHtcbiAgICByZXMuc3RhdHVzKDQwMykuc2VuZCh7bWVzc2FnZTogZS5tZXNzYWdlfSk7XG4gIH1cbn1cblxuIl19
