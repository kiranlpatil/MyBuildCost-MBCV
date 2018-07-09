"use strict";
var UserService = require("./../../framework/services/UserService");
var ProjectAsset = require("../../framework/shared/projectasset");
var AuthInterceptor = require("../../framework/interceptor/auth.interceptor");
var CostControllException = require("../exception/CostControllException");
var WorkItem = require("../dataaccess/model/project/building/WorkItem");
var alasql = require("alasql");
var Rate = require("../dataaccess/model/project/building/Rate");
var CostHead = require("../dataaccess/model/project/building/CostHead");
var Category = require("../dataaccess/model/project/building/Category");
var Constants = require("../shared/constants");
var RateAnalysisRepository = require("../dataaccess/repository/RateAnalysisRepository");
var RateAnalysis = require("../dataaccess/model/RateAnalysis/RateAnalysis");
var request = require('request');
var config = require('config');
var log4js = require('log4js');
var logger = log4js.getLogger('Rate Analysis Service');
var CCPromise = require('promise/lib/es6-extensions');
var RateAnalysisService = (function () {
    function RateAnalysisService() {
        this.APP_NAME = ProjectAsset.APP_NAME;
        this.authInterceptor = new AuthInterceptor();
        this.userService = new UserService();
        this.rateAnalysisRepository = new RateAnalysisRepository();
    }
    RateAnalysisService.prototype.getCostHeads = function (url, user, callback) {
        logger.info('Rate Analysis Service, getCostHeads has been hit');
        request.get({ url: url }, function (error, response, body) {
            if (error) {
                callback(error, null);
            }
            else if (!error && response) {
                console.log('RESPONSE JSON : ' + JSON.stringify(JSON.parse(body)));
                var res = JSON.parse(body);
                callback(null, res);
            }
        });
    };
    RateAnalysisService.prototype.getWorkItems = function (url, user, callback) {
        logger.info('Rate Analysis Service, getWorkItems has been hit');
        request.get({ url: url }, function (error, response, body) {
            if (error) {
                callback(error, null);
            }
            else if (!error && response) {
                var res = JSON.parse(body);
                callback(null, res);
            }
        });
    };
    RateAnalysisService.prototype.getWorkItemsByCostHeadId = function (url, costHeadId, user, callback) {
        logger.info('Rate Analysis Service, getWorkItemsByCostHeadId has been hit');
        var workItems = [];
        request.get({ url: url }, function (error, response, body) {
            if (error) {
                callback(error, null);
            }
            else if (!error && response) {
                var res = JSON.parse(body);
                if (res) {
                    for (var _i = 0, _a = res.SubItemType; _i < _a.length; _i++) {
                        var workitem = _a[_i];
                        if (parseInt(costHeadId) === workitem.C3) {
                            var workitemDetails = new WorkItem(workitem.C2, workitem.C1);
                            workItems.push(workitemDetails);
                        }
                    }
                }
                callback(null, workItems);
            }
        });
    };
    RateAnalysisService.prototype.getApiCall = function (url, callback) {
        logger.info('getApiCall for rateAnalysis has bee hit for url : ' + url);
        request.get({ url: url }, function (error, response, body) {
            if (error) {
                callback(new CostControllException(error.message, error.stack), null);
            }
            else if (!error && response) {
                try {
                    var res = JSON.parse(body);
                    callback(null, res);
                }
                catch (err) {
                    logger.error('Promise failed for individual ! url:' + url + ':\n error :' + JSON.stringify(err.message));
                }
            }
        });
    };
    RateAnalysisService.prototype.getRate = function (workItemId, callback) {
        var _this = this;
        var url = config.get('rateAnalysisAPI.unit');
        this.getApiCall(url, function (error, unitData) {
            if (error) {
                callback(error, null);
            }
            else {
                unitData = unitData['UOM'];
                url = config.get('rateAnalysisAPI.rate');
                _this.getApiCall(url, function (error, data) {
                    if (error) {
                        callback(error, null);
                    }
                    else {
                        var rate = data['RateAnalysisData'];
                        var sql = 'SELECT rate.C5 AS quantity, unit.C2 As unit FROM ? AS rate JOIN ? AS unit on unit.C1 =  rate.C8 and' +
                            ' rate.C1 = ' + workItemId;
                        var sql2 = 'SELECT rate.C1 AS rateAnalysisId, rate.C2 AS itemName,ROUND(rate.C7,2) AS quantity,ROUND(rate.C3,2) AS rate,' +
                            ' ROUND(rate.C3*rate.C7,2) AS totalAmount, rate.C6 type, unit.C2 As unit FROM ? AS rate JOIN ? AS unit ON unit.C1 = rate.C9' +
                            '  WHERE rate.C1 = ' + workItemId;
                        var sql3 = 'SELECT ROUND(SUM(rate.C3*rate.C7) / SUM(rate.C7),2) AS total  FROM ? AS rate JOIN ? AS unit ON unit.C1 = rate.C9' +
                            '  WHERE rate.C1 = ' + workItemId;
                        var quantityAndUnit = alasql(sql, [rate, unitData]);
                        var rateResult = new Rate();
                        var totalrateFromRateAnalysis = alasql(sql3, [rate, unitData]);
                        rateResult.quantity = quantityAndUnit[0].quantity;
                        rateResult.unit = quantityAndUnit[0].unit;
                        rateResult.rateFromRateAnalysis = parseFloat((totalrateFromRateAnalysis[0].total).toFixed(2));
                        rate = alasql(sql2, [rate, unitData]);
                        rateResult.rateItems = rate;
                        callback(null, rateResult);
                    }
                });
            }
        });
    };
    RateAnalysisService.prototype.getWorkitemList = function (costHeadId, categoryId, callback) {
        var url = config.get('rateAnalysisAPI.workitem');
        this.getApiCall(url, function (error, workitem) {
            if (error) {
                callback(error, null);
            }
            else {
                var sql = 'SELECT C2 AS rateAnalysisId, C3 AS name FROM ? WHERE C1 = ' + costHeadId + ' and C4 = ' + categoryId;
                if (categoryId === 0) {
                    sql = 'SELECT C2 AS rateAnalysisId, C3 AS name FROM ? WHERE C1 = ' + costHeadId;
                }
                workitem = workitem['Items'];
                var workitemList = alasql(sql, [workitem]);
                callback(null, workitemList);
            }
        });
    };
    RateAnalysisService.prototype.convertCostHeadsFromRateAnalysisToCostControl = function (entity, callback) {
        logger.info('convertCostHeadsFromRateAnalysisToCostControl has been hit');
        var costHeadURL = config.get(Constants.RATE_ANALYSIS_API + entity + Constants.RATE_ANALYSIS_COSTHEADS);
        var costHeadRateAnalysisPromise = this.createPromise(costHeadURL);
        logger.info('costHeadRateAnalysisPromise for has been hit');
        var categoryURL = config.get(Constants.RATE_ANALYSIS_API + entity + Constants.RATE_ANALYSIS_CATEGORIES);
        var categoryRateAnalysisPromise = this.createPromise(categoryURL);
        logger.info('categoryRateAnalysisPromise for has been hit');
        var workItemURL = config.get(Constants.RATE_ANALYSIS_API + entity + Constants.RATE_ANALYSIS_WORKITEMS);
        var workItemRateAnalysisPromise = this.createPromise(workItemURL);
        logger.info('workItemRateAnalysisPromise for has been hit');
        var rateItemURL = config.get(Constants.RATE_ANALYSIS_API + entity + Constants.RATE_ANALYSIS_RATE);
        var rateItemRateAnalysisPromise = this.createPromise(rateItemURL);
        logger.info('rateItemRateAnalysisPromise for has been hit');
        var rateAnalysisNotesURL = config.get(Constants.RATE_ANALYSIS_API + entity + Constants.RATE_ANALYSIS_NOTES);
        var notesRateAnalysisPromise = this.createPromise(rateAnalysisNotesURL);
        logger.info('notesRateAnalysisPromise for has been hit');
        var allUnitsFromRateAnalysisURL = config.get(Constants.RATE_ANALYSIS_API + entity + Constants.RATE_ANALYSIS_UNIT);
        var unitsRateAnalysisPromise = this.createPromise(allUnitsFromRateAnalysisURL);
        logger.info('unitsRateAnalysisPromise for has been hit');
        logger.info('calling Promise.all');
        CCPromise.all([
            costHeadRateAnalysisPromise,
            categoryRateAnalysisPromise,
            workItemRateAnalysisPromise,
            rateItemRateAnalysisPromise,
            notesRateAnalysisPromise,
            unitsRateAnalysisPromise
        ]).then(function (data) {
            logger.info('convertCostHeadsFromRateAnalysisToCostControl Promise.all API is success.');
            var costHeadsRateAnalysis = data[0][Constants.RATE_ANALYSIS_ITEM_TYPE];
            var categoriesRateAnalysis = data[1][Constants.RATE_ANALYSIS_SUBITEM_TYPE];
            var workItemsRateAnalysis = data[2][Constants.RATE_ANALYSIS_ITEMS];
            var rateItemsRateAnalysis = data[3][Constants.RATE_ANALYSIS_DATA];
            var notesRateAnalysis = data[4][Constants.RATE_ANALYSIS_DATA];
            var unitsRateAnalysis = data[5][Constants.RATE_ANALYSIS_UOM];
            var buildingCostHeads = [];
            var rateAnalysisService = new RateAnalysisService();
            rateAnalysisService.getCostHeadsFromRateAnalysis(costHeadsRateAnalysis, categoriesRateAnalysis, workItemsRateAnalysis, rateItemsRateAnalysis, unitsRateAnalysis, notesRateAnalysis, buildingCostHeads);
            logger.info('success in  convertCostHeadsFromRateAnalysisToCostControl.');
            callback(null, {
                'buildingCostHeads': buildingCostHeads,
                'rates': rateItemsRateAnalysis,
                'units': unitsRateAnalysis
            });
        }).catch(function (e) {
            logger.error(' Promise failed for convertCostHeadsFromRateAnalysisToCostControl ! :' + JSON.stringify(e.message));
            CCPromise.reject(e.message);
        });
    };
    RateAnalysisService.prototype.createPromise = function (url) {
        return new CCPromise(function (resolve, reject) {
            logger.info('createPromise has been hit for : ' + url);
            var rateAnalysisService = new RateAnalysisService();
            rateAnalysisService.getApiCall(url, function (error, data) {
                if (error) {
                    console.log('Error in createPromise get data from rate analysis: ' + JSON.stringify(error));
                    reject(error);
                }
                else {
                    console.log('createPromise data from rate analysis success.');
                    resolve(data);
                }
            });
        }).catch(function (e) {
            logger.error('Promise failed for individual ! url:' + url + ':\n error :' + JSON.stringify(e.message));
            CCPromise.reject(e.message);
        });
    };
    RateAnalysisService.prototype.getCostHeadsFromRateAnalysis = function (costHeadsRateAnalysis, categoriesRateAnalysis, workItemsRateAnalysis, rateItemsRateAnalysis, unitsRateAnalysis, notesRateAnalysis, buildingCostHeads) {
        logger.info('getCostHeadsFromRateAnalysis has been hit.');
        for (var costHeadIndex = 0; costHeadIndex < costHeadsRateAnalysis.length; costHeadIndex++) {
            if (config.has('budgetedCostFormulae.' + costHeadsRateAnalysis[costHeadIndex].C2)) {
                var costHead = new CostHead();
                costHead.name = costHeadsRateAnalysis[costHeadIndex].C2;
                var configCostHeads = config.get('configCostHeads');
                var categories = new Array();
                if (configCostHeads.length > 0) {
                    var isCostHeadExistSQL = 'SELECT * FROM ? AS workitems WHERE TRIM(workitems.name)= ?';
                    var costHeadExistArray = alasql(isCostHeadExistSQL, [configCostHeads, costHead.name]);
                    if (costHeadExistArray.length !== 0) {
                        costHead.priorityId = costHeadExistArray[0].priorityId;
                        categories = costHeadExistArray[0].categories;
                    }
                }
                costHead.rateAnalysisId = costHeadsRateAnalysis[costHeadIndex].C1;
                var categoriesRateAnalysisSQL = 'SELECT Category.C1 AS rateAnalysisId, Category.C2 AS name' +
                    ' FROM ? AS Category where Category.C3 = ' + costHead.rateAnalysisId;
                var categoriesByCostHead = alasql(categoriesRateAnalysisSQL, [categoriesRateAnalysis]);
                var buildingCategories = new Array();
                if (categoriesByCostHead.length === 0) {
                    this.getWorkItemsWithoutCategoryFromRateAnalysis(costHead.rateAnalysisId, workItemsRateAnalysis, rateItemsRateAnalysis, unitsRateAnalysis, notesRateAnalysis, buildingCategories, categories);
                }
                else {
                    this.getCategoriesFromRateAnalysis(categoriesByCostHead, workItemsRateAnalysis, rateItemsRateAnalysis, unitsRateAnalysis, notesRateAnalysis, buildingCategories, categories);
                }
                costHead.categories = buildingCategories;
                costHead.thumbRuleRate = config.get(Constants.THUMBRULE_RATE);
                buildingCostHeads.push(costHead);
            }
            else {
                console.log('CostHead Unavaialabel : ' + costHeadsRateAnalysis[costHeadIndex].C2);
            }
        }
    };
    RateAnalysisService.prototype.getCategoriesFromRateAnalysis = function (categoriesByCostHead, workItemsRateAnalysis, rateItemsRateAnalysis, unitsRateAnalysis, notesRateAnalysis, buildingCategories, configCategories) {
        logger.info('getCategoriesFromRateAnalysis has been hit.');
        for (var categoryIndex = 0; categoryIndex < categoriesByCostHead.length; categoryIndex++) {
            var category = new Category(categoriesByCostHead[categoryIndex].name, categoriesByCostHead[categoryIndex].rateAnalysisId);
            var configWorkItems = new Array();
            if (configCategories.length > 0) {
                for (var _i = 0, configCategories_1 = configCategories; _i < configCategories_1.length; _i++) {
                    var configCategory = configCategories_1[_i];
                    if (configCategory.name === categoriesByCostHead[categoryIndex].name) {
                        configWorkItems = configCategory.workItems;
                    }
                }
            }
            var workItemsRateAnalysisSQL = 'SELECT workItem.C2 AS rateAnalysisId, TRIM(workItem.C3) AS name' +
                ' FROM ? AS workItem where workItem.C4 = ' + categoriesByCostHead[categoryIndex].rateAnalysisId;
            var workItemsByCategory = alasql(workItemsRateAnalysisSQL, [workItemsRateAnalysis]);
            var buildingWorkItems = new Array();
            this.getWorkItemsFromRateAnalysis(workItemsByCategory, rateItemsRateAnalysis, unitsRateAnalysis, notesRateAnalysis, buildingWorkItems, configWorkItems);
            category.workItems = buildingWorkItems;
            if (category.workItems.length !== 0) {
                buildingCategories.push(category);
            }
        }
        if (configCategories.length > 0) {
            for (var configCategoryIndex = 0; configCategoryIndex < configCategories.length; configCategoryIndex++) {
                var isCategoryExistsSQL = 'SELECT * FROM ? AS workitems WHERE TRIM(workitems.name)= ?';
                var categoryExistsArray = alasql(isCategoryExistsSQL, [categoriesByCostHead, configCategories[configCategoryIndex].name]);
                if (categoryExistsArray.length === 0) {
                    var configCat = new Category(configCategories[configCategoryIndex].name, configCategories[configCategoryIndex].rateAnalysisId);
                    configCat.workItems = this.getWorkitemsForConfigCategory(configCategories[configCategoryIndex].workItems);
                    if (configCat.workItems.length !== 0) {
                        buildingCategories.push(configCat);
                    }
                }
            }
        }
    };
    RateAnalysisService.prototype.getWorkitemsForConfigCategory = function (configWorkitems) {
        var workItemsList = new Array();
        for (var workitemIndex = 0; workitemIndex < configWorkitems.length; workitemIndex++) {
            var configWorkitem = this.convertConfigorkitem(configWorkitems[workitemIndex]);
            workItemsList.push(configWorkitem);
        }
        return workItemsList;
    };
    RateAnalysisService.prototype.getWorkItemsWithoutCategoryFromRateAnalysis = function (costHeadRateAnalysisId, workItemsRateAnalysis, rateItemsRateAnalysis, unitsRateAnalysis, notesRateAnalysis, buildingCategories, configCategories) {
        logger.info('getWorkItemsWithoutCategoryFromRateAnalysis has been hit.');
        var workItemsWithoutCategoriesRateAnalysisSQL = 'SELECT workItem.C2 AS rateAnalysisId, workItem.C3 AS name' +
            ' FROM ? AS workItem where NOT workItem.C4 AND workItem.C1 = ' + costHeadRateAnalysisId;
        var workItemsWithoutCategories = alasql(workItemsWithoutCategoriesRateAnalysisSQL, [workItemsRateAnalysis]);
        var buildingWorkItems = new Array();
        var category = new Category('Work Items', 0);
        var configWorkItems = new Array();
        if (configCategories.length > 0) {
            for (var _i = 0, configCategories_2 = configCategories; _i < configCategories_2.length; _i++) {
                var configCategory = configCategories_2[_i];
                if (configCategory.name === 'Work Items') {
                    configWorkItems = configCategory.workItems;
                }
            }
        }
        this.getWorkItemsFromRateAnalysis(workItemsWithoutCategories, rateItemsRateAnalysis, unitsRateAnalysis, notesRateAnalysis, buildingWorkItems, configWorkItems);
        category.workItems = buildingWorkItems;
        buildingCategories.push(category);
    };
    RateAnalysisService.prototype.syncRateitemFromRateAnalysis = function (entity, buildingDetails, callback) {
        var rateItemURL = config.get(Constants.RATE_ANALYSIS_API + entity + Constants.RATE_ANALYSIS_RATE);
        var rateItemRateAnalysisPromise = this.createPromise(rateItemURL);
        logger.info('rateItemRateAnalysisPromise for has been hit');
        var rateAnalysisNotesURL = config.get(Constants.RATE_ANALYSIS_API + entity + Constants.RATE_ANALYSIS_NOTES);
        var notesRateAnalysisPromise = this.createPromise(rateAnalysisNotesURL);
        logger.info('notesRateAnalysisPromise for has been hit');
        var allUnitsFromRateAnalysisURL = config.get(Constants.RATE_ANALYSIS_API + entity + Constants.RATE_ANALYSIS_UNIT);
        var unitsRateAnalysisPromise = this.createPromise(allUnitsFromRateAnalysisURL);
        logger.info('unitsRateAnalysisPromise for has been hit');
        var costHeadURL = config.get(Constants.RATE_ANALYSIS_API + entity + Constants.RATE_ANALYSIS_COSTHEADS);
        var costHeadRateAnalysisPromise = this.createPromise(costHeadURL);
        logger.info('costHeadRateAnalysisPromise for has been hit');
        CCPromise.all([
            rateItemRateAnalysisPromise,
            notesRateAnalysisPromise,
            unitsRateAnalysisPromise,
            costHeadRateAnalysisPromise
        ]).then(function (data) {
            logger.info('convertCostHeadsFromRateAnalysisToCostControl Promise.all API is success.');
            logger.info('success in  convertCostHeadsFromRateAnalysisToCostControl.');
            callback(null, data);
        }).catch(function (e) {
            logger.error(' Promise failed for convertCostHeadsFromRateAnalysisToCostControl ! :' + e.message);
            CCPromise.reject(e.message);
        });
    };
    RateAnalysisService.prototype.getWorkItemsFromRateAnalysis = function (workItemsByCategory, rateItemsRateAnalysis, unitsRateAnalysis, notesRateAnalysis, buildingWorkItems, configWorkItems) {
        logger.info('getWorkItemsFromRateAnalysis has been hit.');
        for (var _i = 0, workItemsByCategory_1 = workItemsByCategory; _i < workItemsByCategory_1.length; _i++) {
            var categoryWorkitem = workItemsByCategory_1[_i];
            var workItem = this.getRateAnalysis(categoryWorkitem, configWorkItems, rateItemsRateAnalysis, unitsRateAnalysis, notesRateAnalysis);
            if (workItem) {
                buildingWorkItems.push(workItem);
            }
        }
        for (var _a = 0, configWorkItems_1 = configWorkItems; _a < configWorkItems_1.length; _a++) {
            var configWorkItem = configWorkItems_1[_a];
            var isWorkItemExistSQL = 'SELECT * FROM ? AS workitems WHERE TRIM(workitems.name)= ?';
            var workItemExistArray = alasql(isWorkItemExistSQL, [workItemsByCategory, configWorkItem.name]);
            if (workItemExistArray.length === 0 && configWorkItem.rateAnalysisId) {
                var workitem = this.convertConfigorkitem(configWorkItem);
                buildingWorkItems.push(workitem);
            }
        }
    };
    RateAnalysisService.prototype.convertConfigorkitem = function (configWorkItem) {
        var workItem = new WorkItem(configWorkItem.name, configWorkItem.rateAnalysisId);
        workItem.isDirectRate = !configWorkItem.isRateAnalysis;
        workItem.isRateAnalysis = configWorkItem.isRateAnalysis;
        workItem.isMeasurementSheet = configWorkItem.isMeasurementSheet;
        workItem.isSteelWorkItem = configWorkItem.isSteelWorkItem;
        workItem.rateAnalysisPerUnit = configWorkItem.rateAnalysisPerUnit;
        workItem.rateAnalysisUnit = configWorkItem.rateAnalysisUnit;
        workItem.isItemBreakdownRequired = configWorkItem.isItemBreakdownRequired;
        workItem.length = configWorkItem.length;
        workItem.breadthOrWidth = configWorkItem.breadthOrWidth;
        workItem.height = configWorkItem.height;
        workItem.unit = configWorkItem.measurementUnit;
        if (!configWorkItem.isRateAnalysis) {
            workItem.rate.total = configWorkItem.directRate;
            workItem.rate.unit = configWorkItem.directRatePerUnit;
            workItem.rate.isEstimated = true;
        }
        else {
            logger.error('WorkItem error for rateAnalysis : ' + configWorkItem.name);
        }
        return workItem;
    };
    RateAnalysisService.prototype.getRateAnalysis = function (categoryWorkitem, configWorkItems, rateItemsRateAnalysis, unitsRateAnalysis, notesRateAnalysis) {
        var isWorkItemExistSQL = 'SELECT * FROM ? AS workitems WHERE TRIM(workitems.name)= ?';
        var workItemExistArray = alasql(isWorkItemExistSQL, [configWorkItems, categoryWorkitem.name]);
        if (workItemExistArray.length !== 0) {
            var workItem = new WorkItem(categoryWorkitem.name, categoryWorkitem.rateAnalysisId);
            if (categoryWorkitem.active !== undefined && categoryWorkitem.active !== null) {
                workItem = categoryWorkitem;
            }
            workItem.unit = workItemExistArray[0].measurementUnit;
            workItem.isMeasurementSheet = workItemExistArray[0].isMeasurementSheet;
            workItem.isRateAnalysis = workItemExistArray[0].isRateAnalysis;
            workItem.isSteelWorkItem = workItemExistArray[0].isSteelWorkItem;
            workItem.rateAnalysisPerUnit = workItemExistArray[0].rateAnalysisPerUnit;
            workItem.isItemBreakdownRequired = workItemExistArray[0].isItemBreakdownRequired;
            workItem.length = workItemExistArray[0].length;
            workItem.breadthOrWidth = workItemExistArray[0].breadthOrWidth;
            workItem.height = workItemExistArray[0].height;
            var rateItemsRateAnalysisSQL = 'SELECT rateItem.C2 AS itemName, rateItem.C2 AS originalItemName,' +
                'rateItem.C12 AS rateAnalysisId, rateItem.C6 AS type,' +
                'ROUND(rateItem.C7,2) AS quantity, ROUND(rateItem.C3,2) AS rate, unit.C2 AS unit,' +
                'ROUND(rateItem.C3 * rateItem.C7,2) AS totalAmount, rateItem.C5 AS totalQuantity, rateItem.C13 AS notesRateAnalysisId  ' +
                'FROM ? AS rateItem JOIN ? AS unit ON unit.C1 = rateItem.C9 where rateItem.C1 = '
                + categoryWorkitem.rateAnalysisId;
            var rateItemsByWorkItem = alasql(rateItemsRateAnalysisSQL, [rateItemsRateAnalysis, unitsRateAnalysis]);
            var notes = '';
            var imageURL = '';
            workItem.rate.rateItems = rateItemsByWorkItem;
            workItem.rate.unit = workItemExistArray[0].rateAnalysisUnit;
            if (rateItemsByWorkItem && rateItemsByWorkItem.length > 0) {
                var notesRateAnalysisSQL = 'SELECT notes.C2 AS notes, notes.C3 AS imageURL FROM ? AS notes where notes.C1 = ' +
                    rateItemsByWorkItem[0].notesRateAnalysisId;
                var notesList = alasql(notesRateAnalysisSQL, [notesRateAnalysis]);
                notes = notesList[0].notes;
                imageURL = notesList[0].imageURL;
                workItem.rate.quantity = rateItemsByWorkItem[0].totalQuantity;
                workItem.systemRate.quantity = rateItemsByWorkItem[0].totalQuantity;
            }
            else {
                workItem.rate.quantity = 1;
                workItem.systemRate.quantity = 1;
            }
            workItem.rate.isEstimated = true;
            workItem.rate.notes = notes;
            workItem.rate.imageURL = imageURL;
            workItem.systemRate.rateItems = rateItemsByWorkItem;
            workItem.systemRate.notes = notes;
            workItem.systemRate.imageURL = imageURL;
            return workItem;
        }
        return null;
    };
    RateAnalysisService.prototype.SyncRateAnalysis = function () {
        var _this = this;
        var rateAnalysisService = new RateAnalysisService();
        this.convertCostHeadsFromRateAnalysisToCostControl(Constants.BUILDING, function (error, buildingData) {
            if (error) {
                logger.error('RateAnalysis Sync Failed.');
            }
            else {
                _this.convertCostHeadsFromRateAnalysisToCostControl(Constants.BUILDING, function (error, projectData) {
                    if (error) {
                        logger.error('RateAnalysis Sync Failed.');
                    }
                    else {
                        var buildingCostHeads = JSON.parse(JSON.stringify(buildingData.buildingCostHeads));
                        var projectCostHeads = JSON.parse(JSON.stringify(projectData.buildingCostHeads));
                        var configCostHeads = config.get('configCostHeads');
                        var configProjectCostHeads = config.get('configProjectCostHeads');
                        var fixedCostConfigProjectCostHeads = config.get('fixedCostConfigProjectCostHeads');
                        _this.convertConfigCostHeads(configCostHeads, buildingCostHeads);
                        _this.convertConfigCostHeads(configProjectCostHeads, projectCostHeads);
                        _this.convertConfigCostHeads(fixedCostConfigProjectCostHeads, projectCostHeads);
                        buildingCostHeads = alasql('SELECT * FROM ? ORDER BY priorityId', [buildingCostHeads]);
                        projectCostHeads = alasql('SELECT * FROM ? ORDER BY priorityId', [projectCostHeads]);
                        var buildingRates = _this.getRates(buildingData, buildingCostHeads);
                        var projectRates = _this.getRates(projectData, projectCostHeads);
                        var rateAnalysis = new RateAnalysis(buildingCostHeads, buildingRates, projectCostHeads, projectRates);
                        _this.saveRateAnalysis(rateAnalysis);
                    }
                });
            }
        });
    };
    RateAnalysisService.prototype.convertConfigCostHeads = function (configCostHeads, costHeadsData) {
        for (var _i = 0, configCostHeads_1 = configCostHeads; _i < configCostHeads_1.length; _i++) {
            var configCostHead = configCostHeads_1[_i];
            var costHeadExistSQL = 'SELECT * FROM ? AS costHeads WHERE costHeads.name= ?';
            var costHeadExistArray = alasql(costHeadExistSQL, [costHeadsData, configCostHead.name]);
            if (costHeadExistArray.length === 0 && configCostHead.rateAnalysisId) {
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
                        workItem.isMeasurementSheet = configWorkItem.isMeasurementSheet;
                        workItem.isRateAnalysis = configWorkItem.isRateAnalysis;
                        workItem.rateAnalysisPerUnit = configWorkItem.rateAnalysisPerUnit;
                        workItem.isSteelWorkItem = configWorkItem.isSteelWorkItem;
                        workItem.isItemBreakdownRequired = configWorkItem.isItemBreakdownRequired;
                        workItem.length = configWorkItem.length;
                        workItem.breadthOrWidth = configWorkItem.breadthOrWidth;
                        workItem.height = configWorkItem.height;
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
        }
        return costHeadsData;
    };
    RateAnalysisService.prototype.getRates = function (result, costHeads) {
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
    RateAnalysisService.prototype.saveRateAnalysis = function (rateAnalysis) {
        var _this = this;
        logger.info('saveRateAnalysis is been hit');
        var query = {};
        this.rateAnalysisRepository.retrieve({}, function (error, rateAnalysisArray) {
            if (error) {
                logger.error('Unable to retrive synced RateAnalysis');
            }
            else {
                if (rateAnalysisArray.length > 0) {
                    query = { _id: rateAnalysisArray[0]._id };
                    var update = { $set: {
                            'projectCostHeads': rateAnalysis.projectCostHeads,
                            'projectRates': rateAnalysis.projectRates,
                            'buildingCostHeads': rateAnalysis.buildingCostHeads,
                            'buildingRates': rateAnalysis.buildingRates
                        } };
                    _this.rateAnalysisRepository.findOneAndUpdate(query, update, { new: true }, function (error, rateAnalysisArray) {
                        if (error) {
                            logger.error('saveRateAnalysis failed => ' + error.message);
                        }
                        else {
                            logger.info('Updated RateAnalysis.');
                        }
                    });
                }
                else {
                    _this.rateAnalysisRepository.create(rateAnalysis, function (error, result) {
                        if (error) {
                            logger.error('saveRateAnalysis failed => ' + error.message);
                        }
                        else {
                            logger.info('Saved RateAnalysis.');
                        }
                    });
                }
            }
        });
    };
    RateAnalysisService.prototype.getCostControlRateAnalysis = function (query, projection, callback) {
        this.rateAnalysisRepository.retrieveWithProjection(query, projection, function (error, rateAnalysisArray) {
            if (error) {
                callback(error, null);
            }
            else {
                if (rateAnalysisArray.length === 0) {
                    logger.error('ContControl RateAnalysis not found.');
                    callback('ContControl RateAnalysis not found.', null);
                }
                else {
                    callback(null, rateAnalysisArray[0]);
                }
            }
        });
    };
    RateAnalysisService.prototype.getAggregateData = function (query, callback) {
        this.rateAnalysisRepository.aggregate(query, callback);
    };
    return RateAnalysisService;
}());
Object.seal(RateAnalysisService);
module.exports = RateAnalysisService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHBsaWNhdGlvblByb2plY3Qvc2VydmljZXMvUmF0ZUFuYWx5c2lzU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsb0VBQXVFO0FBQ3ZFLGtFQUFxRTtBQUVyRSw4RUFBaUY7QUFDakYsMEVBQTZFO0FBQzdFLHdFQUEyRTtBQUMzRSwrQkFBa0M7QUFDbEMsZ0VBQW1FO0FBQ25FLHdFQUEyRTtBQUMzRSx3RUFBMkU7QUFHM0UsK0NBQWtEO0FBQ2xELHdGQUEyRjtBQUMzRiw0RUFBK0U7QUFHL0UsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2pDLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDL0IsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBRXZELElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0FBRXREO0lBT0U7UUFDRSxJQUFJLENBQUMsUUFBUSxHQUFHLFlBQVksQ0FBQyxRQUFRLENBQUM7UUFDdEMsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLGVBQWUsRUFBRSxDQUFDO1FBQzdDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxXQUFXLEVBQUUsQ0FBQztRQUNyQyxJQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxzQkFBc0IsRUFBRSxDQUFDO0lBQzdELENBQUM7SUFFRCwwQ0FBWSxHQUFaLFVBQWEsR0FBVyxFQUFFLElBQVUsRUFBRSxRQUEyQztRQUMvRSxNQUFNLENBQUMsSUFBSSxDQUFDLGtEQUFrRCxDQUFDLENBQUM7UUFDaEUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUMsRUFBRSxVQUFVLEtBQVUsRUFBRSxRQUFhLEVBQUUsSUFBUztZQUNwRSxFQUFF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Q0FBQyxTQUFTLENBQUMsS0FBSyxFQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFDSCwwQkFBQztBQUFELENBeG9CQSxBQXdvQkMsSUFBQTtBQUdELE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUNqQyxpQkFBUyxtQkFBbUIsQ0FBQyIsImZpbGUiOiJhcHAvYXBwbGljYXRpb25Qcm9qZWN0L3NlcnZpY2VzL1JhdGVBbmFseXNpc1NlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVXNlclNlcnZpY2UgPSByZXF1aXJlKCcuLy4uLy4uL2ZyYW1ld29yay9zZXJ2aWNlcy9Vc2VyU2VydmljZScpO1xyXG5pbXBvcnQgUHJvamVjdEFzc2V0ID0gcmVxdWlyZSgnLi4vLi4vZnJhbWV3b3JrL3NoYXJlZC9wcm9qZWN0YXNzZXQnKTtcclxuaW1wb3J0IFVzZXIgPSByZXF1aXJlKCcuLi8uLi9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9tb25nb29zZS91c2VyJyk7XHJcbmltcG9ydCBBdXRoSW50ZXJjZXB0b3IgPSByZXF1aXJlKCcuLi8uLi9mcmFtZXdvcmsvaW50ZXJjZXB0b3IvYXV0aC5pbnRlcmNlcHRvcicpO1xyXG5pbXBvcnQgQ29zdENvbnRyb2xsRXhjZXB0aW9uID0gcmVxdWlyZSgnLi4vZXhjZXB0aW9uL0Nvc3RDb250cm9sbEV4Y2VwdGlvbicpO1xyXG5pbXBvcnQgV29ya0l0ZW0gPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3Byb2plY3QvYnVpbGRpbmcvV29ya0l0ZW0nKTtcclxuaW1wb3J0IGFsYXNxbCA9IHJlcXVpcmUoJ2FsYXNxbCcpO1xyXG5pbXBvcnQgUmF0ZSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9idWlsZGluZy9SYXRlJyk7XHJcbmltcG9ydCBDb3N0SGVhZCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9idWlsZGluZy9Db3N0SGVhZCcpO1xyXG5pbXBvcnQgQ2F0ZWdvcnkgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3Byb2plY3QvYnVpbGRpbmcvQ2F0ZWdvcnknKTtcclxuaW1wb3J0IFF1YW50aXR5ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L2J1aWxkaW5nL1F1YW50aXR5Jyk7XHJcblxyXG5pbXBvcnQgQ29uc3RhbnRzID0gcmVxdWlyZSgnLi4vc2hhcmVkL2NvbnN0YW50cycpO1xyXG5pbXBvcnQgUmF0ZUFuYWx5c2lzUmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9SYXRlQW5hbHlzaXNSZXBvc2l0b3J5Jyk7XHJcbmltcG9ydCBSYXRlQW5hbHlzaXMgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL1JhdGVBbmFseXNpcy9SYXRlQW5hbHlzaXMnKTtcclxuaW1wb3J0IHsgQXR0YWNobWVudERldGFpbHNNb2RlbCB9IGZyb20gJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9idWlsZGluZy9BdHRhY2htZW50RGV0YWlscyc7XHJcblxyXG5sZXQgcmVxdWVzdCA9IHJlcXVpcmUoJ3JlcXVlc3QnKTtcclxubGV0IGNvbmZpZyA9IHJlcXVpcmUoJ2NvbmZpZycpO1xyXG52YXIgbG9nNGpzID0gcmVxdWlyZSgnbG9nNGpzJyk7XHJcbnZhciBsb2dnZXIgPSBsb2c0anMuZ2V0TG9nZ2VyKCdSYXRlIEFuYWx5c2lzIFNlcnZpY2UnKTtcclxuXHJcbmxldCBDQ1Byb21pc2UgPSByZXF1aXJlKCdwcm9taXNlL2xpYi9lczYtZXh0ZW5zaW9ucycpO1xyXG5cclxuY2xhc3MgUmF0ZUFuYWx5c2lzU2VydmljZSB7XHJcbiAgQVBQX05BTUU6IHN0cmluZztcclxuICBjb21wYW55X25hbWU6IHN0cmluZztcclxuICBwcml2YXRlIGF1dGhJbnRlcmNlcHRvcjogQXV0aEludGVyY2VwdG9yO1xyXG4gIHByaXZhdGUgdXNlclNlcnZpY2U6IFVzZXJTZXJ2aWNlO1xyXG4gIHByaXZhdGUgcmF0ZUFuYWx5c2lzUmVwb3NpdG9yeTogUmF0ZUFuYWx5c2lzUmVwb3NpdG9yeTtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLkFQUF9OQU1FID0gUHJvamVjdEFzc2V0LkFQUF9OQU1FO1xyXG4gICAgdGhpcy5hdXRoSW50ZXJjZXB0b3IgPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XHJcbiAgICB0aGlzLnVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICB0aGlzLnJhdGVBbmFseXNpc1JlcG9zaXRvcnkgPSBuZXcgUmF0ZUFuYWx5c2lzUmVwb3NpdG9yeSgpO1xyXG4gIH1cclxuXHJcbiAgZ2V0Q29zdEhlYWRzKHVybDogc3RyaW5nLCB1c2VyOiBVc2VyLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUmF0ZSBBbmFseXNpcyBTZXJ2aWNlLCBnZXRDb3N0SGVhZHMgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICByZXF1ZXN0LmdldCh7dXJsOiB1cmx9LCBmdW5jdGlvbiAoZXJyb3I6IGFueSwgcmVzcG9uc2U6IGFueSwgYm9keTogYW55KSB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIGlmICghZXJyb3IgJiYgcmVzcG9uc2UpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnUkVTUE9OU0UgSlNPTiA6ICcgKyBKU09OLnN0cmluZ2lmeShKU09OLnBhcnNlKGJvZHkpKSk7XHJcbiAgICAgICAgbGV0IHJlcyA9IEpTT04ucGFyc2UoYm9keSk7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRXb3JrSXRlbXModXJsOiBzdHJpbmcsIHVzZXI6IFVzZXIsIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdSYXRlIEFuYWx5c2lzIFNlcnZpY2UsIGdldFdvcmtJdGVtcyBoYXMgYmVlbiBoaXQnKTtcclxuICAgIHJlcXVlc3QuZ2V0KHt1cmw6IHVybH0sIGZ1bmN0aW9uIChlcnJvcjogYW55LCByZXNwb25zZTogYW55LCBib2R5OiBhbnkpIHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2UgaWYgKCFlcnJvciAmJiByZXNwb25zZSkge1xyXG4gICAgICAgIGxldCByZXMgPSBKU09OLnBhcnNlKGJvZHkpO1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHJlcyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0V29ya0l0ZW1zQnlDb3N0SGVhZElkKHVybDogc3RyaW5nLCBjb3N0SGVhZElkOiBzdHJpbmcsIHVzZXI6IFVzZXIsIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdSYXRlIEFuYWx5c2lzIFNlcnZpY2UsIGdldFdvcmtJdGVtc0J5Q29zdEhlYWRJZCBoYXMgYmVlbiBoaXQnKTtcclxuICAgIGxldCB3b3JrSXRlbXM6IEFycmF5PFdvcmtJdGVtPiA9IFtdO1xyXG4gICAgcmVxdWVzdC5nZXQoe3VybDogdXJsfSwgZnVuY3Rpb24gKGVycm9yOiBhbnksIHJlc3BvbnNlOiBhbnksIGJvZHk6IGFueSkge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSBpZiAoIWVycm9yICYmIHJlc3BvbnNlKSB7XHJcbiAgICAgICAgbGV0IHJlcyA9IEpTT04ucGFyc2UoYm9keSk7XHJcbiAgICAgICAgaWYgKHJlcykge1xyXG5cclxuICAgICAgICAgIGZvciAobGV0IHdvcmtpdGVtIG9mIHJlcy5TdWJJdGVtVHlwZSkge1xyXG4gICAgICAgICAgICBpZiAocGFyc2VJbnQoY29zdEhlYWRJZCkgPT09IHdvcmtpdGVtLkMzKSB7XHJcbiAgICAgICAgICAgICAgbGV0IHdvcmtpdGVtRGV0YWlscyA9IG5ldyBXb3JrSXRlbSh3b3JraXRlbS5DMiwgd29ya2l0ZW0uQzEpO1xyXG4gICAgICAgICAgICAgIHdvcmtJdGVtcy5wdXNoKHdvcmtpdGVtRGV0YWlscyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgd29ya0l0ZW1zKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRBcGlDYWxsKHVybDogc3RyaW5nLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3BvbnNlOiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdnZXRBcGlDYWxsIGZvciByYXRlQW5hbHlzaXMgaGFzIGJlZSBoaXQgZm9yIHVybCA6ICcgKyB1cmwpO1xyXG4gICAgICByZXF1ZXN0LmdldCh7dXJsOiB1cmx9LCBmdW5jdGlvbiAoZXJyb3I6IGFueSwgcmVzcG9uc2U6IGFueSwgYm9keTogYW55KSB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICBjYWxsYmFjayhuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGVycm9yLm1lc3NhZ2UsIGVycm9yLnN0YWNrKSwgbnVsbCk7XHJcbiAgICAgICAgfSBlbHNlIGlmICghZXJyb3IgJiYgcmVzcG9uc2UpIHtcclxuICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGxldCByZXMgPSBKU09OLnBhcnNlKGJvZHkpO1xyXG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCByZXMpO1xyXG4gICAgICAgICAgfWNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgbG9nZ2VyLmVycm9yKCdQcm9taXNlIGZhaWxlZCBmb3IgaW5kaXZpZHVhbCAhIHVybDonICsgdXJsICsgJzpcXG4gZXJyb3IgOicgKyBKU09OLnN0cmluZ2lmeShlcnIubWVzc2FnZSkpO1xyXG5cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0UmF0ZSh3b3JrSXRlbUlkOiBudW1iZXIsIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgZGF0YTogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBsZXQgdXJsID0gY29uZmlnLmdldCgncmF0ZUFuYWx5c2lzQVBJLnVuaXQnKTtcclxuICAgIHRoaXMuZ2V0QXBpQ2FsbCh1cmwsIChlcnJvciwgdW5pdERhdGEpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHVuaXREYXRhID0gdW5pdERhdGFbJ1VPTSddO1xyXG4gICAgICAgIHVybCA9IGNvbmZpZy5nZXQoJ3JhdGVBbmFseXNpc0FQSS5yYXRlJyk7XHJcbiAgICAgICAgdGhpcy5nZXRBcGlDYWxsKHVybCwgKGVycm9yLCBkYXRhKSA9PiB7XHJcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IHJhdGUgPSBkYXRhWydSYXRlQW5hbHlzaXNEYXRhJ107XHJcbiAgICAgICAgICAgIGxldCBzcWwgPSAnU0VMRUNUIHJhdGUuQzUgQVMgcXVhbnRpdHksIHVuaXQuQzIgQXMgdW5pdCBGUk9NID8gQVMgcmF0ZSBKT0lOID8gQVMgdW5pdCBvbiB1bml0LkMxID0gIHJhdGUuQzggYW5kJyArXHJcbiAgICAgICAgICAgICAgJyByYXRlLkMxID0gJyArIHdvcmtJdGVtSWQ7XHJcbiAgICAgICAgICAgIGxldCBzcWwyID0gJ1NFTEVDVCByYXRlLkMxIEFTIHJhdGVBbmFseXNpc0lkLCByYXRlLkMyIEFTIGl0ZW1OYW1lLFJPVU5EKHJhdGUuQzcsMikgQVMgcXVhbnRpdHksUk9VTkQocmF0ZS5DMywyKSBBUyByYXRlLCcgK1xyXG4gICAgICAgICAgICAgICcgUk9VTkQocmF0ZS5DMypyYXRlLkM3LDIpIEFTIHRvdGFsQW1vdW50LCByYXRlLkM2IHR5cGUsIHVuaXQuQzIgQXMgdW5pdCBGUk9NID8gQVMgcmF0ZSBKT0lOID8gQVMgdW5pdCBPTiB1bml0LkMxID0gcmF0ZS5DOScgK1xyXG4gICAgICAgICAgICAgICcgIFdIRVJFIHJhdGUuQzEgPSAnICsgd29ya0l0ZW1JZDtcclxuICAgICAgICAgICAgbGV0IHNxbDMgPSAnU0VMRUNUIFJPVU5EKFNVTShyYXRlLkMzKnJhdGUuQzcpIC8gU1VNKHJhdGUuQzcpLDIpIEFTIHRvdGFsICBGUk9NID8gQVMgcmF0ZSBKT0lOID8gQVMgdW5pdCBPTiB1bml0LkMxID0gcmF0ZS5DOScgK1xyXG4gICAgICAgICAgICAgICcgIFdIRVJFIHJhdGUuQzEgPSAnICsgd29ya0l0ZW1JZDtcclxuICAgICAgICAgICAgbGV0IHF1YW50aXR5QW5kVW5pdCA9IGFsYXNxbChzcWwsIFtyYXRlLCB1bml0RGF0YV0pO1xyXG4gICAgICAgICAgICBsZXQgcmF0ZVJlc3VsdDogUmF0ZSA9IG5ldyBSYXRlKCk7XHJcbiAgICAgICAgICAgIGxldCB0b3RhbHJhdGVGcm9tUmF0ZUFuYWx5c2lzID0gYWxhc3FsKHNxbDMsIFtyYXRlLCB1bml0RGF0YV0pO1xyXG4gICAgICAgICAgICByYXRlUmVzdWx0LnF1YW50aXR5ID0gcXVhbnRpdHlBbmRVbml0WzBdLnF1YW50aXR5O1xyXG4gICAgICAgICAgICByYXRlUmVzdWx0LnVuaXQgPSBxdWFudGl0eUFuZFVuaXRbMF0udW5pdDtcclxuICAgICAgICAgICAgcmF0ZVJlc3VsdC5yYXRlRnJvbVJhdGVBbmFseXNpcyA9IHBhcnNlRmxvYXQoKHRvdGFscmF0ZUZyb21SYXRlQW5hbHlzaXNbMF0udG90YWwpLnRvRml4ZWQoMikpO1xyXG4gICAgICAgICAgICByYXRlID0gYWxhc3FsKHNxbDIsIFtyYXRlLCB1bml0RGF0YV0pO1xyXG4gICAgICAgICAgICByYXRlUmVzdWx0LnJhdGVJdGVtcyA9IHJhdGU7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJhdGVSZXN1bHQpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvL1RPRE8gOiBEZWxldGUgQVBJJ3MgcmVsYXRlZCB0byB3b3JraXRlbXMgYWRkLCBkZWxlZXQsIGdldCBsaXN0LlxyXG4gIGdldFdvcmtpdGVtTGlzdChjb3N0SGVhZElkOiBudW1iZXIsIGNhdGVnb3J5SWQ6IG51bWJlciwgY2FsbGJhY2s6IChlcnJvcjogYW55LCBkYXRhOiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxldCB1cmwgPSBjb25maWcuZ2V0KCdyYXRlQW5hbHlzaXNBUEkud29ya2l0ZW0nKTtcclxuICAgIHRoaXMuZ2V0QXBpQ2FsbCh1cmwsIChlcnJvciwgd29ya2l0ZW0pID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCBzcWw6IHN0cmluZyA9ICdTRUxFQ1QgQzIgQVMgcmF0ZUFuYWx5c2lzSWQsIEMzIEFTIG5hbWUgRlJPTSA/IFdIRVJFIEMxID0gJyArIGNvc3RIZWFkSWQgKyAnIGFuZCBDNCA9ICcgKyBjYXRlZ29yeUlkO1xyXG4gICAgICAgIGlmIChjYXRlZ29yeUlkID09PSAwKSB7XHJcbiAgICAgICAgICBzcWwgPSAnU0VMRUNUIEMyIEFTIHJhdGVBbmFseXNpc0lkLCBDMyBBUyBuYW1lIEZST00gPyBXSEVSRSBDMSA9ICcgKyBjb3N0SGVhZElkO1xyXG4gICAgICAgIH1cclxuICAgICAgICB3b3JraXRlbSA9IHdvcmtpdGVtWydJdGVtcyddO1xyXG4gICAgICAgIGxldCB3b3JraXRlbUxpc3QgPSBhbGFzcWwoc3FsLCBbd29ya2l0ZW1dKTtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCB3b3JraXRlbUxpc3QpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGNvbnZlcnRDb3N0SGVhZHNGcm9tUmF0ZUFuYWx5c2lzVG9Db3N0Q29udHJvbChlbnRpdHk6IHN0cmluZywgY2FsbGJhY2s6IChlcnJvcjogYW55LCBkYXRhOiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdjb252ZXJ0Q29zdEhlYWRzRnJvbVJhdGVBbmFseXNpc1RvQ29zdENvbnRyb2wgaGFzIGJlZW4gaGl0Jyk7XHJcblxyXG4gICAgbGV0IGNvc3RIZWFkVVJMID0gY29uZmlnLmdldChDb25zdGFudHMuUkFURV9BTkFMWVNJU19BUEkgKyBlbnRpdHkgKyBDb25zdGFudHMuUkFURV9BTkFMWVNJU19DT1NUSEVBRFMpO1xyXG4gICAgbGV0IGNvc3RIZWFkUmF0ZUFuYWx5c2lzUHJvbWlzZSA9IHRoaXMuY3JlYXRlUHJvbWlzZShjb3N0SGVhZFVSTCk7XHJcbiAgICBsb2dnZXIuaW5mbygnY29zdEhlYWRSYXRlQW5hbHlzaXNQcm9taXNlIGZvciBoYXMgYmVlbiBoaXQnKTtcclxuXHJcbiAgICBsZXQgY2F0ZWdvcnlVUkwgPSBjb25maWcuZ2V0KENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0FQSSArIGVudGl0eSArIENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0NBVEVHT1JJRVMpO1xyXG4gICAgbGV0IGNhdGVnb3J5UmF0ZUFuYWx5c2lzUHJvbWlzZSA9IHRoaXMuY3JlYXRlUHJvbWlzZShjYXRlZ29yeVVSTCk7XHJcbiAgICBsb2dnZXIuaW5mbygnY2F0ZWdvcnlSYXRlQW5hbHlzaXNQcm9taXNlIGZvciBoYXMgYmVlbiBoaXQnKTtcclxuXHJcbiAgICBsZXQgd29ya0l0ZW1VUkwgPSBjb25maWcuZ2V0KENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0FQSSArIGVudGl0eSArIENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX1dPUktJVEVNUyk7XHJcbiAgICBsZXQgd29ya0l0ZW1SYXRlQW5hbHlzaXNQcm9taXNlID0gdGhpcy5jcmVhdGVQcm9taXNlKHdvcmtJdGVtVVJMKTtcclxuICAgIGxvZ2dlci5pbmZvKCd3b3JrSXRlbVJhdGVBbmFseXNpc1Byb21pc2UgZm9yIGhhcyBiZWVuIGhpdCcpO1xyXG5cclxuICAgIGxldCByYXRlSXRlbVVSTCA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfQVBJICsgZW50aXR5ICsgQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfUkFURSk7XHJcbiAgICBsZXQgcmF0ZUl0ZW1SYXRlQW5hbHlzaXNQcm9taXNlID0gdGhpcy5jcmVhdGVQcm9taXNlKHJhdGVJdGVtVVJMKTtcclxuICAgIGxvZ2dlci5pbmZvKCdyYXRlSXRlbVJhdGVBbmFseXNpc1Byb21pc2UgZm9yIGhhcyBiZWVuIGhpdCcpO1xyXG5cclxuICAgIGxldCByYXRlQW5hbHlzaXNOb3Rlc1VSTCA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfQVBJICsgZW50aXR5ICsgQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfTk9URVMpO1xyXG4gICAgbGV0IG5vdGVzUmF0ZUFuYWx5c2lzUHJvbWlzZSA9IHRoaXMuY3JlYXRlUHJvbWlzZShyYXRlQW5hbHlzaXNOb3Rlc1VSTCk7XHJcbiAgICBsb2dnZXIuaW5mbygnbm90ZXNSYXRlQW5hbHlzaXNQcm9taXNlIGZvciBoYXMgYmVlbiBoaXQnKTtcclxuXHJcbiAgICBsZXQgYWxsVW5pdHNGcm9tUmF0ZUFuYWx5c2lzVVJMID0gY29uZmlnLmdldChDb25zdGFudHMuUkFURV9BTkFMWVNJU19BUEkgKyBlbnRpdHkgKyBDb25zdGFudHMuUkFURV9BTkFMWVNJU19VTklUKTtcclxuICAgIGxldCB1bml0c1JhdGVBbmFseXNpc1Byb21pc2UgPSB0aGlzLmNyZWF0ZVByb21pc2UoYWxsVW5pdHNGcm9tUmF0ZUFuYWx5c2lzVVJMKTtcclxuICAgIGxvZ2dlci5pbmZvKCd1bml0c1JhdGVBbmFseXNpc1Byb21pc2UgZm9yIGhhcyBiZWVuIGhpdCcpO1xyXG5cclxuICAgIGxvZ2dlci5pbmZvKCdjYWxsaW5nIFByb21pc2UuYWxsJyk7XHJcbiAgICBDQ1Byb21pc2UuYWxsKFtcclxuICAgICAgY29zdEhlYWRSYXRlQW5hbHlzaXNQcm9taXNlLFxyXG4gICAgICBjYXRlZ29yeVJhdGVBbmFseXNpc1Byb21pc2UsXHJcbiAgICAgIHdvcmtJdGVtUmF0ZUFuYWx5c2lzUHJvbWlzZSxcclxuICAgICAgcmF0ZUl0ZW1SYXRlQW5hbHlzaXNQcm9taXNlLFxyXG4gICAgICBub3Rlc1JhdGVBbmFseXNpc1Byb21pc2UsXHJcbiAgICAgIHVuaXRzUmF0ZUFuYWx5c2lzUHJvbWlzZVxyXG4gICAgXSkudGhlbihmdW5jdGlvbiAoZGF0YTogQXJyYXk8YW55Pikge1xyXG4gICAgICBsb2dnZXIuaW5mbygnY29udmVydENvc3RIZWFkc0Zyb21SYXRlQW5hbHlzaXNUb0Nvc3RDb250cm9sIFByb21pc2UuYWxsIEFQSSBpcyBzdWNjZXNzLicpO1xyXG4gICAgICBsZXQgY29zdEhlYWRzUmF0ZUFuYWx5c2lzID0gZGF0YVswXVtDb25zdGFudHMuUkFURV9BTkFMWVNJU19JVEVNX1RZUEVdO1xyXG4gICAgICBsZXQgY2F0ZWdvcmllc1JhdGVBbmFseXNpcyA9IGRhdGFbMV1bQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfU1VCSVRFTV9UWVBFXTtcclxuICAgICAgbGV0IHdvcmtJdGVtc1JhdGVBbmFseXNpcyA9IGRhdGFbMl1bQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfSVRFTVNdO1xyXG4gICAgICBsZXQgcmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzID0gZGF0YVszXVtDb25zdGFudHMuUkFURV9BTkFMWVNJU19EQVRBXTtcclxuICAgICAgbGV0IG5vdGVzUmF0ZUFuYWx5c2lzID0gZGF0YVs0XVtDb25zdGFudHMuUkFURV9BTkFMWVNJU19EQVRBXTtcclxuICAgICAgbGV0IHVuaXRzUmF0ZUFuYWx5c2lzID0gZGF0YVs1XVtDb25zdGFudHMuUkFURV9BTkFMWVNJU19VT01dO1xyXG5cclxuICAgICAgbGV0IGJ1aWxkaW5nQ29zdEhlYWRzOiBBcnJheTxDb3N0SGVhZD4gPSBbXTtcclxuICAgICAgbGV0IHJhdGVBbmFseXNpc1NlcnZpY2UgPSBuZXcgUmF0ZUFuYWx5c2lzU2VydmljZSgpO1xyXG5cclxuICAgICAgcmF0ZUFuYWx5c2lzU2VydmljZS5nZXRDb3N0SGVhZHNGcm9tUmF0ZUFuYWx5c2lzKGNvc3RIZWFkc1JhdGVBbmFseXNpcywgY2F0ZWdvcmllc1JhdGVBbmFseXNpcywgd29ya0l0ZW1zUmF0ZUFuYWx5c2lzLFxyXG4gICAgICAgIHJhdGVJdGVtc1JhdGVBbmFseXNpcywgdW5pdHNSYXRlQW5hbHlzaXMsIG5vdGVzUmF0ZUFuYWx5c2lzLCBidWlsZGluZ0Nvc3RIZWFkcyk7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdzdWNjZXNzIGluICBjb252ZXJ0Q29zdEhlYWRzRnJvbVJhdGVBbmFseXNpc1RvQ29zdENvbnRyb2wuJyk7XHJcbiAgICAgIGNhbGxiYWNrKG51bGwsIHtcclxuICAgICAgICAnYnVpbGRpbmdDb3N0SGVhZHMnOiBidWlsZGluZ0Nvc3RIZWFkcyxcclxuICAgICAgICAncmF0ZXMnOiByYXRlSXRlbXNSYXRlQW5hbHlzaXMsXHJcbiAgICAgICAgJ3VuaXRzJzogdW5pdHNSYXRlQW5hbHlzaXNcclxuICAgICAgfSk7XHJcbiAgICB9KS5jYXRjaChmdW5jdGlvbiAoZTogYW55KSB7XHJcbiAgICAgIGxvZ2dlci5lcnJvcignIFByb21pc2UgZmFpbGVkIGZvciBjb252ZXJ0Q29zdEhlYWRzRnJvbVJhdGVBbmFseXNpc1RvQ29zdENvbnRyb2wgISA6JyArIEpTT04uc3RyaW5naWZ5KGUubWVzc2FnZSkpO1xyXG4gICAgICBDQ1Byb21pc2UucmVqZWN0KGUubWVzc2FnZSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGNyZWF0ZVByb21pc2UodXJsOiBzdHJpbmcpIHtcclxuICAgIHJldHVybiBuZXcgQ0NQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlOiBhbnksIHJlamVjdDogYW55KSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdjcmVhdGVQcm9taXNlIGhhcyBiZWVuIGhpdCBmb3IgOiAnICsgdXJsKTtcclxuICAgICAgbGV0IHJhdGVBbmFseXNpc1NlcnZpY2UgPSBuZXcgUmF0ZUFuYWx5c2lzU2VydmljZSgpO1xyXG4gICAgICByYXRlQW5hbHlzaXNTZXJ2aWNlLmdldEFwaUNhbGwodXJsLCAoZXJyb3I6IGFueSwgZGF0YTogYW55KSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnRXJyb3IgaW4gY3JlYXRlUHJvbWlzZSBnZXQgZGF0YSBmcm9tIHJhdGUgYW5hbHlzaXM6ICcgKyBKU09OLnN0cmluZ2lmeShlcnJvcikpO1xyXG4gICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ2NyZWF0ZVByb21pc2UgZGF0YSBmcm9tIHJhdGUgYW5hbHlzaXMgc3VjY2Vzcy4nKTtcclxuICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlOiBhbnkpIHtcclxuICAgICAgbG9nZ2VyLmVycm9yKCdQcm9taXNlIGZhaWxlZCBmb3IgaW5kaXZpZHVhbCAhIHVybDonICsgdXJsICsgJzpcXG4gZXJyb3IgOicgKyBKU09OLnN0cmluZ2lmeShlLm1lc3NhZ2UpKTtcclxuICAgICAgQ0NQcm9taXNlLnJlamVjdChlLm1lc3NhZ2UpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRDb3N0SGVhZHNGcm9tUmF0ZUFuYWx5c2lzKGNvc3RIZWFkc1JhdGVBbmFseXNpczogYW55LCBjYXRlZ29yaWVzUmF0ZUFuYWx5c2lzOiBhbnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3b3JrSXRlbXNSYXRlQW5hbHlzaXM6IGFueSwgcmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzOiBhbnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0c1JhdGVBbmFseXNpczogYW55LCBub3Rlc1JhdGVBbmFseXNpczogYW55LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVpbGRpbmdDb3N0SGVhZHM6IEFycmF5PENvc3RIZWFkPikge1xyXG4gICAgbG9nZ2VyLmluZm8oJ2dldENvc3RIZWFkc0Zyb21SYXRlQW5hbHlzaXMgaGFzIGJlZW4gaGl0LicpO1xyXG4gICAgLy9sZXQgYnVkZ2V0Q29zdEhlYWRzID0gY29uZmlnLmdldCgnYnVkZ2V0ZWRDb3N0Rm9ybXVsYWUnKTtcclxuICAgIGZvciAobGV0IGNvc3RIZWFkSW5kZXggPSAwOyBjb3N0SGVhZEluZGV4IDwgY29zdEhlYWRzUmF0ZUFuYWx5c2lzLmxlbmd0aDsgY29zdEhlYWRJbmRleCsrKSB7XHJcblxyXG4gICAgaWYoY29uZmlnLmhhcygnYnVkZ2V0ZWRDb3N0Rm9ybXVsYWUuJysgY29zdEhlYWRzUmF0ZUFuYWx5c2lzW2Nvc3RIZWFkSW5kZXhdLkMyKSkge1xyXG4gICAgICBsZXQgY29zdEhlYWQgPSBuZXcgQ29zdEhlYWQoKTtcclxuICAgICAgY29zdEhlYWQubmFtZSA9IGNvc3RIZWFkc1JhdGVBbmFseXNpc1tjb3N0SGVhZEluZGV4XS5DMjtcclxuICAgICAgbGV0IGNvbmZpZ0Nvc3RIZWFkcyA9IGNvbmZpZy5nZXQoJ2NvbmZpZ0Nvc3RIZWFkcycpO1xyXG4gICAgICBsZXQgY2F0ZWdvcmllcyA9IG5ldyBBcnJheTxDYXRlZ29yeT4oKTtcclxuXHJcbiAgICAgICAgaWYgKGNvbmZpZ0Nvc3RIZWFkcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICBsZXQgaXNDb3N0SGVhZEV4aXN0U1FMID0gJ1NFTEVDVCAqIEZST00gPyBBUyB3b3JraXRlbXMgV0hFUkUgVFJJTSh3b3JraXRlbXMubmFtZSk9ID8nO1xyXG4gICAgICAgICAgbGV0IGNvc3RIZWFkRXhpc3RBcnJheSA9IGFsYXNxbChpc0Nvc3RIZWFkRXhpc3RTUUwsW2NvbmZpZ0Nvc3RIZWFkcywgY29zdEhlYWQubmFtZV0pO1xyXG4gICAgICAgICAgaWYoY29zdEhlYWRFeGlzdEFycmF5Lmxlbmd0aCAhPT0gMCApIHtcclxuICAgICAgICAgICAgY29zdEhlYWQucHJpb3JpdHlJZCA9IGNvc3RIZWFkRXhpc3RBcnJheVswXS5wcmlvcml0eUlkO1xyXG4gICAgICAgICAgICBjYXRlZ29yaWVzID0gY29zdEhlYWRFeGlzdEFycmF5WzBdLmNhdGVnb3JpZXM7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvc3RIZWFkLnJhdGVBbmFseXNpc0lkID0gY29zdEhlYWRzUmF0ZUFuYWx5c2lzW2Nvc3RIZWFkSW5kZXhdLkMxO1xyXG5cclxuICAgICAgICBsZXQgY2F0ZWdvcmllc1JhdGVBbmFseXNpc1NRTCA9ICdTRUxFQ1QgQ2F0ZWdvcnkuQzEgQVMgcmF0ZUFuYWx5c2lzSWQsIENhdGVnb3J5LkMyIEFTIG5hbWUnICtcclxuICAgICAgICAgICcgRlJPTSA/IEFTIENhdGVnb3J5IHdoZXJlIENhdGVnb3J5LkMzID0gJyArIGNvc3RIZWFkLnJhdGVBbmFseXNpc0lkO1xyXG5cclxuICAgICAgICBsZXQgY2F0ZWdvcmllc0J5Q29zdEhlYWQgPSBhbGFzcWwoY2F0ZWdvcmllc1JhdGVBbmFseXNpc1NRTCwgW2NhdGVnb3JpZXNSYXRlQW5hbHlzaXNdKTtcclxuICAgICAgICBsZXQgYnVpbGRpbmdDYXRlZ29yaWVzOiBBcnJheTxDYXRlZ29yeT4gPSBuZXcgQXJyYXk8Q2F0ZWdvcnk+KCk7XHJcblxyXG4gICAgICAgIGlmIChjYXRlZ29yaWVzQnlDb3N0SGVhZC5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgIHRoaXMuZ2V0V29ya0l0ZW1zV2l0aG91dENhdGVnb3J5RnJvbVJhdGVBbmFseXNpcyhjb3N0SGVhZC5yYXRlQW5hbHlzaXNJZCwgd29ya0l0ZW1zUmF0ZUFuYWx5c2lzLFxyXG4gICAgICAgICAgICByYXRlSXRlbXNSYXRlQW5hbHlzaXMsIHVuaXRzUmF0ZUFuYWx5c2lzLCBub3Rlc1JhdGVBbmFseXNpcywgYnVpbGRpbmdDYXRlZ29yaWVzLCBjYXRlZ29yaWVzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5nZXRDYXRlZ29yaWVzRnJvbVJhdGVBbmFseXNpcyhjYXRlZ29yaWVzQnlDb3N0SGVhZCwgd29ya0l0ZW1zUmF0ZUFuYWx5c2lzLFxyXG4gICAgICAgICAgICByYXRlSXRlbXNSYXRlQW5hbHlzaXMsIHVuaXRzUmF0ZUFuYWx5c2lzLCBub3Rlc1JhdGVBbmFseXNpcywgYnVpbGRpbmdDYXRlZ29yaWVzLCBjYXRlZ29yaWVzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvc3RIZWFkLmNhdGVnb3JpZXMgPSBidWlsZGluZ0NhdGVnb3JpZXM7XHJcbiAgICAgICAgY29zdEhlYWQudGh1bWJSdWxlUmF0ZSA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLlRIVU1CUlVMRV9SQVRFKTtcclxuICAgICAgICBidWlsZGluZ0Nvc3RIZWFkcy5wdXNoKGNvc3RIZWFkKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnQ29zdEhlYWQgVW5hdmFpYWxhYmVsIDogJytjb3N0SGVhZHNSYXRlQW5hbHlzaXNbY29zdEhlYWRJbmRleF0uQzIpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXRDYXRlZ29yaWVzRnJvbVJhdGVBbmFseXNpcyhjYXRlZ29yaWVzQnlDb3N0SGVhZDogYW55LCB3b3JrSXRlbXNSYXRlQW5hbHlzaXM6IGFueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByYXRlSXRlbXNSYXRlQW5hbHlzaXM6IGFueSwgdW5pdHNSYXRlQW5hbHlzaXM6IGFueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub3Rlc1JhdGVBbmFseXNpczogYW55LCBidWlsZGluZ0NhdGVnb3JpZXM6IEFycmF5PENhdGVnb3J5PiwgY29uZmlnQ2F0ZWdvcmllczogQXJyYXk8Q2F0ZWdvcnk+KSB7XHJcblxyXG4gICAgbG9nZ2VyLmluZm8oJ2dldENhdGVnb3JpZXNGcm9tUmF0ZUFuYWx5c2lzIGhhcyBiZWVuIGhpdC4nKTtcclxuXHJcbiAgICBmb3IgKGxldCBjYXRlZ29yeUluZGV4ID0gMDsgY2F0ZWdvcnlJbmRleCA8IGNhdGVnb3JpZXNCeUNvc3RIZWFkLmxlbmd0aDsgY2F0ZWdvcnlJbmRleCsrKSB7XHJcblxyXG4gICAgICBsZXQgY2F0ZWdvcnkgPSBuZXcgQ2F0ZWdvcnkoY2F0ZWdvcmllc0J5Q29zdEhlYWRbY2F0ZWdvcnlJbmRleF0ubmFtZSwgY2F0ZWdvcmllc0J5Q29zdEhlYWRbY2F0ZWdvcnlJbmRleF0ucmF0ZUFuYWx5c2lzSWQpO1xyXG4gICAgICBsZXQgY29uZmlnV29ya0l0ZW1zID0gbmV3IEFycmF5PFdvcmtJdGVtPigpO1xyXG5cclxuICAgICAgaWYgKGNvbmZpZ0NhdGVnb3JpZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGZvciAobGV0IGNvbmZpZ0NhdGVnb3J5IG9mIGNvbmZpZ0NhdGVnb3JpZXMpIHtcclxuICAgICAgICAgIGlmIChjb25maWdDYXRlZ29yeS5uYW1lID09PSBjYXRlZ29yaWVzQnlDb3N0SGVhZFtjYXRlZ29yeUluZGV4XS5uYW1lKSB7XHJcbiAgICAgICAgICAgIGNvbmZpZ1dvcmtJdGVtcyA9IGNvbmZpZ0NhdGVnb3J5LndvcmtJdGVtcztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCB3b3JrSXRlbXNSYXRlQW5hbHlzaXNTUUwgPSAnU0VMRUNUIHdvcmtJdGVtLkMyIEFTIHJhdGVBbmFseXNpc0lkLCBUUklNKHdvcmtJdGVtLkMzKSBBUyBuYW1lJyArXHJcbiAgICAgICAgJyBGUk9NID8gQVMgd29ya0l0ZW0gd2hlcmUgd29ya0l0ZW0uQzQgPSAnICsgY2F0ZWdvcmllc0J5Q29zdEhlYWRbY2F0ZWdvcnlJbmRleF0ucmF0ZUFuYWx5c2lzSWQ7XHJcblxyXG4gICAgICBsZXQgd29ya0l0ZW1zQnlDYXRlZ29yeSA9IGFsYXNxbCh3b3JrSXRlbXNSYXRlQW5hbHlzaXNTUUwsIFt3b3JrSXRlbXNSYXRlQW5hbHlzaXNdKTtcclxuICAgICAgbGV0IGJ1aWxkaW5nV29ya0l0ZW1zOiBBcnJheTxXb3JrSXRlbT4gPSBuZXcgQXJyYXk8V29ya0l0ZW0+KCk7XHJcblxyXG4gICAgICB0aGlzLmdldFdvcmtJdGVtc0Zyb21SYXRlQW5hbHlzaXMod29ya0l0ZW1zQnlDYXRlZ29yeSwgcmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzLFxyXG4gICAgICAgIHVuaXRzUmF0ZUFuYWx5c2lzLCBub3Rlc1JhdGVBbmFseXNpcywgYnVpbGRpbmdXb3JrSXRlbXMsIGNvbmZpZ1dvcmtJdGVtcyk7XHJcblxyXG4gICAgICBjYXRlZ29yeS53b3JrSXRlbXMgPSBidWlsZGluZ1dvcmtJdGVtcztcclxuICAgICAgaWYoY2F0ZWdvcnkud29ya0l0ZW1zLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICAgIGJ1aWxkaW5nQ2F0ZWdvcmllcy5wdXNoKGNhdGVnb3J5KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmKGNvbmZpZ0NhdGVnb3JpZXMubGVuZ3RoID4gMCkge1xyXG5cclxuICAgICAgZm9yKGxldCBjb25maWdDYXRlZ29yeUluZGV4PTA7IGNvbmZpZ0NhdGVnb3J5SW5kZXggPCBjb25maWdDYXRlZ29yaWVzLmxlbmd0aDsgY29uZmlnQ2F0ZWdvcnlJbmRleCsrKSB7XHJcbiAgICAgICAgbGV0IGlzQ2F0ZWdvcnlFeGlzdHNTUUwgPSAnU0VMRUNUICogRlJPTSA/IEFTIHdvcmtpdGVtcyBXSEVSRSBUUklNKHdvcmtpdGVtcy5uYW1lKT0gPyc7XHJcbiAgICAgICAgbGV0IGNhdGVnb3J5RXhpc3RzQXJyYXkgPSBhbGFzcWwoaXNDYXRlZ29yeUV4aXN0c1NRTCxbY2F0ZWdvcmllc0J5Q29zdEhlYWQsIGNvbmZpZ0NhdGVnb3JpZXNbY29uZmlnQ2F0ZWdvcnlJbmRleF0ubmFtZV0pO1xyXG4gICAgICAgIGlmKGNhdGVnb3J5RXhpc3RzQXJyYXkubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICBsZXQgY29uZmlnQ2F0ID0gbmV3IENhdGVnb3J5KGNvbmZpZ0NhdGVnb3JpZXNbY29uZmlnQ2F0ZWdvcnlJbmRleF0ubmFtZSwgY29uZmlnQ2F0ZWdvcmllc1tjb25maWdDYXRlZ29yeUluZGV4XS5yYXRlQW5hbHlzaXNJZCk7XHJcbiAgICAgICAgICBjb25maWdDYXQud29ya0l0ZW1zID0gdGhpcy5nZXRXb3JraXRlbXNGb3JDb25maWdDYXRlZ29yeShjb25maWdDYXRlZ29yaWVzW2NvbmZpZ0NhdGVnb3J5SW5kZXhdLndvcmtJdGVtcyk7XHJcbiAgICAgICAgICBpZiAoY29uZmlnQ2F0LndvcmtJdGVtcy5sZW5ndGggIT09IDApIHtcclxuICAgICAgICAgICAgYnVpbGRpbmdDYXRlZ29yaWVzLnB1c2goY29uZmlnQ2F0KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldFdvcmtpdGVtc0ZvckNvbmZpZ0NhdGVnb3J5KGNvbmZpZ1dvcmtpdGVtczphbnkpIHtcclxuICAgIGxldCB3b3JrSXRlbXNMaXN0ID0gbmV3IEFycmF5PFdvcmtJdGVtPigpO1xyXG4gICAgZm9yKGxldCB3b3JraXRlbUluZGV4PTA7IHdvcmtpdGVtSW5kZXggPCBjb25maWdXb3JraXRlbXMubGVuZ3RoOyB3b3JraXRlbUluZGV4KyspIHtcclxuICAgICAgbGV0IGNvbmZpZ1dvcmtpdGVtID0gdGhpcy5jb252ZXJ0Q29uZmlnb3JraXRlbShjb25maWdXb3JraXRlbXNbd29ya2l0ZW1JbmRleF0pO1xyXG4gICAgICB3b3JrSXRlbXNMaXN0LnB1c2goY29uZmlnV29ya2l0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHdvcmtJdGVtc0xpc3Q7XHJcbiAgfVxyXG5cclxuICBnZXRXb3JrSXRlbXNXaXRob3V0Q2F0ZWdvcnlGcm9tUmF0ZUFuYWx5c2lzKGNvc3RIZWFkUmF0ZUFuYWx5c2lzSWQ6IG51bWJlciwgd29ya0l0ZW1zUmF0ZUFuYWx5c2lzOiBhbnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByYXRlSXRlbXNSYXRlQW5hbHlzaXM6IGFueSwgdW5pdHNSYXRlQW5hbHlzaXM6IGFueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vdGVzUmF0ZUFuYWx5c2lzOiBhbnksIGJ1aWxkaW5nQ2F0ZWdvcmllczogQXJyYXk8Q2F0ZWdvcnk+LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnQ2F0ZWdvcmllczogQXJyYXk8Q2F0ZWdvcnk+KSB7XHJcblxyXG4gICAgbG9nZ2VyLmluZm8oJ2dldFdvcmtJdGVtc1dpdGhvdXRDYXRlZ29yeUZyb21SYXRlQW5hbHlzaXMgaGFzIGJlZW4gaGl0LicpO1xyXG5cclxuICAgIGxldCB3b3JrSXRlbXNXaXRob3V0Q2F0ZWdvcmllc1JhdGVBbmFseXNpc1NRTCA9ICdTRUxFQ1Qgd29ya0l0ZW0uQzIgQVMgcmF0ZUFuYWx5c2lzSWQsIHdvcmtJdGVtLkMzIEFTIG5hbWUnICtcclxuICAgICAgJyBGUk9NID8gQVMgd29ya0l0ZW0gd2hlcmUgTk9UIHdvcmtJdGVtLkM0IEFORCB3b3JrSXRlbS5DMSA9ICcgKyBjb3N0SGVhZFJhdGVBbmFseXNpc0lkO1xyXG4gICAgbGV0IHdvcmtJdGVtc1dpdGhvdXRDYXRlZ29yaWVzID0gYWxhc3FsKHdvcmtJdGVtc1dpdGhvdXRDYXRlZ29yaWVzUmF0ZUFuYWx5c2lzU1FMLCBbd29ya0l0ZW1zUmF0ZUFuYWx5c2lzXSk7XHJcblxyXG4gICAgbGV0IGJ1aWxkaW5nV29ya0l0ZW1zOiBBcnJheTxXb3JrSXRlbT4gPSBuZXcgQXJyYXk8V29ya0l0ZW0+KCk7XHJcbiAgICBsZXQgY2F0ZWdvcnkgPSBuZXcgQ2F0ZWdvcnkoJ1dvcmsgSXRlbXMnLCAwKTtcclxuICAgIGxldCBjb25maWdXb3JrSXRlbXMgPSBuZXcgQXJyYXk8V29ya0l0ZW0+KCk7XHJcblxyXG4gICAgaWYgKGNvbmZpZ0NhdGVnb3JpZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICBmb3IgKGxldCBjb25maWdDYXRlZ29yeSBvZiBjb25maWdDYXRlZ29yaWVzKSB7XHJcbiAgICAgICAgaWYgKGNvbmZpZ0NhdGVnb3J5Lm5hbWUgPT09ICdXb3JrIEl0ZW1zJykge1xyXG4gICAgICAgICAgY29uZmlnV29ya0l0ZW1zID0gY29uZmlnQ2F0ZWdvcnkud29ya0l0ZW1zO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZ2V0V29ya0l0ZW1zRnJvbVJhdGVBbmFseXNpcyh3b3JrSXRlbXNXaXRob3V0Q2F0ZWdvcmllcywgcmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzLFxyXG4gICAgICB1bml0c1JhdGVBbmFseXNpcywgbm90ZXNSYXRlQW5hbHlzaXMsIGJ1aWxkaW5nV29ya0l0ZW1zLCBjb25maWdXb3JrSXRlbXMpO1xyXG5cclxuICAgIGNhdGVnb3J5LndvcmtJdGVtcyA9IGJ1aWxkaW5nV29ya0l0ZW1zO1xyXG4gICAgYnVpbGRpbmdDYXRlZ29yaWVzLnB1c2goY2F0ZWdvcnkpO1xyXG4gIH1cclxuXHJcbiAgc3luY1JhdGVpdGVtRnJvbVJhdGVBbmFseXNpcyhlbnRpdHk6IHN0cmluZywgYnVpbGRpbmdEZXRhaWxzOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgZGF0YTogYW55KSA9PiB2b2lkKSB7XHJcblxyXG4gICAgbGV0IHJhdGVJdGVtVVJMID0gY29uZmlnLmdldChDb25zdGFudHMuUkFURV9BTkFMWVNJU19BUEkgKyBlbnRpdHkgKyBDb25zdGFudHMuUkFURV9BTkFMWVNJU19SQVRFKTtcclxuICAgIGxldCByYXRlSXRlbVJhdGVBbmFseXNpc1Byb21pc2UgPSB0aGlzLmNyZWF0ZVByb21pc2UocmF0ZUl0ZW1VUkwpO1xyXG4gICAgbG9nZ2VyLmluZm8oJ3JhdGVJdGVtUmF0ZUFuYWx5c2lzUHJvbWlzZSBmb3IgaGFzIGJlZW4gaGl0Jyk7XHJcblxyXG4gICAgbGV0IHJhdGVBbmFseXNpc05vdGVzVVJMID0gY29uZmlnLmdldChDb25zdGFudHMuUkFURV9BTkFMWVNJU19BUEkgKyBlbnRpdHkgKyBDb25zdGFudHMuUkFURV9BTkFMWVNJU19OT1RFUyk7XHJcbiAgICBsZXQgbm90ZXNSYXRlQW5hbHlzaXNQcm9taXNlID0gdGhpcy5jcmVhdGVQcm9taXNlKHJhdGVBbmFseXNpc05vdGVzVVJMKTtcclxuICAgIGxvZ2dlci5pbmZvKCdub3Rlc1JhdGVBbmFseXNpc1Byb21pc2UgZm9yIGhhcyBiZWVuIGhpdCcpO1xyXG5cclxuICAgIGxldCBhbGxVbml0c0Zyb21SYXRlQW5hbHlzaXNVUkwgPSBjb25maWcuZ2V0KENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0FQSSArIGVudGl0eSArIENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX1VOSVQpO1xyXG4gICAgbGV0IHVuaXRzUmF0ZUFuYWx5c2lzUHJvbWlzZSA9IHRoaXMuY3JlYXRlUHJvbWlzZShhbGxVbml0c0Zyb21SYXRlQW5hbHlzaXNVUkwpO1xyXG4gICAgbG9nZ2VyLmluZm8oJ3VuaXRzUmF0ZUFuYWx5c2lzUHJvbWlzZSBmb3IgaGFzIGJlZW4gaGl0Jyk7XHJcblxyXG4gICAgbGV0IGNvc3RIZWFkVVJMID0gY29uZmlnLmdldChDb25zdGFudHMuUkFURV9BTkFMWVNJU19BUEkgKyBlbnRpdHkgKyBDb25zdGFudHMuUkFURV9BTkFMWVNJU19DT1NUSEVBRFMpO1xyXG4gICAgbGV0IGNvc3RIZWFkUmF0ZUFuYWx5c2lzUHJvbWlzZSA9IHRoaXMuY3JlYXRlUHJvbWlzZShjb3N0SGVhZFVSTCk7XHJcbiAgICBsb2dnZXIuaW5mbygnY29zdEhlYWRSYXRlQW5hbHlzaXNQcm9taXNlIGZvciBoYXMgYmVlbiBoaXQnKTtcclxuXHJcbiAgICBDQ1Byb21pc2UuYWxsKFtcclxuICAgICAgcmF0ZUl0ZW1SYXRlQW5hbHlzaXNQcm9taXNlLFxyXG4gICAgICBub3Rlc1JhdGVBbmFseXNpc1Byb21pc2UsXHJcbiAgICAgIHVuaXRzUmF0ZUFuYWx5c2lzUHJvbWlzZSxcclxuICAgICAgY29zdEhlYWRSYXRlQW5hbHlzaXNQcm9taXNlXHJcbiAgICBdKS50aGVuKGZ1bmN0aW9uIChkYXRhOiBBcnJheTxhbnk+KSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdjb252ZXJ0Q29zdEhlYWRzRnJvbVJhdGVBbmFseXNpc1RvQ29zdENvbnRyb2wgUHJvbWlzZS5hbGwgQVBJIGlzIHN1Y2Nlc3MuJyk7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdzdWNjZXNzIGluICBjb252ZXJ0Q29zdEhlYWRzRnJvbVJhdGVBbmFseXNpc1RvQ29zdENvbnRyb2wuJyk7XHJcbiAgICAgIGNhbGxiYWNrKG51bGwsIGRhdGEpO1xyXG4gICAgfSkuY2F0Y2goZnVuY3Rpb24gKGU6IGFueSkge1xyXG4gICAgICBsb2dnZXIuZXJyb3IoJyBQcm9taXNlIGZhaWxlZCBmb3IgY29udmVydENvc3RIZWFkc0Zyb21SYXRlQW5hbHlzaXNUb0Nvc3RDb250cm9sICEgOicgKyBlLm1lc3NhZ2UpO1xyXG4gICAgICBDQ1Byb21pc2UucmVqZWN0KGUubWVzc2FnZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG5cclxuICBnZXRXb3JrSXRlbXNGcm9tUmF0ZUFuYWx5c2lzKHdvcmtJdGVtc0J5Q2F0ZWdvcnk6IGFueSwgcmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzOiBhbnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0c1JhdGVBbmFseXNpczogYW55LCBub3Rlc1JhdGVBbmFseXNpczogYW55LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVpbGRpbmdXb3JrSXRlbXM6IEFycmF5PFdvcmtJdGVtPiwgY29uZmlnV29ya0l0ZW1zOiBBcnJheTxhbnk+KSB7XHJcblxyXG4gICAgbG9nZ2VyLmluZm8oJ2dldFdvcmtJdGVtc0Zyb21SYXRlQW5hbHlzaXMgaGFzIGJlZW4gaGl0LicpO1xyXG4gICAgZm9yIChsZXQgY2F0ZWdvcnlXb3JraXRlbSBvZiB3b3JrSXRlbXNCeUNhdGVnb3J5KSB7XHJcbiAgICAgICAgbGV0IHdvcmtJdGVtID0gdGhpcy5nZXRSYXRlQW5hbHlzaXMoY2F0ZWdvcnlXb3JraXRlbSwgY29uZmlnV29ya0l0ZW1zLCByYXRlSXRlbXNSYXRlQW5hbHlzaXMsXHJcbiAgICAgICAgICB1bml0c1JhdGVBbmFseXNpcywgbm90ZXNSYXRlQW5hbHlzaXMpO1xyXG4gICAgICAgIGlmKHdvcmtJdGVtKSB7XHJcbiAgICAgICAgICBidWlsZGluZ1dvcmtJdGVtcy5wdXNoKHdvcmtJdGVtKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBmb3IobGV0IGNvbmZpZ1dvcmtJdGVtIG9mIGNvbmZpZ1dvcmtJdGVtcykge1xyXG4gICAgICBsZXQgaXNXb3JrSXRlbUV4aXN0U1FMID0gJ1NFTEVDVCAqIEZST00gPyBBUyB3b3JraXRlbXMgV0hFUkUgVFJJTSh3b3JraXRlbXMubmFtZSk9ID8nO1xyXG4gICAgICBsZXQgd29ya0l0ZW1FeGlzdEFycmF5ID0gYWxhc3FsKGlzV29ya0l0ZW1FeGlzdFNRTCxbd29ya0l0ZW1zQnlDYXRlZ29yeSwgY29uZmlnV29ya0l0ZW0ubmFtZV0pO1xyXG4gICAgICBpZih3b3JrSXRlbUV4aXN0QXJyYXkubGVuZ3RoID09PSAwICYmIGNvbmZpZ1dvcmtJdGVtLnJhdGVBbmFseXNpc0lkKSB7XHJcbiAgICAgICAgbGV0IHdvcmtpdGVtID0gdGhpcy5jb252ZXJ0Q29uZmlnb3JraXRlbShjb25maWdXb3JrSXRlbSk7XHJcbiAgICAgICAgYnVpbGRpbmdXb3JrSXRlbXMucHVzaCh3b3JraXRlbSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNvbnZlcnRDb25maWdvcmtpdGVtKGNvbmZpZ1dvcmtJdGVtIDogYW55KSB7XHJcblxyXG4gICAgbGV0IHdvcmtJdGVtID0gbmV3IFdvcmtJdGVtKGNvbmZpZ1dvcmtJdGVtLm5hbWUsIGNvbmZpZ1dvcmtJdGVtLnJhdGVBbmFseXNpc0lkKTtcclxuICAgIHdvcmtJdGVtLmlzRGlyZWN0UmF0ZSA9ICFjb25maWdXb3JrSXRlbS5pc1JhdGVBbmFseXNpcztcclxuICAgIHdvcmtJdGVtLmlzUmF0ZUFuYWx5c2lzID0gY29uZmlnV29ya0l0ZW0uaXNSYXRlQW5hbHlzaXM7XHJcbiAgICB3b3JrSXRlbS5pc01lYXN1cmVtZW50U2hlZXQgPSBjb25maWdXb3JrSXRlbS5pc01lYXN1cmVtZW50U2hlZXQ7XHJcbiAgICB3b3JrSXRlbS5pc1N0ZWVsV29ya0l0ZW0gPSBjb25maWdXb3JrSXRlbS5pc1N0ZWVsV29ya0l0ZW07XHJcbiAgICB3b3JrSXRlbS5yYXRlQW5hbHlzaXNQZXJVbml0ID0gY29uZmlnV29ya0l0ZW0ucmF0ZUFuYWx5c2lzUGVyVW5pdDtcclxuICAgIHdvcmtJdGVtLnJhdGVBbmFseXNpc1VuaXQgPSBjb25maWdXb3JrSXRlbS5yYXRlQW5hbHlzaXNVbml0O1xyXG4gICAgd29ya0l0ZW0uaXNJdGVtQnJlYWtkb3duUmVxdWlyZWQgPSBjb25maWdXb3JrSXRlbS5pc0l0ZW1CcmVha2Rvd25SZXF1aXJlZDtcclxuICAgIHdvcmtJdGVtLmxlbmd0aCA9IGNvbmZpZ1dvcmtJdGVtLmxlbmd0aDtcclxuICAgIHdvcmtJdGVtLmJyZWFkdGhPcldpZHRoID0gY29uZmlnV29ya0l0ZW0uYnJlYWR0aE9yV2lkdGg7XHJcbiAgICB3b3JrSXRlbS5oZWlnaHQgPSBjb25maWdXb3JrSXRlbS5oZWlnaHQ7XHJcbiAgICB3b3JrSXRlbS51bml0ID0gY29uZmlnV29ya0l0ZW0ubWVhc3VyZW1lbnRVbml0O1xyXG5cclxuICAgIGlmKCFjb25maWdXb3JrSXRlbS5pc1JhdGVBbmFseXNpcykge1xyXG4gICAgICB3b3JrSXRlbS5yYXRlLnRvdGFsID0gY29uZmlnV29ya0l0ZW0uZGlyZWN0UmF0ZTtcclxuICAgICAgd29ya0l0ZW0ucmF0ZS51bml0ID0gY29uZmlnV29ya0l0ZW0uZGlyZWN0UmF0ZVBlclVuaXQ7XHJcbiAgICAgIHdvcmtJdGVtLnJhdGUuaXNFc3RpbWF0ZWQgPSB0cnVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbG9nZ2VyLmVycm9yKCdXb3JrSXRlbSBlcnJvciBmb3IgcmF0ZUFuYWx5c2lzIDogJytjb25maWdXb3JrSXRlbS5uYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gd29ya0l0ZW07XHJcbiAgfVxyXG5cclxuICBnZXRSYXRlQW5hbHlzaXMoY2F0ZWdvcnlXb3JraXRlbTogV29ya0l0ZW0sIGNvbmZpZ1dvcmtJdGVtczogQXJyYXk8YW55PiwgcmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzOiBhbnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0c1JhdGVBbmFseXNpczogYW55LCBub3Rlc1JhdGVBbmFseXNpczogYW55KSB7XHJcblxyXG4gICAgbGV0IGlzV29ya0l0ZW1FeGlzdFNRTCA9ICdTRUxFQ1QgKiBGUk9NID8gQVMgd29ya2l0ZW1zIFdIRVJFIFRSSU0od29ya2l0ZW1zLm5hbWUpPSA/JztcclxuICAgIGxldCB3b3JrSXRlbUV4aXN0QXJyYXkgPSBhbGFzcWwoaXNXb3JrSXRlbUV4aXN0U1FMLFtjb25maWdXb3JrSXRlbXMsIGNhdGVnb3J5V29ya2l0ZW0ubmFtZV0pO1xyXG5cclxuICAgIGlmKHdvcmtJdGVtRXhpc3RBcnJheS5sZW5ndGggIT09IDApIHtcclxuXHJcbiAgICAgIGxldCAgd29ya0l0ZW0gPSBuZXcgV29ya0l0ZW0oY2F0ZWdvcnlXb3JraXRlbS5uYW1lLCBjYXRlZ29yeVdvcmtpdGVtLnJhdGVBbmFseXNpc0lkKTtcclxuXHJcbiAgICAgIGlmKGNhdGVnb3J5V29ya2l0ZW0uYWN0aXZlIT09dW5kZWZpbmVkICYmIGNhdGVnb3J5V29ya2l0ZW0uYWN0aXZlIT09bnVsbCkge1xyXG4gICAgICAgIHdvcmtJdGVtID0gY2F0ZWdvcnlXb3JraXRlbTtcclxuICAgICAgfVxyXG5cclxuICAgICAgd29ya0l0ZW0udW5pdCA9IHdvcmtJdGVtRXhpc3RBcnJheVswXS5tZWFzdXJlbWVudFVuaXQ7XHJcbiAgICAgIHdvcmtJdGVtLmlzTWVhc3VyZW1lbnRTaGVldCA9IHdvcmtJdGVtRXhpc3RBcnJheVswXS5pc01lYXN1cmVtZW50U2hlZXQ7XHJcbiAgICAgIHdvcmtJdGVtLmlzUmF0ZUFuYWx5c2lzID0gd29ya0l0ZW1FeGlzdEFycmF5WzBdLmlzUmF0ZUFuYWx5c2lzO1xyXG4gICAgICB3b3JrSXRlbS5pc1N0ZWVsV29ya0l0ZW0gPSB3b3JrSXRlbUV4aXN0QXJyYXlbMF0uaXNTdGVlbFdvcmtJdGVtO1xyXG4gICAgICB3b3JrSXRlbS5yYXRlQW5hbHlzaXNQZXJVbml0ID0gd29ya0l0ZW1FeGlzdEFycmF5WzBdLnJhdGVBbmFseXNpc1BlclVuaXQ7XHJcbiAgICAgIHdvcmtJdGVtLmlzSXRlbUJyZWFrZG93blJlcXVpcmVkID0gd29ya0l0ZW1FeGlzdEFycmF5WzBdLmlzSXRlbUJyZWFrZG93blJlcXVpcmVkO1xyXG4gICAgICB3b3JrSXRlbS5sZW5ndGggPSB3b3JrSXRlbUV4aXN0QXJyYXlbMF0ubGVuZ3RoO1xyXG4gICAgICB3b3JrSXRlbS5icmVhZHRoT3JXaWR0aCA9IHdvcmtJdGVtRXhpc3RBcnJheVswXS5icmVhZHRoT3JXaWR0aDtcclxuICAgICAgd29ya0l0ZW0uaGVpZ2h0ID0gd29ya0l0ZW1FeGlzdEFycmF5WzBdLmhlaWdodDtcclxuXHJcbiAgICAgIGxldCByYXRlSXRlbXNSYXRlQW5hbHlzaXNTUUwgPSAnU0VMRUNUIHJhdGVJdGVtLkMyIEFTIGl0ZW1OYW1lLCByYXRlSXRlbS5DMiBBUyBvcmlnaW5hbEl0ZW1OYW1lLCcgK1xyXG4gICAgICAgICdyYXRlSXRlbS5DMTIgQVMgcmF0ZUFuYWx5c2lzSWQsIHJhdGVJdGVtLkM2IEFTIHR5cGUsJyArXHJcbiAgICAgICAgJ1JPVU5EKHJhdGVJdGVtLkM3LDIpIEFTIHF1YW50aXR5LCBST1VORChyYXRlSXRlbS5DMywyKSBBUyByYXRlLCB1bml0LkMyIEFTIHVuaXQsJyArXHJcbiAgICAgICAgJ1JPVU5EKHJhdGVJdGVtLkMzICogcmF0ZUl0ZW0uQzcsMikgQVMgdG90YWxBbW91bnQsIHJhdGVJdGVtLkM1IEFTIHRvdGFsUXVhbnRpdHksIHJhdGVJdGVtLkMxMyBBUyBub3Rlc1JhdGVBbmFseXNpc0lkICAnICtcclxuICAgICAgICAnRlJPTSA/IEFTIHJhdGVJdGVtIEpPSU4gPyBBUyB1bml0IE9OIHVuaXQuQzEgPSByYXRlSXRlbS5DOSB3aGVyZSByYXRlSXRlbS5DMSA9ICdcclxuICAgICAgICArIGNhdGVnb3J5V29ya2l0ZW0ucmF0ZUFuYWx5c2lzSWQ7XHJcbiAgICAgIGxldCByYXRlSXRlbXNCeVdvcmtJdGVtID0gYWxhc3FsKHJhdGVJdGVtc1JhdGVBbmFseXNpc1NRTCwgW3JhdGVJdGVtc1JhdGVBbmFseXNpcywgdW5pdHNSYXRlQW5hbHlzaXNdKTtcclxuICAgICAgbGV0IG5vdGVzID0gJyc7XHJcbiAgICAgIGxldCBpbWFnZVVSTCA9ICcnO1xyXG4gICAgICB3b3JrSXRlbS5yYXRlLnJhdGVJdGVtcyA9IHJhdGVJdGVtc0J5V29ya0l0ZW07XHJcbiAgICAgIHdvcmtJdGVtLnJhdGUudW5pdCA9IHdvcmtJdGVtRXhpc3RBcnJheVswXS5yYXRlQW5hbHlzaXNVbml0O1xyXG5cclxuICAgICAgaWYgKHJhdGVJdGVtc0J5V29ya0l0ZW0gJiYgcmF0ZUl0ZW1zQnlXb3JrSXRlbS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgbGV0IG5vdGVzUmF0ZUFuYWx5c2lzU1FMID0gJ1NFTEVDVCBub3Rlcy5DMiBBUyBub3Rlcywgbm90ZXMuQzMgQVMgaW1hZ2VVUkwgRlJPTSA/IEFTIG5vdGVzIHdoZXJlIG5vdGVzLkMxID0gJytcclxuICAgICAgICAgIHJhdGVJdGVtc0J5V29ya0l0ZW1bMF0ubm90ZXNSYXRlQW5hbHlzaXNJZDtcclxuICAgICAgICBsZXQgbm90ZXNMaXN0ID0gYWxhc3FsKG5vdGVzUmF0ZUFuYWx5c2lzU1FMLCBbbm90ZXNSYXRlQW5hbHlzaXNdKTtcclxuICAgICAgICBub3RlcyA9IG5vdGVzTGlzdFswXS5ub3RlcztcclxuICAgICAgICBpbWFnZVVSTCA9IG5vdGVzTGlzdFswXS5pbWFnZVVSTDtcclxuXHJcbiAgICAgICAgd29ya0l0ZW0ucmF0ZS5xdWFudGl0eSA9IHJhdGVJdGVtc0J5V29ya0l0ZW1bMF0udG90YWxRdWFudGl0eTtcclxuICAgICAgICB3b3JrSXRlbS5zeXN0ZW1SYXRlLnF1YW50aXR5ID0gcmF0ZUl0ZW1zQnlXb3JrSXRlbVswXS50b3RhbFF1YW50aXR5O1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHdvcmtJdGVtLnJhdGUucXVhbnRpdHkgPSAxO1xyXG4gICAgICAgIHdvcmtJdGVtLnN5c3RlbVJhdGUucXVhbnRpdHkgPSAxO1xyXG4gICAgICB9XHJcbiAgICAgIHdvcmtJdGVtLnJhdGUuaXNFc3RpbWF0ZWQgPSB0cnVlO1xyXG4gICAgICB3b3JrSXRlbS5yYXRlLm5vdGVzID0gbm90ZXM7XHJcbiAgICAgIHdvcmtJdGVtLnJhdGUuaW1hZ2VVUkwgPWltYWdlVVJMO1xyXG5cclxuICAgICAgLy9TeXN0ZW0gcmF0ZVxyXG5cclxuICAgICAgd29ya0l0ZW0uc3lzdGVtUmF0ZS5yYXRlSXRlbXMgPSByYXRlSXRlbXNCeVdvcmtJdGVtO1xyXG4gICAgICB3b3JrSXRlbS5zeXN0ZW1SYXRlLm5vdGVzID0gbm90ZXM7XHJcbiAgICAgIHdvcmtJdGVtLnN5c3RlbVJhdGUuaW1hZ2VVUkwgPSBpbWFnZVVSTDtcclxuICAgICAgcmV0dXJuIHdvcmtJdGVtO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG5cclxuICBTeW5jUmF0ZUFuYWx5c2lzKCkge1xyXG4gICAgbGV0IHJhdGVBbmFseXNpc1NlcnZpY2UgPSBuZXcgUmF0ZUFuYWx5c2lzU2VydmljZSgpO1xyXG4gICAgdGhpcy5jb252ZXJ0Q29zdEhlYWRzRnJvbVJhdGVBbmFseXNpc1RvQ29zdENvbnRyb2woQ29uc3RhbnRzLkJVSUxESU5HLCAoZXJyb3I6IGFueSwgYnVpbGRpbmdEYXRhOiBhbnkpPT4ge1xyXG4gICAgICBpZihlcnJvcikge1xyXG4gICAgICAgIGxvZ2dlci5lcnJvcignUmF0ZUFuYWx5c2lzIFN5bmMgRmFpbGVkLicpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuY29udmVydENvc3RIZWFkc0Zyb21SYXRlQW5hbHlzaXNUb0Nvc3RDb250cm9sKENvbnN0YW50cy5CVUlMRElORywgKGVycm9yOiBhbnksIHByb2plY3REYXRhOiBhbnkpPT4ge1xyXG4gICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGxvZ2dlci5lcnJvcignUmF0ZUFuYWx5c2lzIFN5bmMgRmFpbGVkLicpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IGJ1aWxkaW5nQ29zdEhlYWRzID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShidWlsZGluZ0RhdGEuYnVpbGRpbmdDb3N0SGVhZHMpKTtcclxuICAgICAgICAgICAgbGV0IHByb2plY3RDb3N0SGVhZHMgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHByb2plY3REYXRhLmJ1aWxkaW5nQ29zdEhlYWRzKSk7XHJcbiAgICAgICAgICAgIGxldCBjb25maWdDb3N0SGVhZHMgPSBjb25maWcuZ2V0KCdjb25maWdDb3N0SGVhZHMnKTtcclxuICAgICAgICAgICAgbGV0IGNvbmZpZ1Byb2plY3RDb3N0SGVhZHMgPSBjb25maWcuZ2V0KCdjb25maWdQcm9qZWN0Q29zdEhlYWRzJyk7XHJcbiAgICAgICAgICAgIGxldCBmaXhlZENvc3RDb25maWdQcm9qZWN0Q29zdEhlYWRzID0gY29uZmlnLmdldCgnZml4ZWRDb3N0Q29uZmlnUHJvamVjdENvc3RIZWFkcycpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnZlcnRDb25maWdDb3N0SGVhZHMoY29uZmlnQ29zdEhlYWRzLCBidWlsZGluZ0Nvc3RIZWFkcyk7XHJcbiAgICAgICAgICAgIHRoaXMuY29udmVydENvbmZpZ0Nvc3RIZWFkcyhjb25maWdQcm9qZWN0Q29zdEhlYWRzLCBwcm9qZWN0Q29zdEhlYWRzKTtcclxuICAgICAgICAgICAgdGhpcy5jb252ZXJ0Q29uZmlnQ29zdEhlYWRzKGZpeGVkQ29zdENvbmZpZ1Byb2plY3RDb3N0SGVhZHMsIHByb2plY3RDb3N0SGVhZHMpO1xyXG4gICAgICAgICAgICBidWlsZGluZ0Nvc3RIZWFkcyA9IGFsYXNxbCgnU0VMRUNUICogRlJPTSA/IE9SREVSIEJZIHByaW9yaXR5SWQnLCBbYnVpbGRpbmdDb3N0SGVhZHNdKTtcclxuICAgICAgICAgICAgcHJvamVjdENvc3RIZWFkcyA9IGFsYXNxbCgnU0VMRUNUICogRlJPTSA/IE9SREVSIEJZIHByaW9yaXR5SWQnLCBbcHJvamVjdENvc3RIZWFkc10pO1xyXG4gICAgICAgICAgICBsZXQgYnVpbGRpbmdSYXRlcyA9IHRoaXMuZ2V0UmF0ZXMoYnVpbGRpbmdEYXRhLCBidWlsZGluZ0Nvc3RIZWFkcyk7XHJcbiAgICAgICAgICAgIGxldCBwcm9qZWN0UmF0ZXMgPSB0aGlzLmdldFJhdGVzKHByb2plY3REYXRhLCBwcm9qZWN0Q29zdEhlYWRzKTtcclxuICAgICAgICAgICAgbGV0IHJhdGVBbmFseXNpcyA9IG5ldyBSYXRlQW5hbHlzaXMoYnVpbGRpbmdDb3N0SGVhZHMsIGJ1aWxkaW5nUmF0ZXMsIHByb2plY3RDb3N0SGVhZHMsIHByb2plY3RSYXRlcyk7XHJcbiAgICAgICAgICAgIHRoaXMuc2F2ZVJhdGVBbmFseXNpcyhyYXRlQW5hbHlzaXMpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGNvbnZlcnRDb25maWdDb3N0SGVhZHMoY29uZmlnQ29zdEhlYWRzOiBBcnJheTxhbnk+LCBjb3N0SGVhZHNEYXRhOiBBcnJheTxDb3N0SGVhZD4pIHtcclxuXHJcbiAgICBmb3IgKGxldCBjb25maWdDb3N0SGVhZCBvZiBjb25maWdDb3N0SGVhZHMpIHtcclxuXHJcbiAgICAgIGxldCBjb3N0SGVhZEV4aXN0U1FMID0gJ1NFTEVDVCAqIEZST00gPyBBUyBjb3N0SGVhZHMgV0hFUkUgY29zdEhlYWRzLm5hbWU9ID8nO1xyXG4gICAgICBsZXQgY29zdEhlYWRFeGlzdEFycmF5ID0gYWxhc3FsKGNvc3RIZWFkRXhpc3RTUUwsW2Nvc3RIZWFkc0RhdGEsY29uZmlnQ29zdEhlYWQubmFtZV0pO1xyXG5cclxuICAgICAgaWYoY29zdEhlYWRFeGlzdEFycmF5Lmxlbmd0aCA9PT0gMCAmJiBjb25maWdDb3N0SGVhZC5yYXRlQW5hbHlzaXNJZCkge1xyXG4gICAgICAgIGxldCBjb3N0SGVhZDogQ29zdEhlYWQgPSBuZXcgQ29zdEhlYWQoKTtcclxuICAgICAgICBjb3N0SGVhZC5uYW1lID0gY29uZmlnQ29zdEhlYWQubmFtZTtcclxuICAgICAgICBjb3N0SGVhZC5wcmlvcml0eUlkID0gY29uZmlnQ29zdEhlYWQucHJpb3JpdHlJZDtcclxuICAgICAgICBjb3N0SGVhZC5yYXRlQW5hbHlzaXNJZCA9IGNvbmZpZ0Nvc3RIZWFkLnJhdGVBbmFseXNpc0lkO1xyXG4gICAgICAgIGxldCBjYXRlZ29yaWVzTGlzdCA9IG5ldyBBcnJheTxDYXRlZ29yeT4oKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgY29uZmlnQ2F0ZWdvcnkgb2YgY29uZmlnQ29zdEhlYWQuY2F0ZWdvcmllcykge1xyXG5cclxuICAgICAgICAgIGxldCBjYXRlZ29yeTogQ2F0ZWdvcnkgPSBuZXcgQ2F0ZWdvcnkoY29uZmlnQ2F0ZWdvcnkubmFtZSwgY29uZmlnQ2F0ZWdvcnkucmF0ZUFuYWx5c2lzSWQpO1xyXG4gICAgICAgICAgbGV0IHdvcmtJdGVtc0xpc3Q6IEFycmF5PFdvcmtJdGVtPiA9IG5ldyBBcnJheTxXb3JrSXRlbT4oKTtcclxuXHJcbiAgICAgICAgICBmb3IgKGxldCBjb25maWdXb3JrSXRlbSBvZiBjb25maWdDYXRlZ29yeS53b3JrSXRlbXMpIHtcclxuXHJcbiAgICAgICAgICAgIGxldCB3b3JrSXRlbTogV29ya0l0ZW0gPSBuZXcgV29ya0l0ZW0oY29uZmlnV29ya0l0ZW0ubmFtZSwgY29uZmlnV29ya0l0ZW0ucmF0ZUFuYWx5c2lzSWQpO1xyXG4gICAgICAgICAgICB3b3JrSXRlbS5pc0RpcmVjdFJhdGUgPSB0cnVlO1xyXG4gICAgICAgICAgICB3b3JrSXRlbS51bml0ID0gY29uZmlnV29ya0l0ZW0ubWVhc3VyZW1lbnRVbml0O1xyXG4gICAgICAgICAgICB3b3JrSXRlbS5pc01lYXN1cmVtZW50U2hlZXQgPSBjb25maWdXb3JrSXRlbS5pc01lYXN1cmVtZW50U2hlZXQ7XHJcbiAgICAgICAgICAgIHdvcmtJdGVtLmlzUmF0ZUFuYWx5c2lzID0gY29uZmlnV29ya0l0ZW0uaXNSYXRlQW5hbHlzaXM7XHJcbiAgICAgICAgICAgIHdvcmtJdGVtLnJhdGVBbmFseXNpc1BlclVuaXQgPSBjb25maWdXb3JrSXRlbS5yYXRlQW5hbHlzaXNQZXJVbml0O1xyXG4gICAgICAgICAgICB3b3JrSXRlbS5pc1N0ZWVsV29ya0l0ZW0gPSBjb25maWdXb3JrSXRlbS5pc1N0ZWVsV29ya0l0ZW07XHJcbiAgICAgICAgICAgIHdvcmtJdGVtLmlzSXRlbUJyZWFrZG93blJlcXVpcmVkID0gY29uZmlnV29ya0l0ZW0uaXNJdGVtQnJlYWtkb3duUmVxdWlyZWQ7XHJcbiAgICAgICAgICAgIHdvcmtJdGVtLmxlbmd0aCA9IGNvbmZpZ1dvcmtJdGVtLmxlbmd0aDtcclxuICAgICAgICAgICAgd29ya0l0ZW0uYnJlYWR0aE9yV2lkdGggPSBjb25maWdXb3JrSXRlbS5icmVhZHRoT3JXaWR0aDtcclxuICAgICAgICAgICAgd29ya0l0ZW0uaGVpZ2h0ID0gY29uZmlnV29ya0l0ZW0uaGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgaWYgKGNvbmZpZ1dvcmtJdGVtLmRpcmVjdFJhdGUgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICB3b3JrSXRlbS5yYXRlLnRvdGFsID0gY29uZmlnV29ya0l0ZW0uZGlyZWN0UmF0ZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICB3b3JrSXRlbS5yYXRlLnRvdGFsID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB3b3JrSXRlbS5yYXRlLmlzRXN0aW1hdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgd29ya0l0ZW1zTGlzdC5wdXNoKHdvcmtJdGVtKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNhdGVnb3J5LndvcmtJdGVtcyA9IHdvcmtJdGVtc0xpc3Q7XHJcbiAgICAgICAgICBjYXRlZ29yaWVzTGlzdC5wdXNoKGNhdGVnb3J5KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgICBjb3N0SGVhZC5jYXRlZ29yaWVzID0gY2F0ZWdvcmllc0xpc3Q7XHJcbiAgICAgICAgY29zdEhlYWQudGh1bWJSdWxlUmF0ZSA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLlRIVU1CUlVMRV9SQVRFKTtcclxuICAgICAgICBjb3N0SGVhZHNEYXRhLnB1c2goY29zdEhlYWQpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY29zdEhlYWRzRGF0YTtcclxuICB9XHJcblxyXG4gIGdldFJhdGVzKHJlc3VsdDogYW55LCBjb3N0SGVhZHM6IEFycmF5PENvc3RIZWFkPikge1xyXG4gICAgbGV0IGdldFJhdGVzTGlzdFNRTCA9ICdTRUxFQ1QgKiBGUk9NID8gQVMgcSBXSEVSRSBxLkM0IElOIChTRUxFQ1QgdC5yYXRlQW5hbHlzaXNJZCAnICtcclxuICAgICAgJ0ZST00gPyBBUyB0KSc7XHJcbiAgICBsZXQgcmF0ZUl0ZW1zID0gYWxhc3FsKGdldFJhdGVzTGlzdFNRTCwgW3Jlc3VsdC5yYXRlcywgY29zdEhlYWRzXSk7XHJcblxyXG4gICAgbGV0IHJhdGVJdGVtc1JhdGVBbmFseXNpc1NRTCA9ICdTRUxFQ1QgcmF0ZUl0ZW0uQzIgQVMgaXRlbU5hbWUsIHJhdGVJdGVtLkMyIEFTIG9yaWdpbmFsSXRlbU5hbWUsJyArXHJcbiAgICAgICdyYXRlSXRlbS5DMTIgQVMgcmF0ZUFuYWx5c2lzSWQsIHJhdGVJdGVtLkM2IEFTIHR5cGUsJyArXHJcbiAgICAgICdST1VORChyYXRlSXRlbS5DNywyKSBBUyBxdWFudGl0eSwgUk9VTkQocmF0ZUl0ZW0uQzMsMikgQVMgcmF0ZSwgdW5pdC5DMiBBUyB1bml0LCcgK1xyXG4gICAgICAnUk9VTkQocmF0ZUl0ZW0uQzMgKiByYXRlSXRlbS5DNywyKSBBUyB0b3RhbEFtb3VudCwgcmF0ZUl0ZW0uQzUgQVMgdG90YWxRdWFudGl0eSAnICtcclxuICAgICAgJ0ZST00gPyBBUyByYXRlSXRlbSBKT0lOID8gQVMgdW5pdCBPTiB1bml0LkMxID0gcmF0ZUl0ZW0uQzknO1xyXG5cclxuICAgIGxldCByYXRlSXRlbXNMaXN0ID0gYWxhc3FsKHJhdGVJdGVtc1JhdGVBbmFseXNpc1NRTCwgW3JhdGVJdGVtcywgcmVzdWx0LnVuaXRzXSk7XHJcblxyXG4gICAgbGV0IGRpc3RpbmN0SXRlbXNTUUwgPSAnc2VsZWN0IERJU1RJTkNUIGl0ZW1OYW1lLG9yaWdpbmFsSXRlbU5hbWUscmF0ZSBGUk9NID8nO1xyXG4gICAgdmFyIGRpc3RpbmN0UmF0ZXMgPSBhbGFzcWwoZGlzdGluY3RJdGVtc1NRTCwgW3JhdGVJdGVtc0xpc3RdKTtcclxuXHJcbiAgICByZXR1cm4gZGlzdGluY3RSYXRlcztcclxuICB9XHJcblxyXG4gIHNhdmVSYXRlQW5hbHlzaXMocmF0ZUFuYWx5c2lzOiBSYXRlQW5hbHlzaXMpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdzYXZlUmF0ZUFuYWx5c2lzIGlzIGJlZW4gaGl0Jyk7XHJcbiAgICBsZXQgcXVlcnkgPSB7fTtcclxuICAgIHRoaXMucmF0ZUFuYWx5c2lzUmVwb3NpdG9yeS5yZXRyaWV2ZSh7fSwgKGVycm9yOmFueSwgcmF0ZUFuYWx5c2lzQXJyYXk6IEFycmF5PFJhdGVBbmFseXNpcz4pID0+IHtcclxuICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICBsb2dnZXIuZXJyb3IoJ1VuYWJsZSB0byByZXRyaXZlIHN5bmNlZCBSYXRlQW5hbHlzaXMnKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZihyYXRlQW5hbHlzaXNBcnJheS5sZW5ndGggPjApIHtcclxuICAgICAgICAgIHF1ZXJ5ID0geyBfaWQgOiByYXRlQW5hbHlzaXNBcnJheVswXS5faWR9O1xyXG4gICAgICAgICAgbGV0IHVwZGF0ZSA9IHskc2V0OiB7XHJcbiAgICAgICAgICAgICdwcm9qZWN0Q29zdEhlYWRzJzogcmF0ZUFuYWx5c2lzLnByb2plY3RDb3N0SGVhZHMsXHJcbiAgICAgICAgICAgICdwcm9qZWN0UmF0ZXMnOiByYXRlQW5hbHlzaXMucHJvamVjdFJhdGVzLFxyXG4gICAgICAgICAgICAnYnVpbGRpbmdDb3N0SGVhZHMnOiByYXRlQW5hbHlzaXMuYnVpbGRpbmdDb3N0SGVhZHMsXHJcbiAgICAgICAgICAgICdidWlsZGluZ1JhdGVzJzogcmF0ZUFuYWx5c2lzLmJ1aWxkaW5nUmF0ZXNcclxuICAgICAgICAgIH19O1xyXG4gICAgICAgICAgdGhpcy5yYXRlQW5hbHlzaXNSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIHVwZGF0ZSx7bmV3OiB0cnVlfSwoZXJyb3I6IGFueSwgcmF0ZUFuYWx5c2lzQXJyYXk6IFJhdGVBbmFseXNpcykgPT4ge1xyXG4gICAgICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgICAgIGxvZ2dlci5lcnJvcignc2F2ZVJhdGVBbmFseXNpcyBmYWlsZWQgPT4gJyArIGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oJ1VwZGF0ZWQgUmF0ZUFuYWx5c2lzLicpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLnJhdGVBbmFseXNpc1JlcG9zaXRvcnkuY3JlYXRlKHJhdGVBbmFseXNpcywgKGVycm9yOiBhbnksIHJlc3VsdDogUmF0ZUFuYWx5c2lzKSA9PiB7XHJcbiAgICAgICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKCdzYXZlUmF0ZUFuYWx5c2lzIGZhaWxlZCA9PiAnICsgZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgICBsb2dnZXIuaW5mbygnU2F2ZWQgUmF0ZUFuYWx5c2lzLicpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0Q29zdENvbnRyb2xSYXRlQW5hbHlzaXMocXVlcnk6IGFueSwgcHJvamVjdGlvbjogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJhdGVBbmFseXNpczogUmF0ZUFuYWx5c2lzKSA9PiB2b2lkKSB7XHJcbiAgICB0aGlzLnJhdGVBbmFseXNpc1JlcG9zaXRvcnkucmV0cmlldmVXaXRoUHJvamVjdGlvbihxdWVyeSwgcHJvamVjdGlvbiwoZXJyb3I6IGFueSwgcmF0ZUFuYWx5c2lzQXJyYXk6IEFycmF5PFJhdGVBbmFseXNpcz4pID0+IHtcclxuICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYocmF0ZUFuYWx5c2lzQXJyYXkubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICBsb2dnZXIuZXJyb3IoJ0NvbnRDb250cm9sIFJhdGVBbmFseXNpcyBub3QgZm91bmQuJyk7XHJcbiAgICAgICAgICBjYWxsYmFjaygnQ29udENvbnRyb2wgUmF0ZUFuYWx5c2lzIG5vdCBmb3VuZC4nLCBudWxsKTtcclxuICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICBjYWxsYmFjayhudWxsLCByYXRlQW5hbHlzaXNBcnJheVswXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldEFnZ3JlZ2F0ZURhdGEocXVlcnk6IGFueSwgY2FsbGJhY2s6KGVycm9yOmFueSwgYWdncmVnYXRlRGF0YTogYW55KSA9PnZvaWQpIHtcclxuICAgIHRoaXMucmF0ZUFuYWx5c2lzUmVwb3NpdG9yeS5hZ2dyZWdhdGUocXVlcnksY2FsbGJhY2spO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbk9iamVjdC5zZWFsKFJhdGVBbmFseXNpc1NlcnZpY2UpO1xyXG5leHBvcnQgPSBSYXRlQW5hbHlzaXNTZXJ2aWNlO1xyXG4iXX0=
