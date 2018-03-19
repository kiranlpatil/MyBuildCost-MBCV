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
            callback(null, buildingCostHeads);
        }).catch(function (e) {
            logger.error(' Promise failed for convertCostHeadsFromRateAnalysisToCostControl ! :' + JSON.stringify(e));
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
        });
    };
    RateAnalysisService.prototype.getCostHeadsFromRateAnalysis = function (costHeadsRateAnalysis, categoriesRateAnalysis, workItemsRateAnalysis, rateItemsRateAnalysis, unitsRateAnalysis, notesRateAnalysis, buildingCostHeads) {
        logger.info('getCostHeadsFromRateAnalysis has been hit.');
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
        logger.info('getCategoriesFromRateAnalysis has been hit.');
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
        logger.info('getWorkItemsWithoutCategoryFromRateAnalysis has been hit.');
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
        logger.info('getWorkItemsFromRateAnalysis has been hit.');
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHBsaWNhdGlvblByb2plY3Qvc2VydmljZXMvUmF0ZUFuYWx5c2lzU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsb0VBQXVFO0FBQ3ZFLGtFQUFxRTtBQUVyRSw4RUFBaUY7QUFDakYsMEVBQTZFO0FBQzdFLHdFQUEyRTtBQUMzRSxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDakMsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixJQUFJLE1BQU0sR0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFDckQsK0JBQWtDO0FBQ2xDLGdFQUFtRTtBQUNuRSx3RUFBMkU7QUFDM0Usd0VBQTJFO0FBQzNFLCtDQUFrRDtBQUNsRCxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsNEJBQTRCLENBQUMsQ0FBQztBQUV0RDtJQU1FO1FBQ0UsSUFBSSxDQUFDLFFBQVEsR0FBRyxZQUFZLENBQUMsUUFBUSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxlQUFlLEVBQUUsQ0FBQztRQUM3QyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7SUFDdkMsQ0FBQztJQUVELDBDQUFZLEdBQVosVUFBYyxHQUFXLEVBQUUsSUFBVSxFQUFFLFFBQTJDO1FBQ2hGLE1BQU0sQ0FBQyxJQUFJLENBQUMsa0RBQWtELENBQUMsQ0FBQztRQUNoRSxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUMsR0FBRyxFQUFFLEdBQUcsRUFBQyxFQUFFLFVBQVUsS0FBVSxFQUFFLFFBQWEsRUFBRSxJQUFTO1lBQ3BFLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ1YsUUFBUSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN4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LENBQUM7WUFDcEUsUUFBUSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUMvQyxRQUFRLENBQUMsVUFBVSxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO1lBRXJELGlCQUFpQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNuQyxDQUFDO0lBQ0gsQ0FBQztJQUNILDBCQUFDO0FBQUQsQ0FuVEEsQUFtVEMsSUFBQTtBQUlELE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUNqQyxpQkFBUyxtQkFBbUIsQ0FBQyIsImZpbGUiOiJhcHAvYXBwbGljYXRpb25Qcm9qZWN0L3NlcnZpY2VzL1JhdGVBbmFseXNpc1NlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVXNlclNlcnZpY2UgPSByZXF1aXJlKCcuLy4uLy4uL2ZyYW1ld29yay9zZXJ2aWNlcy9Vc2VyU2VydmljZScpO1xuaW1wb3J0IFByb2plY3RBc3NldCA9IHJlcXVpcmUoJy4uLy4uL2ZyYW1ld29yay9zaGFyZWQvcHJvamVjdGFzc2V0Jyk7XG5pbXBvcnQgVXNlciA9IHJlcXVpcmUoJy4uLy4uL2ZyYW1ld29yay9kYXRhYWNjZXNzL21vbmdvb3NlL3VzZXInKTtcbmltcG9ydCBBdXRoSW50ZXJjZXB0b3IgPSByZXF1aXJlKCcuLi8uLi9mcmFtZXdvcmsvaW50ZXJjZXB0b3IvYXV0aC5pbnRlcmNlcHRvcicpO1xuaW1wb3J0IENvc3RDb250cm9sbEV4Y2VwdGlvbiA9IHJlcXVpcmUoJy4uL2V4Y2VwdGlvbi9Db3N0Q29udHJvbGxFeGNlcHRpb24nKTtcbmltcG9ydCBXb3JrSXRlbSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9idWlsZGluZy9Xb3JrSXRlbScpO1xubGV0IHJlcXVlc3QgPSByZXF1aXJlKCdyZXF1ZXN0Jyk7XG5sZXQgY29uZmlnID0gcmVxdWlyZSgnY29uZmlnJyk7XG52YXIgbG9nNGpzID0gcmVxdWlyZSgnbG9nNGpzJyk7XG52YXIgbG9nZ2VyPWxvZzRqcy5nZXRMb2dnZXIoJ1JhdGUgQW5hbHlzaXMgU2VydmljZScpO1xuaW1wb3J0IGFsYXNxbCA9IHJlcXVpcmUoJ2FsYXNxbCcpO1xuaW1wb3J0IFJhdGUgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3Byb2plY3QvYnVpbGRpbmcvUmF0ZScpO1xuaW1wb3J0IENvc3RIZWFkID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L2J1aWxkaW5nL0Nvc3RIZWFkJyk7XG5pbXBvcnQgQ2F0ZWdvcnkgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3Byb2plY3QvYnVpbGRpbmcvQ2F0ZWdvcnknKTtcbmltcG9ydCBDb25zdGFudHMgPSByZXF1aXJlKCcuLi9zaGFyZWQvY29uc3RhbnRzJyk7XG5sZXQgQ0NQcm9taXNlID0gcmVxdWlyZSgncHJvbWlzZS9saWIvZXM2LWV4dGVuc2lvbnMnKTtcblxuY2xhc3MgUmF0ZUFuYWx5c2lzU2VydmljZSB7XG4gIEFQUF9OQU1FOiBzdHJpbmc7XG4gIGNvbXBhbnlfbmFtZTogc3RyaW5nO1xuICBwcml2YXRlIGF1dGhJbnRlcmNlcHRvcjogQXV0aEludGVyY2VwdG9yO1xuICBwcml2YXRlIHVzZXJTZXJ2aWNlOiBVc2VyU2VydmljZTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLkFQUF9OQU1FID0gUHJvamVjdEFzc2V0LkFQUF9OQU1FO1xuICAgIHRoaXMuYXV0aEludGVyY2VwdG9yID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xuICAgIHRoaXMudXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcbiAgfVxuXG4gIGdldENvc3RIZWFkcyggdXJsOiBzdHJpbmcsIHVzZXI6IFVzZXIsIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcbiAgICBsb2dnZXIuaW5mbygnUmF0ZSBBbmFseXNpcyBTZXJ2aWNlLCBnZXRDb3N0SGVhZHMgaGFzIGJlZW4gaGl0Jyk7XG4gICAgcmVxdWVzdC5nZXQoe3VybDogdXJsfSwgZnVuY3Rpb24gKGVycm9yOiBhbnksIHJlc3BvbnNlOiBhbnksIGJvZHk6IGFueSkge1xuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcbiAgICAgIH0gZWxzZSBpZiAoIWVycm9yICYmIHJlc3BvbnNlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdSRVNQT05TRSBKU09OIDogJyArIEpTT04uc3RyaW5naWZ5KEpTT04ucGFyc2UoYm9keSkpKTtcbiAgICAgICAgbGV0IHJlcyA9IEpTT04ucGFyc2UoYm9keSk7XG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHJlcyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBnZXRXb3JrSXRlbXMoIHVybDogc3RyaW5nLCB1c2VyOiBVc2VyLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XG4gICAgbG9nZ2VyLmluZm8oJ1JhdGUgQW5hbHlzaXMgU2VydmljZSwgZ2V0V29ya0l0ZW1zIGhhcyBiZWVuIGhpdCcpO1xuICAgIHJlcXVlc3QuZ2V0KHt1cmw6IHVybH0sIGZ1bmN0aW9uIChlcnJvcjogYW55LCByZXNwb25zZTogYW55LCBib2R5OiBhbnkpIHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XG4gICAgICB9IGVsc2UgaWYgKCFlcnJvciAmJiByZXNwb25zZSkge1xuICAgICAgICBsZXQgcmVzID0gSlNPTi5wYXJzZShib2R5KTtcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdldFdvcmtJdGVtc0J5Q29zdEhlYWRJZCggdXJsOiBzdHJpbmcsY29zdEhlYWRJZDogc3RyaW5nLCB1c2VyOiBVc2VyLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XG4gICAgbG9nZ2VyLmluZm8oJ1JhdGUgQW5hbHlzaXMgU2VydmljZSwgZ2V0V29ya0l0ZW1zQnlDb3N0SGVhZElkIGhhcyBiZWVuIGhpdCcpO1xuICAgIGxldCB3b3JrSXRlbXMgOiBBcnJheTxXb3JrSXRlbT4gPSBbXTtcbiAgICByZXF1ZXN0LmdldCh7dXJsOiB1cmx9LCBmdW5jdGlvbiAoZXJyb3I6IGFueSwgcmVzcG9uc2U6IGFueSwgYm9keTogYW55KSB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xuICAgICAgfSBlbHNlIGlmICghZXJyb3IgJiYgcmVzcG9uc2UpIHtcbiAgICAgICAgbGV0IHJlcyA9IEpTT04ucGFyc2UoYm9keSk7XG4gICAgICAgIGlmKHJlcykge1xuXG4gICAgICAgICAgZm9yKGxldCB3b3JraXRlbSBvZiByZXMuU3ViSXRlbVR5cGUpIHtcbiAgICAgICAgICAgIGlmKHBhcnNlSW50KGNvc3RIZWFkSWQpID09PSB3b3JraXRlbS5DMykge1xuICAgICAgICAgICAgICBsZXQgd29ya2l0ZW1EZXRhaWxzID0gbmV3IFdvcmtJdGVtKHdvcmtpdGVtLkMyLCB3b3JraXRlbS5DMSk7XG4gICAgICAgICAgICAgIHdvcmtJdGVtcy5wdXNoKHdvcmtpdGVtRGV0YWlscyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHdvcmtJdGVtcyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBnZXRBcGlDYWxsKHVybCA6IHN0cmluZywgY2FsbGJhY2s6KGVycm9yIDogYW55LCByZXNwb25zZTogYW55KSA9PiB2b2lkKSB7XG4gICAgbG9nZ2VyLmluZm8oJ2dldEFwaUNhbGwgZm9yIHJhdGVBbmFseXNpcyBoYXMgYmVlIGhpdCBmb3IgdXJsIDogJyt1cmwpO1xuICAgIHJlcXVlc3QuZ2V0KHt1cmw6IHVybH0sIGZ1bmN0aW9uIChlcnJvcjogYW55LCByZXNwb25zZTogYW55LCBib2R5OiBhbnkpIHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICBjYWxsYmFjayhuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGVycm9yLm1lc3NhZ2UsIGVycm9yLnN0YWNrKSwgbnVsbCk7XG4gICAgICB9IGVsc2UgaWYgKCFlcnJvciAmJiByZXNwb25zZSkge1xuICAgICAgICBsZXQgcmVzID0gSlNPTi5wYXJzZShib2R5KTtcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdldFJhdGUod29ya0l0ZW1JZDogbnVtYmVyLCBjYWxsYmFjazooZXJyb3I6IGFueSwgZGF0YTphbnkpID0+IHZvaWQpIHtcbiAgICBsZXQgdXJsID0gY29uZmlnLmdldCgncmF0ZUFuYWx5c2lzQVBJLnVuaXQnKTtcbiAgICB0aGlzLmdldEFwaUNhbGwodXJsLCAoZXJyb3IsIHVuaXREYXRhKSA9PiB7XG4gICAgICBpZihlcnJvcikge1xuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XG4gICAgICB9ZWxzZSB7XG4gICAgICAgIHVuaXREYXRhID0gdW5pdERhdGFbJ1VPTSddO1xuICAgICAgICB1cmwgPSBjb25maWcuZ2V0KCdyYXRlQW5hbHlzaXNBUEkucmF0ZScpO1xuICAgICAgICB0aGlzLmdldEFwaUNhbGwodXJsLCAoZXJyb3IsIGRhdGEpID0+IHtcbiAgICAgICAgICBpZihlcnJvcikge1xuICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgcmF0ZSA9IGRhdGFbJ1JhdGVBbmFseXNpc0RhdGEnXTtcbiAgICAgICAgICAgIGxldCBzcWwgPSAnU0VMRUNUIHJhdGUuQzUgQVMgcXVhbnRpdHksIHVuaXQuQzIgQXMgdW5pdCBGUk9NID8gQVMgcmF0ZSBKT0lOID8gQVMgdW5pdCBvbiB1bml0LkMxID0gIHJhdGUuQzggYW5kJyArXG4gICAgICAgICAgICAgICcgcmF0ZS5DMSA9ICcrIHdvcmtJdGVtSWQ7XG4gICAgICAgICAgICBsZXQgc3FsMiA9ICdTRUxFQ1QgcmF0ZS5DMSBBUyByYXRlQW5hbHlzaXNJZCwgcmF0ZS5DMiBBUyBpdGVtLFJPVU5EKHJhdGUuQzcsMikgQVMgcXVhbnRpdHksUk9VTkQocmF0ZS5DMywyKSBBUyByYXRlLCcgK1xuICAgICAgICAgICAgICAnIFJPVU5EKHJhdGUuQzMqcmF0ZS5DNywyKSBBUyB0b3RhbEFtb3VudCwgcmF0ZS5DNiB0eXBlLCB1bml0LkMyIEFzIHVuaXQgRlJPTSA/IEFTIHJhdGUgSk9JTiA/IEFTIHVuaXQgT04gdW5pdC5DMSA9IHJhdGUuQzknICtcbiAgICAgICAgICAgICAgJyAgV0hFUkUgcmF0ZS5DMSA9ICcrIHdvcmtJdGVtSWQ7XG4gICAgICAgICAgICBsZXQgc3FsMyA9ICdTRUxFQ1QgU1VNKHJhdGUuQzMqcmF0ZS5DNykgLyBTVU0ocmF0ZS5DNykgQVMgdG90YWwgIEZST00gPyBBUyByYXRlIEpPSU4gPyBBUyB1bml0IE9OIHVuaXQuQzEgPSByYXRlLkM5JyArXG4gICAgICAgICAgICAgICcgIFdIRVJFIHJhdGUuQzEgPSAnKyB3b3JrSXRlbUlkO1xuICAgICAgICAgICAgbGV0IHF1YW50aXR5QW5kVW5pdCA9IGFsYXNxbChzcWwsIFtyYXRlLCB1bml0RGF0YV0pO1xuICAgICAgICAgICAgbGV0IHJhdGVSZXN1bHQgOiBSYXRlID0gbmV3IFJhdGUoKTtcbiAgICAgICAgICAgIGxldCB0b3RhbHJhdGVGcm9tUmF0ZUFuYWx5c2lzID0gYWxhc3FsKHNxbDMsIFtyYXRlLCB1bml0RGF0YV0pO1xuICAgICAgICAgICAgcmF0ZVJlc3VsdC5xdWFudGl0eSA9IHF1YW50aXR5QW5kVW5pdFswXS5xdWFudGl0eTtcbiAgICAgICAgICAgIHJhdGVSZXN1bHQudW5pdCA9IHF1YW50aXR5QW5kVW5pdFswXS51bml0O1xuICAgICAgICAgICAgcmF0ZVJlc3VsdC5yYXRlRnJvbVJhdGVBbmFseXNpcyA9IHBhcnNlRmxvYXQoKHRvdGFscmF0ZUZyb21SYXRlQW5hbHlzaXNbMF0udG90YWwpLnRvRml4ZWQoMikpO1xuICAgICAgICAgICAgcmF0ZSA9IGFsYXNxbChzcWwyLCBbcmF0ZSwgdW5pdERhdGFdKTtcbiAgICAgICAgICAgIHJhdGVSZXN1bHQucmF0ZUl0ZW1zID0gcmF0ZTtcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJhdGVSZXN1bHQpO1xuICAgICAgICAgIH1cblxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8vVE9ETyA6IERlbGV0ZSBBUEkncyByZWxhdGVkIHRvIHdvcmtpdGVtcyBhZGQsIGRlbGVldCwgZ2V0IGxpc3QuXG4gIGdldFdvcmtpdGVtTGlzdChjb3N0SGVhZElkOiBudW1iZXIsY2F0ZWdvcnlJZDogbnVtYmVyLCBjYWxsYmFjazooZXJyb3I6IGFueSwgZGF0YTphbnkpID0+IHZvaWQpIHtcbiAgICBsZXQgdXJsID0gY29uZmlnLmdldCgncmF0ZUFuYWx5c2lzQVBJLndvcmtpdGVtJyk7XG4gICAgdGhpcy5nZXRBcGlDYWxsKHVybCwgKGVycm9yLCB3b3JraXRlbSkgPT4ge1xuICAgICAgaWYoZXJyb3IpIHtcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xuICAgICAgfWVsc2Uge1xuICAgICAgICBsZXQgc3FsOiBzdHJpbmcgPSAnU0VMRUNUIEMyIEFTIHJhdGVBbmFseXNpc0lkLCBDMyBBUyBuYW1lIEZST00gPyBXSEVSRSBDMSA9ICcrIGNvc3RIZWFkSWQrJyBhbmQgQzQgPSAnKyBjYXRlZ29yeUlkO1xuICAgICAgICBpZihjYXRlZ29yeUlkID09PSAwKSB7XG4gICAgICAgICAgc3FsID0gJ1NFTEVDVCBDMiBBUyByYXRlQW5hbHlzaXNJZCwgQzMgQVMgbmFtZSBGUk9NID8gV0hFUkUgQzEgPSAnKyBjb3N0SGVhZElkO1xuICAgICAgICB9XG4gICAgICAgIHdvcmtpdGVtID0gd29ya2l0ZW1bJ0l0ZW1zJ107XG4gICAgICAgIGxldCB3b3JraXRlbUxpc3QgPSBhbGFzcWwoc3FsLCBbd29ya2l0ZW1dKTtcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgd29ya2l0ZW1MaXN0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGNvbnZlcnRDb3N0SGVhZHNGcm9tUmF0ZUFuYWx5c2lzVG9Db3N0Q29udHJvbChlbnRpdHk6c3RyaW5nLCBjYWxsYmFjazooZXJyb3I6IGFueSwgZGF0YTphbnkpPT4gdm9pZCkge1xuICAgIGxvZ2dlci5pbmZvKCdjb252ZXJ0Q29zdEhlYWRzRnJvbVJhdGVBbmFseXNpc1RvQ29zdENvbnRyb2wgaGFzIGJlZW4gaGl0Jyk7XG5cbiAgICBsZXQgY29zdEhlYWRVUkwgPSBjb25maWcuZ2V0KENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0FQSSArIGVudGl0eSArIENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0NPU1RIRUFEUyk7XG4gICAgbGV0IGNvc3RIZWFkUmF0ZUFuYWx5c2lzUHJvbWlzZSA9IHRoaXMuY3JlYXRlUHJvbWlzZShjb3N0SGVhZFVSTCk7XG4gICAgbG9nZ2VyLmluZm8oJ2Nvc3RIZWFkUmF0ZUFuYWx5c2lzUHJvbWlzZSBmb3IgaGFzIGJlZW4gaGl0Jyk7XG5cbiAgICBsZXQgY2F0ZWdvcnlVUkwgPSBjb25maWcuZ2V0KENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0FQSSArIGVudGl0eSArIENvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0NBVEVHT1JJRVMpO1xuICAgIGxldCBjYXRlZ29yeVJhdGVBbmFseXNpc1Byb21pc2UgPSB0aGlzLmNyZWF0ZVByb21pc2UoY2F0ZWdvcnlVUkwpO1xuICAgIGxvZ2dlci5pbmZvKCdjYXRlZ29yeVJhdGVBbmFseXNpc1Byb21pc2UgZm9yIGhhcyBiZWVuIGhpdCcpO1xuXG4gICAgbGV0IHdvcmtJdGVtVVJMID0gY29uZmlnLmdldChDb25zdGFudHMuUkFURV9BTkFMWVNJU19BUEkgKyBlbnRpdHkgKyBDb25zdGFudHMuUkFURV9BTkFMWVNJU19XT1JLSVRFTVMpO1xuICAgIGxldCB3b3JrSXRlbVJhdGVBbmFseXNpc1Byb21pc2UgPSB0aGlzLmNyZWF0ZVByb21pc2Uod29ya0l0ZW1VUkwpO1xuICAgIGxvZ2dlci5pbmZvKCd3b3JrSXRlbVJhdGVBbmFseXNpc1Byb21pc2UgZm9yIGhhcyBiZWVuIGhpdCcpO1xuXG4gICAgbGV0IHJhdGVJdGVtVVJMID0gY29uZmlnLmdldChDb25zdGFudHMuUkFURV9BTkFMWVNJU19BUEkgKyBlbnRpdHkgKyBDb25zdGFudHMuUkFURV9BTkFMWVNJU19SQVRFKTtcbiAgICBsZXQgcmF0ZUl0ZW1SYXRlQW5hbHlzaXNQcm9taXNlID0gdGhpcy5jcmVhdGVQcm9taXNlKHJhdGVJdGVtVVJMKTtcbiAgICBsb2dnZXIuaW5mbygncmF0ZUl0ZW1SYXRlQW5hbHlzaXNQcm9taXNlIGZvciBoYXMgYmVlbiBoaXQnKTtcblxuICAgIGxldCByYXRlQW5hbHlzaXNOb3Rlc1VSTCA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfQVBJICsgZW50aXR5ICsgQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfTk9URVMpO1xuICAgIGxldCBub3Rlc1JhdGVBbmFseXNpc1Byb21pc2UgPSB0aGlzLmNyZWF0ZVByb21pc2UocmF0ZUFuYWx5c2lzTm90ZXNVUkwpO1xuICAgIGxvZ2dlci5pbmZvKCdub3Rlc1JhdGVBbmFseXNpc1Byb21pc2UgZm9yIGhhcyBiZWVuIGhpdCcpO1xuXG4gICAgbGV0IGFsbFVuaXRzRnJvbVJhdGVBbmFseXNpc1VSTCA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfQVBJICsgZW50aXR5ICsgQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfVU5JVCk7XG4gICAgbGV0IHVuaXRzUmF0ZUFuYWx5c2lzUHJvbWlzZSA9IHRoaXMuY3JlYXRlUHJvbWlzZShhbGxVbml0c0Zyb21SYXRlQW5hbHlzaXNVUkwpO1xuICAgIGxvZ2dlci5pbmZvKCd1bml0c1JhdGVBbmFseXNpc1Byb21pc2UgZm9yIGhhcyBiZWVuIGhpdCcpO1xuXG4gICAgbG9nZ2VyLmluZm8oJ2NhbGxpbmcgUHJvbWlzZS5hbGwnKTtcbiAgICBDQ1Byb21pc2UuYWxsKFtcbiAgICAgIGNvc3RIZWFkUmF0ZUFuYWx5c2lzUHJvbWlzZSxcbiAgICAgIGNhdGVnb3J5UmF0ZUFuYWx5c2lzUHJvbWlzZSxcbiAgICAgIHdvcmtJdGVtUmF0ZUFuYWx5c2lzUHJvbWlzZSxcbiAgICAgIHJhdGVJdGVtUmF0ZUFuYWx5c2lzUHJvbWlzZSxcbiAgICAgIG5vdGVzUmF0ZUFuYWx5c2lzUHJvbWlzZSxcbiAgICAgIHVuaXRzUmF0ZUFuYWx5c2lzUHJvbWlzZVxuICAgIF0pLnRoZW4oZnVuY3Rpb24oZGF0YTogQXJyYXk8YW55Pikge1xuICAgICAgbG9nZ2VyLmluZm8oJ2NvbnZlcnRDb3N0SGVhZHNGcm9tUmF0ZUFuYWx5c2lzVG9Db3N0Q29udHJvbCBQcm9taXNlLmFsbCBBUEkgaXMgc3VjY2Vzcy4nKTtcbiAgICAgIGxldCBjb3N0SGVhZHNSYXRlQW5hbHlzaXMgPSBkYXRhWzBdW0NvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0lURU1fVFlQRV07XG4gICAgICBsZXQgY2F0ZWdvcmllc1JhdGVBbmFseXNpcyA9IGRhdGFbMV1bQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfU1VCSVRFTV9UWVBFXTtcbiAgICAgIGxldCB3b3JrSXRlbXNSYXRlQW5hbHlzaXMgPSBkYXRhWzJdW0NvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0lURU1TXTtcbiAgICAgIGxldCByYXRlSXRlbXNSYXRlQW5hbHlzaXMgPSBkYXRhWzNdW0NvbnN0YW50cy5SQVRFX0FOQUxZU0lTX0RBVEFdO1xuICAgICAgbGV0IG5vdGVzUmF0ZUFuYWx5c2lzID0gZGF0YVs0XVtDb25zdGFudHMuUkFURV9BTkFMWVNJU19EQVRBXTtcbiAgICAgIGxldCB1bml0c1JhdGVBbmFseXNpcyA9IGRhdGFbNV1bQ29uc3RhbnRzLlJBVEVfQU5BTFlTSVNfVU9NXTtcblxuICAgICAgbGV0IGJ1aWxkaW5nQ29zdEhlYWRzOiBBcnJheTxDb3N0SGVhZD4gPSBbXTtcbiAgICAgIGxldCByYXRlQW5hbHlzaXNTZXJ2aWNlID0gbmV3IFJhdGVBbmFseXNpc1NlcnZpY2UoKTtcblxuICAgICAgcmF0ZUFuYWx5c2lzU2VydmljZS5nZXRDb3N0SGVhZHNGcm9tUmF0ZUFuYWx5c2lzKGNvc3RIZWFkc1JhdGVBbmFseXNpcywgY2F0ZWdvcmllc1JhdGVBbmFseXNpcywgd29ya0l0ZW1zUmF0ZUFuYWx5c2lzLFxuICAgICAgICByYXRlSXRlbXNSYXRlQW5hbHlzaXMsIHVuaXRzUmF0ZUFuYWx5c2lzLCBub3Rlc1JhdGVBbmFseXNpcywgYnVpbGRpbmdDb3N0SGVhZHMpO1xuICAgICAgbG9nZ2VyLmluZm8oJ3N1Y2Nlc3MgaW4gIGNvbnZlcnRDb3N0SGVhZHNGcm9tUmF0ZUFuYWx5c2lzVG9Db3N0Q29udHJvbC4nKTtcbiAgICAgIGNhbGxiYWNrKG51bGwsIGJ1aWxkaW5nQ29zdEhlYWRzKTtcbiAgICB9KS5jYXRjaChmdW5jdGlvbihlOmFueSkge1xuICAgICAgbG9nZ2VyLmVycm9yKCcgUHJvbWlzZSBmYWlsZWQgZm9yIGNvbnZlcnRDb3N0SGVhZHNGcm9tUmF0ZUFuYWx5c2lzVG9Db3N0Q29udHJvbCAhIDonICtKU09OLnN0cmluZ2lmeShlKSk7XG4gICAgfSk7XG4gIH1cblxuICBjcmVhdGVQcm9taXNlKHVybDogc3RyaW5nKSB7XG4gICAgICByZXR1cm4gbmV3IENDUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlIDogYW55LCByZWplY3QgOiBhbnkpe1xuICAgICAgICBsb2dnZXIuaW5mbygnY3JlYXRlUHJvbWlzZSBoYXMgYmVlbiBoaXQgZm9yIDogJyt1cmwpO1xuICAgICAgICBsZXQgcmF0ZUFuYWx5c2lzU2VydmljZSA9IG5ldyBSYXRlQW5hbHlzaXNTZXJ2aWNlKCk7XG4gICAgICAgIHJhdGVBbmFseXNpc1NlcnZpY2UuZ2V0QXBpQ2FsbCh1cmwsIChlcnJvciA6IGFueSwgZGF0YTogYW55KSA9PiB7XG4gICAgICAgICAgaWYoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdFcnJvciBpbiBjcmVhdGVQcm9taXNlIGdldCBkYXRhIGZyb20gcmF0ZSBhbmFseXNpczogJytKU09OLnN0cmluZ2lmeShlcnJvcikpO1xuICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2NyZWF0ZVByb21pc2UgZGF0YSBmcm9tIHJhdGUgYW5hbHlzaXMgc3VjY2Vzcy4nKTtcbiAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGU6YW55KSB7XG4gICAgICAgIGxvZ2dlci5lcnJvcignUHJvbWlzZSBmYWlsZWQgZm9yIGluZGl2aWR1YWwgISB1cmw6Jyt1cmwrICc6XFxuIGVycm9yIDonICtKU09OLnN0cmluZ2lmeShlKSk7XG4gICAgICB9KTtcbiAgIH1cblxuICBnZXRDb3N0SGVhZHNGcm9tUmF0ZUFuYWx5c2lzKGNvc3RIZWFkc1JhdGVBbmFseXNpczogYW55LCBjYXRlZ29yaWVzUmF0ZUFuYWx5c2lzOiBhbnksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd29ya0l0ZW1zUmF0ZUFuYWx5c2lzOiBhbnksIHJhdGVJdGVtc1JhdGVBbmFseXNpczogYW55LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRzUmF0ZUFuYWx5c2lzOiBhbnksIG5vdGVzUmF0ZUFuYWx5c2lzOiBhbnksIGJ1aWxkaW5nQ29zdEhlYWRzOiBBcnJheTxDb3N0SGVhZD4pIHtcbiAgICBsb2dnZXIuaW5mbygnZ2V0Q29zdEhlYWRzRnJvbVJhdGVBbmFseXNpcyBoYXMgYmVlbiBoaXQuJyk7XG4gICAgZm9yIChsZXQgY29zdEhlYWRJbmRleCA9IDA7IGNvc3RIZWFkSW5kZXggPCBjb3N0SGVhZHNSYXRlQW5hbHlzaXMubGVuZ3RoOyBjb3N0SGVhZEluZGV4KyspIHtcblxuICAgICAgbGV0IGNvc3RIZWFkID0gbmV3IENvc3RIZWFkKCk7XG4gICAgICBjb3N0SGVhZC5uYW1lID0gY29zdEhlYWRzUmF0ZUFuYWx5c2lzW2Nvc3RIZWFkSW5kZXhdLkMyO1xuICAgICAgY29zdEhlYWQucmF0ZUFuYWx5c2lzSWQgPSBjb3N0SGVhZHNSYXRlQW5hbHlzaXNbY29zdEhlYWRJbmRleF0uQzE7XG5cbiAgICAgIGxldCBjYXRlZ29yaWVzUmF0ZUFuYWx5c2lzU1FMID0gJ1NFTEVDVCBDYXRlZ29yeS5DMSBBUyByYXRlQW5hbHlzaXNJZCwgQ2F0ZWdvcnkuQzIgQVMgbmFtZScgK1xuICAgICAgICAnIEZST00gPyBBUyBDYXRlZ29yeSB3aGVyZSBDYXRlZ29yeS5DMyA9ICcgKyBjb3N0SGVhZC5yYXRlQW5hbHlzaXNJZDtcbiAgICAgIGxldCBjYXRlZ29yaWVzQnlDb3N0SGVhZCA9IGFsYXNxbChjYXRlZ29yaWVzUmF0ZUFuYWx5c2lzU1FMLCBbY2F0ZWdvcmllc1JhdGVBbmFseXNpc10pO1xuICAgICAgbGV0IGJ1aWxkaW5nQ2F0ZWdvcmllczogQXJyYXk8Q2F0ZWdvcnk+ID0gbmV3IEFycmF5PENhdGVnb3J5PigpO1xuXG4gICAgICBpZihjYXRlZ29yaWVzQnlDb3N0SGVhZC5sZW5ndGggPT09IDAgKSB7XG4gICAgICAgIHRoaXMuZ2V0V29ya0l0ZW1zV2l0aG91dENhdGVnb3J5RnJvbVJhdGVBbmFseXNpcyhjb3N0SGVhZC5yYXRlQW5hbHlzaXNJZCwgd29ya0l0ZW1zUmF0ZUFuYWx5c2lzLFxuICAgICAgICAgIHJhdGVJdGVtc1JhdGVBbmFseXNpcywgdW5pdHNSYXRlQW5hbHlzaXMsIG5vdGVzUmF0ZUFuYWx5c2lzLCBidWlsZGluZ0NhdGVnb3JpZXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5nZXRDYXRlZ29yaWVzRnJvbVJhdGVBbmFseXNpcyhjYXRlZ29yaWVzQnlDb3N0SGVhZCwgd29ya0l0ZW1zUmF0ZUFuYWx5c2lzLFxuICAgICAgICAgIHJhdGVJdGVtc1JhdGVBbmFseXNpcywgdW5pdHNSYXRlQW5hbHlzaXMsIG5vdGVzUmF0ZUFuYWx5c2lzLCBidWlsZGluZ0NhdGVnb3JpZXMpO1xuICAgICAgfVxuXG4gICAgICBjb3N0SGVhZC5jYXRlZ29yaWVzID0gYnVpbGRpbmdDYXRlZ29yaWVzO1xuICAgICAgY29zdEhlYWQudGh1bWJSdWxlUmF0ZSA9IGNvbmZpZy5nZXQoQ29uc3RhbnRzLlRIVU1CUlVMRV9SQVRFKTtcbiAgICAgIGJ1aWxkaW5nQ29zdEhlYWRzLnB1c2goY29zdEhlYWQpO1xuICAgIH1cbiAgfVxuXG4gIGdldENhdGVnb3JpZXNGcm9tUmF0ZUFuYWx5c2lzKGNhdGVnb3JpZXNCeUNvc3RIZWFkOiBhbnksIHdvcmtJdGVtc1JhdGVBbmFseXNpczogYW55LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByYXRlSXRlbXNSYXRlQW5hbHlzaXM6IGFueSwgdW5pdHNSYXRlQW5hbHlzaXM6IGFueSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm90ZXNSYXRlQW5hbHlzaXM6IGFueSwgYnVpbGRpbmdDYXRlZ29yaWVzOiBBcnJheTxDYXRlZ29yeT4pIHtcblxuICAgIGxvZ2dlci5pbmZvKCdnZXRDYXRlZ29yaWVzRnJvbVJhdGVBbmFseXNpcyBoYXMgYmVlbiBoaXQuJyk7XG5cbiAgICBmb3IgKGxldCBjYXRlZ29yeUluZGV4ID0gMDsgY2F0ZWdvcnlJbmRleCA8IGNhdGVnb3JpZXNCeUNvc3RIZWFkLmxlbmd0aDsgY2F0ZWdvcnlJbmRleCsrKSB7XG5cbiAgICAgIGxldCBjYXRlZ29yeSA9IG5ldyBDYXRlZ29yeShjYXRlZ29yaWVzQnlDb3N0SGVhZFtjYXRlZ29yeUluZGV4XS5uYW1lLCBjYXRlZ29yaWVzQnlDb3N0SGVhZFtjYXRlZ29yeUluZGV4XS5yYXRlQW5hbHlzaXNJZCk7XG5cbiAgICAgIGxldCB3b3JrSXRlbXNSYXRlQW5hbHlzaXNTUUwgPSAnU0VMRUNUIHdvcmtJdGVtLkMyIEFTIHJhdGVBbmFseXNpc0lkLCB3b3JrSXRlbS5DMyBBUyBuYW1lJyArXG4gICAgICAgICcgRlJPTSA/IEFTIHdvcmtJdGVtIHdoZXJlIHdvcmtJdGVtLkM0ID0gJyArIGNhdGVnb3JpZXNCeUNvc3RIZWFkW2NhdGVnb3J5SW5kZXhdLnJhdGVBbmFseXNpc0lkO1xuXG4gICAgICBsZXQgd29ya0l0ZW1zQnlDYXRlZ29yeSA9IGFsYXNxbCh3b3JrSXRlbXNSYXRlQW5hbHlzaXNTUUwsIFt3b3JrSXRlbXNSYXRlQW5hbHlzaXNdKTtcbiAgICAgIGxldCBidWlsZGluZ1dvcmtJdGVtczogQXJyYXk8V29ya0l0ZW0+ID0gbmV3IEFycmF5PFdvcmtJdGVtPigpO1xuXG4gICAgICB0aGlzLmdldFdvcmtJdGVtc0Zyb21SYXRlQW5hbHlzaXMod29ya0l0ZW1zQnlDYXRlZ29yeSwgcmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzLFxuICAgICAgICB1bml0c1JhdGVBbmFseXNpcywgbm90ZXNSYXRlQW5hbHlzaXMsIGJ1aWxkaW5nV29ya0l0ZW1zKTtcblxuICAgICAgY2F0ZWdvcnkud29ya0l0ZW1zID0gYnVpbGRpbmdXb3JrSXRlbXM7XG4gICAgICBidWlsZGluZ0NhdGVnb3JpZXMucHVzaChjYXRlZ29yeSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0V29ya0l0ZW1zV2l0aG91dENhdGVnb3J5RnJvbVJhdGVBbmFseXNpcyggY29zdEhlYWRSYXRlQW5hbHlzaXNJZDogbnVtYmVyLCB3b3JrSXRlbXNSYXRlQW5hbHlzaXM6IGFueSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJhdGVJdGVtc1JhdGVBbmFseXNpczogYW55LCB1bml0c1JhdGVBbmFseXNpczogYW55LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm90ZXNSYXRlQW5hbHlzaXM6IGFueSwgYnVpbGRpbmdDYXRlZ29yaWVzOiBBcnJheTxDYXRlZ29yeT4pIHtcblxuICAgICAgbG9nZ2VyLmluZm8oJ2dldFdvcmtJdGVtc1dpdGhvdXRDYXRlZ29yeUZyb21SYXRlQW5hbHlzaXMgaGFzIGJlZW4gaGl0LicpO1xuXG4gICAgICBsZXQgd29ya0l0ZW1zV2l0aG91dENhdGVnb3JpZXNSYXRlQW5hbHlzaXNTUUwgPSAnU0VMRUNUIHdvcmtJdGVtLkMyIEFTIHJhdGVBbmFseXNpc0lkLCB3b3JrSXRlbS5DMyBBUyBuYW1lJyArXG4gICAgICAgICcgRlJPTSA/IEFTIHdvcmtJdGVtIHdoZXJlIE5PVCB3b3JrSXRlbS5DNCBBTkQgd29ya0l0ZW0uQzEgPSAnK2Nvc3RIZWFkUmF0ZUFuYWx5c2lzSWQ7XG4gICAgICBsZXQgd29ya0l0ZW1zV2l0aG91dENhdGVnb3JpZXMgPSBhbGFzcWwod29ya0l0ZW1zV2l0aG91dENhdGVnb3JpZXNSYXRlQW5hbHlzaXNTUUwsIFt3b3JrSXRlbXNSYXRlQW5hbHlzaXNdKTtcblxuICAgICAgbGV0IGJ1aWxkaW5nV29ya0l0ZW1zOiBBcnJheTxXb3JrSXRlbT4gPSBuZXcgQXJyYXk8V29ya0l0ZW0+KCk7XG4gICAgICBsZXQgY2F0ZWdvcnkgPSBuZXcgQ2F0ZWdvcnkoJ2RlZmF1bHQnLCAwKTtcblxuICAgICAgdGhpcy5nZXRXb3JrSXRlbXNGcm9tUmF0ZUFuYWx5c2lzKHdvcmtJdGVtc1dpdGhvdXRDYXRlZ29yaWVzLCByYXRlSXRlbXNSYXRlQW5hbHlzaXMsXG4gICAgICAgIHVuaXRzUmF0ZUFuYWx5c2lzLCBub3Rlc1JhdGVBbmFseXNpcywgYnVpbGRpbmdXb3JrSXRlbXMpO1xuXG4gICAgICBjYXRlZ29yeS53b3JrSXRlbXMgPSBidWlsZGluZ1dvcmtJdGVtcztcbiAgICAgIGJ1aWxkaW5nQ2F0ZWdvcmllcy5wdXNoKGNhdGVnb3J5KTtcbiAgfVxuXG4gIGdldFdvcmtJdGVtc0Zyb21SYXRlQW5hbHlzaXMod29ya0l0ZW1zQnlDYXRlZ29yeTogYW55LCByYXRlSXRlbXNSYXRlQW5hbHlzaXM6IGFueSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0c1JhdGVBbmFseXNpczogYW55LCBub3Rlc1JhdGVBbmFseXNpczogYW55LCBidWlsZGluZ1dvcmtJdGVtczogQXJyYXk8V29ya0l0ZW0+KSB7XG5cbiAgICBsb2dnZXIuaW5mbygnZ2V0V29ya0l0ZW1zRnJvbVJhdGVBbmFseXNpcyBoYXMgYmVlbiBoaXQuJyk7XG5cbiAgICBmb3IgKGxldCB3b3JrSXRlbUluZGV4ID0gMDsgd29ya0l0ZW1JbmRleCA8IHdvcmtJdGVtc0J5Q2F0ZWdvcnkubGVuZ3RoOyB3b3JrSXRlbUluZGV4KyspIHtcblxuICAgICAgbGV0IHdvcmtJdGVtID0gbmV3IFdvcmtJdGVtKHdvcmtJdGVtc0J5Q2F0ZWdvcnlbd29ya0l0ZW1JbmRleF0ubmFtZSxcbiAgICAgICAgd29ya0l0ZW1zQnlDYXRlZ29yeVt3b3JrSXRlbUluZGV4XS5yYXRlQW5hbHlzaXNJZCk7XG5cbiAgICAgIGxldCByYXRlSXRlbXNSYXRlQW5hbHlzaXNTUUwgPSAnU0VMRUNUIHJhdGVJdGVtLkMyIEFTIGl0ZW0sIHJhdGVJdGVtLkMxMiBBUyByYXRlQW5hbHlzaXNJZCwgcmF0ZUl0ZW0uQzYgQVMgdHlwZSwnICtcbiAgICAgICAgJ1JPVU5EKHJhdGVJdGVtLkM3LDIpIEFTIHF1YW50aXR5LCBST1VORChyYXRlSXRlbS5DMywyKSBBUyByYXRlLCB1bml0LkMyIEFTIHVuaXQsJyArXG4gICAgICAgICdST1VORChyYXRlSXRlbS5DMyAqIHJhdGVJdGVtLkM3LDIpIEFTIHRvdGFsQW1vdW50LCByYXRlSXRlbS5DNSBBUyB0b3RhbFF1YW50aXR5ICcgK1xuICAgICAgICAnRlJPTSA/IEFTIHJhdGVJdGVtIEpPSU4gPyBBUyB1bml0IE9OIHVuaXQuQzEgPSByYXRlSXRlbS5DOSB3aGVyZSByYXRlSXRlbS5DMSA9ICdcbiAgICAgICAgKyB3b3JrSXRlbXNCeUNhdGVnb3J5W3dvcmtJdGVtSW5kZXhdLnJhdGVBbmFseXNpc0lkO1xuICAgICAgbGV0IHJhdGVJdGVtc0J5V29ya0l0ZW0gPSBhbGFzcWwocmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzU1FMLCBbcmF0ZUl0ZW1zUmF0ZUFuYWx5c2lzLCB1bml0c1JhdGVBbmFseXNpc10pO1xuXG4gICAgICAvL1RPRE8gOiBSZW1vdmUgSGFyZENvZGluZyBmb3Igbm90ZXMgQVBJXG4gICAgICBsZXQgbm90ZXNSYXRlQW5hbHlzaXNTUUwgPSAnU0VMRUNUIG5vdGVzLkMyIEFTIG5vdGVzLCBub3Rlcy5DMyBBUyBpbWFnZVVSTCBGUk9NID8gQVMgbm90ZXMgd2hlcmUgbm90ZXMuQzEgPSA0OSc7XG4gICAgICAvLysgcmF0ZUl0ZW1zQnlXb3JrSXRlbVtub3Rlc0luZGV4XS5ub3Rlc0lkO1xuICAgICAgbGV0IG5vdGVzTGlzdCA9IGFsYXNxbChub3Rlc1JhdGVBbmFseXNpc1NRTCwgW25vdGVzUmF0ZUFuYWx5c2lzXSk7XG5cbiAgICAgIHdvcmtJdGVtLnJhdGUucmF0ZUl0ZW1zID0gcmF0ZUl0ZW1zQnlXb3JrSXRlbTtcbiAgICAgIHdvcmtJdGVtLnJhdGUucXVhbnRpdHkgPSByYXRlSXRlbXNCeVdvcmtJdGVtWzBdLnRvdGFsUXVhbnRpdHk7XG4gICAgICB3b3JrSXRlbS5yYXRlLm5vdGVzID0gbm90ZXNMaXN0WzBdLm5vdGVzO1xuICAgICAgd29ya0l0ZW0ucmF0ZS5pbWFnZVVSTCA9IG5vdGVzTGlzdFswXS5pbWFnZVVSTDtcblxuICAgICAgd29ya0l0ZW0uc3lzdGVtUmF0ZS5yYXRlSXRlbXMgPSByYXRlSXRlbXNCeVdvcmtJdGVtO1xuICAgICAgd29ya0l0ZW0uc3lzdGVtUmF0ZS5xdWFudGl0eSA9IHJhdGVJdGVtc0J5V29ya0l0ZW1bMF0udG90YWxRdWFudGl0eTtcbiAgICAgIHdvcmtJdGVtLnN5c3RlbVJhdGUubm90ZXMgPSBub3Rlc0xpc3RbMF0ubm90ZXM7XG4gICAgICB3b3JrSXRlbS5zeXN0ZW1SYXRlLmltYWdlVVJMID0gbm90ZXNMaXN0WzBdLmltYWdlVVJMO1xuXG4gICAgICBidWlsZGluZ1dvcmtJdGVtcy5wdXNoKHdvcmtJdGVtKTtcbiAgICB9XG4gIH1cbn1cblxuXG5cbk9iamVjdC5zZWFsKFJhdGVBbmFseXNpc1NlcnZpY2UpO1xuZXhwb3J0ID0gUmF0ZUFuYWx5c2lzU2VydmljZTtcbiJdfQ==
