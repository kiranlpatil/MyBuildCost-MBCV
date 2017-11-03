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
                var isreleventIndustryMatch = false;
                if (job.releventIndustries.indexOf(candidate.industry.name) !== -1) {
                    isreleventIndustryMatch = true;
                }
                if (!job.isJobPosted || job.isJobPostClosed
                    || (candidate.industry.code !== job.industry.code && !isreleventIndustryMatch)
                    || job.isJobPostExpired
                    || (job.expiringDate < new Date())) {
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
                    job_qcard.isJobPostClosed = job.isJobPostClosed;
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L3JlY3J1aXRlci5yZXBvc2l0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsNkRBQWdFO0FBQ2hFLHVEQUEwRDtBQUUxRCw0REFBdUQ7QUFDdkQsZ0VBQTREO0FBRzVEO0lBQWtDLHVDQUEwQjtJQUMxRDtlQUNFLGtCQUFNLGVBQWUsQ0FBQztJQUN4QixDQUFDO0lBRUQsZ0RBQWtCLEdBQWxCLFVBQW1CLFVBQWlCLEVBQUUsU0FBeUIsRUFBRSxhQUF1QixFQUFFLFlBQW9CLEVBQUUsUUFBMkM7UUFDekosSUFBSSxNQUFNLEdBQVksS0FBSyxDQUFDO1FBQzVCLElBQUksVUFBVSxHQUFlLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1QixRQUFRLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQzdCLENBQUM7UUFDRCxHQUFHLENBQUMsQ0FBa0IsVUFBVSxFQUFWLHlCQUFVLEVBQVYsd0JBQVUsRUFBVixJQUFVO1lBQTNCLElBQUksU0FBUyxtQkFBQTtZQUNoQixHQUFHLENBQUMsQ0FBWSxVQUFvQixFQUFwQixLQUFBLFNBQVMsQ0FBQyxVQUFVLEVBQXBCLGNBQW9CLEVBQXBCLElBQW9CO2dCQUEvQixJQUFJLEdBQUcsU0FBQTtnQkFDVixJQUFJLHVCQUF1QixHQUFHLEtBQUssQ0FBQztnQkFDcEMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDbkUsdUJBQXVCLEdBQUcsSUFBSSxDQUFDO2dCQUNqQyxDQUFDO2dCQUNELEVBQUUsQ0FBQyxDQUFFLENBQUMsR0FBRyxDQUFD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Q0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyx1QkFBdUIsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUN0SCxNQUFNLENBQUMsQ0FBQyxDQUFDO29CQUNYLENBQUM7b0JBQ0QsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDWCxDQUFDLENBQUMsQ0FBQztnQkFDSCxRQUFRLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQzdCLENBQUM7U0FDRjtJQUVILENBQUM7SUFHSCwwQkFBQztBQUFELENBNUhBLEFBNEhDLENBNUhpQyxjQUFjLEdBNEgvQztBQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUNqQyxpQkFBUyxtQkFBbUIsQ0FBQyIsImZpbGUiOiJhcHAvZnJhbWV3b3JrL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9yZWNydWl0ZXIucmVwb3NpdG9yeS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWNydWl0ZXJTY2hlbWEgPSByZXF1aXJlKCcuLi9zY2hlbWFzL3JlY3J1aXRlci5zY2hlbWEnKTtcclxuaW1wb3J0IFJlcG9zaXRvcnlCYXNlID0gcmVxdWlyZSgnLi9iYXNlL3JlcG9zaXRvcnkuYmFzZScpO1xyXG5pbXBvcnQgSVJlY3J1aXRlciA9IHJlcXVpcmUoJy4uL21vbmdvb3NlL3JlY3J1aXRlcicpO1xyXG5pbXBvcnQge0pvYlFDYXJkfSBmcm9tIFwiLi4vLi4vc2VhcmNoL21vZGVsL2pvYi1xLWNhcmRcIjtcclxuaW1wb3J0IHtDb25zdFZhcmlhYmxlc30gZnJvbSBcIi4uLy4uL3NoYXJlZC9zaGFyZWRjb25zdGFudHNcIjtcclxuaW1wb3J0IENhbmRpZGF0ZU1vZGVsID0gcmVxdWlyZSgnLi4vbW9kZWwvY2FuZGlkYXRlLm1vZGVsJyk7XHJcblxyXG5jbGFzcyBSZWNydWl0ZXJSZXBvc2l0b3J5IGV4dGVuZHMgUmVwb3NpdG9yeUJhc2U8SVJlY3J1aXRlcj4ge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgc3VwZXIoUmVjcnVpdGVyU2NoZW1hKTtcclxuICB9XHJcblxyXG4gIGdldEpvYlByb2ZpbGVRQ2FyZChyZWNydWl0ZXJzOiBhbnlbXSwgY2FuZGlkYXRlOiBDYW5kaWRhdGVNb2RlbCwgam9iUHJvZmlsZUlkczogc3RyaW5nW10sIGlzU2VhcmNoVmlldzogc3RyaW5nLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBsZXQgaXNTZW5kOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBsZXQgam9ic19jYXJkczogSm9iUUNhcmRbXSA9IG5ldyBBcnJheSgwKTtcclxuICAgIGlmIChyZWNydWl0ZXJzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICBjYWxsYmFjayhudWxsLCBqb2JzX2NhcmRzKTtcclxuICAgIH1cclxuICAgIGZvciAobGV0IHJlY3J1aXRlciBvZiByZWNydWl0ZXJzKSB7XHJcbiAgICAgIGZvciAobGV0IGpvYiBvZiByZWNydWl0ZXIucG9zdGVkSm9icykge1xyXG4gICAgICAgIGxldCBpc3JlbGV2ZW50SW5kdXN0cnlNYXRjaCA9IGZhbHNlO1xyXG4gICAgICAgIGlmIChqb2IucmVsZXZlbnRJbmR1c3RyaWVzLmluZGV4T2YoY2FuZGlkYXRlLmluZHVzdHJ5Lm5hbWUpICE9PSAtMSkge1xyXG4gICAgICAgICAgaXNyZWxldmVudEluZHVzdHJ5TWF0Y2ggPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoICFqb2IuaXNKb2JQb3N0ZWQgfHwgam9iLmlzSm9iUG9zdENsb3NlZFxyXG4gICAgICAgICAgfHwgKGNhbmRpZGF0ZS5pbmR1c3RyeS5jb2RlICE9PSBqb2IuaW5kdXN0cnkuY29kZSAmJiAhaXNyZWxldmVudEluZHVzdHJ5TWF0Y2gpXHJcbiAgICAgICAgICB8fCBqb2IuaXNKb2JQb3N0RXhwaXJlZFxyXG4gICAgICAgICAgfHwgKGpvYi5leHBpcmluZ0RhdGUgPCBuZXcgRGF0ZSgpKSkge1xyXG4gICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBpc1ByZXNlbnQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICBmb3IgKGxldCBwcm9maWNpZW5jeSBvZiBjYW5kaWRhdGUucHJvZmljaWVuY2llcykge1xyXG4gICAgICAgICAgaWYgKGpvYi5wcm9maWNpZW5jaWVzLmluZGV4T2YocHJvZmljaWVuY3kpICE9PSAtMSkge1xyXG4gICAgICAgICAgICBpZiAoam9iLmludGVyZXN0ZWRJbmR1c3RyaWVzLmluZGV4T2YoJ05vbmUnKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICBpc1ByZXNlbnQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAobGV0IGluZHVzdHJ5IG9mIGNhbmRpZGF0ZS5pbnRlcmVzdGVkSW5kdXN0cmllcykge1xyXG4gICAgICAgICAgICAgIGlmIChqb2IuaW50ZXJlc3RlZEluZHVzdHJpZXMuaW5kZXhPZihpbmR1c3RyeSkgIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBpc1ByZXNlbnQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaXNQcmVzZW50KSB7XHJcbiAgICAgICAgICBpZiAoam9iUHJvZmlsZUlkcykge1xyXG4gICAgICAgICAgICBpZiAoam9iUHJvZmlsZUlkcy5pbmRleE9mKGpvYi5faWQpID09IC0xKSB7XHJcbiAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBpc0ZvdW5kOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGlmIChpc1NlYXJjaFZpZXcgIT09ICdzZWFyY2hWaWV3Jykge1xyXG4gICAgICAgICAgICAgIGZvciAobGV0IGxpc3Qgb2YgY2FuZGlkYXRlLmpvYl9saXN0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobGlzdC5pZHMuaW5kZXhPZihqb2IuX2lkKSAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICBpc0ZvdW5kID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChpc0ZvdW5kKSB7XHJcbiAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGxldCBqb2JfcWNhcmQ6IEpvYlFDYXJkID0gbmV3IEpvYlFDYXJkKCk7XHJcbiAgICAgICAgICBqb2JfcWNhcmQubWF0Y2hpbmcgPSAwO1xyXG4gICAgICAgICAgbGV0IGNvdW50OiBudW1iZXIgPSAwO1xyXG4gICAgICAgICAgZm9yIChsZXQgY2FwIGluIGpvYi5jYXBhYmlsaXR5X21hdHJpeCkge1xyXG4gICAgICAgICAgICBpZiAoam9iLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0gPT0gLTEgfHwgam9iLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0gPT0gMCB8fCBqb2IuY2FwYWJpbGl0eV9tYXRyaXhbY2FwXSA9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChqb2IuY2FwYWJpbGl0eV9tYXRyaXhbY2FwXSA9PSBjYW5kaWRhdGUuY2FwYWJpbGl0eV9tYXRyaXhbY2FwXSkge1xyXG4gICAgICAgICAgICAgIGpvYl9xY2FyZC5leGFjdF9tYXRjaGluZyArPSAxO1xyXG4gICAgICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoam9iLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0gPT0gKE51bWJlcihjYW5kaWRhdGUuY2FwYWJpbGl0eV9tYXRyaXhbY2FwXSkgLSBDb25zdFZhcmlhYmxlcy5ESUZGRVJFTkNFX0lOX0NPTVBMRVhJVFlfU0NFTkFSSU8pKSB7XHJcbiAgICAgICAgICAgICAgam9iX3FjYXJkLmFib3ZlX29uZV9zdGVwX21hdGNoaW5nICs9IDE7XHJcbiAgICAgICAgICAgICAgY291bnQrKztcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChqb2IuY2FwYWJpbGl0eV9tYXRyaXhbY2FwXSA9PSAoTnVtYmVyKGNhbmRpZGF0ZS5jYXBhYmlsaXR5X21hdHJpeFtjYXBdKSArIENvbnN0VmFyaWFibGVzLkRJRkZFUkVOQ0VfSU5fQ09NUExFWElUWV9TQ0VOQVJJTykpIHtcclxuICAgICAgICAgICAgICBqb2JfcWNhcmQuYmVsb3dfb25lX3N0ZXBfbWF0Y2hpbmcgKz0gMTtcclxuICAgICAgICAgICAgICBjb3VudCsrO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBqb2JfcWNhcmQuYWJvdmVfb25lX3N0ZXBfbWF0Y2hpbmcgPSAoam9iX3FjYXJkLmFib3ZlX29uZV9zdGVwX21hdGNoaW5nIC8gY291bnQpICogMTAwO1xyXG4gICAgICAgICAgam9iX3FjYXJkLmJlbG93X29uZV9zdGVwX21hdGNoaW5nID0gKGpvYl9xY2FyZC5iZWxvd19vbmVfc3RlcF9tYXRjaGluZyAvIGNvdW50KSAqIDEwMDtcclxuICAgICAgICAgIGpvYl9xY2FyZC5leGFjdF9tYXRjaGluZyA9IChqb2JfcWNhcmQuZXhhY3RfbWF0Y2hpbmcgLyBjb3VudCkgKiAxMDA7XHJcbiAgICAgICAgICBqb2JfcWNhcmQubWF0Y2hpbmcgPSBqb2JfcWNhcmQuYWJvdmVfb25lX3N0ZXBfbWF0Y2hpbmcgKyBqb2JfcWNhcmQuYmVsb3dfb25lX3N0ZXBfbWF0Y2hpbmcgKyBqb2JfcWNhcmQuZXhhY3RfbWF0Y2hpbmc7XHJcbiAgICAgICAgICBqb2JfcWNhcmQuY29tcGFueV9uYW1lID0gcmVjcnVpdGVyLmNvbXBhbnlfbmFtZTtcclxuICAgICAgICAgIGpvYl9xY2FyZC5jb21wYW55X3NpemUgPSByZWNydWl0ZXIuY29tcGFueV9zaXplO1xyXG4gICAgICAgICAgam9iX3FjYXJkLmNvbXBhbnlfbG9nbyA9IHJlY3J1aXRlci5jb21wYW55X2xvZ287XHJcbiAgICAgICAgICBqb2JfcWNhcmQuY29tcGFueV93ZWJzaXRlID0gcmVjcnVpdGVyLmNvbXBhbnlfd2Vic2l0ZTtcclxuICAgICAgICAgIGpvYl9xY2FyZC5zYWxhcnlNaW5WYWx1ZSA9IGpvYi5zYWxhcnlNaW5WYWx1ZTtcclxuICAgICAgICAgIGpvYl9xY2FyZC5zYWxhcnlNYXhWYWx1ZSA9IGpvYi5zYWxhcnlNYXhWYWx1ZTtcclxuICAgICAgICAgIGpvYl9xY2FyZC5leHBlcmllbmNlTWluVmFsdWUgPSBqb2IuZXhwZXJpZW5jZU1pblZhbHVlO1xyXG4gICAgICAgICAgam9iX3FjYXJkLmV4cGVyaWVuY2VNYXhWYWx1ZSA9IGpvYi5leHBlcmllbmNlTWF4VmFsdWU7XHJcbiAgICAgICAgICBqb2JfcWNhcmQuZWR1Y2F0aW9uID0gam9iLmVkdWNhdGlvbjtcclxuICAgICAgICAgIGpvYl9xY2FyZC5pbnRlcmVzdGVkSW5kdXN0cmllcyA9IGpvYi5pbnRlcmVzdGVkSW5kdXN0cmllcztcclxuICAgICAgICAgIGpvYl9xY2FyZC5wcm9maWNpZW5jaWVzID0gam9iLnByb2ZpY2llbmNpZXM7XHJcbiAgICAgICAgICBqb2JfcWNhcmQubG9jYXRpb24gPSBqb2IubG9jYXRpb24uY2l0eTtcclxuICAgICAgICAgIGpvYl9xY2FyZC5faWQgPSBqb2IuX2lkO1xyXG4gICAgICAgICAgam9iX3FjYXJkLmluZHVzdHJ5ID0gam9iLmluZHVzdHJ5Lm5hbWU7IC8vdG9kbyBhZGQgaW5kdXN0cnkgbmFtZVxyXG4gICAgICAgICAgam9iX3FjYXJkLmpvYlRpdGxlID0gam9iLmpvYlRpdGxlO1xyXG4gICAgICAgICAgam9iX3FjYXJkLmpvaW5pbmdQZXJpb2QgPSBqb2Iuam9pbmluZ1BlcmlvZDtcclxuICAgICAgICAgIGpvYl9xY2FyZC5wb3N0aW5nRGF0ZSA9IGpvYi5wb3N0aW5nRGF0ZTtcclxuICAgICAgICAgIGpvYl9xY2FyZC5oaWRlQ29tcGFueU5hbWUgPSBqb2IuaGlkZUNvbXBhbnlOYW1lO1xyXG4gICAgICAgICAgam9iX3FjYXJkLmNhbmRpZGF0ZV9saXN0ID0gam9iLmNhbmRpZGF0ZV9saXN0O1xyXG4gICAgICAgICAgam9iX3FjYXJkLmlzSm9iUG9zdENsb3NlZCA9IGpvYi5pc0pvYlBvc3RDbG9zZWQ7XHJcblxyXG5cclxuICAgICAgICAgIGlmICgoam9iX3FjYXJkLmFib3ZlX29uZV9zdGVwX21hdGNoaW5nICsgam9iX3FjYXJkLmV4YWN0X21hdGNoaW5nKSA+PSBDb25zdFZhcmlhYmxlcy5MT1dFUl9MSU1JVF9GT1JfU0VBUkNIX1JFU1VMVCkge1xyXG4gICAgICAgICAgICBqb2JzX2NhcmRzLnB1c2goam9iX3FjYXJkKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHJlY3J1aXRlcnMuaW5kZXhPZihyZWNydWl0ZXIpID09IHJlY3J1aXRlcnMubGVuZ3RoIC0gMSkge1xyXG4gICAgICAgIGlzU2VuZCA9IHRydWU7XHJcbiAgICAgICAgam9ic19jYXJkcy5zb3J0KChmaXJzdDogSm9iUUNhcmQsIHNlY29uZDogSm9iUUNhcmQpOiBudW1iZXIgPT4ge1xyXG4gICAgICAgICAgaWYgKChmaXJzdC5hYm92ZV9vbmVfc3RlcF9tYXRjaGluZyArIGZpcnN0LmV4YWN0X21hdGNoaW5nKSA+IChzZWNvbmQuYWJvdmVfb25lX3N0ZXBfbWF0Y2hpbmcgKyBzZWNvbmQuZXhhY3RfbWF0Y2hpbmcpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmICgoZmlyc3QuYWJvdmVfb25lX3N0ZXBfbWF0Y2hpbmcgKyBmaXJzdC5leGFjdF9tYXRjaGluZykgPCAoc2Vjb25kLmFib3ZlX29uZV9zdGVwX21hdGNoaW5nICsgc2Vjb25kLmV4YWN0X21hdGNoaW5nKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIGpvYnNfY2FyZHMpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcblxyXG59XHJcblxyXG5PYmplY3Quc2VhbChSZWNydWl0ZXJSZXBvc2l0b3J5KTtcclxuZXhwb3J0ID0gUmVjcnVpdGVyUmVwb3NpdG9yeTtcclxuIl19
