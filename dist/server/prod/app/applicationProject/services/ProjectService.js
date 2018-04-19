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
var WorkItem = require("../dataaccess/model/project/building/WorkItem");
var RateAnalysisService = require("./RateAnalysisService");
var Category = require("../dataaccess/model/project/building/Category");
var config = require('config');
var log4js = require('log4js');
var mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;
var alasql = require("alasql");
var BudgetCostRates = require("../dataaccess/model/project/reports/BudgetCostRates");
var ThumbRuleRate = require("../dataaccess/model/project/reports/ThumbRuleRate");
var Constants = require("../../applicationProject/shared/constants");
var CategoriesListWithRatesDTO = require("../dataaccess/dto/project/CategoriesListWithRatesDTO");
var CentralizedRate = require("../dataaccess/model/project/CentralizedRate");
var messages = require("../../applicationProject/shared/messages");
var CommonService_1 = require("../../applicationProject/shared/CommonService");
var WorkItemListWithRatesDTO = require("../dataaccess/dto/project/WorkItemListWithRatesDTO");
var CCPromise = require('promise/lib/es6-extensions');
var logger = log4js.getLogger('Project service');
var ProjectService = (function () {
    function ProjectService() {
        this.projectRepository = new ProjectRepository();
        this.buildingRepository = new BuildingRepository();
        this.APP_NAME = ProjectAsset.APP_NAME;
        this.authInterceptor = new AuthInterceptor();
        this.userService = new UserService();
        this.commonService = new CommonService_1.CommonService();
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
        var buildingId = '';
        this.getProjectAndBuildingDetails(projectDetails._id, buildingId, function (error, projectAndBuildingDetails) {
            if (error) {
                logger.error('Project service, getProjectAndBuildingDetails failed');
                callback(error, null);
            }
            else {
                logger.info('Project service, syncProjectWithRateAnalysisData.');
                var projectData = projectAndBuildingDetails.data[0];
                var buildings = projectAndBuildingDetails.data[0].buildings;
                var buildingData = void 0;
                delete projectDetails._id;
                projectDetails.projectCostHeads = _this.calculateBudgetCostForCommonAmmenities(projectData.projectCostHeads, projectData, buildingData);
                _this.projectRepository.findOneAndUpdate(query, projectDetails, { new: true }, function (error, result) {
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
        var projection = { 'costHeads': 1 };
        this.buildingRepository.findByIdWithProjection(buildingId, projection, function (error, result) {
            logger.info('Project service, findOneAndUpdate has been hit');
            if (error) {
                callback(error, null);
            }
            else {
                var projectDetails = void 0;
                buildingDetails.costHeads = _this.calculateBudgetCostForBuilding(result.costHeads, projectDetails, buildingDetails);
                _this.buildingRepository.findOneAndUpdate(query, buildingDetails, { new: true }, function (error, result) {
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
    ProjectService.prototype.getInActiveProjectCostHeads = function (projectId, user, callback) {
        var _this = this;
        logger.info('Project service, getInActiveCostHead has been hit');
        this.projectRepository.findById(projectId, function (error, result) {
            if (error) {
                callback(error, null);
            }
            else {
                logger.info('Project service, findById has been hit');
                logger.debug('getting InActive CostHead for Project Name : ' + result.name);
                var response = result.projectCostHeads;
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
    ProjectService.prototype.setProjectCostHeadStatus = function (projectId, costHeadId, costHeadActiveStatus, user, callback) {
        var _this = this;
        var query = { '_id': projectId, 'projectCostHeads.rateAnalysisId': costHeadId };
        var activeStatus = JSON.parse(costHeadActiveStatus);
        var newData = { $set: { 'projectCostHeads.$.active': activeStatus } };
        this.projectRepository.findOneAndUpdate(query, newData, { new: true }, function (err, response) {
            logger.info('Project service, findOneAndUpdate has been hit');
            if (err) {
                callback(err, null);
            }
            else {
                callback(null, { data: response, access_token: _this.authInterceptor.issueTokenWithUid(user) });
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
    ProjectService.prototype.getBuildingRateItemsByOriginalName = function (projectId, buildingId, originalRateItemName, user, callback) {
        var _this = this;
        var projection = { 'rates': 1, _id: 0 };
        this.buildingRepository.findByIdWithProjection(buildingId, projection, function (error, building) {
            logger.info('Project Service, getBuildingRateItemsByOriginalName has been hit');
            if (error) {
                callback(error, null);
            }
            else {
                var buildingRateItemsArray = building.rates;
                var centralizedRateItemsArray = _this.getRateItemsArray(buildingRateItemsArray, originalRateItemName);
                callback(null, { data: centralizedRateItemsArray, access_token: _this.authInterceptor.issueTokenWithUid(user) });
            }
        });
    };
    ProjectService.prototype.getRateItemsArray = function (originalRateItemsArray, originalRateItemName) {
        var centralizedRateItemsArray;
        centralizedRateItemsArray = alasql('SELECT * FROM ? where TRIM(originalItemName) = ?', [originalRateItemsArray, originalRateItemName]);
        return centralizedRateItemsArray;
    };
    ProjectService.prototype.getProjectRateItemsByOriginalName = function (projectId, originalRateItemName, user, callback) {
        var _this = this;
        var projection = { 'rates': 1, _id: 0 };
        this.projectRepository.findByIdWithProjection(projectId, projection, function (error, project) {
            logger.info('Project Service, getProjectRateItemsByOriginalName has been hit');
            if (error) {
                callback(error, null);
            }
            else {
                var projectRateItemsArray = project.rates;
                var centralizedRateItemsArray = _this.getRateItemsArray(projectRateItemsArray, originalRateItemName);
                callback(null, { data: centralizedRateItemsArray, access_token: _this.authInterceptor.issueTokenWithUid(user) });
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
                for (var _i = 0, response_2 = response; _i < response_2.length; _i++) {
                    var costHeadItem = response_2[_i];
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
                var inActiveWorkItems = new Array();
                for (var _i = 0, costHeadList_1 = costHeadList; _i < costHeadList_1.length; _i++) {
                    var costHeadData = costHeadList_1[_i];
                    if (costHeadId === costHeadData.rateAnalysisId) {
                        for (var _a = 0, _b = costHeadData.categories; _a < _b.length; _a++) {
                            var categoryData = _b[_a];
                            if (categoryId === categoryData.rateAnalysisId) {
                                for (var _c = 0, _d = categoryData.workItems; _c < _d.length; _c++) {
                                    var workItemData = _d[_c];
                                    if (!workItemData.active) {
                                        inActiveWorkItems.push(workItemData);
                                    }
                                }
                            }
                        }
                    }
                }
                var inActiveWorkItemsListWithBuildingRates = _this.getWorkItemListWithCentralizedRates(inActiveWorkItems, building.rates, false);
                callback(null, { data: inActiveWorkItemsListWithBuildingRates.workItems, access_token: _this.authInterceptor.issueTokenWithUid(user) });
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
                var inActiveWorkItems = new Array();
                for (var _i = 0, costHeadList_2 = costHeadList; _i < costHeadList_2.length; _i++) {
                    var costHeadData = costHeadList_2[_i];
                    if (costHeadId === costHeadData.rateAnalysisId) {
                        for (var _a = 0, _b = costHeadData.categories; _a < _b.length; _a++) {
                            var categoryData = _b[_a];
                            if (categoryId === categoryData.rateAnalysisId) {
                                for (var _c = 0, _d = categoryData.workItems; _c < _d.length; _c++) {
                                    var workItemData = _d[_c];
                                    if (!workItemData.active) {
                                        inActiveWorkItems.push(workItemData);
                                    }
                                }
                            }
                        }
                    }
                }
                var inActiveWorkItemsListWithProjectRates = _this.getWorkItemListWithCentralizedRates(inActiveWorkItems, project.rates, false);
                callback(null, { data: inActiveWorkItemsListWithProjectRates.workItems, access_token: _this.authInterceptor.issueTokenWithUid(user) });
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
                var centralizedRates_1 = building.rates;
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
                                        workItemData.rate.isEstimated = true;
                                        break;
                                    }
                                }
                                break;
                            }
                        }
                        break;
                    }
                }
                var query = { '_id': buildingId };
                var newData = { $set: { 'costHeads': costHeads } };
                _this.buildingRepository.findOneAndUpdate(query, newData, { new: true }, function (error, result) {
                    if (error) {
                        callback(error, null);
                    }
                    else {
                        if (result) {
                            console.log('building CostHeads Updated');
                            var rateItems = rate.rateItems;
                            var promiseArrayForUpdateBuildingCentralizedRates = [];
                            for (var _i = 0, rateItems_1 = rateItems; _i < rateItems_1.length; _i++) {
                                var rate_1 = rateItems_1[_i];
                                var rateObjectExistSQL = 'SELECT * FROM ? AS rates WHERE rates.itemName= ?';
                                var rateExistArray = alasql(rateObjectExistSQL, [centralizedRates_1, rate_1.itemName]);
                                if (rateExistArray.length > 0) {
                                    if (rateExistArray[0].rate !== rate_1.rate) {
                                        var updateRatePromise = _this.updateCentralizedRateForBuilding(buildingId, rate_1.itemName, rate_1.rate);
                                        promiseArrayForUpdateBuildingCentralizedRates.push(updateRatePromise);
                                    }
                                }
                                else {
                                    var rateItem = new CentralizedRate(rate_1.itemName, rate_1.originalItemName, rate_1.rate);
                                    var addNewRateItemPromise = _this.addNewCentralizedRateForBuilding(buildingId, rateItem);
                                    promiseArrayForUpdateBuildingCentralizedRates.push(addNewRateItemPromise);
                                }
                            }
                            if (promiseArrayForUpdateBuildingCentralizedRates.length !== 0) {
                                CCPromise.all(promiseArrayForUpdateBuildingCentralizedRates).then(function (data) {
                                    console.log('Rates Array updated : ' + JSON.stringify(centralizedRates_1));
                                    callback(null, { 'data': 'success' });
                                }).catch(function (e) {
                                    logger.error(' Promise failed for convertCostHeadsFromRateAnalysisToCostControl ! :' + JSON.stringify(e.message));
                                    CCPromise.reject(e.message);
                                });
                            }
                            else {
                                callback(null, { 'data': 'success' });
                            }
                        }
                    }
                });
            }
        });
    };
    ProjectService.prototype.updateDirectRateOfBuildingWorkItems = function (projectId, buildingId, costHeadId, categoryId, workItemId, directRate, user, callback) {
        var _this = this;
        logger.info('Project service, updateDirectRateOfBuildingWorkItems has been hit');
        var projection = { 'costHeads': 1 };
        this.buildingRepository.findByIdWithProjection(buildingId, projection, function (error, building) {
            if (error) {
                callback(error, null);
            }
            else {
                var costHeadList = building.costHeads;
                _this.updateDirectRate(costHeadList, costHeadId, categoryId, workItemId, directRate);
                var query = { _id: buildingId };
                var data = { $set: { 'costHeads': costHeadList } };
                _this.buildingRepository.findOneAndUpdate(query, data, { new: true }, function (error, building) {
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
    ProjectService.prototype.updateDirectRate = function (costHeadList, costHeadId, categoryId, workItemId, directRate) {
        var rate;
        for (var _i = 0, costHeadList_3 = costHeadList; _i < costHeadList_3.length; _i++) {
            var costHead = costHeadList_3[_i];
            if (costHeadId === costHead.rateAnalysisId) {
                var categoriesOfCostHead = costHead.categories;
                for (var _a = 0, categoriesOfCostHead_1 = categoriesOfCostHead; _a < categoriesOfCostHead_1.length; _a++) {
                    var categoryData = categoriesOfCostHead_1[_a];
                    if (categoryId === categoryData.rateAnalysisId) {
                        for (var _b = 0, _c = categoryData.workItems; _b < _c.length; _b++) {
                            var workItemData = _c[_b];
                            if (workItemId === workItemData.rateAnalysisId) {
                                rate = workItemData.rate;
                                rate.total = directRate;
                                rate.rateItems = [];
                                workItemData.isDirectRate = true;
                            }
                        }
                    }
                }
            }
        }
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
                var centralizedRatesOfProjects_1 = project.rates;
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
                                        workItemData.rate.isEstimated = true;
                                        break;
                                    }
                                }
                                break;
                            }
                        }
                        break;
                    }
                }
                var query = { '_id': projectId };
                var newData = { $set: { 'projectCostHeads': projectCostHeads } };
                _this.projectRepository.findOneAndUpdate(query, newData, { new: true }, function (error, result) {
                    if (error) {
                        callback(error, null);
                    }
                    else {
                        var rateItems = rate.rateItems;
                        var promiseArrayForProjectCentralizedRates = [];
                        for (var _i = 0, rateItems_2 = rateItems; _i < rateItems_2.length; _i++) {
                            var rate_2 = rateItems_2[_i];
                            var rateObjectExistSQL = 'SELECT * FROM ? AS rates WHERE rates.itemName= ?';
                            var rateExistArray = alasql(rateObjectExistSQL, [centralizedRatesOfProjects_1, rate_2.itemName]);
                            if (rateExistArray.length > 0) {
                                if (rateExistArray[0].rate !== rate_2.rate) {
                                    var updateRateOfProjectPromise = _this.updateCentralizedRateForProject(projectId, rate_2.itemName, rate_2.rate);
                                    promiseArrayForProjectCentralizedRates.push(updateRateOfProjectPromise);
                                }
                            }
                            else {
                                var rateItem = new CentralizedRate(rate_2.itemName, rate_2.originalItemName, rate_2.rate);
                                var addNewRateOfProjectPromise = _this.addNewCentralizedRateForProject(projectId, rateItem);
                                promiseArrayForProjectCentralizedRates.push(addNewRateOfProjectPromise);
                            }
                        }
                        if (promiseArrayForProjectCentralizedRates.length !== 0) {
                            CCPromise.all(promiseArrayForProjectCentralizedRates).then(function (data) {
                                console.log('Rates Array updated : ' + JSON.stringify(centralizedRatesOfProjects_1));
                                callback(null, { 'data': 'success' });
                            }).catch(function (e) {
                                logger.error(' Promise failed for convertCostHeadsFromRateAnalysisToCostControl ! :' + JSON.stringify(e.message));
                                var errorObj = new Error();
                                errorObj.message = e;
                                callback(errorObj, null);
                            });
                        }
                        else {
                            callback(null, { 'data': 'success' });
                        }
                    }
                });
            }
        });
    };
    ProjectService.prototype.updateDirectRateOfProjectWorkItems = function (projectId, costHeadId, categoryId, workItemId, directRate, user, callback) {
        var _this = this;
        logger.info('Project service, updateDirectRateOfProjectWorkItems has been hit');
        var projection = { 'projectCostHeads': 1 };
        this.projectRepository.findByIdWithProjection(projectId, projection, function (error, project) {
            if (error) {
                callback(error, null);
            }
            else {
                var costHeadList = project.projectCostHeads;
                _this.updateDirectRate(costHeadList, costHeadId, categoryId, workItemId, directRate);
                var query = { _id: projectId };
                var data = { $set: { 'projectCostHeads': costHeadList } };
                _this.projectRepository.findOneAndUpdate(query, data, { new: true }, function (error, project) {
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
    ProjectService.prototype.deleteQuantityOfBuildingCostHeadsByName = function (projectId, buildingId, costHeadId, categoryId, workItemId, itemName, user, callback) {
        var _this = this;
        logger.info('Project service, deleteQuantity has been hit');
        this.buildingRepository.findById(buildingId, function (error, building) {
            if (error) {
                callback(error, null);
            }
            else {
                var quantityItems = void 0;
                for (var _i = 0, _a = building.costHeads; _i < _a.length; _i++) {
                    var costHead = _a[_i];
                    if (costHead.rateAnalysisId === costHeadId) {
                        for (var _b = 0, _c = costHead.categories; _b < _c.length; _b++) {
                            var category = _c[_b];
                            if (category.rateAnalysisId === categoryId) {
                                for (var _d = 0, _e = category.workItems; _d < _e.length; _d++) {
                                    var workItem = _e[_d];
                                    if (workItem.rateAnalysisId === workItemId) {
                                        quantityItems = workItem.quantity.quantityItemDetails;
                                        for (var quantityIndex = 0; quantityIndex < quantityItems.length; quantityIndex++) {
                                            if (quantityItems[quantityIndex].name === itemName) {
                                                quantityItems.splice(quantityIndex, 1);
                                            }
                                        }
                                        workItem.quantity.total = alasql('VALUE OF SELECT ROUND(SUM(total),2) FROM ?', [quantityItems]);
                                    }
                                }
                            }
                        }
                    }
                }
                var query = { _id: buildingId };
                var data = { $set: { 'costHeads': building.costHeads } };
                _this.buildingRepository.findOneAndUpdate(query, data, { new: true }, function (error, building) {
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
    ProjectService.prototype.deleteQuantityOfProjectCostHeadsByName = function (projectId, costHeadId, categoryId, workItemId, itemName, user, callback) {
        var _this = this;
        logger.info('Project service, deleteQuantity has been hit');
        this.projectRepository.findById(projectId, function (error, project) {
            if (error) {
                callback(error, null);
            }
            else {
                var quantityItems = void 0;
                for (var _i = 0, _a = project.projectCostHeads; _i < _a.length; _i++) {
                    var costHead = _a[_i];
                    if (costHead.rateAnalysisId === costHeadId) {
                        for (var _b = 0, _c = costHead.categories; _b < _c.length; _b++) {
                            var category = _c[_b];
                            if (category.rateAnalysisId === categoryId) {
                                for (var _d = 0, _e = category.workItems; _d < _e.length; _d++) {
                                    var workItem = _e[_d];
                                    if (workItem.rateAnalysisId === workItemId) {
                                        quantityItems = workItem.quantity.quantityItemDetails;
                                        for (var quantityIndex = 0; quantityIndex < quantityItems.length; quantityIndex++) {
                                            if (quantityItems[quantityIndex].name === itemName) {
                                                quantityItems.splice(quantityIndex, 1);
                                            }
                                        }
                                        workItem.quantity.total = alasql('VALUE OF SELECT ROUND(SUM(total),2) FROM ?', [quantityItems]);
                                    }
                                }
                            }
                        }
                    }
                }
                var query = { _id: projectId };
                var data = { $set: { 'projectCostHeads': project.projectCostHeads } };
                _this.projectRepository.findOneAndUpdate(query, data, { new: true }, function (error, project) {
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
                for (var _i = 0, costHeadList_4 = costHeadList; _i < costHeadList_4.length; _i++) {
                    var costHeadData = costHeadList_4[_i];
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
                for (var _i = 0, costHeadList_5 = costHeadList; _i < costHeadList_5.length; _i++) {
                    var costHeadData = costHeadList_5[_i];
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
        var newData = { $set: {
                'costHeads.$.budgetedCostAmount': costHeadBudgetedAmount.budgetedCostAmount,
            } };
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
    ProjectService.prototype.updateBudgetedCostForProjectCostHead = function (projectId, costHeadBudgetedAmount, user, callback) {
        var _this = this;
        logger.info('Project service, updateBudgetedCostForCostHead has been hit');
        var query = { '_id': projectId, 'projectCostHeads.name': costHeadBudgetedAmount.costHead };
        var newData = { $set: {
                'projectCostHeads.$.budgetedCostAmount': costHeadBudgetedAmount.budgetedCostAmount,
            } };
        this.projectRepository.findOneAndUpdate(query, newData, { new: true }, function (err, response) {
            logger.info('Project service, findOneAndUpdate has been hit');
            if (err) {
                callback(err, null);
            }
            else {
                callback(null, { data: response, access_token: _this.authInterceptor.issueTokenWithUid(user) });
            }
        });
    };
    ProjectService.prototype.updateQuantityOfBuildingCostHeads = function (projectId, buildingId, costHeadId, categoryId, workItemId, quantityDetail, user, callback) {
        var _this = this;
        logger.info('Project service, updateQuantityOfBuildingCostHeads has been hit');
        this.buildingRepository.findById(buildingId, function (error, building) {
            if (error) {
                callback(error, null);
            }
            else {
                var costHeadList = building.costHeads;
                var quantity = void 0;
                for (var _i = 0, costHeadList_6 = costHeadList; _i < costHeadList_6.length; _i++) {
                    var costHead = costHeadList_6[_i];
                    if (costHeadId === costHead.rateAnalysisId) {
                        var categoriesOfCostHead = costHead.categories;
                        for (var _a = 0, categoriesOfCostHead_2 = categoriesOfCostHead; _a < categoriesOfCostHead_2.length; _a++) {
                            var categoryData = categoriesOfCostHead_2[_a];
                            if (categoryId === categoryData.rateAnalysisId) {
                                for (var _b = 0, _c = categoryData.workItems; _b < _c.length; _b++) {
                                    var workItemData = _c[_b];
                                    if (workItemId === workItemData.rateAnalysisId) {
                                        quantity = workItemData.quantity;
                                        quantity.isEstimated = true;
                                        _this.updateQuantityItemsOfWorkItem(quantity, quantityDetail);
                                    }
                                }
                            }
                        }
                    }
                }
                var query = { _id: buildingId };
                var data = { $set: { 'costHeads': costHeadList } };
                _this.buildingRepository.findOneAndUpdate(query, data, { new: true }, function (error, building) {
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
    ProjectService.prototype.updateDirectQuantityOfBuildingWorkItems = function (projectId, buildingId, costHeadId, categoryId, workItemId, directQuantity, user, callback) {
        var _this = this;
        logger.info('Project service, updateDirectQuantityOfBuildingCostHeads has been hit');
        var projection = { costHeads: 1 };
        this.buildingRepository.findByIdWithProjection(buildingId, projection, function (error, building) {
            if (error) {
                callback(error, null);
            }
            else {
                var costHeadList = building.costHeads;
                _this.setDirectQuantityOfWorkItem(costHeadList, costHeadId, categoryId, workItemId, directQuantity);
                var query = { _id: buildingId };
                var data = { $set: { 'costHeads': costHeadList } };
                _this.buildingRepository.findOneAndUpdate(query, data, { new: true }, function (error, building) {
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
    ProjectService.prototype.updateDirectQuantityOfProjectWorkItems = function (projectId, costHeadId, categoryId, workItemId, directQuantity, user, callback) {
        var _this = this;
        logger.info('Project service, updateDirectQuantityOfProjectWorkItems has been hit');
        var projection = { projectCostHeads: 1 };
        this.projectRepository.findByIdWithProjection(projectId, projection, function (error, project) {
            if (error) {
                callback(error, null);
            }
            else {
                var costHeadList = project.projectCostHeads;
                _this.setDirectQuantityOfWorkItem(costHeadList, costHeadId, categoryId, workItemId, directQuantity);
                var query = { _id: projectId };
                var data = { $set: { 'projectCostHeads': costHeadList } };
                _this.projectRepository.findOneAndUpdate(query, data, { new: true }, function (error, building) {
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
    ProjectService.prototype.setDirectQuantityOfWorkItem = function (costHeadList, costHeadId, categoryId, workItemId, directQuantity) {
        var quantity;
        for (var _i = 0, costHeadList_7 = costHeadList; _i < costHeadList_7.length; _i++) {
            var costHead = costHeadList_7[_i];
            if (costHeadId === costHead.rateAnalysisId) {
                var categoriesOfCostHead = costHead.categories;
                for (var _a = 0, categoriesOfCostHead_3 = categoriesOfCostHead; _a < categoriesOfCostHead_3.length; _a++) {
                    var categoryData = categoriesOfCostHead_3[_a];
                    if (categoryId === categoryData.rateAnalysisId) {
                        for (var _b = 0, _c = categoryData.workItems; _b < _c.length; _b++) {
                            var workItemData = _c[_b];
                            if (workItemId === workItemData.rateAnalysisId) {
                                quantity = workItemData.quantity;
                                quantity.isEstimated = true;
                                quantity.isDirectQuantity = true;
                                quantity.total = directQuantity;
                                quantity.quantityItemDetails = [];
                            }
                        }
                    }
                }
            }
        }
    };
    ProjectService.prototype.updateQuantityItemsOfWorkItem = function (quantity, quantityDetail) {
        quantity.isEstimated = true;
        if (quantity.quantityItemDetails.length === 0) {
            quantityDetail.total = alasql('VALUE OF SELECT ROUND(SUM(quantity),2) FROM ?', [quantityDetail.quantityItems]);
            quantity.quantityItemDetails.push(quantityDetail);
        }
        else {
            var isDefaultExistsSQL = 'SELECT name from ? AS quantityDetails where quantityDetails.name="default"';
            var isDefaultExistsQuantityDetail = alasql(isDefaultExistsSQL, [quantity.quantityItemDetails]);
            if (isDefaultExistsQuantityDetail.length > 0) {
                quantity.quantityItemDetails = [];
                quantityDetail.total = alasql('VALUE OF SELECT ROUND(SUM(quantity),2) FROM ?', [quantityDetail.quantityItems]);
                quantity.quantityItemDetails.push(quantityDetail);
            }
            else {
                if (quantityDetail.name !== 'default') {
                    var isItemAlreadyExistSQL = 'SELECT name from ? AS quantityDetails where quantityDetails.name="' + quantityDetail.name + '"';
                    var isItemAlreadyExists = alasql(isItemAlreadyExistSQL, [quantity.quantityItemDetails]);
                    if (isItemAlreadyExists.length > 0) {
                        for (var quantityindex = 0; quantityindex < quantity.quantityItemDetails.length; quantityindex++) {
                            if (quantity.quantityItemDetails[quantityindex].name === quantityDetail.name) {
                                quantity.quantityItemDetails[quantityindex].quantityItems = quantityDetail.quantityItems;
                                quantity.quantityItemDetails[quantityindex].total = alasql('VALUE OF SELECT ROUND(SUM(quantity),2) FROM ?', [quantityDetail.quantityItems]);
                            }
                        }
                    }
                    else {
                        quantityDetail.total = alasql('VALUE OF SELECT ROUND(SUM(quantity),2) FROM ?', [quantityDetail.quantityItems]);
                        quantity.quantityItemDetails.push(quantityDetail);
                    }
                }
                else {
                    quantity.quantityItemDetails = [];
                    quantityDetail.total = alasql('VALUE OF SELECT ROUND(SUM(quantity),2) FROM ?', [quantityDetail.quantityItems]);
                    quantity.quantityItemDetails.push(quantityDetail);
                }
            }
        }
        quantity.total = alasql('VALUE OF SELECT ROUND(SUM(total),2) FROM ?', [quantity.quantityItemDetails]);
    };
    ProjectService.prototype.updateQuantityOfProjectCostHeads = function (projectId, costHeadId, categoryId, workItemId, quantityDetails, user, callback) {
        var _this = this;
        logger.info('Project service, Update Quantity Of Project Cost Heads has been hit');
        this.projectRepository.findById(projectId, function (error, project) {
            if (error) {
                callback(error, null);
            }
            else {
                var costHeadList = project.projectCostHeads;
                var quantity = void 0;
                for (var _i = 0, costHeadList_8 = costHeadList; _i < costHeadList_8.length; _i++) {
                    var costHead = costHeadList_8[_i];
                    if (costHeadId === costHead.rateAnalysisId) {
                        var categoriesOfCostHead = costHead.categories;
                        for (var _a = 0, categoriesOfCostHead_4 = categoriesOfCostHead; _a < categoriesOfCostHead_4.length; _a++) {
                            var categoryData = categoriesOfCostHead_4[_a];
                            if (categoryId === categoryData.rateAnalysisId) {
                                var workItemsOfCategory = categoryData.workItems;
                                for (var _b = 0, workItemsOfCategory_1 = workItemsOfCategory; _b < workItemsOfCategory_1.length; _b++) {
                                    var workItemData = workItemsOfCategory_1[_b];
                                    if (workItemId === workItemData.rateAnalysisId) {
                                        quantity = workItemData.quantity;
                                        quantity.isEstimated = true;
                                        _this.updateQuantityItemsOfWorkItem(quantity, quantityDetails);
                                    }
                                }
                            }
                        }
                    }
                }
                var query = { _id: projectId };
                var data = { $set: { 'projectCostHeads': costHeadList } };
                _this.projectRepository.findOneAndUpdate(query, data, { new: true }, function (error, project) {
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
    ProjectService.prototype.getWorkItemListOfBuildingCategory = function (projectId, buildingId, costHeadId, categoryId, user, callback) {
        var _this = this;
        logger.info('Project service, getWorkItemListOfBuildingCategory has been hit');
        var query = [
            { $match: { '_id': ObjectId(buildingId), 'costHeads.rateAnalysisId': costHeadId } },
            { $unwind: '$costHeads' },
            { $project: { 'costHeads': 1, 'rates': 1 } },
            { $unwind: '$costHeads.categories' },
            { $match: { 'costHeads.categories.rateAnalysisId': categoryId } },
            { $project: { 'costHeads.categories.workItems': 1, 'rates': 1 } }
        ];
        this.buildingRepository.aggregate(query, function (error, result) {
            logger.info('Project service, Get workitems for specific category has been hit');
            if (error) {
                callback(error, null);
            }
            else {
                if (result.length > 0) {
                    var workItemsOfBuildingCategory = result[0].costHeads.categories.workItems;
                    var workItemsListWithBuildingRates = _this.getWorkItemListWithCentralizedRates(workItemsOfBuildingCategory, result[0].rates, true);
                    callback(null, { data: workItemsListWithBuildingRates.workItems, access_token: _this.authInterceptor.issueTokenWithUid(user) });
                }
                else {
                    var error_1 = new Error();
                    error_1.message = messages.MSG_ERROR_EMPTY_RESPONSE;
                    callback(error_1, null);
                }
            }
        });
    };
    ProjectService.prototype.getWorkItemListOfProjectCategory = function (projectId, costHeadId, categoryId, user, callback) {
        var _this = this;
        logger.info('Project service, getWorkItemListOfProjectCategory has been hit');
        var query = [
            { $match: { '_id': ObjectId(projectId), 'projectCostHeads.rateAnalysisId': costHeadId } },
            { $unwind: '$projectCostHeads' },
            { $project: { 'projectCostHeads': 1, 'rates': 1 } },
            { $unwind: '$projectCostHeads.categories' },
            { $match: { 'projectCostHeads.categories.rateAnalysisId': categoryId } },
            { $project: { 'projectCostHeads.categories.workItems': 1, 'rates': 1 } }
        ];
        this.projectRepository.aggregate(query, function (error, result) {
            logger.info('Project service, Get workitems By Cost Head & category Id has been hit');
            if (error) {
                callback(error, null);
            }
            else {
                if (result.length > 0) {
                    var workItemsOfCategory = result[0].projectCostHeads.categories.workItems;
                    var workItemsListWithRates = _this.getWorkItemListWithCentralizedRates(workItemsOfCategory, result[0].rates, true);
                    callback(null, { data: workItemsListWithRates.workItems, access_token: _this.authInterceptor.issueTokenWithUid(user) });
                }
                else {
                    var error_2 = new Error();
                    error_2.message = messages.MSG_ERROR_EMPTY_RESPONSE;
                    callback(error_2, null);
                }
            }
        });
    };
    ProjectService.prototype.getWorkItemListWithCentralizedRates = function (workItemsOfCategory, centralizedRates, isWorkItemActive) {
        var workItemsListWithRates = new WorkItemListWithRatesDTO();
        for (var _i = 0, workItemsOfCategory_2 = workItemsOfCategory; _i < workItemsOfCategory_2.length; _i++) {
            var workItemData = workItemsOfCategory_2[_i];
            if (workItemData.active === isWorkItemActive) {
                var workItem = workItemData;
                var rateItemsOfWorkItem = workItemData.rate.rateItems;
                workItem.rate.rateItems = this.getRatesFromCentralizedrates(rateItemsOfWorkItem, centralizedRates);
                var arrayOfRateItems = workItem.rate.rateItems;
                var totalOfAllRateItems = alasql('VALUE OF SELECT SUM(totalAmount) FROM ?', [arrayOfRateItems]);
                if (!workItem.isDirectRate) {
                    workItem.rate.total = totalOfAllRateItems / workItem.rate.quantity;
                }
                var quantityItems = workItem.quantity.quantityItemDetails;
                if (!workItem.quantity.isDirectQuantity) {
                    workItem.quantity.total = alasql('VALUE OF SELECT ROUND(SUM(total),2) FROM ?', [quantityItems]);
                }
                if (workItem.rate.isEstimated && workItem.quantity.isEstimated) {
                    workItem.amount = workItem.rate.total * workItem.quantity.total;
                    workItemsListWithRates.workItemsAmount = workItemsListWithRates.workItemsAmount + workItem.amount;
                }
                workItemsListWithRates.workItems.push(workItem);
            }
        }
        return workItemsListWithRates;
    };
    ProjectService.prototype.getRatesFromCentralizedrates = function (rateItemsOfWorkItem, centralizedRates) {
        var rateItemsSQL = 'SELECT rateItem.itemName, rateItem.originalItemName, rateItem.rateAnalysisId, rateItem.type,' +
            'rateItem.quantity, centralizedRates.rate, rateItem.unit, rateItem.totalAmount, rateItem.totalQuantity ' +
            'FROM ? AS rateItem JOIN ? AS centralizedRates ON rateItem.itemName = centralizedRates.itemName';
        var rateItemsForWorkItem = alasql(rateItemsSQL, [rateItemsOfWorkItem, centralizedRates]);
        return rateItemsForWorkItem;
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
                var buildingCostHeads = building.costHeads;
                var categoriesListWithCentralizedRates = void 0;
                for (var _i = 0, buildingCostHeads_1 = buildingCostHeads; _i < buildingCostHeads_1.length; _i++) {
                    var costHeadData = buildingCostHeads_1[_i];
                    if (costHeadData.rateAnalysisId === costHeadId) {
                        categoriesListWithCentralizedRates = _this.getCategoriesListWithCentralizedRates(costHeadData.categories, building.rates);
                        break;
                    }
                }
                callback(null, { data: categoriesListWithCentralizedRates, access_token: _this.authInterceptor.issueTokenWithUid(user) });
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
                var projectCostHeads = project.projectCostHeads;
                var categoriesListWithCentralizedRates = void 0;
                for (var _i = 0, projectCostHeads_2 = projectCostHeads; _i < projectCostHeads_2.length; _i++) {
                    var costHeadData = projectCostHeads_2[_i];
                    if (costHeadData.rateAnalysisId === costHeadId) {
                        categoriesListWithCentralizedRates = _this.getCategoriesListWithCentralizedRates(costHeadData.categories, project.rates);
                        break;
                    }
                }
                callback(null, { data: categoriesListWithCentralizedRates, access_token: _this.authInterceptor.issueTokenWithUid(user) });
            }
        });
    };
    ProjectService.prototype.getCostHeadDetailsOfBuilding = function (projectId, buildingId, costHeadId, user, callback) {
        var _this = this;
        logger.info('Project service, Get Project CostHead Categories has been hit');
        var query = [
            { $match: { '_id': ObjectId(buildingId) } },
            { $project: { 'costHeads': 1, 'rates': 1 } },
            { $unwind: '$costHeads' },
            { $match: { 'costHeads.rateAnalysisId': costHeadId } },
            { $project: { 'costHeads': 1, '_id': 0, 'rates': 1 } }
        ];
        this.buildingRepository.aggregate(query, function (error, result) {
            logger.info('Project service, Get workitems for specific category has been hit');
            if (error) {
                callback(error, null);
            }
            else {
                if (result.length > 0) {
                    var data = result[0].costHeads;
                    var categoriesListWithCentralizedRates = _this.getCategoriesListWithCentralizedRates(data.categories, result[0].rates);
                    callback(null, { data: data, access_token: _this.authInterceptor.issueTokenWithUid(user) });
                }
                else {
                    var error_3 = new Error();
                    error_3.message = messages.MSG_ERROR_EMPTY_RESPONSE;
                    callback(error_3, null);
                }
            }
        });
    };
    ProjectService.prototype.getCategoriesListWithCentralizedRates = function (categoriesOfCostHead, centralizedRates) {
        var categoriesTotalAmount = 0;
        var categoriesListWithRates = new CategoriesListWithRatesDTO;
        for (var _i = 0, categoriesOfCostHead_5 = categoriesOfCostHead; _i < categoriesOfCostHead_5.length; _i++) {
            var categoryData = categoriesOfCostHead_5[_i];
            var workItems = this.getWorkItemListWithCentralizedRates(categoryData.workItems, centralizedRates, true);
            categoryData.amount = workItems.workItemsAmount;
            categoriesTotalAmount = categoriesTotalAmount + workItems.workItemsAmount;
            categoriesListWithRates.categories.push(categoryData);
        }
        if (categoriesTotalAmount !== 0) {
            categoriesListWithRates.categoriesAmount = categoriesTotalAmount;
        }
        return categoriesListWithRates;
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
                    CCPromise.all([
                        syncBuildingCostHeadsPromise,
                        syncProjectCostHeadsPromise
                    ]).then(function (data) {
                        logger.info('Promise for syncProjectWithRateAnalysisData for Project and Building success');
                        var buildingCostHeadsData = data[0];
                        var projectCostHeadsData = data[1];
                        callback(null, { status: 200 });
                    }).catch(function (e) {
                        logger.error(' Promise failed for syncProjectWithRateAnalysisData ! :' + JSON.stringify(e.message));
                        CCPromise.reject(e.message);
                    });
                }
            }
        });
    };
    ProjectService.prototype.updateCostHeadsForBuildingAndProject = function (callback, projectData, buildingData, buildingId, projectId) {
        var _this = this;
        logger.info('updateCostHeadsForBuildingAndProject has been hit');
        var rateAnalysisService = new RateAnalysisService();
        var buildingRepository = new BuildingRepository();
        var projectRepository = new ProjectRepository();
        rateAnalysisService.convertCostHeadsFromRateAnalysisToCostControl(Constants.BUILDING, function (error, result) {
            if (error) {
                logger.error('Error in updateCostHeadsForBuildingAndProject : convertCostHeadsFromRateAnalysisToCostControl : '
                    + JSON.stringify(error));
                callback(error, null);
            }
            else {
                logger.info('GetAllDataFromRateAnalysis success');
                var buidingCostHeads = result.buildingCostHeads;
                var projectService_1 = new ProjectService();
                var configCostHeads = config.get('configCostHeads');
                _this.convertConfigCostHeads(configCostHeads, buidingCostHeads);
                var data = projectService_1.calculateBudgetCostForBuilding(buidingCostHeads, projectData, buildingData);
                var rates = _this.getRates(result, data);
                var queryForBuilding = { '_id': buildingId };
                var updateCostHead = { $set: { 'costHeads': data, 'rates': rates } };
                buildingRepository.findOneAndUpdate(queryForBuilding, updateCostHead, { new: true }, function (error, response) {
                    if (error) {
                        logger.error('Error in Update convertCostHeadsFromRateAnalysisToCostControl buildingCostHeadsData  : '
                            + JSON.stringify(error));
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
        return new CCPromise(function (resolve, reject) {
            var rateAnalysisService = new RateAnalysisService();
            var projectService = new ProjectService();
            var buildingRepository = new BuildingRepository();
            logger.info('Inside updateBudgetRatesForBuildingCostHeads promise.');
            rateAnalysisService.convertCostHeadsFromRateAnalysisToCostControl(entity, function (error, result) {
                if (error) {
                    logger.err('Error in promise updateBudgetRatesForBuildingCostHeads : ' + JSON.stringify(error));
                    reject(error);
                }
                else {
                    logger.info('Inside updateBudgetRatesForBuildingCostHeads success');
                    var projectService_2 = new ProjectService();
                    var buidingCostHeads = result.buildingCostHeads;
                    var configCostHeads = config.get('configCostHeads');
                    projectService_2.convertConfigCostHeads(configCostHeads, buidingCostHeads);
                    var buildingCostHeads = projectService_2.calculateBudgetCostForBuilding(buidingCostHeads, projectDetails, buildingDetails);
                    var rates = projectService_2.getRates(result, buildingCostHeads);
                    var query = { '_id': buildingId };
                    var newData = { $set: { 'costHeads': buildingCostHeads, 'rates': rates } };
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
        }).catch(function (e) {
            logger.error('Error in updateBudgetRatesForBuildingCostHeads :' + JSON.stringify(e.message));
            CCPromise.reject(e.message);
        });
    };
    ProjectService.prototype.getRates = function (result, costHeads) {
        var getRatesListSQL = 'SELECT * FROM ? AS q WHERE q.C4 IN (SELECT t.rateAnalysisId ' +
            'FROM ? AS t)';
        var rateItems = alasql(getRatesListSQL, [result.rates, costHeads]);
        var rateItemsRateAnalysisSQL = 'SELECT rateItem.C2 AS itemName, rateItem.C2 AS originalItemName,' +
            'rateItem.C12 AS rateAnalysisId, rateItem.C6 AS type,' +
            'ROUND(rateItem.C7,2) AS quantity, ROUND(rateItem.C3,2) AS rate, unit.C2 AS unit,' +
            'ROUND(rateItem.C3 * rateItem.C7,2) AS totalAmount, rateItem.C5 AS totalQuantity ' +
            'FROM ? AS rateItem JOIN ? AS unit ON unit.C1 = rateItem.C9';
        var rateItemsList = alasql(rateItemsRateAnalysisSQL, [rateItems, result.units]);
        var distinctItemsSQL = 'select DISTINCT itemName,originalItemName,rate FROM ?';
        var distinctRates = alasql(distinctItemsSQL, [rateItemsList]);
        return distinctRates;
    };
    ProjectService.prototype.convertConfigCostHeads = function (configCostHeads, costHeadsData) {
        for (var _i = 0, configCostHeads_1 = configCostHeads; _i < configCostHeads_1.length; _i++) {
            var configCostHead = configCostHeads_1[_i];
            var costHead = new CostHead();
            costHead.name = configCostHead.name;
            costHead.rateAnalysisId = configCostHead.rateAnalysisId;
            var categoriesList = new Array();
            for (var _a = 0, _b = configCostHead.categories; _a < _b.length; _a++) {
                var configCategory = _b[_a];
                var category = new Category(configCategory.name, configCategory.rateAnalysisId);
                var workItemsList = new Array();
                for (var _c = 0, _d = configCategory.workItems; _c < _d.length; _c++) {
                    var configWorkItem = _d[_c];
                    var workItem = new WorkItem(configWorkItem.name, configWorkItem.rateAnalysisId);
                    workItem.isDirectRate = true;
                    workItem.unit = configWorkItem.measurementUnit;
                    if (configWorkItem.directRate !== null) {
                        workItem.rate.total = configWorkItem.directRate;
                    }
                    else {
                        workItem.rate.total = 0;
                    }
                    workItem.rate.isEstimated = true;
                    workItemsList.push(workItem);
                }
                category.workItems = workItemsList;
                categoriesList.push(category);
            }
            costHead.categories = categoriesList;
            costHead.thumbRuleRate = config.get(Constants.THUMBRULE_RATE);
            costHeadsData.push(costHead);
        }
        return costHeadsData;
    };
    ProjectService.prototype.updateBudgetRatesForProjectCostHeads = function (entity, projectId, projectDetails, buildingDetails) {
        return new CCPromise(function (resolve, reject) {
            var rateAnalysisService = new RateAnalysisService();
            var projectRepository = new ProjectRepository();
            logger.info('Inside updateBudgetRatesForProjectCostHeads promise.');
            rateAnalysisService.convertCostHeadsFromRateAnalysisToCostControl(entity, function (error, result) {
                if (error) {
                    logger.err('Error in updateBudgetRatesForProjectCostHeads promise : ' + JSON.stringify(error));
                    reject(error);
                }
                else {
                    var projectService = new ProjectService();
                    var costHeadsFromRateAnalysis = result.buildingCostHeads;
                    var configProjectCostHeads = config.get('configProjectCostHeads');
                    projectService.convertConfigCostHeads(configProjectCostHeads, costHeadsFromRateAnalysis);
                    var projectCostHeads = projectService.calculateBudgetCostForCommonAmmenities(costHeadsFromRateAnalysis, projectDetails, buildingDetails);
                    var rates = projectService.getRates(result, projectCostHeads);
                    var query = { '_id': projectId };
                    var newData = { $set: { 'projectCostHeads': projectCostHeads, 'rates': rates } };
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
        }).catch(function (e) {
            logger.error('Error in updateBudgetRatesForProjectCostHeads :' + JSON.stringify(e.message));
            CCPromise.reject(e.message);
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
                    calculateBudgtedCost = budgetCostFormulae.replace(Constants.SLAB_AREA, buildingDetails.totalSlabArea);
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
                case Constants.PAINTING: {
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
                case Constants.WATER_PROOFING: {
                    budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
                    calculateBudgtedCost = budgetCostFormulae.replace(Constants.CARPET_AREA, buildingDetails.totalCarpetAreaOfUnit);
                    budgetedCostAmount = eval(calculateBudgtedCost);
                    this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
                    break;
                }
                case Constants.DEWATERING: {
                    budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
                    calculateBudgtedCost = budgetCostFormulae.replace(Constants.SALEABLE_AREA, buildingDetails.totalSaleableAreaOfUnit);
                    budgetedCostAmount = eval(calculateBudgtedCost);
                    this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
                    break;
                }
                case Constants.GARBAGE_CHUTE: {
                    budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
                    calculateBudgtedCost = budgetCostFormulae.replace(Constants.NUM_OF_FLOORS, buildingDetails.totalNumOfFloors)
                        .replace(Constants.NUM_OF_PARKING_FLOORS, buildingDetails.numOfParkingFloors);
                    budgetedCostAmount = eval(calculateBudgtedCost);
                    this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
                    break;
                }
                case Constants.LIFT: {
                    budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
                    calculateBudgtedCost = budgetCostFormulae.replace(Constants.NUM_OF_FLOORS, buildingDetails.totalNumOfFloors)
                        .replace(Constants.NUM_OF_LIFTS, buildingDetails.numOfLifts);
                    budgetedCostAmount = eval(calculateBudgtedCost);
                    this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
                    break;
                }
                case Constants.DOORS: {
                    budgetedCostAmount = 1;
                    this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
                    break;
                }
                case Constants.DADO_OR_WALL_TILING: {
                    budgetedCostAmount = 1;
                    this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
                    break;
                }
                case Constants.FLOORING: {
                    budgetedCostAmount = 1;
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
        var calculateProjectData = 'SELECT ROUND(SUM(building.totalCarpetAreaOfUnit),2) AS totalCarpetArea, ' +
            'ROUND(SUM(building.totalSlabArea),2) AS totalSlabAreaProject,' +
            'ROUND(SUM(building.totalSaleableAreaOfUnit),2) AS totalSaleableArea  FROM ? AS building';
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
                case Constants.CLUB_HOUSE: {
                    budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
                    calculateBudgtedCost = budgetCostFormulae.replace(Constants.TOTAL_SLAB_AREA_OF_CLUB_HOUSE, projectDetails.slabArea);
                    budgetedCostAmount = eval(calculateBudgtedCost);
                    this.calculateThumbRuleReportForProjectCostHead(budgetedCostAmount, costHead, projectDetails, costHeads);
                    break;
                }
                case Constants.SWIMMING_POOL: {
                    budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
                    calculateBudgtedCost = budgetCostFormulae.replace(Constants.SWIMMING_POOL_CAPACITY, projectDetails.poolCapacity);
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
    ProjectService.prototype.addNewCentralizedRateForBuilding = function (buildingId, rateItem) {
        return new CCPromise(function (resolve, reject) {
            logger.info('createPromiseForAddingNewRateItem has been hit for buildingId: ' + buildingId + ', rateItem : ' + rateItem);
            var buildingRepository = new BuildingRepository();
            var queryAddNewRateItem = { '_id': buildingId };
            var addNewRateRateData = { $push: { 'rates': rateItem } };
            buildingRepository.findOneAndUpdate(queryAddNewRateItem, addNewRateRateData, { new: true }, function (error, result) {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(result);
                }
            });
        }).catch(function (e) {
            logger.error('Promise failed for individual createPromiseForAddingNewRateItem! error :' + JSON.stringify(e.message));
            CCPromise.reject(e.message);
        });
    };
    ProjectService.prototype.updateCentralizedRateForBuilding = function (buildingId, rateItem, rateItemRate) {
        return new CCPromise(function (resolve, reject) {
            logger.info('createPromiseForRateUpdate has been hit for buildingId : ' + buildingId + ', rateItem : ' + rateItem);
            var buildingRepository = new BuildingRepository();
            var queryUpdateRate = { '_id': buildingId, 'rates.itemName': rateItem };
            var updateRate = { $set: { 'rates.$.rate': rateItemRate } };
            buildingRepository.findOneAndUpdate(queryUpdateRate, updateRate, { new: true }, function (error, result) {
                if (error) {
                    reject(error);
                }
                else {
                    console.log('Rate Updated');
                    resolve(result);
                }
            });
        }).catch(function (e) {
            logger.error('Promise failed for individual createPromiseForRateUpdate ! Error: ' + JSON.stringify(e.message));
            CCPromise.reject(e.message);
        });
    };
    ProjectService.prototype.addNewCentralizedRateForProject = function (projectId, rateItem) {
        return new CCPromise(function (resolve, reject) {
            logger.info('createPromiseForAddingNewRateItemInProjectRates has been hit for projectId : ' + projectId + ', rateItem : ' + rateItem);
            var projectRepository = new ProjectRepository();
            var addNewRateItemQueryProject = { '_id': projectId };
            var addNewRateRateDataProject = { $push: { 'rates': rateItem } };
            projectRepository.findOneAndUpdate(addNewRateItemQueryProject, addNewRateRateDataProject, { new: true }, function (error, result) {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(result);
                }
            });
        }).catch(function (e) {
            logger.error('Promise failed for individual createPromiseForAddingNewRateItemInProjectRates ! error :' + JSON.stringify(e.message));
            CCPromise.reject(e.message);
        });
    };
    ProjectService.prototype.updateCentralizedRateForProject = function (projectId, rateItem, rateItemRate) {
        return new CCPromise(function (resolve, reject) {
            logger.info('createPromiseForRateUpdateOfProjectRates has been hit for projectId : ' + projectId + ', rateItem : ' + rateItem);
            var projectRepository = new ProjectRepository();
            var queryUpdateRateForProject = { '_id': projectId, 'rates.itemName': rateItem };
            var updateRateForProject = { $set: { 'rates.$.rate': rateItemRate } };
            projectRepository.findOneAndUpdate(queryUpdateRateForProject, updateRateForProject, { new: true }, function (error, result) {
                if (error) {
                    reject(error);
                }
                else {
                    console.log('Rate Updated for Project rates');
                    resolve(result);
                }
            });
        }).catch(function (e) {
            logger.error('Promise failed for individual createPromiseForRateUpdateOfProjectRates ! Error: ' + JSON.stringify(e.message));
            CCPromise.reject(e.message);
        });
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
            var calculateProjectData = 'SELECT ROUND(SUM(building.totalCarpetAreaOfUnit),2) AS totalCarpetArea, ' +
                'ROUND(SUM(building.totalSlabArea),2) AS totalSlabAreaProject,' +
                'ROUND(SUM(building.totalSaleableAreaOfUnit),2) AS totalSaleableArea  FROM ? AS building';
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHBsaWNhdGlvblByb2plY3Qvc2VydmljZXMvUHJvamVjdFNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhFQUFpRjtBQUNqRixnRkFBbUY7QUFDbkYsb0VBQXVFO0FBQ3ZFLGtFQUFxRTtBQUlyRSw2RUFBZ0Y7QUFDaEYsOEVBQWlGO0FBQ2pGLDBFQUE2RTtBQUU3RSxnRUFBbUU7QUFDbkUsd0VBQTJFO0FBQzNFLHdFQUEyRTtBQUMzRSwyREFBOEQ7QUFDOUQsd0VBQTJFO0FBRTNFLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDL0IsbUNBQXFDO0FBQ3JDLElBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDO0FBQ3ZDLCtCQUFrQztBQUNsQyxxRkFBd0Y7QUFDeEYsaUZBQW9GO0FBQ3BGLHFFQUF3RTtBQUl4RSxpR0FBb0c7QUFDcEcsNkVBQWdGO0FBQ2hGLG1FQUF1RTtBQUN2RSwrRUFBOEU7QUFDOUUsNkZBQWdHO0FBRWhHLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0FBQ3RELElBQUksTUFBTSxHQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUUvQztJQVlFO1FBQ0UsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksaUJBQWlCLEVBQUUsQ0FBQztRQUNqRCxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxrQkFBa0IsRUFBRSxDQUFDO1FBQ25ELElBQUksQ0FBQyxRQUFRLEdBQUcsWUFBWSxDQUFDLFFBQVEsQ0FBQztRQUN0QyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksZUFBZSxFQUFFLENBQUM7UUFDN0MsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxh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L1Byb2plY3RTZXJ2aWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFByb2plY3RSZXBvc2l0b3J5ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L1Byb2plY3RSZXBvc2l0b3J5Jyk7XHJcbmltcG9ydCBCdWlsZGluZ1JlcG9zaXRvcnkgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL3JlcG9zaXRvcnkvQnVpbGRpbmdSZXBvc2l0b3J5Jyk7XHJcbmltcG9ydCBVc2VyU2VydmljZSA9IHJlcXVpcmUoJy4vLi4vLi4vZnJhbWV3b3JrL3NlcnZpY2VzL1VzZXJTZXJ2aWNlJyk7XHJcbmltcG9ydCBQcm9qZWN0QXNzZXQgPSByZXF1aXJlKCcuLi8uLi9mcmFtZXdvcmsvc2hhcmVkL3Byb2plY3Rhc3NldCcpO1xyXG5pbXBvcnQgVXNlciA9IHJlcXVpcmUoJy4uLy4uL2ZyYW1ld29yay9kYXRhYWNjZXNzL21vbmdvb3NlL3VzZXInKTtcclxuaW1wb3J0IFByb2plY3QgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vbmdvb3NlL1Byb2plY3QnKTtcclxuaW1wb3J0IEJ1aWxkaW5nID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb25nb29zZS9CdWlsZGluZycpO1xyXG5pbXBvcnQgQnVpbGRpbmdNb2RlbCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9idWlsZGluZy9CdWlsZGluZycpO1xyXG5pbXBvcnQgQXV0aEludGVyY2VwdG9yID0gcmVxdWlyZSgnLi4vLi4vZnJhbWV3b3JrL2ludGVyY2VwdG9yL2F1dGguaW50ZXJjZXB0b3InKTtcclxuaW1wb3J0IENvc3RDb250cm9sbEV4Y2VwdGlvbiA9IHJlcXVpcmUoJy4uL2V4Y2VwdGlvbi9Db3N0Q29udHJvbGxFeGNlcHRpb24nKTtcclxuaW1wb3J0IFF1YW50aXR5ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L2J1aWxkaW5nL1F1YW50aXR5Jyk7XHJcbmltcG9ydCBSYXRlID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L2J1aWxkaW5nL1JhdGUnKTtcclxuaW1wb3J0IENvc3RIZWFkID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L2J1aWxkaW5nL0Nvc3RIZWFkJyk7XHJcbmltcG9ydCBXb3JrSXRlbSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9idWlsZGluZy9Xb3JrSXRlbScpO1xyXG5pbXBvcnQgUmF0ZUFuYWx5c2lzU2VydmljZSA9IHJlcXVpcmUoJy4vUmF0ZUFuYWx5c2lzU2VydmljZScpO1xyXG5pbXBvcnQgQ2F0ZWdvcnkgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3Byb2plY3QvYnVpbGRpbmcvQ2F0ZWdvcnknKTtcclxuaW1wb3J0IGNvbnN0YW50ID0gcmVxdWlyZSgnLi4vc2hhcmVkL2NvbnN0YW50cycpO1xyXG5sZXQgY29uZmlnID0gcmVxdWlyZSgnY29uZmlnJyk7XHJcbmxldCBsb2c0anMgPSByZXF1aXJlKCdsb2c0anMnKTtcclxuaW1wb3J0ICogYXMgbW9uZ29vc2UgZnJvbSAnbW9uZ29vc2UnO1xyXG5sZXQgT2JqZWN0SWQgPSBtb25nb29zZS5UeXBlcy5PYmplY3RJZDtcclxuaW1wb3J0IGFsYXNxbCA9IHJlcXVpcmUoJ2FsYXNxbCcpO1xyXG5pbXBvcnQgQnVkZ2V0Q29zdFJhdGVzID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L3JlcG9ydHMvQnVkZ2V0Q29zdFJhdGVzJyk7XHJcbmltcG9ydCBUaHVtYlJ1bGVSYXRlID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L3JlcG9ydHMvVGh1bWJSdWxlUmF0ZScpO1xyXG5pbXBvcnQgQ29uc3RhbnRzID0gcmVxdWlyZSgnLi4vLi4vYXBwbGljYXRpb25Qcm9qZWN0L3NoYXJlZC9jb25zdGFudHMnKTtcclxuaW1wb3J0IFF1YW50aXR5SXRlbSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9idWlsZGluZy9RdWFudGl0eUl0ZW0nKTtcclxuaW1wb3J0IFF1YW50aXR5RGV0YWlscyA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9idWlsZGluZy9RdWFudGl0eURldGFpbHMnKTtcclxuaW1wb3J0IFJhdGVJdGVtID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L2J1aWxkaW5nL1JhdGVJdGVtJyk7XHJcbmltcG9ydCBDYXRlZ29yaWVzTGlzdFdpdGhSYXRlc0RUTyA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvZHRvL3Byb2plY3QvQ2F0ZWdvcmllc0xpc3RXaXRoUmF0ZXNEVE8nKTtcclxuaW1wb3J0IENlbnRyYWxpemVkUmF0ZSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9DZW50cmFsaXplZFJhdGUnKTtcclxuaW1wb3J0IG1lc3NhZ2VzICA9IHJlcXVpcmUoJy4uLy4uL2FwcGxpY2F0aW9uUHJvamVjdC9zaGFyZWQvbWVzc2FnZXMnKTtcclxuaW1wb3J0IHsgQ29tbW9uU2VydmljZSB9IGZyb20gJy4uLy4uL2FwcGxpY2F0aW9uUHJvamVjdC9zaGFyZWQvQ29tbW9uU2VydmljZSc7XHJcbmltcG9ydCBXb3JrSXRlbUxpc3RXaXRoUmF0ZXNEVE8gPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL2R0by9wcm9qZWN0L1dvcmtJdGVtTGlzdFdpdGhSYXRlc0RUTycpO1xyXG5cclxubGV0IENDUHJvbWlzZSA9IHJlcXVpcmUoJ3Byb21pc2UvbGliL2VzNi1leHRlbnNpb25zJyk7XHJcbmxldCBsb2dnZXI9bG9nNGpzLmdldExvZ2dlcignUHJvamVjdCBzZXJ2aWNlJyk7XHJcblxyXG5jbGFzcyBQcm9qZWN0U2VydmljZSB7XHJcbiAgQVBQX05BTUU6IHN0cmluZztcclxuICBjb21wYW55X25hbWU6IHN0cmluZztcclxuICBjb3N0SGVhZElkOiBudW1iZXI7XHJcbiAgY2F0ZWdvcnlJZDogbnVtYmVyO1xyXG4gIHdvcmtJdGVtSWQ6IG51bWJlcjtcclxuICBwcml2YXRlIHByb2plY3RSZXBvc2l0b3J5OiBQcm9qZWN0UmVwb3NpdG9yeTtcclxuICBwcml2YXRlIGJ1aWxkaW5nUmVwb3NpdG9yeTogQnVpbGRpbmdSZXBvc2l0b3J5O1xyXG4gIHByaXZhdGUgYXV0aEludGVyY2VwdG9yOiBBdXRoSW50ZXJjZXB0b3I7XHJcbiAgcHJpdmF0ZSB1c2VyU2VydmljZSA6IFVzZXJTZXJ2aWNlO1xyXG4gIHByaXZhdGUgY29tbW9uU2VydmljZSA6IENvbW1vblNlcnZpY2U7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5wcm9qZWN0UmVwb3NpdG9yeSA9IG5ldyBQcm9qZWN0UmVwb3NpdG9yeSgpO1xyXG4gICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkgPSBuZXcgQnVpbGRpbmdSZXBvc2l0b3J5KCk7XHJcbiAgICB0aGlzLkFQUF9OQU1FID0gUHJvamVjdEFzc2V0LkFQUF9OQU1FO1xyXG4gICAgdGhpcy5hdXRoSW50ZXJjZXB0b3IgPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XHJcbiAgICB0aGlzLnVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICB0aGlzLmNvbW1vblNlcnZpY2UgPSBuZXcgQ29tbW9uU2VydmljZSgpO1xyXG4gIH1cclxuXHJcbiAgY3JlYXRlUHJvamVjdChkYXRhOiBQcm9qZWN0LCB1c2VyIDogVXNlciwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgaWYoIXVzZXIuX2lkKSB7XHJcbiAgICAgIGNhbGxiYWNrKG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oJ1VzZXJJZCBOb3QgRm91bmQnLG51bGwpLCBudWxsKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnByb2plY3RSZXBvc2l0b3J5LmNyZWF0ZShkYXRhLCAoZXJyLCByZXMpID0+IHtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgY3JlYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICAgIGxvZ2dlci5kZWJ1ZygnUHJvamVjdCBJRCA6ICcrcmVzLl9pZCk7XHJcbiAgICAgICAgbG9nZ2VyLmRlYnVnKCdQcm9qZWN0IE5hbWUgOiAnK3Jlcy5uYW1lKTtcclxuICAgICAgICBsZXQgcHJvamVjdElkID0gcmVzLl9pZDtcclxuICAgICAgICBsZXQgbmV3RGF0YSA9ICB7JHB1c2g6IHsgcHJvamVjdDogcHJvamVjdElkIH19O1xyXG4gICAgICAgIGxldCBxdWVyeSA9IHtfaWQgOiB1c2VyLl9pZH07XHJcbiAgICAgICAgdGhpcy51c2VyU2VydmljZS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCBuZXdEYXRhLCB7bmV3IDp0cnVlfSwoZXJyLCByZXNwKSA9PiB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kT25lQW5kVXBkYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICAgICAgaWYoZXJyKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBkZWxldGUgcmVzLmNhdGVnb3J5O1xyXG4gICAgICAgICAgICBkZWxldGUgcmVzLnJhdGU7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJlcyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0UHJvamVjdEJ5SWQoIHByb2plY3RJZCA6IHN0cmluZywgdXNlcjogVXNlciwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbGV0IHF1ZXJ5ID0geyBfaWQ6IHByb2plY3RJZH07XHJcbiAgICBsZXQgcG9wdWxhdGUgPSB7cGF0aCA6ICdidWlsZGluZycsIHNlbGVjdDogWyduYW1lJyAsICd0b3RhbFNsYWJBcmVhJyxdfTtcclxuICAgIHRoaXMucHJvamVjdFJlcG9zaXRvcnkuZmluZEFuZFBvcHVsYXRlKHF1ZXJ5LCBwb3B1bGF0ZSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZmluZEFuZFBvcHVsYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBsb2dnZXIuZGVidWcoJ1Byb2plY3QgTmFtZSA6ICcrcmVzdWx0WzBdLm5hbWUpO1xyXG4gICAgICBpZihlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjYWxsYmFjayhudWxsLHsgZGF0YTogcmVzdWx0LCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0UHJvamVjdEFuZEJ1aWxkaW5nRGV0YWlscyggcHJvamVjdElkIDogc3RyaW5nLCBidWlsZGluZ0lkIDogc3RyaW5nLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBnZXRQcm9qZWN0QW5kQnVpbGRpbmdEZXRhaWxzIGZvciBzeW5jIHdpdGggcmF0ZUFuYWx5c2lzIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgbGV0IHF1ZXJ5ID0geyBfaWQ6IHByb2plY3RJZH07XHJcbiAgICBsZXQgcG9wdWxhdGUgPSB7cGF0aCA6ICdidWlsZGluZ3MnfTtcclxuICAgIHRoaXMucHJvamVjdFJlcG9zaXRvcnkuZmluZEFuZFBvcHVsYXRlKHF1ZXJ5LCBwb3B1bGF0ZSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZmluZEFuZFBvcHVsYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBpZihlcnJvcikge1xyXG4gICAgICAgIGxvZ2dlci5lcnJvcignUHJvamVjdCBzZXJ2aWNlLCBnZXRQcm9qZWN0QW5kQnVpbGRpbmdEZXRhaWxzIGZpbmRBbmRQb3B1bGF0ZSBmYWlsZWQgJytKU09OLnN0cmluZ2lmeShlcnJvcikpO1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsb2dnZXIuZGVidWcoJ2dldFByb2plY3RBbmRCdWlsZGluZ0RldGFpbHMgc3VjY2Vzcy4nKTtcclxuICAgICAgICBjYWxsYmFjayhudWxsLHsgZGF0YTogcmVzdWx0IH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZVByb2plY3RCeUlkKCBwcm9qZWN0RGV0YWlsczogUHJvamVjdCwgdXNlcjogVXNlciwgY2FsbGJhY2s6KGVycm9yOiBhbnksIHJlc3VsdDphbnkpID0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIHVwZGF0ZVByb2plY3REZXRhaWxzIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgbGV0IHF1ZXJ5ID0geyBfaWQgOiBwcm9qZWN0RGV0YWlscy5faWQgfTtcclxuICAgIGxldCBidWlsZGluZ0lkID0gJyc7XHJcblxyXG4gICAgdGhpcy5nZXRQcm9qZWN0QW5kQnVpbGRpbmdEZXRhaWxzKHByb2plY3REZXRhaWxzLl9pZCwgYnVpbGRpbmdJZCwgKGVycm9yLCBwcm9qZWN0QW5kQnVpbGRpbmdEZXRhaWxzKSA9PiB7XHJcbiAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgbG9nZ2VyLmVycm9yKCdQcm9qZWN0IHNlcnZpY2UsIGdldFByb2plY3RBbmRCdWlsZGluZ0RldGFpbHMgZmFpbGVkJyk7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBzeW5jUHJvamVjdFdpdGhSYXRlQW5hbHlzaXNEYXRhLicpO1xyXG4gICAgICAgIGxldCBwcm9qZWN0RGF0YSA9IHByb2plY3RBbmRCdWlsZGluZ0RldGFpbHMuZGF0YVswXTtcclxuICAgICAgICBsZXQgYnVpbGRpbmdzID0gcHJvamVjdEFuZEJ1aWxkaW5nRGV0YWlscy5kYXRhWzBdLmJ1aWxkaW5ncztcclxuICAgICAgICBsZXQgYnVpbGRpbmdEYXRhOiBCdWlsZGluZztcclxuICAgICAgICBkZWxldGUgcHJvamVjdERldGFpbHMuX2lkO1xyXG4gICAgICAgIHByb2plY3REZXRhaWxzLnByb2plY3RDb3N0SGVhZHMgPSB0aGlzLmNhbGN1bGF0ZUJ1ZGdldENvc3RGb3JDb21tb25BbW1lbml0aWVzKFxyXG4gICAgICAgICAgcHJvamVjdERhdGEucHJvamVjdENvc3RIZWFkcyxwcm9qZWN0RGF0YSwgYnVpbGRpbmdEYXRhKTtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9qZWN0UmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCBwcm9qZWN0RGV0YWlscywge25ldzogdHJ1ZX0sIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kT25lQW5kVXBkYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiByZXN1bHQsIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBjcmVhdGVCdWlsZGluZyhwcm9qZWN0SWQgOiBzdHJpbmcsIGJ1aWxkaW5nRGV0YWlscyA6IEJ1aWxkaW5nLCB1c2VyOiBVc2VyLCBjYWxsYmFjazooZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpPT4gdm9pZCkge1xyXG4gICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuY3JlYXRlKGJ1aWxkaW5nRGV0YWlscywgKGVycm9yLCByZXN1bHQpPT4ge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBjcmVhdGUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCBxdWVyeSA9IHtfaWQgOiBwcm9qZWN0SWQgfTtcclxuICAgICAgICBsZXQgbmV3RGF0YSA9IHsgJHB1c2g6IHtidWlsZGluZ3MgOiByZXN1bHQuX2lkfX07XHJcbiAgICAgICAgdGhpcy5wcm9qZWN0UmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCBuZXdEYXRhLCB7bmV3IDogdHJ1ZX0sIChlcnJvciwgc3RhdHVzKT0+IHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGZpbmRPbmVBbmRVcGRhdGUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTogcmVzdWx0LCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlQnVpbGRpbmdCeUlkKCBidWlsZGluZ0lkOnN0cmluZywgYnVpbGRpbmdEZXRhaWxzOmFueSwgdXNlcjpVc2VyLCBjYWxsYmFjazooZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpPT4gdm9pZCkge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgdXBkYXRlQnVpbGRpbmcgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICBsZXQgcXVlcnkgPSB7IF9pZCA6IGJ1aWxkaW5nSWQgfTtcclxuICAgIGxldCBwcm9qZWN0aW9uID0geydjb3N0SGVhZHMnIDogMX07XHJcbiAgICB0aGlzLmJ1aWxkaW5nUmVwb3NpdG9yeS5maW5kQnlJZFdpdGhQcm9qZWN0aW9uKGJ1aWxkaW5nSWQsIHByb2plY3Rpb24sKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZmluZE9uZUFuZFVwZGF0ZSBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCBwcm9qZWN0RGV0YWlscyA6IFByb2plY3Q7XHJcbiAgICAgICAgYnVpbGRpbmdEZXRhaWxzLmNvc3RIZWFkcyA9IHRoaXMuY2FsY3VsYXRlQnVkZ2V0Q29zdEZvckJ1aWxkaW5nKHJlc3VsdC5jb3N0SGVhZHMsIHByb2plY3REZXRhaWxzLCBidWlsZGluZ0RldGFpbHMpO1xyXG5cclxuICAgICAgICB0aGlzLmJ1aWxkaW5nUmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCBidWlsZGluZ0RldGFpbHMse25ldzogdHJ1ZX0sIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kT25lQW5kVXBkYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiByZXN1bHQsIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRJbkFjdGl2ZVByb2plY3RDb3N0SGVhZHMocHJvamVjdElkOiBzdHJpbmcsIHVzZXI6IFVzZXIsIGNhbGxiYWNrOihlcnJvcjogYW55LCByZXN1bHQ6IGFueSk9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBnZXRJbkFjdGl2ZUNvc3RIZWFkIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgdGhpcy5wcm9qZWN0UmVwb3NpdG9yeS5maW5kQnlJZChwcm9qZWN0SWQsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kQnlJZCBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgICBsb2dnZXIuZGVidWcoJ2dldHRpbmcgSW5BY3RpdmUgQ29zdEhlYWQgZm9yIFByb2plY3QgTmFtZSA6ICcrcmVzdWx0Lm5hbWUpO1xyXG4gICAgICAgIGxldCByZXNwb25zZSA9IHJlc3VsdC5wcm9qZWN0Q29zdEhlYWRzO1xyXG4gICAgICAgIGxldCBpbkFjdGl2ZUNvc3RIZWFkPVtdO1xyXG4gICAgICAgIGZvcihsZXQgY29zdEhlYWRJdGVtIG9mIHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICBpZighY29zdEhlYWRJdGVtLmFjdGl2ZSkge1xyXG4gICAgICAgICAgICBpbkFjdGl2ZUNvc3RIZWFkLnB1c2goY29zdEhlYWRJdGVtKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCx7ZGF0YTppbkFjdGl2ZUNvc3RIZWFkLCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc2V0UHJvamVjdENvc3RIZWFkU3RhdHVzKCBwcm9qZWN0SWQgOiBzdHJpbmcsIGNvc3RIZWFkSWQgOiBudW1iZXIsIGNvc3RIZWFkQWN0aXZlU3RhdHVzIDogc3RyaW5nLCB1c2VyOiBVc2VyLFxyXG4gICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBsZXQgcXVlcnkgPSB7J19pZCcgOiBwcm9qZWN0SWQsICdwcm9qZWN0Q29zdEhlYWRzLnJhdGVBbmFseXNpc0lkJyA6IGNvc3RIZWFkSWR9O1xyXG4gICAgbGV0IGFjdGl2ZVN0YXR1cyA9IEpTT04ucGFyc2UoY29zdEhlYWRBY3RpdmVTdGF0dXMpO1xyXG4gICAgbGV0IG5ld0RhdGEgPSB7ICRzZXQgOiB7J3Byb2plY3RDb3N0SGVhZHMuJC5hY3RpdmUnIDogYWN0aXZlU3RhdHVzfX07XHJcbiAgICB0aGlzLnByb2plY3RSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIG5ld0RhdGEsIHtuZXc6IHRydWV9LChlcnIsIHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGZpbmRPbmVBbmRVcGRhdGUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGlmKGVycikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGE6IHJlc3BvbnNlLCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgY2xvbmVCdWlsZGluZ0RldGFpbHMoIGJ1aWxkaW5nSWQ6c3RyaW5nLCBidWlsZGluZ0RldGFpbHM6YW55LCB1c2VyOlVzZXIsIGNhbGxiYWNrOihlcnJvcjogYW55LCByZXN1bHQ6IGFueSk9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBjbG9uZUJ1aWxkaW5nRGV0YWlscyBoYXMgYmVlbiBoaXQnKTtcclxuICAgIGxldCBxdWVyeSA9IHsgX2lkIDogYnVpbGRpbmdJZCB9O1xyXG4gICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZEJ5SWQoYnVpbGRpbmdJZCwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZmluZEJ5SWQgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgY2xvbmVkQ29zdEhlYWREZXRhaWxzIDpBcnJheTxDb3N0SGVhZD49W107XHJcbiAgICAgICAgbGV0IGNvc3RIZWFkcyA9YnVpbGRpbmdEZXRhaWxzLmNvc3RIZWFkcztcclxuICAgICAgICBsZXQgcmVzdWx0Q29zdEhlYWRzID0gcmVzdWx0LmNvc3RIZWFkcztcclxuICAgICAgICBmb3IobGV0IGNvc3RIZWFkIG9mIGNvc3RIZWFkcykge1xyXG4gICAgICAgICAgZm9yKGxldCByZXN1bHRDb3N0SGVhZCBvZiByZXN1bHRDb3N0SGVhZHMpIHtcclxuICAgICAgICAgICAgaWYoY29zdEhlYWQubmFtZSA9PT0gcmVzdWx0Q29zdEhlYWQubmFtZSkge1xyXG4gICAgICAgICAgICAgIGxldCBjbG9uZWRDb3N0SGVhZCA9IG5ldyBDb3N0SGVhZDtcclxuICAgICAgICAgICAgICBjbG9uZWRDb3N0SGVhZC5uYW1lID0gcmVzdWx0Q29zdEhlYWQubmFtZTtcclxuICAgICAgICAgICAgICBjbG9uZWRDb3N0SGVhZC5yYXRlQW5hbHlzaXNJZCA9IHJlc3VsdENvc3RIZWFkLnJhdGVBbmFseXNpc0lkO1xyXG4gICAgICAgICAgICAgIGNsb25lZENvc3RIZWFkLmFjdGl2ZSA9IGNvc3RIZWFkLmFjdGl2ZTtcclxuICAgICAgICAgICAgICBjbG9uZWRDb3N0SGVhZC50aHVtYlJ1bGVSYXRlID0gcmVzdWx0Q29zdEhlYWQudGh1bWJSdWxlUmF0ZTtcclxuXHJcbiAgICAgICAgICAgICAgaWYoY29zdEhlYWQuYWN0aXZlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGNhdGVnb3J5TGlzdCA9IGNvc3RIZWFkLmNhdGVnb3J5O1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlc3VsdENhdGVnb3J5TGlzdCA9IHJlc3VsdENvc3RIZWFkLmNhdGVnb3JpZXM7XHJcbiAgICAgICAgICAgICAgICBmb3IobGV0IHJlc3VsdENhdGVnb3J5SW5kZXg9MDsgcmVzdWx0Q2F0ZWdvcnlJbmRleDxyZXN1bHRDYXRlZ29yeUxpc3QubGVuZ3RoOyByZXN1bHRDYXRlZ29yeUluZGV4KyspIHtcclxuICAgICAgICAgICAgICAgICAgZm9yKGxldCBjYXRlZ29yeUluZGV4PTAgOyBjYXRlZ29yeUluZGV4PGNhdGVnb3J5TGlzdC5sZW5ndGg7IGNhdGVnb3J5SW5kZXgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGNhdGVnb3J5TGlzdFtjYXRlZ29yeUluZGV4XS5uYW1lID09PSByZXN1bHRDYXRlZ29yeUxpc3RbcmVzdWx0Q2F0ZWdvcnlJbmRleF0ubmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgaWYoIWNhdGVnb3J5TGlzdFtjYXRlZ29yeUluZGV4XS5hY3RpdmUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0Q2F0ZWdvcnlMaXN0LnNwbGljZShyZXN1bHRDYXRlZ29yeUluZGV4LDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc3VsdFdvcmtpdGVtTGlzdCA9IHJlc3VsdENhdGVnb3J5TGlzdFtyZXN1bHRDYXRlZ29yeUluZGV4XS53b3JrSXRlbXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB3b3JrSXRlbUxpc3QgPSBjYXRlZ29yeUxpc3RbY2F0ZWdvcnlJbmRleF0ud29ya0l0ZW1zO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yKGxldCByZXN1bHRXb3JraXRlbUluZGV4PTA7ICByZXN1bHRXb3JraXRlbUluZGV4IDwgcmVzdWx0V29ya2l0ZW1MaXN0Lmxlbmd0aDsgcmVzdWx0V29ya2l0ZW1JbmRleCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yKGxldCB3b3JraXRlbUluZGV4PTA7ICB3b3JraXRlbUluZGV4IDwgd29ya0l0ZW1MaXN0Lmxlbmd0aDsgd29ya2l0ZW1JbmRleCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZighd29ya0l0ZW1MaXN0W3dvcmtpdGVtSW5kZXhdLmFjdGl2ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRXb3JraXRlbUxpc3Quc3BsaWNlKHJlc3VsdFdvcmtpdGVtSW5kZXgsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2xvbmVkQ29zdEhlYWQuY2F0ZWdvcmllcyA9IHJlc3VsdENvc3RIZWFkLmNhdGVnb3JpZXM7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNsb25lZENvc3RIZWFkLmNhdGVnb3JpZXMgPSByZXN1bHRDb3N0SGVhZC5jYXRlZ29yaWVzO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNsb25lZENvc3RIZWFkRGV0YWlscy5wdXNoKGNsb25lZENvc3RIZWFkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHVwZGF0ZUJ1aWxkaW5nQ29zdEhlYWRzID0geydjb3N0SGVhZHMnIDogY2xvbmVkQ29zdEhlYWREZXRhaWxzfTtcclxuICAgICAgICB0aGlzLmJ1aWxkaW5nUmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCB1cGRhdGVCdWlsZGluZ0Nvc3RIZWFkcyx7bmV3OiB0cnVlfSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGZpbmRPbmVBbmRVcGRhdGUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGE6IHJlc3VsdCwgYWNjZXNzX3Rva2VuOiB0aGlzLmF1dGhJbnRlcmNlcHRvci5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKX0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldEJ1aWxkaW5nQnlJZChwcm9qZWN0SWQgOiBzdHJpbmcsIGJ1aWxkaW5nSWQgOiBzdHJpbmcsIHVzZXI6IFVzZXIsIGNhbGxiYWNrOihlcnJvcjogYW55LCByZXN1bHQ6IGFueSk9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBnZXRCdWlsZGluZyBoYXMgYmVlbiBoaXQnKTtcclxuICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmZpbmRCeUlkKGJ1aWxkaW5nSWQsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGZpbmRCeUlkIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGE6IHJlc3VsdCwgYWNjZXNzX3Rva2VuOiB0aGlzLmF1dGhJbnRlcmNlcHRvci5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKX0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldEJ1aWxkaW5nUmF0ZUl0ZW1zQnlPcmlnaW5hbE5hbWUocHJvamVjdElkOiBzdHJpbmcsIGJ1aWxkaW5nSWQ6IHN0cmluZywgb3JpZ2luYWxSYXRlSXRlbU5hbWU6IHN0cmluZywgdXNlcjogVXNlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxldCBwcm9qZWN0aW9uID0geydyYXRlcyc6MSwgX2lkOiAwfTtcclxuICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmZpbmRCeUlkV2l0aFByb2plY3Rpb24oYnVpbGRpbmdJZCwgcHJvamVjdGlvbiwgKGVycm9yLCBidWlsZGluZykgPT4ge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBTZXJ2aWNlLCBnZXRCdWlsZGluZ1JhdGVJdGVtc0J5T3JpZ2luYWxOYW1lIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IGJ1aWxkaW5nUmF0ZUl0ZW1zQXJyYXkgPSBidWlsZGluZy5yYXRlcztcclxuICAgICAgICBsZXQgY2VudHJhbGl6ZWRSYXRlSXRlbXNBcnJheSA9IHRoaXMuZ2V0UmF0ZUl0ZW1zQXJyYXkoYnVpbGRpbmdSYXRlSXRlbXNBcnJheSwgb3JpZ2luYWxSYXRlSXRlbU5hbWUpO1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwseyBkYXRhOiBjZW50cmFsaXplZFJhdGVJdGVtc0FycmF5LCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0UmF0ZUl0ZW1zQXJyYXkob3JpZ2luYWxSYXRlSXRlbXNBcnJheTogQXJyYXk8Q2VudHJhbGl6ZWRSYXRlPiwgb3JpZ2luYWxSYXRlSXRlbU5hbWU6IHN0cmluZykge1xyXG5cclxuICAgIGxldCBjZW50cmFsaXplZFJhdGVJdGVtc0FycmF5OiBBcnJheTxDZW50cmFsaXplZFJhdGU+O1xyXG4gICAgY2VudHJhbGl6ZWRSYXRlSXRlbXNBcnJheSA9IGFsYXNxbCgnU0VMRUNUICogRlJPTSA/IHdoZXJlIFRSSU0ob3JpZ2luYWxJdGVtTmFtZSkgPSA/JywgW29yaWdpbmFsUmF0ZUl0ZW1zQXJyYXksIG9yaWdpbmFsUmF0ZUl0ZW1OYW1lXSk7XHJcbiAgICByZXR1cm4gY2VudHJhbGl6ZWRSYXRlSXRlbXNBcnJheTtcclxuICB9XHJcblxyXG4gIGdldFByb2plY3RSYXRlSXRlbXNCeU9yaWdpbmFsTmFtZShwcm9qZWN0SWQ6IHN0cmluZywgb3JpZ2luYWxSYXRlSXRlbU5hbWU6IHN0cmluZywgdXNlcjogVXNlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICBsZXQgcHJvamVjdGlvbiA9IHsncmF0ZXMnOjEsIF9pZDogMH07XHJcbiAgICB0aGlzLnByb2plY3RSZXBvc2l0b3J5LmZpbmRCeUlkV2l0aFByb2plY3Rpb24ocHJvamVjdElkLCBwcm9qZWN0aW9uLCAoZXJyb3IsIHByb2plY3QpID0+IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3QgU2VydmljZSwgZ2V0UHJvamVjdFJhdGVJdGVtc0J5T3JpZ2luYWxOYW1lIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IHByb2plY3RSYXRlSXRlbXNBcnJheSA9IHByb2plY3QucmF0ZXM7XHJcbiAgICAgICAgbGV0IGNlbnRyYWxpemVkUmF0ZUl0ZW1zQXJyYXkgPSB0aGlzLmdldFJhdGVJdGVtc0FycmF5KHByb2plY3RSYXRlSXRlbXNBcnJheSwgb3JpZ2luYWxSYXRlSXRlbU5hbWUpO1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwseyBkYXRhOiBjZW50cmFsaXplZFJhdGVJdGVtc0FycmF5LCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0SW5BY3RpdmVDb3N0SGVhZChwcm9qZWN0SWQ6IHN0cmluZywgYnVpbGRpbmdJZDogc3RyaW5nLCB1c2VyOiBVc2VyLCBjYWxsYmFjazooZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpPT4gdm9pZCkge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZ2V0SW5BY3RpdmVDb3N0SGVhZCBoYXMgYmVlbiBoaXQnKTtcclxuICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmZpbmRCeUlkKGJ1aWxkaW5nSWQsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kQnlJZCBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgICBsb2dnZXIuZGVidWcoJ2dldHRpbmcgSW5BY3RpdmUgQ29zdEhlYWQgZm9yIEJ1aWxkaW5nIE5hbWUgOiAnK3Jlc3VsdC5uYW1lKTtcclxuICAgICAgICBsZXQgcmVzcG9uc2UgPSByZXN1bHQuY29zdEhlYWRzO1xyXG4gICAgICAgIGxldCBpbkFjdGl2ZUNvc3RIZWFkPVtdO1xyXG4gICAgICAgIGZvcihsZXQgY29zdEhlYWRJdGVtIG9mIHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICBpZighY29zdEhlYWRJdGVtLmFjdGl2ZSkge1xyXG4gICAgICAgICAgICBpbkFjdGl2ZUNvc3RIZWFkLnB1c2goY29zdEhlYWRJdGVtKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCx7ZGF0YTppbkFjdGl2ZUNvc3RIZWFkLCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0SW5BY3RpdmVXb3JrSXRlbXNPZkJ1aWxkaW5nQ29zdEhlYWRzKHByb2plY3RJZDpzdHJpbmcsIGJ1aWxkaW5nSWQ6c3RyaW5nLCBjb3N0SGVhZElkOm51bWJlciwgY2F0ZWdvcnlJZDpudW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXI6VXNlciwgY2FsbGJhY2s6KGVycm9yOiBhbnksIHJlc3VsdDogYW55KT0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGFkZCBXb3JraXRlbSBoYXMgYmVlbiBoaXQnKTtcclxuICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmZpbmRCeUlkKGJ1aWxkaW5nSWQsIChlcnJvciwgYnVpbGRpbmc6QnVpbGRpbmcpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCBjb3N0SGVhZExpc3QgPSBidWlsZGluZy5jb3N0SGVhZHM7XHJcbiAgICAgICAgbGV0IGluQWN0aXZlV29ya0l0ZW1zIDogQXJyYXk8V29ya0l0ZW0+ID0gbmV3IEFycmF5PFdvcmtJdGVtPigpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBjb3N0SGVhZERhdGEgb2YgY29zdEhlYWRMaXN0KSB7XHJcbiAgICAgICAgICBpZiAoY29zdEhlYWRJZCA9PT0gY29zdEhlYWREYXRhLnJhdGVBbmFseXNpc0lkKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGNhdGVnb3J5RGF0YSBvZiBjb3N0SGVhZERhdGEuY2F0ZWdvcmllcykge1xyXG4gICAgICAgICAgICAgIGlmIChjYXRlZ29yeUlkID09PSBjYXRlZ29yeURhdGEucmF0ZUFuYWx5c2lzSWQpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHdvcmtJdGVtRGF0YSBvZiBjYXRlZ29yeURhdGEud29ya0l0ZW1zKSB7XHJcbiAgICAgICAgICAgICAgICAgIGlmKCF3b3JrSXRlbURhdGEuYWN0aXZlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5BY3RpdmVXb3JrSXRlbXMucHVzaCh3b3JrSXRlbURhdGEpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBpbkFjdGl2ZVdvcmtJdGVtc0xpc3RXaXRoQnVpbGRpbmdSYXRlcyA9IHRoaXMuZ2V0V29ya0l0ZW1MaXN0V2l0aENlbnRyYWxpemVkUmF0ZXMoaW5BY3RpdmVXb3JrSXRlbXMsIGJ1aWxkaW5nLnJhdGVzLCBmYWxzZSk7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCx7ZGF0YTppbkFjdGl2ZVdvcmtJdGVtc0xpc3RXaXRoQnVpbGRpbmdSYXRlcy53b3JrSXRlbXMsIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vIEdldCBJbiBBY3RpdmUgV29ya0l0ZW1zIE9mIFByb2plY3QgQ29zdCBIZWFkc1xyXG4gIGdldEluQWN0aXZlV29ya0l0ZW1zT2ZQcm9qZWN0Q29zdEhlYWRzKHByb2plY3RJZDpzdHJpbmcsIGNvc3RIZWFkSWQ6bnVtYmVyLCBjYXRlZ29yeUlkOm51bWJlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyOlVzZXIsIGNhbGxiYWNrOihlcnJvcjogYW55LCByZXN1bHQ6IGFueSk9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBHZXQgSW4tQWN0aXZlIFdvcmtJdGVtcyBPZiBQcm9qZWN0IENvc3QgSGVhZHMgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICB0aGlzLnByb2plY3RSZXBvc2l0b3J5LmZpbmRCeUlkKHByb2plY3RJZCwgKGVycm9yLCBwcm9qZWN0OlByb2plY3QpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCBjb3N0SGVhZExpc3QgPSBwcm9qZWN0LnByb2plY3RDb3N0SGVhZHM7XHJcbiAgICAgICAgbGV0IGluQWN0aXZlV29ya0l0ZW1zIDogQXJyYXk8V29ya0l0ZW0+ID0gbmV3IEFycmF5PFdvcmtJdGVtPigpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBjb3N0SGVhZERhdGEgb2YgY29zdEhlYWRMaXN0KSB7XHJcbiAgICAgICAgICBpZiAoY29zdEhlYWRJZCA9PT0gY29zdEhlYWREYXRhLnJhdGVBbmFseXNpc0lkKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGNhdGVnb3J5RGF0YSBvZiBjb3N0SGVhZERhdGEuY2F0ZWdvcmllcykge1xyXG4gICAgICAgICAgICAgIGlmIChjYXRlZ29yeUlkID09PSBjYXRlZ29yeURhdGEucmF0ZUFuYWx5c2lzSWQpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHdvcmtJdGVtRGF0YSBvZiBjYXRlZ29yeURhdGEud29ya0l0ZW1zKSB7XHJcbiAgICAgICAgICAgICAgICAgIGlmKCF3b3JrSXRlbURhdGEuYWN0aXZlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5BY3RpdmVXb3JrSXRlbXMucHVzaCh3b3JrSXRlbURhdGEpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBpbkFjdGl2ZVdvcmtJdGVtc0xpc3RXaXRoUHJvamVjdFJhdGVzID0gdGhpcy5nZXRXb3JrSXRlbUxpc3RXaXRoQ2VudHJhbGl6ZWRSYXRlcyhpbkFjdGl2ZVdvcmtJdGVtcywgcHJvamVjdC5yYXRlcywgZmFsc2UpO1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwse2RhdGE6aW5BY3RpdmVXb3JrSXRlbXNMaXN0V2l0aFByb2plY3RSYXRlcy53b3JrSXRlbXMsIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRCdWlsZGluZ0J5SWRGb3JDbG9uZShwcm9qZWN0SWQgOiBzdHJpbmcsIGJ1aWxkaW5nSWQgOiBzdHJpbmcsIHVzZXI6IFVzZXIsIGNhbGxiYWNrOihlcnJvcjogYW55LCByZXN1bHQ6IGFueSk9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBnZXRDbG9uZWRCdWlsZGluZyBoYXMgYmVlbiBoaXQnKTtcclxuICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmZpbmRCeUlkKGJ1aWxkaW5nSWQsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGZpbmRCeUlkIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IGNsb25lZEJ1aWxkaW5nID0gcmVzdWx0LmNvc3RIZWFkcztcclxuICAgICAgICBsZXQgYnVpbGRpbmcgPSBuZXcgQnVpbGRpbmdNb2RlbCgpO1xyXG4gICAgICAgIGJ1aWxkaW5nLm5hbWUgPSByZXN1bHQubmFtZTtcclxuICAgICAgICBidWlsZGluZy50b3RhbFNsYWJBcmVhID0gcmVzdWx0LnRvdGFsU2xhYkFyZWE7XHJcbiAgICAgICAgYnVpbGRpbmcudG90YWxDYXJwZXRBcmVhT2ZVbml0ID0gcmVzdWx0LnRvdGFsQ2FycGV0QXJlYU9mVW5pdDtcclxuICAgICAgICBidWlsZGluZy50b3RhbFNhbGVhYmxlQXJlYU9mVW5pdCA9IHJlc3VsdC50b3RhbFNhbGVhYmxlQXJlYU9mVW5pdDtcclxuICAgICAgICBidWlsZGluZy5wbGludGhBcmVhID0gcmVzdWx0LnBsaW50aEFyZWE7XHJcbiAgICAgICAgYnVpbGRpbmcudG90YWxOdW1PZkZsb29ycyA9IHJlc3VsdC50b3RhbE51bU9mRmxvb3JzO1xyXG4gICAgICAgIGJ1aWxkaW5nLm51bU9mUGFya2luZ0Zsb29ycyA9IHJlc3VsdC5udW1PZlBhcmtpbmdGbG9vcnM7XHJcbiAgICAgICAgYnVpbGRpbmcuY2FycGV0QXJlYU9mUGFya2luZyA9IHJlc3VsdC5jYXJwZXRBcmVhT2ZQYXJraW5nO1xyXG4gICAgICAgIGJ1aWxkaW5nLm51bU9mT25lQkhLID0gcmVzdWx0Lm51bU9mT25lQkhLO1xyXG4gICAgICAgIGJ1aWxkaW5nLm51bU9mVHdvQkhLID0gcmVzdWx0Lm51bU9mVHdvQkhLO1xyXG4gICAgICAgIGJ1aWxkaW5nLm51bU9mVGhyZWVCSEsgPSByZXN1bHQubnVtT2ZUaHJlZUJISztcclxuICAgICAgICBidWlsZGluZy5udW1PZkZvdXJCSEsgPSByZXN1bHQubnVtT2ZGb3VyQkhLO1xyXG4gICAgICAgIGJ1aWxkaW5nLm51bU9mRml2ZUJISyA9IHJlc3VsdC5udW1PZkZpdmVCSEs7XHJcbiAgICAgICAgYnVpbGRpbmcubnVtT2ZMaWZ0cyA9IHJlc3VsdC5udW1PZkxpZnRzO1xyXG5cclxuICAgICAgICAvKmxldCBjbG9uZWRDb3N0SGVhZEFycmF5IDogQXJyYXk8Q2xvbmVkQ29zdEhlYWQ+ID0gW107XHJcblxyXG4gICAgICAgIGZvcihsZXQgY29zdEhlYWRJbmRleCA9IDA7IGNvc3RIZWFkSW5kZXggPCBjbG9uZWRCdWlsZGluZy5sZW5ndGg7IGNvc3RIZWFkSW5kZXgrKykge1xyXG5cclxuICAgICAgICAgIGxldCBjbG9uZWRDb3N0SGVhZCA9IG5ldyBDbG9uZWRDb3N0SGVhZDtcclxuICAgICAgICAgIGNsb25lZENvc3RIZWFkLm5hbWUgPSBjbG9uZWRCdWlsZGluZ1tjb3N0SGVhZEluZGV4XS5uYW1lO1xyXG4gICAgICAgICAgY2xvbmVkQ29zdEhlYWQucmF0ZUFuYWx5c2lzSWQgPSBjbG9uZWRCdWlsZGluZ1tjb3N0SGVhZEluZGV4XS5yYXRlQW5hbHlzaXNJZDtcclxuICAgICAgICAgIGNsb25lZENvc3RIZWFkLmFjdGl2ZSA9IGNsb25lZEJ1aWxkaW5nW2Nvc3RIZWFkSW5kZXhdLmFjdGl2ZTtcclxuICAgICAgICAgIGNsb25lZENvc3RIZWFkLmJ1ZGdldGVkQ29zdEFtb3VudCA9IGNsb25lZEJ1aWxkaW5nW2Nvc3RIZWFkSW5kZXhdLmJ1ZGdldGVkQ29zdEFtb3VudDtcclxuXHJcbiAgICAgICAgICBsZXQgY2xvbmVkV29ya0l0ZW1BcnJheSA6IEFycmF5PENsb25lZFdvcmtJdGVtPiA9IFtdO1xyXG4gICAgICAgICAgbGV0IGNsb25lZENhdGVnb3J5QXJyYXkgOiBBcnJheTxDbG9uZWRDYXRlZ29yeT4gPSBbXTtcclxuICAgICAgICAgIGxldCBjYXRlZ29yeUFycmF5ID0gY2xvbmVkQnVpbGRpbmdbY29zdEhlYWRJbmRleF0uY2F0ZWdvcmllcztcclxuXHJcbiAgICAgICAgICBmb3IobGV0IGNhdGVnb3J5SW5kZXg9MDsgY2F0ZWdvcnlJbmRleDxjYXRlZ29yeUFycmF5Lmxlbmd0aDsgY2F0ZWdvcnlJbmRleCsrKSB7XHJcbiAgICAgICAgICAgIGxldCBjbG9uZWRDYXRlZ29yeSA9IG5ldyBDbG9uZWRDYXRlZ29yeSgpO1xyXG4gICAgICAgICAgICBjbG9uZWRDYXRlZ29yeS5uYW1lID0gY2F0ZWdvcnlBcnJheVtjYXRlZ29yeUluZGV4XS5uYW1lO1xyXG4gICAgICAgICAgICBjbG9uZWRDYXRlZ29yeS5yYXRlQW5hbHlzaXNJZCA9IGNhdGVnb3J5QXJyYXlbY2F0ZWdvcnlJbmRleF0ucmF0ZUFuYWx5c2lzSWQ7XHJcbiAgICAgICAgICAgIGNsb25lZENhdGVnb3J5LmFtb3VudCA9IGNhdGVnb3J5QXJyYXlbY2F0ZWdvcnlJbmRleF0uYW1vdW50O1xyXG4gICAgICAgICAgICBjbG9uZWRDYXRlZ29yeS5hY3RpdmUgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgbGV0IHdvcmtpdGVtQXJyYXkgPSBjYXRlZ29yeUFycmF5W2NhdGVnb3J5SW5kZXhdLndvcmtJdGVtcztcclxuICAgICAgICAgICAgZm9yKGxldCB3b3JraXRlbUluZGV4PTA7IHdvcmtpdGVtSW5kZXg8IHdvcmtpdGVtQXJyYXkubGVuZ3RoOyB3b3JraXRlbUluZGV4KyspIHtcclxuICAgICAgICAgICAgICBsZXQgY2xvbmVkV29ya0l0ZW0gPSBuZXcgQ2xvbmVkV29ya0l0ZW0oKTtcclxuICAgICAgICAgICAgICBjbG9uZWRXb3JrSXRlbS5uYW1lID0gd29ya2l0ZW1BcnJheVt3b3JraXRlbUluZGV4XS5uYW1lO1xyXG4gICAgICAgICAgICAgIGNsb25lZFdvcmtJdGVtLnJhdGVBbmFseXNpc0lkID0gIHdvcmtpdGVtQXJyYXlbd29ya2l0ZW1JbmRleF0ucmF0ZUFuYWx5c2lzSWQ7XHJcbiAgICAgICAgICAgICAgY2xvbmVkV29ya0l0ZW0udW5pdCA9ICB3b3JraXRlbUFycmF5W3dvcmtpdGVtSW5kZXhdLnVuaXQ7XHJcbiAgICAgICAgICAgICAgY2xvbmVkV29ya0l0ZW0uYW1vdW50ID0gd29ya2l0ZW1BcnJheVt3b3JraXRlbUluZGV4XS5hbW91bnQ7XHJcbiAgICAgICAgICAgICAgY2xvbmVkV29ya0l0ZW0ucmF0ZSA9IHdvcmtpdGVtQXJyYXlbd29ya2l0ZW1JbmRleF0ucmF0ZTtcclxuICAgICAgICAgICAgICBjbG9uZWRXb3JrSXRlbS5xdWFudGl0eSA9IHdvcmtpdGVtQXJyYXlbd29ya2l0ZW1JbmRleF0ucXVhbnRpdHk7XHJcbiAgICAgICAgICAgICAgY2xvbmVkV29ya0l0ZW1BcnJheS5wdXNoKGNsb25lZFdvcmtJdGVtKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjbG9uZWRDYXRlZ29yeS53b3JrSXRlbXMgPSBjbG9uZWRXb3JrSXRlbUFycmF5O1xyXG4gICAgICAgICAgICBjbG9uZWRDYXRlZ29yeUFycmF5LnB1c2goY2xvbmVkQ2F0ZWdvcnkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY2xvbmVkQ29zdEhlYWQuY2F0ZWdvcmllcyA9IGNsb25lZENhdGVnb3J5QXJyYXk7XHJcbiAgICAgICAgICBjbG9uZWRDb3N0SGVhZEFycmF5LnB1c2goY2xvbmVkQ29zdEhlYWQpO1xyXG4gICAgICAgIH0qL1xyXG4gICAgICAgIGJ1aWxkaW5nLmNvc3RIZWFkcyA9IHJlc3VsdC5jb3N0SGVhZHM7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGE6IGJ1aWxkaW5nLCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZGVsZXRlQnVpbGRpbmdCeUlkKHByb2plY3RJZDpzdHJpbmcsIGJ1aWxkaW5nSWQ6c3RyaW5nLCB1c2VyOlVzZXIsIGNhbGxiYWNrOihlcnJvcjogYW55LCByZXN1bHQ6IGFueSk9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBkZWxldGVCdWlsZGluZyBoYXMgYmVlbiBoaXQnKTtcclxuICAgIGxldCBwb3BCdWlsZGluZ0lkID0gYnVpbGRpbmdJZDtcclxuICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmRlbGV0ZShidWlsZGluZ0lkLCAoZXJyb3IsIHJlc3VsdCk9PiB7XHJcbiAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCBxdWVyeSA9IHtfaWQ6IHByb2plY3RJZH07XHJcbiAgICAgICAgbGV0IG5ld0RhdGEgPSB7ICRwdWxsOiB7YnVpbGRpbmdzIDogcG9wQnVpbGRpbmdJZH19O1xyXG4gICAgICAgIHRoaXMucHJvamVjdFJlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgbmV3RGF0YSwge25ldzogdHJ1ZX0sIChlcnJvciwgc3RhdHVzKT0+IHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGZpbmRPbmVBbmRVcGRhdGUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTogc3RhdHVzLCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0UmF0ZShwcm9qZWN0SWQ6c3RyaW5nLCBidWlsZGluZ0lkOnN0cmluZywgY29zdEhlYWRJZDpudW1iZXIsY2F0ZWdvcnlJZDpudW1iZXIsIHdvcmtJdGVtSWQ6bnVtYmVyLCB1c2VyIDogVXNlcixcclxuICAgICAgICAgIGNhbGxiYWNrOihlcnJvcjogYW55LCByZXN1bHQ6IGFueSk9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBnZXRSYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG5cclxuICAgIGxldCByYXRlQW5hbHlzaXNTZXJ2aWNlczogUmF0ZUFuYWx5c2lzU2VydmljZSA9IG5ldyBSYXRlQW5hbHlzaXNTZXJ2aWNlKCk7XHJcbiAgICByYXRlQW5hbHlzaXNTZXJ2aWNlcy5nZXRSYXRlKHdvcmtJdGVtSWQsIChlcnJvciwgcmF0ZURhdGEpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCByYXRlIDpSYXRlID0gbmV3IFJhdGUoKTtcclxuICAgICAgICByYXRlLnJhdGVJdGVtcyA9IHJhdGVEYXRhO1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiByYXRlRGF0YSwgYWNjZXNzX3Rva2VuOiB0aGlzLmF1dGhJbnRlcmNlcHRvci5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKX0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZVJhdGVPZkJ1aWxkaW5nQ29zdEhlYWRzKHByb2plY3RJZDpzdHJpbmcsIGJ1aWxkaW5nSWQ6c3RyaW5nLCBjb3N0SGVhZElkOm51bWJlciwgY2F0ZWdvcnlJZDpudW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd29ya0l0ZW1JZDpudW1iZXIsIHJhdGUgOlJhdGUsIHVzZXIgOiBVc2VyLCBjYWxsYmFjazooZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpPT4gdm9pZCkge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgdXBkYXRlUmF0ZU9mQnVpbGRpbmdDb3N0SGVhZHMgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICB0aGlzLmJ1aWxkaW5nUmVwb3NpdG9yeS5maW5kQnlJZChidWlsZGluZ0lkLCAoZXJyb3IsIGJ1aWxkaW5nOkJ1aWxkaW5nKSA9PiB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGZpbmRCeUlkIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IGNvc3RIZWFkcyA9IGJ1aWxkaW5nLmNvc3RIZWFkcztcclxuICAgICAgICBsZXQgY2VudHJhbGl6ZWRSYXRlcyA9IGJ1aWxkaW5nLnJhdGVzO1xyXG4gICAgICAgIGZvcihsZXQgY29zdEhlYWREYXRhIG9mIGNvc3RIZWFkcykge1xyXG4gICAgICAgICAgaWYoY29zdEhlYWREYXRhLnJhdGVBbmFseXNpc0lkID09PSBjb3N0SGVhZElkKSB7XHJcbiAgICAgICAgICAgIGZvcihsZXQgY2F0ZWdvcnlEYXRhIG9mIGNvc3RIZWFkRGF0YS5jYXRlZ29yaWVzKSB7XHJcbiAgICAgICAgICAgICAgaWYgKGNhdGVnb3J5RGF0YS5yYXRlQW5hbHlzaXNJZCA9PT0gY2F0ZWdvcnlJZCkge1xyXG4gICAgICAgICAgICAgICAgZm9yKGxldCB3b3JrSXRlbURhdGEgb2YgY2F0ZWdvcnlEYXRhLndvcmtJdGVtcykge1xyXG4gICAgICAgICAgICAgICAgICBpZiAod29ya0l0ZW1EYXRhLnJhdGVBbmFseXNpc0lkID09PSB3b3JrSXRlbUlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd29ya0l0ZW1EYXRhLnJhdGU9cmF0ZTtcclxuICAgICAgICAgICAgICAgICAgICB3b3JrSXRlbURhdGEucmF0ZS5pc0VzdGltYXRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHF1ZXJ5ID0geydfaWQnIDogYnVpbGRpbmdJZH07XHJcbiAgICAgICAgbGV0IG5ld0RhdGEgPSB7ICRzZXQgOiB7J2Nvc3RIZWFkcycgOiBjb3N0SGVhZHN9fTtcclxuXHJcbiAgICAgICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgbmV3RGF0YSx7bmV3OiB0cnVlfSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZihyZXN1bHQpIHtcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnYnVpbGRpbmcgQ29zdEhlYWRzIFVwZGF0ZWQnKTtcclxuXHJcbiAgICAgICAgICAgICAgbGV0IHJhdGVJdGVtcyA9IHJhdGUucmF0ZUl0ZW1zO1xyXG4gICAgICAgICAgICAgIGxldCBwcm9taXNlQXJyYXlGb3JVcGRhdGVCdWlsZGluZ0NlbnRyYWxpemVkUmF0ZXMgPVtdO1xyXG5cclxuICAgICAgICAgICAgICBmb3IobGV0IHJhdGUgb2YgcmF0ZUl0ZW1zKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHJhdGVPYmplY3RFeGlzdFNRTCA9ICdTRUxFQ1QgKiBGUk9NID8gQVMgcmF0ZXMgV0hFUkUgcmF0ZXMuaXRlbU5hbWU9ID8nO1xyXG4gICAgICAgICAgICAgICAgbGV0IHJhdGVFeGlzdEFycmF5ID0gYWxhc3FsKHJhdGVPYmplY3RFeGlzdFNRTCxbY2VudHJhbGl6ZWRSYXRlcyxyYXRlLml0ZW1OYW1lXSk7XHJcbiAgICAgICAgICAgICAgICBpZihyYXRlRXhpc3RBcnJheS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgIGlmKHJhdGVFeGlzdEFycmF5WzBdLnJhdGUgIT09IHJhdGUucmF0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vdXBkYXRlIHJhdGUgb2YgcmF0ZUl0ZW1cclxuICAgICAgICAgICAgICAgICAgICBsZXQgdXBkYXRlUmF0ZVByb21pc2UgPSB0aGlzLnVwZGF0ZUNlbnRyYWxpemVkUmF0ZUZvckJ1aWxkaW5nKGJ1aWxkaW5nSWQsIHJhdGUuaXRlbU5hbWUsIHJhdGUucmF0ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvbWlzZUFycmF5Rm9yVXBkYXRlQnVpbGRpbmdDZW50cmFsaXplZFJhdGVzLnB1c2godXBkYXRlUmF0ZVByb21pc2UpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAvL2NyZWF0ZSBuZXcgcmF0ZUl0ZW1cclxuICAgICAgICAgICAgICAgICAgbGV0IHJhdGVJdGVtIDogQ2VudHJhbGl6ZWRSYXRlID0gbmV3IENlbnRyYWxpemVkUmF0ZShyYXRlLml0ZW1OYW1lLHJhdGUub3JpZ2luYWxJdGVtTmFtZSwgcmF0ZS5yYXRlKTtcclxuICAgICAgICAgICAgICAgICAgbGV0IGFkZE5ld1JhdGVJdGVtUHJvbWlzZSA9IHRoaXMuYWRkTmV3Q2VudHJhbGl6ZWRSYXRlRm9yQnVpbGRpbmcoYnVpbGRpbmdJZCwgcmF0ZUl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICBwcm9taXNlQXJyYXlGb3JVcGRhdGVCdWlsZGluZ0NlbnRyYWxpemVkUmF0ZXMucHVzaChhZGROZXdSYXRlSXRlbVByb21pc2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgaWYocHJvbWlzZUFycmF5Rm9yVXBkYXRlQnVpbGRpbmdDZW50cmFsaXplZFJhdGVzLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgQ0NQcm9taXNlLmFsbChwcm9taXNlQXJyYXlGb3JVcGRhdGVCdWlsZGluZ0NlbnRyYWxpemVkUmF0ZXMpLnRoZW4oZnVuY3Rpb24oZGF0YTogQXJyYXk8YW55Pikge1xyXG5cclxuICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1JhdGVzIEFycmF5IHVwZGF0ZWQgOiAnK0pTT04uc3RyaW5naWZ5KGNlbnRyYWxpemVkUmF0ZXMpKTtcclxuICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgeyAnZGF0YScgOiAnc3VjY2VzcycgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24oZTphbnkpIHtcclxuICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKCcgUHJvbWlzZSBmYWlsZWQgZm9yIGNvbnZlcnRDb3N0SGVhZHNGcm9tUmF0ZUFuYWx5c2lzVG9Db3N0Q29udHJvbCAhIDonICtKU09OLnN0cmluZ2lmeShlLm1lc3NhZ2UpKTtcclxuICAgICAgICAgICAgICAgICAgQ0NQcm9taXNlLnJlamVjdChlLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHsgJ2RhdGEnIDogJ3N1Y2Nlc3MnIH0pO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG5cclxuICAvL1VwZGF0ZSBEaXJlY3QgUmF0ZSBvZiBidWlsZGluZyBjb3N0aGVhZHNcclxuICB1cGRhdGVEaXJlY3RSYXRlT2ZCdWlsZGluZ1dvcmtJdGVtcyhwcm9qZWN0SWQ6c3RyaW5nLCBidWlsZGluZ0lkOnN0cmluZywgY29zdEhlYWRJZDpudW1iZXIsIGNhdGVnb3J5SWQ6bnVtYmVyLCB3b3JrSXRlbUlkOm51bWJlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXJlY3RSYXRlOm51bWJlciwgdXNlcjpVc2VyLCBjYWxsYmFjazooZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpPT4gdm9pZCkge1xyXG5cclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIHVwZGF0ZURpcmVjdFJhdGVPZkJ1aWxkaW5nV29ya0l0ZW1zIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBsZXQgcHJvamVjdGlvbiA9IHsnY29zdEhlYWRzJzoxfTtcclxuICAgICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZEJ5SWRXaXRoUHJvamVjdGlvbihidWlsZGluZ0lkLCBwcm9qZWN0aW9uLCAoZXJyb3IsIGJ1aWxkaW5nKSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgY29zdEhlYWRMaXN0ID0gYnVpbGRpbmcuY29zdEhlYWRzO1xyXG4gICAgICAgIHRoaXMudXBkYXRlRGlyZWN0UmF0ZShjb3N0SGVhZExpc3QsIGNvc3RIZWFkSWQsIGNhdGVnb3J5SWQsIHdvcmtJdGVtSWQsIGRpcmVjdFJhdGUpO1xyXG5cclxuICAgICAgICBsZXQgcXVlcnkgPSB7X2lkOiBidWlsZGluZ0lkfTtcclxuICAgICAgICBsZXQgZGF0YSA9IHskc2V0IDogeydjb3N0SGVhZHMnIDogY29zdEhlYWRMaXN0fX07XHJcbiAgICAgICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgZGF0YSwge25ldzogdHJ1ZX0sIChlcnJvciwgYnVpbGRpbmcpID0+IHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGZpbmRPbmVBbmRVcGRhdGUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGE6ICdzdWNjZXNzJywgYWNjZXNzX3Rva2VuOiB0aGlzLmF1dGhJbnRlcmNlcHRvci5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKX0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZURpcmVjdFJhdGUoY29zdEhlYWRMaXN0OiBBcnJheTxDb3N0SGVhZD4sIGNvc3RIZWFkSWQ6IG51bWJlciwgY2F0ZWdvcnlJZDogbnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgd29ya0l0ZW1JZDogbnVtYmVyLCBkaXJlY3RSYXRlOiBudW1iZXIpIHtcclxuICAgICAgbGV0IHJhdGU6IFJhdGU7XHJcbiAgICAgIGZvciAobGV0IGNvc3RIZWFkIG9mIGNvc3RIZWFkTGlzdCkge1xyXG4gICAgICAgIGlmIChjb3N0SGVhZElkID09PSBjb3N0SGVhZC5yYXRlQW5hbHlzaXNJZCkge1xyXG4gICAgICAgICAgbGV0IGNhdGVnb3JpZXNPZkNvc3RIZWFkID0gY29zdEhlYWQuY2F0ZWdvcmllcztcclxuICAgICAgICAgIGZvciAobGV0IGNhdGVnb3J5RGF0YSBvZiBjYXRlZ29yaWVzT2ZDb3N0SGVhZCkge1xyXG4gICAgICAgICAgICBpZiAoY2F0ZWdvcnlJZCA9PT0gY2F0ZWdvcnlEYXRhLnJhdGVBbmFseXNpc0lkKSB7XHJcbiAgICAgICAgICAgICAgZm9yIChsZXQgd29ya0l0ZW1EYXRhIG9mIGNhdGVnb3J5RGF0YS53b3JrSXRlbXMpIHtcclxuICAgICAgICAgICAgICAgIGlmICh3b3JrSXRlbUlkID09PSB3b3JrSXRlbURhdGEucmF0ZUFuYWx5c2lzSWQpIHtcclxuICAgICAgICAgICAgICAgICAgcmF0ZSA9IHdvcmtJdGVtRGF0YS5yYXRlO1xyXG4gICAgICAgICAgICAgICAgICByYXRlLnRvdGFsID0gZGlyZWN0UmF0ZTtcclxuICAgICAgICAgICAgICAgICAgcmF0ZS5yYXRlSXRlbXMgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgd29ya0l0ZW1EYXRhLmlzRGlyZWN0UmF0ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4vL1VwZGF0ZSByYXRlIG9mIHByb2plY3QgY29zdCBoZWFkc1xyXG4gIHVwZGF0ZVJhdGVPZlByb2plY3RDb3N0SGVhZHMocHJvamVjdElkOnN0cmluZywgY29zdEhlYWRJZDpudW1iZXIsY2F0ZWdvcnlJZDpudW1iZXIsXHJcbiAgICAgICAgICAgICB3b3JrSXRlbUlkOm51bWJlciwgcmF0ZSA6UmF0ZSwgdXNlciA6IFVzZXIsIGNhbGxiYWNrOihlcnJvcjogYW55LCByZXN1bHQ6IGFueSk9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBVcGRhdGUgcmF0ZSBvZiBwcm9qZWN0IGNvc3QgaGVhZHMgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICB0aGlzLnByb2plY3RSZXBvc2l0b3J5LmZpbmRCeUlkKHByb2plY3RJZCwgKGVycm9yLCBwcm9qZWN0IDogUHJvamVjdCkgPT4ge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kQnlJZCBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCBwcm9qZWN0Q29zdEhlYWRzID0gcHJvamVjdC5wcm9qZWN0Q29zdEhlYWRzO1xyXG4gICAgICAgIGxldCBjZW50cmFsaXplZFJhdGVzT2ZQcm9qZWN0cyA9IHByb2plY3QucmF0ZXM7XHJcbiAgICAgICAgZm9yKGxldCBjb3N0SGVhZERhdGEgb2YgcHJvamVjdENvc3RIZWFkcykge1xyXG4gICAgICAgICAgaWYoY29zdEhlYWREYXRhLnJhdGVBbmFseXNpc0lkID09PSBjb3N0SGVhZElkKSB7XHJcbiAgICAgICAgICAgIGZvcihsZXQgY2F0ZWdvcnlEYXRhIG9mIGNvc3RIZWFkRGF0YS5jYXRlZ29yaWVzKSB7XHJcbiAgICAgICAgICAgICAgaWYgKGNhdGVnb3J5RGF0YS5yYXRlQW5hbHlzaXNJZCA9PT0gY2F0ZWdvcnlJZCkge1xyXG4gICAgICAgICAgICAgICAgZm9yKGxldCB3b3JrSXRlbURhdGEgb2YgY2F0ZWdvcnlEYXRhLndvcmtJdGVtcykge1xyXG4gICAgICAgICAgICAgICAgICBpZiAod29ya0l0ZW1EYXRhLnJhdGVBbmFseXNpc0lkID09PSB3b3JrSXRlbUlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd29ya0l0ZW1EYXRhLnJhdGU9cmF0ZTtcclxuICAgICAgICAgICAgICAgICAgICB3b3JrSXRlbURhdGEucmF0ZS5pc0VzdGltYXRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHF1ZXJ5ID0geydfaWQnIDogcHJvamVjdElkfTtcclxuICAgICAgICBsZXQgbmV3RGF0YSA9IHsgJHNldCA6IHsncHJvamVjdENvc3RIZWFkcycgOiBwcm9qZWN0Q29zdEhlYWRzfX07XHJcbiAgICAgICAgdGhpcy5wcm9qZWN0UmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCBuZXdEYXRhLHtuZXc6IHRydWV9LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgcmF0ZUl0ZW1zID0gcmF0ZS5yYXRlSXRlbXM7XHJcbiAgICAgICAgICAgIGxldCBwcm9taXNlQXJyYXlGb3JQcm9qZWN0Q2VudHJhbGl6ZWRSYXRlcyA9W107XHJcblxyXG4gICAgICAgICAgICBmb3IobGV0IHJhdGUgb2YgcmF0ZUl0ZW1zKSB7XHJcblxyXG4gICAgICAgICAgICAgIGxldCByYXRlT2JqZWN0RXhpc3RTUUwgPSAnU0VMRUNUICogRlJPTSA/IEFTIHJhdGVzIFdIRVJFIHJhdGVzLml0ZW1OYW1lPSA/JztcclxuICAgICAgICAgICAgICBsZXQgcmF0ZUV4aXN0QXJyYXkgPSBhbGFzcWwocmF0ZU9iamVjdEV4aXN0U1FMLFtjZW50cmFsaXplZFJhdGVzT2ZQcm9qZWN0cyxyYXRlLml0ZW1OYW1lXSk7XHJcbiAgICAgICAgICAgICAgaWYocmF0ZUV4aXN0QXJyYXkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgaWYocmF0ZUV4aXN0QXJyYXlbMF0ucmF0ZSAhPT0gcmF0ZS5yYXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgIC8vdXBkYXRlIHJhdGUgb2YgcmF0ZUl0ZW1cclxuICAgICAgICAgICAgICAgICAgbGV0IHVwZGF0ZVJhdGVPZlByb2plY3RQcm9taXNlID0gdGhpcy51cGRhdGVDZW50cmFsaXplZFJhdGVGb3JQcm9qZWN0KHByb2plY3RJZCwgcmF0ZS5pdGVtTmFtZSwgcmF0ZS5yYXRlKTtcclxuICAgICAgICAgICAgICAgICAgcHJvbWlzZUFycmF5Rm9yUHJvamVjdENlbnRyYWxpemVkUmF0ZXMucHVzaCh1cGRhdGVSYXRlT2ZQcm9qZWN0UHJvbWlzZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vY3JlYXRlIG5ldyByYXRlSXRlbVxyXG4gICAgICAgICAgICAgICAgbGV0IHJhdGVJdGVtIDogQ2VudHJhbGl6ZWRSYXRlID0gbmV3IENlbnRyYWxpemVkUmF0ZShyYXRlLml0ZW1OYW1lLHJhdGUub3JpZ2luYWxJdGVtTmFtZSwgcmF0ZS5yYXRlKTtcclxuICAgICAgICAgICAgICAgIGxldCBhZGROZXdSYXRlT2ZQcm9qZWN0UHJvbWlzZSA9IHRoaXMuYWRkTmV3Q2VudHJhbGl6ZWRSYXRlRm9yUHJvamVjdChwcm9qZWN0SWQsIHJhdGVJdGVtKTtcclxuICAgICAgICAgICAgICAgIHByb21pc2VBcnJheUZvclByb2plY3RDZW50cmFsaXplZFJhdGVzLnB1c2goYWRkTmV3UmF0ZU9mUHJvamVjdFByb21pc2UpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYocHJvbWlzZUFycmF5Rm9yUHJvamVjdENlbnRyYWxpemVkUmF0ZXMubGVuZ3RoICE9PSAwKSB7XHJcblxyXG4gICAgICAgICAgICAgIENDUHJvbWlzZS5hbGwocHJvbWlzZUFycmF5Rm9yUHJvamVjdENlbnRyYWxpemVkUmF0ZXMpLnRoZW4oZnVuY3Rpb24oZGF0YTogQXJyYXk8YW55Pikge1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdSYXRlcyBBcnJheSB1cGRhdGVkIDogJytKU09OLnN0cmluZ2lmeShjZW50cmFsaXplZFJhdGVzT2ZQcm9qZWN0cykpO1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgeyAnZGF0YScgOiAnc3VjY2VzcycgfSk7XHJcblxyXG4gICAgICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGU6YW55KSB7XHJcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoJyBQcm9taXNlIGZhaWxlZCBmb3IgY29udmVydENvc3RIZWFkc0Zyb21SYXRlQW5hbHlzaXNUb0Nvc3RDb250cm9sICEgOicgK0pTT04uc3RyaW5naWZ5KGUubWVzc2FnZSkpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGVycm9yT2JqID0gbmV3IEVycm9yKCk7XHJcbiAgICAgICAgICAgICAgICBlcnJvck9iai5tZXNzYWdlID0gZTtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yT2JqLCBudWxsKTtcclxuICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgeyAnZGF0YScgOiAnc3VjY2VzcycgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvL1VwZGF0ZSBEaXJlY3QgUmF0ZXMgb2YgUHJvamVjdCBDb3N0aGVhZHNcclxuICB1cGRhdGVEaXJlY3RSYXRlT2ZQcm9qZWN0V29ya0l0ZW1zKHByb2plY3RJZDpzdHJpbmcsIGNvc3RIZWFkSWQ6bnVtYmVyLCBjYXRlZ29yeUlkOm51bWJlciwgd29ya0l0ZW1JZDpudW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXJlY3RSYXRlOm51bWJlciwgdXNlcjpVc2VyLCBjYWxsYmFjazooZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpPT4gdm9pZCkge1xyXG5cclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIHVwZGF0ZURpcmVjdFJhdGVPZlByb2plY3RXb3JrSXRlbXMgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICBsZXQgcHJvamVjdGlvbiA9IHsncHJvamVjdENvc3RIZWFkcyc6MX07XHJcbiAgICB0aGlzLnByb2plY3RSZXBvc2l0b3J5LmZpbmRCeUlkV2l0aFByb2plY3Rpb24ocHJvamVjdElkLCBwcm9qZWN0aW9uLCAoZXJyb3IsIHByb2plY3QpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICBsZXQgY29zdEhlYWRMaXN0ID0gcHJvamVjdC5wcm9qZWN0Q29zdEhlYWRzO1xyXG4gICAgICAgIHRoaXMudXBkYXRlRGlyZWN0UmF0ZShjb3N0SGVhZExpc3QsIGNvc3RIZWFkSWQsIGNhdGVnb3J5SWQsIHdvcmtJdGVtSWQsIGRpcmVjdFJhdGUpO1xyXG5cclxuICAgICAgICBsZXQgcXVlcnkgPSB7X2lkOiBwcm9qZWN0SWR9O1xyXG4gICAgICAgIGxldCBkYXRhID0geyRzZXQgOiB7J3Byb2plY3RDb3N0SGVhZHMnIDogY29zdEhlYWRMaXN0fX07XHJcbiAgICAgICAgdGhpcy5wcm9qZWN0UmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCBkYXRhLCB7bmV3OiB0cnVlfSwgKGVycm9yLCBwcm9qZWN0KSA9PiB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kT25lQW5kVXBkYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiAnc3VjY2VzcycsIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBkZWxldGVRdWFudGl0eU9mQnVpbGRpbmdDb3N0SGVhZHNCeU5hbWUocHJvamVjdElkOnN0cmluZywgYnVpbGRpbmdJZDpzdHJpbmcsIGNvc3RIZWFkSWQ6bnVtYmVyLCBjYXRlZ29yeUlkOm51bWJlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd29ya0l0ZW1JZDpudW1iZXIsIGl0ZW1OYW1lOnN0cmluZywgdXNlcjpVc2VyLCBjYWxsYmFjazooZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpPT4gdm9pZCkge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZGVsZXRlUXVhbnRpdHkgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICB0aGlzLmJ1aWxkaW5nUmVwb3NpdG9yeS5maW5kQnlJZChidWlsZGluZ0lkLCAoZXJyb3IsIGJ1aWxkaW5nOkJ1aWxkaW5nKSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgcXVhbnRpdHlJdGVtczogQXJyYXk8UXVhbnRpdHlEZXRhaWxzPjtcclxuICAgICAgICBmb3IobGV0IGNvc3RIZWFkIG9mIGJ1aWxkaW5nLmNvc3RIZWFkcykge1xyXG4gICAgICAgICAgaWYoY29zdEhlYWQucmF0ZUFuYWx5c2lzSWQgPT09IGNvc3RIZWFkSWQpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgY2F0ZWdvcnkgb2YgY29zdEhlYWQuY2F0ZWdvcmllcykge1xyXG4gICAgICAgICAgICAgIGlmKGNhdGVnb3J5LnJhdGVBbmFseXNpc0lkID09PSBjYXRlZ29yeUlkKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB3b3JrSXRlbSBvZiBjYXRlZ29yeS53b3JrSXRlbXMpIHtcclxuICAgICAgICAgICAgICAgICAgaWYod29ya0l0ZW0ucmF0ZUFuYWx5c2lzSWQgPT09IHdvcmtJdGVtSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBxdWFudGl0eUl0ZW1zID0gd29ya0l0ZW0ucXVhbnRpdHkucXVhbnRpdHlJdGVtRGV0YWlscztcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBxdWFudGl0eUluZGV4PTA7IHF1YW50aXR5SW5kZXggPCBxdWFudGl0eUl0ZW1zLmxlbmd0aDsgcXVhbnRpdHlJbmRleCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBpZihxdWFudGl0eUl0ZW1zW3F1YW50aXR5SW5kZXhdLm5hbWUgPT09IGl0ZW1OYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5SXRlbXMuc3BsaWNlKHF1YW50aXR5SW5kZXgsMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHdvcmtJdGVtLnF1YW50aXR5LnRvdGFsID0gYWxhc3FsKCdWQUxVRSBPRiBTRUxFQ1QgUk9VTkQoU1VNKHRvdGFsKSwyKSBGUk9NID8nLFtxdWFudGl0eUl0ZW1zXSk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBxdWVyeSA9IHsgX2lkIDogYnVpbGRpbmdJZCB9O1xyXG4gICAgICAgIGxldCBkYXRhID0geyAkc2V0IDogeydjb3N0SGVhZHMnIDogYnVpbGRpbmcuY29zdEhlYWRzIH19O1xyXG4gICAgICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIGRhdGEse25ldzogdHJ1ZX0sIChlcnJvciwgYnVpbGRpbmcpID0+IHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGZpbmRPbmVBbmRVcGRhdGUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGEgOidzdWNjZXNzJywgYWNjZXNzX3Rva2VuOiB0aGlzLmF1dGhJbnRlcmNlcHRvci5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKX0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbiAgLy9EZWxldGUgUXVhbnRpdHkgT2YgUHJvamVjdCBDb3N0IEhlYWRzIEJ5IE5hbWVcclxuICBkZWxldGVRdWFudGl0eU9mUHJvamVjdENvc3RIZWFkc0J5TmFtZShwcm9qZWN0SWQ6c3RyaW5nLCBjb3N0SGVhZElkOm51bWJlciwgY2F0ZWdvcnlJZDpudW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd29ya0l0ZW1JZDpudW1iZXIsIGl0ZW1OYW1lOnN0cmluZywgdXNlcjpVc2VyLCBjYWxsYmFjazooZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpPT4gdm9pZCkge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZGVsZXRlUXVhbnRpdHkgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICB0aGlzLnByb2plY3RSZXBvc2l0b3J5LmZpbmRCeUlkKHByb2plY3RJZCwgKGVycm9yLCBwcm9qZWN0OlByb2plY3QpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCBxdWFudGl0eUl0ZW1zOiBBcnJheTxRdWFudGl0eURldGFpbHM+O1xyXG4gICAgICAgIGZvcihsZXQgY29zdEhlYWQgb2YgcHJvamVjdC5wcm9qZWN0Q29zdEhlYWRzKSB7XHJcbiAgICAgICAgICBpZihjb3N0SGVhZC5yYXRlQW5hbHlzaXNJZCA9PT0gY29zdEhlYWRJZCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBjYXRlZ29yeSBvZiBjb3N0SGVhZC5jYXRlZ29yaWVzKSB7XHJcbiAgICAgICAgICAgICAgaWYoY2F0ZWdvcnkucmF0ZUFuYWx5c2lzSWQgPT09IGNhdGVnb3J5SWQpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHdvcmtJdGVtIG9mIGNhdGVnb3J5LndvcmtJdGVtcykge1xyXG4gICAgICAgICAgICAgICAgICBpZih3b3JrSXRlbS5yYXRlQW5hbHlzaXNJZCA9PT0gd29ya0l0ZW1JZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHF1YW50aXR5SXRlbXMgPSB3b3JrSXRlbS5xdWFudGl0eS5xdWFudGl0eUl0ZW1EZXRhaWxzO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IHF1YW50aXR5SW5kZXg9MDsgcXVhbnRpdHlJbmRleCA8IHF1YW50aXR5SXRlbXMubGVuZ3RoOyBxdWFudGl0eUluZGV4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgIGlmKHF1YW50aXR5SXRlbXNbcXVhbnRpdHlJbmRleF0ubmFtZSA9PT0gaXRlbU5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcXVhbnRpdHlJdGVtcy5zcGxpY2UocXVhbnRpdHlJbmRleCwxKTtcclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgd29ya0l0ZW0ucXVhbnRpdHkudG90YWwgPSBhbGFzcWwoJ1ZBTFVFIE9GIFNFTEVDVCBST1VORChTVU0odG90YWwpLDIpIEZST00gPycsW3F1YW50aXR5SXRlbXNdKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHF1ZXJ5ID0geyBfaWQgOiBwcm9qZWN0SWQgfTtcclxuICAgICAgICBsZXQgZGF0YSA9IHsgJHNldCA6IHsncHJvamVjdENvc3RIZWFkcycgOiBwcm9qZWN0LnByb2plY3RDb3N0SGVhZHMgfX07XHJcbiAgICAgICAgdGhpcy5wcm9qZWN0UmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCBkYXRhLHtuZXc6IHRydWV9LCAoZXJyb3IsIHByb2plY3QpID0+IHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGZpbmRPbmVBbmRVcGRhdGUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGEgOidzdWNjZXNzJywgYWNjZXNzX3Rva2VuOiB0aGlzLmF1dGhJbnRlcmNlcHRvci5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKX0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG5cclxuICBkZWxldGVXb3JraXRlbShwcm9qZWN0SWQ6c3RyaW5nLCBidWlsZGluZ0lkOnN0cmluZywgY29zdEhlYWRJZDpudW1iZXIsIGNhdGVnb3J5SWQ6bnVtYmVyLCB3b3JrSXRlbUlkOm51bWJlciwgdXNlcjpVc2VyLFxyXG4gICAgICAgICAgICAgICAgIGNhbGxiYWNrOihlcnJvcjogYW55LCByZXN1bHQ6IGFueSk9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBkZWxldGUgV29ya2l0ZW0gaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICB0aGlzLmJ1aWxkaW5nUmVwb3NpdG9yeS5maW5kQnlJZChidWlsZGluZ0lkLCAoZXJyb3IsIGJ1aWxkaW5nOkJ1aWxkaW5nKSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgY29zdEhlYWRMaXN0ID0gYnVpbGRpbmcuY29zdEhlYWRzO1xyXG4gICAgICAgIGxldCBjYXRlZ29yeUxpc3Q6IENhdGVnb3J5W107XHJcbiAgICAgICAgbGV0IFdvcmtJdGVtTGlzdDogV29ya0l0ZW1bXTtcclxuICAgICAgICB2YXIgZmxhZyA9IDA7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBjb3N0SGVhZExpc3QubGVuZ3RoOyBpbmRleCsrKSB7XHJcbiAgICAgICAgICBpZiAoY29zdEhlYWRJZCA9PT0gY29zdEhlYWRMaXN0W2luZGV4XS5yYXRlQW5hbHlzaXNJZCkge1xyXG4gICAgICAgICAgICBjYXRlZ29yeUxpc3QgPSBjb3N0SGVhZExpc3RbaW5kZXhdLmNhdGVnb3JpZXM7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGNhdGVnb3J5SW5kZXggPSAwOyBjYXRlZ29yeUluZGV4IDwgY2F0ZWdvcnlMaXN0Lmxlbmd0aDsgY2F0ZWdvcnlJbmRleCsrKSB7XHJcbiAgICAgICAgICAgICAgaWYgKGNhdGVnb3J5SWQgPT09IGNhdGVnb3J5TGlzdFtjYXRlZ29yeUluZGV4XS5yYXRlQW5hbHlzaXNJZCkge1xyXG4gICAgICAgICAgICAgICAgV29ya0l0ZW1MaXN0ID0gY2F0ZWdvcnlMaXN0W2NhdGVnb3J5SW5kZXhdLndvcmtJdGVtcztcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHdvcmtpdGVtSW5kZXggPSAwOyB3b3JraXRlbUluZGV4IDwgV29ya0l0ZW1MaXN0Lmxlbmd0aDsgd29ya2l0ZW1JbmRleCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgIGlmICh3b3JrSXRlbUlkID09PSBXb3JrSXRlbUxpc3Rbd29ya2l0ZW1JbmRleF0ucmF0ZUFuYWx5c2lzSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBmbGFnID0gMTtcclxuICAgICAgICAgICAgICAgICAgICBXb3JrSXRlbUxpc3Quc3BsaWNlKHdvcmtpdGVtSW5kZXgsIDEpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihmbGFnID09PSAxKSB7XHJcbiAgICAgICAgICBsZXQgcXVlcnkgPSB7X2lkOiBidWlsZGluZ0lkfTtcclxuICAgICAgICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIGJ1aWxkaW5nLCB7bmV3OiB0cnVlfSwgKGVycm9yLCBXb3JrSXRlbUxpc3QpID0+IHtcclxuICAgICAgICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZmluZE9uZUFuZFVwZGF0ZSBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGxldCBtZXNzYWdlID0gJ1dvcmtJdGVtIGRlbGV0ZWQuJztcclxuICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTogV29ya0l0ZW1MaXN0LCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHNldENvc3RIZWFkU3RhdHVzKCBidWlsZGluZ0lkIDogc3RyaW5nLCBjb3N0SGVhZElkIDogbnVtYmVyLCBjb3N0SGVhZEFjdGl2ZVN0YXR1cyA6IHN0cmluZywgdXNlcjogVXNlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBsZXQgcXVlcnkgPSB7J19pZCcgOiBidWlsZGluZ0lkLCAnY29zdEhlYWRzLnJhdGVBbmFseXNpc0lkJyA6IGNvc3RIZWFkSWR9O1xyXG4gICAgbGV0IGFjdGl2ZVN0YXR1cyA9IEpTT04ucGFyc2UoY29zdEhlYWRBY3RpdmVTdGF0dXMpO1xyXG4gICAgbGV0IG5ld0RhdGEgPSB7ICRzZXQgOiB7J2Nvc3RIZWFkcy4kLmFjdGl2ZScgOiBhY3RpdmVTdGF0dXN9fTtcclxuICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIG5ld0RhdGEsIHtuZXc6IHRydWV9LChlcnIsIHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGZpbmRPbmVBbmRVcGRhdGUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGlmKGVycikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGE6IHJlc3BvbnNlLCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlV29ya0l0ZW1TdGF0dXNPZkJ1aWxkaW5nQ29zdEhlYWRzKGJ1aWxkaW5nSWQ6c3RyaW5nLCBjb3N0SGVhZElkOm51bWJlciwgY2F0ZWdvcnlJZDpudW1iZXIsIHdvcmtJdGVtSWQ6bnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3b3JrSXRlbUFjdGl2ZVN0YXR1cyA6IGJvb2xlYW4sIHVzZXI6IFVzZXIsIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIHVwZGF0ZSBXb3JraXRlbSBoYXMgYmVlbiBoaXQnKTtcclxuICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmZpbmRCeUlkKGJ1aWxkaW5nSWQsIChlcnJvciwgYnVpbGRpbmc6QnVpbGRpbmcpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCBjb3N0SGVhZExpc3QgPSBidWlsZGluZy5jb3N0SGVhZHM7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGNvc3RIZWFkRGF0YSBvZiBjb3N0SGVhZExpc3QpIHtcclxuICAgICAgICAgIGlmIChjb3N0SGVhZElkID09PSBjb3N0SGVhZERhdGEucmF0ZUFuYWx5c2lzSWQpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgY2F0ZWdvcnlEYXRhIG9mIGNvc3RIZWFkRGF0YS5jYXRlZ29yaWVzKSB7XHJcbiAgICAgICAgICAgICAgaWYgKGNhdGVnb3J5SWQgPT09IGNhdGVnb3J5RGF0YS5yYXRlQW5hbHlzaXNJZCkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgd29ya0l0ZW1EYXRhIG9mIGNhdGVnb3J5RGF0YS53b3JrSXRlbXMpIHtcclxuICAgICAgICAgICAgICAgICAgaWYgKHdvcmtJdGVtSWQgPT09IHdvcmtJdGVtRGF0YS5yYXRlQW5hbHlzaXNJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHdvcmtJdGVtRGF0YS5hY3RpdmUgPSB3b3JrSXRlbUFjdGl2ZVN0YXR1cztcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgICBsZXQgcXVlcnkgPSB7X2lkOiBidWlsZGluZ0lkfTtcclxuICAgICAgICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIGJ1aWxkaW5nLCB7bmV3OiB0cnVlfSwgKGVycm9yLCByZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kT25lQW5kVXBkYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGE6ICdzdWNjZXNzJywgYWNjZXNzX3Rva2VuOiB0aGlzLmF1dGhJbnRlcmNlcHRvci5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKX0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvLyBVcGRhdGUgV29ya0l0ZW0gU3RhdHVzIE9mIFByb2plY3QgQ29zdEhlYWRzXHJcbiAgdXBkYXRlV29ya0l0ZW1TdGF0dXNPZlByb2plY3RDb3N0SGVhZHMocHJvamVjdElkOnN0cmluZywgY29zdEhlYWRJZDpudW1iZXIsIGNhdGVnb3J5SWQ6bnVtYmVyLCB3b3JrSXRlbUlkOm51bWJlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3b3JrSXRlbUFjdGl2ZVN0YXR1cyA6IGJvb2xlYW4sIHVzZXI6IFVzZXIsIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIFVwZGF0ZSBXb3JrSXRlbSBTdGF0dXMgT2YgUHJvamVjdCBDb3N0IEhlYWRzIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgdGhpcy5wcm9qZWN0UmVwb3NpdG9yeS5maW5kQnlJZChwcm9qZWN0SWQsIChlcnJvciwgcHJvamVjdDpQcm9qZWN0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgY29zdEhlYWRMaXN0ID0gcHJvamVjdC5wcm9qZWN0Q29zdEhlYWRzO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBjb3N0SGVhZERhdGEgb2YgY29zdEhlYWRMaXN0KSB7XHJcbiAgICAgICAgICBpZiAoY29zdEhlYWRJZCA9PT0gY29zdEhlYWREYXRhLnJhdGVBbmFseXNpc0lkKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGNhdGVnb3J5RGF0YSBvZiBjb3N0SGVhZERhdGEuY2F0ZWdvcmllcykge1xyXG4gICAgICAgICAgICAgIGlmIChjYXRlZ29yeUlkID09PSBjYXRlZ29yeURhdGEucmF0ZUFuYWx5c2lzSWQpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHdvcmtJdGVtRGF0YSBvZiBjYXRlZ29yeURhdGEud29ya0l0ZW1zKSB7XHJcbiAgICAgICAgICAgICAgICAgIGlmICh3b3JrSXRlbUlkID09PSB3b3JrSXRlbURhdGEucmF0ZUFuYWx5c2lzSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB3b3JrSXRlbURhdGEuYWN0aXZlID0gd29ya0l0ZW1BY3RpdmVTdGF0dXM7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICAgbGV0IHF1ZXJ5ID0ge19pZDogcHJvamVjdElkfTtcclxuICAgICAgICAgIHRoaXMucHJvamVjdFJlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgcHJvamVjdCwge25ldzogdHJ1ZX0sIChlcnJvciwgcmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgVXBkYXRlIFdvcmtJdGVtIFN0YXR1cyBPZiBQcm9qZWN0IENvc3QgSGVhZHMgLGZpbmRPbmVBbmRVcGRhdGUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTogJ3N1Y2Nlc3MnLCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZUJ1ZGdldGVkQ29zdEZvckNvc3RIZWFkKCBidWlsZGluZ0lkIDogc3RyaW5nLCBjb3N0SGVhZEJ1ZGdldGVkQW1vdW50IDogYW55LCB1c2VyOiBVc2VyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCB1cGRhdGVCdWRnZXRlZENvc3RGb3JDb3N0SGVhZCBoYXMgYmVlbiBoaXQnKTtcclxuICAgIGxldCBxdWVyeSA9IHsnX2lkJyA6IGJ1aWxkaW5nSWQsICdjb3N0SGVhZHMubmFtZScgOiBjb3N0SGVhZEJ1ZGdldGVkQW1vdW50LmNvc3RIZWFkfTtcclxuXHJcbiAgICBsZXQgbmV3RGF0YSA9IHsgJHNldCA6IHtcclxuICAgICAgJ2Nvc3RIZWFkcy4kLmJ1ZGdldGVkQ29zdEFtb3VudCcgOiBjb3N0SGVhZEJ1ZGdldGVkQW1vdW50LmJ1ZGdldGVkQ29zdEFtb3VudCxcclxuICAgIH0gfTtcclxuXHJcbiAgICB0aGlzLmJ1aWxkaW5nUmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCBuZXdEYXRhLCB7bmV3OnRydWV9LChlcnIsIHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGZpbmRPbmVBbmRVcGRhdGUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGlmKGVycikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGE6IHJlc3BvbnNlLCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlQnVkZ2V0ZWRDb3N0Rm9yUHJvamVjdENvc3RIZWFkKCBwcm9qZWN0SWQgOiBzdHJpbmcsIGNvc3RIZWFkQnVkZ2V0ZWRBbW91bnQgOiBhbnksIHVzZXI6IFVzZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIHVwZGF0ZUJ1ZGdldGVkQ29zdEZvckNvc3RIZWFkIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgbGV0IHF1ZXJ5ID0geydfaWQnIDogcHJvamVjdElkLCAncHJvamVjdENvc3RIZWFkcy5uYW1lJyA6IGNvc3RIZWFkQnVkZ2V0ZWRBbW91bnQuY29zdEhlYWR9O1xyXG5cclxuICAgIGxldCBuZXdEYXRhID0geyAkc2V0IDoge1xyXG4gICAgICAncHJvamVjdENvc3RIZWFkcy4kLmJ1ZGdldGVkQ29zdEFtb3VudCcgOiBjb3N0SGVhZEJ1ZGdldGVkQW1vdW50LmJ1ZGdldGVkQ29zdEFtb3VudCxcclxuICAgIH0gfTtcclxuXHJcbiAgICB0aGlzLnByb2plY3RSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIG5ld0RhdGEsIHtuZXc6dHJ1ZX0sKGVyciwgcmVzcG9uc2UpID0+IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZmluZE9uZUFuZFVwZGF0ZSBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgaWYoZXJyKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTogcmVzcG9uc2UsIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVRdWFudGl0eU9mQnVpbGRpbmdDb3N0SGVhZHMocHJvamVjdElkOnN0cmluZywgYnVpbGRpbmdJZDpzdHJpbmcsIGNvc3RIZWFkSWQ6bnVtYmVyLCBjYXRlZ29yeUlkOm51bWJlciwgd29ya0l0ZW1JZDpudW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5RGV0YWlsOlF1YW50aXR5RGV0YWlscywgdXNlcjpVc2VyLCBjYWxsYmFjazooZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpPT4gdm9pZCkge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgdXBkYXRlUXVhbnRpdHlPZkJ1aWxkaW5nQ29zdEhlYWRzIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZEJ5SWQoYnVpbGRpbmdJZCwgKGVycm9yLCBidWlsZGluZykgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IGNvc3RIZWFkTGlzdCA9IGJ1aWxkaW5nLmNvc3RIZWFkcztcclxuICAgICAgICBsZXQgcXVhbnRpdHkgIDogUXVhbnRpdHk7XHJcbiAgICAgICAgZm9yIChsZXQgY29zdEhlYWQgb2YgY29zdEhlYWRMaXN0KSB7XHJcbiAgICAgICAgICBpZiAoY29zdEhlYWRJZCA9PT0gY29zdEhlYWQucmF0ZUFuYWx5c2lzSWQpIHtcclxuICAgICAgICAgICAgbGV0IGNhdGVnb3JpZXNPZkNvc3RIZWFkID0gY29zdEhlYWQuY2F0ZWdvcmllcztcclxuICAgICAgICAgICAgZm9yIChsZXQgY2F0ZWdvcnlEYXRhIG9mIGNhdGVnb3JpZXNPZkNvc3RIZWFkKSB7XHJcbiAgICAgICAgICAgICAgaWYgKGNhdGVnb3J5SWQgPT09IGNhdGVnb3J5RGF0YS5yYXRlQW5hbHlzaXNJZCkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgd29ya0l0ZW1EYXRhIG9mIGNhdGVnb3J5RGF0YS53b3JrSXRlbXMpIHtcclxuICAgICAgICAgICAgICAgICAgaWYgKHdvcmtJdGVtSWQgPT09IHdvcmtJdGVtRGF0YS5yYXRlQW5hbHlzaXNJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHF1YW50aXR5ICA9IHdvcmtJdGVtRGF0YS5xdWFudGl0eTtcclxuICAgICAgICAgICAgICAgICAgICBxdWFudGl0eS5pc0VzdGltYXRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVRdWFudGl0eUl0ZW1zT2ZXb3JrSXRlbSggcXVhbnRpdHksIHF1YW50aXR5RGV0YWlsKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgICBsZXQgcXVlcnkgPSB7X2lkOiBidWlsZGluZ0lkfTtcclxuICAgICAgICAgIGxldCBkYXRhID0geyRzZXQgOiB7J2Nvc3RIZWFkcycgOiBjb3N0SGVhZExpc3R9fTtcclxuICAgICAgICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIGRhdGEsIHtuZXc6IHRydWV9LCAoZXJyb3IsIGJ1aWxkaW5nKSA9PiB7XHJcbiAgICAgICAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGZpbmRPbmVBbmRVcGRhdGUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTogJ3N1Y2Nlc3MnLCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlRGlyZWN0UXVhbnRpdHlPZkJ1aWxkaW5nV29ya0l0ZW1zKHByb2plY3RJZDpzdHJpbmcsIGJ1aWxkaW5nSWQ6c3RyaW5nLCBjb3N0SGVhZElkOm51bWJlciwgY2F0ZWdvcnlJZDpudW1iZXIsIHdvcmtJdGVtSWQ6bnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXJlY3RRdWFudGl0eTpudW1iZXIsIHVzZXI6VXNlciwgY2FsbGJhY2s6KGVycm9yOiBhbnksIHJlc3VsdDogYW55KT0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIHVwZGF0ZURpcmVjdFF1YW50aXR5T2ZCdWlsZGluZ0Nvc3RIZWFkcyBoYXMgYmVlbiBoaXQnKTtcclxuICAgIGxldCBwcm9qZWN0aW9uID0geyBjb3N0SGVhZHMgOiAxIH07XHJcbiAgICB0aGlzLmJ1aWxkaW5nUmVwb3NpdG9yeS5maW5kQnlJZFdpdGhQcm9qZWN0aW9uKGJ1aWxkaW5nSWQsIHByb2plY3Rpb24sIChlcnJvciwgYnVpbGRpbmcpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCBjb3N0SGVhZExpc3QgPSBidWlsZGluZy5jb3N0SGVhZHM7XHJcbiAgICAgICAgdGhpcy5zZXREaXJlY3RRdWFudGl0eU9mV29ya0l0ZW0oY29zdEhlYWRMaXN0LCBjb3N0SGVhZElkLCBjYXRlZ29yeUlkLCB3b3JrSXRlbUlkLCBkaXJlY3RRdWFudGl0eSk7XHJcblxyXG4gICAgICAgIGxldCBxdWVyeSA9IHtfaWQ6IGJ1aWxkaW5nSWR9O1xyXG4gICAgICAgIGxldCBkYXRhID0geyRzZXQgOiB7J2Nvc3RIZWFkcycgOiBjb3N0SGVhZExpc3R9fTtcclxuICAgICAgICB0aGlzLmJ1aWxkaW5nUmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCBkYXRhLCB7bmV3OiB0cnVlfSwgKGVycm9yLCBidWlsZGluZykgPT4ge1xyXG4gICAgICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZmluZE9uZUFuZFVwZGF0ZSBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTogJ3N1Y2Nlc3MnLCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlRGlyZWN0UXVhbnRpdHlPZlByb2plY3RXb3JrSXRlbXMocHJvamVjdElkOnN0cmluZywgY29zdEhlYWRJZDpudW1iZXIsIGNhdGVnb3J5SWQ6bnVtYmVyLCB3b3JrSXRlbUlkOm51bWJlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlyZWN0UXVhbnRpdHk6bnVtYmVyLCB1c2VyOlVzZXIsIGNhbGxiYWNrOihlcnJvcjogYW55LCByZXN1bHQ6IGFueSk9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCB1cGRhdGVEaXJlY3RRdWFudGl0eU9mUHJvamVjdFdvcmtJdGVtcyBoYXMgYmVlbiBoaXQnKTtcclxuICAgIGxldCBwcm9qZWN0aW9uID0geyBwcm9qZWN0Q29zdEhlYWRzIDogMSB9O1xyXG4gICAgdGhpcy5wcm9qZWN0UmVwb3NpdG9yeS5maW5kQnlJZFdpdGhQcm9qZWN0aW9uKHByb2plY3RJZCwgcHJvamVjdGlvbiwoZXJyb3IsIHByb2plY3QpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCBjb3N0SGVhZExpc3QgPSBwcm9qZWN0LnByb2plY3RDb3N0SGVhZHM7XHJcbiAgICAgICAgdGhpcy5zZXREaXJlY3RRdWFudGl0eU9mV29ya0l0ZW0oY29zdEhlYWRMaXN0LCBjb3N0SGVhZElkLCBjYXRlZ29yeUlkLCB3b3JrSXRlbUlkLCBkaXJlY3RRdWFudGl0eSk7XHJcblxyXG4gICAgICAgIGxldCBxdWVyeSA9IHtfaWQ6IHByb2plY3RJZH07XHJcbiAgICAgICAgbGV0IGRhdGEgPSB7JHNldCA6IHsncHJvamVjdENvc3RIZWFkcycgOiBjb3N0SGVhZExpc3R9fTtcclxuICAgICAgICB0aGlzLnByb2plY3RSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIGRhdGEsIHtuZXc6IHRydWV9LCAoZXJyb3IsIGJ1aWxkaW5nKSA9PiB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kT25lQW5kVXBkYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiAnc3VjY2VzcycsIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzZXREaXJlY3RRdWFudGl0eU9mV29ya0l0ZW0oY29zdEhlYWRMaXN0OiBBcnJheTxDb3N0SGVhZD4sIGNvc3RIZWFkSWQ6IG51bWJlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnlJZDogbnVtYmVyLCB3b3JrSXRlbUlkOiBudW1iZXIsIGRpcmVjdFF1YW50aXR5OiBudW1iZXIpIHtcclxuICAgIGxldCBxdWFudGl0eTogUXVhbnRpdHk7XHJcbiAgICBmb3IgKGxldCBjb3N0SGVhZCBvZiBjb3N0SGVhZExpc3QpIHtcclxuICAgICAgaWYgKGNvc3RIZWFkSWQgPT09IGNvc3RIZWFkLnJhdGVBbmFseXNpc0lkKSB7XHJcbiAgICAgICAgbGV0IGNhdGVnb3JpZXNPZkNvc3RIZWFkID0gY29zdEhlYWQuY2F0ZWdvcmllcztcclxuICAgICAgICBmb3IgKGxldCBjYXRlZ29yeURhdGEgb2YgY2F0ZWdvcmllc09mQ29zdEhlYWQpIHtcclxuICAgICAgICAgIGlmIChjYXRlZ29yeUlkID09PSBjYXRlZ29yeURhdGEucmF0ZUFuYWx5c2lzSWQpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgd29ya0l0ZW1EYXRhIG9mIGNhdGVnb3J5RGF0YS53b3JrSXRlbXMpIHtcclxuICAgICAgICAgICAgICBpZiAod29ya0l0ZW1JZCA9PT0gd29ya0l0ZW1EYXRhLnJhdGVBbmFseXNpc0lkKSB7XHJcbiAgICAgICAgICAgICAgICBxdWFudGl0eSA9IHdvcmtJdGVtRGF0YS5xdWFudGl0eTtcclxuICAgICAgICAgICAgICAgIHF1YW50aXR5LmlzRXN0aW1hdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHF1YW50aXR5LmlzRGlyZWN0UXVhbnRpdHkgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgcXVhbnRpdHkudG90YWwgPSBkaXJlY3RRdWFudGl0eTtcclxuICAgICAgICAgICAgICAgIHF1YW50aXR5LnF1YW50aXR5SXRlbURldGFpbHMgPSBbXTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHVwZGF0ZVF1YW50aXR5SXRlbXNPZldvcmtJdGVtKHF1YW50aXR5OiBRdWFudGl0eSwgcXVhbnRpdHlEZXRhaWw6IFF1YW50aXR5RGV0YWlscykge1xyXG5cclxuICAgIHF1YW50aXR5LmlzRXN0aW1hdGVkID0gdHJ1ZTtcclxuXHJcbiAgICBpZiAocXVhbnRpdHkucXVhbnRpdHlJdGVtRGV0YWlscy5sZW5ndGggPT09IDApIHtcclxuICAgICAgcXVhbnRpdHlEZXRhaWwudG90YWwgPSBhbGFzcWwoJ1ZBTFVFIE9GIFNFTEVDVCBST1VORChTVU0ocXVhbnRpdHkpLDIpIEZST00gPycsIFtxdWFudGl0eURldGFpbC5xdWFudGl0eUl0ZW1zXSk7XHJcbiAgICAgIHF1YW50aXR5LnF1YW50aXR5SXRlbURldGFpbHMucHVzaChxdWFudGl0eURldGFpbCk7XHJcbiAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgbGV0IGlzRGVmYXVsdEV4aXN0c1NRTCA9ICdTRUxFQ1QgbmFtZSBmcm9tID8gQVMgcXVhbnRpdHlEZXRhaWxzIHdoZXJlIHF1YW50aXR5RGV0YWlscy5uYW1lPVwiZGVmYXVsdFwiJztcclxuICAgICAgbGV0IGlzRGVmYXVsdEV4aXN0c1F1YW50aXR5RGV0YWlsID0gYWxhc3FsKGlzRGVmYXVsdEV4aXN0c1NRTCwgW3F1YW50aXR5LnF1YW50aXR5SXRlbURldGFpbHNdKTtcclxuXHJcbiAgICAgIGlmIChpc0RlZmF1bHRFeGlzdHNRdWFudGl0eURldGFpbC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgcXVhbnRpdHkucXVhbnRpdHlJdGVtRGV0YWlscyA9IFtdO1xyXG4gICAgICAgIHF1YW50aXR5RGV0YWlsLnRvdGFsID0gYWxhc3FsKCdWQUxVRSBPRiBTRUxFQ1QgUk9VTkQoU1VNKHF1YW50aXR5KSwyKSBGUk9NID8nLCBbcXVhbnRpdHlEZXRhaWwucXVhbnRpdHlJdGVtc10pO1xyXG4gICAgICAgIHF1YW50aXR5LnF1YW50aXR5SXRlbURldGFpbHMucHVzaChxdWFudGl0eURldGFpbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHF1YW50aXR5RGV0YWlsLm5hbWUgIT09ICdkZWZhdWx0Jykge1xyXG4gICAgICAgICAgbGV0IGlzSXRlbUFscmVhZHlFeGlzdFNRTCA9ICdTRUxFQ1QgbmFtZSBmcm9tID8gQVMgcXVhbnRpdHlEZXRhaWxzIHdoZXJlIHF1YW50aXR5RGV0YWlscy5uYW1lPVwiJyArIHF1YW50aXR5RGV0YWlsLm5hbWUgKyAnXCInO1xyXG4gICAgICAgICAgbGV0IGlzSXRlbUFscmVhZHlFeGlzdHMgPSBhbGFzcWwoaXNJdGVtQWxyZWFkeUV4aXN0U1FMLCBbcXVhbnRpdHkucXVhbnRpdHlJdGVtRGV0YWlsc10pO1xyXG5cclxuICAgICAgICAgIGlmIChpc0l0ZW1BbHJlYWR5RXhpc3RzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgcXVhbnRpdHlpbmRleCA9IDA7IHF1YW50aXR5aW5kZXggPCBxdWFudGl0eS5xdWFudGl0eUl0ZW1EZXRhaWxzLmxlbmd0aDsgcXVhbnRpdHlpbmRleCsrKSB7XHJcbiAgICAgICAgICAgICAgaWYocXVhbnRpdHkucXVhbnRpdHlJdGVtRGV0YWlsc1txdWFudGl0eWluZGV4XS5uYW1lID09PSBxdWFudGl0eURldGFpbC5uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBxdWFudGl0eS5xdWFudGl0eUl0ZW1EZXRhaWxzW3F1YW50aXR5aW5kZXhdLnF1YW50aXR5SXRlbXMgPSBxdWFudGl0eURldGFpbC5xdWFudGl0eUl0ZW1zO1xyXG4gICAgICAgICAgICAgICAgcXVhbnRpdHkucXVhbnRpdHlJdGVtRGV0YWlsc1txdWFudGl0eWluZGV4XS50b3RhbCA9IGFsYXNxbCgnVkFMVUUgT0YgU0VMRUNUIFJPVU5EKFNVTShxdWFudGl0eSksMikgRlJPTSA/JywgW3F1YW50aXR5RGV0YWlsLnF1YW50aXR5SXRlbXNdKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHF1YW50aXR5RGV0YWlsLnRvdGFsID0gYWxhc3FsKCdWQUxVRSBPRiBTRUxFQ1QgUk9VTkQoU1VNKHF1YW50aXR5KSwyKSBGUk9NID8nLCBbcXVhbnRpdHlEZXRhaWwucXVhbnRpdHlJdGVtc10pO1xyXG4gICAgICAgICAgICBxdWFudGl0eS5xdWFudGl0eUl0ZW1EZXRhaWxzLnB1c2gocXVhbnRpdHlEZXRhaWwpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBxdWFudGl0eS5xdWFudGl0eUl0ZW1EZXRhaWxzID0gW107XHJcbiAgICAgICAgICBxdWFudGl0eURldGFpbC50b3RhbCA9IGFsYXNxbCgnVkFMVUUgT0YgU0VMRUNUIFJPVU5EKFNVTShxdWFudGl0eSksMikgRlJPTSA/JywgW3F1YW50aXR5RGV0YWlsLnF1YW50aXR5SXRlbXNdKTtcclxuICAgICAgICAgIHF1YW50aXR5LnF1YW50aXR5SXRlbURldGFpbHMucHVzaChxdWFudGl0eURldGFpbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBxdWFudGl0eS50b3RhbCA9IGFsYXNxbCgnVkFMVUUgT0YgU0VMRUNUIFJPVU5EKFNVTSh0b3RhbCksMikgRlJPTSA/JywgW3F1YW50aXR5LnF1YW50aXR5SXRlbURldGFpbHNdKTtcclxuICB9XHJcblxyXG4vL1VwZGF0ZSBRdWFudGl0eSBPZiBQcm9qZWN0IENvc3QgSGVhZHNcclxuICB1cGRhdGVRdWFudGl0eU9mUHJvamVjdENvc3RIZWFkcyhwcm9qZWN0SWQ6c3RyaW5nLCBjb3N0SGVhZElkOm51bWJlciwgY2F0ZWdvcnlJZDpudW1iZXIsIHdvcmtJdGVtSWQ6bnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5RGV0YWlsczpRdWFudGl0eURldGFpbHMsIHVzZXI6VXNlciwgY2FsbGJhY2s6KGVycm9yOiBhbnksIHJlc3VsdDogYW55KT0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIFVwZGF0ZSBRdWFudGl0eSBPZiBQcm9qZWN0IENvc3QgSGVhZHMgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICB0aGlzLnByb2plY3RSZXBvc2l0b3J5LmZpbmRCeUlkKHByb2plY3RJZCwgKGVycm9yLCBwcm9qZWN0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgY29zdEhlYWRMaXN0ID0gcHJvamVjdC5wcm9qZWN0Q29zdEhlYWRzO1xyXG4gICAgICAgIGxldCBxdWFudGl0eSAgOiBRdWFudGl0eTtcclxuICAgICAgICBmb3IgKGxldCBjb3N0SGVhZCBvZiBjb3N0SGVhZExpc3QpIHtcclxuICAgICAgICAgIGlmIChjb3N0SGVhZElkID09PSBjb3N0SGVhZC5yYXRlQW5hbHlzaXNJZCkge1xyXG4gICAgICAgICAgICBsZXQgY2F0ZWdvcmllc09mQ29zdEhlYWQgPSBjb3N0SGVhZC5jYXRlZ29yaWVzO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBjYXRlZ29yeURhdGEgb2YgY2F0ZWdvcmllc09mQ29zdEhlYWQpIHtcclxuICAgICAgICAgICAgICBpZiAoY2F0ZWdvcnlJZCA9PT0gY2F0ZWdvcnlEYXRhLnJhdGVBbmFseXNpc0lkKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgd29ya0l0ZW1zT2ZDYXRlZ29yeSA9IGNhdGVnb3J5RGF0YS53b3JrSXRlbXM7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB3b3JrSXRlbURhdGEgb2Ygd29ya0l0ZW1zT2ZDYXRlZ29yeSkge1xyXG4gICAgICAgICAgICAgICAgICBpZiAod29ya0l0ZW1JZCA9PT0gd29ya0l0ZW1EYXRhLnJhdGVBbmFseXNpc0lkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcXVhbnRpdHkgPSB3b3JrSXRlbURhdGEucXVhbnRpdHk7XHJcbiAgICAgICAgICAgICAgICAgICAgcXVhbnRpdHkuaXNFc3RpbWF0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlUXVhbnRpdHlJdGVtc09mV29ya0l0ZW0oIHF1YW50aXR5LCBxdWFudGl0eURldGFpbHMpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgcXVlcnkgPSB7X2lkOiBwcm9qZWN0SWR9O1xyXG4gICAgICAgIGxldCBkYXRhID0geyRzZXQgOiB7J3Byb2plY3RDb3N0SGVhZHMnIDogY29zdEhlYWRMaXN0fX07XHJcbiAgICAgICAgdGhpcy5wcm9qZWN0UmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCBkYXRhLCB7bmV3OiB0cnVlfSwgKGVycm9yLCBwcm9qZWN0KSA9PiB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kT25lQW5kVXBkYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiAnc3VjY2VzcycsIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvL0dldCBJbi1BY3RpdmUgQ2F0ZWdvcmllcyBGcm9tIERhdGFiYXNlXHJcbiAgZ2V0SW5BY3RpdmVDYXRlZ29yaWVzQnlDb3N0SGVhZElkKHByb2plY3RJZDpzdHJpbmcsIGJ1aWxkaW5nSWQ6c3RyaW5nLCBjb3N0SGVhZElkOnN0cmluZywgdXNlcjpVc2VyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazooZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpPT4gdm9pZCkge1xyXG5cclxuICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmZpbmRCeUlkKGJ1aWxkaW5nSWQsIChlcnJvciwgYnVpbGRpbmcpID0+IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgR2V0IEluLUFjdGl2ZSBDYXRlZ29yaWVzIEJ5IENvc3QgSGVhZCBJZCBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCBjb3N0SGVhZHMgPSBidWlsZGluZy5jb3N0SGVhZHM7XHJcbiAgICAgICAgbGV0IGNhdGVnb3JpZXMgOiBBcnJheTxDYXRlZ29yeT49IG5ldyBBcnJheTxDYXRlZ29yeT4oKTtcclxuICAgICAgICBmb3IobGV0IGNvc3RIZWFkSW5kZXggPSAwOyBjb3N0SGVhZEluZGV4PGNvc3RIZWFkcy5sZW5ndGg7IGNvc3RIZWFkSW5kZXgrKykge1xyXG4gICAgICAgICAgaWYocGFyc2VJbnQoY29zdEhlYWRJZCkgPT09IGNvc3RIZWFkc1tjb3N0SGVhZEluZGV4XS5yYXRlQW5hbHlzaXNJZCkge1xyXG4gICAgICAgICAgICBsZXQgY2F0ZWdvcmllc0xpc3QgPSBjb3N0SGVhZHNbY29zdEhlYWRJbmRleF0uY2F0ZWdvcmllcztcclxuICAgICAgICAgICAgZm9yKGxldCBjYXRlZ29yeUluZGV4ID0gMDsgY2F0ZWdvcnlJbmRleCA8IGNhdGVnb3JpZXNMaXN0Lmxlbmd0aDsgY2F0ZWdvcnlJbmRleCsrKSB7XHJcbiAgICAgICAgICAgICAgaWYoY2F0ZWdvcmllc0xpc3RbY2F0ZWdvcnlJbmRleF0uYWN0aXZlID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgY2F0ZWdvcmllcy5wdXNoKGNhdGVnb3JpZXNMaXN0W2NhdGVnb3J5SW5kZXhdKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGE6IGNhdGVnb3JpZXMsIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRXb3JrSXRlbUxpc3RPZkJ1aWxkaW5nQ2F0ZWdvcnkocHJvamVjdElkOnN0cmluZywgYnVpbGRpbmdJZDpzdHJpbmcsIGNvc3RIZWFkSWQ6bnVtYmVyLCBjYXRlZ29yeUlkOm51bWJlciwgdXNlcjpVc2VyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazooZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpPT4gdm9pZCkge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZ2V0V29ya0l0ZW1MaXN0T2ZCdWlsZGluZ0NhdGVnb3J5IGhhcyBiZWVuIGhpdCcpO1xyXG5cclxuICAgIGxldCBxdWVyeSA9IFtcclxuICAgICAgeyAkbWF0Y2g6IHsnX2lkJzogT2JqZWN0SWQoYnVpbGRpbmdJZCksICdjb3N0SGVhZHMucmF0ZUFuYWx5c2lzSWQnOiBjb3N0SGVhZElkIH19LFxyXG4gICAgICB7ICR1bndpbmQ6ICckY29zdEhlYWRzJ30sXHJcbiAgICAgIHsgJHByb2plY3QgOiB7J2Nvc3RIZWFkcyc6MSwncmF0ZXMnOjF9fSxcclxuICAgICAgeyAkdW53aW5kOiAnJGNvc3RIZWFkcy5jYXRlZ29yaWVzJ30sXHJcbiAgICAgIHsgJG1hdGNoOiB7J2Nvc3RIZWFkcy5jYXRlZ29yaWVzLnJhdGVBbmFseXNpc0lkJzpjYXRlZ29yeUlkfX0sXHJcbiAgICAgIHsgJHByb2plY3QgOiB7J2Nvc3RIZWFkcy5jYXRlZ29yaWVzLndvcmtJdGVtcyc6MSwgJ3JhdGVzJzoxfX1cclxuICAgIF07XHJcblxyXG4gICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuYWdncmVnYXRlKHF1ZXJ5LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBHZXQgd29ya2l0ZW1zIGZvciBzcGVjaWZpYyBjYXRlZ29yeSBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmKHJlc3VsdC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICBsZXQgd29ya0l0ZW1zT2ZCdWlsZGluZ0NhdGVnb3J5ID0gcmVzdWx0WzBdLmNvc3RIZWFkcy5jYXRlZ29yaWVzLndvcmtJdGVtcztcclxuICAgICAgICAgIGxldCB3b3JrSXRlbXNMaXN0V2l0aEJ1aWxkaW5nUmF0ZXMgPSB0aGlzLmdldFdvcmtJdGVtTGlzdFdpdGhDZW50cmFsaXplZFJhdGVzKHdvcmtJdGVtc09mQnVpbGRpbmdDYXRlZ29yeSwgcmVzdWx0WzBdLnJhdGVzLCB0cnVlKTtcclxuICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiB3b3JrSXRlbXNMaXN0V2l0aEJ1aWxkaW5nUmF0ZXMud29ya0l0ZW1zLCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxldCBlcnJvciA9IG5ldyBFcnJvcigpO1xyXG4gICAgICAgICAgZXJyb3IubWVzc2FnZSA9IG1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9SRVNQT05TRTtcclxuICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0V29ya0l0ZW1MaXN0T2ZQcm9qZWN0Q2F0ZWdvcnkocHJvamVjdElkOnN0cmluZywgY29zdEhlYWRJZDpudW1iZXIsIGNhdGVnb3J5SWQ6bnVtYmVyLCB1c2VyOlVzZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6KGVycm9yOiBhbnksIHJlc3VsdDogYW55KT0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGdldFdvcmtJdGVtTGlzdE9mUHJvamVjdENhdGVnb3J5IGhhcyBiZWVuIGhpdCcpO1xyXG5cclxuICAgIGxldCBxdWVyeSA9IFtcclxuICAgICAgeyAkbWF0Y2g6IHsnX2lkJzogT2JqZWN0SWQocHJvamVjdElkKSwgJ3Byb2plY3RDb3N0SGVhZHMucmF0ZUFuYWx5c2lzSWQnOiBjb3N0SGVhZElkIH19LFxyXG4gICAgICB7ICR1bndpbmQ6ICckcHJvamVjdENvc3RIZWFkcyd9LFxyXG4gICAgICB7ICRwcm9qZWN0IDogeydwcm9qZWN0Q29zdEhlYWRzJzoxLCdyYXRlcyc6MX19LFxyXG4gICAgICB7ICR1bndpbmQ6ICckcHJvamVjdENvc3RIZWFkcy5jYXRlZ29yaWVzJ30sXHJcbiAgICAgIHsgJG1hdGNoOiB7J3Byb2plY3RDb3N0SGVhZHMuY2F0ZWdvcmllcy5yYXRlQW5hbHlzaXNJZCc6Y2F0ZWdvcnlJZH19LFxyXG4gICAgICB7ICRwcm9qZWN0IDogeydwcm9qZWN0Q29zdEhlYWRzLmNhdGVnb3JpZXMud29ya0l0ZW1zJzoxLCdyYXRlcyc6MX19XHJcbiAgICBdO1xyXG5cclxuICAgIHRoaXMucHJvamVjdFJlcG9zaXRvcnkuYWdncmVnYXRlKHF1ZXJ5LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBHZXQgd29ya2l0ZW1zIEJ5IENvc3QgSGVhZCAmIGNhdGVnb3J5IElkIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYocmVzdWx0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIGxldCB3b3JrSXRlbXNPZkNhdGVnb3J5ID0gcmVzdWx0WzBdLnByb2plY3RDb3N0SGVhZHMuY2F0ZWdvcmllcy53b3JrSXRlbXM7XHJcbiAgICAgICAgICBsZXQgd29ya0l0ZW1zTGlzdFdpdGhSYXRlcyA9IHRoaXMuZ2V0V29ya0l0ZW1MaXN0V2l0aENlbnRyYWxpemVkUmF0ZXMod29ya0l0ZW1zT2ZDYXRlZ29yeSwgcmVzdWx0WzBdLnJhdGVzLCB0cnVlKTtcclxuICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiB3b3JrSXRlbXNMaXN0V2l0aFJhdGVzLndvcmtJdGVtcywgYWNjZXNzX3Rva2VuOiB0aGlzLmF1dGhJbnRlcmNlcHRvci5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKX0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsZXQgZXJyb3IgPSBuZXcgRXJyb3IoKTtcclxuICAgICAgICAgIGVycm9yLm1lc3NhZ2UgPSBtZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfUkVTUE9OU0U7XHJcbiAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldFdvcmtJdGVtTGlzdFdpdGhDZW50cmFsaXplZFJhdGVzKHdvcmtJdGVtc09mQ2F0ZWdvcnk6IEFycmF5PFdvcmtJdGVtPiwgY2VudHJhbGl6ZWRSYXRlczogQXJyYXk8YW55PiwgaXNXb3JrSXRlbUFjdGl2ZTpib29sZWFuKSB7XHJcblxyXG4gICAgbGV0IHdvcmtJdGVtc0xpc3RXaXRoUmF0ZXM6IFdvcmtJdGVtTGlzdFdpdGhSYXRlc0RUTyA9IG5ldyBXb3JrSXRlbUxpc3RXaXRoUmF0ZXNEVE8oKTtcclxuICAgIGZvciAobGV0IHdvcmtJdGVtRGF0YSBvZiB3b3JrSXRlbXNPZkNhdGVnb3J5KSB7XHJcbiAgICAgIGlmICh3b3JrSXRlbURhdGEuYWN0aXZlID09PSBpc1dvcmtJdGVtQWN0aXZlKSB7XHJcbiAgICAgICAgbGV0IHdvcmtJdGVtOiBXb3JrSXRlbSA9IHdvcmtJdGVtRGF0YTtcclxuICAgICAgICBsZXQgcmF0ZUl0ZW1zT2ZXb3JrSXRlbSA9IHdvcmtJdGVtRGF0YS5yYXRlLnJhdGVJdGVtcztcclxuICAgICAgICB3b3JrSXRlbS5yYXRlLnJhdGVJdGVtcyA9IHRoaXMuZ2V0UmF0ZXNGcm9tQ2VudHJhbGl6ZWRyYXRlcyhyYXRlSXRlbXNPZldvcmtJdGVtLCBjZW50cmFsaXplZFJhdGVzKTtcclxuXHJcbiAgICAgICAgbGV0IGFycmF5T2ZSYXRlSXRlbXMgPSB3b3JrSXRlbS5yYXRlLnJhdGVJdGVtcztcclxuICAgICAgICBsZXQgdG90YWxPZkFsbFJhdGVJdGVtcyA9IGFsYXNxbCgnVkFMVUUgT0YgU0VMRUNUIFNVTSh0b3RhbEFtb3VudCkgRlJPTSA/JyxbYXJyYXlPZlJhdGVJdGVtc10pO1xyXG4gICAgICAgIGlmKCF3b3JrSXRlbS5pc0RpcmVjdFJhdGUpIHtcclxuICAgICAgICAgIHdvcmtJdGVtLnJhdGUudG90YWwgPSB0b3RhbE9mQWxsUmF0ZUl0ZW1zIC8gd29ya0l0ZW0ucmF0ZS5xdWFudGl0eTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHF1YW50aXR5SXRlbXMgPSB3b3JrSXRlbS5xdWFudGl0eS5xdWFudGl0eUl0ZW1EZXRhaWxzO1xyXG5cclxuICAgICAgICBpZighd29ya0l0ZW0ucXVhbnRpdHkuaXNEaXJlY3RRdWFudGl0eSkge1xyXG4gICAgICAgICAgICB3b3JrSXRlbS5xdWFudGl0eS50b3RhbCA9IGFsYXNxbCgnVkFMVUUgT0YgU0VMRUNUIFJPVU5EKFNVTSh0b3RhbCksMikgRlJPTSA/JyxbcXVhbnRpdHlJdGVtc10pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgIGlmKHdvcmtJdGVtLnJhdGUuaXNFc3RpbWF0ZWQgJiYgd29ya0l0ZW0ucXVhbnRpdHkuaXNFc3RpbWF0ZWQpIHtcclxuICAgICAgICAgICB3b3JrSXRlbS5hbW91bnQgPSB3b3JrSXRlbS5yYXRlLnRvdGFsICogd29ya0l0ZW0ucXVhbnRpdHkudG90YWw7XHJcbiAgICAgICAgICAgd29ya0l0ZW1zTGlzdFdpdGhSYXRlcy53b3JrSXRlbXNBbW91bnQgPSB3b3JrSXRlbXNMaXN0V2l0aFJhdGVzLndvcmtJdGVtc0Ftb3VudCsgd29ya0l0ZW0uYW1vdW50O1xyXG4gICAgICAgICB9XHJcbiAgICAgIHdvcmtJdGVtc0xpc3RXaXRoUmF0ZXMud29ya0l0ZW1zLnB1c2god29ya0l0ZW0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gd29ya0l0ZW1zTGlzdFdpdGhSYXRlcztcclxuICB9XHJcblxyXG4gIGdldFJhdGVzRnJvbUNlbnRyYWxpemVkcmF0ZXMocmF0ZUl0ZW1zT2ZXb3JrSXRlbTogQXJyYXk8UmF0ZUl0ZW0+LCBjZW50cmFsaXplZFJhdGVzOkFycmF5PGFueT4pIHtcclxuICAgIGxldCByYXRlSXRlbXNTUUwgPSAnU0VMRUNUIHJhdGVJdGVtLml0ZW1OYW1lLCByYXRlSXRlbS5vcmlnaW5hbEl0ZW1OYW1lLCByYXRlSXRlbS5yYXRlQW5hbHlzaXNJZCwgcmF0ZUl0ZW0udHlwZSwnICtcclxuICAgICAgJ3JhdGVJdGVtLnF1YW50aXR5LCBjZW50cmFsaXplZFJhdGVzLnJhdGUsIHJhdGVJdGVtLnVuaXQsIHJhdGVJdGVtLnRvdGFsQW1vdW50LCByYXRlSXRlbS50b3RhbFF1YW50aXR5ICcgK1xyXG4gICAgICAnRlJPTSA/IEFTIHJhdGVJdGVtIEpPSU4gPyBBUyBjZW50cmFsaXplZFJhdGVzIE9OIHJhdGVJdGVtLml0ZW1OYW1lID0gY2VudHJhbGl6ZWRSYXRlcy5pdGVtTmFtZSc7XHJcbiAgICBsZXQgcmF0ZUl0ZW1zRm9yV29ya0l0ZW0gPSBhbGFzcWwocmF0ZUl0ZW1zU1FMLCBbcmF0ZUl0ZW1zT2ZXb3JrSXRlbSwgY2VudHJhbGl6ZWRSYXRlc10pO1xyXG4gICAgcmV0dXJuIHJhdGVJdGVtc0ZvcldvcmtJdGVtO1xyXG4gIH1cclxuXHJcbiAgYWRkV29ya2l0ZW0ocHJvamVjdElkOnN0cmluZywgYnVpbGRpbmdJZDpzdHJpbmcsIGNvc3RIZWFkSWQ6bnVtYmVyLCBjYXRlZ29yeUlkOm51bWJlciwgd29ya0l0ZW06IFdvcmtJdGVtLFxyXG4gICAgICAgICAgICAgIHVzZXI6VXNlciwgY2FsbGJhY2s6KGVycm9yOiBhbnksIHJlc3VsdDogYW55KT0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGFkZFdvcmtpdGVtIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZEJ5SWQoYnVpbGRpbmdJZCwgKGVycm9yLCBidWlsZGluZzpCdWlsZGluZykgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IHJlc3BvbnNlV29ya2l0ZW0gOiBBcnJheTxXb3JrSXRlbT49IG51bGw7XHJcbiAgICAgICAgZm9yKGxldCBpbmRleCA9IDA7IGJ1aWxkaW5nLmNvc3RIZWFkcy5sZW5ndGggPiBpbmRleDsgaW5kZXgrKykge1xyXG4gICAgICAgICAgaWYoYnVpbGRpbmcuY29zdEhlYWRzW2luZGV4XS5yYXRlQW5hbHlzaXNJZCA9PT0gY29zdEhlYWRJZCkge1xyXG4gICAgICAgICAgICBsZXQgY2F0ZWdvcnkgPSBidWlsZGluZy5jb3N0SGVhZHNbaW5kZXhdLmNhdGVnb3JpZXM7XHJcbiAgICAgICAgICAgIGZvcihsZXQgY2F0ZWdvcnlJbmRleCA9IDA7IGNhdGVnb3J5Lmxlbmd0aCA+IGNhdGVnb3J5SW5kZXg7IGNhdGVnb3J5SW5kZXgrKykge1xyXG4gICAgICAgICAgICAgIGlmKGNhdGVnb3J5W2NhdGVnb3J5SW5kZXhdLnJhdGVBbmFseXNpc0lkID09PSBjYXRlZ29yeUlkKSB7XHJcbiAgICAgICAgICAgICAgICBjYXRlZ29yeVtjYXRlZ29yeUluZGV4XS53b3JrSXRlbXMucHVzaCh3b3JrSXRlbSk7XHJcbiAgICAgICAgICAgICAgICByZXNwb25zZVdvcmtpdGVtID0gY2F0ZWdvcnlbY2F0ZWdvcnlJbmRleF0ud29ya0l0ZW1zO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgcXVlcnkgPSB7IF9pZCA6IGJ1aWxkaW5nSWQgfTtcclxuICAgICAgICAgICAgbGV0IG5ld0RhdGEgPSB7ICRzZXQgOiB7J2Nvc3RIZWFkcycgOiBidWlsZGluZy5jb3N0SGVhZHN9fTtcclxuICAgICAgICAgICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgbmV3RGF0YSx7bmV3OiB0cnVlfSwgKGVycm9yLCBidWlsZGluZykgPT4ge1xyXG4gICAgICAgICAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGZpbmRPbmVBbmRVcGRhdGUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiByZXNwb25zZVdvcmtpdGVtLCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgYWRkQ2F0ZWdvcnlCeUNvc3RIZWFkSWQocHJvamVjdElkOnN0cmluZywgYnVpbGRpbmdJZDpzdHJpbmcsIGNvc3RIZWFkSWQ6c3RyaW5nLCBjYXRlZ29yeURldGFpbHMgOiBhbnksIHVzZXI6VXNlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazooZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpPT4gdm9pZCkge1xyXG5cclxuICAgIGxldCBjYXRlZ29yeU9iaiA6IENhdGVnb3J5ID0gbmV3IENhdGVnb3J5KGNhdGVnb3J5RGV0YWlscy5jYXRlZ29yeSwgY2F0ZWdvcnlEZXRhaWxzLmNhdGVnb3J5SWQpO1xyXG5cclxuICAgIGxldCBxdWVyeSA9IHsnX2lkJyA6IGJ1aWxkaW5nSWQsICdjb3N0SGVhZHMucmF0ZUFuYWx5c2lzSWQnIDogcGFyc2VJbnQoY29zdEhlYWRJZCl9O1xyXG4gICAgbGV0IG5ld0RhdGEgPSB7ICRwdXNoOiB7ICdjb3N0SGVhZHMuJC5jYXRlZ29yaWVzJzogY2F0ZWdvcnlPYmogfX07XHJcblxyXG4gICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgbmV3RGF0YSx7bmV3OiB0cnVlfSwgKGVycm9yLCBidWlsZGluZykgPT4ge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBhZGRDYXRlZ29yeUJ5Q29zdEhlYWRJZCBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiBidWlsZGluZywgYWNjZXNzX3Rva2VuOiB0aGlzLmF1dGhJbnRlcmNlcHRvci5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKX0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vVXBkYXRlIHN0YXR1cyAoIHRydWUvZmFsc2UgKSBvZiBjYXRlZ29yeVxyXG4gIHVwZGF0ZUNhdGVnb3J5U3RhdHVzKHByb2plY3RJZDpzdHJpbmcsIGJ1aWxkaW5nSWQ6c3RyaW5nLCBjb3N0SGVhZElkOm51bWJlciwgY2F0ZWdvcnlJZDpudW1iZXIgLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5QWN0aXZlU3RhdHVzOmJvb2xlYW4sIHVzZXI6VXNlciwgY2FsbGJhY2s6KGVycm9yOiBhbnksIHJlc3VsdDogYW55KT0+IHZvaWQpIHtcclxuXHJcbiAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmZpbmRCeUlkKGJ1aWxkaW5nSWQsIChlcnJvciwgYnVpbGRpbmc6QnVpbGRpbmcpID0+IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgdXBkYXRlIENhdGVnb3J5IFN0YXR1cyBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCBjb3N0SGVhZHMgPSBidWlsZGluZy5jb3N0SGVhZHM7XHJcbiAgICAgICAgbGV0IGNhdGVnb3JpZXMgOiBBcnJheTxDYXRlZ29yeT49IG5ldyBBcnJheTxDYXRlZ29yeT4oKTtcclxuICAgICAgICBsZXQgdXBkYXRlZENhdGVnb3JpZXMgOiBBcnJheTxDYXRlZ29yeT49IG5ldyBBcnJheTxDYXRlZ29yeT4oKTtcclxuICAgICAgICBsZXQgaW5kZXggOiBudW1iZXI7XHJcblxyXG4gICAgICAgIGZvcihsZXQgY29zdEhlYWRJbmRleD0wOyBjb3N0SGVhZEluZGV4PGNvc3RIZWFkcy5sZW5ndGg7IGNvc3RIZWFkSW5kZXgrKykge1xyXG4gICAgICAgICAgaWYoY29zdEhlYWRJZCA9PT0gY29zdEhlYWRzW2Nvc3RIZWFkSW5kZXhdLnJhdGVBbmFseXNpc0lkKSB7XHJcbiAgICAgICAgICAgIGNhdGVnb3JpZXMgPSBjb3N0SGVhZHNbY29zdEhlYWRJbmRleF0uY2F0ZWdvcmllcztcclxuICAgICAgICAgICAgZm9yKGxldCBjYXRlZ29yeUluZGV4ID0gMDsgY2F0ZWdvcnlJbmRleDxjYXRlZ29yaWVzLmxlbmd0aDsgY2F0ZWdvcnlJbmRleCsrKSB7XHJcbiAgICAgICAgICAgICAgaWYoY2F0ZWdvcmllc1tjYXRlZ29yeUluZGV4XS5yYXRlQW5hbHlzaXNJZCA9PT0gY2F0ZWdvcnlJZCkge1xyXG4gICAgICAgICAgICAgICAgY2F0ZWdvcmllc1tjYXRlZ29yeUluZGV4XS5hY3RpdmUgPSBjYXRlZ29yeUFjdGl2ZVN0YXR1cztcclxuICAgICAgICAgICAgICAgIHVwZGF0ZWRDYXRlZ29yaWVzLnB1c2goY2F0ZWdvcmllc1tjYXRlZ29yeUluZGV4XSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgcXVlcnkgPSB7J19pZCcgOiBidWlsZGluZ0lkLCAnY29zdEhlYWRzLnJhdGVBbmFseXNpc0lkJyA6IGNvc3RIZWFkSWR9O1xyXG4gICAgICAgIGxldCBuZXdEYXRhID0geyckc2V0JyA6IHsnY29zdEhlYWRzLiQuY2F0ZWdvcmllcycgOiBjYXRlZ29yaWVzIH19O1xyXG5cclxuICAgICAgICB0aGlzLmJ1aWxkaW5nUmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCBuZXdEYXRhLHtuZXc6IHRydWV9LCAoZXJyb3IsIGJ1aWxkaW5nKSA9PiB7XHJcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGE6IHVwZGF0ZWRDYXRlZ29yaWVzLCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy9HZXQgYWN0aXZlIGNhdGVnb3JpZXMgZnJvbSBkYXRhYmFzZVxyXG4gIGdldENhdGVnb3JpZXNPZkJ1aWxkaW5nQ29zdEhlYWQocHJvamVjdElkOnN0cmluZywgYnVpbGRpbmdJZDpzdHJpbmcsIGNvc3RIZWFkSWQ6bnVtYmVyLCB1c2VyOlVzZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazooZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpPT4gdm9pZCkge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgR2V0IEFjdGl2ZSBDYXRlZ29yaWVzIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZEJ5SWQoYnVpbGRpbmdJZCwgKGVycm9yLCBidWlsZGluZzpCdWlsZGluZykgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IGJ1aWxkaW5nQ29zdEhlYWRzID0gYnVpbGRpbmcuY29zdEhlYWRzO1xyXG4gICAgICAgIGxldCBjYXRlZ29yaWVzTGlzdFdpdGhDZW50cmFsaXplZFJhdGVzIDogQ2F0ZWdvcmllc0xpc3RXaXRoUmF0ZXNEVE87XHJcblxyXG4gICAgICAgIGZvcihsZXQgY29zdEhlYWREYXRhIG9mIGJ1aWxkaW5nQ29zdEhlYWRzKSB7XHJcbiAgICAgICAgICBpZihjb3N0SGVhZERhdGEucmF0ZUFuYWx5c2lzSWQgPT09IGNvc3RIZWFkSWQpIHtcclxuICAgICAgICAgICAgY2F0ZWdvcmllc0xpc3RXaXRoQ2VudHJhbGl6ZWRSYXRlcyA9IHRoaXMuZ2V0Q2F0ZWdvcmllc0xpc3RXaXRoQ2VudHJhbGl6ZWRSYXRlcyhjb3N0SGVhZERhdGEuY2F0ZWdvcmllcywgYnVpbGRpbmcucmF0ZXMpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGE6IGNhdGVnb3JpZXNMaXN0V2l0aENlbnRyYWxpemVkUmF0ZXMsIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvL0dldCBjYXRlZ29yaWVzIG9mIHByb2plY3RDb3N0SGVhZHMgZnJvbSBkYXRhYmFzZVxyXG4gIGdldENhdGVnb3JpZXNPZlByb2plY3RDb3N0SGVhZChwcm9qZWN0SWQ6c3RyaW5nLCBjb3N0SGVhZElkOm51bWJlciwgdXNlcjpVc2VyLCBjYWxsYmFjazooZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpPT4gdm9pZCkge1xyXG5cclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIEdldCBQcm9qZWN0IENvc3RIZWFkIENhdGVnb3JpZXMgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICB0aGlzLnByb2plY3RSZXBvc2l0b3J5LmZpbmRCeUlkKHByb2plY3RJZCwgKGVycm9yLCBwcm9qZWN0OlByb2plY3QpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCBwcm9qZWN0Q29zdEhlYWRzID0gcHJvamVjdC5wcm9qZWN0Q29zdEhlYWRzO1xyXG4gICAgICAgIGxldCBjYXRlZ29yaWVzTGlzdFdpdGhDZW50cmFsaXplZFJhdGVzIDogQ2F0ZWdvcmllc0xpc3RXaXRoUmF0ZXNEVE87XHJcblxyXG4gICAgICAgIGZvcihsZXQgY29zdEhlYWREYXRhIG9mIHByb2plY3RDb3N0SGVhZHMpIHtcclxuICAgICAgICAgIGlmIChjb3N0SGVhZERhdGEucmF0ZUFuYWx5c2lzSWQgPT09IGNvc3RIZWFkSWQpIHtcclxuICAgICAgICAgICAgY2F0ZWdvcmllc0xpc3RXaXRoQ2VudHJhbGl6ZWRSYXRlcyA9IHRoaXMuZ2V0Q2F0ZWdvcmllc0xpc3RXaXRoQ2VudHJhbGl6ZWRSYXRlcyhjb3N0SGVhZERhdGEuY2F0ZWdvcmllcywgcHJvamVjdC5yYXRlcyk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTogY2F0ZWdvcmllc0xpc3RXaXRoQ2VudHJhbGl6ZWRSYXRlcywgYWNjZXNzX3Rva2VuOiB0aGlzLmF1dGhJbnRlcmNlcHRvci5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKX0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldENvc3RIZWFkRGV0YWlsc09mQnVpbGRpbmcocHJvamVjdElkOnN0cmluZywgYnVpbGRpbmdJZDpzdHJpbmcsIGNvc3RIZWFkSWQ6bnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcjpVc2VyLCBjYWxsYmFjazooZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpPT4gdm9pZCkge1xyXG5cclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIEdldCBQcm9qZWN0IENvc3RIZWFkIENhdGVnb3JpZXMgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICBsZXQgcXVlcnkgPSBbXHJcbiAgICAgIHsgJG1hdGNoOiB7J19pZCc6IE9iamVjdElkKGJ1aWxkaW5nSWQpfX0sXHJcbiAgICAgIHsgJHByb2plY3QgOiB7J2Nvc3RIZWFkcyc6MSwncmF0ZXMnOjF9fSxcclxuICAgICAgeyAkdW53aW5kOiAnJGNvc3RIZWFkcyd9LFxyXG4gICAgICB7ICRtYXRjaDogeydjb3N0SGVhZHMucmF0ZUFuYWx5c2lzSWQnOiBjb3N0SGVhZElkIH19LFxyXG4gICAgICB7ICRwcm9qZWN0IDogeydjb3N0SGVhZHMnOjEsJ19pZCc6MCwncmF0ZXMnOjF9fVxyXG4gICAgXTtcclxuICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmFnZ3JlZ2F0ZShxdWVyeSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgR2V0IHdvcmtpdGVtcyBmb3Igc3BlY2lmaWMgY2F0ZWdvcnkgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZihyZXN1bHQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgbGV0IGRhdGEgPSByZXN1bHRbMF0uY29zdEhlYWRzO1xyXG4gICAgICAgICAgbGV0IGNhdGVnb3JpZXNMaXN0V2l0aENlbnRyYWxpemVkUmF0ZXMgPSB0aGlzLmdldENhdGVnb3JpZXNMaXN0V2l0aENlbnRyYWxpemVkUmF0ZXMoZGF0YS5jYXRlZ29yaWVzLCByZXN1bHRbMF0ucmF0ZXMpO1xyXG4gICAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGE6IGRhdGEsIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbGV0IGVycm9yID0gbmV3IEVycm9yKCk7XHJcbiAgICAgICAgICBlcnJvci5tZXNzYWdlID0gbWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX1JFU1BPTlNFO1xyXG4gICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvL0dldCBjYXRlZ29yeSBsaXN0IHdpdGggY2VudHJhbGl6ZWQgcmF0ZVxyXG4gIGdldENhdGVnb3JpZXNMaXN0V2l0aENlbnRyYWxpemVkUmF0ZXMoY2F0ZWdvcmllc09mQ29zdEhlYWQ6IEFycmF5PENhdGVnb3J5PiwgY2VudHJhbGl6ZWRSYXRlczogQXJyYXk8Q2VudHJhbGl6ZWRSYXRlPikge1xyXG4gICAgbGV0IGNhdGVnb3JpZXNUb3RhbEFtb3VudCA9IDAgO1xyXG5cclxuICAgIGxldCBjYXRlZ29yaWVzTGlzdFdpdGhSYXRlcyA6IENhdGVnb3JpZXNMaXN0V2l0aFJhdGVzRFRPID0gbmV3IENhdGVnb3JpZXNMaXN0V2l0aFJhdGVzRFRPO1xyXG5cclxuICAgIGZvciAobGV0IGNhdGVnb3J5RGF0YSBvZiBjYXRlZ29yaWVzT2ZDb3N0SGVhZCkge1xyXG4gICAgICBsZXQgd29ya0l0ZW1zID0gdGhpcy5nZXRXb3JrSXRlbUxpc3RXaXRoQ2VudHJhbGl6ZWRSYXRlcyhjYXRlZ29yeURhdGEud29ya0l0ZW1zLCBjZW50cmFsaXplZFJhdGVzLCB0cnVlKTtcclxuICAgICAgY2F0ZWdvcnlEYXRhLmFtb3VudCA9IHdvcmtJdGVtcy53b3JrSXRlbXNBbW91bnQ7XHJcbiAgICAgIGNhdGVnb3JpZXNUb3RhbEFtb3VudCA9IGNhdGVnb3JpZXNUb3RhbEFtb3VudCArIHdvcmtJdGVtcy53b3JrSXRlbXNBbW91bnQ7XHJcbiAgICAgIC8vZGVsZXRlIGNhdGVnb3J5RGF0YS53b3JrSXRlbXM7XHJcbiAgICAgIGNhdGVnb3JpZXNMaXN0V2l0aFJhdGVzLmNhdGVnb3JpZXMucHVzaChjYXRlZ29yeURhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKGNhdGVnb3JpZXNUb3RhbEFtb3VudCAhPT0gMCkge1xyXG4gICAgICBjYXRlZ29yaWVzTGlzdFdpdGhSYXRlcy5jYXRlZ29yaWVzQW1vdW50ID0gY2F0ZWdvcmllc1RvdGFsQW1vdW50O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBjYXRlZ29yaWVzTGlzdFdpdGhSYXRlcztcclxuICB9XHJcblxyXG4gIHN5bmNQcm9qZWN0V2l0aFJhdGVBbmFseXNpc0RhdGEocHJvamVjdElkOnN0cmluZywgYnVpbGRpbmdJZDpzdHJpbmcsIHVzZXI6IFVzZXIsIGNhbGxiYWNrOiAoZXJyb3I6YW55LCByZXN1bHQ6YW55KT0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIHN5bmNQcm9qZWN0V2l0aFJhdGVBbmFseXNpc0RhdGEgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICB0aGlzLmdldFByb2plY3RBbmRCdWlsZGluZ0RldGFpbHMocHJvamVjdElkLCBidWlsZGluZ0lkLChlcnJvciwgcHJvamVjdEFuZEJ1aWxkaW5nRGV0YWlscykgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBsb2dnZXIuZXJyb3IoJ1Byb2plY3Qgc2VydmljZSwgZ2V0UHJvamVjdEFuZEJ1aWxkaW5nRGV0YWlscyBmYWlsZWQnKTtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgc3luY1Byb2plY3RXaXRoUmF0ZUFuYWx5c2lzRGF0YS4nKTtcclxuICAgICAgICBsZXQgcHJvamVjdERhdGEgPSBwcm9qZWN0QW5kQnVpbGRpbmdEZXRhaWxzLmRhdGFbMF07XHJcbiAgICAgICAgbGV0IGJ1aWxkaW5ncyA9IHByb2plY3RBbmRCdWlsZGluZ0RldGFpbHMuZGF0YVswXS5idWlsZGluZ3M7XHJcbiAgICAgICAgbGV0IGJ1aWxkaW5nRGF0YTogYW55O1xyXG5cclxuICAgICAgICBmb3IobGV0IGJ1aWxkaW5nIG9mIGJ1aWxkaW5ncykge1xyXG4gICAgICAgICAgaWYoYnVpbGRpbmcuX2lkID09IGJ1aWxkaW5nSWQpIHtcclxuICAgICAgICAgICAgYnVpbGRpbmdEYXRhID0gYnVpbGRpbmc7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYocHJvamVjdERhdGEucHJvamVjdENvc3RIZWFkcy5sZW5ndGggPiAwICkge1xyXG4gICAgICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgc3luY1dpdGhSYXRlQW5hbHlzaXNEYXRhIGJ1aWxkaW5nIE9ubHkuJyk7XHJcbiAgICAgICAgICB0aGlzLnVwZGF0ZUNvc3RIZWFkc0ZvckJ1aWxkaW5nQW5kUHJvamVjdChjYWxsYmFjaywgcHJvamVjdERhdGEsIGJ1aWxkaW5nRGF0YSwgYnVpbGRpbmdJZCwgcHJvamVjdElkKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGNhbGxpbmcgcHJvbWlzZSBmb3Igc3luY1Byb2plY3RXaXRoUmF0ZUFuYWx5c2lzRGF0YSBmb3IgUHJvamVjdCBhbmQgQnVpbGRpbmcuJyk7XHJcbiAgICAgICAgICBsZXQgc3luY0J1aWxkaW5nQ29zdEhlYWRzUHJvbWlzZSA9IHRoaXMudXBkYXRlQnVkZ2V0UmF0ZXNGb3JCdWlsZGluZ0Nvc3RIZWFkcyhDb25zdGFudHMuQlVJTERJTkcsXHJcbiAgICAgICAgICAgIGJ1aWxkaW5nSWQsIHByb2plY3REYXRhLCBidWlsZGluZ0RhdGEpO1xyXG4gICAgICAgICAgbGV0IHN5bmNQcm9qZWN0Q29zdEhlYWRzUHJvbWlzZSA9IHRoaXMudXBkYXRlQnVkZ2V0UmF0ZXNGb3JQcm9qZWN0Q29zdEhlYWRzKENvbnN0YW50cy5BTUVOSVRJRVMsXHJcbiAgICAgICAgICAgIHByb2plY3RJZCwgcHJvamVjdERhdGEsIGJ1aWxkaW5nRGF0YSk7XHJcblxyXG4gICAgICAgICAgQ0NQcm9taXNlLmFsbChbXHJcbiAgICAgICAgICAgIHN5bmNCdWlsZGluZ0Nvc3RIZWFkc1Byb21pc2UsXHJcbiAgICAgICAgICAgIHN5bmNQcm9qZWN0Q29zdEhlYWRzUHJvbWlzZVxyXG4gICAgICAgICAgXSkudGhlbihmdW5jdGlvbihkYXRhOiBBcnJheTxhbnk+KSB7XHJcbiAgICAgICAgICAgIGxvZ2dlci5pbmZvKCdQcm9taXNlIGZvciBzeW5jUHJvamVjdFdpdGhSYXRlQW5hbHlzaXNEYXRhIGZvciBQcm9qZWN0IGFuZCBCdWlsZGluZyBzdWNjZXNzJyk7XHJcbiAgICAgICAgICAgIGxldCBidWlsZGluZ0Nvc3RIZWFkc0RhdGEgPSBkYXRhWzBdO1xyXG4gICAgICAgICAgICBsZXQgcHJvamVjdENvc3RIZWFkc0RhdGEgPSBkYXRhWzFdO1xyXG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7c3RhdHVzOjIwMH0pO1xyXG4gICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24oZTphbnkpIHtcclxuICAgICAgICAgICAgbG9nZ2VyLmVycm9yKCcgUHJvbWlzZSBmYWlsZWQgZm9yIHN5bmNQcm9qZWN0V2l0aFJhdGVBbmFseXNpc0RhdGEgISA6JyArSlNPTi5zdHJpbmdpZnkoZS5tZXNzYWdlKSk7XHJcbiAgICAgICAgICAgIENDUHJvbWlzZS5yZWplY3QoZS5tZXNzYWdlKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZUNvc3RIZWFkc0ZvckJ1aWxkaW5nQW5kUHJvamVjdChjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9qZWN0RGF0YTogYW55LCBidWlsZGluZ0RhdGE6IGFueSwgYnVpbGRpbmdJZDogc3RyaW5nLCBwcm9qZWN0SWQ6IHN0cmluZykge1xyXG5cclxuICAgIGxvZ2dlci5pbmZvKCd1cGRhdGVDb3N0SGVhZHNGb3JCdWlsZGluZ0FuZFByb2plY3QgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICBsZXQgcmF0ZUFuYWx5c2lzU2VydmljZSA9IG5ldyBSYXRlQW5hbHlzaXNTZXJ2aWNlKCk7XHJcbiAgICBsZXQgYnVpbGRpbmdSZXBvc2l0b3J5ID0gbmV3IEJ1aWxkaW5nUmVwb3NpdG9yeSgpO1xyXG4gICAgbGV0IHByb2plY3RSZXBvc2l0b3J5ID0gbmV3IFByb2plY3RSZXBvc2l0b3J5KCk7XHJcblxyXG4gICAgcmF0ZUFuYWx5c2lzU2VydmljZS5jb252ZXJ0Q29zdEhlYWRzRnJvbVJhdGVBbmFseXNpc1RvQ29zdENvbnRyb2woQ29uc3RhbnRzLkJVSUxESU5HLFxyXG4gICAgICAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHtcclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgIGxvZ2dlci5lcnJvcignRXJyb3IgaW4gdXBkYXRlQ29zdEhlYWRzRm9yQnVpbGRpbmdBbmRQcm9qZWN0IDogY29udmVydENvc3RIZWFkc0Zyb21SYXRlQW5hbHlzaXNUb0Nvc3RDb250cm9sIDogJ1xyXG4gICAgICAgICAgICArIEpTT04uc3RyaW5naWZ5KGVycm9yKSk7XHJcbiAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdHZXRBbGxEYXRhRnJvbVJhdGVBbmFseXNpcyBzdWNjZXNzJyk7XHJcbiAgICAgICAgICBsZXQgYnVpZGluZ0Nvc3RIZWFkcyA9IHJlc3VsdC5idWlsZGluZ0Nvc3RIZWFkcztcclxuICAgICAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG5cclxuICAgICAgICAgIGxldCBjb25maWdDb3N0SGVhZHMgPSBjb25maWcuZ2V0KCdjb25maWdDb3N0SGVhZHMnKTtcclxuICAgICAgICAgIHRoaXMuY29udmVydENvbmZpZ0Nvc3RIZWFkcyhjb25maWdDb3N0SGVhZHMgLCBidWlkaW5nQ29zdEhlYWRzKTtcclxuICAgICAgICAgIGxldCBkYXRhID0gcHJvamVjdFNlcnZpY2UuY2FsY3VsYXRlQnVkZ2V0Q29zdEZvckJ1aWxkaW5nKGJ1aWRpbmdDb3N0SGVhZHMsIHByb2plY3REYXRhLCBidWlsZGluZ0RhdGEpO1xyXG5cclxuICAgICAgICAgIGxldCByYXRlcyAgPSAgdGhpcy5nZXRSYXRlcyhyZXN1bHQsIGRhdGEpO1xyXG4gICAgICAgICAgbGV0IHF1ZXJ5Rm9yQnVpbGRpbmcgPSB7J19pZCc6IGJ1aWxkaW5nSWR9O1xyXG4gICAgICAgICAgbGV0IHVwZGF0ZUNvc3RIZWFkID0geyRzZXQ6IHsnY29zdEhlYWRzJzogZGF0YSwgJ3JhdGVzJzogcmF0ZXMgfX07XHJcbiAgICAgICAgICBidWlsZGluZ1JlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeUZvckJ1aWxkaW5nLCB1cGRhdGVDb3N0SGVhZCwge25ldzogdHJ1ZX0sIChlcnJvcjogYW55LCByZXNwb25zZTogYW55KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgIGxvZ2dlci5lcnJvcignRXJyb3IgaW4gVXBkYXRlIGNvbnZlcnRDb3N0SGVhZHNGcm9tUmF0ZUFuYWx5c2lzVG9Db3N0Q29udHJvbCBidWlsZGluZ0Nvc3RIZWFkc0RhdGEgIDogJ1xyXG4gICAgICAgICAgICAgICAgKyBKU09OLnN0cmluZ2lmeShlcnJvcikpO1xyXG4gICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBsb2dnZXIuaW5mbygnVXBkYXRlQnVpbGRpbmdDb3N0SGVhZCBzdWNjZXNzJyk7XHJcbiAgICAgICAgICAgICAgbGV0IHByb2plY3RDb3N0SGVhZHMgPSBwcm9qZWN0U2VydmljZS5jYWxjdWxhdGVCdWRnZXRDb3N0Rm9yQ29tbW9uQW1tZW5pdGllcyhcclxuICAgICAgICAgICAgICAgIHByb2plY3REYXRhLnByb2plY3RDb3N0SGVhZHMscHJvamVjdERhdGEsIGJ1aWxkaW5nRGF0YSk7XHJcbiAgICAgICAgICAgICAgbGV0IHF1ZXJ5Rm9yUHJvamVjdCA9IHsnX2lkJzogcHJvamVjdElkfTtcclxuICAgICAgICAgICAgICBsZXQgdXBkYXRlUHJvamVjdENvc3RIZWFkID0geyRzZXQ6IHsncHJvamVjdENvc3RIZWFkcyc6IHByb2plY3RDb3N0SGVhZHN9fTtcclxuICAgICAgICAgICAgICBsb2dnZXIuaW5mbygnQ2FsbGluZyB1cGRhdGUgcHJvamVjdCBDb3N0aGVhZHMgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgICAgICAgICAgcHJvamVjdFJlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeUZvclByb2plY3QsIHVwZGF0ZVByb2plY3RDb3N0SGVhZCwge25ldzogdHJ1ZX0sXHJcbiAgICAgICAgICAgICAgICAoZXJyb3I6IGFueSwgcmVzcG9uc2U6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZXJyKCdFcnJvciB1cGRhdGUgcHJvamVjdCBDb3N0aGVhZHMgOiAnICsgSlNPTi5zdHJpbmdpZnkoZXJyb3IpKTtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmRlYnVnKCdVcGRhdGUgcHJvamVjdCBDb3N0aGVhZHMgc3VjY2VzcycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVCdWRnZXRSYXRlc0ZvckJ1aWxkaW5nQ29zdEhlYWRzKGVudGl0eTogc3RyaW5nLCBidWlsZGluZ0lkOnN0cmluZywgcHJvamVjdERldGFpbHMgOiBQcm9qZWN0LCBidWlsZGluZ0RldGFpbHMgOiBCdWlsZGluZykge1xyXG4gICAgcmV0dXJuIG5ldyBDQ1Byb21pc2UoZnVuY3Rpb24ocmVzb2x2ZTphbnksIHJlamVjdDphbnkpIHtcclxuICAgICAgbGV0IHJhdGVBbmFseXNpc1NlcnZpY2UgPSBuZXcgUmF0ZUFuYWx5c2lzU2VydmljZSgpO1xyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgbGV0IGJ1aWxkaW5nUmVwb3NpdG9yeSA9IG5ldyBCdWlsZGluZ1JlcG9zaXRvcnkoKTtcclxuICAgICAgbG9nZ2VyLmluZm8oJ0luc2lkZSB1cGRhdGVCdWRnZXRSYXRlc0ZvckJ1aWxkaW5nQ29zdEhlYWRzIHByb21pc2UuJyk7XHJcbiAgICAgIHJhdGVBbmFseXNpc1NlcnZpY2UuY29udmVydENvc3RIZWFkc0Zyb21SYXRlQW5hbHlzaXNUb0Nvc3RDb250cm9sKGVudGl0eSwgKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICBsb2dnZXIuZXJyKCdFcnJvciBpbiBwcm9taXNlIHVwZGF0ZUJ1ZGdldFJhdGVzRm9yQnVpbGRpbmdDb3N0SGVhZHMgOiAnICsgSlNPTi5zdHJpbmdpZnkoZXJyb3IpKTtcclxuICAgICAgICAgIHJlamVjdChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdJbnNpZGUgdXBkYXRlQnVkZ2V0UmF0ZXNGb3JCdWlsZGluZ0Nvc3RIZWFkcyBzdWNjZXNzJyk7XHJcbiAgICAgICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgICAgIGxldCBidWlkaW5nQ29zdEhlYWRzID0gcmVzdWx0LmJ1aWxkaW5nQ29zdEhlYWRzO1xyXG4gICAgICAgICAgbGV0IGNvbmZpZ0Nvc3RIZWFkcyA9IGNvbmZpZy5nZXQoJ2NvbmZpZ0Nvc3RIZWFkcycpO1xyXG4gICAgICAgICAgcHJvamVjdFNlcnZpY2UuY29udmVydENvbmZpZ0Nvc3RIZWFkcyhjb25maWdDb3N0SGVhZHMgLCBidWlkaW5nQ29zdEhlYWRzKTtcclxuXHJcbiAgICAgICAgICBsZXQgYnVpbGRpbmdDb3N0SGVhZHMgPSBwcm9qZWN0U2VydmljZS5jYWxjdWxhdGVCdWRnZXRDb3N0Rm9yQnVpbGRpbmcoYnVpZGluZ0Nvc3RIZWFkcywgcHJvamVjdERldGFpbHMsIGJ1aWxkaW5nRGV0YWlscyk7XHJcbiAgICAgICAgICBsZXQgcmF0ZXMgID0gcHJvamVjdFNlcnZpY2UuZ2V0UmF0ZXMocmVzdWx0LCBidWlsZGluZ0Nvc3RIZWFkcyk7XHJcblxyXG4gICAgICAgICAgbGV0IHF1ZXJ5ID0geydfaWQnOiBidWlsZGluZ0lkfTtcclxuICAgICAgICAgIGxldCBuZXdEYXRhID0geyRzZXQ6IHsnY29zdEhlYWRzJzogYnVpbGRpbmdDb3N0SGVhZHMsICdyYXRlcyc6IHJhdGVzfX07XHJcbiAgICAgICAgICBidWlsZGluZ1JlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgbmV3RGF0YSwge25ldzogdHJ1ZX0sIChlcnJvcjphbnksIHJlc3BvbnNlOmFueSkgPT4ge1xyXG4gICAgICAgICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBnZXRBbGxEYXRhRnJvbVJhdGVBbmFseXNpcyBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKCdFcnJvciBpbiBVcGRhdGUgYnVpbGRpbmdDb3N0SGVhZHNEYXRhICA6ICcrSlNPTi5zdHJpbmdpZnkoZXJyb3IpKTtcclxuICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnVXBkYXRlZCBidWlsZGluZ0Nvc3RIZWFkc0RhdGEnKTtcclxuICAgICAgICAgICAgICByZXNvbHZlKCdEb25lJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9KS5jYXRjaChmdW5jdGlvbihlOmFueSl7XHJcbiAgICAgIGxvZ2dlci5lcnJvcignRXJyb3IgaW4gdXBkYXRlQnVkZ2V0UmF0ZXNGb3JCdWlsZGluZ0Nvc3RIZWFkcyA6JytKU09OLnN0cmluZ2lmeShlLm1lc3NhZ2UpKTtcclxuICAgICAgQ0NQcm9taXNlLnJlamVjdChlLm1lc3NhZ2UpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRSYXRlcyhyZXN1bHQ6IGFueSwgY29zdEhlYWRzOiBBcnJheTxDb3N0SGVhZD4pIHtcclxuICAgIGxldCBnZXRSYXRlc0xpc3RTUUwgPSAnU0VMRUNUICogRlJPTSA/IEFTIHEgV0hFUkUgcS5DNCBJTiAoU0VMRUNUIHQucmF0ZUFuYWx5c2lzSWQgJyArXHJcbiAgICAgICdGUk9NID8gQVMgdCknO1xyXG4gICAgbGV0IHJhdGVJdGVtcyA9IGFsYXNxbChnZXRSYXRlc0xpc3RTUUwsIFtyZXN1bHQucmF0ZXMsIGNvc3RIZWFkc10pO1xyXG5cclxuICAgIGxldCByYXRlSXRlbXNSYXRlQW5hbHlzaXNTUUwgPSAnU0VMRUNUIHJhdGVJdGVtLkMyIEFTIGl0ZW1OYW1lLCByYXRlSXRlbS5DMiBBUyBvcmlnaW5hbEl0ZW1OYW1lLCcgK1xyXG4gICAgICAncmF0ZUl0ZW0uQzEyIEFTIHJhdGVBbmFseXNpc0lkLCByYXRlSXRlbS5DNiBBUyB0eXBlLCcgK1xyXG4gICAgICAnUk9VTkQocmF0ZUl0ZW0uQzcsMikgQVMgcXVhbnRpdHksIFJPVU5EKHJhdGVJdGVtLkMzLDIpIEFTIHJhdGUsIHVuaXQuQzIgQVMgdW5pdCwnICtcclxuICAgICAgJ1JPVU5EKHJhdGVJdGVtLkMzICogcmF0ZUl0ZW0uQzcsMikgQVMgdG90YWxBbW91bnQsIHJhdGVJdGVtLkM1IEFTIHRvdGFsUXVhbnRpdHkgJyArXHJcbiAgICAgICdGUk9NID8gQVMgcmF0ZUl0ZW0gSk9JTiA/IEFTIHVuaXQgT04gdW5pdC5DMSA9IHJhdGVJdGVtLkM5JztcclxuXHJcbiAgICBsZXQgcmF0ZUl0ZW1zTGlzdCA9IGFsYXNxbChyYXRlSXRlbXNSYXRlQW5hbHlzaXNTUUwsIFtyYXRlSXRlbXMsIHJlc3VsdC51bml0c10pO1xyXG5cclxuICAgIGxldCBkaXN0aW5jdEl0ZW1zU1FMID0gJ3NlbGVjdCBESVNUSU5DVCBpdGVtTmFtZSxvcmlnaW5hbEl0ZW1OYW1lLHJhdGUgRlJPTSA/JztcclxuICAgIHZhciBkaXN0aW5jdFJhdGVzID0gYWxhc3FsIChkaXN0aW5jdEl0ZW1zU1FMLCBbcmF0ZUl0ZW1zTGlzdF0pO1xyXG5cclxuICAgIHJldHVybiBkaXN0aW5jdFJhdGVzO1xyXG4gIH1cclxuXHJcbiAgY29udmVydENvbmZpZ0Nvc3RIZWFkcyhjb25maWdDb3N0SGVhZHMgOiBBcnJheTxhbnk+LCBjb3N0SGVhZHNEYXRhOkFycmF5PENvc3RIZWFkPikge1xyXG5cclxuICAgIGZvcihsZXQgY29uZmlnQ29zdEhlYWQgb2YgY29uZmlnQ29zdEhlYWRzKSB7XHJcblxyXG4gICAgICBsZXQgY29zdEhlYWQgOiBDb3N0SGVhZCA9IG5ldyBDb3N0SGVhZCgpO1xyXG4gICAgICBjb3N0SGVhZC5uYW1lID0gY29uZmlnQ29zdEhlYWQubmFtZTtcclxuICAgICAgY29zdEhlYWQucmF0ZUFuYWx5c2lzSWQgPSBjb25maWdDb3N0SGVhZC5yYXRlQW5hbHlzaXNJZDtcclxuICAgICAgbGV0IGNhdGVnb3JpZXNMaXN0ID0gbmV3IEFycmF5PENhdGVnb3J5PigpO1xyXG5cclxuICAgICAgZm9yIChsZXQgY29uZmlnQ2F0ZWdvcnkgb2YgY29uZmlnQ29zdEhlYWQuY2F0ZWdvcmllcykge1xyXG5cclxuICAgICAgICBsZXQgY2F0ZWdvcnkgOiBDYXRlZ29yeSA9IG5ldyBDYXRlZ29yeShjb25maWdDYXRlZ29yeS5uYW1lICwgY29uZmlnQ2F0ZWdvcnkucmF0ZUFuYWx5c2lzSWQpO1xyXG4gICAgICAgIGxldCB3b3JrSXRlbXNMaXN0IDogQXJyYXk8V29ya0l0ZW0+ID0gbmV3IEFycmF5PFdvcmtJdGVtPigpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBjb25maWdXb3JrSXRlbSBvZiBjb25maWdDYXRlZ29yeS53b3JrSXRlbXMpIHtcclxuXHJcbiAgICAgICAgICBsZXQgd29ya0l0ZW0gOiBXb3JrSXRlbSA9IG5ldyBXb3JrSXRlbShjb25maWdXb3JrSXRlbS5uYW1lLCBjb25maWdXb3JrSXRlbS5yYXRlQW5hbHlzaXNJZCk7XHJcbiAgICAgICAgICB3b3JrSXRlbS5pc0RpcmVjdFJhdGUgPSB0cnVlO1xyXG4gICAgICAgICAgd29ya0l0ZW0udW5pdCA9IGNvbmZpZ1dvcmtJdGVtLm1lYXN1cmVtZW50VW5pdDtcclxuXHJcbiAgICAgICAgICBpZihjb25maWdXb3JrSXRlbS5kaXJlY3RSYXRlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHdvcmtJdGVtLnJhdGUudG90YWwgPSBjb25maWdXb3JrSXRlbS5kaXJlY3RSYXRlO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgd29ya0l0ZW0ucmF0ZS50b3RhbCA9IDA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB3b3JrSXRlbS5yYXRlLmlzRXN0aW1hdGVkID0gdHJ1ZTtcclxuICAgICAgICAgIHdvcmtJdGVtc0xpc3QucHVzaCh3b3JrSXRlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGVnb3J5LndvcmtJdGVtcyA9IHdvcmtJdGVtc0xpc3Q7XHJcbiAgICAgICAgY2F0ZWdvcmllc0xpc3QucHVzaChjYXRlZ29yeSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvc3RIZWFkLmNhdGVnb3JpZXMgPSBjYXRlZ29yaWVzTGlzdDtcclxuICAgICAgY29zdEhlYWQudGh1bWJSdWxlUmF0ZSA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLlRIVU1CUlVMRV9SQVRFKTtcclxuICAgICAgY29zdEhlYWRzRGF0YS5wdXNoKGNvc3RIZWFkKTtcclxuICAgIH1cclxuICAgIHJldHVybiBjb3N0SGVhZHNEYXRhO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlQnVkZ2V0UmF0ZXNGb3JQcm9qZWN0Q29zdEhlYWRzKGVudGl0eTogc3RyaW5nLCBwcm9qZWN0SWQ6c3RyaW5nLCBwcm9qZWN0RGV0YWlscyA6IFByb2plY3QsIGJ1aWxkaW5nRGV0YWlscyA6IEJ1aWxkaW5nKSB7XHJcbiAgICByZXR1cm4gbmV3IENDUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlOmFueSwgcmVqZWN0OmFueSl7XHJcbiAgICAgIGxldCByYXRlQW5hbHlzaXNTZXJ2aWNlID0gbmV3IFJhdGVBbmFseXNpc1NlcnZpY2UoKTtcclxuICAgICAgbGV0IHByb2plY3RSZXBvc2l0b3J5ID0gbmV3IFByb2plY3RSZXBvc2l0b3J5KCk7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdJbnNpZGUgdXBkYXRlQnVkZ2V0UmF0ZXNGb3JQcm9qZWN0Q29zdEhlYWRzIHByb21pc2UuJyk7XHJcbiAgICAgIHJhdGVBbmFseXNpc1NlcnZpY2UuY29udmVydENvc3RIZWFkc0Zyb21SYXRlQW5hbHlzaXNUb0Nvc3RDb250cm9sKGVudGl0eSwgKGVycm9yIDogYW55LCByZXN1bHQ6IGFueSkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBsb2dnZXIuZXJyKCdFcnJvciBpbiB1cGRhdGVCdWRnZXRSYXRlc0ZvclByb2plY3RDb3N0SGVhZHMgcHJvbWlzZSA6ICcgKyBKU09OLnN0cmluZ2lmeShlcnJvcikpO1xyXG4gICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgbGV0IHByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcbiAgICAgICAgICAgIGxldCBjb3N0SGVhZHNGcm9tUmF0ZUFuYWx5c2lzID0gcmVzdWx0LmJ1aWxkaW5nQ29zdEhlYWRzO1xyXG4gICAgICAgICAgICBsZXQgY29uZmlnUHJvamVjdENvc3RIZWFkcyA9IGNvbmZpZy5nZXQoJ2NvbmZpZ1Byb2plY3RDb3N0SGVhZHMnKTtcclxuICAgICAgICAgICAgcHJvamVjdFNlcnZpY2UuY29udmVydENvbmZpZ0Nvc3RIZWFkcyhjb25maWdQcm9qZWN0Q29zdEhlYWRzICwgY29zdEhlYWRzRnJvbVJhdGVBbmFseXNpcyk7XHJcblxyXG4gICAgICAgICAgICBsZXQgcHJvamVjdENvc3RIZWFkcyA9IHByb2plY3RTZXJ2aWNlLmNhbGN1bGF0ZUJ1ZGdldENvc3RGb3JDb21tb25BbW1lbml0aWVzKFxyXG4gICAgICAgICAgICAgIGNvc3RIZWFkc0Zyb21SYXRlQW5hbHlzaXMsIHByb2plY3REZXRhaWxzLCBidWlsZGluZ0RldGFpbHMpO1xyXG4gICAgICAgICAgICBsZXQgcmF0ZXMgID0gcHJvamVjdFNlcnZpY2UuZ2V0UmF0ZXMocmVzdWx0LCBwcm9qZWN0Q29zdEhlYWRzKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBxdWVyeSA9IHsnX2lkJzogcHJvamVjdElkfTtcclxuICAgICAgICAgICAgbGV0IG5ld0RhdGEgPSB7JHNldDogeydwcm9qZWN0Q29zdEhlYWRzJzogcHJvamVjdENvc3RIZWFkcywgJ3JhdGVzJzogcmF0ZXN9fTtcclxuXHJcbiAgICAgICAgICAgIHByb2plY3RSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIG5ld0RhdGEsIHtuZXc6IHRydWV9LCAoZXJyb3I6IGFueSwgcmVzcG9uc2U6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGdldEFsbERhdGFGcm9tUmF0ZUFuYWx5c2lzIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKCdFcnJvciBpbiBVcGRhdGUgYnVpbGRpbmdDb3N0SGVhZHNEYXRhICA6ICcrSlNPTi5zdHJpbmdpZnkoZXJyb3IpKTtcclxuICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnVXBkYXRlZCBwcm9qZWN0Q29zdEhlYWRzJyk7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKCdEb25lJyk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9KS5jYXRjaChmdW5jdGlvbihlOmFueSl7XHJcbiAgICAgIGxvZ2dlci5lcnJvcignRXJyb3IgaW4gdXBkYXRlQnVkZ2V0UmF0ZXNGb3JQcm9qZWN0Q29zdEhlYWRzIDonK0pTT04uc3RyaW5naWZ5KGUubWVzc2FnZSkpO1xyXG4gICAgICBDQ1Byb21pc2UucmVqZWN0KGUubWVzc2FnZSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGNhbGN1bGF0ZUJ1ZGdldENvc3RGb3JCdWlsZGluZyhjb3N0SGVhZHNSYXRlQW5hbHlzaXM6IGFueSwgcHJvamVjdERldGFpbHMgOiBQcm9qZWN0LCBidWlsZGluZ0RldGFpbHMgOiBhbnkpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGNhbGN1bGF0ZUJ1ZGdldENvc3RGb3JCdWlsZGluZyBoYXMgYmVlbiBoaXQnKTtcclxuICAgIGxldCBjb3N0SGVhZHM6QXJyYXk8Q29zdEhlYWQ+ID0gbmV3IEFycmF5PENvc3RIZWFkPigpO1xyXG4gICAgbGV0IGJ1ZGdldGVkQ29zdEFtb3VudDogbnVtYmVyO1xyXG4gICAgbGV0IGNhbGN1bGF0ZUJ1ZGd0ZWRDb3N0IDogc3RyaW5nO1xyXG5cclxuICAgIGZvcihsZXQgY29zdEhlYWQgb2YgY29zdEhlYWRzUmF0ZUFuYWx5c2lzKSB7XHJcblxyXG4gICAgICBsZXQgYnVkZ2V0Q29zdEZvcm11bGFlOnN0cmluZztcclxuXHJcbiAgICAgIHN3aXRjaChjb3N0SGVhZC5uYW1lKSB7XHJcblxyXG4gICAgICAgICAgY2FzZSBDb25zdGFudHMuUkNDX0JBTkRfT1JfUEFUTEkgOiB7XHJcbiAgICAgICAgICAgIGJ1ZGdldENvc3RGb3JtdWxhZSA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLkJVREdFVEVEX0NPU1RfRk9STVVMQUUgKyBjb3N0SGVhZC5uYW1lKS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICBjYWxjdWxhdGVCdWRndGVkQ29zdCA9IGJ1ZGdldENvc3RGb3JtdWxhZS5yZXBsYWNlKENvbnN0YW50cy5TTEFCX0FSRUEsIGJ1aWxkaW5nRGV0YWlscy50b3RhbFNsYWJBcmVhKTtcclxuICAgICAgICAgICAgYnVkZ2V0ZWRDb3N0QW1vdW50ID0gZXZhbChjYWxjdWxhdGVCdWRndGVkQ29zdCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlVGh1bWJSdWxlUmVwb3J0Rm9yQ29zdEhlYWQoYnVkZ2V0ZWRDb3N0QW1vdW50LCBjb3N0SGVhZCwgYnVpbGRpbmdEZXRhaWxzLCBjb3N0SGVhZHMpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNhc2UgQ29uc3RhbnRzLkVYVEVSTkFMX1BMQVNURVIgOiB7XHJcbiAgICAgICAgICAgIGJ1ZGdldENvc3RGb3JtdWxhZSA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLkJVREdFVEVEX0NPU1RfRk9STVVMQUUgKyBjb3N0SGVhZC5uYW1lKS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICBjYWxjdWxhdGVCdWRndGVkQ29zdCA9IGJ1ZGdldENvc3RGb3JtdWxhZS5yZXBsYWNlKENvbnN0YW50cy5DQVJQRVRfQVJFQSwgYnVpbGRpbmdEZXRhaWxzLnRvdGFsQ2FycGV0QXJlYU9mVW5pdCk7XHJcbiAgICAgICAgICAgIGJ1ZGdldGVkQ29zdEFtb3VudCA9IGV2YWwoY2FsY3VsYXRlQnVkZ3RlZENvc3QpO1xyXG4gICAgICAgICAgICB0aGlzLmNhbGN1bGF0ZVRodW1iUnVsZVJlcG9ydEZvckNvc3RIZWFkKGJ1ZGdldGVkQ29zdEFtb3VudCwgY29zdEhlYWQsIGJ1aWxkaW5nRGV0YWlscywgY29zdEhlYWRzKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBjYXNlIENvbnN0YW50cy5GQUJSSUNBVElPTiA6IHtcclxuICAgICAgICAgICAgYnVkZ2V0Q29zdEZvcm11bGFlID0gY29uZmlnLmdldChDb25zdGFudHMuQlVER0VURURfQ09TVF9GT1JNVUxBRSArIGNvc3RIZWFkLm5hbWUpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIGNhbGN1bGF0ZUJ1ZGd0ZWRDb3N0ID0gYnVkZ2V0Q29zdEZvcm11bGFlLnJlcGxhY2UoQ29uc3RhbnRzLkNBUlBFVF9BUkVBLCBidWlsZGluZ0RldGFpbHMudG90YWxDYXJwZXRBcmVhT2ZVbml0KTtcclxuICAgICAgICAgICAgYnVkZ2V0ZWRDb3N0QW1vdW50ID0gZXZhbChjYWxjdWxhdGVCdWRndGVkQ29zdCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlVGh1bWJSdWxlUmVwb3J0Rm9yQ29zdEhlYWQoYnVkZ2V0ZWRDb3N0QW1vdW50LCBjb3N0SGVhZCwgYnVpbGRpbmdEZXRhaWxzLCBjb3N0SGVhZHMpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNhc2UgQ29uc3RhbnRzLlBBSU5USU5HIDoge1xyXG4gICAgICAgICAgICBidWRnZXRDb3N0Rm9ybXVsYWUgPSBjb25maWcuZ2V0KENvbnN0YW50cy5CVURHRVRFRF9DT1NUX0ZPUk1VTEFFICsgY29zdEhlYWQubmFtZSkudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgY2FsY3VsYXRlQnVkZ3RlZENvc3QgPSBidWRnZXRDb3N0Rm9ybXVsYWUucmVwbGFjZShDb25zdGFudHMuQ0FSUEVUX0FSRUEsIGJ1aWxkaW5nRGV0YWlscy50b3RhbENhcnBldEFyZWFPZlVuaXQpO1xyXG4gICAgICAgICAgICBidWRnZXRlZENvc3RBbW91bnQgPSBldmFsKGNhbGN1bGF0ZUJ1ZGd0ZWRDb3N0KTtcclxuICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVUaHVtYlJ1bGVSZXBvcnRGb3JDb3N0SGVhZChidWRnZXRlZENvc3RBbW91bnQsIGNvc3RIZWFkLCBidWlsZGluZ0RldGFpbHMsIGNvc3RIZWFkcyk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY2FzZSBDb25zdGFudHMuS0lUQ0hFTl9PVFRBIDoge1xyXG4gICAgICAgICAgICBidWRnZXRDb3N0Rm9ybXVsYWUgPSBjb25maWcuZ2V0KENvbnN0YW50cy5CVURHRVRFRF9DT1NUX0ZPUk1VTEFFICsgY29zdEhlYWQubmFtZSkudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgY2FsY3VsYXRlQnVkZ3RlZENvc3QgPSBidWRnZXRDb3N0Rm9ybXVsYWUucmVwbGFjZShDb25zdGFudHMuTlVNX09GX09ORV9CSEssIGJ1aWxkaW5nRGV0YWlscy5udW1PZk9uZUJISylcclxuICAgICAgICAgICAgICAucmVwbGFjZShDb25zdGFudHMuTlVNX09GX1RXT19CSEssIGJ1aWxkaW5nRGV0YWlscy5udW1PZlR3b0JISylcclxuICAgICAgICAgICAgICAucmVwbGFjZShDb25zdGFudHMuTlVNX09GX1RIUkVFX0JISywgYnVpbGRpbmdEZXRhaWxzLm51bU9mVGhyZWVCSEspXHJcbiAgICAgICAgICAgICAgLnJlcGxhY2UoQ29uc3RhbnRzLk5VTV9PRl9GT1VSX0JISywgYnVpbGRpbmdEZXRhaWxzLm51bU9mRm91ckJISylcclxuICAgICAgICAgICAgICAucmVwbGFjZShDb25zdGFudHMuTlVNX09GX0ZJVkVfQkhLLCBidWlsZGluZ0RldGFpbHMubnVtT2ZGaXZlQkhLKTtcclxuICAgICAgICAgICAgYnVkZ2V0ZWRDb3N0QW1vdW50ID0gZXZhbChjYWxjdWxhdGVCdWRndGVkQ29zdCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNhbGN1bGF0ZVRodW1iUnVsZVJlcG9ydEZvckNvc3RIZWFkKGJ1ZGdldGVkQ29zdEFtb3VudCwgY29zdEhlYWQsIGJ1aWxkaW5nRGV0YWlscywgY29zdEhlYWRzKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBjYXNlIENvbnN0YW50cy5TT0xJTkcgOiB7XHJcbiAgICAgICAgICAgIGJ1ZGdldENvc3RGb3JtdWxhZSA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLkJVREdFVEVEX0NPU1RfRk9STVVMQUUgKyBjb3N0SGVhZC5uYW1lKS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICBjYWxjdWxhdGVCdWRndGVkQ29zdCA9IGJ1ZGdldENvc3RGb3JtdWxhZS5yZXBsYWNlKENvbnN0YW50cy5QTElOVEhfQVJFQSwgYnVpbGRpbmdEZXRhaWxzLnBsaW50aEFyZWEpO1xyXG4gICAgICAgICAgICBidWRnZXRlZENvc3RBbW91bnQgPSBldmFsKGNhbGN1bGF0ZUJ1ZGd0ZWRDb3N0KTtcclxuICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVUaHVtYlJ1bGVSZXBvcnRGb3JDb3N0SGVhZChidWRnZXRlZENvc3RBbW91bnQsIGNvc3RIZWFkLCBidWlsZGluZ0RldGFpbHMsIGNvc3RIZWFkcyk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY2FzZSBDb25zdGFudHMuTUFTT05SWSA6IHtcclxuICAgICAgICAgICAgYnVkZ2V0Q29zdEZvcm11bGFlID0gY29uZmlnLmdldChDb25zdGFudHMuQlVER0VURURfQ09TVF9GT1JNVUxBRSArIGNvc3RIZWFkLm5hbWUpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIGNhbGN1bGF0ZUJ1ZGd0ZWRDb3N0ID0gYnVkZ2V0Q29zdEZvcm11bGFlLnJlcGxhY2UoQ29uc3RhbnRzLkNBUlBFVF9BUkVBLCBidWlsZGluZ0RldGFpbHMudG90YWxDYXJwZXRBcmVhT2ZVbml0KTtcclxuICAgICAgICAgICAgYnVkZ2V0ZWRDb3N0QW1vdW50ID0gZXZhbChjYWxjdWxhdGVCdWRndGVkQ29zdCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlVGh1bWJSdWxlUmVwb3J0Rm9yQ29zdEhlYWQoYnVkZ2V0ZWRDb3N0QW1vdW50LCBjb3N0SGVhZCwgYnVpbGRpbmdEZXRhaWxzLCBjb3N0SGVhZHMpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNhc2UgQ29uc3RhbnRzLklOVEVSTkFMX1BMQVNURVIgOiB7XHJcbiAgICAgICAgICAgIGJ1ZGdldENvc3RGb3JtdWxhZSA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLkJVREdFVEVEX0NPU1RfRk9STVVMQUUgKyBjb3N0SGVhZC5uYW1lKS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICBjYWxjdWxhdGVCdWRndGVkQ29zdCA9IGJ1ZGdldENvc3RGb3JtdWxhZS5yZXBsYWNlKENvbnN0YW50cy5DQVJQRVRfQVJFQSwgYnVpbGRpbmdEZXRhaWxzLnRvdGFsQ2FycGV0QXJlYU9mVW5pdCk7XHJcbiAgICAgICAgICAgIGJ1ZGdldGVkQ29zdEFtb3VudCA9IGV2YWwoY2FsY3VsYXRlQnVkZ3RlZENvc3QpO1xyXG4gICAgICAgICAgICB0aGlzLmNhbGN1bGF0ZVRodW1iUnVsZVJlcG9ydEZvckNvc3RIZWFkKGJ1ZGdldGVkQ29zdEFtb3VudCwgY29zdEhlYWQsIGJ1aWxkaW5nRGV0YWlscywgY29zdEhlYWRzKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBjYXNlIENvbnN0YW50cy5HWVBTVU1fT1JfUE9QX1BMQVNURVIgOiB7XHJcbiAgICAgICAgICAgIGJ1ZGdldENvc3RGb3JtdWxhZSA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLkJVREdFVEVEX0NPU1RfRk9STVVMQUUgKyBjb3N0SGVhZC5uYW1lKS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICBjYWxjdWxhdGVCdWRndGVkQ29zdCA9IGJ1ZGdldENvc3RGb3JtdWxhZS5yZXBsYWNlKENvbnN0YW50cy5DQVJQRVRfQVJFQSwgYnVpbGRpbmdEZXRhaWxzLnRvdGFsQ2FycGV0QXJlYU9mVW5pdCk7XHJcbiAgICAgICAgICAgIGJ1ZGdldGVkQ29zdEFtb3VudCA9IGV2YWwoY2FsY3VsYXRlQnVkZ3RlZENvc3QpO1xyXG4gICAgICAgICAgICB0aGlzLmNhbGN1bGF0ZVRodW1iUnVsZVJlcG9ydEZvckNvc3RIZWFkKGJ1ZGdldGVkQ29zdEFtb3VudCwgY29zdEhlYWQsIGJ1aWxkaW5nRGV0YWlscywgY29zdEhlYWRzKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBjYXNlIENvbnN0YW50cy5XQVRFUl9QUk9PRklORyA6IHtcclxuICAgICAgICAgICAgYnVkZ2V0Q29zdEZvcm11bGFlID0gY29uZmlnLmdldChDb25zdGFudHMuQlVER0VURURfQ09TVF9GT1JNVUxBRSArIGNvc3RIZWFkLm5hbWUpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIGNhbGN1bGF0ZUJ1ZGd0ZWRDb3N0ID0gYnVkZ2V0Q29zdEZvcm11bGFlLnJlcGxhY2UoQ29uc3RhbnRzLkNBUlBFVF9BUkVBLCBidWlsZGluZ0RldGFpbHMudG90YWxDYXJwZXRBcmVhT2ZVbml0KTtcclxuICAgICAgICAgICAgYnVkZ2V0ZWRDb3N0QW1vdW50ID0gZXZhbChjYWxjdWxhdGVCdWRndGVkQ29zdCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlVGh1bWJSdWxlUmVwb3J0Rm9yQ29zdEhlYWQoYnVkZ2V0ZWRDb3N0QW1vdW50LCBjb3N0SGVhZCwgYnVpbGRpbmdEZXRhaWxzLCBjb3N0SGVhZHMpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNhc2UgQ29uc3RhbnRzLkRFV0FURVJJTkcgOiB7XHJcbiAgICAgICAgICAgIGJ1ZGdldENvc3RGb3JtdWxhZSA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLkJVREdFVEVEX0NPU1RfRk9STVVMQUUgKyBjb3N0SGVhZC5uYW1lKS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICBjYWxjdWxhdGVCdWRndGVkQ29zdCA9IGJ1ZGdldENvc3RGb3JtdWxhZS5yZXBsYWNlKENvbnN0YW50cy5TQUxFQUJMRV9BUkVBLCBidWlsZGluZ0RldGFpbHMudG90YWxTYWxlYWJsZUFyZWFPZlVuaXQpO1xyXG4gICAgICAgICAgICBidWRnZXRlZENvc3RBbW91bnQgPSBldmFsKGNhbGN1bGF0ZUJ1ZGd0ZWRDb3N0KTtcclxuICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVUaHVtYlJ1bGVSZXBvcnRGb3JDb3N0SGVhZChidWRnZXRlZENvc3RBbW91bnQsIGNvc3RIZWFkLCBidWlsZGluZ0RldGFpbHMsIGNvc3RIZWFkcyk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY2FzZSBDb25zdGFudHMuR0FSQkFHRV9DSFVURSA6IHtcclxuICAgICAgICAgICAgYnVkZ2V0Q29zdEZvcm11bGFlID0gY29uZmlnLmdldChDb25zdGFudHMuQlVER0VURURfQ09TVF9GT1JNVUxBRSArIGNvc3RIZWFkLm5hbWUpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIGNhbGN1bGF0ZUJ1ZGd0ZWRDb3N0ID0gYnVkZ2V0Q29zdEZvcm11bGFlLnJlcGxhY2UoQ29uc3RhbnRzLk5VTV9PRl9GTE9PUlMsIGJ1aWxkaW5nRGV0YWlscy50b3RhbE51bU9mRmxvb3JzKVxyXG4gICAgICAgICAgICAgIC5yZXBsYWNlKENvbnN0YW50cy5OVU1fT0ZfUEFSS0lOR19GTE9PUlMsIGJ1aWxkaW5nRGV0YWlscy5udW1PZlBhcmtpbmdGbG9vcnMpO1xyXG4gICAgICAgICAgICBidWRnZXRlZENvc3RBbW91bnQgPSBldmFsKGNhbGN1bGF0ZUJ1ZGd0ZWRDb3N0KTtcclxuICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVUaHVtYlJ1bGVSZXBvcnRGb3JDb3N0SGVhZChidWRnZXRlZENvc3RBbW91bnQsIGNvc3RIZWFkLCBidWlsZGluZ0RldGFpbHMsIGNvc3RIZWFkcyk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY2FzZSBDb25zdGFudHMuTElGVCA6IHtcclxuICAgICAgICAgICAgYnVkZ2V0Q29zdEZvcm11bGFlID0gY29uZmlnLmdldChDb25zdGFudHMuQlVER0VURURfQ09TVF9GT1JNVUxBRSArIGNvc3RIZWFkLm5hbWUpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIGNhbGN1bGF0ZUJ1ZGd0ZWRDb3N0ID0gYnVkZ2V0Q29zdEZvcm11bGFlLnJlcGxhY2UoQ29uc3RhbnRzLk5VTV9PRl9GTE9PUlMsIGJ1aWxkaW5nRGV0YWlscy50b3RhbE51bU9mRmxvb3JzKVxyXG4gICAgICAgICAgICAgIC5yZXBsYWNlKENvbnN0YW50cy5OVU1fT0ZfTElGVFMsIGJ1aWxkaW5nRGV0YWlscy5udW1PZkxpZnRzKTtcclxuICAgICAgICAgICAgYnVkZ2V0ZWRDb3N0QW1vdW50ID0gZXZhbChjYWxjdWxhdGVCdWRndGVkQ29zdCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlVGh1bWJSdWxlUmVwb3J0Rm9yQ29zdEhlYWQoYnVkZ2V0ZWRDb3N0QW1vdW50LCBjb3N0SGVhZCwgYnVpbGRpbmdEZXRhaWxzLCBjb3N0SGVhZHMpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNhc2UgQ29uc3RhbnRzLkRPT1JTIDoge1xyXG4gICAgICAgICAgICAvKmJ1ZGdldENvc3RGb3JtdWxhZSA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLkJVREdFVEVEX0NPU1RfRk9STVVMQUUgKyBjb3N0SGVhZC5uYW1lKS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICBjYWxjdWxhdGVCdWRndGVkQ29zdCA9IGJ1ZGdldENvc3RGb3JtdWxhZS5yZXBsYWNlKENvbnN0YW50cy5OVU1fT0ZfRkxPT1JTLCBidWlsZGluZ0RldGFpbHMudG90YWxOdW1PZkZsb29ycylcclxuICAgICAgICAgICAgICAucmVwbGFjZShDb25zdGFudHMuTlVNX09GX0xJRlRTLCBidWlsZGluZ0RldGFpbHMubnVtT2ZMaWZ0cyk7XHJcbiAgICAgICAgICAgIGJ1ZGdldGVkQ29zdEFtb3VudCA9IGV2YWwoY2FsY3VsYXRlQnVkZ3RlZENvc3QpOyovXHJcbiAgICAgICAgICAgIGJ1ZGdldGVkQ29zdEFtb3VudCA9IDE7XHJcbiAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlVGh1bWJSdWxlUmVwb3J0Rm9yQ29zdEhlYWQoYnVkZ2V0ZWRDb3N0QW1vdW50LCBjb3N0SGVhZCwgYnVpbGRpbmdEZXRhaWxzLCBjb3N0SGVhZHMpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNhc2UgQ29uc3RhbnRzLkRBRE9fT1JfV0FMTF9USUxJTkcgOiB7XHJcbiAgICAgICAgICAgIC8qYnVkZ2V0Q29zdEZvcm11bGFlID0gY29uZmlnLmdldChDb25zdGFudHMuQlVER0VURURfQ09TVF9GT1JNVUxBRSArIGNvc3RIZWFkLm5hbWUpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIGNhbGN1bGF0ZUJ1ZGd0ZWRDb3N0ID0gYnVkZ2V0Q29zdEZvcm11bGFlLnJlcGxhY2UoQ29uc3RhbnRzLk5VTV9PRl9GTE9PUlMsIGJ1aWxkaW5nRGV0YWlscy50b3RhbE51bU9mRmxvb3JzKVxyXG4gICAgICAgICAgICAgIC5yZXBsYWNlKENvbnN0YW50cy5OVU1fT0ZfTElGVFMsIGJ1aWxkaW5nRGV0YWlscy5udW1PZkxpZnRzKTtcclxuICAgICAgICAgICAgYnVkZ2V0ZWRDb3N0QW1vdW50ID0gZXZhbChjYWxjdWxhdGVCdWRndGVkQ29zdCk7Ki9cclxuICAgICAgICAgICAgYnVkZ2V0ZWRDb3N0QW1vdW50ID0gMTtcclxuICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVUaHVtYlJ1bGVSZXBvcnRGb3JDb3N0SGVhZChidWRnZXRlZENvc3RBbW91bnQsIGNvc3RIZWFkLCBidWlsZGluZ0RldGFpbHMsIGNvc3RIZWFkcyk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY2FzZSBDb25zdGFudHMuRkxPT1JJTkcgOiB7XHJcbiAgICAgICAgICAgIC8qYnVkZ2V0Q29zdEZvcm11bGFlID0gY29uZmlnLmdldChDb25zdGFudHMuQlVER0VURURfQ09TVF9GT1JNVUxBRSArIGNvc3RIZWFkLm5hbWUpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIGNhbGN1bGF0ZUJ1ZGd0ZWRDb3N0ID0gYnVkZ2V0Q29zdEZvcm11bGFlLnJlcGxhY2UoQ29uc3RhbnRzLk5VTV9PRl9GTE9PUlMsIGJ1aWxkaW5nRGV0YWlscy50b3RhbE51bU9mRmxvb3JzKVxyXG4gICAgICAgICAgICAgIC5yZXBsYWNlKENvbnN0YW50cy5OVU1fT0ZfTElGVFMsIGJ1aWxkaW5nRGV0YWlscy5udW1PZkxpZnRzKTtcclxuICAgICAgICAgICAgYnVkZ2V0ZWRDb3N0QW1vdW50ID0gZXZhbChjYWxjdWxhdGVCdWRndGVkQ29zdCk7Ki9cclxuICAgICAgICAgICAgYnVkZ2V0ZWRDb3N0QW1vdW50ID0gMTtcclxuICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVUaHVtYlJ1bGVSZXBvcnRGb3JDb3N0SGVhZChidWRnZXRlZENvc3RBbW91bnQsIGNvc3RIZWFkLCBidWlsZGluZ0RldGFpbHMsIGNvc3RIZWFkcyk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZGVmYXVsdCA6IHtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIHJldHVybiBjb3N0SGVhZHM7XHJcbiAgfVxyXG5cclxuICBjYWxjdWxhdGVCdWRnZXRDb3N0Rm9yQ29tbW9uQW1tZW5pdGllcyhjb3N0SGVhZHNSYXRlQW5hbHlzaXM6IGFueSwgcHJvamVjdERldGFpbHMgOiBQcm9qZWN0LCBidWlsZGluZ0RldGFpbHMgOiBhbnkpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGNhbGN1bGF0ZUJ1ZGdldENvc3RGb3JDb21tb25BbW1lbml0aWVzIGhhcyBiZWVuIGhpdCcpO1xyXG5cclxuICAgIGxldCBjb3N0SGVhZHM6QXJyYXk8Q29zdEhlYWQ+ID0gbmV3IEFycmF5PENvc3RIZWFkPigpO1xyXG4gICAgbGV0IGJ1ZGdldGVkQ29zdEFtb3VudDogbnVtYmVyO1xyXG4gICAgbGV0IGJ1ZGdldENvc3RGb3JtdWxhZTpzdHJpbmc7XHJcbiAgICBsZXQgY2FsY3VsYXRlQnVkZ3RlZENvc3QgOnN0cmluZztcclxuXHJcbiAgICBsZXQgY2FsY3VsYXRlUHJvamVjdERhdGEgPSAnU0VMRUNUIFJPVU5EKFNVTShidWlsZGluZy50b3RhbENhcnBldEFyZWFPZlVuaXQpLDIpIEFTIHRvdGFsQ2FycGV0QXJlYSwgJyArXHJcbiAgICAgICdST1VORChTVU0oYnVpbGRpbmcudG90YWxTbGFiQXJlYSksMikgQVMgdG90YWxTbGFiQXJlYVByb2plY3QsJyArXHJcbiAgICAgICdST1VORChTVU0oYnVpbGRpbmcudG90YWxTYWxlYWJsZUFyZWFPZlVuaXQpLDIpIEFTIHRvdGFsU2FsZWFibGVBcmVhICBGUk9NID8gQVMgYnVpbGRpbmcnO1xyXG4gICAgbGV0IHByb2plY3REYXRhID0gYWxhc3FsKGNhbGN1bGF0ZVByb2plY3REYXRhLCBbcHJvamVjdERldGFpbHMuYnVpbGRpbmdzXSk7XHJcbiAgICBsZXQgdG90YWxTbGFiQXJlYU9mUHJvamVjdCA6IG51bWJlciA9IHByb2plY3REYXRhWzBdLnRvdGFsU2xhYkFyZWFQcm9qZWN0O1xyXG4gICAgbGV0IHRvdGFsU2FsZWFibGVBcmVhT2ZQcm9qZWN0IDogbnVtYmVyID0gcHJvamVjdERhdGFbMF0udG90YWxTYWxlYWJsZUFyZWE7XHJcbiAgICBsZXQgdG90YWxDYXJwZXRBcmVhT2ZQcm9qZWN0IDogbnVtYmVyID0gcHJvamVjdERhdGFbMF0udG90YWxDYXJwZXRBcmVhO1xyXG5cclxuICAgIGZvcihsZXQgY29zdEhlYWQgb2YgY29zdEhlYWRzUmF0ZUFuYWx5c2lzKSB7XHJcblxyXG4gICAgICBzd2l0Y2goY29zdEhlYWQubmFtZSkge1xyXG5cclxuICAgICAgICAgIGNhc2UgQ29uc3RhbnRzLlNBRkVUWV9NRUFTVVJFUyA6IHtcclxuICAgICAgICAgICAgYnVkZ2V0Q29zdEZvcm11bGFlID0gY29uZmlnLmdldChDb25zdGFudHMuQlVER0VURURfQ09TVF9GT1JNVUxBRSArIGNvc3RIZWFkLm5hbWUpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIGNhbGN1bGF0ZUJ1ZGd0ZWRDb3N0ID0gYnVkZ2V0Q29zdEZvcm11bGFlLnJlcGxhY2UoQ29uc3RhbnRzLkNBUlBFVF9BUkVBLCB0b3RhbENhcnBldEFyZWFPZlByb2plY3QpO1xyXG4gICAgICAgICAgICBidWRnZXRlZENvc3RBbW91bnQgPSBldmFsKGNhbGN1bGF0ZUJ1ZGd0ZWRDb3N0KTtcclxuICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVUaHVtYlJ1bGVSZXBvcnRGb3JQcm9qZWN0Q29zdEhlYWQoYnVkZ2V0ZWRDb3N0QW1vdW50LCBjb3N0SGVhZCwgcHJvamVjdERldGFpbHMsIGNvc3RIZWFkcyk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY2FzZSBDb25zdGFudHMuQ0xVQl9IT1VTRSA6IHtcclxuICAgICAgICAgICAgYnVkZ2V0Q29zdEZvcm11bGFlID0gY29uZmlnLmdldChDb25zdGFudHMuQlVER0VURURfQ09TVF9GT1JNVUxBRSArIGNvc3RIZWFkLm5hbWUpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIGNhbGN1bGF0ZUJ1ZGd0ZWRDb3N0ID0gYnVkZ2V0Q29zdEZvcm11bGFlLnJlcGxhY2UoQ29uc3RhbnRzLlRPVEFMX1NMQUJfQVJFQV9PRl9DTFVCX0hPVVNFLCBwcm9qZWN0RGV0YWlscy5zbGFiQXJlYSk7XHJcbiAgICAgICAgICAgIGJ1ZGdldGVkQ29zdEFtb3VudCA9IGV2YWwoY2FsY3VsYXRlQnVkZ3RlZENvc3QpO1xyXG4gICAgICAgICAgICB0aGlzLmNhbGN1bGF0ZVRodW1iUnVsZVJlcG9ydEZvclByb2plY3RDb3N0SGVhZChidWRnZXRlZENvc3RBbW91bnQsIGNvc3RIZWFkLCBwcm9qZWN0RGV0YWlscywgY29zdEhlYWRzKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBjYXNlIENvbnN0YW50cy5TV0lNTUlOR19QT09MIDoge1xyXG4gICAgICAgICAgICBidWRnZXRDb3N0Rm9ybXVsYWUgPSBjb25maWcuZ2V0KENvbnN0YW50cy5CVURHRVRFRF9DT1NUX0ZPUk1VTEFFICsgY29zdEhlYWQubmFtZSkudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgY2FsY3VsYXRlQnVkZ3RlZENvc3QgPSBidWRnZXRDb3N0Rm9ybXVsYWUucmVwbGFjZShDb25zdGFudHMuU1dJTU1JTkdfUE9PTF9DQVBBQ0lUWSwgcHJvamVjdERldGFpbHMucG9vbENhcGFjaXR5KTtcclxuICAgICAgICAgICAgYnVkZ2V0ZWRDb3N0QW1vdW50ID0gZXZhbChjYWxjdWxhdGVCdWRndGVkQ29zdCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlVGh1bWJSdWxlUmVwb3J0Rm9yUHJvamVjdENvc3RIZWFkKGJ1ZGdldGVkQ29zdEFtb3VudCwgY29zdEhlYWQsIHByb2plY3REZXRhaWxzLCBjb3N0SGVhZHMpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGRlZmF1bHQgOiB7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNvc3RIZWFkcztcclxuICB9XHJcblxyXG4gIGFkZE5ld0NlbnRyYWxpemVkUmF0ZUZvckJ1aWxkaW5nKGJ1aWxkaW5nSWQ6IHN0cmluZywgcmF0ZUl0ZW06YW55KSB7XHJcbiAgICByZXR1cm4gbmV3IENDUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlIDogYW55LCByZWplY3QgOiBhbnkpe1xyXG4gICAgICBsb2dnZXIuaW5mbygnY3JlYXRlUHJvbWlzZUZvckFkZGluZ05ld1JhdGVJdGVtIGhhcyBiZWVuIGhpdCBmb3IgYnVpbGRpbmdJZDogJytidWlsZGluZ0lkKycsIHJhdGVJdGVtIDogJytyYXRlSXRlbSk7XHJcblxyXG4gICAgICBsZXQgYnVpbGRpbmdSZXBvc2l0b3J5ID0gbmV3IEJ1aWxkaW5nUmVwb3NpdG9yeSgpO1xyXG4gICAgICBsZXQgcXVlcnlBZGROZXdSYXRlSXRlbSA9IHsnX2lkJyA6IGJ1aWxkaW5nSWR9O1xyXG4gICAgICBsZXQgYWRkTmV3UmF0ZVJhdGVEYXRhID0geyAkcHVzaCA6IHsncmF0ZXMnIDogcmF0ZUl0ZW0gfSB9O1xyXG4gICAgICBidWlsZGluZ1JlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeUFkZE5ld1JhdGVJdGVtLCBhZGROZXdSYXRlUmF0ZURhdGEse25ldzogdHJ1ZX0sIChlcnJvcjpFcnJvciwgcmVzdWx0OkJ1aWxkaW5nKSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGU6YW55KSB7XHJcbiAgICAgIGxvZ2dlci5lcnJvcignUHJvbWlzZSBmYWlsZWQgZm9yIGluZGl2aWR1YWwgY3JlYXRlUHJvbWlzZUZvckFkZGluZ05ld1JhdGVJdGVtISBlcnJvciA6JyArSlNPTi5zdHJpbmdpZnkoZS5tZXNzYWdlKSk7XHJcbiAgICAgIENDUHJvbWlzZS5yZWplY3QoZS5tZXNzYWdlKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlQ2VudHJhbGl6ZWRSYXRlRm9yQnVpbGRpbmcoYnVpbGRpbmdJZDogc3RyaW5nLCByYXRlSXRlbSA6c3RyaW5nLCByYXRlSXRlbVJhdGUgOiBudW1iZXIpIHtcclxuICAgIHJldHVybiBuZXcgQ0NQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUgOiBhbnksIHJlamVjdCA6IGFueSl7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdjcmVhdGVQcm9taXNlRm9yUmF0ZVVwZGF0ZSBoYXMgYmVlbiBoaXQgZm9yIGJ1aWxkaW5nSWQgOiAnK2J1aWxkaW5nSWQrJywgcmF0ZUl0ZW0gOiAnK3JhdGVJdGVtKTtcclxuICAgICAgLy91cGRhdGUgcmF0ZVxyXG4gICAgICBsZXQgYnVpbGRpbmdSZXBvc2l0b3J5ID0gbmV3IEJ1aWxkaW5nUmVwb3NpdG9yeSgpO1xyXG4gICAgICBsZXQgcXVlcnlVcGRhdGVSYXRlID0geydfaWQnIDogYnVpbGRpbmdJZCwgJ3JhdGVzLml0ZW1OYW1lJzpyYXRlSXRlbX07XHJcbiAgICAgIGxldCB1cGRhdGVSYXRlID0geyAkc2V0IDogeydyYXRlcy4kLnJhdGUnIDogcmF0ZUl0ZW1SYXRlfSB9O1xyXG4gICAgICBidWlsZGluZ1JlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeVVwZGF0ZVJhdGUsIHVwZGF0ZVJhdGUse25ldzogdHJ1ZX0sIChlcnJvcjpFcnJvciwgcmVzdWx0OkJ1aWxkaW5nKSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnUmF0ZSBVcGRhdGVkJyk7XHJcbiAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGU6YW55KSB7XHJcbiAgICAgIGxvZ2dlci5lcnJvcignUHJvbWlzZSBmYWlsZWQgZm9yIGluZGl2aWR1YWwgY3JlYXRlUHJvbWlzZUZvclJhdGVVcGRhdGUgISBFcnJvcjogJyArSlNPTi5zdHJpbmdpZnkoZS5tZXNzYWdlKSk7XHJcbiAgICAgIENDUHJvbWlzZS5yZWplY3QoZS5tZXNzYWdlKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgYWRkTmV3Q2VudHJhbGl6ZWRSYXRlRm9yUHJvamVjdChwcm9qZWN0SWQ6IHN0cmluZywgcmF0ZUl0ZW06YW55KSB7XHJcbiAgICByZXR1cm4gbmV3IENDUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlIDogYW55LCByZWplY3QgOiBhbnkpe1xyXG4gICAgICBsb2dnZXIuaW5mbygnY3JlYXRlUHJvbWlzZUZvckFkZGluZ05ld1JhdGVJdGVtSW5Qcm9qZWN0UmF0ZXMgaGFzIGJlZW4gaGl0IGZvciBwcm9qZWN0SWQgOiAnK3Byb2plY3RJZCsnLCByYXRlSXRlbSA6ICcrcmF0ZUl0ZW0pO1xyXG5cclxuICAgICAgbGV0IHByb2plY3RSZXBvc2l0b3J5ID0gbmV3IFByb2plY3RSZXBvc2l0b3J5KCk7XHJcbiAgICAgIGxldCBhZGROZXdSYXRlSXRlbVF1ZXJ5UHJvamVjdCA9IHsnX2lkJyA6IHByb2plY3RJZH07XHJcbiAgICAgIGxldCBhZGROZXdSYXRlUmF0ZURhdGFQcm9qZWN0ID0geyAkcHVzaCA6IHsncmF0ZXMnIDogcmF0ZUl0ZW0gfSB9O1xyXG4gICAgICBwcm9qZWN0UmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKGFkZE5ld1JhdGVJdGVtUXVlcnlQcm9qZWN0LCBhZGROZXdSYXRlUmF0ZURhdGFQcm9qZWN0LFxyXG4gICAgICAgIHtuZXc6IHRydWV9LCAoZXJyb3I6RXJyb3IsIHJlc3VsdDpCdWlsZGluZykgPT4ge1xyXG4gICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9KS5jYXRjaChmdW5jdGlvbihlOmFueSkge1xyXG4gICAgICBsb2dnZXIuZXJyb3IoJ1Byb21pc2UgZmFpbGVkIGZvciBpbmRpdmlkdWFsIGNyZWF0ZVByb21pc2VGb3JBZGRpbmdOZXdSYXRlSXRlbUluUHJvamVjdFJhdGVzICEgZXJyb3IgOicgK0pTT04uc3RyaW5naWZ5KGUubWVzc2FnZSkpO1xyXG4gICAgICBDQ1Byb21pc2UucmVqZWN0KGUubWVzc2FnZSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZUNlbnRyYWxpemVkUmF0ZUZvclByb2plY3QocHJvamVjdElkOiBzdHJpbmcsIHJhdGVJdGVtIDpzdHJpbmcsIHJhdGVJdGVtUmF0ZSA6IG51bWJlcikge1xyXG4gICAgcmV0dXJuIG5ldyBDQ1Byb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSA6IGFueSwgcmVqZWN0IDogYW55KXtcclxuICAgICAgbG9nZ2VyLmluZm8oJ2NyZWF0ZVByb21pc2VGb3JSYXRlVXBkYXRlT2ZQcm9qZWN0UmF0ZXMgaGFzIGJlZW4gaGl0IGZvciBwcm9qZWN0SWQgOiAnK3Byb2plY3RJZCsnLCByYXRlSXRlbSA6ICcrcmF0ZUl0ZW0pO1xyXG4gICAgICAvL3VwZGF0ZSByYXRlXHJcbiAgICAgIGxldCBwcm9qZWN0UmVwb3NpdG9yeSA9IG5ldyBQcm9qZWN0UmVwb3NpdG9yeSgpO1xyXG4gICAgICBsZXQgcXVlcnlVcGRhdGVSYXRlRm9yUHJvamVjdCA9IHsnX2lkJyA6IHByb2plY3RJZCwgJ3JhdGVzLml0ZW1OYW1lJzpyYXRlSXRlbX07XHJcbiAgICAgIGxldCB1cGRhdGVSYXRlRm9yUHJvamVjdCA9IHsgJHNldCA6IHsncmF0ZXMuJC5yYXRlJyA6IHJhdGVJdGVtUmF0ZX0gfTtcclxuICAgICAgcHJvamVjdFJlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeVVwZGF0ZVJhdGVGb3JQcm9qZWN0LCB1cGRhdGVSYXRlRm9yUHJvamVjdCx7bmV3OiB0cnVlfSwgKGVycm9yOkVycm9yLCByZXN1bHQ6UHJvamVjdCkgPT4ge1xyXG4gICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ1JhdGUgVXBkYXRlZCBmb3IgUHJvamVjdCByYXRlcycpO1xyXG4gICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9KS5jYXRjaChmdW5jdGlvbihlOmFueSkge1xyXG4gICAgICBsb2dnZXIuZXJyb3IoJ1Byb21pc2UgZmFpbGVkIGZvciBpbmRpdmlkdWFsIGNyZWF0ZVByb21pc2VGb3JSYXRlVXBkYXRlT2ZQcm9qZWN0UmF0ZXMgISBFcnJvcjogJyArSlNPTi5zdHJpbmdpZnkoZS5tZXNzYWdlKSk7XHJcbiAgICAgIENDUHJvbWlzZS5yZWplY3QoZS5tZXNzYWdlKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjYWxjdWxhdGVUaHVtYlJ1bGVSZXBvcnRGb3JDb3N0SGVhZChidWRnZXRlZENvc3RBbW91bnQ6IG51bWJlciwgY29zdEhlYWRGcm9tUmF0ZUFuYWx5c2lzOiBhbnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWlsZGluZ0RhdGE6IGFueSwgY29zdEhlYWRzOiBBcnJheTxDb3N0SGVhZD4pIHtcclxuICAgIGlmIChidWRnZXRlZENvc3RBbW91bnQpIHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgY2FsY3VsYXRlVGh1bWJSdWxlUmVwb3J0Rm9yQ29zdEhlYWQgaGFzIGJlZW4gaGl0Jyk7XHJcblxyXG4gICAgICBsZXQgY29zdEhlYWQ6IENvc3RIZWFkID0gY29zdEhlYWRGcm9tUmF0ZUFuYWx5c2lzO1xyXG4gICAgICBjb3N0SGVhZC5idWRnZXRlZENvc3RBbW91bnQgPSBidWRnZXRlZENvc3RBbW91bnQ7XHJcbiAgICAgIGxldCB0aHVtYlJ1bGVSYXRlID0gbmV3IFRodW1iUnVsZVJhdGUoKTtcclxuXHJcbiAgICAgIHRodW1iUnVsZVJhdGUuc2FsZWFibGVBcmVhID0gdGhpcy5jYWxjdWxhdGVUaHVtYlJ1bGVSYXRlRm9yQXJlYShidWRnZXRlZENvc3RBbW91bnQsIGJ1aWxkaW5nRGF0YS50b3RhbFNhbGVhYmxlQXJlYU9mVW5pdCk7XHJcbiAgICAgIHRodW1iUnVsZVJhdGUuc2xhYkFyZWEgPSB0aGlzLmNhbGN1bGF0ZVRodW1iUnVsZVJhdGVGb3JBcmVhKGJ1ZGdldGVkQ29zdEFtb3VudCwgYnVpbGRpbmdEYXRhLnRvdGFsU2xhYkFyZWEpO1xyXG4gICAgICB0aHVtYlJ1bGVSYXRlLmNhcnBldEFyZWEgPSB0aGlzLmNhbGN1bGF0ZVRodW1iUnVsZVJhdGVGb3JBcmVhKGJ1ZGdldGVkQ29zdEFtb3VudCwgYnVpbGRpbmdEYXRhLnRvdGFsQ2FycGV0QXJlYU9mVW5pdCk7XHJcblxyXG4gICAgICBjb3N0SGVhZC50aHVtYlJ1bGVSYXRlID0gdGh1bWJSdWxlUmF0ZTtcclxuICAgICAgY29zdEhlYWRzLnB1c2goY29zdEhlYWQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjYWxjdWxhdGVUaHVtYlJ1bGVSZXBvcnRGb3JQcm9qZWN0Q29zdEhlYWQoYnVkZ2V0ZWRDb3N0QW1vdW50OiBudW1iZXIsIGNvc3RIZWFkRnJvbVJhdGVBbmFseXNpczogYW55LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvamVjdERldGFpbHM6IGFueSwgY29zdEhlYWRzOiBBcnJheTxDb3N0SGVhZD4pIHtcclxuICAgIGlmIChidWRnZXRlZENvc3RBbW91bnQpIHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgY2FsY3VsYXRlVGh1bWJSdWxlUmVwb3J0Rm9yUHJvamVjdENvc3RIZWFkIGhhcyBiZWVuIGhpdCcpO1xyXG5cclxuICAgICAgbGV0IGNhbGN1bGF0ZVByb2plY3REYXRhID0gJ1NFTEVDVCBST1VORChTVU0oYnVpbGRpbmcudG90YWxDYXJwZXRBcmVhT2ZVbml0KSwyKSBBUyB0b3RhbENhcnBldEFyZWEsICcgK1xyXG4gICAgICAgICdST1VORChTVU0oYnVpbGRpbmcudG90YWxTbGFiQXJlYSksMikgQVMgdG90YWxTbGFiQXJlYVByb2plY3QsJyArXHJcbiAgICAgICAgJ1JPVU5EKFNVTShidWlsZGluZy50b3RhbFNhbGVhYmxlQXJlYU9mVW5pdCksMikgQVMgdG90YWxTYWxlYWJsZUFyZWEgIEZST00gPyBBUyBidWlsZGluZyc7XHJcbiAgICAgIGxldCBwcm9qZWN0RGF0YSA9IGFsYXNxbChjYWxjdWxhdGVQcm9qZWN0RGF0YSwgW3Byb2plY3REZXRhaWxzLmJ1aWxkaW5nc10pO1xyXG4gICAgICBsZXQgdG90YWxTbGFiQXJlYU9mUHJvamVjdCA6IG51bWJlciA9IHByb2plY3REYXRhWzBdLnRvdGFsU2xhYkFyZWFQcm9qZWN0O1xyXG4gICAgICBsZXQgdG90YWxTYWxlYWJsZUFyZWFPZlByb2plY3QgOiBudW1iZXIgPSBwcm9qZWN0RGF0YVswXS50b3RhbFNhbGVhYmxlQXJlYTtcclxuICAgICAgbGV0IHRvdGFsQ2FycGV0QXJlYU9mUHJvamVjdCA6IG51bWJlciA9IHByb2plY3REYXRhWzBdLnRvdGFsQ2FycGV0QXJlYTtcclxuXHJcbiAgICAgIGxldCBjb3N0SGVhZDogQ29zdEhlYWQgPSBjb3N0SGVhZEZyb21SYXRlQW5hbHlzaXM7XHJcbiAgICAgIGNvc3RIZWFkLmJ1ZGdldGVkQ29zdEFtb3VudCA9IGJ1ZGdldGVkQ29zdEFtb3VudDtcclxuICAgICAgbGV0IHRodW1iUnVsZVJhdGUgPSBuZXcgVGh1bWJSdWxlUmF0ZSgpO1xyXG5cclxuICAgICAgdGh1bWJSdWxlUmF0ZS5zYWxlYWJsZUFyZWEgPSB0aGlzLmNhbGN1bGF0ZVRodW1iUnVsZVJhdGVGb3JBcmVhKGJ1ZGdldGVkQ29zdEFtb3VudCwgdG90YWxTYWxlYWJsZUFyZWFPZlByb2plY3QpO1xyXG4gICAgICB0aHVtYlJ1bGVSYXRlLnNsYWJBcmVhID0gdGhpcy5jYWxjdWxhdGVUaHVtYlJ1bGVSYXRlRm9yQXJlYShidWRnZXRlZENvc3RBbW91bnQsIHRvdGFsU2xhYkFyZWFPZlByb2plY3QpO1xyXG4gICAgICB0aHVtYlJ1bGVSYXRlLmNhcnBldEFyZWEgPSB0aGlzLmNhbGN1bGF0ZVRodW1iUnVsZVJhdGVGb3JBcmVhKGJ1ZGdldGVkQ29zdEFtb3VudCwgdG90YWxDYXJwZXRBcmVhT2ZQcm9qZWN0KTtcclxuXHJcbiAgICAgIGNvc3RIZWFkLnRodW1iUnVsZVJhdGUgPSB0aHVtYlJ1bGVSYXRlO1xyXG4gICAgICBjb3N0SGVhZHMucHVzaChjb3N0SGVhZCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNhbGN1bGF0ZVRodW1iUnVsZVJhdGVGb3JBcmVhKGJ1ZGdldGVkQ29zdEFtb3VudDogbnVtYmVyLCBhcmVhOiBudW1iZXIpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGNhbGN1bGF0ZVRodW1iUnVsZVJhdGVGb3JBcmVhIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgbGV0IGJ1ZGdldENvc3RSYXRlcyA9IG5ldyBCdWRnZXRDb3N0UmF0ZXMoKTtcclxuICAgIGJ1ZGdldENvc3RSYXRlcy5zcWZ0ID0gKGJ1ZGdldGVkQ29zdEFtb3VudCAvIGFyZWEpO1xyXG4gICAgYnVkZ2V0Q29zdFJhdGVzLnNxbXQgPSAoYnVkZ2V0Q29zdFJhdGVzLnNxZnQgKiBjb25maWcuZ2V0KENvbnN0YW50cy5TUVVBUkVfTUVURVIpKTtcclxuICAgIHJldHVybiBidWRnZXRDb3N0UmF0ZXM7XHJcbiAgfVxyXG59XHJcblxyXG5PYmplY3Quc2VhbChQcm9qZWN0U2VydmljZSk7XHJcbmV4cG9ydCA9IFByb2plY3RTZXJ2aWNlO1xyXG4iXX0=
