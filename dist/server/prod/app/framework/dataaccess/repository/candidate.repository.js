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
                else {
                    count++;
                }
            }
            for (var cap in jobProfile.capability_matrix) {
                if (jobProfile.complexity_musthave_matrix == -1 || jobProfile.complexity_musthave_matrix == undefined || jobProfile.capability_matrix[cap] == 0) {
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L2NhbmRpZGF0ZS5yZXBvc2l0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsNkRBQWdFO0FBQ2hFLHVEQUEwRDtBQUUxRCx3RUFBbUU7QUFDbkUsZ0VBQTREO0FBSzVELGtEQUFxRDtBQUlyRDtJQUFrQyx1Q0FBMEI7SUFFMUQ7ZUFDRSxrQkFBTSxlQUFlLENBQUM7SUFDeEIsQ0FBQztJQUdELCtDQUFpQixHQUFqQixVQUFrQixVQUFpQixFQUFFLFVBQTJCLEVBQUUsYUFBdUIsRUFBRSxRQUFzQztRQUMvSCxPQUFPLENBQUMsSUFBSSxDQUFDLDBCQUEwQixDQUFDLENBQUM7UUFDekMsSUFBSSxvQkFBb0IsR0FBUSxFQUFHLENBQUM7UUFDcEMsSUFBSSx1QkFBdUIsR0FBYSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyRCxHQUFHLENBQUMsQ0FBa0IsVUFBVSxFQUFWLHlCQUFVLEVBQVYsd0JBQVUsRUFBVixJQUFVO1lBQTNCLElBQUksU0FBUyxtQkFBQTtZQUNoQixJQUFJLE9BQU8sR0FBWSxLQUFLLENBQUM7WUFDN0IsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFDbEIsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMzRCxRQUFRLENBQUM7Z0JBQ1gsQ0FBQztZQUNILENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztvQkFDOUIsR0FBRyxDQUFDLENBQWEsVUFBeUIsRUFBekIsS0FBQSxVQUFVLENBQUMsY0FBYyxFQUF6QixjQUF5QixFQUF6QixJQUF5Qjt3QkFBckMsSUFBSSxJQUFJLFNB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QUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dDQUNsQixtQkFBbUIsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDOzRCQUMxQyxDQUFDO3dCQUNILENBQUM7cUJBQ0Y7aUJBQ0Y7YUFDRjtZQUVELEdBQUcsQ0FBQyxDQUFtQixVQUFpQixFQUFqQixLQUFBLElBQUksQ0FBQyxZQUFZLEVBQWpCLGNBQWlCLEVBQWpCLElBQWlCO2dCQUFuQyxJQUFJLFVBQVUsU0FBQTtnQkFDakIsR0FBRyxDQUFDLENBQW1CLFVBQXVCLEVBQXZCLEtBQUEsVUFBVSxDQUFDLFlBQVksRUFBdkIsY0FBdUIsRUFBdkIsSUFBdUI7b0JBQXpDLElBQUksVUFBVSxTQUFBO29CQUNqQixHQUFHLENBQUMsQ0FBaUIsVUFBb0IsRUFBcEIsS0FBQSxVQUFVLENBQUMsU0FBUyxFQUFwQixjQUFvQixFQUFwQixJQUFvQjt3QkFBcEMsSUFBSSxRQUFRLFNBQUE7d0JBQ2YsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7NEJBQ3ZCLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dDQUNsQixtQkFBbUIsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDOzRCQUMxQyxDQUFDO3dCQUNILENBQUM7cUJBQ0Y7aUJBQ0Y7YUFDRjtTQUNGO1FBQ0QsT0FBTyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQztJQUM3QixDQUFDO0lBR0gsMEJBQUM7QUFBRCxDQTdKQSxBQTZKQyxDQTdKaUMsY0FBYyxHQTZKL0M7QUFFRCxNQUFNO0tBQ0gsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFFN0IsaUJBQVMsbUJBQW1CLENBQUMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9kYXRhYWNjZXNzL3JlcG9zaXRvcnkvY2FuZGlkYXRlLnJlcG9zaXRvcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ2FuZGlkYXRlU2NoZW1hID0gcmVxdWlyZShcIi4uL3NjaGVtYXMvY2FuZGlkYXRlLnNjaGVtYVwiKTtcbmltcG9ydCBSZXBvc2l0b3J5QmFzZSA9IHJlcXVpcmUoXCIuL2Jhc2UvcmVwb3NpdG9yeS5iYXNlXCIpO1xuaW1wb3J0IElDYW5kaWRhdGUgPSByZXF1aXJlKFwiLi4vbW9uZ29vc2UvY2FuZGlkYXRlXCIpO1xuaW1wb3J0IHtDYW5kaWRhdGVRQ2FyZH0gZnJvbSBcIi4uLy4uL3NlYXJjaC9tb2RlbC9jYW5kaWRhdGUtcS1jYXJkXCI7XG5pbXBvcnQge0NvbnN0VmFyaWFibGVzfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3NoYXJlZGNvbnN0YW50c1wiO1xuaW1wb3J0IEpvYlByb2ZpbGVNb2RlbCA9IHJlcXVpcmUoXCIuLi9tb2RlbC9qb2Jwcm9maWxlLm1vZGVsXCIpO1xuaW1wb3J0IENhbmRpZGF0ZU1vZGVsID0gcmVxdWlyZShcIi4uL21vZGVsL2NhbmRpZGF0ZS5tb2RlbFwiKTtcbmltcG9ydCBJbmR1c3RyeU1vZGVsID0gcmVxdWlyZShcIi4uL21vZGVsL2luZHVzdHJ5Lm1vZGVsXCIpO1xuaW1wb3J0IENhbmRpZGF0ZUNhcmRWaWV3TW9kZWwgPSByZXF1aXJlKFwiLi4vbW9kZWwvY2FuZGlkYXRlLWNhcmQtdmlldy5tb2RlbFwiKTtcbmltcG9ydCBVc2VyUmVwb3NpdG9yeSA9IHJlcXVpcmUoXCIuL3VzZXIucmVwb3NpdG9yeVwiKTtcbmltcG9ydCBVc2VyTW9kZWwgPSByZXF1aXJlKFwiLi4vbW9kZWwvdXNlci5tb2RlbFwiKTtcblxuXG5jbGFzcyBDYW5kaWRhdGVSZXBvc2l0b3J5IGV4dGVuZHMgUmVwb3NpdG9yeUJhc2U8SUNhbmRpZGF0ZT4ge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKENhbmRpZGF0ZVNjaGVtYSk7XG4gIH1cblxuXG4gIGdldENhbmRpZGF0ZVFDYXJkKGNhbmRpZGF0ZXM6IGFueVtdLCBqb2JQcm9maWxlOiBKb2JQcm9maWxlTW9kZWwsIGNhbmRpZGF0ZXNJZHM6IHN0cmluZ1tdLCBjYWxsYmFjazogKGVycjogYW55LCByZXM6IGFueSkgPT4gdm9pZCkge1xuICAgIGNvbnNvbGUudGltZSgnZ2V0Q2FuZGlkYXRlUUNhcmRGb3JMb29wJyk7XG4gICAgbGV0IGNhbmRpZGF0ZV9xX2NhcmRfbWFwIDphbnkgPSB7IH07XG4gICAgbGV0IGlkc09mU2VsZWN0ZWRDYW5kaWRhdGVzIDogc3RyaW5nW109IG5ldyBBcnJheSgwKTtcbiAgICBmb3IgKGxldCBjYW5kaWRhdGUgb2YgY2FuZGlkYXRlcykge1xuICAgICAgbGV0IGlzRm91bmQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgIGlmIChjYW5kaWRhdGVzSWRzKSB7XG4gICAgICAgIGlmIChjYW5kaWRhdGVzSWRzLmluZGV4T2YoY2FuZGlkYXRlLl9pZC50b1N0cmluZygpKSA9PT0gLTEpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGpvYlByb2ZpbGUuY2FuZGlkYXRlX2xpc3QpIHtcbiAgICAgICAgICBmb3IgKGxldCBsaXN0IG9mIGpvYlByb2ZpbGUuY2FuZGlkYXRlX2xpc3QpIHtcbiAgICAgICAgICAgIGlmIChsaXN0Lm5hbWUgPT09IENvbnN0VmFyaWFibGVzLlNIT1JUX0xJU1RFRF9DQU5ESURBVEUpIHtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobGlzdC5pZHMuaW5kZXhPZihjYW5kaWRhdGUuX2lkLnRvU3RyaW5nKCkpICE9PSAtMSkge1xuICAgICAgICAgICAgICBpc0ZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChpc0ZvdW5kKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxldCBjYW5kaWRhdGVfY2FyZF92aWV3OiBDYW5kaWRhdGVRQ2FyZCA9IG5ldyBDYW5kaWRhdGVRQ2FyZCgpO1xuICAgICAgY2FuZGlkYXRlX2NhcmRfdmlldy5tYXRjaGluZyA9IDA7XG4gICAgICBsZXQgY291bnQgPTA7XG4gICAgICBmb3IgKGxldCBjYXAgaW4gam9iUHJvZmlsZS5jYXBhYmlsaXR5X21hdHJpeCkge1xuICAgICAgICBpZiAoam9iUHJvZmlsZS5jYXBhYmlsaXR5X21hdHJpeFtjYXBdID09IC0xIHx8IGpvYlByb2ZpbGUuY2FwYWJpbGl0eV9tYXRyaXhbY2FwXSA9PSAwIHx8IGpvYlByb2ZpbGUuY2FwYWJpbGl0eV9tYXRyaXhbY2FwXSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgfSBlbHNlIGlmIChqb2JQcm9maWxlLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0gPT0gY2FuZGlkYXRlLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0pIHtcbiAgICAgICAgICAgIGNhbmRpZGF0ZV9jYXJkX3ZpZXcuZXhhY3RfbWF0Y2hpbmcgKz0gMTtcbiAgICAgICAgICBjb3VudCsrO1xuICAgICAgICB9IGVsc2UgaWYgKGpvYlByb2ZpbGUuY2FwYWJpbGl0eV9tYXRyaXhbY2FwXSA9PSAoTnVtYmVyKGNhbmRpZGF0ZS5jYXBhYmlsaXR5X21hdHJpeFtjYXBdKSAtIENvbnN0VmFyaWFibGVzLkRJRkZFUkVOQ0VfSU5fQ09NUExFWElUWV9TQ0VOQVJJTykpIHtcbiAgICAgICAgICBjYW5kaWRhdGVfY2FyZF92aWV3LmFib3ZlX29uZV9zdGVwX21hdGNoaW5nICs9IDE7XG4gICAgICAgICAgY291bnQrKztcbiAgICAgICAgfSBlbHNlIGlmIChqb2JQcm9maWxlLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0gPT0gKE51bWJlcihjYW5kaWRhdGUuY2FwYWJpbGl0eV9tYXRyaXhbY2FwXSkgKyBDb25zdFZhcmlhYmxlcy5ESUZGRVJFTkNFX0lOX0NPTVBMRVhJVFlfU0NFTkFSSU8pKSB7XG4gICAgICAgICAgY2FuZGlkYXRlX2NhcmRfdmlldy5iZWxvd19vbmVfc3RlcF9tYXRjaGluZyArPSAxO1xuICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgIH0gIGVsc2Uge1xuICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZvcihsZXQgY2FwIGluIGpvYlByb2ZpbGUuY2FwYWJpbGl0eV9tYXRyaXgpIHtcbiAgICAgICAgaWYgKGpvYlByb2ZpbGUuY29tcGxleGl0eV9tdXN0aGF2ZV9tYXRyaXggPT0gLTEgfHwgam9iUHJvZmlsZS5jb21wbGV4aXR5X211c3RoYXZlX21hdHJpeCA9PSB1bmRlZmluZWQgfHwgam9iUHJvZmlsZS5jYXBhYmlsaXR5X21hdHJpeFtjYXBdID09IDApIHtcbiAgICAgICAgICBjYW5kaWRhdGVfY2FyZF92aWV3LmNvbXBsZXhpdHlJc011c3RIYXZlID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSBpZihqb2JQcm9maWxlLmNvbXBsZXhpdHlfbXVzdGhhdmVfbWF0cml4W2NhcF0pIHtcbiAgICAgICAgICBpZihqb2JQcm9maWxlLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0gPT0gY2FuZGlkYXRlLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0pIHtcbiAgICAgICAgICAgIGNhbmRpZGF0ZV9jYXJkX3ZpZXcuY29tcGxleGl0eUlzTXVzdEhhdmUgPSBqb2JQcm9maWxlLmNvbXBsZXhpdHlfbXVzdGhhdmVfbWF0cml4W2NhcF07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhbmRpZGF0ZV9jYXJkX3ZpZXcuY29tcGxleGl0eUlzTXVzdEhhdmUgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNhbmRpZGF0ZV9jYXJkX3ZpZXcuYWJvdmVfb25lX3N0ZXBfbWF0Y2hpbmcgPSAoY2FuZGlkYXRlX2NhcmRfdmlldy5hYm92ZV9vbmVfc3RlcF9tYXRjaGluZyAvIGNvdW50KSAqIDEwMDtcbiAgICAgIGNhbmRpZGF0ZV9jYXJkX3ZpZXcuYmVsb3dfb25lX3N0ZXBfbWF0Y2hpbmcgPSAoY2FuZGlkYXRlX2NhcmRfdmlldy5iZWxvd19vbmVfc3RlcF9tYXRjaGluZyAvIGNvdW50KSAqIDEwMDtcbiAgICAgIGNhbmRpZGF0ZV9jYXJkX3ZpZXcuZXhhY3RfbWF0Y2hpbmcgPSAoY2FuZGlkYXRlX2NhcmRfdmlldy5leGFjdF9tYXRjaGluZyAvIGNvdW50KSAqIDEwMDtcbiAgICAgIGNhbmRpZGF0ZV9jYXJkX3ZpZXcubWF0Y2hpbmcgPSBjYW5kaWRhdGVfY2FyZF92aWV3LmFib3ZlX29uZV9zdGVwX21hdGNoaW5nICsgY2FuZGlkYXRlX2NhcmRfdmlldy5iZWxvd19vbmVfc3RlcF9tYXRjaGluZyArIGNhbmRpZGF0ZV9jYXJkX3ZpZXcuZXhhY3RfbWF0Y2hpbmc7XG4gICAgICBjYW5kaWRhdGVfY2FyZF92aWV3LnNhbGFyeSA9IGNhbmRpZGF0ZS5wcm9mZXNzaW9uYWxEZXRhaWxzLmN1cnJlbnRTYWxhcnk7XG4gICAgICBjYW5kaWRhdGVfY2FyZF92aWV3LmV4cGVyaWVuY2UgPSBjYW5kaWRhdGUucHJvZmVzc2lvbmFsRGV0YWlscy5leHBlcmllbmNlO1xuICAgICAgY2FuZGlkYXRlX2NhcmRfdmlldy5lZHVjYXRpb24gPSBjYW5kaWRhdGUucHJvZmVzc2lvbmFsRGV0YWlscy5lZHVjYXRpb247XG4gICAgICBjYW5kaWRhdGVfY2FyZF92aWV3LnByb2ZpY2llbmNpZXMgPSBjYW5kaWRhdGUucHJvZmljaWVuY2llcztcbiAgICAgIGNhbmRpZGF0ZV9jYXJkX3ZpZXcuaW50ZXJlc3RlZEluZHVzdHJpZXMgPSBjYW5kaWRhdGUuaW50ZXJlc3RlZEluZHVzdHJpZXM7XG4gICAgICBjYW5kaWRhdGVfY2FyZF92aWV3Ll9pZCA9IGNhbmRpZGF0ZS5faWQ7Ly90b2RvIHNvbHZlIHRoZSBwcm9ibGVtIG9mIGxvY2F0aW9uIGZyb20gZnJvbnQgZW5kXG4gICAgICBjYW5kaWRhdGVfY2FyZF92aWV3LmlzVmlzaWJsZSA9IGNhbmRpZGF0ZS5pc1Zpc2libGU7XG4gICAgICBpZihjYW5kaWRhdGUubG9jYXRpb24pIHtcbiAgICAgICAgY2FuZGlkYXRlX2NhcmRfdmlldy5sb2NhdGlvbiA9IGNhbmRpZGF0ZS5sb2NhdGlvbi5jaXR5O1xuICAgICAgfWVsc2Uge1xuICAgICAgICBjYW5kaWRhdGVfY2FyZF92aWV3LmxvY2F0aW9uID0gJ1B1bmUnO1xuICAgICAgfVxuICAgICAgY2FuZGlkYXRlX2NhcmRfdmlldy5ub3RpY2VQZXJpb2QgPSBjYW5kaWRhdGUucHJvZmVzc2lvbmFsRGV0YWlscy5ub3RpY2VQZXJpb2Q7XG4gICAgICBpZiAoKGNhbmRpZGF0ZV9jYXJkX3ZpZXcuYWJvdmVfb25lX3N0ZXBfbWF0Y2hpbmcgKyBjYW5kaWRhdGVfY2FyZF92aWV3LmV4YWN0X21hdGNoaW5nKSA+PSBDb25zdFZhcmlhYmxlcy5MT1dFUl9MSU1JVF9GT1JfU0VBUkNIX1JFU1VMVCkge1xuICAgICAgICBjYW5kaWRhdGVfcV9jYXJkX21hcFtjYW5kaWRhdGUudXNlcklkXT1jYW5kaWRhdGVfY2FyZF92aWV3O1xuICAgICAgICBpZHNPZlNlbGVjdGVkQ2FuZGlkYXRlcy5wdXNoKGNhbmRpZGF0ZS51c2VySWQpO1xuICAgICAgfVxuXG4gICAgfVxuICAgIGxldCBjYW5kaWRhdGVzX3FfY2FyZHNfc2VuZCA6IENhbmRpZGF0ZVFDYXJkW10gPSBuZXcgQXJyYXkoMCk7XG4gICAgbGV0IHVzZXJSZXBvc2l0b3J5OiBVc2VyUmVwb3NpdG9yeSA9IG5ldyBVc2VyUmVwb3NpdG9yeSgpO1xuICAgIGNvbnNvbGUudGltZUVuZCgnZ2V0Q2FuZGlkYXRlUUNhcmRGb3JMb29wJyk7XG4gICAgdXNlclJlcG9zaXRvcnkucmV0cmlldmVCeU11bHRpSWRzKGlkc09mU2VsZWN0ZWRDYW5kaWRhdGVzLHt9LCAoZXJyb3I6IGFueSwgcmVzOiBhbnkpID0+IHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XG4gICAgICB9XG4gICAgICAgZWxzZSB7XG4gICAgICAgIGlmKHJlcy5sZW5ndGg+MCkge1xuICAgICAgICAgIGNvbnNvbGUudGltZSgncmV0cmlldmVCeU11bHRpSWRzJyk7XG4gICAgICAgICAgZm9yKGxldCB1c2VyIG9mIHJlcyl7XG4gICAgICAgICAgICBsZXQgY2FuZGlkYXRlUWNhcmQgOiBDYW5kaWRhdGVRQ2FyZD0gY2FuZGlkYXRlX3FfY2FyZF9tYXBbdXNlci5faWRdO1xuICAgICAgICAgICAgY2FuZGlkYXRlUWNhcmQuZW1haWw9dXNlci5lbWFpbDtcbiAgICAgICAgICAgIGNhbmRpZGF0ZVFjYXJkLmZpcnN0X25hbWU9dXNlci5maXJzdF9uYW1lO1xuICAgICAgICAgICAgY2FuZGlkYXRlUWNhcmQubGFzdF9uYW1lPXVzZXIubGFzdF9uYW1lO1xuICAgICAgICAgICAgY2FuZGlkYXRlUWNhcmQubW9iaWxlX251bWJlcj11c2VyLm1vYmlsZV9udW1iZXI7XG4gICAgICAgICAgICBjYW5kaWRhdGVRY2FyZC5waWN0dXJlPXVzZXIucGljdHVyZTtcbiAgICAgICAgICAgIGNhbmRpZGF0ZXNfcV9jYXJkc19zZW5kLnB1c2goY2FuZGlkYXRlUWNhcmQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjYW5kaWRhdGVzX3FfY2FyZHNfc2VuZC5zb3J0KChmaXJzdDogQ2FuZGlkYXRlUUNhcmQsc2Vjb25kIDogQ2FuZGlkYXRlUUNhcmQpOm51bWJlcj0+IHtcbiAgICAgICAgICAgIGlmKChmaXJzdC5hYm92ZV9vbmVfc3RlcF9tYXRjaGluZytmaXJzdC5leGFjdF9tYXRjaGluZykgPihzZWNvbmQuYWJvdmVfb25lX3N0ZXBfbWF0Y2hpbmcrc2Vjb25kLmV4YWN0X21hdGNoaW5nKSApe1xuICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZigoZmlyc3QuYWJvdmVfb25lX3N0ZXBfbWF0Y2hpbmcrZmlyc3QuZXhhY3RfbWF0Y2hpbmcpIDwgKHNlY29uZC5hYm92ZV9vbmVfc3RlcF9tYXRjaGluZytzZWNvbmQuZXhhY3RfbWF0Y2hpbmcpICkge1xuICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGNvbnNvbGUudGltZUVuZCgncmV0cmlldmVCeU11bHRpSWRzJyk7XG4gICAgICAgICAgY2FsbGJhY2sobnVsbCxjYW5kaWRhdGVzX3FfY2FyZHNfc2VuZCk7XG4gICAgICAgIH1lbHNlIHtcbiAgICAgICAgICBjYWxsYmFjayhudWxsLGNhbmRpZGF0ZXNfcV9jYXJkc19zZW5kKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG5cbiAgfVxuXG4gIGdldENvZGVzRnJvbWluZHVzdHJ5KGluZHVzdHJ5OiBJbmR1c3RyeU1vZGVsKTogc3RyaW5nW10ge1xuICAgIGNvbnNvbGUudGltZSgnZ2V0Q29kZXNGcm9taW5kdXN0cnknKTtcbiAgICBsZXQgc2VsZWN0ZWRfY29tcGxleGl0eTogc3RyaW5nW10gPSBuZXcgQXJyYXkoMCk7XG4gICAgZm9yIChsZXQgcm9sZSBvZiBpbmR1c3RyeS5yb2xlcykge1xuICAgICAgZm9yIChsZXQgY2FwYWJpbGl0eSBvZiByb2xlLmRlZmF1bHRfY29tcGxleGl0aWVzKSB7XG4gICAgICAgIGZvciAobGV0IGNvbXBsZXhpdHkgb2YgY2FwYWJpbGl0eS5jb21wbGV4aXRpZXMpIHtcbiAgICAgICAgICBmb3IgKGxldCBzY2VuYXJpbyBvZiBjb21wbGV4aXR5LnNjZW5hcmlvcykge1xuICAgICAgICAgICAgaWYgKHNjZW5hcmlvLmlzQ2hlY2tlZCkge1xuICAgICAgICAgICAgICBpZiAoc2NlbmFyaW8uY29kZSkge1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkX2NvbXBsZXhpdHkucHVzaChzY2VuYXJpby5jb2RlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmb3IgKGxldCBjYXBhYmlsaXR5IG9mIHJvbGUuY2FwYWJpbGl0aWVzKSB7XG4gICAgICAgIGZvciAobGV0IGNvbXBsZXhpdHkgb2YgY2FwYWJpbGl0eS5jb21wbGV4aXRpZXMpIHtcbiAgICAgICAgICBmb3IgKGxldCBzY2VuYXJpbyBvZiBjb21wbGV4aXR5LnNjZW5hcmlvcykge1xuICAgICAgICAgICAgaWYgKHNjZW5hcmlvLmlzQ2hlY2tlZCkge1xuICAgICAgICAgICAgICBpZiAoc2NlbmFyaW8uY29kZSkge1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkX2NvbXBsZXhpdHkucHVzaChzY2VuYXJpby5jb2RlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBjb25zb2xlLnRpbWUoJ2dldENvZGVzRnJvbWluZHVzdHJ5Jyk7XG4gICAgcmV0dXJuIHNlbGVjdGVkX2NvbXBsZXhpdHk7XG4gIH1cblxuXG59XG5cbk9iamVjdFxuICAuc2VhbChDYW5kaWRhdGVSZXBvc2l0b3J5KTtcblxuZXhwb3J0ID0gQ2FuZGlkYXRlUmVwb3NpdG9yeTtcbiJdfQ==
