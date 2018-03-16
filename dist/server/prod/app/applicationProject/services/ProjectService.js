"use strict";
var ProjectRepository = require("../dataaccess/repository/ProjectRepository");
var BuildingRepository = require("../dataaccess/repository/BuildingRepository");
var UserService = require("./../../framework/services/UserService");
var ProjectAsset = require("../../framework/shared/projectasset");
var BuildingModel = require("../dataaccess/model/project/building/Building");
var AuthInterceptor = require("../../framework/interceptor/auth.interceptor");
var CostControllException = require("../exception/CostControllException");
var Rate = require("../dataaccess/model/project/building/Rate");
var CostHead = require("../dataaccess/model/project/building/CostHead");
var RateAnalysisService = require("./RateAnalysisService");
var Category = require("../dataaccess/model/project/building/Category");
var config = require('config');
var log4js = require('log4js');
var alasql = require("alasql");
var Promise = require('promise');
var BudgetCostRates = require("../dataaccess/model/project/reports/BudgetCostRates");
var ThumbRuleRate = require("../dataaccess/model/project/reports/ThumbRuleRate");
var Constants = require("../../applicationProject/shared/constants");
var logger = log4js.getLogger('Project service');
var ProjectService = (function () {
    function ProjectService() {
        this.projectRepository = new ProjectRepository();
        this.buildingRepository = new BuildingRepository();
        this.APP_NAME = ProjectAsset.APP_NAME;
        this.authInterceptor = new AuthInterceptor();
        this.userService = new UserService();
    }
    ProjectService.prototype.createProject = function (data, user, callback) {
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
                logger.debug('Project Name : ' + res.name);
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
    ProjectService.prototype.getProjectById = function (projectId, user, callback) {
        var _this = this;
        var query = { _id: projectId };
        var populate = { path: 'building', select: ['name', 'totalSlabArea',] };
        this.projectRepository.findAndPopulate(query, populate, function (error, result) {
            logger.info('Project service, findAndPopulate has been hit');
            logger.debug('Project Name : ' + result[0].name);
            if (error) {
                callback(error, null);
            }
            else {
                callback(null, { data: result, access_token: _this.authInterceptor.issueTokenWithUid(user) });
            }
        });
    };
    ProjectService.prototype.getProjectAndBuildingDetails = function (projectId, buildingId, callback) {
        logger.info('Project service, getProjectAndBuildingDetails for sync with rateAnalysis has been hit');
        var query = { _id: projectId };
        var populate = { path: 'buildings' };
        this.projectRepository.findAndPopulate(query, populate, function (error, result) {
            logger.info('Project service, findAndPopulate has been hit');
            logger.debug('Project Name : ' + result[0].name);
            if (error) {
                logger.error('Project service, getProjectAndBuildingDetails findAndPopulate failed ' + JSON.stringify(error));
                callback(error, null);
            }
            else {
                logger.debug('getProjectAndBuildingDetails success.');
                callback(null, { data: result });
            }
        });
    };
    ProjectService.prototype.updateProjectById = function (projectDetails, user, callback) {
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
    ProjectService.prototype.createBuilding = function (projectId, buildingDetails, user, callback) {
        var _this = this;
        this.buildingRepository.create(buildingDetails, function (error, result) {
            logger.info('Project service, create has been hit');
            if (error) {
                callback(error, null);
            }
            else {
                var query = { _id: projectId };
                var newData = { $push: { buildings: result._id } };
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
    ProjectService.prototype.updateBuildingById = function (buildingId, buildingDetails, user, callback) {
        var _this = this;
        logger.info('Project service, updateBuilding has been hit');
        var query = { _id: buildingId };
        this.buildingRepository.findOneAndUpdate(query, buildingDetails, { new: true }, function (error, result) {
            logger.info('Project service, findOneAndUpdate has been hit');
            if (error) {
                callback(error, null);
            }
            else {
                callback(null, { data: result, access_token: _this.authInterceptor.issueTokenWithUid(user) });
            }
        });
    };
    ProjectService.prototype.cloneBuildingDetails = function (buildingId, buildingDetails, user, callback) {
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
                var costHeads = buildingDetails.costHeads;
                var resultCostHeads = result.costHeads;
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
                                var categoryList = costHead.category;
                                var resultCategoryList = resultCostHead.categories;
                                for (var resultCategoryIndex = 0; resultCategoryIndex < resultCategoryList.length; resultCategoryIndex++) {
                                    for (var categoryIndex = 0; categoryIndex < categoryList.length; categoryIndex++) {
                                        if (categoryList[categoryIndex].name === resultCategoryList[resultCategoryIndex].name) {
                                            if (!categoryList[categoryIndex].active) {
                                                resultCategoryList.splice(resultCategoryIndex, 1);
                                            }
                                            else {
                                                var resultWorkitemList = resultCategoryList[resultCategoryIndex].workItems;
                                                var workItemList = categoryList[categoryIndex].workItems;
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
                                clonedCostHead.categories = resultCostHead.categories;
                            }
                            else {
                                clonedCostHead.categories = resultCostHead.categories;
                            }
                            clonedCostHeadDetails.push(clonedCostHead);
                        }
                    }
                }
                var updateBuildingCostHeads = { 'costHeads': clonedCostHeadDetails };
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
    ProjectService.prototype.getBuildingById = function (projectId, buildingId, user, callback) {
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
                var response = result.costHeads;
                var inActiveCostHead = [];
                for (var _i = 0, response_1 = response; _i < response_1.length; _i++) {
                    var costHeadItem = response_1[_i];
                    if (!costHeadItem.active) {
                        inActiveCostHead.push(costHeadItem);
                    }
                }
                callback(null, { data: inActiveCostHead, access_token: _this.authInterceptor.issueTokenWithUid(user) });
            }
        });
    };
    ProjectService.prototype.getInActiveWorkItemsOfBuildingCostHeads = function (projectId, buildingId, costHeadId, categoryId, user, callback) {
        var _this = this;
        logger.info('Project service, add Workitem has been hit');
        this.buildingRepository.findById(buildingId, function (error, building) {
            if (error) {
                callback(error, null);
            }
            else {
                var costHeadList = building.costHeads;
                var categoryList = void 0;
                var workItemList = void 0;
                var inActiveWorkItems = [];
                for (var index = 0; index < costHeadList.length; index++) {
                    if (costHeadId === costHeadList[index].rateAnalysisId) {
                        categoryList = costHeadList[index].categories;
                        for (var subCategoryIndex = 0; subCategoryIndex < categoryList.length; subCategoryIndex++) {
                            if (categoryId === categoryList[subCategoryIndex].rateAnalysisId) {
                                workItemList = categoryList[subCategoryIndex].workItems;
                                for (var _i = 0, workItemList_1 = workItemList; _i < workItemList_1.length; _i++) {
                                    var checkWorkItem = workItemList_1[_i];
                                    if (!checkWorkItem.active) {
                                        inActiveWorkItems.push(checkWorkItem);
                                    }
                                }
                            }
                        }
                    }
                }
                callback(null, { data: inActiveWorkItems, access_token: _this.authInterceptor.issueTokenWithUid(user) });
            }
        });
    };
    ProjectService.prototype.getInActiveWorkItemsOfProjectCostHeads = function (projectId, costHeadId, categoryId, user, callback) {
        var _this = this;
        logger.info('Project service, Get In-Active WorkItems Of Project Cost Heads has been hit');
        this.projectRepository.findById(projectId, function (error, project) {
            if (error) {
                callback(error, null);
            }
            else {
                var costHeadList = project.projectCostHeads;
                var categoryList = void 0;
                var workItemList = void 0;
                var inActiveWorkItems = [];
                for (var _i = 0, costHeadList_1 = costHeadList; _i < costHeadList_1.length; _i++) {
                    var costHead = costHeadList_1[_i];
                    if (costHeadId === costHead.rateAnalysisId) {
                        categoryList = costHead.categories;
                        for (var _a = 0, categoryList_1 = categoryList; _a < categoryList_1.length; _a++) {
                            var category = categoryList_1[_a];
                            if (categoryId === category.rateAnalysisId) {
                                workItemList = category.workItems;
                                for (var _b = 0, workItemList_2 = workItemList; _b < workItemList_2.length; _b++) {
                                    var checkWorkItem = workItemList_2[_b];
                                    if (!checkWorkItem.active) {
                                        inActiveWorkItems.push(checkWorkItem);
                                    }
                                }
                            }
                        }
                    }
                }
                callback(null, { data: inActiveWorkItems, access_token: _this.authInterceptor.issueTokenWithUid(user) });
            }
        });
    };
    ProjectService.prototype.getBuildingByIdForClone = function (projectId, buildingId, user, callback) {
        var _this = this;
        logger.info('Project service, getClonedBuilding has been hit');
        this.buildingRepository.findById(buildingId, function (error, result) {
            logger.info('Project service, findById has been hit');
            if (error) {
                callback(error, null);
            }
            else {
                var clonedBuilding = result.costHeads;
                var building = new BuildingModel();
                building.name = result.name;
                building.totalSlabArea = result.totalSlabArea;
                building.totalCarpetAreaOfUnit = result.totalCarpetAreaOfUnit;
                building.totalSaleableAreaOfUnit = result.totalSaleableAreaOfUnit;
                building.plinthArea = result.plinthArea;
                building.totalNumOfFloors = result.totalNumOfFloors;
                building.numOfParkingFloors = result.numOfParkingFloors;
                building.carpetAreaOfParking = result.carpetAreaOfParking;
                building.numOfOneBHK = result.numOfOneBHK;
                building.numOfTwoBHK = result.numOfTwoBHK;
                building.numOfThreeBHK = result.numOfThreeBHK;
                building.numOfFourBHK = result.numOfFourBHK;
                building.numOfFiveBHK = result.numOfFiveBHK;
                building.numOfLifts = result.numOfLifts;
                building.costHeads = result.costHeads;
                callback(null, { data: building, access_token: _this.authInterceptor.issueTokenWithUid(user) });
            }
        });
    };
    ProjectService.prototype.deleteBuildingById = function (projectId, buildingId, user, callback) {
        var _this = this;
        logger.info('Project service, deleteBuilding has been hit');
        var popBuildingId = buildingId;
        this.buildingRepository.delete(buildingId, function (error, result) {
            if (error) {
                callback(error, null);
            }
            else {
                var query = { _id: projectId };
                var newData = { $pull: { buildings: popBuildingId } };
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
    ProjectService.prototype.getRate = function (projectId, buildingId, costHeadId, categoryId, workItemId, user, callback) {
        var _this = this;
        logger.info('Project service, getRate has been hit');
        var rateAnalysisServices = new RateAnalysisService();
        rateAnalysisServices.getRate(workItemId, function (error, rateData) {
            if (error) {
                callback(error, null);
            }
            else {
                var rate = new Rate();
                rate.rateItems = rateData;
                callback(null, { data: rateData, access_token: _this.authInterceptor.issueTokenWithUid(user) });
            }
        });
    };
    ProjectService.prototype.updateRateOfBuildingCostHeads = function (projectId, buildingId, costHeadId, categoryId, workItemId, rate, user, callback) {
        var _this = this;
        logger.info('Project service, updateRateOfBuildingCostHeads has been hit');
        this.buildingRepository.findById(buildingId, function (error, building) {
            logger.info('Project service, findById has been hit');
            if (error) {
                callback(error, null);
            }
            else {
                var costHeads = building.costHeads;
                for (var _i = 0, costHeads_2 = costHeads; _i < costHeads_2.length; _i++) {
                    var costHeadData = costHeads_2[_i];
                    if (costHeadData.rateAnalysisId === costHeadId) {
                        for (var _a = 0, _b = costHeadData.categories; _a < _b.length; _a++) {
                            var categoryData = _b[_a];
                            if (categoryData.rateAnalysisId === categoryId) {
                                for (var _c = 0, _d = categoryData.workItems; _c < _d.length; _c++) {
                                    var workItemData = _d[_c];
                                    if (workItemData.rateAnalysisId === workItemId) {
                                        workItemData.rate = rate;
                                    }
                                }
                            }
                        }
                    }
                }
                var query = { '_id': buildingId };
                var newData = { $set: { 'costHeads': costHeads } };
                _this.buildingRepository.findOneAndUpdate(query, newData, { new: true }, function (error, result) {
                    if (error) {
                        callback(error, null);
                    }
                    else {
                        callback(null, { data: 'success', access_token: _this.authInterceptor.issueTokenWithUid(user) });
                    }
                });
            }
        });
    };
    ProjectService.prototype.updateRateOfProjectCostHeads = function (projectId, costHeadId, categoryId, workItemId, rate, user, callback) {
        var _this = this;
        logger.info('Project service, Update rate of project cost heads has been hit');
        this.projectRepository.findById(projectId, function (error, project) {
            logger.info('Project service, findById has been hit');
            if (error) {
                callback(error, null);
            }
            else {
                var projectCostHeads = project.projectCostHeads;
                for (var _i = 0, projectCostHeads_1 = projectCostHeads; _i < projectCostHeads_1.length; _i++) {
                    var costHeadData = projectCostHeads_1[_i];
                    if (costHeadData.rateAnalysisId === costHeadId) {
                        for (var _a = 0, _b = costHeadData.categories; _a < _b.length; _a++) {
                            var categoryData = _b[_a];
                            if (categoryData.rateAnalysisId === categoryId) {
                                for (var _c = 0, _d = categoryData.workItems; _c < _d.length; _c++) {
                                    var workItemData = _d[_c];
                                    if (workItemData.rateAnalysisId === workItemId) {
                                        workItemData.rate = rate;
                                    }
                                }
                            }
                        }
                    }
                }
                var query = { '_id': projectId };
                var newData = { $set: { 'projectCostHeads': projectCostHeads } };
                _this.projectRepository.findOneAndUpdate(query, newData, { new: true }, function (error, result) {
                    if (error) {
                        callback(error, null);
                    }
                    else {
                        callback(null, { data: 'success', access_token: _this.authInterceptor.issueTokenWithUid(user) });
                    }
                });
            }
        });
    };
    ProjectService.prototype.deleteQuantityOfBuildingCostHeadsByName = function (projectId, buildingId, costHeadId, categoryId, workItemId, item, user, callback) {
        var _this = this;
        logger.info('Project service, deleteQuantity has been hit');
        this.buildingRepository.findById(buildingId, function (error, building) {
            if (error) {
                callback(error, null);
            }
            else {
                var quantity = void 0;
                _this.costHeadId = parseInt(costHeadId);
                _this.categoryId = parseInt(categoryId);
                _this.workItemId = parseInt(workItemId);
                for (var index = 0; building.costHeads.length > index; index++) {
                    if (building.costHeads[index].rateAnalysisId === _this.costHeadId) {
                        for (var index1 = 0; building.costHeads[index].categories.length > index1; index1++) {
                            if (building.costHeads[index].categories[index1].rateAnalysisId === _this.categoryId) {
                                for (var index2 = 0; building.costHeads[index].categories[index1].workItems.length > index2; index2++) {
                                    if (building.costHeads[index].categories[index1].workItems[index2].rateAnalysisId === _this.workItemId) {
                                        quantity = building.costHeads[index].categories[index1].workItems[index2].quantity;
                                    }
                                }
                            }
                        }
                    }
                }
                for (var index = 0; quantity.quantityItems.length > index; index++) {
                    if (quantity.quantityItems[index].item === item) {
                        quantity.quantityItems.splice(index, 1);
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
                        for (var index = 0; building.costHeads.length > index; index++) {
                            if (building.costHeads[index].rateAnalysisId === _this.costHeadId) {
                                for (var index1 = 0; building.costHeads[index].categories.length > index1; index1++) {
                                    if (building.costHeads[index].categories[index1].rateAnalysisId === _this.categoryId) {
                                        for (var index2 = 0; building.costHeads[index].categories[index1].workItems.length > index2; index2++) {
                                            if (building.costHeads[index].categories[index1].workItems[index2].rateAnalysisId === _this.workItemId) {
                                                quantity_1 = building.costHeads[index].categories[index1].workItems[index2].quantity;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (quantity_1.total) {
                            if (quantity_1.quantityItems.length !== 0) {
                                for (var index = 0; quantity_1.quantityItems.length > index; index++) {
                                    quantity_1.total = quantity_1.quantityItems[index].quantity + quantity_1.total;
                                }
                            }
                            else {
                                quantity_1.total = 0;
                            }
                        }
                        callback(null, { data: quantity_1, access_token: _this.authInterceptor.issueTokenWithUid(user) });
                    }
                });
            }
        });
    };
    ProjectService.prototype.deleteQuantityOfProjectCostHeadsByName = function (projectId, costHeadId, categoryId, workItemId, item, user, callback) {
        var _this = this;
        logger.info('Project service, Delete Quantity Of Project Cost Heads By Name has been hit');
        this.projectRepository.findById(projectId, function (error, project) {
            if (error) {
                callback(error, null);
            }
            else {
                var quantity = void 0;
                _this.costHeadId = parseInt(costHeadId);
                _this.categoryId = parseInt(categoryId);
                _this.workItemId = parseInt(workItemId);
                for (var index = 0; project.projectCostHeads.length > index; index++) {
                    if (project.projectCostHeads[index].rateAnalysisId === _this.costHeadId) {
                        for (var index1 = 0; project.projectCostHeads[index].categories.length > index1; index1++) {
                            if (project.projectCostHeads[index].categories[index1].rateAnalysisId === _this.categoryId) {
                                for (var index2 = 0; project.projectCostHeads[index].categories[index1].workItems.length > index2; index2++) {
                                    if (project.projectCostHeads[index].categories[index1].workItems[index2].rateAnalysisId === _this.workItemId) {
                                        quantity = project.projectCostHeads[index].categories[index1].workItems[index2].quantity;
                                        for (var index_1 = 0; quantity.quantityItems.length > index_1; index_1++) {
                                            if (quantity.quantityItems[index_1].item === item) {
                                                quantity.quantityItems.splice(index_1, 1);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                var query = { _id: projectId };
                _this.projectRepository.findOneAndUpdate(query, project, { new: true }, function (error, project) {
                    logger.info('Project service, findOneAndUpdate has been hit');
                    if (error) {
                        callback(error, null);
                    }
                    else {
                        var quantity_2;
                        for (var index = 0; project.projectCostHeads.length > index; index++) {
                            if (project.projectCostHeads[index].rateAnalysisId === _this.costHeadId) {
                                for (var index1 = 0; project.projectCostHeads[index].categories.length > index1; index1++) {
                                    if (project.projectCostHeads[index].categories[index1].rateAnalysisId === _this.categoryId) {
                                        for (var index2 = 0; project.projectCostHeads[index].categories[index1].workItems.length > index2; index2++) {
                                            if (project.projectCostHeads[index].categories[index1].workItems[index2].rateAnalysisId === _this.workItemId) {
                                                quantity_2 = project.projectCostHeads[index].categories[index1].workItems[index2].quantity;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (quantity_2.total) {
                            if (quantity_2.quantityItems.length !== 0) {
                                for (var index = 0; quantity_2.quantityItems.length > index; index++) {
                                    quantity_2.total = quantity_2.quantityItems[index].quantity + quantity_2.total;
                                }
                            }
                            else {
                                quantity_2.total = 0;
                            }
                        }
                        callback(null, { data: 'success', access_token: _this.authInterceptor.issueTokenWithUid(user) });
                    }
                });
            }
        });
    };
    ProjectService.prototype.deleteWorkitem = function (projectId, buildingId, costHeadId, categoryId, workItemId, user, callback) {
        var _this = this;
        logger.info('Project service, delete Workitem has been hit');
        this.buildingRepository.findById(buildingId, function (error, building) {
            if (error) {
                callback(error, null);
            }
            else {
                var costHeadList = building.costHeads;
                var categoryList = void 0;
                var WorkItemList = void 0;
                var flag = 0;
                for (var index = 0; index < costHeadList.length; index++) {
                    if (costHeadId === costHeadList[index].rateAnalysisId) {
                        categoryList = costHeadList[index].categories;
                        for (var categoryIndex = 0; categoryIndex < categoryList.length; categoryIndex++) {
                            if (categoryId === categoryList[categoryIndex].rateAnalysisId) {
                                WorkItemList = categoryList[categoryIndex].workItems;
                                for (var workitemIndex = 0; workitemIndex < WorkItemList.length; workitemIndex++) {
                                    if (workItemId === WorkItemList[workitemIndex].rateAnalysisId) {
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
    ProjectService.prototype.setCostHeadStatus = function (buildingId, costHeadId, costHeadActiveStatus, user, callback) {
        var _this = this;
        var query = { '_id': buildingId, 'costHeads.rateAnalysisId': costHeadId };
        var activeStatus = JSON.parse(costHeadActiveStatus);
        var newData = { $set: { 'costHeads.$.active': activeStatus } };
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
    ProjectService.prototype.updateWorkItemStatusOfBuildingCostHeads = function (buildingId, costHeadId, categoryId, workItemId, workItemActiveStatus, user, callback) {
        var _this = this;
        logger.info('Project service, update Workitem has been hit');
        this.buildingRepository.findById(buildingId, function (error, building) {
            if (error) {
                callback(error, null);
            }
            else {
                var costHeadList = building.costHeads;
                for (var _i = 0, costHeadList_2 = costHeadList; _i < costHeadList_2.length; _i++) {
                    var costHeadData = costHeadList_2[_i];
                    if (costHeadId === costHeadData.rateAnalysisId) {
                        for (var _a = 0, _b = costHeadData.categories; _a < _b.length; _a++) {
                            var categoryData = _b[_a];
                            if (categoryId === categoryData.rateAnalysisId) {
                                for (var _c = 0, _d = categoryData.workItems; _c < _d.length; _c++) {
                                    var workItemData = _d[_c];
                                    if (workItemId === workItemData.rateAnalysisId) {
                                        workItemData.active = workItemActiveStatus;
                                    }
                                }
                            }
                        }
                    }
                }
                var query = { _id: buildingId };
                _this.buildingRepository.findOneAndUpdate(query, building, { new: true }, function (error, response) {
                    logger.info('Project service, findOneAndUpdate has been hit');
                    if (error) {
                        callback(error, null);
                    }
                    else {
                        callback(null, { data: 'success', access_token: _this.authInterceptor.issueTokenWithUid(user) });
                    }
                });
            }
        });
    };
    ProjectService.prototype.updateWorkItemStatusOfProjectCostHeads = function (projectId, costHeadId, categoryId, workItemId, workItemActiveStatus, user, callback) {
        var _this = this;
        logger.info('Project service, Update WorkItem Status Of Project Cost Heads has been hit');
        this.projectRepository.findById(projectId, function (error, project) {
            if (error) {
                callback(error, null);
            }
            else {
                var costHeadList = project.projectCostHeads;
                for (var _i = 0, costHeadList_3 = costHeadList; _i < costHeadList_3.length; _i++) {
                    var costHeadData = costHeadList_3[_i];
                    if (costHeadId === costHeadData.rateAnalysisId) {
                        for (var _a = 0, _b = costHeadData.categories; _a < _b.length; _a++) {
                            var categoryData = _b[_a];
                            if (categoryId === categoryData.rateAnalysisId) {
                                for (var _c = 0, _d = categoryData.workItems; _c < _d.length; _c++) {
                                    var workItemData = _d[_c];
                                    if (workItemId === workItemData.rateAnalysisId) {
                                        workItemData.active = workItemActiveStatus;
                                    }
                                }
                            }
                        }
                    }
                }
                var query = { _id: projectId };
                _this.projectRepository.findOneAndUpdate(query, project, { new: true }, function (error, response) {
                    logger.info('Project service, Update WorkItem Status Of Project Cost Heads ,findOneAndUpdate has been hit');
                    if (error) {
                        callback(error, null);
                    }
                    else {
                        callback(null, { data: 'success', access_token: _this.authInterceptor.issueTokenWithUid(user) });
                    }
                });
            }
        });
    };
    ProjectService.prototype.updateBudgetedCostForCostHead = function (buildingId, costHeadBudgetedAmount, user, callback) {
        var _this = this;
        logger.info('Project service, updateBudgetedCostForCostHead has been hit');
        var query = { '_id': buildingId, 'costHeads.name': costHeadBudgetedAmount.costHead };
        var costInUnit = costHeadBudgetedAmount.costIn;
        var costPerUnit = costHeadBudgetedAmount.costPer;
        var rate = 0;
        var newData;
        rate = costHeadBudgetedAmount.budgetedCostAmount / costHeadBudgetedAmount.buildingArea;
        if (costPerUnit === 'saleableArea' && costInUnit === 'sqft') {
            newData = { $set: {
                    'costHeads.$.thumbRuleRate.saleableArea.sqft': rate,
                    'costHeads.$.thumbRuleRate.saleableArea.sqmt': rate / config.get(Constants.SQUARE_METER)
                } };
        }
        else if (costPerUnit === 'saleableArea' && costInUnit === 'sqmt') {
            newData = { $set: {
                    'costHeads.$.thumbRuleRate.saleableArea.sqmt': rate,
                    'costHeads.$.thumbRuleRate.saleableArea.sqft': rate * config.get(Constants.SQUARE_METER)
                } };
        }
        else if (costPerUnit === 'slabArea' && costInUnit === 'sqft') {
            newData = { $set: {
                    'costHeads.$.thumbRuleRate.slabArea.sqft': rate,
                    'costHeads.$.thumbRuleRate.slabArea.sqmt': rate / config.get(Constants.SQUARE_METER)
                } };
        }
        else if (costPerUnit === 'slabArea' && costInUnit === 'sqmt') {
            newData = { $set: {
                    'costHeads.$.thumbRuleRate.slabArea.sqmt': rate,
                    'costHeads.$.thumbRuleRate.slabArea.sqft': rate * config.get(Constants.SQUARE_METER)
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
    ProjectService.prototype.updateQuantityOfBuildingCostHeads = function (projectId, buildingId, costHeadId, categoryId, workItemId, quantity, user, callback) {
        var _this = this;
        logger.info('Project service, updateQuantityOfBuildingCostHeads has been hit');
        this.buildingRepository.findById(buildingId, function (error, building) {
            if (error) {
                callback(error, null);
            }
            else {
                var costHeadList = building.costHeads;
                var quantityArray = void 0;
                for (var _i = 0, costHeadList_4 = costHeadList; _i < costHeadList_4.length; _i++) {
                    var costHead = costHeadList_4[_i];
                    if (costHeadId === costHead.rateAnalysisId) {
                        for (var _a = 0, _b = costHead.categories; _a < _b.length; _a++) {
                            var categoryData = _b[_a];
                            if (categoryId === categoryData.rateAnalysisId) {
                                for (var _c = 0, _d = categoryData.workItems; _c < _d.length; _c++) {
                                    var workItemData = _d[_c];
                                    if (workItemId === workItemData.rateAnalysisId) {
                                        quantityArray = workItemData.quantity;
                                        quantityArray.quantityItems = quantity;
                                        quantityArray.total = 0;
                                        for (var _e = 0, _f = quantityArray.quantityItems; _e < _f.length; _e++) {
                                            var quantityData = _f[_e];
                                            quantityArray.total = quantityData.quantity + quantityArray.total;
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
                        callback(null, { data: 'success', access_token: _this.authInterceptor.issueTokenWithUid(user) });
                    }
                });
            }
        });
    };
    ProjectService.prototype.updateQuantityOfProjectCostHeads = function (projectId, costHeadId, categoryId, workItemId, quantity, user, callback) {
        var _this = this;
        logger.info('Project service, Update Quantity Of Project Cost Heads has been hit');
        this.projectRepository.findById(projectId, function (error, project) {
            if (error) {
                callback(error, null);
            }
            else {
                var costHeadList = project.projectCostHeads;
                var quantityArray = void 0;
                for (var _i = 0, costHeadList_5 = costHeadList; _i < costHeadList_5.length; _i++) {
                    var costHead = costHeadList_5[_i];
                    if (costHeadId === costHead.rateAnalysisId) {
                        for (var _a = 0, _b = costHead.categories; _a < _b.length; _a++) {
                            var categoryData = _b[_a];
                            if (categoryId === categoryData.rateAnalysisId) {
                                for (var _c = 0, _d = categoryData.workItems; _c < _d.length; _c++) {
                                    var workItemData = _d[_c];
                                    if (workItemId === workItemData.rateAnalysisId) {
                                        quantityArray = workItemData.quantity;
                                        quantityArray.quantityItems = quantity;
                                        quantityArray.total = 0;
                                        for (var _e = 0, _f = quantityArray.quantityItems; _e < _f.length; _e++) {
                                            var quantityData = _f[_e];
                                            quantityArray.total = quantityData.quantity + quantityArray.total;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                var query = { _id: projectId };
                _this.projectRepository.findOneAndUpdate(query, project, { new: true }, function (error, project) {
                    logger.info('Project service, Update Quantity Of Project Cost Heads has been hit');
                    if (error) {
                        callback(error, null);
                    }
                    else {
                        callback(null, { data: 'success', access_token: _this.authInterceptor.issueTokenWithUid(user) });
                    }
                });
            }
        });
    };
    ProjectService.prototype.getInActiveCategoriesByCostHeadId = function (projectId, buildingId, costHeadId, user, callback) {
        var _this = this;
        this.buildingRepository.findById(buildingId, function (error, building) {
            logger.info('Project service, Get In-Active Categories By Cost Head Id has been hit');
            if (error) {
                callback(error, null);
            }
            else {
                var costHeads = building.costHeads;
                var categories = new Array();
                for (var costHeadIndex = 0; costHeadIndex < costHeads.length; costHeadIndex++) {
                    if (parseInt(costHeadId) === costHeads[costHeadIndex].rateAnalysisId) {
                        var categoriesList = costHeads[costHeadIndex].categories;
                        for (var categoryIndex = 0; categoryIndex < categoriesList.length; categoryIndex++) {
                            if (categoriesList[categoryIndex].active === false) {
                                categories.push(categoriesList[categoryIndex]);
                            }
                        }
                    }
                }
                callback(null, { data: categories, access_token: _this.authInterceptor.issueTokenWithUid(user) });
            }
        });
    };
    ProjectService.prototype.getWorkitemList = function (projectId, buildingId, costHeadId, categoryId, user, callback) {
        var _this = this;
        logger.info('Project service, getWorkitemList has been hit');
        var rateAnalysisServices = new RateAnalysisService();
        rateAnalysisServices.getWorkitemList(costHeadId, categoryId, function (error, workitemList) {
            if (error) {
                callback(error, null);
            }
            else {
                callback(null, { data: workitemList, access_token: _this.authInterceptor.issueTokenWithUid(user) });
            }
        });
    };
    ProjectService.prototype.addWorkitem = function (projectId, buildingId, costHeadId, categoryId, workItem, user, callback) {
        var _this = this;
        logger.info('Project service, addWorkitem has been hit');
        this.buildingRepository.findById(buildingId, function (error, building) {
            if (error) {
                callback(error, null);
            }
            else {
                var responseWorkitem_1 = null;
                for (var index = 0; building.costHeads.length > index; index++) {
                    if (building.costHeads[index].rateAnalysisId === costHeadId) {
                        var category = building.costHeads[index].categories;
                        for (var categoryIndex = 0; category.length > categoryIndex; categoryIndex++) {
                            if (category[categoryIndex].rateAnalysisId === categoryId) {
                                category[categoryIndex].workItems.push(workItem);
                                responseWorkitem_1 = category[categoryIndex].workItems;
                            }
                        }
                        var query = { _id: buildingId };
                        var newData = { $set: { 'costHeads': building.costHeads } };
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
    ProjectService.prototype.addCategoryByCostHeadId = function (projectId, buildingId, costHeadId, categoryDetails, user, callback) {
        var _this = this;
        var categoryObj = new Category(categoryDetails.category, categoryDetails.categoryId);
        var query = { '_id': buildingId, 'costHeads.rateAnalysisId': parseInt(costHeadId) };
        var newData = { $push: { 'costHeads.$.categories': categoryObj } };
        this.buildingRepository.findOneAndUpdate(query, newData, { new: true }, function (error, building) {
            logger.info('Project service, addCategoryByCostHeadId has been hit');
            if (error) {
                callback(error, null);
            }
            else {
                callback(null, { data: building, access_token: _this.authInterceptor.issueTokenWithUid(user) });
            }
        });
    };
    ProjectService.prototype.updateCategoryStatus = function (projectId, buildingId, costHeadId, categoryId, categoryActiveStatus, user, callback) {
        var _this = this;
        this.buildingRepository.findById(buildingId, function (error, building) {
            logger.info('Project service, update Category Status has been hit');
            if (error) {
                callback(error, null);
            }
            else {
                var costHeads = building.costHeads;
                var categories = new Array();
                var updatedCategories_1 = new Array();
                var index = void 0;
                for (var costHeadIndex = 0; costHeadIndex < costHeads.length; costHeadIndex++) {
                    if (costHeadId === costHeads[costHeadIndex].rateAnalysisId) {
                        categories = costHeads[costHeadIndex].categories;
                        for (var categoryIndex = 0; categoryIndex < categories.length; categoryIndex++) {
                            if (categories[categoryIndex].rateAnalysisId === categoryId) {
                                categories[categoryIndex].active = categoryActiveStatus;
                                updatedCategories_1.push(categories[categoryIndex]);
                            }
                        }
                    }
                }
                var query = { '_id': buildingId, 'costHeads.rateAnalysisId': costHeadId };
                var newData = { '$set': { 'costHeads.$.categories': categories } };
                _this.buildingRepository.findOneAndUpdate(query, newData, { new: true }, function (error, building) {
                    if (error) {
                        callback(error, null);
                    }
                    else {
                        callback(null, { data: updatedCategories_1, access_token: _this.authInterceptor.issueTokenWithUid(user) });
                    }
                });
            }
        });
    };
    ProjectService.prototype.getCategoriesOfBuildingCostHead = function (projectId, buildingId, costHeadId, user, callback) {
        var _this = this;
        logger.info('Project service, Get Active Categories has been hit');
        this.buildingRepository.findById(buildingId, function (error, building) {
            if (error) {
                callback(error, null);
            }
            else {
                var categories = new Array();
                var buildingCostHeads = building.costHeads;
                for (var _i = 0, buildingCostHeads_1 = buildingCostHeads; _i < buildingCostHeads_1.length; _i++) {
                    var costHeadData = buildingCostHeads_1[_i];
                    if (costHeadData.rateAnalysisId === costHeadId) {
                        for (var _a = 0, _b = costHeadData.categories; _a < _b.length; _a++) {
                            var categoryData = _b[_a];
                            if (categoryData.active === true) {
                                var workItems = new Array();
                                var category = categoryData;
                                for (var _c = 0, _d = category.workItems; _c < _d.length; _c++) {
                                    var workItemData = _d[_c];
                                    if (workItemData.active) {
                                        workItems.push(workItemData);
                                        for (var _e = 0, workItems_1 = workItems; _e < workItems_1.length; _e++) {
                                            var singleWorkItem = workItems_1[_e];
                                            if (singleWorkItem.quantity.total !== null && singleWorkItem.rate.total !== null
                                                && singleWorkItem.quantity.total !== 0 && singleWorkItem.rate.total !== 0) {
                                                categoryData.amount = parseFloat((singleWorkItem.quantity.total *
                                                    singleWorkItem.rate.total + categoryData.amount).toFixed(2));
                                            }
                                            else {
                                                categoryData.amount = 0;
                                                categoryData.amount = 0;
                                                break;
                                            }
                                        }
                                    }
                                }
                                category.workItems = workItems;
                                categories.push(category);
                            }
                        }
                    }
                }
                callback(null, { data: categories, access_token: _this.authInterceptor.issueTokenWithUid(user) });
            }
        });
    };
    ProjectService.prototype.getCategoriesOfProjectCostHead = function (projectId, costHeadId, user, callback) {
        var _this = this;
        logger.info('Project service, Get Project CostHead Categories has been hit');
        this.projectRepository.findById(projectId, function (error, project) {
            if (error) {
                callback(error, null);
            }
            else {
                var categories = new Array();
                var projectCostHeads = project.projectCostHeads;
                for (var _i = 0, projectCostHeads_2 = projectCostHeads; _i < projectCostHeads_2.length; _i++) {
                    var costHead = projectCostHeads_2[_i];
                    if (costHead.rateAnalysisId === costHeadId) {
                        for (var _a = 0, _b = costHead.categories; _a < _b.length; _a++) {
                            var singleCategory = _b[_a];
                            var categoryData = singleCategory;
                            var workItems = new Array();
                            var category = categoryData;
                            for (var _c = 0, _d = category.workItems; _c < _d.length; _c++) {
                                var workItem = _d[_c];
                                var workItemData = workItem;
                                if (workItemData.active) {
                                    workItems.push(workItemData);
                                    for (var _e = 0, workItems_2 = workItems; _e < workItems_2.length; _e++) {
                                        var singleWorkItem = workItems_2[_e];
                                        if (singleWorkItem.quantity.total !== null && singleWorkItem.rate.total !== null
                                            && singleWorkItem.quantity.total !== 0 && singleWorkItem.rate.total !== 0) {
                                            categoryData.amount =
                                                parseFloat((singleWorkItem.quantity.total *
                                                    singleWorkItem.rate.total +
                                                    categoryData.amount).toFixed(2));
                                        }
                                        else {
                                            categoryData.amount = 0;
                                            categoryData.amount = 0;
                                            break;
                                        }
                                    }
                                }
                            }
                            category.workItems = workItems;
                            categories.push(category);
                        }
                    }
                }
                callback(null, { data: categories, access_token: _this.authInterceptor.issueTokenWithUid(user) });
            }
        });
    };
    ProjectService.prototype.syncProjectWithRateAnalysisData = function (projectId, buildingId, user, callback) {
        var _this = this;
        logger.info('Project service, syncProjectWithRateAnalysisData has been hit');
        this.getProjectAndBuildingDetails(projectId, buildingId, function (error, projectAndBuildingDetails) {
            if (error) {
                logger.error('Project service, getProjectAndBuildingDetails failed');
                callback(error, null);
            }
            else {
                logger.info('Project service, syncProjectWithRateAnalysisData.');
                var projectData = projectAndBuildingDetails.data[0];
                var buildings = projectAndBuildingDetails.data[0].buildings;
                var buildingData = void 0;
                for (var _i = 0, buildings_1 = buildings; _i < buildings_1.length; _i++) {
                    var building = buildings_1[_i];
                    if (building._id == buildingId) {
                        buildingData = building;
                        break;
                    }
                }
                if (projectData.projectCostHeads.length > 0) {
                    logger.info('Project service, syncWithRateAnalysisData building Only.');
                    _this.updateCostHeadsForBuildingAndProject(callback, projectData, buildingData, buildingId, projectId);
                }
                else {
                    logger.info('Project service, calling promise for syncProjectWithRateAnalysisData for Project and Building.');
                    var syncBuildingCostHeadsPromise = _this.updateBudgetRatesForBuildingCostHeads(Constants.BUILDING, buildingId, projectData, buildingData);
                    var syncProjectCostHeadsPromise = _this.updateBudgetRatesForProjectCostHeads(Constants.AMENITIES, projectId, projectData, buildingData);
                    Promise.all([
                        syncBuildingCostHeadsPromise,
                        syncProjectCostHeadsPromise
                    ]).then(function (data) {
                        logger.info('Promise for syncProjectWithRateAnalysisData for Project and Building success');
                        var buildingCostHeadsData = data[0];
                        var projectCostHeadsData = data[1];
                        callback(null, { status: 200 });
                    })
                        .catch(function (e) { logger.error(' Promise failed for syncProjectWithRateAnalysisData ! :' + JSON.stringify(e)); });
                }
            }
        });
    };
    ProjectService.prototype.updateCostHeadsForBuildingAndProject = function (callback, projectData, buildingData, buildingId, projectId) {
        logger.info('updateCostHeadsForBuildingAndProject has been hit');
        var rateAnalysisService = new RateAnalysisService();
        var buildingRepository = new BuildingRepository();
        var projectRepository = new ProjectRepository();
        rateAnalysisService.convertCostHeadsFromRateAnalysisToCostControl(Constants.BUILDING, function (error, buildingCostHeadsData) {
            if (error) {
                logger.error('Error in updateCostHeadsForBuildingAndProject : convertCostHeadsFromRateAnalysisToCostControl : ' + JSON.stringify(error));
                callback(error, null);
            }
            else {
                logger.info('GetAllDataFromRateAnalysis success');
                var projectService_1 = new ProjectService();
                var data = projectService_1.calculateBudgetCostForBuilding(buildingCostHeadsData, projectData, buildingData);
                var queryForBuilding = { '_id': buildingId };
                var updateCostHead = { $set: { 'costHeads': data } };
                buildingRepository.findOneAndUpdate(queryForBuilding, updateCostHead, { new: true }, function (error, response) {
                    if (error) {
                        logger.error('Error in Update convertCostHeadsFromRateAnalysisToCostControl buildingCostHeadsData  : ' + JSON.stringify(error));
                        callback(error, null);
                    }
                    else {
                        logger.info('UpdateBuildingCostHead success');
                        var projectCostHeads = projectService_1.calculateBudgetCostForCommonAmmenities(projectData.projectCostHeads, projectData, buildingData);
                        var queryForProject = { '_id': projectId };
                        var updateProjectCostHead = { $set: { 'projectCostHeads': projectCostHeads } };
                        logger.info('Calling update project Costheads has been hit');
                        projectRepository.findOneAndUpdate(queryForProject, updateProjectCostHead, { new: true }, function (error, response) {
                            if (error) {
                                logger.err('Error update project Costheads : ' + JSON.stringify(error));
                                callback(error, null);
                            }
                            else {
                                logger.debug('Update project Costheads success');
                                callback(null, response);
                            }
                        });
                    }
                });
            }
        });
    };
    ProjectService.prototype.updateBudgetRatesForBuildingCostHeads = function (entity, buildingId, projectDetails, buildingDetails) {
        return new Promise(function (resolve, reject) {
            var rateAnalysisService = new RateAnalysisService();
            var buildingRepository = new BuildingRepository();
            logger.info('Project service, updateBudgetRatesForBuildingCostHeads promise.');
            rateAnalysisService.convertCostHeadsFromRateAnalysisToCostControl(entity, function (error, buildingCostHeadsData) {
                if (error) {
                    logger.err('Error in promise updateBudgetRatesForBuildingCostHeads : ' + JSON.stringify(error));
                    reject(error);
                }
                else {
                    var projectService = new ProjectService();
                    var buildingCostHeads = projectService.calculateBudgetCostForBuilding(buildingCostHeadsData, projectDetails, buildingDetails);
                    var query = { '_id': buildingId };
                    var newData = { $set: { 'costHeads': buildingCostHeads } };
                    buildingRepository.findOneAndUpdate(query, newData, { new: true }, function (error, response) {
                        logger.info('Project service, getAllDataFromRateAnalysis has been hit');
                        if (error) {
                            logger.error('Error in Update buildingCostHeadsData  : ' + JSON.stringify(error));
                            reject(error);
                        }
                        else {
                            logger.debug('Updated buildingCostHeadsData');
                            resolve('Done');
                        }
                    });
                }
            });
        });
    };
    ProjectService.prototype.updateBudgetRatesForProjectCostHeads = function (entity, projectId, projectDetails, buildingDetails) {
        return new Promise(function (resolve, reject) {
            var rateAnalysisService = new RateAnalysisService();
            var projectRepository = new ProjectRepository();
            logger.info('Project service, updateBudgetRatesForProjectCostHeads promise.');
            rateAnalysisService.convertCostHeadsFromRateAnalysisToCostControl(entity, function (error, projectCostHeadsData) {
                if (error) {
                    logger.err('Error in updateBudgetRatesForProjectCostHeads promise : ' + JSON.stringify(error));
                    reject(error);
                }
                else {
                    var projectService = new ProjectService();
                    var projectCostHeads = projectService.calculateBudgetCostForCommonAmmenities(projectCostHeadsData, projectDetails, buildingDetails);
                    var query = { '_id': projectId };
                    var newData = { $set: { 'projectCostHeads': projectCostHeads } };
                    projectRepository.findOneAndUpdate(query, newData, { new: true }, function (error, response) {
                        logger.info('Project service, getAllDataFromRateAnalysis has been hit');
                        if (error) {
                            logger.error('Error in Update buildingCostHeadsData  : ' + JSON.stringify(error));
                            reject(error);
                        }
                        else {
                            logger.debug('Updated projectCostHeads');
                            resolve('Done');
                        }
                    });
                }
            });
        });
    };
    ProjectService.prototype.calculateBudgetCostForBuilding = function (costHeadsRateAnalysis, projectDetails, buildingDetails) {
        logger.info('Project service, calculateBudgetCostForBuilding has been hit');
        var costHeads = new Array();
        var budgetedCostAmount;
        var calculateBudgtedCost;
        for (var _i = 0, costHeadsRateAnalysis_1 = costHeadsRateAnalysis; _i < costHeadsRateAnalysis_1.length; _i++) {
            var costHead = costHeadsRateAnalysis_1[_i];
            var budgetCostFormulae = void 0;
            switch (costHead.name) {
                case Constants.RCC_BAND_OR_PATLI: {
                    budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
                    calculateBudgtedCost = budgetCostFormulae.replace(Constants.SLAB_AREA, projectDetails.slabArea);
                    budgetedCostAmount = eval(calculateBudgtedCost);
                    this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
                    break;
                }
                case Constants.EXTERNAL_PLASTER: {
                    budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
                    calculateBudgtedCost = budgetCostFormulae.replace(Constants.CARPET_AREA, buildingDetails.totalCarpetAreaOfUnit);
                    budgetedCostAmount = eval(calculateBudgtedCost);
                    this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
                    break;
                }
                case Constants.FABRICATION: {
                    budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
                    calculateBudgtedCost = budgetCostFormulae.replace(Constants.CARPET_AREA, buildingDetails.totalCarpetAreaOfUnit);
                    budgetedCostAmount = eval(calculateBudgtedCost);
                    this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
                    break;
                }
                case Constants.POINTING: {
                    budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
                    calculateBudgtedCost = budgetCostFormulae.replace(Constants.CARPET_AREA, buildingDetails.totalCarpetAreaOfUnit);
                    budgetedCostAmount = eval(calculateBudgtedCost);
                    this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
                    break;
                }
                case Constants.KITCHEN_OTTA: {
                    budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
                    calculateBudgtedCost = budgetCostFormulae.replace(Constants.NUM_OF_ONE_BHK, buildingDetails.numOfOneBHK)
                        .replace(Constants.NUM_OF_TWO_BHK, buildingDetails.numOfTwoBHK)
                        .replace(Constants.NUM_OF_THREE_BHK, buildingDetails.numOfThreeBHK)
                        .replace(Constants.NUM_OF_FOUR_BHK, buildingDetails.numOfFourBHK)
                        .replace(Constants.NUM_OF_FIVE_BHK, buildingDetails.numOfFiveBHK);
                    budgetedCostAmount = eval(calculateBudgtedCost);
                    this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
                    break;
                }
                case Constants.SOLING: {
                    budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
                    calculateBudgtedCost = budgetCostFormulae.replace(Constants.PLINTH_AREA, buildingDetails.plinthArea);
                    budgetedCostAmount = eval(calculateBudgtedCost);
                    this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
                    break;
                }
                case Constants.MASONRY: {
                    budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
                    calculateBudgtedCost = budgetCostFormulae.replace(Constants.CARPET_AREA, buildingDetails.totalCarpetAreaOfUnit);
                    budgetedCostAmount = eval(calculateBudgtedCost);
                    this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
                    break;
                }
                case Constants.INTERNAL_PLASTER: {
                    budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
                    calculateBudgtedCost = budgetCostFormulae.replace(Constants.CARPET_AREA, buildingDetails.totalCarpetAreaOfUnit);
                    budgetedCostAmount = eval(calculateBudgtedCost);
                    this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
                    break;
                }
                case Constants.GYPSUM_OR_POP_PLASTER: {
                    budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
                    calculateBudgtedCost = budgetCostFormulae.replace(Constants.CARPET_AREA, buildingDetails.totalCarpetAreaOfUnit);
                    budgetedCostAmount = eval(calculateBudgtedCost);
                    this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
                    break;
                }
                default: {
                    break;
                }
            }
        }
        return costHeads;
    };
    ProjectService.prototype.calculateBudgetCostForCommonAmmenities = function (costHeadsRateAnalysis, projectDetails, buildingDetails) {
        logger.info('Project service, calculateBudgetCostForCommonAmmenities has been hit');
        var costHeads = new Array();
        var budgetedCostAmount;
        var budgetCostFormulae;
        var calculateBudgtedCost;
        var calculateProjectData = 'SELECT SUM(building.totalCarpetAreaOfUnit) AS totalCarpetArea, ' +
            'SUM(building.totalSlabArea) AS totalSlabAreaProject,' +
            'SUM(building.totalSaleableAreaOfUnit) AS totalSaleableArea  FROM ? AS building';
        var projectData = alasql(calculateProjectData, [projectDetails.buildings]);
        var totalSlabAreaOfProject = projectData[0].totalSlabAreaProject;
        var totalSaleableAreaOfProject = projectData[0].totalSaleableArea;
        var totalCarpetAreaOfProject = projectData[0].totalCarpetArea;
        for (var _i = 0, costHeadsRateAnalysis_2 = costHeadsRateAnalysis; _i < costHeadsRateAnalysis_2.length; _i++) {
            var costHead = costHeadsRateAnalysis_2[_i];
            switch (costHead.name) {
                case Constants.SAFETY_MEASURES: {
                    budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
                    calculateBudgtedCost = budgetCostFormulae.replace(Constants.CARPET_AREA, totalCarpetAreaOfProject);
                    budgetedCostAmount = eval(calculateBudgtedCost);
                    this.calculateThumbRuleReportForProjectCostHead(budgetedCostAmount, costHead, projectDetails, costHeads);
                    break;
                }
                default: {
                    break;
                }
            }
        }
        return costHeads;
    };
    ProjectService.prototype.calculateThumbRuleReportForCostHead = function (budgetedCostAmount, costHeadFromRateAnalysis, buildingData, costHeads) {
        if (budgetedCostAmount) {
            logger.info('Project service, calculateThumbRuleReportForCostHead has been hit');
            var costHead = costHeadFromRateAnalysis;
            costHead.budgetedCostAmount = budgetedCostAmount;
            var thumbRuleRate = new ThumbRuleRate();
            thumbRuleRate.saleableArea = this.calculateThumbRuleRateForArea(budgetedCostAmount, buildingData.totalSaleableAreaOfUnit);
            thumbRuleRate.slabArea = this.calculateThumbRuleRateForArea(budgetedCostAmount, buildingData.totalSlabArea);
            thumbRuleRate.carpetArea = this.calculateThumbRuleRateForArea(budgetedCostAmount, buildingData.totalCarpetAreaOfUnit);
            costHead.thumbRuleRate = thumbRuleRate;
            costHeads.push(costHead);
        }
    };
    ProjectService.prototype.calculateThumbRuleReportForProjectCostHead = function (budgetedCostAmount, costHeadFromRateAnalysis, projectDetails, costHeads) {
        if (budgetedCostAmount) {
            logger.info('Project service, calculateThumbRuleReportForProjectCostHead has been hit');
            var calculateProjectData = 'SELECT SUM(building.totalCarpetAreaOfUnit) AS totalCarpetArea, ' +
                'SUM(building.totalSlabArea) AS totalSlabAreaProject,' +
                'SUM(building.totalSaleableAreaOfUnit) AS totalSaleableArea  FROM ? AS building';
            var projectData = alasql(calculateProjectData, [projectDetails.buildings]);
            var totalSlabAreaOfProject = projectData[0].totalSlabAreaProject;
            var totalSaleableAreaOfProject = projectData[0].totalSaleableArea;
            var totalCarpetAreaOfProject = projectData[0].totalCarpetArea;
            var costHead = costHeadFromRateAnalysis;
            costHead.budgetedCostAmount = budgetedCostAmount;
            var thumbRuleRate = new ThumbRuleRate();
            thumbRuleRate.saleableArea = this.calculateThumbRuleRateForArea(budgetedCostAmount, totalSaleableAreaOfProject);
            thumbRuleRate.slabArea = this.calculateThumbRuleRateForArea(budgetedCostAmount, totalSlabAreaOfProject);
            thumbRuleRate.carpetArea = this.calculateThumbRuleRateForArea(budgetedCostAmount, totalCarpetAreaOfProject);
            costHead.thumbRuleRate = thumbRuleRate;
            costHeads.push(costHead);
        }
    };
    ProjectService.prototype.calculateThumbRuleRateForArea = function (budgetedCostAmount, area) {
        logger.info('Project service, calculateThumbRuleRateForArea has been hit');
        var budgetCostRates = new BudgetCostRates();
        budgetCostRates.sqft = (budgetedCostAmount / area);
        budgetCostRates.sqmt = (budgetCostRates.sqft * config.get(Constants.SQUARE_METER));
        return budgetCostRates;
    };
    return ProjectService;
}());
Object.seal(ProjectService);
module.exports = ProjectService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHBsaWNhdGlvblByb2plY3Qvc2VydmljZXMvUHJvamVjdFNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhFQUFpRjtBQUNqRixnRkFBbUY7QUFDbkYsb0VBQXVFO0FBQ3ZFLGtFQUFxRTtBQUlyRSw2RUFBZ0Y7QUFDaEYsOEVBQWlGO0FBQ2pGLDBFQUE2RTtBQUU3RSxnRUFBbUU7QUFDbkUsd0VBQTJFO0FBRTNFLDJEQUE4RDtBQUM5RCx3RUFBMkU7QUFDM0UsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQiwrQkFBa0M7QUFDbEMsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2pDLHFGQUF3RjtBQUN4RixpRkFBb0Y7QUFDcEYscUVBQXdFO0FBQ3hFLElBQUksTUFBTSxHQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUUvQztJQVdFO1FBQ0UsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksaUJBQWlCLEVBQUUsQ0FBQztRQUNqRCxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxrQkFBa0IsRUFBRSxDQUFDO1FBQ25ELElBQUksQ0FBQyxRQUFRLEdBQUcsWUFBWSxDQUFDLFFBQVEsQ0FBQztRQUN0QyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksZUFBZSxFQUFFLENBQUM7UUFDN0MsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO0lBQ3ZDLENBQUM7SUFFRCxzQ0FBYSxHQUFiLFVBQWMsSUFBYSxFQUFFLElBQVcsRUFBRSxRQUEyQztRQUFyRixpQkEyQkM7UUExQkMsRUFBRSxDQUFBLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNiLFFBQVEsQ0FBQyxJQUFJLHFCQUFxQixDQUFDLGtC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QkFBUyxjQUFjLENBQUMiLCJmaWxlIjoiYXBwL2FwcGxpY2F0aW9uUHJvamVjdC9zZXJ2aWNlcy9Qcm9qZWN0U2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQcm9qZWN0UmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9Qcm9qZWN0UmVwb3NpdG9yeScpO1xyXG5pbXBvcnQgQnVpbGRpbmdSZXBvc2l0b3J5ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L0J1aWxkaW5nUmVwb3NpdG9yeScpO1xyXG5pbXBvcnQgVXNlclNlcnZpY2UgPSByZXF1aXJlKCcuLy4uLy4uL2ZyYW1ld29yay9zZXJ2aWNlcy9Vc2VyU2VydmljZScpO1xyXG5pbXBvcnQgUHJvamVjdEFzc2V0ID0gcmVxdWlyZSgnLi4vLi4vZnJhbWV3b3JrL3NoYXJlZC9wcm9qZWN0YXNzZXQnKTtcclxuaW1wb3J0IFVzZXIgPSByZXF1aXJlKCcuLi8uLi9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9tb25nb29zZS91c2VyJyk7XHJcbmltcG9ydCBQcm9qZWN0ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb25nb29zZS9Qcm9qZWN0Jyk7XHJcbmltcG9ydCBCdWlsZGluZyA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9uZ29vc2UvQnVpbGRpbmcnKTtcclxuaW1wb3J0IEJ1aWxkaW5nTW9kZWwgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3Byb2plY3QvYnVpbGRpbmcvQnVpbGRpbmcnKTtcclxuaW1wb3J0IEF1dGhJbnRlcmNlcHRvciA9IHJlcXVpcmUoJy4uLy4uL2ZyYW1ld29yay9pbnRlcmNlcHRvci9hdXRoLmludGVyY2VwdG9yJyk7XHJcbmltcG9ydCBDb3N0Q29udHJvbGxFeGNlcHRpb24gPSByZXF1aXJlKCcuLi9leGNlcHRpb24vQ29zdENvbnRyb2xsRXhjZXB0aW9uJyk7XHJcbmltcG9ydCBRdWFudGl0eSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9idWlsZGluZy9RdWFudGl0eScpO1xyXG5pbXBvcnQgUmF0ZSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9idWlsZGluZy9SYXRlJyk7XHJcbmltcG9ydCBDb3N0SGVhZCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9idWlsZGluZy9Db3N0SGVhZCcpO1xyXG5pbXBvcnQgV29ya0l0ZW0gPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3Byb2plY3QvYnVpbGRpbmcvV29ya0l0ZW0nKTtcclxuaW1wb3J0IFJhdGVBbmFseXNpc1NlcnZpY2UgPSByZXF1aXJlKCcuL1JhdGVBbmFseXNpc1NlcnZpY2UnKTtcclxuaW1wb3J0IENhdGVnb3J5ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L2J1aWxkaW5nL0NhdGVnb3J5Jyk7XHJcbmxldCBjb25maWcgPSByZXF1aXJlKCdjb25maWcnKTtcclxubGV0IGxvZzRqcyA9IHJlcXVpcmUoJ2xvZzRqcycpO1xyXG5pbXBvcnQgYWxhc3FsID0gcmVxdWlyZSgnYWxhc3FsJyk7XHJcbnZhciBQcm9taXNlID0gcmVxdWlyZSgncHJvbWlzZScpO1xyXG5pbXBvcnQgQnVkZ2V0Q29zdFJhdGVzID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L3JlcG9ydHMvQnVkZ2V0Q29zdFJhdGVzJyk7XHJcbmltcG9ydCBUaHVtYlJ1bGVSYXRlID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L3JlcG9ydHMvVGh1bWJSdWxlUmF0ZScpO1xyXG5pbXBvcnQgQ29uc3RhbnRzID0gcmVxdWlyZSgnLi4vLi4vYXBwbGljYXRpb25Qcm9qZWN0L3NoYXJlZC9jb25zdGFudHMnKTtcclxubGV0IGxvZ2dlcj1sb2c0anMuZ2V0TG9nZ2VyKCdQcm9qZWN0IHNlcnZpY2UnKTtcclxuXHJcbmNsYXNzIFByb2plY3RTZXJ2aWNlIHtcclxuICBBUFBfTkFNRTogc3RyaW5nO1xyXG4gIGNvbXBhbnlfbmFtZTogc3RyaW5nO1xyXG4gIGNvc3RIZWFkSWQ6IG51bWJlcjtcclxuICBjYXRlZ29yeUlkOiBudW1iZXI7XHJcbiAgd29ya0l0ZW1JZDogbnVtYmVyO1xyXG4gIHByaXZhdGUgcHJvamVjdFJlcG9zaXRvcnk6IFByb2plY3RSZXBvc2l0b3J5O1xyXG4gIHByaXZhdGUgYnVpbGRpbmdSZXBvc2l0b3J5OiBCdWlsZGluZ1JlcG9zaXRvcnk7XHJcbiAgcHJpdmF0ZSBhdXRoSW50ZXJjZXB0b3I6IEF1dGhJbnRlcmNlcHRvcjtcclxuICBwcml2YXRlIHVzZXJTZXJ2aWNlIDogVXNlclNlcnZpY2U7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5wcm9qZWN0UmVwb3NpdG9yeSA9IG5ldyBQcm9qZWN0UmVwb3NpdG9yeSgpO1xyXG4gICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkgPSBuZXcgQnVpbGRpbmdSZXBvc2l0b3J5KCk7XHJcbiAgICB0aGlzLkFQUF9OQU1FID0gUHJvamVjdEFzc2V0LkFQUF9OQU1FO1xyXG4gICAgdGhpcy5hdXRoSW50ZXJjZXB0b3IgPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XHJcbiAgICB0aGlzLnVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgfVxyXG5cclxuICBjcmVhdGVQcm9qZWN0KGRhdGE6IFByb2plY3QsIHVzZXIgOiBVc2VyLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBpZighdXNlci5faWQpIHtcclxuICAgICAgY2FsbGJhY2sobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbignVXNlcklkIE5vdCBGb3VuZCcsbnVsbCksIG51bGwpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMucHJvamVjdFJlcG9zaXRvcnkuY3JlYXRlKGRhdGEsIChlcnIsIHJlcykgPT4ge1xyXG4gICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBjcmVhdGUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgICAgbG9nZ2VyLmRlYnVnKCdQcm9qZWN0IElEIDogJytyZXMuX2lkKTtcclxuICAgICAgICBsb2dnZXIuZGVidWcoJ1Byb2plY3QgTmFtZSA6ICcrcmVzLm5hbWUpO1xyXG4gICAgICAgIGxldCBwcm9qZWN0SWQgPSByZXMuX2lkO1xyXG4gICAgICAgIGxldCBuZXdEYXRhID0gIHskcHVzaDogeyBwcm9qZWN0OiBwcm9qZWN0SWQgfX07XHJcbiAgICAgICAgbGV0IHF1ZXJ5ID0ge19pZCA6IHVzZXIuX2lkfTtcclxuICAgICAgICB0aGlzLnVzZXJTZXJ2aWNlLmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIG5ld0RhdGEsIHtuZXcgOnRydWV9LChlcnIsIHJlc3ApID0+IHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGZpbmRPbmVBbmRVcGRhdGUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgICAgICBpZihlcnIpIHtcclxuICAgICAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGRlbGV0ZSByZXMuY2F0ZWdvcnk7XHJcbiAgICAgICAgICAgIGRlbGV0ZSByZXMucmF0ZTtcclxuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRQcm9qZWN0QnlJZCggcHJvamVjdElkIDogc3RyaW5nLCB1c2VyOiBVc2VyLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBsZXQgcXVlcnkgPSB7IF9pZDogcHJvamVjdElkfTtcclxuICAgIGxldCBwb3B1bGF0ZSA9IHtwYXRoIDogJ2J1aWxkaW5nJywgc2VsZWN0OiBbJ25hbWUnICwgJ3RvdGFsU2xhYkFyZWEnLF19O1xyXG4gICAgdGhpcy5wcm9qZWN0UmVwb3NpdG9yeS5maW5kQW5kUG9wdWxhdGUocXVlcnksIHBvcHVsYXRlLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kQW5kUG9wdWxhdGUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGxvZ2dlci5kZWJ1ZygnUHJvamVjdCBOYW1lIDogJytyZXN1bHRbMF0ubmFtZSk7XHJcbiAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwseyBkYXRhOiByZXN1bHQsIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRQcm9qZWN0QW5kQnVpbGRpbmdEZXRhaWxzKCBwcm9qZWN0SWQgOiBzdHJpbmcsIGJ1aWxkaW5nSWQ6IHN0cmluZywgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZ2V0UHJvamVjdEFuZEJ1aWxkaW5nRGV0YWlscyBmb3Igc3luYyB3aXRoIHJhdGVBbmFseXNpcyBoYXMgYmVlbiBoaXQnKTtcclxuICAgIGxldCBxdWVyeSA9IHsgX2lkOiBwcm9qZWN0SWR9O1xyXG4gICAgbGV0IHBvcHVsYXRlID0ge3BhdGggOiAnYnVpbGRpbmdzJ307XHJcbiAgICB0aGlzLnByb2plY3RSZXBvc2l0b3J5LmZpbmRBbmRQb3B1bGF0ZShxdWVyeSwgcG9wdWxhdGUsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGZpbmRBbmRQb3B1bGF0ZSBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbG9nZ2VyLmRlYnVnKCdQcm9qZWN0IE5hbWUgOiAnK3Jlc3VsdFswXS5uYW1lKTtcclxuICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICBsb2dnZXIuZXJyb3IoJ1Byb2plY3Qgc2VydmljZSwgZ2V0UHJvamVjdEFuZEJ1aWxkaW5nRGV0YWlscyBmaW5kQW5kUG9wdWxhdGUgZmFpbGVkICcrSlNPTi5zdHJpbmdpZnkoZXJyb3IpKTtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbG9nZ2VyLmRlYnVnKCdnZXRQcm9qZWN0QW5kQnVpbGRpbmdEZXRhaWxzIHN1Y2Nlc3MuJyk7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCx7IGRhdGE6IHJlc3VsdCB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVQcm9qZWN0QnlJZCggcHJvamVjdERldGFpbHM6IFByb2plY3QsIHVzZXI6IFVzZXIsIGNhbGxiYWNrOihlcnJvcjogYW55LCByZXN1bHQ6YW55KSA9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCB1cGRhdGVQcm9qZWN0RGV0YWlscyBoYXMgYmVlbiBoaXQnKTtcclxuICAgIGxldCBxdWVyeSA9IHsgX2lkIDogcHJvamVjdERldGFpbHMuX2lkIH07XHJcbiAgICBkZWxldGUgcHJvamVjdERldGFpbHMuX2lkO1xyXG5cclxuICAgIHRoaXMucHJvamVjdFJlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgcHJvamVjdERldGFpbHMsIHtuZXc6IHRydWV9LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kT25lQW5kVXBkYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGE6IHJlc3VsdCwgYWNjZXNzX3Rva2VuOiB0aGlzLmF1dGhJbnRlcmNlcHRvci5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKX0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGNyZWF0ZUJ1aWxkaW5nKHByb2plY3RJZCA6IHN0cmluZywgYnVpbGRpbmdEZXRhaWxzIDogQnVpbGRpbmcsIHVzZXI6IFVzZXIsIGNhbGxiYWNrOihlcnJvcjogYW55LCByZXN1bHQ6IGFueSk9PiB2b2lkKSB7XHJcbiAgICB0aGlzLmJ1aWxkaW5nUmVwb3NpdG9yeS5jcmVhdGUoYnVpbGRpbmdEZXRhaWxzLCAoZXJyb3IsIHJlc3VsdCk9PiB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGNyZWF0ZSBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IHF1ZXJ5ID0ge19pZCA6IHByb2plY3RJZCB9O1xyXG4gICAgICAgIGxldCBuZXdEYXRhID0geyAkcHVzaDoge2J1aWxkaW5ncyA6IHJlc3VsdC5faWR9fTtcclxuICAgICAgICB0aGlzLnByb2plY3RSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIG5ld0RhdGEsIHtuZXcgOiB0cnVlfSwgKGVycm9yLCBzdGF0dXMpPT4ge1xyXG4gICAgICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZmluZE9uZUFuZFVwZGF0ZSBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiByZXN1bHQsIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVCdWlsZGluZ0J5SWQoIGJ1aWxkaW5nSWQ6c3RyaW5nLCBidWlsZGluZ0RldGFpbHM6YW55LCB1c2VyOlVzZXIsIGNhbGxiYWNrOihlcnJvcjogYW55LCByZXN1bHQ6IGFueSk9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCB1cGRhdGVCdWlsZGluZyBoYXMgYmVlbiBoaXQnKTtcclxuICAgIGxldCBxdWVyeSA9IHsgX2lkIDogYnVpbGRpbmdJZCB9O1xyXG4gICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgYnVpbGRpbmdEZXRhaWxzLHtuZXc6IHRydWV9LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kT25lQW5kVXBkYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGE6IHJlc3VsdCwgYWNjZXNzX3Rva2VuOiB0aGlzLmF1dGhJbnRlcmNlcHRvci5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKX0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGNsb25lQnVpbGRpbmdEZXRhaWxzKCBidWlsZGluZ0lkOnN0cmluZywgYnVpbGRpbmdEZXRhaWxzOmFueSwgdXNlcjpVc2VyLCBjYWxsYmFjazooZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpPT4gdm9pZCkge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgY2xvbmVCdWlsZGluZ0RldGFpbHMgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICBsZXQgcXVlcnkgPSB7IF9pZCA6IGJ1aWxkaW5nSWQgfTtcclxuICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmZpbmRCeUlkKGJ1aWxkaW5nSWQsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGZpbmRCeUlkIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IGNsb25lZENvc3RIZWFkRGV0YWlscyA6QXJyYXk8Q29zdEhlYWQ+PVtdO1xyXG4gICAgICAgIGxldCBjb3N0SGVhZHMgPWJ1aWxkaW5nRGV0YWlscy5jb3N0SGVhZHM7XHJcbiAgICAgICAgbGV0IHJlc3VsdENvc3RIZWFkcyA9IHJlc3VsdC5jb3N0SGVhZHM7XHJcbiAgICAgICAgZm9yKGxldCBjb3N0SGVhZCBvZiBjb3N0SGVhZHMpIHtcclxuICAgICAgICAgIGZvcihsZXQgcmVzdWx0Q29zdEhlYWQgb2YgcmVzdWx0Q29zdEhlYWRzKSB7XHJcbiAgICAgICAgICAgIGlmKGNvc3RIZWFkLm5hbWUgPT09IHJlc3VsdENvc3RIZWFkLm5hbWUpIHtcclxuICAgICAgICAgICAgICBsZXQgY2xvbmVkQ29zdEhlYWQgPSBuZXcgQ29zdEhlYWQ7XHJcbiAgICAgICAgICAgICAgY2xvbmVkQ29zdEhlYWQubmFtZSA9IHJlc3VsdENvc3RIZWFkLm5hbWU7XHJcbiAgICAgICAgICAgICAgY2xvbmVkQ29zdEhlYWQucmF0ZUFuYWx5c2lzSWQgPSByZXN1bHRDb3N0SGVhZC5yYXRlQW5hbHlzaXNJZDtcclxuICAgICAgICAgICAgICBjbG9uZWRDb3N0SGVhZC5hY3RpdmUgPSBjb3N0SGVhZC5hY3RpdmU7XHJcbiAgICAgICAgICAgICAgY2xvbmVkQ29zdEhlYWQudGh1bWJSdWxlUmF0ZSA9IHJlc3VsdENvc3RIZWFkLnRodW1iUnVsZVJhdGU7XHJcblxyXG4gICAgICAgICAgICAgIGlmKGNvc3RIZWFkLmFjdGl2ZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBjYXRlZ29yeUxpc3QgPSBjb3N0SGVhZC5jYXRlZ29yeTtcclxuICAgICAgICAgICAgICAgIGxldCByZXN1bHRDYXRlZ29yeUxpc3QgPSByZXN1bHRDb3N0SGVhZC5jYXRlZ29yaWVzO1xyXG4gICAgICAgICAgICAgICAgZm9yKGxldCByZXN1bHRDYXRlZ29yeUluZGV4PTA7IHJlc3VsdENhdGVnb3J5SW5kZXg8cmVzdWx0Q2F0ZWdvcnlMaXN0Lmxlbmd0aDsgcmVzdWx0Q2F0ZWdvcnlJbmRleCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgIGZvcihsZXQgY2F0ZWdvcnlJbmRleD0wIDsgY2F0ZWdvcnlJbmRleDxjYXRlZ29yeUxpc3QubGVuZ3RoOyBjYXRlZ29yeUluZGV4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZihjYXRlZ29yeUxpc3RbY2F0ZWdvcnlJbmRleF0ubmFtZSA9PT0gcmVzdWx0Q2F0ZWdvcnlMaXN0W3Jlc3VsdENhdGVnb3J5SW5kZXhdLm5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIGlmKCFjYXRlZ29yeUxpc3RbY2F0ZWdvcnlJbmRleF0uYWN0aXZlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdENhdGVnb3J5TGlzdC5zcGxpY2UocmVzdWx0Q2F0ZWdvcnlJbmRleCwxKTtcclxuICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXN1bHRXb3JraXRlbUxpc3QgPSByZXN1bHRDYXRlZ29yeUxpc3RbcmVzdWx0Q2F0ZWdvcnlJbmRleF0ud29ya0l0ZW1zO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgd29ya0l0ZW1MaXN0ID0gY2F0ZWdvcnlMaXN0W2NhdGVnb3J5SW5kZXhdLndvcmtJdGVtcztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcihsZXQgcmVzdWx0V29ya2l0ZW1JbmRleD0wOyAgcmVzdWx0V29ya2l0ZW1JbmRleCA8IHJlc3VsdFdvcmtpdGVtTGlzdC5sZW5ndGg7IHJlc3VsdFdvcmtpdGVtSW5kZXgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGZvcihsZXQgd29ya2l0ZW1JbmRleD0wOyAgd29ya2l0ZW1JbmRleCA8IHdvcmtJdGVtTGlzdC5sZW5ndGg7IHdvcmtpdGVtSW5kZXgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoIXdvcmtJdGVtTGlzdFt3b3JraXRlbUluZGV4XS5hY3RpdmUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0V29ya2l0ZW1MaXN0LnNwbGljZShyZXN1bHRXb3JraXRlbUluZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNsb25lZENvc3RIZWFkLmNhdGVnb3JpZXMgPSByZXN1bHRDb3N0SGVhZC5jYXRlZ29yaWVzO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjbG9uZWRDb3N0SGVhZC5jYXRlZ29yaWVzID0gcmVzdWx0Q29zdEhlYWQuY2F0ZWdvcmllcztcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjbG9uZWRDb3N0SGVhZERldGFpbHMucHVzaChjbG9uZWRDb3N0SGVhZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCB1cGRhdGVCdWlsZGluZ0Nvc3RIZWFkcyA9IHsnY29zdEhlYWRzJyA6IGNsb25lZENvc3RIZWFkRGV0YWlsc307XHJcbiAgICAgICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgdXBkYXRlQnVpbGRpbmdDb3N0SGVhZHMse25ldzogdHJ1ZX0sIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kT25lQW5kVXBkYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiByZXN1bHQsIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRCdWlsZGluZ0J5SWQocHJvamVjdElkIDogc3RyaW5nLCBidWlsZGluZ0lkIDogc3RyaW5nLCB1c2VyOiBVc2VyLCBjYWxsYmFjazooZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpPT4gdm9pZCkge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZ2V0QnVpbGRpbmcgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICB0aGlzLmJ1aWxkaW5nUmVwb3NpdG9yeS5maW5kQnlJZChidWlsZGluZ0lkLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kQnlJZCBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiByZXN1bHQsIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRJbkFjdGl2ZUNvc3RIZWFkKHByb2plY3RJZDogc3RyaW5nLCBidWlsZGluZ0lkOiBzdHJpbmcsIHVzZXI6IFVzZXIsIGNhbGxiYWNrOihlcnJvcjogYW55LCByZXN1bHQ6IGFueSk9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBnZXRJbkFjdGl2ZUNvc3RIZWFkIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZEJ5SWQoYnVpbGRpbmdJZCwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGZpbmRCeUlkIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICAgIGxvZ2dlci5kZWJ1ZygnZ2V0dGluZyBJbkFjdGl2ZSBDb3N0SGVhZCBmb3IgQnVpbGRpbmcgTmFtZSA6ICcrcmVzdWx0Lm5hbWUpO1xyXG4gICAgICAgIGxldCByZXNwb25zZSA9IHJlc3VsdC5jb3N0SGVhZHM7XHJcbiAgICAgICAgbGV0IGluQWN0aXZlQ29zdEhlYWQ9W107XHJcbiAgICAgICAgZm9yKGxldCBjb3N0SGVhZEl0ZW0gb2YgcmVzcG9uc2UpIHtcclxuICAgICAgICAgIGlmKCFjb3N0SGVhZEl0ZW0uYWN0aXZlKSB7XHJcbiAgICAgICAgICAgIGluQWN0aXZlQ29zdEhlYWQucHVzaChjb3N0SGVhZEl0ZW0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjYWxsYmFjayhudWxsLHtkYXRhOmluQWN0aXZlQ29zdEhlYWQsIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRJbkFjdGl2ZVdvcmtJdGVtc09mQnVpbGRpbmdDb3N0SGVhZHMocHJvamVjdElkOnN0cmluZywgYnVpbGRpbmdJZDpzdHJpbmcsIGNvc3RIZWFkSWQ6bnVtYmVyLCBjYXRlZ29yeUlkOm51bWJlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcjpVc2VyLCBjYWxsYmFjazooZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpPT4gdm9pZCkge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgYWRkIFdvcmtpdGVtIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZEJ5SWQoYnVpbGRpbmdJZCwgKGVycm9yLCBidWlsZGluZzpCdWlsZGluZykgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IGNvc3RIZWFkTGlzdCA9IGJ1aWxkaW5nLmNvc3RIZWFkcztcclxuICAgICAgICBsZXQgY2F0ZWdvcnlMaXN0OiBDYXRlZ29yeVtdO1xyXG4gICAgICAgIGxldCB3b3JrSXRlbUxpc3Q6IFdvcmtJdGVtW107XHJcbiAgICAgICAgbGV0IGluQWN0aXZlV29ya0l0ZW1zID0gW107XHJcblxyXG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBjb3N0SGVhZExpc3QubGVuZ3RoOyBpbmRleCsrKSB7XHJcbiAgICAgICAgICBpZiAoY29zdEhlYWRJZCA9PT0gY29zdEhlYWRMaXN0W2luZGV4XS5yYXRlQW5hbHlzaXNJZCkge1xyXG4gICAgICAgICAgICBjYXRlZ29yeUxpc3QgPSBjb3N0SGVhZExpc3RbaW5kZXhdLmNhdGVnb3JpZXM7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHN1YkNhdGVnb3J5SW5kZXggPSAwOyBzdWJDYXRlZ29yeUluZGV4IDwgY2F0ZWdvcnlMaXN0Lmxlbmd0aDsgc3ViQ2F0ZWdvcnlJbmRleCsrKSB7XHJcbiAgICAgICAgICAgICAgaWYgKGNhdGVnb3J5SWQgPT09IGNhdGVnb3J5TGlzdFtzdWJDYXRlZ29yeUluZGV4XS5yYXRlQW5hbHlzaXNJZCkge1xyXG4gICAgICAgICAgICAgICAgd29ya0l0ZW1MaXN0ID0gY2F0ZWdvcnlMaXN0W3N1YkNhdGVnb3J5SW5kZXhdLndvcmtJdGVtcztcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGNoZWNrV29ya0l0ZW0gb2Ygd29ya0l0ZW1MaXN0KSB7XHJcbiAgICAgICAgICAgICAgICAgIGlmKCFjaGVja1dvcmtJdGVtLmFjdGl2ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGluQWN0aXZlV29ya0l0ZW1zLnB1c2goY2hlY2tXb3JrSXRlbSk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCx7ZGF0YTppbkFjdGl2ZVdvcmtJdGVtcywgYWNjZXNzX3Rva2VuOiB0aGlzLmF1dGhJbnRlcmNlcHRvci5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKX0pO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gR2V0IEluIEFjdGl2ZSBXb3JrSXRlbXMgT2YgUHJvamVjdCBDb3N0IEhlYWRzXHJcbiAgZ2V0SW5BY3RpdmVXb3JrSXRlbXNPZlByb2plY3RDb3N0SGVhZHMocHJvamVjdElkOnN0cmluZywgY29zdEhlYWRJZDpudW1iZXIsIGNhdGVnb3J5SWQ6bnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXI6VXNlciwgY2FsbGJhY2s6KGVycm9yOiBhbnksIHJlc3VsdDogYW55KT0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIEdldCBJbi1BY3RpdmUgV29ya0l0ZW1zIE9mIFByb2plY3QgQ29zdCBIZWFkcyBoYXMgYmVlbiBoaXQnKTtcclxuICAgIHRoaXMucHJvamVjdFJlcG9zaXRvcnkuZmluZEJ5SWQocHJvamVjdElkLCAoZXJyb3IsIHByb2plY3Q6UHJvamVjdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IGNvc3RIZWFkTGlzdCA9IHByb2plY3QucHJvamVjdENvc3RIZWFkcztcclxuICAgICAgICBsZXQgY2F0ZWdvcnlMaXN0OiBDYXRlZ29yeVtdO1xyXG4gICAgICAgIGxldCB3b3JrSXRlbUxpc3Q6IFdvcmtJdGVtW107XHJcbiAgICAgICAgbGV0IGluQWN0aXZlV29ya0l0ZW1zID0gW107XHJcblxyXG4gICAgICAgIGZvciAobGV0IGNvc3RIZWFkIG9mIGNvc3RIZWFkTGlzdCkge1xyXG4gICAgICAgICAgaWYgKGNvc3RIZWFkSWQgPT09IGNvc3RIZWFkLnJhdGVBbmFseXNpc0lkKSB7XHJcbiAgICAgICAgICAgIGNhdGVnb3J5TGlzdCA9IGNvc3RIZWFkLmNhdGVnb3JpZXM7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGNhdGVnb3J5IG9mIGNhdGVnb3J5TGlzdCkge1xyXG4gICAgICAgICAgICAgIGlmIChjYXRlZ29yeUlkID09PSBjYXRlZ29yeS5yYXRlQW5hbHlzaXNJZCkge1xyXG4gICAgICAgICAgICAgICAgd29ya0l0ZW1MaXN0ID0gY2F0ZWdvcnkud29ya0l0ZW1zO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgY2hlY2tXb3JrSXRlbSBvZiB3b3JrSXRlbUxpc3QpIHtcclxuICAgICAgICAgICAgICAgICAgaWYoIWNoZWNrV29ya0l0ZW0uYWN0aXZlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5BY3RpdmVXb3JrSXRlbXMucHVzaChjaGVja1dvcmtJdGVtKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjYWxsYmFjayhudWxsLHtkYXRhOmluQWN0aXZlV29ya0l0ZW1zLCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0QnVpbGRpbmdCeUlkRm9yQ2xvbmUocHJvamVjdElkIDogc3RyaW5nLCBidWlsZGluZ0lkIDogc3RyaW5nLCB1c2VyOiBVc2VyLCBjYWxsYmFjazooZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpPT4gdm9pZCkge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZ2V0Q2xvbmVkQnVpbGRpbmcgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICB0aGlzLmJ1aWxkaW5nUmVwb3NpdG9yeS5maW5kQnlJZChidWlsZGluZ0lkLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kQnlJZCBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCBjbG9uZWRCdWlsZGluZyA9IHJlc3VsdC5jb3N0SGVhZHM7XHJcbiAgICAgICAgbGV0IGJ1aWxkaW5nID0gbmV3IEJ1aWxkaW5nTW9kZWwoKTtcclxuICAgICAgICBidWlsZGluZy5uYW1lID0gcmVzdWx0Lm5hbWU7XHJcbiAgICAgICAgYnVpbGRpbmcudG90YWxTbGFiQXJlYSA9IHJlc3VsdC50b3RhbFNsYWJBcmVhO1xyXG4gICAgICAgIGJ1aWxkaW5nLnRvdGFsQ2FycGV0QXJlYU9mVW5pdCA9IHJlc3VsdC50b3RhbENhcnBldEFyZWFPZlVuaXQ7XHJcbiAgICAgICAgYnVpbGRpbmcudG90YWxTYWxlYWJsZUFyZWFPZlVuaXQgPSByZXN1bHQudG90YWxTYWxlYWJsZUFyZWFPZlVuaXQ7XHJcbiAgICAgICAgYnVpbGRpbmcucGxpbnRoQXJlYSA9IHJlc3VsdC5wbGludGhBcmVhO1xyXG4gICAgICAgIGJ1aWxkaW5nLnRvdGFsTnVtT2ZGbG9vcnMgPSByZXN1bHQudG90YWxOdW1PZkZsb29ycztcclxuICAgICAgICBidWlsZGluZy5udW1PZlBhcmtpbmdGbG9vcnMgPSByZXN1bHQubnVtT2ZQYXJraW5nRmxvb3JzO1xyXG4gICAgICAgIGJ1aWxkaW5nLmNhcnBldEFyZWFPZlBhcmtpbmcgPSByZXN1bHQuY2FycGV0QXJlYU9mUGFya2luZztcclxuICAgICAgICBidWlsZGluZy5udW1PZk9uZUJISyA9IHJlc3VsdC5udW1PZk9uZUJISztcclxuICAgICAgICBidWlsZGluZy5udW1PZlR3b0JISyA9IHJlc3VsdC5udW1PZlR3b0JISztcclxuICAgICAgICBidWlsZGluZy5udW1PZlRocmVlQkhLID0gcmVzdWx0Lm51bU9mVGhyZWVCSEs7XHJcbiAgICAgICAgYnVpbGRpbmcubnVtT2ZGb3VyQkhLID0gcmVzdWx0Lm51bU9mRm91ckJISztcclxuICAgICAgICBidWlsZGluZy5udW1PZkZpdmVCSEsgPSByZXN1bHQubnVtT2ZGaXZlQkhLO1xyXG4gICAgICAgIGJ1aWxkaW5nLm51bU9mTGlmdHMgPSByZXN1bHQubnVtT2ZMaWZ0cztcclxuXHJcbiAgICAgICAgLypsZXQgY2xvbmVkQ29zdEhlYWRBcnJheSA6IEFycmF5PENsb25lZENvc3RIZWFkPiA9IFtdO1xyXG5cclxuICAgICAgICBmb3IobGV0IGNvc3RIZWFkSW5kZXggPSAwOyBjb3N0SGVhZEluZGV4IDwgY2xvbmVkQnVpbGRpbmcubGVuZ3RoOyBjb3N0SGVhZEluZGV4KyspIHtcclxuXHJcbiAgICAgICAgICBsZXQgY2xvbmVkQ29zdEhlYWQgPSBuZXcgQ2xvbmVkQ29zdEhlYWQ7XHJcbiAgICAgICAgICBjbG9uZWRDb3N0SGVhZC5uYW1lID0gY2xvbmVkQnVpbGRpbmdbY29zdEhlYWRJbmRleF0ubmFtZTtcclxuICAgICAgICAgIGNsb25lZENvc3RIZWFkLnJhdGVBbmFseXNpc0lkID0gY2xvbmVkQnVpbGRpbmdbY29zdEhlYWRJbmRleF0ucmF0ZUFuYWx5c2lzSWQ7XHJcbiAgICAgICAgICBjbG9uZWRDb3N0SGVhZC5hY3RpdmUgPSBjbG9uZWRCdWlsZGluZ1tjb3N0SGVhZEluZGV4XS5hY3RpdmU7XHJcbiAgICAgICAgICBjbG9uZWRDb3N0SGVhZC5idWRnZXRlZENvc3RBbW91bnQgPSBjbG9uZWRCdWlsZGluZ1tjb3N0SGVhZEluZGV4XS5idWRnZXRlZENvc3RBbW91bnQ7XHJcblxyXG4gICAgICAgICAgbGV0IGNsb25lZFdvcmtJdGVtQXJyYXkgOiBBcnJheTxDbG9uZWRXb3JrSXRlbT4gPSBbXTtcclxuICAgICAgICAgIGxldCBjbG9uZWRDYXRlZ29yeUFycmF5IDogQXJyYXk8Q2xvbmVkQ2F0ZWdvcnk+ID0gW107XHJcbiAgICAgICAgICBsZXQgY2F0ZWdvcnlBcnJheSA9IGNsb25lZEJ1aWxkaW5nW2Nvc3RIZWFkSW5kZXhdLmNhdGVnb3JpZXM7XHJcblxyXG4gICAgICAgICAgZm9yKGxldCBjYXRlZ29yeUluZGV4PTA7IGNhdGVnb3J5SW5kZXg8Y2F0ZWdvcnlBcnJheS5sZW5ndGg7IGNhdGVnb3J5SW5kZXgrKykge1xyXG4gICAgICAgICAgICBsZXQgY2xvbmVkQ2F0ZWdvcnkgPSBuZXcgQ2xvbmVkQ2F0ZWdvcnkoKTtcclxuICAgICAgICAgICAgY2xvbmVkQ2F0ZWdvcnkubmFtZSA9IGNhdGVnb3J5QXJyYXlbY2F0ZWdvcnlJbmRleF0ubmFtZTtcclxuICAgICAgICAgICAgY2xvbmVkQ2F0ZWdvcnkucmF0ZUFuYWx5c2lzSWQgPSBjYXRlZ29yeUFycmF5W2NhdGVnb3J5SW5kZXhdLnJhdGVBbmFseXNpc0lkO1xyXG4gICAgICAgICAgICBjbG9uZWRDYXRlZ29yeS5hbW91bnQgPSBjYXRlZ29yeUFycmF5W2NhdGVnb3J5SW5kZXhdLmFtb3VudDtcclxuICAgICAgICAgICAgY2xvbmVkQ2F0ZWdvcnkuYWN0aXZlID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIGxldCB3b3JraXRlbUFycmF5ID0gY2F0ZWdvcnlBcnJheVtjYXRlZ29yeUluZGV4XS53b3JrSXRlbXM7XHJcbiAgICAgICAgICAgIGZvcihsZXQgd29ya2l0ZW1JbmRleD0wOyB3b3JraXRlbUluZGV4PCB3b3JraXRlbUFycmF5Lmxlbmd0aDsgd29ya2l0ZW1JbmRleCsrKSB7XHJcbiAgICAgICAgICAgICAgbGV0IGNsb25lZFdvcmtJdGVtID0gbmV3IENsb25lZFdvcmtJdGVtKCk7XHJcbiAgICAgICAgICAgICAgY2xvbmVkV29ya0l0ZW0ubmFtZSA9IHdvcmtpdGVtQXJyYXlbd29ya2l0ZW1JbmRleF0ubmFtZTtcclxuICAgICAgICAgICAgICBjbG9uZWRXb3JrSXRlbS5yYXRlQW5hbHlzaXNJZCA9ICB3b3JraXRlbUFycmF5W3dvcmtpdGVtSW5kZXhdLnJhdGVBbmFseXNpc0lkO1xyXG4gICAgICAgICAgICAgIGNsb25lZFdvcmtJdGVtLnVuaXQgPSAgd29ya2l0ZW1BcnJheVt3b3JraXRlbUluZGV4XS51bml0O1xyXG4gICAgICAgICAgICAgIGNsb25lZFdvcmtJdGVtLmFtb3VudCA9IHdvcmtpdGVtQXJyYXlbd29ya2l0ZW1JbmRleF0uYW1vdW50O1xyXG4gICAgICAgICAgICAgIGNsb25lZFdvcmtJdGVtLnJhdGUgPSB3b3JraXRlbUFycmF5W3dvcmtpdGVtSW5kZXhdLnJhdGU7XHJcbiAgICAgICAgICAgICAgY2xvbmVkV29ya0l0ZW0ucXVhbnRpdHkgPSB3b3JraXRlbUFycmF5W3dvcmtpdGVtSW5kZXhdLnF1YW50aXR5O1xyXG4gICAgICAgICAgICAgIGNsb25lZFdvcmtJdGVtQXJyYXkucHVzaChjbG9uZWRXb3JrSXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2xvbmVkQ2F0ZWdvcnkud29ya0l0ZW1zID0gY2xvbmVkV29ya0l0ZW1BcnJheTtcclxuICAgICAgICAgICAgY2xvbmVkQ2F0ZWdvcnlBcnJheS5wdXNoKGNsb25lZENhdGVnb3J5KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNsb25lZENvc3RIZWFkLmNhdGVnb3JpZXMgPSBjbG9uZWRDYXRlZ29yeUFycmF5O1xyXG4gICAgICAgICAgY2xvbmVkQ29zdEhlYWRBcnJheS5wdXNoKGNsb25lZENvc3RIZWFkKTtcclxuICAgICAgICB9Ki9cclxuICAgICAgICBidWlsZGluZy5jb3N0SGVhZHMgPSByZXN1bHQuY29zdEhlYWRzO1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiBidWlsZGluZywgYWNjZXNzX3Rva2VuOiB0aGlzLmF1dGhJbnRlcmNlcHRvci5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKX0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGRlbGV0ZUJ1aWxkaW5nQnlJZChwcm9qZWN0SWQ6c3RyaW5nLCBidWlsZGluZ0lkOnN0cmluZywgdXNlcjpVc2VyLCBjYWxsYmFjazooZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpPT4gdm9pZCkge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZGVsZXRlQnVpbGRpbmcgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICBsZXQgcG9wQnVpbGRpbmdJZCA9IGJ1aWxkaW5nSWQ7XHJcbiAgICB0aGlzLmJ1aWxkaW5nUmVwb3NpdG9yeS5kZWxldGUoYnVpbGRpbmdJZCwgKGVycm9yLCByZXN1bHQpPT4ge1xyXG4gICAgICBpZihlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgcXVlcnkgPSB7X2lkOiBwcm9qZWN0SWR9O1xyXG4gICAgICAgIGxldCBuZXdEYXRhID0geyAkcHVsbDoge2J1aWxkaW5ncyA6IHBvcEJ1aWxkaW5nSWR9fTtcclxuICAgICAgICB0aGlzLnByb2plY3RSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIG5ld0RhdGEsIHtuZXc6IHRydWV9LCAoZXJyb3IsIHN0YXR1cyk9PiB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kT25lQW5kVXBkYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGE6IHN0YXR1cywgYWNjZXNzX3Rva2VuOiB0aGlzLmF1dGhJbnRlcmNlcHRvci5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKX0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldFJhdGUocHJvamVjdElkOnN0cmluZywgYnVpbGRpbmdJZDpzdHJpbmcsIGNvc3RIZWFkSWQ6bnVtYmVyLGNhdGVnb3J5SWQ6bnVtYmVyLCB3b3JrSXRlbUlkOm51bWJlciwgdXNlciA6IFVzZXIsXHJcbiAgICAgICAgICBjYWxsYmFjazooZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpPT4gdm9pZCkge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZ2V0UmF0ZSBoYXMgYmVlbiBoaXQnKTtcclxuXHJcbiAgICBsZXQgcmF0ZUFuYWx5c2lzU2VydmljZXM6IFJhdGVBbmFseXNpc1NlcnZpY2UgPSBuZXcgUmF0ZUFuYWx5c2lzU2VydmljZSgpO1xyXG4gICAgcmF0ZUFuYWx5c2lzU2VydmljZXMuZ2V0UmF0ZSh3b3JrSXRlbUlkLCAoZXJyb3IsIHJhdGVEYXRhKSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgcmF0ZSA6UmF0ZSA9IG5ldyBSYXRlKCk7XHJcbiAgICAgICAgcmF0ZS5yYXRlSXRlbXMgPSByYXRlRGF0YTtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTogcmF0ZURhdGEsIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVSYXRlT2ZCdWlsZGluZ0Nvc3RIZWFkcyhwcm9qZWN0SWQ6c3RyaW5nLCBidWlsZGluZ0lkOnN0cmluZywgY29zdEhlYWRJZDpudW1iZXIsIGNhdGVnb3J5SWQ6bnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdvcmtJdGVtSWQ6bnVtYmVyLCByYXRlIDpSYXRlLCB1c2VyIDogVXNlciwgY2FsbGJhY2s6KGVycm9yOiBhbnksIHJlc3VsdDogYW55KT0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIHVwZGF0ZVJhdGVPZkJ1aWxkaW5nQ29zdEhlYWRzIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZEJ5SWQoYnVpbGRpbmdJZCwgKGVycm9yLCBidWlsZGluZzpCdWlsZGluZykgPT4ge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kQnlJZCBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCBjb3N0SGVhZHMgPSBidWlsZGluZy5jb3N0SGVhZHM7XHJcbiAgICAgICAgZm9yKGxldCBjb3N0SGVhZERhdGEgb2YgY29zdEhlYWRzKSB7XHJcbiAgICAgICAgICBpZihjb3N0SGVhZERhdGEucmF0ZUFuYWx5c2lzSWQgPT09IGNvc3RIZWFkSWQpIHtcclxuICAgICAgICAgICAgZm9yKGxldCBjYXRlZ29yeURhdGEgb2YgY29zdEhlYWREYXRhLmNhdGVnb3JpZXMpIHtcclxuICAgICAgICAgICAgICBpZiAoY2F0ZWdvcnlEYXRhLnJhdGVBbmFseXNpc0lkID09PSBjYXRlZ29yeUlkKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IobGV0IHdvcmtJdGVtRGF0YSBvZiBjYXRlZ29yeURhdGEud29ya0l0ZW1zKSB7XHJcbiAgICAgICAgICAgICAgICAgIGlmICh3b3JrSXRlbURhdGEucmF0ZUFuYWx5c2lzSWQgPT09IHdvcmtJdGVtSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB3b3JrSXRlbURhdGEucmF0ZT1yYXRlO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBxdWVyeSA9IHsnX2lkJyA6IGJ1aWxkaW5nSWR9O1xyXG4gICAgICAgIGxldCBuZXdEYXRhID0geyAkc2V0IDogeydjb3N0SGVhZHMnIDogY29zdEhlYWRzfX07XHJcbiAgICAgICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgbmV3RGF0YSx7bmV3OiB0cnVlfSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTogJ3N1Y2Nlc3MnLCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy9VcGRhdGUgcmF0ZSBvZiBwcm9qZWN0IGNvc3QgaGVhZHNcclxuICB1cGRhdGVSYXRlT2ZQcm9qZWN0Q29zdEhlYWRzKHByb2plY3RJZDpzdHJpbmcsIGNvc3RIZWFkSWQ6bnVtYmVyLGNhdGVnb3J5SWQ6bnVtYmVyLFxyXG4gICAgICAgICAgICAgd29ya0l0ZW1JZDpudW1iZXIsIHJhdGUgOlJhdGUsIHVzZXIgOiBVc2VyLCBjYWxsYmFjazooZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpPT4gdm9pZCkge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgVXBkYXRlIHJhdGUgb2YgcHJvamVjdCBjb3N0IGhlYWRzIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgdGhpcy5wcm9qZWN0UmVwb3NpdG9yeS5maW5kQnlJZChwcm9qZWN0SWQsIChlcnJvciwgcHJvamVjdCA6IFByb2plY3QpID0+IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZmluZEJ5SWQgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgcHJvamVjdENvc3RIZWFkcyA9IHByb2plY3QucHJvamVjdENvc3RIZWFkcztcclxuICAgICAgICBmb3IobGV0IGNvc3RIZWFkRGF0YSBvZiBwcm9qZWN0Q29zdEhlYWRzKSB7XHJcbiAgICAgICAgICBpZihjb3N0SGVhZERhdGEucmF0ZUFuYWx5c2lzSWQgPT09IGNvc3RIZWFkSWQpIHtcclxuICAgICAgICAgICAgZm9yKGxldCBjYXRlZ29yeURhdGEgb2YgY29zdEhlYWREYXRhLmNhdGVnb3JpZXMpIHtcclxuICAgICAgICAgICAgICBpZiAoY2F0ZWdvcnlEYXRhLnJhdGVBbmFseXNpc0lkID09PSBjYXRlZ29yeUlkKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IobGV0IHdvcmtJdGVtRGF0YSBvZiBjYXRlZ29yeURhdGEud29ya0l0ZW1zKSB7XHJcbiAgICAgICAgICAgICAgICAgIGlmICh3b3JrSXRlbURhdGEucmF0ZUFuYWx5c2lzSWQgPT09IHdvcmtJdGVtSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB3b3JrSXRlbURhdGEucmF0ZT1yYXRlO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBxdWVyeSA9IHsnX2lkJyA6IHByb2plY3RJZH07XHJcbiAgICAgICAgbGV0IG5ld0RhdGEgPSB7ICRzZXQgOiB7J3Byb2plY3RDb3N0SGVhZHMnIDogcHJvamVjdENvc3RIZWFkc319O1xyXG4gICAgICAgIHRoaXMucHJvamVjdFJlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgbmV3RGF0YSx7bmV3OiB0cnVlfSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTogJ3N1Y2Nlc3MnLCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZGVsZXRlUXVhbnRpdHlPZkJ1aWxkaW5nQ29zdEhlYWRzQnlOYW1lKHByb2plY3RJZDpzdHJpbmcsIGJ1aWxkaW5nSWQ6c3RyaW5nLCBjb3N0SGVhZElkOnN0cmluZywgY2F0ZWdvcnlJZDpzdHJpbmcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdvcmtJdGVtSWQ6c3RyaW5nLCBpdGVtOnN0cmluZywgdXNlcjpVc2VyLCBjYWxsYmFjazooZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpPT4gdm9pZCkge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZGVsZXRlUXVhbnRpdHkgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICB0aGlzLmJ1aWxkaW5nUmVwb3NpdG9yeS5maW5kQnlJZChidWlsZGluZ0lkLCAoZXJyb3IsIGJ1aWxkaW5nOkJ1aWxkaW5nKSA9PiB7XHJcbiAgICAgIGlmIChlcnJvclxyXG4gICAgICApIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IHF1YW50aXR5OiBRdWFudGl0eTtcclxuICAgICAgICAgdGhpcy5jb3N0SGVhZElkID0gcGFyc2VJbnQoY29zdEhlYWRJZCk7XHJcbiAgICAgICAgICB0aGlzLmNhdGVnb3J5SWQgPSBwYXJzZUludChjYXRlZ29yeUlkKTtcclxuICAgICAgICAgIHRoaXMud29ya0l0ZW1JZCA9IHBhcnNlSW50KHdvcmtJdGVtSWQpO1xyXG5cclxuICAgICAgICAgIGZvcihsZXQgaW5kZXggPSAwOyBidWlsZGluZy5jb3N0SGVhZHMubGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIHtcclxuICAgICAgICAgICAgaWYgKGJ1aWxkaW5nLmNvc3RIZWFkc1tpbmRleF0ucmF0ZUFuYWx5c2lzSWQgPT09IHRoaXMuY29zdEhlYWRJZCkge1xyXG4gICAgICAgICAgICAgIGZvciAobGV0IGluZGV4MSA9IDA7IGJ1aWxkaW5nLmNvc3RIZWFkc1tpbmRleF0uY2F0ZWdvcmllcy5sZW5ndGggPiBpbmRleDE7IGluZGV4MSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYnVpbGRpbmcuY29zdEhlYWRzW2luZGV4XS5jYXRlZ29yaWVzW2luZGV4MV0ucmF0ZUFuYWx5c2lzSWQgPT09IHRoaXMuY2F0ZWdvcnlJZCkge1xyXG4gICAgICAgICAgICAgICAgICBmb3IgKGxldCBpbmRleDIgPSAwOyBidWlsZGluZy5jb3N0SGVhZHNbaW5kZXhdLmNhdGVnb3JpZXNbaW5kZXgxXS53b3JrSXRlbXMubGVuZ3RoID4gaW5kZXgyOyBpbmRleDIrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChidWlsZGluZy5jb3N0SGVhZHNbaW5kZXhdLmNhdGVnb3JpZXNbaW5kZXgxXS53b3JrSXRlbXNbaW5kZXgyXS5yYXRlQW5hbHlzaXNJZCA9PT0gdGhpcy53b3JrSXRlbUlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBxdWFudGl0eSA9IGJ1aWxkaW5nLmNvc3RIZWFkc1tpbmRleF0uY2F0ZWdvcmllc1tpbmRleDFdLndvcmtJdGVtc1tpbmRleDJdLnF1YW50aXR5O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IobGV0IGluZGV4ID0gMDsgcXVhbnRpdHkucXVhbnRpdHlJdGVtcy5sZW5ndGggPiBpbmRleDsgaW5kZXggKyspIHtcclxuICAgICAgICAgIGlmKHF1YW50aXR5LnF1YW50aXR5SXRlbXNbaW5kZXhdLml0ZW0gID09PSBpdGVtKSB7XHJcbiAgICAgICAgICAgIHF1YW50aXR5LnF1YW50aXR5SXRlbXMuc3BsaWNlKGluZGV4LDEpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHF1ZXJ5ID0geyBfaWQgOiBidWlsZGluZ0lkIH07XHJcbiAgICAgICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgYnVpbGRpbmcse25ldzogdHJ1ZX0sIChlcnJvciwgYnVpbGRpbmcpID0+IHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGZpbmRPbmVBbmRVcGRhdGUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IHF1YW50aXR5OiBRdWFudGl0eTtcclxuXHJcbiAgICAgICAgICAgIGZvcihsZXQgaW5kZXggPSAwOyBidWlsZGluZy5jb3N0SGVhZHMubGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIHtcclxuICAgICAgICAgICAgICBpZiAoYnVpbGRpbmcuY29zdEhlYWRzW2luZGV4XS5yYXRlQW5hbHlzaXNJZCA9PT0gdGhpcy5jb3N0SGVhZElkKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpbmRleDEgPSAwOyBidWlsZGluZy5jb3N0SGVhZHNbaW5kZXhdLmNhdGVnb3JpZXMubGVuZ3RoID4gaW5kZXgxOyBpbmRleDErKykge1xyXG4gICAgICAgICAgICAgICAgICBpZiAoYnVpbGRpbmcuY29zdEhlYWRzW2luZGV4XS5jYXRlZ29yaWVzW2luZGV4MV0ucmF0ZUFuYWx5c2lzSWQgPT09IHRoaXMuY2F0ZWdvcnlJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGluZGV4MiA9IDA7IGJ1aWxkaW5nLmNvc3RIZWFkc1tpbmRleF0uY2F0ZWdvcmllc1tpbmRleDFdLndvcmtJdGVtcy5sZW5ndGggPiBpbmRleDI7IGluZGV4MisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBpZiAoYnVpbGRpbmcuY29zdEhlYWRzW2luZGV4XS5jYXRlZ29yaWVzW2luZGV4MV0ud29ya0l0ZW1zW2luZGV4Ml0ucmF0ZUFuYWx5c2lzSWQgPT09IHRoaXMud29ya0l0ZW1JZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBxdWFudGl0eSA9IGJ1aWxkaW5nLmNvc3RIZWFkc1tpbmRleF0uY2F0ZWdvcmllc1tpbmRleDFdLndvcmtJdGVtc1tpbmRleDJdLnF1YW50aXR5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYocXVhbnRpdHkudG90YWwpIHtcclxuICAgICAgICAgICAgICBpZihxdWFudGl0eS5xdWFudGl0eUl0ZW1zLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgZm9yKGxldCBpbmRleCA9IDA7IHF1YW50aXR5LnF1YW50aXR5SXRlbXMubGVuZ3RoID4gaW5kZXg7IGluZGV4ICsrKSB7XHJcbiAgICAgICAgICAgICAgICAgIHF1YW50aXR5LnRvdGFsID0gcXVhbnRpdHkucXVhbnRpdHlJdGVtc1tpbmRleF0ucXVhbnRpdHkgKyBxdWFudGl0eS50b3RhbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBxdWFudGl0eS50b3RhbCA9IDA7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiBxdWFudGl0eSwgYWNjZXNzX3Rva2VuOiB0aGlzLmF1dGhJbnRlcmNlcHRvci5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKX0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbiAgLy9EZWxldGUgUXVhbnRpdHkgT2YgUHJvamVjdCBDb3N0IEhlYWRzIEJ5IE5hbWVcclxuICBkZWxldGVRdWFudGl0eU9mUHJvamVjdENvc3RIZWFkc0J5TmFtZShwcm9qZWN0SWQ6c3RyaW5nLCBjb3N0SGVhZElkOnN0cmluZywgY2F0ZWdvcnlJZDpzdHJpbmcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd29ya0l0ZW1JZDpzdHJpbmcsIGl0ZW06c3RyaW5nLCB1c2VyOlVzZXIsIGNhbGxiYWNrOihlcnJvcjogYW55LCByZXN1bHQ6IGFueSk9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBEZWxldGUgUXVhbnRpdHkgT2YgUHJvamVjdCBDb3N0IEhlYWRzIEJ5IE5hbWUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICB0aGlzLnByb2plY3RSZXBvc2l0b3J5LmZpbmRCeUlkKHByb2plY3RJZCwgKGVycm9yLCBwcm9qZWN0IDogUHJvamVjdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3JcclxuICAgICAgKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCBxdWFudGl0eTogUXVhbnRpdHk7XHJcbiAgICAgICAgdGhpcy5jb3N0SGVhZElkID0gcGFyc2VJbnQoY29zdEhlYWRJZCk7XHJcbiAgICAgICAgdGhpcy5jYXRlZ29yeUlkID0gcGFyc2VJbnQoY2F0ZWdvcnlJZCk7XHJcbiAgICAgICAgdGhpcy53b3JrSXRlbUlkID0gcGFyc2VJbnQod29ya0l0ZW1JZCk7XHJcblxyXG4gICAgICAgIGZvcihsZXQgaW5kZXggPSAwOyBwcm9qZWN0LnByb2plY3RDb3N0SGVhZHMubGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIHtcclxuICAgICAgICAgIGlmIChwcm9qZWN0LnByb2plY3RDb3N0SGVhZHNbaW5kZXhdLnJhdGVBbmFseXNpc0lkID09PSB0aGlzLmNvc3RIZWFkSWQpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaW5kZXgxID0gMDsgcHJvamVjdC5wcm9qZWN0Q29zdEhlYWRzW2luZGV4XS5jYXRlZ29yaWVzLmxlbmd0aCA+IGluZGV4MTsgaW5kZXgxKyspIHtcclxuICAgICAgICAgICAgICBpZiAocHJvamVjdC5wcm9qZWN0Q29zdEhlYWRzW2luZGV4XS5jYXRlZ29yaWVzW2luZGV4MV0ucmF0ZUFuYWx5c2lzSWQgPT09IHRoaXMuY2F0ZWdvcnlJZCkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaW5kZXgyID0gMDsgcHJvamVjdC5wcm9qZWN0Q29zdEhlYWRzW2luZGV4XS5jYXRlZ29yaWVzW2luZGV4MV0ud29ya0l0ZW1zLmxlbmd0aCA+IGluZGV4MjsgaW5kZXgyKyspIHtcclxuICAgICAgICAgICAgICAgICAgaWYgKHByb2plY3QucHJvamVjdENvc3RIZWFkc1tpbmRleF0uY2F0ZWdvcmllc1tpbmRleDFdLndvcmtJdGVtc1tpbmRleDJdLnJhdGVBbmFseXNpc0lkID09PSB0aGlzLndvcmtJdGVtSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBxdWFudGl0eSA9IHByb2plY3QucHJvamVjdENvc3RIZWFkc1tpbmRleF0uY2F0ZWdvcmllc1tpbmRleDFdLndvcmtJdGVtc1tpbmRleDJdLnF1YW50aXR5O1xyXG4gICAgICAgICAgICAgICAgICAgIGZvcihsZXQgaW5kZXggPSAwOyBxdWFudGl0eS5xdWFudGl0eUl0ZW1zLmxlbmd0aCA+IGluZGV4OyBpbmRleCArKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgaWYocXVhbnRpdHkucXVhbnRpdHlJdGVtc1tpbmRleF0uaXRlbSAgPT09IGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcXVhbnRpdHkucXVhbnRpdHlJdGVtcy5zcGxpY2UoaW5kZXgsMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgbGV0IHF1ZXJ5ID0geyBfaWQgOiBwcm9qZWN0SWQgfTtcclxuICAgICAgICB0aGlzLnByb2plY3RSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIHByb2plY3Qse25ldzogdHJ1ZX0sIChlcnJvciwgcHJvamVjdCA6IFByb2plY3QpID0+IHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGZpbmRPbmVBbmRVcGRhdGUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IHF1YW50aXR5OiBRdWFudGl0eTtcclxuXHJcbiAgICAgICAgICAgIGZvcihsZXQgaW5kZXggPSAwOyBwcm9qZWN0LnByb2plY3RDb3N0SGVhZHMubGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIHtcclxuICAgICAgICAgICAgICBpZiAocHJvamVjdC5wcm9qZWN0Q29zdEhlYWRzW2luZGV4XS5yYXRlQW5hbHlzaXNJZCA9PT0gdGhpcy5jb3N0SGVhZElkKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpbmRleDEgPSAwOyBwcm9qZWN0LnByb2plY3RDb3N0SGVhZHNbaW5kZXhdLmNhdGVnb3JpZXMubGVuZ3RoID4gaW5kZXgxOyBpbmRleDErKykge1xyXG4gICAgICAgICAgICAgICAgICBpZiAocHJvamVjdC5wcm9qZWN0Q29zdEhlYWRzW2luZGV4XS5jYXRlZ29yaWVzW2luZGV4MV0ucmF0ZUFuYWx5c2lzSWQgPT09IHRoaXMuY2F0ZWdvcnlJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGluZGV4MiA9IDA7IHByb2plY3QucHJvamVjdENvc3RIZWFkc1tpbmRleF0uY2F0ZWdvcmllc1tpbmRleDFdLndvcmtJdGVtcy5sZW5ndGggPiBpbmRleDI7IGluZGV4MisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvamVjdC5wcm9qZWN0Q29zdEhlYWRzW2luZGV4XS5jYXRlZ29yaWVzW2luZGV4MV0ud29ya0l0ZW1zW2luZGV4Ml0ucmF0ZUFuYWx5c2lzSWQgPT09IHRoaXMud29ya0l0ZW1JZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBxdWFudGl0eSA9IHByb2plY3QucHJvamVjdENvc3RIZWFkc1tpbmRleF0uY2F0ZWdvcmllc1tpbmRleDFdLndvcmtJdGVtc1tpbmRleDJdLnF1YW50aXR5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYocXVhbnRpdHkudG90YWwpIHtcclxuICAgICAgICAgICAgICBpZihxdWFudGl0eS5xdWFudGl0eUl0ZW1zLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgZm9yKGxldCBpbmRleCA9IDA7IHF1YW50aXR5LnF1YW50aXR5SXRlbXMubGVuZ3RoID4gaW5kZXg7IGluZGV4ICsrKSB7XHJcbiAgICAgICAgICAgICAgICAgIHF1YW50aXR5LnRvdGFsID0gcXVhbnRpdHkucXVhbnRpdHlJdGVtc1tpbmRleF0ucXVhbnRpdHkgKyBxdWFudGl0eS50b3RhbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBxdWFudGl0eS50b3RhbCA9IDA7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiAnc3VjY2VzcycsIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgZGVsZXRlV29ya2l0ZW0ocHJvamVjdElkOnN0cmluZywgYnVpbGRpbmdJZDpzdHJpbmcsIGNvc3RIZWFkSWQ6bnVtYmVyLCBjYXRlZ29yeUlkOm51bWJlciwgd29ya0l0ZW1JZDpudW1iZXIsIHVzZXI6VXNlcixcclxuICAgICAgICAgICAgICAgICBjYWxsYmFjazooZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpPT4gdm9pZCkge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZGVsZXRlIFdvcmtpdGVtIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZEJ5SWQoYnVpbGRpbmdJZCwgKGVycm9yLCBidWlsZGluZzpCdWlsZGluZykgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IGNvc3RIZWFkTGlzdCA9IGJ1aWxkaW5nLmNvc3RIZWFkcztcclxuICAgICAgICBsZXQgY2F0ZWdvcnlMaXN0OiBDYXRlZ29yeVtdO1xyXG4gICAgICAgIGxldCBXb3JrSXRlbUxpc3Q6IFdvcmtJdGVtW107XHJcbiAgICAgICAgdmFyIGZsYWcgPSAwO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgY29zdEhlYWRMaXN0Lmxlbmd0aDsgaW5kZXgrKykge1xyXG4gICAgICAgICAgaWYgKGNvc3RIZWFkSWQgPT09IGNvc3RIZWFkTGlzdFtpbmRleF0ucmF0ZUFuYWx5c2lzSWQpIHtcclxuICAgICAgICAgICAgY2F0ZWdvcnlMaXN0ID0gY29zdEhlYWRMaXN0W2luZGV4XS5jYXRlZ29yaWVzO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBjYXRlZ29yeUluZGV4ID0gMDsgY2F0ZWdvcnlJbmRleCA8IGNhdGVnb3J5TGlzdC5sZW5ndGg7IGNhdGVnb3J5SW5kZXgrKykge1xyXG4gICAgICAgICAgICAgIGlmIChjYXRlZ29yeUlkID09PSBjYXRlZ29yeUxpc3RbY2F0ZWdvcnlJbmRleF0ucmF0ZUFuYWx5c2lzSWQpIHtcclxuICAgICAgICAgICAgICAgIFdvcmtJdGVtTGlzdCA9IGNhdGVnb3J5TGlzdFtjYXRlZ29yeUluZGV4XS53b3JrSXRlbXM7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB3b3JraXRlbUluZGV4ID0gMDsgd29ya2l0ZW1JbmRleCA8IFdvcmtJdGVtTGlzdC5sZW5ndGg7IHdvcmtpdGVtSW5kZXgrKykge1xyXG4gICAgICAgICAgICAgICAgICBpZiAod29ya0l0ZW1JZCA9PT0gV29ya0l0ZW1MaXN0W3dvcmtpdGVtSW5kZXhdLnJhdGVBbmFseXNpc0lkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmxhZyA9IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgV29ya0l0ZW1MaXN0LnNwbGljZSh3b3JraXRlbUluZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoZmxhZyA9PT0gMSkge1xyXG4gICAgICAgICAgbGV0IHF1ZXJ5ID0ge19pZDogYnVpbGRpbmdJZH07XHJcbiAgICAgICAgICB0aGlzLmJ1aWxkaW5nUmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCBidWlsZGluZywge25ldzogdHJ1ZX0sIChlcnJvciwgV29ya0l0ZW1MaXN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGZpbmRPbmVBbmRVcGRhdGUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBsZXQgbWVzc2FnZSA9ICdXb3JrSXRlbSBkZWxldGVkLic7XHJcbiAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGE6IFdvcmtJdGVtTGlzdCwgYWNjZXNzX3Rva2VuOiB0aGlzLmF1dGhJbnRlcmNlcHRvci5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKX0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzZXRDb3N0SGVhZFN0YXR1cyggYnVpbGRpbmdJZCA6IHN0cmluZywgY29zdEhlYWRJZCA6IG51bWJlciwgY29zdEhlYWRBY3RpdmVTdGF0dXMgOiBzdHJpbmcsIHVzZXI6IFVzZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbGV0IHF1ZXJ5ID0geydfaWQnIDogYnVpbGRpbmdJZCwgJ2Nvc3RIZWFkcy5yYXRlQW5hbHlzaXNJZCcgOiBjb3N0SGVhZElkfTtcclxuICAgIGxldCBhY3RpdmVTdGF0dXMgPSBKU09OLnBhcnNlKGNvc3RIZWFkQWN0aXZlU3RhdHVzKTtcclxuICAgIGxldCBuZXdEYXRhID0geyAkc2V0IDogeydjb3N0SGVhZHMuJC5hY3RpdmUnIDogYWN0aXZlU3RhdHVzfX07XHJcbiAgICB0aGlzLmJ1aWxkaW5nUmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCBuZXdEYXRhLCB7bmV3OiB0cnVlfSwoZXJyLCByZXNwb25zZSkgPT4ge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kT25lQW5kVXBkYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBpZihlcnIpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiByZXNwb25zZSwgYWNjZXNzX3Rva2VuOiB0aGlzLmF1dGhJbnRlcmNlcHRvci5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKX0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZVdvcmtJdGVtU3RhdHVzT2ZCdWlsZGluZ0Nvc3RIZWFkcyhidWlsZGluZ0lkOnN0cmluZywgY29zdEhlYWRJZDpudW1iZXIsIGNhdGVnb3J5SWQ6bnVtYmVyLCB3b3JrSXRlbUlkOm51bWJlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd29ya0l0ZW1BY3RpdmVTdGF0dXMgOiBib29sZWFuLCB1c2VyOiBVc2VyLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCB1cGRhdGUgV29ya2l0ZW0gaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICB0aGlzLmJ1aWxkaW5nUmVwb3NpdG9yeS5maW5kQnlJZChidWlsZGluZ0lkLCAoZXJyb3IsIGJ1aWxkaW5nOkJ1aWxkaW5nKSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgY29zdEhlYWRMaXN0ID0gYnVpbGRpbmcuY29zdEhlYWRzO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBjb3N0SGVhZERhdGEgb2YgY29zdEhlYWRMaXN0KSB7XHJcbiAgICAgICAgICBpZiAoY29zdEhlYWRJZCA9PT0gY29zdEhlYWREYXRhLnJhdGVBbmFseXNpc0lkKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGNhdGVnb3J5RGF0YSBvZiBjb3N0SGVhZERhdGEuY2F0ZWdvcmllcykge1xyXG4gICAgICAgICAgICAgIGlmIChjYXRlZ29yeUlkID09PSBjYXRlZ29yeURhdGEucmF0ZUFuYWx5c2lzSWQpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHdvcmtJdGVtRGF0YSBvZiBjYXRlZ29yeURhdGEud29ya0l0ZW1zKSB7XHJcbiAgICAgICAgICAgICAgICAgIGlmICh3b3JrSXRlbUlkID09PSB3b3JrSXRlbURhdGEucmF0ZUFuYWx5c2lzSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB3b3JrSXRlbURhdGEuYWN0aXZlID0gd29ya0l0ZW1BY3RpdmVTdGF0dXM7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICAgbGV0IHF1ZXJ5ID0ge19pZDogYnVpbGRpbmdJZH07XHJcbiAgICAgICAgICB0aGlzLmJ1aWxkaW5nUmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCBidWlsZGluZywge25ldzogdHJ1ZX0sIChlcnJvciwgcmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZmluZE9uZUFuZFVwZGF0ZSBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiAnc3VjY2VzcycsIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gVXBkYXRlIFdvcmtJdGVtIFN0YXR1cyBPZiBQcm9qZWN0IENvc3RIZWFkc1xyXG4gIHVwZGF0ZVdvcmtJdGVtU3RhdHVzT2ZQcm9qZWN0Q29zdEhlYWRzKHByb2plY3RJZDpzdHJpbmcsIGNvc3RIZWFkSWQ6bnVtYmVyLCBjYXRlZ29yeUlkOm51bWJlciwgd29ya0l0ZW1JZDpudW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd29ya0l0ZW1BY3RpdmVTdGF0dXMgOiBib29sZWFuLCB1c2VyOiBVc2VyLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBVcGRhdGUgV29ya0l0ZW0gU3RhdHVzIE9mIFByb2plY3QgQ29zdCBIZWFkcyBoYXMgYmVlbiBoaXQnKTtcclxuICAgIHRoaXMucHJvamVjdFJlcG9zaXRvcnkuZmluZEJ5SWQocHJvamVjdElkLCAoZXJyb3IsIHByb2plY3Q6UHJvamVjdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IGNvc3RIZWFkTGlzdCA9IHByb2plY3QucHJvamVjdENvc3RIZWFkcztcclxuXHJcbiAgICAgICAgZm9yIChsZXQgY29zdEhlYWREYXRhIG9mIGNvc3RIZWFkTGlzdCkge1xyXG4gICAgICAgICAgaWYgKGNvc3RIZWFkSWQgPT09IGNvc3RIZWFkRGF0YS5yYXRlQW5hbHlzaXNJZCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBjYXRlZ29yeURhdGEgb2YgY29zdEhlYWREYXRhLmNhdGVnb3JpZXMpIHtcclxuICAgICAgICAgICAgICBpZiAoY2F0ZWdvcnlJZCA9PT0gY2F0ZWdvcnlEYXRhLnJhdGVBbmFseXNpc0lkKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB3b3JrSXRlbURhdGEgb2YgY2F0ZWdvcnlEYXRhLndvcmtJdGVtcykge1xyXG4gICAgICAgICAgICAgICAgICBpZiAod29ya0l0ZW1JZCA9PT0gd29ya0l0ZW1EYXRhLnJhdGVBbmFseXNpc0lkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd29ya0l0ZW1EYXRhLmFjdGl2ZSA9IHdvcmtJdGVtQWN0aXZlU3RhdHVzO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGxldCBxdWVyeSA9IHtfaWQ6IHByb2plY3RJZH07XHJcbiAgICAgICAgICB0aGlzLnByb2plY3RSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIHByb2plY3QsIHtuZXc6IHRydWV9LCAoZXJyb3IsIHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIFVwZGF0ZSBXb3JrSXRlbSBTdGF0dXMgT2YgUHJvamVjdCBDb3N0IEhlYWRzICxmaW5kT25lQW5kVXBkYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGE6ICdzdWNjZXNzJywgYWNjZXNzX3Rva2VuOiB0aGlzLmF1dGhJbnRlcmNlcHRvci5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKX0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVCdWRnZXRlZENvc3RGb3JDb3N0SGVhZCggYnVpbGRpbmdJZCA6IHN0cmluZywgY29zdEhlYWRCdWRnZXRlZEFtb3VudCA6IGFueSwgdXNlcjogVXNlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgdXBkYXRlQnVkZ2V0ZWRDb3N0Rm9yQ29zdEhlYWQgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICBsZXQgcXVlcnkgPSB7J19pZCcgOiBidWlsZGluZ0lkLCAnY29zdEhlYWRzLm5hbWUnIDogY29zdEhlYWRCdWRnZXRlZEFtb3VudC5jb3N0SGVhZH07XHJcbiAgICBsZXQgY29zdEluVW5pdCA9IGNvc3RIZWFkQnVkZ2V0ZWRBbW91bnQuY29zdEluO1xyXG4gICAgbGV0IGNvc3RQZXJVbml0ID0gY29zdEhlYWRCdWRnZXRlZEFtb3VudC5jb3N0UGVyO1xyXG4gICAgbGV0IHJhdGUgPSAwO1xyXG4gICAgbGV0IG5ld0RhdGE7XHJcbiAgICByYXRlID0gY29zdEhlYWRCdWRnZXRlZEFtb3VudC5idWRnZXRlZENvc3RBbW91bnQgLyBjb3N0SGVhZEJ1ZGdldGVkQW1vdW50LmJ1aWxkaW5nQXJlYTtcclxuXHJcbiAgICBpZihjb3N0UGVyVW5pdCA9PT0gJ3NhbGVhYmxlQXJlYScgJiYgY29zdEluVW5pdCA9PT0gJ3NxZnQnKSB7XHJcbiAgICAgIG5ld0RhdGEgPSB7ICRzZXQgOiB7XHJcbiAgICAgICAgJ2Nvc3RIZWFkcy4kLnRodW1iUnVsZVJhdGUuc2FsZWFibGVBcmVhLnNxZnQnIDogcmF0ZSxcclxuICAgICAgICAnY29zdEhlYWRzLiQudGh1bWJSdWxlUmF0ZS5zYWxlYWJsZUFyZWEuc3FtdCcgOiByYXRlIC8gY29uZmlnLmdldChDb25zdGFudHMuU1FVQVJFX01FVEVSKVxyXG4gICAgICB9IH07XHJcbiAgICB9IGVsc2UgaWYoY29zdFBlclVuaXQgPT09ICdzYWxlYWJsZUFyZWEnICYmIGNvc3RJblVuaXQgPT09ICdzcW10Jykge1xyXG4gICAgICBuZXdEYXRhID0geyAkc2V0IDoge1xyXG4gICAgICAgICdjb3N0SGVhZHMuJC50aHVtYlJ1bGVSYXRlLnNhbGVhYmxlQXJlYS5zcW10JyA6IHJhdGUsXHJcbiAgICAgICAgJ2Nvc3RIZWFkcy4kLnRodW1iUnVsZVJhdGUuc2FsZWFibGVBcmVhLnNxZnQnIDogcmF0ZSAqIGNvbmZpZy5nZXQoQ29uc3RhbnRzLlNRVUFSRV9NRVRFUilcclxuICAgICAgfSB9O1xyXG4gICAgfSBlbHNlIGlmKGNvc3RQZXJVbml0ID09PSAnc2xhYkFyZWEnICYmIGNvc3RJblVuaXQgPT09ICdzcWZ0Jykge1xyXG4gICAgICBuZXdEYXRhID0geyAkc2V0IDoge1xyXG4gICAgICAgICdjb3N0SGVhZHMuJC50aHVtYlJ1bGVSYXRlLnNsYWJBcmVhLnNxZnQnIDogcmF0ZSxcclxuICAgICAgICAnY29zdEhlYWRzLiQudGh1bWJSdWxlUmF0ZS5zbGFiQXJlYS5zcW10JyA6IHJhdGUgLyBjb25maWcuZ2V0KENvbnN0YW50cy5TUVVBUkVfTUVURVIpXHJcbiAgICAgIH0gfTtcclxuICAgIH0gZWxzZSBpZihjb3N0UGVyVW5pdCA9PT0gJ3NsYWJBcmVhJyAmJiBjb3N0SW5Vbml0ID09PSAnc3FtdCcpIHtcclxuICAgICAgbmV3RGF0YSA9IHsgJHNldCA6IHtcclxuICAgICAgICAnY29zdEhlYWRzLiQudGh1bWJSdWxlUmF0ZS5zbGFiQXJlYS5zcW10JyA6IHJhdGUsXHJcbiAgICAgICAgJ2Nvc3RIZWFkcy4kLnRodW1iUnVsZVJhdGUuc2xhYkFyZWEuc3FmdCcgOiByYXRlICogY29uZmlnLmdldChDb25zdGFudHMuU1FVQVJFX01FVEVSKVxyXG4gICAgICB9IH07XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgbmV3RGF0YSwge25ldzp0cnVlfSwoZXJyLCByZXNwb25zZSkgPT4ge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kT25lQW5kVXBkYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBpZihlcnIpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiByZXNwb25zZSwgYWNjZXNzX3Rva2VuOiB0aGlzLmF1dGhJbnRlcmNlcHRvci5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKX0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZVF1YW50aXR5T2ZCdWlsZGluZ0Nvc3RIZWFkcyhwcm9qZWN0SWQ6c3RyaW5nLCBidWlsZGluZ0lkOnN0cmluZywgY29zdEhlYWRJZDpudW1iZXIsIGNhdGVnb3J5SWQ6bnVtYmVyLCB3b3JrSXRlbUlkOm51bWJlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVhbnRpdHk6YW55LCB1c2VyOlVzZXIsIGNhbGxiYWNrOihlcnJvcjogYW55LCByZXN1bHQ6IGFueSk9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCB1cGRhdGVRdWFudGl0eU9mQnVpbGRpbmdDb3N0SGVhZHMgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICB0aGlzLmJ1aWxkaW5nUmVwb3NpdG9yeS5maW5kQnlJZChidWlsZGluZ0lkLCAoZXJyb3IsIGJ1aWxkaW5nKSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgY29zdEhlYWRMaXN0ID0gYnVpbGRpbmcuY29zdEhlYWRzO1xyXG4gICAgICAgIGxldCBxdWFudGl0eUFycmF5ICA6IFF1YW50aXR5O1xyXG4gICAgICAgIGZvciAobGV0IGNvc3RIZWFkIG9mIGNvc3RIZWFkTGlzdCkge1xyXG4gICAgICAgICAgaWYgKGNvc3RIZWFkSWQgPT09IGNvc3RIZWFkLnJhdGVBbmFseXNpc0lkKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGNhdGVnb3J5RGF0YSBvZiBjb3N0SGVhZC5jYXRlZ29yaWVzKSB7XHJcbiAgICAgICAgICAgICAgaWYgKGNhdGVnb3J5SWQgPT09IGNhdGVnb3J5RGF0YS5yYXRlQW5hbHlzaXNJZCkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgd29ya0l0ZW1EYXRhIG9mIGNhdGVnb3J5RGF0YS53b3JrSXRlbXMpIHtcclxuICAgICAgICAgICAgICAgICAgaWYgKHdvcmtJdGVtSWQgPT09IHdvcmtJdGVtRGF0YS5yYXRlQW5hbHlzaXNJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHF1YW50aXR5QXJyYXkgID0gd29ya0l0ZW1EYXRhLnF1YW50aXR5O1xyXG4gICAgICAgICAgICAgICAgICAgIHF1YW50aXR5QXJyYXkucXVhbnRpdHlJdGVtcyA9IHF1YW50aXR5O1xyXG4gICAgICAgICAgICAgICAgICAgIHF1YW50aXR5QXJyYXkudG90YWwgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IHF1YW50aXR5RGF0YSBvZiBxdWFudGl0eUFycmF5LnF1YW50aXR5SXRlbXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5QXJyYXkudG90YWwgPSBxdWFudGl0eURhdGEucXVhbnRpdHkgKyBxdWFudGl0eUFycmF5LnRvdGFsO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgICBsZXQgcXVlcnkgPSB7X2lkOiBidWlsZGluZ0lkfTtcclxuICAgICAgICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIGJ1aWxkaW5nLCB7bmV3OiB0cnVlfSwgKGVycm9yLCBidWlsZGluZykgPT4ge1xyXG4gICAgICAgICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kT25lQW5kVXBkYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGE6ICdzdWNjZXNzJywgYWNjZXNzX3Rva2VuOiB0aGlzLmF1dGhJbnRlcmNlcHRvci5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKX0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vVXBkYXRlIFF1YW50aXR5IE9mIFByb2plY3QgQ29zdCBIZWFkc1xyXG4gIHVwZGF0ZVF1YW50aXR5T2ZQcm9qZWN0Q29zdEhlYWRzKHByb2plY3RJZDpzdHJpbmcsIGNvc3RIZWFkSWQ6bnVtYmVyLCBjYXRlZ29yeUlkOm51bWJlciwgd29ya0l0ZW1JZDpudW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgcXVhbnRpdHk6IGFueSwgdXNlcjpVc2VyLCBjYWxsYmFjazooZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpPT4gdm9pZCkge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgVXBkYXRlIFF1YW50aXR5IE9mIFByb2plY3QgQ29zdCBIZWFkcyBoYXMgYmVlbiBoaXQnKTtcclxuICAgIHRoaXMucHJvamVjdFJlcG9zaXRvcnkuZmluZEJ5SWQocHJvamVjdElkLCAoZXJyb3IsIHByb2plY3QpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCBjb3N0SGVhZExpc3QgPSBwcm9qZWN0LnByb2plY3RDb3N0SGVhZHM7XHJcbiAgICAgICAgbGV0IHF1YW50aXR5QXJyYXkgIDogUXVhbnRpdHk7XHJcbiAgICAgICAgZm9yIChsZXQgY29zdEhlYWQgb2YgY29zdEhlYWRMaXN0KSB7XHJcbiAgICAgICAgICBpZiAoY29zdEhlYWRJZCA9PT0gY29zdEhlYWQucmF0ZUFuYWx5c2lzSWQpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgY2F0ZWdvcnlEYXRhIG9mIGNvc3RIZWFkLmNhdGVnb3JpZXMpIHtcclxuICAgICAgICAgICAgICBpZiAoY2F0ZWdvcnlJZCA9PT0gY2F0ZWdvcnlEYXRhLnJhdGVBbmFseXNpc0lkKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB3b3JrSXRlbURhdGEgb2YgY2F0ZWdvcnlEYXRhLndvcmtJdGVtcykge1xyXG4gICAgICAgICAgICAgICAgICBpZiAod29ya0l0ZW1JZCA9PT0gd29ya0l0ZW1EYXRhLnJhdGVBbmFseXNpc0lkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcXVhbnRpdHlBcnJheSAgPSB3b3JrSXRlbURhdGEucXVhbnRpdHk7XHJcbiAgICAgICAgICAgICAgICAgICAgcXVhbnRpdHlBcnJheS5xdWFudGl0eUl0ZW1zID0gcXVhbnRpdHk7XHJcbiAgICAgICAgICAgICAgICAgICAgcXVhbnRpdHlBcnJheS50b3RhbCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgcXVhbnRpdHlEYXRhIG9mIHF1YW50aXR5QXJyYXkucXVhbnRpdHlJdGVtcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgcXVhbnRpdHlBcnJheS50b3RhbCA9IHF1YW50aXR5RGF0YS5xdWFudGl0eSArIHF1YW50aXR5QXJyYXkudG90YWw7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgcXVlcnkgPSB7X2lkOiBwcm9qZWN0SWR9O1xyXG4gICAgICAgIHRoaXMucHJvamVjdFJlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgcHJvamVjdCwge25ldzogdHJ1ZX0sIChlcnJvciwgcHJvamVjdCkgPT4ge1xyXG4gICAgICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgVXBkYXRlIFF1YW50aXR5IE9mIFByb2plY3QgQ29zdCBIZWFkcyBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTogJ3N1Y2Nlc3MnLCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy9HZXQgSW4tQWN0aXZlIENhdGVnb3JpZXMgRnJvbSBEYXRhYmFzZVxyXG4gIGdldEluQWN0aXZlQ2F0ZWdvcmllc0J5Q29zdEhlYWRJZChwcm9qZWN0SWQ6c3RyaW5nLCBidWlsZGluZ0lkOnN0cmluZywgY29zdEhlYWRJZDpzdHJpbmcsIHVzZXI6VXNlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6KGVycm9yOiBhbnksIHJlc3VsdDogYW55KT0+IHZvaWQpIHtcclxuXHJcbiAgICB0aGlzLmJ1aWxkaW5nUmVwb3NpdG9yeS5maW5kQnlJZChidWlsZGluZ0lkLCAoZXJyb3IsIGJ1aWxkaW5nKSA9PiB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIEdldCBJbi1BY3RpdmUgQ2F0ZWdvcmllcyBCeSBDb3N0IEhlYWQgSWQgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgY29zdEhlYWRzID0gYnVpbGRpbmcuY29zdEhlYWRzO1xyXG4gICAgICAgIGxldCBjYXRlZ29yaWVzIDogQXJyYXk8Q2F0ZWdvcnk+PSBuZXcgQXJyYXk8Q2F0ZWdvcnk+KCk7XHJcblxyXG4gICAgICAgIGZvcihsZXQgY29zdEhlYWRJbmRleCA9IDA7IGNvc3RIZWFkSW5kZXg8Y29zdEhlYWRzLmxlbmd0aDsgY29zdEhlYWRJbmRleCsrKSB7XHJcbiAgICAgICAgICBpZihwYXJzZUludChjb3N0SGVhZElkKSA9PT0gY29zdEhlYWRzW2Nvc3RIZWFkSW5kZXhdLnJhdGVBbmFseXNpc0lkKSB7XHJcbiAgICAgICAgICAgIGxldCBjYXRlZ29yaWVzTGlzdCA9IGNvc3RIZWFkc1tjb3N0SGVhZEluZGV4XS5jYXRlZ29yaWVzO1xyXG4gICAgICAgICAgICBmb3IobGV0IGNhdGVnb3J5SW5kZXggPSAwOyBjYXRlZ29yeUluZGV4IDwgY2F0ZWdvcmllc0xpc3QubGVuZ3RoOyBjYXRlZ29yeUluZGV4KyspIHtcclxuICAgICAgICAgICAgICBpZihjYXRlZ29yaWVzTGlzdFtjYXRlZ29yeUluZGV4XS5hY3RpdmUgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXRlZ29yaWVzLnB1c2goY2F0ZWdvcmllc0xpc3RbY2F0ZWdvcnlJbmRleF0pO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTogY2F0ZWdvcmllcywgYWNjZXNzX3Rva2VuOiB0aGlzLmF1dGhJbnRlcmNlcHRvci5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKX0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldFdvcmtpdGVtTGlzdChwcm9qZWN0SWQ6c3RyaW5nLCBidWlsZGluZ0lkOnN0cmluZywgY29zdEhlYWRJZDpudW1iZXIsIGNhdGVnb3J5SWQ6bnVtYmVyLCB1c2VyOlVzZXIsXHJcbiAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOihlcnJvcjogYW55LCByZXN1bHQ6IGFueSk9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBnZXRXb3JraXRlbUxpc3QgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICBsZXQgcmF0ZUFuYWx5c2lzU2VydmljZXMgOiBSYXRlQW5hbHlzaXNTZXJ2aWNlID0gbmV3IFJhdGVBbmFseXNpc1NlcnZpY2UoKTtcclxuICAgIHJhdGVBbmFseXNpc1NlcnZpY2VzLmdldFdvcmtpdGVtTGlzdChjb3N0SGVhZElkLCBjYXRlZ29yeUlkLCAoZXJyb3IsIHdvcmtpdGVtTGlzdCk9PiB7XHJcbiAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9ZWxzZSB7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGE6IHdvcmtpdGVtTGlzdCwgYWNjZXNzX3Rva2VuOiB0aGlzLmF1dGhJbnRlcmNlcHRvci5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKX0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGFkZFdvcmtpdGVtKHByb2plY3RJZDpzdHJpbmcsIGJ1aWxkaW5nSWQ6c3RyaW5nLCBjb3N0SGVhZElkOm51bWJlciwgY2F0ZWdvcnlJZDpudW1iZXIsIHdvcmtJdGVtOiBXb3JrSXRlbSxcclxuICAgICAgICAgICAgICB1c2VyOlVzZXIsIGNhbGxiYWNrOihlcnJvcjogYW55LCByZXN1bHQ6IGFueSk9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBhZGRXb3JraXRlbSBoYXMgYmVlbiBoaXQnKTtcclxuICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmZpbmRCeUlkKGJ1aWxkaW5nSWQsIChlcnJvciwgYnVpbGRpbmc6QnVpbGRpbmcpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCByZXNwb25zZVdvcmtpdGVtIDogQXJyYXk8V29ya0l0ZW0+PSBudWxsO1xyXG4gICAgICAgIGZvcihsZXQgaW5kZXggPSAwOyBidWlsZGluZy5jb3N0SGVhZHMubGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIHtcclxuICAgICAgICAgIGlmKGJ1aWxkaW5nLmNvc3RIZWFkc1tpbmRleF0ucmF0ZUFuYWx5c2lzSWQgPT09IGNvc3RIZWFkSWQpIHtcclxuICAgICAgICAgICAgbGV0IGNhdGVnb3J5ID0gYnVpbGRpbmcuY29zdEhlYWRzW2luZGV4XS5jYXRlZ29yaWVzO1xyXG4gICAgICAgICAgICBmb3IobGV0IGNhdGVnb3J5SW5kZXggPSAwOyBjYXRlZ29yeS5sZW5ndGggPiBjYXRlZ29yeUluZGV4OyBjYXRlZ29yeUluZGV4KyspIHtcclxuICAgICAgICAgICAgICBpZihjYXRlZ29yeVtjYXRlZ29yeUluZGV4XS5yYXRlQW5hbHlzaXNJZCA9PT0gY2F0ZWdvcnlJZCkge1xyXG4gICAgICAgICAgICAgICAgY2F0ZWdvcnlbY2F0ZWdvcnlJbmRleF0ud29ya0l0ZW1zLnB1c2god29ya0l0ZW0pO1xyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2VXb3JraXRlbSA9IGNhdGVnb3J5W2NhdGVnb3J5SW5kZXhdLndvcmtJdGVtcztcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IHF1ZXJ5ID0geyBfaWQgOiBidWlsZGluZ0lkIH07XHJcbiAgICAgICAgICAgIGxldCBuZXdEYXRhID0geyAkc2V0IDogeydjb3N0SGVhZHMnIDogYnVpbGRpbmcuY29zdEhlYWRzfX07XHJcbiAgICAgICAgICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIG5ld0RhdGEse25ldzogdHJ1ZX0sIChlcnJvciwgYnVpbGRpbmcpID0+IHtcclxuICAgICAgICAgICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kT25lQW5kVXBkYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTogcmVzcG9uc2VXb3JraXRlbSwgYWNjZXNzX3Rva2VuOiB0aGlzLmF1dGhJbnRlcmNlcHRvci5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKX0pO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGFkZENhdGVnb3J5QnlDb3N0SGVhZElkKHByb2plY3RJZDpzdHJpbmcsIGJ1aWxkaW5nSWQ6c3RyaW5nLCBjb3N0SGVhZElkOnN0cmluZywgY2F0ZWdvcnlEZXRhaWxzIDogYW55LCB1c2VyOlVzZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6KGVycm9yOiBhbnksIHJlc3VsdDogYW55KT0+IHZvaWQpIHtcclxuXHJcbiAgICBsZXQgY2F0ZWdvcnlPYmogOiBDYXRlZ29yeSA9IG5ldyBDYXRlZ29yeShjYXRlZ29yeURldGFpbHMuY2F0ZWdvcnksIGNhdGVnb3J5RGV0YWlscy5jYXRlZ29yeUlkKTtcclxuXHJcbiAgICBsZXQgcXVlcnkgPSB7J19pZCcgOiBidWlsZGluZ0lkLCAnY29zdEhlYWRzLnJhdGVBbmFseXNpc0lkJyA6IHBhcnNlSW50KGNvc3RIZWFkSWQpfTtcclxuICAgIGxldCBuZXdEYXRhID0geyAkcHVzaDogeyAnY29zdEhlYWRzLiQuY2F0ZWdvcmllcyc6IGNhdGVnb3J5T2JqIH19O1xyXG5cclxuICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIG5ld0RhdGEse25ldzogdHJ1ZX0sIChlcnJvciwgYnVpbGRpbmcpID0+IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgYWRkQ2F0ZWdvcnlCeUNvc3RIZWFkSWQgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTogYnVpbGRpbmcsIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvL1VwZGF0ZSBzdGF0dXMgKCB0cnVlL2ZhbHNlICkgb2YgY2F0ZWdvcnlcclxuICB1cGRhdGVDYXRlZ29yeVN0YXR1cyhwcm9qZWN0SWQ6c3RyaW5nLCBidWlsZGluZ0lkOnN0cmluZywgY29zdEhlYWRJZDpudW1iZXIsIGNhdGVnb3J5SWQ6bnVtYmVyICxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeUFjdGl2ZVN0YXR1czpib29sZWFuLCB1c2VyOlVzZXIsIGNhbGxiYWNrOihlcnJvcjogYW55LCByZXN1bHQ6IGFueSk9PiB2b2lkKSB7XHJcblxyXG4gICB0aGlzLmJ1aWxkaW5nUmVwb3NpdG9yeS5maW5kQnlJZChidWlsZGluZ0lkLCAoZXJyb3IsIGJ1aWxkaW5nOkJ1aWxkaW5nKSA9PiB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIHVwZGF0ZSBDYXRlZ29yeSBTdGF0dXMgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgY29zdEhlYWRzID0gYnVpbGRpbmcuY29zdEhlYWRzO1xyXG4gICAgICAgIGxldCBjYXRlZ29yaWVzIDogQXJyYXk8Q2F0ZWdvcnk+PSBuZXcgQXJyYXk8Q2F0ZWdvcnk+KCk7XHJcbiAgICAgICAgbGV0IHVwZGF0ZWRDYXRlZ29yaWVzIDogQXJyYXk8Q2F0ZWdvcnk+PSBuZXcgQXJyYXk8Q2F0ZWdvcnk+KCk7XHJcbiAgICAgICAgbGV0IGluZGV4IDogbnVtYmVyO1xyXG5cclxuICAgICAgICBmb3IobGV0IGNvc3RIZWFkSW5kZXg9MDsgY29zdEhlYWRJbmRleDxjb3N0SGVhZHMubGVuZ3RoOyBjb3N0SGVhZEluZGV4KyspIHtcclxuICAgICAgICAgIGlmKGNvc3RIZWFkSWQgPT09IGNvc3RIZWFkc1tjb3N0SGVhZEluZGV4XS5yYXRlQW5hbHlzaXNJZCkge1xyXG4gICAgICAgICAgICBjYXRlZ29yaWVzID0gY29zdEhlYWRzW2Nvc3RIZWFkSW5kZXhdLmNhdGVnb3JpZXM7XHJcbiAgICAgICAgICAgIGZvcihsZXQgY2F0ZWdvcnlJbmRleCA9IDA7IGNhdGVnb3J5SW5kZXg8Y2F0ZWdvcmllcy5sZW5ndGg7IGNhdGVnb3J5SW5kZXgrKykge1xyXG4gICAgICAgICAgICAgIGlmKGNhdGVnb3JpZXNbY2F0ZWdvcnlJbmRleF0ucmF0ZUFuYWx5c2lzSWQgPT09IGNhdGVnb3J5SWQpIHtcclxuICAgICAgICAgICAgICAgIGNhdGVnb3JpZXNbY2F0ZWdvcnlJbmRleF0uYWN0aXZlID0gY2F0ZWdvcnlBY3RpdmVTdGF0dXM7XHJcbiAgICAgICAgICAgICAgICB1cGRhdGVkQ2F0ZWdvcmllcy5wdXNoKGNhdGVnb3JpZXNbY2F0ZWdvcnlJbmRleF0pO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHF1ZXJ5ID0geydfaWQnIDogYnVpbGRpbmdJZCwgJ2Nvc3RIZWFkcy5yYXRlQW5hbHlzaXNJZCcgOiBjb3N0SGVhZElkfTtcclxuICAgICAgICBsZXQgbmV3RGF0YSA9IHsnJHNldCcgOiB7J2Nvc3RIZWFkcy4kLmNhdGVnb3JpZXMnIDogY2F0ZWdvcmllcyB9fTtcclxuXHJcbiAgICAgICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgbmV3RGF0YSx7bmV3OiB0cnVlfSwgKGVycm9yLCBidWlsZGluZykgPT4ge1xyXG4gICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiB1cGRhdGVkQ2F0ZWdvcmllcywgYWNjZXNzX3Rva2VuOiB0aGlzLmF1dGhJbnRlcmNlcHRvci5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKX0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vR2V0IGFjdGl2ZSBjYXRlZ29yaWVzIGZyb20gZGF0YWJhc2VcclxuICBnZXRDYXRlZ29yaWVzT2ZCdWlsZGluZ0Nvc3RIZWFkKHByb2plY3RJZDpzdHJpbmcsIGJ1aWxkaW5nSWQ6c3RyaW5nLCBjb3N0SGVhZElkOm51bWJlciwgdXNlcjpVc2VyLCBjYWxsYmFjazooZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpPT4gdm9pZCkge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgR2V0IEFjdGl2ZSBDYXRlZ29yaWVzIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZEJ5SWQoYnVpbGRpbmdJZCwgKGVycm9yLCBidWlsZGluZzpCdWlsZGluZykgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IGNhdGVnb3JpZXMgOkFycmF5PENhdGVnb3J5PiA9IG5ldyBBcnJheTxDYXRlZ29yeT4oKTtcclxuICAgICAgICBsZXQgYnVpbGRpbmdDb3N0SGVhZHMgPSBidWlsZGluZy5jb3N0SGVhZHM7XHJcblxyXG4gICAgICAgIGZvcihsZXQgY29zdEhlYWREYXRhIG9mIGJ1aWxkaW5nQ29zdEhlYWRzKSB7XHJcbiAgICAgICAgICBpZihjb3N0SGVhZERhdGEucmF0ZUFuYWx5c2lzSWQgPT09IGNvc3RIZWFkSWQpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgY2F0ZWdvcnlEYXRhIG9mIGNvc3RIZWFkRGF0YS5jYXRlZ29yaWVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2F0ZWdvcnlEYXRhLmFjdGl2ZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICBsZXQgd29ya0l0ZW1zIDogQXJyYXk8V29ya0l0ZW0+ID0gbmV3IEFycmF5PFdvcmtJdGVtPigpO1xyXG4gICAgICAgICAgICAgICAgICBsZXQgY2F0ZWdvcnkgPSBjYXRlZ29yeURhdGE7XHJcbiAgICAgICAgICAgICAgICAgIGZvcihsZXQgd29ya0l0ZW1EYXRhIG9mIGNhdGVnb3J5LndvcmtJdGVtcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHdvcmtJdGVtRGF0YS5hY3RpdmUpIHtcclxuICAgICAgICAgICAgICAgICAgICB3b3JrSXRlbXMucHVzaCh3b3JrSXRlbURhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IHNpbmdsZVdvcmtJdGVtIG9mIHdvcmtJdGVtcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgaWYgKHNpbmdsZVdvcmtJdGVtLnF1YW50aXR5LnRvdGFsICE9PSBudWxsICYmIHNpbmdsZVdvcmtJdGVtLnJhdGUudG90YWwgIT09IG51bGxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgc2luZ2xlV29ya0l0ZW0ucXVhbnRpdHkudG90YWwgIT09IDAgJiYgc2luZ2xlV29ya0l0ZW0ucmF0ZS50b3RhbCAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeURhdGEuYW1vdW50ID0gcGFyc2VGbG9hdCgoc2luZ2xlV29ya0l0ZW0ucXVhbnRpdHkudG90YWwgKlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHNpbmdsZVdvcmtJdGVtLnJhdGUudG90YWwgKyBjYXRlZ29yeURhdGEuYW1vdW50KS50b0ZpeGVkKDIpKTtcclxuICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5RGF0YS5hbW91bnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeURhdGEuYW1vdW50ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgY2F0ZWdvcnkud29ya0l0ZW1zID0gd29ya0l0ZW1zO1xyXG4gICAgICAgICAgICAgICAgICBjYXRlZ29yaWVzLnB1c2goY2F0ZWdvcnkpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTogY2F0ZWdvcmllcywgYWNjZXNzX3Rva2VuOiB0aGlzLmF1dGhJbnRlcmNlcHRvci5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKX0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vR2V0IGNhdGVnb3JpZXMgb2YgcHJvamVjdENvc3RIZWFkcyBmcm9tIGRhdGFiYXNlXHJcbiAgZ2V0Q2F0ZWdvcmllc09mUHJvamVjdENvc3RIZWFkKHByb2plY3RJZDpzdHJpbmcsIGNvc3RIZWFkSWQ6bnVtYmVyLCB1c2VyOlVzZXIsIGNhbGxiYWNrOihlcnJvcjogYW55LCByZXN1bHQ6IGFueSk9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBHZXQgUHJvamVjdCBDb3N0SGVhZCBDYXRlZ29yaWVzIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgdGhpcy5wcm9qZWN0UmVwb3NpdG9yeS5maW5kQnlJZChwcm9qZWN0SWQsIChlcnJvciwgcHJvamVjdDpQcm9qZWN0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgY2F0ZWdvcmllcyA6QXJyYXk8Q2F0ZWdvcnk+ID0gbmV3IEFycmF5PENhdGVnb3J5PigpO1xyXG4gICAgICAgIGxldCBwcm9qZWN0Q29zdEhlYWRzID0gcHJvamVjdC5wcm9qZWN0Q29zdEhlYWRzO1xyXG5cclxuICAgICAgICBmb3IobGV0IGNvc3RIZWFkIG9mIHByb2plY3RDb3N0SGVhZHMpIHtcclxuICAgICAgICAgIGlmKGNvc3RIZWFkLnJhdGVBbmFseXNpc0lkID09PSBjb3N0SGVhZElkKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHNpbmdsZUNhdGVnb3J5IG9mIGNvc3RIZWFkLmNhdGVnb3JpZXMpIHtcclxuICAgICAgICAgICAgICBsZXQgY2F0ZWdvcnlEYXRhID0gc2luZ2xlQ2F0ZWdvcnk7XHJcbiAgICAgICAgICAgICAgICBsZXQgd29ya0l0ZW1zIDogQXJyYXk8V29ya0l0ZW0+ID0gbmV3IEFycmF5PFdvcmtJdGVtPigpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGNhdGVnb3J5ID0gY2F0ZWdvcnlEYXRhO1xyXG4gICAgICAgICAgICAgICAgZm9yKGxldCB3b3JrSXRlbSBvZiBjYXRlZ29yeS53b3JrSXRlbXMpIHtcclxuICAgICAgICAgICAgICAgICAgbGV0IHdvcmtJdGVtRGF0YSA9IHdvcmtJdGVtO1xyXG4gICAgICAgICAgICAgICAgICBpZih3b3JrSXRlbURhdGEuYWN0aXZlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd29ya0l0ZW1zLnB1c2god29ya0l0ZW1EYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IobGV0IHNpbmdsZVdvcmtJdGVtIG9mIHdvcmtJdGVtcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgaWYgKHNpbmdsZVdvcmtJdGVtLnF1YW50aXR5LnRvdGFsICE9PSBudWxsICYmIHNpbmdsZVdvcmtJdGVtLnJhdGUudG90YWwgIT09IG51bGxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgc2luZ2xlV29ya0l0ZW0ucXVhbnRpdHkudG90YWwgIT09IDAgJiYgc2luZ2xlV29ya0l0ZW0ucmF0ZS50b3RhbCAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeURhdGEuYW1vdW50ID1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KChzaW5nbGVXb3JrSXRlbS5xdWFudGl0eS50b3RhbCAqXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaW5nbGVXb3JrSXRlbS5yYXRlLnRvdGFsICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5RGF0YS5hbW91bnQpLnRvRml4ZWQoMikpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnlEYXRhLmFtb3VudCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5RGF0YS5hbW91bnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhdGVnb3J5LndvcmtJdGVtcyA9IHdvcmtJdGVtcztcclxuICAgICAgICAgICAgICAgIGNhdGVnb3JpZXMucHVzaChjYXRlZ29yeSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGE6IGNhdGVnb3JpZXMsIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzeW5jUHJvamVjdFdpdGhSYXRlQW5hbHlzaXNEYXRhKHByb2plY3RJZDpzdHJpbmcsIGJ1aWxkaW5nSWQ6c3RyaW5nLCB1c2VyOiBVc2VyLCBjYWxsYmFjazogKGVycm9yOmFueSwgcmVzdWx0OmFueSk9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBzeW5jUHJvamVjdFdpdGhSYXRlQW5hbHlzaXNEYXRhIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgdGhpcy5nZXRQcm9qZWN0QW5kQnVpbGRpbmdEZXRhaWxzKHByb2plY3RJZCwgYnVpbGRpbmdJZCwoZXJyb3IsIHByb2plY3RBbmRCdWlsZGluZ0RldGFpbHMpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbG9nZ2VyLmVycm9yKCdQcm9qZWN0IHNlcnZpY2UsIGdldFByb2plY3RBbmRCdWlsZGluZ0RldGFpbHMgZmFpbGVkJyk7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIHN5bmNQcm9qZWN0V2l0aFJhdGVBbmFseXNpc0RhdGEuJyk7XHJcbiAgICAgICAgbGV0IHByb2plY3REYXRhID0gcHJvamVjdEFuZEJ1aWxkaW5nRGV0YWlscy5kYXRhWzBdO1xyXG4gICAgICAgIGxldCBidWlsZGluZ3MgPSBwcm9qZWN0QW5kQnVpbGRpbmdEZXRhaWxzLmRhdGFbMF0uYnVpbGRpbmdzO1xyXG4gICAgICAgIGxldCBidWlsZGluZ0RhdGE6IGFueTtcclxuXHJcbiAgICAgICAgZm9yKGxldCBidWlsZGluZyBvZiBidWlsZGluZ3MpIHtcclxuICAgICAgICAgIGlmKGJ1aWxkaW5nLl9pZCA9PSBidWlsZGluZ0lkKSB7XHJcbiAgICAgICAgICAgIGJ1aWxkaW5nRGF0YSA9IGJ1aWxkaW5nO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHByb2plY3REYXRhLnByb2plY3RDb3N0SGVhZHMubGVuZ3RoID4gMCApIHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIHN5bmNXaXRoUmF0ZUFuYWx5c2lzRGF0YSBidWlsZGluZyBPbmx5LicpO1xyXG4gICAgICAgICAgdGhpcy51cGRhdGVDb3N0SGVhZHNGb3JCdWlsZGluZ0FuZFByb2plY3QoY2FsbGJhY2ssIHByb2plY3REYXRhLCBidWlsZGluZ0RhdGEsIGJ1aWxkaW5nSWQsIHByb2plY3RJZCk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBjYWxsaW5nIHByb21pc2UgZm9yIHN5bmNQcm9qZWN0V2l0aFJhdGVBbmFseXNpc0RhdGEgZm9yIFByb2plY3QgYW5kIEJ1aWxkaW5nLicpO1xyXG4gICAgICAgICAgbGV0IHN5bmNCdWlsZGluZ0Nvc3RIZWFkc1Byb21pc2UgPSB0aGlzLnVwZGF0ZUJ1ZGdldFJhdGVzRm9yQnVpbGRpbmdDb3N0SGVhZHMoQ29uc3RhbnRzLkJVSUxESU5HLFxyXG4gICAgICAgICAgICBidWlsZGluZ0lkLCBwcm9qZWN0RGF0YSwgYnVpbGRpbmdEYXRhKTtcclxuICAgICAgICAgIGxldCBzeW5jUHJvamVjdENvc3RIZWFkc1Byb21pc2UgPSB0aGlzLnVwZGF0ZUJ1ZGdldFJhdGVzRm9yUHJvamVjdENvc3RIZWFkcyhDb25zdGFudHMuQU1FTklUSUVTLFxyXG4gICAgICAgICAgICBwcm9qZWN0SWQsIHByb2plY3REYXRhLCBidWlsZGluZ0RhdGEpO1xyXG5cclxuICAgICAgICAgIFByb21pc2UuYWxsKFtcclxuICAgICAgICAgICAgc3luY0J1aWxkaW5nQ29zdEhlYWRzUHJvbWlzZSxcclxuICAgICAgICAgICAgc3luY1Byb2plY3RDb3N0SGVhZHNQcm9taXNlXHJcbiAgICAgICAgICBdKS50aGVuKGZ1bmN0aW9uKGRhdGE6IEFycmF5PGFueT4pIHtcclxuICAgICAgICAgICAgbG9nZ2VyLmluZm8oJ1Byb21pc2UgZm9yIHN5bmNQcm9qZWN0V2l0aFJhdGVBbmFseXNpc0RhdGEgZm9yIFByb2plY3QgYW5kIEJ1aWxkaW5nIHN1Y2Nlc3MnKTtcclxuICAgICAgICAgICAgbGV0IGJ1aWxkaW5nQ29zdEhlYWRzRGF0YSA9IGRhdGFbMF07XHJcbiAgICAgICAgICAgIGxldCBwcm9qZWN0Q29zdEhlYWRzRGF0YSA9IGRhdGFbMV07XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHtzdGF0dXM6MjAwfSk7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuY2F0Y2goKGUpID0+IHsgbG9nZ2VyLmVycm9yKCcgUHJvbWlzZSBmYWlsZWQgZm9yIHN5bmNQcm9qZWN0V2l0aFJhdGVBbmFseXNpc0RhdGEgISA6JyArSlNPTi5zdHJpbmdpZnkoZSkpO30pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZUNvc3RIZWFkc0ZvckJ1aWxkaW5nQW5kUHJvamVjdChjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9qZWN0RGF0YTogYW55LCBidWlsZGluZ0RhdGE6IGFueSwgYnVpbGRpbmdJZDogc3RyaW5nLCBwcm9qZWN0SWQ6IHN0cmluZykge1xyXG5cclxuICAgIGxvZ2dlci5pbmZvKCd1cGRhdGVDb3N0SGVhZHNGb3JCdWlsZGluZ0FuZFByb2plY3QgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICBsZXQgcmF0ZUFuYWx5c2lzU2VydmljZSA9IG5ldyBSYXRlQW5hbHlzaXNTZXJ2aWNlKCk7XHJcbiAgICBsZXQgYnVpbGRpbmdSZXBvc2l0b3J5ID0gbmV3IEJ1aWxkaW5nUmVwb3NpdG9yeSgpO1xyXG4gICAgbGV0IHByb2plY3RSZXBvc2l0b3J5ID0gbmV3IFByb2plY3RSZXBvc2l0b3J5KCk7XHJcblxyXG4gICAgcmF0ZUFuYWx5c2lzU2VydmljZS5jb252ZXJ0Q29zdEhlYWRzRnJvbVJhdGVBbmFseXNpc1RvQ29zdENvbnRyb2woQ29uc3RhbnRzLkJVSUxESU5HLFxyXG4gICAgICAoZXJyb3I6IGFueSwgYnVpbGRpbmdDb3N0SGVhZHNEYXRhOiBhbnkpID0+IHtcclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgIGxvZ2dlci5lcnJvcignRXJyb3IgaW4gdXBkYXRlQ29zdEhlYWRzRm9yQnVpbGRpbmdBbmRQcm9qZWN0IDogY29udmVydENvc3RIZWFkc0Zyb21SYXRlQW5hbHlzaXNUb0Nvc3RDb250cm9sIDogJyArIEpTT04uc3RyaW5naWZ5KGVycm9yKSk7XHJcbiAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdHZXRBbGxEYXRhRnJvbVJhdGVBbmFseXNpcyBzdWNjZXNzJyk7XHJcbiAgICAgICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgICAgIGxldCBkYXRhID0gcHJvamVjdFNlcnZpY2UuY2FsY3VsYXRlQnVkZ2V0Q29zdEZvckJ1aWxkaW5nKGJ1aWxkaW5nQ29zdEhlYWRzRGF0YSwgcHJvamVjdERhdGEsIGJ1aWxkaW5nRGF0YSk7XHJcbiAgICAgICAgICBsZXQgcXVlcnlGb3JCdWlsZGluZyA9IHsnX2lkJzogYnVpbGRpbmdJZH07XHJcbiAgICAgICAgICBsZXQgdXBkYXRlQ29zdEhlYWQgPSB7JHNldDogeydjb3N0SGVhZHMnOiBkYXRhfX07XHJcbiAgICAgICAgICBidWlsZGluZ1JlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeUZvckJ1aWxkaW5nLCB1cGRhdGVDb3N0SGVhZCwge25ldzogdHJ1ZX0sIChlcnJvcjogYW55LCByZXNwb25zZTogYW55KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgIGxvZ2dlci5lcnJvcignRXJyb3IgaW4gVXBkYXRlIGNvbnZlcnRDb3N0SGVhZHNGcm9tUmF0ZUFuYWx5c2lzVG9Db3N0Q29udHJvbCBidWlsZGluZ0Nvc3RIZWFkc0RhdGEgIDogJyArIEpTT04uc3RyaW5naWZ5KGVycm9yKSk7XHJcbiAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGxvZ2dlci5pbmZvKCdVcGRhdGVCdWlsZGluZ0Nvc3RIZWFkIHN1Y2Nlc3MnKTtcclxuICAgICAgICAgICAgICBsZXQgcHJvamVjdENvc3RIZWFkcyA9IHByb2plY3RTZXJ2aWNlLmNhbGN1bGF0ZUJ1ZGdldENvc3RGb3JDb21tb25BbW1lbml0aWVzKFxyXG4gICAgICAgICAgICAgICAgcHJvamVjdERhdGEucHJvamVjdENvc3RIZWFkcyxwcm9qZWN0RGF0YSwgYnVpbGRpbmdEYXRhKTtcclxuICAgICAgICAgICAgICBsZXQgcXVlcnlGb3JQcm9qZWN0ID0geydfaWQnOiBwcm9qZWN0SWR9O1xyXG4gICAgICAgICAgICAgIGxldCB1cGRhdGVQcm9qZWN0Q29zdEhlYWQgPSB7JHNldDogeydwcm9qZWN0Q29zdEhlYWRzJzogcHJvamVjdENvc3RIZWFkc319O1xyXG4gICAgICAgICAgICAgIGxvZ2dlci5pbmZvKCdDYWxsaW5nIHVwZGF0ZSBwcm9qZWN0IENvc3RoZWFkcyBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgICAgICAgICBwcm9qZWN0UmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5Rm9yUHJvamVjdCwgdXBkYXRlUHJvamVjdENvc3RIZWFkLCB7bmV3OiB0cnVlfSxcclxuICAgICAgICAgICAgICAgIChlcnJvcjogYW55LCByZXNwb25zZTogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGxvZ2dlci5lcnIoJ0Vycm9yIHVwZGF0ZSBwcm9qZWN0IENvc3RoZWFkcyA6ICcgKyBKU09OLnN0cmluZ2lmeShlcnJvcikpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZGVidWcoJ1VwZGF0ZSBwcm9qZWN0IENvc3RoZWFkcyBzdWNjZXNzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZUJ1ZGdldFJhdGVzRm9yQnVpbGRpbmdDb3N0SGVhZHMoZW50aXR5OiBzdHJpbmcsIGJ1aWxkaW5nSWQ6c3RyaW5nLCBwcm9qZWN0RGV0YWlscyA6IFByb2plY3QsIGJ1aWxkaW5nRGV0YWlscyA6IEJ1aWxkaW5nKSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgIGxldCByYXRlQW5hbHlzaXNTZXJ2aWNlID0gbmV3IFJhdGVBbmFseXNpc1NlcnZpY2UoKTtcclxuICAgICAgbGV0IGJ1aWxkaW5nUmVwb3NpdG9yeSA9IG5ldyBCdWlsZGluZ1JlcG9zaXRvcnkoKTtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgdXBkYXRlQnVkZ2V0UmF0ZXNGb3JCdWlsZGluZ0Nvc3RIZWFkcyBwcm9taXNlLicpO1xyXG4gICAgICByYXRlQW5hbHlzaXNTZXJ2aWNlLmNvbnZlcnRDb3N0SGVhZHNGcm9tUmF0ZUFuYWx5c2lzVG9Db3N0Q29udHJvbChlbnRpdHksIChlcnJvcjogYW55LCBidWlsZGluZ0Nvc3RIZWFkc0RhdGE6IGFueSkgPT4ge1xyXG4gICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgbG9nZ2VyLmVycignRXJyb3IgaW4gcHJvbWlzZSB1cGRhdGVCdWRnZXRSYXRlc0ZvckJ1aWxkaW5nQ29zdEhlYWRzIDogJyArIEpTT04uc3RyaW5naWZ5KGVycm9yKSk7XHJcbiAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgbGV0IHByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcbiAgICAgICAgICBsZXQgYnVpbGRpbmdDb3N0SGVhZHMgPSBwcm9qZWN0U2VydmljZS5jYWxjdWxhdGVCdWRnZXRDb3N0Rm9yQnVpbGRpbmcoYnVpbGRpbmdDb3N0SGVhZHNEYXRhLCBwcm9qZWN0RGV0YWlscywgYnVpbGRpbmdEZXRhaWxzKTtcclxuICAgICAgICAgIGxldCBxdWVyeSA9IHsnX2lkJzogYnVpbGRpbmdJZH07XHJcbiAgICAgICAgICBsZXQgbmV3RGF0YSA9IHskc2V0OiB7J2Nvc3RIZWFkcyc6IGJ1aWxkaW5nQ29zdEhlYWRzfX07XHJcbiAgICAgICAgICBidWlsZGluZ1JlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgbmV3RGF0YSwge25ldzogdHJ1ZX0sIChlcnJvcjphbnksIHJlc3BvbnNlOmFueSkgPT4ge1xyXG4gICAgICAgICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBnZXRBbGxEYXRhRnJvbVJhdGVBbmFseXNpcyBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKCdFcnJvciBpbiBVcGRhdGUgYnVpbGRpbmdDb3N0SGVhZHNEYXRhICA6ICcrSlNPTi5zdHJpbmdpZnkoZXJyb3IpKTtcclxuICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnVXBkYXRlZCBidWlsZGluZ0Nvc3RIZWFkc0RhdGEnKTtcclxuICAgICAgICAgICAgICByZXNvbHZlKCdEb25lJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZUJ1ZGdldFJhdGVzRm9yUHJvamVjdENvc3RIZWFkcyhlbnRpdHk6IHN0cmluZywgcHJvamVjdElkOnN0cmluZywgcHJvamVjdERldGFpbHMgOiBQcm9qZWN0LCBidWlsZGluZ0RldGFpbHMgOiBCdWlsZGluZykge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XHJcbiAgICAgIGxldCByYXRlQW5hbHlzaXNTZXJ2aWNlID0gbmV3IFJhdGVBbmFseXNpc1NlcnZpY2UoKTtcclxuICAgICAgbGV0IHByb2plY3RSZXBvc2l0b3J5ID0gbmV3IFByb2plY3RSZXBvc2l0b3J5KCk7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIHVwZGF0ZUJ1ZGdldFJhdGVzRm9yUHJvamVjdENvc3RIZWFkcyBwcm9taXNlLicpO1xyXG4gICAgICByYXRlQW5hbHlzaXNTZXJ2aWNlLmNvbnZlcnRDb3N0SGVhZHNGcm9tUmF0ZUFuYWx5c2lzVG9Db3N0Q29udHJvbChlbnRpdHksIChlcnJvciA6IGFueSwgcHJvamVjdENvc3RIZWFkc0RhdGE6IGFueSkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBsb2dnZXIuZXJyKCdFcnJvciBpbiB1cGRhdGVCdWRnZXRSYXRlc0ZvclByb2plY3RDb3N0SGVhZHMgcHJvbWlzZSA6ICcgKyBKU09OLnN0cmluZ2lmeShlcnJvcikpO1xyXG4gICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgICAgICAgbGV0IHByb2plY3RDb3N0SGVhZHMgPSBwcm9qZWN0U2VydmljZS5jYWxjdWxhdGVCdWRnZXRDb3N0Rm9yQ29tbW9uQW1tZW5pdGllcyhwcm9qZWN0Q29zdEhlYWRzRGF0YSwgcHJvamVjdERldGFpbHMsIGJ1aWxkaW5nRGV0YWlscyk7XHJcbiAgICAgICAgICAgIGxldCBxdWVyeSA9IHsnX2lkJzogcHJvamVjdElkfTtcclxuICAgICAgICAgICAgbGV0IG5ld0RhdGEgPSB7JHNldDogeydwcm9qZWN0Q29zdEhlYWRzJzogcHJvamVjdENvc3RIZWFkc319O1xyXG4gICAgICAgICAgICBwcm9qZWN0UmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCBuZXdEYXRhLCB7bmV3OiB0cnVlfSwgKGVycm9yOiBhbnksIHJlc3BvbnNlOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBnZXRBbGxEYXRhRnJvbVJhdGVBbmFseXNpcyBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcignRXJyb3IgaW4gVXBkYXRlIGJ1aWxkaW5nQ29zdEhlYWRzRGF0YSAgOiAnK0pTT04uc3RyaW5naWZ5KGVycm9yKSk7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsb2dnZXIuZGVidWcoJ1VwZGF0ZWQgcHJvamVjdENvc3RIZWFkcycpO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgnRG9uZScpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBjYWxjdWxhdGVCdWRnZXRDb3N0Rm9yQnVpbGRpbmcoY29zdEhlYWRzUmF0ZUFuYWx5c2lzOiBhbnksIHByb2plY3REZXRhaWxzIDogUHJvamVjdCwgYnVpbGRpbmdEZXRhaWxzIDogYW55KSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBjYWxjdWxhdGVCdWRnZXRDb3N0Rm9yQnVpbGRpbmcgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICBsZXQgY29zdEhlYWRzOkFycmF5PENvc3RIZWFkPiA9IG5ldyBBcnJheTxDb3N0SGVhZD4oKTtcclxuICAgIGxldCBidWRnZXRlZENvc3RBbW91bnQ6IG51bWJlcjtcclxuICAgIGxldCBjYWxjdWxhdGVCdWRndGVkQ29zdCA6IHN0cmluZztcclxuXHJcbiAgICBmb3IobGV0IGNvc3RIZWFkIG9mIGNvc3RIZWFkc1JhdGVBbmFseXNpcykge1xyXG5cclxuICAgICAgbGV0IGJ1ZGdldENvc3RGb3JtdWxhZTpzdHJpbmc7XHJcblxyXG4gICAgICBzd2l0Y2goY29zdEhlYWQubmFtZSkge1xyXG5cclxuICAgICAgICAgIGNhc2UgQ29uc3RhbnRzLlJDQ19CQU5EX09SX1BBVExJIDoge1xyXG4gICAgICAgICAgICBidWRnZXRDb3N0Rm9ybXVsYWUgPSBjb25maWcuZ2V0KENvbnN0YW50cy5CVURHRVRFRF9DT1NUX0ZPUk1VTEFFICsgY29zdEhlYWQubmFtZSkudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgY2FsY3VsYXRlQnVkZ3RlZENvc3QgPSBidWRnZXRDb3N0Rm9ybXVsYWUucmVwbGFjZShDb25zdGFudHMuU0xBQl9BUkVBLCBwcm9qZWN0RGV0YWlscy5zbGFiQXJlYSk7XHJcbiAgICAgICAgICAgIGJ1ZGdldGVkQ29zdEFtb3VudCA9IGV2YWwoY2FsY3VsYXRlQnVkZ3RlZENvc3QpO1xyXG4gICAgICAgICAgICB0aGlzLmNhbGN1bGF0ZVRodW1iUnVsZVJlcG9ydEZvckNvc3RIZWFkKGJ1ZGdldGVkQ29zdEFtb3VudCwgY29zdEhlYWQsIGJ1aWxkaW5nRGV0YWlscywgY29zdEhlYWRzKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBjYXNlIENvbnN0YW50cy5FWFRFUk5BTF9QTEFTVEVSIDoge1xyXG4gICAgICAgICAgICBidWRnZXRDb3N0Rm9ybXVsYWUgPSBjb25maWcuZ2V0KENvbnN0YW50cy5CVURHRVRFRF9DT1NUX0ZPUk1VTEFFICsgY29zdEhlYWQubmFtZSkudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgY2FsY3VsYXRlQnVkZ3RlZENvc3QgPSBidWRnZXRDb3N0Rm9ybXVsYWUucmVwbGFjZShDb25zdGFudHMuQ0FSUEVUX0FSRUEsIGJ1aWxkaW5nRGV0YWlscy50b3RhbENhcnBldEFyZWFPZlVuaXQpO1xyXG4gICAgICAgICAgICBidWRnZXRlZENvc3RBbW91bnQgPSBldmFsKGNhbGN1bGF0ZUJ1ZGd0ZWRDb3N0KTtcclxuICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVUaHVtYlJ1bGVSZXBvcnRGb3JDb3N0SGVhZChidWRnZXRlZENvc3RBbW91bnQsIGNvc3RIZWFkLCBidWlsZGluZ0RldGFpbHMsIGNvc3RIZWFkcyk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY2FzZSBDb25zdGFudHMuRkFCUklDQVRJT04gOiB7XHJcbiAgICAgICAgICAgIGJ1ZGdldENvc3RGb3JtdWxhZSA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLkJVREdFVEVEX0NPU1RfRk9STVVMQUUgKyBjb3N0SGVhZC5uYW1lKS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICBjYWxjdWxhdGVCdWRndGVkQ29zdCA9IGJ1ZGdldENvc3RGb3JtdWxhZS5yZXBsYWNlKENvbnN0YW50cy5DQVJQRVRfQVJFQSwgYnVpbGRpbmdEZXRhaWxzLnRvdGFsQ2FycGV0QXJlYU9mVW5pdCk7XHJcbiAgICAgICAgICAgIGJ1ZGdldGVkQ29zdEFtb3VudCA9IGV2YWwoY2FsY3VsYXRlQnVkZ3RlZENvc3QpO1xyXG4gICAgICAgICAgICB0aGlzLmNhbGN1bGF0ZVRodW1iUnVsZVJlcG9ydEZvckNvc3RIZWFkKGJ1ZGdldGVkQ29zdEFtb3VudCwgY29zdEhlYWQsIGJ1aWxkaW5nRGV0YWlscywgY29zdEhlYWRzKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBjYXNlIENvbnN0YW50cy5QT0lOVElORyA6IHtcclxuICAgICAgICAgICAgYnVkZ2V0Q29zdEZvcm11bGFlID0gY29uZmlnLmdldChDb25zdGFudHMuQlVER0VURURfQ09TVF9GT1JNVUxBRSArIGNvc3RIZWFkLm5hbWUpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIGNhbGN1bGF0ZUJ1ZGd0ZWRDb3N0ID0gYnVkZ2V0Q29zdEZvcm11bGFlLnJlcGxhY2UoQ29uc3RhbnRzLkNBUlBFVF9BUkVBLCBidWlsZGluZ0RldGFpbHMudG90YWxDYXJwZXRBcmVhT2ZVbml0KTtcclxuICAgICAgICAgICAgYnVkZ2V0ZWRDb3N0QW1vdW50ID0gZXZhbChjYWxjdWxhdGVCdWRndGVkQ29zdCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlVGh1bWJSdWxlUmVwb3J0Rm9yQ29zdEhlYWQoYnVkZ2V0ZWRDb3N0QW1vdW50LCBjb3N0SGVhZCwgYnVpbGRpbmdEZXRhaWxzLCBjb3N0SGVhZHMpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNhc2UgQ29uc3RhbnRzLktJVENIRU5fT1RUQSA6IHtcclxuICAgICAgICAgICAgYnVkZ2V0Q29zdEZvcm11bGFlID0gY29uZmlnLmdldChDb25zdGFudHMuQlVER0VURURfQ09TVF9GT1JNVUxBRSArIGNvc3RIZWFkLm5hbWUpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIGNhbGN1bGF0ZUJ1ZGd0ZWRDb3N0ID0gYnVkZ2V0Q29zdEZvcm11bGFlLnJlcGxhY2UoQ29uc3RhbnRzLk5VTV9PRl9PTkVfQkhLLCBidWlsZGluZ0RldGFpbHMubnVtT2ZPbmVCSEspXHJcbiAgICAgICAgICAgICAgLnJlcGxhY2UoQ29uc3RhbnRzLk5VTV9PRl9UV09fQkhLLCBidWlsZGluZ0RldGFpbHMubnVtT2ZUd29CSEspXHJcbiAgICAgICAgICAgICAgLnJlcGxhY2UoQ29uc3RhbnRzLk5VTV9PRl9USFJFRV9CSEssIGJ1aWxkaW5nRGV0YWlscy5udW1PZlRocmVlQkhLKVxyXG4gICAgICAgICAgICAgIC5yZXBsYWNlKENvbnN0YW50cy5OVU1fT0ZfRk9VUl9CSEssIGJ1aWxkaW5nRGV0YWlscy5udW1PZkZvdXJCSEspXHJcbiAgICAgICAgICAgICAgLnJlcGxhY2UoQ29uc3RhbnRzLk5VTV9PRl9GSVZFX0JISywgYnVpbGRpbmdEZXRhaWxzLm51bU9mRml2ZUJISyk7XHJcbiAgICAgICAgICAgIGJ1ZGdldGVkQ29zdEFtb3VudCA9IGV2YWwoY2FsY3VsYXRlQnVkZ3RlZENvc3QpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVUaHVtYlJ1bGVSZXBvcnRGb3JDb3N0SGVhZChidWRnZXRlZENvc3RBbW91bnQsIGNvc3RIZWFkLCBidWlsZGluZ0RldGFpbHMsIGNvc3RIZWFkcyk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY2FzZSBDb25zdGFudHMuU09MSU5HIDoge1xyXG4gICAgICAgICAgICBidWRnZXRDb3N0Rm9ybXVsYWUgPSBjb25maWcuZ2V0KENvbnN0YW50cy5CVURHRVRFRF9DT1NUX0ZPUk1VTEFFICsgY29zdEhlYWQubmFtZSkudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgY2FsY3VsYXRlQnVkZ3RlZENvc3QgPSBidWRnZXRDb3N0Rm9ybXVsYWUucmVwbGFjZShDb25zdGFudHMuUExJTlRIX0FSRUEsIGJ1aWxkaW5nRGV0YWlscy5wbGludGhBcmVhKTtcclxuICAgICAgICAgICAgYnVkZ2V0ZWRDb3N0QW1vdW50ID0gZXZhbChjYWxjdWxhdGVCdWRndGVkQ29zdCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlVGh1bWJSdWxlUmVwb3J0Rm9yQ29zdEhlYWQoYnVkZ2V0ZWRDb3N0QW1vdW50LCBjb3N0SGVhZCwgYnVpbGRpbmdEZXRhaWxzLCBjb3N0SGVhZHMpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNhc2UgQ29uc3RhbnRzLk1BU09OUlkgOiB7XHJcbiAgICAgICAgICAgIGJ1ZGdldENvc3RGb3JtdWxhZSA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLkJVREdFVEVEX0NPU1RfRk9STVVMQUUgKyBjb3N0SGVhZC5uYW1lKS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICBjYWxjdWxhdGVCdWRndGVkQ29zdCA9IGJ1ZGdldENvc3RGb3JtdWxhZS5yZXBsYWNlKENvbnN0YW50cy5DQVJQRVRfQVJFQSwgYnVpbGRpbmdEZXRhaWxzLnRvdGFsQ2FycGV0QXJlYU9mVW5pdCk7XHJcbiAgICAgICAgICAgIGJ1ZGdldGVkQ29zdEFtb3VudCA9IGV2YWwoY2FsY3VsYXRlQnVkZ3RlZENvc3QpO1xyXG4gICAgICAgICAgICB0aGlzLmNhbGN1bGF0ZVRodW1iUnVsZVJlcG9ydEZvckNvc3RIZWFkKGJ1ZGdldGVkQ29zdEFtb3VudCwgY29zdEhlYWQsIGJ1aWxkaW5nRGV0YWlscywgY29zdEhlYWRzKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBjYXNlIENvbnN0YW50cy5JTlRFUk5BTF9QTEFTVEVSIDoge1xyXG4gICAgICAgICAgICBidWRnZXRDb3N0Rm9ybXVsYWUgPSBjb25maWcuZ2V0KENvbnN0YW50cy5CVURHRVRFRF9DT1NUX0ZPUk1VTEFFICsgY29zdEhlYWQubmFtZSkudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgY2FsY3VsYXRlQnVkZ3RlZENvc3QgPSBidWRnZXRDb3N0Rm9ybXVsYWUucmVwbGFjZShDb25zdGFudHMuQ0FSUEVUX0FSRUEsIGJ1aWxkaW5nRGV0YWlscy50b3RhbENhcnBldEFyZWFPZlVuaXQpO1xyXG4gICAgICAgICAgICBidWRnZXRlZENvc3RBbW91bnQgPSBldmFsKGNhbGN1bGF0ZUJ1ZGd0ZWRDb3N0KTtcclxuICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVUaHVtYlJ1bGVSZXBvcnRGb3JDb3N0SGVhZChidWRnZXRlZENvc3RBbW91bnQsIGNvc3RIZWFkLCBidWlsZGluZ0RldGFpbHMsIGNvc3RIZWFkcyk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY2FzZSBDb25zdGFudHMuR1lQU1VNX09SX1BPUF9QTEFTVEVSIDoge1xyXG4gICAgICAgICAgICBidWRnZXRDb3N0Rm9ybXVsYWUgPSBjb25maWcuZ2V0KENvbnN0YW50cy5CVURHRVRFRF9DT1NUX0ZPUk1VTEFFICsgY29zdEhlYWQubmFtZSkudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgY2FsY3VsYXRlQnVkZ3RlZENvc3QgPSBidWRnZXRDb3N0Rm9ybXVsYWUucmVwbGFjZShDb25zdGFudHMuQ0FSUEVUX0FSRUEsIGJ1aWxkaW5nRGV0YWlscy50b3RhbENhcnBldEFyZWFPZlVuaXQpO1xyXG4gICAgICAgICAgICBidWRnZXRlZENvc3RBbW91bnQgPSBldmFsKGNhbGN1bGF0ZUJ1ZGd0ZWRDb3N0KTtcclxuICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVUaHVtYlJ1bGVSZXBvcnRGb3JDb3N0SGVhZChidWRnZXRlZENvc3RBbW91bnQsIGNvc3RIZWFkLCBidWlsZGluZ0RldGFpbHMsIGNvc3RIZWFkcyk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZGVmYXVsdCA6IHtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIHJldHVybiBjb3N0SGVhZHM7XHJcbiAgfVxyXG5cclxuICBjYWxjdWxhdGVCdWRnZXRDb3N0Rm9yQ29tbW9uQW1tZW5pdGllcyhjb3N0SGVhZHNSYXRlQW5hbHlzaXM6IGFueSwgcHJvamVjdERldGFpbHMgOiBQcm9qZWN0LCBidWlsZGluZ0RldGFpbHMgOiBhbnkpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGNhbGN1bGF0ZUJ1ZGdldENvc3RGb3JDb21tb25BbW1lbml0aWVzIGhhcyBiZWVuIGhpdCcpO1xyXG5cclxuICAgIGxldCBjb3N0SGVhZHM6QXJyYXk8Q29zdEhlYWQ+ID0gbmV3IEFycmF5PENvc3RIZWFkPigpO1xyXG4gICAgbGV0IGJ1ZGdldGVkQ29zdEFtb3VudDogbnVtYmVyO1xyXG4gICAgbGV0IGJ1ZGdldENvc3RGb3JtdWxhZTpzdHJpbmc7XHJcbiAgICBsZXQgY2FsY3VsYXRlQnVkZ3RlZENvc3QgOnN0cmluZztcclxuXHJcbiAgICBsZXQgY2FsY3VsYXRlUHJvamVjdERhdGEgPSAnU0VMRUNUIFNVTShidWlsZGluZy50b3RhbENhcnBldEFyZWFPZlVuaXQpIEFTIHRvdGFsQ2FycGV0QXJlYSwgJyArXHJcbiAgICAgICdTVU0oYnVpbGRpbmcudG90YWxTbGFiQXJlYSkgQVMgdG90YWxTbGFiQXJlYVByb2plY3QsJyArXHJcbiAgICAgICdTVU0oYnVpbGRpbmcudG90YWxTYWxlYWJsZUFyZWFPZlVuaXQpIEFTIHRvdGFsU2FsZWFibGVBcmVhICBGUk9NID8gQVMgYnVpbGRpbmcnO1xyXG4gICAgbGV0IHByb2plY3REYXRhID0gYWxhc3FsKGNhbGN1bGF0ZVByb2plY3REYXRhLCBbcHJvamVjdERldGFpbHMuYnVpbGRpbmdzXSk7XHJcbiAgICBsZXQgdG90YWxTbGFiQXJlYU9mUHJvamVjdCA6IG51bWJlciA9IHByb2plY3REYXRhWzBdLnRvdGFsU2xhYkFyZWFQcm9qZWN0O1xyXG4gICAgbGV0IHRvdGFsU2FsZWFibGVBcmVhT2ZQcm9qZWN0IDogbnVtYmVyID0gcHJvamVjdERhdGFbMF0udG90YWxTYWxlYWJsZUFyZWE7XHJcbiAgICBsZXQgdG90YWxDYXJwZXRBcmVhT2ZQcm9qZWN0IDogbnVtYmVyID0gcHJvamVjdERhdGFbMF0udG90YWxDYXJwZXRBcmVhO1xyXG5cclxuICAgIGZvcihsZXQgY29zdEhlYWQgb2YgY29zdEhlYWRzUmF0ZUFuYWx5c2lzKSB7XHJcblxyXG4gICAgICBzd2l0Y2goY29zdEhlYWQubmFtZSkge1xyXG5cclxuICAgICAgICAgIGNhc2UgQ29uc3RhbnRzLlNBRkVUWV9NRUFTVVJFUyA6IHtcclxuICAgICAgICAgICAgYnVkZ2V0Q29zdEZvcm11bGFlID0gY29uZmlnLmdldChDb25zdGFudHMuQlVER0VURURfQ09TVF9GT1JNVUxBRSArIGNvc3RIZWFkLm5hbWUpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIGNhbGN1bGF0ZUJ1ZGd0ZWRDb3N0ID0gYnVkZ2V0Q29zdEZvcm11bGFlLnJlcGxhY2UoQ29uc3RhbnRzLkNBUlBFVF9BUkVBLCB0b3RhbENhcnBldEFyZWFPZlByb2plY3QpO1xyXG4gICAgICAgICAgICBidWRnZXRlZENvc3RBbW91bnQgPSBldmFsKGNhbGN1bGF0ZUJ1ZGd0ZWRDb3N0KTtcclxuICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVUaHVtYlJ1bGVSZXBvcnRGb3JQcm9qZWN0Q29zdEhlYWQoYnVkZ2V0ZWRDb3N0QW1vdW50LCBjb3N0SGVhZCwgcHJvamVjdERldGFpbHMsIGNvc3RIZWFkcyk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZGVmYXVsdCA6IHtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICB9XHJcbiAgICByZXR1cm4gY29zdEhlYWRzO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjYWxjdWxhdGVUaHVtYlJ1bGVSZXBvcnRGb3JDb3N0SGVhZChidWRnZXRlZENvc3RBbW91bnQ6IG51bWJlciwgY29zdEhlYWRGcm9tUmF0ZUFuYWx5c2lzOiBhbnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWlsZGluZ0RhdGE6IGFueSwgY29zdEhlYWRzOiBBcnJheTxDb3N0SGVhZD4pIHtcclxuICAgIGlmIChidWRnZXRlZENvc3RBbW91bnQpIHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgY2FsY3VsYXRlVGh1bWJSdWxlUmVwb3J0Rm9yQ29zdEhlYWQgaGFzIGJlZW4gaGl0Jyk7XHJcblxyXG4gICAgICBsZXQgY29zdEhlYWQ6IENvc3RIZWFkID0gY29zdEhlYWRGcm9tUmF0ZUFuYWx5c2lzO1xyXG4gICAgICBjb3N0SGVhZC5idWRnZXRlZENvc3RBbW91bnQgPSBidWRnZXRlZENvc3RBbW91bnQ7XHJcbiAgICAgIGxldCB0aHVtYlJ1bGVSYXRlID0gbmV3IFRodW1iUnVsZVJhdGUoKTtcclxuXHJcbiAgICAgIHRodW1iUnVsZVJhdGUuc2FsZWFibGVBcmVhID0gdGhpcy5jYWxjdWxhdGVUaHVtYlJ1bGVSYXRlRm9yQXJlYShidWRnZXRlZENvc3RBbW91bnQsIGJ1aWxkaW5nRGF0YS50b3RhbFNhbGVhYmxlQXJlYU9mVW5pdCk7XHJcbiAgICAgIHRodW1iUnVsZVJhdGUuc2xhYkFyZWEgPSB0aGlzLmNhbGN1bGF0ZVRodW1iUnVsZVJhdGVGb3JBcmVhKGJ1ZGdldGVkQ29zdEFtb3VudCwgYnVpbGRpbmdEYXRhLnRvdGFsU2xhYkFyZWEpO1xyXG4gICAgICB0aHVtYlJ1bGVSYXRlLmNhcnBldEFyZWEgPSB0aGlzLmNhbGN1bGF0ZVRodW1iUnVsZVJhdGVGb3JBcmVhKGJ1ZGdldGVkQ29zdEFtb3VudCwgYnVpbGRpbmdEYXRhLnRvdGFsQ2FycGV0QXJlYU9mVW5pdCk7XHJcblxyXG4gICAgICBjb3N0SGVhZC50aHVtYlJ1bGVSYXRlID0gdGh1bWJSdWxlUmF0ZTtcclxuICAgICAgY29zdEhlYWRzLnB1c2goY29zdEhlYWQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjYWxjdWxhdGVUaHVtYlJ1bGVSZXBvcnRGb3JQcm9qZWN0Q29zdEhlYWQoYnVkZ2V0ZWRDb3N0QW1vdW50OiBudW1iZXIsIGNvc3RIZWFkRnJvbVJhdGVBbmFseXNpczogYW55LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvamVjdERldGFpbHM6IGFueSwgY29zdEhlYWRzOiBBcnJheTxDb3N0SGVhZD4pIHtcclxuICAgIGlmIChidWRnZXRlZENvc3RBbW91bnQpIHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgY2FsY3VsYXRlVGh1bWJSdWxlUmVwb3J0Rm9yUHJvamVjdENvc3RIZWFkIGhhcyBiZWVuIGhpdCcpO1xyXG5cclxuICAgICAgbGV0IGNhbGN1bGF0ZVByb2plY3REYXRhID0gJ1NFTEVDVCBTVU0oYnVpbGRpbmcudG90YWxDYXJwZXRBcmVhT2ZVbml0KSBBUyB0b3RhbENhcnBldEFyZWEsICcgK1xyXG4gICAgICAgICdTVU0oYnVpbGRpbmcudG90YWxTbGFiQXJlYSkgQVMgdG90YWxTbGFiQXJlYVByb2plY3QsJyArXHJcbiAgICAgICAgJ1NVTShidWlsZGluZy50b3RhbFNhbGVhYmxlQXJlYU9mVW5pdCkgQVMgdG90YWxTYWxlYWJsZUFyZWEgIEZST00gPyBBUyBidWlsZGluZyc7XHJcbiAgICAgIGxldCBwcm9qZWN0RGF0YSA9IGFsYXNxbChjYWxjdWxhdGVQcm9qZWN0RGF0YSwgW3Byb2plY3REZXRhaWxzLmJ1aWxkaW5nc10pO1xyXG4gICAgICBsZXQgdG90YWxTbGFiQXJlYU9mUHJvamVjdCA6IG51bWJlciA9IHByb2plY3REYXRhWzBdLnRvdGFsU2xhYkFyZWFQcm9qZWN0O1xyXG4gICAgICBsZXQgdG90YWxTYWxlYWJsZUFyZWFPZlByb2plY3QgOiBudW1iZXIgPSBwcm9qZWN0RGF0YVswXS50b3RhbFNhbGVhYmxlQXJlYTtcclxuICAgICAgbGV0IHRvdGFsQ2FycGV0QXJlYU9mUHJvamVjdCA6IG51bWJlciA9IHByb2plY3REYXRhWzBdLnRvdGFsQ2FycGV0QXJlYTtcclxuXHJcbiAgICAgIGxldCBjb3N0SGVhZDogQ29zdEhlYWQgPSBjb3N0SGVhZEZyb21SYXRlQW5hbHlzaXM7XHJcbiAgICAgIGNvc3RIZWFkLmJ1ZGdldGVkQ29zdEFtb3VudCA9IGJ1ZGdldGVkQ29zdEFtb3VudDtcclxuICAgICAgbGV0IHRodW1iUnVsZVJhdGUgPSBuZXcgVGh1bWJSdWxlUmF0ZSgpO1xyXG5cclxuICAgICAgdGh1bWJSdWxlUmF0ZS5zYWxlYWJsZUFyZWEgPSB0aGlzLmNhbGN1bGF0ZVRodW1iUnVsZVJhdGVGb3JBcmVhKGJ1ZGdldGVkQ29zdEFtb3VudCwgdG90YWxTYWxlYWJsZUFyZWFPZlByb2plY3QpO1xyXG4gICAgICB0aHVtYlJ1bGVSYXRlLnNsYWJBcmVhID0gdGhpcy5jYWxjdWxhdGVUaHVtYlJ1bGVSYXRlRm9yQXJlYShidWRnZXRlZENvc3RBbW91bnQsIHRvdGFsU2xhYkFyZWFPZlByb2plY3QpO1xyXG4gICAgICB0aHVtYlJ1bGVSYXRlLmNhcnBldEFyZWEgPSB0aGlzLmNhbGN1bGF0ZVRodW1iUnVsZVJhdGVGb3JBcmVhKGJ1ZGdldGVkQ29zdEFtb3VudCwgdG90YWxDYXJwZXRBcmVhT2ZQcm9qZWN0KTtcclxuXHJcbiAgICAgIGNvc3RIZWFkLnRodW1iUnVsZVJhdGUgPSB0aHVtYlJ1bGVSYXRlO1xyXG4gICAgICBjb3N0SGVhZHMucHVzaChjb3N0SGVhZCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNhbGN1bGF0ZVRodW1iUnVsZVJhdGVGb3JBcmVhKGJ1ZGdldGVkQ29zdEFtb3VudDogbnVtYmVyLCBhcmVhOiBudW1iZXIpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGNhbGN1bGF0ZVRodW1iUnVsZVJhdGVGb3JBcmVhIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgbGV0IGJ1ZGdldENvc3RSYXRlcyA9IG5ldyBCdWRnZXRDb3N0UmF0ZXMoKTtcclxuICAgIGJ1ZGdldENvc3RSYXRlcy5zcWZ0ID0gKGJ1ZGdldGVkQ29zdEFtb3VudCAvIGFyZWEpO1xyXG4gICAgYnVkZ2V0Q29zdFJhdGVzLnNxbXQgPSAoYnVkZ2V0Q29zdFJhdGVzLnNxZnQgKiBjb25maWcuZ2V0KENvbnN0YW50cy5TUVVBUkVfTUVURVIpKTtcclxuICAgIHJldHVybiBidWRnZXRDb3N0UmF0ZXM7XHJcbiAgfX1cclxuXHJcbk9iamVjdC5zZWFsKFByb2plY3RTZXJ2aWNlKTtcclxuZXhwb3J0ID0gUHJvamVjdFNlcnZpY2U7XHJcbiJdfQ==
