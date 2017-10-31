"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SearchService = require("../services/search.service");
var CandidateService = require("../../services/candidate.service");
var RecruiterService = require("../../services/recruiter.service");
var CandidateSearchService = require("../../services/candidate-search.service");
var SearchController = (function () {
    function SearchController() {
    }
    SearchController.prototype.getMatchingCandidates = function (req, res, next) {
        console.time('getMatchingCandidatesController');
        var searchService = new SearchService();
        var profileId = req.params.id;
        var recruiterService = new RecruiterService();
        recruiterService.getJobById(profileId, function (err, jobRes) {
            searchService.getMatchingCandidates(jobRes, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    console.timeEnd('getMatchingCandidatesController');
                    res.status(200).send(result);
                }
            });
        });
    };
    SearchController.prototype.getMatchingJobProfiles = function (req, res, next) {
        var searchService = new SearchService();
        var candidateService = new CandidateService();
        var candidateId = req.params.id;
        candidateService.findById(candidateId, function (error, candiRes) {
            if (error) {
                next(error);
            }
            else {
                searchService.getMatchingJobProfile(candiRes, function (error, result) {
                    if (error) {
                        next(error);
                    }
                    else {
                        res.status(200).send(result);
                    }
                });
            }
        });
    };
    SearchController.prototype.searchCandidateJobProfiles = function (req, res, next) {
        var candidateSearchService = new CandidateSearchService();
        var candidateService = new CandidateService();
        var candidateId = req.params.candidateId;
        var searchService = new SearchService();
        var recruiterId = req.params.recruiterId;
        candidateService.findById(candidateId, function (error, candiRes) {
            if (error) {
                next(error);
            }
            else {
                candidateSearchService.searchMatchingJobProfile(candiRes, recruiterId, 'searchView', function (error, result) {
                    if (error) {
                        next(error);
                    }
                    else {
                        candidateSearchService.getCandidateInfoById([candidateId], function (error, candidateDetails) {
                            if (error) {
                                next(error);
                            }
                            else {
                                var _candidateDetails = searchService.getCandidateVisibilityAgainstRecruiter(candidateDetails[0], result);
                                _candidateDetails.jobQCardMatching = candidateDetails[0].isVisible ? result : [];
                                res.send({
                                    'status': 'success',
                                    'data': _candidateDetails
                                });
                            }
                        });
                    }
                });
            }
        });
    };
    return SearchController;
}());
exports.SearchController = SearchController;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2VhcmNoL2NvbnRyb2xsZXIvc2VhcmNoLmNvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSwwREFBNkQ7QUFDN0QsbUVBQXNFO0FBQ3RFLG1FQUFzRTtBQUN0RSxnRkFBbUY7QUFFbkY7SUFBQTtJQXdFQSxDQUFDO0lBdEVDLGdEQUFxQixHQUFyQixVQUFzQixHQUFvQixFQUFFLEdBQXFCLEVBQUMsSUFBUTtRQUN4RSxPQUFPLENBQUMsSUFBSSxDQUFDLGlDQUFpQyxDQUFDLENBQUM7UUFDaEQsSUFBSSxhQUFhLEdBQUcsSUFBSSxhQUFhLEVBQUUsQ0FBQztRQUN4QyxJQUFJLFNBQVMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztRQUM5QixJQUFJLGdCQUFnQixHQUFHLElBQUksZ0JBQWdCLEVBQUUsQ0FBQztRQUM5QyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLFVBQUMsR0FBUSxFQUFFLE1BQXVCO1lBQ3ZFLGFBQWEsQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLEVBQUUsVUFBQyxLQUFZLEVBQUUsTUFBVztnQkFDcEUsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDWCxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDTixPQUFPLENBQUMsT0FBTyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7b0JBQ25ELEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUMvQixDQUFDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxpREFBc0IsR0FBdEIsVUFBdUIsR0FBb0IsRUFBRSxHQUFxQixFQUFDLElBQVE7UUFDekUsSUFBSSxhQUFhLEdBQUcsSUFBSSxhQUFhLEVBQUUsQ0FBQztRQUN4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ZSI6ImFwcC9mcmFtZXdvcmsvc2VhcmNoL2NvbnRyb2xsZXIvc2VhcmNoLmNvbnRyb2xsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBleHByZXNzIGZyb20gXCJleHByZXNzXCI7XHJcbmltcG9ydCB7Q2FuZGlkYXRlRGV0YWlsc1dpdGhKb2JNYXRjaGluZ30gZnJvbSBcIi4uLy4uL2RhdGFhY2Nlc3MvbW9kZWwvY2FuZGlkYXRlZGV0YWlsc3dpdGhqb2JtYXRjaGluZ1wiO1xyXG5pbXBvcnQgSm9iUHJvZmlsZU1vZGVsID0gcmVxdWlyZSgnLi4vLi4vZGF0YWFjY2Vzcy9tb2RlbC9qb2Jwcm9maWxlLm1vZGVsJyk7XHJcbmltcG9ydCBTZWFyY2hTZXJ2aWNlID0gcmVxdWlyZSgnLi4vc2VydmljZXMvc2VhcmNoLnNlcnZpY2UnKTtcclxuaW1wb3J0IENhbmRpZGF0ZVNlcnZpY2UgPSByZXF1aXJlKCcuLi8uLi9zZXJ2aWNlcy9jYW5kaWRhdGUuc2VydmljZScpO1xyXG5pbXBvcnQgUmVjcnVpdGVyU2VydmljZSA9IHJlcXVpcmUoJy4uLy4uL3NlcnZpY2VzL3JlY3J1aXRlci5zZXJ2aWNlJyk7XHJcbmltcG9ydCBDYW5kaWRhdGVTZWFyY2hTZXJ2aWNlID0gcmVxdWlyZSgnLi4vLi4vc2VydmljZXMvY2FuZGlkYXRlLXNlYXJjaC5zZXJ2aWNlJyk7XHJcblxyXG5leHBvcnQgY2xhc3MgU2VhcmNoQ29udHJvbGxlciB7XHJcblxyXG4gIGdldE1hdGNoaW5nQ2FuZGlkYXRlcyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLG5leHQ6YW55KSB7XHJcbiAgICBjb25zb2xlLnRpbWUoJ2dldE1hdGNoaW5nQ2FuZGlkYXRlc0NvbnRyb2xsZXInKTtcclxuICAgIGxldCBzZWFyY2hTZXJ2aWNlID0gbmV3IFNlYXJjaFNlcnZpY2UoKTtcclxuICAgIGxldCBwcm9maWxlSWQgPSByZXEucGFyYW1zLmlkO1xyXG4gICAgbGV0IHJlY3J1aXRlclNlcnZpY2UgPSBuZXcgUmVjcnVpdGVyU2VydmljZSgpO1xyXG4gICAgcmVjcnVpdGVyU2VydmljZS5nZXRKb2JCeUlkKHByb2ZpbGVJZCwgKGVycjogYW55LCBqb2JSZXM6IEpvYlByb2ZpbGVNb2RlbCkgPT4ge1xyXG4gICAgICBzZWFyY2hTZXJ2aWNlLmdldE1hdGNoaW5nQ2FuZGlkYXRlcyhqb2JSZXMsIChlcnJvcjogRXJyb3IsIHJlc3VsdDogYW55KSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjb25zb2xlLnRpbWVFbmQoJ2dldE1hdGNoaW5nQ2FuZGlkYXRlc0NvbnRyb2xsZXInKTtcclxuICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHJlc3VsdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0TWF0Y2hpbmdKb2JQcm9maWxlcyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLG5leHQ6YW55KSB7XHJcbiAgICBsZXQgc2VhcmNoU2VydmljZSA9IG5ldyBTZWFyY2hTZXJ2aWNlKCk7XHJcbiAgICBsZXQgY2FuZGlkYXRlU2VydmljZSA9IG5ldyBDYW5kaWRhdGVTZXJ2aWNlKCk7XHJcbiAgICBsZXQgY2FuZGlkYXRlSWQgPSByZXEucGFyYW1zLmlkO1xyXG4gICAgY2FuZGlkYXRlU2VydmljZS5maW5kQnlJZChjYW5kaWRhdGVJZCwgKGVycm9yOiBFcnJvciwgY2FuZGlSZXM6IGFueSkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBzZWFyY2hTZXJ2aWNlLmdldE1hdGNoaW5nSm9iUHJvZmlsZShjYW5kaVJlcywgKGVycm9yOiBFcnJvciwgcmVzdWx0OiBhbnkpID0+IHtcclxuICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQocmVzdWx0KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzZWFyY2hDYW5kaWRhdGVKb2JQcm9maWxlcyhyZXE6ZXhwcmVzcy5SZXF1ZXN0LCByZXM6ZXhwcmVzcy5SZXNwb25zZSxuZXh0OmFueSkge1xyXG4gICAgbGV0IGNhbmRpZGF0ZVNlYXJjaFNlcnZpY2UgPSBuZXcgQ2FuZGlkYXRlU2VhcmNoU2VydmljZSgpO1xyXG4gICAgbGV0IGNhbmRpZGF0ZVNlcnZpY2UgPSBuZXcgQ2FuZGlkYXRlU2VydmljZSgpO1xyXG4gICAgbGV0IGNhbmRpZGF0ZUlkID0gcmVxLnBhcmFtcy5jYW5kaWRhdGVJZDtcclxuICAgIGxldCBzZWFyY2hTZXJ2aWNlID0gbmV3IFNlYXJjaFNlcnZpY2UoKTtcclxuICAgIGxldCByZWNydWl0ZXJJZCA9IHJlcS5wYXJhbXMucmVjcnVpdGVySWQ7XHJcbiAgICBjYW5kaWRhdGVTZXJ2aWNlLmZpbmRCeUlkKGNhbmRpZGF0ZUlkLCAoZXJyb3I6RXJyb3IsIGNhbmRpUmVzOmFueSkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNhbmRpZGF0ZVNlYXJjaFNlcnZpY2Uuc2VhcmNoTWF0Y2hpbmdKb2JQcm9maWxlKGNhbmRpUmVzLCByZWNydWl0ZXJJZCwgJ3NlYXJjaFZpZXcnLCAoZXJyb3I6RXJyb3IsIHJlc3VsdDphbnkpID0+IHtcclxuICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNhbmRpZGF0ZVNlYXJjaFNlcnZpY2UuZ2V0Q2FuZGlkYXRlSW5mb0J5SWQoW2NhbmRpZGF0ZUlkXSwgKGVycm9yLCBjYW5kaWRhdGVEZXRhaWxzKSA9PiB7XHJcbiAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgX2NhbmRpZGF0ZURldGFpbHM6Q2FuZGlkYXRlRGV0YWlsc1dpdGhKb2JNYXRjaGluZyA9IHNlYXJjaFNlcnZpY2UuZ2V0Q2FuZGlkYXRlVmlzaWJpbGl0eUFnYWluc3RSZWNydWl0ZXIoY2FuZGlkYXRlRGV0YWlsc1swXSwgcmVzdWx0KTtcclxuICAgICAgICAgICAgICAgIF9jYW5kaWRhdGVEZXRhaWxzLmpvYlFDYXJkTWF0Y2hpbmcgPSBjYW5kaWRhdGVEZXRhaWxzWzBdLmlzVmlzaWJsZSA/IHJlc3VsdCA6IFtdO1xyXG4gICAgICAgICAgICAgICAgcmVzLnNlbmQoe1xyXG4gICAgICAgICAgICAgICAgICAnc3RhdHVzJzogJ3N1Y2Nlc3MnLFxyXG4gICAgICAgICAgICAgICAgICAnZGF0YSc6IF9jYW5kaWRhdGVEZXRhaWxzXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG5cclxufVxyXG4iXX0=
