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
                        var new_capability_matrix = candidateService.getCapabilityValueKeyMatrixBuild(res.postedJobs[0].capability_matrix, industries, res.postedJobs[0].complexity_musthave_matrix);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2VydmljZXMvam9icHJvZmlsZS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxtQ0FBcUM7QUFDckMsbUZBQW9FO0FBQ3BFLDZEQUFrRTtBQUNsRSxvRUFBZ0U7QUFDaEUscURBQXdEO0FBQ3hELG1GQUFzRjtBQUN0RixzRkFBeUY7QUFDekYsbUZBQXNGO0FBRXRGLGlGQUFvRjtBQUVwRixpRkFBb0Y7QUFDcEYsc0RBQXlEO0FBQ3pELElBQUksWUFBWSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUc1QztJQVNFO1FBQ0UsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksb0JBQW9CLEVBQUUsQ0FBQztRQUN2RCxJQUFJLENBQUMseUJBQXlCLEdBQUcsSUFBSSx5QkFBeUIsRUFBRSxDQUFDO1FBQ2pFLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLG1CQUFtQixFQUFFLENBQUM7UUFDckQsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksa0JBQWtCLEVBQUUsQ0FBQztRQUNuRCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxtQkFBbUIsRUFBRSxDQUFDO1FBQ3JELElBQUksQ0FBQyxRQUFRLEdBQUcsWUFBWSxDQUFDLFFBQVEsQ0FBQztRQUN0QyxJQUFJLEdBQUcsR0FBUSxJQUFJLFlBQVksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUMvQyxJQUFJLENBQUMsc0JBQXNCLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQztJQUNoRCxDQUFDO0lBRUQsa0NBQU0sR0FBTixVQUFPLElBQVMsRUFBRSxRQUEyQztRQUMzRCxJQUFJLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxVQUFDLEdBQUcsRUFBRSxHQUFHO1lBQzlDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsUUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FB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dGVudCI6WyJpbXBvcnQgKiBhcyBtb25nb29zZSBmcm9tIFwibW9uZ29vc2VcIjtcclxuaW1wb3J0IHtSZWNydWl0ZXJ9IGZyb20gXCIuLi9kYXRhYWNjZXNzL21vZGVsL3JlY3J1aXRlci1maW5hbC5tb2RlbFwiO1xyXG5pbXBvcnQge0FjdGlvbnMsIENvbnN0VmFyaWFibGVzfSBmcm9tIFwiLi4vc2hhcmVkL3NoYXJlZGNvbnN0YW50c1wiO1xyXG5pbXBvcnQge1NoYXJlZFNlcnZpY2V9IGZyb20gXCIuLi9zaGFyZWQvc2VydmljZXMvc2hhcmVkLXNlcnZpY2VcIjtcclxuaW1wb3J0IFByb2plY3RBc3NldCA9IHJlcXVpcmUoJy4uL3NoYXJlZC9wcm9qZWN0YXNzZXQnKTtcclxuaW1wb3J0IFJlY3J1aXRlclJlcG9zaXRvcnkgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL3JlcG9zaXRvcnkvcmVjcnVpdGVyLnJlcG9zaXRvcnknKTtcclxuaW1wb3J0IEpvYlByb2ZpbGVSZXBvc2l0b3J5ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L2pvYi1wcm9maWxlLnJlcG9zaXRvcnknKTtcclxuaW1wb3J0IENhbmRpZGF0ZVJlcG9zaXRvcnkgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL3JlcG9zaXRvcnkvY2FuZGlkYXRlLnJlcG9zaXRvcnknKTtcclxuaW1wb3J0IEpvYlByb2ZpbGVNb2RlbCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvam9icHJvZmlsZS5tb2RlbCcpO1xyXG5pbXBvcnQgQ2FuZGlkYXRlU2VhcmNoUmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL3NlYXJjaC9jYW5kaWRhdGUtc2VhcmNoLnJlcG9zaXRvcnknKTtcclxuaW1wb3J0IEluZHVzdHJ5TW9kZWwgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL2luZHVzdHJ5Lm1vZGVsJyk7XHJcbmltcG9ydCBJbmR1c3RyeVJlcG9zaXRvcnkgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL3JlcG9zaXRvcnkvaW5kdXN0cnkucmVwb3NpdG9yeScpO1xyXG5pbXBvcnQgQ2FuZGlkYXRlU2VydmljZSA9IHJlcXVpcmUoJy4vY2FuZGlkYXRlLnNlcnZpY2UnKTtcclxubGV0IHVzZXN0cmFja2luZyA9IHJlcXVpcmUoJ3VzZXMtdHJhY2tpbmcnKTtcclxuXHJcblxyXG5jbGFzcyBKb2JQcm9maWxlU2VydmljZSB7XHJcbiAgcHJpdmF0ZSBqb2Jwcm9maWxlUmVwb3NpdG9yeTogSm9iUHJvZmlsZVJlcG9zaXRvcnk7XHJcbiAgcHJpdmF0ZSBjYW5kaWRhdGVTZWFyY2hSZXBvc2l0b3J5OiBDYW5kaWRhdGVTZWFyY2hSZXBvc2l0b3J5O1xyXG4gIHByaXZhdGUgaW5kdXN0cnlSZXBvc2l0b3J5OiBJbmR1c3RyeVJlcG9zaXRvcnk7XHJcbiAgcHJpdmF0ZSByZWNydWl0ZXJSZXBvc2l0b3J5OiBSZWNydWl0ZXJSZXBvc2l0b3J5O1xyXG4gIHByaXZhdGUgY2FuZGlkYXRlUmVwb3NpdG9yeTogQ2FuZGlkYXRlUmVwb3NpdG9yeTtcclxuICBwcml2YXRlIEFQUF9OQU1FOiBzdHJpbmc7XHJcbiAgcHJpdmF0ZSB1c2VzVHJhY2tpbmdDb250cm9sbGVyOiBhbnk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5qb2Jwcm9maWxlUmVwb3NpdG9yeSA9IG5ldyBKb2JQcm9maWxlUmVwb3NpdG9yeSgpO1xyXG4gICAgdGhpcy5jYW5kaWRhdGVTZWFyY2hSZXBvc2l0b3J5ID0gbmV3IENhbmRpZGF0ZVNlYXJjaFJlcG9zaXRvcnkoKTtcclxuICAgIHRoaXMucmVjcnVpdGVyUmVwb3NpdG9yeSA9IG5ldyBSZWNydWl0ZXJSZXBvc2l0b3J5KCk7XHJcbiAgICB0aGlzLmluZHVzdHJ5UmVwb3NpdG9yeSA9IG5ldyBJbmR1c3RyeVJlcG9zaXRvcnkoKTtcclxuICAgIHRoaXMuY2FuZGlkYXRlUmVwb3NpdG9yeSA9IG5ldyBDYW5kaWRhdGVSZXBvc2l0b3J5KCk7XHJcbiAgICB0aGlzLkFQUF9OQU1FID0gUHJvamVjdEFzc2V0LkFQUF9OQU1FO1xyXG4gICAgbGV0IG9iajogYW55ID0gbmV3IHVzZXN0cmFja2luZy5NeUNvbnRyb2xsZXIoKTtcclxuICAgIHRoaXMudXNlc1RyYWNraW5nQ29udHJvbGxlciA9IG9iai5fY29udHJvbGxlcjtcclxuICB9XHJcblxyXG4gIGNyZWF0ZShpdGVtOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIHRoaXMuam9icHJvZmlsZVJlcG9zaXRvcnkuY3JlYXRlKGl0ZW0sIChlcnIsIHJlcykgPT4ge1xyXG4gICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKGVyciksIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHJlcyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc2VhcmNoQ2FuZGlkYXRlc0J5Sm9iUHJvZmlsZShqb2JQcm9maWxlOiBKb2JQcm9maWxlTW9kZWwsIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuXHJcbiAgICB0aGlzLmNhbmRpZGF0ZVNlYXJjaFJlcG9zaXRvcnkuZ2V0Q2FuZGlkYXRlQnlJbmR1c3RyeShqb2JQcm9maWxlLCAoZXJyLCByZXMpID0+IHtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihlcnIpLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCByZXMpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJldHJpZXZlKGRhdGE6IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbGV0IHF1ZXJ5ID0ge1xyXG4gICAgICAncG9zdGVkSm9icyc6IHskZWxlbU1hdGNoOiB7J19pZCc6IG5ldyBtb25nb29zZS5UeXBlcy5PYmplY3RJZChkYXRhLnBvc3RlZEpvYil9fVxyXG4gICAgfTtcclxuICAgIHRoaXMucmVjcnVpdGVyUmVwb3NpdG9yeS5yZXRyaWV2ZShxdWVyeSwgKGVyciwgcmVzKSA9PiB7XHJcbiAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoJ05vdCBGb3VuZCBBbnkgSm9iIHBvc3RlZCcpLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAocmVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIGxldCByZWNydWl0ZXI6IFJlY3J1aXRlciA9IG5ldyBSZWNydWl0ZXIoKTtcclxuICAgICAgICAgIHJlY3J1aXRlciA9IHJlc1swXTtcclxuICAgICAgICAgIGZvciAobGV0IGpvYiBvZiByZXNbMF0ucG9zdGVkSm9icykge1xyXG4gICAgICAgICAgICBpZiAoam9iLl9pZC50b1N0cmluZygpID09PSBkYXRhLnBvc3RlZEpvYikge1xyXG4gICAgICAgICAgICAgIHJlY3J1aXRlci5wb3N0ZWRKb2JzID0gbmV3IEFycmF5KDApO1xyXG4gICAgICAgICAgICAgIHJlY3J1aXRlci5wb3N0ZWRKb2JzLnB1c2goam9iKTtcclxuICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCByZWNydWl0ZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldENhcGFiaWxpdHlWYWx1ZUtleU1hdHJpeChfaWQ6IHN0cmluZywgIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxldCBkYXRhOiBhbnkgPSB7XHJcbiAgICAgICdwb3N0ZWRKb2InOiBfaWRcclxuICAgIH07XHJcbiAgICB0aGlzLnJldHJpZXZlKGRhdGEsIChlcnI6IGFueSwgcmVzOlJlY3J1aXRlcikgPT4ge1xyXG4gICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyLCByZXMpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuaW5kdXN0cnlSZXBvc2l0b3J5LnJldHJpZXZlKHsnbmFtZSc6IHJlcy5wb3N0ZWRKb2JzWzBdLmluZHVzdHJ5Lm5hbWV9LCAoZXJyb3I6IGFueSwgaW5kdXN0cmllczogSW5kdXN0cnlNb2RlbFtdKSA9PiB7XHJcbiAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgcmVzKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBjYW5kaWRhdGVTZXJ2aWNlOiBhbnkgPSBuZXcgQ2FuZGlkYXRlU2VydmljZSgpO1xyXG4gICAgICAgICAgICBsZXQgbmV3X2NhcGFiaWxpdHlfbWF0cml4OiBhbnkgPSAgY2FuZGlkYXRlU2VydmljZS5nZXRDYXBhYmlsaXR5VmFsdWVLZXlNYXRyaXhCdWlsZChyZXMucG9zdGVkSm9ic1swXS5jYXBhYmlsaXR5X21hdHJpeCwgaW5kdXN0cmllcywgcmVzLnBvc3RlZEpvYnNbMF0uY29tcGxleGl0eV9tdXN0aGF2ZV9tYXRyaXgpO1xyXG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCBuZXdfY2FwYWJpbGl0eV9tYXRyaXgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZShpdGVtOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuXHJcbiAgICBsZXQgcXVlcnkgPSB7XHJcbiAgICAgICdwb3N0ZWRKb2JzJzogeyRlbGVtTWF0Y2g6IHsnX2lkJzogbmV3IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkKGl0ZW0ucHJvZmlsZUlkKX19XHJcbiAgICB9O1xyXG5cclxuICAgIGxldCB1cGRhdGVGbGFnID0gZmFsc2U7XHJcblxyXG4gICAgbGV0IHVwZGF0ZWRRdWVyeTEgPSB7XHJcbiAgICAgICdfaWQnOiBpdGVtLnJlY3J1aXRlcklkLFxyXG4gICAgICAncG9zdGVkSm9icy5faWQnOiBpdGVtLnByb2ZpbGVJZFxyXG4gICAgfTtcclxuXHJcbiAgICBsZXQgdXBkYXRlZFF1ZXJ5MiA9IHtcclxuICAgICAgJHB1c2g6IHtcclxuICAgICAgICAncG9zdGVkSm9icy4kLmNhbmRpZGF0ZV9saXN0Jzoge1xyXG4gICAgICAgICAgJ25hbWUnOiBpdGVtLmxpc3ROYW1lLFxyXG4gICAgICAgICAgJ2lkcyc6IGl0ZW0uY2FuZGlkYXRlSWRcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgbGV0IHVwZGF0ZWRRdWVyeTM6IGFueTtcclxuXHJcbiAgICBsZXQgdXBkYXRlZFF1ZXJ5NCA9IHtcclxuICAgICAgJ25ldyc6IHRydWUsICd1cHNlcnQnOiB0cnVlXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMucmVjcnVpdGVyUmVwb3NpdG9yeS5yZXRyaWV2ZShxdWVyeSwgKGVyciwgcmVzKSA9PiB7XHJcbiAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoJ05vdCBGb3VuZCBBbnkgSm9iIHBvc3RlZCcpLCBudWxsKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICBpZiAocmVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIGZvciAobGV0IGpvYiBvZiByZXNbMF0ucG9zdGVkSm9icykge1xyXG4gICAgICAgICAgICBpZiAoam9iLl9pZC50b1N0cmluZygpID09PSBpdGVtLnByb2ZpbGVJZCkge1xyXG5cclxuICAgICAgICAgICAgICBmb3IgKGxldCBsaXN0IG9mIGpvYi5jYW5kaWRhdGVfbGlzdCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGxpc3QubmFtZSA9PSBpdGVtLmxpc3ROYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgIHVwZGF0ZUZsYWcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICBpZiAoaXRlbS5hY3Rpb24gPT0gJ2FkZCcpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgdXNlc19kYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgcmVjcnVpdGVySWQ6IHJlc1swXS5faWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICBjYW5kaWRhdGVJZDogaXRlbS5jYW5kaWRhdGVJZCxcclxuICAgICAgICAgICAgICAgICAgICAgIGpvYlByb2ZpbGVJZDogam9iLl9pZCxcclxuICAgICAgICAgICAgICAgICAgICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKSxcclxuICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbjogQWN0aW9ucy5ERUZBVUxUX1ZBTFVFXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc2hhcmVkU2VydmljZTpTaGFyZWRTZXJ2aWNlID0gbmV3IFNoYXJlZFNlcnZpY2UoKTtcclxuICAgICAgICAgICAgICAgICAgICB1c2VzX2RhdGEuYWN0aW9uID0gc2hhcmVkU2VydmljZS5jb25zdHJ1Y3RBZGRBY3Rpb25EYXRhKGl0ZW0ubGlzdE5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXNlc1RyYWNraW5nQ29udHJvbGxlci5jcmVhdGUodXNlc19kYXRhKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpc3QubmFtZSA9PSBDb25zdFZhcmlhYmxlcy5SRUpFQ1RFRF9MSVNURURfQ0FORElEQVRFKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBfbGlzdCBvZiBqb2IuY2FuZGlkYXRlX2xpc3QpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF9saXN0Lm5hbWUgPT0gQ29uc3RWYXJpYWJsZXMuQ0FSVF9MSVNURURfQ0FORElEQVRFKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gX2xpc3QuaWRzLmluZGV4T2YoaXRlbS5jYW5kaWRhdGVJZCk7ICAgIC8vIDwtLSBOb3Qgc3VwcG9ydGVkIGluIDxJRTlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfbGlzdC5pZHMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gbGlzdC5pZHMuaW5kZXhPZihpdGVtLmNhbmRpZGF0ZUlkKTsgICAgLy8gPC0tIE5vdCBzdXBwb3J0ZWQgaW4gPElFOVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgbGlzdC5pZHMucHVzaChpdGVtLmNhbmRpZGF0ZUlkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB1c2VzX2RhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICByZWNydWl0ZXJJZDogcmVzWzBdLl9pZCxcclxuICAgICAgICAgICAgICAgICAgICAgIGNhbmRpZGF0ZUlkOiBpdGVtLmNhbmRpZGF0ZUlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgam9iUHJvZmlsZUlkOiBqb2IuX2lkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgdGltZXN0YW1wOiBuZXcgRGF0ZSgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiBBY3Rpb25zLkRFRkFVTFRfVkFMVUVcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzaGFyZWRTZXJ2aWNlOiBTaGFyZWRTZXJ2aWNlID0gbmV3IFNoYXJlZFNlcnZpY2UoKTtcclxuICAgICAgICAgICAgICAgICAgICB1c2VzX2RhdGEuYWN0aW9uID0gc2hhcmVkU2VydmljZS5jb25zdHJ1Y3RSZW1vdmVBY3Rpb25EYXRhKGl0ZW0ubGlzdE5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXNlc1RyYWNraW5nQ29udHJvbGxlci5jcmVhdGUodXNlc19kYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSBsaXN0Lmlkcy5pbmRleE9mKGl0ZW0uY2FuZGlkYXRlSWQpOyAgICAvLyA8LS0gTm90IHN1cHBvcnRlZCBpbiA8SUU5XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgbGlzdC5pZHMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgdXBkYXRlZFF1ZXJ5MyA9IHtcclxuICAgICAgICAgICAgICAgICAgICAkc2V0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAncG9zdGVkSm9icy4kLmNhbmRpZGF0ZV9saXN0Jzogam9iLmNhbmRpZGF0ZV9saXN0XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIGxldCBwYXJhbTI6IGFueTtcclxuICAgICAgICAgICAgICB1cGRhdGVGbGFnID8gcGFyYW0yID0gdXBkYXRlZFF1ZXJ5MyA6IHBhcmFtMiA9IHVwZGF0ZWRRdWVyeTI7XHJcblxyXG4gICAgICAgICAgICAgIHRoaXMucmVjcnVpdGVyUmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHVwZGF0ZWRRdWVyeTEsIHBhcmFtMiwgdXBkYXRlZFF1ZXJ5NCwgKGVyciwgcmVjb3JkKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVjb3JkKSB7XHJcbiAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJlY29yZCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICBsZXQgZXJyb3I6IGFueTtcclxuICAgICAgICAgICAgICAgICAgaWYgKHJlY29yZCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGVycm9yID0gbmV3IEVycm9yKCdVbmFibGUgdG8gYWRkIGNhbmRpZGF0ZS4nKTtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG5cclxuICBhcHBseUpvYihpdGVtOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuXHJcblxyXG4gICAgdGhpcy5jYW5kaWRhdGVSZXBvc2l0b3J5LnJldHJpZXZlKHsnX2lkJzogbmV3IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkKGl0ZW0uY2FuZGlkYXRlSWQpfSwgKGVycm9yLCByZXNwb25zZSkgPT4ge1xyXG5cclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKCdObyBjYW5kaWRhdGUgRm91bmQnKSwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHJlc3BvbnNlLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIGxldCB1cGRhdGVFeGlzdGluZ1F1ZXJ5Rm9yQ2FuZGlkYXRlOiBhbnk7XHJcbiAgICAgICAgICBsZXQgaXNKb2JGb3VuZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgICAgZm9yIChsZXQgbGlzdCBvZiByZXNwb25zZVswXS5qb2JfbGlzdCkge1xyXG4gICAgICAgICAgICBpZiAobGlzdC5uYW1lID09IGl0ZW0ubGlzdE5hbWUpIHtcclxuICAgICAgICAgICAgICBpc0pvYkZvdW5kID0gdHJ1ZTtcclxuICAgICAgICAgICAgICBpZiAoaXRlbS5hY3Rpb24gPT0gJ2FkZCcpIHtcclxuICAgICAgICAgICAgICAgIGxldCBpbmRleCA9IGxpc3QuaWRzLmluZGV4T2YoaXRlbS5wcm9maWxlSWQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgIGxldCB1c2VzX2RhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FuZGlkYXRlSWQ6IGl0ZW0uY2FuZGlkYXRlSWQsXHJcbiAgICAgICAgICAgICAgICAgICAgam9iUHJvZmlsZUlkOiBpdGVtLnByb2ZpbGVJZCxcclxuICAgICAgICAgICAgICAgICAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCksXHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiBBY3Rpb25zLkRFRkFVTFRfVkFMVUVcclxuICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgbGV0IHNoYXJlZFNlcnZpY2U6IFNoYXJlZFNlcnZpY2UgPSBuZXcgU2hhcmVkU2VydmljZSgpO1xyXG4gICAgICAgICAgICAgICAgICB1c2VzX2RhdGEuYWN0aW9uID0gc2hhcmVkU2VydmljZS5jb25zdHJ1Y3RBZGRBY3Rpb25EYXRhKGl0ZW0ubGlzdE5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLnVzZXNUcmFja2luZ0NvbnRyb2xsZXIuY3JlYXRlKHVzZXNfZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgIGxpc3QuaWRzLnB1c2goaXRlbS5wcm9maWxlSWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbS5hY3Rpb24gPT0gJ3JlbW92ZScgJiYgaXRlbS5saXN0TmFtZSAhPSAnYXBwbGllZCcpIHtcclxuICAgICAgICAgICAgICAgIGxldCB1c2VzX2RhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICAgIGNhbmRpZGF0ZUlkOiBpdGVtLmNhbmRpZGF0ZUlkLFxyXG4gICAgICAgICAgICAgICAgICBqb2JQcm9maWxlSWQ6IGl0ZW0ucHJvZmlsZUlkLFxyXG4gICAgICAgICAgICAgICAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCksXHJcbiAgICAgICAgICAgICAgICAgIGFjdGlvbjogQWN0aW9ucy5ERUZBVUxUX1ZBTFVFXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgbGV0IHNoYXJlZFNlcnZpY2U6IFNoYXJlZFNlcnZpY2UgPSBuZXcgU2hhcmVkU2VydmljZSgpO1xyXG4gICAgICAgICAgICAgICAgdXNlc19kYXRhLmFjdGlvbiA9IHNoYXJlZFNlcnZpY2UuY29uc3RydWN0UmVtb3ZlQWN0aW9uRGF0YShpdGVtLmxpc3ROYW1lKTtcclxuICAgICAgICAgICAgICAgIHRoaXMudXNlc1RyYWNraW5nQ29udHJvbGxlci5jcmVhdGUodXNlc19kYXRhKTtcclxuICAgICAgICAgICAgICAgIGxldCBpbmRleCA9IGxpc3QuaWRzLmluZGV4T2YoaXRlbS5wcm9maWxlSWQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICBsaXN0Lmlkcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB1cGRhdGVFeGlzdGluZ1F1ZXJ5Rm9yQ2FuZGlkYXRlID0ge1xyXG4gICAgICAgICAgICAgICAgJHNldDoge1xyXG4gICAgICAgICAgICAgICAgICAnam9iX2xpc3QnOiByZXNwb25zZVswXS5qb2JfbGlzdFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGxldCBuZXdFbnRyeVF1ZXJ5Rm9yQ2FuZGlkYXRlID0ge1xyXG4gICAgICAgICAgICAkcHVzaDoge1xyXG4gICAgICAgICAgICAgICdqb2JfbGlzdCc6IHtcclxuICAgICAgICAgICAgICAgICduYW1lJzogaXRlbS5saXN0TmFtZSxcclxuICAgICAgICAgICAgICAgICdpZHMnOiBpdGVtLnByb2ZpbGVJZFxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIGxldCBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICAnbmV3JzogdHJ1ZSwgJ3Vwc2VydCc6IHRydWVcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgICBsZXQgbGF0ZXN0UXVlcnlGb3JDYW5kaWRhdGU6IGFueTtcclxuICAgICAgICAgIGlzSm9iRm91bmQgPyBsYXRlc3RRdWVyeUZvckNhbmRpZGF0ZSA9IHVwZGF0ZUV4aXN0aW5nUXVlcnlGb3JDYW5kaWRhdGUgOiBsYXRlc3RRdWVyeUZvckNhbmRpZGF0ZSA9IG5ld0VudHJ5UXVlcnlGb3JDYW5kaWRhdGU7XHJcbiAgICAgICAgICBsZXQgY2FuZGlkYXRlU2VhcmNoUXVlcnkgPSB7XHJcbiAgICAgICAgICAgICdfaWQnOiBpdGVtLmNhbmRpZGF0ZUlkXHJcbiAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgIHRoaXMuY2FuZGlkYXRlUmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKGNhbmRpZGF0ZVNlYXJjaFF1ZXJ5LCBsYXRlc3RRdWVyeUZvckNhbmRpZGF0ZSwgb3B0aW9ucywgKGVyciwgcmVjb3JkKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChyZWNvcmQpIHtcclxuICAgICAgICAgICAgICBpZiAoaXRlbS5saXN0TmFtZSA9PSAnYXBwbGllZCcgJiYgaXRlbS5hY3Rpb24gPT0gJ2FkZCcpIHtcclxuICAgICAgICAgICAgICAgIGxldCBxdWVyeSA9IHtcclxuICAgICAgICAgICAgICAgICAgJ3Bvc3RlZEpvYnMnOiB7JGVsZW1NYXRjaDogeydfaWQnOiBuZXcgbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQoaXRlbS5wcm9maWxlSWQpfX1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBsZXQgbmV3RW50cnlRdWVyeSA9IHtcclxuICAgICAgICAgICAgICAgICAgJHB1c2g6IHtcclxuICAgICAgICAgICAgICAgICAgICAncG9zdGVkSm9icy4kLmNhbmRpZGF0ZV9saXN0Jzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgJ25hbWUnOiBDb25zdFZhcmlhYmxlcy5BUFBMSUVEX0NBTkRJREFURSxcclxuICAgICAgICAgICAgICAgICAgICAgICdpZHMnOiBpdGVtLmNhbmRpZGF0ZUlkXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgbGV0IHVwZGF0ZUV4aXN0aW5nUXVlcnk6IGFueTtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVjcnVpdGVyUmVwb3NpdG9yeS5yZXRyaWV2ZShxdWVyeSwgKGVyciwgcmVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoJ05vdCBGb3VuZCBBbnkgSm9iIHBvc3RlZCcpLCBudWxsKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaXNGb3VuZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgam9iIG9mIHJlc1swXS5wb3N0ZWRKb2JzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChqb2IuX2lkLnRvU3RyaW5nKCkgPT09IGl0ZW0ucHJvZmlsZUlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgbGlzdCBvZiBqb2IuY2FuZGlkYXRlX2xpc3QpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsaXN0Lm5hbWUgPT0gQ29uc3RWYXJpYWJsZXMuQVBQTElFRF9DQU5ESURBVEUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNGb3VuZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpbmRleCA9IGxpc3QuaWRzLmluZGV4T2YoaXRlbS5jYW5kaWRhdGVJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3QuaWRzLnB1c2goaXRlbS5jYW5kaWRhdGVJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlRXhpc3RpbmdRdWVyeSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2V0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAncG9zdGVkSm9icy4kLmNhbmRpZGF0ZV9saXN0Jzogam9iLmNhbmRpZGF0ZV9saXN0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgIGxldCBsYXRlc3RRdWVyeTogYW55O1xyXG4gICAgICAgICAgICAgICAgICAgICAgaXNGb3VuZCA/IGxhdGVzdFF1ZXJ5ID0gdXBkYXRlRXhpc3RpbmdRdWVyeSA6IGxhdGVzdFF1ZXJ5ID0gbmV3RW50cnlRdWVyeTtcclxuICAgICAgICAgICAgICAgICAgICAgIGxldCByZWNydWl0ZXJTZWFyY2hRdWVyeSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ19pZCc6IHJlc1swXS5faWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdwb3N0ZWRKb2JzLl9pZCc6IGl0ZW0ucHJvZmlsZUlkXHJcbiAgICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVjcnVpdGVyUmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHJlY3J1aXRlclNlYXJjaFF1ZXJ5LCBsYXRlc3RRdWVyeSwgb3B0aW9ucywgKGVyciwgcmVjb3JkKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZWNvcmQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCByZWNvcmQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBlcnJvcjogYW55O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZWNvcmQgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yID0gbmV3IEVycm9yKCdVbmFibGUgdG8gYWRkIGNhbmRpZGF0ZS4nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCByZWNvcmQpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBsZXQgZXJyb3I6IGFueTtcclxuICAgICAgICAgICAgICBpZiAocmVjb3JkID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBlcnJvciA9IG5ldyBFcnJvcignVW5hYmxlIHRvIGFkZCBKb2IgdG8gTGlzdC4nKTtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG5cclxuICB9XHJcblxyXG4gIGdldFFDYXJkRGV0YWlscyhpdGVtOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxldCBjYW5kaWRhdGVEZXRhaWxzOiBhbnk7XHJcblxyXG4gICAgdGhpcy5jYW5kaWRhdGVSZXBvc2l0b3J5LnJldHJpZXZlQnlNdWx0aUlkcyhpdGVtLmNhbmRpZGF0ZUlkcywge30sIChlcnIsIGNhbmRpZGF0ZURldGFpbHNSZXMpID0+IHtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2FuZGlkYXRlRGV0YWlscyA9IGNhbmRpZGF0ZURldGFpbHNSZXM7XHJcbiAgICAgICAgbGV0IHF1ZXJ5ID0ge1xyXG4gICAgICAgICAgJ3Bvc3RlZEpvYnMnOiB7JGVsZW1NYXRjaDogeydfaWQnOiBuZXcgbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQoaXRlbS5qb2JJZCl9fVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5yZWNydWl0ZXJSZXBvc2l0b3J5LnJldHJpZXZlKHF1ZXJ5LCAoZXJyLCByZXMpID0+IHtcclxuICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKCdOb3QgRm91bmQgQW55IEpvYiBwb3N0ZWQnKSwgbnVsbCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHJlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgbGV0IHJlY3J1aXRlcjogUmVjcnVpdGVyID0gbmV3IFJlY3J1aXRlcigpO1xyXG4gICAgICAgICAgICAgIHJlY3J1aXRlciA9IHJlc1swXTtcclxuICAgICAgICAgICAgICBmb3IgKGxldCBqb2Igb2YgcmVzWzBdLnBvc3RlZEpvYnMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChqb2IuX2lkLnRvU3RyaW5nKCkgPT09IGl0ZW0uam9iSWQpIHtcclxuICAgICAgICAgICAgICAgICAgdGhpcy5jYW5kaWRhdGVSZXBvc2l0b3J5LmdldENhbmRpZGF0ZVFDYXJkKGNhbmRpZGF0ZURldGFpbHMsIGpvYiwgdW5kZWZpbmVkLCBjYWxsYmFjayk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcblxyXG59XHJcblxyXG5PYmplY3Quc2VhbChKb2JQcm9maWxlU2VydmljZSk7XHJcbmV4cG9ydCA9IEpvYlByb2ZpbGVTZXJ2aWNlO1xyXG4iXX0=
