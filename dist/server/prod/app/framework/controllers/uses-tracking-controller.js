"use strict";
var sharedconstants_1 = require("../shared/sharedconstants");
var usestracking = require('uses-tracking');
var UsesTrackingController = (function () {
    function UsesTrackingController() {
    }
    UsesTrackingController.prototype.create = function (req, res, next) {
        try {
            var uses_data = {
                recruiterId: req.params.recruiterId,
                candidateId: req.params.candidateId,
                jobProfileId: req.params.jobProfileId,
                timestamp: new Date(),
                action: sharedconstants_1.Actions.DEFAULT_VALUE
            };
            if (req.params.action.toString() === 'add') {
                uses_data.action = sharedconstants_1.Actions.ADDED_IN_TO_COMPARE_VIEW_BY_RECRUITER;
            }
            else {
                uses_data.action = sharedconstants_1.Actions.REMOVED_FROM_COMPARE_VIEW_BY_RECRUITER;
            }
            var obj = new usestracking.MyController();
            this.usesTrackingController = obj._controller;
            this.usesTrackingController.create(uses_data);
            res.send({
                'status': 'success',
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
    };
    return UsesTrackingController;
}());
module.exports = UsesTrackingController;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvY29udHJvbGxlcnMvdXNlcy10cmFja2luZy1jb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSw2REFBa0Q7QUFDbEQsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBRTVDO0lBR0U7SUFDQSxDQUFDO0lBRUQsdUNBQU0sR0FBTixVQUFPLEdBQW9CLEVBQUUsR0FBcUIsRUFBQyxJQUFRO1FBQ3pELElBQUksQ0FBQztZQUNILElBQUksU0FBUyxHQUFHO2dCQUNkLFdBQVcsRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLFdBQVc7Z0JBQ25DLFdBQVcsRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLFdBQVc7Z0JBQ25DLFlBQVksRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLFlBQVk7Z0JBQ3JDLFNBQVMsRUFBRSxJQUFJLElBQUksRUFBRTtnQkFDckIsTUFBTSxFQUFFLHlCQUFPLENBQUMsYUFBYTthQUM5QixDQUFDO1lBQ0YsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDM0MsU0FBUyxDQUFDLE1BQU0sR0FBRyx5QkFBTyxDQUFDLHFDQUFxQyxDQUFDO1lBQ25FLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixTQUFTLENBQUMsTUFBTSxHQUFHLHlCQUFPLENBQUMsc0NBQXNDLENBQUM7WUFDcEUsQ0FBQztZQUNELElBQUksR0FBRyxHQUFRLElBQUksWUFBWSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQy9DLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxHQUFHLENBQUMsV0FBVyxDQUFDO1lBQzlDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDOUMsR0FBRyxDQUFDLElBQUksQ0FBQztnQkFDUCxRQUFRLEVBQUUsU0FBUzthQUNwQixDQUFDLENBQUM7UUFDTCxDQUFDO1FBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNYLElBQUksQ0FBQztnQkFDSCxNQUFNLEVBQUUsQ0FBQyxDQUFDLE9BQU87Z0JBQ2pCLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTztnQkFDbEIsVUFBVSxFQUFFLElBQUksS0FBSyxFQUFFO2dCQUN2QixJQUFJLEVBQUUsR0FBRzthQUNWLENBQUMsQ0FBQztRQUNMLENBQUM7SUFDSCxDQUFDO0lBRUgsNkJBQUM7QUFBRCxDQXBDQSxBQW9DQyxJQUFBO0FBRUQsaUJBQVMsc0JBQXNCLENBQUMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9jb250cm9sbGVycy91c2VzLXRyYWNraW5nLWNvbnRyb2xsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZXhwcmVzcz0gcmVxdWlyZSgnZXhwcmVzcycpO1xuaW1wb3J0IHtBY3Rpb25zfSBmcm9tICcuLi9zaGFyZWQvc2hhcmVkY29uc3RhbnRzJztcbmxldCB1c2VzdHJhY2tpbmcgPSByZXF1aXJlKCd1c2VzLXRyYWNraW5nJyk7XG5cbmNsYXNzIFVzZXNUcmFja2luZ0NvbnRyb2xsZXIge1xuICB1c2VzVHJhY2tpbmdDb250cm9sbGVyOiBhbnk7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gIH1cblxuICBjcmVhdGUocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSxuZXh0OmFueSkge1xuICAgIHRyeSB7XG4gICAgICBsZXQgdXNlc19kYXRhID0ge1xuICAgICAgICByZWNydWl0ZXJJZDogcmVxLnBhcmFtcy5yZWNydWl0ZXJJZCxcbiAgICAgICAgY2FuZGlkYXRlSWQ6IHJlcS5wYXJhbXMuY2FuZGlkYXRlSWQsXG4gICAgICAgIGpvYlByb2ZpbGVJZDogcmVxLnBhcmFtcy5qb2JQcm9maWxlSWQsXG4gICAgICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKSxcbiAgICAgICAgYWN0aW9uOiBBY3Rpb25zLkRFRkFVTFRfVkFMVUVcbiAgICAgIH07XG4gICAgICBpZiAocmVxLnBhcmFtcy5hY3Rpb24udG9TdHJpbmcoKSA9PT0gJ2FkZCcpIHtcbiAgICAgICAgdXNlc19kYXRhLmFjdGlvbiA9IEFjdGlvbnMuQURERURfSU5fVE9fQ09NUEFSRV9WSUVXX0JZX1JFQ1JVSVRFUjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHVzZXNfZGF0YS5hY3Rpb24gPSBBY3Rpb25zLlJFTU9WRURfRlJPTV9DT01QQVJFX1ZJRVdfQllfUkVDUlVJVEVSO1xuICAgICAgfVxuICAgICAgbGV0IG9iajogYW55ID0gbmV3IHVzZXN0cmFja2luZy5NeUNvbnRyb2xsZXIoKTtcbiAgICAgIHRoaXMudXNlc1RyYWNraW5nQ29udHJvbGxlciA9IG9iai5fY29udHJvbGxlcjtcbiAgICAgIHRoaXMudXNlc1RyYWNraW5nQ29udHJvbGxlci5jcmVhdGUodXNlc19kYXRhKTtcbiAgICAgIHJlcy5zZW5kKHtcbiAgICAgICAgJ3N0YXR1cyc6ICdzdWNjZXNzJyxcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIG5leHQoe1xuICAgICAgICByZWFzb246IGUubWVzc2FnZSxcbiAgICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxuICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcbiAgICAgICAgY29kZTogNTAwXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxufVxuXG5leHBvcnQgPSBVc2VzVHJhY2tpbmdDb250cm9sbGVyO1xuIl19
