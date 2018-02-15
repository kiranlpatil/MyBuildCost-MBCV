"use strict";
var ProjectRepository = require("../dataaccess/repository/ProjectRepository");
var BuildingRepository = require("../dataaccess/repository/BuildingRepository");
var UserService = require("./../../framework/services/UserService");
var ProjectAsset = require("../../framework/shared/projectasset");
var BuildingModel = require("../dataaccess/model/Building");
var AuthInterceptor = require("../../framework/interceptor/auth.interceptor");
var CostControllException = require("../exception/CostControllException");
var Rate = require("../dataaccess/model/Rate");
var ClonedCostHead = require("../dataaccess/model/ClonedCostHead");
var ClonedWorkItem = require("../dataaccess/model/ClonedWorkItem");
var CostHead = require("../dataaccess/model/CostHead");
var RateAnalysisService = require("./RateAnalysisService");
var SubCategory = require("../dataaccess/model/SubCategory");
var config = require('config');
var log4js = require('log4js');
var alasql = require("alasql");
var ClonedSubcategory = require("../dataaccess/model/ClonedSubcategory");
var logger = log4js.getLogger('Project service');
var ProjectService = (function () {
    function ProjectService() {
        this.projectRepository = new ProjectRepository();
        this.buildingRepository = new BuildingRepository();
        this.APP_NAME = ProjectAsset.APP_NAME;
        this.authInterceptor = new AuthInterceptor();
        this.userService = new UserService();
    }
    ProjectService.prototype.create = function (data, user, callback) {
        var _this = this;
        if (!user._id) {
            callback(new CostControllException('UserId Not Found', null), null);
        }
        this.projectRepository.create(data, function (err, res) {
            if (err) {
                callback(err, null);
            }
            else {
                logger.info('Project service, create has been hit');
                logger.debug('Project ID : ' + res._id);
                logger.debug('Project Name : ' + res._doc.name);
                var projectId = res._id;
                var newData = { $push: { project: projectId } };
                var query = { _id: user._id };
                _this.userService.findOneAndUpdate(query, newData, { new: true }, function (err, resp) {
                    logger.info('Project service, findOneAndUpdate has been hit');
                    if (err) {
                        callback(err, null);
                    }
                    else {
                        delete res.category;
                        delete res.rate;
                        callback(null, res);
                    }
                });
            }
        });
    };
    ProjectService.prototype.getProject = function (projectId, user, callback) {
        var _this = this;
        var query = { _id: projectId };
        var populate = { path: 'building', select: ['name', 'totalSlabArea',] };
        this.projectRepository.findAndPopulate(query, populate, function (error, result) {
            logger.info('Project service, findAndPopulate has been hit');
            logger.debug('Project Name : ' + result[0]._doc.name);
            if (error) {
                callback(error, null);
            }
            else {
                callback(null, { data: result, access_token: _this.authInterceptor.issueTokenWithUid(user) });
            }
        });
    };
    ProjectService.prototype.updateProjectDetails = function (projectDetails, user, callback) {
        var _this = this;
        logger.info('Project service, updateProjectDetails has been hit');
        var query = { _id: projectDetails._id };
        delete projectDetails._id;
        this.projectRepository.findOneAndUpdate(query, projectDetails, { new: true }, function (error, result) {
            logger.info('Project service, findOneAndUpdate has been hit');
            if (error) {
                callback(error, null);
            }
            else {
                callback(null, { data: result, access_token: _this.authInterceptor.issueTokenWithUid(user) });
            }
        });
    };
    ProjectService.prototype.addBuilding = function (projectId, buildingDetail, user, callback) {
        var _this = this;
        this.buildingRepository.create(buildingDetail, function (error, result) {
            logger.info('Project service, create has been hit');
            if (error) {
                callback(error, null);
            }
            else {
                var query = { _id: projectId };
                var newData = { $push: { building: result._id } };
                _this.projectRepository.findOneAndUpdate(query, newData, { new: true }, function (error, status) {
                    logger.info('Project service, findOneAndUpdate has been hit');
                    if (error) {
                        callback(error, null);
                    }
                    else {
                        callback(null, { data: result, access_token: _this.authInterceptor.issueTokenWithUid(user) });
                    }
                });
            }
        });
    };
    ProjectService.prototype.updateBuilding = function (buildingId, buildingDetail, user, callback) {
        var _this = this;
        logger.info('Project service, updateBuilding has been hit');
        var query = { _id: buildingId };
        this.buildingRepository.findOneAndUpdate(query, buildingDetail, { new: true }, function (error, result) {
            logger.info('Project service, findOneAndUpdate has been hit');
            if (error) {
                callback(error, null);
            }
            else {
                callback(null, { data: result, access_token: _this.authInterceptor.issueTokenWithUid(user) });
            }
        });
    };
    ProjectService.prototype.cloneBuildingDetails = function (buildingId, buildingDetail, user, callback) {
        var _this = this;
        logger.info('Project service, cloneBuildingDetails has been hit');
        var query = { _id: buildingId };
        this.buildingRepository.findById(buildingId, function (error, result) {
            logger.info('Project service, findById has been hit');
            if (error) {
                callback(error, null);
            }
            else {
                var clonedCostHeadDetails = [];
                var costHeads = buildingDetail.costHead;
                var resultCostHeads = result.costHead;
                for (var _i = 0, costHeads_1 = costHeads; _i < costHeads_1.length; _i++) {
                    var costHead = costHeads_1[_i];
                    for (var _a = 0, resultCostHeads_1 = resultCostHeads; _a < resultCostHeads_1.length; _a++) {
                        var resultCostHead = resultCostHeads_1[_a];
                        if (costHead.name === resultCostHead.name) {
                            var clonedCostHead = new CostHead;
                            clonedCostHead.name = resultCostHead.name;
                            clonedCostHead.rateAnalysisId = resultCostHead.rateAnalysisId;
                            clonedCostHead.active = costHead.active;
                            clonedCostHead.thumbRuleRate = resultCostHead.thumbRuleRate;
                            if (costHead.active) {
                                var subcategoryList = costHead.subCategory;
                                var resultSubCategoryList = resultCostHead.subCategory;
                                for (var resultSubcategoryIndex = 0; resultSubcategoryIndex < resultSubCategoryList.length; resultSubcategoryIndex++) {
                                    for (var subcategoryIndex = 0; subcategoryIndex < subcategoryList.length; subcategoryIndex++) {
                                        if (subcategoryList[subcategoryIndex].name === resultSubCategoryList[resultSubcategoryIndex].name) {
                                            if (!subcategoryList[subcategoryIndex].active) {
                                                resultSubCategoryList.splice(resultSubcategoryIndex, 1);
                                            }
                                            else {
                                                var resultWorkitemList = resultSubCategoryList[resultSubcategoryIndex].workitem;
                                                var workItemList = subcategoryList[subcategoryIndex].workitem;
                                                for (var resultWorkitemIndex = 0; resultWorkitemIndex < resultWorkitemList.length; resultWorkitemIndex++) {
                                                    for (var workitemIndex = 0; workitemIndex < workItemList.length; workitemIndex++) {
                                                        if (!workItemList[workitemIndex].active) {
                                                            resultWorkitemList.splice(resultWorkitemIndex, 1);
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                clonedCostHead.subCategory = resultCostHead.subCategory;
                            }
                            else {
                                clonedCostHead.subCategory = resultCostHead.subCategory;
                            }
                            clonedCostHeadDetails.push(clonedCostHead);
                        }
                    }
                }
                var updateBuildingCostHeads = { 'costHead': clonedCostHeadDetails };
                _this.buildingRepository.findOneAndUpdate(query, updateBuildingCostHeads, { new: true }, function (error, result) {
                    logger.info('Project service, findOneAndUpdate has been hit');
                    if (error) {
                        callback(error, null);
                    }
                    else {
                        callback(null, { data: result, access_token: _this.authInterceptor.issueTokenWithUid(user) });
                    }
                });
            }
        });
    };
    ProjectService.prototype.getBuilding = function (projectId, buildingId, user, callback) {
        var _this = this;
        logger.info('Project service, getBuilding has been hit');
        this.buildingRepository.findById(buildingId, function (error, result) {
            logger.info('Project service, findById has been hit');
            if (error) {
                callback(error, null);
            }
            else {
                callback(null, { data: result, access_token: _this.authInterceptor.issueTokenWithUid(user) });
            }
        });
    };
    ProjectService.prototype.getInActiveCostHead = function (projectId, buildingId, user, callback) {
        var _this = this;
        logger.info('Project service, getInActiveCostHead has been hit');
        this.buildingRepository.findById(buildingId, function (error, result) {
            if (error) {
                callback(error, null);
            }
            else {
                logger.info('Project service, findById has been hit');
                logger.debug('getting InActive CostHead for Building Name : ' + result.name);
                var response = result.costHead;
                var inactiveCostHead = [];
                for (var _i = 0, response_1 = response; _i < response_1.length; _i++) {
                    var costHeadItem = response_1[_i];
                    if (!costHeadItem.active) {
                        inactiveCostHead.push(costHeadItem);
                    }
                }
                callback(null, { data: inactiveCostHead, access_token: _this.authInterceptor.issueTokenWithUid(user) });
            }
        });
    };
    ProjectService.prototype.getClonedBuilding = function (projectId, buildingId, user, callback) {
        var _this = this;
        logger.info('Project service, getClonedBuilding has been hit');
        this.buildingRepository.findById(buildingId, function (error, result) {
            logger.info('Project service, findById has been hit');
            if (error) {
                callback(error, null);
            }
            else {
                var clonedBuilding = result.costHead;
                var building = new BuildingModel();
                building.name = result.name;
                building.totalSlabArea = result.totalSlabArea;
                building.totalCarperAreaOfUnit = result.totalCarperAreaOfUnit;
                building.totalSaleableAreaOfUnit = result.totalSaleableAreaOfUnit;
                building.plinthArea = result.plinthArea;
                building.totalNoOfFloors = result.totalNoOfFloors;
                building.noOfParkingFloors = result.noOfParkingFloors;
                building.carpetAreaOfParking = result.carpetAreaOfParking;
                building.noOfOneBHK = result.noOfOneBHK;
                building.noOfTwoBHK = result.noOfTwoBHK;
                building.noOfThreeBHK = result.noOfThreeBHK;
                building.noOfFourBHK = result.noOfFourBHK;
                building.noOfFiveBHK = result.noOfFiveBHK;
                building.noOfLift = result.noOfLift;
                var clonedCostHeadArray = [];
                for (var costHeadIndex = 0; costHeadIndex < clonedBuilding.length; costHeadIndex++) {
                    var clonedCostHead = new ClonedCostHead;
                    clonedCostHead.name = clonedBuilding[costHeadIndex].name;
                    clonedCostHead.rateAnalysisId = clonedBuilding[costHeadIndex].rateAnalysisId;
                    clonedCostHead.active = clonedBuilding[costHeadIndex].active;
                    clonedCostHead.budgetedCostAmount = clonedBuilding[costHeadIndex].budgetedCostAmount;
                    var clonedWorkItemArray = [];
                    var clonedSubcategoryArray = [];
                    var subCategoryArray = clonedBuilding[costHeadIndex].subCategory;
                    for (var subCategoryIndex = 0; subCategoryIndex < subCategoryArray.length; subCategoryIndex++) {
                        var clonedSubcategory = new ClonedSubcategory();
                        clonedSubcategory.name = subCategoryArray[subCategoryIndex].name;
                        clonedSubcategory.rateAnalysisId = subCategoryArray[subCategoryIndex].rateAnalysisId;
                        clonedSubcategory.amount = subCategoryArray[subCategoryIndex].amount;
                        clonedSubcategory.active = true;
                        var workitemArray = subCategoryArray[subCategoryIndex].workitem;
                        for (var workitemIndex = 0; workitemIndex < workitemArray.length; workitemIndex++) {
                            var clonedWorkItem = new ClonedWorkItem();
                            clonedWorkItem.name = workitemArray[workitemIndex].name;
                            clonedWorkItem.rateAnalysisId = workitemArray[workitemIndex].rateAnalysisId;
                            clonedWorkItem.unit = workitemArray[workitemIndex].unit;
                            clonedWorkItem.amount = workitemArray[workitemIndex].amount;
                            clonedWorkItem.rate = workitemArray[workitemIndex].rate;
                            clonedWorkItem.quantity = workitemArray[workitemIndex].quantity;
                            clonedWorkItemArray.push(clonedWorkItem);
                        }
                        clonedSubcategory.workitem = clonedWorkItemArray;
                        clonedSubcategoryArray.push(clonedSubcategory);
                    }
                    clonedCostHead.subCategory = clonedSubcategoryArray;
                    clonedCostHeadArray.push(clonedCostHead);
                }
                building.costHead = clonedCostHeadArray;
                callback(null, { data: building, access_token: _this.authInterceptor.issueTokenWithUid(user) });
            }
        });
    };
    ProjectService.prototype.deleteBuilding = function (projectId, buildingId, user, callback) {
        var _this = this;
        logger.info('Project service, deleteBuilding has been hit');
        var popBuildingId = buildingId;
        this.buildingRepository.delete(buildingId, function (error, result) {
            if (error) {
                callback(error, null);
            }
            else {
                var query = { _id: projectId };
                var newData = { $pull: { building: popBuildingId } };
                _this.projectRepository.findOneAndUpdate(query, newData, { new: true }, function (error, status) {
                    logger.info('Project service, findOneAndUpdate has been hit');
                    if (error) {
                        callback(error, null);
                    }
                    else {
                        callback(null, { data: status, access_token: _this.authInterceptor.issueTokenWithUid(user) });
                    }
                });
            }
        });
    };
    ProjectService.prototype.getQuantity = function (projectId, buildingId, costhead, workitem, user, callback) {
        var _this = this;
        logger.info('Project service, getQuantity has been hit');
        this.buildingRepository.findById(buildingId, function (error, building) {
            if (error) {
                callback(error, null);
            }
            else {
                var quantity = void 0;
                for (var index = 0; building.costHead.length > index; index++) {
                    if (building.costHead[index].name === costhead) {
                        quantity = building.costHead[index].workitem[workitem].quantity;
                    }
                }
                if (quantity.total === null) {
                    for (var index = 0; quantity.item.length > index; index++) {
                        quantity.total = quantity.item[index].quantity + quantity.total;
                    }
                }
                callback(null, { data: quantity, access_token: _this.authInterceptor.issueTokenWithUid(user) });
            }
        });
    };
    ProjectService.prototype.getRate = function (projectId, buildingId, costheadId, subcategoryId, workitemId, user, callback) {
        var _this = this;
        logger.info('Project service, getRate has been hit');
        var rateAnalysisServices = new RateAnalysisService();
        rateAnalysisServices.getRate(workitemId, function (error, rateData) {
            if (error) {
                callback(error, null);
            }
            else {
                var rate = new Rate();
                rate.item = rateData;
                callback(null, { data: rateData, access_token: _this.authInterceptor.issueTokenWithUid(user) });
            }
        });
    };
    ProjectService.prototype.updateRate = function (projectId, buildingId, costheadId, subcategoryId, workitemId, rate, user, callback) {
        var _this = this;
        logger.info('Project service, updateRate has been hit');
        this.buildingRepository.findById(buildingId, function (error, building) {
            logger.info('Project service, findById has been hit');
            if (error) {
                callback(error, null);
            }
            else {
                var rateAnalysisId = void 0;
                for (var index = 0; building.costHead.length > index; index++) {
                    if (building.costHead[index].rateAnalysisId === costheadId) {
                        for (var indexSubcategory = 0; building.costHead[index].subCategory.length > indexSubcategory; indexSubcategory++) {
                            if (building.costHead[index].subCategory[indexSubcategory].rateAnalysisId === subcategoryId) {
                                for (var indexWorkitem = 0; building.costHead[index].subCategory[indexSubcategory].workitem.length > indexWorkitem; indexWorkitem++) {
                                    if (building.costHead[index].subCategory[indexSubcategory].workitem[indexWorkitem].rateAnalysisId === workitemId) {
                                        building.costHead[index].subCategory[indexSubcategory].workitem[indexWorkitem].rate = rate;
                                    }
                                }
                            }
                        }
                    }
                }
                var query = { '_id': buildingId };
                var newData = { $set: { 'costHead': building.costHead } };
                _this.buildingRepository.findOneAndUpdate(query, newData, { new: true }, function (error, result) {
                    if (error) {
                        callback(error, null);
                    }
                    else {
                        callback(null, { data: rate, access_token: _this.authInterceptor.issueTokenWithUid(user) });
                    }
                });
            }
        });
    };
    ProjectService.prototype.deleteQuantity = function (projectId, buildingId, costheadId, subcategoryId, workitemId, user, item, callback) {
        var _this = this;
        logger.info('Project service, deleteQuantity has been hit');
        this.buildingRepository.findById(buildingId, function (error, building) {
            if (error) {
                callback(error, null);
            }
            else {
                var quantity = void 0;
                _this.costHeadId = parseInt(costheadId);
                _this.subCategoryId = parseInt(subcategoryId);
                _this.workItemId = parseInt(workitemId);
                for (var index = 0; building.costHead.length > index; index++) {
                    if (building.costHead[index].rateAnalysisId === _this.costHeadId) {
                        for (var index1 = 0; building.costHead[index].subCategory.length > index1; index1++) {
                            if (building.costHead[index].subCategory[index1].rateAnalysisId === _this.subCategoryId) {
                                for (var index2 = 0; building.costHead[index].subCategory[index1].workitem.length > index2; index2++) {
                                    if (building.costHead[index].subCategory[index1].workitem[index2].rateAnalysisId === _this.workItemId) {
                                        quantity = building.costHead[index].subCategory[index1].workitem[index2].quantity;
                                    }
                                }
                            }
                        }
                    }
                }
                for (var index = 0; quantity.item.length > index; index++) {
                    if (quantity.item[index].item === item) {
                        quantity.item.splice(index, 1);
                    }
                }
                var query = { _id: buildingId };
                _this.buildingRepository.findOneAndUpdate(query, building, { new: true }, function (error, building) {
                    logger.info('Project service, findOneAndUpdate has been hit');
                    if (error) {
                        callback(error, null);
                    }
                    else {
                        var quantity_1;
                        for (var index = 0; building.costHead.length > index; index++) {
                            if (building.costHead[index].rateAnalysisId === _this.costHeadId) {
                                for (var index1 = 0; building.costHead[index].subCategory.length > index1; index1++) {
                                    if (building.costHead[index].subCategory[index1].rateAnalysisId === _this.subCategoryId) {
                                        for (var index2 = 0; building.costHead[index].subCategory[index1].workitem.length > index2; index2++) {
                                            if (building.costHead[index].subCategory[index1].workitem[index2].rateAnalysisId === _this.workItemId) {
                                                quantity_1 = building.costHead[index].subCategory[index1].workitem[index2].quantity;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (quantity_1.total === null) {
                            for (var index = 0; quantity_1.item.length > index; index++) {
                                quantity_1.total = quantity_1.item[index].quantity + quantity_1.total;
                            }
                        }
                        callback(null, { data: quantity_1, access_token: _this.authInterceptor.issueTokenWithUid(user) });
                    }
                });
            }
        });
    };
    ProjectService.prototype.deleteWorkitem = function (projectId, buildingId, costheadId, subcategoryId, workitemId, user, callback) {
        var _this = this;
        logger.info('Project service, delete Workitem has been hit');
        this.buildingRepository.findById(buildingId, function (error, building) {
            if (error) {
                callback(error, null);
            }
            else {
                var costHeadList = building.costHead;
                var subCategoryList = void 0;
                var WorkItemList = void 0;
                var flag = 0;
                for (var index = 0; index < costHeadList.length; index++) {
                    if (costheadId === costHeadList[index].rateAnalysisId) {
                        subCategoryList = costHeadList[index].subCategory;
                        for (var subcategoryIndex = 0; subcategoryIndex < subCategoryList.length; subcategoryIndex++) {
                            if (subcategoryId === subCategoryList[subcategoryIndex].rateAnalysisId) {
                                WorkItemList = subCategoryList[subcategoryIndex].workitem;
                                for (var workitemIndex = 0; workitemIndex < WorkItemList.length; workitemIndex++) {
                                    if (workitemId === WorkItemList[workitemIndex].rateAnalysisId) {
                                        flag = 1;
                                        WorkItemList.splice(workitemIndex, 1);
                                    }
                                }
                            }
                        }
                    }
                }
                if (flag === 1) {
                    var query = { _id: buildingId };
                    _this.buildingRepository.findOneAndUpdate(query, building, { new: true }, function (error, WorkItemList) {
                        logger.info('Project service, findOneAndUpdate has been hit');
                        if (error) {
                            callback(error, null);
                        }
                        else {
                            var message = 'WorkItem deleted.';
                            callback(null, { data: WorkItemList, access_token: _this.authInterceptor.issueTokenWithUid(user) });
                        }
                    });
                }
                else {
                    callback(error, null);
                }
            }
        });
    };
    ProjectService.prototype.getReportCostHeadDetails = function (buildingId, costHead, user, callback) {
        var _this = this;
        this.buildingRepository.findById(buildingId, function (error, result) {
            logger.info('Project service, findById has been hit');
            if (error) {
                callback(error, null);
            }
            else {
                var response = result.costHead;
                var costHeadItem = void 0;
                for (var _i = 0, response_2 = response; _i < response_2.length; _i++) {
                    var costHeadItems = response_2[_i];
                    if (costHeadItems.name === costHead) {
                        costHeadItem = costHeadItems.workitem;
                    }
                }
                callback(null, { data: costHeadItem, access_token: _this.authInterceptor.issueTokenWithUid(user) });
            }
        });
    };
    ProjectService.prototype.updateBuildingCostHeadStatus = function (buildingId, costHeadId, costHeadActiveStatus, user, callback) {
        var _this = this;
        var query = { '_id': buildingId, 'costHead.rateAnalysisId': costHeadId };
        var activeStatus = JSON.parse(costHeadActiveStatus);
        var newData = { $set: { 'costHead.$.active': activeStatus } };
        this.buildingRepository.findOneAndUpdate(query, newData, { new: true }, function (err, response) {
            logger.info('Project service, findOneAndUpdate has been hit');
            if (err) {
                callback(err, null);
            }
            else {
                callback(null, { data: response, access_token: _this.authInterceptor.issueTokenWithUid(user) });
            }
        });
    };
    ProjectService.prototype.updateBudgetedCostForCostHead = function (buildingId, costHeadBudgetedAmount, user, callback) {
        var _this = this;
        logger.info('Project service, updateBudgetedCostForCostHead has been hit');
        var query = { '_id': buildingId, 'costHead.name': costHeadBudgetedAmount.costHead };
        var costInUnit = costHeadBudgetedAmount.costIn;
        var costPerUnit = costHeadBudgetedAmount.costPer;
        var rate = 0;
        var newData;
        rate = costHeadBudgetedAmount.budgetedCostAmount / costHeadBudgetedAmount.buildingArea;
        if (costPerUnit === 'saleableArea' && costInUnit === 'sqft') {
            newData = { $set: {
                    'costHead.$.thumbRuleRate.saleableArea.sqft': rate,
                    'costHead.$.thumbRuleRate.saleableArea.sqmt': rate / config.get('SqureMeter')
                } };
        }
        else if (costPerUnit === 'saleableArea' && costInUnit === 'sqmt') {
            newData = { $set: {
                    'costHead.$.thumbRuleRate.saleableArea.sqmt': rate,
                    'costHead.$.thumbRuleRate.saleableArea.sqft': rate * config.get('SqureMeter')
                } };
        }
        else if (costPerUnit === 'slabArea' && costInUnit === 'sqft') {
            newData = { $set: {
                    'costHead.$.thumbRuleRate.slabArea.sqft': rate,
                    'costHead.$.thumbRuleRate.slabArea.sqmt': rate / config.get('SqureMeter')
                } };
        }
        else if (costPerUnit === 'slabArea' && costInUnit === 'sqmt') {
            newData = { $set: {
                    'costHead.$.thumbRuleRate.slabArea.sqmt': rate,
                    'costHead.$.thumbRuleRate.slabArea.sqft': rate * config.get('SqureMeter')
                } };
        }
        this.buildingRepository.findOneAndUpdate(query, newData, { new: true }, function (err, response) {
            logger.info('Project service, findOneAndUpdate has been hit');
            if (err) {
                callback(err, null);
            }
            else {
                callback(null, { data: response, access_token: _this.authInterceptor.issueTokenWithUid(user) });
            }
        });
    };
    ProjectService.prototype.createQuantity = function (projectId, buildingId, costhead, workitem, quantity, user, callback) {
        var _this = this;
        this.buildingRepository.findById(buildingId, function (error, building) {
            logger.info('Project service, findById has been hit');
            if (error) {
                callback(error, null);
            }
            else {
                for (var index = 0; building.costHead.length > index; index++) {
                    if (building.costHead[index].name === costhead) {
                        var quantityArray = building.costHead[index].workitem[workitem].quantity.item;
                        var exist = false;
                        var errorMessage = void 0;
                        for (var quantityIndex = 0; quantityArray.length > quantityIndex; quantityIndex++) {
                            if (quantityArray[quantityIndex].item === quantity.item) {
                                exist = true;
                                errorMessage = 'Quantity name already exist. ';
                                if (quantityArray[quantityIndex].remarks === quantity.remarks) {
                                    exist = true;
                                    errorMessage = errorMessage + 'same remarks is also exist with quantity name.';
                                }
                                else {
                                    exist = false;
                                }
                            }
                        }
                        if (exist) {
                            callback(new CostControllException(errorMessage, errorMessage), null);
                        }
                        else {
                            quantityArray.push(quantity);
                            var query = { _id: buildingId };
                            _this.buildingRepository.findOneAndUpdate(query, building, { new: true }, function (error, building) {
                                logger.info('Project service, findOneAndUpdate has been hit');
                                if (error) {
                                    callback(error, null);
                                }
                                else {
                                    var quantity_2;
                                    for (var index_1 = 0; building.costHead.length > index_1; index_1++) {
                                        if (building.costHead[index_1].name === costhead) {
                                            quantity_2 = building.costHead[index_1].workitem[workitem].quantity;
                                        }
                                    }
                                    if (quantity_2.total === null) {
                                        for (var index_2 = 0; quantity_2.item.length > index_2; index_2++) {
                                            quantity_2.total = quantity_2.item[index_2].quantity + quantity_2.total;
                                        }
                                    }
                                    callback(null, { data: quantity_2, access_token: _this.authInterceptor.issueTokenWithUid(user) });
                                }
                            });
                        }
                    }
                }
            }
        });
    };
    ProjectService.prototype.updateQuantity = function (projectId, buildingId, costheadId, subcategoryId, workitemId, quantity, user, callback) {
        var _this = this;
        logger.info('Project service, updateQuantity has been hit');
        this.buildingRepository.findById(buildingId, function (error, building) {
            if (error) {
                callback(error, null);
            }
            else {
                var costHeadList = building.costHead;
                var quantityArray = void 0;
                for (var index = 0; index < costHeadList.length; index++) {
                    if (parseInt(costheadId) === costHeadList[index].rateAnalysisId) {
                        for (var index1 = 0; index1 < costHeadList[index].subCategory.length; index1++) {
                            if (parseInt(subcategoryId) === costHeadList[index].subCategory[index1].rateAnalysisId) {
                                for (var index2 = 0; index2 < costHeadList[index].subCategory[index1].workitem.length; index2++) {
                                    if (parseInt(workitemId) === costHeadList[index].subCategory[index1].workitem[index2].rateAnalysisId) {
                                        quantityArray = costHeadList[index].subCategory[index1].workitem[index2].quantity;
                                        quantityArray.item = quantity;
                                        quantityArray.total = 0;
                                        for (var itemIndex = 0; quantityArray.item.length > itemIndex; itemIndex++) {
                                            quantityArray.total = quantityArray.item[itemIndex].quantity + quantityArray.total;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                var query = { _id: buildingId };
                _this.buildingRepository.findOneAndUpdate(query, building, { new: true }, function (error, building) {
                    logger.info('Project service, findOneAndUpdate has been hit');
                    if (error) {
                        callback(error, null);
                    }
                    else {
                        var costHeadList_1 = building.costHead;
                        var quantity_3;
                        for (var index = 0; index < costHeadList_1.length; index++) {
                            if (parseInt(costheadId) === costHeadList_1[index].rateAnalysisId) {
                                for (var index1 = 0; index1 < costHeadList_1[index].subCategory.length; index1++) {
                                    if (parseInt(subcategoryId) === costHeadList_1[index].subCategory[index1].rateAnalysisId) {
                                        for (var index2 = 0; index2 < costHeadList_1[index].subCategory[index1].workitem.length; index2++) {
                                            if (parseInt(workitemId) === costHeadList_1[index].subCategory[index1].workitem[index2].rateAnalysisId) {
                                                quantity_3 = costHeadList_1[index].subCategory[index1].workitem[index2].quantity;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (quantity_3.total === null) {
                            for (var index = 0; index < quantity_3.item.length; index++) {
                                quantity_3.total = quantity_3.item[index].quantity + quantity_3.total;
                            }
                        }
                        callback(null, { data: quantity_3, access_token: _this.authInterceptor.issueTokenWithUid(user) });
                    }
                });
            }
        });
    };
    ProjectService.prototype.getAllSubcategoriesByCostHeadId = function (projectId, buildingId, costheadId, user, callback) {
        var _this = this;
        var rateAnalysisServices = new RateAnalysisService();
        var url = config.get('rateAnalysisAPI.subCategories');
        rateAnalysisServices.getApiCall(url, function (error, subCategories) {
            if (error) {
                callback(error, null);
            }
            else {
                var costHead = parseInt(costheadId);
                var subCategoriesList = subCategories.SubItemType;
                var sqlQuery = 'SELECT subCategoriesList.C1 AS rateAnalysisId, subCategoriesList.C2 AS subCategory ' +
                    'FROM ? AS subCategoriesList WHERE subCategoriesList.C3 = ' + costHead;
                subCategoriesList = alasql(sqlQuery, [subCategoriesList]);
                callback(null, { data: subCategoriesList, access_token: _this.authInterceptor.issueTokenWithUid(user) });
            }
        });
    };
    ProjectService.prototype.getWorkitemList = function (projectId, buildingId, costheadId, subCategoryId, user, callback) {
        var _this = this;
        logger.info('Project service, getWorkitemList has been hit');
        var rateAnalysisServices = new RateAnalysisService();
        rateAnalysisServices.getWorkitemList(costheadId, subCategoryId, function (error, workitemList) {
            if (error) {
                callback(error, null);
            }
            else {
                callback(null, { data: workitemList, access_token: _this.authInterceptor.issueTokenWithUid(user) });
            }
        });
    };
    ProjectService.prototype.addWorkitem = function (projectId, buildingId, costheadId, subCategoryId, workitem, user, callback) {
        var _this = this;
        logger.info('Project service, addWorkitem has been hit');
        this.buildingRepository.findById(buildingId, function (error, building) {
            if (error) {
                callback(error, null);
            }
            else {
                var responseWorkitem_1 = null;
                for (var index = 0; building.costHead.length > index; index++) {
                    if (building.costHead[index].rateAnalysisId === costheadId) {
                        var subCategory = building.costHead[index].subCategory;
                        for (var subCategoryIndex = 0; subCategory.length > subCategoryIndex; subCategoryIndex++) {
                            if (subCategory[subCategoryIndex].rateAnalysisId === subCategoryId) {
                                subCategory[subCategoryIndex].workitem.push(workitem);
                                responseWorkitem_1 = subCategory[subCategoryIndex].workitem;
                            }
                        }
                        var query = { _id: buildingId };
                        var newData = { $set: { 'costHead': building.costHead } };
                        _this.buildingRepository.findOneAndUpdate(query, newData, { new: true }, function (error, building) {
                            logger.info('Project service, findOneAndUpdate has been hit');
                            if (error) {
                                callback(error, null);
                            }
                            else {
                                callback(null, { data: responseWorkitem_1, access_token: _this.authInterceptor.issueTokenWithUid(user) });
                            }
                        });
                    }
                }
            }
        });
    };
    ProjectService.prototype.addSubcategoryToCostHead = function (projectId, buildingId, costheadId, subcategoryObject, user, callback) {
        var _this = this;
        var subCategoryObj = new SubCategory(subcategoryObject.subCategory, subcategoryObject.subCategoryId);
        var query = { '_id': buildingId, 'costHead.rateAnalysisId': parseInt(costheadId) };
        var newData = { $push: { 'costHead.$.subCategory': subCategoryObj } };
        this.buildingRepository.findOneAndUpdate(query, newData, { new: true }, function (error, building) {
            logger.info('Project service, addSubcategoryToCostHead has been hit');
            if (error) {
                callback(error, null);
            }
            else {
                callback(null, { data: building, access_token: _this.authInterceptor.issueTokenWithUid(user) });
            }
        });
    };
    ProjectService.prototype.deleteSubcategoryFromCostHead = function (projectId, buildingId, costheadId, subcategoryObject, user, callback) {
        var _this = this;
        this.buildingRepository.findById(buildingId, function (error, building) {
            logger.info('Project service, deleteSubcategoryFromCostHead has been hit');
            if (error) {
                callback(error, null);
            }
            else {
                var costHeadList = building.costHead;
                var subCategoryList = [];
                for (var index = 0; index < costHeadList.length; index++) {
                    if (parseInt(costheadId) === costHeadList[index].rateAnalysisId) {
                        subCategoryList = costHeadList[index].subCategory;
                        for (var subcategoryIndex = 0; subcategoryIndex < subCategoryList.length; subcategoryIndex++) {
                            if (subCategoryList[subcategoryIndex].rateAnalysisId === subcategoryObject.rateAnalysisId) {
                                subCategoryList.splice(subcategoryIndex, 1);
                            }
                        }
                    }
                }
                var query = { '_id': buildingId, 'costHead.rateAnalysisId': parseInt(costheadId) };
                var newData = { '$set': { 'costHead.$.subCategory': subCategoryList } };
                _this.buildingRepository.findOneAndUpdate(query, newData, { new: true }, function (error, dataList) {
                    logger.info('Project service, deleteSubcategoryFromCostHead has been hit');
                    if (error) {
                        callback(error, null);
                    }
                    else {
                        callback(null, { data: dataList, access_token: _this.authInterceptor.issueTokenWithUid(user) });
                    }
                });
            }
        });
    };
    ProjectService.prototype.getSubcategory = function (projectId, buildingId, costheadId, user, callback) {
        var _this = this;
        logger.info('Project service, getSubcategory has been hit');
        this.buildingRepository.findById(buildingId, function (error, building) {
            if (error) {
                callback(error, null);
            }
            else {
                var subCategories = null;
                for (var index = 0; building.costHead.length > index; index++) {
                    if (building.costHead[index].rateAnalysisId === costheadId) {
                        subCategories = building.costHead[index].subCategory;
                        var workitems = subCategories;
                        for (var subcategoryIndex = 0; subcategoryIndex < subCategories.length; subcategoryIndex++) {
                            var workitems_1 = subCategories[subcategoryIndex].workitem;
                            for (var workitemsIndex = 0; workitemsIndex < workitems_1.length; workitemsIndex++) {
                                var workitem = workitems_1[workitemsIndex];
                                if (workitem.quantity.total !== null && workitem.rate.total !== null
                                    && workitem.quantity.total !== 0 && workitem.rate.total !== 0) {
                                    subCategories[subcategoryIndex].amount = parseFloat((workitem.quantity.total * workitem.rate.total
                                        + subCategories[subcategoryIndex].amount).toFixed(2));
                                }
                                else {
                                    subCategories[subcategoryIndex].amount = 0;
                                    break;
                                }
                            }
                        }
                    }
                }
                callback(null, { data: subCategories, access_token: _this.authInterceptor.issueTokenWithUid(user) });
            }
        });
    };
    return ProjectService;
}());
Object.seal(ProjectService);
module.exports = ProjectService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHBsaWNhdGlvblByb2plY3Qvc2VydmljZXMvUHJvamVjdFNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhFQUFpRjtBQUNqRixnRkFBbUY7QUFFbkYsb0VBQXVFO0FBQ3ZFLGtFQUFxRTtBQUlyRSw0REFBK0Q7QUFDL0QsOEVBQWlGO0FBQ2pGLDBFQUE2RTtBQUU3RSwrQ0FBa0Q7QUFDbEQsbUVBQXNFO0FBQ3RFLG1FQUFzRTtBQUN0RSx1REFBMEQ7QUFHMUQsMkRBQThEO0FBRTlELDZEQUFnRTtBQUNoRSxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDL0IsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLCtCQUFrQztBQUNsQyx5RUFBNEU7QUFDNUUsSUFBSSxNQUFNLEdBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBRS9DO0lBV0U7UUFDRSxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxpQkFBaUIsRUFBRSxDQUFDO1FBQ2pELElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLGtCQUFrQixFQUFFLENBQUM7UUFDbkQsSUFBSSxDQUFDLFFBQVEsR0FBRyxZQUFZLENBQUMsUUFBUSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxlQUFlLEVBQUUsQ0FBQztRQUM3QyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7SUFDdkMsQ0FBQztJQUVELCtCQUFNLEdBQU4sVUFBTyxJQUFTLEVBQUUsSUFBVyxFQUFFLFFBQTJDO1FBQTFFLGlCQXFDQztRQXBDQyxFQUFFLENBQUEsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2IsUUFBUSxDQUFDLElBQUkscUJBQXFCLENBQUMsa0JBQWtCLEVBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDckUs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M0MsRUFBRSxDQUFBLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEtBQUssSUFBSSxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLLElBQUk7dUNBQzlELFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxLQUFLLENBQUMsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29DQUNoRSxhQUFhLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLOzBDQUM5RixhQUFhLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQ0FDMUQsQ0FBQztnQ0FBQyxJQUFJLENBQUMsQ0FBQztvQ0FDTixhQUFhLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxNQUFNLEdBQUMsQ0FBQyxDQUFDO29DQUN6QyxLQUFLLENBQUM7Z0NBQ1IsQ0FBQzs0QkFDSCxDQUFDO3dCQUNILENBQUM7b0JBQ0gsQ0FBQztnQkFDSCxDQUFDO2dCQUNELFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBQyxJQUFJLEVBQUUsYUFBYSxFQUFFLFlBQVksRUFBRSxLQUFJLENBQUMsZUFBZSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsQ0FBQztZQUNwRyxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBQ0gscUJBQUM7QUFBRCxDQWwwQkEsQUFrMEJDLElBQUE7QUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQzVCLGlCQUFTLGNBQWMsQ0FBQyIsImZpbGUiOiJhcHAvYXBwbGljYXRpb25Qcm9qZWN0L3NlcnZpY2VzL1Byb2plY3RTZXJ2aWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFByb2plY3RSZXBvc2l0b3J5ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L1Byb2plY3RSZXBvc2l0b3J5Jyk7XHJcbmltcG9ydCBCdWlsZGluZ1JlcG9zaXRvcnkgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL3JlcG9zaXRvcnkvQnVpbGRpbmdSZXBvc2l0b3J5Jyk7XHJcbmltcG9ydCBNZXNzYWdlcyA9IHJlcXVpcmUoJy4uL3NoYXJlZC9tZXNzYWdlcycpO1xyXG5pbXBvcnQgVXNlclNlcnZpY2UgPSByZXF1aXJlKCcuLy4uLy4uL2ZyYW1ld29yay9zZXJ2aWNlcy9Vc2VyU2VydmljZScpO1xyXG5pbXBvcnQgUHJvamVjdEFzc2V0ID0gcmVxdWlyZSgnLi4vLi4vZnJhbWV3b3JrL3NoYXJlZC9wcm9qZWN0YXNzZXQnKTtcclxuaW1wb3J0IFVzZXIgPSByZXF1aXJlKCcuLi8uLi9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9tb25nb29zZS91c2VyJyk7XHJcbmltcG9ydCBQcm9qZWN0ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb25nb29zZS9Qcm9qZWN0Jyk7XHJcbmltcG9ydCBCdWlsZGluZyA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9uZ29vc2UvQnVpbGRpbmcnKTtcclxuaW1wb3J0IEJ1aWxkaW5nTW9kZWwgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL0J1aWxkaW5nJyk7XHJcbmltcG9ydCBBdXRoSW50ZXJjZXB0b3IgPSByZXF1aXJlKCcuLi8uLi9mcmFtZXdvcmsvaW50ZXJjZXB0b3IvYXV0aC5pbnRlcmNlcHRvcicpO1xyXG5pbXBvcnQgQ29zdENvbnRyb2xsRXhjZXB0aW9uID0gcmVxdWlyZSgnLi4vZXhjZXB0aW9uL0Nvc3RDb250cm9sbEV4Y2VwdGlvbicpO1xyXG5pbXBvcnQgUXVhbnRpdHkgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL1F1YW50aXR5Jyk7XHJcbmltcG9ydCBSYXRlID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9SYXRlJyk7XHJcbmltcG9ydCBDbG9uZWRDb3N0SGVhZCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvQ2xvbmVkQ29zdEhlYWQnKTtcclxuaW1wb3J0IENsb25lZFdvcmtJdGVtID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9DbG9uZWRXb3JrSXRlbScpO1xyXG5pbXBvcnQgQ29zdEhlYWQgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL0Nvc3RIZWFkJyk7XHJcbmltcG9ydCBXb3JrSXRlbSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvV29ya0l0ZW0nKTtcclxuaW1wb3J0IEl0ZW0gPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL0l0ZW0nKTtcclxuaW1wb3J0IFJhdGVBbmFseXNpc1NlcnZpY2UgPSByZXF1aXJlKCcuL1JhdGVBbmFseXNpc1NlcnZpY2UnKTtcclxuaW1wb3J0IFF1YW50aXR5SXRlbSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvUXVhbnRpdHlJdGVtJyk7XHJcbmltcG9ydCBTdWJDYXRlZ29yeSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvU3ViQ2F0ZWdvcnknKTtcclxubGV0IGNvbmZpZyA9IHJlcXVpcmUoJ2NvbmZpZycpO1xyXG52YXIgbG9nNGpzID0gcmVxdWlyZSgnbG9nNGpzJyk7XHJcbmltcG9ydCBhbGFzcWwgPSByZXF1aXJlKCdhbGFzcWwnKTtcclxuaW1wb3J0IENsb25lZFN1YmNhdGVnb3J5ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9DbG9uZWRTdWJjYXRlZ29yeScpO1xyXG52YXIgbG9nZ2VyPWxvZzRqcy5nZXRMb2dnZXIoJ1Byb2plY3Qgc2VydmljZScpO1xyXG5cclxuY2xhc3MgUHJvamVjdFNlcnZpY2Uge1xyXG4gIEFQUF9OQU1FOiBzdHJpbmc7XHJcbiAgY29tcGFueV9uYW1lOiBzdHJpbmc7XHJcbiAgY29zdEhlYWRJZDogbnVtYmVyO1xyXG4gIHN1YkNhdGVnb3J5SWQ6IG51bWJlcjtcclxuICB3b3JrSXRlbUlkOiBudW1iZXI7XHJcbiAgcHJpdmF0ZSBwcm9qZWN0UmVwb3NpdG9yeTogUHJvamVjdFJlcG9zaXRvcnk7XHJcbiAgcHJpdmF0ZSBidWlsZGluZ1JlcG9zaXRvcnk6IEJ1aWxkaW5nUmVwb3NpdG9yeTtcclxuICBwcml2YXRlIGF1dGhJbnRlcmNlcHRvcjogQXV0aEludGVyY2VwdG9yO1xyXG4gIHByaXZhdGUgdXNlclNlcnZpY2UgOiBVc2VyU2VydmljZTtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLnByb2plY3RSZXBvc2l0b3J5ID0gbmV3IFByb2plY3RSZXBvc2l0b3J5KCk7XHJcbiAgICB0aGlzLmJ1aWxkaW5nUmVwb3NpdG9yeSA9IG5ldyBCdWlsZGluZ1JlcG9zaXRvcnkoKTtcclxuICAgIHRoaXMuQVBQX05BTUUgPSBQcm9qZWN0QXNzZXQuQVBQX05BTUU7XHJcbiAgICB0aGlzLmF1dGhJbnRlcmNlcHRvciA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcclxuICAgIHRoaXMudXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICB9XHJcblxyXG4gIGNyZWF0ZShkYXRhOiBhbnksIHVzZXIgOiBVc2VyLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBpZighdXNlci5faWQpIHtcclxuICAgICAgY2FsbGJhY2sobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbignVXNlcklkIE5vdCBGb3VuZCcsbnVsbCksIG51bGwpO1xyXG4gICAgfVxyXG4gICAgLypsZXQgY2F0ZWdvcnkgPSBkYXRhLmNhdGVnb3J5O1xyXG4gICAgZm9yKGxldCBpPTA7IGk8IGNhdGVnb3J5Lmxlbmd0aDsgaSsrKXtcclxuICAgICAgLy9jb25zb2xlLmxvZygnY2F0ZWdvcnkgJytpKycgOiAnK0pTT04uc3RyaW5naWZ5KGNhdGVnb3J5W2ldKSk7XHJcbiAgICAgIGxldCBpdGVtID0gY2F0ZWdvcnlbaV0uaXRlbTtcclxuICAgICAgZm9yKGxldCBqPTA7IGo8aXRlbS5sZW5ndGg7IGorKyl7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygnaXRlbSAnK2orJyA6ICcrSlNPTi5zdHJpbmdpZnkoaXRlbVtqXSkpO1xyXG4gICAgICAgIGxldCBpdGVtRGV0YWlscyA9IGl0ZW1bal07XHJcbiAgICAgICAgaXRlbURldGFpbHMuYW1vdW50ID0gaXRlbURldGFpbHMucXR5ICogaXRlbURldGFpbHMucmF0ZTtcclxuICAgICAgfVxyXG4gICAgfSovXHJcblxyXG4gICAgdGhpcy5wcm9qZWN0UmVwb3NpdG9yeS5jcmVhdGUoZGF0YSwgKGVyciwgcmVzKSA9PiB7XHJcbiAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGNyZWF0ZSBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgICBsb2dnZXIuZGVidWcoJ1Byb2plY3QgSUQgOiAnK3Jlcy5faWQpO1xyXG4gICAgICAgIGxvZ2dlci5kZWJ1ZygnUHJvamVjdCBOYW1lIDogJytyZXMuX2RvYy5uYW1lKTtcclxuICAgICAgICBsZXQgcHJvamVjdElkID0gcmVzLl9pZDtcclxuICAgICAgICBsZXQgbmV3RGF0YSA9ICB7JHB1c2g6IHsgcHJvamVjdDogcHJvamVjdElkIH19O1xyXG4gICAgICAgIGxldCBxdWVyeSA9IHtfaWQgOiB1c2VyLl9pZH07XHJcbiAgICAgICAgdGhpcy51c2VyU2VydmljZS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCBuZXdEYXRhLCB7bmV3IDp0cnVlfSwoZXJyLCByZXNwKSA9PiB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kT25lQW5kVXBkYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICAgICAgaWYoZXJyKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBkZWxldGUgcmVzLmNhdGVnb3J5O1xyXG4gICAgICAgICAgICBkZWxldGUgcmVzLnJhdGU7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJlcyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0UHJvamVjdCggcHJvamVjdElkIDogc3RyaW5nLCB1c2VyOiBVc2VyLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBsZXQgcXVlcnkgPSB7IF9pZDogcHJvamVjdElkfTtcclxuICAgIGxldCBwb3B1bGF0ZSA9IHtwYXRoIDogJ2J1aWxkaW5nJywgc2VsZWN0OiBbJ25hbWUnICwgJ3RvdGFsU2xhYkFyZWEnLF19O1xyXG4gICAgLy9sZXQgcG9wdWxhdGUgPSB7cGF0aCA6ICdidWlsZGluZyd9O1xyXG4gICAgdGhpcy5wcm9qZWN0UmVwb3NpdG9yeS5maW5kQW5kUG9wdWxhdGUocXVlcnksIHBvcHVsYXRlLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kQW5kUG9wdWxhdGUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGxvZ2dlci5kZWJ1ZygnUHJvamVjdCBOYW1lIDogJytyZXN1bHRbMF0uX2RvYy5uYW1lKTtcclxuICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCx7IGRhdGE6IHJlc3VsdCwgYWNjZXNzX3Rva2VuOiB0aGlzLmF1dGhJbnRlcmNlcHRvci5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKX0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZVByb2plY3REZXRhaWxzKCBwcm9qZWN0RGV0YWlsczogUHJvamVjdCwgdXNlcjogVXNlciwgY2FsbGJhY2s6KGVycm9yOiBhbnksIHJlc3VsdDphbnkpID0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIHVwZGF0ZVByb2plY3REZXRhaWxzIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgbGV0IHF1ZXJ5ID0geyBfaWQgOiBwcm9qZWN0RGV0YWlscy5faWQgfTtcclxuICAgIGRlbGV0ZSBwcm9qZWN0RGV0YWlscy5faWQ7XHJcblxyXG4gICAgdGhpcy5wcm9qZWN0UmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCBwcm9qZWN0RGV0YWlscywge25ldzogdHJ1ZX0sIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGZpbmRPbmVBbmRVcGRhdGUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTogcmVzdWx0LCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgYWRkQnVpbGRpbmcocHJvamVjdElkIDogc3RyaW5nLCBidWlsZGluZ0RldGFpbCA6IEJ1aWxkaW5nLCB1c2VyOiBVc2VyLCBjYWxsYmFjazooZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpPT4gdm9pZCkge1xyXG4gICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuY3JlYXRlKGJ1aWxkaW5nRGV0YWlsLCAoZXJyb3IsIHJlc3VsdCk9PiB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGNyZWF0ZSBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IHF1ZXJ5ID0ge19pZCA6IHByb2plY3RJZCB9O1xyXG4gICAgICAgIGxldCBuZXdEYXRhID0geyAkcHVzaDoge2J1aWxkaW5nIDogcmVzdWx0Ll9pZH19O1xyXG4gICAgICAgIHRoaXMucHJvamVjdFJlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgbmV3RGF0YSwge25ldyA6IHRydWV9LCAoZXJyb3IsIHN0YXR1cyk9PiB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kT25lQW5kVXBkYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGE6IHJlc3VsdCwgYWNjZXNzX3Rva2VuOiB0aGlzLmF1dGhJbnRlcmNlcHRvci5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKX0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZUJ1aWxkaW5nKCBidWlsZGluZ0lkOnN0cmluZywgYnVpbGRpbmdEZXRhaWw6YW55LCB1c2VyOlVzZXIsIGNhbGxiYWNrOihlcnJvcjogYW55LCByZXN1bHQ6IGFueSk9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCB1cGRhdGVCdWlsZGluZyBoYXMgYmVlbiBoaXQnKTtcclxuICAgIGxldCBxdWVyeSA9IHsgX2lkIDogYnVpbGRpbmdJZCB9O1xyXG4gICAgLy9kZWxldGUgYnVpbGRpbmdEZXRhaWwuX2lkO1xyXG4gICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgYnVpbGRpbmdEZXRhaWwse25ldzogdHJ1ZX0sIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGZpbmRPbmVBbmRVcGRhdGUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTogcmVzdWx0LCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgY2xvbmVCdWlsZGluZ0RldGFpbHMoIGJ1aWxkaW5nSWQ6c3RyaW5nLCBidWlsZGluZ0RldGFpbDphbnksIHVzZXI6VXNlciwgY2FsbGJhY2s6KGVycm9yOiBhbnksIHJlc3VsdDogYW55KT0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGNsb25lQnVpbGRpbmdEZXRhaWxzIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgbGV0IHF1ZXJ5ID0geyBfaWQgOiBidWlsZGluZ0lkIH07XHJcbiAgICAvL2RlbGV0ZSBidWlsZGluZ0RldGFpbC5faWQ7XHJcbiAgICB0aGlzLmJ1aWxkaW5nUmVwb3NpdG9yeS5maW5kQnlJZChidWlsZGluZ0lkLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kQnlJZCBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCBjbG9uZWRDb3N0SGVhZERldGFpbHMgOkFycmF5PENvc3RIZWFkPj1bXTtcclxuICAgICAgICBsZXQgY29zdEhlYWRzID1idWlsZGluZ0RldGFpbC5jb3N0SGVhZDtcclxuICAgICAgICBsZXQgcmVzdWx0Q29zdEhlYWRzID0gcmVzdWx0LmNvc3RIZWFkO1xyXG4gICAgICAgIGZvcihsZXQgY29zdEhlYWQgb2YgY29zdEhlYWRzKSB7XHJcbiAgICAgICAgICBmb3IobGV0IHJlc3VsdENvc3RIZWFkIG9mIHJlc3VsdENvc3RIZWFkcykge1xyXG4gICAgICAgICAgICBpZihjb3N0SGVhZC5uYW1lID09PSByZXN1bHRDb3N0SGVhZC5uYW1lKSB7XHJcbiAgICAgICAgICAgICAgbGV0IGNsb25lZENvc3RIZWFkID0gbmV3IENvc3RIZWFkO1xyXG4gICAgICAgICAgICAgIGNsb25lZENvc3RIZWFkLm5hbWUgPSByZXN1bHRDb3N0SGVhZC5uYW1lO1xyXG4gICAgICAgICAgICAgIGNsb25lZENvc3RIZWFkLnJhdGVBbmFseXNpc0lkID0gcmVzdWx0Q29zdEhlYWQucmF0ZUFuYWx5c2lzSWQ7XHJcbiAgICAgICAgICAgICAgY2xvbmVkQ29zdEhlYWQuYWN0aXZlID0gY29zdEhlYWQuYWN0aXZlO1xyXG4gICAgICAgICAgICAgIGNsb25lZENvc3RIZWFkLnRodW1iUnVsZVJhdGUgPSByZXN1bHRDb3N0SGVhZC50aHVtYlJ1bGVSYXRlO1xyXG5cclxuICAgICAgICAgICAgICBpZihjb3N0SGVhZC5hY3RpdmUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgc3ViY2F0ZWdvcnlMaXN0ID0gY29zdEhlYWQuc3ViQ2F0ZWdvcnk7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVzdWx0U3ViQ2F0ZWdvcnlMaXN0ID0gcmVzdWx0Q29zdEhlYWQuc3ViQ2F0ZWdvcnk7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yKGxldCByZXN1bHRTdWJjYXRlZ29yeUluZGV4PTA7IHJlc3VsdFN1YmNhdGVnb3J5SW5kZXg8cmVzdWx0U3ViQ2F0ZWdvcnlMaXN0Lmxlbmd0aDsgcmVzdWx0U3ViY2F0ZWdvcnlJbmRleCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgIGZvcihsZXQgc3ViY2F0ZWdvcnlJbmRleD0wIDsgc3ViY2F0ZWdvcnlJbmRleDxzdWJjYXRlZ29yeUxpc3QubGVuZ3RoOyBzdWJjYXRlZ29yeUluZGV4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZihzdWJjYXRlZ29yeUxpc3Rbc3ViY2F0ZWdvcnlJbmRleF0ubmFtZSA9PT0gcmVzdWx0U3ViQ2F0ZWdvcnlMaXN0W3Jlc3VsdFN1YmNhdGVnb3J5SW5kZXhdLm5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIGlmKCFzdWJjYXRlZ29yeUxpc3Rbc3ViY2F0ZWdvcnlJbmRleF0uYWN0aXZlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFN1YkNhdGVnb3J5TGlzdC5zcGxpY2UocmVzdWx0U3ViY2F0ZWdvcnlJbmRleCwxKTtcclxuICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXN1bHRXb3JraXRlbUxpc3QgPSByZXN1bHRTdWJDYXRlZ29yeUxpc3RbcmVzdWx0U3ViY2F0ZWdvcnlJbmRleF0ud29ya2l0ZW07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB3b3JrSXRlbUxpc3QgPSBzdWJjYXRlZ29yeUxpc3Rbc3ViY2F0ZWdvcnlJbmRleF0ud29ya2l0ZW07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IobGV0IHJlc3VsdFdvcmtpdGVtSW5kZXg9MDsgIHJlc3VsdFdvcmtpdGVtSW5kZXggPCByZXN1bHRXb3JraXRlbUxpc3QubGVuZ3RoOyByZXN1bHRXb3JraXRlbUluZGV4Kyspe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGZvcihsZXQgd29ya2l0ZW1JbmRleD0wOyAgd29ya2l0ZW1JbmRleCA8IHdvcmtJdGVtTGlzdC5sZW5ndGg7IHdvcmtpdGVtSW5kZXgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoIXdvcmtJdGVtTGlzdFt3b3JraXRlbUluZGV4XS5hY3RpdmUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0V29ya2l0ZW1MaXN0LnNwbGljZShyZXN1bHRXb3JraXRlbUluZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNsb25lZENvc3RIZWFkLnN1YkNhdGVnb3J5ID0gcmVzdWx0Q29zdEhlYWQuc3ViQ2F0ZWdvcnk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNsb25lZENvc3RIZWFkLnN1YkNhdGVnb3J5ID0gcmVzdWx0Q29zdEhlYWQuc3ViQ2F0ZWdvcnk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2xvbmVkQ29zdEhlYWREZXRhaWxzLnB1c2goY2xvbmVkQ29zdEhlYWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgdXBkYXRlQnVpbGRpbmdDb3N0SGVhZHMgPSB7J2Nvc3RIZWFkJyA6IGNsb25lZENvc3RIZWFkRGV0YWlsc307XHJcbiAgICAgICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgdXBkYXRlQnVpbGRpbmdDb3N0SGVhZHMse25ldzogdHJ1ZX0sIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kT25lQW5kVXBkYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiByZXN1bHQsIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRCdWlsZGluZyhwcm9qZWN0SWQgOiBzdHJpbmcsIGJ1aWxkaW5nSWQgOiBzdHJpbmcsIHVzZXI6IFVzZXIsIGNhbGxiYWNrOihlcnJvcjogYW55LCByZXN1bHQ6IGFueSk9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBnZXRCdWlsZGluZyBoYXMgYmVlbiBoaXQnKTtcclxuICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmZpbmRCeUlkKGJ1aWxkaW5nSWQsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGZpbmRCeUlkIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGE6IHJlc3VsdCwgYWNjZXNzX3Rva2VuOiB0aGlzLmF1dGhJbnRlcmNlcHRvci5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKX0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldEluQWN0aXZlQ29zdEhlYWQocHJvamVjdElkOiBzdHJpbmcsIGJ1aWxkaW5nSWQ6IHN0cmluZywgdXNlcjogVXNlciwgY2FsbGJhY2s6KGVycm9yOiBhbnksIHJlc3VsdDogYW55KT0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGdldEluQWN0aXZlQ29zdEhlYWQgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICB0aGlzLmJ1aWxkaW5nUmVwb3NpdG9yeS5maW5kQnlJZChidWlsZGluZ0lkLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZmluZEJ5SWQgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgICAgbG9nZ2VyLmRlYnVnKCdnZXR0aW5nIEluQWN0aXZlIENvc3RIZWFkIGZvciBCdWlsZGluZyBOYW1lIDogJytyZXN1bHQubmFtZSk7XHJcbiAgICAgICAgbGV0IHJlc3BvbnNlID0gcmVzdWx0LmNvc3RIZWFkO1xyXG4gICAgICAgIGxldCBpbmFjdGl2ZUNvc3RIZWFkPVtdO1xyXG4gICAgICAgIGZvcihsZXQgY29zdEhlYWRJdGVtIG9mIHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICBpZighY29zdEhlYWRJdGVtLmFjdGl2ZSkge1xyXG4gICAgICAgICAgICBpbmFjdGl2ZUNvc3RIZWFkLnB1c2goY29zdEhlYWRJdGVtKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCx7ZGF0YTppbmFjdGl2ZUNvc3RIZWFkLCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0Q2xvbmVkQnVpbGRpbmcocHJvamVjdElkIDogc3RyaW5nLCBidWlsZGluZ0lkIDogc3RyaW5nLCB1c2VyOiBVc2VyLCBjYWxsYmFjazooZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpPT4gdm9pZCkge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZ2V0Q2xvbmVkQnVpbGRpbmcgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICB0aGlzLmJ1aWxkaW5nUmVwb3NpdG9yeS5maW5kQnlJZChidWlsZGluZ0lkLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kQnlJZCBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCBjbG9uZWRCdWlsZGluZyA9IHJlc3VsdC5jb3N0SGVhZDtcclxuICAgICAgICBsZXQgYnVpbGRpbmcgPSBuZXcgQnVpbGRpbmdNb2RlbCgpO1xyXG4gICAgICAgIGJ1aWxkaW5nLm5hbWUgPSByZXN1bHQubmFtZTtcclxuICAgICAgICBidWlsZGluZy50b3RhbFNsYWJBcmVhID0gcmVzdWx0LnRvdGFsU2xhYkFyZWE7XHJcbiAgICAgICAgYnVpbGRpbmcudG90YWxDYXJwZXJBcmVhT2ZVbml0ID0gcmVzdWx0LnRvdGFsQ2FycGVyQXJlYU9mVW5pdDtcclxuICAgICAgICBidWlsZGluZy50b3RhbFNhbGVhYmxlQXJlYU9mVW5pdCA9IHJlc3VsdC50b3RhbFNhbGVhYmxlQXJlYU9mVW5pdDtcclxuICAgICAgICBidWlsZGluZy5wbGludGhBcmVhID0gcmVzdWx0LnBsaW50aEFyZWE7XHJcbiAgICAgICAgYnVpbGRpbmcudG90YWxOb09mRmxvb3JzID0gcmVzdWx0LnRvdGFsTm9PZkZsb29ycztcclxuICAgICAgICBidWlsZGluZy5ub09mUGFya2luZ0Zsb29ycyA9IHJlc3VsdC5ub09mUGFya2luZ0Zsb29ycztcclxuICAgICAgICBidWlsZGluZy5jYXJwZXRBcmVhT2ZQYXJraW5nID0gcmVzdWx0LmNhcnBldEFyZWFPZlBhcmtpbmc7XHJcbiAgICAgICAgYnVpbGRpbmcubm9PZk9uZUJISyA9IHJlc3VsdC5ub09mT25lQkhLO1xyXG4gICAgICAgIGJ1aWxkaW5nLm5vT2ZUd29CSEsgPSByZXN1bHQubm9PZlR3b0JISztcclxuICAgICAgICBidWlsZGluZy5ub09mVGhyZWVCSEsgPSByZXN1bHQubm9PZlRocmVlQkhLO1xyXG4gICAgICAgIGJ1aWxkaW5nLm5vT2ZGb3VyQkhLID0gcmVzdWx0Lm5vT2ZGb3VyQkhLO1xyXG4gICAgICAgIGJ1aWxkaW5nLm5vT2ZGaXZlQkhLID0gcmVzdWx0Lm5vT2ZGaXZlQkhLO1xyXG4gICAgICAgIGJ1aWxkaW5nLm5vT2ZMaWZ0ID0gcmVzdWx0Lm5vT2ZMaWZ0O1xyXG5cclxuICAgICAgICBsZXQgY2xvbmVkQ29zdEhlYWRBcnJheSA6IEFycmF5PENsb25lZENvc3RIZWFkPiA9IFtdO1xyXG5cclxuICAgICAgICBmb3IobGV0IGNvc3RIZWFkSW5kZXggPSAwOyBjb3N0SGVhZEluZGV4IDwgY2xvbmVkQnVpbGRpbmcubGVuZ3RoOyBjb3N0SGVhZEluZGV4KyspIHtcclxuXHJcbiAgICAgICAgICBsZXQgY2xvbmVkQ29zdEhlYWQgPSBuZXcgQ2xvbmVkQ29zdEhlYWQ7XHJcbiAgICAgICAgICBjbG9uZWRDb3N0SGVhZC5uYW1lID0gY2xvbmVkQnVpbGRpbmdbY29zdEhlYWRJbmRleF0ubmFtZTtcclxuICAgICAgICAgIGNsb25lZENvc3RIZWFkLnJhdGVBbmFseXNpc0lkID0gY2xvbmVkQnVpbGRpbmdbY29zdEhlYWRJbmRleF0ucmF0ZUFuYWx5c2lzSWQ7XHJcbiAgICAgICAgICBjbG9uZWRDb3N0SGVhZC5hY3RpdmUgPSBjbG9uZWRCdWlsZGluZ1tjb3N0SGVhZEluZGV4XS5hY3RpdmU7XHJcbiAgICAgICAgICBjbG9uZWRDb3N0SGVhZC5idWRnZXRlZENvc3RBbW91bnQgPSBjbG9uZWRCdWlsZGluZ1tjb3N0SGVhZEluZGV4XS5idWRnZXRlZENvc3RBbW91bnQ7XHJcblxyXG4gICAgICAgICAgbGV0IGNsb25lZFdvcmtJdGVtQXJyYXkgOiBBcnJheTxDbG9uZWRXb3JrSXRlbT4gPSBbXTtcclxuICAgICAgICAgIGxldCBjbG9uZWRTdWJjYXRlZ29yeUFycmF5IDogQXJyYXk8Q2xvbmVkU3ViY2F0ZWdvcnk+ID0gW107XHJcbiAgICAgICAgICBsZXQgc3ViQ2F0ZWdvcnlBcnJheSA9IGNsb25lZEJ1aWxkaW5nW2Nvc3RIZWFkSW5kZXhdLnN1YkNhdGVnb3J5O1xyXG5cclxuICAgICAgICAgIGZvcihsZXQgc3ViQ2F0ZWdvcnlJbmRleD0wOyBzdWJDYXRlZ29yeUluZGV4PHN1YkNhdGVnb3J5QXJyYXkubGVuZ3RoOyBzdWJDYXRlZ29yeUluZGV4KyspIHtcclxuICAgICAgICAgICAgbGV0IGNsb25lZFN1YmNhdGVnb3J5ID0gbmV3IENsb25lZFN1YmNhdGVnb3J5KCk7XHJcbiAgICAgICAgICAgIGNsb25lZFN1YmNhdGVnb3J5Lm5hbWUgPSBzdWJDYXRlZ29yeUFycmF5W3N1YkNhdGVnb3J5SW5kZXhdLm5hbWU7XHJcbiAgICAgICAgICAgIGNsb25lZFN1YmNhdGVnb3J5LnJhdGVBbmFseXNpc0lkID0gc3ViQ2F0ZWdvcnlBcnJheVtzdWJDYXRlZ29yeUluZGV4XS5yYXRlQW5hbHlzaXNJZDtcclxuICAgICAgICAgICAgY2xvbmVkU3ViY2F0ZWdvcnkuYW1vdW50ID0gc3ViQ2F0ZWdvcnlBcnJheVtzdWJDYXRlZ29yeUluZGV4XS5hbW91bnQ7XHJcbiAgICAgICAgICAgIGNsb25lZFN1YmNhdGVnb3J5LmFjdGl2ZSA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICBsZXQgd29ya2l0ZW1BcnJheSA9IHN1YkNhdGVnb3J5QXJyYXlbc3ViQ2F0ZWdvcnlJbmRleF0ud29ya2l0ZW07XHJcbiAgICAgICAgICAgIGZvcihsZXQgd29ya2l0ZW1JbmRleD0wOyB3b3JraXRlbUluZGV4PCB3b3JraXRlbUFycmF5Lmxlbmd0aDsgd29ya2l0ZW1JbmRleCsrKSB7XHJcbiAgICAgICAgICAgICAgbGV0IGNsb25lZFdvcmtJdGVtID0gbmV3IENsb25lZFdvcmtJdGVtKCk7XHJcbiAgICAgICAgICAgICAgY2xvbmVkV29ya0l0ZW0ubmFtZSA9IHdvcmtpdGVtQXJyYXlbd29ya2l0ZW1JbmRleF0ubmFtZTtcclxuICAgICAgICAgICAgICBjbG9uZWRXb3JrSXRlbS5yYXRlQW5hbHlzaXNJZCA9ICB3b3JraXRlbUFycmF5W3dvcmtpdGVtSW5kZXhdLnJhdGVBbmFseXNpc0lkO1xyXG4gICAgICAgICAgICAgIGNsb25lZFdvcmtJdGVtLnVuaXQgPSAgd29ya2l0ZW1BcnJheVt3b3JraXRlbUluZGV4XS51bml0O1xyXG4gICAgICAgICAgICAgIGNsb25lZFdvcmtJdGVtLmFtb3VudCA9IHdvcmtpdGVtQXJyYXlbd29ya2l0ZW1JbmRleF0uYW1vdW50O1xyXG4gICAgICAgICAgICAgIGNsb25lZFdvcmtJdGVtLnJhdGUgPSB3b3JraXRlbUFycmF5W3dvcmtpdGVtSW5kZXhdLnJhdGU7XHJcbiAgICAgICAgICAgICAgY2xvbmVkV29ya0l0ZW0ucXVhbnRpdHkgPSB3b3JraXRlbUFycmF5W3dvcmtpdGVtSW5kZXhdLnF1YW50aXR5O1xyXG4gICAgICAgICAgICAgIGNsb25lZFdvcmtJdGVtQXJyYXkucHVzaChjbG9uZWRXb3JrSXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2xvbmVkU3ViY2F0ZWdvcnkud29ya2l0ZW0gPSBjbG9uZWRXb3JrSXRlbUFycmF5O1xyXG4gICAgICAgICAgICBjbG9uZWRTdWJjYXRlZ29yeUFycmF5LnB1c2goY2xvbmVkU3ViY2F0ZWdvcnkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY2xvbmVkQ29zdEhlYWQuc3ViQ2F0ZWdvcnkgPSBjbG9uZWRTdWJjYXRlZ29yeUFycmF5O1xyXG4gICAgICAgICAgY2xvbmVkQ29zdEhlYWRBcnJheS5wdXNoKGNsb25lZENvc3RIZWFkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYnVpbGRpbmcuY29zdEhlYWQgPSBjbG9uZWRDb3N0SGVhZEFycmF5O1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiBidWlsZGluZywgYWNjZXNzX3Rva2VuOiB0aGlzLmF1dGhJbnRlcmNlcHRvci5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKX0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGRlbGV0ZUJ1aWxkaW5nKHByb2plY3RJZDpzdHJpbmcsIGJ1aWxkaW5nSWQ6c3RyaW5nLCB1c2VyOlVzZXIsIGNhbGxiYWNrOihlcnJvcjogYW55LCByZXN1bHQ6IGFueSk9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBkZWxldGVCdWlsZGluZyBoYXMgYmVlbiBoaXQnKTtcclxuICAgIGxldCBwb3BCdWlsZGluZ0lkID0gYnVpbGRpbmdJZDtcclxuICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmRlbGV0ZShidWlsZGluZ0lkLCAoZXJyb3IsIHJlc3VsdCk9PiB7XHJcbiAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCBxdWVyeSA9IHtfaWQ6IHByb2plY3RJZH07XHJcbiAgICAgICAgbGV0IG5ld0RhdGEgPSB7ICRwdWxsOiB7YnVpbGRpbmcgOiBwb3BCdWlsZGluZ0lkfX07XHJcbiAgICAgICAgdGhpcy5wcm9qZWN0UmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCBuZXdEYXRhLCB7bmV3OiB0cnVlfSwgKGVycm9yLCBzdGF0dXMpPT4ge1xyXG4gICAgICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZmluZE9uZUFuZFVwZGF0ZSBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiBzdGF0dXMsIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRRdWFudGl0eShwcm9qZWN0SWQ6c3RyaW5nLCBidWlsZGluZ0lkOnN0cmluZywgY29zdGhlYWQ6IENvc3RIZWFkLCB3b3JraXRlbSwgdXNlciwgY2FsbGJhY2s6KGVycm9yOiBhbnksIHJlc3VsdDogYW55KT0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGdldFF1YW50aXR5IGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZEJ5SWQoYnVpbGRpbmdJZCwgKGVycm9yLCBidWlsZGluZzpCdWlsZGluZykgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IHF1YW50aXR5OiBRdWFudGl0eTtcclxuICAgICAgICBmb3IobGV0IGluZGV4ID0gMDsgYnVpbGRpbmcuY29zdEhlYWQubGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIHtcclxuICAgICAgICAgaWYoYnVpbGRpbmcuY29zdEhlYWRbaW5kZXhdLm5hbWUgPT09IGNvc3RoZWFkKSB7XHJcbiAgICAgICAgICAgcXVhbnRpdHkgPSBidWlsZGluZy5jb3N0SGVhZFtpbmRleF0ud29ya2l0ZW1bd29ya2l0ZW1dLnF1YW50aXR5O1xyXG4gICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHF1YW50aXR5LnRvdGFsID09PSBudWxsKSB7XHJcbiAgICAgICAgICBmb3IobGV0IGluZGV4ID0gMDsgcXVhbnRpdHkuaXRlbS5sZW5ndGggPiBpbmRleDsgaW5kZXggKyspIHtcclxuICAgICAgICAgICAgcXVhbnRpdHkudG90YWwgPSBxdWFudGl0eS5pdGVtW2luZGV4XS5xdWFudGl0eSArIHF1YW50aXR5LnRvdGFsO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTogcXVhbnRpdHksIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRSYXRlKHByb2plY3RJZDpzdHJpbmcsIGJ1aWxkaW5nSWQ6c3RyaW5nLCBjb3N0aGVhZElkOm51bWJlcixzdWJjYXRlZ29yeUlkOm51bWJlciwgd29ya2l0ZW1JZDpudW1iZXIsIHVzZXIsXHJcbiAgICAgICAgICBjYWxsYmFjazooZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpPT4gdm9pZCkge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZ2V0UmF0ZSBoYXMgYmVlbiBoaXQnKTtcclxuXHJcbiAgICBsZXQgcmF0ZUFuYWx5c2lzU2VydmljZXM6IFJhdGVBbmFseXNpc1NlcnZpY2UgPSBuZXcgUmF0ZUFuYWx5c2lzU2VydmljZSgpO1xyXG4gICAgcmF0ZUFuYWx5c2lzU2VydmljZXMuZ2V0UmF0ZSh3b3JraXRlbUlkLCAoZXJyb3IsIHJhdGVEYXRhKSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgcmF0ZSA6UmF0ZSA9IG5ldyBSYXRlKClcclxuICAgICAgICByYXRlLml0ZW0gPSByYXRlRGF0YTtcclxuICAgICAgICAvKmZvciAobGV0IGluZGV4ID0gMDsgcmF0ZS5pdGVtLmxlbmd0aCA+IGluZGV4OyBpbmRleCsrKSB7XHJcbiAgICAgICAgICByYXRlLnRvdGFsID0gcmF0ZS5pdGVtW2luZGV4XS50b3RhbEFtb3VudCArIHJhdGUudG90YWw7XHJcbiAgICAgICAgfSovXHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGE6IHJhdGVEYXRhLCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlUmF0ZShwcm9qZWN0SWQ6c3RyaW5nLCBidWlsZGluZ0lkOnN0cmluZywgY29zdGhlYWRJZDpudW1iZXIsc3ViY2F0ZWdvcnlJZDpudW1iZXIsIHdvcmtpdGVtSWQ6bnVtYmVyLCByYXRlIDpSYXRlLCB1c2VyLCBjYWxsYmFjazooZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpPT4gdm9pZCkge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgdXBkYXRlUmF0ZSBoYXMgYmVlbiBoaXQnKTtcclxuICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmZpbmRCeUlkKGJ1aWxkaW5nSWQsIChlcnJvciwgYnVpbGRpbmc6QnVpbGRpbmcpID0+IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZmluZEJ5SWQgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvL2xldCByYXRlOiBSYXRlO1xyXG4gICAgICAgIGxldCByYXRlQW5hbHlzaXNJZDogbnVtYmVyO1xyXG4gICAgICAgIGZvcihsZXQgaW5kZXggPSAwOyBidWlsZGluZy5jb3N0SGVhZC5sZW5ndGggPiBpbmRleDsgaW5kZXgrKykge1xyXG4gICAgICAgICAgaWYoYnVpbGRpbmcuY29zdEhlYWRbaW5kZXhdLnJhdGVBbmFseXNpc0lkID09PSBjb3N0aGVhZElkKSB7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaW5kZXhTdWJjYXRlZ29yeSA9IDA7IGJ1aWxkaW5nLmNvc3RIZWFkW2luZGV4XS5zdWJDYXRlZ29yeS5sZW5ndGggPiBpbmRleFN1YmNhdGVnb3J5OyBpbmRleFN1YmNhdGVnb3J5KyspIHtcclxuICAgICAgICAgICAgICBpZiAoYnVpbGRpbmcuY29zdEhlYWRbaW5kZXhdLnN1YkNhdGVnb3J5W2luZGV4U3ViY2F0ZWdvcnldLnJhdGVBbmFseXNpc0lkID09PSBzdWJjYXRlZ29yeUlkKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IobGV0IGluZGV4V29ya2l0ZW0gPSAwOyBidWlsZGluZy5jb3N0SGVhZFtpbmRleF0uc3ViQ2F0ZWdvcnlbaW5kZXhTdWJjYXRlZ29yeV0ud29ya2l0ZW0ubGVuZ3RoID4gaW5kZXhXb3JraXRlbVxyXG4gICAgICAgICAgICAgICAgICA7IGluZGV4V29ya2l0ZW0rKykge1xyXG4gICAgICAgICAgICAgICAgICBpZiAoYnVpbGRpbmcuY29zdEhlYWRbaW5kZXhdLnN1YkNhdGVnb3J5W2luZGV4U3ViY2F0ZWdvcnldLndvcmtpdGVtW2luZGV4V29ya2l0ZW1dLnJhdGVBbmFseXNpc0lkID09PSB3b3JraXRlbUlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnVpbGRpbmcuY29zdEhlYWRbaW5kZXhdLnN1YkNhdGVnb3J5W2luZGV4U3ViY2F0ZWdvcnldLndvcmtpdGVtW2luZGV4V29ya2l0ZW1dLnJhdGU9cmF0ZTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcXVlcnkgPSB7J19pZCcgOiBidWlsZGluZ0lkfTtcclxuICAgICAgICBsZXQgbmV3RGF0YSA9IHsgJHNldCA6IHsnY29zdEhlYWQnIDogYnVpbGRpbmcuY29zdEhlYWR9fTtcclxuICAgICAgICB0aGlzLmJ1aWxkaW5nUmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCBuZXdEYXRhLHtuZXc6IHRydWV9LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiByYXRlLCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZGVsZXRlUXVhbnRpdHkocHJvamVjdElkOnN0cmluZywgYnVpbGRpbmdJZDpzdHJpbmcsIGNvc3RoZWFkSWQ6c3RyaW5nLCBzdWJjYXRlZ29yeUlkOnN0cmluZywgd29ya2l0ZW1JZDpzdHJpbmcsIHVzZXI6VXNlciwgaXRlbTpzdHJpbmcsIGNhbGxiYWNrOihlcnJvcjogYW55LCByZXN1bHQ6IGFueSk9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBkZWxldGVRdWFudGl0eSBoYXMgYmVlbiBoaXQnKTtcclxuICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmZpbmRCeUlkKGJ1aWxkaW5nSWQsIChlcnJvciwgYnVpbGRpbmc6QnVpbGRpbmcpID0+IHtcclxuICAgICAgaWYgKGVycm9yXHJcbiAgICAgICkge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgcXVhbnRpdHk6IFF1YW50aXR5O1xyXG4gICAgICAgICB0aGlzLmNvc3RIZWFkSWQgPSBwYXJzZUludChjb3N0aGVhZElkKTtcclxuICAgICAgICAgIHRoaXMuc3ViQ2F0ZWdvcnlJZCA9IHBhcnNlSW50KHN1YmNhdGVnb3J5SWQpO1xyXG4gICAgICAgICAgdGhpcy53b3JrSXRlbUlkID0gcGFyc2VJbnQod29ya2l0ZW1JZCk7XHJcbiAgICAgICAgICAgICAgZm9yKGxldCBpbmRleCA9IDA7IGJ1aWxkaW5nLmNvc3RIZWFkLmxlbmd0aCA+IGluZGV4OyBpbmRleCsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYnVpbGRpbmcuY29zdEhlYWRbaW5kZXhdLnJhdGVBbmFseXNpc0lkID09PSB0aGlzLmNvc3RIZWFkSWQpIHtcclxuICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaW5kZXgxID0gMDsgYnVpbGRpbmcuY29zdEhlYWRbaW5kZXhdLnN1YkNhdGVnb3J5Lmxlbmd0aCA+IGluZGV4MTsgaW5kZXgxKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYnVpbGRpbmcuY29zdEhlYWRbaW5kZXhdLnN1YkNhdGVnb3J5W2luZGV4MV0ucmF0ZUFuYWx5c2lzSWQgPT09IHRoaXMuc3ViQ2F0ZWdvcnlJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaW5kZXgyID0gMDsgYnVpbGRpbmcuY29zdEhlYWRbaW5kZXhdLnN1YkNhdGVnb3J5W2luZGV4MV0ud29ya2l0ZW0ubGVuZ3RoID4gaW5kZXgyOyBpbmRleDIrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYnVpbGRpbmcuY29zdEhlYWRbaW5kZXhdLnN1YkNhdGVnb3J5W2luZGV4MV0ud29ya2l0ZW1baW5kZXgyXS5yYXRlQW5hbHlzaXNJZCA9PT0gdGhpcy53b3JrSXRlbUlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcXVhbnRpdHkgPSBidWlsZGluZy5jb3N0SGVhZFtpbmRleF0uc3ViQ2F0ZWdvcnlbaW5kZXgxXS53b3JraXRlbVtpbmRleDJdLnF1YW50aXR5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgIGZvcihsZXQgaW5kZXggPSAwOyBxdWFudGl0eS5pdGVtLmxlbmd0aCA+IGluZGV4OyBpbmRleCArKykge1xyXG4gICAgICAgICAgaWYocXVhbnRpdHkuaXRlbVtpbmRleF0uaXRlbSAgPT09IGl0ZW0pIHtcclxuICAgICAgICAgICAgcXVhbnRpdHkuaXRlbS5zcGxpY2UoaW5kZXgsMSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBxdWVyeSA9IHsgX2lkIDogYnVpbGRpbmdJZCB9O1xyXG4gICAgICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIGJ1aWxkaW5nLHtuZXc6IHRydWV9LCAoZXJyb3IsIGJ1aWxkaW5nKSA9PiB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kT25lQW5kVXBkYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBxdWFudGl0eTogUXVhbnRpdHk7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaW5kZXggPSAwOyBidWlsZGluZy5jb3N0SGVhZC5sZW5ndGggPiBpbmRleDsgaW5kZXgrKykge1xyXG4gICAgICAgICAgICAgIGlmIChidWlsZGluZy5jb3N0SGVhZFtpbmRleF0ucmF0ZUFuYWx5c2lzSWQgPT09IHRoaXMuY29zdEhlYWRJZCkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaW5kZXgxID0gMDsgYnVpbGRpbmcuY29zdEhlYWRbaW5kZXhdLnN1YkNhdGVnb3J5Lmxlbmd0aCA+IGluZGV4MTsgaW5kZXgxKyspIHtcclxuICAgICAgICAgICAgICAgICAgaWYgKGJ1aWxkaW5nLmNvc3RIZWFkW2luZGV4XS5zdWJDYXRlZ29yeVtpbmRleDFdLnJhdGVBbmFseXNpc0lkID09PSB0aGlzLnN1YkNhdGVnb3J5SWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpbmRleDIgPSAwOyBidWlsZGluZy5jb3N0SGVhZFtpbmRleF0uc3ViQ2F0ZWdvcnlbaW5kZXgxXS53b3JraXRlbS5sZW5ndGggPiBpbmRleDI7IGluZGV4MisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBpZiAoYnVpbGRpbmcuY29zdEhlYWRbaW5kZXhdLnN1YkNhdGVnb3J5W2luZGV4MV0ud29ya2l0ZW1baW5kZXgyXS5yYXRlQW5hbHlzaXNJZCA9PT0gdGhpcy53b3JrSXRlbUlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5ID0gYnVpbGRpbmcuY29zdEhlYWRbaW5kZXhdLnN1YkNhdGVnb3J5W2luZGV4MV0ud29ya2l0ZW1baW5kZXgyXS5xdWFudGl0eTtcclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYocXVhbnRpdHkudG90YWwgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICBmb3IobGV0IGluZGV4ID0gMDsgcXVhbnRpdHkuaXRlbS5sZW5ndGggPiBpbmRleDsgaW5kZXggKyspIHtcclxuICAgICAgICAgICAgICAgIHF1YW50aXR5LnRvdGFsID0gcXVhbnRpdHkuaXRlbVtpbmRleF0ucXVhbnRpdHkgKyBxdWFudGl0eS50b3RhbDtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGE6IHF1YW50aXR5LCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuICBkZWxldGVXb3JraXRlbShwcm9qZWN0SWQ6c3RyaW5nLCBidWlsZGluZ0lkOnN0cmluZywgY29zdGhlYWRJZDpudW1iZXIsIHN1YmNhdGVnb3J5SWQ6bnVtYmVyLCB3b3JraXRlbUlkOm51bWJlciwgdXNlcjpVc2VyLFxyXG4gICAgICAgICAgICAgICAgIGNhbGxiYWNrOihlcnJvcjogYW55LCByZXN1bHQ6IGFueSk9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBkZWxldGUgV29ya2l0ZW0gaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICB0aGlzLmJ1aWxkaW5nUmVwb3NpdG9yeS5maW5kQnlJZChidWlsZGluZ0lkLCAoZXJyb3IsIGJ1aWxkaW5nOkJ1aWxkaW5nKSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgY29zdEhlYWRMaXN0ID0gYnVpbGRpbmcuY29zdEhlYWQ7XHJcbiAgICAgICAgbGV0IHN1YkNhdGVnb3J5TGlzdDogU3ViQ2F0ZWdvcnlbXTtcclxuICAgICAgICBsZXQgV29ya0l0ZW1MaXN0OiBXb3JrSXRlbVtdO1xyXG4gICAgICAgIHZhciBmbGFnID0gMDtcclxuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgY29zdEhlYWRMaXN0Lmxlbmd0aDsgaW5kZXgrKykge1xyXG4gICAgICAgICAgaWYgKGNvc3RoZWFkSWQgPT09IGNvc3RIZWFkTGlzdFtpbmRleF0ucmF0ZUFuYWx5c2lzSWQpIHtcclxuICAgICAgICAgICAgc3ViQ2F0ZWdvcnlMaXN0ID0gY29zdEhlYWRMaXN0W2luZGV4XS5zdWJDYXRlZ29yeTtcclxuICAgICAgICAgICAgZm9yIChsZXQgc3ViY2F0ZWdvcnlJbmRleCA9IDA7IHN1YmNhdGVnb3J5SW5kZXggPCBzdWJDYXRlZ29yeUxpc3QubGVuZ3RoOyBzdWJjYXRlZ29yeUluZGV4KyspIHtcclxuICAgICAgICAgICAgICBpZiAoc3ViY2F0ZWdvcnlJZCA9PT0gc3ViQ2F0ZWdvcnlMaXN0W3N1YmNhdGVnb3J5SW5kZXhdLnJhdGVBbmFseXNpc0lkKSB7XHJcbiAgICAgICAgICAgICAgICBXb3JrSXRlbUxpc3QgPSBzdWJDYXRlZ29yeUxpc3Rbc3ViY2F0ZWdvcnlJbmRleF0ud29ya2l0ZW07XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB3b3JraXRlbUluZGV4ID0gMDsgd29ya2l0ZW1JbmRleCA8IFdvcmtJdGVtTGlzdC5sZW5ndGg7IHdvcmtpdGVtSW5kZXgrKykge1xyXG4gICAgICAgICAgICAgICAgICBpZiAod29ya2l0ZW1JZCA9PT0gV29ya0l0ZW1MaXN0W3dvcmtpdGVtSW5kZXhdLnJhdGVBbmFseXNpc0lkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmxhZyA9IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgV29ya0l0ZW1MaXN0LnNwbGljZSh3b3JraXRlbUluZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGZsYWcgPT09IDEpIHtcclxuICAgICAgICAgIGxldCBxdWVyeSA9IHtfaWQ6IGJ1aWxkaW5nSWR9O1xyXG4gICAgICAgICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgYnVpbGRpbmcsIHtuZXc6IHRydWV9LCAoZXJyb3IsIFdvcmtJdGVtTGlzdCkgPT4ge1xyXG4gICAgICAgICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kT25lQW5kVXBkYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgbGV0IG1lc3NhZ2UgPSAnV29ya0l0ZW0gZGVsZXRlZC4nO1xyXG4gICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiBXb3JrSXRlbUxpc3QsIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0UmVwb3J0Q29zdEhlYWREZXRhaWxzKCBidWlsZGluZ0lkIDogc3RyaW5nLCBjb3N0SGVhZCA6IHN0cmluZywgdXNlcjogVXNlcixjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0aGlzLmJ1aWxkaW5nUmVwb3NpdG9yeS5maW5kQnlJZChidWlsZGluZ0lkLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kQnlJZCBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICBsZXQgcmVzcG9uc2UgPSByZXN1bHQuY29zdEhlYWQ7XHJcbiAgICAgICAgbGV0IGNvc3RIZWFkSXRlbTtcclxuICAgICAgICBmb3IobGV0IGNvc3RIZWFkSXRlbXMgb2YgcmVzcG9uc2UpIHtcclxuICAgICAgICAgIGlmKGNvc3RIZWFkSXRlbXMubmFtZSA9PT0gY29zdEhlYWQpIHtcclxuICAgICAgICAgICAgY29zdEhlYWRJdGVtID0gY29zdEhlYWRJdGVtcy53b3JraXRlbTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGE6IGNvc3RIZWFkSXRlbSwgYWNjZXNzX3Rva2VuOiB0aGlzLmF1dGhJbnRlcmNlcHRvci5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKX0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZUJ1aWxkaW5nQ29zdEhlYWRTdGF0dXMoIGJ1aWxkaW5nSWQgOiBzdHJpbmcsIGNvc3RIZWFkSWQgOiBudW1iZXIsIGNvc3RIZWFkQWN0aXZlU3RhdHVzIDogc3RyaW5nLCB1c2VyOiBVc2VyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxldCBxdWVyeSA9IHsnX2lkJyA6IGJ1aWxkaW5nSWQsICdjb3N0SGVhZC5yYXRlQW5hbHlzaXNJZCcgOiBjb3N0SGVhZElkfTtcclxuICAgIGxldCBhY3RpdmVTdGF0dXMgPSBKU09OLnBhcnNlKGNvc3RIZWFkQWN0aXZlU3RhdHVzKTtcclxuICAgIGxldCBuZXdEYXRhID0geyAkc2V0IDogeydjb3N0SGVhZC4kLmFjdGl2ZScgOiBhY3RpdmVTdGF0dXN9fTtcclxuICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIG5ld0RhdGEsIHtuZXc6IHRydWV9LChlcnIsIHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGZpbmRPbmVBbmRVcGRhdGUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGlmKGVycikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGE6IHJlc3BvbnNlLCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlQnVkZ2V0ZWRDb3N0Rm9yQ29zdEhlYWQoIGJ1aWxkaW5nSWQgOiBzdHJpbmcsIGNvc3RIZWFkQnVkZ2V0ZWRBbW91bnQgOiBhbnksIHVzZXI6IFVzZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIHVwZGF0ZUJ1ZGdldGVkQ29zdEZvckNvc3RIZWFkIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgbGV0IHF1ZXJ5ID0geydfaWQnIDogYnVpbGRpbmdJZCwgJ2Nvc3RIZWFkLm5hbWUnIDogY29zdEhlYWRCdWRnZXRlZEFtb3VudC5jb3N0SGVhZH07XHJcbiAgICBsZXQgY29zdEluVW5pdCA9IGNvc3RIZWFkQnVkZ2V0ZWRBbW91bnQuY29zdEluO1xyXG4gICAgbGV0IGNvc3RQZXJVbml0ID0gY29zdEhlYWRCdWRnZXRlZEFtb3VudC5jb3N0UGVyO1xyXG4gICAgbGV0IHJhdGUgPSAwO1xyXG4gICAgbGV0IG5ld0RhdGE7XHJcbiAgICByYXRlID0gY29zdEhlYWRCdWRnZXRlZEFtb3VudC5idWRnZXRlZENvc3RBbW91bnQgLyBjb3N0SGVhZEJ1ZGdldGVkQW1vdW50LmJ1aWxkaW5nQXJlYTtcclxuXHJcbiAgICBpZihjb3N0UGVyVW5pdCA9PT0gJ3NhbGVhYmxlQXJlYScgJiYgY29zdEluVW5pdCA9PT0gJ3NxZnQnKSB7XHJcbiAgICAgIG5ld0RhdGEgPSB7ICRzZXQgOiB7XHJcbiAgICAgICAgJ2Nvc3RIZWFkLiQudGh1bWJSdWxlUmF0ZS5zYWxlYWJsZUFyZWEuc3FmdCcgOiByYXRlLFxyXG4gICAgICAgICdjb3N0SGVhZC4kLnRodW1iUnVsZVJhdGUuc2FsZWFibGVBcmVhLnNxbXQnIDogcmF0ZSAvIGNvbmZpZy5nZXQoJ1NxdXJlTWV0ZXInKVxyXG4gICAgICB9IH07XHJcbiAgICB9IGVsc2UgaWYoY29zdFBlclVuaXQgPT09ICdzYWxlYWJsZUFyZWEnICYmIGNvc3RJblVuaXQgPT09ICdzcW10Jykge1xyXG4gICAgICBuZXdEYXRhID0geyAkc2V0IDoge1xyXG4gICAgICAgICdjb3N0SGVhZC4kLnRodW1iUnVsZVJhdGUuc2FsZWFibGVBcmVhLnNxbXQnIDogcmF0ZSxcclxuICAgICAgICAnY29zdEhlYWQuJC50aHVtYlJ1bGVSYXRlLnNhbGVhYmxlQXJlYS5zcWZ0JyA6IHJhdGUgKiBjb25maWcuZ2V0KCdTcXVyZU1ldGVyJylcclxuICAgICAgfSB9O1xyXG4gICAgfSBlbHNlIGlmKGNvc3RQZXJVbml0ID09PSAnc2xhYkFyZWEnICYmIGNvc3RJblVuaXQgPT09ICdzcWZ0Jykge1xyXG4gICAgICBuZXdEYXRhID0geyAkc2V0IDoge1xyXG4gICAgICAgICdjb3N0SGVhZC4kLnRodW1iUnVsZVJhdGUuc2xhYkFyZWEuc3FmdCcgOiByYXRlLFxyXG4gICAgICAgICdjb3N0SGVhZC4kLnRodW1iUnVsZVJhdGUuc2xhYkFyZWEuc3FtdCcgOiByYXRlIC8gY29uZmlnLmdldCgnU3F1cmVNZXRlcicpXHJcbiAgICAgIH0gfTtcclxuICAgIH0gZWxzZSBpZihjb3N0UGVyVW5pdCA9PT0gJ3NsYWJBcmVhJyAmJiBjb3N0SW5Vbml0ID09PSAnc3FtdCcpIHtcclxuICAgICAgbmV3RGF0YSA9IHsgJHNldCA6IHtcclxuICAgICAgICAnY29zdEhlYWQuJC50aHVtYlJ1bGVSYXRlLnNsYWJBcmVhLnNxbXQnIDogcmF0ZSxcclxuICAgICAgICAnY29zdEhlYWQuJC50aHVtYlJ1bGVSYXRlLnNsYWJBcmVhLnNxZnQnIDogcmF0ZSAqIGNvbmZpZy5nZXQoJ1NxdXJlTWV0ZXInKVxyXG4gICAgICB9IH07XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgbmV3RGF0YSwge25ldzp0cnVlfSwoZXJyLCByZXNwb25zZSkgPT4ge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kT25lQW5kVXBkYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBpZihlcnIpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiByZXNwb25zZSwgYWNjZXNzX3Rva2VuOiB0aGlzLmF1dGhJbnRlcmNlcHRvci5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKX0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGNyZWF0ZVF1YW50aXR5KHByb2plY3RJZCA6IHN0cmluZywgYnVpbGRpbmdJZCA6IHN0cmluZywgY29zdGhlYWQgOiBzdHJpbmcsIHdvcmtpdGVtIDogYW55LCBxdWFudGl0eSA6YW55LCB1c2VyIDogVXNlcixcclxuICAgICAgICAgICAgICAgICBjYWxsYmFjazooZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpPT4gdm9pZCkge1xyXG4gICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZEJ5SWQoYnVpbGRpbmdJZCwgKGVycm9yLCBidWlsZGluZzpCdWlsZGluZykgPT4ge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kQnlJZCBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGZvcihsZXQgaW5kZXggPSAwOyBidWlsZGluZy5jb3N0SGVhZC5sZW5ndGggPiBpbmRleDsgaW5kZXgrKykge1xyXG4gICAgICAgICAgaWYoYnVpbGRpbmcuY29zdEhlYWRbaW5kZXhdLm5hbWUgPT09IGNvc3RoZWFkKSB7XHJcbiAgICAgICAgICAgIGxldCBxdWFudGl0eUFycmF5IDpRdWFudGl0eSA9IGJ1aWxkaW5nLmNvc3RIZWFkW2luZGV4XS53b3JraXRlbVt3b3JraXRlbV0ucXVhbnRpdHkuaXRlbTtcclxuICAgICAgICAgICAgbGV0IGV4aXN0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGxldCBlcnJvck1lc3NhZ2UgO1xyXG4gICAgICAgICAgICBmb3IobGV0IHF1YW50aXR5SW5kZXggPSAwOyBxdWFudGl0eUFycmF5Lmxlbmd0aCA+IHF1YW50aXR5SW5kZXg7IHF1YW50aXR5SW5kZXgrKyApIHtcclxuICAgICAgICAgICAgICBpZihxdWFudGl0eUFycmF5W3F1YW50aXR5SW5kZXhdLml0ZW0gPT09IHF1YW50aXR5Lml0ZW0gKSB7XHJcbiAgICAgICAgICAgICAgICBleGlzdCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2UgPSAnUXVhbnRpdHkgbmFtZSBhbHJlYWR5IGV4aXN0LiAnO1xyXG4gICAgICAgICAgICAgICAgaWYocXVhbnRpdHlBcnJheVtxdWFudGl0eUluZGV4XS5yZW1hcmtzID09PSBxdWFudGl0eS5yZW1hcmtzICkge1xyXG4gICAgICAgICAgICAgICAgICBleGlzdCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZSA9IGVycm9yTWVzc2FnZSArICdzYW1lIHJlbWFya3MgaXMgYWxzbyBleGlzdCB3aXRoIHF1YW50aXR5IG5hbWUuJztcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIGV4aXN0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKGV4aXN0KSB7XHJcbiAgICAgICAgICAgICAgY2FsbGJhY2sobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlcnJvck1lc3NhZ2UsIGVycm9yTWVzc2FnZSksIG51bGwpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHF1YW50aXR5QXJyYXkucHVzaChxdWFudGl0eSk7XHJcbiAgICAgICAgICAgICAgbGV0IHF1ZXJ5ID0geyBfaWQgOiBidWlsZGluZ0lkIH07XHJcbiAgICAgICAgICAgICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgYnVpbGRpbmcse25ldzogdHJ1ZX0sIChlcnJvciwgYnVpbGRpbmcpID0+IHtcclxuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGZpbmRPbmVBbmRVcGRhdGUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgbGV0IHF1YW50aXR5OiBRdWFudGl0eTtcclxuICAgICAgICAgICAgICAgICAgZm9yKGxldCBpbmRleCA9IDA7IGJ1aWxkaW5nLmNvc3RIZWFkLmxlbmd0aCA+IGluZGV4OyBpbmRleCsrKXtcclxuICAgICAgICAgICAgICAgICAgICBpZihidWlsZGluZy5jb3N0SGVhZFtpbmRleF0ubmFtZSA9PT0gY29zdGhlYWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5ID0gYnVpbGRpbmcuY29zdEhlYWRbaW5kZXhdLndvcmtpdGVtW3dvcmtpdGVtXS5xdWFudGl0eTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgaWYocXVhbnRpdHkudG90YWwgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IobGV0IGluZGV4ID0gMDsgcXVhbnRpdHkuaXRlbS5sZW5ndGggPiBpbmRleDsgaW5kZXggKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5LnRvdGFsID0gcXVhbnRpdHkuaXRlbVtpbmRleF0ucXVhbnRpdHkgKyBxdWFudGl0eS50b3RhbDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGE6IHF1YW50aXR5LCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlUXVhbnRpdHkocHJvamVjdElkOnN0cmluZywgYnVpbGRpbmdJZDpzdHJpbmcsIGNvc3RoZWFkSWQ6c3RyaW5nLCBzdWJjYXRlZ29yeUlkOnN0cmluZywgd29ya2l0ZW1JZDpzdHJpbmcsIHF1YW50aXR5OmFueSwgdXNlcjpVc2VyLCBjYWxsYmFjazooZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpPT4gdm9pZCkge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgdXBkYXRlUXVhbnRpdHkgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICB0aGlzLmJ1aWxkaW5nUmVwb3NpdG9yeS5maW5kQnlJZChidWlsZGluZ0lkLCAoZXJyb3IsIGJ1aWxkaW5nKSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgY29zdEhlYWRMaXN0ID0gYnVpbGRpbmcuY29zdEhlYWQ7XHJcbiAgICAgICAgbGV0IHF1YW50aXR5QXJyYXkgIDogUXVhbnRpdHk7XHJcbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGNvc3RIZWFkTGlzdC5sZW5ndGg7IGluZGV4KyspIHtcclxuICAgICAgICAgIGlmIChwYXJzZUludChjb3N0aGVhZElkKSA9PT0gY29zdEhlYWRMaXN0W2luZGV4XS5yYXRlQW5hbHlzaXNJZCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpbmRleDEgPSAwOyBpbmRleDEgPCBjb3N0SGVhZExpc3RbaW5kZXhdLnN1YkNhdGVnb3J5Lmxlbmd0aDsgaW5kZXgxKyspIHtcclxuICAgICAgICAgICAgICBpZiAocGFyc2VJbnQoc3ViY2F0ZWdvcnlJZCkgPT09IGNvc3RIZWFkTGlzdFtpbmRleF0uc3ViQ2F0ZWdvcnlbaW5kZXgxXS5yYXRlQW5hbHlzaXNJZCkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaW5kZXgyID0gMDsgaW5kZXgyIDwgY29zdEhlYWRMaXN0W2luZGV4XS5zdWJDYXRlZ29yeVtpbmRleDFdLndvcmtpdGVtLmxlbmd0aDsgaW5kZXgyKyspIHtcclxuICAgICAgICAgICAgICAgICAgaWYgKHBhcnNlSW50KHdvcmtpdGVtSWQpID09PSBjb3N0SGVhZExpc3RbaW5kZXhdLnN1YkNhdGVnb3J5W2luZGV4MV0ud29ya2l0ZW1baW5kZXgyXS5yYXRlQW5hbHlzaXNJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHF1YW50aXR5QXJyYXkgID0gY29zdEhlYWRMaXN0W2luZGV4XS5zdWJDYXRlZ29yeVtpbmRleDFdLndvcmtpdGVtW2luZGV4Ml0ucXVhbnRpdHk7XHJcbiAgICAgICAgICAgICAgICAgICAgcXVhbnRpdHlBcnJheS5pdGVtID0gcXVhbnRpdHk7XHJcbiAgICAgICAgICAgICAgICAgICAgcXVhbnRpdHlBcnJheS50b3RhbCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaXRlbUluZGV4ID0gMDsgcXVhbnRpdHlBcnJheS5pdGVtLmxlbmd0aCA+IGl0ZW1JbmRleDsgaXRlbUluZGV4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5QXJyYXkudG90YWwgPSBxdWFudGl0eUFycmF5Lml0ZW1baXRlbUluZGV4XS5xdWFudGl0eSArIHF1YW50aXR5QXJyYXkudG90YWw7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGxldCBxdWVyeSA9IHtfaWQ6IGJ1aWxkaW5nSWR9O1xyXG4gICAgICAgICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgYnVpbGRpbmcsIHtuZXc6IHRydWV9LCAoZXJyb3IsIGJ1aWxkaW5nKSA9PiB7XHJcbiAgICAgICAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGZpbmRPbmVBbmRVcGRhdGUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBsZXQgY29zdEhlYWRMaXN0ID0gYnVpbGRpbmcuY29zdEhlYWQ7XHJcbiAgICAgICAgICAgICAgbGV0IHF1YW50aXR5ICA6IFF1YW50aXR5O1xyXG4gICAgICAgICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBjb3N0SGVhZExpc3QubGVuZ3RoOyBpbmRleCsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocGFyc2VJbnQoY29zdGhlYWRJZCkgPT09IGNvc3RIZWFkTGlzdFtpbmRleF0ucmF0ZUFuYWx5c2lzSWQpIHtcclxuICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaW5kZXgxID0gMDsgaW5kZXgxIDwgY29zdEhlYWRMaXN0W2luZGV4XS5zdWJDYXRlZ29yeS5sZW5ndGg7IGluZGV4MSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnNlSW50KHN1YmNhdGVnb3J5SWQpID09PSBjb3N0SGVhZExpc3RbaW5kZXhdLnN1YkNhdGVnb3J5W2luZGV4MV0ucmF0ZUFuYWx5c2lzSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGluZGV4MiA9IDA7IGluZGV4MiA8IGNvc3RIZWFkTGlzdFtpbmRleF0uc3ViQ2F0ZWdvcnlbaW5kZXgxXS53b3JraXRlbS5sZW5ndGg7IGluZGV4MisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJzZUludCh3b3JraXRlbUlkKSA9PT0gY29zdEhlYWRMaXN0W2luZGV4XS5zdWJDYXRlZ29yeVtpbmRleDFdLndvcmtpdGVtW2luZGV4Ml0ucmF0ZUFuYWx5c2lzSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBxdWFudGl0eSAgPSBjb3N0SGVhZExpc3RbaW5kZXhdLnN1YkNhdGVnb3J5W2luZGV4MV0ud29ya2l0ZW1baW5kZXgyXS5xdWFudGl0eTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBpZiAocXVhbnRpdHkudG90YWwgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBxdWFudGl0eS5pdGVtLmxlbmd0aDsgaW5kZXgrKykge1xyXG4gICAgICAgICAgICAgICAgICBxdWFudGl0eS50b3RhbCA9IHF1YW50aXR5Lml0ZW1baW5kZXhdLnF1YW50aXR5ICsgcXVhbnRpdHkudG90YWw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiBxdWFudGl0eSwgYWNjZXNzX3Rva2VuOiB0aGlzLmF1dGhJbnRlcmNlcHRvci5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKX0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldEFsbFN1YmNhdGVnb3JpZXNCeUNvc3RIZWFkSWQocHJvamVjdElkOnN0cmluZywgYnVpbGRpbmdJZDpzdHJpbmcsIGNvc3RoZWFkSWQ6c3RyaW5nLCB1c2VyOlVzZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazooZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpPT4gdm9pZCkge1xyXG4gICAgbGV0IHJhdGVBbmFseXNpc1NlcnZpY2VzIDogUmF0ZUFuYWx5c2lzU2VydmljZSA9IG5ldyBSYXRlQW5hbHlzaXNTZXJ2aWNlKCk7XHJcbiAgICBsZXQgdXJsID0gY29uZmlnLmdldCgncmF0ZUFuYWx5c2lzQVBJLnN1YkNhdGVnb3JpZXMnKTtcclxuICAgIHJhdGVBbmFseXNpc1NlcnZpY2VzLmdldEFwaUNhbGwodXJsLCAoZXJyb3IsIHN1YkNhdGVnb3JpZXMpPT4ge1xyXG4gICAgICBpZihlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgY29zdEhlYWQgPSBwYXJzZUludChjb3N0aGVhZElkKTtcclxuICAgICAgICBsZXQgc3ViQ2F0ZWdvcmllc0xpc3QgID0gIHN1YkNhdGVnb3JpZXMuU3ViSXRlbVR5cGU7XHJcbiAgICAgICAgbGV0IHNxbFF1ZXJ5ID0gJ1NFTEVDVCBzdWJDYXRlZ29yaWVzTGlzdC5DMSBBUyByYXRlQW5hbHlzaXNJZCwgc3ViQ2F0ZWdvcmllc0xpc3QuQzIgQVMgc3ViQ2F0ZWdvcnkgJyArXHJcbiAgICAgICAgICAnRlJPTSA/IEFTIHN1YkNhdGVnb3JpZXNMaXN0IFdIRVJFIHN1YkNhdGVnb3JpZXNMaXN0LkMzID0gJysgY29zdEhlYWQ7XHJcbiAgICAgICAgc3ViQ2F0ZWdvcmllc0xpc3QgPSBhbGFzcWwoc3FsUXVlcnksIFtzdWJDYXRlZ29yaWVzTGlzdF0pO1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiBzdWJDYXRlZ29yaWVzTGlzdCwgYWNjZXNzX3Rva2VuOiB0aGlzLmF1dGhJbnRlcmNlcHRvci5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKX0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldFdvcmtpdGVtTGlzdChwcm9qZWN0SWQ6c3RyaW5nLCBidWlsZGluZ0lkOnN0cmluZywgY29zdGhlYWRJZDpudW1iZXIsIHN1YkNhdGVnb3J5SWQ6bnVtYmVyLCB1c2VyOlVzZXIsXHJcbiAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOihlcnJvcjogYW55LCByZXN1bHQ6IGFueSk9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBnZXRXb3JraXRlbUxpc3QgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICBsZXQgcmF0ZUFuYWx5c2lzU2VydmljZXMgOiBSYXRlQW5hbHlzaXNTZXJ2aWNlID0gbmV3IFJhdGVBbmFseXNpc1NlcnZpY2UoKTtcclxuICAgIHJhdGVBbmFseXNpc1NlcnZpY2VzLmdldFdvcmtpdGVtTGlzdChjb3N0aGVhZElkLCBzdWJDYXRlZ29yeUlkLCAoZXJyb3IsIHdvcmtpdGVtTGlzdCk9PiB7XHJcbiAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9ZWxzZSB7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGE6IHdvcmtpdGVtTGlzdCwgYWNjZXNzX3Rva2VuOiB0aGlzLmF1dGhJbnRlcmNlcHRvci5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKX0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGFkZFdvcmtpdGVtKHByb2plY3RJZDpzdHJpbmcsIGJ1aWxkaW5nSWQ6c3RyaW5nLCBjb3N0aGVhZElkOm51bWJlciwgc3ViQ2F0ZWdvcnlJZDpudW1iZXIsIHdvcmtpdGVtOiBXb3JrSXRlbSxcclxuICAgICAgICAgICAgICB1c2VyOlVzZXIsIGNhbGxiYWNrOihlcnJvcjogYW55LCByZXN1bHQ6IGFueSk9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBhZGRXb3JraXRlbSBoYXMgYmVlbiBoaXQnKTtcclxuICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmZpbmRCeUlkKGJ1aWxkaW5nSWQsIChlcnJvciwgYnVpbGRpbmc6QnVpbGRpbmcpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCByZXNwb25zZVdvcmtpdGVtIDogQXJyYXk8V29ya0l0ZW0+PSBudWxsO1xyXG4gICAgICAgIGZvcihsZXQgaW5kZXggPSAwOyBidWlsZGluZy5jb3N0SGVhZC5sZW5ndGggPiBpbmRleDsgaW5kZXgrKykge1xyXG4gICAgICAgICAgaWYoYnVpbGRpbmcuY29zdEhlYWRbaW5kZXhdLnJhdGVBbmFseXNpc0lkID09PSBjb3N0aGVhZElkKSB7XHJcbiAgICAgICAgICAgIGxldCBzdWJDYXRlZ29yeSA9IGJ1aWxkaW5nLmNvc3RIZWFkW2luZGV4XS5zdWJDYXRlZ29yeTtcclxuICAgICAgICAgICAgZm9yKGxldCBzdWJDYXRlZ29yeUluZGV4ID0gMDsgc3ViQ2F0ZWdvcnkubGVuZ3RoID4gc3ViQ2F0ZWdvcnlJbmRleDsgc3ViQ2F0ZWdvcnlJbmRleCsrKSB7XHJcbiAgICAgICAgICAgICAgaWYoc3ViQ2F0ZWdvcnlbc3ViQ2F0ZWdvcnlJbmRleF0ucmF0ZUFuYWx5c2lzSWQgPT09IHN1YkNhdGVnb3J5SWQpIHtcclxuICAgICAgICAgICAgICAgIHN1YkNhdGVnb3J5W3N1YkNhdGVnb3J5SW5kZXhdLndvcmtpdGVtLnB1c2god29ya2l0ZW0pO1xyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2VXb3JraXRlbSA9IHN1YkNhdGVnb3J5W3N1YkNhdGVnb3J5SW5kZXhdLndvcmtpdGVtO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgcXVlcnkgPSB7IF9pZCA6IGJ1aWxkaW5nSWQgfTtcclxuICAgICAgICAgICAgbGV0IG5ld0RhdGEgPSB7ICRzZXQgOiB7J2Nvc3RIZWFkJyA6IGJ1aWxkaW5nLmNvc3RIZWFkfX07XHJcbiAgICAgICAgICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIG5ld0RhdGEse25ldzogdHJ1ZX0sIChlcnJvciwgYnVpbGRpbmcpID0+IHtcclxuICAgICAgICAgICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kT25lQW5kVXBkYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTogcmVzcG9uc2VXb3JraXRlbSwgYWNjZXNzX3Rva2VuOiB0aGlzLmF1dGhJbnRlcmNlcHRvci5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKX0pO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGFkZFN1YmNhdGVnb3J5VG9Db3N0SGVhZChwcm9qZWN0SWQ6c3RyaW5nLCBidWlsZGluZ0lkOnN0cmluZywgY29zdGhlYWRJZDpzdHJpbmcsIHN1YmNhdGVnb3J5T2JqZWN0IDogYW55LCB1c2VyOlVzZXIsXHJcbiAgICBjYWxsYmFjazooZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpPT4gdm9pZCkge1xyXG5cclxuICAgIGxldCBzdWJDYXRlZ29yeU9iaiA6IFN1YkNhdGVnb3J5ID0gbmV3IFN1YkNhdGVnb3J5KHN1YmNhdGVnb3J5T2JqZWN0LnN1YkNhdGVnb3J5LCBzdWJjYXRlZ29yeU9iamVjdC5zdWJDYXRlZ29yeUlkKTtcclxuXHJcbiAgICBsZXQgcXVlcnkgPSB7J19pZCcgOiBidWlsZGluZ0lkLCAnY29zdEhlYWQucmF0ZUFuYWx5c2lzSWQnIDogcGFyc2VJbnQoY29zdGhlYWRJZCl9O1xyXG4gICAgbGV0IG5ld0RhdGEgPSB7ICRwdXNoOiB7ICdjb3N0SGVhZC4kLnN1YkNhdGVnb3J5Jzogc3ViQ2F0ZWdvcnlPYmogfX07XHJcblxyXG4gICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgbmV3RGF0YSx7bmV3OiB0cnVlfSwgKGVycm9yLCBidWlsZGluZykgPT4ge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBhZGRTdWJjYXRlZ29yeVRvQ29zdEhlYWQgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTogYnVpbGRpbmcsIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBkZWxldGVTdWJjYXRlZ29yeUZyb21Db3N0SGVhZChwcm9qZWN0SWQ6c3RyaW5nLCBidWlsZGluZ0lkOnN0cmluZywgY29zdGhlYWRJZDpzdHJpbmcsIHN1YmNhdGVnb3J5T2JqZWN0IDogYW55LCB1c2VyOlVzZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOihlcnJvcjogYW55LCByZXN1bHQ6IGFueSk9PiB2b2lkKSB7XHJcblxyXG4gICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZEJ5SWQoYnVpbGRpbmdJZCwgKGVycm9yLCBidWlsZGluZykgPT4ge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBkZWxldGVTdWJjYXRlZ29yeUZyb21Db3N0SGVhZCBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCBjb3N0SGVhZExpc3QgPSBidWlsZGluZy5jb3N0SGVhZDtcclxuICAgICAgICBsZXQgc3ViQ2F0ZWdvcnlMaXN0IDogYW55ID0gW107XHJcblxyXG4gICAgICAgIGZvcihsZXQgaW5kZXg9MDsgaW5kZXg8Y29zdEhlYWRMaXN0Lmxlbmd0aDsgaW5kZXgrKykge1xyXG4gICAgICAgICAgaWYocGFyc2VJbnQoY29zdGhlYWRJZCkgPT09IGNvc3RIZWFkTGlzdFtpbmRleF0ucmF0ZUFuYWx5c2lzSWQpIHtcclxuICAgICAgICAgICAgc3ViQ2F0ZWdvcnlMaXN0ID0gY29zdEhlYWRMaXN0W2luZGV4XS5zdWJDYXRlZ29yeTtcclxuICAgICAgICAgICAgZm9yKGxldCBzdWJjYXRlZ29yeUluZGV4PTA7IHN1YmNhdGVnb3J5SW5kZXg8c3ViQ2F0ZWdvcnlMaXN0Lmxlbmd0aDsgc3ViY2F0ZWdvcnlJbmRleCsrKSB7XHJcbiAgICAgICAgICAgICAgaWYoc3ViQ2F0ZWdvcnlMaXN0W3N1YmNhdGVnb3J5SW5kZXhdLnJhdGVBbmFseXNpc0lkID09PSBzdWJjYXRlZ29yeU9iamVjdC5yYXRlQW5hbHlzaXNJZCkge1xyXG4gICAgICAgICAgICAgICAgc3ViQ2F0ZWdvcnlMaXN0LnNwbGljZShzdWJjYXRlZ29yeUluZGV4LCAxKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBxdWVyeSA9IHsnX2lkJyA6IGJ1aWxkaW5nSWQsICdjb3N0SGVhZC5yYXRlQW5hbHlzaXNJZCcgOiBwYXJzZUludChjb3N0aGVhZElkKX07XHJcbiAgICAgICAgbGV0IG5ld0RhdGEgPSB7JyRzZXQnIDogeydjb3N0SGVhZC4kLnN1YkNhdGVnb3J5JyA6IHN1YkNhdGVnb3J5TGlzdCB9fTtcclxuXHJcbiAgICAgICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgbmV3RGF0YSx7bmV3OiB0cnVlfSwgKGVycm9yLCBkYXRhTGlzdCkgPT4ge1xyXG4gICAgICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZGVsZXRlU3ViY2F0ZWdvcnlGcm9tQ29zdEhlYWQgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGE6IGRhdGFMaXN0LCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0U3ViY2F0ZWdvcnkocHJvamVjdElkOnN0cmluZywgYnVpbGRpbmdJZDpzdHJpbmcsIGNvc3RoZWFkSWQ6bnVtYmVyLCB1c2VyOlVzZXIsIGNhbGxiYWNrOihlcnJvcjogYW55LCByZXN1bHQ6IGFueSk9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBnZXRTdWJjYXRlZ29yeSBoYXMgYmVlbiBoaXQnKTtcclxuICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmZpbmRCeUlkKGJ1aWxkaW5nSWQsIChlcnJvciwgYnVpbGRpbmc6QnVpbGRpbmcpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCBzdWJDYXRlZ29yaWVzIDpBcnJheTxTdWJDYXRlZ29yeT4gPSBudWxsO1xyXG4gICAgICAgIGZvcihsZXQgaW5kZXggPSAwOyBidWlsZGluZy5jb3N0SGVhZC5sZW5ndGggPiBpbmRleDsgaW5kZXgrKykge1xyXG4gICAgICAgICAgaWYoYnVpbGRpbmcuY29zdEhlYWRbaW5kZXhdLnJhdGVBbmFseXNpc0lkID09PSBjb3N0aGVhZElkKSB7XHJcbiAgICAgICAgICAgIHN1YkNhdGVnb3JpZXMgPSBidWlsZGluZy5jb3N0SGVhZFtpbmRleF0uc3ViQ2F0ZWdvcnk7XHJcbiAgICAgICAgICAgIGxldCB3b3JraXRlbXMgPSBzdWJDYXRlZ29yaWVzO1xyXG4gICAgICAgICAgICBmb3IobGV0IHN1YmNhdGVnb3J5SW5kZXggPSAwIDsgc3ViY2F0ZWdvcnlJbmRleCA8IHN1YkNhdGVnb3JpZXMubGVuZ3RoOyBzdWJjYXRlZ29yeUluZGV4ICsrKSB7XHJcbiAgICAgICAgICAgICAgbGV0IHdvcmtpdGVtcyA9IHN1YkNhdGVnb3JpZXNbc3ViY2F0ZWdvcnlJbmRleF0ud29ya2l0ZW07XHJcbiAgICAgICAgICAgICAgZm9yKGxldCB3b3JraXRlbXNJbmRleCA9IDA7IHdvcmtpdGVtc0luZGV4IDwgd29ya2l0ZW1zLmxlbmd0aDsgd29ya2l0ZW1zSW5kZXggKyspIHtcclxuICAgICAgICAgICAgICAgICAgbGV0IHdvcmtpdGVtID0gd29ya2l0ZW1zW3dvcmtpdGVtc0luZGV4XTtcclxuICAgICAgICAgICAgICAgIGlmKHdvcmtpdGVtLnF1YW50aXR5LnRvdGFsICE9PSBudWxsICYmIHdvcmtpdGVtLnJhdGUudG90YWwgIT09IG51bGxcclxuICAgICAgICAgICAgICAgICAgJiYgd29ya2l0ZW0ucXVhbnRpdHkudG90YWwgIT09IDAgJiYgd29ya2l0ZW0ucmF0ZS50b3RhbCAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICBzdWJDYXRlZ29yaWVzW3N1YmNhdGVnb3J5SW5kZXhdLmFtb3VudCA9IHBhcnNlRmxvYXQoKHdvcmtpdGVtLnF1YW50aXR5LnRvdGFsICogd29ya2l0ZW0ucmF0ZS50b3RhbFxyXG4gICAgICAgICAgICAgICAgICAgICsgc3ViQ2F0ZWdvcmllc1tzdWJjYXRlZ29yeUluZGV4XS5hbW91bnQpLnRvRml4ZWQoMikpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgc3ViQ2F0ZWdvcmllc1tzdWJjYXRlZ29yeUluZGV4XS5hbW91bnQ9MDtcclxuICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiBzdWJDYXRlZ29yaWVzLCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuT2JqZWN0LnNlYWwoUHJvamVjdFNlcnZpY2UpO1xyXG5leHBvcnQgPSBQcm9qZWN0U2VydmljZTtcclxuIl19
