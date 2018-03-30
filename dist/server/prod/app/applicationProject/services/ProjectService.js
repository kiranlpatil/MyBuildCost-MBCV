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
                callback(null, { data: inActiveWorkItemsListWithBuildingRates, access_token: _this.authInterceptor.issueTokenWithUid(user) });
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
                callback(null, { data: inActiveWorkItemsListWithProjectRates, access_token: _this.authInterceptor.issueTokenWithUid(user) });
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
                                var rateObjectExistSQL = "SELECT * FROM ? AS rates WHERE rates.itemName= '" + rate_1.itemName + "'";
                                var rateExistArray = alasql(rateObjectExistSQL, [centralizedRates_1]);
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
                                    logger.error(' Promise failed for convertCostHeadsFromRateAnalysisToCostControl ! :' + JSON.stringify(e));
                                    CCPromise.reject(e);
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
                            var rateObjectExistSQL = "SELECT * FROM ? AS rates WHERE rates.itemName= '" + rate_2.itemName + "'";
                            var rateExistArray = alasql(rateObjectExistSQL, [centralizedRatesOfProjects_1]);
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
                                logger.error(' Promise failed for convertCostHeadsFromRateAnalysisToCostControl ! :' + JSON.stringify(e));
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
                                        workItem.quantity.total = alasql('VALUE OF SELECT SUM(total) FROM ?', [quantityItems]);
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
                                        workItem.quantity.total = alasql('VALUE OF SELECT SUM(total) FROM ?', [quantityItems]);
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
                for (var _i = 0, costHeadList_5 = costHeadList; _i < costHeadList_5.length; _i++) {
                    var costHead = costHeadList_5[_i];
                    if (costHeadId === costHead.rateAnalysisId) {
                        var categoriesOfCostHead = costHead.categories;
                        for (var _a = 0, categoriesOfCostHead_1 = categoriesOfCostHead; _a < categoriesOfCostHead_1.length; _a++) {
                            var categoryData = categoriesOfCostHead_1[_a];
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
    ProjectService.prototype.updateQuantityItemsOfWorkItem = function (quantity, quantityDetail) {
        quantity.isEstimated = true;
        if (quantity.quantityItemDetails.length === 0) {
            quantityDetail.total = alasql('VALUE OF SELECT SUM(quantity) FROM ?', [quantityDetail.quantityItems]);
            quantity.quantityItemDetails.push(quantityDetail);
        }
        else {
            var isDefaultExistsSQL = 'SELECT name from ? AS quantityDetails where quantityDetails.name="default"';
            var isDefaultExistsQuantityDetail = alasql(isDefaultExistsSQL, [quantity.quantityItemDetails]);
            if (isDefaultExistsQuantityDetail.length > 0) {
                quantity.quantityItemDetails = [];
                quantityDetail.total = alasql('VALUE OF SELECT SUM(quantity) FROM ?', [quantityDetail.quantityItems]);
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
                                quantity.quantityItemDetails[quantityindex].total = alasql('VALUE OF SELECT SUM(quantity) FROM ?', [quantityDetail.quantityItems]);
                            }
                        }
                    }
                    else {
                        quantityDetail.total = alasql('VALUE OF SELECT SUM(quantity) FROM ?', [quantityDetail.quantityItems]);
                        quantity.quantityItemDetails.push(quantityDetail);
                    }
                }
                else {
                    quantity.quantityItemDetails = [];
                    quantityDetail.total = alasql('VALUE OF SELECT SUM(quantity) FROM ?', [quantityDetail.quantityItems]);
                    quantity.quantityItemDetails.push(quantityDetail);
                }
            }
        }
        quantity.total = alasql('VALUE OF SELECT SUM(total) FROM ?', [quantity.quantityItemDetails]);
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
                for (var _i = 0, costHeadList_6 = costHeadList; _i < costHeadList_6.length; _i++) {
                    var costHead = costHeadList_6[_i];
                    if (costHeadId === costHead.rateAnalysisId) {
                        var categoriesOfCostHead = costHead.categories;
                        for (var _a = 0, categoriesOfCostHead_2 = categoriesOfCostHead; _a < categoriesOfCostHead_2.length; _a++) {
                            var categoryData = categoriesOfCostHead_2[_a];
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
                    callback(null, { data: workItemsListWithBuildingRates, access_token: _this.authInterceptor.issueTokenWithUid(user) });
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
                    callback(null, { data: workItemsListWithRates, access_token: _this.authInterceptor.issueTokenWithUid(user) });
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
        var workItemsListWithRates = new Array();
        for (var _i = 0, workItemsOfCategory_2 = workItemsOfCategory; _i < workItemsOfCategory_2.length; _i++) {
            var workItemObj = workItemsOfCategory_2[_i];
            if (workItemObj.active === isWorkItemActive) {
                var workItem = workItemObj;
                var rateItemsOfWorkItem = workItemObj.rate.rateItems;
                workItem.rate.rateItems = this.getRatesFromCentralizedrates(rateItemsOfWorkItem, centralizedRates);
                var arrayOfRateItems = workItem.rate.rateItems;
                var totalOfAllRateItems = alasql('VALUE OF SELECT SUM(totalAmount) FROM ?', [arrayOfRateItems]);
                workItem.rate.total = parseFloat((totalOfAllRateItems / workItem.rate.quantity).toFixed(Constants.NUMBER_OF_FRACTION_DIGIT));
                var quantityItems = workItem.quantity.quantityItemDetails;
                workItem.quantity.total = alasql('VALUE OF SELECT SUM(total) FROM ?', [quantityItems]);
                if (workItem.rate.isEstimated && workItem.quantity.isEstimated) {
                    workItem.amount = this.commonService.decimalConversion(workItem.rate.total * workItem.quantity.total);
                }
                workItemsListWithRates.push(workItem);
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
    ProjectService.prototype.getCategoriesListWithCentralizedRates = function (categoriesOfCostHead, centralizedRates) {
        var categoriesTotalAmount = 0;
        var categoriesListWithRates = new CategoriesListWithRatesDTO;
        for (var _i = 0, categoriesOfCostHead_3 = categoriesOfCostHead; _i < categoriesOfCostHead_3.length; _i++) {
            var categoryData = categoriesOfCostHead_3[_i];
            var workItems = this.getWorkItemListWithCentralizedRates(categoryData.workItems, centralizedRates, true);
            var calculateWorkItemTotalAmount = alasql('VALUE OF SELECT SUM(amount) FROM ?', [workItems]);
            categoryData.amount = calculateWorkItemTotalAmount;
            categoriesTotalAmount = categoriesTotalAmount + calculateWorkItemTotalAmount;
            delete categoryData.workItems;
            categoriesListWithRates.categories.push(categoryData);
        }
        if (categoriesTotalAmount !== 0) {
            categoriesListWithRates.categoriesAmount = this.commonService.decimalConversion(categoriesTotalAmount);
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
                        logger.error(' Promise failed for syncProjectWithRateAnalysisData ! :' + JSON.stringify(e));
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
                logger.error('Error in updateCostHeadsForBuildingAndProject : convertCostHeadsFromRateAnalysisToCostControl : ' + JSON.stringify(error));
                callback(error, null);
            }
            else {
                logger.info('GetAllDataFromRateAnalysis success');
                var projectService_1 = new ProjectService();
                var data = projectService_1.calculateBudgetCostForBuilding(result.buildingCostHeads, projectData, buildingData);
                var rates = _this.getRates(result, data);
                var queryForBuilding = { '_id': buildingId };
                var updateCostHead = { $set: { 'costHeads': data, 'rates': rates } };
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
                    var buildingCostHeads = projectService_2.calculateBudgetCostForBuilding(result.buildingCostHeads, projectDetails, buildingDetails);
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
            logger.error('Error in updateBudgetRatesForBuildingCostHeads :' + e);
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
                    var projectCostHeads = projectService.calculateBudgetCostForCommonAmmenities(result.buildingCostHeads, projectDetails, buildingDetails);
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
            logger.error('Error in updateBudgetRatesForProjectCostHeads :' + e);
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
            logger.error('Promise failed for individual createPromiseForAddingNewRateItem! error :' + JSON.stringify(e));
            CCPromise.reject(e);
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
            logger.error('Promise failed for individual createPromiseForRateUpdate ! Error: ' + JSON.stringify(e));
            CCPromise.reject(e);
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
            logger.error('Promise failed for individual createPromiseForAddingNewRateItemInProjectRates ! error :' + JSON.stringify(e));
            CCPromise.reject(e);
        });
    };
    ProjectService.prototype.updateCentralizedRateForProject = function (projectId, rateItem, rateItemRate) {
        return new CCPromise(function (resolve, reject) {
            logger.info('createPromiseForRateUpdateOfProjectRates has been hit for projectId : ' + projectId + ', rateItem : ' + rateItem);
            var projectRepository = new ProjectRepository();
            var queryUpdateRateForProject = { '_id': projectId, 'rates.item': rateItem };
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
            logger.error('Promise failed for individual createPromiseForRateUpdateOfProjectRates ! Error: ' + JSON.stringify(e));
            CCPromise.reject(e);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHBsaWNhdGlvblByb2plY3Qvc2VydmljZXMvUHJvamVjdFNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhFQUFpRjtBQUNqRixnRkFBbUY7QUFDbkYsb0VBQXVFO0FBQ3ZFLGtFQUFxRTtBQUlyRSw2RUFBZ0Y7QUFDaEYsOEVBQWlGO0FBQ2pGLDBFQUE2RTtBQUU3RSxnRUFBbUU7QUFDbkUsd0VBQTJFO0FBRTNFLDJEQUE4RDtBQUM5RCx3RUFBMkU7QUFFM0UsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixtQ0FBcUM7QUFDckMsSUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUM7QUFDdkMsK0JBQWtDO0FBQ2xDLHFGQUF3RjtBQUN4RixpRkFBb0Y7QUFDcEYscUVBQXdFO0FBSXhFLGlHQUFvRztBQUNwRyw2RUFBZ0Y7QUFDaEYsbUVBQXVFO0FBQ3ZFLCtFQUE4RTtBQUU5RSxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsNEJBQTRCLENBQUMsQ0FBQztBQUN0RCxJQUFJLE1BQU0sR0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFFL0M7SUFZRTtRQUNFLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLGlCQUFpQixFQUFFLENBQUM7UUFDakQsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksa0JBQWtCLEVBQUUsQ0FBQztRQUNuRCxJQUFJLENBQUMsUUFBUSxHQUFHLFlBQVksQ0FBQyxRQUFRLENBQUM7UUFDdEMsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLGVBQWUsRUFBRSxDQUFDO1FBQzdDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxXQUFXLEVBQUUsQ0FBQztRQUNyQyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksNkJBQWEsRUFBRSxD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QkFBa0IsR0FBRyxJQUFJLENBQUMsQ0FBQztRQUNuRCxlQUFlLENBQUMsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1FBQ25GLE1BQU0sQ0FBQyxlQUFlLENBQUM7SUFDekIsQ0FBQztJQUNILHFCQUFDO0FBQUQsQ0FscERBLEFBa3BEQyxJQUFBO0FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUM1QixpQkFBUyxjQUFjLENBQUMiLCJmaWxlIjoiYXBwL2FwcGxpY2F0aW9uUHJvamVjdC9zZXJ2aWNlcy9Qcm9qZWN0U2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQcm9qZWN0UmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9Qcm9qZWN0UmVwb3NpdG9yeScpO1xyXG5pbXBvcnQgQnVpbGRpbmdSZXBvc2l0b3J5ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L0J1aWxkaW5nUmVwb3NpdG9yeScpO1xyXG5pbXBvcnQgVXNlclNlcnZpY2UgPSByZXF1aXJlKCcuLy4uLy4uL2ZyYW1ld29yay9zZXJ2aWNlcy9Vc2VyU2VydmljZScpO1xyXG5pbXBvcnQgUHJvamVjdEFzc2V0ID0gcmVxdWlyZSgnLi4vLi4vZnJhbWV3b3JrL3NoYXJlZC9wcm9qZWN0YXNzZXQnKTtcclxuaW1wb3J0IFVzZXIgPSByZXF1aXJlKCcuLi8uLi9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9tb25nb29zZS91c2VyJyk7XHJcbmltcG9ydCBQcm9qZWN0ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb25nb29zZS9Qcm9qZWN0Jyk7XHJcbmltcG9ydCBCdWlsZGluZyA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9uZ29vc2UvQnVpbGRpbmcnKTtcclxuaW1wb3J0IEJ1aWxkaW5nTW9kZWwgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3Byb2plY3QvYnVpbGRpbmcvQnVpbGRpbmcnKTtcclxuaW1wb3J0IEF1dGhJbnRlcmNlcHRvciA9IHJlcXVpcmUoJy4uLy4uL2ZyYW1ld29yay9pbnRlcmNlcHRvci9hdXRoLmludGVyY2VwdG9yJyk7XHJcbmltcG9ydCBDb3N0Q29udHJvbGxFeGNlcHRpb24gPSByZXF1aXJlKCcuLi9leGNlcHRpb24vQ29zdENvbnRyb2xsRXhjZXB0aW9uJyk7XHJcbmltcG9ydCBRdWFudGl0eSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9idWlsZGluZy9RdWFudGl0eScpO1xyXG5pbXBvcnQgUmF0ZSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9idWlsZGluZy9SYXRlJyk7XHJcbmltcG9ydCBDb3N0SGVhZCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9idWlsZGluZy9Db3N0SGVhZCcpO1xyXG5pbXBvcnQgV29ya0l0ZW0gPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3Byb2plY3QvYnVpbGRpbmcvV29ya0l0ZW0nKTtcclxuaW1wb3J0IFJhdGVBbmFseXNpc1NlcnZpY2UgPSByZXF1aXJlKCcuL1JhdGVBbmFseXNpc1NlcnZpY2UnKTtcclxuaW1wb3J0IENhdGVnb3J5ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L2J1aWxkaW5nL0NhdGVnb3J5Jyk7XHJcbmltcG9ydCBjb25zdGFudCA9IHJlcXVpcmUoJy4uL3NoYXJlZC9jb25zdGFudHMnKTtcclxubGV0IGNvbmZpZyA9IHJlcXVpcmUoJ2NvbmZpZycpO1xyXG5sZXQgbG9nNGpzID0gcmVxdWlyZSgnbG9nNGpzJyk7XHJcbmltcG9ydCAqIGFzIG1vbmdvb3NlIGZyb20gJ21vbmdvb3NlJztcclxubGV0IE9iamVjdElkID0gbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQ7XHJcbmltcG9ydCBhbGFzcWwgPSByZXF1aXJlKCdhbGFzcWwnKTtcclxuaW1wb3J0IEJ1ZGdldENvc3RSYXRlcyA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9yZXBvcnRzL0J1ZGdldENvc3RSYXRlcycpO1xyXG5pbXBvcnQgVGh1bWJSdWxlUmF0ZSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9yZXBvcnRzL1RodW1iUnVsZVJhdGUnKTtcclxuaW1wb3J0IENvbnN0YW50cyA9IHJlcXVpcmUoJy4uLy4uL2FwcGxpY2F0aW9uUHJvamVjdC9zaGFyZWQvY29uc3RhbnRzJyk7XHJcbmltcG9ydCBRdWFudGl0eUl0ZW0gPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3Byb2plY3QvYnVpbGRpbmcvUXVhbnRpdHlJdGVtJyk7XHJcbmltcG9ydCBRdWFudGl0eURldGFpbHMgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3Byb2plY3QvYnVpbGRpbmcvUXVhbnRpdHlEZXRhaWxzJyk7XHJcbmltcG9ydCBSYXRlSXRlbSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9idWlsZGluZy9SYXRlSXRlbScpO1xyXG5pbXBvcnQgQ2F0ZWdvcmllc0xpc3RXaXRoUmF0ZXNEVE8gPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL2R0by9wcm9qZWN0L0NhdGVnb3JpZXNMaXN0V2l0aFJhdGVzRFRPJyk7XHJcbmltcG9ydCBDZW50cmFsaXplZFJhdGUgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3Byb2plY3QvQ2VudHJhbGl6ZWRSYXRlJyk7XHJcbmltcG9ydCBtZXNzYWdlcyAgPSByZXF1aXJlKCcuLi8uLi9hcHBsaWNhdGlvblByb2plY3Qvc2hhcmVkL21lc3NhZ2VzJyk7XHJcbmltcG9ydCB7IENvbW1vblNlcnZpY2UgfSBmcm9tICcuLi8uLi9hcHBsaWNhdGlvblByb2plY3Qvc2hhcmVkL0NvbW1vblNlcnZpY2UnO1xyXG5cclxubGV0IENDUHJvbWlzZSA9IHJlcXVpcmUoJ3Byb21pc2UvbGliL2VzNi1leHRlbnNpb25zJyk7XHJcbmxldCBsb2dnZXI9bG9nNGpzLmdldExvZ2dlcignUHJvamVjdCBzZXJ2aWNlJyk7XHJcblxyXG5jbGFzcyBQcm9qZWN0U2VydmljZSB7XHJcbiAgQVBQX05BTUU6IHN0cmluZztcclxuICBjb21wYW55X25hbWU6IHN0cmluZztcclxuICBjb3N0SGVhZElkOiBudW1iZXI7XHJcbiAgY2F0ZWdvcnlJZDogbnVtYmVyO1xyXG4gIHdvcmtJdGVtSWQ6IG51bWJlcjtcclxuICBwcml2YXRlIHByb2plY3RSZXBvc2l0b3J5OiBQcm9qZWN0UmVwb3NpdG9yeTtcclxuICBwcml2YXRlIGJ1aWxkaW5nUmVwb3NpdG9yeTogQnVpbGRpbmdSZXBvc2l0b3J5O1xyXG4gIHByaXZhdGUgYXV0aEludGVyY2VwdG9yOiBBdXRoSW50ZXJjZXB0b3I7XHJcbiAgcHJpdmF0ZSB1c2VyU2VydmljZSA6IFVzZXJTZXJ2aWNlO1xyXG4gIHByaXZhdGUgY29tbW9uU2VydmljZSA6IENvbW1vblNlcnZpY2U7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5wcm9qZWN0UmVwb3NpdG9yeSA9IG5ldyBQcm9qZWN0UmVwb3NpdG9yeSgpO1xyXG4gICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkgPSBuZXcgQnVpbGRpbmdSZXBvc2l0b3J5KCk7XHJcbiAgICB0aGlzLkFQUF9OQU1FID0gUHJvamVjdEFzc2V0LkFQUF9OQU1FO1xyXG4gICAgdGhpcy5hdXRoSW50ZXJjZXB0b3IgPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XHJcbiAgICB0aGlzLnVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICB0aGlzLmNvbW1vblNlcnZpY2UgPSBuZXcgQ29tbW9uU2VydmljZSgpO1xyXG4gIH1cclxuXHJcbiAgY3JlYXRlUHJvamVjdChkYXRhOiBQcm9qZWN0LCB1c2VyIDogVXNlciwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgaWYoIXVzZXIuX2lkKSB7XHJcbiAgICAgIGNhbGxiYWNrKG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oJ1VzZXJJZCBOb3QgRm91bmQnLG51bGwpLCBudWxsKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnByb2plY3RSZXBvc2l0b3J5LmNyZWF0ZShkYXRhLCAoZXJyLCByZXMpID0+IHtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgY3JlYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICAgIGxvZ2dlci5kZWJ1ZygnUHJvamVjdCBJRCA6ICcrcmVzLl9pZCk7XHJcbiAgICAgICAgbG9nZ2VyLmRlYnVnKCdQcm9qZWN0IE5hbWUgOiAnK3Jlcy5uYW1lKTtcclxuICAgICAgICBsZXQgcHJvamVjdElkID0gcmVzLl9pZDtcclxuICAgICAgICBsZXQgbmV3RGF0YSA9ICB7JHB1c2g6IHsgcHJvamVjdDogcHJvamVjdElkIH19O1xyXG4gICAgICAgIGxldCBxdWVyeSA9IHtfaWQgOiB1c2VyLl9pZH07XHJcbiAgICAgICAgdGhpcy51c2VyU2VydmljZS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCBuZXdEYXRhLCB7bmV3IDp0cnVlfSwoZXJyLCByZXNwKSA9PiB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kT25lQW5kVXBkYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICAgICAgaWYoZXJyKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBkZWxldGUgcmVzLmNhdGVnb3J5O1xyXG4gICAgICAgICAgICBkZWxldGUgcmVzLnJhdGU7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJlcyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0UHJvamVjdEJ5SWQoIHByb2plY3RJZCA6IHN0cmluZywgdXNlcjogVXNlciwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbGV0IHF1ZXJ5ID0geyBfaWQ6IHByb2plY3RJZH07XHJcbiAgICBsZXQgcG9wdWxhdGUgPSB7cGF0aCA6ICdidWlsZGluZycsIHNlbGVjdDogWyduYW1lJyAsICd0b3RhbFNsYWJBcmVhJyxdfTtcclxuICAgIHRoaXMucHJvamVjdFJlcG9zaXRvcnkuZmluZEFuZFBvcHVsYXRlKHF1ZXJ5LCBwb3B1bGF0ZSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZmluZEFuZFBvcHVsYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBsb2dnZXIuZGVidWcoJ1Byb2plY3QgTmFtZSA6ICcrcmVzdWx0WzBdLm5hbWUpO1xyXG4gICAgICBpZihlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjYWxsYmFjayhudWxsLHsgZGF0YTogcmVzdWx0LCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0UHJvamVjdEFuZEJ1aWxkaW5nRGV0YWlscyggcHJvamVjdElkIDogc3RyaW5nLCBidWlsZGluZ0lkOiBzdHJpbmcsIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGdldFByb2plY3RBbmRCdWlsZGluZ0RldGFpbHMgZm9yIHN5bmMgd2l0aCByYXRlQW5hbHlzaXMgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICBsZXQgcXVlcnkgPSB7IF9pZDogcHJvamVjdElkfTtcclxuICAgIGxldCBwb3B1bGF0ZSA9IHtwYXRoIDogJ2J1aWxkaW5ncyd9O1xyXG4gICAgdGhpcy5wcm9qZWN0UmVwb3NpdG9yeS5maW5kQW5kUG9wdWxhdGUocXVlcnksIHBvcHVsYXRlLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kQW5kUG9wdWxhdGUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGxvZ2dlci5kZWJ1ZygnUHJvamVjdCBOYW1lIDogJytyZXN1bHRbMF0ubmFtZSk7XHJcbiAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgbG9nZ2VyLmVycm9yKCdQcm9qZWN0IHNlcnZpY2UsIGdldFByb2plY3RBbmRCdWlsZGluZ0RldGFpbHMgZmluZEFuZFBvcHVsYXRlIGZhaWxlZCAnK0pTT04uc3RyaW5naWZ5KGVycm9yKSk7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxvZ2dlci5kZWJ1ZygnZ2V0UHJvamVjdEFuZEJ1aWxkaW5nRGV0YWlscyBzdWNjZXNzLicpO1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwseyBkYXRhOiByZXN1bHQgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlUHJvamVjdEJ5SWQoIHByb2plY3REZXRhaWxzOiBQcm9qZWN0LCB1c2VyOiBVc2VyLCBjYWxsYmFjazooZXJyb3I6IGFueSwgcmVzdWx0OmFueSkgPT4gdm9pZCkge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgdXBkYXRlUHJvamVjdERldGFpbHMgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICBsZXQgcXVlcnkgPSB7IF9pZCA6IHByb2plY3REZXRhaWxzLl9pZCB9O1xyXG4gICAgZGVsZXRlIHByb2plY3REZXRhaWxzLl9pZDtcclxuXHJcbiAgICB0aGlzLnByb2plY3RSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIHByb2plY3REZXRhaWxzLCB7bmV3OiB0cnVlfSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZmluZE9uZUFuZFVwZGF0ZSBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiByZXN1bHQsIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBjcmVhdGVCdWlsZGluZyhwcm9qZWN0SWQgOiBzdHJpbmcsIGJ1aWxkaW5nRGV0YWlscyA6IEJ1aWxkaW5nLCB1c2VyOiBVc2VyLCBjYWxsYmFjazooZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpPT4gdm9pZCkge1xyXG4gICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuY3JlYXRlKGJ1aWxkaW5nRGV0YWlscywgKGVycm9yLCByZXN1bHQpPT4ge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBjcmVhdGUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCBxdWVyeSA9IHtfaWQgOiBwcm9qZWN0SWQgfTtcclxuICAgICAgICBsZXQgbmV3RGF0YSA9IHsgJHB1c2g6IHtidWlsZGluZ3MgOiByZXN1bHQuX2lkfX07XHJcbiAgICAgICAgdGhpcy5wcm9qZWN0UmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCBuZXdEYXRhLCB7bmV3IDogdHJ1ZX0sIChlcnJvciwgc3RhdHVzKT0+IHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGZpbmRPbmVBbmRVcGRhdGUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTogcmVzdWx0LCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlQnVpbGRpbmdCeUlkKCBidWlsZGluZ0lkOnN0cmluZywgYnVpbGRpbmdEZXRhaWxzOmFueSwgdXNlcjpVc2VyLCBjYWxsYmFjazooZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpPT4gdm9pZCkge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgdXBkYXRlQnVpbGRpbmcgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICBsZXQgcXVlcnkgPSB7IF9pZCA6IGJ1aWxkaW5nSWQgfTtcclxuICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIGJ1aWxkaW5nRGV0YWlscyx7bmV3OiB0cnVlfSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZmluZE9uZUFuZFVwZGF0ZSBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiByZXN1bHQsIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBjbG9uZUJ1aWxkaW5nRGV0YWlscyggYnVpbGRpbmdJZDpzdHJpbmcsIGJ1aWxkaW5nRGV0YWlsczphbnksIHVzZXI6VXNlciwgY2FsbGJhY2s6KGVycm9yOiBhbnksIHJlc3VsdDogYW55KT0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGNsb25lQnVpbGRpbmdEZXRhaWxzIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgbGV0IHF1ZXJ5ID0geyBfaWQgOiBidWlsZGluZ0lkIH07XHJcbiAgICB0aGlzLmJ1aWxkaW5nUmVwb3NpdG9yeS5maW5kQnlJZChidWlsZGluZ0lkLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kQnlJZCBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCBjbG9uZWRDb3N0SGVhZERldGFpbHMgOkFycmF5PENvc3RIZWFkPj1bXTtcclxuICAgICAgICBsZXQgY29zdEhlYWRzID1idWlsZGluZ0RldGFpbHMuY29zdEhlYWRzO1xyXG4gICAgICAgIGxldCByZXN1bHRDb3N0SGVhZHMgPSByZXN1bHQuY29zdEhlYWRzO1xyXG4gICAgICAgIGZvcihsZXQgY29zdEhlYWQgb2YgY29zdEhlYWRzKSB7XHJcbiAgICAgICAgICBmb3IobGV0IHJlc3VsdENvc3RIZWFkIG9mIHJlc3VsdENvc3RIZWFkcykge1xyXG4gICAgICAgICAgICBpZihjb3N0SGVhZC5uYW1lID09PSByZXN1bHRDb3N0SGVhZC5uYW1lKSB7XHJcbiAgICAgICAgICAgICAgbGV0IGNsb25lZENvc3RIZWFkID0gbmV3IENvc3RIZWFkO1xyXG4gICAgICAgICAgICAgIGNsb25lZENvc3RIZWFkLm5hbWUgPSByZXN1bHRDb3N0SGVhZC5uYW1lO1xyXG4gICAgICAgICAgICAgIGNsb25lZENvc3RIZWFkLnJhdGVBbmFseXNpc0lkID0gcmVzdWx0Q29zdEhlYWQucmF0ZUFuYWx5c2lzSWQ7XHJcbiAgICAgICAgICAgICAgY2xvbmVkQ29zdEhlYWQuYWN0aXZlID0gY29zdEhlYWQuYWN0aXZlO1xyXG4gICAgICAgICAgICAgIGNsb25lZENvc3RIZWFkLnRodW1iUnVsZVJhdGUgPSByZXN1bHRDb3N0SGVhZC50aHVtYlJ1bGVSYXRlO1xyXG5cclxuICAgICAgICAgICAgICBpZihjb3N0SGVhZC5hY3RpdmUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgY2F0ZWdvcnlMaXN0ID0gY29zdEhlYWQuY2F0ZWdvcnk7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVzdWx0Q2F0ZWdvcnlMaXN0ID0gcmVzdWx0Q29zdEhlYWQuY2F0ZWdvcmllcztcclxuICAgICAgICAgICAgICAgIGZvcihsZXQgcmVzdWx0Q2F0ZWdvcnlJbmRleD0wOyByZXN1bHRDYXRlZ29yeUluZGV4PHJlc3VsdENhdGVnb3J5TGlzdC5sZW5ndGg7IHJlc3VsdENhdGVnb3J5SW5kZXgrKykge1xyXG4gICAgICAgICAgICAgICAgICBmb3IobGV0IGNhdGVnb3J5SW5kZXg9MCA7IGNhdGVnb3J5SW5kZXg8Y2F0ZWdvcnlMaXN0Lmxlbmd0aDsgY2F0ZWdvcnlJbmRleCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoY2F0ZWdvcnlMaXN0W2NhdGVnb3J5SW5kZXhdLm5hbWUgPT09IHJlc3VsdENhdGVnb3J5TGlzdFtyZXN1bHRDYXRlZ29yeUluZGV4XS5uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBpZighY2F0ZWdvcnlMaXN0W2NhdGVnb3J5SW5kZXhdLmFjdGl2ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRDYXRlZ29yeUxpc3Quc3BsaWNlKHJlc3VsdENhdGVnb3J5SW5kZXgsMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzdWx0V29ya2l0ZW1MaXN0ID0gcmVzdWx0Q2F0ZWdvcnlMaXN0W3Jlc3VsdENhdGVnb3J5SW5kZXhdLndvcmtJdGVtcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHdvcmtJdGVtTGlzdCA9IGNhdGVnb3J5TGlzdFtjYXRlZ29yeUluZGV4XS53b3JrSXRlbXM7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IobGV0IHJlc3VsdFdvcmtpdGVtSW5kZXg9MDsgIHJlc3VsdFdvcmtpdGVtSW5kZXggPCByZXN1bHRXb3JraXRlbUxpc3QubGVuZ3RoOyByZXN1bHRXb3JraXRlbUluZGV4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IobGV0IHdvcmtpdGVtSW5kZXg9MDsgIHdvcmtpdGVtSW5kZXggPCB3b3JrSXRlbUxpc3QubGVuZ3RoOyB3b3JraXRlbUluZGV4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCF3b3JrSXRlbUxpc3Rbd29ya2l0ZW1JbmRleF0uYWN0aXZlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFdvcmtpdGVtTGlzdC5zcGxpY2UocmVzdWx0V29ya2l0ZW1JbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjbG9uZWRDb3N0SGVhZC5jYXRlZ29yaWVzID0gcmVzdWx0Q29zdEhlYWQuY2F0ZWdvcmllcztcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY2xvbmVkQ29zdEhlYWQuY2F0ZWdvcmllcyA9IHJlc3VsdENvc3RIZWFkLmNhdGVnb3JpZXM7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2xvbmVkQ29zdEhlYWREZXRhaWxzLnB1c2goY2xvbmVkQ29zdEhlYWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgdXBkYXRlQnVpbGRpbmdDb3N0SGVhZHMgPSB7J2Nvc3RIZWFkcycgOiBjbG9uZWRDb3N0SGVhZERldGFpbHN9O1xyXG4gICAgICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIHVwZGF0ZUJ1aWxkaW5nQ29zdEhlYWRzLHtuZXc6IHRydWV9LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZmluZE9uZUFuZFVwZGF0ZSBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTogcmVzdWx0LCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0QnVpbGRpbmdCeUlkKHByb2plY3RJZCA6IHN0cmluZywgYnVpbGRpbmdJZCA6IHN0cmluZywgdXNlcjogVXNlciwgY2FsbGJhY2s6KGVycm9yOiBhbnksIHJlc3VsdDogYW55KT0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGdldEJ1aWxkaW5nIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZEJ5SWQoYnVpbGRpbmdJZCwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZmluZEJ5SWQgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTogcmVzdWx0LCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0QnVpbGRpbmdSYXRlSXRlbXNCeU9yaWdpbmFsTmFtZShwcm9qZWN0SWQ6IHN0cmluZywgYnVpbGRpbmdJZDogc3RyaW5nLCBvcmlnaW5hbFJhdGVJdGVtTmFtZTogc3RyaW5nLCB1c2VyOiBVc2VyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbGV0IHByb2plY3Rpb24gPSB7J3JhdGVzJzoxLCBfaWQ6IDB9O1xyXG4gICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZEJ5SWRXaXRoUHJvamVjdGlvbihidWlsZGluZ0lkLCBwcm9qZWN0aW9uLCAoZXJyb3IsIGJ1aWxkaW5nKSA9PiB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IFNlcnZpY2UsIGdldEJ1aWxkaW5nUmF0ZUl0ZW1zQnlPcmlnaW5hbE5hbWUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgYnVpbGRpbmdSYXRlSXRlbXNBcnJheSA9IGJ1aWxkaW5nLnJhdGVzO1xyXG4gICAgICAgIGxldCBjZW50cmFsaXplZFJhdGVJdGVtc0FycmF5ID0gdGhpcy5nZXRSYXRlSXRlbXNBcnJheShidWlsZGluZ1JhdGVJdGVtc0FycmF5LCBvcmlnaW5hbFJhdGVJdGVtTmFtZSk7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCx7IGRhdGE6IGNlbnRyYWxpemVkUmF0ZUl0ZW1zQXJyYXksIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRSYXRlSXRlbXNBcnJheShvcmlnaW5hbFJhdGVJdGVtc0FycmF5OiBBcnJheTxDZW50cmFsaXplZFJhdGU+LCBvcmlnaW5hbFJhdGVJdGVtTmFtZTogc3RyaW5nKSB7XHJcblxyXG4gICAgbGV0IGNlbnRyYWxpemVkUmF0ZUl0ZW1zQXJyYXk6IEFycmF5PENlbnRyYWxpemVkUmF0ZT47XHJcbiAgICBjZW50cmFsaXplZFJhdGVJdGVtc0FycmF5ID0gYWxhc3FsKCdTRUxFQ1QgKiBGUk9NID8gd2hlcmUgVFJJTShvcmlnaW5hbEl0ZW1OYW1lKSA9ID8nLCBbb3JpZ2luYWxSYXRlSXRlbXNBcnJheSwgb3JpZ2luYWxSYXRlSXRlbU5hbWVdKTtcclxuICAgIHJldHVybiBjZW50cmFsaXplZFJhdGVJdGVtc0FycmF5O1xyXG4gIH1cclxuXHJcbiAgZ2V0UHJvamVjdFJhdGVJdGVtc0J5T3JpZ2luYWxOYW1lKHByb2plY3RJZDogc3RyaW5nLCBvcmlnaW5hbFJhdGVJdGVtTmFtZTogc3RyaW5nLCB1c2VyOiBVc2VyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgIGxldCBwcm9qZWN0aW9uID0geydyYXRlcyc6MSwgX2lkOiAwfTtcclxuICAgIHRoaXMucHJvamVjdFJlcG9zaXRvcnkuZmluZEJ5SWRXaXRoUHJvamVjdGlvbihwcm9qZWN0SWQsIHByb2plY3Rpb24sIChlcnJvciwgcHJvamVjdCkgPT4ge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBTZXJ2aWNlLCBnZXRQcm9qZWN0UmF0ZUl0ZW1zQnlPcmlnaW5hbE5hbWUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgcHJvamVjdFJhdGVJdGVtc0FycmF5ID0gcHJvamVjdC5yYXRlcztcclxuICAgICAgICBsZXQgY2VudHJhbGl6ZWRSYXRlSXRlbXNBcnJheSA9IHRoaXMuZ2V0UmF0ZUl0ZW1zQXJyYXkocHJvamVjdFJhdGVJdGVtc0FycmF5LCBvcmlnaW5hbFJhdGVJdGVtTmFtZSk7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCx7IGRhdGE6IGNlbnRyYWxpemVkUmF0ZUl0ZW1zQXJyYXksIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRJbkFjdGl2ZUNvc3RIZWFkKHByb2plY3RJZDogc3RyaW5nLCBidWlsZGluZ0lkOiBzdHJpbmcsIHVzZXI6IFVzZXIsIGNhbGxiYWNrOihlcnJvcjogYW55LCByZXN1bHQ6IGFueSk9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBnZXRJbkFjdGl2ZUNvc3RIZWFkIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZEJ5SWQoYnVpbGRpbmdJZCwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGZpbmRCeUlkIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICAgIGxvZ2dlci5kZWJ1ZygnZ2V0dGluZyBJbkFjdGl2ZSBDb3N0SGVhZCBmb3IgQnVpbGRpbmcgTmFtZSA6ICcrcmVzdWx0Lm5hbWUpO1xyXG4gICAgICAgIGxldCByZXNwb25zZSA9IHJlc3VsdC5jb3N0SGVhZHM7XHJcbiAgICAgICAgbGV0IGluQWN0aXZlQ29zdEhlYWQ9W107XHJcbiAgICAgICAgZm9yKGxldCBjb3N0SGVhZEl0ZW0gb2YgcmVzcG9uc2UpIHtcclxuICAgICAgICAgIGlmKCFjb3N0SGVhZEl0ZW0uYWN0aXZlKSB7XHJcbiAgICAgICAgICAgIGluQWN0aXZlQ29zdEhlYWQucHVzaChjb3N0SGVhZEl0ZW0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjYWxsYmFjayhudWxsLHtkYXRhOmluQWN0aXZlQ29zdEhlYWQsIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRJbkFjdGl2ZVdvcmtJdGVtc09mQnVpbGRpbmdDb3N0SGVhZHMocHJvamVjdElkOnN0cmluZywgYnVpbGRpbmdJZDpzdHJpbmcsIGNvc3RIZWFkSWQ6bnVtYmVyLCBjYXRlZ29yeUlkOm51bWJlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcjpVc2VyLCBjYWxsYmFjazooZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpPT4gdm9pZCkge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgYWRkIFdvcmtpdGVtIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZEJ5SWQoYnVpbGRpbmdJZCwgKGVycm9yLCBidWlsZGluZzpCdWlsZGluZykgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IGNvc3RIZWFkTGlzdCA9IGJ1aWxkaW5nLmNvc3RIZWFkcztcclxuICAgICAgICBsZXQgaW5BY3RpdmVXb3JrSXRlbXMgOiBBcnJheTxXb3JrSXRlbT4gPSBuZXcgQXJyYXk8V29ya0l0ZW0+KCk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGNvc3RIZWFkRGF0YSBvZiBjb3N0SGVhZExpc3QpIHtcclxuICAgICAgICAgIGlmIChjb3N0SGVhZElkID09PSBjb3N0SGVhZERhdGEucmF0ZUFuYWx5c2lzSWQpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgY2F0ZWdvcnlEYXRhIG9mIGNvc3RIZWFkRGF0YS5jYXRlZ29yaWVzKSB7XHJcbiAgICAgICAgICAgICAgaWYgKGNhdGVnb3J5SWQgPT09IGNhdGVnb3J5RGF0YS5yYXRlQW5hbHlzaXNJZCkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgd29ya0l0ZW1EYXRhIG9mIGNhdGVnb3J5RGF0YS53b3JrSXRlbXMpIHtcclxuICAgICAgICAgICAgICAgICAgaWYoIXdvcmtJdGVtRGF0YS5hY3RpdmUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbkFjdGl2ZVdvcmtJdGVtcy5wdXNoKHdvcmtJdGVtRGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGluQWN0aXZlV29ya0l0ZW1zTGlzdFdpdGhCdWlsZGluZ1JhdGVzID0gdGhpcy5nZXRXb3JrSXRlbUxpc3RXaXRoQ2VudHJhbGl6ZWRSYXRlcyhpbkFjdGl2ZVdvcmtJdGVtcywgYnVpbGRpbmcucmF0ZXMsIGZhbHNlKTtcclxuICAgICAgICBjYWxsYmFjayhudWxsLHtkYXRhOmluQWN0aXZlV29ya0l0ZW1zTGlzdFdpdGhCdWlsZGluZ1JhdGVzLCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvLyBHZXQgSW4gQWN0aXZlIFdvcmtJdGVtcyBPZiBQcm9qZWN0IENvc3QgSGVhZHNcclxuICBnZXRJbkFjdGl2ZVdvcmtJdGVtc09mUHJvamVjdENvc3RIZWFkcyhwcm9qZWN0SWQ6c3RyaW5nLCBjb3N0SGVhZElkOm51bWJlciwgY2F0ZWdvcnlJZDpudW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcjpVc2VyLCBjYWxsYmFjazooZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpPT4gdm9pZCkge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgR2V0IEluLUFjdGl2ZSBXb3JrSXRlbXMgT2YgUHJvamVjdCBDb3N0IEhlYWRzIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgdGhpcy5wcm9qZWN0UmVwb3NpdG9yeS5maW5kQnlJZChwcm9qZWN0SWQsIChlcnJvciwgcHJvamVjdDpQcm9qZWN0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgY29zdEhlYWRMaXN0ID0gcHJvamVjdC5wcm9qZWN0Q29zdEhlYWRzO1xyXG4gICAgICAgIGxldCBpbkFjdGl2ZVdvcmtJdGVtcyA6IEFycmF5PFdvcmtJdGVtPiA9IG5ldyBBcnJheTxXb3JrSXRlbT4oKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgY29zdEhlYWREYXRhIG9mIGNvc3RIZWFkTGlzdCkge1xyXG4gICAgICAgICAgaWYgKGNvc3RIZWFkSWQgPT09IGNvc3RIZWFkRGF0YS5yYXRlQW5hbHlzaXNJZCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBjYXRlZ29yeURhdGEgb2YgY29zdEhlYWREYXRhLmNhdGVnb3JpZXMpIHtcclxuICAgICAgICAgICAgICBpZiAoY2F0ZWdvcnlJZCA9PT0gY2F0ZWdvcnlEYXRhLnJhdGVBbmFseXNpc0lkKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB3b3JrSXRlbURhdGEgb2YgY2F0ZWdvcnlEYXRhLndvcmtJdGVtcykge1xyXG4gICAgICAgICAgICAgICAgICBpZighd29ya0l0ZW1EYXRhLmFjdGl2ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGluQWN0aXZlV29ya0l0ZW1zLnB1c2god29ya0l0ZW1EYXRhKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgaW5BY3RpdmVXb3JrSXRlbXNMaXN0V2l0aFByb2plY3RSYXRlcyA9IHRoaXMuZ2V0V29ya0l0ZW1MaXN0V2l0aENlbnRyYWxpemVkUmF0ZXMoaW5BY3RpdmVXb3JrSXRlbXMsIHByb2plY3QucmF0ZXMsIGZhbHNlKTtcclxuICAgICAgICBjYWxsYmFjayhudWxsLHtkYXRhOmluQWN0aXZlV29ya0l0ZW1zTGlzdFdpdGhQcm9qZWN0UmF0ZXMsIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRCdWlsZGluZ0J5SWRGb3JDbG9uZShwcm9qZWN0SWQgOiBzdHJpbmcsIGJ1aWxkaW5nSWQgOiBzdHJpbmcsIHVzZXI6IFVzZXIsIGNhbGxiYWNrOihlcnJvcjogYW55LCByZXN1bHQ6IGFueSk9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBnZXRDbG9uZWRCdWlsZGluZyBoYXMgYmVlbiBoaXQnKTtcclxuICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmZpbmRCeUlkKGJ1aWxkaW5nSWQsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGZpbmRCeUlkIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IGNsb25lZEJ1aWxkaW5nID0gcmVzdWx0LmNvc3RIZWFkcztcclxuICAgICAgICBsZXQgYnVpbGRpbmcgPSBuZXcgQnVpbGRpbmdNb2RlbCgpO1xyXG4gICAgICAgIGJ1aWxkaW5nLm5hbWUgPSByZXN1bHQubmFtZTtcclxuICAgICAgICBidWlsZGluZy50b3RhbFNsYWJBcmVhID0gcmVzdWx0LnRvdGFsU2xhYkFyZWE7XHJcbiAgICAgICAgYnVpbGRpbmcudG90YWxDYXJwZXRBcmVhT2ZVbml0ID0gcmVzdWx0LnRvdGFsQ2FycGV0QXJlYU9mVW5pdDtcclxuICAgICAgICBidWlsZGluZy50b3RhbFNhbGVhYmxlQXJlYU9mVW5pdCA9IHJlc3VsdC50b3RhbFNhbGVhYmxlQXJlYU9mVW5pdDtcclxuICAgICAgICBidWlsZGluZy5wbGludGhBcmVhID0gcmVzdWx0LnBsaW50aEFyZWE7XHJcbiAgICAgICAgYnVpbGRpbmcudG90YWxOdW1PZkZsb29ycyA9IHJlc3VsdC50b3RhbE51bU9mRmxvb3JzO1xyXG4gICAgICAgIGJ1aWxkaW5nLm51bU9mUGFya2luZ0Zsb29ycyA9IHJlc3VsdC5udW1PZlBhcmtpbmdGbG9vcnM7XHJcbiAgICAgICAgYnVpbGRpbmcuY2FycGV0QXJlYU9mUGFya2luZyA9IHJlc3VsdC5jYXJwZXRBcmVhT2ZQYXJraW5nO1xyXG4gICAgICAgIGJ1aWxkaW5nLm51bU9mT25lQkhLID0gcmVzdWx0Lm51bU9mT25lQkhLO1xyXG4gICAgICAgIGJ1aWxkaW5nLm51bU9mVHdvQkhLID0gcmVzdWx0Lm51bU9mVHdvQkhLO1xyXG4gICAgICAgIGJ1aWxkaW5nLm51bU9mVGhyZWVCSEsgPSByZXN1bHQubnVtT2ZUaHJlZUJISztcclxuICAgICAgICBidWlsZGluZy5udW1PZkZvdXJCSEsgPSByZXN1bHQubnVtT2ZGb3VyQkhLO1xyXG4gICAgICAgIGJ1aWxkaW5nLm51bU9mRml2ZUJISyA9IHJlc3VsdC5udW1PZkZpdmVCSEs7XHJcbiAgICAgICAgYnVpbGRpbmcubnVtT2ZMaWZ0cyA9IHJlc3VsdC5udW1PZkxpZnRzO1xyXG5cclxuICAgICAgICAvKmxldCBjbG9uZWRDb3N0SGVhZEFycmF5IDogQXJyYXk8Q2xvbmVkQ29zdEhlYWQ+ID0gW107XHJcblxyXG4gICAgICAgIGZvcihsZXQgY29zdEhlYWRJbmRleCA9IDA7IGNvc3RIZWFkSW5kZXggPCBjbG9uZWRCdWlsZGluZy5sZW5ndGg7IGNvc3RIZWFkSW5kZXgrKykge1xyXG5cclxuICAgICAgICAgIGxldCBjbG9uZWRDb3N0SGVhZCA9IG5ldyBDbG9uZWRDb3N0SGVhZDtcclxuICAgICAgICAgIGNsb25lZENvc3RIZWFkLm5hbWUgPSBjbG9uZWRCdWlsZGluZ1tjb3N0SGVhZEluZGV4XS5uYW1lO1xyXG4gICAgICAgICAgY2xvbmVkQ29zdEhlYWQucmF0ZUFuYWx5c2lzSWQgPSBjbG9uZWRCdWlsZGluZ1tjb3N0SGVhZEluZGV4XS5yYXRlQW5hbHlzaXNJZDtcclxuICAgICAgICAgIGNsb25lZENvc3RIZWFkLmFjdGl2ZSA9IGNsb25lZEJ1aWxkaW5nW2Nvc3RIZWFkSW5kZXhdLmFjdGl2ZTtcclxuICAgICAgICAgIGNsb25lZENvc3RIZWFkLmJ1ZGdldGVkQ29zdEFtb3VudCA9IGNsb25lZEJ1aWxkaW5nW2Nvc3RIZWFkSW5kZXhdLmJ1ZGdldGVkQ29zdEFtb3VudDtcclxuXHJcbiAgICAgICAgICBsZXQgY2xvbmVkV29ya0l0ZW1BcnJheSA6IEFycmF5PENsb25lZFdvcmtJdGVtPiA9IFtdO1xyXG4gICAgICAgICAgbGV0IGNsb25lZENhdGVnb3J5QXJyYXkgOiBBcnJheTxDbG9uZWRDYXRlZ29yeT4gPSBbXTtcclxuICAgICAgICAgIGxldCBjYXRlZ29yeUFycmF5ID0gY2xvbmVkQnVpbGRpbmdbY29zdEhlYWRJbmRleF0uY2F0ZWdvcmllcztcclxuXHJcbiAgICAgICAgICBmb3IobGV0IGNhdGVnb3J5SW5kZXg9MDsgY2F0ZWdvcnlJbmRleDxjYXRlZ29yeUFycmF5Lmxlbmd0aDsgY2F0ZWdvcnlJbmRleCsrKSB7XHJcbiAgICAgICAgICAgIGxldCBjbG9uZWRDYXRlZ29yeSA9IG5ldyBDbG9uZWRDYXRlZ29yeSgpO1xyXG4gICAgICAgICAgICBjbG9uZWRDYXRlZ29yeS5uYW1lID0gY2F0ZWdvcnlBcnJheVtjYXRlZ29yeUluZGV4XS5uYW1lO1xyXG4gICAgICAgICAgICBjbG9uZWRDYXRlZ29yeS5yYXRlQW5hbHlzaXNJZCA9IGNhdGVnb3J5QXJyYXlbY2F0ZWdvcnlJbmRleF0ucmF0ZUFuYWx5c2lzSWQ7XHJcbiAgICAgICAgICAgIGNsb25lZENhdGVnb3J5LmFtb3VudCA9IGNhdGVnb3J5QXJyYXlbY2F0ZWdvcnlJbmRleF0uYW1vdW50O1xyXG4gICAgICAgICAgICBjbG9uZWRDYXRlZ29yeS5hY3RpdmUgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgbGV0IHdvcmtpdGVtQXJyYXkgPSBjYXRlZ29yeUFycmF5W2NhdGVnb3J5SW5kZXhdLndvcmtJdGVtcztcclxuICAgICAgICAgICAgZm9yKGxldCB3b3JraXRlbUluZGV4PTA7IHdvcmtpdGVtSW5kZXg8IHdvcmtpdGVtQXJyYXkubGVuZ3RoOyB3b3JraXRlbUluZGV4KyspIHtcclxuICAgICAgICAgICAgICBsZXQgY2xvbmVkV29ya0l0ZW0gPSBuZXcgQ2xvbmVkV29ya0l0ZW0oKTtcclxuICAgICAgICAgICAgICBjbG9uZWRXb3JrSXRlbS5uYW1lID0gd29ya2l0ZW1BcnJheVt3b3JraXRlbUluZGV4XS5uYW1lO1xyXG4gICAgICAgICAgICAgIGNsb25lZFdvcmtJdGVtLnJhdGVBbmFseXNpc0lkID0gIHdvcmtpdGVtQXJyYXlbd29ya2l0ZW1JbmRleF0ucmF0ZUFuYWx5c2lzSWQ7XHJcbiAgICAgICAgICAgICAgY2xvbmVkV29ya0l0ZW0udW5pdCA9ICB3b3JraXRlbUFycmF5W3dvcmtpdGVtSW5kZXhdLnVuaXQ7XHJcbiAgICAgICAgICAgICAgY2xvbmVkV29ya0l0ZW0uYW1vdW50ID0gd29ya2l0ZW1BcnJheVt3b3JraXRlbUluZGV4XS5hbW91bnQ7XHJcbiAgICAgICAgICAgICAgY2xvbmVkV29ya0l0ZW0ucmF0ZSA9IHdvcmtpdGVtQXJyYXlbd29ya2l0ZW1JbmRleF0ucmF0ZTtcclxuICAgICAgICAgICAgICBjbG9uZWRXb3JrSXRlbS5xdWFudGl0eSA9IHdvcmtpdGVtQXJyYXlbd29ya2l0ZW1JbmRleF0ucXVhbnRpdHk7XHJcbiAgICAgICAgICAgICAgY2xvbmVkV29ya0l0ZW1BcnJheS5wdXNoKGNsb25lZFdvcmtJdGVtKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjbG9uZWRDYXRlZ29yeS53b3JrSXRlbXMgPSBjbG9uZWRXb3JrSXRlbUFycmF5O1xyXG4gICAgICAgICAgICBjbG9uZWRDYXRlZ29yeUFycmF5LnB1c2goY2xvbmVkQ2F0ZWdvcnkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY2xvbmVkQ29zdEhlYWQuY2F0ZWdvcmllcyA9IGNsb25lZENhdGVnb3J5QXJyYXk7XHJcbiAgICAgICAgICBjbG9uZWRDb3N0SGVhZEFycmF5LnB1c2goY2xvbmVkQ29zdEhlYWQpO1xyXG4gICAgICAgIH0qL1xyXG4gICAgICAgIGJ1aWxkaW5nLmNvc3RIZWFkcyA9IHJlc3VsdC5jb3N0SGVhZHM7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGE6IGJ1aWxkaW5nLCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZGVsZXRlQnVpbGRpbmdCeUlkKHByb2plY3RJZDpzdHJpbmcsIGJ1aWxkaW5nSWQ6c3RyaW5nLCB1c2VyOlVzZXIsIGNhbGxiYWNrOihlcnJvcjogYW55LCByZXN1bHQ6IGFueSk9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBkZWxldGVCdWlsZGluZyBoYXMgYmVlbiBoaXQnKTtcclxuICAgIGxldCBwb3BCdWlsZGluZ0lkID0gYnVpbGRpbmdJZDtcclxuICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmRlbGV0ZShidWlsZGluZ0lkLCAoZXJyb3IsIHJlc3VsdCk9PiB7XHJcbiAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCBxdWVyeSA9IHtfaWQ6IHByb2plY3RJZH07XHJcbiAgICAgICAgbGV0IG5ld0RhdGEgPSB7ICRwdWxsOiB7YnVpbGRpbmdzIDogcG9wQnVpbGRpbmdJZH19O1xyXG4gICAgICAgIHRoaXMucHJvamVjdFJlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgbmV3RGF0YSwge25ldzogdHJ1ZX0sIChlcnJvciwgc3RhdHVzKT0+IHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGZpbmRPbmVBbmRVcGRhdGUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTogc3RhdHVzLCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0UmF0ZShwcm9qZWN0SWQ6c3RyaW5nLCBidWlsZGluZ0lkOnN0cmluZywgY29zdEhlYWRJZDpudW1iZXIsY2F0ZWdvcnlJZDpudW1iZXIsIHdvcmtJdGVtSWQ6bnVtYmVyLCB1c2VyIDogVXNlcixcclxuICAgICAgICAgIGNhbGxiYWNrOihlcnJvcjogYW55LCByZXN1bHQ6IGFueSk9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBnZXRSYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG5cclxuICAgIGxldCByYXRlQW5hbHlzaXNTZXJ2aWNlczogUmF0ZUFuYWx5c2lzU2VydmljZSA9IG5ldyBSYXRlQW5hbHlzaXNTZXJ2aWNlKCk7XHJcbiAgICByYXRlQW5hbHlzaXNTZXJ2aWNlcy5nZXRSYXRlKHdvcmtJdGVtSWQsIChlcnJvciwgcmF0ZURhdGEpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCByYXRlIDpSYXRlID0gbmV3IFJhdGUoKTtcclxuICAgICAgICByYXRlLnJhdGVJdGVtcyA9IHJhdGVEYXRhO1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiByYXRlRGF0YSwgYWNjZXNzX3Rva2VuOiB0aGlzLmF1dGhJbnRlcmNlcHRvci5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKX0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZVJhdGVPZkJ1aWxkaW5nQ29zdEhlYWRzKHByb2plY3RJZDpzdHJpbmcsIGJ1aWxkaW5nSWQ6c3RyaW5nLCBjb3N0SGVhZElkOm51bWJlciwgY2F0ZWdvcnlJZDpudW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd29ya0l0ZW1JZDpudW1iZXIsIHJhdGUgOlJhdGUsIHVzZXIgOiBVc2VyLCBjYWxsYmFjazooZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpPT4gdm9pZCkge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgdXBkYXRlUmF0ZU9mQnVpbGRpbmdDb3N0SGVhZHMgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICB0aGlzLmJ1aWxkaW5nUmVwb3NpdG9yeS5maW5kQnlJZChidWlsZGluZ0lkLCAoZXJyb3IsIGJ1aWxkaW5nOkJ1aWxkaW5nKSA9PiB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGZpbmRCeUlkIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IGNvc3RIZWFkcyA9IGJ1aWxkaW5nLmNvc3RIZWFkcztcclxuICAgICAgICBsZXQgY2VudHJhbGl6ZWRSYXRlcyA9IGJ1aWxkaW5nLnJhdGVzO1xyXG4gICAgICAgIGZvcihsZXQgY29zdEhlYWREYXRhIG9mIGNvc3RIZWFkcykge1xyXG4gICAgICAgICAgaWYoY29zdEhlYWREYXRhLnJhdGVBbmFseXNpc0lkID09PSBjb3N0SGVhZElkKSB7XHJcbiAgICAgICAgICAgIGZvcihsZXQgY2F0ZWdvcnlEYXRhIG9mIGNvc3RIZWFkRGF0YS5jYXRlZ29yaWVzKSB7XHJcbiAgICAgICAgICAgICAgaWYgKGNhdGVnb3J5RGF0YS5yYXRlQW5hbHlzaXNJZCA9PT0gY2F0ZWdvcnlJZCkge1xyXG4gICAgICAgICAgICAgICAgZm9yKGxldCB3b3JrSXRlbURhdGEgb2YgY2F0ZWdvcnlEYXRhLndvcmtJdGVtcykge1xyXG4gICAgICAgICAgICAgICAgICBpZiAod29ya0l0ZW1EYXRhLnJhdGVBbmFseXNpc0lkID09PSB3b3JrSXRlbUlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd29ya0l0ZW1EYXRhLnJhdGU9cmF0ZTtcclxuICAgICAgICAgICAgICAgICAgICB3b3JrSXRlbURhdGEucmF0ZS5pc0VzdGltYXRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHF1ZXJ5ID0geydfaWQnIDogYnVpbGRpbmdJZH07XHJcbiAgICAgICAgbGV0IG5ld0RhdGEgPSB7ICRzZXQgOiB7J2Nvc3RIZWFkcycgOiBjb3N0SGVhZHN9fTtcclxuXHJcbiAgICAgICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgbmV3RGF0YSx7bmV3OiB0cnVlfSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZihyZXN1bHQpIHtcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnYnVpbGRpbmcgQ29zdEhlYWRzIFVwZGF0ZWQnKTtcclxuXHJcbiAgICAgICAgICAgICAgbGV0IHJhdGVJdGVtcyA9IHJhdGUucmF0ZUl0ZW1zO1xyXG4gICAgICAgICAgICAgIGxldCBwcm9taXNlQXJyYXlGb3JVcGRhdGVCdWlsZGluZ0NlbnRyYWxpemVkUmF0ZXMgPVtdO1xyXG5cclxuICAgICAgICAgICAgICBmb3IobGV0IHJhdGUgb2YgcmF0ZUl0ZW1zKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHJhdGVPYmplY3RFeGlzdFNRTCA9IFwiU0VMRUNUICogRlJPTSA/IEFTIHJhdGVzIFdIRVJFIHJhdGVzLml0ZW1OYW1lPSAnXCIrcmF0ZS5pdGVtTmFtZStcIidcIjtcclxuICAgICAgICAgICAgICAgIGxldCByYXRlRXhpc3RBcnJheSA9IGFsYXNxbChyYXRlT2JqZWN0RXhpc3RTUUwsW2NlbnRyYWxpemVkUmF0ZXNdKTtcclxuICAgICAgICAgICAgICAgIGlmKHJhdGVFeGlzdEFycmF5Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgaWYocmF0ZUV4aXN0QXJyYXlbMF0ucmF0ZSAhPT0gcmF0ZS5yYXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy91cGRhdGUgcmF0ZSBvZiByYXRlSXRlbVxyXG4gICAgICAgICAgICAgICAgICAgIGxldCB1cGRhdGVSYXRlUHJvbWlzZSA9IHRoaXMudXBkYXRlQ2VudHJhbGl6ZWRSYXRlRm9yQnVpbGRpbmcoYnVpbGRpbmdJZCwgcmF0ZS5pdGVtTmFtZSwgcmF0ZS5yYXRlKTtcclxuICAgICAgICAgICAgICAgICAgICBwcm9taXNlQXJyYXlGb3JVcGRhdGVCdWlsZGluZ0NlbnRyYWxpemVkUmF0ZXMucHVzaCh1cGRhdGVSYXRlUHJvbWlzZSk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIC8vY3JlYXRlIG5ldyByYXRlSXRlbVxyXG4gICAgICAgICAgICAgICAgICBsZXQgcmF0ZUl0ZW0gOiBDZW50cmFsaXplZFJhdGUgPSBuZXcgQ2VudHJhbGl6ZWRSYXRlKHJhdGUuaXRlbU5hbWUscmF0ZS5vcmlnaW5hbEl0ZW1OYW1lLCByYXRlLnJhdGUpO1xyXG4gICAgICAgICAgICAgICAgICBsZXQgYWRkTmV3UmF0ZUl0ZW1Qcm9taXNlID0gdGhpcy5hZGROZXdDZW50cmFsaXplZFJhdGVGb3JCdWlsZGluZyhidWlsZGluZ0lkLCByYXRlSXRlbSk7XHJcbiAgICAgICAgICAgICAgICAgIHByb21pc2VBcnJheUZvclVwZGF0ZUJ1aWxkaW5nQ2VudHJhbGl6ZWRSYXRlcy5wdXNoKGFkZE5ld1JhdGVJdGVtUHJvbWlzZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICBpZihwcm9taXNlQXJyYXlGb3JVcGRhdGVCdWlsZGluZ0NlbnRyYWxpemVkUmF0ZXMubGVuZ3RoICE9PSAwKXtcclxuICAgICAgICAgICAgICAgIENDUHJvbWlzZS5hbGwocHJvbWlzZUFycmF5Rm9yVXBkYXRlQnVpbGRpbmdDZW50cmFsaXplZFJhdGVzKS50aGVuKGZ1bmN0aW9uKGRhdGE6IEFycmF5PGFueT4pIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdSYXRlcyBBcnJheSB1cGRhdGVkIDogJytKU09OLnN0cmluZ2lmeShjZW50cmFsaXplZFJhdGVzKSk7XHJcbiAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHsgJ2RhdGEnIDogJ3N1Y2Nlc3MnIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGU6YW55KSB7XHJcbiAgICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcignIFByb21pc2UgZmFpbGVkIGZvciBjb252ZXJ0Q29zdEhlYWRzRnJvbVJhdGVBbmFseXNpc1RvQ29zdENvbnRyb2wgISA6JyArSlNPTi5zdHJpbmdpZnkoZSkpO1xyXG4gICAgICAgICAgICAgICAgICBDQ1Byb21pc2UucmVqZWN0KGUpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHsgJ2RhdGEnIDogJ3N1Y2Nlc3MnIH0pO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vVXBkYXRlIHJhdGUgb2YgcHJvamVjdCBjb3N0IGhlYWRzXHJcbiAgdXBkYXRlUmF0ZU9mUHJvamVjdENvc3RIZWFkcyhwcm9qZWN0SWQ6c3RyaW5nLCBjb3N0SGVhZElkOm51bWJlcixjYXRlZ29yeUlkOm51bWJlcixcclxuICAgICAgICAgICAgIHdvcmtJdGVtSWQ6bnVtYmVyLCByYXRlIDpSYXRlLCB1c2VyIDogVXNlciwgY2FsbGJhY2s6KGVycm9yOiBhbnksIHJlc3VsdDogYW55KT0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIFVwZGF0ZSByYXRlIG9mIHByb2plY3QgY29zdCBoZWFkcyBoYXMgYmVlbiBoaXQnKTtcclxuICAgIHRoaXMucHJvamVjdFJlcG9zaXRvcnkuZmluZEJ5SWQocHJvamVjdElkLCAoZXJyb3IsIHByb2plY3QgOiBQcm9qZWN0KSA9PiB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGZpbmRCeUlkIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IHByb2plY3RDb3N0SGVhZHMgPSBwcm9qZWN0LnByb2plY3RDb3N0SGVhZHM7XHJcbiAgICAgICAgbGV0IGNlbnRyYWxpemVkUmF0ZXNPZlByb2plY3RzID0gcHJvamVjdC5yYXRlcztcclxuICAgICAgICBmb3IobGV0IGNvc3RIZWFkRGF0YSBvZiBwcm9qZWN0Q29zdEhlYWRzKSB7XHJcbiAgICAgICAgICBpZihjb3N0SGVhZERhdGEucmF0ZUFuYWx5c2lzSWQgPT09IGNvc3RIZWFkSWQpIHtcclxuICAgICAgICAgICAgZm9yKGxldCBjYXRlZ29yeURhdGEgb2YgY29zdEhlYWREYXRhLmNhdGVnb3JpZXMpIHtcclxuICAgICAgICAgICAgICBpZiAoY2F0ZWdvcnlEYXRhLnJhdGVBbmFseXNpc0lkID09PSBjYXRlZ29yeUlkKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IobGV0IHdvcmtJdGVtRGF0YSBvZiBjYXRlZ29yeURhdGEud29ya0l0ZW1zKSB7XHJcbiAgICAgICAgICAgICAgICAgIGlmICh3b3JrSXRlbURhdGEucmF0ZUFuYWx5c2lzSWQgPT09IHdvcmtJdGVtSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB3b3JrSXRlbURhdGEucmF0ZT1yYXRlO1xyXG4gICAgICAgICAgICAgICAgICAgIHdvcmtJdGVtRGF0YS5yYXRlLmlzRXN0aW1hdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcXVlcnkgPSB7J19pZCcgOiBwcm9qZWN0SWR9O1xyXG4gICAgICAgIGxldCBuZXdEYXRhID0geyAkc2V0IDogeydwcm9qZWN0Q29zdEhlYWRzJyA6IHByb2plY3RDb3N0SGVhZHN9fTtcclxuICAgICAgICB0aGlzLnByb2plY3RSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIG5ld0RhdGEse25ldzogdHJ1ZX0sIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIGxldCByYXRlSXRlbXMgPSByYXRlLnJhdGVJdGVtcztcclxuICAgICAgICAgICAgbGV0IHByb21pc2VBcnJheUZvclByb2plY3RDZW50cmFsaXplZFJhdGVzID1bXTtcclxuXHJcbiAgICAgICAgICAgIGZvcihsZXQgcmF0ZSBvZiByYXRlSXRlbXMpIHtcclxuXHJcbiAgICAgICAgICAgICAgbGV0IHJhdGVPYmplY3RFeGlzdFNRTCA9IFwiU0VMRUNUICogRlJPTSA/IEFTIHJhdGVzIFdIRVJFIHJhdGVzLml0ZW1OYW1lPSAnXCIrcmF0ZS5pdGVtTmFtZStcIidcIjtcclxuICAgICAgICAgICAgICBsZXQgcmF0ZUV4aXN0QXJyYXkgPSBhbGFzcWwocmF0ZU9iamVjdEV4aXN0U1FMLFtjZW50cmFsaXplZFJhdGVzT2ZQcm9qZWN0c10pO1xyXG4gICAgICAgICAgICAgIGlmKHJhdGVFeGlzdEFycmF5Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIGlmKHJhdGVFeGlzdEFycmF5WzBdLnJhdGUgIT09IHJhdGUucmF0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAvL3VwZGF0ZSByYXRlIG9mIHJhdGVJdGVtXHJcbiAgICAgICAgICAgICAgICAgIGxldCB1cGRhdGVSYXRlT2ZQcm9qZWN0UHJvbWlzZSA9IHRoaXMudXBkYXRlQ2VudHJhbGl6ZWRSYXRlRm9yUHJvamVjdChwcm9qZWN0SWQsIHJhdGUuaXRlbU5hbWUsIHJhdGUucmF0ZSk7XHJcbiAgICAgICAgICAgICAgICAgIHByb21pc2VBcnJheUZvclByb2plY3RDZW50cmFsaXplZFJhdGVzLnB1c2godXBkYXRlUmF0ZU9mUHJvamVjdFByb21pc2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvL2NyZWF0ZSBuZXcgcmF0ZUl0ZW1cclxuICAgICAgICAgICAgICAgIGxldCByYXRlSXRlbSA6IENlbnRyYWxpemVkUmF0ZSA9IG5ldyBDZW50cmFsaXplZFJhdGUocmF0ZS5pdGVtTmFtZSxyYXRlLm9yaWdpbmFsSXRlbU5hbWUsIHJhdGUucmF0ZSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgYWRkTmV3UmF0ZU9mUHJvamVjdFByb21pc2UgPSB0aGlzLmFkZE5ld0NlbnRyYWxpemVkUmF0ZUZvclByb2plY3QocHJvamVjdElkLCByYXRlSXRlbSk7XHJcbiAgICAgICAgICAgICAgICBwcm9taXNlQXJyYXlGb3JQcm9qZWN0Q2VudHJhbGl6ZWRSYXRlcy5wdXNoKGFkZE5ld1JhdGVPZlByb2plY3RQcm9taXNlKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmKHByb21pc2VBcnJheUZvclByb2plY3RDZW50cmFsaXplZFJhdGVzLmxlbmd0aCAhPT0gMCkge1xyXG5cclxuICAgICAgICAgICAgICBDQ1Byb21pc2UuYWxsKHByb21pc2VBcnJheUZvclByb2plY3RDZW50cmFsaXplZFJhdGVzKS50aGVuKGZ1bmN0aW9uKGRhdGE6IEFycmF5PGFueT4pIHtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnUmF0ZXMgQXJyYXkgdXBkYXRlZCA6ICcrSlNPTi5zdHJpbmdpZnkoY2VudHJhbGl6ZWRSYXRlc09mUHJvamVjdHMpKTtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHsgJ2RhdGEnIDogJ3N1Y2Nlc3MnIH0pO1xyXG5cclxuICAgICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbihlOmFueSkge1xyXG4gICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKCcgUHJvbWlzZSBmYWlsZWQgZm9yIGNvbnZlcnRDb3N0SGVhZHNGcm9tUmF0ZUFuYWx5c2lzVG9Db3N0Q29udHJvbCAhIDonICtKU09OLnN0cmluZ2lmeShlKSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgZXJyb3JPYmogPSBuZXcgRXJyb3IoKTtcclxuICAgICAgICAgICAgICAgIGVycm9yT2JqLm1lc3NhZ2UgPSBlO1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3JPYmosIG51bGwpO1xyXG4gICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7ICdkYXRhJyA6ICdzdWNjZXNzJyB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGRlbGV0ZVF1YW50aXR5T2ZCdWlsZGluZ0Nvc3RIZWFkc0J5TmFtZShwcm9qZWN0SWQ6c3RyaW5nLCBidWlsZGluZ0lkOnN0cmluZywgY29zdEhlYWRJZDpudW1iZXIsIGNhdGVnb3J5SWQ6bnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3b3JrSXRlbUlkOm51bWJlciwgaXRlbU5hbWU6c3RyaW5nLCB1c2VyOlVzZXIsIGNhbGxiYWNrOihlcnJvcjogYW55LCByZXN1bHQ6IGFueSk9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBkZWxldGVRdWFudGl0eSBoYXMgYmVlbiBoaXQnKTtcclxuICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmZpbmRCeUlkKGJ1aWxkaW5nSWQsIChlcnJvciwgYnVpbGRpbmc6QnVpbGRpbmcpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCBxdWFudGl0eUl0ZW1zOiBBcnJheTxRdWFudGl0eURldGFpbHM+O1xyXG4gICAgICAgIGZvcihsZXQgY29zdEhlYWQgb2YgYnVpbGRpbmcuY29zdEhlYWRzKSB7XHJcbiAgICAgICAgICBpZihjb3N0SGVhZC5yYXRlQW5hbHlzaXNJZCA9PT0gY29zdEhlYWRJZCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBjYXRlZ29yeSBvZiBjb3N0SGVhZC5jYXRlZ29yaWVzKSB7XHJcbiAgICAgICAgICAgICAgaWYoY2F0ZWdvcnkucmF0ZUFuYWx5c2lzSWQgPT09IGNhdGVnb3J5SWQpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHdvcmtJdGVtIG9mIGNhdGVnb3J5LndvcmtJdGVtcykge1xyXG4gICAgICAgICAgICAgICAgICBpZih3b3JrSXRlbS5yYXRlQW5hbHlzaXNJZCA9PT0gd29ya0l0ZW1JZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHF1YW50aXR5SXRlbXMgPSB3b3JrSXRlbS5xdWFudGl0eS5xdWFudGl0eUl0ZW1EZXRhaWxzO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IHF1YW50aXR5SW5kZXg9MDsgcXVhbnRpdHlJbmRleCA8IHF1YW50aXR5SXRlbXMubGVuZ3RoOyBxdWFudGl0eUluZGV4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgIGlmKHF1YW50aXR5SXRlbXNbcXVhbnRpdHlJbmRleF0ubmFtZSA9PT0gaXRlbU5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcXVhbnRpdHlJdGVtcy5zcGxpY2UocXVhbnRpdHlJbmRleCwxKTtcclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgd29ya0l0ZW0ucXVhbnRpdHkudG90YWwgPSBhbGFzcWwoJ1ZBTFVFIE9GIFNFTEVDVCBTVU0odG90YWwpIEZST00gPycsW3F1YW50aXR5SXRlbXNdKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHF1ZXJ5ID0geyBfaWQgOiBidWlsZGluZ0lkIH07XHJcbiAgICAgICAgbGV0IGRhdGEgPSB7ICRzZXQgOiB7J2Nvc3RIZWFkcycgOiBidWlsZGluZy5jb3N0SGVhZHMgfX07XHJcbiAgICAgICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgZGF0YSx7bmV3OiB0cnVlfSwgKGVycm9yLCBidWlsZGluZykgPT4ge1xyXG4gICAgICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZmluZE9uZUFuZFVwZGF0ZSBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YSA6J3N1Y2Nlc3MnLCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuICAvL0RlbGV0ZSBRdWFudGl0eSBPZiBQcm9qZWN0IENvc3QgSGVhZHMgQnkgTmFtZVxyXG4gIGRlbGV0ZVF1YW50aXR5T2ZQcm9qZWN0Q29zdEhlYWRzQnlOYW1lKHByb2plY3RJZDpzdHJpbmcsIGNvc3RIZWFkSWQ6bnVtYmVyLCBjYXRlZ29yeUlkOm51bWJlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3b3JrSXRlbUlkOm51bWJlciwgaXRlbU5hbWU6c3RyaW5nLCB1c2VyOlVzZXIsIGNhbGxiYWNrOihlcnJvcjogYW55LCByZXN1bHQ6IGFueSk9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBkZWxldGVRdWFudGl0eSBoYXMgYmVlbiBoaXQnKTtcclxuICAgIHRoaXMucHJvamVjdFJlcG9zaXRvcnkuZmluZEJ5SWQocHJvamVjdElkLCAoZXJyb3IsIHByb2plY3Q6UHJvamVjdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IHF1YW50aXR5SXRlbXM6IEFycmF5PFF1YW50aXR5RGV0YWlscz47XHJcbiAgICAgICAgZm9yKGxldCBjb3N0SGVhZCBvZiBwcm9qZWN0LnByb2plY3RDb3N0SGVhZHMpIHtcclxuICAgICAgICAgIGlmKGNvc3RIZWFkLnJhdGVBbmFseXNpc0lkID09PSBjb3N0SGVhZElkKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGNhdGVnb3J5IG9mIGNvc3RIZWFkLmNhdGVnb3JpZXMpIHtcclxuICAgICAgICAgICAgICBpZihjYXRlZ29yeS5yYXRlQW5hbHlzaXNJZCA9PT0gY2F0ZWdvcnlJZCkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgd29ya0l0ZW0gb2YgY2F0ZWdvcnkud29ya0l0ZW1zKSB7XHJcbiAgICAgICAgICAgICAgICAgIGlmKHdvcmtJdGVtLnJhdGVBbmFseXNpc0lkID09PSB3b3JrSXRlbUlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcXVhbnRpdHlJdGVtcyA9IHdvcmtJdGVtLnF1YW50aXR5LnF1YW50aXR5SXRlbURldGFpbHM7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgcXVhbnRpdHlJbmRleD0wOyBxdWFudGl0eUluZGV4IDwgcXVhbnRpdHlJdGVtcy5sZW5ndGg7IHF1YW50aXR5SW5kZXgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgaWYocXVhbnRpdHlJdGVtc1txdWFudGl0eUluZGV4XS5uYW1lID09PSBpdGVtTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBxdWFudGl0eUl0ZW1zLnNwbGljZShxdWFudGl0eUluZGV4LDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB3b3JrSXRlbS5xdWFudGl0eS50b3RhbCA9IGFsYXNxbCgnVkFMVUUgT0YgU0VMRUNUIFNVTSh0b3RhbCkgRlJPTSA/JyxbcXVhbnRpdHlJdGVtc10pO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgcXVlcnkgPSB7IF9pZCA6IHByb2plY3RJZCB9O1xyXG4gICAgICAgIGxldCBkYXRhID0geyAkc2V0IDogeydwcm9qZWN0Q29zdEhlYWRzJyA6IHByb2plY3QucHJvamVjdENvc3RIZWFkcyB9fTtcclxuICAgICAgICB0aGlzLnByb2plY3RSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIGRhdGEse25ldzogdHJ1ZX0sIChlcnJvciwgcHJvamVjdCkgPT4ge1xyXG4gICAgICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZmluZE9uZUFuZFVwZGF0ZSBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YSA6J3N1Y2Nlc3MnLCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcblxyXG4gIGRlbGV0ZVdvcmtpdGVtKHByb2plY3RJZDpzdHJpbmcsIGJ1aWxkaW5nSWQ6c3RyaW5nLCBjb3N0SGVhZElkOm51bWJlciwgY2F0ZWdvcnlJZDpudW1iZXIsIHdvcmtJdGVtSWQ6bnVtYmVyLCB1c2VyOlVzZXIsXHJcbiAgICAgICAgICAgICAgICAgY2FsbGJhY2s6KGVycm9yOiBhbnksIHJlc3VsdDogYW55KT0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGRlbGV0ZSBXb3JraXRlbSBoYXMgYmVlbiBoaXQnKTtcclxuICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmZpbmRCeUlkKGJ1aWxkaW5nSWQsIChlcnJvciwgYnVpbGRpbmc6QnVpbGRpbmcpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCBjb3N0SGVhZExpc3QgPSBidWlsZGluZy5jb3N0SGVhZHM7XHJcbiAgICAgICAgbGV0IGNhdGVnb3J5TGlzdDogQ2F0ZWdvcnlbXTtcclxuICAgICAgICBsZXQgV29ya0l0ZW1MaXN0OiBXb3JrSXRlbVtdO1xyXG4gICAgICAgIHZhciBmbGFnID0gMDtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGNvc3RIZWFkTGlzdC5sZW5ndGg7IGluZGV4KyspIHtcclxuICAgICAgICAgIGlmIChjb3N0SGVhZElkID09PSBjb3N0SGVhZExpc3RbaW5kZXhdLnJhdGVBbmFseXNpc0lkKSB7XHJcbiAgICAgICAgICAgIGNhdGVnb3J5TGlzdCA9IGNvc3RIZWFkTGlzdFtpbmRleF0uY2F0ZWdvcmllcztcclxuICAgICAgICAgICAgZm9yIChsZXQgY2F0ZWdvcnlJbmRleCA9IDA7IGNhdGVnb3J5SW5kZXggPCBjYXRlZ29yeUxpc3QubGVuZ3RoOyBjYXRlZ29yeUluZGV4KyspIHtcclxuICAgICAgICAgICAgICBpZiAoY2F0ZWdvcnlJZCA9PT0gY2F0ZWdvcnlMaXN0W2NhdGVnb3J5SW5kZXhdLnJhdGVBbmFseXNpc0lkKSB7XHJcbiAgICAgICAgICAgICAgICBXb3JrSXRlbUxpc3QgPSBjYXRlZ29yeUxpc3RbY2F0ZWdvcnlJbmRleF0ud29ya0l0ZW1zO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgd29ya2l0ZW1JbmRleCA9IDA7IHdvcmtpdGVtSW5kZXggPCBXb3JrSXRlbUxpc3QubGVuZ3RoOyB3b3JraXRlbUluZGV4KyspIHtcclxuICAgICAgICAgICAgICAgICAgaWYgKHdvcmtJdGVtSWQgPT09IFdvcmtJdGVtTGlzdFt3b3JraXRlbUluZGV4XS5yYXRlQW5hbHlzaXNJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZsYWcgPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgIFdvcmtJdGVtTGlzdC5zcGxpY2Uod29ya2l0ZW1JbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKGZsYWcgPT09IDEpIHtcclxuICAgICAgICAgIGxldCBxdWVyeSA9IHtfaWQ6IGJ1aWxkaW5nSWR9O1xyXG4gICAgICAgICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgYnVpbGRpbmcsIHtuZXc6IHRydWV9LCAoZXJyb3IsIFdvcmtJdGVtTGlzdCkgPT4ge1xyXG4gICAgICAgICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kT25lQW5kVXBkYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgbGV0IG1lc3NhZ2UgPSAnV29ya0l0ZW0gZGVsZXRlZC4nO1xyXG4gICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiBXb3JrSXRlbUxpc3QsIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc2V0Q29zdEhlYWRTdGF0dXMoIGJ1aWxkaW5nSWQgOiBzdHJpbmcsIGNvc3RIZWFkSWQgOiBudW1iZXIsIGNvc3RIZWFkQWN0aXZlU3RhdHVzIDogc3RyaW5nLCB1c2VyOiBVc2VyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxldCBxdWVyeSA9IHsnX2lkJyA6IGJ1aWxkaW5nSWQsICdjb3N0SGVhZHMucmF0ZUFuYWx5c2lzSWQnIDogY29zdEhlYWRJZH07XHJcbiAgICBsZXQgYWN0aXZlU3RhdHVzID0gSlNPTi5wYXJzZShjb3N0SGVhZEFjdGl2ZVN0YXR1cyk7XHJcbiAgICBsZXQgbmV3RGF0YSA9IHsgJHNldCA6IHsnY29zdEhlYWRzLiQuYWN0aXZlJyA6IGFjdGl2ZVN0YXR1c319O1xyXG4gICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgbmV3RGF0YSwge25ldzogdHJ1ZX0sKGVyciwgcmVzcG9uc2UpID0+IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZmluZE9uZUFuZFVwZGF0ZSBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgaWYoZXJyKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTogcmVzcG9uc2UsIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVXb3JrSXRlbVN0YXR1c09mQnVpbGRpbmdDb3N0SGVhZHMoYnVpbGRpbmdJZDpzdHJpbmcsIGNvc3RIZWFkSWQ6bnVtYmVyLCBjYXRlZ29yeUlkOm51bWJlciwgd29ya0l0ZW1JZDpudW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdvcmtJdGVtQWN0aXZlU3RhdHVzIDogYm9vbGVhbiwgdXNlcjogVXNlciwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgdXBkYXRlIFdvcmtpdGVtIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZEJ5SWQoYnVpbGRpbmdJZCwgKGVycm9yLCBidWlsZGluZzpCdWlsZGluZykgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IGNvc3RIZWFkTGlzdCA9IGJ1aWxkaW5nLmNvc3RIZWFkcztcclxuXHJcbiAgICAgICAgZm9yIChsZXQgY29zdEhlYWREYXRhIG9mIGNvc3RIZWFkTGlzdCkge1xyXG4gICAgICAgICAgaWYgKGNvc3RIZWFkSWQgPT09IGNvc3RIZWFkRGF0YS5yYXRlQW5hbHlzaXNJZCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBjYXRlZ29yeURhdGEgb2YgY29zdEhlYWREYXRhLmNhdGVnb3JpZXMpIHtcclxuICAgICAgICAgICAgICBpZiAoY2F0ZWdvcnlJZCA9PT0gY2F0ZWdvcnlEYXRhLnJhdGVBbmFseXNpc0lkKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB3b3JrSXRlbURhdGEgb2YgY2F0ZWdvcnlEYXRhLndvcmtJdGVtcykge1xyXG4gICAgICAgICAgICAgICAgICBpZiAod29ya0l0ZW1JZCA9PT0gd29ya0l0ZW1EYXRhLnJhdGVBbmFseXNpc0lkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd29ya0l0ZW1EYXRhLmFjdGl2ZSA9IHdvcmtJdGVtQWN0aXZlU3RhdHVzO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGxldCBxdWVyeSA9IHtfaWQ6IGJ1aWxkaW5nSWR9O1xyXG4gICAgICAgICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgYnVpbGRpbmcsIHtuZXc6IHRydWV9LCAoZXJyb3IsIHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGZpbmRPbmVBbmRVcGRhdGUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTogJ3N1Y2Nlc3MnLCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vIFVwZGF0ZSBXb3JrSXRlbSBTdGF0dXMgT2YgUHJvamVjdCBDb3N0SGVhZHNcclxuICB1cGRhdGVXb3JrSXRlbVN0YXR1c09mUHJvamVjdENvc3RIZWFkcyhwcm9qZWN0SWQ6c3RyaW5nLCBjb3N0SGVhZElkOm51bWJlciwgY2F0ZWdvcnlJZDpudW1iZXIsIHdvcmtJdGVtSWQ6bnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdvcmtJdGVtQWN0aXZlU3RhdHVzIDogYm9vbGVhbiwgdXNlcjogVXNlciwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgVXBkYXRlIFdvcmtJdGVtIFN0YXR1cyBPZiBQcm9qZWN0IENvc3QgSGVhZHMgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICB0aGlzLnByb2plY3RSZXBvc2l0b3J5LmZpbmRCeUlkKHByb2plY3RJZCwgKGVycm9yLCBwcm9qZWN0OlByb2plY3QpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCBjb3N0SGVhZExpc3QgPSBwcm9qZWN0LnByb2plY3RDb3N0SGVhZHM7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGNvc3RIZWFkRGF0YSBvZiBjb3N0SGVhZExpc3QpIHtcclxuICAgICAgICAgIGlmIChjb3N0SGVhZElkID09PSBjb3N0SGVhZERhdGEucmF0ZUFuYWx5c2lzSWQpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgY2F0ZWdvcnlEYXRhIG9mIGNvc3RIZWFkRGF0YS5jYXRlZ29yaWVzKSB7XHJcbiAgICAgICAgICAgICAgaWYgKGNhdGVnb3J5SWQgPT09IGNhdGVnb3J5RGF0YS5yYXRlQW5hbHlzaXNJZCkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgd29ya0l0ZW1EYXRhIG9mIGNhdGVnb3J5RGF0YS53b3JrSXRlbXMpIHtcclxuICAgICAgICAgICAgICAgICAgaWYgKHdvcmtJdGVtSWQgPT09IHdvcmtJdGVtRGF0YS5yYXRlQW5hbHlzaXNJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHdvcmtJdGVtRGF0YS5hY3RpdmUgPSB3b3JrSXRlbUFjdGl2ZVN0YXR1cztcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgICBsZXQgcXVlcnkgPSB7X2lkOiBwcm9qZWN0SWR9O1xyXG4gICAgICAgICAgdGhpcy5wcm9qZWN0UmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCBwcm9qZWN0LCB7bmV3OiB0cnVlfSwgKGVycm9yLCByZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBVcGRhdGUgV29ya0l0ZW0gU3RhdHVzIE9mIFByb2plY3QgQ29zdCBIZWFkcyAsZmluZE9uZUFuZFVwZGF0ZSBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiAnc3VjY2VzcycsIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlQnVkZ2V0ZWRDb3N0Rm9yQ29zdEhlYWQoIGJ1aWxkaW5nSWQgOiBzdHJpbmcsIGNvc3RIZWFkQnVkZ2V0ZWRBbW91bnQgOiBhbnksIHVzZXI6IFVzZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIHVwZGF0ZUJ1ZGdldGVkQ29zdEZvckNvc3RIZWFkIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgbGV0IHF1ZXJ5ID0geydfaWQnIDogYnVpbGRpbmdJZCwgJ2Nvc3RIZWFkcy5uYW1lJyA6IGNvc3RIZWFkQnVkZ2V0ZWRBbW91bnQuY29zdEhlYWR9O1xyXG5cclxuICAgIGxldCBuZXdEYXRhID0geyAkc2V0IDoge1xyXG4gICAgICAnY29zdEhlYWRzLiQuYnVkZ2V0ZWRDb3N0QW1vdW50JyA6IGNvc3RIZWFkQnVkZ2V0ZWRBbW91bnQuYnVkZ2V0ZWRDb3N0QW1vdW50LFxyXG4gICAgfSB9O1xyXG5cclxuICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIG5ld0RhdGEsIHtuZXc6dHJ1ZX0sKGVyciwgcmVzcG9uc2UpID0+IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZmluZE9uZUFuZFVwZGF0ZSBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgaWYoZXJyKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTogcmVzcG9uc2UsIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVCdWRnZXRlZENvc3RGb3JQcm9qZWN0Q29zdEhlYWQoIHByb2plY3RJZCA6IHN0cmluZywgY29zdEhlYWRCdWRnZXRlZEFtb3VudCA6IGFueSwgdXNlcjogVXNlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgdXBkYXRlQnVkZ2V0ZWRDb3N0Rm9yQ29zdEhlYWQgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICBsZXQgcXVlcnkgPSB7J19pZCcgOiBwcm9qZWN0SWQsICdwcm9qZWN0Q29zdEhlYWRzLm5hbWUnIDogY29zdEhlYWRCdWRnZXRlZEFtb3VudC5jb3N0SGVhZH07XHJcblxyXG4gICAgbGV0IG5ld0RhdGEgPSB7ICRzZXQgOiB7XHJcbiAgICAgICdwcm9qZWN0Q29zdEhlYWRzLiQuYnVkZ2V0ZWRDb3N0QW1vdW50JyA6IGNvc3RIZWFkQnVkZ2V0ZWRBbW91bnQuYnVkZ2V0ZWRDb3N0QW1vdW50LFxyXG4gICAgfSB9O1xyXG5cclxuICAgIHRoaXMucHJvamVjdFJlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgbmV3RGF0YSwge25ldzp0cnVlfSwoZXJyLCByZXNwb25zZSkgPT4ge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kT25lQW5kVXBkYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBpZihlcnIpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiByZXNwb25zZSwgYWNjZXNzX3Rva2VuOiB0aGlzLmF1dGhJbnRlcmNlcHRvci5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKX0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZVF1YW50aXR5T2ZCdWlsZGluZ0Nvc3RIZWFkcyhwcm9qZWN0SWQ6c3RyaW5nLCBidWlsZGluZ0lkOnN0cmluZywgY29zdEhlYWRJZDpudW1iZXIsIGNhdGVnb3J5SWQ6bnVtYmVyLCB3b3JrSXRlbUlkOm51bWJlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVhbnRpdHlEZXRhaWw6UXVhbnRpdHlEZXRhaWxzLCB1c2VyOlVzZXIsIGNhbGxiYWNrOihlcnJvcjogYW55LCByZXN1bHQ6IGFueSk9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCB1cGRhdGVRdWFudGl0eU9mQnVpbGRpbmdDb3N0SGVhZHMgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICB0aGlzLmJ1aWxkaW5nUmVwb3NpdG9yeS5maW5kQnlJZChidWlsZGluZ0lkLCAoZXJyb3IsIGJ1aWxkaW5nKSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgY29zdEhlYWRMaXN0ID0gYnVpbGRpbmcuY29zdEhlYWRzO1xyXG4gICAgICAgIGxldCBxdWFudGl0eSAgOiBRdWFudGl0eTtcclxuICAgICAgICBmb3IgKGxldCBjb3N0SGVhZCBvZiBjb3N0SGVhZExpc3QpIHtcclxuICAgICAgICAgIGlmIChjb3N0SGVhZElkID09PSBjb3N0SGVhZC5yYXRlQW5hbHlzaXNJZCkge1xyXG4gICAgICAgICAgICBsZXQgY2F0ZWdvcmllc09mQ29zdEhlYWQgPSBjb3N0SGVhZC5jYXRlZ29yaWVzO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBjYXRlZ29yeURhdGEgb2YgY2F0ZWdvcmllc09mQ29zdEhlYWQpIHtcclxuICAgICAgICAgICAgICBpZiAoY2F0ZWdvcnlJZCA9PT0gY2F0ZWdvcnlEYXRhLnJhdGVBbmFseXNpc0lkKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB3b3JrSXRlbURhdGEgb2YgY2F0ZWdvcnlEYXRhLndvcmtJdGVtcykge1xyXG4gICAgICAgICAgICAgICAgICBpZiAod29ya0l0ZW1JZCA9PT0gd29ya0l0ZW1EYXRhLnJhdGVBbmFseXNpc0lkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcXVhbnRpdHkgID0gd29ya0l0ZW1EYXRhLnF1YW50aXR5O1xyXG4gICAgICAgICAgICAgICAgICAgIHF1YW50aXR5LmlzRXN0aW1hdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVF1YW50aXR5SXRlbXNPZldvcmtJdGVtKCBxdWFudGl0eSwgcXVhbnRpdHlEZXRhaWwpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGxldCBxdWVyeSA9IHtfaWQ6IGJ1aWxkaW5nSWR9O1xyXG4gICAgICAgICAgbGV0IGRhdGEgPSB7JHNldCA6IHsnY29zdEhlYWRzJyA6IGNvc3RIZWFkTGlzdH19O1xyXG4gICAgICAgICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgZGF0YSwge25ldzogdHJ1ZX0sIChlcnJvciwgYnVpbGRpbmcpID0+IHtcclxuICAgICAgICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZmluZE9uZUFuZFVwZGF0ZSBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiAnc3VjY2VzcycsIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVRdWFudGl0eUl0ZW1zT2ZXb3JrSXRlbShxdWFudGl0eTogUXVhbnRpdHksIHF1YW50aXR5RGV0YWlsOiBRdWFudGl0eURldGFpbHMpIHtcclxuXHJcbiAgICBxdWFudGl0eS5pc0VzdGltYXRlZCA9IHRydWU7XHJcblxyXG4gICAgaWYgKHF1YW50aXR5LnF1YW50aXR5SXRlbURldGFpbHMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIHF1YW50aXR5RGV0YWlsLnRvdGFsID0gYWxhc3FsKCdWQUxVRSBPRiBTRUxFQ1QgU1VNKHF1YW50aXR5KSBGUk9NID8nLCBbcXVhbnRpdHlEZXRhaWwucXVhbnRpdHlJdGVtc10pO1xyXG4gICAgICBxdWFudGl0eS5xdWFudGl0eUl0ZW1EZXRhaWxzLnB1c2gocXVhbnRpdHlEZXRhaWwpO1xyXG4gICAgfSBlbHNlIHtcclxuXHJcbiAgICAgIGxldCBpc0RlZmF1bHRFeGlzdHNTUUwgPSAnU0VMRUNUIG5hbWUgZnJvbSA/IEFTIHF1YW50aXR5RGV0YWlscyB3aGVyZSBxdWFudGl0eURldGFpbHMubmFtZT1cImRlZmF1bHRcIic7XHJcbiAgICAgIGxldCBpc0RlZmF1bHRFeGlzdHNRdWFudGl0eURldGFpbCA9IGFsYXNxbChpc0RlZmF1bHRFeGlzdHNTUUwsIFtxdWFudGl0eS5xdWFudGl0eUl0ZW1EZXRhaWxzXSk7XHJcblxyXG4gICAgICBpZiAoaXNEZWZhdWx0RXhpc3RzUXVhbnRpdHlEZXRhaWwubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHF1YW50aXR5LnF1YW50aXR5SXRlbURldGFpbHMgPSBbXTtcclxuICAgICAgICBxdWFudGl0eURldGFpbC50b3RhbCA9IGFsYXNxbCgnVkFMVUUgT0YgU0VMRUNUIFNVTShxdWFudGl0eSkgRlJPTSA/JywgW3F1YW50aXR5RGV0YWlsLnF1YW50aXR5SXRlbXNdKTtcclxuICAgICAgICBxdWFudGl0eS5xdWFudGl0eUl0ZW1EZXRhaWxzLnB1c2gocXVhbnRpdHlEZXRhaWwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChxdWFudGl0eURldGFpbC5uYW1lICE9PSAnZGVmYXVsdCcpIHtcclxuICAgICAgICAgIGxldCBpc0l0ZW1BbHJlYWR5RXhpc3RTUUwgPSAnU0VMRUNUIG5hbWUgZnJvbSA/IEFTIHF1YW50aXR5RGV0YWlscyB3aGVyZSBxdWFudGl0eURldGFpbHMubmFtZT1cIicgKyBxdWFudGl0eURldGFpbC5uYW1lICsgJ1wiJztcclxuICAgICAgICAgIGxldCBpc0l0ZW1BbHJlYWR5RXhpc3RzID0gYWxhc3FsKGlzSXRlbUFscmVhZHlFeGlzdFNRTCwgW3F1YW50aXR5LnF1YW50aXR5SXRlbURldGFpbHNdKTtcclxuXHJcbiAgICAgICAgICBpZiAoaXNJdGVtQWxyZWFkeUV4aXN0cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHF1YW50aXR5aW5kZXggPSAwOyBxdWFudGl0eWluZGV4IDwgcXVhbnRpdHkucXVhbnRpdHlJdGVtRGV0YWlscy5sZW5ndGg7IHF1YW50aXR5aW5kZXgrKykge1xyXG4gICAgICAgICAgICAgIGlmKHF1YW50aXR5LnF1YW50aXR5SXRlbURldGFpbHNbcXVhbnRpdHlpbmRleF0ubmFtZSA9PT0gcXVhbnRpdHlEZXRhaWwubmFtZSkge1xyXG4gICAgICAgICAgICAgICAgcXVhbnRpdHkucXVhbnRpdHlJdGVtRGV0YWlsc1txdWFudGl0eWluZGV4XS5xdWFudGl0eUl0ZW1zID0gcXVhbnRpdHlEZXRhaWwucXVhbnRpdHlJdGVtcztcclxuICAgICAgICAgICAgICAgIHF1YW50aXR5LnF1YW50aXR5SXRlbURldGFpbHNbcXVhbnRpdHlpbmRleF0udG90YWwgPSBhbGFzcWwoJ1ZBTFVFIE9GIFNFTEVDVCBTVU0ocXVhbnRpdHkpIEZST00gPycsIFtxdWFudGl0eURldGFpbC5xdWFudGl0eUl0ZW1zXSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBxdWFudGl0eURldGFpbC50b3RhbCA9IGFsYXNxbCgnVkFMVUUgT0YgU0VMRUNUIFNVTShxdWFudGl0eSkgRlJPTSA/JywgW3F1YW50aXR5RGV0YWlsLnF1YW50aXR5SXRlbXNdKTtcclxuICAgICAgICAgICAgcXVhbnRpdHkucXVhbnRpdHlJdGVtRGV0YWlscy5wdXNoKHF1YW50aXR5RGV0YWlsKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcXVhbnRpdHkucXVhbnRpdHlJdGVtRGV0YWlscyA9IFtdO1xyXG4gICAgICAgICAgcXVhbnRpdHlEZXRhaWwudG90YWwgPSBhbGFzcWwoJ1ZBTFVFIE9GIFNFTEVDVCBTVU0ocXVhbnRpdHkpIEZST00gPycsIFtxdWFudGl0eURldGFpbC5xdWFudGl0eUl0ZW1zXSk7XHJcbiAgICAgICAgICBxdWFudGl0eS5xdWFudGl0eUl0ZW1EZXRhaWxzLnB1c2gocXVhbnRpdHlEZXRhaWwpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcXVhbnRpdHkudG90YWwgPSBhbGFzcWwoJ1ZBTFVFIE9GIFNFTEVDVCBTVU0odG90YWwpIEZST00gPycsIFtxdWFudGl0eS5xdWFudGl0eUl0ZW1EZXRhaWxzXSk7XHJcbiAgfVxyXG5cclxuLy9VcGRhdGUgUXVhbnRpdHkgT2YgUHJvamVjdCBDb3N0IEhlYWRzXHJcbiAgdXBkYXRlUXVhbnRpdHlPZlByb2plY3RDb3N0SGVhZHMocHJvamVjdElkOnN0cmluZywgY29zdEhlYWRJZDpudW1iZXIsIGNhdGVnb3J5SWQ6bnVtYmVyLCB3b3JrSXRlbUlkOm51bWJlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBxdWFudGl0eURldGFpbHM6UXVhbnRpdHlEZXRhaWxzLCB1c2VyOlVzZXIsIGNhbGxiYWNrOihlcnJvcjogYW55LCByZXN1bHQ6IGFueSk9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBVcGRhdGUgUXVhbnRpdHkgT2YgUHJvamVjdCBDb3N0IEhlYWRzIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgdGhpcy5wcm9qZWN0UmVwb3NpdG9yeS5maW5kQnlJZChwcm9qZWN0SWQsIChlcnJvciwgcHJvamVjdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IGNvc3RIZWFkTGlzdCA9IHByb2plY3QucHJvamVjdENvc3RIZWFkcztcclxuICAgICAgICBsZXQgcXVhbnRpdHkgIDogUXVhbnRpdHk7XHJcbiAgICAgICAgZm9yIChsZXQgY29zdEhlYWQgb2YgY29zdEhlYWRMaXN0KSB7XHJcbiAgICAgICAgICBpZiAoY29zdEhlYWRJZCA9PT0gY29zdEhlYWQucmF0ZUFuYWx5c2lzSWQpIHtcclxuICAgICAgICAgICAgbGV0IGNhdGVnb3JpZXNPZkNvc3RIZWFkID0gY29zdEhlYWQuY2F0ZWdvcmllcztcclxuICAgICAgICAgICAgZm9yIChsZXQgY2F0ZWdvcnlEYXRhIG9mIGNhdGVnb3JpZXNPZkNvc3RIZWFkKSB7XHJcbiAgICAgICAgICAgICAgaWYgKGNhdGVnb3J5SWQgPT09IGNhdGVnb3J5RGF0YS5yYXRlQW5hbHlzaXNJZCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHdvcmtJdGVtc09mQ2F0ZWdvcnkgPSBjYXRlZ29yeURhdGEud29ya0l0ZW1zO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgd29ya0l0ZW1EYXRhIG9mIHdvcmtJdGVtc09mQ2F0ZWdvcnkpIHtcclxuICAgICAgICAgICAgICAgICAgaWYgKHdvcmtJdGVtSWQgPT09IHdvcmtJdGVtRGF0YS5yYXRlQW5hbHlzaXNJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHF1YW50aXR5ID0gd29ya0l0ZW1EYXRhLnF1YW50aXR5O1xyXG4gICAgICAgICAgICAgICAgICAgIHF1YW50aXR5LmlzRXN0aW1hdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVF1YW50aXR5SXRlbXNPZldvcmtJdGVtKCBxdWFudGl0eSwgcXVhbnRpdHlEZXRhaWxzKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHF1ZXJ5ID0ge19pZDogcHJvamVjdElkfTtcclxuICAgICAgICBsZXQgZGF0YSA9IHskc2V0IDogeydwcm9qZWN0Q29zdEhlYWRzJyA6IGNvc3RIZWFkTGlzdH19O1xyXG4gICAgICAgIHRoaXMucHJvamVjdFJlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgZGF0YSwge25ldzogdHJ1ZX0sIChlcnJvciwgcHJvamVjdCkgPT4ge1xyXG4gICAgICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZmluZE9uZUFuZFVwZGF0ZSBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTogJ3N1Y2Nlc3MnLCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy9HZXQgSW4tQWN0aXZlIENhdGVnb3JpZXMgRnJvbSBEYXRhYmFzZVxyXG4gIGdldEluQWN0aXZlQ2F0ZWdvcmllc0J5Q29zdEhlYWRJZChwcm9qZWN0SWQ6c3RyaW5nLCBidWlsZGluZ0lkOnN0cmluZywgY29zdEhlYWRJZDpzdHJpbmcsIHVzZXI6VXNlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6KGVycm9yOiBhbnksIHJlc3VsdDogYW55KT0+IHZvaWQpIHtcclxuXHJcbiAgICB0aGlzLmJ1aWxkaW5nUmVwb3NpdG9yeS5maW5kQnlJZChidWlsZGluZ0lkLCAoZXJyb3IsIGJ1aWxkaW5nKSA9PiB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIEdldCBJbi1BY3RpdmUgQ2F0ZWdvcmllcyBCeSBDb3N0IEhlYWQgSWQgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgY29zdEhlYWRzID0gYnVpbGRpbmcuY29zdEhlYWRzO1xyXG4gICAgICAgIGxldCBjYXRlZ29yaWVzIDogQXJyYXk8Q2F0ZWdvcnk+PSBuZXcgQXJyYXk8Q2F0ZWdvcnk+KCk7XHJcbiAgICAgICAgZm9yKGxldCBjb3N0SGVhZEluZGV4ID0gMDsgY29zdEhlYWRJbmRleDxjb3N0SGVhZHMubGVuZ3RoOyBjb3N0SGVhZEluZGV4KyspIHtcclxuICAgICAgICAgIGlmKHBhcnNlSW50KGNvc3RIZWFkSWQpID09PSBjb3N0SGVhZHNbY29zdEhlYWRJbmRleF0ucmF0ZUFuYWx5c2lzSWQpIHtcclxuICAgICAgICAgICAgbGV0IGNhdGVnb3JpZXNMaXN0ID0gY29zdEhlYWRzW2Nvc3RIZWFkSW5kZXhdLmNhdGVnb3JpZXM7XHJcbiAgICAgICAgICAgIGZvcihsZXQgY2F0ZWdvcnlJbmRleCA9IDA7IGNhdGVnb3J5SW5kZXggPCBjYXRlZ29yaWVzTGlzdC5sZW5ndGg7IGNhdGVnb3J5SW5kZXgrKykge1xyXG4gICAgICAgICAgICAgIGlmKGNhdGVnb3JpZXNMaXN0W2NhdGVnb3J5SW5kZXhdLmFjdGl2ZSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIGNhdGVnb3JpZXMucHVzaChjYXRlZ29yaWVzTGlzdFtjYXRlZ29yeUluZGV4XSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiBjYXRlZ29yaWVzLCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0V29ya0l0ZW1MaXN0T2ZCdWlsZGluZ0NhdGVnb3J5KHByb2plY3RJZDpzdHJpbmcsIGJ1aWxkaW5nSWQ6c3RyaW5nLCBjb3N0SGVhZElkOm51bWJlciwgY2F0ZWdvcnlJZDpudW1iZXIsIHVzZXI6VXNlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6KGVycm9yOiBhbnksIHJlc3VsdDogYW55KT0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGdldFdvcmtJdGVtTGlzdE9mQnVpbGRpbmdDYXRlZ29yeSBoYXMgYmVlbiBoaXQnKTtcclxuXHJcbiAgICBsZXQgcXVlcnkgPSBbXHJcbiAgICAgIHsgJG1hdGNoOiB7J19pZCc6IE9iamVjdElkKGJ1aWxkaW5nSWQpLCAnY29zdEhlYWRzLnJhdGVBbmFseXNpc0lkJzogY29zdEhlYWRJZCB9fSxcclxuICAgICAgeyAkdW53aW5kOiAnJGNvc3RIZWFkcyd9LFxyXG4gICAgICB7ICRwcm9qZWN0IDogeydjb3N0SGVhZHMnOjEsJ3JhdGVzJzoxfX0sXHJcbiAgICAgIHsgJHVud2luZDogJyRjb3N0SGVhZHMuY2F0ZWdvcmllcyd9LFxyXG4gICAgICB7ICRtYXRjaDogeydjb3N0SGVhZHMuY2F0ZWdvcmllcy5yYXRlQW5hbHlzaXNJZCc6Y2F0ZWdvcnlJZH19LFxyXG4gICAgICB7ICRwcm9qZWN0IDogeydjb3N0SGVhZHMuY2F0ZWdvcmllcy53b3JrSXRlbXMnOjEsICdyYXRlcyc6MX19XHJcbiAgICBdO1xyXG5cclxuICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmFnZ3JlZ2F0ZShxdWVyeSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgR2V0IHdvcmtpdGVtcyBmb3Igc3BlY2lmaWMgY2F0ZWdvcnkgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZihyZXN1bHQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgbGV0IHdvcmtJdGVtc09mQnVpbGRpbmdDYXRlZ29yeSA9IHJlc3VsdFswXS5jb3N0SGVhZHMuY2F0ZWdvcmllcy53b3JrSXRlbXM7XHJcbiAgICAgICAgICBsZXQgd29ya0l0ZW1zTGlzdFdpdGhCdWlsZGluZ1JhdGVzID0gdGhpcy5nZXRXb3JrSXRlbUxpc3RXaXRoQ2VudHJhbGl6ZWRSYXRlcyh3b3JrSXRlbXNPZkJ1aWxkaW5nQ2F0ZWdvcnksIHJlc3VsdFswXS5yYXRlcywgdHJ1ZSk7XHJcbiAgICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTogd29ya0l0ZW1zTGlzdFdpdGhCdWlsZGluZ1JhdGVzLCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxldCBlcnJvciA9IG5ldyBFcnJvcigpO1xyXG4gICAgICAgICAgZXJyb3IubWVzc2FnZSA9IG1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9SRVNQT05TRTtcclxuICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0V29ya0l0ZW1MaXN0T2ZQcm9qZWN0Q2F0ZWdvcnkocHJvamVjdElkOnN0cmluZywgY29zdEhlYWRJZDpudW1iZXIsIGNhdGVnb3J5SWQ6bnVtYmVyLCB1c2VyOlVzZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6KGVycm9yOiBhbnksIHJlc3VsdDogYW55KT0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGdldFdvcmtJdGVtTGlzdE9mUHJvamVjdENhdGVnb3J5IGhhcyBiZWVuIGhpdCcpO1xyXG5cclxuICAgIGxldCBxdWVyeSA9IFtcclxuICAgICAgeyAkbWF0Y2g6IHsnX2lkJzogT2JqZWN0SWQocHJvamVjdElkKSwgJ3Byb2plY3RDb3N0SGVhZHMucmF0ZUFuYWx5c2lzSWQnOiBjb3N0SGVhZElkIH19LFxyXG4gICAgICB7ICR1bndpbmQ6ICckcHJvamVjdENvc3RIZWFkcyd9LFxyXG4gICAgICB7ICRwcm9qZWN0IDogeydwcm9qZWN0Q29zdEhlYWRzJzoxLCdyYXRlcyc6MX19LFxyXG4gICAgICB7ICR1bndpbmQ6ICckcHJvamVjdENvc3RIZWFkcy5jYXRlZ29yaWVzJ30sXHJcbiAgICAgIHsgJG1hdGNoOiB7J3Byb2plY3RDb3N0SGVhZHMuY2F0ZWdvcmllcy5yYXRlQW5hbHlzaXNJZCc6Y2F0ZWdvcnlJZH19LFxyXG4gICAgICB7ICRwcm9qZWN0IDogeydwcm9qZWN0Q29zdEhlYWRzLmNhdGVnb3JpZXMud29ya0l0ZW1zJzoxLCdyYXRlcyc6MX19XHJcbiAgICBdO1xyXG5cclxuICAgIHRoaXMucHJvamVjdFJlcG9zaXRvcnkuYWdncmVnYXRlKHF1ZXJ5LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBHZXQgd29ya2l0ZW1zIEJ5IENvc3QgSGVhZCAmIGNhdGVnb3J5IElkIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYocmVzdWx0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIGxldCB3b3JrSXRlbXNPZkNhdGVnb3J5ID0gcmVzdWx0WzBdLnByb2plY3RDb3N0SGVhZHMuY2F0ZWdvcmllcy53b3JrSXRlbXM7XHJcbiAgICAgICAgICBsZXQgd29ya0l0ZW1zTGlzdFdpdGhSYXRlcyA9IHRoaXMuZ2V0V29ya0l0ZW1MaXN0V2l0aENlbnRyYWxpemVkUmF0ZXMod29ya0l0ZW1zT2ZDYXRlZ29yeSwgcmVzdWx0WzBdLnJhdGVzLCB0cnVlKTtcclxuICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiB3b3JrSXRlbXNMaXN0V2l0aFJhdGVzLCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxldCBlcnJvciA9IG5ldyBFcnJvcigpO1xyXG4gICAgICAgICAgZXJyb3IubWVzc2FnZSA9IG1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9SRVNQT05TRTtcclxuICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0V29ya0l0ZW1MaXN0V2l0aENlbnRyYWxpemVkUmF0ZXMod29ya0l0ZW1zT2ZDYXRlZ29yeTogQXJyYXk8V29ya0l0ZW0+LCBjZW50cmFsaXplZFJhdGVzOiBBcnJheTxhbnk+LCBpc1dvcmtJdGVtQWN0aXZlOmJvb2xlYW4pIHtcclxuICAgIGxldCB3b3JrSXRlbXNMaXN0V2l0aFJhdGVzID0gbmV3IEFycmF5PFdvcmtJdGVtPigpO1xyXG4gICAgZm9yIChsZXQgd29ya0l0ZW1PYmogb2Ygd29ya0l0ZW1zT2ZDYXRlZ29yeSkge1xyXG4gICAgICBpZiAod29ya0l0ZW1PYmouYWN0aXZlID09PSBpc1dvcmtJdGVtQWN0aXZlKSB7XHJcbiAgICAgICAgbGV0IHdvcmtJdGVtOiBXb3JrSXRlbSA9IHdvcmtJdGVtT2JqO1xyXG4gICAgICAgIGxldCByYXRlSXRlbXNPZldvcmtJdGVtID0gd29ya0l0ZW1PYmoucmF0ZS5yYXRlSXRlbXM7XHJcbiAgICAgICAgd29ya0l0ZW0ucmF0ZS5yYXRlSXRlbXMgPSB0aGlzLmdldFJhdGVzRnJvbUNlbnRyYWxpemVkcmF0ZXMocmF0ZUl0ZW1zT2ZXb3JrSXRlbSwgY2VudHJhbGl6ZWRSYXRlcyk7XHJcblxyXG4gICAgICAgIGxldCBhcnJheU9mUmF0ZUl0ZW1zID0gd29ya0l0ZW0ucmF0ZS5yYXRlSXRlbXM7XHJcbiAgICAgICAgbGV0IHRvdGFsT2ZBbGxSYXRlSXRlbXMgPSBhbGFzcWwoJ1ZBTFVFIE9GIFNFTEVDVCBTVU0odG90YWxBbW91bnQpIEZST00gPycsW2FycmF5T2ZSYXRlSXRlbXNdKTtcclxuICAgICAgICB3b3JrSXRlbS5yYXRlLnRvdGFsID0gcGFyc2VGbG9hdCgodG90YWxPZkFsbFJhdGVJdGVtcy93b3JrSXRlbS5yYXRlLnF1YW50aXR5KS50b0ZpeGVkKENvbnN0YW50cy5OVU1CRVJfT0ZfRlJBQ1RJT05fRElHSVQpKTtcclxuXHJcbiAgICAgICAgbGV0IHF1YW50aXR5SXRlbXMgPSB3b3JrSXRlbS5xdWFudGl0eS5xdWFudGl0eUl0ZW1EZXRhaWxzO1xyXG4gICAgICAgIHdvcmtJdGVtLnF1YW50aXR5LnRvdGFsID0gYWxhc3FsKCdWQUxVRSBPRiBTRUxFQ1QgU1VNKHRvdGFsKSBGUk9NID8nLFtxdWFudGl0eUl0ZW1zXSk7XHJcblxyXG4gICAgICAgICBpZih3b3JrSXRlbS5yYXRlLmlzRXN0aW1hdGVkICYmIHdvcmtJdGVtLnF1YW50aXR5LmlzRXN0aW1hdGVkKSB7XHJcbiAgICAgICAgICAgd29ya0l0ZW0uYW1vdW50ID0gdGhpcy5jb21tb25TZXJ2aWNlLmRlY2ltYWxDb252ZXJzaW9uKHdvcmtJdGVtLnJhdGUudG90YWwgKiB3b3JrSXRlbS5xdWFudGl0eS50b3RhbCk7XHJcbiAgICAgICAgIH1cclxuICAgICAgd29ya0l0ZW1zTGlzdFdpdGhSYXRlcy5wdXNoKHdvcmtJdGVtKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHdvcmtJdGVtc0xpc3RXaXRoUmF0ZXM7XHJcbiAgfVxyXG5cclxuICBnZXRSYXRlc0Zyb21DZW50cmFsaXplZHJhdGVzKHJhdGVJdGVtc09mV29ya0l0ZW06IEFycmF5PFJhdGVJdGVtPiwgY2VudHJhbGl6ZWRSYXRlczpBcnJheTxhbnk+KSB7XHJcbiAgICBsZXQgcmF0ZUl0ZW1zU1FMID0gJ1NFTEVDVCByYXRlSXRlbS5pdGVtTmFtZSwgcmF0ZUl0ZW0ub3JpZ2luYWxJdGVtTmFtZSwgcmF0ZUl0ZW0ucmF0ZUFuYWx5c2lzSWQsIHJhdGVJdGVtLnR5cGUsJyArXHJcbiAgICAgICdyYXRlSXRlbS5xdWFudGl0eSwgY2VudHJhbGl6ZWRSYXRlcy5yYXRlLCByYXRlSXRlbS51bml0LCByYXRlSXRlbS50b3RhbEFtb3VudCwgcmF0ZUl0ZW0udG90YWxRdWFudGl0eSAnICtcclxuICAgICAgJ0ZST00gPyBBUyByYXRlSXRlbSBKT0lOID8gQVMgY2VudHJhbGl6ZWRSYXRlcyBPTiByYXRlSXRlbS5pdGVtTmFtZSA9IGNlbnRyYWxpemVkUmF0ZXMuaXRlbU5hbWUnO1xyXG4gICAgbGV0IHJhdGVJdGVtc0ZvcldvcmtJdGVtID0gYWxhc3FsKHJhdGVJdGVtc1NRTCwgW3JhdGVJdGVtc09mV29ya0l0ZW0sIGNlbnRyYWxpemVkUmF0ZXNdKTtcclxuICAgIHJldHVybiByYXRlSXRlbXNGb3JXb3JrSXRlbTtcclxuICB9XHJcblxyXG4gIGFkZFdvcmtpdGVtKHByb2plY3RJZDpzdHJpbmcsIGJ1aWxkaW5nSWQ6c3RyaW5nLCBjb3N0SGVhZElkOm51bWJlciwgY2F0ZWdvcnlJZDpudW1iZXIsIHdvcmtJdGVtOiBXb3JrSXRlbSxcclxuICAgICAgICAgICAgICB1c2VyOlVzZXIsIGNhbGxiYWNrOihlcnJvcjogYW55LCByZXN1bHQ6IGFueSk9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBhZGRXb3JraXRlbSBoYXMgYmVlbiBoaXQnKTtcclxuICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmZpbmRCeUlkKGJ1aWxkaW5nSWQsIChlcnJvciwgYnVpbGRpbmc6QnVpbGRpbmcpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCByZXNwb25zZVdvcmtpdGVtIDogQXJyYXk8V29ya0l0ZW0+PSBudWxsO1xyXG4gICAgICAgIGZvcihsZXQgaW5kZXggPSAwOyBidWlsZGluZy5jb3N0SGVhZHMubGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIHtcclxuICAgICAgICAgIGlmKGJ1aWxkaW5nLmNvc3RIZWFkc1tpbmRleF0ucmF0ZUFuYWx5c2lzSWQgPT09IGNvc3RIZWFkSWQpIHtcclxuICAgICAgICAgICAgbGV0IGNhdGVnb3J5ID0gYnVpbGRpbmcuY29zdEhlYWRzW2luZGV4XS5jYXRlZ29yaWVzO1xyXG4gICAgICAgICAgICBmb3IobGV0IGNhdGVnb3J5SW5kZXggPSAwOyBjYXRlZ29yeS5sZW5ndGggPiBjYXRlZ29yeUluZGV4OyBjYXRlZ29yeUluZGV4KyspIHtcclxuICAgICAgICAgICAgICBpZihjYXRlZ29yeVtjYXRlZ29yeUluZGV4XS5yYXRlQW5hbHlzaXNJZCA9PT0gY2F0ZWdvcnlJZCkge1xyXG4gICAgICAgICAgICAgICAgY2F0ZWdvcnlbY2F0ZWdvcnlJbmRleF0ud29ya0l0ZW1zLnB1c2god29ya0l0ZW0pO1xyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2VXb3JraXRlbSA9IGNhdGVnb3J5W2NhdGVnb3J5SW5kZXhdLndvcmtJdGVtcztcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IHF1ZXJ5ID0geyBfaWQgOiBidWlsZGluZ0lkIH07XHJcbiAgICAgICAgICAgIGxldCBuZXdEYXRhID0geyAkc2V0IDogeydjb3N0SGVhZHMnIDogYnVpbGRpbmcuY29zdEhlYWRzfX07XHJcbiAgICAgICAgICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIG5ld0RhdGEse25ldzogdHJ1ZX0sIChlcnJvciwgYnVpbGRpbmcpID0+IHtcclxuICAgICAgICAgICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kT25lQW5kVXBkYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTogcmVzcG9uc2VXb3JraXRlbSwgYWNjZXNzX3Rva2VuOiB0aGlzLmF1dGhJbnRlcmNlcHRvci5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKX0pO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGFkZENhdGVnb3J5QnlDb3N0SGVhZElkKHByb2plY3RJZDpzdHJpbmcsIGJ1aWxkaW5nSWQ6c3RyaW5nLCBjb3N0SGVhZElkOnN0cmluZywgY2F0ZWdvcnlEZXRhaWxzIDogYW55LCB1c2VyOlVzZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6KGVycm9yOiBhbnksIHJlc3VsdDogYW55KT0+IHZvaWQpIHtcclxuXHJcbiAgICBsZXQgY2F0ZWdvcnlPYmogOiBDYXRlZ29yeSA9IG5ldyBDYXRlZ29yeShjYXRlZ29yeURldGFpbHMuY2F0ZWdvcnksIGNhdGVnb3J5RGV0YWlscy5jYXRlZ29yeUlkKTtcclxuXHJcbiAgICBsZXQgcXVlcnkgPSB7J19pZCcgOiBidWlsZGluZ0lkLCAnY29zdEhlYWRzLnJhdGVBbmFseXNpc0lkJyA6IHBhcnNlSW50KGNvc3RIZWFkSWQpfTtcclxuICAgIGxldCBuZXdEYXRhID0geyAkcHVzaDogeyAnY29zdEhlYWRzLiQuY2F0ZWdvcmllcyc6IGNhdGVnb3J5T2JqIH19O1xyXG5cclxuICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIG5ld0RhdGEse25ldzogdHJ1ZX0sIChlcnJvciwgYnVpbGRpbmcpID0+IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgYWRkQ2F0ZWdvcnlCeUNvc3RIZWFkSWQgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTogYnVpbGRpbmcsIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvL1VwZGF0ZSBzdGF0dXMgKCB0cnVlL2ZhbHNlICkgb2YgY2F0ZWdvcnlcclxuICB1cGRhdGVDYXRlZ29yeVN0YXR1cyhwcm9qZWN0SWQ6c3RyaW5nLCBidWlsZGluZ0lkOnN0cmluZywgY29zdEhlYWRJZDpudW1iZXIsIGNhdGVnb3J5SWQ6bnVtYmVyICxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeUFjdGl2ZVN0YXR1czpib29sZWFuLCB1c2VyOlVzZXIsIGNhbGxiYWNrOihlcnJvcjogYW55LCByZXN1bHQ6IGFueSk9PiB2b2lkKSB7XHJcblxyXG4gICB0aGlzLmJ1aWxkaW5nUmVwb3NpdG9yeS5maW5kQnlJZChidWlsZGluZ0lkLCAoZXJyb3IsIGJ1aWxkaW5nOkJ1aWxkaW5nKSA9PiB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIHVwZGF0ZSBDYXRlZ29yeSBTdGF0dXMgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgY29zdEhlYWRzID0gYnVpbGRpbmcuY29zdEhlYWRzO1xyXG4gICAgICAgIGxldCBjYXRlZ29yaWVzIDogQXJyYXk8Q2F0ZWdvcnk+PSBuZXcgQXJyYXk8Q2F0ZWdvcnk+KCk7XHJcbiAgICAgICAgbGV0IHVwZGF0ZWRDYXRlZ29yaWVzIDogQXJyYXk8Q2F0ZWdvcnk+PSBuZXcgQXJyYXk8Q2F0ZWdvcnk+KCk7XHJcbiAgICAgICAgbGV0IGluZGV4IDogbnVtYmVyO1xyXG5cclxuICAgICAgICBmb3IobGV0IGNvc3RIZWFkSW5kZXg9MDsgY29zdEhlYWRJbmRleDxjb3N0SGVhZHMubGVuZ3RoOyBjb3N0SGVhZEluZGV4KyspIHtcclxuICAgICAgICAgIGlmKGNvc3RIZWFkSWQgPT09IGNvc3RIZWFkc1tjb3N0SGVhZEluZGV4XS5yYXRlQW5hbHlzaXNJZCkge1xyXG4gICAgICAgICAgICBjYXRlZ29yaWVzID0gY29zdEhlYWRzW2Nvc3RIZWFkSW5kZXhdLmNhdGVnb3JpZXM7XHJcbiAgICAgICAgICAgIGZvcihsZXQgY2F0ZWdvcnlJbmRleCA9IDA7IGNhdGVnb3J5SW5kZXg8Y2F0ZWdvcmllcy5sZW5ndGg7IGNhdGVnb3J5SW5kZXgrKykge1xyXG4gICAgICAgICAgICAgIGlmKGNhdGVnb3JpZXNbY2F0ZWdvcnlJbmRleF0ucmF0ZUFuYWx5c2lzSWQgPT09IGNhdGVnb3J5SWQpIHtcclxuICAgICAgICAgICAgICAgIGNhdGVnb3JpZXNbY2F0ZWdvcnlJbmRleF0uYWN0aXZlID0gY2F0ZWdvcnlBY3RpdmVTdGF0dXM7XHJcbiAgICAgICAgICAgICAgICB1cGRhdGVkQ2F0ZWdvcmllcy5wdXNoKGNhdGVnb3JpZXNbY2F0ZWdvcnlJbmRleF0pO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHF1ZXJ5ID0geydfaWQnIDogYnVpbGRpbmdJZCwgJ2Nvc3RIZWFkcy5yYXRlQW5hbHlzaXNJZCcgOiBjb3N0SGVhZElkfTtcclxuICAgICAgICBsZXQgbmV3RGF0YSA9IHsnJHNldCcgOiB7J2Nvc3RIZWFkcy4kLmNhdGVnb3JpZXMnIDogY2F0ZWdvcmllcyB9fTtcclxuXHJcbiAgICAgICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgbmV3RGF0YSx7bmV3OiB0cnVlfSwgKGVycm9yLCBidWlsZGluZykgPT4ge1xyXG4gICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiB1cGRhdGVkQ2F0ZWdvcmllcywgYWNjZXNzX3Rva2VuOiB0aGlzLmF1dGhJbnRlcmNlcHRvci5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKX0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vR2V0IGFjdGl2ZSBjYXRlZ29yaWVzIGZyb20gZGF0YWJhc2VcclxuICBnZXRDYXRlZ29yaWVzT2ZCdWlsZGluZ0Nvc3RIZWFkKHByb2plY3RJZDpzdHJpbmcsIGJ1aWxkaW5nSWQ6c3RyaW5nLCBjb3N0SGVhZElkOm51bWJlciwgdXNlcjpVc2VyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6KGVycm9yOiBhbnksIHJlc3VsdDogYW55KT0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIEdldCBBY3RpdmUgQ2F0ZWdvcmllcyBoYXMgYmVlbiBoaXQnKTtcclxuICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmZpbmRCeUlkKGJ1aWxkaW5nSWQsIChlcnJvciwgYnVpbGRpbmc6QnVpbGRpbmcpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCBidWlsZGluZ0Nvc3RIZWFkcyA9IGJ1aWxkaW5nLmNvc3RIZWFkcztcclxuICAgICAgICBsZXQgY2F0ZWdvcmllc0xpc3RXaXRoQ2VudHJhbGl6ZWRSYXRlcyA6IENhdGVnb3JpZXNMaXN0V2l0aFJhdGVzRFRPO1xyXG5cclxuICAgICAgICBmb3IobGV0IGNvc3RIZWFkRGF0YSBvZiBidWlsZGluZ0Nvc3RIZWFkcykge1xyXG4gICAgICAgICAgaWYoY29zdEhlYWREYXRhLnJhdGVBbmFseXNpc0lkID09PSBjb3N0SGVhZElkKSB7XHJcbiAgICAgICAgICAgIGNhdGVnb3JpZXNMaXN0V2l0aENlbnRyYWxpemVkUmF0ZXMgPSB0aGlzLmdldENhdGVnb3JpZXNMaXN0V2l0aENlbnRyYWxpemVkUmF0ZXMoY29zdEhlYWREYXRhLmNhdGVnb3JpZXMsIGJ1aWxkaW5nLnJhdGVzKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiBjYXRlZ29yaWVzTGlzdFdpdGhDZW50cmFsaXplZFJhdGVzLCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy9HZXQgY2F0ZWdvcmllcyBvZiBwcm9qZWN0Q29zdEhlYWRzIGZyb20gZGF0YWJhc2VcclxuICBnZXRDYXRlZ29yaWVzT2ZQcm9qZWN0Q29zdEhlYWQocHJvamVjdElkOnN0cmluZywgY29zdEhlYWRJZDpudW1iZXIsIHVzZXI6VXNlciwgY2FsbGJhY2s6KGVycm9yOiBhbnksIHJlc3VsdDogYW55KT0+IHZvaWQpIHtcclxuXHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBHZXQgUHJvamVjdCBDb3N0SGVhZCBDYXRlZ29yaWVzIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgdGhpcy5wcm9qZWN0UmVwb3NpdG9yeS5maW5kQnlJZChwcm9qZWN0SWQsIChlcnJvciwgcHJvamVjdDpQcm9qZWN0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgcHJvamVjdENvc3RIZWFkcyA9IHByb2plY3QucHJvamVjdENvc3RIZWFkcztcclxuICAgICAgICBsZXQgY2F0ZWdvcmllc0xpc3RXaXRoQ2VudHJhbGl6ZWRSYXRlcyA6IENhdGVnb3JpZXNMaXN0V2l0aFJhdGVzRFRPO1xyXG5cclxuICAgICAgICBmb3IobGV0IGNvc3RIZWFkRGF0YSBvZiBwcm9qZWN0Q29zdEhlYWRzKSB7XHJcbiAgICAgICAgICBpZiAoY29zdEhlYWREYXRhLnJhdGVBbmFseXNpc0lkID09PSBjb3N0SGVhZElkKSB7XHJcbiAgICAgICAgICAgIGNhdGVnb3JpZXNMaXN0V2l0aENlbnRyYWxpemVkUmF0ZXMgPSB0aGlzLmdldENhdGVnb3JpZXNMaXN0V2l0aENlbnRyYWxpemVkUmF0ZXMoY29zdEhlYWREYXRhLmNhdGVnb3JpZXMsIHByb2plY3QucmF0ZXMpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGE6IGNhdGVnb3JpZXNMaXN0V2l0aENlbnRyYWxpemVkUmF0ZXMsIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvL0dldCBjYXRlZ29yeSBsaXN0IHdpdGggY2VudHJhbGl6ZWQgcmF0ZVxyXG4gIGdldENhdGVnb3JpZXNMaXN0V2l0aENlbnRyYWxpemVkUmF0ZXMoY2F0ZWdvcmllc09mQ29zdEhlYWQ6IEFycmF5PENhdGVnb3J5PiwgY2VudHJhbGl6ZWRSYXRlczogQXJyYXk8Q2VudHJhbGl6ZWRSYXRlPikge1xyXG4gICAgbGV0IGNhdGVnb3JpZXNUb3RhbEFtb3VudCA9IDAgO1xyXG5cclxuICAgIGxldCBjYXRlZ29yaWVzTGlzdFdpdGhSYXRlcyA6IENhdGVnb3JpZXNMaXN0V2l0aFJhdGVzRFRPID0gbmV3IENhdGVnb3JpZXNMaXN0V2l0aFJhdGVzRFRPO1xyXG5cclxuICAgIGZvciAobGV0IGNhdGVnb3J5RGF0YSBvZiBjYXRlZ29yaWVzT2ZDb3N0SGVhZCkge1xyXG4gICAgICBsZXQgd29ya0l0ZW1zID0gdGhpcy5nZXRXb3JrSXRlbUxpc3RXaXRoQ2VudHJhbGl6ZWRSYXRlcyhjYXRlZ29yeURhdGEud29ya0l0ZW1zLCBjZW50cmFsaXplZFJhdGVzLCB0cnVlKTtcclxuICAgICAgbGV0IGNhbGN1bGF0ZVdvcmtJdGVtVG90YWxBbW91bnQgPSAgYWxhc3FsKCdWQUxVRSBPRiBTRUxFQ1QgU1VNKGFtb3VudCkgRlJPTSA/Jyxbd29ya0l0ZW1zXSk7XHJcbiAgICAgIGNhdGVnb3J5RGF0YS5hbW91bnQgPSBjYWxjdWxhdGVXb3JrSXRlbVRvdGFsQW1vdW50O1xyXG4gICAgICBjYXRlZ29yaWVzVG90YWxBbW91bnQgPSBjYXRlZ29yaWVzVG90YWxBbW91bnQgKyBjYWxjdWxhdGVXb3JrSXRlbVRvdGFsQW1vdW50O1xyXG4gICAgICBkZWxldGUgY2F0ZWdvcnlEYXRhLndvcmtJdGVtcztcclxuICAgICAgY2F0ZWdvcmllc0xpc3RXaXRoUmF0ZXMuY2F0ZWdvcmllcy5wdXNoKGNhdGVnb3J5RGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYoY2F0ZWdvcmllc1RvdGFsQW1vdW50ICE9PSAwKSB7XHJcbiAgICAgIGNhdGVnb3JpZXNMaXN0V2l0aFJhdGVzLmNhdGVnb3JpZXNBbW91bnQgPSB0aGlzLmNvbW1vblNlcnZpY2UuZGVjaW1hbENvbnZlcnNpb24oY2F0ZWdvcmllc1RvdGFsQW1vdW50KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY2F0ZWdvcmllc0xpc3RXaXRoUmF0ZXM7XHJcbiAgfVxyXG5cclxuICBzeW5jUHJvamVjdFdpdGhSYXRlQW5hbHlzaXNEYXRhKHByb2plY3RJZDpzdHJpbmcsIGJ1aWxkaW5nSWQ6c3RyaW5nLCB1c2VyOiBVc2VyLCBjYWxsYmFjazogKGVycm9yOmFueSwgcmVzdWx0OmFueSk9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBzeW5jUHJvamVjdFdpdGhSYXRlQW5hbHlzaXNEYXRhIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgdGhpcy5nZXRQcm9qZWN0QW5kQnVpbGRpbmdEZXRhaWxzKHByb2plY3RJZCwgYnVpbGRpbmdJZCwoZXJyb3IsIHByb2plY3RBbmRCdWlsZGluZ0RldGFpbHMpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbG9nZ2VyLmVycm9yKCdQcm9qZWN0IHNlcnZpY2UsIGdldFByb2plY3RBbmRCdWlsZGluZ0RldGFpbHMgZmFpbGVkJyk7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIHN5bmNQcm9qZWN0V2l0aFJhdGVBbmFseXNpc0RhdGEuJyk7XHJcbiAgICAgICAgbGV0IHByb2plY3REYXRhID0gcHJvamVjdEFuZEJ1aWxkaW5nRGV0YWlscy5kYXRhWzBdO1xyXG4gICAgICAgIGxldCBidWlsZGluZ3MgPSBwcm9qZWN0QW5kQnVpbGRpbmdEZXRhaWxzLmRhdGFbMF0uYnVpbGRpbmdzO1xyXG4gICAgICAgIGxldCBidWlsZGluZ0RhdGE6IGFueTtcclxuXHJcbiAgICAgICAgZm9yKGxldCBidWlsZGluZyBvZiBidWlsZGluZ3MpIHtcclxuICAgICAgICAgIGlmKGJ1aWxkaW5nLl9pZCA9PSBidWlsZGluZ0lkKSB7XHJcbiAgICAgICAgICAgIGJ1aWxkaW5nRGF0YSA9IGJ1aWxkaW5nO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHByb2plY3REYXRhLnByb2plY3RDb3N0SGVhZHMubGVuZ3RoID4gMCApIHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIHN5bmNXaXRoUmF0ZUFuYWx5c2lzRGF0YSBidWlsZGluZyBPbmx5LicpO1xyXG4gICAgICAgICAgdGhpcy51cGRhdGVDb3N0SGVhZHNGb3JCdWlsZGluZ0FuZFByb2plY3QoY2FsbGJhY2ssIHByb2plY3REYXRhLCBidWlsZGluZ0RhdGEsIGJ1aWxkaW5nSWQsIHByb2plY3RJZCk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBjYWxsaW5nIHByb21pc2UgZm9yIHN5bmNQcm9qZWN0V2l0aFJhdGVBbmFseXNpc0RhdGEgZm9yIFByb2plY3QgYW5kIEJ1aWxkaW5nLicpO1xyXG4gICAgICAgICAgbGV0IHN5bmNCdWlsZGluZ0Nvc3RIZWFkc1Byb21pc2UgPSB0aGlzLnVwZGF0ZUJ1ZGdldFJhdGVzRm9yQnVpbGRpbmdDb3N0SGVhZHMoQ29uc3RhbnRzLkJVSUxESU5HLFxyXG4gICAgICAgICAgICBidWlsZGluZ0lkLCBwcm9qZWN0RGF0YSwgYnVpbGRpbmdEYXRhKTtcclxuICAgICAgICAgIGxldCBzeW5jUHJvamVjdENvc3RIZWFkc1Byb21pc2UgPSB0aGlzLnVwZGF0ZUJ1ZGdldFJhdGVzRm9yUHJvamVjdENvc3RIZWFkcyhDb25zdGFudHMuQU1FTklUSUVTLFxyXG4gICAgICAgICAgICBwcm9qZWN0SWQsIHByb2plY3REYXRhLCBidWlsZGluZ0RhdGEpO1xyXG5cclxuICAgICAgICAgIENDUHJvbWlzZS5hbGwoW1xyXG4gICAgICAgICAgICBzeW5jQnVpbGRpbmdDb3N0SGVhZHNQcm9taXNlLFxyXG4gICAgICAgICAgICBzeW5jUHJvamVjdENvc3RIZWFkc1Byb21pc2VcclxuICAgICAgICAgIF0pLnRoZW4oZnVuY3Rpb24oZGF0YTogQXJyYXk8YW55Pikge1xyXG4gICAgICAgICAgICBsb2dnZXIuaW5mbygnUHJvbWlzZSBmb3Igc3luY1Byb2plY3RXaXRoUmF0ZUFuYWx5c2lzRGF0YSBmb3IgUHJvamVjdCBhbmQgQnVpbGRpbmcgc3VjY2VzcycpO1xyXG4gICAgICAgICAgICBsZXQgYnVpbGRpbmdDb3N0SGVhZHNEYXRhID0gZGF0YVswXTtcclxuICAgICAgICAgICAgbGV0IHByb2plY3RDb3N0SGVhZHNEYXRhID0gZGF0YVsxXTtcclxuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwge3N0YXR1czoyMDB9KTtcclxuICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGU6YW55KSB7XHJcbiAgICAgICAgICAgIGxvZ2dlci5lcnJvcignIFByb21pc2UgZmFpbGVkIGZvciBzeW5jUHJvamVjdFdpdGhSYXRlQW5hbHlzaXNEYXRhICEgOicgK0pTT04uc3RyaW5naWZ5KGUpKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZUNvc3RIZWFkc0ZvckJ1aWxkaW5nQW5kUHJvamVjdChjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9qZWN0RGF0YTogYW55LCBidWlsZGluZ0RhdGE6IGFueSwgYnVpbGRpbmdJZDogc3RyaW5nLCBwcm9qZWN0SWQ6IHN0cmluZykge1xyXG5cclxuICAgIGxvZ2dlci5pbmZvKCd1cGRhdGVDb3N0SGVhZHNGb3JCdWlsZGluZ0FuZFByb2plY3QgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICBsZXQgcmF0ZUFuYWx5c2lzU2VydmljZSA9IG5ldyBSYXRlQW5hbHlzaXNTZXJ2aWNlKCk7XHJcbiAgICBsZXQgYnVpbGRpbmdSZXBvc2l0b3J5ID0gbmV3IEJ1aWxkaW5nUmVwb3NpdG9yeSgpO1xyXG4gICAgbGV0IHByb2plY3RSZXBvc2l0b3J5ID0gbmV3IFByb2plY3RSZXBvc2l0b3J5KCk7XHJcblxyXG4gICAgcmF0ZUFuYWx5c2lzU2VydmljZS5jb252ZXJ0Q29zdEhlYWRzRnJvbVJhdGVBbmFseXNpc1RvQ29zdENvbnRyb2woQ29uc3RhbnRzLkJVSUxESU5HLFxyXG4gICAgICAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHtcclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgIGxvZ2dlci5lcnJvcignRXJyb3IgaW4gdXBkYXRlQ29zdEhlYWRzRm9yQnVpbGRpbmdBbmRQcm9qZWN0IDogY29udmVydENvc3RIZWFkc0Zyb21SYXRlQW5hbHlzaXNUb0Nvc3RDb250cm9sIDogJyArIEpTT04uc3RyaW5naWZ5KGVycm9yKSk7XHJcbiAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdHZXRBbGxEYXRhRnJvbVJhdGVBbmFseXNpcyBzdWNjZXNzJyk7XHJcbiAgICAgICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgICAgIGxldCBkYXRhID0gcHJvamVjdFNlcnZpY2UuY2FsY3VsYXRlQnVkZ2V0Q29zdEZvckJ1aWxkaW5nKHJlc3VsdC5idWlsZGluZ0Nvc3RIZWFkcywgcHJvamVjdERhdGEsIGJ1aWxkaW5nRGF0YSk7XHJcbiAgICAgICAgICBsZXQgcmF0ZXMgID0gIHRoaXMuZ2V0UmF0ZXMocmVzdWx0LCBkYXRhKTtcclxuICAgICAgICAgIGxldCBxdWVyeUZvckJ1aWxkaW5nID0geydfaWQnOiBidWlsZGluZ0lkfTtcclxuICAgICAgICAgIGxldCB1cGRhdGVDb3N0SGVhZCA9IHskc2V0OiB7J2Nvc3RIZWFkcyc6IGRhdGEsICdyYXRlcyc6IHJhdGVzIH19O1xyXG4gICAgICAgICAgYnVpbGRpbmdSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnlGb3JCdWlsZGluZywgdXBkYXRlQ29zdEhlYWQsIHtuZXc6IHRydWV9LCAoZXJyb3I6IGFueSwgcmVzcG9uc2U6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoJ0Vycm9yIGluIFVwZGF0ZSBjb252ZXJ0Q29zdEhlYWRzRnJvbVJhdGVBbmFseXNpc1RvQ29zdENvbnRyb2wgYnVpbGRpbmdDb3N0SGVhZHNEYXRhICA6ICcgKyBKU09OLnN0cmluZ2lmeShlcnJvcikpO1xyXG4gICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBsb2dnZXIuaW5mbygnVXBkYXRlQnVpbGRpbmdDb3N0SGVhZCBzdWNjZXNzJyk7XHJcbiAgICAgICAgICAgICAgbGV0IHByb2plY3RDb3N0SGVhZHMgPSBwcm9qZWN0U2VydmljZS5jYWxjdWxhdGVCdWRnZXRDb3N0Rm9yQ29tbW9uQW1tZW5pdGllcyhcclxuICAgICAgICAgICAgICAgIHByb2plY3REYXRhLnByb2plY3RDb3N0SGVhZHMscHJvamVjdERhdGEsIGJ1aWxkaW5nRGF0YSk7XHJcbiAgICAgICAgICAgICAgbGV0IHF1ZXJ5Rm9yUHJvamVjdCA9IHsnX2lkJzogcHJvamVjdElkfTtcclxuICAgICAgICAgICAgICBsZXQgdXBkYXRlUHJvamVjdENvc3RIZWFkID0geyRzZXQ6IHsncHJvamVjdENvc3RIZWFkcyc6IHByb2plY3RDb3N0SGVhZHN9fTtcclxuICAgICAgICAgICAgICBsb2dnZXIuaW5mbygnQ2FsbGluZyB1cGRhdGUgcHJvamVjdCBDb3N0aGVhZHMgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgICAgICAgICAgcHJvamVjdFJlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeUZvclByb2plY3QsIHVwZGF0ZVByb2plY3RDb3N0SGVhZCwge25ldzogdHJ1ZX0sXHJcbiAgICAgICAgICAgICAgICAoZXJyb3I6IGFueSwgcmVzcG9uc2U6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZXJyKCdFcnJvciB1cGRhdGUgcHJvamVjdCBDb3N0aGVhZHMgOiAnICsgSlNPTi5zdHJpbmdpZnkoZXJyb3IpKTtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmRlYnVnKCdVcGRhdGUgcHJvamVjdCBDb3N0aGVhZHMgc3VjY2VzcycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVCdWRnZXRSYXRlc0ZvckJ1aWxkaW5nQ29zdEhlYWRzKGVudGl0eTogc3RyaW5nLCBidWlsZGluZ0lkOnN0cmluZywgcHJvamVjdERldGFpbHMgOiBQcm9qZWN0LCBidWlsZGluZ0RldGFpbHMgOiBCdWlsZGluZykge1xyXG4gICAgcmV0dXJuIG5ldyBDQ1Byb21pc2UoZnVuY3Rpb24ocmVzb2x2ZTphbnksIHJlamVjdDphbnkpIHtcclxuICAgICAgbGV0IHJhdGVBbmFseXNpc1NlcnZpY2UgPSBuZXcgUmF0ZUFuYWx5c2lzU2VydmljZSgpO1xyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgbGV0IGJ1aWxkaW5nUmVwb3NpdG9yeSA9IG5ldyBCdWlsZGluZ1JlcG9zaXRvcnkoKTtcclxuICAgICAgbG9nZ2VyLmluZm8oJ0luc2lkZSB1cGRhdGVCdWRnZXRSYXRlc0ZvckJ1aWxkaW5nQ29zdEhlYWRzIHByb21pc2UuJyk7XHJcbiAgICAgIHJhdGVBbmFseXNpc1NlcnZpY2UuY29udmVydENvc3RIZWFkc0Zyb21SYXRlQW5hbHlzaXNUb0Nvc3RDb250cm9sKGVudGl0eSwgKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICBsb2dnZXIuZXJyKCdFcnJvciBpbiBwcm9taXNlIHVwZGF0ZUJ1ZGdldFJhdGVzRm9yQnVpbGRpbmdDb3N0SGVhZHMgOiAnICsgSlNPTi5zdHJpbmdpZnkoZXJyb3IpKTtcclxuICAgICAgICAgIHJlamVjdChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdJbnNpZGUgdXBkYXRlQnVkZ2V0UmF0ZXNGb3JCdWlsZGluZ0Nvc3RIZWFkcyBzdWNjZXNzJyk7XHJcbiAgICAgICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgICAgIGxldCBidWlsZGluZ0Nvc3RIZWFkcyA9IHByb2plY3RTZXJ2aWNlLmNhbGN1bGF0ZUJ1ZGdldENvc3RGb3JCdWlsZGluZyhyZXN1bHQuYnVpbGRpbmdDb3N0SGVhZHMsIHByb2plY3REZXRhaWxzLCBidWlsZGluZ0RldGFpbHMpO1xyXG4gICAgICAgICAgbGV0IHJhdGVzICA9IHByb2plY3RTZXJ2aWNlLmdldFJhdGVzKHJlc3VsdCwgYnVpbGRpbmdDb3N0SGVhZHMpO1xyXG4gICAgICAgICAgbGV0IHF1ZXJ5ID0geydfaWQnOiBidWlsZGluZ0lkfTtcclxuICAgICAgICAgIGxldCBuZXdEYXRhID0geyRzZXQ6IHsnY29zdEhlYWRzJzogYnVpbGRpbmdDb3N0SGVhZHMsICdyYXRlcyc6IHJhdGVzfX07XHJcbiAgICAgICAgICBidWlsZGluZ1JlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgbmV3RGF0YSwge25ldzogdHJ1ZX0sIChlcnJvcjphbnksIHJlc3BvbnNlOmFueSkgPT4ge1xyXG4gICAgICAgICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBnZXRBbGxEYXRhRnJvbVJhdGVBbmFseXNpcyBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKCdFcnJvciBpbiBVcGRhdGUgYnVpbGRpbmdDb3N0SGVhZHNEYXRhICA6ICcrSlNPTi5zdHJpbmdpZnkoZXJyb3IpKTtcclxuICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnVXBkYXRlZCBidWlsZGluZ0Nvc3RIZWFkc0RhdGEnKTtcclxuICAgICAgICAgICAgICByZXNvbHZlKCdEb25lJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9KS5jYXRjaChmdW5jdGlvbihlOmFueSl7XHJcbiAgICAgIGxvZ2dlci5lcnJvcignRXJyb3IgaW4gdXBkYXRlQnVkZ2V0UmF0ZXNGb3JCdWlsZGluZ0Nvc3RIZWFkcyA6JytlKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0UmF0ZXMocmVzdWx0OiBhbnksIGNvc3RIZWFkczogQXJyYXk8Q29zdEhlYWQ+KSB7XHJcbiAgICBsZXQgZ2V0UmF0ZXNMaXN0U1FMID0gJ1NFTEVDVCAqIEZST00gPyBBUyBxIFdIRVJFIHEuQzQgSU4gKFNFTEVDVCB0LnJhdGVBbmFseXNpc0lkICcgK1xyXG4gICAgICAnRlJPTSA/IEFTIHQpJztcclxuICAgIGxldCByYXRlSXRlbXMgPSBhbGFzcWwoZ2V0UmF0ZXNMaXN0U1FMLCBbcmVzdWx0LnJhdGVzLCBjb3N0SGVhZHNdKTtcclxuXHJcbiAgICBsZXQgcmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzU1FMID0gJ1NFTEVDVCByYXRlSXRlbS5DMiBBUyBpdGVtTmFtZSwgcmF0ZUl0ZW0uQzIgQVMgb3JpZ2luYWxJdGVtTmFtZSwnICtcclxuICAgICAgJ3JhdGVJdGVtLkMxMiBBUyByYXRlQW5hbHlzaXNJZCwgcmF0ZUl0ZW0uQzYgQVMgdHlwZSwnICtcclxuICAgICAgJ1JPVU5EKHJhdGVJdGVtLkM3LDIpIEFTIHF1YW50aXR5LCBST1VORChyYXRlSXRlbS5DMywyKSBBUyByYXRlLCB1bml0LkMyIEFTIHVuaXQsJyArXHJcbiAgICAgICdST1VORChyYXRlSXRlbS5DMyAqIHJhdGVJdGVtLkM3LDIpIEFTIHRvdGFsQW1vdW50LCByYXRlSXRlbS5DNSBBUyB0b3RhbFF1YW50aXR5ICcgK1xyXG4gICAgICAnRlJPTSA/IEFTIHJhdGVJdGVtIEpPSU4gPyBBUyB1bml0IE9OIHVuaXQuQzEgPSByYXRlSXRlbS5DOSc7XHJcblxyXG4gICAgbGV0IHJhdGVJdGVtc0xpc3QgPSBhbGFzcWwocmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzU1FMLCBbcmF0ZUl0ZW1zLCByZXN1bHQudW5pdHNdKTtcclxuXHJcbiAgICBsZXQgZGlzdGluY3RJdGVtc1NRTCA9ICdzZWxlY3QgRElTVElOQ1QgaXRlbU5hbWUsb3JpZ2luYWxJdGVtTmFtZSxyYXRlIEZST00gPyc7XHJcbiAgICB2YXIgZGlzdGluY3RSYXRlcyA9IGFsYXNxbCAoZGlzdGluY3RJdGVtc1NRTCwgW3JhdGVJdGVtc0xpc3RdKTtcclxuXHJcbiAgICByZXR1cm4gZGlzdGluY3RSYXRlcztcclxuICB9XHJcblxyXG4gIHVwZGF0ZUJ1ZGdldFJhdGVzRm9yUHJvamVjdENvc3RIZWFkcyhlbnRpdHk6IHN0cmluZywgcHJvamVjdElkOnN0cmluZywgcHJvamVjdERldGFpbHMgOiBQcm9qZWN0LCBidWlsZGluZ0RldGFpbHMgOiBCdWlsZGluZykge1xyXG4gICAgcmV0dXJuIG5ldyBDQ1Byb21pc2UoZnVuY3Rpb24ocmVzb2x2ZTphbnksIHJlamVjdDphbnkpe1xyXG4gICAgICBsZXQgcmF0ZUFuYWx5c2lzU2VydmljZSA9IG5ldyBSYXRlQW5hbHlzaXNTZXJ2aWNlKCk7XHJcbiAgICAgIGxldCBwcm9qZWN0UmVwb3NpdG9yeSA9IG5ldyBQcm9qZWN0UmVwb3NpdG9yeSgpO1xyXG4gICAgICBsb2dnZXIuaW5mbygnSW5zaWRlIHVwZGF0ZUJ1ZGdldFJhdGVzRm9yUHJvamVjdENvc3RIZWFkcyBwcm9taXNlLicpO1xyXG4gICAgICByYXRlQW5hbHlzaXNTZXJ2aWNlLmNvbnZlcnRDb3N0SGVhZHNGcm9tUmF0ZUFuYWx5c2lzVG9Db3N0Q29udHJvbChlbnRpdHksIChlcnJvciA6IGFueSwgcmVzdWx0OiBhbnkpID0+IHtcclxuICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgbG9nZ2VyLmVycignRXJyb3IgaW4gdXBkYXRlQnVkZ2V0UmF0ZXNGb3JQcm9qZWN0Q29zdEhlYWRzIHByb21pc2UgOiAnICsgSlNPTi5zdHJpbmdpZnkoZXJyb3IpKTtcclxuICAgICAgICAgIHJlamVjdChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IHByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcbiAgICAgICAgICAgIGxldCBwcm9qZWN0Q29zdEhlYWRzID0gcHJvamVjdFNlcnZpY2UuY2FsY3VsYXRlQnVkZ2V0Q29zdEZvckNvbW1vbkFtbWVuaXRpZXMoXHJcbiAgICAgICAgICAgICAgcmVzdWx0LmJ1aWxkaW5nQ29zdEhlYWRzLCBwcm9qZWN0RGV0YWlscywgYnVpbGRpbmdEZXRhaWxzKTtcclxuICAgICAgICAgICAgbGV0IHJhdGVzICA9IHByb2plY3RTZXJ2aWNlLmdldFJhdGVzKHJlc3VsdCwgcHJvamVjdENvc3RIZWFkcyk7XHJcbiAgICAgICAgICAgIGxldCBxdWVyeSA9IHsnX2lkJzogcHJvamVjdElkfTtcclxuICAgICAgICAgICAgbGV0IG5ld0RhdGEgPSB7JHNldDogeydwcm9qZWN0Q29zdEhlYWRzJzogcHJvamVjdENvc3RIZWFkcywgJ3JhdGVzJzogcmF0ZXN9fTtcclxuICAgICAgICAgICAgcHJvamVjdFJlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgbmV3RGF0YSwge25ldzogdHJ1ZX0sIChlcnJvcjogYW55LCByZXNwb25zZTogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZ2V0QWxsRGF0YUZyb21SYXRlQW5hbHlzaXMgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoJ0Vycm9yIGluIFVwZGF0ZSBidWlsZGluZ0Nvc3RIZWFkc0RhdGEgIDogJytKU09OLnN0cmluZ2lmeShlcnJvcikpO1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbG9nZ2VyLmRlYnVnKCdVcGRhdGVkIHByb2plY3RDb3N0SGVhZHMnKTtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoJ0RvbmUnKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGU6YW55KXtcclxuICAgICAgbG9nZ2VyLmVycm9yKCdFcnJvciBpbiB1cGRhdGVCdWRnZXRSYXRlc0ZvclByb2plY3RDb3N0SGVhZHMgOicrZSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGNhbGN1bGF0ZUJ1ZGdldENvc3RGb3JCdWlsZGluZyhjb3N0SGVhZHNSYXRlQW5hbHlzaXM6IGFueSwgcHJvamVjdERldGFpbHMgOiBQcm9qZWN0LCBidWlsZGluZ0RldGFpbHMgOiBhbnkpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGNhbGN1bGF0ZUJ1ZGdldENvc3RGb3JCdWlsZGluZyBoYXMgYmVlbiBoaXQnKTtcclxuICAgIGxldCBjb3N0SGVhZHM6QXJyYXk8Q29zdEhlYWQ+ID0gbmV3IEFycmF5PENvc3RIZWFkPigpO1xyXG4gICAgbGV0IGJ1ZGdldGVkQ29zdEFtb3VudDogbnVtYmVyO1xyXG4gICAgbGV0IGNhbGN1bGF0ZUJ1ZGd0ZWRDb3N0IDogc3RyaW5nO1xyXG5cclxuICAgIGZvcihsZXQgY29zdEhlYWQgb2YgY29zdEhlYWRzUmF0ZUFuYWx5c2lzKSB7XHJcblxyXG4gICAgICBsZXQgYnVkZ2V0Q29zdEZvcm11bGFlOnN0cmluZztcclxuXHJcbiAgICAgIHN3aXRjaChjb3N0SGVhZC5uYW1lKSB7XHJcblxyXG4gICAgICAgICAgY2FzZSBDb25zdGFudHMuUkNDX0JBTkRfT1JfUEFUTEkgOiB7XHJcbiAgICAgICAgICAgIGJ1ZGdldENvc3RGb3JtdWxhZSA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLkJVREdFVEVEX0NPU1RfRk9STVVMQUUgKyBjb3N0SGVhZC5uYW1lKS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICBjYWxjdWxhdGVCdWRndGVkQ29zdCA9IGJ1ZGdldENvc3RGb3JtdWxhZS5yZXBsYWNlKENvbnN0YW50cy5TTEFCX0FSRUEsIHByb2plY3REZXRhaWxzLnNsYWJBcmVhKTtcclxuICAgICAgICAgICAgYnVkZ2V0ZWRDb3N0QW1vdW50ID0gZXZhbChjYWxjdWxhdGVCdWRndGVkQ29zdCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlVGh1bWJSdWxlUmVwb3J0Rm9yQ29zdEhlYWQoYnVkZ2V0ZWRDb3N0QW1vdW50LCBjb3N0SGVhZCwgYnVpbGRpbmdEZXRhaWxzLCBjb3N0SGVhZHMpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNhc2UgQ29uc3RhbnRzLkVYVEVSTkFMX1BMQVNURVIgOiB7XHJcbiAgICAgICAgICAgIGJ1ZGdldENvc3RGb3JtdWxhZSA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLkJVREdFVEVEX0NPU1RfRk9STVVMQUUgKyBjb3N0SGVhZC5uYW1lKS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICBjYWxjdWxhdGVCdWRndGVkQ29zdCA9IGJ1ZGdldENvc3RGb3JtdWxhZS5yZXBsYWNlKENvbnN0YW50cy5DQVJQRVRfQVJFQSwgYnVpbGRpbmdEZXRhaWxzLnRvdGFsQ2FycGV0QXJlYU9mVW5pdCk7XHJcbiAgICAgICAgICAgIGJ1ZGdldGVkQ29zdEFtb3VudCA9IGV2YWwoY2FsY3VsYXRlQnVkZ3RlZENvc3QpO1xyXG4gICAgICAgICAgICB0aGlzLmNhbGN1bGF0ZVRodW1iUnVsZVJlcG9ydEZvckNvc3RIZWFkKGJ1ZGdldGVkQ29zdEFtb3VudCwgY29zdEhlYWQsIGJ1aWxkaW5nRGV0YWlscywgY29zdEhlYWRzKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBjYXNlIENvbnN0YW50cy5GQUJSSUNBVElPTiA6IHtcclxuICAgICAgICAgICAgYnVkZ2V0Q29zdEZvcm11bGFlID0gY29uZmlnLmdldChDb25zdGFudHMuQlVER0VURURfQ09TVF9GT1JNVUxBRSArIGNvc3RIZWFkLm5hbWUpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIGNhbGN1bGF0ZUJ1ZGd0ZWRDb3N0ID0gYnVkZ2V0Q29zdEZvcm11bGFlLnJlcGxhY2UoQ29uc3RhbnRzLkNBUlBFVF9BUkVBLCBidWlsZGluZ0RldGFpbHMudG90YWxDYXJwZXRBcmVhT2ZVbml0KTtcclxuICAgICAgICAgICAgYnVkZ2V0ZWRDb3N0QW1vdW50ID0gZXZhbChjYWxjdWxhdGVCdWRndGVkQ29zdCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlVGh1bWJSdWxlUmVwb3J0Rm9yQ29zdEhlYWQoYnVkZ2V0ZWRDb3N0QW1vdW50LCBjb3N0SGVhZCwgYnVpbGRpbmdEZXRhaWxzLCBjb3N0SGVhZHMpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNhc2UgQ29uc3RhbnRzLlBPSU5USU5HIDoge1xyXG4gICAgICAgICAgICBidWRnZXRDb3N0Rm9ybXVsYWUgPSBjb25maWcuZ2V0KENvbnN0YW50cy5CVURHRVRFRF9DT1NUX0ZPUk1VTEFFICsgY29zdEhlYWQubmFtZSkudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgY2FsY3VsYXRlQnVkZ3RlZENvc3QgPSBidWRnZXRDb3N0Rm9ybXVsYWUucmVwbGFjZShDb25zdGFudHMuQ0FSUEVUX0FSRUEsIGJ1aWxkaW5nRGV0YWlscy50b3RhbENhcnBldEFyZWFPZlVuaXQpO1xyXG4gICAgICAgICAgICBidWRnZXRlZENvc3RBbW91bnQgPSBldmFsKGNhbGN1bGF0ZUJ1ZGd0ZWRDb3N0KTtcclxuICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVUaHVtYlJ1bGVSZXBvcnRGb3JDb3N0SGVhZChidWRnZXRlZENvc3RBbW91bnQsIGNvc3RIZWFkLCBidWlsZGluZ0RldGFpbHMsIGNvc3RIZWFkcyk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY2FzZSBDb25zdGFudHMuS0lUQ0hFTl9PVFRBIDoge1xyXG4gICAgICAgICAgICBidWRnZXRDb3N0Rm9ybXVsYWUgPSBjb25maWcuZ2V0KENvbnN0YW50cy5CVURHRVRFRF9DT1NUX0ZPUk1VTEFFICsgY29zdEhlYWQubmFtZSkudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgY2FsY3VsYXRlQnVkZ3RlZENvc3QgPSBidWRnZXRDb3N0Rm9ybXVsYWUucmVwbGFjZShDb25zdGFudHMuTlVNX09GX09ORV9CSEssIGJ1aWxkaW5nRGV0YWlscy5udW1PZk9uZUJISylcclxuICAgICAgICAgICAgICAucmVwbGFjZShDb25zdGFudHMuTlVNX09GX1RXT19CSEssIGJ1aWxkaW5nRGV0YWlscy5udW1PZlR3b0JISylcclxuICAgICAgICAgICAgICAucmVwbGFjZShDb25zdGFudHMuTlVNX09GX1RIUkVFX0JISywgYnVpbGRpbmdEZXRhaWxzLm51bU9mVGhyZWVCSEspXHJcbiAgICAgICAgICAgICAgLnJlcGxhY2UoQ29uc3RhbnRzLk5VTV9PRl9GT1VSX0JISywgYnVpbGRpbmdEZXRhaWxzLm51bU9mRm91ckJISylcclxuICAgICAgICAgICAgICAucmVwbGFjZShDb25zdGFudHMuTlVNX09GX0ZJVkVfQkhLLCBidWlsZGluZ0RldGFpbHMubnVtT2ZGaXZlQkhLKTtcclxuICAgICAgICAgICAgYnVkZ2V0ZWRDb3N0QW1vdW50ID0gZXZhbChjYWxjdWxhdGVCdWRndGVkQ29zdCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNhbGN1bGF0ZVRodW1iUnVsZVJlcG9ydEZvckNvc3RIZWFkKGJ1ZGdldGVkQ29zdEFtb3VudCwgY29zdEhlYWQsIGJ1aWxkaW5nRGV0YWlscywgY29zdEhlYWRzKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBjYXNlIENvbnN0YW50cy5TT0xJTkcgOiB7XHJcbiAgICAgICAgICAgIGJ1ZGdldENvc3RGb3JtdWxhZSA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLkJVREdFVEVEX0NPU1RfRk9STVVMQUUgKyBjb3N0SGVhZC5uYW1lKS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICBjYWxjdWxhdGVCdWRndGVkQ29zdCA9IGJ1ZGdldENvc3RGb3JtdWxhZS5yZXBsYWNlKENvbnN0YW50cy5QTElOVEhfQVJFQSwgYnVpbGRpbmdEZXRhaWxzLnBsaW50aEFyZWEpO1xyXG4gICAgICAgICAgICBidWRnZXRlZENvc3RBbW91bnQgPSBldmFsKGNhbGN1bGF0ZUJ1ZGd0ZWRDb3N0KTtcclxuICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVUaHVtYlJ1bGVSZXBvcnRGb3JDb3N0SGVhZChidWRnZXRlZENvc3RBbW91bnQsIGNvc3RIZWFkLCBidWlsZGluZ0RldGFpbHMsIGNvc3RIZWFkcyk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY2FzZSBDb25zdGFudHMuTUFTT05SWSA6IHtcclxuICAgICAgICAgICAgYnVkZ2V0Q29zdEZvcm11bGFlID0gY29uZmlnLmdldChDb25zdGFudHMuQlVER0VURURfQ09TVF9GT1JNVUxBRSArIGNvc3RIZWFkLm5hbWUpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIGNhbGN1bGF0ZUJ1ZGd0ZWRDb3N0ID0gYnVkZ2V0Q29zdEZvcm11bGFlLnJlcGxhY2UoQ29uc3RhbnRzLkNBUlBFVF9BUkVBLCBidWlsZGluZ0RldGFpbHMudG90YWxDYXJwZXRBcmVhT2ZVbml0KTtcclxuICAgICAgICAgICAgYnVkZ2V0ZWRDb3N0QW1vdW50ID0gZXZhbChjYWxjdWxhdGVCdWRndGVkQ29zdCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlVGh1bWJSdWxlUmVwb3J0Rm9yQ29zdEhlYWQoYnVkZ2V0ZWRDb3N0QW1vdW50LCBjb3N0SGVhZCwgYnVpbGRpbmdEZXRhaWxzLCBjb3N0SGVhZHMpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNhc2UgQ29uc3RhbnRzLklOVEVSTkFMX1BMQVNURVIgOiB7XHJcbiAgICAgICAgICAgIGJ1ZGdldENvc3RGb3JtdWxhZSA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLkJVREdFVEVEX0NPU1RfRk9STVVMQUUgKyBjb3N0SGVhZC5uYW1lKS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICBjYWxjdWxhdGVCdWRndGVkQ29zdCA9IGJ1ZGdldENvc3RGb3JtdWxhZS5yZXBsYWNlKENvbnN0YW50cy5DQVJQRVRfQVJFQSwgYnVpbGRpbmdEZXRhaWxzLnRvdGFsQ2FycGV0QXJlYU9mVW5pdCk7XHJcbiAgICAgICAgICAgIGJ1ZGdldGVkQ29zdEFtb3VudCA9IGV2YWwoY2FsY3VsYXRlQnVkZ3RlZENvc3QpO1xyXG4gICAgICAgICAgICB0aGlzLmNhbGN1bGF0ZVRodW1iUnVsZVJlcG9ydEZvckNvc3RIZWFkKGJ1ZGdldGVkQ29zdEFtb3VudCwgY29zdEhlYWQsIGJ1aWxkaW5nRGV0YWlscywgY29zdEhlYWRzKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBjYXNlIENvbnN0YW50cy5HWVBTVU1fT1JfUE9QX1BMQVNURVIgOiB7XHJcbiAgICAgICAgICAgIGJ1ZGdldENvc3RGb3JtdWxhZSA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLkJVREdFVEVEX0NPU1RfRk9STVVMQUUgKyBjb3N0SGVhZC5uYW1lKS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICBjYWxjdWxhdGVCdWRndGVkQ29zdCA9IGJ1ZGdldENvc3RGb3JtdWxhZS5yZXBsYWNlKENvbnN0YW50cy5DQVJQRVRfQVJFQSwgYnVpbGRpbmdEZXRhaWxzLnRvdGFsQ2FycGV0QXJlYU9mVW5pdCk7XHJcbiAgICAgICAgICAgIGJ1ZGdldGVkQ29zdEFtb3VudCA9IGV2YWwoY2FsY3VsYXRlQnVkZ3RlZENvc3QpO1xyXG4gICAgICAgICAgICB0aGlzLmNhbGN1bGF0ZVRodW1iUnVsZVJlcG9ydEZvckNvc3RIZWFkKGJ1ZGdldGVkQ29zdEFtb3VudCwgY29zdEhlYWQsIGJ1aWxkaW5nRGV0YWlscywgY29zdEhlYWRzKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBkZWZhdWx0IDoge1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNvc3RIZWFkcztcclxuICB9XHJcblxyXG4gIGNhbGN1bGF0ZUJ1ZGdldENvc3RGb3JDb21tb25BbW1lbml0aWVzKGNvc3RIZWFkc1JhdGVBbmFseXNpczogYW55LCBwcm9qZWN0RGV0YWlscyA6IFByb2plY3QsIGJ1aWxkaW5nRGV0YWlscyA6IGFueSkge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgY2FsY3VsYXRlQnVkZ2V0Q29zdEZvckNvbW1vbkFtbWVuaXRpZXMgaGFzIGJlZW4gaGl0Jyk7XHJcblxyXG4gICAgbGV0IGNvc3RIZWFkczpBcnJheTxDb3N0SGVhZD4gPSBuZXcgQXJyYXk8Q29zdEhlYWQ+KCk7XHJcbiAgICBsZXQgYnVkZ2V0ZWRDb3N0QW1vdW50OiBudW1iZXI7XHJcbiAgICBsZXQgYnVkZ2V0Q29zdEZvcm11bGFlOnN0cmluZztcclxuICAgIGxldCBjYWxjdWxhdGVCdWRndGVkQ29zdCA6c3RyaW5nO1xyXG5cclxuICAgIGxldCBjYWxjdWxhdGVQcm9qZWN0RGF0YSA9ICdTRUxFQ1QgU1VNKGJ1aWxkaW5nLnRvdGFsQ2FycGV0QXJlYU9mVW5pdCkgQVMgdG90YWxDYXJwZXRBcmVhLCAnICtcclxuICAgICAgJ1NVTShidWlsZGluZy50b3RhbFNsYWJBcmVhKSBBUyB0b3RhbFNsYWJBcmVhUHJvamVjdCwnICtcclxuICAgICAgJ1NVTShidWlsZGluZy50b3RhbFNhbGVhYmxlQXJlYU9mVW5pdCkgQVMgdG90YWxTYWxlYWJsZUFyZWEgIEZST00gPyBBUyBidWlsZGluZyc7XHJcbiAgICBsZXQgcHJvamVjdERhdGEgPSBhbGFzcWwoY2FsY3VsYXRlUHJvamVjdERhdGEsIFtwcm9qZWN0RGV0YWlscy5idWlsZGluZ3NdKTtcclxuICAgIGxldCB0b3RhbFNsYWJBcmVhT2ZQcm9qZWN0IDogbnVtYmVyID0gcHJvamVjdERhdGFbMF0udG90YWxTbGFiQXJlYVByb2plY3Q7XHJcbiAgICBsZXQgdG90YWxTYWxlYWJsZUFyZWFPZlByb2plY3QgOiBudW1iZXIgPSBwcm9qZWN0RGF0YVswXS50b3RhbFNhbGVhYmxlQXJlYTtcclxuICAgIGxldCB0b3RhbENhcnBldEFyZWFPZlByb2plY3QgOiBudW1iZXIgPSBwcm9qZWN0RGF0YVswXS50b3RhbENhcnBldEFyZWE7XHJcblxyXG4gICAgZm9yKGxldCBjb3N0SGVhZCBvZiBjb3N0SGVhZHNSYXRlQW5hbHlzaXMpIHtcclxuXHJcbiAgICAgIHN3aXRjaChjb3N0SGVhZC5uYW1lKSB7XHJcblxyXG4gICAgICAgICAgY2FzZSBDb25zdGFudHMuU0FGRVRZX01FQVNVUkVTIDoge1xyXG4gICAgICAgICAgICBidWRnZXRDb3N0Rm9ybXVsYWUgPSBjb25maWcuZ2V0KENvbnN0YW50cy5CVURHRVRFRF9DT1NUX0ZPUk1VTEFFICsgY29zdEhlYWQubmFtZSkudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgY2FsY3VsYXRlQnVkZ3RlZENvc3QgPSBidWRnZXRDb3N0Rm9ybXVsYWUucmVwbGFjZShDb25zdGFudHMuQ0FSUEVUX0FSRUEsIHRvdGFsQ2FycGV0QXJlYU9mUHJvamVjdCk7XHJcbiAgICAgICAgICAgIGJ1ZGdldGVkQ29zdEFtb3VudCA9IGV2YWwoY2FsY3VsYXRlQnVkZ3RlZENvc3QpO1xyXG4gICAgICAgICAgICB0aGlzLmNhbGN1bGF0ZVRodW1iUnVsZVJlcG9ydEZvclByb2plY3RDb3N0SGVhZChidWRnZXRlZENvc3RBbW91bnQsIGNvc3RIZWFkLCBwcm9qZWN0RGV0YWlscywgY29zdEhlYWRzKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBkZWZhdWx0IDoge1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIHJldHVybiBjb3N0SGVhZHM7XHJcbiAgfVxyXG5cclxuICBhZGROZXdDZW50cmFsaXplZFJhdGVGb3JCdWlsZGluZyhidWlsZGluZ0lkOiBzdHJpbmcsIHJhdGVJdGVtOmFueSkge1xyXG4gICAgcmV0dXJuIG5ldyBDQ1Byb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSA6IGFueSwgcmVqZWN0IDogYW55KXtcclxuICAgICAgbG9nZ2VyLmluZm8oJ2NyZWF0ZVByb21pc2VGb3JBZGRpbmdOZXdSYXRlSXRlbSBoYXMgYmVlbiBoaXQgZm9yIGJ1aWxkaW5nSWQ6ICcrYnVpbGRpbmdJZCsnLCByYXRlSXRlbSA6ICcrcmF0ZUl0ZW0pO1xyXG5cclxuICAgICAgbGV0IGJ1aWxkaW5nUmVwb3NpdG9yeSA9IG5ldyBCdWlsZGluZ1JlcG9zaXRvcnkoKTtcclxuICAgICAgbGV0IHF1ZXJ5QWRkTmV3UmF0ZUl0ZW0gPSB7J19pZCcgOiBidWlsZGluZ0lkfTtcclxuICAgICAgbGV0IGFkZE5ld1JhdGVSYXRlRGF0YSA9IHsgJHB1c2ggOiB7J3JhdGVzJyA6IHJhdGVJdGVtIH0gfTtcclxuICAgICAgYnVpbGRpbmdSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnlBZGROZXdSYXRlSXRlbSwgYWRkTmV3UmF0ZVJhdGVEYXRhLHtuZXc6IHRydWV9LCAoZXJyb3I6RXJyb3IsIHJlc3VsdDpCdWlsZGluZykgPT4ge1xyXG4gICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9KS5jYXRjaChmdW5jdGlvbihlOmFueSkge1xyXG4gICAgICBsb2dnZXIuZXJyb3IoJ1Byb21pc2UgZmFpbGVkIGZvciBpbmRpdmlkdWFsIGNyZWF0ZVByb21pc2VGb3JBZGRpbmdOZXdSYXRlSXRlbSEgZXJyb3IgOicgK0pTT04uc3RyaW5naWZ5KGUpKTtcclxuICAgICAgQ0NQcm9taXNlLnJlamVjdChlKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlQ2VudHJhbGl6ZWRSYXRlRm9yQnVpbGRpbmcoYnVpbGRpbmdJZDogc3RyaW5nLCByYXRlSXRlbSA6c3RyaW5nLCByYXRlSXRlbVJhdGUgOiBudW1iZXIpIHtcclxuICAgIHJldHVybiBuZXcgQ0NQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUgOiBhbnksIHJlamVjdCA6IGFueSl7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdjcmVhdGVQcm9taXNlRm9yUmF0ZVVwZGF0ZSBoYXMgYmVlbiBoaXQgZm9yIGJ1aWxkaW5nSWQgOiAnK2J1aWxkaW5nSWQrJywgcmF0ZUl0ZW0gOiAnK3JhdGVJdGVtKTtcclxuICAgICAgLy91cGRhdGUgcmF0ZVxyXG4gICAgICBsZXQgYnVpbGRpbmdSZXBvc2l0b3J5ID0gbmV3IEJ1aWxkaW5nUmVwb3NpdG9yeSgpO1xyXG4gICAgICBsZXQgcXVlcnlVcGRhdGVSYXRlID0geydfaWQnIDogYnVpbGRpbmdJZCwgJ3JhdGVzLml0ZW1OYW1lJzpyYXRlSXRlbX07XHJcbiAgICAgIGxldCB1cGRhdGVSYXRlID0geyAkc2V0IDogeydyYXRlcy4kLnJhdGUnIDogcmF0ZUl0ZW1SYXRlfSB9O1xyXG4gICAgICBidWlsZGluZ1JlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeVVwZGF0ZVJhdGUsIHVwZGF0ZVJhdGUse25ldzogdHJ1ZX0sIChlcnJvcjpFcnJvciwgcmVzdWx0OkJ1aWxkaW5nKSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnUmF0ZSBVcGRhdGVkJyk7XHJcbiAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGU6YW55KSB7XHJcbiAgICAgIGxvZ2dlci5lcnJvcignUHJvbWlzZSBmYWlsZWQgZm9yIGluZGl2aWR1YWwgY3JlYXRlUHJvbWlzZUZvclJhdGVVcGRhdGUgISBFcnJvcjogJyArSlNPTi5zdHJpbmdpZnkoZSkpO1xyXG4gICAgICBDQ1Byb21pc2UucmVqZWN0KGUpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBhZGROZXdDZW50cmFsaXplZFJhdGVGb3JQcm9qZWN0KHByb2plY3RJZDogc3RyaW5nLCByYXRlSXRlbTphbnkpIHtcclxuICAgIHJldHVybiBuZXcgQ0NQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUgOiBhbnksIHJlamVjdCA6IGFueSl7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdjcmVhdGVQcm9taXNlRm9yQWRkaW5nTmV3UmF0ZUl0ZW1JblByb2plY3RSYXRlcyBoYXMgYmVlbiBoaXQgZm9yIHByb2plY3RJZCA6ICcrcHJvamVjdElkKycsIHJhdGVJdGVtIDogJytyYXRlSXRlbSk7XHJcblxyXG4gICAgICBsZXQgcHJvamVjdFJlcG9zaXRvcnkgPSBuZXcgUHJvamVjdFJlcG9zaXRvcnkoKTtcclxuICAgICAgbGV0IGFkZE5ld1JhdGVJdGVtUXVlcnlQcm9qZWN0ID0geydfaWQnIDogcHJvamVjdElkfTtcclxuICAgICAgbGV0IGFkZE5ld1JhdGVSYXRlRGF0YVByb2plY3QgPSB7ICRwdXNoIDogeydyYXRlcycgOiByYXRlSXRlbSB9IH07XHJcbiAgICAgIHByb2plY3RSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUoYWRkTmV3UmF0ZUl0ZW1RdWVyeVByb2plY3QsIGFkZE5ld1JhdGVSYXRlRGF0YVByb2plY3QsXHJcbiAgICAgICAge25ldzogdHJ1ZX0sIChlcnJvcjpFcnJvciwgcmVzdWx0OkJ1aWxkaW5nKSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGU6YW55KSB7XHJcbiAgICAgIGxvZ2dlci5lcnJvcignUHJvbWlzZSBmYWlsZWQgZm9yIGluZGl2aWR1YWwgY3JlYXRlUHJvbWlzZUZvckFkZGluZ05ld1JhdGVJdGVtSW5Qcm9qZWN0UmF0ZXMgISBlcnJvciA6JyArSlNPTi5zdHJpbmdpZnkoZSkpO1xyXG4gICAgICBDQ1Byb21pc2UucmVqZWN0KGUpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVDZW50cmFsaXplZFJhdGVGb3JQcm9qZWN0KHByb2plY3RJZDogc3RyaW5nLCByYXRlSXRlbSA6c3RyaW5nLCByYXRlSXRlbVJhdGUgOiBudW1iZXIpIHtcclxuICAgIHJldHVybiBuZXcgQ0NQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUgOiBhbnksIHJlamVjdCA6IGFueSl7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdjcmVhdGVQcm9taXNlRm9yUmF0ZVVwZGF0ZU9mUHJvamVjdFJhdGVzIGhhcyBiZWVuIGhpdCBmb3IgcHJvamVjdElkIDogJytwcm9qZWN0SWQrJywgcmF0ZUl0ZW0gOiAnK3JhdGVJdGVtKTtcclxuICAgICAgLy91cGRhdGUgcmF0ZVxyXG4gICAgICBsZXQgcHJvamVjdFJlcG9zaXRvcnkgPSBuZXcgUHJvamVjdFJlcG9zaXRvcnkoKTtcclxuICAgICAgbGV0IHF1ZXJ5VXBkYXRlUmF0ZUZvclByb2plY3QgPSB7J19pZCcgOiBwcm9qZWN0SWQsICdyYXRlcy5pdGVtJzpyYXRlSXRlbX07XHJcbiAgICAgIGxldCB1cGRhdGVSYXRlRm9yUHJvamVjdCA9IHsgJHNldCA6IHsncmF0ZXMuJC5yYXRlJyA6IHJhdGVJdGVtUmF0ZX0gfTtcclxuICAgICAgcHJvamVjdFJlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeVVwZGF0ZVJhdGVGb3JQcm9qZWN0LCB1cGRhdGVSYXRlRm9yUHJvamVjdCx7bmV3OiB0cnVlfSwgKGVycm9yOkVycm9yLCByZXN1bHQ6UHJvamVjdCkgPT4ge1xyXG4gICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ1JhdGUgVXBkYXRlZCBmb3IgUHJvamVjdCByYXRlcycpO1xyXG4gICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9KS5jYXRjaChmdW5jdGlvbihlOmFueSkge1xyXG4gICAgICBsb2dnZXIuZXJyb3IoJ1Byb21pc2UgZmFpbGVkIGZvciBpbmRpdmlkdWFsIGNyZWF0ZVByb21pc2VGb3JSYXRlVXBkYXRlT2ZQcm9qZWN0UmF0ZXMgISBFcnJvcjogJyArSlNPTi5zdHJpbmdpZnkoZSkpO1xyXG4gICAgICBDQ1Byb21pc2UucmVqZWN0KGUpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNhbGN1bGF0ZVRodW1iUnVsZVJlcG9ydEZvckNvc3RIZWFkKGJ1ZGdldGVkQ29zdEFtb3VudDogbnVtYmVyLCBjb3N0SGVhZEZyb21SYXRlQW5hbHlzaXM6IGFueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1aWxkaW5nRGF0YTogYW55LCBjb3N0SGVhZHM6IEFycmF5PENvc3RIZWFkPikge1xyXG4gICAgaWYgKGJ1ZGdldGVkQ29zdEFtb3VudCkge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBjYWxjdWxhdGVUaHVtYlJ1bGVSZXBvcnRGb3JDb3N0SGVhZCBoYXMgYmVlbiBoaXQnKTtcclxuXHJcbiAgICAgIGxldCBjb3N0SGVhZDogQ29zdEhlYWQgPSBjb3N0SGVhZEZyb21SYXRlQW5hbHlzaXM7XHJcbiAgICAgIGNvc3RIZWFkLmJ1ZGdldGVkQ29zdEFtb3VudCA9IGJ1ZGdldGVkQ29zdEFtb3VudDtcclxuICAgICAgbGV0IHRodW1iUnVsZVJhdGUgPSBuZXcgVGh1bWJSdWxlUmF0ZSgpO1xyXG5cclxuICAgICAgdGh1bWJSdWxlUmF0ZS5zYWxlYWJsZUFyZWEgPSB0aGlzLmNhbGN1bGF0ZVRodW1iUnVsZVJhdGVGb3JBcmVhKGJ1ZGdldGVkQ29zdEFtb3VudCwgYnVpbGRpbmdEYXRhLnRvdGFsU2FsZWFibGVBcmVhT2ZVbml0KTtcclxuICAgICAgdGh1bWJSdWxlUmF0ZS5zbGFiQXJlYSA9IHRoaXMuY2FsY3VsYXRlVGh1bWJSdWxlUmF0ZUZvckFyZWEoYnVkZ2V0ZWRDb3N0QW1vdW50LCBidWlsZGluZ0RhdGEudG90YWxTbGFiQXJlYSk7XHJcbiAgICAgIHRodW1iUnVsZVJhdGUuY2FycGV0QXJlYSA9IHRoaXMuY2FsY3VsYXRlVGh1bWJSdWxlUmF0ZUZvckFyZWEoYnVkZ2V0ZWRDb3N0QW1vdW50LCBidWlsZGluZ0RhdGEudG90YWxDYXJwZXRBcmVhT2ZVbml0KTtcclxuXHJcbiAgICAgIGNvc3RIZWFkLnRodW1iUnVsZVJhdGUgPSB0aHVtYlJ1bGVSYXRlO1xyXG4gICAgICBjb3N0SGVhZHMucHVzaChjb3N0SGVhZCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNhbGN1bGF0ZVRodW1iUnVsZVJlcG9ydEZvclByb2plY3RDb3N0SGVhZChidWRnZXRlZENvc3RBbW91bnQ6IG51bWJlciwgY29zdEhlYWRGcm9tUmF0ZUFuYWx5c2lzOiBhbnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9qZWN0RGV0YWlsczogYW55LCBjb3N0SGVhZHM6IEFycmF5PENvc3RIZWFkPikge1xyXG4gICAgaWYgKGJ1ZGdldGVkQ29zdEFtb3VudCkge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBjYWxjdWxhdGVUaHVtYlJ1bGVSZXBvcnRGb3JQcm9qZWN0Q29zdEhlYWQgaGFzIGJlZW4gaGl0Jyk7XHJcblxyXG4gICAgICBsZXQgY2FsY3VsYXRlUHJvamVjdERhdGEgPSAnU0VMRUNUIFNVTShidWlsZGluZy50b3RhbENhcnBldEFyZWFPZlVuaXQpIEFTIHRvdGFsQ2FycGV0QXJlYSwgJyArXHJcbiAgICAgICAgJ1NVTShidWlsZGluZy50b3RhbFNsYWJBcmVhKSBBUyB0b3RhbFNsYWJBcmVhUHJvamVjdCwnICtcclxuICAgICAgICAnU1VNKGJ1aWxkaW5nLnRvdGFsU2FsZWFibGVBcmVhT2ZVbml0KSBBUyB0b3RhbFNhbGVhYmxlQXJlYSAgRlJPTSA/IEFTIGJ1aWxkaW5nJztcclxuICAgICAgbGV0IHByb2plY3REYXRhID0gYWxhc3FsKGNhbGN1bGF0ZVByb2plY3REYXRhLCBbcHJvamVjdERldGFpbHMuYnVpbGRpbmdzXSk7XHJcbiAgICAgIGxldCB0b3RhbFNsYWJBcmVhT2ZQcm9qZWN0IDogbnVtYmVyID0gcHJvamVjdERhdGFbMF0udG90YWxTbGFiQXJlYVByb2plY3Q7XHJcbiAgICAgIGxldCB0b3RhbFNhbGVhYmxlQXJlYU9mUHJvamVjdCA6IG51bWJlciA9IHByb2plY3REYXRhWzBdLnRvdGFsU2FsZWFibGVBcmVhO1xyXG4gICAgICBsZXQgdG90YWxDYXJwZXRBcmVhT2ZQcm9qZWN0IDogbnVtYmVyID0gcHJvamVjdERhdGFbMF0udG90YWxDYXJwZXRBcmVhO1xyXG5cclxuICAgICAgbGV0IGNvc3RIZWFkOiBDb3N0SGVhZCA9IGNvc3RIZWFkRnJvbVJhdGVBbmFseXNpcztcclxuICAgICAgY29zdEhlYWQuYnVkZ2V0ZWRDb3N0QW1vdW50ID0gYnVkZ2V0ZWRDb3N0QW1vdW50O1xyXG4gICAgICBsZXQgdGh1bWJSdWxlUmF0ZSA9IG5ldyBUaHVtYlJ1bGVSYXRlKCk7XHJcblxyXG4gICAgICB0aHVtYlJ1bGVSYXRlLnNhbGVhYmxlQXJlYSA9IHRoaXMuY2FsY3VsYXRlVGh1bWJSdWxlUmF0ZUZvckFyZWEoYnVkZ2V0ZWRDb3N0QW1vdW50LCB0b3RhbFNhbGVhYmxlQXJlYU9mUHJvamVjdCk7XHJcbiAgICAgIHRodW1iUnVsZVJhdGUuc2xhYkFyZWEgPSB0aGlzLmNhbGN1bGF0ZVRodW1iUnVsZVJhdGVGb3JBcmVhKGJ1ZGdldGVkQ29zdEFtb3VudCwgdG90YWxTbGFiQXJlYU9mUHJvamVjdCk7XHJcbiAgICAgIHRodW1iUnVsZVJhdGUuY2FycGV0QXJlYSA9IHRoaXMuY2FsY3VsYXRlVGh1bWJSdWxlUmF0ZUZvckFyZWEoYnVkZ2V0ZWRDb3N0QW1vdW50LCB0b3RhbENhcnBldEFyZWFPZlByb2plY3QpO1xyXG5cclxuICAgICAgY29zdEhlYWQudGh1bWJSdWxlUmF0ZSA9IHRodW1iUnVsZVJhdGU7XHJcbiAgICAgIGNvc3RIZWFkcy5wdXNoKGNvc3RIZWFkKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgY2FsY3VsYXRlVGh1bWJSdWxlUmF0ZUZvckFyZWEoYnVkZ2V0ZWRDb3N0QW1vdW50OiBudW1iZXIsIGFyZWE6IG51bWJlcikge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgY2FsY3VsYXRlVGh1bWJSdWxlUmF0ZUZvckFyZWEgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICBsZXQgYnVkZ2V0Q29zdFJhdGVzID0gbmV3IEJ1ZGdldENvc3RSYXRlcygpO1xyXG4gICAgYnVkZ2V0Q29zdFJhdGVzLnNxZnQgPSAoYnVkZ2V0ZWRDb3N0QW1vdW50IC8gYXJlYSk7XHJcbiAgICBidWRnZXRDb3N0UmF0ZXMuc3FtdCA9IChidWRnZXRDb3N0UmF0ZXMuc3FmdCAqIGNvbmZpZy5nZXQoQ29uc3RhbnRzLlNRVUFSRV9NRVRFUikpO1xyXG4gICAgcmV0dXJuIGJ1ZGdldENvc3RSYXRlcztcclxuICB9XHJcbn1cclxuXHJcbk9iamVjdC5zZWFsKFByb2plY3RTZXJ2aWNlKTtcclxuZXhwb3J0ID0gUHJvamVjdFNlcnZpY2U7XHJcbiJdfQ==
