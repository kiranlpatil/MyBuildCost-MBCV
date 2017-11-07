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
            'postedJobs.proficiencies': { $in: candidate.proficiencies },
            'postedJobs.expiringDate': { $gte: currentDate }
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2VydmljZXMvY2FuZGlkYXRlLXNlYXJjaC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSxtRkFBc0Y7QUFDdEYsbUZBQXNGO0FBQ3RGLCtFQUFrRjtBQUVsRjtJQUtFO1FBQ0UsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksbUJBQW1CLEVBQUUsQ0FBQztRQUNyRCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxtQkFBbUIsRUFBRSxDQUFDO0lBQ3ZELENBQUM7SUFHRCx5REFBd0IsR0FBeEIsVUFBeUIsU0FBd0IsRUFBRSxXQUFrQixFQUFFLFVBQWlCLEVBQUUsUUFBd0M7UUFBbEksaUJBbUJDO1FBakJDLElBQUksV0FBVyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7UUFDN0IsSUFBSSxJQUFJLEdBQUc7WUFDVCxLQUFLLEVBQUUsV0FBVztZQUNsQiwwQkFBMEIsRUFBRSxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUk7WUFDbkQsMEJBQTBCLEVBQUUsRUFBQyxHQUFHLEVBQUUsU0FBUyxDQUFDLGFBQWEsRUFBQztZQUMxRCx5QkFBeUIsRUFBRSxFQUFDLElBQUksRUFBRSxXQUFXLEVBQUM7U0FDL0MsQ0FBQztRQUNGLElBQUksZUFBZSxHQUFHO1lBQ3BCLDJCQUEyQixFQUFFLENBQUM7U0FDL0IsQ0FBQztRQUNGLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFLFVBQUMsR0FBRyxFQUFFLEdBQUc7WUFDeEUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDUixRQUFRLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3RCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixLQUFJLENBQUMsbUJBQW1CLENBQUMsa0JBQWtCLENBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQy9GLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFHRCxpREFBZ0IsR0FBaEIsVUFBaUIsTUFBZSxFQUFFLFFBQXdDO1FBQ3hFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxxQ0FBcUMsQ0FBQyxNQUFNLEVBQUUsRUFBQyxpQkFBaUIsRUFBRSxDQUFDLEVBQUMsRUFBRSxVQUFDLEdBQUcsRUFBRSxNQUFNO1lBQ3pHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsUUFBUSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN0QixDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04sUUFBUSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztZQUN6QixDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBR0QscURBQW9CLEdBQXBCLFVBQXFCLEVBQVcsRUFBRSxRQUF3QztRQUN4RSxJQUFJLENBQUMsbUJBQW1CLENBQUMsNkJBQTZCLENBQUMsRUFBRSxFQUFFLEVBQUMsaUJBQWlCLEVBQUUsQ0FBQyxFQUFDLEVBQUUsVUFBQyxHQUFHLEVBQUUsTUFBTTtZQUM3RixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNSLFFBQVEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDdEIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLFFBQVEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDekIsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELDREQUEyQixHQUEzQixVQUE0QixTQUEwQjtRQUNwRCxJQUFJLFlBQVksR0FBeUIsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEQsR0FBRyxDQUFDLENBQVksVUFBUyxFQUFULHVCQUFTLEVBQVQsdUJBQVMsRUFBVCxJQUFTO1lBQXBCLElBQUksR0FBRyxrQkFBQTtZQUNWLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2dCQUNwQixJQUFJLElBQUksR0FBdUIsSUFBSSxtQkFBbUIsRUFBRSxDQUFDO2dCQUN6RCxJQUFJLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDO2dCQUN4QyxJQUFJLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDO2dCQUN0QyxJQUFJLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUM7Z0JBQ2xCLElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQztnQkFDN0IsSUFBSSxDQUFDLGNBQWMsR0FBRyxHQUFHLENBQUMsbUJBQW1CLENBQUMsY0FBYyxDQUFDO2dCQUM3RCxJQUFJLENBQUMsV0FBVyxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUM7Z0JBQ2hDLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLFVBQVUsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLFFBQVEsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLG1CQUFtQixDQUFDLGNBQWMsQ0FBQztnQkFDakksWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMxQixDQUFDO1NBQ0Y7UUFDRCxNQUFNLENBQUMsWUFBWSxDQUFDO0lBQ3RCLENBQUM7SUFFSCw2QkFBQztBQUFELENBeEVBLEFBd0VDLElBQUE7QUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFDcEMsaUJBQVMsc0JBQXNCLENBQUMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9zZXJ2aWNlcy9jYW5kaWRhdGUtc2VhcmNoLnNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ2FuZGlkYXRlTW9kZWwgPSByZXF1aXJlKFwiLi4vZGF0YWFjY2Vzcy9tb2RlbC9jYW5kaWRhdGUubW9kZWxcIik7XG5pbXBvcnQgUmVjcnVpdGVyUmVwb3NpdG9yeSA9IHJlcXVpcmUoXCIuLi9kYXRhYWNjZXNzL3JlcG9zaXRvcnkvcmVjcnVpdGVyLnJlcG9zaXRvcnlcIik7XG5pbXBvcnQgQ2FuZGlkYXRlUmVwb3NpdG9yeSA9IHJlcXVpcmUoXCIuLi9kYXRhYWNjZXNzL3JlcG9zaXRvcnkvY2FuZGlkYXRlLnJlcG9zaXRvcnlcIik7XG5pbXBvcnQgQ2FuZGlkYXRlSW5mb1NlYXJjaCA9IHJlcXVpcmUoXCIuLi9kYXRhYWNjZXNzL21vZGVsL2NhbmRpZGF0ZS1pbmZvLXNlYXJjaFwiKTtcblxuY2xhc3MgQ2FuZGlkYXRlU2VhcmNoU2VydmljZSB7XG5cbiAgcHJpdmF0ZSByZWNydWl0ZXJSZXBvc2l0b3J5OlJlY3J1aXRlclJlcG9zaXRvcnk7XG4gIHByaXZhdGUgY2FuZGlkYXRlUmVwb3NpdG9yeTpDYW5kaWRhdGVSZXBvc2l0b3J5O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucmVjcnVpdGVyUmVwb3NpdG9yeSA9IG5ldyBSZWNydWl0ZXJSZXBvc2l0b3J5KCk7XG4gICAgdGhpcy5jYW5kaWRhdGVSZXBvc2l0b3J5ID0gbmV3IENhbmRpZGF0ZVJlcG9zaXRvcnkoKTtcbiAgfVxuLy9UT0RPOiB1c2UgZ2V0TWF0Y2hpbmdKb2JQcm9maWxlIGZyb20gc2VhcmNoLnNlcnZpY2UgaW5zdGVhZCBvZiBzZWFyY2hNYXRjaGluZ0pvYlByb2ZpbGUgYm90aCBmdW5jdGlvbiBoYXMgc2FtZSBjb2RlIG9ubHkgcGFyYW1ldGVyIGNoYW5nZVxuLy8gVE9ETzogcmVkdW5kYW50IGNvZGUgaWYgYW5kIGFsc28gZGVwZW5kZW50LiBJZiBnb2luZyB0byBjYWhuZ2UgaW4gcXVlcnkgaW4gb25lIGNvZGUgbmVlZCB0byBjaGFuZ2UgaW4gYW5vdGhlciBhbHNvIC0+IGtyaXNobmEgZ2hhdHVsXG4gIHNlYXJjaE1hdGNoaW5nSm9iUHJvZmlsZShjYW5kaWRhdGU6Q2FuZGlkYXRlTW9kZWwsIHJlY3J1aXRlcklkOnN0cmluZywgc2VhcmNoVmlldzpzdHJpbmcsIGNhbGxiYWNrOihlcnJvcjphbnksIHJlc3VsdDphbnkpID0+IHZvaWQpIHtcblxuICAgIGxldCBjdXJyZW50RGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgbGV0IGRhdGEgPSB7XG4gICAgICAnX2lkJzogcmVjcnVpdGVySWQsXG4gICAgICAncG9zdGVkSm9icy5pbmR1c3RyeS5uYW1lJzogY2FuZGlkYXRlLmluZHVzdHJ5Lm5hbWUsXG4gICAgICAncG9zdGVkSm9icy5wcm9maWNpZW5jaWVzJzogeyRpbjogY2FuZGlkYXRlLnByb2ZpY2llbmNpZXN9LFxuICAgICAgJ3Bvc3RlZEpvYnMuZXhwaXJpbmdEYXRlJzogeyRndGU6IGN1cnJlbnREYXRlfVxuICAgIH07XG4gICAgbGV0IGV4Y2x1ZGVkX2ZpZWxkcyA9IHtcbiAgICAgICdwb3N0ZWRKb2JzLmluZHVzdHJ5LnJvbGVzJzogMCxcbiAgICB9O1xuICAgIHRoaXMucmVjcnVpdGVyUmVwb3NpdG9yeS5yZXRyaWV2ZVdpdGhMZWFuKGRhdGEsIGV4Y2x1ZGVkX2ZpZWxkcywgKGVyciwgcmVzKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnJlY3J1aXRlclJlcG9zaXRvcnkuZ2V0Sm9iUHJvZmlsZVFDYXJkKHJlcywgY2FuZGlkYXRlLCB1bmRlZmluZWQsIHNlYXJjaFZpZXcsIGNhbGxiYWNrKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8vaW4gYmVsb3cgbWV0aG9kIHdlIHVzZSB1c2VyaWRzIGZvciBzZWFyY2ggaW4gY2FuZGlkYXRlIHJlcG9zaXRvcnlcbiAgZ2V0Q2FuZGlkYXRlSW5mbyh1c2VySWQ6c3RyaW5nW10sIGNhbGxiYWNrOihlcnJvcjphbnksIHJlc3VsdDphbnkpID0+IHZvaWQpIHtcbiAgICB0aGlzLmNhbmRpZGF0ZVJlcG9zaXRvcnkucmV0cmlldmVCeU11bHRpUmVmcmVuY2VJZHNBbmRQb3B1bGF0ZSh1c2VySWQsIHtjYXBhYmlsaXR5X21hdHJpeDogMH0sIChlcnIsIHJlc3VsdCkgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzdWx0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8vaW4gYmVsb3cgbWV0aG9kIHdlIHVzZSBjYW5kaWRhdGUgaWRzIGZvciBzZWFyY2ggaW4gY2FuZGlkYXRlIHJlcG9zaXRvcnlcbiAgZ2V0Q2FuZGlkYXRlSW5mb0J5SWQoaWQ6c3RyaW5nW10sIGNhbGxiYWNrOihlcnJvcjphbnksIHJlc3VsdDphbnkpID0+IHZvaWQpIHtcbiAgICB0aGlzLmNhbmRpZGF0ZVJlcG9zaXRvcnkucmV0cmlldmVCeU11bHRpSWRzQW5kUG9wdWxhdGUoaWQsIHtjYXBhYmlsaXR5X21hdHJpeDogMH0sIChlcnIsIHJlc3VsdCkgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzdWx0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGJ1aWRSZXN1bHRPbkNhbmRpZGF0ZVNlYXJjaChkYXRhQXJyYXk6Q2FuZGlkYXRlTW9kZWxbXSkge1xuICAgIHZhciBzZWFyY2hSZXN1bHQ6Q2FuZGlkYXRlSW5mb1NlYXJjaFtdID0gbmV3IEFycmF5KDApO1xuICAgIGZvciAobGV0IG9iaiBvZiBkYXRhQXJyYXkpIHtcbiAgICAgIGlmIChvYmouaXNDb21wbGV0ZWQpIHtcbiAgICAgICAgdmFyIGRhdGE6Q2FuZGlkYXRlSW5mb1NlYXJjaCA9IG5ldyBDYW5kaWRhdGVJbmZvU2VhcmNoKCk7XG4gICAgICAgIGRhdGEuZmlyc3RfbmFtZSA9IG9iai51c2VySWQuZmlyc3RfbmFtZTtcbiAgICAgICAgZGF0YS5sYXN0X25hbWUgPSBvYmoudXNlcklkLmxhc3RfbmFtZTtcbiAgICAgICAgZGF0YS5pZCA9IG9iai5faWQ7XG4gICAgICAgIGRhdGEubG9jYXRpb24gPSBvYmoubG9jYXRpb247XG4gICAgICAgIGRhdGEuY3VycmVudENvbXBhbnkgPSBvYmoucHJvZmVzc2lvbmFsRGV0YWlscy5jdXJyZW50Q29tcGFueTtcbiAgICAgICAgZGF0YS5kZXNpZ25hdGlvbiA9IG9iai5qb2JUaXRsZTtcbiAgICAgICAgZGF0YS5kaXNwbGF5X3N0cmluZyA9IGRhdGEuZmlyc3RfbmFtZSArIFwiIFwiICsgZGF0YS5sYXN0X25hbWUgKyBcIiBcIiArIG9iai5qb2JUaXRsZSArIFwiIFwiICsgb2JqLnByb2Zlc3Npb25hbERldGFpbHMuY3VycmVudENvbXBhbnk7XG4gICAgICAgIHNlYXJjaFJlc3VsdC5wdXNoKGRhdGEpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc2VhcmNoUmVzdWx0O1xuICB9XG5cbn1cblxuT2JqZWN0LnNlYWwoQ2FuZGlkYXRlU2VhcmNoU2VydmljZSk7XG5leHBvcnQgPSBDYW5kaWRhdGVTZWFyY2hTZXJ2aWNlO1xuIl19
