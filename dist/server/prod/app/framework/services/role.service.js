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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2VydmljZXMvcm9sZS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxxRUFBd0U7QUFDeEUsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBRS9CLHFEQUF3RDtBQUN4RCx5RUFBNEU7QUFDNUUsaUZBQW9GO0FBQ3BGO0lBS0U7UUFDRSxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7UUFDM0MsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksa0JBQWtCLEVBQUUsQ0FBQztRQUNuRCxJQUFJLENBQUMsUUFBUSxHQUFHLFlBQVksQ0FBQyxRQUFRLENBQUM7SUFDeEMsQ0FBQztJQUVELDhCQUFRLEdBQVIsVUFBUyxLQUFVLEVBQUUsUUFBMkM7UUFDOUQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFFRCw0QkFBTSxHQUFOLFVBQU8sSUFBUyxFQUFFLFFBQTJDO1FBQzNELElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxVQUFDLEdBQUcsRUFBRSxHQUFHO1lBQ3hDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsUUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLGdDQUFnQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDOUQsQ0FBQztZQUNELElBQUksQ0FBQyxDQUFDO2dCQUNKLFFBQVEsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDdEIsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELHdDQUFrQixHQUFsQixVQUFtQixJQUFTLEVBQUUsUUFBMkM7UUFDdkUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsRUFBQyxZQUFZLEVBQUUsQ0FBQyxFQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDNUUsQ0FBQztJQUVELHNEQUFnQyxHQUFoQyxVQUFpQyxJQUFTLEVBQUUsS0FBVSxFQUFFLFFBQTJDO1FBQ2pHLElBQUksQ0FBQyxjQUFjLENBQUMsMEJBQTBCLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNsRixDQUFDO0lBRUQsZ0NBQVUsR0FBVixVQUFXLEtBQVUsRUFBRSxRQUEyQztRQUNoRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBRUQsNkJBQU8sR0FBUCxVQUFRLFVBQWMsRUFBRSxLQUFTO1FBRS9CLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QixJQUFJLFdBQVcsR0FBVyxLQUFLLENBQUM7WUFDaEMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ3RDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxZQUFZLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQzdDLFdBQVcsR0FBRyxJQUFJLENBQUM7Z0JBQ3JCLENBQUM7WUFDSCxDQUFDO1lBQ0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2dCQUNqQixJQUFJLE9BQU8sR0FBRyxJQUFJLGNBQWMsQ0FBQyxVQUFVLENBQUMsWUFBWSxFQUFFLFVBQVUsQ0FBQyxpQkFBaUIsRUFBRSxVQUFVLENBQUMsNkJBQTZCLENBQUMsQ0FBQztnQkFDbEksS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN0QixDQUFDO1lBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNmLENBQUM7UUFDRCxJQUFJLENBQUMsQ0FBQztZQUNKLElBQUksT0FBTyxHQUFHLElBQUksY0FBYyxDQUFDLFVBQVUsQ0FBQyxZQUFZLEVBQUUsVUFBVSxDQUFDLGlCQUFpQixFQUFFLFVBQVUsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1lBQ2xJLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDcEIsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNmLENBQUM7SUFDSCxDQUFDO0lBRUgsa0JBQUM7QUFBRCxDQTVEQSxBQTREQyxJQUFBO0FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUN6QixpQkFBUyxXQUFXLENBQUMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9zZXJ2aWNlcy9yb2xlLnNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUm9sZUNsYXNzTW9kZWwgPSByZXF1aXJlKFwiLi4vZGF0YWFjY2Vzcy9tb2RlbC9yb2xlLWNsYXNzLm1vZGVsXCIpO1xudmFyIGNvbmZpZyA9IHJlcXVpcmUoJ2NvbmZpZycpO1xuaW1wb3J0IENOZXh0TWVzc2FnZXMgPSByZXF1aXJlKFwiLi4vc2hhcmVkL2NuZXh0LW1lc3NhZ2VzXCIpO1xuaW1wb3J0IFByb2plY3RBc3NldCA9IHJlcXVpcmUoXCIuLi9zaGFyZWQvcHJvamVjdGFzc2V0XCIpO1xuaW1wb3J0IFJvbGVSZXBvc2l0b3J5ID0gcmVxdWlyZShcIi4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9yb2xlLnJlcG9zaXRvcnlcIik7XG5pbXBvcnQgSW5kdXN0cnlSZXBvc2l0b3J5ID0gcmVxdWlyZShcIi4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9pbmR1c3RyeS5yZXBvc2l0b3J5XCIpO1xuY2xhc3MgUm9sZVNlcnZpY2Uge1xuICBwcml2YXRlIHJvbGVSZXBvc2l0b3J5OiBSb2xlUmVwb3NpdG9yeTtcbiAgcHJpdmF0ZSBpbmR1c3RyeVJlcG9zaXRvcnk6IEluZHVzdHJ5UmVwb3NpdG9yeTtcbiAgQVBQX05BTUU6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJvbGVSZXBvc2l0b3J5ID0gbmV3IFJvbGVSZXBvc2l0b3J5KCk7XG4gICAgdGhpcy5pbmR1c3RyeVJlcG9zaXRvcnkgPSBuZXcgSW5kdXN0cnlSZXBvc2l0b3J5KCk7XG4gICAgdGhpcy5BUFBfTkFNRSA9IFByb2plY3RBc3NldC5BUFBfTkFNRTtcbiAgfVxuXG4gIHJldHJpZXZlKGZpZWxkOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcbiAgICB0aGlzLnJvbGVSZXBvc2l0b3J5LnJldHJpZXZlQWxsKHt9LCBjYWxsYmFjayk7XG4gIH1cblxuICBjcmVhdGUoaXRlbTogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XG4gICAgdGhpcy5yb2xlUmVwb3NpdG9yeS5jcmVhdGUoaXRlbSwgKGVyciwgcmVzKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihcIlByb2JsZW0gaW4gQ3JlYXRpbmcgcm9sZSBtb2RlbFwiKSwgbnVsbCk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJldHJpZXZlQnlNdWx0aUlkcyhpdGVtOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcbiAgICB0aGlzLnJvbGVSZXBvc2l0b3J5LnJldHJpZXZlQnlNdWx0aUlkcyhpdGVtLCB7Y2FwYWJpbGl0aWVzOiAwfSwgY2FsbGJhY2spO1xuICB9XG5cbiAgcmV0cmlldmVCeU11bHRpSWRzV2l0aENhcGFiaWxpdHkoaXRlbTogYW55LCBuYW1lczogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XG4gICAgdGhpcy5yb2xlUmVwb3NpdG9yeS5yZXRyaWV2ZUJ5TXVsdGlJZHNBbmROYW1lcyhpdGVtLCBuYW1lcywge19pZDogMH0sIGNhbGxiYWNrKTtcbiAgfVxuXG4gIGZpbmRCeU5hbWUoZmllbGQ6IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xuICAgIHRoaXMuaW5kdXN0cnlSZXBvc2l0b3J5LmZpbmRSb2xlcyhmaWVsZCwgY2FsbGJhY2spO1xuICB9XG5cbiAgYWRkUm9sZShjdXJyZW50Um93OmFueSwgcm9sZXM6YW55KSB7XG5cbiAgICBpZiAocm9sZXMubGVuZ3RoICE9IDApIHtcbiAgICAgIGxldCBpc1JvbGVGb3VuZCA6IGJvb2xlYW49ZmFsc2U7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChjdXJyZW50Um93LmFyZWFfb2Zfd29yayA9PSByb2xlc1tpXS5uYW1lKSB7XG4gICAgICAgICAgaXNSb2xlRm91bmQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoIWlzUm9sZUZvdW5kKSB7XG4gICAgICAgIGxldCBuZXdSb2xlID0gbmV3IFJvbGVDbGFzc01vZGVsKGN1cnJlbnRSb3cuYXJlYV9vZl93b3JrLCBjdXJyZW50Um93LmFyZWFfb2Zfd29ya19jb2RlLCBjdXJyZW50Um93LmFyZWFfb2Zfd29ya19kaXNwbGF5X3NlcXVlbmNlKTtcbiAgICAgICAgcm9sZXMucHVzaChuZXdSb2xlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByb2xlcztcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBsZXQgbmV3Um9sZSA9IG5ldyBSb2xlQ2xhc3NNb2RlbChjdXJyZW50Um93LmFyZWFfb2Zfd29yaywgY3VycmVudFJvdy5hcmVhX29mX3dvcmtfY29kZSwgY3VycmVudFJvdy5hcmVhX29mX3dvcmtfZGlzcGxheV9zZXF1ZW5jZSk7XG4gICAgICByb2xlcy5wdXNoKG5ld1JvbGUpO1xuICAgICAgcmV0dXJuIHJvbGVzO1xuICAgIH1cbiAgfVxuXG59XG5cbk9iamVjdC5zZWFsKFJvbGVTZXJ2aWNlKTtcbmV4cG9ydCA9IFJvbGVTZXJ2aWNlO1xuIl19
