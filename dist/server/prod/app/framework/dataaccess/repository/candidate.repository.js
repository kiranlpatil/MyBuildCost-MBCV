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
var CandidateSchema = require("../schemas/candidate.schema");
var RepositoryBase = require("./base/repository.base");
var candidate_q_card_1 = require("../../search/model/candidate-q-card");
var sharedconstants_1 = require("../../shared/sharedconstants");
var UserRepository = require("./user.repository");
var CandidateRepository = (function (_super) {
    __extends(CandidateRepository, _super);
    function CandidateRepository() {
        return _super.call(this, CandidateSchema) || this;
    }
    CandidateRepository.prototype.getCandidateQCard = function (candidates, jobProfile, candidatesIds, callback) {
        console.time('getCandidateQCardForLoop');
        var candidate_q_card_map = {};
        var idsOfSelectedCandidates = new Array(0);
        for (var _i = 0, candidates_1 = candidates; _i < candidates_1.length; _i++) {
            var candidate = candidates_1[_i];
            var isFound = false;
            if (candidatesIds) {
                if (candidatesIds.indexOf(candidate._id.toString()) === -1) {
                    continue;
                }
            }
            else {
                if (jobProfile.candidate_list) {
                    for (var _a = 0, _b = jobProfile.candidate_list; _a < _b.length; _a++) {
                        var list = _b[_a];
                        if (list.name === sharedconstants_1.ConstVariables.SHORT_LISTED_CANDIDATE) {
                            continue;
                        }
                        if (list.ids.indexOf(candidate._id.toString()) !== -1) {
                            isFound = true;
                            break;
                        }
                    }
                }
                if (isFound) {
                    continue;
                }
            }
            var candidate_card_view = new candidate_q_card_1.CandidateQCard();
            candidate_card_view.matching = 0;
            var count = 0;
            for (var cap in jobProfile.capability_matrix) {
                if (jobProfile.capability_matrix[cap] == -1 || jobProfile.capability_matrix[cap] == 0 || jobProfile.capability_matrix[cap] == undefined) {
                }
                else if (jobProfile.capability_matrix[cap] == candidate.capability_matrix[cap]) {
                    candidate_card_view.exact_matching += 1;
                    count++;
                }
                else if (jobProfile.capability_matrix[cap] == (Number(candidate.capability_matrix[cap]) - sharedconstants_1.ConstVariables.DIFFERENCE_IN_COMPLEXITY_SCENARIO)) {
                    candidate_card_view.above_one_step_matching += 1;
                    count++;
                }
                else if (jobProfile.capability_matrix[cap] == (Number(candidate.capability_matrix[cap]) + sharedconstants_1.ConstVariables.DIFFERENCE_IN_COMPLEXITY_SCENARIO)) {
                    candidate_card_view.below_one_step_matching += 1;
                    count++;
                }
                else if (jobProfile.complexity_musthave_matrix == -1 || jobProfile.complexity_musthave_matrix == undefined) {
                    candidate_card_view.complexityIsMustHave = false;
                }
                else if (jobProfile.complexity_musthave_matrix[cap]) {
                    if (jobProfile.capability_matrix[cap] == candidate.capability_matrix[cap]) {
                        candidate_card_view.complexityIsMustHave = jobProfile.complexity_musthave_matrix[cap];
                    }
                    else {
                        candidate_card_view.complexityIsMustHave = false;
                    }
                }
                else {
                    count++;
                }
            }
            candidate_card_view.above_one_step_matching = (candidate_card_view.above_one_step_matching / count) * 100;
            candidate_card_view.below_one_step_matching = (candidate_card_view.below_one_step_matching / count) * 100;
            candidate_card_view.exact_matching = (candidate_card_view.exact_matching / count) * 100;
            candidate_card_view.matching = candidate_card_view.above_one_step_matching + candidate_card_view.below_one_step_matching + candidate_card_view.exact_matching;
            candidate_card_view.salary = candidate.professionalDetails.currentSalary;
            candidate_card_view.experience = candidate.professionalDetails.experience;
            candidate_card_view.education = candidate.professionalDetails.education;
            candidate_card_view.proficiencies = candidate.proficiencies;
            candidate_card_view.interestedIndustries = candidate.interestedIndustries;
            candidate_card_view._id = candidate._id;
            candidate_card_view.isVisible = candidate.isVisible;
            if (candidate.location) {
                candidate_card_view.location = candidate.location.city;
            }
            else {
                candidate_card_view.location = 'Pune';
            }
            candidate_card_view.noticePeriod = candidate.professionalDetails.noticePeriod;
            if ((candidate_card_view.above_one_step_matching + candidate_card_view.exact_matching) >= sharedconstants_1.ConstVariables.LOWER_LIMIT_FOR_SEARCH_RESULT) {
                candidate_q_card_map[candidate.userId] = candidate_card_view;
                idsOfSelectedCandidates.push(candidate.userId);
            }
        }
        var candidates_q_cards_send = new Array(0);
        var userRepository = new UserRepository();
        console.timeEnd('getCandidateQCardForLoop');
        userRepository.retrieveByMultiIds(idsOfSelectedCandidates, {}, function (error, res) {
            if (error) {
                callback(error, null);
            }
            else {
                if (res.length > 0) {
                    console.time('retrieveByMultiIds');
                    for (var _i = 0, res_1 = res; _i < res_1.length; _i++) {
                        var user = res_1[_i];
                        var candidateQcard = candidate_q_card_map[user._id];
                        candidateQcard.email = user.email;
                        candidateQcard.first_name = user.first_name;
                        candidateQcard.last_name = user.last_name;
                        candidateQcard.mobile_number = user.mobile_number;
                        candidateQcard.picture = user.picture;
                        candidates_q_cards_send.push(candidateQcard);
                    }
                    candidates_q_cards_send.sort(function (first, second) {
                        if ((first.above_one_step_matching + first.exact_matching) > (second.above_one_step_matching + second.exact_matching)) {
                            return -1;
                        }
                        if ((first.above_one_step_matching + first.exact_matching) < (second.above_one_step_matching + second.exact_matching)) {
                            return 1;
                        }
                        return 0;
                    });
                    console.timeEnd('retrieveByMultiIds');
                    callback(null, candidates_q_cards_send);
                }
                else {
                    callback(null, candidates_q_cards_send);
                }
            }
        });
    };
    CandidateRepository.prototype.getCodesFromindustry = function (industry) {
        console.time('getCodesFromindustry');
        var selected_complexity = new Array(0);
        for (var _i = 0, _a = industry.roles; _i < _a.length; _i++) {
            var role = _a[_i];
            for (var _b = 0, _c = role.default_complexities; _b < _c.length; _b++) {
                var capability = _c[_b];
                for (var _d = 0, _e = capability.complexities; _d < _e.length; _d++) {
                    var complexity = _e[_d];
                    for (var _f = 0, _g = complexity.scenarios; _f < _g.length; _f++) {
                        var scenario = _g[_f];
                        if (scenario.isChecked) {
                            if (scenario.code) {
                                selected_complexity.push(scenario.code);
                            }
                        }
                    }
                }
            }
            for (var _h = 0, _j = role.capabilities; _h < _j.length; _h++) {
                var capability = _j[_h];
                for (var _k = 0, _l = capability.complexities; _k < _l.length; _k++) {
                    var complexity = _l[_k];
                    for (var _m = 0, _o = complexity.scenarios; _m < _o.length; _m++) {
                        var scenario = _o[_m];
                        if (scenario.isChecked) {
                            if (scenario.code) {
                                selected_complexity.push(scenario.code);
                            }
                        }
                    }
                }
            }
        }
        console.time('getCodesFromindustry');
        return selected_complexity;
    };
    return CandidateRepository;
}(RepositoryBase));
Object
    .seal(CandidateRepository);
