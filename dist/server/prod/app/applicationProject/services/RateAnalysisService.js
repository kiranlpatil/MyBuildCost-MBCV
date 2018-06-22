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
            var workItemsRateAnalysisSQL = 'SELECT workItem.C2 AS rateAnalysisId, workItem.C3 AS name' +
                ' FROM ? AS workItem where workItem.C4 = ' + categoriesByCostHead[categoryIndex].rateAnalysisId;
            var workItemsByCategory = alasql(workItemsRateAnalysisSQL, [workItemsRateAnalysis]);
            var buildingWorkItems = new Array();
            this.getWorkItemsFromRateAnalysis(workItemsByCategory, rateItemsRateAnalysis, unitsRateAnalysis, notesRateAnalysis, buildingWorkItems, configWorkItems);
            category.workItems = buildingWorkItems;
            buildingCategories.push(category);
        }
        if (configCategories.length > 0) {
            for (var configCategoryIndex = 0; configCategoryIndex < configCategories.length; configCategoryIndex++) {
                var isCategoryExistsSQL = 'SELECT * FROM ? AS workitems WHERE TRIM(workitems.name)= ?';
                var categoryExistsArray = alasql(isCategoryExistsSQL, [categoriesByCostHead, configCategories[configCategoryIndex].name]);
                if (categoryExistsArray.length === 0) {
                    var configCat = new Category(configCategories[configCategoryIndex].name, configCategories[configCategoryIndex].rateAnalysisId);
                    configCat.workItems = this.getWorkitemsForConfigCategory(configCategories[configCategoryIndex].workItems);
                    buildingCategories.push(configCat);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHBsaWNhdGlvblByb2plY3Qvc2VydmljZXMvUmF0ZUFuYWx5c2lzU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsb0VBQXVFO0FBQ3ZFLGtFQUFxRTtBQUVyRSw4RUFBaUY7QUFDakYsMEVBQTZFO0FBQzdFLHdFQUEyRTtBQUMzRSwrQkFBa0M7QUFDbEMsZ0VBQW1FO0FBQ25FLHdFQUEyRTtBQUMzRSx3RUFBMkU7QUFHM0UsK0NBQWtEO0FBQ2xELHdGQUEyRjtBQUMzRiw0RUFBK0U7QUFHL0UsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2pDLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDL0IsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBRXZELElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0FBRXREO0lBT0U7UUFDRSxJQUFJLENBQUMsUUFBUSxHQUFHLFlBQVksQ0FBQyxRQUFRLENBQUM7UUFDdEMsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLGVBQWUsRUFBRSxDQUFDO1FBQzdDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxXQUFXLEVBQUUsQ0FBQztRQUNyQyxJQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxzQkFBc0IsRUFBRSxDQUFDO0lBQzdELENBQUM7SUFFRCwwQ0FBWSxHQUFaLFVBQWEsR0FBVyxFQUFFLElBQVUsRUFBRSxRQUEyQztRQUMvRSxNQUFNLENBQUMsSUFBSSxDQUFDLGtEQUFrRCxDQUFDLENBQUM7UUFDaEUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUMsRUFBRSxVQUFVLEtBQVUsRUFBRSxRQUFhLEVBQUUsSUFBUztZQUNwRSxFQUFF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YXBwbGljYXRpb25Qcm9qZWN0L3NlcnZpY2VzL1JhdGVBbmFseXNpc1NlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVXNlclNlcnZpY2UgPSByZXF1aXJlKCcuLy4uLy4uL2ZyYW1ld29yay9zZXJ2aWNlcy9Vc2VyU2VydmljZScpO1xyXG5pbXBvcnQgUHJvamVjdEFzc2V0ID0gcmVxdWlyZSgnLi4vLi4vZnJhbWV3b3JrL3NoYXJlZC9wcm9qZWN0YXNzZXQnKTtcclxuaW1wb3J0IFVzZXIgPSByZXF1aXJlKCcuLi8uLi9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9tb25nb29zZS91c2VyJyk7XHJcbmltcG9ydCBBdXRoSW50ZXJjZXB0b3IgPSByZXF1aXJlKCcuLi8uLi9mcmFtZXdvcmsvaW50ZXJjZXB0b3IvYXV0aC5pbnRlcmNlcHRvcicpO1xyXG5pbXBvcnQgQ29zdENvbnRyb2xsRXhjZXB0aW9uID0gcmVxdWlyZSgnLi4vZXhjZXB0aW9uL0Nvc3RDb250cm9sbEV4Y2VwdGlvbicpO1xyXG5pbXBvcnQgV29ya0l0ZW0gPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3Byb2plY3QvYnVpbGRpbmcvV29ya0l0ZW0nKTtcclxuaW1wb3J0IGFsYXNxbCA9IHJlcXVpcmUoJ2FsYXNxbCcpO1xyXG5pbXBvcnQgUmF0ZSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9idWlsZGluZy9SYXRlJyk7XHJcbmltcG9ydCBDb3N0SGVhZCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9idWlsZGluZy9Db3N0SGVhZCcpO1xyXG5pbXBvcnQgQ2F0ZWdvcnkgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3Byb2plY3QvYnVpbGRpbmcvQ2F0ZWdvcnknKTtcclxuaW1wb3J0IFF1YW50aXR5ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L2J1aWxkaW5nL1F1YW50aXR5Jyk7XHJcblxyXG5pbXBvcnQgQ29uc3RhbnRzID0gcmVxdWlyZSgnLi4vc2hhcmVkL2NvbnN0YW50cycpO1xyXG5pbXBvcnQgUmF0ZUFuYWx5c2lzUmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9SYXRlQW5hbHlzaXNSZXBvc2l0b3J5Jyk7XHJcbmltcG9ydCBSYXRlQW5hbHlzaXMgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL1JhdGVBbmFseXNpcy9SYXRlQW5hbHlzaXMnKTtcclxuaW1wb3J0IHsgQXR0YWNobWVudERldGFpbHNNb2RlbCB9IGZyb20gJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9idWlsZGluZy9BdHRhY2htZW50RGV0YWlscyc7XHJcblxyXG5sZXQgcmVxdWVzdCA9IHJlcXVpcmUoJ3JlcXVlc3QnKTtcclxubGV0IGNvbmZpZyA9IHJlcXVpcmUoJ2NvbmZpZycpO1xyXG52YXIgbG9nNGpzID0gcmVxdWlyZSgnbG9nNGpzJyk7XHJcbnZhciBsb2dnZXIgPSBsb2c0anMuZ2V0TG9nZ2VyKCdSYXRlIEFuYWx5c2lzIFNlcnZpY2UnKTtcclxuXHJcbmxldCBDQ1Byb21pc2UgPSByZXF1aXJlKCdwcm9taXNlL2xpYi9lczYtZXh0ZW5zaW9ucycpO1xyXG5cclxuY2xhc3MgUmF0ZUFuYWx5c2lzU2VydmljZSB7XHJcbiAgQVBQX05BTUU6IHN0cmluZztcclxuICBjb21wYW55X25hbWU6IHN0cmluZztcclxuICBwcml2YXRlIGF1dGhJbnRlcmNlcHRvcjogQXV0aEludGVyY2VwdG9yO1xyXG4gIHByaXZhdGUgdXNlclNlcnZpY2U6IFVzZXJTZXJ2aWNlO1xyXG4gIHByaXZhdGUgcmF0ZUFuYWx5c2lzUmVwb3NpdG9yeTogUmF0ZUFuYWx5c2lzUmVwb3NpdG9yeTtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLkFQUF9OQU1FID0gUHJvamVjdEFzc2V0LkFQUF9OQU1FO1xyXG4gICAgdGhpcy5hdXRoSW50ZXJjZXB0b3IgPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XHJcbiAgICB0aGlzLnVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICB0aGlzLnJhdGVBbmFseXNpc1JlcG9zaXRvcnkgPSBuZXcgUmF0ZUFuYWx5c2lzUmVwb3NpdG9yeSgpO1xyXG4gIH1cclxuXHJcbiAgZ2V0Q29zdEhlYWRzKHVybDogc3RyaW5nLCB1c2VyOiBVc2VyLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUmF0ZSBBbmFseXNpcyBTZXJ2aWNlLCBnZXRDb3N0SGVhZHMgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICByZXF1ZXN0LmdldCh7dXJsOiB1cmx9LCBmdW5jdGlvbiAoZXJyb3I6IGFueSwgcmVzcG9uc2U6IGFueSwgYm9keTogYW55KSB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIGlmICghZXJyb3IgJiYgcmVzcG9uc2UpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnUkVTUE9OU0UgSlNPTiA6ICcgKyBKU09OLnN0cmluZ2lmeShKU09OLnBhcnNlKGJvZHkpKSk7XHJcbiAgICAgICAgbGV0IHJlcyA9IEpTT04ucGFyc2UoYm9keSk7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRXb3JrSXRlbXModXJsOiBzdHJpbmcsIHVzZXI6IFVzZXIsIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdSYXRlIEFuYWx5c2lzIFNlcnZpY2UsIGdldFdvcmtJdGVtcyBoYXMgYmVlbiBoaXQnKTtcclxuICAgIHJlcXVlc3QuZ2V0KHt1cmw6IHVybH0sIGZ1bmN0aW9uIChlcnJvcjogYW55LCByZXNwb25zZTogYW55LCBib2R5OiBhbnkpIHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2UgaWYgKCFlcnJvciAmJiByZXNwb25zZSkge1xyXG4gICAgICAgIGxldCByZXMgPSBKU09OLnBhcnNlKGJvZHkpO1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHJlcyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0V29ya0l0ZW1zQnlDb3N0SGVhZElkKHVybDogc3RyaW5nLCBjb3N0SGVhZElkOiBzdHJpbmcsIHVzZXI6IFVzZXIsIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdSYXRlIEFuYWx5c2lzIFNlcnZpY2UsIGdldFdvcmtJdGVtc0J5Q29zdEhlYWRJZCBoYXMgYmVlbiBoaXQnKTtcclxuICAgIGxldCB3b3JrSXRlbXM6IEFycmF5PFdvcmtJdGVtPiA9IFtdO1xyXG4gICAgcmVxdWVzdC5nZXQoe3VybDogdXJsfSwgZnVuY3Rpb24gKGVycm9yOiBhbnksIHJlc3BvbnNlOiBhbnksIGJvZHk6IGFueSkge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSBpZiAoIWVycm9yICYmIHJlc3BvbnNlKSB7XHJcbiAgICAgICAgbGV0IHJlcyA9IEpTT04ucGFyc2UoYm9keSk7XHJcbiAgICAgICAgaWYgKHJlcykge1xyXG5cclxuICAgICAgICAgIGZvciAobGV0IHdvcmtpdGVtIG9mIHJlcy5TdWJJdGVtVHlwZSkge1xyXG4gICAgICAgICAgICBpZiAocGFyc2VJbnQoY29zdEhlYWRJZCkgPT09IHdvcmtpdGVtLkMzKSB7XHJcbiAgICAgICAgICAgICAgbGV0IHdvcmtpdGVtRGV0YWlscyA9IG5ldyBXb3JrSXRlbSh3b3JraXRlbS5DMiwgd29ya2l0ZW0uQzEpO1xyXG4gICAgICAgICAgICAgIHdvcmtJdGVtcy5wdXNoKHdvcmtpdGVtRGV0YWlscyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgd29ya0l0ZW1zKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRBcGlDYWxsKHVybDogc3RyaW5nLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3BvbnNlOiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdnZXRBcGlDYWxsIGZvciByYXRlQW5hbHlzaXMgaGFzIGJlZSBoaXQgZm9yIHVybCA6ICcgKyB1cmwpO1xyXG4gICAgICByZXF1ZXN0LmdldCh7dXJsOiB1cmx9LCBmdW5jdGlvbiAoZXJyb3I6IGFueSwgcmVzcG9uc2U6IGFueSwgYm9keTogYW55KSB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICBjYWxsYmFjayhuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGVycm9yLm1lc3NhZ2UsIGVycm9yLnN0YWNrKSwgbnVsbCk7XHJcbiAgICAgICAgfSBlbHNlIGlmICghZXJyb3IgJiYgcmVzcG9uc2UpIHtcclxuICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGxldCByZXMgPSBKU09OLnBhcnNlKGJvZHkpO1xyXG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCByZXMpO1xyXG4gICAgICAgICAgfWNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgbG9nZ2VyLmVycm9yKCdQcm9taXNlIGZhaWxlZCBmb3IgaW5kaXZpZHVhbCAhIHVybDonICsgdXJsICsgJzpcXG4gZXJyb3IgOicgKyBKU09OLnN0cmluZ2lmeShlcnIubWVzc2FnZSkpO1xyXG5cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0UmF0ZSh3b3JrSXRlbUlkOiBudW1iZXIsIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgZGF0YTogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBsZXQgdXJsID0gY29uZmlnLmdldCgncmF0ZUFuYWx5c2lzQVBJLnVuaXQnKTtcclxuICAgIHRoaXMuZ2V0QXBpQ2FsbCh1cmwsIChlcnJvciwgdW5pdERhdGEpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHVuaXREYXRhID0gdW5pdERhdGFbJ1VPTSddO1xyXG4gICAgICAgIHVybCA9IGNvbmZpZy5nZXQoJ3JhdGVBbmFseXNpc0FQSS5yYXRlJyk7XHJcbiAgICAgICAgdGhpcy5nZXRBcGlDYWxsKHVybCwgKGVycm9yLCBkYXRhKSA9PiB7XHJcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IHJhdGUgPSBkYXRhWydSYXRlQW5hbHlzaXNEYXRhJ107XHJcbiAgICAgICAgICAgIGxldCBzcWwgPSAnU0VMRUNUIHJhdGUuQzUgQVMgcXVhbnRpdHksIHVuaXQuQzIgQXMgdW5pdCBGUk9NID8gQVMgcmF0ZSBKT0lOID8gQVMgdW5pdCBvbiB1bml0LkMxID0gIHJhdGUuQzggYW5kJyArXHJcbiAgICAgICAgICAgICAgJyByYXRlLkMxID0gJyArIHdvcmtJdGVtSWQ7XHJcbiAgICAgICAgICAgIGxldCBzcWwyID0gJ1NFTEVDVCByYXRlLkMxIEFTIHJhdGVBbmFseXNpc0lkLCByYXRlLkMyIEFTIGl0ZW1OYW1lLFJPVU5EKHJhdGUuQzcsMikgQVMgcXVhbnRpdHksUk9VTkQocmF0ZS5DMywyKSBBUyByYXRlLCcgK1xyXG4gICAgICAgICAgICAgICcgUk9VTkQocmF0ZS5DMypyYXRlLkM3LDIpIEFTIHRvdGFsQW1vdW50LCByYXRlLkM2IHR5cGUsIHVuaXQuQzIgQXMgdW5pdCBGUk9NID8gQVMgcmF0ZSBKT0lOID8gQVMgdW5pdCBPTiB1bml0LkMxID0gcmF0ZS5DOScgK1xyXG4gICAgICAgICAgICAgICcgIFdIRVJFIHJhdGUuQzEgPSAnICsgd29ya0l0ZW1JZDtcclxuICAgICAgICAgICAgbGV0IHNxbDMgPSAnU0VMRUNUIFJPVU5EKFNVTShyYXRlLkMzKnJhdGUuQzcpIC8gU1VNKHJhdGUuQzcpLDIpIEFTIHRvdGFsICBGUk9NID8gQVMgcmF0ZSBKT0lOID8gQVMgdW5pdCBPTiB1bml0LkMxID0gcmF0ZS5DOScgK1xyXG4gICAgICAgICAgICAgICcgIFdIRVJFIHJhdGUuQzEgPSAnICsgd29ya0l0ZW1JZDtcclxuICAgICAgICAgICAgbGV0IHF1YW50aXR5QW5kVW5pdCA9IGFsYXNxbChzcWwsIFtyYXRlLCB1bml0RGF0YV0pO1xyXG4gICAgICAgICAgICBsZXQgcmF0ZVJlc3VsdDogUmF0ZSA9IG5ldyBSYXRlKCk7XHJcbiAgICAgICAgICAgIGxldCB0b3RhbHJhdGVGcm9tUmF0ZUFuYWx5c2lzID0gYWxhc3FsKHNxbDMsIFtyYXRlLCB1bml0RGF0YV0pO1xyXG4gICAgICAgICAgICByYXRlUmVzdWx0LnF1YW50aXR5ID0gcXVhbnRpdHlBbmRVbml0WzBdLnF1YW50aXR5O1xyXG4gICAgICAgICAgICByYXRlUmVzdWx0LnVuaXQgPSBxdWFudGl0eUFuZFVuaXRbMF0udW5pdDtcclxuICAgICAgICAgICAgcmF0ZVJlc3VsdC5yYXRlRnJvbVJhdGVBbmFseXNpcyA9IHBhcnNlRmxvYXQoKHRvdGFscmF0ZUZyb21SYXRlQW5hbHlzaXNbMF0udG90YWwpLnRvRml4ZWQoMikpO1xyXG4gICAgICAgICAgICByYXRlID0gYWxhc3FsKHNxbDIsIFtyYXRlLCB1bml0RGF0YV0pO1xyXG4gICAgICAgICAgICByYXRlUmVzdWx0LnJhdGVJdGVtcyA9IHJhdGU7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJhdGVSZXN1bHQpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvL1RPRE8gOiBEZWxldGUgQVBJJ3MgcmVsYXRlZCB0byB3b3JraXRlbXMgYWRkLCBkZWxlZXQsIGdldCBsaXN0LlxyXG4gIGdldFdvcmtpdGVtTGlzdChjb3N0SGVhZElkOiBudW1iZXIsIGNhdGVnb3J5SWQ6IG51bWJlciwgY2FsbGJhY2s6IChlcnJvcjogYW55LCBkYXRhOiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxldCB1cmwgPSBjb25maWcuZ2V0KCdyYXRlQW5hbHlzaXNBUEkud29ya2l0ZW0nKTtcclxuICAgIHRoaXMuZ2V0QXBpQ2FsbCh1cmwsIChlcnJvciwgd29ya2l0ZW0pID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCBzcWw6IHN0cmluZyA9ICdTRUxFQ1QgQzIgQVMgcmF0ZUFuYWx5c2lzSWQsIEMzIEFTIG5hbWUgRlJPTSA/IFdIRVJFIEMxID0gJyArIGNvc3RIZWFkSWQgKyAnIGFuZCBDNCA9ICcgKyBjYXRlZ29yeUlkO1xyXG4gICAgICAgIGlmIChjYXRlZ29yeUlkID09PSAwKSB7XHJcbiAgICAgICAgICBzcWwgPSAnU0VMRUNUIEMyIEFTIHJhdGVBbmFseXNpc0lkLCBDMyBBUyBuYW1lIEZST00gPyBXSEVSRSBDMSA9ICcgKyBjb3N0SGVhZElkO1xyXG4gICAgICAgIH1cclxuICAgICAgICB3b3JraXRlbSA9IHdvcmtpdGVtWydJdGVtcyddO1xyXG4gICAgICAgIGxldCB3b3JraXRlbUxpc3QgPSBhbGFzcWwoc3FsLCBbd29ya2l0ZW1dKTtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCB3b3JraXRlbUxpc3QpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGNvbnZlcnRDb3N0SGVhZHNGcm9tUmF0ZUFuYWx5c2lzVG9Db3N0Q29udHJvbChlbnRpdHk6IHN0cmluZywgY2FsbGJhY2s6IChlcnJvcjogYW55LCBkYXRhOiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdjb252ZXJ0Q29zdEhlYWRzRnJvbVJhdGVBbmFseXNpc1RvQ29zdENvbnRyb2wgaGFzIGJlZW4gaGl0Jyk7XHJcblxyXG4gICAgbGV0IGNvc3RIZWFkVVJMID0gY29uZmlnLmdldChDb25zdGFudHMuUkFURV9BTkFMWVNJU19BUEkgKyBlbnRpdHkgKyBDb25zdGFudHMuUkFURV9BTkFMWVNJU19DT1NUSEVBRFMpO1xyXG4gICAgbGV0IGNvc3RIZWFkUmF0ZUFuYWx5c2lzUHJvbWlzZSA9IHRoaXMuY3JlYXRlUHJvbWlzZShjb3N0SGVhZFVSTCk7XHJcbiAgICBsb2dnZXIuaW5mbygnY29zdEhlYWRSYXRlQW5hbHlzaXNQcm9taXNlIGZvciBoYXMgYmVlbiBoaXQnKTtcclxuXHJcbiAgICBsZXQgY2F0ZWdvcnlVUkwgPSBjb25maWcuZ2V0KENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0FQSSArIGVudGl0eSArIENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0NBVEVHT1JJRVMpO1xyXG4gICAgbGV0IGNhdGVnb3J5UmF0ZUFuYWx5c2lzUHJvbWlzZSA9IHRoaXMuY3JlYXRlUHJvbWlzZShjYXRlZ29yeVVSTCk7XHJcbiAgICBsb2dnZXIuaW5mbygnY2F0ZWdvcnlSYXRlQW5hbHlzaXNQcm9taXNlIGZvciBoYXMgYmVlbiBoaXQnKTtcclxuXHJcbiAgICBsZXQgd29ya0l0ZW1VUkwgPSBjb25maWcuZ2V0KENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0FQSSArIGVudGl0eSArIENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX1dPUktJVEVNUyk7XHJcbiAgICBsZXQgd29ya0l0ZW1SYXRlQW5hbHlzaXNQcm9taXNlID0gdGhpcy5jcmVhdGVQcm9taXNlKHdvcmtJdGVtVVJMKTtcclxuICAgIGxvZ2dlci5pbmZvKCd3b3JrSXRlbVJhdGVBbmFseXNpc1Byb21pc2UgZm9yIGhhcyBiZWVuIGhpdCcpO1xyXG5cclxuICAgIGxldCByYXRlSXRlbVVSTCA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfQVBJICsgZW50aXR5ICsgQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfUkFURSk7XHJcbiAgICBsZXQgcmF0ZUl0ZW1SYXRlQW5hbHlzaXNQcm9taXNlID0gdGhpcy5jcmVhdGVQcm9taXNlKHJhdGVJdGVtVVJMKTtcclxuICAgIGxvZ2dlci5pbmZvKCdyYXRlSXRlbVJhdGVBbmFseXNpc1Byb21pc2UgZm9yIGhhcyBiZWVuIGhpdCcpO1xyXG5cclxuICAgIGxldCByYXRlQW5hbHlzaXNOb3Rlc1VSTCA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfQVBJICsgZW50aXR5ICsgQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfTk9URVMpO1xyXG4gICAgbGV0IG5vdGVzUmF0ZUFuYWx5c2lzUHJvbWlzZSA9IHRoaXMuY3JlYXRlUHJvbWlzZShyYXRlQW5hbHlzaXNOb3Rlc1VSTCk7XHJcbiAgICBsb2dnZXIuaW5mbygnbm90ZXNSYXRlQW5hbHlzaXNQcm9taXNlIGZvciBoYXMgYmVlbiBoaXQnKTtcclxuXHJcbiAgICBsZXQgYWxsVW5pdHNGcm9tUmF0ZUFuYWx5c2lzVVJMID0gY29uZmlnLmdldChDb25zdGFudHMuUkFURV9BTkFMWVNJU19BUEkgKyBlbnRpdHkgKyBDb25zdGFudHMuUkFURV9BTkFMWVNJU19VTklUKTtcclxuICAgIGxldCB1bml0c1JhdGVBbmFseXNpc1Byb21pc2UgPSB0aGlzLmNyZWF0ZVByb21pc2UoYWxsVW5pdHNGcm9tUmF0ZUFuYWx5c2lzVVJMKTtcclxuICAgIGxvZ2dlci5pbmZvKCd1bml0c1JhdGVBbmFseXNpc1Byb21pc2UgZm9yIGhhcyBiZWVuIGhpdCcpO1xyXG5cclxuICAgIGxvZ2dlci5pbmZvKCdjYWxsaW5nIFByb21pc2UuYWxsJyk7XHJcbiAgICBDQ1Byb21pc2UuYWxsKFtcclxuICAgICAgY29zdEhlYWRSYXRlQW5hbHlzaXNQcm9taXNlLFxyXG4gICAgICBjYXRlZ29yeVJhdGVBbmFseXNpc1Byb21pc2UsXHJcbiAgICAgIHdvcmtJdGVtUmF0ZUFuYWx5c2lzUHJvbWlzZSxcclxuICAgICAgcmF0ZUl0ZW1SYXRlQW5hbHlzaXNQcm9taXNlLFxyXG4gICAgICBub3Rlc1JhdGVBbmFseXNpc1Byb21pc2UsXHJcbiAgICAgIHVuaXRzUmF0ZUFuYWx5c2lzUHJvbWlzZVxyXG4gICAgXSkudGhlbihmdW5jdGlvbiAoZGF0YTogQXJyYXk8YW55Pikge1xyXG4gICAgICBsb2dnZXIuaW5mbygnY29udmVydENvc3RIZWFkc0Zyb21SYXRlQW5hbHlzaXNUb0Nvc3RDb250cm9sIFByb21pc2UuYWxsIEFQSSBpcyBzdWNjZXNzLicpO1xyXG4gICAgICBsZXQgY29zdEhlYWRzUmF0ZUFuYWx5c2lzID0gZGF0YVswXVtDb25zdGFudHMuUkFURV9BTkFMWVNJU19JVEVNX1RZUEVdO1xyXG4gICAgICBsZXQgY2F0ZWdvcmllc1JhdGVBbmFseXNpcyA9IGRhdGFbMV1bQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfU1VCSVRFTV9UWVBFXTtcclxuICAgICAgbGV0IHdvcmtJdGVtc1JhdGVBbmFseXNpcyA9IGRhdGFbMl1bQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfSVRFTVNdO1xyXG4gICAgICBsZXQgcmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzID0gZGF0YVszXVtDb25zdGFudHMuUkFURV9BTkFMWVNJU19EQVRBXTtcclxuICAgICAgbGV0IG5vdGVzUmF0ZUFuYWx5c2lzID0gZGF0YVs0XVtDb25zdGFudHMuUkFURV9BTkFMWVNJU19EQVRBXTtcclxuICAgICAgbGV0IHVuaXRzUmF0ZUFuYWx5c2lzID0gZGF0YVs1XVtDb25zdGFudHMuUkFURV9BTkFMWVNJU19VT01dO1xyXG5cclxuICAgICAgbGV0IGJ1aWxkaW5nQ29zdEhlYWRzOiBBcnJheTxDb3N0SGVhZD4gPSBbXTtcclxuICAgICAgbGV0IHJhdGVBbmFseXNpc1NlcnZpY2UgPSBuZXcgUmF0ZUFuYWx5c2lzU2VydmljZSgpO1xyXG5cclxuICAgICAgcmF0ZUFuYWx5c2lzU2VydmljZS5nZXRDb3N0SGVhZHNGcm9tUmF0ZUFuYWx5c2lzKGNvc3RIZWFkc1JhdGVBbmFseXNpcywgY2F0ZWdvcmllc1JhdGVBbmFseXNpcywgd29ya0l0ZW1zUmF0ZUFuYWx5c2lzLFxyXG4gICAgICAgIHJhdGVJdGVtc1JhdGVBbmFseXNpcywgdW5pdHNSYXRlQW5hbHlzaXMsIG5vdGVzUmF0ZUFuYWx5c2lzLCBidWlsZGluZ0Nvc3RIZWFkcyk7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdzdWNjZXNzIGluICBjb252ZXJ0Q29zdEhlYWRzRnJvbVJhdGVBbmFseXNpc1RvQ29zdENvbnRyb2wuJyk7XHJcbiAgICAgIGNhbGxiYWNrKG51bGwsIHtcclxuICAgICAgICAnYnVpbGRpbmdDb3N0SGVhZHMnOiBidWlsZGluZ0Nvc3RIZWFkcyxcclxuICAgICAgICAncmF0ZXMnOiByYXRlSXRlbXNSYXRlQW5hbHlzaXMsXHJcbiAgICAgICAgJ3VuaXRzJzogdW5pdHNSYXRlQW5hbHlzaXNcclxuICAgICAgfSk7XHJcbiAgICB9KS5jYXRjaChmdW5jdGlvbiAoZTogYW55KSB7XHJcbiAgICAgIGxvZ2dlci5lcnJvcignIFByb21pc2UgZmFpbGVkIGZvciBjb252ZXJ0Q29zdEhlYWRzRnJvbVJhdGVBbmFseXNpc1RvQ29zdENvbnRyb2wgISA6JyArIEpTT04uc3RyaW5naWZ5KGUubWVzc2FnZSkpO1xyXG4gICAgICBDQ1Byb21pc2UucmVqZWN0KGUubWVzc2FnZSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGNyZWF0ZVByb21pc2UodXJsOiBzdHJpbmcpIHtcclxuICAgIHJldHVybiBuZXcgQ0NQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlOiBhbnksIHJlamVjdDogYW55KSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdjcmVhdGVQcm9taXNlIGhhcyBiZWVuIGhpdCBmb3IgOiAnICsgdXJsKTtcclxuICAgICAgbGV0IHJhdGVBbmFseXNpc1NlcnZpY2UgPSBuZXcgUmF0ZUFuYWx5c2lzU2VydmljZSgpO1xyXG4gICAgICByYXRlQW5hbHlzaXNTZXJ2aWNlLmdldEFwaUNhbGwodXJsLCAoZXJyb3I6IGFueSwgZGF0YTogYW55KSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnRXJyb3IgaW4gY3JlYXRlUHJvbWlzZSBnZXQgZGF0YSBmcm9tIHJhdGUgYW5hbHlzaXM6ICcgKyBKU09OLnN0cmluZ2lmeShlcnJvcikpO1xyXG4gICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ2NyZWF0ZVByb21pc2UgZGF0YSBmcm9tIHJhdGUgYW5hbHlzaXMgc3VjY2Vzcy4nKTtcclxuICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlOiBhbnkpIHtcclxuICAgICAgbG9nZ2VyLmVycm9yKCdQcm9taXNlIGZhaWxlZCBmb3IgaW5kaXZpZHVhbCAhIHVybDonICsgdXJsICsgJzpcXG4gZXJyb3IgOicgKyBKU09OLnN0cmluZ2lmeShlLm1lc3NhZ2UpKTtcclxuICAgICAgQ0NQcm9taXNlLnJlamVjdChlLm1lc3NhZ2UpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRDb3N0SGVhZHNGcm9tUmF0ZUFuYWx5c2lzKGNvc3RIZWFkc1JhdGVBbmFseXNpczogYW55LCBjYXRlZ29yaWVzUmF0ZUFuYWx5c2lzOiBhbnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3b3JrSXRlbXNSYXRlQW5hbHlzaXM6IGFueSwgcmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzOiBhbnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0c1JhdGVBbmFseXNpczogYW55LCBub3Rlc1JhdGVBbmFseXNpczogYW55LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVpbGRpbmdDb3N0SGVhZHM6IEFycmF5PENvc3RIZWFkPikge1xyXG4gICAgbG9nZ2VyLmluZm8oJ2dldENvc3RIZWFkc0Zyb21SYXRlQW5hbHlzaXMgaGFzIGJlZW4gaGl0LicpO1xyXG4gICAgLy9sZXQgYnVkZ2V0Q29zdEhlYWRzID0gY29uZmlnLmdldCgnYnVkZ2V0ZWRDb3N0Rm9ybXVsYWUnKTtcclxuICAgIGZvciAobGV0IGNvc3RIZWFkSW5kZXggPSAwOyBjb3N0SGVhZEluZGV4IDwgY29zdEhlYWRzUmF0ZUFuYWx5c2lzLmxlbmd0aDsgY29zdEhlYWRJbmRleCsrKSB7XHJcblxyXG4gICAgaWYoY29uZmlnLmhhcygnYnVkZ2V0ZWRDb3N0Rm9ybXVsYWUuJysgY29zdEhlYWRzUmF0ZUFuYWx5c2lzW2Nvc3RIZWFkSW5kZXhdLkMyKSkge1xyXG4gICAgICBsZXQgY29zdEhlYWQgPSBuZXcgQ29zdEhlYWQoKTtcclxuICAgICAgY29zdEhlYWQubmFtZSA9IGNvc3RIZWFkc1JhdGVBbmFseXNpc1tjb3N0SGVhZEluZGV4XS5DMjtcclxuICAgICAgbGV0IGNvbmZpZ0Nvc3RIZWFkcyA9IGNvbmZpZy5nZXQoJ2NvbmZpZ0Nvc3RIZWFkcycpO1xyXG4gICAgICBsZXQgY2F0ZWdvcmllcyA9IG5ldyBBcnJheTxDYXRlZ29yeT4oKTtcclxuXHJcbiAgICAgICAgaWYgKGNvbmZpZ0Nvc3RIZWFkcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICBsZXQgaXNDb3N0SGVhZEV4aXN0U1FMID0gJ1NFTEVDVCAqIEZST00gPyBBUyB3b3JraXRlbXMgV0hFUkUgVFJJTSh3b3JraXRlbXMubmFtZSk9ID8nO1xyXG4gICAgICAgICAgbGV0IGNvc3RIZWFkRXhpc3RBcnJheSA9IGFsYXNxbChpc0Nvc3RIZWFkRXhpc3RTUUwsW2NvbmZpZ0Nvc3RIZWFkcywgY29zdEhlYWQubmFtZV0pO1xyXG4gICAgICAgICAgaWYoY29zdEhlYWRFeGlzdEFycmF5Lmxlbmd0aCAhPT0gMCApIHtcclxuICAgICAgICAgICAgY29zdEhlYWQucHJpb3JpdHlJZCA9IGNvc3RIZWFkRXhpc3RBcnJheVswXS5wcmlvcml0eUlkO1xyXG4gICAgICAgICAgICBjYXRlZ29yaWVzID0gY29zdEhlYWRFeGlzdEFycmF5WzBdLmNhdGVnb3JpZXM7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvc3RIZWFkLnJhdGVBbmFseXNpc0lkID0gY29zdEhlYWRzUmF0ZUFuYWx5c2lzW2Nvc3RIZWFkSW5kZXhdLkMxO1xyXG5cclxuICAgICAgICBsZXQgY2F0ZWdvcmllc1JhdGVBbmFseXNpc1NRTCA9ICdTRUxFQ1QgQ2F0ZWdvcnkuQzEgQVMgcmF0ZUFuYWx5c2lzSWQsIENhdGVnb3J5LkMyIEFTIG5hbWUnICtcclxuICAgICAgICAgICcgRlJPTSA/IEFTIENhdGVnb3J5IHdoZXJlIENhdGVnb3J5LkMzID0gJyArIGNvc3RIZWFkLnJhdGVBbmFseXNpc0lkO1xyXG5cclxuICAgICAgICBsZXQgY2F0ZWdvcmllc0J5Q29zdEhlYWQgPSBhbGFzcWwoY2F0ZWdvcmllc1JhdGVBbmFseXNpc1NRTCwgW2NhdGVnb3JpZXNSYXRlQW5hbHlzaXNdKTtcclxuICAgICAgICBsZXQgYnVpbGRpbmdDYXRlZ29yaWVzOiBBcnJheTxDYXRlZ29yeT4gPSBuZXcgQXJyYXk8Q2F0ZWdvcnk+KCk7XHJcblxyXG4gICAgICAgIGlmIChjYXRlZ29yaWVzQnlDb3N0SGVhZC5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgIHRoaXMuZ2V0V29ya0l0ZW1zV2l0aG91dENhdGVnb3J5RnJvbVJhdGVBbmFseXNpcyhjb3N0SGVhZC5yYXRlQW5hbHlzaXNJZCwgd29ya0l0ZW1zUmF0ZUFuYWx5c2lzLFxyXG4gICAgICAgICAgICByYXRlSXRlbXNSYXRlQW5hbHlzaXMsIHVuaXRzUmF0ZUFuYWx5c2lzLCBub3Rlc1JhdGVBbmFseXNpcywgYnVpbGRpbmdDYXRlZ29yaWVzLCBjYXRlZ29yaWVzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5nZXRDYXRlZ29yaWVzRnJvbVJhdGVBbmFseXNpcyhjYXRlZ29yaWVzQnlDb3N0SGVhZCwgd29ya0l0ZW1zUmF0ZUFuYWx5c2lzLFxyXG4gICAgICAgICAgICByYXRlSXRlbXNSYXRlQW5hbHlzaXMsIHVuaXRzUmF0ZUFuYWx5c2lzLCBub3Rlc1JhdGVBbmFseXNpcywgYnVpbGRpbmdDYXRlZ29yaWVzLCBjYXRlZ29yaWVzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvc3RIZWFkLmNhdGVnb3JpZXMgPSBidWlsZGluZ0NhdGVnb3JpZXM7XHJcbiAgICAgICAgY29zdEhlYWQudGh1bWJSdWxlUmF0ZSA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLlRIVU1CUlVMRV9SQVRFKTtcclxuICAgICAgICBidWlsZGluZ0Nvc3RIZWFkcy5wdXNoKGNvc3RIZWFkKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnQ29zdEhlYWQgVW5hdmFpYWxhYmVsIDogJytjb3N0SGVhZHNSYXRlQW5hbHlzaXNbY29zdEhlYWRJbmRleF0uQzIpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXRDYXRlZ29yaWVzRnJvbVJhdGVBbmFseXNpcyhjYXRlZ29yaWVzQnlDb3N0SGVhZDogYW55LCB3b3JrSXRlbXNSYXRlQW5hbHlzaXM6IGFueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByYXRlSXRlbXNSYXRlQW5hbHlzaXM6IGFueSwgdW5pdHNSYXRlQW5hbHlzaXM6IGFueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub3Rlc1JhdGVBbmFseXNpczogYW55LCBidWlsZGluZ0NhdGVnb3JpZXM6IEFycmF5PENhdGVnb3J5PiwgY29uZmlnQ2F0ZWdvcmllczogQXJyYXk8Q2F0ZWdvcnk+KSB7XHJcblxyXG4gICAgbG9nZ2VyLmluZm8oJ2dldENhdGVnb3JpZXNGcm9tUmF0ZUFuYWx5c2lzIGhhcyBiZWVuIGhpdC4nKTtcclxuXHJcbiAgICBmb3IgKGxldCBjYXRlZ29yeUluZGV4ID0gMDsgY2F0ZWdvcnlJbmRleCA8IGNhdGVnb3JpZXNCeUNvc3RIZWFkLmxlbmd0aDsgY2F0ZWdvcnlJbmRleCsrKSB7XHJcblxyXG4gICAgICBsZXQgY2F0ZWdvcnkgPSBuZXcgQ2F0ZWdvcnkoY2F0ZWdvcmllc0J5Q29zdEhlYWRbY2F0ZWdvcnlJbmRleF0ubmFtZSwgY2F0ZWdvcmllc0J5Q29zdEhlYWRbY2F0ZWdvcnlJbmRleF0ucmF0ZUFuYWx5c2lzSWQpO1xyXG4gICAgICBsZXQgY29uZmlnV29ya0l0ZW1zID0gbmV3IEFycmF5PFdvcmtJdGVtPigpO1xyXG5cclxuICAgICAgaWYgKGNvbmZpZ0NhdGVnb3JpZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGZvciAobGV0IGNvbmZpZ0NhdGVnb3J5IG9mIGNvbmZpZ0NhdGVnb3JpZXMpIHtcclxuICAgICAgICAgIGlmIChjb25maWdDYXRlZ29yeS5uYW1lID09PSBjYXRlZ29yaWVzQnlDb3N0SGVhZFtjYXRlZ29yeUluZGV4XS5uYW1lKSB7XHJcbiAgICAgICAgICAgIGNvbmZpZ1dvcmtJdGVtcyA9IGNvbmZpZ0NhdGVnb3J5LndvcmtJdGVtcztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCB3b3JrSXRlbXNSYXRlQW5hbHlzaXNTUUwgPSAnU0VMRUNUIHdvcmtJdGVtLkMyIEFTIHJhdGVBbmFseXNpc0lkLCB3b3JrSXRlbS5DMyBBUyBuYW1lJyArXHJcbiAgICAgICAgJyBGUk9NID8gQVMgd29ya0l0ZW0gd2hlcmUgd29ya0l0ZW0uQzQgPSAnICsgY2F0ZWdvcmllc0J5Q29zdEhlYWRbY2F0ZWdvcnlJbmRleF0ucmF0ZUFuYWx5c2lzSWQ7XHJcblxyXG4gICAgICBsZXQgd29ya0l0ZW1zQnlDYXRlZ29yeSA9IGFsYXNxbCh3b3JrSXRlbXNSYXRlQW5hbHlzaXNTUUwsIFt3b3JrSXRlbXNSYXRlQW5hbHlzaXNdKTtcclxuICAgICAgbGV0IGJ1aWxkaW5nV29ya0l0ZW1zOiBBcnJheTxXb3JrSXRlbT4gPSBuZXcgQXJyYXk8V29ya0l0ZW0+KCk7XHJcblxyXG4gICAgICB0aGlzLmdldFdvcmtJdGVtc0Zyb21SYXRlQW5hbHlzaXMod29ya0l0ZW1zQnlDYXRlZ29yeSwgcmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzLFxyXG4gICAgICAgIHVuaXRzUmF0ZUFuYWx5c2lzLCBub3Rlc1JhdGVBbmFseXNpcywgYnVpbGRpbmdXb3JrSXRlbXMsIGNvbmZpZ1dvcmtJdGVtcyk7XHJcblxyXG4gICAgICBjYXRlZ29yeS53b3JrSXRlbXMgPSBidWlsZGluZ1dvcmtJdGVtcztcclxuICAgICAgYnVpbGRpbmdDYXRlZ29yaWVzLnB1c2goY2F0ZWdvcnkpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKGNvbmZpZ0NhdGVnb3JpZXMubGVuZ3RoID4gMCkge1xyXG5cclxuICAgICAgZm9yKGxldCBjb25maWdDYXRlZ29yeUluZGV4PTA7IGNvbmZpZ0NhdGVnb3J5SW5kZXggPCBjb25maWdDYXRlZ29yaWVzLmxlbmd0aDsgY29uZmlnQ2F0ZWdvcnlJbmRleCsrKSB7XHJcbiAgICAgICAgbGV0IGlzQ2F0ZWdvcnlFeGlzdHNTUUwgPSAnU0VMRUNUICogRlJPTSA/IEFTIHdvcmtpdGVtcyBXSEVSRSBUUklNKHdvcmtpdGVtcy5uYW1lKT0gPyc7XHJcbiAgICAgICAgbGV0IGNhdGVnb3J5RXhpc3RzQXJyYXkgPSBhbGFzcWwoaXNDYXRlZ29yeUV4aXN0c1NRTCxbY2F0ZWdvcmllc0J5Q29zdEhlYWQsIGNvbmZpZ0NhdGVnb3JpZXNbY29uZmlnQ2F0ZWdvcnlJbmRleF0ubmFtZV0pO1xyXG4gICAgICAgIGlmKGNhdGVnb3J5RXhpc3RzQXJyYXkubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICBsZXQgY29uZmlnQ2F0ID0gbmV3IENhdGVnb3J5KGNvbmZpZ0NhdGVnb3JpZXNbY29uZmlnQ2F0ZWdvcnlJbmRleF0ubmFtZSwgY29uZmlnQ2F0ZWdvcmllc1tjb25maWdDYXRlZ29yeUluZGV4XS5yYXRlQW5hbHlzaXNJZCk7XHJcbiAgICAgICAgICBjb25maWdDYXQud29ya0l0ZW1zID0gdGhpcy5nZXRXb3JraXRlbXNGb3JDb25maWdDYXRlZ29yeShjb25maWdDYXRlZ29yaWVzW2NvbmZpZ0NhdGVnb3J5SW5kZXhdLndvcmtJdGVtcyk7XHJcbiAgICAgICAgICBidWlsZGluZ0NhdGVnb3JpZXMucHVzaChjb25maWdDYXQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0V29ya2l0ZW1zRm9yQ29uZmlnQ2F0ZWdvcnkoY29uZmlnV29ya2l0ZW1zOmFueSkge1xyXG4gICAgbGV0IHdvcmtJdGVtc0xpc3QgPSBuZXcgQXJyYXk8V29ya0l0ZW0+KCk7XHJcbiAgICBmb3IobGV0IHdvcmtpdGVtSW5kZXg9MDsgd29ya2l0ZW1JbmRleCA8IGNvbmZpZ1dvcmtpdGVtcy5sZW5ndGg7IHdvcmtpdGVtSW5kZXgrKykge1xyXG4gICAgICBsZXQgY29uZmlnV29ya2l0ZW0gPSB0aGlzLmNvbnZlcnRDb25maWdvcmtpdGVtKGNvbmZpZ1dvcmtpdGVtc1t3b3JraXRlbUluZGV4XSk7XHJcbiAgICAgIHdvcmtJdGVtc0xpc3QucHVzaChjb25maWdXb3JraXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gd29ya0l0ZW1zTGlzdDtcclxuICB9XHJcblxyXG4gIGdldFdvcmtJdGVtc1dpdGhvdXRDYXRlZ29yeUZyb21SYXRlQW5hbHlzaXMoY29zdEhlYWRSYXRlQW5hbHlzaXNJZDogbnVtYmVyLCB3b3JrSXRlbXNSYXRlQW5hbHlzaXM6IGFueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJhdGVJdGVtc1JhdGVBbmFseXNpczogYW55LCB1bml0c1JhdGVBbmFseXNpczogYW55LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm90ZXNSYXRlQW5hbHlzaXM6IGFueSwgYnVpbGRpbmdDYXRlZ29yaWVzOiBBcnJheTxDYXRlZ29yeT4sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWdDYXRlZ29yaWVzOiBBcnJheTxDYXRlZ29yeT4pIHtcclxuXHJcbiAgICBsb2dnZXIuaW5mbygnZ2V0V29ya0l0ZW1zV2l0aG91dENhdGVnb3J5RnJvbVJhdGVBbmFseXNpcyBoYXMgYmVlbiBoaXQuJyk7XHJcblxyXG4gICAgbGV0IHdvcmtJdGVtc1dpdGhvdXRDYXRlZ29yaWVzUmF0ZUFuYWx5c2lzU1FMID0gJ1NFTEVDVCB3b3JrSXRlbS5DMiBBUyByYXRlQW5hbHlzaXNJZCwgd29ya0l0ZW0uQzMgQVMgbmFtZScgK1xyXG4gICAgICAnIEZST00gPyBBUyB3b3JrSXRlbSB3aGVyZSBOT1Qgd29ya0l0ZW0uQzQgQU5EIHdvcmtJdGVtLkMxID0gJyArIGNvc3RIZWFkUmF0ZUFuYWx5c2lzSWQ7XHJcbiAgICBsZXQgd29ya0l0ZW1zV2l0aG91dENhdGVnb3JpZXMgPSBhbGFzcWwod29ya0l0ZW1zV2l0aG91dENhdGVnb3JpZXNSYXRlQW5hbHlzaXNTUUwsIFt3b3JrSXRlbXNSYXRlQW5hbHlzaXNdKTtcclxuXHJcbiAgICBsZXQgYnVpbGRpbmdXb3JrSXRlbXM6IEFycmF5PFdvcmtJdGVtPiA9IG5ldyBBcnJheTxXb3JrSXRlbT4oKTtcclxuICAgIGxldCBjYXRlZ29yeSA9IG5ldyBDYXRlZ29yeSgnV29yayBJdGVtcycsIDApO1xyXG4gICAgbGV0IGNvbmZpZ1dvcmtJdGVtcyA9IG5ldyBBcnJheTxXb3JrSXRlbT4oKTtcclxuXHJcbiAgICBpZiAoY29uZmlnQ2F0ZWdvcmllcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGZvciAobGV0IGNvbmZpZ0NhdGVnb3J5IG9mIGNvbmZpZ0NhdGVnb3JpZXMpIHtcclxuICAgICAgICBpZiAoY29uZmlnQ2F0ZWdvcnkubmFtZSA9PT0gJ1dvcmsgSXRlbXMnKSB7XHJcbiAgICAgICAgICBjb25maWdXb3JrSXRlbXMgPSBjb25maWdDYXRlZ29yeS53b3JrSXRlbXM7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5nZXRXb3JrSXRlbXNGcm9tUmF0ZUFuYWx5c2lzKHdvcmtJdGVtc1dpdGhvdXRDYXRlZ29yaWVzLCByYXRlSXRlbXNSYXRlQW5hbHlzaXMsXHJcbiAgICAgIHVuaXRzUmF0ZUFuYWx5c2lzLCBub3Rlc1JhdGVBbmFseXNpcywgYnVpbGRpbmdXb3JrSXRlbXMsIGNvbmZpZ1dvcmtJdGVtcyk7XHJcblxyXG4gICAgY2F0ZWdvcnkud29ya0l0ZW1zID0gYnVpbGRpbmdXb3JrSXRlbXM7XHJcbiAgICBidWlsZGluZ0NhdGVnb3JpZXMucHVzaChjYXRlZ29yeSk7XHJcbiAgfVxyXG5cclxuICBzeW5jUmF0ZWl0ZW1Gcm9tUmF0ZUFuYWx5c2lzKGVudGl0eTogc3RyaW5nLCBidWlsZGluZ0RldGFpbHM6IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCBkYXRhOiBhbnkpID0+IHZvaWQpIHtcclxuXHJcbiAgICBsZXQgcmF0ZUl0ZW1VUkwgPSBjb25maWcuZ2V0KENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0FQSSArIGVudGl0eSArIENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX1JBVEUpO1xyXG4gICAgbGV0IHJhdGVJdGVtUmF0ZUFuYWx5c2lzUHJvbWlzZSA9IHRoaXMuY3JlYXRlUHJvbWlzZShyYXRlSXRlbVVSTCk7XHJcbiAgICBsb2dnZXIuaW5mbygncmF0ZUl0ZW1SYXRlQW5hbHlzaXNQcm9taXNlIGZvciBoYXMgYmVlbiBoaXQnKTtcclxuXHJcbiAgICBsZXQgcmF0ZUFuYWx5c2lzTm90ZXNVUkwgPSBjb25maWcuZ2V0KENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0FQSSArIGVudGl0eSArIENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX05PVEVTKTtcclxuICAgIGxldCBub3Rlc1JhdGVBbmFseXNpc1Byb21pc2UgPSB0aGlzLmNyZWF0ZVByb21pc2UocmF0ZUFuYWx5c2lzTm90ZXNVUkwpO1xyXG4gICAgbG9nZ2VyLmluZm8oJ25vdGVzUmF0ZUFuYWx5c2lzUHJvbWlzZSBmb3IgaGFzIGJlZW4gaGl0Jyk7XHJcblxyXG4gICAgbGV0IGFsbFVuaXRzRnJvbVJhdGVBbmFseXNpc1VSTCA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfQVBJICsgZW50aXR5ICsgQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfVU5JVCk7XHJcbiAgICBsZXQgdW5pdHNSYXRlQW5hbHlzaXNQcm9taXNlID0gdGhpcy5jcmVhdGVQcm9taXNlKGFsbFVuaXRzRnJvbVJhdGVBbmFseXNpc1VSTCk7XHJcbiAgICBsb2dnZXIuaW5mbygndW5pdHNSYXRlQW5hbHlzaXNQcm9taXNlIGZvciBoYXMgYmVlbiBoaXQnKTtcclxuXHJcbiAgICBsZXQgY29zdEhlYWRVUkwgPSBjb25maWcuZ2V0KENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0FQSSArIGVudGl0eSArIENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0NPU1RIRUFEUyk7XHJcbiAgICBsZXQgY29zdEhlYWRSYXRlQW5hbHlzaXNQcm9taXNlID0gdGhpcy5jcmVhdGVQcm9taXNlKGNvc3RIZWFkVVJMKTtcclxuICAgIGxvZ2dlci5pbmZvKCdjb3N0SGVhZFJhdGVBbmFseXNpc1Byb21pc2UgZm9yIGhhcyBiZWVuIGhpdCcpO1xyXG5cclxuICAgIENDUHJvbWlzZS5hbGwoW1xyXG4gICAgICByYXRlSXRlbVJhdGVBbmFseXNpc1Byb21pc2UsXHJcbiAgICAgIG5vdGVzUmF0ZUFuYWx5c2lzUHJvbWlzZSxcclxuICAgICAgdW5pdHNSYXRlQW5hbHlzaXNQcm9taXNlLFxyXG4gICAgICBjb3N0SGVhZFJhdGVBbmFseXNpc1Byb21pc2VcclxuICAgIF0pLnRoZW4oZnVuY3Rpb24gKGRhdGE6IEFycmF5PGFueT4pIHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ2NvbnZlcnRDb3N0SGVhZHNGcm9tUmF0ZUFuYWx5c2lzVG9Db3N0Q29udHJvbCBQcm9taXNlLmFsbCBBUEkgaXMgc3VjY2Vzcy4nKTtcclxuICAgICAgbG9nZ2VyLmluZm8oJ3N1Y2Nlc3MgaW4gIGNvbnZlcnRDb3N0SGVhZHNGcm9tUmF0ZUFuYWx5c2lzVG9Db3N0Q29udHJvbC4nKTtcclxuICAgICAgY2FsbGJhY2sobnVsbCwgZGF0YSk7XHJcbiAgICB9KS5jYXRjaChmdW5jdGlvbiAoZTogYW55KSB7XHJcbiAgICAgIGxvZ2dlci5lcnJvcignIFByb21pc2UgZmFpbGVkIGZvciBjb252ZXJ0Q29zdEhlYWRzRnJvbVJhdGVBbmFseXNpc1RvQ29zdENvbnRyb2wgISA6JyArIGUubWVzc2FnZSk7XHJcbiAgICAgIENDUHJvbWlzZS5yZWplY3QoZS5tZXNzYWdlKTtcclxuICAgIH0pO1xyXG5cclxuICB9XHJcblxyXG4gIGdldFdvcmtJdGVtc0Zyb21SYXRlQW5hbHlzaXMod29ya0l0ZW1zQnlDYXRlZ29yeTogYW55LCByYXRlSXRlbXNSYXRlQW5hbHlzaXM6IGFueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRzUmF0ZUFuYWx5c2lzOiBhbnksIG5vdGVzUmF0ZUFuYWx5c2lzOiBhbnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWlsZGluZ1dvcmtJdGVtczogQXJyYXk8V29ya0l0ZW0+LCBjb25maWdXb3JrSXRlbXM6IEFycmF5PGFueT4pIHtcclxuXHJcbiAgICBsb2dnZXIuaW5mbygnZ2V0V29ya0l0ZW1zRnJvbVJhdGVBbmFseXNpcyBoYXMgYmVlbiBoaXQuJyk7XHJcbiAgICBmb3IgKGxldCBjYXRlZ29yeVdvcmtpdGVtIG9mIHdvcmtJdGVtc0J5Q2F0ZWdvcnkpIHtcclxuICAgICAgICBsZXQgd29ya0l0ZW0gPSB0aGlzLmdldFJhdGVBbmFseXNpcyhjYXRlZ29yeVdvcmtpdGVtLCBjb25maWdXb3JrSXRlbXMsIHJhdGVJdGVtc1JhdGVBbmFseXNpcyxcclxuICAgICAgICAgIHVuaXRzUmF0ZUFuYWx5c2lzLCBub3Rlc1JhdGVBbmFseXNpcyk7XHJcbiAgICAgICAgaWYod29ya0l0ZW0pIHtcclxuICAgICAgICAgIGJ1aWxkaW5nV29ya0l0ZW1zLnB1c2god29ya0l0ZW0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGZvcihsZXQgY29uZmlnV29ya0l0ZW0gb2YgY29uZmlnV29ya0l0ZW1zKSB7XHJcbiAgICAgIGxldCBpc1dvcmtJdGVtRXhpc3RTUUwgPSAnU0VMRUNUICogRlJPTSA/IEFTIHdvcmtpdGVtcyBXSEVSRSBUUklNKHdvcmtpdGVtcy5uYW1lKT0gPyc7XHJcbiAgICAgIGxldCB3b3JrSXRlbUV4aXN0QXJyYXkgPSBhbGFzcWwoaXNXb3JrSXRlbUV4aXN0U1FMLFt3b3JrSXRlbXNCeUNhdGVnb3J5LCBjb25maWdXb3JrSXRlbS5uYW1lXSk7XHJcbiAgICAgIGlmKHdvcmtJdGVtRXhpc3RBcnJheS5sZW5ndGggPT09IDAgJiYgY29uZmlnV29ya0l0ZW0ucmF0ZUFuYWx5c2lzSWQpIHtcclxuICAgICAgICBsZXQgd29ya2l0ZW0gPSB0aGlzLmNvbnZlcnRDb25maWdvcmtpdGVtKGNvbmZpZ1dvcmtJdGVtKTtcclxuICAgICAgICBidWlsZGluZ1dvcmtJdGVtcy5wdXNoKHdvcmtpdGVtKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY29udmVydENvbmZpZ29ya2l0ZW0oY29uZmlnV29ya0l0ZW0gOiBhbnkpIHtcclxuXHJcbiAgICBsZXQgd29ya0l0ZW0gPSBuZXcgV29ya0l0ZW0oY29uZmlnV29ya0l0ZW0ubmFtZSwgY29uZmlnV29ya0l0ZW0ucmF0ZUFuYWx5c2lzSWQpO1xyXG4gICAgd29ya0l0ZW0uaXNEaXJlY3RSYXRlID0gIWNvbmZpZ1dvcmtJdGVtLmlzUmF0ZUFuYWx5c2lzO1xyXG4gICAgd29ya0l0ZW0uaXNSYXRlQW5hbHlzaXMgPSBjb25maWdXb3JrSXRlbS5pc1JhdGVBbmFseXNpcztcclxuICAgIHdvcmtJdGVtLmlzTWVhc3VyZW1lbnRTaGVldCA9IGNvbmZpZ1dvcmtJdGVtLmlzTWVhc3VyZW1lbnRTaGVldDtcclxuICAgIHdvcmtJdGVtLmlzU3RlZWxXb3JrSXRlbSA9IGNvbmZpZ1dvcmtJdGVtLmlzU3RlZWxXb3JrSXRlbTtcclxuICAgIHdvcmtJdGVtLnJhdGVBbmFseXNpc1BlclVuaXQgPSBjb25maWdXb3JrSXRlbS5yYXRlQW5hbHlzaXNQZXJVbml0O1xyXG4gICAgd29ya0l0ZW0ucmF0ZUFuYWx5c2lzVW5pdCA9IGNvbmZpZ1dvcmtJdGVtLnJhdGVBbmFseXNpc1VuaXQ7XHJcbiAgICB3b3JrSXRlbS5pc0l0ZW1CcmVha2Rvd25SZXF1aXJlZCA9IGNvbmZpZ1dvcmtJdGVtLmlzSXRlbUJyZWFrZG93blJlcXVpcmVkO1xyXG4gICAgd29ya0l0ZW0ubGVuZ3RoID0gY29uZmlnV29ya0l0ZW0ubGVuZ3RoO1xyXG4gICAgd29ya0l0ZW0uYnJlYWR0aE9yV2lkdGggPSBjb25maWdXb3JrSXRlbS5icmVhZHRoT3JXaWR0aDtcclxuICAgIHdvcmtJdGVtLmhlaWdodCA9IGNvbmZpZ1dvcmtJdGVtLmhlaWdodDtcclxuICAgIHdvcmtJdGVtLnVuaXQgPSBjb25maWdXb3JrSXRlbS5tZWFzdXJlbWVudFVuaXQ7XHJcblxyXG4gICAgaWYoIWNvbmZpZ1dvcmtJdGVtLmlzUmF0ZUFuYWx5c2lzKSB7XHJcbiAgICAgIHdvcmtJdGVtLnJhdGUudG90YWwgPSBjb25maWdXb3JrSXRlbS5kaXJlY3RSYXRlO1xyXG4gICAgICB3b3JrSXRlbS5yYXRlLnVuaXQgPSBjb25maWdXb3JrSXRlbS5kaXJlY3RSYXRlUGVyVW5pdDtcclxuICAgICAgd29ya0l0ZW0ucmF0ZS5pc0VzdGltYXRlZCA9IHRydWU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBsb2dnZXIuZXJyb3IoJ1dvcmtJdGVtIGVycm9yIGZvciByYXRlQW5hbHlzaXMgOiAnK2NvbmZpZ1dvcmtJdGVtLm5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB3b3JrSXRlbTtcclxuICB9XHJcblxyXG4gIGdldFJhdGVBbmFseXNpcyhjYXRlZ29yeVdvcmtpdGVtOiBXb3JrSXRlbSwgY29uZmlnV29ya0l0ZW1zOiBBcnJheTxhbnk+LCByYXRlSXRlbXNSYXRlQW5hbHlzaXM6IGFueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRzUmF0ZUFuYWx5c2lzOiBhbnksIG5vdGVzUmF0ZUFuYWx5c2lzOiBhbnkpIHtcclxuXHJcbiAgICBsZXQgaXNXb3JrSXRlbUV4aXN0U1FMID0gJ1NFTEVDVCAqIEZST00gPyBBUyB3b3JraXRlbXMgV0hFUkUgVFJJTSh3b3JraXRlbXMubmFtZSk9ID8nO1xyXG4gICAgbGV0IHdvcmtJdGVtRXhpc3RBcnJheSA9IGFsYXNxbChpc1dvcmtJdGVtRXhpc3RTUUwsW2NvbmZpZ1dvcmtJdGVtcywgY2F0ZWdvcnlXb3JraXRlbS5uYW1lXSk7XHJcblxyXG4gICAgaWYod29ya0l0ZW1FeGlzdEFycmF5Lmxlbmd0aCAhPT0gMCkge1xyXG5cclxuICAgICAgbGV0ICB3b3JrSXRlbSA9IG5ldyBXb3JrSXRlbShjYXRlZ29yeVdvcmtpdGVtLm5hbWUsIGNhdGVnb3J5V29ya2l0ZW0ucmF0ZUFuYWx5c2lzSWQpO1xyXG5cclxuICAgICAgaWYoY2F0ZWdvcnlXb3JraXRlbS5hY3RpdmUhPT11bmRlZmluZWQgJiYgY2F0ZWdvcnlXb3JraXRlbS5hY3RpdmUhPT1udWxsKSB7XHJcbiAgICAgICAgd29ya0l0ZW0gPSBjYXRlZ29yeVdvcmtpdGVtO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB3b3JrSXRlbS51bml0ID0gd29ya0l0ZW1FeGlzdEFycmF5WzBdLm1lYXN1cmVtZW50VW5pdDtcclxuICAgICAgd29ya0l0ZW0uaXNNZWFzdXJlbWVudFNoZWV0ID0gd29ya0l0ZW1FeGlzdEFycmF5WzBdLmlzTWVhc3VyZW1lbnRTaGVldDtcclxuICAgICAgd29ya0l0ZW0uaXNSYXRlQW5hbHlzaXMgPSB3b3JrSXRlbUV4aXN0QXJyYXlbMF0uaXNSYXRlQW5hbHlzaXM7XHJcbiAgICAgIHdvcmtJdGVtLmlzU3RlZWxXb3JrSXRlbSA9IHdvcmtJdGVtRXhpc3RBcnJheVswXS5pc1N0ZWVsV29ya0l0ZW07XHJcbiAgICAgIHdvcmtJdGVtLnJhdGVBbmFseXNpc1BlclVuaXQgPSB3b3JrSXRlbUV4aXN0QXJyYXlbMF0ucmF0ZUFuYWx5c2lzUGVyVW5pdDtcclxuICAgICAgd29ya0l0ZW0uaXNJdGVtQnJlYWtkb3duUmVxdWlyZWQgPSB3b3JrSXRlbUV4aXN0QXJyYXlbMF0uaXNJdGVtQnJlYWtkb3duUmVxdWlyZWQ7XHJcbiAgICAgIHdvcmtJdGVtLmxlbmd0aCA9IHdvcmtJdGVtRXhpc3RBcnJheVswXS5sZW5ndGg7XHJcbiAgICAgIHdvcmtJdGVtLmJyZWFkdGhPcldpZHRoID0gd29ya0l0ZW1FeGlzdEFycmF5WzBdLmJyZWFkdGhPcldpZHRoO1xyXG4gICAgICB3b3JrSXRlbS5oZWlnaHQgPSB3b3JrSXRlbUV4aXN0QXJyYXlbMF0uaGVpZ2h0O1xyXG5cclxuICAgICAgbGV0IHJhdGVJdGVtc1JhdGVBbmFseXNpc1NRTCA9ICdTRUxFQ1QgcmF0ZUl0ZW0uQzIgQVMgaXRlbU5hbWUsIHJhdGVJdGVtLkMyIEFTIG9yaWdpbmFsSXRlbU5hbWUsJyArXHJcbiAgICAgICAgJ3JhdGVJdGVtLkMxMiBBUyByYXRlQW5hbHlzaXNJZCwgcmF0ZUl0ZW0uQzYgQVMgdHlwZSwnICtcclxuICAgICAgICAnUk9VTkQocmF0ZUl0ZW0uQzcsMikgQVMgcXVhbnRpdHksIFJPVU5EKHJhdGVJdGVtLkMzLDIpIEFTIHJhdGUsIHVuaXQuQzIgQVMgdW5pdCwnICtcclxuICAgICAgICAnUk9VTkQocmF0ZUl0ZW0uQzMgKiByYXRlSXRlbS5DNywyKSBBUyB0b3RhbEFtb3VudCwgcmF0ZUl0ZW0uQzUgQVMgdG90YWxRdWFudGl0eSwgcmF0ZUl0ZW0uQzEzIEFTIG5vdGVzUmF0ZUFuYWx5c2lzSWQgICcgK1xyXG4gICAgICAgICdGUk9NID8gQVMgcmF0ZUl0ZW0gSk9JTiA/IEFTIHVuaXQgT04gdW5pdC5DMSA9IHJhdGVJdGVtLkM5IHdoZXJlIHJhdGVJdGVtLkMxID0gJ1xyXG4gICAgICAgICsgY2F0ZWdvcnlXb3JraXRlbS5yYXRlQW5hbHlzaXNJZDtcclxuICAgICAgbGV0IHJhdGVJdGVtc0J5V29ya0l0ZW0gPSBhbGFzcWwocmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzU1FMLCBbcmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzLCB1bml0c1JhdGVBbmFseXNpc10pO1xyXG4gICAgICBsZXQgbm90ZXMgPSAnJztcclxuICAgICAgbGV0IGltYWdlVVJMID0gJyc7XHJcbiAgICAgIHdvcmtJdGVtLnJhdGUucmF0ZUl0ZW1zID0gcmF0ZUl0ZW1zQnlXb3JrSXRlbTtcclxuICAgICAgd29ya0l0ZW0ucmF0ZS51bml0ID0gd29ya0l0ZW1FeGlzdEFycmF5WzBdLnJhdGVBbmFseXNpc1VuaXQ7XHJcblxyXG4gICAgICBpZiAocmF0ZUl0ZW1zQnlXb3JrSXRlbSAmJiByYXRlSXRlbXNCeVdvcmtJdGVtLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBsZXQgbm90ZXNSYXRlQW5hbHlzaXNTUUwgPSAnU0VMRUNUIG5vdGVzLkMyIEFTIG5vdGVzLCBub3Rlcy5DMyBBUyBpbWFnZVVSTCBGUk9NID8gQVMgbm90ZXMgd2hlcmUgbm90ZXMuQzEgPSAnK1xyXG4gICAgICAgICAgcmF0ZUl0ZW1zQnlXb3JrSXRlbVswXS5ub3Rlc1JhdGVBbmFseXNpc0lkO1xyXG4gICAgICAgIGxldCBub3Rlc0xpc3QgPSBhbGFzcWwobm90ZXNSYXRlQW5hbHlzaXNTUUwsIFtub3Rlc1JhdGVBbmFseXNpc10pO1xyXG4gICAgICAgIG5vdGVzID0gbm90ZXNMaXN0WzBdLm5vdGVzO1xyXG4gICAgICAgIGltYWdlVVJMID0gbm90ZXNMaXN0WzBdLmltYWdlVVJMO1xyXG5cclxuICAgICAgICB3b3JrSXRlbS5yYXRlLnF1YW50aXR5ID0gcmF0ZUl0ZW1zQnlXb3JrSXRlbVswXS50b3RhbFF1YW50aXR5O1xyXG4gICAgICAgIHdvcmtJdGVtLnN5c3RlbVJhdGUucXVhbnRpdHkgPSByYXRlSXRlbXNCeVdvcmtJdGVtWzBdLnRvdGFsUXVhbnRpdHk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgd29ya0l0ZW0ucmF0ZS5xdWFudGl0eSA9IDE7XHJcbiAgICAgICAgd29ya0l0ZW0uc3lzdGVtUmF0ZS5xdWFudGl0eSA9IDE7XHJcbiAgICAgIH1cclxuICAgICAgd29ya0l0ZW0ucmF0ZS5pc0VzdGltYXRlZCA9IHRydWU7XHJcbiAgICAgIHdvcmtJdGVtLnJhdGUubm90ZXMgPSBub3RlcztcclxuICAgICAgd29ya0l0ZW0ucmF0ZS5pbWFnZVVSTCA9aW1hZ2VVUkw7XHJcblxyXG4gICAgICAvL1N5c3RlbSByYXRlXHJcblxyXG4gICAgICB3b3JrSXRlbS5zeXN0ZW1SYXRlLnJhdGVJdGVtcyA9IHJhdGVJdGVtc0J5V29ya0l0ZW07XHJcbiAgICAgIHdvcmtJdGVtLnN5c3RlbVJhdGUubm90ZXMgPSBub3RlcztcclxuICAgICAgd29ya0l0ZW0uc3lzdGVtUmF0ZS5pbWFnZVVSTCA9IGltYWdlVVJMO1xyXG4gICAgICByZXR1cm4gd29ya0l0ZW07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG4gIFN5bmNSYXRlQW5hbHlzaXMoKSB7XHJcbiAgICBsZXQgcmF0ZUFuYWx5c2lzU2VydmljZSA9IG5ldyBSYXRlQW5hbHlzaXNTZXJ2aWNlKCk7XHJcbiAgICB0aGlzLmNvbnZlcnRDb3N0SGVhZHNGcm9tUmF0ZUFuYWx5c2lzVG9Db3N0Q29udHJvbChDb25zdGFudHMuQlVJTERJTkcsIChlcnJvcjogYW55LCBidWlsZGluZ0RhdGE6IGFueSk9PiB7XHJcbiAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgbG9nZ2VyLmVycm9yKCdSYXRlQW5hbHlzaXMgU3luYyBGYWlsZWQuJyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5jb252ZXJ0Q29zdEhlYWRzRnJvbVJhdGVBbmFseXNpc1RvQ29zdENvbnRyb2woQ29uc3RhbnRzLkJVSUxESU5HLCAoZXJyb3I6IGFueSwgcHJvamVjdERhdGE6IGFueSk9PiB7XHJcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgbG9nZ2VyLmVycm9yKCdSYXRlQW5hbHlzaXMgU3luYyBGYWlsZWQuJyk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgYnVpbGRpbmdDb3N0SGVhZHMgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGJ1aWxkaW5nRGF0YS5idWlsZGluZ0Nvc3RIZWFkcykpO1xyXG4gICAgICAgICAgICBsZXQgcHJvamVjdENvc3RIZWFkcyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkocHJvamVjdERhdGEuYnVpbGRpbmdDb3N0SGVhZHMpKTtcclxuICAgICAgICAgICAgbGV0IGNvbmZpZ0Nvc3RIZWFkcyA9IGNvbmZpZy5nZXQoJ2NvbmZpZ0Nvc3RIZWFkcycpO1xyXG4gICAgICAgICAgICBsZXQgY29uZmlnUHJvamVjdENvc3RIZWFkcyA9IGNvbmZpZy5nZXQoJ2NvbmZpZ1Byb2plY3RDb3N0SGVhZHMnKTtcclxuICAgICAgICAgICAgbGV0IGZpeGVkQ29zdENvbmZpZ1Byb2plY3RDb3N0SGVhZHMgPSBjb25maWcuZ2V0KCdmaXhlZENvc3RDb25maWdQcm9qZWN0Q29zdEhlYWRzJyk7XHJcbiAgICAgICAgICAgIHRoaXMuY29udmVydENvbmZpZ0Nvc3RIZWFkcyhjb25maWdDb3N0SGVhZHMsIGJ1aWxkaW5nQ29zdEhlYWRzKTtcclxuICAgICAgICAgICAgdGhpcy5jb252ZXJ0Q29uZmlnQ29zdEhlYWRzKGNvbmZpZ1Byb2plY3RDb3N0SGVhZHMsIHByb2plY3RDb3N0SGVhZHMpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnZlcnRDb25maWdDb3N0SGVhZHMoZml4ZWRDb3N0Q29uZmlnUHJvamVjdENvc3RIZWFkcywgcHJvamVjdENvc3RIZWFkcyk7XHJcbiAgICAgICAgICAgIGJ1aWxkaW5nQ29zdEhlYWRzID0gYWxhc3FsKCdTRUxFQ1QgKiBGUk9NID8gT1JERVIgQlkgcHJpb3JpdHlJZCcsIFtidWlsZGluZ0Nvc3RIZWFkc10pO1xyXG4gICAgICAgICAgICBwcm9qZWN0Q29zdEhlYWRzID0gYWxhc3FsKCdTRUxFQ1QgKiBGUk9NID8gT1JERVIgQlkgcHJpb3JpdHlJZCcsIFtwcm9qZWN0Q29zdEhlYWRzXSk7XHJcbiAgICAgICAgICAgIGxldCBidWlsZGluZ1JhdGVzID0gdGhpcy5nZXRSYXRlcyhidWlsZGluZ0RhdGEsIGJ1aWxkaW5nQ29zdEhlYWRzKTtcclxuICAgICAgICAgICAgbGV0IHByb2plY3RSYXRlcyA9IHRoaXMuZ2V0UmF0ZXMocHJvamVjdERhdGEsIHByb2plY3RDb3N0SGVhZHMpO1xyXG4gICAgICAgICAgICBsZXQgcmF0ZUFuYWx5c2lzID0gbmV3IFJhdGVBbmFseXNpcyhidWlsZGluZ0Nvc3RIZWFkcywgYnVpbGRpbmdSYXRlcywgcHJvamVjdENvc3RIZWFkcywgcHJvamVjdFJhdGVzKTtcclxuICAgICAgICAgICAgdGhpcy5zYXZlUmF0ZUFuYWx5c2lzKHJhdGVBbmFseXNpcyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgY29udmVydENvbmZpZ0Nvc3RIZWFkcyhjb25maWdDb3N0SGVhZHM6IEFycmF5PGFueT4sIGNvc3RIZWFkc0RhdGE6IEFycmF5PENvc3RIZWFkPikge1xyXG5cclxuICAgIGZvciAobGV0IGNvbmZpZ0Nvc3RIZWFkIG9mIGNvbmZpZ0Nvc3RIZWFkcykge1xyXG5cclxuICAgICAgbGV0IGNvc3RIZWFkRXhpc3RTUUwgPSAnU0VMRUNUICogRlJPTSA/IEFTIGNvc3RIZWFkcyBXSEVSRSBjb3N0SGVhZHMubmFtZT0gPyc7XHJcbiAgICAgIGxldCBjb3N0SGVhZEV4aXN0QXJyYXkgPSBhbGFzcWwoY29zdEhlYWRFeGlzdFNRTCxbY29zdEhlYWRzRGF0YSxjb25maWdDb3N0SGVhZC5uYW1lXSk7XHJcblxyXG4gICAgICBpZihjb3N0SGVhZEV4aXN0QXJyYXkubGVuZ3RoID09PSAwICYmIGNvbmZpZ0Nvc3RIZWFkLnJhdGVBbmFseXNpc0lkKSB7XHJcbiAgICAgICAgbGV0IGNvc3RIZWFkOiBDb3N0SGVhZCA9IG5ldyBDb3N0SGVhZCgpO1xyXG4gICAgICAgIGNvc3RIZWFkLm5hbWUgPSBjb25maWdDb3N0SGVhZC5uYW1lO1xyXG4gICAgICAgIGNvc3RIZWFkLnByaW9yaXR5SWQgPSBjb25maWdDb3N0SGVhZC5wcmlvcml0eUlkO1xyXG4gICAgICAgIGNvc3RIZWFkLnJhdGVBbmFseXNpc0lkID0gY29uZmlnQ29zdEhlYWQucmF0ZUFuYWx5c2lzSWQ7XHJcbiAgICAgICAgbGV0IGNhdGVnb3JpZXNMaXN0ID0gbmV3IEFycmF5PENhdGVnb3J5PigpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBjb25maWdDYXRlZ29yeSBvZiBjb25maWdDb3N0SGVhZC5jYXRlZ29yaWVzKSB7XHJcblxyXG4gICAgICAgICAgbGV0IGNhdGVnb3J5OiBDYXRlZ29yeSA9IG5ldyBDYXRlZ29yeShjb25maWdDYXRlZ29yeS5uYW1lLCBjb25maWdDYXRlZ29yeS5yYXRlQW5hbHlzaXNJZCk7XHJcbiAgICAgICAgICBsZXQgd29ya0l0ZW1zTGlzdDogQXJyYXk8V29ya0l0ZW0+ID0gbmV3IEFycmF5PFdvcmtJdGVtPigpO1xyXG5cclxuICAgICAgICAgIGZvciAobGV0IGNvbmZpZ1dvcmtJdGVtIG9mIGNvbmZpZ0NhdGVnb3J5LndvcmtJdGVtcykge1xyXG5cclxuICAgICAgICAgICAgbGV0IHdvcmtJdGVtOiBXb3JrSXRlbSA9IG5ldyBXb3JrSXRlbShjb25maWdXb3JrSXRlbS5uYW1lLCBjb25maWdXb3JrSXRlbS5yYXRlQW5hbHlzaXNJZCk7XHJcbiAgICAgICAgICAgIHdvcmtJdGVtLmlzRGlyZWN0UmF0ZSA9IHRydWU7XHJcbiAgICAgICAgICAgIHdvcmtJdGVtLnVuaXQgPSBjb25maWdXb3JrSXRlbS5tZWFzdXJlbWVudFVuaXQ7XHJcbiAgICAgICAgICAgIHdvcmtJdGVtLmlzTWVhc3VyZW1lbnRTaGVldCA9IGNvbmZpZ1dvcmtJdGVtLmlzTWVhc3VyZW1lbnRTaGVldDtcclxuICAgICAgICAgICAgd29ya0l0ZW0uaXNSYXRlQW5hbHlzaXMgPSBjb25maWdXb3JrSXRlbS5pc1JhdGVBbmFseXNpcztcclxuICAgICAgICAgICAgd29ya0l0ZW0ucmF0ZUFuYWx5c2lzUGVyVW5pdCA9IGNvbmZpZ1dvcmtJdGVtLnJhdGVBbmFseXNpc1BlclVuaXQ7XHJcbiAgICAgICAgICAgIHdvcmtJdGVtLmlzU3RlZWxXb3JrSXRlbSA9IGNvbmZpZ1dvcmtJdGVtLmlzU3RlZWxXb3JrSXRlbTtcclxuICAgICAgICAgICAgd29ya0l0ZW0uaXNJdGVtQnJlYWtkb3duUmVxdWlyZWQgPSBjb25maWdXb3JrSXRlbS5pc0l0ZW1CcmVha2Rvd25SZXF1aXJlZDtcclxuICAgICAgICAgICAgd29ya0l0ZW0ubGVuZ3RoID0gY29uZmlnV29ya0l0ZW0ubGVuZ3RoO1xyXG4gICAgICAgICAgICB3b3JrSXRlbS5icmVhZHRoT3JXaWR0aCA9IGNvbmZpZ1dvcmtJdGVtLmJyZWFkdGhPcldpZHRoO1xyXG4gICAgICAgICAgICB3b3JrSXRlbS5oZWlnaHQgPSBjb25maWdXb3JrSXRlbS5oZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICBpZiAoY29uZmlnV29ya0l0ZW0uZGlyZWN0UmF0ZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgIHdvcmtJdGVtLnJhdGUudG90YWwgPSBjb25maWdXb3JrSXRlbS5kaXJlY3RSYXRlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHdvcmtJdGVtLnJhdGUudG90YWwgPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHdvcmtJdGVtLnJhdGUuaXNFc3RpbWF0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB3b3JrSXRlbXNMaXN0LnB1c2god29ya0l0ZW0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY2F0ZWdvcnkud29ya0l0ZW1zID0gd29ya0l0ZW1zTGlzdDtcclxuICAgICAgICAgIGNhdGVnb3JpZXNMaXN0LnB1c2goY2F0ZWdvcnkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAgIGNvc3RIZWFkLmNhdGVnb3JpZXMgPSBjYXRlZ29yaWVzTGlzdDtcclxuICAgICAgICBjb3N0SGVhZC50aHVtYlJ1bGVSYXRlID0gY29uZmlnLmdldChDb25zdGFudHMuVEhVTUJSVUxFX1JBVEUpO1xyXG4gICAgICAgIGNvc3RIZWFkc0RhdGEucHVzaChjb3N0SGVhZCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBjb3N0SGVhZHNEYXRhO1xyXG4gIH1cclxuXHJcbiAgZ2V0UmF0ZXMocmVzdWx0OiBhbnksIGNvc3RIZWFkczogQXJyYXk8Q29zdEhlYWQ+KSB7XHJcbiAgICBsZXQgZ2V0UmF0ZXNMaXN0U1FMID0gJ1NFTEVDVCAqIEZST00gPyBBUyBxIFdIRVJFIHEuQzQgSU4gKFNFTEVDVCB0LnJhdGVBbmFseXNpc0lkICcgK1xyXG4gICAgICAnRlJPTSA/IEFTIHQpJztcclxuICAgIGxldCByYXRlSXRlbXMgPSBhbGFzcWwoZ2V0UmF0ZXNMaXN0U1FMLCBbcmVzdWx0LnJhdGVzLCBjb3N0SGVhZHNdKTtcclxuXHJcbiAgICBsZXQgcmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzU1FMID0gJ1NFTEVDVCByYXRlSXRlbS5DMiBBUyBpdGVtTmFtZSwgcmF0ZUl0ZW0uQzIgQVMgb3JpZ2luYWxJdGVtTmFtZSwnICtcclxuICAgICAgJ3JhdGVJdGVtLkMxMiBBUyByYXRlQW5hbHlzaXNJZCwgcmF0ZUl0ZW0uQzYgQVMgdHlwZSwnICtcclxuICAgICAgJ1JPVU5EKHJhdGVJdGVtLkM3LDIpIEFTIHF1YW50aXR5LCBST1VORChyYXRlSXRlbS5DMywyKSBBUyByYXRlLCB1bml0LkMyIEFTIHVuaXQsJyArXHJcbiAgICAgICdST1VORChyYXRlSXRlbS5DMyAqIHJhdGVJdGVtLkM3LDIpIEFTIHRvdGFsQW1vdW50LCByYXRlSXRlbS5DNSBBUyB0b3RhbFF1YW50aXR5ICcgK1xyXG4gICAgICAnRlJPTSA/IEFTIHJhdGVJdGVtIEpPSU4gPyBBUyB1bml0IE9OIHVuaXQuQzEgPSByYXRlSXRlbS5DOSc7XHJcblxyXG4gICAgbGV0IHJhdGVJdGVtc0xpc3QgPSBhbGFzcWwocmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzU1FMLCBbcmF0ZUl0ZW1zLCByZXN1bHQudW5pdHNdKTtcclxuXHJcbiAgICBsZXQgZGlzdGluY3RJdGVtc1NRTCA9ICdzZWxlY3QgRElTVElOQ1QgaXRlbU5hbWUsb3JpZ2luYWxJdGVtTmFtZSxyYXRlIEZST00gPyc7XHJcbiAgICB2YXIgZGlzdGluY3RSYXRlcyA9IGFsYXNxbChkaXN0aW5jdEl0ZW1zU1FMLCBbcmF0ZUl0ZW1zTGlzdF0pO1xyXG5cclxuICAgIHJldHVybiBkaXN0aW5jdFJhdGVzO1xyXG4gIH1cclxuXHJcbiAgc2F2ZVJhdGVBbmFseXNpcyhyYXRlQW5hbHlzaXM6IFJhdGVBbmFseXNpcykge1xyXG4gICAgbG9nZ2VyLmluZm8oJ3NhdmVSYXRlQW5hbHlzaXMgaXMgYmVlbiBoaXQnKTtcclxuICAgIGxldCBxdWVyeSA9IHt9O1xyXG4gICAgdGhpcy5yYXRlQW5hbHlzaXNSZXBvc2l0b3J5LnJldHJpZXZlKHt9LCAoZXJyb3I6YW55LCByYXRlQW5hbHlzaXNBcnJheTogQXJyYXk8UmF0ZUFuYWx5c2lzPikgPT4ge1xyXG4gICAgICBpZihlcnJvcikge1xyXG4gICAgICAgIGxvZ2dlci5lcnJvcignVW5hYmxlIHRvIHJldHJpdmUgc3luY2VkIFJhdGVBbmFseXNpcycpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmKHJhdGVBbmFseXNpc0FycmF5Lmxlbmd0aCA+MCkge1xyXG4gICAgICAgICAgcXVlcnkgPSB7IF9pZCA6IHJhdGVBbmFseXNpc0FycmF5WzBdLl9pZH07XHJcbiAgICAgICAgICBsZXQgdXBkYXRlID0geyRzZXQ6IHtcclxuICAgICAgICAgICAgJ3Byb2plY3RDb3N0SGVhZHMnOiByYXRlQW5hbHlzaXMucHJvamVjdENvc3RIZWFkcyxcclxuICAgICAgICAgICAgJ3Byb2plY3RSYXRlcyc6IHJhdGVBbmFseXNpcy5wcm9qZWN0UmF0ZXMsXHJcbiAgICAgICAgICAgICdidWlsZGluZ0Nvc3RIZWFkcyc6IHJhdGVBbmFseXNpcy5idWlsZGluZ0Nvc3RIZWFkcyxcclxuICAgICAgICAgICAgJ2J1aWxkaW5nUmF0ZXMnOiByYXRlQW5hbHlzaXMuYnVpbGRpbmdSYXRlc1xyXG4gICAgICAgICAgfX07XHJcbiAgICAgICAgICB0aGlzLnJhdGVBbmFseXNpc1JlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgdXBkYXRlLHtuZXc6IHRydWV9LChlcnJvcjogYW55LCByYXRlQW5hbHlzaXNBcnJheTogUmF0ZUFuYWx5c2lzKSA9PiB7XHJcbiAgICAgICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKCdzYXZlUmF0ZUFuYWx5c2lzIGZhaWxlZCA9PiAnICsgZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgICBsb2dnZXIuaW5mbygnVXBkYXRlZCBSYXRlQW5hbHlzaXMuJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgIHRoaXMucmF0ZUFuYWx5c2lzUmVwb3NpdG9yeS5jcmVhdGUocmF0ZUFuYWx5c2lzLCAoZXJyb3I6IGFueSwgcmVzdWx0OiBSYXRlQW5hbHlzaXMpID0+IHtcclxuICAgICAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoJ3NhdmVSYXRlQW5hbHlzaXMgZmFpbGVkID0+ICcgKyBlcnJvci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICAgIGxvZ2dlci5pbmZvKCdTYXZlZCBSYXRlQW5hbHlzaXMuJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRDb3N0Q29udHJvbFJhdGVBbmFseXNpcyhxdWVyeTogYW55LCBwcm9qZWN0aW9uOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmF0ZUFuYWx5c2lzOiBSYXRlQW5hbHlzaXMpID0+IHZvaWQpIHtcclxuICAgIHRoaXMucmF0ZUFuYWx5c2lzUmVwb3NpdG9yeS5yZXRyaWV2ZVdpdGhQcm9qZWN0aW9uKHF1ZXJ5LCBwcm9qZWN0aW9uLChlcnJvcjogYW55LCByYXRlQW5hbHlzaXNBcnJheTogQXJyYXk8UmF0ZUFuYWx5c2lzPikgPT4ge1xyXG4gICAgICBpZihlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZihyYXRlQW5hbHlzaXNBcnJheS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgIGxvZ2dlci5lcnJvcignQ29udENvbnRyb2wgUmF0ZUFuYWx5c2lzIG5vdCBmb3VuZC4nKTtcclxuICAgICAgICAgIGNhbGxiYWNrKCdDb250Q29udHJvbCBSYXRlQW5hbHlzaXMgbm90IGZvdW5kLicsIG51bGwpO1xyXG4gICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJhdGVBbmFseXNpc0FycmF5WzBdKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0QWdncmVnYXRlRGF0YShxdWVyeTogYW55LCBjYWxsYmFjazooZXJyb3I6YW55LCBhZ2dyZWdhdGVEYXRhOiBhbnkpID0+dm9pZCkge1xyXG4gICAgdGhpcy5yYXRlQW5hbHlzaXNSZXBvc2l0b3J5LmFnZ3JlZ2F0ZShxdWVyeSxjYWxsYmFjayk7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuT2JqZWN0LnNlYWwoUmF0ZUFuYWx5c2lzU2VydmljZSk7XHJcbmV4cG9ydCA9IFJhdGVBbmFseXNpc1NlcnZpY2U7XHJcbiJdfQ==
