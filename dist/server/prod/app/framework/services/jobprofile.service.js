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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2VydmljZXMvam9icHJvZmlsZS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxtQ0FBcUM7QUFDckMsbUZBQW9FO0FBQ3BFLDZEQUFrRTtBQUNsRSxvRUFBZ0U7QUFDaEUscURBQXdEO0FBQ3hELG1GQUFzRjtBQUN0RixzRkFBeUY7QUFDekYsbUZBQXNGO0FBRXRGLGlGQUFvRjtBQUVwRixpRkFBb0Y7QUFDcEYsc0RBQXlEO0FBQ3pELElBQUksWUFBWSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUc1QztJQVNFO1FBQ0UsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksb0JBQW9CLEVBQUUsQ0FBQztRQUN2RCxJQUFJLENBQUMseUJBQXlCLEdBQUcsSUFBSSx5QkFBeUIsRUFBRSxDQUFDO1FBQ2pFLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLG1CQUFtQixFQUFFLENBQUM7UUFDckQsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksa0JBQWtCLEVBQUUsQ0FBQztRQUNuRCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxtQkFBbUIsRUFBRSxDQUFDO1FBQ3JELElBQUksQ0FBQyxRQUFRLEdBQUcsWUFBWSxDQUFDLFFBQVEsQ0FBQztRQUN0QyxJQUFJLEdBQUcsR0FBUSxJQUFJLFlBQVksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUMvQyxJQUFJLENBQUMsc0JBQXNCLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQztJQUNoRCxDQUFDO0lBRUQsa0NBQU0sR0FBTixVQUFPLElBQVMsRUFBRSxRQUEyQztRQUMzRCxJQUFJLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxVQUFDLEdBQUcsRUFBRSxHQUFHO1lBQzlDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsUUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FB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UixRQUFRLENBQUMsSUFBSSxLQUFLLENBQUMsMEJBQTBCLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFDeEQsQ0FBQztvQkFDRCxJQUFJLENBQUMsQ0FBQzt3QkFDSixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ25CLElBQUksU0FBUyxHQUFjLElBQUksaUNBQVMsRUFBRSxDQUFDOzRCQUMzQyxTQUFTLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUNuQixHQUFHLENBQUMsQ0FBWSxVQUFpQixFQUFqQixLQUFBLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQWpCLGNBQWlCLEVBQWpCLElBQWlCO2dDQUE1QixJQUFJLEdBQUcsU0FBQTtnQ0FDVixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxLQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29DQUN0QyxLQUFJLENBQUMsbUJBQW1CLENBQUMsaUJBQWlCLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztnQ0FDekYsQ0FBQzs2QkFDRjt3QkFDSCxDQUFDO29CQUNILENBQUM7Z0JBQ0gsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBR0gsd0JBQUM7QUFBRCxDQXRZQSxBQXNZQyxJQUFBO0FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQy9CLGlCQUFTLGlCQUFpQixDQUFDIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvc2VydmljZXMvam9icHJvZmlsZS5zZXJ2aWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgbW9uZ29vc2UgZnJvbSBcIm1vbmdvb3NlXCI7XG5pbXBvcnQge1JlY3J1aXRlcn0gZnJvbSBcIi4uL2RhdGFhY2Nlc3MvbW9kZWwvcmVjcnVpdGVyLWZpbmFsLm1vZGVsXCI7XG5pbXBvcnQge0FjdGlvbnMsIENvbnN0VmFyaWFibGVzfSBmcm9tIFwiLi4vc2hhcmVkL3NoYXJlZGNvbnN0YW50c1wiO1xuaW1wb3J0IHtTaGFyZWRTZXJ2aWNlfSBmcm9tIFwiLi4vc2hhcmVkL3NlcnZpY2VzL3NoYXJlZC1zZXJ2aWNlXCI7XG5pbXBvcnQgUHJvamVjdEFzc2V0ID0gcmVxdWlyZSgnLi4vc2hhcmVkL3Byb2plY3Rhc3NldCcpO1xuaW1wb3J0IFJlY3J1aXRlclJlcG9zaXRvcnkgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL3JlcG9zaXRvcnkvcmVjcnVpdGVyLnJlcG9zaXRvcnknKTtcbmltcG9ydCBKb2JQcm9maWxlUmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9qb2ItcHJvZmlsZS5yZXBvc2l0b3J5Jyk7XG5pbXBvcnQgQ2FuZGlkYXRlUmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9jYW5kaWRhdGUucmVwb3NpdG9yeScpO1xuaW1wb3J0IEpvYlByb2ZpbGVNb2RlbCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvam9icHJvZmlsZS5tb2RlbCcpO1xuaW1wb3J0IENhbmRpZGF0ZVNlYXJjaFJlcG9zaXRvcnkgPSByZXF1aXJlKCcuLi9zZWFyY2gvY2FuZGlkYXRlLXNlYXJjaC5yZXBvc2l0b3J5Jyk7XG5pbXBvcnQgSW5kdXN0cnlNb2RlbCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvaW5kdXN0cnkubW9kZWwnKTtcbmltcG9ydCBJbmR1c3RyeVJlcG9zaXRvcnkgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL3JlcG9zaXRvcnkvaW5kdXN0cnkucmVwb3NpdG9yeScpO1xuaW1wb3J0IENhbmRpZGF0ZVNlcnZpY2UgPSByZXF1aXJlKCcuL2NhbmRpZGF0ZS5zZXJ2aWNlJyk7XG5sZXQgdXNlc3RyYWNraW5nID0gcmVxdWlyZSgndXNlcy10cmFja2luZycpO1xuXG5cbmNsYXNzIEpvYlByb2ZpbGVTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBqb2Jwcm9maWxlUmVwb3NpdG9yeTogSm9iUHJvZmlsZVJlcG9zaXRvcnk7XG4gIHByaXZhdGUgY2FuZGlkYXRlU2VhcmNoUmVwb3NpdG9yeTogQ2FuZGlkYXRlU2VhcmNoUmVwb3NpdG9yeTtcbiAgcHJpdmF0ZSBpbmR1c3RyeVJlcG9zaXRvcnk6IEluZHVzdHJ5UmVwb3NpdG9yeTtcbiAgcHJpdmF0ZSByZWNydWl0ZXJSZXBvc2l0b3J5OiBSZWNydWl0ZXJSZXBvc2l0b3J5O1xuICBwcml2YXRlIGNhbmRpZGF0ZVJlcG9zaXRvcnk6IENhbmRpZGF0ZVJlcG9zaXRvcnk7XG4gIHByaXZhdGUgQVBQX05BTUU6IHN0cmluZztcbiAgcHJpdmF0ZSB1c2VzVHJhY2tpbmdDb250cm9sbGVyOiBhbnk7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5qb2Jwcm9maWxlUmVwb3NpdG9yeSA9IG5ldyBKb2JQcm9maWxlUmVwb3NpdG9yeSgpO1xuICAgIHRoaXMuY2FuZGlkYXRlU2VhcmNoUmVwb3NpdG9yeSA9IG5ldyBDYW5kaWRhdGVTZWFyY2hSZXBvc2l0b3J5KCk7XG4gICAgdGhpcy5yZWNydWl0ZXJSZXBvc2l0b3J5ID0gbmV3IFJlY3J1aXRlclJlcG9zaXRvcnkoKTtcbiAgICB0aGlzLmluZHVzdHJ5UmVwb3NpdG9yeSA9IG5ldyBJbmR1c3RyeVJlcG9zaXRvcnkoKTtcbiAgICB0aGlzLmNhbmRpZGF0ZVJlcG9zaXRvcnkgPSBuZXcgQ2FuZGlkYXRlUmVwb3NpdG9yeSgpO1xuICAgIHRoaXMuQVBQX05BTUUgPSBQcm9qZWN0QXNzZXQuQVBQX05BTUU7XG4gICAgbGV0IG9iajogYW55ID0gbmV3IHVzZXN0cmFja2luZy5NeUNvbnRyb2xsZXIoKTtcbiAgICB0aGlzLnVzZXNUcmFja2luZ0NvbnRyb2xsZXIgPSBvYmouX2NvbnRyb2xsZXI7XG4gIH1cblxuICBjcmVhdGUoaXRlbTogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XG4gICAgdGhpcy5qb2Jwcm9maWxlUmVwb3NpdG9yeS5jcmVhdGUoaXRlbSwgKGVyciwgcmVzKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihlcnIpLCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHJlcyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBzZWFyY2hDYW5kaWRhdGVzQnlKb2JQcm9maWxlKGpvYlByb2ZpbGU6IEpvYlByb2ZpbGVNb2RlbCwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xuXG4gICAgdGhpcy5jYW5kaWRhdGVTZWFyY2hSZXBvc2l0b3J5LmdldENhbmRpZGF0ZUJ5SW5kdXN0cnkoam9iUHJvZmlsZSwgKGVyciwgcmVzKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihlcnIpLCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHJlcyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICByZXRyaWV2ZShkYXRhOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcbiAgICBsZXQgcXVlcnkgPSB7XG4gICAgICAncG9zdGVkSm9icyc6IHskZWxlbU1hdGNoOiB7J19pZCc6IG5ldyBtb25nb29zZS5UeXBlcy5PYmplY3RJZChkYXRhLnBvc3RlZEpvYil9fVxuICAgIH07XG4gICAgdGhpcy5yZWNydWl0ZXJSZXBvc2l0b3J5LnJldHJpZXZlKHF1ZXJ5LCAoZXJyLCByZXMpID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKCdOb3QgRm91bmQgQW55IEpvYiBwb3N0ZWQnKSwgbnVsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAocmVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBsZXQgcmVjcnVpdGVyOiBSZWNydWl0ZXIgPSBuZXcgUmVjcnVpdGVyKCk7XG4gICAgICAgICAgcmVjcnVpdGVyID0gcmVzWzBdO1xuICAgICAgICAgIGZvciAobGV0IGpvYiBvZiByZXNbMF0ucG9zdGVkSm9icykge1xuICAgICAgICAgICAgaWYgKGpvYi5faWQudG9TdHJpbmcoKSA9PT0gZGF0YS5wb3N0ZWRKb2IpIHtcbiAgICAgICAgICAgICAgcmVjcnVpdGVyLnBvc3RlZEpvYnMgPSBuZXcgQXJyYXkoMCk7XG4gICAgICAgICAgICAgIHJlY3J1aXRlci5wb3N0ZWRKb2JzLnB1c2goam9iKTtcbiAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVjcnVpdGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdldENhcGFiaWxpdHlWYWx1ZUtleU1hdHJpeChfaWQ6IHN0cmluZywgIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcbiAgICBsZXQgZGF0YTogYW55ID0ge1xuICAgICAgJ3Bvc3RlZEpvYic6IF9pZFxuICAgIH07XG4gICAgdGhpcy5yZXRyaWV2ZShkYXRhLCAoZXJyOiBhbnksIHJlczpSZWNydWl0ZXIpID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgY2FsbGJhY2soZXJyLCByZXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5pbmR1c3RyeVJlcG9zaXRvcnkucmV0cmlldmUoeyduYW1lJzogcmVzLnBvc3RlZEpvYnNbMF0uaW5kdXN0cnkubmFtZX0sIChlcnJvcjogYW55LCBpbmR1c3RyaWVzOiBJbmR1c3RyeU1vZGVsW10pID0+IHtcbiAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhlcnIsIHJlcyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBjYW5kaWRhdGVTZXJ2aWNlOiBhbnkgPSBuZXcgQ2FuZGlkYXRlU2VydmljZSgpO1xuICAgICAgICAgICAgbGV0IG5ld19jYXBhYmlsaXR5X21hdHJpeDogYW55ID0gIGNhbmRpZGF0ZVNlcnZpY2UuZ2V0Q2FwYWJpbGl0eVZhbHVlS2V5TWF0cml4QnVpbGQocmVzLnBvc3RlZEpvYnNbMF0uY2FwYWJpbGl0eV9tYXRyaXgsaW5kdXN0cmllcyk7XG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCBuZXdfY2FwYWJpbGl0eV9tYXRyaXgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICB1cGRhdGUoaXRlbTogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XG5cbiAgICBsZXQgcXVlcnkgPSB7XG4gICAgICAncG9zdGVkSm9icyc6IHskZWxlbU1hdGNoOiB7J19pZCc6IG5ldyBtb25nb29zZS5UeXBlcy5PYmplY3RJZChpdGVtLnByb2ZpbGVJZCl9fVxuICAgIH07XG5cbiAgICBsZXQgdXBkYXRlRmxhZyA9IGZhbHNlO1xuXG4gICAgbGV0IHVwZGF0ZWRRdWVyeTEgPSB7XG4gICAgICAnX2lkJzogaXRlbS5yZWNydWl0ZXJJZCxcbiAgICAgICdwb3N0ZWRKb2JzLl9pZCc6IGl0ZW0ucHJvZmlsZUlkXG4gICAgfTtcblxuICAgIGxldCB1cGRhdGVkUXVlcnkyID0ge1xuICAgICAgJHB1c2g6IHtcbiAgICAgICAgJ3Bvc3RlZEpvYnMuJC5jYW5kaWRhdGVfbGlzdCc6IHtcbiAgICAgICAgICAnbmFtZSc6IGl0ZW0ubGlzdE5hbWUsXG4gICAgICAgICAgJ2lkcyc6IGl0ZW0uY2FuZGlkYXRlSWRcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBsZXQgdXBkYXRlZFF1ZXJ5MzogYW55O1xuXG4gICAgbGV0IHVwZGF0ZWRRdWVyeTQgPSB7XG4gICAgICAnbmV3JzogdHJ1ZSwgJ3Vwc2VydCc6IHRydWVcbiAgICB9O1xuXG4gICAgdGhpcy5yZWNydWl0ZXJSZXBvc2l0b3J5LnJldHJpZXZlKHF1ZXJ5LCAoZXJyLCByZXMpID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKCdOb3QgRm91bmQgQW55IEpvYiBwb3N0ZWQnKSwgbnVsbCk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgaWYgKHJlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgZm9yIChsZXQgam9iIG9mIHJlc1swXS5wb3N0ZWRKb2JzKSB7XG4gICAgICAgICAgICBpZiAoam9iLl9pZC50b1N0cmluZygpID09PSBpdGVtLnByb2ZpbGVJZCkge1xuXG4gICAgICAgICAgICAgIGZvciAobGV0IGxpc3Qgb2Ygam9iLmNhbmRpZGF0ZV9saXN0KSB7XG4gICAgICAgICAgICAgICAgaWYgKGxpc3QubmFtZSA9PSBpdGVtLmxpc3ROYW1lKSB7XG4gICAgICAgICAgICAgICAgICB1cGRhdGVGbGFnID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgIGlmIChpdGVtLmFjdGlvbiA9PSAnYWRkJykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgdXNlc19kYXRhID0ge1xuICAgICAgICAgICAgICAgICAgICAgIHJlY3J1aXRlcklkOiByZXNbMF0uX2lkLFxuICAgICAgICAgICAgICAgICAgICAgIGNhbmRpZGF0ZUlkOiBpdGVtLmNhbmRpZGF0ZUlkLFxuICAgICAgICAgICAgICAgICAgICAgIGpvYlByb2ZpbGVJZDogam9iLl9pZCxcbiAgICAgICAgICAgICAgICAgICAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCksXG4gICAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiBBY3Rpb25zLkRFRkFVTFRfVkFMVUVcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNoYXJlZFNlcnZpY2U6U2hhcmVkU2VydmljZSA9IG5ldyBTaGFyZWRTZXJ2aWNlKCk7XG4gICAgICAgICAgICAgICAgICAgIHVzZXNfZGF0YS5hY3Rpb24gPSBzaGFyZWRTZXJ2aWNlLmNvbnN0cnVjdEFkZEFjdGlvbkRhdGEoaXRlbS5saXN0TmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXNlc1RyYWNraW5nQ29udHJvbGxlci5jcmVhdGUodXNlc19kYXRhKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAobGlzdC5uYW1lID09IENvbnN0VmFyaWFibGVzLlJFSkVDVEVEX0xJU1RFRF9DQU5ESURBVEUpIHtcbiAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBfbGlzdCBvZiBqb2IuY2FuZGlkYXRlX2xpc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChfbGlzdC5uYW1lID09IENvbnN0VmFyaWFibGVzLkNBUlRfTElTVEVEX0NBTkRJREFURSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSBfbGlzdC5pZHMuaW5kZXhPZihpdGVtLmNhbmRpZGF0ZUlkKTsgICAgLy8gPC0tIE5vdCBzdXBwb3J0ZWQgaW4gPElFOVxuICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX2xpc3QuaWRzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gbGlzdC5pZHMuaW5kZXhPZihpdGVtLmNhbmRpZGF0ZUlkKTsgICAgLy8gPC0tIE5vdCBzdXBwb3J0ZWQgaW4gPElFOVxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICBsaXN0Lmlkcy5wdXNoKGl0ZW0uY2FuZGlkYXRlSWQpO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCB1c2VzX2RhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgcmVjcnVpdGVySWQ6IHJlc1swXS5faWQsXG4gICAgICAgICAgICAgICAgICAgICAgY2FuZGlkYXRlSWQ6IGl0ZW0uY2FuZGlkYXRlSWQsXG4gICAgICAgICAgICAgICAgICAgICAgam9iUHJvZmlsZUlkOiBqb2IuX2lkLFxuICAgICAgICAgICAgICAgICAgICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKSxcbiAgICAgICAgICAgICAgICAgICAgICBhY3Rpb246IEFjdGlvbnMuREVGQVVMVF9WQUxVRVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBsZXQgc2hhcmVkU2VydmljZTogU2hhcmVkU2VydmljZSA9IG5ldyBTaGFyZWRTZXJ2aWNlKCk7XG4gICAgICAgICAgICAgICAgICAgIHVzZXNfZGF0YS5hY3Rpb24gPSBzaGFyZWRTZXJ2aWNlLmNvbnN0cnVjdFJlbW92ZUFjdGlvbkRhdGEoaXRlbS5saXN0TmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXNlc1RyYWNraW5nQ29udHJvbGxlci5jcmVhdGUodXNlc19kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gbGlzdC5pZHMuaW5kZXhPZihpdGVtLmNhbmRpZGF0ZUlkKTsgICAgLy8gPC0tIE5vdCBzdXBwb3J0ZWQgaW4gPElFOVxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgbGlzdC5pZHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgdXBkYXRlZFF1ZXJ5MyA9IHtcbiAgICAgICAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgICAgICAgICdwb3N0ZWRKb2JzLiQuY2FuZGlkYXRlX2xpc3QnOiBqb2IuY2FuZGlkYXRlX2xpc3RcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGxldCBwYXJhbTI6IGFueTtcbiAgICAgICAgICAgICAgdXBkYXRlRmxhZyA/IHBhcmFtMiA9IHVwZGF0ZWRRdWVyeTMgOiBwYXJhbTIgPSB1cGRhdGVkUXVlcnkyO1xuXG4gICAgICAgICAgICAgIHRoaXMucmVjcnVpdGVyUmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHVwZGF0ZWRRdWVyeTEsIHBhcmFtMiwgdXBkYXRlZFF1ZXJ5NCwgKGVyciwgcmVjb3JkKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJlY29yZCkge1xuICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVjb3JkKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgbGV0IGVycm9yOiBhbnk7XG4gICAgICAgICAgICAgICAgICBpZiAocmVjb3JkID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yID0gbmV3IEVycm9yKCdVbmFibGUgdG8gYWRkIGNhbmRpZGF0ZS4nKTtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG5cbiAgYXBwbHlKb2IoaXRlbTogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XG5cblxuICAgIHRoaXMuY2FuZGlkYXRlUmVwb3NpdG9yeS5yZXRyaWV2ZSh7J19pZCc6IG5ldyBtb25nb29zZS5UeXBlcy5PYmplY3RJZChpdGVtLmNhbmRpZGF0ZUlkKX0sIChlcnJvciwgcmVzcG9uc2UpID0+IHtcblxuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcignTm8gY2FuZGlkYXRlIEZvdW5kJyksIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHJlc3BvbnNlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBsZXQgdXBkYXRlRXhpc3RpbmdRdWVyeUZvckNhbmRpZGF0ZTogYW55O1xuICAgICAgICAgIGxldCBpc0pvYkZvdW5kOiBib29sZWFuID0gZmFsc2U7XG4gICAgICAgICAgZm9yIChsZXQgbGlzdCBvZiByZXNwb25zZVswXS5qb2JfbGlzdCkge1xuICAgICAgICAgICAgaWYgKGxpc3QubmFtZSA9PSBpdGVtLmxpc3ROYW1lKSB7XG4gICAgICAgICAgICAgIGlzSm9iRm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICBpZiAoaXRlbS5hY3Rpb24gPT0gJ2FkZCcpIHtcbiAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSBsaXN0Lmlkcy5pbmRleE9mKGl0ZW0ucHJvZmlsZUlkKTtcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgIGxldCB1c2VzX2RhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbmRpZGF0ZUlkOiBpdGVtLmNhbmRpZGF0ZUlkLFxuICAgICAgICAgICAgICAgICAgICBqb2JQcm9maWxlSWQ6IGl0ZW0ucHJvZmlsZUlkLFxuICAgICAgICAgICAgICAgICAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCksXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbjogQWN0aW9ucy5ERUZBVUxUX1ZBTFVFXG4gICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgbGV0IHNoYXJlZFNlcnZpY2U6IFNoYXJlZFNlcnZpY2UgPSBuZXcgU2hhcmVkU2VydmljZSgpO1xuICAgICAgICAgICAgICAgICAgdXNlc19kYXRhLmFjdGlvbiA9IHNoYXJlZFNlcnZpY2UuY29uc3RydWN0QWRkQWN0aW9uRGF0YShpdGVtLmxpc3ROYW1lKTtcbiAgICAgICAgICAgICAgICAgIHRoaXMudXNlc1RyYWNraW5nQ29udHJvbGxlci5jcmVhdGUodXNlc19kYXRhKTtcbiAgICAgICAgICAgICAgICAgIGxpc3QuaWRzLnB1c2goaXRlbS5wcm9maWxlSWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChpdGVtLmFjdGlvbiA9PSAncmVtb3ZlJyAmJiBpdGVtLmxpc3ROYW1lICE9ICdhcHBsaWVkJykge1xuICAgICAgICAgICAgICAgIGxldCB1c2VzX2RhdGEgPSB7XG4gICAgICAgICAgICAgICAgICBjYW5kaWRhdGVJZDogaXRlbS5jYW5kaWRhdGVJZCxcbiAgICAgICAgICAgICAgICAgIGpvYlByb2ZpbGVJZDogaXRlbS5wcm9maWxlSWQsXG4gICAgICAgICAgICAgICAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCksXG4gICAgICAgICAgICAgICAgICBhY3Rpb246IEFjdGlvbnMuREVGQVVMVF9WQUxVRVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgbGV0IHNoYXJlZFNlcnZpY2U6IFNoYXJlZFNlcnZpY2UgPSBuZXcgU2hhcmVkU2VydmljZSgpO1xuICAgICAgICAgICAgICAgIHVzZXNfZGF0YS5hY3Rpb24gPSBzaGFyZWRTZXJ2aWNlLmNvbnN0cnVjdFJlbW92ZUFjdGlvbkRhdGEoaXRlbS5saXN0TmFtZSk7XG4gICAgICAgICAgICAgICAgdGhpcy51c2VzVHJhY2tpbmdDb250cm9sbGVyLmNyZWF0ZSh1c2VzX2RhdGEpO1xuICAgICAgICAgICAgICAgIGxldCBpbmRleCA9IGxpc3QuaWRzLmluZGV4T2YoaXRlbS5wcm9maWxlSWQpO1xuICAgICAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgIGxpc3QuaWRzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHVwZGF0ZUV4aXN0aW5nUXVlcnlGb3JDYW5kaWRhdGUgPSB7XG4gICAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgICAgJ2pvYl9saXN0JzogcmVzcG9uc2VbMF0uam9iX2xpc3RcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBsZXQgbmV3RW50cnlRdWVyeUZvckNhbmRpZGF0ZSA9IHtcbiAgICAgICAgICAgICRwdXNoOiB7XG4gICAgICAgICAgICAgICdqb2JfbGlzdCc6IHtcbiAgICAgICAgICAgICAgICAnbmFtZSc6IGl0ZW0ubGlzdE5hbWUsXG4gICAgICAgICAgICAgICAgJ2lkcyc6IGl0ZW0ucHJvZmlsZUlkXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICAgIGxldCBvcHRpb25zID0ge1xuICAgICAgICAgICAgJ25ldyc6IHRydWUsICd1cHNlcnQnOiB0cnVlXG4gICAgICAgICAgfTtcbiAgICAgICAgICBsZXQgbGF0ZXN0UXVlcnlGb3JDYW5kaWRhdGU6IGFueTtcbiAgICAgICAgICBpc0pvYkZvdW5kID8gbGF0ZXN0UXVlcnlGb3JDYW5kaWRhdGUgPSB1cGRhdGVFeGlzdGluZ1F1ZXJ5Rm9yQ2FuZGlkYXRlIDogbGF0ZXN0UXVlcnlGb3JDYW5kaWRhdGUgPSBuZXdFbnRyeVF1ZXJ5Rm9yQ2FuZGlkYXRlO1xuICAgICAgICAgIGxldCBjYW5kaWRhdGVTZWFyY2hRdWVyeSA9IHtcbiAgICAgICAgICAgICdfaWQnOiBpdGVtLmNhbmRpZGF0ZUlkXG4gICAgICAgICAgfTtcblxuICAgICAgICAgIHRoaXMuY2FuZGlkYXRlUmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKGNhbmRpZGF0ZVNlYXJjaFF1ZXJ5LCBsYXRlc3RRdWVyeUZvckNhbmRpZGF0ZSwgb3B0aW9ucywgKGVyciwgcmVjb3JkKSA9PiB7XG4gICAgICAgICAgICBpZiAocmVjb3JkKSB7XG4gICAgICAgICAgICAgIGlmIChpdGVtLmxpc3ROYW1lID09ICdhcHBsaWVkJyAmJiBpdGVtLmFjdGlvbiA9PSAnYWRkJykge1xuICAgICAgICAgICAgICAgIGxldCBxdWVyeSA9IHtcbiAgICAgICAgICAgICAgICAgICdwb3N0ZWRKb2JzJzogeyRlbGVtTWF0Y2g6IHsnX2lkJzogbmV3IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkKGl0ZW0ucHJvZmlsZUlkKX19XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBsZXQgbmV3RW50cnlRdWVyeSA9IHtcbiAgICAgICAgICAgICAgICAgICRwdXNoOiB7XG4gICAgICAgICAgICAgICAgICAgICdwb3N0ZWRKb2JzLiQuY2FuZGlkYXRlX2xpc3QnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgJ25hbWUnOiBDb25zdFZhcmlhYmxlcy5BUFBMSUVEX0NBTkRJREFURSxcbiAgICAgICAgICAgICAgICAgICAgICAnaWRzJzogaXRlbS5jYW5kaWRhdGVJZFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBsZXQgdXBkYXRlRXhpc3RpbmdRdWVyeTogYW55O1xuICAgICAgICAgICAgICAgIHRoaXMucmVjcnVpdGVyUmVwb3NpdG9yeS5yZXRyaWV2ZShxdWVyeSwgKGVyciwgcmVzKSA9PiB7XG4gICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcignTm90IEZvdW5kIEFueSBKb2IgcG9zdGVkJyksIG51bGwpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBpc0ZvdW5kOiBib29sZWFuID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGpvYiBvZiByZXNbMF0ucG9zdGVkSm9icykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGpvYi5faWQudG9TdHJpbmcoKSA9PT0gaXRlbS5wcm9maWxlSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgbGlzdCBvZiBqb2IuY2FuZGlkYXRlX2xpc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobGlzdC5uYW1lID09IENvbnN0VmFyaWFibGVzLkFQUExJRURfQ0FORElEQVRFKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0ZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpbmRleCA9IGxpc3QuaWRzLmluZGV4T2YoaXRlbS5jYW5kaWRhdGVJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdC5pZHMucHVzaChpdGVtLmNhbmRpZGF0ZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZUV4aXN0aW5nUXVlcnkgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAncG9zdGVkSm9icy4kLmNhbmRpZGF0ZV9saXN0Jzogam9iLmNhbmRpZGF0ZV9saXN0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgbGV0IGxhdGVzdFF1ZXJ5OiBhbnk7XG4gICAgICAgICAgICAgICAgICAgICAgaXNGb3VuZCA/IGxhdGVzdFF1ZXJ5ID0gdXBkYXRlRXhpc3RpbmdRdWVyeSA6IGxhdGVzdFF1ZXJ5ID0gbmV3RW50cnlRdWVyeTtcbiAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVjcnVpdGVyU2VhcmNoUXVlcnkgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnX2lkJzogcmVzWzBdLl9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICdwb3N0ZWRKb2JzLl9pZCc6IGl0ZW0ucHJvZmlsZUlkXG4gICAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVjcnVpdGVyUmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHJlY3J1aXRlclNlYXJjaFF1ZXJ5LCBsYXRlc3RRdWVyeSwgb3B0aW9ucywgKGVyciwgcmVjb3JkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVjb3JkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJlY29yZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZXJyb3I6IGFueTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlY29yZCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yID0gbmV3IEVycm9yKCdVbmFibGUgdG8gYWRkIGNhbmRpZGF0ZS4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVjb3JkKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgbGV0IGVycm9yOiBhbnk7XG4gICAgICAgICAgICAgIGlmIChyZWNvcmQgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBlcnJvciA9IG5ldyBFcnJvcignVW5hYmxlIHRvIGFkZCBKb2IgdG8gTGlzdC4nKTtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuXG4gIH1cblxuICBnZXRRQ2FyZERldGFpbHMoaXRlbTogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XG4gICAgbGV0IGNhbmRpZGF0ZURldGFpbHM6IGFueTtcblxuICAgIHRoaXMuY2FuZGlkYXRlUmVwb3NpdG9yeS5yZXRyaWV2ZUJ5TXVsdGlJZHMoaXRlbS5jYW5kaWRhdGVJZHMsIHt9LCAoZXJyLCBjYW5kaWRhdGVEZXRhaWxzUmVzKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYW5kaWRhdGVEZXRhaWxzID0gY2FuZGlkYXRlRGV0YWlsc1JlcztcbiAgICAgICAgbGV0IHF1ZXJ5ID0ge1xuICAgICAgICAgICdwb3N0ZWRKb2JzJzogeyRlbGVtTWF0Y2g6IHsnX2lkJzogbmV3IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkKGl0ZW0uam9iSWQpfX1cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5yZWNydWl0ZXJSZXBvc2l0b3J5LnJldHJpZXZlKHF1ZXJ5LCAoZXJyLCByZXMpID0+IHtcbiAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoJ05vdCBGb3VuZCBBbnkgSm9iIHBvc3RlZCcpLCBudWxsKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAocmVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgbGV0IHJlY3J1aXRlcjogUmVjcnVpdGVyID0gbmV3IFJlY3J1aXRlcigpO1xuICAgICAgICAgICAgICByZWNydWl0ZXIgPSByZXNbMF07XG4gICAgICAgICAgICAgIGZvciAobGV0IGpvYiBvZiByZXNbMF0ucG9zdGVkSm9icykge1xuICAgICAgICAgICAgICAgIGlmIChqb2IuX2lkLnRvU3RyaW5nKCkgPT09IGl0ZW0uam9iSWQpIHtcbiAgICAgICAgICAgICAgICAgIHRoaXMuY2FuZGlkYXRlUmVwb3NpdG9yeS5nZXRDYW5kaWRhdGVRQ2FyZChjYW5kaWRhdGVEZXRhaWxzLCBqb2IsIHVuZGVmaW5lZCwgY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuXG59XG5cbk9iamVjdC5zZWFsKEpvYlByb2ZpbGVTZXJ2aWNlKTtcbmV4cG9ydCA9IEpvYlByb2ZpbGVTZXJ2aWNlO1xuIl19
