"use strict";
var CapabilityClassModel = require("../dataaccess/model/capability-class.model");
var config = require('config');
var ProjectAsset = require("../shared/projectasset");
var CapabilityRepository = require("../dataaccess/repository/capability.repository");
var IndustryRepository = require("../dataaccess/repository/industry.repository");
var CapabilityService = (function () {
    function CapabilityService() {
        this.capabilityRepository = new CapabilityRepository();
        this.industryRepository = new IndustryRepository();
        this.APP_NAME = ProjectAsset.APP_NAME;
    }
    CapabilityService.prototype.retrieve = function (field, callback) {
        this.capabilityRepository.retrieveAll({}, callback);
    };
    CapabilityService.prototype.create = function (item, callback) {
        this.capabilityRepository.create(item, function (err, res) {
            if (err) {
                callback(new Error("Problem in Creating capability model"), null);
            }
            else {
                callback(null, res);
            }
        });
    };
    CapabilityService.prototype.retrieveByMultiIds = function (item, callback) {
        this.capabilityRepository.retrieveByMultiIds(item, { 'complexities': 0 }, callback);
    };
    CapabilityService.prototype.retrieveByMultiidsWithComplexity = function (item, names, callback) {
        this.capabilityRepository.retrieveByMultiIdsAndNames(item, names, { _id: 0 }, callback);
    };
    CapabilityService.prototype.findByName = function (field, callback) {
        this.industryRepository.findCapabilities(field, callback);
    };
    CapabilityService.prototype.addCapabilities = function (currentRow, capabilities) {
        if (capabilities.length != 0) {
            var isCapabilityFound = false;
            for (var i = 0; i < capabilities.length; i++) {
                if (currentRow.capability == capabilities[i].name) {
                    isCapabilityFound = true;
                }
            }
            if (!isCapabilityFound) {
                var newCapability = new CapabilityClassModel(currentRow.capability, currentRow.capability_code, currentRow.capability_display_sequence);
                if (currentRow['default_capability_for_aow'] == 'D') {
                    newCapability.code = 'd' + newCapability.code;
                }
                capabilities.push(newCapability);
            }
            return capabilities;
        }
        else {
            var newCapability = new CapabilityClassModel(currentRow.capability, currentRow.capability_code, currentRow.capability_display_sequence);
            if (currentRow['default_capability_for_aow'] == 'D') {
                newCapability.code = 'd' + newCapability.code;
            }
            capabilities.push(newCapability);
            return capabilities;
        }
    };
    return CapabilityService;
}());
Object.seal(CapabilityService);
module.exports = CapabilityService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2VydmljZXMvY2FwYWJpbGl0eS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxpRkFBb0Y7QUFDcEYsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBRS9CLHFEQUF3RDtBQUN4RCxxRkFBd0Y7QUFDeEYsaUZBQW9GO0FBQ3BGO0lBS0U7UUFDRSxJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxvQkFBb0IsRUFBRSxDQUFDO1FBQ3ZELElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLGtCQUFrQixFQUFFLENBQUM7UUFDbkQsSUFBSSxDQUFDLFFBQVEsR0FBRyxZQUFZLENBQUMsUUFBUSxDQUFDO0lBQ3hDLENBQUM7SUFFRCxvQ0FBUSxHQUFSLFVBQVMsS0FBVSxFQUFFLFFBQTJDO1FBQzlELElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFRCxrQ0FBTSxHQUFOLFVBQU8sSUFBUyxFQUFFLFFBQTJDO1FBQzNELElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFVBQUMsR0FBRyxFQUFFLEdBQUc7WUFDOUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDUixRQUFRLENBQUMsSUFBSSxLQUFLLENBQUMsc0NBQXNDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNwRSxDQUFDO1lBQ0QsSUFBSSxDQUFDLENBQUM7Z0JBQ0osUUFBUSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztZQUN0QixDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsOENBQWtCLEdBQWxCLFVBQW1CLElBQVMsRUFBRSxRQUEyQztRQUN2RSxJQUFJLENBQUMsb0JBQW9CLENBQUMsa0JBQWtCLENBQUMsSUFBSSxFQUFFLEVBQUMsY0FBYyxFQUFFLENBQUMsRUFBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3BGLENBQUM7SUFFRCw0REFBZ0MsR0FBaEMsVUFBaUMsSUFBUyxFQUFFLEtBQVUsRUFBRSxRQUEyQztRQUNqRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsMEJBQTBCLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUN4RixDQUFDO0lBRUQsc0NBQVUsR0FBVixVQUFXLEtBQVUsRUFBRSxRQUEyQztRQUNoRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFFRCwyQ0FBZSxHQUFmLFVBQWdCLFVBQWMsRUFBRSxZQUFnQjtRQUM5QyxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0IsSUFBSSxpQkFBaUIsR0FBYSxLQUFLLENBQUM7WUFDeEMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQzdDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxVQUFVLElBQUksWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ2xELGlCQUFpQixHQUFHLElBQUksQ0FBQztnQkFFM0IsQ0FBQztZQUNILENBQUM7WUFDRCxFQUFFLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztnQkFDdkIsSUFBSSxhQUFhLEdBQUcsSUFBSSxvQkFBb0IsQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxlQUFlLEVBQUUsVUFBVSxDQUFDLDJCQUEyQixDQUFDLENBQUM7Z0JBQ3hJLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyw0QkFBNEIsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ3BELGFBQWEsQ0FBQyxJQUFJLEdBQUcsR0FBRyxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUM7Z0JBQ2hELENBQUM7Z0JBQ0QsWUFBWSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUNuQyxDQUFDO1lBQ0QsTUFBTSxDQUFDLFlBQVksQ0FBQztRQUN0QixDQUFDO1FBQUEsSUFBSSxDQUFDLENBQUM7WUFDTCxJQUFJLGFBQWEsR0FBRyxJQUFJLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLGVBQWUsRUFBRSxVQUFVLENBQUMsMkJBQTJCLENBQUMsQ0FBQztZQUN4SSxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsNEJBQTRCLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNwRCxhQUFhLENBQUMsSUFBSSxHQUFHLEdBQUcsR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDO1lBQ2hELENBQUM7WUFDRCxZQUFZLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ2pDLE1BQU0sQ0FBQyxZQUFZLENBQUM7UUFDdEIsQ0FBQztJQUNILENBQUM7SUFDSCx3QkFBQztBQUFELENBaEVBLEFBZ0VDLElBQUE7QUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDL0IsaUJBQVMsaUJBQWlCLENBQUMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9zZXJ2aWNlcy9jYXBhYmlsaXR5LnNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ2FwYWJpbGl0eUNsYXNzTW9kZWwgPSByZXF1aXJlKFwiLi4vZGF0YWFjY2Vzcy9tb2RlbC9jYXBhYmlsaXR5LWNsYXNzLm1vZGVsXCIpO1xyXG52YXIgY29uZmlnID0gcmVxdWlyZSgnY29uZmlnJyk7XHJcbmltcG9ydCBDTmV4dE1lc3NhZ2VzID0gcmVxdWlyZShcIi4uL3NoYXJlZC9jbmV4dC1tZXNzYWdlc1wiKTtcclxuaW1wb3J0IFByb2plY3RBc3NldCA9IHJlcXVpcmUoXCIuLi9zaGFyZWQvcHJvamVjdGFzc2V0XCIpO1xyXG5pbXBvcnQgQ2FwYWJpbGl0eVJlcG9zaXRvcnkgPSByZXF1aXJlKFwiLi4vZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L2NhcGFiaWxpdHkucmVwb3NpdG9yeVwiKTtcclxuaW1wb3J0IEluZHVzdHJ5UmVwb3NpdG9yeSA9IHJlcXVpcmUoXCIuLi9kYXRhYWNjZXNzL3JlcG9zaXRvcnkvaW5kdXN0cnkucmVwb3NpdG9yeVwiKTtcclxuY2xhc3MgQ2FwYWJpbGl0eVNlcnZpY2Uge1xyXG4gIHByaXZhdGUgY2FwYWJpbGl0eVJlcG9zaXRvcnk6IENhcGFiaWxpdHlSZXBvc2l0b3J5O1xyXG4gIHByaXZhdGUgaW5kdXN0cnlSZXBvc2l0b3J5OiBJbmR1c3RyeVJlcG9zaXRvcnk7XHJcbiAgQVBQX05BTUU6IHN0cmluZztcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLmNhcGFiaWxpdHlSZXBvc2l0b3J5ID0gbmV3IENhcGFiaWxpdHlSZXBvc2l0b3J5KCk7XHJcbiAgICB0aGlzLmluZHVzdHJ5UmVwb3NpdG9yeSA9IG5ldyBJbmR1c3RyeVJlcG9zaXRvcnkoKTtcclxuICAgIHRoaXMuQVBQX05BTUUgPSBQcm9qZWN0QXNzZXQuQVBQX05BTUU7XHJcbiAgfVxyXG5cclxuICByZXRyaWV2ZShmaWVsZDogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0aGlzLmNhcGFiaWxpdHlSZXBvc2l0b3J5LnJldHJpZXZlQWxsKHt9LCBjYWxsYmFjayk7XHJcbiAgfVxyXG5cclxuICBjcmVhdGUoaXRlbTogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0aGlzLmNhcGFiaWxpdHlSZXBvc2l0b3J5LmNyZWF0ZShpdGVtLCAoZXJyLCByZXMpID0+IHtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihcIlByb2JsZW0gaW4gQ3JlYXRpbmcgY2FwYWJpbGl0eSBtb2RlbFwiKSwgbnVsbCk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZXRyaWV2ZUJ5TXVsdGlJZHMoaXRlbTogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0aGlzLmNhcGFiaWxpdHlSZXBvc2l0b3J5LnJldHJpZXZlQnlNdWx0aUlkcyhpdGVtLCB7J2NvbXBsZXhpdGllcyc6IDB9LCBjYWxsYmFjayk7XHJcbiAgfVxyXG5cclxuICByZXRyaWV2ZUJ5TXVsdGlpZHNXaXRoQ29tcGxleGl0eShpdGVtOiBhbnksIG5hbWVzOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIHRoaXMuY2FwYWJpbGl0eVJlcG9zaXRvcnkucmV0cmlldmVCeU11bHRpSWRzQW5kTmFtZXMoaXRlbSwgbmFtZXMsIHtfaWQ6IDB9LCBjYWxsYmFjayk7XHJcbiAgfVxyXG5cclxuICBmaW5kQnlOYW1lKGZpZWxkOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIHRoaXMuaW5kdXN0cnlSZXBvc2l0b3J5LmZpbmRDYXBhYmlsaXRpZXMoZmllbGQsIGNhbGxiYWNrKTtcclxuICB9XHJcblxyXG4gIGFkZENhcGFiaWxpdGllcyhjdXJyZW50Um93OmFueSwgY2FwYWJpbGl0aWVzOmFueSkge1xyXG4gICAgaWYgKGNhcGFiaWxpdGllcy5sZW5ndGggIT0gMCkge1xyXG4gICAgICBsZXQgaXNDYXBhYmlsaXR5Rm91bmQgOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2FwYWJpbGl0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGN1cnJlbnRSb3cuY2FwYWJpbGl0eSA9PSBjYXBhYmlsaXRpZXNbaV0ubmFtZSkge1xyXG4gICAgICAgICAgaXNDYXBhYmlsaXR5Rm91bmQgPSB0cnVlO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCFpc0NhcGFiaWxpdHlGb3VuZCkge1xyXG4gICAgICAgIHZhciBuZXdDYXBhYmlsaXR5ID0gbmV3IENhcGFiaWxpdHlDbGFzc01vZGVsKGN1cnJlbnRSb3cuY2FwYWJpbGl0eSwgY3VycmVudFJvdy5jYXBhYmlsaXR5X2NvZGUsIGN1cnJlbnRSb3cuY2FwYWJpbGl0eV9kaXNwbGF5X3NlcXVlbmNlKTtcclxuICAgICAgICBpZiAoY3VycmVudFJvd1snZGVmYXVsdF9jYXBhYmlsaXR5X2Zvcl9hb3cnXSA9PSAnRCcpIHtcclxuICAgICAgICAgIG5ld0NhcGFiaWxpdHkuY29kZSA9ICdkJyArIG5ld0NhcGFiaWxpdHkuY29kZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FwYWJpbGl0aWVzLnB1c2gobmV3Q2FwYWJpbGl0eSk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGNhcGFiaWxpdGllcztcclxuICAgIH1lbHNlIHtcclxuICAgICAgdmFyIG5ld0NhcGFiaWxpdHkgPSBuZXcgQ2FwYWJpbGl0eUNsYXNzTW9kZWwoY3VycmVudFJvdy5jYXBhYmlsaXR5LCBjdXJyZW50Um93LmNhcGFiaWxpdHlfY29kZSwgY3VycmVudFJvdy5jYXBhYmlsaXR5X2Rpc3BsYXlfc2VxdWVuY2UpO1xyXG4gICAgICBpZiAoY3VycmVudFJvd1snZGVmYXVsdF9jYXBhYmlsaXR5X2Zvcl9hb3cnXSA9PSAnRCcpIHtcclxuICAgICAgICBuZXdDYXBhYmlsaXR5LmNvZGUgPSAnZCcgKyBuZXdDYXBhYmlsaXR5LmNvZGU7XHJcbiAgICAgIH1cclxuICAgICAgY2FwYWJpbGl0aWVzLnB1c2gobmV3Q2FwYWJpbGl0eSk7XHJcbiAgICAgIHJldHVybiBjYXBhYmlsaXRpZXM7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5PYmplY3Quc2VhbChDYXBhYmlsaXR5U2VydmljZSk7XHJcbmV4cG9ydCA9IENhcGFiaWxpdHlTZXJ2aWNlO1xyXG4iXX0=
