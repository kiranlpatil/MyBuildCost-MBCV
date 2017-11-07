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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2VydmljZXMvam9icHJvZmlsZS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxtQ0FBcUM7QUFDckMsbUZBQW9FO0FBQ3BFLDZEQUFrRTtBQUNsRSxvRUFBZ0U7QUFDaEUscURBQXdEO0FBQ3hELG1GQUFzRjtBQUN0RixzRkFBeUY7QUFDekYsbUZBQXNGO0FBRXRGLGlGQUFvRjtBQUVwRixpRkFBb0Y7QUFDcEYsc0RBQXlEO0FBQ3pELElBQUksWUFBWSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUc1QztJQVNFO1FBQ0UsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksb0JBQW9CLEVBQUUsQ0FBQztRQUN2RCxJQUFJLENBQUMseUJBQXlCLEdBQUcsSUFBSSx5QkFBeUIsRUFBRSxDQUFDO1FBQ2pFLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLG1CQUFtQixFQUFFLENBQUM7UUFDckQsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksa0JBQWtCLEVBQUUsQ0FBQztRQUNuRCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxtQkFBbUIsRUFBRSxDQUFDO1FBQ3JELElBQUksQ0FBQyxRQUFRLEdBQUcsWUFBWSxDQUFDLFFBQVEsQ0FBQztRQUN0QyxJQUFJLEdBQUcsR0FBUSxJQUFJLFlBQVksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUMvQyxJQUFJLENBQUMsc0JBQXNCLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQztJQUNoRCxDQUFDO0lBRUQsa0NBQU0sR0FBTixVQUFPLElBQVMsRUFBRSxRQUEyQztRQUMzRCxJQUFJLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxVQUFDLEdBQUcsRUFBRSxHQUFHO1lBQzlDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsUUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FB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dGVudCI6WyJpbXBvcnQgKiBhcyBtb25nb29zZSBmcm9tIFwibW9uZ29vc2VcIjtcbmltcG9ydCB7UmVjcnVpdGVyfSBmcm9tIFwiLi4vZGF0YWFjY2Vzcy9tb2RlbC9yZWNydWl0ZXItZmluYWwubW9kZWxcIjtcbmltcG9ydCB7QWN0aW9ucywgQ29uc3RWYXJpYWJsZXN9IGZyb20gXCIuLi9zaGFyZWQvc2hhcmVkY29uc3RhbnRzXCI7XG5pbXBvcnQge1NoYXJlZFNlcnZpY2V9IGZyb20gXCIuLi9zaGFyZWQvc2VydmljZXMvc2hhcmVkLXNlcnZpY2VcIjtcbmltcG9ydCBQcm9qZWN0QXNzZXQgPSByZXF1aXJlKCcuLi9zaGFyZWQvcHJvamVjdGFzc2V0Jyk7XG5pbXBvcnQgUmVjcnVpdGVyUmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9yZWNydWl0ZXIucmVwb3NpdG9yeScpO1xuaW1wb3J0IEpvYlByb2ZpbGVSZXBvc2l0b3J5ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L2pvYi1wcm9maWxlLnJlcG9zaXRvcnknKTtcbmltcG9ydCBDYW5kaWRhdGVSZXBvc2l0b3J5ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L2NhbmRpZGF0ZS5yZXBvc2l0b3J5Jyk7XG5pbXBvcnQgSm9iUHJvZmlsZU1vZGVsID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9qb2Jwcm9maWxlLm1vZGVsJyk7XG5pbXBvcnQgQ2FuZGlkYXRlU2VhcmNoUmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL3NlYXJjaC9jYW5kaWRhdGUtc2VhcmNoLnJlcG9zaXRvcnknKTtcbmltcG9ydCBJbmR1c3RyeU1vZGVsID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9pbmR1c3RyeS5tb2RlbCcpO1xuaW1wb3J0IEluZHVzdHJ5UmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9pbmR1c3RyeS5yZXBvc2l0b3J5Jyk7XG5pbXBvcnQgQ2FuZGlkYXRlU2VydmljZSA9IHJlcXVpcmUoJy4vY2FuZGlkYXRlLnNlcnZpY2UnKTtcbmxldCB1c2VzdHJhY2tpbmcgPSByZXF1aXJlKCd1c2VzLXRyYWNraW5nJyk7XG5cblxuY2xhc3MgSm9iUHJvZmlsZVNlcnZpY2Uge1xuICBwcml2YXRlIGpvYnByb2ZpbGVSZXBvc2l0b3J5OiBKb2JQcm9maWxlUmVwb3NpdG9yeTtcbiAgcHJpdmF0ZSBjYW5kaWRhdGVTZWFyY2hSZXBvc2l0b3J5OiBDYW5kaWRhdGVTZWFyY2hSZXBvc2l0b3J5O1xuICBwcml2YXRlIGluZHVzdHJ5UmVwb3NpdG9yeTogSW5kdXN0cnlSZXBvc2l0b3J5O1xuICBwcml2YXRlIHJlY3J1aXRlclJlcG9zaXRvcnk6IFJlY3J1aXRlclJlcG9zaXRvcnk7XG4gIHByaXZhdGUgY2FuZGlkYXRlUmVwb3NpdG9yeTogQ2FuZGlkYXRlUmVwb3NpdG9yeTtcbiAgcHJpdmF0ZSBBUFBfTkFNRTogc3RyaW5nO1xuICBwcml2YXRlIHVzZXNUcmFja2luZ0NvbnRyb2xsZXI6IGFueTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmpvYnByb2ZpbGVSZXBvc2l0b3J5ID0gbmV3IEpvYlByb2ZpbGVSZXBvc2l0b3J5KCk7XG4gICAgdGhpcy5jYW5kaWRhdGVTZWFyY2hSZXBvc2l0b3J5ID0gbmV3IENhbmRpZGF0ZVNlYXJjaFJlcG9zaXRvcnkoKTtcbiAgICB0aGlzLnJlY3J1aXRlclJlcG9zaXRvcnkgPSBuZXcgUmVjcnVpdGVyUmVwb3NpdG9yeSgpO1xuICAgIHRoaXMuaW5kdXN0cnlSZXBvc2l0b3J5ID0gbmV3IEluZHVzdHJ5UmVwb3NpdG9yeSgpO1xuICAgIHRoaXMuY2FuZGlkYXRlUmVwb3NpdG9yeSA9IG5ldyBDYW5kaWRhdGVSZXBvc2l0b3J5KCk7XG4gICAgdGhpcy5BUFBfTkFNRSA9IFByb2plY3RBc3NldC5BUFBfTkFNRTtcbiAgICBsZXQgb2JqOiBhbnkgPSBuZXcgdXNlc3RyYWNraW5nLk15Q29udHJvbGxlcigpO1xuICAgIHRoaXMudXNlc1RyYWNraW5nQ29udHJvbGxlciA9IG9iai5fY29udHJvbGxlcjtcbiAgfVxuXG4gIGNyZWF0ZShpdGVtOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcbiAgICB0aGlzLmpvYnByb2ZpbGVSZXBvc2l0b3J5LmNyZWF0ZShpdGVtLCAoZXJyLCByZXMpID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKGVyciksIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHNlYXJjaENhbmRpZGF0ZXNCeUpvYlByb2ZpbGUoam9iUHJvZmlsZTogSm9iUHJvZmlsZU1vZGVsLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XG5cbiAgICB0aGlzLmNhbmRpZGF0ZVNlYXJjaFJlcG9zaXRvcnkuZ2V0Q2FuZGlkYXRlQnlJbmR1c3RyeShqb2JQcm9maWxlLCAoZXJyLCByZXMpID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKGVyciksIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJldHJpZXZlKGRhdGE6IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xuICAgIGxldCBxdWVyeSA9IHtcbiAgICAgICdwb3N0ZWRKb2JzJzogeyRlbGVtTWF0Y2g6IHsnX2lkJzogbmV3IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkKGRhdGEucG9zdGVkSm9iKX19XG4gICAgfTtcbiAgICB0aGlzLnJlY3J1aXRlclJlcG9zaXRvcnkucmV0cmlldmUocXVlcnksIChlcnIsIHJlcykgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoJ05vdCBGb3VuZCBBbnkgSm9iIHBvc3RlZCcpLCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChyZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGxldCByZWNydWl0ZXI6IFJlY3J1aXRlciA9IG5ldyBSZWNydWl0ZXIoKTtcbiAgICAgICAgICByZWNydWl0ZXIgPSByZXNbMF07XG4gICAgICAgICAgZm9yIChsZXQgam9iIG9mIHJlc1swXS5wb3N0ZWRKb2JzKSB7XG4gICAgICAgICAgICBpZiAoam9iLl9pZC50b1N0cmluZygpID09PSBkYXRhLnBvc3RlZEpvYikge1xuICAgICAgICAgICAgICByZWNydWl0ZXIucG9zdGVkSm9icyA9IG5ldyBBcnJheSgwKTtcbiAgICAgICAgICAgICAgcmVjcnVpdGVyLnBvc3RlZEpvYnMucHVzaChqb2IpO1xuICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCByZWNydWl0ZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZ2V0Q2FwYWJpbGl0eVZhbHVlS2V5TWF0cml4KF9pZDogc3RyaW5nLCAgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xuICAgIGxldCBkYXRhOiBhbnkgPSB7XG4gICAgICAncG9zdGVkSm9iJzogX2lkXG4gICAgfTtcbiAgICB0aGlzLnJldHJpZXZlKGRhdGEsIChlcnI6IGFueSwgcmVzOlJlY3J1aXRlcikgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBjYWxsYmFjayhlcnIsIHJlcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmluZHVzdHJ5UmVwb3NpdG9yeS5yZXRyaWV2ZSh7J25hbWUnOiByZXMucG9zdGVkSm9ic1swXS5pbmR1c3RyeS5uYW1lfSwgKGVycm9yOiBhbnksIGluZHVzdHJpZXM6IEluZHVzdHJ5TW9kZWxbXSkgPT4ge1xuICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgcmVzKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IGNhbmRpZGF0ZVNlcnZpY2U6IGFueSA9IG5ldyBDYW5kaWRhdGVTZXJ2aWNlKCk7XG4gICAgICAgICAgICBsZXQgbmV3X2NhcGFiaWxpdHlfbWF0cml4OiBhbnkgPSAgY2FuZGlkYXRlU2VydmljZS5nZXRDYXBhYmlsaXR5VmFsdWVLZXlNYXRyaXhCdWlsZChyZXMucG9zdGVkSm9ic1swXS5jYXBhYmlsaXR5X21hdHJpeCwgaW5kdXN0cmllcywgcmVzLnBvc3RlZEpvYnNbMF0uY29tcGxleGl0eV9tdXN0aGF2ZV9tYXRyaXgpO1xuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgbmV3X2NhcGFiaWxpdHlfbWF0cml4KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgdXBkYXRlKGl0ZW06IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xuXG4gICAgbGV0IHF1ZXJ5ID0ge1xuICAgICAgJ3Bvc3RlZEpvYnMnOiB7JGVsZW1NYXRjaDogeydfaWQnOiBuZXcgbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQoaXRlbS5wcm9maWxlSWQpfX1cbiAgICB9O1xuXG4gICAgbGV0IHVwZGF0ZUZsYWcgPSBmYWxzZTtcblxuICAgIGxldCB1cGRhdGVkUXVlcnkxID0ge1xuICAgICAgJ19pZCc6IGl0ZW0ucmVjcnVpdGVySWQsXG4gICAgICAncG9zdGVkSm9icy5faWQnOiBpdGVtLnByb2ZpbGVJZFxuICAgIH07XG5cbiAgICBsZXQgdXBkYXRlZFF1ZXJ5MiA9IHtcbiAgICAgICRwdXNoOiB7XG4gICAgICAgICdwb3N0ZWRKb2JzLiQuY2FuZGlkYXRlX2xpc3QnOiB7XG4gICAgICAgICAgJ25hbWUnOiBpdGVtLmxpc3ROYW1lLFxuICAgICAgICAgICdpZHMnOiBpdGVtLmNhbmRpZGF0ZUlkXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgbGV0IHVwZGF0ZWRRdWVyeTM6IGFueTtcblxuICAgIGxldCB1cGRhdGVkUXVlcnk0ID0ge1xuICAgICAgJ25ldyc6IHRydWUsICd1cHNlcnQnOiB0cnVlXG4gICAgfTtcblxuICAgIHRoaXMucmVjcnVpdGVyUmVwb3NpdG9yeS5yZXRyaWV2ZShxdWVyeSwgKGVyciwgcmVzKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcignTm90IEZvdW5kIEFueSBKb2IgcG9zdGVkJyksIG51bGwpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGlmIChyZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGZvciAobGV0IGpvYiBvZiByZXNbMF0ucG9zdGVkSm9icykge1xuICAgICAgICAgICAgaWYgKGpvYi5faWQudG9TdHJpbmcoKSA9PT0gaXRlbS5wcm9maWxlSWQpIHtcblxuICAgICAgICAgICAgICBmb3IgKGxldCBsaXN0IG9mIGpvYi5jYW5kaWRhdGVfbGlzdCkge1xuICAgICAgICAgICAgICAgIGlmIChsaXN0Lm5hbWUgPT0gaXRlbS5saXN0TmFtZSkge1xuICAgICAgICAgICAgICAgICAgdXBkYXRlRmxhZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICBpZiAoaXRlbS5hY3Rpb24gPT0gJ2FkZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHVzZXNfZGF0YSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICByZWNydWl0ZXJJZDogcmVzWzBdLl9pZCxcbiAgICAgICAgICAgICAgICAgICAgICBjYW5kaWRhdGVJZDogaXRlbS5jYW5kaWRhdGVJZCxcbiAgICAgICAgICAgICAgICAgICAgICBqb2JQcm9maWxlSWQ6IGpvYi5faWQsXG4gICAgICAgICAgICAgICAgICAgICAgdGltZXN0YW1wOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbjogQWN0aW9ucy5ERUZBVUxUX1ZBTFVFXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGxldCBzaGFyZWRTZXJ2aWNlOlNoYXJlZFNlcnZpY2UgPSBuZXcgU2hhcmVkU2VydmljZSgpO1xuICAgICAgICAgICAgICAgICAgICB1c2VzX2RhdGEuYWN0aW9uID0gc2hhcmVkU2VydmljZS5jb25zdHJ1Y3RBZGRBY3Rpb25EYXRhKGl0ZW0ubGlzdE5hbWUpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVzZXNUcmFja2luZ0NvbnRyb2xsZXIuY3JlYXRlKHVzZXNfZGF0YSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpc3QubmFtZSA9PSBDb25zdFZhcmlhYmxlcy5SRUpFQ1RFRF9MSVNURURfQ0FORElEQVRFKSB7XG4gICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgX2xpc3Qgb2Ygam9iLmNhbmRpZGF0ZV9saXN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoX2xpc3QubmFtZSA9PSBDb25zdFZhcmlhYmxlcy5DQVJUX0xJU1RFRF9DQU5ESURBVEUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gX2xpc3QuaWRzLmluZGV4T2YoaXRlbS5jYW5kaWRhdGVJZCk7ICAgIC8vIDwtLSBOb3Qgc3VwcG9ydGVkIGluIDxJRTlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9saXN0Lmlkcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGxldCBpbmRleCA9IGxpc3QuaWRzLmluZGV4T2YoaXRlbS5jYW5kaWRhdGVJZCk7ICAgIC8vIDwtLSBOb3Qgc3VwcG9ydGVkIGluIDxJRTlcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgbGlzdC5pZHMucHVzaChpdGVtLmNhbmRpZGF0ZUlkKTtcblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsZXQgdXNlc19kYXRhID0ge1xuICAgICAgICAgICAgICAgICAgICAgIHJlY3J1aXRlcklkOiByZXNbMF0uX2lkLFxuICAgICAgICAgICAgICAgICAgICAgIGNhbmRpZGF0ZUlkOiBpdGVtLmNhbmRpZGF0ZUlkLFxuICAgICAgICAgICAgICAgICAgICAgIGpvYlByb2ZpbGVJZDogam9iLl9pZCxcbiAgICAgICAgICAgICAgICAgICAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCksXG4gICAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiBBY3Rpb25zLkRFRkFVTFRfVkFMVUVcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNoYXJlZFNlcnZpY2U6IFNoYXJlZFNlcnZpY2UgPSBuZXcgU2hhcmVkU2VydmljZSgpO1xuICAgICAgICAgICAgICAgICAgICB1c2VzX2RhdGEuYWN0aW9uID0gc2hhcmVkU2VydmljZS5jb25zdHJ1Y3RSZW1vdmVBY3Rpb25EYXRhKGl0ZW0ubGlzdE5hbWUpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVzZXNUcmFja2luZ0NvbnRyb2xsZXIuY3JlYXRlKHVzZXNfZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBpbmRleCA9IGxpc3QuaWRzLmluZGV4T2YoaXRlbS5jYW5kaWRhdGVJZCk7ICAgIC8vIDwtLSBOb3Qgc3VwcG9ydGVkIGluIDxJRTlcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgIGxpc3QuaWRzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIHVwZGF0ZWRRdWVyeTMgPSB7XG4gICAgICAgICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAncG9zdGVkSm9icy4kLmNhbmRpZGF0ZV9saXN0Jzogam9iLmNhbmRpZGF0ZV9saXN0XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBsZXQgcGFyYW0yOiBhbnk7XG4gICAgICAgICAgICAgIHVwZGF0ZUZsYWcgPyBwYXJhbTIgPSB1cGRhdGVkUXVlcnkzIDogcGFyYW0yID0gdXBkYXRlZFF1ZXJ5MjtcblxuICAgICAgICAgICAgICB0aGlzLnJlY3J1aXRlclJlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZSh1cGRhdGVkUXVlcnkxLCBwYXJhbTIsIHVwZGF0ZWRRdWVyeTQsIChlcnIsIHJlY29yZCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZWNvcmQpIHtcbiAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJlY29yZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGxldCBlcnJvcjogYW55O1xuICAgICAgICAgICAgICAgICAgaWYgKHJlY29yZCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBlcnJvciA9IG5ldyBFcnJvcignVW5hYmxlIHRvIGFkZCBjYW5kaWRhdGUuJyk7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuXG4gIGFwcGx5Sm9iKGl0ZW06IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xuXG5cbiAgICB0aGlzLmNhbmRpZGF0ZVJlcG9zaXRvcnkucmV0cmlldmUoeydfaWQnOiBuZXcgbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQoaXRlbS5jYW5kaWRhdGVJZCl9LCAoZXJyb3IsIHJlc3BvbnNlKSA9PiB7XG5cbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoJ05vIGNhbmRpZGF0ZSBGb3VuZCcpLCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChyZXNwb25zZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgbGV0IHVwZGF0ZUV4aXN0aW5nUXVlcnlGb3JDYW5kaWRhdGU6IGFueTtcbiAgICAgICAgICBsZXQgaXNKb2JGb3VuZDogYm9vbGVhbiA9IGZhbHNlO1xuICAgICAgICAgIGZvciAobGV0IGxpc3Qgb2YgcmVzcG9uc2VbMF0uam9iX2xpc3QpIHtcbiAgICAgICAgICAgIGlmIChsaXN0Lm5hbWUgPT0gaXRlbS5saXN0TmFtZSkge1xuICAgICAgICAgICAgICBpc0pvYkZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgaWYgKGl0ZW0uYWN0aW9uID09ICdhZGQnKSB7XG4gICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gbGlzdC5pZHMuaW5kZXhPZihpdGVtLnByb2ZpbGVJZCk7XG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID09IC0xKSB7XG4gICAgICAgICAgICAgICAgICBsZXQgdXNlc19kYXRhID0ge1xuICAgICAgICAgICAgICAgICAgICBjYW5kaWRhdGVJZDogaXRlbS5jYW5kaWRhdGVJZCxcbiAgICAgICAgICAgICAgICAgICAgam9iUHJvZmlsZUlkOiBpdGVtLnByb2ZpbGVJZCxcbiAgICAgICAgICAgICAgICAgICAgdGltZXN0YW1wOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgICAgICAgICAgICBhY3Rpb246IEFjdGlvbnMuREVGQVVMVF9WQUxVRVxuICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgIGxldCBzaGFyZWRTZXJ2aWNlOiBTaGFyZWRTZXJ2aWNlID0gbmV3IFNoYXJlZFNlcnZpY2UoKTtcbiAgICAgICAgICAgICAgICAgIHVzZXNfZGF0YS5hY3Rpb24gPSBzaGFyZWRTZXJ2aWNlLmNvbnN0cnVjdEFkZEFjdGlvbkRhdGEoaXRlbS5saXN0TmFtZSk7XG4gICAgICAgICAgICAgICAgICB0aGlzLnVzZXNUcmFja2luZ0NvbnRyb2xsZXIuY3JlYXRlKHVzZXNfZGF0YSk7XG4gICAgICAgICAgICAgICAgICBsaXN0Lmlkcy5wdXNoKGl0ZW0ucHJvZmlsZUlkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbS5hY3Rpb24gPT0gJ3JlbW92ZScgJiYgaXRlbS5saXN0TmFtZSAhPSAnYXBwbGllZCcpIHtcbiAgICAgICAgICAgICAgICBsZXQgdXNlc19kYXRhID0ge1xuICAgICAgICAgICAgICAgICAgY2FuZGlkYXRlSWQ6IGl0ZW0uY2FuZGlkYXRlSWQsXG4gICAgICAgICAgICAgICAgICBqb2JQcm9maWxlSWQ6IGl0ZW0ucHJvZmlsZUlkLFxuICAgICAgICAgICAgICAgICAgdGltZXN0YW1wOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgICAgICAgICAgYWN0aW9uOiBBY3Rpb25zLkRFRkFVTFRfVkFMVUVcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGxldCBzaGFyZWRTZXJ2aWNlOiBTaGFyZWRTZXJ2aWNlID0gbmV3IFNoYXJlZFNlcnZpY2UoKTtcbiAgICAgICAgICAgICAgICB1c2VzX2RhdGEuYWN0aW9uID0gc2hhcmVkU2VydmljZS5jb25zdHJ1Y3RSZW1vdmVBY3Rpb25EYXRhKGl0ZW0ubGlzdE5hbWUpO1xuICAgICAgICAgICAgICAgIHRoaXMudXNlc1RyYWNraW5nQ29udHJvbGxlci5jcmVhdGUodXNlc19kYXRhKTtcbiAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSBsaXN0Lmlkcy5pbmRleE9mKGl0ZW0ucHJvZmlsZUlkKTtcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICBsaXN0Lmlkcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB1cGRhdGVFeGlzdGluZ1F1ZXJ5Rm9yQ2FuZGlkYXRlID0ge1xuICAgICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICAgICdqb2JfbGlzdCc6IHJlc3BvbnNlWzBdLmpvYl9saXN0XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgbGV0IG5ld0VudHJ5UXVlcnlGb3JDYW5kaWRhdGUgPSB7XG4gICAgICAgICAgICAkcHVzaDoge1xuICAgICAgICAgICAgICAnam9iX2xpc3QnOiB7XG4gICAgICAgICAgICAgICAgJ25hbWUnOiBpdGVtLmxpc3ROYW1lLFxuICAgICAgICAgICAgICAgICdpZHMnOiBpdGVtLnByb2ZpbGVJZFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgICBsZXQgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICduZXcnOiB0cnVlLCAndXBzZXJ0JzogdHJ1ZVxuICAgICAgICAgIH07XG4gICAgICAgICAgbGV0IGxhdGVzdFF1ZXJ5Rm9yQ2FuZGlkYXRlOiBhbnk7XG4gICAgICAgICAgaXNKb2JGb3VuZCA/IGxhdGVzdFF1ZXJ5Rm9yQ2FuZGlkYXRlID0gdXBkYXRlRXhpc3RpbmdRdWVyeUZvckNhbmRpZGF0ZSA6IGxhdGVzdFF1ZXJ5Rm9yQ2FuZGlkYXRlID0gbmV3RW50cnlRdWVyeUZvckNhbmRpZGF0ZTtcbiAgICAgICAgICBsZXQgY2FuZGlkYXRlU2VhcmNoUXVlcnkgPSB7XG4gICAgICAgICAgICAnX2lkJzogaXRlbS5jYW5kaWRhdGVJZFxuICAgICAgICAgIH07XG5cbiAgICAgICAgICB0aGlzLmNhbmRpZGF0ZVJlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShjYW5kaWRhdGVTZWFyY2hRdWVyeSwgbGF0ZXN0UXVlcnlGb3JDYW5kaWRhdGUsIG9wdGlvbnMsIChlcnIsIHJlY29yZCkgPT4ge1xuICAgICAgICAgICAgaWYgKHJlY29yZCkge1xuICAgICAgICAgICAgICBpZiAoaXRlbS5saXN0TmFtZSA9PSAnYXBwbGllZCcgJiYgaXRlbS5hY3Rpb24gPT0gJ2FkZCcpIHtcbiAgICAgICAgICAgICAgICBsZXQgcXVlcnkgPSB7XG4gICAgICAgICAgICAgICAgICAncG9zdGVkSm9icyc6IHskZWxlbU1hdGNoOiB7J19pZCc6IG5ldyBtb25nb29zZS5UeXBlcy5PYmplY3RJZChpdGVtLnByb2ZpbGVJZCl9fVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgbGV0IG5ld0VudHJ5UXVlcnkgPSB7XG4gICAgICAgICAgICAgICAgICAkcHVzaDoge1xuICAgICAgICAgICAgICAgICAgICAncG9zdGVkSm9icy4kLmNhbmRpZGF0ZV9saXN0Jzoge1xuICAgICAgICAgICAgICAgICAgICAgICduYW1lJzogQ29uc3RWYXJpYWJsZXMuQVBQTElFRF9DQU5ESURBVEUsXG4gICAgICAgICAgICAgICAgICAgICAgJ2lkcyc6IGl0ZW0uY2FuZGlkYXRlSWRcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgbGV0IHVwZGF0ZUV4aXN0aW5nUXVlcnk6IGFueTtcbiAgICAgICAgICAgICAgICB0aGlzLnJlY3J1aXRlclJlcG9zaXRvcnkucmV0cmlldmUocXVlcnksIChlcnIsIHJlcykgPT4ge1xuICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoJ05vdCBGb3VuZCBBbnkgSm9iIHBvc3RlZCcpLCBudWxsKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsZXQgaXNGb3VuZDogYm9vbGVhbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBqb2Igb2YgcmVzWzBdLnBvc3RlZEpvYnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChqb2IuX2lkLnRvU3RyaW5nKCkgPT09IGl0ZW0ucHJvZmlsZUlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGxpc3Qgb2Ygam9iLmNhbmRpZGF0ZV9saXN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxpc3QubmFtZSA9PSBDb25zdFZhcmlhYmxlcy5BUFBMSUVEX0NBTkRJREFURSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNGb3VuZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSBsaXN0Lmlkcy5pbmRleE9mKGl0ZW0uY2FuZGlkYXRlSWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3QuaWRzLnB1c2goaXRlbS5jYW5kaWRhdGVJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVFeGlzdGluZ1F1ZXJ5ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3Bvc3RlZEpvYnMuJC5jYW5kaWRhdGVfbGlzdCc6IGpvYi5jYW5kaWRhdGVfbGlzdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgIGxldCBsYXRlc3RRdWVyeTogYW55O1xuICAgICAgICAgICAgICAgICAgICAgIGlzRm91bmQgPyBsYXRlc3RRdWVyeSA9IHVwZGF0ZUV4aXN0aW5nUXVlcnkgOiBsYXRlc3RRdWVyeSA9IG5ld0VudHJ5UXVlcnk7XG4gICAgICAgICAgICAgICAgICAgICAgbGV0IHJlY3J1aXRlclNlYXJjaFF1ZXJ5ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ19pZCc6IHJlc1swXS5faWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAncG9zdGVkSm9icy5faWQnOiBpdGVtLnByb2ZpbGVJZFxuICAgICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlY3J1aXRlclJlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShyZWNydWl0ZXJTZWFyY2hRdWVyeSwgbGF0ZXN0UXVlcnksIG9wdGlvbnMsIChlcnIsIHJlY29yZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlY29yZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCByZWNvcmQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGVycm9yOiBhbnk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZWNvcmQgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvciA9IG5ldyBFcnJvcignVW5hYmxlIHRvIGFkZCBjYW5kaWRhdGUuJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJlY29yZCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGxldCBlcnJvcjogYW55O1xuICAgICAgICAgICAgICBpZiAocmVjb3JkID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoJ1VuYWJsZSB0byBhZGQgSm9iIHRvIExpc3QuJyk7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcblxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cblxuICB9XG5cbiAgZ2V0UUNhcmREZXRhaWxzKGl0ZW06IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xuICAgIGxldCBjYW5kaWRhdGVEZXRhaWxzOiBhbnk7XG5cbiAgICB0aGlzLmNhbmRpZGF0ZVJlcG9zaXRvcnkucmV0cmlldmVCeU11bHRpSWRzKGl0ZW0uY2FuZGlkYXRlSWRzLCB7fSwgKGVyciwgY2FuZGlkYXRlRGV0YWlsc1JlcykgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FuZGlkYXRlRGV0YWlscyA9IGNhbmRpZGF0ZURldGFpbHNSZXM7XG4gICAgICAgIGxldCBxdWVyeSA9IHtcbiAgICAgICAgICAncG9zdGVkSm9icyc6IHskZWxlbU1hdGNoOiB7J19pZCc6IG5ldyBtb25nb29zZS5UeXBlcy5PYmplY3RJZChpdGVtLmpvYklkKX19XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMucmVjcnVpdGVyUmVwb3NpdG9yeS5yZXRyaWV2ZShxdWVyeSwgKGVyciwgcmVzKSA9PiB7XG4gICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKCdOb3QgRm91bmQgQW55IEpvYiBwb3N0ZWQnKSwgbnVsbCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKHJlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIGxldCByZWNydWl0ZXI6IFJlY3J1aXRlciA9IG5ldyBSZWNydWl0ZXIoKTtcbiAgICAgICAgICAgICAgcmVjcnVpdGVyID0gcmVzWzBdO1xuICAgICAgICAgICAgICBmb3IgKGxldCBqb2Igb2YgcmVzWzBdLnBvc3RlZEpvYnMpIHtcbiAgICAgICAgICAgICAgICBpZiAoam9iLl9pZC50b1N0cmluZygpID09PSBpdGVtLmpvYklkKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLmNhbmRpZGF0ZVJlcG9zaXRvcnkuZ2V0Q2FuZGlkYXRlUUNhcmQoY2FuZGlkYXRlRGV0YWlscywgam9iLCB1bmRlZmluZWQsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cblxufVxuXG5PYmplY3Quc2VhbChKb2JQcm9maWxlU2VydmljZSk7XG5leHBvcnQgPSBKb2JQcm9maWxlU2VydmljZTtcbiJdfQ==
