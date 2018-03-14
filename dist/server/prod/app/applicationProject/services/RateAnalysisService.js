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
                        var sql2 = 'SELECT rate.C1 AS rateAnalysisId, rate.C2 AS item,ROUND(rate.C7,2) AS quantity,ROUND(rate.C3,2) AS rate,' +
                            ' ROUND(rate.C3*rate.C7,2) AS totalAmount, rate.C6 type, unit.C2 As unit FROM ? AS rate JOIN ? AS unit ON unit.C1 = rate.C9' +
                            '  WHERE rate.C1 = ' + workItemId;
                        var sql3 = 'SELECT SUM(rate.C3*rate.C7) / SUM(rate.C7) AS total  FROM ? AS rate JOIN ? AS unit ON unit.C1 = rate.C9' +
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
        var costHeadURL = config.get(Constants.RATE_ANALYSIS_API + entity + Constants.RATE_ANALYSIS_COSTHEADS);
        var costHeadRateAnalysisPromise = this.createPromise(costHeadURL);
        var categoryURL = config.get(Constants.RATE_ANALYSIS_API + entity + Constants.RATE_ANALYSIS_CATEGORIES);
        var categoryRateAnalysisPromise = this.createPromise(categoryURL);
        var workItemURL = config.get(Constants.RATE_ANALYSIS_API + entity + Constants.RATE_ANALYSIS_WORKITEMS);
        var workItemRateAnalysisPromise = this.createPromise(workItemURL);
        var rateItemURL = config.get(Constants.RATE_ANALYSIS_API + entity + Constants.RATE_ANALYSIS_RATE);
        var rateItemRateAnalysisPromise = this.createPromise(rateItemURL);
        var rateAnalysisNotesURL = config.get(Constants.RATE_ANALYSIS_API + entity + Constants.RATE_ANALYSIS_NOTES);
        var notesRateAnalysisPromise = this.createPromise(rateAnalysisNotesURL);
        var allUnitsFromRateAnalysisURL = config.get(Constants.RATE_ANALYSIS_API + entity + Constants.RATE_ANALYSIS_UNIT);
        var unitsRateAnalysisPromise = this.createPromise(allUnitsFromRateAnalysisURL);
        Promise.all([
            costHeadRateAnalysisPromise,
            categoryRateAnalysisPromise,
            workItemRateAnalysisPromise,
            rateItemRateAnalysisPromise,
            notesRateAnalysisPromise,
            unitsRateAnalysisPromise
        ]).then(function (data) {
            var costHeadsRateAnalysis = data[0][Constants.RATE_ANALYSIS_ITEM_TYPE];
            var categoriesRateAnalysis = data[1][Constants.RATE_ANALYSIS_SUBITEM_TYPE];
            var workItemsRateAnalysis = data[2][Constants.RATE_ANALYSIS_ITEMS];
            var rateItemsRateAnalysis = data[3][Constants.RATE_ANALYSIS_DATA];
            var notesRateAnalysis = data[4][Constants.RATE_ANALYSIS_DATA];
            var unitsRateAnalysis = data[5][Constants.RATE_ANALYSIS_UOM];
            var buildingCostHeads = [];
            var rateAnalysisService = new RateAnalysisService();
            rateAnalysisService.getCostHeadsFromRateAnalysis(costHeadsRateAnalysis, categoriesRateAnalysis, workItemsRateAnalysis, rateItemsRateAnalysis, unitsRateAnalysis, notesRateAnalysis, buildingCostHeads);
            callback(null, buildingCostHeads);
        });
    };
    RateAnalysisService.prototype.createPromise = function (url) {
        return new Promise(function (resolve, reject) {
            var rateAnalysisService = new RateAnalysisService();
            rateAnalysisService.getApiCall(url, function (error, data) {
                if (error) {
                    console.log('Error in promise : ' + error);
                    reject(error);
                }
                else {
                    console.log('data from rate analysis : ' + data);
                    resolve(data);
                }
            });
        });
    };
    RateAnalysisService.prototype.getCostHeadsFromRateAnalysis = function (costHeadsRateAnalysis, categoriesRateAnalysis, workItemsRateAnalysis, rateItemsRateAnalysis, unitsRateAnalysis, notesRateAnalysis, buildingCostHeads) {
        for (var costHeadIndex = 0; costHeadIndex < costHeadsRateAnalysis.length; costHeadIndex++) {
            var costHead = new CostHead();
            costHead.name = costHeadsRateAnalysis[costHeadIndex].C2;
            costHead.rateAnalysisId = costHeadsRateAnalysis[costHeadIndex].C1;
            var categoriesRateAnalysisSQL = 'SELECT Category.C1 AS rateAnalysisId, Category.C2 AS name' +
                ' FROM ? AS Category where Category.C3 = ' + costHead.rateAnalysisId;
            var categoriesByCostHead = alasql(categoriesRateAnalysisSQL, [categoriesRateAnalysis]);
            var buildingCategories = new Array();
            if (categoriesByCostHead.length === 0) {
                this.getWorkItemsWithoutCategoryFromRateAnalysis(costHead.rateAnalysisId, workItemsRateAnalysis, rateItemsRateAnalysis, unitsRateAnalysis, notesRateAnalysis, buildingCategories);
            }
            else {
                this.getCategoriesFromRateAnalysis(categoriesByCostHead, workItemsRateAnalysis, rateItemsRateAnalysis, unitsRateAnalysis, notesRateAnalysis, buildingCategories);
            }
            costHead.categories = buildingCategories;
            costHead.thumbRuleRate = config.get(Constants.THUMBRULE_RATE);
            buildingCostHeads.push(costHead);
        }
    };
    RateAnalysisService.prototype.getCategoriesFromRateAnalysis = function (categoriesByCostHead, workItemsRateAnalysis, rateItemsRateAnalysis, unitsRateAnalysis, notesRateAnalysis, buildingCategories) {
        for (var categoryIndex = 0; categoryIndex < categoriesByCostHead.length; categoryIndex++) {
            var category = new Category(categoriesByCostHead[categoryIndex].name, categoriesByCostHead[categoryIndex].rateAnalysisId);
            var workItemsRateAnalysisSQL = 'SELECT workItem.C2 AS rateAnalysisId, workItem.C3 AS name' +
                ' FROM ? AS workItem where workItem.C4 = ' + categoriesByCostHead[categoryIndex].rateAnalysisId;
            var workItemsByCategory = alasql(workItemsRateAnalysisSQL, [workItemsRateAnalysis]);
            var buildingWorkItems = new Array();
            this.getWorkItemsFromRateAnalysis(workItemsByCategory, rateItemsRateAnalysis, unitsRateAnalysis, notesRateAnalysis, buildingWorkItems);
            category.workItems = buildingWorkItems;
            buildingCategories.push(category);
        }
    };
    RateAnalysisService.prototype.getWorkItemsWithoutCategoryFromRateAnalysis = function (costHeadRateAnalysisId, workItemsRateAnalysis, rateItemsRateAnalysis, unitsRateAnalysis, notesRateAnalysis, buildingCategories) {
        var workItemsWithoutCategoriesRateAnalysisSQL = 'SELECT workItem.C2 AS rateAnalysisId, workItem.C3 AS name' +
            ' FROM ? AS workItem where NOT workItem.C4 AND workItem.C1 = ' + costHeadRateAnalysisId;
        var workItemsWithoutCategories = alasql(workItemsWithoutCategoriesRateAnalysisSQL, [workItemsRateAnalysis]);
        var buildingWorkItems = new Array();
        var category = new Category('default', 0);
        this.getWorkItemsFromRateAnalysis(workItemsWithoutCategories, rateItemsRateAnalysis, unitsRateAnalysis, notesRateAnalysis, buildingWorkItems);
        category.workItems = buildingWorkItems;
        buildingCategories.push(category);
    };
    RateAnalysisService.prototype.getWorkItemsFromRateAnalysis = function (workItemsByCategory, rateItemsRateAnalysis, unitsRateAnalysis, notesRateAnalysis, buildingWorkItems) {
        for (var workItemIndex = 0; workItemIndex < workItemsByCategory.length; workItemIndex++) {
            var workItem = new WorkItem(workItemsByCategory[workItemIndex].name, workItemsByCategory[workItemIndex].rateAnalysisId);
            var rateItemsRateAnalysisSQL = 'SELECT rateItem.C2 AS item, rateItem.C12 AS rateAnalysisId, rateItem.C6 AS type,' +
                'ROUND(rateItem.C7,2) AS quantity, ROUND(rateItem.C3,2) AS rate, unit.C2 AS unit,' +
                'ROUND(rateItem.C3 * rateItem.C7,2) AS totalAmount, rateItem.C5 AS totalQuantity ' +
                'FROM ? AS rateItem JOIN ? AS unit ON unit.C1 = rateItem.C9 where rateItem.C1 = '
                + workItemsByCategory[workItemIndex].rateAnalysisId;
            var rateItemsByWorkItem = alasql(rateItemsRateAnalysisSQL, [rateItemsRateAnalysis, unitsRateAnalysis]);
            var notesRateAnalysisSQL = 'SELECT notes.C2 AS notes, notes.C3 AS imageURL FROM ? AS notes where notes.C1 = 49';
            var notesList = alasql(notesRateAnalysisSQL, [notesRateAnalysis]);
            workItem.rate.rateItems = rateItemsByWorkItem;
            workItem.rate.quantity = rateItemsByWorkItem[0].totalQuantity;
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHBsaWNhdGlvblByb2plY3Qvc2VydmljZXMvUmF0ZUFuYWx5c2lzU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsb0VBQXVFO0FBQ3ZFLGtFQUFxRTtBQUVyRSw4RUFBaUY7QUFDakYsMEVBQTZFO0FBQzdFLHdFQUEyRTtBQUMzRSxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDakMsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixJQUFJLE1BQU0sR0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFDckQsK0JBQWtDO0FBQ2xDLGdFQUFtRTtBQUNuRSx3RUFBMkU7QUFDM0Usd0VBQTJFO0FBQzNFLCtDQUFrRDtBQUVsRDtJQU1FO1FBQ0UsSUFBSSxDQUFDLFFBQVEsR0FBRyxZQUFZLENBQUMsUUFBUSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxlQUFlLEVBQUUsQ0FBQztRQUM3QyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7SUFDdkMsQ0FBQztJQUVELDBDQUFZLEdBQVosVUFBYyxHQUFXLEVBQUUsSUFBVSxFQUFFLFFBQTJDO1FBQ2hGLE1BQU0sQ0FBQyxJQUFJLENBQUMsa0RBQWtELENBQUMsQ0FBQztRQUNoRSxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUMsR0FBRyxFQUFFLEdBQUcsRUFBQyxFQUFFLFVBQVUsS0FBVSxFQUFFLFFBQWEsRUFBRSxJQUFTO1lBQ3BFLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ1YsUUFBUSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN4QixDQUFDO1lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxJ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QUFDLENBQUMsUUFBUSxDQUFDO1lBRXJELGlCQUFpQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNuQyxDQUFDO0lBQ0gsQ0FBQztJQUNILDBCQUFDO0FBQUQsQ0FoU0EsQUFnU0MsSUFBQTtBQUlELE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUNqQyxpQkFBUyxtQkFBbUIsQ0FBQyIsImZpbGUiOiJhcHAvYXBwbGljYXRpb25Qcm9qZWN0L3NlcnZpY2VzL1JhdGVBbmFseXNpc1NlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVXNlclNlcnZpY2UgPSByZXF1aXJlKCcuLy4uLy4uL2ZyYW1ld29yay9zZXJ2aWNlcy9Vc2VyU2VydmljZScpO1xyXG5pbXBvcnQgUHJvamVjdEFzc2V0ID0gcmVxdWlyZSgnLi4vLi4vZnJhbWV3b3JrL3NoYXJlZC9wcm9qZWN0YXNzZXQnKTtcclxuaW1wb3J0IFVzZXIgPSByZXF1aXJlKCcuLi8uLi9mcmFtZXdvcmsvZGF0YWFjY2Vzcy9tb25nb29zZS91c2VyJyk7XHJcbmltcG9ydCBBdXRoSW50ZXJjZXB0b3IgPSByZXF1aXJlKCcuLi8uLi9mcmFtZXdvcmsvaW50ZXJjZXB0b3IvYXV0aC5pbnRlcmNlcHRvcicpO1xyXG5pbXBvcnQgQ29zdENvbnRyb2xsRXhjZXB0aW9uID0gcmVxdWlyZSgnLi4vZXhjZXB0aW9uL0Nvc3RDb250cm9sbEV4Y2VwdGlvbicpO1xyXG5pbXBvcnQgV29ya0l0ZW0gPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3Byb2plY3QvYnVpbGRpbmcvV29ya0l0ZW0nKTtcclxubGV0IHJlcXVlc3QgPSByZXF1aXJlKCdyZXF1ZXN0Jyk7XHJcbmxldCBjb25maWcgPSByZXF1aXJlKCdjb25maWcnKTtcclxudmFyIGxvZzRqcyA9IHJlcXVpcmUoJ2xvZzRqcycpO1xyXG52YXIgbG9nZ2VyPWxvZzRqcy5nZXRMb2dnZXIoJ1JhdGUgQW5hbHlzaXMgU2VydmljZScpO1xyXG5pbXBvcnQgYWxhc3FsID0gcmVxdWlyZSgnYWxhc3FsJyk7XHJcbmltcG9ydCBSYXRlID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L2J1aWxkaW5nL1JhdGUnKTtcclxuaW1wb3J0IENvc3RIZWFkID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L2J1aWxkaW5nL0Nvc3RIZWFkJyk7XHJcbmltcG9ydCBDYXRlZ29yeSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9idWlsZGluZy9DYXRlZ29yeScpO1xyXG5pbXBvcnQgQ29uc3RhbnRzID0gcmVxdWlyZSgnLi4vc2hhcmVkL2NvbnN0YW50cycpO1xyXG5cclxuY2xhc3MgUmF0ZUFuYWx5c2lzU2VydmljZSB7XHJcbiAgQVBQX05BTUU6IHN0cmluZztcclxuICBjb21wYW55X25hbWU6IHN0cmluZztcclxuICBwcml2YXRlIGF1dGhJbnRlcmNlcHRvcjogQXV0aEludGVyY2VwdG9yO1xyXG4gIHByaXZhdGUgdXNlclNlcnZpY2U6IFVzZXJTZXJ2aWNlO1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuQVBQX05BTUUgPSBQcm9qZWN0QXNzZXQuQVBQX05BTUU7XHJcbiAgICB0aGlzLmF1dGhJbnRlcmNlcHRvciA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcclxuICAgIHRoaXMudXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICB9XHJcblxyXG4gIGdldENvc3RIZWFkcyggdXJsOiBzdHJpbmcsIHVzZXI6IFVzZXIsIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdSYXRlIEFuYWx5c2lzIFNlcnZpY2UsIGdldENvc3RIZWFkcyBoYXMgYmVlbiBoaXQnKTtcclxuICAgIHJlcXVlc3QuZ2V0KHt1cmw6IHVybH0sIGZ1bmN0aW9uIChlcnJvcjogYW55LCByZXNwb25zZTogYW55LCBib2R5OiBhbnkpIHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2UgaWYgKCFlcnJvciAmJiByZXNwb25zZSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdSRVNQT05TRSBKU09OIDogJyArIEpTT04uc3RyaW5naWZ5KEpTT04ucGFyc2UoYm9keSkpKTtcclxuICAgICAgICBsZXQgcmVzID0gSlNPTi5wYXJzZShib2R5KTtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCByZXMpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldFdvcmtJdGVtcyggdXJsOiBzdHJpbmcsIHVzZXI6IFVzZXIsIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdSYXRlIEFuYWx5c2lzIFNlcnZpY2UsIGdldFdvcmtJdGVtcyBoYXMgYmVlbiBoaXQnKTtcclxuICAgIHJlcXVlc3QuZ2V0KHt1cmw6IHVybH0sIGZ1bmN0aW9uIChlcnJvcjogYW55LCByZXNwb25zZTogYW55LCBib2R5OiBhbnkpIHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2UgaWYgKCFlcnJvciAmJiByZXNwb25zZSkge1xyXG4gICAgICAgIGxldCByZXMgPSBKU09OLnBhcnNlKGJvZHkpO1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHJlcyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0V29ya0l0ZW1zQnlDb3N0SGVhZElkKCB1cmw6IHN0cmluZyxjb3N0SGVhZElkOiBzdHJpbmcsIHVzZXI6IFVzZXIsIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxvZ2dlci5pbmZvKCdSYXRlIEFuYWx5c2lzIFNlcnZpY2UsIGdldFdvcmtJdGVtc0J5Q29zdEhlYWRJZCBoYXMgYmVlbiBoaXQnKTtcclxuICAgIGxldCB3b3JrSXRlbXMgOiBBcnJheTxXb3JrSXRlbT4gPSBbXTtcclxuICAgIHJlcXVlc3QuZ2V0KHt1cmw6IHVybH0sIGZ1bmN0aW9uIChlcnJvcjogYW55LCByZXNwb25zZTogYW55LCBib2R5OiBhbnkpIHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2UgaWYgKCFlcnJvciAmJiByZXNwb25zZSkge1xyXG4gICAgICAgIGxldCByZXMgPSBKU09OLnBhcnNlKGJvZHkpO1xyXG4gICAgICAgIGlmKHJlcykge1xyXG5cclxuICAgICAgICAgIGZvcihsZXQgd29ya2l0ZW0gb2YgcmVzLlN1Ykl0ZW1UeXBlKSB7XHJcbiAgICAgICAgICAgIGlmKHBhcnNlSW50KGNvc3RIZWFkSWQpID09PSB3b3JraXRlbS5DMykge1xyXG4gICAgICAgICAgICAgIGxldCB3b3JraXRlbURldGFpbHMgPSBuZXcgV29ya0l0ZW0od29ya2l0ZW0uQzIsIHdvcmtpdGVtLkMxKTtcclxuICAgICAgICAgICAgICB3b3JrSXRlbXMucHVzaCh3b3JraXRlbURldGFpbHMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHdvcmtJdGVtcyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0QXBpQ2FsbCh1cmwgOiBzdHJpbmcsIGNhbGxiYWNrOihlcnJvciA6IGFueSwgcmVzcG9uc2U6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgcmVxdWVzdC5nZXQoe3VybDogdXJsfSwgZnVuY3Rpb24gKGVycm9yOiBhbnksIHJlc3BvbnNlOiBhbnksIGJvZHk6IGFueSkge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGVycm9yLm1lc3NhZ2UsIGVycm9yLnN0YWNrKSwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSBpZiAoIWVycm9yICYmIHJlc3BvbnNlKSB7XHJcbiAgICAgICAgbGV0IHJlcyA9IEpTT04ucGFyc2UoYm9keSk7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRSYXRlKHdvcmtJdGVtSWQ6IG51bWJlciwgY2FsbGJhY2s6KGVycm9yOiBhbnksIGRhdGE6YW55KSA9PiB2b2lkKSB7XHJcbiAgICBsZXQgdXJsID0gY29uZmlnLmdldCgncmF0ZUFuYWx5c2lzQVBJLnVuaXQnKTtcclxuICAgIHRoaXMuZ2V0QXBpQ2FsbCh1cmwsIChlcnJvciwgdW5pdERhdGEpID0+IHtcclxuICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH1lbHNlIHtcclxuICAgICAgICB1bml0RGF0YSA9IHVuaXREYXRhWydVT00nXTtcclxuICAgICAgICB1cmwgPSBjb25maWcuZ2V0KCdyYXRlQW5hbHlzaXNBUEkucmF0ZScpO1xyXG4gICAgICAgIHRoaXMuZ2V0QXBpQ2FsbCh1cmwsIChlcnJvciwgZGF0YSkgPT4ge1xyXG4gICAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IHJhdGUgPSBkYXRhWydSYXRlQW5hbHlzaXNEYXRhJ107XHJcbiAgICAgICAgICAgIGxldCBzcWwgPSAnU0VMRUNUIHJhdGUuQzUgQVMgcXVhbnRpdHksIHVuaXQuQzIgQXMgdW5pdCBGUk9NID8gQVMgcmF0ZSBKT0lOID8gQVMgdW5pdCBvbiB1bml0LkMxID0gIHJhdGUuQzggYW5kJyArXHJcbiAgICAgICAgICAgICAgJyByYXRlLkMxID0gJysgd29ya0l0ZW1JZDtcclxuICAgICAgICAgICAgbGV0IHNxbDIgPSAnU0VMRUNUIHJhdGUuQzEgQVMgcmF0ZUFuYWx5c2lzSWQsIHJhdGUuQzIgQVMgaXRlbSxST1VORChyYXRlLkM3LDIpIEFTIHF1YW50aXR5LFJPVU5EKHJhdGUuQzMsMikgQVMgcmF0ZSwnICtcclxuICAgICAgICAgICAgICAnIFJPVU5EKHJhdGUuQzMqcmF0ZS5DNywyKSBBUyB0b3RhbEFtb3VudCwgcmF0ZS5DNiB0eXBlLCB1bml0LkMyIEFzIHVuaXQgRlJPTSA/IEFTIHJhdGUgSk9JTiA/IEFTIHVuaXQgT04gdW5pdC5DMSA9IHJhdGUuQzknICtcclxuICAgICAgICAgICAgICAnICBXSEVSRSByYXRlLkMxID0gJysgd29ya0l0ZW1JZDtcclxuICAgICAgICAgICAgbGV0IHNxbDMgPSAnU0VMRUNUIFNVTShyYXRlLkMzKnJhdGUuQzcpIC8gU1VNKHJhdGUuQzcpIEFTIHRvdGFsICBGUk9NID8gQVMgcmF0ZSBKT0lOID8gQVMgdW5pdCBPTiB1bml0LkMxID0gcmF0ZS5DOScgK1xyXG4gICAgICAgICAgICAgICcgIFdIRVJFIHJhdGUuQzEgPSAnKyB3b3JrSXRlbUlkO1xyXG4gICAgICAgICAgICBsZXQgcXVhbnRpdHlBbmRVbml0ID0gYWxhc3FsKHNxbCwgW3JhdGUsIHVuaXREYXRhXSk7XHJcbiAgICAgICAgICAgIGxldCByYXRlUmVzdWx0IDogUmF0ZSA9IG5ldyBSYXRlKCk7XHJcbiAgICAgICAgICAgIGxldCB0b3RhbHJhdGVGcm9tUmF0ZUFuYWx5c2lzID0gYWxhc3FsKHNxbDMsIFtyYXRlLCB1bml0RGF0YV0pO1xyXG4gICAgICAgICAgICByYXRlUmVzdWx0LnF1YW50aXR5ID0gcXVhbnRpdHlBbmRVbml0WzBdLnF1YW50aXR5O1xyXG4gICAgICAgICAgICByYXRlUmVzdWx0LnVuaXQgPSBxdWFudGl0eUFuZFVuaXRbMF0udW5pdDtcclxuICAgICAgICAgICAgcmF0ZVJlc3VsdC5yYXRlRnJvbVJhdGVBbmFseXNpcyA9IHBhcnNlRmxvYXQoKHRvdGFscmF0ZUZyb21SYXRlQW5hbHlzaXNbMF0udG90YWwpLnRvRml4ZWQoMikpO1xyXG4gICAgICAgICAgICByYXRlID0gYWxhc3FsKHNxbDIsIFtyYXRlLCB1bml0RGF0YV0pO1xyXG4gICAgICAgICAgICByYXRlUmVzdWx0LnJhdGVJdGVtcyA9IHJhdGU7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJhdGVSZXN1bHQpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvL1RPRE8gOiBEZWxldGUgQVBJJ3MgcmVsYXRlZCB0byB3b3JraXRlbXMgYWRkLCBkZWxlZXQsIGdldCBsaXN0LlxyXG4gIGdldFdvcmtpdGVtTGlzdChjb3N0SGVhZElkOiBudW1iZXIsY2F0ZWdvcnlJZDogbnVtYmVyLCBjYWxsYmFjazooZXJyb3I6IGFueSwgZGF0YTphbnkpID0+IHZvaWQpIHtcclxuICAgIGxldCB1cmwgPSBjb25maWcuZ2V0KCdyYXRlQW5hbHlzaXNBUEkud29ya2l0ZW0nKTtcclxuICAgIHRoaXMuZ2V0QXBpQ2FsbCh1cmwsIChlcnJvciwgd29ya2l0ZW0pID0+IHtcclxuICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH1lbHNlIHtcclxuICAgICAgICBsZXQgc3FsOiBzdHJpbmcgPSAnU0VMRUNUIEMyIEFTIHJhdGVBbmFseXNpc0lkLCBDMyBBUyBuYW1lIEZST00gPyBXSEVSRSBDMSA9ICcrIGNvc3RIZWFkSWQrJyBhbmQgQzQgPSAnKyBjYXRlZ29yeUlkO1xyXG4gICAgICAgIGlmKGNhdGVnb3J5SWQgPT09IDApIHtcclxuICAgICAgICAgIHNxbCA9ICdTRUxFQ1QgQzIgQVMgcmF0ZUFuYWx5c2lzSWQsIEMzIEFTIG5hbWUgRlJPTSA/IFdIRVJFIEMxID0gJysgY29zdEhlYWRJZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgd29ya2l0ZW0gPSB3b3JraXRlbVsnSXRlbXMnXTtcclxuICAgICAgICBsZXQgd29ya2l0ZW1MaXN0ID0gYWxhc3FsKHNxbCwgW3dvcmtpdGVtXSk7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgd29ya2l0ZW1MaXN0KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBjb252ZXJ0Q29zdEhlYWRzRnJvbVJhdGVBbmFseXNpc1RvQ29zdENvbnRyb2woZW50aXR5OnN0cmluZywgY2FsbGJhY2s6KGVycm9yOiBhbnksIGRhdGE6YW55KT0+IHZvaWQpIHtcclxuXHJcbiAgICBsZXQgY29zdEhlYWRVUkwgPSBjb25maWcuZ2V0KENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0FQSSArIGVudGl0eSArIENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0NPU1RIRUFEUyk7XHJcbiAgICBsZXQgY29zdEhlYWRSYXRlQW5hbHlzaXNQcm9taXNlID0gdGhpcy5jcmVhdGVQcm9taXNlKGNvc3RIZWFkVVJMKTtcclxuXHJcbiAgICBsZXQgY2F0ZWdvcnlVUkwgPSBjb25maWcuZ2V0KENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0FQSSArIGVudGl0eSArIENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0NBVEVHT1JJRVMpO1xyXG4gICAgbGV0IGNhdGVnb3J5UmF0ZUFuYWx5c2lzUHJvbWlzZSA9IHRoaXMuY3JlYXRlUHJvbWlzZShjYXRlZ29yeVVSTCk7XHJcblxyXG4gICAgbGV0IHdvcmtJdGVtVVJMID0gY29uZmlnLmdldChDb25zdGFudHMuUkFURV9BTkFMWVNJU19BUEkgKyBlbnRpdHkgKyBDb25zdGFudHMuUkFURV9BTkFMWVNJU19XT1JLSVRFTVMpO1xyXG4gICAgbGV0IHdvcmtJdGVtUmF0ZUFuYWx5c2lzUHJvbWlzZSA9IHRoaXMuY3JlYXRlUHJvbWlzZSh3b3JrSXRlbVVSTCk7XHJcblxyXG4gICAgbGV0IHJhdGVJdGVtVVJMID0gY29uZmlnLmdldChDb25zdGFudHMuUkFURV9BTkFMWVNJU19BUEkgKyBlbnRpdHkgKyBDb25zdGFudHMuUkFURV9BTkFMWVNJU19SQVRFKTtcclxuICAgIGxldCByYXRlSXRlbVJhdGVBbmFseXNpc1Byb21pc2UgPSB0aGlzLmNyZWF0ZVByb21pc2UocmF0ZUl0ZW1VUkwpO1xyXG5cclxuICAgIGxldCByYXRlQW5hbHlzaXNOb3Rlc1VSTCA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfQVBJICsgZW50aXR5ICsgQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfTk9URVMpO1xyXG4gICAgbGV0IG5vdGVzUmF0ZUFuYWx5c2lzUHJvbWlzZSA9IHRoaXMuY3JlYXRlUHJvbWlzZShyYXRlQW5hbHlzaXNOb3Rlc1VSTCk7XHJcblxyXG4gICAgbGV0IGFsbFVuaXRzRnJvbVJhdGVBbmFseXNpc1VSTCA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfQVBJICsgZW50aXR5ICsgQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfVU5JVCk7XHJcbiAgICBsZXQgdW5pdHNSYXRlQW5hbHlzaXNQcm9taXNlID0gdGhpcy5jcmVhdGVQcm9taXNlKGFsbFVuaXRzRnJvbVJhdGVBbmFseXNpc1VSTCk7XHJcblxyXG4gICAgUHJvbWlzZS5hbGwoW1xyXG4gICAgICBjb3N0SGVhZFJhdGVBbmFseXNpc1Byb21pc2UsXHJcbiAgICAgIGNhdGVnb3J5UmF0ZUFuYWx5c2lzUHJvbWlzZSxcclxuICAgICAgd29ya0l0ZW1SYXRlQW5hbHlzaXNQcm9taXNlLFxyXG4gICAgICByYXRlSXRlbVJhdGVBbmFseXNpc1Byb21pc2UsXHJcbiAgICAgIG5vdGVzUmF0ZUFuYWx5c2lzUHJvbWlzZSxcclxuICAgICAgdW5pdHNSYXRlQW5hbHlzaXNQcm9taXNlXHJcbiAgICBdKS50aGVuKGZ1bmN0aW9uKGRhdGE6IEFycmF5PGFueT4pIHtcclxuXHJcbiAgICAgIGxldCBjb3N0SGVhZHNSYXRlQW5hbHlzaXMgPSBkYXRhWzBdW0NvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0lURU1fVFlQRV07XHJcbiAgICAgIGxldCBjYXRlZ29yaWVzUmF0ZUFuYWx5c2lzID0gZGF0YVsxXVtDb25zdGFudHMuUkFURV9BTkFMWVNJU19TVUJJVEVNX1RZUEVdO1xyXG4gICAgICBsZXQgd29ya0l0ZW1zUmF0ZUFuYWx5c2lzID0gZGF0YVsyXVtDb25zdGFudHMuUkFURV9BTkFMWVNJU19JVEVNU107XHJcbiAgICAgIGxldCByYXRlSXRlbXNSYXRlQW5hbHlzaXMgPSBkYXRhWzNdW0NvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0RBVEFdO1xyXG4gICAgICBsZXQgbm90ZXNSYXRlQW5hbHlzaXMgPSBkYXRhWzRdW0NvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0RBVEFdO1xyXG4gICAgICBsZXQgdW5pdHNSYXRlQW5hbHlzaXMgPSBkYXRhWzVdW0NvbnN0YW50cy5SQVRFX0FOQUxZU0lTX1VPTV07XHJcblxyXG4gICAgICBsZXQgYnVpbGRpbmdDb3N0SGVhZHM6IEFycmF5PENvc3RIZWFkPiA9IFtdO1xyXG4gICAgICBsZXQgcmF0ZUFuYWx5c2lzU2VydmljZSA9IG5ldyBSYXRlQW5hbHlzaXNTZXJ2aWNlKCk7XHJcblxyXG4gICAgICByYXRlQW5hbHlzaXNTZXJ2aWNlLmdldENvc3RIZWFkc0Zyb21SYXRlQW5hbHlzaXMoY29zdEhlYWRzUmF0ZUFuYWx5c2lzLCBjYXRlZ29yaWVzUmF0ZUFuYWx5c2lzLCB3b3JrSXRlbXNSYXRlQW5hbHlzaXMsXHJcbiAgICAgICAgcmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzLCB1bml0c1JhdGVBbmFseXNpcywgbm90ZXNSYXRlQW5hbHlzaXMsIGJ1aWxkaW5nQ29zdEhlYWRzKTtcclxuXHJcbiAgICAgICAgICBjYWxsYmFjayhudWxsLCBidWlsZGluZ0Nvc3RIZWFkcyk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGNyZWF0ZVByb21pc2UodXJsOiBzdHJpbmcpIHtcclxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XHJcbiAgICAgICAgbGV0IHJhdGVBbmFseXNpc1NlcnZpY2UgPSBuZXcgUmF0ZUFuYWx5c2lzU2VydmljZSgpO1xyXG4gICAgICAgIHJhdGVBbmFseXNpc1NlcnZpY2UuZ2V0QXBpQ2FsbCh1cmwsIChlcnJvciA6IGFueSwgZGF0YTogYW55KSA9PiB7XHJcbiAgICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnRXJyb3IgaW4gcHJvbWlzZSA6ICcrZXJyb3IpO1xyXG4gICAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2RhdGEgZnJvbSByYXRlIGFuYWx5c2lzIDogJytkYXRhKTtcclxuICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgIH1cclxuXHJcbiAgZ2V0Q29zdEhlYWRzRnJvbVJhdGVBbmFseXNpcyhjb3N0SGVhZHNSYXRlQW5hbHlzaXM6IGFueSwgY2F0ZWdvcmllc1JhdGVBbmFseXNpczogYW55LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd29ya0l0ZW1zUmF0ZUFuYWx5c2lzOiBhbnksIHJhdGVJdGVtc1JhdGVBbmFseXNpczogYW55LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdHNSYXRlQW5hbHlzaXM6IGFueSwgbm90ZXNSYXRlQW5hbHlzaXM6IGFueSwgYnVpbGRpbmdDb3N0SGVhZHM6IEFycmF5PENvc3RIZWFkPikge1xyXG5cclxuICAgIGZvciAobGV0IGNvc3RIZWFkSW5kZXggPSAwOyBjb3N0SGVhZEluZGV4IDwgY29zdEhlYWRzUmF0ZUFuYWx5c2lzLmxlbmd0aDsgY29zdEhlYWRJbmRleCsrKSB7XHJcblxyXG4gICAgICBsZXQgY29zdEhlYWQgPSBuZXcgQ29zdEhlYWQoKTtcclxuICAgICAgY29zdEhlYWQubmFtZSA9IGNvc3RIZWFkc1JhdGVBbmFseXNpc1tjb3N0SGVhZEluZGV4XS5DMjtcclxuICAgICAgY29zdEhlYWQucmF0ZUFuYWx5c2lzSWQgPSBjb3N0SGVhZHNSYXRlQW5hbHlzaXNbY29zdEhlYWRJbmRleF0uQzE7XHJcblxyXG4gICAgICBsZXQgY2F0ZWdvcmllc1JhdGVBbmFseXNpc1NRTCA9ICdTRUxFQ1QgQ2F0ZWdvcnkuQzEgQVMgcmF0ZUFuYWx5c2lzSWQsIENhdGVnb3J5LkMyIEFTIG5hbWUnICtcclxuICAgICAgICAnIEZST00gPyBBUyBDYXRlZ29yeSB3aGVyZSBDYXRlZ29yeS5DMyA9ICcgKyBjb3N0SGVhZC5yYXRlQW5hbHlzaXNJZDtcclxuXHJcbiAgICAgIGxldCBjYXRlZ29yaWVzQnlDb3N0SGVhZCA9IGFsYXNxbChjYXRlZ29yaWVzUmF0ZUFuYWx5c2lzU1FMLCBbY2F0ZWdvcmllc1JhdGVBbmFseXNpc10pO1xyXG4gICAgICBsZXQgYnVpbGRpbmdDYXRlZ29yaWVzOiBBcnJheTxDYXRlZ29yeT4gPSBuZXcgQXJyYXk8Q2F0ZWdvcnk+KCk7XHJcblxyXG4gICAgICBpZihjYXRlZ29yaWVzQnlDb3N0SGVhZC5sZW5ndGggPT09IDAgKSB7XHJcbiAgICAgICAgdGhpcy5nZXRXb3JrSXRlbXNXaXRob3V0Q2F0ZWdvcnlGcm9tUmF0ZUFuYWx5c2lzKGNvc3RIZWFkLnJhdGVBbmFseXNpc0lkLCB3b3JrSXRlbXNSYXRlQW5hbHlzaXMsXHJcbiAgICAgICAgICByYXRlSXRlbXNSYXRlQW5hbHlzaXMsIHVuaXRzUmF0ZUFuYWx5c2lzLCBub3Rlc1JhdGVBbmFseXNpcywgYnVpbGRpbmdDYXRlZ29yaWVzKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmdldENhdGVnb3JpZXNGcm9tUmF0ZUFuYWx5c2lzKGNhdGVnb3JpZXNCeUNvc3RIZWFkLCB3b3JrSXRlbXNSYXRlQW5hbHlzaXMsXHJcbiAgICAgICAgICByYXRlSXRlbXNSYXRlQW5hbHlzaXMsIHVuaXRzUmF0ZUFuYWx5c2lzLCBub3Rlc1JhdGVBbmFseXNpcywgYnVpbGRpbmdDYXRlZ29yaWVzKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29zdEhlYWQuY2F0ZWdvcmllcyA9IGJ1aWxkaW5nQ2F0ZWdvcmllcztcclxuICAgICAgY29zdEhlYWQudGh1bWJSdWxlUmF0ZSA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLlRIVU1CUlVMRV9SQVRFKTtcclxuICAgICAgYnVpbGRpbmdDb3N0SGVhZHMucHVzaChjb3N0SGVhZCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXRDYXRlZ29yaWVzRnJvbVJhdGVBbmFseXNpcyhjYXRlZ29yaWVzQnlDb3N0SGVhZDogYW55LCB3b3JrSXRlbXNSYXRlQW5hbHlzaXM6IGFueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByYXRlSXRlbXNSYXRlQW5hbHlzaXM6IGFueSwgdW5pdHNSYXRlQW5hbHlzaXM6IGFueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub3Rlc1JhdGVBbmFseXNpczogYW55LCBidWlsZGluZ0NhdGVnb3JpZXM6IEFycmF5PENhdGVnb3J5Pikge1xyXG5cclxuICAgIGZvciAobGV0IGNhdGVnb3J5SW5kZXggPSAwOyBjYXRlZ29yeUluZGV4IDwgY2F0ZWdvcmllc0J5Q29zdEhlYWQubGVuZ3RoOyBjYXRlZ29yeUluZGV4KyspIHtcclxuXHJcbiAgICAgIGxldCBjYXRlZ29yeSA9IG5ldyBDYXRlZ29yeShjYXRlZ29yaWVzQnlDb3N0SGVhZFtjYXRlZ29yeUluZGV4XS5uYW1lLCBjYXRlZ29yaWVzQnlDb3N0SGVhZFtjYXRlZ29yeUluZGV4XS5yYXRlQW5hbHlzaXNJZCk7XHJcblxyXG4gICAgICBsZXQgd29ya0l0ZW1zUmF0ZUFuYWx5c2lzU1FMID0gJ1NFTEVDVCB3b3JrSXRlbS5DMiBBUyByYXRlQW5hbHlzaXNJZCwgd29ya0l0ZW0uQzMgQVMgbmFtZScgK1xyXG4gICAgICAgICcgRlJPTSA/IEFTIHdvcmtJdGVtIHdoZXJlIHdvcmtJdGVtLkM0ID0gJyArIGNhdGVnb3JpZXNCeUNvc3RIZWFkW2NhdGVnb3J5SW5kZXhdLnJhdGVBbmFseXNpc0lkO1xyXG5cclxuICAgICAgbGV0IHdvcmtJdGVtc0J5Q2F0ZWdvcnkgPSBhbGFzcWwod29ya0l0ZW1zUmF0ZUFuYWx5c2lzU1FMLCBbd29ya0l0ZW1zUmF0ZUFuYWx5c2lzXSk7XHJcbiAgICAgIGxldCBidWlsZGluZ1dvcmtJdGVtczogQXJyYXk8V29ya0l0ZW0+ID0gbmV3IEFycmF5PFdvcmtJdGVtPigpO1xyXG5cclxuICAgICAgdGhpcy5nZXRXb3JrSXRlbXNGcm9tUmF0ZUFuYWx5c2lzKHdvcmtJdGVtc0J5Q2F0ZWdvcnksIHJhdGVJdGVtc1JhdGVBbmFseXNpcyxcclxuICAgICAgICB1bml0c1JhdGVBbmFseXNpcywgbm90ZXNSYXRlQW5hbHlzaXMsIGJ1aWxkaW5nV29ya0l0ZW1zKTtcclxuXHJcbiAgICAgIGNhdGVnb3J5LndvcmtJdGVtcyA9IGJ1aWxkaW5nV29ya0l0ZW1zO1xyXG4gICAgICBidWlsZGluZ0NhdGVnb3JpZXMucHVzaChjYXRlZ29yeSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXRXb3JrSXRlbXNXaXRob3V0Q2F0ZWdvcnlGcm9tUmF0ZUFuYWx5c2lzKCBjb3N0SGVhZFJhdGVBbmFseXNpc0lkOiBudW1iZXIsIHdvcmtJdGVtc1JhdGVBbmFseXNpczogYW55LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByYXRlSXRlbXNSYXRlQW5hbHlzaXM6IGFueSwgdW5pdHNSYXRlQW5hbHlzaXM6IGFueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm90ZXNSYXRlQW5hbHlzaXM6IGFueSwgYnVpbGRpbmdDYXRlZ29yaWVzOiBBcnJheTxDYXRlZ29yeT4pIHtcclxuXHJcbiAgICAgIGxldCB3b3JrSXRlbXNXaXRob3V0Q2F0ZWdvcmllc1JhdGVBbmFseXNpc1NRTCA9ICdTRUxFQ1Qgd29ya0l0ZW0uQzIgQVMgcmF0ZUFuYWx5c2lzSWQsIHdvcmtJdGVtLkMzIEFTIG5hbWUnICtcclxuICAgICAgICAnIEZST00gPyBBUyB3b3JrSXRlbSB3aGVyZSBOT1Qgd29ya0l0ZW0uQzQgQU5EIHdvcmtJdGVtLkMxID0gJytjb3N0SGVhZFJhdGVBbmFseXNpc0lkO1xyXG4gICAgICBsZXQgd29ya0l0ZW1zV2l0aG91dENhdGVnb3JpZXMgPSBhbGFzcWwod29ya0l0ZW1zV2l0aG91dENhdGVnb3JpZXNSYXRlQW5hbHlzaXNTUUwsIFt3b3JrSXRlbXNSYXRlQW5hbHlzaXNdKTtcclxuXHJcbiAgICAgIGxldCBidWlsZGluZ1dvcmtJdGVtczogQXJyYXk8V29ya0l0ZW0+ID0gbmV3IEFycmF5PFdvcmtJdGVtPigpO1xyXG4gICAgICBsZXQgY2F0ZWdvcnkgPSBuZXcgQ2F0ZWdvcnkoJ2RlZmF1bHQnLCAwKTtcclxuXHJcbiAgICAgIHRoaXMuZ2V0V29ya0l0ZW1zRnJvbVJhdGVBbmFseXNpcyh3b3JrSXRlbXNXaXRob3V0Q2F0ZWdvcmllcywgcmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzLFxyXG4gICAgICAgIHVuaXRzUmF0ZUFuYWx5c2lzLCBub3Rlc1JhdGVBbmFseXNpcywgYnVpbGRpbmdXb3JrSXRlbXMpO1xyXG5cclxuICAgICAgY2F0ZWdvcnkud29ya0l0ZW1zID0gYnVpbGRpbmdXb3JrSXRlbXM7XHJcbiAgICAgIGJ1aWxkaW5nQ2F0ZWdvcmllcy5wdXNoKGNhdGVnb3J5KTtcclxuICB9XHJcblxyXG4gIGdldFdvcmtJdGVtc0Zyb21SYXRlQW5hbHlzaXMod29ya0l0ZW1zQnlDYXRlZ29yeTogYW55LCByYXRlSXRlbXNSYXRlQW5hbHlzaXM6IGFueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRzUmF0ZUFuYWx5c2lzOiBhbnksIG5vdGVzUmF0ZUFuYWx5c2lzOiBhbnksIGJ1aWxkaW5nV29ya0l0ZW1zOiBBcnJheTxXb3JrSXRlbT4pIHtcclxuXHJcbiAgICBmb3IgKGxldCB3b3JrSXRlbUluZGV4ID0gMDsgd29ya0l0ZW1JbmRleCA8IHdvcmtJdGVtc0J5Q2F0ZWdvcnkubGVuZ3RoOyB3b3JrSXRlbUluZGV4KyspIHtcclxuXHJcbiAgICAgIGxldCB3b3JrSXRlbSA9IG5ldyBXb3JrSXRlbSh3b3JrSXRlbXNCeUNhdGVnb3J5W3dvcmtJdGVtSW5kZXhdLm5hbWUsXHJcbiAgICAgICAgd29ya0l0ZW1zQnlDYXRlZ29yeVt3b3JrSXRlbUluZGV4XS5yYXRlQW5hbHlzaXNJZCk7XHJcblxyXG4gICAgICBsZXQgcmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzU1FMID0gJ1NFTEVDVCByYXRlSXRlbS5DMiBBUyBpdGVtLCByYXRlSXRlbS5DMTIgQVMgcmF0ZUFuYWx5c2lzSWQsIHJhdGVJdGVtLkM2IEFTIHR5cGUsJyArXHJcbiAgICAgICAgJ1JPVU5EKHJhdGVJdGVtLkM3LDIpIEFTIHF1YW50aXR5LCBST1VORChyYXRlSXRlbS5DMywyKSBBUyByYXRlLCB1bml0LkMyIEFTIHVuaXQsJyArXHJcbiAgICAgICAgJ1JPVU5EKHJhdGVJdGVtLkMzICogcmF0ZUl0ZW0uQzcsMikgQVMgdG90YWxBbW91bnQsIHJhdGVJdGVtLkM1IEFTIHRvdGFsUXVhbnRpdHkgJyArXHJcbiAgICAgICAgJ0ZST00gPyBBUyByYXRlSXRlbSBKT0lOID8gQVMgdW5pdCBPTiB1bml0LkMxID0gcmF0ZUl0ZW0uQzkgd2hlcmUgcmF0ZUl0ZW0uQzEgPSAnXHJcbiAgICAgICAgKyB3b3JrSXRlbXNCeUNhdGVnb3J5W3dvcmtJdGVtSW5kZXhdLnJhdGVBbmFseXNpc0lkO1xyXG4gICAgICBsZXQgcmF0ZUl0ZW1zQnlXb3JrSXRlbSA9IGFsYXNxbChyYXRlSXRlbXNSYXRlQW5hbHlzaXNTUUwsIFtyYXRlSXRlbXNSYXRlQW5hbHlzaXMsIHVuaXRzUmF0ZUFuYWx5c2lzXSk7XHJcblxyXG4gICAgICAvL1RPRE8gOiBSZW1vdmUgSGFyZENvZGluZyBmb3Igbm90ZXMgQVBJXHJcbiAgICAgIGxldCBub3Rlc1JhdGVBbmFseXNpc1NRTCA9ICdTRUxFQ1Qgbm90ZXMuQzIgQVMgbm90ZXMsIG5vdGVzLkMzIEFTIGltYWdlVVJMIEZST00gPyBBUyBub3RlcyB3aGVyZSBub3Rlcy5DMSA9IDQ5JztcclxuICAgICAgLy8rIHJhdGVJdGVtc0J5V29ya0l0ZW1bbm90ZXNJbmRleF0ubm90ZXNJZDtcclxuICAgICAgbGV0IG5vdGVzTGlzdCA9IGFsYXNxbChub3Rlc1JhdGVBbmFseXNpc1NRTCwgW25vdGVzUmF0ZUFuYWx5c2lzXSk7XHJcblxyXG4gICAgICB3b3JrSXRlbS5yYXRlLnJhdGVJdGVtcyA9IHJhdGVJdGVtc0J5V29ya0l0ZW07XHJcbiAgICAgIHdvcmtJdGVtLnJhdGUucXVhbnRpdHkgPSByYXRlSXRlbXNCeVdvcmtJdGVtWzBdLnRvdGFsUXVhbnRpdHk7XHJcbiAgICAgIHdvcmtJdGVtLnJhdGUubm90ZXMgPSBub3Rlc0xpc3RbMF0ubm90ZXM7XHJcbiAgICAgIHdvcmtJdGVtLnJhdGUuaW1hZ2VVUkwgPSBub3Rlc0xpc3RbMF0uaW1hZ2VVUkw7XHJcblxyXG4gICAgICB3b3JrSXRlbS5zeXN0ZW1SYXRlLnJhdGVJdGVtcyA9IHJhdGVJdGVtc0J5V29ya0l0ZW07XHJcbiAgICAgIHdvcmtJdGVtLnN5c3RlbVJhdGUucXVhbnRpdHkgPSByYXRlSXRlbXNCeVdvcmtJdGVtWzBdLnRvdGFsUXVhbnRpdHk7XHJcbiAgICAgIHdvcmtJdGVtLnN5c3RlbVJhdGUubm90ZXMgPSBub3Rlc0xpc3RbMF0ubm90ZXM7XHJcbiAgICAgIHdvcmtJdGVtLnN5c3RlbVJhdGUuaW1hZ2VVUkwgPSBub3Rlc0xpc3RbMF0uaW1hZ2VVUkw7XHJcblxyXG4gICAgICBidWlsZGluZ1dvcmtJdGVtcy5wdXNoKHdvcmtJdGVtKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcblxyXG5cclxuT2JqZWN0LnNlYWwoUmF0ZUFuYWx5c2lzU2VydmljZSk7XHJcbmV4cG9ydCA9IFJhdGVBbmFseXNpc1NlcnZpY2U7XHJcbiJdfQ==
