"use strict";
var ComplexityClassModel = require("../dataaccess/model/complexity-class.model");
var config = require('config');
var ProjectAsset = require("../shared/projectasset");
var ComplexityRepository = require("../dataaccess/repository/complexity.repository");
var IndustryRepository = require("../dataaccess/repository/industry.repository");
var ScenarioClassModel = require("../dataaccess/model/scenario-class.model");
var ComplexityService = (function () {
    function ComplexityService() {
        this.complexityRepository = new ComplexityRepository();
        this.industryRepository = new IndustryRepository();
        this.APP_NAME = ProjectAsset.APP_NAME;
    }
    ComplexityService.prototype.retrieve = function (field, callback) {
        this.complexityRepository.retrieveAll({}, callback);
    };
    ComplexityService.prototype.create = function (item, callback) {
        this.complexityRepository.create(item, function (err, res) {
            if (err) {
                callback(new Error('Problem in Creating Complexity model'), null);
            }
            else {
                callback(null, res);
            }
        });
    };
    ComplexityService.prototype.retrieveByMultiIds = function (item, callback) {
        this.complexityRepository.retrieveByMultiIds(item, { _id: 0 }, callback);
    };
    ComplexityService.prototype.findByName = function (field, callback) {
        this.industryRepository.findComplexities(field, callback);
    };
    ComplexityService.prototype.addComplexities = function (currentRow, complexities) {
        if (complexities.length !== 0) {
            var isComplexityFound = false;
            for (var i = 0; i < complexities.length; i++) {
                if (currentRow.complexity === complexities[i].name) {
                    isComplexityFound = true;
                }
            }
            if (!isComplexityFound) {
                var newComplexity_1 = new ComplexityClassModel(currentRow.complexity, currentRow.complexity_code, currentRow.complexity_display_sequence, currentRow.complexity_question_for_participant, currentRow.complexity_question_for_recruiter, currentRow.header_question_for_capability_candidate, currentRow.header_question_for_capability_recruiter);
                var scenarios = new Array(0);
                for (var sceIndex = 0; sceIndex < 5; sceIndex++) {
                    var sceName = 'Scenario' + (sceIndex + 1).toString();
                    var newScenario = new ScenarioClassModel(currentRow[sceName], ((sceIndex + 1) * 10).toString());
                    if (newScenario.name !== '') {
                        scenarios.push(newScenario);
                    }
                }
                var s = new ScenarioClassModel('Not Applicable', '' + 0);
                scenarios.push(s);
                newComplexity_1.scenarios = scenarios;
                complexities.push(newComplexity_1);
            }
            return complexities;
        }
        else {
            var newComplexity = new ComplexityClassModel(currentRow.complexity, currentRow.complexity_code, currentRow.complexity_display_sequence, currentRow.complexity_question_for_participant, currentRow.complexity_question_for_recruiter, currentRow.header_question_for_capability_candidate, currentRow.header_question_for_capability_recruiter);
            var scenarios = new Array(0);
            for (var sceIndex = 0; sceIndex < 5; sceIndex++) {
                var sceName = 'Scenario' + (sceIndex + 1).toString();
                var newScenario = new ScenarioClassModel(currentRow[sceName], ((sceIndex + 1) * 10).toString());
                if (newScenario.name !== '') {
                    scenarios.push(newScenario);
                }
            }
            var s = new ScenarioClassModel('Not Applicable', '' + 0);
            scenarios.push(s);
            newComplexity.scenarios = scenarios;
            complexities.push(newComplexity);
            return complexities;
        }
    };
    return ComplexityService;
}());
Object.seal(ComplexityService);
module.exports = ComplexityService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2VydmljZXMvY29tcGxleGl0eS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxpRkFBb0Y7QUFDcEYsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBRS9CLHFEQUF3RDtBQUN4RCxxRkFBd0Y7QUFDeEYsaUZBQW9GO0FBQ3BGLDZFQUFnRjtBQUNoRjtJQU1FO1FBQ0UsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksb0JBQW9CLEVBQUUsQ0FBQztRQUN2RCxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxrQkFBa0IsRUFBRSxDQUFDO1FBQ25ELElBQUksQ0FBQyxRQUFRLEdBQUcsWUFBWSxDQUFDLFFBQVEsQ0FBQztJQUN4QyxDQUFDO0lBRUQsb0NBQVEsR0FBUixVQUFTLEtBQVUsRUFBRSxRQUEyQztRQUM5RCxJQUFJLENBQUMsb0JBQW9CLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRUQsa0NBQU0sR0FBTixVQUFPLElBQVMsRUFBRSxRQUEyQztRQUMzRCxJQUFJLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxVQUFDLEdBQUcsRUFBRSxHQUFHO1lBQzlDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsUUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLHNDQUFzQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDcEUsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLFFBQVEsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDdEIsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELDhDQUFrQixHQUFsQixVQUFtQixJQUFTLEVBQUUsUUFBMkM7UUFDdkUsSUFBSSxDQUFDLG9CQUFvQixDQUFDLGtCQUFrQixDQUFDLElBQUksRUFBRSxFQUFD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RUFBRSxRQUFRLEdBQUcsQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUM7Z0JBQ3hELElBQUksT0FBTyxHQUFHLFVBQVUsR0FBRyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDckQsSUFBSSxXQUFXLEdBQXVCLElBQUksa0JBQWtCLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztnQkFDcEgsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUM1QixTQUFTLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUM5QixDQUFDO1lBQ0gsQ0FBQztZQUNELElBQUksQ0FBQyxHQUF1QixJQUFJLGtCQUFrQixDQUFDLGdCQUFnQixFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUM3RSxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLGFBQWEsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1lBQ3BDLFlBQVksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDakMsTUFBTSxDQUFDLFlBQVksQ0FBQztRQUN0QixDQUFDO0lBQ0gsQ0FBQztJQUVILHdCQUFDO0FBQUQsQ0E5RUEsQUE4RUMsSUFBQTtBQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUMvQixpQkFBUyxpQkFBaUIsQ0FBQyIsImZpbGUiOiJhcHAvZnJhbWV3b3JrL3NlcnZpY2VzL2NvbXBsZXhpdHkuc2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDb21wbGV4aXR5Q2xhc3NNb2RlbCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvY29tcGxleGl0eS1jbGFzcy5tb2RlbCcpO1xudmFyIGNvbmZpZyA9IHJlcXVpcmUoJ2NvbmZpZycpO1xuaW1wb3J0IENOZXh0TWVzc2FnZXMgPSByZXF1aXJlKCcuLi9zaGFyZWQvY25leHQtbWVzc2FnZXMnKTtcbmltcG9ydCBQcm9qZWN0QXNzZXQgPSByZXF1aXJlKCcuLi9zaGFyZWQvcHJvamVjdGFzc2V0Jyk7XG5pbXBvcnQgQ29tcGxleGl0eVJlcG9zaXRvcnkgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL3JlcG9zaXRvcnkvY29tcGxleGl0eS5yZXBvc2l0b3J5Jyk7XG5pbXBvcnQgSW5kdXN0cnlSZXBvc2l0b3J5ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L2luZHVzdHJ5LnJlcG9zaXRvcnknKTtcbmltcG9ydCBTY2VuYXJpb0NsYXNzTW9kZWwgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3NjZW5hcmlvLWNsYXNzLm1vZGVsJyk7XG5jbGFzcyBDb21wbGV4aXR5U2VydmljZSB7XG4gIHByaXZhdGUgY29tcGxleGl0eVJlcG9zaXRvcnk6IENvbXBsZXhpdHlSZXBvc2l0b3J5O1xuICBwcml2YXRlIGluZHVzdHJ5UmVwb3NpdG9yeTogSW5kdXN0cnlSZXBvc2l0b3J5O1xuXG4gIEFQUF9OQU1FOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5jb21wbGV4aXR5UmVwb3NpdG9yeSA9IG5ldyBDb21wbGV4aXR5UmVwb3NpdG9yeSgpO1xuICAgIHRoaXMuaW5kdXN0cnlSZXBvc2l0b3J5ID0gbmV3IEluZHVzdHJ5UmVwb3NpdG9yeSgpO1xuICAgIHRoaXMuQVBQX05BTUUgPSBQcm9qZWN0QXNzZXQuQVBQX05BTUU7XG4gIH1cblxuICByZXRyaWV2ZShmaWVsZDogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XG4gICAgdGhpcy5jb21wbGV4aXR5UmVwb3NpdG9yeS5yZXRyaWV2ZUFsbCh7fSwgY2FsbGJhY2spO1xuICB9XG5cbiAgY3JlYXRlKGl0ZW06IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xuICAgIHRoaXMuY29tcGxleGl0eVJlcG9zaXRvcnkuY3JlYXRlKGl0ZW0sIChlcnIsIHJlcykgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoJ1Byb2JsZW0gaW4gQ3JlYXRpbmcgQ29tcGxleGl0eSBtb2RlbCcpLCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHJlcyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICByZXRyaWV2ZUJ5TXVsdGlJZHMoaXRlbTogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XG4gICAgdGhpcy5jb21wbGV4aXR5UmVwb3NpdG9yeS5yZXRyaWV2ZUJ5TXVsdGlJZHMoaXRlbSwge19pZDogMH0sIGNhbGxiYWNrKTtcbiAgfVxuXG5cbiAgZmluZEJ5TmFtZShmaWVsZDogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XG4gICAgdGhpcy5pbmR1c3RyeVJlcG9zaXRvcnkuZmluZENvbXBsZXhpdGllcyhmaWVsZCwgY2FsbGJhY2spO1xuICB9XG5cbiAgYWRkQ29tcGxleGl0aWVzKGN1cnJlbnRSb3c6IGFueSwgY29tcGxleGl0aWVzOiBhbnkpIHtcbiAgICBpZiAoY29tcGxleGl0aWVzLmxlbmd0aCAhPT0gMCkge1xuICAgICAgbGV0IGlzQ29tcGxleGl0eUZvdW5kOiBib29sZWFuID0gZmFsc2U7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbXBsZXhpdGllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoY3VycmVudFJvdy5jb21wbGV4aXR5ID09PSBjb21wbGV4aXRpZXNbaV0ubmFtZSkge1xuICAgICAgICAgIGlzQ29tcGxleGl0eUZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAvL2FkZFNjZW5hcmlvKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICghaXNDb21wbGV4aXR5Rm91bmQpIHtcbiAgICAgICAgbGV0IG5ld0NvbXBsZXhpdHkgPSBuZXcgQ29tcGxleGl0eUNsYXNzTW9kZWwoY3VycmVudFJvdy5jb21wbGV4aXR5LCBjdXJyZW50Um93LmNvbXBsZXhpdHlfY29kZSwgY3VycmVudFJvdy5jb21wbGV4aXR5X2Rpc3BsYXlfc2VxdWVuY2UsIGN1cnJlbnRSb3cuY29tcGxleGl0eV9xdWVzdGlvbl9mb3JfcGFydGljaXBhbnQsIGN1cnJlbnRSb3cuY29tcGxleGl0eV9xdWVzdGlvbl9mb3JfcmVjcnVpdGVyLCBjdXJyZW50Um93LmhlYWRlcl9xdWVzdGlvbl9mb3JfY2FwYWJpbGl0eV9jYW5kaWRhdGUsIGN1cnJlbnRSb3cuaGVhZGVyX3F1ZXN0aW9uX2Zvcl9jYXBhYmlsaXR5X3JlY3J1aXRlcik7XG4gICAgICAgIGxldCBzY2VuYXJpb3M6IFNjZW5hcmlvQ2xhc3NNb2RlbFtdID0gbmV3IEFycmF5KDApO1xuICAgICAgICAgIGZvciAobGV0IHNjZUluZGV4OiBudW1iZXIgPSAwOyBzY2VJbmRleCA8IDU7IHNjZUluZGV4KyspIHtcbiAgICAgICAgICAgIGxldCBzY2VOYW1lID0gJ1NjZW5hcmlvJyArIChzY2VJbmRleCArIDEpLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICBsZXQgbmV3U2NlbmFyaW86IFNjZW5hcmlvQ2xhc3NNb2RlbCA9IG5ldyBTY2VuYXJpb0NsYXNzTW9kZWwoY3VycmVudFJvd1tzY2VOYW1lXSwgKChzY2VJbmRleCArIDEpICogMTApLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgaWYgKG5ld1NjZW5hcmlvLm5hbWUgIT09ICcnKSB7XG4gICAgICAgICAgICAgIHNjZW5hcmlvcy5wdXNoKG5ld1NjZW5hcmlvKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIGxldCBzOiBTY2VuYXJpb0NsYXNzTW9kZWwgPSBuZXcgU2NlbmFyaW9DbGFzc01vZGVsKCdOb3QgQXBwbGljYWJsZScsICcnICsgMCk7XG4gICAgICAgIHNjZW5hcmlvcy5wdXNoKHMpO1xuICAgICAgICBuZXdDb21wbGV4aXR5LnNjZW5hcmlvcyA9IHNjZW5hcmlvcztcbiAgICAgICAgY29tcGxleGl0aWVzLnB1c2gobmV3Q29tcGxleGl0eSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29tcGxleGl0aWVzO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgbmV3Q29tcGxleGl0eSA9IG5ldyBDb21wbGV4aXR5Q2xhc3NNb2RlbChjdXJyZW50Um93LmNvbXBsZXhpdHksIGN1cnJlbnRSb3cuY29tcGxleGl0eV9jb2RlLCBjdXJyZW50Um93LmNvbXBsZXhpdHlfZGlzcGxheV9zZXF1ZW5jZSwgY3VycmVudFJvdy5jb21wbGV4aXR5X3F1ZXN0aW9uX2Zvcl9wYXJ0aWNpcGFudCwgY3VycmVudFJvdy5jb21wbGV4aXR5X3F1ZXN0aW9uX2Zvcl9yZWNydWl0ZXIsIGN1cnJlbnRSb3cuaGVhZGVyX3F1ZXN0aW9uX2Zvcl9jYXBhYmlsaXR5X2NhbmRpZGF0ZSwgY3VycmVudFJvdy5oZWFkZXJfcXVlc3Rpb25fZm9yX2NhcGFiaWxpdHlfcmVjcnVpdGVyKTtcbiAgICAgIGxldCBzY2VuYXJpb3M6IFNjZW5hcmlvQ2xhc3NNb2RlbFtdID0gbmV3IEFycmF5KDApO1xuICAgICAgZm9yIChsZXQgc2NlSW5kZXg6IG51bWJlciA9IDA7IHNjZUluZGV4IDwgNTsgc2NlSW5kZXgrKykge1xuICAgICAgICBsZXQgc2NlTmFtZSA9ICdTY2VuYXJpbycgKyAoc2NlSW5kZXggKyAxKS50b1N0cmluZygpO1xuICAgICAgICBsZXQgbmV3U2NlbmFyaW86IFNjZW5hcmlvQ2xhc3NNb2RlbCA9IG5ldyBTY2VuYXJpb0NsYXNzTW9kZWwoY3VycmVudFJvd1tzY2VOYW1lXSwgKChzY2VJbmRleCArIDEpICogMTApLnRvU3RyaW5nKCkpO1xuICAgICAgICBpZiAobmV3U2NlbmFyaW8ubmFtZSAhPT0gJycpIHtcbiAgICAgICAgICBzY2VuYXJpb3MucHVzaChuZXdTY2VuYXJpbyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxldCBzOiBTY2VuYXJpb0NsYXNzTW9kZWwgPSBuZXcgU2NlbmFyaW9DbGFzc01vZGVsKCdOb3QgQXBwbGljYWJsZScsICcnICsgMCk7XG4gICAgICBzY2VuYXJpb3MucHVzaChzKTtcbiAgICAgIG5ld0NvbXBsZXhpdHkuc2NlbmFyaW9zID0gc2NlbmFyaW9zO1xuICAgICAgY29tcGxleGl0aWVzLnB1c2gobmV3Q29tcGxleGl0eSk7XG4gICAgICByZXR1cm4gY29tcGxleGl0aWVzO1xuICAgIH1cbiAgfVxuXG59XG5cbk9iamVjdC5zZWFsKENvbXBsZXhpdHlTZXJ2aWNlKTtcbmV4cG9ydCA9IENvbXBsZXhpdHlTZXJ2aWNlO1xuIl19
