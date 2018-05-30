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
                var res = JSON.parse(body);
                callback(null, res);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHBsaWNhdGlvblByb2plY3Qvc2VydmljZXMvUmF0ZUFuYWx5c2lzU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsb0VBQXVFO0FBQ3ZFLGtFQUFxRTtBQUVyRSw4RUFBaUY7QUFDakYsMEVBQTZFO0FBQzdFLHdFQUEyRTtBQUMzRSwrQkFBa0M7QUFDbEMsZ0VBQW1FO0FBQ25FLHdFQUEyRTtBQUMzRSx3RUFBMkU7QUFHM0UsK0NBQWtEO0FBQ2xELHdGQUEyRjtBQUMzRiw0RUFBK0U7QUFHL0UsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2pDLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDL0IsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBRXZELElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0FBRXREO0lBT0U7UUFDRSxJQUFJLENBQUMsUUFBUSxHQUFHLFlBQVksQ0FBQyxRQUFRLENBQUM7UUFDdEMsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLGVBQWUsRUFBRSxDQUFDO1FBQzdDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxXQUFXLEVBQUUsQ0FBQztRQUNyQyxJQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxzQkFBc0IsRUFBRSxDQUFDO0lBQzdELENBQUM7SUFFRCwwQ0FBWSxHQUFaLFVBQWEsR0FBVyxFQUFFLElBQVUsRUFBRSxRQUEyQztRQUMvRSxNQUFNLENBQUMsSUFBSSxDQUFDLGtEQUFrRCxDQUFDLENBQUM7UUFDaEUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUMsRUFBRSxVQUFVLEtBQVUsRUFBRSxRQUFhLEVBQUUsSUFBUztZQUNwRSxFQUFF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QztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLEVBQUUsQ0FBQSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNsQyxNQUFNLENBQUMsS0FBSyxDQUFDLHFDQUFxQyxDQUFDLENBQUM7b0JBQ3BELFFBQVEsQ0FBQyxxQ0FBcUMsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDeEQsQ0FBQztnQkFBQSxJQUFJLENBQUMsQ0FBQztvQkFDTCxRQUFRLENBQUMsSUFBSSxFQUFFLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZDLENBQUM7WUFDSCxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsOENBQWdCLEdBQWhCLFVBQWlCLEtBQVUsRUFBRSxRQUErQztRQUMxRSxJQUFJLENBQUMsc0JBQXNCLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBQyxRQUFRLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBQ0gsMEJBQUM7QUFBRCxDQTNuQkEsQUEybkJDLElBQUE7QUFHRCxNQUFNLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDakMsaUJBQVMsbUJBQW1CLENBQUMiLCJmaWxlIjoiYXBwL2FwcGxpY2F0aW9uUHJvamVjdC9zZXJ2aWNlcy9SYXRlQW5hbHlzaXNTZXJ2aWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFVzZXJTZXJ2aWNlID0gcmVxdWlyZSgnLi8uLi8uLi9mcmFtZXdvcmsvc2VydmljZXMvVXNlclNlcnZpY2UnKTtcclxuaW1wb3J0IFByb2plY3RBc3NldCA9IHJlcXVpcmUoJy4uLy4uL2ZyYW1ld29yay9zaGFyZWQvcHJvamVjdGFzc2V0Jyk7XHJcbmltcG9ydCBVc2VyID0gcmVxdWlyZSgnLi4vLi4vZnJhbWV3b3JrL2RhdGFhY2Nlc3MvbW9uZ29vc2UvdXNlcicpO1xyXG5pbXBvcnQgQXV0aEludGVyY2VwdG9yID0gcmVxdWlyZSgnLi4vLi4vZnJhbWV3b3JrL2ludGVyY2VwdG9yL2F1dGguaW50ZXJjZXB0b3InKTtcclxuaW1wb3J0IENvc3RDb250cm9sbEV4Y2VwdGlvbiA9IHJlcXVpcmUoJy4uL2V4Y2VwdGlvbi9Db3N0Q29udHJvbGxFeGNlcHRpb24nKTtcclxuaW1wb3J0IFdvcmtJdGVtID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L2J1aWxkaW5nL1dvcmtJdGVtJyk7XHJcbmltcG9ydCBhbGFzcWwgPSByZXF1aXJlKCdhbGFzcWwnKTtcclxuaW1wb3J0IFJhdGUgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3Byb2plY3QvYnVpbGRpbmcvUmF0ZScpO1xyXG5pbXBvcnQgQ29zdEhlYWQgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3Byb2plY3QvYnVpbGRpbmcvQ29zdEhlYWQnKTtcclxuaW1wb3J0IENhdGVnb3J5ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L2J1aWxkaW5nL0NhdGVnb3J5Jyk7XHJcbmltcG9ydCBRdWFudGl0eSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9idWlsZGluZy9RdWFudGl0eScpO1xyXG5cclxuaW1wb3J0IENvbnN0YW50cyA9IHJlcXVpcmUoJy4uL3NoYXJlZC9jb25zdGFudHMnKTtcclxuaW1wb3J0IFJhdGVBbmFseXNpc1JlcG9zaXRvcnkgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL3JlcG9zaXRvcnkvUmF0ZUFuYWx5c2lzUmVwb3NpdG9yeScpO1xyXG5pbXBvcnQgUmF0ZUFuYWx5c2lzID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9SYXRlQW5hbHlzaXMvUmF0ZUFuYWx5c2lzJyk7XHJcbmltcG9ydCB7IEF0dGFjaG1lbnREZXRhaWxzTW9kZWwgfSBmcm9tICcuLi9kYXRhYWNjZXNzL21vZGVsL3Byb2plY3QvYnVpbGRpbmcvQXR0YWNobWVudERldGFpbHMnO1xyXG5cclxubGV0IHJlcXVlc3QgPSByZXF1aXJlKCdyZXF1ZXN0Jyk7XHJcbmxldCBjb25maWcgPSByZXF1aXJlKCdjb25maWcnKTtcclxudmFyIGxvZzRqcyA9IHJlcXVpcmUoJ2xvZzRqcycpO1xyXG52YXIgbG9nZ2VyID0gbG9nNGpzLmdldExvZ2dlcignUmF0ZSBBbmFseXNpcyBTZXJ2aWNlJyk7XHJcblxyXG5sZXQgQ0NQcm9taXNlID0gcmVxdWlyZSgncHJvbWlzZS9saWIvZXM2LWV4dGVuc2lvbnMnKTtcclxuXHJcbmNsYXNzIFJhdGVBbmFseXNpc1NlcnZpY2Uge1xyXG4gIEFQUF9OQU1FOiBzdHJpbmc7XHJcbiAgY29tcGFueV9uYW1lOiBzdHJpbmc7XHJcbiAgcHJpdmF0ZSBhdXRoSW50ZXJjZXB0b3I6IEF1dGhJbnRlcmNlcHRvcjtcclxuICBwcml2YXRlIHVzZXJTZXJ2aWNlOiBVc2VyU2VydmljZTtcclxuICBwcml2YXRlIHJhdGVBbmFseXNpc1JlcG9zaXRvcnk6IFJhdGVBbmFseXNpc1JlcG9zaXRvcnk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5BUFBfTkFNRSA9IFByb2plY3RBc3NldC5BUFBfTkFNRTtcclxuICAgIHRoaXMuYXV0aEludGVyY2VwdG9yID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xyXG4gICAgdGhpcy51c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgdGhpcy5yYXRlQW5hbHlzaXNSZXBvc2l0b3J5ID0gbmV3IFJhdGVBbmFseXNpc1JlcG9zaXRvcnkoKTtcclxuICB9XHJcblxyXG4gIGdldENvc3RIZWFkcyh1cmw6IHN0cmluZywgdXNlcjogVXNlciwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1JhdGUgQW5hbHlzaXMgU2VydmljZSwgZ2V0Q29zdEhlYWRzIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgcmVxdWVzdC5nZXQoe3VybDogdXJsfSwgZnVuY3Rpb24gKGVycm9yOiBhbnksIHJlc3BvbnNlOiBhbnksIGJvZHk6IGFueSkge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSBpZiAoIWVycm9yICYmIHJlc3BvbnNlKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ1JFU1BPTlNFIEpTT04gOiAnICsgSlNPTi5zdHJpbmdpZnkoSlNPTi5wYXJzZShib2R5KSkpO1xyXG4gICAgICAgIGxldCByZXMgPSBKU09OLnBhcnNlKGJvZHkpO1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHJlcyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0V29ya0l0ZW1zKHVybDogc3RyaW5nLCB1c2VyOiBVc2VyLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUmF0ZSBBbmFseXNpcyBTZXJ2aWNlLCBnZXRXb3JrSXRlbXMgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICByZXF1ZXN0LmdldCh7dXJsOiB1cmx9LCBmdW5jdGlvbiAoZXJyb3I6IGFueSwgcmVzcG9uc2U6IGFueSwgYm9keTogYW55KSB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIGlmICghZXJyb3IgJiYgcmVzcG9uc2UpIHtcclxuICAgICAgICBsZXQgcmVzID0gSlNPTi5wYXJzZShib2R5KTtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCByZXMpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldFdvcmtJdGVtc0J5Q29zdEhlYWRJZCh1cmw6IHN0cmluZywgY29zdEhlYWRJZDogc3RyaW5nLCB1c2VyOiBVc2VyLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUmF0ZSBBbmFseXNpcyBTZXJ2aWNlLCBnZXRXb3JrSXRlbXNCeUNvc3RIZWFkSWQgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICBsZXQgd29ya0l0ZW1zOiBBcnJheTxXb3JrSXRlbT4gPSBbXTtcclxuICAgIHJlcXVlc3QuZ2V0KHt1cmw6IHVybH0sIGZ1bmN0aW9uIChlcnJvcjogYW55LCByZXNwb25zZTogYW55LCBib2R5OiBhbnkpIHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2UgaWYgKCFlcnJvciAmJiByZXNwb25zZSkge1xyXG4gICAgICAgIGxldCByZXMgPSBKU09OLnBhcnNlKGJvZHkpO1xyXG4gICAgICAgIGlmIChyZXMpIHtcclxuXHJcbiAgICAgICAgICBmb3IgKGxldCB3b3JraXRlbSBvZiByZXMuU3ViSXRlbVR5cGUpIHtcclxuICAgICAgICAgICAgaWYgKHBhcnNlSW50KGNvc3RIZWFkSWQpID09PSB3b3JraXRlbS5DMykge1xyXG4gICAgICAgICAgICAgIGxldCB3b3JraXRlbURldGFpbHMgPSBuZXcgV29ya0l0ZW0od29ya2l0ZW0uQzIsIHdvcmtpdGVtLkMxKTtcclxuICAgICAgICAgICAgICB3b3JrSXRlbXMucHVzaCh3b3JraXRlbURldGFpbHMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHdvcmtJdGVtcyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0QXBpQ2FsbCh1cmw6IHN0cmluZywgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXNwb25zZTogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnZ2V0QXBpQ2FsbCBmb3IgcmF0ZUFuYWx5c2lzIGhhcyBiZWUgaGl0IGZvciB1cmwgOiAnICsgdXJsKTtcclxuICAgIHJlcXVlc3QuZ2V0KHt1cmw6IHVybH0sIGZ1bmN0aW9uIChlcnJvcjogYW55LCByZXNwb25zZTogYW55LCBib2R5OiBhbnkpIHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2sobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlcnJvci5tZXNzYWdlLCBlcnJvci5zdGFjayksIG51bGwpO1xyXG4gICAgICB9IGVsc2UgaWYgKCFlcnJvciAmJiByZXNwb25zZSkge1xyXG4gICAgICAgIGxldCByZXMgPSBKU09OLnBhcnNlKGJvZHkpO1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHJlcyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0UmF0ZSh3b3JrSXRlbUlkOiBudW1iZXIsIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgZGF0YTogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBsZXQgdXJsID0gY29uZmlnLmdldCgncmF0ZUFuYWx5c2lzQVBJLnVuaXQnKTtcclxuICAgIHRoaXMuZ2V0QXBpQ2FsbCh1cmwsIChlcnJvciwgdW5pdERhdGEpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHVuaXREYXRhID0gdW5pdERhdGFbJ1VPTSddO1xyXG4gICAgICAgIHVybCA9IGNvbmZpZy5nZXQoJ3JhdGVBbmFseXNpc0FQSS5yYXRlJyk7XHJcbiAgICAgICAgdGhpcy5nZXRBcGlDYWxsKHVybCwgKGVycm9yLCBkYXRhKSA9PiB7XHJcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IHJhdGUgPSBkYXRhWydSYXRlQW5hbHlzaXNEYXRhJ107XHJcbiAgICAgICAgICAgIGxldCBzcWwgPSAnU0VMRUNUIHJhdGUuQzUgQVMgcXVhbnRpdHksIHVuaXQuQzIgQXMgdW5pdCBGUk9NID8gQVMgcmF0ZSBKT0lOID8gQVMgdW5pdCBvbiB1bml0LkMxID0gIHJhdGUuQzggYW5kJyArXHJcbiAgICAgICAgICAgICAgJyByYXRlLkMxID0gJyArIHdvcmtJdGVtSWQ7XHJcbiAgICAgICAgICAgIGxldCBzcWwyID0gJ1NFTEVDVCByYXRlLkMxIEFTIHJhdGVBbmFseXNpc0lkLCByYXRlLkMyIEFTIGl0ZW1OYW1lLFJPVU5EKHJhdGUuQzcsMikgQVMgcXVhbnRpdHksUk9VTkQocmF0ZS5DMywyKSBBUyByYXRlLCcgK1xyXG4gICAgICAgICAgICAgICcgUk9VTkQocmF0ZS5DMypyYXRlLkM3LDIpIEFTIHRvdGFsQW1vdW50LCByYXRlLkM2IHR5cGUsIHVuaXQuQzIgQXMgdW5pdCBGUk9NID8gQVMgcmF0ZSBKT0lOID8gQVMgdW5pdCBPTiB1bml0LkMxID0gcmF0ZS5DOScgK1xyXG4gICAgICAgICAgICAgICcgIFdIRVJFIHJhdGUuQzEgPSAnICsgd29ya0l0ZW1JZDtcclxuICAgICAgICAgICAgbGV0IHNxbDMgPSAnU0VMRUNUIFJPVU5EKFNVTShyYXRlLkMzKnJhdGUuQzcpIC8gU1VNKHJhdGUuQzcpLDIpIEFTIHRvdGFsICBGUk9NID8gQVMgcmF0ZSBKT0lOID8gQVMgdW5pdCBPTiB1bml0LkMxID0gcmF0ZS5DOScgK1xyXG4gICAgICAgICAgICAgICcgIFdIRVJFIHJhdGUuQzEgPSAnICsgd29ya0l0ZW1JZDtcclxuICAgICAgICAgICAgbGV0IHF1YW50aXR5QW5kVW5pdCA9IGFsYXNxbChzcWwsIFtyYXRlLCB1bml0RGF0YV0pO1xyXG4gICAgICAgICAgICBsZXQgcmF0ZVJlc3VsdDogUmF0ZSA9IG5ldyBSYXRlKCk7XHJcbiAgICAgICAgICAgIGxldCB0b3RhbHJhdGVGcm9tUmF0ZUFuYWx5c2lzID0gYWxhc3FsKHNxbDMsIFtyYXRlLCB1bml0RGF0YV0pO1xyXG4gICAgICAgICAgICByYXRlUmVzdWx0LnF1YW50aXR5ID0gcXVhbnRpdHlBbmRVbml0WzBdLnF1YW50aXR5O1xyXG4gICAgICAgICAgICByYXRlUmVzdWx0LnVuaXQgPSBxdWFudGl0eUFuZFVuaXRbMF0udW5pdDtcclxuICAgICAgICAgICAgcmF0ZVJlc3VsdC5yYXRlRnJvbVJhdGVBbmFseXNpcyA9IHBhcnNlRmxvYXQoKHRvdGFscmF0ZUZyb21SYXRlQW5hbHlzaXNbMF0udG90YWwpLnRvRml4ZWQoMikpO1xyXG4gICAgICAgICAgICByYXRlID0gYWxhc3FsKHNxbDIsIFtyYXRlLCB1bml0RGF0YV0pO1xyXG4gICAgICAgICAgICByYXRlUmVzdWx0LnJhdGVJdGVtcyA9IHJhdGU7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJhdGVSZXN1bHQpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvL1RPRE8gOiBEZWxldGUgQVBJJ3MgcmVsYXRlZCB0byB3b3JraXRlbXMgYWRkLCBkZWxlZXQsIGdldCBsaXN0LlxyXG4gIGdldFdvcmtpdGVtTGlzdChjb3N0SGVhZElkOiBudW1iZXIsIGNhdGVnb3J5SWQ6IG51bWJlciwgY2FsbGJhY2s6IChlcnJvcjogYW55LCBkYXRhOiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxldCB1cmwgPSBjb25maWcuZ2V0KCdyYXRlQW5hbHlzaXNBUEkud29ya2l0ZW0nKTtcclxuICAgIHRoaXMuZ2V0QXBpQ2FsbCh1cmwsIChlcnJvciwgd29ya2l0ZW0pID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCBzcWw6IHN0cmluZyA9ICdTRUxFQ1QgQzIgQVMgcmF0ZUFuYWx5c2lzSWQsIEMzIEFTIG5hbWUgRlJPTSA/IFdIRVJFIEMxID0gJyArIGNvc3RIZWFkSWQgKyAnIGFuZCBDNCA9ICcgKyBjYXRlZ29yeUlkO1xyXG4gICAgICAgIGlmIChjYXRlZ29yeUlkID09PSAwKSB7XHJcbiAgICAgICAgICBzcWwgPSAnU0VMRUNUIEMyIEFTIHJhdGVBbmFseXNpc0lkLCBDMyBBUyBuYW1lIEZST00gPyBXSEVSRSBDMSA9ICcgKyBjb3N0SGVhZElkO1xyXG4gICAgICAgIH1cclxuICAgICAgICB3b3JraXRlbSA9IHdvcmtpdGVtWydJdGVtcyddO1xyXG4gICAgICAgIGxldCB3b3JraXRlbUxpc3QgPSBhbGFzcWwoc3FsLCBbd29ya2l0ZW1dKTtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCB3b3JraXRlbUxpc3QpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGNvbnZlcnRDb3N0SGVhZHNGcm9tUmF0ZUFuYWx5c2lzVG9Db3N0Q29udHJvbChlbnRpdHk6IHN0cmluZywgY2FsbGJhY2s6IChlcnJvcjogYW55LCBkYXRhOiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdjb252ZXJ0Q29zdEhlYWRzRnJvbVJhdGVBbmFseXNpc1RvQ29zdENvbnRyb2wgaGFzIGJlZW4gaGl0Jyk7XHJcblxyXG4gICAgbGV0IGNvc3RIZWFkVVJMID0gY29uZmlnLmdldChDb25zdGFudHMuUkFURV9BTkFMWVNJU19BUEkgKyBlbnRpdHkgKyBDb25zdGFudHMuUkFURV9BTkFMWVNJU19DT1NUSEVBRFMpO1xyXG4gICAgbGV0IGNvc3RIZWFkUmF0ZUFuYWx5c2lzUHJvbWlzZSA9IHRoaXMuY3JlYXRlUHJvbWlzZShjb3N0SGVhZFVSTCk7XHJcbiAgICBsb2dnZXIuaW5mbygnY29zdEhlYWRSYXRlQW5hbHlzaXNQcm9taXNlIGZvciBoYXMgYmVlbiBoaXQnKTtcclxuXHJcbiAgICBsZXQgY2F0ZWdvcnlVUkwgPSBjb25maWcuZ2V0KENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0FQSSArIGVudGl0eSArIENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0NBVEVHT1JJRVMpO1xyXG4gICAgbGV0IGNhdGVnb3J5UmF0ZUFuYWx5c2lzUHJvbWlzZSA9IHRoaXMuY3JlYXRlUHJvbWlzZShjYXRlZ29yeVVSTCk7XHJcbiAgICBsb2dnZXIuaW5mbygnY2F0ZWdvcnlSYXRlQW5hbHlzaXNQcm9taXNlIGZvciBoYXMgYmVlbiBoaXQnKTtcclxuXHJcbiAgICBsZXQgd29ya0l0ZW1VUkwgPSBjb25maWcuZ2V0KENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0FQSSArIGVudGl0eSArIENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX1dPUktJVEVNUyk7XHJcbiAgICBsZXQgd29ya0l0ZW1SYXRlQW5hbHlzaXNQcm9taXNlID0gdGhpcy5jcmVhdGVQcm9taXNlKHdvcmtJdGVtVVJMKTtcclxuICAgIGxvZ2dlci5pbmZvKCd3b3JrSXRlbVJhdGVBbmFseXNpc1Byb21pc2UgZm9yIGhhcyBiZWVuIGhpdCcpO1xyXG5cclxuICAgIGxldCByYXRlSXRlbVVSTCA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfQVBJICsgZW50aXR5ICsgQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfUkFURSk7XHJcbiAgICBsZXQgcmF0ZUl0ZW1SYXRlQW5hbHlzaXNQcm9taXNlID0gdGhpcy5jcmVhdGVQcm9taXNlKHJhdGVJdGVtVVJMKTtcclxuICAgIGxvZ2dlci5pbmZvKCdyYXRlSXRlbVJhdGVBbmFseXNpc1Byb21pc2UgZm9yIGhhcyBiZWVuIGhpdCcpO1xyXG5cclxuICAgIGxldCByYXRlQW5hbHlzaXNOb3Rlc1VSTCA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfQVBJICsgZW50aXR5ICsgQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfTk9URVMpO1xyXG4gICAgbGV0IG5vdGVzUmF0ZUFuYWx5c2lzUHJvbWlzZSA9IHRoaXMuY3JlYXRlUHJvbWlzZShyYXRlQW5hbHlzaXNOb3Rlc1VSTCk7XHJcbiAgICBsb2dnZXIuaW5mbygnbm90ZXNSYXRlQW5hbHlzaXNQcm9taXNlIGZvciBoYXMgYmVlbiBoaXQnKTtcclxuXHJcbiAgICBsZXQgYWxsVW5pdHNGcm9tUmF0ZUFuYWx5c2lzVVJMID0gY29uZmlnLmdldChDb25zdGFudHMuUkFURV9BTkFMWVNJU19BUEkgKyBlbnRpdHkgKyBDb25zdGFudHMuUkFURV9BTkFMWVNJU19VTklUKTtcclxuICAgIGxldCB1bml0c1JhdGVBbmFseXNpc1Byb21pc2UgPSB0aGlzLmNyZWF0ZVByb21pc2UoYWxsVW5pdHNGcm9tUmF0ZUFuYWx5c2lzVVJMKTtcclxuICAgIGxvZ2dlci5pbmZvKCd1bml0c1JhdGVBbmFseXNpc1Byb21pc2UgZm9yIGhhcyBiZWVuIGhpdCcpO1xyXG5cclxuICAgIGxvZ2dlci5pbmZvKCdjYWxsaW5nIFByb21pc2UuYWxsJyk7XHJcbiAgICBDQ1Byb21pc2UuYWxsKFtcclxuICAgICAgY29zdEhlYWRSYXRlQW5hbHlzaXNQcm9taXNlLFxyXG4gICAgICBjYXRlZ29yeVJhdGVBbmFseXNpc1Byb21pc2UsXHJcbiAgICAgIHdvcmtJdGVtUmF0ZUFuYWx5c2lzUHJvbWlzZSxcclxuICAgICAgcmF0ZUl0ZW1SYXRlQW5hbHlzaXNQcm9taXNlLFxyXG4gICAgICBub3Rlc1JhdGVBbmFseXNpc1Byb21pc2UsXHJcbiAgICAgIHVuaXRzUmF0ZUFuYWx5c2lzUHJvbWlzZVxyXG4gICAgXSkudGhlbihmdW5jdGlvbiAoZGF0YTogQXJyYXk8YW55Pikge1xyXG4gICAgICBsb2dnZXIuaW5mbygnY29udmVydENvc3RIZWFkc0Zyb21SYXRlQW5hbHlzaXNUb0Nvc3RDb250cm9sIFByb21pc2UuYWxsIEFQSSBpcyBzdWNjZXNzLicpO1xyXG4gICAgICBsZXQgY29zdEhlYWRzUmF0ZUFuYWx5c2lzID0gZGF0YVswXVtDb25zdGFudHMuUkFURV9BTkFMWVNJU19JVEVNX1RZUEVdO1xyXG4gICAgICBsZXQgY2F0ZWdvcmllc1JhdGVBbmFseXNpcyA9IGRhdGFbMV1bQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfU1VCSVRFTV9UWVBFXTtcclxuICAgICAgbGV0IHdvcmtJdGVtc1JhdGVBbmFseXNpcyA9IGRhdGFbMl1bQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfSVRFTVNdO1xyXG4gICAgICBsZXQgcmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzID0gZGF0YVszXVtDb25zdGFudHMuUkFURV9BTkFMWVNJU19EQVRBXTtcclxuICAgICAgbGV0IG5vdGVzUmF0ZUFuYWx5c2lzID0gZGF0YVs0XVtDb25zdGFudHMuUkFURV9BTkFMWVNJU19EQVRBXTtcclxuICAgICAgbGV0IHVuaXRzUmF0ZUFuYWx5c2lzID0gZGF0YVs1XVtDb25zdGFudHMuUkFURV9BTkFMWVNJU19VT01dO1xyXG5cclxuICAgICAgbGV0IGJ1aWxkaW5nQ29zdEhlYWRzOiBBcnJheTxDb3N0SGVhZD4gPSBbXTtcclxuICAgICAgbGV0IHJhdGVBbmFseXNpc1NlcnZpY2UgPSBuZXcgUmF0ZUFuYWx5c2lzU2VydmljZSgpO1xyXG5cclxuICAgICAgcmF0ZUFuYWx5c2lzU2VydmljZS5nZXRDb3N0SGVhZHNGcm9tUmF0ZUFuYWx5c2lzKGNvc3RIZWFkc1JhdGVBbmFseXNpcywgY2F0ZWdvcmllc1JhdGVBbmFseXNpcywgd29ya0l0ZW1zUmF0ZUFuYWx5c2lzLFxyXG4gICAgICAgIHJhdGVJdGVtc1JhdGVBbmFseXNpcywgdW5pdHNSYXRlQW5hbHlzaXMsIG5vdGVzUmF0ZUFuYWx5c2lzLCBidWlsZGluZ0Nvc3RIZWFkcyk7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdzdWNjZXNzIGluICBjb252ZXJ0Q29zdEhlYWRzRnJvbVJhdGVBbmFseXNpc1RvQ29zdENvbnRyb2wuJyk7XHJcbiAgICAgIGNhbGxiYWNrKG51bGwsIHtcclxuICAgICAgICAnYnVpbGRpbmdDb3N0SGVhZHMnOiBidWlsZGluZ0Nvc3RIZWFkcyxcclxuICAgICAgICAncmF0ZXMnOiByYXRlSXRlbXNSYXRlQW5hbHlzaXMsXHJcbiAgICAgICAgJ3VuaXRzJzogdW5pdHNSYXRlQW5hbHlzaXNcclxuICAgICAgfSk7XHJcbiAgICB9KS5jYXRjaChmdW5jdGlvbiAoZTogYW55KSB7XHJcbiAgICAgIGxvZ2dlci5lcnJvcignIFByb21pc2UgZmFpbGVkIGZvciBjb252ZXJ0Q29zdEhlYWRzRnJvbVJhdGVBbmFseXNpc1RvQ29zdENvbnRyb2wgISA6JyArIEpTT04uc3RyaW5naWZ5KGUubWVzc2FnZSkpO1xyXG4gICAgICBDQ1Byb21pc2UucmVqZWN0KGUubWVzc2FnZSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGNyZWF0ZVByb21pc2UodXJsOiBzdHJpbmcpIHtcclxuICAgIHJldHVybiBuZXcgQ0NQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlOiBhbnksIHJlamVjdDogYW55KSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdjcmVhdGVQcm9taXNlIGhhcyBiZWVuIGhpdCBmb3IgOiAnICsgdXJsKTtcclxuICAgICAgbGV0IHJhdGVBbmFseXNpc1NlcnZpY2UgPSBuZXcgUmF0ZUFuYWx5c2lzU2VydmljZSgpO1xyXG4gICAgICByYXRlQW5hbHlzaXNTZXJ2aWNlLmdldEFwaUNhbGwodXJsLCAoZXJyb3I6IGFueSwgZGF0YTogYW55KSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnRXJyb3IgaW4gY3JlYXRlUHJvbWlzZSBnZXQgZGF0YSBmcm9tIHJhdGUgYW5hbHlzaXM6ICcgKyBKU09OLnN0cmluZ2lmeShlcnJvcikpO1xyXG4gICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ2NyZWF0ZVByb21pc2UgZGF0YSBmcm9tIHJhdGUgYW5hbHlzaXMgc3VjY2Vzcy4nKTtcclxuICAgICAgICAgIHJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlOiBhbnkpIHtcclxuICAgICAgbG9nZ2VyLmVycm9yKCdQcm9taXNlIGZhaWxlZCBmb3IgaW5kaXZpZHVhbCAhIHVybDonICsgdXJsICsgJzpcXG4gZXJyb3IgOicgKyBKU09OLnN0cmluZ2lmeShlLm1lc3NhZ2UpKTtcclxuICAgICAgQ0NQcm9taXNlLnJlamVjdChlLm1lc3NhZ2UpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRDb3N0SGVhZHNGcm9tUmF0ZUFuYWx5c2lzKGNvc3RIZWFkc1JhdGVBbmFseXNpczogYW55LCBjYXRlZ29yaWVzUmF0ZUFuYWx5c2lzOiBhbnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3b3JrSXRlbXNSYXRlQW5hbHlzaXM6IGFueSwgcmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzOiBhbnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0c1JhdGVBbmFseXNpczogYW55LCBub3Rlc1JhdGVBbmFseXNpczogYW55LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVpbGRpbmdDb3N0SGVhZHM6IEFycmF5PENvc3RIZWFkPikge1xyXG4gICAgbG9nZ2VyLmluZm8oJ2dldENvc3RIZWFkc0Zyb21SYXRlQW5hbHlzaXMgaGFzIGJlZW4gaGl0LicpO1xyXG4gICAgLy9sZXQgYnVkZ2V0Q29zdEhlYWRzID0gY29uZmlnLmdldCgnYnVkZ2V0ZWRDb3N0Rm9ybXVsYWUnKTtcclxuICAgIGZvciAobGV0IGNvc3RIZWFkSW5kZXggPSAwOyBjb3N0SGVhZEluZGV4IDwgY29zdEhlYWRzUmF0ZUFuYWx5c2lzLmxlbmd0aDsgY29zdEhlYWRJbmRleCsrKSB7XHJcblxyXG4gICAgaWYoY29uZmlnLmhhcygnYnVkZ2V0ZWRDb3N0Rm9ybXVsYWUuJysgY29zdEhlYWRzUmF0ZUFuYWx5c2lzW2Nvc3RIZWFkSW5kZXhdLkMyKSkge1xyXG4gICAgICBsZXQgY29zdEhlYWQgPSBuZXcgQ29zdEhlYWQoKTtcclxuICAgICAgY29zdEhlYWQubmFtZSA9IGNvc3RIZWFkc1JhdGVBbmFseXNpc1tjb3N0SGVhZEluZGV4XS5DMjtcclxuICAgICAgbGV0IGNvbmZpZ0Nvc3RIZWFkcyA9IGNvbmZpZy5nZXQoJ2NvbmZpZ0Nvc3RIZWFkcycpO1xyXG4gICAgICBsZXQgY2F0ZWdvcmllcyA9IG5ldyBBcnJheTxDYXRlZ29yeT4oKTtcclxuXHJcbiAgICAgICAgaWYgKGNvbmZpZ0Nvc3RIZWFkcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICBsZXQgaXNDb3N0SGVhZEV4aXN0U1FMID0gJ1NFTEVDVCAqIEZST00gPyBBUyB3b3JraXRlbXMgV0hFUkUgVFJJTSh3b3JraXRlbXMubmFtZSk9ID8nO1xyXG4gICAgICAgICAgbGV0IGNvc3RIZWFkRXhpc3RBcnJheSA9IGFsYXNxbChpc0Nvc3RIZWFkRXhpc3RTUUwsW2NvbmZpZ0Nvc3RIZWFkcywgY29zdEhlYWQubmFtZV0pO1xyXG4gICAgICAgICAgaWYoY29zdEhlYWRFeGlzdEFycmF5Lmxlbmd0aCAhPT0gMCApIHtcclxuICAgICAgICAgICAgY29zdEhlYWQucHJpb3JpdHlJZCA9IGNvc3RIZWFkRXhpc3RBcnJheVswXS5wcmlvcml0eUlkO1xyXG4gICAgICAgICAgICBjYXRlZ29yaWVzID0gY29zdEhlYWRFeGlzdEFycmF5WzBdLmNhdGVnb3JpZXM7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvc3RIZWFkLnJhdGVBbmFseXNpc0lkID0gY29zdEhlYWRzUmF0ZUFuYWx5c2lzW2Nvc3RIZWFkSW5kZXhdLkMxO1xyXG5cclxuICAgICAgICBsZXQgY2F0ZWdvcmllc1JhdGVBbmFseXNpc1NRTCA9ICdTRUxFQ1QgQ2F0ZWdvcnkuQzEgQVMgcmF0ZUFuYWx5c2lzSWQsIENhdGVnb3J5LkMyIEFTIG5hbWUnICtcclxuICAgICAgICAgICcgRlJPTSA/IEFTIENhdGVnb3J5IHdoZXJlIENhdGVnb3J5LkMzID0gJyArIGNvc3RIZWFkLnJhdGVBbmFseXNpc0lkO1xyXG5cclxuICAgICAgICBsZXQgY2F0ZWdvcmllc0J5Q29zdEhlYWQgPSBhbGFzcWwoY2F0ZWdvcmllc1JhdGVBbmFseXNpc1NRTCwgW2NhdGVnb3JpZXNSYXRlQW5hbHlzaXNdKTtcclxuICAgICAgICBsZXQgYnVpbGRpbmdDYXRlZ29yaWVzOiBBcnJheTxDYXRlZ29yeT4gPSBuZXcgQXJyYXk8Q2F0ZWdvcnk+KCk7XHJcblxyXG4gICAgICAgIGlmIChjYXRlZ29yaWVzQnlDb3N0SGVhZC5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgIHRoaXMuZ2V0V29ya0l0ZW1zV2l0aG91dENhdGVnb3J5RnJvbVJhdGVBbmFseXNpcyhjb3N0SGVhZC5yYXRlQW5hbHlzaXNJZCwgd29ya0l0ZW1zUmF0ZUFuYWx5c2lzLFxyXG4gICAgICAgICAgICByYXRlSXRlbXNSYXRlQW5hbHlzaXMsIHVuaXRzUmF0ZUFuYWx5c2lzLCBub3Rlc1JhdGVBbmFseXNpcywgYnVpbGRpbmdDYXRlZ29yaWVzLCBjYXRlZ29yaWVzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5nZXRDYXRlZ29yaWVzRnJvbVJhdGVBbmFseXNpcyhjYXRlZ29yaWVzQnlDb3N0SGVhZCwgd29ya0l0ZW1zUmF0ZUFuYWx5c2lzLFxyXG4gICAgICAgICAgICByYXRlSXRlbXNSYXRlQW5hbHlzaXMsIHVuaXRzUmF0ZUFuYWx5c2lzLCBub3Rlc1JhdGVBbmFseXNpcywgYnVpbGRpbmdDYXRlZ29yaWVzLCBjYXRlZ29yaWVzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvc3RIZWFkLmNhdGVnb3JpZXMgPSBidWlsZGluZ0NhdGVnb3JpZXM7XHJcbiAgICAgICAgY29zdEhlYWQudGh1bWJSdWxlUmF0ZSA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLlRIVU1CUlVMRV9SQVRFKTtcclxuICAgICAgICBidWlsZGluZ0Nvc3RIZWFkcy5wdXNoKGNvc3RIZWFkKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnQ29zdEhlYWQgVW5hdmFpYWxhYmVsIDogJytjb3N0SGVhZHNSYXRlQW5hbHlzaXNbY29zdEhlYWRJbmRleF0uQzIpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXRDYXRlZ29yaWVzRnJvbVJhdGVBbmFseXNpcyhjYXRlZ29yaWVzQnlDb3N0SGVhZDogYW55LCB3b3JrSXRlbXNSYXRlQW5hbHlzaXM6IGFueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByYXRlSXRlbXNSYXRlQW5hbHlzaXM6IGFueSwgdW5pdHNSYXRlQW5hbHlzaXM6IGFueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub3Rlc1JhdGVBbmFseXNpczogYW55LCBidWlsZGluZ0NhdGVnb3JpZXM6IEFycmF5PENhdGVnb3J5PiwgY29uZmlnQ2F0ZWdvcmllczogQXJyYXk8Q2F0ZWdvcnk+KSB7XHJcblxyXG4gICAgbG9nZ2VyLmluZm8oJ2dldENhdGVnb3JpZXNGcm9tUmF0ZUFuYWx5c2lzIGhhcyBiZWVuIGhpdC4nKTtcclxuXHJcbiAgICBmb3IgKGxldCBjYXRlZ29yeUluZGV4ID0gMDsgY2F0ZWdvcnlJbmRleCA8IGNhdGVnb3JpZXNCeUNvc3RIZWFkLmxlbmd0aDsgY2F0ZWdvcnlJbmRleCsrKSB7XHJcblxyXG4gICAgICBsZXQgY2F0ZWdvcnkgPSBuZXcgQ2F0ZWdvcnkoY2F0ZWdvcmllc0J5Q29zdEhlYWRbY2F0ZWdvcnlJbmRleF0ubmFtZSwgY2F0ZWdvcmllc0J5Q29zdEhlYWRbY2F0ZWdvcnlJbmRleF0ucmF0ZUFuYWx5c2lzSWQpO1xyXG4gICAgICBsZXQgY29uZmlnV29ya0l0ZW1zID0gbmV3IEFycmF5PFdvcmtJdGVtPigpO1xyXG5cclxuICAgICAgaWYgKGNvbmZpZ0NhdGVnb3JpZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGZvciAobGV0IGNvbmZpZ0NhdGVnb3J5IG9mIGNvbmZpZ0NhdGVnb3JpZXMpIHtcclxuICAgICAgICAgIGlmIChjb25maWdDYXRlZ29yeS5uYW1lID09PSBjYXRlZ29yaWVzQnlDb3N0SGVhZFtjYXRlZ29yeUluZGV4XS5uYW1lKSB7XHJcbiAgICAgICAgICAgIGNvbmZpZ1dvcmtJdGVtcyA9IGNvbmZpZ0NhdGVnb3J5LndvcmtJdGVtcztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCB3b3JrSXRlbXNSYXRlQW5hbHlzaXNTUUwgPSAnU0VMRUNUIHdvcmtJdGVtLkMyIEFTIHJhdGVBbmFseXNpc0lkLCB3b3JrSXRlbS5DMyBBUyBuYW1lJyArXHJcbiAgICAgICAgJyBGUk9NID8gQVMgd29ya0l0ZW0gd2hlcmUgd29ya0l0ZW0uQzQgPSAnICsgY2F0ZWdvcmllc0J5Q29zdEhlYWRbY2F0ZWdvcnlJbmRleF0ucmF0ZUFuYWx5c2lzSWQ7XHJcblxyXG4gICAgICBsZXQgd29ya0l0ZW1zQnlDYXRlZ29yeSA9IGFsYXNxbCh3b3JrSXRlbXNSYXRlQW5hbHlzaXNTUUwsIFt3b3JrSXRlbXNSYXRlQW5hbHlzaXNdKTtcclxuICAgICAgbGV0IGJ1aWxkaW5nV29ya0l0ZW1zOiBBcnJheTxXb3JrSXRlbT4gPSBuZXcgQXJyYXk8V29ya0l0ZW0+KCk7XHJcblxyXG4gICAgICB0aGlzLmdldFdvcmtJdGVtc0Zyb21SYXRlQW5hbHlzaXMod29ya0l0ZW1zQnlDYXRlZ29yeSwgcmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzLFxyXG4gICAgICAgIHVuaXRzUmF0ZUFuYWx5c2lzLCBub3Rlc1JhdGVBbmFseXNpcywgYnVpbGRpbmdXb3JrSXRlbXMsIGNvbmZpZ1dvcmtJdGVtcyk7XHJcblxyXG4gICAgICBjYXRlZ29yeS53b3JrSXRlbXMgPSBidWlsZGluZ1dvcmtJdGVtcztcclxuICAgICAgYnVpbGRpbmdDYXRlZ29yaWVzLnB1c2goY2F0ZWdvcnkpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKGNvbmZpZ0NhdGVnb3JpZXMubGVuZ3RoID4gMCkge1xyXG5cclxuICAgICAgZm9yKGxldCBjb25maWdDYXRlZ29yeUluZGV4PTA7IGNvbmZpZ0NhdGVnb3J5SW5kZXggPCBjb25maWdDYXRlZ29yaWVzLmxlbmd0aDsgY29uZmlnQ2F0ZWdvcnlJbmRleCsrKSB7XHJcbiAgICAgICAgbGV0IGlzQ2F0ZWdvcnlFeGlzdHNTUUwgPSAnU0VMRUNUICogRlJPTSA/IEFTIHdvcmtpdGVtcyBXSEVSRSBUUklNKHdvcmtpdGVtcy5uYW1lKT0gPyc7XHJcbiAgICAgICAgbGV0IGNhdGVnb3J5RXhpc3RzQXJyYXkgPSBhbGFzcWwoaXNDYXRlZ29yeUV4aXN0c1NRTCxbY2F0ZWdvcmllc0J5Q29zdEhlYWQsIGNvbmZpZ0NhdGVnb3JpZXNbY29uZmlnQ2F0ZWdvcnlJbmRleF0ubmFtZV0pO1xyXG4gICAgICAgIGlmKGNhdGVnb3J5RXhpc3RzQXJyYXkubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICBsZXQgY29uZmlnQ2F0ID0gbmV3IENhdGVnb3J5KGNvbmZpZ0NhdGVnb3JpZXNbY29uZmlnQ2F0ZWdvcnlJbmRleF0ubmFtZSwgY29uZmlnQ2F0ZWdvcmllc1tjb25maWdDYXRlZ29yeUluZGV4XS5yYXRlQW5hbHlzaXNJZCk7XHJcbiAgICAgICAgICBjb25maWdDYXQud29ya0l0ZW1zID0gdGhpcy5nZXRXb3JraXRlbXNGb3JDb25maWdDYXRlZ29yeShjb25maWdDYXRlZ29yaWVzW2NvbmZpZ0NhdGVnb3J5SW5kZXhdLndvcmtJdGVtcyk7XHJcbiAgICAgICAgICBidWlsZGluZ0NhdGVnb3JpZXMucHVzaChjb25maWdDYXQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0V29ya2l0ZW1zRm9yQ29uZmlnQ2F0ZWdvcnkoY29uZmlnV29ya2l0ZW1zOmFueSkge1xyXG4gICAgbGV0IHdvcmtJdGVtc0xpc3QgPSBuZXcgQXJyYXk8V29ya0l0ZW0+KCk7XHJcbiAgICBmb3IobGV0IHdvcmtpdGVtSW5kZXg9MDsgd29ya2l0ZW1JbmRleCA8IGNvbmZpZ1dvcmtpdGVtcy5sZW5ndGg7IHdvcmtpdGVtSW5kZXgrKykge1xyXG4gICAgICBsZXQgY29uZmlnV29ya2l0ZW0gPSB0aGlzLmNvbnZlcnRDb25maWdvcmtpdGVtKGNvbmZpZ1dvcmtpdGVtc1t3b3JraXRlbUluZGV4XSk7XHJcbiAgICAgIHdvcmtJdGVtc0xpc3QucHVzaChjb25maWdXb3JraXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gd29ya0l0ZW1zTGlzdDtcclxuICB9XHJcblxyXG4gIGdldFdvcmtJdGVtc1dpdGhvdXRDYXRlZ29yeUZyb21SYXRlQW5hbHlzaXMoY29zdEhlYWRSYXRlQW5hbHlzaXNJZDogbnVtYmVyLCB3b3JrSXRlbXNSYXRlQW5hbHlzaXM6IGFueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJhdGVJdGVtc1JhdGVBbmFseXNpczogYW55LCB1bml0c1JhdGVBbmFseXNpczogYW55LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm90ZXNSYXRlQW5hbHlzaXM6IGFueSwgYnVpbGRpbmdDYXRlZ29yaWVzOiBBcnJheTxDYXRlZ29yeT4sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWdDYXRlZ29yaWVzOiBBcnJheTxDYXRlZ29yeT4pIHtcclxuXHJcbiAgICBsb2dnZXIuaW5mbygnZ2V0V29ya0l0ZW1zV2l0aG91dENhdGVnb3J5RnJvbVJhdGVBbmFseXNpcyBoYXMgYmVlbiBoaXQuJyk7XHJcblxyXG4gICAgbGV0IHdvcmtJdGVtc1dpdGhvdXRDYXRlZ29yaWVzUmF0ZUFuYWx5c2lzU1FMID0gJ1NFTEVDVCB3b3JrSXRlbS5DMiBBUyByYXRlQW5hbHlzaXNJZCwgd29ya0l0ZW0uQzMgQVMgbmFtZScgK1xyXG4gICAgICAnIEZST00gPyBBUyB3b3JrSXRlbSB3aGVyZSBOT1Qgd29ya0l0ZW0uQzQgQU5EIHdvcmtJdGVtLkMxID0gJyArIGNvc3RIZWFkUmF0ZUFuYWx5c2lzSWQ7XHJcbiAgICBsZXQgd29ya0l0ZW1zV2l0aG91dENhdGVnb3JpZXMgPSBhbGFzcWwod29ya0l0ZW1zV2l0aG91dENhdGVnb3JpZXNSYXRlQW5hbHlzaXNTUUwsIFt3b3JrSXRlbXNSYXRlQW5hbHlzaXNdKTtcclxuXHJcbiAgICBsZXQgYnVpbGRpbmdXb3JrSXRlbXM6IEFycmF5PFdvcmtJdGVtPiA9IG5ldyBBcnJheTxXb3JrSXRlbT4oKTtcclxuICAgIGxldCBjYXRlZ29yeSA9IG5ldyBDYXRlZ29yeSgnV29yayBJdGVtcycsIDApO1xyXG4gICAgbGV0IGNvbmZpZ1dvcmtJdGVtcyA9IG5ldyBBcnJheTxXb3JrSXRlbT4oKTtcclxuXHJcbiAgICBpZiAoY29uZmlnQ2F0ZWdvcmllcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGZvciAobGV0IGNvbmZpZ0NhdGVnb3J5IG9mIGNvbmZpZ0NhdGVnb3JpZXMpIHtcclxuICAgICAgICBpZiAoY29uZmlnQ2F0ZWdvcnkubmFtZSA9PT0gJ1dvcmsgSXRlbXMnKSB7XHJcbiAgICAgICAgICBjb25maWdXb3JrSXRlbXMgPSBjb25maWdDYXRlZ29yeS53b3JrSXRlbXM7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICB0aGlzLmdldFdvcmtJdGVtc0Zyb21SYXRlQW5hbHlzaXMod29ya0l0ZW1zV2l0aG91dENhdGVnb3JpZXMsIHJhdGVJdGVtc1JhdGVBbmFseXNpcyxcclxuICAgICAgdW5pdHNSYXRlQW5hbHlzaXMsIG5vdGVzUmF0ZUFuYWx5c2lzLCBidWlsZGluZ1dvcmtJdGVtcywgY29uZmlnV29ya0l0ZW1zKTtcclxuXHJcbiAgICBjYXRlZ29yeS53b3JrSXRlbXMgPSBidWlsZGluZ1dvcmtJdGVtcztcclxuICAgIGJ1aWxkaW5nQ2F0ZWdvcmllcy5wdXNoKGNhdGVnb3J5KTtcclxuICB9XHJcblxyXG4gIHN5bmNSYXRlaXRlbUZyb21SYXRlQW5hbHlzaXMoZW50aXR5OiBzdHJpbmcsIGJ1aWxkaW5nRGV0YWlsczogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIGRhdGE6IGFueSkgPT4gdm9pZCkge1xyXG5cclxuICAgIGxldCByYXRlSXRlbVVSTCA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfQVBJICsgZW50aXR5ICsgQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfUkFURSk7XHJcbiAgICBsZXQgcmF0ZUl0ZW1SYXRlQW5hbHlzaXNQcm9taXNlID0gdGhpcy5jcmVhdGVQcm9taXNlKHJhdGVJdGVtVVJMKTtcclxuICAgIGxvZ2dlci5pbmZvKCdyYXRlSXRlbVJhdGVBbmFseXNpc1Byb21pc2UgZm9yIGhhcyBiZWVuIGhpdCcpO1xyXG5cclxuICAgIGxldCByYXRlQW5hbHlzaXNOb3Rlc1VSTCA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfQVBJICsgZW50aXR5ICsgQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfTk9URVMpO1xyXG4gICAgbGV0IG5vdGVzUmF0ZUFuYWx5c2lzUHJvbWlzZSA9IHRoaXMuY3JlYXRlUHJvbWlzZShyYXRlQW5hbHlzaXNOb3Rlc1VSTCk7XHJcbiAgICBsb2dnZXIuaW5mbygnbm90ZXNSYXRlQW5hbHlzaXNQcm9taXNlIGZvciBoYXMgYmVlbiBoaXQnKTtcclxuXHJcbiAgICBsZXQgYWxsVW5pdHNGcm9tUmF0ZUFuYWx5c2lzVVJMID0gY29uZmlnLmdldChDb25zdGFudHMuUkFURV9BTkFMWVNJU19BUEkgKyBlbnRpdHkgKyBDb25zdGFudHMuUkFURV9BTkFMWVNJU19VTklUKTtcclxuICAgIGxldCB1bml0c1JhdGVBbmFseXNpc1Byb21pc2UgPSB0aGlzLmNyZWF0ZVByb21pc2UoYWxsVW5pdHNGcm9tUmF0ZUFuYWx5c2lzVVJMKTtcclxuICAgIGxvZ2dlci5pbmZvKCd1bml0c1JhdGVBbmFseXNpc1Byb21pc2UgZm9yIGhhcyBiZWVuIGhpdCcpO1xyXG5cclxuICAgIGxldCBjb3N0SGVhZFVSTCA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfQVBJICsgZW50aXR5ICsgQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfQ09TVEhFQURTKTtcclxuICAgIGxldCBjb3N0SGVhZFJhdGVBbmFseXNpc1Byb21pc2UgPSB0aGlzLmNyZWF0ZVByb21pc2UoY29zdEhlYWRVUkwpO1xyXG4gICAgbG9nZ2VyLmluZm8oJ2Nvc3RIZWFkUmF0ZUFuYWx5c2lzUHJvbWlzZSBmb3IgaGFzIGJlZW4gaGl0Jyk7XHJcblxyXG4gICAgQ0NQcm9taXNlLmFsbChbXHJcbiAgICAgIHJhdGVJdGVtUmF0ZUFuYWx5c2lzUHJvbWlzZSxcclxuICAgICAgbm90ZXNSYXRlQW5hbHlzaXNQcm9taXNlLFxyXG4gICAgICB1bml0c1JhdGVBbmFseXNpc1Byb21pc2UsXHJcbiAgICAgIGNvc3RIZWFkUmF0ZUFuYWx5c2lzUHJvbWlzZVxyXG4gICAgXSkudGhlbihmdW5jdGlvbiAoZGF0YTogQXJyYXk8YW55Pikge1xyXG4gICAgICBsb2dnZXIuaW5mbygnY29udmVydENvc3RIZWFkc0Zyb21SYXRlQW5hbHlzaXNUb0Nvc3RDb250cm9sIFByb21pc2UuYWxsIEFQSSBpcyBzdWNjZXNzLicpO1xyXG4gICAgICBsb2dnZXIuaW5mbygnc3VjY2VzcyBpbiAgY29udmVydENvc3RIZWFkc0Zyb21SYXRlQW5hbHlzaXNUb0Nvc3RDb250cm9sLicpO1xyXG4gICAgICBjYWxsYmFjayhudWxsLCBkYXRhKTtcclxuICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlOiBhbnkpIHtcclxuICAgICAgbG9nZ2VyLmVycm9yKCcgUHJvbWlzZSBmYWlsZWQgZm9yIGNvbnZlcnRDb3N0SGVhZHNGcm9tUmF0ZUFuYWx5c2lzVG9Db3N0Q29udHJvbCAhIDonICsgZS5tZXNzYWdlKTtcclxuICAgICAgQ0NQcm9taXNlLnJlamVjdChlLm1lc3NhZ2UpO1xyXG4gICAgfSk7XHJcblxyXG4gIH1cclxuXHJcbiAgZ2V0V29ya0l0ZW1zRnJvbVJhdGVBbmFseXNpcyh3b3JrSXRlbXNCeUNhdGVnb3J5OiBhbnksIHJhdGVJdGVtc1JhdGVBbmFseXNpczogYW55LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdHNSYXRlQW5hbHlzaXM6IGFueSwgbm90ZXNSYXRlQW5hbHlzaXM6IGFueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1aWxkaW5nV29ya0l0ZW1zOiBBcnJheTxXb3JrSXRlbT4sIGNvbmZpZ1dvcmtJdGVtczogQXJyYXk8YW55Pikge1xyXG5cclxuICAgIGxvZ2dlci5pbmZvKCdnZXRXb3JrSXRlbXNGcm9tUmF0ZUFuYWx5c2lzIGhhcyBiZWVuIGhpdC4nKTtcclxuICAgIGZvciAobGV0IGNhdGVnb3J5V29ya2l0ZW0gb2Ygd29ya0l0ZW1zQnlDYXRlZ29yeSkge1xyXG4gICAgICAgIGxldCB3b3JrSXRlbSA9IHRoaXMuZ2V0UmF0ZUFuYWx5c2lzKGNhdGVnb3J5V29ya2l0ZW0sIGNvbmZpZ1dvcmtJdGVtcywgcmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzLFxyXG4gICAgICAgICAgdW5pdHNSYXRlQW5hbHlzaXMsIG5vdGVzUmF0ZUFuYWx5c2lzKTtcclxuICAgICAgICBpZih3b3JrSXRlbSkge1xyXG4gICAgICAgICAgYnVpbGRpbmdXb3JrSXRlbXMucHVzaCh3b3JrSXRlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZm9yKGxldCBjb25maWdXb3JrSXRlbSBvZiBjb25maWdXb3JrSXRlbXMpIHtcclxuICAgICAgbGV0IGlzV29ya0l0ZW1FeGlzdFNRTCA9ICdTRUxFQ1QgKiBGUk9NID8gQVMgd29ya2l0ZW1zIFdIRVJFIFRSSU0od29ya2l0ZW1zLm5hbWUpPSA/JztcclxuICAgICAgbGV0IHdvcmtJdGVtRXhpc3RBcnJheSA9IGFsYXNxbChpc1dvcmtJdGVtRXhpc3RTUUwsW3dvcmtJdGVtc0J5Q2F0ZWdvcnksIGNvbmZpZ1dvcmtJdGVtLm5hbWVdKTtcclxuICAgICAgaWYod29ya0l0ZW1FeGlzdEFycmF5Lmxlbmd0aCA9PT0gMCAmJiBjb25maWdXb3JrSXRlbS5yYXRlQW5hbHlzaXNJZCkge1xyXG4gICAgICAgIGxldCB3b3JraXRlbSA9IHRoaXMuY29udmVydENvbmZpZ29ya2l0ZW0oY29uZmlnV29ya0l0ZW0pO1xyXG4gICAgICAgIGJ1aWxkaW5nV29ya0l0ZW1zLnB1c2god29ya2l0ZW0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjb252ZXJ0Q29uZmlnb3JraXRlbShjb25maWdXb3JrSXRlbSA6IGFueSkge1xyXG5cclxuICAgIGxldCB3b3JrSXRlbSA9IG5ldyBXb3JrSXRlbShjb25maWdXb3JrSXRlbS5uYW1lLCBjb25maWdXb3JrSXRlbS5yYXRlQW5hbHlzaXNJZCk7XHJcbiAgICB3b3JrSXRlbS5pc0RpcmVjdFJhdGUgPSAhY29uZmlnV29ya0l0ZW0uaXNSYXRlQW5hbHlzaXM7XHJcbiAgICB3b3JrSXRlbS5pc1JhdGVBbmFseXNpcyA9IGNvbmZpZ1dvcmtJdGVtLmlzUmF0ZUFuYWx5c2lzO1xyXG4gICAgd29ya0l0ZW0uaXNNZWFzdXJlbWVudFNoZWV0ID0gY29uZmlnV29ya0l0ZW0uaXNNZWFzdXJlbWVudFNoZWV0O1xyXG4gICAgd29ya0l0ZW0uaXNTdGVlbFdvcmtJdGVtID0gY29uZmlnV29ya0l0ZW0uaXNTdGVlbFdvcmtJdGVtO1xyXG4gICAgd29ya0l0ZW0ucmF0ZUFuYWx5c2lzUGVyVW5pdCA9IGNvbmZpZ1dvcmtJdGVtLnJhdGVBbmFseXNpc1BlclVuaXQ7XHJcbiAgICB3b3JrSXRlbS5yYXRlQW5hbHlzaXNVbml0ID0gY29uZmlnV29ya0l0ZW0ucmF0ZUFuYWx5c2lzVW5pdDtcclxuICAgIHdvcmtJdGVtLmlzSXRlbUJyZWFrZG93blJlcXVpcmVkID0gY29uZmlnV29ya0l0ZW0uaXNJdGVtQnJlYWtkb3duUmVxdWlyZWQ7XHJcbiAgICB3b3JrSXRlbS5sZW5ndGggPSBjb25maWdXb3JrSXRlbS5sZW5ndGg7XHJcbiAgICB3b3JrSXRlbS5icmVhZHRoT3JXaWR0aCA9IGNvbmZpZ1dvcmtJdGVtLmJyZWFkdGhPcldpZHRoO1xyXG4gICAgd29ya0l0ZW0uaGVpZ2h0ID0gY29uZmlnV29ya0l0ZW0uaGVpZ2h0O1xyXG4gICAgd29ya0l0ZW0udW5pdCA9IGNvbmZpZ1dvcmtJdGVtLm1lYXN1cmVtZW50VW5pdDtcclxuXHJcbiAgICBpZighY29uZmlnV29ya0l0ZW0uaXNSYXRlQW5hbHlzaXMpIHtcclxuICAgICAgd29ya0l0ZW0ucmF0ZS50b3RhbCA9IGNvbmZpZ1dvcmtJdGVtLmRpcmVjdFJhdGU7XHJcbiAgICAgIHdvcmtJdGVtLnJhdGUudW5pdCA9IGNvbmZpZ1dvcmtJdGVtLmRpcmVjdFJhdGVQZXJVbml0O1xyXG4gICAgICB3b3JrSXRlbS5yYXRlLmlzRXN0aW1hdGVkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gd29ya0l0ZW07XHJcbiAgfVxyXG5cclxuICBnZXRSYXRlQW5hbHlzaXMoY2F0ZWdvcnlXb3JraXRlbTogV29ya0l0ZW0sIGNvbmZpZ1dvcmtJdGVtczogQXJyYXk8YW55PiwgcmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzOiBhbnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0c1JhdGVBbmFseXNpczogYW55LCBub3Rlc1JhdGVBbmFseXNpczogYW55KSB7XHJcblxyXG4gICAgbGV0IGlzV29ya0l0ZW1FeGlzdFNRTCA9ICdTRUxFQ1QgKiBGUk9NID8gQVMgd29ya2l0ZW1zIFdIRVJFIFRSSU0od29ya2l0ZW1zLm5hbWUpPSA/JztcclxuICAgIGxldCB3b3JrSXRlbUV4aXN0QXJyYXkgPSBhbGFzcWwoaXNXb3JrSXRlbUV4aXN0U1FMLFtjb25maWdXb3JrSXRlbXMsIGNhdGVnb3J5V29ya2l0ZW0ubmFtZV0pO1xyXG5cclxuICAgIGlmKHdvcmtJdGVtRXhpc3RBcnJheS5sZW5ndGggIT09IDApIHtcclxuXHJcbiAgICAgIGxldCAgd29ya0l0ZW0gPSBuZXcgV29ya0l0ZW0oY2F0ZWdvcnlXb3JraXRlbS5uYW1lLCBjYXRlZ29yeVdvcmtpdGVtLnJhdGVBbmFseXNpc0lkKTtcclxuXHJcbiAgICAgIGlmKGNhdGVnb3J5V29ya2l0ZW0uYWN0aXZlIT09dW5kZWZpbmVkICYmIGNhdGVnb3J5V29ya2l0ZW0uYWN0aXZlIT09bnVsbCkge1xyXG4gICAgICAgIHdvcmtJdGVtID0gY2F0ZWdvcnlXb3JraXRlbTtcclxuICAgICAgfVxyXG5cclxuICAgICAgd29ya0l0ZW0udW5pdCA9IHdvcmtJdGVtRXhpc3RBcnJheVswXS5tZWFzdXJlbWVudFVuaXQ7XHJcbiAgICAgIHdvcmtJdGVtLmlzTWVhc3VyZW1lbnRTaGVldCA9IHdvcmtJdGVtRXhpc3RBcnJheVswXS5pc01lYXN1cmVtZW50U2hlZXQ7XHJcbiAgICAgIHdvcmtJdGVtLmlzUmF0ZUFuYWx5c2lzID0gd29ya0l0ZW1FeGlzdEFycmF5WzBdLmlzUmF0ZUFuYWx5c2lzO1xyXG4gICAgICB3b3JrSXRlbS5pc1N0ZWVsV29ya0l0ZW0gPSB3b3JrSXRlbUV4aXN0QXJyYXlbMF0uaXNTdGVlbFdvcmtJdGVtO1xyXG4gICAgICB3b3JrSXRlbS5yYXRlQW5hbHlzaXNQZXJVbml0ID0gd29ya0l0ZW1FeGlzdEFycmF5WzBdLnJhdGVBbmFseXNpc1BlclVuaXQ7XHJcbiAgICAgIHdvcmtJdGVtLmlzSXRlbUJyZWFrZG93blJlcXVpcmVkID0gd29ya0l0ZW1FeGlzdEFycmF5WzBdLmlzSXRlbUJyZWFrZG93blJlcXVpcmVkO1xyXG4gICAgICB3b3JrSXRlbS5sZW5ndGggPSB3b3JrSXRlbUV4aXN0QXJyYXlbMF0ubGVuZ3RoO1xyXG4gICAgICB3b3JrSXRlbS5icmVhZHRoT3JXaWR0aCA9IHdvcmtJdGVtRXhpc3RBcnJheVswXS5icmVhZHRoT3JXaWR0aDtcclxuICAgICAgd29ya0l0ZW0uaGVpZ2h0ID0gd29ya0l0ZW1FeGlzdEFycmF5WzBdLmhlaWdodDtcclxuXHJcbiAgICAgIGxldCByYXRlSXRlbXNSYXRlQW5hbHlzaXNTUUwgPSAnU0VMRUNUIHJhdGVJdGVtLkMyIEFTIGl0ZW1OYW1lLCByYXRlSXRlbS5DMiBBUyBvcmlnaW5hbEl0ZW1OYW1lLCcgK1xyXG4gICAgICAgICdyYXRlSXRlbS5DMTIgQVMgcmF0ZUFuYWx5c2lzSWQsIHJhdGVJdGVtLkM2IEFTIHR5cGUsJyArXHJcbiAgICAgICAgJ1JPVU5EKHJhdGVJdGVtLkM3LDIpIEFTIHF1YW50aXR5LCBST1VORChyYXRlSXRlbS5DMywyKSBBUyByYXRlLCB1bml0LkMyIEFTIHVuaXQsJyArXHJcbiAgICAgICAgJ1JPVU5EKHJhdGVJdGVtLkMzICogcmF0ZUl0ZW0uQzcsMikgQVMgdG90YWxBbW91bnQsIHJhdGVJdGVtLkM1IEFTIHRvdGFsUXVhbnRpdHksIHJhdGVJdGVtLkMxMyBBUyBub3Rlc1JhdGVBbmFseXNpc0lkICAnICtcclxuICAgICAgICAnRlJPTSA/IEFTIHJhdGVJdGVtIEpPSU4gPyBBUyB1bml0IE9OIHVuaXQuQzEgPSByYXRlSXRlbS5DOSB3aGVyZSByYXRlSXRlbS5DMSA9ICdcclxuICAgICAgICArIGNhdGVnb3J5V29ya2l0ZW0ucmF0ZUFuYWx5c2lzSWQ7XHJcbiAgICAgIGxldCByYXRlSXRlbXNCeVdvcmtJdGVtID0gYWxhc3FsKHJhdGVJdGVtc1JhdGVBbmFseXNpc1NRTCwgW3JhdGVJdGVtc1JhdGVBbmFseXNpcywgdW5pdHNSYXRlQW5hbHlzaXNdKTtcclxuICAgICAgbGV0IG5vdGVzID0gJyc7XHJcbiAgICAgIGxldCBpbWFnZVVSTCA9ICcnO1xyXG4gICAgICB3b3JrSXRlbS5yYXRlLnJhdGVJdGVtcyA9IHJhdGVJdGVtc0J5V29ya0l0ZW07XHJcblxyXG4gICAgICBpZiAocmF0ZUl0ZW1zQnlXb3JrSXRlbSAmJiByYXRlSXRlbXNCeVdvcmtJdGVtLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBsZXQgbm90ZXNSYXRlQW5hbHlzaXNTUUwgPSAnU0VMRUNUIG5vdGVzLkMyIEFTIG5vdGVzLCBub3Rlcy5DMyBBUyBpbWFnZVVSTCBGUk9NID8gQVMgbm90ZXMgd2hlcmUgbm90ZXMuQzEgPSAnK1xyXG4gICAgICAgICAgcmF0ZUl0ZW1zQnlXb3JrSXRlbVswXS5ub3Rlc1JhdGVBbmFseXNpc0lkO1xyXG4gICAgICAgIGxldCBub3Rlc0xpc3QgPSBhbGFzcWwobm90ZXNSYXRlQW5hbHlzaXNTUUwsIFtub3Rlc1JhdGVBbmFseXNpc10pO1xyXG4gICAgICAgIG5vdGVzID0gbm90ZXNMaXN0WzBdLm5vdGVzO1xyXG4gICAgICAgIGltYWdlVVJMID0gbm90ZXNMaXN0WzBdLmltYWdlVVJMO1xyXG5cclxuICAgICAgICB3b3JrSXRlbS5yYXRlLnF1YW50aXR5ID0gcmF0ZUl0ZW1zQnlXb3JrSXRlbVswXS50b3RhbFF1YW50aXR5O1xyXG4gICAgICAgIHdvcmtJdGVtLnN5c3RlbVJhdGUucXVhbnRpdHkgPSByYXRlSXRlbXNCeVdvcmtJdGVtWzBdLnRvdGFsUXVhbnRpdHk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgd29ya0l0ZW0ucmF0ZS5xdWFudGl0eSA9IDE7XHJcbiAgICAgICAgd29ya0l0ZW0uc3lzdGVtUmF0ZS5xdWFudGl0eSA9IDE7XHJcbiAgICAgIH1cclxuICAgICAgd29ya0l0ZW0ucmF0ZS5pc0VzdGltYXRlZCA9IHRydWU7XHJcbiAgICAgIHdvcmtJdGVtLnJhdGUubm90ZXMgPSBub3RlcztcclxuICAgICAgd29ya0l0ZW0ucmF0ZS5pbWFnZVVSTCA9aW1hZ2VVUkw7XHJcblxyXG4gICAgICAvL1N5c3RlbSByYXRlXHJcblxyXG4gICAgICB3b3JrSXRlbS5zeXN0ZW1SYXRlLnJhdGVJdGVtcyA9IHJhdGVJdGVtc0J5V29ya0l0ZW07XHJcbiAgICAgIHdvcmtJdGVtLnN5c3RlbVJhdGUubm90ZXMgPSBub3RlcztcclxuICAgICAgd29ya0l0ZW0uc3lzdGVtUmF0ZS5pbWFnZVVSTCA9IGltYWdlVVJMO1xyXG4gICAgICByZXR1cm4gd29ya0l0ZW07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG4gIFN5bmNSYXRlQW5hbHlzaXMoKSB7XHJcbiAgICBsZXQgcmF0ZUFuYWx5c2lzU2VydmljZSA9IG5ldyBSYXRlQW5hbHlzaXNTZXJ2aWNlKCk7XHJcbiAgICB0aGlzLmNvbnZlcnRDb3N0SGVhZHNGcm9tUmF0ZUFuYWx5c2lzVG9Db3N0Q29udHJvbChDb25zdGFudHMuQlVJTERJTkcsIChlcnJvcjogYW55LCBidWlsZGluZ0RhdGE6IGFueSk9PiB7XHJcbiAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgbG9nZ2VyLmVycm9yKCdSYXRlQW5hbHlzaXMgU3luYyBGYWlsZWQuJyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5jb252ZXJ0Q29zdEhlYWRzRnJvbVJhdGVBbmFseXNpc1RvQ29zdENvbnRyb2woQ29uc3RhbnRzLkJVSUxESU5HLCAoZXJyb3I6IGFueSwgcHJvamVjdERhdGE6IGFueSk9PiB7XHJcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgbG9nZ2VyLmVycm9yKCdSYXRlQW5hbHlzaXMgU3luYyBGYWlsZWQuJyk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgYnVpbGRpbmdDb3N0SGVhZHMgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGJ1aWxkaW5nRGF0YS5idWlsZGluZ0Nvc3RIZWFkcykpO1xyXG4gICAgICAgICAgICBsZXQgcHJvamVjdENvc3RIZWFkcyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkocHJvamVjdERhdGEuYnVpbGRpbmdDb3N0SGVhZHMpKTtcclxuICAgICAgICAgICAgbGV0IGNvbmZpZ0Nvc3RIZWFkcyA9IGNvbmZpZy5nZXQoJ2NvbmZpZ0Nvc3RIZWFkcycpO1xyXG4gICAgICAgICAgICBsZXQgY29uZmlnUHJvamVjdENvc3RIZWFkcyA9IGNvbmZpZy5nZXQoJ2NvbmZpZ1Byb2plY3RDb3N0SGVhZHMnKTtcclxuICAgICAgICAgICAgbGV0IGZpeGVkQ29zdENvbmZpZ1Byb2plY3RDb3N0SGVhZHMgPSBjb25maWcuZ2V0KCdmaXhlZENvc3RDb25maWdQcm9qZWN0Q29zdEhlYWRzJyk7XHJcbiAgICAgICAgICAgIHRoaXMuY29udmVydENvbmZpZ0Nvc3RIZWFkcyhjb25maWdDb3N0SGVhZHMsIGJ1aWxkaW5nQ29zdEhlYWRzKTtcclxuICAgICAgICAgICAgdGhpcy5jb252ZXJ0Q29uZmlnQ29zdEhlYWRzKGNvbmZpZ1Byb2plY3RDb3N0SGVhZHMsIHByb2plY3RDb3N0SGVhZHMpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnZlcnRDb25maWdDb3N0SGVhZHMoZml4ZWRDb3N0Q29uZmlnUHJvamVjdENvc3RIZWFkcywgcHJvamVjdENvc3RIZWFkcyk7XHJcbiAgICAgICAgICAgIGJ1aWxkaW5nQ29zdEhlYWRzID0gYWxhc3FsKCdTRUxFQ1QgKiBGUk9NID8gT1JERVIgQlkgcHJpb3JpdHlJZCcsIFtidWlsZGluZ0Nvc3RIZWFkc10pO1xyXG4gICAgICAgICAgICBwcm9qZWN0Q29zdEhlYWRzID0gYWxhc3FsKCdTRUxFQ1QgKiBGUk9NID8gT1JERVIgQlkgcHJpb3JpdHlJZCcsIFtwcm9qZWN0Q29zdEhlYWRzXSk7XHJcbiAgICAgICAgICAgIGxldCBidWlsZGluZ1JhdGVzID0gdGhpcy5nZXRSYXRlcyhidWlsZGluZ0RhdGEsIGJ1aWxkaW5nQ29zdEhlYWRzKTtcclxuICAgICAgICAgICAgbGV0IHByb2plY3RSYXRlcyA9IHRoaXMuZ2V0UmF0ZXMocHJvamVjdERhdGEsIHByb2plY3RDb3N0SGVhZHMpO1xyXG4gICAgICAgICAgICBsZXQgcmF0ZUFuYWx5c2lzID0gbmV3IFJhdGVBbmFseXNpcyhidWlsZGluZ0Nvc3RIZWFkcywgYnVpbGRpbmdSYXRlcywgcHJvamVjdENvc3RIZWFkcywgcHJvamVjdFJhdGVzKTtcclxuICAgICAgICAgICAgdGhpcy5zYXZlUmF0ZUFuYWx5c2lzKHJhdGVBbmFseXNpcyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgY29udmVydENvbmZpZ0Nvc3RIZWFkcyhjb25maWdDb3N0SGVhZHM6IEFycmF5PGFueT4sIGNvc3RIZWFkc0RhdGE6IEFycmF5PENvc3RIZWFkPikge1xyXG5cclxuICAgIGZvciAobGV0IGNvbmZpZ0Nvc3RIZWFkIG9mIGNvbmZpZ0Nvc3RIZWFkcykge1xyXG5cclxuICAgICAgbGV0IGNvc3RIZWFkRXhpc3RTUUwgPSAnU0VMRUNUICogRlJPTSA/IEFTIGNvc3RIZWFkcyBXSEVSRSBjb3N0SGVhZHMubmFtZT0gPyc7XHJcbiAgICAgIGxldCBjb3N0SGVhZEV4aXN0QXJyYXkgPSBhbGFzcWwoY29zdEhlYWRFeGlzdFNRTCxbY29zdEhlYWRzRGF0YSxjb25maWdDb3N0SGVhZC5uYW1lXSk7XHJcblxyXG4gICAgICBpZihjb3N0SGVhZEV4aXN0QXJyYXkubGVuZ3RoID09PSAwICYmIGNvbmZpZ0Nvc3RIZWFkLnJhdGVBbmFseXNpc0lkKSB7XHJcbiAgICAgICAgbGV0IGNvc3RIZWFkOiBDb3N0SGVhZCA9IG5ldyBDb3N0SGVhZCgpO1xyXG4gICAgICAgIGNvc3RIZWFkLm5hbWUgPSBjb25maWdDb3N0SGVhZC5uYW1lO1xyXG4gICAgICAgIGNvc3RIZWFkLnByaW9yaXR5SWQgPSBjb25maWdDb3N0SGVhZC5wcmlvcml0eUlkO1xyXG4gICAgICAgIGNvc3RIZWFkLnJhdGVBbmFseXNpc0lkID0gY29uZmlnQ29zdEhlYWQucmF0ZUFuYWx5c2lzSWQ7XHJcbiAgICAgICAgbGV0IGNhdGVnb3JpZXNMaXN0ID0gbmV3IEFycmF5PENhdGVnb3J5PigpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBjb25maWdDYXRlZ29yeSBvZiBjb25maWdDb3N0SGVhZC5jYXRlZ29yaWVzKSB7XHJcblxyXG4gICAgICAgICAgbGV0IGNhdGVnb3J5OiBDYXRlZ29yeSA9IG5ldyBDYXRlZ29yeShjb25maWdDYXRlZ29yeS5uYW1lLCBjb25maWdDYXRlZ29yeS5yYXRlQW5hbHlzaXNJZCk7XHJcbiAgICAgICAgICBsZXQgd29ya0l0ZW1zTGlzdDogQXJyYXk8V29ya0l0ZW0+ID0gbmV3IEFycmF5PFdvcmtJdGVtPigpO1xyXG5cclxuICAgICAgICAgIGZvciAobGV0IGNvbmZpZ1dvcmtJdGVtIG9mIGNvbmZpZ0NhdGVnb3J5LndvcmtJdGVtcykge1xyXG5cclxuICAgICAgICAgICAgbGV0IHdvcmtJdGVtOiBXb3JrSXRlbSA9IG5ldyBXb3JrSXRlbShjb25maWdXb3JrSXRlbS5uYW1lLCBjb25maWdXb3JrSXRlbS5yYXRlQW5hbHlzaXNJZCk7XHJcbiAgICAgICAgICAgIHdvcmtJdGVtLmlzRGlyZWN0UmF0ZSA9IHRydWU7XHJcbiAgICAgICAgICAgIHdvcmtJdGVtLnVuaXQgPSBjb25maWdXb3JrSXRlbS5tZWFzdXJlbWVudFVuaXQ7XHJcbiAgICAgICAgICAgIHdvcmtJdGVtLmlzTWVhc3VyZW1lbnRTaGVldCA9IGNvbmZpZ1dvcmtJdGVtLmlzTWVhc3VyZW1lbnRTaGVldDtcclxuICAgICAgICAgICAgd29ya0l0ZW0uaXNSYXRlQW5hbHlzaXMgPSBjb25maWdXb3JrSXRlbS5pc1JhdGVBbmFseXNpcztcclxuICAgICAgICAgICAgd29ya0l0ZW0ucmF0ZUFuYWx5c2lzUGVyVW5pdCA9IGNvbmZpZ1dvcmtJdGVtLnJhdGVBbmFseXNpc1BlclVuaXQ7XHJcbiAgICAgICAgICAgIHdvcmtJdGVtLmlzU3RlZWxXb3JrSXRlbSA9IGNvbmZpZ1dvcmtJdGVtLmlzU3RlZWxXb3JrSXRlbTtcclxuICAgICAgICAgICAgd29ya0l0ZW0uaXNJdGVtQnJlYWtkb3duUmVxdWlyZWQgPSBjb25maWdXb3JrSXRlbS5pc0l0ZW1CcmVha2Rvd25SZXF1aXJlZDtcclxuICAgICAgICAgICAgd29ya0l0ZW0ubGVuZ3RoID0gY29uZmlnV29ya0l0ZW0ubGVuZ3RoO1xyXG4gICAgICAgICAgICB3b3JrSXRlbS5icmVhZHRoT3JXaWR0aCA9IGNvbmZpZ1dvcmtJdGVtLmJyZWFkdGhPcldpZHRoO1xyXG4gICAgICAgICAgICB3b3JrSXRlbS5oZWlnaHQgPSBjb25maWdXb3JrSXRlbS5oZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICBpZiAoY29uZmlnV29ya0l0ZW0uZGlyZWN0UmF0ZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgIHdvcmtJdGVtLnJhdGUudG90YWwgPSBjb25maWdXb3JrSXRlbS5kaXJlY3RSYXRlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHdvcmtJdGVtLnJhdGUudG90YWwgPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHdvcmtJdGVtLnJhdGUuaXNFc3RpbWF0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB3b3JrSXRlbXNMaXN0LnB1c2god29ya0l0ZW0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY2F0ZWdvcnkud29ya0l0ZW1zID0gd29ya0l0ZW1zTGlzdDtcclxuICAgICAgICAgIGNhdGVnb3JpZXNMaXN0LnB1c2goY2F0ZWdvcnkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAgIGNvc3RIZWFkLmNhdGVnb3JpZXMgPSBjYXRlZ29yaWVzTGlzdDtcclxuICAgICAgICBjb3N0SGVhZC50aHVtYlJ1bGVSYXRlID0gY29uZmlnLmdldChDb25zdGFudHMuVEhVTUJSVUxFX1JBVEUpO1xyXG4gICAgICAgIGNvc3RIZWFkc0RhdGEucHVzaChjb3N0SGVhZCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBjb3N0SGVhZHNEYXRhO1xyXG4gIH1cclxuXHJcbiAgZ2V0UmF0ZXMocmVzdWx0OiBhbnksIGNvc3RIZWFkczogQXJyYXk8Q29zdEhlYWQ+KSB7XHJcbiAgICBsZXQgZ2V0UmF0ZXNMaXN0U1FMID0gJ1NFTEVDVCAqIEZST00gPyBBUyBxIFdIRVJFIHEuQzQgSU4gKFNFTEVDVCB0LnJhdGVBbmFseXNpc0lkICcgK1xyXG4gICAgICAnRlJPTSA/IEFTIHQpJztcclxuICAgIGxldCByYXRlSXRlbXMgPSBhbGFzcWwoZ2V0UmF0ZXNMaXN0U1FMLCBbcmVzdWx0LnJhdGVzLCBjb3N0SGVhZHNdKTtcclxuXHJcbiAgICBsZXQgcmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzU1FMID0gJ1NFTEVDVCByYXRlSXRlbS5DMiBBUyBpdGVtTmFtZSwgcmF0ZUl0ZW0uQzIgQVMgb3JpZ2luYWxJdGVtTmFtZSwnICtcclxuICAgICAgJ3JhdGVJdGVtLkMxMiBBUyByYXRlQW5hbHlzaXNJZCwgcmF0ZUl0ZW0uQzYgQVMgdHlwZSwnICtcclxuICAgICAgJ1JPVU5EKHJhdGVJdGVtLkM3LDIpIEFTIHF1YW50aXR5LCBST1VORChyYXRlSXRlbS5DMywyKSBBUyByYXRlLCB1bml0LkMyIEFTIHVuaXQsJyArXHJcbiAgICAgICdST1VORChyYXRlSXRlbS5DMyAqIHJhdGVJdGVtLkM3LDIpIEFTIHRvdGFsQW1vdW50LCByYXRlSXRlbS5DNSBBUyB0b3RhbFF1YW50aXR5ICcgK1xyXG4gICAgICAnRlJPTSA/IEFTIHJhdGVJdGVtIEpPSU4gPyBBUyB1bml0IE9OIHVuaXQuQzEgPSByYXRlSXRlbS5DOSc7XHJcblxyXG4gICAgbGV0IHJhdGVJdGVtc0xpc3QgPSBhbGFzcWwocmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzU1FMLCBbcmF0ZUl0ZW1zLCByZXN1bHQudW5pdHNdKTtcclxuXHJcbiAgICBsZXQgZGlzdGluY3RJdGVtc1NRTCA9ICdzZWxlY3QgRElTVElOQ1QgaXRlbU5hbWUsb3JpZ2luYWxJdGVtTmFtZSxyYXRlIEZST00gPyc7XHJcbiAgICB2YXIgZGlzdGluY3RSYXRlcyA9IGFsYXNxbChkaXN0aW5jdEl0ZW1zU1FMLCBbcmF0ZUl0ZW1zTGlzdF0pO1xyXG5cclxuICAgIHJldHVybiBkaXN0aW5jdFJhdGVzO1xyXG4gIH1cclxuXHJcbiAgc2F2ZVJhdGVBbmFseXNpcyhyYXRlQW5hbHlzaXM6IFJhdGVBbmFseXNpcykge1xyXG4gICAgbG9nZ2VyLmluZm8oJ3NhdmVSYXRlQW5hbHlzaXMgaXMgYmVlbiBoaXQnKTtcclxuICAgIGxldCBxdWVyeSA9IHt9O1xyXG4gICAgdGhpcy5yYXRlQW5hbHlzaXNSZXBvc2l0b3J5LnJldHJpZXZlKHt9LCAoZXJyb3I6YW55LCByYXRlQW5hbHlzaXNBcnJheTogQXJyYXk8UmF0ZUFuYWx5c2lzPikgPT4ge1xyXG4gICAgICBpZihlcnJvcikge1xyXG4gICAgICAgIGxvZ2dlci5lcnJvcignVW5hYmxlIHRvIHJldHJpdmUgc3luY2VkIFJhdGVBbmFseXNpcycpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmKHJhdGVBbmFseXNpc0FycmF5Lmxlbmd0aCA+MCkge1xyXG4gICAgICAgICAgcXVlcnkgPSB7IF9pZCA6IHJhdGVBbmFseXNpc0FycmF5WzBdLl9pZH07XHJcbiAgICAgICAgICBsZXQgdXBkYXRlID0geyRzZXQ6IHtcclxuICAgICAgICAgICAgJ3Byb2plY3RDb3N0SGVhZHMnOiByYXRlQW5hbHlzaXMucHJvamVjdENvc3RIZWFkcyxcclxuICAgICAgICAgICAgJ3Byb2plY3RSYXRlcyc6IHJhdGVBbmFseXNpcy5wcm9qZWN0UmF0ZXMsXHJcbiAgICAgICAgICAgICdidWlsZGluZ0Nvc3RIZWFkcyc6IHJhdGVBbmFseXNpcy5idWlsZGluZ0Nvc3RIZWFkcyxcclxuICAgICAgICAgICAgJ2J1aWxkaW5nUmF0ZXMnOiByYXRlQW5hbHlzaXMuYnVpbGRpbmdSYXRlc1xyXG4gICAgICAgICAgfX07XHJcbiAgICAgICAgICB0aGlzLnJhdGVBbmFseXNpc1JlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgdXBkYXRlLHtuZXc6IHRydWV9LChlcnJvcjogYW55LCByYXRlQW5hbHlzaXNBcnJheTogUmF0ZUFuYWx5c2lzKSA9PiB7XHJcbiAgICAgICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKCdzYXZlUmF0ZUFuYWx5c2lzIGZhaWxlZCA9PiAnICsgZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgICBsb2dnZXIuaW5mbygnVXBkYXRlZCBSYXRlQW5hbHlzaXMuJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgIHRoaXMucmF0ZUFuYWx5c2lzUmVwb3NpdG9yeS5jcmVhdGUocmF0ZUFuYWx5c2lzLCAoZXJyb3I6IGFueSwgcmVzdWx0OiBSYXRlQW5hbHlzaXMpID0+IHtcclxuICAgICAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoJ3NhdmVSYXRlQW5hbHlzaXMgZmFpbGVkID0+ICcgKyBlcnJvci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICAgIGxvZ2dlci5pbmZvKCdTYXZlZCBSYXRlQW5hbHlzaXMuJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRDb3N0Q29udHJvbFJhdGVBbmFseXNpcyhxdWVyeTogYW55LCBwcm9qZWN0aW9uOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmF0ZUFuYWx5c2lzOiBSYXRlQW5hbHlzaXMpID0+IHZvaWQpIHtcclxuICAgIHRoaXMucmF0ZUFuYWx5c2lzUmVwb3NpdG9yeS5yZXRyaWV2ZVdpdGhQcm9qZWN0aW9uKHF1ZXJ5LCBwcm9qZWN0aW9uLChlcnJvcjogYW55LCByYXRlQW5hbHlzaXNBcnJheTogQXJyYXk8UmF0ZUFuYWx5c2lzPikgPT4ge1xyXG4gICAgICBpZihlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZihyYXRlQW5hbHlzaXNBcnJheS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgIGxvZ2dlci5lcnJvcignQ29udENvbnRyb2wgUmF0ZUFuYWx5c2lzIG5vdCBmb3VuZC4nKTtcclxuICAgICAgICAgIGNhbGxiYWNrKCdDb250Q29udHJvbCBSYXRlQW5hbHlzaXMgbm90IGZvdW5kLicsIG51bGwpO1xyXG4gICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJhdGVBbmFseXNpc0FycmF5WzBdKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0QWdncmVnYXRlRGF0YShxdWVyeTogYW55LCBjYWxsYmFjazooZXJyb3I6YW55LCBhZ2dyZWdhdGVEYXRhOiBhbnkpID0+dm9pZCkge1xyXG4gICAgdGhpcy5yYXRlQW5hbHlzaXNSZXBvc2l0b3J5LmFnZ3JlZ2F0ZShxdWVyeSxjYWxsYmFjayk7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuT2JqZWN0LnNlYWwoUmF0ZUFuYWx5c2lzU2VydmljZSk7XHJcbmV4cG9ydCA9IFJhdGVBbmFseXNpc1NlcnZpY2U7XHJcbiJdfQ==
