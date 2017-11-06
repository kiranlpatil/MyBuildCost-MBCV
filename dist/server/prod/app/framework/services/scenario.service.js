"use strict";
var config = require('config');
var ProjectAsset = require("../shared/projectasset");
var ScenarioRepository = require("../dataaccess/repository/scenario.repository");
var ScenarioService = (function () {
    function ScenarioService() {
        this.scenarioRepository = new ScenarioRepository();
        this.APP_NAME = ProjectAsset.APP_NAME;
    }
    ScenarioService.prototype.retrieve = function (field, callback) {
        this.scenarioRepository.retrieveAll({}, callback);
    };
    ScenarioService.prototype.create = function (item, callback) {
        this.scenarioRepository.create(item, function (err, res) {
            if (err) {
                callback(new Error("Problem in Creating Scenario model"), null);
            }
            else {
                callback(null, res);
            }
        });
    };
    ScenarioService.prototype.retrieveByMultiIds = function (item, callback) {
        this.scenarioRepository.retrieveByMultiIds(item, {}, callback);
    };
    return ScenarioService;
}());
Object.seal(ScenarioService);
module.exports = ScenarioService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2VydmljZXMvc2NlbmFyaW8uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBRS9CLHFEQUF3RDtBQUN4RCxpRkFBb0Y7QUFDcEY7SUFJRTtRQUNFLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLGtCQUFrQixFQUFFLENBQUM7UUFDbkQsSUFBSSxDQUFDLFFBQVEsR0FBRyxZQUFZLENBQUMsUUFBUSxDQUFDO0lBQ3hDLENBQUM7SUFFRCxrQ0FBUSxHQUFSLFVBQVMsS0FBVSxFQUFFLFFBQTJDO1FBQzlELElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFFRCxnQ0FBTSxHQUFOLFVBQU8sSUFBUyxFQUFFLFFBQTJDO1FBQzNELElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFVBQUMsR0FBRyxFQUFFLEdBQUc7WUFDNUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDUixRQUFRLENBQUMsSUFBSSxLQUFLLENBQUMsb0NBQW9DLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNsRSxDQUFDO1lBQ0QsSUFBSSxDQUFDLENBQUM7Z0JBQ0osUUFBUSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztZQUN0QixDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsNENBQWtCLEdBQWxCLFVBQW1CLElBQVMsRUFBRSxRQUEyQztRQUN2RSxJQUFJLENBQUMsa0JBQWtCLENBQUMsa0JBQWtCLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNqRSxDQUFDO0lBRUgsc0JBQUM7QUFBRCxDQTVCQSxBQTRCQyxJQUFBO0FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUM3QixpQkFBUyxlQUFlLENBQUMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9zZXJ2aWNlcy9zY2VuYXJpby5zZXJ2aWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGNvbmZpZyA9IHJlcXVpcmUoJ2NvbmZpZycpO1xuaW1wb3J0IENOZXh0TWVzc2FnZXMgPSByZXF1aXJlKFwiLi4vc2hhcmVkL2NuZXh0LW1lc3NhZ2VzXCIpO1xuaW1wb3J0IFByb2plY3RBc3NldCA9IHJlcXVpcmUoXCIuLi9zaGFyZWQvcHJvamVjdGFzc2V0XCIpO1xuaW1wb3J0IFNjZW5hcmlvUmVwb3NpdG9yeSA9IHJlcXVpcmUoXCIuLi9kYXRhYWNjZXNzL3JlcG9zaXRvcnkvc2NlbmFyaW8ucmVwb3NpdG9yeVwiKTtcbmNsYXNzIFNjZW5hcmlvU2VydmljZSB7XG4gIHByaXZhdGUgc2NlbmFyaW9SZXBvc2l0b3J5OiBTY2VuYXJpb1JlcG9zaXRvcnk7XG4gIEFQUF9OQU1FOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zY2VuYXJpb1JlcG9zaXRvcnkgPSBuZXcgU2NlbmFyaW9SZXBvc2l0b3J5KCk7XG4gICAgdGhpcy5BUFBfTkFNRSA9IFByb2plY3RBc3NldC5BUFBfTkFNRTtcbiAgfVxuXG4gIHJldHJpZXZlKGZpZWxkOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcbiAgICB0aGlzLnNjZW5hcmlvUmVwb3NpdG9yeS5yZXRyaWV2ZUFsbCh7fSwgY2FsbGJhY2spO1xuICB9XG5cbiAgY3JlYXRlKGl0ZW06IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xuICAgIHRoaXMuc2NlbmFyaW9SZXBvc2l0b3J5LmNyZWF0ZShpdGVtLCAoZXJyLCByZXMpID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKFwiUHJvYmxlbSBpbiBDcmVhdGluZyBTY2VuYXJpbyBtb2RlbFwiKSwgbnVsbCk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJldHJpZXZlQnlNdWx0aUlkcyhpdGVtOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcbiAgICB0aGlzLnNjZW5hcmlvUmVwb3NpdG9yeS5yZXRyaWV2ZUJ5TXVsdGlJZHMoaXRlbSwge30sIGNhbGxiYWNrKTtcbiAgfVxuXG59XG5cbk9iamVjdC5zZWFsKFNjZW5hcmlvU2VydmljZSk7XG5leHBvcnQgPSBTY2VuYXJpb1NlcnZpY2U7XG4iXX0=
