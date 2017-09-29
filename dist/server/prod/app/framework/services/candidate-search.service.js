"use strict";
var RecruiterRepository = require("../dataaccess/repository/recruiter.repository");
var CandidateRepository = require("../dataaccess/repository/candidate.repository");
var CandidateInfoSearch = require("../dataaccess/model/candidate-info-search");
var CandidateSearchService = (function () {
    function CandidateSearchService() {
        this.recruiterRepository = new RecruiterRepository();
        this.candidateRepository = new CandidateRepository();
    }
    CandidateSearchService.prototype.searchMatchingJobProfile = function (candidate, recruiterId, searchView, callback) {
        var _this = this;
        var currentDate = new Date();
        var data = {
            '_id': recruiterId,
            'postedJobs.industry.name': candidate.industry.name,
            'postedJobs.proficiencies': { $in: candidate.proficiencies }
        };
        var excluded_fields = {
            'postedJobs.industry.roles': 0,
        };
        this.recruiterRepository.retrieveWithLean(data, excluded_fields, function (err, res) {
            if (err) {
                callback(err, null);
            }
            else {
                _this.recruiterRepository.getJobProfileQCard(res, candidate, undefined, searchView, callback);
            }
        });
    };
    CandidateSearchService.prototype.getCandidateInfo = function (userId, callback) {
        this.candidateRepository.retrieveByMultiRefrenceIdsAndPopulate(userId, { capability_matrix: 0 }, function (err, result) {
            if (err) {
                callback(err, null);
            }
            else {
                callback(null, result);
            }
        });
    };
    CandidateSearchService.prototype.getCandidateInfoById = function (id, callback) {
        this.candidateRepository.retrieveByMultiIdsAndPopulate(id, { capability_matrix: 0 }, function (err, result) {
            if (err) {
                callback(err, null);
            }
            else {
                callback(null, result);
            }
        });
    };
    CandidateSearchService.prototype.buidResultOnCandidateSearch = function (dataArray) {
        var searchResult = new Array(0);
        for (var _i = 0, dataArray_1 = dataArray; _i < dataArray_1.length; _i++) {
            var obj = dataArray_1[_i];
            if (obj.isCompleted) {
                var data = new CandidateInfoSearch();
                data.first_name = obj.userId.first_name;
                data.last_name = obj.userId.last_name;
                data.id = obj._id;
                data.location = obj.location;
                data.currentCompany = obj.professionalDetails.currentCompany;
                data.designation = obj.jobTitle;
                data.display_string = data.first_name + " " + data.last_name + " " + obj.jobTitle + " " + obj.professionalDetails.currentCompany;
                searchResult.push(data);
            }
        }
        return searchResult;
    };
    return CandidateSearchService;
}());
Object.seal(CandidateSearchService);
module.exports = CandidateSearchService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2VydmljZXMvY2FuZGlkYXRlLXNlYXJjaC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSxtRkFBc0Y7QUFDdEYsbUZBQXNGO0FBQ3RGLCtFQUFrRjtBQUVsRjtJQUtFO1FBQ0UsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksbUJBQW1CLEVBQUUsQ0FBQztRQUNyRCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxtQkFBbUIsRUFBRSxDQUFDO0lBQ3ZELENBQUM7SUFFRCx5REFBd0IsR0FBeEIsVUFBeUIsU0FBd0IsRUFBRSxXQUFrQixFQUFFLFVBQWlCLEVBQUUsUUFBd0M7UUFBbEksaUJBa0JDO1FBaEJDLElBQUksV0FBVyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7UUFDN0IsSUFBSSxJQUFJLEdBQUc7WUFDVCxLQUFLLEVBQUUsV0FBVztZQUNsQiwwQkFBMEIsRUFBRSxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUk7WUFDbkQsMEJBQTBCLEVBQUUsRUFBQyxHQUFHLEVBQUUsU0FBUyxDQUFDLGFBQWEsRUFBQztTQUMzRCxDQUFDO1FBQ0YsSUFBSSxlQUFlLEdBQUc7WUFDcEIsMkJBQTJCLEVBQUUsQ0FBQztTQUMvQixDQUFDO1FBQ0YsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxlQUFlLEVBQUUsVUFBQyxHQUFHLEVBQUUsR0FBRztZQUN4RSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNSLFFBQVEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDdEIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLEtBQUksQ0FBQyxtQkFBbUIsQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDL0YsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUdELGlEQUFnQixHQUFoQixVQUFpQixNQUFlLEVBQUUsUUFBd0M7UUFDeEUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLHFDQUFxQyxDQUFDLE1BQU0sRUFBRSxFQUFDLGlCQUFpQixFQUFFLENBQUMsRUFBQyxFQUFFLFVBQUMsR0FBRyxFQUFFLE1BQU07WUFDekcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDUixRQUFRLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3RCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixRQUFRLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ3pCLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFHRCxxREFBb0IsR0FBcEIsVUFBcUIsRUFBVyxFQUFFLFFBQXdDO1FBQ3hFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyw2QkFBNkIsQ0FBQyxFQUFFLEVBQUUsRUFBQyxpQkFBaUIsRUFBRSxDQUFDLEVBQUMsRUFBRSxVQUFDLEdBQUcsRUFBRSxNQUFNO1lBQzdGLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsUUFBUSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN0QixDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04sUUFBUSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztZQUN6QixDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsNERBQTJCLEdBQTNCLFVBQTRCLFNBQTBCO1FBQ3BELElBQUksWUFBWSxHQUF5QixJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0RCxHQUFHLENBQUMsQ0FBWSxVQUFTLEVBQVQsdUJBQVMsRUFBVCx1QkFBUyxFQUFULElBQVM7WUFBcEIsSUFBSSxHQUFHLGtCQUFBO1lBQ1YsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLElBQUksSUFBSSxHQUF1QixJQUFJLG1CQUFtQixFQUFFLENBQUM7Z0JBQ3pELElBQUksQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7Z0JBQ3hDLElBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7Z0JBQ3RDLElBQUksQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQztnQkFDbEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDO2dCQUM3QixJQUFJLENBQUMsY0FBYyxHQUFHLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxjQUFjLENBQUM7Z0JBQzdELElBQUksQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQztnQkFDaEMsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsVUFBVSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsUUFBUSxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsbUJBQW1CLENBQUMsY0FBYyxDQUFDO2dCQUNqSSxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzFCLENBQUM7U0FDRjtRQUNELE1BQU0sQ0FBQyxZQUFZLENBQUM7SUFDdEIsQ0FBQztJQUVILDZCQUFDO0FBQUQsQ0F0RUEsQUFzRUMsSUFBQTtBQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQztBQUNwQyxpQkFBUyxzQkFBc0IsQ0FBQyIsImZpbGUiOiJhcHAvZnJhbWV3b3JrL3NlcnZpY2VzL2NhbmRpZGF0ZS1zZWFyY2guc2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDYW5kaWRhdGVNb2RlbCA9IHJlcXVpcmUoXCIuLi9kYXRhYWNjZXNzL21vZGVsL2NhbmRpZGF0ZS5tb2RlbFwiKTtcbmltcG9ydCBSZWNydWl0ZXJSZXBvc2l0b3J5ID0gcmVxdWlyZShcIi4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9yZWNydWl0ZXIucmVwb3NpdG9yeVwiKTtcbmltcG9ydCBDYW5kaWRhdGVSZXBvc2l0b3J5ID0gcmVxdWlyZShcIi4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9jYW5kaWRhdGUucmVwb3NpdG9yeVwiKTtcbmltcG9ydCBDYW5kaWRhdGVJbmZvU2VhcmNoID0gcmVxdWlyZShcIi4uL2RhdGFhY2Nlc3MvbW9kZWwvY2FuZGlkYXRlLWluZm8tc2VhcmNoXCIpO1xuXG5jbGFzcyBDYW5kaWRhdGVTZWFyY2hTZXJ2aWNlIHtcblxuICBwcml2YXRlIHJlY3J1aXRlclJlcG9zaXRvcnk6UmVjcnVpdGVyUmVwb3NpdG9yeTtcbiAgcHJpdmF0ZSBjYW5kaWRhdGVSZXBvc2l0b3J5OkNhbmRpZGF0ZVJlcG9zaXRvcnk7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5yZWNydWl0ZXJSZXBvc2l0b3J5ID0gbmV3IFJlY3J1aXRlclJlcG9zaXRvcnkoKTtcbiAgICB0aGlzLmNhbmRpZGF0ZVJlcG9zaXRvcnkgPSBuZXcgQ2FuZGlkYXRlUmVwb3NpdG9yeSgpO1xuICB9XG5cbiAgc2VhcmNoTWF0Y2hpbmdKb2JQcm9maWxlKGNhbmRpZGF0ZTpDYW5kaWRhdGVNb2RlbCwgcmVjcnVpdGVySWQ6c3RyaW5nLCBzZWFyY2hWaWV3OnN0cmluZywgY2FsbGJhY2s6KGVycm9yOmFueSwgcmVzdWx0OmFueSkgPT4gdm9pZCkge1xuXG4gICAgbGV0IGN1cnJlbnREYXRlID0gbmV3IERhdGUoKTtcbiAgICBsZXQgZGF0YSA9IHtcbiAgICAgICdfaWQnOiByZWNydWl0ZXJJZCxcbiAgICAgICdwb3N0ZWRKb2JzLmluZHVzdHJ5Lm5hbWUnOiBjYW5kaWRhdGUuaW5kdXN0cnkubmFtZSxcbiAgICAgICdwb3N0ZWRKb2JzLnByb2ZpY2llbmNpZXMnOiB7JGluOiBjYW5kaWRhdGUucHJvZmljaWVuY2llc31cbiAgICB9O1xuICAgIGxldCBleGNsdWRlZF9maWVsZHMgPSB7XG4gICAgICAncG9zdGVkSm9icy5pbmR1c3RyeS5yb2xlcyc6IDAsXG4gICAgfTtcbiAgICB0aGlzLnJlY3J1aXRlclJlcG9zaXRvcnkucmV0cmlldmVXaXRoTGVhbihkYXRhLCBleGNsdWRlZF9maWVsZHMsIChlcnIsIHJlcykgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5yZWNydWl0ZXJSZXBvc2l0b3J5LmdldEpvYlByb2ZpbGVRQ2FyZChyZXMsIGNhbmRpZGF0ZSwgdW5kZWZpbmVkLCBzZWFyY2hWaWV3LCBjYWxsYmFjayk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvL2luIGJlbG93IG1ldGhvZCB3ZSB1c2UgdXNlcmlkcyBmb3Igc2VhcmNoIGluIGNhbmRpZGF0ZSByZXBvc2l0b3J5XG4gIGdldENhbmRpZGF0ZUluZm8odXNlcklkOnN0cmluZ1tdLCBjYWxsYmFjazooZXJyb3I6YW55LCByZXN1bHQ6YW55KSA9PiB2b2lkKSB7XG4gICAgdGhpcy5jYW5kaWRhdGVSZXBvc2l0b3J5LnJldHJpZXZlQnlNdWx0aVJlZnJlbmNlSWRzQW5kUG9wdWxhdGUodXNlcklkLCB7Y2FwYWJpbGl0eV9tYXRyaXg6IDB9LCAoZXJyLCByZXN1bHQpID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3VsdCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvL2luIGJlbG93IG1ldGhvZCB3ZSB1c2UgY2FuZGlkYXRlIGlkcyBmb3Igc2VhcmNoIGluIGNhbmRpZGF0ZSByZXBvc2l0b3J5XG4gIGdldENhbmRpZGF0ZUluZm9CeUlkKGlkOnN0cmluZ1tdLCBjYWxsYmFjazooZXJyb3I6YW55LCByZXN1bHQ6YW55KSA9PiB2b2lkKSB7XG4gICAgdGhpcy5jYW5kaWRhdGVSZXBvc2l0b3J5LnJldHJpZXZlQnlNdWx0aUlkc0FuZFBvcHVsYXRlKGlkLCB7Y2FwYWJpbGl0eV9tYXRyaXg6IDB9LCAoZXJyLCByZXN1bHQpID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3VsdCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBidWlkUmVzdWx0T25DYW5kaWRhdGVTZWFyY2goZGF0YUFycmF5OkNhbmRpZGF0ZU1vZGVsW10pIHtcbiAgICB2YXIgc2VhcmNoUmVzdWx0OkNhbmRpZGF0ZUluZm9TZWFyY2hbXSA9IG5ldyBBcnJheSgwKTtcbiAgICBmb3IgKGxldCBvYmogb2YgZGF0YUFycmF5KSB7XG4gICAgICBpZiAob2JqLmlzQ29tcGxldGVkKSB7XG4gICAgICAgIHZhciBkYXRhOkNhbmRpZGF0ZUluZm9TZWFyY2ggPSBuZXcgQ2FuZGlkYXRlSW5mb1NlYXJjaCgpO1xuICAgICAgICBkYXRhLmZpcnN0X25hbWUgPSBvYmoudXNlcklkLmZpcnN0X25hbWU7XG4gICAgICAgIGRhdGEubGFzdF9uYW1lID0gb2JqLnVzZXJJZC5sYXN0X25hbWU7XG4gICAgICAgIGRhdGEuaWQgPSBvYmouX2lkO1xuICAgICAgICBkYXRhLmxvY2F0aW9uID0gb2JqLmxvY2F0aW9uO1xuICAgICAgICBkYXRhLmN1cnJlbnRDb21wYW55ID0gb2JqLnByb2Zlc3Npb25hbERldGFpbHMuY3VycmVudENvbXBhbnk7XG4gICAgICAgIGRhdGEuZGVzaWduYXRpb24gPSBvYmouam9iVGl0bGU7XG4gICAgICAgIGRhdGEuZGlzcGxheV9zdHJpbmcgPSBkYXRhLmZpcnN0X25hbWUgKyBcIiBcIiArIGRhdGEubGFzdF9uYW1lICsgXCIgXCIgKyBvYmouam9iVGl0bGUgKyBcIiBcIiArIG9iai5wcm9mZXNzaW9uYWxEZXRhaWxzLmN1cnJlbnRDb21wYW55O1xuICAgICAgICBzZWFyY2hSZXN1bHQucHVzaChkYXRhKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHNlYXJjaFJlc3VsdDtcbiAgfVxuXG59XG5cbk9iamVjdC5zZWFsKENhbmRpZGF0ZVNlYXJjaFNlcnZpY2UpO1xuZXhwb3J0ID0gQ2FuZGlkYXRlU2VhcmNoU2VydmljZTtcbiJdfQ==
