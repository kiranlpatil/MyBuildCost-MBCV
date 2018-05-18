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
var alasql = require("alasql");
var BudgetCostRates = require("../dataaccess/model/project/reports/BudgetCostRates");
var ThumbRuleRate = require("../dataaccess/model/project/reports/ThumbRuleRate");
var Constants = require("../../applicationProject/shared/constants");
var CategoriesListWithRatesDTO = require("../dataaccess/dto/project/CategoriesListWithRatesDTO");
var CentralizedRate = require("../dataaccess/model/project/CentralizedRate");
var messages = require("../../applicationProject/shared/messages");
var CommonService_1 = require("../../applicationProject/shared/CommonService");
var WorkItemListWithRatesDTO = require("../dataaccess/dto/project/WorkItemListWithRatesDTO");
var path = require("path");
var multiparty = require("multiparty");
var AttachmentDetails_1 = require("../dataaccess/model/project/building/AttachmentDetails");
var config = require('config');
var log4js = require('log4js');
var mongoose = require("mongoose");
var CCPromise = require('promise/lib/es6-extensions');
var logger = log4js.getLogger('Project service');
var fs = require('fs');
var ObjectId = mongoose.Types.ObjectId;
var ProjectService = (function () {
    function ProjectService() {
        this.showHideAddItemButton = true;
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
                projectDetails.projectCostHeads = projectData.projectCostHeads;
                projectDetails.buildings = projectData.buildings;
                projectDetails.projectCostHeads = _this.calculateBudgetCostForCommonAmmenities(projectData.projectCostHeads, projectDetails);
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
        logger.info('Report Service, getMaterialFilters has been hit');
        var query = { _id: projectId };
        var populate = { path: 'buildings', select: ['name'] };
        this.projectRepository.findAndPopulate(query, populate, function (error, result) {
            logger.info('Report Service, findAndPopulate has been hit');
            if (error) {
                callback(error, null);
            }
            else {
                var buildingName_1 = buildingDetails.name;
                var building = result[0].buildings.filter(function (building) {
                    return building.name === buildingName_1;
                });
                if (building.length === 0) {
                    _this.buildingRepository.create(buildingDetails, function (error, result) {
                        logger.info('Project service, create has been hit');
                        if (error) {
                            callback(error, null);
                        }
                        else {
                            var query_1 = { _id: projectId };
                            var newData = { $push: { buildings: result._id } };
                            _this.projectRepository.findOneAndUpdate(query_1, newData, { new: true }, function (error, status) {
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
                }
                else {
                    var error_1 = new Error();
                    error_1.message = messages.MSG_ERROR_BUILDING_NAME_ALREADY_EXIST;
                    callback(error_1, null);
                }
            }
        });
    };
    ProjectService.prototype.updateBuildingById = function (projectId, buildingId, buildingDetails, user, callback) {
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
                buildingDetails.costHeads = _this.calculateBudgetCostForBuilding(result.costHeads, buildingDetails);
                _this.buildingRepository.findOneAndUpdate(query, buildingDetails, { new: true }, function (error, result) {
                    logger.info('Project service, findOneAndUpdate has been hit');
                    if (error) {
                        callback(error, null);
                    }
                    else {
                        _this.getProjectAndBuildingDetails(projectId, buildingId, function (error, projectAndBuildingDetails) {
                            if (error) {
                                logger.error('Project service, getProjectAndBuildingDetails failed');
                                callback(error, null);
                            }
                            else {
                                logger.info('Project service, syncProjectWithRateAnalysisData.');
                                var projectData = projectAndBuildingDetails.data[0];
                                var projectCostHeads = _this.calculateBudgetCostForCommonAmmenities(projectData.projectCostHeads, projectData);
                                var queryForProject = { '_id': projectId };
                                var updateProjectCostHead = { $set: { 'projectCostHeads': projectCostHeads } };
                                logger.info('Calling update project Costheads has been hit');
                                _this.projectRepository.findOneAndUpdate(queryForProject, updateProjectCostHead, { new: true }, function (error, response) {
                                    if (error) {
                                        logger.error('Error update project Costheads : ' + JSON.stringify(error));
                                        callback(error, null);
                                    }
                                    else {
                                        logger.debug('Update project Costheads success');
                                        callback(null, { data: result, access_token: _this.authInterceptor.issueTokenWithUid(user) });
                                    }
                                });
                            }
                        });
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
    ProjectService.prototype.cloneBuildingDetails = function (projectId, buildingId, oldBuildingDetails, user, callback) {
        var _this = this;
        logger.info('Project service, cloneBuildingDetails has been hit');
        var query = { _id: projectId };
        var populate = { path: 'buildings', select: ['name'] };
        this.projectRepository.findAndPopulate(query, populate, function (error, result) {
            logger.info('Report Service, findAndPopulate has been hit');
            if (error) {
                callback(error, null);
            }
            else {
                var buildingName_2 = oldBuildingDetails.name;
                var building = result[0].buildings.filter(function (building) {
                    return building.name === buildingName_2;
                });
                if (building.length === 0) {
                    _this.buildingRepository.findById(buildingId, function (error, building) {
                        logger.info('Project service, findById has been hit');
                        if (error) {
                            callback(error, null);
                        }
                        else {
                            var costHeads_1 = building.costHeads;
                            var rateAnalysisData = void 0;
                            if (oldBuildingDetails.cloneItems && oldBuildingDetails.cloneItems.indexOf(Constants.RATE_ANALYSIS_CLONE) === -1) {
                                var rateAnalysisService_1 = new RateAnalysisService();
                                var query_2 = [
                                    {
                                        $project: {
                                            'buildingCostHeads.categories.workItems': 1
                                        }
                                    },
                                    { $unwind: '$buildingCostHeads' },
                                    { $unwind: '$buildingCostHeads.categories' },
                                    { $unwind: '$buildingCostHeads.categories.workItems' },
                                    {
                                        $project: { _id: 0, workItem: '$buildingCostHeads.categories.workItems' }
                                    }
                                ];
                                rateAnalysisService_1.getAggregateData(query_2, function (error, workItemAggregateData) {
                                    if (error) {
                                        callback(error, null);
                                    }
                                    else {
                                        rateAnalysisService_1.getCostControlRateAnalysis({}, { 'buildingRates': 1 }, function (err, data) {
                                            if (err) {
                                                callback(error, null);
                                            }
                                            else {
                                                _this.getRatesAndCostHeads(projectId, oldBuildingDetails, building, costHeads_1, workItemAggregateData, user, data.buildingRates, callback);
                                            }
                                        });
                                    }
                                });
                            }
                            else {
                                _this.getRatesAndCostHeads(projectId, oldBuildingDetails, building, costHeads_1, null, user, null, callback);
                            }
                        }
                    });
                }
                else {
                    var error_2 = new Error();
                    error_2.message = messages.MSG_ERROR_BUILDING_NAME_ALREADY_EXIST;
                    callback(error_2, null);
                }
            }
        });
    };
    ProjectService.prototype.getRatesAndCostHeads = function (projectId, oldBuildingDetails, building, costHeads, workItemAggregateData, user, centralizedRates, callback) {
        oldBuildingDetails.costHeads = this.calculateBudgetCostForBuilding(building.costHeads, oldBuildingDetails);
        this.cloneCostHeads(costHeads, oldBuildingDetails, workItemAggregateData);
        if (oldBuildingDetails.cloneItems.indexOf(Constants.RATE_ANALYSIS_CLONE) === -1) {
            oldBuildingDetails.rates = centralizedRates;
        }
        else {
            oldBuildingDetails.rates = building.rates;
        }
        this.createBuilding(projectId, oldBuildingDetails, user, function (error, res) {
            if (error) {
                callback(error, null);
            }
            else {
                callback(null, res);
            }
        });
    };
    ProjectService.prototype.cloneCostHeads = function (costHeads, oldBuildingDetails, rateAnalysisData) {
        var isClone = (oldBuildingDetails.cloneItems && oldBuildingDetails.cloneItems.indexOf(Constants.COST_HEAD_CLONE) !== -1);
        for (var costHeadIndex in costHeads) {
            if (parseInt(costHeadIndex) < costHeads.length) {
                var costHead = costHeads[costHeadIndex];
                if (!isClone) {
                    costHead.active = false;
                }
                costHeads[costHeadIndex] = this.cloneCategory(costHead.categories, oldBuildingDetails.cloneItems, rateAnalysisData);
            }
        }
        return costHeads;
    };
    ProjectService.prototype.cloneCategory = function (categories, cloneItems, rateAnalysisData) {
        var isClone = (cloneItems && cloneItems.indexOf(Constants.CATEGORY_CLONE) !== -1);
        for (var categoryIndex in categories) {
            var category = categories[categoryIndex];
            if (!isClone) {
                category.active = false;
            }
            categories[categoryIndex].workItems = this.cloneWorkItems(category.workItems, cloneItems, rateAnalysisData);
        }
        return categories;
    };
    ProjectService.prototype.cloneWorkItems = function (workItems, cloneItems, rateAnalysisData) {
        var isClone = (cloneItems && cloneItems.indexOf(Constants.WORK_ITEM_CLONE) !== -1);
        for (var workItemIndex in workItems) {
            var workItem = workItems[workItemIndex];
            if (!isClone) {
                workItem.active = false;
            }
            this.cloneRate(workItem, cloneItems, rateAnalysisData);
            this.cloneQuantity(workItem, cloneItems);
        }
        return workItems;
    };
    ProjectService.prototype.cloneRate = function (workItem, cloneItems, rateAnalysisData) {
        var isClone = cloneItems && cloneItems.indexOf(Constants.RATE_ANALYSIS_CLONE) !== -1;
        var rateAnalysisService = new RateAnalysisService();
        var configWorkItems = new Array();
        if (!isClone) {
            workItem = this.clonedWorkitemWithRateAnalysis(workItem, rateAnalysisData);
        }
    };
    ProjectService.prototype.cloneQuantity = function (workItem, cloneItems) {
        var isClone = (cloneItems && cloneItems.indexOf(Constants.QUANTITY_CLONE) !== -1);
        if (!isClone) {
            workItem.quantity.quantityItemDetails = [];
            workItem.quantity.isDirectQuantity = false;
            workItem.quantity.isEstimated = false;
            workItem.quantity.total = 0;
        }
        return workItem;
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
                callback(null, {
                    data: inActiveWorkItemsListWithBuildingRates.workItems,
                    access_token: _this.authInterceptor.issueTokenWithUid(user)
                });
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
                callback(null, {
                    data: inActiveWorkItemsListWithProjectRates.workItems,
                    access_token: _this.authInterceptor.issueTokenWithUid(user)
                });
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
        rate.isEstimated = true;
        var query = { _id: buildingId };
        var updateQuery = { $set: { 'costHeads.$[costHead].categories.$[category].workItems.$[workItem].rate': rate
            } };
        var arrayFilter = [
            { 'costHead.rateAnalysisId': costHeadId },
            { 'category.rateAnalysisId': categoryId },
            { 'workItem.rateAnalysisId': workItemId }
        ];
        this.buildingRepository.findOneAndUpdate(query, updateQuery, { arrayFilters: arrayFilter, new: true }, function (error, result) {
            if (error) {
                callback(error, null);
            }
            else {
                if (result) {
                    console.log('building CostHeads Updated');
                    var rateItems = rate.rateItems;
                    var centralizedRates_1 = result.rates;
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
    };
    ProjectService.prototype.updateDirectRateOfBuildingWorkItems = function (projectId, buildingId, costHeadId, categoryId, workItemId, directRate, user, callback) {
        var _this = this;
        logger.info('Project service, updateDirectRateOfBuildingWorkItems has been hit');
        var query = { _id: buildingId };
        var updateQuery = { $set: { 'costHeads.$[costHead].categories.$[category].workItems.$[workItem].rate.total': directRate,
                'costHeads.$[costHead].categories.$[category].workItems.$[workItem].rate.rateItems': [],
                'costHeads.$[costHead].categories.$[category].workItems.$[workItem].isDirectRate': true
            } };
        var arrayFilter = [
            { 'costHead.rateAnalysisId': costHeadId },
            { 'category.rateAnalysisId': categoryId },
            { 'workItem.rateAnalysisId': workItemId }
        ];
        this.buildingRepository.findOneAndUpdate(query, updateQuery, { arrayFilters: arrayFilter, new: true }, function (error, building) {
            logger.info('Project service, findOneAndUpdate has been hit');
            if (error) {
                callback(error, null);
            }
            else {
                callback(null, { data: 'success', access_token: _this.authInterceptor.issueTokenWithUid(user) });
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
        rate.isEstimated = true;
        var query = { _id: projectId };
        var updateQuery = { $set: { 'projectCostHeads.$[costHead].categories.$[category].workItems.$[workItem].rate': rate
            } };
        var arrayFilter = [
            { 'costHead.rateAnalysisId': costHeadId },
            { 'category.rateAnalysisId': categoryId },
            { 'workItem.rateAnalysisId': workItemId }
        ];
        this.projectRepository.findOneAndUpdate(query, updateQuery, { arrayFilters: arrayFilter, new: true }, function (error, result) {
            if (error) {
                callback(error, null);
            }
            else {
                var rateItems = rate.rateItems;
                var centralizedRatesOfProjects_1 = result.rates;
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
    };
    ProjectService.prototype.updateDirectRateOfProjectWorkItems = function (projectId, costHeadId, categoryId, workItemId, directRate, user, callback) {
        var _this = this;
        logger.info('Project service, updateDirectRateOfProjectWorkItems has been hit');
        var query = { _id: projectId };
        var updateQuery = { $set: { 'projectCostHeads.$[costHead].categories.$[category].workItems.$[workItem].rate.total': directRate,
                'projectCostHeads.$[costHead].categories.$[category].workItems.$[workItem].rate.rateItems': [],
                'projectCostHeads.$[costHead].categories.$[category].workItems.$[workItem].isDirectRate': true
            } };
        var arrayFilter = [
            { 'costHead.rateAnalysisId': costHeadId },
            { 'category.rateAnalysisId': categoryId },
            { 'workItem.rateAnalysisId': workItemId }
        ];
        this.projectRepository.findOneAndUpdate(query, updateQuery, { arrayFilters: arrayFilter, new: true }, function (error, building) {
            logger.info('Project service, findOneAndUpdate has been hit');
            if (error) {
                callback(error, null);
            }
            else {
                callback(null, { data: 'success', access_token: _this.authInterceptor.issueTokenWithUid(user) });
            }
        });
    };
    ProjectService.prototype.deleteQuantityOfBuildingCostHeadsByName = function (projectId, buildingId, costHeadId, categoryId, workItemId, itemName, user, callback) {
        var _this = this;
        logger.info('Project service, deleteQuantity has been hit');
        var query = { _id: buildingId };
        var projection = { costHeads: {
                $elemMatch: { rateAnalysisId: costHeadId, categories: {
                        $elemMatch: { rateAnalysisId: categoryId, workItems: {
                                $elemMatch: { rateAnalysisId: workItemId }
                            } }
                    } }
            } };
        this.buildingRepository.retrieveWithProjection(query, projection, function (error, building) {
            if (error) {
                callback(error, null);
            }
            else {
                var quantityItems = void 0;
                var updatedWorkItem = new WorkItem();
                for (var _i = 0, _a = building[0].costHeads; _i < _a.length; _i++) {
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
                                        updatedWorkItem = workItem;
                                        break;
                                    }
                                }
                                break;
                            }
                        }
                    }
                }
                var query_3 = { _id: buildingId };
                var updateQuery = { $set: { 'costHeads.$[costHead].categories.$[category].workItems.$[workItem]': updatedWorkItem } };
                var arrayFilter = [
                    { 'costHead.rateAnalysisId': costHeadId },
                    { 'category.rateAnalysisId': categoryId },
                    { 'workItem.rateAnalysisId': workItemId }
                ];
                _this.buildingRepository.findOneAndUpdate(query_3, updateQuery, { arrayFilters: arrayFilter, new: true }, function (error, building) {
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
        var query = { _id: projectId };
        var projection = { projectCostHeads: {
                $elemMatch: { rateAnalysisId: costHeadId, categories: {
                        $elemMatch: { rateAnalysisId: categoryId, workItems: {
                                $elemMatch: { rateAnalysisId: workItemId }
                            } }
                    } }
            } };
        this.projectRepository.retrieveWithProjection(query, projection, function (error, project) {
            if (error) {
                callback(error, null);
            }
            else {
                var quantityItems = void 0;
                var updatedWorkItem = new WorkItem();
                for (var _i = 0, _a = project[0].projectCostHeads; _i < _a.length; _i++) {
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
                                        updatedWorkItem = workItem;
                                        break;
                                    }
                                }
                            }
                            break;
                        }
                    }
                }
                var query_4 = { _id: projectId };
                var updateQuery = { $set: { 'projectCostHeads.$[costHead].categories.$[category].workItems.$[workItem]': updatedWorkItem } };
                var arrayFilter = [
                    { 'costHead.rateAnalysisId': costHeadId },
                    { 'category.rateAnalysisId': categoryId },
                    { 'workItem.rateAnalysisId': workItemId }
                ];
                _this.projectRepository.findOneAndUpdate(query_4, updateQuery, { arrayFilters: arrayFilter, new: true }, function (error, project) {
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
        var query = { _id: buildingId };
        var updateQuery = { $set: { 'costHeads.$[costHead].categories.$[category].workItems.$[workItem].active': workItemActiveStatus } };
        var arrayFilter = [
            { 'costHead.rateAnalysisId': costHeadId },
            { 'category.rateAnalysisId': categoryId },
            { 'workItem.rateAnalysisId': workItemId }
        ];
        this.buildingRepository.findOneAndUpdate(query, updateQuery, { arrayFilters: arrayFilter, new: true }, function (error, response) {
            logger.info('Project service, findOneAndUpdate has been hit');
            if (error) {
                callback(error, null);
            }
            else {
                callback(null, { data: 'success', access_token: _this.authInterceptor.issueTokenWithUid(user) });
            }
        });
    };
    ProjectService.prototype.updateWorkItemStatusOfProjectCostHeads = function (projectId, costHeadId, categoryId, workItemId, workItemActiveStatus, user, callback) {
        var _this = this;
        logger.info('Project service, Update WorkItem Status Of Project Cost Heads has been hit');
        var query = { _id: projectId };
        var updateQuery = { $set: { 'projectCostHeads.$[costHead].categories.$[category].workItems.$[workItem].active': workItemActiveStatus } };
        var arrayFilter = [
            { 'costHead.rateAnalysisId': costHeadId },
            { 'category.rateAnalysisId': categoryId },
            { 'workItem.rateAnalysisId': workItemId }
        ];
        this.projectRepository.findOneAndUpdate(query, updateQuery, { arrayFilters: arrayFilter, new: true }, function (error, response) {
            logger.info('Project service, Update WorkItem Status Of Project Cost Heads ,findOneAndUpdate has been hit');
            if (error) {
                callback(error, null);
            }
            else {
                callback(null, { data: 'success', access_token: _this.authInterceptor.issueTokenWithUid(user) });
            }
        });
    };
    ProjectService.prototype.updateBudgetedCostForCostHead = function (buildingId, costHeadBudgetedAmount, user, callback) {
        var _this = this;
        logger.info('Project service, updateBudgetedCostForCostHead has been hit');
        var query = { '_id': buildingId, 'costHeads.name': costHeadBudgetedAmount.costHead };
        var newData = {
            $set: {
                'costHeads.$.budgetedCostAmount': costHeadBudgetedAmount.budgetedCostAmount,
            }
        };
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
        var newData = {
            $set: {
                'projectCostHeads.$.budgetedCostAmount': costHeadBudgetedAmount.budgetedCostAmount,
            }
        };
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
        var query = { _id: buildingId };
        var projection = { costHeads: {
                $elemMatch: { rateAnalysisId: costHeadId, categories: {
                        $elemMatch: { rateAnalysisId: categoryId, workItems: {
                                $elemMatch: { rateAnalysisId: workItemId }
                            } }
                    } }
            } };
        this.buildingRepository.retrieveWithProjection(query, projection, function (error, building) {
            if (error) {
                callback(error, null);
            }
            else {
                var costHeadList = building[0].costHeads;
                var quantity = void 0;
                for (var _i = 0, costHeadList_4 = costHeadList; _i < costHeadList_4.length; _i++) {
                    var costHead = costHeadList_4[_i];
                    var categoriesOfCostHead = costHead.categories;
                    for (var _a = 0, categoriesOfCostHead_2 = categoriesOfCostHead; _a < categoriesOfCostHead_2.length; _a++) {
                        var categoryData = categoriesOfCostHead_2[_a];
                        if (categoryId === categoryData.rateAnalysisId) {
                            for (var _b = 0, _c = categoryData.workItems; _b < _c.length; _b++) {
                                var workItemData = _c[_b];
                                if (workItemId === workItemData.rateAnalysisId) {
                                    quantity = workItemData.quantity;
                                    quantity.isEstimated = true;
                                    if (quantity.isDirectQuantity === true) {
                                        quantity.isDirectQuantity = false;
                                    }
                                    _this.updateQuantityItemsOfWorkItem(quantity, quantityDetail);
                                    break;
                                }
                            }
                            break;
                        }
                    }
                }
                var query_5 = { _id: buildingId };
                var updateQuery = { $set: { 'costHeads.$[costHead].categories.$[category].workItems.$[workItem].quantity': quantity } };
                var arrayFilter = [
                    { 'costHead.rateAnalysisId': costHeadId },
                    { 'category.rateAnalysisId': categoryId },
                    { 'workItem.rateAnalysisId': workItemId }
                ];
                _this.buildingRepository.findOneAndUpdate(query_5, updateQuery, { arrayFilters: arrayFilter, new: true }, function (error, building) {
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
        var query = { _id: buildingId };
        var updateQuery = { $set: { 'costHeads.$[costHead].categories.$[category].workItems.$[workItem].quantity.isEstimated': true,
                'costHeads.$[costHead].categories.$[category].workItems.$[workItem].quantity.isDirectQuantity': true,
                'costHeads.$[costHead].categories.$[category].workItems.$[workItem].quantity.total': directQuantity,
                'costHeads.$[costHead].categories.$[category].workItems.$[workItem].quantity.quantityItemDetails': []
            } };
        var arrayFilter = [
            { 'costHead.rateAnalysisId': costHeadId },
            { 'category.rateAnalysisId': categoryId },
            { 'workItem.rateAnalysisId': workItemId }
        ];
        this.buildingRepository.findOneAndUpdate(query, updateQuery, { arrayFilters: arrayFilter, new: true }, function (error, building) {
            logger.info('Project service, findOneAndUpdate has been hit');
            if (error) {
                callback(error, null);
            }
            else {
                callback(null, { data: 'success', access_token: _this.authInterceptor.issueTokenWithUid(user) });
            }
        });
    };
    ProjectService.prototype.updateDirectQuantityOfProjectWorkItems = function (projectId, costHeadId, categoryId, workItemId, directQuantity, user, callback) {
        var _this = this;
        logger.info('Project service, updateDirectQuantityOfProjectWorkItems has been hit');
        var query = { _id: projectId };
        var updateQuery = { $set: { 'projectCostHeads.$[costHead].categories.$[category].workItems.$[workItem].quantity.isEstimated': true,
                'projectCostHeads.$[costHead].categories.$[category].workItems.$[workItem].quantity.isDirectQuantity': true,
                'projectCostHeads.$[costHead].categories.$[category].workItems.$[workItem].quantity.total': directQuantity,
                'projectCostHeads.$[costHead].categories.$[category].workItems.$[workItem].quantity.quantityItemDetails': []
            } };
        var arrayFilter = [
            { 'costHead.rateAnalysisId': costHeadId },
            { 'category.rateAnalysisId': categoryId },
            { 'workItem.rateAnalysisId': workItemId }
        ];
        this.projectRepository.findOneAndUpdate(query, updateQuery, { arrayFilters: arrayFilter, new: true }, function (error, building) {
            logger.info('Project service, findOneAndUpdate has been hit');
            if (error) {
                callback(error, null);
            }
            else {
                callback(null, { data: 'success', access_token: _this.authInterceptor.issueTokenWithUid(user) });
            }
        });
    };
    ProjectService.prototype.updateQuantityDetailsOfProject = function (projectId, costHeadId, categoryId, workItemId, quantityDetailsObj, user, callback) {
        var _this = this;
        var query = [
            { $match: { '_id': ObjectId(projectId), 'projectCostHeads.rateAnalysisId': costHeadId } },
            { $unwind: '$projectCostHeads' },
            { $project: { 'projectCostHeads': 1 } },
            { $unwind: '$projectCostHeads.categories' },
            { $match: { 'projectCostHeads.categories.rateAnalysisId': categoryId } },
            { $project: { 'projectCostHeads.categories.workItems': 1 } },
            { $unwind: '$projectCostHeads.categories.workItems' },
            { $match: { 'projectCostHeads.categories.workItems.rateAnalysisId': workItemId } },
            { $project: { 'projectCostHeads.categories.workItems.quantity': 1 } },
        ];
        this.projectRepository.aggregate(query, function (error, result) {
            if (error) {
                callback(error, null);
            }
            else {
                if (result.length > 0) {
                    var quantity = result[0].projectCostHeads.categories.workItems.quantity;
                    _this.updateQuantityDetails(quantity, quantityDetailsObj);
                    var query_6 = { _id: projectId };
                    var updateQuery = { $set: { 'projectCostHeads.$[costHead].categories.$[category].workItems.$[workItem].quantity': quantity } };
                    var arrayFilter = [
                        { 'costHead.rateAnalysisId': costHeadId },
                        { 'category.rateAnalysisId': categoryId },
                        { 'workItem.rateAnalysisId': workItemId }
                    ];
                    _this.projectRepository.findOneAndUpdate(query_6, updateQuery, { arrayFilters: arrayFilter, new: true }, function (error, building) {
                        logger.info('Project service, findOneAndUpdate has been hit');
                        if (error) {
                            callback(error, null);
                        }
                        else {
                            callback(null, { data: quantityDetailsObj, status: 'success', access_token: _this.authInterceptor.issueTokenWithUid(user) });
                        }
                    });
                }
                else {
                    var error_3 = new Error();
                    error_3.message = messages.MSG_ERROR_EMPTY_RESPONSE;
                    callback(error_3, null);
                }
            }
        });
    };
    ProjectService.prototype.updateQuantityDetailsOfBuilding = function (projectId, buildingId, costHeadId, categoryId, workItemId, quantityDetailsObj, user, callback) {
        var _this = this;
        var query = [
            { $match: { '_id': ObjectId(buildingId), 'costHeads.rateAnalysisId': costHeadId } },
            { $unwind: '$costHeads' },
            { $project: { 'costHeads': 1 } },
            { $unwind: '$costHeads.categories' },
            { $match: { 'costHeads.categories.rateAnalysisId': categoryId } },
            { $project: { 'costHeads.categories.workItems': 1 } },
            { $unwind: '$costHeads.categories.workItems' },
            { $match: { 'costHeads.categories.workItems.rateAnalysisId': workItemId } },
            { $project: { 'costHeads.categories.workItems.quantity': 1 } },
        ];
        this.buildingRepository.aggregate(query, function (error, result) {
            if (error) {
                callback(error, null);
            }
            else {
                if (result.length > 0) {
                    var quantity = result[0].costHeads.categories.workItems.quantity;
                    _this.updateQuantityDetails(quantity, quantityDetailsObj);
                    var query_7 = { _id: buildingId };
                    var updateQuery = { $set: { 'costHeads.$[costHead].categories.$[category].workItems.$[workItem].quantity': quantity } };
                    var arrayFilter = [
                        { 'costHead.rateAnalysisId': costHeadId },
                        { 'category.rateAnalysisId': categoryId },
                        { 'workItem.rateAnalysisId': workItemId }
                    ];
                    _this.buildingRepository.findOneAndUpdate(query_7, updateQuery, { arrayFilters: arrayFilter, new: true }, function (error, building) {
                        logger.info('Project service, findOneAndUpdate has been hit');
                        if (error) {
                            callback(error, null);
                        }
                        else {
                            callback(null, { data: quantityDetailsObj, status: 'success', access_token: _this.authInterceptor.issueTokenWithUid(user) });
                        }
                    });
                }
                else {
                    var error_4 = new Error();
                    error_4.message = messages.MSG_ERROR_EMPTY_RESPONSE;
                    callback(error_4, null);
                }
            }
        });
    };
    ProjectService.prototype.updateQuantityDetails = function (quantity, quantityDetailsObj) {
        quantity.isEstimated = true;
        quantity.isDirectQuantity = false;
        var quantityDetails = quantity.quantityItemDetails;
        var current_date = new Date();
        var newQuantityId = current_date.getUTCMilliseconds();
        if (quantityDetails.length === 0) {
            quantityDetailsObj.id = newQuantityId;
            quantityDetailsObj.isDirectQuantity = false;
            quantityDetails.push(quantityDetailsObj);
        }
        else {
            var isDefaultExistsSQL = 'SELECT name from ? AS quantityDetails where quantityDetails.name="default"';
            var isDefaultExistsQuantityDetail = alasql(isDefaultExistsSQL, [quantityDetails]);
            if (isDefaultExistsQuantityDetail.length > 0) {
                quantity.quantityItemDetails = [];
                quantityDetailsObj.id = newQuantityId;
                quantityDetailsObj.isDirectQuantity = false;
                quantity.quantityItemDetails.push(quantityDetailsObj);
            }
            else {
                if (quantityDetailsObj.name !== 'default') {
                    var isItemAlreadyExistSQL = 'SELECT id from ? AS quantityDetails where quantityDetails.id=' + quantityDetailsObj.id + '';
                    var isItemAlreadyExists = alasql(isItemAlreadyExistSQL, [quantityDetails]);
                    if (isItemAlreadyExists.length > 0) {
                        for (var quantityIndex = 0; quantityIndex < quantityDetails.length; quantityIndex++) {
                            if (quantityDetails[quantityIndex].id === quantityDetailsObj.id) {
                                quantityDetails[quantityIndex].name = quantityDetailsObj.name;
                                if (quantityDetailsObj.quantityItems.length === 0) {
                                    quantityDetails[quantityIndex].quantityItems = [];
                                    quantityDetails[quantityIndex].isDirectQuantity = true;
                                }
                                else {
                                    quantityDetails[quantityIndex].quantityItems = quantityDetailsObj.quantityItems;
                                    quantityDetails[quantityIndex].isDirectQuantity = false;
                                }
                                quantityDetails[quantityIndex].total = quantityDetailsObj.total;
                            }
                        }
                    }
                    else {
                        quantityDetailsObj.id = newQuantityId;
                        quantityDetailsObj.isDirectQuantity = false;
                        quantity.quantityItemDetails.push(quantityDetailsObj);
                    }
                }
            }
        }
    };
    ProjectService.prototype.updateQuantityItemsOfWorkItem = function (quantity, quantityDetail) {
        quantity.isEstimated = true;
        var current_date = new Date();
        var quantityId = current_date.getUTCMilliseconds();
        if (quantity.quantityItemDetails.length === 0) {
            if (quantityDetail.id === undefined) {
                quantityDetail.id = quantityId;
                quantityDetail.total = alasql('VALUE OF SELECT ROUND(SUM(quantity),2) FROM ?', [quantityDetail.quantityItems]);
                quantity.quantityItemDetails.push(quantityDetail);
            }
            else {
                quantityDetail.total = alasql('VALUE OF SELECT ROUND(SUM(quantity),2) FROM ?', [quantityDetail.quantityItems]);
                quantity.quantityItemDetails.push(quantityDetail);
            }
        }
        else {
            var isDefaultExistsSQL = 'SELECT name from ? AS quantityDetails where quantityDetails.name="default"';
            var isDefaultExistsQuantityDetail = alasql(isDefaultExistsSQL, [quantity.quantityItemDetails]);
            if (isDefaultExistsQuantityDetail.length > 0) {
                quantityDetail.id = quantityId;
                quantity.quantityItemDetails = [];
                quantityDetail.total = alasql('VALUE OF SELECT ROUND(SUM(quantity),2) FROM ?', [quantityDetail.quantityItems]);
                quantity.quantityItemDetails.push(quantityDetail);
            }
            else {
                if (quantityDetail.name !== 'default') {
                    var isItemAlreadyExistSQL = 'SELECT id from ? AS quantityDetails where quantityDetails.id="' + quantityDetail.id + '"';
                    var isItemAlreadyExists = alasql(isItemAlreadyExistSQL, [quantity.quantityItemDetails]);
                    if (isItemAlreadyExists.length > 0) {
                        for (var quantityIndex = 0; quantityIndex < quantity.quantityItemDetails.length; quantityIndex++) {
                            if (quantity.quantityItemDetails[quantityIndex].id === quantityDetail.id) {
                                quantity.quantityItemDetails[quantityIndex].isDirectQuantity = false;
                                quantity.quantityItemDetails[quantityIndex].quantityItems = quantityDetail.quantityItems;
                                quantity.quantityItemDetails[quantityIndex].total = alasql('VALUE OF SELECT ROUND(SUM(quantity),2) FROM ?', [quantityDetail.quantityItems]);
                            }
                        }
                    }
                    else {
                        if (quantityDetail.id === undefined) {
                            quantityDetail.id = quantityId;
                            quantityDetail.isDirectQuantity = false;
                            quantityDetail.total = alasql('VALUE OF SELECT ROUND(SUM(quantity),2) FROM ?', [quantityDetail.quantityItems]);
                            quantity.quantityItemDetails.push(quantityDetail);
                        }
                        else {
                            for (var quantityIndex = 0; quantityIndex < quantity.quantityItemDetails.length; quantityIndex++) {
                                if (quantity.quantityItemDetails[quantityIndex].id === quantityDetail.id) {
                                    quantity.quantityItemDetails[quantityIndex].name = quantityDetail.name;
                                    quantity.quantityItemDetails[quantityIndex].isDirectQuantity = false;
                                    quantity.quantityItemDetails[quantityIndex].quantityItems = quantityDetail.quantityItems;
                                    quantity.quantityItemDetails[quantityIndex].total = alasql('VALUE OF SELECT ROUND(SUM(quantity),2) FROM ?', [quantityDetail.quantityItems]);
                                }
                            }
                        }
                    }
                }
                else {
                    quantity.quantityItemDetails = [];
                    console.log('quantity : ' + JSON.stringify(quantity));
                    quantityDetail.id = quantityId;
                    quantityDetail.total = alasql('VALUE OF SELECT ROUND(SUM(quantity),2) FROM ?', [quantityDetail.quantityItems]);
                    console.log(quantity.quantityItemDetails);
                    quantity.quantityItemDetails.push(quantityDetail);
                }
            }
        }
        quantity.total = alasql('VALUE OF SELECT ROUND(SUM(total),2) FROM ?', [quantity.quantityItemDetails]);
    };
    ProjectService.prototype.updateQuantityOfProjectCostHeads = function (projectId, costHeadId, categoryId, workItemId, quantityDetails, user, callback) {
        var _this = this;
        logger.info('Project service, Update Quantity Of Project Cost Heads has been hit');
        var query = { _id: projectId };
        var projection = { projectCostHeads: {
                $elemMatch: { rateAnalysisId: costHeadId, categories: {
                        $elemMatch: { rateAnalysisId: categoryId, workItems: {
                                $elemMatch: { rateAnalysisId: workItemId }
                            } }
                    } }
            } };
        this.projectRepository.retrieveWithProjection(query, projection, function (error, project) {
            if (error) {
                callback(error, null);
            }
            else {
                var costHeadList = project[0].projectCostHeads;
                var quantity = void 0;
                for (var _i = 0, costHeadList_5 = costHeadList; _i < costHeadList_5.length; _i++) {
                    var costHead = costHeadList_5[_i];
                    if (costHeadId === costHead.rateAnalysisId) {
                        var categoriesOfCostHead = costHead.categories;
                        for (var _a = 0, categoriesOfCostHead_3 = categoriesOfCostHead; _a < categoriesOfCostHead_3.length; _a++) {
                            var categoryData = categoriesOfCostHead_3[_a];
                            if (categoryId === categoryData.rateAnalysisId) {
                                var workItemsOfCategory = categoryData.workItems;
                                for (var _b = 0, workItemsOfCategory_1 = workItemsOfCategory; _b < workItemsOfCategory_1.length; _b++) {
                                    var workItemData = workItemsOfCategory_1[_b];
                                    if (workItemId === workItemData.rateAnalysisId) {
                                        quantity = workItemData.quantity;
                                        quantity.isEstimated = true;
                                        _this.updateQuantityItemsOfWorkItem(quantity, quantityDetails);
                                        break;
                                    }
                                }
                                break;
                            }
                        }
                    }
                }
                var query_8 = { _id: projectId };
                var updateQuery = { $set: { 'projectCostHeads.$[costHead].categories.$[category].workItems.$[workItem].quantity': quantity } };
                var arrayFilter = [
                    { 'costHead.rateAnalysisId': costHeadId },
                    { 'category.rateAnalysisId': categoryId },
                    { 'workItem.rateAnalysisId': workItemId }
                ];
                _this.projectRepository.findOneAndUpdate(query_8, updateQuery, { arrayFilters: arrayFilter, new: true }, function (error, project) {
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
                    var workItemsListAndShowHideAddItemButton = {
                        workItems: workItemsListWithBuildingRates.workItems,
                        showHideAddButton: workItemsListWithBuildingRates.showHideAddItemButton
                    };
                    callback(null, {
                        data: workItemsListAndShowHideAddItemButton,
                        access_token: _this.authInterceptor.issueTokenWithUid(user)
                    });
                }
                else {
                    var error_5 = new Error();
                    error_5.message = messages.MSG_ERROR_EMPTY_RESPONSE;
                    callback(error_5, null);
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
                    var workItemsListAndShowHideAddItemButton = {
                        workItems: workItemsListWithRates.workItems,
                        showHideAddButton: workItemsListWithRates.showHideAddItemButton
                    };
                    callback(null, {
                        data: workItemsListAndShowHideAddItemButton,
                        access_token: _this.authInterceptor.issueTokenWithUid(user)
                    });
                }
                else {
                    var error_6 = new Error();
                    error_6.message = messages.MSG_ERROR_EMPTY_RESPONSE;
                    callback(error_6, null);
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
                    workItem.amount = this.commonService.decimalConversion(workItem.rate.total * workItem.quantity.total);
                    workItemsListWithRates.workItemsAmount = workItemsListWithRates.workItemsAmount + workItem.amount;
                }
                workItemsListWithRates.workItems.push(workItem);
            }
            else {
                workItemsListWithRates.showHideAddItemButton = false;
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
                callback(null, {
                    data: categoriesListWithCentralizedRates,
                    access_token: _this.authInterceptor.issueTokenWithUid(user)
                });
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
                for (var _i = 0, projectCostHeads_1 = projectCostHeads; _i < projectCostHeads_1.length; _i++) {
                    var costHeadData = projectCostHeads_1[_i];
                    if (costHeadData.rateAnalysisId === costHeadId) {
                        categoriesListWithCentralizedRates = _this.getCategoriesListWithCentralizedRates(costHeadData.categories, project.rates);
                        break;
                    }
                }
                callback(null, {
                    data: categoriesListWithCentralizedRates,
                    access_token: _this.authInterceptor.issueTokenWithUid(user)
                });
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
                    var error_7 = new Error();
                    error_7.message = messages.MSG_ERROR_EMPTY_RESPONSE;
                    callback(error_7, null);
                }
            }
        });
    };
    ProjectService.prototype.getCategoriesListWithCentralizedRates = function (categoriesOfCostHead, centralizedRates) {
        var categoriesTotalAmount = 0;
        var categoriesListWithRates = new CategoriesListWithRatesDTO;
        for (var _i = 0, categoriesOfCostHead_4 = categoriesOfCostHead; _i < categoriesOfCostHead_4.length; _i++) {
            var categoryData = categoriesOfCostHead_4[_i];
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
        logger.info('updateCostHeadsForBuildingAndProject has been hit');
        var rateAnalysisService = new RateAnalysisService();
        var buildingRepository = new BuildingRepository();
        var projectRepository = new ProjectRepository();
        rateAnalysisService.getCostControlRateAnalysis({}, {}, function (error, rateAnalysis) {
            if (error) {
                logger.error('Error in updateCostHeadsForBuildingAndProject : convertCostHeadsFromRateAnalysisToCostControl : '
                    + JSON.stringify(error));
                callback(error, null);
            }
            else {
                logger.info('GetAllDataFromRateAnalysis success');
                var buildingCostHeads = rateAnalysis.buildingCostHeads;
                var projectService_1 = new ProjectService();
                buildingCostHeads = projectService_1.calculateBudgetCostForBuilding(buildingCostHeads, buildingData);
                var queryForBuilding = { '_id': buildingId };
                var updateCostHead = { $set: { 'costHeads': buildingCostHeads, 'rates': rateAnalysis.buildingRates } };
                buildingRepository.findOneAndUpdate(queryForBuilding, updateCostHead, { new: true }, function (error, response) {
                    if (error) {
                        logger.error('Error in Update convertCostHeadsFromRateAnalysisToCostControl buildingCostHeadsData  : '
                            + JSON.stringify(error));
                        callback(error, null);
                    }
                    else {
                        logger.info('UpdateBuildingCostHead success');
                        var projectCostHeads = projectService_1.calculateBudgetCostForCommonAmmenities(projectData.projectCostHeads, projectData);
                        var queryForProject = { '_id': projectId };
                        var updateProjectCostHead = { $set: { 'projectCostHeads': projectCostHeads } };
                        logger.info('Calling update project Costheads has been hit');
                        projectRepository.findOneAndUpdate(queryForProject, updateProjectCostHead, { new: true }, function (error, response) {
                            if (error) {
                                logger.error('Error update project Costheads : ' + JSON.stringify(error));
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
            rateAnalysisService.getCostControlRateAnalysis({}, {}, function (error, rateAnalysis) {
                if (error) {
                    logger.error('Error in promise updateBudgetRatesForBuildingCostHeads : ' + JSON.stringify(error));
                    reject(error);
                }
                else {
                    logger.info('Inside updateBudgetRatesForBuildingCostHeads success');
                    var projectService_2 = new ProjectService();
                    var buildingCostHeads = rateAnalysis.buildingCostHeads;
                    buildingCostHeads = projectService_2.calculateBudgetCostForBuilding(buildingCostHeads, buildingDetails);
                    var query = { '_id': buildingId };
                    var newData = { $set: { 'costHeads': buildingCostHeads, 'rates': rateAnalysis.buildingRates } };
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
    ProjectService.prototype.getCentralizedRates = function (result, costHeads) {
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
            costHead.priorityId = configCostHead.priorityId;
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
            rateAnalysisService.getCostControlRateAnalysis({}, {}, function (error, rateAnalysis) {
                if (error) {
                    logger.error('Error in updateBudgetRatesForProjectCostHeads promise : ' + JSON.stringify(error));
                    reject(error);
                }
                else {
                    var projectService = new ProjectService();
                    var projectCostHeads = rateAnalysis.projectCostHeads;
                    projectCostHeads = projectService.calculateBudgetCostForCommonAmmenities(projectCostHeads, projectDetails);
                    var query = { '_id': projectId };
                    var newData = { $set: { 'projectCostHeads': projectCostHeads, 'rates': rateAnalysis.projectRates } };
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
    ProjectService.prototype.calculateBudgetCostForBuilding = function (costHeadsRateAnalysis, buildingDetails) {
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
                case Constants.EXCAVATION: {
                    budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
                    calculateBudgtedCost = budgetCostFormulae.replace(Constants.PLINTH_AREA, buildingDetails.plinthArea);
                    budgetedCostAmount = eval(calculateBudgtedCost);
                    this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
                    break;
                }
                case Constants.BACKFILLING_PLINTH: {
                    budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
                    calculateBudgtedCost = budgetCostFormulae.replace(Constants.PLINTH_AREA, buildingDetails.plinthArea);
                    budgetedCostAmount = eval(calculateBudgtedCost);
                    this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
                    break;
                }
                case Constants.FLOORING_SKIRTING_WALL_TILING_DADO: {
                    budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
                    calculateBudgtedCost = budgetCostFormulae.replace(Constants.CARPET_AREA, buildingDetails.totalCarpetAreaOfUnit);
                    budgetedCostAmount = eval(calculateBudgtedCost);
                    this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
                    break;
                }
                case Constants.WINDOWS_SILLS_OR_JAMBS: {
                    budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
                    calculateBudgtedCost = budgetCostFormulae.replace(Constants.CARPET_AREA, buildingDetails.totalCarpetAreaOfUnit);
                    budgetedCostAmount = eval(calculateBudgtedCost);
                    this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
                    break;
                }
                case Constants.DOORS_WITH_FRAMES_AND_HARDWARE: {
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
                case Constants.WINDOWS_AND_GLASS_DOORS: {
                    budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
                    calculateBudgtedCost = budgetCostFormulae.replace(Constants.CARPET_AREA, buildingDetails.totalCarpetAreaOfUnit);
                    budgetedCostAmount = eval(calculateBudgtedCost);
                    this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
                    break;
                }
                case Constants.ELECTRIFICATION: {
                    budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
                    calculateBudgtedCost = budgetCostFormulae.replace(Constants.CARPET_AREA, buildingDetails.totalCarpetAreaOfUnit);
                    budgetedCostAmount = eval(calculateBudgtedCost);
                    this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
                    break;
                }
                case Constants.PLUMBING: {
                    budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
                    calculateBudgtedCost = budgetCostFormulae.replace(Constants.NUM_OF_ONE_BHK, buildingDetails.numOfOneBHK)
                        .replace(Constants.NUM_OF_TWO_BHK, buildingDetails.numOfTwoBHK)
                        .replace(Constants.NUM_OF_THREE_BHK, buildingDetails.numOfThreeBHK)
                        .replace(Constants.NUM_OF_FOUR_BHK, buildingDetails.numOfFourBHK)
                        .replace(Constants.NUM_OF_FIVE_BHK, buildingDetails.numOfFiveBHK)
                        .replace(Constants.NUM_OF_ONE_BHK, buildingDetails.numOfOneBHK)
                        .replace(Constants.NUM_OF_TWO_BHK, buildingDetails.numOfTwoBHK)
                        .replace(Constants.NUM_OF_THREE_BHK, buildingDetails.numOfThreeBHK)
                        .replace(Constants.NUM_OF_FOUR_BHK, buildingDetails.numOfFourBHK)
                        .replace(Constants.NUM_OF_FIVE_BHK, buildingDetails.numOfFiveBHK);
                    budgetedCostAmount = eval(calculateBudgtedCost);
                    this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
                    break;
                }
                case Constants.ELECTRICAL_LIGHT_FITTINGS_IN_COMMON_AREAS: {
                    budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
                    calculateBudgtedCost = budgetCostFormulae.replace(Constants.CARPET_AREA, buildingDetails.totalCarpetAreaOfUnit);
                    budgetedCostAmount = eval(calculateBudgtedCost);
                    this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
                    break;
                }
                case Constants.PEST_CONTROL: {
                    budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
                    calculateBudgtedCost = budgetCostFormulae.replace(Constants.CARPET_AREA, buildingDetails.totalCarpetAreaOfUnit);
                    budgetedCostAmount = eval(calculateBudgtedCost);
                    this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
                    break;
                }
                case Constants.SOLAR_WATER_HEATING_SYSTEM: {
                    budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
                    calculateBudgtedCost = budgetCostFormulae.replace(Constants.CARPET_AREA, buildingDetails.totalCarpetAreaOfUnit);
                    budgetedCostAmount = eval(calculateBudgtedCost);
                    this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
                    break;
                }
                case Constants.PIPED_GAS_SYSTEM: {
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
                case Constants.SKY_LOUNGE_ON_TOP_TERRACE: {
                    budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
                    calculateBudgtedCost = budgetCostFormulae.replace(Constants.SLAB_AREA, buildingDetails.totalSlabArea)
                        .replace(Constants.NUM_OF_FLOORS, buildingDetails.totalNumOfFloors)
                        .replace(Constants.NUM_OF_PARKING_FLOORS, buildingDetails.numOfParkingFloors);
                    budgetedCostAmount = eval(calculateBudgtedCost);
                    this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
                    break;
                }
                case Constants.FIRE_FIGHTING_SYSTEM: {
                    budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
                    calculateBudgtedCost = budgetCostFormulae.replace(Constants.NUM_OF_FLOORS, buildingDetails.totalNumOfFloors);
                    budgetedCostAmount = eval(calculateBudgtedCost);
                    this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
                    break;
                }
                case Constants.SECURITY_AUTOMATION: {
                    budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
                    budgetedCostAmount = 1;
                    this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
                    break;
                }
                case Constants.SHOWER_ENCLOSURES: {
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
                case Constants.FALSE_CEILING: {
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
                case Constants.SPECIAL_ELEVATIONAL_FEATURES_IN_FRP_FERRO_GRC: {
                    budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
                    calculateBudgtedCost = budgetCostFormulae.replace(Constants.CARPET_AREA, buildingDetails.totalCarpetAreaOfUnit);
                    budgetedCostAmount = eval(calculateBudgtedCost);
                    this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
                    break;
                }
                case Constants.BOARDS_AND_SIGNAGES_INSIDE_BUILDING: {
                    budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
                    calculateBudgtedCost = budgetCostFormulae.replace(Constants.NUM_OF_ONE_BHK, buildingDetails.numOfOneBHK)
                        .replace(Constants.NUM_OF_TWO_BHK, buildingDetails.numOfTwoBHK)
                        .replace(Constants.NUM_OF_THREE_BHK, buildingDetails.numOfThreeBHK)
                        .replace(Constants.NUM_OF_FOUR_BHK, buildingDetails.numOfFourBHK)
                        .replace(Constants.NUM_OF_FIVE_BHK, buildingDetails.numOfFiveBHK)
                        .replace(Constants.NUM_OF_FLOORS, buildingDetails.totalNumOfFloors);
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
    ProjectService.prototype.calculateBudgetCostForCommonAmmenities = function (costHeadsRateAnalysis, projectDetails) {
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
    ProjectService.prototype.addAttachmentToWorkItem = function (projectId, buildingId, costHeadId, categoryId, workItemId, fileData, callback) {
        var _this = this;
        this.addAttachment(fileData, function (error, attachmentObject) {
            if (error) {
                callback(error, null);
            }
            else {
                var projection = { costHeads: 1 };
                _this.buildingRepository.findByIdWithProjection(buildingId, projection, function (error, building) {
                    if (error) {
                        callback(error, null);
                    }
                    else {
                        var costHeadList = building.costHeads;
                        var costHeads = _this.uploadFile(costHeadList, costHeadId, categoryId, workItemId, attachmentObject);
                        var query = { _id: buildingId };
                        var updateData = { $set: { 'costHeads': costHeads } };
                        _this.buildingRepository.findOneAndUpdate(query, updateData, { new: true }, function (error, response) {
                            if (error) {
                                callback(error, null);
                            }
                            else {
                                callback(null, { data: 'success' });
                            }
                        });
                    }
                });
            }
        });
    };
    ProjectService.prototype.addAttachment = function (fileData, callback) {
        __dirname = path.resolve() + config.get('application.attachmentPath');
        var form = new multiparty.Form({ uploadDir: __dirname });
        form.parse(fileData, function (err, fields, files) {
            if (err) {
                callback(err, null);
            }
            else {
                var file_path = files.file[0].path;
                var assignedFileName = file_path.substr(files.file[0].path.lastIndexOf('\/') + 1);
                logger.info('Attached assigned fileName : ' + assignedFileName);
                var attachmentObject = new AttachmentDetails_1.AttachmentDetailsModel();
                attachmentObject.fileName = files.file[0].originalFilename;
                attachmentObject.assignedFileName = assignedFileName;
                callback(null, attachmentObject);
            }
        });
    };
    ProjectService.prototype.uploadFile = function (costHeadList, costHeadId, categoryId, workItemId, attachmentObject) {
        var costHead = costHeadList.filter(function (currentCostHead) { return currentCostHead.rateAnalysisId === costHeadId; });
        var categories = costHead[0].categories;
        var category = categories.filter(function (currentCategory) { return currentCategory.rateAnalysisId === categoryId; });
        var workItems = category[0].workItems;
        var workItem = workItems.filter(function (currentWorkItem) {
            if (currentWorkItem.rateAnalysisId === workItemId) {
                currentWorkItem.attachmentDetails.push(attachmentObject);
            }
            return;
        });
        return costHeadList;
    };
    ProjectService.prototype.getPresentFilesForBuildingWorkItem = function (projectId, buildingId, costHeadId, categoryId, workItemId, callback) {
        var _this = this;
        logger.info('Project service, getPresentFilesForBuildingWorkItem has been hit');
        var projection = { costHeads: 1 };
        this.buildingRepository.findByIdWithProjection(buildingId, projection, function (error, building) {
            if (error) {
                callback(error, null);
            }
            else {
                var costHeadList = building.costHeads;
                var attachmentList = _this.getPresentFiles(costHeadList, costHeadId, categoryId, workItemId);
                callback(null, { data: attachmentList });
            }
        });
    };
    ProjectService.prototype.getPresentFiles = function (costHeadList, costHeadId, categoryId, workItemId) {
        var attachmentList = new Array();
        var costHead = costHeadList.filter(function (currentCostHead) { return currentCostHead.rateAnalysisId === costHeadId; });
        var categories = costHead[0].categories;
        var category = categories.filter(function (currentCategory) { return currentCategory.rateAnalysisId === categoryId; });
        var workItems = category[0].workItems;
        var workItem = workItems.filter(function (currentWorkItem) { return currentWorkItem.rateAnalysisId === workItemId; });
        attachmentList = workItem[0].attachmentDetails;
        return attachmentList;
    };
    ProjectService.prototype.removeAttachmentOfBuildingWorkItem = function (projectId, buildingId, costHeadId, categoryId, workItemId, assignedFileName, callback) {
        var _this = this;
        logger.info('Project service, removeAttachmentOfBuildingWorkItem has been hit');
        var projection = { costHeads: 1 };
        this.buildingRepository.findByIdWithProjection(buildingId, projection, function (error, building) {
            if (error) {
                callback(error, null);
            }
            else {
                var costHeadList = building.costHeads;
                _this.deleteFile(costHeadList, costHeadId, categoryId, workItemId, assignedFileName);
                var query = { _id: buildingId };
                var data = { $set: { 'costHeads': building.costHeads } };
                _this.buildingRepository.findOneAndUpdate(query, data, { new: true }, function (error, building) {
                    logger.info('Project service, findOneAndUpdate has been hit');
                    if (error) {
                        callback(error, null);
                    }
                    else {
                        fs.unlink('.' + config.get('application.attachmentPath') + '/' + assignedFileName, function (err) {
                            if (err) {
                                callback(error, null);
                            }
                        });
                        callback(null, { data: 'success' });
                    }
                });
            }
        });
    };
    ProjectService.prototype.deleteFile = function (costHeadList, costHeadId, categoryId, workItemId, assignedFileName) {
        var costHead = costHeadList.filter(function (currentCostHead) { return currentCostHead.rateAnalysisId === costHeadId; });
        var categories = costHead[0].categories;
        var category = categories.filter(function (currentCategory) { return currentCategory.rateAnalysisId === categoryId; });
        var workItems = category[0].workItems;
        var workItem = workItems.filter(function (currentWorkItem) {
            if (currentWorkItem.rateAnalysisId === workItemId) {
                var attachmentList = currentWorkItem.attachmentDetails;
                for (var fileIndex in attachmentList) {
                    if (attachmentList[fileIndex].assignedFileName === assignedFileName) {
                        attachmentList.splice(parseInt(fileIndex), 1);
                        break;
                    }
                }
            }
            return;
        });
    };
    ProjectService.prototype.addAttachmentToProjectWorkItem = function (projectId, costHeadId, categoryId, workItemId, fileData, callback) {
        var _this = this;
        this.addAttachment(fileData, function (error, attachmentObject) {
            if (error) {
                callback(error, null);
            }
            else {
                var projection = { projectCostHeads: 1 };
                _this.projectRepository.findByIdWithProjection(projectId, projection, function (error, project) {
                    if (error) {
                        callback(error, null);
                    }
                    else {
                        var costHeadList = project.projectCostHeads;
                        var projectCostHeads = _this.uploadFile(costHeadList, costHeadId, categoryId, workItemId, attachmentObject);
                        var query = { _id: projectId };
                        var updateData = { $set: { 'projectCostHeads': projectCostHeads } };
                        _this.projectRepository.findOneAndUpdate(query, updateData, { new: true }, function (error, response) {
                            if (error) {
                                callback(error, null);
                            }
                            else {
                                callback(null, { data: 'success' });
                            }
                        });
                    }
                });
            }
        });
    };
    ProjectService.prototype.getPresentFilesForProjectWorkItem = function (projectId, costHeadId, categoryId, workItemId, callback) {
        var _this = this;
        logger.info('Project service, getPresentFilesForProjectWorkItem has been hit');
        var projection = { projectCostHeads: 1 };
        this.projectRepository.findByIdWithProjection(projectId, projection, function (error, project) {
            if (error) {
                callback(error, null);
            }
            else {
                var costHeadList = project.projectCostHeads;
                var attachmentList = _this.getPresentFiles(costHeadList, costHeadId, categoryId, workItemId);
                callback(null, { data: attachmentList });
            }
        });
    };
    ProjectService.prototype.removeAttachmentOfProjectWorkItem = function (projectId, costHeadId, categoryId, workItemId, assignedFileName, callback) {
        var _this = this;
        logger.info('Project service, removeAttachmentOfProjectWorkItem has been hit');
        var projection = { projectCostHeads: 1 };
        this.projectRepository.findByIdWithProjection(projectId, projection, function (error, project) {
            if (error) {
                callback(error, null);
            }
            else {
                var costHeadList = project.projectCostHeads;
                _this.deleteFile(costHeadList, costHeadId, categoryId, workItemId, assignedFileName);
                var query = { _id: projectId };
                var data = { $set: { 'projectCostHeads': project.projectCostHeads } };
                _this.projectRepository.findOneAndUpdate(query, data, { new: true }, function (error, project) {
                    logger.info('Project service, findOneAndUpdate has been hit');
                    if (error) {
                        callback(error, null);
                    }
                    else {
                        fs.unlink('.' + config.get('application.attachmentPath') + '/' + assignedFileName, function (err) {
                            if (err) {
                                callback(error, null);
                            }
                        });
                        callback(null, { data: 'success' });
                    }
                });
            }
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
    ProjectService.prototype.clonedWorkitemWithRateAnalysis = function (workItem, workItemAggregateData) {
        for (var _i = 0, workItemAggregateData_1 = workItemAggregateData; _i < workItemAggregateData_1.length; _i++) {
            var aggregateData = workItemAggregateData_1[_i];
            if (workItem.rateAnalysisId === aggregateData.workItem.rateAnalysisId) {
                workItem.rate = aggregateData.workItem.rate;
                break;
            }
        }
    };
    return ProjectService;
}());
Object.seal(ProjectService);
module.exports = ProjectService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHBsaWNhdGlvblByb2plY3Qvc2VydmljZXMvUHJvamVjdFNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhFQUFpRjtBQUNqRixnRkFBbUY7QUFDbkYsb0VBQXVFO0FBQ3ZFLGtFQUFxRTtBQUlyRSw2RUFBZ0Y7QUFDaEYsOEVBQWlGO0FBQ2pGLDBFQUE2RTtBQUU3RSxnRUFBbUU7QUFDbkUsd0VBQTJFO0FBQzNFLHdFQUEyRTtBQUMzRSwyREFBOEQ7QUFDOUQsd0VBQTJFO0FBQzNFLCtCQUFrQztBQUNsQyxxRkFBd0Y7QUFDeEYsaUZBQW9GO0FBQ3BGLHFFQUF3RTtBQUd4RSxpR0FBb0c7QUFDcEcsNkVBQWdGO0FBQ2hGLG1FQUF1RTtBQUN2RSwrRUFBOEU7QUFDOUUsNkZBQWdHO0FBQ2hHLDJCQUE2QjtBQUM3Qix1Q0FBeUM7QUFDekMsNEZBQWdHO0FBQ2hHLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDL0IsbUNBQXFDO0FBS3JDLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0FBQ3RELElBQUksTUFBTSxHQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUMvQyxJQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDekIsSUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUM7QUFDdkM7SUFjRTtRQVJBLDBCQUFxQixHQUFTLElBQUksQ0FBQztRQVNqQyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxpQkFBaUIsRUFBRSxDQUFDO1FBQ2pELElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLGtCQUFrQixFQUFFLENBQUM7UUFDbkQsSUFBSSxDQUFDLFFBQVEsR0FBRyxZQUFZLENBQUMsUUFBUSxD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RyxJQUFJLENBQUMsQ0FBQztRQUNuRCxlQUFlLENBQUMsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1FBQ25GLE1BQU0sQ0FBQyxlQUFlLENBQUM7SUFDekIsQ0FBQztJQUVPLHVEQUE4QixHQUF0QyxVQUF1QyxRQUFpQixFQUFFLHFCQUEwQjtRQUVsRixHQUFHLENBQUEsQ0FBc0IsVUFBcUIsRUFBckIsK0NBQXFCLEVBQXJCLG1DQUFxQixFQUFyQixJQUFxQjtZQUExQyxJQUFJLGFBQWEsOEJBQUE7WUFDbkIsRUFBRSxDQUFBLENBQUMsUUFBUSxDQUFDLGNBQWMsS0FBSyxhQUFhLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFBLENBQUM7Z0JBQ3BFLFFBQVEsQ0FBQyxJQUFJLEdBQUcsYUFBYSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7Z0JBQzVDLEtBQUssQ0FBQztZQUNSLENBQUM7U0FDRjtJQUNILENBQUM7SUFDSCxxQkFBQztBQUFELENBNzZGQSxBQTY2RkMsSUFBQTtBQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDNUIsaUJBQVMsY0FBYyxDQUFDIiwiZmlsZSI6ImFwcC9hcHBsaWNhdGlvblByb2plY3Qvc2VydmljZXMvUHJvamVjdFNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUHJvamVjdFJlcG9zaXRvcnkgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL3JlcG9zaXRvcnkvUHJvamVjdFJlcG9zaXRvcnknKTtcclxuaW1wb3J0IEJ1aWxkaW5nUmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9CdWlsZGluZ1JlcG9zaXRvcnknKTtcclxuaW1wb3J0IFVzZXJTZXJ2aWNlID0gcmVxdWlyZSgnLi8uLi8uLi9mcmFtZXdvcmsvc2VydmljZXMvVXNlclNlcnZpY2UnKTtcclxuaW1wb3J0IFByb2plY3RBc3NldCA9IHJlcXVpcmUoJy4uLy4uL2ZyYW1ld29yay9zaGFyZWQvcHJvamVjdGFzc2V0Jyk7XHJcbmltcG9ydCBVc2VyID0gcmVxdWlyZSgnLi4vLi4vZnJhbWV3b3JrL2RhdGFhY2Nlc3MvbW9uZ29vc2UvdXNlcicpO1xyXG5pbXBvcnQgUHJvamVjdCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9uZ29vc2UvUHJvamVjdCcpO1xyXG5pbXBvcnQgQnVpbGRpbmcgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vbmdvb3NlL0J1aWxkaW5nJyk7XHJcbmltcG9ydCBCdWlsZGluZ01vZGVsID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L2J1aWxkaW5nL0J1aWxkaW5nJyk7XHJcbmltcG9ydCBBdXRoSW50ZXJjZXB0b3IgPSByZXF1aXJlKCcuLi8uLi9mcmFtZXdvcmsvaW50ZXJjZXB0b3IvYXV0aC5pbnRlcmNlcHRvcicpO1xyXG5pbXBvcnQgQ29zdENvbnRyb2xsRXhjZXB0aW9uID0gcmVxdWlyZSgnLi4vZXhjZXB0aW9uL0Nvc3RDb250cm9sbEV4Y2VwdGlvbicpO1xyXG5pbXBvcnQgUXVhbnRpdHkgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3Byb2plY3QvYnVpbGRpbmcvUXVhbnRpdHknKTtcclxuaW1wb3J0IFJhdGUgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3Byb2plY3QvYnVpbGRpbmcvUmF0ZScpO1xyXG5pbXBvcnQgQ29zdEhlYWQgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3Byb2plY3QvYnVpbGRpbmcvQ29zdEhlYWQnKTtcclxuaW1wb3J0IFdvcmtJdGVtID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L2J1aWxkaW5nL1dvcmtJdGVtJyk7XHJcbmltcG9ydCBSYXRlQW5hbHlzaXNTZXJ2aWNlID0gcmVxdWlyZSgnLi9SYXRlQW5hbHlzaXNTZXJ2aWNlJyk7XHJcbmltcG9ydCBDYXRlZ29yeSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9idWlsZGluZy9DYXRlZ29yeScpO1xyXG5pbXBvcnQgYWxhc3FsID0gcmVxdWlyZSgnYWxhc3FsJyk7XHJcbmltcG9ydCBCdWRnZXRDb3N0UmF0ZXMgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3Byb2plY3QvcmVwb3J0cy9CdWRnZXRDb3N0UmF0ZXMnKTtcclxuaW1wb3J0IFRodW1iUnVsZVJhdGUgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3Byb2plY3QvcmVwb3J0cy9UaHVtYlJ1bGVSYXRlJyk7XHJcbmltcG9ydCBDb25zdGFudHMgPSByZXF1aXJlKCcuLi8uLi9hcHBsaWNhdGlvblByb2plY3Qvc2hhcmVkL2NvbnN0YW50cycpO1xyXG5pbXBvcnQgUXVhbnRpdHlEZXRhaWxzID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L2J1aWxkaW5nL1F1YW50aXR5RGV0YWlscycpO1xyXG5pbXBvcnQgUmF0ZUl0ZW0gPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3Byb2plY3QvYnVpbGRpbmcvUmF0ZUl0ZW0nKTtcclxuaW1wb3J0IENhdGVnb3JpZXNMaXN0V2l0aFJhdGVzRFRPID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9kdG8vcHJvamVjdC9DYXRlZ29yaWVzTGlzdFdpdGhSYXRlc0RUTycpO1xyXG5pbXBvcnQgQ2VudHJhbGl6ZWRSYXRlID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L0NlbnRyYWxpemVkUmF0ZScpO1xyXG5pbXBvcnQgbWVzc2FnZXMgID0gcmVxdWlyZSgnLi4vLi4vYXBwbGljYXRpb25Qcm9qZWN0L3NoYXJlZC9tZXNzYWdlcycpO1xyXG5pbXBvcnQgeyBDb21tb25TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vYXBwbGljYXRpb25Qcm9qZWN0L3NoYXJlZC9Db21tb25TZXJ2aWNlJztcclxuaW1wb3J0IFdvcmtJdGVtTGlzdFdpdGhSYXRlc0RUTyA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvZHRvL3Byb2plY3QvV29ya0l0ZW1MaXN0V2l0aFJhdGVzRFRPJyk7XHJcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XHJcbmltcG9ydCAqIGFzIG11bHRpcGFydHkgZnJvbSAnbXVsdGlwYXJ0eSc7XHJcbmltcG9ydCB7IEF0dGFjaG1lbnREZXRhaWxzTW9kZWwgfSBmcm9tICcuLi9kYXRhYWNjZXNzL21vZGVsL3Byb2plY3QvYnVpbGRpbmcvQXR0YWNobWVudERldGFpbHMnO1xyXG5sZXQgY29uZmlnID0gcmVxdWlyZSgnY29uZmlnJyk7XHJcbmxldCBsb2c0anMgPSByZXF1aXJlKCdsb2c0anMnKTtcclxuaW1wb3J0ICogYXMgbW9uZ29vc2UgZnJvbSAnbW9uZ29vc2UnO1xyXG5pbXBvcnQgUmF0ZUFuYWx5c2lzID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9SYXRlQW5hbHlzaXMvUmF0ZUFuYWx5c2lzJyk7XHJcblxyXG4vL2ltcG9ydCBSYXRlSXRlbXNBbmFseXNpc0RhdGEgPSByZXF1aXJlKFwiLi4vZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L2J1aWxkaW5nL1JhdGVJdGVtc0FuYWx5c2lzRGF0YVwiKTtcclxuXHJcbmxldCBDQ1Byb21pc2UgPSByZXF1aXJlKCdwcm9taXNlL2xpYi9lczYtZXh0ZW5zaW9ucycpO1xyXG5sZXQgbG9nZ2VyPWxvZzRqcy5nZXRMb2dnZXIoJ1Byb2plY3Qgc2VydmljZScpO1xyXG5jb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XHJcbmxldCBPYmplY3RJZCA9IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkO1xyXG5jbGFzcyBQcm9qZWN0U2VydmljZSB7XHJcbiAgQVBQX05BTUU6IHN0cmluZztcclxuICBjb21wYW55X25hbWU6IHN0cmluZztcclxuICBjb3N0SGVhZElkOiBudW1iZXI7XHJcbiAgY2F0ZWdvcnlJZDogbnVtYmVyO1xyXG4gIHdvcmtJdGVtSWQ6IG51bWJlcjtcclxuICBzaG93SGlkZUFkZEl0ZW1CdXR0b246Ym9vbGVhbj10cnVlO1xyXG4gIHByaXZhdGUgcHJvamVjdFJlcG9zaXRvcnk6IFByb2plY3RSZXBvc2l0b3J5O1xyXG4gIHByaXZhdGUgYnVpbGRpbmdSZXBvc2l0b3J5OiBCdWlsZGluZ1JlcG9zaXRvcnk7XHJcbiAgcHJpdmF0ZSBhdXRoSW50ZXJjZXB0b3I6IEF1dGhJbnRlcmNlcHRvcjtcclxuICBwcml2YXRlIHVzZXJTZXJ2aWNlOiBVc2VyU2VydmljZTtcclxuICBwcml2YXRlIGNvbW1vblNlcnZpY2U6IENvbW1vblNlcnZpY2U7XHJcblxyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMucHJvamVjdFJlcG9zaXRvcnkgPSBuZXcgUHJvamVjdFJlcG9zaXRvcnkoKTtcclxuICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5ID0gbmV3IEJ1aWxkaW5nUmVwb3NpdG9yeSgpO1xyXG4gICAgdGhpcy5BUFBfTkFNRSA9IFByb2plY3RBc3NldC5BUFBfTkFNRTtcclxuICAgIHRoaXMuYXV0aEludGVyY2VwdG9yID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xyXG4gICAgdGhpcy51c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgdGhpcy5jb21tb25TZXJ2aWNlID0gbmV3IENvbW1vblNlcnZpY2UoKTtcclxuICB9XHJcblxyXG4gIGNyZWF0ZVByb2plY3QoZGF0YTogUHJvamVjdCwgdXNlcjogVXNlciwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgaWYgKCF1c2VyLl9pZCkge1xyXG4gICAgICBjYWxsYmFjayhuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKCdVc2VySWQgTm90IEZvdW5kJywgbnVsbCksIG51bGwpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMucHJvamVjdFJlcG9zaXRvcnkuY3JlYXRlKGRhdGEsIChlcnIsIHJlcykgPT4ge1xyXG4gICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBjcmVhdGUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgICAgbG9nZ2VyLmRlYnVnKCdQcm9qZWN0IElEIDogJyArIHJlcy5faWQpO1xyXG4gICAgICAgIGxvZ2dlci5kZWJ1ZygnUHJvamVjdCBOYW1lIDogJyArIHJlcy5uYW1lKTtcclxuICAgICAgICBsZXQgcHJvamVjdElkID0gcmVzLl9pZDtcclxuICAgICAgICBsZXQgbmV3RGF0YSA9IHskcHVzaDoge3Byb2plY3Q6IHByb2plY3RJZH19O1xyXG4gICAgICAgIGxldCBxdWVyeSA9IHtfaWQ6IHVzZXIuX2lkfTtcclxuICAgICAgICB0aGlzLnVzZXJTZXJ2aWNlLmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIG5ld0RhdGEsIHtuZXc6IHRydWV9LCAoZXJyLCByZXNwKSA9PiB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kT25lQW5kVXBkYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZGVsZXRlIHJlcy5jYXRlZ29yeTtcclxuICAgICAgICAgICAgZGVsZXRlIHJlcy5yYXRlO1xyXG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCByZXMpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldFByb2plY3RCeUlkKHByb2plY3RJZDogc3RyaW5nLCB1c2VyOiBVc2VyLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBsZXQgcXVlcnkgPSB7X2lkOiBwcm9qZWN0SWR9O1xyXG4gICAgbGV0IHBvcHVsYXRlID0ge3BhdGg6ICdidWlsZGluZycsIHNlbGVjdDogWyduYW1lJywgJ3RvdGFsU2xhYkFyZWEnLF19O1xyXG4gICAgdGhpcy5wcm9qZWN0UmVwb3NpdG9yeS5maW5kQW5kUG9wdWxhdGUocXVlcnksIHBvcHVsYXRlLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kQW5kUG9wdWxhdGUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGxvZ2dlci5kZWJ1ZygnUHJvamVjdCBOYW1lIDogJyArIHJlc3VsdFswXS5uYW1lKTtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiByZXN1bHQsIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRQcm9qZWN0QW5kQnVpbGRpbmdEZXRhaWxzKHByb2plY3RJZDogc3RyaW5nLCBidWlsZGluZ0lkOiBzdHJpbmcsIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGdldFByb2plY3RBbmRCdWlsZGluZ0RldGFpbHMgZm9yIHN5bmMgd2l0aCByYXRlQW5hbHlzaXMgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICBsZXQgcXVlcnkgPSB7X2lkOiBwcm9qZWN0SWR9O1xyXG4gICAgbGV0IHBvcHVsYXRlID0ge3BhdGg6ICdidWlsZGluZ3MnfTtcclxuICAgIHRoaXMucHJvamVjdFJlcG9zaXRvcnkuZmluZEFuZFBvcHVsYXRlKHF1ZXJ5LCBwb3B1bGF0ZSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZmluZEFuZFBvcHVsYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBsb2dnZXIuZXJyb3IoJ1Byb2plY3Qgc2VydmljZSwgZ2V0UHJvamVjdEFuZEJ1aWxkaW5nRGV0YWlscyBmaW5kQW5kUG9wdWxhdGUgZmFpbGVkICcgKyBKU09OLnN0cmluZ2lmeShlcnJvcikpO1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsb2dnZXIuZGVidWcoJ2dldFByb2plY3RBbmRCdWlsZGluZ0RldGFpbHMgc3VjY2Vzcy4nKTtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTogcmVzdWx0fSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlUHJvamVjdEJ5SWQocHJvamVjdERldGFpbHM6IFByb2plY3QsIHVzZXI6IFVzZXIsIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIHVwZGF0ZVByb2plY3REZXRhaWxzIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgbGV0IHF1ZXJ5ID0ge19pZDogcHJvamVjdERldGFpbHMuX2lkfTtcclxuICAgIGxldCBidWlsZGluZ0lkID0gJyc7XHJcblxyXG4gICAgdGhpcy5nZXRQcm9qZWN0QW5kQnVpbGRpbmdEZXRhaWxzKHByb2plY3REZXRhaWxzLl9pZCwgYnVpbGRpbmdJZCwgKGVycm9yLCBwcm9qZWN0QW5kQnVpbGRpbmdEZXRhaWxzKSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGxvZ2dlci5lcnJvcignUHJvamVjdCBzZXJ2aWNlLCBnZXRQcm9qZWN0QW5kQnVpbGRpbmdEZXRhaWxzIGZhaWxlZCcpO1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgc3luY1Byb2plY3RXaXRoUmF0ZUFuYWx5c2lzRGF0YS4nKTtcclxuICAgICAgICBsZXQgcHJvamVjdERhdGEgPSBwcm9qZWN0QW5kQnVpbGRpbmdEZXRhaWxzLmRhdGFbMF07XHJcbiAgICAgICAgbGV0IGJ1aWxkaW5ncyA9IHByb2plY3RBbmRCdWlsZGluZ0RldGFpbHMuZGF0YVswXS5idWlsZGluZ3M7XHJcbiAgICAgICAgbGV0IGJ1aWxkaW5nRGF0YTogQnVpbGRpbmc7XHJcbiAgICAgICAgZGVsZXRlIHByb2plY3REZXRhaWxzLl9pZDtcclxuICAgICAgICBwcm9qZWN0RGV0YWlscy5wcm9qZWN0Q29zdEhlYWRzID0gcHJvamVjdERhdGEucHJvamVjdENvc3RIZWFkcztcclxuICAgICAgICBwcm9qZWN0RGV0YWlscy5idWlsZGluZ3MgPSBwcm9qZWN0RGF0YS5idWlsZGluZ3M7XHJcbiAgICAgICAgcHJvamVjdERldGFpbHMucHJvamVjdENvc3RIZWFkcyA9IHRoaXMuY2FsY3VsYXRlQnVkZ2V0Q29zdEZvckNvbW1vbkFtbWVuaXRpZXMocHJvamVjdERhdGEucHJvamVjdENvc3RIZWFkcywgcHJvamVjdERldGFpbHMpO1xyXG5cclxuICAgICAgICB0aGlzLnByb2plY3RSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIHByb2plY3REZXRhaWxzLCB7bmV3OiB0cnVlfSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGZpbmRPbmVBbmRVcGRhdGUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGE6IHJlc3VsdCwgYWNjZXNzX3Rva2VuOiB0aGlzLmF1dGhJbnRlcmNlcHRvci5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKX0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGNyZWF0ZUJ1aWxkaW5nKHByb2plY3RJZDogc3RyaW5nLCBidWlsZGluZ0RldGFpbHM6IEJ1aWxkaW5nLCB1c2VyOiBVc2VyLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcblxyXG4gICAgbG9nZ2VyLmluZm8oJ1JlcG9ydCBTZXJ2aWNlLCBnZXRNYXRlcmlhbEZpbHRlcnMgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICBsZXQgcXVlcnkgPSB7IF9pZDogcHJvamVjdElkfTtcclxuICAgIGxldCBwb3B1bGF0ZSA9IHtwYXRoIDogJ2J1aWxkaW5ncycsIHNlbGVjdDogWyduYW1lJ119O1xyXG4gICAgdGhpcy5wcm9qZWN0UmVwb3NpdG9yeS5maW5kQW5kUG9wdWxhdGUocXVlcnksIHBvcHVsYXRlLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUmVwb3J0IFNlcnZpY2UsIGZpbmRBbmRQb3B1bGF0ZSBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IGJ1aWxkaW5nTmFtZSA9IGJ1aWxkaW5nRGV0YWlscy5uYW1lO1xyXG5cclxuICAgICAgICBsZXQgYnVpbGRpbmc6IEFycmF5PEJ1aWxkaW5nPiA9IHJlc3VsdFswXS5idWlsZGluZ3MuZmlsdGVyKFxyXG4gICAgICAgICAgZnVuY3Rpb24gKGJ1aWxkaW5nOiBhbnkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGJ1aWxkaW5nLm5hbWUgPT09IGJ1aWxkaW5nTmFtZTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZihidWlsZGluZy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmNyZWF0ZShidWlsZGluZ0RldGFpbHMsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGNyZWF0ZSBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGxldCBxdWVyeSA9IHtfaWQ6IHByb2plY3RJZH07XHJcbiAgICAgICAgICAgICAgbGV0IG5ld0RhdGEgPSB7JHB1c2g6IHtidWlsZGluZ3M6IHJlc3VsdC5faWR9fTtcclxuICAgICAgICAgICAgICB0aGlzLnByb2plY3RSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIG5ld0RhdGEsIHtuZXc6IHRydWV9LCAoZXJyb3IsIHN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZmluZE9uZUFuZFVwZGF0ZSBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTogcmVzdWx0LCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbGV0IGVycm9yID0gbmV3IEVycm9yKCk7XHJcbiAgICAgICAgICBlcnJvci5tZXNzYWdlID0gbWVzc2FnZXMuTVNHX0VSUk9SX0JVSUxESU5HX05BTUVfQUxSRUFEWV9FWElTVDtcclxuICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVCdWlsZGluZ0J5SWQocHJvamVjdElkIDogc3RyaW5nLCBidWlsZGluZ0lkOiBzdHJpbmcsIGJ1aWxkaW5nRGV0YWlsczogYW55LCB1c2VyOiBVc2VyLFxyXG4gICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCB1cGRhdGVCdWlsZGluZyBoYXMgYmVlbiBoaXQnKTtcclxuICAgIGxldCBxdWVyeSA9IHtfaWQ6IGJ1aWxkaW5nSWR9O1xyXG4gICAgbGV0IHByb2plY3Rpb24gPSB7J2Nvc3RIZWFkcyc6IDF9O1xyXG4gICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZEJ5SWRXaXRoUHJvamVjdGlvbihidWlsZGluZ0lkLCBwcm9qZWN0aW9uLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kT25lQW5kVXBkYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYnVpbGRpbmdEZXRhaWxzLmNvc3RIZWFkcyA9IHRoaXMuY2FsY3VsYXRlQnVkZ2V0Q29zdEZvckJ1aWxkaW5nKHJlc3VsdC5jb3N0SGVhZHMsIGJ1aWxkaW5nRGV0YWlscyk7XHJcblxyXG4gICAgICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIGJ1aWxkaW5nRGV0YWlscywge25ldzogdHJ1ZX0sIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kT25lQW5kVXBkYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmdldFByb2plY3RBbmRCdWlsZGluZ0RldGFpbHMocHJvamVjdElkLCBidWlsZGluZ0lkLCAoZXJyb3IsIHByb2plY3RBbmRCdWlsZGluZ0RldGFpbHMpID0+IHtcclxuICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcignUHJvamVjdCBzZXJ2aWNlLCBnZXRQcm9qZWN0QW5kQnVpbGRpbmdEZXRhaWxzIGZhaWxlZCcpO1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIHN5bmNQcm9qZWN0V2l0aFJhdGVBbmFseXNpc0RhdGEuJyk7XHJcbiAgICAgICAgICAgICAgICBsZXQgcHJvamVjdERhdGEgPSBwcm9qZWN0QW5kQnVpbGRpbmdEZXRhaWxzLmRhdGFbMF07XHJcbiAgICAgICAgICAgICAgICBsZXQgcHJvamVjdENvc3RIZWFkcyA9IHRoaXMuY2FsY3VsYXRlQnVkZ2V0Q29zdEZvckNvbW1vbkFtbWVuaXRpZXMocHJvamVjdERhdGEucHJvamVjdENvc3RIZWFkcywgcHJvamVjdERhdGEpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHF1ZXJ5Rm9yUHJvamVjdCA9IHsnX2lkJzogcHJvamVjdElkfTtcclxuICAgICAgICAgICAgICAgIGxldCB1cGRhdGVQcm9qZWN0Q29zdEhlYWQgPSB7JHNldDogeydwcm9qZWN0Q29zdEhlYWRzJzogcHJvamVjdENvc3RIZWFkc319O1xyXG5cclxuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKCdDYWxsaW5nIHVwZGF0ZSBwcm9qZWN0IENvc3RoZWFkcyBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucHJvamVjdFJlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeUZvclByb2plY3QsIHVwZGF0ZVByb2plY3RDb3N0SGVhZCwge25ldzogdHJ1ZX0sXHJcbiAgICAgICAgICAgICAgICAgIChlcnJvcjogYW55LCByZXNwb25zZTogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoJ0Vycm9yIHVwZGF0ZSBwcm9qZWN0IENvc3RoZWFkcyA6ICcgKyBKU09OLnN0cmluZ2lmeShlcnJvcikpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZGVidWcoJ1VwZGF0ZSBwcm9qZWN0IENvc3RoZWFkcyBzdWNjZXNzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTogcmVzdWx0LCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldEluQWN0aXZlUHJvamVjdENvc3RIZWFkcyhwcm9qZWN0SWQ6IHN0cmluZywgdXNlcjogVXNlciwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZ2V0SW5BY3RpdmVDb3N0SGVhZCBoYXMgYmVlbiBoaXQnKTtcclxuICAgIHRoaXMucHJvamVjdFJlcG9zaXRvcnkuZmluZEJ5SWQocHJvamVjdElkLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZmluZEJ5SWQgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgICAgbG9nZ2VyLmRlYnVnKCdnZXR0aW5nIEluQWN0aXZlIENvc3RIZWFkIGZvciBQcm9qZWN0IE5hbWUgOiAnICsgcmVzdWx0Lm5hbWUpO1xyXG4gICAgICAgIGxldCByZXNwb25zZSA9IHJlc3VsdC5wcm9qZWN0Q29zdEhlYWRzO1xyXG4gICAgICAgIGxldCBpbkFjdGl2ZUNvc3RIZWFkID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgY29zdEhlYWRJdGVtIG9mIHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICBpZiAoIWNvc3RIZWFkSXRlbS5hY3RpdmUpIHtcclxuICAgICAgICAgICAgaW5BY3RpdmVDb3N0SGVhZC5wdXNoKGNvc3RIZWFkSXRlbSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiBpbkFjdGl2ZUNvc3RIZWFkLCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc2V0UHJvamVjdENvc3RIZWFkU3RhdHVzKHByb2plY3RJZDogc3RyaW5nLCBjb3N0SGVhZElkOiBudW1iZXIsIGNvc3RIZWFkQWN0aXZlU3RhdHVzOiBzdHJpbmcsIHVzZXI6IFVzZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxldCBxdWVyeSA9IHsnX2lkJzogcHJvamVjdElkLCAncHJvamVjdENvc3RIZWFkcy5yYXRlQW5hbHlzaXNJZCc6IGNvc3RIZWFkSWR9O1xyXG4gICAgbGV0IGFjdGl2ZVN0YXR1cyA9IEpTT04ucGFyc2UoY29zdEhlYWRBY3RpdmVTdGF0dXMpO1xyXG4gICAgbGV0IG5ld0RhdGEgPSB7JHNldDogeydwcm9qZWN0Q29zdEhlYWRzLiQuYWN0aXZlJzogYWN0aXZlU3RhdHVzfX07XHJcbiAgICB0aGlzLnByb2plY3RSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIG5ld0RhdGEsIHtuZXc6IHRydWV9LCAoZXJyLCByZXNwb25zZSkgPT4ge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kT25lQW5kVXBkYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTogcmVzcG9uc2UsIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgY2xvbmVCdWlsZGluZ0RldGFpbHMocHJvamVjdElkOiBzdHJpbmcsIGJ1aWxkaW5nSWQ6IHN0cmluZywgb2xkQnVpbGRpbmdEZXRhaWxzOiBCdWlsZGluZywgdXNlcjogVXNlcixcclxuICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKGVycm9yOiBFcnJvciwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGNsb25lQnVpbGRpbmdEZXRhaWxzIGhhcyBiZWVuIGhpdCcpO1xyXG5cclxuICAgIGxldCBxdWVyeSA9IHsgX2lkOiBwcm9qZWN0SWR9O1xyXG4gICAgbGV0IHBvcHVsYXRlID0ge3BhdGggOiAnYnVpbGRpbmdzJywgc2VsZWN0OiBbJ25hbWUnXX07XHJcbiAgICB0aGlzLnByb2plY3RSZXBvc2l0b3J5LmZpbmRBbmRQb3B1bGF0ZShxdWVyeSwgcG9wdWxhdGUsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdSZXBvcnQgU2VydmljZSwgZmluZEFuZFBvcHVsYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBpZihlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgYnVpbGRpbmdOYW1lID0gb2xkQnVpbGRpbmdEZXRhaWxzLm5hbWU7XHJcblxyXG4gICAgICAgIGxldCBidWlsZGluZzogQXJyYXk8QnVpbGRpbmc+ID0gcmVzdWx0WzBdLmJ1aWxkaW5ncy5maWx0ZXIoXHJcbiAgICAgICAgICBmdW5jdGlvbiAoYnVpbGRpbmc6IGFueSkge1xyXG4gICAgICAgICAgICByZXR1cm4gYnVpbGRpbmcubmFtZSA9PT0gYnVpbGRpbmdOYW1lO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmKGJ1aWxkaW5nLmxlbmd0aCA9PT0gMCkge1xyXG5cclxuICAgICAgICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmZpbmRCeUlkKGJ1aWxkaW5nSWQsIChlcnJvciwgYnVpbGRpbmcpID0+IHtcclxuICAgICAgICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZmluZEJ5SWQgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBsZXQgY29zdEhlYWRzOkNvc3RIZWFkW10gPSBidWlsZGluZy5jb3N0SGVhZHM7XHJcbiAgICAgICAgICAgICAgbGV0IHJhdGVBbmFseXNpc0RhdGE7XHJcbiAgICAgICAgICAgICAgaWYgKG9sZEJ1aWxkaW5nRGV0YWlscy5jbG9uZUl0ZW1zICYmIG9sZEJ1aWxkaW5nRGV0YWlscy5jbG9uZUl0ZW1zLmluZGV4T2YoQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfQ0xPTkUpID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJhdGVBbmFseXNpc1NlcnZpY2U6IFJhdGVBbmFseXNpc1NlcnZpY2UgPSBuZXcgUmF0ZUFuYWx5c2lzU2VydmljZSgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHF1ZXJ5ID0gW1xyXG4gICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHByb2plY3Q6e1xyXG4gICAgICAgICAgICAgICAgICAgICAgJ2J1aWxkaW5nQ29zdEhlYWRzLmNhdGVnb3JpZXMud29ya0l0ZW1zJzoxXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICB7JHVud2luZDogJyRidWlsZGluZ0Nvc3RIZWFkcyd9LFxyXG4gICAgICAgICAgICAgICAgICB7JHVud2luZDogJyRidWlsZGluZ0Nvc3RIZWFkcy5jYXRlZ29yaWVzJ30sXHJcbiAgICAgICAgICAgICAgICAgIHskdW53aW5kOiAnJGJ1aWxkaW5nQ29zdEhlYWRzLmNhdGVnb3JpZXMud29ya0l0ZW1zJ30sXHJcbiAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAkcHJvamVjdDp7X2lkOjAsd29ya0l0ZW06JyRidWlsZGluZ0Nvc3RIZWFkcy5jYXRlZ29yaWVzLndvcmtJdGVtcyd9XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgICAgICByYXRlQW5hbHlzaXNTZXJ2aWNlLmdldEFnZ3JlZ2F0ZURhdGEocXVlcnksKGVycm9yLCB3b3JrSXRlbUFnZ3JlZ2F0ZURhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJhdGVBbmFseXNpc1NlcnZpY2UuZ2V0Q29zdENvbnRyb2xSYXRlQW5hbHlzaXMoe30seydidWlsZGluZ1JhdGVzJzoxfSwgKGVycjogYW55LCBkYXRhOmFueSk9PntcclxuICAgICAgICAgICAgICAgICAgICAgIGlmKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0UmF0ZXNBbmRDb3N0SGVhZHMocHJvamVjdElkLG9sZEJ1aWxkaW5nRGV0YWlscywgYnVpbGRpbmcsIGNvc3RIZWFkcyx3b3JrSXRlbUFnZ3JlZ2F0ZURhdGEsdXNlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLmJ1aWxkaW5nUmF0ZXMsIGNhbGxiYWNrKTtcclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0UmF0ZXNBbmRDb3N0SGVhZHMocHJvamVjdElkLG9sZEJ1aWxkaW5nRGV0YWlscywgYnVpbGRpbmcsIGNvc3RIZWFkcyxudWxsLCB1c2VyLFxyXG4gICAgICAgICAgICAgICAgICBudWxsLCBjYWxsYmFjayk7XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbGV0IGVycm9yID0gbmV3IEVycm9yKCk7XHJcbiAgICAgICAgICBlcnJvci5tZXNzYWdlID0gbWVzc2FnZXMuTVNHX0VSUk9SX0JVSUxESU5HX05BTUVfQUxSRUFEWV9FWElTVDtcclxuICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG5cclxuICB9XHJcblxyXG4gIGdldFJhdGVzQW5kQ29zdEhlYWRzKHByb2plY3RJZDogc3RyaW5nLG9sZEJ1aWxkaW5nRGV0YWlsczogQnVpbGRpbmcsIGJ1aWxkaW5nOkJ1aWxkaW5nLCBjb3N0SGVhZHM6IENvc3RIZWFkW10sd29ya0l0ZW1BZ2dyZWdhdGVEYXRhOmFueSxcclxuICAgICAgICAgICAgICB1c2VyOiBVc2VyLCBjZW50cmFsaXplZFJhdGVzOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IEVycm9yLCByZXN1bHQ6IEJ1aWxkaW5nKSA9PiB2b2lkKSB7XHJcbiAgICBvbGRCdWlsZGluZ0RldGFpbHMuY29zdEhlYWRzID0gdGhpcy5jYWxjdWxhdGVCdWRnZXRDb3N0Rm9yQnVpbGRpbmcoYnVpbGRpbmcuY29zdEhlYWRzLCBvbGRCdWlsZGluZ0RldGFpbHMpO1xyXG4gICAgdGhpcy5jbG9uZUNvc3RIZWFkcyhjb3N0SGVhZHMsIG9sZEJ1aWxkaW5nRGV0YWlscyx3b3JrSXRlbUFnZ3JlZ2F0ZURhdGEpO1xyXG4gICAgaWYob2xkQnVpbGRpbmdEZXRhaWxzLmNsb25lSXRlbXMuaW5kZXhPZihDb25zdGFudHMuUkFURV9BTkFMWVNJU19DTE9ORSkgPT09IC0xKSB7XHJcbiAgICAgIC8vb2xkQnVpbGRpbmdEZXRhaWxzLnJhdGVzPXRoaXMuZ2V0Q2VudHJhbGl6ZWRSYXRlcyhyYXRlQW5hbHlzaXNEYXRhLCBvbGRCdWlsZGluZ0RldGFpbHMuY29zdEhlYWRzKTtcclxuICAgICAgb2xkQnVpbGRpbmdEZXRhaWxzLnJhdGVzID0gY2VudHJhbGl6ZWRSYXRlcztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG9sZEJ1aWxkaW5nRGV0YWlscy5yYXRlcyA9IGJ1aWxkaW5nLnJhdGVzO1xyXG4gICAgfVxyXG4gICAgdGhpcy5jcmVhdGVCdWlsZGluZyhwcm9qZWN0SWQsIG9sZEJ1aWxkaW5nRGV0YWlscywgdXNlciwgKGVycm9yLCByZXMpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHJlcyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgY2xvbmVDb3N0SGVhZHMoY29zdEhlYWRzOiBhbnlbXSwgb2xkQnVpbGRpbmdEZXRhaWxzOiBCdWlsZGluZyxyYXRlQW5hbHlzaXNEYXRhOmFueSkge1xyXG4gICAgbGV0IGlzQ2xvbmU6IGJvb2xlYW4gPSAob2xkQnVpbGRpbmdEZXRhaWxzLmNsb25lSXRlbXMgJiYgb2xkQnVpbGRpbmdEZXRhaWxzLmNsb25lSXRlbXMuaW5kZXhPZihDb25zdGFudHMuQ09TVF9IRUFEX0NMT05FKSAhPT0gLTEpO1xyXG4gICAgZm9yIChsZXQgY29zdEhlYWRJbmRleCBpbiBjb3N0SGVhZHMpIHtcclxuICAgICAgaWYgKHBhcnNlSW50KGNvc3RIZWFkSW5kZXgpIDwgY29zdEhlYWRzLmxlbmd0aCkge1xyXG4gICAgICAgIGxldCBjb3N0SGVhZCA9IGNvc3RIZWFkc1tjb3N0SGVhZEluZGV4XTtcclxuICAgICAgICBpZiAoIWlzQ2xvbmUpIHtcclxuICAgICAgICAgIGNvc3RIZWFkLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb3N0SGVhZHNbY29zdEhlYWRJbmRleF0gPSB0aGlzLmNsb25lQ2F0ZWdvcnkoY29zdEhlYWQuY2F0ZWdvcmllcywgb2xkQnVpbGRpbmdEZXRhaWxzLmNsb25lSXRlbXMscmF0ZUFuYWx5c2lzRGF0YSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBjb3N0SGVhZHM7XHJcbiAgfVxyXG5cclxuICBjbG9uZUNhdGVnb3J5KGNhdGVnb3JpZXM6IENhdGVnb3J5W10sIGNsb25lSXRlbXM6IHN0cmluZ1tdLHJhdGVBbmFseXNpc0RhdGE6YW55KSB7XHJcbiAgICBsZXQgaXNDbG9uZTogYm9vbGVhbiA9KGNsb25lSXRlbXMgJiYgY2xvbmVJdGVtcy5pbmRleE9mKENvbnN0YW50cy5DQVRFR09SWV9DTE9ORSkgIT09IC0xKTtcclxuICAgIGZvciAobGV0IGNhdGVnb3J5SW5kZXggaW4gY2F0ZWdvcmllcykge1xyXG4gICAgICBsZXQgY2F0ZWdvcnkgPSBjYXRlZ29yaWVzW2NhdGVnb3J5SW5kZXhdO1xyXG4gICAgICBpZiAoIWlzQ2xvbmUpIHtcclxuICAgICAgICBjYXRlZ29yeS5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgICBjYXRlZ29yaWVzW2NhdGVnb3J5SW5kZXhdLndvcmtJdGVtcyA9IHRoaXMuY2xvbmVXb3JrSXRlbXMoY2F0ZWdvcnkud29ya0l0ZW1zLCBjbG9uZUl0ZW1zLHJhdGVBbmFseXNpc0RhdGEpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNhdGVnb3JpZXM7XHJcbiAgfVxyXG5cclxuICBjbG9uZVdvcmtJdGVtcyh3b3JrSXRlbXM6IFdvcmtJdGVtW10sIGNsb25lSXRlbXM6IHN0cmluZ1tdLHJhdGVBbmFseXNpc0RhdGE6YW55KSB7XHJcbiAgICBsZXQgaXNDbG9uZTogYm9vbGVhbiA9IChjbG9uZUl0ZW1zICYmIGNsb25lSXRlbXMuaW5kZXhPZihDb25zdGFudHMuV09SS19JVEVNX0NMT05FKSAhPT0gLTEpO1xyXG4gICAgZm9yIChsZXQgd29ya0l0ZW1JbmRleCBpbiB3b3JrSXRlbXMpIHtcclxuICAgICAgbGV0IHdvcmtJdGVtID0gd29ya0l0ZW1zW3dvcmtJdGVtSW5kZXhdO1xyXG4gICAgICBpZiAoIWlzQ2xvbmUpIHtcclxuICAgICAgICB3b3JrSXRlbS5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLmNsb25lUmF0ZSh3b3JrSXRlbSwgY2xvbmVJdGVtcyxyYXRlQW5hbHlzaXNEYXRhKTtcclxuICAgICAgdGhpcy5jbG9uZVF1YW50aXR5KHdvcmtJdGVtLCBjbG9uZUl0ZW1zKTtcclxuICAgIH1cclxuICAgIHJldHVybiB3b3JrSXRlbXM7XHJcbiAgfVxyXG5cclxuICBjbG9uZVJhdGUod29ya0l0ZW06IFdvcmtJdGVtLCBjbG9uZUl0ZW1zOiBzdHJpbmdbXSxyYXRlQW5hbHlzaXNEYXRhOmFueSkge1xyXG4gICAgbGV0IGlzQ2xvbmU6IGJvb2xlYW4gPSBjbG9uZUl0ZW1zICYmIGNsb25lSXRlbXMuaW5kZXhPZihDb25zdGFudHMuUkFURV9BTkFMWVNJU19DTE9ORSkgIT09IC0xO1xyXG4gICAgbGV0IHJhdGVBbmFseXNpc1NlcnZpY2U6IFJhdGVBbmFseXNpc1NlcnZpY2UgPSBuZXcgUmF0ZUFuYWx5c2lzU2VydmljZSgpO1xyXG4gICAgbGV0IGNvbmZpZ1dvcmtJdGVtcyA9IG5ldyBBcnJheTxXb3JrSXRlbT4oKTtcclxuICAgIGlmICghaXNDbG9uZSkge1xyXG4gICAgICAvKndvcmtJdGVtID0gcmF0ZUFuYWx5c2lzU2VydmljZS5nZXRSYXRlQW5hbHlzaXMod29ya0l0ZW0sIGNvbmZpZ1dvcmtJdGVtcywgcmF0ZUFuYWx5c2lzRGF0YS5yYXRlcyxcclxuICAgICAgICByYXRlQW5hbHlzaXNEYXRhLnVuaXRzLCByYXRlQW5hbHlzaXNEYXRhLm5vdGVzKTsqL1xyXG4gICAgICB3b3JrSXRlbSA9IHRoaXMuY2xvbmVkV29ya2l0ZW1XaXRoUmF0ZUFuYWx5c2lzKHdvcmtJdGVtLCByYXRlQW5hbHlzaXNEYXRhKTtcclxuICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gIGNsb25lUXVhbnRpdHkod29ya0l0ZW06IFdvcmtJdGVtLCBjbG9uZUl0ZW1zOiBzdHJpbmdbXSkge1xyXG4gICAgbGV0IGlzQ2xvbmU6IGJvb2xlYW4gPSAoY2xvbmVJdGVtcyAmJiBjbG9uZUl0ZW1zLmluZGV4T2YoQ29uc3RhbnRzLlFVQU5USVRZX0NMT05FKSAhPT0gLTEpO1xyXG4gICAgaWYgKCFpc0Nsb25lKSB7XHJcbiAgICAgIHdvcmtJdGVtLnF1YW50aXR5LnF1YW50aXR5SXRlbURldGFpbHMgPSBbXTtcclxuICAgICAgd29ya0l0ZW0ucXVhbnRpdHkuaXNEaXJlY3RRdWFudGl0eSA9IGZhbHNlO1xyXG4gICAgICB3b3JrSXRlbS5xdWFudGl0eS5pc0VzdGltYXRlZCA9IGZhbHNlO1xyXG4gICAgICB3b3JrSXRlbS5xdWFudGl0eS50b3RhbCA9IDA7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gd29ya0l0ZW07XHJcbiAgfVxyXG5cclxuXHJcbiAgZ2V0QnVpbGRpbmdCeUlkKHByb2plY3RJZDogc3RyaW5nLCBidWlsZGluZ0lkOiBzdHJpbmcsIHVzZXI6IFVzZXIsIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGdldEJ1aWxkaW5nIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZEJ5SWQoYnVpbGRpbmdJZCwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZmluZEJ5SWQgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTogcmVzdWx0LCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0QnVpbGRpbmdSYXRlSXRlbXNCeU9yaWdpbmFsTmFtZShwcm9qZWN0SWQ6IHN0cmluZywgYnVpbGRpbmdJZDogc3RyaW5nLCBvcmlnaW5hbFJhdGVJdGVtTmFtZTogc3RyaW5nLCB1c2VyOiBVc2VyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbGV0IHByb2plY3Rpb24gPSB7J3JhdGVzJzogMSwgX2lkOiAwfTtcclxuICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmZpbmRCeUlkV2l0aFByb2plY3Rpb24oYnVpbGRpbmdJZCwgcHJvamVjdGlvbiwgKGVycm9yLCBidWlsZGluZykgPT4ge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBTZXJ2aWNlLCBnZXRCdWlsZGluZ1JhdGVJdGVtc0J5T3JpZ2luYWxOYW1lIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IGJ1aWxkaW5nUmF0ZUl0ZW1zQXJyYXkgPSBidWlsZGluZy5yYXRlcztcclxuICAgICAgICBsZXQgY2VudHJhbGl6ZWRSYXRlSXRlbXNBcnJheSA9IHRoaXMuZ2V0UmF0ZUl0ZW1zQXJyYXkoYnVpbGRpbmdSYXRlSXRlbXNBcnJheSwgb3JpZ2luYWxSYXRlSXRlbU5hbWUpO1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiBjZW50cmFsaXplZFJhdGVJdGVtc0FycmF5LCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0UmF0ZUl0ZW1zQXJyYXkob3JpZ2luYWxSYXRlSXRlbXNBcnJheTogQXJyYXk8Q2VudHJhbGl6ZWRSYXRlPiwgb3JpZ2luYWxSYXRlSXRlbU5hbWU6IHN0cmluZykge1xyXG5cclxuICAgIGxldCBjZW50cmFsaXplZFJhdGVJdGVtc0FycmF5OiBBcnJheTxDZW50cmFsaXplZFJhdGU+O1xyXG4gICAgY2VudHJhbGl6ZWRSYXRlSXRlbXNBcnJheSA9IGFsYXNxbCgnU0VMRUNUICogRlJPTSA/IHdoZXJlIFRSSU0ob3JpZ2luYWxJdGVtTmFtZSkgPSA/JywgW29yaWdpbmFsUmF0ZUl0ZW1zQXJyYXksIG9yaWdpbmFsUmF0ZUl0ZW1OYW1lXSk7XHJcbiAgICByZXR1cm4gY2VudHJhbGl6ZWRSYXRlSXRlbXNBcnJheTtcclxuICB9XHJcblxyXG4gIGdldFByb2plY3RSYXRlSXRlbXNCeU9yaWdpbmFsTmFtZShwcm9qZWN0SWQ6IHN0cmluZywgb3JpZ2luYWxSYXRlSXRlbU5hbWU6IHN0cmluZywgdXNlcjogVXNlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbGV0IHByb2plY3Rpb24gPSB7J3JhdGVzJzogMSwgX2lkOiAwfTtcclxuICAgIHRoaXMucHJvamVjdFJlcG9zaXRvcnkuZmluZEJ5SWRXaXRoUHJvamVjdGlvbihwcm9qZWN0SWQsIHByb2plY3Rpb24sIChlcnJvciwgcHJvamVjdCkgPT4ge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBTZXJ2aWNlLCBnZXRQcm9qZWN0UmF0ZUl0ZW1zQnlPcmlnaW5hbE5hbWUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgcHJvamVjdFJhdGVJdGVtc0FycmF5ID0gcHJvamVjdC5yYXRlcztcclxuICAgICAgICBsZXQgY2VudHJhbGl6ZWRSYXRlSXRlbXNBcnJheSA9IHRoaXMuZ2V0UmF0ZUl0ZW1zQXJyYXkocHJvamVjdFJhdGVJdGVtc0FycmF5LCBvcmlnaW5hbFJhdGVJdGVtTmFtZSk7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGE6IGNlbnRyYWxpemVkUmF0ZUl0ZW1zQXJyYXksIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRJbkFjdGl2ZUNvc3RIZWFkKHByb2plY3RJZDogc3RyaW5nLCBidWlsZGluZ0lkOiBzdHJpbmcsIHVzZXI6IFVzZXIsIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGdldEluQWN0aXZlQ29zdEhlYWQgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICB0aGlzLmJ1aWxkaW5nUmVwb3NpdG9yeS5maW5kQnlJZChidWlsZGluZ0lkLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZmluZEJ5SWQgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgICAgbG9nZ2VyLmRlYnVnKCdnZXR0aW5nIEluQWN0aXZlIENvc3RIZWFkIGZvciBCdWlsZGluZyBOYW1lIDogJyArIHJlc3VsdC5uYW1lKTtcclxuICAgICAgICBsZXQgcmVzcG9uc2UgPSByZXN1bHQuY29zdEhlYWRzO1xyXG4gICAgICAgIGxldCBpbkFjdGl2ZUNvc3RIZWFkID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgY29zdEhlYWRJdGVtIG9mIHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICBpZiAoIWNvc3RIZWFkSXRlbS5hY3RpdmUpIHtcclxuICAgICAgICAgICAgaW5BY3RpdmVDb3N0SGVhZC5wdXNoKGNvc3RIZWFkSXRlbSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiBpbkFjdGl2ZUNvc3RIZWFkLCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0SW5BY3RpdmVXb3JrSXRlbXNPZkJ1aWxkaW5nQ29zdEhlYWRzKHByb2plY3RJZDogc3RyaW5nLCBidWlsZGluZ0lkOiBzdHJpbmcsIGNvc3RIZWFkSWQ6IG51bWJlciwgY2F0ZWdvcnlJZDogbnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyOiBVc2VyLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBhZGQgV29ya2l0ZW0gaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICB0aGlzLmJ1aWxkaW5nUmVwb3NpdG9yeS5maW5kQnlJZChidWlsZGluZ0lkLCAoZXJyb3IsIGJ1aWxkaW5nOiBCdWlsZGluZykgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IGNvc3RIZWFkTGlzdCA9IGJ1aWxkaW5nLmNvc3RIZWFkcztcclxuICAgICAgICBsZXQgaW5BY3RpdmVXb3JrSXRlbXM6IEFycmF5PFdvcmtJdGVtPiA9IG5ldyBBcnJheTxXb3JrSXRlbT4oKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgY29zdEhlYWREYXRhIG9mIGNvc3RIZWFkTGlzdCkge1xyXG4gICAgICAgICAgaWYgKGNvc3RIZWFkSWQgPT09IGNvc3RIZWFkRGF0YS5yYXRlQW5hbHlzaXNJZCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBjYXRlZ29yeURhdGEgb2YgY29zdEhlYWREYXRhLmNhdGVnb3JpZXMpIHtcclxuICAgICAgICAgICAgICBpZiAoY2F0ZWdvcnlJZCA9PT0gY2F0ZWdvcnlEYXRhLnJhdGVBbmFseXNpc0lkKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB3b3JrSXRlbURhdGEgb2YgY2F0ZWdvcnlEYXRhLndvcmtJdGVtcykge1xyXG4gICAgICAgICAgICAgICAgICBpZiAoIXdvcmtJdGVtRGF0YS5hY3RpdmUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbkFjdGl2ZVdvcmtJdGVtcy5wdXNoKHdvcmtJdGVtRGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGluQWN0aXZlV29ya0l0ZW1zTGlzdFdpdGhCdWlsZGluZ1JhdGVzID0gdGhpcy5nZXRXb3JrSXRlbUxpc3RXaXRoQ2VudHJhbGl6ZWRSYXRlcyhpbkFjdGl2ZVdvcmtJdGVtcywgYnVpbGRpbmcucmF0ZXMsIGZhbHNlKTtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCB7XHJcbiAgICAgICAgICBkYXRhOiBpbkFjdGl2ZVdvcmtJdGVtc0xpc3RXaXRoQnVpbGRpbmdSYXRlcy53b3JrSXRlbXMsXHJcbiAgICAgICAgICBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gR2V0IEluIEFjdGl2ZSBXb3JrSXRlbXMgT2YgUHJvamVjdCBDb3N0IEhlYWRzXHJcbiAgZ2V0SW5BY3RpdmVXb3JrSXRlbXNPZlByb2plY3RDb3N0SGVhZHMocHJvamVjdElkOiBzdHJpbmcsIGNvc3RIZWFkSWQ6IG51bWJlciwgY2F0ZWdvcnlJZDogbnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXI6IFVzZXIsIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIEdldCBJbi1BY3RpdmUgV29ya0l0ZW1zIE9mIFByb2plY3QgQ29zdCBIZWFkcyBoYXMgYmVlbiBoaXQnKTtcclxuICAgIHRoaXMucHJvamVjdFJlcG9zaXRvcnkuZmluZEJ5SWQocHJvamVjdElkLCAoZXJyb3IsIHByb2plY3Q6IFByb2plY3QpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCBjb3N0SGVhZExpc3QgPSBwcm9qZWN0LnByb2plY3RDb3N0SGVhZHM7XHJcbiAgICAgICAgbGV0IGluQWN0aXZlV29ya0l0ZW1zOiBBcnJheTxXb3JrSXRlbT4gPSBuZXcgQXJyYXk8V29ya0l0ZW0+KCk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGNvc3RIZWFkRGF0YSBvZiBjb3N0SGVhZExpc3QpIHtcclxuICAgICAgICAgIGlmIChjb3N0SGVhZElkID09PSBjb3N0SGVhZERhdGEucmF0ZUFuYWx5c2lzSWQpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgY2F0ZWdvcnlEYXRhIG9mIGNvc3RIZWFkRGF0YS5jYXRlZ29yaWVzKSB7XHJcbiAgICAgICAgICAgICAgaWYgKGNhdGVnb3J5SWQgPT09IGNhdGVnb3J5RGF0YS5yYXRlQW5hbHlzaXNJZCkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgd29ya0l0ZW1EYXRhIG9mIGNhdGVnb3J5RGF0YS53b3JrSXRlbXMpIHtcclxuICAgICAgICAgICAgICAgICAgaWYgKCF3b3JrSXRlbURhdGEuYWN0aXZlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5BY3RpdmVXb3JrSXRlbXMucHVzaCh3b3JrSXRlbURhdGEpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBpbkFjdGl2ZVdvcmtJdGVtc0xpc3RXaXRoUHJvamVjdFJhdGVzID0gdGhpcy5nZXRXb3JrSXRlbUxpc3RXaXRoQ2VudHJhbGl6ZWRSYXRlcyhpbkFjdGl2ZVdvcmtJdGVtcywgcHJvamVjdC5yYXRlcywgZmFsc2UpO1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHtcclxuICAgICAgICAgIGRhdGE6IGluQWN0aXZlV29ya0l0ZW1zTGlzdFdpdGhQcm9qZWN0UmF0ZXMud29ya0l0ZW1zLFxyXG4gICAgICAgICAgYWNjZXNzX3Rva2VuOiB0aGlzLmF1dGhJbnRlcmNlcHRvci5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldEJ1aWxkaW5nQnlJZEZvckNsb25lKHByb2plY3RJZDogc3RyaW5nLCBidWlsZGluZ0lkOiBzdHJpbmcsIHVzZXI6IFVzZXIsIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGdldENsb25lZEJ1aWxkaW5nIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZEJ5SWQoYnVpbGRpbmdJZCwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZmluZEJ5SWQgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgY2xvbmVkQnVpbGRpbmcgPSByZXN1bHQuY29zdEhlYWRzO1xyXG4gICAgICAgIGxldCBidWlsZGluZyA9IG5ldyBCdWlsZGluZ01vZGVsKCk7XHJcbiAgICAgICAgYnVpbGRpbmcubmFtZSA9IHJlc3VsdC5uYW1lO1xyXG4gICAgICAgIGJ1aWxkaW5nLnRvdGFsU2xhYkFyZWEgPSByZXN1bHQudG90YWxTbGFiQXJlYTtcclxuICAgICAgICBidWlsZGluZy50b3RhbENhcnBldEFyZWFPZlVuaXQgPSByZXN1bHQudG90YWxDYXJwZXRBcmVhT2ZVbml0O1xyXG4gICAgICAgIGJ1aWxkaW5nLnRvdGFsU2FsZWFibGVBcmVhT2ZVbml0ID0gcmVzdWx0LnRvdGFsU2FsZWFibGVBcmVhT2ZVbml0O1xyXG4gICAgICAgIGJ1aWxkaW5nLnBsaW50aEFyZWEgPSByZXN1bHQucGxpbnRoQXJlYTtcclxuICAgICAgICBidWlsZGluZy50b3RhbE51bU9mRmxvb3JzID0gcmVzdWx0LnRvdGFsTnVtT2ZGbG9vcnM7XHJcbiAgICAgICAgYnVpbGRpbmcubnVtT2ZQYXJraW5nRmxvb3JzID0gcmVzdWx0Lm51bU9mUGFya2luZ0Zsb29ycztcclxuICAgICAgICBidWlsZGluZy5jYXJwZXRBcmVhT2ZQYXJraW5nID0gcmVzdWx0LmNhcnBldEFyZWFPZlBhcmtpbmc7XHJcbiAgICAgICAgYnVpbGRpbmcubnVtT2ZPbmVCSEsgPSByZXN1bHQubnVtT2ZPbmVCSEs7XHJcbiAgICAgICAgYnVpbGRpbmcubnVtT2ZUd29CSEsgPSByZXN1bHQubnVtT2ZUd29CSEs7XHJcbiAgICAgICAgYnVpbGRpbmcubnVtT2ZUaHJlZUJISyA9IHJlc3VsdC5udW1PZlRocmVlQkhLO1xyXG4gICAgICAgIGJ1aWxkaW5nLm51bU9mRm91ckJISyA9IHJlc3VsdC5udW1PZkZvdXJCSEs7XHJcbiAgICAgICAgYnVpbGRpbmcubnVtT2ZGaXZlQkhLID0gcmVzdWx0Lm51bU9mRml2ZUJISztcclxuICAgICAgICBidWlsZGluZy5udW1PZkxpZnRzID0gcmVzdWx0Lm51bU9mTGlmdHM7XHJcblxyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiBidWlsZGluZywgYWNjZXNzX3Rva2VuOiB0aGlzLmF1dGhJbnRlcmNlcHRvci5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKX0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGRlbGV0ZUJ1aWxkaW5nQnlJZChwcm9qZWN0SWQ6IHN0cmluZywgYnVpbGRpbmdJZDogc3RyaW5nLCB1c2VyOiBVc2VyLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBkZWxldGVCdWlsZGluZyBoYXMgYmVlbiBoaXQnKTtcclxuICAgIGxldCBwb3BCdWlsZGluZ0lkID0gYnVpbGRpbmdJZDtcclxuICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmRlbGV0ZShidWlsZGluZ0lkLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IHF1ZXJ5ID0ge19pZDogcHJvamVjdElkfTtcclxuICAgICAgICBsZXQgbmV3RGF0YSA9IHskcHVsbDoge2J1aWxkaW5nczogcG9wQnVpbGRpbmdJZH19O1xyXG4gICAgICAgIHRoaXMucHJvamVjdFJlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgbmV3RGF0YSwge25ldzogdHJ1ZX0sIChlcnJvciwgc3RhdHVzKSA9PiB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kT25lQW5kVXBkYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiBzdGF0dXMsIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRSYXRlKHByb2plY3RJZDogc3RyaW5nLCBidWlsZGluZ0lkOiBzdHJpbmcsIGNvc3RIZWFkSWQ6IG51bWJlciwgY2F0ZWdvcnlJZDogbnVtYmVyLCB3b3JrSXRlbUlkOiBudW1iZXIsIHVzZXI6IFVzZXIsXHJcbiAgICAgICAgICBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBnZXRSYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG5cclxuICAgIGxldCByYXRlQW5hbHlzaXNTZXJ2aWNlczogUmF0ZUFuYWx5c2lzU2VydmljZSA9IG5ldyBSYXRlQW5hbHlzaXNTZXJ2aWNlKCk7XHJcbiAgICByYXRlQW5hbHlzaXNTZXJ2aWNlcy5nZXRSYXRlKHdvcmtJdGVtSWQsIChlcnJvciwgcmF0ZURhdGEpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCByYXRlOiBSYXRlID0gbmV3IFJhdGUoKTtcclxuICAgICAgICByYXRlLnJhdGVJdGVtcyA9IHJhdGVEYXRhO1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiByYXRlRGF0YSwgYWNjZXNzX3Rva2VuOiB0aGlzLmF1dGhJbnRlcmNlcHRvci5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKX0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZVJhdGVPZkJ1aWxkaW5nQ29zdEhlYWRzKHByb2plY3RJZDogc3RyaW5nLCBidWlsZGluZ0lkOiBzdHJpbmcsIGNvc3RIZWFkSWQ6IG51bWJlciwgY2F0ZWdvcnlJZDogbnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdvcmtJdGVtSWQ6IG51bWJlciwgcmF0ZTogUmF0ZSwgdXNlcjogVXNlciwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgdXBkYXRlUmF0ZU9mQnVpbGRpbmdDb3N0SGVhZHMgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICByYXRlLmlzRXN0aW1hdGVkID0gdHJ1ZTtcclxuICAgIGxldCBxdWVyeSA9IHtfaWQ6IGJ1aWxkaW5nSWR9O1xyXG4gICAgbGV0IHVwZGF0ZVF1ZXJ5ID0geyRzZXQ6eydjb3N0SGVhZHMuJFtjb3N0SGVhZF0uY2F0ZWdvcmllcy4kW2NhdGVnb3J5XS53b3JrSXRlbXMuJFt3b3JrSXRlbV0ucmF0ZSc6cmF0ZVxyXG4gICAgICB9fTtcclxuXHJcbiAgICBsZXQgYXJyYXlGaWx0ZXIgPSBbXHJcbiAgICAgIHsnY29zdEhlYWQucmF0ZUFuYWx5c2lzSWQnOmNvc3RIZWFkSWR9LFxyXG4gICAgICB7J2NhdGVnb3J5LnJhdGVBbmFseXNpc0lkJzogY2F0ZWdvcnlJZH0sXHJcbiAgICAgIHsnd29ya0l0ZW0ucmF0ZUFuYWx5c2lzSWQnOndvcmtJdGVtSWR9XHJcbiAgICBdO1xyXG4gICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgdXBkYXRlUXVlcnkse2FycmF5RmlsdGVyczphcnJheUZpbHRlciwgbmV3OiB0cnVlfSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmKHJlc3VsdCkge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ2J1aWxkaW5nIENvc3RIZWFkcyBVcGRhdGVkJyk7XHJcblxyXG4gICAgICAgICAgbGV0IHJhdGVJdGVtcyA9IHJhdGUucmF0ZUl0ZW1zO1xyXG4gICAgICAgICAgbGV0IGNlbnRyYWxpemVkUmF0ZXMgPSByZXN1bHQucmF0ZXM7XHJcbiAgICAgICAgICBsZXQgcHJvbWlzZUFycmF5Rm9yVXBkYXRlQnVpbGRpbmdDZW50cmFsaXplZFJhdGVzID1bXTtcclxuXHJcbiAgICAgICAgICBmb3IobGV0IHJhdGUgb2YgcmF0ZUl0ZW1zKSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgcmF0ZU9iamVjdEV4aXN0U1FMID0gJ1NFTEVDVCAqIEZST00gPyBBUyByYXRlcyBXSEVSRSByYXRlcy5pdGVtTmFtZT0gPyc7XHJcbiAgICAgICAgICAgIGxldCByYXRlRXhpc3RBcnJheSA9IGFsYXNxbChyYXRlT2JqZWN0RXhpc3RTUUwsW2NlbnRyYWxpemVkUmF0ZXMscmF0ZS5pdGVtTmFtZV0pO1xyXG4gICAgICAgICAgICBpZihyYXRlRXhpc3RBcnJheS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgaWYocmF0ZUV4aXN0QXJyYXlbMF0ucmF0ZSAhPT0gcmF0ZS5yYXRlKSB7XHJcbiAgICAgICAgICAgICAgICAvL3VwZGF0ZSByYXRlIG9mIHJhdGVJdGVtXHJcbiAgICAgICAgICAgICAgICBsZXQgdXBkYXRlUmF0ZVByb21pc2UgPSB0aGlzLnVwZGF0ZUNlbnRyYWxpemVkUmF0ZUZvckJ1aWxkaW5nKGJ1aWxkaW5nSWQsIHJhdGUuaXRlbU5hbWUsIHJhdGUucmF0ZSk7XHJcbiAgICAgICAgICAgICAgICBwcm9taXNlQXJyYXlGb3JVcGRhdGVCdWlsZGluZ0NlbnRyYWxpemVkUmF0ZXMucHVzaCh1cGRhdGVSYXRlUHJvbWlzZSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIC8vY3JlYXRlIG5ldyByYXRlSXRlbVxyXG4gICAgICAgICAgICAgIGxldCByYXRlSXRlbSA6IENlbnRyYWxpemVkUmF0ZSA9IG5ldyBDZW50cmFsaXplZFJhdGUocmF0ZS5pdGVtTmFtZSxyYXRlLm9yaWdpbmFsSXRlbU5hbWUsIHJhdGUucmF0ZSk7XHJcbiAgICAgICAgICAgICAgbGV0IGFkZE5ld1JhdGVJdGVtUHJvbWlzZSA9IHRoaXMuYWRkTmV3Q2VudHJhbGl6ZWRSYXRlRm9yQnVpbGRpbmcoYnVpbGRpbmdJZCwgcmF0ZUl0ZW0pO1xyXG4gICAgICAgICAgICAgIHByb21pc2VBcnJheUZvclVwZGF0ZUJ1aWxkaW5nQ2VudHJhbGl6ZWRSYXRlcy5wdXNoKGFkZE5ld1JhdGVJdGVtUHJvbWlzZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZihwcm9taXNlQXJyYXlGb3JVcGRhdGVCdWlsZGluZ0NlbnRyYWxpemVkUmF0ZXMubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgICAgIENDUHJvbWlzZS5hbGwocHJvbWlzZUFycmF5Rm9yVXBkYXRlQnVpbGRpbmdDZW50cmFsaXplZFJhdGVzKS50aGVuKGZ1bmN0aW9uKGRhdGE6IEFycmF5PGFueT4pIHtcclxuXHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1JhdGVzIEFycmF5IHVwZGF0ZWQgOiAnK0pTT04uc3RyaW5naWZ5KGNlbnRyYWxpemVkUmF0ZXMpKTtcclxuICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7ICdkYXRhJyA6ICdzdWNjZXNzJyB9KTtcclxuXHJcbiAgICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGU6YW55KSB7XHJcbiAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKCcgUHJvbWlzZSBmYWlsZWQgZm9yIGNvbnZlcnRDb3N0SGVhZHNGcm9tUmF0ZUFuYWx5c2lzVG9Db3N0Q29udHJvbCAhIDonICtKU09OLnN0cmluZ2lmeShlLm1lc3NhZ2UpKTtcclxuICAgICAgICAgICAgICBDQ1Byb21pc2UucmVqZWN0KGUubWVzc2FnZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgeyAnZGF0YScgOiAnc3VjY2VzcycgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIC8qdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZEJ5SWQoYnVpbGRpbmdJZCwgKGVycm9yLCBidWlsZGluZzpCdWlsZGluZykgPT4ge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kQnlJZCBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCBjb3N0SGVhZHMgPSBidWlsZGluZy5jb3N0SGVhZHM7XHJcbiAgICAgICAgbGV0IGNlbnRyYWxpemVkUmF0ZXMgPSBidWlsZGluZy5yYXRlcztcclxuICAgICAgICBmb3IgKGxldCBjb3N0SGVhZERhdGEgb2YgY29zdEhlYWRzKSB7XHJcbiAgICAgICAgICBpZiAoY29zdEhlYWREYXRhLnJhdGVBbmFseXNpc0lkID09PSBjb3N0SGVhZElkKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGNhdGVnb3J5RGF0YSBvZiBjb3N0SGVhZERhdGEuY2F0ZWdvcmllcykge1xyXG4gICAgICAgICAgICAgIGlmIChjYXRlZ29yeURhdGEucmF0ZUFuYWx5c2lzSWQgPT09IGNhdGVnb3J5SWQpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHdvcmtJdGVtRGF0YSBvZiBjYXRlZ29yeURhdGEud29ya0l0ZW1zKSB7XHJcbiAgICAgICAgICAgICAgICAgIGlmICh3b3JrSXRlbURhdGEucmF0ZUFuYWx5c2lzSWQgPT09IHdvcmtJdGVtSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB3b3JrSXRlbURhdGEucmF0ZSA9IHJhdGU7XHJcbiAgICAgICAgICAgICAgICAgICAgd29ya0l0ZW1EYXRhLnJhdGUuaXNFc3RpbWF0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBxdWVyeSA9IHsnX2lkJzogYnVpbGRpbmdJZH07XHJcbiAgICAgICAgbGV0IG5ld0RhdGEgPSB7JHNldDogeydjb3N0SGVhZHMnOiBjb3N0SGVhZHN9fTtcclxuXHJcbiAgICAgICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgdXBkYXRlUXVlcnkse2FycmF5RmlsdGVyczphcnJheUZpbHRlciwgbmV3OiB0cnVlfSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2J1aWxkaW5nIENvc3RIZWFkcyBVcGRhdGVkJyk7XHJcblxyXG4gICAgICAgICAgICAgIGxldCByYXRlSXRlbXMgPSByYXRlLnJhdGVJdGVtcztcclxuICAgICAgICAgICAgICBsZXQgcHJvbWlzZUFycmF5Rm9yVXBkYXRlQnVpbGRpbmdDZW50cmFsaXplZFJhdGVzID0gW107XHJcblxyXG4gICAgICAgICAgICAgIGZvciAobGV0IHJhdGUgb2YgcmF0ZUl0ZW1zKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHJhdGVPYmplY3RFeGlzdFNRTCA9ICdTRUxFQ1QgKiBGUk9NID8gQVMgcmF0ZXMgV0hFUkUgcmF0ZXMuaXRlbU5hbWU9ID8nO1xyXG4gICAgICAgICAgICAgICAgbGV0IHJhdGVFeGlzdEFycmF5ID0gYWxhc3FsKHJhdGVPYmplY3RFeGlzdFNRTCwgW2NlbnRyYWxpemVkUmF0ZXMsIHJhdGUuaXRlbU5hbWVdKTtcclxuICAgICAgICAgICAgICAgIGlmIChyYXRlRXhpc3RBcnJheS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgIGlmIChyYXRlRXhpc3RBcnJheVswXS5yYXRlICE9PSByYXRlLnJhdGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL3VwZGF0ZSByYXRlIG9mIHJhdGVJdGVtXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHVwZGF0ZVJhdGVQcm9taXNlID0gdGhpcy51cGRhdGVDZW50cmFsaXplZFJhdGVGb3JCdWlsZGluZyhidWlsZGluZ0lkLCByYXRlLml0ZW1OYW1lLCByYXRlLnJhdGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHByb21pc2VBcnJheUZvclVwZGF0ZUJ1aWxkaW5nQ2VudHJhbGl6ZWRSYXRlcy5wdXNoKHVwZGF0ZVJhdGVQcm9taXNlKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgLy9jcmVhdGUgbmV3IHJhdGVJdGVtXHJcbiAgICAgICAgICAgICAgICAgIGxldCByYXRlSXRlbTogQ2VudHJhbGl6ZWRSYXRlID0gbmV3IENlbnRyYWxpemVkUmF0ZShyYXRlLml0ZW1OYW1lLCByYXRlLm9yaWdpbmFsSXRlbU5hbWUsIHJhdGUucmF0ZSk7XHJcbiAgICAgICAgICAgICAgICAgIGxldCBhZGROZXdSYXRlSXRlbVByb21pc2UgPSB0aGlzLmFkZE5ld0NlbnRyYWxpemVkUmF0ZUZvckJ1aWxkaW5nKGJ1aWxkaW5nSWQsIHJhdGVJdGVtKTtcclxuICAgICAgICAgICAgICAgICAgcHJvbWlzZUFycmF5Rm9yVXBkYXRlQnVpbGRpbmdDZW50cmFsaXplZFJhdGVzLnB1c2goYWRkTmV3UmF0ZUl0ZW1Qcm9taXNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIGlmIChwcm9taXNlQXJyYXlGb3JVcGRhdGVCdWlsZGluZ0NlbnRyYWxpemVkUmF0ZXMubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBDQ1Byb21pc2UuYWxsKHByb21pc2VBcnJheUZvclVwZGF0ZUJ1aWxkaW5nQ2VudHJhbGl6ZWRSYXRlcykudGhlbihmdW5jdGlvbiAoZGF0YTogQXJyYXk8YW55Pikge1xyXG5cclxuICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1JhdGVzIEFycmF5IHVwZGF0ZWQgOiAnICsgSlNPTi5zdHJpbmdpZnkoY2VudHJhbGl6ZWRSYXRlcykpO1xyXG4gICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7J2RhdGEnOiAnc3VjY2Vzcyd9KTtcclxuXHJcbiAgICAgICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZTogYW55KSB7XHJcbiAgICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcignIFByb21pc2UgZmFpbGVkIGZvciBjb252ZXJ0Q29zdEhlYWRzRnJvbVJhdGVBbmFseXNpc1RvQ29zdENvbnRyb2wgISA6JyArIEpTT04uc3RyaW5naWZ5KGUubWVzc2FnZSkpO1xyXG4gICAgICAgICAgICAgICAgICBDQ1Byb21pc2UucmVqZWN0KGUubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgeydkYXRhJzogJ3N1Y2Nlc3MnfSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pOyovXHJcbiAgfVxyXG5cclxuICAvL1VwZGF0ZSBEaXJlY3QgUmF0ZSBvZiBidWlsZGluZyBjb3N0aGVhZHNcclxuICB1cGRhdGVEaXJlY3RSYXRlT2ZCdWlsZGluZ1dvcmtJdGVtcyhwcm9qZWN0SWQ6IHN0cmluZywgYnVpbGRpbmdJZDogc3RyaW5nLCBjb3N0SGVhZElkOiBudW1iZXIsIGNhdGVnb3J5SWQ6IG51bWJlciwgd29ya0l0ZW1JZDogbnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpcmVjdFJhdGU6IG51bWJlciwgdXNlcjogVXNlciwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG5cclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIHVwZGF0ZURpcmVjdFJhdGVPZkJ1aWxkaW5nV29ya0l0ZW1zIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgbGV0IHF1ZXJ5ID0ge19pZDogYnVpbGRpbmdJZH07XHJcbiAgICBsZXQgdXBkYXRlUXVlcnkgPSB7JHNldDp7J2Nvc3RIZWFkcy4kW2Nvc3RIZWFkXS5jYXRlZ29yaWVzLiRbY2F0ZWdvcnldLndvcmtJdGVtcy4kW3dvcmtJdGVtXS5yYXRlLnRvdGFsJzpkaXJlY3RSYXRlLFxyXG4gICAgICAgICdjb3N0SGVhZHMuJFtjb3N0SGVhZF0uY2F0ZWdvcmllcy4kW2NhdGVnb3J5XS53b3JrSXRlbXMuJFt3b3JrSXRlbV0ucmF0ZS5yYXRlSXRlbXMnOltdLFxyXG4gICAgICAgICdjb3N0SGVhZHMuJFtjb3N0SGVhZF0uY2F0ZWdvcmllcy4kW2NhdGVnb3J5XS53b3JrSXRlbXMuJFt3b3JrSXRlbV0uaXNEaXJlY3RSYXRlJzogdHJ1ZVxyXG4gICAgICB9fTtcclxuXHJcbiAgICBsZXQgYXJyYXlGaWx0ZXIgPSBbXHJcbiAgICAgIHsnY29zdEhlYWQucmF0ZUFuYWx5c2lzSWQnOmNvc3RIZWFkSWR9LFxyXG4gICAgICB7J2NhdGVnb3J5LnJhdGVBbmFseXNpc0lkJzogY2F0ZWdvcnlJZH0sXHJcbiAgICAgIHsnd29ya0l0ZW0ucmF0ZUFuYWx5c2lzSWQnOndvcmtJdGVtSWR9XHJcbiAgICBdO1xyXG4gICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgdXBkYXRlUXVlcnkse2FycmF5RmlsdGVyczphcnJheUZpbHRlciwgbmV3OiB0cnVlfSwgKGVycm9yLCBidWlsZGluZykgPT4ge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kT25lQW5kVXBkYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGE6ICdzdWNjZXNzJywgYWNjZXNzX3Rva2VuOiB0aGlzLmF1dGhJbnRlcmNlcHRvci5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKX0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgICAgLypsZXQgcHJvamVjdGlvbiA9IHsnY29zdEhlYWRzJzoxfTtcclxuICAgICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZEJ5SWRXaXRoUHJvamVjdGlvbihidWlsZGluZ0lkLCBwcm9qZWN0aW9uLCAoZXJyb3IsIGJ1aWxkaW5nKSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgY29zdEhlYWRMaXN0ID0gYnVpbGRpbmcuY29zdEhlYWRzO1xyXG4gICAgICAgIHRoaXMudXBkYXRlRGlyZWN0UmF0ZShjb3N0SGVhZExpc3QsIGNvc3RIZWFkSWQsIGNhdGVnb3J5SWQsIHdvcmtJdGVtSWQsIGRpcmVjdFJhdGUpO1xyXG5cclxuICAgICAgICBsZXQgcXVlcnkgPSB7X2lkOiBidWlsZGluZ0lkfTtcclxuICAgICAgICBsZXQgZGF0YSA9IHskc2V0OiB7J2Nvc3RIZWFkcyc6IGNvc3RIZWFkTGlzdH19O1xyXG4gICAgICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIGRhdGEsIHtuZXc6IHRydWV9LCAoZXJyb3IsIGJ1aWxkaW5nKSA9PiB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kT25lQW5kVXBkYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiAnc3VjY2VzcycsIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7Ki9cclxuICB9XHJcblxyXG4gIHVwZGF0ZURpcmVjdFJhdGUoY29zdEhlYWRMaXN0OiBBcnJheTxDb3N0SGVhZD4sIGNvc3RIZWFkSWQ6IG51bWJlciwgY2F0ZWdvcnlJZDogbnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgd29ya0l0ZW1JZDogbnVtYmVyLCBkaXJlY3RSYXRlOiBudW1iZXIpIHtcclxuICAgIGxldCByYXRlOiBSYXRlO1xyXG4gICAgZm9yIChsZXQgY29zdEhlYWQgb2YgY29zdEhlYWRMaXN0KSB7XHJcbiAgICAgIGlmIChjb3N0SGVhZElkID09PSBjb3N0SGVhZC5yYXRlQW5hbHlzaXNJZCkge1xyXG4gICAgICAgIGxldCBjYXRlZ29yaWVzT2ZDb3N0SGVhZCA9IGNvc3RIZWFkLmNhdGVnb3JpZXM7XHJcbiAgICAgICAgZm9yIChsZXQgY2F0ZWdvcnlEYXRhIG9mIGNhdGVnb3JpZXNPZkNvc3RIZWFkKSB7XHJcbiAgICAgICAgICBpZiAoY2F0ZWdvcnlJZCA9PT0gY2F0ZWdvcnlEYXRhLnJhdGVBbmFseXNpc0lkKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHdvcmtJdGVtRGF0YSBvZiBjYXRlZ29yeURhdGEud29ya0l0ZW1zKSB7XHJcbiAgICAgICAgICAgICAgaWYgKHdvcmtJdGVtSWQgPT09IHdvcmtJdGVtRGF0YS5yYXRlQW5hbHlzaXNJZCkge1xyXG4gICAgICAgICAgICAgICAgcmF0ZSA9IHdvcmtJdGVtRGF0YS5yYXRlO1xyXG4gICAgICAgICAgICAgICAgcmF0ZS50b3RhbCA9IGRpcmVjdFJhdGU7XHJcbiAgICAgICAgICAgICAgICByYXRlLnJhdGVJdGVtcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgd29ya0l0ZW1EYXRhLmlzRGlyZWN0UmF0ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuLy9VcGRhdGUgcmF0ZSBvZiBwcm9qZWN0IGNvc3QgaGVhZHNcclxuICB1cGRhdGVSYXRlT2ZQcm9qZWN0Q29zdEhlYWRzKHByb2plY3RJZDogc3RyaW5nLCBjb3N0SGVhZElkOiBudW1iZXIsIGNhdGVnb3J5SWQ6IG51bWJlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdvcmtJdGVtSWQ6IG51bWJlciwgcmF0ZTogUmF0ZSwgdXNlcjogVXNlciwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgVXBkYXRlIHJhdGUgb2YgcHJvamVjdCBjb3N0IGhlYWRzIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgcmF0ZS5pc0VzdGltYXRlZCA9IHRydWU7XHJcbiAgICBsZXQgcXVlcnkgPSB7X2lkOiBwcm9qZWN0SWR9O1xyXG4gICAgbGV0IHVwZGF0ZVF1ZXJ5ID0geyRzZXQ6eydwcm9qZWN0Q29zdEhlYWRzLiRbY29zdEhlYWRdLmNhdGVnb3JpZXMuJFtjYXRlZ29yeV0ud29ya0l0ZW1zLiRbd29ya0l0ZW1dLnJhdGUnOnJhdGVcclxuICAgICAgfX07XHJcblxyXG4gICAgbGV0IGFycmF5RmlsdGVyID0gW1xyXG4gICAgICB7J2Nvc3RIZWFkLnJhdGVBbmFseXNpc0lkJzpjb3N0SGVhZElkfSxcclxuICAgICAgeydjYXRlZ29yeS5yYXRlQW5hbHlzaXNJZCc6IGNhdGVnb3J5SWR9LFxyXG4gICAgICB7J3dvcmtJdGVtLnJhdGVBbmFseXNpc0lkJzp3b3JrSXRlbUlkfVxyXG4gICAgXTtcclxuICAgIHRoaXMucHJvamVjdFJlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgdXBkYXRlUXVlcnkse2FycmF5RmlsdGVyczphcnJheUZpbHRlciwgbmV3OiB0cnVlfSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICBsZXQgcmF0ZUl0ZW1zID0gcmF0ZS5yYXRlSXRlbXM7XHJcbiAgICAgICAgbGV0IGNlbnRyYWxpemVkUmF0ZXNPZlByb2plY3RzID0gcmVzdWx0LnJhdGVzO1xyXG4gICAgICAgIGxldCBwcm9taXNlQXJyYXlGb3JQcm9qZWN0Q2VudHJhbGl6ZWRSYXRlcyA9W107XHJcblxyXG4gICAgICAgIGZvcihsZXQgcmF0ZSBvZiByYXRlSXRlbXMpIHtcclxuXHJcbiAgICAgICAgICBsZXQgcmF0ZU9iamVjdEV4aXN0U1FMID0gJ1NFTEVDVCAqIEZST00gPyBBUyByYXRlcyBXSEVSRSByYXRlcy5pdGVtTmFtZT0gPyc7XHJcbiAgICAgICAgICBsZXQgcmF0ZUV4aXN0QXJyYXkgPSBhbGFzcWwocmF0ZU9iamVjdEV4aXN0U1FMLFtjZW50cmFsaXplZFJhdGVzT2ZQcm9qZWN0cyxyYXRlLml0ZW1OYW1lXSk7XHJcbiAgICAgICAgICBpZihyYXRlRXhpc3RBcnJheS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGlmKHJhdGVFeGlzdEFycmF5WzBdLnJhdGUgIT09IHJhdGUucmF0ZSkge1xyXG4gICAgICAgICAgICAgIC8vdXBkYXRlIHJhdGUgb2YgcmF0ZUl0ZW1cclxuICAgICAgICAgICAgICBsZXQgdXBkYXRlUmF0ZU9mUHJvamVjdFByb21pc2UgPSB0aGlzLnVwZGF0ZUNlbnRyYWxpemVkUmF0ZUZvclByb2plY3QocHJvamVjdElkLCByYXRlLml0ZW1OYW1lLCByYXRlLnJhdGUpO1xyXG4gICAgICAgICAgICAgIHByb21pc2VBcnJheUZvclByb2plY3RDZW50cmFsaXplZFJhdGVzLnB1c2godXBkYXRlUmF0ZU9mUHJvamVjdFByb21pc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvL2NyZWF0ZSBuZXcgcmF0ZUl0ZW1cclxuICAgICAgICAgICAgbGV0IHJhdGVJdGVtIDogQ2VudHJhbGl6ZWRSYXRlID0gbmV3IENlbnRyYWxpemVkUmF0ZShyYXRlLml0ZW1OYW1lLHJhdGUub3JpZ2luYWxJdGVtTmFtZSwgcmF0ZS5yYXRlKTtcclxuICAgICAgICAgICAgbGV0IGFkZE5ld1JhdGVPZlByb2plY3RQcm9taXNlID0gdGhpcy5hZGROZXdDZW50cmFsaXplZFJhdGVGb3JQcm9qZWN0KHByb2plY3RJZCwgcmF0ZUl0ZW0pO1xyXG4gICAgICAgICAgICBwcm9taXNlQXJyYXlGb3JQcm9qZWN0Q2VudHJhbGl6ZWRSYXRlcy5wdXNoKGFkZE5ld1JhdGVPZlByb2plY3RQcm9taXNlKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHByb21pc2VBcnJheUZvclByb2plY3RDZW50cmFsaXplZFJhdGVzLmxlbmd0aCAhPT0gMCkge1xyXG5cclxuICAgICAgICAgIENDUHJvbWlzZS5hbGwocHJvbWlzZUFycmF5Rm9yUHJvamVjdENlbnRyYWxpemVkUmF0ZXMpLnRoZW4oZnVuY3Rpb24oZGF0YTogQXJyYXk8YW55Pikge1xyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1JhdGVzIEFycmF5IHVwZGF0ZWQgOiAnK0pTT04uc3RyaW5naWZ5KGNlbnRyYWxpemVkUmF0ZXNPZlByb2plY3RzKSk7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHsgJ2RhdGEnIDogJ3N1Y2Nlc3MnIH0pO1xyXG5cclxuICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGU6YW55KSB7XHJcbiAgICAgICAgICAgIGxvZ2dlci5lcnJvcignIFByb21pc2UgZmFpbGVkIGZvciBjb252ZXJ0Q29zdEhlYWRzRnJvbVJhdGVBbmFseXNpc1RvQ29zdENvbnRyb2wgISA6JyArSlNPTi5zdHJpbmdpZnkoZS5tZXNzYWdlKSk7XHJcbiAgICAgICAgICAgIGxldCBlcnJvck9iaiA9IG5ldyBFcnJvcigpO1xyXG4gICAgICAgICAgICBlcnJvck9iai5tZXNzYWdlID0gZTtcclxuICAgICAgICAgICAgY2FsbGJhY2soZXJyb3JPYmosIG51bGwpO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjYWxsYmFjayhudWxsLCB7ICdkYXRhJyA6ICdzdWNjZXNzJyB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgLyp0aGlzLnByb2plY3RSZXBvc2l0b3J5LmZpbmRCeUlkKHByb2plY3RJZCwgKGVycm9yLCBwcm9qZWN0IDogUHJvamVjdCkgPT4ge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kQnlJZCBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCBwcm9qZWN0Q29zdEhlYWRzID0gcHJvamVjdC5wcm9qZWN0Q29zdEhlYWRzO1xyXG4gICAgICAgIGxldCBjZW50cmFsaXplZFJhdGVzT2ZQcm9qZWN0cyA9IHByb2plY3QucmF0ZXM7XHJcbiAgICAgICAgZm9yIChsZXQgY29zdEhlYWREYXRhIG9mIHByb2plY3RDb3N0SGVhZHMpIHtcclxuICAgICAgICAgIGlmIChjb3N0SGVhZERhdGEucmF0ZUFuYWx5c2lzSWQgPT09IGNvc3RIZWFkSWQpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgY2F0ZWdvcnlEYXRhIG9mIGNvc3RIZWFkRGF0YS5jYXRlZ29yaWVzKSB7XHJcbiAgICAgICAgICAgICAgaWYgKGNhdGVnb3J5RGF0YS5yYXRlQW5hbHlzaXNJZCA9PT0gY2F0ZWdvcnlJZCkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgd29ya0l0ZW1EYXRhIG9mIGNhdGVnb3J5RGF0YS53b3JrSXRlbXMpIHtcclxuICAgICAgICAgICAgICAgICAgaWYgKHdvcmtJdGVtRGF0YS5yYXRlQW5hbHlzaXNJZCA9PT0gd29ya0l0ZW1JZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHdvcmtJdGVtRGF0YS5yYXRlID0gcmF0ZTtcclxuICAgICAgICAgICAgICAgICAgICB3b3JrSXRlbURhdGEucmF0ZS5pc0VzdGltYXRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHF1ZXJ5ID0geydfaWQnOiBwcm9qZWN0SWR9O1xyXG4gICAgICAgIGxldCBuZXdEYXRhID0geyRzZXQ6IHsncHJvamVjdENvc3RIZWFkcyc6IHByb2plY3RDb3N0SGVhZHN9fTtcclxuICAgICAgICB0aGlzLnByb2plY3RSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIG5ld0RhdGEsIHtuZXc6IHRydWV9LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgcmF0ZUl0ZW1zID0gcmF0ZS5yYXRlSXRlbXM7XHJcbiAgICAgICAgICAgIGxldCBwcm9taXNlQXJyYXlGb3JQcm9qZWN0Q2VudHJhbGl6ZWRSYXRlcyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgcmF0ZSBvZiByYXRlSXRlbXMpIHtcclxuXHJcbiAgICAgICAgICAgICAgbGV0IHJhdGVPYmplY3RFeGlzdFNRTCA9ICdTRUxFQ1QgKiBGUk9NID8gQVMgcmF0ZXMgV0hFUkUgcmF0ZXMuaXRlbU5hbWU9ID8nO1xyXG4gICAgICAgICAgICAgIGxldCByYXRlRXhpc3RBcnJheSA9IGFsYXNxbChyYXRlT2JqZWN0RXhpc3RTUUwsIFtjZW50cmFsaXplZFJhdGVzT2ZQcm9qZWN0cywgcmF0ZS5pdGVtTmFtZV0pO1xyXG4gICAgICAgICAgICAgIGlmIChyYXRlRXhpc3RBcnJheS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmF0ZUV4aXN0QXJyYXlbMF0ucmF0ZSAhPT0gcmF0ZS5yYXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgIC8vdXBkYXRlIHJhdGUgb2YgcmF0ZUl0ZW1cclxuICAgICAgICAgICAgICAgICAgbGV0IHVwZGF0ZVJhdGVPZlByb2plY3RQcm9taXNlID0gdGhpcy51cGRhdGVDZW50cmFsaXplZFJhdGVGb3JQcm9qZWN0KHByb2plY3RJZCwgcmF0ZS5pdGVtTmFtZSwgcmF0ZS5yYXRlKTtcclxuICAgICAgICAgICAgICAgICAgcHJvbWlzZUFycmF5Rm9yUHJvamVjdENlbnRyYWxpemVkUmF0ZXMucHVzaCh1cGRhdGVSYXRlT2ZQcm9qZWN0UHJvbWlzZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vY3JlYXRlIG5ldyByYXRlSXRlbVxyXG4gICAgICAgICAgICAgICAgbGV0IHJhdGVJdGVtOiBDZW50cmFsaXplZFJhdGUgPSBuZXcgQ2VudHJhbGl6ZWRSYXRlKHJhdGUuaXRlbU5hbWUsIHJhdGUub3JpZ2luYWxJdGVtTmFtZSwgcmF0ZS5yYXRlKTtcclxuICAgICAgICAgICAgICAgIGxldCBhZGROZXdSYXRlT2ZQcm9qZWN0UHJvbWlzZSA9IHRoaXMuYWRkTmV3Q2VudHJhbGl6ZWRSYXRlRm9yUHJvamVjdChwcm9qZWN0SWQsIHJhdGVJdGVtKTtcclxuICAgICAgICAgICAgICAgIHByb21pc2VBcnJheUZvclByb2plY3RDZW50cmFsaXplZFJhdGVzLnB1c2goYWRkTmV3UmF0ZU9mUHJvamVjdFByb21pc2UpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHByb21pc2VBcnJheUZvclByb2plY3RDZW50cmFsaXplZFJhdGVzLmxlbmd0aCAhPT0gMCkge1xyXG5cclxuICAgICAgICAgICAgICBDQ1Byb21pc2UuYWxsKHByb21pc2VBcnJheUZvclByb2plY3RDZW50cmFsaXplZFJhdGVzKS50aGVuKGZ1bmN0aW9uIChkYXRhOiBBcnJheTxhbnk+KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1JhdGVzIEFycmF5IHVwZGF0ZWQgOiAnICsgSlNPTi5zdHJpbmdpZnkoY2VudHJhbGl6ZWRSYXRlc09mUHJvamVjdHMpKTtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHsnZGF0YSc6ICdzdWNjZXNzJ30pO1xyXG5cclxuICAgICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZTogYW55KSB7XHJcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoJyBQcm9taXNlIGZhaWxlZCBmb3IgY29udmVydENvc3RIZWFkc0Zyb21SYXRlQW5hbHlzaXNUb0Nvc3RDb250cm9sICEgOicgKyBKU09OLnN0cmluZ2lmeShlLm1lc3NhZ2UpKTtcclxuICAgICAgICAgICAgICAgIGxldCBlcnJvck9iaiA9IG5ldyBFcnJvcigpO1xyXG4gICAgICAgICAgICAgICAgZXJyb3JPYmoubWVzc2FnZSA9IGU7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvck9iaiwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHsnZGF0YSc6ICdzdWNjZXNzJ30pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pOyovXHJcbiAgfVxyXG5cclxuICAvL1VwZGF0ZSBEaXJlY3QgUmF0ZXMgb2YgUHJvamVjdCBDb3N0aGVhZHNcclxuICB1cGRhdGVEaXJlY3RSYXRlT2ZQcm9qZWN0V29ya0l0ZW1zKHByb2plY3RJZDogc3RyaW5nLCBjb3N0SGVhZElkOiBudW1iZXIsIGNhdGVnb3J5SWQ6IG51bWJlciwgd29ya0l0ZW1JZDogbnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlyZWN0UmF0ZTogbnVtYmVyLCB1c2VyOiBVc2VyLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcblxyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgdXBkYXRlRGlyZWN0UmF0ZU9mUHJvamVjdFdvcmtJdGVtcyBoYXMgYmVlbiBoaXQnKTtcclxuICAgIGxldCBxdWVyeSA9IHtfaWQ6IHByb2plY3RJZH07XHJcbiAgICBsZXQgdXBkYXRlUXVlcnkgPSB7JHNldDp7J3Byb2plY3RDb3N0SGVhZHMuJFtjb3N0SGVhZF0uY2F0ZWdvcmllcy4kW2NhdGVnb3J5XS53b3JrSXRlbXMuJFt3b3JrSXRlbV0ucmF0ZS50b3RhbCc6ZGlyZWN0UmF0ZSxcclxuICAgICAgICAncHJvamVjdENvc3RIZWFkcy4kW2Nvc3RIZWFkXS5jYXRlZ29yaWVzLiRbY2F0ZWdvcnldLndvcmtJdGVtcy4kW3dvcmtJdGVtXS5yYXRlLnJhdGVJdGVtcyc6W10sXHJcbiAgICAgICAgJ3Byb2plY3RDb3N0SGVhZHMuJFtjb3N0SGVhZF0uY2F0ZWdvcmllcy4kW2NhdGVnb3J5XS53b3JrSXRlbXMuJFt3b3JrSXRlbV0uaXNEaXJlY3RSYXRlJzogdHJ1ZVxyXG4gICAgICB9fTtcclxuXHJcbiAgICBsZXQgYXJyYXlGaWx0ZXIgPSBbXHJcbiAgICAgIHsnY29zdEhlYWQucmF0ZUFuYWx5c2lzSWQnOmNvc3RIZWFkSWR9LFxyXG4gICAgICB7J2NhdGVnb3J5LnJhdGVBbmFseXNpc0lkJzogY2F0ZWdvcnlJZH0sXHJcbiAgICAgIHsnd29ya0l0ZW0ucmF0ZUFuYWx5c2lzSWQnOndvcmtJdGVtSWR9XHJcbiAgICBdO1xyXG4gICAgdGhpcy5wcm9qZWN0UmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCB1cGRhdGVRdWVyeSx7YXJyYXlGaWx0ZXJzOmFycmF5RmlsdGVyLCBuZXc6IHRydWV9LCAoZXJyb3IsIGJ1aWxkaW5nKSA9PiB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGZpbmRPbmVBbmRVcGRhdGUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTogJ3N1Y2Nlc3MnLCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgLypsZXQgcHJvamVjdGlvbiA9IHsncHJvamVjdENvc3RIZWFkcyc6MX07XHJcbiAgICB0aGlzLnByb2plY3RSZXBvc2l0b3J5LmZpbmRCeUlkV2l0aFByb2plY3Rpb24ocHJvamVjdElkLCBwcm9qZWN0aW9uLCAoZXJyb3IsIHByb2plY3QpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICBsZXQgY29zdEhlYWRMaXN0ID0gcHJvamVjdC5wcm9qZWN0Q29zdEhlYWRzO1xyXG4gICAgICAgIHRoaXMudXBkYXRlRGlyZWN0UmF0ZShjb3N0SGVhZExpc3QsIGNvc3RIZWFkSWQsIGNhdGVnb3J5SWQsIHdvcmtJdGVtSWQsIGRpcmVjdFJhdGUpO1xyXG5cclxuICAgICAgICBsZXQgcXVlcnkgPSB7X2lkOiBwcm9qZWN0SWR9O1xyXG4gICAgICAgIGxldCBkYXRhID0geyRzZXQ6IHsncHJvamVjdENvc3RIZWFkcyc6IGNvc3RIZWFkTGlzdH19O1xyXG4gICAgICAgIHRoaXMucHJvamVjdFJlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgZGF0YSwge25ldzogdHJ1ZX0sIChlcnJvciwgcHJvamVjdCkgPT4ge1xyXG4gICAgICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZmluZE9uZUFuZFVwZGF0ZSBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTogJ3N1Y2Nlc3MnLCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pOyovXHJcbiAgfVxyXG5cclxuICBkZWxldGVRdWFudGl0eU9mQnVpbGRpbmdDb3N0SGVhZHNCeU5hbWUocHJvamVjdElkOiBzdHJpbmcsIGJ1aWxkaW5nSWQ6IHN0cmluZywgY29zdEhlYWRJZDogbnVtYmVyLCBjYXRlZ29yeUlkOiBudW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdvcmtJdGVtSWQ6IG51bWJlciwgaXRlbU5hbWU6IHN0cmluZywgdXNlcjogVXNlciwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZGVsZXRlUXVhbnRpdHkgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICBsZXQgcXVlcnkgPSB7X2lkOiBidWlsZGluZ0lkfTtcclxuICAgIGxldCBwcm9qZWN0aW9uID0ge2Nvc3RIZWFkczp7XHJcbiAgICAgICAgJGVsZW1NYXRjaCA6e3JhdGVBbmFseXNpc0lkIDogY29zdEhlYWRJZCwgY2F0ZWdvcmllczoge1xyXG4gICAgICAgICAgICAkZWxlbU1hdGNoOntyYXRlQW5hbHlzaXNJZDogY2F0ZWdvcnlJZCx3b3JrSXRlbXM6IHtcclxuICAgICAgICAgICAgICAgICRlbGVtTWF0Y2g6IHtyYXRlQW5hbHlzaXNJZDp3b3JrSXRlbUlkfX19fX19fVxyXG4gICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkucmV0cmlldmVXaXRoUHJvamVjdGlvbihxdWVyeSwgcHJvamVjdGlvbiwoZXJyb3IsIGJ1aWxkaW5nOkJ1aWxkaW5nKSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgcXVhbnRpdHlJdGVtczogQXJyYXk8UXVhbnRpdHlEZXRhaWxzPjtcclxuICAgICAgICBsZXQgdXBkYXRlZFdvcmtJdGVtOiBXb3JrSXRlbSA9IG5ldyBXb3JrSXRlbSgpO1xyXG4gICAgICAgIGZvcihsZXQgY29zdEhlYWQgb2YgYnVpbGRpbmdbMF0uY29zdEhlYWRzKSB7XHJcbiAgICAgICAgICBpZihjb3N0SGVhZC5yYXRlQW5hbHlzaXNJZCA9PT0gY29zdEhlYWRJZCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBjYXRlZ29yeSBvZiBjb3N0SGVhZC5jYXRlZ29yaWVzKSB7XHJcbiAgICAgICAgICAgICAgaWYgKGNhdGVnb3J5LnJhdGVBbmFseXNpc0lkID09PSBjYXRlZ29yeUlkKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB3b3JrSXRlbSBvZiBjYXRlZ29yeS53b3JrSXRlbXMpIHtcclxuICAgICAgICAgICAgICAgICAgaWYgKHdvcmtJdGVtLnJhdGVBbmFseXNpc0lkID09PSB3b3JrSXRlbUlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcXVhbnRpdHlJdGVtcyA9IHdvcmtJdGVtLnF1YW50aXR5LnF1YW50aXR5SXRlbURldGFpbHM7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgcXVhbnRpdHlJbmRleCA9IDA7IHF1YW50aXR5SW5kZXggPCBxdWFudGl0eUl0ZW1zLmxlbmd0aDsgcXVhbnRpdHlJbmRleCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBpZiAocXVhbnRpdHlJdGVtc1txdWFudGl0eUluZGV4XS5uYW1lID09PSBpdGVtTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBxdWFudGl0eUl0ZW1zLnNwbGljZShxdWFudGl0eUluZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgd29ya0l0ZW0ucXVhbnRpdHkudG90YWwgPSBhbGFzcWwoJ1ZBTFVFIE9GIFNFTEVDVCBST1VORChTVU0odG90YWwpLDIpIEZST00gPycsW3F1YW50aXR5SXRlbXNdKTtcclxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVkV29ya0l0ZW0gPSB3b3JrSXRlbTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKmxldCBxdWVyeSA9IHsgX2lkIDogYnVpbGRpbmdJZCwgY29zdEhlYWRzOntcclxuICAgICAgICAgICAgJGVsZW1NYXRjaCA6e3JhdGVBbmFseXNpc0lkIDogY29zdEhlYWRJZCwgY2F0ZWdvcmllczoge1xyXG4gICAgICAgICAgICAgICAgJGVsZW1NYXRjaDp7cmF0ZUFuYWx5c2lzSWQ6IGNhdGVnb3J5SWQsd29ya0l0ZW1zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGVsZW1NYXRjaDoge3JhdGVBbmFseXNpc0lkOndvcmtJdGVtSWQsICdxdWFudGl0eS4kLnF1YW50aXR5SXRlbURldGFpbHMnOnskZWxlbU1hdGNoOntuYW1lOiBpdGVtTmFtZX19fX19fX19IH07XHJcbiAgICAgICAgLy9sZXQgZGF0YSA9IHsgJHNldCA6IHsnY29zdEhlYWRzJyA6IGJ1aWxkaW5nLmNvc3RIZWFkcyB9fTtcclxuICAgICAgICBsZXQgdXBkYXRlUXVlcnkgPSB7JHNldDp7J2Nvc3RIZWFkcy4kW2Nvc3RIZWFkXS5jYXRlZ29yaWVzLiRbY2F0ZWdvcnldLndvcmtJdGVtcy4kW3dvcmtJdGVtXS5xdWFudGl0eS4kLnF1YW50aXR5SXRlbURldGFpbHMuJFtxdWFudGl0eUl0ZW1EZXRhaWxdLnRvdGFsJzpcclxuICAgICAgICAgICAgICB7JHN1YnRyYWN0OlxyXG4gICAgICAgICAgICAgICAgICBbJ2Nvc3RIZWFkcy4kW2Nvc3RIZWFkXS5jYXRlZ29yaWVzLiRbY2F0ZWdvcnldLndvcmtJdGVtcy4kW3dvcmtJdGVtXS5xdWFudGl0eS4kLnRvdGFsJyxcclxuICAgICAgICAgICAgICAgICAgJ2Nvc3RIZWFkcy4kW2Nvc3RIZWFkXS5jYXRlZ29yaWVzLiRbY2F0ZWdvcnldLndvcmtJdGVtcy4kW3dvcmtJdGVtXS5xdWFudGl0eS4kLnF1YW50aXR5SXRlbURldGFpbHMuJFtxdWFudGl0eUl0ZW1EZXRhaWxdLnRvdGFsJ119fSxcclxuICAgICAgICAkcHVsbDp7J2Nvc3RIZWFkcy4kW2Nvc3RIZWFkXS5jYXRlZ29yaWVzLiRbY2F0ZWdvcnldLndvcmtJdGVtcy4kW3dvcmtJdGVtXS5xdWFudGl0eS4kLnF1YW50aXR5SXRlbURldGFpbHMuJFtxdWFudGl0eUl0ZW1EZXRhaWxdLm5hbWUnOml0ZW1OYW1lfX07XHJcbiAgICAgICAgbGV0IGFycmF5RmlsdGVyID0gW1xyXG4gICAgICAgICAgeydjb3N0SGVhZC5yYXRlQW5hbHlzaXNJZCc6Y29zdEhlYWRJZH0sXHJcbiAgICAgICAgICB7J2NhdGVnb3J5LnJhdGVBbmFseXNpc0lkJzogY2F0ZWdvcnlJZH0sXHJcbiAgICAgICAgICB7J3dvcmtJdGVtLnJhdGVBbmFseXNpc0lkJzp3b3JrSXRlbUlkfSxcclxuICAgICAgICAgIHsncXVhbnRpdHlJdGVtRGV0YWlsLm5hbWUnOml0ZW1OYW1lfVxyXG4gICAgICAgIF07Ki9cclxuXHJcbiAgICAgICAgbGV0IHF1ZXJ5ID0ge19pZDogYnVpbGRpbmdJZH07XHJcbiAgICAgICAgbGV0IHVwZGF0ZVF1ZXJ5ID0geyRzZXQ6eydjb3N0SGVhZHMuJFtjb3N0SGVhZF0uY2F0ZWdvcmllcy4kW2NhdGVnb3J5XS53b3JrSXRlbXMuJFt3b3JrSXRlbV0nOnVwZGF0ZWRXb3JrSXRlbX19O1xyXG4gICAgICAgIGxldCBhcnJheUZpbHRlciA9IFtcclxuICAgICAgICAgIHsnY29zdEhlYWQucmF0ZUFuYWx5c2lzSWQnOmNvc3RIZWFkSWR9LFxyXG4gICAgICAgICAgeydjYXRlZ29yeS5yYXRlQW5hbHlzaXNJZCc6IGNhdGVnb3J5SWR9LFxyXG4gICAgICAgICAgeyd3b3JrSXRlbS5yYXRlQW5hbHlzaXNJZCc6d29ya0l0ZW1JZH1cclxuICAgICAgICBdO1xyXG4gICAgICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIHVwZGF0ZVF1ZXJ5LHthcnJheUZpbHRlcnM6YXJyYXlGaWx0ZXIsIG5ldzogdHJ1ZX0sIChlcnJvciwgYnVpbGRpbmcpID0+IHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGZpbmRPbmVBbmRVcGRhdGUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGE6ICdzdWNjZXNzJywgYWNjZXNzX3Rva2VuOiB0aGlzLmF1dGhJbnRlcmNlcHRvci5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKX0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vRGVsZXRlIFF1YW50aXR5IE9mIFByb2plY3QgQ29zdCBIZWFkcyBCeSBOYW1lXHJcbiAgZGVsZXRlUXVhbnRpdHlPZlByb2plY3RDb3N0SGVhZHNCeU5hbWUocHJvamVjdElkOiBzdHJpbmcsIGNvc3RIZWFkSWQ6IG51bWJlciwgY2F0ZWdvcnlJZDogbnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdvcmtJdGVtSWQ6IG51bWJlciwgaXRlbU5hbWU6IHN0cmluZywgdXNlcjogVXNlciwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZGVsZXRlUXVhbnRpdHkgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICBsZXQgcXVlcnkgPSB7X2lkOiBwcm9qZWN0SWR9O1xyXG4gICAgbGV0IHByb2plY3Rpb24gPSB7cHJvamVjdENvc3RIZWFkczp7XHJcbiAgICAgICAgJGVsZW1NYXRjaCA6e3JhdGVBbmFseXNpc0lkIDogY29zdEhlYWRJZCwgY2F0ZWdvcmllczoge1xyXG4gICAgICAgICAgICAkZWxlbU1hdGNoOntyYXRlQW5hbHlzaXNJZDogY2F0ZWdvcnlJZCx3b3JrSXRlbXM6IHtcclxuICAgICAgICAgICAgICAgICRlbGVtTWF0Y2g6IHtyYXRlQW5hbHlzaXNJZDp3b3JrSXRlbUlkfX19fX19fVxyXG4gICAgdGhpcy5wcm9qZWN0UmVwb3NpdG9yeS5yZXRyaWV2ZVdpdGhQcm9qZWN0aW9uKHF1ZXJ5LCBwcm9qZWN0aW9uLCAoZXJyb3IsIHByb2plY3Q6UHJvamVjdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IHF1YW50aXR5SXRlbXM6IEFycmF5PFF1YW50aXR5RGV0YWlscz47XHJcbiAgICAgICAgbGV0IHVwZGF0ZWRXb3JrSXRlbTogV29ya0l0ZW0gPSBuZXcgV29ya0l0ZW0oKTtcclxuICAgICAgICBmb3IobGV0IGNvc3RIZWFkIG9mIHByb2plY3RbMF0ucHJvamVjdENvc3RIZWFkcykge1xyXG4gICAgICAgICAgaWYoY29zdEhlYWQucmF0ZUFuYWx5c2lzSWQgPT09IGNvc3RIZWFkSWQpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgY2F0ZWdvcnkgb2YgY29zdEhlYWQuY2F0ZWdvcmllcykge1xyXG4gICAgICAgICAgICAgIGlmIChjYXRlZ29yeS5yYXRlQW5hbHlzaXNJZCA9PT0gY2F0ZWdvcnlJZCkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgd29ya0l0ZW0gb2YgY2F0ZWdvcnkud29ya0l0ZW1zKSB7XHJcbiAgICAgICAgICAgICAgICAgIGlmICh3b3JrSXRlbS5yYXRlQW5hbHlzaXNJZCA9PT0gd29ya0l0ZW1JZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHF1YW50aXR5SXRlbXMgPSB3b3JrSXRlbS5xdWFudGl0eS5xdWFudGl0eUl0ZW1EZXRhaWxzO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IHF1YW50aXR5SW5kZXggPSAwOyBxdWFudGl0eUluZGV4IDwgcXVhbnRpdHlJdGVtcy5sZW5ndGg7IHF1YW50aXR5SW5kZXgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgaWYgKHF1YW50aXR5SXRlbXNbcXVhbnRpdHlJbmRleF0ubmFtZSA9PT0gaXRlbU5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcXVhbnRpdHlJdGVtcy5zcGxpY2UocXVhbnRpdHlJbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHdvcmtJdGVtLnF1YW50aXR5LnRvdGFsID0gYWxhc3FsKCdWQUxVRSBPRiBTRUxFQ1QgUk9VTkQoU1VNKHRvdGFsKSwyKSBGUk9NID8nLFtxdWFudGl0eUl0ZW1zXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlZFdvcmtJdGVtID0gd29ya0l0ZW07XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBxdWVyeSA9IHtfaWQ6IHByb2plY3RJZH07XHJcbiAgICAgICAgbGV0IHVwZGF0ZVF1ZXJ5ID0geyRzZXQ6eydwcm9qZWN0Q29zdEhlYWRzLiRbY29zdEhlYWRdLmNhdGVnb3JpZXMuJFtjYXRlZ29yeV0ud29ya0l0ZW1zLiRbd29ya0l0ZW1dJzp1cGRhdGVkV29ya0l0ZW19fTtcclxuICAgICAgICBsZXQgYXJyYXlGaWx0ZXIgPSBbXHJcbiAgICAgICAgICB7J2Nvc3RIZWFkLnJhdGVBbmFseXNpc0lkJzpjb3N0SGVhZElkfSxcclxuICAgICAgICAgIHsnY2F0ZWdvcnkucmF0ZUFuYWx5c2lzSWQnOiBjYXRlZ29yeUlkfSxcclxuICAgICAgICAgIHsnd29ya0l0ZW0ucmF0ZUFuYWx5c2lzSWQnOndvcmtJdGVtSWR9XHJcbiAgICAgICAgXVxyXG4gICAgICAgIHRoaXMucHJvamVjdFJlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgdXBkYXRlUXVlcnkse2FycmF5RmlsdGVyczphcnJheUZpbHRlciwgbmV3OiB0cnVlfSwgKGVycm9yLCBwcm9qZWN0KSA9PiB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kT25lQW5kVXBkYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiAnc3VjY2VzcycsIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBkZWxldGVXb3JraXRlbShwcm9qZWN0SWQ6IHN0cmluZywgYnVpbGRpbmdJZDogc3RyaW5nLCBjb3N0SGVhZElkOiBudW1iZXIsIGNhdGVnb3J5SWQ6IG51bWJlciwgd29ya0l0ZW1JZDogbnVtYmVyLCB1c2VyOiBVc2VyLFxyXG4gICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGRlbGV0ZSBXb3JraXRlbSBoYXMgYmVlbiBoaXQnKTtcclxuICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmZpbmRCeUlkKGJ1aWxkaW5nSWQsIChlcnJvciwgYnVpbGRpbmc6IEJ1aWxkaW5nKSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgY29zdEhlYWRMaXN0ID0gYnVpbGRpbmcuY29zdEhlYWRzO1xyXG4gICAgICAgIGxldCBjYXRlZ29yeUxpc3Q6IENhdGVnb3J5W107XHJcbiAgICAgICAgbGV0IFdvcmtJdGVtTGlzdDogV29ya0l0ZW1bXTtcclxuICAgICAgICB2YXIgZmxhZyA9IDA7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBjb3N0SGVhZExpc3QubGVuZ3RoOyBpbmRleCsrKSB7XHJcbiAgICAgICAgICBpZiAoY29zdEhlYWRJZCA9PT0gY29zdEhlYWRMaXN0W2luZGV4XS5yYXRlQW5hbHlzaXNJZCkge1xyXG4gICAgICAgICAgICBjYXRlZ29yeUxpc3QgPSBjb3N0SGVhZExpc3RbaW5kZXhdLmNhdGVnb3JpZXM7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGNhdGVnb3J5SW5kZXggPSAwOyBjYXRlZ29yeUluZGV4IDwgY2F0ZWdvcnlMaXN0Lmxlbmd0aDsgY2F0ZWdvcnlJbmRleCsrKSB7XHJcbiAgICAgICAgICAgICAgaWYgKGNhdGVnb3J5SWQgPT09IGNhdGVnb3J5TGlzdFtjYXRlZ29yeUluZGV4XS5yYXRlQW5hbHlzaXNJZCkge1xyXG4gICAgICAgICAgICAgICAgV29ya0l0ZW1MaXN0ID0gY2F0ZWdvcnlMaXN0W2NhdGVnb3J5SW5kZXhdLndvcmtJdGVtcztcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHdvcmtpdGVtSW5kZXggPSAwOyB3b3JraXRlbUluZGV4IDwgV29ya0l0ZW1MaXN0Lmxlbmd0aDsgd29ya2l0ZW1JbmRleCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgIGlmICh3b3JrSXRlbUlkID09PSBXb3JrSXRlbUxpc3Rbd29ya2l0ZW1JbmRleF0ucmF0ZUFuYWx5c2lzSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBmbGFnID0gMTtcclxuICAgICAgICAgICAgICAgICAgICBXb3JrSXRlbUxpc3Quc3BsaWNlKHdvcmtpdGVtSW5kZXgsIDEpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZmxhZyA9PT0gMSkge1xyXG4gICAgICAgICAgbGV0IHF1ZXJ5ID0ge19pZDogYnVpbGRpbmdJZH07XHJcbiAgICAgICAgICB0aGlzLmJ1aWxkaW5nUmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCBidWlsZGluZywge25ldzogdHJ1ZX0sIChlcnJvciwgV29ya0l0ZW1MaXN0KSA9PiB7XHJcbiAgICAgICAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGZpbmRPbmVBbmRVcGRhdGUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBsZXQgbWVzc2FnZSA9ICdXb3JrSXRlbSBkZWxldGVkLic7XHJcbiAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGE6IFdvcmtJdGVtTGlzdCwgYWNjZXNzX3Rva2VuOiB0aGlzLmF1dGhJbnRlcmNlcHRvci5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKX0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzZXRDb3N0SGVhZFN0YXR1cyhidWlsZGluZ0lkOiBzdHJpbmcsIGNvc3RIZWFkSWQ6IG51bWJlciwgY29zdEhlYWRBY3RpdmVTdGF0dXM6IHN0cmluZywgdXNlcjogVXNlcixcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBsZXQgcXVlcnkgPSB7J19pZCc6IGJ1aWxkaW5nSWQsICdjb3N0SGVhZHMucmF0ZUFuYWx5c2lzSWQnOiBjb3N0SGVhZElkfTtcclxuICAgIGxldCBhY3RpdmVTdGF0dXMgPSBKU09OLnBhcnNlKGNvc3RIZWFkQWN0aXZlU3RhdHVzKTtcclxuICAgIGxldCBuZXdEYXRhID0geyRzZXQ6IHsnY29zdEhlYWRzLiQuYWN0aXZlJzogYWN0aXZlU3RhdHVzfX07XHJcbiAgICB0aGlzLmJ1aWxkaW5nUmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCBuZXdEYXRhLCB7bmV3OiB0cnVlfSwgKGVyciwgcmVzcG9uc2UpID0+IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZmluZE9uZUFuZFVwZGF0ZSBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGE6IHJlc3BvbnNlLCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlV29ya0l0ZW1TdGF0dXNPZkJ1aWxkaW5nQ29zdEhlYWRzKGJ1aWxkaW5nSWQ6IHN0cmluZywgY29zdEhlYWRJZDogbnVtYmVyLCBjYXRlZ29yeUlkOiBudW1iZXIsIHdvcmtJdGVtSWQ6IG51bWJlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd29ya0l0ZW1BY3RpdmVTdGF0dXM6IGJvb2xlYW4sIHVzZXI6IFVzZXIsIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIHVwZGF0ZSBXb3JraXRlbSBoYXMgYmVlbiBoaXQnKTtcclxuICAgIGxldCBxdWVyeSA9IHtfaWQ6IGJ1aWxkaW5nSWR9O1xyXG4gICAgbGV0IHVwZGF0ZVF1ZXJ5ID0geyRzZXQ6eydjb3N0SGVhZHMuJFtjb3N0SGVhZF0uY2F0ZWdvcmllcy4kW2NhdGVnb3J5XS53b3JrSXRlbXMuJFt3b3JrSXRlbV0uYWN0aXZlJzp3b3JrSXRlbUFjdGl2ZVN0YXR1c319O1xyXG4gICAgbGV0IGFycmF5RmlsdGVyID0gW1xyXG4gICAgICB7J2Nvc3RIZWFkLnJhdGVBbmFseXNpc0lkJzpjb3N0SGVhZElkfSxcclxuICAgICAgeydjYXRlZ29yeS5yYXRlQW5hbHlzaXNJZCc6IGNhdGVnb3J5SWR9LFxyXG4gICAgICB7J3dvcmtJdGVtLnJhdGVBbmFseXNpc0lkJzp3b3JrSXRlbUlkfVxyXG4gICAgXTtcclxuXHJcbiAgICB0aGlzLmJ1aWxkaW5nUmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCB1cGRhdGVRdWVyeSwge2FycmF5RmlsdGVyczphcnJheUZpbHRlciwgbmV3OiB0cnVlfSwgKGVycm9yLCByZXNwb25zZSkgPT4ge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kT25lQW5kVXBkYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGE6ICdzdWNjZXNzJywgYWNjZXNzX3Rva2VuOiB0aGlzLmF1dGhJbnRlcmNlcHRvci5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKX0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vIFVwZGF0ZSBXb3JrSXRlbSBTdGF0dXMgT2YgUHJvamVjdCBDb3N0SGVhZHNcclxuICB1cGRhdGVXb3JrSXRlbVN0YXR1c09mUHJvamVjdENvc3RIZWFkcyhwcm9qZWN0SWQ6IHN0cmluZywgY29zdEhlYWRJZDogbnVtYmVyLCBjYXRlZ29yeUlkOiBudW1iZXIsIHdvcmtJdGVtSWQ6IG51bWJlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3b3JrSXRlbUFjdGl2ZVN0YXR1czogYm9vbGVhbiwgdXNlcjogVXNlciwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgVXBkYXRlIFdvcmtJdGVtIFN0YXR1cyBPZiBQcm9qZWN0IENvc3QgSGVhZHMgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICBsZXQgcXVlcnkgPSB7X2lkOiBwcm9qZWN0SWR9O1xyXG4gICAgbGV0IHVwZGF0ZVF1ZXJ5ID0geyRzZXQ6eydwcm9qZWN0Q29zdEhlYWRzLiRbY29zdEhlYWRdLmNhdGVnb3JpZXMuJFtjYXRlZ29yeV0ud29ya0l0ZW1zLiRbd29ya0l0ZW1dLmFjdGl2ZSc6d29ya0l0ZW1BY3RpdmVTdGF0dXN9fTtcclxuICAgIGxldCBhcnJheUZpbHRlciA9IFtcclxuICAgICAgeydjb3N0SGVhZC5yYXRlQW5hbHlzaXNJZCc6Y29zdEhlYWRJZH0sXHJcbiAgICAgIHsnY2F0ZWdvcnkucmF0ZUFuYWx5c2lzSWQnOiBjYXRlZ29yeUlkfSxcclxuICAgICAgeyd3b3JrSXRlbS5yYXRlQW5hbHlzaXNJZCc6d29ya0l0ZW1JZH1cclxuICAgIF07XHJcbiAgICB0aGlzLnByb2plY3RSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIHVwZGF0ZVF1ZXJ5LCB7YXJyYXlGaWx0ZXJzOmFycmF5RmlsdGVyLCBuZXc6IHRydWV9LCAoZXJyb3IsIHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIFVwZGF0ZSBXb3JrSXRlbSBTdGF0dXMgT2YgUHJvamVjdCBDb3N0IEhlYWRzICxmaW5kT25lQW5kVXBkYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGE6ICdzdWNjZXNzJywgYWNjZXNzX3Rva2VuOiB0aGlzLmF1dGhJbnRlcmNlcHRvci5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKX0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZUJ1ZGdldGVkQ29zdEZvckNvc3RIZWFkKGJ1aWxkaW5nSWQ6IHN0cmluZywgY29zdEhlYWRCdWRnZXRlZEFtb3VudDogYW55LCB1c2VyOiBVc2VyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIHVwZGF0ZUJ1ZGdldGVkQ29zdEZvckNvc3RIZWFkIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgbGV0IHF1ZXJ5ID0geydfaWQnOiBidWlsZGluZ0lkLCAnY29zdEhlYWRzLm5hbWUnOiBjb3N0SGVhZEJ1ZGdldGVkQW1vdW50LmNvc3RIZWFkfTtcclxuXHJcbiAgICBsZXQgbmV3RGF0YSA9IHtcclxuICAgICAgJHNldDoge1xyXG4gICAgICAgICdjb3N0SGVhZHMuJC5idWRnZXRlZENvc3RBbW91bnQnOiBjb3N0SGVhZEJ1ZGdldGVkQW1vdW50LmJ1ZGdldGVkQ29zdEFtb3VudCxcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmJ1aWxkaW5nUmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCBuZXdEYXRhLCB7bmV3OiB0cnVlfSwgKGVyciwgcmVzcG9uc2UpID0+IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZmluZE9uZUFuZFVwZGF0ZSBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGE6IHJlc3BvbnNlLCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlQnVkZ2V0ZWRDb3N0Rm9yUHJvamVjdENvc3RIZWFkKHByb2plY3RJZDogc3RyaW5nLCBjb3N0SGVhZEJ1ZGdldGVkQW1vdW50OiBhbnksIHVzZXI6IFVzZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIHVwZGF0ZUJ1ZGdldGVkQ29zdEZvckNvc3RIZWFkIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgbGV0IHF1ZXJ5ID0geydfaWQnOiBwcm9qZWN0SWQsICdwcm9qZWN0Q29zdEhlYWRzLm5hbWUnOiBjb3N0SGVhZEJ1ZGdldGVkQW1vdW50LmNvc3RIZWFkfTtcclxuXHJcbiAgICBsZXQgbmV3RGF0YSA9IHtcclxuICAgICAgJHNldDoge1xyXG4gICAgICAgICdwcm9qZWN0Q29zdEhlYWRzLiQuYnVkZ2V0ZWRDb3N0QW1vdW50JzogY29zdEhlYWRCdWRnZXRlZEFtb3VudC5idWRnZXRlZENvc3RBbW91bnQsXHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5wcm9qZWN0UmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCBuZXdEYXRhLCB7bmV3OiB0cnVlfSwgKGVyciwgcmVzcG9uc2UpID0+IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZmluZE9uZUFuZFVwZGF0ZSBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGE6IHJlc3BvbnNlLCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlUXVhbnRpdHlPZkJ1aWxkaW5nQ29zdEhlYWRzKHByb2plY3RJZDogc3RyaW5nLCBidWlsZGluZ0lkOiBzdHJpbmcsIGNvc3RIZWFkSWQ6IG51bWJlciwgY2F0ZWdvcnlJZDogbnVtYmVyLCB3b3JrSXRlbUlkOiBudW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5RGV0YWlsOiBRdWFudGl0eURldGFpbHMsIHVzZXI6IFVzZXIsIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIHVwZGF0ZVF1YW50aXR5T2ZCdWlsZGluZ0Nvc3RIZWFkcyBoYXMgYmVlbiBoaXQnKTtcclxuICAgIGxldCBxdWVyeSA9IHtfaWQ6IGJ1aWxkaW5nSWR9O1xyXG4gICAgbGV0IHByb2plY3Rpb24gPSB7Y29zdEhlYWRzOntcclxuICAgICAgICAkZWxlbU1hdGNoIDp7cmF0ZUFuYWx5c2lzSWQgOiBjb3N0SGVhZElkLCBjYXRlZ29yaWVzOiB7XHJcbiAgICAgICAgICAgICRlbGVtTWF0Y2g6e3JhdGVBbmFseXNpc0lkOiBjYXRlZ29yeUlkLHdvcmtJdGVtczoge1xyXG4gICAgICAgICAgICAgICAgJGVsZW1NYXRjaDoge3JhdGVBbmFseXNpc0lkOndvcmtJdGVtSWR9fX19fX19XHJcbiAgICB0aGlzLmJ1aWxkaW5nUmVwb3NpdG9yeS5yZXRyaWV2ZVdpdGhQcm9qZWN0aW9uKHF1ZXJ5LCBwcm9qZWN0aW9uLChlcnJvciwgYnVpbGRpbmcpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCBjb3N0SGVhZExpc3QgPSBidWlsZGluZ1swXS5jb3N0SGVhZHM7XHJcbiAgICAgICAgbGV0IHF1YW50aXR5ICA6IFF1YW50aXR5O1xyXG4gICAgICAgIGZvciAobGV0IGNvc3RIZWFkIG9mIGNvc3RIZWFkTGlzdCkge1xyXG4gICAgICAgICAgICBsZXQgY2F0ZWdvcmllc09mQ29zdEhlYWQgPSBjb3N0SGVhZC5jYXRlZ29yaWVzO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBjYXRlZ29yeURhdGEgb2YgY2F0ZWdvcmllc09mQ29zdEhlYWQpIHtcclxuICAgICAgICAgICAgICBpZiAoY2F0ZWdvcnlJZCA9PT0gY2F0ZWdvcnlEYXRhLnJhdGVBbmFseXNpc0lkKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB3b3JrSXRlbURhdGEgb2YgY2F0ZWdvcnlEYXRhLndvcmtJdGVtcykge1xyXG4gICAgICAgICAgICAgICAgICBpZiAod29ya0l0ZW1JZCA9PT0gd29ya0l0ZW1EYXRhLnJhdGVBbmFseXNpc0lkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcXVhbnRpdHkgPSB3b3JrSXRlbURhdGEucXVhbnRpdHk7XHJcbiAgICAgICAgICAgICAgICAgICAgcXVhbnRpdHkuaXNFc3RpbWF0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHF1YW50aXR5LmlzRGlyZWN0UXVhbnRpdHkgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5LmlzRGlyZWN0UXVhbnRpdHkgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVRdWFudGl0eUl0ZW1zT2ZXb3JrSXRlbSggcXVhbnRpdHksIHF1YW50aXR5RGV0YWlsKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGxldCBxdWVyeSA9IHtfaWQ6IGJ1aWxkaW5nSWR9O1xyXG4gICAgICAgICAgbGV0IHVwZGF0ZVF1ZXJ5ID0geyRzZXQ6eydjb3N0SGVhZHMuJFtjb3N0SGVhZF0uY2F0ZWdvcmllcy4kW2NhdGVnb3J5XS53b3JrSXRlbXMuJFt3b3JrSXRlbV0ucXVhbnRpdHknOnF1YW50aXR5fX07XHJcbiAgICAgICAgICBsZXQgYXJyYXlGaWx0ZXIgPSBbXHJcbiAgICAgICAgICAgIHsnY29zdEhlYWQucmF0ZUFuYWx5c2lzSWQnOmNvc3RIZWFkSWR9LFxyXG4gICAgICAgICAgICB7J2NhdGVnb3J5LnJhdGVBbmFseXNpc0lkJzogY2F0ZWdvcnlJZH0sXHJcbiAgICAgICAgICAgIHsnd29ya0l0ZW0ucmF0ZUFuYWx5c2lzSWQnOndvcmtJdGVtSWR9XHJcbiAgICAgICAgICBdO1xyXG4gICAgICAgICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgdXBkYXRlUXVlcnksIHthcnJheUZpbHRlcnM6YXJyYXlGaWx0ZXIsIG5ldzogdHJ1ZX0sIChlcnJvciwgYnVpbGRpbmcpID0+IHtcclxuICAgICAgICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZmluZE9uZUFuZFVwZGF0ZSBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiAnc3VjY2VzcycsIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVEaXJlY3RRdWFudGl0eU9mQnVpbGRpbmdXb3JrSXRlbXMocHJvamVjdElkOiBzdHJpbmcsIGJ1aWxkaW5nSWQ6IHN0cmluZywgY29zdEhlYWRJZDogbnVtYmVyLCBjYXRlZ29yeUlkOiBudW1iZXIsIHdvcmtJdGVtSWQ6IG51bWJlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlyZWN0UXVhbnRpdHk6IG51bWJlciwgdXNlcjogVXNlciwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgdXBkYXRlRGlyZWN0UXVhbnRpdHlPZkJ1aWxkaW5nQ29zdEhlYWRzIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgbGV0IHByb2plY3Rpb24gPSB7Y29zdEhlYWRzOiAxfTtcclxuICAgIGxldCBxdWVyeSA9IHtfaWQ6IGJ1aWxkaW5nSWR9O1xyXG4gICAgbGV0IHVwZGF0ZVF1ZXJ5ID0geyRzZXQ6eydjb3N0SGVhZHMuJFtjb3N0SGVhZF0uY2F0ZWdvcmllcy4kW2NhdGVnb3J5XS53b3JrSXRlbXMuJFt3b3JrSXRlbV0ucXVhbnRpdHkuaXNFc3RpbWF0ZWQnOnRydWUsXHJcbiAgICAgICAgJ2Nvc3RIZWFkcy4kW2Nvc3RIZWFkXS5jYXRlZ29yaWVzLiRbY2F0ZWdvcnldLndvcmtJdGVtcy4kW3dvcmtJdGVtXS5xdWFudGl0eS5pc0RpcmVjdFF1YW50aXR5Jzp0cnVlLFxyXG4gICAgICAgICdjb3N0SGVhZHMuJFtjb3N0SGVhZF0uY2F0ZWdvcmllcy4kW2NhdGVnb3J5XS53b3JrSXRlbXMuJFt3b3JrSXRlbV0ucXVhbnRpdHkudG90YWwnOmRpcmVjdFF1YW50aXR5LFxyXG4gICAgICAgICdjb3N0SGVhZHMuJFtjb3N0SGVhZF0uY2F0ZWdvcmllcy4kW2NhdGVnb3J5XS53b3JrSXRlbXMuJFt3b3JrSXRlbV0ucXVhbnRpdHkucXVhbnRpdHlJdGVtRGV0YWlscyc6W11cclxuICAgICAgfX07XHJcblxyXG4gICAgbGV0IGFycmF5RmlsdGVyID0gW1xyXG4gICAgICB7J2Nvc3RIZWFkLnJhdGVBbmFseXNpc0lkJzpjb3N0SGVhZElkfSxcclxuICAgICAgeydjYXRlZ29yeS5yYXRlQW5hbHlzaXNJZCc6IGNhdGVnb3J5SWR9LFxyXG4gICAgICB7J3dvcmtJdGVtLnJhdGVBbmFseXNpc0lkJzp3b3JrSXRlbUlkfVxyXG4gICAgXTtcclxuICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIHVwZGF0ZVF1ZXJ5LCB7YXJyYXlGaWx0ZXJzOmFycmF5RmlsdGVyLCBuZXc6IHRydWV9LCAoZXJyb3IsIGJ1aWxkaW5nKSA9PiB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGZpbmRPbmVBbmRVcGRhdGUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTogJ3N1Y2Nlc3MnLCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgLypsZXQgcHJvamVjdGlvbiA9IHsgY29zdEhlYWRzIDogMSB9O1xyXG4gICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZEJ5SWRXaXRoUHJvamVjdGlvbihidWlsZGluZ0lkLCBwcm9qZWN0aW9uLCAoZXJyb3IsIGJ1aWxkaW5nKSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgY29zdEhlYWRMaXN0ID0gYnVpbGRpbmcuY29zdEhlYWRzO1xyXG4gICAgICAgIHRoaXMudXBkYXRlUXVhbnRpdHlEZXRhaWxzKGNvc3RIZWFkTGlzdCwgY29zdEhlYWRJZCwgY2F0ZWdvcnlJZCwgd29ya0l0ZW1JZCwgZGlyZWN0UXVhbnRpdHkpO1xyXG5cclxuICAgICAgICBsZXQgcXVlcnkgPSB7X2lkOiBidWlsZGluZ0lkfTtcclxuICAgICAgICBsZXQgZGF0YSA9IHskc2V0OiB7J2Nvc3RIZWFkcyc6IGNvc3RIZWFkTGlzdH19O1xyXG4gICAgICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIGRhdGEsIHtuZXc6IHRydWV9LCAoZXJyb3IsIGJ1aWxkaW5nKSA9PiB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kT25lQW5kVXBkYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiAnc3VjY2VzcycsIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7Ki9cclxuICB9XHJcblxyXG4gIHVwZGF0ZURpcmVjdFF1YW50aXR5T2ZQcm9qZWN0V29ya0l0ZW1zKHByb2plY3RJZDogc3RyaW5nLCBjb3N0SGVhZElkOiBudW1iZXIsIGNhdGVnb3J5SWQ6IG51bWJlciwgd29ya0l0ZW1JZDogbnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpcmVjdFF1YW50aXR5OiBudW1iZXIsIHVzZXI6IFVzZXIsIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIHVwZGF0ZURpcmVjdFF1YW50aXR5T2ZQcm9qZWN0V29ya0l0ZW1zIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgbGV0IHF1ZXJ5ID0ge19pZDogcHJvamVjdElkfTtcclxuICAgIGxldCB1cGRhdGVRdWVyeSA9IHskc2V0OnsncHJvamVjdENvc3RIZWFkcy4kW2Nvc3RIZWFkXS5jYXRlZ29yaWVzLiRbY2F0ZWdvcnldLndvcmtJdGVtcy4kW3dvcmtJdGVtXS5xdWFudGl0eS5pc0VzdGltYXRlZCc6dHJ1ZSxcclxuICAgICAgICAncHJvamVjdENvc3RIZWFkcy4kW2Nvc3RIZWFkXS5jYXRlZ29yaWVzLiRbY2F0ZWdvcnldLndvcmtJdGVtcy4kW3dvcmtJdGVtXS5xdWFudGl0eS5pc0RpcmVjdFF1YW50aXR5Jzp0cnVlLFxyXG4gICAgICAgICdwcm9qZWN0Q29zdEhlYWRzLiRbY29zdEhlYWRdLmNhdGVnb3JpZXMuJFtjYXRlZ29yeV0ud29ya0l0ZW1zLiRbd29ya0l0ZW1dLnF1YW50aXR5LnRvdGFsJzpkaXJlY3RRdWFudGl0eSxcclxuICAgICAgICAncHJvamVjdENvc3RIZWFkcy4kW2Nvc3RIZWFkXS5jYXRlZ29yaWVzLiRbY2F0ZWdvcnldLndvcmtJdGVtcy4kW3dvcmtJdGVtXS5xdWFudGl0eS5xdWFudGl0eUl0ZW1EZXRhaWxzJzpbXVxyXG4gICAgICB9fTtcclxuXHJcbiAgICBsZXQgYXJyYXlGaWx0ZXIgPSBbXHJcbiAgICAgIHsnY29zdEhlYWQucmF0ZUFuYWx5c2lzSWQnOmNvc3RIZWFkSWR9LFxyXG4gICAgICB7J2NhdGVnb3J5LnJhdGVBbmFseXNpc0lkJzogY2F0ZWdvcnlJZH0sXHJcbiAgICAgIHsnd29ya0l0ZW0ucmF0ZUFuYWx5c2lzSWQnOndvcmtJdGVtSWR9XHJcbiAgICBdO1xyXG4gICAgdGhpcy5wcm9qZWN0UmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCB1cGRhdGVRdWVyeSwge2FycmF5RmlsdGVyczphcnJheUZpbHRlciwgbmV3OiB0cnVlfSwgKGVycm9yLCBidWlsZGluZykgPT4ge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kT25lQW5kVXBkYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGE6ICdzdWNjZXNzJywgYWNjZXNzX3Rva2VuOiB0aGlzLmF1dGhJbnRlcmNlcHRvci5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKX0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIC8qbGV0IHByb2plY3Rpb24gPSB7IHByb2plY3RDb3N0SGVhZHMgOiAxIH07XHJcbiAgICB0aGlzLnByb2plY3RSZXBvc2l0b3J5LmZpbmRCeUlkV2l0aFByb2plY3Rpb24ocHJvamVjdElkLCBwcm9qZWN0aW9uLChlcnJvciwgcHJvamVjdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IGNvc3RIZWFkTGlzdCA9IHByb2plY3QucHJvamVjdENvc3RIZWFkcztcclxuICAgICAgICB0aGlzLnVwZGF0ZVF1YW50aXR5RGV0YWlscyhjb3N0SGVhZExpc3QsIGNvc3RIZWFkSWQsIGNhdGVnb3J5SWQsIHdvcmtJdGVtSWQsIGRpcmVjdFF1YW50aXR5KTtcclxuXHJcbiAgICAgICAgbGV0IHF1ZXJ5ID0ge19pZDogcHJvamVjdElkfTtcclxuICAgICAgICBsZXQgZGF0YSA9IHskc2V0OiB7J3Byb2plY3RDb3N0SGVhZHMnOiBjb3N0SGVhZExpc3R9fTtcclxuICAgICAgICB0aGlzLnByb2plY3RSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIGRhdGEsIHtuZXc6IHRydWV9LCAoZXJyb3IsIGJ1aWxkaW5nKSA9PiB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kT25lQW5kVXBkYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiAnc3VjY2VzcycsIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7Ki9cclxuICB9XHJcblxyXG4gIHVwZGF0ZVF1YW50aXR5RGV0YWlsc09mUHJvamVjdChwcm9qZWN0SWQ6IHN0cmluZywgY29zdEhlYWRJZDogbnVtYmVyLCBjYXRlZ29yeUlkOiBudW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdvcmtJdGVtSWQ6IG51bWJlciwgcXVhbnRpdHlEZXRhaWxzT2JqOiBRdWFudGl0eURldGFpbHMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXI6IFVzZXIsIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxldCBxdWVyeSA9IFtcclxuICAgICAgeyRtYXRjaDogeydfaWQnOiBPYmplY3RJZChwcm9qZWN0SWQpLCAncHJvamVjdENvc3RIZWFkcy5yYXRlQW5hbHlzaXNJZCc6IGNvc3RIZWFkSWR9fSxcclxuICAgICAgeyR1bndpbmQ6ICckcHJvamVjdENvc3RIZWFkcyd9LFxyXG4gICAgICB7JHByb2plY3Q6IHsncHJvamVjdENvc3RIZWFkcyc6IDF9fSxcclxuICAgICAgeyR1bndpbmQ6ICckcHJvamVjdENvc3RIZWFkcy5jYXRlZ29yaWVzJ30sXHJcbiAgICAgIHskbWF0Y2g6IHsncHJvamVjdENvc3RIZWFkcy5jYXRlZ29yaWVzLnJhdGVBbmFseXNpc0lkJzogY2F0ZWdvcnlJZH19LFxyXG4gICAgICB7JHByb2plY3Q6IHsncHJvamVjdENvc3RIZWFkcy5jYXRlZ29yaWVzLndvcmtJdGVtcyc6IDF9fSxcclxuICAgICAgeyR1bndpbmQ6ICckcHJvamVjdENvc3RIZWFkcy5jYXRlZ29yaWVzLndvcmtJdGVtcyd9LFxyXG4gICAgICB7JG1hdGNoOiB7J3Byb2plY3RDb3N0SGVhZHMuY2F0ZWdvcmllcy53b3JrSXRlbXMucmF0ZUFuYWx5c2lzSWQnOiB3b3JrSXRlbUlkfX0sXHJcbiAgICAgIHskcHJvamVjdDogeydwcm9qZWN0Q29zdEhlYWRzLmNhdGVnb3JpZXMud29ya0l0ZW1zLnF1YW50aXR5JzogMX19LFxyXG4gICAgXTtcclxuXHJcbiAgICB0aGlzLnByb2plY3RSZXBvc2l0b3J5LmFnZ3JlZ2F0ZShxdWVyeSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChyZXN1bHQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgbGV0IHF1YW50aXR5PSByZXN1bHRbMF0ucHJvamVjdENvc3RIZWFkcy5jYXRlZ29yaWVzLndvcmtJdGVtcy5xdWFudGl0eTtcclxuICAgICAgICAgIHRoaXMudXBkYXRlUXVhbnRpdHlEZXRhaWxzKHF1YW50aXR5LCBxdWFudGl0eURldGFpbHNPYmopO1xyXG5cclxuICAgICAgICAgIGxldCBxdWVyeSA9IHtfaWQ6IHByb2plY3RJZH07XHJcbiAgICAgICAgICBsZXQgdXBkYXRlUXVlcnkgPSB7JHNldDp7J3Byb2plY3RDb3N0SGVhZHMuJFtjb3N0SGVhZF0uY2F0ZWdvcmllcy4kW2NhdGVnb3J5XS53b3JrSXRlbXMuJFt3b3JrSXRlbV0ucXVhbnRpdHknOnF1YW50aXR5fX07XHJcbiAgICAgICAgICBsZXQgYXJyYXlGaWx0ZXIgPSBbXHJcbiAgICAgICAgICAgIHsnY29zdEhlYWQucmF0ZUFuYWx5c2lzSWQnOmNvc3RIZWFkSWR9LFxyXG4gICAgICAgICAgICB7J2NhdGVnb3J5LnJhdGVBbmFseXNpc0lkJzogY2F0ZWdvcnlJZH0sXHJcbiAgICAgICAgICAgIHsnd29ya0l0ZW0ucmF0ZUFuYWx5c2lzSWQnOndvcmtJdGVtSWR9XHJcbiAgICAgICAgICBdO1xyXG4gICAgICAgICAgdGhpcy5wcm9qZWN0UmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCB1cGRhdGVRdWVyeSwge2FycmF5RmlsdGVyczphcnJheUZpbHRlciwgbmV3OiB0cnVlfSwgKGVycm9yLCBidWlsZGluZykgPT4ge1xyXG4gICAgICAgICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kT25lQW5kVXBkYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGE6IHF1YW50aXR5RGV0YWlsc09iaiwgc3RhdHVzIDonc3VjY2VzcycsIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgbGV0IGVycm9yID0gbmV3IEVycm9yKCk7XHJcbiAgICAgICAgICBlcnJvci5tZXNzYWdlID0gbWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX1JFU1BPTlNFO1xyXG4gICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgdXBkYXRlUXVhbnRpdHlEZXRhaWxzT2ZCdWlsZGluZyhwcm9qZWN0SWQ6IHN0cmluZywgYnVpbGRpbmdJZDogc3RyaW5nLCBjb3N0SGVhZElkOiBudW1iZXIsIGNhdGVnb3J5SWQ6IG51bWJlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdvcmtJdGVtSWQ6IG51bWJlciwgcXVhbnRpdHlEZXRhaWxzT2JqOiBRdWFudGl0eURldGFpbHMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyOiBVc2VyLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBsZXQgcXVlcnkgPSBbXHJcbiAgICAgICAgeyRtYXRjaDogeydfaWQnOiBPYmplY3RJZChidWlsZGluZ0lkKSwgJ2Nvc3RIZWFkcy5yYXRlQW5hbHlzaXNJZCc6IGNvc3RIZWFkSWR9fSxcclxuICAgICAgICB7JHVud2luZDogJyRjb3N0SGVhZHMnfSxcclxuICAgICAgICB7JHByb2plY3Q6IHsnY29zdEhlYWRzJzogMX19LFxyXG4gICAgICAgIHskdW53aW5kOiAnJGNvc3RIZWFkcy5jYXRlZ29yaWVzJ30sXHJcbiAgICAgICAgeyRtYXRjaDogeydjb3N0SGVhZHMuY2F0ZWdvcmllcy5yYXRlQW5hbHlzaXNJZCc6IGNhdGVnb3J5SWR9fSxcclxuICAgICAgICB7JHByb2plY3Q6IHsnY29zdEhlYWRzLmNhdGVnb3JpZXMud29ya0l0ZW1zJzogMX19LFxyXG4gICAgICAgIHskdW53aW5kOiAnJGNvc3RIZWFkcy5jYXRlZ29yaWVzLndvcmtJdGVtcyd9LFxyXG4gICAgICAgIHskbWF0Y2g6IHsnY29zdEhlYWRzLmNhdGVnb3JpZXMud29ya0l0ZW1zLnJhdGVBbmFseXNpc0lkJzogd29ya0l0ZW1JZH19LFxyXG4gICAgICAgIHskcHJvamVjdDogeydjb3N0SGVhZHMuY2F0ZWdvcmllcy53b3JrSXRlbXMucXVhbnRpdHknOiAxfX0sXHJcbiAgICAgIF07XHJcblxyXG4gICAgICB0aGlzLmJ1aWxkaW5nUmVwb3NpdG9yeS5hZ2dyZWdhdGUocXVlcnksIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmIChyZXN1bHQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBsZXQgcXVhbnRpdHk9IHJlc3VsdFswXS5jb3N0SGVhZHMuY2F0ZWdvcmllcy53b3JrSXRlbXMucXVhbnRpdHk7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUXVhbnRpdHlEZXRhaWxzKHF1YW50aXR5LCBxdWFudGl0eURldGFpbHNPYmopO1xyXG5cclxuICAgICAgICAgICAgbGV0IHF1ZXJ5ID0ge19pZDogYnVpbGRpbmdJZH07XHJcbiAgICAgICAgICAgIGxldCB1cGRhdGVRdWVyeSA9IHskc2V0OnsnY29zdEhlYWRzLiRbY29zdEhlYWRdLmNhdGVnb3JpZXMuJFtjYXRlZ29yeV0ud29ya0l0ZW1zLiRbd29ya0l0ZW1dLnF1YW50aXR5JzpxdWFudGl0eX19O1xyXG4gICAgICAgICAgICBsZXQgYXJyYXlGaWx0ZXIgPSBbXHJcbiAgICAgICAgICAgICAgeydjb3N0SGVhZC5yYXRlQW5hbHlzaXNJZCc6Y29zdEhlYWRJZH0sXHJcbiAgICAgICAgICAgICAgeydjYXRlZ29yeS5yYXRlQW5hbHlzaXNJZCc6IGNhdGVnb3J5SWR9LFxyXG4gICAgICAgICAgICAgIHsnd29ya0l0ZW0ucmF0ZUFuYWx5c2lzSWQnOndvcmtJdGVtSWR9XHJcbiAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIHVwZGF0ZVF1ZXJ5LCB7YXJyYXlGaWx0ZXJzOmFycmF5RmlsdGVyLCBuZXc6IHRydWV9LCAoZXJyb3IsIGJ1aWxkaW5nKSA9PiB7XHJcbiAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZmluZE9uZUFuZFVwZGF0ZSBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGE6IHF1YW50aXR5RGV0YWlsc09iaiwgc3RhdHVzIDonc3VjY2VzcycsIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgZXJyb3IgPSBuZXcgRXJyb3IoKTtcclxuICAgICAgICAgICAgZXJyb3IubWVzc2FnZSA9IG1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9SRVNQT05TRTtcclxuICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gIHVwZGF0ZVF1YW50aXR5RGV0YWlscyhxdWFudGl0eTogUXVhbnRpdHksIHF1YW50aXR5RGV0YWlsc09iajogUXVhbnRpdHlEZXRhaWxzKSB7XHJcbiAgICBxdWFudGl0eS5pc0VzdGltYXRlZCA9IHRydWU7XHJcbiAgICBxdWFudGl0eS5pc0RpcmVjdFF1YW50aXR5ID0gZmFsc2U7XHJcbiAgICBsZXQgcXVhbnRpdHlEZXRhaWxzID0gcXVhbnRpdHkucXVhbnRpdHlJdGVtRGV0YWlscztcclxuICAgIGxldCBjdXJyZW50X2RhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgbGV0IG5ld1F1YW50aXR5SWQgPSBjdXJyZW50X2RhdGUuZ2V0VVRDTWlsbGlzZWNvbmRzKCk7XHJcblxyXG4gICAgaWYgKHF1YW50aXR5RGV0YWlscy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICBxdWFudGl0eURldGFpbHNPYmouaWQgPSBuZXdRdWFudGl0eUlkO1xyXG4gICAgICAgIHF1YW50aXR5RGV0YWlsc09iai5pc0RpcmVjdFF1YW50aXR5ID0gZmFsc2U7XHJcbiAgICAgICAgcXVhbnRpdHlEZXRhaWxzLnB1c2gocXVhbnRpdHlEZXRhaWxzT2JqKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGxldCBpc0RlZmF1bHRFeGlzdHNTUUwgPSAnU0VMRUNUIG5hbWUgZnJvbSA/IEFTIHF1YW50aXR5RGV0YWlscyB3aGVyZSBxdWFudGl0eURldGFpbHMubmFtZT1cImRlZmF1bHRcIic7XHJcbiAgICAgIGxldCBpc0RlZmF1bHRFeGlzdHNRdWFudGl0eURldGFpbCA9IGFsYXNxbChpc0RlZmF1bHRFeGlzdHNTUUwsIFtxdWFudGl0eURldGFpbHNdKTtcclxuXHJcbiAgICAgIGlmIChpc0RlZmF1bHRFeGlzdHNRdWFudGl0eURldGFpbC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgcXVhbnRpdHkucXVhbnRpdHlJdGVtRGV0YWlscyA9IFtdO1xyXG4gICAgICAgIHF1YW50aXR5RGV0YWlsc09iai5pZCA9IG5ld1F1YW50aXR5SWQ7XHJcbiAgICAgICAgcXVhbnRpdHlEZXRhaWxzT2JqLmlzRGlyZWN0UXVhbnRpdHkgPSBmYWxzZTtcclxuICAgICAgICBxdWFudGl0eS5xdWFudGl0eUl0ZW1EZXRhaWxzLnB1c2gocXVhbnRpdHlEZXRhaWxzT2JqKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAocXVhbnRpdHlEZXRhaWxzT2JqLm5hbWUgIT09ICdkZWZhdWx0Jykge1xyXG4gICAgICAgICAgbGV0IGlzSXRlbUFscmVhZHlFeGlzdFNRTCA9ICdTRUxFQ1QgaWQgZnJvbSA/IEFTIHF1YW50aXR5RGV0YWlscyB3aGVyZSBxdWFudGl0eURldGFpbHMuaWQ9JyArIHF1YW50aXR5RGV0YWlsc09iai5pZCArICcnO1xyXG4gICAgICAgICAgbGV0IGlzSXRlbUFscmVhZHlFeGlzdHMgPSBhbGFzcWwoaXNJdGVtQWxyZWFkeUV4aXN0U1FMLCBbcXVhbnRpdHlEZXRhaWxzXSk7XHJcblxyXG4gICAgICAgICAgaWYgKGlzSXRlbUFscmVhZHlFeGlzdHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBxdWFudGl0eUluZGV4ID0gMDsgcXVhbnRpdHlJbmRleCA8IHF1YW50aXR5RGV0YWlscy5sZW5ndGg7IHF1YW50aXR5SW5kZXgrKykge1xyXG4gICAgICAgICAgICAgIGlmIChxdWFudGl0eURldGFpbHNbcXVhbnRpdHlJbmRleF0uaWQgPT09IHF1YW50aXR5RGV0YWlsc09iai5pZCkge1xyXG4gICAgICAgICAgICAgICAgcXVhbnRpdHlEZXRhaWxzW3F1YW50aXR5SW5kZXhdLm5hbWUgPSBxdWFudGl0eURldGFpbHNPYmoubmFtZTtcclxuICAgICAgICAgICAgICAgIGlmKCBxdWFudGl0eURldGFpbHNPYmoucXVhbnRpdHlJdGVtcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgcXVhbnRpdHlEZXRhaWxzW3F1YW50aXR5SW5kZXhdLnF1YW50aXR5SXRlbXMgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgcXVhbnRpdHlEZXRhaWxzW3F1YW50aXR5SW5kZXhdLmlzRGlyZWN0UXVhbnRpdHkgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgcXVhbnRpdHlEZXRhaWxzW3F1YW50aXR5SW5kZXhdLnF1YW50aXR5SXRlbXMgPSBxdWFudGl0eURldGFpbHNPYmoucXVhbnRpdHlJdGVtcztcclxuICAgICAgICAgICAgICAgICAgcXVhbnRpdHlEZXRhaWxzW3F1YW50aXR5SW5kZXhdLmlzRGlyZWN0UXVhbnRpdHkgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHF1YW50aXR5RGV0YWlsc1txdWFudGl0eUluZGV4XS50b3RhbCA9IHF1YW50aXR5RGV0YWlsc09iai50b3RhbDtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHF1YW50aXR5RGV0YWlsc09iai5pZCA9IG5ld1F1YW50aXR5SWQ7XHJcbiAgICAgICAgICAgIHF1YW50aXR5RGV0YWlsc09iai5pc0RpcmVjdFF1YW50aXR5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHF1YW50aXR5LnF1YW50aXR5SXRlbURldGFpbHMucHVzaChxdWFudGl0eURldGFpbHNPYmopO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdXBkYXRlUXVhbnRpdHlJdGVtc09mV29ya0l0ZW0ocXVhbnRpdHk6IFF1YW50aXR5LCBxdWFudGl0eURldGFpbDogUXVhbnRpdHlEZXRhaWxzKSB7XHJcblxyXG4gICAgcXVhbnRpdHkuaXNFc3RpbWF0ZWQgPSB0cnVlO1xyXG4gICAgbGV0IGN1cnJlbnRfZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICBsZXQgcXVhbnRpdHlJZCA9IGN1cnJlbnRfZGF0ZS5nZXRVVENNaWxsaXNlY29uZHMoKTtcclxuXHJcbiAgICBpZiAocXVhbnRpdHkucXVhbnRpdHlJdGVtRGV0YWlscy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICBpZihxdWFudGl0eURldGFpbC5pZCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICBxdWFudGl0eURldGFpbC5pZCA9IHF1YW50aXR5SWQ7XHJcbiAgICAgICAgICBxdWFudGl0eURldGFpbC50b3RhbCA9IGFsYXNxbCgnVkFMVUUgT0YgU0VMRUNUIFJPVU5EKFNVTShxdWFudGl0eSksMikgRlJPTSA/JywgW3F1YW50aXR5RGV0YWlsLnF1YW50aXR5SXRlbXNdKTtcclxuICAgICAgICAgIHF1YW50aXR5LnF1YW50aXR5SXRlbURldGFpbHMucHVzaChxdWFudGl0eURldGFpbCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHF1YW50aXR5RGV0YWlsLnRvdGFsID0gYWxhc3FsKCdWQUxVRSBPRiBTRUxFQ1QgUk9VTkQoU1VNKHF1YW50aXR5KSwyKSBGUk9NID8nLCBbcXVhbnRpdHlEZXRhaWwucXVhbnRpdHlJdGVtc10pO1xyXG4gICAgICAgICAgcXVhbnRpdHkucXVhbnRpdHlJdGVtRGV0YWlscy5wdXNoKHF1YW50aXR5RGV0YWlsKTtcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgbGV0IGlzRGVmYXVsdEV4aXN0c1NRTCA9ICdTRUxFQ1QgbmFtZSBmcm9tID8gQVMgcXVhbnRpdHlEZXRhaWxzIHdoZXJlIHF1YW50aXR5RGV0YWlscy5uYW1lPVwiZGVmYXVsdFwiJztcclxuICAgICAgbGV0IGlzRGVmYXVsdEV4aXN0c1F1YW50aXR5RGV0YWlsID0gYWxhc3FsKGlzRGVmYXVsdEV4aXN0c1NRTCwgW3F1YW50aXR5LnF1YW50aXR5SXRlbURldGFpbHNdKTtcclxuXHJcbiAgICAgIGlmIChpc0RlZmF1bHRFeGlzdHNRdWFudGl0eURldGFpbC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgcXVhbnRpdHlEZXRhaWwuaWQgPSBxdWFudGl0eUlkO1xyXG4gICAgICAgIHF1YW50aXR5LnF1YW50aXR5SXRlbURldGFpbHMgPSBbXTtcclxuICAgICAgICBxdWFudGl0eURldGFpbC50b3RhbCA9IGFsYXNxbCgnVkFMVUUgT0YgU0VMRUNUIFJPVU5EKFNVTShxdWFudGl0eSksMikgRlJPTSA/JywgW3F1YW50aXR5RGV0YWlsLnF1YW50aXR5SXRlbXNdKTtcclxuICAgICAgICBxdWFudGl0eS5xdWFudGl0eUl0ZW1EZXRhaWxzLnB1c2gocXVhbnRpdHlEZXRhaWwpO1xyXG5cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAocXVhbnRpdHlEZXRhaWwubmFtZSAhPT0gJ2RlZmF1bHQnKSB7XHJcbiAgICAgICAgICBsZXQgaXNJdGVtQWxyZWFkeUV4aXN0U1FMID0gJ1NFTEVDVCBpZCBmcm9tID8gQVMgcXVhbnRpdHlEZXRhaWxzIHdoZXJlIHF1YW50aXR5RGV0YWlscy5pZD1cIicgKyBxdWFudGl0eURldGFpbC5pZCArICdcIic7XHJcbiAgICAgICAgICBsZXQgaXNJdGVtQWxyZWFkeUV4aXN0cyA9IGFsYXNxbChpc0l0ZW1BbHJlYWR5RXhpc3RTUUwsIFtxdWFudGl0eS5xdWFudGl0eUl0ZW1EZXRhaWxzXSk7XHJcblxyXG4gICAgICAgICAgaWYgKGlzSXRlbUFscmVhZHlFeGlzdHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBxdWFudGl0eUluZGV4ID0gMDsgcXVhbnRpdHlJbmRleCA8IHF1YW50aXR5LnF1YW50aXR5SXRlbURldGFpbHMubGVuZ3RoOyBxdWFudGl0eUluZGV4KyspIHtcclxuICAgICAgICAgICAgICBpZiAocXVhbnRpdHkucXVhbnRpdHlJdGVtRGV0YWlsc1txdWFudGl0eUluZGV4XS5pZCA9PT0gcXVhbnRpdHlEZXRhaWwuaWQpIHtcclxuICAgICAgICAgICAgICAgIHF1YW50aXR5LnF1YW50aXR5SXRlbURldGFpbHNbcXVhbnRpdHlJbmRleF0uaXNEaXJlY3RRdWFudGl0eSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgcXVhbnRpdHkucXVhbnRpdHlJdGVtRGV0YWlsc1txdWFudGl0eUluZGV4XS5xdWFudGl0eUl0ZW1zID0gcXVhbnRpdHlEZXRhaWwucXVhbnRpdHlJdGVtcztcclxuICAgICAgICAgICAgICAgIHF1YW50aXR5LnF1YW50aXR5SXRlbURldGFpbHNbcXVhbnRpdHlJbmRleF0udG90YWwgPSBhbGFzcWwoJ1ZBTFVFIE9GIFNFTEVDVCBST1VORChTVU0ocXVhbnRpdHkpLDIpIEZST00gPycsXHJcbiAgICAgICAgICAgICAgICAgIFtxdWFudGl0eURldGFpbC5xdWFudGl0eUl0ZW1zXSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYocXVhbnRpdHlEZXRhaWwuaWQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgcXVhbnRpdHlEZXRhaWwuaWQgPSBxdWFudGl0eUlkO1xyXG4gICAgICAgICAgICAgICAgcXVhbnRpdHlEZXRhaWwuaXNEaXJlY3RRdWFudGl0eSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgcXVhbnRpdHlEZXRhaWwudG90YWwgPSBhbGFzcWwoJ1ZBTFVFIE9GIFNFTEVDVCBST1VORChTVU0ocXVhbnRpdHkpLDIpIEZST00gPycsIFtxdWFudGl0eURldGFpbC5xdWFudGl0eUl0ZW1zXSk7XHJcbiAgICAgICAgICAgICAgICBxdWFudGl0eS5xdWFudGl0eUl0ZW1EZXRhaWxzLnB1c2gocXVhbnRpdHlEZXRhaWwpO1xyXG5cclxuICAgICAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICAgIGZvciAobGV0IHF1YW50aXR5SW5kZXggPSAwOyBxdWFudGl0eUluZGV4IDwgcXVhbnRpdHkucXVhbnRpdHlJdGVtRGV0YWlscy5sZW5ndGg7IHF1YW50aXR5SW5kZXgrKykge1xyXG4gICAgICAgICAgICAgICAgICBpZiAocXVhbnRpdHkucXVhbnRpdHlJdGVtRGV0YWlsc1txdWFudGl0eUluZGV4XS5pZCA9PT0gcXVhbnRpdHlEZXRhaWwuaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBxdWFudGl0eS5xdWFudGl0eUl0ZW1EZXRhaWxzW3F1YW50aXR5SW5kZXhdLm5hbWUgPSBxdWFudGl0eURldGFpbC5uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIHF1YW50aXR5LnF1YW50aXR5SXRlbURldGFpbHNbcXVhbnRpdHlJbmRleF0uaXNEaXJlY3RRdWFudGl0eSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHF1YW50aXR5LnF1YW50aXR5SXRlbURldGFpbHNbcXVhbnRpdHlJbmRleF0ucXVhbnRpdHlJdGVtcyA9IHF1YW50aXR5RGV0YWlsLnF1YW50aXR5SXRlbXM7XHJcbiAgICAgICAgICAgICAgICAgICAgcXVhbnRpdHkucXVhbnRpdHlJdGVtRGV0YWlsc1txdWFudGl0eUluZGV4XS50b3RhbCA9IGFsYXNxbCgnVkFMVUUgT0YgU0VMRUNUIFJPVU5EKFNVTShxdWFudGl0eSksMikgRlJPTSA/JyxcclxuICAgICAgICAgICAgICAgICAgICAgIFtxdWFudGl0eURldGFpbC5xdWFudGl0eUl0ZW1zXSk7XHJcbiAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBxdWFudGl0eS5xdWFudGl0eUl0ZW1EZXRhaWxzID0gW107XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygncXVhbnRpdHkgOiAnK0pTT04uc3RyaW5naWZ5KHF1YW50aXR5KSk7XHJcbiAgICAgICAgICBxdWFudGl0eURldGFpbC5pZCA9IHF1YW50aXR5SWQ7XHJcbiAgICAgICAgICBxdWFudGl0eURldGFpbC50b3RhbCA9IGFsYXNxbCgnVkFMVUUgT0YgU0VMRUNUIFJPVU5EKFNVTShxdWFudGl0eSksMikgRlJPTSA/JywgW3F1YW50aXR5RGV0YWlsLnF1YW50aXR5SXRlbXNdKTtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKHF1YW50aXR5LnF1YW50aXR5SXRlbURldGFpbHMpO1xyXG4gICAgICAgICAgcXVhbnRpdHkucXVhbnRpdHlJdGVtRGV0YWlscy5wdXNoKHF1YW50aXR5RGV0YWlsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHF1YW50aXR5LnRvdGFsID0gYWxhc3FsKCdWQUxVRSBPRiBTRUxFQ1QgUk9VTkQoU1VNKHRvdGFsKSwyKSBGUk9NID8nLCBbcXVhbnRpdHkucXVhbnRpdHlJdGVtRGV0YWlsc10pO1xyXG4gIH1cclxuXHJcbi8vVXBkYXRlIFF1YW50aXR5IE9mIFByb2plY3QgQ29zdCBIZWFkc1xyXG4gIHVwZGF0ZVF1YW50aXR5T2ZQcm9qZWN0Q29zdEhlYWRzKHByb2plY3RJZDogc3RyaW5nLCBjb3N0SGVhZElkOiBudW1iZXIsIGNhdGVnb3J5SWQ6IG51bWJlciwgd29ya0l0ZW1JZDogbnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5RGV0YWlsczogUXVhbnRpdHlEZXRhaWxzLCB1c2VyOiBVc2VyLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBVcGRhdGUgUXVhbnRpdHkgT2YgUHJvamVjdCBDb3N0IEhlYWRzIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgbGV0IHF1ZXJ5ID0ge19pZDogcHJvamVjdElkfTtcclxuICAgIGxldCBwcm9qZWN0aW9uID0ge3Byb2plY3RDb3N0SGVhZHM6e1xyXG4gICAgICAgICRlbGVtTWF0Y2ggOntyYXRlQW5hbHlzaXNJZCA6IGNvc3RIZWFkSWQsIGNhdGVnb3JpZXM6IHtcclxuICAgICAgICAgICAgJGVsZW1NYXRjaDp7cmF0ZUFuYWx5c2lzSWQ6IGNhdGVnb3J5SWQsd29ya0l0ZW1zOiB7XHJcbiAgICAgICAgICAgICAgICAkZWxlbU1hdGNoOiB7cmF0ZUFuYWx5c2lzSWQ6d29ya0l0ZW1JZH19fX19fX1cclxuICAgIHRoaXMucHJvamVjdFJlcG9zaXRvcnkucmV0cmlldmVXaXRoUHJvamVjdGlvbihxdWVyeSwgcHJvamVjdGlvbiwgKGVycm9yLCBwcm9qZWN0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgY29zdEhlYWRMaXN0ID0gcHJvamVjdFswXS5wcm9qZWN0Q29zdEhlYWRzO1xyXG4gICAgICAgIGxldCBxdWFudGl0eSAgOiBRdWFudGl0eTtcclxuICAgICAgICBmb3IgKGxldCBjb3N0SGVhZCBvZiBjb3N0SGVhZExpc3QpIHtcclxuICAgICAgICAgIGlmIChjb3N0SGVhZElkID09PSBjb3N0SGVhZC5yYXRlQW5hbHlzaXNJZCkge1xyXG4gICAgICAgICAgICBsZXQgY2F0ZWdvcmllc09mQ29zdEhlYWQgPSBjb3N0SGVhZC5jYXRlZ29yaWVzO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBjYXRlZ29yeURhdGEgb2YgY2F0ZWdvcmllc09mQ29zdEhlYWQpIHtcclxuICAgICAgICAgICAgICBpZiAoY2F0ZWdvcnlJZCA9PT0gY2F0ZWdvcnlEYXRhLnJhdGVBbmFseXNpc0lkKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgd29ya0l0ZW1zT2ZDYXRlZ29yeSA9IGNhdGVnb3J5RGF0YS53b3JrSXRlbXM7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB3b3JrSXRlbURhdGEgb2Ygd29ya0l0ZW1zT2ZDYXRlZ29yeSkge1xyXG4gICAgICAgICAgICAgICAgICBpZiAod29ya0l0ZW1JZCA9PT0gd29ya0l0ZW1EYXRhLnJhdGVBbmFseXNpc0lkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcXVhbnRpdHkgPSB3b3JrSXRlbURhdGEucXVhbnRpdHk7XHJcbiAgICAgICAgICAgICAgICAgICAgcXVhbnRpdHkuaXNFc3RpbWF0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlUXVhbnRpdHlJdGVtc09mV29ya0l0ZW0oIHF1YW50aXR5LCBxdWFudGl0eURldGFpbHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBxdWVyeSA9IHtfaWQ6IHByb2plY3RJZH07XHJcbiAgICAgICAgbGV0IHVwZGF0ZVF1ZXJ5ID0geyRzZXQ6eydwcm9qZWN0Q29zdEhlYWRzLiRbY29zdEhlYWRdLmNhdGVnb3JpZXMuJFtjYXRlZ29yeV0ud29ya0l0ZW1zLiRbd29ya0l0ZW1dLnF1YW50aXR5JzpxdWFudGl0eX19O1xyXG4gICAgICAgIGxldCBhcnJheUZpbHRlciA9IFtcclxuICAgICAgICAgIHsnY29zdEhlYWQucmF0ZUFuYWx5c2lzSWQnOmNvc3RIZWFkSWR9LFxyXG4gICAgICAgICAgeydjYXRlZ29yeS5yYXRlQW5hbHlzaXNJZCc6IGNhdGVnb3J5SWR9LFxyXG4gICAgICAgICAgeyd3b3JrSXRlbS5yYXRlQW5hbHlzaXNJZCc6d29ya0l0ZW1JZH1cclxuICAgICAgICBdO1xyXG4gICAgICAgIHRoaXMucHJvamVjdFJlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgdXBkYXRlUXVlcnksIHthcnJheUZpbHRlcnM6YXJyYXlGaWx0ZXIsIG5ldzogdHJ1ZX0sIChlcnJvciwgcHJvamVjdCkgPT4ge1xyXG4gICAgICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZmluZE9uZUFuZFVwZGF0ZSBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTogJ3N1Y2Nlc3MnLCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy9HZXQgSW4tQWN0aXZlIENhdGVnb3JpZXMgRnJvbSBEYXRhYmFzZVxyXG4gIGdldEluQWN0aXZlQ2F0ZWdvcmllc0J5Q29zdEhlYWRJZChwcm9qZWN0SWQ6IHN0cmluZywgYnVpbGRpbmdJZDogc3RyaW5nLCBjb3N0SGVhZElkOiBzdHJpbmcsIHVzZXI6IFVzZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuXHJcbiAgICB0aGlzLmJ1aWxkaW5nUmVwb3NpdG9yeS5maW5kQnlJZChidWlsZGluZ0lkLCAoZXJyb3IsIGJ1aWxkaW5nKSA9PiB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIEdldCBJbi1BY3RpdmUgQ2F0ZWdvcmllcyBCeSBDb3N0IEhlYWQgSWQgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgY29zdEhlYWRzID0gYnVpbGRpbmcuY29zdEhlYWRzO1xyXG4gICAgICAgIGxldCBjYXRlZ29yaWVzOiBBcnJheTxDYXRlZ29yeT4gPSBuZXcgQXJyYXk8Q2F0ZWdvcnk+KCk7XHJcbiAgICAgICAgZm9yIChsZXQgY29zdEhlYWRJbmRleCA9IDA7IGNvc3RIZWFkSW5kZXggPCBjb3N0SGVhZHMubGVuZ3RoOyBjb3N0SGVhZEluZGV4KyspIHtcclxuICAgICAgICAgIGlmIChwYXJzZUludChjb3N0SGVhZElkKSA9PT0gY29zdEhlYWRzW2Nvc3RIZWFkSW5kZXhdLnJhdGVBbmFseXNpc0lkKSB7XHJcbiAgICAgICAgICAgIGxldCBjYXRlZ29yaWVzTGlzdCA9IGNvc3RIZWFkc1tjb3N0SGVhZEluZGV4XS5jYXRlZ29yaWVzO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBjYXRlZ29yeUluZGV4ID0gMDsgY2F0ZWdvcnlJbmRleCA8IGNhdGVnb3JpZXNMaXN0Lmxlbmd0aDsgY2F0ZWdvcnlJbmRleCsrKSB7XHJcbiAgICAgICAgICAgICAgaWYgKGNhdGVnb3JpZXNMaXN0W2NhdGVnb3J5SW5kZXhdLmFjdGl2ZSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIGNhdGVnb3JpZXMucHVzaChjYXRlZ29yaWVzTGlzdFtjYXRlZ29yeUluZGV4XSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiBjYXRlZ29yaWVzLCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0V29ya0l0ZW1MaXN0T2ZCdWlsZGluZ0NhdGVnb3J5KHByb2plY3RJZDogc3RyaW5nLCBidWlsZGluZ0lkOiBzdHJpbmcsIGNvc3RIZWFkSWQ6IG51bWJlciwgY2F0ZWdvcnlJZDogbnVtYmVyLCB1c2VyOiBVc2VyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBnZXRXb3JrSXRlbUxpc3RPZkJ1aWxkaW5nQ2F0ZWdvcnkgaGFzIGJlZW4gaGl0Jyk7XHJcblxyXG4gICAgbGV0IHF1ZXJ5ID0gW1xyXG4gICAgICB7JG1hdGNoOiB7J19pZCc6IE9iamVjdElkKGJ1aWxkaW5nSWQpLCAnY29zdEhlYWRzLnJhdGVBbmFseXNpc0lkJzogY29zdEhlYWRJZH19LFxyXG4gICAgICB7JHVud2luZDogJyRjb3N0SGVhZHMnfSxcclxuICAgICAgeyRwcm9qZWN0OiB7J2Nvc3RIZWFkcyc6IDEsICdyYXRlcyc6IDF9fSxcclxuICAgICAgeyR1bndpbmQ6ICckY29zdEhlYWRzLmNhdGVnb3JpZXMnfSxcclxuICAgICAgeyRtYXRjaDogeydjb3N0SGVhZHMuY2F0ZWdvcmllcy5yYXRlQW5hbHlzaXNJZCc6IGNhdGVnb3J5SWR9fSxcclxuICAgICAgeyRwcm9qZWN0OiB7J2Nvc3RIZWFkcy5jYXRlZ29yaWVzLndvcmtJdGVtcyc6IDEsICdyYXRlcyc6IDF9fVxyXG4gICAgXTtcclxuXHJcbiAgICB0aGlzLmJ1aWxkaW5nUmVwb3NpdG9yeS5hZ2dyZWdhdGUocXVlcnksIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIEdldCB3b3JraXRlbXMgZm9yIHNwZWNpZmljIGNhdGVnb3J5IGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHJlc3VsdC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICBsZXQgd29ya0l0ZW1zT2ZCdWlsZGluZ0NhdGVnb3J5ID0gcmVzdWx0WzBdLmNvc3RIZWFkcy5jYXRlZ29yaWVzLndvcmtJdGVtcztcclxuICAgICAgICAgIGxldCB3b3JrSXRlbXNMaXN0V2l0aEJ1aWxkaW5nUmF0ZXMgPSB0aGlzLmdldFdvcmtJdGVtTGlzdFdpdGhDZW50cmFsaXplZFJhdGVzKHdvcmtJdGVtc09mQnVpbGRpbmdDYXRlZ29yeSwgcmVzdWx0WzBdLnJhdGVzLCB0cnVlKTtcclxuICAgICAgICAgIGxldCB3b3JrSXRlbXNMaXN0QW5kU2hvd0hpZGVBZGRJdGVtQnV0dG9uPSB7XHJcbiAgICAgICAgICAgIHdvcmtJdGVtczp3b3JrSXRlbXNMaXN0V2l0aEJ1aWxkaW5nUmF0ZXMud29ya0l0ZW1zLFxyXG4gICAgICAgICAgICBzaG93SGlkZUFkZEJ1dHRvbjp3b3JrSXRlbXNMaXN0V2l0aEJ1aWxkaW5nUmF0ZXMuc2hvd0hpZGVBZGRJdGVtQnV0dG9uXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgICAgY2FsbGJhY2sobnVsbCwge1xyXG4gICAgICAgICAgICBkYXRhOiB3b3JrSXRlbXNMaXN0QW5kU2hvd0hpZGVBZGRJdGVtQnV0dG9uLFxyXG4gICAgICAgICAgICBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbGV0IGVycm9yID0gbmV3IEVycm9yKCk7XHJcbiAgICAgICAgICBlcnJvci5tZXNzYWdlID0gbWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX1JFU1BPTlNFO1xyXG4gICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRXb3JrSXRlbUxpc3RPZlByb2plY3RDYXRlZ29yeShwcm9qZWN0SWQ6IHN0cmluZywgY29zdEhlYWRJZDogbnVtYmVyLCBjYXRlZ29yeUlkOiBudW1iZXIsIHVzZXI6IFVzZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZ2V0V29ya0l0ZW1MaXN0T2ZQcm9qZWN0Q2F0ZWdvcnkgaGFzIGJlZW4gaGl0Jyk7XHJcblxyXG4gICAgbGV0IHF1ZXJ5ID0gW1xyXG4gICAgICB7JG1hdGNoOiB7J19pZCc6IE9iamVjdElkKHByb2plY3RJZCksICdwcm9qZWN0Q29zdEhlYWRzLnJhdGVBbmFseXNpc0lkJzogY29zdEhlYWRJZH19LFxyXG4gICAgICB7JHVud2luZDogJyRwcm9qZWN0Q29zdEhlYWRzJ30sXHJcbiAgICAgIHskcHJvamVjdDogeydwcm9qZWN0Q29zdEhlYWRzJzogMSwgJ3JhdGVzJzogMX19LFxyXG4gICAgICB7JHVud2luZDogJyRwcm9qZWN0Q29zdEhlYWRzLmNhdGVnb3JpZXMnfSxcclxuICAgICAgeyRtYXRjaDogeydwcm9qZWN0Q29zdEhlYWRzLmNhdGVnb3JpZXMucmF0ZUFuYWx5c2lzSWQnOiBjYXRlZ29yeUlkfX0sXHJcbiAgICAgIHskcHJvamVjdDogeydwcm9qZWN0Q29zdEhlYWRzLmNhdGVnb3JpZXMud29ya0l0ZW1zJzogMSwgJ3JhdGVzJzogMX19XHJcbiAgICBdO1xyXG5cclxuICAgIHRoaXMucHJvamVjdFJlcG9zaXRvcnkuYWdncmVnYXRlKHF1ZXJ5LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBHZXQgd29ya2l0ZW1zIEJ5IENvc3QgSGVhZCAmIGNhdGVnb3J5IElkIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHJlc3VsdC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICBsZXQgd29ya0l0ZW1zT2ZDYXRlZ29yeSA9IHJlc3VsdFswXS5wcm9qZWN0Q29zdEhlYWRzLmNhdGVnb3JpZXMud29ya0l0ZW1zO1xyXG4gICAgICAgICAgbGV0IHdvcmtJdGVtc0xpc3RXaXRoUmF0ZXMgPSB0aGlzLmdldFdvcmtJdGVtTGlzdFdpdGhDZW50cmFsaXplZFJhdGVzKHdvcmtJdGVtc09mQ2F0ZWdvcnksIHJlc3VsdFswXS5yYXRlcywgdHJ1ZSk7XHJcbiAgICAgICAgICBsZXQgd29ya0l0ZW1zTGlzdEFuZFNob3dIaWRlQWRkSXRlbUJ1dHRvbj0ge1xyXG4gICAgICAgICAgICB3b3JrSXRlbXM6d29ya0l0ZW1zTGlzdFdpdGhSYXRlcy53b3JrSXRlbXMsXHJcbiAgICAgICAgICAgIHNob3dIaWRlQWRkQnV0dG9uOndvcmtJdGVtc0xpc3RXaXRoUmF0ZXMuc2hvd0hpZGVBZGRJdGVtQnV0dG9uXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgICAgY2FsbGJhY2sobnVsbCwge1xyXG4gICAgICAgICAgICBkYXRhOiB3b3JrSXRlbXNMaXN0QW5kU2hvd0hpZGVBZGRJdGVtQnV0dG9uLFxyXG4gICAgICAgICAgICBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbGV0IGVycm9yID0gbmV3IEVycm9yKCk7XHJcbiAgICAgICAgICBlcnJvci5tZXNzYWdlID0gbWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX1JFU1BPTlNFO1xyXG4gICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRXb3JrSXRlbUxpc3RXaXRoQ2VudHJhbGl6ZWRSYXRlcyh3b3JrSXRlbXNPZkNhdGVnb3J5OiBBcnJheTxXb3JrSXRlbT4sIGNlbnRyYWxpemVkUmF0ZXM6IEFycmF5PGFueT4sIGlzV29ya0l0ZW1BY3RpdmU6IGJvb2xlYW4pIHtcclxuXHJcbiAgICBsZXQgd29ya0l0ZW1zTGlzdFdpdGhSYXRlczogV29ya0l0ZW1MaXN0V2l0aFJhdGVzRFRPID0gbmV3IFdvcmtJdGVtTGlzdFdpdGhSYXRlc0RUTygpO1xyXG4gICAgZm9yIChsZXQgd29ya0l0ZW1EYXRhIG9mIHdvcmtJdGVtc09mQ2F0ZWdvcnkpIHtcclxuICAgICAgaWYgKHdvcmtJdGVtRGF0YS5hY3RpdmUgPT09IGlzV29ya0l0ZW1BY3RpdmUpIHtcclxuICAgICAgICBsZXQgd29ya0l0ZW06IFdvcmtJdGVtID0gd29ya0l0ZW1EYXRhO1xyXG4gICAgICAgIGxldCByYXRlSXRlbXNPZldvcmtJdGVtID0gd29ya0l0ZW1EYXRhLnJhdGUucmF0ZUl0ZW1zO1xyXG4gICAgICAgIHdvcmtJdGVtLnJhdGUucmF0ZUl0ZW1zID0gdGhpcy5nZXRSYXRlc0Zyb21DZW50cmFsaXplZHJhdGVzKHJhdGVJdGVtc09mV29ya0l0ZW0sIGNlbnRyYWxpemVkUmF0ZXMpO1xyXG5cclxuICAgICAgICBsZXQgYXJyYXlPZlJhdGVJdGVtcyA9IHdvcmtJdGVtLnJhdGUucmF0ZUl0ZW1zO1xyXG4gICAgICAgIGxldCB0b3RhbE9mQWxsUmF0ZUl0ZW1zID0gYWxhc3FsKCdWQUxVRSBPRiBTRUxFQ1QgU1VNKHRvdGFsQW1vdW50KSBGUk9NID8nLCBbYXJyYXlPZlJhdGVJdGVtc10pO1xyXG4gICAgICAgIGlmICghd29ya0l0ZW0uaXNEaXJlY3RSYXRlKSB7XHJcbiAgICAgICAgICB3b3JrSXRlbS5yYXRlLnRvdGFsID0gdG90YWxPZkFsbFJhdGVJdGVtcyAvIHdvcmtJdGVtLnJhdGUucXVhbnRpdHk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBxdWFudGl0eUl0ZW1zID0gd29ya0l0ZW0ucXVhbnRpdHkucXVhbnRpdHlJdGVtRGV0YWlscztcclxuXHJcbiAgICAgICAgaWYgKCF3b3JrSXRlbS5xdWFudGl0eS5pc0RpcmVjdFF1YW50aXR5KSB7XHJcbiAgICAgICAgICB3b3JrSXRlbS5xdWFudGl0eS50b3RhbCA9IGFsYXNxbCgnVkFMVUUgT0YgU0VMRUNUIFJPVU5EKFNVTSh0b3RhbCksMikgRlJPTSA/JywgW3F1YW50aXR5SXRlbXNdKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh3b3JrSXRlbS5yYXRlLmlzRXN0aW1hdGVkICYmIHdvcmtJdGVtLnF1YW50aXR5LmlzRXN0aW1hdGVkKSB7XHJcbiAgICAgICAgICB3b3JrSXRlbS5hbW91bnQgPSB0aGlzLmNvbW1vblNlcnZpY2UuZGVjaW1hbENvbnZlcnNpb24od29ya0l0ZW0ucmF0ZS50b3RhbCAqIHdvcmtJdGVtLnF1YW50aXR5LnRvdGFsKTtcclxuICAgICAgICAgIHdvcmtJdGVtc0xpc3RXaXRoUmF0ZXMud29ya0l0ZW1zQW1vdW50ID0gd29ya0l0ZW1zTGlzdFdpdGhSYXRlcy53b3JrSXRlbXNBbW91bnQgKyB3b3JrSXRlbS5hbW91bnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdvcmtJdGVtc0xpc3RXaXRoUmF0ZXMud29ya0l0ZW1zLnB1c2god29ya0l0ZW0pO1xyXG4gICAgICB9ZWxzZSB7XHJcbiAgICAgICAgd29ya0l0ZW1zTGlzdFdpdGhSYXRlcy5zaG93SGlkZUFkZEl0ZW1CdXR0b249ZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB3b3JrSXRlbXNMaXN0V2l0aFJhdGVzO1xyXG4gIH1cclxuXHJcbiAgZ2V0UmF0ZXNGcm9tQ2VudHJhbGl6ZWRyYXRlcyhyYXRlSXRlbXNPZldvcmtJdGVtOiBBcnJheTxSYXRlSXRlbT4sIGNlbnRyYWxpemVkUmF0ZXM6IEFycmF5PGFueT4pIHtcclxuICAgIGxldCByYXRlSXRlbXNTUUwgPSAnU0VMRUNUIHJhdGVJdGVtLml0ZW1OYW1lLCByYXRlSXRlbS5vcmlnaW5hbEl0ZW1OYW1lLCByYXRlSXRlbS5yYXRlQW5hbHlzaXNJZCwgcmF0ZUl0ZW0udHlwZSwnICtcclxuICAgICAgJ3JhdGVJdGVtLnF1YW50aXR5LCBjZW50cmFsaXplZFJhdGVzLnJhdGUsIHJhdGVJdGVtLnVuaXQsIHJhdGVJdGVtLnRvdGFsQW1vdW50LCByYXRlSXRlbS50b3RhbFF1YW50aXR5ICcgK1xyXG4gICAgICAnRlJPTSA/IEFTIHJhdGVJdGVtIEpPSU4gPyBBUyBjZW50cmFsaXplZFJhdGVzIE9OIHJhdGVJdGVtLml0ZW1OYW1lID0gY2VudHJhbGl6ZWRSYXRlcy5pdGVtTmFtZSc7XHJcbiAgICBsZXQgcmF0ZUl0ZW1zRm9yV29ya0l0ZW0gPSBhbGFzcWwocmF0ZUl0ZW1zU1FMLCBbcmF0ZUl0ZW1zT2ZXb3JrSXRlbSwgY2VudHJhbGl6ZWRSYXRlc10pO1xyXG4gICAgcmV0dXJuIHJhdGVJdGVtc0ZvcldvcmtJdGVtO1xyXG4gIH1cclxuXHJcbiAgYWRkV29ya2l0ZW0ocHJvamVjdElkOiBzdHJpbmcsIGJ1aWxkaW5nSWQ6IHN0cmluZywgY29zdEhlYWRJZDogbnVtYmVyLCBjYXRlZ29yeUlkOiBudW1iZXIsIHdvcmtJdGVtOiBXb3JrSXRlbSxcclxuICAgICAgICAgICAgICB1c2VyOiBVc2VyLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBhZGRXb3JraXRlbSBoYXMgYmVlbiBoaXQnKTtcclxuICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmZpbmRCeUlkKGJ1aWxkaW5nSWQsIChlcnJvciwgYnVpbGRpbmc6IEJ1aWxkaW5nKSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgcmVzcG9uc2VXb3JraXRlbTogQXJyYXk8V29ya0l0ZW0+ID0gbnVsbDtcclxuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGJ1aWxkaW5nLmNvc3RIZWFkcy5sZW5ndGggPiBpbmRleDsgaW5kZXgrKykge1xyXG4gICAgICAgICAgaWYgKGJ1aWxkaW5nLmNvc3RIZWFkc1tpbmRleF0ucmF0ZUFuYWx5c2lzSWQgPT09IGNvc3RIZWFkSWQpIHtcclxuICAgICAgICAgICAgbGV0IGNhdGVnb3J5ID0gYnVpbGRpbmcuY29zdEhlYWRzW2luZGV4XS5jYXRlZ29yaWVzO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBjYXRlZ29yeUluZGV4ID0gMDsgY2F0ZWdvcnkubGVuZ3RoID4gY2F0ZWdvcnlJbmRleDsgY2F0ZWdvcnlJbmRleCsrKSB7XHJcbiAgICAgICAgICAgICAgaWYgKGNhdGVnb3J5W2NhdGVnb3J5SW5kZXhdLnJhdGVBbmFseXNpc0lkID09PSBjYXRlZ29yeUlkKSB7XHJcbiAgICAgICAgICAgICAgICBjYXRlZ29yeVtjYXRlZ29yeUluZGV4XS53b3JrSXRlbXMucHVzaCh3b3JrSXRlbSk7XHJcbiAgICAgICAgICAgICAgICByZXNwb25zZVdvcmtpdGVtID0gY2F0ZWdvcnlbY2F0ZWdvcnlJbmRleF0ud29ya0l0ZW1zO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgcXVlcnkgPSB7X2lkOiBidWlsZGluZ0lkfTtcclxuICAgICAgICAgICAgbGV0IG5ld0RhdGEgPSB7JHNldDogeydjb3N0SGVhZHMnOiBidWlsZGluZy5jb3N0SGVhZHN9fTtcclxuICAgICAgICAgICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgbmV3RGF0YSwge25ldzogdHJ1ZX0sIChlcnJvciwgYnVpbGRpbmcpID0+IHtcclxuICAgICAgICAgICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kT25lQW5kVXBkYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTogcmVzcG9uc2VXb3JraXRlbSwgYWNjZXNzX3Rva2VuOiB0aGlzLmF1dGhJbnRlcmNlcHRvci5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKX0pO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGFkZENhdGVnb3J5QnlDb3N0SGVhZElkKHByb2plY3RJZDogc3RyaW5nLCBidWlsZGluZ0lkOiBzdHJpbmcsIGNvc3RIZWFkSWQ6IHN0cmluZywgY2F0ZWdvcnlEZXRhaWxzOiBhbnksIHVzZXI6IFVzZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG5cclxuICAgIGxldCBjYXRlZ29yeU9iajogQ2F0ZWdvcnkgPSBuZXcgQ2F0ZWdvcnkoY2F0ZWdvcnlEZXRhaWxzLmNhdGVnb3J5LCBjYXRlZ29yeURldGFpbHMuY2F0ZWdvcnlJZCk7XHJcblxyXG4gICAgbGV0IHF1ZXJ5ID0geydfaWQnOiBidWlsZGluZ0lkLCAnY29zdEhlYWRzLnJhdGVBbmFseXNpc0lkJzogcGFyc2VJbnQoY29zdEhlYWRJZCl9O1xyXG4gICAgbGV0IG5ld0RhdGEgPSB7JHB1c2g6IHsnY29zdEhlYWRzLiQuY2F0ZWdvcmllcyc6IGNhdGVnb3J5T2JqfX07XHJcblxyXG4gICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgbmV3RGF0YSwge25ldzogdHJ1ZX0sIChlcnJvciwgYnVpbGRpbmcpID0+IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgYWRkQ2F0ZWdvcnlCeUNvc3RIZWFkSWQgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTogYnVpbGRpbmcsIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvL1VwZGF0ZSBzdGF0dXMgKCB0cnVlL2ZhbHNlICkgb2YgY2F0ZWdvcnlcclxuICB1cGRhdGVDYXRlZ29yeVN0YXR1cyhwcm9qZWN0SWQ6IHN0cmluZywgYnVpbGRpbmdJZDogc3RyaW5nLCBjb3N0SGVhZElkOiBudW1iZXIsIGNhdGVnb3J5SWQ6IG51bWJlcixcclxuICAgICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeUFjdGl2ZVN0YXR1czogYm9vbGVhbiwgdXNlcjogVXNlciwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG5cclxuICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmZpbmRCeUlkKGJ1aWxkaW5nSWQsIChlcnJvciwgYnVpbGRpbmc6IEJ1aWxkaW5nKSA9PiB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIHVwZGF0ZSBDYXRlZ29yeSBTdGF0dXMgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgY29zdEhlYWRzID0gYnVpbGRpbmcuY29zdEhlYWRzO1xyXG4gICAgICAgIGxldCBjYXRlZ29yaWVzOiBBcnJheTxDYXRlZ29yeT4gPSBuZXcgQXJyYXk8Q2F0ZWdvcnk+KCk7XHJcbiAgICAgICAgbGV0IHVwZGF0ZWRDYXRlZ29yaWVzOiBBcnJheTxDYXRlZ29yeT4gPSBuZXcgQXJyYXk8Q2F0ZWdvcnk+KCk7XHJcbiAgICAgICAgbGV0IGluZGV4OiBudW1iZXI7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGNvc3RIZWFkSW5kZXggPSAwOyBjb3N0SGVhZEluZGV4IDwgY29zdEhlYWRzLmxlbmd0aDsgY29zdEhlYWRJbmRleCsrKSB7XHJcbiAgICAgICAgICBpZiAoY29zdEhlYWRJZCA9PT0gY29zdEhlYWRzW2Nvc3RIZWFkSW5kZXhdLnJhdGVBbmFseXNpc0lkKSB7XHJcbiAgICAgICAgICAgIGNhdGVnb3JpZXMgPSBjb3N0SGVhZHNbY29zdEhlYWRJbmRleF0uY2F0ZWdvcmllcztcclxuICAgICAgICAgICAgZm9yIChsZXQgY2F0ZWdvcnlJbmRleCA9IDA7IGNhdGVnb3J5SW5kZXggPCBjYXRlZ29yaWVzLmxlbmd0aDsgY2F0ZWdvcnlJbmRleCsrKSB7XHJcbiAgICAgICAgICAgICAgaWYgKGNhdGVnb3JpZXNbY2F0ZWdvcnlJbmRleF0ucmF0ZUFuYWx5c2lzSWQgPT09IGNhdGVnb3J5SWQpIHtcclxuICAgICAgICAgICAgICAgIGNhdGVnb3JpZXNbY2F0ZWdvcnlJbmRleF0uYWN0aXZlID0gY2F0ZWdvcnlBY3RpdmVTdGF0dXM7XHJcbiAgICAgICAgICAgICAgICB1cGRhdGVkQ2F0ZWdvcmllcy5wdXNoKGNhdGVnb3JpZXNbY2F0ZWdvcnlJbmRleF0pO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHF1ZXJ5ID0geydfaWQnOiBidWlsZGluZ0lkLCAnY29zdEhlYWRzLnJhdGVBbmFseXNpc0lkJzogY29zdEhlYWRJZH07XHJcbiAgICAgICAgbGV0IG5ld0RhdGEgPSB7JyRzZXQnOiB7J2Nvc3RIZWFkcy4kLmNhdGVnb3JpZXMnOiBjYXRlZ29yaWVzfX07XHJcblxyXG4gICAgICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIG5ld0RhdGEsIHtuZXc6IHRydWV9LCAoZXJyb3IsIGJ1aWxkaW5nKSA9PiB7XHJcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGE6IHVwZGF0ZWRDYXRlZ29yaWVzLCBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy9HZXQgYWN0aXZlIGNhdGVnb3JpZXMgZnJvbSBkYXRhYmFzZVxyXG4gIGdldENhdGVnb3JpZXNPZkJ1aWxkaW5nQ29zdEhlYWQocHJvamVjdElkOiBzdHJpbmcsIGJ1aWxkaW5nSWQ6IHN0cmluZywgY29zdEhlYWRJZDogbnVtYmVyLCB1c2VyOiBVc2VyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgR2V0IEFjdGl2ZSBDYXRlZ29yaWVzIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZEJ5SWQoYnVpbGRpbmdJZCwgKGVycm9yLCBidWlsZGluZzogQnVpbGRpbmcpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCBidWlsZGluZ0Nvc3RIZWFkcyA9IGJ1aWxkaW5nLmNvc3RIZWFkcztcclxuICAgICAgICBsZXQgY2F0ZWdvcmllc0xpc3RXaXRoQ2VudHJhbGl6ZWRSYXRlczogQ2F0ZWdvcmllc0xpc3RXaXRoUmF0ZXNEVE87XHJcblxyXG4gICAgICAgIGZvciAobGV0IGNvc3RIZWFkRGF0YSBvZiBidWlsZGluZ0Nvc3RIZWFkcykge1xyXG4gICAgICAgICAgaWYgKGNvc3RIZWFkRGF0YS5yYXRlQW5hbHlzaXNJZCA9PT0gY29zdEhlYWRJZCkge1xyXG4gICAgICAgICAgICBjYXRlZ29yaWVzTGlzdFdpdGhDZW50cmFsaXplZFJhdGVzID0gdGhpcy5nZXRDYXRlZ29yaWVzTGlzdFdpdGhDZW50cmFsaXplZFJhdGVzKGNvc3RIZWFkRGF0YS5jYXRlZ29yaWVzLCBidWlsZGluZy5yYXRlcyk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjYWxsYmFjayhudWxsLCB7XHJcbiAgICAgICAgICBkYXRhOiBjYXRlZ29yaWVzTGlzdFdpdGhDZW50cmFsaXplZFJhdGVzLFxyXG4gICAgICAgICAgYWNjZXNzX3Rva2VuOiB0aGlzLmF1dGhJbnRlcmNlcHRvci5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vR2V0IGNhdGVnb3JpZXMgb2YgcHJvamVjdENvc3RIZWFkcyBmcm9tIGRhdGFiYXNlXHJcbiAgZ2V0Q2F0ZWdvcmllc09mUHJvamVjdENvc3RIZWFkKHByb2plY3RJZDogc3RyaW5nLCBjb3N0SGVhZElkOiBudW1iZXIsIHVzZXI6IFVzZXIsIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuXHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBHZXQgUHJvamVjdCBDb3N0SGVhZCBDYXRlZ29yaWVzIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgdGhpcy5wcm9qZWN0UmVwb3NpdG9yeS5maW5kQnlJZChwcm9qZWN0SWQsIChlcnJvciwgcHJvamVjdDogUHJvamVjdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IHByb2plY3RDb3N0SGVhZHMgPSBwcm9qZWN0LnByb2plY3RDb3N0SGVhZHM7XHJcbiAgICAgICAgbGV0IGNhdGVnb3JpZXNMaXN0V2l0aENlbnRyYWxpemVkUmF0ZXM6IENhdGVnb3JpZXNMaXN0V2l0aFJhdGVzRFRPO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBjb3N0SGVhZERhdGEgb2YgcHJvamVjdENvc3RIZWFkcykge1xyXG4gICAgICAgICAgaWYgKGNvc3RIZWFkRGF0YS5yYXRlQW5hbHlzaXNJZCA9PT0gY29zdEhlYWRJZCkge1xyXG4gICAgICAgICAgICBjYXRlZ29yaWVzTGlzdFdpdGhDZW50cmFsaXplZFJhdGVzID0gdGhpcy5nZXRDYXRlZ29yaWVzTGlzdFdpdGhDZW50cmFsaXplZFJhdGVzKGNvc3RIZWFkRGF0YS5jYXRlZ29yaWVzLCBwcm9qZWN0LnJhdGVzKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHtcclxuICAgICAgICAgIGRhdGE6IGNhdGVnb3JpZXNMaXN0V2l0aENlbnRyYWxpemVkUmF0ZXMsXHJcbiAgICAgICAgICBhY2Nlc3NfdG9rZW46IHRoaXMuYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0Q29zdEhlYWREZXRhaWxzT2ZCdWlsZGluZyhwcm9qZWN0SWQ6IHN0cmluZywgYnVpbGRpbmdJZDogc3RyaW5nLCBjb3N0SGVhZElkOiBudW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyOiBVc2VyLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcblxyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgR2V0IFByb2plY3QgQ29zdEhlYWQgQ2F0ZWdvcmllcyBoYXMgYmVlbiBoaXQnKTtcclxuICAgIGxldCBxdWVyeSA9IFtcclxuICAgICAgeyRtYXRjaDogeydfaWQnOiBPYmplY3RJZChidWlsZGluZ0lkKX19LFxyXG4gICAgICB7JHByb2plY3Q6IHsnY29zdEhlYWRzJzogMSwgJ3JhdGVzJzogMX19LFxyXG4gICAgICB7JHVud2luZDogJyRjb3N0SGVhZHMnfSxcclxuICAgICAgeyRtYXRjaDogeydjb3N0SGVhZHMucmF0ZUFuYWx5c2lzSWQnOiBjb3N0SGVhZElkfX0sXHJcbiAgICAgIHskcHJvamVjdDogeydjb3N0SGVhZHMnOiAxLCAnX2lkJzogMCwgJ3JhdGVzJzogMX19XHJcbiAgICBdO1xyXG4gICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuYWdncmVnYXRlKHF1ZXJ5LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBHZXQgd29ya2l0ZW1zIGZvciBzcGVjaWZpYyBjYXRlZ29yeSBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChyZXN1bHQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgbGV0IGRhdGEgPSByZXN1bHRbMF0uY29zdEhlYWRzO1xyXG4gICAgICAgICAgbGV0IGNhdGVnb3JpZXNMaXN0V2l0aENlbnRyYWxpemVkUmF0ZXMgPSB0aGlzLmdldENhdGVnb3JpZXNMaXN0V2l0aENlbnRyYWxpemVkUmF0ZXMoZGF0YS5jYXRlZ29yaWVzLCByZXN1bHRbMF0ucmF0ZXMpO1xyXG4gICAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGE6IGRhdGEsIGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbGV0IGVycm9yID0gbmV3IEVycm9yKCk7XHJcbiAgICAgICAgICBlcnJvci5tZXNzYWdlID0gbWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX1JFU1BPTlNFO1xyXG4gICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvL0dldCBjYXRlZ29yeSBsaXN0IHdpdGggY2VudHJhbGl6ZWQgcmF0ZVxyXG4gIGdldENhdGVnb3JpZXNMaXN0V2l0aENlbnRyYWxpemVkUmF0ZXMoY2F0ZWdvcmllc09mQ29zdEhlYWQ6IEFycmF5PENhdGVnb3J5PiwgY2VudHJhbGl6ZWRSYXRlczogQXJyYXk8Q2VudHJhbGl6ZWRSYXRlPikge1xyXG4gICAgbGV0IGNhdGVnb3JpZXNUb3RhbEFtb3VudCA9IDA7XHJcblxyXG4gICAgbGV0IGNhdGVnb3JpZXNMaXN0V2l0aFJhdGVzOiBDYXRlZ29yaWVzTGlzdFdpdGhSYXRlc0RUTyA9IG5ldyBDYXRlZ29yaWVzTGlzdFdpdGhSYXRlc0RUTztcclxuXHJcbiAgICBmb3IgKGxldCBjYXRlZ29yeURhdGEgb2YgY2F0ZWdvcmllc09mQ29zdEhlYWQpIHtcclxuICAgICAgbGV0IHdvcmtJdGVtcyA9IHRoaXMuZ2V0V29ya0l0ZW1MaXN0V2l0aENlbnRyYWxpemVkUmF0ZXMoY2F0ZWdvcnlEYXRhLndvcmtJdGVtcywgY2VudHJhbGl6ZWRSYXRlcywgdHJ1ZSk7XHJcbiAgICAgIGNhdGVnb3J5RGF0YS5hbW91bnQgPSB3b3JrSXRlbXMud29ya0l0ZW1zQW1vdW50O1xyXG4gICAgICBjYXRlZ29yaWVzVG90YWxBbW91bnQgPSBjYXRlZ29yaWVzVG90YWxBbW91bnQgKyB3b3JrSXRlbXMud29ya0l0ZW1zQW1vdW50O1xyXG4gICAgICAvL2RlbGV0ZSBjYXRlZ29yeURhdGEud29ya0l0ZW1zO1xyXG4gICAgICBjYXRlZ29yaWVzTGlzdFdpdGhSYXRlcy5jYXRlZ29yaWVzLnB1c2goY2F0ZWdvcnlEYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoY2F0ZWdvcmllc1RvdGFsQW1vdW50ICE9PSAwKSB7XHJcbiAgICAgIGNhdGVnb3JpZXNMaXN0V2l0aFJhdGVzLmNhdGVnb3JpZXNBbW91bnQgPSBjYXRlZ29yaWVzVG90YWxBbW91bnQ7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNhdGVnb3JpZXNMaXN0V2l0aFJhdGVzO1xyXG4gIH1cclxuXHJcbiAgc3luY1Byb2plY3RXaXRoUmF0ZUFuYWx5c2lzRGF0YShwcm9qZWN0SWQ6IHN0cmluZywgYnVpbGRpbmdJZDogc3RyaW5nLCB1c2VyOiBVc2VyLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBzeW5jUHJvamVjdFdpdGhSYXRlQW5hbHlzaXNEYXRhIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgdGhpcy5nZXRQcm9qZWN0QW5kQnVpbGRpbmdEZXRhaWxzKHByb2plY3RJZCwgYnVpbGRpbmdJZCwgKGVycm9yLCBwcm9qZWN0QW5kQnVpbGRpbmdEZXRhaWxzKSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGxvZ2dlci5lcnJvcignUHJvamVjdCBzZXJ2aWNlLCBnZXRQcm9qZWN0QW5kQnVpbGRpbmdEZXRhaWxzIGZhaWxlZCcpO1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBzeW5jUHJvamVjdFdpdGhSYXRlQW5hbHlzaXNEYXRhLicpO1xyXG4gICAgICAgIGxldCBwcm9qZWN0RGF0YSA9IHByb2plY3RBbmRCdWlsZGluZ0RldGFpbHMuZGF0YVswXTtcclxuICAgICAgICBsZXQgYnVpbGRpbmdzID0gcHJvamVjdEFuZEJ1aWxkaW5nRGV0YWlscy5kYXRhWzBdLmJ1aWxkaW5ncztcclxuICAgICAgICBsZXQgYnVpbGRpbmdEYXRhOiBhbnk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGJ1aWxkaW5nIG9mIGJ1aWxkaW5ncykge1xyXG4gICAgICAgICAgaWYgKGJ1aWxkaW5nLl9pZCA9PSBidWlsZGluZ0lkKSB7XHJcbiAgICAgICAgICAgIGJ1aWxkaW5nRGF0YSA9IGJ1aWxkaW5nO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChwcm9qZWN0RGF0YS5wcm9qZWN0Q29zdEhlYWRzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIHN5bmNXaXRoUmF0ZUFuYWx5c2lzRGF0YSBidWlsZGluZyBPbmx5LicpO1xyXG4gICAgICAgICAgdGhpcy51cGRhdGVDb3N0SGVhZHNGb3JCdWlsZGluZ0FuZFByb2plY3QoY2FsbGJhY2ssIHByb2plY3REYXRhLCBidWlsZGluZ0RhdGEsIGJ1aWxkaW5nSWQsIHByb2plY3RJZCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGNhbGxpbmcgcHJvbWlzZSBmb3Igc3luY1Byb2plY3RXaXRoUmF0ZUFuYWx5c2lzRGF0YSBmb3IgUHJvamVjdCBhbmQgQnVpbGRpbmcuJyk7XHJcbiAgICAgICAgICBsZXQgc3luY0J1aWxkaW5nQ29zdEhlYWRzUHJvbWlzZSA9IHRoaXMudXBkYXRlQnVkZ2V0UmF0ZXNGb3JCdWlsZGluZ0Nvc3RIZWFkcyhDb25zdGFudHMuQlVJTERJTkcsXHJcbiAgICAgICAgICAgIGJ1aWxkaW5nSWQsIHByb2plY3REYXRhLCBidWlsZGluZ0RhdGEpO1xyXG4gICAgICAgICAgbGV0IHN5bmNQcm9qZWN0Q29zdEhlYWRzUHJvbWlzZSA9IHRoaXMudXBkYXRlQnVkZ2V0UmF0ZXNGb3JQcm9qZWN0Q29zdEhlYWRzKENvbnN0YW50cy5BTUVOSVRJRVMsXHJcbiAgICAgICAgICAgIHByb2plY3RJZCwgcHJvamVjdERhdGEsIGJ1aWxkaW5nRGF0YSk7XHJcblxyXG4gICAgICAgICAgQ0NQcm9taXNlLmFsbChbXHJcbiAgICAgICAgICAgIHN5bmNCdWlsZGluZ0Nvc3RIZWFkc1Byb21pc2UsXHJcbiAgICAgICAgICAgIHN5bmNQcm9qZWN0Q29zdEhlYWRzUHJvbWlzZVxyXG4gICAgICAgICAgXSkudGhlbihmdW5jdGlvbiAoZGF0YTogQXJyYXk8YW55Pikge1xyXG4gICAgICAgICAgICBsb2dnZXIuaW5mbygnUHJvbWlzZSBmb3Igc3luY1Byb2plY3RXaXRoUmF0ZUFuYWx5c2lzRGF0YSBmb3IgUHJvamVjdCBhbmQgQnVpbGRpbmcgc3VjY2VzcycpO1xyXG4gICAgICAgICAgICBsZXQgYnVpbGRpbmdDb3N0SGVhZHNEYXRhID0gZGF0YVswXTtcclxuICAgICAgICAgICAgbGV0IHByb2plY3RDb3N0SGVhZHNEYXRhID0gZGF0YVsxXTtcclxuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwge3N0YXR1czogMjAwfSk7XHJcbiAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZTogYW55KSB7XHJcbiAgICAgICAgICAgIGxvZ2dlci5lcnJvcignIFByb21pc2UgZmFpbGVkIGZvciBzeW5jUHJvamVjdFdpdGhSYXRlQW5hbHlzaXNEYXRhICEgOicgKyBKU09OLnN0cmluZ2lmeShlLm1lc3NhZ2UpKTtcclxuICAgICAgICAgICAgQ0NQcm9taXNlLnJlamVjdChlLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZUNvc3RIZWFkc0ZvckJ1aWxkaW5nQW5kUHJvamVjdChjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9qZWN0RGF0YTogYW55LCBidWlsZGluZ0RhdGE6IGFueSwgYnVpbGRpbmdJZDogc3RyaW5nLCBwcm9qZWN0SWQ6IHN0cmluZykge1xyXG5cclxuICAgIGxvZ2dlci5pbmZvKCd1cGRhdGVDb3N0SGVhZHNGb3JCdWlsZGluZ0FuZFByb2plY3QgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICBsZXQgcmF0ZUFuYWx5c2lzU2VydmljZSA9IG5ldyBSYXRlQW5hbHlzaXNTZXJ2aWNlKCk7XHJcbiAgICBsZXQgYnVpbGRpbmdSZXBvc2l0b3J5ID0gbmV3IEJ1aWxkaW5nUmVwb3NpdG9yeSgpO1xyXG4gICAgbGV0IHByb2plY3RSZXBvc2l0b3J5ID0gbmV3IFByb2plY3RSZXBvc2l0b3J5KCk7XHJcblxyXG4gICAgcmF0ZUFuYWx5c2lzU2VydmljZS5nZXRDb3N0Q29udHJvbFJhdGVBbmFseXNpcyh7fSwge30sKGVycm9yOiBhbnksIHJhdGVBbmFseXNpczogUmF0ZUFuYWx5c2lzKSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICBsb2dnZXIuZXJyb3IoJ0Vycm9yIGluIHVwZGF0ZUNvc3RIZWFkc0ZvckJ1aWxkaW5nQW5kUHJvamVjdCA6IGNvbnZlcnRDb3N0SGVhZHNGcm9tUmF0ZUFuYWx5c2lzVG9Db3N0Q29udHJvbCA6ICdcclxuICAgICAgICAgICAgKyBKU09OLnN0cmluZ2lmeShlcnJvcikpO1xyXG4gICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnR2V0QWxsRGF0YUZyb21SYXRlQW5hbHlzaXMgc3VjY2VzcycpO1xyXG4gICAgICAgICAgbGV0IGJ1aWxkaW5nQ29zdEhlYWRzID0gcmF0ZUFuYWx5c2lzLmJ1aWxkaW5nQ29zdEhlYWRzO1xyXG4gICAgICAgICAgbGV0IHByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcbiAgICAgICAgICBidWlsZGluZ0Nvc3RIZWFkcyA9IHByb2plY3RTZXJ2aWNlLmNhbGN1bGF0ZUJ1ZGdldENvc3RGb3JCdWlsZGluZyhidWlsZGluZ0Nvc3RIZWFkcywgYnVpbGRpbmdEYXRhKTtcclxuICAgICAgICAgIGxldCBxdWVyeUZvckJ1aWxkaW5nID0geydfaWQnOiBidWlsZGluZ0lkfTtcclxuICAgICAgICAgIGxldCB1cGRhdGVDb3N0SGVhZCA9IHskc2V0OiB7J2Nvc3RIZWFkcyc6IGJ1aWxkaW5nQ29zdEhlYWRzLCAncmF0ZXMnOiByYXRlQW5hbHlzaXMuYnVpbGRpbmdSYXRlc319O1xyXG5cclxuICAgICAgICAgIGJ1aWxkaW5nUmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5Rm9yQnVpbGRpbmcsIHVwZGF0ZUNvc3RIZWFkLCB7bmV3OiB0cnVlfSwgKGVycm9yOiBhbnksIHJlc3BvbnNlOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKCdFcnJvciBpbiBVcGRhdGUgY29udmVydENvc3RIZWFkc0Zyb21SYXRlQW5hbHlzaXNUb0Nvc3RDb250cm9sIGJ1aWxkaW5nQ29zdEhlYWRzRGF0YSAgOiAnXHJcbiAgICAgICAgICAgICAgICArIEpTT04uc3RyaW5naWZ5KGVycm9yKSk7XHJcbiAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGxvZ2dlci5pbmZvKCdVcGRhdGVCdWlsZGluZ0Nvc3RIZWFkIHN1Y2Nlc3MnKTtcclxuICAgICAgICAgICAgICBsZXQgcHJvamVjdENvc3RIZWFkcyA9IHByb2plY3RTZXJ2aWNlLmNhbGN1bGF0ZUJ1ZGdldENvc3RGb3JDb21tb25BbW1lbml0aWVzKFxyXG4gICAgICAgICAgICAgICAgcHJvamVjdERhdGEucHJvamVjdENvc3RIZWFkcywgcHJvamVjdERhdGEpO1xyXG4gICAgICAgICAgICAgIGxldCBxdWVyeUZvclByb2plY3QgPSB7J19pZCc6IHByb2plY3RJZH07XHJcbiAgICAgICAgICAgICAgbGV0IHVwZGF0ZVByb2plY3RDb3N0SGVhZCA9IHskc2V0OiB7J3Byb2plY3RDb3N0SGVhZHMnOiBwcm9qZWN0Q29zdEhlYWRzfX07XHJcbiAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oJ0NhbGxpbmcgdXBkYXRlIHByb2plY3QgQ29zdGhlYWRzIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICAgICAgICAgIHByb2plY3RSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnlGb3JQcm9qZWN0LCB1cGRhdGVQcm9qZWN0Q29zdEhlYWQsIHtuZXc6IHRydWV9LFxyXG4gICAgICAgICAgICAgICAgKGVycm9yOiBhbnksIHJlc3BvbnNlOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKCdFcnJvciB1cGRhdGUgcHJvamVjdCBDb3N0aGVhZHMgOiAnICsgSlNPTi5zdHJpbmdpZnkoZXJyb3IpKTtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmRlYnVnKCdVcGRhdGUgcHJvamVjdCBDb3N0aGVhZHMgc3VjY2VzcycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVCdWRnZXRSYXRlc0ZvckJ1aWxkaW5nQ29zdEhlYWRzKGVudGl0eTogc3RyaW5nLCBidWlsZGluZ0lkOiBzdHJpbmcsIHByb2plY3REZXRhaWxzOiBQcm9qZWN0LCBidWlsZGluZ0RldGFpbHM6IEJ1aWxkaW5nKSB7XHJcbiAgICByZXR1cm4gbmV3IENDUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZTogYW55LCByZWplY3Q6IGFueSkge1xyXG4gICAgICBsZXQgcmF0ZUFuYWx5c2lzU2VydmljZSA9IG5ldyBSYXRlQW5hbHlzaXNTZXJ2aWNlKCk7XHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgICBsZXQgYnVpbGRpbmdSZXBvc2l0b3J5ID0gbmV3IEJ1aWxkaW5nUmVwb3NpdG9yeSgpO1xyXG4gICAgICBsb2dnZXIuaW5mbygnSW5zaWRlIHVwZGF0ZUJ1ZGdldFJhdGVzRm9yQnVpbGRpbmdDb3N0SGVhZHMgcHJvbWlzZS4nKTtcclxuICAgICAgcmF0ZUFuYWx5c2lzU2VydmljZS5nZXRDb3N0Q29udHJvbFJhdGVBbmFseXNpcygge30sIHt9LChlcnJvcjogYW55LCByYXRlQW5hbHlzaXM6IFJhdGVBbmFseXNpcykgPT4ge1xyXG4gICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgbG9nZ2VyLmVycm9yKCdFcnJvciBpbiBwcm9taXNlIHVwZGF0ZUJ1ZGdldFJhdGVzRm9yQnVpbGRpbmdDb3N0SGVhZHMgOiAnICsgSlNPTi5zdHJpbmdpZnkoZXJyb3IpKTtcclxuICAgICAgICAgIHJlamVjdChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdJbnNpZGUgdXBkYXRlQnVkZ2V0UmF0ZXNGb3JCdWlsZGluZ0Nvc3RIZWFkcyBzdWNjZXNzJyk7XHJcbiAgICAgICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgICAgIGxldCBidWlsZGluZ0Nvc3RIZWFkcyA9IHJhdGVBbmFseXNpcy5idWlsZGluZ0Nvc3RIZWFkcztcclxuXHJcbiAgICAgICAgICBidWlsZGluZ0Nvc3RIZWFkcyA9IHByb2plY3RTZXJ2aWNlLmNhbGN1bGF0ZUJ1ZGdldENvc3RGb3JCdWlsZGluZyhidWlsZGluZ0Nvc3RIZWFkcywgYnVpbGRpbmdEZXRhaWxzKTtcclxuXHJcbiAgICAgICAgICBsZXQgcXVlcnkgPSB7J19pZCc6IGJ1aWxkaW5nSWR9O1xyXG4gICAgICAgICAgbGV0IG5ld0RhdGEgPSB7JHNldDogeydjb3N0SGVhZHMnOiBidWlsZGluZ0Nvc3RIZWFkcywgJ3JhdGVzJzogcmF0ZUFuYWx5c2lzLmJ1aWxkaW5nUmF0ZXN9fTtcclxuICAgICAgICAgIGJ1aWxkaW5nUmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCBuZXdEYXRhLCB7bmV3OiB0cnVlfSwgKGVycm9yOiBhbnksIHJlc3BvbnNlOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZ2V0QWxsRGF0YUZyb21SYXRlQW5hbHlzaXMgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgIGxvZ2dlci5lcnJvcignRXJyb3IgaW4gVXBkYXRlIGJ1aWxkaW5nQ29zdEhlYWRzRGF0YSAgOiAnICsgSlNPTi5zdHJpbmdpZnkoZXJyb3IpKTtcclxuICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnVXBkYXRlZCBidWlsZGluZ0Nvc3RIZWFkc0RhdGEnKTtcclxuICAgICAgICAgICAgICByZXNvbHZlKCdEb25lJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9KS5jYXRjaChmdW5jdGlvbiAoZTogYW55KSB7XHJcbiAgICAgIGxvZ2dlci5lcnJvcignRXJyb3IgaW4gdXBkYXRlQnVkZ2V0UmF0ZXNGb3JCdWlsZGluZ0Nvc3RIZWFkcyA6JyArIEpTT04uc3RyaW5naWZ5KGUubWVzc2FnZSkpO1xyXG4gICAgICBDQ1Byb21pc2UucmVqZWN0KGUubWVzc2FnZSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldFJhdGVzKHJlc3VsdDogYW55LCBjb3N0SGVhZHM6IEFycmF5PENvc3RIZWFkPikge1xyXG4gICAgbGV0IGdldFJhdGVzTGlzdFNRTCA9ICdTRUxFQ1QgKiBGUk9NID8gQVMgcSBXSEVSRSBxLkM0IElOIChTRUxFQ1QgdC5yYXRlQW5hbHlzaXNJZCAnICtcclxuICAgICAgJ0ZST00gPyBBUyB0KSc7XHJcbiAgICBsZXQgcmF0ZUl0ZW1zID0gYWxhc3FsKGdldFJhdGVzTGlzdFNRTCwgW3Jlc3VsdC5yYXRlcywgY29zdEhlYWRzXSk7XHJcblxyXG4gICAgbGV0IHJhdGVJdGVtc1JhdGVBbmFseXNpc1NRTCA9ICdTRUxFQ1QgcmF0ZUl0ZW0uQzIgQVMgaXRlbU5hbWUsIHJhdGVJdGVtLkMyIEFTIG9yaWdpbmFsSXRlbU5hbWUsJyArXHJcbiAgICAgICdyYXRlSXRlbS5DMTIgQVMgcmF0ZUFuYWx5c2lzSWQsIHJhdGVJdGVtLkM2IEFTIHR5cGUsJyArXHJcbiAgICAgICdST1VORChyYXRlSXRlbS5DNywyKSBBUyBxdWFudGl0eSwgUk9VTkQocmF0ZUl0ZW0uQzMsMikgQVMgcmF0ZSwgdW5pdC5DMiBBUyB1bml0LCcgK1xyXG4gICAgICAnUk9VTkQocmF0ZUl0ZW0uQzMgKiByYXRlSXRlbS5DNywyKSBBUyB0b3RhbEFtb3VudCwgcmF0ZUl0ZW0uQzUgQVMgdG90YWxRdWFudGl0eSAnICtcclxuICAgICAgJ0ZST00gPyBBUyByYXRlSXRlbSBKT0lOID8gQVMgdW5pdCBPTiB1bml0LkMxID0gcmF0ZUl0ZW0uQzknO1xyXG5cclxuICAgIGxldCByYXRlSXRlbXNMaXN0ID0gYWxhc3FsKHJhdGVJdGVtc1JhdGVBbmFseXNpc1NRTCwgW3JhdGVJdGVtcywgcmVzdWx0LnVuaXRzXSk7XHJcblxyXG4gICAgbGV0IGRpc3RpbmN0SXRlbXNTUUwgPSAnc2VsZWN0IERJU1RJTkNUIGl0ZW1OYW1lLG9yaWdpbmFsSXRlbU5hbWUscmF0ZSBGUk9NID8nO1xyXG4gICAgdmFyIGRpc3RpbmN0UmF0ZXMgPSBhbGFzcWwoZGlzdGluY3RJdGVtc1NRTCwgW3JhdGVJdGVtc0xpc3RdKTtcclxuXHJcbiAgICByZXR1cm4gZGlzdGluY3RSYXRlcztcclxuICB9XHJcblxyXG4gIGdldENlbnRyYWxpemVkUmF0ZXMocmVzdWx0OiBhbnksIGNvc3RIZWFkcyA6IEFycmF5PENvc3RIZWFkPikge1xyXG5cclxuICAgIGxldCBnZXRSYXRlc0xpc3RTUUwgPSAnU0VMRUNUICogRlJPTSA/IEFTIHEgV0hFUkUgcS5DNCBJTiAoU0VMRUNUIHQucmF0ZUFuYWx5c2lzSWQgJyArXHJcbiAgICAgICdGUk9NID8gQVMgdCknO1xyXG4gICAgbGV0IHJhdGVJdGVtcyA9IGFsYXNxbChnZXRSYXRlc0xpc3RTUUwsIFtyZXN1bHQucmF0ZXMsIGNvc3RIZWFkc10pO1xyXG5cclxuICAgIGxldCByYXRlSXRlbXNSYXRlQW5hbHlzaXNTUUwgPSAnU0VMRUNUIHJhdGVJdGVtLkMyIEFTIGl0ZW1OYW1lLCByYXRlSXRlbS5DMiBBUyBvcmlnaW5hbEl0ZW1OYW1lLCcgK1xyXG4gICAgICAncmF0ZUl0ZW0uQzEyIEFTIHJhdGVBbmFseXNpc0lkLCByYXRlSXRlbS5DNiBBUyB0eXBlLCcgK1xyXG4gICAgICAnUk9VTkQocmF0ZUl0ZW0uQzcsMikgQVMgcXVhbnRpdHksIFJPVU5EKHJhdGVJdGVtLkMzLDIpIEFTIHJhdGUsIHVuaXQuQzIgQVMgdW5pdCwnICtcclxuICAgICAgJ1JPVU5EKHJhdGVJdGVtLkMzICogcmF0ZUl0ZW0uQzcsMikgQVMgdG90YWxBbW91bnQsIHJhdGVJdGVtLkM1IEFTIHRvdGFsUXVhbnRpdHkgJyArXHJcbiAgICAgICdGUk9NID8gQVMgcmF0ZUl0ZW0gSk9JTiA/IEFTIHVuaXQgT04gdW5pdC5DMSA9IHJhdGVJdGVtLkM5JztcclxuXHJcbiAgICBsZXQgcmF0ZUl0ZW1zTGlzdCA9IGFsYXNxbChyYXRlSXRlbXNSYXRlQW5hbHlzaXNTUUwsIFtyYXRlSXRlbXMsIHJlc3VsdC51bml0c10pO1xyXG5cclxuICAgIGxldCBkaXN0aW5jdEl0ZW1zU1FMID0gJ3NlbGVjdCBESVNUSU5DVCBpdGVtTmFtZSxvcmlnaW5hbEl0ZW1OYW1lLHJhdGUgRlJPTSA/JztcclxuICAgIHZhciBkaXN0aW5jdFJhdGVzID0gYWxhc3FsKGRpc3RpbmN0SXRlbXNTUUwsIFtyYXRlSXRlbXNMaXN0XSk7XHJcblxyXG4gICAgcmV0dXJuIGRpc3RpbmN0UmF0ZXM7XHJcbiAgfVxyXG5cclxuXHJcbiAgY29udmVydENvbmZpZ0Nvc3RIZWFkcyhjb25maWdDb3N0SGVhZHM6IEFycmF5PGFueT4sIGNvc3RIZWFkc0RhdGE6IEFycmF5PENvc3RIZWFkPikge1xyXG5cclxuICAgIGZvciAobGV0IGNvbmZpZ0Nvc3RIZWFkIG9mIGNvbmZpZ0Nvc3RIZWFkcykge1xyXG5cclxuICAgICAgbGV0IGNvc3RIZWFkOiBDb3N0SGVhZCA9IG5ldyBDb3N0SGVhZCgpO1xyXG4gICAgICBjb3N0SGVhZC5uYW1lID0gY29uZmlnQ29zdEhlYWQubmFtZTtcclxuICAgICAgY29zdEhlYWQucHJpb3JpdHlJZCA9IGNvbmZpZ0Nvc3RIZWFkLnByaW9yaXR5SWQ7XHJcbiAgICAgIGNvc3RIZWFkLnJhdGVBbmFseXNpc0lkID0gY29uZmlnQ29zdEhlYWQucmF0ZUFuYWx5c2lzSWQ7XHJcbiAgICAgIGxldCBjYXRlZ29yaWVzTGlzdCA9IG5ldyBBcnJheTxDYXRlZ29yeT4oKTtcclxuXHJcbiAgICAgIGZvciAobGV0IGNvbmZpZ0NhdGVnb3J5IG9mIGNvbmZpZ0Nvc3RIZWFkLmNhdGVnb3JpZXMpIHtcclxuXHJcbiAgICAgICAgbGV0IGNhdGVnb3J5OiBDYXRlZ29yeSA9IG5ldyBDYXRlZ29yeShjb25maWdDYXRlZ29yeS5uYW1lLCBjb25maWdDYXRlZ29yeS5yYXRlQW5hbHlzaXNJZCk7XHJcbiAgICAgICAgbGV0IHdvcmtJdGVtc0xpc3Q6IEFycmF5PFdvcmtJdGVtPiA9IG5ldyBBcnJheTxXb3JrSXRlbT4oKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgY29uZmlnV29ya0l0ZW0gb2YgY29uZmlnQ2F0ZWdvcnkud29ya0l0ZW1zKSB7XHJcblxyXG4gICAgICAgICAgbGV0IHdvcmtJdGVtOiBXb3JrSXRlbSA9IG5ldyBXb3JrSXRlbShjb25maWdXb3JrSXRlbS5uYW1lLCBjb25maWdXb3JrSXRlbS5yYXRlQW5hbHlzaXNJZCk7XHJcbiAgICAgICAgICB3b3JrSXRlbS5pc0RpcmVjdFJhdGUgPSB0cnVlO1xyXG4gICAgICAgICAgd29ya0l0ZW0udW5pdCA9IGNvbmZpZ1dvcmtJdGVtLm1lYXN1cmVtZW50VW5pdDtcclxuXHJcbiAgICAgICAgICBpZiAoY29uZmlnV29ya0l0ZW0uZGlyZWN0UmF0ZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB3b3JrSXRlbS5yYXRlLnRvdGFsID0gY29uZmlnV29ya0l0ZW0uZGlyZWN0UmF0ZTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHdvcmtJdGVtLnJhdGUudG90YWwgPSAwO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgd29ya0l0ZW0ucmF0ZS5pc0VzdGltYXRlZCA9IHRydWU7XHJcbiAgICAgICAgICB3b3JrSXRlbXNMaXN0LnB1c2god29ya0l0ZW0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRlZ29yeS53b3JrSXRlbXMgPSB3b3JrSXRlbXNMaXN0O1xyXG4gICAgICAgIGNhdGVnb3JpZXNMaXN0LnB1c2goY2F0ZWdvcnkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb3N0SGVhZC5jYXRlZ29yaWVzID0gY2F0ZWdvcmllc0xpc3Q7XHJcbiAgICAgIGNvc3RIZWFkLnRodW1iUnVsZVJhdGUgPSBjb25maWcuZ2V0KENvbnN0YW50cy5USFVNQlJVTEVfUkFURSk7XHJcbiAgICAgIGNvc3RIZWFkc0RhdGEucHVzaChjb3N0SGVhZCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY29zdEhlYWRzRGF0YTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZUJ1ZGdldFJhdGVzRm9yUHJvamVjdENvc3RIZWFkcyhlbnRpdHk6IHN0cmluZywgcHJvamVjdElkOiBzdHJpbmcsIHByb2plY3REZXRhaWxzOiBQcm9qZWN0LCBidWlsZGluZ0RldGFpbHM6IEJ1aWxkaW5nKSB7XHJcbiAgICByZXR1cm4gbmV3IENDUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZTogYW55LCByZWplY3Q6IGFueSkge1xyXG4gICAgICBsZXQgcmF0ZUFuYWx5c2lzU2VydmljZSA9IG5ldyBSYXRlQW5hbHlzaXNTZXJ2aWNlKCk7XHJcbiAgICAgIGxldCBwcm9qZWN0UmVwb3NpdG9yeSA9IG5ldyBQcm9qZWN0UmVwb3NpdG9yeSgpO1xyXG4gICAgICBsb2dnZXIuaW5mbygnSW5zaWRlIHVwZGF0ZUJ1ZGdldFJhdGVzRm9yUHJvamVjdENvc3RIZWFkcyBwcm9taXNlLicpO1xyXG4gICAgICByYXRlQW5hbHlzaXNTZXJ2aWNlLmdldENvc3RDb250cm9sUmF0ZUFuYWx5c2lzKHt9LHt9LChlcnJvcjogYW55LCByYXRlQW5hbHlzaXM6IFJhdGVBbmFseXNpcykgPT4ge1xyXG4gICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgbG9nZ2VyLmVycm9yKCdFcnJvciBpbiB1cGRhdGVCdWRnZXRSYXRlc0ZvclByb2plY3RDb3N0SGVhZHMgcHJvbWlzZSA6ICcgKyBKU09OLnN0cmluZ2lmeShlcnJvcikpO1xyXG4gICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgICAgICAgbGV0IHByb2plY3RDb3N0SGVhZHMgPSByYXRlQW5hbHlzaXMucHJvamVjdENvc3RIZWFkcztcclxuICAgICAgICAgIHByb2plY3RDb3N0SGVhZHMgPSBwcm9qZWN0U2VydmljZS5jYWxjdWxhdGVCdWRnZXRDb3N0Rm9yQ29tbW9uQW1tZW5pdGllcyhcclxuICAgICAgICAgICAgcHJvamVjdENvc3RIZWFkcywgcHJvamVjdERldGFpbHMpO1xyXG5cclxuICAgICAgICAgIGxldCBxdWVyeSA9IHsnX2lkJzogcHJvamVjdElkfTtcclxuICAgICAgICAgIGxldCBuZXdEYXRhID0geyRzZXQ6IHsncHJvamVjdENvc3RIZWFkcyc6IHByb2plY3RDb3N0SGVhZHMsICdyYXRlcyc6IHJhdGVBbmFseXNpcy5wcm9qZWN0UmF0ZXN9fTtcclxuXHJcbiAgICAgICAgICBwcm9qZWN0UmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCBuZXdEYXRhLCB7bmV3OiB0cnVlfSwgKGVycm9yOiBhbnksIHJlc3BvbnNlOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZ2V0QWxsRGF0YUZyb21SYXRlQW5hbHlzaXMgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgIGxvZ2dlci5lcnJvcignRXJyb3IgaW4gVXBkYXRlIGJ1aWxkaW5nQ29zdEhlYWRzRGF0YSAgOiAnICsgSlNPTi5zdHJpbmdpZnkoZXJyb3IpKTtcclxuICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnVXBkYXRlZCBwcm9qZWN0Q29zdEhlYWRzJyk7XHJcbiAgICAgICAgICAgICAgcmVzb2x2ZSgnRG9uZScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSkuY2F0Y2goZnVuY3Rpb24gKGU6IGFueSkge1xyXG4gICAgICBsb2dnZXIuZXJyb3IoJ0Vycm9yIGluIHVwZGF0ZUJ1ZGdldFJhdGVzRm9yUHJvamVjdENvc3RIZWFkcyA6JyArIEpTT04uc3RyaW5naWZ5KGUubWVzc2FnZSkpO1xyXG4gICAgICBDQ1Byb21pc2UucmVqZWN0KGUubWVzc2FnZSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGNhbGN1bGF0ZUJ1ZGdldENvc3RGb3JCdWlsZGluZyhjb3N0SGVhZHNSYXRlQW5hbHlzaXM6IGFueSwgYnVpbGRpbmdEZXRhaWxzOiBhbnkpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGNhbGN1bGF0ZUJ1ZGdldENvc3RGb3JCdWlsZGluZyBoYXMgYmVlbiBoaXQnKTtcclxuICAgIGxldCBjb3N0SGVhZHM6IEFycmF5PENvc3RIZWFkPiA9IG5ldyBBcnJheTxDb3N0SGVhZD4oKTtcclxuICAgIGxldCBidWRnZXRlZENvc3RBbW91bnQ6IG51bWJlcjtcclxuICAgIGxldCBjYWxjdWxhdGVCdWRndGVkQ29zdDogc3RyaW5nO1xyXG5cclxuICAgIGZvciAobGV0IGNvc3RIZWFkIG9mIGNvc3RIZWFkc1JhdGVBbmFseXNpcykge1xyXG5cclxuICAgICAgbGV0IGJ1ZGdldENvc3RGb3JtdWxhZTogc3RyaW5nO1xyXG5cclxuICAgICAgc3dpdGNoIChjb3N0SGVhZC5uYW1lKSB7XHJcblxyXG4gICAgICAgIGNhc2UgQ29uc3RhbnRzLlJDQ19CQU5EX09SX1BBVExJIDoge1xyXG4gICAgICAgICAgYnVkZ2V0Q29zdEZvcm11bGFlID0gY29uZmlnLmdldChDb25zdGFudHMuQlVER0VURURfQ09TVF9GT1JNVUxBRSArIGNvc3RIZWFkLm5hbWUpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICBjYWxjdWxhdGVCdWRndGVkQ29zdCA9IGJ1ZGdldENvc3RGb3JtdWxhZS5yZXBsYWNlKENvbnN0YW50cy5TTEFCX0FSRUEsIGJ1aWxkaW5nRGV0YWlscy50b3RhbFNsYWJBcmVhKTtcclxuICAgICAgICAgIGJ1ZGdldGVkQ29zdEFtb3VudCA9IGV2YWwoY2FsY3VsYXRlQnVkZ3RlZENvc3QpO1xyXG4gICAgICAgICAgdGhpcy5jYWxjdWxhdGVUaHVtYlJ1bGVSZXBvcnRGb3JDb3N0SGVhZChidWRnZXRlZENvc3RBbW91bnQsIGNvc3RIZWFkLCBidWlsZGluZ0RldGFpbHMsIGNvc3RIZWFkcyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FzZSBDb25zdGFudHMuRVhURVJOQUxfUExBU1RFUiA6IHtcclxuICAgICAgICAgIGJ1ZGdldENvc3RGb3JtdWxhZSA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLkJVREdFVEVEX0NPU1RfRk9STVVMQUUgKyBjb3N0SGVhZC5uYW1lKS50b1N0cmluZygpO1xyXG4gICAgICAgICAgY2FsY3VsYXRlQnVkZ3RlZENvc3QgPSBidWRnZXRDb3N0Rm9ybXVsYWUucmVwbGFjZShDb25zdGFudHMuQ0FSUEVUX0FSRUEsIGJ1aWxkaW5nRGV0YWlscy50b3RhbENhcnBldEFyZWFPZlVuaXQpO1xyXG4gICAgICAgICAgYnVkZ2V0ZWRDb3N0QW1vdW50ID0gZXZhbChjYWxjdWxhdGVCdWRndGVkQ29zdCk7XHJcbiAgICAgICAgICB0aGlzLmNhbGN1bGF0ZVRodW1iUnVsZVJlcG9ydEZvckNvc3RIZWFkKGJ1ZGdldGVkQ29zdEFtb3VudCwgY29zdEhlYWQsIGJ1aWxkaW5nRGV0YWlscywgY29zdEhlYWRzKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXNlIENvbnN0YW50cy5GQUJSSUNBVElPTiA6IHtcclxuICAgICAgICAgIGJ1ZGdldENvc3RGb3JtdWxhZSA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLkJVREdFVEVEX0NPU1RfRk9STVVMQUUgKyBjb3N0SGVhZC5uYW1lKS50b1N0cmluZygpO1xyXG4gICAgICAgICAgY2FsY3VsYXRlQnVkZ3RlZENvc3QgPSBidWRnZXRDb3N0Rm9ybXVsYWUucmVwbGFjZShDb25zdGFudHMuQ0FSUEVUX0FSRUEsIGJ1aWxkaW5nRGV0YWlscy50b3RhbENhcnBldEFyZWFPZlVuaXQpO1xyXG4gICAgICAgICAgYnVkZ2V0ZWRDb3N0QW1vdW50ID0gZXZhbChjYWxjdWxhdGVCdWRndGVkQ29zdCk7XHJcbiAgICAgICAgICB0aGlzLmNhbGN1bGF0ZVRodW1iUnVsZVJlcG9ydEZvckNvc3RIZWFkKGJ1ZGdldGVkQ29zdEFtb3VudCwgY29zdEhlYWQsIGJ1aWxkaW5nRGV0YWlscywgY29zdEhlYWRzKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXNlIENvbnN0YW50cy5QQUlOVElORyA6IHtcclxuICAgICAgICAgIGJ1ZGdldENvc3RGb3JtdWxhZSA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLkJVREdFVEVEX0NPU1RfRk9STVVMQUUgKyBjb3N0SGVhZC5uYW1lKS50b1N0cmluZygpO1xyXG4gICAgICAgICAgY2FsY3VsYXRlQnVkZ3RlZENvc3QgPSBidWRnZXRDb3N0Rm9ybXVsYWUucmVwbGFjZShDb25zdGFudHMuQ0FSUEVUX0FSRUEsIGJ1aWxkaW5nRGV0YWlscy50b3RhbENhcnBldEFyZWFPZlVuaXQpO1xyXG4gICAgICAgICAgYnVkZ2V0ZWRDb3N0QW1vdW50ID0gZXZhbChjYWxjdWxhdGVCdWRndGVkQ29zdCk7XHJcbiAgICAgICAgICB0aGlzLmNhbGN1bGF0ZVRodW1iUnVsZVJlcG9ydEZvckNvc3RIZWFkKGJ1ZGdldGVkQ29zdEFtb3VudCwgY29zdEhlYWQsIGJ1aWxkaW5nRGV0YWlscywgY29zdEhlYWRzKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXNlIENvbnN0YW50cy5LSVRDSEVOX09UVEEgOiB7XHJcbiAgICAgICAgICBidWRnZXRDb3N0Rm9ybXVsYWUgPSBjb25maWcuZ2V0KENvbnN0YW50cy5CVURHRVRFRF9DT1NUX0ZPUk1VTEFFICsgY29zdEhlYWQubmFtZSkudG9TdHJpbmcoKTtcclxuICAgICAgICAgIGNhbGN1bGF0ZUJ1ZGd0ZWRDb3N0ID0gYnVkZ2V0Q29zdEZvcm11bGFlLnJlcGxhY2UoQ29uc3RhbnRzLk5VTV9PRl9PTkVfQkhLLCBidWlsZGluZ0RldGFpbHMubnVtT2ZPbmVCSEspXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKENvbnN0YW50cy5OVU1fT0ZfVFdPX0JISywgYnVpbGRpbmdEZXRhaWxzLm51bU9mVHdvQkhLKVxyXG4gICAgICAgICAgICAucmVwbGFjZShDb25zdGFudHMuTlVNX09GX1RIUkVFX0JISywgYnVpbGRpbmdEZXRhaWxzLm51bU9mVGhyZWVCSEspXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKENvbnN0YW50cy5OVU1fT0ZfRk9VUl9CSEssIGJ1aWxkaW5nRGV0YWlscy5udW1PZkZvdXJCSEspXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKENvbnN0YW50cy5OVU1fT0ZfRklWRV9CSEssIGJ1aWxkaW5nRGV0YWlscy5udW1PZkZpdmVCSEspO1xyXG4gICAgICAgICAgYnVkZ2V0ZWRDb3N0QW1vdW50ID0gZXZhbChjYWxjdWxhdGVCdWRndGVkQ29zdCk7XHJcblxyXG4gICAgICAgICAgdGhpcy5jYWxjdWxhdGVUaHVtYlJ1bGVSZXBvcnRGb3JDb3N0SGVhZChidWRnZXRlZENvc3RBbW91bnQsIGNvc3RIZWFkLCBidWlsZGluZ0RldGFpbHMsIGNvc3RIZWFkcyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FzZSBDb25zdGFudHMuU09MSU5HIDoge1xyXG4gICAgICAgICAgYnVkZ2V0Q29zdEZvcm11bGFlID0gY29uZmlnLmdldChDb25zdGFudHMuQlVER0VURURfQ09TVF9GT1JNVUxBRSArIGNvc3RIZWFkLm5hbWUpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICBjYWxjdWxhdGVCdWRndGVkQ29zdCA9IGJ1ZGdldENvc3RGb3JtdWxhZS5yZXBsYWNlKENvbnN0YW50cy5QTElOVEhfQVJFQSwgYnVpbGRpbmdEZXRhaWxzLnBsaW50aEFyZWEpO1xyXG4gICAgICAgICAgYnVkZ2V0ZWRDb3N0QW1vdW50ID0gZXZhbChjYWxjdWxhdGVCdWRndGVkQ29zdCk7XHJcbiAgICAgICAgICB0aGlzLmNhbGN1bGF0ZVRodW1iUnVsZVJlcG9ydEZvckNvc3RIZWFkKGJ1ZGdldGVkQ29zdEFtb3VudCwgY29zdEhlYWQsIGJ1aWxkaW5nRGV0YWlscywgY29zdEhlYWRzKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXNlIENvbnN0YW50cy5NQVNPTlJZIDoge1xyXG4gICAgICAgICAgYnVkZ2V0Q29zdEZvcm11bGFlID0gY29uZmlnLmdldChDb25zdGFudHMuQlVER0VURURfQ09TVF9GT1JNVUxBRSArIGNvc3RIZWFkLm5hbWUpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICBjYWxjdWxhdGVCdWRndGVkQ29zdCA9IGJ1ZGdldENvc3RGb3JtdWxhZS5yZXBsYWNlKENvbnN0YW50cy5DQVJQRVRfQVJFQSwgYnVpbGRpbmdEZXRhaWxzLnRvdGFsQ2FycGV0QXJlYU9mVW5pdCk7XHJcbiAgICAgICAgICBidWRnZXRlZENvc3RBbW91bnQgPSBldmFsKGNhbGN1bGF0ZUJ1ZGd0ZWRDb3N0KTtcclxuICAgICAgICAgIHRoaXMuY2FsY3VsYXRlVGh1bWJSdWxlUmVwb3J0Rm9yQ29zdEhlYWQoYnVkZ2V0ZWRDb3N0QW1vdW50LCBjb3N0SGVhZCwgYnVpbGRpbmdEZXRhaWxzLCBjb3N0SGVhZHMpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgQ29uc3RhbnRzLklOVEVSTkFMX1BMQVNURVIgOiB7XHJcbiAgICAgICAgICBidWRnZXRDb3N0Rm9ybXVsYWUgPSBjb25maWcuZ2V0KENvbnN0YW50cy5CVURHRVRFRF9DT1NUX0ZPUk1VTEFFICsgY29zdEhlYWQubmFtZSkudG9TdHJpbmcoKTtcclxuICAgICAgICAgIGNhbGN1bGF0ZUJ1ZGd0ZWRDb3N0ID0gYnVkZ2V0Q29zdEZvcm11bGFlLnJlcGxhY2UoQ29uc3RhbnRzLkNBUlBFVF9BUkVBLCBidWlsZGluZ0RldGFpbHMudG90YWxDYXJwZXRBcmVhT2ZVbml0KTtcclxuICAgICAgICAgIGJ1ZGdldGVkQ29zdEFtb3VudCA9IGV2YWwoY2FsY3VsYXRlQnVkZ3RlZENvc3QpO1xyXG4gICAgICAgICAgdGhpcy5jYWxjdWxhdGVUaHVtYlJ1bGVSZXBvcnRGb3JDb3N0SGVhZChidWRnZXRlZENvc3RBbW91bnQsIGNvc3RIZWFkLCBidWlsZGluZ0RldGFpbHMsIGNvc3RIZWFkcyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FzZSBDb25zdGFudHMuR1lQU1VNX09SX1BPUF9QTEFTVEVSIDoge1xyXG4gICAgICAgICAgYnVkZ2V0Q29zdEZvcm11bGFlID0gY29uZmlnLmdldChDb25zdGFudHMuQlVER0VURURfQ09TVF9GT1JNVUxBRSArIGNvc3RIZWFkLm5hbWUpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICBjYWxjdWxhdGVCdWRndGVkQ29zdCA9IGJ1ZGdldENvc3RGb3JtdWxhZS5yZXBsYWNlKENvbnN0YW50cy5DQVJQRVRfQVJFQSwgYnVpbGRpbmdEZXRhaWxzLnRvdGFsQ2FycGV0QXJlYU9mVW5pdCk7XHJcbiAgICAgICAgICBidWRnZXRlZENvc3RBbW91bnQgPSBldmFsKGNhbGN1bGF0ZUJ1ZGd0ZWRDb3N0KTtcclxuICAgICAgICAgIHRoaXMuY2FsY3VsYXRlVGh1bWJSdWxlUmVwb3J0Rm9yQ29zdEhlYWQoYnVkZ2V0ZWRDb3N0QW1vdW50LCBjb3N0SGVhZCwgYnVpbGRpbmdEZXRhaWxzLCBjb3N0SGVhZHMpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgQ29uc3RhbnRzLldBVEVSX1BST09GSU5HIDoge1xyXG4gICAgICAgICAgYnVkZ2V0Q29zdEZvcm11bGFlID0gY29uZmlnLmdldChDb25zdGFudHMuQlVER0VURURfQ09TVF9GT1JNVUxBRSArIGNvc3RIZWFkLm5hbWUpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICBjYWxjdWxhdGVCdWRndGVkQ29zdCA9IGJ1ZGdldENvc3RGb3JtdWxhZS5yZXBsYWNlKENvbnN0YW50cy5DQVJQRVRfQVJFQSwgYnVpbGRpbmdEZXRhaWxzLnRvdGFsQ2FycGV0QXJlYU9mVW5pdCk7XHJcbiAgICAgICAgICBidWRnZXRlZENvc3RBbW91bnQgPSBldmFsKGNhbGN1bGF0ZUJ1ZGd0ZWRDb3N0KTtcclxuICAgICAgICAgIHRoaXMuY2FsY3VsYXRlVGh1bWJSdWxlUmVwb3J0Rm9yQ29zdEhlYWQoYnVkZ2V0ZWRDb3N0QW1vdW50LCBjb3N0SGVhZCwgYnVpbGRpbmdEZXRhaWxzLCBjb3N0SGVhZHMpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgQ29uc3RhbnRzLkRFV0FURVJJTkcgOiB7XHJcbiAgICAgICAgICBidWRnZXRDb3N0Rm9ybXVsYWUgPSBjb25maWcuZ2V0KENvbnN0YW50cy5CVURHRVRFRF9DT1NUX0ZPUk1VTEFFICsgY29zdEhlYWQubmFtZSkudG9TdHJpbmcoKTtcclxuICAgICAgICAgIGNhbGN1bGF0ZUJ1ZGd0ZWRDb3N0ID0gYnVkZ2V0Q29zdEZvcm11bGFlLnJlcGxhY2UoQ29uc3RhbnRzLlNBTEVBQkxFX0FSRUEsIGJ1aWxkaW5nRGV0YWlscy50b3RhbFNhbGVhYmxlQXJlYU9mVW5pdCk7XHJcbiAgICAgICAgICBidWRnZXRlZENvc3RBbW91bnQgPSBldmFsKGNhbGN1bGF0ZUJ1ZGd0ZWRDb3N0KTtcclxuICAgICAgICAgIHRoaXMuY2FsY3VsYXRlVGh1bWJSdWxlUmVwb3J0Rm9yQ29zdEhlYWQoYnVkZ2V0ZWRDb3N0QW1vdW50LCBjb3N0SGVhZCwgYnVpbGRpbmdEZXRhaWxzLCBjb3N0SGVhZHMpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgQ29uc3RhbnRzLkdBUkJBR0VfQ0hVVEUgOiB7XHJcbiAgICAgICAgICBidWRnZXRDb3N0Rm9ybXVsYWUgPSBjb25maWcuZ2V0KENvbnN0YW50cy5CVURHRVRFRF9DT1NUX0ZPUk1VTEFFICsgY29zdEhlYWQubmFtZSkudG9TdHJpbmcoKTtcclxuICAgICAgICAgIGNhbGN1bGF0ZUJ1ZGd0ZWRDb3N0ID0gYnVkZ2V0Q29zdEZvcm11bGFlLnJlcGxhY2UoQ29uc3RhbnRzLk5VTV9PRl9GTE9PUlMsIGJ1aWxkaW5nRGV0YWlscy50b3RhbE51bU9mRmxvb3JzKVxyXG4gICAgICAgICAgICAucmVwbGFjZShDb25zdGFudHMuTlVNX09GX1BBUktJTkdfRkxPT1JTLCBidWlsZGluZ0RldGFpbHMubnVtT2ZQYXJraW5nRmxvb3JzKTtcclxuICAgICAgICAgIGJ1ZGdldGVkQ29zdEFtb3VudCA9IGV2YWwoY2FsY3VsYXRlQnVkZ3RlZENvc3QpO1xyXG4gICAgICAgICAgdGhpcy5jYWxjdWxhdGVUaHVtYlJ1bGVSZXBvcnRGb3JDb3N0SGVhZChidWRnZXRlZENvc3RBbW91bnQsIGNvc3RIZWFkLCBidWlsZGluZ0RldGFpbHMsIGNvc3RIZWFkcyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FzZSBDb25zdGFudHMuTElGVCA6IHtcclxuICAgICAgICAgIGJ1ZGdldENvc3RGb3JtdWxhZSA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLkJVREdFVEVEX0NPU1RfRk9STVVMQUUgKyBjb3N0SGVhZC5uYW1lKS50b1N0cmluZygpO1xyXG4gICAgICAgICAgY2FsY3VsYXRlQnVkZ3RlZENvc3QgPSBidWRnZXRDb3N0Rm9ybXVsYWUucmVwbGFjZShDb25zdGFudHMuTlVNX09GX0ZMT09SUywgYnVpbGRpbmdEZXRhaWxzLnRvdGFsTnVtT2ZGbG9vcnMpXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKENvbnN0YW50cy5OVU1fT0ZfTElGVFMsIGJ1aWxkaW5nRGV0YWlscy5udW1PZkxpZnRzKTtcclxuICAgICAgICAgIGJ1ZGdldGVkQ29zdEFtb3VudCA9IGV2YWwoY2FsY3VsYXRlQnVkZ3RlZENvc3QpO1xyXG4gICAgICAgICAgdGhpcy5jYWxjdWxhdGVUaHVtYlJ1bGVSZXBvcnRGb3JDb3N0SGVhZChidWRnZXRlZENvc3RBbW91bnQsIGNvc3RIZWFkLCBidWlsZGluZ0RldGFpbHMsIGNvc3RIZWFkcyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FzZSBDb25zdGFudHMuRE9PUlMgOiB7XHJcbiAgICAgICAgICAvKmJ1ZGdldENvc3RGb3JtdWxhZSA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLkJVREdFVEVEX0NPU1RfRk9STVVMQUUgKyBjb3N0SGVhZC5uYW1lKS50b1N0cmluZygpO1xyXG4gICAgICAgICAgY2FsY3VsYXRlQnVkZ3RlZENvc3QgPSBidWRnZXRDb3N0Rm9ybXVsYWUucmVwbGFjZShDb25zdGFudHMuTlVNX09GX0ZMT09SUywgYnVpbGRpbmdEZXRhaWxzLnRvdGFsTnVtT2ZGbG9vcnMpXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKENvbnN0YW50cy5OVU1fT0ZfTElGVFMsIGJ1aWxkaW5nRGV0YWlscy5udW1PZkxpZnRzKTtcclxuICAgICAgICAgIGJ1ZGdldGVkQ29zdEFtb3VudCA9IGV2YWwoY2FsY3VsYXRlQnVkZ3RlZENvc3QpOyovXHJcbiAgICAgICAgICBidWRnZXRlZENvc3RBbW91bnQgPSAxO1xyXG4gICAgICAgICAgdGhpcy5jYWxjdWxhdGVUaHVtYlJ1bGVSZXBvcnRGb3JDb3N0SGVhZChidWRnZXRlZENvc3RBbW91bnQsIGNvc3RIZWFkLCBidWlsZGluZ0RldGFpbHMsIGNvc3RIZWFkcyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FzZSBDb25zdGFudHMuREFET19PUl9XQUxMX1RJTElORyA6IHtcclxuICAgICAgICAgIC8qYnVkZ2V0Q29zdEZvcm11bGFlID0gY29uZmlnLmdldChDb25zdGFudHMuQlVER0VURURfQ09TVF9GT1JNVUxBRSArIGNvc3RIZWFkLm5hbWUpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICBjYWxjdWxhdGVCdWRndGVkQ29zdCA9IGJ1ZGdldENvc3RGb3JtdWxhZS5yZXBsYWNlKENvbnN0YW50cy5OVU1fT0ZfRkxPT1JTLCBidWlsZGluZ0RldGFpbHMudG90YWxOdW1PZkZsb29ycylcclxuICAgICAgICAgICAgLnJlcGxhY2UoQ29uc3RhbnRzLk5VTV9PRl9MSUZUUywgYnVpbGRpbmdEZXRhaWxzLm51bU9mTGlmdHMpO1xyXG4gICAgICAgICAgYnVkZ2V0ZWRDb3N0QW1vdW50ID0gZXZhbChjYWxjdWxhdGVCdWRndGVkQ29zdCk7Ki9cclxuICAgICAgICAgIGJ1ZGdldGVkQ29zdEFtb3VudCA9IDE7XHJcbiAgICAgICAgICB0aGlzLmNhbGN1bGF0ZVRodW1iUnVsZVJlcG9ydEZvckNvc3RIZWFkKGJ1ZGdldGVkQ29zdEFtb3VudCwgY29zdEhlYWQsIGJ1aWxkaW5nRGV0YWlscywgY29zdEhlYWRzKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXNlIENvbnN0YW50cy5GTE9PUklORyA6IHtcclxuICAgICAgICAgIC8qYnVkZ2V0Q29zdEZvcm11bGFlID0gY29uZmlnLmdldChDb25zdGFudHMuQlVER0VURURfQ09TVF9GT1JNVUxBRSArIGNvc3RIZWFkLm5hbWUpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICBjYWxjdWxhdGVCdWRndGVkQ29zdCA9IGJ1ZGdldENvc3RGb3JtdWxhZS5yZXBsYWNlKENvbnN0YW50cy5OVU1fT0ZfRkxPT1JTLCBidWlsZGluZ0RldGFpbHMudG90YWxOdW1PZkZsb29ycylcclxuICAgICAgICAgICAgLnJlcGxhY2UoQ29uc3RhbnRzLk5VTV9PRl9MSUZUUywgYnVpbGRpbmdEZXRhaWxzLm51bU9mTGlmdHMpO1xyXG4gICAgICAgICAgYnVkZ2V0ZWRDb3N0QW1vdW50ID0gZXZhbChjYWxjdWxhdGVCdWRndGVkQ29zdCk7Ki9cclxuICAgICAgICAgIGJ1ZGdldGVkQ29zdEFtb3VudCA9IDE7XHJcbiAgICAgICAgICB0aGlzLmNhbGN1bGF0ZVRodW1iUnVsZVJlcG9ydEZvckNvc3RIZWFkKGJ1ZGdldGVkQ29zdEFtb3VudCwgY29zdEhlYWQsIGJ1aWxkaW5nRGV0YWlscywgY29zdEhlYWRzKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXNlIENvbnN0YW50cy5FWENBVkFUSU9OIDoge1xyXG4gICAgICAgICAgYnVkZ2V0Q29zdEZvcm11bGFlID0gY29uZmlnLmdldChDb25zdGFudHMuQlVER0VURURfQ09TVF9GT1JNVUxBRSArIGNvc3RIZWFkLm5hbWUpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICBjYWxjdWxhdGVCdWRndGVkQ29zdCA9IGJ1ZGdldENvc3RGb3JtdWxhZS5yZXBsYWNlKENvbnN0YW50cy5QTElOVEhfQVJFQSwgYnVpbGRpbmdEZXRhaWxzLnBsaW50aEFyZWEpO1xyXG4gICAgICAgICAgYnVkZ2V0ZWRDb3N0QW1vdW50ID0gZXZhbChjYWxjdWxhdGVCdWRndGVkQ29zdCk7XHJcbiAgICAgICAgICB0aGlzLmNhbGN1bGF0ZVRodW1iUnVsZVJlcG9ydEZvckNvc3RIZWFkKGJ1ZGdldGVkQ29zdEFtb3VudCwgY29zdEhlYWQsIGJ1aWxkaW5nRGV0YWlscywgY29zdEhlYWRzKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXNlIENvbnN0YW50cy5CQUNLRklMTElOR19QTElOVEggOiB7XHJcbiAgICAgICAgICBidWRnZXRDb3N0Rm9ybXVsYWUgPSBjb25maWcuZ2V0KENvbnN0YW50cy5CVURHRVRFRF9DT1NUX0ZPUk1VTEFFICsgY29zdEhlYWQubmFtZSkudG9TdHJpbmcoKTtcclxuICAgICAgICAgIGNhbGN1bGF0ZUJ1ZGd0ZWRDb3N0ID0gYnVkZ2V0Q29zdEZvcm11bGFlLnJlcGxhY2UoQ29uc3RhbnRzLlBMSU5USF9BUkVBLCBidWlsZGluZ0RldGFpbHMucGxpbnRoQXJlYSk7XHJcbiAgICAgICAgICBidWRnZXRlZENvc3RBbW91bnQgPSBldmFsKGNhbGN1bGF0ZUJ1ZGd0ZWRDb3N0KTtcclxuICAgICAgICAgIHRoaXMuY2FsY3VsYXRlVGh1bWJSdWxlUmVwb3J0Rm9yQ29zdEhlYWQoYnVkZ2V0ZWRDb3N0QW1vdW50LCBjb3N0SGVhZCwgYnVpbGRpbmdEZXRhaWxzLCBjb3N0SGVhZHMpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgQ29uc3RhbnRzLkZMT09SSU5HX1NLSVJUSU5HX1dBTExfVElMSU5HX0RBRE8gOiB7XHJcbiAgICAgICAgICBidWRnZXRDb3N0Rm9ybXVsYWUgPSBjb25maWcuZ2V0KENvbnN0YW50cy5CVURHRVRFRF9DT1NUX0ZPUk1VTEFFICsgY29zdEhlYWQubmFtZSkudG9TdHJpbmcoKTtcclxuICAgICAgICAgIGNhbGN1bGF0ZUJ1ZGd0ZWRDb3N0ID0gYnVkZ2V0Q29zdEZvcm11bGFlLnJlcGxhY2UoQ29uc3RhbnRzLkNBUlBFVF9BUkVBLCBidWlsZGluZ0RldGFpbHMudG90YWxDYXJwZXRBcmVhT2ZVbml0KTtcclxuICAgICAgICAgIGJ1ZGdldGVkQ29zdEFtb3VudCA9IGV2YWwoY2FsY3VsYXRlQnVkZ3RlZENvc3QpO1xyXG4gICAgICAgICAgdGhpcy5jYWxjdWxhdGVUaHVtYlJ1bGVSZXBvcnRGb3JDb3N0SGVhZChidWRnZXRlZENvc3RBbW91bnQsIGNvc3RIZWFkLCBidWlsZGluZ0RldGFpbHMsIGNvc3RIZWFkcyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FzZSBDb25zdGFudHMuV0lORE9XU19TSUxMU19PUl9KQU1CUyA6IHtcclxuICAgICAgICAgIGJ1ZGdldENvc3RGb3JtdWxhZSA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLkJVREdFVEVEX0NPU1RfRk9STVVMQUUgKyBjb3N0SGVhZC5uYW1lKS50b1N0cmluZygpO1xyXG4gICAgICAgICAgY2FsY3VsYXRlQnVkZ3RlZENvc3QgPSBidWRnZXRDb3N0Rm9ybXVsYWUucmVwbGFjZShDb25zdGFudHMuQ0FSUEVUX0FSRUEsIGJ1aWxkaW5nRGV0YWlscy50b3RhbENhcnBldEFyZWFPZlVuaXQpO1xyXG4gICAgICAgICAgYnVkZ2V0ZWRDb3N0QW1vdW50ID0gZXZhbChjYWxjdWxhdGVCdWRndGVkQ29zdCk7XHJcbiAgICAgICAgICB0aGlzLmNhbGN1bGF0ZVRodW1iUnVsZVJlcG9ydEZvckNvc3RIZWFkKGJ1ZGdldGVkQ29zdEFtb3VudCwgY29zdEhlYWQsIGJ1aWxkaW5nRGV0YWlscywgY29zdEhlYWRzKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXNlIENvbnN0YW50cy5ET09SU19XSVRIX0ZSQU1FU19BTkRfSEFSRFdBUkUgOiB7XHJcbiAgICAgICAgICBidWRnZXRDb3N0Rm9ybXVsYWUgPSBjb25maWcuZ2V0KENvbnN0YW50cy5CVURHRVRFRF9DT1NUX0ZPUk1VTEFFICsgY29zdEhlYWQubmFtZSkudG9TdHJpbmcoKTtcclxuICAgICAgICAgIGNhbGN1bGF0ZUJ1ZGd0ZWRDb3N0ID0gYnVkZ2V0Q29zdEZvcm11bGFlLnJlcGxhY2UoQ29uc3RhbnRzLk5VTV9PRl9PTkVfQkhLLCBidWlsZGluZ0RldGFpbHMubnVtT2ZPbmVCSEspXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKENvbnN0YW50cy5OVU1fT0ZfVFdPX0JISywgYnVpbGRpbmdEZXRhaWxzLm51bU9mVHdvQkhLKVxyXG4gICAgICAgICAgICAucmVwbGFjZShDb25zdGFudHMuTlVNX09GX1RIUkVFX0JISywgYnVpbGRpbmdEZXRhaWxzLm51bU9mVGhyZWVCSEspXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKENvbnN0YW50cy5OVU1fT0ZfRk9VUl9CSEssIGJ1aWxkaW5nRGV0YWlscy5udW1PZkZvdXJCSEspXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKENvbnN0YW50cy5OVU1fT0ZfRklWRV9CSEssIGJ1aWxkaW5nRGV0YWlscy5udW1PZkZpdmVCSEspO1xyXG4gICAgICAgICAgYnVkZ2V0ZWRDb3N0QW1vdW50ID0gZXZhbChjYWxjdWxhdGVCdWRndGVkQ29zdCk7XHJcbiAgICAgICAgICB0aGlzLmNhbGN1bGF0ZVRodW1iUnVsZVJlcG9ydEZvckNvc3RIZWFkKGJ1ZGdldGVkQ29zdEFtb3VudCwgY29zdEhlYWQsIGJ1aWxkaW5nRGV0YWlscywgY29zdEhlYWRzKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXNlIENvbnN0YW50cy5XSU5ET1dTX0FORF9HTEFTU19ET09SUyA6IHtcclxuICAgICAgICAgIGJ1ZGdldENvc3RGb3JtdWxhZSA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLkJVREdFVEVEX0NPU1RfRk9STVVMQUUgKyBjb3N0SGVhZC5uYW1lKS50b1N0cmluZygpO1xyXG4gICAgICAgICAgY2FsY3VsYXRlQnVkZ3RlZENvc3QgPSBidWRnZXRDb3N0Rm9ybXVsYWUucmVwbGFjZShDb25zdGFudHMuQ0FSUEVUX0FSRUEsIGJ1aWxkaW5nRGV0YWlscy50b3RhbENhcnBldEFyZWFPZlVuaXQpO1xyXG4gICAgICAgICAgYnVkZ2V0ZWRDb3N0QW1vdW50ID0gZXZhbChjYWxjdWxhdGVCdWRndGVkQ29zdCk7XHJcbiAgICAgICAgICB0aGlzLmNhbGN1bGF0ZVRodW1iUnVsZVJlcG9ydEZvckNvc3RIZWFkKGJ1ZGdldGVkQ29zdEFtb3VudCwgY29zdEhlYWQsIGJ1aWxkaW5nRGV0YWlscywgY29zdEhlYWRzKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXNlIENvbnN0YW50cy5FTEVDVFJJRklDQVRJT04gOiB7XHJcbiAgICAgICAgICBidWRnZXRDb3N0Rm9ybXVsYWUgPSBjb25maWcuZ2V0KENvbnN0YW50cy5CVURHRVRFRF9DT1NUX0ZPUk1VTEFFICsgY29zdEhlYWQubmFtZSkudG9TdHJpbmcoKTtcclxuICAgICAgICAgIGNhbGN1bGF0ZUJ1ZGd0ZWRDb3N0ID0gYnVkZ2V0Q29zdEZvcm11bGFlLnJlcGxhY2UoQ29uc3RhbnRzLkNBUlBFVF9BUkVBLCBidWlsZGluZ0RldGFpbHMudG90YWxDYXJwZXRBcmVhT2ZVbml0KTtcclxuICAgICAgICAgIGJ1ZGdldGVkQ29zdEFtb3VudCA9IGV2YWwoY2FsY3VsYXRlQnVkZ3RlZENvc3QpO1xyXG4gICAgICAgICAgdGhpcy5jYWxjdWxhdGVUaHVtYlJ1bGVSZXBvcnRGb3JDb3N0SGVhZChidWRnZXRlZENvc3RBbW91bnQsIGNvc3RIZWFkLCBidWlsZGluZ0RldGFpbHMsIGNvc3RIZWFkcyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FzZSBDb25zdGFudHMuUExVTUJJTkcgOiB7XHJcbiAgICAgICAgICBidWRnZXRDb3N0Rm9ybXVsYWUgPSBjb25maWcuZ2V0KENvbnN0YW50cy5CVURHRVRFRF9DT1NUX0ZPUk1VTEFFICsgY29zdEhlYWQubmFtZSkudG9TdHJpbmcoKTtcclxuICAgICAgICAgIGNhbGN1bGF0ZUJ1ZGd0ZWRDb3N0ID0gYnVkZ2V0Q29zdEZvcm11bGFlLnJlcGxhY2UoQ29uc3RhbnRzLk5VTV9PRl9PTkVfQkhLLCBidWlsZGluZ0RldGFpbHMubnVtT2ZPbmVCSEspXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKENvbnN0YW50cy5OVU1fT0ZfVFdPX0JISywgYnVpbGRpbmdEZXRhaWxzLm51bU9mVHdvQkhLKVxyXG4gICAgICAgICAgICAucmVwbGFjZShDb25zdGFudHMuTlVNX09GX1RIUkVFX0JISywgYnVpbGRpbmdEZXRhaWxzLm51bU9mVGhyZWVCSEspXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKENvbnN0YW50cy5OVU1fT0ZfRk9VUl9CSEssIGJ1aWxkaW5nRGV0YWlscy5udW1PZkZvdXJCSEspXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKENvbnN0YW50cy5OVU1fT0ZfRklWRV9CSEssIGJ1aWxkaW5nRGV0YWlscy5udW1PZkZpdmVCSEspXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKENvbnN0YW50cy5OVU1fT0ZfT05FX0JISywgYnVpbGRpbmdEZXRhaWxzLm51bU9mT25lQkhLKVxyXG4gICAgICAgICAgICAucmVwbGFjZShDb25zdGFudHMuTlVNX09GX1RXT19CSEssIGJ1aWxkaW5nRGV0YWlscy5udW1PZlR3b0JISylcclxuICAgICAgICAgICAgLnJlcGxhY2UoQ29uc3RhbnRzLk5VTV9PRl9USFJFRV9CSEssIGJ1aWxkaW5nRGV0YWlscy5udW1PZlRocmVlQkhLKVxyXG4gICAgICAgICAgICAucmVwbGFjZShDb25zdGFudHMuTlVNX09GX0ZPVVJfQkhLLCBidWlsZGluZ0RldGFpbHMubnVtT2ZGb3VyQkhLKVxyXG4gICAgICAgICAgICAucmVwbGFjZShDb25zdGFudHMuTlVNX09GX0ZJVkVfQkhLLCBidWlsZGluZ0RldGFpbHMubnVtT2ZGaXZlQkhLKTtcclxuICAgICAgICAgIGJ1ZGdldGVkQ29zdEFtb3VudCA9IGV2YWwoY2FsY3VsYXRlQnVkZ3RlZENvc3QpO1xyXG4gICAgICAgICAgdGhpcy5jYWxjdWxhdGVUaHVtYlJ1bGVSZXBvcnRGb3JDb3N0SGVhZChidWRnZXRlZENvc3RBbW91bnQsIGNvc3RIZWFkLCBidWlsZGluZ0RldGFpbHMsIGNvc3RIZWFkcyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FzZSBDb25zdGFudHMuRUxFQ1RSSUNBTF9MSUdIVF9GSVRUSU5HU19JTl9DT01NT05fQVJFQVMgOiB7XHJcbiAgICAgICAgICBidWRnZXRDb3N0Rm9ybXVsYWUgPSBjb25maWcuZ2V0KENvbnN0YW50cy5CVURHRVRFRF9DT1NUX0ZPUk1VTEFFICsgY29zdEhlYWQubmFtZSkudG9TdHJpbmcoKTtcclxuICAgICAgICAgIGNhbGN1bGF0ZUJ1ZGd0ZWRDb3N0ID0gYnVkZ2V0Q29zdEZvcm11bGFlLnJlcGxhY2UoQ29uc3RhbnRzLkNBUlBFVF9BUkVBLCBidWlsZGluZ0RldGFpbHMudG90YWxDYXJwZXRBcmVhT2ZVbml0KTtcclxuICAgICAgICAgIGJ1ZGdldGVkQ29zdEFtb3VudCA9IGV2YWwoY2FsY3VsYXRlQnVkZ3RlZENvc3QpO1xyXG4gICAgICAgICAgdGhpcy5jYWxjdWxhdGVUaHVtYlJ1bGVSZXBvcnRGb3JDb3N0SGVhZChidWRnZXRlZENvc3RBbW91bnQsIGNvc3RIZWFkLCBidWlsZGluZ0RldGFpbHMsIGNvc3RIZWFkcyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FzZSBDb25zdGFudHMuUEVTVF9DT05UUk9MIDoge1xyXG4gICAgICAgICAgYnVkZ2V0Q29zdEZvcm11bGFlID0gY29uZmlnLmdldChDb25zdGFudHMuQlVER0VURURfQ09TVF9GT1JNVUxBRSArIGNvc3RIZWFkLm5hbWUpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICBjYWxjdWxhdGVCdWRndGVkQ29zdCA9IGJ1ZGdldENvc3RGb3JtdWxhZS5yZXBsYWNlKENvbnN0YW50cy5DQVJQRVRfQVJFQSwgYnVpbGRpbmdEZXRhaWxzLnRvdGFsQ2FycGV0QXJlYU9mVW5pdCk7XHJcbiAgICAgICAgICBidWRnZXRlZENvc3RBbW91bnQgPSBldmFsKGNhbGN1bGF0ZUJ1ZGd0ZWRDb3N0KTtcclxuICAgICAgICAgIHRoaXMuY2FsY3VsYXRlVGh1bWJSdWxlUmVwb3J0Rm9yQ29zdEhlYWQoYnVkZ2V0ZWRDb3N0QW1vdW50LCBjb3N0SGVhZCwgYnVpbGRpbmdEZXRhaWxzLCBjb3N0SGVhZHMpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgQ29uc3RhbnRzLlNPTEFSX1dBVEVSX0hFQVRJTkdfU1lTVEVNIDoge1xyXG4gICAgICAgICAgYnVkZ2V0Q29zdEZvcm11bGFlID0gY29uZmlnLmdldChDb25zdGFudHMuQlVER0VURURfQ09TVF9GT1JNVUxBRSArIGNvc3RIZWFkLm5hbWUpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICBjYWxjdWxhdGVCdWRndGVkQ29zdCA9IGJ1ZGdldENvc3RGb3JtdWxhZS5yZXBsYWNlKENvbnN0YW50cy5DQVJQRVRfQVJFQSwgYnVpbGRpbmdEZXRhaWxzLnRvdGFsQ2FycGV0QXJlYU9mVW5pdCk7XHJcbiAgICAgICAgICBidWRnZXRlZENvc3RBbW91bnQgPSBldmFsKGNhbGN1bGF0ZUJ1ZGd0ZWRDb3N0KTtcclxuICAgICAgICAgIHRoaXMuY2FsY3VsYXRlVGh1bWJSdWxlUmVwb3J0Rm9yQ29zdEhlYWQoYnVkZ2V0ZWRDb3N0QW1vdW50LCBjb3N0SGVhZCwgYnVpbGRpbmdEZXRhaWxzLCBjb3N0SGVhZHMpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgQ29uc3RhbnRzLlBJUEVEX0dBU19TWVNURU0gOiB7XHJcbiAgICAgICAgICBidWRnZXRDb3N0Rm9ybXVsYWUgPSBjb25maWcuZ2V0KENvbnN0YW50cy5CVURHRVRFRF9DT1NUX0ZPUk1VTEFFICsgY29zdEhlYWQubmFtZSkudG9TdHJpbmcoKTtcclxuICAgICAgICAgIGNhbGN1bGF0ZUJ1ZGd0ZWRDb3N0ID0gYnVkZ2V0Q29zdEZvcm11bGFlLnJlcGxhY2UoQ29uc3RhbnRzLk5VTV9PRl9PTkVfQkhLLCBidWlsZGluZ0RldGFpbHMubnVtT2ZPbmVCSEspXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKENvbnN0YW50cy5OVU1fT0ZfVFdPX0JISywgYnVpbGRpbmdEZXRhaWxzLm51bU9mVHdvQkhLKVxyXG4gICAgICAgICAgICAucmVwbGFjZShDb25zdGFudHMuTlVNX09GX1RIUkVFX0JISywgYnVpbGRpbmdEZXRhaWxzLm51bU9mVGhyZWVCSEspXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKENvbnN0YW50cy5OVU1fT0ZfRk9VUl9CSEssIGJ1aWxkaW5nRGV0YWlscy5udW1PZkZvdXJCSEspXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKENvbnN0YW50cy5OVU1fT0ZfRklWRV9CSEssIGJ1aWxkaW5nRGV0YWlscy5udW1PZkZpdmVCSEspO1xyXG4gICAgICAgICAgYnVkZ2V0ZWRDb3N0QW1vdW50ID0gZXZhbChjYWxjdWxhdGVCdWRndGVkQ29zdCk7XHJcbiAgICAgICAgICB0aGlzLmNhbGN1bGF0ZVRodW1iUnVsZVJlcG9ydEZvckNvc3RIZWFkKGJ1ZGdldGVkQ29zdEFtb3VudCwgY29zdEhlYWQsIGJ1aWxkaW5nRGV0YWlscywgY29zdEhlYWRzKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXNlIENvbnN0YW50cy5TS1lfTE9VTkdFX09OX1RPUF9URVJSQUNFIDoge1xyXG4gICAgICAgICAgYnVkZ2V0Q29zdEZvcm11bGFlID0gY29uZmlnLmdldChDb25zdGFudHMuQlVER0VURURfQ09TVF9GT1JNVUxBRSArIGNvc3RIZWFkLm5hbWUpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICBjYWxjdWxhdGVCdWRndGVkQ29zdCA9IGJ1ZGdldENvc3RGb3JtdWxhZS5yZXBsYWNlKENvbnN0YW50cy5TTEFCX0FSRUEsIGJ1aWxkaW5nRGV0YWlscy50b3RhbFNsYWJBcmVhKVxyXG4gICAgICAgICAgICAucmVwbGFjZShDb25zdGFudHMuTlVNX09GX0ZMT09SUywgYnVpbGRpbmdEZXRhaWxzLnRvdGFsTnVtT2ZGbG9vcnMpXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKENvbnN0YW50cy5OVU1fT0ZfUEFSS0lOR19GTE9PUlMsIGJ1aWxkaW5nRGV0YWlscy5udW1PZlBhcmtpbmdGbG9vcnMpO1xyXG4gICAgICAgICAgYnVkZ2V0ZWRDb3N0QW1vdW50ID0gZXZhbChjYWxjdWxhdGVCdWRndGVkQ29zdCk7XHJcbiAgICAgICAgICB0aGlzLmNhbGN1bGF0ZVRodW1iUnVsZVJlcG9ydEZvckNvc3RIZWFkKGJ1ZGdldGVkQ29zdEFtb3VudCwgY29zdEhlYWQsIGJ1aWxkaW5nRGV0YWlscywgY29zdEhlYWRzKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXNlIENvbnN0YW50cy5GSVJFX0ZJR0hUSU5HX1NZU1RFTSA6IHtcclxuICAgICAgICAgIGJ1ZGdldENvc3RGb3JtdWxhZSA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLkJVREdFVEVEX0NPU1RfRk9STVVMQUUgKyBjb3N0SGVhZC5uYW1lKS50b1N0cmluZygpO1xyXG4gICAgICAgICAgY2FsY3VsYXRlQnVkZ3RlZENvc3QgPSBidWRnZXRDb3N0Rm9ybXVsYWUucmVwbGFjZShDb25zdGFudHMuTlVNX09GX0ZMT09SUywgYnVpbGRpbmdEZXRhaWxzLnRvdGFsTnVtT2ZGbG9vcnMpO1xyXG4gICAgICAgICAgYnVkZ2V0ZWRDb3N0QW1vdW50ID0gZXZhbChjYWxjdWxhdGVCdWRndGVkQ29zdCk7XHJcbiAgICAgICAgICB0aGlzLmNhbGN1bGF0ZVRodW1iUnVsZVJlcG9ydEZvckNvc3RIZWFkKGJ1ZGdldGVkQ29zdEFtb3VudCwgY29zdEhlYWQsIGJ1aWxkaW5nRGV0YWlscywgY29zdEhlYWRzKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXNlIENvbnN0YW50cy5TRUNVUklUWV9BVVRPTUFUSU9OIDoge1xyXG4gICAgICAgICAgYnVkZ2V0Q29zdEZvcm11bGFlID0gY29uZmlnLmdldChDb25zdGFudHMuQlVER0VURURfQ09TVF9GT1JNVUxBRSArIGNvc3RIZWFkLm5hbWUpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAvKmNhbGN1bGF0ZUJ1ZGd0ZWRDb3N0ID0gYnVkZ2V0Q29zdEZvcm11bGFlLnJlcGxhY2UoQ29uc3RhbnRzLk5VTV9PRl9PTkVfQkhLLCBidWlsZGluZ0RldGFpbHMubnVtT2ZPbmVCSEspXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKENvbnN0YW50cy5OVU1fT0ZfVFdPX0JISywgYnVpbGRpbmdEZXRhaWxzLm51bU9mVHdvQkhLKVxyXG4gICAgICAgICAgICAucmVwbGFjZShDb25zdGFudHMuTlVNX09GX1RIUkVFX0JISywgYnVpbGRpbmdEZXRhaWxzLm51bU9mVGhyZWVCSEspXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKENvbnN0YW50cy5OVU1fT0ZfRk9VUl9CSEssIGJ1aWxkaW5nRGV0YWlscy5udW1PZkZvdXJCSEspXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKENvbnN0YW50cy5OVU1fT0ZfRklWRV9CSEssIGJ1aWxkaW5nRGV0YWlscy5udW1PZkZpdmVCSEspXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKENvbnN0YW50cy5UT1RBTF9OVU1fT0ZfQlVJTERJTkdTLCBidWlsZGluZ0RldGFpbHMubnVtT2ZGaXZlQkhLKTsgLy90b3RhbCBudW1iZXIgb2YgYnVpbGRpbmdzXHJcbiAgICAgICAgICBidWRnZXRlZENvc3RBbW91bnQgPSBldmFsKGNhbGN1bGF0ZUJ1ZGd0ZWRDb3N0KTsqL1xyXG4gICAgICAgICAgYnVkZ2V0ZWRDb3N0QW1vdW50ID0gMTtcclxuICAgICAgICAgIHRoaXMuY2FsY3VsYXRlVGh1bWJSdWxlUmVwb3J0Rm9yQ29zdEhlYWQoYnVkZ2V0ZWRDb3N0QW1vdW50LCBjb3N0SGVhZCwgYnVpbGRpbmdEZXRhaWxzLCBjb3N0SGVhZHMpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgQ29uc3RhbnRzLlNIT1dFUl9FTkNMT1NVUkVTIDoge1xyXG4gICAgICAgICAgYnVkZ2V0Q29zdEZvcm11bGFlID0gY29uZmlnLmdldChDb25zdGFudHMuQlVER0VURURfQ09TVF9GT1JNVUxBRSArIGNvc3RIZWFkLm5hbWUpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICBjYWxjdWxhdGVCdWRndGVkQ29zdCA9IGJ1ZGdldENvc3RGb3JtdWxhZS5yZXBsYWNlKENvbnN0YW50cy5OVU1fT0ZfT05FX0JISywgYnVpbGRpbmdEZXRhaWxzLm51bU9mT25lQkhLKVxyXG4gICAgICAgICAgICAucmVwbGFjZShDb25zdGFudHMuTlVNX09GX1RXT19CSEssIGJ1aWxkaW5nRGV0YWlscy5udW1PZlR3b0JISylcclxuICAgICAgICAgICAgLnJlcGxhY2UoQ29uc3RhbnRzLk5VTV9PRl9USFJFRV9CSEssIGJ1aWxkaW5nRGV0YWlscy5udW1PZlRocmVlQkhLKVxyXG4gICAgICAgICAgICAucmVwbGFjZShDb25zdGFudHMuTlVNX09GX0ZPVVJfQkhLLCBidWlsZGluZ0RldGFpbHMubnVtT2ZGb3VyQkhLKVxyXG4gICAgICAgICAgICAucmVwbGFjZShDb25zdGFudHMuTlVNX09GX0ZJVkVfQkhLLCBidWlsZGluZ0RldGFpbHMubnVtT2ZGaXZlQkhLKTtcclxuICAgICAgICAgIGJ1ZGdldGVkQ29zdEFtb3VudCA9IGV2YWwoY2FsY3VsYXRlQnVkZ3RlZENvc3QpO1xyXG4gICAgICAgICAgdGhpcy5jYWxjdWxhdGVUaHVtYlJ1bGVSZXBvcnRGb3JDb3N0SGVhZChidWRnZXRlZENvc3RBbW91bnQsIGNvc3RIZWFkLCBidWlsZGluZ0RldGFpbHMsIGNvc3RIZWFkcyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FzZSBDb25zdGFudHMuRkFMU0VfQ0VJTElORyA6IHtcclxuICAgICAgICAgIGJ1ZGdldENvc3RGb3JtdWxhZSA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLkJVREdFVEVEX0NPU1RfRk9STVVMQUUgKyBjb3N0SGVhZC5uYW1lKS50b1N0cmluZygpO1xyXG4gICAgICAgICAgY2FsY3VsYXRlQnVkZ3RlZENvc3QgPSBidWRnZXRDb3N0Rm9ybXVsYWUucmVwbGFjZShDb25zdGFudHMuTlVNX09GX09ORV9CSEssIGJ1aWxkaW5nRGV0YWlscy5udW1PZk9uZUJISylcclxuICAgICAgICAgICAgLnJlcGxhY2UoQ29uc3RhbnRzLk5VTV9PRl9UV09fQkhLLCBidWlsZGluZ0RldGFpbHMubnVtT2ZUd29CSEspXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKENvbnN0YW50cy5OVU1fT0ZfVEhSRUVfQkhLLCBidWlsZGluZ0RldGFpbHMubnVtT2ZUaHJlZUJISylcclxuICAgICAgICAgICAgLnJlcGxhY2UoQ29uc3RhbnRzLk5VTV9PRl9GT1VSX0JISywgYnVpbGRpbmdEZXRhaWxzLm51bU9mRm91ckJISylcclxuICAgICAgICAgICAgLnJlcGxhY2UoQ29uc3RhbnRzLk5VTV9PRl9GSVZFX0JISywgYnVpbGRpbmdEZXRhaWxzLm51bU9mRml2ZUJISyk7XHJcbiAgICAgICAgICBidWRnZXRlZENvc3RBbW91bnQgPSBldmFsKGNhbGN1bGF0ZUJ1ZGd0ZWRDb3N0KTtcclxuICAgICAgICAgIHRoaXMuY2FsY3VsYXRlVGh1bWJSdWxlUmVwb3J0Rm9yQ29zdEhlYWQoYnVkZ2V0ZWRDb3N0QW1vdW50LCBjb3N0SGVhZCwgYnVpbGRpbmdEZXRhaWxzLCBjb3N0SGVhZHMpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgQ29uc3RhbnRzLlNQRUNJQUxfRUxFVkFUSU9OQUxfRkVBVFVSRVNfSU5fRlJQX0ZFUlJPX0dSQyA6IHtcclxuICAgICAgICAgIGJ1ZGdldENvc3RGb3JtdWxhZSA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLkJVREdFVEVEX0NPU1RfRk9STVVMQUUgKyBjb3N0SGVhZC5uYW1lKS50b1N0cmluZygpO1xyXG4gICAgICAgICAgY2FsY3VsYXRlQnVkZ3RlZENvc3QgPSBidWRnZXRDb3N0Rm9ybXVsYWUucmVwbGFjZShDb25zdGFudHMuQ0FSUEVUX0FSRUEsIGJ1aWxkaW5nRGV0YWlscy50b3RhbENhcnBldEFyZWFPZlVuaXQpO1xyXG4gICAgICAgICAgYnVkZ2V0ZWRDb3N0QW1vdW50ID0gZXZhbChjYWxjdWxhdGVCdWRndGVkQ29zdCk7XHJcbiAgICAgICAgICB0aGlzLmNhbGN1bGF0ZVRodW1iUnVsZVJlcG9ydEZvckNvc3RIZWFkKGJ1ZGdldGVkQ29zdEFtb3VudCwgY29zdEhlYWQsIGJ1aWxkaW5nRGV0YWlscywgY29zdEhlYWRzKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXNlIENvbnN0YW50cy5CT0FSRFNfQU5EX1NJR05BR0VTX0lOU0lERV9CVUlMRElORyA6IHtcclxuICAgICAgICAgIGJ1ZGdldENvc3RGb3JtdWxhZSA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLkJVREdFVEVEX0NPU1RfRk9STVVMQUUgKyBjb3N0SGVhZC5uYW1lKS50b1N0cmluZygpO1xyXG4gICAgICAgICAgY2FsY3VsYXRlQnVkZ3RlZENvc3QgPSBidWRnZXRDb3N0Rm9ybXVsYWUucmVwbGFjZShDb25zdGFudHMuTlVNX09GX09ORV9CSEssIGJ1aWxkaW5nRGV0YWlscy5udW1PZk9uZUJISylcclxuICAgICAgICAgICAgLnJlcGxhY2UoQ29uc3RhbnRzLk5VTV9PRl9UV09fQkhLLCBidWlsZGluZ0RldGFpbHMubnVtT2ZUd29CSEspXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKENvbnN0YW50cy5OVU1fT0ZfVEhSRUVfQkhLLCBidWlsZGluZ0RldGFpbHMubnVtT2ZUaHJlZUJISylcclxuICAgICAgICAgICAgLnJlcGxhY2UoQ29uc3RhbnRzLk5VTV9PRl9GT1VSX0JISywgYnVpbGRpbmdEZXRhaWxzLm51bU9mRm91ckJISylcclxuICAgICAgICAgICAgLnJlcGxhY2UoQ29uc3RhbnRzLk5VTV9PRl9GSVZFX0JISywgYnVpbGRpbmdEZXRhaWxzLm51bU9mRml2ZUJISylcclxuICAgICAgICAgICAgLnJlcGxhY2UoQ29uc3RhbnRzLk5VTV9PRl9GTE9PUlMsIGJ1aWxkaW5nRGV0YWlscy50b3RhbE51bU9mRmxvb3JzKTtcclxuICAgICAgICAgIGJ1ZGdldGVkQ29zdEFtb3VudCA9IGV2YWwoY2FsY3VsYXRlQnVkZ3RlZENvc3QpO1xyXG4gICAgICAgICAgdGhpcy5jYWxjdWxhdGVUaHVtYlJ1bGVSZXBvcnRGb3JDb3N0SGVhZChidWRnZXRlZENvc3RBbW91bnQsIGNvc3RIZWFkLCBidWlsZGluZ0RldGFpbHMsIGNvc3RIZWFkcyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgZGVmYXVsdCA6IHtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIHJldHVybiBjb3N0SGVhZHM7XHJcbiAgfVxyXG5cclxuICBjYWxjdWxhdGVCdWRnZXRDb3N0Rm9yQ29tbW9uQW1tZW5pdGllcyhjb3N0SGVhZHNSYXRlQW5hbHlzaXM6IGFueSwgcHJvamVjdERldGFpbHM6IFByb2plY3QpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGNhbGN1bGF0ZUJ1ZGdldENvc3RGb3JDb21tb25BbW1lbml0aWVzIGhhcyBiZWVuIGhpdCcpO1xyXG5cclxuICAgIGxldCBjb3N0SGVhZHM6IEFycmF5PENvc3RIZWFkPiA9IG5ldyBBcnJheTxDb3N0SGVhZD4oKTtcclxuICAgIGxldCBidWRnZXRlZENvc3RBbW91bnQ6IG51bWJlcjtcclxuICAgIGxldCBidWRnZXRDb3N0Rm9ybXVsYWU6IHN0cmluZztcclxuICAgIGxldCBjYWxjdWxhdGVCdWRndGVkQ29zdDogc3RyaW5nO1xyXG5cclxuICAgIGxldCBjYWxjdWxhdGVQcm9qZWN0RGF0YSA9ICdTRUxFQ1QgUk9VTkQoU1VNKGJ1aWxkaW5nLnRvdGFsQ2FycGV0QXJlYU9mVW5pdCksMikgQVMgdG90YWxDYXJwZXRBcmVhLCAnICtcclxuICAgICAgJ1JPVU5EKFNVTShidWlsZGluZy50b3RhbFNsYWJBcmVhKSwyKSBBUyB0b3RhbFNsYWJBcmVhUHJvamVjdCwnICtcclxuICAgICAgJ1JPVU5EKFNVTShidWlsZGluZy50b3RhbFNhbGVhYmxlQXJlYU9mVW5pdCksMikgQVMgdG90YWxTYWxlYWJsZUFyZWEgIEZST00gPyBBUyBidWlsZGluZyc7XHJcbiAgICBsZXQgcHJvamVjdERhdGEgPSBhbGFzcWwoY2FsY3VsYXRlUHJvamVjdERhdGEsIFtwcm9qZWN0RGV0YWlscy5idWlsZGluZ3NdKTtcclxuICAgIGxldCB0b3RhbFNsYWJBcmVhT2ZQcm9qZWN0OiBudW1iZXIgPSBwcm9qZWN0RGF0YVswXS50b3RhbFNsYWJBcmVhUHJvamVjdDtcclxuICAgIGxldCB0b3RhbFNhbGVhYmxlQXJlYU9mUHJvamVjdDogbnVtYmVyID0gcHJvamVjdERhdGFbMF0udG90YWxTYWxlYWJsZUFyZWE7XHJcbiAgICBsZXQgdG90YWxDYXJwZXRBcmVhT2ZQcm9qZWN0OiBudW1iZXIgPSBwcm9qZWN0RGF0YVswXS50b3RhbENhcnBldEFyZWE7XHJcblxyXG4gICAgZm9yIChsZXQgY29zdEhlYWQgb2YgY29zdEhlYWRzUmF0ZUFuYWx5c2lzKSB7XHJcblxyXG4gICAgICBzd2l0Y2ggKGNvc3RIZWFkLm5hbWUpIHtcclxuXHJcbiAgICAgICAgY2FzZSBDb25zdGFudHMuU0FGRVRZX01FQVNVUkVTIDoge1xyXG4gICAgICAgICAgYnVkZ2V0Q29zdEZvcm11bGFlID0gY29uZmlnLmdldChDb25zdGFudHMuQlVER0VURURfQ09TVF9GT1JNVUxBRSArIGNvc3RIZWFkLm5hbWUpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICBjYWxjdWxhdGVCdWRndGVkQ29zdCA9IGJ1ZGdldENvc3RGb3JtdWxhZS5yZXBsYWNlKENvbnN0YW50cy5DQVJQRVRfQVJFQSwgdG90YWxDYXJwZXRBcmVhT2ZQcm9qZWN0KTtcclxuICAgICAgICAgIGJ1ZGdldGVkQ29zdEFtb3VudCA9IGV2YWwoY2FsY3VsYXRlQnVkZ3RlZENvc3QpO1xyXG4gICAgICAgICAgdGhpcy5jYWxjdWxhdGVUaHVtYlJ1bGVSZXBvcnRGb3JQcm9qZWN0Q29zdEhlYWQoYnVkZ2V0ZWRDb3N0QW1vdW50LCBjb3N0SGVhZCwgcHJvamVjdERldGFpbHMsIGNvc3RIZWFkcyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FzZSBDb25zdGFudHMuQ0xVQl9IT1VTRSA6IHtcclxuICAgICAgICAgIGJ1ZGdldENvc3RGb3JtdWxhZSA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLkJVREdFVEVEX0NPU1RfRk9STVVMQUUgKyBjb3N0SGVhZC5uYW1lKS50b1N0cmluZygpO1xyXG4gICAgICAgICAgY2FsY3VsYXRlQnVkZ3RlZENvc3QgPSBidWRnZXRDb3N0Rm9ybXVsYWUucmVwbGFjZShDb25zdGFudHMuVE9UQUxfU0xBQl9BUkVBX09GX0NMVUJfSE9VU0UsIHByb2plY3REZXRhaWxzLnNsYWJBcmVhKTtcclxuICAgICAgICAgIGJ1ZGdldGVkQ29zdEFtb3VudCA9IGV2YWwoY2FsY3VsYXRlQnVkZ3RlZENvc3QpO1xyXG4gICAgICAgICAgdGhpcy5jYWxjdWxhdGVUaHVtYlJ1bGVSZXBvcnRGb3JQcm9qZWN0Q29zdEhlYWQoYnVkZ2V0ZWRDb3N0QW1vdW50LCBjb3N0SGVhZCwgcHJvamVjdERldGFpbHMsIGNvc3RIZWFkcyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FzZSBDb25zdGFudHMuU1dJTU1JTkdfUE9PTCA6IHtcclxuICAgICAgICAgIGJ1ZGdldENvc3RGb3JtdWxhZSA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLkJVREdFVEVEX0NPU1RfRk9STVVMQUUgKyBjb3N0SGVhZC5uYW1lKS50b1N0cmluZygpO1xyXG4gICAgICAgICAgY2FsY3VsYXRlQnVkZ3RlZENvc3QgPSBidWRnZXRDb3N0Rm9ybXVsYWUucmVwbGFjZShDb25zdGFudHMuU1dJTU1JTkdfUE9PTF9DQVBBQ0lUWSwgcHJvamVjdERldGFpbHMucG9vbENhcGFjaXR5KTtcclxuICAgICAgICAgIGJ1ZGdldGVkQ29zdEFtb3VudCA9IGV2YWwoY2FsY3VsYXRlQnVkZ3RlZENvc3QpO1xyXG4gICAgICAgICAgdGhpcy5jYWxjdWxhdGVUaHVtYlJ1bGVSZXBvcnRGb3JQcm9qZWN0Q29zdEhlYWQoYnVkZ2V0ZWRDb3N0QW1vdW50LCBjb3N0SGVhZCwgcHJvamVjdERldGFpbHMsIGNvc3RIZWFkcyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgZGVmYXVsdCA6IHtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIHJldHVybiBjb3N0SGVhZHM7XHJcbiAgfVxyXG5cclxuICBhZGROZXdDZW50cmFsaXplZFJhdGVGb3JCdWlsZGluZyhidWlsZGluZ0lkOiBzdHJpbmcsIHJhdGVJdGVtOiBhbnkpIHtcclxuICAgIHJldHVybiBuZXcgQ0NQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlOiBhbnksIHJlamVjdDogYW55KSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdjcmVhdGVQcm9taXNlRm9yQWRkaW5nTmV3UmF0ZUl0ZW0gaGFzIGJlZW4gaGl0IGZvciBidWlsZGluZ0lkOiAnICsgYnVpbGRpbmdJZCArICcsIHJhdGVJdGVtIDogJyArIHJhdGVJdGVtKTtcclxuXHJcbiAgICAgIGxldCBidWlsZGluZ1JlcG9zaXRvcnkgPSBuZXcgQnVpbGRpbmdSZXBvc2l0b3J5KCk7XHJcbiAgICAgIGxldCBxdWVyeUFkZE5ld1JhdGVJdGVtID0geydfaWQnOiBidWlsZGluZ0lkfTtcclxuICAgICAgbGV0IGFkZE5ld1JhdGVSYXRlRGF0YSA9IHskcHVzaDogeydyYXRlcyc6IHJhdGVJdGVtfX07XHJcbiAgICAgIGJ1aWxkaW5nUmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5QWRkTmV3UmF0ZUl0ZW0sIGFkZE5ld1JhdGVSYXRlRGF0YSwge25ldzogdHJ1ZX0sIChlcnJvcjogRXJyb3IsIHJlc3VsdDogQnVpbGRpbmcpID0+IHtcclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgIHJlamVjdChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSkuY2F0Y2goZnVuY3Rpb24gKGU6IGFueSkge1xyXG4gICAgICBsb2dnZXIuZXJyb3IoJ1Byb21pc2UgZmFpbGVkIGZvciBpbmRpdmlkdWFsIGNyZWF0ZVByb21pc2VGb3JBZGRpbmdOZXdSYXRlSXRlbSEgZXJyb3IgOicgKyBKU09OLnN0cmluZ2lmeShlLm1lc3NhZ2UpKTtcclxuICAgICAgQ0NQcm9taXNlLnJlamVjdChlLm1lc3NhZ2UpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVDZW50cmFsaXplZFJhdGVGb3JCdWlsZGluZyhidWlsZGluZ0lkOiBzdHJpbmcsIHJhdGVJdGVtOiBzdHJpbmcsIHJhdGVJdGVtUmF0ZTogbnVtYmVyKSB7XHJcbiAgICByZXR1cm4gbmV3IENDUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZTogYW55LCByZWplY3Q6IGFueSkge1xyXG4gICAgICBsb2dnZXIuaW5mbygnY3JlYXRlUHJvbWlzZUZvclJhdGVVcGRhdGUgaGFzIGJlZW4gaGl0IGZvciBidWlsZGluZ0lkIDogJyArIGJ1aWxkaW5nSWQgKyAnLCByYXRlSXRlbSA6ICcgKyByYXRlSXRlbSk7XHJcbiAgICAgIC8vdXBkYXRlIHJhdGVcclxuICAgICAgbGV0IGJ1aWxkaW5nUmVwb3NpdG9yeSA9IG5ldyBCdWlsZGluZ1JlcG9zaXRvcnkoKTtcclxuICAgICAgbGV0IHF1ZXJ5VXBkYXRlUmF0ZSA9IHsnX2lkJzogYnVpbGRpbmdJZCwgJ3JhdGVzLml0ZW1OYW1lJzogcmF0ZUl0ZW19O1xyXG4gICAgICBsZXQgdXBkYXRlUmF0ZSA9IHskc2V0OiB7J3JhdGVzLiQucmF0ZSc6IHJhdGVJdGVtUmF0ZX19O1xyXG4gICAgICBidWlsZGluZ1JlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeVVwZGF0ZVJhdGUsIHVwZGF0ZVJhdGUsIHtuZXc6IHRydWV9LCAoZXJyb3I6IEVycm9yLCByZXN1bHQ6IEJ1aWxkaW5nKSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnUmF0ZSBVcGRhdGVkJyk7XHJcbiAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlOiBhbnkpIHtcclxuICAgICAgbG9nZ2VyLmVycm9yKCdQcm9taXNlIGZhaWxlZCBmb3IgaW5kaXZpZHVhbCBjcmVhdGVQcm9taXNlRm9yUmF0ZVVwZGF0ZSAhIEVycm9yOiAnICsgSlNPTi5zdHJpbmdpZnkoZS5tZXNzYWdlKSk7XHJcbiAgICAgIENDUHJvbWlzZS5yZWplY3QoZS5tZXNzYWdlKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgYWRkTmV3Q2VudHJhbGl6ZWRSYXRlRm9yUHJvamVjdChwcm9qZWN0SWQ6IHN0cmluZywgcmF0ZUl0ZW06IGFueSkge1xyXG4gICAgcmV0dXJuIG5ldyBDQ1Byb21pc2UoZnVuY3Rpb24gKHJlc29sdmU6IGFueSwgcmVqZWN0OiBhbnkpIHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ2NyZWF0ZVByb21pc2VGb3JBZGRpbmdOZXdSYXRlSXRlbUluUHJvamVjdFJhdGVzIGhhcyBiZWVuIGhpdCBmb3IgcHJvamVjdElkIDogJyArIHByb2plY3RJZCArICcsIHJhdGVJdGVtIDogJyArIHJhdGVJdGVtKTtcclxuXHJcbiAgICAgIGxldCBwcm9qZWN0UmVwb3NpdG9yeSA9IG5ldyBQcm9qZWN0UmVwb3NpdG9yeSgpO1xyXG4gICAgICBsZXQgYWRkTmV3UmF0ZUl0ZW1RdWVyeVByb2plY3QgPSB7J19pZCc6IHByb2plY3RJZH07XHJcbiAgICAgIGxldCBhZGROZXdSYXRlUmF0ZURhdGFQcm9qZWN0ID0geyRwdXNoOiB7J3JhdGVzJzogcmF0ZUl0ZW19fTtcclxuICAgICAgcHJvamVjdFJlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShhZGROZXdSYXRlSXRlbVF1ZXJ5UHJvamVjdCwgYWRkTmV3UmF0ZVJhdGVEYXRhUHJvamVjdCxcclxuICAgICAgICB7bmV3OiB0cnVlfSwgKGVycm9yOiBFcnJvciwgcmVzdWx0OiBCdWlsZGluZykgPT4ge1xyXG4gICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgIHJlamVjdChlcnJvcik7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KS5jYXRjaChmdW5jdGlvbiAoZTogYW55KSB7XHJcbiAgICAgIGxvZ2dlci5lcnJvcignUHJvbWlzZSBmYWlsZWQgZm9yIGluZGl2aWR1YWwgY3JlYXRlUHJvbWlzZUZvckFkZGluZ05ld1JhdGVJdGVtSW5Qcm9qZWN0UmF0ZXMgISBlcnJvciA6JyArIEpTT04uc3RyaW5naWZ5KGUubWVzc2FnZSkpO1xyXG4gICAgICBDQ1Byb21pc2UucmVqZWN0KGUubWVzc2FnZSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZUNlbnRyYWxpemVkUmF0ZUZvclByb2plY3QocHJvamVjdElkOiBzdHJpbmcsIHJhdGVJdGVtOiBzdHJpbmcsIHJhdGVJdGVtUmF0ZTogbnVtYmVyKSB7XHJcbiAgICByZXR1cm4gbmV3IENDUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZTogYW55LCByZWplY3Q6IGFueSkge1xyXG4gICAgICBsb2dnZXIuaW5mbygnY3JlYXRlUHJvbWlzZUZvclJhdGVVcGRhdGVPZlByb2plY3RSYXRlcyBoYXMgYmVlbiBoaXQgZm9yIHByb2plY3RJZCA6ICcgKyBwcm9qZWN0SWQgKyAnLCByYXRlSXRlbSA6ICcgKyByYXRlSXRlbSk7XHJcbiAgICAgIC8vdXBkYXRlIHJhdGVcclxuICAgICAgbGV0IHByb2plY3RSZXBvc2l0b3J5ID0gbmV3IFByb2plY3RSZXBvc2l0b3J5KCk7XHJcbiAgICAgIGxldCBxdWVyeVVwZGF0ZVJhdGVGb3JQcm9qZWN0ID0geydfaWQnOiBwcm9qZWN0SWQsICdyYXRlcy5pdGVtTmFtZSc6IHJhdGVJdGVtfTtcclxuICAgICAgbGV0IHVwZGF0ZVJhdGVGb3JQcm9qZWN0ID0geyRzZXQ6IHsncmF0ZXMuJC5yYXRlJzogcmF0ZUl0ZW1SYXRlfX07XHJcbiAgICAgIHByb2plY3RSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnlVcGRhdGVSYXRlRm9yUHJvamVjdCwgdXBkYXRlUmF0ZUZvclByb2plY3QsIHtuZXc6IHRydWV9LCAoZXJyb3I6IEVycm9yLCByZXN1bHQ6IFByb2plY3QpID0+IHtcclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgIHJlamVjdChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdSYXRlIFVwZGF0ZWQgZm9yIFByb2plY3QgcmF0ZXMnKTtcclxuICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSkuY2F0Y2goZnVuY3Rpb24gKGU6IGFueSkge1xyXG4gICAgICBsb2dnZXIuZXJyb3IoJ1Byb21pc2UgZmFpbGVkIGZvciBpbmRpdmlkdWFsIGNyZWF0ZVByb21pc2VGb3JSYXRlVXBkYXRlT2ZQcm9qZWN0UmF0ZXMgISBFcnJvcjogJyArIEpTT04uc3RyaW5naWZ5KGUubWVzc2FnZSkpO1xyXG4gICAgICBDQ1Byb21pc2UucmVqZWN0KGUubWVzc2FnZSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGFkZEF0dGFjaG1lbnRUb1dvcmtJdGVtKHByb2plY3RJZDogc3RyaW5nLCBidWlsZGluZ0lkOiBzdHJpbmcsIGNvc3RIZWFkSWQ6IG51bWJlciwgY2F0ZWdvcnlJZDogbnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHdvcmtJdGVtSWQ6IG51bWJlcixmaWxlRGF0YTogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcblxyXG4gICAgICB0aGlzLmFkZEF0dGFjaG1lbnQoZmlsZURhdGEsIChlcnJvcjogYW55LCBhdHRhY2htZW50T2JqZWN0OiBBdHRhY2htZW50RGV0YWlsc01vZGVsKSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgcHJvamVjdGlvbiA9IHtjb3N0SGVhZHM6IDF9O1xyXG4gICAgICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmZpbmRCeUlkV2l0aFByb2plY3Rpb24oYnVpbGRpbmdJZCwgcHJvamVjdGlvbiwgKGVycm9yLCBidWlsZGluZykgPT4ge1xyXG4gICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBjb3N0SGVhZExpc3QgPSBidWlsZGluZy5jb3N0SGVhZHM7XHJcbiAgICAgICAgICAgIGxldCBjb3N0SGVhZHMgPSB0aGlzLnVwbG9hZEZpbGUoY29zdEhlYWRMaXN0LCBjb3N0SGVhZElkLCBjYXRlZ29yeUlkLCB3b3JrSXRlbUlkLCBhdHRhY2htZW50T2JqZWN0KTtcclxuICAgICAgICAgICAgbGV0IHF1ZXJ5ID0ge19pZDogYnVpbGRpbmdJZH07XHJcbiAgICAgICAgICAgIGxldCB1cGRhdGVEYXRhID0geyRzZXQ6IHsnY29zdEhlYWRzJzogY29zdEhlYWRzfX07XHJcbiAgICAgICAgICAgIHRoaXMuYnVpbGRpbmdSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIHVwZGF0ZURhdGEsIHtuZXc6IHRydWV9LCAoZXJyb3IsIHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiAnc3VjY2Vzcyd9KTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGFkZEF0dGFjaG1lbnQoZmlsZURhdGE6IGFueSwgY2FsbGJhY2sgOihlcnJvcjogYW55LCByZXN1bHQgOmFueSkgPT4gdm9pZCkge1xyXG4gICAgX19kaXJuYW1lID0gcGF0aC5yZXNvbHZlKCkgKyBjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5hdHRhY2htZW50UGF0aCcpO1xyXG4gICAgbGV0IGZvcm0gPSBuZXcgbXVsdGlwYXJ0eS5Gb3JtKHt1cGxvYWREaXI6IF9fZGlybmFtZX0pO1xyXG4gICAgZm9ybS5wYXJzZShmaWxlRGF0YSwgKGVycjogRXJyb3IsIGZpZWxkczogYW55LCBmaWxlczogYW55KSA9PiB7XHJcbiAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICBsZXQgZmlsZV9wYXRoID0gZmlsZXMuZmlsZVswXS5wYXRoO1xyXG4gICAgICAgIGxldCBhc3NpZ25lZEZpbGVOYW1lID0gZmlsZV9wYXRoLnN1YnN0cihmaWxlcy5maWxlWzBdLnBhdGgubGFzdEluZGV4T2YoJ1xcLycpICsgMSk7XHJcbiAgICAgICAgbG9nZ2VyLmluZm8oJ0F0dGFjaGVkIGFzc2lnbmVkIGZpbGVOYW1lIDogJythc3NpZ25lZEZpbGVOYW1lKTtcclxuXHJcbiAgICAgICAgbGV0IGF0dGFjaG1lbnRPYmplY3Q6IEF0dGFjaG1lbnREZXRhaWxzTW9kZWwgPSBuZXcgQXR0YWNobWVudERldGFpbHNNb2RlbCgpO1xyXG4gICAgICAgIGF0dGFjaG1lbnRPYmplY3QuZmlsZU5hbWUgPSBmaWxlcy5maWxlWzBdLm9yaWdpbmFsRmlsZW5hbWU7XHJcbiAgICAgICAgYXR0YWNobWVudE9iamVjdC5hc3NpZ25lZEZpbGVOYW1lID0gYXNzaWduZWRGaWxlTmFtZTtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCBhdHRhY2htZW50T2JqZWN0KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB1cGxvYWRGaWxlKGNvc3RIZWFkTGlzdDogQXJyYXk8Q29zdEhlYWQ+LCBjb3N0SGVhZElkOiBudW1iZXIsIGNhdGVnb3J5SWQ6IG51bWJlciwgd29ya0l0ZW1JZDogbnVtYmVyLFxyXG4gICAgICAgICAgICAgYXR0YWNobWVudE9iamVjdDogQXR0YWNobWVudERldGFpbHNNb2RlbCkge1xyXG4gICAgbGV0IGNvc3RIZWFkID0gY29zdEhlYWRMaXN0LmZpbHRlcihmdW5jdGlvbihjdXJyZW50Q29zdEhlYWQ6IENvc3RIZWFkKXsgcmV0dXJuIGN1cnJlbnRDb3N0SGVhZC5yYXRlQW5hbHlzaXNJZCA9PT0gY29zdEhlYWRJZDsgfSk7XHJcbiAgICBsZXQgY2F0ZWdvcmllcyA9IGNvc3RIZWFkWzBdLmNhdGVnb3JpZXM7XHJcbiAgICBsZXQgY2F0ZWdvcnkgPSBjYXRlZ29yaWVzLmZpbHRlcihmdW5jdGlvbiAoY3VycmVudENhdGVnb3J5OiBDYXRlZ29yeSkgeyByZXR1cm4gY3VycmVudENhdGVnb3J5LnJhdGVBbmFseXNpc0lkID09PSBjYXRlZ29yeUlkOyB9KTtcclxuICAgIGxldCB3b3JrSXRlbXMgPSBjYXRlZ29yeVswXS53b3JrSXRlbXM7XHJcbiAgICBsZXQgd29ya0l0ZW0gPSB3b3JrSXRlbXMuZmlsdGVyKGZ1bmN0aW9uIChjdXJyZW50V29ya0l0ZW06IFdvcmtJdGVtKSB7XHJcbiAgICAgICBpZihjdXJyZW50V29ya0l0ZW0ucmF0ZUFuYWx5c2lzSWQgPT09IHdvcmtJdGVtSWQpIHtcclxuICAgICAgICBjdXJyZW50V29ya0l0ZW0uYXR0YWNobWVudERldGFpbHMucHVzaChhdHRhY2htZW50T2JqZWN0KTtcclxuICAgICAgIH1cclxuICAgICAgIHJldHVybjtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIGNvc3RIZWFkTGlzdDtcclxuICB9XHJcblxyXG4gIGdldFByZXNlbnRGaWxlc0ZvckJ1aWxkaW5nV29ya0l0ZW0ocHJvamVjdElkOiBzdHJpbmcsIGJ1aWxkaW5nSWQ6IHN0cmluZywgY29zdEhlYWRJZDogbnVtYmVyLCBjYXRlZ29yeUlkOiBudW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3b3JrSXRlbUlkOiBudW1iZXIsIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGdldFByZXNlbnRGaWxlc0ZvckJ1aWxkaW5nV29ya0l0ZW0gaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICBsZXQgcHJvamVjdGlvbiA9IHsgY29zdEhlYWRzIDogMSB9O1xyXG4gICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZEJ5SWRXaXRoUHJvamVjdGlvbihidWlsZGluZ0lkLCBwcm9qZWN0aW9uLCAoZXJyb3IsIGJ1aWxkaW5nKSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgY29zdEhlYWRMaXN0ID0gYnVpbGRpbmcuY29zdEhlYWRzO1xyXG4gICAgICAgbGV0IGF0dGFjaG1lbnRMaXN0ID0gdGhpcy5nZXRQcmVzZW50RmlsZXMoY29zdEhlYWRMaXN0LCBjb3N0SGVhZElkLCBjYXRlZ29yeUlkLCB3b3JrSXRlbUlkKTtcclxuICAgICAgICBjYWxsYmFjayhudWxsLHtkYXRhOmF0dGFjaG1lbnRMaXN0fSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRQcmVzZW50RmlsZXMoY29zdEhlYWRMaXN0OiBBcnJheTxDb3N0SGVhZD4sIGNvc3RIZWFkSWQ6IG51bWJlciwgY2F0ZWdvcnlJZDogbnVtYmVyLCB3b3JrSXRlbUlkOiBudW1iZXIpIHtcclxuXHJcbiAgICBsZXQgYXR0YWNobWVudExpc3QgPSBuZXcgQXJyYXk8QXR0YWNobWVudERldGFpbHNNb2RlbD4oKTtcclxuICAgIGxldCBjb3N0SGVhZCA9IGNvc3RIZWFkTGlzdC5maWx0ZXIoZnVuY3Rpb24oY3VycmVudENvc3RIZWFkOiBDb3N0SGVhZCl7IHJldHVybiBjdXJyZW50Q29zdEhlYWQucmF0ZUFuYWx5c2lzSWQgPT09IGNvc3RIZWFkSWQ7IH0pO1xyXG4gICAgbGV0IGNhdGVnb3JpZXMgPSBjb3N0SGVhZFswXS5jYXRlZ29yaWVzO1xyXG4gICAgbGV0IGNhdGVnb3J5ID0gY2F0ZWdvcmllcy5maWx0ZXIoZnVuY3Rpb24gKGN1cnJlbnRDYXRlZ29yeTogQ2F0ZWdvcnkpIHsgcmV0dXJuIGN1cnJlbnRDYXRlZ29yeS5yYXRlQW5hbHlzaXNJZCA9PT0gY2F0ZWdvcnlJZDsgfSk7XHJcbiAgICBsZXQgd29ya0l0ZW1zID0gY2F0ZWdvcnlbMF0ud29ya0l0ZW1zO1xyXG4gICAgbGV0IHdvcmtJdGVtID0gd29ya0l0ZW1zLmZpbHRlcihmdW5jdGlvbiAoY3VycmVudFdvcmtJdGVtOiBXb3JrSXRlbSkgeyByZXR1cm4gY3VycmVudFdvcmtJdGVtLnJhdGVBbmFseXNpc0lkID09PSB3b3JrSXRlbUlkOyB9KTtcclxuICAgIGF0dGFjaG1lbnRMaXN0ID0gd29ya0l0ZW1bMF0uYXR0YWNobWVudERldGFpbHM7XHJcbiAgICByZXR1cm4gYXR0YWNobWVudExpc3Q7XHJcbiAgfVxyXG5cclxuICByZW1vdmVBdHRhY2htZW50T2ZCdWlsZGluZ1dvcmtJdGVtKHByb2plY3RJZDogc3RyaW5nLCBidWlsZGluZ0lkOiBzdHJpbmcsIGNvc3RIZWFkSWQ6IG51bWJlciwgY2F0ZWdvcnlJZDogbnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd29ya0l0ZW1JZDogbnVtYmVyLCBhc3NpZ25lZEZpbGVOYW1lOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIHJlbW92ZUF0dGFjaG1lbnRPZkJ1aWxkaW5nV29ya0l0ZW0gaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICBsZXQgcHJvamVjdGlvbiA9IHsgY29zdEhlYWRzIDogMSB9O1xyXG4gICAgdGhpcy5idWlsZGluZ1JlcG9zaXRvcnkuZmluZEJ5SWRXaXRoUHJvamVjdGlvbihidWlsZGluZ0lkLCBwcm9qZWN0aW9uLCAoZXJyb3IsIGJ1aWxkaW5nKSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgY29zdEhlYWRMaXN0ID0gYnVpbGRpbmcuY29zdEhlYWRzO1xyXG4gICAgICAgIHRoaXMuZGVsZXRlRmlsZShjb3N0SGVhZExpc3QsIGNvc3RIZWFkSWQsIGNhdGVnb3J5SWQsIHdvcmtJdGVtSWQsIGFzc2lnbmVkRmlsZU5hbWUpO1xyXG5cclxuICAgICAgICBsZXQgcXVlcnkgPSB7IF9pZCA6IGJ1aWxkaW5nSWQgfTtcclxuICAgICAgICBsZXQgZGF0YSA9IHsgJHNldCA6IHsnY29zdEhlYWRzJyA6IGJ1aWxkaW5nLmNvc3RIZWFkcyB9fTtcclxuICAgICAgICB0aGlzLmJ1aWxkaW5nUmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCBkYXRhLHtuZXc6IHRydWV9LCAoZXJyb3IsIGJ1aWxkaW5nKSA9PiB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBmaW5kT25lQW5kVXBkYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGZzLnVubGluaygnLicrIGNvbmZpZy5nZXQoJ2FwcGxpY2F0aW9uLmF0dGFjaG1lbnRQYXRoJykrJy8nKyBhc3NpZ25lZEZpbGVOYW1lLCAoZXJyOkVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhIDonc3VjY2Vzcyd9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgZGVsZXRlRmlsZShjb3N0SGVhZExpc3Q6IGFueSwgY29zdEhlYWRJZDogbnVtYmVyLCBjYXRlZ29yeUlkOiBudW1iZXIsIHdvcmtJdGVtSWQ6IG51bWJlciwgYXNzaWduZWRGaWxlTmFtZTogYW55KSB7XHJcblxyXG4gICAgbGV0IGNvc3RIZWFkID0gY29zdEhlYWRMaXN0LmZpbHRlcihmdW5jdGlvbihjdXJyZW50Q29zdEhlYWQ6IENvc3RIZWFkKXsgcmV0dXJuIGN1cnJlbnRDb3N0SGVhZC5yYXRlQW5hbHlzaXNJZCA9PT0gY29zdEhlYWRJZDsgfSk7XHJcbiAgICBsZXQgY2F0ZWdvcmllcyA9IGNvc3RIZWFkWzBdLmNhdGVnb3JpZXM7XHJcbiAgICBsZXQgY2F0ZWdvcnkgPSBjYXRlZ29yaWVzLmZpbHRlcihmdW5jdGlvbiAoY3VycmVudENhdGVnb3J5OiBDYXRlZ29yeSkgeyByZXR1cm4gY3VycmVudENhdGVnb3J5LnJhdGVBbmFseXNpc0lkID09PSBjYXRlZ29yeUlkOyB9KTtcclxuICAgIGxldCB3b3JrSXRlbXMgPSBjYXRlZ29yeVswXS53b3JrSXRlbXM7XHJcbiAgICBsZXQgd29ya0l0ZW0gPSB3b3JrSXRlbXMuZmlsdGVyKGZ1bmN0aW9uIChjdXJyZW50V29ya0l0ZW06IFdvcmtJdGVtKSB7XHJcbiAgICAgIGlmKGN1cnJlbnRXb3JrSXRlbS5yYXRlQW5hbHlzaXNJZCA9PT0gd29ya0l0ZW1JZCkge1xyXG4gICAgICAgIGxldCBhdHRhY2htZW50TGlzdCA9IGN1cnJlbnRXb3JrSXRlbS5hdHRhY2htZW50RGV0YWlscztcclxuICAgICAgICBmb3IgKGxldCBmaWxlSW5kZXggaW4gYXR0YWNobWVudExpc3QpIHtcclxuICAgICAgICAgIGlmIChhdHRhY2htZW50TGlzdFtmaWxlSW5kZXhdLmFzc2lnbmVkRmlsZU5hbWUgPT09IGFzc2lnbmVkRmlsZU5hbWUpIHtcclxuICAgICAgICAgICAgYXR0YWNobWVudExpc3Quc3BsaWNlKHBhcnNlSW50KGZpbGVJbmRleCksIDEpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBhZGRBdHRhY2htZW50VG9Qcm9qZWN0V29ya0l0ZW0ocHJvamVjdElkOiBzdHJpbmcsIGNvc3RIZWFkSWQ6IG51bWJlciwgY2F0ZWdvcnlJZDogbnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3b3JrSXRlbUlkOiBudW1iZXIsZmlsZURhdGE6IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgdGhpcy5hZGRBdHRhY2htZW50KGZpbGVEYXRhLCAoZXJyb3I6IGFueSwgYXR0YWNobWVudE9iamVjdDogQXR0YWNobWVudERldGFpbHNNb2RlbCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IHByb2plY3Rpb24gPSB7cHJvamVjdENvc3RIZWFkczogMX07XHJcbiAgICAgICAgdGhpcy5wcm9qZWN0UmVwb3NpdG9yeS5maW5kQnlJZFdpdGhQcm9qZWN0aW9uKHByb2plY3RJZCwgcHJvamVjdGlvbiwgKGVycm9yLCBwcm9qZWN0KSA9PiB7XHJcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IGNvc3RIZWFkTGlzdCA9IHByb2plY3QucHJvamVjdENvc3RIZWFkcztcclxuICAgICAgICAgICAgbGV0IHByb2plY3RDb3N0SGVhZHMgPSB0aGlzLnVwbG9hZEZpbGUoY29zdEhlYWRMaXN0LCBjb3N0SGVhZElkLCBjYXRlZ29yeUlkLCB3b3JrSXRlbUlkLCBhdHRhY2htZW50T2JqZWN0KTtcclxuICAgICAgICAgICAgbGV0IHF1ZXJ5ID0ge19pZDogcHJvamVjdElkfTtcclxuICAgICAgICAgICAgbGV0IHVwZGF0ZURhdGEgPSB7JHNldCA6IHsncHJvamVjdENvc3RIZWFkcycgOiBwcm9qZWN0Q29zdEhlYWRzfX07XHJcbiAgICAgICAgICAgIHRoaXMucHJvamVjdFJlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgdXBkYXRlRGF0YSwge25ldzogdHJ1ZX0sIChlcnJvciwgcmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGE6ICdzdWNjZXNzJ30pO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0UHJlc2VudEZpbGVzRm9yUHJvamVjdFdvcmtJdGVtKHByb2plY3RJZDogc3RyaW5nLGNvc3RIZWFkSWQ6IG51bWJlciwgY2F0ZWdvcnlJZDogbnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3b3JrSXRlbUlkOiBudW1iZXIsY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZ2V0UHJlc2VudEZpbGVzRm9yUHJvamVjdFdvcmtJdGVtIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgbGV0IHByb2plY3Rpb24gPSB7IHByb2plY3RDb3N0SGVhZHMgOiAxIH07XHJcbiAgICB0aGlzLnByb2plY3RSZXBvc2l0b3J5LmZpbmRCeUlkV2l0aFByb2plY3Rpb24ocHJvamVjdElkLCBwcm9qZWN0aW9uLCAoZXJyb3IsIHByb2plY3QpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCBjb3N0SGVhZExpc3QgPSBwcm9qZWN0LnByb2plY3RDb3N0SGVhZHM7XHJcbiAgICAgICAgbGV0IGF0dGFjaG1lbnRMaXN0ID0gdGhpcy5nZXRQcmVzZW50RmlsZXMoY29zdEhlYWRMaXN0LCBjb3N0SGVhZElkLCBjYXRlZ29yeUlkLCB3b3JrSXRlbUlkKTtcclxuICAgICAgICBjYWxsYmFjayhudWxsLHtkYXRhOmF0dGFjaG1lbnRMaXN0fSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmVtb3ZlQXR0YWNobWVudE9mUHJvamVjdFdvcmtJdGVtKHByb2plY3RJZDogc3RyaW5nLCBjb3N0SGVhZElkOiBudW1iZXIsIGNhdGVnb3J5SWQ6IG51bWJlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd29ya0l0ZW1JZDogbnVtYmVyLCBhc3NpZ25lZEZpbGVOYW1lOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIHJlbW92ZUF0dGFjaG1lbnRPZlByb2plY3RXb3JrSXRlbSBoYXMgYmVlbiBoaXQnKTtcclxuICAgIGxldCBwcm9qZWN0aW9uID0geyBwcm9qZWN0Q29zdEhlYWRzIDogMSB9O1xyXG4gICAgdGhpcy5wcm9qZWN0UmVwb3NpdG9yeS5maW5kQnlJZFdpdGhQcm9qZWN0aW9uKHByb2plY3RJZCwgcHJvamVjdGlvbiwgKGVycm9yLCBwcm9qZWN0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgY29zdEhlYWRMaXN0ID0gcHJvamVjdC5wcm9qZWN0Q29zdEhlYWRzO1xyXG4gICAgICAgIHRoaXMuZGVsZXRlRmlsZShjb3N0SGVhZExpc3QsIGNvc3RIZWFkSWQsIGNhdGVnb3J5SWQsIHdvcmtJdGVtSWQsIGFzc2lnbmVkRmlsZU5hbWUpO1xyXG5cclxuICAgICAgICBsZXQgcXVlcnkgPSB7IF9pZCA6IHByb2plY3RJZCB9O1xyXG4gICAgICAgIGxldCBkYXRhID0geyAkc2V0IDogeydwcm9qZWN0Q29zdEhlYWRzJyA6IHByb2plY3QucHJvamVjdENvc3RIZWFkcyB9fTtcclxuICAgICAgICB0aGlzLnByb2plY3RSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIGRhdGEse25ldzogdHJ1ZX0sIChlcnJvciwgcHJvamVjdCkgPT4ge1xyXG4gICAgICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgZmluZE9uZUFuZFVwZGF0ZSBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBmcy51bmxpbmsoJy4nKyBjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5hdHRhY2htZW50UGF0aCcpKycvJysgYXNzaWduZWRGaWxlTmFtZSwgKGVycjpFcnJvcikgPT4ge1xyXG4gICAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YSA6J3N1Y2Nlc3MnfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcblxyXG4gIHByaXZhdGUgY2FsY3VsYXRlVGh1bWJSdWxlUmVwb3J0Rm9yQ29zdEhlYWQoYnVkZ2V0ZWRDb3N0QW1vdW50OiBudW1iZXIsIGNvc3RIZWFkRnJvbVJhdGVBbmFseXNpczogYW55LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVpbGRpbmdEYXRhOiBhbnksIGNvc3RIZWFkczogQXJyYXk8Q29zdEhlYWQ+KSB7XHJcbiAgICBpZiAoYnVkZ2V0ZWRDb3N0QW1vdW50KSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IHNlcnZpY2UsIGNhbGN1bGF0ZVRodW1iUnVsZVJlcG9ydEZvckNvc3RIZWFkIGhhcyBiZWVuIGhpdCcpO1xyXG5cclxuICAgICAgbGV0IGNvc3RIZWFkOiBDb3N0SGVhZCA9IGNvc3RIZWFkRnJvbVJhdGVBbmFseXNpcztcclxuICAgICAgY29zdEhlYWQuYnVkZ2V0ZWRDb3N0QW1vdW50ID0gYnVkZ2V0ZWRDb3N0QW1vdW50O1xyXG4gICAgICBsZXQgdGh1bWJSdWxlUmF0ZSA9IG5ldyBUaHVtYlJ1bGVSYXRlKCk7XHJcblxyXG4gICAgICB0aHVtYlJ1bGVSYXRlLnNhbGVhYmxlQXJlYSA9IHRoaXMuY2FsY3VsYXRlVGh1bWJSdWxlUmF0ZUZvckFyZWEoYnVkZ2V0ZWRDb3N0QW1vdW50LCBidWlsZGluZ0RhdGEudG90YWxTYWxlYWJsZUFyZWFPZlVuaXQpO1xyXG4gICAgICB0aHVtYlJ1bGVSYXRlLnNsYWJBcmVhID0gdGhpcy5jYWxjdWxhdGVUaHVtYlJ1bGVSYXRlRm9yQXJlYShidWRnZXRlZENvc3RBbW91bnQsIGJ1aWxkaW5nRGF0YS50b3RhbFNsYWJBcmVhKTtcclxuICAgICAgdGh1bWJSdWxlUmF0ZS5jYXJwZXRBcmVhID0gdGhpcy5jYWxjdWxhdGVUaHVtYlJ1bGVSYXRlRm9yQXJlYShidWRnZXRlZENvc3RBbW91bnQsIGJ1aWxkaW5nRGF0YS50b3RhbENhcnBldEFyZWFPZlVuaXQpO1xyXG5cclxuICAgICAgY29zdEhlYWQudGh1bWJSdWxlUmF0ZSA9IHRodW1iUnVsZVJhdGU7XHJcbiAgICAgIGNvc3RIZWFkcy5wdXNoKGNvc3RIZWFkKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgY2FsY3VsYXRlVGh1bWJSdWxlUmVwb3J0Rm9yUHJvamVjdENvc3RIZWFkKGJ1ZGdldGVkQ29zdEFtb3VudDogbnVtYmVyLCBjb3N0SGVhZEZyb21SYXRlQW5hbHlzaXM6IGFueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9qZWN0RGV0YWlsczogYW55LCBjb3N0SGVhZHM6IEFycmF5PENvc3RIZWFkPikge1xyXG4gICAgaWYgKGJ1ZGdldGVkQ29zdEFtb3VudCkge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBzZXJ2aWNlLCBjYWxjdWxhdGVUaHVtYlJ1bGVSZXBvcnRGb3JQcm9qZWN0Q29zdEhlYWQgaGFzIGJlZW4gaGl0Jyk7XHJcblxyXG4gICAgICBsZXQgY2FsY3VsYXRlUHJvamVjdERhdGEgPSAnU0VMRUNUIFJPVU5EKFNVTShidWlsZGluZy50b3RhbENhcnBldEFyZWFPZlVuaXQpLDIpIEFTIHRvdGFsQ2FycGV0QXJlYSwgJyArXHJcbiAgICAgICAgJ1JPVU5EKFNVTShidWlsZGluZy50b3RhbFNsYWJBcmVhKSwyKSBBUyB0b3RhbFNsYWJBcmVhUHJvamVjdCwnICtcclxuICAgICAgICAnUk9VTkQoU1VNKGJ1aWxkaW5nLnRvdGFsU2FsZWFibGVBcmVhT2ZVbml0KSwyKSBBUyB0b3RhbFNhbGVhYmxlQXJlYSAgRlJPTSA/IEFTIGJ1aWxkaW5nJztcclxuICAgICAgbGV0IHByb2plY3REYXRhID0gYWxhc3FsKGNhbGN1bGF0ZVByb2plY3REYXRhLCBbcHJvamVjdERldGFpbHMuYnVpbGRpbmdzXSk7XHJcbiAgICAgIGxldCB0b3RhbFNsYWJBcmVhT2ZQcm9qZWN0OiBudW1iZXIgPSBwcm9qZWN0RGF0YVswXS50b3RhbFNsYWJBcmVhUHJvamVjdDtcclxuICAgICAgbGV0IHRvdGFsU2FsZWFibGVBcmVhT2ZQcm9qZWN0OiBudW1iZXIgPSBwcm9qZWN0RGF0YVswXS50b3RhbFNhbGVhYmxlQXJlYTtcclxuICAgICAgbGV0IHRvdGFsQ2FycGV0QXJlYU9mUHJvamVjdDogbnVtYmVyID0gcHJvamVjdERhdGFbMF0udG90YWxDYXJwZXRBcmVhO1xyXG5cclxuICAgICAgbGV0IGNvc3RIZWFkOiBDb3N0SGVhZCA9IGNvc3RIZWFkRnJvbVJhdGVBbmFseXNpcztcclxuICAgICAgY29zdEhlYWQuYnVkZ2V0ZWRDb3N0QW1vdW50ID0gYnVkZ2V0ZWRDb3N0QW1vdW50O1xyXG4gICAgICBsZXQgdGh1bWJSdWxlUmF0ZSA9IG5ldyBUaHVtYlJ1bGVSYXRlKCk7XHJcblxyXG4gICAgICB0aHVtYlJ1bGVSYXRlLnNhbGVhYmxlQXJlYSA9IHRoaXMuY2FsY3VsYXRlVGh1bWJSdWxlUmF0ZUZvckFyZWEoYnVkZ2V0ZWRDb3N0QW1vdW50LCB0b3RhbFNhbGVhYmxlQXJlYU9mUHJvamVjdCk7XHJcbiAgICAgIHRodW1iUnVsZVJhdGUuc2xhYkFyZWEgPSB0aGlzLmNhbGN1bGF0ZVRodW1iUnVsZVJhdGVGb3JBcmVhKGJ1ZGdldGVkQ29zdEFtb3VudCwgdG90YWxTbGFiQXJlYU9mUHJvamVjdCk7XHJcbiAgICAgIHRodW1iUnVsZVJhdGUuY2FycGV0QXJlYSA9IHRoaXMuY2FsY3VsYXRlVGh1bWJSdWxlUmF0ZUZvckFyZWEoYnVkZ2V0ZWRDb3N0QW1vdW50LCB0b3RhbENhcnBldEFyZWFPZlByb2plY3QpO1xyXG5cclxuICAgICAgY29zdEhlYWQudGh1bWJSdWxlUmF0ZSA9IHRodW1iUnVsZVJhdGU7XHJcbiAgICAgIGNvc3RIZWFkcy5wdXNoKGNvc3RIZWFkKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgY2FsY3VsYXRlVGh1bWJSdWxlUmF0ZUZvckFyZWEoYnVkZ2V0ZWRDb3N0QW1vdW50OiBudW1iZXIsIGFyZWE6IG51bWJlcikge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3Qgc2VydmljZSwgY2FsY3VsYXRlVGh1bWJSdWxlUmF0ZUZvckFyZWEgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICBsZXQgYnVkZ2V0Q29zdFJhdGVzID0gbmV3IEJ1ZGdldENvc3RSYXRlcygpO1xyXG4gICAgYnVkZ2V0Q29zdFJhdGVzLnNxZnQgPSAoYnVkZ2V0ZWRDb3N0QW1vdW50IC8gYXJlYSk7XHJcbiAgICBidWRnZXRDb3N0UmF0ZXMuc3FtdCA9IChidWRnZXRDb3N0UmF0ZXMuc3FmdCAqIGNvbmZpZy5nZXQoQ29uc3RhbnRzLlNRVUFSRV9NRVRFUikpO1xyXG4gICAgcmV0dXJuIGJ1ZGdldENvc3RSYXRlcztcclxuICB9XHJcblxyXG4gIHByaXZhdGUgY2xvbmVkV29ya2l0ZW1XaXRoUmF0ZUFuYWx5c2lzKHdvcmtJdGVtOldvcmtJdGVtLCB3b3JrSXRlbUFnZ3JlZ2F0ZURhdGE6IGFueSkge1xyXG5cclxuICAgIGZvcihsZXQgYWdncmVnYXRlRGF0YSBvZiB3b3JrSXRlbUFnZ3JlZ2F0ZURhdGEpIHtcclxuICAgICAgaWYod29ya0l0ZW0ucmF0ZUFuYWx5c2lzSWQgPT09IGFnZ3JlZ2F0ZURhdGEud29ya0l0ZW0ucmF0ZUFuYWx5c2lzSWQpe1xyXG4gICAgICAgIHdvcmtJdGVtLnJhdGUgPSBhZ2dyZWdhdGVEYXRhLndvcmtJdGVtLnJhdGU7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbk9iamVjdC5zZWFsKFByb2plY3RTZXJ2aWNlKTtcclxuZXhwb3J0ID0gUHJvamVjdFNlcnZpY2U7XHJcbiJdfQ==
