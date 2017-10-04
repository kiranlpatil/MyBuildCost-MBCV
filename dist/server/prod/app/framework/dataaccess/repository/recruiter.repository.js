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
var RecruiterSchema = require("../schemas/recruiter.schema");
var RepositoryBase = require("./base/repository.base");
var job_q_card_1 = require("../../search/model/job-q-card");
var sharedconstants_1 = require("../../shared/sharedconstants");
var RecruiterRepository = (function (_super) {
    __extends(RecruiterRepository, _super);
    function RecruiterRepository() {
        return _super.call(this, RecruiterSchema) || this;
    }
    RecruiterRepository.prototype.getJobProfileQCard = function (recruiters, candidate, jobProfileIds, isSearchView, callback) {
        var isSend = false;
        var jobs_cards = new Array(0);
        if (recruiters.length === 0) {
            callback(null, jobs_cards);
        }
        for (var _i = 0, recruiters_1 = recruiters; _i < recruiters_1.length; _i++) {
            var recruiter = recruiters_1[_i];
            for (var _a = 0, _b = recruiter.postedJobs; _a < _b.length; _a++) {
                var job = _b[_a];
                if (!job.isJobPosted) {
                    continue;
                }
                var isPresent = false;
                for (var _c = 0, _d = candidate.proficiencies; _c < _d.length; _c++) {
                    var proficiency = _d[_c];
                    if (job.proficiencies.indexOf(proficiency) !== -1) {
                        if (job.interestedIndustries.indexOf('None') !== -1) {
                            isPresent = true;
                            break;
                        }
                        for (var _e = 0, _f = candidate.interestedIndustries; _e < _f.length; _e++) {
                            var industry = _f[_e];
                            if (job.interestedIndustries.indexOf(industry) !== -1) {
                                isPresent = true;
                            }
                        }
                    }
                }
                if (isPresent) {
                    if (jobProfileIds) {
                        if (jobProfileIds.indexOf(job._id) == -1) {
                            continue;
                        }
                    }
                    else {
                        var isFound = false;
                        if (isSearchView !== 'searchView') {
                            for (var _g = 0, _h = candidate.job_list; _g < _h.length; _g++) {
                                var list = _h[_g];
                                if (list.ids.indexOf(job._id) != -1) {
                                    isFound = true;
                                    break;
                                }
                            }
                        }
                        if (isFound) {
                            continue;
                        }
                    }
                    var job_qcard = new job_q_card_1.JobQCard();
                    job_qcard.matching = 0;
                    var count = 0;
                    for (var cap in job.capability_matrix) {
                        if (job.capability_matrix[cap] == -1 || job.capability_matrix[cap] == 0 || job.capability_matrix[cap] == undefined) {
                        }
                        else if (job.capability_matrix[cap] == candidate.capability_matrix[cap]) {
                            job_qcard.exact_matching += 1;
                            count++;
                        }
                        else if (job.capability_matrix[cap] == (Number(candidate.capability_matrix[cap]) - sharedconstants_1.ConstVariables.DIFFERENCE_IN_COMPLEXITY_SCENARIO)) {
                            job_qcard.above_one_step_matching += 1;
                            count++;
                        }
                        else if (job.capability_matrix[cap] == (Number(candidate.capability_matrix[cap]) + sharedconstants_1.ConstVariables.DIFFERENCE_IN_COMPLEXITY_SCENARIO)) {
                            job_qcard.below_one_step_matching += 1;
                            count++;
                        }
                        else {
                            count++;
                        }
                    }
                    job_qcard.above_one_step_matching = (job_qcard.above_one_step_matching / count) * 100;
                    job_qcard.below_one_step_matching = (job_qcard.below_one_step_matching / count) * 100;
                    job_qcard.exact_matching = (job_qcard.exact_matching / count) * 100;
                    job_qcard.matching = job_qcard.above_one_step_matching + job_qcard.below_one_step_matching + job_qcard.exact_matching;
                    job_qcard.company_name = recruiter.company_name;
                    job_qcard.company_size = recruiter.company_size;
                    job_qcard.company_logo = recruiter.company_logo;
                    job_qcard.company_website = recruiter.company_website;
                    job_qcard.salaryMinValue = job.salaryMinValue;
                    job_qcard.salaryMaxValue = job.salaryMaxValue;
                    job_qcard.experienceMinValue = job.experienceMinValue;
                    job_qcard.experienceMaxValue = job.experienceMaxValue;
                    job_qcard.education = job.education;
                    job_qcard.interestedIndustries = job.interestedIndustries;
                    job_qcard.proficiencies = job.proficiencies;
                    job_qcard.location = job.location.city;
                    job_qcard._id = job._id;
                    job_qcard.industry = job.industry.name;
                    job_qcard.jobTitle = job.jobTitle;
                    job_qcard.joiningPeriod = job.joiningPeriod;
                    job_qcard.postingDate = job.postingDate;
                    job_qcard.hideCompanyName = job.hideCompanyName;
                    job_qcard.candidate_list = job.candidate_list;
                    if ((job_qcard.above_one_step_matching + job_qcard.exact_matching) >= sharedconstants_1.ConstVariables.LOWER_LIMIT_FOR_SEARCH_RESULT) {
                        jobs_cards.push(job_qcard);
                    }
                }
            }
            if (recruiters.indexOf(recruiter) == recruiters.length - 1) {
                isSend = true;
                jobs_cards.sort(function (first, second) {
                    if ((first.above_one_step_matching + first.exact_matching) > (second.above_one_step_matching + second.exact_matching)) {
                        return -1;
                    }
                    if ((first.above_one_step_matching + first.exact_matching) < (second.above_one_step_matching + second.exact_matching)) {
                        return 1;
                    }
                    return 0;
                });
                callback(null, jobs_cards);
            }
        }
    };
    return RecruiterRepository;
}(RepositoryBase));
Object.seal(RecruiterRepository);
module.exports = RecruiterRepository;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L3JlY3J1aXRlci5yZXBvc2l0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsNkRBQWdFO0FBQ2hFLHVEQUEwRDtBQUUxRCw0REFBdUQ7QUFDdkQsZ0VBQTREO0FBRzVEO0lBQWtDLHVDQUEwQjtJQUMxRDtlQUNFLGtCQUFNLGVBQWUsQ0FBQztJQUN4QixDQUFDO0lBRUQsZ0RBQWtCLEdBQWxCLFVBQW1CLFVBQWdCLEVBQUUsU0FBd0IsRUFBRSxhQUFzQixFQUFFLFlBQW1CLEVBQUUsUUFBd0M7UUFDbEosSUFBSSxNQUFNLEdBQWEsS0FBSyxDQUFDO1FBQzdCLElBQUksVUFBVSxHQUFlLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFDLEVBQUUsQ0FBQSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzQixRQUFRLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQzdCLENBQUM7UUFDRCxHQUFHLENBQUMsQ0FBa0IsVUFBVSxFQUFWLHlCQUFVLEVBQVYsd0JBQVUsRUFBVixJQUFVO1lBQTNCLElBQUksU0FBUyxtQkFBQTtZQUNoQixHQUFHLENBQUMsQ0FBWSxVQUFvQixFQUFwQixLQUFBLFNBQVMsQ0FBQyxVQUFVLEVBQXBCLGNBQW9CLEVBQXBCLElBQW9CO2dCQUEvQixJQUFJLEdBQUcsU0FBQTtnQkFDVixFQUFFLENBQUEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO29CQUNwQixRQUFRLENBQUM7Z0JBQ1gsQ0FBQztnQkFDRCxJQUFJLFNBQVMsR0FBWSxLQUFLLENBQUM7Z0JBQy9CLEdBQUcsQ0FBQyxDQUFvQixVQUF1QixFQUF2QixLQUFBLFNBQVMsQ0FBQyxhQUFhLEVBQXZCLGNBQXVCLEVBQXZCLElBQXVCO29CQUExQyxJQUFJLFdBQVcsU0FBQTtvQkFDbEIs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QUFDLENBQUM7d0JBQ25ILFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBQzdCLENBQUM7Z0JBQ0gsQ0FBQzthQUNGO1lBQ0QsRUFBRSxDQUFBLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hELE1BQU0sR0FBRSxJQUFJLENBQUM7Z0JBQ2IsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFDLEtBQWUsRUFBQyxNQUFpQjtvQkFDaEQsRUFBRSxDQUFBLENBQUMsQ0FBQyxLQUFLLENBQUMsdUJBQXVCLEdBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxHQUFFLENBQUMsTUFBTSxDQUFDLHVCQUF1QixHQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUUsQ0FBQyxDQUFBLENBQUM7d0JBQ2hILE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDWixDQUFDO29CQUNELEVBQUUsQ0FBQSxDQUFDLENBQUMsS0FBSyxDQUFDLHVCQUF1QixHQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyx1QkFBdUIsR0FBQyxNQUFNLENBQUMsY0FBYyxDQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUNsSCxNQUFNLENBQUMsQ0FBQyxDQUFDO29CQUNYLENBQUM7b0JBQ0QsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDWCxDQUFDLENBQUMsQ0FBQztnQkFDSCxRQUFRLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQzdCLENBQUM7U0FDSjtJQUVILENBQUM7SUFHSCwwQkFBQztBQUFELENBbEhBLEFBa0hDLENBbEhpQyxjQUFjLEdBa0gvQztBQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUNqQyxpQkFBUyxtQkFBbUIsQ0FBQyIsImZpbGUiOiJhcHAvZnJhbWV3b3JrL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9yZWNydWl0ZXIucmVwb3NpdG9yeS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWNydWl0ZXJTY2hlbWEgPSByZXF1aXJlKCcuLi9zY2hlbWFzL3JlY3J1aXRlci5zY2hlbWEnKTtcclxuaW1wb3J0IFJlcG9zaXRvcnlCYXNlID0gcmVxdWlyZSgnLi9iYXNlL3JlcG9zaXRvcnkuYmFzZScpO1xyXG5pbXBvcnQgSVJlY3J1aXRlciA9IHJlcXVpcmUoJy4uL21vbmdvb3NlL3JlY3J1aXRlcicpO1xyXG5pbXBvcnQge0pvYlFDYXJkfSBmcm9tIFwiLi4vLi4vc2VhcmNoL21vZGVsL2pvYi1xLWNhcmRcIjtcclxuaW1wb3J0IHtDb25zdFZhcmlhYmxlc30gZnJvbSBcIi4uLy4uL3NoYXJlZC9zaGFyZWRjb25zdGFudHNcIjtcclxuaW1wb3J0IENhbmRpZGF0ZU1vZGVsID0gcmVxdWlyZSgnLi4vbW9kZWwvY2FuZGlkYXRlLm1vZGVsJyk7XHJcblxyXG5jbGFzcyBSZWNydWl0ZXJSZXBvc2l0b3J5IGV4dGVuZHMgUmVwb3NpdG9yeUJhc2U8SVJlY3J1aXRlcj4ge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgc3VwZXIoUmVjcnVpdGVyU2NoZW1hKTtcclxuICB9XHJcblxyXG4gIGdldEpvYlByb2ZpbGVRQ2FyZChyZWNydWl0ZXJzOmFueVtdLCBjYW5kaWRhdGU6Q2FuZGlkYXRlTW9kZWwsIGpvYlByb2ZpbGVJZHM6c3RyaW5nW10sIGlzU2VhcmNoVmlldzpzdHJpbmcsIGNhbGxiYWNrOihlcnJvcjphbnksIHJlc3VsdDphbnkpID0+IHZvaWQpIHtcclxuICAgIGxldCBpc1NlbmQgOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBsZXQgam9ic19jYXJkczogSm9iUUNhcmRbXSA9IG5ldyBBcnJheSgwKTtcclxuICAgIGlmKHJlY3J1aXRlcnMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIGNhbGxiYWNrKG51bGwsIGpvYnNfY2FyZHMpO1xyXG4gICAgfVxyXG4gICAgZm9yIChsZXQgcmVjcnVpdGVyIG9mIHJlY3J1aXRlcnMpIHtcclxuICAgICAgZm9yIChsZXQgam9iIG9mIHJlY3J1aXRlci5wb3N0ZWRKb2JzKSB7XHJcbiAgICAgICAgaWYoIWpvYi5pc0pvYlBvc3RlZCkge1xyXG4gICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBpc1ByZXNlbnQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICBmb3IgKGxldCBwcm9maWNpZW5jeSBvZiBjYW5kaWRhdGUucHJvZmljaWVuY2llcykge1xyXG4gICAgICAgICAgaWYgKGpvYi5wcm9maWNpZW5jaWVzLmluZGV4T2YocHJvZmljaWVuY3kpICE9PSAtMSkge1xyXG4gICAgICAgICAgICBpZihqb2IuaW50ZXJlc3RlZEluZHVzdHJpZXMuaW5kZXhPZignTm9uZScpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgIGlzUHJlc2VudCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZm9yIChsZXQgaW5kdXN0cnkgb2YgY2FuZGlkYXRlLmludGVyZXN0ZWRJbmR1c3RyaWVzKSB7XHJcbiAgICAgICAgICAgICAgaWYgKGpvYi5pbnRlcmVzdGVkSW5kdXN0cmllcy5pbmRleE9mKGluZHVzdHJ5KSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIGlzUHJlc2VudCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpc1ByZXNlbnQpIHtcclxuICAgICAgICAgIGlmIChqb2JQcm9maWxlSWRzKSB7XHJcbiAgICAgICAgICAgIGlmIChqb2JQcm9maWxlSWRzLmluZGV4T2Yoam9iLl9pZCkgPT0gLTEpIHtcclxuICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IGlzRm91bmQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICAgICAgaWYgKGlzU2VhcmNoVmlldyAhPT0gJ3NlYXJjaFZpZXcnKSB7XHJcbiAgICAgICAgICAgICAgZm9yIChsZXQgbGlzdCBvZiBjYW5kaWRhdGUuam9iX2xpc3QpIHtcclxuICAgICAgICAgICAgICAgIGlmIChsaXN0Lmlkcy5pbmRleE9mKGpvYi5faWQpICE9IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgIGlzRm91bmQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGlzRm91bmQpIHtcclxuICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgbGV0IGpvYl9xY2FyZDogSm9iUUNhcmQgPSBuZXcgSm9iUUNhcmQoKTtcclxuICAgICAgICAgIGpvYl9xY2FyZC5tYXRjaGluZyA9IDA7XHJcbiAgICAgICAgICBsZXQgY291bnQgOiBudW1iZXIgPSAwO1xyXG4gICAgICAgICAgZm9yIChsZXQgY2FwIGluIGpvYi5jYXBhYmlsaXR5X21hdHJpeCkge1xyXG4gICAgICAgICAgICBpZiAoam9iLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0gPT0gLTEgfHwgam9iLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0gPT0gMCB8fCBqb2IuY2FwYWJpbGl0eV9tYXRyaXhbY2FwXSA9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChqb2IuY2FwYWJpbGl0eV9tYXRyaXhbY2FwXSA9PSBjYW5kaWRhdGUuY2FwYWJpbGl0eV9tYXRyaXhbY2FwXSkge1xyXG4gICAgICAgICAgICAgIGpvYl9xY2FyZC5leGFjdF9tYXRjaGluZyArPSAxO1xyXG4gICAgICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoam9iLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0gPT0gKE51bWJlcihjYW5kaWRhdGUuY2FwYWJpbGl0eV9tYXRyaXhbY2FwXSkgLSBDb25zdFZhcmlhYmxlcy5ESUZGRVJFTkNFX0lOX0NPTVBMRVhJVFlfU0NFTkFSSU8pKSB7XHJcbiAgICAgICAgICAgICAgam9iX3FjYXJkLmFib3ZlX29uZV9zdGVwX21hdGNoaW5nICs9IDE7XHJcbiAgICAgICAgICAgICAgY291bnQrKztcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChqb2IuY2FwYWJpbGl0eV9tYXRyaXhbY2FwXSA9PSAoTnVtYmVyKGNhbmRpZGF0ZS5jYXBhYmlsaXR5X21hdHJpeFtjYXBdKSArIENvbnN0VmFyaWFibGVzLkRJRkZFUkVOQ0VfSU5fQ09NUExFWElUWV9TQ0VOQVJJTykpIHtcclxuICAgICAgICAgICAgICBqb2JfcWNhcmQuYmVsb3dfb25lX3N0ZXBfbWF0Y2hpbmcgKz0gMTtcclxuICAgICAgICAgICAgICBjb3VudCsrO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBqb2JfcWNhcmQuYWJvdmVfb25lX3N0ZXBfbWF0Y2hpbmcgPSAoam9iX3FjYXJkLmFib3ZlX29uZV9zdGVwX21hdGNoaW5nIC8gY291bnQpICogMTAwO1xyXG4gICAgICAgICAgam9iX3FjYXJkLmJlbG93X29uZV9zdGVwX21hdGNoaW5nID0gKGpvYl9xY2FyZC5iZWxvd19vbmVfc3RlcF9tYXRjaGluZyAvIGNvdW50KSAqIDEwMDtcclxuICAgICAgICAgIGpvYl9xY2FyZC5leGFjdF9tYXRjaGluZyA9IChqb2JfcWNhcmQuZXhhY3RfbWF0Y2hpbmcgLyBjb3VudCkgKiAxMDA7XHJcbiAgICAgICAgICBqb2JfcWNhcmQubWF0Y2hpbmcgPSBqb2JfcWNhcmQuYWJvdmVfb25lX3N0ZXBfbWF0Y2hpbmcgKyBqb2JfcWNhcmQuYmVsb3dfb25lX3N0ZXBfbWF0Y2hpbmcgKyBqb2JfcWNhcmQuZXhhY3RfbWF0Y2hpbmc7XHJcbiAgICAgICAgICBqb2JfcWNhcmQuY29tcGFueV9uYW1lID0gcmVjcnVpdGVyLmNvbXBhbnlfbmFtZTtcclxuICAgICAgICAgIGpvYl9xY2FyZC5jb21wYW55X3NpemUgPSByZWNydWl0ZXIuY29tcGFueV9zaXplO1xyXG4gICAgICAgICAgam9iX3FjYXJkLmNvbXBhbnlfbG9nbyA9IHJlY3J1aXRlci5jb21wYW55X2xvZ287XHJcbiAgICAgICAgICBqb2JfcWNhcmQuY29tcGFueV93ZWJzaXRlPSByZWNydWl0ZXIuY29tcGFueV93ZWJzaXRlO1xyXG4gICAgICAgICAgam9iX3FjYXJkLnNhbGFyeU1pblZhbHVlID0gam9iLnNhbGFyeU1pblZhbHVlO1xyXG4gICAgICAgICAgam9iX3FjYXJkLnNhbGFyeU1heFZhbHVlID0gam9iLnNhbGFyeU1heFZhbHVlO1xyXG4gICAgICAgICAgam9iX3FjYXJkLmV4cGVyaWVuY2VNaW5WYWx1ZSA9IGpvYi5leHBlcmllbmNlTWluVmFsdWU7XHJcbiAgICAgICAgICBqb2JfcWNhcmQuZXhwZXJpZW5jZU1heFZhbHVlID0gam9iLmV4cGVyaWVuY2VNYXhWYWx1ZTtcclxuICAgICAgICAgIGpvYl9xY2FyZC5lZHVjYXRpb24gPSBqb2IuZWR1Y2F0aW9uO1xyXG4gICAgICAgICAgam9iX3FjYXJkLmludGVyZXN0ZWRJbmR1c3RyaWVzID0gam9iLmludGVyZXN0ZWRJbmR1c3RyaWVzO1xyXG4gICAgICAgICAgam9iX3FjYXJkLnByb2ZpY2llbmNpZXMgPSBqb2IucHJvZmljaWVuY2llcztcclxuICAgICAgICAgIGpvYl9xY2FyZC5sb2NhdGlvbiA9IGpvYi5sb2NhdGlvbi5jaXR5O1xyXG4gICAgICAgICAgam9iX3FjYXJkLl9pZCA9IGpvYi5faWQ7XHJcbiAgICAgICAgICBqb2JfcWNhcmQuaW5kdXN0cnkgPSBqb2IuaW5kdXN0cnkubmFtZTsgLy90b2RvIGFkZCBpbmR1c3RyeSBuYW1lXHJcbiAgICAgICAgICBqb2JfcWNhcmQuam9iVGl0bGUgPSBqb2Iuam9iVGl0bGU7XHJcbiAgICAgICAgICBqb2JfcWNhcmQuam9pbmluZ1BlcmlvZCA9IGpvYi5qb2luaW5nUGVyaW9kO1xyXG4gICAgICAgICAgam9iX3FjYXJkLnBvc3RpbmdEYXRlID0gam9iLnBvc3RpbmdEYXRlO1xyXG4gICAgICAgICAgam9iX3FjYXJkLmhpZGVDb21wYW55TmFtZSA9IGpvYi5oaWRlQ29tcGFueU5hbWU7XHJcbiAgICAgICAgICBqb2JfcWNhcmQuY2FuZGlkYXRlX2xpc3QgPSBqb2IuY2FuZGlkYXRlX2xpc3Q7XHJcbiAgICAgICAgICBpZiAoKGpvYl9xY2FyZC5hYm92ZV9vbmVfc3RlcF9tYXRjaGluZyArIGpvYl9xY2FyZC5leGFjdF9tYXRjaGluZykgPj0gQ29uc3RWYXJpYWJsZXMuTE9XRVJfTElNSVRfRk9SX1NFQVJDSF9SRVNVTFQpIHtcclxuICAgICAgICAgICAgam9ic19jYXJkcy5wdXNoKGpvYl9xY2FyZCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGlmKHJlY3J1aXRlcnMuaW5kZXhPZihyZWNydWl0ZXIpID09IHJlY3J1aXRlcnMubGVuZ3RoIC0gMSkge1xyXG4gICAgICAgICAgaXNTZW5kPSB0cnVlO1xyXG4gICAgICAgICAgam9ic19jYXJkcy5zb3J0KChmaXJzdDogSm9iUUNhcmQsc2Vjb25kIDogSm9iUUNhcmQpOm51bWJlcj0+IHtcclxuICAgICAgICAgICAgaWYoKGZpcnN0LmFib3ZlX29uZV9zdGVwX21hdGNoaW5nK2ZpcnN0LmV4YWN0X21hdGNoaW5nKSA+KHNlY29uZC5hYm92ZV9vbmVfc3RlcF9tYXRjaGluZytzZWNvbmQuZXhhY3RfbWF0Y2hpbmcpICl7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKChmaXJzdC5hYm92ZV9vbmVfc3RlcF9tYXRjaGluZytmaXJzdC5leGFjdF9tYXRjaGluZykgPCAoc2Vjb25kLmFib3ZlX29uZV9zdGVwX21hdGNoaW5nK3NlY29uZC5leGFjdF9tYXRjaGluZykgKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIGNhbGxiYWNrKG51bGwsIGpvYnNfY2FyZHMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuXHJcbn1cclxuXHJcbk9iamVjdC5zZWFsKFJlY3J1aXRlclJlcG9zaXRvcnkpO1xyXG5leHBvcnQgPSBSZWNydWl0ZXJSZXBvc2l0b3J5O1xyXG4iXX0=
