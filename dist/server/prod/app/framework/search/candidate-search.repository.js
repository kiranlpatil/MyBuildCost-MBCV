"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var CandidateSchema = require("../dataaccess/schemas/candidate.schema");
var CandidateCardViewModel = require("../dataaccess/model/candidate-card-view.model");
var RepositoryBase = require("../dataaccess/repository/base/repository.base");
var CandidateSearchRepository = (function (_super) {
    __extends(CandidateSearchRepository, _super);
    function CandidateSearchRepository() {
        return _super.call(this, CandidateSchema) || this;
    }
    CandidateSearchRepository.prototype.getCandidateByIndustry = function (jobProfile, callback) {
        var _this = this;
        if (jobProfile.industry.roles.length > 2) {
            CandidateSchema.find({
                $and: [
                    { 'industry.name': jobProfile.industry.name },
                    { 'industry.roles': { "$elemMatch": { name: jobProfile.industry.roles[0].name } } },
                    { 'industry.roles': { "$elemMatch": { name: jobProfile.industry.roles[1].name } } },
                    { 'industry.roles': { "$elemMatch": { name: jobProfile.industry.roles[2].name } } },
                ]
            }, function (error, res) {
                _this.filterCandidates(res, jobProfile.industry, callback);
            });
        }
        else if (jobProfile.industry.roles.length > 1) {
            CandidateSchema.find({
                $and: [
                    { 'industry.name': jobProfile.industry.name },
                    { 'industry.roles': { "$elemMatch": { name: jobProfile.industry.roles[0].name } } },
                    { 'industry.roles': { "$elemMatch": { name: jobProfile.industry.roles[1].name } } },
                ]
            }, function (error, res) {
                _this.filterCandidates(res, jobProfile.industry, callback);
            });
        }
        else if (jobProfile.industry.roles.length > 0) {
            CandidateSchema.find({
                $and: [
                    { 'industry.name': jobProfile.industry.name },
                    { 'industry.roles': { "$elemMatch": { name: jobProfile.industry.roles[0].name } } },
                ]
            }, function (error, res) {
                _this.filterCandidates(res, jobProfile.industry, callback);
            });
        }
    };
    CandidateSearchRepository.prototype.filterCandidates = function (candidates, industry, callback) {
        var countOfComplexity = 0;
        var satisfiedComplexity = 0;
        for (var _i = 0, _a = industry.roles; _i < _a.length; _i++) {
            var role = _a[_i];
            for (var _b = 0, _c = role.capabilities; _b < _c.length; _b++) {
                var capability = _c[_b];
                for (var _d = 0, _e = capability.complexities; _d < _e.length; _d++) {
                    var complexity = _e[_d];
                    countOfComplexity++;
                }
            }
        }
        var cardcandidates = new Array(0);
        for (var _f = 0, _g = industry.roles; _f < _g.length; _f++) {
            var role = _g[_f];
            for (var _h = 0, _j = role.capabilities; _h < _j.length; _h++) {
                var capability = _j[_h];
                for (var _k = 0, candidates_1 = candidates; _k < candidates_1.length; _k++) {
                    var candidate = candidates_1[_k];
                    var tempCandidate = new CandidateCardViewModel();
                    tempCandidate.userId = candidate.userId;
                    for (var _l = 0, _m = candidate.industry.roles; _l < _m.length; _l++) {
                        var candiRole = _m[_l];
                        for (var _o = 0, _p = candiRole.capabilities; _o < _p.length; _o++) {
                            var candiCapability = _p[_o];
                            if (capability.name == candiCapability.name) {
                                for (var _q = 0, _r = capability.complexities; _q < _r.length; _q++) {
                                    var complexity = _r[_q];
                                    for (var _s = 0, _t = candiCapability.complexities; _s < _t.length; _s++) {
                                        var candicomplexity = _t[_s];
                                        if (complexity.name == candicomplexity.name) {
                                            for (var _u = 0, _v = complexity.scenarios; _u < _v.length; _u++) {
                                                var scenario = _v[_u];
                                                if (scenario.isChecked) {
                                                    for (var _w = 0, _x = candicomplexity.scenarios; _w < _x.length; _w++) {
                                                        var candiScenario = _x[_w];
                                                        if (scenario.name == candiScenario.name) {
                                                            if (candiScenario.isChecked) {
                                                                tempCandidate.matchedComplexity++;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    tempCandidate.matching = (tempCandidate.matchedComplexity * 100) / countOfComplexity;
                    if (tempCandidate.matching > 0) {
                        cardcandidates.push(tempCandidate);
                    }
                }
            }
        }
        callback(null, cardcandidates);
    };
    return CandidateSearchRepository;
}(RepositoryBase));
Object
    .seal(CandidateSearchRepository);
module.exports = CandidateSearchRepository;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2VhcmNoL2NhbmRpZGF0ZS1zZWFyY2gucmVwb3NpdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHdFQUEyRTtBQUczRSxzRkFBeUY7QUFHekYsOEVBQWlGO0FBR2pGO0lBQXdDLDZDQUEwQjtJQUVoRTtlQUNFLGtCQUFNLGVBQWUsQ0FBQztJQUN4QixDQUFDO0lBRUQsMERBQXNCLEdBQXRCLFVBQXVCLFVBQTJCLEVBQUUsUUFBMkM7UUFBL0YsaUJBaUNDO1FBL0JDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pDLGVBQWUsQ0FBQyxJQUFJLENBQUM7Z0JBQ25CLElBQUksRUFBRTtvQkFDSixFQUFDLGVBQWUsRUFBRSxVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksRUFBQztvQkFDM0MsRUFBQyxnQkFBZ0IsRUFBRSxFQUFDLFlBQVksRUFBRSxFQUFDLElBQUksRUFBRSxVQUFVLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUMsRUFBQyxFQUFDO29CQUM3RSxFQUFDLGdCQUFnQixFQUFFLEVBQUMsWUFBWSxFQUFFLEVBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBQyxFQUFDLEVBQUM7b0JBQzdFLEVBQUMsZ0JBQWdCLEVBQUUsRUFBQyxZQUFZLEVBQUUsRUFBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFDLEVBQUMsRUFBQztpQkFDOUU7YUFDRixFQUFFLFVBQUMsS0FBVSxFQUFFLEdBQVE7Z0JBQ3RCLEtBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMs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RUFBekIsSUFBeUI7d0RBQTlDLElBQUksYUFBYSxTQUFBO3dEQUNwQixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxJQUFJLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDOzREQUN4QyxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnRUFDNUIsYUFBYSxDQUFDLGlCQUFpQixFQUFFLENBQUM7NERBQ3BDLENBQUM7d0RBQ0gsQ0FBQztxREFDRjtnREFDSCxDQUFDOzZDQUNGO3dDQUNILENBQUM7cUNBQ0Y7aUNBQ0Y7NEJBQ0gsQ0FBQzt5QkFDRjtxQkFDRjtvQkFDRCxhQUFhLENBQUMsUUFBUSxHQUFHLENBQUMsYUFBYSxDQUFDLGlCQUFpQixHQUFHLEdBQUcsQ0FBQyxHQUFHLGlCQUFpQixDQUFDO29CQUNyRixFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQy9CLGNBQWMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7b0JBQ3JDLENBQUM7aUJBQ0Y7YUFDRjtTQUNGO1FBQ0QsUUFBUSxDQUFDLElBQUksRUFBRSxjQUFjLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRUgsZ0NBQUM7QUFBRCxDQTFGQSxBQTBGQyxDQTFGdUMsY0FBYyxHQTBGckQ7QUFFRCxNQUFNO0tBQ0gsSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFFbkMsaUJBQVMseUJBQXlCLENBQUMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9zZWFyY2gvY2FuZGlkYXRlLXNlYXJjaC5yZXBvc2l0b3J5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENhbmRpZGF0ZVNjaGVtYSA9IHJlcXVpcmUoXCIuLi9kYXRhYWNjZXNzL3NjaGVtYXMvY2FuZGlkYXRlLnNjaGVtYVwiKTtcclxuaW1wb3J0IENhbmRpZGF0ZU1vZGVsID0gcmVxdWlyZShcIi4uL2RhdGFhY2Nlc3MvbW9kZWwvY2FuZGlkYXRlLm1vZGVsXCIpO1xyXG5pbXBvcnQgSW5kdXN0cnlNb2RlbCA9IHJlcXVpcmUoXCIuLi9kYXRhYWNjZXNzL21vZGVsL2luZHVzdHJ5Lm1vZGVsXCIpO1xyXG5pbXBvcnQgQ2FuZGlkYXRlQ2FyZFZpZXdNb2RlbCA9IHJlcXVpcmUoXCIuLi9kYXRhYWNjZXNzL21vZGVsL2NhbmRpZGF0ZS1jYXJkLXZpZXcubW9kZWxcIik7XHJcbmltcG9ydCBKb2JQcm9maWxlTW9kZWwgPSByZXF1aXJlKFwiLi4vZGF0YWFjY2Vzcy9tb2RlbC9qb2Jwcm9maWxlLm1vZGVsXCIpO1xyXG5pbXBvcnQgSUNhbmRpZGF0ZSA9IHJlcXVpcmUoXCIuLi9kYXRhYWNjZXNzL21vbmdvb3NlL2NhbmRpZGF0ZVwiKTtcclxuaW1wb3J0IFJlcG9zaXRvcnlCYXNlID0gcmVxdWlyZShcIi4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9iYXNlL3JlcG9zaXRvcnkuYmFzZVwiKTtcclxuXHJcblxyXG5jbGFzcyBDYW5kaWRhdGVTZWFyY2hSZXBvc2l0b3J5IGV4dGVuZHMgUmVwb3NpdG9yeUJhc2U8SUNhbmRpZGF0ZT4ge1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHN1cGVyKENhbmRpZGF0ZVNjaGVtYSk7XHJcbiAgfVxyXG5cclxuICBnZXRDYW5kaWRhdGVCeUluZHVzdHJ5KGpvYlByb2ZpbGU6IEpvYlByb2ZpbGVNb2RlbCwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkgeyAvL3RvZG8gY2hhbmdlIGl0IHdpdGggbmV3IGFwcHJvYWNoXHJcblxyXG4gICAgaWYgKGpvYlByb2ZpbGUuaW5kdXN0cnkucm9sZXMubGVuZ3RoID4gMikge1xyXG4gICAgICBDYW5kaWRhdGVTY2hlbWEuZmluZCh7XHJcbiAgICAgICAgJGFuZDogW1xyXG4gICAgICAgICAgeydpbmR1c3RyeS5uYW1lJzogam9iUHJvZmlsZS5pbmR1c3RyeS5uYW1lfSxcclxuICAgICAgICAgIHsnaW5kdXN0cnkucm9sZXMnOiB7XCIkZWxlbU1hdGNoXCI6IHtuYW1lOiBqb2JQcm9maWxlLmluZHVzdHJ5LnJvbGVzWzBdLm5hbWV9fX0sXHJcbiAgICAgICAgICB7J2luZHVzdHJ5LnJvbGVzJzoge1wiJGVsZW1NYXRjaFwiOiB7bmFtZTogam9iUHJvZmlsZS5pbmR1c3RyeS5yb2xlc1sxXS5uYW1lfX19LFxyXG4gICAgICAgICAgeydpbmR1c3RyeS5yb2xlcyc6IHtcIiRlbGVtTWF0Y2hcIjoge25hbWU6IGpvYlByb2ZpbGUuaW5kdXN0cnkucm9sZXNbMl0ubmFtZX19fSxcclxuICAgICAgICBdXHJcbiAgICAgIH0sIChlcnJvcjogYW55LCByZXM6IGFueSkgPT4ge1xyXG4gICAgICAgIHRoaXMuZmlsdGVyQ2FuZGlkYXRlcyhyZXMsIGpvYlByb2ZpbGUuaW5kdXN0cnksIGNhbGxiYWNrKTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2UgaWYgKGpvYlByb2ZpbGUuaW5kdXN0cnkucm9sZXMubGVuZ3RoID4gMSkge1xyXG4gICAgICBDYW5kaWRhdGVTY2hlbWEuZmluZCh7XHJcbiAgICAgICAgJGFuZDogW1xyXG4gICAgICAgICAgeydpbmR1c3RyeS5uYW1lJzogam9iUHJvZmlsZS5pbmR1c3RyeS5uYW1lfSxcclxuICAgICAgICAgIHsnaW5kdXN0cnkucm9sZXMnOiB7XCIkZWxlbU1hdGNoXCI6IHtuYW1lOiBqb2JQcm9maWxlLmluZHVzdHJ5LnJvbGVzWzBdLm5hbWV9fX0sXHJcbiAgICAgICAgICB7J2luZHVzdHJ5LnJvbGVzJzoge1wiJGVsZW1NYXRjaFwiOiB7bmFtZTogam9iUHJvZmlsZS5pbmR1c3RyeS5yb2xlc1sxXS5uYW1lfX19LFxyXG4gICAgICAgIF1cclxuICAgICAgfSwgKGVycm9yOiBhbnksIHJlczogYW55KSA9PiB7XHJcbiAgICAgICAgdGhpcy5maWx0ZXJDYW5kaWRhdGVzKHJlcywgam9iUHJvZmlsZS5pbmR1c3RyeSwgY2FsbGJhY2spO1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSBpZiAoam9iUHJvZmlsZS5pbmR1c3RyeS5yb2xlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgIENhbmRpZGF0ZVNjaGVtYS5maW5kKHtcclxuICAgICAgICAkYW5kOiBbXHJcbiAgICAgICAgICB7J2luZHVzdHJ5Lm5hbWUnOiBqb2JQcm9maWxlLmluZHVzdHJ5Lm5hbWV9LFxyXG4gICAgICAgICAgeydpbmR1c3RyeS5yb2xlcyc6IHtcIiRlbGVtTWF0Y2hcIjoge25hbWU6IGpvYlByb2ZpbGUuaW5kdXN0cnkucm9sZXNbMF0ubmFtZX19fSxcclxuICAgICAgICBdXHJcbiAgICAgIH0sIChlcnJvcjogYW55LCByZXM6IGFueSkgPT4ge1xyXG4gICAgICAgIHRoaXMuZmlsdGVyQ2FuZGlkYXRlcyhyZXMsIGpvYlByb2ZpbGUuaW5kdXN0cnksIGNhbGxiYWNrKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmaWx0ZXJDYW5kaWRhdGVzKGNhbmRpZGF0ZXM6IENhbmRpZGF0ZU1vZGVsW10sIGluZHVzdHJ5OiBJbmR1c3RyeU1vZGVsLCBjYWxsYmFjazogKGVycjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbGV0IGNvdW50T2ZDb21wbGV4aXR5ID0gMDtcclxuICAgIGxldCBzYXRpc2ZpZWRDb21wbGV4aXR5ID0gMDtcclxuICAgIGZvciAobGV0IHJvbGUgb2YgaW5kdXN0cnkucm9sZXMpIHtcclxuICAgICAgZm9yIChsZXQgY2FwYWJpbGl0eSBvZiByb2xlLmNhcGFiaWxpdGllcykge1xyXG4gICAgICAgIGZvciAobGV0IGNvbXBsZXhpdHkgb2YgY2FwYWJpbGl0eS5jb21wbGV4aXRpZXMpIHtcclxuICAgICAgICAgIGNvdW50T2ZDb21wbGV4aXR5Kys7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBsZXQgY2FyZGNhbmRpZGF0ZXM6IENhbmRpZGF0ZUNhcmRWaWV3TW9kZWxbXSA9IG5ldyBBcnJheSgwKTtcclxuICAgIGZvciAobGV0IHJvbGUgb2YgaW5kdXN0cnkucm9sZXMpIHtcclxuICAgICAgZm9yIChsZXQgY2FwYWJpbGl0eSBvZiByb2xlLmNhcGFiaWxpdGllcykge1xyXG4gICAgICAgIGZvciAobGV0IGNhbmRpZGF0ZSBvZiBjYW5kaWRhdGVzKSB7XHJcbiAgICAgICAgICBsZXQgdGVtcENhbmRpZGF0ZTogQ2FuZGlkYXRlQ2FyZFZpZXdNb2RlbCA9IG5ldyBDYW5kaWRhdGVDYXJkVmlld01vZGVsKCk7XHJcbiAgICAgICAgICB0ZW1wQ2FuZGlkYXRlLnVzZXJJZCA9IGNhbmRpZGF0ZS51c2VySWQ7XHJcbiAgICAgICAgICBmb3IgKGxldCBjYW5kaVJvbGUgb2YgY2FuZGlkYXRlLmluZHVzdHJ5LnJvbGVzKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGNhbmRpQ2FwYWJpbGl0eSBvZiBjYW5kaVJvbGUuY2FwYWJpbGl0aWVzKSB7XHJcbiAgICAgICAgICAgICAgaWYgKGNhcGFiaWxpdHkubmFtZSA9PSBjYW5kaUNhcGFiaWxpdHkubmFtZSkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgY29tcGxleGl0eSBvZiBjYXBhYmlsaXR5LmNvbXBsZXhpdGllcykge1xyXG4gICAgICAgICAgICAgICAgICBmb3IgKGxldCBjYW5kaWNvbXBsZXhpdHkgb2YgY2FuZGlDYXBhYmlsaXR5LmNvbXBsZXhpdGllcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjb21wbGV4aXR5Lm5hbWUgPT0gY2FuZGljb21wbGV4aXR5Lm5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IHNjZW5hcmlvIG9mIGNvbXBsZXhpdHkuc2NlbmFyaW9zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzY2VuYXJpby5pc0NoZWNrZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBjYW5kaVNjZW5hcmlvIG9mIGNhbmRpY29tcGxleGl0eS5zY2VuYXJpb3MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzY2VuYXJpby5uYW1lID09IGNhbmRpU2NlbmFyaW8ubmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FuZGlTY2VuYXJpby5pc0NoZWNrZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wQ2FuZGlkYXRlLm1hdGNoZWRDb21wbGV4aXR5Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRlbXBDYW5kaWRhdGUubWF0Y2hpbmcgPSAodGVtcENhbmRpZGF0ZS5tYXRjaGVkQ29tcGxleGl0eSAqIDEwMCkgLyBjb3VudE9mQ29tcGxleGl0eTtcclxuICAgICAgICAgIGlmICh0ZW1wQ2FuZGlkYXRlLm1hdGNoaW5nID4gMCkge1xyXG4gICAgICAgICAgICBjYXJkY2FuZGlkYXRlcy5wdXNoKHRlbXBDYW5kaWRhdGUpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY2FsbGJhY2sobnVsbCwgY2FyZGNhbmRpZGF0ZXMpO1xyXG4gIH1cclxuXHJcbn1cclxuXHJcbk9iamVjdFxyXG4gIC5zZWFsKENhbmRpZGF0ZVNlYXJjaFJlcG9zaXRvcnkpO1xyXG5cclxuZXhwb3J0ID0gQ2FuZGlkYXRlU2VhcmNoUmVwb3NpdG9yeTtcclxuIl19
