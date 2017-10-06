"use strict";
var mongoose = require("mongoose");
var Messages = require("../shared/messages");
var CandidateRepository = require("../dataaccess/repository/candidate.repository");
var UserRepository = require("../dataaccess/repository/user.repository");
var LocationRepository = require("../dataaccess/repository/location.repository");
var RecruiterRepository = require("../dataaccess/repository/recruiter.repository");
var IndustryRepository = require("../dataaccess/repository/industry.repository");
var MatchViewModel = require("../dataaccess/model/match-view.model");
var CandidateClassModel = require("../dataaccess/model/candidate-class.model");
var CapabilitiesClassModel = require("../dataaccess/model/capabilities-class.model");
var ComplexitiesClassModel = require("../dataaccess/model/complexities-class.model");
var bcrypt = require('bcrypt');
var CandidateService = (function () {
    function CandidateService() {
        this.candidateRepository = new CandidateRepository();
        this.userRepository = new UserRepository();
        this.recruiterRepository = new RecruiterRepository();
        this.locationRepository = new LocationRepository();
        this.industryRepositiry = new IndustryRepository();
    }
    CandidateService.prototype.createUser = function (item, callback) {
        var _this = this;
        console.log('USer is', item);
        this.userRepository.retrieve({ $or: [{ 'email': item.email }, { 'mobile_number': item.mobile_number }] }, function (err, res) {
            if (err) {
                callback(new Error(err), null);
            }
            else if (res.length > 0) {
                if (res[0].isActivated === true) {
                    if (res[0].email === item.email) {
                        callback(new Error(Messages.MSG_ERROR_REGISTRATION), null);
                    }
                    if (res[0].mobile_number === item.mobile_number) {
                        callback(new Error(Messages.MSG_ERROR_REGISTRATION_MOBILE_NUMBER), null);
                    }
                }
                else if (res[0].isActivated === false) {
                    callback(new Error(Messages.MSG_ERROR_VERIFY_ACCOUNT), null);
                }
            }
            else {
                var saltRounds = 10;
                bcrypt.hash(item.password, saltRounds, function (err, hash) {
                    if (err) {
                        callback(new Error(Messages.MSG_ERROR_BCRYPT_CREATION), null);
                    }
                    else {
                        item.password = hash;
                        _this.userRepository.create(item, function (err, res) {
                            if (err) {
                                callback(new Error(Messages.MSG_ERROR_REGISTRATION_MOBILE_NUMBER), null);
                            }
                            else {
                                var userId1 = res._id;
                                var newItem = {
                                    userId: userId1,
                                    location: item.location
                                };
                                _this.candidateRepository.create(newItem, function (err, res) {
                                    if (err) {
                                        callback(err, null);
                                    }
                                    else {
                                        callback(null, res);
                                    }
                                });
                            }
                        });
                    }
                });
                item.isCandidate = true;
            }
        });
    };
    CandidateService.prototype.retrieve = function (field, callback) {
        this.candidateRepository.retrieve(field, function (err, result) {
            if (err) {
                callback(err, null);
            }
            else {
                if (result.length > 0) {
                    result[0].academics = result[0].academics.sort(function (a, b) {
                        return b.yearOfPassing - a.yearOfPassing;
                    });
                    result[0].awards = result[0].awards.sort(function (a, b) {
                        return b.year - a.year;
                    });
                    result[0].certifications = result[0].certifications.sort(function (a, b) {
                        return b.year - a.year;
                    });
                    callback(null, result);
                }
            }
        });
    };
    CandidateService.prototype.retrieveAll = function (item, callback) {
        this.candidateRepository.retrieve(item, function (err, res) {
            if (err) {
                callback(new Error(Messages.MSG_NO_RECORDS_FOUND), null);
            }
            else {
                callback(null, res);
            }
        });
    };
    ;
    CandidateService.prototype.retrieveWithLean = function (field, projection, callback) {
        this.candidateRepository.retrieveWithLean(field, projection, callback);
    };
    CandidateService.prototype.findById = function (id, callback) {
        this.candidateRepository.findById(id, callback);
    };
    CandidateService.prototype.update = function (_id, item, callback) {
        var _this = this;
        this.candidateRepository.retrieve({ 'userId': new mongoose.Types.ObjectId(_id) }, function (err, res) {
            if (err) {
                callback(err, res);
            }
            else {
                _this.industryRepositiry.retrieve({ 'name': item.industry.name }, function (error, industries) {
                    if (err) {
                        callback(err, res);
                    }
                    else {
                        if (item.capability_matrix === undefined) {
                            item.capability_matrix = {};
                        }
                        var new_capability_matrix = {};
                        item.capability_matrix = _this.getCapabilityMatrix(item, industries, new_capability_matrix);
                        _this.candidateRepository.findOneAndUpdateIndustry({ '_id': res[0]._id }, item, { new: true }, callback);
                    }
                });
            }
        });
    };
    CandidateService.prototype.get = function (_id, callback) {
        var _this = this;
        this.userRepository.retrieve({ '_id': _id }, function (err, result) {
            if (err) {
                callback(err, null);
            }
            else {
                _this.candidateRepository.retrieve({ 'userId': new mongoose.Types.ObjectId(result[0]._id) }, function (err, res) {
                    if (err) {
                        callback(err, null);
                    }
                    else {
                        _this.industryRepositiry.retrieve({ 'code': res[0].industry.code }, function (error, industries) {
                            if (error) {
                                callback(error, null);
                            }
                            else {
                                var response = _this.getCandidateDetail(res[0], result[0], industries);
                                callback(null, response);
                            }
                        });
                    }
                });
            }
        });
    };
    CandidateService.prototype.getCandidateDetail = function (candidate, user, industries) {
        var customCandidate = new CandidateClassModel();
        customCandidate.personalDetails = user;
        customCandidate.jobTitle = candidate.jobTitle;
        customCandidate.location = candidate.location;
        customCandidate.professionalDetails = candidate.professionalDetails;
        customCandidate.academics = candidate.academics;
        customCandidate.employmentHistory = candidate.employmentHistory;
        customCandidate.certifications = candidate.certifications;
        customCandidate.awards = candidate.awards;
        customCandidate.interestedIndustries = candidate.interestedIndustries;
        customCandidate.proficiencies = candidate.proficiencies;
        customCandidate.aboutMyself = candidate.aboutMyself;
        customCandidate.capabilities = [];
        customCandidate.industry = candidate.industry;
        customCandidate.isSubmitted = candidate.isSubmitted;
        customCandidate.isVisible = candidate.isVisible;
        customCandidate.isCompleted = candidate.isCompleted;
        customCandidate.capabilities = this.getCapabilitiesBuild(candidate.capability_matrix, candidate.industry.roles, industries);
        return customCandidate;
    };
    CandidateService.prototype.getCapabilitiesBuild = function (capability_matrix, roles, industries) {
        var capabilities = new Array(0);
        for (var cap in capability_matrix) {
            for (var _i = 0, _a = industries[0].roles; _i < _a.length; _i++) {
                var role = _a[_i];
                for (var _b = 0, roles_1 = roles; _b < roles_1.length; _b++) {
                    var candidateRole = roles_1[_b];
                    if (candidateRole.code.toString() === role.code.toString()) {
                        var defaultComplexityCode = cap.split('_')[0];
                        if (role.default_complexities.length > 0) {
                            if (defaultComplexityCode.toString() === role.default_complexities[0].code.toString()) {
                                var isFound = false;
                                var foundedDefaultCapability = void 0;
                                for (var _c = 0, capabilities_1 = capabilities; _c < capabilities_1.length; _c++) {
                                    var c = capabilities_1[_c];
                                    if (c.code === defaultComplexityCode) {
                                        foundedDefaultCapability = c;
                                        isFound = true;
                                    }
                                }
                                if (!isFound) {
                                    var newCapability = new CapabilitiesClassModel();
                                    newCapability.name = role.default_complexities[0].name;
                                    newCapability.code = role.default_complexities[0].code;
                                    newCapability.sort_order = role.default_complexities[0].sort_order;
                                    var newComplexities = new Array(0);
                                    for (var _d = 0, _e = role.default_complexities[0].complexities; _d < _e.length; _d++) {
                                        var complexity = _e[_d];
                                        var complexityCode = cap.split('_')[1];
                                        if (complexityCode === complexity.code) {
                                            var newComplexity = new ComplexitiesClassModel();
                                            newComplexity.name = complexity.name;
                                            newComplexity.sort_order = complexity.sort_order;
                                            newComplexity.code = complexity.code;
                                            if (complexity.questionForCandidate !== undefined && complexity.questionForCandidate !== null && complexity.questionForCandidate !== '') {
                                                newComplexity.questionForCandidate = complexity.questionForCandidate;
                                            }
                                            else {
                                                newComplexity.questionForCandidate = complexity.name;
                                            }
                                            for (var _f = 0, _g = complexity.scenarios; _f < _g.length; _f++) {
                                                var scenario = _g[_f];
                                                if (capability_matrix[cap].toString() === scenario.code) {
                                                    newComplexity.answer = scenario.name;
                                                }
                                            }
                                            newComplexities.push(newComplexity);
                                        }
                                    }
                                    newComplexities = this.getSortedList(newComplexities, "sort_order");
                                    newCapability.complexities = newComplexities;
                                    capabilities.push(newCapability);
                                }
                                else {
                                    var isComFound = false;
                                    var FoundedComplexity = void 0;
                                    for (var _h = 0, _j = foundedDefaultCapability.complexities; _h < _j.length; _h++) {
                                        var complexity = _j[_h];
                                        if (complexity.code === cap.split('_')[1]) {
                                            FoundedComplexity = complexity;
                                            isComFound = true;
                                        }
                                    }
                                    if (!isComFound) {
                                        var newComplexity = new ComplexitiesClassModel();
                                        for (var _k = 0, _l = role.default_complexities[0].complexities; _k < _l.length; _k++) {
                                            var complexity = _l[_k];
                                            var complexityCode = cap.split('_')[1];
                                            if (complexityCode === complexity.code) {
                                                var newComplexity_1 = new ComplexitiesClassModel();
                                                newComplexity_1.name = complexity.name;
                                                newComplexity_1.sort_order = complexity.sort_order;
                                                newComplexity_1.code = complexity.code;
                                                if (complexity.questionForCandidate !== undefined && complexity.questionForCandidate !== null && complexity.questionForCandidate !== '') {
                                                    newComplexity_1.questionForCandidate = complexity.questionForCandidate;
                                                }
                                                else {
                                                    newComplexity_1.questionForCandidate = complexity.name;
                                                }
                                                for (var _m = 0, _o = complexity.scenarios; _m < _o.length; _m++) {
                                                    var scenario = _o[_m];
                                                    if (capability_matrix[cap].toString() === scenario.code) {
                                                        newComplexity_1.answer = scenario.name;
                                                    }
                                                }
                                                foundedDefaultCapability.complexities = this.getSortedList(foundedDefaultCapability.complexities, "sort_order");
                                                foundedDefaultCapability.complexities.push(newComplexity_1);
                                            }
                                        }
                                    }
                                }
                                break;
                            }
                        }
                        for (var _p = 0, _q = role.capabilities; _p < _q.length; _p++) {
                            var capability = _q[_p];
                            var capCode = cap.split('_')[0];
                            if (capCode === capability.code) {
                                var isFound = false;
                                var foundedCapability = void 0;
                                for (var _r = 0, capabilities_2 = capabilities; _r < capabilities_2.length; _r++) {
                                    var c = capabilities_2[_r];
                                    if (c.code === capCode) {
                                        foundedCapability = c;
                                        isFound = true;
                                    }
                                }
                                if (!isFound) {
                                    var newCapability = new CapabilitiesClassModel();
                                    newCapability.name = capability.name;
                                    newCapability.code = capability.code;
                                    newCapability.sort_order = capability.sort_order;
                                    var newComplexities = new Array(0);
                                    for (var _s = 0, _t = capability.complexities; _s < _t.length; _s++) {
                                        var complexity = _t[_s];
                                        var complexityCode = cap.split('_')[1];
                                        if (complexityCode === complexity.code) {
                                            var newComplexity = new ComplexitiesClassModel();
                                            newComplexity.name = complexity.name;
                                            newComplexity.sort_order = complexity.sort_order;
                                            newComplexity.code = complexity.code;
                                            if (complexity.questionForCandidate !== undefined && complexity.questionForCandidate !== null && complexity.questionForCandidate !== '') {
                                                newComplexity.questionForCandidate = complexity.questionForCandidate;
                                            }
                                            else {
                                                newComplexity.questionForCandidate = complexity.name;
                                            }
                                            for (var _u = 0, _v = complexity.scenarios; _u < _v.length; _u++) {
                                                var scenario = _v[_u];
                                                if (capability_matrix[cap].toString() === scenario.code) {
                                                    newComplexity.answer = scenario.name;
                                                }
                                            }
                                            newComplexities.push(newComplexity);
                                        }
                                    }
                                    newComplexities = this.getSortedList(newComplexities, "sort_order");
                                    newCapability.complexities = newComplexities;
                                    capabilities.push(newCapability);
                                }
                                else {
                                    var isComFound = false;
                                    var FoundedComplexity = void 0;
                                    for (var _w = 0, _x = foundedCapability.complexities; _w < _x.length; _w++) {
                                        var complexity = _x[_w];
                                        if (complexity.code === cap.split('_')[1]) {
                                            FoundedComplexity = complexity;
                                            isComFound = true;
                                        }
                                    }
                                    if (!isComFound) {
                                        var newComplexity = new ComplexitiesClassModel();
                                        for (var _y = 0, _z = capability.complexities; _y < _z.length; _y++) {
                                            var complexity = _z[_y];
                                            var complexityCode = cap.split('_')[1];
                                            if (complexityCode === complexity.code) {
                                                var newComplexity_2 = new ComplexitiesClassModel();
                                                newComplexity_2.name = complexity.name;
                                                newComplexity_2.sort_order = complexity.sort_order;
                                                newComplexity_2.code = complexity.code;
                                                if (complexity.questionForCandidate !== undefined && complexity.questionForCandidate !== null && complexity.questionForCandidate !== '') {
                                                    newComplexity_2.questionForCandidate = complexity.questionForCandidate;
                                                }
                                                else {
                                                    newComplexity_2.questionForCandidate = complexity.name;
                                                }
                                                for (var _0 = 0, _1 = complexity.scenarios; _0 < _1.length; _0++) {
                                                    var scenario = _1[_0];
                                                    if (capability_matrix[cap].toString() === scenario.code) {
                                                        newComplexity_2.answer = scenario.name;
                                                    }
                                                }
                                                foundedCapability.complexities = this.getSortedList(foundedCapability.complexities, "sort_order");
                                                foundedCapability.complexities.push(newComplexity_2);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        break;
                    }
                }
            }
        }
        capabilities = this.getSortedList(capabilities, "sort_order");
        return capabilities;
    };
    CandidateService.prototype.getSortedList = function (list, field) {
        if (list.length > 0) {
            list = list.sort(function (a, b) {
                return b[field] - a[field];
            });
        }
        return list;
    };
    CandidateService.prototype.getCapabilityValueKeyMatrix = function (_id, callback) {
        var _this = this;
        this.candidateRepository.findByIdwithExclude(_id, { capability_matrix: 1, 'industry.name': 1 }, function (err, res) {
            if (err) {
                callback(err, null);
            }
            else {
                console.time('-------get candidateRepository-----');
                _this.industryRepositiry.retrieve({ 'name': res.industry.name }, function (error, industries) {
                    if (err) {
                        callback(err, null);
                    }
                    else {
                        console.timeEnd('-------get candidateRepository-----');
                        var new_capability_matrix = _this.getCapabilityValueKeyMatrixBuild(res.capability_matrix, industries);
                        callback(null, new_capability_matrix);
                    }
                });
            }
        });
    };
    CandidateService.prototype.getCapabilityValueKeyMatrixBuild = function (capability_matrix, industries) {
        var keyValueCapability = {};
        var _loop_1 = function (cap) {
            var isFound = false;
            var match_view = new MatchViewModel();
            for (var _i = 0, _a = industries[0].roles; _i < _a.length; _i++) {
                var role = _a[_i];
                for (var _b = 0, _c = role.capabilities; _b < _c.length; _b++) {
                    var capability = _c[_b];
                    var count_of_complexity = 0;
                    for (var _d = 0, _e = capability.complexities; _d < _e.length; _d++) {
                        var complexity = _e[_d];
                        ++count_of_complexity;
                        var custom_code = capability.code + '_' + complexity.code;
                        if (custom_code === cap) {
                            isFound = true;
                            match_view.scenarios = complexity.scenarios.slice();
                            var scenarios = complexity.scenarios.filter(function (sce) {
                                sce.code = sce.code.replace('.', '_');
                                sce.code = sce.code.replace('.', '_');
                                sce.code = sce.code.substr(sce.code.lastIndexOf('_') + 1);
                                if (sce.code.substr(sce.code.lastIndexOf('.') + 1) == capability_matrix[cap]) {
                                    return true;
                                }
                                else {
                                    return false;
                                }
                            });
                            match_view.capability_name = capability.name;
                            match_view.capability_code = capability.code;
                            match_view.total_complexity_in_capability = capability.complexities.length;
                            match_view.complexity_number = count_of_complexity;
                            match_view.role_name = role.name;
                            match_view.code = custom_code;
                            switch (role.sort_order.toString().length.toString()) {
                                case '1':
                                    match_view.role_sort_order = '000' + role.sort_order;
                                    break;
                                case '2':
                                    match_view.role_sort_order = '00' + role.sort_order;
                                    break;
                                case '3':
                                    match_view.role_sort_order = '0' + role.sort_order;
                                    break;
                                case '4':
                                    match_view.role_sort_order = role.sort_order;
                                    break;
                                default:
                                    match_view.role_sort_order = '0000';
                            }
                            switch (capability.sort_order.toString().length.toString()) {
                                case '1':
                                    match_view.capability_sort_order = '000' + capability.sort_order;
                                    break;
                                case '2':
                                    match_view.capability_sort_order = '00' + capability.sort_order;
                                    break;
                                case '3':
                                    match_view.capability_sort_order = '0' + capability.sort_order;
                                    break;
                                case '4':
                                    match_view.capability_sort_order = capability.sort_order;
                                    break;
                                default:
                                    match_view.capability_sort_order = '0000';
                            }
                            switch (complexity.sort_order.toString().length.toString()) {
                                case '1':
                                    match_view.complexity_sort_order = '000' + complexity.sort_order;
                                    break;
                                case '2':
                                    match_view.complexity_sort_order = '00' + complexity.sort_order;
                                    break;
                                case '3':
                                    match_view.complexity_sort_order = '0' + complexity.sort_order;
                                    break;
                                case '4':
                                    match_view.complexity_sort_order = complexity.sort_order;
                                    break;
                                default:
                                    match_view.complexity_sort_order = '0000';
                            }
                            match_view.main_sort_order = Number(match_view.role_sort_order + match_view.capability_sort_order + match_view.complexity_sort_order);
                            if (complexity.questionForCandidate !== undefined && complexity.questionForCandidate !== null && complexity.questionForCandidate !== '') {
                                match_view.questionForCandidate = complexity.questionForCandidate;
                            }
                            else {
                                match_view.questionForCandidate = complexity.name;
                            }
                            if (complexity.questionForRecruiter !== undefined && complexity.questionForRecruiter !== null && complexity.questionForRecruiter !== '') {
                                match_view.questionForRecruiter = complexity.questionForRecruiter;
                            }
                            else {
                                match_view.questionForRecruiter = complexity.name;
                            }
                            if (complexity.questionHeaderForCandidate !== undefined && complexity.questionHeaderForCandidate !== null && complexity.questionHeaderForCandidate !== '') {
                                match_view.questionHeaderForCandidate = complexity.questionHeaderForCandidate;
                            }
                            else {
                                match_view.questionHeaderForCandidate = Messages.MSG_HEADER_QUESTION_CANDIDATE;
                            }
                            if (complexity.questionHeaderForRecruiter !== undefined && complexity.questionHeaderForRecruiter !== null && complexity.questionHeaderForRecruiter !== '') {
                                match_view.questionHeaderForRecruiter = complexity.questionHeaderForRecruiter;
                            }
                            else {
                                match_view.questionHeaderForRecruiter = Messages.MSG_HEADER_QUESTION_RECRUITER;
                            }
                            match_view.complexity_name = complexity.name;
                            if (scenarios[0]) {
                                match_view.scenario_name = scenarios[0].name;
                                match_view.userChoice = scenarios[0].code;
                            }
                            keyValueCapability[cap] = match_view;
                            break;
                        }
                    }
                    if (isFound) {
                    }
                }
                if (role.default_complexities) {
                    for (var _f = 0, _g = role.default_complexities; _f < _g.length; _f++) {
                        var capability = _g[_f];
                        var count_of_default_complexity = 0;
                        for (var _h = 0, _j = capability.complexities; _h < _j.length; _h++) {
                            var complexity = _j[_h];
                            ++count_of_default_complexity;
                            var custom_code = capability.code + '_' + complexity.code;
                            if (custom_code === cap) {
                                isFound = true;
                                match_view.scenarios = complexity.scenarios.slice();
                                var scenarios = complexity.scenarios.filter(function (sce) {
                                    sce.code = sce.code.replace('.', '_');
                                    sce.code = sce.code.replace('.', '_');
                                    sce.code = sce.code.substr(sce.code.lastIndexOf('_') + 1);
                                    if (sce.code.substr(sce.code.lastIndexOf('.') + 1) == capability_matrix[cap]) {
                                        return true;
                                    }
                                    else {
                                        return false;
                                    }
                                });
                                match_view.capability_name = capability.name;
                                match_view.capability_code = capability.code;
                                match_view.total_complexity_in_capability = capability.complexities.length;
                                match_view.complexity_number = count_of_default_complexity;
                                match_view.complexity_name = complexity.name;
                                match_view.role_name = role.name;
                                match_view.code = custom_code;
                                switch (role.sort_order.toString().length.toString()) {
                                    case '1':
                                        match_view.role_sort_order = '000' + role.sort_order;
                                        break;
                                    case '2':
                                        match_view.role_sort_order = '00' + role.sort_order;
                                        break;
                                    case '3':
                                        match_view.role_sort_order = '0' + role.sort_order;
                                        break;
                                    case '4':
                                        match_view.role_sort_order = role.sort_order;
                                        break;
                                    default:
                                        match_view.role_sort_order = '0000';
                                }
                                switch (capability.sort_order.toString().length.toString()) {
                                    case '1':
                                        match_view.capability_sort_order = '000' + capability.sort_order;
                                        break;
                                    case '2':
                                        match_view.capability_sort_order = '00' + capability.sort_order;
                                        break;
                                    case '3':
                                        match_view.capability_sort_order = '0' + capability.sort_order;
                                        break;
                                    case '4':
                                        match_view.capability_sort_order = capability.sort_order;
                                        break;
                                    default:
                                        match_view.capability_sort_order = '0000';
                                }
                                switch (complexity.sort_order.toString().length.toString()) {
                                    case '1':
                                        match_view.complexity_sort_order = '000' + complexity.sort_order;
                                        break;
                                    case '2':
                                        match_view.complexity_sort_order = '00' + complexity.sort_order;
                                        break;
                                    case '3':
                                        match_view.complexity_sort_order = '0' + complexity.sort_order;
                                        break;
                                    case '4':
                                        match_view.complexity_sort_order = complexity.sort_order;
                                        break;
                                    default:
                                        match_view.complexity_sort_order = '0000';
                                }
                                match_view.main_sort_order = Number(match_view.role_sort_order + match_view.capability_sort_order + match_view.complexity_sort_order);
                                if (complexity.questionForCandidate !== undefined && complexity.questionForCandidate !== null && complexity.questionForCandidate !== '') {
                                    match_view.questionForCandidate = complexity.questionForCandidate;
                                }
                                else {
                                    match_view.questionForCandidate = complexity.name;
                                }
                                if (complexity.questionForRecruiter !== undefined && complexity.questionForRecruiter !== null && complexity.questionForRecruiter !== '') {
                                    match_view.questionForRecruiter = complexity.questionForRecruiter;
                                }
                                else {
                                    match_view.questionForRecruiter = complexity.name;
                                }
                                if (complexity.questionHeaderForCandidate !== undefined && complexity.questionHeaderForCandidate !== null && complexity.questionHeaderForCandidate !== '') {
                                    match_view.questionHeaderForCandidate = complexity.questionHeaderForCandidate;
                                }
                                else {
                                    match_view.questionHeaderForCandidate = Messages.MSG_HEADER_QUESTION_CANDIDATE;
                                }
                                if (complexity.questionHeaderForRecruiter !== undefined && complexity.questionHeaderForRecruiter !== null && complexity.questionHeaderForRecruiter !== '') {
                                    match_view.questionHeaderForRecruiter = complexity.questionHeaderForRecruiter;
                                }
                                else {
                                    match_view.questionHeaderForRecruiter = Messages.MSG_HEADER_QUESTION_RECRUITER;
                                }
                                if (scenarios[0]) {
                                    match_view.scenario_name = scenarios[0].name;
                                    match_view.userChoice = scenarios[0].code;
                                }
                                keyValueCapability[cap] = match_view;
                                break;
                            }
                        }
                        if (isFound) {
                        }
                    }
                }
                if (isFound) {
                }
            }
        };
        for (var cap in capability_matrix) {
            _loop_1(cap);
        }
        var orderKeys = function (o, f) {
            var os = [], ks = [], i;
            for (var i_1 in o) {
                os.push([i_1, o[i_1]]);
            }
            os.sort(function (a, b) {
                return f(a[1], b[1]);
            });
            for (i = 0; i < os.length; i++) {
                ks.push(os[i][0]);
            }
            return ks;
        };
        var result = orderKeys(keyValueCapability, function (a, b) {
            return a.main_sort_order - b.main_sort_order;
        });
        var responseToReturn = {};
        for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
            var i = result_1[_i];
            responseToReturn[i] = keyValueCapability[i];
        }
        return responseToReturn;
    };
    CandidateService.prototype.getCapabilityMatrix = function (item, industries, new_capability_matrix) {
        if (item.industry.roles && item.industry.roles.length > 0) {
            for (var _i = 0, _a = item.industry.roles; _i < _a.length; _i++) {
                var role = _a[_i];
                if (role.default_complexities) {
                    for (var _b = 0, _c = role.default_complexities; _b < _c.length; _b++) {
                        var capability = _c[_b];
                        if (capability.code) {
                            for (var _d = 0, _e = industries[0].roles; _d < _e.length; _d++) {
                                var mainRole = _e[_d];
                                if (role.code.toString() === mainRole.code.toString()) {
                                    for (var _f = 0, _g = mainRole.default_complexities; _f < _g.length; _f++) {
                                        var mainCap = _g[_f];
                                        if (capability.code.toString() === mainCap.code.toString()) {
                                            for (var _h = 0, _j = mainCap.complexities; _h < _j.length; _h++) {
                                                var mainComp = _j[_h];
                                                var itemcode = mainCap.code + '_' + mainComp.code;
                                                if (item.capability_matrix[itemcode] === undefined) {
                                                    if (new_capability_matrix != undefined && new_capability_matrix[itemcode] == undefined) {
                                                        new_capability_matrix[itemcode] = -1;
                                                        item.capability_matrix[itemcode] = -1;
                                                    }
                                                }
                                                else if (item.capability_matrix[itemcode] !== -1) {
                                                    if (new_capability_matrix != undefined && new_capability_matrix[itemcode] == undefined) {
                                                        new_capability_matrix[itemcode] = item.capability_matrix[itemcode];
                                                    }
                                                }
                                                else {
                                                    if (new_capability_matrix != undefined && new_capability_matrix[itemcode] == undefined) {
                                                        new_capability_matrix[itemcode] = -1;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (role.capabilities && role.capabilities.length > 0) {
                    for (var _k = 0, _l = role.capabilities; _k < _l.length; _k++) {
                        var capability = _l[_k];
                        if (capability.code) {
                            for (var _m = 0, _o = industries[0].roles; _m < _o.length; _m++) {
                                var mainRole = _o[_m];
                                if (role.code.toString() === mainRole.code.toString()) {
                                    for (var _p = 0, _q = mainRole.capabilities; _p < _q.length; _p++) {
                                        var mainCap = _q[_p];
                                        if (capability.code.toString() === mainCap.code.toString()) {
                                            for (var _r = 0, _s = mainCap.complexities; _r < _s.length; _r++) {
                                                var mainComp = _s[_r];
                                                var itemcode = mainCap.code + '_' + mainComp.code;
                                                if (item.capability_matrix[itemcode] === undefined) {
                                                    new_capability_matrix[itemcode] = -1;
                                                    item.capability_matrix[itemcode] = -1;
                                                }
                                                else if (item.capability_matrix !== -1) {
                                                    new_capability_matrix[itemcode] = item.capability_matrix[itemcode];
                                                }
                                                else {
                                                    new_capability_matrix[itemcode] = -1;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return new_capability_matrix;
    };
    CandidateService.prototype.getList = function (item, callback) {
        var _this = this;
        var query = {
            'postedJobs._id': { $in: item.ids },
        };
        this.recruiterRepository.retrieve(query, function (err, res) {
            if (err) {
                callback(err, null);
            }
            else {
                _this.recruiterRepository.getJobProfileQCard(res, item.candidate, item.ids, 'none', function (canError, canResult) {
                    if (canError) {
                        callback(canError, null);
                    }
                    else {
                        callback(null, canResult);
                    }
                });
            }
        });
    };
    CandidateService.prototype.loadCapabilitiDetails = function (capabilityMatrix) {
        var capabilityMatrixKeys = Object.keys(capabilityMatrix);
        var capabilitiesArray = new Array();
        for (var _i = 0, capabilityMatrixKeys_1 = capabilityMatrixKeys; _i < capabilityMatrixKeys_1.length; _i++) {
            var keys = capabilityMatrixKeys_1[_i];
            var capabilityObject = {
                'capabilityCode': keys.split('_')[0],
                'complexityCode': keys.split('_')[1],
                'scenerioCode': capabilityMatrix[keys]
            };
            capabilitiesArray.push(capabilityObject);
        }
        return capabilitiesArray;
    };
    CandidateService.prototype.loadRoles = function (roles) {
        var selectedRoles = new Array();
        for (var _i = 0, roles_2 = roles; _i < roles_2.length; _i++) {
            var role = roles_2[_i];
            selectedRoles.push(role.name);
        }
        return selectedRoles;
    };
    CandidateService.prototype.getTotalCandidateCount = function (callback) {
        var query = {};
        this.candidateRepository.getCount(query, function (err, result) {
            if (err) {
                callback(err, null);
            }
            else {
                callback(err, result);
            }
        });
    };
    return CandidateService;
}());
Object.seal(CandidateService);
module.exports = CandidateService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2VydmljZXMvY2FuZGlkYXRlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLG1DQUFxQztBQUNyQyw2Q0FBZ0Q7QUFDaEQsbUZBQXNGO0FBQ3RGLHlFQUE0RTtBQUM1RSxpRkFBb0Y7QUFDcEYsbUZBQXNGO0FBQ3RGLGlGQUFvRjtBQUdwRixxRUFBd0U7QUFDeEUsK0VBQWtGO0FBR2xGLHFGQUF3RjtBQUN4RixxRkFBd0Y7QUFFeEYsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CO0lBUUU7UUFDRSxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxtQkFBbUIsRUFBRSxDQUFDO1FBQ3JELElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQztRQUMzQyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxtQkFBbUIsRUFBRSxDQUFDO1FBQ3JELElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLGtCQUFrQixFQUFFLENBQUM7UUFDbkQsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksa0JBQWtCLEVBQUUsQ0FBQztJQUNyRCxDQUFDO0lBRUQscUNBQVUsR0FBVixVQUFXLElBQVMsRUFBRSxRQUEyQztRQUFqRSxpQkFnREM7UUEvQ0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsRUFBQyxHQUFHLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFDLEVBQUUsRUFBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBQyxDQUFDLEVBQUMsRUFBRSxVQUFDLEdBQUcsRUFBRSxHQUFHO1lBQzNHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsUUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxF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QTtBQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUM5QixpQkFBUyxnQkFBZ0IsQ0FBQyIsImZpbGUiOiJhcHAvZnJhbWV3b3JrL3NlcnZpY2VzL2NhbmRpZGF0ZS5zZXJ2aWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgbW9uZ29vc2UgZnJvbSBcIm1vbmdvb3NlXCI7XHJcbmltcG9ydCBNZXNzYWdlcyA9IHJlcXVpcmUoJy4uL3NoYXJlZC9tZXNzYWdlcycpO1xyXG5pbXBvcnQgQ2FuZGlkYXRlUmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9jYW5kaWRhdGUucmVwb3NpdG9yeScpO1xyXG5pbXBvcnQgVXNlclJlcG9zaXRvcnkgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL3JlcG9zaXRvcnkvdXNlci5yZXBvc2l0b3J5Jyk7XHJcbmltcG9ydCBMb2NhdGlvblJlcG9zaXRvcnkgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL3JlcG9zaXRvcnkvbG9jYXRpb24ucmVwb3NpdG9yeScpO1xyXG5pbXBvcnQgUmVjcnVpdGVyUmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9yZWNydWl0ZXIucmVwb3NpdG9yeScpO1xyXG5pbXBvcnQgSW5kdXN0cnlSZXBvc2l0b3J5ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L2luZHVzdHJ5LnJlcG9zaXRvcnknKTtcclxuaW1wb3J0IEluZHVzdHJ5TW9kZWwgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL2luZHVzdHJ5Lm1vZGVsJyk7XHJcbmltcG9ydCBTY2VuYXJpb01vZGVsID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9zY2VuYXJpby5tb2RlbCcpO1xyXG5pbXBvcnQgTWF0Y2hWaWV3TW9kZWwgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL21hdGNoLXZpZXcubW9kZWwnKTtcclxuaW1wb3J0IENhbmRpZGF0ZUNsYXNzTW9kZWwgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL2NhbmRpZGF0ZS1jbGFzcy5tb2RlbCcpO1xyXG5pbXBvcnQgSUNhbmRpZGF0ZSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9uZ29vc2UvY2FuZGlkYXRlJyk7XHJcbmltcG9ydCBVc2VyID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb25nb29zZS91c2VyJyk7XHJcbmltcG9ydCBDYXBhYmlsaXRpZXNDbGFzc01vZGVsID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9jYXBhYmlsaXRpZXMtY2xhc3MubW9kZWwnKTtcclxuaW1wb3J0IENvbXBsZXhpdGllc0NsYXNzTW9kZWwgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL2NvbXBsZXhpdGllcy1jbGFzcy5tb2RlbCcpO1xyXG5pbXBvcnQgUm9sZU1vZGVsID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9yb2xlLm1vZGVsJyk7XHJcbmxldCBiY3J5cHQgPSByZXF1aXJlKCdiY3J5cHQnKTtcclxuY2xhc3MgQ2FuZGlkYXRlU2VydmljZSB7XHJcbiAgcHJpdmF0ZSBjYW5kaWRhdGVSZXBvc2l0b3J5OiBDYW5kaWRhdGVSZXBvc2l0b3J5O1xyXG4gIHByaXZhdGUgcmVjcnVpdGVyUmVwb3NpdG9yeTogUmVjcnVpdGVyUmVwb3NpdG9yeTtcclxuICBwcml2YXRlIGluZHVzdHJ5UmVwb3NpdGlyeTogSW5kdXN0cnlSZXBvc2l0b3J5O1xyXG4gIHByaXZhdGUgdXNlclJlcG9zaXRvcnk6IFVzZXJSZXBvc2l0b3J5O1xyXG4gIHByaXZhdGUgbG9jYXRpb25SZXBvc2l0b3J5OiBMb2NhdGlvblJlcG9zaXRvcnk7XHJcblxyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuY2FuZGlkYXRlUmVwb3NpdG9yeSA9IG5ldyBDYW5kaWRhdGVSZXBvc2l0b3J5KCk7XHJcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5ID0gbmV3IFVzZXJSZXBvc2l0b3J5KCk7XHJcbiAgICB0aGlzLnJlY3J1aXRlclJlcG9zaXRvcnkgPSBuZXcgUmVjcnVpdGVyUmVwb3NpdG9yeSgpO1xyXG4gICAgdGhpcy5sb2NhdGlvblJlcG9zaXRvcnkgPSBuZXcgTG9jYXRpb25SZXBvc2l0b3J5KCk7XHJcbiAgICB0aGlzLmluZHVzdHJ5UmVwb3NpdGlyeSA9IG5ldyBJbmR1c3RyeVJlcG9zaXRvcnkoKTtcclxuICB9XHJcblxyXG4gIGNyZWF0ZVVzZXIoaXRlbTogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBjb25zb2xlLmxvZygnVVNlciBpcycsIGl0ZW0pO1xyXG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5yZXRyaWV2ZSh7JG9yOiBbeydlbWFpbCc6IGl0ZW0uZW1haWx9LCB7J21vYmlsZV9udW1iZXInOiBpdGVtLm1vYmlsZV9udW1iZXJ9XX0sIChlcnIsIHJlcykgPT4ge1xyXG4gICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKGVyciksIG51bGwpO1xyXG4gICAgICB9IGVsc2UgaWYgKHJlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgaWYgKHJlc1swXS5pc0FjdGl2YXRlZCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgaWYgKHJlc1swXS5lbWFpbCA9PT0gaXRlbS5lbWFpbCkge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoTWVzc2FnZXMuTVNHX0VSUk9SX1JFR0lTVFJBVElPTiksIG51bGwpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKHJlc1swXS5tb2JpbGVfbnVtYmVyID09PSBpdGVtLm1vYmlsZV9udW1iZXIpIHtcclxuICAgICAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKE1lc3NhZ2VzLk1TR19FUlJPUl9SRUdJU1RSQVRJT05fTU9CSUxFX05VTUJFUiksIG51bGwpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAocmVzWzBdLmlzQWN0aXZhdGVkID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKE1lc3NhZ2VzLk1TR19FUlJPUl9WRVJJRllfQUNDT1VOVCksIG51bGwpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zdCBzYWx0Um91bmRzID0gMTA7XHJcbiAgICAgICAgYmNyeXB0Lmhhc2goaXRlbS5wYXNzd29yZCwgc2FsdFJvdW5kcywgKGVycjogYW55LCBoYXNoOiBhbnkpID0+IHtcclxuICAgICAgICAgIC8vIFN0b3JlIGhhc2ggaW4geW91ciBwYXNzd29yZCBEQi5cclxuICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKE1lc3NhZ2VzLk1TR19FUlJPUl9CQ1JZUFRfQ1JFQVRJT04pLCBudWxsKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGl0ZW0ucGFzc3dvcmQgPSBoYXNoO1xyXG4gICAgICAgICAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LmNyZWF0ZShpdGVtLCAoZXJyLCByZXMpID0+IHtcclxuICAgICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoTWVzc2FnZXMuTVNHX0VSUk9SX1JFR0lTVFJBVElPTl9NT0JJTEVfTlVNQkVSKSwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxldCB1c2VySWQxID0gcmVzLl9pZDtcclxuICAgICAgICAgICAgICAgIGxldCBuZXdJdGVtOiBhbnkgPSB7XHJcbiAgICAgICAgICAgICAgICAgIHVzZXJJZDogdXNlcklkMSxcclxuICAgICAgICAgICAgICAgICAgbG9jYXRpb246IGl0ZW0ubG9jYXRpb25cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhbmRpZGF0ZVJlcG9zaXRvcnkuY3JlYXRlKG5ld0l0ZW0sIChlcnI6IGFueSwgcmVzOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBpdGVtLmlzQ2FuZGlkYXRlID0gdHJ1ZTtcclxuXHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmV0cmlldmUoZmllbGQ6IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgdGhpcy5jYW5kaWRhdGVSZXBvc2l0b3J5LnJldHJpZXZlKGZpZWxkLCAoZXJyLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHJlc3VsdC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICByZXN1bHRbMF0uYWNhZGVtaWNzID0gcmVzdWx0WzBdLmFjYWRlbWljcy5zb3J0KGZ1bmN0aW9uIChhOiBhbnksIGI6IGFueSkge1xyXG4gICAgICAgICAgICByZXR1cm4gYi55ZWFyT2ZQYXNzaW5nIC0gYS55ZWFyT2ZQYXNzaW5nO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICByZXN1bHRbMF0uYXdhcmRzID0gcmVzdWx0WzBdLmF3YXJkcy5zb3J0KGZ1bmN0aW9uIChhOiBhbnksIGI6IGFueSkge1xyXG4gICAgICAgICAgICByZXR1cm4gYi55ZWFyIC0gYS55ZWFyO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICByZXN1bHRbMF0uY2VydGlmaWNhdGlvbnMgPSByZXN1bHRbMF0uY2VydGlmaWNhdGlvbnMuc29ydChmdW5jdGlvbiAoYTogYW55LCBiOiBhbnkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGIueWVhciAtIGEueWVhcjtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3VsdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJldHJpZXZlQWxsKGl0ZW06IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgdGhpcy5jYW5kaWRhdGVSZXBvc2l0b3J5LnJldHJpZXZlKGl0ZW0sIChlcnIsIHJlcykgPT4ge1xyXG4gICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKE1lc3NhZ2VzLk1TR19OT19SRUNPUkRTX0ZPVU5EKSwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgcmV0cmlldmVXaXRoTGVhbihmaWVsZDogYW55LCBwcm9qZWN0aW9uOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIHRoaXMuY2FuZGlkYXRlUmVwb3NpdG9yeS5yZXRyaWV2ZVdpdGhMZWFuKGZpZWxkLCBwcm9qZWN0aW9uLCBjYWxsYmFjayk7XHJcbiAgfVxyXG5cclxuICBmaW5kQnlJZChpZDogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0aGlzLmNhbmRpZGF0ZVJlcG9zaXRvcnkuZmluZEJ5SWQoaWQsIGNhbGxiYWNrKTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZShfaWQ6IHN0cmluZywgaXRlbTogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcblxyXG4gICAgdGhpcy5jYW5kaWRhdGVSZXBvc2l0b3J5LnJldHJpZXZlKHsndXNlcklkJzogbmV3IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkKF9pZCl9LCAoZXJyLCByZXMpID0+IHtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVyciwgcmVzKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmluZHVzdHJ5UmVwb3NpdGlyeS5yZXRyaWV2ZSh7J25hbWUnOiBpdGVtLmluZHVzdHJ5Lm5hbWV9LCAoZXJyb3I6IGFueSwgaW5kdXN0cmllczogSW5kdXN0cnlNb2RlbFtdKSA9PiB7XHJcbiAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgcmVzKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoaXRlbS5jYXBhYmlsaXR5X21hdHJpeCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgaXRlbS5jYXBhYmlsaXR5X21hdHJpeCA9IHt9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCBuZXdfY2FwYWJpbGl0eV9tYXRyaXg6IGFueSA9IHt9O1xyXG4gICAgICAgICAgICBpdGVtLmNhcGFiaWxpdHlfbWF0cml4ID0gdGhpcy5nZXRDYXBhYmlsaXR5TWF0cml4KGl0ZW0sIGluZHVzdHJpZXMsIG5ld19jYXBhYmlsaXR5X21hdHJpeCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2FuZGlkYXRlUmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlSW5kdXN0cnkoeydfaWQnOiByZXNbMF0uX2lkfSwgaXRlbSwge25ldzogdHJ1ZX0sIGNhbGxiYWNrKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXQoX2lkOiBzdHJpbmcsIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIHRoaXMudXNlclJlcG9zaXRvcnkucmV0cmlldmUoeydfaWQnOiBfaWR9LCAoZXJyLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5jYW5kaWRhdGVSZXBvc2l0b3J5LnJldHJpZXZlKHsndXNlcklkJzogbmV3IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkKHJlc3VsdFswXS5faWQpfSwgKGVyciwgcmVzKSA9PiB7XHJcbiAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmluZHVzdHJ5UmVwb3NpdGlyeS5yZXRyaWV2ZSh7J2NvZGUnOiByZXNbMF0uaW5kdXN0cnkuY29kZX0sIChlcnJvcjogYW55LCBpbmR1c3RyaWVzOiBJbmR1c3RyeU1vZGVsW10pID0+IHtcclxuICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlc3BvbnNlOiBhbnkgPSB0aGlzLmdldENhbmRpZGF0ZURldGFpbChyZXNbMF0sIHJlc3VsdFswXSwgaW5kdXN0cmllcyk7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCByZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRDYW5kaWRhdGVEZXRhaWwoY2FuZGlkYXRlOiBJQ2FuZGlkYXRlLCB1c2VyOiBVc2VyLCBpbmR1c3RyaWVzOiBJbmR1c3RyeU1vZGVsW10pOiBDYW5kaWRhdGVDbGFzc01vZGVsIHtcclxuICAgIGxldCBjdXN0b21DYW5kaWRhdGU6IENhbmRpZGF0ZUNsYXNzTW9kZWwgPSBuZXcgQ2FuZGlkYXRlQ2xhc3NNb2RlbCgpO1xyXG4gICAgY3VzdG9tQ2FuZGlkYXRlLnBlcnNvbmFsRGV0YWlscyA9IHVzZXI7XHJcbiAgICBjdXN0b21DYW5kaWRhdGUuam9iVGl0bGUgPSBjYW5kaWRhdGUuam9iVGl0bGU7XHJcbiAgICBjdXN0b21DYW5kaWRhdGUubG9jYXRpb24gPSBjYW5kaWRhdGUubG9jYXRpb247XHJcbiAgICBjdXN0b21DYW5kaWRhdGUucHJvZmVzc2lvbmFsRGV0YWlscyA9IGNhbmRpZGF0ZS5wcm9mZXNzaW9uYWxEZXRhaWxzO1xyXG4gICAgY3VzdG9tQ2FuZGlkYXRlLmFjYWRlbWljcyA9IGNhbmRpZGF0ZS5hY2FkZW1pY3M7XHJcbiAgICBjdXN0b21DYW5kaWRhdGUuZW1wbG95bWVudEhpc3RvcnkgPSBjYW5kaWRhdGUuZW1wbG95bWVudEhpc3Rvcnk7XHJcbiAgICBjdXN0b21DYW5kaWRhdGUuY2VydGlmaWNhdGlvbnMgPSBjYW5kaWRhdGUuY2VydGlmaWNhdGlvbnM7XHJcbiAgICBjdXN0b21DYW5kaWRhdGUuYXdhcmRzID0gY2FuZGlkYXRlLmF3YXJkcztcclxuICAgIGN1c3RvbUNhbmRpZGF0ZS5pbnRlcmVzdGVkSW5kdXN0cmllcyA9IGNhbmRpZGF0ZS5pbnRlcmVzdGVkSW5kdXN0cmllcztcclxuICAgIGN1c3RvbUNhbmRpZGF0ZS5wcm9maWNpZW5jaWVzID0gY2FuZGlkYXRlLnByb2ZpY2llbmNpZXM7XHJcbiAgICBjdXN0b21DYW5kaWRhdGUuYWJvdXRNeXNlbGYgPSBjYW5kaWRhdGUuYWJvdXRNeXNlbGY7XHJcbiAgICBjdXN0b21DYW5kaWRhdGUuY2FwYWJpbGl0aWVzID0gW107XHJcbiAgICBjdXN0b21DYW5kaWRhdGUuaW5kdXN0cnkgPSBjYW5kaWRhdGUuaW5kdXN0cnk7XHJcbiAgICBjdXN0b21DYW5kaWRhdGUuaXNTdWJtaXR0ZWQgPSBjYW5kaWRhdGUuaXNTdWJtaXR0ZWQ7XHJcbiAgICBjdXN0b21DYW5kaWRhdGUuaXNWaXNpYmxlID0gY2FuZGlkYXRlLmlzVmlzaWJsZTtcclxuICAgIGN1c3RvbUNhbmRpZGF0ZS5pc0NvbXBsZXRlZCA9IGNhbmRpZGF0ZS5pc0NvbXBsZXRlZDtcclxuICAgIGN1c3RvbUNhbmRpZGF0ZS5jYXBhYmlsaXRpZXMgPSB0aGlzLmdldENhcGFiaWxpdGllc0J1aWxkKGNhbmRpZGF0ZS5jYXBhYmlsaXR5X21hdHJpeCwgY2FuZGlkYXRlLmluZHVzdHJ5LnJvbGVzLCBpbmR1c3RyaWVzKTtcclxuXHJcbiAgICByZXR1cm4gY3VzdG9tQ2FuZGlkYXRlO1xyXG4gIH1cclxuXHJcbiAgZ2V0Q2FwYWJpbGl0aWVzQnVpbGQoY2FwYWJpbGl0eV9tYXRyaXg6IGFueSwgcm9sZXM6IFJvbGVNb2RlbFtdLCBpbmR1c3RyaWVzOiBJbmR1c3RyeU1vZGVsW10pOiBDYXBhYmlsaXRpZXNDbGFzc01vZGVsW10ge1xyXG4gICAgbGV0IGNhcGFiaWxpdGllczogQ2FwYWJpbGl0aWVzQ2xhc3NNb2RlbFtdID0gbmV3IEFycmF5KDApO1xyXG5cclxuICAgIGZvciAobGV0IGNhcCBpbiBjYXBhYmlsaXR5X21hdHJpeCkge1xyXG5cclxuICAgICAgZm9yIChsZXQgcm9sZSBvZiBpbmR1c3RyaWVzWzBdLnJvbGVzKSB7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGNhbmRpZGF0ZVJvbGUgb2Ygcm9sZXMpIHtcclxuICAgICAgICAgIGlmIChjYW5kaWRhdGVSb2xlLmNvZGUudG9TdHJpbmcoKSA9PT0gcm9sZS5jb2RlLnRvU3RyaW5nKCkpIHtcclxuICAgICAgICAgICAgbGV0IGRlZmF1bHRDb21wbGV4aXR5Q29kZSA9IGNhcC5zcGxpdCgnXycpWzBdO1xyXG5cclxuICAgICAgICAgICAgaWYgKHJvbGUuZGVmYXVsdF9jb21wbGV4aXRpZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgIGlmIChkZWZhdWx0Q29tcGxleGl0eUNvZGUudG9TdHJpbmcoKSA9PT0gcm9sZS5kZWZhdWx0X2NvbXBsZXhpdGllc1swXS5jb2RlLnRvU3RyaW5nKCkpIHtcclxuICAgICAgICAgICAgICAgIGxldCBpc0ZvdW5kOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBsZXQgZm91bmRlZERlZmF1bHRDYXBhYmlsaXR5OiBDYXBhYmlsaXRpZXNDbGFzc01vZGVsO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgYyBvZiBjYXBhYmlsaXRpZXMpIHtcclxuICAgICAgICAgICAgICAgICAgaWYgKGMuY29kZSA9PT0gZGVmYXVsdENvbXBsZXhpdHlDb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm91bmRlZERlZmF1bHRDYXBhYmlsaXR5ID0gYztcclxuICAgICAgICAgICAgICAgICAgICBpc0ZvdW5kID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKCFpc0ZvdW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgIGxldCBuZXdDYXBhYmlsaXR5OiBDYXBhYmlsaXRpZXNDbGFzc01vZGVsID0gbmV3IENhcGFiaWxpdGllc0NsYXNzTW9kZWwoKTtcclxuICAgICAgICAgICAgICAgICAgbmV3Q2FwYWJpbGl0eS5uYW1lID0gcm9sZS5kZWZhdWx0X2NvbXBsZXhpdGllc1swXS5uYW1lO1xyXG4gICAgICAgICAgICAgICAgICBuZXdDYXBhYmlsaXR5LmNvZGUgPSByb2xlLmRlZmF1bHRfY29tcGxleGl0aWVzWzBdLmNvZGU7XHJcbiAgICAgICAgICAgICAgICAgIG5ld0NhcGFiaWxpdHkuc29ydF9vcmRlciA9IHJvbGUuZGVmYXVsdF9jb21wbGV4aXRpZXNbMF0uc29ydF9vcmRlcjtcclxuICAgICAgICAgICAgICAgICAgbGV0IG5ld0NvbXBsZXhpdGllczogQ29tcGxleGl0aWVzQ2xhc3NNb2RlbFtdID0gbmV3IEFycmF5KDApO1xyXG4gICAgICAgICAgICAgICAgICBmb3IgKGxldCBjb21wbGV4aXR5IG9mIHJvbGUuZGVmYXVsdF9jb21wbGV4aXRpZXNbMF0uY29tcGxleGl0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvbXBsZXhpdHlDb2RlID0gY2FwLnNwbGl0KCdfJylbMV07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjb21wbGV4aXR5Q29kZSA9PT0gY29tcGxleGl0eS5jb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBsZXQgbmV3Q29tcGxleGl0eTogQ29tcGxleGl0aWVzQ2xhc3NNb2RlbCA9IG5ldyBDb21wbGV4aXRpZXNDbGFzc01vZGVsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICBuZXdDb21wbGV4aXR5Lm5hbWUgPSBjb21wbGV4aXR5Lm5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICBuZXdDb21wbGV4aXR5LnNvcnRfb3JkZXIgPSBjb21wbGV4aXR5LnNvcnRfb3JkZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgICBuZXdDb21wbGV4aXR5LmNvZGUgPSBjb21wbGV4aXR5LmNvZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICBpZiAoY29tcGxleGl0eS5xdWVzdGlvbkZvckNhbmRpZGF0ZSAhPT0gdW5kZWZpbmVkICYmIGNvbXBsZXhpdHkucXVlc3Rpb25Gb3JDYW5kaWRhdGUgIT09IG51bGwgJiYgY29tcGxleGl0eS5xdWVzdGlvbkZvckNhbmRpZGF0ZSAhPT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3Q29tcGxleGl0eS5xdWVzdGlvbkZvckNhbmRpZGF0ZSA9IGNvbXBsZXhpdHkucXVlc3Rpb25Gb3JDYW5kaWRhdGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdDb21wbGV4aXR5LnF1ZXN0aW9uRm9yQ2FuZGlkYXRlID0gY29tcGxleGl0eS5uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgc2NlbmFyaW8gb2YgY29tcGxleGl0eS5zY2VuYXJpb3MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNhcGFiaWxpdHlfbWF0cml4W2NhcF0udG9TdHJpbmcoKSA9PT0gc2NlbmFyaW8uY29kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0NvbXBsZXhpdHkuYW5zd2VyID0gc2NlbmFyaW8ubmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgIG5ld0NvbXBsZXhpdGllcy5wdXNoKG5ld0NvbXBsZXhpdHkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgbmV3Q29tcGxleGl0aWVzID0gdGhpcy5nZXRTb3J0ZWRMaXN0KG5ld0NvbXBsZXhpdGllcywgXCJzb3J0X29yZGVyXCIpO1xyXG4gICAgICAgICAgICAgICAgICBuZXdDYXBhYmlsaXR5LmNvbXBsZXhpdGllcyA9IG5ld0NvbXBsZXhpdGllcztcclxuICAgICAgICAgICAgICAgICAgY2FwYWJpbGl0aWVzLnB1c2gobmV3Q2FwYWJpbGl0eSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICBsZXQgaXNDb21Gb3VuZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICBsZXQgRm91bmRlZENvbXBsZXhpdHk6IENvbXBsZXhpdGllc0NsYXNzTW9kZWw7XHJcbiAgICAgICAgICAgICAgICAgIGZvciAobGV0IGNvbXBsZXhpdHkgb2YgZm91bmRlZERlZmF1bHRDYXBhYmlsaXR5LmNvbXBsZXhpdGllcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjb21wbGV4aXR5LmNvZGUgPT09IGNhcC5zcGxpdCgnXycpWzFdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBGb3VuZGVkQ29tcGxleGl0eSA9IGNvbXBsZXhpdHk7XHJcbiAgICAgICAgICAgICAgICAgICAgICBpc0NvbUZvdW5kID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgaWYgKCFpc0NvbUZvdW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5ld0NvbXBsZXhpdHk6IENvbXBsZXhpdGllc0NsYXNzTW9kZWwgPSBuZXcgQ29tcGxleGl0aWVzQ2xhc3NNb2RlbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGNvbXBsZXhpdHkgb2Ygcm9sZS5kZWZhdWx0X2NvbXBsZXhpdGllc1swXS5jb21wbGV4aXRpZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIGxldCBjb21wbGV4aXR5Q29kZSA9IGNhcC5zcGxpdCgnXycpWzFdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgIGlmIChjb21wbGV4aXR5Q29kZSA9PT0gY29tcGxleGl0eS5jb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuZXdDb21wbGV4aXR5OiBDb21wbGV4aXRpZXNDbGFzc01vZGVsID0gbmV3IENvbXBsZXhpdGllc0NsYXNzTW9kZWwoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3Q29tcGxleGl0eS5uYW1lID0gY29tcGxleGl0eS5uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdDb21wbGV4aXR5LnNvcnRfb3JkZXIgPSBjb21wbGV4aXR5LnNvcnRfb3JkZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0NvbXBsZXhpdHkuY29kZSA9IGNvbXBsZXhpdHkuY29kZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBsZXhpdHkucXVlc3Rpb25Gb3JDYW5kaWRhdGUgIT09IHVuZGVmaW5lZCAmJiBjb21wbGV4aXR5LnF1ZXN0aW9uRm9yQ2FuZGlkYXRlICE9PSBudWxsICYmIGNvbXBsZXhpdHkucXVlc3Rpb25Gb3JDYW5kaWRhdGUgIT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3Q29tcGxleGl0eS5xdWVzdGlvbkZvckNhbmRpZGF0ZSA9IGNvbXBsZXhpdHkucXVlc3Rpb25Gb3JDYW5kaWRhdGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3Q29tcGxleGl0eS5xdWVzdGlvbkZvckNhbmRpZGF0ZSA9IGNvbXBsZXhpdHkubmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBzY2VuYXJpbyBvZiBjb21wbGV4aXR5LnNjZW5hcmlvcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYXBhYmlsaXR5X21hdHJpeFtjYXBdLnRvU3RyaW5nKCkgPT09IHNjZW5hcmlvLmNvZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0NvbXBsZXhpdHkuYW5zd2VyID0gc2NlbmFyaW8ubmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZm91bmRlZERlZmF1bHRDYXBhYmlsaXR5LmNvbXBsZXhpdGllcyA9IHRoaXMuZ2V0U29ydGVkTGlzdChmb3VuZGVkRGVmYXVsdENhcGFiaWxpdHkuY29tcGxleGl0aWVzLCBcInNvcnRfb3JkZXJcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kZWREZWZhdWx0Q2FwYWJpbGl0eS5jb21wbGV4aXRpZXMucHVzaChuZXdDb21wbGV4aXR5KTtcclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgY2FwYWJpbGl0eSBvZiByb2xlLmNhcGFiaWxpdGllcykge1xyXG5cclxuICAgICAgICAgICAgICBsZXQgY2FwQ29kZSA9IGNhcC5zcGxpdCgnXycpWzBdO1xyXG4gICAgICAgICAgICAgIGlmIChjYXBDb2RlID09PSBjYXBhYmlsaXR5LmNvZGUpIHtcclxuICAgICAgICAgICAgICAgIGxldCBpc0ZvdW5kOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBsZXQgZm91bmRlZENhcGFiaWxpdHk6IENhcGFiaWxpdGllc0NsYXNzTW9kZWw7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBjIG9mIGNhcGFiaWxpdGllcykge1xyXG4gICAgICAgICAgICAgICAgICBpZiAoYy5jb2RlID09PSBjYXBDb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm91bmRlZENhcGFiaWxpdHkgPSBjO1xyXG4gICAgICAgICAgICAgICAgICAgIGlzRm91bmQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoIWlzRm91bmQpIHtcclxuICAgICAgICAgICAgICAgICAgbGV0IG5ld0NhcGFiaWxpdHk6IENhcGFiaWxpdGllc0NsYXNzTW9kZWwgPSBuZXcgQ2FwYWJpbGl0aWVzQ2xhc3NNb2RlbCgpO1xyXG4gICAgICAgICAgICAgICAgICBuZXdDYXBhYmlsaXR5Lm5hbWUgPSBjYXBhYmlsaXR5Lm5hbWU7XHJcbiAgICAgICAgICAgICAgICAgIG5ld0NhcGFiaWxpdHkuY29kZSA9IGNhcGFiaWxpdHkuY29kZTtcclxuICAgICAgICAgICAgICAgICAgbmV3Q2FwYWJpbGl0eS5zb3J0X29yZGVyID0gY2FwYWJpbGl0eS5zb3J0X29yZGVyO1xyXG4gICAgICAgICAgICAgICAgICBsZXQgbmV3Q29tcGxleGl0aWVzOiBDb21wbGV4aXRpZXNDbGFzc01vZGVsW10gPSBuZXcgQXJyYXkoMCk7XHJcbiAgICAgICAgICAgICAgICAgIGZvciAobGV0IGNvbXBsZXhpdHkgb2YgY2FwYWJpbGl0eS5jb21wbGV4aXRpZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgY29tcGxleGl0eUNvZGUgPSBjYXAuc3BsaXQoJ18nKVsxXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBsZXhpdHlDb2RlID09PSBjb21wbGV4aXR5LmNvZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIGxldCBuZXdDb21wbGV4aXR5OiBDb21wbGV4aXRpZXNDbGFzc01vZGVsID0gbmV3IENvbXBsZXhpdGllc0NsYXNzTW9kZWwoKTtcclxuICAgICAgICAgICAgICAgICAgICAgIG5ld0NvbXBsZXhpdHkubmFtZSA9IGNvbXBsZXhpdHkubmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgIG5ld0NvbXBsZXhpdHkuc29ydF9vcmRlciA9IGNvbXBsZXhpdHkuc29ydF9vcmRlcjtcclxuICAgICAgICAgICAgICAgICAgICAgIG5ld0NvbXBsZXhpdHkuY29kZSA9IGNvbXBsZXhpdHkuY29kZTtcclxuICAgICAgICAgICAgICAgICAgICAgIGlmIChjb21wbGV4aXR5LnF1ZXN0aW9uRm9yQ2FuZGlkYXRlICE9PSB1bmRlZmluZWQgJiYgY29tcGxleGl0eS5xdWVzdGlvbkZvckNhbmRpZGF0ZSAhPT0gbnVsbCAmJiBjb21wbGV4aXR5LnF1ZXN0aW9uRm9yQ2FuZGlkYXRlICE9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdDb21wbGV4aXR5LnF1ZXN0aW9uRm9yQ2FuZGlkYXRlID0gY29tcGxleGl0eS5xdWVzdGlvbkZvckNhbmRpZGF0ZTtcclxuICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0NvbXBsZXhpdHkucXVlc3Rpb25Gb3JDYW5kaWRhdGUgPSBjb21wbGV4aXR5Lm5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBzY2VuYXJpbyBvZiBjb21wbGV4aXR5LnNjZW5hcmlvcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FwYWJpbGl0eV9tYXRyaXhbY2FwXS50b1N0cmluZygpID09PSBzY2VuYXJpby5jb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3Q29tcGxleGl0eS5hbnN3ZXIgPSBzY2VuYXJpby5uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgbmV3Q29tcGxleGl0aWVzLnB1c2gobmV3Q29tcGxleGl0eSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICBuZXdDb21wbGV4aXRpZXMgPSB0aGlzLmdldFNvcnRlZExpc3QobmV3Q29tcGxleGl0aWVzLCBcInNvcnRfb3JkZXJcIik7XHJcbiAgICAgICAgICAgICAgICAgIG5ld0NhcGFiaWxpdHkuY29tcGxleGl0aWVzID0gbmV3Q29tcGxleGl0aWVzO1xyXG4gICAgICAgICAgICAgICAgICBjYXBhYmlsaXRpZXMucHVzaChuZXdDYXBhYmlsaXR5KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIGxldCBpc0NvbUZvdW5kOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgIGxldCBGb3VuZGVkQ29tcGxleGl0eTogQ29tcGxleGl0aWVzQ2xhc3NNb2RlbDtcclxuICAgICAgICAgICAgICAgICAgZm9yIChsZXQgY29tcGxleGl0eSBvZiBmb3VuZGVkQ2FwYWJpbGl0eS5jb21wbGV4aXRpZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY29tcGxleGl0eS5jb2RlID09PSBjYXAuc3BsaXQoJ18nKVsxXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgRm91bmRlZENvbXBsZXhpdHkgPSBjb21wbGV4aXR5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgaXNDb21Gb3VuZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIGlmICghaXNDb21Gb3VuZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBuZXdDb21wbGV4aXR5OiBDb21wbGV4aXRpZXNDbGFzc01vZGVsID0gbmV3IENvbXBsZXhpdGllc0NsYXNzTW9kZWwoKTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBjb21wbGV4aXR5IG9mIGNhcGFiaWxpdHkuY29tcGxleGl0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBsZXQgY29tcGxleGl0eUNvZGUgPSBjYXAuc3BsaXQoJ18nKVsxXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICBpZiAoY29tcGxleGl0eUNvZGUgPT09IGNvbXBsZXhpdHkuY29kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbmV3Q29tcGxleGl0eTogQ29tcGxleGl0aWVzQ2xhc3NNb2RlbCA9IG5ldyBDb21wbGV4aXRpZXNDbGFzc01vZGVsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0NvbXBsZXhpdHkubmFtZSA9IGNvbXBsZXhpdHkubmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3Q29tcGxleGl0eS5zb3J0X29yZGVyID0gY29tcGxleGl0eS5zb3J0X29yZGVyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdDb21wbGV4aXR5LmNvZGUgPSBjb21wbGV4aXR5LmNvZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb21wbGV4aXR5LnF1ZXN0aW9uRm9yQ2FuZGlkYXRlICE9PSB1bmRlZmluZWQgJiYgY29tcGxleGl0eS5xdWVzdGlvbkZvckNhbmRpZGF0ZSAhPT0gbnVsbCAmJiBjb21wbGV4aXR5LnF1ZXN0aW9uRm9yQ2FuZGlkYXRlICE9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0NvbXBsZXhpdHkucXVlc3Rpb25Gb3JDYW5kaWRhdGUgPSBjb21wbGV4aXR5LnF1ZXN0aW9uRm9yQ2FuZGlkYXRlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0NvbXBsZXhpdHkucXVlc3Rpb25Gb3JDYW5kaWRhdGUgPSBjb21wbGV4aXR5Lm5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgc2NlbmFyaW8gb2YgY29tcGxleGl0eS5zY2VuYXJpb3MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FwYWJpbGl0eV9tYXRyaXhbY2FwXS50b1N0cmluZygpID09PSBzY2VuYXJpby5jb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdDb21wbGV4aXR5LmFuc3dlciA9IHNjZW5hcmlvLm5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kZWRDYXBhYmlsaXR5LmNvbXBsZXhpdGllcyA9IHRoaXMuZ2V0U29ydGVkTGlzdChmb3VuZGVkQ2FwYWJpbGl0eS5jb21wbGV4aXRpZXMsIFwic29ydF9vcmRlclwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm91bmRlZENhcGFiaWxpdHkuY29tcGxleGl0aWVzLnB1c2gobmV3Q29tcGxleGl0eSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNhcGFiaWxpdGllcyA9IHRoaXMuZ2V0U29ydGVkTGlzdChjYXBhYmlsaXRpZXMsIFwic29ydF9vcmRlclwiKTtcclxuXHJcbiAgICByZXR1cm4gY2FwYWJpbGl0aWVzO1xyXG4gIH1cclxuXHJcbiAgZ2V0U29ydGVkTGlzdChsaXN0OiBhbnksIGZpZWxkOiBzdHJpbmcpOiBhbnkge1xyXG5cclxuICAgIGlmIChsaXN0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgbGlzdCA9IGxpc3Quc29ydChmdW5jdGlvbiAoYTogYW55LCBiOiBhbnkpIHtcclxuICAgICAgICByZXR1cm4gYltmaWVsZF0gLSBhW2ZpZWxkXTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGxpc3Q7XHJcbiAgfVxyXG5cclxuICBnZXRDYXBhYmlsaXR5VmFsdWVLZXlNYXRyaXgoX2lkOiBzdHJpbmcsIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIHRoaXMuY2FuZGlkYXRlUmVwb3NpdG9yeS5maW5kQnlJZHdpdGhFeGNsdWRlKF9pZCwge2NhcGFiaWxpdHlfbWF0cml4OiAxLCAnaW5kdXN0cnkubmFtZSc6IDF9LCAoZXJyLCByZXMpID0+IHtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc29sZS50aW1lKCctLS0tLS0tZ2V0IGNhbmRpZGF0ZVJlcG9zaXRvcnktLS0tLScpO1xyXG4gICAgICAgIHRoaXMuaW5kdXN0cnlSZXBvc2l0aXJ5LnJldHJpZXZlKHsnbmFtZSc6IHJlcy5pbmR1c3RyeS5uYW1lfSwgKGVycm9yOiBhbnksIGluZHVzdHJpZXM6IEluZHVzdHJ5TW9kZWxbXSkgPT4ge1xyXG4gICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS50aW1lRW5kKCctLS0tLS0tZ2V0IGNhbmRpZGF0ZVJlcG9zaXRvcnktLS0tLScpO1xyXG4gICAgICAgICAgICBsZXQgbmV3X2NhcGFiaWxpdHlfbWF0cml4OiBhbnkgPSB0aGlzLmdldENhcGFiaWxpdHlWYWx1ZUtleU1hdHJpeEJ1aWxkKHJlcy5jYXBhYmlsaXR5X21hdHJpeCwgaW5kdXN0cmllcyk7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIG5ld19jYXBhYmlsaXR5X21hdHJpeCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0Q2FwYWJpbGl0eVZhbHVlS2V5TWF0cml4QnVpbGQoY2FwYWJpbGl0eV9tYXRyaXg6IGFueSwgaW5kdXN0cmllczogYW55KTogYW55IHtcclxuICAgIGxldCBrZXlWYWx1ZUNhcGFiaWxpdHk6IGFueSA9IHt9O1xyXG4gICAgZm9yIChsZXQgY2FwIGluIGNhcGFiaWxpdHlfbWF0cml4KSB7XHJcbiAgICAgIGxldCBpc0ZvdW5kOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgIGxldCBtYXRjaF92aWV3OiBNYXRjaFZpZXdNb2RlbCA9IG5ldyBNYXRjaFZpZXdNb2RlbCgpO1xyXG4gICAgICBmb3IgKGxldCByb2xlIG9mIGluZHVzdHJpZXNbMF0ucm9sZXMpIHtcclxuICAgICAgICBmb3IgKGxldCBjYXBhYmlsaXR5IG9mIHJvbGUuY2FwYWJpbGl0aWVzKSB7XHJcbiAgICAgICAgICBsZXQgY291bnRfb2ZfY29tcGxleGl0eSA9IDA7XHJcbiAgICAgICAgICBmb3IgKGxldCBjb21wbGV4aXR5IG9mIGNhcGFiaWxpdHkuY29tcGxleGl0aWVzKSB7XHJcbiAgICAgICAgICAgICsrY291bnRfb2ZfY29tcGxleGl0eTtcclxuICAgICAgICAgICAgbGV0IGN1c3RvbV9jb2RlID0gY2FwYWJpbGl0eS5jb2RlICsgJ18nICsgY29tcGxleGl0eS5jb2RlO1xyXG4gICAgICAgICAgICBpZiAoY3VzdG9tX2NvZGUgPT09IGNhcCkge1xyXG4gICAgICAgICAgICAgIGlzRm91bmQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgIG1hdGNoX3ZpZXcuc2NlbmFyaW9zID0gY29tcGxleGl0eS5zY2VuYXJpb3Muc2xpY2UoKTtcclxuICAgICAgICAgICAgICBsZXQgc2NlbmFyaW9zID0gY29tcGxleGl0eS5zY2VuYXJpb3MuZmlsdGVyKChzY2U6IFNjZW5hcmlvTW9kZWwpID0+IHtcclxuICAgICAgICAgICAgICAgIHNjZS5jb2RlID0gc2NlLmNvZGUucmVwbGFjZSgnLicsICdfJyk7XHJcbiAgICAgICAgICAgICAgICBzY2UuY29kZSA9IHNjZS5jb2RlLnJlcGxhY2UoJy4nLCAnXycpO1xyXG4gICAgICAgICAgICAgICAgc2NlLmNvZGUgPSBzY2UuY29kZS5zdWJzdHIoc2NlLmNvZGUubGFzdEluZGV4T2YoJ18nKSArIDEpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHNjZS5jb2RlLnN1YnN0cihzY2UuY29kZS5sYXN0SW5kZXhPZignLicpICsgMSkgPT0gY2FwYWJpbGl0eV9tYXRyaXhbY2FwXSkge1xyXG4gICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICBtYXRjaF92aWV3LmNhcGFiaWxpdHlfbmFtZSA9IGNhcGFiaWxpdHkubmFtZTtcclxuICAgICAgICAgICAgICBtYXRjaF92aWV3LmNhcGFiaWxpdHlfY29kZSA9IGNhcGFiaWxpdHkuY29kZTtcclxuICAgICAgICAgICAgICBtYXRjaF92aWV3LnRvdGFsX2NvbXBsZXhpdHlfaW5fY2FwYWJpbGl0eSA9IGNhcGFiaWxpdHkuY29tcGxleGl0aWVzLmxlbmd0aDtcclxuICAgICAgICAgICAgICBtYXRjaF92aWV3LmNvbXBsZXhpdHlfbnVtYmVyID0gY291bnRfb2ZfY29tcGxleGl0eTtcclxuICAgICAgICAgICAgICBtYXRjaF92aWV3LnJvbGVfbmFtZSA9IHJvbGUubmFtZTtcclxuICAgICAgICAgICAgICBtYXRjaF92aWV3LmNvZGUgPSBjdXN0b21fY29kZTtcclxuICAgICAgICAgICAgICBzd2l0Y2ggKHJvbGUuc29ydF9vcmRlci50b1N0cmluZygpLmxlbmd0aC50b1N0cmluZygpKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICcxJyA6XHJcbiAgICAgICAgICAgICAgICAgIG1hdGNoX3ZpZXcucm9sZV9zb3J0X29yZGVyID0gJzAwMCcgKyByb2xlLnNvcnRfb3JkZXI7XHJcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnMicgOlxyXG4gICAgICAgICAgICAgICAgICBtYXRjaF92aWV3LnJvbGVfc29ydF9vcmRlciA9ICcwMCcgKyByb2xlLnNvcnRfb3JkZXI7XHJcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnMycgOlxyXG4gICAgICAgICAgICAgICAgICBtYXRjaF92aWV3LnJvbGVfc29ydF9vcmRlciA9ICcwJyArIHJvbGUuc29ydF9vcmRlcjtcclxuICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICc0JyA6XHJcbiAgICAgICAgICAgICAgICAgIG1hdGNoX3ZpZXcucm9sZV9zb3J0X29yZGVyID0gcm9sZS5zb3J0X29yZGVyO1xyXG4gICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQgOlxyXG4gICAgICAgICAgICAgICAgICBtYXRjaF92aWV3LnJvbGVfc29ydF9vcmRlciA9ICcwMDAwJztcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgc3dpdGNoIChjYXBhYmlsaXR5LnNvcnRfb3JkZXIudG9TdHJpbmcoKS5sZW5ndGgudG9TdHJpbmcoKSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnMScgOlxyXG4gICAgICAgICAgICAgICAgICBtYXRjaF92aWV3LmNhcGFiaWxpdHlfc29ydF9vcmRlciA9ICcwMDAnICsgY2FwYWJpbGl0eS5zb3J0X29yZGVyO1xyXG4gICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJzInIDpcclxuICAgICAgICAgICAgICAgICAgbWF0Y2hfdmlldy5jYXBhYmlsaXR5X3NvcnRfb3JkZXIgPSAnMDAnICsgY2FwYWJpbGl0eS5zb3J0X29yZGVyO1xyXG4gICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJzMnIDpcclxuICAgICAgICAgICAgICAgICAgbWF0Y2hfdmlldy5jYXBhYmlsaXR5X3NvcnRfb3JkZXIgPSAnMCcgKyBjYXBhYmlsaXR5LnNvcnRfb3JkZXI7XHJcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnNCcgOlxyXG4gICAgICAgICAgICAgICAgICBtYXRjaF92aWV3LmNhcGFiaWxpdHlfc29ydF9vcmRlciA9IGNhcGFiaWxpdHkuc29ydF9vcmRlcjtcclxuICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0IDpcclxuICAgICAgICAgICAgICAgICAgbWF0Y2hfdmlldy5jYXBhYmlsaXR5X3NvcnRfb3JkZXIgPSAnMDAwMCc7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIHN3aXRjaCAoY29tcGxleGl0eS5zb3J0X29yZGVyLnRvU3RyaW5nKCkubGVuZ3RoLnRvU3RyaW5nKCkpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJzEnIDpcclxuICAgICAgICAgICAgICAgICAgbWF0Y2hfdmlldy5jb21wbGV4aXR5X3NvcnRfb3JkZXIgPSAnMDAwJyArIGNvbXBsZXhpdHkuc29ydF9vcmRlcjtcclxuICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICcyJyA6XHJcbiAgICAgICAgICAgICAgICAgIG1hdGNoX3ZpZXcuY29tcGxleGl0eV9zb3J0X29yZGVyID0gJzAwJyArIGNvbXBsZXhpdHkuc29ydF9vcmRlcjtcclxuICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICczJyA6XHJcbiAgICAgICAgICAgICAgICAgIG1hdGNoX3ZpZXcuY29tcGxleGl0eV9zb3J0X29yZGVyID0gJzAnICsgY29tcGxleGl0eS5zb3J0X29yZGVyO1xyXG4gICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJzQnIDpcclxuICAgICAgICAgICAgICAgICAgbWF0Y2hfdmlldy5jb21wbGV4aXR5X3NvcnRfb3JkZXIgPSBjb21wbGV4aXR5LnNvcnRfb3JkZXI7XHJcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdCA6XHJcbiAgICAgICAgICAgICAgICAgIG1hdGNoX3ZpZXcuY29tcGxleGl0eV9zb3J0X29yZGVyID0gJzAwMDAnO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBtYXRjaF92aWV3Lm1haW5fc29ydF9vcmRlciA9IE51bWJlcihtYXRjaF92aWV3LnJvbGVfc29ydF9vcmRlciArIG1hdGNoX3ZpZXcuY2FwYWJpbGl0eV9zb3J0X29yZGVyICsgbWF0Y2hfdmlldy5jb21wbGV4aXR5X3NvcnRfb3JkZXIpO1xyXG4gICAgICAgICAgICAgIGlmIChjb21wbGV4aXR5LnF1ZXN0aW9uRm9yQ2FuZGlkYXRlICE9PSB1bmRlZmluZWQgJiYgY29tcGxleGl0eS5xdWVzdGlvbkZvckNhbmRpZGF0ZSAhPT0gbnVsbCAmJiBjb21wbGV4aXR5LnF1ZXN0aW9uRm9yQ2FuZGlkYXRlICE9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgbWF0Y2hfdmlldy5xdWVzdGlvbkZvckNhbmRpZGF0ZSA9IGNvbXBsZXhpdHkucXVlc3Rpb25Gb3JDYW5kaWRhdGU7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG1hdGNoX3ZpZXcucXVlc3Rpb25Gb3JDYW5kaWRhdGUgPSBjb21wbGV4aXR5Lm5hbWU7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIGlmIChjb21wbGV4aXR5LnF1ZXN0aW9uRm9yUmVjcnVpdGVyICE9PSB1bmRlZmluZWQgJiYgY29tcGxleGl0eS5xdWVzdGlvbkZvclJlY3J1aXRlciAhPT0gbnVsbCAmJiBjb21wbGV4aXR5LnF1ZXN0aW9uRm9yUmVjcnVpdGVyICE9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgbWF0Y2hfdmlldy5xdWVzdGlvbkZvclJlY3J1aXRlciA9IGNvbXBsZXhpdHkucXVlc3Rpb25Gb3JSZWNydWl0ZXI7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG1hdGNoX3ZpZXcucXVlc3Rpb25Gb3JSZWNydWl0ZXIgPSBjb21wbGV4aXR5Lm5hbWU7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIGlmIChjb21wbGV4aXR5LnF1ZXN0aW9uSGVhZGVyRm9yQ2FuZGlkYXRlICE9PSB1bmRlZmluZWQgJiYgY29tcGxleGl0eS5xdWVzdGlvbkhlYWRlckZvckNhbmRpZGF0ZSAhPT0gbnVsbCAmJiBjb21wbGV4aXR5LnF1ZXN0aW9uSGVhZGVyRm9yQ2FuZGlkYXRlICE9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgbWF0Y2hfdmlldy5xdWVzdGlvbkhlYWRlckZvckNhbmRpZGF0ZSA9IGNvbXBsZXhpdHkucXVlc3Rpb25IZWFkZXJGb3JDYW5kaWRhdGU7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG1hdGNoX3ZpZXcucXVlc3Rpb25IZWFkZXJGb3JDYW5kaWRhdGUgPSBNZXNzYWdlcy5NU0dfSEVBREVSX1FVRVNUSU9OX0NBTkRJREFURTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgaWYgKGNvbXBsZXhpdHkucXVlc3Rpb25IZWFkZXJGb3JSZWNydWl0ZXIgIT09IHVuZGVmaW5lZCAmJiBjb21wbGV4aXR5LnF1ZXN0aW9uSGVhZGVyRm9yUmVjcnVpdGVyICE9PSBudWxsICYmIGNvbXBsZXhpdHkucXVlc3Rpb25IZWFkZXJGb3JSZWNydWl0ZXIgIT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICBtYXRjaF92aWV3LnF1ZXN0aW9uSGVhZGVyRm9yUmVjcnVpdGVyID0gY29tcGxleGl0eS5xdWVzdGlvbkhlYWRlckZvclJlY3J1aXRlcjtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbWF0Y2hfdmlldy5xdWVzdGlvbkhlYWRlckZvclJlY3J1aXRlciA9IE1lc3NhZ2VzLk1TR19IRUFERVJfUVVFU1RJT05fUkVDUlVJVEVSO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBtYXRjaF92aWV3LmNvbXBsZXhpdHlfbmFtZSA9IGNvbXBsZXhpdHkubmFtZTtcclxuICAgICAgICAgICAgICBpZiAoc2NlbmFyaW9zWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBtYXRjaF92aWV3LnNjZW5hcmlvX25hbWUgPSBzY2VuYXJpb3NbMF0ubmFtZTtcclxuICAgICAgICAgICAgICAgIG1hdGNoX3ZpZXcudXNlckNob2ljZSA9IHNjZW5hcmlvc1swXS5jb2RlO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBrZXlWYWx1ZUNhcGFiaWxpdHlbY2FwXSA9IG1hdGNoX3ZpZXc7XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChpc0ZvdW5kKSB7XHJcbiAgICAgICAgICAgIC8vYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChyb2xlLmRlZmF1bHRfY29tcGxleGl0aWVzKSB7XHJcbiAgICAgICAgICBmb3IgKGxldCBjYXBhYmlsaXR5IG9mIHJvbGUuZGVmYXVsdF9jb21wbGV4aXRpZXMpIHtcclxuICAgICAgICAgICAgbGV0IGNvdW50X29mX2RlZmF1bHRfY29tcGxleGl0eSA9IDA7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGNvbXBsZXhpdHkgb2YgY2FwYWJpbGl0eS5jb21wbGV4aXRpZXMpIHtcclxuICAgICAgICAgICAgICArK2NvdW50X29mX2RlZmF1bHRfY29tcGxleGl0eTtcclxuICAgICAgICAgICAgICBsZXQgY3VzdG9tX2NvZGUgPSBjYXBhYmlsaXR5LmNvZGUgKyAnXycgKyBjb21wbGV4aXR5LmNvZGU7XHJcbiAgICAgICAgICAgICAgaWYgKGN1c3RvbV9jb2RlID09PSBjYXApIHtcclxuICAgICAgICAgICAgICAgIGlzRm91bmQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgbWF0Y2hfdmlldy5zY2VuYXJpb3MgPSBjb21wbGV4aXR5LnNjZW5hcmlvcy5zbGljZSgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHNjZW5hcmlvcyA9IGNvbXBsZXhpdHkuc2NlbmFyaW9zLmZpbHRlcigoc2NlOiBTY2VuYXJpb01vZGVsKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIHNjZS5jb2RlID0gc2NlLmNvZGUucmVwbGFjZSgnLicsICdfJyk7XHJcbiAgICAgICAgICAgICAgICAgIHNjZS5jb2RlID0gc2NlLmNvZGUucmVwbGFjZSgnLicsICdfJyk7XHJcbiAgICAgICAgICAgICAgICAgIHNjZS5jb2RlID0gc2NlLmNvZGUuc3Vic3RyKHNjZS5jb2RlLmxhc3RJbmRleE9mKCdfJykgKyAxKTtcclxuICAgICAgICAgICAgICAgICAgaWYgKHNjZS5jb2RlLnN1YnN0cihzY2UuY29kZS5sYXN0SW5kZXhPZignLicpICsgMSkgPT0gY2FwYWJpbGl0eV9tYXRyaXhbY2FwXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBtYXRjaF92aWV3LmNhcGFiaWxpdHlfbmFtZSA9IGNhcGFiaWxpdHkubmFtZTtcclxuICAgICAgICAgICAgICAgIG1hdGNoX3ZpZXcuY2FwYWJpbGl0eV9jb2RlID0gY2FwYWJpbGl0eS5jb2RlO1xyXG4gICAgICAgICAgICAgICAgbWF0Y2hfdmlldy50b3RhbF9jb21wbGV4aXR5X2luX2NhcGFiaWxpdHkgPSBjYXBhYmlsaXR5LmNvbXBsZXhpdGllcy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICBtYXRjaF92aWV3LmNvbXBsZXhpdHlfbnVtYmVyID0gY291bnRfb2ZfZGVmYXVsdF9jb21wbGV4aXR5O1xyXG4gICAgICAgICAgICAgICAgbWF0Y2hfdmlldy5jb21wbGV4aXR5X25hbWUgPSBjb21wbGV4aXR5Lm5hbWU7XHJcbiAgICAgICAgICAgICAgICBtYXRjaF92aWV3LnJvbGVfbmFtZSA9IHJvbGUubmFtZTtcclxuICAgICAgICAgICAgICAgIG1hdGNoX3ZpZXcuY29kZSA9IGN1c3RvbV9jb2RlO1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChyb2xlLnNvcnRfb3JkZXIudG9TdHJpbmcoKS5sZW5ndGgudG9TdHJpbmcoKSkge1xyXG4gICAgICAgICAgICAgICAgICBjYXNlICcxJyA6XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hfdmlldy5yb2xlX3NvcnRfb3JkZXIgPSAnMDAwJyArIHJvbGUuc29ydF9vcmRlcjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgY2FzZSAnMicgOlxyXG4gICAgICAgICAgICAgICAgICAgIG1hdGNoX3ZpZXcucm9sZV9zb3J0X29yZGVyID0gJzAwJyArIHJvbGUuc29ydF9vcmRlcjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgY2FzZSAnMycgOlxyXG4gICAgICAgICAgICAgICAgICAgIG1hdGNoX3ZpZXcucm9sZV9zb3J0X29yZGVyID0gJzAnICsgcm9sZS5zb3J0X29yZGVyO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICBjYXNlICc0JyA6XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hfdmlldy5yb2xlX3NvcnRfb3JkZXIgPSByb2xlLnNvcnRfb3JkZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgIGRlZmF1bHQgOlxyXG4gICAgICAgICAgICAgICAgICAgIG1hdGNoX3ZpZXcucm9sZV9zb3J0X29yZGVyID0gJzAwMDAnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChjYXBhYmlsaXR5LnNvcnRfb3JkZXIudG9TdHJpbmcoKS5sZW5ndGgudG9TdHJpbmcoKSkge1xyXG4gICAgICAgICAgICAgICAgICBjYXNlICcxJyA6XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hfdmlldy5jYXBhYmlsaXR5X3NvcnRfb3JkZXIgPSAnMDAwJyArIGNhcGFiaWxpdHkuc29ydF9vcmRlcjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgY2FzZSAnMicgOlxyXG4gICAgICAgICAgICAgICAgICAgIG1hdGNoX3ZpZXcuY2FwYWJpbGl0eV9zb3J0X29yZGVyID0gJzAwJyArIGNhcGFiaWxpdHkuc29ydF9vcmRlcjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgY2FzZSAnMycgOlxyXG4gICAgICAgICAgICAgICAgICAgIG1hdGNoX3ZpZXcuY2FwYWJpbGl0eV9zb3J0X29yZGVyID0gJzAnICsgY2FwYWJpbGl0eS5zb3J0X29yZGVyO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICBjYXNlICc0JyA6XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hfdmlldy5jYXBhYmlsaXR5X3NvcnRfb3JkZXIgPSBjYXBhYmlsaXR5LnNvcnRfb3JkZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgIGRlZmF1bHQgOlxyXG4gICAgICAgICAgICAgICAgICAgIG1hdGNoX3ZpZXcuY2FwYWJpbGl0eV9zb3J0X29yZGVyID0gJzAwMDAnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChjb21wbGV4aXR5LnNvcnRfb3JkZXIudG9TdHJpbmcoKS5sZW5ndGgudG9TdHJpbmcoKSkge1xyXG4gICAgICAgICAgICAgICAgICBjYXNlICcxJyA6XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hfdmlldy5jb21wbGV4aXR5X3NvcnRfb3JkZXIgPSAnMDAwJyArIGNvbXBsZXhpdHkuc29ydF9vcmRlcjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgY2FzZSAnMicgOlxyXG4gICAgICAgICAgICAgICAgICAgIG1hdGNoX3ZpZXcuY29tcGxleGl0eV9zb3J0X29yZGVyID0gJzAwJyArIGNvbXBsZXhpdHkuc29ydF9vcmRlcjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgY2FzZSAnMycgOlxyXG4gICAgICAgICAgICAgICAgICAgIG1hdGNoX3ZpZXcuY29tcGxleGl0eV9zb3J0X29yZGVyID0gJzAnICsgY29tcGxleGl0eS5zb3J0X29yZGVyO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICBjYXNlICc0JyA6XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hfdmlldy5jb21wbGV4aXR5X3NvcnRfb3JkZXIgPSBjb21wbGV4aXR5LnNvcnRfb3JkZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgIGRlZmF1bHQgOlxyXG4gICAgICAgICAgICAgICAgICAgIG1hdGNoX3ZpZXcuY29tcGxleGl0eV9zb3J0X29yZGVyID0gJzAwMDAnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbWF0Y2hfdmlldy5tYWluX3NvcnRfb3JkZXIgPSBOdW1iZXIobWF0Y2hfdmlldy5yb2xlX3NvcnRfb3JkZXIgKyBtYXRjaF92aWV3LmNhcGFiaWxpdHlfc29ydF9vcmRlciArIG1hdGNoX3ZpZXcuY29tcGxleGl0eV9zb3J0X29yZGVyKTtcclxuICAgICAgICAgICAgICAgIGlmIChjb21wbGV4aXR5LnF1ZXN0aW9uRm9yQ2FuZGlkYXRlICE9PSB1bmRlZmluZWQgJiYgY29tcGxleGl0eS5xdWVzdGlvbkZvckNhbmRpZGF0ZSAhPT0gbnVsbCAmJiBjb21wbGV4aXR5LnF1ZXN0aW9uRm9yQ2FuZGlkYXRlICE9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICBtYXRjaF92aWV3LnF1ZXN0aW9uRm9yQ2FuZGlkYXRlID0gY29tcGxleGl0eS5xdWVzdGlvbkZvckNhbmRpZGF0ZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIG1hdGNoX3ZpZXcucXVlc3Rpb25Gb3JDYW5kaWRhdGUgPSBjb21wbGV4aXR5Lm5hbWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoY29tcGxleGl0eS5xdWVzdGlvbkZvclJlY3J1aXRlciAhPT0gdW5kZWZpbmVkICYmIGNvbXBsZXhpdHkucXVlc3Rpb25Gb3JSZWNydWl0ZXIgIT09IG51bGwgJiYgY29tcGxleGl0eS5xdWVzdGlvbkZvclJlY3J1aXRlciAhPT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgbWF0Y2hfdmlldy5xdWVzdGlvbkZvclJlY3J1aXRlciA9IGNvbXBsZXhpdHkucXVlc3Rpb25Gb3JSZWNydWl0ZXI7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICBtYXRjaF92aWV3LnF1ZXN0aW9uRm9yUmVjcnVpdGVyID0gY29tcGxleGl0eS5uYW1lO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGNvbXBsZXhpdHkucXVlc3Rpb25IZWFkZXJGb3JDYW5kaWRhdGUgIT09IHVuZGVmaW5lZCAmJiBjb21wbGV4aXR5LnF1ZXN0aW9uSGVhZGVyRm9yQ2FuZGlkYXRlICE9PSBudWxsICYmIGNvbXBsZXhpdHkucXVlc3Rpb25IZWFkZXJGb3JDYW5kaWRhdGUgIT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgIG1hdGNoX3ZpZXcucXVlc3Rpb25IZWFkZXJGb3JDYW5kaWRhdGUgPSBjb21wbGV4aXR5LnF1ZXN0aW9uSGVhZGVyRm9yQ2FuZGlkYXRlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgbWF0Y2hfdmlldy5xdWVzdGlvbkhlYWRlckZvckNhbmRpZGF0ZSA9IE1lc3NhZ2VzLk1TR19IRUFERVJfUVVFU1RJT05fQ0FORElEQVRFO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGNvbXBsZXhpdHkucXVlc3Rpb25IZWFkZXJGb3JSZWNydWl0ZXIgIT09IHVuZGVmaW5lZCAmJiBjb21wbGV4aXR5LnF1ZXN0aW9uSGVhZGVyRm9yUmVjcnVpdGVyICE9PSBudWxsICYmIGNvbXBsZXhpdHkucXVlc3Rpb25IZWFkZXJGb3JSZWNydWl0ZXIgIT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgIG1hdGNoX3ZpZXcucXVlc3Rpb25IZWFkZXJGb3JSZWNydWl0ZXIgPSBjb21wbGV4aXR5LnF1ZXN0aW9uSGVhZGVyRm9yUmVjcnVpdGVyO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgbWF0Y2hfdmlldy5xdWVzdGlvbkhlYWRlckZvclJlY3J1aXRlciA9IE1lc3NhZ2VzLk1TR19IRUFERVJfUVVFU1RJT05fUkVDUlVJVEVSO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHNjZW5hcmlvc1swXSkge1xyXG4gICAgICAgICAgICAgICAgICBtYXRjaF92aWV3LnNjZW5hcmlvX25hbWUgPSBzY2VuYXJpb3NbMF0ubmFtZTtcclxuICAgICAgICAgICAgICAgICAgbWF0Y2hfdmlldy51c2VyQ2hvaWNlID0gc2NlbmFyaW9zWzBdLmNvZGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBrZXlWYWx1ZUNhcGFiaWxpdHlbY2FwXSA9IG1hdGNoX3ZpZXc7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGlzRm91bmQpIHtcclxuICAgICAgICAgICAgICAvL2JyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpc0ZvdW5kKSB7XHJcbiAgICAgICAgICAvL2JyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgdmFyIG9yZGVyS2V5cyA9IGZ1bmN0aW9uIChvOiBhbnksIGY6IGFueSkge1xyXG4gICAgICBsZXQgb3M6IGFueSA9IFtdLCBrczogYW55ID0gW10sIGk6IGFueTtcclxuICAgICAgZm9yIChsZXQgaSBpbiBvKSB7XHJcbiAgICAgICAgb3MucHVzaChbaSwgb1tpXV0pO1xyXG4gICAgICB9XHJcbiAgICAgIG9zLnNvcnQoZnVuY3Rpb24gKGE6IGFueSwgYjogYW55KSB7XHJcbiAgICAgICAgcmV0dXJuIGYoYVsxXSwgYlsxXSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgb3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBrcy5wdXNoKG9zW2ldWzBdKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4ga3M7XHJcbiAgICB9O1xyXG5cclxuICAgIHZhciByZXN1bHQgPSBvcmRlcktleXMoa2V5VmFsdWVDYXBhYmlsaXR5LCBmdW5jdGlvbiAoYTogYW55LCBiOiBhbnkpIHtcclxuICAgICAgcmV0dXJuIGEubWFpbl9zb3J0X29yZGVyIC0gYi5tYWluX3NvcnRfb3JkZXI7XHJcbiAgICB9KTsgLy8gPT4gW1wiRWxlbTRcIiwgXCJFbGVtMlwiLCBcIkVsZW0xXCIsIFwiRWxlbTNcIl1cclxuICAgIC8vIGNvbnNvbGUubG9nKFwic2FtcGxlIHJlc3VsdFwiKyByZXN1bHQpO1xyXG4gICAgbGV0IHJlc3BvbnNlVG9SZXR1cm46IGFueSA9IHt9O1xyXG4gICAgZm9yIChsZXQgaSBvZiByZXN1bHQpIHtcclxuICAgICAgcmVzcG9uc2VUb1JldHVybltpXSA9IGtleVZhbHVlQ2FwYWJpbGl0eVtpXTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXNwb25zZVRvUmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgZ2V0Q2FwYWJpbGl0eU1hdHJpeChpdGVtOiBhbnksIGluZHVzdHJpZXM6IEluZHVzdHJ5TW9kZWxbXSwgbmV3X2NhcGFiaWxpdHlfbWF0cml4OiBhbnkpOiBhbnkge1xyXG4gICAgaWYgKGl0ZW0uaW5kdXN0cnkucm9sZXMgJiYgaXRlbS5pbmR1c3RyeS5yb2xlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGZvciAobGV0IHJvbGUgb2YgaXRlbS5pbmR1c3RyeS5yb2xlcykge1xyXG4gICAgICAgIGlmIChyb2xlLmRlZmF1bHRfY29tcGxleGl0aWVzKSB7XHJcbiAgICAgICAgICBmb3IgKGxldCBjYXBhYmlsaXR5IG9mICByb2xlLmRlZmF1bHRfY29tcGxleGl0aWVzKSB7XHJcbiAgICAgICAgICAgIGlmIChjYXBhYmlsaXR5LmNvZGUpIHtcclxuICAgICAgICAgICAgICBmb3IgKGxldCBtYWluUm9sZSBvZiBpbmR1c3RyaWVzWzBdLnJvbGVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocm9sZS5jb2RlLnRvU3RyaW5nKCkgPT09IG1haW5Sb2xlLmNvZGUudG9TdHJpbmcoKSkge1xyXG4gICAgICAgICAgICAgICAgICBmb3IgKGxldCBtYWluQ2FwIG9mIG1haW5Sb2xlLmRlZmF1bHRfY29tcGxleGl0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhcGFiaWxpdHkuY29kZS50b1N0cmluZygpID09PSBtYWluQ2FwLmNvZGUudG9TdHJpbmcoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgbWFpbkNvbXAgb2YgbWFpbkNhcC5jb21wbGV4aXRpZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGl0ZW1jb2RlID0gbWFpbkNhcC5jb2RlICsgJ18nICsgbWFpbkNvbXAuY29kZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uY2FwYWJpbGl0eV9tYXRyaXhbaXRlbWNvZGVdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV3X2NhcGFiaWxpdHlfbWF0cml4ICE9IHVuZGVmaW5lZCAmJiBuZXdfY2FwYWJpbGl0eV9tYXRyaXhbaXRlbWNvZGVdID09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3X2NhcGFiaWxpdHlfbWF0cml4W2l0ZW1jb2RlXSA9IC0xO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5jYXBhYmlsaXR5X21hdHJpeFtpdGVtY29kZV0gPSAtMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbS5jYXBhYmlsaXR5X21hdHJpeFtpdGVtY29kZV0gIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5ld19jYXBhYmlsaXR5X21hdHJpeCAhPSB1bmRlZmluZWQgJiYgbmV3X2NhcGFiaWxpdHlfbWF0cml4W2l0ZW1jb2RlXSA9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld19jYXBhYmlsaXR5X21hdHJpeFtpdGVtY29kZV0gPSBpdGVtLmNhcGFiaWxpdHlfbWF0cml4W2l0ZW1jb2RlXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5ld19jYXBhYmlsaXR5X21hdHJpeCAhPSB1bmRlZmluZWQgJiYgbmV3X2NhcGFiaWxpdHlfbWF0cml4W2l0ZW1jb2RlXSA9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld19jYXBhYmlsaXR5X21hdHJpeFtpdGVtY29kZV0gPSAtMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChyb2xlLmNhcGFiaWxpdGllcyAmJiByb2xlLmNhcGFiaWxpdGllcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICBmb3IgKGxldCBjYXBhYmlsaXR5IG9mIHJvbGUuY2FwYWJpbGl0aWVzKSB7XHJcbiAgICAgICAgICAgIGlmIChjYXBhYmlsaXR5LmNvZGUpIHtcclxuICAgICAgICAgICAgICBmb3IgKGxldCBtYWluUm9sZSBvZiBpbmR1c3RyaWVzWzBdLnJvbGVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocm9sZS5jb2RlLnRvU3RyaW5nKCkgPT09IG1haW5Sb2xlLmNvZGUudG9TdHJpbmcoKSkge1xyXG4gICAgICAgICAgICAgICAgICBmb3IgKGxldCBtYWluQ2FwIG9mIG1haW5Sb2xlLmNhcGFiaWxpdGllcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjYXBhYmlsaXR5LmNvZGUudG9TdHJpbmcoKSA9PT0gbWFpbkNhcC5jb2RlLnRvU3RyaW5nKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IG1haW5Db21wIG9mIG1haW5DYXAuY29tcGxleGl0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpdGVtY29kZSA9IG1haW5DYXAuY29kZSArICdfJyArIG1haW5Db21wLmNvZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLmNhcGFiaWxpdHlfbWF0cml4W2l0ZW1jb2RlXSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3X2NhcGFiaWxpdHlfbWF0cml4W2l0ZW1jb2RlXSA9IC0xO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uY2FwYWJpbGl0eV9tYXRyaXhbaXRlbWNvZGVdID0gLTE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbS5jYXBhYmlsaXR5X21hdHJpeCAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdfY2FwYWJpbGl0eV9tYXRyaXhbaXRlbWNvZGVdID0gaXRlbS5jYXBhYmlsaXR5X21hdHJpeFtpdGVtY29kZV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3X2NhcGFiaWxpdHlfbWF0cml4W2l0ZW1jb2RlXSA9IC0xO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbmV3X2NhcGFiaWxpdHlfbWF0cml4O1xyXG4gIH1cclxuXHJcbiAgZ2V0TGlzdChpdGVtOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxldCBxdWVyeSA9IHtcclxuICAgICAgJ3Bvc3RlZEpvYnMuX2lkJzogeyRpbjogaXRlbS5pZHN9LFxyXG4gICAgfTtcclxuICAgIHRoaXMucmVjcnVpdGVyUmVwb3NpdG9yeS5yZXRyaWV2ZShxdWVyeSwgKGVyciwgcmVzKSA9PiB7XHJcbiAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMucmVjcnVpdGVyUmVwb3NpdG9yeS5nZXRKb2JQcm9maWxlUUNhcmQocmVzLCBpdGVtLmNhbmRpZGF0ZSwgaXRlbS5pZHMsICdub25lJywgKGNhbkVycm9yLCBjYW5SZXN1bHQpID0+IHtcclxuICAgICAgICAgIGlmIChjYW5FcnJvcikge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhjYW5FcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCBjYW5SZXN1bHQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGxvYWRDYXBhYmlsaXRpRGV0YWlscyhjYXBhYmlsaXR5TWF0cml4OiBhbnkpIHtcclxuICAgIGxldCBjYXBhYmlsaXR5TWF0cml4S2V5czogc3RyaW5nIFtdID0gT2JqZWN0LmtleXMoY2FwYWJpbGl0eU1hdHJpeCk7XHJcbiAgICBsZXQgY2FwYWJpbGl0aWVzQXJyYXk6IGFueSBbXSA9IG5ldyBBcnJheSgpO1xyXG4gICAgZm9yIChsZXQga2V5cyBvZiBjYXBhYmlsaXR5TWF0cml4S2V5cykge1xyXG4gICAgICBsZXQgY2FwYWJpbGl0eU9iamVjdCA9IHtcclxuICAgICAgICAnY2FwYWJpbGl0eUNvZGUnOiBrZXlzLnNwbGl0KCdfJylbMF0sXHJcbiAgICAgICAgJ2NvbXBsZXhpdHlDb2RlJzoga2V5cy5zcGxpdCgnXycpWzFdLFxyXG4gICAgICAgICdzY2VuZXJpb0NvZGUnOiBjYXBhYmlsaXR5TWF0cml4W2tleXNdXHJcbiAgICAgIH1cclxuICAgICAgY2FwYWJpbGl0aWVzQXJyYXkucHVzaChjYXBhYmlsaXR5T2JqZWN0KTtcclxuICAgIH1cclxuICAgIHJldHVybiBjYXBhYmlsaXRpZXNBcnJheTtcclxuICB9XHJcblxyXG4gIGxvYWRSb2xlcyhyb2xlczogYW55W10pIHtcclxuICAgIGxldCBzZWxlY3RlZFJvbGVzIDogc3RyaW5nW10gPSBuZXcgQXJyYXkoKTtcclxuICAgIGZvcihsZXQgcm9sZSBvZiByb2xlcykge1xyXG4gICAgICBzZWxlY3RlZFJvbGVzLnB1c2gocm9sZS5uYW1lKTtcclxuICAgIH1cclxuICAgIHJldHVybiBzZWxlY3RlZFJvbGVzO1xyXG4gIH1cclxuXHJcbiAgZ2V0VG90YWxDYW5kaWRhdGVDb3VudChjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBsZXQgcXVlcnkgPSB7fTtcclxuICAgIHRoaXMuY2FuZGlkYXRlUmVwb3NpdG9yeS5nZXRDb3VudChxdWVyeSwgKGVyciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNhbGxiYWNrKGVyciwgcmVzdWx0KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxufVxyXG5cclxuT2JqZWN0LnNlYWwoQ2FuZGlkYXRlU2VydmljZSk7XHJcbmV4cG9ydCA9IENhbmRpZGF0ZVNlcnZpY2U7XHJcbiJdfQ==
