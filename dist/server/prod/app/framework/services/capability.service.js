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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2VydmljZXMvY2FwYWJpbGl0eS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxpRkFBb0Y7QUFDcEYsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBRS9CLHFEQUF3RDtBQUN4RCxxRkFBd0Y7QUFDeEYsaUZBQW9GO0FBQ3BGO0lBS0U7UUFDRSxJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxvQkFBb0IsRUFBRSxDQUFDO1FBQ3ZELElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLGtCQUFrQixFQUFFLENBQUM7UUFDbkQsSUFBSSxDQUFDLFFBQVEsR0FBRyxZQUFZLENBQUMsUUFBUSxDQUFDO0lBQ3hDLENBQUM7SUFFRCxvQ0FBUSxHQUFSLFVBQVMsS0FBVSxFQUFFLFFBQTJDO1FBQzlELElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFRCxrQ0FBTSxHQUFOLFVBQU8sSUFBUyxFQUFFLFFBQTJDO1FBQzNELElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFVBQUMsR0FBRyxFQUFFLEdBQUc7WUFDOUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDUixRQUFRLENBQUMsSUFBSSxLQUFLLENBQUMsc0NBQXNDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNwRSxDQUFDO1lBQ0QsSUFBSSxDQUFDLENBQUM7Z0JBQ0osUUFBUSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztZQUN0QixDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsOENBQWtCLEdBQWxCLFVBQW1CLElBQVMsRUFBRSxRQUEyQztRQUN2RSxJQUFJLENBQUMsb0JBQW9CLENBQUMsa0JBQWtCLENBQUMsSUFBSSxFQUFFLEVBQUMsY0FBYyxFQUFFLENBQUMsRUFBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3BGLENBQUM7SUFFRCw0REFBZ0MsR0FBaEMsVUFBaUMsSUFBUyxFQUFFLEtBQVUsRUFBRSxRQUEyQztRQUNqRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsMEJBQTBCLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUN4RixDQUFDO0lBRUQsc0NBQVUsR0FBVixVQUFXLEtBQVUsRUFBRSxRQUEyQztRQUNoRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFFRCwyQ0FBZSxHQUFmLFVBQWdCLFVBQWMsRUFBRSxZQUFnQjtRQUM5QyxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0IsSUFBSSxpQkFBaUIsR0FBYSxLQUFLLENBQUM7WUFDeEMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQzdDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxVQUFVLElBQUksWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ2xELGlCQUFpQixHQUFHLElBQUksQ0FBQztnQkFFM0IsQ0FBQztZQUNILENBQUM7WUFDRCxFQUFFLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztnQkFDdkIsSUFBSSxhQUFhLEdBQUcsSUFBSSxvQkFBb0IsQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxlQUFlLEVBQUUsVUFBVSxDQUFDLDJCQUEyQixDQUFDLENBQUM7Z0JBQ3hJLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyw0QkFBNEIsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ3BELGFBQWEsQ0FBQyxJQUFJLEdBQUcsR0FBRyxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUM7Z0JBQ2hELENBQUM7Z0JBQ0QsWUFBWSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUNuQyxDQUFDO1lBQ0QsTUFBTSxDQUFDLFlBQVksQ0FBQztRQUN0QixDQUFDO1FBQUEsSUFBSSxDQUFDLENBQUM7WUFDTCxJQUFJLGFBQWEsR0FBRyxJQUFJLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLGVBQWUsRUFBRSxVQUFVLENBQUMsMkJBQTJCLENBQUMsQ0FBQztZQUN4SSxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsNEJBQTRCLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNwRCxhQUFhLENBQUMsSUFBSSxHQUFHLEdBQUcsR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDO1lBQ2hELENBQUM7WUFDRCxZQUFZLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ2pDLE1BQU0sQ0FBQyxZQUFZLENBQUM7UUFDdEIsQ0FBQztJQUNILENBQUM7SUFDSCx3QkFBQztBQUFELENBaEVBLEFBZ0VDLElBQUE7QUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDL0IsaUJBQVMsaUJBQWlCLENBQUMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9zZXJ2aWNlcy9jYXBhYmlsaXR5LnNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ2FwYWJpbGl0eUNsYXNzTW9kZWwgPSByZXF1aXJlKFwiLi4vZGF0YWFjY2Vzcy9tb2RlbC9jYXBhYmlsaXR5LWNsYXNzLm1vZGVsXCIpO1xudmFyIGNvbmZpZyA9IHJlcXVpcmUoJ2NvbmZpZycpO1xuaW1wb3J0IENOZXh0TWVzc2FnZXMgPSByZXF1aXJlKFwiLi4vc2hhcmVkL2NuZXh0LW1lc3NhZ2VzXCIpO1xuaW1wb3J0IFByb2plY3RBc3NldCA9IHJlcXVpcmUoXCIuLi9zaGFyZWQvcHJvamVjdGFzc2V0XCIpO1xuaW1wb3J0IENhcGFiaWxpdHlSZXBvc2l0b3J5ID0gcmVxdWlyZShcIi4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9jYXBhYmlsaXR5LnJlcG9zaXRvcnlcIik7XG5pbXBvcnQgSW5kdXN0cnlSZXBvc2l0b3J5ID0gcmVxdWlyZShcIi4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9pbmR1c3RyeS5yZXBvc2l0b3J5XCIpO1xuY2xhc3MgQ2FwYWJpbGl0eVNlcnZpY2Uge1xuICBwcml2YXRlIGNhcGFiaWxpdHlSZXBvc2l0b3J5OiBDYXBhYmlsaXR5UmVwb3NpdG9yeTtcbiAgcHJpdmF0ZSBpbmR1c3RyeVJlcG9zaXRvcnk6IEluZHVzdHJ5UmVwb3NpdG9yeTtcbiAgQVBQX05BTUU6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmNhcGFiaWxpdHlSZXBvc2l0b3J5ID0gbmV3IENhcGFiaWxpdHlSZXBvc2l0b3J5KCk7XG4gICAgdGhpcy5pbmR1c3RyeVJlcG9zaXRvcnkgPSBuZXcgSW5kdXN0cnlSZXBvc2l0b3J5KCk7XG4gICAgdGhpcy5BUFBfTkFNRSA9IFByb2plY3RBc3NldC5BUFBfTkFNRTtcbiAgfVxuXG4gIHJldHJpZXZlKGZpZWxkOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcbiAgICB0aGlzLmNhcGFiaWxpdHlSZXBvc2l0b3J5LnJldHJpZXZlQWxsKHt9LCBjYWxsYmFjayk7XG4gIH1cblxuICBjcmVhdGUoaXRlbTogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XG4gICAgdGhpcy5jYXBhYmlsaXR5UmVwb3NpdG9yeS5jcmVhdGUoaXRlbSwgKGVyciwgcmVzKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihcIlByb2JsZW0gaW4gQ3JlYXRpbmcgY2FwYWJpbGl0eSBtb2RlbFwiKSwgbnVsbCk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJldHJpZXZlQnlNdWx0aUlkcyhpdGVtOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcbiAgICB0aGlzLmNhcGFiaWxpdHlSZXBvc2l0b3J5LnJldHJpZXZlQnlNdWx0aUlkcyhpdGVtLCB7J2NvbXBsZXhpdGllcyc6IDB9LCBjYWxsYmFjayk7XG4gIH1cblxuICByZXRyaWV2ZUJ5TXVsdGlpZHNXaXRoQ29tcGxleGl0eShpdGVtOiBhbnksIG5hbWVzOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcbiAgICB0aGlzLmNhcGFiaWxpdHlSZXBvc2l0b3J5LnJldHJpZXZlQnlNdWx0aUlkc0FuZE5hbWVzKGl0ZW0sIG5hbWVzLCB7X2lkOiAwfSwgY2FsbGJhY2spO1xuICB9XG5cbiAgZmluZEJ5TmFtZShmaWVsZDogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XG4gICAgdGhpcy5pbmR1c3RyeVJlcG9zaXRvcnkuZmluZENhcGFiaWxpdGllcyhmaWVsZCwgY2FsbGJhY2spO1xuICB9XG5cbiAgYWRkQ2FwYWJpbGl0aWVzKGN1cnJlbnRSb3c6YW55LCBjYXBhYmlsaXRpZXM6YW55KSB7XG4gICAgaWYgKGNhcGFiaWxpdGllcy5sZW5ndGggIT0gMCkge1xuICAgICAgbGV0IGlzQ2FwYWJpbGl0eUZvdW5kIDogYm9vbGVhbiA9IGZhbHNlO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjYXBhYmlsaXRpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGN1cnJlbnRSb3cuY2FwYWJpbGl0eSA9PSBjYXBhYmlsaXRpZXNbaV0ubmFtZSkge1xuICAgICAgICAgIGlzQ2FwYWJpbGl0eUZvdW5kID0gdHJ1ZTtcblxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoIWlzQ2FwYWJpbGl0eUZvdW5kKSB7XG4gICAgICAgIHZhciBuZXdDYXBhYmlsaXR5ID0gbmV3IENhcGFiaWxpdHlDbGFzc01vZGVsKGN1cnJlbnRSb3cuY2FwYWJpbGl0eSwgY3VycmVudFJvdy5jYXBhYmlsaXR5X2NvZGUsIGN1cnJlbnRSb3cuY2FwYWJpbGl0eV9kaXNwbGF5X3NlcXVlbmNlKTtcbiAgICAgICAgaWYgKGN1cnJlbnRSb3dbJ2RlZmF1bHRfY2FwYWJpbGl0eV9mb3JfYW93J10gPT0gJ0QnKSB7XG4gICAgICAgICAgbmV3Q2FwYWJpbGl0eS5jb2RlID0gJ2QnICsgbmV3Q2FwYWJpbGl0eS5jb2RlO1xuICAgICAgICB9XG4gICAgICAgIGNhcGFiaWxpdGllcy5wdXNoKG5ld0NhcGFiaWxpdHkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNhcGFiaWxpdGllcztcbiAgICB9ZWxzZSB7XG4gICAgICB2YXIgbmV3Q2FwYWJpbGl0eSA9IG5ldyBDYXBhYmlsaXR5Q2xhc3NNb2RlbChjdXJyZW50Um93LmNhcGFiaWxpdHksIGN1cnJlbnRSb3cuY2FwYWJpbGl0eV9jb2RlLCBjdXJyZW50Um93LmNhcGFiaWxpdHlfZGlzcGxheV9zZXF1ZW5jZSk7XG4gICAgICBpZiAoY3VycmVudFJvd1snZGVmYXVsdF9jYXBhYmlsaXR5X2Zvcl9hb3cnXSA9PSAnRCcpIHtcbiAgICAgICAgbmV3Q2FwYWJpbGl0eS5jb2RlID0gJ2QnICsgbmV3Q2FwYWJpbGl0eS5jb2RlO1xuICAgICAgfVxuICAgICAgY2FwYWJpbGl0aWVzLnB1c2gobmV3Q2FwYWJpbGl0eSk7XG4gICAgICByZXR1cm4gY2FwYWJpbGl0aWVzO1xuICAgIH1cbiAgfVxufVxuXG5PYmplY3Quc2VhbChDYXBhYmlsaXR5U2VydmljZSk7XG5leHBvcnQgPSBDYXBhYmlsaXR5U2VydmljZTtcbiJdfQ==
