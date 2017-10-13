"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SearchService = require("../services/search.service");
var CandidateService = require("../../services/candidate.service");
var RecruiterService = require("../../services/recruiter.service");
var CandidateSearchService = require("../../services/candidate-search.service");
var SearchController = (function () {
    function SearchController() {
    }
    SearchController.prototype.getMatchingCandidates = function (req, res) {
        console.time('getMatchingCandidatesController');
        var searchService = new SearchService();
        var profileId = req.params.id;
        var recruiterService = new RecruiterService();
        recruiterService.getJobById(profileId, function (err, jobRes) {
            searchService.getMatchingCandidates(jobRes, function (error, result) {
                if (error) {
                    res.status(304).send(error);
                }
                else {
                    console.timeEnd('getMatchingCandidatesController');
                    res.status(200).send(result);
                }
            });
        });
    };
    SearchController.prototype.getMatchingJobProfiles = function (req, res) {
        var searchService = new SearchService();
        var candidateService = new CandidateService();
        var candidateId = req.params.id;
        candidateService.findById(candidateId, function (error, candiRes) {
            if (error) {
                res.status(304).send(error);
            }
            else {
                searchService.getMatchingJobProfile(candiRes, function (error, result) {
                    if (error) {
                        res.status(304).send(error);
                    }
                    else {
                        res.status(200).send(result);
                    }
                });
            }
        });
    };
    SearchController.prototype.searchCandidateJobProfiles = function (req, res) {
        var candidateSearchService = new CandidateSearchService();
        var candidateService = new CandidateService();
        var candidateId = req.params.candidateId;
        var searchService = new SearchService();
        var recruiterId = req.params.recruiterId;
        candidateService.findById(candidateId, function (error, candiRes) {
            if (error) {
                res.status(304).send(error);
            }
            else {
                candidateSearchService.searchMatchingJobProfile(candiRes, recruiterId, 'searchView', function (error, result) {
                    if (error) {
                        res.status(304).send(error);
                    }
                    else {
                        candidateSearchService.getCandidateInfoById([candidateId], function (error, candidateDetails) {
                            if (error) {
                                res.status(304).send(error);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2VhcmNoL2NvbnRyb2xsZXIvc2VhcmNoLmNvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSwwREFBNkQ7QUFDN0QsbUVBQXNFO0FBQ3RFLG1FQUFzRTtBQUN0RSxnRkFBbUY7QUFFbkY7SUFBQTtJQXdFQSxDQUFDO0lBdEVDLGdEQUFxQixHQUFyQixVQUFzQixHQUFvQixFQUFFLEdBQXFCO1FBQy9ELE9BQU8sQ0FBQyxJQUFJLENBQUMsaUNBQWlDLENBQUMsQ0FBQztRQUNoRCxJQUFJLGFBQWEsR0FBRyxJQUFJLGFBQWEsRUFBRSxDQUFDO1FBQ3hDLElBQUksU0FBUyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO1FBQzlCLElBQUksZ0JBQWdCLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO1FBQzlDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsVUFBQyxHQUFRLEVBQUUsTUFBdUI7WUFDdkUsYUFBYSxDQUFDLHFCQUFxQixDQUFDLE1BQU0sRUFBRSxVQUFDLEtBQVksRUFBRSxNQUFXO2dCQUNwRSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUNWLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUM5QixDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNOLE9BQU8sQ0FBQyxPQUFPLENBQUMsaUNBQWlDLENBQUMsQ0FBQztvQkFDbkQsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQy9CLENBQUM7WUFDSCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELGlEQUFzQixHQUF0QixVQUF1QixHQUFvQixFQUFFLEdBQXFCO1FBQ2hFLElBQUksYUFBYSxHQUFHLElBQUksYUFB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TSxFQUFFLGlCQUFpQjtpQ0FDMUIsQ0FBQyxDQUFDOzRCQUNMLENBQUM7d0JBQ0gsQ0FBQyxDQUFDLENBQUM7b0JBQ0wsQ0FBQztnQkFDSCxDQUFDLENBQUMsQ0FBQztZQUNMLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFHSCx1QkFBQztBQUFELENBeEVBLEFBd0VDLElBQUE7QUF4RVksNENBQWdCIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvc2VhcmNoL2NvbnRyb2xsZXIvc2VhcmNoLmNvbnRyb2xsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBleHByZXNzIGZyb20gXCJleHByZXNzXCI7XHJcbmltcG9ydCB7Q2FuZGlkYXRlRGV0YWlsc1dpdGhKb2JNYXRjaGluZ30gZnJvbSBcIi4uLy4uL2RhdGFhY2Nlc3MvbW9kZWwvY2FuZGlkYXRlZGV0YWlsc3dpdGhqb2JtYXRjaGluZ1wiO1xyXG5pbXBvcnQgSm9iUHJvZmlsZU1vZGVsID0gcmVxdWlyZSgnLi4vLi4vZGF0YWFjY2Vzcy9tb2RlbC9qb2Jwcm9maWxlLm1vZGVsJyk7XHJcbmltcG9ydCBTZWFyY2hTZXJ2aWNlID0gcmVxdWlyZSgnLi4vc2VydmljZXMvc2VhcmNoLnNlcnZpY2UnKTtcclxuaW1wb3J0IENhbmRpZGF0ZVNlcnZpY2UgPSByZXF1aXJlKCcuLi8uLi9zZXJ2aWNlcy9jYW5kaWRhdGUuc2VydmljZScpO1xyXG5pbXBvcnQgUmVjcnVpdGVyU2VydmljZSA9IHJlcXVpcmUoJy4uLy4uL3NlcnZpY2VzL3JlY3J1aXRlci5zZXJ2aWNlJyk7XHJcbmltcG9ydCBDYW5kaWRhdGVTZWFyY2hTZXJ2aWNlID0gcmVxdWlyZSgnLi4vLi4vc2VydmljZXMvY2FuZGlkYXRlLXNlYXJjaC5zZXJ2aWNlJyk7XHJcblxyXG5leHBvcnQgY2xhc3MgU2VhcmNoQ29udHJvbGxlciB7XHJcblxyXG4gIGdldE1hdGNoaW5nQ2FuZGlkYXRlcyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlKSB7XHJcbiAgICBjb25zb2xlLnRpbWUoJ2dldE1hdGNoaW5nQ2FuZGlkYXRlc0NvbnRyb2xsZXInKTtcclxuICAgIGxldCBzZWFyY2hTZXJ2aWNlID0gbmV3IFNlYXJjaFNlcnZpY2UoKTtcclxuICAgIGxldCBwcm9maWxlSWQgPSByZXEucGFyYW1zLmlkO1xyXG4gICAgbGV0IHJlY3J1aXRlclNlcnZpY2UgPSBuZXcgUmVjcnVpdGVyU2VydmljZSgpO1xyXG4gICAgcmVjcnVpdGVyU2VydmljZS5nZXRKb2JCeUlkKHByb2ZpbGVJZCwgKGVycjogYW55LCBqb2JSZXM6IEpvYlByb2ZpbGVNb2RlbCkgPT4ge1xyXG4gICAgICBzZWFyY2hTZXJ2aWNlLmdldE1hdGNoaW5nQ2FuZGlkYXRlcyhqb2JSZXMsIChlcnJvcjogRXJyb3IsIHJlc3VsdDogYW55KSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICByZXMuc3RhdHVzKDMwNCkuc2VuZChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbnNvbGUudGltZUVuZCgnZ2V0TWF0Y2hpbmdDYW5kaWRhdGVzQ29udHJvbGxlcicpO1xyXG4gICAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQocmVzdWx0KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRNYXRjaGluZ0pvYlByb2ZpbGVzKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UpIHtcclxuICAgIGxldCBzZWFyY2hTZXJ2aWNlID0gbmV3IFNlYXJjaFNlcnZpY2UoKTtcclxuICAgIGxldCBjYW5kaWRhdGVTZXJ2aWNlID0gbmV3IENhbmRpZGF0ZVNlcnZpY2UoKTtcclxuICAgIGxldCBjYW5kaWRhdGVJZCA9IHJlcS5wYXJhbXMuaWQ7XHJcbiAgICBjYW5kaWRhdGVTZXJ2aWNlLmZpbmRCeUlkKGNhbmRpZGF0ZUlkLCAoZXJyb3I6IEVycm9yLCBjYW5kaVJlczogYW55KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoMzA0KS5zZW5kKGVycm9yKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBzZWFyY2hTZXJ2aWNlLmdldE1hdGNoaW5nSm9iUHJvZmlsZShjYW5kaVJlcywgKGVycm9yOiBFcnJvciwgcmVzdWx0OiBhbnkpID0+IHtcclxuICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICByZXMuc3RhdHVzKDMwNCkuc2VuZChlcnJvcik7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZChyZXN1bHQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHNlYXJjaENhbmRpZGF0ZUpvYlByb2ZpbGVzKHJlcTpleHByZXNzLlJlcXVlc3QsIHJlczpleHByZXNzLlJlc3BvbnNlKSB7XHJcbiAgICBsZXQgY2FuZGlkYXRlU2VhcmNoU2VydmljZSA9IG5ldyBDYW5kaWRhdGVTZWFyY2hTZXJ2aWNlKCk7XHJcbiAgICBsZXQgY2FuZGlkYXRlU2VydmljZSA9IG5ldyBDYW5kaWRhdGVTZXJ2aWNlKCk7XHJcbiAgICBsZXQgY2FuZGlkYXRlSWQgPSByZXEucGFyYW1zLmNhbmRpZGF0ZUlkO1xyXG4gICAgbGV0IHNlYXJjaFNlcnZpY2UgPSBuZXcgU2VhcmNoU2VydmljZSgpO1xyXG4gICAgbGV0IHJlY3J1aXRlcklkID0gcmVxLnBhcmFtcy5yZWNydWl0ZXJJZDtcclxuICAgIGNhbmRpZGF0ZVNlcnZpY2UuZmluZEJ5SWQoY2FuZGlkYXRlSWQsIChlcnJvcjpFcnJvciwgY2FuZGlSZXM6YW55KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoMzA0KS5zZW5kKGVycm9yKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjYW5kaWRhdGVTZWFyY2hTZXJ2aWNlLnNlYXJjaE1hdGNoaW5nSm9iUHJvZmlsZShjYW5kaVJlcywgcmVjcnVpdGVySWQsICdzZWFyY2hWaWV3JywgKGVycm9yOkVycm9yLCByZXN1bHQ6YW55KSA9PiB7XHJcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cygzMDQpLnNlbmQoZXJyb3IpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY2FuZGlkYXRlU2VhcmNoU2VydmljZS5nZXRDYW5kaWRhdGVJbmZvQnlJZChbY2FuZGlkYXRlSWRdLCAoZXJyb3IsIGNhbmRpZGF0ZURldGFpbHMpID0+IHtcclxuICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMzA0KS5zZW5kKGVycm9yKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgX2NhbmRpZGF0ZURldGFpbHM6Q2FuZGlkYXRlRGV0YWlsc1dpdGhKb2JNYXRjaGluZyA9IHNlYXJjaFNlcnZpY2UuZ2V0Q2FuZGlkYXRlVmlzaWJpbGl0eUFnYWluc3RSZWNydWl0ZXIoY2FuZGlkYXRlRGV0YWlsc1swXSwgcmVzdWx0KTtcclxuICAgICAgICAgICAgICAgIF9jYW5kaWRhdGVEZXRhaWxzLmpvYlFDYXJkTWF0Y2hpbmcgPSBjYW5kaWRhdGVEZXRhaWxzWzBdLmlzVmlzaWJsZSA/IHJlc3VsdCA6IFtdO1xyXG4gICAgICAgICAgICAgICAgcmVzLnNlbmQoe1xyXG4gICAgICAgICAgICAgICAgICAnc3RhdHVzJzogJ3N1Y2Nlc3MnLFxyXG4gICAgICAgICAgICAgICAgICAnZGF0YSc6IF9jYW5kaWRhdGVEZXRhaWxzXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG5cclxufVxyXG4iXX0=
