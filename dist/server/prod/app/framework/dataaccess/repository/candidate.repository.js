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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L2NhbmRpZGF0ZS5yZXBvc2l0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsNkRBQWdFO0FBQ2hFLHVEQUEwRDtBQUUxRCx3RUFBbUU7QUFDbkUsZ0VBQTREO0FBSzVELGtEQUFxRDtBQUlyRDtJQUFrQyx1Q0FBMEI7SUFFMUQ7ZUFDRSxrQkFBTSxlQUFlLENBQUM7SUFDeEIsQ0FBQztJQUdELCtDQUFpQixHQUFqQixVQUFrQixVQUFpQixFQUFFLFVBQTJCLEVBQUUsYUFBdUIsRUFBRSxRQUFzQztRQUMvSCxPQUFPLENBQUMsSUFBSSxDQUFDLDBCQUEwQixDQUFDLENBQUM7UUFDekMsSUFBSSxvQkFBb0IsR0FBUSxFQUFHLENBQUM7UUFDcEMsSUFBSSx1QkFBdUIsR0FBYSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyRCxHQUFHLENBQUMsQ0FBa0IsVUFBVSxFQUFWLHlCQUFVLEVBQVYsd0JBQVUsRUFBVixJQUFVO1lBQTNCLElBQUksU0FBUyxtQkFBQTtZQUNoQixJQUFJLE9BQU8sR0FBWSxLQUFLLENBQUM7WUFDN0IsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFDbEIsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMzRCxRQUFRLENBQUM7Z0JBQ1gsQ0FBQztZQUNILENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztvQkFDOUIsR0FBRyxDQUFDLENBQWEsVUFBeUIsRUFBekIsS0FBQSxVQUFVLENBQUMsY0FBYyxFQUF6QixjQUF5QixFQUF6QixJQUF5Qjt3QkFBckMsSUFBSSxJQUFJLFNB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U0FDRjtRQUNELE9BQU8sQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUNyQyxNQUFNLENBQUMsbUJBQW1CLENBQUM7SUFDN0IsQ0FBQztJQUdILDBCQUFDO0FBQUQsQ0FsSkEsQUFrSkMsQ0FsSmlDLGNBQWMsR0FrSi9DO0FBRUQsTUFBTTtLQUNILElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBRTdCLGlCQUFTLG1CQUFtQixDQUFDIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L2NhbmRpZGF0ZS5yZXBvc2l0b3J5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENhbmRpZGF0ZVNjaGVtYSA9IHJlcXVpcmUoXCIuLi9zY2hlbWFzL2NhbmRpZGF0ZS5zY2hlbWFcIik7XG5pbXBvcnQgUmVwb3NpdG9yeUJhc2UgPSByZXF1aXJlKFwiLi9iYXNlL3JlcG9zaXRvcnkuYmFzZVwiKTtcbmltcG9ydCBJQ2FuZGlkYXRlID0gcmVxdWlyZShcIi4uL21vbmdvb3NlL2NhbmRpZGF0ZVwiKTtcbmltcG9ydCB7Q2FuZGlkYXRlUUNhcmR9IGZyb20gXCIuLi8uLi9zZWFyY2gvbW9kZWwvY2FuZGlkYXRlLXEtY2FyZFwiO1xuaW1wb3J0IHtDb25zdFZhcmlhYmxlc30gZnJvbSBcIi4uLy4uL3NoYXJlZC9zaGFyZWRjb25zdGFudHNcIjtcbmltcG9ydCBKb2JQcm9maWxlTW9kZWwgPSByZXF1aXJlKFwiLi4vbW9kZWwvam9icHJvZmlsZS5tb2RlbFwiKTtcbmltcG9ydCBDYW5kaWRhdGVNb2RlbCA9IHJlcXVpcmUoXCIuLi9tb2RlbC9jYW5kaWRhdGUubW9kZWxcIik7XG5pbXBvcnQgSW5kdXN0cnlNb2RlbCA9IHJlcXVpcmUoXCIuLi9tb2RlbC9pbmR1c3RyeS5tb2RlbFwiKTtcbmltcG9ydCBDYW5kaWRhdGVDYXJkVmlld01vZGVsID0gcmVxdWlyZShcIi4uL21vZGVsL2NhbmRpZGF0ZS1jYXJkLXZpZXcubW9kZWxcIik7XG5pbXBvcnQgVXNlclJlcG9zaXRvcnkgPSByZXF1aXJlKFwiLi91c2VyLnJlcG9zaXRvcnlcIik7XG5pbXBvcnQgVXNlck1vZGVsID0gcmVxdWlyZShcIi4uL21vZGVsL3VzZXIubW9kZWxcIik7XG5cblxuY2xhc3MgQ2FuZGlkYXRlUmVwb3NpdG9yeSBleHRlbmRzIFJlcG9zaXRvcnlCYXNlPElDYW5kaWRhdGU+IHtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihDYW5kaWRhdGVTY2hlbWEpO1xuICB9XG5cblxuICBnZXRDYW5kaWRhdGVRQ2FyZChjYW5kaWRhdGVzOiBhbnlbXSwgam9iUHJvZmlsZTogSm9iUHJvZmlsZU1vZGVsLCBjYW5kaWRhdGVzSWRzOiBzdHJpbmdbXSwgY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzOiBhbnkpID0+IHZvaWQpIHtcbiAgICBjb25zb2xlLnRpbWUoJ2dldENhbmRpZGF0ZVFDYXJkRm9yTG9vcCcpO1xuICAgIGxldCBjYW5kaWRhdGVfcV9jYXJkX21hcCA6YW55ID0geyB9O1xuICAgIGxldCBpZHNPZlNlbGVjdGVkQ2FuZGlkYXRlcyA6IHN0cmluZ1tdPSBuZXcgQXJyYXkoMCk7XG4gICAgZm9yIChsZXQgY2FuZGlkYXRlIG9mIGNhbmRpZGF0ZXMpIHtcbiAgICAgIGxldCBpc0ZvdW5kOiBib29sZWFuID0gZmFsc2U7XG4gICAgICBpZiAoY2FuZGlkYXRlc0lkcykge1xuICAgICAgICBpZiAoY2FuZGlkYXRlc0lkcy5pbmRleE9mKGNhbmRpZGF0ZS5faWQudG9TdHJpbmcoKSkgPT09IC0xKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChqb2JQcm9maWxlLmNhbmRpZGF0ZV9saXN0KSB7XG4gICAgICAgICAgZm9yIChsZXQgbGlzdCBvZiBqb2JQcm9maWxlLmNhbmRpZGF0ZV9saXN0KSB7XG4gICAgICAgICAgICBpZiAobGlzdC5uYW1lID09PSBDb25zdFZhcmlhYmxlcy5TSE9SVF9MSVNURURfQ0FORElEQVRFKSB7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGxpc3QuaWRzLmluZGV4T2YoY2FuZGlkYXRlLl9pZC50b1N0cmluZygpKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgaXNGb3VuZCA9IHRydWU7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNGb3VuZCkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsZXQgY2FuZGlkYXRlX2NhcmRfdmlldzogQ2FuZGlkYXRlUUNhcmQgPSBuZXcgQ2FuZGlkYXRlUUNhcmQoKTtcbiAgICAgIGNhbmRpZGF0ZV9jYXJkX3ZpZXcubWF0Y2hpbmcgPSAwO1xuICAgICAgbGV0IGNvdW50ID0wO1xuICAgICAgZm9yIChsZXQgY2FwIGluIGpvYlByb2ZpbGUuY2FwYWJpbGl0eV9tYXRyaXgpIHtcbiAgICAgICAgaWYgKGpvYlByb2ZpbGUuY2FwYWJpbGl0eV9tYXRyaXhbY2FwXSA9PSAtMSB8fCBqb2JQcm9maWxlLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0gPT0gMCB8fCBqb2JQcm9maWxlLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0gPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIH0gZWxzZSBpZiAoam9iUHJvZmlsZS5jYXBhYmlsaXR5X21hdHJpeFtjYXBdID09IGNhbmRpZGF0ZS5jYXBhYmlsaXR5X21hdHJpeFtjYXBdKSB7XG4gICAgICAgICAgICBjYW5kaWRhdGVfY2FyZF92aWV3LmV4YWN0X21hdGNoaW5nICs9IDE7XG4gICAgICAgICAgY291bnQrKztcbiAgICAgICAgfSBlbHNlIGlmIChqb2JQcm9maWxlLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0gPT0gKE51bWJlcihjYW5kaWRhdGUuY2FwYWJpbGl0eV9tYXRyaXhbY2FwXSkgLSBDb25zdFZhcmlhYmxlcy5ESUZGRVJFTkNFX0lOX0NPTVBMRVhJVFlfU0NFTkFSSU8pKSB7XG4gICAgICAgICAgY2FuZGlkYXRlX2NhcmRfdmlldy5hYm92ZV9vbmVfc3RlcF9tYXRjaGluZyArPSAxO1xuICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgIH0gZWxzZSBpZiAoam9iUHJvZmlsZS5jYXBhYmlsaXR5X21hdHJpeFtjYXBdID09IChOdW1iZXIoY2FuZGlkYXRlLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0pICsgQ29uc3RWYXJpYWJsZXMuRElGRkVSRU5DRV9JTl9DT01QTEVYSVRZX1NDRU5BUklPKSkge1xuICAgICAgICAgIGNhbmRpZGF0ZV9jYXJkX3ZpZXcuYmVsb3dfb25lX3N0ZXBfbWF0Y2hpbmcgKz0gMTtcbiAgICAgICAgICBjb3VudCsrO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNhbmRpZGF0ZV9jYXJkX3ZpZXcuYWJvdmVfb25lX3N0ZXBfbWF0Y2hpbmcgPSAoY2FuZGlkYXRlX2NhcmRfdmlldy5hYm92ZV9vbmVfc3RlcF9tYXRjaGluZyAvIGNvdW50KSAqIDEwMDtcbiAgICAgIGNhbmRpZGF0ZV9jYXJkX3ZpZXcuYmVsb3dfb25lX3N0ZXBfbWF0Y2hpbmcgPSAoY2FuZGlkYXRlX2NhcmRfdmlldy5iZWxvd19vbmVfc3RlcF9tYXRjaGluZyAvIGNvdW50KSAqIDEwMDtcbiAgICAgIGNhbmRpZGF0ZV9jYXJkX3ZpZXcuZXhhY3RfbWF0Y2hpbmcgPSAoY2FuZGlkYXRlX2NhcmRfdmlldy5leGFjdF9tYXRjaGluZyAvIGNvdW50KSAqIDEwMDtcbiAgICAgIGNhbmRpZGF0ZV9jYXJkX3ZpZXcubWF0Y2hpbmcgPSBjYW5kaWRhdGVfY2FyZF92aWV3LmFib3ZlX29uZV9zdGVwX21hdGNoaW5nICsgY2FuZGlkYXRlX2NhcmRfdmlldy5iZWxvd19vbmVfc3RlcF9tYXRjaGluZyArIGNhbmRpZGF0ZV9jYXJkX3ZpZXcuZXhhY3RfbWF0Y2hpbmc7XG4gICAgICBjYW5kaWRhdGVfY2FyZF92aWV3LnNhbGFyeSA9IGNhbmRpZGF0ZS5wcm9mZXNzaW9uYWxEZXRhaWxzLmN1cnJlbnRTYWxhcnk7XG4gICAgICBjYW5kaWRhdGVfY2FyZF92aWV3LmV4cGVyaWVuY2UgPSBjYW5kaWRhdGUucHJvZmVzc2lvbmFsRGV0YWlscy5leHBlcmllbmNlO1xuICAgICAgY2FuZGlkYXRlX2NhcmRfdmlldy5lZHVjYXRpb24gPSBjYW5kaWRhdGUucHJvZmVzc2lvbmFsRGV0YWlscy5lZHVjYXRpb247XG4gICAgICBjYW5kaWRhdGVfY2FyZF92aWV3LnByb2ZpY2llbmNpZXMgPSBjYW5kaWRhdGUucHJvZmljaWVuY2llcztcbiAgICAgIGNhbmRpZGF0ZV9jYXJkX3ZpZXcuaW50ZXJlc3RlZEluZHVzdHJpZXMgPSBjYW5kaWRhdGUuaW50ZXJlc3RlZEluZHVzdHJpZXM7XG4gICAgICBjYW5kaWRhdGVfY2FyZF92aWV3Ll9pZCA9IGNhbmRpZGF0ZS5faWQ7Ly90b2RvIHNvbHZlIHRoZSBwcm9ibGVtIG9mIGxvY2F0aW9uIGZyb20gZnJvbnQgZW5kXG4gICAgICBjYW5kaWRhdGVfY2FyZF92aWV3LmlzVmlzaWJsZSA9IGNhbmRpZGF0ZS5pc1Zpc2libGU7XG4gICAgICBpZihjYW5kaWRhdGUubG9jYXRpb24pIHtcbiAgICAgICAgY2FuZGlkYXRlX2NhcmRfdmlldy5sb2NhdGlvbiA9IGNhbmRpZGF0ZS5sb2NhdGlvbi5jaXR5O1xuICAgICAgfWVsc2Uge1xuICAgICAgICBjYW5kaWRhdGVfY2FyZF92aWV3LmxvY2F0aW9uID0gJ1B1bmUnO1xuICAgICAgfVxuICAgICAgY2FuZGlkYXRlX2NhcmRfdmlldy5ub3RpY2VQZXJpb2QgPSBjYW5kaWRhdGUucHJvZmVzc2lvbmFsRGV0YWlscy5ub3RpY2VQZXJpb2Q7XG4gICAgICBpZiAoKGNhbmRpZGF0ZV9jYXJkX3ZpZXcuYWJvdmVfb25lX3N0ZXBfbWF0Y2hpbmcgKyBjYW5kaWRhdGVfY2FyZF92aWV3LmV4YWN0X21hdGNoaW5nKSA+PSBDb25zdFZhcmlhYmxlcy5MT1dFUl9MSU1JVF9GT1JfU0VBUkNIX1JFU1VMVCkge1xuICAgICAgICBjYW5kaWRhdGVfcV9jYXJkX21hcFtjYW5kaWRhdGUudXNlcklkXT1jYW5kaWRhdGVfY2FyZF92aWV3O1xuICAgICAgICBpZHNPZlNlbGVjdGVkQ2FuZGlkYXRlcy5wdXNoKGNhbmRpZGF0ZS51c2VySWQpO1xuICAgICAgfVxuXG4gICAgfVxuICAgIGxldCBjYW5kaWRhdGVzX3FfY2FyZHNfc2VuZCA6IENhbmRpZGF0ZVFDYXJkW10gPSBuZXcgQXJyYXkoMCk7XG4gICAgbGV0IHVzZXJSZXBvc2l0b3J5OiBVc2VyUmVwb3NpdG9yeSA9IG5ldyBVc2VyUmVwb3NpdG9yeSgpO1xuICAgIGNvbnNvbGUudGltZUVuZCgnZ2V0Q2FuZGlkYXRlUUNhcmRGb3JMb29wJyk7XG4gICAgdXNlclJlcG9zaXRvcnkucmV0cmlldmVCeU11bHRpSWRzKGlkc09mU2VsZWN0ZWRDYW5kaWRhdGVzLHt9LCAoZXJyb3I6IGFueSwgcmVzOiBhbnkpID0+IHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XG4gICAgICB9XG4gICAgICAgZWxzZSB7XG4gICAgICAgIGlmKHJlcy5sZW5ndGg+MCkge1xuICAgICAgICAgIGNvbnNvbGUudGltZSgncmV0cmlldmVCeU11bHRpSWRzJyk7XG4gICAgICAgICAgZm9yKGxldCB1c2VyIG9mIHJlcyl7XG4gICAgICAgICAgICBsZXQgY2FuZGlkYXRlUWNhcmQgOiBDYW5kaWRhdGVRQ2FyZD0gY2FuZGlkYXRlX3FfY2FyZF9tYXBbdXNlci5faWRdO1xuICAgICAgICAgICAgY2FuZGlkYXRlUWNhcmQuZW1haWw9dXNlci5lbWFpbDtcbiAgICAgICAgICAgIGNhbmRpZGF0ZVFjYXJkLmZpcnN0X25hbWU9dXNlci5maXJzdF9uYW1lO1xuICAgICAgICAgICAgY2FuZGlkYXRlUWNhcmQubGFzdF9uYW1lPXVzZXIubGFzdF9uYW1lO1xuICAgICAgICAgICAgY2FuZGlkYXRlUWNhcmQubW9iaWxlX251bWJlcj11c2VyLm1vYmlsZV9udW1iZXI7XG4gICAgICAgICAgICBjYW5kaWRhdGVRY2FyZC5waWN0dXJlPXVzZXIucGljdHVyZTtcbiAgICAgICAgICAgIGNhbmRpZGF0ZXNfcV9jYXJkc19zZW5kLnB1c2goY2FuZGlkYXRlUWNhcmQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjYW5kaWRhdGVzX3FfY2FyZHNfc2VuZC5zb3J0KChmaXJzdDogQ2FuZGlkYXRlUUNhcmQsc2Vjb25kIDogQ2FuZGlkYXRlUUNhcmQpOm51bWJlcj0+IHtcbiAgICAgICAgICAgIGlmKChmaXJzdC5hYm92ZV9vbmVfc3RlcF9tYXRjaGluZytmaXJzdC5leGFjdF9tYXRjaGluZykgPihzZWNvbmQuYWJvdmVfb25lX3N0ZXBfbWF0Y2hpbmcrc2Vjb25kLmV4YWN0X21hdGNoaW5nKSApe1xuICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZigoZmlyc3QuYWJvdmVfb25lX3N0ZXBfbWF0Y2hpbmcrZmlyc3QuZXhhY3RfbWF0Y2hpbmcpIDwgKHNlY29uZC5hYm92ZV9vbmVfc3RlcF9tYXRjaGluZytzZWNvbmQuZXhhY3RfbWF0Y2hpbmcpICkge1xuICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGNvbnNvbGUudGltZUVuZCgncmV0cmlldmVCeU11bHRpSWRzJyk7XG4gICAgICAgICAgY2FsbGJhY2sobnVsbCxjYW5kaWRhdGVzX3FfY2FyZHNfc2VuZCk7XG4gICAgICAgIH1lbHNlIHtcbiAgICAgICAgICBjYWxsYmFjayhudWxsLGNhbmRpZGF0ZXNfcV9jYXJkc19zZW5kKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG5cbiAgfVxuXG4gIGdldENvZGVzRnJvbWluZHVzdHJ5KGluZHVzdHJ5OiBJbmR1c3RyeU1vZGVsKTogc3RyaW5nW10ge1xuICAgIGNvbnNvbGUudGltZSgnZ2V0Q29kZXNGcm9taW5kdXN0cnknKTtcbiAgICBsZXQgc2VsZWN0ZWRfY29tcGxleGl0eTogc3RyaW5nW10gPSBuZXcgQXJyYXkoMCk7XG4gICAgZm9yIChsZXQgcm9sZSBvZiBpbmR1c3RyeS5yb2xlcykge1xuICAgICAgZm9yIChsZXQgY2FwYWJpbGl0eSBvZiByb2xlLmRlZmF1bHRfY29tcGxleGl0aWVzKSB7XG4gICAgICAgIGZvciAobGV0IGNvbXBsZXhpdHkgb2YgY2FwYWJpbGl0eS5jb21wbGV4aXRpZXMpIHtcbiAgICAgICAgICBmb3IgKGxldCBzY2VuYXJpbyBvZiBjb21wbGV4aXR5LnNjZW5hcmlvcykge1xuICAgICAgICAgICAgaWYgKHNjZW5hcmlvLmlzQ2hlY2tlZCkge1xuICAgICAgICAgICAgICBpZiAoc2NlbmFyaW8uY29kZSkge1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkX2NvbXBsZXhpdHkucHVzaChzY2VuYXJpby5jb2RlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmb3IgKGxldCBjYXBhYmlsaXR5IG9mIHJvbGUuY2FwYWJpbGl0aWVzKSB7XG4gICAgICAgIGZvciAobGV0IGNvbXBsZXhpdHkgb2YgY2FwYWJpbGl0eS5jb21wbGV4aXRpZXMpIHtcbiAgICAgICAgICBmb3IgKGxldCBzY2VuYXJpbyBvZiBjb21wbGV4aXR5LnNjZW5hcmlvcykge1xuICAgICAgICAgICAgaWYgKHNjZW5hcmlvLmlzQ2hlY2tlZCkge1xuICAgICAgICAgICAgICBpZiAoc2NlbmFyaW8uY29kZSkge1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkX2NvbXBsZXhpdHkucHVzaChzY2VuYXJpby5jb2RlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBjb25zb2xlLnRpbWUoJ2dldENvZGVzRnJvbWluZHVzdHJ5Jyk7XG4gICAgcmV0dXJuIHNlbGVjdGVkX2NvbXBsZXhpdHk7XG4gIH1cblxuXG59XG5cbk9iamVjdFxuICAuc2VhbChDYW5kaWRhdGVSZXBvc2l0b3J5KTtcblxuZXhwb3J0ID0gQ2FuZGlkYXRlUmVwb3NpdG9yeTtcbiJdfQ==
