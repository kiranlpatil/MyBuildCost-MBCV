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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2VhcmNoL3NlcnZpY2VzL3NlYXJjaC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSxzRkFBeUY7QUFDekYsd0RBQTJEO0FBQzNELHNGQUF5RjtBQUV6RixxRUFBd0U7QUFDeEUsZ0VBQXFFO0FBQ3JFLHNHQUE2RztBQUM3RywwRkFBcUY7QUFDckYsNEZBQXVGO0FBQ3ZGLG9HQUE4RjtBQUM5RixtQ0FBcUM7QUFDckMsMEdBQXVHO0FBQ3ZHLG9FQUFnRTtBQUNoRSx3RUFBMkU7QUFDM0UseURBQTREO0FBQzVELG9GQUF1RjtBQUd2RixJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFFNUM7SUFPRTtRQUNFLElBQUksQ0FBQyxRQUFRLEdBQUcsWUFBWSxDQUFDLFFBQVEsQ0FBQztRQUN0QyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxtQkFBbUIsRUFBRSxDQUFDO1FBQ3JELElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLG1CQUFtQixFQUFFLENBQUM7UUFDckQsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksa0JBQWtCLEVBQUUsQ0FBQztRQUNuRCxJQUFJLEdBQUcsR0FBUSxJQUFJLFlBQVksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUMvQyxJQUFJLENBQUMsc0JBQXNCLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQztJQUNoRCxDQUFDO0lBRUQsNkNBQXFCLEdBQXJCLFVBQXNCLFVBQTJCLEVBQUUsUUFBMkM7UUFBOUYsaUJBMkdDO1FBMUdDLE9BQU8sQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUN0QyxJQUFJLElBQVMsQ0FBQztRQUNkLElBQUksT0FBTyxHQUFZLEtBQUssQ0FBQztRQUM3QixJQUFJLFVBQVUsR0FBYSxFQUFFLENBQUM7UUFDOUIsSUFBSSx5QkFBeUIsR0FBWSxLQUFLLENBQUM7UUFDL0MsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLG9C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LENBQUMsQ0FBQTtZQUM1SCxnQkFBZ0IsQ0FBQyxtQkFBbUIsQ0FBQyxnQkFBZ0IsR0FBRyxrQ0FBZSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxtQkFBbUIsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ3pJLGdCQUFnQixDQUFDLG1CQUFtQixDQUFDLGFBQWEsR0FBRyxrQ0FBZSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxtQkFBbUIsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUNuSSxnQkFBZ0IsQ0FBQyxtQkFBbUIsQ0FBQyxZQUFZLEdBQUcsa0NBQWUsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsbUJBQW1CLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDakksZ0JBQWdCLENBQUMsbUJBQW1CLENBQUMsUUFBUSxHQUFHLGtDQUFlLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzNILENBQUM7UUFDRCxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztRQUN0QywwQkFBMEIsQ0FBQyxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQztRQUMvRCwwQkFBMEIsQ0FBQyxzQkFBc0IsR0FBRyxPQUFPLENBQUM7UUFDNUQsTUFBTSxDQUFDLDBCQUEwQixDQUFDO0lBQ3BDLENBQUM7SUFDSCxvQkFBQztBQUFELENBbnJCQSxBQW1yQkMsSUFBQTtBQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDM0IsaUJBQVMsYUFBYSxDQUFDIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvc2VhcmNoL3NlcnZpY2VzL3NlYXJjaC5zZXJ2aWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEpvYlByb2ZpbGVNb2RlbCA9IHJlcXVpcmUoJy4uLy4uL2RhdGFhY2Nlc3MvbW9kZWwvam9icHJvZmlsZS5tb2RlbCcpO1xyXG5pbXBvcnQgQ2FuZGlkYXRlUmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uLy4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9jYW5kaWRhdGUucmVwb3NpdG9yeScpO1xyXG5pbXBvcnQgUHJvamVjdEFzc2V0ID0gcmVxdWlyZSgnLi4vLi4vc2hhcmVkL3Byb2plY3Rhc3NldCcpO1xyXG5pbXBvcnQgUmVjcnVpdGVyUmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uLy4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9yZWNydWl0ZXIucmVwb3NpdG9yeScpO1xyXG5pbXBvcnQgQ2FuZGlkYXRlTW9kZWwgPSByZXF1aXJlKCcuLi8uLi9kYXRhYWNjZXNzL21vZGVsL2NhbmRpZGF0ZS5tb2RlbCcpO1xyXG5pbXBvcnQgSm9iUHJvZmlsZVNlcnZpY2UgPSByZXF1aXJlKCcuLi8uLi9zZXJ2aWNlcy9qb2Jwcm9maWxlLnNlcnZpY2UnKTtcclxuaW1wb3J0IHtBY3Rpb25zLCBDb25zdFZhcmlhYmxlc30gZnJvbSBcIi4uLy4uL3NoYXJlZC9zaGFyZWRjb25zdGFudHNcIjtcclxuaW1wb3J0IHtQcm9maWxlQ29tcGFyaXNvbkRhdGFNb2RlbCwgU2tpbGxTdGF0dXN9IGZyb20gXCIuLi8uLi9kYXRhYWNjZXNzL21vZGVsL3Byb2ZpbGUtY29tcGFyaXNvbi1kYXRhLm1vZGVsXCI7XHJcbmltcG9ydCB7Q2FwYWJpbGl0eU1hdHJpeE1vZGVsfSBmcm9tIFwiLi4vLi4vZGF0YWFjY2Vzcy9tb2RlbC9jYXBhYmlsaXR5LW1hdHJpeC5tb2RlbFwiO1xyXG5pbXBvcnQge1Byb2ZpbGVDb21wYXJpc29uTW9kZWx9IGZyb20gXCIuLi8uLi9kYXRhYWNjZXNzL21vZGVsL3Byb2ZpbGUtY29tcGFyaXNvbi5tb2RlbFwiO1xyXG5pbXBvcnQge1Byb2ZpbGVDb21wYXJpc29uSm9iTW9kZWx9IGZyb20gXCIuLi8uLi9kYXRhYWNjZXNzL21vZGVsL3Byb2ZpbGUtY29tcGFyaXNvbi1qb2IubW9kZWxcIjtcclxuaW1wb3J0ICogYXMgbW9uZ29vc2UgZnJvbSBcIm1vbmdvb3NlXCI7XHJcbmltcG9ydCB7Q2FuZGlkYXRlRGV0YWlsc1dpdGhKb2JNYXRjaGluZ30gZnJvbSBcIi4uLy4uL2RhdGFhY2Nlc3MvbW9kZWwvY2FuZGlkYXRlZGV0YWlsc3dpdGhqb2JtYXRjaGluZ1wiO1xyXG5pbXBvcnQge1V0aWxpdHlGdW5jdGlvbn0gZnJvbSBcIi4uLy4uL3VpdGlsaXR5L3V0aWxpdHktZnVuY3Rpb25cIjtcclxuaW1wb3J0IE1hdGNoVmlld01vZGVsID0gcmVxdWlyZSgnLi4vLi4vZGF0YWFjY2Vzcy9tb2RlbC9tYXRjaC12aWV3Lm1vZGVsJyk7XHJcbmltcG9ydCBNYXRjaCA9IHJlcXVpcmUoJy4uLy4uL2RhdGFhY2Nlc3MvbW9kZWwvbWF0Y2gtZW51bScpO1xyXG5pbXBvcnQgSW5kdXN0cnlSZXBvc2l0b3J5ID0gcmVxdWlyZSgnLi4vLi4vZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L2luZHVzdHJ5LnJlcG9zaXRvcnknKTtcclxuaW1wb3J0IEluZHVzdHJ5TW9kZWwgPSByZXF1aXJlKCcuLi8uLi9kYXRhYWNjZXNzL21vZGVsL2luZHVzdHJ5Lm1vZGVsJyk7XHJcbmltcG9ydCBTY2VuYXJpb01vZGVsID0gcmVxdWlyZSgnLi4vLi4vZGF0YWFjY2Vzcy9tb2RlbC9zY2VuYXJpby5tb2RlbCcpO1xyXG5sZXQgdXNlc3RyYWNraW5nID0gcmVxdWlyZSgndXNlcy10cmFja2luZycpO1xyXG5cclxuY2xhc3MgU2VhcmNoU2VydmljZSB7XHJcbiAgQVBQX05BTUU6IHN0cmluZztcclxuICBjYW5kaWRhdGVSZXBvc2l0b3J5OiBDYW5kaWRhdGVSZXBvc2l0b3J5O1xyXG4gIHJlY3J1aXRlclJlcG9zaXRvcnk6IFJlY3J1aXRlclJlcG9zaXRvcnk7XHJcbiAgaW5kdXN0cnlSZXBvc2l0b3J5OiBJbmR1c3RyeVJlcG9zaXRvcnk7XHJcbiAgcHJpdmF0ZSB1c2VzVHJhY2tpbmdDb250cm9sbGVyOiBhbnk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5BUFBfTkFNRSA9IFByb2plY3RBc3NldC5BUFBfTkFNRTtcclxuICAgIHRoaXMuY2FuZGlkYXRlUmVwb3NpdG9yeSA9IG5ldyBDYW5kaWRhdGVSZXBvc2l0b3J5KCk7XHJcbiAgICB0aGlzLnJlY3J1aXRlclJlcG9zaXRvcnkgPSBuZXcgUmVjcnVpdGVyUmVwb3NpdG9yeSgpO1xyXG4gICAgdGhpcy5pbmR1c3RyeVJlcG9zaXRvcnkgPSBuZXcgSW5kdXN0cnlSZXBvc2l0b3J5KCk7XHJcbiAgICBsZXQgb2JqOiBhbnkgPSBuZXcgdXNlc3RyYWNraW5nLk15Q29udHJvbGxlcigpO1xyXG4gICAgdGhpcy51c2VzVHJhY2tpbmdDb250cm9sbGVyID0gb2JqLl9jb250cm9sbGVyO1xyXG4gIH1cclxuXHJcbiAgZ2V0TWF0Y2hpbmdDYW5kaWRhdGVzKGpvYlByb2ZpbGU6IEpvYlByb2ZpbGVNb2RlbCwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgY29uc29sZS50aW1lKCdnZXRNYXRjaGluZyBDYW5kaWRhdGUnKTtcclxuICAgIGxldCBkYXRhOiBhbnk7XHJcbiAgICBsZXQgaXNGb3VuZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgbGV0IGluZHVzdHJpZXM6IHN0cmluZ1tdID0gW107XHJcbiAgICBsZXQgaXNSZWxldmVudEluZHVzdHJpZXNGb3VuZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgaWYgKGpvYlByb2ZpbGUuaW50ZXJlc3RlZEluZHVzdHJpZXMgJiYgam9iUHJvZmlsZS5pbnRlcmVzdGVkSW5kdXN0cmllcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgIC8qaXNGb3VuZD0gam9iUHJvZmlsZS5pbnRlcmVzdGVkSW5kdXN0cmllcy5maWx0ZXIoKG5hbWUgOiBzdHJpbmcpPT4ge1xyXG4gICAgICAgaWYobmFtZSA9PT0gJ05vbmUnKXtcclxuICAgICAgIHJldHVybiBuYW1lO1xyXG4gICAgICAgfVxyXG4gICAgICAgfSk7Ki9cclxuICAgICAgLy9qb2JQcm9maWxlLnJlbGV2ZW50SW5kdXN0cmllcyA9IFsnVGV4dGlsZSddO1xyXG4gICAgICBmb3IgKGxldCBuYW1lIG9mIGpvYlByb2ZpbGUuaW50ZXJlc3RlZEluZHVzdHJpZXMpIHtcclxuICAgICAgICBpZiAobmFtZSA9PT0gJ05vbmUnKSB7XHJcbiAgICAgICAgICBpc0ZvdW5kID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgaWYoam9iUHJvZmlsZS5yZWxldmVudEluZHVzdHJpZXMgJiYgam9iUHJvZmlsZS5yZWxldmVudEluZHVzdHJpZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgaXNSZWxldmVudEluZHVzdHJpZXNGb3VuZCA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGlzRm91bmQpIHtcclxuXHJcbiAgICAgICAgaWYoaXNSZWxldmVudEluZHVzdHJpZXNGb3VuZCkge1xyXG4gICAgICAgICAgaW5kdXN0cmllcyA9IGpvYlByb2ZpbGUucmVsZXZlbnRJbmR1c3RyaWVzO1xyXG5cclxuICAgICAgICAgIGluZHVzdHJpZXMucHVzaChqb2JQcm9maWxlLmluZHVzdHJ5Lm5hbWUpO1xyXG4gICAgICAgICAgZGF0YSA9IHtcclxuICAgICAgICAgICAgJ2luZHVzdHJ5Lm5hbWUnOiB7JGluOiBpbmR1c3RyaWVzfSxcclxuICAgICAgICAgICAgJG9yOiBbXHJcbiAgICAgICAgICAgICAgeydwcm9mZXNzaW9uYWxEZXRhaWxzLnJlbG9jYXRlJzogJ1llcyd9LFxyXG4gICAgICAgICAgICAgIHsnbG9jYXRpb24uY2l0eSc6IGpvYlByb2ZpbGUubG9jYXRpb24uY2l0eX1cclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgJ3Byb2ZpY2llbmNpZXMnOiB7JGluOiBqb2JQcm9maWxlLnByb2ZpY2llbmNpZXN9LFxyXG4gICAgICAgICAgICAnaXNWaXNpYmxlJzogdHJ1ZSxcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGRhdGEgPSB7XHJcbiAgICAgICAgICAgICdpbmR1c3RyeS5uYW1lJzogam9iUHJvZmlsZS5pbmR1c3RyeS5uYW1lLFxyXG4gICAgICAgICAgICAkb3I6IFtcclxuICAgICAgICAgICAgICB7J3Byb2Zlc3Npb25hbERldGFpbHMucmVsb2NhdGUnOiAnWWVzJ30sXHJcbiAgICAgICAgICAgICAgeydsb2NhdGlvbi5jaXR5Jzogam9iUHJvZmlsZS5sb2NhdGlvbi5jaXR5fVxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAncHJvZmljaWVuY2llcyc6IHskaW46IGpvYlByb2ZpbGUucHJvZmljaWVuY2llc30sXHJcbiAgICAgICAgICAgICdpc1Zpc2libGUnOiB0cnVlLFxyXG4gICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYoaXNSZWxldmVudEluZHVzdHJpZXNGb3VuZCkge1xyXG4gICAgICAgICAgaW5kdXN0cmllcyA9IGpvYlByb2ZpbGUucmVsZXZlbnRJbmR1c3RyaWVzO1xyXG4gICAgICAgICAgaW5kdXN0cmllcy5wdXNoKGpvYlByb2ZpbGUuaW5kdXN0cnkubmFtZSk7XHJcbiAgICAgICAgICBkYXRhID0ge1xyXG4gICAgICAgICAgICAnaW5kdXN0cnkubmFtZSc6IHskaW46IGluZHVzdHJpZXN9LFxyXG4gICAgICAgICAgICAkb3I6IFtcclxuICAgICAgICAgICAgICB7J3Byb2Zlc3Npb25hbERldGFpbHMucmVsb2NhdGUnOiAnWWVzJ30sXHJcbiAgICAgICAgICAgICAgeydsb2NhdGlvbi5jaXR5Jzogam9iUHJvZmlsZS5sb2NhdGlvbi5jaXR5fVxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAncHJvZmljaWVuY2llcyc6IHskaW46IGpvYlByb2ZpbGUucHJvZmljaWVuY2llc30sXHJcbiAgICAgICAgICAgICdpbnRlcmVzdGVkSW5kdXN0cmllcyc6IHskaW46IGpvYlByb2ZpbGUuaW50ZXJlc3RlZEluZHVzdHJpZXN9LFxyXG4gICAgICAgICAgICAnaXNWaXNpYmxlJzogdHJ1ZSxcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGRhdGEgPSB7XHJcbiAgICAgICAgICAgICdpbmR1c3RyeS5uYW1lJzogam9iUHJvZmlsZS5pbmR1c3RyeS5uYW1lLFxyXG4gICAgICAgICAgICAkb3I6IFtcclxuICAgICAgICAgICAgICB7J3Byb2Zlc3Npb25hbERldGFpbHMucmVsb2NhdGUnOiAnWWVzJ30sXHJcbiAgICAgICAgICAgICAgeydsb2NhdGlvbi5jaXR5Jzogam9iUHJvZmlsZS5sb2NhdGlvbi5jaXR5fVxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAncHJvZmljaWVuY2llcyc6IHskaW46IGpvYlByb2ZpbGUucHJvZmljaWVuY2llc30sXHJcbiAgICAgICAgICAgICdpbnRlcmVzdGVkSW5kdXN0cmllcyc6IHskaW46IGpvYlByb2ZpbGUuaW50ZXJlc3RlZEluZHVzdHJpZXN9LFxyXG4gICAgICAgICAgICAnaXNWaXNpYmxlJzogdHJ1ZSxcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZGF0YSA9IHtcclxuICAgICAgICAnaXNWaXNpYmxlJzogdHJ1ZSxcclxuICAgICAgICAnaW5kdXN0cnkubmFtZSc6IGpvYlByb2ZpbGUuaW5kdXN0cnkubmFtZSxcclxuICAgICAgICAncHJvZmljaWVuY2llcyc6IHskaW46IGpvYlByb2ZpbGUucHJvZmljaWVuY2llc30sXHJcbiAgICAgICAgJG9yOiBbXHJcbiAgICAgICAgICB7J3Byb2Zlc3Npb25hbERldGFpbHMucmVsb2NhdGUnOiAnWWVzJ30sXHJcbiAgICAgICAgICB7J2xvY2F0aW9uLmNpdHknOiBqb2JQcm9maWxlLmxvY2F0aW9uLmNpdHl9XHJcbiAgICAgICAgXVxyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gICAgbGV0IGluY2x1ZGVkX2ZpZWxkcyA9IHtcclxuICAgICAgJ2luZHVzdHJ5LnJvbGVzLmNhcGFiaWxpdGllcy5jb21wbGV4aXRpZXMuc2NlbmFyaW9zLmNvZGUnOiAxLFxyXG4gICAgICAnaW5kdXN0cnkucm9sZXMuY2FwYWJpbGl0aWVzLmNvbXBsZXhpdGllcy5zY2VuYXJpb3MuaXNDaGVja2VkJzogMSxcclxuICAgICAgJ2luZHVzdHJ5LnJvbGVzLmRlZmF1bHRfY29tcGxleGl0aWVzLmNvbXBsZXhpdGllcy5zY2VuYXJpb3MuY29kZSc6IDEsXHJcbiAgICAgICdpbmR1c3RyeS5yb2xlcy5kZWZhdWx0X2NvbXBsZXhpdGllcy5jb21wbGV4aXRpZXMuc2NlbmFyaW9zLmlzQ2hlY2tlZCc6IDEsXHJcbiAgICAgICd1c2VySWQnOiAxLFxyXG4gICAgICAncHJvZmljaWVuY2llcyc6IDEsXHJcbiAgICAgICdsb2NhdGlvbic6IDEsXHJcbiAgICAgICdpbnRlcmVzdGVkSW5kdXN0cmllcyc6IDEsXHJcbiAgICAgICdwcm9mZXNzaW9uYWxEZXRhaWxzJzogMSxcclxuICAgICAgJ2NhcGFiaWxpdHlfbWF0cml4JzoxLFxyXG4gICAgICAnY29tcGxleGl0eV9tdXN0aGF2ZV9tYXRyaXgnOiAxXHJcbiAgICB9O1xyXG4gICAgdGhpcy5jYW5kaWRhdGVSZXBvc2l0b3J5LnJldHJpZXZlV2l0aExlYW4oZGF0YSwgaW5jbHVkZWRfZmllbGRzLCAoZXJyLCByZXMpID0+IHtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gY2FsbGJhY2sobnVsbCwgcmVzKTtcclxuICAgICAgICB0aGlzLmNhbmRpZGF0ZVJlcG9zaXRvcnkuZ2V0Q2FuZGlkYXRlUUNhcmQocmVzLCBqb2JQcm9maWxlLCB1bmRlZmluZWQsIGNhbGxiYWNrKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRNYXRjaGluZ0pvYlByb2ZpbGUoY2FuZGlkYXRlOiBDYW5kaWRhdGVNb2RlbCwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG5cclxuICAgIGxldCBjdXJyZW50RGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICBsZXQgZGF0YSA9IHtcclxuICAgICAgJ3Bvc3RlZEpvYnMuaW5kdXN0cnkubmFtZSc6IGNhbmRpZGF0ZS5pbmR1c3RyeS5uYW1lLFxyXG4gICAgICAncG9zdGVkSm9icy5wcm9maWNpZW5jaWVzJzogeyRpbjogY2FuZGlkYXRlLnByb2ZpY2llbmNpZXN9LFxyXG4gICAgICAncG9zdGVkSm9icy5leHBpcmluZ0RhdGUnOiB7JGd0ZTogY3VycmVudERhdGV9XHJcbiAgICB9O1xyXG4gICAgbGV0IGV4Y2x1ZGVkX2ZpZWxkcyA9IHtcclxuICAgICAgJ3Bvc3RlZEpvYnMuaW5kdXN0cnkucm9sZXMnOiAwLFxyXG4gICAgfTtcclxuICAgIHRoaXMucmVjcnVpdGVyUmVwb3NpdG9yeS5yZXRyaWV2ZVdpdGhMZWFuKGRhdGEsZXhjbHVkZWRfZmllbGRzLCAoZXJyLCByZXMpID0+IHtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5yZWNydWl0ZXJSZXBvc2l0b3J5LmdldEpvYlByb2ZpbGVRQ2FyZChyZXMsIGNhbmRpZGF0ZSwgdW5kZWZpbmVkLCAnbm9uZScsIGNhbGxiYWNrKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRNYXRjaGluZ1Jlc3VsdChjYW5kaWRhdGVJZDogc3RyaW5nLCBqb2JJZDogc3RyaW5nLCBpc0NhbmRpZGF0ZSA6IGJvb2xlYW4sY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbGV0IHVzZXNfZGF0YSA9IHtcclxuICAgICAgY2FuZGlkYXRlSWQ6IGNhbmRpZGF0ZUlkLFxyXG4gICAgICBqb2JQcm9maWxlSWQ6IGpvYklkLFxyXG4gICAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCksXHJcbiAgICAgIGFjdGlvbjogQWN0aW9ucy5ERUZBVUxUX1ZBTFVFXHJcbiAgICB9O1xyXG4gICAgaWYgKGlzQ2FuZGlkYXRlKSB7XHJcbiAgICAgIHVzZXNfZGF0YS5hY3Rpb24gPSBBY3Rpb25zLlZJRVdFRF9KT0JfUFJPRklMRV9CWV9DQU5ESURBVEU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB1c2VzX2RhdGEuYWN0aW9uID0gQWN0aW9ucy5WSUVXRURfRlVMTF9QUk9GSUxFX0JZX1JFQ1JVSVRFUjtcclxuICAgIH1cclxuICAgIHRoaXMudXNlc1RyYWNraW5nQ29udHJvbGxlci5jcmVhdGUodXNlc19kYXRhKTtcclxuICAgIHRoaXMuY2FuZGlkYXRlUmVwb3NpdG9yeS5maW5kQnlJZHdpdGhFeGNsdWRlKGNhbmRpZGF0ZUlkLHsnaW5kdXN0cnknOjB9LCAoZXJyOiBhbnksIGNhbmRpZGF0ZVJlczogYW55KSA9PiB7XHJcbiAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChjYW5kaWRhdGVSZXMpIHtcclxuICAgICAgICAgIGxldCBkYXRhID0ge1xyXG4gICAgICAgICAgICAncG9zdGVkSm9iJzogam9iSWRcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgICBsZXQgam9iUHJvZmlsZVNlcnZpY2U6IEpvYlByb2ZpbGVTZXJ2aWNlID0gbmV3IEpvYlByb2ZpbGVTZXJ2aWNlKCk7XHJcbiAgICAgICAgICBqb2JQcm9maWxlU2VydmljZS5yZXRyaWV2ZShkYXRhLCAoZXJySW5Kb2IsIHJlc09mUmVjcnVpdGVyKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnJJbkpvYikge1xyXG4gICAgICAgICAgICAgIGNhbGxiYWNrKGVyckluSm9iLCBudWxsKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICB0aGlzLmdldFJlc3VsdChjYW5kaWRhdGVSZXMsIHJlc09mUmVjcnVpdGVyLnBvc3RlZEpvYnNbMF0sIGlzQ2FuZGlkYXRlLCBjYWxsYmFjayk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgY29tcGFyZVR3b09wdGlvbnMoZmlyc3Q6IG51bWJlciwgc2Vjb25kOiBudW1iZXIpOiBzdHJpbmcge1xyXG4gICAgaWYgKGZpcnN0IDwgc2Vjb25kKSB7XHJcbiAgICAgIHJldHVybiAnYmVsb3cnO1xyXG4gICAgfSBlbHNlIGlmIChmaXJzdCA+IHNlY29uZCkge1xyXG4gICAgICByZXR1cm4gJ2Fib3ZlJztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiAnZXhhY3QnO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0RWR1Y3Rpb25Td2l0Y2hDYXNlKGVkdWNhdGlvbjogc3RyaW5nKTogbnVtYmVyIHtcclxuICAgIHN3aXRjaCAoZWR1Y2F0aW9uKSB7XHJcbiAgICAgIGNhc2UgJ1VuZGVyIEdyYWR1YXRlJzpcclxuICAgICAgICByZXR1cm4gMTtcclxuICAgICAgY2FzZSAnR3JhZHVhdGUnOlxyXG4gICAgICAgIHJldHVybiAyO1xyXG4gICAgICBjYXNlICdQb3N0IEdyYWR1YXRlJzpcclxuICAgICAgICByZXR1cm4gMztcclxuICAgIH1cclxuICAgIHJldHVybiAtMTtcclxuICB9XHJcblxyXG4gIGdldFBlcmlvZFN3aXRjaENhc2UocGVyaW9kOiBzdHJpbmcpOiBudW1iZXIgey8vVE8gRE8gOkRvIG5vdCB1c2UgaGFyZCBjb2RpbmdcclxuICAgIHN3aXRjaCAocGVyaW9kKSB7XHJcbiAgICAgIGNhc2UgJ0ltbWVkaWF0ZScgOlxyXG4gICAgICAgIHJldHVybiAxO1xyXG4gICAgICBjYXNlICdXaXRoaW4gMSBtb250aHMnOlxyXG4gICAgICAgIHJldHVybiAyO1xyXG4gICAgICBjYXNlICcxLTIgTW9udGhzJzpcclxuICAgICAgICByZXR1cm4gMztcclxuICAgICAgY2FzZSAnMi0zIE1vbnRocyc6XHJcbiAgICAgICAgcmV0dXJuIDQ7XHJcbiAgICAgIGNhc2UgJ0JleW9uZCAzIG1vbnRocyc6XHJcbiAgICAgICAgcmV0dXJuIDU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gLTE7XHJcbiAgfVxyXG5cclxuICBnZXRSZXN1bHQoY2FuZGlkYXRlOiBhbnksIGpvYjogYW55LCBpc0NhbmRpZGF0ZTogYm9vbGVhbiwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgdGhpcy5pbmR1c3RyeVJlcG9zaXRvcnkucmV0cmlldmUoeyduYW1lJzogam9iLmluZHVzdHJ5Lm5hbWV9LCAoZXJyOiBhbnksIGluZHVzdHJpZXM6IEluZHVzdHJ5TW9kZWxbXSkgPT4ge1xyXG4gICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB2YXIgbmV3Q2FuZGlkYXRlID0gdGhpcy5nZXRDb21wYXJlRGF0YShjYW5kaWRhdGUsIGpvYiwgaXNDYW5kaWRhdGUsIGluZHVzdHJpZXMpO1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIG5ld0NhbmRpZGF0ZSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0Q29tcGFyZURhdGEoY2FuZGlkYXRlOiBDYW5kaWRhdGVNb2RlbCwgam9iOiBhbnksIGlzQ2FuZGlkYXRlOiBib29sZWFuLCBpbmR1c3RyaWVzOiBJbmR1c3RyeU1vZGVsW10pIHtcclxuICAgIC8vbGV0IG5ld0NhbmRpZGF0ZSA9IGNhbmRpZGF0ZS50b09iamVjdCgpO1xyXG4gICAgdmFyIG5ld0NhbmRpZGF0ZSA9IHRoaXMuYnVpbGRDYW5kaWRhdGVNb2RlbChjYW5kaWRhdGUpO1xyXG4gICAgbGV0IGpvYk1pbkV4cGVyaWVuY2U6IG51bWJlciA9IE51bWJlcihqb2IuZXhwZXJpZW5jZU1pblZhbHVlKTtcclxuICAgIGxldCBqb2JNYXhFeHBlcmllbmNlOiBudW1iZXIgPSBOdW1iZXIoam9iLmV4cGVyaWVuY2VNYXhWYWx1ZSk7XHJcbiAgICBsZXQgam9iTWluU2FsYXJ5OiBudW1iZXIgPSBOdW1iZXIoam9iLnNhbGFyeU1pblZhbHVlKTtcclxuICAgIGxldCBqb2JNYXhTYWxhcnk6IG51bWJlciA9IE51bWJlcihqb2Iuc2FsYXJ5TWF4VmFsdWUpO1xyXG4gICAgbGV0IGNhbmRpRXhwZXJpZW5jZTogc3RyaW5nW10gPSBuZXdDYW5kaWRhdGUucHJvZmVzc2lvbmFsRGV0YWlscy5leHBlcmllbmNlLnNwbGl0KCcgJyk7XHJcbiAgICBsZXQgY2FuU2FsYXJ5OiBzdHJpbmdbXSA9IG5ld0NhbmRpZGF0ZS5wcm9mZXNzaW9uYWxEZXRhaWxzLmN1cnJlbnRTYWxhcnkuc3BsaXQoJyAnKTtcclxuICAgIGlmICgoam9iTWF4RXhwZXJpZW5jZSA+PSBOdW1iZXIoY2FuZGlFeHBlcmllbmNlWzBdKSkgJiYgKGpvYk1pbkV4cGVyaWVuY2UgPD0gTnVtYmVyKGNhbmRpRXhwZXJpZW5jZVswXSkpKSB7XHJcbiAgICAgIG5ld0NhbmRpZGF0ZS5leHBlcmllbmNlTWF0Y2ggPSAnZXhhY3QnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbmV3Q2FuZGlkYXRlLmV4cGVyaWVuY2VNYXRjaCA9ICdtaXNzaW5nJztcclxuICAgIH1cclxuICAgIGlmICgoam9iTWF4U2FsYXJ5ID49IE51bWJlcihjYW5TYWxhcnlbMF0pKSAmJiAoam9iTWluU2FsYXJ5IDw9IE51bWJlcihjYW5TYWxhcnlbMF0pKSkge1xyXG4gICAgICBuZXdDYW5kaWRhdGUuc2FsYXJ5TWF0Y2ggPSAnZXhhY3QnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbmV3Q2FuZGlkYXRlLnNhbGFyeU1hdGNoID0gJ21pc3NpbmcnO1xyXG4gICAgfVxyXG4gICAgbGV0IGNhbkVkdWNhdGlvbjogbnVtYmVyID0gdGhpcy5nZXRFZHVjdGlvblN3aXRjaENhc2UobmV3Q2FuZGlkYXRlLnByb2Zlc3Npb25hbERldGFpbHMuZWR1Y2F0aW9uKTtcclxuICAgIGxldCBqb2JFZHVjYXRpb246IG51bWJlciA9IHRoaXMuZ2V0RWR1Y3Rpb25Td2l0Y2hDYXNlKGpvYi5lZHVjYXRpb24pO1xyXG4gICAgbmV3Q2FuZGlkYXRlLmVkdWNhdGlvbk1hdGNoID0gdGhpcy5jb21wYXJlVHdvT3B0aW9ucyhjYW5FZHVjYXRpb24sIGpvYkVkdWNhdGlvbik7XHJcbiAgICBuZXdDYW5kaWRhdGUucmVsZWFzZU1hdGNoID0gdGhpcy5jb21wYXJlVHdvT3B0aW9ucyh0aGlzLmdldFBlcmlvZFN3aXRjaENhc2UobmV3Q2FuZGlkYXRlLnByb2Zlc3Npb25hbERldGFpbHMubm90aWNlUGVyaW9kKSwgdGhpcy5nZXRQZXJpb2RTd2l0Y2hDYXNlKGpvYi5qb2luaW5nUGVyaW9kKSk7XHJcbiAgICBuZXdDYW5kaWRhdGUuaW50ZXJlc3RlZEluZHVzdHJ5TWF0Y2ggPSBuZXcgQXJyYXkoMCk7XHJcblxyXG4gICAgaWYoam9iLmNvbXBsZXhpdHlfbXVzdGhhdmVfbWF0cml4ICYmIGpvYi5jb21wbGV4aXR5X211c3RoYXZlX21hdHJpeC5sZW5ndGggPiAwKSB7XHJcbiAgICBmb3IgKGxldCBpc0NvbXBsZXhpdHkgb2Ygam9iLmNvbXBsZXhpdHlfbXVzdGhhdmVfbWF0cml4KSB7XHJcbiAgICAgIGlmIChuZXdDYW5kaWRhdGUuY29tcGxleGl0eV9tdXN0aGF2ZV9tYXRyaXguaW5kZXhPZihpc0NvbXBsZXhpdHkpICE9PSAtMSkge1xyXG4gICAgICAgIG5ld0NhbmRpZGF0ZS5jb21wbGV4aXR5X211c3RoYXZlX21hdHJpeC5wdXNoKGlzQ29tcGxleGl0eSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIH1cclxuICAgIGZvciAobGV0IGluZHVzdHJ5IG9mIGpvYi5pbnRlcmVzdGVkSW5kdXN0cmllcykge1xyXG4gICAgICBpZiAobmV3Q2FuZGlkYXRlLmludGVyZXN0ZWRJbmR1c3RyaWVzLmluZGV4T2YoaW5kdXN0cnkpICE9PSAtMSkge1xyXG4gICAgICAgIG5ld0NhbmRpZGF0ZS5pbnRlcmVzdGVkSW5kdXN0cnlNYXRjaC5wdXNoKGluZHVzdHJ5KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgbmV3Q2FuZGlkYXRlLnByb2ZpY2llbmNpZXNNYXRjaCA9IG5ldyBBcnJheSgwKTtcclxuICAgIGZvciAobGV0IHByb2ZpY2llbmN5IG9mIGpvYi5wcm9maWNpZW5jaWVzKSB7XHJcbiAgICAgIGlmIChuZXdDYW5kaWRhdGUucHJvZmljaWVuY2llcy5pbmRleE9mKHByb2ZpY2llbmN5KSAhPT0gLTEpIHtcclxuICAgICAgICBuZXdDYW5kaWRhdGUucHJvZmljaWVuY2llc01hdGNoLnB1c2gocHJvZmljaWVuY3kpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbmV3Q2FuZGlkYXRlLnByb2ZpY2llbmNpZXNVbk1hdGNoID0gbmV3IEFycmF5KDApO1xyXG4gICAgZm9yIChsZXQgcHJvZmljaWVuY3kgb2Ygam9iLnByb2ZpY2llbmNpZXMpIHtcclxuICAgICAgaWYgKG5ld0NhbmRpZGF0ZS5wcm9maWNpZW5jaWVzTWF0Y2guaW5kZXhPZihwcm9maWNpZW5jeSkgPT0gLTEpIHtcclxuICAgICAgICBuZXdDYW5kaWRhdGUucHJvZmljaWVuY2llc1VuTWF0Y2gucHVzaChwcm9maWNpZW5jeSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuLy8gICAgICAgIGxldCBtYXRjaF9tYXA6IE1hcDxzdHJpbmcsTWF0Y2hWaWV3TW9kZWw+ID0gbmV3IE1hcDxzdHJpbmcsTWF0Y2hWaWV3TW9kZWw+KCk7XHJcbiAgICAvL25ld0NhbmRpZGF0ZS5tYXRjaF9tYXAgPSB7fTtcclxuICAgIG5ld0NhbmRpZGF0ZSA9IHRoaXMuYnVpbGRNdWx0aUNvbXBhcmVDYXBhYmlsaXR5Vmlldyhqb2IsIG5ld0NhbmRpZGF0ZSwgaW5kdXN0cmllcywgaXNDYW5kaWRhdGUpO1xyXG4gICAgbmV3Q2FuZGlkYXRlID0gdGhpcy5idWlsZENvbXBhcmVWaWV3KGpvYiwgbmV3Q2FuZGlkYXRlLCBpbmR1c3RyaWVzLCBpc0NhbmRpZGF0ZSk7XHJcbiAgICBuZXdDYW5kaWRhdGUgPSB0aGlzLmdldEFkZGl0aW9uYWxDYXBhYmlsaXRpZXMoam9iLCBuZXdDYW5kaWRhdGUsIGluZHVzdHJpZXMpO1xyXG5cclxuICAgIHJldHVybiBuZXdDYW5kaWRhdGU7XHJcbiAgfVxyXG5cclxuICBidWlsZENhbmRpZGF0ZU1vZGVsKGNhbmRpZGF0ZTogQ2FuZGlkYXRlTW9kZWwpIHtcclxuICAgIGxldCBwcm9maWxlQ29tcGFyaXNvblJlc3VsdDogUHJvZmlsZUNvbXBhcmlzb25EYXRhTW9kZWwgPSBuZXcgUHJvZmlsZUNvbXBhcmlzb25EYXRhTW9kZWwoKTtcclxuICAgIHByb2ZpbGVDb21wYXJpc29uUmVzdWx0Ll9pZCA9IGNhbmRpZGF0ZS5faWQ7XHJcbiAgICBwcm9maWxlQ29tcGFyaXNvblJlc3VsdC5pbmR1c3RyeU5hbWUgPSBjYW5kaWRhdGUuaW5kdXN0cnkubmFtZTtcclxuICAgIHByb2ZpbGVDb21wYXJpc29uUmVzdWx0LmFib3V0TXlzZWxmID0gY2FuZGlkYXRlLmFib3V0TXlzZWxmO1xyXG4gICAgcHJvZmlsZUNvbXBhcmlzb25SZXN1bHQuYWNhZGVtaWNzID0gY2FuZGlkYXRlLmFjYWRlbWljcztcclxuICAgIHByb2ZpbGVDb21wYXJpc29uUmVzdWx0LnByb2Zlc3Npb25hbERldGFpbHMgPSBjYW5kaWRhdGUucHJvZmVzc2lvbmFsRGV0YWlscztcclxuICAgIHByb2ZpbGVDb21wYXJpc29uUmVzdWx0LmF3YXJkcyA9IGNhbmRpZGF0ZS5hd2FyZHM7XHJcbiAgICBwcm9maWxlQ29tcGFyaXNvblJlc3VsdC5jYXBhYmlsaXR5X21hdHJpeCA9IGNhbmRpZGF0ZS5jYXBhYmlsaXR5X21hdHJpeDtcclxuICAgIHByb2ZpbGVDb21wYXJpc29uUmVzdWx0LmV4cGVyaWVuY2VNYXRjaCA9ICcnO1xyXG4gICAgcHJvZmlsZUNvbXBhcmlzb25SZXN1bHQuY2VydGlmaWNhdGlvbnMgPSBjYW5kaWRhdGUuY2VydGlmaWNhdGlvbnM7XHJcbiAgICBwcm9maWxlQ29tcGFyaXNvblJlc3VsdC5lbXBsb3ltZW50SGlzdG9yeSA9IGNhbmRpZGF0ZS5lbXBsb3ltZW50SGlzdG9yeTtcclxuICAgIHByb2ZpbGVDb21wYXJpc29uUmVzdWx0LmludGVyZXN0ZWRJbmR1c3RyaWVzID0gY2FuZGlkYXRlLmludGVyZXN0ZWRJbmR1c3RyaWVzO1xyXG4gICAgcHJvZmlsZUNvbXBhcmlzb25SZXN1bHQuaXNTdWJtaXR0ZWQgPSBjYW5kaWRhdGUuaXNTdWJtaXR0ZWQ7XHJcbiAgICBwcm9maWxlQ29tcGFyaXNvblJlc3VsdC5pc1Zpc2libGUgPSBjYW5kaWRhdGUuaXNWaXNpYmxlO1xyXG4gICAgcHJvZmlsZUNvbXBhcmlzb25SZXN1bHQubG9jYXRpb24gPSBjYW5kaWRhdGUubG9jYXRpb247XHJcbiAgICBwcm9maWxlQ29tcGFyaXNvblJlc3VsdC5qb2JfbGlzdCA9IGNhbmRpZGF0ZS5qb2JfbGlzdDtcclxuICAgIHByb2ZpbGVDb21wYXJpc29uUmVzdWx0LmVkdWNhdGlvbk1hdGNoID0gJyc7XHJcbiAgICBwcm9maWxlQ29tcGFyaXNvblJlc3VsdC5wcm9maWNpZW5jaWVzID0gY2FuZGlkYXRlLnByb2ZpY2llbmNpZXM7XHJcbiAgICBwcm9maWxlQ29tcGFyaXNvblJlc3VsdC5wcm9maWxlQ29tcGFyaXNvbkhlYWRlciA9IGNhbmRpZGF0ZS51c2VySWQ7XHJcbiAgICBwcm9maWxlQ29tcGFyaXNvblJlc3VsdC5yb2xlVHlwZSA9IGNhbmRpZGF0ZS5yb2xlVHlwZTtcclxuICAgIHByb2ZpbGVDb21wYXJpc29uUmVzdWx0LnNhbGFyeU1hdGNoID0gJyc7XHJcbiAgICBwcm9maWxlQ29tcGFyaXNvblJlc3VsdC5zZWNvbmRhcnlDYXBhYmlsaXR5ID0gY2FuZGlkYXRlLnNlY29uZGFyeUNhcGFiaWxpdHk7XHJcbiAgICBwcm9maWxlQ29tcGFyaXNvblJlc3VsdC5sb2NrZWRPbiA9IGNhbmRpZGF0ZS5sb2NrZWRPbjtcclxuICAgIHByb2ZpbGVDb21wYXJpc29uUmVzdWx0Lm1hdGNoX21hcCA9IHt9O1xyXG4gICAgcHJvZmlsZUNvbXBhcmlzb25SZXN1bHQuY2FwYWJpbGl0eU1hcCA9IHt9O1xyXG4gICAgcHJvZmlsZUNvbXBhcmlzb25SZXN1bHQuY29tcGxleGl0eV9ub3RlX21hdHJpeCA9IGNhbmRpZGF0ZS5jb21wbGV4aXR5X25vdGVfbWF0cml4O1xyXG4gICAgcmV0dXJuIHByb2ZpbGVDb21wYXJpc29uUmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgYnVpbGRNdWx0aUNvbXBhcmVDYXBhYmlsaXR5Vmlldyhqb2I6YW55LCBuZXdDYW5kaWRhdGU6UHJvZmlsZUNvbXBhcmlzb25EYXRhTW9kZWwsIGluZHVzdHJpZXM6YW55LCBpc0NhbmRpZGF0ZTphbnkpIHtcclxuICAgIHZhciBjYXBhYmlsaXR5UGVyY2VudGFnZTpudW1iZXJbXSA9IG5ldyBBcnJheSgwKTtcclxuICAgIHZhciBjYXBhYmlsaXR5S2V5czpzdHJpbmdbXSA9IG5ldyBBcnJheSgwKTtcclxuICAgIHZhciBjb3JyZWN0UWVzdGlvbkNvdW50Rm9yQXZnUGVyY2VudGFnZTpudW1iZXIgPSAwO1xyXG4gICAgdmFyIHFlc3Rpb25Db3VudEZvckF2Z1BlcmNlbnRzZ2U6bnVtYmVyID0gMDtcclxuICAgIGZvciAobGV0IGNhcCBpbiBqb2IuY2FwYWJpbGl0eV9tYXRyaXgpIHtcclxuXHJcbiAgICAgIHZhciBjYXBhYmlsaXR5S2V5ID0gY2FwLnNwbGl0KCdfJyk7XHJcbiAgICAgIGlmIChjYXBhYmlsaXR5S2V5cy5pbmRleE9mKGNhcGFiaWxpdHlLZXlbMF0pID09IC0xKSB7XHJcbiAgICAgICAgY2FwYWJpbGl0eUtleXMucHVzaChjYXBhYmlsaXR5S2V5WzBdKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy9mb3IobGV0IF9jYXAgaW4gY2FwYmlsaXR5S2V5cykge1xyXG4gICAgZm9yIChsZXQgX2NhcCBvZiBjYXBhYmlsaXR5S2V5cykge1xyXG4gICAgICBsZXQgaXNDYXBhYmlsaXR5Rm91bmQgOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgIHZhciBjYXBhYmlsaXR5UXVlc3Rpb25Db3VudDpudW1iZXIgPSAwO1xyXG4gICAgICB2YXIgbWF0Y2hDb3VudDpudW1iZXIgPSAwO1xyXG4gICAgICBmb3IgKGxldCBjYXAgaW4gam9iLmNhcGFiaWxpdHlfbWF0cml4KSB7XHJcbiAgICAgICAgLy9jYWxjdWxhdGUgdG90YWwgbnVtYmVyIG9mIHF1ZXN0aW9ucyBpbiBjYXBhYmlsaXR5XHJcblxyXG4gICAgICAgIGlmIChfY2FwID09IGNhcC5zcGxpdCgnXycpWzBdKSB7XHJcbiAgICAgICAgICBpZiAoam9iLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0gPT0gLTEgfHwgam9iLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0gPT0gMCB8fCBqb2IuY2FwYWJpbGl0eV9tYXRyaXhbY2FwXSA9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgLy9tYXRjaF92aWV3Lm1hdGNoID0gTWF0Y2guTWlzc01hdGNoO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChqb2IuY2FwYWJpbGl0eV9tYXRyaXhbY2FwXSA9PSBuZXdDYW5kaWRhdGUuY2FwYWJpbGl0eV9tYXRyaXhbY2FwXSkge1xyXG4gICAgICAgICAgICBtYXRjaENvdW50Kys7XHJcbiAgICAgICAgICAgIGNhcGFiaWxpdHlRdWVzdGlvbkNvdW50Kys7XHJcbiAgICAgICAgICAgIGNvcnJlY3RRZXN0aW9uQ291bnRGb3JBdmdQZXJjZW50YWdlKys7XHJcbiAgICAgICAgICAgIHFlc3Rpb25Db3VudEZvckF2Z1BlcmNlbnRzZ2UrKztcclxuICAgICAgICAgICAgLy9tYXRjaF92aWV3Lm1hdGNoID0gTWF0Y2guRXhhY3Q7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKGpvYi5jYXBhYmlsaXR5X21hdHJpeFtjYXBdID09IChOdW1iZXIobmV3Q2FuZGlkYXRlLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0pIC0gQ29uc3RWYXJpYWJsZXMuRElGRkVSRU5DRV9JTl9DT01QTEVYSVRZX1NDRU5BUklPKSkge1xyXG4gICAgICAgICAgICBtYXRjaENvdW50Kys7XHJcbiAgICAgICAgICAgIGNhcGFiaWxpdHlRdWVzdGlvbkNvdW50Kys7XHJcbiAgICAgICAgICAgIGNvcnJlY3RRZXN0aW9uQ291bnRGb3JBdmdQZXJjZW50YWdlKys7XHJcbiAgICAgICAgICAgIHFlc3Rpb25Db3VudEZvckF2Z1BlcmNlbnRzZ2UrKztcclxuICAgICAgICAgICAgLy9tYXRjaF92aWV3Lm1hdGNoID0gTWF0Y2guQWJvdmU7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKGpvYi5jYXBhYmlsaXR5X21hdHJpeFtjYXBdID09IChOdW1iZXIobmV3Q2FuZGlkYXRlLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0pICsgQ29uc3RWYXJpYWJsZXMuRElGRkVSRU5DRV9JTl9DT01QTEVYSVRZX1NDRU5BUklPKSkge1xyXG4gICAgICAgICAgICAvL21hdGNoX3ZpZXcubWF0Y2ggPSBNYXRjaC5CZWxvdztcclxuICAgICAgICAgICAgY2FwYWJpbGl0eVF1ZXN0aW9uQ291bnQrKztcclxuICAgICAgICAgICAgcWVzdGlvbkNvdW50Rm9yQXZnUGVyY2VudHNnZSsrO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY2FwYWJpbGl0eVF1ZXN0aW9uQ291bnQrKztcclxuICAgICAgICAgICAgcWVzdGlvbkNvdW50Rm9yQXZnUGVyY2VudHNnZSsrO1xyXG4gICAgICAgICAgICAvL21hdGNoX3ZpZXcubWF0Y2ggPSBNYXRjaC5NaXNzTWF0Y2g7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHZhciBjYXBhYmlsaXR5TW9kZWwgPSBuZXcgQ2FwYWJpbGl0eU1hdHJpeE1vZGVsKCk7XHJcbiAgICAgIHZhciBjYXBOYW1lOnN0cmluZztcclxuICAgICAgdmFyIGNvbXBsZXhpdHk6YW55O1xyXG4gICAgICBmb3IgKGxldCByb2xlIG9mIGluZHVzdHJpZXNbMF0ucm9sZXMpIHtcclxuICAgICAgICBmb3IgKGxldCBjYXBhYmlsaXR5IG9mIHJvbGUuY2FwYWJpbGl0aWVzKSB7XHJcbiAgICAgICAgICBpZiAoX2NhcCA9PSBjYXBhYmlsaXR5LmNvZGUpIHtcclxuICAgICAgICAgICAgaXNDYXBhYmlsaXR5Rm91bmQ9dHJ1ZTtcclxuICAgICAgICAgICAgY2FwTmFtZSA9IGNhcGFiaWxpdHkubmFtZTtcclxuICAgICAgICAgICAgY29tcGxleGl0eSA9IGNhcGFiaWxpdHkuY29tcGxleGl0aWVzO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChsZXQgY2FwYWJpbGl0eSBvZiByb2xlLmRlZmF1bHRfY29tcGxleGl0aWVzKSB7XHJcbiAgICAgICAgICBpZiAoX2NhcCA9PSBjYXBhYmlsaXR5LmNvZGUpIHtcclxuICAgICAgICAgICAgaXNDYXBhYmlsaXR5Rm91bmQ9dHJ1ZTtcclxuICAgICAgICAgICAgY2FwTmFtZSA9IGNhcGFiaWxpdHkubmFtZTtcclxuICAgICAgICAgICAgY29tcGxleGl0eSA9IGNhcGFiaWxpdHkuY29tcGxleGl0aWVzO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgdmFyIHBlcmNlbnRhZ2U6bnVtYmVyID0gMDtcclxuICAgICAgaWYgKGNhcGFiaWxpdHlRdWVzdGlvbkNvdW50KSB7XHJcbiAgICAgICAgcGVyY2VudGFnZSA9IChtYXRjaENvdW50IC8gY2FwYWJpbGl0eVF1ZXN0aW9uQ291bnQpICogMTAwO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjYXBhYmlsaXR5TW9kZWwuY2FwYWJpbGl0eU5hbWUgPSBjYXBOYW1lO1xyXG4gICAgICBjYXBhYmlsaXR5TW9kZWwuY2FwYWJpbGl0eVBlcmNlbnRhZ2UgPSBwZXJjZW50YWdlO1xyXG4gICAgICBjYXBhYmlsaXR5TW9kZWwuY29tcGxleGl0aWVzID0gY29tcGxleGl0eTtcclxuICAgICAgY2FwYWJpbGl0eVBlcmNlbnRhZ2UucHVzaChwZXJjZW50YWdlKTtcclxuICAgICAgaWYoaXNDYXBhYmlsaXR5Rm91bmQpe1xyXG4gICAgICAgIG5ld0NhbmRpZGF0ZVsnY2FwYWJpbGl0eU1hcCddW19jYXBdID0gY2FwYWJpbGl0eU1vZGVsO1xyXG4gICAgICB9XHJcbiAgICAgIC8vfVxyXG4gICAgfVxyXG4gICAgdmFyIGF2Z1BlcmNlbnRhZ2U6bnVtYmVyID0gMDtcclxuICAgIGlmIChxZXN0aW9uQ291bnRGb3JBdmdQZXJjZW50c2dlKSB7XHJcbiAgICAgIGF2Z1BlcmNlbnRhZ2UgPSAoKGNvcnJlY3RRZXN0aW9uQ291bnRGb3JBdmdQZXJjZW50YWdlIC8gcWVzdGlvbkNvdW50Rm9yQXZnUGVyY2VudHNnZSkgKiAxMDApO1xyXG4gICAgfVxyXG4gICAgbmV3Q2FuZGlkYXRlLm1hdGNoaW5nUGVyY2VudGFnZSA9IGF2Z1BlcmNlbnRhZ2U7XHJcbiAgICByZXR1cm4gbmV3Q2FuZGlkYXRlO1xyXG4gIH1cclxuXHJcbiAgZ2V0QWRkaXRpb25hbENhcGFiaWxpdGllcyhqb2IgOiBhbnksIG5ld0NhbmRpZGF0ZSA6IGFueSAsIGluZHVzdHJpZXMgOiBhbnkpIDogYW55IHtcclxuICAgIG5ld0NhbmRpZGF0ZS5hZGRpdGlvbmFsQ2FwYWJpbGl0ZXMgPSBuZXcgQXJyYXkoMCk7XHJcbiAgICBmb3IgKGxldCBjYXAgaW4gbmV3Q2FuZGlkYXRlLmNhcGFiaWxpdHlfbWF0cml4KSB7XHJcbiAgICAgICAgbGV0IGlzRm91bmQ6IGJvb2xlYW49IGZhbHNlO1xyXG4gICAgICAgIGZvcihsZXQgam9iQ2FwIGluIGpvYi5jYXBhYmlsaXR5X21hdHJpeCkge1xyXG4gICAgICAgICAgICBpZihjYXAuc3Vic3RyKDAsY2FwLmluZGV4T2YoJ18nKSkgPT09IGpvYkNhcC5zdWJzdHIoMCxqb2JDYXAuaW5kZXhPZignXycpKSkge1xyXG4gICAgICAgICAgICAgIGlzRm91bmQ9dHJ1ZTtcclxuICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZighaXNGb3VuZCkge1xyXG4gICAgICAgICAgZm9yIChsZXQgcm9sZSBvZiBpbmR1c3RyaWVzWzBdLnJvbGVzKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGNhcGFiaWxpdHkgb2Ygcm9sZS5jYXBhYmlsaXRpZXMpIHtcclxuICAgICAgICAgICAgICBmb3IgKGxldCBjb21wbGV4aXR5IG9mIGNhcGFiaWxpdHkuY29tcGxleGl0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY3VzdG9tX2NvZGUgPSBjYXBhYmlsaXR5LmNvZGUgKyAnXycgKyBjb21wbGV4aXR5LmNvZGU7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3VzdG9tX2NvZGUgPT09IGNhcCkge1xyXG4gICAgICAgICAgICAgICAgICBpZihuZXdDYW5kaWRhdGUuYWRkaXRpb25hbENhcGFiaWxpdGVzLmluZGV4T2YoY2FwYWJpbGl0eS5uYW1lKSA9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld0NhbmRpZGF0ZS5hZGRpdGlvbmFsQ2FwYWJpbGl0ZXMucHVzaChjYXBhYmlsaXR5Lm5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgICAgcmV0dXJuIG5ld0NhbmRpZGF0ZTtcclxuICB9XHJcblxyXG4gIGJ1aWxkQ29tcGFyZVZpZXcoam9iIDogYW55LCBuZXdDYW5kaWRhdGUgOiBhbnkgLCBpbmR1c3RyaWVzIDogYW55LCBpc0NhbmRpZGF0ZSA6IGJvb2xlYW4pIDogYW55IHtcclxuXHJcbiAgICBmb3IgKGxldCBjYXAgaW4gam9iLmNhcGFiaWxpdHlfbWF0cml4KSB7XHJcbiAgICAgIGxldCBtYXRjaF92aWV3OiBNYXRjaFZpZXdNb2RlbCA9IG5ldyBNYXRjaFZpZXdNb2RlbCgpO1xyXG4gICAgICBpZiAoam9iLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0gPT0gLTEgfHwgam9iLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0gPT0gMCB8fCBqb2IuY2FwYWJpbGl0eV9tYXRyaXhbY2FwXSA9PSB1bmRlZmluZWQgfHwgbmV3Q2FuZGlkYXRlLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0gPT0gdW5kZWZpbmVkIHx8XHJcbiAgICAgICAgbmV3Q2FuZGlkYXRlLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0gPT0gMCB8fCBuZXdDYW5kaWRhdGUuY2FwYWJpbGl0eV9tYXRyaXhbY2FwXSA9PSAtMSkge1xyXG4gICAgICAgIG1hdGNoX3ZpZXcubWF0Y2ggPSBNYXRjaC5NaXNzTWF0Y2g7XHJcbiAgICAgIH0gZWxzZSBpZiAoam9iLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0gPT0gbmV3Q2FuZGlkYXRlLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0pIHtcclxuICAgICAgICBtYXRjaF92aWV3Lm1hdGNoID0gTWF0Y2guRXhhY3Q7XHJcbiAgICAgIH0gZWxzZSBpZiAoam9iLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0gPT0gKE51bWJlcihuZXdDYW5kaWRhdGUuY2FwYWJpbGl0eV9tYXRyaXhbY2FwXSkgLSBDb25zdFZhcmlhYmxlcy5ESUZGRVJFTkNFX0lOX0NPTVBMRVhJVFlfU0NFTkFSSU8pKSB7XHJcbiAgICAgICAgbWF0Y2hfdmlldy5tYXRjaCA9IE1hdGNoLkFib3ZlO1xyXG4gICAgICB9IGVsc2UgaWYgKGpvYi5jYXBhYmlsaXR5X21hdHJpeFtjYXBdID09IChOdW1iZXIobmV3Q2FuZGlkYXRlLmNhcGFiaWxpdHlfbWF0cml4W2NhcF0pICsgQ29uc3RWYXJpYWJsZXMuRElGRkVSRU5DRV9JTl9DT01QTEVYSVRZX1NDRU5BUklPKSkge1xyXG4gICAgICAgIG1hdGNoX3ZpZXcubWF0Y2ggPSBNYXRjaC5CZWxvdztcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBtYXRjaF92aWV3Lm1hdGNoID0gTWF0Y2guTWlzc01hdGNoO1xyXG4gICAgICB9XHJcbiAgICAgIGxldCBpc0ZvdW5kOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgIGZvciAobGV0IHJvbGUgb2YgaW5kdXN0cmllc1swXS5yb2xlcykge1xyXG4gICAgICAgIGZvciAobGV0IGNhcGFiaWxpdHkgb2Ygcm9sZS5jYXBhYmlsaXRpZXMpIHtcclxuICAgICAgICAgIGZvciAobGV0IGNvbXBsZXhpdHkgb2YgY2FwYWJpbGl0eS5jb21wbGV4aXRpZXMpIHtcclxuICAgICAgICAgICAgbGV0IGN1c3RvbV9jb2RlID0gY2FwYWJpbGl0eS5jb2RlICsgJ18nICsgY29tcGxleGl0eS5jb2RlO1xyXG4gICAgICAgICAgICBpZiAoY3VzdG9tX2NvZGUgPT09IGNhcCkge1xyXG4gICAgICAgICAgICAgIGlzRm91bmQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgIGxldCBzY2VuYXJpb3MgPSBjb21wbGV4aXR5LnNjZW5hcmlvcy5maWx0ZXIoKHNjZTogU2NlbmFyaW9Nb2RlbCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgc2NlLmNvZGUgPXNjZS5jb2RlLnJlcGxhY2UoJy4nLCdfJyk7XHJcbiAgICAgICAgICAgICAgICBzY2UuY29kZSA9c2NlLmNvZGUucmVwbGFjZSgnLicsJ18nKTtcclxuICAgICAgICAgICAgICAgIHNjZS5jb2RlID0gc2NlLmNvZGUuc3Vic3RyKHNjZS5jb2RlLmxhc3RJbmRleE9mKCdfJykrMSk7XHJcbiAgICAgICAgICAgICAgICBpZihzY2UuY29kZSA9PSBuZXdDYW5kaWRhdGUuY2FwYWJpbGl0eV9tYXRyaXhbY2FwXSkgIHtcclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICBsZXQgam9iX3NjZW5hcmlvcyA9IGNvbXBsZXhpdHkuc2NlbmFyaW9zLmZpbHRlcigoc2NlOiBTY2VuYXJpb01vZGVsKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzY2UuY29kZSA9c2NlLmNvZGUucmVwbGFjZSgnLicsJ18nKTtcclxuICAgICAgICAgICAgICAgIHNjZS5jb2RlID1zY2UuY29kZS5yZXBsYWNlKCcuJywnXycpO1xyXG4gICAgICAgICAgICAgICAgc2NlLmNvZGUgPSBzY2UuY29kZS5zdWJzdHIoc2NlLmNvZGUubGFzdEluZGV4T2YoJ18nKSsxKTtcclxuICAgICAgICAgICAgICAgIGlmKHNjZS5jb2RlID09IGpvYi5jYXBhYmlsaXR5X21hdHJpeFtjYXBdKSAge1xyXG4gICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIG1hdGNoX3ZpZXcuY2FwYWJpbGl0eV9uYW1lID0gY2FwYWJpbGl0eS5uYW1lO1xyXG4gICAgICAgICAgICAgIG1hdGNoX3ZpZXcuY29tcGxleGl0eV9uYW1lID0gY29tcGxleGl0eS5uYW1lO1xyXG4gICAgICAgICAgICAgIGlmKG5ld0NhbmRpZGF0ZS5jb21wbGV4aXR5X25vdGVfbWF0cml4ICYmIG5ld0NhbmRpZGF0ZS5jb21wbGV4aXR5X25vdGVfbWF0cml4W2NhcF0pIHtcclxuICAgICAgICAgICAgICAgIG1hdGNoX3ZpZXcuY29tcGxleGl0eU5vdGUgPSBuZXdDYW5kaWRhdGUuY29tcGxleGl0eV9ub3RlX21hdHJpeFtjYXBdO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBpZihqb2Jfc2NlbmFyaW9zWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBtYXRjaF92aWV3LmpvYl9zY2VuYXJpb19uYW1lPSBqb2Jfc2NlbmFyaW9zWzBdLm5hbWU7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIGlmKHNjZW5hcmlvc1swXSkge1xyXG4gICAgICAgICAgICAgICAgbWF0Y2hfdmlldy5jYW5kaWRhdGVfc2NlbmFyaW9fbmFtZT1zY2VuYXJpb3NbMF0ubmFtZTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBtYXRjaF92aWV3LnNjZW5hcmlvX25hbWUgPSBtYXRjaF92aWV3LmpvYl9zY2VuYXJpb19uYW1lO1xyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZihpc0ZvdW5kKSB7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGxldCBjYXBhYmlsaXR5IG9mIHJvbGUuZGVmYXVsdF9jb21wbGV4aXRpZXMpIHtcclxuICAgICAgICAgIGZvciAobGV0IGNvbXBsZXhpdHkgb2YgY2FwYWJpbGl0eS5jb21wbGV4aXRpZXMpIHtcclxuICAgICAgICAgICAgbGV0IGN1c3RvbV9jb2RlID0gY2FwYWJpbGl0eS5jb2RlICsgJ18nICsgY29tcGxleGl0eS5jb2RlO1xyXG4gICAgICAgICAgICBpZiAoY3VzdG9tX2NvZGUgPT09IGNhcCkge1xyXG4gICAgICAgICAgICAgIGlzRm91bmQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgIGxldCBzY2VuYXJpb3MgPSBjb21wbGV4aXR5LnNjZW5hcmlvcy5maWx0ZXIoKHNjZTogU2NlbmFyaW9Nb2RlbCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgc2NlLmNvZGUgPXNjZS5jb2RlLnJlcGxhY2UoJy4nLCdfJyk7XHJcbiAgICAgICAgICAgICAgICBzY2UuY29kZSA9c2NlLmNvZGUucmVwbGFjZSgnLicsJ18nKTtcclxuICAgICAgICAgICAgICAgIHNjZS5jb2RlID0gc2NlLmNvZGUuc3Vic3RyKHNjZS5jb2RlLmxhc3RJbmRleE9mKCdfJykrMSk7XHJcbiAgICAgICAgICAgICAgICBpZihzY2UuY29kZSA9PSBuZXdDYW5kaWRhdGUuY2FwYWJpbGl0eV9tYXRyaXhbY2FwXSkgIHtcclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICBsZXQgam9iX3NjZW5hcmlvcyA9IGNvbXBsZXhpdHkuc2NlbmFyaW9zLmZpbHRlcigoc2NlOiBTY2VuYXJpb01vZGVsKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzY2UuY29kZSA9c2NlLmNvZGUucmVwbGFjZSgnLicsJ18nKTtcclxuICAgICAgICAgICAgICAgIHNjZS5jb2RlID1zY2UuY29kZS5yZXBsYWNlKCcuJywnXycpO1xyXG4gICAgICAgICAgICAgICAgc2NlLmNvZGUgPSBzY2UuY29kZS5zdWJzdHIoc2NlLmNvZGUubGFzdEluZGV4T2YoJ18nKSsxKTtcclxuICAgICAgICAgICAgICAgIGlmKHNjZS5jb2RlID09IGpvYi5jYXBhYmlsaXR5X21hdHJpeFtjYXBdKSAge1xyXG4gICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIG1hdGNoX3ZpZXcuY2FwYWJpbGl0eV9uYW1lID0gY2FwYWJpbGl0eS5uYW1lO1xyXG4gICAgICAgICAgICAgIG1hdGNoX3ZpZXcuY29tcGxleGl0eV9uYW1lID0gY29tcGxleGl0eS5uYW1lO1xyXG4gICAgICAgICAgICAgIGlmKG5ld0NhbmRpZGF0ZS5jb21wbGV4aXR5X25vdGVfbWF0cml4ICYmIG5ld0NhbmRpZGF0ZS5jb21wbGV4aXR5X25vdGVfbWF0cml4W2NhcF0pIHtcclxuICAgICAgICAgICAgICAgIG1hdGNoX3ZpZXcuY29tcGxleGl0eU5vdGUgPSBuZXdDYW5kaWRhdGUuY29tcGxleGl0eV9ub3RlX21hdHJpeFtjYXBdO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBpZihqb2IuY29tcGxleGl0eV9tdXN0aGF2ZV9tYXRyaXggJiYgam9iLmNvbXBsZXhpdHlfbXVzdGhhdmVfbWF0cml4W2NhcF0pIHtcclxuICAgICAgICAgICAgICAgIG1hdGNoX3ZpZXcuY29tcGxleGl0eUlzTXVzdEhhdmUgPSBqb2IuY29tcGxleGl0eV9tdXN0aGF2ZV9tYXRyaXhbY2FwXTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgaWYoam9iX3NjZW5hcmlvc1swXSl7XHJcbiAgICAgICAgICAgICAgICBtYXRjaF92aWV3LmpvYl9zY2VuYXJpb19uYW1lPWpvYl9zY2VuYXJpb3NbMF0ubmFtZTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgaWYoc2NlbmFyaW9zWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBtYXRjaF92aWV3LmNhbmRpZGF0ZV9zY2VuYXJpb19uYW1lPXNjZW5hcmlvc1swXS5uYW1lO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIG1hdGNoX3ZpZXcuc2NlbmFyaW9fbmFtZSA9IG1hdGNoX3ZpZXcuam9iX3NjZW5hcmlvX25hbWU7XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmKGlzRm91bmQpIHtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpc0ZvdW5kKSB7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgaWYgKG1hdGNoX3ZpZXcuY2FwYWJpbGl0eV9uYW1lICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIG5ld0NhbmRpZGF0ZVsnbWF0Y2hfbWFwJ11bY2FwXSA9IG1hdGNoX3ZpZXc7XHJcbiAgICAgIH1cclxuXHJcbiAgICB9XHJcbiAgICByZXR1cm4gbmV3Q2FuZGlkYXRlO1xyXG4gIH1cclxuXHJcbiAgZ2V0TXVsdGlDb21wYXJlUmVzdWx0KGNhbmRpZGF0ZTogYW55LCBqb2JJZDogc3RyaW5nLCByZWNydWl0ZXJJZDphbnksIGlzQ2FuZGlkYXRlOiBib29sZWFuLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcblxyXG4gICAgdGhpcy5jYW5kaWRhdGVSZXBvc2l0b3J5LnJldHJpZXZlQnlNdWx0aUlkc0FuZFBvcHVsYXRlKGNhbmRpZGF0ZSwge30sIChlcnI6IGFueSwgY2FuZGlkYXRlUmVzOiBhbnkpID0+IHtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKGNhbmRpZGF0ZVJlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICBsZXQgZGF0YSA9IHtcclxuICAgICAgICAgICAgJ3Bvc3RlZEpvYic6IGpvYklkXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgICAgbGV0IGpvYlByb2ZpbGVTZXJ2aWNlOiBKb2JQcm9maWxlU2VydmljZSA9IG5ldyBKb2JQcm9maWxlU2VydmljZSgpO1xyXG4gICAgICAgICAgam9iUHJvZmlsZVNlcnZpY2UucmV0cmlldmUoZGF0YSwgKGVyckluSm9iLCByZXNPZlJlY3J1aXRlcikgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJySW5Kb2IpIHtcclxuICAgICAgICAgICAgICBjYWxsYmFjayhlcnJJbkpvYiwgbnVsbCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgdmFyIGpvYk5hbWUgPSByZXNPZlJlY3J1aXRlci5wb3N0ZWRKb2JzWzBdLmluZHVzdHJ5Lm5hbWU7XHJcbiAgICAgICAgICAgICAgdmFyIGpvYiA9IHJlc09mUmVjcnVpdGVyLnBvc3RlZEpvYnNbMF07XHJcbiAgICAgICAgICAgICAgdGhpcy5pbmR1c3RyeVJlcG9zaXRvcnkucmV0cmlldmUoeyduYW1lJzogam9iTmFtZX0sIChlcnI6IGFueSwgaW5kdXN0cmllczogSW5kdXN0cnlNb2RlbFtdKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICB2YXIgY29tcGFyZVJlc3VsdDogUHJvZmlsZUNvbXBhcmlzb25EYXRhTW9kZWxbXSA9IG5ldyBBcnJheSgwKTtcclxuICAgICAgICAgICAgICAgICAgZm9yIChsZXQgY2FuZGlkYXRlIG9mIGNhbmRpZGF0ZVJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXdDYW5kaWRhdGUgPSB0aGlzLmdldENvbXBhcmVEYXRhKGNhbmRpZGF0ZSwgam9iLCBpc0NhbmRpZGF0ZSwgaW5kdXN0cmllcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0NhbmRpZGF0ZSA9IHRoaXMuZ2V0TGlzdFN0YXR1c09mQ2FuZGlkYXRlKG5ld0NhbmRpZGF0ZSxqb2IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdDYW5kaWRhdGUgPSB0aGlzLnNvcnRDYW5kaWRhdGVTa2lsbHMobmV3Q2FuZGlkYXRlKTtcclxuICAgICAgICAgICAgICAgICAgICBjb21wYXJlUmVzdWx0LnB1c2gobmV3Q2FuZGlkYXRlKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICBsZXQgcHJvZmlsZUNvbXBhcmlzb25Nb2RlbDpQcm9maWxlQ29tcGFyaXNvbk1vZGVsID0gbmV3IFByb2ZpbGVDb21wYXJpc29uTW9kZWwoKTtcclxuICAgICAgICAgICAgICAgICAgcHJvZmlsZUNvbXBhcmlzb25Nb2RlbC5wcm9maWxlQ29tcGFyaXNvbkRhdGEgPSBjb21wYXJlUmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgICB2YXIgam9iRGV0YWlsczpQcm9maWxlQ29tcGFyaXNvbkpvYk1vZGVsID0gdGhpcy5nZXRKb2JEZXRhaWxzRm9yQ29tcGFyaXNvbihqb2IpO1xyXG4gICAgICAgICAgICAgICAgICBwcm9maWxlQ29tcGFyaXNvbk1vZGVsLnByb2ZpbGVDb21wYXJpc29uSm9iRGF0YSA9IGpvYkRldGFpbHM7XHJcbiAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHByb2ZpbGVDb21wYXJpc29uTW9kZWwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY2FsbGJhY2sobnVsbCwgJ05vIENhbmRpZGF0ZSBQcm9maWxlIFJlc3VsdCBGb3VuZCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRKb2JEZXRhaWxzRm9yQ29tcGFyaXNvbihqb2I6Sm9iUHJvZmlsZU1vZGVsKSB7XHJcbiAgICB2YXIgcHJvZmlsZUNvbXBhcmlzb25Kb2JNb2RlbDpQcm9maWxlQ29tcGFyaXNvbkpvYk1vZGVsID0gbmV3IFByb2ZpbGVDb21wYXJpc29uSm9iTW9kZWwoKTtcclxuICAgIHByb2ZpbGVDb21wYXJpc29uSm9iTW9kZWwuY2l0eSA9IGpvYi5sb2NhdGlvbi5jaXR5O1xyXG4gICAgcHJvZmlsZUNvbXBhcmlzb25Kb2JNb2RlbC5jb3VudHJ5ID0gam9iLmxvY2F0aW9uLmNvdW50cnk7XHJcbiAgICBwcm9maWxlQ29tcGFyaXNvbkpvYk1vZGVsLnN0YXRlID0gam9iLmxvY2F0aW9uLnN0YXRlO1xyXG4gICAgcHJvZmlsZUNvbXBhcmlzb25Kb2JNb2RlbC5lZHVjYXRpb24gPSBqb2IuZWR1Y2F0aW9uO1xyXG4gICAgcHJvZmlsZUNvbXBhcmlzb25Kb2JNb2RlbC5leHBlcmllbmNlTWF4VmFsdWUgPSBqb2IuZXhwZXJpZW5jZU1heFZhbHVlO1xyXG4gICAgcHJvZmlsZUNvbXBhcmlzb25Kb2JNb2RlbC5leHBlcmllbmNlTWluVmFsdWUgPSBqb2IuZXhwZXJpZW5jZU1pblZhbHVlO1xyXG4gICAgcHJvZmlsZUNvbXBhcmlzb25Kb2JNb2RlbC5pbmR1c3RyeU5hbWUgPSBqb2IuaW5kdXN0cnkubmFtZTtcclxuICAgIHByb2ZpbGVDb21wYXJpc29uSm9iTW9kZWwuam9iVGl0bGUgPSBqb2Iuam9iVGl0bGU7XHJcbiAgICBwcm9maWxlQ29tcGFyaXNvbkpvYk1vZGVsLmpvaW5pbmdQZXJpb2QgPSBqb2Iuam9pbmluZ1BlcmlvZDtcclxuICAgIHByb2ZpbGVDb21wYXJpc29uSm9iTW9kZWwuc2FsYXJ5TWF4VmFsdWUgPSBqb2Iuc2FsYXJ5TWF4VmFsdWU7XHJcbiAgICBwcm9maWxlQ29tcGFyaXNvbkpvYk1vZGVsLnNhbGFyeU1pblZhbHVlID0gam9iLnNhbGFyeU1pblZhbHVlO1xyXG4gICAgcHJvZmlsZUNvbXBhcmlzb25Kb2JNb2RlbC5wcm9maWNpZW5jaWVzID0gam9iLnByb2ZpY2llbmNpZXM7XHJcbiAgICBwcm9maWxlQ29tcGFyaXNvbkpvYk1vZGVsLmludGVyZXN0ZWRJbmR1c3RyaWVzID0gam9iLmludGVyZXN0ZWRJbmR1c3RyaWVzO1xyXG4gICAgcmV0dXJuIHByb2ZpbGVDb21wYXJpc29uSm9iTW9kZWw7XHJcbiAgfVxyXG4gIGdldExpc3RTdGF0dXNPZkNhbmRpZGF0ZShuZXdDYW5kaWRhdGU6UHJvZmlsZUNvbXBhcmlzb25EYXRhTW9kZWwsam9iUHJvZmlsZTpKb2JQcm9maWxlTW9kZWwpIHtcclxuICAgIHZhciBjYW5kaWRhdGVMaXN0U3RhdHVzOnN0cmluZ1tdID0gbmV3IEFycmF5KDApO1xyXG4gICAgZm9yKGxldCBsaXN0IG9mIGpvYlByb2ZpbGUuY2FuZGlkYXRlX2xpc3QpIHtcclxuICAgICAgZm9yKGxldCBpZCBvZiBsaXN0Lmlkcykge1xyXG4gICAgICAgICBpZihuZXdDYW5kaWRhdGUuX2lkID09IGlkKSB7XHJcbiAgICAgICAgICAgY2FuZGlkYXRlTGlzdFN0YXR1cy5wdXNoKGxpc3QubmFtZSk7XHJcbiAgICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYoY2FuZGlkYXRlTGlzdFN0YXR1cy5sZW5ndGggPT0gMCkge1xyXG4gICAgICBjYW5kaWRhdGVMaXN0U3RhdHVzLnB1c2goJ21hdGNoZWRMaXN0Jyk7XHJcbiAgICB9XHJcbiAgICBuZXdDYW5kaWRhdGUuY2FuZGlkYXRlTGlzdFN0YXR1cyA9IGNhbmRpZGF0ZUxpc3RTdGF0dXM7XHJcbiAgICByZXR1cm4gbmV3Q2FuZGlkYXRlO1xyXG4gIH1cclxuXHJcbiAgc29ydENhbmRpZGF0ZVNraWxscyhuZXdDYW5kaWRhdGU6UHJvZmlsZUNvbXBhcmlzb25EYXRhTW9kZWwpIHtcclxuXHJcbiAgICB2YXIgc2tpbGxTdGF0dXNEYXRhOlNraWxsU3RhdHVzW10gPSBuZXcgQXJyYXkoMCk7XHJcbiAgICBmb3IobGV0IHZhbHVlIG9mIG5ld0NhbmRpZGF0ZS5wcm9maWNpZW5jaWVzTWF0Y2gpIHtcclxuICAgICAgdmFyIHNraWxsU3RhdHVzOlNraWxsU3RhdHVzID0gbmV3IFNraWxsU3RhdHVzKCk7XHJcbiAgICAgIHNraWxsU3RhdHVzLm5hbWUgPSB2YWx1ZTtcclxuICAgICAgc2tpbGxTdGF0dXMuc3RhdHVzID0gJ01hdGNoJztcclxuICAgICAgc2tpbGxTdGF0dXNEYXRhLnB1c2goc2tpbGxTdGF0dXMpO1xyXG4gICAgfVxyXG4gICAgZm9yKGxldCB2YWx1ZSBvZiBuZXdDYW5kaWRhdGUucHJvZmljaWVuY2llc1VuTWF0Y2gpIHtcclxuICAgICAgdmFyIHNraWxsU3RhdHVzOlNraWxsU3RhdHVzID0gbmV3IFNraWxsU3RhdHVzKCk7XHJcbiAgICAgIHNraWxsU3RhdHVzLm5hbWUgPSB2YWx1ZTtcclxuICAgICAgc2tpbGxTdGF0dXMuc3RhdHVzID0gJ1VuTWF0Y2gnO1xyXG4gICAgICBza2lsbFN0YXR1c0RhdGEucHVzaChza2lsbFN0YXR1cyk7XHJcbiAgICB9XHJcbiAgICBuZXdDYW5kaWRhdGUuY2FuZGlkYXRlU2tpbGxTdGF0dXMgPSBza2lsbFN0YXR1c0RhdGE7XHJcbiAgICByZXR1cm4gbmV3Q2FuZGlkYXRlO1xyXG4gIH1cclxuXHJcbiAgZ2V0Q2FuZGlkYXRlVmlzaWJpbGl0eUFnYWluc3RSZWNydWl0ZXIoY2FuZGlkYXRlRGV0YWlsczpDYW5kaWRhdGVNb2RlbCwgam9iUHJvZmlsZXM6Sm9iUHJvZmlsZU1vZGVsW10pIHtcclxuICAgIGxldCBpc0dvdEl0ID0gdHJ1ZTtcclxuICAgIHZhciBfY2FuRGV0YWlsc1dpdGhKb2JNYXRjaGluZzpDYW5kaWRhdGVEZXRhaWxzV2l0aEpvYk1hdGNoaW5nID0gbmV3IENhbmRpZGF0ZURldGFpbHNXaXRoSm9iTWF0Y2hpbmcoKTtcclxuICAgIGZvciAobGV0IGpvYiBvZiBqb2JQcm9maWxlcykge1xyXG4gICAgICBmb3IgKGxldCBpdGVtIG9mIGpvYi5jYW5kaWRhdGVfbGlzdCkge1xyXG4gICAgICAgIGlmIChpdGVtLm5hbWUgPT09ICdjYXJ0TGlzdGVkJykge1xyXG4gICAgICAgICAgaWYgKGl0ZW0uaWRzLmluZGV4T2YobmV3IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkKGNhbmRpZGF0ZURldGFpbHMuX2lkKS50b1N0cmluZygpKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgaXNHb3RJdCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCFpc0dvdEl0KSB7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoaXNHb3RJdCkge1xyXG4gICAgICBjYW5kaWRhdGVEZXRhaWxzLnVzZXJJZC5tb2JpbGVfbnVtYmVyID0gVXRpbGl0eUZ1bmN0aW9uLm1vYmlsZU51bWJlckhpZGVyKGNhbmRpZGF0ZURldGFpbHMudXNlcklkLm1vYmlsZV9udW1iZXIpO1xyXG4gICAgICBjYW5kaWRhdGVEZXRhaWxzLnVzZXJJZC5lbWFpbCA9IFV0aWxpdHlGdW5jdGlvbi5lbWFpbFZhbHVlSGlkZXIoY2FuZGlkYXRlRGV0YWlscy51c2VySWQuZW1haWwpO1xyXG4gICAgICBjYW5kaWRhdGVEZXRhaWxzLmFjYWRlbWljcyA9IFtdO1xyXG4gICAgICBjYW5kaWRhdGVEZXRhaWxzLmVtcGxveW1lbnRIaXN0b3J5ID0gW107XHJcbiAgICAgIGNhbmRpZGF0ZURldGFpbHMuYXJlYU9mV29yayA9IFtdO1xyXG4gICAgICBjYW5kaWRhdGVEZXRhaWxzLnByb2ZpY2llbmNpZXMgPSBbXTtcclxuICAgICAgY2FuZGlkYXRlRGV0YWlscy5hd2FyZHMgPSBbXTtcclxuICAgICAgY2FuZGlkYXRlRGV0YWlscy5wcm9maWNpZW5jaWVzID0gW107XHJcbiAgICAgIGNhbmRpZGF0ZURldGFpbHMucHJvZmVzc2lvbmFsRGV0YWlscy5lZHVjYXRpb24gPSBVdGlsaXR5RnVuY3Rpb24udmFsdWVIaWRlKGNhbmRpZGF0ZURldGFpbHMucHJvZmVzc2lvbmFsRGV0YWlscy5lZHVjYXRpb24pXHJcbiAgICAgIGNhbmRpZGF0ZURldGFpbHMucHJvZmVzc2lvbmFsRGV0YWlscy5leHBlcmllbmNlID0gVXRpbGl0eUZ1bmN0aW9uLnZhbHVlSGlkZShjYW5kaWRhdGVEZXRhaWxzLnByb2Zlc3Npb25hbERldGFpbHMuZXhwZXJpZW5jZSlcclxuICAgICAgY2FuZGlkYXRlRGV0YWlscy5wcm9mZXNzaW9uYWxEZXRhaWxzLmluZHVzdHJ5RXhwb3N1cmUgPSBVdGlsaXR5RnVuY3Rpb24udmFsdWVIaWRlKGNhbmRpZGF0ZURldGFpbHMucHJvZmVzc2lvbmFsRGV0YWlscy5pbmR1c3RyeUV4cG9zdXJlKTtcclxuICAgICAgY2FuZGlkYXRlRGV0YWlscy5wcm9mZXNzaW9uYWxEZXRhaWxzLmN1cnJlbnRTYWxhcnkgPSBVdGlsaXR5RnVuY3Rpb24udmFsdWVIaWRlKGNhbmRpZGF0ZURldGFpbHMucHJvZmVzc2lvbmFsRGV0YWlscy5jdXJyZW50U2FsYXJ5KTtcclxuICAgICAgY2FuZGlkYXRlRGV0YWlscy5wcm9mZXNzaW9uYWxEZXRhaWxzLm5vdGljZVBlcmlvZCA9IFV0aWxpdHlGdW5jdGlvbi52YWx1ZUhpZGUoY2FuZGlkYXRlRGV0YWlscy5wcm9mZXNzaW9uYWxEZXRhaWxzLm5vdGljZVBlcmlvZCk7XHJcbiAgICAgIGNhbmRpZGF0ZURldGFpbHMucHJvZmVzc2lvbmFsRGV0YWlscy5yZWxvY2F0ZSA9IFV0aWxpdHlGdW5jdGlvbi52YWx1ZUhpZGUoY2FuZGlkYXRlRGV0YWlscy5wcm9mZXNzaW9uYWxEZXRhaWxzLnJlbG9jYXRlKTtcclxuICAgIH1cclxuICAgIGNhbmRpZGF0ZURldGFpbHMudXNlcklkLnBhc3N3b3JkID0gJyc7XHJcbiAgICBfY2FuRGV0YWlsc1dpdGhKb2JNYXRjaGluZy5jYW5kaWRhdGVEZXRhaWxzID0gY2FuZGlkYXRlRGV0YWlscztcclxuICAgIF9jYW5EZXRhaWxzV2l0aEpvYk1hdGNoaW5nLmlzU2hvd0NhbmRpZGF0ZURldGFpbHMgPSBpc0dvdEl0O1xyXG4gICAgcmV0dXJuIF9jYW5EZXRhaWxzV2l0aEpvYk1hdGNoaW5nO1xyXG4gIH1cclxufVxyXG5cclxuT2JqZWN0LnNlYWwoU2VhcmNoU2VydmljZSk7XHJcbmV4cG9ydCA9IFNlYXJjaFNlcnZpY2U7XHJcbiJdfQ==
