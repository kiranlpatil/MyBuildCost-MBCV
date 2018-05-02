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
            logger.error(' Promise failed for convertCostHeadsFromRateAnalysisToCostControl ! :' + JSON.stringify(e));
            CCPromise.reject(e);
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
            logger.error('Promise failed for individual ! url:' + url + ':\n error :' + JSON.stringify(e));
            CCPromise.reject(e);
        });
    };
    RateAnalysisService.prototype.getCostHeadsFromRateAnalysis = function (costHeadsRateAnalysis, categoriesRateAnalysis, workItemsRateAnalysis, rateItemsRateAnalysis, unitsRateAnalysis, notesRateAnalysis, buildingCostHeads) {
        logger.info('getCostHeadsFromRateAnalysis has been hit.');
        for (var costHeadIndex = 0; costHeadIndex < costHeadsRateAnalysis.length; costHeadIndex++) {
            var costHead = new CostHead();
            costHead.name = costHeadsRateAnalysis[costHeadIndex].C2;
            var configCostHeads = config.get('costHeads');
            var categories = new Array();
            if (configCostHeads.length > 0) {
                for (var _i = 0, configCostHeads_1 = configCostHeads; _i < configCostHeads_1.length; _i++) {
                    var configCostHead = configCostHeads_1[_i];
                    if (configCostHead.name === costHead.name) {
                        costHead.priorityId = configCostHead.priorityId;
                        categories = configCostHead.categories;
                    }
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
    };
    RateAnalysisService.prototype.getWorkItemsWithoutCategoryFromRateAnalysis = function (costHeadRateAnalysisId, workItemsRateAnalysis, rateItemsRateAnalysis, unitsRateAnalysis, notesRateAnalysis, buildingCategories, configCategories) {
        logger.info('getWorkItemsWithoutCategoryFromRateAnalysis has been hit.');
        var workItemsWithoutCategoriesRateAnalysisSQL = 'SELECT workItem.C2 AS rateAnalysisId, workItem.C3 AS name' +
            ' FROM ? AS workItem where NOT workItem.C4 AND workItem.C1 = ' + costHeadRateAnalysisId;
        var workItemsWithoutCategories = alasql(workItemsWithoutCategoriesRateAnalysisSQL, [workItemsRateAnalysis]);
        var buildingWorkItems = new Array();
        var category = new Category('default', 0);
        var configWorkItems = new Array();
        if (configCategories.length > 0) {
            for (var _i = 0, configCategories_2 = configCategories; _i < configCategories_2.length; _i++) {
                var configCategory = configCategories_2[_i];
                if (configCategory.name === 'default') {
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
            buildingWorkItems.push(workItem);
        }
    };
    RateAnalysisService.prototype.getRateAnalysis = function (categoryWorkitem, configWorkItems, rateItemsRateAnalysis, unitsRateAnalysis, notesRateAnalysis) {
        var workItem = new WorkItem(categoryWorkitem.name, categoryWorkitem.rateAnalysisId);
        if (categoryWorkitem.active !== undefined && categoryWorkitem.active !== null) {
            workItem = categoryWorkitem;
        }
        if (configWorkItems.length > 0) {
            for (var _i = 0, configWorkItems_1 = configWorkItems; _i < configWorkItems_1.length; _i++) {
                var configWorkItem = configWorkItems_1[_i];
                if (configWorkItem.name === categoryWorkitem.name) {
                    workItem.unit = configWorkItem.measurementUnit;
                }
            }
        }
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
        workItem.rate.isEstimated = false;
        workItem.rate.notes = notes;
        workItem.rate.imageURL = imageURL;
        workItem.systemRate.rateItems = rateItemsByWorkItem;
        workItem.systemRate.notes = notes;
        workItem.systemRate.imageURL = imageURL;
        return workItem;
    };
    return RateAnalysisService;
}());
Object.seal(RateAnalysisService);
module.exports = RateAnalysisService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHBsaWNhdGlvblByb2plY3Qvc2VydmljZXMvUmF0ZUFuYWx5c2lzU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsb0VBQXVFO0FBQ3ZFLGtFQUFxRTtBQUVyRSw4RUFBaUY7QUFDakYsMEVBQTZFO0FBQzdFLHdFQUEyRTtBQUMzRSwrQkFBa0M7QUFDbEMsZ0VBQW1FO0FBQ25FLHdFQUEyRTtBQUMzRSx3RUFBMkU7QUFDM0UsK0NBQWtEO0FBRWxELElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNqQyxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDL0IsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUV2RCxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsNEJBQTRCLENBQUMsQ0FBQztBQUV0RDtJQU1FO1FBQ0UsSUFBSSxDQUFDLFFBQVEsR0FBRyxZQUFZLENBQUMsUUFBUSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxlQUFlLEVBQUUsQ0FBQztRQUM3QyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7SUFDdkMsQ0FBQztJQUVELDBDQUFZLEdBQVosVUFBYSxHQUFXLEVBQUUsSUFBVSxFQUFFLFFBQTJDO1FBQy9FLE1BQU0sQ0FBQyxJQUFJLENBQUMsa0RBQWtELENBQUMsQ0FBQztRQUNoRSxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUMsR0FBRyxFQUFFLEdBQUcsRUFBQyxFQUFFLFVBQVUsS0FBVSxFQUFFLFFBQWEsRUFBRSxJQUFTO1lBQ3BFLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ1YsUUFBUSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN4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QUFRLENBQUMsVUFBVSxDQUFDLFNBQVMsR0FBRyxtQkFBbUIsQ0FBQztRQUNwRCxRQUFRLENBQUMsVUFBVSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbEMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3hDLE1BQU0sQ0FBQyxRQUFRLENBQUM7SUFDbEIsQ0FBQztJQUNILDBCQUFDO0FBQUQsQ0FwWkEsQUFvWkMsSUFBQTtBQUdELE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUNqQyxpQkFBUyxtQkFBbUIsQ0FBQyIsImZpbGUiOiJhcHAvYXBwbGljYXRpb25Qcm9qZWN0L3NlcnZpY2VzL1JhdGVBbmFseXNpc1NlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVXNlclNlcnZpY2UgPSByZXF1aXJlKCcuLy4uLy4uL2ZyYW1ld29yay9zZXJ2aWNlcy9Vc2VyU2VydmljZScpO1xyXG5pbXBvcnQgUHJvamVjdEFzc2V0ID0gcmVxdWlyZSgnLi4vLi4vZnJhbWV3b3JrL3NoYXJlZC9wcm9qZWN0YXNzZXQnKTtcclxuaW1wb3J0IFVzZXIgPSByZXF1aXJlKCcuLi8uLi9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9tb25nb29zZS91c2VyJyk7XHJcbmltcG9ydCBBdXRoSW50ZXJjZXB0b3IgPSByZXF1aXJlKCcuLi8uLi9mcmFtZXdvcmsvaW50ZXJjZXB0b3IvYXV0aC5pbnRlcmNlcHRvcicpO1xyXG5pbXBvcnQgQ29zdENvbnRyb2xsRXhjZXB0aW9uID0gcmVxdWlyZSgnLi4vZXhjZXB0aW9uL0Nvc3RDb250cm9sbEV4Y2VwdGlvbicpO1xyXG5pbXBvcnQgV29ya0l0ZW0gPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3Byb2plY3QvYnVpbGRpbmcvV29ya0l0ZW0nKTtcclxuaW1wb3J0IGFsYXNxbCA9IHJlcXVpcmUoJ2FsYXNxbCcpO1xyXG5pbXBvcnQgUmF0ZSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9idWlsZGluZy9SYXRlJyk7XHJcbmltcG9ydCBDb3N0SGVhZCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9idWlsZGluZy9Db3N0SGVhZCcpO1xyXG5pbXBvcnQgQ2F0ZWdvcnkgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3Byb2plY3QvYnVpbGRpbmcvQ2F0ZWdvcnknKTtcclxuaW1wb3J0IENvbnN0YW50cyA9IHJlcXVpcmUoJy4uL3NoYXJlZC9jb25zdGFudHMnKTtcclxuXHJcbmxldCByZXF1ZXN0ID0gcmVxdWlyZSgncmVxdWVzdCcpO1xyXG5sZXQgY29uZmlnID0gcmVxdWlyZSgnY29uZmlnJyk7XHJcbnZhciBsb2c0anMgPSByZXF1aXJlKCdsb2c0anMnKTtcclxudmFyIGxvZ2dlciA9IGxvZzRqcy5nZXRMb2dnZXIoJ1JhdGUgQW5hbHlzaXMgU2VydmljZScpO1xyXG5cclxubGV0IENDUHJvbWlzZSA9IHJlcXVpcmUoJ3Byb21pc2UvbGliL2VzNi1leHRlbnNpb25zJyk7XHJcblxyXG5jbGFzcyBSYXRlQW5hbHlzaXNTZXJ2aWNlIHtcclxuICBBUFBfTkFNRTogc3RyaW5nO1xyXG4gIGNvbXBhbnlfbmFtZTogc3RyaW5nO1xyXG4gIHByaXZhdGUgYXV0aEludGVyY2VwdG9yOiBBdXRoSW50ZXJjZXB0b3I7XHJcbiAgcHJpdmF0ZSB1c2VyU2VydmljZTogVXNlclNlcnZpY2U7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5BUFBfTkFNRSA9IFByb2plY3RBc3NldC5BUFBfTkFNRTtcclxuICAgIHRoaXMuYXV0aEludGVyY2VwdG9yID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xyXG4gICAgdGhpcy51c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gIH1cclxuXHJcbiAgZ2V0Q29zdEhlYWRzKHVybDogc3RyaW5nLCB1c2VyOiBVc2VyLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUmF0ZSBBbmFseXNpcyBTZXJ2aWNlLCBnZXRDb3N0SGVhZHMgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICByZXF1ZXN0LmdldCh7dXJsOiB1cmx9LCBmdW5jdGlvbiAoZXJyb3I6IGFueSwgcmVzcG9uc2U6IGFueSwgYm9keTogYW55KSB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIGlmICghZXJyb3IgJiYgcmVzcG9uc2UpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnUkVTUE9OU0UgSlNPTiA6ICcgKyBKU09OLnN0cmluZ2lmeShKU09OLnBhcnNlKGJvZHkpKSk7XHJcbiAgICAgICAgbGV0IHJlcyA9IEpTT04ucGFyc2UoYm9keSk7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRXb3JrSXRlbXModXJsOiBzdHJpbmcsIHVzZXI6IFVzZXIsIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdSYXRlIEFuYWx5c2lzIFNlcnZpY2UsIGdldFdvcmtJdGVtcyBoYXMgYmVlbiBoaXQnKTtcclxuICAgIHJlcXVlc3QuZ2V0KHt1cmw6IHVybH0sIGZ1bmN0aW9uIChlcnJvcjogYW55LCByZXNwb25zZTogYW55LCBib2R5OiBhbnkpIHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2UgaWYgKCFlcnJvciAmJiByZXNwb25zZSkge1xyXG4gICAgICAgIGxldCByZXMgPSBKU09OLnBhcnNlKGJvZHkpO1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHJlcyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0V29ya0l0ZW1zQnlDb3N0SGVhZElkKHVybDogc3RyaW5nLCBjb3N0SGVhZElkOiBzdHJpbmcsIHVzZXI6IFVzZXIsIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdSYXRlIEFuYWx5c2lzIFNlcnZpY2UsIGdldFdvcmtJdGVtc0J5Q29zdEhlYWRJZCBoYXMgYmVlbiBoaXQnKTtcclxuICAgIGxldCB3b3JrSXRlbXM6IEFycmF5PFdvcmtJdGVtPiA9IFtdO1xyXG4gICAgcmVxdWVzdC5nZXQoe3VybDogdXJsfSwgZnVuY3Rpb24gKGVycm9yOiBhbnksIHJlc3BvbnNlOiBhbnksIGJvZHk6IGFueSkge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSBpZiAoIWVycm9yICYmIHJlc3BvbnNlKSB7XHJcbiAgICAgICAgbGV0IHJlcyA9IEpTT04ucGFyc2UoYm9keSk7XHJcbiAgICAgICAgaWYgKHJlcykge1xyXG5cclxuICAgICAgICAgIGZvciAobGV0IHdvcmtpdGVtIG9mIHJlcy5TdWJJdGVtVHlwZSkge1xyXG4gICAgICAgICAgICBpZiAocGFyc2VJbnQoY29zdEhlYWRJZCkgPT09IHdvcmtpdGVtLkMzKSB7XHJcbiAgICAgICAgICAgICAgbGV0IHdvcmtpdGVtRGV0YWlscyA9IG5ldyBXb3JrSXRlbSh3b3JraXRlbS5DMiwgd29ya2l0ZW0uQzEpO1xyXG4gICAgICAgICAgICAgIHdvcmtJdGVtcy5wdXNoKHdvcmtpdGVtRGV0YWlscyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgd29ya0l0ZW1zKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRBcGlDYWxsKHVybDogc3RyaW5nLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3BvbnNlOiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdnZXRBcGlDYWxsIGZvciByYXRlQW5hbHlzaXMgaGFzIGJlZSBoaXQgZm9yIHVybCA6ICcgKyB1cmwpO1xyXG4gICAgcmVxdWVzdC5nZXQoe3VybDogdXJsfSwgZnVuY3Rpb24gKGVycm9yOiBhbnksIHJlc3BvbnNlOiBhbnksIGJvZHk6IGFueSkge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGVycm9yLm1lc3NhZ2UsIGVycm9yLnN0YWNrKSwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSBpZiAoIWVycm9yICYmIHJlc3BvbnNlKSB7XHJcbiAgICAgICAgbGV0IHJlcyA9IEpTT04ucGFyc2UoYm9keSk7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRSYXRlKHdvcmtJdGVtSWQ6IG51bWJlciwgY2FsbGJhY2s6IChlcnJvcjogYW55LCBkYXRhOiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxldCB1cmwgPSBjb25maWcuZ2V0KCdyYXRlQW5hbHlzaXNBUEkudW5pdCcpO1xyXG4gICAgdGhpcy5nZXRBcGlDYWxsKHVybCwgKGVycm9yLCB1bml0RGF0YSkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdW5pdERhdGEgPSB1bml0RGF0YVsnVU9NJ107XHJcbiAgICAgICAgdXJsID0gY29uZmlnLmdldCgncmF0ZUFuYWx5c2lzQVBJLnJhdGUnKTtcclxuICAgICAgICB0aGlzLmdldEFwaUNhbGwodXJsLCAoZXJyb3IsIGRhdGEpID0+IHtcclxuICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgcmF0ZSA9IGRhdGFbJ1JhdGVBbmFseXNpc0RhdGEnXTtcclxuICAgICAgICAgICAgbGV0IHNxbCA9ICdTRUxFQ1QgcmF0ZS5DNSBBUyBxdWFudGl0eSwgdW5pdC5DMiBBcyB1bml0IEZST00gPyBBUyByYXRlIEpPSU4gPyBBUyB1bml0IG9uIHVuaXQuQzEgPSAgcmF0ZS5DOCBhbmQnICtcclxuICAgICAgICAgICAgICAnIHJhdGUuQzEgPSAnICsgd29ya0l0ZW1JZDtcclxuICAgICAgICAgICAgbGV0IHNxbDIgPSAnU0VMRUNUIHJhdGUuQzEgQVMgcmF0ZUFuYWx5c2lzSWQsIHJhdGUuQzIgQVMgaXRlbU5hbWUsUk9VTkQocmF0ZS5DNywyKSBBUyBxdWFudGl0eSxST1VORChyYXRlLkMzLDIpIEFTIHJhdGUsJyArXHJcbiAgICAgICAgICAgICAgJyBST1VORChyYXRlLkMzKnJhdGUuQzcsMikgQVMgdG90YWxBbW91bnQsIHJhdGUuQzYgdHlwZSwgdW5pdC5DMiBBcyB1bml0IEZST00gPyBBUyByYXRlIEpPSU4gPyBBUyB1bml0IE9OIHVuaXQuQzEgPSByYXRlLkM5JyArXHJcbiAgICAgICAgICAgICAgJyAgV0hFUkUgcmF0ZS5DMSA9ICcgKyB3b3JrSXRlbUlkO1xyXG4gICAgICAgICAgICBsZXQgc3FsMyA9ICdTRUxFQ1QgUk9VTkQoU1VNKHJhdGUuQzMqcmF0ZS5DNykgLyBTVU0ocmF0ZS5DNyksMikgQVMgdG90YWwgIEZST00gPyBBUyByYXRlIEpPSU4gPyBBUyB1bml0IE9OIHVuaXQuQzEgPSByYXRlLkM5JyArXHJcbiAgICAgICAgICAgICAgJyAgV0hFUkUgcmF0ZS5DMSA9ICcgKyB3b3JrSXRlbUlkO1xyXG4gICAgICAgICAgICBsZXQgcXVhbnRpdHlBbmRVbml0ID0gYWxhc3FsKHNxbCwgW3JhdGUsIHVuaXREYXRhXSk7XHJcbiAgICAgICAgICAgIGxldCByYXRlUmVzdWx0OiBSYXRlID0gbmV3IFJhdGUoKTtcclxuICAgICAgICAgICAgbGV0IHRvdGFscmF0ZUZyb21SYXRlQW5hbHlzaXMgPSBhbGFzcWwoc3FsMywgW3JhdGUsIHVuaXREYXRhXSk7XHJcbiAgICAgICAgICAgIHJhdGVSZXN1bHQucXVhbnRpdHkgPSBxdWFudGl0eUFuZFVuaXRbMF0ucXVhbnRpdHk7XHJcbiAgICAgICAgICAgIHJhdGVSZXN1bHQudW5pdCA9IHF1YW50aXR5QW5kVW5pdFswXS51bml0O1xyXG4gICAgICAgICAgICByYXRlUmVzdWx0LnJhdGVGcm9tUmF0ZUFuYWx5c2lzID0gcGFyc2VGbG9hdCgodG90YWxyYXRlRnJvbVJhdGVBbmFseXNpc1swXS50b3RhbCkudG9GaXhlZCgyKSk7XHJcbiAgICAgICAgICAgIHJhdGUgPSBhbGFzcWwoc3FsMiwgW3JhdGUsIHVuaXREYXRhXSk7XHJcbiAgICAgICAgICAgIHJhdGVSZXN1bHQucmF0ZUl0ZW1zID0gcmF0ZTtcclxuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgcmF0ZVJlc3VsdCk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vVE9ETyA6IERlbGV0ZSBBUEkncyByZWxhdGVkIHRvIHdvcmtpdGVtcyBhZGQsIGRlbGVldCwgZ2V0IGxpc3QuXHJcbiAgZ2V0V29ya2l0ZW1MaXN0KGNvc3RIZWFkSWQ6IG51bWJlciwgY2F0ZWdvcnlJZDogbnVtYmVyLCBjYWxsYmFjazogKGVycm9yOiBhbnksIGRhdGE6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbGV0IHVybCA9IGNvbmZpZy5nZXQoJ3JhdGVBbmFseXNpc0FQSS53b3JraXRlbScpO1xyXG4gICAgdGhpcy5nZXRBcGlDYWxsKHVybCwgKGVycm9yLCB3b3JraXRlbSkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IHNxbDogc3RyaW5nID0gJ1NFTEVDVCBDMiBBUyByYXRlQW5hbHlzaXNJZCwgQzMgQVMgbmFtZSBGUk9NID8gV0hFUkUgQzEgPSAnICsgY29zdEhlYWRJZCArICcgYW5kIEM0ID0gJyArIGNhdGVnb3J5SWQ7XHJcbiAgICAgICAgaWYgKGNhdGVnb3J5SWQgPT09IDApIHtcclxuICAgICAgICAgIHNxbCA9ICdTRUxFQ1QgQzIgQVMgcmF0ZUFuYWx5c2lzSWQsIEMzIEFTIG5hbWUgRlJPTSA/IFdIRVJFIEMxID0gJyArIGNvc3RIZWFkSWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdvcmtpdGVtID0gd29ya2l0ZW1bJ0l0ZW1zJ107XHJcbiAgICAgICAgbGV0IHdvcmtpdGVtTGlzdCA9IGFsYXNxbChzcWwsIFt3b3JraXRlbV0pO1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHdvcmtpdGVtTGlzdCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgY29udmVydENvc3RIZWFkc0Zyb21SYXRlQW5hbHlzaXNUb0Nvc3RDb250cm9sKGVudGl0eTogc3RyaW5nLCBjYWxsYmFjazogKGVycm9yOiBhbnksIGRhdGE6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbG9nZ2VyLmluZm8oJ2NvbnZlcnRDb3N0SGVhZHNGcm9tUmF0ZUFuYWx5c2lzVG9Db3N0Q29udHJvbCBoYXMgYmVlbiBoaXQnKTtcclxuXHJcbiAgICBsZXQgY29zdEhlYWRVUkwgPSBjb25maWcuZ2V0KENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0FQSSArIGVudGl0eSArIENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0NPU1RIRUFEUyk7XHJcbiAgICBsZXQgY29zdEhlYWRSYXRlQW5hbHlzaXNQcm9taXNlID0gdGhpcy5jcmVhdGVQcm9taXNlKGNvc3RIZWFkVVJMKTtcclxuICAgIGxvZ2dlci5pbmZvKCdjb3N0SGVhZFJhdGVBbmFseXNpc1Byb21pc2UgZm9yIGhhcyBiZWVuIGhpdCcpO1xyXG5cclxuICAgIGxldCBjYXRlZ29yeVVSTCA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfQVBJICsgZW50aXR5ICsgQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfQ0FURUdPUklFUyk7XHJcbiAgICBsZXQgY2F0ZWdvcnlSYXRlQW5hbHlzaXNQcm9taXNlID0gdGhpcy5jcmVhdGVQcm9taXNlKGNhdGVnb3J5VVJMKTtcclxuICAgIGxvZ2dlci5pbmZvKCdjYXRlZ29yeVJhdGVBbmFseXNpc1Byb21pc2UgZm9yIGhhcyBiZWVuIGhpdCcpO1xyXG5cclxuICAgIGxldCB3b3JrSXRlbVVSTCA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfQVBJICsgZW50aXR5ICsgQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfV09SS0lURU1TKTtcclxuICAgIGxldCB3b3JrSXRlbVJhdGVBbmFseXNpc1Byb21pc2UgPSB0aGlzLmNyZWF0ZVByb21pc2Uod29ya0l0ZW1VUkwpO1xyXG4gICAgbG9nZ2VyLmluZm8oJ3dvcmtJdGVtUmF0ZUFuYWx5c2lzUHJvbWlzZSBmb3IgaGFzIGJlZW4gaGl0Jyk7XHJcblxyXG4gICAgbGV0IHJhdGVJdGVtVVJMID0gY29uZmlnLmdldChDb25zdGFudHMuUkFURV9BTkFMWVNJU19BUEkgKyBlbnRpdHkgKyBDb25zdGFudHMuUkFURV9BTkFMWVNJU19SQVRFKTtcclxuICAgIGxldCByYXRlSXRlbVJhdGVBbmFseXNpc1Byb21pc2UgPSB0aGlzLmNyZWF0ZVByb21pc2UocmF0ZUl0ZW1VUkwpO1xyXG4gICAgbG9nZ2VyLmluZm8oJ3JhdGVJdGVtUmF0ZUFuYWx5c2lzUHJvbWlzZSBmb3IgaGFzIGJlZW4gaGl0Jyk7XHJcblxyXG4gICAgbGV0IHJhdGVBbmFseXNpc05vdGVzVVJMID0gY29uZmlnLmdldChDb25zdGFudHMuUkFURV9BTkFMWVNJU19BUEkgKyBlbnRpdHkgKyBDb25zdGFudHMuUkFURV9BTkFMWVNJU19OT1RFUyk7XHJcbiAgICBsZXQgbm90ZXNSYXRlQW5hbHlzaXNQcm9taXNlID0gdGhpcy5jcmVhdGVQcm9taXNlKHJhdGVBbmFseXNpc05vdGVzVVJMKTtcclxuICAgIGxvZ2dlci5pbmZvKCdub3Rlc1JhdGVBbmFseXNpc1Byb21pc2UgZm9yIGhhcyBiZWVuIGhpdCcpO1xyXG5cclxuICAgIGxldCBhbGxVbml0c0Zyb21SYXRlQW5hbHlzaXNVUkwgPSBjb25maWcuZ2V0KENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0FQSSArIGVudGl0eSArIENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX1VOSVQpO1xyXG4gICAgbGV0IHVuaXRzUmF0ZUFuYWx5c2lzUHJvbWlzZSA9IHRoaXMuY3JlYXRlUHJvbWlzZShhbGxVbml0c0Zyb21SYXRlQW5hbHlzaXNVUkwpO1xyXG4gICAgbG9nZ2VyLmluZm8oJ3VuaXRzUmF0ZUFuYWx5c2lzUHJvbWlzZSBmb3IgaGFzIGJlZW4gaGl0Jyk7XHJcblxyXG4gICAgbG9nZ2VyLmluZm8oJ2NhbGxpbmcgUHJvbWlzZS5hbGwnKTtcclxuICAgIENDUHJvbWlzZS5hbGwoW1xyXG4gICAgICBjb3N0SGVhZFJhdGVBbmFseXNpc1Byb21pc2UsXHJcbiAgICAgIGNhdGVnb3J5UmF0ZUFuYWx5c2lzUHJvbWlzZSxcclxuICAgICAgd29ya0l0ZW1SYXRlQW5hbHlzaXNQcm9taXNlLFxyXG4gICAgICByYXRlSXRlbVJhdGVBbmFseXNpc1Byb21pc2UsXHJcbiAgICAgIG5vdGVzUmF0ZUFuYWx5c2lzUHJvbWlzZSxcclxuICAgICAgdW5pdHNSYXRlQW5hbHlzaXNQcm9taXNlXHJcbiAgICBdKS50aGVuKGZ1bmN0aW9uIChkYXRhOiBBcnJheTxhbnk+KSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdjb252ZXJ0Q29zdEhlYWRzRnJvbVJhdGVBbmFseXNpc1RvQ29zdENvbnRyb2wgUHJvbWlzZS5hbGwgQVBJIGlzIHN1Y2Nlc3MuJyk7XHJcbiAgICAgIGxldCBjb3N0SGVhZHNSYXRlQW5hbHlzaXMgPSBkYXRhWzBdW0NvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0lURU1fVFlQRV07XHJcbiAgICAgIGxldCBjYXRlZ29yaWVzUmF0ZUFuYWx5c2lzID0gZGF0YVsxXVtDb25zdGFudHMuUkFURV9BTkFMWVNJU19TVUJJVEVNX1RZUEVdO1xyXG4gICAgICBsZXQgd29ya0l0ZW1zUmF0ZUFuYWx5c2lzID0gZGF0YVsyXVtDb25zdGFudHMuUkFURV9BTkFMWVNJU19JVEVNU107XHJcbiAgICAgIGxldCByYXRlSXRlbXNSYXRlQW5hbHlzaXMgPSBkYXRhWzNdW0NvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0RBVEFdO1xyXG4gICAgICBsZXQgbm90ZXNSYXRlQW5hbHlzaXMgPSBkYXRhWzRdW0NvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0RBVEFdO1xyXG4gICAgICBsZXQgdW5pdHNSYXRlQW5hbHlzaXMgPSBkYXRhWzVdW0NvbnN0YW50cy5SQVRFX0FOQUxZU0lTX1VPTV07XHJcblxyXG4gICAgICBsZXQgYnVpbGRpbmdDb3N0SGVhZHM6IEFycmF5PENvc3RIZWFkPiA9IFtdO1xyXG4gICAgICBsZXQgcmF0ZUFuYWx5c2lzU2VydmljZSA9IG5ldyBSYXRlQW5hbHlzaXNTZXJ2aWNlKCk7XHJcblxyXG4gICAgICByYXRlQW5hbHlzaXNTZXJ2aWNlLmdldENvc3RIZWFkc0Zyb21SYXRlQW5hbHlzaXMoY29zdEhlYWRzUmF0ZUFuYWx5c2lzLCBjYXRlZ29yaWVzUmF0ZUFuYWx5c2lzLCB3b3JrSXRlbXNSYXRlQW5hbHlzaXMsXHJcbiAgICAgICAgcmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzLCB1bml0c1JhdGVBbmFseXNpcywgbm90ZXNSYXRlQW5hbHlzaXMsIGJ1aWxkaW5nQ29zdEhlYWRzKTtcclxuICAgICAgbG9nZ2VyLmluZm8oJ3N1Y2Nlc3MgaW4gIGNvbnZlcnRDb3N0SGVhZHNGcm9tUmF0ZUFuYWx5c2lzVG9Db3N0Q29udHJvbC4nKTtcclxuICAgICAgY2FsbGJhY2sobnVsbCwge1xyXG4gICAgICAgICdidWlsZGluZ0Nvc3RIZWFkcyc6IGJ1aWxkaW5nQ29zdEhlYWRzLFxyXG4gICAgICAgICdyYXRlcyc6IHJhdGVJdGVtc1JhdGVBbmFseXNpcyxcclxuICAgICAgICAndW5pdHMnOiB1bml0c1JhdGVBbmFseXNpc1xyXG4gICAgICB9KTtcclxuICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlOiBhbnkpIHtcclxuICAgICAgbG9nZ2VyLmVycm9yKCcgUHJvbWlzZSBmYWlsZWQgZm9yIGNvbnZlcnRDb3N0SGVhZHNGcm9tUmF0ZUFuYWx5c2lzVG9Db3N0Q29udHJvbCAhIDonICsgSlNPTi5zdHJpbmdpZnkoZSkpO1xyXG4gICAgICBDQ1Byb21pc2UucmVqZWN0KGUpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBjcmVhdGVQcm9taXNlKHVybDogc3RyaW5nKSB7XHJcbiAgICByZXR1cm4gbmV3IENDUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZTogYW55LCByZWplY3Q6IGFueSkge1xyXG4gICAgICBsb2dnZXIuaW5mbygnY3JlYXRlUHJvbWlzZSBoYXMgYmVlbiBoaXQgZm9yIDogJyArIHVybCk7XHJcbiAgICAgIGxldCByYXRlQW5hbHlzaXNTZXJ2aWNlID0gbmV3IFJhdGVBbmFseXNpc1NlcnZpY2UoKTtcclxuICAgICAgcmF0ZUFuYWx5c2lzU2VydmljZS5nZXRBcGlDYWxsKHVybCwgKGVycm9yOiBhbnksIGRhdGE6IGFueSkgPT4ge1xyXG4gICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yIGluIGNyZWF0ZVByb21pc2UgZ2V0IGRhdGEgZnJvbSByYXRlIGFuYWx5c2lzOiAnICsgSlNPTi5zdHJpbmdpZnkoZXJyb3IpKTtcclxuICAgICAgICAgIHJlamVjdChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdjcmVhdGVQcm9taXNlIGRhdGEgZnJvbSByYXRlIGFuYWx5c2lzIHN1Y2Nlc3MuJyk7XHJcbiAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9KS5jYXRjaChmdW5jdGlvbiAoZTogYW55KSB7XHJcbiAgICAgIGxvZ2dlci5lcnJvcignUHJvbWlzZSBmYWlsZWQgZm9yIGluZGl2aWR1YWwgISB1cmw6JyArIHVybCArICc6XFxuIGVycm9yIDonICsgSlNPTi5zdHJpbmdpZnkoZSkpO1xyXG4gICAgICBDQ1Byb21pc2UucmVqZWN0KGUpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRDb3N0SGVhZHNGcm9tUmF0ZUFuYWx5c2lzKGNvc3RIZWFkc1JhdGVBbmFseXNpczogYW55LCBjYXRlZ29yaWVzUmF0ZUFuYWx5c2lzOiBhbnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3b3JrSXRlbXNSYXRlQW5hbHlzaXM6IGFueSwgcmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzOiBhbnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0c1JhdGVBbmFseXNpczogYW55LCBub3Rlc1JhdGVBbmFseXNpczogYW55LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVpbGRpbmdDb3N0SGVhZHM6IEFycmF5PENvc3RIZWFkPikge1xyXG4gICAgbG9nZ2VyLmluZm8oJ2dldENvc3RIZWFkc0Zyb21SYXRlQW5hbHlzaXMgaGFzIGJlZW4gaGl0LicpO1xyXG4gICAgZm9yIChsZXQgY29zdEhlYWRJbmRleCA9IDA7IGNvc3RIZWFkSW5kZXggPCBjb3N0SGVhZHNSYXRlQW5hbHlzaXMubGVuZ3RoOyBjb3N0SGVhZEluZGV4KyspIHtcclxuXHJcbiAgICAgIGxldCBjb3N0SGVhZCA9IG5ldyBDb3N0SGVhZCgpO1xyXG4gICAgICBjb3N0SGVhZC5uYW1lID0gY29zdEhlYWRzUmF0ZUFuYWx5c2lzW2Nvc3RIZWFkSW5kZXhdLkMyO1xyXG4gICAgICBsZXQgY29uZmlnQ29zdEhlYWRzID0gY29uZmlnLmdldCgnY29zdEhlYWRzJyk7XHJcbiAgICAgIGxldCBjYXRlZ29yaWVzID0gbmV3IEFycmF5PENhdGVnb3J5PigpO1xyXG5cclxuICAgICAgaWYgKGNvbmZpZ0Nvc3RIZWFkcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgZm9yIChsZXQgY29uZmlnQ29zdEhlYWQgb2YgY29uZmlnQ29zdEhlYWRzKSB7XHJcbiAgICAgICAgICBpZiAoY29uZmlnQ29zdEhlYWQubmFtZSA9PT0gY29zdEhlYWQubmFtZSkge1xyXG4gICAgICAgICAgICBjb3N0SGVhZC5wcmlvcml0eUlkID0gY29uZmlnQ29zdEhlYWQucHJpb3JpdHlJZDtcclxuICAgICAgICAgICAgY2F0ZWdvcmllcyA9IGNvbmZpZ0Nvc3RIZWFkLmNhdGVnb3JpZXM7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGNvc3RIZWFkLnJhdGVBbmFseXNpc0lkID0gY29zdEhlYWRzUmF0ZUFuYWx5c2lzW2Nvc3RIZWFkSW5kZXhdLkMxO1xyXG5cclxuICAgICAgbGV0IGNhdGVnb3JpZXNSYXRlQW5hbHlzaXNTUUwgPSAnU0VMRUNUIENhdGVnb3J5LkMxIEFTIHJhdGVBbmFseXNpc0lkLCBDYXRlZ29yeS5DMiBBUyBuYW1lJyArXHJcbiAgICAgICAgJyBGUk9NID8gQVMgQ2F0ZWdvcnkgd2hlcmUgQ2F0ZWdvcnkuQzMgPSAnICsgY29zdEhlYWQucmF0ZUFuYWx5c2lzSWQ7XHJcblxyXG4gICAgICBsZXQgY2F0ZWdvcmllc0J5Q29zdEhlYWQgPSBhbGFzcWwoY2F0ZWdvcmllc1JhdGVBbmFseXNpc1NRTCwgW2NhdGVnb3JpZXNSYXRlQW5hbHlzaXNdKTtcclxuICAgICAgbGV0IGJ1aWxkaW5nQ2F0ZWdvcmllczogQXJyYXk8Q2F0ZWdvcnk+ID0gbmV3IEFycmF5PENhdGVnb3J5PigpO1xyXG5cclxuICAgICAgaWYgKGNhdGVnb3JpZXNCeUNvc3RIZWFkLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgIHRoaXMuZ2V0V29ya0l0ZW1zV2l0aG91dENhdGVnb3J5RnJvbVJhdGVBbmFseXNpcyhjb3N0SGVhZC5yYXRlQW5hbHlzaXNJZCwgd29ya0l0ZW1zUmF0ZUFuYWx5c2lzLFxyXG4gICAgICAgICAgcmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzLCB1bml0c1JhdGVBbmFseXNpcywgbm90ZXNSYXRlQW5hbHlzaXMsIGJ1aWxkaW5nQ2F0ZWdvcmllcywgY2F0ZWdvcmllcyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5nZXRDYXRlZ29yaWVzRnJvbVJhdGVBbmFseXNpcyhjYXRlZ29yaWVzQnlDb3N0SGVhZCwgd29ya0l0ZW1zUmF0ZUFuYWx5c2lzLFxyXG4gICAgICAgICAgcmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzLCB1bml0c1JhdGVBbmFseXNpcywgbm90ZXNSYXRlQW5hbHlzaXMsIGJ1aWxkaW5nQ2F0ZWdvcmllcywgY2F0ZWdvcmllcyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvc3RIZWFkLmNhdGVnb3JpZXMgPSBidWlsZGluZ0NhdGVnb3JpZXM7XHJcbiAgICAgIGNvc3RIZWFkLnRodW1iUnVsZVJhdGUgPSBjb25maWcuZ2V0KENvbnN0YW50cy5USFVNQlJVTEVfUkFURSk7XHJcbiAgICAgIGJ1aWxkaW5nQ29zdEhlYWRzLnB1c2goY29zdEhlYWQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0Q2F0ZWdvcmllc0Zyb21SYXRlQW5hbHlzaXMoY2F0ZWdvcmllc0J5Q29zdEhlYWQ6IGFueSwgd29ya0l0ZW1zUmF0ZUFuYWx5c2lzOiBhbnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzOiBhbnksIHVuaXRzUmF0ZUFuYWx5c2lzOiBhbnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm90ZXNSYXRlQW5hbHlzaXM6IGFueSwgYnVpbGRpbmdDYXRlZ29yaWVzOiBBcnJheTxDYXRlZ29yeT4sIGNvbmZpZ0NhdGVnb3JpZXM6IEFycmF5PENhdGVnb3J5Pikge1xyXG5cclxuICAgIGxvZ2dlci5pbmZvKCdnZXRDYXRlZ29yaWVzRnJvbVJhdGVBbmFseXNpcyBoYXMgYmVlbiBoaXQuJyk7XHJcblxyXG4gICAgZm9yIChsZXQgY2F0ZWdvcnlJbmRleCA9IDA7IGNhdGVnb3J5SW5kZXggPCBjYXRlZ29yaWVzQnlDb3N0SGVhZC5sZW5ndGg7IGNhdGVnb3J5SW5kZXgrKykge1xyXG5cclxuICAgICAgbGV0IGNhdGVnb3J5ID0gbmV3IENhdGVnb3J5KGNhdGVnb3JpZXNCeUNvc3RIZWFkW2NhdGVnb3J5SW5kZXhdLm5hbWUsIGNhdGVnb3JpZXNCeUNvc3RIZWFkW2NhdGVnb3J5SW5kZXhdLnJhdGVBbmFseXNpc0lkKTtcclxuICAgICAgbGV0IGNvbmZpZ1dvcmtJdGVtcyA9IG5ldyBBcnJheTxXb3JrSXRlbT4oKTtcclxuXHJcbiAgICAgIGlmIChjb25maWdDYXRlZ29yaWVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBmb3IgKGxldCBjb25maWdDYXRlZ29yeSBvZiBjb25maWdDYXRlZ29yaWVzKSB7XHJcbiAgICAgICAgICBpZiAoY29uZmlnQ2F0ZWdvcnkubmFtZSA9PT0gY2F0ZWdvcmllc0J5Q29zdEhlYWRbY2F0ZWdvcnlJbmRleF0ubmFtZSkge1xyXG4gICAgICAgICAgICBjb25maWdXb3JrSXRlbXMgPSBjb25maWdDYXRlZ29yeS53b3JrSXRlbXM7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgd29ya0l0ZW1zUmF0ZUFuYWx5c2lzU1FMID0gJ1NFTEVDVCB3b3JrSXRlbS5DMiBBUyByYXRlQW5hbHlzaXNJZCwgd29ya0l0ZW0uQzMgQVMgbmFtZScgK1xyXG4gICAgICAgICcgRlJPTSA/IEFTIHdvcmtJdGVtIHdoZXJlIHdvcmtJdGVtLkM0ID0gJyArIGNhdGVnb3JpZXNCeUNvc3RIZWFkW2NhdGVnb3J5SW5kZXhdLnJhdGVBbmFseXNpc0lkO1xyXG5cclxuICAgICAgbGV0IHdvcmtJdGVtc0J5Q2F0ZWdvcnkgPSBhbGFzcWwod29ya0l0ZW1zUmF0ZUFuYWx5c2lzU1FMLCBbd29ya0l0ZW1zUmF0ZUFuYWx5c2lzXSk7XHJcbiAgICAgIGxldCBidWlsZGluZ1dvcmtJdGVtczogQXJyYXk8V29ya0l0ZW0+ID0gbmV3IEFycmF5PFdvcmtJdGVtPigpO1xyXG5cclxuICAgICAgdGhpcy5nZXRXb3JrSXRlbXNGcm9tUmF0ZUFuYWx5c2lzKHdvcmtJdGVtc0J5Q2F0ZWdvcnksIHJhdGVJdGVtc1JhdGVBbmFseXNpcyxcclxuICAgICAgICB1bml0c1JhdGVBbmFseXNpcywgbm90ZXNSYXRlQW5hbHlzaXMsIGJ1aWxkaW5nV29ya0l0ZW1zLCBjb25maWdXb3JrSXRlbXMpO1xyXG5cclxuICAgICAgY2F0ZWdvcnkud29ya0l0ZW1zID0gYnVpbGRpbmdXb3JrSXRlbXM7XHJcbiAgICAgIGJ1aWxkaW5nQ2F0ZWdvcmllcy5wdXNoKGNhdGVnb3J5KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldFdvcmtJdGVtc1dpdGhvdXRDYXRlZ29yeUZyb21SYXRlQW5hbHlzaXMoY29zdEhlYWRSYXRlQW5hbHlzaXNJZDogbnVtYmVyLCB3b3JrSXRlbXNSYXRlQW5hbHlzaXM6IGFueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJhdGVJdGVtc1JhdGVBbmFseXNpczogYW55LCB1bml0c1JhdGVBbmFseXNpczogYW55LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm90ZXNSYXRlQW5hbHlzaXM6IGFueSwgYnVpbGRpbmdDYXRlZ29yaWVzOiBBcnJheTxDYXRlZ29yeT4sIGNvbmZpZ0NhdGVnb3JpZXM6IEFycmF5PENhdGVnb3J5Pikge1xyXG5cclxuICAgIGxvZ2dlci5pbmZvKCdnZXRXb3JrSXRlbXNXaXRob3V0Q2F0ZWdvcnlGcm9tUmF0ZUFuYWx5c2lzIGhhcyBiZWVuIGhpdC4nKTtcclxuXHJcbiAgICBsZXQgd29ya0l0ZW1zV2l0aG91dENhdGVnb3JpZXNSYXRlQW5hbHlzaXNTUUwgPSAnU0VMRUNUIHdvcmtJdGVtLkMyIEFTIHJhdGVBbmFseXNpc0lkLCB3b3JrSXRlbS5DMyBBUyBuYW1lJyArXHJcbiAgICAgICcgRlJPTSA/IEFTIHdvcmtJdGVtIHdoZXJlIE5PVCB3b3JrSXRlbS5DNCBBTkQgd29ya0l0ZW0uQzEgPSAnICsgY29zdEhlYWRSYXRlQW5hbHlzaXNJZDtcclxuICAgIGxldCB3b3JrSXRlbXNXaXRob3V0Q2F0ZWdvcmllcyA9IGFsYXNxbCh3b3JrSXRlbXNXaXRob3V0Q2F0ZWdvcmllc1JhdGVBbmFseXNpc1NRTCwgW3dvcmtJdGVtc1JhdGVBbmFseXNpc10pO1xyXG5cclxuICAgIGxldCBidWlsZGluZ1dvcmtJdGVtczogQXJyYXk8V29ya0l0ZW0+ID0gbmV3IEFycmF5PFdvcmtJdGVtPigpO1xyXG4gICAgbGV0IGNhdGVnb3J5ID0gbmV3IENhdGVnb3J5KCdkZWZhdWx0JywgMCk7XHJcbiAgICBsZXQgY29uZmlnV29ya0l0ZW1zID0gbmV3IEFycmF5PFdvcmtJdGVtPigpO1xyXG5cclxuICAgIGlmIChjb25maWdDYXRlZ29yaWVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgZm9yIChsZXQgY29uZmlnQ2F0ZWdvcnkgb2YgY29uZmlnQ2F0ZWdvcmllcykge1xyXG4gICAgICAgIGlmIChjb25maWdDYXRlZ29yeS5uYW1lID09PSAnZGVmYXVsdCcpIHtcclxuICAgICAgICAgIGNvbmZpZ1dvcmtJdGVtcyA9IGNvbmZpZ0NhdGVnb3J5LndvcmtJdGVtcztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHRoaXMuZ2V0V29ya0l0ZW1zRnJvbVJhdGVBbmFseXNpcyh3b3JrSXRlbXNXaXRob3V0Q2F0ZWdvcmllcywgcmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzLFxyXG4gICAgICB1bml0c1JhdGVBbmFseXNpcywgbm90ZXNSYXRlQW5hbHlzaXMsIGJ1aWxkaW5nV29ya0l0ZW1zLCBjb25maWdXb3JrSXRlbXMpO1xyXG5cclxuICAgIGNhdGVnb3J5LndvcmtJdGVtcyA9IGJ1aWxkaW5nV29ya0l0ZW1zO1xyXG4gICAgYnVpbGRpbmdDYXRlZ29yaWVzLnB1c2goY2F0ZWdvcnkpO1xyXG4gIH1cclxuXHJcbiAgc3luY1JhdGVpdGVtRnJvbVJhdGVBbmFseXNpcyhlbnRpdHk6IHN0cmluZywgYnVpbGRpbmdEZXRhaWxzOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgZGF0YTogYW55KSA9PiB2b2lkKSB7XHJcblxyXG4gICAgbGV0IHJhdGVJdGVtVVJMID0gY29uZmlnLmdldChDb25zdGFudHMuUkFURV9BTkFMWVNJU19BUEkgKyBlbnRpdHkgKyBDb25zdGFudHMuUkFURV9BTkFMWVNJU19SQVRFKTtcclxuICAgIGxldCByYXRlSXRlbVJhdGVBbmFseXNpc1Byb21pc2UgPSB0aGlzLmNyZWF0ZVByb21pc2UocmF0ZUl0ZW1VUkwpO1xyXG4gICAgbG9nZ2VyLmluZm8oJ3JhdGVJdGVtUmF0ZUFuYWx5c2lzUHJvbWlzZSBmb3IgaGFzIGJlZW4gaGl0Jyk7XHJcblxyXG4gICAgbGV0IHJhdGVBbmFseXNpc05vdGVzVVJMID0gY29uZmlnLmdldChDb25zdGFudHMuUkFURV9BTkFMWVNJU19BUEkgKyBlbnRpdHkgKyBDb25zdGFudHMuUkFURV9BTkFMWVNJU19OT1RFUyk7XHJcbiAgICBsZXQgbm90ZXNSYXRlQW5hbHlzaXNQcm9taXNlID0gdGhpcy5jcmVhdGVQcm9taXNlKHJhdGVBbmFseXNpc05vdGVzVVJMKTtcclxuICAgIGxvZ2dlci5pbmZvKCdub3Rlc1JhdGVBbmFseXNpc1Byb21pc2UgZm9yIGhhcyBiZWVuIGhpdCcpO1xyXG5cclxuICAgIGxldCBhbGxVbml0c0Zyb21SYXRlQW5hbHlzaXNVUkwgPSBjb25maWcuZ2V0KENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0FQSSArIGVudGl0eSArIENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX1VOSVQpO1xyXG4gICAgbGV0IHVuaXRzUmF0ZUFuYWx5c2lzUHJvbWlzZSA9IHRoaXMuY3JlYXRlUHJvbWlzZShhbGxVbml0c0Zyb21SYXRlQW5hbHlzaXNVUkwpO1xyXG4gICAgbG9nZ2VyLmluZm8oJ3VuaXRzUmF0ZUFuYWx5c2lzUHJvbWlzZSBmb3IgaGFzIGJlZW4gaGl0Jyk7XHJcblxyXG4gICAgbGV0IGNvc3RIZWFkVVJMID0gY29uZmlnLmdldChDb25zdGFudHMuUkFURV9BTkFMWVNJU19BUEkgKyBlbnRpdHkgKyBDb25zdGFudHMuUkFURV9BTkFMWVNJU19DT1NUSEVBRFMpO1xyXG4gICAgbGV0IGNvc3RIZWFkUmF0ZUFuYWx5c2lzUHJvbWlzZSA9IHRoaXMuY3JlYXRlUHJvbWlzZShjb3N0SGVhZFVSTCk7XHJcbiAgICBsb2dnZXIuaW5mbygnY29zdEhlYWRSYXRlQW5hbHlzaXNQcm9taXNlIGZvciBoYXMgYmVlbiBoaXQnKTtcclxuXHJcbiAgICBDQ1Byb21pc2UuYWxsKFtcclxuICAgICAgcmF0ZUl0ZW1SYXRlQW5hbHlzaXNQcm9taXNlLFxyXG4gICAgICBub3Rlc1JhdGVBbmFseXNpc1Byb21pc2UsXHJcbiAgICAgIHVuaXRzUmF0ZUFuYWx5c2lzUHJvbWlzZSxcclxuICAgICAgY29zdEhlYWRSYXRlQW5hbHlzaXNQcm9taXNlXHJcbiAgICBdKS50aGVuKGZ1bmN0aW9uIChkYXRhOiBBcnJheTxhbnk+KSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdjb252ZXJ0Q29zdEhlYWRzRnJvbVJhdGVBbmFseXNpc1RvQ29zdENvbnRyb2wgUHJvbWlzZS5hbGwgQVBJIGlzIHN1Y2Nlc3MuJyk7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdzdWNjZXNzIGluICBjb252ZXJ0Q29zdEhlYWRzRnJvbVJhdGVBbmFseXNpc1RvQ29zdENvbnRyb2wuJyk7XHJcbiAgICAgIGNhbGxiYWNrKG51bGwsIGRhdGEpO1xyXG4gICAgfSkuY2F0Y2goZnVuY3Rpb24gKGU6IGFueSkge1xyXG4gICAgICBsb2dnZXIuZXJyb3IoJyBQcm9taXNlIGZhaWxlZCBmb3IgY29udmVydENvc3RIZWFkc0Zyb21SYXRlQW5hbHlzaXNUb0Nvc3RDb250cm9sICEgOicgKyBlLm1lc3NhZ2UpO1xyXG4gICAgICBDQ1Byb21pc2UucmVqZWN0KGUubWVzc2FnZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG5cclxuICBnZXRXb3JrSXRlbXNGcm9tUmF0ZUFuYWx5c2lzKHdvcmtJdGVtc0J5Q2F0ZWdvcnk6IGFueSwgcmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzOiBhbnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0c1JhdGVBbmFseXNpczogYW55LCBub3Rlc1JhdGVBbmFseXNpczogYW55LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVpbGRpbmdXb3JrSXRlbXM6IEFycmF5PFdvcmtJdGVtPiwgY29uZmlnV29ya0l0ZW1zOiBBcnJheTxhbnk+KSB7XHJcblxyXG4gICAgbG9nZ2VyLmluZm8oJ2dldFdvcmtJdGVtc0Zyb21SYXRlQW5hbHlzaXMgaGFzIGJlZW4gaGl0LicpO1xyXG4gICAgZm9yIChsZXQgY2F0ZWdvcnlXb3JraXRlbSBvZiB3b3JrSXRlbXNCeUNhdGVnb3J5KSB7XHJcbiAgICAgIGxldCB3b3JrSXRlbSA9IHRoaXMuZ2V0UmF0ZUFuYWx5c2lzKGNhdGVnb3J5V29ya2l0ZW0sIGNvbmZpZ1dvcmtJdGVtcywgcmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzLFxyXG4gICAgICAgIHVuaXRzUmF0ZUFuYWx5c2lzLCBub3Rlc1JhdGVBbmFseXNpcyk7XHJcblxyXG5cclxuICAgICAgYnVpbGRpbmdXb3JrSXRlbXMucHVzaCh3b3JrSXRlbSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXRSYXRlQW5hbHlzaXMoY2F0ZWdvcnlXb3JraXRlbTogV29ya0l0ZW0sIGNvbmZpZ1dvcmtJdGVtczogQXJyYXk8YW55PiwgcmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzOiBhbnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0c1JhdGVBbmFseXNpczogYW55LCBub3Rlc1JhdGVBbmFseXNpczogYW55KSB7XHJcbiAgICBsZXQgIHdvcmtJdGVtID0gbmV3IFdvcmtJdGVtKGNhdGVnb3J5V29ya2l0ZW0ubmFtZSwgY2F0ZWdvcnlXb3JraXRlbS5yYXRlQW5hbHlzaXNJZCk7XHJcbiAgICBpZihjYXRlZ29yeVdvcmtpdGVtLmFjdGl2ZSE9PXVuZGVmaW5lZCAmJiBjYXRlZ29yeVdvcmtpdGVtLmFjdGl2ZSE9PW51bGwpIHtcclxuICAgICAgd29ya0l0ZW09Y2F0ZWdvcnlXb3JraXRlbTtcclxuICAgICAgfVxyXG4gICAgaWYgKGNvbmZpZ1dvcmtJdGVtcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGZvciAobGV0IGNvbmZpZ1dvcmtJdGVtIG9mIGNvbmZpZ1dvcmtJdGVtcykge1xyXG4gICAgICAgIGlmIChjb25maWdXb3JrSXRlbS5uYW1lID09PSBjYXRlZ29yeVdvcmtpdGVtLm5hbWUpIHtcclxuICAgICAgICAgIHdvcmtJdGVtLnVuaXQgPSBjb25maWdXb3JrSXRlbS5tZWFzdXJlbWVudFVuaXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHJhdGVJdGVtc1JhdGVBbmFseXNpc1NRTCA9ICdTRUxFQ1QgcmF0ZUl0ZW0uQzIgQVMgaXRlbU5hbWUsIHJhdGVJdGVtLkMyIEFTIG9yaWdpbmFsSXRlbU5hbWUsJyArXHJcbiAgICAgICdyYXRlSXRlbS5DMTIgQVMgcmF0ZUFuYWx5c2lzSWQsIHJhdGVJdGVtLkM2IEFTIHR5cGUsJyArXHJcbiAgICAgICdST1VORChyYXRlSXRlbS5DNywyKSBBUyBxdWFudGl0eSwgUk9VTkQocmF0ZUl0ZW0uQzMsMikgQVMgcmF0ZSwgdW5pdC5DMiBBUyB1bml0LCcgK1xyXG4gICAgICAnUk9VTkQocmF0ZUl0ZW0uQzMgKiByYXRlSXRlbS5DNywyKSBBUyB0b3RhbEFtb3VudCwgcmF0ZUl0ZW0uQzUgQVMgdG90YWxRdWFudGl0eSwgcmF0ZUl0ZW0uQzEzIEFTIG5vdGVzUmF0ZUFuYWx5c2lzSWQgICcgK1xyXG4gICAgICAnRlJPTSA/IEFTIHJhdGVJdGVtIEpPSU4gPyBBUyB1bml0IE9OIHVuaXQuQzEgPSByYXRlSXRlbS5DOSB3aGVyZSByYXRlSXRlbS5DMSA9ICdcclxuICAgICAgKyBjYXRlZ29yeVdvcmtpdGVtLnJhdGVBbmFseXNpc0lkO1xyXG4gICAgbGV0IHJhdGVJdGVtc0J5V29ya0l0ZW0gPSBhbGFzcWwocmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzU1FMLCBbcmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzLCB1bml0c1JhdGVBbmFseXNpc10pO1xyXG4gICAgbGV0IG5vdGVzID0gJyc7XHJcbiAgICBsZXQgaW1hZ2VVUkwgPSAnJztcclxuICAgIHdvcmtJdGVtLnJhdGUucmF0ZUl0ZW1zID0gcmF0ZUl0ZW1zQnlXb3JrSXRlbTtcclxuICAgIGlmIChyYXRlSXRlbXNCeVdvcmtJdGVtICYmIHJhdGVJdGVtc0J5V29ya0l0ZW0ubGVuZ3RoID4gMCkge1xyXG4gICAgICBsZXQgbm90ZXNSYXRlQW5hbHlzaXNTUUwgPSAnU0VMRUNUIG5vdGVzLkMyIEFTIG5vdGVzLCBub3Rlcy5DMyBBUyBpbWFnZVVSTCBGUk9NID8gQVMgbm90ZXMgd2hlcmUgbm90ZXMuQzEgPSAnK1xyXG4gICAgICAgIHJhdGVJdGVtc0J5V29ya0l0ZW1bMF0ubm90ZXNSYXRlQW5hbHlzaXNJZDtcclxuICAgICAgbGV0IG5vdGVzTGlzdCA9IGFsYXNxbChub3Rlc1JhdGVBbmFseXNpc1NRTCwgW25vdGVzUmF0ZUFuYWx5c2lzXSk7XHJcbiAgICAgIG5vdGVzID0gbm90ZXNMaXN0WzBdLm5vdGVzO1xyXG4gICAgICBpbWFnZVVSTCA9IG5vdGVzTGlzdFswXS5pbWFnZVVSTDtcclxuXHJcbiAgICAgIHdvcmtJdGVtLnJhdGUucXVhbnRpdHkgPSByYXRlSXRlbXNCeVdvcmtJdGVtWzBdLnRvdGFsUXVhbnRpdHk7XHJcbiAgICAgIHdvcmtJdGVtLnN5c3RlbVJhdGUucXVhbnRpdHkgPSByYXRlSXRlbXNCeVdvcmtJdGVtWzBdLnRvdGFsUXVhbnRpdHk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB3b3JrSXRlbS5yYXRlLnF1YW50aXR5ID0gMTtcclxuICAgICAgd29ya0l0ZW0uc3lzdGVtUmF0ZS5xdWFudGl0eSA9IDE7XHJcbiAgICB9XHJcbiAgICB3b3JrSXRlbS5yYXRlLmlzRXN0aW1hdGVkID0gZmFsc2U7XHJcbiAgICB3b3JrSXRlbS5yYXRlLm5vdGVzID0gbm90ZXM7XHJcbiAgICB3b3JrSXRlbS5yYXRlLmltYWdlVVJMID1pbWFnZVVSTDtcclxuXHJcbiAgICAvL1N5c3RlbSByYXRlXHJcblxyXG4gICAgd29ya0l0ZW0uc3lzdGVtUmF0ZS5yYXRlSXRlbXMgPSByYXRlSXRlbXNCeVdvcmtJdGVtO1xyXG4gICAgd29ya0l0ZW0uc3lzdGVtUmF0ZS5ub3RlcyA9IG5vdGVzO1xyXG4gICAgd29ya0l0ZW0uc3lzdGVtUmF0ZS5pbWFnZVVSTCA9IGltYWdlVVJMO1xyXG4gICAgcmV0dXJuIHdvcmtJdGVtO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbk9iamVjdC5zZWFsKFJhdGVBbmFseXNpc1NlcnZpY2UpO1xyXG5leHBvcnQgPSBSYXRlQW5hbHlzaXNTZXJ2aWNlO1xyXG4iXX0=
