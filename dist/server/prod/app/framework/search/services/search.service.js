"use strict";
var CandidateRepository = require("../../dataaccess/repository/candidate.repository");
var ProjectAsset = require("../../shared/projectasset");
var RecruiterRepository = require("../../dataaccess/repository/recruiter.repository");
var JobProfileService = require("../../services/jobprofile.service");
var sharedconstants_1 = require("../../shared/sharedconstants");
var profile_comparison_data_model_1 = require("../../dataaccess/model/profile-comparison-data.model");
var capability_matrix_model_1 = require("../../dataaccess/model/capability-matrix.model");
var profile_comparison_model_1 = require("../../dataaccess/model/profile-comparison.model");
var profile_comparison_job_model_1 = require("../../dataaccess/model/profile-comparison-job.model");
var mongoose = require("mongoose");
var candidatedetailswithjobmatching_1 = require("../../dataaccess/model/candidatedetailswithjobmatching");
var utility_function_1 = require("../../uitility/utility-function");
var MatchViewModel = require("../../dataaccess/model/match-view.model");
var Match = require("../../dataaccess/model/match-enum");
var IndustryRepository = require("../../dataaccess/repository/industry.repository");
var usestracking = require('uses-tracking');
var SearchService = (function () {
    function SearchService() {
        this.APP_NAME = ProjectAsset.APP_NAME;
        this.candidateRepository = new CandidateRepository();
        this.recruiterRepository = new RecruiterRepository();
        this.industryRepository = new IndustryRepository();
        var obj = new usestracking.MyController();
        this.usesTrackingController = obj._controller;
    }
    SearchService.prototype.getMatchingCandidates = function (jobProfile, callback) {
        var _this = this;
        console.time('getMatching Candidate');
        var data;
        var isFound = false;
        var industries = [];
        var isReleventIndustriesFound = false;
        if (jobProfile.interestedIndustries && jobProfile.interestedIndustries.length > 0) {
            for (var _i = 0, _a = jobProfile.interestedIndustries; _i < _a.length; _i++) {
                var name_1 = _a[_i];
                if (name_1 === 'None') {
                    isFound = true;
                }
            }
            if (jobProfile.releventIndustries && jobProfile.releventIndustries.length) {
                isReleventIndustriesFound = true;
            }
            if (isFound) {
                if (isReleventIndustriesFound) {
                    industries = jobProfile.releventIndustries;
                    industries.push(jobProfile.industry.name);
                    data = {
                        'industry.name': { $in: industries },
                        $or: [
                            { 'professionalDetails.relocate': 'Yes' },
                            { 'location.city': jobProfile.location.city }
                        ],
                        'proficiencies': { $in: jobProfile.proficiencies },
                        'isVisible': true,
                    };
                }
                else {
                    data = {
                        'industry.name': jobProfile.industry.name,
                        $or: [
                            { 'professionalDetails.relocate': 'Yes' },
                            { 'location.city': jobProfile.location.city }
                        ],
                        'proficiencies': { $in: jobProfile.proficiencies },
                        'isVisible': true,
                    };
                }
            }
            else {
                if (isReleventIndustriesFound) {
                    industries = jobProfile.releventIndustries;
                    industries.push(jobProfile.industry.name);
                    data = {
                        'industry.name': { $in: industries },
                        $or: [
                            { 'professionalDetails.relocate': 'Yes' },
                            { 'location.city': jobProfile.location.city }
                        ],
                        'proficiencies': { $in: jobProfile.proficiencies },
                        'interestedIndustries': { $in: jobProfile.interestedIndustries },
                        'isVisible': true,
                    };
                }
                else {
                    data = {
                        'industry.name': jobProfile.industry.name,
                        $or: [
                            { 'professionalDetails.relocate': 'Yes' },
                            { 'location.city': jobProfile.location.city }
                        ],
                        'proficiencies': { $in: jobProfile.proficiencies },
                        'interestedIndustries': { $in: jobProfile.interestedIndustries },
                        'isVisible': true,
                    };
                }
            }
        }
        else {
            data = {
                'isVisible': true,
                'industry.name': jobProfile.industry.name,
                'proficiencies': { $in: jobProfile.proficiencies },
                $or: [
                    { 'professionalDetails.relocate': 'Yes' },
                    { 'location.city': jobProfile.location.city }
                ]
            };
        }
        var included_fields = {
            'industry.roles.capabilities.complexities.scenarios.code': 1,
            'industry.roles.capabilities.complexities.scenarios.isChecked': 1,
            'industry.roles.default_complexities.complexities.scenarios.code': 1,
            'industry.roles.default_complexities.complexities.scenarios.isChecked': 1,
            'userId': 1,
            'proficiencies': 1,
            'location': 1,
            'interestedIndustries': 1,
            'professionalDetails': 1,
            'capability_matrix': 1
        };
        this.candidateRepository.retrieveWithLean(data, included_fields, function (err, res) {
            if (err) {
                callback(err, null);
            }
            else {
                _this.candidateRepository.getCandidateQCard(res, jobProfile, undefined, callback);
            }
        });
    };
    SearchService.prototype.getMatchingJobProfile = function (candidate, callback) {
        var _this = this;
        var currentDate = new Date();
        var data = {
            'postedJobs.industry.name': candidate.industry.name,
            'postedJobs.proficiencies': { $in: candidate.proficiencies },
            'postedJobs.expiringDate': { $gte: currentDate }
        };
        var excluded_fields = {
            'postedJobs.industry.roles': 0,
        };
        this.recruiterRepository.retrieveWithLean(data, excluded_fields, function (err, res) {
            if (err) {
                callback(err, null);
            }
            else {
                _this.recruiterRepository.getJobProfileQCard(res, candidate, undefined, 'none', callback);
            }
        });
    };
    SearchService.prototype.getMatchingResult = function (candidateId, jobId, isCandidate, callback) {
        var _this = this;
        var uses_data = {
            candidateId: candidateId,
            jobProfileId: jobId,
            timestamp: new Date(),
            action: sharedconstants_1.Actions.DEFAULT_VALUE
        };
        if (isCandidate) {
            uses_data.action = sharedconstants_1.Actions.VIEWED_JOB_PROFILE_BY_CANDIDATE;
        }
        else {
            uses_data.action = sharedconstants_1.Actions.VIEWED_FULL_PROFILE_BY_RECRUITER;
        }
        this.usesTrackingController.create(uses_data);
        this.candidateRepository.findByIdwithExclude(candidateId, { 'industry': 0 }, function (err, candidateRes) {
            if (err) {
                callback(err, null);
            }
            else {
                if (candidateRes) {
                    var data = {
                        'postedJob': jobId
                    };
                    var jobProfileService = new JobProfileService();
                    jobProfileService.retrieve(data, function (errInJob, resOfRecruiter) {
                        if (errInJob) {
                            callback(errInJob, null);
                        }
                        else {
                            _this.getResult(candidateRes, resOfRecruiter.postedJobs[0], isCandidate, callback);
                        }
                    });
                }
            }
        });
    };
    SearchService.prototype.compareTwoOptions = function (first, second) {
        if (first < second) {
            return 'below';
        }
        else if (first > second) {
            return 'above';
        }
        else {
            return 'exact';
        }
    };
    SearchService.prototype.getEductionSwitchCase = function (education) {
        switch (education) {
            case 'Under Graduate':
                return 1;
            case 'Graduate':
                return 2;
            case 'Post Graduate':
                return 3;
        }
        return -1;
    };
    SearchService.prototype.getPeriodSwitchCase = function (period) {
        switch (period) {
            case 'Immediate':
                return 1;
            case 'Within 1 months':
                return 2;
            case '1-2 Months':
                return 3;
            case '2-3 Months':
                return 4;
            case 'Beyond 3 months':
                return 5;
        }
        return -1;
    };
    SearchService.prototype.getResult = function (candidate, job, isCandidate, callback) {
        var _this = this;
        this.industryRepository.retrieve({ 'name': job.industry.name }, function (err, industries) {
            if (err) {
                callback(err, null);
            }
            else {
                var newCandidate = _this.getCompareData(candidate, job, isCandidate, industries);
                callback(null, newCandidate);
            }
        });
    };
    SearchService.prototype.getCompareData = function (candidate, job, isCandidate, industries) {
        var newCandidate = this.buildCandidateModel(candidate);
        var jobMinExperience = Number(job.experienceMinValue);
        var jobMaxExperience = Number(job.experienceMaxValue);
        var jobMinSalary = Number(job.salaryMinValue);
        var jobMaxSalary = Number(job.salaryMaxValue);
        var candiExperience = newCandidate.professionalDetails.experience.split(' ');
        var canSalary = newCandidate.professionalDetails.currentSalary.split(' ');
        if ((jobMaxExperience >= Number(candiExperience[0])) && (jobMinExperience <= Number(candiExperience[0]))) {
            newCandidate.experienceMatch = 'exact';
        }
        else {
            newCandidate.experienceMatch = 'missing';
        }
        if ((jobMaxSalary >= Number(canSalary[0])) && (jobMinSalary <= Number(canSalary[0]))) {
            newCandidate.salaryMatch = 'exact';
        }
        else {
            newCandidate.salaryMatch = 'missing';
        }
        var canEducation = this.getEductionSwitchCase(newCandidate.professionalDetails.education);
        var jobEducation = this.getEductionSwitchCase(job.education);
        newCandidate.educationMatch = this.compareTwoOptions(canEducation, jobEducation);
        newCandidate.releaseMatch = this.compareTwoOptions(this.getPeriodSwitchCase(newCandidate.professionalDetails.noticePeriod), this.getPeriodSwitchCase(job.joiningPeriod));
        newCandidate.interestedIndustryMatch = new Array(0);
        for (var _i = 0, _a = job.interestedIndustries; _i < _a.length; _i++) {
            var industry = _a[_i];
            if (newCandidate.interestedIndustries.indexOf(industry) !== -1) {
                newCandidate.interestedIndustryMatch.push(industry);
            }
        }
        newCandidate.proficienciesMatch = new Array(0);
        for (var _b = 0, _c = job.proficiencies; _b < _c.length; _b++) {
            var proficiency = _c[_b];
            if (newCandidate.proficiencies.indexOf(proficiency) !== -1) {
                newCandidate.proficienciesMatch.push(proficiency);
            }
        }
        newCandidate.proficienciesUnMatch = new Array(0);
        for (var _d = 0, _e = job.proficiencies; _d < _e.length; _d++) {
            var proficiency = _e[_d];
            if (newCandidate.proficienciesMatch.indexOf(proficiency) == -1) {
                newCandidate.proficienciesUnMatch.push(proficiency);
            }
        }
        newCandidate = this.buildMultiCompareCapabilityView(job, newCandidate, industries, isCandidate);
        newCandidate = this.buildCompareView(job, newCandidate, industries, isCandidate);
        newCandidate = this.getAdditionalCapabilities(job, newCandidate, industries);
        return newCandidate;
    };
    SearchService.prototype.buildCandidateModel = function (candidate) {
        var profileComparisonResult = new profile_comparison_data_model_1.ProfileComparisonDataModel();
        profileComparisonResult._id = candidate._id;
        profileComparisonResult.industryName = candidate.industry.name;
        profileComparisonResult.aboutMyself = candidate.aboutMyself;
        profileComparisonResult.academics = candidate.academics;
        profileComparisonResult.professionalDetails = candidate.professionalDetails;
        profileComparisonResult.awards = candidate.awards;
        profileComparisonResult.capability_matrix = candidate.capability_matrix;
        profileComparisonResult.experienceMatch = '';
        profileComparisonResult.certifications = candidate.certifications;
        profileComparisonResult.employmentHistory = candidate.employmentHistory;
        profileComparisonResult.interestedIndustries = candidate.interestedIndustries;
        profileComparisonResult.isSubmitted = candidate.isSubmitted;
        profileComparisonResult.isVisible = candidate.isVisible;
        profileComparisonResult.location = candidate.location;
        profileComparisonResult.job_list = candidate.job_list;
        profileComparisonResult.educationMatch = '';
        profileComparisonResult.proficiencies = candidate.proficiencies;
        profileComparisonResult.profileComparisonHeader = candidate.userId;
        profileComparisonResult.roleType = candidate.roleType;
        profileComparisonResult.salaryMatch = '';
        profileComparisonResult.secondaryCapability = candidate.secondaryCapability;
        profileComparisonResult.lockedOn = candidate.lockedOn;
        profileComparisonResult.match_map = {};
        profileComparisonResult.capabilityMap = {};
        return profileComparisonResult;
    };
    SearchService.prototype.buildMultiCompareCapabilityView = function (job, newCandidate, industries, isCandidate) {
        var capabilityPercentage = new Array(0);
        var capabilityKeys = new Array(0);
        var correctQestionCountForAvgPercentage = 0;
        var qestionCountForAvgPercentsge = 0;
        for (var cap in job.capability_matrix) {
            var capabilityKey = cap.split('_');
            if (capabilityKeys.indexOf(capabilityKey[0]) == -1) {
                capabilityKeys.push(capabilityKey[0]);
            }
        }
        for (var _i = 0, capabilityKeys_1 = capabilityKeys; _i < capabilityKeys_1.length; _i++) {
            var _cap = capabilityKeys_1[_i];
            var isCapabilityFound = false;
            var capabilityQuestionCount = 0;
            var matchCount = 0;
            for (var cap in job.capability_matrix) {
                if (_cap == cap.split('_')[0]) {
                    if (job.capability_matrix[cap] == -1 || job.capability_matrix[cap] == 0 || job.capability_matrix[cap] == undefined) {
                    }
                    else if (job.capability_matrix[cap] == newCandidate.capability_matrix[cap]) {
                        matchCount++;
                        capabilityQuestionCount++;
                        correctQestionCountForAvgPercentage++;
                        qestionCountForAvgPercentsge++;
                    }
                    else if (job.capability_matrix[cap] == (Number(newCandidate.capability_matrix[cap]) - sharedconstants_1.ConstVariables.DIFFERENCE_IN_COMPLEXITY_SCENARIO)) {
                        matchCount++;
                        capabilityQuestionCount++;
                        correctQestionCountForAvgPercentage++;
                        qestionCountForAvgPercentsge++;
                    }
                    else if (job.capability_matrix[cap] == (Number(newCandidate.capability_matrix[cap]) + sharedconstants_1.ConstVariables.DIFFERENCE_IN_COMPLEXITY_SCENARIO)) {
                        capabilityQuestionCount++;
                        qestionCountForAvgPercentsge++;
                    }
                    else {
                        capabilityQuestionCount++;
                        qestionCountForAvgPercentsge++;
                    }
                }
            }
            var capabilityModel = new capability_matrix_model_1.CapabilityMatrixModel();
            var capName;
            var complexity;
            for (var _a = 0, _b = industries[0].roles; _a < _b.length; _a++) {
                var role = _b[_a];
                for (var _c = 0, _d = role.capabilities; _c < _d.length; _c++) {
                    var capability = _d[_c];
                    if (_cap == capability.code) {
                        isCapabilityFound = true;
                        capName = capability.name;
                        complexity = capability.complexities;
                        break;
                    }
                }
                for (var _e = 0, _f = role.default_complexities; _e < _f.length; _e++) {
                    var capability = _f[_e];
                    if (_cap == capability.code) {
                        isCapabilityFound = true;
                        capName = capability.name;
                        complexity = capability.complexities;
                        break;
                    }
                }
            }
            var percentage = 0;
            if (capabilityQuestionCount) {
                percentage = (matchCount / capabilityQuestionCount) * 100;
            }
            capabilityModel.capabilityName = capName;
            capabilityModel.capabilityPercentage = percentage;
            capabilityModel.complexities = complexity;
            capabilityPercentage.push(percentage);
            if (isCapabilityFound) {
                newCandidate['capabilityMap'][_cap] = capabilityModel;
            }
        }
        var avgPercentage = 0;
        if (qestionCountForAvgPercentsge) {
            avgPercentage = ((correctQestionCountForAvgPercentage / qestionCountForAvgPercentsge) * 100);
        }
        newCandidate.matchingPercentage = avgPercentage;
        return newCandidate;
    };
    SearchService.prototype.getAdditionalCapabilities = function (job, newCandidate, industries) {
        newCandidate.additionalCapabilites = new Array(0);
        for (var cap in newCandidate.capability_matrix) {
            var isFound = false;
            for (var jobCap in job.capability_matrix) {
                if (cap.substr(0, cap.indexOf('_')) === jobCap.substr(0, jobCap.indexOf('_'))) {
                    isFound = true;
                    break;
                }
            }
            if (!isFound) {
                for (var _i = 0, _a = industries[0].roles; _i < _a.length; _i++) {
                    var role = _a[_i];
                    for (var _b = 0, _c = role.capabilities; _b < _c.length; _b++) {
                        var capability = _c[_b];
                        for (var _d = 0, _e = capability.complexities; _d < _e.length; _d++) {
                            var complexity = _e[_d];
                            var custom_code = capability.code + '_' + complexity.code;
                            if (custom_code === cap) {
                                if (newCandidate.additionalCapabilites.indexOf(capability.name) == -1) {
                                    newCandidate.additionalCapabilites.push(capability.name);
                                }
                            }
                        }
                    }
                }
            }
        }
        return newCandidate;
    };
    SearchService.prototype.buildCompareView = function (job, newCandidate, industries, isCandidate) {
        var _loop_1 = function (cap) {
            var match_view = new MatchViewModel();
            if (job.capability_matrix[cap] == -1 || job.capability_matrix[cap] == 0 || job.capability_matrix[cap] == undefined || newCandidate.capability_matrix[cap] == undefined ||
                newCandidate.capability_matrix[cap] == 0 || newCandidate.capability_matrix[cap] == -1) {
                match_view.match = Match.MissMatch;
            }
            else if (job.capability_matrix[cap] == newCandidate.capability_matrix[cap]) {
                match_view.match = Match.Exact;
            }
            else if (job.capability_matrix[cap] == (Number(newCandidate.capability_matrix[cap]) - sharedconstants_1.ConstVariables.DIFFERENCE_IN_COMPLEXITY_SCENARIO)) {
                match_view.match = Match.Above;
            }
            else if (job.capability_matrix[cap] == (Number(newCandidate.capability_matrix[cap]) + sharedconstants_1.ConstVariables.DIFFERENCE_IN_COMPLEXITY_SCENARIO)) {
                match_view.match = Match.Below;
            }
            else {
                match_view.match = Match.MissMatch;
            }
            var isFound = false;
            for (var _i = 0, _a = industries[0].roles; _i < _a.length; _i++) {
                var role = _a[_i];
                for (var _b = 0, _c = role.capabilities; _b < _c.length; _b++) {
                    var capability = _c[_b];
                    for (var _d = 0, _e = capability.complexities; _d < _e.length; _d++) {
                        var complexity = _e[_d];
                        var custom_code = capability.code + '_' + complexity.code;
                        if (custom_code === cap) {
                            isFound = true;
                            var scenarios = complexity.scenarios.filter(function (sce) {
                                sce.code = sce.code.replace('.', '_');
                                sce.code = sce.code.replace('.', '_');
                                sce.code = sce.code.substr(sce.code.lastIndexOf('_') + 1);
                                if (sce.code == newCandidate.capability_matrix[cap]) {
                                    return true;
                                }
                                else {
                                    return false;
                                }
                            });
                            var job_scenarios = complexity.scenarios.filter(function (sce) {
                                sce.code = sce.code.replace('.', '_');
                                sce.code = sce.code.replace('.', '_');
                                sce.code = sce.code.substr(sce.code.lastIndexOf('_') + 1);
                                if (sce.code == job.capability_matrix[cap]) {
                                    return true;
                                }
                                else {
                                    return false;
                                }
                            });
                            match_view.capability_name = capability.name;
                            match_view.complexity_name = complexity.name;
                            if (job_scenarios[0]) {
                                match_view.job_scenario_name = job_scenarios[0].name;
                            }
                            if (scenarios[0]) {
                                match_view.candidate_scenario_name = scenarios[0].name;
                            }
                            match_view.scenario_name = match_view.job_scenario_name;
                            break;
                        }
                    }
                    if (isFound) {
                        break;
                    }
                }
                for (var _f = 0, _g = role.default_complexities; _f < _g.length; _f++) {
                    var capability = _g[_f];
                    for (var _h = 0, _j = capability.complexities; _h < _j.length; _h++) {
                        var complexity = _j[_h];
                        var custom_code = capability.code + '_' + complexity.code;
                        if (custom_code === cap) {
                            isFound = true;
                            var scenarios = complexity.scenarios.filter(function (sce) {
                                sce.code = sce.code.replace('.', '_');
                                sce.code = sce.code.replace('.', '_');
                                sce.code = sce.code.substr(sce.code.lastIndexOf('_') + 1);
                                if (sce.code == newCandidate.capability_matrix[cap]) {
                                    return true;
                                }
                                else {
                                    return false;
                                }
                            });
                            var job_scenarios = complexity.scenarios.filter(function (sce) {
                                sce.code = sce.code.replace('.', '_');
                                sce.code = sce.code.replace('.', '_');
                                sce.code = sce.code.substr(sce.code.lastIndexOf('_') + 1);
                                if (sce.code == job.capability_matrix[cap]) {
                                    return true;
                                }
                                else {
                                    return false;
                                }
                            });
                            match_view.capability_name = capability.name;
                            match_view.complexity_name = complexity.name;
                            if (job_scenarios[0]) {
                                match_view.job_scenario_name = job_scenarios[0].name;
                            }
                            if (scenarios[0]) {
                                match_view.candidate_scenario_name = scenarios[0].name;
                            }
                            match_view.scenario_name = match_view.job_scenario_name;
                            break;
                        }
                    }
                    if (isFound) {
                        break;
                    }
                }
                if (isFound) {
                    break;
                }
            }
            if (match_view.capability_name != undefined) {
                newCandidate['match_map'][cap] = match_view;
            }
        };
        for (var cap in job.capability_matrix) {
            _loop_1(cap);
        }
        return newCandidate;
    };
    SearchService.prototype.getMultiCompareResult = function (candidate, jobId, recruiterId, isCandidate, callback) {
        var _this = this;
        this.candidateRepository.retrieveByMultiIdsAndPopulate(candidate, {}, function (err, candidateRes) {
            if (err) {
                callback(err, null);
            }
            else {
                if (candidateRes.length > 0) {
                    var data = {
                        'postedJob': jobId
                    };
                    var jobProfileService = new JobProfileService();
                    jobProfileService.retrieve(data, function (errInJob, resOfRecruiter) {
                        if (errInJob) {
                            callback(errInJob, null);
                        }
                        else {
                            var jobName = resOfRecruiter.postedJobs[0].industry.name;
                            var job = resOfRecruiter.postedJobs[0];
                            _this.industryRepository.retrieve({ 'name': jobName }, function (err, industries) {
                                if (err) {
                                    callback(err, null);
                                }
                                else {
                                    var compareResult = new Array(0);
                                    for (var _i = 0, candidateRes_1 = candidateRes; _i < candidateRes_1.length; _i++) {
                                        var candidate_1 = candidateRes_1[_i];
                                        var newCandidate = _this.getCompareData(candidate_1, job, isCandidate, industries);
                                        newCandidate = _this.getListStatusOfCandidate(newCandidate, job);
                                        newCandidate = _this.sortCandidateSkills(newCandidate);
                                        compareResult.push(newCandidate);
                                    }
                                    var profileComparisonModel = new profile_comparison_model_1.ProfileComparisonModel();
                                    profileComparisonModel.profileComparisonData = compareResult;
                                    var jobDetails = _this.getJobDetailsForComparison(job);
                                    profileComparisonModel.profileComparisonJobData = jobDetails;
                                    callback(null, profileComparisonModel);
                                }
                            });
                        }
                    });
                }
                else {
                    callback(null, 'No Candidate Profile Result Found');
                }
            }
        });
    };
    SearchService.prototype.getJobDetailsForComparison = function (job) {
        var profileComparisonJobModel = new profile_comparison_job_model_1.ProfileComparisonJobModel();
        profileComparisonJobModel.city = job.location.city;
        profileComparisonJobModel.country = job.location.country;
        profileComparisonJobModel.state = job.location.state;
        profileComparisonJobModel.education = job.education;
        profileComparisonJobModel.experienceMaxValue = job.experienceMaxValue;
        profileComparisonJobModel.experienceMinValue = job.experienceMinValue;
        profileComparisonJobModel.industryName = job.industry.name;
        profileComparisonJobModel.jobTitle = job.jobTitle;
        profileComparisonJobModel.joiningPeriod = job.joiningPeriod;
        profileComparisonJobModel.salaryMaxValue = job.salaryMaxValue;
        profileComparisonJobModel.salaryMinValue = job.salaryMinValue;
        profileComparisonJobModel.proficiencies = job.proficiencies;
        profileComparisonJobModel.interestedIndustries = job.interestedIndustries;
        return profileComparisonJobModel;
    };
    SearchService.prototype.getListStatusOfCandidate = function (newCandidate, jobProfile) {
        var candidateListStatus = new Array(0);
        for (var _i = 0, _a = jobProfile.candidate_list; _i < _a.length; _i++) {
            var list = _a[_i];
            for (var _b = 0, _c = list.ids; _b < _c.length; _b++) {
                var id = _c[_b];
                if (newCandidate._id == id) {
                    candidateListStatus.push(list.name);
                }
            }
        }
        if (candidateListStatus.length == 0) {
            candidateListStatus.push('matchedList');
        }
        newCandidate.candidateListStatus = candidateListStatus;
        return newCandidate;
    };
    SearchService.prototype.sortCandidateSkills = function (newCandidate) {
        var skillStatusData = new Array(0);
        for (var _i = 0, _a = newCandidate.proficienciesMatch; _i < _a.length; _i++) {
            var value = _a[_i];
            var skillStatus = new profile_comparison_data_model_1.SkillStatus();
            skillStatus.name = value;
            skillStatus.status = 'Match';
            skillStatusData.push(skillStatus);
        }
        for (var _b = 0, _c = newCandidate.proficienciesUnMatch; _b < _c.length; _b++) {
            var value = _c[_b];
            var skillStatus = new profile_comparison_data_model_1.SkillStatus();
            skillStatus.name = value;
            skillStatus.status = 'UnMatch';
            skillStatusData.push(skillStatus);
        }
        newCandidate.candidateSkillStatus = skillStatusData;
        return newCandidate;
    };
    SearchService.prototype.getCandidateVisibilityAgainstRecruiter = function (candidateDetails, jobProfiles) {
        var isGotIt = true;
        var _canDetailsWithJobMatching = new candidatedetailswithjobmatching_1.CandidateDetailsWithJobMatching();
        for (var _i = 0, jobProfiles_1 = jobProfiles; _i < jobProfiles_1.length; _i++) {
            var job = jobProfiles_1[_i];
            for (var _a = 0, _b = job.candidate_list; _a < _b.length; _a++) {
                var item = _b[_a];
                if (item.name === 'cartListed') {
                    if (item.ids.indexOf(new mongoose.Types.ObjectId(candidateDetails._id).toString()) !== -1) {
                        isGotIt = false;
                        break;
                    }
                }
            }
            if (!isGotIt) {
                break;
            }
        }
        if (isGotIt) {
            candidateDetails.userId.mobile_number = utility_function_1.UtilityFunction.mobileNumberHider(candidateDetails.userId.mobile_number);
            candidateDetails.userId.email = utility_function_1.UtilityFunction.emailValueHider(candidateDetails.userId.email);
            candidateDetails.academics = [];
            candidateDetails.employmentHistory = [];
            candidateDetails.areaOfWork = [];
            candidateDetails.proficiencies = [];
            candidateDetails.awards = [];
            candidateDetails.proficiencies = [];
            candidateDetails.professionalDetails.education = utility_function_1.UtilityFunction.valueHide(candidateDetails.professionalDetails.education);
            candidateDetails.professionalDetails.experience = utility_function_1.UtilityFunction.valueHide(candidateDetails.professionalDetails.experience);
            candidateDetails.professionalDetails.industryExposure = utility_function_1.UtilityFunction.valueHide(candidateDetails.professionalDetails.industryExposure);
            candidateDetails.professionalDetails.currentSalary = utility_function_1.UtilityFunction.valueHide(candidateDetails.professionalDetails.currentSalary);
            candidateDetails.professionalDetails.noticePeriod = utility_function_1.UtilityFunction.valueHide(candidateDetails.professionalDetails.noticePeriod);
            candidateDetails.professionalDetails.relocate = utility_function_1.UtilityFunction.valueHide(candidateDetails.professionalDetails.relocate);
        }
        candidateDetails.userId.password = '';
        _canDetailsWithJobMatching.candidateDetails = candidateDetails;
        _canDetailsWithJobMatching.isShowCandidateDetails = isGotIt;
        return _canDetailsWithJobMatching;
    };
    return SearchService;
}());
Object.seal(SearchService);
module.exports = SearchService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2VhcmNoL3NlcnZpY2VzL3NlYXJjaC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSxzRkFBeUY7QUFDekYsd0RBQTJEO0FBQzNELHNGQUF5RjtBQUV6RixxRUFBd0U7QUFDeEUsZ0VBQXFFO0FBQ3JFLHNHQUE2RztBQUM3RywwRkFBcUY7QUFDckYsNEZBQXVGO0FBQ3ZGLG9HQUE4RjtBQUM5RixtQ0FBcUM7QUFDckMsMEdBQXVHO0FBQ3ZHLG9FQUFnRTtBQUNoRSx3RUFBMkU7QUFDM0UseURBQTREO0FBQzVELG9GQUF1RjtBQUd2RixJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFFNUM7SUFPRTtRQUNFLElBQUksQ0FBQyxRQUFRLEdBQUcsWUFBWSxDQUFDLFFBQVEsQ0FBQztRQUN0QyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxtQkFBbUIsRUFBRSxDQUFDO1FBQ3JELElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLG1CQUFtQixFQUFFLENBQUM7UUFDckQsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksa0JBQWtCLEVBQUUsQ0FBQztRQUNuRCxJQUFJLEdBQUcsR0FBUSxJQUFJLFlBQVksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUMvQyxJQUFJLENBQUMsc0JBQXNCLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQztJQUNoRCxDQUFDO0lBRUQsNkNBQXFCLEdBQXJCLFVBQXNCLFVBQTJCLEVBQUUsUUFBMkM7UUFBOUYsaUJBMEdDO1FBekdDLE9BQU8sQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUN0QyxJQUFJLElBQVMsQ0FBQztRQUNkLElBQUksT0FBTyxHQUFZLEtBQUssQ0FBQztRQUM3QixJQUFJLFVBQVUsR0FBYSxFQUFFLENBQUM7UUFDOUIsSUFBSSx5QkFBeUIsR0FBWSxLQUFLLENBQUM7UUFDL0MsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLG9C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QixHQUFHLGtDQUFlLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLG1CQUFtQixDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDekksZ0JBQWdCLENBQUMsbUJBQW1CLENBQUMsYUFBYSxHQUFHLGtDQUFlLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLG1CQUFtQixDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ25JLGdCQUFnQixDQUFDLG1CQUFtQixDQUFDLFlBQVksR0FBRyxrQ0FBZSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxtQkFBbUIsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNqSSxnQkFBZ0IsQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLEdBQUcsa0NBQWUsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDM0gsQ0FBQztRQUNELGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO1FBQ3RDLDBCQUEwQixDQUFDLGdCQUFnQixHQUFHLGdCQUFnQixDQUFDO1FBQy9ELDBCQUEwQixDQUFDLHNCQUFzQixHQUFHLE9BQU8sQ0FBQztRQUM1RCxNQUFNLENBQUMsMEJBQTBCLENBQUM7SUFDcEMsQ0FBQztJQUNILG9CQUFDO0FBQUQsQ0FqcUJBLEFBaXFCQyxJQUFBO0FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUMzQixpQkFBUyxhQUFhLENBQUMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9zZWFyY2gvc2VydmljZXMvc2VhcmNoLnNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgSm9iUHJvZmlsZU1vZGVsID0gcmVxdWlyZSgnLi4vLi4vZGF0YWFjY2Vzcy9tb2RlbC9qb2Jwcm9maWxlLm1vZGVsJyk7XG5pbXBvcnQgQ2FuZGlkYXRlUmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uLy4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9jYW5kaWRhdGUucmVwb3NpdG9yeScpO1xuaW1wb3J0IFByb2plY3RBc3NldCA9IHJlcXVpcmUoJy4uLy4uL3NoYXJlZC9wcm9qZWN0YXNzZXQnKTtcbmltcG9ydCBSZWNydWl0ZXJSZXBvc2l0b3J5ID0gcmVxdWlyZSgnLi4vLi4vZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L3JlY3J1aXRlci5yZXBvc2l0b3J5Jyk7XG5pbXBvcnQgQ2FuZGlkYXRlTW9kZWwgPSByZXF1aXJlKCcuLi8uLi9kYXRhYWNjZXNzL21vZGVsL2NhbmRpZGF0ZS5tb2RlbCcpO1xuaW1wb3J0IEpvYlByb2ZpbGVTZXJ2aWNlID0gcmVxdWlyZSgnLi4vLi4vc2VydmljZXMvam9icHJvZmlsZS5zZXJ2aWNlJyk7XG5pbXBvcnQge0FjdGlvbnMsIENvbnN0VmFyaWFibGVzfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3NoYXJlZGNvbnN0YW50c1wiO1xuaW1wb3J0IHtQcm9maWxlQ29tcGFyaXNvbkRhdGFNb2RlbCwgU2tpbGxTdGF0dXN9IGZyb20gXCIuLi8uLi9kYXRhYWNjZXNzL21vZGVsL3Byb2ZpbGUtY29tcGFyaXNvbi1kYXRhLm1vZGVsXCI7XG5pbXBvcnQge0NhcGFiaWxpdHlNYXRyaXhNb2RlbH0gZnJvbSBcIi4uLy4uL2RhdGFhY2Nlc3MvbW9kZWwvY2FwYWJpbGl0eS1tYXRyaXgubW9kZWxcIjtcbmltcG9ydCB7UHJvZmlsZUNvbXBhcmlzb25Nb2RlbH0gZnJvbSBcIi4uLy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvZmlsZS1jb21wYXJpc29uLm1vZGVsXCI7XG5pbXBvcnQge1Byb2ZpbGVDb21wYXJpc29uSm9iTW9kZWx9IGZyb20gXCIuLi8uLi9kYXRhYWNjZXNzL21vZGVsL3Byb2ZpbGUtY29tcGFyaXNvbi1qb2IubW9kZWxcIjtcbmltcG9ydCAqIGFzIG1vbmdvb3NlIGZyb20gXCJtb25nb29zZVwiO1xuaW1wb3J0IHtDYW5kaWRhdGVEZXRhaWxzV2l0aEpvYk1hdGNoaW5nfSBmcm9tIFwiLi4vLi4vZGF0YWFjY2Vzcy9tb2RlbC9jYW5kaWRhdGVkZXRhaWxzd2l0aGpvYm1hdGNoaW5nXCI7XG5pbXBvcnQge1V0aWxpdHlGdW5jdGlvbn0gZnJvbSBcIi4uLy4uL3VpdGlsaXR5L3V0aWxpdHktZnVuY3Rpb25cIjtcbmltcG9ydCBNYXRjaFZpZXdNb2RlbCA9IHJlcXVpcmUoJy4uLy4uL2RhdGFhY2Nlc3MvbW9kZWwvbWF0Y2gtdmlldy5tb2RlbCcpO1xuaW1wb3J0IE1hdGNoID0gcmVxdWlyZSgnLi4vLi4vZGF0YWFjY2Vzcy9tb2RlbC9tYXRjaC1lbnVtJyk7XG5pbXBvcnQgSW5kdXN0cnlSZXBvc2l0b3J5ID0gcmVxdWlyZSgnLi4vLi4vZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L2luZHVzdHJ5LnJlcG9zaXRvcnknKTtcbmltcG9ydCBJbmR1c3RyeU1vZGVsID0gcmVxdWlyZSgnLi4vLi4vZGF0YWFjY2Vzcy9tb2RlbC9pbmR1c3RyeS5tb2RlbCcpO1xuaW1wb3J0IFNjZW5hcmlvTW9kZWwgPSByZXF1aXJlKCcuLi8uLi9kYXRhYWNjZXNzL21vZGVsL3NjZW5hcmlvLm1vZGVsJyk7XG5sZXQgdXNlc3RyYWNraW5nID0gcmVxdWlyZSgndXNlcy10cmFja2luZycpO1xuXG5jbGFzcyBTZWFyY2hTZXJ2aWNlIHtcbiAgQVBQX05BTUU6IHN0cmluZztcbiAgY2FuZGlkYXRlUmVwb3NpdG9yeTogQ2FuZGlkYXRlUmVwb3NpdG9yeTtcbiAgcmVjcnVpdGVyUmVwb3NpdG9yeTogUmVjcnVpdGVyUmVwb3NpdG9yeTtcbiAgaW5kdXN0cnlSZXBvc2l0b3J5OiBJbmR1c3RyeVJlcG9zaXRvcnk7XG4gIHByaXZhdGUgdXNlc1RyYWNraW5nQ29udHJvbGxlcjogYW55O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuQVBQX05BTUUgPSBQcm9qZWN0QXNzZXQuQVBQX05BTUU7XG4gICAgdGhpcy5jYW5kaWRhdGVSZXBvc2l0b3J5ID0gbmV3IENhbmRpZGF0ZVJlcG9zaXRvcnkoKTtcbiAgICB0aGlzLnJlY3J1aXRlclJlcG9zaXRvcnkgPSBuZXcgUmVjcnVpdGVyUmVwb3NpdG9yeSgpO1xuICAgIHRoaXMuaW5kdXN0cnlSZXBvc2l0b3J5ID0gbmV3IEluZHVzdHJ5UmVwb3NpdG9yeSgpO1xuICAgIGxldCBvYmo6IGFueSA9IG5ldyB1c2VzdHJhY2tpbmcuTXlDb250cm9sbGVyKCk7XG4gICAgdGhpcy51c2VzVHJhY2tpbmdDb250cm9sbGVyID0gb2JqLl9jb250cm9sbGVyO1xuICB9XG5cbiAgZ2V0TWF0Y2hpbmdDYW5kaWRhdGVzKGpvYlByb2ZpbGU6IEpvYlByb2ZpbGVNb2RlbCwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xuICAgIGNvbnNvbGUudGltZSgnZ2V0TWF0Y2hpbmcgQ2FuZGlkYXRlJyk7XG4gICAgbGV0IGRhdGE6IGFueTtcbiAgICBsZXQgaXNGb3VuZDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIGxldCBpbmR1c3RyaWVzOiBzdHJpbmdbXSA9IFtdO1xuICAgIGxldCBpc1JlbGV2ZW50SW5kdXN0cmllc0ZvdW5kOiBib29sZWFuID0gZmFsc2U7XG4gICAgaWYgKGpvYlByb2ZpbGUuaW50ZXJlc3RlZEluZHVzdHJpZXMgJiYgam9iUHJvZmlsZS5pbnRlcmVzdGVkSW5kdXN0cmllcy5sZW5ndGggPiAwKSB7XG4gICAgICAvKmlzRm91bmQ9IGpvYlByb2ZpbGUuaW50ZXJlc3RlZEluZHVzdHJpZXMuZmlsdGVyKChuYW1lIDogc3RyaW5nKT0+IHtcbiAgICAgICBpZihuYW1lID09PSAnTm9uZScpe1xuICAgICAgIHJldHVybiBuYW1lO1xuICAgICAgIH1cbiAgICAgICB9KTsqL1xuICAgICAgLy9qb2JQcm9maWxlLnJlbGV2ZW50SW5kdXN0cmllcyA9IFsnVGV4dGlsZSddO1xuICAgICAgZm9yIChsZXQgbmFtZSBvZiBqb2JQcm9maWxlLmludGVyZXN0ZWRJbmR1c3RyaWVzKSB7XG4gICAgICAgIGlmIChuYW1lID09PSAnTm9uZScpIHtcbiAgICAgICAgICBpc0ZvdW5kID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYoam9iUHJvZmlsZS5yZWxldmVudEluZHVzdHJpZXMgJiYgam9iUHJvZmlsZS5yZWxldmVudEluZHVzdHJpZXMubGVuZ3RoKSB7XG4gICAgICAgIGlzUmVsZXZlbnRJbmR1c3RyaWVzRm91bmQgPSB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKGlzRm91bmQpIHtcblxuICAgICAgICBpZihpc1JlbGV2ZW50SW5kdXN0cmllc0ZvdW5kKSB7XG4gICAgICAgICAgaW5kdXN0cmllcyA9IGpvYlByb2ZpbGUucmVsZXZlbnRJbmR1c3RyaWVzO1xuXG4gICAgICAgICAgaW5kdXN0cmllcy5wdXNoKGpvYlByb2ZpbGUuaW5kdXN0cnkubmFtZSk7XG4gICAgICAgICAgZGF0YSA9IHtcbiAgICAgICAgICAgICdpbmR1c3RyeS5uYW1lJzogeyRpbjogaW5kdXN0cmllc30sXG4gICAgICAgICAgICAkb3I6IFtcbiAgICAgICAgICAgICAgeydwcm9mZXNzaW9uYWxEZXRhaWxzLnJlbG9jYXRlJzogJ1llcyd9LFxuICAgICAgICAgICAgICB7J2xvY2F0aW9uLmNpdHknOiBqb2JQcm9maWxlLmxvY2F0aW9uLmNpdHl9XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgJ3Byb2ZpY2llbmNpZXMnOiB7JGluOiBqb2JQcm9maWxlLnByb2ZpY2llbmNpZXN9LFxuICAgICAgICAgICAgJ2lzVmlzaWJsZSc6IHRydWUsXG4gICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkYXRhID0ge1xuICAgICAgICAgICAgJ2luZHVzdHJ5Lm5hbWUnOiBqb2JQcm9maWxlLmluZHVzdHJ5Lm5hbWUsXG4gICAgICAgICAgICAkb3I6IFtcbiAgICAgICAgICAgICAgeydwcm9mZXNzaW9uYWxEZXRhaWxzLnJlbG9jYXRlJzogJ1llcyd9LFxuICAgICAgICAgICAgICB7J2xvY2F0aW9uLmNpdHknOiBqb2JQcm9maWxlLmxvY2F0aW9uLmNpdHl9XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgJ3Byb2ZpY2llbmNpZXMnOiB7JGluOiBqb2JQcm9maWxlLnByb2ZpY2llbmNpZXN9LFxuICAgICAgICAgICAgJ2lzVmlzaWJsZSc6IHRydWUsXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYoaXNSZWxldmVudEluZHVzdHJpZXNGb3VuZCkge1xuICAgICAgICAgIGluZHVzdHJpZXMgPSBqb2JQcm9maWxlLnJlbGV2ZW50SW5kdXN0cmllcztcbiAgICAgICAgICBpbmR1c3RyaWVzLnB1c2goam9iUHJvZmlsZS5pbmR1c3RyeS5uYW1lKTtcbiAgICAgICAgICBkYXRhID0ge1xuICAgICAgICAgICAgJ2luZHVzdHJ5Lm5hbWUnOiB7JGluOiBpbmR1c3RyaWVzfSxcbiAgICAgICAgICAgICRvcjogW1xuICAgICAgICAgICAgICB7J3Byb2Zlc3Npb25hbERldGFpbHMucmVsb2NhdGUnOiAnWWVzJ30sXG4gICAgICAgICAgICAgIHsnbG9jYXRpb24uY2l0eSc6IGpvYlByb2ZpbGUubG9jYXRpb24uY2l0eX1cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAncHJvZmljaWVuY2llcyc6IHskaW46IGpvYlByb2ZpbGUucHJvZmljaWVuY2llc30sXG4gICAgICAgICAgICAnaW50ZXJlc3RlZEluZHVzdHJpZXMnOiB7JGluOiBqb2JQcm9maWxlLmludGVyZXN0ZWRJbmR1c3RyaWVzfSxcbiAgICAgICAgICAgICdpc1Zpc2libGUnOiB0cnVlLFxuICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGF0YSA9IHtcbiAgICAgICAgICAgICdpbmR1c3RyeS5uYW1lJzogam9iUHJvZmlsZS5pbmR1c3RyeS5uYW1lLFxuICAgICAgICAgICAgJG9yOiBbXG4gICAgICAgICAgICAgIHsncHJvZmVzc2lvbmFsRGV0YWlscy5yZWxvY2F0ZSc6ICdZZXMnfSxcbiAgICAgICAgICAgICAgeydsb2NhdGlvbi5jaXR5Jzogam9iUHJvZmlsZS5sb2NhdGlvbi5jaXR5fVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICdwcm9maWNpZW5jaWVzJzogeyRpbjogam9iUHJvZmlsZS5wcm9maWNpZW5jaWVzfSxcbiAgICAgICAgICAgICdpbnRlcmVzdGVkSW5kdXN0cmllcyc6IHskaW46IGpvYlByb2ZpbGUuaW50ZXJlc3RlZEluZHVzdHJpZXN9LFxuICAgICAgICAgICAgJ2lzVmlzaWJsZSc6IHRydWUsXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIGRhdGEgPSB7XG4gICAgICAgICdpc1Zpc2libGUnOiB0cnVlLFxuICAgICAgICAnaW5kdXN0cnkubmFtZSc6IGpvYlByb2ZpbGUuaW5kdXN0cnkubmFtZSxcbiAgICAgICAgJ3Byb2ZpY2llbmNpZXMnOiB7JGluOiBqb2JQcm9maWxlLnByb2ZpY2llbmNpZXN9LFxuICAgICAgICAkb3I6IFtcbiAgICAgICAgICB7J3Byb2Zlc3Npb25hbERldGFpbHMucmVsb2NhdGUnOiAnWWVzJ30sXG4gICAgICAgICAgeydsb2NhdGlvbi5jaXR5Jzogam9iUHJvZmlsZS5sb2NhdGlvbi5jaXR5fVxuICAgICAgICBdXG4gICAgICB9O1xuICAgIH1cbiAgICBsZXQgaW5jbHVkZWRfZmllbGRzID0ge1xuICAgICAgJ2luZHVzdHJ5LnJvbGVzLmNhcGFiaWxpdGllcy5jb21wbGV4aXRpZXMuc2NlbmFyaW9zLmNvZGUnOiAxLFxuICAgICAgJ2luZHVzdHJ5LnJvbGVzLmNhcGFiaWxpdGllcy5jb21wbGV4aXRpZXMuc2NlbmFyaW9zLmlzQ2hlY2tlZCc6IDEsXG4gICAgICAnaW5kdXN0cnkucm9sZXMuZGVmYXVsdF9jb21wbGV4aXRpZXMuY29tcGxleGl0aWVzLnNjZW5hcmlvcy5jb2RlJzogMSxcbiAgICAgICdpbmR1c3RyeS5yb2xlcy5kZWZhdWx0X2NvbXBsZXhpdGllcy5jb21wbGV4aXRpZXMuc2NlbmFyaW9zLmlzQ2hlY2tlZCc6IDEsXG4gICAgICAndXNlcklkJzogMSxcbiAgICAgICdwcm9maWNpZW5jaWVzJzogMSxcbiAgICAgICdsb2NhdGlvbic6IDEsXG4gICAgICAnaW50ZXJlc3RlZEluZHVzdHJpZXMnOiAxLFxuICAgICAgJ3Byb2Zlc3Npb25hbERldGFpbHMnOiAxLFxuICAgICAgJ2NhcGFiaWxpdHlfbWF0cml4JzoxXG4gICAgfTtcbiAgICB0aGlzLmNhbmRpZGF0ZVJlcG9zaXRvcnkucmV0cmlldmVXaXRoTGVhbihkYXRhLCBpbmNsdWRlZF9maWVsZHMsIChlcnIsIHJlcykgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gY2FsbGJhY2sobnVsbCwgcmVzKTtcbiAgICAgICAgdGhpcy5jYW5kaWRhdGVSZXBvc2l0b3J5LmdldENhbmRpZGF0ZVFDYXJkKHJlcywgam9iUHJvZmlsZSwgdW5kZWZpbmVkLCBjYWxsYmFjayk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBnZXRNYXRjaGluZ0pvYlByb2ZpbGUoY2FuZGlkYXRlOiBDYW5kaWRhdGVNb2RlbCwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xuXG4gICAgbGV0IGN1cnJlbnREYXRlID0gbmV3IERhdGUoKTtcbiAgICBsZXQgZGF0YSA9IHtcbiAgICAgICdwb3N0ZWRKb2JzLmluZHVzdHJ5Lm5hbWUnOiBjYW5kaWRhdGUuaW5kdXN0cnkubmFtZSxcbiAgICAgICdwb3N0ZWRKb2JzLnByb2ZpY2llbmNpZXMnOiB7JGluOiBjYW5kaWRhdGUucHJvZmljaWVuY2llc30sXG4gICAgICAncG9zdGVkSm9icy5leHBpcmluZ0RhdGUnOiB7JGd0ZTogY3VycmVudERhdGV9XG4gICAgfTtcbiAgICBsZXQgZXhjbHVkZWRfZmllbGRzID0ge1xuICAgICAgJ3Bvc3RlZEpvYnMuaW5kdXN0cnkucm9sZXMnOiAwLFxuICAgIH07XG4gICAgdGhpcy5yZWNydWl0ZXJSZXBvc2l0b3J5LnJldHJpZXZlV2l0aExlYW4oZGF0YSxleGNsdWRlZF9maWVsZHMsIChlcnIsIHJlcykgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5yZWNydWl0ZXJSZXBvc2l0b3J5LmdldEpvYlByb2ZpbGVRQ2FyZChyZXMsIGNhbmRpZGF0ZSwgdW5kZWZpbmVkLCAnbm9uZScsIGNhbGxiYWNrKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdldE1hdGNoaW5nUmVzdWx0KGNhbmRpZGF0ZUlkOiBzdHJpbmcsIGpvYklkOiBzdHJpbmcsIGlzQ2FuZGlkYXRlIDogYm9vbGVhbixjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XG4gICAgbGV0IHVzZXNfZGF0YSA9IHtcbiAgICAgIGNhbmRpZGF0ZUlkOiBjYW5kaWRhdGVJZCxcbiAgICAgIGpvYlByb2ZpbGVJZDogam9iSWQsXG4gICAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCksXG4gICAgICBhY3Rpb246IEFjdGlvbnMuREVGQVVMVF9WQUxVRVxuICAgIH07XG4gICAgaWYgKGlzQ2FuZGlkYXRlKSB7XG4gICAgICB1c2VzX2RhdGEuYWN0aW9uID0gQWN0aW9ucy5WSUVXRURfSk9CX1BST0ZJTEVfQllfQ0FORElEQVRFO1xuICAgIH0gZWxzZSB7XG4gICAgICB1c2VzX2RhdGEuYWN0aW9uID0gQWN0aW9ucy5WSUVXRURfRlVMTF9QUk9GSUxFX0JZX1JFQ1JVSVRFUjtcbiAgICB9XG4gICAgdGhpcy51c2VzVHJhY2tpbmdDb250cm9sbGVyLmNyZWF0ZSh1c2VzX2RhdGEpO1xuICAgIHRoaXMuY2FuZGlkYXRlUmVwb3NpdG9yeS5maW5kQnlJZHdpdGhFeGNsdWRlKGNhbmRpZGF0ZUlkLHsnaW5kdXN0cnknOjB9LCAoZXJyOiBhbnksIGNhbmRpZGF0ZVJlczogYW55KSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoY2FuZGlkYXRlUmVzKSB7XG4gICAgICAgICAgbGV0IGRhdGEgPSB7XG4gICAgICAgICAgICAncG9zdGVkSm9iJzogam9iSWRcbiAgICAgICAgICB9O1xuICAgICAgICAgIGxldCBqb2JQcm9maWxlU2VydmljZTogSm9iUHJvZmlsZVNlcnZpY2UgPSBuZXcgSm9iUHJvZmlsZVNlcnZpY2UoKTtcbiAgICAgICAgICBqb2JQcm9maWxlU2VydmljZS5yZXRyaWV2ZShkYXRhLCAoZXJySW5Kb2IsIHJlc09mUmVjcnVpdGVyKSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJySW5Kb2IpIHtcbiAgICAgICAgICAgICAgY2FsbGJhY2soZXJySW5Kb2IsIG51bGwpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5nZXRSZXN1bHQoY2FuZGlkYXRlUmVzLCByZXNPZlJlY3J1aXRlci5wb3N0ZWRKb2JzWzBdLCBpc0NhbmRpZGF0ZSwgY2FsbGJhY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuXG4gIGNvbXBhcmVUd29PcHRpb25zKGZpcnN0OiBudW1iZXIsIHNlY29uZDogbnVtYmVyKTogc3RyaW5nIHtcbiAgICBpZiAoZmlyc3QgPCBzZWNvbmQpIHtcbiAgICAgIHJldHVybiAnYmVsb3cnO1xuICAgIH0gZWxzZSBpZiAoZmlyc3QgPiBzZWNvbmQpIHtcbiAgICAgIHJldHVybiAnYWJvdmUnO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJ2V4YWN0JztcbiAgICB9XG4gIH1cblxuICBnZXRFZHVjdGlvblN3aXRjaENhc2UoZWR1Y2F0aW9uOiBzdHJpbmcpOiBudW1iZXIge1xuICAgIHN3aXRjaCAoZWR1Y2F0aW9uKSB7XG4gICAgICBjYXNlICdVbmRlciBHcmFkdWF0ZSc6XG4gICAgICAgIHJldHVybiAxO1xuICAgICAgY2FzZSAnR3JhZHVhdGUnOlxuICAgICAgICByZXR1cm4gMjtcbiAgICAgIGNhc2UgJ1Bvc3QgR3JhZHVhdGUnOlxuICAgICAgICByZXR1cm4gMztcbiAgICB9XG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgZ2V0UGVyaW9kU3dpdGNoQ2FzZShwZXJpb2Q6IHN0cmluZyk6IG51bWJlciB7Ly9UTyBETyA6RG8gbm90IHVzZSBoYXJkIGNvZGluZ1xuICAgIHN3aXRjaCAocGVyaW9kKSB7XG4gICAgICBjYXNlICdJbW1lZGlhdGUnIDpcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgICBjYXNlICdXaXRoaW4gMSBtb250aHMnOlxuICAgICAgICByZXR1cm4gMjtcbiAgICAgIGNhc2UgJzEtMiBNb250aHMnOlxuICAgICAgICByZXR1cm4gMztcbiAgICAgIGNhc2UgJzItMyBNb250aHMnOlxuICAgICAgICByZXR1cm4gNDtcbiAgICAgIGNhc2UgJ0JleW9uZCAzIG1vbnRocyc6XG4gICAgICAgIHJldHVybiA1O1xuICAgIH1cbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICBnZXRSZXN1bHQoY2FuZGlkYXRlOiBhbnksIGpvYjogYW55LCBpc0NhbmRpZGF0ZTogYm9vbGVhbiwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xuICAgIHRoaXMuaW5kdXN0cnlSZXBvc2l0b3J5LnJldHJpZXZlKHsnbmFtZSc6IGpvYi5pbmR1c3RyeS5uYW1lfSwgKGVycjogYW55LCBpbmR1c3RyaWVzOiBJbmR1c3RyeU1vZGVsW10pID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBuZXdDYW5kaWRhdGUgPSB0aGlzLmdldENvbXBhcmVEYXRhKGNhbmRpZGF0ZSwgam9iLCBpc0NhbmRpZGF0ZSwgaW5kdXN0cmllcyk7XG4gICAgICAgIGNhbGxiYWNrKG51bGwsIG5ld0NhbmRpZGF0ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBnZXRDb21wYXJlRGF0YShjYW5kaWRhdGU6IENhbmRpZGF0ZU1vZGVsLCBqb2I6IGFueSwgaXNDYW5kaWRhdGU6IGJvb2xlYW4sIGluZHVzdHJpZXM6IEluZHVzdHJ5TW9kZWxbXSkge1xuICAgIC8vbGV0IG5ld0NhbmRpZGF0ZSA9IGNhbmRpZGF0ZS50b09iamVjdCgpO1xuICAgIHZhciBuZXdDYW5kaWRhdGUgPSB0aGlzLmJ1aWxkQ2FuZGlkYXRlTW9kZWwoY2FuZGlkYXRlKTtcbiAgICBsZXQgam9iTWluRXhwZXJpZW5jZTogbnVtYmVyID0gTnVtYmVyKGpvYi5leHBlcmllbmNlTWluVmFsdWUpO1xuICAgIGxldCBqb2JNYXhFeHBlcmllbmNlOiBudW1iZXIgPSBOdW1iZXIoam9iLmV4cGVyaWVuY2VNYXhWYWx1ZSk7XG4gICAgbGV0IGpvYk1pblNhbGFyeTogbnVtYmVyID0gTnVtYmVyKGpvYi5zYWxhcnlNaW5WYWx1ZSk7XG4gICAgbGV0IGpvYk1heFNhbGFyeTogbnVtYmVyID0gTnVtYmVyKGpvYi5zYWxhcnlNYXhWYWx1ZSk7XG4gICAgbGV0IGNhbmRpRXhwZXJpZW5jZTogc3RyaW5nW10gPSBuZXdDYW5kaWRhdGUucHJvZmVzc2lvbmFsRGV0YWlscy5leHBlcmllbmNlLnNwbGl0KCcgJyk7XG4gICAgbGV0IGNhblNhbGFyeTogc3RyaW5nW10gPSBuZXdDYW5kaWRhdGUucHJvZmVzc2lvbmFsRGV0YWlscy5jdXJyZW50U2FsYXJ5LnNwbGl0KCcgJyk7XG4gICAgaWYgKChqb2JNYXhFeHBlcmllbmNlID49IE51bWJlcihjYW5kaUV4cGVyaWVuY2VbMF0pKSAmJiAoam9iTWluRXhwZXJpZW5jZSA8PSBOdW1iZXIoY2FuZGlFeHBlcmllbmNlWzBdKSkpIHtcbiAgICAgIG5ld0NhbmRpZGF0ZS5leHBlcmllbmNlTWF0Y2ggPSAnZXhhY3QnO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXdDYW5kaWRhdGUuZXhwZXJpZW5jZU1hdGNoID0gJ21pc3NpbmcnO1xuICAgIH1cbiAgICBpZiAoKGpvYk1heFNhbGFyeSA+PSBOdW1iZXIoY2FuU2FsYXJ5WzBdKSkgJiYgKGpvYk1pblNhbGFyeSA8PSBOdW1iZXIoY2FuU2FsYXJ5WzBdKSkpIHtcbiAgICAgIG5ld0NhbmRpZGF0ZS5zYWxhcnlNYXRjaCA9ICdleGFjdCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5ld0NhbmRpZGF0ZS5zYWxhcnlNYXRjaCA9ICdtaXNzaW5nJztcbiAgICB9XG4gICAgbGV0IGNhbkVkdWNhdGlvbjogbnVtYmVyID0gdGhpcy5nZXRFZHVjdGlvblN3aXRjaENhc2UobmV3Q2FuZGlkYXRlLnByb2Zlc3Npb25hbERldGFpbHMuZWR1Y2F0aW9uKTtcbiAgICBsZXQgam9iRWR1Y2F0aW9uOiBudW1iZXIgPSB0aGlzLmdldEVkdWN0aW9uU3dpdGNoQ2FzZShqb2IuZWR1Y2F0aW9uKTtcbiAgICBuZXdDYW5kaWRhdGUuZWR1Y2F0aW9uTWF0Y2ggPSB0aGlzLmNvbXBhcmVUd29PcHRpb25zKGNhbkVkdWNhdGlvbiwgam9iRWR1Y2F0aW9uKTtcbiAgICBuZXdDYW5kaWRhdGUucmVsZWFzZU1hdGNoID0gdGhpcy5jb21wYXJlVHdvT3B0aW9ucyh0aGlzLmdldFBlcmlvZFN3aXRjaENhc2UobmV3Q2FuZGlkYXRlLnByb2Zlc3Npb25hbERldGFpbHMubm90aWNlUGVyaW9kKSwgdGhpcy5nZXRQZXJpb2RTd2l0Y2hDYXNlKGpvYi5qb2luaW5nUGVyaW9kKSk7XG4gICAgbmV3Q2FuZGlkYXRlLmludGVyZXN0ZWRJbmR1c3RyeU1hdGNoID0gbmV3IEFycmF5KDApO1xuXG4gICAgZm9yIChsZXQgaW5kdXN0cnkgb2Ygam9iLmludGVyZXN0ZWRJbmR1c3RyaWVzKSB7XG4gICAgICBpZiAobmV3Q2FuZGlkYXRlLmludGVyZXN0ZWRJbmR1c3RyaWVzLmluZGV4T2YoaW5kdXN0cnkpICE9PSAtMSkge1xuICAgICAgICBuZXdDYW5kaWRhdGUuaW50ZXJlc3RlZEluZHVzdHJ5TWF0Y2gucHVzaChpbmR1c3RyeSk7XG4gICAgICB9XG4gICAgfVxuICAgIG5ld0NhbmRpZGF0ZS5wcm9maWNpZW5jaWVzTWF0Y2ggPSBuZXcgQXJyYXkoMCk7XG4gICAgZm9yIChsZXQgcHJvZmljaWVuY3kgb2Ygam9iLnByb2ZpY2llbmNpZXMpIHtcbiAgICAgIGlmIChuZXdDYW5kaWRhdGUucHJvZmljaWVuY2llcy5pbmRleE9mKHByb2ZpY2llbmN5KSAhPT0gLTEpIHtcbiAgICAgICAgbmV3Q2FuZGlkYXRlLnByb2ZpY2llbmNpZXNNYXRjaC5wdXNoKHByb2ZpY2llbmN5KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBuZXdDYW5kaWRhdGUucHJvZmljaWVuY2llc1VuTWF0Y2ggPSBuZXcgQXJyYXkoMCk7XG4gICAgZm9yIChsZXQgcHJvZmljaWVuY3kgb2Ygam9iLnByb2ZpY2llbmNpZXMpIHtcbiAgICAgIGlmIChuZXdDYW5kaWRhdGUucHJvZmljaWVuY2llc01hdGNoLmluZGV4T2YocHJvZmljaWVuY3kpID09IC0xKSB7XG4gICAgICAgIG5ld0NhbmRpZGF0ZS5wcm9maWNpZW5jaWVzVW5NYXRjaC5wdXNoKHByb2ZpY2llbmN5KTtcbiAgICAgIH1cbiAgICB9XG4vLyAgICAgICAgbGV0IG1hdGNoX21hcDogTWFwPHN0cmluZyxNYXRjaFZpZXdNb2RlbD4gPSBuZXcgTWFwPHN0cmluZyxNYXRjaFZpZXdNb2RlbD4oKTtcbiAgICAvL25ld0NhbmRpZGF0ZS5tYXRjaF9tYXAgPSB7fTtcbiAgICBuZXdDYW5kaWRhdGUgPSB0aGlzLmJ1aWxkTXVsdGlDb21wYXJlQ2FwYWJpbGl0eVZpZXcoam9iLCBuZXdDYW5kaWRhdGUsIGluZHVzdHJpZXMsIGlzQ2FuZGlkYXRlKTtcbiAgICBuZXdDYW5kaWRhdGUgPSB0aGlzLmJ1aWxkQ29tcGFyZVZpZXcoam9iLCBuZXdDYW5kaWRhdGUsIGluZHVzdHJpZXMsIGlzQ2FuZGlkYXRlKTtcbiAgICBuZXdDYW5kaWRhdGUgPSB0aGlzLmdldEFkZGl0aW9uYWxDYXBhYmlsaXRpZXMoam9iLCBuZXdDYW5kaWRhdGUsIGluZHVzdHJpZXMpO1xuXG4gICAgcmV0dXJuIG5ld0NhbmRpZGF0ZTtcbiAgfVxuXG4gIGJ1aWxkQ2FuZGlkYXRlTW9kZWwoY2FuZGlkYXRlOiBDYW5kaWRhdGVNb2RlbCkge1xuICAgIGxldCBwcm9maWxlQ29tcGFyaXNvblJlc3VsdDogUHJvZmlsZUNvbXBhcmlzb25EYXRhTW9kZWwgPSBuZXcgUHJvZmlsZUNvbXBhcmlzb25EYXRhTW9kZWwoKTtcbiAgICBwcm9maWxlQ29tcGFyaXNvblJlc3VsdC5faWQgPSBjYW5kaWRhdGUuX2lkO1xuICAgIHByb2ZpbGVDb21wYXJpc29uUmVzdWx0LmluZHVzdHJ5TmFtZSA9IGNhbmRpZGF0ZS5pbmR1c3RyeS5uYW1lO1xuICAgIHByb2ZpbGVDb21wYXJpc29uUmVzdWx0LmFib3V0TXlzZWxmID0gY2FuZGlkYXRlLmFib3V0TXlzZWxmO1xuICAgIHByb2ZpbGVDb21wYXJpc29uUmVzdWx0LmFjYWRlbWljcyA9IGNhbmRpZGF0ZS5hY2FkZW1pY3M7XG4gICAgcHJvZmlsZUNvbXBhcmlzb25SZXN1bHQucHJvZmVzc2lvbmFsRGV0YWlscyA9IGNhbmRpZGF0ZS5wcm9mZXNzaW9uYWxEZXRhaWxzO1xuICAgIHByb2ZpbGVDb21wYXJpc29uUmVzdWx0LmF3YXJkcyA9IGNhbmRpZGF0ZS5hd2FyZHM7XG4gICAgcHJvZmlsZUNvbXBhcmlzb25SZXN1bHQuY2FwYWJpbGl0eV9tYXRyaXggPSBjYW5kaWRhdGUuY2FwYWJpbGl0eV9tYXRyaXg7XG4gICAgcHJvZmlsZUNvbXBhcmlzb25SZXN1bHQuZXhwZXJpZW5jZU1hdGNoID0gJyc7XG4gICAgcHJvZmlsZUNvbXBhcmlzb25SZXN1bHQuY2VydGlmaWNhdGlvbnMgPSBjYW5kaWRhdGUuY2VydGlmaWNhdGlvbnM7XG4gICAgcHJvZmlsZUNvbXBhcmlzb25SZXN1bHQuZW1wbG95bWVudEhpc3RvcnkgPSBjYW5kaWRhdGUuZW1wbG95bWVudEhpc3Rvcnk7XG4gICAgcHJvZmlsZUNvbXBhcmlzb25SZXN1bHQuaW50ZXJlc3RlZEluZHVzdHJpZXMgPSBjYW5kaWRhdGUuaW50ZXJlc3RlZEluZHVzdHJpZXM7XG4gICAgcHJvZmlsZUNvbXBhcmlzb25SZXN1bHQuaXNTdWJtaXR0ZWQgPSBjYW5kaWRhdGUuaXNTdWJtaXR0ZWQ7XG4gICAgcHJvZmlsZUNvbXBhcmlzb25SZXN1bHQuaXNWaXNpYmxlID0gY2FuZGlkYXRlLmlzVmlzaWJsZTtcbiAgICBwcm9maWxlQ29tcGFyaXNvblJlc3VsdC5sb2NhdGlvbiA9IGNhbmRpZGF0ZS5sb2NhdGlvbjtcbiAgICBwcm9maWxlQ29tcGFyaXNvblJlc3VsdC5qb2JfbGlzdCA9IGNhbmRpZGF0ZS5qb2JfbGlzdDtcbiAgICBwcm9maWxlQ29tcGFyaXNvblJlc3VsdC5lZHVjYXRpb25NYXRjaCA9ICcnO1xuICAgIHByb2ZpbGVDb21wYXJpc29uUmVzdWx0LnByb2ZpY2llbmNpZXMgPSBjYW5kaWRhdGUucHJvZmljaWVuY2llcztcbiAgICBwcm9maWxlQ29tcGFyaXNvblJlc3VsdC5wcm9maWxlQ29tcGFyaXNvbkhlYWRlciA9IGNhbmRpZGF0ZS51c2VySWQ7XG4gICAgcHJvZmlsZUNvbXBhcmlzb25SZXN1bHQucm9sZVR5cGUgPSBjYW5kaWRhdGUucm9sZVR5cGU7XG4gICAgcHJvZmlsZUNvbXBhcmlzb25SZXN1bHQuc2FsYXJ5TWF0Y2ggPSAnJztcbiAgICBwcm9maWxlQ29tcGFyaXNvblJlc3VsdC5zZWNvbmRhcnlDYXBhYmlsaXR5ID0gY2FuZGlkYXRlLnNlY29uZGFyeUNhcGFiaWxpdHk7XG4gICAgcHJvZmlsZUNvbXBhcmlzb25SZXN1bHQubG9ja2VkT24gPSBjYW5kaWRhdGUubG9ja2VkT247XG4gICAgcHJvZmlsZUNvbXBhcmlzb25SZXN1bHQubWF0Y2hfbWFwID0ge307XG4gICAgcHJvZmlsZUNvbXBhcmlzb25SZXN1bHQuY2FwYWJpbGl0eU1hcCA9IHt9O1xuICAgIHJldHVybiBwcm9maWxlQ29tcGFyaXNvblJlc3VsdDtcbiAgfVxuXG4gIGJ1aWxkTXVsdGlDb21wYXJlQ2FwYWJpbGl0eVZpZXcoam9iOmFueSwgbmV3Q2FuZGlkYXRlOlByb2ZpbGVDb21wYXJpc29uRGF0YU1vZGVsLCBpbmR1c3RyaWVzOmFueSwgaXNDYW5kaWRhdGU6YW55KSB7XG4gICAgdmFyIGNhcGFiaWxpdHlQZXJjZW50YWdlOm51bWJlcltdID0gbmV3IEFycmF5KDApO1xuICAgIHZhciBjYXBhYmlsaXR5S2V5czpzdHJpbmdbXSA9IG5ldyBBcnJheSgwKTtcbiAgICB2YXIgY29ycmVjdFFlc3Rpb25Db3VudEZvckF2Z1BlcmNlbnRhZ2U6bnVtYmVyID0gMDtcbiAgICB2YXIgcWVzdGlvbkNvdW50Rm9yQXZnUGVyY2VudHNnZTpudW1iZXIgPSAwO1xuICAgIGZvciAobGV0IGNhcCBpbiBqb2IuY2FwYWJpbGl0eV9tYXRyaXgpIHtcblxuICAgICAgdmFyIGNhcGFiaWxpdHlLZXkgPSBjYXAuc3BsaXQoJ18nKTtcbiAgICAgIGlmIChjYXBhYmlsaXR5S2V5cy5pbmRleE9mKGNhcGFiaWxpdHlLZXlbMF0pID09IC0xKSB7XG4gICAgICAgIGNhcGFiaWxpdHlLZXlzLnB1c2goY2FwYWJpbGl0eUtleVswXSk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vZm9yKGxldCBfY2FwIGluIGNhcGJpbGl0eUtleXMpIHtcbiAgICBmb3IgKGxldCBfY2FwIG9mIGNhcGFiaWxpdHlLZXlzKSB7XG4gICAgICBsZXQgaXNDYXBhYmlsaXR5Rm91bmQgOiBib29sZWFuID0gZmFsc2U7XG4gICAgICB2YXIgY2FwYWJpbGl0eVF1ZXN0aW9uQ291bnQ6bnVtYmVyID0gMDtcbiAgICAgIHZhciBtYXRjaENvdW50Om51bWJlciA9IDA7XG4gICAgICBmb3IgKGxldCBjYXAgaW4gam9iLmNhcGFiaWxpdHlfbWF0cml4KSB7XG4gICAgICAgIC8vY2FsY3VsYXRlIHRvdGFsIG51bWJlciBvZiBxdWVzdGlvbnMgaW4gY2FwYWJpbGl0eVxuXG4gICAgICAgIGlmIChfY2FwID09IGNhcC5zcGxpdCgnXycpWzBdKSB7XG4gICAgICAgICAgaWYgKGpvYi5jYXBhYmlsaXR5X21hdHJpeFtjYXBdID09IC0xIHx8IGpvYi5jYXBhYmlsaXR5X21hdHJpeFtjYXBdID09IDAgfHwgam9iLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0gPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvL21hdGNoX3ZpZXcubWF0Y2ggPSBNYXRjaC5NaXNzTWF0Y2g7XG4gICAgICAgICAgfSBlbHNlIGlmIChqb2IuY2FwYWJpbGl0eV9tYXRyaXhbY2FwXSA9PSBuZXdDYW5kaWRhdGUuY2FwYWJpbGl0eV9tYXRyaXhbY2FwXSkge1xuICAgICAgICAgICAgbWF0Y2hDb3VudCsrO1xuICAgICAgICAgICAgY2FwYWJpbGl0eVF1ZXN0aW9uQ291bnQrKztcbiAgICAgICAgICAgIGNvcnJlY3RRZXN0aW9uQ291bnRGb3JBdmdQZXJjZW50YWdlKys7XG4gICAgICAgICAgICBxZXN0aW9uQ291bnRGb3JBdmdQZXJjZW50c2dlKys7XG4gICAgICAgICAgICAvL21hdGNoX3ZpZXcubWF0Y2ggPSBNYXRjaC5FeGFjdDtcbiAgICAgICAgICB9IGVsc2UgaWYgKGpvYi5jYXBhYmlsaXR5X21hdHJpeFtjYXBdID09IChOdW1iZXIobmV3Q2FuZGlkYXRlLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0pIC0gQ29uc3RWYXJpYWJsZXMuRElGRkVSRU5DRV9JTl9DT01QTEVYSVRZX1NDRU5BUklPKSkge1xuICAgICAgICAgICAgbWF0Y2hDb3VudCsrO1xuICAgICAgICAgICAgY2FwYWJpbGl0eVF1ZXN0aW9uQ291bnQrKztcbiAgICAgICAgICAgIGNvcnJlY3RRZXN0aW9uQ291bnRGb3JBdmdQZXJjZW50YWdlKys7XG4gICAgICAgICAgICBxZXN0aW9uQ291bnRGb3JBdmdQZXJjZW50c2dlKys7XG4gICAgICAgICAgICAvL21hdGNoX3ZpZXcubWF0Y2ggPSBNYXRjaC5BYm92ZTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGpvYi5jYXBhYmlsaXR5X21hdHJpeFtjYXBdID09IChOdW1iZXIobmV3Q2FuZGlkYXRlLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0pICsgQ29uc3RWYXJpYWJsZXMuRElGRkVSRU5DRV9JTl9DT01QTEVYSVRZX1NDRU5BUklPKSkge1xuICAgICAgICAgICAgLy9tYXRjaF92aWV3Lm1hdGNoID0gTWF0Y2guQmVsb3c7XG4gICAgICAgICAgICBjYXBhYmlsaXR5UXVlc3Rpb25Db3VudCsrO1xuICAgICAgICAgICAgcWVzdGlvbkNvdW50Rm9yQXZnUGVyY2VudHNnZSsrO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYXBhYmlsaXR5UXVlc3Rpb25Db3VudCsrO1xuICAgICAgICAgICAgcWVzdGlvbkNvdW50Rm9yQXZnUGVyY2VudHNnZSsrO1xuICAgICAgICAgICAgLy9tYXRjaF92aWV3Lm1hdGNoID0gTWF0Y2guTWlzc01hdGNoO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdmFyIGNhcGFiaWxpdHlNb2RlbCA9IG5ldyBDYXBhYmlsaXR5TWF0cml4TW9kZWwoKTtcbiAgICAgIHZhciBjYXBOYW1lOnN0cmluZztcbiAgICAgIHZhciBjb21wbGV4aXR5OmFueTtcbiAgICAgIGZvciAobGV0IHJvbGUgb2YgaW5kdXN0cmllc1swXS5yb2xlcykge1xuICAgICAgICBmb3IgKGxldCBjYXBhYmlsaXR5IG9mIHJvbGUuY2FwYWJpbGl0aWVzKSB7XG4gICAgICAgICAgaWYgKF9jYXAgPT0gY2FwYWJpbGl0eS5jb2RlKSB7XG4gICAgICAgICAgICBpc0NhcGFiaWxpdHlGb3VuZD10cnVlO1xuICAgICAgICAgICAgY2FwTmFtZSA9IGNhcGFiaWxpdHkubmFtZTtcbiAgICAgICAgICAgIGNvbXBsZXhpdHkgPSBjYXBhYmlsaXR5LmNvbXBsZXhpdGllcztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBjYXBhYmlsaXR5IG9mIHJvbGUuZGVmYXVsdF9jb21wbGV4aXRpZXMpIHtcbiAgICAgICAgICBpZiAoX2NhcCA9PSBjYXBhYmlsaXR5LmNvZGUpIHtcbiAgICAgICAgICAgIGlzQ2FwYWJpbGl0eUZvdW5kPXRydWU7XG4gICAgICAgICAgICBjYXBOYW1lID0gY2FwYWJpbGl0eS5uYW1lO1xuICAgICAgICAgICAgY29tcGxleGl0eSA9IGNhcGFiaWxpdHkuY29tcGxleGl0aWVzO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICB2YXIgcGVyY2VudGFnZTpudW1iZXIgPSAwO1xuICAgICAgaWYgKGNhcGFiaWxpdHlRdWVzdGlvbkNvdW50KSB7XG4gICAgICAgIHBlcmNlbnRhZ2UgPSAobWF0Y2hDb3VudCAvIGNhcGFiaWxpdHlRdWVzdGlvbkNvdW50KSAqIDEwMDtcbiAgICAgIH1cblxuICAgICAgY2FwYWJpbGl0eU1vZGVsLmNhcGFiaWxpdHlOYW1lID0gY2FwTmFtZTtcbiAgICAgIGNhcGFiaWxpdHlNb2RlbC5jYXBhYmlsaXR5UGVyY2VudGFnZSA9IHBlcmNlbnRhZ2U7XG4gICAgICBjYXBhYmlsaXR5TW9kZWwuY29tcGxleGl0aWVzID0gY29tcGxleGl0eTtcbiAgICAgIGNhcGFiaWxpdHlQZXJjZW50YWdlLnB1c2gocGVyY2VudGFnZSk7XG4gICAgICBpZihpc0NhcGFiaWxpdHlGb3VuZCl7XG4gICAgICAgIG5ld0NhbmRpZGF0ZVsnY2FwYWJpbGl0eU1hcCddW19jYXBdID0gY2FwYWJpbGl0eU1vZGVsO1xuICAgICAgfVxuICAgICAgLy99XG4gICAgfVxuICAgIHZhciBhdmdQZXJjZW50YWdlOm51bWJlciA9IDA7XG4gICAgaWYgKHFlc3Rpb25Db3VudEZvckF2Z1BlcmNlbnRzZ2UpIHtcbiAgICAgIGF2Z1BlcmNlbnRhZ2UgPSAoKGNvcnJlY3RRZXN0aW9uQ291bnRGb3JBdmdQZXJjZW50YWdlIC8gcWVzdGlvbkNvdW50Rm9yQXZnUGVyY2VudHNnZSkgKiAxMDApO1xuICAgIH1cbiAgICBuZXdDYW5kaWRhdGUubWF0Y2hpbmdQZXJjZW50YWdlID0gYXZnUGVyY2VudGFnZTtcbiAgICByZXR1cm4gbmV3Q2FuZGlkYXRlO1xuICB9XG5cbiAgZ2V0QWRkaXRpb25hbENhcGFiaWxpdGllcyhqb2IgOiBhbnksIG5ld0NhbmRpZGF0ZSA6IGFueSAsIGluZHVzdHJpZXMgOiBhbnkpIDogYW55IHtcbiAgICBuZXdDYW5kaWRhdGUuYWRkaXRpb25hbENhcGFiaWxpdGVzID0gbmV3IEFycmF5KDApO1xuICAgIGZvciAobGV0IGNhcCBpbiBuZXdDYW5kaWRhdGUuY2FwYWJpbGl0eV9tYXRyaXgpIHtcbiAgICAgICAgbGV0IGlzRm91bmQ6IGJvb2xlYW49IGZhbHNlO1xuICAgICAgICBmb3IobGV0IGpvYkNhcCBpbiBqb2IuY2FwYWJpbGl0eV9tYXRyaXgpIHtcbiAgICAgICAgICAgIGlmKGNhcC5zdWJzdHIoMCxjYXAuaW5kZXhPZignXycpKSA9PT0gam9iQ2FwLnN1YnN0cigwLGpvYkNhcC5pbmRleE9mKCdfJykpKSB7XG4gICAgICAgICAgICAgIGlzRm91bmQ9dHJ1ZTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYoIWlzRm91bmQpIHtcbiAgICAgICAgICBmb3IgKGxldCByb2xlIG9mIGluZHVzdHJpZXNbMF0ucm9sZXMpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGNhcGFiaWxpdHkgb2Ygcm9sZS5jYXBhYmlsaXRpZXMpIHtcbiAgICAgICAgICAgICAgZm9yIChsZXQgY29tcGxleGl0eSBvZiBjYXBhYmlsaXR5LmNvbXBsZXhpdGllcykge1xuICAgICAgICAgICAgICAgIGxldCBjdXN0b21fY29kZSA9IGNhcGFiaWxpdHkuY29kZSArICdfJyArIGNvbXBsZXhpdHkuY29kZTtcbiAgICAgICAgICAgICAgICBpZiAoY3VzdG9tX2NvZGUgPT09IGNhcCkge1xuICAgICAgICAgICAgICAgICAgaWYobmV3Q2FuZGlkYXRlLmFkZGl0aW9uYWxDYXBhYmlsaXRlcy5pbmRleE9mKGNhcGFiaWxpdHkubmFtZSkgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3Q2FuZGlkYXRlLmFkZGl0aW9uYWxDYXBhYmlsaXRlcy5wdXNoKGNhcGFiaWxpdHkubmFtZSk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgICByZXR1cm4gbmV3Q2FuZGlkYXRlO1xuICB9XG5cbiAgYnVpbGRDb21wYXJlVmlldyhqb2IgOiBhbnksIG5ld0NhbmRpZGF0ZSA6IGFueSAsIGluZHVzdHJpZXMgOiBhbnksIGlzQ2FuZGlkYXRlIDogYm9vbGVhbikgOiBhbnkge1xuXG4gICAgZm9yIChsZXQgY2FwIGluIGpvYi5jYXBhYmlsaXR5X21hdHJpeCkge1xuICAgICAgbGV0IG1hdGNoX3ZpZXc6IE1hdGNoVmlld01vZGVsID0gbmV3IE1hdGNoVmlld01vZGVsKCk7XG4gICAgICBpZiAoam9iLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0gPT0gLTEgfHwgam9iLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0gPT0gMCB8fCBqb2IuY2FwYWJpbGl0eV9tYXRyaXhbY2FwXSA9PSB1bmRlZmluZWQgfHwgbmV3Q2FuZGlkYXRlLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0gPT0gdW5kZWZpbmVkIHx8XG4gICAgICAgIG5ld0NhbmRpZGF0ZS5jYXBhYmlsaXR5X21hdHJpeFtjYXBdID09IDAgfHwgbmV3Q2FuZGlkYXRlLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0gPT0gLTEpIHtcbiAgICAgICAgbWF0Y2hfdmlldy5tYXRjaCA9IE1hdGNoLk1pc3NNYXRjaDtcbiAgICAgIH0gZWxzZSBpZiAoam9iLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0gPT0gbmV3Q2FuZGlkYXRlLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0pIHtcbiAgICAgICAgbWF0Y2hfdmlldy5tYXRjaCA9IE1hdGNoLkV4YWN0O1xuICAgICAgfSBlbHNlIGlmIChqb2IuY2FwYWJpbGl0eV9tYXRyaXhbY2FwXSA9PSAoTnVtYmVyKG5ld0NhbmRpZGF0ZS5jYXBhYmlsaXR5X21hdHJpeFtjYXBdKSAtIENvbnN0VmFyaWFibGVzLkRJRkZFUkVOQ0VfSU5fQ09NUExFWElUWV9TQ0VOQVJJTykpIHtcbiAgICAgICAgbWF0Y2hfdmlldy5tYXRjaCA9IE1hdGNoLkFib3ZlO1xuICAgICAgfSBlbHNlIGlmIChqb2IuY2FwYWJpbGl0eV9tYXRyaXhbY2FwXSA9PSAoTnVtYmVyKG5ld0NhbmRpZGF0ZS5jYXBhYmlsaXR5X21hdHJpeFtjYXBdKSArIENvbnN0VmFyaWFibGVzLkRJRkZFUkVOQ0VfSU5fQ09NUExFWElUWV9TQ0VOQVJJTykpIHtcbiAgICAgICAgbWF0Y2hfdmlldy5tYXRjaCA9IE1hdGNoLkJlbG93O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbWF0Y2hfdmlldy5tYXRjaCA9IE1hdGNoLk1pc3NNYXRjaDtcbiAgICAgIH1cbiAgICAgIGxldCBpc0ZvdW5kOiBib29sZWFuID0gZmFsc2U7XG4gICAgICBmb3IgKGxldCByb2xlIG9mIGluZHVzdHJpZXNbMF0ucm9sZXMpIHtcbiAgICAgICAgZm9yIChsZXQgY2FwYWJpbGl0eSBvZiByb2xlLmNhcGFiaWxpdGllcykge1xuICAgICAgICAgIGZvciAobGV0IGNvbXBsZXhpdHkgb2YgY2FwYWJpbGl0eS5jb21wbGV4aXRpZXMpIHtcbiAgICAgICAgICAgIGxldCBjdXN0b21fY29kZSA9IGNhcGFiaWxpdHkuY29kZSArICdfJyArIGNvbXBsZXhpdHkuY29kZTtcbiAgICAgICAgICAgIGlmIChjdXN0b21fY29kZSA9PT0gY2FwKSB7XG4gICAgICAgICAgICAgIGlzRm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICBsZXQgc2NlbmFyaW9zID0gY29tcGxleGl0eS5zY2VuYXJpb3MuZmlsdGVyKChzY2U6IFNjZW5hcmlvTW9kZWwpID0+IHtcbiAgICAgICAgICAgICAgICBzY2UuY29kZSA9c2NlLmNvZGUucmVwbGFjZSgnLicsJ18nKTtcbiAgICAgICAgICAgICAgICBzY2UuY29kZSA9c2NlLmNvZGUucmVwbGFjZSgnLicsJ18nKTtcbiAgICAgICAgICAgICAgICBzY2UuY29kZSA9IHNjZS5jb2RlLnN1YnN0cihzY2UuY29kZS5sYXN0SW5kZXhPZignXycpKzEpO1xuICAgICAgICAgICAgICAgIGlmKHNjZS5jb2RlID09IG5ld0NhbmRpZGF0ZS5jYXBhYmlsaXR5X21hdHJpeFtjYXBdKSAge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIGxldCBqb2Jfc2NlbmFyaW9zID0gY29tcGxleGl0eS5zY2VuYXJpb3MuZmlsdGVyKChzY2U6IFNjZW5hcmlvTW9kZWwpID0+IHtcbiAgICAgICAgICAgICAgICBzY2UuY29kZSA9c2NlLmNvZGUucmVwbGFjZSgnLicsJ18nKTtcbiAgICAgICAgICAgICAgICBzY2UuY29kZSA9c2NlLmNvZGUucmVwbGFjZSgnLicsJ18nKTtcbiAgICAgICAgICAgICAgICBzY2UuY29kZSA9IHNjZS5jb2RlLnN1YnN0cihzY2UuY29kZS5sYXN0SW5kZXhPZignXycpKzEpO1xuICAgICAgICAgICAgICAgIGlmKHNjZS5jb2RlID09IGpvYi5jYXBhYmlsaXR5X21hdHJpeFtjYXBdKSAge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIG1hdGNoX3ZpZXcuY2FwYWJpbGl0eV9uYW1lID0gY2FwYWJpbGl0eS5uYW1lO1xuICAgICAgICAgICAgICBtYXRjaF92aWV3LmNvbXBsZXhpdHlfbmFtZSA9IGNvbXBsZXhpdHkubmFtZTtcbiAgICAgICAgICAgICAgaWYoam9iX3NjZW5hcmlvc1swXSkge1xuICAgICAgICAgICAgICAgIG1hdGNoX3ZpZXcuam9iX3NjZW5hcmlvX25hbWU9IGpvYl9zY2VuYXJpb3NbMF0ubmFtZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZihzY2VuYXJpb3NbMF0pIHtcbiAgICAgICAgICAgICAgICBtYXRjaF92aWV3LmNhbmRpZGF0ZV9zY2VuYXJpb19uYW1lPXNjZW5hcmlvc1swXS5uYW1lO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbWF0Y2hfdmlldy5zY2VuYXJpb19uYW1lID0gbWF0Y2hfdmlldy5qb2Jfc2NlbmFyaW9fbmFtZTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmKGlzRm91bmQpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBjYXBhYmlsaXR5IG9mIHJvbGUuZGVmYXVsdF9jb21wbGV4aXRpZXMpIHtcbiAgICAgICAgICBmb3IgKGxldCBjb21wbGV4aXR5IG9mIGNhcGFiaWxpdHkuY29tcGxleGl0aWVzKSB7XG4gICAgICAgICAgICBsZXQgY3VzdG9tX2NvZGUgPSBjYXBhYmlsaXR5LmNvZGUgKyAnXycgKyBjb21wbGV4aXR5LmNvZGU7XG4gICAgICAgICAgICBpZiAoY3VzdG9tX2NvZGUgPT09IGNhcCkge1xuICAgICAgICAgICAgICBpc0ZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgbGV0IHNjZW5hcmlvcyA9IGNvbXBsZXhpdHkuc2NlbmFyaW9zLmZpbHRlcigoc2NlOiBTY2VuYXJpb01vZGVsKSA9PiB7XG4gICAgICAgICAgICAgICAgc2NlLmNvZGUgPXNjZS5jb2RlLnJlcGxhY2UoJy4nLCdfJyk7XG4gICAgICAgICAgICAgICAgc2NlLmNvZGUgPXNjZS5jb2RlLnJlcGxhY2UoJy4nLCdfJyk7XG4gICAgICAgICAgICAgICAgc2NlLmNvZGUgPSBzY2UuY29kZS5zdWJzdHIoc2NlLmNvZGUubGFzdEluZGV4T2YoJ18nKSsxKTtcbiAgICAgICAgICAgICAgICBpZihzY2UuY29kZSA9PSBuZXdDYW5kaWRhdGUuY2FwYWJpbGl0eV9tYXRyaXhbY2FwXSkgIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBsZXQgam9iX3NjZW5hcmlvcyA9IGNvbXBsZXhpdHkuc2NlbmFyaW9zLmZpbHRlcigoc2NlOiBTY2VuYXJpb01vZGVsKSA9PiB7XG4gICAgICAgICAgICAgICAgc2NlLmNvZGUgPXNjZS5jb2RlLnJlcGxhY2UoJy4nLCdfJyk7XG4gICAgICAgICAgICAgICAgc2NlLmNvZGUgPXNjZS5jb2RlLnJlcGxhY2UoJy4nLCdfJyk7XG4gICAgICAgICAgICAgICAgc2NlLmNvZGUgPSBzY2UuY29kZS5zdWJzdHIoc2NlLmNvZGUubGFzdEluZGV4T2YoJ18nKSsxKTtcbiAgICAgICAgICAgICAgICBpZihzY2UuY29kZSA9PSBqb2IuY2FwYWJpbGl0eV9tYXRyaXhbY2FwXSkgIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBtYXRjaF92aWV3LmNhcGFiaWxpdHlfbmFtZSA9IGNhcGFiaWxpdHkubmFtZTtcbiAgICAgICAgICAgICAgbWF0Y2hfdmlldy5jb21wbGV4aXR5X25hbWUgPSBjb21wbGV4aXR5Lm5hbWU7XG4gICAgICAgICAgICAgIGlmKGpvYl9zY2VuYXJpb3NbMF0pe1xuICAgICAgICAgICAgICAgIG1hdGNoX3ZpZXcuam9iX3NjZW5hcmlvX25hbWU9am9iX3NjZW5hcmlvc1swXS5uYW1lO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmKHNjZW5hcmlvc1swXSkge1xuICAgICAgICAgICAgICAgIG1hdGNoX3ZpZXcuY2FuZGlkYXRlX3NjZW5hcmlvX25hbWU9c2NlbmFyaW9zWzBdLm5hbWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBtYXRjaF92aWV3LnNjZW5hcmlvX25hbWUgPSBtYXRjaF92aWV3LmpvYl9zY2VuYXJpb19uYW1lO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYoaXNGb3VuZCkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChpc0ZvdW5kKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtYXRjaF92aWV3LmNhcGFiaWxpdHlfbmFtZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgbmV3Q2FuZGlkYXRlWydtYXRjaF9tYXAnXVtjYXBdID0gbWF0Y2hfdmlldztcbiAgICAgIH1cblxuICAgIH1cbiAgICByZXR1cm4gbmV3Q2FuZGlkYXRlO1xuICB9XG5cbiAgZ2V0TXVsdGlDb21wYXJlUmVzdWx0KGNhbmRpZGF0ZTogYW55LCBqb2JJZDogc3RyaW5nLCByZWNydWl0ZXJJZDphbnksIGlzQ2FuZGlkYXRlOiBib29sZWFuLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XG5cbiAgICB0aGlzLmNhbmRpZGF0ZVJlcG9zaXRvcnkucmV0cmlldmVCeU11bHRpSWRzQW5kUG9wdWxhdGUoY2FuZGlkYXRlLCB7fSwgKGVycjogYW55LCBjYW5kaWRhdGVSZXM6IGFueSkgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGNhbmRpZGF0ZVJlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgbGV0IGRhdGEgPSB7XG4gICAgICAgICAgICAncG9zdGVkSm9iJzogam9iSWRcbiAgICAgICAgICB9O1xuICAgICAgICAgIGxldCBqb2JQcm9maWxlU2VydmljZTogSm9iUHJvZmlsZVNlcnZpY2UgPSBuZXcgSm9iUHJvZmlsZVNlcnZpY2UoKTtcbiAgICAgICAgICBqb2JQcm9maWxlU2VydmljZS5yZXRyaWV2ZShkYXRhLCAoZXJySW5Kb2IsIHJlc09mUmVjcnVpdGVyKSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJySW5Kb2IpIHtcbiAgICAgICAgICAgICAgY2FsbGJhY2soZXJySW5Kb2IsIG51bGwpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdmFyIGpvYk5hbWUgPSByZXNPZlJlY3J1aXRlci5wb3N0ZWRKb2JzWzBdLmluZHVzdHJ5Lm5hbWU7XG4gICAgICAgICAgICAgIHZhciBqb2IgPSByZXNPZlJlY3J1aXRlci5wb3N0ZWRKb2JzWzBdO1xuICAgICAgICAgICAgICB0aGlzLmluZHVzdHJ5UmVwb3NpdG9yeS5yZXRyaWV2ZSh7J25hbWUnOiBqb2JOYW1lfSwgKGVycjogYW55LCBpbmR1c3RyaWVzOiBJbmR1c3RyeU1vZGVsW10pID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICB2YXIgY29tcGFyZVJlc3VsdDogUHJvZmlsZUNvbXBhcmlzb25EYXRhTW9kZWxbXSA9IG5ldyBBcnJheSgwKTtcbiAgICAgICAgICAgICAgICAgIGZvciAobGV0IGNhbmRpZGF0ZSBvZiBjYW5kaWRhdGVSZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0NhbmRpZGF0ZSA9IHRoaXMuZ2V0Q29tcGFyZURhdGEoY2FuZGlkYXRlLCBqb2IsIGlzQ2FuZGlkYXRlLCBpbmR1c3RyaWVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0NhbmRpZGF0ZSA9IHRoaXMuZ2V0TGlzdFN0YXR1c09mQ2FuZGlkYXRlKG5ld0NhbmRpZGF0ZSxqb2IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3Q2FuZGlkYXRlID0gdGhpcy5zb3J0Q2FuZGlkYXRlU2tpbGxzKG5ld0NhbmRpZGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBhcmVSZXN1bHQucHVzaChuZXdDYW5kaWRhdGUpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgbGV0IHByb2ZpbGVDb21wYXJpc29uTW9kZWw6UHJvZmlsZUNvbXBhcmlzb25Nb2RlbCA9IG5ldyBQcm9maWxlQ29tcGFyaXNvbk1vZGVsKCk7XG4gICAgICAgICAgICAgICAgICBwcm9maWxlQ29tcGFyaXNvbk1vZGVsLnByb2ZpbGVDb21wYXJpc29uRGF0YSA9IGNvbXBhcmVSZXN1bHQ7XG4gICAgICAgICAgICAgICAgICB2YXIgam9iRGV0YWlsczpQcm9maWxlQ29tcGFyaXNvbkpvYk1vZGVsID0gdGhpcy5nZXRKb2JEZXRhaWxzRm9yQ29tcGFyaXNvbihqb2IpO1xuICAgICAgICAgICAgICAgICAgcHJvZmlsZUNvbXBhcmlzb25Nb2RlbC5wcm9maWxlQ29tcGFyaXNvbkpvYkRhdGEgPSBqb2JEZXRhaWxzO1xuICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgcHJvZmlsZUNvbXBhcmlzb25Nb2RlbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjYWxsYmFjayhudWxsLCAnTm8gQ2FuZGlkYXRlIFByb2ZpbGUgUmVzdWx0IEZvdW5kJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdldEpvYkRldGFpbHNGb3JDb21wYXJpc29uKGpvYjpKb2JQcm9maWxlTW9kZWwpIHtcbiAgICB2YXIgcHJvZmlsZUNvbXBhcmlzb25Kb2JNb2RlbDpQcm9maWxlQ29tcGFyaXNvbkpvYk1vZGVsID0gbmV3IFByb2ZpbGVDb21wYXJpc29uSm9iTW9kZWwoKTtcbiAgICBwcm9maWxlQ29tcGFyaXNvbkpvYk1vZGVsLmNpdHkgPSBqb2IubG9jYXRpb24uY2l0eTtcbiAgICBwcm9maWxlQ29tcGFyaXNvbkpvYk1vZGVsLmNvdW50cnkgPSBqb2IubG9jYXRpb24uY291bnRyeTtcbiAgICBwcm9maWxlQ29tcGFyaXNvbkpvYk1vZGVsLnN0YXRlID0gam9iLmxvY2F0aW9uLnN0YXRlO1xuICAgIHByb2ZpbGVDb21wYXJpc29uSm9iTW9kZWwuZWR1Y2F0aW9uID0gam9iLmVkdWNhdGlvbjtcbiAgICBwcm9maWxlQ29tcGFyaXNvbkpvYk1vZGVsLmV4cGVyaWVuY2VNYXhWYWx1ZSA9IGpvYi5leHBlcmllbmNlTWF4VmFsdWU7XG4gICAgcHJvZmlsZUNvbXBhcmlzb25Kb2JNb2RlbC5leHBlcmllbmNlTWluVmFsdWUgPSBqb2IuZXhwZXJpZW5jZU1pblZhbHVlO1xuICAgIHByb2ZpbGVDb21wYXJpc29uSm9iTW9kZWwuaW5kdXN0cnlOYW1lID0gam9iLmluZHVzdHJ5Lm5hbWU7XG4gICAgcHJvZmlsZUNvbXBhcmlzb25Kb2JNb2RlbC5qb2JUaXRsZSA9IGpvYi5qb2JUaXRsZTtcbiAgICBwcm9maWxlQ29tcGFyaXNvbkpvYk1vZGVsLmpvaW5pbmdQZXJpb2QgPSBqb2Iuam9pbmluZ1BlcmlvZDtcbiAgICBwcm9maWxlQ29tcGFyaXNvbkpvYk1vZGVsLnNhbGFyeU1heFZhbHVlID0gam9iLnNhbGFyeU1heFZhbHVlO1xuICAgIHByb2ZpbGVDb21wYXJpc29uSm9iTW9kZWwuc2FsYXJ5TWluVmFsdWUgPSBqb2Iuc2FsYXJ5TWluVmFsdWU7XG4gICAgcHJvZmlsZUNvbXBhcmlzb25Kb2JNb2RlbC5wcm9maWNpZW5jaWVzID0gam9iLnByb2ZpY2llbmNpZXM7XG4gICAgcHJvZmlsZUNvbXBhcmlzb25Kb2JNb2RlbC5pbnRlcmVzdGVkSW5kdXN0cmllcyA9IGpvYi5pbnRlcmVzdGVkSW5kdXN0cmllcztcbiAgICByZXR1cm4gcHJvZmlsZUNvbXBhcmlzb25Kb2JNb2RlbDtcbiAgfVxuICBnZXRMaXN0U3RhdHVzT2ZDYW5kaWRhdGUobmV3Q2FuZGlkYXRlOlByb2ZpbGVDb21wYXJpc29uRGF0YU1vZGVsLGpvYlByb2ZpbGU6Sm9iUHJvZmlsZU1vZGVsKSB7XG4gICAgdmFyIGNhbmRpZGF0ZUxpc3RTdGF0dXM6c3RyaW5nW10gPSBuZXcgQXJyYXkoMCk7XG4gICAgZm9yKGxldCBsaXN0IG9mIGpvYlByb2ZpbGUuY2FuZGlkYXRlX2xpc3QpIHtcbiAgICAgIGZvcihsZXQgaWQgb2YgbGlzdC5pZHMpIHtcbiAgICAgICAgIGlmKG5ld0NhbmRpZGF0ZS5faWQgPT0gaWQpIHtcbiAgICAgICAgICAgY2FuZGlkYXRlTGlzdFN0YXR1cy5wdXNoKGxpc3QubmFtZSk7XG4gICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmKGNhbmRpZGF0ZUxpc3RTdGF0dXMubGVuZ3RoID09IDApIHtcbiAgICAgIGNhbmRpZGF0ZUxpc3RTdGF0dXMucHVzaCgnbWF0Y2hlZExpc3QnKTtcbiAgICB9XG4gICAgbmV3Q2FuZGlkYXRlLmNhbmRpZGF0ZUxpc3RTdGF0dXMgPSBjYW5kaWRhdGVMaXN0U3RhdHVzO1xuICAgIHJldHVybiBuZXdDYW5kaWRhdGU7XG4gIH1cblxuICBzb3J0Q2FuZGlkYXRlU2tpbGxzKG5ld0NhbmRpZGF0ZTpQcm9maWxlQ29tcGFyaXNvbkRhdGFNb2RlbCkge1xuXG4gICAgdmFyIHNraWxsU3RhdHVzRGF0YTpTa2lsbFN0YXR1c1tdID0gbmV3IEFycmF5KDApO1xuICAgIGZvcihsZXQgdmFsdWUgb2YgbmV3Q2FuZGlkYXRlLnByb2ZpY2llbmNpZXNNYXRjaCkge1xuICAgICAgdmFyIHNraWxsU3RhdHVzOlNraWxsU3RhdHVzID0gbmV3IFNraWxsU3RhdHVzKCk7XG4gICAgICBza2lsbFN0YXR1cy5uYW1lID0gdmFsdWU7XG4gICAgICBza2lsbFN0YXR1cy5zdGF0dXMgPSAnTWF0Y2gnO1xuICAgICAgc2tpbGxTdGF0dXNEYXRhLnB1c2goc2tpbGxTdGF0dXMpO1xuICAgIH1cbiAgICBmb3IobGV0IHZhbHVlIG9mIG5ld0NhbmRpZGF0ZS5wcm9maWNpZW5jaWVzVW5NYXRjaCkge1xuICAgICAgdmFyIHNraWxsU3RhdHVzOlNraWxsU3RhdHVzID0gbmV3IFNraWxsU3RhdHVzKCk7XG4gICAgICBza2lsbFN0YXR1cy5uYW1lID0gdmFsdWU7XG4gICAgICBza2lsbFN0YXR1cy5zdGF0dXMgPSAnVW5NYXRjaCc7XG4gICAgICBza2lsbFN0YXR1c0RhdGEucHVzaChza2lsbFN0YXR1cyk7XG4gICAgfVxuICAgIG5ld0NhbmRpZGF0ZS5jYW5kaWRhdGVTa2lsbFN0YXR1cyA9IHNraWxsU3RhdHVzRGF0YTtcbiAgICByZXR1cm4gbmV3Q2FuZGlkYXRlO1xuICB9XG5cbiAgZ2V0Q2FuZGlkYXRlVmlzaWJpbGl0eUFnYWluc3RSZWNydWl0ZXIoY2FuZGlkYXRlRGV0YWlsczpDYW5kaWRhdGVNb2RlbCwgam9iUHJvZmlsZXM6Sm9iUHJvZmlsZU1vZGVsW10pIHtcbiAgICBsZXQgaXNHb3RJdCA9IHRydWU7XG4gICAgdmFyIF9jYW5EZXRhaWxzV2l0aEpvYk1hdGNoaW5nOkNhbmRpZGF0ZURldGFpbHNXaXRoSm9iTWF0Y2hpbmcgPSBuZXcgQ2FuZGlkYXRlRGV0YWlsc1dpdGhKb2JNYXRjaGluZygpO1xuICAgIGZvciAobGV0IGpvYiBvZiBqb2JQcm9maWxlcykge1xuICAgICAgZm9yIChsZXQgaXRlbSBvZiBqb2IuY2FuZGlkYXRlX2xpc3QpIHtcbiAgICAgICAgaWYgKGl0ZW0ubmFtZSA9PT0gJ2NhcnRMaXN0ZWQnKSB7XG4gICAgICAgICAgaWYgKGl0ZW0uaWRzLmluZGV4T2YobmV3IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkKGNhbmRpZGF0ZURldGFpbHMuX2lkKS50b1N0cmluZygpKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIGlzR290SXQgPSBmYWxzZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKCFpc0dvdEl0KSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChpc0dvdEl0KSB7XG4gICAgICBjYW5kaWRhdGVEZXRhaWxzLnVzZXJJZC5tb2JpbGVfbnVtYmVyID0gVXRpbGl0eUZ1bmN0aW9uLm1vYmlsZU51bWJlckhpZGVyKGNhbmRpZGF0ZURldGFpbHMudXNlcklkLm1vYmlsZV9udW1iZXIpO1xuICAgICAgY2FuZGlkYXRlRGV0YWlscy51c2VySWQuZW1haWwgPSBVdGlsaXR5RnVuY3Rpb24uZW1haWxWYWx1ZUhpZGVyKGNhbmRpZGF0ZURldGFpbHMudXNlcklkLmVtYWlsKTtcbiAgICAgIGNhbmRpZGF0ZURldGFpbHMuYWNhZGVtaWNzID0gW107XG4gICAgICBjYW5kaWRhdGVEZXRhaWxzLmVtcGxveW1lbnRIaXN0b3J5ID0gW107XG4gICAgICBjYW5kaWRhdGVEZXRhaWxzLmFyZWFPZldvcmsgPSBbXTtcbiAgICAgIGNhbmRpZGF0ZURldGFpbHMucHJvZmljaWVuY2llcyA9IFtdO1xuICAgICAgY2FuZGlkYXRlRGV0YWlscy5hd2FyZHMgPSBbXTtcbiAgICAgIGNhbmRpZGF0ZURldGFpbHMucHJvZmljaWVuY2llcyA9IFtdO1xuICAgICAgY2FuZGlkYXRlRGV0YWlscy5wcm9mZXNzaW9uYWxEZXRhaWxzLmVkdWNhdGlvbiA9IFV0aWxpdHlGdW5jdGlvbi52YWx1ZUhpZGUoY2FuZGlkYXRlRGV0YWlscy5wcm9mZXNzaW9uYWxEZXRhaWxzLmVkdWNhdGlvbilcbiAgICAgIGNhbmRpZGF0ZURldGFpbHMucHJvZmVzc2lvbmFsRGV0YWlscy5leHBlcmllbmNlID0gVXRpbGl0eUZ1bmN0aW9uLnZhbHVlSGlkZShjYW5kaWRhdGVEZXRhaWxzLnByb2Zlc3Npb25hbERldGFpbHMuZXhwZXJpZW5jZSlcbiAgICAgIGNhbmRpZGF0ZURldGFpbHMucHJvZmVzc2lvbmFsRGV0YWlscy5pbmR1c3RyeUV4cG9zdXJlID0gVXRpbGl0eUZ1bmN0aW9uLnZhbHVlSGlkZShjYW5kaWRhdGVEZXRhaWxzLnByb2Zlc3Npb25hbERldGFpbHMuaW5kdXN0cnlFeHBvc3VyZSk7XG4gICAgICBjYW5kaWRhdGVEZXRhaWxzLnByb2Zlc3Npb25hbERldGFpbHMuY3VycmVudFNhbGFyeSA9IFV0aWxpdHlGdW5jdGlvbi52YWx1ZUhpZGUoY2FuZGlkYXRlRGV0YWlscy5wcm9mZXNzaW9uYWxEZXRhaWxzLmN1cnJlbnRTYWxhcnkpO1xuICAgICAgY2FuZGlkYXRlRGV0YWlscy5wcm9mZXNzaW9uYWxEZXRhaWxzLm5vdGljZVBlcmlvZCA9IFV0aWxpdHlGdW5jdGlvbi52YWx1ZUhpZGUoY2FuZGlkYXRlRGV0YWlscy5wcm9mZXNzaW9uYWxEZXRhaWxzLm5vdGljZVBlcmlvZCk7XG4gICAgICBjYW5kaWRhdGVEZXRhaWxzLnByb2Zlc3Npb25hbERldGFpbHMucmVsb2NhdGUgPSBVdGlsaXR5RnVuY3Rpb24udmFsdWVIaWRlKGNhbmRpZGF0ZURldGFpbHMucHJvZmVzc2lvbmFsRGV0YWlscy5yZWxvY2F0ZSk7XG4gICAgfVxuICAgIGNhbmRpZGF0ZURldGFpbHMudXNlcklkLnBhc3N3b3JkID0gJyc7XG4gICAgX2NhbkRldGFpbHNXaXRoSm9iTWF0Y2hpbmcuY2FuZGlkYXRlRGV0YWlscyA9IGNhbmRpZGF0ZURldGFpbHM7XG4gICAgX2NhbkRldGFpbHNXaXRoSm9iTWF0Y2hpbmcuaXNTaG93Q2FuZGlkYXRlRGV0YWlscyA9IGlzR290SXQ7XG4gICAgcmV0dXJuIF9jYW5EZXRhaWxzV2l0aEpvYk1hdGNoaW5nO1xuICB9XG59XG5cbk9iamVjdC5zZWFsKFNlYXJjaFNlcnZpY2UpO1xuZXhwb3J0ID0gU2VhcmNoU2VydmljZTtcbiJdfQ==
