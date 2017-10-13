"use strict";
var RoleClassModel = require("../dataaccess/model/role-class.model");
var config = require('config');
var ProjectAsset = require("../shared/projectasset");
var RoleRepository = require("../dataaccess/repository/role.repository");
var IndustryRepository = require("../dataaccess/repository/industry.repository");
var RoleService = (function () {
    function RoleService() {
        this.roleRepository = new RoleRepository();
        this.industryRepository = new IndustryRepository();
        this.APP_NAME = ProjectAsset.APP_NAME;
    }
    RoleService.prototype.retrieve = function (field, callback) {
        this.roleRepository.retrieveAll({}, callback);
    };
    RoleService.prototype.create = function (item, callback) {
        this.roleRepository.create(item, function (err, res) {
            if (err) {
                callback(new Error("Problem in Creating role model"), null);
            }
            else {
                callback(null, res);
            }
        });
    };
    RoleService.prototype.retrieveByMultiIds = function (item, callback) {
        this.roleRepository.retrieveByMultiIds(item, { capabilities: 0 }, callback);
    };
    RoleService.prototype.retrieveByMultiIdsWithCapability = function (item, names, callback) {
        this.roleRepository.retrieveByMultiIdsAndNames(item, names, { _id: 0 }, callback);
    };
    RoleService.prototype.findByName = function (field, callback) {
        this.industryRepository.findRoles(field, callback);
    };
    RoleService.prototype.addRole = function (currentRow, roles) {
        if (roles.length != 0) {
            var isRoleFound = false;
            for (var i = 0; i < roles.length; i++) {
                if (currentRow.area_of_work == roles[i].name) {
                    isRoleFound = true;
                }
            }
            if (!isRoleFound) {
                var newRole = new RoleClassModel(currentRow.area_of_work, currentRow.area_of_work_code, currentRow.area_of_work_display_sequence);
                roles.push(newRole);
            }
            return roles;
        }
        else {
            var newRole = new RoleClassModel(currentRow.area_of_work, currentRow.area_of_work_code, currentRow.area_of_work_display_sequence);
            roles.push(newRole);
            return roles;
        }
    };
    return RoleService;
}());
Object.seal(RoleService);
module.exports = RoleService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2VydmljZXMvcm9sZS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxxRUFBd0U7QUFDeEUsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBRS9CLHFEQUF3RDtBQUN4RCx5RUFBNEU7QUFDNUUsaUZBQW9GO0FBQ3BGO0lBS0U7UUFDRSxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7UUFDM0MsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksa0JBQWtCLEVBQUUsQ0FBQztRQUNuRCxJQUFJLENBQUMsUUFBUSxHQUFHLFlBQVksQ0FBQyxRQUFRLENBQUM7SUFDeEMsQ0FBQztJQUVELDhCQUFRLEdBQVIsVUFBUyxLQUFVLEVBQUUsUUFBMkM7UUFDOUQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFFRCw0QkFBTSxHQUFOLFVBQU8sSUFBUyxFQUFFLFFBQTJDO1FBQzNELElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxVQUFDLEdBQUcsRUFBRSxHQUFHO1lBQ3hDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsUUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLGdDQUFnQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDOUQsQ0FBQztZQUNELElBQUksQ0FBQyxDQUFDO2dCQUNKLFFBQVEsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDdEIsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELHdDQUFrQixHQUFsQixVQUFtQixJQUFTLEVBQUUsUUFBMkM7UUFDdkUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxFQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDNUUsQ0FBQztJQUVELHNEQUFnQyxHQUFoQyxVQUFpQyxJQUFTLEVBQUUsS0FBVSxFQUFFLFFBQTJDO1FBQ2pHLElBQUksQ0FBQyxjQUFjLENBQUMsMEJBQTBCLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNsRixDQUFDO0lBRUQsZ0NBQVUsR0FBVixVQUFXLEtBQVUsRUFBRSxRQUEyQztRQUNoRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBRUQsNkJBQU8sR0FBUCxVQUFRLFVBQWMsRUFBRSxLQUFTO1FBRS9CLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QixJQUFJLFdBQVcsR0FBVyxLQUFLLENBQUM7WUFDaEMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ3RDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxZQUFZLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQzdDLFdBQVcsR0FBRyxJQUFJLENBQUM7Z0JBQ3JCLENBQUM7WUFDSCxDQUFDO1lBQ0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2dCQUNqQixJQUFJLE9BQU8sR0FBRyxJQUFJLGNBQWMsQ0FBQyxVQUFVLENBQUMsWUFBWSxFQUFFLFVBQVUsQ0FBQyxpQkFBaUIsRUFBRSxVQUFVLENBQUMsNkJBQTZCLENBQUMsQ0FBQztnQkFDbEksS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN0QixDQUFDO1lBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNmLENBQUM7UUFDRCxJQUFJLENBQUMsQ0FBQztZQUNKLElBQUksT0FBTyxHQUFHLElBQUksY0FBYyxDQUFDLFVBQVUsQ0FBQyxZQUFZLEVBQUUsVUFBVSxDQUFDLGlCQUFpQixFQUFFLFVBQVUsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1lBQ2xJLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDcEIsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNmLENBQUM7SUFDSCxDQUFDO0lBRUgsa0JBQUM7QUFBRCxDQTVEQSxBQTREQyxJQUFBO0FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUN6QixpQkFBUyxXQUFXLENBQUMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9zZXJ2aWNlcy9yb2xlLnNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUm9sZUNsYXNzTW9kZWwgPSByZXF1aXJlKFwiLi4vZGF0YWFjY2Vzcy9tb2RlbC9yb2xlLWNsYXNzLm1vZGVsXCIpO1xyXG52YXIgY29uZmlnID0gcmVxdWlyZSgnY29uZmlnJyk7XHJcbmltcG9ydCBDTmV4dE1lc3NhZ2VzID0gcmVxdWlyZShcIi4uL3NoYXJlZC9jbmV4dC1tZXNzYWdlc1wiKTtcclxuaW1wb3J0IFByb2plY3RBc3NldCA9IHJlcXVpcmUoXCIuLi9zaGFyZWQvcHJvamVjdGFzc2V0XCIpO1xyXG5pbXBvcnQgUm9sZVJlcG9zaXRvcnkgPSByZXF1aXJlKFwiLi4vZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L3JvbGUucmVwb3NpdG9yeVwiKTtcclxuaW1wb3J0IEluZHVzdHJ5UmVwb3NpdG9yeSA9IHJlcXVpcmUoXCIuLi9kYXRhYWNjZXNzL3JlcG9zaXRvcnkvaW5kdXN0cnkucmVwb3NpdG9yeVwiKTtcclxuY2xhc3MgUm9sZVNlcnZpY2Uge1xyXG4gIHByaXZhdGUgcm9sZVJlcG9zaXRvcnk6IFJvbGVSZXBvc2l0b3J5O1xyXG4gIHByaXZhdGUgaW5kdXN0cnlSZXBvc2l0b3J5OiBJbmR1c3RyeVJlcG9zaXRvcnk7XHJcbiAgQVBQX05BTUU6IHN0cmluZztcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLnJvbGVSZXBvc2l0b3J5ID0gbmV3IFJvbGVSZXBvc2l0b3J5KCk7XHJcbiAgICB0aGlzLmluZHVzdHJ5UmVwb3NpdG9yeSA9IG5ldyBJbmR1c3RyeVJlcG9zaXRvcnkoKTtcclxuICAgIHRoaXMuQVBQX05BTUUgPSBQcm9qZWN0QXNzZXQuQVBQX05BTUU7XHJcbiAgfVxyXG5cclxuICByZXRyaWV2ZShmaWVsZDogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0aGlzLnJvbGVSZXBvc2l0b3J5LnJldHJpZXZlQWxsKHt9LCBjYWxsYmFjayk7XHJcbiAgfVxyXG5cclxuICBjcmVhdGUoaXRlbTogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0aGlzLnJvbGVSZXBvc2l0b3J5LmNyZWF0ZShpdGVtLCAoZXJyLCByZXMpID0+IHtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihcIlByb2JsZW0gaW4gQ3JlYXRpbmcgcm9sZSBtb2RlbFwiKSwgbnVsbCk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZXRyaWV2ZUJ5TXVsdGlJZHMoaXRlbTogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0aGlzLnJvbGVSZXBvc2l0b3J5LnJldHJpZXZlQnlNdWx0aUlkcyhpdGVtLCB7Y2FwYWJpbGl0aWVzOiAwfSwgY2FsbGJhY2spO1xyXG4gIH1cclxuXHJcbiAgcmV0cmlldmVCeU11bHRpSWRzV2l0aENhcGFiaWxpdHkoaXRlbTogYW55LCBuYW1lczogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0aGlzLnJvbGVSZXBvc2l0b3J5LnJldHJpZXZlQnlNdWx0aUlkc0FuZE5hbWVzKGl0ZW0sIG5hbWVzLCB7X2lkOiAwfSwgY2FsbGJhY2spO1xyXG4gIH1cclxuXHJcbiAgZmluZEJ5TmFtZShmaWVsZDogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0aGlzLmluZHVzdHJ5UmVwb3NpdG9yeS5maW5kUm9sZXMoZmllbGQsIGNhbGxiYWNrKTtcclxuICB9XHJcblxyXG4gIGFkZFJvbGUoY3VycmVudFJvdzphbnksIHJvbGVzOmFueSkge1xyXG5cclxuICAgIGlmIChyb2xlcy5sZW5ndGggIT0gMCkge1xyXG4gICAgICBsZXQgaXNSb2xlRm91bmQgOiBib29sZWFuPWZhbHNlO1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvbGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGN1cnJlbnRSb3cuYXJlYV9vZl93b3JrID09IHJvbGVzW2ldLm5hbWUpIHtcclxuICAgICAgICAgIGlzUm9sZUZvdW5kID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCFpc1JvbGVGb3VuZCkge1xyXG4gICAgICAgIGxldCBuZXdSb2xlID0gbmV3IFJvbGVDbGFzc01vZGVsKGN1cnJlbnRSb3cuYXJlYV9vZl93b3JrLCBjdXJyZW50Um93LmFyZWFfb2Zfd29ya19jb2RlLCBjdXJyZW50Um93LmFyZWFfb2Zfd29ya19kaXNwbGF5X3NlcXVlbmNlKTtcclxuICAgICAgICByb2xlcy5wdXNoKG5ld1JvbGUpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiByb2xlcztcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICBsZXQgbmV3Um9sZSA9IG5ldyBSb2xlQ2xhc3NNb2RlbChjdXJyZW50Um93LmFyZWFfb2Zfd29yaywgY3VycmVudFJvdy5hcmVhX29mX3dvcmtfY29kZSwgY3VycmVudFJvdy5hcmVhX29mX3dvcmtfZGlzcGxheV9zZXF1ZW5jZSk7XHJcbiAgICAgIHJvbGVzLnB1c2gobmV3Um9sZSk7XHJcbiAgICAgIHJldHVybiByb2xlcztcclxuICAgIH1cclxuICB9XHJcblxyXG59XHJcblxyXG5PYmplY3Quc2VhbChSb2xlU2VydmljZSk7XHJcbmV4cG9ydCA9IFJvbGVTZXJ2aWNlO1xyXG4iXX0=
