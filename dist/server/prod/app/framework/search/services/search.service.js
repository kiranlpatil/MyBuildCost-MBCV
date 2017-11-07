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
            'capability_matrix': 1,
            'complexity_musthave_matrix': 1
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
        if (job.complexity_musthave_matrix && job.complexity_musthave_matrix.length > 0) {
            for (var _i = 0, _a = job.complexity_musthave_matrix; _i < _a.length; _i++) {
                var isComplexity = _a[_i];
                if (newCandidate.complexity_musthave_matrix.indexOf(isComplexity) !== -1) {
                    newCandidate.complexity_musthave_matrix.push(isComplexity);
                }
            }
        }
        for (var _b = 0, _c = job.interestedIndustries; _b < _c.length; _b++) {
            var industry = _c[_b];
            if (newCandidate.interestedIndustries.indexOf(industry) !== -1) {
                newCandidate.interestedIndustryMatch.push(industry);
            }
        }
        newCandidate.proficienciesMatch = new Array(0);
        for (var _d = 0, _e = job.proficiencies; _d < _e.length; _d++) {
            var proficiency = _e[_d];
            if (newCandidate.proficiencies.indexOf(proficiency) !== -1) {
                newCandidate.proficienciesMatch.push(proficiency);
            }
        }
        newCandidate.proficienciesUnMatch = new Array(0);
        for (var _f = 0, _g = job.proficiencies; _f < _g.length; _f++) {
            var proficiency = _g[_f];
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
        profileComparisonResult.complexity_note_matrix = candidate.complexity_note_matrix;
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
                            if (newCandidate.complexity_note_matrix && newCandidate.complexity_note_matrix[cap]) {
                                match_view.complexityNote = newCandidate.complexity_note_matrix[cap];
                            }
                            if (job.complexity_musthave_matrix && job.complexity_musthave_matrix[cap]) {
                                match_view.complexityIsMustHave = job.complexity_musthave_matrix[cap];
                            }
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
                            if (newCandidate.complexity_note_matrix && newCandidate.complexity_note_matrix[cap]) {
                                match_view.complexityNote = newCandidate.complexity_note_matrix[cap];
                            }
                            if (job.complexity_musthave_matrix && job.complexity_musthave_matrix[cap]) {
                                match_view.complexityIsMustHave = job.complexity_musthave_matrix[cap];
                            }
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2VhcmNoL3NlcnZpY2VzL3NlYXJjaC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSxzRkFBeUY7QUFDekYsd0RBQTJEO0FBQzNELHNGQUF5RjtBQUV6RixxRUFBd0U7QUFDeEUsZ0VBQXFFO0FBQ3JFLHNHQUE2RztBQUM3RywwRkFBcUY7QUFDckYsNEZBQXVGO0FBQ3ZGLG9HQUE4RjtBQUM5RixtQ0FBcUM7QUFDckMsMEdBQXVHO0FBQ3ZHLG9FQUFnRTtBQUNoRSx3RUFBMkU7QUFDM0UseURBQTREO0FBQzVELG9GQUF1RjtBQUd2RixJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFFNUM7SUFPRTtRQUNFLElBQUksQ0FBQyxRQUFRLEdBQUcsWUFBWSxDQUFDLFFBQVEsQ0FBQztRQUN0QyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxtQkFBbUIsRUFBRSxDQUFDO1FBQ3JELElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLG1CQUFtQixFQUFFLENBQUM7UUFDckQsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksa0JBQWtCLEVBQUUsQ0FBQztRQUNuRCxJQUFJLEdBQUcsR0FBUSxJQUFJLFlBQVksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUMvQyxJQUFJLENBQUMsc0JBQXNCLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQztJQUNoRCxDQUFDO0lBRUQsNkNBQXFCLEdBQXJCLFVBQXNCLFVBQTJCLEVBQUUsUUFBMkM7UUFBOUYsaUJBMkdDO1FBMUdDLE9BQU8sQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUN0QyxJQUFJLElBQVMsQ0FBQztRQUNkLElBQUksT0FBTyxHQUFZLEtBQUssQ0FBQztRQUM3QixJQUFJLFVBQVUsR0FBYSxFQUFFLENBQUM7UUFDOUIsSUFBSSx5QkFBeUIsR0FBWSxLQUFLLENBQUM7UUFDL0MsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLG9C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YXJjaC5zZXJ2aWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEpvYlByb2ZpbGVNb2RlbCA9IHJlcXVpcmUoJy4uLy4uL2RhdGFhY2Nlc3MvbW9kZWwvam9icHJvZmlsZS5tb2RlbCcpO1xuaW1wb3J0IENhbmRpZGF0ZVJlcG9zaXRvcnkgPSByZXF1aXJlKCcuLi8uLi9kYXRhYWNjZXNzL3JlcG9zaXRvcnkvY2FuZGlkYXRlLnJlcG9zaXRvcnknKTtcbmltcG9ydCBQcm9qZWN0QXNzZXQgPSByZXF1aXJlKCcuLi8uLi9zaGFyZWQvcHJvamVjdGFzc2V0Jyk7XG5pbXBvcnQgUmVjcnVpdGVyUmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uLy4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9yZWNydWl0ZXIucmVwb3NpdG9yeScpO1xuaW1wb3J0IENhbmRpZGF0ZU1vZGVsID0gcmVxdWlyZSgnLi4vLi4vZGF0YWFjY2Vzcy9tb2RlbC9jYW5kaWRhdGUubW9kZWwnKTtcbmltcG9ydCBKb2JQcm9maWxlU2VydmljZSA9IHJlcXVpcmUoJy4uLy4uL3NlcnZpY2VzL2pvYnByb2ZpbGUuc2VydmljZScpO1xuaW1wb3J0IHtBY3Rpb25zLCBDb25zdFZhcmlhYmxlc30gZnJvbSBcIi4uLy4uL3NoYXJlZC9zaGFyZWRjb25zdGFudHNcIjtcbmltcG9ydCB7UHJvZmlsZUNvbXBhcmlzb25EYXRhTW9kZWwsIFNraWxsU3RhdHVzfSBmcm9tIFwiLi4vLi4vZGF0YWFjY2Vzcy9tb2RlbC9wcm9maWxlLWNvbXBhcmlzb24tZGF0YS5tb2RlbFwiO1xuaW1wb3J0IHtDYXBhYmlsaXR5TWF0cml4TW9kZWx9IGZyb20gXCIuLi8uLi9kYXRhYWNjZXNzL21vZGVsL2NhcGFiaWxpdHktbWF0cml4Lm1vZGVsXCI7XG5pbXBvcnQge1Byb2ZpbGVDb21wYXJpc29uTW9kZWx9IGZyb20gXCIuLi8uLi9kYXRhYWNjZXNzL21vZGVsL3Byb2ZpbGUtY29tcGFyaXNvbi5tb2RlbFwiO1xuaW1wb3J0IHtQcm9maWxlQ29tcGFyaXNvbkpvYk1vZGVsfSBmcm9tIFwiLi4vLi4vZGF0YWFjY2Vzcy9tb2RlbC9wcm9maWxlLWNvbXBhcmlzb24tam9iLm1vZGVsXCI7XG5pbXBvcnQgKiBhcyBtb25nb29zZSBmcm9tIFwibW9uZ29vc2VcIjtcbmltcG9ydCB7Q2FuZGlkYXRlRGV0YWlsc1dpdGhKb2JNYXRjaGluZ30gZnJvbSBcIi4uLy4uL2RhdGFhY2Nlc3MvbW9kZWwvY2FuZGlkYXRlZGV0YWlsc3dpdGhqb2JtYXRjaGluZ1wiO1xuaW1wb3J0IHtVdGlsaXR5RnVuY3Rpb259IGZyb20gXCIuLi8uLi91aXRpbGl0eS91dGlsaXR5LWZ1bmN0aW9uXCI7XG5pbXBvcnQgTWF0Y2hWaWV3TW9kZWwgPSByZXF1aXJlKCcuLi8uLi9kYXRhYWNjZXNzL21vZGVsL21hdGNoLXZpZXcubW9kZWwnKTtcbmltcG9ydCBNYXRjaCA9IHJlcXVpcmUoJy4uLy4uL2RhdGFhY2Nlc3MvbW9kZWwvbWF0Y2gtZW51bScpO1xuaW1wb3J0IEluZHVzdHJ5UmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uLy4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9pbmR1c3RyeS5yZXBvc2l0b3J5Jyk7XG5pbXBvcnQgSW5kdXN0cnlNb2RlbCA9IHJlcXVpcmUoJy4uLy4uL2RhdGFhY2Nlc3MvbW9kZWwvaW5kdXN0cnkubW9kZWwnKTtcbmltcG9ydCBTY2VuYXJpb01vZGVsID0gcmVxdWlyZSgnLi4vLi4vZGF0YWFjY2Vzcy9tb2RlbC9zY2VuYXJpby5tb2RlbCcpO1xubGV0IHVzZXN0cmFja2luZyA9IHJlcXVpcmUoJ3VzZXMtdHJhY2tpbmcnKTtcblxuY2xhc3MgU2VhcmNoU2VydmljZSB7XG4gIEFQUF9OQU1FOiBzdHJpbmc7XG4gIGNhbmRpZGF0ZVJlcG9zaXRvcnk6IENhbmRpZGF0ZVJlcG9zaXRvcnk7XG4gIHJlY3J1aXRlclJlcG9zaXRvcnk6IFJlY3J1aXRlclJlcG9zaXRvcnk7XG4gIGluZHVzdHJ5UmVwb3NpdG9yeTogSW5kdXN0cnlSZXBvc2l0b3J5O1xuICBwcml2YXRlIHVzZXNUcmFja2luZ0NvbnRyb2xsZXI6IGFueTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLkFQUF9OQU1FID0gUHJvamVjdEFzc2V0LkFQUF9OQU1FO1xuICAgIHRoaXMuY2FuZGlkYXRlUmVwb3NpdG9yeSA9IG5ldyBDYW5kaWRhdGVSZXBvc2l0b3J5KCk7XG4gICAgdGhpcy5yZWNydWl0ZXJSZXBvc2l0b3J5ID0gbmV3IFJlY3J1aXRlclJlcG9zaXRvcnkoKTtcbiAgICB0aGlzLmluZHVzdHJ5UmVwb3NpdG9yeSA9IG5ldyBJbmR1c3RyeVJlcG9zaXRvcnkoKTtcbiAgICBsZXQgb2JqOiBhbnkgPSBuZXcgdXNlc3RyYWNraW5nLk15Q29udHJvbGxlcigpO1xuICAgIHRoaXMudXNlc1RyYWNraW5nQ29udHJvbGxlciA9IG9iai5fY29udHJvbGxlcjtcbiAgfVxuXG4gIGdldE1hdGNoaW5nQ2FuZGlkYXRlcyhqb2JQcm9maWxlOiBKb2JQcm9maWxlTW9kZWwsIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcbiAgICBjb25zb2xlLnRpbWUoJ2dldE1hdGNoaW5nIENhbmRpZGF0ZScpO1xuICAgIGxldCBkYXRhOiBhbnk7XG4gICAgbGV0IGlzRm91bmQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBsZXQgaW5kdXN0cmllczogc3RyaW5nW10gPSBbXTtcbiAgICBsZXQgaXNSZWxldmVudEluZHVzdHJpZXNGb3VuZDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIGlmIChqb2JQcm9maWxlLmludGVyZXN0ZWRJbmR1c3RyaWVzICYmIGpvYlByb2ZpbGUuaW50ZXJlc3RlZEluZHVzdHJpZXMubGVuZ3RoID4gMCkge1xuICAgICAgLyppc0ZvdW5kPSBqb2JQcm9maWxlLmludGVyZXN0ZWRJbmR1c3RyaWVzLmZpbHRlcigobmFtZSA6IHN0cmluZyk9PiB7XG4gICAgICAgaWYobmFtZSA9PT0gJ05vbmUnKXtcbiAgICAgICByZXR1cm4gbmFtZTtcbiAgICAgICB9XG4gICAgICAgfSk7Ki9cbiAgICAgIC8vam9iUHJvZmlsZS5yZWxldmVudEluZHVzdHJpZXMgPSBbJ1RleHRpbGUnXTtcbiAgICAgIGZvciAobGV0IG5hbWUgb2Ygam9iUHJvZmlsZS5pbnRlcmVzdGVkSW5kdXN0cmllcykge1xuICAgICAgICBpZiAobmFtZSA9PT0gJ05vbmUnKSB7XG4gICAgICAgICAgaXNGb3VuZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmKGpvYlByb2ZpbGUucmVsZXZlbnRJbmR1c3RyaWVzICYmIGpvYlByb2ZpbGUucmVsZXZlbnRJbmR1c3RyaWVzLmxlbmd0aCkge1xuICAgICAgICBpc1JlbGV2ZW50SW5kdXN0cmllc0ZvdW5kID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmIChpc0ZvdW5kKSB7XG5cbiAgICAgICAgaWYoaXNSZWxldmVudEluZHVzdHJpZXNGb3VuZCkge1xuICAgICAgICAgIGluZHVzdHJpZXMgPSBqb2JQcm9maWxlLnJlbGV2ZW50SW5kdXN0cmllcztcblxuICAgICAgICAgIGluZHVzdHJpZXMucHVzaChqb2JQcm9maWxlLmluZHVzdHJ5Lm5hbWUpO1xuICAgICAgICAgIGRhdGEgPSB7XG4gICAgICAgICAgICAnaW5kdXN0cnkubmFtZSc6IHskaW46IGluZHVzdHJpZXN9LFxuICAgICAgICAgICAgJG9yOiBbXG4gICAgICAgICAgICAgIHsncHJvZmVzc2lvbmFsRGV0YWlscy5yZWxvY2F0ZSc6ICdZZXMnfSxcbiAgICAgICAgICAgICAgeydsb2NhdGlvbi5jaXR5Jzogam9iUHJvZmlsZS5sb2NhdGlvbi5jaXR5fVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICdwcm9maWNpZW5jaWVzJzogeyRpbjogam9iUHJvZmlsZS5wcm9maWNpZW5jaWVzfSxcbiAgICAgICAgICAgICdpc1Zpc2libGUnOiB0cnVlLFxuICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGF0YSA9IHtcbiAgICAgICAgICAgICdpbmR1c3RyeS5uYW1lJzogam9iUHJvZmlsZS5pbmR1c3RyeS5uYW1lLFxuICAgICAgICAgICAgJG9yOiBbXG4gICAgICAgICAgICAgIHsncHJvZmVzc2lvbmFsRGV0YWlscy5yZWxvY2F0ZSc6ICdZZXMnfSxcbiAgICAgICAgICAgICAgeydsb2NhdGlvbi5jaXR5Jzogam9iUHJvZmlsZS5sb2NhdGlvbi5jaXR5fVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICdwcm9maWNpZW5jaWVzJzogeyRpbjogam9iUHJvZmlsZS5wcm9maWNpZW5jaWVzfSxcbiAgICAgICAgICAgICdpc1Zpc2libGUnOiB0cnVlLFxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmKGlzUmVsZXZlbnRJbmR1c3RyaWVzRm91bmQpIHtcbiAgICAgICAgICBpbmR1c3RyaWVzID0gam9iUHJvZmlsZS5yZWxldmVudEluZHVzdHJpZXM7XG4gICAgICAgICAgaW5kdXN0cmllcy5wdXNoKGpvYlByb2ZpbGUuaW5kdXN0cnkubmFtZSk7XG4gICAgICAgICAgZGF0YSA9IHtcbiAgICAgICAgICAgICdpbmR1c3RyeS5uYW1lJzogeyRpbjogaW5kdXN0cmllc30sXG4gICAgICAgICAgICAkb3I6IFtcbiAgICAgICAgICAgICAgeydwcm9mZXNzaW9uYWxEZXRhaWxzLnJlbG9jYXRlJzogJ1llcyd9LFxuICAgICAgICAgICAgICB7J2xvY2F0aW9uLmNpdHknOiBqb2JQcm9maWxlLmxvY2F0aW9uLmNpdHl9XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgJ3Byb2ZpY2llbmNpZXMnOiB7JGluOiBqb2JQcm9maWxlLnByb2ZpY2llbmNpZXN9LFxuICAgICAgICAgICAgJ2ludGVyZXN0ZWRJbmR1c3RyaWVzJzogeyRpbjogam9iUHJvZmlsZS5pbnRlcmVzdGVkSW5kdXN0cmllc30sXG4gICAgICAgICAgICAnaXNWaXNpYmxlJzogdHJ1ZSxcbiAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRhdGEgPSB7XG4gICAgICAgICAgICAnaW5kdXN0cnkubmFtZSc6IGpvYlByb2ZpbGUuaW5kdXN0cnkubmFtZSxcbiAgICAgICAgICAgICRvcjogW1xuICAgICAgICAgICAgICB7J3Byb2Zlc3Npb25hbERldGFpbHMucmVsb2NhdGUnOiAnWWVzJ30sXG4gICAgICAgICAgICAgIHsnbG9jYXRpb24uY2l0eSc6IGpvYlByb2ZpbGUubG9jYXRpb24uY2l0eX1cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAncHJvZmljaWVuY2llcyc6IHskaW46IGpvYlByb2ZpbGUucHJvZmljaWVuY2llc30sXG4gICAgICAgICAgICAnaW50ZXJlc3RlZEluZHVzdHJpZXMnOiB7JGluOiBqb2JQcm9maWxlLmludGVyZXN0ZWRJbmR1c3RyaWVzfSxcbiAgICAgICAgICAgICdpc1Zpc2libGUnOiB0cnVlLFxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgIH0gZWxzZSB7XG4gICAgICBkYXRhID0ge1xuICAgICAgICAnaXNWaXNpYmxlJzogdHJ1ZSxcbiAgICAgICAgJ2luZHVzdHJ5Lm5hbWUnOiBqb2JQcm9maWxlLmluZHVzdHJ5Lm5hbWUsXG4gICAgICAgICdwcm9maWNpZW5jaWVzJzogeyRpbjogam9iUHJvZmlsZS5wcm9maWNpZW5jaWVzfSxcbiAgICAgICAgJG9yOiBbXG4gICAgICAgICAgeydwcm9mZXNzaW9uYWxEZXRhaWxzLnJlbG9jYXRlJzogJ1llcyd9LFxuICAgICAgICAgIHsnbG9jYXRpb24uY2l0eSc6IGpvYlByb2ZpbGUubG9jYXRpb24uY2l0eX1cbiAgICAgICAgXVxuICAgICAgfTtcbiAgICB9XG4gICAgbGV0IGluY2x1ZGVkX2ZpZWxkcyA9IHtcbiAgICAgICdpbmR1c3RyeS5yb2xlcy5jYXBhYmlsaXRpZXMuY29tcGxleGl0aWVzLnNjZW5hcmlvcy5jb2RlJzogMSxcbiAgICAgICdpbmR1c3RyeS5yb2xlcy5jYXBhYmlsaXRpZXMuY29tcGxleGl0aWVzLnNjZW5hcmlvcy5pc0NoZWNrZWQnOiAxLFxuICAgICAgJ2luZHVzdHJ5LnJvbGVzLmRlZmF1bHRfY29tcGxleGl0aWVzLmNvbXBsZXhpdGllcy5zY2VuYXJpb3MuY29kZSc6IDEsXG4gICAgICAnaW5kdXN0cnkucm9sZXMuZGVmYXVsdF9jb21wbGV4aXRpZXMuY29tcGxleGl0aWVzLnNjZW5hcmlvcy5pc0NoZWNrZWQnOiAxLFxuICAgICAgJ3VzZXJJZCc6IDEsXG4gICAgICAncHJvZmljaWVuY2llcyc6IDEsXG4gICAgICAnbG9jYXRpb24nOiAxLFxuICAgICAgJ2ludGVyZXN0ZWRJbmR1c3RyaWVzJzogMSxcbiAgICAgICdwcm9mZXNzaW9uYWxEZXRhaWxzJzogMSxcbiAgICAgICdjYXBhYmlsaXR5X21hdHJpeCc6MSxcbiAgICAgICdjb21wbGV4aXR5X211c3RoYXZlX21hdHJpeCc6IDFcbiAgICB9O1xuICAgIHRoaXMuY2FuZGlkYXRlUmVwb3NpdG9yeS5yZXRyaWV2ZVdpdGhMZWFuKGRhdGEsIGluY2x1ZGVkX2ZpZWxkcywgKGVyciwgcmVzKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBjYWxsYmFjayhudWxsLCByZXMpO1xuICAgICAgICB0aGlzLmNhbmRpZGF0ZVJlcG9zaXRvcnkuZ2V0Q2FuZGlkYXRlUUNhcmQocmVzLCBqb2JQcm9maWxlLCB1bmRlZmluZWQsIGNhbGxiYWNrKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdldE1hdGNoaW5nSm9iUHJvZmlsZShjYW5kaWRhdGU6IENhbmRpZGF0ZU1vZGVsLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XG5cbiAgICBsZXQgY3VycmVudERhdGUgPSBuZXcgRGF0ZSgpO1xuICAgIGxldCBkYXRhID0ge1xuICAgICAgJ3Bvc3RlZEpvYnMuaW5kdXN0cnkubmFtZSc6IGNhbmRpZGF0ZS5pbmR1c3RyeS5uYW1lLFxuICAgICAgJ3Bvc3RlZEpvYnMucHJvZmljaWVuY2llcyc6IHskaW46IGNhbmRpZGF0ZS5wcm9maWNpZW5jaWVzfSxcbiAgICAgICdwb3N0ZWRKb2JzLmV4cGlyaW5nRGF0ZSc6IHskZ3RlOiBjdXJyZW50RGF0ZX1cbiAgICB9O1xuICAgIGxldCBleGNsdWRlZF9maWVsZHMgPSB7XG4gICAgICAncG9zdGVkSm9icy5pbmR1c3RyeS5yb2xlcyc6IDAsXG4gICAgfTtcbiAgICB0aGlzLnJlY3J1aXRlclJlcG9zaXRvcnkucmV0cmlldmVXaXRoTGVhbihkYXRhLGV4Y2x1ZGVkX2ZpZWxkcywgKGVyciwgcmVzKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnJlY3J1aXRlclJlcG9zaXRvcnkuZ2V0Sm9iUHJvZmlsZVFDYXJkKHJlcywgY2FuZGlkYXRlLCB1bmRlZmluZWQsICdub25lJywgY2FsbGJhY2spO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZ2V0TWF0Y2hpbmdSZXN1bHQoY2FuZGlkYXRlSWQ6IHN0cmluZywgam9iSWQ6IHN0cmluZywgaXNDYW5kaWRhdGUgOiBib29sZWFuLGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcbiAgICBsZXQgdXNlc19kYXRhID0ge1xuICAgICAgY2FuZGlkYXRlSWQ6IGNhbmRpZGF0ZUlkLFxuICAgICAgam9iUHJvZmlsZUlkOiBqb2JJZCxcbiAgICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKSxcbiAgICAgIGFjdGlvbjogQWN0aW9ucy5ERUZBVUxUX1ZBTFVFXG4gICAgfTtcbiAgICBpZiAoaXNDYW5kaWRhdGUpIHtcbiAgICAgIHVzZXNfZGF0YS5hY3Rpb24gPSBBY3Rpb25zLlZJRVdFRF9KT0JfUFJPRklMRV9CWV9DQU5ESURBVEU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHVzZXNfZGF0YS5hY3Rpb24gPSBBY3Rpb25zLlZJRVdFRF9GVUxMX1BST0ZJTEVfQllfUkVDUlVJVEVSO1xuICAgIH1cbiAgICB0aGlzLnVzZXNUcmFja2luZ0NvbnRyb2xsZXIuY3JlYXRlKHVzZXNfZGF0YSk7XG4gICAgdGhpcy5jYW5kaWRhdGVSZXBvc2l0b3J5LmZpbmRCeUlkd2l0aEV4Y2x1ZGUoY2FuZGlkYXRlSWQseydpbmR1c3RyeSc6MH0sIChlcnI6IGFueSwgY2FuZGlkYXRlUmVzOiBhbnkpID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChjYW5kaWRhdGVSZXMpIHtcbiAgICAgICAgICBsZXQgZGF0YSA9IHtcbiAgICAgICAgICAgICdwb3N0ZWRKb2InOiBqb2JJZFxuICAgICAgICAgIH07XG4gICAgICAgICAgbGV0IGpvYlByb2ZpbGVTZXJ2aWNlOiBKb2JQcm9maWxlU2VydmljZSA9IG5ldyBKb2JQcm9maWxlU2VydmljZSgpO1xuICAgICAgICAgIGpvYlByb2ZpbGVTZXJ2aWNlLnJldHJpZXZlKGRhdGEsIChlcnJJbkpvYiwgcmVzT2ZSZWNydWl0ZXIpID0+IHtcbiAgICAgICAgICAgIGlmIChlcnJJbkpvYikge1xuICAgICAgICAgICAgICBjYWxsYmFjayhlcnJJbkpvYiwgbnVsbCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzLmdldFJlc3VsdChjYW5kaWRhdGVSZXMsIHJlc09mUmVjcnVpdGVyLnBvc3RlZEpvYnNbMF0sIGlzQ2FuZGlkYXRlLCBjYWxsYmFjayk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG5cbiAgY29tcGFyZVR3b09wdGlvbnMoZmlyc3Q6IG51bWJlciwgc2Vjb25kOiBudW1iZXIpOiBzdHJpbmcge1xuICAgIGlmIChmaXJzdCA8IHNlY29uZCkge1xuICAgICAgcmV0dXJuICdiZWxvdyc7XG4gICAgfSBlbHNlIGlmIChmaXJzdCA+IHNlY29uZCkge1xuICAgICAgcmV0dXJuICdhYm92ZSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnZXhhY3QnO1xuICAgIH1cbiAgfVxuXG4gIGdldEVkdWN0aW9uU3dpdGNoQ2FzZShlZHVjYXRpb246IHN0cmluZyk6IG51bWJlciB7XG4gICAgc3dpdGNoIChlZHVjYXRpb24pIHtcbiAgICAgIGNhc2UgJ1VuZGVyIEdyYWR1YXRlJzpcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgICBjYXNlICdHcmFkdWF0ZSc6XG4gICAgICAgIHJldHVybiAyO1xuICAgICAgY2FzZSAnUG9zdCBHcmFkdWF0ZSc6XG4gICAgICAgIHJldHVybiAzO1xuICAgIH1cbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICBnZXRQZXJpb2RTd2l0Y2hDYXNlKHBlcmlvZDogc3RyaW5nKTogbnVtYmVyIHsvL1RPIERPIDpEbyBub3QgdXNlIGhhcmQgY29kaW5nXG4gICAgc3dpdGNoIChwZXJpb2QpIHtcbiAgICAgIGNhc2UgJ0ltbWVkaWF0ZScgOlxuICAgICAgICByZXR1cm4gMTtcbiAgICAgIGNhc2UgJ1dpdGhpbiAxIG1vbnRocyc6XG4gICAgICAgIHJldHVybiAyO1xuICAgICAgY2FzZSAnMS0yIE1vbnRocyc6XG4gICAgICAgIHJldHVybiAzO1xuICAgICAgY2FzZSAnMi0zIE1vbnRocyc6XG4gICAgICAgIHJldHVybiA0O1xuICAgICAgY2FzZSAnQmV5b25kIDMgbW9udGhzJzpcbiAgICAgICAgcmV0dXJuIDU7XG4gICAgfVxuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIGdldFJlc3VsdChjYW5kaWRhdGU6IGFueSwgam9iOiBhbnksIGlzQ2FuZGlkYXRlOiBib29sZWFuLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XG4gICAgdGhpcy5pbmR1c3RyeVJlcG9zaXRvcnkucmV0cmlldmUoeyduYW1lJzogam9iLmluZHVzdHJ5Lm5hbWV9LCAoZXJyOiBhbnksIGluZHVzdHJpZXM6IEluZHVzdHJ5TW9kZWxbXSkgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIG5ld0NhbmRpZGF0ZSA9IHRoaXMuZ2V0Q29tcGFyZURhdGEoY2FuZGlkYXRlLCBqb2IsIGlzQ2FuZGlkYXRlLCBpbmR1c3RyaWVzKTtcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgbmV3Q2FuZGlkYXRlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdldENvbXBhcmVEYXRhKGNhbmRpZGF0ZTogQ2FuZGlkYXRlTW9kZWwsIGpvYjogYW55LCBpc0NhbmRpZGF0ZTogYm9vbGVhbiwgaW5kdXN0cmllczogSW5kdXN0cnlNb2RlbFtdKSB7XG4gICAgLy9sZXQgbmV3Q2FuZGlkYXRlID0gY2FuZGlkYXRlLnRvT2JqZWN0KCk7XG4gICAgdmFyIG5ld0NhbmRpZGF0ZSA9IHRoaXMuYnVpbGRDYW5kaWRhdGVNb2RlbChjYW5kaWRhdGUpO1xuICAgIGxldCBqb2JNaW5FeHBlcmllbmNlOiBudW1iZXIgPSBOdW1iZXIoam9iLmV4cGVyaWVuY2VNaW5WYWx1ZSk7XG4gICAgbGV0IGpvYk1heEV4cGVyaWVuY2U6IG51bWJlciA9IE51bWJlcihqb2IuZXhwZXJpZW5jZU1heFZhbHVlKTtcbiAgICBsZXQgam9iTWluU2FsYXJ5OiBudW1iZXIgPSBOdW1iZXIoam9iLnNhbGFyeU1pblZhbHVlKTtcbiAgICBsZXQgam9iTWF4U2FsYXJ5OiBudW1iZXIgPSBOdW1iZXIoam9iLnNhbGFyeU1heFZhbHVlKTtcbiAgICBsZXQgY2FuZGlFeHBlcmllbmNlOiBzdHJpbmdbXSA9IG5ld0NhbmRpZGF0ZS5wcm9mZXNzaW9uYWxEZXRhaWxzLmV4cGVyaWVuY2Uuc3BsaXQoJyAnKTtcbiAgICBsZXQgY2FuU2FsYXJ5OiBzdHJpbmdbXSA9IG5ld0NhbmRpZGF0ZS5wcm9mZXNzaW9uYWxEZXRhaWxzLmN1cnJlbnRTYWxhcnkuc3BsaXQoJyAnKTtcbiAgICBpZiAoKGpvYk1heEV4cGVyaWVuY2UgPj0gTnVtYmVyKGNhbmRpRXhwZXJpZW5jZVswXSkpICYmIChqb2JNaW5FeHBlcmllbmNlIDw9IE51bWJlcihjYW5kaUV4cGVyaWVuY2VbMF0pKSkge1xuICAgICAgbmV3Q2FuZGlkYXRlLmV4cGVyaWVuY2VNYXRjaCA9ICdleGFjdCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5ld0NhbmRpZGF0ZS5leHBlcmllbmNlTWF0Y2ggPSAnbWlzc2luZyc7XG4gICAgfVxuICAgIGlmICgoam9iTWF4U2FsYXJ5ID49IE51bWJlcihjYW5TYWxhcnlbMF0pKSAmJiAoam9iTWluU2FsYXJ5IDw9IE51bWJlcihjYW5TYWxhcnlbMF0pKSkge1xuICAgICAgbmV3Q2FuZGlkYXRlLnNhbGFyeU1hdGNoID0gJ2V4YWN0JztcbiAgICB9IGVsc2Uge1xuICAgICAgbmV3Q2FuZGlkYXRlLnNhbGFyeU1hdGNoID0gJ21pc3NpbmcnO1xuICAgIH1cbiAgICBsZXQgY2FuRWR1Y2F0aW9uOiBudW1iZXIgPSB0aGlzLmdldEVkdWN0aW9uU3dpdGNoQ2FzZShuZXdDYW5kaWRhdGUucHJvZmVzc2lvbmFsRGV0YWlscy5lZHVjYXRpb24pO1xuICAgIGxldCBqb2JFZHVjYXRpb246IG51bWJlciA9IHRoaXMuZ2V0RWR1Y3Rpb25Td2l0Y2hDYXNlKGpvYi5lZHVjYXRpb24pO1xuICAgIG5ld0NhbmRpZGF0ZS5lZHVjYXRpb25NYXRjaCA9IHRoaXMuY29tcGFyZVR3b09wdGlvbnMoY2FuRWR1Y2F0aW9uLCBqb2JFZHVjYXRpb24pO1xuICAgIG5ld0NhbmRpZGF0ZS5yZWxlYXNlTWF0Y2ggPSB0aGlzLmNvbXBhcmVUd29PcHRpb25zKHRoaXMuZ2V0UGVyaW9kU3dpdGNoQ2FzZShuZXdDYW5kaWRhdGUucHJvZmVzc2lvbmFsRGV0YWlscy5ub3RpY2VQZXJpb2QpLCB0aGlzLmdldFBlcmlvZFN3aXRjaENhc2Uoam9iLmpvaW5pbmdQZXJpb2QpKTtcbiAgICBuZXdDYW5kaWRhdGUuaW50ZXJlc3RlZEluZHVzdHJ5TWF0Y2ggPSBuZXcgQXJyYXkoMCk7XG5cbiAgICBpZihqb2IuY29tcGxleGl0eV9tdXN0aGF2ZV9tYXRyaXggJiYgam9iLmNvbXBsZXhpdHlfbXVzdGhhdmVfbWF0cml4Lmxlbmd0aCA+IDApIHtcbiAgICBmb3IgKGxldCBpc0NvbXBsZXhpdHkgb2Ygam9iLmNvbXBsZXhpdHlfbXVzdGhhdmVfbWF0cml4KSB7XG4gICAgICBpZiAobmV3Q2FuZGlkYXRlLmNvbXBsZXhpdHlfbXVzdGhhdmVfbWF0cml4LmluZGV4T2YoaXNDb21wbGV4aXR5KSAhPT0gLTEpIHtcbiAgICAgICAgbmV3Q2FuZGlkYXRlLmNvbXBsZXhpdHlfbXVzdGhhdmVfbWF0cml4LnB1c2goaXNDb21wbGV4aXR5KTtcbiAgICAgIH1cbiAgICB9XG4gICAgfVxuICAgIGZvciAobGV0IGluZHVzdHJ5IG9mIGpvYi5pbnRlcmVzdGVkSW5kdXN0cmllcykge1xuICAgICAgaWYgKG5ld0NhbmRpZGF0ZS5pbnRlcmVzdGVkSW5kdXN0cmllcy5pbmRleE9mKGluZHVzdHJ5KSAhPT0gLTEpIHtcbiAgICAgICAgbmV3Q2FuZGlkYXRlLmludGVyZXN0ZWRJbmR1c3RyeU1hdGNoLnB1c2goaW5kdXN0cnkpO1xuICAgICAgfVxuICAgIH1cbiAgICBuZXdDYW5kaWRhdGUucHJvZmljaWVuY2llc01hdGNoID0gbmV3IEFycmF5KDApO1xuICAgIGZvciAobGV0IHByb2ZpY2llbmN5IG9mIGpvYi5wcm9maWNpZW5jaWVzKSB7XG4gICAgICBpZiAobmV3Q2FuZGlkYXRlLnByb2ZpY2llbmNpZXMuaW5kZXhPZihwcm9maWNpZW5jeSkgIT09IC0xKSB7XG4gICAgICAgIG5ld0NhbmRpZGF0ZS5wcm9maWNpZW5jaWVzTWF0Y2gucHVzaChwcm9maWNpZW5jeSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbmV3Q2FuZGlkYXRlLnByb2ZpY2llbmNpZXNVbk1hdGNoID0gbmV3IEFycmF5KDApO1xuICAgIGZvciAobGV0IHByb2ZpY2llbmN5IG9mIGpvYi5wcm9maWNpZW5jaWVzKSB7XG4gICAgICBpZiAobmV3Q2FuZGlkYXRlLnByb2ZpY2llbmNpZXNNYXRjaC5pbmRleE9mKHByb2ZpY2llbmN5KSA9PSAtMSkge1xuICAgICAgICBuZXdDYW5kaWRhdGUucHJvZmljaWVuY2llc1VuTWF0Y2gucHVzaChwcm9maWNpZW5jeSk7XG4gICAgICB9XG4gICAgfVxuLy8gICAgICAgIGxldCBtYXRjaF9tYXA6IE1hcDxzdHJpbmcsTWF0Y2hWaWV3TW9kZWw+ID0gbmV3IE1hcDxzdHJpbmcsTWF0Y2hWaWV3TW9kZWw+KCk7XG4gICAgLy9uZXdDYW5kaWRhdGUubWF0Y2hfbWFwID0ge307XG4gICAgbmV3Q2FuZGlkYXRlID0gdGhpcy5idWlsZE11bHRpQ29tcGFyZUNhcGFiaWxpdHlWaWV3KGpvYiwgbmV3Q2FuZGlkYXRlLCBpbmR1c3RyaWVzLCBpc0NhbmRpZGF0ZSk7XG4gICAgbmV3Q2FuZGlkYXRlID0gdGhpcy5idWlsZENvbXBhcmVWaWV3KGpvYiwgbmV3Q2FuZGlkYXRlLCBpbmR1c3RyaWVzLCBpc0NhbmRpZGF0ZSk7XG4gICAgbmV3Q2FuZGlkYXRlID0gdGhpcy5nZXRBZGRpdGlvbmFsQ2FwYWJpbGl0aWVzKGpvYiwgbmV3Q2FuZGlkYXRlLCBpbmR1c3RyaWVzKTtcblxuICAgIHJldHVybiBuZXdDYW5kaWRhdGU7XG4gIH1cblxuICBidWlsZENhbmRpZGF0ZU1vZGVsKGNhbmRpZGF0ZTogQ2FuZGlkYXRlTW9kZWwpIHtcbiAgICBsZXQgcHJvZmlsZUNvbXBhcmlzb25SZXN1bHQ6IFByb2ZpbGVDb21wYXJpc29uRGF0YU1vZGVsID0gbmV3IFByb2ZpbGVDb21wYXJpc29uRGF0YU1vZGVsKCk7XG4gICAgcHJvZmlsZUNvbXBhcmlzb25SZXN1bHQuX2lkID0gY2FuZGlkYXRlLl9pZDtcbiAgICBwcm9maWxlQ29tcGFyaXNvblJlc3VsdC5pbmR1c3RyeU5hbWUgPSBjYW5kaWRhdGUuaW5kdXN0cnkubmFtZTtcbiAgICBwcm9maWxlQ29tcGFyaXNvblJlc3VsdC5hYm91dE15c2VsZiA9IGNhbmRpZGF0ZS5hYm91dE15c2VsZjtcbiAgICBwcm9maWxlQ29tcGFyaXNvblJlc3VsdC5hY2FkZW1pY3MgPSBjYW5kaWRhdGUuYWNhZGVtaWNzO1xuICAgIHByb2ZpbGVDb21wYXJpc29uUmVzdWx0LnByb2Zlc3Npb25hbERldGFpbHMgPSBjYW5kaWRhdGUucHJvZmVzc2lvbmFsRGV0YWlscztcbiAgICBwcm9maWxlQ29tcGFyaXNvblJlc3VsdC5hd2FyZHMgPSBjYW5kaWRhdGUuYXdhcmRzO1xuICAgIHByb2ZpbGVDb21wYXJpc29uUmVzdWx0LmNhcGFiaWxpdHlfbWF0cml4ID0gY2FuZGlkYXRlLmNhcGFiaWxpdHlfbWF0cml4O1xuICAgIHByb2ZpbGVDb21wYXJpc29uUmVzdWx0LmV4cGVyaWVuY2VNYXRjaCA9ICcnO1xuICAgIHByb2ZpbGVDb21wYXJpc29uUmVzdWx0LmNlcnRpZmljYXRpb25zID0gY2FuZGlkYXRlLmNlcnRpZmljYXRpb25zO1xuICAgIHByb2ZpbGVDb21wYXJpc29uUmVzdWx0LmVtcGxveW1lbnRIaXN0b3J5ID0gY2FuZGlkYXRlLmVtcGxveW1lbnRIaXN0b3J5O1xuICAgIHByb2ZpbGVDb21wYXJpc29uUmVzdWx0LmludGVyZXN0ZWRJbmR1c3RyaWVzID0gY2FuZGlkYXRlLmludGVyZXN0ZWRJbmR1c3RyaWVzO1xuICAgIHByb2ZpbGVDb21wYXJpc29uUmVzdWx0LmlzU3VibWl0dGVkID0gY2FuZGlkYXRlLmlzU3VibWl0dGVkO1xuICAgIHByb2ZpbGVDb21wYXJpc29uUmVzdWx0LmlzVmlzaWJsZSA9IGNhbmRpZGF0ZS5pc1Zpc2libGU7XG4gICAgcHJvZmlsZUNvbXBhcmlzb25SZXN1bHQubG9jYXRpb24gPSBjYW5kaWRhdGUubG9jYXRpb247XG4gICAgcHJvZmlsZUNvbXBhcmlzb25SZXN1bHQuam9iX2xpc3QgPSBjYW5kaWRhdGUuam9iX2xpc3Q7XG4gICAgcHJvZmlsZUNvbXBhcmlzb25SZXN1bHQuZWR1Y2F0aW9uTWF0Y2ggPSAnJztcbiAgICBwcm9maWxlQ29tcGFyaXNvblJlc3VsdC5wcm9maWNpZW5jaWVzID0gY2FuZGlkYXRlLnByb2ZpY2llbmNpZXM7XG4gICAgcHJvZmlsZUNvbXBhcmlzb25SZXN1bHQucHJvZmlsZUNvbXBhcmlzb25IZWFkZXIgPSBjYW5kaWRhdGUudXNlcklkO1xuICAgIHByb2ZpbGVDb21wYXJpc29uUmVzdWx0LnJvbGVUeXBlID0gY2FuZGlkYXRlLnJvbGVUeXBlO1xuICAgIHByb2ZpbGVDb21wYXJpc29uUmVzdWx0LnNhbGFyeU1hdGNoID0gJyc7XG4gICAgcHJvZmlsZUNvbXBhcmlzb25SZXN1bHQuc2Vjb25kYXJ5Q2FwYWJpbGl0eSA9IGNhbmRpZGF0ZS5zZWNvbmRhcnlDYXBhYmlsaXR5O1xuICAgIHByb2ZpbGVDb21wYXJpc29uUmVzdWx0LmxvY2tlZE9uID0gY2FuZGlkYXRlLmxvY2tlZE9uO1xuICAgIHByb2ZpbGVDb21wYXJpc29uUmVzdWx0Lm1hdGNoX21hcCA9IHt9O1xuICAgIHByb2ZpbGVDb21wYXJpc29uUmVzdWx0LmNhcGFiaWxpdHlNYXAgPSB7fTtcbiAgICBwcm9maWxlQ29tcGFyaXNvblJlc3VsdC5jb21wbGV4aXR5X25vdGVfbWF0cml4ID0gY2FuZGlkYXRlLmNvbXBsZXhpdHlfbm90ZV9tYXRyaXg7XG4gICAgcmV0dXJuIHByb2ZpbGVDb21wYXJpc29uUmVzdWx0O1xuICB9XG5cbiAgYnVpbGRNdWx0aUNvbXBhcmVDYXBhYmlsaXR5Vmlldyhqb2I6YW55LCBuZXdDYW5kaWRhdGU6UHJvZmlsZUNvbXBhcmlzb25EYXRhTW9kZWwsIGluZHVzdHJpZXM6YW55LCBpc0NhbmRpZGF0ZTphbnkpIHtcbiAgICB2YXIgY2FwYWJpbGl0eVBlcmNlbnRhZ2U6bnVtYmVyW10gPSBuZXcgQXJyYXkoMCk7XG4gICAgdmFyIGNhcGFiaWxpdHlLZXlzOnN0cmluZ1tdID0gbmV3IEFycmF5KDApO1xuICAgIHZhciBjb3JyZWN0UWVzdGlvbkNvdW50Rm9yQXZnUGVyY2VudGFnZTpudW1iZXIgPSAwO1xuICAgIHZhciBxZXN0aW9uQ291bnRGb3JBdmdQZXJjZW50c2dlOm51bWJlciA9IDA7XG4gICAgZm9yIChsZXQgY2FwIGluIGpvYi5jYXBhYmlsaXR5X21hdHJpeCkge1xuXG4gICAgICB2YXIgY2FwYWJpbGl0eUtleSA9IGNhcC5zcGxpdCgnXycpO1xuICAgICAgaWYgKGNhcGFiaWxpdHlLZXlzLmluZGV4T2YoY2FwYWJpbGl0eUtleVswXSkgPT0gLTEpIHtcbiAgICAgICAgY2FwYWJpbGl0eUtleXMucHVzaChjYXBhYmlsaXR5S2V5WzBdKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy9mb3IobGV0IF9jYXAgaW4gY2FwYmlsaXR5S2V5cykge1xuICAgIGZvciAobGV0IF9jYXAgb2YgY2FwYWJpbGl0eUtleXMpIHtcbiAgICAgIGxldCBpc0NhcGFiaWxpdHlGb3VuZCA6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgIHZhciBjYXBhYmlsaXR5UXVlc3Rpb25Db3VudDpudW1iZXIgPSAwO1xuICAgICAgdmFyIG1hdGNoQ291bnQ6bnVtYmVyID0gMDtcbiAgICAgIGZvciAobGV0IGNhcCBpbiBqb2IuY2FwYWJpbGl0eV9tYXRyaXgpIHtcbiAgICAgICAgLy9jYWxjdWxhdGUgdG90YWwgbnVtYmVyIG9mIHF1ZXN0aW9ucyBpbiBjYXBhYmlsaXR5XG5cbiAgICAgICAgaWYgKF9jYXAgPT0gY2FwLnNwbGl0KCdfJylbMF0pIHtcbiAgICAgICAgICBpZiAoam9iLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0gPT0gLTEgfHwgam9iLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0gPT0gMCB8fCBqb2IuY2FwYWJpbGl0eV9tYXRyaXhbY2FwXSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIC8vbWF0Y2hfdmlldy5tYXRjaCA9IE1hdGNoLk1pc3NNYXRjaDtcbiAgICAgICAgICB9IGVsc2UgaWYgKGpvYi5jYXBhYmlsaXR5X21hdHJpeFtjYXBdID09IG5ld0NhbmRpZGF0ZS5jYXBhYmlsaXR5X21hdHJpeFtjYXBdKSB7XG4gICAgICAgICAgICBtYXRjaENvdW50Kys7XG4gICAgICAgICAgICBjYXBhYmlsaXR5UXVlc3Rpb25Db3VudCsrO1xuICAgICAgICAgICAgY29ycmVjdFFlc3Rpb25Db3VudEZvckF2Z1BlcmNlbnRhZ2UrKztcbiAgICAgICAgICAgIHFlc3Rpb25Db3VudEZvckF2Z1BlcmNlbnRzZ2UrKztcbiAgICAgICAgICAgIC8vbWF0Y2hfdmlldy5tYXRjaCA9IE1hdGNoLkV4YWN0O1xuICAgICAgICAgIH0gZWxzZSBpZiAoam9iLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0gPT0gKE51bWJlcihuZXdDYW5kaWRhdGUuY2FwYWJpbGl0eV9tYXRyaXhbY2FwXSkgLSBDb25zdFZhcmlhYmxlcy5ESUZGRVJFTkNFX0lOX0NPTVBMRVhJVFlfU0NFTkFSSU8pKSB7XG4gICAgICAgICAgICBtYXRjaENvdW50Kys7XG4gICAgICAgICAgICBjYXBhYmlsaXR5UXVlc3Rpb25Db3VudCsrO1xuICAgICAgICAgICAgY29ycmVjdFFlc3Rpb25Db3VudEZvckF2Z1BlcmNlbnRhZ2UrKztcbiAgICAgICAgICAgIHFlc3Rpb25Db3VudEZvckF2Z1BlcmNlbnRzZ2UrKztcbiAgICAgICAgICAgIC8vbWF0Y2hfdmlldy5tYXRjaCA9IE1hdGNoLkFib3ZlO1xuICAgICAgICAgIH0gZWxzZSBpZiAoam9iLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0gPT0gKE51bWJlcihuZXdDYW5kaWRhdGUuY2FwYWJpbGl0eV9tYXRyaXhbY2FwXSkgKyBDb25zdFZhcmlhYmxlcy5ESUZGRVJFTkNFX0lOX0NPTVBMRVhJVFlfU0NFTkFSSU8pKSB7XG4gICAgICAgICAgICAvL21hdGNoX3ZpZXcubWF0Y2ggPSBNYXRjaC5CZWxvdztcbiAgICAgICAgICAgIGNhcGFiaWxpdHlRdWVzdGlvbkNvdW50Kys7XG4gICAgICAgICAgICBxZXN0aW9uQ291bnRGb3JBdmdQZXJjZW50c2dlKys7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhcGFiaWxpdHlRdWVzdGlvbkNvdW50Kys7XG4gICAgICAgICAgICBxZXN0aW9uQ291bnRGb3JBdmdQZXJjZW50c2dlKys7XG4gICAgICAgICAgICAvL21hdGNoX3ZpZXcubWF0Y2ggPSBNYXRjaC5NaXNzTWF0Y2g7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICB2YXIgY2FwYWJpbGl0eU1vZGVsID0gbmV3IENhcGFiaWxpdHlNYXRyaXhNb2RlbCgpO1xuICAgICAgdmFyIGNhcE5hbWU6c3RyaW5nO1xuICAgICAgdmFyIGNvbXBsZXhpdHk6YW55O1xuICAgICAgZm9yIChsZXQgcm9sZSBvZiBpbmR1c3RyaWVzWzBdLnJvbGVzKSB7XG4gICAgICAgIGZvciAobGV0IGNhcGFiaWxpdHkgb2Ygcm9sZS5jYXBhYmlsaXRpZXMpIHtcbiAgICAgICAgICBpZiAoX2NhcCA9PSBjYXBhYmlsaXR5LmNvZGUpIHtcbiAgICAgICAgICAgIGlzQ2FwYWJpbGl0eUZvdW5kPXRydWU7XG4gICAgICAgICAgICBjYXBOYW1lID0gY2FwYWJpbGl0eS5uYW1lO1xuICAgICAgICAgICAgY29tcGxleGl0eSA9IGNhcGFiaWxpdHkuY29tcGxleGl0aWVzO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGNhcGFiaWxpdHkgb2Ygcm9sZS5kZWZhdWx0X2NvbXBsZXhpdGllcykge1xuICAgICAgICAgIGlmIChfY2FwID09IGNhcGFiaWxpdHkuY29kZSkge1xuICAgICAgICAgICAgaXNDYXBhYmlsaXR5Rm91bmQ9dHJ1ZTtcbiAgICAgICAgICAgIGNhcE5hbWUgPSBjYXBhYmlsaXR5Lm5hbWU7XG4gICAgICAgICAgICBjb21wbGV4aXR5ID0gY2FwYWJpbGl0eS5jb21wbGV4aXRpZXM7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHZhciBwZXJjZW50YWdlOm51bWJlciA9IDA7XG4gICAgICBpZiAoY2FwYWJpbGl0eVF1ZXN0aW9uQ291bnQpIHtcbiAgICAgICAgcGVyY2VudGFnZSA9IChtYXRjaENvdW50IC8gY2FwYWJpbGl0eVF1ZXN0aW9uQ291bnQpICogMTAwO1xuICAgICAgfVxuXG4gICAgICBjYXBhYmlsaXR5TW9kZWwuY2FwYWJpbGl0eU5hbWUgPSBjYXBOYW1lO1xuICAgICAgY2FwYWJpbGl0eU1vZGVsLmNhcGFiaWxpdHlQZXJjZW50YWdlID0gcGVyY2VudGFnZTtcbiAgICAgIGNhcGFiaWxpdHlNb2RlbC5jb21wbGV4aXRpZXMgPSBjb21wbGV4aXR5O1xuICAgICAgY2FwYWJpbGl0eVBlcmNlbnRhZ2UucHVzaChwZXJjZW50YWdlKTtcbiAgICAgIGlmKGlzQ2FwYWJpbGl0eUZvdW5kKXtcbiAgICAgICAgbmV3Q2FuZGlkYXRlWydjYXBhYmlsaXR5TWFwJ11bX2NhcF0gPSBjYXBhYmlsaXR5TW9kZWw7XG4gICAgICB9XG4gICAgICAvL31cbiAgICB9XG4gICAgdmFyIGF2Z1BlcmNlbnRhZ2U6bnVtYmVyID0gMDtcbiAgICBpZiAocWVzdGlvbkNvdW50Rm9yQXZnUGVyY2VudHNnZSkge1xuICAgICAgYXZnUGVyY2VudGFnZSA9ICgoY29ycmVjdFFlc3Rpb25Db3VudEZvckF2Z1BlcmNlbnRhZ2UgLyBxZXN0aW9uQ291bnRGb3JBdmdQZXJjZW50c2dlKSAqIDEwMCk7XG4gICAgfVxuICAgIG5ld0NhbmRpZGF0ZS5tYXRjaGluZ1BlcmNlbnRhZ2UgPSBhdmdQZXJjZW50YWdlO1xuICAgIHJldHVybiBuZXdDYW5kaWRhdGU7XG4gIH1cblxuICBnZXRBZGRpdGlvbmFsQ2FwYWJpbGl0aWVzKGpvYiA6IGFueSwgbmV3Q2FuZGlkYXRlIDogYW55ICwgaW5kdXN0cmllcyA6IGFueSkgOiBhbnkge1xuICAgIG5ld0NhbmRpZGF0ZS5hZGRpdGlvbmFsQ2FwYWJpbGl0ZXMgPSBuZXcgQXJyYXkoMCk7XG4gICAgZm9yIChsZXQgY2FwIGluIG5ld0NhbmRpZGF0ZS5jYXBhYmlsaXR5X21hdHJpeCkge1xuICAgICAgICBsZXQgaXNGb3VuZDogYm9vbGVhbj0gZmFsc2U7XG4gICAgICAgIGZvcihsZXQgam9iQ2FwIGluIGpvYi5jYXBhYmlsaXR5X21hdHJpeCkge1xuICAgICAgICAgICAgaWYoY2FwLnN1YnN0cigwLGNhcC5pbmRleE9mKCdfJykpID09PSBqb2JDYXAuc3Vic3RyKDAsam9iQ2FwLmluZGV4T2YoJ18nKSkpIHtcbiAgICAgICAgICAgICAgaXNGb3VuZD10cnVlO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZighaXNGb3VuZCkge1xuICAgICAgICAgIGZvciAobGV0IHJvbGUgb2YgaW5kdXN0cmllc1swXS5yb2xlcykge1xuICAgICAgICAgICAgZm9yIChsZXQgY2FwYWJpbGl0eSBvZiByb2xlLmNhcGFiaWxpdGllcykge1xuICAgICAgICAgICAgICBmb3IgKGxldCBjb21wbGV4aXR5IG9mIGNhcGFiaWxpdHkuY29tcGxleGl0aWVzKSB7XG4gICAgICAgICAgICAgICAgbGV0IGN1c3RvbV9jb2RlID0gY2FwYWJpbGl0eS5jb2RlICsgJ18nICsgY29tcGxleGl0eS5jb2RlO1xuICAgICAgICAgICAgICAgIGlmIChjdXN0b21fY29kZSA9PT0gY2FwKSB7XG4gICAgICAgICAgICAgICAgICBpZihuZXdDYW5kaWRhdGUuYWRkaXRpb25hbENhcGFiaWxpdGVzLmluZGV4T2YoY2FwYWJpbGl0eS5uYW1lKSA9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBuZXdDYW5kaWRhdGUuYWRkaXRpb25hbENhcGFiaWxpdGVzLnB1c2goY2FwYWJpbGl0eS5uYW1lKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAgIHJldHVybiBuZXdDYW5kaWRhdGU7XG4gIH1cblxuICBidWlsZENvbXBhcmVWaWV3KGpvYiA6IGFueSwgbmV3Q2FuZGlkYXRlIDogYW55ICwgaW5kdXN0cmllcyA6IGFueSwgaXNDYW5kaWRhdGUgOiBib29sZWFuKSA6IGFueSB7XG5cbiAgICBmb3IgKGxldCBjYXAgaW4gam9iLmNhcGFiaWxpdHlfbWF0cml4KSB7XG4gICAgICBsZXQgbWF0Y2hfdmlldzogTWF0Y2hWaWV3TW9kZWwgPSBuZXcgTWF0Y2hWaWV3TW9kZWwoKTtcbiAgICAgIGlmIChqb2IuY2FwYWJpbGl0eV9tYXRyaXhbY2FwXSA9PSAtMSB8fCBqb2IuY2FwYWJpbGl0eV9tYXRyaXhbY2FwXSA9PSAwIHx8IGpvYi5jYXBhYmlsaXR5X21hdHJpeFtjYXBdID09IHVuZGVmaW5lZCB8fCBuZXdDYW5kaWRhdGUuY2FwYWJpbGl0eV9tYXRyaXhbY2FwXSA9PSB1bmRlZmluZWQgfHxcbiAgICAgICAgbmV3Q2FuZGlkYXRlLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0gPT0gMCB8fCBuZXdDYW5kaWRhdGUuY2FwYWJpbGl0eV9tYXRyaXhbY2FwXSA9PSAtMSkge1xuICAgICAgICBtYXRjaF92aWV3Lm1hdGNoID0gTWF0Y2guTWlzc01hdGNoO1xuICAgICAgfSBlbHNlIGlmIChqb2IuY2FwYWJpbGl0eV9tYXRyaXhbY2FwXSA9PSBuZXdDYW5kaWRhdGUuY2FwYWJpbGl0eV9tYXRyaXhbY2FwXSkge1xuICAgICAgICBtYXRjaF92aWV3Lm1hdGNoID0gTWF0Y2guRXhhY3Q7XG4gICAgICB9IGVsc2UgaWYgKGpvYi5jYXBhYmlsaXR5X21hdHJpeFtjYXBdID09IChOdW1iZXIobmV3Q2FuZGlkYXRlLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0pIC0gQ29uc3RWYXJpYWJsZXMuRElGRkVSRU5DRV9JTl9DT01QTEVYSVRZX1NDRU5BUklPKSkge1xuICAgICAgICBtYXRjaF92aWV3Lm1hdGNoID0gTWF0Y2guQWJvdmU7XG4gICAgICB9IGVsc2UgaWYgKGpvYi5jYXBhYmlsaXR5X21hdHJpeFtjYXBdID09IChOdW1iZXIobmV3Q2FuZGlkYXRlLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0pICsgQ29uc3RWYXJpYWJsZXMuRElGRkVSRU5DRV9JTl9DT01QTEVYSVRZX1NDRU5BUklPKSkge1xuICAgICAgICBtYXRjaF92aWV3Lm1hdGNoID0gTWF0Y2guQmVsb3c7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtYXRjaF92aWV3Lm1hdGNoID0gTWF0Y2guTWlzc01hdGNoO1xuICAgICAgfVxuICAgICAgbGV0IGlzRm91bmQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgIGZvciAobGV0IHJvbGUgb2YgaW5kdXN0cmllc1swXS5yb2xlcykge1xuICAgICAgICBmb3IgKGxldCBjYXBhYmlsaXR5IG9mIHJvbGUuY2FwYWJpbGl0aWVzKSB7XG4gICAgICAgICAgZm9yIChsZXQgY29tcGxleGl0eSBvZiBjYXBhYmlsaXR5LmNvbXBsZXhpdGllcykge1xuICAgICAgICAgICAgbGV0IGN1c3RvbV9jb2RlID0gY2FwYWJpbGl0eS5jb2RlICsgJ18nICsgY29tcGxleGl0eS5jb2RlO1xuICAgICAgICAgICAgaWYgKGN1c3RvbV9jb2RlID09PSBjYXApIHtcbiAgICAgICAgICAgICAgaXNGb3VuZCA9IHRydWU7XG4gICAgICAgICAgICAgIGxldCBzY2VuYXJpb3MgPSBjb21wbGV4aXR5LnNjZW5hcmlvcy5maWx0ZXIoKHNjZTogU2NlbmFyaW9Nb2RlbCkgPT4ge1xuICAgICAgICAgICAgICAgIHNjZS5jb2RlID1zY2UuY29kZS5yZXBsYWNlKCcuJywnXycpO1xuICAgICAgICAgICAgICAgIHNjZS5jb2RlID1zY2UuY29kZS5yZXBsYWNlKCcuJywnXycpO1xuICAgICAgICAgICAgICAgIHNjZS5jb2RlID0gc2NlLmNvZGUuc3Vic3RyKHNjZS5jb2RlLmxhc3RJbmRleE9mKCdfJykrMSk7XG4gICAgICAgICAgICAgICAgaWYoc2NlLmNvZGUgPT0gbmV3Q2FuZGlkYXRlLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0pICB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgbGV0IGpvYl9zY2VuYXJpb3MgPSBjb21wbGV4aXR5LnNjZW5hcmlvcy5maWx0ZXIoKHNjZTogU2NlbmFyaW9Nb2RlbCkgPT4ge1xuICAgICAgICAgICAgICAgIHNjZS5jb2RlID1zY2UuY29kZS5yZXBsYWNlKCcuJywnXycpO1xuICAgICAgICAgICAgICAgIHNjZS5jb2RlID1zY2UuY29kZS5yZXBsYWNlKCcuJywnXycpO1xuICAgICAgICAgICAgICAgIHNjZS5jb2RlID0gc2NlLmNvZGUuc3Vic3RyKHNjZS5jb2RlLmxhc3RJbmRleE9mKCdfJykrMSk7XG4gICAgICAgICAgICAgICAgaWYoc2NlLmNvZGUgPT0gam9iLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0pICB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgbWF0Y2hfdmlldy5jYXBhYmlsaXR5X25hbWUgPSBjYXBhYmlsaXR5Lm5hbWU7XG4gICAgICAgICAgICAgIG1hdGNoX3ZpZXcuY29tcGxleGl0eV9uYW1lID0gY29tcGxleGl0eS5uYW1lO1xuICAgICAgICAgICAgICBpZihuZXdDYW5kaWRhdGUuY29tcGxleGl0eV9ub3RlX21hdHJpeCAmJiBuZXdDYW5kaWRhdGUuY29tcGxleGl0eV9ub3RlX21hdHJpeFtjYXBdKSB7XG4gICAgICAgICAgICAgICAgbWF0Y2hfdmlldy5jb21wbGV4aXR5Tm90ZSA9IG5ld0NhbmRpZGF0ZS5jb21wbGV4aXR5X25vdGVfbWF0cml4W2NhcF07XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYoam9iLmNvbXBsZXhpdHlfbXVzdGhhdmVfbWF0cml4ICYmIGpvYi5jb21wbGV4aXR5X211c3RoYXZlX21hdHJpeFtjYXBdKSB7XG4gICAgICAgICAgICAgICAgbWF0Y2hfdmlldy5jb21wbGV4aXR5SXNNdXN0SGF2ZSA9IGpvYi5jb21wbGV4aXR5X211c3RoYXZlX21hdHJpeFtjYXBdO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmKGpvYl9zY2VuYXJpb3NbMF0pIHtcbiAgICAgICAgICAgICAgICBtYXRjaF92aWV3LmpvYl9zY2VuYXJpb19uYW1lPSBqb2Jfc2NlbmFyaW9zWzBdLm5hbWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYoc2NlbmFyaW9zWzBdKSB7XG4gICAgICAgICAgICAgICAgbWF0Y2hfdmlldy5jYW5kaWRhdGVfc2NlbmFyaW9fbmFtZT1zY2VuYXJpb3NbMF0ubmFtZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG1hdGNoX3ZpZXcuc2NlbmFyaW9fbmFtZSA9IG1hdGNoX3ZpZXcuam9iX3NjZW5hcmlvX25hbWU7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZihpc0ZvdW5kKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgY2FwYWJpbGl0eSBvZiByb2xlLmRlZmF1bHRfY29tcGxleGl0aWVzKSB7XG4gICAgICAgICAgZm9yIChsZXQgY29tcGxleGl0eSBvZiBjYXBhYmlsaXR5LmNvbXBsZXhpdGllcykge1xuICAgICAgICAgICAgbGV0IGN1c3RvbV9jb2RlID0gY2FwYWJpbGl0eS5jb2RlICsgJ18nICsgY29tcGxleGl0eS5jb2RlO1xuICAgICAgICAgICAgaWYgKGN1c3RvbV9jb2RlID09PSBjYXApIHtcbiAgICAgICAgICAgICAgaXNGb3VuZCA9IHRydWU7XG4gICAgICAgICAgICAgIGxldCBzY2VuYXJpb3MgPSBjb21wbGV4aXR5LnNjZW5hcmlvcy5maWx0ZXIoKHNjZTogU2NlbmFyaW9Nb2RlbCkgPT4ge1xuICAgICAgICAgICAgICAgIHNjZS5jb2RlID1zY2UuY29kZS5yZXBsYWNlKCcuJywnXycpO1xuICAgICAgICAgICAgICAgIHNjZS5jb2RlID1zY2UuY29kZS5yZXBsYWNlKCcuJywnXycpO1xuICAgICAgICAgICAgICAgIHNjZS5jb2RlID0gc2NlLmNvZGUuc3Vic3RyKHNjZS5jb2RlLmxhc3RJbmRleE9mKCdfJykrMSk7XG4gICAgICAgICAgICAgICAgaWYoc2NlLmNvZGUgPT0gbmV3Q2FuZGlkYXRlLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0pICB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgbGV0IGpvYl9zY2VuYXJpb3MgPSBjb21wbGV4aXR5LnNjZW5hcmlvcy5maWx0ZXIoKHNjZTogU2NlbmFyaW9Nb2RlbCkgPT4ge1xuICAgICAgICAgICAgICAgIHNjZS5jb2RlID1zY2UuY29kZS5yZXBsYWNlKCcuJywnXycpO1xuICAgICAgICAgICAgICAgIHNjZS5jb2RlID1zY2UuY29kZS5yZXBsYWNlKCcuJywnXycpO1xuICAgICAgICAgICAgICAgIHNjZS5jb2RlID0gc2NlLmNvZGUuc3Vic3RyKHNjZS5jb2RlLmxhc3RJbmRleE9mKCdfJykrMSk7XG4gICAgICAgICAgICAgICAgaWYoc2NlLmNvZGUgPT0gam9iLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0pICB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgbWF0Y2hfdmlldy5jYXBhYmlsaXR5X25hbWUgPSBjYXBhYmlsaXR5Lm5hbWU7XG4gICAgICAgICAgICAgIG1hdGNoX3ZpZXcuY29tcGxleGl0eV9uYW1lID0gY29tcGxleGl0eS5uYW1lO1xuICAgICAgICAgICAgICBpZihuZXdDYW5kaWRhdGUuY29tcGxleGl0eV9ub3RlX21hdHJpeCAmJiBuZXdDYW5kaWRhdGUuY29tcGxleGl0eV9ub3RlX21hdHJpeFtjYXBdKSB7XG4gICAgICAgICAgICAgICAgbWF0Y2hfdmlldy5jb21wbGV4aXR5Tm90ZSA9IG5ld0NhbmRpZGF0ZS5jb21wbGV4aXR5X25vdGVfbWF0cml4W2NhcF07XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYoam9iLmNvbXBsZXhpdHlfbXVzdGhhdmVfbWF0cml4ICYmIGpvYi5jb21wbGV4aXR5X211c3RoYXZlX21hdHJpeFtjYXBdKSB7XG4gICAgICAgICAgICAgICAgbWF0Y2hfdmlldy5jb21wbGV4aXR5SXNNdXN0SGF2ZSA9IGpvYi5jb21wbGV4aXR5X211c3RoYXZlX21hdHJpeFtjYXBdO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmKGpvYl9zY2VuYXJpb3NbMF0pe1xuICAgICAgICAgICAgICAgIG1hdGNoX3ZpZXcuam9iX3NjZW5hcmlvX25hbWU9am9iX3NjZW5hcmlvc1swXS5uYW1lO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmKHNjZW5hcmlvc1swXSkge1xuICAgICAgICAgICAgICAgIG1hdGNoX3ZpZXcuY2FuZGlkYXRlX3NjZW5hcmlvX25hbWU9c2NlbmFyaW9zWzBdLm5hbWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBtYXRjaF92aWV3LnNjZW5hcmlvX25hbWUgPSBtYXRjaF92aWV3LmpvYl9zY2VuYXJpb19uYW1lO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYoaXNGb3VuZCkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChpc0ZvdW5kKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtYXRjaF92aWV3LmNhcGFiaWxpdHlfbmFtZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgbmV3Q2FuZGlkYXRlWydtYXRjaF9tYXAnXVtjYXBdID0gbWF0Y2hfdmlldztcbiAgICAgIH1cblxuICAgIH1cbiAgICByZXR1cm4gbmV3Q2FuZGlkYXRlO1xuICB9XG5cbiAgZ2V0TXVsdGlDb21wYXJlUmVzdWx0KGNhbmRpZGF0ZTogYW55LCBqb2JJZDogc3RyaW5nLCByZWNydWl0ZXJJZDphbnksIGlzQ2FuZGlkYXRlOiBib29sZWFuLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XG5cbiAgICB0aGlzLmNhbmRpZGF0ZVJlcG9zaXRvcnkucmV0cmlldmVCeU11bHRpSWRzQW5kUG9wdWxhdGUoY2FuZGlkYXRlLCB7fSwgKGVycjogYW55LCBjYW5kaWRhdGVSZXM6IGFueSkgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGNhbmRpZGF0ZVJlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgbGV0IGRhdGEgPSB7XG4gICAgICAgICAgICAncG9zdGVkSm9iJzogam9iSWRcbiAgICAgICAgICB9O1xuICAgICAgICAgIGxldCBqb2JQcm9maWxlU2VydmljZTogSm9iUHJvZmlsZVNlcnZpY2UgPSBuZXcgSm9iUHJvZmlsZVNlcnZpY2UoKTtcbiAgICAgICAgICBqb2JQcm9maWxlU2VydmljZS5yZXRyaWV2ZShkYXRhLCAoZXJySW5Kb2IsIHJlc09mUmVjcnVpdGVyKSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJySW5Kb2IpIHtcbiAgICAgICAgICAgICAgY2FsbGJhY2soZXJySW5Kb2IsIG51bGwpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdmFyIGpvYk5hbWUgPSByZXNPZlJlY3J1aXRlci5wb3N0ZWRKb2JzWzBdLmluZHVzdHJ5Lm5hbWU7XG4gICAgICAgICAgICAgIHZhciBqb2IgPSByZXNPZlJlY3J1aXRlci5wb3N0ZWRKb2JzWzBdO1xuICAgICAgICAgICAgICB0aGlzLmluZHVzdHJ5UmVwb3NpdG9yeS5yZXRyaWV2ZSh7J25hbWUnOiBqb2JOYW1lfSwgKGVycjogYW55LCBpbmR1c3RyaWVzOiBJbmR1c3RyeU1vZGVsW10pID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICB2YXIgY29tcGFyZVJlc3VsdDogUHJvZmlsZUNvbXBhcmlzb25EYXRhTW9kZWxbXSA9IG5ldyBBcnJheSgwKTtcbiAgICAgICAgICAgICAgICAgIGZvciAobGV0IGNhbmRpZGF0ZSBvZiBjYW5kaWRhdGVSZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0NhbmRpZGF0ZSA9IHRoaXMuZ2V0Q29tcGFyZURhdGEoY2FuZGlkYXRlLCBqb2IsIGlzQ2FuZGlkYXRlLCBpbmR1c3RyaWVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0NhbmRpZGF0ZSA9IHRoaXMuZ2V0TGlzdFN0YXR1c09mQ2FuZGlkYXRlKG5ld0NhbmRpZGF0ZSxqb2IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3Q2FuZGlkYXRlID0gdGhpcy5zb3J0Q2FuZGlkYXRlU2tpbGxzKG5ld0NhbmRpZGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBhcmVSZXN1bHQucHVzaChuZXdDYW5kaWRhdGUpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgbGV0IHByb2ZpbGVDb21wYXJpc29uTW9kZWw6UHJvZmlsZUNvbXBhcmlzb25Nb2RlbCA9IG5ldyBQcm9maWxlQ29tcGFyaXNvbk1vZGVsKCk7XG4gICAgICAgICAgICAgICAgICBwcm9maWxlQ29tcGFyaXNvbk1vZGVsLnByb2ZpbGVDb21wYXJpc29uRGF0YSA9IGNvbXBhcmVSZXN1bHQ7XG4gICAgICAgICAgICAgICAgICB2YXIgam9iRGV0YWlsczpQcm9maWxlQ29tcGFyaXNvbkpvYk1vZGVsID0gdGhpcy5nZXRKb2JEZXRhaWxzRm9yQ29tcGFyaXNvbihqb2IpO1xuICAgICAgICAgICAgICAgICAgcHJvZmlsZUNvbXBhcmlzb25Nb2RlbC5wcm9maWxlQ29tcGFyaXNvbkpvYkRhdGEgPSBqb2JEZXRhaWxzO1xuICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgcHJvZmlsZUNvbXBhcmlzb25Nb2RlbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjYWxsYmFjayhudWxsLCAnTm8gQ2FuZGlkYXRlIFByb2ZpbGUgUmVzdWx0IEZvdW5kJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdldEpvYkRldGFpbHNGb3JDb21wYXJpc29uKGpvYjpKb2JQcm9maWxlTW9kZWwpIHtcbiAgICB2YXIgcHJvZmlsZUNvbXBhcmlzb25Kb2JNb2RlbDpQcm9maWxlQ29tcGFyaXNvbkpvYk1vZGVsID0gbmV3IFByb2ZpbGVDb21wYXJpc29uSm9iTW9kZWwoKTtcbiAgICBwcm9maWxlQ29tcGFyaXNvbkpvYk1vZGVsLmNpdHkgPSBqb2IubG9jYXRpb24uY2l0eTtcbiAgICBwcm9maWxlQ29tcGFyaXNvbkpvYk1vZGVsLmNvdW50cnkgPSBqb2IubG9jYXRpb24uY291bnRyeTtcbiAgICBwcm9maWxlQ29tcGFyaXNvbkpvYk1vZGVsLnN0YXRlID0gam9iLmxvY2F0aW9uLnN0YXRlO1xuICAgIHByb2ZpbGVDb21wYXJpc29uSm9iTW9kZWwuZWR1Y2F0aW9uID0gam9iLmVkdWNhdGlvbjtcbiAgICBwcm9maWxlQ29tcGFyaXNvbkpvYk1vZGVsLmV4cGVyaWVuY2VNYXhWYWx1ZSA9IGpvYi5leHBlcmllbmNlTWF4VmFsdWU7XG4gICAgcHJvZmlsZUNvbXBhcmlzb25Kb2JNb2RlbC5leHBlcmllbmNlTWluVmFsdWUgPSBqb2IuZXhwZXJpZW5jZU1pblZhbHVlO1xuICAgIHByb2ZpbGVDb21wYXJpc29uSm9iTW9kZWwuaW5kdXN0cnlOYW1lID0gam9iLmluZHVzdHJ5Lm5hbWU7XG4gICAgcHJvZmlsZUNvbXBhcmlzb25Kb2JNb2RlbC5qb2JUaXRsZSA9IGpvYi5qb2JUaXRsZTtcbiAgICBwcm9maWxlQ29tcGFyaXNvbkpvYk1vZGVsLmpvaW5pbmdQZXJpb2QgPSBqb2Iuam9pbmluZ1BlcmlvZDtcbiAgICBwcm9maWxlQ29tcGFyaXNvbkpvYk1vZGVsLnNhbGFyeU1heFZhbHVlID0gam9iLnNhbGFyeU1heFZhbHVlO1xuICAgIHByb2ZpbGVDb21wYXJpc29uSm9iTW9kZWwuc2FsYXJ5TWluVmFsdWUgPSBqb2Iuc2FsYXJ5TWluVmFsdWU7XG4gICAgcHJvZmlsZUNvbXBhcmlzb25Kb2JNb2RlbC5wcm9maWNpZW5jaWVzID0gam9iLnByb2ZpY2llbmNpZXM7XG4gICAgcHJvZmlsZUNvbXBhcmlzb25Kb2JNb2RlbC5pbnRlcmVzdGVkSW5kdXN0cmllcyA9IGpvYi5pbnRlcmVzdGVkSW5kdXN0cmllcztcbiAgICByZXR1cm4gcHJvZmlsZUNvbXBhcmlzb25Kb2JNb2RlbDtcbiAgfVxuICBnZXRMaXN0U3RhdHVzT2ZDYW5kaWRhdGUobmV3Q2FuZGlkYXRlOlByb2ZpbGVDb21wYXJpc29uRGF0YU1vZGVsLGpvYlByb2ZpbGU6Sm9iUHJvZmlsZU1vZGVsKSB7XG4gICAgdmFyIGNhbmRpZGF0ZUxpc3RTdGF0dXM6c3RyaW5nW10gPSBuZXcgQXJyYXkoMCk7XG4gICAgZm9yKGxldCBsaXN0IG9mIGpvYlByb2ZpbGUuY2FuZGlkYXRlX2xpc3QpIHtcbiAgICAgIGZvcihsZXQgaWQgb2YgbGlzdC5pZHMpIHtcbiAgICAgICAgIGlmKG5ld0NhbmRpZGF0ZS5faWQgPT0gaWQpIHtcbiAgICAgICAgICAgY2FuZGlkYXRlTGlzdFN0YXR1cy5wdXNoKGxpc3QubmFtZSk7XG4gICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmKGNhbmRpZGF0ZUxpc3RTdGF0dXMubGVuZ3RoID09IDApIHtcbiAgICAgIGNhbmRpZGF0ZUxpc3RTdGF0dXMucHVzaCgnbWF0Y2hlZExpc3QnKTtcbiAgICB9XG4gICAgbmV3Q2FuZGlkYXRlLmNhbmRpZGF0ZUxpc3RTdGF0dXMgPSBjYW5kaWRhdGVMaXN0U3RhdHVzO1xuICAgIHJldHVybiBuZXdDYW5kaWRhdGU7XG4gIH1cblxuICBzb3J0Q2FuZGlkYXRlU2tpbGxzKG5ld0NhbmRpZGF0ZTpQcm9maWxlQ29tcGFyaXNvbkRhdGFNb2RlbCkge1xuXG4gICAgdmFyIHNraWxsU3RhdHVzRGF0YTpTa2lsbFN0YXR1c1tdID0gbmV3IEFycmF5KDApO1xuICAgIGZvcihsZXQgdmFsdWUgb2YgbmV3Q2FuZGlkYXRlLnByb2ZpY2llbmNpZXNNYXRjaCkge1xuICAgICAgdmFyIHNraWxsU3RhdHVzOlNraWxsU3RhdHVzID0gbmV3IFNraWxsU3RhdHVzKCk7XG4gICAgICBza2lsbFN0YXR1cy5uYW1lID0gdmFsdWU7XG4gICAgICBza2lsbFN0YXR1cy5zdGF0dXMgPSAnTWF0Y2gnO1xuICAgICAgc2tpbGxTdGF0dXNEYXRhLnB1c2goc2tpbGxTdGF0dXMpO1xuICAgIH1cbiAgICBmb3IobGV0IHZhbHVlIG9mIG5ld0NhbmRpZGF0ZS5wcm9maWNpZW5jaWVzVW5NYXRjaCkge1xuICAgICAgdmFyIHNraWxsU3RhdHVzOlNraWxsU3RhdHVzID0gbmV3IFNraWxsU3RhdHVzKCk7XG4gICAgICBza2lsbFN0YXR1cy5uYW1lID0gdmFsdWU7XG4gICAgICBza2lsbFN0YXR1cy5zdGF0dXMgPSAnVW5NYXRjaCc7XG4gICAgICBza2lsbFN0YXR1c0RhdGEucHVzaChza2lsbFN0YXR1cyk7XG4gICAgfVxuICAgIG5ld0NhbmRpZGF0ZS5jYW5kaWRhdGVTa2lsbFN0YXR1cyA9IHNraWxsU3RhdHVzRGF0YTtcbiAgICByZXR1cm4gbmV3Q2FuZGlkYXRlO1xuICB9XG5cbiAgZ2V0Q2FuZGlkYXRlVmlzaWJpbGl0eUFnYWluc3RSZWNydWl0ZXIoY2FuZGlkYXRlRGV0YWlsczpDYW5kaWRhdGVNb2RlbCwgam9iUHJvZmlsZXM6Sm9iUHJvZmlsZU1vZGVsW10pIHtcbiAgICBsZXQgaXNHb3RJdCA9IHRydWU7XG4gICAgdmFyIF9jYW5EZXRhaWxzV2l0aEpvYk1hdGNoaW5nOkNhbmRpZGF0ZURldGFpbHNXaXRoSm9iTWF0Y2hpbmcgPSBuZXcgQ2FuZGlkYXRlRGV0YWlsc1dpdGhKb2JNYXRjaGluZygpO1xuICAgIGZvciAobGV0IGpvYiBvZiBqb2JQcm9maWxlcykge1xuICAgICAgZm9yIChsZXQgaXRlbSBvZiBqb2IuY2FuZGlkYXRlX2xpc3QpIHtcbiAgICAgICAgaWYgKGl0ZW0ubmFtZSA9PT0gJ2NhcnRMaXN0ZWQnKSB7XG4gICAgICAgICAgaWYgKGl0ZW0uaWRzLmluZGV4T2YobmV3IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkKGNhbmRpZGF0ZURldGFpbHMuX2lkKS50b1N0cmluZygpKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIGlzR290SXQgPSBmYWxzZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKCFpc0dvdEl0KSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChpc0dvdEl0KSB7XG4gICAgICBjYW5kaWRhdGVEZXRhaWxzLnVzZXJJZC5tb2JpbGVfbnVtYmVyID0gVXRpbGl0eUZ1bmN0aW9uLm1vYmlsZU51bWJlckhpZGVyKGNhbmRpZGF0ZURldGFpbHMudXNlcklkLm1vYmlsZV9udW1iZXIpO1xuICAgICAgY2FuZGlkYXRlRGV0YWlscy51c2VySWQuZW1haWwgPSBVdGlsaXR5RnVuY3Rpb24uZW1haWxWYWx1ZUhpZGVyKGNhbmRpZGF0ZURldGFpbHMudXNlcklkLmVtYWlsKTtcbiAgICAgIGNhbmRpZGF0ZURldGFpbHMuYWNhZGVtaWNzID0gW107XG4gICAgICBjYW5kaWRhdGVEZXRhaWxzLmVtcGxveW1lbnRIaXN0b3J5ID0gW107XG4gICAgICBjYW5kaWRhdGVEZXRhaWxzLmFyZWFPZldvcmsgPSBbXTtcbiAgICAgIGNhbmRpZGF0ZURldGFpbHMucHJvZmljaWVuY2llcyA9IFtdO1xuICAgICAgY2FuZGlkYXRlRGV0YWlscy5hd2FyZHMgPSBbXTtcbiAgICAgIGNhbmRpZGF0ZURldGFpbHMucHJvZmljaWVuY2llcyA9IFtdO1xuICAgICAgY2FuZGlkYXRlRGV0YWlscy5wcm9mZXNzaW9uYWxEZXRhaWxzLmVkdWNhdGlvbiA9IFV0aWxpdHlGdW5jdGlvbi52YWx1ZUhpZGUoY2FuZGlkYXRlRGV0YWlscy5wcm9mZXNzaW9uYWxEZXRhaWxzLmVkdWNhdGlvbilcbiAgICAgIGNhbmRpZGF0ZURldGFpbHMucHJvZmVzc2lvbmFsRGV0YWlscy5leHBlcmllbmNlID0gVXRpbGl0eUZ1bmN0aW9uLnZhbHVlSGlkZShjYW5kaWRhdGVEZXRhaWxzLnByb2Zlc3Npb25hbERldGFpbHMuZXhwZXJpZW5jZSlcbiAgICAgIGNhbmRpZGF0ZURldGFpbHMucHJvZmVzc2lvbmFsRGV0YWlscy5pbmR1c3RyeUV4cG9zdXJlID0gVXRpbGl0eUZ1bmN0aW9uLnZhbHVlSGlkZShjYW5kaWRhdGVEZXRhaWxzLnByb2Zlc3Npb25hbERldGFpbHMuaW5kdXN0cnlFeHBvc3VyZSk7XG4gICAgICBjYW5kaWRhdGVEZXRhaWxzLnByb2Zlc3Npb25hbERldGFpbHMuY3VycmVudFNhbGFyeSA9IFV0aWxpdHlGdW5jdGlvbi52YWx1ZUhpZGUoY2FuZGlkYXRlRGV0YWlscy5wcm9mZXNzaW9uYWxEZXRhaWxzLmN1cnJlbnRTYWxhcnkpO1xuICAgICAgY2FuZGlkYXRlRGV0YWlscy5wcm9mZXNzaW9uYWxEZXRhaWxzLm5vdGljZVBlcmlvZCA9IFV0aWxpdHlGdW5jdGlvbi52YWx1ZUhpZGUoY2FuZGlkYXRlRGV0YWlscy5wcm9mZXNzaW9uYWxEZXRhaWxzLm5vdGljZVBlcmlvZCk7XG4gICAgICBjYW5kaWRhdGVEZXRhaWxzLnByb2Zlc3Npb25hbERldGFpbHMucmVsb2NhdGUgPSBVdGlsaXR5RnVuY3Rpb24udmFsdWVIaWRlKGNhbmRpZGF0ZURldGFpbHMucHJvZmVzc2lvbmFsRGV0YWlscy5yZWxvY2F0ZSk7XG4gICAgfVxuICAgIGNhbmRpZGF0ZURldGFpbHMudXNlcklkLnBhc3N3b3JkID0gJyc7XG4gICAgX2NhbkRldGFpbHNXaXRoSm9iTWF0Y2hpbmcuY2FuZGlkYXRlRGV0YWlscyA9IGNhbmRpZGF0ZURldGFpbHM7XG4gICAgX2NhbkRldGFpbHNXaXRoSm9iTWF0Y2hpbmcuaXNTaG93Q2FuZGlkYXRlRGV0YWlscyA9IGlzR290SXQ7XG4gICAgcmV0dXJuIF9jYW5EZXRhaWxzV2l0aEpvYk1hdGNoaW5nO1xuICB9XG59XG5cbk9iamVjdC5zZWFsKFNlYXJjaFNlcnZpY2UpO1xuZXhwb3J0ID0gU2VhcmNoU2VydmljZTtcbiJdfQ==
