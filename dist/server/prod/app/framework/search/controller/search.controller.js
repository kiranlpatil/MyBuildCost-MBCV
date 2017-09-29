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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2VhcmNoL2NvbnRyb2xsZXIvc2VhcmNoLmNvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSwwREFBNkQ7QUFDN0QsbUVBQXNFO0FBQ3RFLG1FQUFzRTtBQUN0RSxnRkFBbUY7QUFFbkY7SUFBQTtJQXdFQSxDQUFDO0lBdEVDLGdEQUFxQixHQUFyQixVQUFzQixHQUFvQixFQUFFLEdBQXFCO1FBQy9ELE9BQU8sQ0FBQyxJQUFJLENBQUMsaUNBQWlDLENBQUMsQ0FBQztRQUNoRCxJQUFJLGFBQWEsR0FBRyxJQUFJLGFBQWEsRUFBRSxDQUFDO1FBQ3hDLElBQUksU0FBUyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO1FBQzlCLElBQUksZ0JBQWdCLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO1FBQzlDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsVUFBQyxHQUFRLEVBQUUsTUFBdUI7WUFDdkUsYUFBYSxDQUFDLHFCQUFxQixDQUFDLE1BQU0sRUFBRSxVQUFDLEtBQVksRUFBRSxNQUFXO2dCQUNwRSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUNWLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUM5QixDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNOLE9BQU8sQ0FBQyxPQUFPLENBQUMsaUNBQWlDLENBQUMsQ0FBQztvQkFDbkQsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQy9CLENBQUM7WUFDSCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELGlEQUFzQixHQUF0QixVQUF1QixHQUFvQixFQUFFLEdBQXFCO1FBQ2hFLElBQUksYUFBYSxHQUFHLElBQUksYUFBYSxFQUFFLENBQUM7UUFDeEMsSUFBSSxnQkFBZ0IsR0FBRyxJQUFJLGdCQUFnQixFQUFFLENBQUM7UUFDOUMsSUFBSSxXQUFXLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7UUFDaEMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxVQUFDLEtBQVksRUFBRSxRQUFhO1lBQ2pFLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ1YsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDOUIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLGFBQWEsQ0FBQyxxQkFBcUIsQ0FBQyxRQUFRLEVBQUUsVUFBQyxLQUFZLEVBQUUsTUFBVztvQkFDdEUsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzt3QkFDVixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDOUIsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDTixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDL0IsQ0FBQztnQkFDSCxDQUFDLENBQUMsQ0FBQztZQUNMLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxxREFBMEIsR0FBMUIsVUFBMkIsR0FBbUIsRUFBRSxHQUFvQjtRQUNsRSxJQUFJLHNCQUFzQixHQUFHLElBQUksc0JBQXNCLEVBQUUsQ0FBQztRQUMxRCxJQUFJLGdCQUFnQixHQUFHLElBQUksZ0JBQWdCLEVBQUUsQ0FBQztRQUM5QyxJQUFJLFdBQVcsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQztRQUN6QyxJQUFJLGFBQWEsR0FBRyxJQUFJLGFBQWEsRUFBRSxDQUFDO1FBQ3hDLElBQUksV0FBVyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDO1FBQ3pDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsVUFBQyxLQUFXLEVBQUUsUUFBWTtZQUMvRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNWLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzlCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixzQkFBc0IsQ0FBQyx3QkFBd0IsQ0FBQyxRQUFRLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBRSxVQUFDLEtBQVcsRUFBRSxNQUFVO29CQUMzRyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO3dCQUNWLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUM5QixDQUFDO29CQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNOLHNCQUFzQixDQUFDLG9CQUFvQixDQUFDLENBQUMsV0FBVyxDQUFDLEVBQUUsVUFBQyxLQUFLLEVBQUUsZ0JBQWdCOzRCQUNqRixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dDQUNWLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDOzRCQUM5QixDQUFDOzRCQUNELElBQUksQ0FBQyxDQUFDO2dDQUNKLElBQUksaUJBQWlCLEdBQW1DLGFBQWEsQ0FBQyxzQ0FBc0MsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztnQ0FDMUksaUJBQWlCLENBQUMsZ0JBQWdCLEdBQUcsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxHQUFHLE1BQU0sR0FBRyxFQUFFLENBQUM7Z0NBQ2pGLEdBQUcsQ0FBQyxJQUFJLENBQUM7b0NBQ1AsUUFBUSxFQUFFLFNBQVM7b0NBQ25CLE1BQU0sRUFBRSxpQkFBaUI7aUNBQzFCLENBQUMsQ0FBQzs0QkFDTCxDQUFDO3dCQUNILENBQUMsQ0FBQyxDQUFDO29CQUNMLENBQUM7Z0JBQ0gsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBR0gsdUJBQUM7QUFBRCxDQXhFQSxBQXdFQyxJQUFBO0FBeEVZLDRDQUFnQiIsImZpbGUiOiJhcHAvZnJhbWV3b3JrL3NlYXJjaC9jb250cm9sbGVyL3NlYXJjaC5jb250cm9sbGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZXhwcmVzcyBmcm9tIFwiZXhwcmVzc1wiO1xuaW1wb3J0IHtDYW5kaWRhdGVEZXRhaWxzV2l0aEpvYk1hdGNoaW5nfSBmcm9tIFwiLi4vLi4vZGF0YWFjY2Vzcy9tb2RlbC9jYW5kaWRhdGVkZXRhaWxzd2l0aGpvYm1hdGNoaW5nXCI7XG5pbXBvcnQgSm9iUHJvZmlsZU1vZGVsID0gcmVxdWlyZSgnLi4vLi4vZGF0YWFjY2Vzcy9tb2RlbC9qb2Jwcm9maWxlLm1vZGVsJyk7XG5pbXBvcnQgU2VhcmNoU2VydmljZSA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL3NlYXJjaC5zZXJ2aWNlJyk7XG5pbXBvcnQgQ2FuZGlkYXRlU2VydmljZSA9IHJlcXVpcmUoJy4uLy4uL3NlcnZpY2VzL2NhbmRpZGF0ZS5zZXJ2aWNlJyk7XG5pbXBvcnQgUmVjcnVpdGVyU2VydmljZSA9IHJlcXVpcmUoJy4uLy4uL3NlcnZpY2VzL3JlY3J1aXRlci5zZXJ2aWNlJyk7XG5pbXBvcnQgQ2FuZGlkYXRlU2VhcmNoU2VydmljZSA9IHJlcXVpcmUoJy4uLy4uL3NlcnZpY2VzL2NhbmRpZGF0ZS1zZWFyY2guc2VydmljZScpO1xuXG5leHBvcnQgY2xhc3MgU2VhcmNoQ29udHJvbGxlciB7XG5cbiAgZ2V0TWF0Y2hpbmdDYW5kaWRhdGVzKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UpIHtcbiAgICBjb25zb2xlLnRpbWUoJ2dldE1hdGNoaW5nQ2FuZGlkYXRlc0NvbnRyb2xsZXInKTtcbiAgICBsZXQgc2VhcmNoU2VydmljZSA9IG5ldyBTZWFyY2hTZXJ2aWNlKCk7XG4gICAgbGV0IHByb2ZpbGVJZCA9IHJlcS5wYXJhbXMuaWQ7XG4gICAgbGV0IHJlY3J1aXRlclNlcnZpY2UgPSBuZXcgUmVjcnVpdGVyU2VydmljZSgpO1xuICAgIHJlY3J1aXRlclNlcnZpY2UuZ2V0Sm9iQnlJZChwcm9maWxlSWQsIChlcnI6IGFueSwgam9iUmVzOiBKb2JQcm9maWxlTW9kZWwpID0+IHtcbiAgICAgIHNlYXJjaFNlcnZpY2UuZ2V0TWF0Y2hpbmdDYW5kaWRhdGVzKGpvYlJlcywgKGVycm9yOiBFcnJvciwgcmVzdWx0OiBhbnkpID0+IHtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgcmVzLnN0YXR1cygzMDQpLnNlbmQoZXJyb3IpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUudGltZUVuZCgnZ2V0TWF0Y2hpbmdDYW5kaWRhdGVzQ29udHJvbGxlcicpO1xuICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHJlc3VsdCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0TWF0Y2hpbmdKb2JQcm9maWxlcyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlKSB7XG4gICAgbGV0IHNlYXJjaFNlcnZpY2UgPSBuZXcgU2VhcmNoU2VydmljZSgpO1xuICAgIGxldCBjYW5kaWRhdGVTZXJ2aWNlID0gbmV3IENhbmRpZGF0ZVNlcnZpY2UoKTtcbiAgICBsZXQgY2FuZGlkYXRlSWQgPSByZXEucGFyYW1zLmlkO1xuICAgIGNhbmRpZGF0ZVNlcnZpY2UuZmluZEJ5SWQoY2FuZGlkYXRlSWQsIChlcnJvcjogRXJyb3IsIGNhbmRpUmVzOiBhbnkpID0+IHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICByZXMuc3RhdHVzKDMwNCkuc2VuZChlcnJvcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWFyY2hTZXJ2aWNlLmdldE1hdGNoaW5nSm9iUHJvZmlsZShjYW5kaVJlcywgKGVycm9yOiBFcnJvciwgcmVzdWx0OiBhbnkpID0+IHtcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoMzA0KS5zZW5kKGVycm9yKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQocmVzdWx0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc2VhcmNoQ2FuZGlkYXRlSm9iUHJvZmlsZXMocmVxOmV4cHJlc3MuUmVxdWVzdCwgcmVzOmV4cHJlc3MuUmVzcG9uc2UpIHtcbiAgICBsZXQgY2FuZGlkYXRlU2VhcmNoU2VydmljZSA9IG5ldyBDYW5kaWRhdGVTZWFyY2hTZXJ2aWNlKCk7XG4gICAgbGV0IGNhbmRpZGF0ZVNlcnZpY2UgPSBuZXcgQ2FuZGlkYXRlU2VydmljZSgpO1xuICAgIGxldCBjYW5kaWRhdGVJZCA9IHJlcS5wYXJhbXMuY2FuZGlkYXRlSWQ7XG4gICAgbGV0IHNlYXJjaFNlcnZpY2UgPSBuZXcgU2VhcmNoU2VydmljZSgpO1xuICAgIGxldCByZWNydWl0ZXJJZCA9IHJlcS5wYXJhbXMucmVjcnVpdGVySWQ7XG4gICAgY2FuZGlkYXRlU2VydmljZS5maW5kQnlJZChjYW5kaWRhdGVJZCwgKGVycm9yOkVycm9yLCBjYW5kaVJlczphbnkpID0+IHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICByZXMuc3RhdHVzKDMwNCkuc2VuZChlcnJvcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYW5kaWRhdGVTZWFyY2hTZXJ2aWNlLnNlYXJjaE1hdGNoaW5nSm9iUHJvZmlsZShjYW5kaVJlcywgcmVjcnVpdGVySWQsICdzZWFyY2hWaWV3JywgKGVycm9yOkVycm9yLCByZXN1bHQ6YW55KSA9PiB7XG4gICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICByZXMuc3RhdHVzKDMwNCkuc2VuZChlcnJvcik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhbmRpZGF0ZVNlYXJjaFNlcnZpY2UuZ2V0Q2FuZGlkYXRlSW5mb0J5SWQoW2NhbmRpZGF0ZUlkXSwgKGVycm9yLCBjYW5kaWRhdGVEZXRhaWxzKSA9PiB7XG4gICAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMzA0KS5zZW5kKGVycm9yKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgX2NhbmRpZGF0ZURldGFpbHM6Q2FuZGlkYXRlRGV0YWlsc1dpdGhKb2JNYXRjaGluZyA9IHNlYXJjaFNlcnZpY2UuZ2V0Q2FuZGlkYXRlVmlzaWJpbGl0eUFnYWluc3RSZWNydWl0ZXIoY2FuZGlkYXRlRGV0YWlsc1swXSwgcmVzdWx0KTtcbiAgICAgICAgICAgICAgICBfY2FuZGlkYXRlRGV0YWlscy5qb2JRQ2FyZE1hdGNoaW5nID0gY2FuZGlkYXRlRGV0YWlsc1swXS5pc1Zpc2libGUgPyByZXN1bHQgOiBbXTtcbiAgICAgICAgICAgICAgICByZXMuc2VuZCh7XG4gICAgICAgICAgICAgICAgICAnc3RhdHVzJzogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgICAgJ2RhdGEnOiBfY2FuZGlkYXRlRGV0YWlsc1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cblxufVxuIl19
