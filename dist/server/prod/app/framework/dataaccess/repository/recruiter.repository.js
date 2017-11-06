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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L3JlY3J1aXRlci5yZXBvc2l0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsNkRBQWdFO0FBQ2hFLHVEQUEwRDtBQUUxRCw0REFBdUQ7QUFDdkQsZ0VBQTREO0FBRzVEO0lBQWtDLHVDQUEwQjtJQUMxRDtlQUNFLGtCQUFNLGVBQWUsQ0FBQztJQUN4QixDQUFDO0lBRUQsZ0RBQWtCLEdBQWxCLFVBQW1CLFVBQWlCLEVBQUUsU0FBeUIsRUFBRSxhQUF1QixFQUFFLFlBQW9CLEVBQUUsUUFBMkM7UUFDekosSUFBSSxNQUFNLEdBQVksS0FBSyxDQUFDO1FBQzVCLElBQUksVUFBVSxHQUFlLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1QixRQUFRLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQzdCLENBQUM7UUFDRCxHQUFHLENBQUMsQ0FBa0IsVUFBVSxFQUFWLHlCQUFVLEVBQVYsd0JBQVUsRUFBVixJQUFVO1lBQTNCLElBQUksU0FBUyxtQkFBQTtZQUNoQixHQUFHLENBQUMsQ0FBWSxVQUFvQixFQUFwQixLQUFBLFNBQVMsQ0FBQyxVQUFVLEVBQXBCLGNBQW9CLEVBQXBCLElBQW9CO2dCQUEvQixJQUFJLEdBQUcsU0FBQTtnQkFDVixJQUFJLHVCQUF1QixHQUFHLEtBQUssQ0FBQztnQkFDcEMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDbkUsdUJBQXVCLEdBQUcsSUFBSSxDQUFDO2dCQUNqQyxDQUFDO2dCQUNELEVBQUUsQ0FBQyxDQUFFLENBQUMsR0FBRyxDQUFD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Q0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyx1QkFBdUIsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUN0SCxNQUFNLENBQUMsQ0FBQyxDQUFDO29CQUNYLENBQUM7b0JBQ0QsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDWCxDQUFDLENBQUMsQ0FBQztnQkFDSCxRQUFRLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQzdCLENBQUM7U0FDRjtJQUVILENBQUM7SUFHSCwwQkFBQztBQUFELENBNUhBLEFBNEhDLENBNUhpQyxjQUFjLEdBNEgvQztBQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUNqQyxpQkFBUyxtQkFBbUIsQ0FBQyIsImZpbGUiOiJhcHAvZnJhbWV3b3JrL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9yZWNydWl0ZXIucmVwb3NpdG9yeS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWNydWl0ZXJTY2hlbWEgPSByZXF1aXJlKCcuLi9zY2hlbWFzL3JlY3J1aXRlci5zY2hlbWEnKTtcbmltcG9ydCBSZXBvc2l0b3J5QmFzZSA9IHJlcXVpcmUoJy4vYmFzZS9yZXBvc2l0b3J5LmJhc2UnKTtcbmltcG9ydCBJUmVjcnVpdGVyID0gcmVxdWlyZSgnLi4vbW9uZ29vc2UvcmVjcnVpdGVyJyk7XG5pbXBvcnQge0pvYlFDYXJkfSBmcm9tIFwiLi4vLi4vc2VhcmNoL21vZGVsL2pvYi1xLWNhcmRcIjtcbmltcG9ydCB7Q29uc3RWYXJpYWJsZXN9IGZyb20gXCIuLi8uLi9zaGFyZWQvc2hhcmVkY29uc3RhbnRzXCI7XG5pbXBvcnQgQ2FuZGlkYXRlTW9kZWwgPSByZXF1aXJlKCcuLi9tb2RlbC9jYW5kaWRhdGUubW9kZWwnKTtcblxuY2xhc3MgUmVjcnVpdGVyUmVwb3NpdG9yeSBleHRlbmRzIFJlcG9zaXRvcnlCYXNlPElSZWNydWl0ZXI+IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoUmVjcnVpdGVyU2NoZW1hKTtcbiAgfVxuXG4gIGdldEpvYlByb2ZpbGVRQ2FyZChyZWNydWl0ZXJzOiBhbnlbXSwgY2FuZGlkYXRlOiBDYW5kaWRhdGVNb2RlbCwgam9iUHJvZmlsZUlkczogc3RyaW5nW10sIGlzU2VhcmNoVmlldzogc3RyaW5nLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XG4gICAgbGV0IGlzU2VuZDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIGxldCBqb2JzX2NhcmRzOiBKb2JRQ2FyZFtdID0gbmV3IEFycmF5KDApO1xuICAgIGlmIChyZWNydWl0ZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgY2FsbGJhY2sobnVsbCwgam9ic19jYXJkcyk7XG4gICAgfVxuICAgIGZvciAobGV0IHJlY3J1aXRlciBvZiByZWNydWl0ZXJzKSB7XG4gICAgICBmb3IgKGxldCBqb2Igb2YgcmVjcnVpdGVyLnBvc3RlZEpvYnMpIHtcbiAgICAgICAgbGV0IGlzcmVsZXZlbnRJbmR1c3RyeU1hdGNoID0gZmFsc2U7XG4gICAgICAgIGlmIChqb2IucmVsZXZlbnRJbmR1c3RyaWVzLmluZGV4T2YoY2FuZGlkYXRlLmluZHVzdHJ5Lm5hbWUpICE9PSAtMSkge1xuICAgICAgICAgIGlzcmVsZXZlbnRJbmR1c3RyeU1hdGNoID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoICFqb2IuaXNKb2JQb3N0ZWQgfHwgam9iLmlzSm9iUG9zdENsb3NlZFxuICAgICAgICAgIHx8IChjYW5kaWRhdGUuaW5kdXN0cnkuY29kZSAhPT0gam9iLmluZHVzdHJ5LmNvZGUgJiYgIWlzcmVsZXZlbnRJbmR1c3RyeU1hdGNoKVxuICAgICAgICAgIHx8IGpvYi5pc0pvYlBvc3RFeHBpcmVkXG4gICAgICAgICAgfHwgKGpvYi5leHBpcmluZ0RhdGUgPCBuZXcgRGF0ZSgpKSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGxldCBpc1ByZXNlbnQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgZm9yIChsZXQgcHJvZmljaWVuY3kgb2YgY2FuZGlkYXRlLnByb2ZpY2llbmNpZXMpIHtcbiAgICAgICAgICBpZiAoam9iLnByb2ZpY2llbmNpZXMuaW5kZXhPZihwcm9maWNpZW5jeSkgIT09IC0xKSB7XG4gICAgICAgICAgICBpZiAoam9iLmludGVyZXN0ZWRJbmR1c3RyaWVzLmluZGV4T2YoJ05vbmUnKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgaXNQcmVzZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGxldCBpbmR1c3RyeSBvZiBjYW5kaWRhdGUuaW50ZXJlc3RlZEluZHVzdHJpZXMpIHtcbiAgICAgICAgICAgICAgaWYgKGpvYi5pbnRlcmVzdGVkSW5kdXN0cmllcy5pbmRleE9mKGluZHVzdHJ5KSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBpc1ByZXNlbnQgPSB0cnVlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChpc1ByZXNlbnQpIHtcbiAgICAgICAgICBpZiAoam9iUHJvZmlsZUlkcykge1xuICAgICAgICAgICAgaWYgKGpvYlByb2ZpbGVJZHMuaW5kZXhPZihqb2IuX2lkKSA9PSAtMSkge1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IGlzRm91bmQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgICAgIGlmIChpc1NlYXJjaFZpZXcgIT09ICdzZWFyY2hWaWV3Jykge1xuICAgICAgICAgICAgICBmb3IgKGxldCBsaXN0IG9mIGNhbmRpZGF0ZS5qb2JfbGlzdCkge1xuICAgICAgICAgICAgICAgIGlmIChsaXN0Lmlkcy5pbmRleE9mKGpvYi5faWQpICE9IC0xKSB7XG4gICAgICAgICAgICAgICAgICBpc0ZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlzRm91bmQpIHtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGxldCBqb2JfcWNhcmQ6IEpvYlFDYXJkID0gbmV3IEpvYlFDYXJkKCk7XG4gICAgICAgICAgam9iX3FjYXJkLm1hdGNoaW5nID0gMDtcbiAgICAgICAgICBsZXQgY291bnQ6IG51bWJlciA9IDA7XG4gICAgICAgICAgZm9yIChsZXQgY2FwIGluIGpvYi5jYXBhYmlsaXR5X21hdHJpeCkge1xuICAgICAgICAgICAgaWYgKGpvYi5jYXBhYmlsaXR5X21hdHJpeFtjYXBdID09IC0xIHx8IGpvYi5jYXBhYmlsaXR5X21hdHJpeFtjYXBdID09IDAgfHwgam9iLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0gPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGpvYi5jYXBhYmlsaXR5X21hdHJpeFtjYXBdID09IGNhbmRpZGF0ZS5jYXBhYmlsaXR5X21hdHJpeFtjYXBdKSB7XG4gICAgICAgICAgICAgIGpvYl9xY2FyZC5leGFjdF9tYXRjaGluZyArPSAxO1xuICAgICAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChqb2IuY2FwYWJpbGl0eV9tYXRyaXhbY2FwXSA9PSAoTnVtYmVyKGNhbmRpZGF0ZS5jYXBhYmlsaXR5X21hdHJpeFtjYXBdKSAtIENvbnN0VmFyaWFibGVzLkRJRkZFUkVOQ0VfSU5fQ09NUExFWElUWV9TQ0VOQVJJTykpIHtcbiAgICAgICAgICAgICAgam9iX3FjYXJkLmFib3ZlX29uZV9zdGVwX21hdGNoaW5nICs9IDE7XG4gICAgICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGpvYi5jYXBhYmlsaXR5X21hdHJpeFtjYXBdID09IChOdW1iZXIoY2FuZGlkYXRlLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0pICsgQ29uc3RWYXJpYWJsZXMuRElGRkVSRU5DRV9JTl9DT01QTEVYSVRZX1NDRU5BUklPKSkge1xuICAgICAgICAgICAgICBqb2JfcWNhcmQuYmVsb3dfb25lX3N0ZXBfbWF0Y2hpbmcgKz0gMTtcbiAgICAgICAgICAgICAgY291bnQrKztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgam9iX3FjYXJkLmFib3ZlX29uZV9zdGVwX21hdGNoaW5nID0gKGpvYl9xY2FyZC5hYm92ZV9vbmVfc3RlcF9tYXRjaGluZyAvIGNvdW50KSAqIDEwMDtcbiAgICAgICAgICBqb2JfcWNhcmQuYmVsb3dfb25lX3N0ZXBfbWF0Y2hpbmcgPSAoam9iX3FjYXJkLmJlbG93X29uZV9zdGVwX21hdGNoaW5nIC8gY291bnQpICogMTAwO1xuICAgICAgICAgIGpvYl9xY2FyZC5leGFjdF9tYXRjaGluZyA9IChqb2JfcWNhcmQuZXhhY3RfbWF0Y2hpbmcgLyBjb3VudCkgKiAxMDA7XG4gICAgICAgICAgam9iX3FjYXJkLm1hdGNoaW5nID0gam9iX3FjYXJkLmFib3ZlX29uZV9zdGVwX21hdGNoaW5nICsgam9iX3FjYXJkLmJlbG93X29uZV9zdGVwX21hdGNoaW5nICsgam9iX3FjYXJkLmV4YWN0X21hdGNoaW5nO1xuICAgICAgICAgIGpvYl9xY2FyZC5jb21wYW55X25hbWUgPSByZWNydWl0ZXIuY29tcGFueV9uYW1lO1xuICAgICAgICAgIGpvYl9xY2FyZC5jb21wYW55X3NpemUgPSByZWNydWl0ZXIuY29tcGFueV9zaXplO1xuICAgICAgICAgIGpvYl9xY2FyZC5jb21wYW55X2xvZ28gPSByZWNydWl0ZXIuY29tcGFueV9sb2dvO1xuICAgICAgICAgIGpvYl9xY2FyZC5jb21wYW55X3dlYnNpdGUgPSByZWNydWl0ZXIuY29tcGFueV93ZWJzaXRlO1xuICAgICAgICAgIGpvYl9xY2FyZC5zYWxhcnlNaW5WYWx1ZSA9IGpvYi5zYWxhcnlNaW5WYWx1ZTtcbiAgICAgICAgICBqb2JfcWNhcmQuc2FsYXJ5TWF4VmFsdWUgPSBqb2Iuc2FsYXJ5TWF4VmFsdWU7XG4gICAgICAgICAgam9iX3FjYXJkLmV4cGVyaWVuY2VNaW5WYWx1ZSA9IGpvYi5leHBlcmllbmNlTWluVmFsdWU7XG4gICAgICAgICAgam9iX3FjYXJkLmV4cGVyaWVuY2VNYXhWYWx1ZSA9IGpvYi5leHBlcmllbmNlTWF4VmFsdWU7XG4gICAgICAgICAgam9iX3FjYXJkLmVkdWNhdGlvbiA9IGpvYi5lZHVjYXRpb247XG4gICAgICAgICAgam9iX3FjYXJkLmludGVyZXN0ZWRJbmR1c3RyaWVzID0gam9iLmludGVyZXN0ZWRJbmR1c3RyaWVzO1xuICAgICAgICAgIGpvYl9xY2FyZC5wcm9maWNpZW5jaWVzID0gam9iLnByb2ZpY2llbmNpZXM7XG4gICAgICAgICAgam9iX3FjYXJkLmxvY2F0aW9uID0gam9iLmxvY2F0aW9uLmNpdHk7XG4gICAgICAgICAgam9iX3FjYXJkLl9pZCA9IGpvYi5faWQ7XG4gICAgICAgICAgam9iX3FjYXJkLmluZHVzdHJ5ID0gam9iLmluZHVzdHJ5Lm5hbWU7IC8vdG9kbyBhZGQgaW5kdXN0cnkgbmFtZVxuICAgICAgICAgIGpvYl9xY2FyZC5qb2JUaXRsZSA9IGpvYi5qb2JUaXRsZTtcbiAgICAgICAgICBqb2JfcWNhcmQuam9pbmluZ1BlcmlvZCA9IGpvYi5qb2luaW5nUGVyaW9kO1xuICAgICAgICAgIGpvYl9xY2FyZC5wb3N0aW5nRGF0ZSA9IGpvYi5wb3N0aW5nRGF0ZTtcbiAgICAgICAgICBqb2JfcWNhcmQuaGlkZUNvbXBhbnlOYW1lID0gam9iLmhpZGVDb21wYW55TmFtZTtcbiAgICAgICAgICBqb2JfcWNhcmQuY2FuZGlkYXRlX2xpc3QgPSBqb2IuY2FuZGlkYXRlX2xpc3Q7XG4gICAgICAgICAgam9iX3FjYXJkLmlzSm9iUG9zdENsb3NlZCA9IGpvYi5pc0pvYlBvc3RDbG9zZWQ7XG5cblxuICAgICAgICAgIGlmICgoam9iX3FjYXJkLmFib3ZlX29uZV9zdGVwX21hdGNoaW5nICsgam9iX3FjYXJkLmV4YWN0X21hdGNoaW5nKSA+PSBDb25zdFZhcmlhYmxlcy5MT1dFUl9MSU1JVF9GT1JfU0VBUkNIX1JFU1VMVCkge1xuICAgICAgICAgICAgam9ic19jYXJkcy5wdXNoKGpvYl9xY2FyZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAocmVjcnVpdGVycy5pbmRleE9mKHJlY3J1aXRlcikgPT0gcmVjcnVpdGVycy5sZW5ndGggLSAxKSB7XG4gICAgICAgIGlzU2VuZCA9IHRydWU7XG4gICAgICAgIGpvYnNfY2FyZHMuc29ydCgoZmlyc3Q6IEpvYlFDYXJkLCBzZWNvbmQ6IEpvYlFDYXJkKTogbnVtYmVyID0+IHtcbiAgICAgICAgICBpZiAoKGZpcnN0LmFib3ZlX29uZV9zdGVwX21hdGNoaW5nICsgZmlyc3QuZXhhY3RfbWF0Y2hpbmcpID4gKHNlY29uZC5hYm92ZV9vbmVfc3RlcF9tYXRjaGluZyArIHNlY29uZC5leGFjdF9tYXRjaGluZykpIHtcbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKChmaXJzdC5hYm92ZV9vbmVfc3RlcF9tYXRjaGluZyArIGZpcnN0LmV4YWN0X21hdGNoaW5nKSA8IChzZWNvbmQuYWJvdmVfb25lX3N0ZXBfbWF0Y2hpbmcgKyBzZWNvbmQuZXhhY3RfbWF0Y2hpbmcpKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH0pO1xuICAgICAgICBjYWxsYmFjayhudWxsLCBqb2JzX2NhcmRzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgfVxuXG5cbn1cblxuT2JqZWN0LnNlYWwoUmVjcnVpdGVyUmVwb3NpdG9yeSk7XG5leHBvcnQgPSBSZWNydWl0ZXJSZXBvc2l0b3J5O1xuIl19
