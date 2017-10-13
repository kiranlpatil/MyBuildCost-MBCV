"use strict";
var sharedconstants_1 = require("../shared/sharedconstants");
var usestracking = require('uses-tracking');
var UsesTrackingController = (function () {
    function UsesTrackingController() {
    }
    UsesTrackingController.prototype.create = function (req, res) {
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
            res.status(403).send({ message: e.message });
        }
    };
    return UsesTrackingController;
}());
module.exports = UsesTrackingController;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvY29udHJvbGxlcnMvdXNlcy10cmFja2luZy1jb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSw2REFBa0Q7QUFDbEQsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBRTVDO0lBR0U7SUFDQSxDQUFDO0lBRUQsdUNBQU0sR0FBTixVQUFPLEdBQW9CLEVBQUUsR0FBcUI7UUFDaEQsSUFBSSxDQUFDO1lBQ0gsSUFBSSxTQUFTLEdBQUc7Z0JBQ2QsV0FBVyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsV0FBVztnQkFDbkMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsV0FBVztnQkFDbkMsWUFBWSxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsWUFBWTtnQkFDckMsU0FBUyxFQUFFLElBQUksSUFBSSxFQUFFO2dCQUNyQixNQUFNLEVBQUUseUJBQU8sQ0FBQyxhQUFhO2FBQzlCLENBQUM7WUFDRixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUMzQyxTQUFTLENBQUMsTUFBTSxHQUFHLHlCQUFPLENBQUMscUNBQXFDLENBQUM7WUFDbkUsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLFNBQVMsQ0FBQyxNQUFNLEdBQUcseUJBQU8sQ0FBQyxzQ0FBc0MsQ0FBQztZQUNwRSxDQUFDO1lBQ0QsSUFBSSxHQUFHLEdBQVEsSUFBSSxZQUFZLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDL0MsSUFBSSxDQUFDLHNCQUFzQixHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUM7WUFDOUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUM5QyxHQUFHLENBQUMsSUFBSSxDQUFDO2dCQUNQLFFBQVEsRUFBRSxTQUFTO2FBQ3BCLENBQUMsQ0FBQztRQUNMLENBQUM7UUFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1gsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBQyxDQUFDLENBQUM7UUFDN0MsQ0FBQztJQUNILENBQUM7SUFFSCw2QkFBQztBQUFELENBL0JBLEFBK0JDLElBQUE7QUFFRCxpQkFBUyxzQkFBc0IsQ0FBQyIsImZpbGUiOiJhcHAvZnJhbWV3b3JrL2NvbnRyb2xsZXJzL3VzZXMtdHJhY2tpbmctY29udHJvbGxlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBleHByZXNzPSByZXF1aXJlKCdleHByZXNzJyk7XHJcbmltcG9ydCB7QWN0aW9uc30gZnJvbSAnLi4vc2hhcmVkL3NoYXJlZGNvbnN0YW50cyc7XHJcbmxldCB1c2VzdHJhY2tpbmcgPSByZXF1aXJlKCd1c2VzLXRyYWNraW5nJyk7XHJcblxyXG5jbGFzcyBVc2VzVHJhY2tpbmdDb250cm9sbGVyIHtcclxuICB1c2VzVHJhY2tpbmdDb250cm9sbGVyOiBhbnk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gIH1cclxuXHJcbiAgY3JlYXRlKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCB1c2VzX2RhdGEgPSB7XHJcbiAgICAgICAgcmVjcnVpdGVySWQ6IHJlcS5wYXJhbXMucmVjcnVpdGVySWQsXHJcbiAgICAgICAgY2FuZGlkYXRlSWQ6IHJlcS5wYXJhbXMuY2FuZGlkYXRlSWQsXHJcbiAgICAgICAgam9iUHJvZmlsZUlkOiByZXEucGFyYW1zLmpvYlByb2ZpbGVJZCxcclxuICAgICAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCksXHJcbiAgICAgICAgYWN0aW9uOiBBY3Rpb25zLkRFRkFVTFRfVkFMVUVcclxuICAgICAgfTtcclxuICAgICAgaWYgKHJlcS5wYXJhbXMuYWN0aW9uLnRvU3RyaW5nKCkgPT09ICdhZGQnKSB7XHJcbiAgICAgICAgdXNlc19kYXRhLmFjdGlvbiA9IEFjdGlvbnMuQURERURfSU5fVE9fQ09NUEFSRV9WSUVXX0JZX1JFQ1JVSVRFUjtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB1c2VzX2RhdGEuYWN0aW9uID0gQWN0aW9ucy5SRU1PVkVEX0ZST01fQ09NUEFSRV9WSUVXX0JZX1JFQ1JVSVRFUjtcclxuICAgICAgfVxyXG4gICAgICBsZXQgb2JqOiBhbnkgPSBuZXcgdXNlc3RyYWNraW5nLk15Q29udHJvbGxlcigpO1xyXG4gICAgICB0aGlzLnVzZXNUcmFja2luZ0NvbnRyb2xsZXIgPSBvYmouX2NvbnRyb2xsZXI7XHJcbiAgICAgIHRoaXMudXNlc1RyYWNraW5nQ29udHJvbGxlci5jcmVhdGUodXNlc19kYXRhKTtcclxuICAgICAgcmVzLnNlbmQoe1xyXG4gICAgICAgICdzdGF0dXMnOiAnc3VjY2VzcycsXHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICByZXMuc3RhdHVzKDQwMykuc2VuZCh7bWVzc2FnZTogZS5tZXNzYWdlfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0ID0gVXNlc1RyYWNraW5nQ29udHJvbGxlcjtcclxuIl19
