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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvY29udHJvbGxlcnMvdXNlcy10cmFja2luZy1jb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSw2REFBa0Q7QUFDbEQsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBRTVDO0lBR0U7SUFDQSxDQUFDO0lBRUQsdUNBQU0sR0FBTixVQUFPLEdBQW9CLEVBQUUsR0FBcUIsRUFBQyxJQUFRO1FBQ3pELElBQUksQ0FBQztZQUNILElBQUksU0FBUyxHQUFHO2dCQUNkLFdBQVcsRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLFdBQVc7Z0JBQ25DLFdBQVcsRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLFdBQVc7Z0JBQ25DLFlBQVksRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLFlBQVk7Z0JBQ3JDLFNBQVMsRUFBRSxJQUFJLElBQUksRUFBRTtnQkFDckIsTUFBTSxFQUFFLHlCQUFPLENBQUMsYUFBYTthQUM5QixDQUFDO1lBQ0YsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDM0MsU0FBUyxDQUFDLE1BQU0sR0FBRyx5QkFBTyxDQUFDLHFDQUFxQyxDQUFDO1lBQ25FLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixTQUFTLENBQUMsTUFBTSxHQUFHLHlCQUFPLENBQUMsc0NBQXNDLENBQUM7WUFDcEUsQ0FBQztZQUNELElBQUksR0FBRyxHQUFRLElBQUksWUFBWSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQy9DLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxHQUFHLENBQUMsV0FBVyxDQUFDO1lBQzlDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDOUMsR0FBRyxDQUFDLElBQUksQ0FBQztnQkFDUCxRQUFRLEVBQUUsU0FBUzthQUNwQixDQUFDLENBQUM7UUFDTCxDQUFDO1FBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNYLElBQUksQ0FBQztnQkFDSCxNQUFNLEVBQUUsQ0FBQyxDQUFDLE9BQU87Z0JBQ2pCLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTztnQkFDbEIsVUFBVSxFQUFFLElBQUksS0FBSyxFQUFFO2dCQUN2QixJQUFJLEVBQUUsR0FBRzthQUNWLENBQUMsQ0FBQztRQUNMLENBQUM7SUFDSCxDQUFDO0lBRUgsNkJBQUM7QUFBRCxDQXBDQSxBQW9DQyxJQUFBO0FBRUQsaUJBQVMsc0JBQXNCLENBQUMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9jb250cm9sbGVycy91c2VzLXRyYWNraW5nLWNvbnRyb2xsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZXhwcmVzcz0gcmVxdWlyZSgnZXhwcmVzcycpO1xyXG5pbXBvcnQge0FjdGlvbnN9IGZyb20gJy4uL3NoYXJlZC9zaGFyZWRjb25zdGFudHMnO1xyXG5sZXQgdXNlc3RyYWNraW5nID0gcmVxdWlyZSgndXNlcy10cmFja2luZycpO1xyXG5cclxuY2xhc3MgVXNlc1RyYWNraW5nQ29udHJvbGxlciB7XHJcbiAgdXNlc1RyYWNraW5nQ29udHJvbGxlcjogYW55O1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICB9XHJcblxyXG4gIGNyZWF0ZShyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLG5leHQ6YW55KSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgdXNlc19kYXRhID0ge1xyXG4gICAgICAgIHJlY3J1aXRlcklkOiByZXEucGFyYW1zLnJlY3J1aXRlcklkLFxyXG4gICAgICAgIGNhbmRpZGF0ZUlkOiByZXEucGFyYW1zLmNhbmRpZGF0ZUlkLFxyXG4gICAgICAgIGpvYlByb2ZpbGVJZDogcmVxLnBhcmFtcy5qb2JQcm9maWxlSWQsXHJcbiAgICAgICAgdGltZXN0YW1wOiBuZXcgRGF0ZSgpLFxyXG4gICAgICAgIGFjdGlvbjogQWN0aW9ucy5ERUZBVUxUX1ZBTFVFXHJcbiAgICAgIH07XHJcbiAgICAgIGlmIChyZXEucGFyYW1zLmFjdGlvbi50b1N0cmluZygpID09PSAnYWRkJykge1xyXG4gICAgICAgIHVzZXNfZGF0YS5hY3Rpb24gPSBBY3Rpb25zLkFEREVEX0lOX1RPX0NPTVBBUkVfVklFV19CWV9SRUNSVUlURVI7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdXNlc19kYXRhLmFjdGlvbiA9IEFjdGlvbnMuUkVNT1ZFRF9GUk9NX0NPTVBBUkVfVklFV19CWV9SRUNSVUlURVI7XHJcbiAgICAgIH1cclxuICAgICAgbGV0IG9iajogYW55ID0gbmV3IHVzZXN0cmFja2luZy5NeUNvbnRyb2xsZXIoKTtcclxuICAgICAgdGhpcy51c2VzVHJhY2tpbmdDb250cm9sbGVyID0gb2JqLl9jb250cm9sbGVyO1xyXG4gICAgICB0aGlzLnVzZXNUcmFja2luZ0NvbnRyb2xsZXIuY3JlYXRlKHVzZXNfZGF0YSk7XHJcbiAgICAgIHJlcy5zZW5kKHtcclxuICAgICAgICAnc3RhdHVzJzogJ3N1Y2Nlc3MnLFxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgbmV4dCh7XHJcbiAgICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgIGNvZGU6IDUwMFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQgPSBVc2VzVHJhY2tpbmdDb250cm9sbGVyO1xyXG4iXX0=
