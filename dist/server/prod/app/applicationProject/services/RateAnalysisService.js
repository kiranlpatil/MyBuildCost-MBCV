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
var messages = require("../../applicationProject/shared/messages");
var RACategory = require("../dataaccess/model/RateAnalysis/RACategory");
var RAWorkItem = require("../dataaccess/model/RateAnalysis/RAWorkItem");
var RACostHead = require("../dataaccess/model/RateAnalysis/RACostHead");
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
            if (error || (!error && response.statusCode !== 200)) {
                if (!error && response.statusCode !== 200) {
                    callback('Get cost Heads response NOT FOUND', null);
                }
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
            if (error || (!error && response.statusCode !== 200)) {
                if (!error && response.statusCode !== 200) {
                    callback('Get work items response NOT FOUND', null);
                }
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
            if (error || (!error && response.statusCode !== 200)) {
                if (!error && response.statusCode !== 200) {
                    callback('Get work items by cost Head NOT FOUND', null);
                }
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
                    if (response.statusCode === 200) {
                        var res = JSON.parse(body);
                        callback(null, res);
                    }
                    else {
                        var error_1 = new Error();
                        error_1.message = 'Unable to make a get request for url : ' + url;
                        callback(error_1, null);
                    }
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
    RateAnalysisService.prototype.convertCostHeadsFromRateAnalysisToCostControl = function (entity, region, callback) {
        logger.info('convertCostHeadsFromRateAnalysisToCostControl has been hit');
        var costHeadURL = config.get(Constants.RATE_ANALYSIS_API + entity + Constants.RATE_ANALYSIS_COSTHEADS)
            + region.RegionId + config.get(Constants.RATE_ANALYSIS_API + Constants.RATE_ANALYSIS_API_ENDPOINT);
        var costHeadRateAnalysisPromise = this.createPromise(costHeadURL);
        logger.info('costHeadRateAnalysisPromise for has been hit');
        var categoryURL = config.get(Constants.RATE_ANALYSIS_API + entity + Constants.RATE_ANALYSIS_CATEGORIES)
            + region.RegionId + config.get(Constants.RATE_ANALYSIS_API + Constants.RATE_ANALYSIS_API_ENDPOINT);
        var categoryRateAnalysisPromise = this.createPromise(categoryURL);
        logger.info('categoryRateAnalysisPromise for has been hit');
        var workItemURL = config.get(Constants.RATE_ANALYSIS_API + entity + Constants.RATE_ANALYSIS_WORKITEMS)
            + region.RegionId + config.get(Constants.RATE_ANALYSIS_API + Constants.RATE_ANALYSIS_API_ENDPOINT);
        var workItemRateAnalysisPromise = this.createPromise(workItemURL);
        logger.info('workItemRateAnalysisPromise for has been hit');
        var rateItemURL = config.get(Constants.RATE_ANALYSIS_API + entity + Constants.RATE_ANALYSIS_RATE)
            + region.RegionId + config.get(Constants.RATE_ANALYSIS_API + Constants.RATE_ANALYSIS_API_ENDPOINT);
        var rateItemRateAnalysisPromise = this.createPromise(rateItemURL);
        logger.info('rateItemRateAnalysisPromise for has been hit');
        var rateAnalysisNotesURL = config.get(Constants.RATE_ANALYSIS_API + entity + Constants.RATE_ANALYSIS_NOTES)
            + region.RegionId + config.get(Constants.RATE_ANALYSIS_API + Constants.RATE_ANALYSIS_API_ENDPOINT);
        var notesRateAnalysisPromise = this.createPromise(rateAnalysisNotesURL);
        logger.info('notesRateAnalysisPromise for has been hit');
        var allUnitsFromRateAnalysisURL = config.get(Constants.RATE_ANALYSIS_API + entity + Constants.RATE_ANALYSIS_UNIT)
            + region.RegionId + config.get(Constants.RATE_ANALYSIS_API + Constants.RATE_ANALYSIS_API_ENDPOINT);
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
            if (data[0][Constants.RATE_ANALYSIS_ITEM_TYPE] && data[1][Constants.RATE_ANALYSIS_SUBITEM_TYPE] &&
                data[2][Constants.RATE_ANALYSIS_ITEMS] && data[3][Constants.RATE_ANALYSIS_DATA] &&
                data[4][Constants.RATE_ANALYSIS_DATA] && data[5][Constants.RATE_ANALYSIS_UOM]) {
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
            }
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
    RateAnalysisService.prototype.syncAllRegions = function () {
        var regionObj = {
            'RegionId': 1,
            'RegionCode': 'MH',
            'Region': 'Maharashtra Pune Circle'
        };
        this.SyncRateAnalysis(regionObj);
    };
    RateAnalysisService.prototype.SyncRateAnalysis = function (region) {
        var _this = this;
        var rateAnalysisService = new RateAnalysisService();
        this.convertCostHeadsFromRateAnalysisToCostControl(Constants.BUILDING, region, function (error, buildingData) {
            if (error) {
                logger.error('RateAnalysis Sync Failed.');
            }
            else {
                _this.convertCostHeadsFromRateAnalysisToCostControl(Constants.BUILDING, region, function (error, projectData) {
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
                        _this.saveRateAnalysis(rateAnalysis, region);
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
    RateAnalysisService.prototype.saveRateAnalysis = function (rateAnalysis, region) {
        var _this = this;
        logger.info('saveRateAnalysis is been hit : ' + region.Region);
        var query = { 'region': region.Region };
        rateAnalysis.region = region.Region;
        logger.info('Updating RateAnalysis for ' + region.Region);
        this.rateAnalysisRepository.retrieve({ 'region': region.Region }, function (error, rateAnalysisArray) {
            if (error) {
                logger.error('Unable to retrive synced RateAnalysis');
            }
            else {
                if (rateAnalysisArray.length > 0) {
                    query = { 'region': region.Region };
                    var update = {
                        $set: {
                            'projectCostHeads': rateAnalysis.projectCostHeads,
                            'projectRates': rateAnalysis.projectRates,
                            'buildingCostHeads': rateAnalysis.buildingCostHeads,
                            'buildingRates': rateAnalysis.buildingRates
                        }
                    };
                    _this.rateAnalysisRepository.findOneAndUpdate(query, update, { new: true }, function (error, rateAnalysisArray) {
                        if (error) {
                            logger.error('saveRateAnalysis failed => ' + error.message);
                        }
                        else {
                            logger.info('Updated RateAnalysis for region :' + region.Region);
                        }
                    });
                }
                else {
                    _this.rateAnalysisRepository.create(rateAnalysis, function (error, result) {
                        if (error) {
                            logger.error('saveRateAnalysis failed => ' + error.message);
                        }
                        else {
                            logger.info('Saved RateAnalysis for region : ' + region.Region);
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
    RateAnalysisService.prototype.getAllregionsFromRateAnalysis = function (callback) {
        logger.info('Rate Analysis Service, getCostHeads has been hit');
        var regionListFromRateAnalysis;
        var url = config.get('rateAnalysisAPI.getAllregions');
        request.get({ url: url }, function (error, response, body) {
            if (error) {
                logger.error('Error for getting all regions.');
                logger.error(JSON.stringify(error));
                callback(error, null);
            }
            else if (!error && response) {
                if (response.statusCode === 200) {
                    var resp = JSON.parse(body);
                    regionListFromRateAnalysis = resp['Regions'];
                    console.log('regionListFromRateAnalysis : ' + JSON.stringify(regionListFromRateAnalysis));
                    callback(null, regionListFromRateAnalysis);
                }
                else {
                    console.log('regionListFromRateAnalysis : NOT FOUND. Internal server error!');
                    callback('regionListFromRateAnalysis : NOT FOUND. Internal server error!', null);
                }
            }
        });
    };
    RateAnalysisService.prototype.getAllRegionNames = function (callback) {
        var query = [
            { $unwind: '$region' },
            { $project: { 'region': 1, _id: 0 } }
        ];
        this.rateAnalysisRepository.aggregate(query, function (error, result) {
            if (error) {
                callback(error, null);
            }
            else {
                if (result.length > 0) {
                    callback(error, result);
                }
                else {
                    var error_2 = new Error();
                    error_2.message = messages.MSG_ERROR_REGIONS_ARE_NOT_PRESENT;
                    callback(error_2, null);
                }
            }
        });
    };
    RateAnalysisService.prototype.getAllDataForDropdown = function (regionName, callback) {
        var _this = this;
        var query = { region: regionName };
        var projection = { 'buildingCostHeads': 1 };
        this.rateAnalysisRepository.retrieveWithProjection(query, projection, function (error, result) {
            if (error) {
                callback(error, null);
            }
            else {
                var costHeadData = result[0].buildingCostHeads;
                var buildingCostHeads = [];
                if (costHeadData.length > 0) {
                    for (var costHeadIndex = 0; costHeadIndex < costHeadData.length; costHeadIndex++) {
                        var costHead = new RACostHead();
                        costHead.name = costHeadData[costHeadIndex].name;
                        costHead.rateAnalysisId = costHeadData[costHeadIndex].rateAnalysisId;
                        var buildingCategories = new Array();
                        _this.getCategories(costHeadData[costHeadIndex].categories, buildingCategories);
                        costHead.categories = buildingCategories;
                        if (costHead.categories.length > 0) {
                            buildingCostHeads.push(costHead);
                        }
                    }
                    callback(null, buildingCostHeads);
                }
                else {
                    var error_3 = new Error();
                    error_3.message = messages.MSG_ERROR_REGIONS_ARE_NOT_PRESENT;
                    callback(error_3, null);
                }
            }
        });
    };
    RateAnalysisService.prototype.getCategories = function (categoriesData, buildingCategories) {
        if (categoriesData.length > 0) {
            for (var categoryIndex = 0; categoryIndex < categoriesData.length; categoryIndex++) {
                var category = new RACategory();
                category.name = categoriesData[categoryIndex].name;
                category.rateAnalysisId = categoriesData[categoryIndex].rateAnalysisId;
                var buildingWorkItems = new Array();
                this.getWorkItemsForRA(categoriesData[categoryIndex].workItems, buildingWorkItems);
                category.workItems = buildingWorkItems;
                if (category.workItems.length > 0) {
                    buildingCategories.push(category);
                }
            }
        }
    };
    RateAnalysisService.prototype.getWorkItemsForRA = function (workItemsData, buildingWorkItems) {
        if (workItemsData.length > 0) {
            for (var workItemIndex = 0; workItemIndex < workItemsData.length; workItemIndex++) {
                var workItem = new RAWorkItem();
                workItem.name = workItemsData[workItemIndex].name;
                workItem.rateAnalysisId = workItemsData[workItemIndex].rateAnalysisId;
                workItem.rate = workItemsData[workItemIndex].rate;
                workItem.unit = workItemsData[workItemIndex].unit;
                if (workItem.rate.rateItems.length > 0) {
                    buildingWorkItems.push(workItem);
                }
            }
        }
    };
    return RateAnalysisService;
}());
Object.seal(RateAnalysisService);
module.exports = RateAnalysisService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHBsaWNhdGlvblByb2plY3Qvc2VydmljZXMvUmF0ZUFuYWx5c2lzU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsb0VBQXVFO0FBQ3ZFLGtFQUFxRTtBQUVyRSw4RUFBaUY7QUFDakYsMEVBQTZFO0FBQzdFLHdFQUEyRTtBQUMzRSwrQkFBa0M7QUFDbEMsZ0VBQW1FO0FBQ25FLHdFQUEyRTtBQUMzRSx3RUFBMkU7QUFHM0UsK0NBQWtEO0FBQ2xELHdGQUEyRjtBQUMzRiw0RUFBK0U7QUFFL0UsbUVBQXVFO0FBQ3ZFLHdFQUEyRTtBQUMzRSx3RUFBMkU7QUFDM0Usd0VBQTJFO0FBRTNFLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNqQyxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDL0IsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUV2RCxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsNEJBQTRCLENBQUMsQ0FBQztBQUV0RDtJQU9FO1FBQ0UsSUFBSSxDQUFDLFFBQVEsR0FBRyxZQUFZLENBQUMsUUFBUSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxlQUFlLEVBQUUsQ0FBQztRQUM3QyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7UUFDckMsSUFBSSxDQUFDLHNCQUFzQixHQUFHLElBQUksc0JBQXNCLEVBQUUsQ0FBQztJQUM3RCxDQUFDO0lBRUQsMENBQVksR0FBWixVQUFhLEdBQVcsRUFBRSxJQUFVLEVBQUUsUUFBMkM7UUFDL0UsTUFBTSxDQUFDLElBQUksQ0FBQyxrREFBa0QsQ0FBQyxDQUFDO1FBQ2hFLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBQyxHQUFHLEVBQUUsR0FB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QUMsYUFBYSxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUNsRCxRQUFRLENBQUMsSUFBSSxHQUFHLGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQ2xELEVBQUUsQ0FBQSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN0QyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ25DLENBQUM7WUFDSCxDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFDSCwwQkFBQztBQUFELENBbnlCQSxBQW15QkMsSUFBQTtBQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUNqQyxpQkFBUyxtQkFBbUIsQ0FBQyIsImZpbGUiOiJhcHAvYXBwbGljYXRpb25Qcm9qZWN0L3NlcnZpY2VzL1JhdGVBbmFseXNpc1NlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVXNlclNlcnZpY2UgPSByZXF1aXJlKCcuLy4uLy4uL2ZyYW1ld29yay9zZXJ2aWNlcy9Vc2VyU2VydmljZScpO1xyXG5pbXBvcnQgUHJvamVjdEFzc2V0ID0gcmVxdWlyZSgnLi4vLi4vZnJhbWV3b3JrL3NoYXJlZC9wcm9qZWN0YXNzZXQnKTtcclxuaW1wb3J0IFVzZXIgPSByZXF1aXJlKCcuLi8uLi9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9tb25nb29zZS91c2VyJyk7XHJcbmltcG9ydCBBdXRoSW50ZXJjZXB0b3IgPSByZXF1aXJlKCcuLi8uLi9mcmFtZXdvcmsvaW50ZXJjZXB0b3IvYXV0aC5pbnRlcmNlcHRvcicpO1xyXG5pbXBvcnQgQ29zdENvbnRyb2xsRXhjZXB0aW9uID0gcmVxdWlyZSgnLi4vZXhjZXB0aW9uL0Nvc3RDb250cm9sbEV4Y2VwdGlvbicpO1xyXG5pbXBvcnQgV29ya0l0ZW0gPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3Byb2plY3QvYnVpbGRpbmcvV29ya0l0ZW0nKTtcclxuaW1wb3J0IGFsYXNxbCA9IHJlcXVpcmUoJ2FsYXNxbCcpO1xyXG5pbXBvcnQgUmF0ZSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9idWlsZGluZy9SYXRlJyk7XHJcbmltcG9ydCBDb3N0SGVhZCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9idWlsZGluZy9Db3N0SGVhZCcpO1xyXG5pbXBvcnQgQ2F0ZWdvcnkgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3Byb2plY3QvYnVpbGRpbmcvQ2F0ZWdvcnknKTtcclxuaW1wb3J0IFF1YW50aXR5ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L2J1aWxkaW5nL1F1YW50aXR5Jyk7XHJcblxyXG5pbXBvcnQgQ29uc3RhbnRzID0gcmVxdWlyZSgnLi4vc2hhcmVkL2NvbnN0YW50cycpO1xyXG5pbXBvcnQgUmF0ZUFuYWx5c2lzUmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9SYXRlQW5hbHlzaXNSZXBvc2l0b3J5Jyk7XHJcbmltcG9ydCBSYXRlQW5hbHlzaXMgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL1JhdGVBbmFseXNpcy9SYXRlQW5hbHlzaXMnKTtcclxuaW1wb3J0IHsgQXR0YWNobWVudERldGFpbHNNb2RlbCB9IGZyb20gJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9idWlsZGluZy9BdHRhY2htZW50RGV0YWlscyc7XHJcbmltcG9ydCBtZXNzYWdlcyAgPSByZXF1aXJlKCcuLi8uLi9hcHBsaWNhdGlvblByb2plY3Qvc2hhcmVkL21lc3NhZ2VzJyk7XHJcbmltcG9ydCBSQUNhdGVnb3J5ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9SYXRlQW5hbHlzaXMvUkFDYXRlZ29yeScpO1xyXG5pbXBvcnQgUkFXb3JrSXRlbSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvUmF0ZUFuYWx5c2lzL1JBV29ya0l0ZW0nKTtcclxuaW1wb3J0IFJBQ29zdEhlYWQgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL1JhdGVBbmFseXNpcy9SQUNvc3RIZWFkJyk7XHJcblxyXG5sZXQgcmVxdWVzdCA9IHJlcXVpcmUoJ3JlcXVlc3QnKTtcclxubGV0IGNvbmZpZyA9IHJlcXVpcmUoJ2NvbmZpZycpO1xyXG52YXIgbG9nNGpzID0gcmVxdWlyZSgnbG9nNGpzJyk7XHJcbnZhciBsb2dnZXIgPSBsb2c0anMuZ2V0TG9nZ2VyKCdSYXRlIEFuYWx5c2lzIFNlcnZpY2UnKTtcclxuXHJcbmxldCBDQ1Byb21pc2UgPSByZXF1aXJlKCdwcm9taXNlL2xpYi9lczYtZXh0ZW5zaW9ucycpO1xyXG5cclxuY2xhc3MgUmF0ZUFuYWx5c2lzU2VydmljZSB7XHJcbiAgQVBQX05BTUU6IHN0cmluZztcclxuICBjb21wYW55X25hbWU6IHN0cmluZztcclxuICBwcml2YXRlIGF1dGhJbnRlcmNlcHRvcjogQXV0aEludGVyY2VwdG9yO1xyXG4gIHByaXZhdGUgdXNlclNlcnZpY2U6IFVzZXJTZXJ2aWNlO1xyXG4gIHByaXZhdGUgcmF0ZUFuYWx5c2lzUmVwb3NpdG9yeTogUmF0ZUFuYWx5c2lzUmVwb3NpdG9yeTtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLkFQUF9OQU1FID0gUHJvamVjdEFzc2V0LkFQUF9OQU1FO1xyXG4gICAgdGhpcy5hdXRoSW50ZXJjZXB0b3IgPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XHJcbiAgICB0aGlzLnVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICB0aGlzLnJhdGVBbmFseXNpc1JlcG9zaXRvcnkgPSBuZXcgUmF0ZUFuYWx5c2lzUmVwb3NpdG9yeSgpO1xyXG4gIH1cclxuXHJcbiAgZ2V0Q29zdEhlYWRzKHVybDogc3RyaW5nLCB1c2VyOiBVc2VyLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUmF0ZSBBbmFseXNpcyBTZXJ2aWNlLCBnZXRDb3N0SGVhZHMgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICByZXF1ZXN0LmdldCh7dXJsOiB1cmx9LCBmdW5jdGlvbiAoZXJyb3I6IGFueSwgcmVzcG9uc2U6IGFueSwgYm9keTogYW55KSB7XHJcbiAgICAgIGlmIChlcnJvciB8fCAoIWVycm9yICYmIHJlc3BvbnNlLnN0YXR1c0NvZGUgIT09IDIwMCkgKSB7XHJcbiAgICAgICAgaWYoIWVycm9yICYmIHJlc3BvbnNlLnN0YXR1c0NvZGUgIT09IDIwMCkge1xyXG4gICAgICAgICAgY2FsbGJhY2soJ0dldCBjb3N0IEhlYWRzIHJlc3BvbnNlIE5PVCBGT1VORCcsIG51bGwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSBpZiAoIWVycm9yICYmIHJlc3BvbnNlKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ1JFU1BPTlNFIEpTT04gOiAnICsgSlNPTi5zdHJpbmdpZnkoSlNPTi5wYXJzZShib2R5KSkpO1xyXG4gICAgICAgIGxldCByZXMgPSBKU09OLnBhcnNlKGJvZHkpO1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHJlcyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0V29ya0l0ZW1zKHVybDogc3RyaW5nLCB1c2VyOiBVc2VyLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUmF0ZSBBbmFseXNpcyBTZXJ2aWNlLCBnZXRXb3JrSXRlbXMgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICByZXF1ZXN0LmdldCh7dXJsOiB1cmx9LCBmdW5jdGlvbiAoZXJyb3I6IGFueSwgcmVzcG9uc2U6IGFueSwgYm9keTogYW55KSB7XHJcbiAgICAgIGlmIChlcnJvciB8fCAoIWVycm9yICYmIHJlc3BvbnNlLnN0YXR1c0NvZGUgIT09IDIwMCkpIHtcclxuICAgICAgICBpZighZXJyb3IgJiYgcmVzcG9uc2Uuc3RhdHVzQ29kZSAhPT0gMjAwKSB7XHJcbiAgICAgICAgICBjYWxsYmFjaygnR2V0IHdvcmsgaXRlbXMgcmVzcG9uc2UgTk9UIEZPVU5EJywgbnVsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIGlmICghZXJyb3IgJiYgcmVzcG9uc2UpIHtcclxuICAgICAgICBsZXQgcmVzID0gSlNPTi5wYXJzZShib2R5KTtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCByZXMpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldFdvcmtJdGVtc0J5Q29zdEhlYWRJZCh1cmw6IHN0cmluZywgY29zdEhlYWRJZDogc3RyaW5nLCB1c2VyOiBVc2VyLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUmF0ZSBBbmFseXNpcyBTZXJ2aWNlLCBnZXRXb3JrSXRlbXNCeUNvc3RIZWFkSWQgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICBsZXQgd29ya0l0ZW1zOiBBcnJheTxXb3JrSXRlbT4gPSBbXTtcclxuICAgIHJlcXVlc3QuZ2V0KHt1cmw6IHVybH0sIGZ1bmN0aW9uIChlcnJvcjogYW55LCByZXNwb25zZTogYW55LCBib2R5OiBhbnkpIHtcclxuICAgICAgaWYgKGVycm9yIHx8ICghZXJyb3IgJiYgcmVzcG9uc2Uuc3RhdHVzQ29kZSAhPT0gMjAwKSkge1xyXG4gICAgICAgIGlmKCFlcnJvciAmJiByZXNwb25zZS5zdGF0dXNDb2RlICE9PSAyMDApIHtcclxuICAgICAgICAgIGNhbGxiYWNrKCdHZXQgd29yayBpdGVtcyBieSBjb3N0IEhlYWQgTk9UIEZPVU5EJywgbnVsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIGlmICghZXJyb3IgJiYgcmVzcG9uc2UpIHtcclxuICAgICAgICBsZXQgcmVzID0gSlNPTi5wYXJzZShib2R5KTtcclxuICAgICAgICBpZiAocmVzKSB7XHJcblxyXG4gICAgICAgICAgZm9yIChsZXQgd29ya2l0ZW0gb2YgcmVzLlN1Ykl0ZW1UeXBlKSB7XHJcbiAgICAgICAgICAgIGlmIChwYXJzZUludChjb3N0SGVhZElkKSA9PT0gd29ya2l0ZW0uQzMpIHtcclxuICAgICAgICAgICAgICBsZXQgd29ya2l0ZW1EZXRhaWxzID0gbmV3IFdvcmtJdGVtKHdvcmtpdGVtLkMyLCB3b3JraXRlbS5DMSk7XHJcbiAgICAgICAgICAgICAgd29ya0l0ZW1zLnB1c2god29ya2l0ZW1EZXRhaWxzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjYWxsYmFjayhudWxsLCB3b3JrSXRlbXMpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldEFwaUNhbGwodXJsOiBzdHJpbmcsIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzcG9uc2U6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbG9nZ2VyLmluZm8oJ2dldEFwaUNhbGwgZm9yIHJhdGVBbmFseXNpcyBoYXMgYmVlIGhpdCBmb3IgdXJsIDogJyArIHVybCk7XHJcbiAgICByZXF1ZXN0LmdldCh7dXJsOiB1cmx9LCBmdW5jdGlvbiAoZXJyb3I6IGFueSwgcmVzcG9uc2U6IGFueSwgYm9keTogYW55KSB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oZXJyb3IubWVzc2FnZSwgZXJyb3Iuc3RhY2spLCBudWxsKTtcclxuICAgICAgfSBlbHNlIGlmICghZXJyb3IgJiYgcmVzcG9uc2UpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgaWYocmVzcG9uc2Uuc3RhdHVzQ29kZSA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgIGxldCByZXMgPSBKU09OLnBhcnNlKGJvZHkpO1xyXG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCByZXMpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IGVycm9yID0gbmV3IEVycm9yKCk7XHJcbiAgICAgICAgICAgIGVycm9yLm1lc3NhZ2UgPSAnVW5hYmxlIHRvIG1ha2UgYSBnZXQgcmVxdWVzdCBmb3IgdXJsIDogJyArIHVybDtcclxuICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgbG9nZ2VyLmVycm9yKCdQcm9taXNlIGZhaWxlZCBmb3IgaW5kaXZpZHVhbCAhIHVybDonICsgdXJsICsgJzpcXG4gZXJyb3IgOicgKyBKU09OLnN0cmluZ2lmeShlcnIubWVzc2FnZSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRSYXRlKHdvcmtJdGVtSWQ6IG51bWJlciwgY2FsbGJhY2s6IChlcnJvcjogYW55LCBkYXRhOiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxldCB1cmwgPSBjb25maWcuZ2V0KCdyYXRlQW5hbHlzaXNBUEkudW5pdCcpO1xyXG4gICAgdGhpcy5nZXRBcGlDYWxsKHVybCwgKGVycm9yLCB1bml0RGF0YSkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdW5pdERhdGEgPSB1bml0RGF0YVsnVU9NJ107XHJcbiAgICAgICAgdXJsID0gY29uZmlnLmdldCgncmF0ZUFuYWx5c2lzQVBJLnJhdGUnKTtcclxuICAgICAgICB0aGlzLmdldEFwaUNhbGwodXJsLCAoZXJyb3IsIGRhdGEpID0+IHtcclxuICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgcmF0ZSA9IGRhdGFbJ1JhdGVBbmFseXNpc0RhdGEnXTtcclxuICAgICAgICAgICAgbGV0IHNxbCA9ICdTRUxFQ1QgcmF0ZS5DNSBBUyBxdWFudGl0eSwgdW5pdC5DMiBBcyB1bml0IEZST00gPyBBUyByYXRlIEpPSU4gPyBBUyB1bml0IG9uIHVuaXQuQzEgPSAgcmF0ZS5DOCBhbmQnICtcclxuICAgICAgICAgICAgICAnIHJhdGUuQzEgPSAnICsgd29ya0l0ZW1JZDtcclxuICAgICAgICAgICAgbGV0IHNxbDIgPSAnU0VMRUNUIHJhdGUuQzEgQVMgcmF0ZUFuYWx5c2lzSWQsIHJhdGUuQzIgQVMgaXRlbU5hbWUsUk9VTkQocmF0ZS5DNywyKSBBUyBxdWFudGl0eSxST1VORChyYXRlLkMzLDIpIEFTIHJhdGUsJyArXHJcbiAgICAgICAgICAgICAgJyBST1VORChyYXRlLkMzKnJhdGUuQzcsMikgQVMgdG90YWxBbW91bnQsIHJhdGUuQzYgdHlwZSwgdW5pdC5DMiBBcyB1bml0IEZST00gPyBBUyByYXRlIEpPSU4gPyBBUyB1bml0IE9OIHVuaXQuQzEgPSByYXRlLkM5JyArXHJcbiAgICAgICAgICAgICAgJyAgV0hFUkUgcmF0ZS5DMSA9ICcgKyB3b3JrSXRlbUlkO1xyXG4gICAgICAgICAgICBsZXQgc3FsMyA9ICdTRUxFQ1QgUk9VTkQoU1VNKHJhdGUuQzMqcmF0ZS5DNykgLyBTVU0ocmF0ZS5DNyksMikgQVMgdG90YWwgIEZST00gPyBBUyByYXRlIEpPSU4gPyBBUyB1bml0IE9OIHVuaXQuQzEgPSByYXRlLkM5JyArXHJcbiAgICAgICAgICAgICAgJyAgV0hFUkUgcmF0ZS5DMSA9ICcgKyB3b3JrSXRlbUlkO1xyXG4gICAgICAgICAgICBsZXQgcXVhbnRpdHlBbmRVbml0ID0gYWxhc3FsKHNxbCwgW3JhdGUsIHVuaXREYXRhXSk7XHJcbiAgICAgICAgICAgIGxldCByYXRlUmVzdWx0OiBSYXRlID0gbmV3IFJhdGUoKTtcclxuICAgICAgICAgICAgbGV0IHRvdGFscmF0ZUZyb21SYXRlQW5hbHlzaXMgPSBhbGFzcWwoc3FsMywgW3JhdGUsIHVuaXREYXRhXSk7XHJcbiAgICAgICAgICAgIHJhdGVSZXN1bHQucXVhbnRpdHkgPSBxdWFudGl0eUFuZFVuaXRbMF0ucXVhbnRpdHk7XHJcbiAgICAgICAgICAgIHJhdGVSZXN1bHQudW5pdCA9IHF1YW50aXR5QW5kVW5pdFswXS51bml0O1xyXG4gICAgICAgICAgICByYXRlUmVzdWx0LnJhdGVGcm9tUmF0ZUFuYWx5c2lzID0gcGFyc2VGbG9hdCgodG90YWxyYXRlRnJvbVJhdGVBbmFseXNpc1swXS50b3RhbCkudG9GaXhlZCgyKSk7XHJcbiAgICAgICAgICAgIHJhdGUgPSBhbGFzcWwoc3FsMiwgW3JhdGUsIHVuaXREYXRhXSk7XHJcbiAgICAgICAgICAgIHJhdGVSZXN1bHQucmF0ZUl0ZW1zID0gcmF0ZTtcclxuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgcmF0ZVJlc3VsdCk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vVE9ETyA6IERlbGV0ZSBBUEkncyByZWxhdGVkIHRvIHdvcmtpdGVtcyBhZGQsIGRlbGVldCwgZ2V0IGxpc3QuXHJcbiAgZ2V0V29ya2l0ZW1MaXN0KGNvc3RIZWFkSWQ6IG51bWJlciwgY2F0ZWdvcnlJZDogbnVtYmVyLCBjYWxsYmFjazogKGVycm9yOiBhbnksIGRhdGE6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbGV0IHVybCA9IGNvbmZpZy5nZXQoJ3JhdGVBbmFseXNpc0FQSS53b3JraXRlbScpO1xyXG4gICAgdGhpcy5nZXRBcGlDYWxsKHVybCwgKGVycm9yLCB3b3JraXRlbSkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IHNxbDogc3RyaW5nID0gJ1NFTEVDVCBDMiBBUyByYXRlQW5hbHlzaXNJZCwgQzMgQVMgbmFtZSBGUk9NID8gV0hFUkUgQzEgPSAnICsgY29zdEhlYWRJZCArICcgYW5kIEM0ID0gJyArIGNhdGVnb3J5SWQ7XHJcbiAgICAgICAgaWYgKGNhdGVnb3J5SWQgPT09IDApIHtcclxuICAgICAgICAgIHNxbCA9ICdTRUxFQ1QgQzIgQVMgcmF0ZUFuYWx5c2lzSWQsIEMzIEFTIG5hbWUgRlJPTSA/IFdIRVJFIEMxID0gJyArIGNvc3RIZWFkSWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdvcmtpdGVtID0gd29ya2l0ZW1bJ0l0ZW1zJ107XHJcbiAgICAgICAgbGV0IHdvcmtpdGVtTGlzdCA9IGFsYXNxbChzcWwsIFt3b3JraXRlbV0pO1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHdvcmtpdGVtTGlzdCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgY29udmVydENvc3RIZWFkc0Zyb21SYXRlQW5hbHlzaXNUb0Nvc3RDb250cm9sKGVudGl0eTogc3RyaW5nLCByZWdpb246IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCBkYXRhOiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdjb252ZXJ0Q29zdEhlYWRzRnJvbVJhdGVBbmFseXNpc1RvQ29zdENvbnRyb2wgaGFzIGJlZW4gaGl0Jyk7XHJcblxyXG4gICAgbGV0IGNvc3RIZWFkVVJMID0gY29uZmlnLmdldChDb25zdGFudHMuUkFURV9BTkFMWVNJU19BUEkgKyBlbnRpdHkgKyBDb25zdGFudHMuUkFURV9BTkFMWVNJU19DT1NUSEVBRFMpXHJcbiAgICAgICsgcmVnaW9uLlJlZ2lvbklkICsgY29uZmlnLmdldChDb25zdGFudHMuUkFURV9BTkFMWVNJU19BUEkgKyBDb25zdGFudHMuUkFURV9BTkFMWVNJU19BUElfRU5EUE9JTlQpO1xyXG4gICAgbGV0IGNvc3RIZWFkUmF0ZUFuYWx5c2lzUHJvbWlzZSA9IHRoaXMuY3JlYXRlUHJvbWlzZShjb3N0SGVhZFVSTCk7XHJcbiAgICBsb2dnZXIuaW5mbygnY29zdEhlYWRSYXRlQW5hbHlzaXNQcm9taXNlIGZvciBoYXMgYmVlbiBoaXQnKTtcclxuXHJcbiAgICBsZXQgY2F0ZWdvcnlVUkwgPSBjb25maWcuZ2V0KENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0FQSSArIGVudGl0eSArIENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0NBVEVHT1JJRVMpXHJcbiAgICAgICsgcmVnaW9uLlJlZ2lvbklkICsgY29uZmlnLmdldChDb25zdGFudHMuUkFURV9BTkFMWVNJU19BUEkgKyBDb25zdGFudHMuUkFURV9BTkFMWVNJU19BUElfRU5EUE9JTlQpO1xyXG4gICAgbGV0IGNhdGVnb3J5UmF0ZUFuYWx5c2lzUHJvbWlzZSA9IHRoaXMuY3JlYXRlUHJvbWlzZShjYXRlZ29yeVVSTCk7XHJcbiAgICBsb2dnZXIuaW5mbygnY2F0ZWdvcnlSYXRlQW5hbHlzaXNQcm9taXNlIGZvciBoYXMgYmVlbiBoaXQnKTtcclxuXHJcbiAgICBsZXQgd29ya0l0ZW1VUkwgPSBjb25maWcuZ2V0KENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0FQSSArIGVudGl0eSArIENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX1dPUktJVEVNUylcclxuICAgICAgKyByZWdpb24uUmVnaW9uSWQgKyBjb25maWcuZ2V0KENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0FQSSArIENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0FQSV9FTkRQT0lOVCk7XHJcbiAgICBsZXQgd29ya0l0ZW1SYXRlQW5hbHlzaXNQcm9taXNlID0gdGhpcy5jcmVhdGVQcm9taXNlKHdvcmtJdGVtVVJMKTtcclxuICAgIGxvZ2dlci5pbmZvKCd3b3JrSXRlbVJhdGVBbmFseXNpc1Byb21pc2UgZm9yIGhhcyBiZWVuIGhpdCcpO1xyXG5cclxuICAgIGxldCByYXRlSXRlbVVSTCA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfQVBJICsgZW50aXR5ICsgQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfUkFURSlcclxuICAgICAgKyByZWdpb24uUmVnaW9uSWQgKyBjb25maWcuZ2V0KENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0FQSSArIENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0FQSV9FTkRQT0lOVCk7XHJcbiAgICBsZXQgcmF0ZUl0ZW1SYXRlQW5hbHlzaXNQcm9taXNlID0gdGhpcy5jcmVhdGVQcm9taXNlKHJhdGVJdGVtVVJMKTtcclxuICAgIGxvZ2dlci5pbmZvKCdyYXRlSXRlbVJhdGVBbmFseXNpc1Byb21pc2UgZm9yIGhhcyBiZWVuIGhpdCcpO1xyXG5cclxuICAgIGxldCByYXRlQW5hbHlzaXNOb3Rlc1VSTCA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfQVBJICsgZW50aXR5ICsgQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfTk9URVMpXHJcbiAgICAgICsgcmVnaW9uLlJlZ2lvbklkICsgY29uZmlnLmdldChDb25zdGFudHMuUkFURV9BTkFMWVNJU19BUEkgKyBDb25zdGFudHMuUkFURV9BTkFMWVNJU19BUElfRU5EUE9JTlQpO1xyXG4gICAgbGV0IG5vdGVzUmF0ZUFuYWx5c2lzUHJvbWlzZSA9IHRoaXMuY3JlYXRlUHJvbWlzZShyYXRlQW5hbHlzaXNOb3Rlc1VSTCk7XHJcbiAgICBsb2dnZXIuaW5mbygnbm90ZXNSYXRlQW5hbHlzaXNQcm9taXNlIGZvciBoYXMgYmVlbiBoaXQnKTtcclxuXHJcbiAgICBsZXQgYWxsVW5pdHNGcm9tUmF0ZUFuYWx5c2lzVVJMID0gY29uZmlnLmdldChDb25zdGFudHMuUkFURV9BTkFMWVNJU19BUEkgKyBlbnRpdHkgKyBDb25zdGFudHMuUkFURV9BTkFMWVNJU19VTklUKVxyXG4gICAgICArIHJlZ2lvbi5SZWdpb25JZCArIGNvbmZpZy5nZXQoQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfQVBJICsgQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfQVBJX0VORFBPSU5UKTtcclxuICAgIGxldCB1bml0c1JhdGVBbmFseXNpc1Byb21pc2UgPSB0aGlzLmNyZWF0ZVByb21pc2UoYWxsVW5pdHNGcm9tUmF0ZUFuYWx5c2lzVVJMKTtcclxuICAgIGxvZ2dlci5pbmZvKCd1bml0c1JhdGVBbmFseXNpc1Byb21pc2UgZm9yIGhhcyBiZWVuIGhpdCcpO1xyXG5cclxuICAgIGxvZ2dlci5pbmZvKCdjYWxsaW5nIFByb21pc2UuYWxsJyk7XHJcbiAgICBDQ1Byb21pc2UuYWxsKFtcclxuICAgICAgY29zdEhlYWRSYXRlQW5hbHlzaXNQcm9taXNlLFxyXG4gICAgICBjYXRlZ29yeVJhdGVBbmFseXNpc1Byb21pc2UsXHJcbiAgICAgIHdvcmtJdGVtUmF0ZUFuYWx5c2lzUHJvbWlzZSxcclxuICAgICAgcmF0ZUl0ZW1SYXRlQW5hbHlzaXNQcm9taXNlLFxyXG4gICAgICBub3Rlc1JhdGVBbmFseXNpc1Byb21pc2UsXHJcbiAgICAgIHVuaXRzUmF0ZUFuYWx5c2lzUHJvbWlzZVxyXG4gICAgXSkudGhlbihmdW5jdGlvbiAoZGF0YTogQXJyYXk8YW55Pikge1xyXG4gICAgICBsb2dnZXIuaW5mbygnY29udmVydENvc3RIZWFkc0Zyb21SYXRlQW5hbHlzaXNUb0Nvc3RDb250cm9sIFByb21pc2UuYWxsIEFQSSBpcyBzdWNjZXNzLicpO1xyXG5cclxuICAgICAgaWYoZGF0YVswXVtDb25zdGFudHMuUkFURV9BTkFMWVNJU19JVEVNX1RZUEVdICYmIGRhdGFbMV1bQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfU1VCSVRFTV9UWVBFXSAmJlxyXG4gICAgICAgIGRhdGFbMl1bQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfSVRFTVNdICYmIGRhdGFbM11bQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfREFUQV0gJiZcclxuICAgICAgICBkYXRhWzRdW0NvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0RBVEFdICYmIGRhdGFbNV1bQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfVU9NXSkge1xyXG5cclxuICAgICAgICBsZXQgY29zdEhlYWRzUmF0ZUFuYWx5c2lzID0gZGF0YVswXVtDb25zdGFudHMuUkFURV9BTkFMWVNJU19JVEVNX1RZUEVdO1xyXG4gICAgICAgIGxldCBjYXRlZ29yaWVzUmF0ZUFuYWx5c2lzID0gZGF0YVsxXVtDb25zdGFudHMuUkFURV9BTkFMWVNJU19TVUJJVEVNX1RZUEVdO1xyXG4gICAgICAgIGxldCB3b3JrSXRlbXNSYXRlQW5hbHlzaXMgPSBkYXRhWzJdW0NvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0lURU1TXTtcclxuICAgICAgICBsZXQgcmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzID0gZGF0YVszXVtDb25zdGFudHMuUkFURV9BTkFMWVNJU19EQVRBXTtcclxuICAgICAgICBsZXQgbm90ZXNSYXRlQW5hbHlzaXMgPSBkYXRhWzRdW0NvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0RBVEFdO1xyXG4gICAgICAgIGxldCB1bml0c1JhdGVBbmFseXNpcyA9IGRhdGFbNV1bQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfVU9NXTtcclxuXHJcbiAgICAgICAgbGV0IGJ1aWxkaW5nQ29zdEhlYWRzOiBBcnJheTxDb3N0SGVhZD4gPSBbXTtcclxuICAgICAgICBsZXQgcmF0ZUFuYWx5c2lzU2VydmljZSA9IG5ldyBSYXRlQW5hbHlzaXNTZXJ2aWNlKCk7XHJcblxyXG4gICAgICAgIHJhdGVBbmFseXNpc1NlcnZpY2UuZ2V0Q29zdEhlYWRzRnJvbVJhdGVBbmFseXNpcyhjb3N0SGVhZHNSYXRlQW5hbHlzaXMsIGNhdGVnb3JpZXNSYXRlQW5hbHlzaXMsIHdvcmtJdGVtc1JhdGVBbmFseXNpcyxcclxuICAgICAgICAgIHJhdGVJdGVtc1JhdGVBbmFseXNpcywgdW5pdHNSYXRlQW5hbHlzaXMsIG5vdGVzUmF0ZUFuYWx5c2lzLCBidWlsZGluZ0Nvc3RIZWFkcyk7XHJcbiAgICAgICAgbG9nZ2VyLmluZm8oJ3N1Y2Nlc3MgaW4gIGNvbnZlcnRDb3N0SGVhZHNGcm9tUmF0ZUFuYWx5c2lzVG9Db3N0Q29udHJvbC4nKTtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCB7XHJcbiAgICAgICAgICAnYnVpbGRpbmdDb3N0SGVhZHMnOiBidWlsZGluZ0Nvc3RIZWFkcyxcclxuICAgICAgICAgICdyYXRlcyc6IHJhdGVJdGVtc1JhdGVBbmFseXNpcyxcclxuICAgICAgICAgICd1bml0cyc6IHVuaXRzUmF0ZUFuYWx5c2lzXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICB9XHJcbiAgICB9KS5jYXRjaChmdW5jdGlvbiAoZTogYW55KSB7XHJcbiAgICAgIGxvZ2dlci5lcnJvcignIFByb21pc2UgZmFpbGVkIGZvciBjb252ZXJ0Q29zdEhlYWRzRnJvbVJhdGVBbmFseXNpc1RvQ29zdENvbnRyb2wgISA6JyArIEpTT04uc3RyaW5naWZ5KGUubWVzc2FnZSkpO1xyXG4gICAgICBDQ1Byb21pc2UucmVqZWN0KGUubWVzc2FnZSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGNyZWF0ZVByb21pc2UodXJsOiBzdHJpbmcpIHtcclxuICAgIHJldHVybiBuZXcgQ0NQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlOiBhbnksIHJlamVjdDogYW55KSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdjcmVhdGVQcm9taXNlIGhhcyBiZWVuIGhpdCBmb3IgOiAnICsgdXJsKTtcclxuICAgICAgbGV0IHJhdGVBbmFseXNpc1NlcnZpY2UgPSBuZXcgUmF0ZUFuYWx5c2lzU2VydmljZSgpO1xyXG4gICAgICByYXRlQW5hbHlzaXNTZXJ2aWNlLmdldEFwaUNhbGwodXJsLCAoZXJyb3I6IGFueSwgZGF0YTogYW55KSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnRXJyb3IgaW4gY3JlYXRlUHJvbWlzZSBnZXQgZGF0YSBmcm9tIHJhdGUgYW5hbHlzaXM6ICcgKyBKU09OLnN0cmluZ2lmeShlcnJvcikpO1xyXG4gICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ2NyZWF0ZVByb21pc2UgZGF0YSBmcm9tIHJhdGUgYW5hbHlzaXMgc3VjY2Vzcy4nKTtcclxuICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlOiBhbnkpIHtcclxuICAgICAgbG9nZ2VyLmVycm9yKCdQcm9taXNlIGZhaWxlZCBmb3IgaW5kaXZpZHVhbCAhIHVybDonICsgdXJsICsgJzpcXG4gZXJyb3IgOicgKyBKU09OLnN0cmluZ2lmeShlLm1lc3NhZ2UpKTtcclxuICAgICAgQ0NQcm9taXNlLnJlamVjdChlLm1lc3NhZ2UpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRDb3N0SGVhZHNGcm9tUmF0ZUFuYWx5c2lzKGNvc3RIZWFkc1JhdGVBbmFseXNpczogYW55LCBjYXRlZ29yaWVzUmF0ZUFuYWx5c2lzOiBhbnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3b3JrSXRlbXNSYXRlQW5hbHlzaXM6IGFueSwgcmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzOiBhbnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0c1JhdGVBbmFseXNpczogYW55LCBub3Rlc1JhdGVBbmFseXNpczogYW55LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVpbGRpbmdDb3N0SGVhZHM6IEFycmF5PENvc3RIZWFkPikge1xyXG4gICAgbG9nZ2VyLmluZm8oJ2dldENvc3RIZWFkc0Zyb21SYXRlQW5hbHlzaXMgaGFzIGJlZW4gaGl0LicpO1xyXG4gICAgLy9sZXQgYnVkZ2V0Q29zdEhlYWRzID0gY29uZmlnLmdldCgnYnVkZ2V0ZWRDb3N0Rm9ybXVsYWUnKTtcclxuICAgIGZvciAobGV0IGNvc3RIZWFkSW5kZXggPSAwOyBjb3N0SGVhZEluZGV4IDwgY29zdEhlYWRzUmF0ZUFuYWx5c2lzLmxlbmd0aDsgY29zdEhlYWRJbmRleCsrKSB7XHJcblxyXG4gICAgICBpZiAoY29uZmlnLmhhcygnYnVkZ2V0ZWRDb3N0Rm9ybXVsYWUuJyArIGNvc3RIZWFkc1JhdGVBbmFseXNpc1tjb3N0SGVhZEluZGV4XS5DMikpIHtcclxuICAgICAgICBsZXQgY29zdEhlYWQgPSBuZXcgQ29zdEhlYWQoKTtcclxuICAgICAgICBjb3N0SGVhZC5uYW1lID0gY29zdEhlYWRzUmF0ZUFuYWx5c2lzW2Nvc3RIZWFkSW5kZXhdLkMyO1xyXG4gICAgICAgIGxldCBjb25maWdDb3N0SGVhZHMgPSBjb25maWcuZ2V0KCdjb25maWdDb3N0SGVhZHMnKTtcclxuICAgICAgICBsZXQgY2F0ZWdvcmllcyA9IG5ldyBBcnJheTxDYXRlZ29yeT4oKTtcclxuXHJcbiAgICAgICAgaWYgKGNvbmZpZ0Nvc3RIZWFkcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICBsZXQgaXNDb3N0SGVhZEV4aXN0U1FMID0gJ1NFTEVDVCAqIEZST00gPyBBUyB3b3JraXRlbXMgV0hFUkUgVFJJTSh3b3JraXRlbXMubmFtZSk9ID8nO1xyXG4gICAgICAgICAgbGV0IGNvc3RIZWFkRXhpc3RBcnJheSA9IGFsYXNxbChpc0Nvc3RIZWFkRXhpc3RTUUwsIFtjb25maWdDb3N0SGVhZHMsIGNvc3RIZWFkLm5hbWVdKTtcclxuICAgICAgICAgIGlmIChjb3N0SGVhZEV4aXN0QXJyYXkubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgICAgIGNvc3RIZWFkLnByaW9yaXR5SWQgPSBjb3N0SGVhZEV4aXN0QXJyYXlbMF0ucHJpb3JpdHlJZDtcclxuICAgICAgICAgICAgY2F0ZWdvcmllcyA9IGNvc3RIZWFkRXhpc3RBcnJheVswXS5jYXRlZ29yaWVzO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjb3N0SGVhZC5yYXRlQW5hbHlzaXNJZCA9IGNvc3RIZWFkc1JhdGVBbmFseXNpc1tjb3N0SGVhZEluZGV4XS5DMTtcclxuXHJcbiAgICAgICAgbGV0IGNhdGVnb3JpZXNSYXRlQW5hbHlzaXNTUUwgPSAnU0VMRUNUIENhdGVnb3J5LkMxIEFTIHJhdGVBbmFseXNpc0lkLCBDYXRlZ29yeS5DMiBBUyBuYW1lJyArXHJcbiAgICAgICAgICAnIEZST00gPyBBUyBDYXRlZ29yeSB3aGVyZSBDYXRlZ29yeS5DMyA9ICcgKyBjb3N0SGVhZC5yYXRlQW5hbHlzaXNJZDtcclxuXHJcbiAgICAgICAgbGV0IGNhdGVnb3JpZXNCeUNvc3RIZWFkID0gYWxhc3FsKGNhdGVnb3JpZXNSYXRlQW5hbHlzaXNTUUwsIFtjYXRlZ29yaWVzUmF0ZUFuYWx5c2lzXSk7XHJcbiAgICAgICAgbGV0IGJ1aWxkaW5nQ2F0ZWdvcmllczogQXJyYXk8Q2F0ZWdvcnk+ID0gbmV3IEFycmF5PENhdGVnb3J5PigpO1xyXG5cclxuICAgICAgICBpZiAoY2F0ZWdvcmllc0J5Q29zdEhlYWQubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICB0aGlzLmdldFdvcmtJdGVtc1dpdGhvdXRDYXRlZ29yeUZyb21SYXRlQW5hbHlzaXMoY29zdEhlYWQucmF0ZUFuYWx5c2lzSWQsIHdvcmtJdGVtc1JhdGVBbmFseXNpcyxcclxuICAgICAgICAgICAgcmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzLCB1bml0c1JhdGVBbmFseXNpcywgbm90ZXNSYXRlQW5hbHlzaXMsIGJ1aWxkaW5nQ2F0ZWdvcmllcywgY2F0ZWdvcmllcyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuZ2V0Q2F0ZWdvcmllc0Zyb21SYXRlQW5hbHlzaXMoY2F0ZWdvcmllc0J5Q29zdEhlYWQsIHdvcmtJdGVtc1JhdGVBbmFseXNpcyxcclxuICAgICAgICAgICAgcmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzLCB1bml0c1JhdGVBbmFseXNpcywgbm90ZXNSYXRlQW5hbHlzaXMsIGJ1aWxkaW5nQ2F0ZWdvcmllcywgY2F0ZWdvcmllcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb3N0SGVhZC5jYXRlZ29yaWVzID0gYnVpbGRpbmdDYXRlZ29yaWVzO1xyXG4gICAgICAgIGNvc3RIZWFkLnRodW1iUnVsZVJhdGUgPSBjb25maWcuZ2V0KENvbnN0YW50cy5USFVNQlJVTEVfUkFURSk7XHJcbiAgICAgICAgYnVpbGRpbmdDb3N0SGVhZHMucHVzaChjb3N0SGVhZCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ0Nvc3RIZWFkIFVuYXZhaWFsYWJlbCA6ICcgKyBjb3N0SGVhZHNSYXRlQW5hbHlzaXNbY29zdEhlYWRJbmRleF0uQzIpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXRDYXRlZ29yaWVzRnJvbVJhdGVBbmFseXNpcyhjYXRlZ29yaWVzQnlDb3N0SGVhZDogYW55LCB3b3JrSXRlbXNSYXRlQW5hbHlzaXM6IGFueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByYXRlSXRlbXNSYXRlQW5hbHlzaXM6IGFueSwgdW5pdHNSYXRlQW5hbHlzaXM6IGFueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub3Rlc1JhdGVBbmFseXNpczogYW55LCBidWlsZGluZ0NhdGVnb3JpZXM6IEFycmF5PENhdGVnb3J5PiwgY29uZmlnQ2F0ZWdvcmllczogQXJyYXk8Q2F0ZWdvcnk+KSB7XHJcblxyXG4gICAgbG9nZ2VyLmluZm8oJ2dldENhdGVnb3JpZXNGcm9tUmF0ZUFuYWx5c2lzIGhhcyBiZWVuIGhpdC4nKTtcclxuXHJcbiAgICBmb3IgKGxldCBjYXRlZ29yeUluZGV4ID0gMDsgY2F0ZWdvcnlJbmRleCA8IGNhdGVnb3JpZXNCeUNvc3RIZWFkLmxlbmd0aDsgY2F0ZWdvcnlJbmRleCsrKSB7XHJcblxyXG4gICAgICBsZXQgY2F0ZWdvcnkgPSBuZXcgQ2F0ZWdvcnkoY2F0ZWdvcmllc0J5Q29zdEhlYWRbY2F0ZWdvcnlJbmRleF0ubmFtZSwgY2F0ZWdvcmllc0J5Q29zdEhlYWRbY2F0ZWdvcnlJbmRleF0ucmF0ZUFuYWx5c2lzSWQpO1xyXG4gICAgICBsZXQgY29uZmlnV29ya0l0ZW1zID0gbmV3IEFycmF5PFdvcmtJdGVtPigpO1xyXG5cclxuICAgICAgaWYgKGNvbmZpZ0NhdGVnb3JpZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGZvciAobGV0IGNvbmZpZ0NhdGVnb3J5IG9mIGNvbmZpZ0NhdGVnb3JpZXMpIHtcclxuICAgICAgICAgIGlmIChjb25maWdDYXRlZ29yeS5uYW1lID09PSBjYXRlZ29yaWVzQnlDb3N0SGVhZFtjYXRlZ29yeUluZGV4XS5uYW1lKSB7XHJcbiAgICAgICAgICAgIGNvbmZpZ1dvcmtJdGVtcyA9IGNvbmZpZ0NhdGVnb3J5LndvcmtJdGVtcztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCB3b3JrSXRlbXNSYXRlQW5hbHlzaXNTUUwgPSAnU0VMRUNUIHdvcmtJdGVtLkMyIEFTIHJhdGVBbmFseXNpc0lkLCBUUklNKHdvcmtJdGVtLkMzKSBBUyBuYW1lJyArXHJcbiAgICAgICAgJyBGUk9NID8gQVMgd29ya0l0ZW0gd2hlcmUgd29ya0l0ZW0uQzQgPSAnICsgY2F0ZWdvcmllc0J5Q29zdEhlYWRbY2F0ZWdvcnlJbmRleF0ucmF0ZUFuYWx5c2lzSWQ7XHJcblxyXG4gICAgICBsZXQgd29ya0l0ZW1zQnlDYXRlZ29yeSA9IGFsYXNxbCh3b3JrSXRlbXNSYXRlQW5hbHlzaXNTUUwsIFt3b3JrSXRlbXNSYXRlQW5hbHlzaXNdKTtcclxuICAgICAgbGV0IGJ1aWxkaW5nV29ya0l0ZW1zOiBBcnJheTxXb3JrSXRlbT4gPSBuZXcgQXJyYXk8V29ya0l0ZW0+KCk7XHJcblxyXG4gICAgICB0aGlzLmdldFdvcmtJdGVtc0Zyb21SYXRlQW5hbHlzaXMod29ya0l0ZW1zQnlDYXRlZ29yeSwgcmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzLFxyXG4gICAgICAgIHVuaXRzUmF0ZUFuYWx5c2lzLCBub3Rlc1JhdGVBbmFseXNpcywgYnVpbGRpbmdXb3JrSXRlbXMsIGNvbmZpZ1dvcmtJdGVtcyk7XHJcblxyXG4gICAgICBjYXRlZ29yeS53b3JrSXRlbXMgPSBidWlsZGluZ1dvcmtJdGVtcztcclxuICAgICAgaWYgKGNhdGVnb3J5LndvcmtJdGVtcy5sZW5ndGggIT09IDApIHtcclxuICAgICAgICBidWlsZGluZ0NhdGVnb3JpZXMucHVzaChjYXRlZ29yeSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoY29uZmlnQ2F0ZWdvcmllcy5sZW5ndGggPiAwKSB7XHJcblxyXG4gICAgICBmb3IgKGxldCBjb25maWdDYXRlZ29yeUluZGV4ID0gMDsgY29uZmlnQ2F0ZWdvcnlJbmRleCA8IGNvbmZpZ0NhdGVnb3JpZXMubGVuZ3RoOyBjb25maWdDYXRlZ29yeUluZGV4KyspIHtcclxuICAgICAgICBsZXQgaXNDYXRlZ29yeUV4aXN0c1NRTCA9ICdTRUxFQ1QgKiBGUk9NID8gQVMgd29ya2l0ZW1zIFdIRVJFIFRSSU0od29ya2l0ZW1zLm5hbWUpPSA/JztcclxuICAgICAgICBsZXQgY2F0ZWdvcnlFeGlzdHNBcnJheSA9IGFsYXNxbChpc0NhdGVnb3J5RXhpc3RzU1FMLCBbY2F0ZWdvcmllc0J5Q29zdEhlYWQsIGNvbmZpZ0NhdGVnb3JpZXNbY29uZmlnQ2F0ZWdvcnlJbmRleF0ubmFtZV0pO1xyXG4gICAgICAgIGlmIChjYXRlZ29yeUV4aXN0c0FycmF5Lmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgbGV0IGNvbmZpZ0NhdCA9IG5ldyBDYXRlZ29yeShjb25maWdDYXRlZ29yaWVzW2NvbmZpZ0NhdGVnb3J5SW5kZXhdLm5hbWUsIGNvbmZpZ0NhdGVnb3JpZXNbY29uZmlnQ2F0ZWdvcnlJbmRleF0ucmF0ZUFuYWx5c2lzSWQpO1xyXG4gICAgICAgICAgY29uZmlnQ2F0LndvcmtJdGVtcyA9IHRoaXMuZ2V0V29ya2l0ZW1zRm9yQ29uZmlnQ2F0ZWdvcnkoY29uZmlnQ2F0ZWdvcmllc1tjb25maWdDYXRlZ29yeUluZGV4XS53b3JrSXRlbXMpO1xyXG4gICAgICAgICAgaWYgKGNvbmZpZ0NhdC53b3JrSXRlbXMubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgICAgIGJ1aWxkaW5nQ2F0ZWdvcmllcy5wdXNoKGNvbmZpZ0NhdCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXRXb3JraXRlbXNGb3JDb25maWdDYXRlZ29yeShjb25maWdXb3JraXRlbXM6IGFueSkge1xyXG4gICAgbGV0IHdvcmtJdGVtc0xpc3QgPSBuZXcgQXJyYXk8V29ya0l0ZW0+KCk7XHJcbiAgICBmb3IgKGxldCB3b3JraXRlbUluZGV4ID0gMDsgd29ya2l0ZW1JbmRleCA8IGNvbmZpZ1dvcmtpdGVtcy5sZW5ndGg7IHdvcmtpdGVtSW5kZXgrKykge1xyXG4gICAgICBsZXQgY29uZmlnV29ya2l0ZW0gPSB0aGlzLmNvbnZlcnRDb25maWdvcmtpdGVtKGNvbmZpZ1dvcmtpdGVtc1t3b3JraXRlbUluZGV4XSk7XHJcbiAgICAgIHdvcmtJdGVtc0xpc3QucHVzaChjb25maWdXb3JraXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gd29ya0l0ZW1zTGlzdDtcclxuICB9XHJcblxyXG4gIGdldFdvcmtJdGVtc1dpdGhvdXRDYXRlZ29yeUZyb21SYXRlQW5hbHlzaXMoY29zdEhlYWRSYXRlQW5hbHlzaXNJZDogbnVtYmVyLCB3b3JrSXRlbXNSYXRlQW5hbHlzaXM6IGFueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJhdGVJdGVtc1JhdGVBbmFseXNpczogYW55LCB1bml0c1JhdGVBbmFseXNpczogYW55LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm90ZXNSYXRlQW5hbHlzaXM6IGFueSwgYnVpbGRpbmdDYXRlZ29yaWVzOiBBcnJheTxDYXRlZ29yeT4sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWdDYXRlZ29yaWVzOiBBcnJheTxDYXRlZ29yeT4pIHtcclxuXHJcbiAgICBsb2dnZXIuaW5mbygnZ2V0V29ya0l0ZW1zV2l0aG91dENhdGVnb3J5RnJvbVJhdGVBbmFseXNpcyBoYXMgYmVlbiBoaXQuJyk7XHJcblxyXG4gICAgbGV0IHdvcmtJdGVtc1dpdGhvdXRDYXRlZ29yaWVzUmF0ZUFuYWx5c2lzU1FMID0gJ1NFTEVDVCB3b3JrSXRlbS5DMiBBUyByYXRlQW5hbHlzaXNJZCwgd29ya0l0ZW0uQzMgQVMgbmFtZScgK1xyXG4gICAgICAnIEZST00gPyBBUyB3b3JrSXRlbSB3aGVyZSBOT1Qgd29ya0l0ZW0uQzQgQU5EIHdvcmtJdGVtLkMxID0gJyArIGNvc3RIZWFkUmF0ZUFuYWx5c2lzSWQ7XHJcbiAgICBsZXQgd29ya0l0ZW1zV2l0aG91dENhdGVnb3JpZXMgPSBhbGFzcWwod29ya0l0ZW1zV2l0aG91dENhdGVnb3JpZXNSYXRlQW5hbHlzaXNTUUwsIFt3b3JrSXRlbXNSYXRlQW5hbHlzaXNdKTtcclxuXHJcbiAgICBsZXQgYnVpbGRpbmdXb3JrSXRlbXM6IEFycmF5PFdvcmtJdGVtPiA9IG5ldyBBcnJheTxXb3JrSXRlbT4oKTtcclxuICAgIGxldCBjYXRlZ29yeSA9IG5ldyBDYXRlZ29yeSgnV29yayBJdGVtcycsIDApO1xyXG4gICAgbGV0IGNvbmZpZ1dvcmtJdGVtcyA9IG5ldyBBcnJheTxXb3JrSXRlbT4oKTtcclxuXHJcbiAgICBpZiAoY29uZmlnQ2F0ZWdvcmllcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGZvciAobGV0IGNvbmZpZ0NhdGVnb3J5IG9mIGNvbmZpZ0NhdGVnb3JpZXMpIHtcclxuICAgICAgICBpZiAoY29uZmlnQ2F0ZWdvcnkubmFtZSA9PT0gJ1dvcmsgSXRlbXMnKSB7XHJcbiAgICAgICAgICBjb25maWdXb3JrSXRlbXMgPSBjb25maWdDYXRlZ29yeS53b3JrSXRlbXM7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5nZXRXb3JrSXRlbXNGcm9tUmF0ZUFuYWx5c2lzKHdvcmtJdGVtc1dpdGhvdXRDYXRlZ29yaWVzLCByYXRlSXRlbXNSYXRlQW5hbHlzaXMsXHJcbiAgICAgIHVuaXRzUmF0ZUFuYWx5c2lzLCBub3Rlc1JhdGVBbmFseXNpcywgYnVpbGRpbmdXb3JrSXRlbXMsIGNvbmZpZ1dvcmtJdGVtcyk7XHJcblxyXG4gICAgY2F0ZWdvcnkud29ya0l0ZW1zID0gYnVpbGRpbmdXb3JrSXRlbXM7XHJcbiAgICBidWlsZGluZ0NhdGVnb3JpZXMucHVzaChjYXRlZ29yeSk7XHJcbiAgfVxyXG5cclxuICBzeW5jUmF0ZWl0ZW1Gcm9tUmF0ZUFuYWx5c2lzKGVudGl0eTogc3RyaW5nLCBidWlsZGluZ0RldGFpbHM6IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCBkYXRhOiBhbnkpID0+IHZvaWQpIHtcclxuXHJcbiAgICBsZXQgcmF0ZUl0ZW1VUkwgPSBjb25maWcuZ2V0KENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0FQSSArIGVudGl0eSArIENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX1JBVEUpO1xyXG4gICAgbGV0IHJhdGVJdGVtUmF0ZUFuYWx5c2lzUHJvbWlzZSA9IHRoaXMuY3JlYXRlUHJvbWlzZShyYXRlSXRlbVVSTCk7XHJcbiAgICBsb2dnZXIuaW5mbygncmF0ZUl0ZW1SYXRlQW5hbHlzaXNQcm9taXNlIGZvciBoYXMgYmVlbiBoaXQnKTtcclxuXHJcbiAgICBsZXQgcmF0ZUFuYWx5c2lzTm90ZXNVUkwgPSBjb25maWcuZ2V0KENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0FQSSArIGVudGl0eSArIENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX05PVEVTKTtcclxuICAgIGxldCBub3Rlc1JhdGVBbmFseXNpc1Byb21pc2UgPSB0aGlzLmNyZWF0ZVByb21pc2UocmF0ZUFuYWx5c2lzTm90ZXNVUkwpO1xyXG4gICAgbG9nZ2VyLmluZm8oJ25vdGVzUmF0ZUFuYWx5c2lzUHJvbWlzZSBmb3IgaGFzIGJlZW4gaGl0Jyk7XHJcblxyXG4gICAgbGV0IGFsbFVuaXRzRnJvbVJhdGVBbmFseXNpc1VSTCA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfQVBJICsgZW50aXR5ICsgQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfVU5JVCk7XHJcbiAgICBsZXQgdW5pdHNSYXRlQW5hbHlzaXNQcm9taXNlID0gdGhpcy5jcmVhdGVQcm9taXNlKGFsbFVuaXRzRnJvbVJhdGVBbmFseXNpc1VSTCk7XHJcbiAgICBsb2dnZXIuaW5mbygndW5pdHNSYXRlQW5hbHlzaXNQcm9taXNlIGZvciBoYXMgYmVlbiBoaXQnKTtcclxuXHJcbiAgICBsZXQgY29zdEhlYWRVUkwgPSBjb25maWcuZ2V0KENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0FQSSArIGVudGl0eSArIENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0NPU1RIRUFEUyk7XHJcbiAgICBsZXQgY29zdEhlYWRSYXRlQW5hbHlzaXNQcm9taXNlID0gdGhpcy5jcmVhdGVQcm9taXNlKGNvc3RIZWFkVVJMKTtcclxuICAgIGxvZ2dlci5pbmZvKCdjb3N0SGVhZFJhdGVBbmFseXNpc1Byb21pc2UgZm9yIGhhcyBiZWVuIGhpdCcpO1xyXG5cclxuICAgIENDUHJvbWlzZS5hbGwoW1xyXG4gICAgICByYXRlSXRlbVJhdGVBbmFseXNpc1Byb21pc2UsXHJcbiAgICAgIG5vdGVzUmF0ZUFuYWx5c2lzUHJvbWlzZSxcclxuICAgICAgdW5pdHNSYXRlQW5hbHlzaXNQcm9taXNlLFxyXG4gICAgICBjb3N0SGVhZFJhdGVBbmFseXNpc1Byb21pc2VcclxuICAgIF0pLnRoZW4oZnVuY3Rpb24gKGRhdGE6IEFycmF5PGFueT4pIHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ2NvbnZlcnRDb3N0SGVhZHNGcm9tUmF0ZUFuYWx5c2lzVG9Db3N0Q29udHJvbCBQcm9taXNlLmFsbCBBUEkgaXMgc3VjY2Vzcy4nKTtcclxuICAgICAgbG9nZ2VyLmluZm8oJ3N1Y2Nlc3MgaW4gIGNvbnZlcnRDb3N0SGVhZHNGcm9tUmF0ZUFuYWx5c2lzVG9Db3N0Q29udHJvbC4nKTtcclxuICAgICAgY2FsbGJhY2sobnVsbCwgZGF0YSk7XHJcbiAgICB9KS5jYXRjaChmdW5jdGlvbiAoZTogYW55KSB7XHJcbiAgICAgIGxvZ2dlci5lcnJvcignIFByb21pc2UgZmFpbGVkIGZvciBjb252ZXJ0Q29zdEhlYWRzRnJvbVJhdGVBbmFseXNpc1RvQ29zdENvbnRyb2wgISA6JyArIGUubWVzc2FnZSk7XHJcbiAgICAgIENDUHJvbWlzZS5yZWplY3QoZS5tZXNzYWdlKTtcclxuICAgIH0pO1xyXG5cclxuICB9XHJcblxyXG4gIGdldFdvcmtJdGVtc0Zyb21SYXRlQW5hbHlzaXMod29ya0l0ZW1zQnlDYXRlZ29yeTogYW55LCByYXRlSXRlbXNSYXRlQW5hbHlzaXM6IGFueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRzUmF0ZUFuYWx5c2lzOiBhbnksIG5vdGVzUmF0ZUFuYWx5c2lzOiBhbnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWlsZGluZ1dvcmtJdGVtczogQXJyYXk8V29ya0l0ZW0+LCBjb25maWdXb3JrSXRlbXM6IEFycmF5PGFueT4pIHtcclxuXHJcbiAgICBsb2dnZXIuaW5mbygnZ2V0V29ya0l0ZW1zRnJvbVJhdGVBbmFseXNpcyBoYXMgYmVlbiBoaXQuJyk7XHJcbiAgICBmb3IgKGxldCBjYXRlZ29yeVdvcmtpdGVtIG9mIHdvcmtJdGVtc0J5Q2F0ZWdvcnkpIHtcclxuICAgICAgbGV0IHdvcmtJdGVtID0gdGhpcy5nZXRSYXRlQW5hbHlzaXMoY2F0ZWdvcnlXb3JraXRlbSwgY29uZmlnV29ya0l0ZW1zLCByYXRlSXRlbXNSYXRlQW5hbHlzaXMsXHJcbiAgICAgICAgdW5pdHNSYXRlQW5hbHlzaXMsIG5vdGVzUmF0ZUFuYWx5c2lzKTtcclxuICAgICAgaWYgKHdvcmtJdGVtKSB7XHJcbiAgICAgICAgYnVpbGRpbmdXb3JrSXRlbXMucHVzaCh3b3JrSXRlbSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGZvciAobGV0IGNvbmZpZ1dvcmtJdGVtIG9mIGNvbmZpZ1dvcmtJdGVtcykge1xyXG4gICAgICBsZXQgaXNXb3JrSXRlbUV4aXN0U1FMID0gJ1NFTEVDVCAqIEZST00gPyBBUyB3b3JraXRlbXMgV0hFUkUgVFJJTSh3b3JraXRlbXMubmFtZSk9ID8nO1xyXG4gICAgICBsZXQgd29ya0l0ZW1FeGlzdEFycmF5ID0gYWxhc3FsKGlzV29ya0l0ZW1FeGlzdFNRTCwgW3dvcmtJdGVtc0J5Q2F0ZWdvcnksIGNvbmZpZ1dvcmtJdGVtLm5hbWVdKTtcclxuICAgICAgaWYgKHdvcmtJdGVtRXhpc3RBcnJheS5sZW5ndGggPT09IDAgJiYgY29uZmlnV29ya0l0ZW0ucmF0ZUFuYWx5c2lzSWQpIHtcclxuICAgICAgICBsZXQgd29ya2l0ZW0gPSB0aGlzLmNvbnZlcnRDb25maWdvcmtpdGVtKGNvbmZpZ1dvcmtJdGVtKTtcclxuICAgICAgICBidWlsZGluZ1dvcmtJdGVtcy5wdXNoKHdvcmtpdGVtKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY29udmVydENvbmZpZ29ya2l0ZW0oY29uZmlnV29ya0l0ZW06IGFueSkge1xyXG5cclxuICAgIGxldCB3b3JrSXRlbSA9IG5ldyBXb3JrSXRlbShjb25maWdXb3JrSXRlbS5uYW1lLCBjb25maWdXb3JrSXRlbS5yYXRlQW5hbHlzaXNJZCk7XHJcbiAgICB3b3JrSXRlbS5pc0RpcmVjdFJhdGUgPSAhY29uZmlnV29ya0l0ZW0uaXNSYXRlQW5hbHlzaXM7XHJcbiAgICB3b3JrSXRlbS5pc1JhdGVBbmFseXNpcyA9IGNvbmZpZ1dvcmtJdGVtLmlzUmF0ZUFuYWx5c2lzO1xyXG4gICAgd29ya0l0ZW0uaXNNZWFzdXJlbWVudFNoZWV0ID0gY29uZmlnV29ya0l0ZW0uaXNNZWFzdXJlbWVudFNoZWV0O1xyXG4gICAgd29ya0l0ZW0uaXNTdGVlbFdvcmtJdGVtID0gY29uZmlnV29ya0l0ZW0uaXNTdGVlbFdvcmtJdGVtO1xyXG4gICAgd29ya0l0ZW0ucmF0ZUFuYWx5c2lzUGVyVW5pdCA9IGNvbmZpZ1dvcmtJdGVtLnJhdGVBbmFseXNpc1BlclVuaXQ7XHJcbiAgICB3b3JrSXRlbS5yYXRlQW5hbHlzaXNVbml0ID0gY29uZmlnV29ya0l0ZW0ucmF0ZUFuYWx5c2lzVW5pdDtcclxuICAgIHdvcmtJdGVtLmlzSXRlbUJyZWFrZG93blJlcXVpcmVkID0gY29uZmlnV29ya0l0ZW0uaXNJdGVtQnJlYWtkb3duUmVxdWlyZWQ7XHJcbiAgICB3b3JrSXRlbS5sZW5ndGggPSBjb25maWdXb3JrSXRlbS5sZW5ndGg7XHJcbiAgICB3b3JrSXRlbS5icmVhZHRoT3JXaWR0aCA9IGNvbmZpZ1dvcmtJdGVtLmJyZWFkdGhPcldpZHRoO1xyXG4gICAgd29ya0l0ZW0uaGVpZ2h0ID0gY29uZmlnV29ya0l0ZW0uaGVpZ2h0O1xyXG4gICAgd29ya0l0ZW0udW5pdCA9IGNvbmZpZ1dvcmtJdGVtLm1lYXN1cmVtZW50VW5pdDtcclxuXHJcbiAgICBpZiAoIWNvbmZpZ1dvcmtJdGVtLmlzUmF0ZUFuYWx5c2lzKSB7XHJcbiAgICAgIHdvcmtJdGVtLnJhdGUudG90YWwgPSBjb25maWdXb3JrSXRlbS5kaXJlY3RSYXRlO1xyXG4gICAgICB3b3JrSXRlbS5yYXRlLnVuaXQgPSBjb25maWdXb3JrSXRlbS5kaXJlY3RSYXRlUGVyVW5pdDtcclxuICAgICAgd29ya0l0ZW0ucmF0ZS5pc0VzdGltYXRlZCA9IHRydWU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBsb2dnZXIuZXJyb3IoJ1dvcmtJdGVtIGVycm9yIGZvciByYXRlQW5hbHlzaXMgOiAnICsgY29uZmlnV29ya0l0ZW0ubmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHdvcmtJdGVtO1xyXG4gIH1cclxuXHJcbiAgZ2V0UmF0ZUFuYWx5c2lzKGNhdGVnb3J5V29ya2l0ZW06IFdvcmtJdGVtLCBjb25maWdXb3JrSXRlbXM6IEFycmF5PGFueT4sIHJhdGVJdGVtc1JhdGVBbmFseXNpczogYW55LFxyXG4gICAgICAgICAgICAgICAgICB1bml0c1JhdGVBbmFseXNpczogYW55LCBub3Rlc1JhdGVBbmFseXNpczogYW55KSB7XHJcblxyXG4gICAgbGV0IGlzV29ya0l0ZW1FeGlzdFNRTCA9ICdTRUxFQ1QgKiBGUk9NID8gQVMgd29ya2l0ZW1zIFdIRVJFIFRSSU0od29ya2l0ZW1zLm5hbWUpPSA/JztcclxuICAgIGxldCB3b3JrSXRlbUV4aXN0QXJyYXkgPSBhbGFzcWwoaXNXb3JrSXRlbUV4aXN0U1FMLCBbY29uZmlnV29ya0l0ZW1zLCBjYXRlZ29yeVdvcmtpdGVtLm5hbWVdKTtcclxuXHJcbiAgICBpZiAod29ya0l0ZW1FeGlzdEFycmF5Lmxlbmd0aCAhPT0gMCkge1xyXG5cclxuICAgICAgbGV0IHdvcmtJdGVtID0gbmV3IFdvcmtJdGVtKGNhdGVnb3J5V29ya2l0ZW0ubmFtZSwgY2F0ZWdvcnlXb3JraXRlbS5yYXRlQW5hbHlzaXNJZCk7XHJcblxyXG4gICAgICBpZiAoY2F0ZWdvcnlXb3JraXRlbS5hY3RpdmUgIT09IHVuZGVmaW5lZCAmJiBjYXRlZ29yeVdvcmtpdGVtLmFjdGl2ZSAhPT0gbnVsbCkge1xyXG4gICAgICAgIHdvcmtJdGVtID0gY2F0ZWdvcnlXb3JraXRlbTtcclxuICAgICAgfVxyXG5cclxuICAgICAgd29ya0l0ZW0udW5pdCA9IHdvcmtJdGVtRXhpc3RBcnJheVswXS5tZWFzdXJlbWVudFVuaXQ7XHJcbiAgICAgIHdvcmtJdGVtLmlzTWVhc3VyZW1lbnRTaGVldCA9IHdvcmtJdGVtRXhpc3RBcnJheVswXS5pc01lYXN1cmVtZW50U2hlZXQ7XHJcbiAgICAgIHdvcmtJdGVtLmlzUmF0ZUFuYWx5c2lzID0gd29ya0l0ZW1FeGlzdEFycmF5WzBdLmlzUmF0ZUFuYWx5c2lzO1xyXG4gICAgICB3b3JrSXRlbS5pc1N0ZWVsV29ya0l0ZW0gPSB3b3JrSXRlbUV4aXN0QXJyYXlbMF0uaXNTdGVlbFdvcmtJdGVtO1xyXG4gICAgICB3b3JrSXRlbS5yYXRlQW5hbHlzaXNQZXJVbml0ID0gd29ya0l0ZW1FeGlzdEFycmF5WzBdLnJhdGVBbmFseXNpc1BlclVuaXQ7XHJcbiAgICAgIHdvcmtJdGVtLmlzSXRlbUJyZWFrZG93blJlcXVpcmVkID0gd29ya0l0ZW1FeGlzdEFycmF5WzBdLmlzSXRlbUJyZWFrZG93blJlcXVpcmVkO1xyXG4gICAgICB3b3JrSXRlbS5sZW5ndGggPSB3b3JrSXRlbUV4aXN0QXJyYXlbMF0ubGVuZ3RoO1xyXG4gICAgICB3b3JrSXRlbS5icmVhZHRoT3JXaWR0aCA9IHdvcmtJdGVtRXhpc3RBcnJheVswXS5icmVhZHRoT3JXaWR0aDtcclxuICAgICAgd29ya0l0ZW0uaGVpZ2h0ID0gd29ya0l0ZW1FeGlzdEFycmF5WzBdLmhlaWdodDtcclxuXHJcbiAgICAgIGxldCByYXRlSXRlbXNSYXRlQW5hbHlzaXNTUUwgPSAnU0VMRUNUIHJhdGVJdGVtLkMyIEFTIGl0ZW1OYW1lLCByYXRlSXRlbS5DMiBBUyBvcmlnaW5hbEl0ZW1OYW1lLCcgK1xyXG4gICAgICAgICdyYXRlSXRlbS5DMTIgQVMgcmF0ZUFuYWx5c2lzSWQsIHJhdGVJdGVtLkM2IEFTIHR5cGUsJyArXHJcbiAgICAgICAgJ1JPVU5EKHJhdGVJdGVtLkM3LDIpIEFTIHF1YW50aXR5LCBST1VORChyYXRlSXRlbS5DMywyKSBBUyByYXRlLCB1bml0LkMyIEFTIHVuaXQsJyArXHJcbiAgICAgICAgJ1JPVU5EKHJhdGVJdGVtLkMzICogcmF0ZUl0ZW0uQzcsMikgQVMgdG90YWxBbW91bnQsIHJhdGVJdGVtLkM1IEFTIHRvdGFsUXVhbnRpdHksIHJhdGVJdGVtLkMxMyBBUyBub3Rlc1JhdGVBbmFseXNpc0lkICAnICtcclxuICAgICAgICAnRlJPTSA/IEFTIHJhdGVJdGVtIEpPSU4gPyBBUyB1bml0IE9OIHVuaXQuQzEgPSByYXRlSXRlbS5DOSB3aGVyZSByYXRlSXRlbS5DMSA9ICdcclxuICAgICAgICArIGNhdGVnb3J5V29ya2l0ZW0ucmF0ZUFuYWx5c2lzSWQ7XHJcbiAgICAgIGxldCByYXRlSXRlbXNCeVdvcmtJdGVtID0gYWxhc3FsKHJhdGVJdGVtc1JhdGVBbmFseXNpc1NRTCwgW3JhdGVJdGVtc1JhdGVBbmFseXNpcywgdW5pdHNSYXRlQW5hbHlzaXNdKTtcclxuICAgICAgbGV0IG5vdGVzID0gJyc7XHJcbiAgICAgIGxldCBpbWFnZVVSTCA9ICcnO1xyXG4gICAgICB3b3JrSXRlbS5yYXRlLnJhdGVJdGVtcyA9IHJhdGVJdGVtc0J5V29ya0l0ZW07XHJcbiAgICAgIHdvcmtJdGVtLnJhdGUudW5pdCA9IHdvcmtJdGVtRXhpc3RBcnJheVswXS5yYXRlQW5hbHlzaXNVbml0O1xyXG5cclxuICAgICAgaWYgKHJhdGVJdGVtc0J5V29ya0l0ZW0gJiYgcmF0ZUl0ZW1zQnlXb3JrSXRlbS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgbGV0IG5vdGVzUmF0ZUFuYWx5c2lzU1FMID0gJ1NFTEVDVCBub3Rlcy5DMiBBUyBub3Rlcywgbm90ZXMuQzMgQVMgaW1hZ2VVUkwgRlJPTSA/IEFTIG5vdGVzIHdoZXJlIG5vdGVzLkMxID0gJyArXHJcbiAgICAgICAgICByYXRlSXRlbXNCeVdvcmtJdGVtWzBdLm5vdGVzUmF0ZUFuYWx5c2lzSWQ7XHJcbiAgICAgICAgbGV0IG5vdGVzTGlzdCA9IGFsYXNxbChub3Rlc1JhdGVBbmFseXNpc1NRTCwgW25vdGVzUmF0ZUFuYWx5c2lzXSk7XHJcbiAgICAgICAgbm90ZXMgPSBub3Rlc0xpc3RbMF0ubm90ZXM7XHJcbiAgICAgICAgaW1hZ2VVUkwgPSBub3Rlc0xpc3RbMF0uaW1hZ2VVUkw7XHJcblxyXG4gICAgICAgIHdvcmtJdGVtLnJhdGUucXVhbnRpdHkgPSByYXRlSXRlbXNCeVdvcmtJdGVtWzBdLnRvdGFsUXVhbnRpdHk7XHJcbiAgICAgICAgd29ya0l0ZW0uc3lzdGVtUmF0ZS5xdWFudGl0eSA9IHJhdGVJdGVtc0J5V29ya0l0ZW1bMF0udG90YWxRdWFudGl0eTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB3b3JrSXRlbS5yYXRlLnF1YW50aXR5ID0gMTtcclxuICAgICAgICB3b3JrSXRlbS5zeXN0ZW1SYXRlLnF1YW50aXR5ID0gMTtcclxuICAgICAgfVxyXG4gICAgICB3b3JrSXRlbS5yYXRlLmlzRXN0aW1hdGVkID0gdHJ1ZTtcclxuICAgICAgd29ya0l0ZW0ucmF0ZS5ub3RlcyA9IG5vdGVzO1xyXG4gICAgICB3b3JrSXRlbS5yYXRlLmltYWdlVVJMID0gaW1hZ2VVUkw7XHJcblxyXG4gICAgICAvL1N5c3RlbSByYXRlXHJcblxyXG4gICAgICB3b3JrSXRlbS5zeXN0ZW1SYXRlLnJhdGVJdGVtcyA9IHJhdGVJdGVtc0J5V29ya0l0ZW07XHJcbiAgICAgIHdvcmtJdGVtLnN5c3RlbVJhdGUubm90ZXMgPSBub3RlcztcclxuICAgICAgd29ya0l0ZW0uc3lzdGVtUmF0ZS5pbWFnZVVSTCA9IGltYWdlVVJMO1xyXG4gICAgICByZXR1cm4gd29ya0l0ZW07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG4gIHN5bmNBbGxSZWdpb25zKCkge1xyXG4gICAgbGV0IHJlZ2lvbk9iaiA9IHtcclxuICAgICAgJ1JlZ2lvbklkJyA6IDEsXHJcbiAgICAgICdSZWdpb25Db2RlJyA6ICdNSCcsXHJcbiAgICAgICdSZWdpb24nIDogJ01haGFyYXNodHJhIFB1bmUgQ2lyY2xlJ1xyXG4gICAgfTtcclxuICAgIHRoaXMuU3luY1JhdGVBbmFseXNpcyhyZWdpb25PYmopO1xyXG4gICAgLyp0aGlzLmdldEFsbHJlZ2lvbnNGcm9tUmF0ZUFuYWx5c2lzKChlcnJvciwgcmVzcG9uc2UpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2Vycm9yIDogJyArIEpTT04uc3RyaW5naWZ5KGVycm9yKSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ3Jlc3BvbnNlIDogJyArIEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlKSk7XHJcbiAgICAgICAgZm9yIChsZXQgcmVnaW9uIG9mIHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICB0aGlzLlN5bmNSYXRlQW5hbHlzaXMocmVnaW9uKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pOyovXHJcbiAgfVxyXG5cclxuICBTeW5jUmF0ZUFuYWx5c2lzKHJlZ2lvbjogYW55KSB7XHJcbiAgICBsZXQgcmF0ZUFuYWx5c2lzU2VydmljZSA9IG5ldyBSYXRlQW5hbHlzaXNTZXJ2aWNlKCk7XHJcbiAgICB0aGlzLmNvbnZlcnRDb3N0SGVhZHNGcm9tUmF0ZUFuYWx5c2lzVG9Db3N0Q29udHJvbChDb25zdGFudHMuQlVJTERJTkcsIHJlZ2lvbiwgKGVycm9yOiBhbnksIGJ1aWxkaW5nRGF0YTogYW55KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGxvZ2dlci5lcnJvcignUmF0ZUFuYWx5c2lzIFN5bmMgRmFpbGVkLicpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuY29udmVydENvc3RIZWFkc0Zyb21SYXRlQW5hbHlzaXNUb0Nvc3RDb250cm9sKENvbnN0YW50cy5CVUlMRElORywgcmVnaW9uLCAoZXJyb3I6IGFueSwgcHJvamVjdERhdGE6IGFueSkgPT4ge1xyXG4gICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGxvZ2dlci5lcnJvcignUmF0ZUFuYWx5c2lzIFN5bmMgRmFpbGVkLicpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IGJ1aWxkaW5nQ29zdEhlYWRzID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShidWlsZGluZ0RhdGEuYnVpbGRpbmdDb3N0SGVhZHMpKTtcclxuICAgICAgICAgICAgbGV0IHByb2plY3RDb3N0SGVhZHMgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHByb2plY3REYXRhLmJ1aWxkaW5nQ29zdEhlYWRzKSk7XHJcbiAgICAgICAgICAgIGxldCBjb25maWdDb3N0SGVhZHMgPSBjb25maWcuZ2V0KCdjb25maWdDb3N0SGVhZHMnKTtcclxuICAgICAgICAgICAgbGV0IGNvbmZpZ1Byb2plY3RDb3N0SGVhZHMgPSBjb25maWcuZ2V0KCdjb25maWdQcm9qZWN0Q29zdEhlYWRzJyk7XHJcbiAgICAgICAgICAgIGxldCBmaXhlZENvc3RDb25maWdQcm9qZWN0Q29zdEhlYWRzID0gY29uZmlnLmdldCgnZml4ZWRDb3N0Q29uZmlnUHJvamVjdENvc3RIZWFkcycpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnZlcnRDb25maWdDb3N0SGVhZHMoY29uZmlnQ29zdEhlYWRzLCBidWlsZGluZ0Nvc3RIZWFkcyk7XHJcbiAgICAgICAgICAgIHRoaXMuY29udmVydENvbmZpZ0Nvc3RIZWFkcyhjb25maWdQcm9qZWN0Q29zdEhlYWRzLCBwcm9qZWN0Q29zdEhlYWRzKTtcclxuICAgICAgICAgICAgdGhpcy5jb252ZXJ0Q29uZmlnQ29zdEhlYWRzKGZpeGVkQ29zdENvbmZpZ1Byb2plY3RDb3N0SGVhZHMsIHByb2plY3RDb3N0SGVhZHMpO1xyXG4gICAgICAgICAgICBidWlsZGluZ0Nvc3RIZWFkcyA9IGFsYXNxbCgnU0VMRUNUICogRlJPTSA/IE9SREVSIEJZIHByaW9yaXR5SWQnLCBbYnVpbGRpbmdDb3N0SGVhZHNdKTtcclxuICAgICAgICAgICAgcHJvamVjdENvc3RIZWFkcyA9IGFsYXNxbCgnU0VMRUNUICogRlJPTSA/IE9SREVSIEJZIHByaW9yaXR5SWQnLCBbcHJvamVjdENvc3RIZWFkc10pO1xyXG4gICAgICAgICAgICBsZXQgYnVpbGRpbmdSYXRlcyA9IHRoaXMuZ2V0UmF0ZXMoYnVpbGRpbmdEYXRhLCBidWlsZGluZ0Nvc3RIZWFkcyk7XHJcbiAgICAgICAgICAgIGxldCBwcm9qZWN0UmF0ZXMgPSB0aGlzLmdldFJhdGVzKHByb2plY3REYXRhLCBwcm9qZWN0Q29zdEhlYWRzKTtcclxuICAgICAgICAgICAgbGV0IHJhdGVBbmFseXNpcyA9IG5ldyBSYXRlQW5hbHlzaXMoYnVpbGRpbmdDb3N0SGVhZHMsIGJ1aWxkaW5nUmF0ZXMsIHByb2plY3RDb3N0SGVhZHMsIHByb2plY3RSYXRlcyk7XHJcbiAgICAgICAgICAgIHRoaXMuc2F2ZVJhdGVBbmFseXNpcyhyYXRlQW5hbHlzaXMsIHJlZ2lvbik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgY29udmVydENvbmZpZ0Nvc3RIZWFkcyhjb25maWdDb3N0SGVhZHM6IEFycmF5PGFueT4sIGNvc3RIZWFkc0RhdGE6IEFycmF5PENvc3RIZWFkPikge1xyXG5cclxuICAgIGZvciAobGV0IGNvbmZpZ0Nvc3RIZWFkIG9mIGNvbmZpZ0Nvc3RIZWFkcykge1xyXG5cclxuICAgICAgbGV0IGNvc3RIZWFkRXhpc3RTUUwgPSAnU0VMRUNUICogRlJPTSA/IEFTIGNvc3RIZWFkcyBXSEVSRSBjb3N0SGVhZHMubmFtZT0gPyc7XHJcbiAgICAgIGxldCBjb3N0SGVhZEV4aXN0QXJyYXkgPSBhbGFzcWwoY29zdEhlYWRFeGlzdFNRTCwgW2Nvc3RIZWFkc0RhdGEsIGNvbmZpZ0Nvc3RIZWFkLm5hbWVdKTtcclxuXHJcbiAgICAgIGlmIChjb3N0SGVhZEV4aXN0QXJyYXkubGVuZ3RoID09PSAwICYmIGNvbmZpZ0Nvc3RIZWFkLnJhdGVBbmFseXNpc0lkKSB7XHJcbiAgICAgICAgbGV0IGNvc3RIZWFkOiBDb3N0SGVhZCA9IG5ldyBDb3N0SGVhZCgpO1xyXG4gICAgICAgIGNvc3RIZWFkLm5hbWUgPSBjb25maWdDb3N0SGVhZC5uYW1lO1xyXG4gICAgICAgIGNvc3RIZWFkLnByaW9yaXR5SWQgPSBjb25maWdDb3N0SGVhZC5wcmlvcml0eUlkO1xyXG4gICAgICAgIGNvc3RIZWFkLnJhdGVBbmFseXNpc0lkID0gY29uZmlnQ29zdEhlYWQucmF0ZUFuYWx5c2lzSWQ7XHJcbiAgICAgICAgbGV0IGNhdGVnb3JpZXNMaXN0ID0gbmV3IEFycmF5PENhdGVnb3J5PigpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBjb25maWdDYXRlZ29yeSBvZiBjb25maWdDb3N0SGVhZC5jYXRlZ29yaWVzKSB7XHJcblxyXG4gICAgICAgICAgbGV0IGNhdGVnb3J5OiBDYXRlZ29yeSA9IG5ldyBDYXRlZ29yeShjb25maWdDYXRlZ29yeS5uYW1lLCBjb25maWdDYXRlZ29yeS5yYXRlQW5hbHlzaXNJZCk7XHJcbiAgICAgICAgICBsZXQgd29ya0l0ZW1zTGlzdDogQXJyYXk8V29ya0l0ZW0+ID0gbmV3IEFycmF5PFdvcmtJdGVtPigpO1xyXG5cclxuICAgICAgICAgIGZvciAobGV0IGNvbmZpZ1dvcmtJdGVtIG9mIGNvbmZpZ0NhdGVnb3J5LndvcmtJdGVtcykge1xyXG5cclxuICAgICAgICAgICAgbGV0IHdvcmtJdGVtOiBXb3JrSXRlbSA9IG5ldyBXb3JrSXRlbShjb25maWdXb3JrSXRlbS5uYW1lLCBjb25maWdXb3JrSXRlbS5yYXRlQW5hbHlzaXNJZCk7XHJcbiAgICAgICAgICAgIHdvcmtJdGVtLmlzRGlyZWN0UmF0ZSA9IHRydWU7XHJcbiAgICAgICAgICAgIHdvcmtJdGVtLnVuaXQgPSBjb25maWdXb3JrSXRlbS5tZWFzdXJlbWVudFVuaXQ7XHJcbiAgICAgICAgICAgIHdvcmtJdGVtLmlzTWVhc3VyZW1lbnRTaGVldCA9IGNvbmZpZ1dvcmtJdGVtLmlzTWVhc3VyZW1lbnRTaGVldDtcclxuICAgICAgICAgICAgd29ya0l0ZW0uaXNSYXRlQW5hbHlzaXMgPSBjb25maWdXb3JrSXRlbS5pc1JhdGVBbmFseXNpcztcclxuICAgICAgICAgICAgd29ya0l0ZW0ucmF0ZUFuYWx5c2lzUGVyVW5pdCA9IGNvbmZpZ1dvcmtJdGVtLnJhdGVBbmFseXNpc1BlclVuaXQ7XHJcbiAgICAgICAgICAgIHdvcmtJdGVtLmlzU3RlZWxXb3JrSXRlbSA9IGNvbmZpZ1dvcmtJdGVtLmlzU3RlZWxXb3JrSXRlbTtcclxuICAgICAgICAgICAgd29ya0l0ZW0uaXNJdGVtQnJlYWtkb3duUmVxdWlyZWQgPSBjb25maWdXb3JrSXRlbS5pc0l0ZW1CcmVha2Rvd25SZXF1aXJlZDtcclxuICAgICAgICAgICAgd29ya0l0ZW0ubGVuZ3RoID0gY29uZmlnV29ya0l0ZW0ubGVuZ3RoO1xyXG4gICAgICAgICAgICB3b3JrSXRlbS5icmVhZHRoT3JXaWR0aCA9IGNvbmZpZ1dvcmtJdGVtLmJyZWFkdGhPcldpZHRoO1xyXG4gICAgICAgICAgICB3b3JrSXRlbS5oZWlnaHQgPSBjb25maWdXb3JrSXRlbS5oZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICBpZiAoY29uZmlnV29ya0l0ZW0uZGlyZWN0UmF0ZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgIHdvcmtJdGVtLnJhdGUudG90YWwgPSBjb25maWdXb3JrSXRlbS5kaXJlY3RSYXRlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHdvcmtJdGVtLnJhdGUudG90YWwgPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHdvcmtJdGVtLnJhdGUuaXNFc3RpbWF0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB3b3JrSXRlbXNMaXN0LnB1c2god29ya0l0ZW0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY2F0ZWdvcnkud29ya0l0ZW1zID0gd29ya0l0ZW1zTGlzdDtcclxuICAgICAgICAgIGNhdGVnb3JpZXNMaXN0LnB1c2goY2F0ZWdvcnkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29zdEhlYWQuY2F0ZWdvcmllcyA9IGNhdGVnb3JpZXNMaXN0O1xyXG4gICAgICAgIGNvc3RIZWFkLnRodW1iUnVsZVJhdGUgPSBjb25maWcuZ2V0KENvbnN0YW50cy5USFVNQlJVTEVfUkFURSk7XHJcbiAgICAgICAgY29zdEhlYWRzRGF0YS5wdXNoKGNvc3RIZWFkKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNvc3RIZWFkc0RhdGE7XHJcbiAgfVxyXG5cclxuICBnZXRSYXRlcyhyZXN1bHQ6IGFueSwgY29zdEhlYWRzOiBBcnJheTxDb3N0SGVhZD4pIHtcclxuICAgIGxldCBnZXRSYXRlc0xpc3RTUUwgPSAnU0VMRUNUICogRlJPTSA/IEFTIHEgV0hFUkUgcS5DNCBJTiAoU0VMRUNUIHQucmF0ZUFuYWx5c2lzSWQgJyArXHJcbiAgICAgICdGUk9NID8gQVMgdCknO1xyXG4gICAgbGV0IHJhdGVJdGVtcyA9IGFsYXNxbChnZXRSYXRlc0xpc3RTUUwsIFtyZXN1bHQucmF0ZXMsIGNvc3RIZWFkc10pO1xyXG5cclxuICAgIGxldCByYXRlSXRlbXNSYXRlQW5hbHlzaXNTUUwgPSAnU0VMRUNUIHJhdGVJdGVtLkMyIEFTIGl0ZW1OYW1lLCByYXRlSXRlbS5DMiBBUyBvcmlnaW5hbEl0ZW1OYW1lLCcgK1xyXG4gICAgICAncmF0ZUl0ZW0uQzEyIEFTIHJhdGVBbmFseXNpc0lkLCByYXRlSXRlbS5DNiBBUyB0eXBlLCcgK1xyXG4gICAgICAnUk9VTkQocmF0ZUl0ZW0uQzcsMikgQVMgcXVhbnRpdHksIFJPVU5EKHJhdGVJdGVtLkMzLDIpIEFTIHJhdGUsIHVuaXQuQzIgQVMgdW5pdCwnICtcclxuICAgICAgJ1JPVU5EKHJhdGVJdGVtLkMzICogcmF0ZUl0ZW0uQzcsMikgQVMgdG90YWxBbW91bnQsIHJhdGVJdGVtLkM1IEFTIHRvdGFsUXVhbnRpdHkgJyArXHJcbiAgICAgICdGUk9NID8gQVMgcmF0ZUl0ZW0gSk9JTiA/IEFTIHVuaXQgT04gdW5pdC5DMSA9IHJhdGVJdGVtLkM5JztcclxuXHJcbiAgICBsZXQgcmF0ZUl0ZW1zTGlzdCA9IGFsYXNxbChyYXRlSXRlbXNSYXRlQW5hbHlzaXNTUUwsIFtyYXRlSXRlbXMsIHJlc3VsdC51bml0c10pO1xyXG5cclxuICAgIGxldCBkaXN0aW5jdEl0ZW1zU1FMID0gJ3NlbGVjdCBESVNUSU5DVCBpdGVtTmFtZSxvcmlnaW5hbEl0ZW1OYW1lLHJhdGUgRlJPTSA/JztcclxuICAgIHZhciBkaXN0aW5jdFJhdGVzID0gYWxhc3FsKGRpc3RpbmN0SXRlbXNTUUwsIFtyYXRlSXRlbXNMaXN0XSk7XHJcblxyXG4gICAgcmV0dXJuIGRpc3RpbmN0UmF0ZXM7XHJcbiAgfVxyXG5cclxuICBzYXZlUmF0ZUFuYWx5c2lzKHJhdGVBbmFseXNpczogUmF0ZUFuYWx5c2lzLCByZWdpb246IGFueSkge1xyXG4gICAgbG9nZ2VyLmluZm8oJ3NhdmVSYXRlQW5hbHlzaXMgaXMgYmVlbiBoaXQgOiAnICsgcmVnaW9uLlJlZ2lvbik7XHJcbiAgICBsZXQgcXVlcnkgPSB7J3JlZ2lvbic6IHJlZ2lvbi5SZWdpb259O1xyXG4gICAgcmF0ZUFuYWx5c2lzLnJlZ2lvbiA9IHJlZ2lvbi5SZWdpb247XHJcbiAgICBsb2dnZXIuaW5mbygnVXBkYXRpbmcgUmF0ZUFuYWx5c2lzIGZvciAnICsgcmVnaW9uLlJlZ2lvbik7XHJcbiAgICB0aGlzLnJhdGVBbmFseXNpc1JlcG9zaXRvcnkucmV0cmlldmUoeydyZWdpb24nOiByZWdpb24uUmVnaW9ufSwgKGVycm9yOiBhbnksIHJhdGVBbmFseXNpc0FycmF5OiBBcnJheTxSYXRlQW5hbHlzaXM+KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGxvZ2dlci5lcnJvcignVW5hYmxlIHRvIHJldHJpdmUgc3luY2VkIFJhdGVBbmFseXNpcycpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChyYXRlQW5hbHlzaXNBcnJheS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICBxdWVyeSA9IHsncmVnaW9uJzogcmVnaW9uLlJlZ2lvbn07XHJcbiAgICAgICAgICBsZXQgdXBkYXRlID0ge1xyXG4gICAgICAgICAgICAkc2V0OiB7XHJcbiAgICAgICAgICAgICAgJ3Byb2plY3RDb3N0SGVhZHMnOiByYXRlQW5hbHlzaXMucHJvamVjdENvc3RIZWFkcyxcclxuICAgICAgICAgICAgICAncHJvamVjdFJhdGVzJzogcmF0ZUFuYWx5c2lzLnByb2plY3RSYXRlcyxcclxuICAgICAgICAgICAgICAnYnVpbGRpbmdDb3N0SGVhZHMnOiByYXRlQW5hbHlzaXMuYnVpbGRpbmdDb3N0SGVhZHMsXHJcbiAgICAgICAgICAgICAgJ2J1aWxkaW5nUmF0ZXMnOiByYXRlQW5hbHlzaXMuYnVpbGRpbmdSYXRlc1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgICAgdGhpcy5yYXRlQW5hbHlzaXNSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIHVwZGF0ZSwge25ldzogdHJ1ZX0sIChlcnJvcjogYW55LCByYXRlQW5hbHlzaXNBcnJheTogUmF0ZUFuYWx5c2lzKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgIGxvZ2dlci5lcnJvcignc2F2ZVJhdGVBbmFseXNpcyBmYWlsZWQgPT4gJyArIGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGxvZ2dlci5pbmZvKCdVcGRhdGVkIFJhdGVBbmFseXNpcyBmb3IgcmVnaW9uIDonK3JlZ2lvbi5SZWdpb24pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5yYXRlQW5hbHlzaXNSZXBvc2l0b3J5LmNyZWF0ZShyYXRlQW5hbHlzaXMsIChlcnJvcjogYW55LCByZXN1bHQ6IFJhdGVBbmFseXNpcykgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoJ3NhdmVSYXRlQW5hbHlzaXMgZmFpbGVkID0+ICcgKyBlcnJvci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBsb2dnZXIuaW5mbygnU2F2ZWQgUmF0ZUFuYWx5c2lzIGZvciByZWdpb24gOiAnK3JlZ2lvbi5SZWdpb24pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0Q29zdENvbnRyb2xSYXRlQW5hbHlzaXMocXVlcnk6IGFueSwgcHJvamVjdGlvbjogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJhdGVBbmFseXNpczogUmF0ZUFuYWx5c2lzKSA9PiB2b2lkKSB7XHJcbiAgICB0aGlzLnJhdGVBbmFseXNpc1JlcG9zaXRvcnkucmV0cmlldmVXaXRoUHJvamVjdGlvbihxdWVyeSwgcHJvamVjdGlvbiwgKGVycm9yOiBhbnksIHJhdGVBbmFseXNpc0FycmF5OiBBcnJheTxSYXRlQW5hbHlzaXM+KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAocmF0ZUFuYWx5c2lzQXJyYXkubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICBsb2dnZXIuZXJyb3IoJ0NvbnRDb250cm9sIFJhdGVBbmFseXNpcyBub3QgZm91bmQuJyk7XHJcbiAgICAgICAgICBjYWxsYmFjaygnQ29udENvbnRyb2wgUmF0ZUFuYWx5c2lzIG5vdCBmb3VuZC4nLCBudWxsKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY2FsbGJhY2sobnVsbCwgcmF0ZUFuYWx5c2lzQXJyYXlbMF0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRBZ2dyZWdhdGVEYXRhKHF1ZXJ5OiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgYWdncmVnYXRlRGF0YTogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0aGlzLnJhdGVBbmFseXNpc1JlcG9zaXRvcnkuYWdncmVnYXRlKHF1ZXJ5LCBjYWxsYmFjayk7XHJcbiAgfVxyXG5cclxuICBnZXRBbGxyZWdpb25zRnJvbVJhdGVBbmFseXNpcyhjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUmF0ZSBBbmFseXNpcyBTZXJ2aWNlLCBnZXRDb3N0SGVhZHMgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICBsZXQgcmVnaW9uTGlzdEZyb21SYXRlQW5hbHlzaXM6IEFycmF5PGFueT47XHJcbiAgICBsZXQgdXJsID0gY29uZmlnLmdldCgncmF0ZUFuYWx5c2lzQVBJLmdldEFsbHJlZ2lvbnMnKTtcclxuICAgIHJlcXVlc3QuZ2V0KHt1cmw6IHVybH0sIGZ1bmN0aW9uIChlcnJvcjogYW55LCByZXNwb25zZTogYW55LCBib2R5OiBhbnkpIHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbG9nZ2VyLmVycm9yKCdFcnJvciBmb3IgZ2V0dGluZyBhbGwgcmVnaW9ucy4nKTtcclxuICAgICAgICBsb2dnZXIuZXJyb3IoSlNPTi5zdHJpbmdpZnkoZXJyb3IpKTtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSBpZiAoIWVycm9yICYmIHJlc3BvbnNlKSB7XHJcbiAgICAgICAgaWYocmVzcG9uc2Uuc3RhdHVzQ29kZT09PTIwMCkge1xyXG4gICAgICAgICAgbGV0IHJlc3AgPSBKU09OLnBhcnNlKGJvZHkpO1xyXG4gICAgICAgICAgcmVnaW9uTGlzdEZyb21SYXRlQW5hbHlzaXMgPSByZXNwWydSZWdpb25zJ107XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygncmVnaW9uTGlzdEZyb21SYXRlQW5hbHlzaXMgOiAnICsgSlNPTi5zdHJpbmdpZnkocmVnaW9uTGlzdEZyb21SYXRlQW5hbHlzaXMpKTtcclxuICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJlZ2lvbkxpc3RGcm9tUmF0ZUFuYWx5c2lzKTtcclxuICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygncmVnaW9uTGlzdEZyb21SYXRlQW5hbHlzaXMgOiBOT1QgRk9VTkQuIEludGVybmFsIHNlcnZlciBlcnJvciEnKTtcclxuICAgICAgICAgIGNhbGxiYWNrKCdyZWdpb25MaXN0RnJvbVJhdGVBbmFseXNpcyA6IE5PVCBGT1VORC4gSW50ZXJuYWwgc2VydmVyIGVycm9yIScsbnVsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldEFsbFJlZ2lvbk5hbWVzKGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBBcnJheTxhbnk+KSA9PiB2b2lkKSB7XHJcbiAgICBsZXQgcXVlcnkgPSBbXHJcbiAgICAgIHskdW53aW5kOiAnJHJlZ2lvbid9LFxyXG4gICAgICB7JHByb2plY3Q6IHsncmVnaW9uJzogMSwgX2lkOiAwfX1cclxuICAgIF07XHJcbiAgICB0aGlzLnJhdGVBbmFseXNpc1JlcG9zaXRvcnkuYWdncmVnYXRlKHF1ZXJ5LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHJlc3VsdC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICBjYWxsYmFjayhlcnJvciwgcmVzdWx0KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbGV0IGVycm9yID0gbmV3IEVycm9yKCk7XHJcbiAgICAgICAgICBlcnJvci5tZXNzYWdlID0gbWVzc2FnZXMuTVNHX0VSUk9SX1JFR0lPTlNfQVJFX05PVF9QUkVTRU5UO1xyXG4gICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRBbGxEYXRhRm9yRHJvcGRvd24ocmVnaW9uTmFtZTogc3RyaW5nLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogQXJyYXk8YW55PikgPT4gdm9pZCkge1xyXG4gICAgbGV0IHF1ZXJ5ID0ge3JlZ2lvbjogcmVnaW9uTmFtZX07XHJcbiAgICBsZXQgcHJvamVjdGlvbiA9IHsnYnVpbGRpbmdDb3N0SGVhZHMnOiAxfTtcclxuICAgIHRoaXMucmF0ZUFuYWx5c2lzUmVwb3NpdG9yeS5yZXRyaWV2ZVdpdGhQcm9qZWN0aW9uKHF1ZXJ5LCBwcm9qZWN0aW9uLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IGNvc3RIZWFkRGF0YSA9IHJlc3VsdFswXS5idWlsZGluZ0Nvc3RIZWFkcztcclxuICAgICAgICBsZXQgYnVpbGRpbmdDb3N0SGVhZHM6IEFycmF5PFJBQ29zdEhlYWQ+ID0gW107XHJcbiAgICAgICAgaWYoY29zdEhlYWREYXRhLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgY29zdEhlYWRJbmRleCA9IDA7IGNvc3RIZWFkSW5kZXggPCBjb3N0SGVhZERhdGEubGVuZ3RoOyBjb3N0SGVhZEluZGV4KyspIHtcclxuICAgICAgICAgICAgIGxldCBjb3N0SGVhZCA9IG5ldyBSQUNvc3RIZWFkKCk7XHJcbiAgICAgICAgICAgICBjb3N0SGVhZC5uYW1lID0gY29zdEhlYWREYXRhW2Nvc3RIZWFkSW5kZXhdLm5hbWU7XHJcbiAgICAgICAgICAgICBjb3N0SGVhZC5yYXRlQW5hbHlzaXNJZCA9IGNvc3RIZWFkRGF0YVtjb3N0SGVhZEluZGV4XS5yYXRlQW5hbHlzaXNJZDtcclxuICAgICAgICAgICAgIGxldCBidWlsZGluZ0NhdGVnb3JpZXM6IEFycmF5PFJBQ2F0ZWdvcnk+ID0gbmV3IEFycmF5PFJBQ2F0ZWdvcnk+KCk7XHJcbiAgICAgICAgICAgICB0aGlzLmdldENhdGVnb3JpZXMoY29zdEhlYWREYXRhW2Nvc3RIZWFkSW5kZXhdLmNhdGVnb3JpZXMsIGJ1aWxkaW5nQ2F0ZWdvcmllcyk7XHJcbiAgICAgICAgICAgICBjb3N0SGVhZC5jYXRlZ29yaWVzID0gYnVpbGRpbmdDYXRlZ29yaWVzO1xyXG4gICAgICAgICAgICAgaWYoY29zdEhlYWQuY2F0ZWdvcmllcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgIGJ1aWxkaW5nQ29zdEhlYWRzLnB1c2goY29zdEhlYWQpO1xyXG4gICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgIGNhbGxiYWNrKG51bGwsIGJ1aWxkaW5nQ29zdEhlYWRzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbGV0IGVycm9yID0gbmV3IEVycm9yKCk7XHJcbiAgICAgICAgICBlcnJvci5tZXNzYWdlID0gbWVzc2FnZXMuTVNHX0VSUk9SX1JFR0lPTlNfQVJFX05PVF9QUkVTRU5UO1xyXG4gICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRDYXRlZ29yaWVzKGNhdGVnb3JpZXNEYXRhOiBBcnJheTxDYXRlZ29yeT4sIGJ1aWxkaW5nQ2F0ZWdvcmllczogYW55KSB7XHJcbiAgICBpZiAoY2F0ZWdvcmllc0RhdGEubGVuZ3RoID4gMCkge1xyXG4gICAgICBmb3IgKGxldCBjYXRlZ29yeUluZGV4ID0gMDsgY2F0ZWdvcnlJbmRleCA8IGNhdGVnb3JpZXNEYXRhLmxlbmd0aDsgY2F0ZWdvcnlJbmRleCsrKSB7XHJcbiAgICAgICAgbGV0IGNhdGVnb3J5ID0gbmV3IFJBQ2F0ZWdvcnkoKTtcclxuICAgICAgICBjYXRlZ29yeS5uYW1lID0gY2F0ZWdvcmllc0RhdGFbY2F0ZWdvcnlJbmRleF0ubmFtZTtcclxuICAgICAgICBjYXRlZ29yeS5yYXRlQW5hbHlzaXNJZCA9IGNhdGVnb3JpZXNEYXRhW2NhdGVnb3J5SW5kZXhdLnJhdGVBbmFseXNpc0lkO1xyXG4gICAgICAgIGxldCBidWlsZGluZ1dvcmtJdGVtczogQXJyYXk8UkFXb3JrSXRlbT4gPSBuZXcgQXJyYXk8UkFXb3JrSXRlbT4oKTtcclxuICAgICAgICB0aGlzLmdldFdvcmtJdGVtc0ZvclJBKGNhdGVnb3JpZXNEYXRhW2NhdGVnb3J5SW5kZXhdLndvcmtJdGVtcywgYnVpbGRpbmdXb3JrSXRlbXMpO1xyXG4gICAgICAgIGNhdGVnb3J5LndvcmtJdGVtcyA9IGJ1aWxkaW5nV29ya0l0ZW1zO1xyXG4gICAgICAgIGlmKGNhdGVnb3J5LndvcmtJdGVtcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICBidWlsZGluZ0NhdGVnb3JpZXMucHVzaChjYXRlZ29yeSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXRXb3JrSXRlbXNGb3JSQSh3b3JrSXRlbXNEYXRhOiBBcnJheTxXb3JrSXRlbT4sIGJ1aWxkaW5nV29ya0l0ZW1zOiBhbnkpIHtcclxuICAgIGlmICh3b3JrSXRlbXNEYXRhLmxlbmd0aCA+IDApIHtcclxuICAgICAgZm9yIChsZXQgd29ya0l0ZW1JbmRleCA9IDA7IHdvcmtJdGVtSW5kZXggPCB3b3JrSXRlbXNEYXRhLmxlbmd0aDsgd29ya0l0ZW1JbmRleCsrKSB7XHJcbiAgICAgICAgbGV0IHdvcmtJdGVtID0gbmV3IFJBV29ya0l0ZW0oKTtcclxuICAgICAgICB3b3JrSXRlbS5uYW1lID0gd29ya0l0ZW1zRGF0YVt3b3JrSXRlbUluZGV4XS5uYW1lO1xyXG4gICAgICAgIHdvcmtJdGVtLnJhdGVBbmFseXNpc0lkID0gd29ya0l0ZW1zRGF0YVt3b3JrSXRlbUluZGV4XS5yYXRlQW5hbHlzaXNJZDtcclxuICAgICAgICB3b3JrSXRlbS5yYXRlID0gd29ya0l0ZW1zRGF0YVt3b3JrSXRlbUluZGV4XS5yYXRlO1xyXG4gICAgICAgIHdvcmtJdGVtLnVuaXQgPSB3b3JrSXRlbXNEYXRhW3dvcmtJdGVtSW5kZXhdLnVuaXQ7XHJcbiAgICAgICAgaWYod29ya0l0ZW0ucmF0ZS5yYXRlSXRlbXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgYnVpbGRpbmdXb3JrSXRlbXMucHVzaCh3b3JrSXRlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbk9iamVjdC5zZWFsKFJhdGVBbmFseXNpc1NlcnZpY2UpO1xyXG5leHBvcnQgPSBSYXRlQW5hbHlzaXNTZXJ2aWNlO1xyXG4iXX0=
