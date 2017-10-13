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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L2NhbmRpZGF0ZS5yZXBvc2l0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsNkRBQWdFO0FBQ2hFLHVEQUEwRDtBQUUxRCx3RUFBbUU7QUFDbkUsZ0VBQTREO0FBSzVELGtEQUFxRDtBQUlyRDtJQUFrQyx1Q0FBMEI7SUFFMUQ7ZUFDRSxrQkFBTSxlQUFlLENBQUM7SUFDeEIsQ0FBQztJQUdELCtDQUFpQixHQUFqQixVQUFrQixVQUFpQixFQUFFLFVBQTJCLEVBQUUsYUFBdUIsRUFBRSxRQUFzQztRQUMvSCxPQUFPLENBQUMsSUFBSSxDQUFDLDBCQUEwQixDQUFDLENBQUM7UUFDekMsSUFBSSxvQkFBb0IsR0FBUSxFQUFHLENBQUM7UUFDcEMsSUFBSSx1QkFBdUIsR0FBYSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyRCxHQUFHLENBQUMsQ0FBa0IsVUFBVSxFQUFWLHlCQUFVLEVBQVYsd0JBQVUsRUFBVixJQUFVO1lBQTNCLElBQUksU0FBUyxtQkFBQTtZQUNoQixJQUFJLE9BQU8sR0FBWSxLQUFLLENBQUM7WUFDN0IsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFDbEIsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMzRCxRQUFRLENBQUM7Z0JBQ1gsQ0FBQztZQUNILENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztvQkFDOUIsR0FBRyxDQUFDLENBQWEsVUFBeUIsRUFBekIsS0FBQSxVQUFVLENBQUMsY0FBYyxFQUF6QixjQUF5QixFQUF6QixJQUF5Qjt3QkFBckMsSUFBSSxJQUFJLFNB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U0FDRjtRQUNELE9BQU8sQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUNyQyxNQUFNLENBQUMsbUJBQW1CLENBQUM7SUFDN0IsQ0FBQztJQUdILDBCQUFDO0FBQUQsQ0FsSkEsQUFrSkMsQ0FsSmlDLGNBQWMsR0FrSi9DO0FBRUQsTUFBTTtLQUNILElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBRTdCLGlCQUFTLG1CQUFtQixDQUFDIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L2NhbmRpZGF0ZS5yZXBvc2l0b3J5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENhbmRpZGF0ZVNjaGVtYSA9IHJlcXVpcmUoXCIuLi9zY2hlbWFzL2NhbmRpZGF0ZS5zY2hlbWFcIik7XHJcbmltcG9ydCBSZXBvc2l0b3J5QmFzZSA9IHJlcXVpcmUoXCIuL2Jhc2UvcmVwb3NpdG9yeS5iYXNlXCIpO1xyXG5pbXBvcnQgSUNhbmRpZGF0ZSA9IHJlcXVpcmUoXCIuLi9tb25nb29zZS9jYW5kaWRhdGVcIik7XHJcbmltcG9ydCB7Q2FuZGlkYXRlUUNhcmR9IGZyb20gXCIuLi8uLi9zZWFyY2gvbW9kZWwvY2FuZGlkYXRlLXEtY2FyZFwiO1xyXG5pbXBvcnQge0NvbnN0VmFyaWFibGVzfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3NoYXJlZGNvbnN0YW50c1wiO1xyXG5pbXBvcnQgSm9iUHJvZmlsZU1vZGVsID0gcmVxdWlyZShcIi4uL21vZGVsL2pvYnByb2ZpbGUubW9kZWxcIik7XHJcbmltcG9ydCBDYW5kaWRhdGVNb2RlbCA9IHJlcXVpcmUoXCIuLi9tb2RlbC9jYW5kaWRhdGUubW9kZWxcIik7XHJcbmltcG9ydCBJbmR1c3RyeU1vZGVsID0gcmVxdWlyZShcIi4uL21vZGVsL2luZHVzdHJ5Lm1vZGVsXCIpO1xyXG5pbXBvcnQgQ2FuZGlkYXRlQ2FyZFZpZXdNb2RlbCA9IHJlcXVpcmUoXCIuLi9tb2RlbC9jYW5kaWRhdGUtY2FyZC12aWV3Lm1vZGVsXCIpO1xyXG5pbXBvcnQgVXNlclJlcG9zaXRvcnkgPSByZXF1aXJlKFwiLi91c2VyLnJlcG9zaXRvcnlcIik7XHJcbmltcG9ydCBVc2VyTW9kZWwgPSByZXF1aXJlKFwiLi4vbW9kZWwvdXNlci5tb2RlbFwiKTtcclxuXHJcblxyXG5jbGFzcyBDYW5kaWRhdGVSZXBvc2l0b3J5IGV4dGVuZHMgUmVwb3NpdG9yeUJhc2U8SUNhbmRpZGF0ZT4ge1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHN1cGVyKENhbmRpZGF0ZVNjaGVtYSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgZ2V0Q2FuZGlkYXRlUUNhcmQoY2FuZGlkYXRlczogYW55W10sIGpvYlByb2ZpbGU6IEpvYlByb2ZpbGVNb2RlbCwgY2FuZGlkYXRlc0lkczogc3RyaW5nW10sIGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBjb25zb2xlLnRpbWUoJ2dldENhbmRpZGF0ZVFDYXJkRm9yTG9vcCcpO1xyXG4gICAgbGV0IGNhbmRpZGF0ZV9xX2NhcmRfbWFwIDphbnkgPSB7IH07XHJcbiAgICBsZXQgaWRzT2ZTZWxlY3RlZENhbmRpZGF0ZXMgOiBzdHJpbmdbXT0gbmV3IEFycmF5KDApO1xyXG4gICAgZm9yIChsZXQgY2FuZGlkYXRlIG9mIGNhbmRpZGF0ZXMpIHtcclxuICAgICAgbGV0IGlzRm91bmQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgaWYgKGNhbmRpZGF0ZXNJZHMpIHtcclxuICAgICAgICBpZiAoY2FuZGlkYXRlc0lkcy5pbmRleE9mKGNhbmRpZGF0ZS5faWQudG9TdHJpbmcoKSkgPT09IC0xKSB7XHJcbiAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKGpvYlByb2ZpbGUuY2FuZGlkYXRlX2xpc3QpIHtcclxuICAgICAgICAgIGZvciAobGV0IGxpc3Qgb2Ygam9iUHJvZmlsZS5jYW5kaWRhdGVfbGlzdCkge1xyXG4gICAgICAgICAgICBpZiAobGlzdC5uYW1lID09PSBDb25zdFZhcmlhYmxlcy5TSE9SVF9MSVNURURfQ0FORElEQVRFKSB7XHJcbiAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGxpc3QuaWRzLmluZGV4T2YoY2FuZGlkYXRlLl9pZC50b1N0cmluZygpKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICBpc0ZvdW5kID0gdHJ1ZTtcclxuICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaXNGb3VuZCkge1xyXG4gICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGxldCBjYW5kaWRhdGVfY2FyZF92aWV3OiBDYW5kaWRhdGVRQ2FyZCA9IG5ldyBDYW5kaWRhdGVRQ2FyZCgpO1xyXG4gICAgICBjYW5kaWRhdGVfY2FyZF92aWV3Lm1hdGNoaW5nID0gMDtcclxuICAgICAgbGV0IGNvdW50ID0wO1xyXG4gICAgICBmb3IgKGxldCBjYXAgaW4gam9iUHJvZmlsZS5jYXBhYmlsaXR5X21hdHJpeCkge1xyXG4gICAgICAgIGlmIChqb2JQcm9maWxlLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0gPT0gLTEgfHwgam9iUHJvZmlsZS5jYXBhYmlsaXR5X21hdHJpeFtjYXBdID09IDAgfHwgam9iUHJvZmlsZS5jYXBhYmlsaXR5X21hdHJpeFtjYXBdID09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIH0gZWxzZSBpZiAoam9iUHJvZmlsZS5jYXBhYmlsaXR5X21hdHJpeFtjYXBdID09IGNhbmRpZGF0ZS5jYXBhYmlsaXR5X21hdHJpeFtjYXBdKSB7XHJcbiAgICAgICAgICAgIGNhbmRpZGF0ZV9jYXJkX3ZpZXcuZXhhY3RfbWF0Y2hpbmcgKz0gMTtcclxuICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgfSBlbHNlIGlmIChqb2JQcm9maWxlLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0gPT0gKE51bWJlcihjYW5kaWRhdGUuY2FwYWJpbGl0eV9tYXRyaXhbY2FwXSkgLSBDb25zdFZhcmlhYmxlcy5ESUZGRVJFTkNFX0lOX0NPTVBMRVhJVFlfU0NFTkFSSU8pKSB7XHJcbiAgICAgICAgICBjYW5kaWRhdGVfY2FyZF92aWV3LmFib3ZlX29uZV9zdGVwX21hdGNoaW5nICs9IDE7XHJcbiAgICAgICAgICBjb3VudCsrO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoam9iUHJvZmlsZS5jYXBhYmlsaXR5X21hdHJpeFtjYXBdID09IChOdW1iZXIoY2FuZGlkYXRlLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0pICsgQ29uc3RWYXJpYWJsZXMuRElGRkVSRU5DRV9JTl9DT01QTEVYSVRZX1NDRU5BUklPKSkge1xyXG4gICAgICAgICAgY2FuZGlkYXRlX2NhcmRfdmlldy5iZWxvd19vbmVfc3RlcF9tYXRjaGluZyArPSAxO1xyXG4gICAgICAgICAgY291bnQrKztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY291bnQrKztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgY2FuZGlkYXRlX2NhcmRfdmlldy5hYm92ZV9vbmVfc3RlcF9tYXRjaGluZyA9IChjYW5kaWRhdGVfY2FyZF92aWV3LmFib3ZlX29uZV9zdGVwX21hdGNoaW5nIC8gY291bnQpICogMTAwO1xyXG4gICAgICBjYW5kaWRhdGVfY2FyZF92aWV3LmJlbG93X29uZV9zdGVwX21hdGNoaW5nID0gKGNhbmRpZGF0ZV9jYXJkX3ZpZXcuYmVsb3dfb25lX3N0ZXBfbWF0Y2hpbmcgLyBjb3VudCkgKiAxMDA7XHJcbiAgICAgIGNhbmRpZGF0ZV9jYXJkX3ZpZXcuZXhhY3RfbWF0Y2hpbmcgPSAoY2FuZGlkYXRlX2NhcmRfdmlldy5leGFjdF9tYXRjaGluZyAvIGNvdW50KSAqIDEwMDtcclxuICAgICAgY2FuZGlkYXRlX2NhcmRfdmlldy5tYXRjaGluZyA9IGNhbmRpZGF0ZV9jYXJkX3ZpZXcuYWJvdmVfb25lX3N0ZXBfbWF0Y2hpbmcgKyBjYW5kaWRhdGVfY2FyZF92aWV3LmJlbG93X29uZV9zdGVwX21hdGNoaW5nICsgY2FuZGlkYXRlX2NhcmRfdmlldy5leGFjdF9tYXRjaGluZztcclxuICAgICAgY2FuZGlkYXRlX2NhcmRfdmlldy5zYWxhcnkgPSBjYW5kaWRhdGUucHJvZmVzc2lvbmFsRGV0YWlscy5jdXJyZW50U2FsYXJ5O1xyXG4gICAgICBjYW5kaWRhdGVfY2FyZF92aWV3LmV4cGVyaWVuY2UgPSBjYW5kaWRhdGUucHJvZmVzc2lvbmFsRGV0YWlscy5leHBlcmllbmNlO1xyXG4gICAgICBjYW5kaWRhdGVfY2FyZF92aWV3LmVkdWNhdGlvbiA9IGNhbmRpZGF0ZS5wcm9mZXNzaW9uYWxEZXRhaWxzLmVkdWNhdGlvbjtcclxuICAgICAgY2FuZGlkYXRlX2NhcmRfdmlldy5wcm9maWNpZW5jaWVzID0gY2FuZGlkYXRlLnByb2ZpY2llbmNpZXM7XHJcbiAgICAgIGNhbmRpZGF0ZV9jYXJkX3ZpZXcuaW50ZXJlc3RlZEluZHVzdHJpZXMgPSBjYW5kaWRhdGUuaW50ZXJlc3RlZEluZHVzdHJpZXM7XHJcbiAgICAgIGNhbmRpZGF0ZV9jYXJkX3ZpZXcuX2lkID0gY2FuZGlkYXRlLl9pZDsvL3RvZG8gc29sdmUgdGhlIHByb2JsZW0gb2YgbG9jYXRpb24gZnJvbSBmcm9udCBlbmRcclxuICAgICAgY2FuZGlkYXRlX2NhcmRfdmlldy5pc1Zpc2libGUgPSBjYW5kaWRhdGUuaXNWaXNpYmxlO1xyXG4gICAgICBpZihjYW5kaWRhdGUubG9jYXRpb24pIHtcclxuICAgICAgICBjYW5kaWRhdGVfY2FyZF92aWV3LmxvY2F0aW9uID0gY2FuZGlkYXRlLmxvY2F0aW9uLmNpdHk7XHJcbiAgICAgIH1lbHNlIHtcclxuICAgICAgICBjYW5kaWRhdGVfY2FyZF92aWV3LmxvY2F0aW9uID0gJ1B1bmUnO1xyXG4gICAgICB9XHJcbiAgICAgIGNhbmRpZGF0ZV9jYXJkX3ZpZXcubm90aWNlUGVyaW9kID0gY2FuZGlkYXRlLnByb2Zlc3Npb25hbERldGFpbHMubm90aWNlUGVyaW9kO1xyXG4gICAgICBpZiAoKGNhbmRpZGF0ZV9jYXJkX3ZpZXcuYWJvdmVfb25lX3N0ZXBfbWF0Y2hpbmcgKyBjYW5kaWRhdGVfY2FyZF92aWV3LmV4YWN0X21hdGNoaW5nKSA+PSBDb25zdFZhcmlhYmxlcy5MT1dFUl9MSU1JVF9GT1JfU0VBUkNIX1JFU1VMVCkge1xyXG4gICAgICAgIGNhbmRpZGF0ZV9xX2NhcmRfbWFwW2NhbmRpZGF0ZS51c2VySWRdPWNhbmRpZGF0ZV9jYXJkX3ZpZXc7XHJcbiAgICAgICAgaWRzT2ZTZWxlY3RlZENhbmRpZGF0ZXMucHVzaChjYW5kaWRhdGUudXNlcklkKTtcclxuICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIGxldCBjYW5kaWRhdGVzX3FfY2FyZHNfc2VuZCA6IENhbmRpZGF0ZVFDYXJkW10gPSBuZXcgQXJyYXkoMCk7XHJcbiAgICBsZXQgdXNlclJlcG9zaXRvcnk6IFVzZXJSZXBvc2l0b3J5ID0gbmV3IFVzZXJSZXBvc2l0b3J5KCk7XHJcbiAgICBjb25zb2xlLnRpbWVFbmQoJ2dldENhbmRpZGF0ZVFDYXJkRm9yTG9vcCcpO1xyXG4gICAgdXNlclJlcG9zaXRvcnkucmV0cmlldmVCeU11bHRpSWRzKGlkc09mU2VsZWN0ZWRDYW5kaWRhdGVzLHt9LCAoZXJyb3I6IGFueSwgcmVzOiBhbnkpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9XHJcbiAgICAgICBlbHNlIHtcclxuICAgICAgICBpZihyZXMubGVuZ3RoPjApIHtcclxuICAgICAgICAgIGNvbnNvbGUudGltZSgncmV0cmlldmVCeU11bHRpSWRzJyk7XHJcbiAgICAgICAgICBmb3IobGV0IHVzZXIgb2YgcmVzKXtcclxuICAgICAgICAgICAgbGV0IGNhbmRpZGF0ZVFjYXJkIDogQ2FuZGlkYXRlUUNhcmQ9IGNhbmRpZGF0ZV9xX2NhcmRfbWFwW3VzZXIuX2lkXTtcclxuICAgICAgICAgICAgY2FuZGlkYXRlUWNhcmQuZW1haWw9dXNlci5lbWFpbDtcclxuICAgICAgICAgICAgY2FuZGlkYXRlUWNhcmQuZmlyc3RfbmFtZT11c2VyLmZpcnN0X25hbWU7XHJcbiAgICAgICAgICAgIGNhbmRpZGF0ZVFjYXJkLmxhc3RfbmFtZT11c2VyLmxhc3RfbmFtZTtcclxuICAgICAgICAgICAgY2FuZGlkYXRlUWNhcmQubW9iaWxlX251bWJlcj11c2VyLm1vYmlsZV9udW1iZXI7XHJcbiAgICAgICAgICAgIGNhbmRpZGF0ZVFjYXJkLnBpY3R1cmU9dXNlci5waWN0dXJlO1xyXG4gICAgICAgICAgICBjYW5kaWRhdGVzX3FfY2FyZHNfc2VuZC5wdXNoKGNhbmRpZGF0ZVFjYXJkKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNhbmRpZGF0ZXNfcV9jYXJkc19zZW5kLnNvcnQoKGZpcnN0OiBDYW5kaWRhdGVRQ2FyZCxzZWNvbmQgOiBDYW5kaWRhdGVRQ2FyZCk6bnVtYmVyPT4ge1xyXG4gICAgICAgICAgICBpZigoZmlyc3QuYWJvdmVfb25lX3N0ZXBfbWF0Y2hpbmcrZmlyc3QuZXhhY3RfbWF0Y2hpbmcpID4oc2Vjb25kLmFib3ZlX29uZV9zdGVwX21hdGNoaW5nK3NlY29uZC5leGFjdF9tYXRjaGluZykgKXtcclxuICAgICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYoKGZpcnN0LmFib3ZlX29uZV9zdGVwX21hdGNoaW5nK2ZpcnN0LmV4YWN0X21hdGNoaW5nKSA8IChzZWNvbmQuYWJvdmVfb25lX3N0ZXBfbWF0Y2hpbmcrc2Vjb25kLmV4YWN0X21hdGNoaW5nKSApIHtcclxuICAgICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgY29uc29sZS50aW1lRW5kKCdyZXRyaWV2ZUJ5TXVsdGlJZHMnKTtcclxuICAgICAgICAgIGNhbGxiYWNrKG51bGwsY2FuZGlkYXRlc19xX2NhcmRzX3NlbmQpO1xyXG4gICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgIGNhbGxiYWNrKG51bGwsY2FuZGlkYXRlc19xX2NhcmRzX3NlbmQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG5cclxuICB9XHJcblxyXG4gIGdldENvZGVzRnJvbWluZHVzdHJ5KGluZHVzdHJ5OiBJbmR1c3RyeU1vZGVsKTogc3RyaW5nW10ge1xyXG4gICAgY29uc29sZS50aW1lKCdnZXRDb2Rlc0Zyb21pbmR1c3RyeScpO1xyXG4gICAgbGV0IHNlbGVjdGVkX2NvbXBsZXhpdHk6IHN0cmluZ1tdID0gbmV3IEFycmF5KDApO1xyXG4gICAgZm9yIChsZXQgcm9sZSBvZiBpbmR1c3RyeS5yb2xlcykge1xyXG4gICAgICBmb3IgKGxldCBjYXBhYmlsaXR5IG9mIHJvbGUuZGVmYXVsdF9jb21wbGV4aXRpZXMpIHtcclxuICAgICAgICBmb3IgKGxldCBjb21wbGV4aXR5IG9mIGNhcGFiaWxpdHkuY29tcGxleGl0aWVzKSB7XHJcbiAgICAgICAgICBmb3IgKGxldCBzY2VuYXJpbyBvZiBjb21wbGV4aXR5LnNjZW5hcmlvcykge1xyXG4gICAgICAgICAgICBpZiAoc2NlbmFyaW8uaXNDaGVja2VkKSB7XHJcbiAgICAgICAgICAgICAgaWYgKHNjZW5hcmlvLmNvZGUpIHtcclxuICAgICAgICAgICAgICAgIHNlbGVjdGVkX2NvbXBsZXhpdHkucHVzaChzY2VuYXJpby5jb2RlKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZvciAobGV0IGNhcGFiaWxpdHkgb2Ygcm9sZS5jYXBhYmlsaXRpZXMpIHtcclxuICAgICAgICBmb3IgKGxldCBjb21wbGV4aXR5IG9mIGNhcGFiaWxpdHkuY29tcGxleGl0aWVzKSB7XHJcbiAgICAgICAgICBmb3IgKGxldCBzY2VuYXJpbyBvZiBjb21wbGV4aXR5LnNjZW5hcmlvcykge1xyXG4gICAgICAgICAgICBpZiAoc2NlbmFyaW8uaXNDaGVja2VkKSB7XHJcbiAgICAgICAgICAgICAgaWYgKHNjZW5hcmlvLmNvZGUpIHtcclxuICAgICAgICAgICAgICAgIHNlbGVjdGVkX2NvbXBsZXhpdHkucHVzaChzY2VuYXJpby5jb2RlKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnNvbGUudGltZSgnZ2V0Q29kZXNGcm9taW5kdXN0cnknKTtcclxuICAgIHJldHVybiBzZWxlY3RlZF9jb21wbGV4aXR5O1xyXG4gIH1cclxuXHJcblxyXG59XHJcblxyXG5PYmplY3RcclxuICAuc2VhbChDYW5kaWRhdGVSZXBvc2l0b3J5KTtcclxuXHJcbmV4cG9ydCA9IENhbmRpZGF0ZVJlcG9zaXRvcnk7XHJcbiJdfQ==
