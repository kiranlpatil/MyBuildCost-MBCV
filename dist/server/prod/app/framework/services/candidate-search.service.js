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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2VydmljZXMvY2FuZGlkYXRlLXNlYXJjaC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSxtRkFBc0Y7QUFDdEYsbUZBQXNGO0FBQ3RGLCtFQUFrRjtBQUVsRjtJQUtFO1FBQ0UsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksbUJBQW1CLEVBQUUsQ0FBQztRQUNyRCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxtQkFBbUIsRUFBRSxDQUFDO0lBQ3ZELENBQUM7SUFHRCx5REFBd0IsR0FBeEIsVUFBeUIsU0FBd0IsRUFBRSxXQUFrQixFQUFFLFVBQWlCLEVBQUUsUUFBd0M7UUFBbEksaUJBbUJDO1FBakJDLElBQUksV0FBVyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7UUFDN0IsSUFBSSxJQUFJLEdBQUc7WUFDVCxLQUFLLEVBQUUsV0FBVztZQUNsQiwwQkFBMEIsRUFBRSxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUk7WUFDbkQsMEJBQTBCLEVBQUUsRUFBQyxHQUFHLEVBQUUsU0FBUyxDQUFDLGFBQWEsRUFBQztZQUMxRCx5QkFBeUIsRUFBRSxFQUFDLElBQUksRUFBRSxXQUFXLEVBQUM7U0FDL0MsQ0FBQztRQUNGLElBQUksZUFBZSxHQUFHO1lBQ3BCLDJCQUEyQixFQUFFLENBQUM7U0FDL0IsQ0FBQztRQUNGLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFLFVBQUMsR0FBRyxFQUFFLEdBQUc7WUFDeEUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDUixRQUFRLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3RCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixLQUFJLENBQUMsbUJBQW1CLENBQUMsa0JBQWtCLENBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQy9GLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFHRCxpREFBZ0IsR0FBaEIsVUFBaUIsTUFBZSxFQUFFLFFBQXdDO1FBQ3hFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxxQ0FBcUMsQ0FBQyxNQUFNLEVBQUUsRUFBQyxpQkFBaUIsRUFBRSxDQUFDLEVBQUMsRUFBRSxVQUFDLEdBQUcsRUFBRSxNQUFNO1lBQ3pHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsUUFBUSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN0QixDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04sUUFBUSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztZQUN6QixDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBR0QscURBQW9CLEdBQXBCLFVBQXFCLEVBQVcsRUFBRSxRQUF3QztRQUN4RSxJQUFJLENBQUMsbUJBQW1CLENBQUMsNkJBQTZCLENBQUMsRUFBRSxFQUFFLEVBQUMsaUJBQWlCLEVBQUUsQ0FBQyxFQUFDLEVBQUUsVUFBQyxHQUFHLEVBQUUsTUFBTTtZQUM3RixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNSLFFBQVEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDdEIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLFFBQVEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDekIsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELDREQUEyQixHQUEzQixVQUE0QixTQUEwQjtRQUNwRCxJQUFJLFlBQVksR0FBeUIsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEQsR0FBRyxDQUFDLENBQVksVUFBUyxFQUFULHVCQUFTLEVBQVQsdUJBQVMsRUFBVCxJQUFTO1lBQXBCLElBQUksR0FBRyxrQkFBQTtZQUNWLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2dCQUNwQixJQUFJLElBQUksR0FBdUIsSUFBSSxtQkFBbUIsRUFBRSxDQUFDO2dCQUN6RCxJQUFJLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDO2dCQUN4QyxJQUFJLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDO2dCQUN0QyxJQUFJLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUM7Z0JBQ2xCLElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQztnQkFDN0IsSUFBSSxDQUFDLGNBQWMsR0FBRyxHQUFHLENBQUMsbUJBQW1CLENBQUMsY0FBYyxDQUFDO2dCQUM3RCxJQUFJLENBQUMsV0FBVyxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUM7Z0JBQ2hDLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLFVBQVUsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLFFBQVEsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLG1CQUFtQixDQUFDLGNBQWMsQ0FBQztnQkFDakksWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMxQixDQUFDO1NBQ0Y7UUFDRCxNQUFNLENBQUMsWUFBWSxDQUFDO0lBQ3RCLENBQUM7SUFFSCw2QkFBQztBQUFELENBeEVBLEFBd0VDLElBQUE7QUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFDcEMsaUJBQVMsc0JBQXNCLENBQUMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9zZXJ2aWNlcy9jYW5kaWRhdGUtc2VhcmNoLnNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ2FuZGlkYXRlTW9kZWwgPSByZXF1aXJlKFwiLi4vZGF0YWFjY2Vzcy9tb2RlbC9jYW5kaWRhdGUubW9kZWxcIik7XHJcbmltcG9ydCBSZWNydWl0ZXJSZXBvc2l0b3J5ID0gcmVxdWlyZShcIi4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9yZWNydWl0ZXIucmVwb3NpdG9yeVwiKTtcclxuaW1wb3J0IENhbmRpZGF0ZVJlcG9zaXRvcnkgPSByZXF1aXJlKFwiLi4vZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L2NhbmRpZGF0ZS5yZXBvc2l0b3J5XCIpO1xyXG5pbXBvcnQgQ2FuZGlkYXRlSW5mb1NlYXJjaCA9IHJlcXVpcmUoXCIuLi9kYXRhYWNjZXNzL21vZGVsL2NhbmRpZGF0ZS1pbmZvLXNlYXJjaFwiKTtcclxuXHJcbmNsYXNzIENhbmRpZGF0ZVNlYXJjaFNlcnZpY2Uge1xyXG5cclxuICBwcml2YXRlIHJlY3J1aXRlclJlcG9zaXRvcnk6UmVjcnVpdGVyUmVwb3NpdG9yeTtcclxuICBwcml2YXRlIGNhbmRpZGF0ZVJlcG9zaXRvcnk6Q2FuZGlkYXRlUmVwb3NpdG9yeTtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLnJlY3J1aXRlclJlcG9zaXRvcnkgPSBuZXcgUmVjcnVpdGVyUmVwb3NpdG9yeSgpO1xyXG4gICAgdGhpcy5jYW5kaWRhdGVSZXBvc2l0b3J5ID0gbmV3IENhbmRpZGF0ZVJlcG9zaXRvcnkoKTtcclxuICB9XHJcbi8vVE9ETzogdXNlIGdldE1hdGNoaW5nSm9iUHJvZmlsZSBmcm9tIHNlYXJjaC5zZXJ2aWNlIGluc3RlYWQgb2Ygc2VhcmNoTWF0Y2hpbmdKb2JQcm9maWxlIGJvdGggZnVuY3Rpb24gaGFzIHNhbWUgY29kZSBvbmx5IHBhcmFtZXRlciBjaGFuZ2VcclxuLy8gVE9ETzogcmVkdW5kYW50IGNvZGUgaWYgYW5kIGFsc28gZGVwZW5kZW50LiBJZiBnb2luZyB0byBjYWhuZ2UgaW4gcXVlcnkgaW4gb25lIGNvZGUgbmVlZCB0byBjaGFuZ2UgaW4gYW5vdGhlciBhbHNvIC0+IGtyaXNobmEgZ2hhdHVsXHJcbiAgc2VhcmNoTWF0Y2hpbmdKb2JQcm9maWxlKGNhbmRpZGF0ZTpDYW5kaWRhdGVNb2RlbCwgcmVjcnVpdGVySWQ6c3RyaW5nLCBzZWFyY2hWaWV3OnN0cmluZywgY2FsbGJhY2s6KGVycm9yOmFueSwgcmVzdWx0OmFueSkgPT4gdm9pZCkge1xyXG5cclxuICAgIGxldCBjdXJyZW50RGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICBsZXQgZGF0YSA9IHtcclxuICAgICAgJ19pZCc6IHJlY3J1aXRlcklkLFxyXG4gICAgICAncG9zdGVkSm9icy5pbmR1c3RyeS5uYW1lJzogY2FuZGlkYXRlLmluZHVzdHJ5Lm5hbWUsXHJcbiAgICAgICdwb3N0ZWRKb2JzLnByb2ZpY2llbmNpZXMnOiB7JGluOiBjYW5kaWRhdGUucHJvZmljaWVuY2llc30sXHJcbiAgICAgICdwb3N0ZWRKb2JzLmV4cGlyaW5nRGF0ZSc6IHskZ3RlOiBjdXJyZW50RGF0ZX1cclxuICAgIH07XHJcbiAgICBsZXQgZXhjbHVkZWRfZmllbGRzID0ge1xyXG4gICAgICAncG9zdGVkSm9icy5pbmR1c3RyeS5yb2xlcyc6IDAsXHJcbiAgICB9O1xyXG4gICAgdGhpcy5yZWNydWl0ZXJSZXBvc2l0b3J5LnJldHJpZXZlV2l0aExlYW4oZGF0YSwgZXhjbHVkZWRfZmllbGRzLCAoZXJyLCByZXMpID0+IHtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5yZWNydWl0ZXJSZXBvc2l0b3J5LmdldEpvYlByb2ZpbGVRQ2FyZChyZXMsIGNhbmRpZGF0ZSwgdW5kZWZpbmVkLCBzZWFyY2hWaWV3LCBjYWxsYmFjayk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy9pbiBiZWxvdyBtZXRob2Qgd2UgdXNlIHVzZXJpZHMgZm9yIHNlYXJjaCBpbiBjYW5kaWRhdGUgcmVwb3NpdG9yeVxyXG4gIGdldENhbmRpZGF0ZUluZm8odXNlcklkOnN0cmluZ1tdLCBjYWxsYmFjazooZXJyb3I6YW55LCByZXN1bHQ6YW55KSA9PiB2b2lkKSB7XHJcbiAgICB0aGlzLmNhbmRpZGF0ZVJlcG9zaXRvcnkucmV0cmlldmVCeU11bHRpUmVmcmVuY2VJZHNBbmRQb3B1bGF0ZSh1c2VySWQsIHtjYXBhYmlsaXR5X21hdHJpeDogMH0sIChlcnIsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCByZXN1bHQpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vaW4gYmVsb3cgbWV0aG9kIHdlIHVzZSBjYW5kaWRhdGUgaWRzIGZvciBzZWFyY2ggaW4gY2FuZGlkYXRlIHJlcG9zaXRvcnlcclxuICBnZXRDYW5kaWRhdGVJbmZvQnlJZChpZDpzdHJpbmdbXSwgY2FsbGJhY2s6KGVycm9yOmFueSwgcmVzdWx0OmFueSkgPT4gdm9pZCkge1xyXG4gICAgdGhpcy5jYW5kaWRhdGVSZXBvc2l0b3J5LnJldHJpZXZlQnlNdWx0aUlkc0FuZFBvcHVsYXRlKGlkLCB7Y2FwYWJpbGl0eV9tYXRyaXg6IDB9LCAoZXJyLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzdWx0KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBidWlkUmVzdWx0T25DYW5kaWRhdGVTZWFyY2goZGF0YUFycmF5OkNhbmRpZGF0ZU1vZGVsW10pIHtcclxuICAgIHZhciBzZWFyY2hSZXN1bHQ6Q2FuZGlkYXRlSW5mb1NlYXJjaFtdID0gbmV3IEFycmF5KDApO1xyXG4gICAgZm9yIChsZXQgb2JqIG9mIGRhdGFBcnJheSkge1xyXG4gICAgICBpZiAob2JqLmlzQ29tcGxldGVkKSB7XHJcbiAgICAgICAgdmFyIGRhdGE6Q2FuZGlkYXRlSW5mb1NlYXJjaCA9IG5ldyBDYW5kaWRhdGVJbmZvU2VhcmNoKCk7XHJcbiAgICAgICAgZGF0YS5maXJzdF9uYW1lID0gb2JqLnVzZXJJZC5maXJzdF9uYW1lO1xyXG4gICAgICAgIGRhdGEubGFzdF9uYW1lID0gb2JqLnVzZXJJZC5sYXN0X25hbWU7XHJcbiAgICAgICAgZGF0YS5pZCA9IG9iai5faWQ7XHJcbiAgICAgICAgZGF0YS5sb2NhdGlvbiA9IG9iai5sb2NhdGlvbjtcclxuICAgICAgICBkYXRhLmN1cnJlbnRDb21wYW55ID0gb2JqLnByb2Zlc3Npb25hbERldGFpbHMuY3VycmVudENvbXBhbnk7XHJcbiAgICAgICAgZGF0YS5kZXNpZ25hdGlvbiA9IG9iai5qb2JUaXRsZTtcclxuICAgICAgICBkYXRhLmRpc3BsYXlfc3RyaW5nID0gZGF0YS5maXJzdF9uYW1lICsgXCIgXCIgKyBkYXRhLmxhc3RfbmFtZSArIFwiIFwiICsgb2JqLmpvYlRpdGxlICsgXCIgXCIgKyBvYmoucHJvZmVzc2lvbmFsRGV0YWlscy5jdXJyZW50Q29tcGFueTtcclxuICAgICAgICBzZWFyY2hSZXN1bHQucHVzaChkYXRhKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHNlYXJjaFJlc3VsdDtcclxuICB9XHJcblxyXG59XHJcblxyXG5PYmplY3Quc2VhbChDYW5kaWRhdGVTZWFyY2hTZXJ2aWNlKTtcclxuZXhwb3J0ID0gQ2FuZGlkYXRlU2VhcmNoU2VydmljZTtcclxuIl19
