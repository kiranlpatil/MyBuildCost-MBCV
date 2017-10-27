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
        customCandidate.capabilities = this.getCapabilitiesBuild(candidate.capability_matrix, candidate.complexity_note_matrix, candidate.industry.roles, industries);
        return customCandidate;
    };
    CandidateService.prototype.getCapabilitiesBuild = function (capability_matrix, complexity_note_matrix, roles, industries) {
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
                                            if (complexity_note_matrix[cap] !== undefined) {
                                                newComplexity.note = complexity_note_matrix[cap];
                                            }
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
                                                if (complexity_note_matrix[cap] !== undefined) {
                                                    newComplexity_1.note = complexity_note_matrix[cap];
                                                }
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
                                            if (complexity_note_matrix[cap] !== undefined) {
                                                newComplexity.note = complexity_note_matrix[cap];
                                            }
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
                                                if (complexity_note_matrix[cap] !== undefined) {
                                                    newComplexity_2.note = complexity_note_matrix[cap];
                                                }
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
        this.candidateRepository.findByIdwithExclude(_id, { complexity_note_matrix: 1, capability_matrix: 1, 'industry.name': 1 }, function (err, res) {
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
                        var capabilityMatrrixWithNotes = _this.getCapabilityMatrixWithNotes(new_capability_matrix, res.complexity_note_matrix);
                        callback(null, new_capability_matrix);
                    }
                });
            }
        });
    };
    CandidateService.prototype.getCapabilityValueKeyMatrixBuild = function (capability_matrix, industries, complexity_musthave_matrix) {
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
                            if (complexity_musthave_matrix && complexity_musthave_matrix[cap] !== undefined) {
                                match_view.complexityIsMustHave = complexity_musthave_matrix[cap];
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
                                if (complexity_musthave_matrix && complexity_musthave_matrix[cap] !== undefined) {
                                    match_view.complexityIsMustHave = complexity_musthave_matrix[cap];
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
            var keyArray = keys.split('_');
            var capabilityObject = {
                'capabilityCode': keyArray[0],
                'complexityCode': keyArray[1],
                'scenerioCode': capabilityMatrix[keys]
            };
            capabilitiesArray.push(capabilityObject);
        }
        return capabilitiesArray;
    };
    CandidateService.prototype.loadRoles = function (roles) {
        var selectedRoles = '';
        for (var _i = 0, roles_2 = roles; _i < roles_2.length; _i++) {
            var role = roles_2[_i];
            selectedRoles = selectedRoles + ' $' + role.name;
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
    CandidateService.prototype.getCapabilityMatrixWithNotes = function (capability_matrix, complexity_note_matrix) {
        for (var cap in complexity_note_matrix) {
            if (capability_matrix[cap]) {
                capability_matrix[cap].complexityNote = complexity_note_matrix[cap];
            }
        }
        return capability_matrix;
    };
    CandidateService.prototype.updateField = function (_id, item, callback) {
        this.candidateRepository.updateByUserId(new mongoose.Types.ObjectId(_id), item, callback);
    };
    return CandidateService;
}());
Object.seal(CandidateService);
module.exports = CandidateService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2VydmljZXMvY2FuZGlkYXRlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLG1DQUFxQztBQUNyQyw2Q0FBZ0Q7QUFDaEQsbUZBQXNGO0FBQ3RGLHlFQUE0RTtBQUM1RSxpRkFBb0Y7QUFDcEYsbUZBQXNGO0FBQ3RGLGlGQUFvRjtBQUdwRixxRUFBd0U7QUFDeEUsK0VBQWtGO0FBR2xGLHFGQUF3RjtBQUN4RixxRkFBd0Y7QUFHeEYsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CO0lBUUU7UUFDRSxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxtQkFBbUIsRUFBRSxDQUFDO1FBQ3JELElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQztRQUMzQyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxtQkFBbUIsRUFBRSxDQUFDO1FBQ3JELElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLGtCQUFrQixFQUFFLENBQUM7UUFDbkQsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksa0JBQWtCLEVBQUUsQ0FBQztJQUNyRCxDQUFDO0lBRUQscUNBQVUsR0FBVixVQUFXLElBQVMsRUFBRSxRQUEyQztRQUFqRSxpQkFnREM7UUEvQ0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsRUFBQyxHQUFHLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFDLEVBQUUsRUFBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBQyxDQUFDLEVBQUMsRUFBRSxVQUFDLEdBQUcsRUFBRSxHQUFHO1lBQzNHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsUUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxF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TSxDQUFDLENBQUM7WUFDeEIsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELHVEQUE0QixHQUE1QixVQUE2QixpQkFBc0IsRUFBQyxzQkFBMEI7UUFDNUUsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksc0JBQXNCLENBQUMsQ0FBQyxDQUFDO1lBQ3ZDLEVBQUUsQ0FBQSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDMUIsaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUMsY0FBYyxHQUFHLHNCQUFzQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3RFLENBQUM7UUFDSCxDQUFDO1FBQ0gsTUFBTSxDQUFDLGlCQUFpQixDQUFDO0lBQ3pCLENBQUM7SUFHRCxzQ0FBVyxHQUFYLFVBQVksR0FBVSxFQUFFLElBQVEsRUFBRSxRQUF3QztRQUN4RSxJQUFJLENBQUMsbUJBQW1CLENBQUMsY0FBYyxDQUFFLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzdGLENBQUM7SUFFSCx1QkFBQztBQUFELENBOXhCQSxBQTh4QkMsSUFBQTtBQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUM5QixpQkFBUyxnQkFBZ0IsQ0FBQyIsImZpbGUiOiJhcHAvZnJhbWV3b3JrL3NlcnZpY2VzL2NhbmRpZGF0ZS5zZXJ2aWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgbW9uZ29vc2UgZnJvbSBcIm1vbmdvb3NlXCI7XHJcbmltcG9ydCBNZXNzYWdlcyA9IHJlcXVpcmUoJy4uL3NoYXJlZC9tZXNzYWdlcycpO1xyXG5pbXBvcnQgQ2FuZGlkYXRlUmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9jYW5kaWRhdGUucmVwb3NpdG9yeScpO1xyXG5pbXBvcnQgVXNlclJlcG9zaXRvcnkgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL3JlcG9zaXRvcnkvdXNlci5yZXBvc2l0b3J5Jyk7XHJcbmltcG9ydCBMb2NhdGlvblJlcG9zaXRvcnkgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL3JlcG9zaXRvcnkvbG9jYXRpb24ucmVwb3NpdG9yeScpO1xyXG5pbXBvcnQgUmVjcnVpdGVyUmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9yZWNydWl0ZXIucmVwb3NpdG9yeScpO1xyXG5pbXBvcnQgSW5kdXN0cnlSZXBvc2l0b3J5ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L2luZHVzdHJ5LnJlcG9zaXRvcnknKTtcclxuaW1wb3J0IEluZHVzdHJ5TW9kZWwgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL2luZHVzdHJ5Lm1vZGVsJyk7XHJcbmltcG9ydCBTY2VuYXJpb01vZGVsID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9zY2VuYXJpby5tb2RlbCcpO1xyXG5pbXBvcnQgTWF0Y2hWaWV3TW9kZWwgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL21hdGNoLXZpZXcubW9kZWwnKTtcclxuaW1wb3J0IENhbmRpZGF0ZUNsYXNzTW9kZWwgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL2NhbmRpZGF0ZS1jbGFzcy5tb2RlbCcpO1xyXG5pbXBvcnQgSUNhbmRpZGF0ZSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9uZ29vc2UvY2FuZGlkYXRlJyk7XHJcbmltcG9ydCBVc2VyID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb25nb29zZS91c2VyJyk7XHJcbmltcG9ydCBDYXBhYmlsaXRpZXNDbGFzc01vZGVsID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9jYXBhYmlsaXRpZXMtY2xhc3MubW9kZWwnKTtcclxuaW1wb3J0IENvbXBsZXhpdGllc0NsYXNzTW9kZWwgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL2NvbXBsZXhpdGllcy1jbGFzcy5tb2RlbCcpO1xyXG5pbXBvcnQgUm9sZU1vZGVsID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9yb2xlLm1vZGVsJyk7XHJcbmltcG9ydCB7dW5kZXJsaW5lfSBmcm9tIFwiY2hhbGtcIjtcclxubGV0IGJjcnlwdCA9IHJlcXVpcmUoJ2JjcnlwdCcpO1xyXG5jbGFzcyBDYW5kaWRhdGVTZXJ2aWNlIHtcclxuICBwcml2YXRlIGNhbmRpZGF0ZVJlcG9zaXRvcnk6IENhbmRpZGF0ZVJlcG9zaXRvcnk7XHJcbiAgcHJpdmF0ZSByZWNydWl0ZXJSZXBvc2l0b3J5OiBSZWNydWl0ZXJSZXBvc2l0b3J5O1xyXG4gIHByaXZhdGUgaW5kdXN0cnlSZXBvc2l0aXJ5OiBJbmR1c3RyeVJlcG9zaXRvcnk7XHJcbiAgcHJpdmF0ZSB1c2VyUmVwb3NpdG9yeTogVXNlclJlcG9zaXRvcnk7XHJcbiAgcHJpdmF0ZSBsb2NhdGlvblJlcG9zaXRvcnk6IExvY2F0aW9uUmVwb3NpdG9yeTtcclxuXHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5jYW5kaWRhdGVSZXBvc2l0b3J5ID0gbmV3IENhbmRpZGF0ZVJlcG9zaXRvcnkoKTtcclxuICAgIHRoaXMudXNlclJlcG9zaXRvcnkgPSBuZXcgVXNlclJlcG9zaXRvcnkoKTtcclxuICAgIHRoaXMucmVjcnVpdGVyUmVwb3NpdG9yeSA9IG5ldyBSZWNydWl0ZXJSZXBvc2l0b3J5KCk7XHJcbiAgICB0aGlzLmxvY2F0aW9uUmVwb3NpdG9yeSA9IG5ldyBMb2NhdGlvblJlcG9zaXRvcnkoKTtcclxuICAgIHRoaXMuaW5kdXN0cnlSZXBvc2l0aXJ5ID0gbmV3IEluZHVzdHJ5UmVwb3NpdG9yeSgpO1xyXG4gIH1cclxuXHJcbiAgY3JlYXRlVXNlcihpdGVtOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGNvbnNvbGUubG9nKCdVU2VyIGlzJywgaXRlbSk7XHJcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LnJldHJpZXZlKHskb3I6IFt7J2VtYWlsJzogaXRlbS5lbWFpbH0sIHsnbW9iaWxlX251bWJlcic6IGl0ZW0ubW9iaWxlX251bWJlcn1dfSwgKGVyciwgcmVzKSA9PiB7XHJcbiAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoZXJyKSwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSBpZiAocmVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBpZiAocmVzWzBdLmlzQWN0aXZhdGVkID09PSB0cnVlKSB7XHJcbiAgICAgICAgICBpZiAocmVzWzBdLmVtYWlsID09PSBpdGVtLmVtYWlsKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihNZXNzYWdlcy5NU0dfRVJST1JfUkVHSVNUUkFUSU9OKSwgbnVsbCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAocmVzWzBdLm1vYmlsZV9udW1iZXIgPT09IGl0ZW0ubW9iaWxlX251bWJlcikge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoTWVzc2FnZXMuTVNHX0VSUk9SX1JFR0lTVFJBVElPTl9NT0JJTEVfTlVNQkVSKSwgbnVsbCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChyZXNbMF0uaXNBY3RpdmF0ZWQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoTWVzc2FnZXMuTVNHX0VSUk9SX1ZFUklGWV9BQ0NPVU5UKSwgbnVsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IHNhbHRSb3VuZHMgPSAxMDtcclxuICAgICAgICBiY3J5cHQuaGFzaChpdGVtLnBhc3N3b3JkLCBzYWx0Um91bmRzLCAoZXJyOiBhbnksIGhhc2g6IGFueSkgPT4ge1xyXG4gICAgICAgICAgLy8gU3RvcmUgaGFzaCBpbiB5b3VyIHBhc3N3b3JkIERCLlxyXG4gICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoTWVzc2FnZXMuTVNHX0VSUk9SX0JDUllQVF9DUkVBVElPTiksIG51bGwpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaXRlbS5wYXNzd29yZCA9IGhhc2g7XHJcbiAgICAgICAgICAgIHRoaXMudXNlclJlcG9zaXRvcnkuY3JlYXRlKGl0ZW0sIChlcnIsIHJlcykgPT4ge1xyXG4gICAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihNZXNzYWdlcy5NU0dfRVJST1JfUkVHSVNUUkFUSU9OX01PQklMRV9OVU1CRVIpLCBudWxsKTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbGV0IHVzZXJJZDEgPSByZXMuX2lkO1xyXG4gICAgICAgICAgICAgICAgbGV0IG5ld0l0ZW06IGFueSA9IHtcclxuICAgICAgICAgICAgICAgICAgdXNlcklkOiB1c2VySWQxLFxyXG4gICAgICAgICAgICAgICAgICBsb2NhdGlvbjogaXRlbS5sb2NhdGlvblxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2FuZGlkYXRlUmVwb3NpdG9yeS5jcmVhdGUobmV3SXRlbSwgKGVycjogYW55LCByZXM6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcclxuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCByZXMpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGl0ZW0uaXNDYW5kaWRhdGUgPSB0cnVlO1xyXG5cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZXRyaWV2ZShmaWVsZDogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0aGlzLmNhbmRpZGF0ZVJlcG9zaXRvcnkucmV0cmlldmUoZmllbGQsIChlcnIsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAocmVzdWx0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIHJlc3VsdFswXS5hY2FkZW1pY3MgPSByZXN1bHRbMF0uYWNhZGVtaWNzLnNvcnQoZnVuY3Rpb24gKGE6IGFueSwgYjogYW55KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBiLnllYXJPZlBhc3NpbmcgLSBhLnllYXJPZlBhc3Npbmc7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHJlc3VsdFswXS5hd2FyZHMgPSByZXN1bHRbMF0uYXdhcmRzLnNvcnQoZnVuY3Rpb24gKGE6IGFueSwgYjogYW55KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBiLnllYXIgLSBhLnllYXI7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHJlc3VsdFswXS5jZXJ0aWZpY2F0aW9ucyA9IHJlc3VsdFswXS5jZXJ0aWZpY2F0aW9ucy5zb3J0KGZ1bmN0aW9uIChhOiBhbnksIGI6IGFueSkge1xyXG4gICAgICAgICAgICByZXR1cm4gYi55ZWFyIC0gYS55ZWFyO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzdWx0KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmV0cmlldmVBbGwoaXRlbTogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0aGlzLmNhbmRpZGF0ZVJlcG9zaXRvcnkucmV0cmlldmUoaXRlbSwgKGVyciwgcmVzKSA9PiB7XHJcbiAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoTWVzc2FnZXMuTVNHX05PX1JFQ09SRFNfRk9VTkQpLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCByZXMpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICByZXRyaWV2ZVdpdGhMZWFuKGZpZWxkOiBhbnksIHByb2plY3Rpb246IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgdGhpcy5jYW5kaWRhdGVSZXBvc2l0b3J5LnJldHJpZXZlV2l0aExlYW4oZmllbGQsIHByb2plY3Rpb24sIGNhbGxiYWNrKTtcclxuICB9XHJcblxyXG4gIGZpbmRCeUlkKGlkOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIHRoaXMuY2FuZGlkYXRlUmVwb3NpdG9yeS5maW5kQnlJZChpZCwgY2FsbGJhY2spO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlKF9pZDogc3RyaW5nLCBpdGVtOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuXHJcbiAgICB0aGlzLmNhbmRpZGF0ZVJlcG9zaXRvcnkucmV0cmlldmUoeyd1c2VySWQnOiBuZXcgbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQoX2lkKX0sIChlcnIsIHJlcykgPT4ge1xyXG4gICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyLCByZXMpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuaW5kdXN0cnlSZXBvc2l0aXJ5LnJldHJpZXZlKHsnbmFtZSc6IGl0ZW0uaW5kdXN0cnkubmFtZX0sIChlcnJvcjogYW55LCBpbmR1c3RyaWVzOiBJbmR1c3RyeU1vZGVsW10pID0+IHtcclxuICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgY2FsbGJhY2soZXJyLCByZXMpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChpdGVtLmNhcGFiaWxpdHlfbWF0cml4ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICBpdGVtLmNhcGFiaWxpdHlfbWF0cml4ID0ge307XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IG5ld19jYXBhYmlsaXR5X21hdHJpeDogYW55ID0ge307XHJcbiAgICAgICAgICAgIGl0ZW0uY2FwYWJpbGl0eV9tYXRyaXggPSB0aGlzLmdldENhcGFiaWxpdHlNYXRyaXgoaXRlbSwgaW5kdXN0cmllcywgbmV3X2NhcGFiaWxpdHlfbWF0cml4KTtcclxuICAgICAgICAgICAgdGhpcy5jYW5kaWRhdGVSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGVJbmR1c3RyeSh7J19pZCc6IHJlc1swXS5faWR9LCBpdGVtLCB7bmV3OiB0cnVlfSwgY2FsbGJhY2spO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldChfaWQ6IHN0cmluZywgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5yZXRyaWV2ZSh7J19pZCc6IF9pZH0sIChlcnIsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmNhbmRpZGF0ZVJlcG9zaXRvcnkucmV0cmlldmUoeyd1c2VySWQnOiBuZXcgbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQocmVzdWx0WzBdLl9pZCl9LCAoZXJyLCByZXMpID0+IHtcclxuICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5kdXN0cnlSZXBvc2l0aXJ5LnJldHJpZXZlKHsnY29kZSc6IHJlc1swXS5pbmR1c3RyeS5jb2RlfSwgKGVycm9yOiBhbnksIGluZHVzdHJpZXM6IEluZHVzdHJ5TW9kZWxbXSkgPT4ge1xyXG4gICAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVzcG9uc2U6IGFueSA9IHRoaXMuZ2V0Q2FuZGlkYXRlRGV0YWlsKHJlc1swXSwgcmVzdWx0WzBdLCBpbmR1c3RyaWVzKTtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldENhbmRpZGF0ZURldGFpbChjYW5kaWRhdGU6IElDYW5kaWRhdGUsIHVzZXI6IFVzZXIsIGluZHVzdHJpZXM6IEluZHVzdHJ5TW9kZWxbXSk6IENhbmRpZGF0ZUNsYXNzTW9kZWwge1xyXG4gICAgbGV0IGN1c3RvbUNhbmRpZGF0ZTogQ2FuZGlkYXRlQ2xhc3NNb2RlbCA9IG5ldyBDYW5kaWRhdGVDbGFzc01vZGVsKCk7XHJcbiAgICBjdXN0b21DYW5kaWRhdGUucGVyc29uYWxEZXRhaWxzID0gdXNlcjtcclxuICAgIGN1c3RvbUNhbmRpZGF0ZS5qb2JUaXRsZSA9IGNhbmRpZGF0ZS5qb2JUaXRsZTtcclxuICAgIGN1c3RvbUNhbmRpZGF0ZS5sb2NhdGlvbiA9IGNhbmRpZGF0ZS5sb2NhdGlvbjtcclxuICAgIGN1c3RvbUNhbmRpZGF0ZS5wcm9mZXNzaW9uYWxEZXRhaWxzID0gY2FuZGlkYXRlLnByb2Zlc3Npb25hbERldGFpbHM7XHJcbiAgICBjdXN0b21DYW5kaWRhdGUuYWNhZGVtaWNzID0gY2FuZGlkYXRlLmFjYWRlbWljcztcclxuICAgIGN1c3RvbUNhbmRpZGF0ZS5lbXBsb3ltZW50SGlzdG9yeSA9IGNhbmRpZGF0ZS5lbXBsb3ltZW50SGlzdG9yeTtcclxuICAgIGN1c3RvbUNhbmRpZGF0ZS5jZXJ0aWZpY2F0aW9ucyA9IGNhbmRpZGF0ZS5jZXJ0aWZpY2F0aW9ucztcclxuICAgIGN1c3RvbUNhbmRpZGF0ZS5hd2FyZHMgPSBjYW5kaWRhdGUuYXdhcmRzO1xyXG4gICAgY3VzdG9tQ2FuZGlkYXRlLmludGVyZXN0ZWRJbmR1c3RyaWVzID0gY2FuZGlkYXRlLmludGVyZXN0ZWRJbmR1c3RyaWVzO1xyXG4gICAgY3VzdG9tQ2FuZGlkYXRlLnByb2ZpY2llbmNpZXMgPSBjYW5kaWRhdGUucHJvZmljaWVuY2llcztcclxuICAgIGN1c3RvbUNhbmRpZGF0ZS5hYm91dE15c2VsZiA9IGNhbmRpZGF0ZS5hYm91dE15c2VsZjtcclxuICAgIGN1c3RvbUNhbmRpZGF0ZS5jYXBhYmlsaXRpZXMgPSBbXTtcclxuICAgIGN1c3RvbUNhbmRpZGF0ZS5pbmR1c3RyeSA9IGNhbmRpZGF0ZS5pbmR1c3RyeTtcclxuICAgIGN1c3RvbUNhbmRpZGF0ZS5pc1N1Ym1pdHRlZCA9IGNhbmRpZGF0ZS5pc1N1Ym1pdHRlZDtcclxuICAgIGN1c3RvbUNhbmRpZGF0ZS5pc1Zpc2libGUgPSBjYW5kaWRhdGUuaXNWaXNpYmxlO1xyXG4gICAgY3VzdG9tQ2FuZGlkYXRlLmlzQ29tcGxldGVkID0gY2FuZGlkYXRlLmlzQ29tcGxldGVkO1xyXG4gICAgY3VzdG9tQ2FuZGlkYXRlLmNhcGFiaWxpdGllcyA9IHRoaXMuZ2V0Q2FwYWJpbGl0aWVzQnVpbGQoY2FuZGlkYXRlLmNhcGFiaWxpdHlfbWF0cml4LGNhbmRpZGF0ZS5jb21wbGV4aXR5X25vdGVfbWF0cml4LCBjYW5kaWRhdGUuaW5kdXN0cnkucm9sZXMsIGluZHVzdHJpZXMpO1xyXG5cclxuICAgIHJldHVybiBjdXN0b21DYW5kaWRhdGU7XHJcbiAgfVxyXG5cclxuICBnZXRDYXBhYmlsaXRpZXNCdWlsZChjYXBhYmlsaXR5X21hdHJpeDogYW55LGNvbXBsZXhpdHlfbm90ZV9tYXRyaXg6YW55LCByb2xlczogUm9sZU1vZGVsW10sIGluZHVzdHJpZXM6IEluZHVzdHJ5TW9kZWxbXSk6IENhcGFiaWxpdGllc0NsYXNzTW9kZWxbXSB7XHJcbiAgICBsZXQgY2FwYWJpbGl0aWVzOiBDYXBhYmlsaXRpZXNDbGFzc01vZGVsW10gPSBuZXcgQXJyYXkoMCk7XHJcblxyXG4gICAgZm9yIChsZXQgY2FwIGluIGNhcGFiaWxpdHlfbWF0cml4KSB7XHJcblxyXG4gICAgICBmb3IgKGxldCByb2xlIG9mIGluZHVzdHJpZXNbMF0ucm9sZXMpIHtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgY2FuZGlkYXRlUm9sZSBvZiByb2xlcykge1xyXG4gICAgICAgICAgaWYgKGNhbmRpZGF0ZVJvbGUuY29kZS50b1N0cmluZygpID09PSByb2xlLmNvZGUudG9TdHJpbmcoKSkge1xyXG4gICAgICAgICAgICBsZXQgZGVmYXVsdENvbXBsZXhpdHlDb2RlID0gY2FwLnNwbGl0KCdfJylbMF07XHJcblxyXG4gICAgICAgICAgICBpZiAocm9sZS5kZWZhdWx0X2NvbXBsZXhpdGllcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgaWYgKGRlZmF1bHRDb21wbGV4aXR5Q29kZS50b1N0cmluZygpID09PSByb2xlLmRlZmF1bHRfY29tcGxleGl0aWVzWzBdLmNvZGUudG9TdHJpbmcoKSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGlzRm91bmQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGxldCBmb3VuZGVkRGVmYXVsdENhcGFiaWxpdHk6IENhcGFiaWxpdGllc0NsYXNzTW9kZWw7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBjIG9mIGNhcGFiaWxpdGllcykge1xyXG4gICAgICAgICAgICAgICAgICBpZiAoYy5jb2RlID09PSBkZWZhdWx0Q29tcGxleGl0eUNvZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3VuZGVkRGVmYXVsdENhcGFiaWxpdHkgPSBjO1xyXG4gICAgICAgICAgICAgICAgICAgIGlzRm91bmQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoIWlzRm91bmQpIHtcclxuICAgICAgICAgICAgICAgICAgbGV0IG5ld0NhcGFiaWxpdHk6IENhcGFiaWxpdGllc0NsYXNzTW9kZWwgPSBuZXcgQ2FwYWJpbGl0aWVzQ2xhc3NNb2RlbCgpO1xyXG4gICAgICAgICAgICAgICAgICBuZXdDYXBhYmlsaXR5Lm5hbWUgPSByb2xlLmRlZmF1bHRfY29tcGxleGl0aWVzWzBdLm5hbWU7XHJcbiAgICAgICAgICAgICAgICAgIG5ld0NhcGFiaWxpdHkuY29kZSA9IHJvbGUuZGVmYXVsdF9jb21wbGV4aXRpZXNbMF0uY29kZTtcclxuICAgICAgICAgICAgICAgICAgbmV3Q2FwYWJpbGl0eS5zb3J0X29yZGVyID0gcm9sZS5kZWZhdWx0X2NvbXBsZXhpdGllc1swXS5zb3J0X29yZGVyO1xyXG4gICAgICAgICAgICAgICAgICBsZXQgbmV3Q29tcGxleGl0aWVzOiBDb21wbGV4aXRpZXNDbGFzc01vZGVsW10gPSBuZXcgQXJyYXkoMCk7XHJcbiAgICAgICAgICAgICAgICAgIGZvciAobGV0IGNvbXBsZXhpdHkgb2Ygcm9sZS5kZWZhdWx0X2NvbXBsZXhpdGllc1swXS5jb21wbGV4aXRpZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgY29tcGxleGl0eUNvZGUgPSBjYXAuc3BsaXQoJ18nKVsxXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBsZXhpdHlDb2RlID09PSBjb21wbGV4aXR5LmNvZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIGxldCBuZXdDb21wbGV4aXR5OiBDb21wbGV4aXRpZXNDbGFzc01vZGVsID0gbmV3IENvbXBsZXhpdGllc0NsYXNzTW9kZWwoKTtcclxuICAgICAgICAgICAgICAgICAgICAgIG5ld0NvbXBsZXhpdHkubmFtZSA9IGNvbXBsZXhpdHkubmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgIG5ld0NvbXBsZXhpdHkuc29ydF9vcmRlciA9IGNvbXBsZXhpdHkuc29ydF9vcmRlcjtcclxuICAgICAgICAgICAgICAgICAgICAgIG5ld0NvbXBsZXhpdHkuY29kZSA9IGNvbXBsZXhpdHkuY29kZTtcclxuICAgICAgICAgICAgICAgICAgICAgIGlmKGNvbXBsZXhpdHlfbm90ZV9tYXRyaXhbY2FwXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0NvbXBsZXhpdHkubm90ZSA9IGNvbXBsZXhpdHlfbm90ZV9tYXRyaXhbY2FwXTtcclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgIGlmIChjb21wbGV4aXR5LnF1ZXN0aW9uRm9yQ2FuZGlkYXRlICE9PSB1bmRlZmluZWQgJiYgY29tcGxleGl0eS5xdWVzdGlvbkZvckNhbmRpZGF0ZSAhPT0gbnVsbCAmJiBjb21wbGV4aXR5LnF1ZXN0aW9uRm9yQ2FuZGlkYXRlICE9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdDb21wbGV4aXR5LnF1ZXN0aW9uRm9yQ2FuZGlkYXRlID0gY29tcGxleGl0eS5xdWVzdGlvbkZvckNhbmRpZGF0ZTtcclxuICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0NvbXBsZXhpdHkucXVlc3Rpb25Gb3JDYW5kaWRhdGUgPSBjb21wbGV4aXR5Lm5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBzY2VuYXJpbyBvZiBjb21wbGV4aXR5LnNjZW5hcmlvcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FwYWJpbGl0eV9tYXRyaXhbY2FwXS50b1N0cmluZygpID09PSBzY2VuYXJpby5jb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3Q29tcGxleGl0eS5hbnN3ZXIgPSBzY2VuYXJpby5uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgbmV3Q29tcGxleGl0aWVzLnB1c2gobmV3Q29tcGxleGl0eSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICBuZXdDb21wbGV4aXRpZXMgPSB0aGlzLmdldFNvcnRlZExpc3QobmV3Q29tcGxleGl0aWVzLCBcInNvcnRfb3JkZXJcIik7XHJcbiAgICAgICAgICAgICAgICAgIG5ld0NhcGFiaWxpdHkuY29tcGxleGl0aWVzID0gbmV3Q29tcGxleGl0aWVzO1xyXG4gICAgICAgICAgICAgICAgICBjYXBhYmlsaXRpZXMucHVzaChuZXdDYXBhYmlsaXR5KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIGxldCBpc0NvbUZvdW5kOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgIGxldCBGb3VuZGVkQ29tcGxleGl0eTogQ29tcGxleGl0aWVzQ2xhc3NNb2RlbDtcclxuICAgICAgICAgICAgICAgICAgZm9yIChsZXQgY29tcGxleGl0eSBvZiBmb3VuZGVkRGVmYXVsdENhcGFiaWxpdHkuY29tcGxleGl0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBsZXhpdHkuY29kZSA9PT0gY2FwLnNwbGl0KCdfJylbMV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgIEZvdW5kZWRDb21wbGV4aXR5ID0gY29tcGxleGl0eTtcclxuICAgICAgICAgICAgICAgICAgICAgIGlzQ29tRm91bmQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICBpZiAoIWlzQ29tRm91bmQpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbmV3Q29tcGxleGl0eTogQ29tcGxleGl0aWVzQ2xhc3NNb2RlbCA9IG5ldyBDb21wbGV4aXRpZXNDbGFzc01vZGVsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgY29tcGxleGl0eSBvZiByb2xlLmRlZmF1bHRfY29tcGxleGl0aWVzWzBdLmNvbXBsZXhpdGllcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgbGV0IGNvbXBsZXhpdHlDb2RlID0gY2FwLnNwbGl0KCdfJylbMV07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBsZXhpdHlDb2RlID09PSBjb21wbGV4aXR5LmNvZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5ld0NvbXBsZXhpdHk6IENvbXBsZXhpdGllc0NsYXNzTW9kZWwgPSBuZXcgQ29tcGxleGl0aWVzQ2xhc3NNb2RlbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdDb21wbGV4aXR5Lm5hbWUgPSBjb21wbGV4aXR5Lm5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0NvbXBsZXhpdHkuc29ydF9vcmRlciA9IGNvbXBsZXhpdHkuc29ydF9vcmRlcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3Q29tcGxleGl0eS5jb2RlID0gY29tcGxleGl0eS5jb2RlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihjb21wbGV4aXR5X25vdGVfbWF0cml4W2NhcF0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0NvbXBsZXhpdHkubm90ZSA9IGNvbXBsZXhpdHlfbm90ZV9tYXRyaXhbY2FwXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29tcGxleGl0eS5xdWVzdGlvbkZvckNhbmRpZGF0ZSAhPT0gdW5kZWZpbmVkICYmIGNvbXBsZXhpdHkucXVlc3Rpb25Gb3JDYW5kaWRhdGUgIT09IG51bGwgJiYgY29tcGxleGl0eS5xdWVzdGlvbkZvckNhbmRpZGF0ZSAhPT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdDb21wbGV4aXR5LnF1ZXN0aW9uRm9yQ2FuZGlkYXRlID0gY29tcGxleGl0eS5xdWVzdGlvbkZvckNhbmRpZGF0ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdDb21wbGV4aXR5LnF1ZXN0aW9uRm9yQ2FuZGlkYXRlID0gY29tcGxleGl0eS5uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IHNjZW5hcmlvIG9mIGNvbXBsZXhpdHkuc2NlbmFyaW9zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNhcGFiaWxpdHlfbWF0cml4W2NhcF0udG9TdHJpbmcoKSA9PT0gc2NlbmFyaW8uY29kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3Q29tcGxleGl0eS5hbnN3ZXIgPSBzY2VuYXJpby5uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3VuZGVkRGVmYXVsdENhcGFiaWxpdHkuY29tcGxleGl0aWVzID0gdGhpcy5nZXRTb3J0ZWRMaXN0KGZvdW5kZWREZWZhdWx0Q2FwYWJpbGl0eS5jb21wbGV4aXRpZXMsIFwic29ydF9vcmRlclwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm91bmRlZERlZmF1bHRDYXBhYmlsaXR5LmNvbXBsZXhpdGllcy5wdXNoKG5ld0NvbXBsZXhpdHkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBjYXBhYmlsaXR5IG9mIHJvbGUuY2FwYWJpbGl0aWVzKSB7XHJcblxyXG4gICAgICAgICAgICAgIGxldCBjYXBDb2RlID0gY2FwLnNwbGl0KCdfJylbMF07XHJcbiAgICAgICAgICAgICAgaWYgKGNhcENvZGUgPT09IGNhcGFiaWxpdHkuY29kZSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGlzRm91bmQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGxldCBmb3VuZGVkQ2FwYWJpbGl0eTogQ2FwYWJpbGl0aWVzQ2xhc3NNb2RlbDtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGMgb2YgY2FwYWJpbGl0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgIGlmIChjLmNvZGUgPT09IGNhcENvZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3VuZGVkQ2FwYWJpbGl0eSA9IGM7XHJcbiAgICAgICAgICAgICAgICAgICAgaXNGb3VuZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICghaXNGb3VuZCkge1xyXG4gICAgICAgICAgICAgICAgICBsZXQgbmV3Q2FwYWJpbGl0eTogQ2FwYWJpbGl0aWVzQ2xhc3NNb2RlbCA9IG5ldyBDYXBhYmlsaXRpZXNDbGFzc01vZGVsKCk7XHJcbiAgICAgICAgICAgICAgICAgIG5ld0NhcGFiaWxpdHkubmFtZSA9IGNhcGFiaWxpdHkubmFtZTtcclxuICAgICAgICAgICAgICAgICAgbmV3Q2FwYWJpbGl0eS5jb2RlID0gY2FwYWJpbGl0eS5jb2RlO1xyXG4gICAgICAgICAgICAgICAgICBuZXdDYXBhYmlsaXR5LnNvcnRfb3JkZXIgPSBjYXBhYmlsaXR5LnNvcnRfb3JkZXI7XHJcbiAgICAgICAgICAgICAgICAgIGxldCBuZXdDb21wbGV4aXRpZXM6IENvbXBsZXhpdGllc0NsYXNzTW9kZWxbXSA9IG5ldyBBcnJheSgwKTtcclxuICAgICAgICAgICAgICAgICAgZm9yIChsZXQgY29tcGxleGl0eSBvZiBjYXBhYmlsaXR5LmNvbXBsZXhpdGllcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjb21wbGV4aXR5Q29kZSA9IGNhcC5zcGxpdCgnXycpWzFdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoY29tcGxleGl0eUNvZGUgPT09IGNvbXBsZXhpdHkuY29kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgbGV0IG5ld0NvbXBsZXhpdHk6IENvbXBsZXhpdGllc0NsYXNzTW9kZWwgPSBuZXcgQ29tcGxleGl0aWVzQ2xhc3NNb2RlbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgbmV3Q29tcGxleGl0eS5uYW1lID0gY29tcGxleGl0eS5uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgbmV3Q29tcGxleGl0eS5zb3J0X29yZGVyID0gY29tcGxleGl0eS5zb3J0X29yZGVyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgbmV3Q29tcGxleGl0eS5jb2RlID0gY29tcGxleGl0eS5jb2RlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgaWYoY29tcGxleGl0eV9ub3RlX21hdHJpeFtjYXBdICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3Q29tcGxleGl0eS5ub3RlID0gY29tcGxleGl0eV9ub3RlX21hdHJpeFtjYXBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBsZXhpdHkucXVlc3Rpb25Gb3JDYW5kaWRhdGUgIT09IHVuZGVmaW5lZCAmJiBjb21wbGV4aXR5LnF1ZXN0aW9uRm9yQ2FuZGlkYXRlICE9PSBudWxsICYmIGNvbXBsZXhpdHkucXVlc3Rpb25Gb3JDYW5kaWRhdGUgIT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0NvbXBsZXhpdHkucXVlc3Rpb25Gb3JDYW5kaWRhdGUgPSBjb21wbGV4aXR5LnF1ZXN0aW9uRm9yQ2FuZGlkYXRlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3Q29tcGxleGl0eS5xdWVzdGlvbkZvckNhbmRpZGF0ZSA9IGNvbXBsZXhpdHkubmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IHNjZW5hcmlvIG9mIGNvbXBsZXhpdHkuc2NlbmFyaW9zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYXBhYmlsaXR5X21hdHJpeFtjYXBdLnRvU3RyaW5nKCkgPT09IHNjZW5hcmlvLmNvZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdDb21wbGV4aXR5LmFuc3dlciA9IHNjZW5hcmlvLm5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICBuZXdDb21wbGV4aXRpZXMucHVzaChuZXdDb21wbGV4aXR5KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIG5ld0NvbXBsZXhpdGllcyA9IHRoaXMuZ2V0U29ydGVkTGlzdChuZXdDb21wbGV4aXRpZXMsIFwic29ydF9vcmRlclwiKTtcclxuICAgICAgICAgICAgICAgICAgbmV3Q2FwYWJpbGl0eS5jb21wbGV4aXRpZXMgPSBuZXdDb21wbGV4aXRpZXM7XHJcbiAgICAgICAgICAgICAgICAgIGNhcGFiaWxpdGllcy5wdXNoKG5ld0NhcGFiaWxpdHkpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgbGV0IGlzQ29tRm91bmQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgbGV0IEZvdW5kZWRDb21wbGV4aXR5OiBDb21wbGV4aXRpZXNDbGFzc01vZGVsO1xyXG4gICAgICAgICAgICAgICAgICBmb3IgKGxldCBjb21wbGV4aXR5IG9mIGZvdW5kZWRDYXBhYmlsaXR5LmNvbXBsZXhpdGllcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjb21wbGV4aXR5LmNvZGUgPT09IGNhcC5zcGxpdCgnXycpWzFdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBGb3VuZGVkQ29tcGxleGl0eSA9IGNvbXBsZXhpdHk7XHJcbiAgICAgICAgICAgICAgICAgICAgICBpc0NvbUZvdW5kID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgaWYgKCFpc0NvbUZvdW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5ld0NvbXBsZXhpdHk6IENvbXBsZXhpdGllc0NsYXNzTW9kZWwgPSBuZXcgQ29tcGxleGl0aWVzQ2xhc3NNb2RlbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGNvbXBsZXhpdHkgb2YgY2FwYWJpbGl0eS5jb21wbGV4aXRpZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIGxldCBjb21wbGV4aXR5Q29kZSA9IGNhcC5zcGxpdCgnXycpWzFdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgIGlmIChjb21wbGV4aXR5Q29kZSA9PT0gY29tcGxleGl0eS5jb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuZXdDb21wbGV4aXR5OiBDb21wbGV4aXRpZXNDbGFzc01vZGVsID0gbmV3IENvbXBsZXhpdGllc0NsYXNzTW9kZWwoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3Q29tcGxleGl0eS5uYW1lID0gY29tcGxleGl0eS5uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdDb21wbGV4aXR5LnNvcnRfb3JkZXIgPSBjb21wbGV4aXR5LnNvcnRfb3JkZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0NvbXBsZXhpdHkuY29kZSA9IGNvbXBsZXhpdHkuY29kZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoY29tcGxleGl0eV9ub3RlX21hdHJpeFtjYXBdICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdDb21wbGV4aXR5Lm5vdGUgPSBjb21wbGV4aXR5X25vdGVfbWF0cml4W2NhcF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBsZXhpdHkucXVlc3Rpb25Gb3JDYW5kaWRhdGUgIT09IHVuZGVmaW5lZCAmJiBjb21wbGV4aXR5LnF1ZXN0aW9uRm9yQ2FuZGlkYXRlICE9PSBudWxsICYmIGNvbXBsZXhpdHkucXVlc3Rpb25Gb3JDYW5kaWRhdGUgIT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3Q29tcGxleGl0eS5xdWVzdGlvbkZvckNhbmRpZGF0ZSA9IGNvbXBsZXhpdHkucXVlc3Rpb25Gb3JDYW5kaWRhdGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3Q29tcGxleGl0eS5xdWVzdGlvbkZvckNhbmRpZGF0ZSA9IGNvbXBsZXhpdHkubmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBzY2VuYXJpbyBvZiBjb21wbGV4aXR5LnNjZW5hcmlvcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYXBhYmlsaXR5X21hdHJpeFtjYXBdLnRvU3RyaW5nKCkgPT09IHNjZW5hcmlvLmNvZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0NvbXBsZXhpdHkuYW5zd2VyID0gc2NlbmFyaW8ubmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZm91bmRlZENhcGFiaWxpdHkuY29tcGxleGl0aWVzID0gdGhpcy5nZXRTb3J0ZWRMaXN0KGZvdW5kZWRDYXBhYmlsaXR5LmNvbXBsZXhpdGllcywgXCJzb3J0X29yZGVyXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3VuZGVkQ2FwYWJpbGl0eS5jb21wbGV4aXRpZXMucHVzaChuZXdDb21wbGV4aXR5KTtcclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY2FwYWJpbGl0aWVzID0gdGhpcy5nZXRTb3J0ZWRMaXN0KGNhcGFiaWxpdGllcywgXCJzb3J0X29yZGVyXCIpO1xyXG5cclxuICAgIHJldHVybiBjYXBhYmlsaXRpZXM7XHJcbiAgfVxyXG5cclxuICBnZXRTb3J0ZWRMaXN0KGxpc3Q6IGFueSwgZmllbGQ6IHN0cmluZyk6IGFueSB7XHJcblxyXG4gICAgaWYgKGxpc3QubGVuZ3RoID4gMCkge1xyXG4gICAgICBsaXN0ID0gbGlzdC5zb3J0KGZ1bmN0aW9uIChhOiBhbnksIGI6IGFueSkge1xyXG4gICAgICAgIHJldHVybiBiW2ZpZWxkXSAtIGFbZmllbGRdO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbGlzdDtcclxuICB9XHJcblxyXG4gIGdldENhcGFiaWxpdHlWYWx1ZUtleU1hdHJpeChfaWQ6IHN0cmluZywgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgdGhpcy5jYW5kaWRhdGVSZXBvc2l0b3J5LmZpbmRCeUlkd2l0aEV4Y2x1ZGUoX2lkLCB7Y29tcGxleGl0eV9ub3RlX21hdHJpeDoxLCBjYXBhYmlsaXR5X21hdHJpeDogMSwgJ2luZHVzdHJ5Lm5hbWUnOiAxfSwgKGVyciwgcmVzKSA9PiB7XHJcbiAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnNvbGUudGltZSgnLS0tLS0tLWdldCBjYW5kaWRhdGVSZXBvc2l0b3J5LS0tLS0nKTtcclxuICAgICAgICB0aGlzLmluZHVzdHJ5UmVwb3NpdGlyeS5yZXRyaWV2ZSh7J25hbWUnOiByZXMuaW5kdXN0cnkubmFtZX0sIChlcnJvcjogYW55LCBpbmR1c3RyaWVzOiBJbmR1c3RyeU1vZGVsW10pID0+IHtcclxuICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUudGltZUVuZCgnLS0tLS0tLWdldCBjYW5kaWRhdGVSZXBvc2l0b3J5LS0tLS0nKTtcclxuICAgICAgICAgICAgbGV0IG5ld19jYXBhYmlsaXR5X21hdHJpeDogYW55ID0gdGhpcy5nZXRDYXBhYmlsaXR5VmFsdWVLZXlNYXRyaXhCdWlsZChyZXMuY2FwYWJpbGl0eV9tYXRyaXgsIGluZHVzdHJpZXMpO1xyXG4gICAgICAgICAgICBsZXQgY2FwYWJpbGl0eU1hdHJyaXhXaXRoTm90ZXM6IGFueSA9IHRoaXMuZ2V0Q2FwYWJpbGl0eU1hdHJpeFdpdGhOb3RlcyhuZXdfY2FwYWJpbGl0eV9tYXRyaXgscmVzLmNvbXBsZXhpdHlfbm90ZV9tYXRyaXgpO1xyXG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCBuZXdfY2FwYWJpbGl0eV9tYXRyaXgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldENhcGFiaWxpdHlWYWx1ZUtleU1hdHJpeEJ1aWxkKGNhcGFiaWxpdHlfbWF0cml4OiBhbnksIGluZHVzdHJpZXM6IGFueSwgY29tcGxleGl0eV9tdXN0aGF2ZV9tYXRyaXg/OiBhbnkpOiBhbnkge1xyXG4gICAgbGV0IGtleVZhbHVlQ2FwYWJpbGl0eTogYW55ID0ge307XHJcbiAgICBmb3IgKGxldCBjYXAgaW4gY2FwYWJpbGl0eV9tYXRyaXgpIHtcclxuICAgICAgbGV0IGlzRm91bmQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgbGV0IG1hdGNoX3ZpZXc6IE1hdGNoVmlld01vZGVsID0gbmV3IE1hdGNoVmlld01vZGVsKCk7XHJcbiAgICAgIGZvciAobGV0IHJvbGUgb2YgaW5kdXN0cmllc1swXS5yb2xlcykge1xyXG4gICAgICAgIGZvciAobGV0IGNhcGFiaWxpdHkgb2Ygcm9sZS5jYXBhYmlsaXRpZXMpIHtcclxuICAgICAgICAgIGxldCBjb3VudF9vZl9jb21wbGV4aXR5ID0gMDtcclxuICAgICAgICAgIGZvciAobGV0IGNvbXBsZXhpdHkgb2YgY2FwYWJpbGl0eS5jb21wbGV4aXRpZXMpIHtcclxuICAgICAgICAgICAgKytjb3VudF9vZl9jb21wbGV4aXR5O1xyXG4gICAgICAgICAgICBsZXQgY3VzdG9tX2NvZGUgPSBjYXBhYmlsaXR5LmNvZGUgKyAnXycgKyBjb21wbGV4aXR5LmNvZGU7XHJcbiAgICAgICAgICAgIGlmIChjdXN0b21fY29kZSA9PT0gY2FwKSB7XHJcbiAgICAgICAgICAgICAgaXNGb3VuZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgbWF0Y2hfdmlldy5zY2VuYXJpb3MgPSBjb21wbGV4aXR5LnNjZW5hcmlvcy5zbGljZSgpO1xyXG4gICAgICAgICAgICAgIGxldCBzY2VuYXJpb3MgPSBjb21wbGV4aXR5LnNjZW5hcmlvcy5maWx0ZXIoKHNjZTogU2NlbmFyaW9Nb2RlbCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgc2NlLmNvZGUgPSBzY2UuY29kZS5yZXBsYWNlKCcuJywgJ18nKTtcclxuICAgICAgICAgICAgICAgIHNjZS5jb2RlID0gc2NlLmNvZGUucmVwbGFjZSgnLicsICdfJyk7XHJcbiAgICAgICAgICAgICAgICBzY2UuY29kZSA9IHNjZS5jb2RlLnN1YnN0cihzY2UuY29kZS5sYXN0SW5kZXhPZignXycpICsgMSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2NlLmNvZGUuc3Vic3RyKHNjZS5jb2RlLmxhc3RJbmRleE9mKCcuJykgKyAxKSA9PSBjYXBhYmlsaXR5X21hdHJpeFtjYXBdKSB7XHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIG1hdGNoX3ZpZXcuY2FwYWJpbGl0eV9uYW1lID0gY2FwYWJpbGl0eS5uYW1lO1xyXG4gICAgICAgICAgICAgIG1hdGNoX3ZpZXcuY2FwYWJpbGl0eV9jb2RlID0gY2FwYWJpbGl0eS5jb2RlO1xyXG4gICAgICAgICAgICAgIG1hdGNoX3ZpZXcudG90YWxfY29tcGxleGl0eV9pbl9jYXBhYmlsaXR5ID0gY2FwYWJpbGl0eS5jb21wbGV4aXRpZXMubGVuZ3RoO1xyXG4gICAgICAgICAgICAgIG1hdGNoX3ZpZXcuY29tcGxleGl0eV9udW1iZXIgPSBjb3VudF9vZl9jb21wbGV4aXR5O1xyXG4gICAgICAgICAgICAgIG1hdGNoX3ZpZXcucm9sZV9uYW1lID0gcm9sZS5uYW1lO1xyXG4gICAgICAgICAgICAgIG1hdGNoX3ZpZXcuY29kZSA9IGN1c3RvbV9jb2RlO1xyXG4gICAgICAgICAgICAgIHN3aXRjaCAocm9sZS5zb3J0X29yZGVyLnRvU3RyaW5nKCkubGVuZ3RoLnRvU3RyaW5nKCkpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJzEnIDpcclxuICAgICAgICAgICAgICAgICAgbWF0Y2hfdmlldy5yb2xlX3NvcnRfb3JkZXIgPSAnMDAwJyArIHJvbGUuc29ydF9vcmRlcjtcclxuICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICcyJyA6XHJcbiAgICAgICAgICAgICAgICAgIG1hdGNoX3ZpZXcucm9sZV9zb3J0X29yZGVyID0gJzAwJyArIHJvbGUuc29ydF9vcmRlcjtcclxuICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICczJyA6XHJcbiAgICAgICAgICAgICAgICAgIG1hdGNoX3ZpZXcucm9sZV9zb3J0X29yZGVyID0gJzAnICsgcm9sZS5zb3J0X29yZGVyO1xyXG4gICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJzQnIDpcclxuICAgICAgICAgICAgICAgICAgbWF0Y2hfdmlldy5yb2xlX3NvcnRfb3JkZXIgPSByb2xlLnNvcnRfb3JkZXI7XHJcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdCA6XHJcbiAgICAgICAgICAgICAgICAgIG1hdGNoX3ZpZXcucm9sZV9zb3J0X29yZGVyID0gJzAwMDAnO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBzd2l0Y2ggKGNhcGFiaWxpdHkuc29ydF9vcmRlci50b1N0cmluZygpLmxlbmd0aC50b1N0cmluZygpKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICcxJyA6XHJcbiAgICAgICAgICAgICAgICAgIG1hdGNoX3ZpZXcuY2FwYWJpbGl0eV9zb3J0X29yZGVyID0gJzAwMCcgKyBjYXBhYmlsaXR5LnNvcnRfb3JkZXI7XHJcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnMicgOlxyXG4gICAgICAgICAgICAgICAgICBtYXRjaF92aWV3LmNhcGFiaWxpdHlfc29ydF9vcmRlciA9ICcwMCcgKyBjYXBhYmlsaXR5LnNvcnRfb3JkZXI7XHJcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnMycgOlxyXG4gICAgICAgICAgICAgICAgICBtYXRjaF92aWV3LmNhcGFiaWxpdHlfc29ydF9vcmRlciA9ICcwJyArIGNhcGFiaWxpdHkuc29ydF9vcmRlcjtcclxuICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICc0JyA6XHJcbiAgICAgICAgICAgICAgICAgIG1hdGNoX3ZpZXcuY2FwYWJpbGl0eV9zb3J0X29yZGVyID0gY2FwYWJpbGl0eS5zb3J0X29yZGVyO1xyXG4gICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQgOlxyXG4gICAgICAgICAgICAgICAgICBtYXRjaF92aWV3LmNhcGFiaWxpdHlfc29ydF9vcmRlciA9ICcwMDAwJztcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgc3dpdGNoIChjb21wbGV4aXR5LnNvcnRfb3JkZXIudG9TdHJpbmcoKS5sZW5ndGgudG9TdHJpbmcoKSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnMScgOlxyXG4gICAgICAgICAgICAgICAgICBtYXRjaF92aWV3LmNvbXBsZXhpdHlfc29ydF9vcmRlciA9ICcwMDAnICsgY29tcGxleGl0eS5zb3J0X29yZGVyO1xyXG4gICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJzInIDpcclxuICAgICAgICAgICAgICAgICAgbWF0Y2hfdmlldy5jb21wbGV4aXR5X3NvcnRfb3JkZXIgPSAnMDAnICsgY29tcGxleGl0eS5zb3J0X29yZGVyO1xyXG4gICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJzMnIDpcclxuICAgICAgICAgICAgICAgICAgbWF0Y2hfdmlldy5jb21wbGV4aXR5X3NvcnRfb3JkZXIgPSAnMCcgKyBjb21wbGV4aXR5LnNvcnRfb3JkZXI7XHJcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnNCcgOlxyXG4gICAgICAgICAgICAgICAgICBtYXRjaF92aWV3LmNvbXBsZXhpdHlfc29ydF9vcmRlciA9IGNvbXBsZXhpdHkuc29ydF9vcmRlcjtcclxuICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0IDpcclxuICAgICAgICAgICAgICAgICAgbWF0Y2hfdmlldy5jb21wbGV4aXR5X3NvcnRfb3JkZXIgPSAnMDAwMCc7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIG1hdGNoX3ZpZXcubWFpbl9zb3J0X29yZGVyID0gTnVtYmVyKG1hdGNoX3ZpZXcucm9sZV9zb3J0X29yZGVyICsgbWF0Y2hfdmlldy5jYXBhYmlsaXR5X3NvcnRfb3JkZXIgKyBtYXRjaF92aWV3LmNvbXBsZXhpdHlfc29ydF9vcmRlcik7XHJcbiAgICAgICAgICAgICAgaWYgKGNvbXBsZXhpdHkucXVlc3Rpb25Gb3JDYW5kaWRhdGUgIT09IHVuZGVmaW5lZCAmJiBjb21wbGV4aXR5LnF1ZXN0aW9uRm9yQ2FuZGlkYXRlICE9PSBudWxsICYmIGNvbXBsZXhpdHkucXVlc3Rpb25Gb3JDYW5kaWRhdGUgIT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICBtYXRjaF92aWV3LnF1ZXN0aW9uRm9yQ2FuZGlkYXRlID0gY29tcGxleGl0eS5xdWVzdGlvbkZvckNhbmRpZGF0ZTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbWF0Y2hfdmlldy5xdWVzdGlvbkZvckNhbmRpZGF0ZSA9IGNvbXBsZXhpdHkubmFtZTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgaWYgKGNvbXBsZXhpdHkucXVlc3Rpb25Gb3JSZWNydWl0ZXIgIT09IHVuZGVmaW5lZCAmJiBjb21wbGV4aXR5LnF1ZXN0aW9uRm9yUmVjcnVpdGVyICE9PSBudWxsICYmIGNvbXBsZXhpdHkucXVlc3Rpb25Gb3JSZWNydWl0ZXIgIT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICBtYXRjaF92aWV3LnF1ZXN0aW9uRm9yUmVjcnVpdGVyID0gY29tcGxleGl0eS5xdWVzdGlvbkZvclJlY3J1aXRlcjtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbWF0Y2hfdmlldy5xdWVzdGlvbkZvclJlY3J1aXRlciA9IGNvbXBsZXhpdHkubmFtZTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgaWYgKGNvbXBsZXhpdHkucXVlc3Rpb25IZWFkZXJGb3JDYW5kaWRhdGUgIT09IHVuZGVmaW5lZCAmJiBjb21wbGV4aXR5LnF1ZXN0aW9uSGVhZGVyRm9yQ2FuZGlkYXRlICE9PSBudWxsICYmIGNvbXBsZXhpdHkucXVlc3Rpb25IZWFkZXJGb3JDYW5kaWRhdGUgIT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICBtYXRjaF92aWV3LnF1ZXN0aW9uSGVhZGVyRm9yQ2FuZGlkYXRlID0gY29tcGxleGl0eS5xdWVzdGlvbkhlYWRlckZvckNhbmRpZGF0ZTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbWF0Y2hfdmlldy5xdWVzdGlvbkhlYWRlckZvckNhbmRpZGF0ZSA9IE1lc3NhZ2VzLk1TR19IRUFERVJfUVVFU1RJT05fQ0FORElEQVRFO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBpZiAoY29tcGxleGl0eS5xdWVzdGlvbkhlYWRlckZvclJlY3J1aXRlciAhPT0gdW5kZWZpbmVkICYmIGNvbXBsZXhpdHkucXVlc3Rpb25IZWFkZXJGb3JSZWNydWl0ZXIgIT09IG51bGwgJiYgY29tcGxleGl0eS5xdWVzdGlvbkhlYWRlckZvclJlY3J1aXRlciAhPT0gJycpIHtcclxuICAgICAgICAgICAgICAgIG1hdGNoX3ZpZXcucXVlc3Rpb25IZWFkZXJGb3JSZWNydWl0ZXIgPSBjb21wbGV4aXR5LnF1ZXN0aW9uSGVhZGVyRm9yUmVjcnVpdGVyO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBtYXRjaF92aWV3LnF1ZXN0aW9uSGVhZGVyRm9yUmVjcnVpdGVyID0gTWVzc2FnZXMuTVNHX0hFQURFUl9RVUVTVElPTl9SRUNSVUlURVI7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIG1hdGNoX3ZpZXcuY29tcGxleGl0eV9uYW1lID0gY29tcGxleGl0eS5uYW1lO1xyXG4gICAgICAgICAgICAgIGlmIChzY2VuYXJpb3NbMF0pIHtcclxuICAgICAgICAgICAgICAgIG1hdGNoX3ZpZXcuc2NlbmFyaW9fbmFtZSA9IHNjZW5hcmlvc1swXS5uYW1lO1xyXG4gICAgICAgICAgICAgICAgbWF0Y2hfdmlldy51c2VyQ2hvaWNlID0gc2NlbmFyaW9zWzBdLmNvZGU7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIGlmKGNvbXBsZXhpdHlfbXVzdGhhdmVfbWF0cml4ICYmIGNvbXBsZXhpdHlfbXVzdGhhdmVfbWF0cml4W2NhcF0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgbWF0Y2hfdmlldy5jb21wbGV4aXR5SXNNdXN0SGF2ZSA9IGNvbXBsZXhpdHlfbXVzdGhhdmVfbWF0cml4W2NhcF07XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIGtleVZhbHVlQ2FwYWJpbGl0eVtjYXBdID0gbWF0Y2hfdmlldztcclxuICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKGlzRm91bmQpIHtcclxuICAgICAgICAgICAgLy9icmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHJvbGUuZGVmYXVsdF9jb21wbGV4aXRpZXMpIHtcclxuICAgICAgICAgIGZvciAobGV0IGNhcGFiaWxpdHkgb2Ygcm9sZS5kZWZhdWx0X2NvbXBsZXhpdGllcykge1xyXG4gICAgICAgICAgICBsZXQgY291bnRfb2ZfZGVmYXVsdF9jb21wbGV4aXR5ID0gMDtcclxuICAgICAgICAgICAgZm9yIChsZXQgY29tcGxleGl0eSBvZiBjYXBhYmlsaXR5LmNvbXBsZXhpdGllcykge1xyXG4gICAgICAgICAgICAgICsrY291bnRfb2ZfZGVmYXVsdF9jb21wbGV4aXR5O1xyXG4gICAgICAgICAgICAgIGxldCBjdXN0b21fY29kZSA9IGNhcGFiaWxpdHkuY29kZSArICdfJyArIGNvbXBsZXhpdHkuY29kZTtcclxuICAgICAgICAgICAgICBpZiAoY3VzdG9tX2NvZGUgPT09IGNhcCkge1xyXG4gICAgICAgICAgICAgICAgaXNGb3VuZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBtYXRjaF92aWV3LnNjZW5hcmlvcyA9IGNvbXBsZXhpdHkuc2NlbmFyaW9zLnNsaWNlKCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2NlbmFyaW9zID0gY29tcGxleGl0eS5zY2VuYXJpb3MuZmlsdGVyKChzY2U6IFNjZW5hcmlvTW9kZWwpID0+IHtcclxuICAgICAgICAgICAgICAgICAgc2NlLmNvZGUgPSBzY2UuY29kZS5yZXBsYWNlKCcuJywgJ18nKTtcclxuICAgICAgICAgICAgICAgICAgc2NlLmNvZGUgPSBzY2UuY29kZS5yZXBsYWNlKCcuJywgJ18nKTtcclxuICAgICAgICAgICAgICAgICAgc2NlLmNvZGUgPSBzY2UuY29kZS5zdWJzdHIoc2NlLmNvZGUubGFzdEluZGV4T2YoJ18nKSArIDEpO1xyXG4gICAgICAgICAgICAgICAgICBpZiAoc2NlLmNvZGUuc3Vic3RyKHNjZS5jb2RlLmxhc3RJbmRleE9mKCcuJykgKyAxKSA9PSBjYXBhYmlsaXR5X21hdHJpeFtjYXBdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIG1hdGNoX3ZpZXcuY2FwYWJpbGl0eV9uYW1lID0gY2FwYWJpbGl0eS5uYW1lO1xyXG4gICAgICAgICAgICAgICAgbWF0Y2hfdmlldy5jYXBhYmlsaXR5X2NvZGUgPSBjYXBhYmlsaXR5LmNvZGU7XHJcbiAgICAgICAgICAgICAgICBtYXRjaF92aWV3LnRvdGFsX2NvbXBsZXhpdHlfaW5fY2FwYWJpbGl0eSA9IGNhcGFiaWxpdHkuY29tcGxleGl0aWVzLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIG1hdGNoX3ZpZXcuY29tcGxleGl0eV9udW1iZXIgPSBjb3VudF9vZl9kZWZhdWx0X2NvbXBsZXhpdHk7XHJcbiAgICAgICAgICAgICAgICBtYXRjaF92aWV3LmNvbXBsZXhpdHlfbmFtZSA9IGNvbXBsZXhpdHkubmFtZTtcclxuICAgICAgICAgICAgICAgIG1hdGNoX3ZpZXcucm9sZV9uYW1lID0gcm9sZS5uYW1lO1xyXG4gICAgICAgICAgICAgICAgbWF0Y2hfdmlldy5jb2RlID0gY3VzdG9tX2NvZGU7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHJvbGUuc29ydF9vcmRlci50b1N0cmluZygpLmxlbmd0aC50b1N0cmluZygpKSB7XHJcbiAgICAgICAgICAgICAgICAgIGNhc2UgJzEnIDpcclxuICAgICAgICAgICAgICAgICAgICBtYXRjaF92aWV3LnJvbGVfc29ydF9vcmRlciA9ICcwMDAnICsgcm9sZS5zb3J0X29yZGVyO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICBjYXNlICcyJyA6XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hfdmlldy5yb2xlX3NvcnRfb3JkZXIgPSAnMDAnICsgcm9sZS5zb3J0X29yZGVyO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICBjYXNlICczJyA6XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hfdmlldy5yb2xlX3NvcnRfb3JkZXIgPSAnMCcgKyByb2xlLnNvcnRfb3JkZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgIGNhc2UgJzQnIDpcclxuICAgICAgICAgICAgICAgICAgICBtYXRjaF92aWV3LnJvbGVfc29ydF9vcmRlciA9IHJvbGUuc29ydF9vcmRlcjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgZGVmYXVsdCA6XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hfdmlldy5yb2xlX3NvcnRfb3JkZXIgPSAnMDAwMCc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGNhcGFiaWxpdHkuc29ydF9vcmRlci50b1N0cmluZygpLmxlbmd0aC50b1N0cmluZygpKSB7XHJcbiAgICAgICAgICAgICAgICAgIGNhc2UgJzEnIDpcclxuICAgICAgICAgICAgICAgICAgICBtYXRjaF92aWV3LmNhcGFiaWxpdHlfc29ydF9vcmRlciA9ICcwMDAnICsgY2FwYWJpbGl0eS5zb3J0X29yZGVyO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICBjYXNlICcyJyA6XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hfdmlldy5jYXBhYmlsaXR5X3NvcnRfb3JkZXIgPSAnMDAnICsgY2FwYWJpbGl0eS5zb3J0X29yZGVyO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICBjYXNlICczJyA6XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hfdmlldy5jYXBhYmlsaXR5X3NvcnRfb3JkZXIgPSAnMCcgKyBjYXBhYmlsaXR5LnNvcnRfb3JkZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgIGNhc2UgJzQnIDpcclxuICAgICAgICAgICAgICAgICAgICBtYXRjaF92aWV3LmNhcGFiaWxpdHlfc29ydF9vcmRlciA9IGNhcGFiaWxpdHkuc29ydF9vcmRlcjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgZGVmYXVsdCA6XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hfdmlldy5jYXBhYmlsaXR5X3NvcnRfb3JkZXIgPSAnMDAwMCc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGNvbXBsZXhpdHkuc29ydF9vcmRlci50b1N0cmluZygpLmxlbmd0aC50b1N0cmluZygpKSB7XHJcbiAgICAgICAgICAgICAgICAgIGNhc2UgJzEnIDpcclxuICAgICAgICAgICAgICAgICAgICBtYXRjaF92aWV3LmNvbXBsZXhpdHlfc29ydF9vcmRlciA9ICcwMDAnICsgY29tcGxleGl0eS5zb3J0X29yZGVyO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICBjYXNlICcyJyA6XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hfdmlldy5jb21wbGV4aXR5X3NvcnRfb3JkZXIgPSAnMDAnICsgY29tcGxleGl0eS5zb3J0X29yZGVyO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICBjYXNlICczJyA6XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hfdmlldy5jb21wbGV4aXR5X3NvcnRfb3JkZXIgPSAnMCcgKyBjb21wbGV4aXR5LnNvcnRfb3JkZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgIGNhc2UgJzQnIDpcclxuICAgICAgICAgICAgICAgICAgICBtYXRjaF92aWV3LmNvbXBsZXhpdHlfc29ydF9vcmRlciA9IGNvbXBsZXhpdHkuc29ydF9vcmRlcjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgZGVmYXVsdCA6XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hfdmlldy5jb21wbGV4aXR5X3NvcnRfb3JkZXIgPSAnMDAwMCc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBtYXRjaF92aWV3Lm1haW5fc29ydF9vcmRlciA9IE51bWJlcihtYXRjaF92aWV3LnJvbGVfc29ydF9vcmRlciArIG1hdGNoX3ZpZXcuY2FwYWJpbGl0eV9zb3J0X29yZGVyICsgbWF0Y2hfdmlldy5jb21wbGV4aXR5X3NvcnRfb3JkZXIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNvbXBsZXhpdHkucXVlc3Rpb25Gb3JDYW5kaWRhdGUgIT09IHVuZGVmaW5lZCAmJiBjb21wbGV4aXR5LnF1ZXN0aW9uRm9yQ2FuZGlkYXRlICE9PSBudWxsICYmIGNvbXBsZXhpdHkucXVlc3Rpb25Gb3JDYW5kaWRhdGUgIT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgIG1hdGNoX3ZpZXcucXVlc3Rpb25Gb3JDYW5kaWRhdGUgPSBjb21wbGV4aXR5LnF1ZXN0aW9uRm9yQ2FuZGlkYXRlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgbWF0Y2hfdmlldy5xdWVzdGlvbkZvckNhbmRpZGF0ZSA9IGNvbXBsZXhpdHkubmFtZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChjb21wbGV4aXR5LnF1ZXN0aW9uRm9yUmVjcnVpdGVyICE9PSB1bmRlZmluZWQgJiYgY29tcGxleGl0eS5xdWVzdGlvbkZvclJlY3J1aXRlciAhPT0gbnVsbCAmJiBjb21wbGV4aXR5LnF1ZXN0aW9uRm9yUmVjcnVpdGVyICE9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICBtYXRjaF92aWV3LnF1ZXN0aW9uRm9yUmVjcnVpdGVyID0gY29tcGxleGl0eS5xdWVzdGlvbkZvclJlY3J1aXRlcjtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIG1hdGNoX3ZpZXcucXVlc3Rpb25Gb3JSZWNydWl0ZXIgPSBjb21wbGV4aXR5Lm5hbWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoY29tcGxleGl0eS5xdWVzdGlvbkhlYWRlckZvckNhbmRpZGF0ZSAhPT0gdW5kZWZpbmVkICYmIGNvbXBsZXhpdHkucXVlc3Rpb25IZWFkZXJGb3JDYW5kaWRhdGUgIT09IG51bGwgJiYgY29tcGxleGl0eS5xdWVzdGlvbkhlYWRlckZvckNhbmRpZGF0ZSAhPT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgbWF0Y2hfdmlldy5xdWVzdGlvbkhlYWRlckZvckNhbmRpZGF0ZSA9IGNvbXBsZXhpdHkucXVlc3Rpb25IZWFkZXJGb3JDYW5kaWRhdGU7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICBtYXRjaF92aWV3LnF1ZXN0aW9uSGVhZGVyRm9yQ2FuZGlkYXRlID0gTWVzc2FnZXMuTVNHX0hFQURFUl9RVUVTVElPTl9DQU5ESURBVEU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoY29tcGxleGl0eS5xdWVzdGlvbkhlYWRlckZvclJlY3J1aXRlciAhPT0gdW5kZWZpbmVkICYmIGNvbXBsZXhpdHkucXVlc3Rpb25IZWFkZXJGb3JSZWNydWl0ZXIgIT09IG51bGwgJiYgY29tcGxleGl0eS5xdWVzdGlvbkhlYWRlckZvclJlY3J1aXRlciAhPT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgbWF0Y2hfdmlldy5xdWVzdGlvbkhlYWRlckZvclJlY3J1aXRlciA9IGNvbXBsZXhpdHkucXVlc3Rpb25IZWFkZXJGb3JSZWNydWl0ZXI7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICBtYXRjaF92aWV3LnF1ZXN0aW9uSGVhZGVyRm9yUmVjcnVpdGVyID0gTWVzc2FnZXMuTVNHX0hFQURFUl9RVUVTVElPTl9SRUNSVUlURVI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoc2NlbmFyaW9zWzBdKSB7XHJcbiAgICAgICAgICAgICAgICAgIG1hdGNoX3ZpZXcuc2NlbmFyaW9fbmFtZSA9IHNjZW5hcmlvc1swXS5uYW1lO1xyXG4gICAgICAgICAgICAgICAgICBtYXRjaF92aWV3LnVzZXJDaG9pY2UgPSBzY2VuYXJpb3NbMF0uY29kZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmKGNvbXBsZXhpdHlfbXVzdGhhdmVfbWF0cml4ICYmIGNvbXBsZXhpdHlfbXVzdGhhdmVfbWF0cml4W2NhcF0gIT09IHVuZGVmaW5lZCApIHtcclxuICAgICAgICAgICAgICAgICAgbWF0Y2hfdmlldy5jb21wbGV4aXR5SXNNdXN0SGF2ZSA9IGNvbXBsZXhpdHlfbXVzdGhhdmVfbWF0cml4W2NhcF07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBrZXlWYWx1ZUNhcGFiaWxpdHlbY2FwXSA9IG1hdGNoX3ZpZXc7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGlzRm91bmQpIHtcclxuICAgICAgICAgICAgICAvL2JyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpc0ZvdW5kKSB7XHJcbiAgICAgICAgICAvL2JyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgdmFyIG9yZGVyS2V5cyA9IGZ1bmN0aW9uIChvOiBhbnksIGY6IGFueSkge1xyXG4gICAgICBsZXQgb3M6IGFueSA9IFtdLCBrczogYW55ID0gW10sIGk6IGFueTtcclxuICAgICAgZm9yIChsZXQgaSBpbiBvKSB7XHJcbiAgICAgICAgb3MucHVzaChbaSwgb1tpXV0pO1xyXG4gICAgICB9XHJcbiAgICAgIG9zLnNvcnQoZnVuY3Rpb24gKGE6IGFueSwgYjogYW55KSB7XHJcbiAgICAgICAgcmV0dXJuIGYoYVsxXSwgYlsxXSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgb3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBrcy5wdXNoKG9zW2ldWzBdKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4ga3M7XHJcbiAgICB9O1xyXG5cclxuICAgIHZhciByZXN1bHQgPSBvcmRlcktleXMoa2V5VmFsdWVDYXBhYmlsaXR5LCBmdW5jdGlvbiAoYTogYW55LCBiOiBhbnkpIHtcclxuICAgICAgcmV0dXJuIGEubWFpbl9zb3J0X29yZGVyIC0gYi5tYWluX3NvcnRfb3JkZXI7XHJcbiAgICB9KTsgLy8gPT4gW1wiRWxlbTRcIiwgXCJFbGVtMlwiLCBcIkVsZW0xXCIsIFwiRWxlbTNcIl1cclxuICAgIC8vIGNvbnNvbGUubG9nKFwic2FtcGxlIHJlc3VsdFwiKyByZXN1bHQpO1xyXG4gICAgbGV0IHJlc3BvbnNlVG9SZXR1cm46IGFueSA9IHt9O1xyXG4gICAgZm9yIChsZXQgaSBvZiByZXN1bHQpIHtcclxuICAgICAgcmVzcG9uc2VUb1JldHVybltpXSA9IGtleVZhbHVlQ2FwYWJpbGl0eVtpXTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXNwb25zZVRvUmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgZ2V0Q2FwYWJpbGl0eU1hdHJpeChpdGVtOiBhbnksIGluZHVzdHJpZXM6IEluZHVzdHJ5TW9kZWxbXSwgbmV3X2NhcGFiaWxpdHlfbWF0cml4OiBhbnkpOiBhbnkge1xyXG4gICAgaWYgKGl0ZW0uaW5kdXN0cnkucm9sZXMgJiYgaXRlbS5pbmR1c3RyeS5yb2xlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGZvciAobGV0IHJvbGUgb2YgaXRlbS5pbmR1c3RyeS5yb2xlcykge1xyXG4gICAgICAgIGlmIChyb2xlLmRlZmF1bHRfY29tcGxleGl0aWVzKSB7XHJcbiAgICAgICAgICBmb3IgKGxldCBjYXBhYmlsaXR5IG9mICByb2xlLmRlZmF1bHRfY29tcGxleGl0aWVzKSB7XHJcbiAgICAgICAgICAgIGlmIChjYXBhYmlsaXR5LmNvZGUpIHtcclxuICAgICAgICAgICAgICBmb3IgKGxldCBtYWluUm9sZSBvZiBpbmR1c3RyaWVzWzBdLnJvbGVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocm9sZS5jb2RlLnRvU3RyaW5nKCkgPT09IG1haW5Sb2xlLmNvZGUudG9TdHJpbmcoKSkge1xyXG4gICAgICAgICAgICAgICAgICBmb3IgKGxldCBtYWluQ2FwIG9mIG1haW5Sb2xlLmRlZmF1bHRfY29tcGxleGl0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhcGFiaWxpdHkuY29kZS50b1N0cmluZygpID09PSBtYWluQ2FwLmNvZGUudG9TdHJpbmcoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgbWFpbkNvbXAgb2YgbWFpbkNhcC5jb21wbGV4aXRpZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGl0ZW1jb2RlID0gbWFpbkNhcC5jb2RlICsgJ18nICsgbWFpbkNvbXAuY29kZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uY2FwYWJpbGl0eV9tYXRyaXhbaXRlbWNvZGVdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV3X2NhcGFiaWxpdHlfbWF0cml4ICE9IHVuZGVmaW5lZCAmJiBuZXdfY2FwYWJpbGl0eV9tYXRyaXhbaXRlbWNvZGVdID09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3X2NhcGFiaWxpdHlfbWF0cml4W2l0ZW1jb2RlXSA9IC0xO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5jYXBhYmlsaXR5X21hdHJpeFtpdGVtY29kZV0gPSAtMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbS5jYXBhYmlsaXR5X21hdHJpeFtpdGVtY29kZV0gIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5ld19jYXBhYmlsaXR5X21hdHJpeCAhPSB1bmRlZmluZWQgJiYgbmV3X2NhcGFiaWxpdHlfbWF0cml4W2l0ZW1jb2RlXSA9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld19jYXBhYmlsaXR5X21hdHJpeFtpdGVtY29kZV0gPSBpdGVtLmNhcGFiaWxpdHlfbWF0cml4W2l0ZW1jb2RlXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5ld19jYXBhYmlsaXR5X21hdHJpeCAhPSB1bmRlZmluZWQgJiYgbmV3X2NhcGFiaWxpdHlfbWF0cml4W2l0ZW1jb2RlXSA9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld19jYXBhYmlsaXR5X21hdHJpeFtpdGVtY29kZV0gPSAtMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChyb2xlLmNhcGFiaWxpdGllcyAmJiByb2xlLmNhcGFiaWxpdGllcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICBmb3IgKGxldCBjYXBhYmlsaXR5IG9mIHJvbGUuY2FwYWJpbGl0aWVzKSB7XHJcbiAgICAgICAgICAgIGlmIChjYXBhYmlsaXR5LmNvZGUpIHtcclxuICAgICAgICAgICAgICBmb3IgKGxldCBtYWluUm9sZSBvZiBpbmR1c3RyaWVzWzBdLnJvbGVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocm9sZS5jb2RlLnRvU3RyaW5nKCkgPT09IG1haW5Sb2xlLmNvZGUudG9TdHJpbmcoKSkge1xyXG4gICAgICAgICAgICAgICAgICBmb3IgKGxldCBtYWluQ2FwIG9mIG1haW5Sb2xlLmNhcGFiaWxpdGllcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjYXBhYmlsaXR5LmNvZGUudG9TdHJpbmcoKSA9PT0gbWFpbkNhcC5jb2RlLnRvU3RyaW5nKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IG1haW5Db21wIG9mIG1haW5DYXAuY29tcGxleGl0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpdGVtY29kZSA9IG1haW5DYXAuY29kZSArICdfJyArIG1haW5Db21wLmNvZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLmNhcGFiaWxpdHlfbWF0cml4W2l0ZW1jb2RlXSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3X2NhcGFiaWxpdHlfbWF0cml4W2l0ZW1jb2RlXSA9IC0xO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uY2FwYWJpbGl0eV9tYXRyaXhbaXRlbWNvZGVdID0gLTE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbS5jYXBhYmlsaXR5X21hdHJpeCAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdfY2FwYWJpbGl0eV9tYXRyaXhbaXRlbWNvZGVdID0gaXRlbS5jYXBhYmlsaXR5X21hdHJpeFtpdGVtY29kZV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3X2NhcGFiaWxpdHlfbWF0cml4W2l0ZW1jb2RlXSA9IC0xO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbmV3X2NhcGFiaWxpdHlfbWF0cml4O1xyXG4gIH1cclxuXHJcbiAgZ2V0TGlzdChpdGVtOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxldCBxdWVyeSA9IHtcclxuICAgICAgJ3Bvc3RlZEpvYnMuX2lkJzogeyRpbjogaXRlbS5pZHN9LFxyXG4gICAgfTtcclxuICAgIHRoaXMucmVjcnVpdGVyUmVwb3NpdG9yeS5yZXRyaWV2ZShxdWVyeSwgKGVyciwgcmVzKSA9PiB7XHJcbiAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMucmVjcnVpdGVyUmVwb3NpdG9yeS5nZXRKb2JQcm9maWxlUUNhcmQocmVzLCBpdGVtLmNhbmRpZGF0ZSwgaXRlbS5pZHMsICdub25lJywgKGNhbkVycm9yLCBjYW5SZXN1bHQpID0+IHtcclxuICAgICAgICAgIGlmIChjYW5FcnJvcikge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhjYW5FcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCBjYW5SZXN1bHQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGxvYWRDYXBhYmlsaXRpRGV0YWlscyhjYXBhYmlsaXR5TWF0cml4OiBhbnkpIHtcclxuICAgIGxldCBjYXBhYmlsaXR5TWF0cml4S2V5czogc3RyaW5nIFtdID0gT2JqZWN0LmtleXMoY2FwYWJpbGl0eU1hdHJpeCk7XHJcbiAgICBsZXQgY2FwYWJpbGl0aWVzQXJyYXk6IGFueSBbXSA9IG5ldyBBcnJheSgpO1xyXG4gICAgZm9yIChsZXQga2V5cyBvZiBjYXBhYmlsaXR5TWF0cml4S2V5cykge1xyXG4gICAgICBsZXQga2V5QXJyYXkgPSBrZXlzLnNwbGl0KCdfJyk7XHJcbiAgICAgIGxldCBjYXBhYmlsaXR5T2JqZWN0ID0ge1xyXG4gICAgICAgICdjYXBhYmlsaXR5Q29kZSc6IGtleUFycmF5WzBdLFxyXG4gICAgICAgICdjb21wbGV4aXR5Q29kZSc6IGtleUFycmF5WzFdLFxyXG4gICAgICAgICdzY2VuZXJpb0NvZGUnOiBjYXBhYmlsaXR5TWF0cml4W2tleXNdXHJcbiAgICAgIH07XHJcbiAgICAgIGNhcGFiaWxpdGllc0FycmF5LnB1c2goY2FwYWJpbGl0eU9iamVjdCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY2FwYWJpbGl0aWVzQXJyYXk7XHJcbiAgfVxyXG5cclxuICBsb2FkUm9sZXMocm9sZXM6IGFueVtdKSB7XHJcbiAgICAvL2xldCBzZWxlY3RlZFJvbGVzIDogc3RyaW5nW10gPSBuZXcgQXJyYXkoKTtcclxuICAgIGxldCBzZWxlY3RlZFJvbGVzIDogc3RyaW5nID0gJyc7XHJcbiAgICBmb3IobGV0IHJvbGUgb2Ygcm9sZXMpIHtcclxuICAgICAgc2VsZWN0ZWRSb2xlcyA9IHNlbGVjdGVkUm9sZXMgKycgJCcrIHJvbGUubmFtZTtcclxuICAgICAgLy9zZWxlY3RlZFJvbGVzLnB1c2gocm9sZS5uYW1lKTtcclxuICAgIH1cclxuICAgIHJldHVybiBzZWxlY3RlZFJvbGVzO1xyXG4gIH1cclxuXHJcbiAgZ2V0VG90YWxDYW5kaWRhdGVDb3VudChjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBsZXQgcXVlcnkgPSB7fTtcclxuICAgIHRoaXMuY2FuZGlkYXRlUmVwb3NpdG9yeS5nZXRDb3VudChxdWVyeSwgKGVyciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNhbGxiYWNrKGVyciwgcmVzdWx0KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRDYXBhYmlsaXR5TWF0cml4V2l0aE5vdGVzKGNhcGFiaWxpdHlfbWF0cml4OiBhbnksY29tcGxleGl0eV9ub3RlX21hdHJpeDphbnkpIHtcclxuICAgIGZvciAobGV0IGNhcCBpbiBjb21wbGV4aXR5X25vdGVfbWF0cml4KSB7XHJcbiAgICAgIGlmKGNhcGFiaWxpdHlfbWF0cml4W2NhcF0pIHtcclxuICAgICAgICBjYXBhYmlsaXR5X21hdHJpeFtjYXBdLmNvbXBsZXhpdHlOb3RlID0gY29tcGxleGl0eV9ub3RlX21hdHJpeFtjYXBdO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgcmV0dXJuIGNhcGFiaWxpdHlfbWF0cml4O1xyXG4gIH1cclxuXHJcblxyXG4gIHVwZGF0ZUZpZWxkKF9pZDpzdHJpbmcsIGl0ZW06YW55LCBjYWxsYmFjazooZXJyb3I6YW55LCByZXN1bHQ6YW55KSA9PiB2b2lkKSB7XHJcbiAgICB0aGlzLmNhbmRpZGF0ZVJlcG9zaXRvcnkudXBkYXRlQnlVc2VySWQoIG5ldyBtb25nb29zZS5UeXBlcy5PYmplY3RJZChfaWQpLCBpdGVtLCBjYWxsYmFjayk7XHJcbiAgfVxyXG5cclxufVxyXG5cclxuT2JqZWN0LnNlYWwoQ2FuZGlkYXRlU2VydmljZSk7XHJcbmV4cG9ydCA9IENhbmRpZGF0ZVNlcnZpY2U7XHJcbiJdfQ==
