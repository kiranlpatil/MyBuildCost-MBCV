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
                if (!job.isJobPosted
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L3JlY3J1aXRlci5yZXBvc2l0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsNkRBQWdFO0FBQ2hFLHVEQUEwRDtBQUUxRCw0REFBdUQ7QUFDdkQsZ0VBQTREO0FBRzVEO0lBQWtDLHVDQUEwQjtJQUMxRDtlQUNFLGtCQUFNLGVBQWUsQ0FBQztJQUN4QixDQUFDO0lBRUQsZ0RBQWtCLEdBQWxCLFVBQW1CLFVBQWlCLEVBQUUsU0FBeUIsRUFBRSxhQUF1QixFQUFFLFlBQW9CLEVBQUUsUUFBMkM7UUFDekosSUFBSSxNQUFNLEdBQVksS0FBSyxDQUFDO1FBQzVCLElBQUksVUFBVSxHQUFlLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1QixRQUFRLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQzdCLENBQUM7UUFDRCxHQUFHLENBQUMsQ0FBa0IsVUFBVSxFQUFWLHlCQUFVLEVBQVYsd0JBQVUsRUFBVixJQUFVO1lBQTNCLElBQUksU0FBUyxtQkFBQTtZQUNoQixHQUFHLENBQUMsQ0FBWSxVQUFvQixFQUFwQixLQUFBLFNBQVMsQ0FBQyxVQUFVLEVBQXBCLGNBQW9CLEVBQXBCLElBQW9CO2dCQUEvQixJQUFJLEdBQUcsU0FBQTtnQkFDVixJQUFJLHVCQUF1QixHQUFHLEtBQUssQ0FBQztnQkFDcEMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDbkUsdUJBQXVCLEdBQUcsSUFBSSxDQUFDO2dCQUNqQyxDQUFDO2dCQUNELEVBQUUsQ0FBQyxDQUFFLENBQUMsR0FBRyxDQUFD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Q0FBQyxNQUFNLENBQUMsdUJBQXVCLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDdEgsTUFBTSxDQUFDLENBQUMsQ0FBQztvQkFDWCxDQUFDO29CQUNELE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsQ0FBQyxDQUFDLENBQUM7Z0JBQ0gsUUFBUSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztZQUM3QixDQUFDO1NBQ0Y7SUFFSCxDQUFDO0lBR0gsMEJBQUM7QUFBRCxDQTVIQSxBQTRIQyxDQTVIaUMsY0FBYyxHQTRIL0M7QUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDakMsaUJBQVMsbUJBQW1CLENBQUMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9kYXRhYWNjZXNzL3JlcG9zaXRvcnkvcmVjcnVpdGVyLnJlcG9zaXRvcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVjcnVpdGVyU2NoZW1hID0gcmVxdWlyZSgnLi4vc2NoZW1hcy9yZWNydWl0ZXIuc2NoZW1hJyk7XHJcbmltcG9ydCBSZXBvc2l0b3J5QmFzZSA9IHJlcXVpcmUoJy4vYmFzZS9yZXBvc2l0b3J5LmJhc2UnKTtcclxuaW1wb3J0IElSZWNydWl0ZXIgPSByZXF1aXJlKCcuLi9tb25nb29zZS9yZWNydWl0ZXInKTtcclxuaW1wb3J0IHtKb2JRQ2FyZH0gZnJvbSBcIi4uLy4uL3NlYXJjaC9tb2RlbC9qb2ItcS1jYXJkXCI7XHJcbmltcG9ydCB7Q29uc3RWYXJpYWJsZXN9IGZyb20gXCIuLi8uLi9zaGFyZWQvc2hhcmVkY29uc3RhbnRzXCI7XHJcbmltcG9ydCBDYW5kaWRhdGVNb2RlbCA9IHJlcXVpcmUoJy4uL21vZGVsL2NhbmRpZGF0ZS5tb2RlbCcpO1xyXG5cclxuY2xhc3MgUmVjcnVpdGVyUmVwb3NpdG9yeSBleHRlbmRzIFJlcG9zaXRvcnlCYXNlPElSZWNydWl0ZXI+IHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHN1cGVyKFJlY3J1aXRlclNjaGVtYSk7XHJcbiAgfVxyXG5cclxuICBnZXRKb2JQcm9maWxlUUNhcmQocmVjcnVpdGVyczogYW55W10sIGNhbmRpZGF0ZTogQ2FuZGlkYXRlTW9kZWwsIGpvYlByb2ZpbGVJZHM6IHN0cmluZ1tdLCBpc1NlYXJjaFZpZXc6IHN0cmluZywgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbGV0IGlzU2VuZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgbGV0IGpvYnNfY2FyZHM6IEpvYlFDYXJkW10gPSBuZXcgQXJyYXkoMCk7XHJcbiAgICBpZiAocmVjcnVpdGVycy5sZW5ndGggPT09IDApIHtcclxuICAgICAgY2FsbGJhY2sobnVsbCwgam9ic19jYXJkcyk7XHJcbiAgICB9XHJcbiAgICBmb3IgKGxldCByZWNydWl0ZXIgb2YgcmVjcnVpdGVycykge1xyXG4gICAgICBmb3IgKGxldCBqb2Igb2YgcmVjcnVpdGVyLnBvc3RlZEpvYnMpIHtcclxuICAgICAgICBsZXQgaXNyZWxldmVudEluZHVzdHJ5TWF0Y2ggPSBmYWxzZTtcclxuICAgICAgICBpZiAoam9iLnJlbGV2ZW50SW5kdXN0cmllcy5pbmRleE9mKGNhbmRpZGF0ZS5pbmR1c3RyeS5uYW1lKSAhPT0gLTEpIHtcclxuICAgICAgICAgIGlzcmVsZXZlbnRJbmR1c3RyeU1hdGNoID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCAham9iLmlzSm9iUG9zdGVkXHJcbiAgICAgICAgICB8fCAoY2FuZGlkYXRlLmluZHVzdHJ5LmNvZGUgIT09IGpvYi5pbmR1c3RyeS5jb2RlICYmICFpc3JlbGV2ZW50SW5kdXN0cnlNYXRjaClcclxuICAgICAgICAgIHx8IGpvYi5pc0pvYlBvc3RFeHBpcmVkXHJcbiAgICAgICAgICB8fCAoam9iLmV4cGlyaW5nRGF0ZSA8IG5ldyBEYXRlKCkpKSB7XHJcbiAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGlzUHJlc2VudDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgIGZvciAobGV0IHByb2ZpY2llbmN5IG9mIGNhbmRpZGF0ZS5wcm9maWNpZW5jaWVzKSB7XHJcbiAgICAgICAgICBpZiAoam9iLnByb2ZpY2llbmNpZXMuaW5kZXhPZihwcm9maWNpZW5jeSkgIT09IC0xKSB7XHJcbiAgICAgICAgICAgIGlmIChqb2IuaW50ZXJlc3RlZEluZHVzdHJpZXMuaW5kZXhPZignTm9uZScpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgIGlzUHJlc2VudCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZm9yIChsZXQgaW5kdXN0cnkgb2YgY2FuZGlkYXRlLmludGVyZXN0ZWRJbmR1c3RyaWVzKSB7XHJcbiAgICAgICAgICAgICAgaWYgKGpvYi5pbnRlcmVzdGVkSW5kdXN0cmllcy5pbmRleE9mKGluZHVzdHJ5KSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIGlzUHJlc2VudCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpc1ByZXNlbnQpIHtcclxuICAgICAgICAgIGlmIChqb2JQcm9maWxlSWRzKSB7XHJcbiAgICAgICAgICAgIGlmIChqb2JQcm9maWxlSWRzLmluZGV4T2Yoam9iLl9pZCkgPT0gLTEpIHtcclxuICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IGlzRm91bmQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICAgICAgaWYgKGlzU2VhcmNoVmlldyAhPT0gJ3NlYXJjaFZpZXcnKSB7XHJcbiAgICAgICAgICAgICAgZm9yIChsZXQgbGlzdCBvZiBjYW5kaWRhdGUuam9iX2xpc3QpIHtcclxuICAgICAgICAgICAgICAgIGlmIChsaXN0Lmlkcy5pbmRleE9mKGpvYi5faWQpICE9IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgIGlzRm91bmQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGlzRm91bmQpIHtcclxuICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgbGV0IGpvYl9xY2FyZDogSm9iUUNhcmQgPSBuZXcgSm9iUUNhcmQoKTtcclxuICAgICAgICAgIGpvYl9xY2FyZC5tYXRjaGluZyA9IDA7XHJcbiAgICAgICAgICBsZXQgY291bnQ6IG51bWJlciA9IDA7XHJcbiAgICAgICAgICBmb3IgKGxldCBjYXAgaW4gam9iLmNhcGFiaWxpdHlfbWF0cml4KSB7XHJcbiAgICAgICAgICAgIGlmIChqb2IuY2FwYWJpbGl0eV9tYXRyaXhbY2FwXSA9PSAtMSB8fCBqb2IuY2FwYWJpbGl0eV9tYXRyaXhbY2FwXSA9PSAwIHx8IGpvYi5jYXBhYmlsaXR5X21hdHJpeFtjYXBdID09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGpvYi5jYXBhYmlsaXR5X21hdHJpeFtjYXBdID09IGNhbmRpZGF0ZS5jYXBhYmlsaXR5X21hdHJpeFtjYXBdKSB7XHJcbiAgICAgICAgICAgICAgam9iX3FjYXJkLmV4YWN0X21hdGNoaW5nICs9IDE7XHJcbiAgICAgICAgICAgICAgY291bnQrKztcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChqb2IuY2FwYWJpbGl0eV9tYXRyaXhbY2FwXSA9PSAoTnVtYmVyKGNhbmRpZGF0ZS5jYXBhYmlsaXR5X21hdHJpeFtjYXBdKSAtIENvbnN0VmFyaWFibGVzLkRJRkZFUkVOQ0VfSU5fQ09NUExFWElUWV9TQ0VOQVJJTykpIHtcclxuICAgICAgICAgICAgICBqb2JfcWNhcmQuYWJvdmVfb25lX3N0ZXBfbWF0Y2hpbmcgKz0gMTtcclxuICAgICAgICAgICAgICBjb3VudCsrO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGpvYi5jYXBhYmlsaXR5X21hdHJpeFtjYXBdID09IChOdW1iZXIoY2FuZGlkYXRlLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0pICsgQ29uc3RWYXJpYWJsZXMuRElGRkVSRU5DRV9JTl9DT01QTEVYSVRZX1NDRU5BUklPKSkge1xyXG4gICAgICAgICAgICAgIGpvYl9xY2FyZC5iZWxvd19vbmVfc3RlcF9tYXRjaGluZyArPSAxO1xyXG4gICAgICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgY291bnQrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGpvYl9xY2FyZC5hYm92ZV9vbmVfc3RlcF9tYXRjaGluZyA9IChqb2JfcWNhcmQuYWJvdmVfb25lX3N0ZXBfbWF0Y2hpbmcgLyBjb3VudCkgKiAxMDA7XHJcbiAgICAgICAgICBqb2JfcWNhcmQuYmVsb3dfb25lX3N0ZXBfbWF0Y2hpbmcgPSAoam9iX3FjYXJkLmJlbG93X29uZV9zdGVwX21hdGNoaW5nIC8gY291bnQpICogMTAwO1xyXG4gICAgICAgICAgam9iX3FjYXJkLmV4YWN0X21hdGNoaW5nID0gKGpvYl9xY2FyZC5leGFjdF9tYXRjaGluZyAvIGNvdW50KSAqIDEwMDtcclxuICAgICAgICAgIGpvYl9xY2FyZC5tYXRjaGluZyA9IGpvYl9xY2FyZC5hYm92ZV9vbmVfc3RlcF9tYXRjaGluZyArIGpvYl9xY2FyZC5iZWxvd19vbmVfc3RlcF9tYXRjaGluZyArIGpvYl9xY2FyZC5leGFjdF9tYXRjaGluZztcclxuICAgICAgICAgIGpvYl9xY2FyZC5jb21wYW55X25hbWUgPSByZWNydWl0ZXIuY29tcGFueV9uYW1lO1xyXG4gICAgICAgICAgam9iX3FjYXJkLmNvbXBhbnlfc2l6ZSA9IHJlY3J1aXRlci5jb21wYW55X3NpemU7XHJcbiAgICAgICAgICBqb2JfcWNhcmQuY29tcGFueV9sb2dvID0gcmVjcnVpdGVyLmNvbXBhbnlfbG9nbztcclxuICAgICAgICAgIGpvYl9xY2FyZC5jb21wYW55X3dlYnNpdGUgPSByZWNydWl0ZXIuY29tcGFueV93ZWJzaXRlO1xyXG4gICAgICAgICAgam9iX3FjYXJkLnNhbGFyeU1pblZhbHVlID0gam9iLnNhbGFyeU1pblZhbHVlO1xyXG4gICAgICAgICAgam9iX3FjYXJkLnNhbGFyeU1heFZhbHVlID0gam9iLnNhbGFyeU1heFZhbHVlO1xyXG4gICAgICAgICAgam9iX3FjYXJkLmV4cGVyaWVuY2VNaW5WYWx1ZSA9IGpvYi5leHBlcmllbmNlTWluVmFsdWU7XHJcbiAgICAgICAgICBqb2JfcWNhcmQuZXhwZXJpZW5jZU1heFZhbHVlID0gam9iLmV4cGVyaWVuY2VNYXhWYWx1ZTtcclxuICAgICAgICAgIGpvYl9xY2FyZC5lZHVjYXRpb24gPSBqb2IuZWR1Y2F0aW9uO1xyXG4gICAgICAgICAgam9iX3FjYXJkLmludGVyZXN0ZWRJbmR1c3RyaWVzID0gam9iLmludGVyZXN0ZWRJbmR1c3RyaWVzO1xyXG4gICAgICAgICAgam9iX3FjYXJkLnByb2ZpY2llbmNpZXMgPSBqb2IucHJvZmljaWVuY2llcztcclxuICAgICAgICAgIGpvYl9xY2FyZC5sb2NhdGlvbiA9IGpvYi5sb2NhdGlvbi5jaXR5O1xyXG4gICAgICAgICAgam9iX3FjYXJkLl9pZCA9IGpvYi5faWQ7XHJcbiAgICAgICAgICBqb2JfcWNhcmQuaW5kdXN0cnkgPSBqb2IuaW5kdXN0cnkubmFtZTsgLy90b2RvIGFkZCBpbmR1c3RyeSBuYW1lXHJcbiAgICAgICAgICBqb2JfcWNhcmQuam9iVGl0bGUgPSBqb2Iuam9iVGl0bGU7XHJcbiAgICAgICAgICBqb2JfcWNhcmQuam9pbmluZ1BlcmlvZCA9IGpvYi5qb2luaW5nUGVyaW9kO1xyXG4gICAgICAgICAgam9iX3FjYXJkLnBvc3RpbmdEYXRlID0gam9iLnBvc3RpbmdEYXRlO1xyXG4gICAgICAgICAgam9iX3FjYXJkLmhpZGVDb21wYW55TmFtZSA9IGpvYi5oaWRlQ29tcGFueU5hbWU7XHJcbiAgICAgICAgICBqb2JfcWNhcmQuY2FuZGlkYXRlX2xpc3QgPSBqb2IuY2FuZGlkYXRlX2xpc3Q7XHJcbiAgICAgICAgICBqb2JfcWNhcmQuaXNKb2JQb3N0Q2xvc2VkID0gam9iLmlzSm9iUG9zdENsb3NlZDtcclxuXHJcblxyXG4gICAgICAgICAgaWYgKChqb2JfcWNhcmQuYWJvdmVfb25lX3N0ZXBfbWF0Y2hpbmcgKyBqb2JfcWNhcmQuZXhhY3RfbWF0Y2hpbmcpID49IENvbnN0VmFyaWFibGVzLkxPV0VSX0xJTUlUX0ZPUl9TRUFSQ0hfUkVTVUxUKSB7XHJcbiAgICAgICAgICAgIGpvYnNfY2FyZHMucHVzaChqb2JfcWNhcmQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBpZiAocmVjcnVpdGVycy5pbmRleE9mKHJlY3J1aXRlcikgPT0gcmVjcnVpdGVycy5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgaXNTZW5kID0gdHJ1ZTtcclxuICAgICAgICBqb2JzX2NhcmRzLnNvcnQoKGZpcnN0OiBKb2JRQ2FyZCwgc2Vjb25kOiBKb2JRQ2FyZCk6IG51bWJlciA9PiB7XHJcbiAgICAgICAgICBpZiAoKGZpcnN0LmFib3ZlX29uZV9zdGVwX21hdGNoaW5nICsgZmlyc3QuZXhhY3RfbWF0Y2hpbmcpID4gKHNlY29uZC5hYm92ZV9vbmVfc3RlcF9tYXRjaGluZyArIHNlY29uZC5leGFjdF9tYXRjaGluZykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKChmaXJzdC5hYm92ZV9vbmVfc3RlcF9tYXRjaGluZyArIGZpcnN0LmV4YWN0X21hdGNoaW5nKSA8IChzZWNvbmQuYWJvdmVfb25lX3N0ZXBfbWF0Y2hpbmcgKyBzZWNvbmQuZXhhY3RfbWF0Y2hpbmcpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgam9ic19jYXJkcyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuXHJcbn1cclxuXHJcbk9iamVjdC5zZWFsKFJlY3J1aXRlclJlcG9zaXRvcnkpO1xyXG5leHBvcnQgPSBSZWNydWl0ZXJSZXBvc2l0b3J5O1xyXG4iXX0=
