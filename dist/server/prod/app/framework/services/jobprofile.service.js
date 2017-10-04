"use strict";
var mongoose = require("mongoose");
var recruiter_final_model_1 = require("../dataaccess/model/recruiter-final.model");
var sharedconstants_1 = require("../shared/sharedconstants");
var shared_service_1 = require("../shared/services/shared-service");
var ProjectAsset = require("../shared/projectasset");
var RecruiterRepository = require("../dataaccess/repository/recruiter.repository");
var JobProfileRepository = require("../dataaccess/repository/job-profile.repository");
var CandidateRepository = require("../dataaccess/repository/candidate.repository");
var CandidateSearchRepository = require("../search/candidate-search.repository");
var IndustryRepository = require("../dataaccess/repository/industry.repository");
var CandidateService = require("./candidate.service");
var usestracking = require('uses-tracking');
var JobProfileService = (function () {
    function JobProfileService() {
        this.jobprofileRepository = new JobProfileRepository();
        this.candidateSearchRepository = new CandidateSearchRepository();
        this.recruiterRepository = new RecruiterRepository();
        this.industryRepository = new IndustryRepository();
        this.candidateRepository = new CandidateRepository();
        this.APP_NAME = ProjectAsset.APP_NAME;
        var obj = new usestracking.MyController();
        this.usesTrackingController = obj._controller;
    }
    JobProfileService.prototype.create = function (item, callback) {
        this.jobprofileRepository.create(item, function (err, res) {
            if (err) {
                callback(new Error(err), null);
            }
            else {
                callback(null, res);
            }
        });
    };
    JobProfileService.prototype.searchCandidatesByJobProfile = function (jobProfile, callback) {
        this.candidateSearchRepository.getCandidateByIndustry(jobProfile, function (err, res) {
            if (err) {
                callback(new Error(err), null);
            }
            else {
                callback(null, res);
            }
        });
    };
    JobProfileService.prototype.retrieve = function (data, callback) {
        var query = {
            'postedJobs': { $elemMatch: { '_id': new mongoose.Types.ObjectId(data.postedJob) } }
        };
        this.recruiterRepository.retrieve(query, function (err, res) {
            if (err) {
                callback(new Error('Not Found Any Job posted'), null);
            }
            else {
                if (res.length > 0) {
                    var recruiter = new recruiter_final_model_1.Recruiter();
                    recruiter = res[0];
                    for (var _i = 0, _a = res[0].postedJobs; _i < _a.length; _i++) {
                        var job = _a[_i];
                        if (job._id.toString() === data.postedJob) {
                            recruiter.postedJobs = new Array(0);
                            recruiter.postedJobs.push(job);
                            callback(null, recruiter);
                        }
                    }
                }
            }
        });
    };
    JobProfileService.prototype.getCapabilityValueKeyMatrix = function (_id, callback) {
        var _this = this;
        var data = {
            'postedJob': _id
        };
        this.retrieve(data, function (err, res) {
            if (err) {
                callback(err, res);
            }
            else {
                _this.industryRepository.retrieve({ 'name': res.postedJobs[0].industry.name }, function (error, industries) {
                    if (err) {
                        callback(err, res);
                    }
                    else {
                        var candidateService = new CandidateService();
                        var new_capability_matrix = candidateService.getCapabilityValueKeyMatrixBuild(res.postedJobs[0].capability_matrix, industries);
                        callback(null, new_capability_matrix);
                    }
                });
            }
        });
    };
    JobProfileService.prototype.update = function (item, callback) {
        var _this = this;
        var query = {
            'postedJobs': { $elemMatch: { '_id': new mongoose.Types.ObjectId(item.profileId) } }
        };
        var updateFlag = false;
        var updatedQuery1 = {
            '_id': item.recruiterId,
            'postedJobs._id': item.profileId
        };
        var updatedQuery2 = {
            $push: {
                'postedJobs.$.candidate_list': {
                    'name': item.listName,
                    'ids': item.candidateId
                }
            }
        };
        var updatedQuery3;
        var updatedQuery4 = {
            'new': true, 'upsert': true
        };
        this.recruiterRepository.retrieve(query, function (err, res) {
            if (err) {
                callback(new Error('Not Found Any Job posted'), null);
            }
            else {
                if (res.length > 0) {
                    for (var _i = 0, _a = res[0].postedJobs; _i < _a.length; _i++) {
                        var job = _a[_i];
                        if (job._id.toString() === item.profileId) {
                            for (var _b = 0, _c = job.candidate_list; _b < _c.length; _b++) {
                                var list = _c[_b];
                                if (list.name == item.listName) {
                                    updateFlag = true;
                                    if (item.action == 'add') {
                                        var uses_data = {
                                            recruiterId: res[0]._id,
                                            candidateId: item.candidateId,
                                            jobProfileId: job._id,
                                            timestamp: new Date(),
                                            action: sharedconstants_1.Actions.DEFAULT_VALUE
                                        };
                                        var sharedService = new shared_service_1.SharedService();
                                        uses_data.action = sharedService.constructAddActionData(item.listName);
                                        _this.usesTrackingController.create(uses_data);
                                        if (list.name == sharedconstants_1.ConstVariables.REJECTED_LISTED_CANDIDATE) {
                                            for (var _d = 0, _e = job.candidate_list; _d < _e.length; _d++) {
                                                var _list = _e[_d];
                                                if (_list.name == sharedconstants_1.ConstVariables.CART_LISTED_CANDIDATE) {
                                                    var index_1 = _list.ids.indexOf(item.candidateId);
                                                    if (index_1 !== -1) {
                                                        _list.ids.splice(index_1, 1);
                                                    }
                                                }
                                            }
                                        }
                                        var index = list.ids.indexOf(item.candidateId);
                                        if (index == -1) {
                                            list.ids.push(item.candidateId);
                                        }
                                    }
                                    else {
                                        var uses_data = {
                                            recruiterId: res[0]._id,
                                            candidateId: item.candidateId,
                                            jobProfileId: job._id,
                                            timestamp: new Date(),
                                            action: sharedconstants_1.Actions.DEFAULT_VALUE
                                        };
                                        var sharedService = new shared_service_1.SharedService();
                                        uses_data.action = sharedService.constructRemoveActionData(item.listName);
                                        _this.usesTrackingController.create(uses_data);
                                        var index = list.ids.indexOf(item.candidateId);
                                        if (index !== -1) {
                                            list.ids.splice(index, 1);
                                        }
                                    }
                                    updatedQuery3 = {
                                        $set: {
                                            'postedJobs.$.candidate_list': job.candidate_list
                                        }
                                    };
                                    break;
                                }
                            }
                            var param2 = void 0;
                            updateFlag ? param2 = updatedQuery3 : param2 = updatedQuery2;
                            _this.recruiterRepository.findOneAndUpdate(updatedQuery1, param2, updatedQuery4, function (err, record) {
                                if (record) {
                                    callback(null, record);
                                }
                                else {
                                    var error = void 0;
                                    if (record === null) {
                                        error = new Error('Unable to add candidate.');
                                        callback(error, null);
                                    }
                                    else {
                                        callback(err, null);
                                    }
                                }
                            });
                        }
                    }
                }
            }
        });
    };
    JobProfileService.prototype.applyJob = function (item, callback) {
        var _this = this;
        this.candidateRepository.retrieve({ '_id': new mongoose.Types.ObjectId(item.candidateId) }, function (error, response) {
            if (error) {
                callback(new Error('No candidate Found'), null);
            }
            else {
                if (response.length > 0) {
                    var updateExistingQueryForCandidate = void 0;
                    var isJobFound = false;
                    for (var _i = 0, _a = response[0].job_list; _i < _a.length; _i++) {
                        var list = _a[_i];
                        if (list.name == item.listName) {
                            isJobFound = true;
                            if (item.action == 'add') {
                                var index = list.ids.indexOf(item.profileId);
                                if (index == -1) {
                                    var uses_data = {
                                        candidateId: item.candidateId,
                                        jobProfileId: item.profileId,
                                        timestamp: new Date(),
                                        action: sharedconstants_1.Actions.DEFAULT_VALUE
                                    };
                                    var sharedService = new shared_service_1.SharedService();
                                    uses_data.action = sharedService.constructAddActionData(item.listName);
                                    _this.usesTrackingController.create(uses_data);
                                    list.ids.push(item.profileId);
                                }
                            }
                            else if (item.action == 'remove' && item.listName != 'applied') {
                                var uses_data = {
                                    candidateId: item.candidateId,
                                    jobProfileId: item.profileId,
                                    timestamp: new Date(),
                                    action: sharedconstants_1.Actions.DEFAULT_VALUE
                                };
                                var sharedService = new shared_service_1.SharedService();
                                uses_data.action = sharedService.constructRemoveActionData(item.listName);
                                _this.usesTrackingController.create(uses_data);
                                var index = list.ids.indexOf(item.profileId);
                                if (index !== -1) {
                                    list.ids.splice(index, 1);
                                }
                            }
                            updateExistingQueryForCandidate = {
                                $set: {
                                    'job_list': response[0].job_list
                                }
                            };
                            break;
                        }
                    }
                    var newEntryQueryForCandidate = {
                        $push: {
                            'job_list': {
                                'name': item.listName,
                                'ids': item.profileId
                            }
                        }
                    };
                    var options_1 = {
                        'new': true, 'upsert': true
                    };
                    var latestQueryForCandidate = void 0;
                    isJobFound ? latestQueryForCandidate = updateExistingQueryForCandidate : latestQueryForCandidate = newEntryQueryForCandidate;
                    var candidateSearchQuery = {
                        '_id': item.candidateId
                    };
                    _this.candidateRepository.findOneAndUpdate(candidateSearchQuery, latestQueryForCandidate, options_1, function (err, record) {
                        if (record) {
                            if (item.listName == 'applied' && item.action == 'add') {
                                var query = {
                                    'postedJobs': { $elemMatch: { '_id': new mongoose.Types.ObjectId(item.profileId) } }
                                };
                                var newEntryQuery_1 = {
                                    $push: {
                                        'postedJobs.$.candidate_list': {
                                            'name': sharedconstants_1.ConstVariables.APPLIED_CANDIDATE,
                                            'ids': item.candidateId
                                        }
                                    }
                                };
                                var updateExistingQuery_1;
                                _this.recruiterRepository.retrieve(query, function (err, res) {
                                    if (err) {
                                        callback(new Error('Not Found Any Job posted'), null);
                                    }
                                    else {
                                        var isFound = false;
                                        if (res.length > 0) {
                                            for (var _i = 0, _a = res[0].postedJobs; _i < _a.length; _i++) {
                                                var job = _a[_i];
                                                if (job._id.toString() === item.profileId) {
                                                    for (var _b = 0, _c = job.candidate_list; _b < _c.length; _b++) {
                                                        var list = _c[_b];
                                                        if (list.name == sharedconstants_1.ConstVariables.APPLIED_CANDIDATE) {
                                                            isFound = true;
                                                            var index = list.ids.indexOf(item.candidateId);
                                                            if (index == -1) {
                                                                list.ids.push(item.candidateId);
                                                            }
                                                            updateExistingQuery_1 = {
                                                                $set: {
                                                                    'postedJobs.$.candidate_list': job.candidate_list
                                                                }
                                                            };
                                                            break;
                                                        }
                                                    }
                                                }
                                            }
                                            var latestQuery = void 0;
                                            isFound ? latestQuery = updateExistingQuery_1 : latestQuery = newEntryQuery_1;
                                            var recruiterSearchQuery = {
                                                '_id': res[0]._id,
                                                'postedJobs._id': item.profileId
                                            };
                                            _this.recruiterRepository.findOneAndUpdate(recruiterSearchQuery, latestQuery, options_1, function (err, record) {
                                                if (record) {
                                                    callback(null, record);
                                                }
                                                else {
                                                    var error_1;
                                                    if (record === null) {
                                                        error_1 = new Error('Unable to add candidate.');
                                                        callback(error_1, null);
                                                    }
                                                    else {
                                                        callback(err, null);
                                                    }
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                            else {
                                callback(null, record);
                            }
                        }
                        else {
                            var error_2;
                            if (record === null) {
                                error_2 = new Error('Unable to add Job to List.');
                                callback(error_2, null);
                            }
                            else {
                                callback(err, null);
                            }
                        }
                    });
                }
            }
        });
    };
    JobProfileService.prototype.getQCardDetails = function (item, callback) {
        var _this = this;
        var candidateDetails;
        this.candidateRepository.retrieveByMultiIds(item.candidateIds, {}, function (err, candidateDetailsRes) {
            if (err) {
                callback(err, null);
            }
            else {
                candidateDetails = candidateDetailsRes;
                var query = {
                    'postedJobs': { $elemMatch: { '_id': new mongoose.Types.ObjectId(item.jobId) } }
                };
                _this.recruiterRepository.retrieve(query, function (err, res) {
                    if (err) {
                        callback(new Error('Not Found Any Job posted'), null);
                    }
                    else {
                        if (res.length > 0) {
                            var recruiter = new recruiter_final_model_1.Recruiter();
                            recruiter = res[0];
                            for (var _i = 0, _a = res[0].postedJobs; _i < _a.length; _i++) {
                                var job = _a[_i];
                                if (job._id.toString() === item.jobId) {
                                    _this.candidateRepository.getCandidateQCard(candidateDetails, job, undefined, callback);
                                }
                            }
                        }
                    }
                });
            }
        });
    };
    return JobProfileService;
}());
Object.seal(JobProfileService);
module.exports = JobProfileService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2VydmljZXMvam9icHJvZmlsZS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxtQ0FBcUM7QUFDckMsbUZBQW9FO0FBQ3BFLDZEQUFrRTtBQUNsRSxvRUFBZ0U7QUFDaEUscURBQXdEO0FBQ3hELG1GQUFzRjtBQUN0RixzRkFBeUY7QUFDekYsbUZBQXNGO0FBRXRGLGlGQUFvRjtBQUVwRixpRkFBb0Y7QUFDcEYsc0RBQXlEO0FBQ3pELElBQUksWUFBWSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUc1QztJQVNFO1FBQ0UsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksb0JBQW9CLEVBQUUsQ0FBQztRQUN2RCxJQUFJLENBQUMseUJBQXlCLEdBQUcsSUFBSSx5QkFBeUIsRUFBRSxDQUFDO1FBQ2pFLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLG1CQUFtQixFQUFFLENBQUM7UUFDckQsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksa0JBQWtCLEVBQUUsQ0FBQztRQUNuRCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxtQkFBbUIsRUFBRSxDQUFDO1FBQ3JELElBQUksQ0FBQyxRQUFRLEdBQUcsWUFBWSxDQUFDLFFBQVEsQ0FBQztRQUN0QyxJQUFJLEdBQUcsR0FBUSxJQUFJLFlBQVksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUMvQyxJQUFJLENBQUMsc0JBQXNCLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQztJQUNoRCxDQUFDO0lBRUQsa0NBQU0sR0FBTixVQUFPLElBQVMsRUFBRSxRQUEyQztRQUMzRCxJQUFJLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxVQUFDLEdBQUcsRUFBRSxHQUFHO1lBQzlDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsUUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FB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QUFHLEVBQUUsR0FBRztvQkFDaEQsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDUixRQUFRLENBQUMsSUFBSSxLQUFLLENBQUMsMEJBQTBCLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFDeEQsQ0FBQztvQkFDRCxJQUFJLENBQUMsQ0FBQzt3QkFDSixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ25CLElBQUksU0FBUyxHQUFjLElBQUksaUNBQVMsRUFBRSxDQUFDOzRCQUMzQyxTQUFTLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUNuQixHQUFHLENBQUMsQ0FBWSxVQUFpQixFQUFqQixLQUFBLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQWpCLGNBQWlCLEVBQWpCLElBQWlCO2dDQUE1QixJQUFJLEdBQUcsU0FBQTtnQ0FDVixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxLQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29DQUN0QyxLQUFJLENBQUMsbUJBQW1CLENBQUMsaUJBQWlCLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztnQ0FDekYsQ0FBQzs2QkFDRjt3QkFDSCxDQUFDO29CQUNILENBQUM7Z0JBQ0gsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBR0gsd0JBQUM7QUFBRCxDQXRZQSxBQXNZQyxJQUFBO0FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQy9CLGlCQUFTLGlCQUFpQixDQUFDIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvc2VydmljZXMvam9icHJvZmlsZS5zZXJ2aWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgbW9uZ29vc2UgZnJvbSBcIm1vbmdvb3NlXCI7XHJcbmltcG9ydCB7UmVjcnVpdGVyfSBmcm9tIFwiLi4vZGF0YWFjY2Vzcy9tb2RlbC9yZWNydWl0ZXItZmluYWwubW9kZWxcIjtcclxuaW1wb3J0IHtBY3Rpb25zLCBDb25zdFZhcmlhYmxlc30gZnJvbSBcIi4uL3NoYXJlZC9zaGFyZWRjb25zdGFudHNcIjtcclxuaW1wb3J0IHtTaGFyZWRTZXJ2aWNlfSBmcm9tIFwiLi4vc2hhcmVkL3NlcnZpY2VzL3NoYXJlZC1zZXJ2aWNlXCI7XHJcbmltcG9ydCBQcm9qZWN0QXNzZXQgPSByZXF1aXJlKCcuLi9zaGFyZWQvcHJvamVjdGFzc2V0Jyk7XHJcbmltcG9ydCBSZWNydWl0ZXJSZXBvc2l0b3J5ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L3JlY3J1aXRlci5yZXBvc2l0b3J5Jyk7XHJcbmltcG9ydCBKb2JQcm9maWxlUmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9qb2ItcHJvZmlsZS5yZXBvc2l0b3J5Jyk7XHJcbmltcG9ydCBDYW5kaWRhdGVSZXBvc2l0b3J5ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L2NhbmRpZGF0ZS5yZXBvc2l0b3J5Jyk7XHJcbmltcG9ydCBKb2JQcm9maWxlTW9kZWwgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL2pvYnByb2ZpbGUubW9kZWwnKTtcclxuaW1wb3J0IENhbmRpZGF0ZVNlYXJjaFJlcG9zaXRvcnkgPSByZXF1aXJlKCcuLi9zZWFyY2gvY2FuZGlkYXRlLXNlYXJjaC5yZXBvc2l0b3J5Jyk7XHJcbmltcG9ydCBJbmR1c3RyeU1vZGVsID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9pbmR1c3RyeS5tb2RlbCcpO1xyXG5pbXBvcnQgSW5kdXN0cnlSZXBvc2l0b3J5ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L2luZHVzdHJ5LnJlcG9zaXRvcnknKTtcclxuaW1wb3J0IENhbmRpZGF0ZVNlcnZpY2UgPSByZXF1aXJlKCcuL2NhbmRpZGF0ZS5zZXJ2aWNlJyk7XHJcbmxldCB1c2VzdHJhY2tpbmcgPSByZXF1aXJlKCd1c2VzLXRyYWNraW5nJyk7XHJcblxyXG5cclxuY2xhc3MgSm9iUHJvZmlsZVNlcnZpY2Uge1xyXG4gIHByaXZhdGUgam9icHJvZmlsZVJlcG9zaXRvcnk6IEpvYlByb2ZpbGVSZXBvc2l0b3J5O1xyXG4gIHByaXZhdGUgY2FuZGlkYXRlU2VhcmNoUmVwb3NpdG9yeTogQ2FuZGlkYXRlU2VhcmNoUmVwb3NpdG9yeTtcclxuICBwcml2YXRlIGluZHVzdHJ5UmVwb3NpdG9yeTogSW5kdXN0cnlSZXBvc2l0b3J5O1xyXG4gIHByaXZhdGUgcmVjcnVpdGVyUmVwb3NpdG9yeTogUmVjcnVpdGVyUmVwb3NpdG9yeTtcclxuICBwcml2YXRlIGNhbmRpZGF0ZVJlcG9zaXRvcnk6IENhbmRpZGF0ZVJlcG9zaXRvcnk7XHJcbiAgcHJpdmF0ZSBBUFBfTkFNRTogc3RyaW5nO1xyXG4gIHByaXZhdGUgdXNlc1RyYWNraW5nQ29udHJvbGxlcjogYW55O1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuam9icHJvZmlsZVJlcG9zaXRvcnkgPSBuZXcgSm9iUHJvZmlsZVJlcG9zaXRvcnkoKTtcclxuICAgIHRoaXMuY2FuZGlkYXRlU2VhcmNoUmVwb3NpdG9yeSA9IG5ldyBDYW5kaWRhdGVTZWFyY2hSZXBvc2l0b3J5KCk7XHJcbiAgICB0aGlzLnJlY3J1aXRlclJlcG9zaXRvcnkgPSBuZXcgUmVjcnVpdGVyUmVwb3NpdG9yeSgpO1xyXG4gICAgdGhpcy5pbmR1c3RyeVJlcG9zaXRvcnkgPSBuZXcgSW5kdXN0cnlSZXBvc2l0b3J5KCk7XHJcbiAgICB0aGlzLmNhbmRpZGF0ZVJlcG9zaXRvcnkgPSBuZXcgQ2FuZGlkYXRlUmVwb3NpdG9yeSgpO1xyXG4gICAgdGhpcy5BUFBfTkFNRSA9IFByb2plY3RBc3NldC5BUFBfTkFNRTtcclxuICAgIGxldCBvYmo6IGFueSA9IG5ldyB1c2VzdHJhY2tpbmcuTXlDb250cm9sbGVyKCk7XHJcbiAgICB0aGlzLnVzZXNUcmFja2luZ0NvbnRyb2xsZXIgPSBvYmouX2NvbnRyb2xsZXI7XHJcbiAgfVxyXG5cclxuICBjcmVhdGUoaXRlbTogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0aGlzLmpvYnByb2ZpbGVSZXBvc2l0b3J5LmNyZWF0ZShpdGVtLCAoZXJyLCByZXMpID0+IHtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihlcnIpLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCByZXMpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHNlYXJjaENhbmRpZGF0ZXNCeUpvYlByb2ZpbGUoam9iUHJvZmlsZTogSm9iUHJvZmlsZU1vZGVsLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcblxyXG4gICAgdGhpcy5jYW5kaWRhdGVTZWFyY2hSZXBvc2l0b3J5LmdldENhbmRpZGF0ZUJ5SW5kdXN0cnkoam9iUHJvZmlsZSwgKGVyciwgcmVzKSA9PiB7XHJcbiAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoZXJyKSwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZXRyaWV2ZShkYXRhOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxldCBxdWVyeSA9IHtcclxuICAgICAgJ3Bvc3RlZEpvYnMnOiB7JGVsZW1NYXRjaDogeydfaWQnOiBuZXcgbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQoZGF0YS5wb3N0ZWRKb2IpfX1cclxuICAgIH07XHJcbiAgICB0aGlzLnJlY3J1aXRlclJlcG9zaXRvcnkucmV0cmlldmUocXVlcnksIChlcnIsIHJlcykgPT4ge1xyXG4gICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKCdOb3QgRm91bmQgQW55IEpvYiBwb3N0ZWQnKSwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHJlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICBsZXQgcmVjcnVpdGVyOiBSZWNydWl0ZXIgPSBuZXcgUmVjcnVpdGVyKCk7XHJcbiAgICAgICAgICByZWNydWl0ZXIgPSByZXNbMF07XHJcbiAgICAgICAgICBmb3IgKGxldCBqb2Igb2YgcmVzWzBdLnBvc3RlZEpvYnMpIHtcclxuICAgICAgICAgICAgaWYgKGpvYi5faWQudG9TdHJpbmcoKSA9PT0gZGF0YS5wb3N0ZWRKb2IpIHtcclxuICAgICAgICAgICAgICByZWNydWl0ZXIucG9zdGVkSm9icyA9IG5ldyBBcnJheSgwKTtcclxuICAgICAgICAgICAgICByZWNydWl0ZXIucG9zdGVkSm9icy5wdXNoKGpvYik7XHJcbiAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVjcnVpdGVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRDYXBhYmlsaXR5VmFsdWVLZXlNYXRyaXgoX2lkOiBzdHJpbmcsICBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBsZXQgZGF0YTogYW55ID0ge1xyXG4gICAgICAncG9zdGVkSm9iJzogX2lkXHJcbiAgICB9O1xyXG4gICAgdGhpcy5yZXRyaWV2ZShkYXRhLCAoZXJyOiBhbnksIHJlczpSZWNydWl0ZXIpID0+IHtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVyciwgcmVzKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmluZHVzdHJ5UmVwb3NpdG9yeS5yZXRyaWV2ZSh7J25hbWUnOiByZXMucG9zdGVkSm9ic1swXS5pbmR1c3RyeS5uYW1lfSwgKGVycm9yOiBhbnksIGluZHVzdHJpZXM6IEluZHVzdHJ5TW9kZWxbXSkgPT4ge1xyXG4gICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhlcnIsIHJlcyk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgY2FuZGlkYXRlU2VydmljZTogYW55ID0gbmV3IENhbmRpZGF0ZVNlcnZpY2UoKTtcclxuICAgICAgICAgICAgbGV0IG5ld19jYXBhYmlsaXR5X21hdHJpeDogYW55ID0gIGNhbmRpZGF0ZVNlcnZpY2UuZ2V0Q2FwYWJpbGl0eVZhbHVlS2V5TWF0cml4QnVpbGQocmVzLnBvc3RlZEpvYnNbMF0uY2FwYWJpbGl0eV9tYXRyaXgsaW5kdXN0cmllcyk7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIG5ld19jYXBhYmlsaXR5X21hdHJpeCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlKGl0ZW06IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG5cclxuICAgIGxldCBxdWVyeSA9IHtcclxuICAgICAgJ3Bvc3RlZEpvYnMnOiB7JGVsZW1NYXRjaDogeydfaWQnOiBuZXcgbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQoaXRlbS5wcm9maWxlSWQpfX1cclxuICAgIH07XHJcblxyXG4gICAgbGV0IHVwZGF0ZUZsYWcgPSBmYWxzZTtcclxuXHJcbiAgICBsZXQgdXBkYXRlZFF1ZXJ5MSA9IHtcclxuICAgICAgJ19pZCc6IGl0ZW0ucmVjcnVpdGVySWQsXHJcbiAgICAgICdwb3N0ZWRKb2JzLl9pZCc6IGl0ZW0ucHJvZmlsZUlkXHJcbiAgICB9O1xyXG5cclxuICAgIGxldCB1cGRhdGVkUXVlcnkyID0ge1xyXG4gICAgICAkcHVzaDoge1xyXG4gICAgICAgICdwb3N0ZWRKb2JzLiQuY2FuZGlkYXRlX2xpc3QnOiB7XHJcbiAgICAgICAgICAnbmFtZSc6IGl0ZW0ubGlzdE5hbWUsXHJcbiAgICAgICAgICAnaWRzJzogaXRlbS5jYW5kaWRhdGVJZFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBsZXQgdXBkYXRlZFF1ZXJ5MzogYW55O1xyXG5cclxuICAgIGxldCB1cGRhdGVkUXVlcnk0ID0ge1xyXG4gICAgICAnbmV3JzogdHJ1ZSwgJ3Vwc2VydCc6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5yZWNydWl0ZXJSZXBvc2l0b3J5LnJldHJpZXZlKHF1ZXJ5LCAoZXJyLCByZXMpID0+IHtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcignTm90IEZvdW5kIEFueSBKb2IgcG9zdGVkJyksIG51bGwpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIGlmIChyZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgZm9yIChsZXQgam9iIG9mIHJlc1swXS5wb3N0ZWRKb2JzKSB7XHJcbiAgICAgICAgICAgIGlmIChqb2IuX2lkLnRvU3RyaW5nKCkgPT09IGl0ZW0ucHJvZmlsZUlkKSB7XHJcblxyXG4gICAgICAgICAgICAgIGZvciAobGV0IGxpc3Qgb2Ygam9iLmNhbmRpZGF0ZV9saXN0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobGlzdC5uYW1lID09IGl0ZW0ubGlzdE5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgdXBkYXRlRmxhZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgIGlmIChpdGVtLmFjdGlvbiA9PSAnYWRkJykge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB1c2VzX2RhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICByZWNydWl0ZXJJZDogcmVzWzBdLl9pZCxcclxuICAgICAgICAgICAgICAgICAgICAgIGNhbmRpZGF0ZUlkOiBpdGVtLmNhbmRpZGF0ZUlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgam9iUHJvZmlsZUlkOiBqb2IuX2lkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgdGltZXN0YW1wOiBuZXcgRGF0ZSgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiBBY3Rpb25zLkRFRkFVTFRfVkFMVUVcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzaGFyZWRTZXJ2aWNlOlNoYXJlZFNlcnZpY2UgPSBuZXcgU2hhcmVkU2VydmljZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHVzZXNfZGF0YS5hY3Rpb24gPSBzaGFyZWRTZXJ2aWNlLmNvbnN0cnVjdEFkZEFjdGlvbkRhdGEoaXRlbS5saXN0TmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51c2VzVHJhY2tpbmdDb250cm9sbGVyLmNyZWF0ZSh1c2VzX2RhdGEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAobGlzdC5uYW1lID09IENvbnN0VmFyaWFibGVzLlJFSkVDVEVEX0xJU1RFRF9DQU5ESURBVEUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IF9saXN0IG9mIGpvYi5jYW5kaWRhdGVfbGlzdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoX2xpc3QubmFtZSA9PSBDb25zdFZhcmlhYmxlcy5DQVJUX0xJU1RFRF9DQU5ESURBVEUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSBfbGlzdC5pZHMuaW5kZXhPZihpdGVtLmNhbmRpZGF0ZUlkKTsgICAgLy8gPC0tIE5vdCBzdXBwb3J0ZWQgaW4gPElFOVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9saXN0Lmlkcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSBsaXN0Lmlkcy5pbmRleE9mKGl0ZW0uY2FuZGlkYXRlSWQpOyAgICAvLyA8LS0gTm90IHN1cHBvcnRlZCBpbiA8SUU5XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBsaXN0Lmlkcy5wdXNoKGl0ZW0uY2FuZGlkYXRlSWQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHVzZXNfZGF0YSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgIHJlY3J1aXRlcklkOiByZXNbMF0uX2lkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgY2FuZGlkYXRlSWQ6IGl0ZW0uY2FuZGlkYXRlSWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICBqb2JQcm9maWxlSWQ6IGpvYi5faWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICBhY3Rpb246IEFjdGlvbnMuREVGQVVMVF9WQUxVRVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNoYXJlZFNlcnZpY2U6IFNoYXJlZFNlcnZpY2UgPSBuZXcgU2hhcmVkU2VydmljZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHVzZXNfZGF0YS5hY3Rpb24gPSBzaGFyZWRTZXJ2aWNlLmNvbnN0cnVjdFJlbW92ZUFjdGlvbkRhdGEoaXRlbS5saXN0TmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51c2VzVHJhY2tpbmdDb250cm9sbGVyLmNyZWF0ZSh1c2VzX2RhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpbmRleCA9IGxpc3QuaWRzLmluZGV4T2YoaXRlbS5jYW5kaWRhdGVJZCk7ICAgIC8vIDwtLSBOb3Qgc3VwcG9ydGVkIGluIDxJRTlcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBsaXN0Lmlkcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB1cGRhdGVkUXVlcnkzID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICRzZXQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICdwb3N0ZWRKb2JzLiQuY2FuZGlkYXRlX2xpc3QnOiBqb2IuY2FuZGlkYXRlX2xpc3RcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgbGV0IHBhcmFtMjogYW55O1xyXG4gICAgICAgICAgICAgIHVwZGF0ZUZsYWcgPyBwYXJhbTIgPSB1cGRhdGVkUXVlcnkzIDogcGFyYW0yID0gdXBkYXRlZFF1ZXJ5MjtcclxuXHJcbiAgICAgICAgICAgICAgdGhpcy5yZWNydWl0ZXJSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUodXBkYXRlZFF1ZXJ5MSwgcGFyYW0yLCB1cGRhdGVkUXVlcnk0LCAoZXJyLCByZWNvcmQpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChyZWNvcmQpIHtcclxuICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVjb3JkKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIGxldCBlcnJvcjogYW55O1xyXG4gICAgICAgICAgICAgICAgICBpZiAocmVjb3JkID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoJ1VuYWJsZSB0byBhZGQgY2FuZGlkYXRlLicpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcblxyXG4gIGFwcGx5Sm9iKGl0ZW06IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG5cclxuXHJcbiAgICB0aGlzLmNhbmRpZGF0ZVJlcG9zaXRvcnkucmV0cmlldmUoeydfaWQnOiBuZXcgbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQoaXRlbS5jYW5kaWRhdGVJZCl9LCAoZXJyb3IsIHJlc3BvbnNlKSA9PiB7XHJcblxyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoJ05vIGNhbmRpZGF0ZSBGb3VuZCcpLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAocmVzcG9uc2UubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgbGV0IHVwZGF0ZUV4aXN0aW5nUXVlcnlGb3JDYW5kaWRhdGU6IGFueTtcclxuICAgICAgICAgIGxldCBpc0pvYkZvdW5kOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgICBmb3IgKGxldCBsaXN0IG9mIHJlc3BvbnNlWzBdLmpvYl9saXN0KSB7XHJcbiAgICAgICAgICAgIGlmIChsaXN0Lm5hbWUgPT0gaXRlbS5saXN0TmFtZSkge1xyXG4gICAgICAgICAgICAgIGlzSm9iRm91bmQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgIGlmIChpdGVtLmFjdGlvbiA9PSAnYWRkJykge1xyXG4gICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gbGlzdC5pZHMuaW5kZXhPZihpdGVtLnByb2ZpbGVJZCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgbGV0IHVzZXNfZGF0YSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBjYW5kaWRhdGVJZDogaXRlbS5jYW5kaWRhdGVJZCxcclxuICAgICAgICAgICAgICAgICAgICBqb2JQcm9maWxlSWQ6IGl0ZW0ucHJvZmlsZUlkLFxyXG4gICAgICAgICAgICAgICAgICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKSxcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb246IEFjdGlvbnMuREVGQVVMVF9WQUxVRVxyXG4gICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICBsZXQgc2hhcmVkU2VydmljZTogU2hhcmVkU2VydmljZSA9IG5ldyBTaGFyZWRTZXJ2aWNlKCk7XHJcbiAgICAgICAgICAgICAgICAgIHVzZXNfZGF0YS5hY3Rpb24gPSBzaGFyZWRTZXJ2aWNlLmNvbnN0cnVjdEFkZEFjdGlvbkRhdGEoaXRlbS5saXN0TmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgIHRoaXMudXNlc1RyYWNraW5nQ29udHJvbGxlci5jcmVhdGUodXNlc19kYXRhKTtcclxuICAgICAgICAgICAgICAgICAgbGlzdC5pZHMucHVzaChpdGVtLnByb2ZpbGVJZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChpdGVtLmFjdGlvbiA9PSAncmVtb3ZlJyAmJiBpdGVtLmxpc3ROYW1lICE9ICdhcHBsaWVkJykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHVzZXNfZGF0YSA9IHtcclxuICAgICAgICAgICAgICAgICAgY2FuZGlkYXRlSWQ6IGl0ZW0uY2FuZGlkYXRlSWQsXHJcbiAgICAgICAgICAgICAgICAgIGpvYlByb2ZpbGVJZDogaXRlbS5wcm9maWxlSWQsXHJcbiAgICAgICAgICAgICAgICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKSxcclxuICAgICAgICAgICAgICAgICAgYWN0aW9uOiBBY3Rpb25zLkRFRkFVTFRfVkFMVUVcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBsZXQgc2hhcmVkU2VydmljZTogU2hhcmVkU2VydmljZSA9IG5ldyBTaGFyZWRTZXJ2aWNlKCk7XHJcbiAgICAgICAgICAgICAgICB1c2VzX2RhdGEuYWN0aW9uID0gc2hhcmVkU2VydmljZS5jb25zdHJ1Y3RSZW1vdmVBY3Rpb25EYXRhKGl0ZW0ubGlzdE5hbWUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy51c2VzVHJhY2tpbmdDb250cm9sbGVyLmNyZWF0ZSh1c2VzX2RhdGEpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gbGlzdC5pZHMuaW5kZXhPZihpdGVtLnByb2ZpbGVJZCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgIGxpc3QuaWRzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIHVwZGF0ZUV4aXN0aW5nUXVlcnlGb3JDYW5kaWRhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICAkc2V0OiB7XHJcbiAgICAgICAgICAgICAgICAgICdqb2JfbGlzdCc6IHJlc3BvbnNlWzBdLmpvYl9saXN0XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgbGV0IG5ld0VudHJ5UXVlcnlGb3JDYW5kaWRhdGUgPSB7XHJcbiAgICAgICAgICAgICRwdXNoOiB7XHJcbiAgICAgICAgICAgICAgJ2pvYl9saXN0Jzoge1xyXG4gICAgICAgICAgICAgICAgJ25hbWUnOiBpdGVtLmxpc3ROYW1lLFxyXG4gICAgICAgICAgICAgICAgJ2lkcyc6IGl0ZW0ucHJvZmlsZUlkXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgICAgbGV0IG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICduZXcnOiB0cnVlLCAndXBzZXJ0JzogdHJ1ZVxyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIGxldCBsYXRlc3RRdWVyeUZvckNhbmRpZGF0ZTogYW55O1xyXG4gICAgICAgICAgaXNKb2JGb3VuZCA/IGxhdGVzdFF1ZXJ5Rm9yQ2FuZGlkYXRlID0gdXBkYXRlRXhpc3RpbmdRdWVyeUZvckNhbmRpZGF0ZSA6IGxhdGVzdFF1ZXJ5Rm9yQ2FuZGlkYXRlID0gbmV3RW50cnlRdWVyeUZvckNhbmRpZGF0ZTtcclxuICAgICAgICAgIGxldCBjYW5kaWRhdGVTZWFyY2hRdWVyeSA9IHtcclxuICAgICAgICAgICAgJ19pZCc6IGl0ZW0uY2FuZGlkYXRlSWRcclxuICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgdGhpcy5jYW5kaWRhdGVSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUoY2FuZGlkYXRlU2VhcmNoUXVlcnksIGxhdGVzdFF1ZXJ5Rm9yQ2FuZGlkYXRlLCBvcHRpb25zLCAoZXJyLCByZWNvcmQpID0+IHtcclxuICAgICAgICAgICAgaWYgKHJlY29yZCkge1xyXG4gICAgICAgICAgICAgIGlmIChpdGVtLmxpc3ROYW1lID09ICdhcHBsaWVkJyAmJiBpdGVtLmFjdGlvbiA9PSAnYWRkJykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHF1ZXJ5ID0ge1xyXG4gICAgICAgICAgICAgICAgICAncG9zdGVkSm9icyc6IHskZWxlbU1hdGNoOiB7J19pZCc6IG5ldyBtb25nb29zZS5UeXBlcy5PYmplY3RJZChpdGVtLnByb2ZpbGVJZCl9fVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGxldCBuZXdFbnRyeVF1ZXJ5ID0ge1xyXG4gICAgICAgICAgICAgICAgICAkcHVzaDoge1xyXG4gICAgICAgICAgICAgICAgICAgICdwb3N0ZWRKb2JzLiQuY2FuZGlkYXRlX2xpc3QnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAnbmFtZSc6IENvbnN0VmFyaWFibGVzLkFQUExJRURfQ0FORElEQVRFLFxyXG4gICAgICAgICAgICAgICAgICAgICAgJ2lkcyc6IGl0ZW0uY2FuZGlkYXRlSWRcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBsZXQgdXBkYXRlRXhpc3RpbmdRdWVyeTogYW55O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZWNydWl0ZXJSZXBvc2l0b3J5LnJldHJpZXZlKHF1ZXJ5LCAoZXJyLCByZXMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcignTm90IEZvdW5kIEFueSBKb2IgcG9zdGVkJyksIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpc0ZvdW5kOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBqb2Igb2YgcmVzWzBdLnBvc3RlZEpvYnMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGpvYi5faWQudG9TdHJpbmcoKSA9PT0gaXRlbS5wcm9maWxlSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBsaXN0IG9mIGpvYi5jYW5kaWRhdGVfbGlzdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxpc3QubmFtZSA9PSBDb25zdFZhcmlhYmxlcy5BUFBMSUVEX0NBTkRJREFURSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0ZvdW5kID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gbGlzdC5pZHMuaW5kZXhPZihpdGVtLmNhbmRpZGF0ZUlkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdC5pZHMucHVzaChpdGVtLmNhbmRpZGF0ZUlkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVFeGlzdGluZ1F1ZXJ5ID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzZXQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdwb3N0ZWRKb2JzLiQuY2FuZGlkYXRlX2xpc3QnOiBqb2IuY2FuZGlkYXRlX2xpc3RcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgbGV0IGxhdGVzdFF1ZXJ5OiBhbnk7XHJcbiAgICAgICAgICAgICAgICAgICAgICBpc0ZvdW5kID8gbGF0ZXN0UXVlcnkgPSB1cGRhdGVFeGlzdGluZ1F1ZXJ5IDogbGF0ZXN0UXVlcnkgPSBuZXdFbnRyeVF1ZXJ5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgbGV0IHJlY3J1aXRlclNlYXJjaFF1ZXJ5ID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnX2lkJzogcmVzWzBdLl9pZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ3Bvc3RlZEpvYnMuX2lkJzogaXRlbS5wcm9maWxlSWRcclxuICAgICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWNydWl0ZXJSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocmVjcnVpdGVyU2VhcmNoUXVlcnksIGxhdGVzdFF1ZXJ5LCBvcHRpb25zLCAoZXJyLCByZWNvcmQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlY29yZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJlY29yZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGVycm9yOiBhbnk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlY29yZCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoJ1VuYWJsZSB0byBhZGQgY2FuZGlkYXRlLicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJlY29yZCk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGxldCBlcnJvcjogYW55O1xyXG4gICAgICAgICAgICAgIGlmIChyZWNvcmQgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGVycm9yID0gbmV3IEVycm9yKCdVbmFibGUgdG8gYWRkIEpvYiB0byBMaXN0LicpO1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcblxyXG4gIH1cclxuXHJcbiAgZ2V0UUNhcmREZXRhaWxzKGl0ZW06IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbGV0IGNhbmRpZGF0ZURldGFpbHM6IGFueTtcclxuXHJcbiAgICB0aGlzLmNhbmRpZGF0ZVJlcG9zaXRvcnkucmV0cmlldmVCeU11bHRpSWRzKGl0ZW0uY2FuZGlkYXRlSWRzLCB7fSwgKGVyciwgY2FuZGlkYXRlRGV0YWlsc1JlcykgPT4ge1xyXG4gICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjYW5kaWRhdGVEZXRhaWxzID0gY2FuZGlkYXRlRGV0YWlsc1JlcztcclxuICAgICAgICBsZXQgcXVlcnkgPSB7XHJcbiAgICAgICAgICAncG9zdGVkSm9icyc6IHskZWxlbU1hdGNoOiB7J19pZCc6IG5ldyBtb25nb29zZS5UeXBlcy5PYmplY3RJZChpdGVtLmpvYklkKX19XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnJlY3J1aXRlclJlcG9zaXRvcnkucmV0cmlldmUocXVlcnksIChlcnIsIHJlcykgPT4ge1xyXG4gICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoJ05vdCBGb3VuZCBBbnkgSm9iIHBvc3RlZCcpLCBudWxsKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAocmVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICBsZXQgcmVjcnVpdGVyOiBSZWNydWl0ZXIgPSBuZXcgUmVjcnVpdGVyKCk7XHJcbiAgICAgICAgICAgICAgcmVjcnVpdGVyID0gcmVzWzBdO1xyXG4gICAgICAgICAgICAgIGZvciAobGV0IGpvYiBvZiByZXNbMF0ucG9zdGVkSm9icykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGpvYi5faWQudG9TdHJpbmcoKSA9PT0gaXRlbS5qb2JJZCkge1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLmNhbmRpZGF0ZVJlcG9zaXRvcnkuZ2V0Q2FuZGlkYXRlUUNhcmQoY2FuZGlkYXRlRGV0YWlscywgam9iLCB1bmRlZmluZWQsIGNhbGxiYWNrKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuXHJcbn1cclxuXHJcbk9iamVjdC5zZWFsKEpvYlByb2ZpbGVTZXJ2aWNlKTtcclxuZXhwb3J0ID0gSm9iUHJvZmlsZVNlcnZpY2U7XHJcbiJdfQ==
