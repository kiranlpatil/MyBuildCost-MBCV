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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2VydmljZXMvY29tcGxleGl0eS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxpRkFBb0Y7QUFDcEYsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBRS9CLHFEQUF3RDtBQUN4RCxxRkFBd0Y7QUFDeEYsaUZBQW9GO0FBQ3BGLDZFQUFnRjtBQUNoRjtJQU1FO1FBQ0UsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksb0JBQW9CLEVBQUUsQ0FBQztRQUN2RCxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxrQkFBa0IsRUFBRSxDQUFDO1FBQ25ELElBQUksQ0FBQyxRQUFRLEdBQUcsWUFBWSxDQUFDLFFBQVEsQ0FBQztJQUN4QyxDQUFDO0lBRUQsb0NBQVEsR0FBUixVQUFTLEtBQVUsRUFBRSxRQUEyQztRQUM5RCxJQUFJLENBQUMsb0JBQW9CLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRUQsa0NBQU0sR0FBTixVQUFPLElBQVMsRUFBRSxRQUEyQztRQUMzRCxJQUFJLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxVQUFDLEdBQUcsRUFBRSxHQUFHO1lBQzlDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsUUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLHNDQUFzQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDcEUsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLFFBQVEsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDdEIsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELDhDQUFrQixHQUFsQixVQUFtQixJQUFTLEVBQUUsUUFBMkM7UUFDdkUsSUFBSSxDQUFDLG9CQUFvQixDQUFDLGtCQUFrQixDQUFDLElBQUksRUFBRSxFQUFD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RUFBRSxRQUFRLEdBQUcsQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUM7Z0JBQ3hELElBQUksT0FBTyxHQUFHLFVBQVUsR0FBRyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDckQsSUFBSSxXQUFXLEdBQXVCLElBQUksa0JBQWtCLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztnQkFDcEgsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUM1QixTQUFTLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUM5QixDQUFDO1lBQ0gsQ0FBQztZQUNELElBQUksQ0FBQyxHQUF1QixJQUFJLGtCQUFrQixDQUFDLGdCQUFnQixFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUM3RSxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLGFBQWEsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1lBQ3BDLFlBQVksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDakMsTUFBTSxDQUFDLFlBQVksQ0FBQztRQUN0QixDQUFDO0lBQ0gsQ0FBQztJQUVILHdCQUFDO0FBQUQsQ0E5RUEsQUE4RUMsSUFBQTtBQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUMvQixpQkFBUyxpQkFBaUIsQ0FBQyIsImZpbGUiOiJhcHAvZnJhbWV3b3JrL3NlcnZpY2VzL2NvbXBsZXhpdHkuc2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDb21wbGV4aXR5Q2xhc3NNb2RlbCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvY29tcGxleGl0eS1jbGFzcy5tb2RlbCcpO1xyXG52YXIgY29uZmlnID0gcmVxdWlyZSgnY29uZmlnJyk7XHJcbmltcG9ydCBDTmV4dE1lc3NhZ2VzID0gcmVxdWlyZSgnLi4vc2hhcmVkL2NuZXh0LW1lc3NhZ2VzJyk7XHJcbmltcG9ydCBQcm9qZWN0QXNzZXQgPSByZXF1aXJlKCcuLi9zaGFyZWQvcHJvamVjdGFzc2V0Jyk7XHJcbmltcG9ydCBDb21wbGV4aXR5UmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9jb21wbGV4aXR5LnJlcG9zaXRvcnknKTtcclxuaW1wb3J0IEluZHVzdHJ5UmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9pbmR1c3RyeS5yZXBvc2l0b3J5Jyk7XHJcbmltcG9ydCBTY2VuYXJpb0NsYXNzTW9kZWwgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3NjZW5hcmlvLWNsYXNzLm1vZGVsJyk7XHJcbmNsYXNzIENvbXBsZXhpdHlTZXJ2aWNlIHtcclxuICBwcml2YXRlIGNvbXBsZXhpdHlSZXBvc2l0b3J5OiBDb21wbGV4aXR5UmVwb3NpdG9yeTtcclxuICBwcml2YXRlIGluZHVzdHJ5UmVwb3NpdG9yeTogSW5kdXN0cnlSZXBvc2l0b3J5O1xyXG5cclxuICBBUFBfTkFNRTogc3RyaW5nO1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuY29tcGxleGl0eVJlcG9zaXRvcnkgPSBuZXcgQ29tcGxleGl0eVJlcG9zaXRvcnkoKTtcclxuICAgIHRoaXMuaW5kdXN0cnlSZXBvc2l0b3J5ID0gbmV3IEluZHVzdHJ5UmVwb3NpdG9yeSgpO1xyXG4gICAgdGhpcy5BUFBfTkFNRSA9IFByb2plY3RBc3NldC5BUFBfTkFNRTtcclxuICB9XHJcblxyXG4gIHJldHJpZXZlKGZpZWxkOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIHRoaXMuY29tcGxleGl0eVJlcG9zaXRvcnkucmV0cmlldmVBbGwoe30sIGNhbGxiYWNrKTtcclxuICB9XHJcblxyXG4gIGNyZWF0ZShpdGVtOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIHRoaXMuY29tcGxleGl0eVJlcG9zaXRvcnkuY3JlYXRlKGl0ZW0sIChlcnIsIHJlcykgPT4ge1xyXG4gICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKCdQcm9ibGVtIGluIENyZWF0aW5nIENvbXBsZXhpdHkgbW9kZWwnKSwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZXRyaWV2ZUJ5TXVsdGlJZHMoaXRlbTogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0aGlzLmNvbXBsZXhpdHlSZXBvc2l0b3J5LnJldHJpZXZlQnlNdWx0aUlkcyhpdGVtLCB7X2lkOiAwfSwgY2FsbGJhY2spO1xyXG4gIH1cclxuXHJcblxyXG4gIGZpbmRCeU5hbWUoZmllbGQ6IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgdGhpcy5pbmR1c3RyeVJlcG9zaXRvcnkuZmluZENvbXBsZXhpdGllcyhmaWVsZCwgY2FsbGJhY2spO1xyXG4gIH1cclxuXHJcbiAgYWRkQ29tcGxleGl0aWVzKGN1cnJlbnRSb3c6IGFueSwgY29tcGxleGl0aWVzOiBhbnkpIHtcclxuICAgIGlmIChjb21wbGV4aXRpZXMubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgIGxldCBpc0NvbXBsZXhpdHlGb3VuZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbXBsZXhpdGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmIChjdXJyZW50Um93LmNvbXBsZXhpdHkgPT09IGNvbXBsZXhpdGllc1tpXS5uYW1lKSB7XHJcbiAgICAgICAgICBpc0NvbXBsZXhpdHlGb3VuZCA9IHRydWU7XHJcbiAgICAgICAgICAvL2FkZFNjZW5hcmlvKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGlmICghaXNDb21wbGV4aXR5Rm91bmQpIHtcclxuICAgICAgICBsZXQgbmV3Q29tcGxleGl0eSA9IG5ldyBDb21wbGV4aXR5Q2xhc3NNb2RlbChjdXJyZW50Um93LmNvbXBsZXhpdHksIGN1cnJlbnRSb3cuY29tcGxleGl0eV9jb2RlLCBjdXJyZW50Um93LmNvbXBsZXhpdHlfZGlzcGxheV9zZXF1ZW5jZSwgY3VycmVudFJvdy5jb21wbGV4aXR5X3F1ZXN0aW9uX2Zvcl9wYXJ0aWNpcGFudCwgY3VycmVudFJvdy5jb21wbGV4aXR5X3F1ZXN0aW9uX2Zvcl9yZWNydWl0ZXIsIGN1cnJlbnRSb3cuaGVhZGVyX3F1ZXN0aW9uX2Zvcl9jYXBhYmlsaXR5X2NhbmRpZGF0ZSwgY3VycmVudFJvdy5oZWFkZXJfcXVlc3Rpb25fZm9yX2NhcGFiaWxpdHlfcmVjcnVpdGVyKTtcclxuICAgICAgICBsZXQgc2NlbmFyaW9zOiBTY2VuYXJpb0NsYXNzTW9kZWxbXSA9IG5ldyBBcnJheSgwKTtcclxuICAgICAgICAgIGZvciAobGV0IHNjZUluZGV4OiBudW1iZXIgPSAwOyBzY2VJbmRleCA8IDU7IHNjZUluZGV4KyspIHtcclxuICAgICAgICAgICAgbGV0IHNjZU5hbWUgPSAnU2NlbmFyaW8nICsgKHNjZUluZGV4ICsgMSkudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgbGV0IG5ld1NjZW5hcmlvOiBTY2VuYXJpb0NsYXNzTW9kZWwgPSBuZXcgU2NlbmFyaW9DbGFzc01vZGVsKGN1cnJlbnRSb3dbc2NlTmFtZV0sICgoc2NlSW5kZXggKyAxKSAqIDEwKS50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgaWYgKG5ld1NjZW5hcmlvLm5hbWUgIT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgc2NlbmFyaW9zLnB1c2gobmV3U2NlbmFyaW8pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgbGV0IHM6IFNjZW5hcmlvQ2xhc3NNb2RlbCA9IG5ldyBTY2VuYXJpb0NsYXNzTW9kZWwoJ05vdCBBcHBsaWNhYmxlJywgJycgKyAwKTtcclxuICAgICAgICBzY2VuYXJpb3MucHVzaChzKTtcclxuICAgICAgICBuZXdDb21wbGV4aXR5LnNjZW5hcmlvcyA9IHNjZW5hcmlvcztcclxuICAgICAgICBjb21wbGV4aXRpZXMucHVzaChuZXdDb21wbGV4aXR5KTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gY29tcGxleGl0aWVzO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdmFyIG5ld0NvbXBsZXhpdHkgPSBuZXcgQ29tcGxleGl0eUNsYXNzTW9kZWwoY3VycmVudFJvdy5jb21wbGV4aXR5LCBjdXJyZW50Um93LmNvbXBsZXhpdHlfY29kZSwgY3VycmVudFJvdy5jb21wbGV4aXR5X2Rpc3BsYXlfc2VxdWVuY2UsIGN1cnJlbnRSb3cuY29tcGxleGl0eV9xdWVzdGlvbl9mb3JfcGFydGljaXBhbnQsIGN1cnJlbnRSb3cuY29tcGxleGl0eV9xdWVzdGlvbl9mb3JfcmVjcnVpdGVyLCBjdXJyZW50Um93LmhlYWRlcl9xdWVzdGlvbl9mb3JfY2FwYWJpbGl0eV9jYW5kaWRhdGUsIGN1cnJlbnRSb3cuaGVhZGVyX3F1ZXN0aW9uX2Zvcl9jYXBhYmlsaXR5X3JlY3J1aXRlcik7XHJcbiAgICAgIGxldCBzY2VuYXJpb3M6IFNjZW5hcmlvQ2xhc3NNb2RlbFtdID0gbmV3IEFycmF5KDApO1xyXG4gICAgICBmb3IgKGxldCBzY2VJbmRleDogbnVtYmVyID0gMDsgc2NlSW5kZXggPCA1OyBzY2VJbmRleCsrKSB7XHJcbiAgICAgICAgbGV0IHNjZU5hbWUgPSAnU2NlbmFyaW8nICsgKHNjZUluZGV4ICsgMSkudG9TdHJpbmcoKTtcclxuICAgICAgICBsZXQgbmV3U2NlbmFyaW86IFNjZW5hcmlvQ2xhc3NNb2RlbCA9IG5ldyBTY2VuYXJpb0NsYXNzTW9kZWwoY3VycmVudFJvd1tzY2VOYW1lXSwgKChzY2VJbmRleCArIDEpICogMTApLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIGlmIChuZXdTY2VuYXJpby5uYW1lICE9PSAnJykge1xyXG4gICAgICAgICAgc2NlbmFyaW9zLnB1c2gobmV3U2NlbmFyaW8pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBsZXQgczogU2NlbmFyaW9DbGFzc01vZGVsID0gbmV3IFNjZW5hcmlvQ2xhc3NNb2RlbCgnTm90IEFwcGxpY2FibGUnLCAnJyArIDApO1xyXG4gICAgICBzY2VuYXJpb3MucHVzaChzKTtcclxuICAgICAgbmV3Q29tcGxleGl0eS5zY2VuYXJpb3MgPSBzY2VuYXJpb3M7XHJcbiAgICAgIGNvbXBsZXhpdGllcy5wdXNoKG5ld0NvbXBsZXhpdHkpO1xyXG4gICAgICByZXR1cm4gY29tcGxleGl0aWVzO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbn1cclxuXHJcbk9iamVjdC5zZWFsKENvbXBsZXhpdHlTZXJ2aWNlKTtcclxuZXhwb3J0ID0gQ29tcGxleGl0eVNlcnZpY2U7XHJcbiJdfQ==
