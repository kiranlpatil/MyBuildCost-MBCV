"use strict";
var UserService = require("./../../framework/services/UserService");
var ProjectAsset = require("../../framework/shared/projectasset");
var AuthInterceptor = require("../../framework/interceptor/auth.interceptor");
var CostControllException = require("../exception/CostControllException");
var WorkItem = require("../dataaccess/model/project/building/WorkItem");
var request = require('request');
var config = require('config');
var log4js = require('log4js');
var logger = log4js.getLogger('Rate Analysis Service');
var alasql = require("alasql");
var Rate = require("../dataaccess/model/project/building/Rate");
var CostHead = require("../dataaccess/model/project/building/CostHead");
var Category = require("../dataaccess/model/project/building/Category");
var Constants = require("../shared/constants");
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
            callback(null, { 'buildingCostHeads': buildingCostHeads, 'rates': rateItemsRateAnalysis, 'units': unitsRateAnalysis });
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
    RateAnalysisService.prototype.getWorkItemsFromRateAnalysis = function (workItemsByCategory, rateItemsRateAnalysis, unitsRateAnalysis, notesRateAnalysis, buildingWorkItems, configWorkItems) {
        logger.info('getWorkItemsFromRateAnalysis has been hit.');
        for (var workItemIndex = 0; workItemIndex < workItemsByCategory.length; workItemIndex++) {
            var workItem = new WorkItem(workItemsByCategory[workItemIndex].name, workItemsByCategory[workItemIndex].rateAnalysisId);
            if (configWorkItems.length > 0) {
                for (var _i = 0, configWorkItems_1 = configWorkItems; _i < configWorkItems_1.length; _i++) {
                    var configWorkItem = configWorkItems_1[_i];
                    if (configWorkItem.name === workItemsByCategory[workItemIndex].name) {
                        workItem.unit = configWorkItem.measurementUnit;
                    }
                }
            }
            var rateItemsRateAnalysisSQL = 'SELECT rateItem.C2 AS itemName, rateItem.C2 AS originalItemName,' +
                'rateItem.C12 AS rateAnalysisId, rateItem.C6 AS type,' +
                'ROUND(rateItem.C7,2) AS quantity, ROUND(rateItem.C3,2) AS rate, unit.C2 AS unit,' +
                'ROUND(rateItem.C3 * rateItem.C7,2) AS totalAmount, rateItem.C5 AS totalQuantity,  rateItem.C13 AS notesRateAnalysisId ' +
                'FROM ? AS rateItem JOIN ? AS unit ON unit.C1 = rateItem.C9 where rateItem.C1 = '
                + workItemsByCategory[workItemIndex].rateAnalysisId;
            var rateItemsByWorkItem = alasql(rateItemsRateAnalysisSQL, [rateItemsRateAnalysis, unitsRateAnalysis]);
            var notesRateAnalysisSQL = 'SELECT notes.C2 AS notes, notes.C3 AS imageURL FROM ? AS notes where notes.C1 = ' +
                rateItemsByWorkItem[0].notesRateAnalysisId;
            var notesList = alasql(notesRateAnalysisSQL, [notesRateAnalysis]);
            workItem.rate.rateItems = rateItemsByWorkItem;
            workItem.rate.quantity = rateItemsByWorkItem[0].totalQuantity;
            workItem.rate.isEstimated = false;
            workItem.rate.notes = notesList[0].notes;
            workItem.rate.imageURL = notesList[0].imageURL;
            workItem.systemRate.rateItems = rateItemsByWorkItem;
            workItem.systemRate.quantity = rateItemsByWorkItem[0].totalQuantity;
            workItem.systemRate.notes = notesList[0].notes;
            workItem.systemRate.imageURL = notesList[0].imageURL;
            buildingWorkItems.push(workItem);
        }
    };
    return RateAnalysisService;
}());
Object.seal(RateAnalysisService);
module.exports = RateAnalysisService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHBsaWNhdGlvblByb2plY3Qvc2VydmljZXMvUmF0ZUFuYWx5c2lzU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsb0VBQXVFO0FBQ3ZFLGtFQUFxRTtBQUVyRSw4RUFBaUY7QUFDakYsMEVBQTZFO0FBQzdFLHdFQUEyRTtBQUMzRSxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDakMsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixJQUFJLE1BQU0sR0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFDckQsK0JBQWtDO0FBQ2xDLGdFQUFtRTtBQUNuRSx3RUFBMkU7QUFDM0Usd0VBQTJFO0FBQzNFLCtDQUFrRDtBQUNsRCxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsNEJBQTRCLENBQUMsQ0FBQztBQUV0RDtJQU1FO1FBQ0UsSUFBSSxDQUFDLFFBQVEsR0FBRyxZQUFZLENBQUMsUUFBUSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxlQUFlLEVBQUUsQ0FBQztRQUM3QyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7SUFDdkMsQ0FBQztJQUVELDBDQUFZLEdBQVosVUFBYyxHQUFXLEVBQUUsSUFBVSxFQUFFLFFBQTJDO1FBQ2hGLE1BQU0sQ0FBQyxJQUFJLENBQUMsa0RBQWtELENBQUMsQ0FBQztRQUNoRSxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUMsR0FBRyxFQUFFLEdBQUcsRUFBQyxFQUFFLFVBQVUsS0FBVSxFQUFFLFFBQWEsRUFBRSxJQUFTO1lBQ3BFLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ1YsUUFBUSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN4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QUMvQyxRQUFRLENBQUMsVUFBVSxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO1lBR3JELGlCQUFpQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNuQyxDQUFDO0lBQ0gsQ0FBQztJQUNILDBCQUFDO0FBQUQsQ0FsV0EsQUFrV0MsSUFBQTtBQUlELE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUNqQyxpQkFBUyxtQkFBbUIsQ0FBQyIsImZpbGUiOiJhcHAvYXBwbGljYXRpb25Qcm9qZWN0L3NlcnZpY2VzL1JhdGVBbmFseXNpc1NlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVXNlclNlcnZpY2UgPSByZXF1aXJlKCcuLy4uLy4uL2ZyYW1ld29yay9zZXJ2aWNlcy9Vc2VyU2VydmljZScpO1xyXG5pbXBvcnQgUHJvamVjdEFzc2V0ID0gcmVxdWlyZSgnLi4vLi4vZnJhbWV3b3JrL3NoYXJlZC9wcm9qZWN0YXNzZXQnKTtcclxuaW1wb3J0IFVzZXIgPSByZXF1aXJlKCcuLi8uLi9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9tb25nb29zZS91c2VyJyk7XHJcbmltcG9ydCBBdXRoSW50ZXJjZXB0b3IgPSByZXF1aXJlKCcuLi8uLi9mcmFtZXdvcmsvaW50ZXJjZXB0b3IvYXV0aC5pbnRlcmNlcHRvcicpO1xyXG5pbXBvcnQgQ29zdENvbnRyb2xsRXhjZXB0aW9uID0gcmVxdWlyZSgnLi4vZXhjZXB0aW9uL0Nvc3RDb250cm9sbEV4Y2VwdGlvbicpO1xyXG5pbXBvcnQgV29ya0l0ZW0gPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3Byb2plY3QvYnVpbGRpbmcvV29ya0l0ZW0nKTtcclxubGV0IHJlcXVlc3QgPSByZXF1aXJlKCdyZXF1ZXN0Jyk7XHJcbmxldCBjb25maWcgPSByZXF1aXJlKCdjb25maWcnKTtcclxudmFyIGxvZzRqcyA9IHJlcXVpcmUoJ2xvZzRqcycpO1xyXG52YXIgbG9nZ2VyPWxvZzRqcy5nZXRMb2dnZXIoJ1JhdGUgQW5hbHlzaXMgU2VydmljZScpO1xyXG5pbXBvcnQgYWxhc3FsID0gcmVxdWlyZSgnYWxhc3FsJyk7XHJcbmltcG9ydCBSYXRlID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L2J1aWxkaW5nL1JhdGUnKTtcclxuaW1wb3J0IENvc3RIZWFkID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L2J1aWxkaW5nL0Nvc3RIZWFkJyk7XHJcbmltcG9ydCBDYXRlZ29yeSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9idWlsZGluZy9DYXRlZ29yeScpO1xyXG5pbXBvcnQgQ29uc3RhbnRzID0gcmVxdWlyZSgnLi4vc2hhcmVkL2NvbnN0YW50cycpO1xyXG5sZXQgQ0NQcm9taXNlID0gcmVxdWlyZSgncHJvbWlzZS9saWIvZXM2LWV4dGVuc2lvbnMnKTtcclxuXHJcbmNsYXNzIFJhdGVBbmFseXNpc1NlcnZpY2Uge1xyXG4gIEFQUF9OQU1FOiBzdHJpbmc7XHJcbiAgY29tcGFueV9uYW1lOiBzdHJpbmc7XHJcbiAgcHJpdmF0ZSBhdXRoSW50ZXJjZXB0b3I6IEF1dGhJbnRlcmNlcHRvcjtcclxuICBwcml2YXRlIHVzZXJTZXJ2aWNlOiBVc2VyU2VydmljZTtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLkFQUF9OQU1FID0gUHJvamVjdEFzc2V0LkFQUF9OQU1FO1xyXG4gICAgdGhpcy5hdXRoSW50ZXJjZXB0b3IgPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XHJcbiAgICB0aGlzLnVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgfVxyXG5cclxuICBnZXRDb3N0SGVhZHMoIHVybDogc3RyaW5nLCB1c2VyOiBVc2VyLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUmF0ZSBBbmFseXNpcyBTZXJ2aWNlLCBnZXRDb3N0SGVhZHMgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICByZXF1ZXN0LmdldCh7dXJsOiB1cmx9LCBmdW5jdGlvbiAoZXJyb3I6IGFueSwgcmVzcG9uc2U6IGFueSwgYm9keTogYW55KSB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIGlmICghZXJyb3IgJiYgcmVzcG9uc2UpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnUkVTUE9OU0UgSlNPTiA6ICcgKyBKU09OLnN0cmluZ2lmeShKU09OLnBhcnNlKGJvZHkpKSk7XHJcbiAgICAgICAgbGV0IHJlcyA9IEpTT04ucGFyc2UoYm9keSk7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRXb3JrSXRlbXMoIHVybDogc3RyaW5nLCB1c2VyOiBVc2VyLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUmF0ZSBBbmFseXNpcyBTZXJ2aWNlLCBnZXRXb3JrSXRlbXMgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICByZXF1ZXN0LmdldCh7dXJsOiB1cmx9LCBmdW5jdGlvbiAoZXJyb3I6IGFueSwgcmVzcG9uc2U6IGFueSwgYm9keTogYW55KSB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIGlmICghZXJyb3IgJiYgcmVzcG9uc2UpIHtcclxuICAgICAgICBsZXQgcmVzID0gSlNPTi5wYXJzZShib2R5KTtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCByZXMpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldFdvcmtJdGVtc0J5Q29zdEhlYWRJZCggdXJsOiBzdHJpbmcsY29zdEhlYWRJZDogc3RyaW5nLCB1c2VyOiBVc2VyLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUmF0ZSBBbmFseXNpcyBTZXJ2aWNlLCBnZXRXb3JrSXRlbXNCeUNvc3RIZWFkSWQgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICBsZXQgd29ya0l0ZW1zIDogQXJyYXk8V29ya0l0ZW0+ID0gW107XHJcbiAgICByZXF1ZXN0LmdldCh7dXJsOiB1cmx9LCBmdW5jdGlvbiAoZXJyb3I6IGFueSwgcmVzcG9uc2U6IGFueSwgYm9keTogYW55KSB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIGlmICghZXJyb3IgJiYgcmVzcG9uc2UpIHtcclxuICAgICAgICBsZXQgcmVzID0gSlNPTi5wYXJzZShib2R5KTtcclxuICAgICAgICBpZihyZXMpIHtcclxuXHJcbiAgICAgICAgICBmb3IobGV0IHdvcmtpdGVtIG9mIHJlcy5TdWJJdGVtVHlwZSkge1xyXG4gICAgICAgICAgICBpZihwYXJzZUludChjb3N0SGVhZElkKSA9PT0gd29ya2l0ZW0uQzMpIHtcclxuICAgICAgICAgICAgICBsZXQgd29ya2l0ZW1EZXRhaWxzID0gbmV3IFdvcmtJdGVtKHdvcmtpdGVtLkMyLCB3b3JraXRlbS5DMSk7XHJcbiAgICAgICAgICAgICAgd29ya0l0ZW1zLnB1c2god29ya2l0ZW1EZXRhaWxzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjYWxsYmFjayhudWxsLCB3b3JrSXRlbXMpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldEFwaUNhbGwodXJsIDogc3RyaW5nLCBjYWxsYmFjazooZXJyb3IgOiBhbnksIHJlc3BvbnNlOiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdnZXRBcGlDYWxsIGZvciByYXRlQW5hbHlzaXMgaGFzIGJlZSBoaXQgZm9yIHVybCA6ICcrdXJsKTtcclxuICAgIHJlcXVlc3QuZ2V0KHt1cmw6IHVybH0sIGZ1bmN0aW9uIChlcnJvcjogYW55LCByZXNwb25zZTogYW55LCBib2R5OiBhbnkpIHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2sobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlcnJvci5tZXNzYWdlLCBlcnJvci5zdGFjayksIG51bGwpO1xyXG4gICAgICB9IGVsc2UgaWYgKCFlcnJvciAmJiByZXNwb25zZSkge1xyXG4gICAgICAgIGxldCByZXMgPSBKU09OLnBhcnNlKGJvZHkpO1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHJlcyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0UmF0ZSh3b3JrSXRlbUlkOiBudW1iZXIsIGNhbGxiYWNrOihlcnJvcjogYW55LCBkYXRhOmFueSkgPT4gdm9pZCkge1xyXG4gICAgbGV0IHVybCA9IGNvbmZpZy5nZXQoJ3JhdGVBbmFseXNpc0FQSS51bml0Jyk7XHJcbiAgICB0aGlzLmdldEFwaUNhbGwodXJsLCAoZXJyb3IsIHVuaXREYXRhKSA9PiB7XHJcbiAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9ZWxzZSB7XHJcbiAgICAgICAgdW5pdERhdGEgPSB1bml0RGF0YVsnVU9NJ107XHJcbiAgICAgICAgdXJsID0gY29uZmlnLmdldCgncmF0ZUFuYWx5c2lzQVBJLnJhdGUnKTtcclxuICAgICAgICB0aGlzLmdldEFwaUNhbGwodXJsLCAoZXJyb3IsIGRhdGEpID0+IHtcclxuICAgICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCByYXRlID0gZGF0YVsnUmF0ZUFuYWx5c2lzRGF0YSddO1xyXG4gICAgICAgICAgICBsZXQgc3FsID0gJ1NFTEVDVCByYXRlLkM1IEFTIHF1YW50aXR5LCB1bml0LkMyIEFzIHVuaXQgRlJPTSA/IEFTIHJhdGUgSk9JTiA/IEFTIHVuaXQgb24gdW5pdC5DMSA9ICByYXRlLkM4IGFuZCcgK1xyXG4gICAgICAgICAgICAgICcgcmF0ZS5DMSA9ICcrIHdvcmtJdGVtSWQ7XHJcbiAgICAgICAgICAgIGxldCBzcWwyID0gJ1NFTEVDVCByYXRlLkMxIEFTIHJhdGVBbmFseXNpc0lkLCByYXRlLkMyIEFTIGl0ZW1OYW1lLFJPVU5EKHJhdGUuQzcsMikgQVMgcXVhbnRpdHksUk9VTkQocmF0ZS5DMywyKSBBUyByYXRlLCcgK1xyXG4gICAgICAgICAgICAgICcgUk9VTkQocmF0ZS5DMypyYXRlLkM3LDIpIEFTIHRvdGFsQW1vdW50LCByYXRlLkM2IHR5cGUsIHVuaXQuQzIgQXMgdW5pdCBGUk9NID8gQVMgcmF0ZSBKT0lOID8gQVMgdW5pdCBPTiB1bml0LkMxID0gcmF0ZS5DOScgK1xyXG4gICAgICAgICAgICAgICcgIFdIRVJFIHJhdGUuQzEgPSAnKyB3b3JrSXRlbUlkO1xyXG4gICAgICAgICAgICBsZXQgc3FsMyA9ICdTRUxFQ1QgUk9VTkQoU1VNKHJhdGUuQzMqcmF0ZS5DNykgLyBTVU0ocmF0ZS5DNyksMikgQVMgdG90YWwgIEZST00gPyBBUyByYXRlIEpPSU4gPyBBUyB1bml0IE9OIHVuaXQuQzEgPSByYXRlLkM5JyArXHJcbiAgICAgICAgICAgICAgJyAgV0hFUkUgcmF0ZS5DMSA9ICcrIHdvcmtJdGVtSWQ7XHJcbiAgICAgICAgICAgIGxldCBxdWFudGl0eUFuZFVuaXQgPSBhbGFzcWwoc3FsLCBbcmF0ZSwgdW5pdERhdGFdKTtcclxuICAgICAgICAgICAgbGV0IHJhdGVSZXN1bHQgOiBSYXRlID0gbmV3IFJhdGUoKTtcclxuICAgICAgICAgICAgbGV0IHRvdGFscmF0ZUZyb21SYXRlQW5hbHlzaXMgPSBhbGFzcWwoc3FsMywgW3JhdGUsIHVuaXREYXRhXSk7XHJcbiAgICAgICAgICAgIHJhdGVSZXN1bHQucXVhbnRpdHkgPSBxdWFudGl0eUFuZFVuaXRbMF0ucXVhbnRpdHk7XHJcbiAgICAgICAgICAgIHJhdGVSZXN1bHQudW5pdCA9IHF1YW50aXR5QW5kVW5pdFswXS51bml0O1xyXG4gICAgICAgICAgICByYXRlUmVzdWx0LnJhdGVGcm9tUmF0ZUFuYWx5c2lzID0gcGFyc2VGbG9hdCgodG90YWxyYXRlRnJvbVJhdGVBbmFseXNpc1swXS50b3RhbCkudG9GaXhlZCgyKSk7XHJcbiAgICAgICAgICAgIHJhdGUgPSBhbGFzcWwoc3FsMiwgW3JhdGUsIHVuaXREYXRhXSk7XHJcbiAgICAgICAgICAgIHJhdGVSZXN1bHQucmF0ZUl0ZW1zID0gcmF0ZTtcclxuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgcmF0ZVJlc3VsdCk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vVE9ETyA6IERlbGV0ZSBBUEkncyByZWxhdGVkIHRvIHdvcmtpdGVtcyBhZGQsIGRlbGVldCwgZ2V0IGxpc3QuXHJcbiAgZ2V0V29ya2l0ZW1MaXN0KGNvc3RIZWFkSWQ6IG51bWJlcixjYXRlZ29yeUlkOiBudW1iZXIsIGNhbGxiYWNrOihlcnJvcjogYW55LCBkYXRhOmFueSkgPT4gdm9pZCkge1xyXG4gICAgbGV0IHVybCA9IGNvbmZpZy5nZXQoJ3JhdGVBbmFseXNpc0FQSS53b3JraXRlbScpO1xyXG4gICAgdGhpcy5nZXRBcGlDYWxsKHVybCwgKGVycm9yLCB3b3JraXRlbSkgPT4ge1xyXG4gICAgICBpZihlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfWVsc2Uge1xyXG4gICAgICAgIGxldCBzcWw6IHN0cmluZyA9ICdTRUxFQ1QgQzIgQVMgcmF0ZUFuYWx5c2lzSWQsIEMzIEFTIG5hbWUgRlJPTSA/IFdIRVJFIEMxID0gJysgY29zdEhlYWRJZCsnIGFuZCBDNCA9ICcrIGNhdGVnb3J5SWQ7XHJcbiAgICAgICAgaWYoY2F0ZWdvcnlJZCA9PT0gMCkge1xyXG4gICAgICAgICAgc3FsID0gJ1NFTEVDVCBDMiBBUyByYXRlQW5hbHlzaXNJZCwgQzMgQVMgbmFtZSBGUk9NID8gV0hFUkUgQzEgPSAnKyBjb3N0SGVhZElkO1xyXG4gICAgICAgIH1cclxuICAgICAgICB3b3JraXRlbSA9IHdvcmtpdGVtWydJdGVtcyddO1xyXG4gICAgICAgIGxldCB3b3JraXRlbUxpc3QgPSBhbGFzcWwoc3FsLCBbd29ya2l0ZW1dKTtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCB3b3JraXRlbUxpc3QpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGNvbnZlcnRDb3N0SGVhZHNGcm9tUmF0ZUFuYWx5c2lzVG9Db3N0Q29udHJvbChlbnRpdHk6c3RyaW5nLCBjYWxsYmFjazooZXJyb3I6IGFueSwgZGF0YTphbnkpPT4gdm9pZCkge1xyXG4gICAgbG9nZ2VyLmluZm8oJ2NvbnZlcnRDb3N0SGVhZHNGcm9tUmF0ZUFuYWx5c2lzVG9Db3N0Q29udHJvbCBoYXMgYmVlbiBoaXQnKTtcclxuXHJcbiAgICBsZXQgY29zdEhlYWRVUkwgPSBjb25maWcuZ2V0KENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0FQSSArIGVudGl0eSArIENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0NPU1RIRUFEUyk7XHJcbiAgICBsZXQgY29zdEhlYWRSYXRlQW5hbHlzaXNQcm9taXNlID0gdGhpcy5jcmVhdGVQcm9taXNlKGNvc3RIZWFkVVJMKTtcclxuICAgIGxvZ2dlci5pbmZvKCdjb3N0SGVhZFJhdGVBbmFseXNpc1Byb21pc2UgZm9yIGhhcyBiZWVuIGhpdCcpO1xyXG5cclxuICAgIGxldCBjYXRlZ29yeVVSTCA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfQVBJICsgZW50aXR5ICsgQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfQ0FURUdPUklFUyk7XHJcbiAgICBsZXQgY2F0ZWdvcnlSYXRlQW5hbHlzaXNQcm9taXNlID0gdGhpcy5jcmVhdGVQcm9taXNlKGNhdGVnb3J5VVJMKTtcclxuICAgIGxvZ2dlci5pbmZvKCdjYXRlZ29yeVJhdGVBbmFseXNpc1Byb21pc2UgZm9yIGhhcyBiZWVuIGhpdCcpO1xyXG5cclxuICAgIGxldCB3b3JrSXRlbVVSTCA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfQVBJICsgZW50aXR5ICsgQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfV09SS0lURU1TKTtcclxuICAgIGxldCB3b3JrSXRlbVJhdGVBbmFseXNpc1Byb21pc2UgPSB0aGlzLmNyZWF0ZVByb21pc2Uod29ya0l0ZW1VUkwpO1xyXG4gICAgbG9nZ2VyLmluZm8oJ3dvcmtJdGVtUmF0ZUFuYWx5c2lzUHJvbWlzZSBmb3IgaGFzIGJlZW4gaGl0Jyk7XHJcblxyXG4gICAgbGV0IHJhdGVJdGVtVVJMID0gY29uZmlnLmdldChDb25zdGFudHMuUkFURV9BTkFMWVNJU19BUEkgKyBlbnRpdHkgKyBDb25zdGFudHMuUkFURV9BTkFMWVNJU19SQVRFKTtcclxuICAgIGxldCByYXRlSXRlbVJhdGVBbmFseXNpc1Byb21pc2UgPSB0aGlzLmNyZWF0ZVByb21pc2UocmF0ZUl0ZW1VUkwpO1xyXG4gICAgbG9nZ2VyLmluZm8oJ3JhdGVJdGVtUmF0ZUFuYWx5c2lzUHJvbWlzZSBmb3IgaGFzIGJlZW4gaGl0Jyk7XHJcblxyXG4gICAgbGV0IHJhdGVBbmFseXNpc05vdGVzVVJMID0gY29uZmlnLmdldChDb25zdGFudHMuUkFURV9BTkFMWVNJU19BUEkgKyBlbnRpdHkgKyBDb25zdGFudHMuUkFURV9BTkFMWVNJU19OT1RFUyk7XHJcbiAgICBsZXQgbm90ZXNSYXRlQW5hbHlzaXNQcm9taXNlID0gdGhpcy5jcmVhdGVQcm9taXNlKHJhdGVBbmFseXNpc05vdGVzVVJMKTtcclxuICAgIGxvZ2dlci5pbmZvKCdub3Rlc1JhdGVBbmFseXNpc1Byb21pc2UgZm9yIGhhcyBiZWVuIGhpdCcpO1xyXG5cclxuICAgIGxldCBhbGxVbml0c0Zyb21SYXRlQW5hbHlzaXNVUkwgPSBjb25maWcuZ2V0KENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0FQSSArIGVudGl0eSArIENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX1VOSVQpO1xyXG4gICAgbGV0IHVuaXRzUmF0ZUFuYWx5c2lzUHJvbWlzZSA9IHRoaXMuY3JlYXRlUHJvbWlzZShhbGxVbml0c0Zyb21SYXRlQW5hbHlzaXNVUkwpO1xyXG4gICAgbG9nZ2VyLmluZm8oJ3VuaXRzUmF0ZUFuYWx5c2lzUHJvbWlzZSBmb3IgaGFzIGJlZW4gaGl0Jyk7XHJcblxyXG4gICAgbG9nZ2VyLmluZm8oJ2NhbGxpbmcgUHJvbWlzZS5hbGwnKTtcclxuICAgIENDUHJvbWlzZS5hbGwoW1xyXG4gICAgICBjb3N0SGVhZFJhdGVBbmFseXNpc1Byb21pc2UsXHJcbiAgICAgIGNhdGVnb3J5UmF0ZUFuYWx5c2lzUHJvbWlzZSxcclxuICAgICAgd29ya0l0ZW1SYXRlQW5hbHlzaXNQcm9taXNlLFxyXG4gICAgICByYXRlSXRlbVJhdGVBbmFseXNpc1Byb21pc2UsXHJcbiAgICAgIG5vdGVzUmF0ZUFuYWx5c2lzUHJvbWlzZSxcclxuICAgICAgdW5pdHNSYXRlQW5hbHlzaXNQcm9taXNlXHJcbiAgICBdKS50aGVuKGZ1bmN0aW9uKGRhdGE6IEFycmF5PGFueT4pIHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ2NvbnZlcnRDb3N0SGVhZHNGcm9tUmF0ZUFuYWx5c2lzVG9Db3N0Q29udHJvbCBQcm9taXNlLmFsbCBBUEkgaXMgc3VjY2Vzcy4nKTtcclxuICAgICAgbGV0IGNvc3RIZWFkc1JhdGVBbmFseXNpcyA9IGRhdGFbMF1bQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfSVRFTV9UWVBFXTtcclxuICAgICAgbGV0IGNhdGVnb3JpZXNSYXRlQW5hbHlzaXMgPSBkYXRhWzFdW0NvbnN0YW50cy5SQVRFX0FOQUxZU0lTX1NVQklURU1fVFlQRV07XHJcbiAgICAgIGxldCB3b3JrSXRlbXNSYXRlQW5hbHlzaXMgPSBkYXRhWzJdW0NvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0lURU1TXTtcclxuICAgICAgbGV0IHJhdGVJdGVtc1JhdGVBbmFseXNpcyA9IGRhdGFbM11bQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfREFUQV07XHJcbiAgICAgIGxldCBub3Rlc1JhdGVBbmFseXNpcyA9IGRhdGFbNF1bQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfREFUQV07XHJcbiAgICAgIGxldCB1bml0c1JhdGVBbmFseXNpcyA9IGRhdGFbNV1bQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfVU9NXTtcclxuXHJcbiAgICAgIGxldCBidWlsZGluZ0Nvc3RIZWFkczogQXJyYXk8Q29zdEhlYWQ+ID0gW107XHJcbiAgICAgIGxldCByYXRlQW5hbHlzaXNTZXJ2aWNlID0gbmV3IFJhdGVBbmFseXNpc1NlcnZpY2UoKTtcclxuXHJcbiAgICAgIHJhdGVBbmFseXNpc1NlcnZpY2UuZ2V0Q29zdEhlYWRzRnJvbVJhdGVBbmFseXNpcyhjb3N0SGVhZHNSYXRlQW5hbHlzaXMsIGNhdGVnb3JpZXNSYXRlQW5hbHlzaXMsIHdvcmtJdGVtc1JhdGVBbmFseXNpcyxcclxuICAgICAgICByYXRlSXRlbXNSYXRlQW5hbHlzaXMsIHVuaXRzUmF0ZUFuYWx5c2lzLCBub3Rlc1JhdGVBbmFseXNpcywgYnVpbGRpbmdDb3N0SGVhZHMpO1xyXG4gICAgICBsb2dnZXIuaW5mbygnc3VjY2VzcyBpbiAgY29udmVydENvc3RIZWFkc0Zyb21SYXRlQW5hbHlzaXNUb0Nvc3RDb250cm9sLicpO1xyXG4gICAgICBjYWxsYmFjayhudWxsLCB7J2J1aWxkaW5nQ29zdEhlYWRzJyA6IGJ1aWxkaW5nQ29zdEhlYWRzLCAncmF0ZXMnIDogcmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzLCAndW5pdHMnIDogdW5pdHNSYXRlQW5hbHlzaXN9KTtcclxuICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGU6YW55KSB7XHJcbiAgICAgIGxvZ2dlci5lcnJvcignIFByb21pc2UgZmFpbGVkIGZvciBjb252ZXJ0Q29zdEhlYWRzRnJvbVJhdGVBbmFseXNpc1RvQ29zdENvbnRyb2wgISA6JyArSlNPTi5zdHJpbmdpZnkoZSkpO1xyXG4gICAgICBDQ1Byb21pc2UucmVqZWN0KGUpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBjcmVhdGVQcm9taXNlKHVybDogc3RyaW5nKSB7XHJcbiAgICAgIHJldHVybiBuZXcgQ0NQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUgOiBhbnksIHJlamVjdCA6IGFueSl7XHJcbiAgICAgICAgbG9nZ2VyLmluZm8oJ2NyZWF0ZVByb21pc2UgaGFzIGJlZW4gaGl0IGZvciA6ICcrdXJsKTtcclxuICAgICAgICBsZXQgcmF0ZUFuYWx5c2lzU2VydmljZSA9IG5ldyBSYXRlQW5hbHlzaXNTZXJ2aWNlKCk7XHJcbiAgICAgICAgcmF0ZUFuYWx5c2lzU2VydmljZS5nZXRBcGlDYWxsKHVybCwgKGVycm9yIDogYW55LCBkYXRhOiBhbnkpID0+IHtcclxuICAgICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdFcnJvciBpbiBjcmVhdGVQcm9taXNlIGdldCBkYXRhIGZyb20gcmF0ZSBhbmFseXNpczogJytKU09OLnN0cmluZ2lmeShlcnJvcikpO1xyXG4gICAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2NyZWF0ZVByb21pc2UgZGF0YSBmcm9tIHJhdGUgYW5hbHlzaXMgc3VjY2Vzcy4nKTtcclxuICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfSkuY2F0Y2goZnVuY3Rpb24oZTphbnkpIHtcclxuICAgICAgICBsb2dnZXIuZXJyb3IoJ1Byb21pc2UgZmFpbGVkIGZvciBpbmRpdmlkdWFsICEgdXJsOicrdXJsKyAnOlxcbiBlcnJvciA6JyArSlNPTi5zdHJpbmdpZnkoZSkpO1xyXG4gICAgICAgIENDUHJvbWlzZS5yZWplY3QoZSk7XHJcbiAgICAgIH0pO1xyXG4gICB9XHJcblxyXG4gIGdldENvc3RIZWFkc0Zyb21SYXRlQW5hbHlzaXMoY29zdEhlYWRzUmF0ZUFuYWx5c2lzOiBhbnksIGNhdGVnb3JpZXNSYXRlQW5hbHlzaXM6IGFueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdvcmtJdGVtc1JhdGVBbmFseXNpczogYW55LCByYXRlSXRlbXNSYXRlQW5hbHlzaXM6IGFueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRzUmF0ZUFuYWx5c2lzOiBhbnksIG5vdGVzUmF0ZUFuYWx5c2lzOiBhbnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWlsZGluZ0Nvc3RIZWFkczogQXJyYXk8Q29zdEhlYWQ+KSB7XHJcbiAgICBsb2dnZXIuaW5mbygnZ2V0Q29zdEhlYWRzRnJvbVJhdGVBbmFseXNpcyBoYXMgYmVlbiBoaXQuJyk7XHJcbiAgICBmb3IgKGxldCBjb3N0SGVhZEluZGV4ID0gMDsgY29zdEhlYWRJbmRleCA8IGNvc3RIZWFkc1JhdGVBbmFseXNpcy5sZW5ndGg7IGNvc3RIZWFkSW5kZXgrKykge1xyXG5cclxuICAgICAgbGV0IGNvc3RIZWFkID0gbmV3IENvc3RIZWFkKCk7XHJcbiAgICAgIGNvc3RIZWFkLm5hbWUgPSBjb3N0SGVhZHNSYXRlQW5hbHlzaXNbY29zdEhlYWRJbmRleF0uQzI7XHJcbiAgICAgIGxldCBjb25maWdDb3N0SGVhZHMgPSBjb25maWcuZ2V0KCdjb3N0SGVhZHMnKTtcclxuICAgICAgbGV0IGNhdGVnb3JpZXM9IG5ldyBBcnJheTxDYXRlZ29yeT4oKTtcclxuXHJcbiAgICAgIGlmKGNvbmZpZ0Nvc3RIZWFkcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgZm9yKGxldCBjb25maWdDb3N0SGVhZCBvZiBjb25maWdDb3N0SGVhZHMpIHtcclxuICAgICAgICAgIGlmKGNvbmZpZ0Nvc3RIZWFkLm5hbWUgPT09IGNvc3RIZWFkLm5hbWUpIHtcclxuICAgICAgICAgICAgY29zdEhlYWQucHJpb3JpdHlJZCA9IGNvbmZpZ0Nvc3RIZWFkLnByaW9yaXR5SWQ7XHJcbiAgICAgICAgICAgIGNhdGVnb3JpZXMgPSBjb25maWdDb3N0SGVhZC5jYXRlZ29yaWVzO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBjb3N0SGVhZC5yYXRlQW5hbHlzaXNJZCA9IGNvc3RIZWFkc1JhdGVBbmFseXNpc1tjb3N0SGVhZEluZGV4XS5DMTtcclxuXHJcbiAgICAgIGxldCBjYXRlZ29yaWVzUmF0ZUFuYWx5c2lzU1FMID0gJ1NFTEVDVCBDYXRlZ29yeS5DMSBBUyByYXRlQW5hbHlzaXNJZCwgQ2F0ZWdvcnkuQzIgQVMgbmFtZScgK1xyXG4gICAgICAgICcgRlJPTSA/IEFTIENhdGVnb3J5IHdoZXJlIENhdGVnb3J5LkMzID0gJyArIGNvc3RIZWFkLnJhdGVBbmFseXNpc0lkO1xyXG5cclxuICAgICAgbGV0IGNhdGVnb3JpZXNCeUNvc3RIZWFkID0gYWxhc3FsKGNhdGVnb3JpZXNSYXRlQW5hbHlzaXNTUUwsIFtjYXRlZ29yaWVzUmF0ZUFuYWx5c2lzXSk7XHJcbiAgICAgIGxldCBidWlsZGluZ0NhdGVnb3JpZXM6IEFycmF5PENhdGVnb3J5PiA9IG5ldyBBcnJheTxDYXRlZ29yeT4oKTtcclxuXHJcbiAgICAgIGlmKGNhdGVnb3JpZXNCeUNvc3RIZWFkLmxlbmd0aCA9PT0gMCApIHtcclxuICAgICAgICB0aGlzLmdldFdvcmtJdGVtc1dpdGhvdXRDYXRlZ29yeUZyb21SYXRlQW5hbHlzaXMoY29zdEhlYWQucmF0ZUFuYWx5c2lzSWQsIHdvcmtJdGVtc1JhdGVBbmFseXNpcyxcclxuICAgICAgICAgIHJhdGVJdGVtc1JhdGVBbmFseXNpcywgdW5pdHNSYXRlQW5hbHlzaXMsIG5vdGVzUmF0ZUFuYWx5c2lzLCBidWlsZGluZ0NhdGVnb3JpZXMsIGNhdGVnb3JpZXMpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuZ2V0Q2F0ZWdvcmllc0Zyb21SYXRlQW5hbHlzaXMoY2F0ZWdvcmllc0J5Q29zdEhlYWQsIHdvcmtJdGVtc1JhdGVBbmFseXNpcyxcclxuICAgICAgICAgIHJhdGVJdGVtc1JhdGVBbmFseXNpcywgdW5pdHNSYXRlQW5hbHlzaXMsIG5vdGVzUmF0ZUFuYWx5c2lzLCBidWlsZGluZ0NhdGVnb3JpZXMsIGNhdGVnb3JpZXMpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb3N0SGVhZC5jYXRlZ29yaWVzID0gYnVpbGRpbmdDYXRlZ29yaWVzO1xyXG4gICAgICBjb3N0SGVhZC50aHVtYlJ1bGVSYXRlID0gY29uZmlnLmdldChDb25zdGFudHMuVEhVTUJSVUxFX1JBVEUpO1xyXG4gICAgICBidWlsZGluZ0Nvc3RIZWFkcy5wdXNoKGNvc3RIZWFkKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldENhdGVnb3JpZXNGcm9tUmF0ZUFuYWx5c2lzKGNhdGVnb3JpZXNCeUNvc3RIZWFkOiBhbnksIHdvcmtJdGVtc1JhdGVBbmFseXNpczogYW55LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJhdGVJdGVtc1JhdGVBbmFseXNpczogYW55LCB1bml0c1JhdGVBbmFseXNpczogYW55LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vdGVzUmF0ZUFuYWx5c2lzOiBhbnksIGJ1aWxkaW5nQ2F0ZWdvcmllczogQXJyYXk8Q2F0ZWdvcnk+LCBjb25maWdDYXRlZ29yaWVzOiBBcnJheTxDYXRlZ29yeT4pIHtcclxuXHJcbiAgICBsb2dnZXIuaW5mbygnZ2V0Q2F0ZWdvcmllc0Zyb21SYXRlQW5hbHlzaXMgaGFzIGJlZW4gaGl0LicpO1xyXG5cclxuICAgIGZvciAobGV0IGNhdGVnb3J5SW5kZXggPSAwOyBjYXRlZ29yeUluZGV4IDwgY2F0ZWdvcmllc0J5Q29zdEhlYWQubGVuZ3RoOyBjYXRlZ29yeUluZGV4KyspIHtcclxuXHJcbiAgICAgIGxldCBjYXRlZ29yeSA9IG5ldyBDYXRlZ29yeShjYXRlZ29yaWVzQnlDb3N0SGVhZFtjYXRlZ29yeUluZGV4XS5uYW1lLCBjYXRlZ29yaWVzQnlDb3N0SGVhZFtjYXRlZ29yeUluZGV4XS5yYXRlQW5hbHlzaXNJZCk7XHJcbiAgICAgIGxldCBjb25maWdXb3JrSXRlbXMgPSBuZXcgQXJyYXk8V29ya0l0ZW0+KCk7XHJcblxyXG4gICAgICBpZihjb25maWdDYXRlZ29yaWVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBmb3IgKGxldCBjb25maWdDYXRlZ29yeSBvZiBjb25maWdDYXRlZ29yaWVzKSB7XHJcbiAgICAgICAgICBpZihjb25maWdDYXRlZ29yeS5uYW1lID09PSBjYXRlZ29yaWVzQnlDb3N0SGVhZFtjYXRlZ29yeUluZGV4XS5uYW1lKSB7XHJcbiAgICAgICAgICAgIGNvbmZpZ1dvcmtJdGVtcyA9IGNvbmZpZ0NhdGVnb3J5LndvcmtJdGVtcztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCB3b3JrSXRlbXNSYXRlQW5hbHlzaXNTUUwgPSAnU0VMRUNUIHdvcmtJdGVtLkMyIEFTIHJhdGVBbmFseXNpc0lkLCB3b3JrSXRlbS5DMyBBUyBuYW1lJyArXHJcbiAgICAgICAgJyBGUk9NID8gQVMgd29ya0l0ZW0gd2hlcmUgd29ya0l0ZW0uQzQgPSAnICsgY2F0ZWdvcmllc0J5Q29zdEhlYWRbY2F0ZWdvcnlJbmRleF0ucmF0ZUFuYWx5c2lzSWQ7XHJcblxyXG4gICAgICBsZXQgd29ya0l0ZW1zQnlDYXRlZ29yeSA9IGFsYXNxbCh3b3JrSXRlbXNSYXRlQW5hbHlzaXNTUUwsIFt3b3JrSXRlbXNSYXRlQW5hbHlzaXNdKTtcclxuICAgICAgbGV0IGJ1aWxkaW5nV29ya0l0ZW1zOiBBcnJheTxXb3JrSXRlbT4gPSBuZXcgQXJyYXk8V29ya0l0ZW0+KCk7XHJcblxyXG4gICAgICB0aGlzLmdldFdvcmtJdGVtc0Zyb21SYXRlQW5hbHlzaXMod29ya0l0ZW1zQnlDYXRlZ29yeSwgcmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzLFxyXG4gICAgICAgIHVuaXRzUmF0ZUFuYWx5c2lzLCBub3Rlc1JhdGVBbmFseXNpcywgYnVpbGRpbmdXb3JrSXRlbXMsIGNvbmZpZ1dvcmtJdGVtcyk7XHJcblxyXG4gICAgICBjYXRlZ29yeS53b3JrSXRlbXMgPSBidWlsZGluZ1dvcmtJdGVtcztcclxuICAgICAgYnVpbGRpbmdDYXRlZ29yaWVzLnB1c2goY2F0ZWdvcnkpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0V29ya0l0ZW1zV2l0aG91dENhdGVnb3J5RnJvbVJhdGVBbmFseXNpcyggY29zdEhlYWRSYXRlQW5hbHlzaXNJZDogbnVtYmVyLCB3b3JrSXRlbXNSYXRlQW5hbHlzaXM6IGFueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzOiBhbnksIHVuaXRzUmF0ZUFuYWx5c2lzOiBhbnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vdGVzUmF0ZUFuYWx5c2lzOiBhbnksIGJ1aWxkaW5nQ2F0ZWdvcmllczogQXJyYXk8Q2F0ZWdvcnk+LCBjb25maWdDYXRlZ29yaWVzOiBBcnJheTxDYXRlZ29yeT4pIHtcclxuXHJcbiAgICAgIGxvZ2dlci5pbmZvKCdnZXRXb3JrSXRlbXNXaXRob3V0Q2F0ZWdvcnlGcm9tUmF0ZUFuYWx5c2lzIGhhcyBiZWVuIGhpdC4nKTtcclxuXHJcbiAgICAgIGxldCB3b3JrSXRlbXNXaXRob3V0Q2F0ZWdvcmllc1JhdGVBbmFseXNpc1NRTCA9ICdTRUxFQ1Qgd29ya0l0ZW0uQzIgQVMgcmF0ZUFuYWx5c2lzSWQsIHdvcmtJdGVtLkMzIEFTIG5hbWUnICtcclxuICAgICAgICAnIEZST00gPyBBUyB3b3JrSXRlbSB3aGVyZSBOT1Qgd29ya0l0ZW0uQzQgQU5EIHdvcmtJdGVtLkMxID0gJytjb3N0SGVhZFJhdGVBbmFseXNpc0lkO1xyXG4gICAgICBsZXQgd29ya0l0ZW1zV2l0aG91dENhdGVnb3JpZXMgPSBhbGFzcWwod29ya0l0ZW1zV2l0aG91dENhdGVnb3JpZXNSYXRlQW5hbHlzaXNTUUwsIFt3b3JrSXRlbXNSYXRlQW5hbHlzaXNdKTtcclxuXHJcbiAgICAgIGxldCBidWlsZGluZ1dvcmtJdGVtczogQXJyYXk8V29ya0l0ZW0+ID0gbmV3IEFycmF5PFdvcmtJdGVtPigpO1xyXG4gICAgICBsZXQgY2F0ZWdvcnkgPSBuZXcgQ2F0ZWdvcnkoJ2RlZmF1bHQnLCAwKTtcclxuICAgICAgbGV0IGNvbmZpZ1dvcmtJdGVtcyA9IG5ldyBBcnJheTxXb3JrSXRlbT4oKTtcclxuXHJcbiAgICAgIGlmKGNvbmZpZ0NhdGVnb3JpZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGZvciAobGV0IGNvbmZpZ0NhdGVnb3J5IG9mIGNvbmZpZ0NhdGVnb3JpZXMpIHtcclxuICAgICAgICAgIGlmKGNvbmZpZ0NhdGVnb3J5Lm5hbWUgPT09ICdkZWZhdWx0Jykge1xyXG4gICAgICAgICAgICBjb25maWdXb3JrSXRlbXMgPSBjb25maWdDYXRlZ29yeS53b3JrSXRlbXM7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuZ2V0V29ya0l0ZW1zRnJvbVJhdGVBbmFseXNpcyh3b3JrSXRlbXNXaXRob3V0Q2F0ZWdvcmllcywgcmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzLFxyXG4gICAgICAgIHVuaXRzUmF0ZUFuYWx5c2lzLCBub3Rlc1JhdGVBbmFseXNpcywgYnVpbGRpbmdXb3JrSXRlbXMsIGNvbmZpZ1dvcmtJdGVtcyk7XHJcblxyXG4gICAgICBjYXRlZ29yeS53b3JrSXRlbXMgPSBidWlsZGluZ1dvcmtJdGVtcztcclxuICAgICAgYnVpbGRpbmdDYXRlZ29yaWVzLnB1c2goY2F0ZWdvcnkpO1xyXG4gIH1cclxuXHJcbiAgZ2V0V29ya0l0ZW1zRnJvbVJhdGVBbmFseXNpcyh3b3JrSXRlbXNCeUNhdGVnb3J5OiBhbnksIHJhdGVJdGVtc1JhdGVBbmFseXNpczogYW55LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdHNSYXRlQW5hbHlzaXM6IGFueSwgbm90ZXNSYXRlQW5hbHlzaXM6IGFueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1aWxkaW5nV29ya0l0ZW1zOiBBcnJheTxXb3JrSXRlbT4sIGNvbmZpZ1dvcmtJdGVtcyA6ICBBcnJheTxhbnk+KSB7XHJcblxyXG4gICAgbG9nZ2VyLmluZm8oJ2dldFdvcmtJdGVtc0Zyb21SYXRlQW5hbHlzaXMgaGFzIGJlZW4gaGl0LicpO1xyXG5cclxuICAgIGZvciAobGV0IHdvcmtJdGVtSW5kZXggPSAwOyB3b3JrSXRlbUluZGV4IDwgd29ya0l0ZW1zQnlDYXRlZ29yeS5sZW5ndGg7IHdvcmtJdGVtSW5kZXgrKykge1xyXG5cclxuICAgICAgbGV0IHdvcmtJdGVtID0gbmV3IFdvcmtJdGVtKHdvcmtJdGVtc0J5Q2F0ZWdvcnlbd29ya0l0ZW1JbmRleF0ubmFtZSxcclxuICAgICAgICB3b3JrSXRlbXNCeUNhdGVnb3J5W3dvcmtJdGVtSW5kZXhdLnJhdGVBbmFseXNpc0lkKTtcclxuXHJcbiAgICAgIGlmKGNvbmZpZ1dvcmtJdGVtcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgZm9yKGxldCBjb25maWdXb3JrSXRlbSBvZiBjb25maWdXb3JrSXRlbXMpIHtcclxuICAgICAgICAgIGlmKGNvbmZpZ1dvcmtJdGVtLm5hbWUgPT09IHdvcmtJdGVtc0J5Q2F0ZWdvcnlbd29ya0l0ZW1JbmRleF0ubmFtZSkge1xyXG4gICAgICAgICAgICB3b3JrSXRlbS51bml0ID0gY29uZmlnV29ya0l0ZW0ubWVhc3VyZW1lbnRVbml0O1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IHJhdGVJdGVtc1JhdGVBbmFseXNpc1NRTCA9ICdTRUxFQ1QgcmF0ZUl0ZW0uQzIgQVMgaXRlbU5hbWUsIHJhdGVJdGVtLkMyIEFTIG9yaWdpbmFsSXRlbU5hbWUsJyArXHJcbiAgICAgICAgJ3JhdGVJdGVtLkMxMiBBUyByYXRlQW5hbHlzaXNJZCwgcmF0ZUl0ZW0uQzYgQVMgdHlwZSwnICtcclxuICAgICAgICAnUk9VTkQocmF0ZUl0ZW0uQzcsMikgQVMgcXVhbnRpdHksIFJPVU5EKHJhdGVJdGVtLkMzLDIpIEFTIHJhdGUsIHVuaXQuQzIgQVMgdW5pdCwnICtcclxuICAgICAgICAnUk9VTkQocmF0ZUl0ZW0uQzMgKiByYXRlSXRlbS5DNywyKSBBUyB0b3RhbEFtb3VudCwgcmF0ZUl0ZW0uQzUgQVMgdG90YWxRdWFudGl0eSwgIHJhdGVJdGVtLkMxMyBBUyBub3Rlc1JhdGVBbmFseXNpc0lkICcgK1xyXG4gICAgICAgICdGUk9NID8gQVMgcmF0ZUl0ZW0gSk9JTiA/IEFTIHVuaXQgT04gdW5pdC5DMSA9IHJhdGVJdGVtLkM5IHdoZXJlIHJhdGVJdGVtLkMxID0gJ1xyXG4gICAgICAgICsgd29ya0l0ZW1zQnlDYXRlZ29yeVt3b3JrSXRlbUluZGV4XS5yYXRlQW5hbHlzaXNJZDtcclxuICAgICAgbGV0IHJhdGVJdGVtc0J5V29ya0l0ZW0gPSBhbGFzcWwocmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzU1FMLCBbcmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzLCB1bml0c1JhdGVBbmFseXNpc10pO1xyXG5cclxuICAgICAgLy9UT0RPIDogUmVtb3ZlIEhhcmRDb2RpbmcgZm9yIG5vdGVzIEFQSVxyXG4gICAgICBsZXQgbm90ZXNSYXRlQW5hbHlzaXNTUUwgPSAnU0VMRUNUIG5vdGVzLkMyIEFTIG5vdGVzLCBub3Rlcy5DMyBBUyBpbWFnZVVSTCBGUk9NID8gQVMgbm90ZXMgd2hlcmUgbm90ZXMuQzEgPSAnK1xyXG4gICAgICAgIHJhdGVJdGVtc0J5V29ya0l0ZW1bMF0ubm90ZXNSYXRlQW5hbHlzaXNJZDtcclxuICAgICAgLy8rIHJhdGVJdGVtc0J5V29ya0l0ZW1bbm90ZXNJbmRleF0ubm90ZXNJZDtcclxuICAgICAgbGV0IG5vdGVzTGlzdCA9IGFsYXNxbChub3Rlc1JhdGVBbmFseXNpc1NRTCwgW25vdGVzUmF0ZUFuYWx5c2lzXSk7XHJcblxyXG4gICAgICB3b3JrSXRlbS5yYXRlLnJhdGVJdGVtcyA9IHJhdGVJdGVtc0J5V29ya0l0ZW07XHJcbiAgICAgIHdvcmtJdGVtLnJhdGUucXVhbnRpdHkgPSByYXRlSXRlbXNCeVdvcmtJdGVtWzBdLnRvdGFsUXVhbnRpdHk7XHJcbiAgICAgIHdvcmtJdGVtLnJhdGUuaXNFc3RpbWF0ZWQgPSBmYWxzZTtcclxuICAgICAgd29ya0l0ZW0ucmF0ZS5ub3RlcyA9IG5vdGVzTGlzdFswXS5ub3RlcztcclxuICAgICAgd29ya0l0ZW0ucmF0ZS5pbWFnZVVSTCA9IG5vdGVzTGlzdFswXS5pbWFnZVVSTDtcclxuXHJcbiAgICAgIC8vU3lzdGVtIHJhdGVcclxuXHJcbiAgICAgIHdvcmtJdGVtLnN5c3RlbVJhdGUucmF0ZUl0ZW1zID0gcmF0ZUl0ZW1zQnlXb3JrSXRlbTtcclxuICAgICAgd29ya0l0ZW0uc3lzdGVtUmF0ZS5xdWFudGl0eSA9IHJhdGVJdGVtc0J5V29ya0l0ZW1bMF0udG90YWxRdWFudGl0eTtcclxuICAgICAgd29ya0l0ZW0uc3lzdGVtUmF0ZS5ub3RlcyA9IG5vdGVzTGlzdFswXS5ub3RlcztcclxuICAgICAgd29ya0l0ZW0uc3lzdGVtUmF0ZS5pbWFnZVVSTCA9IG5vdGVzTGlzdFswXS5pbWFnZVVSTDtcclxuXHJcblxyXG4gICAgICBidWlsZGluZ1dvcmtJdGVtcy5wdXNoKHdvcmtJdGVtKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcblxyXG5cclxuT2JqZWN0LnNlYWwoUmF0ZUFuYWx5c2lzU2VydmljZSk7XHJcbmV4cG9ydCA9IFJhdGVBbmFseXNpc1NlcnZpY2U7XHJcbiJdfQ==
