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
                if (jobProfile.complexity_musthave_matrix == -1 || jobProfile.complexity_musthave_matrix == undefined) {
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L2NhbmRpZGF0ZS5yZXBvc2l0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsNkRBQWdFO0FBQ2hFLHVEQUEwRDtBQUUxRCx3RUFBbUU7QUFDbkUsZ0VBQTREO0FBSzVELGtEQUFxRDtBQUlyRDtJQUFrQyx1Q0FBMEI7SUFFMUQ7ZUFDRSxrQkFBTSxlQUFlLENBQUM7SUFDeEIsQ0FBQztJQUdELCtDQUFpQixHQUFqQixVQUFrQixVQUFpQixFQUFFLFVBQTJCLEVBQUUsYUFBdUIsRUFBRSxRQUFzQztRQUMvSCxPQUFPLENBQUMsSUFBSSxDQUFDLDBCQUEwQixDQUFDLENBQUM7UUFDekMsSUFBSSxvQkFBb0IsR0FBUSxFQUFHLENBQUM7UUFDcEMsSUFBSSx1QkFBdUIsR0FBYSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyRCxHQUFHLENBQUMsQ0FBa0IsVUFBVSxFQUFWLHlCQUFVLEVBQVYsd0JBQVUsRUFBVixJQUFVO1lBQTNCLElBQUksU0FBUyxtQkFBQTtZQUNoQixJQUFJLE9BQU8sR0FBWSxLQUFLLENBQUM7WUFDN0IsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFDbEIsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMzRCxRQUFRLENBQUM7Z0JBQ1gsQ0FBQztZQUNILENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztvQkFDOUIsR0FBRyxDQUFDLENBQWEsVUFBeUIsRUFBekIsS0FBQSxVQUFVLENBQUMsY0FBYyxFQUF6QixjQUF5QixFQUF6QixJQUF5Qjt3QkFBckMsSUFBSSxJQUFJLFNBQUE7d0JBQ1gsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxnQ0FBYyxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQzs0QkFDeEQsUUFBUSxDQUFDO3dCQUNYLENBQUM7d0JBQ0QsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDdEQsT0FBTyxHQUFHLElBQUksQ0FBQzs0QkFDZixLQUFLLENBQUM7d0JBQ1IsQ0FBQztxQkFDRjtnQkFDSCxDQUFDO2dCQUNELEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQ1osUUFBUSxDQUFDO2dCQUNYLENBQUM7WUFDSCxDQUFDO1lBQ0QsSUFBSSxtQkFBbUIsR0FBbUIsSUFBSSxpQ0FBYyxFQUFFLENBQUM7WUFDL0QsbUJBQW1CLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztZQUNqQyxJQUFJLEtBQUssR0FBRSxDQUFDLENBQUM7WUFDYixHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxVQUFVLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO2dCQUM3QyxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksVUFBVSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxVQUFVLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDMUksQ0FBQztnQkFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQy9FLG1CQUFtQixDQUFDLGNBQWMsSUFBSSxDQUFDLENBQUM7b0JBQzFDLEtBQUssRUFBRSxDQUFDO2dCQUNWLENBQUM7Z0JBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxnQ0FBYyxDQUFDLGlDQUFpQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM5SSxtQkFBbUIsQ0FBQyx1QkFBdUIsSUFBSSxDQUFDLENBQUM7b0JBQ2pELEtBQUssRUFBRSxDQUFDO2dCQUNWLENBQUM7Z0JBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxnQ0FBYyxDQUFDLGlDQUFpQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM5SSxtQkFBbUIsQ0FBQyx1QkFBdUIsSUFBSSxDQUFDLENBQUM7b0JBQ2pELEtBQUssRUFBRSxDQUFDO2dCQUNWLENBQUM7Z0JBQUUsSUFBSSxDQUFDLENBQUM7b0JBQ1AsS0FBSyxFQUFFLENBQUM7Z0JBQ1YsQ0FBQztZQUNILENBQUM7WUFDRCxHQUFHLENBQUEsQ0FBQyxJQUFJLEdBQUcsSUFBSSxVQUFVLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO2dCQUM1QyxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsMEJBQTBCLElBQUksQ0FBQyxDQUFDLElBQUksVUFBVSxDQUFDLDBCQUEwQixJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUM7b0JBQ3RHLG1CQUFtQixDQUFDLG9CQUFvQixHQUFHLEtBQUssQ0FBQztnQkFDbkQsQ0FBQztnQkFBQyxJQUFJLENBQUMsRUFBRSxDQUFBLENBQUMsVUFBVSxDQUFDLDBCQUEwQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDckQsRUFBRSxDQUFBLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3pFLG1CQUFtQixDQUFDLG9CQUFvQixHQUFHLFVBQVUsQ0FBQywwQkFBMEIsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDeEYsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDTixtQkFBbUIsQ0FBQyxvQkFBb0IsR0FBRyxLQUFLLENBQUM7b0JBQ25ELENBQUM7Z0JBQ0gsQ0FBQztZQUNILENBQUM7WUFDRCxtQkFBbUIsQ0FBQyx1QkFBdUIsR0FBRyxDQUFDLG1CQUFtQixDQUFDLHVCQUF1QixHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUMxRyxtQkFBbUIsQ0FBQyx1QkFBdUIsR0FBRyxDQUFDLG1CQUFtQixDQUFDLHVCQUF1QixHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUMxRyxtQkFBbUIsQ0FBQyxjQUFjLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDO1lBQ3hGLG1CQUFtQixDQUFDLFFBQVEsR0FBRyxtQkFBbUIsQ0FBQyx1QkFBdUIsR0FBRyxtQkFBbUIsQ0FBQyx1QkFBdUIsR0FBRyxtQkFBbUIsQ0FBQyxjQUFjLENBQUM7WUFDOUosbUJBQW1CLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQyxhQUFhLENBQUM7WUFDekUsbUJBQW1CLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLENBQUM7WUFDMUUsbUJBQW1CLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLENBQUM7WUFDeEUsbUJBQW1CLENBQUMsYUFBYSxHQUFHLFNBQVMsQ0FBQyxhQUFhLENBQUM7WUFDNUQsbUJBQW1CLENBQUMsb0JBQW9CLEdBQUcsU0FBUyxDQUFDLG9CQUFvQixDQUFDO1lBQzFFLG1CQUFtQixDQUFDLEdBQUcsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDO1lBQ3hDLG1CQUFtQixDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDO1lBQ3BELEVBQUUsQ0FBQSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUN0QixtQkFBbUIsQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7WUFDekQsQ0FBQztZQUFBLElBQUksQ0FBQyxDQUFDO2dCQUNMLG1CQUFtQixDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUM7WUFDeEMsQ0FBQztZQUNELG1CQUFtQixDQUFDLFlBQVksR0FBRyxTQUFTLENBQUMsbUJBQW1CLENBQUMsWUFBWSxDQUFDO1lBQzlFLEVBQUUsQ0FBQyxDQUFDLENBQUMsbUJBQW1CLENBQUMsdUJBQXVCLEdBQUcsbUJBQW1CLENBQUMsY0FBYyxDQUFDLElBQUksZ0NBQWMsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZJLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsR0FBQyxtQkFBbUIsQ0FBQztnQkFDM0QsdUJBQXVCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNqRCxDQUFDO1NBRUY7UUFDRCxJQUFJLHVCQUF1QixHQUFzQixJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5RCxJQUFJLGNBQWMsR0FBbUIsSUFBSSxjQUFjLEVBQUUsQ0FBQztRQUMxRCxPQUFPLENBQUMsT0FBTyxDQUFDLDBCQUEwQixDQUFDLENBQUM7UUFDNUMsY0FBYyxDQUFDLGtCQUFrQixDQUFDLHVCQUF1QixFQUFDLEVBQUUsRUFBRSxVQUFDLEtBQVUsRUFBRSxHQUFRO1lBQ2pGLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ1YsUUFBUSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN4QixDQUFDO1lBQ0EsSUFBSSxDQUFDLENBQUM7Z0JBQ0wsRUFBRSxDQUFBLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNoQixPQUFPLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUM7b0JBQ25DLEdBQUcsQ0FBQSxDQUFhLFVBQUcsRUFBSCxXQUFHLEVBQUgsaUJBQUcsRUFBSCxJQUFHO3dCQUFmLElBQUksSUFBSSxZQUFBO3dCQUNWLElBQUksY0FBYyxHQUFtQixvQkFBb0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBQ3BFLGNBQWMsQ0FBQyxLQUFLLEdBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQzt3QkFDaEMsY0FBYyxDQUFDLFVBQVUsR0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO3dCQUMxQyxjQUFjLENBQUMsU0FBUyxHQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7d0JBQ3hDLGNBQWMsQ0FBQyxhQUFhLEdBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQzt3QkFDaEQsY0FBYyxDQUFDLE9BQU8sR0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO3dCQUNwQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7cUJBQzlDO29CQUNELHVCQUF1QixDQUFDLElBQUksQ0FBQyxVQUFDLEtBQXFCLEVBQUMsTUFBdUI7d0JBQ3pFLEVBQUUsQ0FBQSxDQUFDLENBQUMsS0FBSyxDQUFDLHVCQUF1QixHQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsR0FBRSxDQUFDLE1BQU0sQ0FBQyx1QkFBdUIsR0FBQyxNQUFNLENBQUMsY0FBYyxDQUFFLENBQUMsQ0FBQSxDQUFDOzRCQUNoSCxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ1osQ0FBQzt3QkFDRCxFQUFFLENBQUEsQ0FBQyxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsR0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsdUJBQXVCLEdBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBRSxDQUFDLENBQUMsQ0FBQzs0QkFDbEgsTUFBTSxDQUFDLENBQUMsQ0FBQzt3QkFDWCxDQUFDO3dCQUNELE1BQU0sQ0FBQyxDQUFDLENBQUM7b0JBQ1gsQ0FBQyxDQUFDLENBQUM7b0JBQ0gsT0FBTyxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO29CQUN0QyxRQUFRLENBQUMsSUFBSSxFQUFDLHVCQUF1QixDQUFDLENBQUM7Z0JBQ3pDLENBQUM7Z0JBQUEsSUFBSSxDQUFDLENBQUM7b0JBQ0wsUUFBUSxDQUFDLElBQUksRUFBQyx1QkFBdUIsQ0FBQyxDQUFDO2dCQUN6QyxDQUFDO1lBQ0gsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBR0wsQ0FBQztJQUVELGtEQUFvQixHQUFwQixVQUFxQixRQUF1QjtRQUMxQyxPQUFPLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUM7UUFDckMsSUFBSSxtQkFBbUIsR0FBYSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqRCxHQUFHLENBQUMsQ0FBYSxVQUFjLEVBQWQsS0FBQSxRQUFRLENBQUMsS0FBSyxFQUFkLGNBQWMsRUFBZCxJQUFjO1lBQTFCLElBQUksSUFBSSxTQUFBO1lBQ1gsR0FBRyxDQUFDLENBQW1CLFVBQXlCLEVBQXpCLEtBQUEsSUFBSSxDQUFDLG9CQUFvQixFQUF6QixjQUF5QixFQUF6QixJQUF5QjtnQkFBM0MsSUFBSSxVQUFVLFNBQUE7Z0JBQ2pCLEdBQUcsQ0FBQyxDQUFtQixVQUF1QixFQUF2QixLQUFBLFVBQVUsQ0FBQyxZQUFZLEVBQXZCLGNBQXVCLEVBQXZCLElBQXVCO29CQUF6QyxJQUFJLFVBQVUsU0FBQTtvQkFDakIsR0FBRyxDQUFDLENBQWlCLFVBQW9CLEVBQXBCLEtBQUEsVUFBVSxDQUFDLFNBQVMsRUFBcEIsY0FBb0IsRUFBcEIsSUFBb0I7d0JBQXBDLElBQUksUUFBUSxTQUFBO3dCQUNmLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDOzRCQUN2QixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQ0FDbEIsbUJBQW1CLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQzs0QkFDMUMsQ0FBQzt3QkFDSCxDQUFDO3FCQUNGO2lCQUNGO2FBQ0Y7WUFFRCxHQUFHLENBQUMsQ0FBbUIsVUFBaUIsRUFBakIsS0FBQSxJQUFJLENBQUMsWUFBWSxFQUFqQixjQUFpQixFQUFqQixJQUFpQjtnQkFBbkMsSUFBSSxVQUFVLFNBQUE7Z0JBQ2pCLEdBQUcsQ0FBQyxDQUFtQixVQUF1QixFQUF2QixLQUFBLFVBQVUsQ0FBQyxZQUFZLEVBQXZCLGNBQXVCLEVBQXZCLElBQXVCO29CQUF6QyxJQUFJLFVBQVUsU0FBQTtvQkFDakIsR0FBRyxDQUFDLENBQWlCLFVBQW9CLEVBQXBCLEtBQUEsVUFBVSxDQUFDLFNBQVMsRUFBcEIsY0FBb0IsRUFBcEIsSUFBb0I7d0JBQXBDLElBQUksUUFBUSxTQUFBO3dCQUNmLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDOzRCQUN2QixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQ0FDbEIsbUJBQW1CLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQzs0QkFDMUMsQ0FBQzt3QkFDSCxDQUFDO3FCQUNGO2lCQUNGO2FBQ0Y7U0FDRjtRQUNELE9BQU8sQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUNyQyxNQUFNLENBQUMsbUJBQW1CLENBQUM7SUFDN0IsQ0FBQztJQUdILDBCQUFDO0FBQUQsQ0E3SkEsQUE2SkMsQ0E3SmlDLGNBQWMsR0E2Si9DO0FBRUQsTUFBTTtLQUNILElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBRTdCLGlCQUFTLG1CQUFtQixDQUFDIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L2NhbmRpZGF0ZS5yZXBvc2l0b3J5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENhbmRpZGF0ZVNjaGVtYSA9IHJlcXVpcmUoXCIuLi9zY2hlbWFzL2NhbmRpZGF0ZS5zY2hlbWFcIik7XHJcbmltcG9ydCBSZXBvc2l0b3J5QmFzZSA9IHJlcXVpcmUoXCIuL2Jhc2UvcmVwb3NpdG9yeS5iYXNlXCIpO1xyXG5pbXBvcnQgSUNhbmRpZGF0ZSA9IHJlcXVpcmUoXCIuLi9tb25nb29zZS9jYW5kaWRhdGVcIik7XHJcbmltcG9ydCB7Q2FuZGlkYXRlUUNhcmR9IGZyb20gXCIuLi8uLi9zZWFyY2gvbW9kZWwvY2FuZGlkYXRlLXEtY2FyZFwiO1xyXG5pbXBvcnQge0NvbnN0VmFyaWFibGVzfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3NoYXJlZGNvbnN0YW50c1wiO1xyXG5pbXBvcnQgSm9iUHJvZmlsZU1vZGVsID0gcmVxdWlyZShcIi4uL21vZGVsL2pvYnByb2ZpbGUubW9kZWxcIik7XHJcbmltcG9ydCBDYW5kaWRhdGVNb2RlbCA9IHJlcXVpcmUoXCIuLi9tb2RlbC9jYW5kaWRhdGUubW9kZWxcIik7XHJcbmltcG9ydCBJbmR1c3RyeU1vZGVsID0gcmVxdWlyZShcIi4uL21vZGVsL2luZHVzdHJ5Lm1vZGVsXCIpO1xyXG5pbXBvcnQgQ2FuZGlkYXRlQ2FyZFZpZXdNb2RlbCA9IHJlcXVpcmUoXCIuLi9tb2RlbC9jYW5kaWRhdGUtY2FyZC12aWV3Lm1vZGVsXCIpO1xyXG5pbXBvcnQgVXNlclJlcG9zaXRvcnkgPSByZXF1aXJlKFwiLi91c2VyLnJlcG9zaXRvcnlcIik7XHJcbmltcG9ydCBVc2VyTW9kZWwgPSByZXF1aXJlKFwiLi4vbW9kZWwvdXNlci5tb2RlbFwiKTtcclxuXHJcblxyXG5jbGFzcyBDYW5kaWRhdGVSZXBvc2l0b3J5IGV4dGVuZHMgUmVwb3NpdG9yeUJhc2U8SUNhbmRpZGF0ZT4ge1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHN1cGVyKENhbmRpZGF0ZVNjaGVtYSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgZ2V0Q2FuZGlkYXRlUUNhcmQoY2FuZGlkYXRlczogYW55W10sIGpvYlByb2ZpbGU6IEpvYlByb2ZpbGVNb2RlbCwgY2FuZGlkYXRlc0lkczogc3RyaW5nW10sIGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBjb25zb2xlLnRpbWUoJ2dldENhbmRpZGF0ZVFDYXJkRm9yTG9vcCcpO1xyXG4gICAgbGV0IGNhbmRpZGF0ZV9xX2NhcmRfbWFwIDphbnkgPSB7IH07XHJcbiAgICBsZXQgaWRzT2ZTZWxlY3RlZENhbmRpZGF0ZXMgOiBzdHJpbmdbXT0gbmV3IEFycmF5KDApO1xyXG4gICAgZm9yIChsZXQgY2FuZGlkYXRlIG9mIGNhbmRpZGF0ZXMpIHtcclxuICAgICAgbGV0IGlzRm91bmQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgaWYgKGNhbmRpZGF0ZXNJZHMpIHtcclxuICAgICAgICBpZiAoY2FuZGlkYXRlc0lkcy5pbmRleE9mKGNhbmRpZGF0ZS5faWQudG9TdHJpbmcoKSkgPT09IC0xKSB7XHJcbiAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKGpvYlByb2ZpbGUuY2FuZGlkYXRlX2xpc3QpIHtcclxuICAgICAgICAgIGZvciAobGV0IGxpc3Qgb2Ygam9iUHJvZmlsZS5jYW5kaWRhdGVfbGlzdCkge1xyXG4gICAgICAgICAgICBpZiAobGlzdC5uYW1lID09PSBDb25zdFZhcmlhYmxlcy5TSE9SVF9MSVNURURfQ0FORElEQVRFKSB7XHJcbiAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGxpc3QuaWRzLmluZGV4T2YoY2FuZGlkYXRlLl9pZC50b1N0cmluZygpKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICBpc0ZvdW5kID0gdHJ1ZTtcclxuICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaXNGb3VuZCkge1xyXG4gICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGxldCBjYW5kaWRhdGVfY2FyZF92aWV3OiBDYW5kaWRhdGVRQ2FyZCA9IG5ldyBDYW5kaWRhdGVRQ2FyZCgpO1xyXG4gICAgICBjYW5kaWRhdGVfY2FyZF92aWV3Lm1hdGNoaW5nID0gMDtcclxuICAgICAgbGV0IGNvdW50ID0wO1xyXG4gICAgICBmb3IgKGxldCBjYXAgaW4gam9iUHJvZmlsZS5jYXBhYmlsaXR5X21hdHJpeCkge1xyXG4gICAgICAgIGlmIChqb2JQcm9maWxlLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0gPT0gLTEgfHwgam9iUHJvZmlsZS5jYXBhYmlsaXR5X21hdHJpeFtjYXBdID09IDAgfHwgam9iUHJvZmlsZS5jYXBhYmlsaXR5X21hdHJpeFtjYXBdID09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIH0gZWxzZSBpZiAoam9iUHJvZmlsZS5jYXBhYmlsaXR5X21hdHJpeFtjYXBdID09IGNhbmRpZGF0ZS5jYXBhYmlsaXR5X21hdHJpeFtjYXBdKSB7XHJcbiAgICAgICAgICAgIGNhbmRpZGF0ZV9jYXJkX3ZpZXcuZXhhY3RfbWF0Y2hpbmcgKz0gMTtcclxuICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgfSBlbHNlIGlmIChqb2JQcm9maWxlLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0gPT0gKE51bWJlcihjYW5kaWRhdGUuY2FwYWJpbGl0eV9tYXRyaXhbY2FwXSkgLSBDb25zdFZhcmlhYmxlcy5ESUZGRVJFTkNFX0lOX0NPTVBMRVhJVFlfU0NFTkFSSU8pKSB7XHJcbiAgICAgICAgICBjYW5kaWRhdGVfY2FyZF92aWV3LmFib3ZlX29uZV9zdGVwX21hdGNoaW5nICs9IDE7XHJcbiAgICAgICAgICBjb3VudCsrO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoam9iUHJvZmlsZS5jYXBhYmlsaXR5X21hdHJpeFtjYXBdID09IChOdW1iZXIoY2FuZGlkYXRlLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0pICsgQ29uc3RWYXJpYWJsZXMuRElGRkVSRU5DRV9JTl9DT01QTEVYSVRZX1NDRU5BUklPKSkge1xyXG4gICAgICAgICAgY2FuZGlkYXRlX2NhcmRfdmlldy5iZWxvd19vbmVfc3RlcF9tYXRjaGluZyArPSAxO1xyXG4gICAgICAgICAgY291bnQrKztcclxuICAgICAgICB9ICBlbHNlIHtcclxuICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGZvcihsZXQgY2FwIGluIGpvYlByb2ZpbGUuY2FwYWJpbGl0eV9tYXRyaXgpIHtcclxuICAgICAgICBpZiAoam9iUHJvZmlsZS5jb21wbGV4aXR5X211c3RoYXZlX21hdHJpeCA9PSAtMSB8fCBqb2JQcm9maWxlLmNvbXBsZXhpdHlfbXVzdGhhdmVfbWF0cml4ID09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgY2FuZGlkYXRlX2NhcmRfdmlldy5jb21wbGV4aXR5SXNNdXN0SGF2ZSA9IGZhbHNlO1xyXG4gICAgICAgIH0gZWxzZSBpZihqb2JQcm9maWxlLmNvbXBsZXhpdHlfbXVzdGhhdmVfbWF0cml4W2NhcF0pIHtcclxuICAgICAgICAgIGlmKGpvYlByb2ZpbGUuY2FwYWJpbGl0eV9tYXRyaXhbY2FwXSA9PSBjYW5kaWRhdGUuY2FwYWJpbGl0eV9tYXRyaXhbY2FwXSkge1xyXG4gICAgICAgICAgICBjYW5kaWRhdGVfY2FyZF92aWV3LmNvbXBsZXhpdHlJc011c3RIYXZlID0gam9iUHJvZmlsZS5jb21wbGV4aXR5X211c3RoYXZlX21hdHJpeFtjYXBdO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY2FuZGlkYXRlX2NhcmRfdmlldy5jb21wbGV4aXR5SXNNdXN0SGF2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBjYW5kaWRhdGVfY2FyZF92aWV3LmFib3ZlX29uZV9zdGVwX21hdGNoaW5nID0gKGNhbmRpZGF0ZV9jYXJkX3ZpZXcuYWJvdmVfb25lX3N0ZXBfbWF0Y2hpbmcgLyBjb3VudCkgKiAxMDA7XHJcbiAgICAgIGNhbmRpZGF0ZV9jYXJkX3ZpZXcuYmVsb3dfb25lX3N0ZXBfbWF0Y2hpbmcgPSAoY2FuZGlkYXRlX2NhcmRfdmlldy5iZWxvd19vbmVfc3RlcF9tYXRjaGluZyAvIGNvdW50KSAqIDEwMDtcclxuICAgICAgY2FuZGlkYXRlX2NhcmRfdmlldy5leGFjdF9tYXRjaGluZyA9IChjYW5kaWRhdGVfY2FyZF92aWV3LmV4YWN0X21hdGNoaW5nIC8gY291bnQpICogMTAwO1xyXG4gICAgICBjYW5kaWRhdGVfY2FyZF92aWV3Lm1hdGNoaW5nID0gY2FuZGlkYXRlX2NhcmRfdmlldy5hYm92ZV9vbmVfc3RlcF9tYXRjaGluZyArIGNhbmRpZGF0ZV9jYXJkX3ZpZXcuYmVsb3dfb25lX3N0ZXBfbWF0Y2hpbmcgKyBjYW5kaWRhdGVfY2FyZF92aWV3LmV4YWN0X21hdGNoaW5nO1xyXG4gICAgICBjYW5kaWRhdGVfY2FyZF92aWV3LnNhbGFyeSA9IGNhbmRpZGF0ZS5wcm9mZXNzaW9uYWxEZXRhaWxzLmN1cnJlbnRTYWxhcnk7XHJcbiAgICAgIGNhbmRpZGF0ZV9jYXJkX3ZpZXcuZXhwZXJpZW5jZSA9IGNhbmRpZGF0ZS5wcm9mZXNzaW9uYWxEZXRhaWxzLmV4cGVyaWVuY2U7XHJcbiAgICAgIGNhbmRpZGF0ZV9jYXJkX3ZpZXcuZWR1Y2F0aW9uID0gY2FuZGlkYXRlLnByb2Zlc3Npb25hbERldGFpbHMuZWR1Y2F0aW9uO1xyXG4gICAgICBjYW5kaWRhdGVfY2FyZF92aWV3LnByb2ZpY2llbmNpZXMgPSBjYW5kaWRhdGUucHJvZmljaWVuY2llcztcclxuICAgICAgY2FuZGlkYXRlX2NhcmRfdmlldy5pbnRlcmVzdGVkSW5kdXN0cmllcyA9IGNhbmRpZGF0ZS5pbnRlcmVzdGVkSW5kdXN0cmllcztcclxuICAgICAgY2FuZGlkYXRlX2NhcmRfdmlldy5faWQgPSBjYW5kaWRhdGUuX2lkOy8vdG9kbyBzb2x2ZSB0aGUgcHJvYmxlbSBvZiBsb2NhdGlvbiBmcm9tIGZyb250IGVuZFxyXG4gICAgICBjYW5kaWRhdGVfY2FyZF92aWV3LmlzVmlzaWJsZSA9IGNhbmRpZGF0ZS5pc1Zpc2libGU7XHJcbiAgICAgIGlmKGNhbmRpZGF0ZS5sb2NhdGlvbikge1xyXG4gICAgICAgIGNhbmRpZGF0ZV9jYXJkX3ZpZXcubG9jYXRpb24gPSBjYW5kaWRhdGUubG9jYXRpb24uY2l0eTtcclxuICAgICAgfWVsc2Uge1xyXG4gICAgICAgIGNhbmRpZGF0ZV9jYXJkX3ZpZXcubG9jYXRpb24gPSAnUHVuZSc7XHJcbiAgICAgIH1cclxuICAgICAgY2FuZGlkYXRlX2NhcmRfdmlldy5ub3RpY2VQZXJpb2QgPSBjYW5kaWRhdGUucHJvZmVzc2lvbmFsRGV0YWlscy5ub3RpY2VQZXJpb2Q7XHJcbiAgICAgIGlmICgoY2FuZGlkYXRlX2NhcmRfdmlldy5hYm92ZV9vbmVfc3RlcF9tYXRjaGluZyArIGNhbmRpZGF0ZV9jYXJkX3ZpZXcuZXhhY3RfbWF0Y2hpbmcpID49IENvbnN0VmFyaWFibGVzLkxPV0VSX0xJTUlUX0ZPUl9TRUFSQ0hfUkVTVUxUKSB7XHJcbiAgICAgICAgY2FuZGlkYXRlX3FfY2FyZF9tYXBbY2FuZGlkYXRlLnVzZXJJZF09Y2FuZGlkYXRlX2NhcmRfdmlldztcclxuICAgICAgICBpZHNPZlNlbGVjdGVkQ2FuZGlkYXRlcy5wdXNoKGNhbmRpZGF0ZS51c2VySWQpO1xyXG4gICAgICB9XHJcblxyXG4gICAgfVxyXG4gICAgbGV0IGNhbmRpZGF0ZXNfcV9jYXJkc19zZW5kIDogQ2FuZGlkYXRlUUNhcmRbXSA9IG5ldyBBcnJheSgwKTtcclxuICAgIGxldCB1c2VyUmVwb3NpdG9yeTogVXNlclJlcG9zaXRvcnkgPSBuZXcgVXNlclJlcG9zaXRvcnkoKTtcclxuICAgIGNvbnNvbGUudGltZUVuZCgnZ2V0Q2FuZGlkYXRlUUNhcmRGb3JMb29wJyk7XHJcbiAgICB1c2VyUmVwb3NpdG9yeS5yZXRyaWV2ZUJ5TXVsdGlJZHMoaWRzT2ZTZWxlY3RlZENhbmRpZGF0ZXMse30sIChlcnJvcjogYW55LCByZXM6IGFueSkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH1cclxuICAgICAgIGVsc2Uge1xyXG4gICAgICAgIGlmKHJlcy5sZW5ndGg+MCkge1xyXG4gICAgICAgICAgY29uc29sZS50aW1lKCdyZXRyaWV2ZUJ5TXVsdGlJZHMnKTtcclxuICAgICAgICAgIGZvcihsZXQgdXNlciBvZiByZXMpe1xyXG4gICAgICAgICAgICBsZXQgY2FuZGlkYXRlUWNhcmQgOiBDYW5kaWRhdGVRQ2FyZD0gY2FuZGlkYXRlX3FfY2FyZF9tYXBbdXNlci5faWRdO1xyXG4gICAgICAgICAgICBjYW5kaWRhdGVRY2FyZC5lbWFpbD11c2VyLmVtYWlsO1xyXG4gICAgICAgICAgICBjYW5kaWRhdGVRY2FyZC5maXJzdF9uYW1lPXVzZXIuZmlyc3RfbmFtZTtcclxuICAgICAgICAgICAgY2FuZGlkYXRlUWNhcmQubGFzdF9uYW1lPXVzZXIubGFzdF9uYW1lO1xyXG4gICAgICAgICAgICBjYW5kaWRhdGVRY2FyZC5tb2JpbGVfbnVtYmVyPXVzZXIubW9iaWxlX251bWJlcjtcclxuICAgICAgICAgICAgY2FuZGlkYXRlUWNhcmQucGljdHVyZT11c2VyLnBpY3R1cmU7XHJcbiAgICAgICAgICAgIGNhbmRpZGF0ZXNfcV9jYXJkc19zZW5kLnB1c2goY2FuZGlkYXRlUWNhcmQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY2FuZGlkYXRlc19xX2NhcmRzX3NlbmQuc29ydCgoZmlyc3Q6IENhbmRpZGF0ZVFDYXJkLHNlY29uZCA6IENhbmRpZGF0ZVFDYXJkKTpudW1iZXI9PiB7XHJcbiAgICAgICAgICAgIGlmKChmaXJzdC5hYm92ZV9vbmVfc3RlcF9tYXRjaGluZytmaXJzdC5leGFjdF9tYXRjaGluZykgPihzZWNvbmQuYWJvdmVfb25lX3N0ZXBfbWF0Y2hpbmcrc2Vjb25kLmV4YWN0X21hdGNoaW5nKSApe1xyXG4gICAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZigoZmlyc3QuYWJvdmVfb25lX3N0ZXBfbWF0Y2hpbmcrZmlyc3QuZXhhY3RfbWF0Y2hpbmcpIDwgKHNlY29uZC5hYm92ZV9vbmVfc3RlcF9tYXRjaGluZytzZWNvbmQuZXhhY3RfbWF0Y2hpbmcpICkge1xyXG4gICAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBjb25zb2xlLnRpbWVFbmQoJ3JldHJpZXZlQnlNdWx0aUlkcycpO1xyXG4gICAgICAgICAgY2FsbGJhY2sobnVsbCxjYW5kaWRhdGVzX3FfY2FyZHNfc2VuZCk7XHJcbiAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgY2FsbGJhY2sobnVsbCxjYW5kaWRhdGVzX3FfY2FyZHNfc2VuZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcblxyXG4gIH1cclxuXHJcbiAgZ2V0Q29kZXNGcm9taW5kdXN0cnkoaW5kdXN0cnk6IEluZHVzdHJ5TW9kZWwpOiBzdHJpbmdbXSB7XHJcbiAgICBjb25zb2xlLnRpbWUoJ2dldENvZGVzRnJvbWluZHVzdHJ5Jyk7XHJcbiAgICBsZXQgc2VsZWN0ZWRfY29tcGxleGl0eTogc3RyaW5nW10gPSBuZXcgQXJyYXkoMCk7XHJcbiAgICBmb3IgKGxldCByb2xlIG9mIGluZHVzdHJ5LnJvbGVzKSB7XHJcbiAgICAgIGZvciAobGV0IGNhcGFiaWxpdHkgb2Ygcm9sZS5kZWZhdWx0X2NvbXBsZXhpdGllcykge1xyXG4gICAgICAgIGZvciAobGV0IGNvbXBsZXhpdHkgb2YgY2FwYWJpbGl0eS5jb21wbGV4aXRpZXMpIHtcclxuICAgICAgICAgIGZvciAobGV0IHNjZW5hcmlvIG9mIGNvbXBsZXhpdHkuc2NlbmFyaW9zKSB7XHJcbiAgICAgICAgICAgIGlmIChzY2VuYXJpby5pc0NoZWNrZWQpIHtcclxuICAgICAgICAgICAgICBpZiAoc2NlbmFyaW8uY29kZSkge1xyXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRfY29tcGxleGl0eS5wdXNoKHNjZW5hcmlvLmNvZGUpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgZm9yIChsZXQgY2FwYWJpbGl0eSBvZiByb2xlLmNhcGFiaWxpdGllcykge1xyXG4gICAgICAgIGZvciAobGV0IGNvbXBsZXhpdHkgb2YgY2FwYWJpbGl0eS5jb21wbGV4aXRpZXMpIHtcclxuICAgICAgICAgIGZvciAobGV0IHNjZW5hcmlvIG9mIGNvbXBsZXhpdHkuc2NlbmFyaW9zKSB7XHJcbiAgICAgICAgICAgIGlmIChzY2VuYXJpby5pc0NoZWNrZWQpIHtcclxuICAgICAgICAgICAgICBpZiAoc2NlbmFyaW8uY29kZSkge1xyXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRfY29tcGxleGl0eS5wdXNoKHNjZW5hcmlvLmNvZGUpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc29sZS50aW1lKCdnZXRDb2Rlc0Zyb21pbmR1c3RyeScpO1xyXG4gICAgcmV0dXJuIHNlbGVjdGVkX2NvbXBsZXhpdHk7XHJcbiAgfVxyXG5cclxuXHJcbn1cclxuXHJcbk9iamVjdFxyXG4gIC5zZWFsKENhbmRpZGF0ZVJlcG9zaXRvcnkpO1xyXG5cclxuZXhwb3J0ID0gQ2FuZGlkYXRlUmVwb3NpdG9yeTtcclxuIl19