module.exports = CandidateRepository;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L2NhbmRpZGF0ZS5yZXBvc2l0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsNkRBQWdFO0FBQ2hFLHVEQUEwRDtBQUUxRCx3RUFBbUU7QUFDbkUsZ0VBQTREO0FBSzVELGtEQUFxRDtBQUlyRDtJQUFrQyx1Q0FBMEI7SUFFMUQ7ZUFDRSxrQkFBTSxlQUFlLENBQUM7SUFDeEIsQ0FBQztJQUdELCtDQUFpQixHQUFqQixVQUFrQixVQUFpQixFQUFFLFVBQTJCLEVBQUUsYUFBdUIsRUFBRSxRQUFzQztRQUMvSCxPQUFPLENBQUMsSUFBSSxDQUFDLDBCQUEwQixDQUFDLENBQUM7UUFDekMsSUFBSSxvQkFBb0IsR0FBUSxFQUFHLENBQUM7UUFDcEMsSUFBSSx1QkFBdUIsR0FBYSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyRCxHQUFHLENBQUMsQ0FBa0IsVUFBVSxFQUFWLHlCQUFVLEVBQVYsd0JBQVUsRUFBVixJQUFVO1lBQTNCLElBQUksU0FBUyxtQkFBQTtZQUNoQixJQUFJLE9BQU8sR0FBWSxLQUFLLENBQUM7WUFDN0IsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFDbEIsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMzRCxRQUFRLENBQUM7Z0JBQ1gsQ0FBQztZQUNILENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztvQkFDOUIsR0FBRyxDQUFDLENBQWEsVUFBeUIsRUFBekIsS0FBQSxVQUFVLENBQUMsY0FBYyxFQUF6QixjQUF5QixFQUF6QixJQUF5Qjt3QkFBckMsSUFBSSxJQUFJLFNB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RjtpQkFDRjthQUNGO1lBRUQsR0FBRyxDQUFDLENBQW1CLFVBQWlCLEVBQWpCLEtBQUEsSUFBSSxDQUFDLFlBQVksRUFBakIsY0FBaUIsRUFBakIsSUFBaUI7Z0JBQW5DLElBQUksVUFBVSxTQUFBO2dCQUNqQixHQUFHLENBQUMsQ0FBbUIsVUFBdUIsRUFBdkIsS0FBQSxVQUFVLENBQUMsWUFBWSxFQUF2QixjQUF1QixFQUF2QixJQUF1QjtvQkFBekMsSUFBSSxVQUFVLFNBQUE7b0JBQ2pCLEdBQUcsQ0FBQyxDQUFpQixVQUFvQixFQUFwQixLQUFBLFVBQVUsQ0FBQyxTQUFTLEVBQXBCLGNBQW9CLEVBQXBCLElBQW9CO3dCQUFwQyxJQUFJLFFBQVEsU0FBQTt3QkFDZixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQzs0QkFDdkIsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0NBQ2xCLG1CQUFtQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7NEJBQzFDLENBQUM7d0JBQ0gsQ0FBQztxQkFDRjtpQkFDRjthQUNGO1NBQ0Y7UUFDRCxPQUFPLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUM7UUFDckMsTUFBTSxDQUFDLG1CQUFtQixDQUFDO0lBQzdCLENBQUM7SUFHSCwwQkFBQztBQUFELENBMUpBLEFBMEpDLENBMUppQyxjQUFjLEdBMEovQztBQUVELE1BQU07S0FDSCxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUU3QixpQkFBUyxtQkFBbUIsQ0FBQyIsImZpbGUiOiJhcHAvZnJhbWV3b3JrL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9jYW5kaWRhdGUucmVwb3NpdG9yeS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDYW5kaWRhdGVTY2hlbWEgPSByZXF1aXJlKFwiLi4vc2NoZW1hcy9jYW5kaWRhdGUuc2NoZW1hXCIpO1xyXG5pbXBvcnQgUmVwb3NpdG9yeUJhc2UgPSByZXF1aXJlKFwiLi9iYXNlL3JlcG9zaXRvcnkuYmFzZVwiKTtcclxuaW1wb3J0IElDYW5kaWRhdGUgPSByZXF1aXJlKFwiLi4vbW9uZ29vc2UvY2FuZGlkYXRlXCIpO1xyXG5pbXBvcnQge0NhbmRpZGF0ZVFDYXJkfSBmcm9tIFwiLi4vLi4vc2VhcmNoL21vZGVsL2NhbmRpZGF0ZS1xLWNhcmRcIjtcclxuaW1wb3J0IHtDb25zdFZhcmlhYmxlc30gZnJvbSBcIi4uLy4uL3NoYXJlZC9zaGFyZWRjb25zdGFudHNcIjtcclxuaW1wb3J0IEpvYlByb2ZpbGVNb2RlbCA9IHJlcXVpcmUoXCIuLi9tb2RlbC9qb2Jwcm9maWxlLm1vZGVsXCIpO1xyXG5pbXBvcnQgQ2FuZGlkYXRlTW9kZWwgPSByZXF1aXJlKFwiLi4vbW9kZWwvY2FuZGlkYXRlLm1vZGVsXCIpO1xyXG5pbXBvcnQgSW5kdXN0cnlNb2RlbCA9IHJlcXVpcmUoXCIuLi9tb2RlbC9pbmR1c3RyeS5tb2RlbFwiKTtcclxuaW1wb3J0IENhbmRpZGF0ZUNhcmRWaWV3TW9kZWwgPSByZXF1aXJlKFwiLi4vbW9kZWwvY2FuZGlkYXRlLWNhcmQtdmlldy5tb2RlbFwiKTtcclxuaW1wb3J0IFVzZXJSZXBvc2l0b3J5ID0gcmVxdWlyZShcIi4vdXNlci5yZXBvc2l0b3J5XCIpO1xyXG5pbXBvcnQgVXNlck1vZGVsID0gcmVxdWlyZShcIi4uL21vZGVsL3VzZXIubW9kZWxcIik7XHJcblxyXG5cclxuY2xhc3MgQ2FuZGlkYXRlUmVwb3NpdG9yeSBleHRlbmRzIFJlcG9zaXRvcnlCYXNlPElDYW5kaWRhdGU+IHtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICBzdXBlcihDYW5kaWRhdGVTY2hlbWEpO1xyXG4gIH1cclxuXHJcblxyXG4gIGdldENhbmRpZGF0ZVFDYXJkKGNhbmRpZGF0ZXM6IGFueVtdLCBqb2JQcm9maWxlOiBKb2JQcm9maWxlTW9kZWwsIGNhbmRpZGF0ZXNJZHM6IHN0cmluZ1tdLCBjYWxsYmFjazogKGVycjogYW55LCByZXM6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgY29uc29sZS50aW1lKCdnZXRDYW5kaWRhdGVRQ2FyZEZvckxvb3AnKTtcclxuICAgIGxldCBjYW5kaWRhdGVfcV9jYXJkX21hcCA6YW55ID0geyB9O1xyXG4gICAgbGV0IGlkc09mU2VsZWN0ZWRDYW5kaWRhdGVzIDogc3RyaW5nW109IG5ldyBBcnJheSgwKTtcclxuICAgIGZvciAobGV0IGNhbmRpZGF0ZSBvZiBjYW5kaWRhdGVzKSB7XHJcbiAgICAgIGxldCBpc0ZvdW5kOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgIGlmIChjYW5kaWRhdGVzSWRzKSB7XHJcbiAgICAgICAgaWYgKGNhbmRpZGF0ZXNJZHMuaW5kZXhPZihjYW5kaWRhdGUuX2lkLnRvU3RyaW5nKCkpID09PSAtMSkge1xyXG4gICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChqb2JQcm9maWxlLmNhbmRpZGF0ZV9saXN0KSB7XHJcbiAgICAgICAgICBmb3IgKGxldCBsaXN0IG9mIGpvYlByb2ZpbGUuY2FuZGlkYXRlX2xpc3QpIHtcclxuICAgICAgICAgICAgaWYgKGxpc3QubmFtZSA9PT0gQ29uc3RWYXJpYWJsZXMuU0hPUlRfTElTVEVEX0NBTkRJREFURSkge1xyXG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChsaXN0Lmlkcy5pbmRleE9mKGNhbmRpZGF0ZS5faWQudG9TdHJpbmcoKSkgIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgaXNGb3VuZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGlzRm91bmQpIHtcclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBsZXQgY2FuZGlkYXRlX2NhcmRfdmlldzogQ2FuZGlkYXRlUUNhcmQgPSBuZXcgQ2FuZGlkYXRlUUNhcmQoKTtcclxuICAgICAgY2FuZGlkYXRlX2NhcmRfdmlldy5tYXRjaGluZyA9IDA7XHJcbiAgICAgIGxldCBjb3VudCA9MDtcclxuICAgICAgZm9yIChsZXQgY2FwIGluIGpvYlByb2ZpbGUuY2FwYWJpbGl0eV9tYXRyaXgpIHtcclxuICAgICAgICBpZiAoam9iUHJvZmlsZS5jYXBhYmlsaXR5X21hdHJpeFtjYXBdID09IC0xIHx8IGpvYlByb2ZpbGUuY2FwYWJpbGl0eV9tYXRyaXhbY2FwXSA9PSAwIHx8IGpvYlByb2ZpbGUuY2FwYWJpbGl0eV9tYXRyaXhbY2FwXSA9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICB9IGVsc2UgaWYgKGpvYlByb2ZpbGUuY2FwYWJpbGl0eV9tYXRyaXhbY2FwXSA9PSBjYW5kaWRhdGUuY2FwYWJpbGl0eV9tYXRyaXhbY2FwXSkge1xyXG4gICAgICAgICAgICBjYW5kaWRhdGVfY2FyZF92aWV3LmV4YWN0X21hdGNoaW5nICs9IDE7XHJcbiAgICAgICAgICBjb3VudCsrO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoam9iUHJvZmlsZS5jYXBhYmlsaXR5X21hdHJpeFtjYXBdID09IChOdW1iZXIoY2FuZGlkYXRlLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0pIC0gQ29uc3RWYXJpYWJsZXMuRElGRkVSRU5DRV9JTl9DT01QTEVYSVRZX1NDRU5BUklPKSkge1xyXG4gICAgICAgICAgY2FuZGlkYXRlX2NhcmRfdmlldy5hYm92ZV9vbmVfc3RlcF9tYXRjaGluZyArPSAxO1xyXG4gICAgICAgICAgY291bnQrKztcclxuICAgICAgICB9IGVsc2UgaWYgKGpvYlByb2ZpbGUuY2FwYWJpbGl0eV9tYXRyaXhbY2FwXSA9PSAoTnVtYmVyKGNhbmRpZGF0ZS5jYXBhYmlsaXR5X21hdHJpeFtjYXBdKSArIENvbnN0VmFyaWFibGVzLkRJRkZFUkVOQ0VfSU5fQ09NUExFWElUWV9TQ0VOQVJJTykpIHtcclxuICAgICAgICAgIGNhbmRpZGF0ZV9jYXJkX3ZpZXcuYmVsb3dfb25lX3N0ZXBfbWF0Y2hpbmcgKz0gMTtcclxuICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgfSBlbHNlIGlmIChqb2JQcm9maWxlLmNvbXBsZXhpdHlfbXVzdGhhdmVfbWF0cml4ID09IC0xIHx8IGpvYlByb2ZpbGUuY29tcGxleGl0eV9tdXN0aGF2ZV9tYXRyaXggPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICBjYW5kaWRhdGVfY2FyZF92aWV3LmNvbXBsZXhpdHlJc011c3RIYXZlID0gZmFsc2U7XHJcbiAgICAgICAgfSBlbHNlIGlmKGpvYlByb2ZpbGUuY29tcGxleGl0eV9tdXN0aGF2ZV9tYXRyaXhbY2FwXSkge1xyXG4gICAgICAgICAgaWYoam9iUHJvZmlsZS5jYXBhYmlsaXR5X21hdHJpeFtjYXBdID09IGNhbmRpZGF0ZS5jYXBhYmlsaXR5X21hdHJpeFtjYXBdKSB7XHJcbiAgICAgICAgICAgIGNhbmRpZGF0ZV9jYXJkX3ZpZXcuY29tcGxleGl0eUlzTXVzdEhhdmUgPSBqb2JQcm9maWxlLmNvbXBsZXhpdHlfbXVzdGhhdmVfbWF0cml4W2NhcF07XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjYW5kaWRhdGVfY2FyZF92aWV3LmNvbXBsZXhpdHlJc011c3RIYXZlID0gZmFsc2U7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGNhbmRpZGF0ZV9jYXJkX3ZpZXcuYWJvdmVfb25lX3N0ZXBfbWF0Y2hpbmcgPSAoY2FuZGlkYXRlX2NhcmRfdmlldy5hYm92ZV9vbmVfc3RlcF9tYXRjaGluZyAvIGNvdW50KSAqIDEwMDtcclxuICAgICAgY2FuZGlkYXRlX2NhcmRfdmlldy5iZWxvd19vbmVfc3RlcF9tYXRjaGluZyA9IChjYW5kaWRhdGVfY2FyZF92aWV3LmJlbG93X29uZV9zdGVwX21hdGNoaW5nIC8gY291bnQpICogMTAwO1xyXG4gICAgICBjYW5kaWRhdGVfY2FyZF92aWV3LmV4YWN0X21hdGNoaW5nID0gKGNhbmRpZGF0ZV9jYXJkX3ZpZXcuZXhhY3RfbWF0Y2hpbmcgLyBjb3VudCkgKiAxMDA7XHJcbiAgICAgIGNhbmRpZGF0ZV9jYXJkX3ZpZXcubWF0Y2hpbmcgPSBjYW5kaWRhdGVfY2FyZF92aWV3LmFib3ZlX29uZV9zdGVwX21hdGNoaW5nICsgY2FuZGlkYXRlX2NhcmRfdmlldy5iZWxvd19vbmVfc3RlcF9tYXRjaGluZyArIGNhbmRpZGF0ZV9jYXJkX3ZpZXcuZXhhY3RfbWF0Y2hpbmc7XHJcbiAgICAgIGNhbmRpZGF0ZV9jYXJkX3ZpZXcuc2FsYXJ5ID0gY2FuZGlkYXRlLnByb2Zlc3Npb25hbERldGFpbHMuY3VycmVudFNhbGFyeTtcclxuICAgICAgY2FuZGlkYXRlX2NhcmRfdmlldy5leHBlcmllbmNlID0gY2FuZGlkYXRlLnByb2Zlc3Npb25hbERldGFpbHMuZXhwZXJpZW5jZTtcclxuICAgICAgY2FuZGlkYXRlX2NhcmRfdmlldy5lZHVjYXRpb24gPSBjYW5kaWRhdGUucHJvZmVzc2lvbmFsRGV0YWlscy5lZHVjYXRpb247XHJcbiAgICAgIGNhbmRpZGF0ZV9jYXJkX3ZpZXcucHJvZmljaWVuY2llcyA9IGNhbmRpZGF0ZS5wcm9maWNpZW5jaWVzO1xyXG4gICAgICBjYW5kaWRhdGVfY2FyZF92aWV3LmludGVyZXN0ZWRJbmR1c3RyaWVzID0gY2FuZGlkYXRlLmludGVyZXN0ZWRJbmR1c3RyaWVzO1xyXG4gICAgICBjYW5kaWRhdGVfY2FyZF92aWV3Ll9pZCA9IGNhbmRpZGF0ZS5faWQ7Ly90b2RvIHNvbHZlIHRoZSBwcm9ibGVtIG9mIGxvY2F0aW9uIGZyb20gZnJvbnQgZW5kXHJcbiAgICAgIGNhbmRpZGF0ZV9jYXJkX3ZpZXcuaXNWaXNpYmxlID0gY2FuZGlkYXRlLmlzVmlzaWJsZTtcclxuICAgICAgaWYoY2FuZGlkYXRlLmxvY2F0aW9uKSB7XHJcbiAgICAgICAgY2FuZGlkYXRlX2NhcmRfdmlldy5sb2NhdGlvbiA9IGNhbmRpZGF0ZS5sb2NhdGlvbi5jaXR5O1xyXG4gICAgICB9ZWxzZSB7XHJcbiAgICAgICAgY2FuZGlkYXRlX2NhcmRfdmlldy5sb2NhdGlvbiA9ICdQdW5lJztcclxuICAgICAgfVxyXG4gICAgICBjYW5kaWRhdGVfY2FyZF92aWV3Lm5vdGljZVBlcmlvZCA9IGNhbmRpZGF0ZS5wcm9mZXNzaW9uYWxEZXRhaWxzLm5vdGljZVBlcmlvZDtcclxuICAgICAgaWYgKChjYW5kaWRhdGVfY2FyZF92aWV3LmFib3ZlX29uZV9zdGVwX21hdGNoaW5nICsgY2FuZGlkYXRlX2NhcmRfdmlldy5leGFjdF9tYXRjaGluZykgPj0gQ29uc3RWYXJpYWJsZXMuTE9XRVJfTElNSVRfRk9SX1NFQVJDSF9SRVNVTFQpIHtcclxuICAgICAgICBjYW5kaWRhdGVfcV9jYXJkX21hcFtjYW5kaWRhdGUudXNlcklkXT1jYW5kaWRhdGVfY2FyZF92aWV3O1xyXG4gICAgICAgIGlkc09mU2VsZWN0ZWRDYW5kaWRhdGVzLnB1c2goY2FuZGlkYXRlLnVzZXJJZCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICB9XHJcbiAgICBsZXQgY2FuZGlkYXRlc19xX2NhcmRzX3NlbmQgOiBDYW5kaWRhdGVRQ2FyZFtdID0gbmV3IEFycmF5KDApO1xyXG4gICAgbGV0IHVzZXJSZXBvc2l0b3J5OiBVc2VyUmVwb3NpdG9yeSA9IG5ldyBVc2VyUmVwb3NpdG9yeSgpO1xyXG4gICAgY29uc29sZS50aW1lRW5kKCdnZXRDYW5kaWRhdGVRQ2FyZEZvckxvb3AnKTtcclxuICAgIHVzZXJSZXBvc2l0b3J5LnJldHJpZXZlQnlNdWx0aUlkcyhpZHNPZlNlbGVjdGVkQ2FuZGlkYXRlcyx7fSwgKGVycm9yOiBhbnksIHJlczogYW55KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfVxyXG4gICAgICAgZWxzZSB7XHJcbiAgICAgICAgaWYocmVzLmxlbmd0aD4wKSB7XHJcbiAgICAgICAgICBjb25zb2xlLnRpbWUoJ3JldHJpZXZlQnlNdWx0aUlkcycpO1xyXG4gICAgICAgICAgZm9yKGxldCB1c2VyIG9mIHJlcyl7XHJcbiAgICAgICAgICAgIGxldCBjYW5kaWRhdGVRY2FyZCA6IENhbmRpZGF0ZVFDYXJkPSBjYW5kaWRhdGVfcV9jYXJkX21hcFt1c2VyLl9pZF07XHJcbiAgICAgICAgICAgIGNhbmRpZGF0ZVFjYXJkLmVtYWlsPXVzZXIuZW1haWw7XHJcbiAgICAgICAgICAgIGNhbmRpZGF0ZVFjYXJkLmZpcnN0X25hbWU9dXNlci5maXJzdF9uYW1lO1xyXG4gICAgICAgICAgICBjYW5kaWRhdGVRY2FyZC5sYXN0X25hbWU9dXNlci5sYXN0X25hbWU7XHJcbiAgICAgICAgICAgIGNhbmRpZGF0ZVFjYXJkLm1vYmlsZV9udW1iZXI9dXNlci5tb2JpbGVfbnVtYmVyO1xyXG4gICAgICAgICAgICBjYW5kaWRhdGVRY2FyZC5waWN0dXJlPXVzZXIucGljdHVyZTtcclxuICAgICAgICAgICAgY2FuZGlkYXRlc19xX2NhcmRzX3NlbmQucHVzaChjYW5kaWRhdGVRY2FyZCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBjYW5kaWRhdGVzX3FfY2FyZHNfc2VuZC5zb3J0KChmaXJzdDogQ2FuZGlkYXRlUUNhcmQsc2Vjb25kIDogQ2FuZGlkYXRlUUNhcmQpOm51bWJlcj0+IHtcclxuICAgICAgICAgICAgaWYoKGZpcnN0LmFib3ZlX29uZV9zdGVwX21hdGNoaW5nK2ZpcnN0LmV4YWN0X21hdGNoaW5nKSA+KHNlY29uZC5hYm92ZV9vbmVfc3RlcF9tYXRjaGluZytzZWNvbmQuZXhhY3RfbWF0Y2hpbmcpICl7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKChmaXJzdC5hYm92ZV9vbmVfc3RlcF9tYXRjaGluZytmaXJzdC5leGFjdF9tYXRjaGluZykgPCAoc2Vjb25kLmFib3ZlX29uZV9zdGVwX21hdGNoaW5nK3NlY29uZC5leGFjdF9tYXRjaGluZykgKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIGNvbnNvbGUudGltZUVuZCgncmV0cmlldmVCeU11bHRpSWRzJyk7XHJcbiAgICAgICAgICBjYWxsYmFjayhudWxsLGNhbmRpZGF0ZXNfcV9jYXJkc19zZW5kKTtcclxuICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICBjYWxsYmFjayhudWxsLGNhbmRpZGF0ZXNfcV9jYXJkc19zZW5kKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuXHJcbiAgfVxyXG5cclxuICBnZXRDb2Rlc0Zyb21pbmR1c3RyeShpbmR1c3RyeTogSW5kdXN0cnlNb2RlbCk6IHN0cmluZ1tdIHtcclxuICAgIGNvbnNvbGUudGltZSgnZ2V0Q29kZXNGcm9taW5kdXN0cnknKTtcclxuICAgIGxldCBzZWxlY3RlZF9jb21wbGV4aXR5OiBzdHJpbmdbXSA9IG5ldyBBcnJheSgwKTtcclxuICAgIGZvciAobGV0IHJvbGUgb2YgaW5kdXN0cnkucm9sZXMpIHtcclxuICAgICAgZm9yIChsZXQgY2FwYWJpbGl0eSBvZiByb2xlLmRlZmF1bHRfY29tcGxleGl0aWVzKSB7XHJcbiAgICAgICAgZm9yIChsZXQgY29tcGxleGl0eSBvZiBjYXBhYmlsaXR5LmNvbXBsZXhpdGllcykge1xyXG4gICAgICAgICAgZm9yIChsZXQgc2NlbmFyaW8gb2YgY29tcGxleGl0eS5zY2VuYXJpb3MpIHtcclxuICAgICAgICAgICAgaWYgKHNjZW5hcmlvLmlzQ2hlY2tlZCkge1xyXG4gICAgICAgICAgICAgIGlmIChzY2VuYXJpby5jb2RlKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxlY3RlZF9jb21wbGV4aXR5LnB1c2goc2NlbmFyaW8uY29kZSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBmb3IgKGxldCBjYXBhYmlsaXR5IG9mIHJvbGUuY2FwYWJpbGl0aWVzKSB7XHJcbiAgICAgICAgZm9yIChsZXQgY29tcGxleGl0eSBvZiBjYXBhYmlsaXR5LmNvbXBsZXhpdGllcykge1xyXG4gICAgICAgICAgZm9yIChsZXQgc2NlbmFyaW8gb2YgY29tcGxleGl0eS5zY2VuYXJpb3MpIHtcclxuICAgICAgICAgICAgaWYgKHNjZW5hcmlvLmlzQ2hlY2tlZCkge1xyXG4gICAgICAgICAgICAgIGlmIChzY2VuYXJpby5jb2RlKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxlY3RlZF9jb21wbGV4aXR5LnB1c2goc2NlbmFyaW8uY29kZSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zb2xlLnRpbWUoJ2dldENvZGVzRnJvbWluZHVzdHJ5Jyk7XHJcbiAgICByZXR1cm4gc2VsZWN0ZWRfY29tcGxleGl0eTtcclxuICB9XHJcblxyXG5cclxufVxyXG5cclxuT2JqZWN0XHJcbiAgLnNlYWwoQ2FuZGlkYXRlUmVwb3NpdG9yeSk7XHJcblxyXG5leHBvcnQgPSBDYW5kaWRhdGVSZXBvc2l0b3J5O1xyXG4iXX0=
