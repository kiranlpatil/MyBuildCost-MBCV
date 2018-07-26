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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHBsaWNhdGlvblByb2plY3Qvc2VydmljZXMvUmF0ZUFuYWx5c2lzU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsb0VBQXVFO0FBQ3ZFLGtFQUFxRTtBQUVyRSw4RUFBaUY7QUFDakYsMEVBQTZFO0FBQzdFLHdFQUEyRTtBQUMzRSwrQkFBa0M7QUFDbEMsZ0VBQW1FO0FBQ25FLHdFQUEyRTtBQUMzRSx3RUFBMkU7QUFHM0UsK0NBQWtEO0FBQ2xELHdGQUEyRjtBQUMzRiw0RUFBK0U7QUFFL0UsbUVBQXVFO0FBQ3ZFLHdFQUEyRTtBQUMzRSx3RUFBMkU7QUFDM0Usd0VBQTJFO0FBRTNFLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNqQyxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDL0IsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUV2RCxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsNEJBQTRCLENBQUMsQ0FBQztBQUV0RDtJQU9FO1FBQ0UsSUFBSSxDQUFDLFFBQVEsR0FBRyxZQUFZLENBQUMsUUFBUSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxlQUFlLEVBQUUsQ0FBQztRQUM3QyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7UUFDckMsSUFBSSxDQUFDLHNCQUFzQixHQUFHLElBQUksc0JBQXNCLEVBQUUsQ0FBQztJQUM3RCxDQUFDO0lBRUQsMENBQVksR0FBWixVQUFhLEdBQVcsRUFBRSxJQUFVLEVBQUUsUUFBMkM7UUFDL0UsTUFBTSxDQUFDLElBQUksQ0FBQyxrREFBa0QsQ0FBQyxDQUFDO1FBQ2hFLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBQyxHQUFHLEVBQUUsR0FB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YUFBYSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdCLEdBQUcsQ0FBQyxDQUFDLElBQUksYUFBYSxHQUFHLENBQUMsRUFBRSxhQUFhLEdBQUcsYUFBYSxDQUFDLE1BQU0sRUFBRSxhQUFhLEVBQUUsRUFBRSxDQUFDO2dCQUNsRixJQUFJLFFBQVEsR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFDO2dCQUNoQyxRQUFRLENBQUMsSUFBSSxHQUFHLGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQ2xELFFBQVEsQ0FBQyxjQUFjLEdBQUcsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDLGNBQWMsQ0FBQztnQkFDdEUsUUFBUSxDQUFDLElBQUksR0FBRyxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUNsRCxRQUFRLENBQUMsSUFBSSxHQUFHLGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQ2xELEVBQUUsQ0FBQSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN0QyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ25DLENBQUM7WUFDSCxDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFDSCwwQkFBQztBQUFELENBMXhCQSxBQTB4QkMsSUFBQTtBQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUNqQyxpQkFBUyxtQkFBbUIsQ0FBQyIsImZpbGUiOiJhcHAvYXBwbGljYXRpb25Qcm9qZWN0L3NlcnZpY2VzL1JhdGVBbmFseXNpc1NlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVXNlclNlcnZpY2UgPSByZXF1aXJlKCcuLy4uLy4uL2ZyYW1ld29yay9zZXJ2aWNlcy9Vc2VyU2VydmljZScpO1xyXG5pbXBvcnQgUHJvamVjdEFzc2V0ID0gcmVxdWlyZSgnLi4vLi4vZnJhbWV3b3JrL3NoYXJlZC9wcm9qZWN0YXNzZXQnKTtcclxuaW1wb3J0IFVzZXIgPSByZXF1aXJlKCcuLi8uLi9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9tb25nb29zZS91c2VyJyk7XHJcbmltcG9ydCBBdXRoSW50ZXJjZXB0b3IgPSByZXF1aXJlKCcuLi8uLi9mcmFtZXdvcmsvaW50ZXJjZXB0b3IvYXV0aC5pbnRlcmNlcHRvcicpO1xyXG5pbXBvcnQgQ29zdENvbnRyb2xsRXhjZXB0aW9uID0gcmVxdWlyZSgnLi4vZXhjZXB0aW9uL0Nvc3RDb250cm9sbEV4Y2VwdGlvbicpO1xyXG5pbXBvcnQgV29ya0l0ZW0gPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3Byb2plY3QvYnVpbGRpbmcvV29ya0l0ZW0nKTtcclxuaW1wb3J0IGFsYXNxbCA9IHJlcXVpcmUoJ2FsYXNxbCcpO1xyXG5pbXBvcnQgUmF0ZSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9idWlsZGluZy9SYXRlJyk7XHJcbmltcG9ydCBDb3N0SGVhZCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9idWlsZGluZy9Db3N0SGVhZCcpO1xyXG5pbXBvcnQgQ2F0ZWdvcnkgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3Byb2plY3QvYnVpbGRpbmcvQ2F0ZWdvcnknKTtcclxuaW1wb3J0IFF1YW50aXR5ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L2J1aWxkaW5nL1F1YW50aXR5Jyk7XHJcblxyXG5pbXBvcnQgQ29uc3RhbnRzID0gcmVxdWlyZSgnLi4vc2hhcmVkL2NvbnN0YW50cycpO1xyXG5pbXBvcnQgUmF0ZUFuYWx5c2lzUmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9SYXRlQW5hbHlzaXNSZXBvc2l0b3J5Jyk7XHJcbmltcG9ydCBSYXRlQW5hbHlzaXMgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL1JhdGVBbmFseXNpcy9SYXRlQW5hbHlzaXMnKTtcclxuaW1wb3J0IHsgQXR0YWNobWVudERldGFpbHNNb2RlbCB9IGZyb20gJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9idWlsZGluZy9BdHRhY2htZW50RGV0YWlscyc7XHJcbmltcG9ydCBtZXNzYWdlcyAgPSByZXF1aXJlKCcuLi8uLi9hcHBsaWNhdGlvblByb2plY3Qvc2hhcmVkL21lc3NhZ2VzJyk7XHJcbmltcG9ydCBSQUNhdGVnb3J5ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9SYXRlQW5hbHlzaXMvUkFDYXRlZ29yeScpO1xyXG5pbXBvcnQgUkFXb3JrSXRlbSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvUmF0ZUFuYWx5c2lzL1JBV29ya0l0ZW0nKTtcclxuaW1wb3J0IFJBQ29zdEhlYWQgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL1JhdGVBbmFseXNpcy9SQUNvc3RIZWFkJyk7XHJcblxyXG5sZXQgcmVxdWVzdCA9IHJlcXVpcmUoJ3JlcXVlc3QnKTtcclxubGV0IGNvbmZpZyA9IHJlcXVpcmUoJ2NvbmZpZycpO1xyXG52YXIgbG9nNGpzID0gcmVxdWlyZSgnbG9nNGpzJyk7XHJcbnZhciBsb2dnZXIgPSBsb2c0anMuZ2V0TG9nZ2VyKCdSYXRlIEFuYWx5c2lzIFNlcnZpY2UnKTtcclxuXHJcbmxldCBDQ1Byb21pc2UgPSByZXF1aXJlKCdwcm9taXNlL2xpYi9lczYtZXh0ZW5zaW9ucycpO1xyXG5cclxuY2xhc3MgUmF0ZUFuYWx5c2lzU2VydmljZSB7XHJcbiAgQVBQX05BTUU6IHN0cmluZztcclxuICBjb21wYW55X25hbWU6IHN0cmluZztcclxuICBwcml2YXRlIGF1dGhJbnRlcmNlcHRvcjogQXV0aEludGVyY2VwdG9yO1xyXG4gIHByaXZhdGUgdXNlclNlcnZpY2U6IFVzZXJTZXJ2aWNlO1xyXG4gIHByaXZhdGUgcmF0ZUFuYWx5c2lzUmVwb3NpdG9yeTogUmF0ZUFuYWx5c2lzUmVwb3NpdG9yeTtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLkFQUF9OQU1FID0gUHJvamVjdEFzc2V0LkFQUF9OQU1FO1xyXG4gICAgdGhpcy5hdXRoSW50ZXJjZXB0b3IgPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XHJcbiAgICB0aGlzLnVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICB0aGlzLnJhdGVBbmFseXNpc1JlcG9zaXRvcnkgPSBuZXcgUmF0ZUFuYWx5c2lzUmVwb3NpdG9yeSgpO1xyXG4gIH1cclxuXHJcbiAgZ2V0Q29zdEhlYWRzKHVybDogc3RyaW5nLCB1c2VyOiBVc2VyLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUmF0ZSBBbmFseXNpcyBTZXJ2aWNlLCBnZXRDb3N0SGVhZHMgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICByZXF1ZXN0LmdldCh7dXJsOiB1cmx9LCBmdW5jdGlvbiAoZXJyb3I6IGFueSwgcmVzcG9uc2U6IGFueSwgYm9keTogYW55KSB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIGlmICghZXJyb3IgJiYgcmVzcG9uc2UpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnUkVTUE9OU0UgSlNPTiA6ICcgKyBKU09OLnN0cmluZ2lmeShKU09OLnBhcnNlKGJvZHkpKSk7XHJcbiAgICAgICAgbGV0IHJlcyA9IEpTT04ucGFyc2UoYm9keSk7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRXb3JrSXRlbXModXJsOiBzdHJpbmcsIHVzZXI6IFVzZXIsIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdSYXRlIEFuYWx5c2lzIFNlcnZpY2UsIGdldFdvcmtJdGVtcyBoYXMgYmVlbiBoaXQnKTtcclxuICAgIHJlcXVlc3QuZ2V0KHt1cmw6IHVybH0sIGZ1bmN0aW9uIChlcnJvcjogYW55LCByZXNwb25zZTogYW55LCBib2R5OiBhbnkpIHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2UgaWYgKCFlcnJvciAmJiByZXNwb25zZSkge1xyXG4gICAgICAgIGxldCByZXMgPSBKU09OLnBhcnNlKGJvZHkpO1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHJlcyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0V29ya0l0ZW1zQnlDb3N0SGVhZElkKHVybDogc3RyaW5nLCBjb3N0SGVhZElkOiBzdHJpbmcsIHVzZXI6IFVzZXIsIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdSYXRlIEFuYWx5c2lzIFNlcnZpY2UsIGdldFdvcmtJdGVtc0J5Q29zdEhlYWRJZCBoYXMgYmVlbiBoaXQnKTtcclxuICAgIGxldCB3b3JrSXRlbXM6IEFycmF5PFdvcmtJdGVtPiA9IFtdO1xyXG4gICAgcmVxdWVzdC5nZXQoe3VybDogdXJsfSwgZnVuY3Rpb24gKGVycm9yOiBhbnksIHJlc3BvbnNlOiBhbnksIGJvZHk6IGFueSkge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSBpZiAoIWVycm9yICYmIHJlc3BvbnNlKSB7XHJcbiAgICAgICAgbGV0IHJlcyA9IEpTT04ucGFyc2UoYm9keSk7XHJcbiAgICAgICAgaWYgKHJlcykge1xyXG5cclxuICAgICAgICAgIGZvciAobGV0IHdvcmtpdGVtIG9mIHJlcy5TdWJJdGVtVHlwZSkge1xyXG4gICAgICAgICAgICBpZiAocGFyc2VJbnQoY29zdEhlYWRJZCkgPT09IHdvcmtpdGVtLkMzKSB7XHJcbiAgICAgICAgICAgICAgbGV0IHdvcmtpdGVtRGV0YWlscyA9IG5ldyBXb3JrSXRlbSh3b3JraXRlbS5DMiwgd29ya2l0ZW0uQzEpO1xyXG4gICAgICAgICAgICAgIHdvcmtJdGVtcy5wdXNoKHdvcmtpdGVtRGV0YWlscyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgd29ya0l0ZW1zKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRBcGlDYWxsKHVybDogc3RyaW5nLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3BvbnNlOiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdnZXRBcGlDYWxsIGZvciByYXRlQW5hbHlzaXMgaGFzIGJlZSBoaXQgZm9yIHVybCA6ICcgKyB1cmwpO1xyXG4gICAgcmVxdWVzdC5nZXQoe3VybDogdXJsfSwgZnVuY3Rpb24gKGVycm9yOiBhbnksIHJlc3BvbnNlOiBhbnksIGJvZHk6IGFueSkge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGVycm9yLm1lc3NhZ2UsIGVycm9yLnN0YWNrKSwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSBpZiAoIWVycm9yICYmIHJlc3BvbnNlKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgIGlmKHJlc3BvbnNlLnN0YXR1c0NvZGUgPT09IDIwMCkge1xyXG4gICAgICAgICAgICBsZXQgcmVzID0gSlNPTi5wYXJzZShib2R5KTtcclxuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBlcnJvciA9IG5ldyBFcnJvcigpO1xyXG4gICAgICAgICAgICBlcnJvci5tZXNzYWdlID0gJ1VuYWJsZSB0byBtYWtlIGEgZ2V0IHJlcXVlc3QgZm9yIHVybCA6ICcgKyB1cmw7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgIGxvZ2dlci5lcnJvcignUHJvbWlzZSBmYWlsZWQgZm9yIGluZGl2aWR1YWwgISB1cmw6JyArIHVybCArICc6XFxuIGVycm9yIDonICsgSlNPTi5zdHJpbmdpZnkoZXJyLm1lc3NhZ2UpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0UmF0ZSh3b3JrSXRlbUlkOiBudW1iZXIsIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgZGF0YTogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBsZXQgdXJsID0gY29uZmlnLmdldCgncmF0ZUFuYWx5c2lzQVBJLnVuaXQnKTtcclxuICAgIHRoaXMuZ2V0QXBpQ2FsbCh1cmwsIChlcnJvciwgdW5pdERhdGEpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHVuaXREYXRhID0gdW5pdERhdGFbJ1VPTSddO1xyXG4gICAgICAgIHVybCA9IGNvbmZpZy5nZXQoJ3JhdGVBbmFseXNpc0FQSS5yYXRlJyk7XHJcbiAgICAgICAgdGhpcy5nZXRBcGlDYWxsKHVybCwgKGVycm9yLCBkYXRhKSA9PiB7XHJcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IHJhdGUgPSBkYXRhWydSYXRlQW5hbHlzaXNEYXRhJ107XHJcbiAgICAgICAgICAgIGxldCBzcWwgPSAnU0VMRUNUIHJhdGUuQzUgQVMgcXVhbnRpdHksIHVuaXQuQzIgQXMgdW5pdCBGUk9NID8gQVMgcmF0ZSBKT0lOID8gQVMgdW5pdCBvbiB1bml0LkMxID0gIHJhdGUuQzggYW5kJyArXHJcbiAgICAgICAgICAgICAgJyByYXRlLkMxID0gJyArIHdvcmtJdGVtSWQ7XHJcbiAgICAgICAgICAgIGxldCBzcWwyID0gJ1NFTEVDVCByYXRlLkMxIEFTIHJhdGVBbmFseXNpc0lkLCByYXRlLkMyIEFTIGl0ZW1OYW1lLFJPVU5EKHJhdGUuQzcsMikgQVMgcXVhbnRpdHksUk9VTkQocmF0ZS5DMywyKSBBUyByYXRlLCcgK1xyXG4gICAgICAgICAgICAgICcgUk9VTkQocmF0ZS5DMypyYXRlLkM3LDIpIEFTIHRvdGFsQW1vdW50LCByYXRlLkM2IHR5cGUsIHVuaXQuQzIgQXMgdW5pdCBGUk9NID8gQVMgcmF0ZSBKT0lOID8gQVMgdW5pdCBPTiB1bml0LkMxID0gcmF0ZS5DOScgK1xyXG4gICAgICAgICAgICAgICcgIFdIRVJFIHJhdGUuQzEgPSAnICsgd29ya0l0ZW1JZDtcclxuICAgICAgICAgICAgbGV0IHNxbDMgPSAnU0VMRUNUIFJPVU5EKFNVTShyYXRlLkMzKnJhdGUuQzcpIC8gU1VNKHJhdGUuQzcpLDIpIEFTIHRvdGFsICBGUk9NID8gQVMgcmF0ZSBKT0lOID8gQVMgdW5pdCBPTiB1bml0LkMxID0gcmF0ZS5DOScgK1xyXG4gICAgICAgICAgICAgICcgIFdIRVJFIHJhdGUuQzEgPSAnICsgd29ya0l0ZW1JZDtcclxuICAgICAgICAgICAgbGV0IHF1YW50aXR5QW5kVW5pdCA9IGFsYXNxbChzcWwsIFtyYXRlLCB1bml0RGF0YV0pO1xyXG4gICAgICAgICAgICBsZXQgcmF0ZVJlc3VsdDogUmF0ZSA9IG5ldyBSYXRlKCk7XHJcbiAgICAgICAgICAgIGxldCB0b3RhbHJhdGVGcm9tUmF0ZUFuYWx5c2lzID0gYWxhc3FsKHNxbDMsIFtyYXRlLCB1bml0RGF0YV0pO1xyXG4gICAgICAgICAgICByYXRlUmVzdWx0LnF1YW50aXR5ID0gcXVhbnRpdHlBbmRVbml0WzBdLnF1YW50aXR5O1xyXG4gICAgICAgICAgICByYXRlUmVzdWx0LnVuaXQgPSBxdWFudGl0eUFuZFVuaXRbMF0udW5pdDtcclxuICAgICAgICAgICAgcmF0ZVJlc3VsdC5yYXRlRnJvbVJhdGVBbmFseXNpcyA9IHBhcnNlRmxvYXQoKHRvdGFscmF0ZUZyb21SYXRlQW5hbHlzaXNbMF0udG90YWwpLnRvRml4ZWQoMikpO1xyXG4gICAgICAgICAgICByYXRlID0gYWxhc3FsKHNxbDIsIFtyYXRlLCB1bml0RGF0YV0pO1xyXG4gICAgICAgICAgICByYXRlUmVzdWx0LnJhdGVJdGVtcyA9IHJhdGU7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJhdGVSZXN1bHQpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvL1RPRE8gOiBEZWxldGUgQVBJJ3MgcmVsYXRlZCB0byB3b3JraXRlbXMgYWRkLCBkZWxlZXQsIGdldCBsaXN0LlxyXG4gIGdldFdvcmtpdGVtTGlzdChjb3N0SGVhZElkOiBudW1iZXIsIGNhdGVnb3J5SWQ6IG51bWJlciwgY2FsbGJhY2s6IChlcnJvcjogYW55LCBkYXRhOiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxldCB1cmwgPSBjb25maWcuZ2V0KCdyYXRlQW5hbHlzaXNBUEkud29ya2l0ZW0nKTtcclxuICAgIHRoaXMuZ2V0QXBpQ2FsbCh1cmwsIChlcnJvciwgd29ya2l0ZW0pID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCBzcWw6IHN0cmluZyA9ICdTRUxFQ1QgQzIgQVMgcmF0ZUFuYWx5c2lzSWQsIEMzIEFTIG5hbWUgRlJPTSA/IFdIRVJFIEMxID0gJyArIGNvc3RIZWFkSWQgKyAnIGFuZCBDNCA9ICcgKyBjYXRlZ29yeUlkO1xyXG4gICAgICAgIGlmIChjYXRlZ29yeUlkID09PSAwKSB7XHJcbiAgICAgICAgICBzcWwgPSAnU0VMRUNUIEMyIEFTIHJhdGVBbmFseXNpc0lkLCBDMyBBUyBuYW1lIEZST00gPyBXSEVSRSBDMSA9ICcgKyBjb3N0SGVhZElkO1xyXG4gICAgICAgIH1cclxuICAgICAgICB3b3JraXRlbSA9IHdvcmtpdGVtWydJdGVtcyddO1xyXG4gICAgICAgIGxldCB3b3JraXRlbUxpc3QgPSBhbGFzcWwoc3FsLCBbd29ya2l0ZW1dKTtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCB3b3JraXRlbUxpc3QpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGNvbnZlcnRDb3N0SGVhZHNGcm9tUmF0ZUFuYWx5c2lzVG9Db3N0Q29udHJvbChlbnRpdHk6IHN0cmluZywgcmVnaW9uOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgZGF0YTogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnY29udmVydENvc3RIZWFkc0Zyb21SYXRlQW5hbHlzaXNUb0Nvc3RDb250cm9sIGhhcyBiZWVuIGhpdCcpO1xyXG5cclxuICAgIGxldCBjb3N0SGVhZFVSTCA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfQVBJICsgZW50aXR5ICsgQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfQ09TVEhFQURTKVxyXG4gICAgICArIHJlZ2lvbi5SZWdpb25JZCArIGNvbmZpZy5nZXQoQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfQVBJICsgQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfQVBJX0VORFBPSU5UKTtcclxuICAgIGxldCBjb3N0SGVhZFJhdGVBbmFseXNpc1Byb21pc2UgPSB0aGlzLmNyZWF0ZVByb21pc2UoY29zdEhlYWRVUkwpO1xyXG4gICAgbG9nZ2VyLmluZm8oJ2Nvc3RIZWFkUmF0ZUFuYWx5c2lzUHJvbWlzZSBmb3IgaGFzIGJlZW4gaGl0Jyk7XHJcblxyXG4gICAgbGV0IGNhdGVnb3J5VVJMID0gY29uZmlnLmdldChDb25zdGFudHMuUkFURV9BTkFMWVNJU19BUEkgKyBlbnRpdHkgKyBDb25zdGFudHMuUkFURV9BTkFMWVNJU19DQVRFR09SSUVTKVxyXG4gICAgICArIHJlZ2lvbi5SZWdpb25JZCArIGNvbmZpZy5nZXQoQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfQVBJICsgQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfQVBJX0VORFBPSU5UKTtcclxuICAgIGxldCBjYXRlZ29yeVJhdGVBbmFseXNpc1Byb21pc2UgPSB0aGlzLmNyZWF0ZVByb21pc2UoY2F0ZWdvcnlVUkwpO1xyXG4gICAgbG9nZ2VyLmluZm8oJ2NhdGVnb3J5UmF0ZUFuYWx5c2lzUHJvbWlzZSBmb3IgaGFzIGJlZW4gaGl0Jyk7XHJcblxyXG4gICAgbGV0IHdvcmtJdGVtVVJMID0gY29uZmlnLmdldChDb25zdGFudHMuUkFURV9BTkFMWVNJU19BUEkgKyBlbnRpdHkgKyBDb25zdGFudHMuUkFURV9BTkFMWVNJU19XT1JLSVRFTVMpXHJcbiAgICAgICsgcmVnaW9uLlJlZ2lvbklkICsgY29uZmlnLmdldChDb25zdGFudHMuUkFURV9BTkFMWVNJU19BUEkgKyBDb25zdGFudHMuUkFURV9BTkFMWVNJU19BUElfRU5EUE9JTlQpO1xyXG4gICAgbGV0IHdvcmtJdGVtUmF0ZUFuYWx5c2lzUHJvbWlzZSA9IHRoaXMuY3JlYXRlUHJvbWlzZSh3b3JrSXRlbVVSTCk7XHJcbiAgICBsb2dnZXIuaW5mbygnd29ya0l0ZW1SYXRlQW5hbHlzaXNQcm9taXNlIGZvciBoYXMgYmVlbiBoaXQnKTtcclxuXHJcbiAgICBsZXQgcmF0ZUl0ZW1VUkwgPSBjb25maWcuZ2V0KENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0FQSSArIGVudGl0eSArIENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX1JBVEUpXHJcbiAgICAgICsgcmVnaW9uLlJlZ2lvbklkICsgY29uZmlnLmdldChDb25zdGFudHMuUkFURV9BTkFMWVNJU19BUEkgKyBDb25zdGFudHMuUkFURV9BTkFMWVNJU19BUElfRU5EUE9JTlQpO1xyXG4gICAgbGV0IHJhdGVJdGVtUmF0ZUFuYWx5c2lzUHJvbWlzZSA9IHRoaXMuY3JlYXRlUHJvbWlzZShyYXRlSXRlbVVSTCk7XHJcbiAgICBsb2dnZXIuaW5mbygncmF0ZUl0ZW1SYXRlQW5hbHlzaXNQcm9taXNlIGZvciBoYXMgYmVlbiBoaXQnKTtcclxuXHJcbiAgICBsZXQgcmF0ZUFuYWx5c2lzTm90ZXNVUkwgPSBjb25maWcuZ2V0KENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0FQSSArIGVudGl0eSArIENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX05PVEVTKVxyXG4gICAgICArIHJlZ2lvbi5SZWdpb25JZCArIGNvbmZpZy5nZXQoQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfQVBJICsgQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfQVBJX0VORFBPSU5UKTtcclxuICAgIGxldCBub3Rlc1JhdGVBbmFseXNpc1Byb21pc2UgPSB0aGlzLmNyZWF0ZVByb21pc2UocmF0ZUFuYWx5c2lzTm90ZXNVUkwpO1xyXG4gICAgbG9nZ2VyLmluZm8oJ25vdGVzUmF0ZUFuYWx5c2lzUHJvbWlzZSBmb3IgaGFzIGJlZW4gaGl0Jyk7XHJcblxyXG4gICAgbGV0IGFsbFVuaXRzRnJvbVJhdGVBbmFseXNpc1VSTCA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfQVBJICsgZW50aXR5ICsgQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfVU5JVClcclxuICAgICAgKyByZWdpb24uUmVnaW9uSWQgKyBjb25maWcuZ2V0KENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0FQSSArIENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0FQSV9FTkRQT0lOVCk7XHJcbiAgICBsZXQgdW5pdHNSYXRlQW5hbHlzaXNQcm9taXNlID0gdGhpcy5jcmVhdGVQcm9taXNlKGFsbFVuaXRzRnJvbVJhdGVBbmFseXNpc1VSTCk7XHJcbiAgICBsb2dnZXIuaW5mbygndW5pdHNSYXRlQW5hbHlzaXNQcm9taXNlIGZvciBoYXMgYmVlbiBoaXQnKTtcclxuXHJcbiAgICBsb2dnZXIuaW5mbygnY2FsbGluZyBQcm9taXNlLmFsbCcpO1xyXG4gICAgQ0NQcm9taXNlLmFsbChbXHJcbiAgICAgIGNvc3RIZWFkUmF0ZUFuYWx5c2lzUHJvbWlzZSxcclxuICAgICAgY2F0ZWdvcnlSYXRlQW5hbHlzaXNQcm9taXNlLFxyXG4gICAgICB3b3JrSXRlbVJhdGVBbmFseXNpc1Byb21pc2UsXHJcbiAgICAgIHJhdGVJdGVtUmF0ZUFuYWx5c2lzUHJvbWlzZSxcclxuICAgICAgbm90ZXNSYXRlQW5hbHlzaXNQcm9taXNlLFxyXG4gICAgICB1bml0c1JhdGVBbmFseXNpc1Byb21pc2VcclxuICAgIF0pLnRoZW4oZnVuY3Rpb24gKGRhdGE6IEFycmF5PGFueT4pIHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ2NvbnZlcnRDb3N0SGVhZHNGcm9tUmF0ZUFuYWx5c2lzVG9Db3N0Q29udHJvbCBQcm9taXNlLmFsbCBBUEkgaXMgc3VjY2Vzcy4nKTtcclxuXHJcbiAgICAgIGlmKGRhdGFbMF1bQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfSVRFTV9UWVBFXSAmJiBkYXRhWzFdW0NvbnN0YW50cy5SQVRFX0FOQUxZU0lTX1NVQklURU1fVFlQRV0gJiZcclxuICAgICAgICBkYXRhWzJdW0NvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0lURU1TXSAmJiBkYXRhWzNdW0NvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0RBVEFdICYmXHJcbiAgICAgICAgZGF0YVs0XVtDb25zdGFudHMuUkFURV9BTkFMWVNJU19EQVRBXSAmJiBkYXRhWzVdW0NvbnN0YW50cy5SQVRFX0FOQUxZU0lTX1VPTV0pIHtcclxuXHJcbiAgICAgICAgbGV0IGNvc3RIZWFkc1JhdGVBbmFseXNpcyA9IGRhdGFbMF1bQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfSVRFTV9UWVBFXTtcclxuICAgICAgICBsZXQgY2F0ZWdvcmllc1JhdGVBbmFseXNpcyA9IGRhdGFbMV1bQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfU1VCSVRFTV9UWVBFXTtcclxuICAgICAgICBsZXQgd29ya0l0ZW1zUmF0ZUFuYWx5c2lzID0gZGF0YVsyXVtDb25zdGFudHMuUkFURV9BTkFMWVNJU19JVEVNU107XHJcbiAgICAgICAgbGV0IHJhdGVJdGVtc1JhdGVBbmFseXNpcyA9IGRhdGFbM11bQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfREFUQV07XHJcbiAgICAgICAgbGV0IG5vdGVzUmF0ZUFuYWx5c2lzID0gZGF0YVs0XVtDb25zdGFudHMuUkFURV9BTkFMWVNJU19EQVRBXTtcclxuICAgICAgICBsZXQgdW5pdHNSYXRlQW5hbHlzaXMgPSBkYXRhWzVdW0NvbnN0YW50cy5SQVRFX0FOQUxZU0lTX1VPTV07XHJcblxyXG4gICAgICAgIGxldCBidWlsZGluZ0Nvc3RIZWFkczogQXJyYXk8Q29zdEhlYWQ+ID0gW107XHJcbiAgICAgICAgbGV0IHJhdGVBbmFseXNpc1NlcnZpY2UgPSBuZXcgUmF0ZUFuYWx5c2lzU2VydmljZSgpO1xyXG5cclxuICAgICAgICByYXRlQW5hbHlzaXNTZXJ2aWNlLmdldENvc3RIZWFkc0Zyb21SYXRlQW5hbHlzaXMoY29zdEhlYWRzUmF0ZUFuYWx5c2lzLCBjYXRlZ29yaWVzUmF0ZUFuYWx5c2lzLCB3b3JrSXRlbXNSYXRlQW5hbHlzaXMsXHJcbiAgICAgICAgICByYXRlSXRlbXNSYXRlQW5hbHlzaXMsIHVuaXRzUmF0ZUFuYWx5c2lzLCBub3Rlc1JhdGVBbmFseXNpcywgYnVpbGRpbmdDb3N0SGVhZHMpO1xyXG4gICAgICAgIGxvZ2dlci5pbmZvKCdzdWNjZXNzIGluICBjb252ZXJ0Q29zdEhlYWRzRnJvbVJhdGVBbmFseXNpc1RvQ29zdENvbnRyb2wuJyk7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwge1xyXG4gICAgICAgICAgJ2J1aWxkaW5nQ29zdEhlYWRzJzogYnVpbGRpbmdDb3N0SGVhZHMsXHJcbiAgICAgICAgICAncmF0ZXMnOiByYXRlSXRlbXNSYXRlQW5hbHlzaXMsXHJcbiAgICAgICAgICAndW5pdHMnOiB1bml0c1JhdGVBbmFseXNpc1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgfVxyXG4gICAgfSkuY2F0Y2goZnVuY3Rpb24gKGU6IGFueSkge1xyXG4gICAgICBsb2dnZXIuZXJyb3IoJyBQcm9taXNlIGZhaWxlZCBmb3IgY29udmVydENvc3RIZWFkc0Zyb21SYXRlQW5hbHlzaXNUb0Nvc3RDb250cm9sICEgOicgKyBKU09OLnN0cmluZ2lmeShlLm1lc3NhZ2UpKTtcclxuICAgICAgQ0NQcm9taXNlLnJlamVjdChlLm1lc3NhZ2UpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBjcmVhdGVQcm9taXNlKHVybDogc3RyaW5nKSB7XHJcbiAgICByZXR1cm4gbmV3IENDUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZTogYW55LCByZWplY3Q6IGFueSkge1xyXG4gICAgICBsb2dnZXIuaW5mbygnY3JlYXRlUHJvbWlzZSBoYXMgYmVlbiBoaXQgZm9yIDogJyArIHVybCk7XHJcbiAgICAgIGxldCByYXRlQW5hbHlzaXNTZXJ2aWNlID0gbmV3IFJhdGVBbmFseXNpc1NlcnZpY2UoKTtcclxuICAgICAgcmF0ZUFuYWx5c2lzU2VydmljZS5nZXRBcGlDYWxsKHVybCwgKGVycm9yOiBhbnksIGRhdGE6IGFueSkgPT4ge1xyXG4gICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yIGluIGNyZWF0ZVByb21pc2UgZ2V0IGRhdGEgZnJvbSByYXRlIGFuYWx5c2lzOiAnICsgSlNPTi5zdHJpbmdpZnkoZXJyb3IpKTtcclxuICAgICAgICAgIHJlamVjdChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdjcmVhdGVQcm9taXNlIGRhdGEgZnJvbSByYXRlIGFuYWx5c2lzIHN1Y2Nlc3MuJyk7XHJcbiAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9KS5jYXRjaChmdW5jdGlvbiAoZTogYW55KSB7XHJcbiAgICAgIGxvZ2dlci5lcnJvcignUHJvbWlzZSBmYWlsZWQgZm9yIGluZGl2aWR1YWwgISB1cmw6JyArIHVybCArICc6XFxuIGVycm9yIDonICsgSlNPTi5zdHJpbmdpZnkoZS5tZXNzYWdlKSk7XHJcbiAgICAgIENDUHJvbWlzZS5yZWplY3QoZS5tZXNzYWdlKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0Q29zdEhlYWRzRnJvbVJhdGVBbmFseXNpcyhjb3N0SGVhZHNSYXRlQW5hbHlzaXM6IGFueSwgY2F0ZWdvcmllc1JhdGVBbmFseXNpczogYW55LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd29ya0l0ZW1zUmF0ZUFuYWx5c2lzOiBhbnksIHJhdGVJdGVtc1JhdGVBbmFseXNpczogYW55LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdHNSYXRlQW5hbHlzaXM6IGFueSwgbm90ZXNSYXRlQW5hbHlzaXM6IGFueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1aWxkaW5nQ29zdEhlYWRzOiBBcnJheTxDb3N0SGVhZD4pIHtcclxuICAgIGxvZ2dlci5pbmZvKCdnZXRDb3N0SGVhZHNGcm9tUmF0ZUFuYWx5c2lzIGhhcyBiZWVuIGhpdC4nKTtcclxuICAgIC8vbGV0IGJ1ZGdldENvc3RIZWFkcyA9IGNvbmZpZy5nZXQoJ2J1ZGdldGVkQ29zdEZvcm11bGFlJyk7XHJcbiAgICBmb3IgKGxldCBjb3N0SGVhZEluZGV4ID0gMDsgY29zdEhlYWRJbmRleCA8IGNvc3RIZWFkc1JhdGVBbmFseXNpcy5sZW5ndGg7IGNvc3RIZWFkSW5kZXgrKykge1xyXG5cclxuICAgICAgaWYgKGNvbmZpZy5oYXMoJ2J1ZGdldGVkQ29zdEZvcm11bGFlLicgKyBjb3N0SGVhZHNSYXRlQW5hbHlzaXNbY29zdEhlYWRJbmRleF0uQzIpKSB7XHJcbiAgICAgICAgbGV0IGNvc3RIZWFkID0gbmV3IENvc3RIZWFkKCk7XHJcbiAgICAgICAgY29zdEhlYWQubmFtZSA9IGNvc3RIZWFkc1JhdGVBbmFseXNpc1tjb3N0SGVhZEluZGV4XS5DMjtcclxuICAgICAgICBsZXQgY29uZmlnQ29zdEhlYWRzID0gY29uZmlnLmdldCgnY29uZmlnQ29zdEhlYWRzJyk7XHJcbiAgICAgICAgbGV0IGNhdGVnb3JpZXMgPSBuZXcgQXJyYXk8Q2F0ZWdvcnk+KCk7XHJcblxyXG4gICAgICAgIGlmIChjb25maWdDb3N0SGVhZHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgbGV0IGlzQ29zdEhlYWRFeGlzdFNRTCA9ICdTRUxFQ1QgKiBGUk9NID8gQVMgd29ya2l0ZW1zIFdIRVJFIFRSSU0od29ya2l0ZW1zLm5hbWUpPSA/JztcclxuICAgICAgICAgIGxldCBjb3N0SGVhZEV4aXN0QXJyYXkgPSBhbGFzcWwoaXNDb3N0SGVhZEV4aXN0U1FMLCBbY29uZmlnQ29zdEhlYWRzLCBjb3N0SGVhZC5uYW1lXSk7XHJcbiAgICAgICAgICBpZiAoY29zdEhlYWRFeGlzdEFycmF5Lmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICAgICAgICBjb3N0SGVhZC5wcmlvcml0eUlkID0gY29zdEhlYWRFeGlzdEFycmF5WzBdLnByaW9yaXR5SWQ7XHJcbiAgICAgICAgICAgIGNhdGVnb3JpZXMgPSBjb3N0SGVhZEV4aXN0QXJyYXlbMF0uY2F0ZWdvcmllcztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY29zdEhlYWQucmF0ZUFuYWx5c2lzSWQgPSBjb3N0SGVhZHNSYXRlQW5hbHlzaXNbY29zdEhlYWRJbmRleF0uQzE7XHJcblxyXG4gICAgICAgIGxldCBjYXRlZ29yaWVzUmF0ZUFuYWx5c2lzU1FMID0gJ1NFTEVDVCBDYXRlZ29yeS5DMSBBUyByYXRlQW5hbHlzaXNJZCwgQ2F0ZWdvcnkuQzIgQVMgbmFtZScgK1xyXG4gICAgICAgICAgJyBGUk9NID8gQVMgQ2F0ZWdvcnkgd2hlcmUgQ2F0ZWdvcnkuQzMgPSAnICsgY29zdEhlYWQucmF0ZUFuYWx5c2lzSWQ7XHJcblxyXG4gICAgICAgIGxldCBjYXRlZ29yaWVzQnlDb3N0SGVhZCA9IGFsYXNxbChjYXRlZ29yaWVzUmF0ZUFuYWx5c2lzU1FMLCBbY2F0ZWdvcmllc1JhdGVBbmFseXNpc10pO1xyXG4gICAgICAgIGxldCBidWlsZGluZ0NhdGVnb3JpZXM6IEFycmF5PENhdGVnb3J5PiA9IG5ldyBBcnJheTxDYXRlZ29yeT4oKTtcclxuXHJcbiAgICAgICAgaWYgKGNhdGVnb3JpZXNCeUNvc3RIZWFkLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgdGhpcy5nZXRXb3JrSXRlbXNXaXRob3V0Q2F0ZWdvcnlGcm9tUmF0ZUFuYWx5c2lzKGNvc3RIZWFkLnJhdGVBbmFseXNpc0lkLCB3b3JrSXRlbXNSYXRlQW5hbHlzaXMsXHJcbiAgICAgICAgICAgIHJhdGVJdGVtc1JhdGVBbmFseXNpcywgdW5pdHNSYXRlQW5hbHlzaXMsIG5vdGVzUmF0ZUFuYWx5c2lzLCBidWlsZGluZ0NhdGVnb3JpZXMsIGNhdGVnb3JpZXMpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLmdldENhdGVnb3JpZXNGcm9tUmF0ZUFuYWx5c2lzKGNhdGVnb3JpZXNCeUNvc3RIZWFkLCB3b3JrSXRlbXNSYXRlQW5hbHlzaXMsXHJcbiAgICAgICAgICAgIHJhdGVJdGVtc1JhdGVBbmFseXNpcywgdW5pdHNSYXRlQW5hbHlzaXMsIG5vdGVzUmF0ZUFuYWx5c2lzLCBidWlsZGluZ0NhdGVnb3JpZXMsIGNhdGVnb3JpZXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29zdEhlYWQuY2F0ZWdvcmllcyA9IGJ1aWxkaW5nQ2F0ZWdvcmllcztcclxuICAgICAgICBjb3N0SGVhZC50aHVtYlJ1bGVSYXRlID0gY29uZmlnLmdldChDb25zdGFudHMuVEhVTUJSVUxFX1JBVEUpO1xyXG4gICAgICAgIGJ1aWxkaW5nQ29zdEhlYWRzLnB1c2goY29zdEhlYWQpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdDb3N0SGVhZCBVbmF2YWlhbGFiZWwgOiAnICsgY29zdEhlYWRzUmF0ZUFuYWx5c2lzW2Nvc3RIZWFkSW5kZXhdLkMyKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0Q2F0ZWdvcmllc0Zyb21SYXRlQW5hbHlzaXMoY2F0ZWdvcmllc0J5Q29zdEhlYWQ6IGFueSwgd29ya0l0ZW1zUmF0ZUFuYWx5c2lzOiBhbnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzOiBhbnksIHVuaXRzUmF0ZUFuYWx5c2lzOiBhbnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm90ZXNSYXRlQW5hbHlzaXM6IGFueSwgYnVpbGRpbmdDYXRlZ29yaWVzOiBBcnJheTxDYXRlZ29yeT4sIGNvbmZpZ0NhdGVnb3JpZXM6IEFycmF5PENhdGVnb3J5Pikge1xyXG5cclxuICAgIGxvZ2dlci5pbmZvKCdnZXRDYXRlZ29yaWVzRnJvbVJhdGVBbmFseXNpcyBoYXMgYmVlbiBoaXQuJyk7XHJcblxyXG4gICAgZm9yIChsZXQgY2F0ZWdvcnlJbmRleCA9IDA7IGNhdGVnb3J5SW5kZXggPCBjYXRlZ29yaWVzQnlDb3N0SGVhZC5sZW5ndGg7IGNhdGVnb3J5SW5kZXgrKykge1xyXG5cclxuICAgICAgbGV0IGNhdGVnb3J5ID0gbmV3IENhdGVnb3J5KGNhdGVnb3JpZXNCeUNvc3RIZWFkW2NhdGVnb3J5SW5kZXhdLm5hbWUsIGNhdGVnb3JpZXNCeUNvc3RIZWFkW2NhdGVnb3J5SW5kZXhdLnJhdGVBbmFseXNpc0lkKTtcclxuICAgICAgbGV0IGNvbmZpZ1dvcmtJdGVtcyA9IG5ldyBBcnJheTxXb3JrSXRlbT4oKTtcclxuXHJcbiAgICAgIGlmIChjb25maWdDYXRlZ29yaWVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBmb3IgKGxldCBjb25maWdDYXRlZ29yeSBvZiBjb25maWdDYXRlZ29yaWVzKSB7XHJcbiAgICAgICAgICBpZiAoY29uZmlnQ2F0ZWdvcnkubmFtZSA9PT0gY2F0ZWdvcmllc0J5Q29zdEhlYWRbY2F0ZWdvcnlJbmRleF0ubmFtZSkge1xyXG4gICAgICAgICAgICBjb25maWdXb3JrSXRlbXMgPSBjb25maWdDYXRlZ29yeS53b3JrSXRlbXM7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgd29ya0l0ZW1zUmF0ZUFuYWx5c2lzU1FMID0gJ1NFTEVDVCB3b3JrSXRlbS5DMiBBUyByYXRlQW5hbHlzaXNJZCwgVFJJTSh3b3JrSXRlbS5DMykgQVMgbmFtZScgK1xyXG4gICAgICAgICcgRlJPTSA/IEFTIHdvcmtJdGVtIHdoZXJlIHdvcmtJdGVtLkM0ID0gJyArIGNhdGVnb3JpZXNCeUNvc3RIZWFkW2NhdGVnb3J5SW5kZXhdLnJhdGVBbmFseXNpc0lkO1xyXG5cclxuICAgICAgbGV0IHdvcmtJdGVtc0J5Q2F0ZWdvcnkgPSBhbGFzcWwod29ya0l0ZW1zUmF0ZUFuYWx5c2lzU1FMLCBbd29ya0l0ZW1zUmF0ZUFuYWx5c2lzXSk7XHJcbiAgICAgIGxldCBidWlsZGluZ1dvcmtJdGVtczogQXJyYXk8V29ya0l0ZW0+ID0gbmV3IEFycmF5PFdvcmtJdGVtPigpO1xyXG5cclxuICAgICAgdGhpcy5nZXRXb3JrSXRlbXNGcm9tUmF0ZUFuYWx5c2lzKHdvcmtJdGVtc0J5Q2F0ZWdvcnksIHJhdGVJdGVtc1JhdGVBbmFseXNpcyxcclxuICAgICAgICB1bml0c1JhdGVBbmFseXNpcywgbm90ZXNSYXRlQW5hbHlzaXMsIGJ1aWxkaW5nV29ya0l0ZW1zLCBjb25maWdXb3JrSXRlbXMpO1xyXG5cclxuICAgICAgY2F0ZWdvcnkud29ya0l0ZW1zID0gYnVpbGRpbmdXb3JrSXRlbXM7XHJcbiAgICAgIGlmIChjYXRlZ29yeS53b3JrSXRlbXMubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgYnVpbGRpbmdDYXRlZ29yaWVzLnB1c2goY2F0ZWdvcnkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGNvbmZpZ0NhdGVnb3JpZXMubGVuZ3RoID4gMCkge1xyXG5cclxuICAgICAgZm9yIChsZXQgY29uZmlnQ2F0ZWdvcnlJbmRleCA9IDA7IGNvbmZpZ0NhdGVnb3J5SW5kZXggPCBjb25maWdDYXRlZ29yaWVzLmxlbmd0aDsgY29uZmlnQ2F0ZWdvcnlJbmRleCsrKSB7XHJcbiAgICAgICAgbGV0IGlzQ2F0ZWdvcnlFeGlzdHNTUUwgPSAnU0VMRUNUICogRlJPTSA/IEFTIHdvcmtpdGVtcyBXSEVSRSBUUklNKHdvcmtpdGVtcy5uYW1lKT0gPyc7XHJcbiAgICAgICAgbGV0IGNhdGVnb3J5RXhpc3RzQXJyYXkgPSBhbGFzcWwoaXNDYXRlZ29yeUV4aXN0c1NRTCwgW2NhdGVnb3JpZXNCeUNvc3RIZWFkLCBjb25maWdDYXRlZ29yaWVzW2NvbmZpZ0NhdGVnb3J5SW5kZXhdLm5hbWVdKTtcclxuICAgICAgICBpZiAoY2F0ZWdvcnlFeGlzdHNBcnJheS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgIGxldCBjb25maWdDYXQgPSBuZXcgQ2F0ZWdvcnkoY29uZmlnQ2F0ZWdvcmllc1tjb25maWdDYXRlZ29yeUluZGV4XS5uYW1lLCBjb25maWdDYXRlZ29yaWVzW2NvbmZpZ0NhdGVnb3J5SW5kZXhdLnJhdGVBbmFseXNpc0lkKTtcclxuICAgICAgICAgIGNvbmZpZ0NhdC53b3JrSXRlbXMgPSB0aGlzLmdldFdvcmtpdGVtc0ZvckNvbmZpZ0NhdGVnb3J5KGNvbmZpZ0NhdGVnb3JpZXNbY29uZmlnQ2F0ZWdvcnlJbmRleF0ud29ya0l0ZW1zKTtcclxuICAgICAgICAgIGlmIChjb25maWdDYXQud29ya0l0ZW1zLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICAgICAgICBidWlsZGluZ0NhdGVnb3JpZXMucHVzaChjb25maWdDYXQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0V29ya2l0ZW1zRm9yQ29uZmlnQ2F0ZWdvcnkoY29uZmlnV29ya2l0ZW1zOiBhbnkpIHtcclxuICAgIGxldCB3b3JrSXRlbXNMaXN0ID0gbmV3IEFycmF5PFdvcmtJdGVtPigpO1xyXG4gICAgZm9yIChsZXQgd29ya2l0ZW1JbmRleCA9IDA7IHdvcmtpdGVtSW5kZXggPCBjb25maWdXb3JraXRlbXMubGVuZ3RoOyB3b3JraXRlbUluZGV4KyspIHtcclxuICAgICAgbGV0IGNvbmZpZ1dvcmtpdGVtID0gdGhpcy5jb252ZXJ0Q29uZmlnb3JraXRlbShjb25maWdXb3JraXRlbXNbd29ya2l0ZW1JbmRleF0pO1xyXG4gICAgICB3b3JrSXRlbXNMaXN0LnB1c2goY29uZmlnV29ya2l0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHdvcmtJdGVtc0xpc3Q7XHJcbiAgfVxyXG5cclxuICBnZXRXb3JrSXRlbXNXaXRob3V0Q2F0ZWdvcnlGcm9tUmF0ZUFuYWx5c2lzKGNvc3RIZWFkUmF0ZUFuYWx5c2lzSWQ6IG51bWJlciwgd29ya0l0ZW1zUmF0ZUFuYWx5c2lzOiBhbnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByYXRlSXRlbXNSYXRlQW5hbHlzaXM6IGFueSwgdW5pdHNSYXRlQW5hbHlzaXM6IGFueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vdGVzUmF0ZUFuYWx5c2lzOiBhbnksIGJ1aWxkaW5nQ2F0ZWdvcmllczogQXJyYXk8Q2F0ZWdvcnk+LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnQ2F0ZWdvcmllczogQXJyYXk8Q2F0ZWdvcnk+KSB7XHJcblxyXG4gICAgbG9nZ2VyLmluZm8oJ2dldFdvcmtJdGVtc1dpdGhvdXRDYXRlZ29yeUZyb21SYXRlQW5hbHlzaXMgaGFzIGJlZW4gaGl0LicpO1xyXG5cclxuICAgIGxldCB3b3JrSXRlbXNXaXRob3V0Q2F0ZWdvcmllc1JhdGVBbmFseXNpc1NRTCA9ICdTRUxFQ1Qgd29ya0l0ZW0uQzIgQVMgcmF0ZUFuYWx5c2lzSWQsIHdvcmtJdGVtLkMzIEFTIG5hbWUnICtcclxuICAgICAgJyBGUk9NID8gQVMgd29ya0l0ZW0gd2hlcmUgTk9UIHdvcmtJdGVtLkM0IEFORCB3b3JrSXRlbS5DMSA9ICcgKyBjb3N0SGVhZFJhdGVBbmFseXNpc0lkO1xyXG4gICAgbGV0IHdvcmtJdGVtc1dpdGhvdXRDYXRlZ29yaWVzID0gYWxhc3FsKHdvcmtJdGVtc1dpdGhvdXRDYXRlZ29yaWVzUmF0ZUFuYWx5c2lzU1FMLCBbd29ya0l0ZW1zUmF0ZUFuYWx5c2lzXSk7XHJcblxyXG4gICAgbGV0IGJ1aWxkaW5nV29ya0l0ZW1zOiBBcnJheTxXb3JrSXRlbT4gPSBuZXcgQXJyYXk8V29ya0l0ZW0+KCk7XHJcbiAgICBsZXQgY2F0ZWdvcnkgPSBuZXcgQ2F0ZWdvcnkoJ1dvcmsgSXRlbXMnLCAwKTtcclxuICAgIGxldCBjb25maWdXb3JrSXRlbXMgPSBuZXcgQXJyYXk8V29ya0l0ZW0+KCk7XHJcblxyXG4gICAgaWYgKGNvbmZpZ0NhdGVnb3JpZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICBmb3IgKGxldCBjb25maWdDYXRlZ29yeSBvZiBjb25maWdDYXRlZ29yaWVzKSB7XHJcbiAgICAgICAgaWYgKGNvbmZpZ0NhdGVnb3J5Lm5hbWUgPT09ICdXb3JrIEl0ZW1zJykge1xyXG4gICAgICAgICAgY29uZmlnV29ya0l0ZW1zID0gY29uZmlnQ2F0ZWdvcnkud29ya0l0ZW1zO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZ2V0V29ya0l0ZW1zRnJvbVJhdGVBbmFseXNpcyh3b3JrSXRlbXNXaXRob3V0Q2F0ZWdvcmllcywgcmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzLFxyXG4gICAgICB1bml0c1JhdGVBbmFseXNpcywgbm90ZXNSYXRlQW5hbHlzaXMsIGJ1aWxkaW5nV29ya0l0ZW1zLCBjb25maWdXb3JrSXRlbXMpO1xyXG5cclxuICAgIGNhdGVnb3J5LndvcmtJdGVtcyA9IGJ1aWxkaW5nV29ya0l0ZW1zO1xyXG4gICAgYnVpbGRpbmdDYXRlZ29yaWVzLnB1c2goY2F0ZWdvcnkpO1xyXG4gIH1cclxuXHJcbiAgc3luY1JhdGVpdGVtRnJvbVJhdGVBbmFseXNpcyhlbnRpdHk6IHN0cmluZywgYnVpbGRpbmdEZXRhaWxzOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgZGF0YTogYW55KSA9PiB2b2lkKSB7XHJcblxyXG4gICAgbGV0IHJhdGVJdGVtVVJMID0gY29uZmlnLmdldChDb25zdGFudHMuUkFURV9BTkFMWVNJU19BUEkgKyBlbnRpdHkgKyBDb25zdGFudHMuUkFURV9BTkFMWVNJU19SQVRFKTtcclxuICAgIGxldCByYXRlSXRlbVJhdGVBbmFseXNpc1Byb21pc2UgPSB0aGlzLmNyZWF0ZVByb21pc2UocmF0ZUl0ZW1VUkwpO1xyXG4gICAgbG9nZ2VyLmluZm8oJ3JhdGVJdGVtUmF0ZUFuYWx5c2lzUHJvbWlzZSBmb3IgaGFzIGJlZW4gaGl0Jyk7XHJcblxyXG4gICAgbGV0IHJhdGVBbmFseXNpc05vdGVzVVJMID0gY29uZmlnLmdldChDb25zdGFudHMuUkFURV9BTkFMWVNJU19BUEkgKyBlbnRpdHkgKyBDb25zdGFudHMuUkFURV9BTkFMWVNJU19OT1RFUyk7XHJcbiAgICBsZXQgbm90ZXNSYXRlQW5hbHlzaXNQcm9taXNlID0gdGhpcy5jcmVhdGVQcm9taXNlKHJhdGVBbmFseXNpc05vdGVzVVJMKTtcclxuICAgIGxvZ2dlci5pbmZvKCdub3Rlc1JhdGVBbmFseXNpc1Byb21pc2UgZm9yIGhhcyBiZWVuIGhpdCcpO1xyXG5cclxuICAgIGxldCBhbGxVbml0c0Zyb21SYXRlQW5hbHlzaXNVUkwgPSBjb25maWcuZ2V0KENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0FQSSArIGVudGl0eSArIENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX1VOSVQpO1xyXG4gICAgbGV0IHVuaXRzUmF0ZUFuYWx5c2lzUHJvbWlzZSA9IHRoaXMuY3JlYXRlUHJvbWlzZShhbGxVbml0c0Zyb21SYXRlQW5hbHlzaXNVUkwpO1xyXG4gICAgbG9nZ2VyLmluZm8oJ3VuaXRzUmF0ZUFuYWx5c2lzUHJvbWlzZSBmb3IgaGFzIGJlZW4gaGl0Jyk7XHJcblxyXG4gICAgbGV0IGNvc3RIZWFkVVJMID0gY29uZmlnLmdldChDb25zdGFudHMuUkFURV9BTkFMWVNJU19BUEkgKyBlbnRpdHkgKyBDb25zdGFudHMuUkFURV9BTkFMWVNJU19DT1NUSEVBRFMpO1xyXG4gICAgbGV0IGNvc3RIZWFkUmF0ZUFuYWx5c2lzUHJvbWlzZSA9IHRoaXMuY3JlYXRlUHJvbWlzZShjb3N0SGVhZFVSTCk7XHJcbiAgICBsb2dnZXIuaW5mbygnY29zdEhlYWRSYXRlQW5hbHlzaXNQcm9taXNlIGZvciBoYXMgYmVlbiBoaXQnKTtcclxuXHJcbiAgICBDQ1Byb21pc2UuYWxsKFtcclxuICAgICAgcmF0ZUl0ZW1SYXRlQW5hbHlzaXNQcm9taXNlLFxyXG4gICAgICBub3Rlc1JhdGVBbmFseXNpc1Byb21pc2UsXHJcbiAgICAgIHVuaXRzUmF0ZUFuYWx5c2lzUHJvbWlzZSxcclxuICAgICAgY29zdEhlYWRSYXRlQW5hbHlzaXNQcm9taXNlXHJcbiAgICBdKS50aGVuKGZ1bmN0aW9uIChkYXRhOiBBcnJheTxhbnk+KSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdjb252ZXJ0Q29zdEhlYWRzRnJvbVJhdGVBbmFseXNpc1RvQ29zdENvbnRyb2wgUHJvbWlzZS5hbGwgQVBJIGlzIHN1Y2Nlc3MuJyk7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdzdWNjZXNzIGluICBjb252ZXJ0Q29zdEhlYWRzRnJvbVJhdGVBbmFseXNpc1RvQ29zdENvbnRyb2wuJyk7XHJcbiAgICAgIGNhbGxiYWNrKG51bGwsIGRhdGEpO1xyXG4gICAgfSkuY2F0Y2goZnVuY3Rpb24gKGU6IGFueSkge1xyXG4gICAgICBsb2dnZXIuZXJyb3IoJyBQcm9taXNlIGZhaWxlZCBmb3IgY29udmVydENvc3RIZWFkc0Zyb21SYXRlQW5hbHlzaXNUb0Nvc3RDb250cm9sICEgOicgKyBlLm1lc3NhZ2UpO1xyXG4gICAgICBDQ1Byb21pc2UucmVqZWN0KGUubWVzc2FnZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG5cclxuICBnZXRXb3JrSXRlbXNGcm9tUmF0ZUFuYWx5c2lzKHdvcmtJdGVtc0J5Q2F0ZWdvcnk6IGFueSwgcmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzOiBhbnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0c1JhdGVBbmFseXNpczogYW55LCBub3Rlc1JhdGVBbmFseXNpczogYW55LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVpbGRpbmdXb3JrSXRlbXM6IEFycmF5PFdvcmtJdGVtPiwgY29uZmlnV29ya0l0ZW1zOiBBcnJheTxhbnk+KSB7XHJcblxyXG4gICAgbG9nZ2VyLmluZm8oJ2dldFdvcmtJdGVtc0Zyb21SYXRlQW5hbHlzaXMgaGFzIGJlZW4gaGl0LicpO1xyXG4gICAgZm9yIChsZXQgY2F0ZWdvcnlXb3JraXRlbSBvZiB3b3JrSXRlbXNCeUNhdGVnb3J5KSB7XHJcbiAgICAgIGxldCB3b3JrSXRlbSA9IHRoaXMuZ2V0UmF0ZUFuYWx5c2lzKGNhdGVnb3J5V29ya2l0ZW0sIGNvbmZpZ1dvcmtJdGVtcywgcmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzLFxyXG4gICAgICAgIHVuaXRzUmF0ZUFuYWx5c2lzLCBub3Rlc1JhdGVBbmFseXNpcyk7XHJcbiAgICAgIGlmICh3b3JrSXRlbSkge1xyXG4gICAgICAgIGJ1aWxkaW5nV29ya0l0ZW1zLnB1c2god29ya0l0ZW0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBmb3IgKGxldCBjb25maWdXb3JrSXRlbSBvZiBjb25maWdXb3JrSXRlbXMpIHtcclxuICAgICAgbGV0IGlzV29ya0l0ZW1FeGlzdFNRTCA9ICdTRUxFQ1QgKiBGUk9NID8gQVMgd29ya2l0ZW1zIFdIRVJFIFRSSU0od29ya2l0ZW1zLm5hbWUpPSA/JztcclxuICAgICAgbGV0IHdvcmtJdGVtRXhpc3RBcnJheSA9IGFsYXNxbChpc1dvcmtJdGVtRXhpc3RTUUwsIFt3b3JrSXRlbXNCeUNhdGVnb3J5LCBjb25maWdXb3JrSXRlbS5uYW1lXSk7XHJcbiAgICAgIGlmICh3b3JrSXRlbUV4aXN0QXJyYXkubGVuZ3RoID09PSAwICYmIGNvbmZpZ1dvcmtJdGVtLnJhdGVBbmFseXNpc0lkKSB7XHJcbiAgICAgICAgbGV0IHdvcmtpdGVtID0gdGhpcy5jb252ZXJ0Q29uZmlnb3JraXRlbShjb25maWdXb3JrSXRlbSk7XHJcbiAgICAgICAgYnVpbGRpbmdXb3JrSXRlbXMucHVzaCh3b3JraXRlbSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNvbnZlcnRDb25maWdvcmtpdGVtKGNvbmZpZ1dvcmtJdGVtOiBhbnkpIHtcclxuXHJcbiAgICBsZXQgd29ya0l0ZW0gPSBuZXcgV29ya0l0ZW0oY29uZmlnV29ya0l0ZW0ubmFtZSwgY29uZmlnV29ya0l0ZW0ucmF0ZUFuYWx5c2lzSWQpO1xyXG4gICAgd29ya0l0ZW0uaXNEaXJlY3RSYXRlID0gIWNvbmZpZ1dvcmtJdGVtLmlzUmF0ZUFuYWx5c2lzO1xyXG4gICAgd29ya0l0ZW0uaXNSYXRlQW5hbHlzaXMgPSBjb25maWdXb3JrSXRlbS5pc1JhdGVBbmFseXNpcztcclxuICAgIHdvcmtJdGVtLmlzTWVhc3VyZW1lbnRTaGVldCA9IGNvbmZpZ1dvcmtJdGVtLmlzTWVhc3VyZW1lbnRTaGVldDtcclxuICAgIHdvcmtJdGVtLmlzU3RlZWxXb3JrSXRlbSA9IGNvbmZpZ1dvcmtJdGVtLmlzU3RlZWxXb3JrSXRlbTtcclxuICAgIHdvcmtJdGVtLnJhdGVBbmFseXNpc1BlclVuaXQgPSBjb25maWdXb3JrSXRlbS5yYXRlQW5hbHlzaXNQZXJVbml0O1xyXG4gICAgd29ya0l0ZW0ucmF0ZUFuYWx5c2lzVW5pdCA9IGNvbmZpZ1dvcmtJdGVtLnJhdGVBbmFseXNpc1VuaXQ7XHJcbiAgICB3b3JrSXRlbS5pc0l0ZW1CcmVha2Rvd25SZXF1aXJlZCA9IGNvbmZpZ1dvcmtJdGVtLmlzSXRlbUJyZWFrZG93blJlcXVpcmVkO1xyXG4gICAgd29ya0l0ZW0ubGVuZ3RoID0gY29uZmlnV29ya0l0ZW0ubGVuZ3RoO1xyXG4gICAgd29ya0l0ZW0uYnJlYWR0aE9yV2lkdGggPSBjb25maWdXb3JrSXRlbS5icmVhZHRoT3JXaWR0aDtcclxuICAgIHdvcmtJdGVtLmhlaWdodCA9IGNvbmZpZ1dvcmtJdGVtLmhlaWdodDtcclxuICAgIHdvcmtJdGVtLnVuaXQgPSBjb25maWdXb3JrSXRlbS5tZWFzdXJlbWVudFVuaXQ7XHJcblxyXG4gICAgaWYgKCFjb25maWdXb3JrSXRlbS5pc1JhdGVBbmFseXNpcykge1xyXG4gICAgICB3b3JrSXRlbS5yYXRlLnRvdGFsID0gY29uZmlnV29ya0l0ZW0uZGlyZWN0UmF0ZTtcclxuICAgICAgd29ya0l0ZW0ucmF0ZS51bml0ID0gY29uZmlnV29ya0l0ZW0uZGlyZWN0UmF0ZVBlclVuaXQ7XHJcbiAgICAgIHdvcmtJdGVtLnJhdGUuaXNFc3RpbWF0ZWQgPSB0cnVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbG9nZ2VyLmVycm9yKCdXb3JrSXRlbSBlcnJvciBmb3IgcmF0ZUFuYWx5c2lzIDogJyArIGNvbmZpZ1dvcmtJdGVtLm5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB3b3JrSXRlbTtcclxuICB9XHJcblxyXG4gIGdldFJhdGVBbmFseXNpcyhjYXRlZ29yeVdvcmtpdGVtOiBXb3JrSXRlbSwgY29uZmlnV29ya0l0ZW1zOiBBcnJheTxhbnk+LCByYXRlSXRlbXNSYXRlQW5hbHlzaXM6IGFueSxcclxuICAgICAgICAgICAgICAgICAgdW5pdHNSYXRlQW5hbHlzaXM6IGFueSwgbm90ZXNSYXRlQW5hbHlzaXM6IGFueSkge1xyXG5cclxuICAgIGxldCBpc1dvcmtJdGVtRXhpc3RTUUwgPSAnU0VMRUNUICogRlJPTSA/IEFTIHdvcmtpdGVtcyBXSEVSRSBUUklNKHdvcmtpdGVtcy5uYW1lKT0gPyc7XHJcbiAgICBsZXQgd29ya0l0ZW1FeGlzdEFycmF5ID0gYWxhc3FsKGlzV29ya0l0ZW1FeGlzdFNRTCwgW2NvbmZpZ1dvcmtJdGVtcywgY2F0ZWdvcnlXb3JraXRlbS5uYW1lXSk7XHJcblxyXG4gICAgaWYgKHdvcmtJdGVtRXhpc3RBcnJheS5sZW5ndGggIT09IDApIHtcclxuXHJcbiAgICAgIGxldCB3b3JrSXRlbSA9IG5ldyBXb3JrSXRlbShjYXRlZ29yeVdvcmtpdGVtLm5hbWUsIGNhdGVnb3J5V29ya2l0ZW0ucmF0ZUFuYWx5c2lzSWQpO1xyXG5cclxuICAgICAgaWYgKGNhdGVnb3J5V29ya2l0ZW0uYWN0aXZlICE9PSB1bmRlZmluZWQgJiYgY2F0ZWdvcnlXb3JraXRlbS5hY3RpdmUgIT09IG51bGwpIHtcclxuICAgICAgICB3b3JrSXRlbSA9IGNhdGVnb3J5V29ya2l0ZW07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHdvcmtJdGVtLnVuaXQgPSB3b3JrSXRlbUV4aXN0QXJyYXlbMF0ubWVhc3VyZW1lbnRVbml0O1xyXG4gICAgICB3b3JrSXRlbS5pc01lYXN1cmVtZW50U2hlZXQgPSB3b3JrSXRlbUV4aXN0QXJyYXlbMF0uaXNNZWFzdXJlbWVudFNoZWV0O1xyXG4gICAgICB3b3JrSXRlbS5pc1JhdGVBbmFseXNpcyA9IHdvcmtJdGVtRXhpc3RBcnJheVswXS5pc1JhdGVBbmFseXNpcztcclxuICAgICAgd29ya0l0ZW0uaXNTdGVlbFdvcmtJdGVtID0gd29ya0l0ZW1FeGlzdEFycmF5WzBdLmlzU3RlZWxXb3JrSXRlbTtcclxuICAgICAgd29ya0l0ZW0ucmF0ZUFuYWx5c2lzUGVyVW5pdCA9IHdvcmtJdGVtRXhpc3RBcnJheVswXS5yYXRlQW5hbHlzaXNQZXJVbml0O1xyXG4gICAgICB3b3JrSXRlbS5pc0l0ZW1CcmVha2Rvd25SZXF1aXJlZCA9IHdvcmtJdGVtRXhpc3RBcnJheVswXS5pc0l0ZW1CcmVha2Rvd25SZXF1aXJlZDtcclxuICAgICAgd29ya0l0ZW0ubGVuZ3RoID0gd29ya0l0ZW1FeGlzdEFycmF5WzBdLmxlbmd0aDtcclxuICAgICAgd29ya0l0ZW0uYnJlYWR0aE9yV2lkdGggPSB3b3JrSXRlbUV4aXN0QXJyYXlbMF0uYnJlYWR0aE9yV2lkdGg7XHJcbiAgICAgIHdvcmtJdGVtLmhlaWdodCA9IHdvcmtJdGVtRXhpc3RBcnJheVswXS5oZWlnaHQ7XHJcblxyXG4gICAgICBsZXQgcmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzU1FMID0gJ1NFTEVDVCByYXRlSXRlbS5DMiBBUyBpdGVtTmFtZSwgcmF0ZUl0ZW0uQzIgQVMgb3JpZ2luYWxJdGVtTmFtZSwnICtcclxuICAgICAgICAncmF0ZUl0ZW0uQzEyIEFTIHJhdGVBbmFseXNpc0lkLCByYXRlSXRlbS5DNiBBUyB0eXBlLCcgK1xyXG4gICAgICAgICdST1VORChyYXRlSXRlbS5DNywyKSBBUyBxdWFudGl0eSwgUk9VTkQocmF0ZUl0ZW0uQzMsMikgQVMgcmF0ZSwgdW5pdC5DMiBBUyB1bml0LCcgK1xyXG4gICAgICAgICdST1VORChyYXRlSXRlbS5DMyAqIHJhdGVJdGVtLkM3LDIpIEFTIHRvdGFsQW1vdW50LCByYXRlSXRlbS5DNSBBUyB0b3RhbFF1YW50aXR5LCByYXRlSXRlbS5DMTMgQVMgbm90ZXNSYXRlQW5hbHlzaXNJZCAgJyArXHJcbiAgICAgICAgJ0ZST00gPyBBUyByYXRlSXRlbSBKT0lOID8gQVMgdW5pdCBPTiB1bml0LkMxID0gcmF0ZUl0ZW0uQzkgd2hlcmUgcmF0ZUl0ZW0uQzEgPSAnXHJcbiAgICAgICAgKyBjYXRlZ29yeVdvcmtpdGVtLnJhdGVBbmFseXNpc0lkO1xyXG4gICAgICBsZXQgcmF0ZUl0ZW1zQnlXb3JrSXRlbSA9IGFsYXNxbChyYXRlSXRlbXNSYXRlQW5hbHlzaXNTUUwsIFtyYXRlSXRlbXNSYXRlQW5hbHlzaXMsIHVuaXRzUmF0ZUFuYWx5c2lzXSk7XHJcbiAgICAgIGxldCBub3RlcyA9ICcnO1xyXG4gICAgICBsZXQgaW1hZ2VVUkwgPSAnJztcclxuICAgICAgd29ya0l0ZW0ucmF0ZS5yYXRlSXRlbXMgPSByYXRlSXRlbXNCeVdvcmtJdGVtO1xyXG4gICAgICB3b3JrSXRlbS5yYXRlLnVuaXQgPSB3b3JrSXRlbUV4aXN0QXJyYXlbMF0ucmF0ZUFuYWx5c2lzVW5pdDtcclxuXHJcbiAgICAgIGlmIChyYXRlSXRlbXNCeVdvcmtJdGVtICYmIHJhdGVJdGVtc0J5V29ya0l0ZW0ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGxldCBub3Rlc1JhdGVBbmFseXNpc1NRTCA9ICdTRUxFQ1Qgbm90ZXMuQzIgQVMgbm90ZXMsIG5vdGVzLkMzIEFTIGltYWdlVVJMIEZST00gPyBBUyBub3RlcyB3aGVyZSBub3Rlcy5DMSA9ICcgK1xyXG4gICAgICAgICAgcmF0ZUl0ZW1zQnlXb3JrSXRlbVswXS5ub3Rlc1JhdGVBbmFseXNpc0lkO1xyXG4gICAgICAgIGxldCBub3Rlc0xpc3QgPSBhbGFzcWwobm90ZXNSYXRlQW5hbHlzaXNTUUwsIFtub3Rlc1JhdGVBbmFseXNpc10pO1xyXG4gICAgICAgIG5vdGVzID0gbm90ZXNMaXN0WzBdLm5vdGVzO1xyXG4gICAgICAgIGltYWdlVVJMID0gbm90ZXNMaXN0WzBdLmltYWdlVVJMO1xyXG5cclxuICAgICAgICB3b3JrSXRlbS5yYXRlLnF1YW50aXR5ID0gcmF0ZUl0ZW1zQnlXb3JrSXRlbVswXS50b3RhbFF1YW50aXR5O1xyXG4gICAgICAgIHdvcmtJdGVtLnN5c3RlbVJhdGUucXVhbnRpdHkgPSByYXRlSXRlbXNCeVdvcmtJdGVtWzBdLnRvdGFsUXVhbnRpdHk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgd29ya0l0ZW0ucmF0ZS5xdWFudGl0eSA9IDE7XHJcbiAgICAgICAgd29ya0l0ZW0uc3lzdGVtUmF0ZS5xdWFudGl0eSA9IDE7XHJcbiAgICAgIH1cclxuICAgICAgd29ya0l0ZW0ucmF0ZS5pc0VzdGltYXRlZCA9IHRydWU7XHJcbiAgICAgIHdvcmtJdGVtLnJhdGUubm90ZXMgPSBub3RlcztcclxuICAgICAgd29ya0l0ZW0ucmF0ZS5pbWFnZVVSTCA9IGltYWdlVVJMO1xyXG5cclxuICAgICAgLy9TeXN0ZW0gcmF0ZVxyXG5cclxuICAgICAgd29ya0l0ZW0uc3lzdGVtUmF0ZS5yYXRlSXRlbXMgPSByYXRlSXRlbXNCeVdvcmtJdGVtO1xyXG4gICAgICB3b3JrSXRlbS5zeXN0ZW1SYXRlLm5vdGVzID0gbm90ZXM7XHJcbiAgICAgIHdvcmtJdGVtLnN5c3RlbVJhdGUuaW1hZ2VVUkwgPSBpbWFnZVVSTDtcclxuICAgICAgcmV0dXJuIHdvcmtJdGVtO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG5cclxuICBzeW5jQWxsUmVnaW9ucygpIHtcclxuICAgIGxldCByZWdpb25PYmogPSB7XHJcbiAgICAgICdSZWdpb25JZCcgOiAxLFxyXG4gICAgICAnUmVnaW9uQ29kZScgOiAnTUgnLFxyXG4gICAgICAnUmVnaW9uJyA6ICdNYWhhcmFzaHRyYSBQdW5lIENpcmNsZSdcclxuICAgIH07XHJcbiAgICB0aGlzLlN5bmNSYXRlQW5hbHlzaXMocmVnaW9uT2JqKTtcclxuICAgIC8qdGhpcy5nZXRBbGxyZWdpb25zRnJvbVJhdGVBbmFseXNpcygoZXJyb3IsIHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdlcnJvciA6ICcgKyBKU09OLnN0cmluZ2lmeShlcnJvcikpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdyZXNwb25zZSA6ICcgKyBKU09OLnN0cmluZ2lmeShyZXNwb25zZSkpO1xyXG4gICAgICAgIGZvciAobGV0IHJlZ2lvbiBvZiByZXNwb25zZSkge1xyXG4gICAgICAgICAgdGhpcy5TeW5jUmF0ZUFuYWx5c2lzKHJlZ2lvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTsqL1xyXG4gIH1cclxuXHJcbiAgU3luY1JhdGVBbmFseXNpcyhyZWdpb246IGFueSkge1xyXG4gICAgbGV0IHJhdGVBbmFseXNpc1NlcnZpY2UgPSBuZXcgUmF0ZUFuYWx5c2lzU2VydmljZSgpO1xyXG4gICAgdGhpcy5jb252ZXJ0Q29zdEhlYWRzRnJvbVJhdGVBbmFseXNpc1RvQ29zdENvbnRyb2woQ29uc3RhbnRzLkJVSUxESU5HLCByZWdpb24sIChlcnJvcjogYW55LCBidWlsZGluZ0RhdGE6IGFueSkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBsb2dnZXIuZXJyb3IoJ1JhdGVBbmFseXNpcyBTeW5jIEZhaWxlZC4nKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmNvbnZlcnRDb3N0SGVhZHNGcm9tUmF0ZUFuYWx5c2lzVG9Db3N0Q29udHJvbChDb25zdGFudHMuQlVJTERJTkcsIHJlZ2lvbiwgKGVycm9yOiBhbnksIHByb2plY3REYXRhOiBhbnkpID0+IHtcclxuICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICBsb2dnZXIuZXJyb3IoJ1JhdGVBbmFseXNpcyBTeW5jIEZhaWxlZC4nKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBidWlsZGluZ0Nvc3RIZWFkcyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoYnVpbGRpbmdEYXRhLmJ1aWxkaW5nQ29zdEhlYWRzKSk7XHJcbiAgICAgICAgICAgIGxldCBwcm9qZWN0Q29zdEhlYWRzID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShwcm9qZWN0RGF0YS5idWlsZGluZ0Nvc3RIZWFkcykpO1xyXG4gICAgICAgICAgICBsZXQgY29uZmlnQ29zdEhlYWRzID0gY29uZmlnLmdldCgnY29uZmlnQ29zdEhlYWRzJyk7XHJcbiAgICAgICAgICAgIGxldCBjb25maWdQcm9qZWN0Q29zdEhlYWRzID0gY29uZmlnLmdldCgnY29uZmlnUHJvamVjdENvc3RIZWFkcycpO1xyXG4gICAgICAgICAgICBsZXQgZml4ZWRDb3N0Q29uZmlnUHJvamVjdENvc3RIZWFkcyA9IGNvbmZpZy5nZXQoJ2ZpeGVkQ29zdENvbmZpZ1Byb2plY3RDb3N0SGVhZHMnKTtcclxuICAgICAgICAgICAgdGhpcy5jb252ZXJ0Q29uZmlnQ29zdEhlYWRzKGNvbmZpZ0Nvc3RIZWFkcywgYnVpbGRpbmdDb3N0SGVhZHMpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnZlcnRDb25maWdDb3N0SGVhZHMoY29uZmlnUHJvamVjdENvc3RIZWFkcywgcHJvamVjdENvc3RIZWFkcyk7XHJcbiAgICAgICAgICAgIHRoaXMuY29udmVydENvbmZpZ0Nvc3RIZWFkcyhmaXhlZENvc3RDb25maWdQcm9qZWN0Q29zdEhlYWRzLCBwcm9qZWN0Q29zdEhlYWRzKTtcclxuICAgICAgICAgICAgYnVpbGRpbmdDb3N0SGVhZHMgPSBhbGFzcWwoJ1NFTEVDVCAqIEZST00gPyBPUkRFUiBCWSBwcmlvcml0eUlkJywgW2J1aWxkaW5nQ29zdEhlYWRzXSk7XHJcbiAgICAgICAgICAgIHByb2plY3RDb3N0SGVhZHMgPSBhbGFzcWwoJ1NFTEVDVCAqIEZST00gPyBPUkRFUiBCWSBwcmlvcml0eUlkJywgW3Byb2plY3RDb3N0SGVhZHNdKTtcclxuICAgICAgICAgICAgbGV0IGJ1aWxkaW5nUmF0ZXMgPSB0aGlzLmdldFJhdGVzKGJ1aWxkaW5nRGF0YSwgYnVpbGRpbmdDb3N0SGVhZHMpO1xyXG4gICAgICAgICAgICBsZXQgcHJvamVjdFJhdGVzID0gdGhpcy5nZXRSYXRlcyhwcm9qZWN0RGF0YSwgcHJvamVjdENvc3RIZWFkcyk7XHJcbiAgICAgICAgICAgIGxldCByYXRlQW5hbHlzaXMgPSBuZXcgUmF0ZUFuYWx5c2lzKGJ1aWxkaW5nQ29zdEhlYWRzLCBidWlsZGluZ1JhdGVzLCBwcm9qZWN0Q29zdEhlYWRzLCBwcm9qZWN0UmF0ZXMpO1xyXG4gICAgICAgICAgICB0aGlzLnNhdmVSYXRlQW5hbHlzaXMocmF0ZUFuYWx5c2lzLCByZWdpb24pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGNvbnZlcnRDb25maWdDb3N0SGVhZHMoY29uZmlnQ29zdEhlYWRzOiBBcnJheTxhbnk+LCBjb3N0SGVhZHNEYXRhOiBBcnJheTxDb3N0SGVhZD4pIHtcclxuXHJcbiAgICBmb3IgKGxldCBjb25maWdDb3N0SGVhZCBvZiBjb25maWdDb3N0SGVhZHMpIHtcclxuXHJcbiAgICAgIGxldCBjb3N0SGVhZEV4aXN0U1FMID0gJ1NFTEVDVCAqIEZST00gPyBBUyBjb3N0SGVhZHMgV0hFUkUgY29zdEhlYWRzLm5hbWU9ID8nO1xyXG4gICAgICBsZXQgY29zdEhlYWRFeGlzdEFycmF5ID0gYWxhc3FsKGNvc3RIZWFkRXhpc3RTUUwsIFtjb3N0SGVhZHNEYXRhLCBjb25maWdDb3N0SGVhZC5uYW1lXSk7XHJcblxyXG4gICAgICBpZiAoY29zdEhlYWRFeGlzdEFycmF5Lmxlbmd0aCA9PT0gMCAmJiBjb25maWdDb3N0SGVhZC5yYXRlQW5hbHlzaXNJZCkge1xyXG4gICAgICAgIGxldCBjb3N0SGVhZDogQ29zdEhlYWQgPSBuZXcgQ29zdEhlYWQoKTtcclxuICAgICAgICBjb3N0SGVhZC5uYW1lID0gY29uZmlnQ29zdEhlYWQubmFtZTtcclxuICAgICAgICBjb3N0SGVhZC5wcmlvcml0eUlkID0gY29uZmlnQ29zdEhlYWQucHJpb3JpdHlJZDtcclxuICAgICAgICBjb3N0SGVhZC5yYXRlQW5hbHlzaXNJZCA9IGNvbmZpZ0Nvc3RIZWFkLnJhdGVBbmFseXNpc0lkO1xyXG4gICAgICAgIGxldCBjYXRlZ29yaWVzTGlzdCA9IG5ldyBBcnJheTxDYXRlZ29yeT4oKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgY29uZmlnQ2F0ZWdvcnkgb2YgY29uZmlnQ29zdEhlYWQuY2F0ZWdvcmllcykge1xyXG5cclxuICAgICAgICAgIGxldCBjYXRlZ29yeTogQ2F0ZWdvcnkgPSBuZXcgQ2F0ZWdvcnkoY29uZmlnQ2F0ZWdvcnkubmFtZSwgY29uZmlnQ2F0ZWdvcnkucmF0ZUFuYWx5c2lzSWQpO1xyXG4gICAgICAgICAgbGV0IHdvcmtJdGVtc0xpc3Q6IEFycmF5PFdvcmtJdGVtPiA9IG5ldyBBcnJheTxXb3JrSXRlbT4oKTtcclxuXHJcbiAgICAgICAgICBmb3IgKGxldCBjb25maWdXb3JrSXRlbSBvZiBjb25maWdDYXRlZ29yeS53b3JrSXRlbXMpIHtcclxuXHJcbiAgICAgICAgICAgIGxldCB3b3JrSXRlbTogV29ya0l0ZW0gPSBuZXcgV29ya0l0ZW0oY29uZmlnV29ya0l0ZW0ubmFtZSwgY29uZmlnV29ya0l0ZW0ucmF0ZUFuYWx5c2lzSWQpO1xyXG4gICAgICAgICAgICB3b3JrSXRlbS5pc0RpcmVjdFJhdGUgPSB0cnVlO1xyXG4gICAgICAgICAgICB3b3JrSXRlbS51bml0ID0gY29uZmlnV29ya0l0ZW0ubWVhc3VyZW1lbnRVbml0O1xyXG4gICAgICAgICAgICB3b3JrSXRlbS5pc01lYXN1cmVtZW50U2hlZXQgPSBjb25maWdXb3JrSXRlbS5pc01lYXN1cmVtZW50U2hlZXQ7XHJcbiAgICAgICAgICAgIHdvcmtJdGVtLmlzUmF0ZUFuYWx5c2lzID0gY29uZmlnV29ya0l0ZW0uaXNSYXRlQW5hbHlzaXM7XHJcbiAgICAgICAgICAgIHdvcmtJdGVtLnJhdGVBbmFseXNpc1BlclVuaXQgPSBjb25maWdXb3JrSXRlbS5yYXRlQW5hbHlzaXNQZXJVbml0O1xyXG4gICAgICAgICAgICB3b3JrSXRlbS5pc1N0ZWVsV29ya0l0ZW0gPSBjb25maWdXb3JrSXRlbS5pc1N0ZWVsV29ya0l0ZW07XHJcbiAgICAgICAgICAgIHdvcmtJdGVtLmlzSXRlbUJyZWFrZG93blJlcXVpcmVkID0gY29uZmlnV29ya0l0ZW0uaXNJdGVtQnJlYWtkb3duUmVxdWlyZWQ7XHJcbiAgICAgICAgICAgIHdvcmtJdGVtLmxlbmd0aCA9IGNvbmZpZ1dvcmtJdGVtLmxlbmd0aDtcclxuICAgICAgICAgICAgd29ya0l0ZW0uYnJlYWR0aE9yV2lkdGggPSBjb25maWdXb3JrSXRlbS5icmVhZHRoT3JXaWR0aDtcclxuICAgICAgICAgICAgd29ya0l0ZW0uaGVpZ2h0ID0gY29uZmlnV29ya0l0ZW0uaGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgaWYgKGNvbmZpZ1dvcmtJdGVtLmRpcmVjdFJhdGUgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICB3b3JrSXRlbS5yYXRlLnRvdGFsID0gY29uZmlnV29ya0l0ZW0uZGlyZWN0UmF0ZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICB3b3JrSXRlbS5yYXRlLnRvdGFsID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB3b3JrSXRlbS5yYXRlLmlzRXN0aW1hdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgd29ya0l0ZW1zTGlzdC5wdXNoKHdvcmtJdGVtKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNhdGVnb3J5LndvcmtJdGVtcyA9IHdvcmtJdGVtc0xpc3Q7XHJcbiAgICAgICAgICBjYXRlZ29yaWVzTGlzdC5wdXNoKGNhdGVnb3J5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvc3RIZWFkLmNhdGVnb3JpZXMgPSBjYXRlZ29yaWVzTGlzdDtcclxuICAgICAgICBjb3N0SGVhZC50aHVtYlJ1bGVSYXRlID0gY29uZmlnLmdldChDb25zdGFudHMuVEhVTUJSVUxFX1JBVEUpO1xyXG4gICAgICAgIGNvc3RIZWFkc0RhdGEucHVzaChjb3N0SGVhZCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBjb3N0SGVhZHNEYXRhO1xyXG4gIH1cclxuXHJcbiAgZ2V0UmF0ZXMocmVzdWx0OiBhbnksIGNvc3RIZWFkczogQXJyYXk8Q29zdEhlYWQ+KSB7XHJcbiAgICBsZXQgZ2V0UmF0ZXNMaXN0U1FMID0gJ1NFTEVDVCAqIEZST00gPyBBUyBxIFdIRVJFIHEuQzQgSU4gKFNFTEVDVCB0LnJhdGVBbmFseXNpc0lkICcgK1xyXG4gICAgICAnRlJPTSA/IEFTIHQpJztcclxuICAgIGxldCByYXRlSXRlbXMgPSBhbGFzcWwoZ2V0UmF0ZXNMaXN0U1FMLCBbcmVzdWx0LnJhdGVzLCBjb3N0SGVhZHNdKTtcclxuXHJcbiAgICBsZXQgcmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzU1FMID0gJ1NFTEVDVCByYXRlSXRlbS5DMiBBUyBpdGVtTmFtZSwgcmF0ZUl0ZW0uQzIgQVMgb3JpZ2luYWxJdGVtTmFtZSwnICtcclxuICAgICAgJ3JhdGVJdGVtLkMxMiBBUyByYXRlQW5hbHlzaXNJZCwgcmF0ZUl0ZW0uQzYgQVMgdHlwZSwnICtcclxuICAgICAgJ1JPVU5EKHJhdGVJdGVtLkM3LDIpIEFTIHF1YW50aXR5LCBST1VORChyYXRlSXRlbS5DMywyKSBBUyByYXRlLCB1bml0LkMyIEFTIHVuaXQsJyArXHJcbiAgICAgICdST1VORChyYXRlSXRlbS5DMyAqIHJhdGVJdGVtLkM3LDIpIEFTIHRvdGFsQW1vdW50LCByYXRlSXRlbS5DNSBBUyB0b3RhbFF1YW50aXR5ICcgK1xyXG4gICAgICAnRlJPTSA/IEFTIHJhdGVJdGVtIEpPSU4gPyBBUyB1bml0IE9OIHVuaXQuQzEgPSByYXRlSXRlbS5DOSc7XHJcblxyXG4gICAgbGV0IHJhdGVJdGVtc0xpc3QgPSBhbGFzcWwocmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzU1FMLCBbcmF0ZUl0ZW1zLCByZXN1bHQudW5pdHNdKTtcclxuXHJcbiAgICBsZXQgZGlzdGluY3RJdGVtc1NRTCA9ICdzZWxlY3QgRElTVElOQ1QgaXRlbU5hbWUsb3JpZ2luYWxJdGVtTmFtZSxyYXRlIEZST00gPyc7XHJcbiAgICB2YXIgZGlzdGluY3RSYXRlcyA9IGFsYXNxbChkaXN0aW5jdEl0ZW1zU1FMLCBbcmF0ZUl0ZW1zTGlzdF0pO1xyXG5cclxuICAgIHJldHVybiBkaXN0aW5jdFJhdGVzO1xyXG4gIH1cclxuXHJcbiAgc2F2ZVJhdGVBbmFseXNpcyhyYXRlQW5hbHlzaXM6IFJhdGVBbmFseXNpcywgcmVnaW9uOiBhbnkpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdzYXZlUmF0ZUFuYWx5c2lzIGlzIGJlZW4gaGl0IDogJyArIHJlZ2lvbi5SZWdpb24pO1xyXG4gICAgbGV0IHF1ZXJ5ID0geydyZWdpb24nOiByZWdpb24uUmVnaW9ufTtcclxuICAgIHJhdGVBbmFseXNpcy5yZWdpb24gPSByZWdpb24uUmVnaW9uO1xyXG4gICAgbG9nZ2VyLmluZm8oJ1VwZGF0aW5nIFJhdGVBbmFseXNpcyBmb3IgJyArIHJlZ2lvbi5SZWdpb24pO1xyXG4gICAgdGhpcy5yYXRlQW5hbHlzaXNSZXBvc2l0b3J5LnJldHJpZXZlKHsncmVnaW9uJzogcmVnaW9uLlJlZ2lvbn0sIChlcnJvcjogYW55LCByYXRlQW5hbHlzaXNBcnJheTogQXJyYXk8UmF0ZUFuYWx5c2lzPikgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBsb2dnZXIuZXJyb3IoJ1VuYWJsZSB0byByZXRyaXZlIHN5bmNlZCBSYXRlQW5hbHlzaXMnKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAocmF0ZUFuYWx5c2lzQXJyYXkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgcXVlcnkgPSB7J3JlZ2lvbic6IHJlZ2lvbi5SZWdpb259O1xyXG4gICAgICAgICAgbGV0IHVwZGF0ZSA9IHtcclxuICAgICAgICAgICAgJHNldDoge1xyXG4gICAgICAgICAgICAgICdwcm9qZWN0Q29zdEhlYWRzJzogcmF0ZUFuYWx5c2lzLnByb2plY3RDb3N0SGVhZHMsXHJcbiAgICAgICAgICAgICAgJ3Byb2plY3RSYXRlcyc6IHJhdGVBbmFseXNpcy5wcm9qZWN0UmF0ZXMsXHJcbiAgICAgICAgICAgICAgJ2J1aWxkaW5nQ29zdEhlYWRzJzogcmF0ZUFuYWx5c2lzLmJ1aWxkaW5nQ29zdEhlYWRzLFxyXG4gICAgICAgICAgICAgICdidWlsZGluZ1JhdGVzJzogcmF0ZUFuYWx5c2lzLmJ1aWxkaW5nUmF0ZXNcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIHRoaXMucmF0ZUFuYWx5c2lzUmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCB1cGRhdGUsIHtuZXc6IHRydWV9LCAoZXJyb3I6IGFueSwgcmF0ZUFuYWx5c2lzQXJyYXk6IFJhdGVBbmFseXNpcykgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoJ3NhdmVSYXRlQW5hbHlzaXMgZmFpbGVkID0+ICcgKyBlcnJvci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBsb2dnZXIuaW5mbygnVXBkYXRlZCBSYXRlQW5hbHlzaXMgZm9yIHJlZ2lvbiA6JytyZWdpb24uUmVnaW9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMucmF0ZUFuYWx5c2lzUmVwb3NpdG9yeS5jcmVhdGUocmF0ZUFuYWx5c2lzLCAoZXJyb3I6IGFueSwgcmVzdWx0OiBSYXRlQW5hbHlzaXMpID0+IHtcclxuICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKCdzYXZlUmF0ZUFuYWx5c2lzIGZhaWxlZCA9PiAnICsgZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oJ1NhdmVkIFJhdGVBbmFseXNpcyBmb3IgcmVnaW9uIDogJytyZWdpb24uUmVnaW9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldENvc3RDb250cm9sUmF0ZUFuYWx5c2lzKHF1ZXJ5OiBhbnksIHByb2plY3Rpb246IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByYXRlQW5hbHlzaXM6IFJhdGVBbmFseXNpcykgPT4gdm9pZCkge1xyXG4gICAgdGhpcy5yYXRlQW5hbHlzaXNSZXBvc2l0b3J5LnJldHJpZXZlV2l0aFByb2plY3Rpb24ocXVlcnksIHByb2plY3Rpb24sIChlcnJvcjogYW55LCByYXRlQW5hbHlzaXNBcnJheTogQXJyYXk8UmF0ZUFuYWx5c2lzPikgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHJhdGVBbmFseXNpc0FycmF5Lmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgbG9nZ2VyLmVycm9yKCdDb250Q29udHJvbCBSYXRlQW5hbHlzaXMgbm90IGZvdW5kLicpO1xyXG4gICAgICAgICAgY2FsbGJhY2soJ0NvbnRDb250cm9sIFJhdGVBbmFseXNpcyBub3QgZm91bmQuJywgbnVsbCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJhdGVBbmFseXNpc0FycmF5WzBdKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0QWdncmVnYXRlRGF0YShxdWVyeTogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIGFnZ3JlZ2F0ZURhdGE6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgdGhpcy5yYXRlQW5hbHlzaXNSZXBvc2l0b3J5LmFnZ3JlZ2F0ZShxdWVyeSwgY2FsbGJhY2spO1xyXG4gIH1cclxuXHJcbiAgZ2V0QWxscmVnaW9uc0Zyb21SYXRlQW5hbHlzaXMoY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1JhdGUgQW5hbHlzaXMgU2VydmljZSwgZ2V0Q29zdEhlYWRzIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgbGV0IHJlZ2lvbkxpc3RGcm9tUmF0ZUFuYWx5c2lzOiBBcnJheTxhbnk+O1xyXG4gICAgbGV0IHVybCA9IGNvbmZpZy5nZXQoJ3JhdGVBbmFseXNpc0FQSS5nZXRBbGxyZWdpb25zJyk7XHJcbiAgICByZXF1ZXN0LmdldCh7dXJsOiB1cmx9LCBmdW5jdGlvbiAoZXJyb3I6IGFueSwgcmVzcG9uc2U6IGFueSwgYm9keTogYW55KSB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGxvZ2dlci5lcnJvcignRXJyb3IgZm9yIGdldHRpbmcgYWxsIHJlZ2lvbnMuJyk7XHJcbiAgICAgICAgbG9nZ2VyLmVycm9yKEpTT04uc3RyaW5naWZ5KGVycm9yKSk7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2UgaWYgKCFlcnJvciAmJiByZXNwb25zZSkge1xyXG4gICAgICAgIGlmKHJlc3BvbnNlLnN0YXR1c0NvZGU9PT0yMDApIHtcclxuICAgICAgICAgIGxldCByZXNwID0gSlNPTi5wYXJzZShib2R5KTtcclxuICAgICAgICAgIHJlZ2lvbkxpc3RGcm9tUmF0ZUFuYWx5c2lzID0gcmVzcFsnUmVnaW9ucyddO1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ3JlZ2lvbkxpc3RGcm9tUmF0ZUFuYWx5c2lzIDogJyArIEpTT04uc3RyaW5naWZ5KHJlZ2lvbkxpc3RGcm9tUmF0ZUFuYWx5c2lzKSk7XHJcbiAgICAgICAgICBjYWxsYmFjayhudWxsLCByZWdpb25MaXN0RnJvbVJhdGVBbmFseXNpcyk7XHJcbiAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ3JlZ2lvbkxpc3RGcm9tUmF0ZUFuYWx5c2lzIDogTk9UIEZPVU5ELiBJbnRlcm5hbCBzZXJ2ZXIgZXJyb3IhJyk7XHJcbiAgICAgICAgICBjYWxsYmFjaygncmVnaW9uTGlzdEZyb21SYXRlQW5hbHlzaXMgOiBOT1QgRk9VTkQuIEludGVybmFsIHNlcnZlciBlcnJvciEnLG51bGwpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRBbGxSZWdpb25OYW1lcyhjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogQXJyYXk8YW55PikgPT4gdm9pZCkge1xyXG4gICAgbGV0IHF1ZXJ5ID0gW1xyXG4gICAgICB7JHVud2luZDogJyRyZWdpb24nfSxcclxuICAgICAgeyRwcm9qZWN0OiB7J3JlZ2lvbic6IDEsIF9pZDogMH19XHJcbiAgICBdO1xyXG4gICAgdGhpcy5yYXRlQW5hbHlzaXNSZXBvc2l0b3J5LmFnZ3JlZ2F0ZShxdWVyeSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChyZXN1bHQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgY2FsbGJhY2soZXJyb3IsIHJlc3VsdCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxldCBlcnJvciA9IG5ldyBFcnJvcigpO1xyXG4gICAgICAgICAgZXJyb3IubWVzc2FnZSA9IG1lc3NhZ2VzLk1TR19FUlJPUl9SRUdJT05TX0FSRV9OT1RfUFJFU0VOVDtcclxuICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0QWxsRGF0YUZvckRyb3Bkb3duKHJlZ2lvbk5hbWU6IHN0cmluZywgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IEFycmF5PGFueT4pID0+IHZvaWQpIHtcclxuICAgIGxldCBxdWVyeSA9IHtyZWdpb246IHJlZ2lvbk5hbWV9O1xyXG4gICAgbGV0IHByb2plY3Rpb24gPSB7J2J1aWxkaW5nQ29zdEhlYWRzJzogMX07XHJcbiAgICB0aGlzLnJhdGVBbmFseXNpc1JlcG9zaXRvcnkucmV0cmlldmVXaXRoUHJvamVjdGlvbihxdWVyeSwgcHJvamVjdGlvbiwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCBjb3N0SGVhZERhdGEgPSByZXN1bHRbMF0uYnVpbGRpbmdDb3N0SGVhZHM7XHJcbiAgICAgICAgbGV0IGJ1aWxkaW5nQ29zdEhlYWRzOiBBcnJheTxSQUNvc3RIZWFkPiA9IFtdO1xyXG4gICAgICAgIGlmKGNvc3RIZWFkRGF0YS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGNvc3RIZWFkSW5kZXggPSAwOyBjb3N0SGVhZEluZGV4IDwgY29zdEhlYWREYXRhLmxlbmd0aDsgY29zdEhlYWRJbmRleCsrKSB7XHJcbiAgICAgICAgICAgICBsZXQgY29zdEhlYWQgPSBuZXcgUkFDb3N0SGVhZCgpO1xyXG4gICAgICAgICAgICAgY29zdEhlYWQubmFtZSA9IGNvc3RIZWFkRGF0YVtjb3N0SGVhZEluZGV4XS5uYW1lO1xyXG4gICAgICAgICAgICAgY29zdEhlYWQucmF0ZUFuYWx5c2lzSWQgPSBjb3N0SGVhZERhdGFbY29zdEhlYWRJbmRleF0ucmF0ZUFuYWx5c2lzSWQ7XHJcbiAgICAgICAgICAgICBsZXQgYnVpbGRpbmdDYXRlZ29yaWVzOiBBcnJheTxSQUNhdGVnb3J5PiA9IG5ldyBBcnJheTxSQUNhdGVnb3J5PigpO1xyXG4gICAgICAgICAgICAgdGhpcy5nZXRDYXRlZ29yaWVzKGNvc3RIZWFkRGF0YVtjb3N0SGVhZEluZGV4XS5jYXRlZ29yaWVzLCBidWlsZGluZ0NhdGVnb3JpZXMpO1xyXG4gICAgICAgICAgICAgY29zdEhlYWQuY2F0ZWdvcmllcyA9IGJ1aWxkaW5nQ2F0ZWdvcmllcztcclxuICAgICAgICAgICAgIGlmKGNvc3RIZWFkLmNhdGVnb3JpZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICBidWlsZGluZ0Nvc3RIZWFkcy5wdXNoKGNvc3RIZWFkKTtcclxuICAgICAgICAgICAgIH1cclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICBjYWxsYmFjayhudWxsLCBidWlsZGluZ0Nvc3RIZWFkcyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxldCBlcnJvciA9IG5ldyBFcnJvcigpO1xyXG4gICAgICAgICAgZXJyb3IubWVzc2FnZSA9IG1lc3NhZ2VzLk1TR19FUlJPUl9SRUdJT05TX0FSRV9OT1RfUFJFU0VOVDtcclxuICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0Q2F0ZWdvcmllcyhjYXRlZ29yaWVzRGF0YTogQXJyYXk8Q2F0ZWdvcnk+LCBidWlsZGluZ0NhdGVnb3JpZXM6IGFueSkge1xyXG4gICAgaWYgKGNhdGVnb3JpZXNEYXRhLmxlbmd0aCA+IDApIHtcclxuICAgICAgZm9yIChsZXQgY2F0ZWdvcnlJbmRleCA9IDA7IGNhdGVnb3J5SW5kZXggPCBjYXRlZ29yaWVzRGF0YS5sZW5ndGg7IGNhdGVnb3J5SW5kZXgrKykge1xyXG4gICAgICAgIGxldCBjYXRlZ29yeSA9IG5ldyBSQUNhdGVnb3J5KCk7XHJcbiAgICAgICAgY2F0ZWdvcnkubmFtZSA9IGNhdGVnb3JpZXNEYXRhW2NhdGVnb3J5SW5kZXhdLm5hbWU7XHJcbiAgICAgICAgY2F0ZWdvcnkucmF0ZUFuYWx5c2lzSWQgPSBjYXRlZ29yaWVzRGF0YVtjYXRlZ29yeUluZGV4XS5yYXRlQW5hbHlzaXNJZDtcclxuICAgICAgICBsZXQgYnVpbGRpbmdXb3JrSXRlbXM6IEFycmF5PFJBV29ya0l0ZW0+ID0gbmV3IEFycmF5PFJBV29ya0l0ZW0+KCk7XHJcbiAgICAgICAgdGhpcy5nZXRXb3JrSXRlbXNGb3JSQShjYXRlZ29yaWVzRGF0YVtjYXRlZ29yeUluZGV4XS53b3JrSXRlbXMsIGJ1aWxkaW5nV29ya0l0ZW1zKTtcclxuICAgICAgICBjYXRlZ29yeS53b3JrSXRlbXMgPSBidWlsZGluZ1dvcmtJdGVtcztcclxuICAgICAgICBpZihjYXRlZ29yeS53b3JrSXRlbXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgYnVpbGRpbmdDYXRlZ29yaWVzLnB1c2goY2F0ZWdvcnkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0V29ya0l0ZW1zRm9yUkEod29ya0l0ZW1zRGF0YTogQXJyYXk8V29ya0l0ZW0+LCBidWlsZGluZ1dvcmtJdGVtczogYW55KSB7XHJcbiAgICBpZiAod29ya0l0ZW1zRGF0YS5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGZvciAobGV0IHdvcmtJdGVtSW5kZXggPSAwOyB3b3JrSXRlbUluZGV4IDwgd29ya0l0ZW1zRGF0YS5sZW5ndGg7IHdvcmtJdGVtSW5kZXgrKykge1xyXG4gICAgICAgIGxldCB3b3JrSXRlbSA9IG5ldyBSQVdvcmtJdGVtKCk7XHJcbiAgICAgICAgd29ya0l0ZW0ubmFtZSA9IHdvcmtJdGVtc0RhdGFbd29ya0l0ZW1JbmRleF0ubmFtZTtcclxuICAgICAgICB3b3JrSXRlbS5yYXRlQW5hbHlzaXNJZCA9IHdvcmtJdGVtc0RhdGFbd29ya0l0ZW1JbmRleF0ucmF0ZUFuYWx5c2lzSWQ7XHJcbiAgICAgICAgd29ya0l0ZW0ucmF0ZSA9IHdvcmtJdGVtc0RhdGFbd29ya0l0ZW1JbmRleF0ucmF0ZTtcclxuICAgICAgICB3b3JrSXRlbS51bml0ID0gd29ya0l0ZW1zRGF0YVt3b3JrSXRlbUluZGV4XS51bml0O1xyXG4gICAgICAgIGlmKHdvcmtJdGVtLnJhdGUucmF0ZUl0ZW1zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIGJ1aWxkaW5nV29ya0l0ZW1zLnB1c2god29ya0l0ZW0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5PYmplY3Quc2VhbChSYXRlQW5hbHlzaXNTZXJ2aWNlKTtcclxuZXhwb3J0ID0gUmF0ZUFuYWx5c2lzU2VydmljZTtcclxuIl19
