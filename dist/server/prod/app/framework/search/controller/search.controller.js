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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2VhcmNoL2NvbnRyb2xsZXIvc2VhcmNoLmNvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSwwREFBNkQ7QUFDN0QsbUVBQXNFO0FBQ3RFLG1FQUFzRTtBQUN0RSxnRkFBbUY7QUFFbkY7SUFBQTtJQXdFQSxDQUFDO0lBdEVDLGdEQUFxQixHQUFyQixVQUFzQixHQUFvQixFQUFFLEdBQXFCLEVBQUMsSUFBUTtRQUN4RSxPQUFPLENBQUMsSUFBSSxDQUFDLGlDQUFpQyxDQUFDLENBQUM7UUFDaEQsSUFBSSxhQUFhLEdBQUcsSUFBSSxhQUFhLEVBQUUsQ0FBQztRQUN4QyxJQUFJLFNBQVMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztRQUM5QixJQUFJLGdCQUFnQixHQUFHLElBQUksZ0JBQWdCLEVBQUUsQ0FBQztRQUM5QyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLFVBQUMsR0FBUSxFQUFFLE1BQXVCO1lBQ3ZFLGFBQWEsQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLEVBQUUsVUFBQyxLQUFZLEVBQUUsTUFBVztnQkFDcEUsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDWCxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDTixPQUFPLENBQUMsT0FBTyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7b0JBQ25ELEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUMvQixDQUFDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxpREFBc0IsR0FBdEIsVUFBdUIsR0FBb0IsRUFBRSxHQUFxQixFQUFDLElBQVE7UUFDekUsSUFBSSxhQUFhLEdBQUcsSUFBSSxhQUFhLEVBQUUsQ0FBQztRQUN4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ZSI6ImFwcC9mcmFtZXdvcmsvc2VhcmNoL2NvbnRyb2xsZXIvc2VhcmNoLmNvbnRyb2xsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBleHByZXNzIGZyb20gXCJleHByZXNzXCI7XG5pbXBvcnQge0NhbmRpZGF0ZURldGFpbHNXaXRoSm9iTWF0Y2hpbmd9IGZyb20gXCIuLi8uLi9kYXRhYWNjZXNzL21vZGVsL2NhbmRpZGF0ZWRldGFpbHN3aXRoam9ibWF0Y2hpbmdcIjtcbmltcG9ydCBKb2JQcm9maWxlTW9kZWwgPSByZXF1aXJlKCcuLi8uLi9kYXRhYWNjZXNzL21vZGVsL2pvYnByb2ZpbGUubW9kZWwnKTtcbmltcG9ydCBTZWFyY2hTZXJ2aWNlID0gcmVxdWlyZSgnLi4vc2VydmljZXMvc2VhcmNoLnNlcnZpY2UnKTtcbmltcG9ydCBDYW5kaWRhdGVTZXJ2aWNlID0gcmVxdWlyZSgnLi4vLi4vc2VydmljZXMvY2FuZGlkYXRlLnNlcnZpY2UnKTtcbmltcG9ydCBSZWNydWl0ZXJTZXJ2aWNlID0gcmVxdWlyZSgnLi4vLi4vc2VydmljZXMvcmVjcnVpdGVyLnNlcnZpY2UnKTtcbmltcG9ydCBDYW5kaWRhdGVTZWFyY2hTZXJ2aWNlID0gcmVxdWlyZSgnLi4vLi4vc2VydmljZXMvY2FuZGlkYXRlLXNlYXJjaC5zZXJ2aWNlJyk7XG5cbmV4cG9ydCBjbGFzcyBTZWFyY2hDb250cm9sbGVyIHtcblxuICBnZXRNYXRjaGluZ0NhbmRpZGF0ZXMocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSxuZXh0OmFueSkge1xuICAgIGNvbnNvbGUudGltZSgnZ2V0TWF0Y2hpbmdDYW5kaWRhdGVzQ29udHJvbGxlcicpO1xuICAgIGxldCBzZWFyY2hTZXJ2aWNlID0gbmV3IFNlYXJjaFNlcnZpY2UoKTtcbiAgICBsZXQgcHJvZmlsZUlkID0gcmVxLnBhcmFtcy5pZDtcbiAgICBsZXQgcmVjcnVpdGVyU2VydmljZSA9IG5ldyBSZWNydWl0ZXJTZXJ2aWNlKCk7XG4gICAgcmVjcnVpdGVyU2VydmljZS5nZXRKb2JCeUlkKHByb2ZpbGVJZCwgKGVycjogYW55LCBqb2JSZXM6IEpvYlByb2ZpbGVNb2RlbCkgPT4ge1xuICAgICAgc2VhcmNoU2VydmljZS5nZXRNYXRjaGluZ0NhbmRpZGF0ZXMoam9iUmVzLCAoZXJyb3I6IEVycm9yLCByZXN1bHQ6IGFueSkgPT4ge1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgIG5leHQoZXJyb3IpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUudGltZUVuZCgnZ2V0TWF0Y2hpbmdDYW5kaWRhdGVzQ29udHJvbGxlcicpO1xuICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHJlc3VsdCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0TWF0Y2hpbmdKb2JQcm9maWxlcyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLG5leHQ6YW55KSB7XG4gICAgbGV0IHNlYXJjaFNlcnZpY2UgPSBuZXcgU2VhcmNoU2VydmljZSgpO1xuICAgIGxldCBjYW5kaWRhdGVTZXJ2aWNlID0gbmV3IENhbmRpZGF0ZVNlcnZpY2UoKTtcbiAgICBsZXQgY2FuZGlkYXRlSWQgPSByZXEucGFyYW1zLmlkO1xuICAgIGNhbmRpZGF0ZVNlcnZpY2UuZmluZEJ5SWQoY2FuZGlkYXRlSWQsIChlcnJvcjogRXJyb3IsIGNhbmRpUmVzOiBhbnkpID0+IHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICBuZXh0KGVycm9yKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNlYXJjaFNlcnZpY2UuZ2V0TWF0Y2hpbmdKb2JQcm9maWxlKGNhbmRpUmVzLCAoZXJyb3I6IEVycm9yLCByZXN1bHQ6IGFueSkgPT4ge1xuICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICBuZXh0KGVycm9yKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQocmVzdWx0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc2VhcmNoQ2FuZGlkYXRlSm9iUHJvZmlsZXMocmVxOmV4cHJlc3MuUmVxdWVzdCwgcmVzOmV4cHJlc3MuUmVzcG9uc2UsbmV4dDphbnkpIHtcbiAgICBsZXQgY2FuZGlkYXRlU2VhcmNoU2VydmljZSA9IG5ldyBDYW5kaWRhdGVTZWFyY2hTZXJ2aWNlKCk7XG4gICAgbGV0IGNhbmRpZGF0ZVNlcnZpY2UgPSBuZXcgQ2FuZGlkYXRlU2VydmljZSgpO1xuICAgIGxldCBjYW5kaWRhdGVJZCA9IHJlcS5wYXJhbXMuY2FuZGlkYXRlSWQ7XG4gICAgbGV0IHNlYXJjaFNlcnZpY2UgPSBuZXcgU2VhcmNoU2VydmljZSgpO1xuICAgIGxldCByZWNydWl0ZXJJZCA9IHJlcS5wYXJhbXMucmVjcnVpdGVySWQ7XG4gICAgY2FuZGlkYXRlU2VydmljZS5maW5kQnlJZChjYW5kaWRhdGVJZCwgKGVycm9yOkVycm9yLCBjYW5kaVJlczphbnkpID0+IHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgIG5leHQoZXJyb3IpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FuZGlkYXRlU2VhcmNoU2VydmljZS5zZWFyY2hNYXRjaGluZ0pvYlByb2ZpbGUoY2FuZGlSZXMsIHJlY3J1aXRlcklkLCAnc2VhcmNoVmlldycsIChlcnJvcjpFcnJvciwgcmVzdWx0OmFueSkgPT4ge1xuICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgbmV4dChlcnJvcik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhbmRpZGF0ZVNlYXJjaFNlcnZpY2UuZ2V0Q2FuZGlkYXRlSW5mb0J5SWQoW2NhbmRpZGF0ZUlkXSwgKGVycm9yLCBjYW5kaWRhdGVEZXRhaWxzKSA9PiB7XG4gICAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgIG5leHQoZXJyb3IpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBfY2FuZGlkYXRlRGV0YWlsczpDYW5kaWRhdGVEZXRhaWxzV2l0aEpvYk1hdGNoaW5nID0gc2VhcmNoU2VydmljZS5nZXRDYW5kaWRhdGVWaXNpYmlsaXR5QWdhaW5zdFJlY3J1aXRlcihjYW5kaWRhdGVEZXRhaWxzWzBdLCByZXN1bHQpO1xuICAgICAgICAgICAgICAgIF9jYW5kaWRhdGVEZXRhaWxzLmpvYlFDYXJkTWF0Y2hpbmcgPSBjYW5kaWRhdGVEZXRhaWxzWzBdLmlzVmlzaWJsZSA/IHJlc3VsdCA6IFtdO1xuICAgICAgICAgICAgICAgIHJlcy5zZW5kKHtcbiAgICAgICAgICAgICAgICAgICdzdGF0dXMnOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgICAnZGF0YSc6IF9jYW5kaWRhdGVEZXRhaWxzXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuXG59XG4iXX0=
