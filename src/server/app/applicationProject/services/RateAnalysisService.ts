import UserService = require('./../../framework/services/UserService');
import ProjectAsset = require('../../framework/shared/projectasset');
import User = require('../../framework/dataaccess/mongoose/user');
import AuthInterceptor = require('../../framework/interceptor/auth.interceptor');
import CostControllException = require('../exception/CostControllException');
import WorkItem = require('../dataaccess/model/project/building/WorkItem');
let request = require('request');
let config = require('config');
var log4js = require('log4js');
var logger=log4js.getLogger('Rate Analysis Service');
import alasql = require('alasql');
import Rate = require('../dataaccess/model/project/building/Rate');
import CostHead = require('../dataaccess/model/project/building/CostHead');
import Category = require('../dataaccess/model/project/building/Category');
import Constants = require('../shared/constants');
let CCPromise = require('promise/lib/es6-extensions');

class RateAnalysisService {
  APP_NAME: string;
  company_name: string;
  private authInterceptor: AuthInterceptor;
  private userService: UserService;

  constructor() {
    this.APP_NAME = ProjectAsset.APP_NAME;
    this.authInterceptor = new AuthInterceptor();
    this.userService = new UserService();
  }

  getCostHeads( url: string, user: User, callback: (error: any, result: any) => void) {
    logger.info('Rate Analysis Service, getCostHeads has been hit');
    request.get({url: url}, function (error: any, response: any, body: any) {
      if (error) {
        callback(error, null);
      } else if (!error && response) {
        console.log('RESPONSE JSON : ' + JSON.stringify(JSON.parse(body)));
        let res = JSON.parse(body);
        callback(null, res);
      }
    });
  }

  getWorkItems( url: string, user: User, callback: (error: any, result: any) => void) {
    logger.info('Rate Analysis Service, getWorkItems has been hit');
    request.get({url: url}, function (error: any, response: any, body: any) {
      if (error) {
        callback(error, null);
      } else if (!error && response) {
        let res = JSON.parse(body);
        callback(null, res);
      }
    });
  }

  getWorkItemsByCostHeadId( url: string,costHeadId: string, user: User, callback: (error: any, result: any) => void) {
    logger.info('Rate Analysis Service, getWorkItemsByCostHeadId has been hit');
    let workItems : Array<WorkItem> = [];
    request.get({url: url}, function (error: any, response: any, body: any) {
      if (error) {
        callback(error, null);
      } else if (!error && response) {
        let res = JSON.parse(body);
        if(res) {

          for(let workitem of res.SubItemType) {
            if(parseInt(costHeadId) === workitem.C3) {
              let workitemDetails = new WorkItem(workitem.C2, workitem.C1);
              workItems.push(workitemDetails);
            }
          }
        }
        callback(null, workItems);
      }
    });
  }

  getApiCall(url : string, callback:(error : any, response: any) => void) {
    logger.info('getApiCall for rateAnalysis has bee hit for url : '+url);
    request.get({url: url}, function (error: any, response: any, body: any) {
      if (error) {
        callback(new CostControllException(error.message, error.stack), null);
      } else if (!error && response) {
        let res = JSON.parse(body);
        callback(null, res);
      }
    });
  }

  getRate(workItemId: number, callback:(error: any, data:any) => void) {
    let url = config.get('rateAnalysisAPI.unit');
    this.getApiCall(url, (error, unitData) => {
      if(error) {
        callback(error, null);
      }else {
        unitData = unitData['UOM'];
        url = config.get('rateAnalysisAPI.rate');
        this.getApiCall(url, (error, data) => {
          if(error) {
            callback(error, null);
          } else {
            let rate = data['RateAnalysisData'];
            let sql = 'SELECT rate.C5 AS quantity, unit.C2 As unit FROM ? AS rate JOIN ? AS unit on unit.C1 =  rate.C8 and' +
              ' rate.C1 = '+ workItemId;
            let sql2 = 'SELECT rate.C1 AS rateAnalysisId, rate.C2 AS item,ROUND(rate.C7,2) AS quantity,ROUND(rate.C3,2) AS rate,' +
              ' ROUND(rate.C3*rate.C7,2) AS totalAmount, rate.C6 type, unit.C2 As unit FROM ? AS rate JOIN ? AS unit ON unit.C1 = rate.C9' +
              '  WHERE rate.C1 = '+ workItemId;
            let sql3 = 'SELECT SUM(rate.C3*rate.C7) / SUM(rate.C7) AS total  FROM ? AS rate JOIN ? AS unit ON unit.C1 = rate.C9' +
              '  WHERE rate.C1 = '+ workItemId;
            let quantityAndUnit = alasql(sql, [rate, unitData]);
            let rateResult : Rate = new Rate();
            let totalrateFromRateAnalysis = alasql(sql3, [rate, unitData]);
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
  }

  //TODO : Delete API's related to workitems add, deleet, get list.
  getWorkitemList(costHeadId: number,categoryId: number, callback:(error: any, data:any) => void) {
    let url = config.get('rateAnalysisAPI.workitem');
    this.getApiCall(url, (error, workitem) => {
      if(error) {
        callback(error, null);
      }else {
        let sql: string = 'SELECT C2 AS rateAnalysisId, C3 AS name FROM ? WHERE C1 = '+ costHeadId+' and C4 = '+ categoryId;
        if(categoryId === 0) {
          sql = 'SELECT C2 AS rateAnalysisId, C3 AS name FROM ? WHERE C1 = '+ costHeadId;
        }
        workitem = workitem['Items'];
        let workitemList = alasql(sql, [workitem]);
        callback(null, workitemList);
      }
    });
  }

  convertCostHeadsFromRateAnalysisToCostControl(entity:string, callback:(error: any, data:any)=> void) {
    logger.info('convertCostHeadsFromRateAnalysisToCostControl has been hit');

    let costHeadURL = config.get(Constants.RATE_ANALYSIS_API + entity + Constants.RATE_ANALYSIS_COSTHEADS);
    let costHeadRateAnalysisPromise = this.createPromise(costHeadURL);
    logger.info('costHeadRateAnalysisPromise for has been hit');

    let categoryURL = config.get(Constants.RATE_ANALYSIS_API + entity + Constants.RATE_ANALYSIS_CATEGORIES);
    let categoryRateAnalysisPromise = this.createPromise(categoryURL);
    logger.info('categoryRateAnalysisPromise for has been hit');

    let workItemURL = config.get(Constants.RATE_ANALYSIS_API + entity + Constants.RATE_ANALYSIS_WORKITEMS);
    let workItemRateAnalysisPromise = this.createPromise(workItemURL);
    logger.info('workItemRateAnalysisPromise for has been hit');

    let rateItemURL = config.get(Constants.RATE_ANALYSIS_API + entity + Constants.RATE_ANALYSIS_RATE);
    let rateItemRateAnalysisPromise = this.createPromise(rateItemURL);
    logger.info('rateItemRateAnalysisPromise for has been hit');

    let rateAnalysisNotesURL = config.get(Constants.RATE_ANALYSIS_API + entity + Constants.RATE_ANALYSIS_NOTES);
    let notesRateAnalysisPromise = this.createPromise(rateAnalysisNotesURL);
    logger.info('notesRateAnalysisPromise for has been hit');

    let allUnitsFromRateAnalysisURL = config.get(Constants.RATE_ANALYSIS_API + entity + Constants.RATE_ANALYSIS_UNIT);
    let unitsRateAnalysisPromise = this.createPromise(allUnitsFromRateAnalysisURL);
    logger.info('unitsRateAnalysisPromise for has been hit');

    logger.info('calling Promise.all');
    CCPromise.all([
      costHeadRateAnalysisPromise,
      categoryRateAnalysisPromise,
      workItemRateAnalysisPromise,
      rateItemRateAnalysisPromise,
      notesRateAnalysisPromise,
      unitsRateAnalysisPromise
    ]).then(function(data: Array<any>) {
      logger.info('convertCostHeadsFromRateAnalysisToCostControl Promise.all API is success.');
      let costHeadsRateAnalysis = data[0][Constants.RATE_ANALYSIS_ITEM_TYPE];
      let categoriesRateAnalysis = data[1][Constants.RATE_ANALYSIS_SUBITEM_TYPE];
      let workItemsRateAnalysis = data[2][Constants.RATE_ANALYSIS_ITEMS];
      let rateItemsRateAnalysis = data[3][Constants.RATE_ANALYSIS_DATA];
      let notesRateAnalysis = data[4][Constants.RATE_ANALYSIS_DATA];
      let unitsRateAnalysis = data[5][Constants.RATE_ANALYSIS_UOM];

      let buildingCostHeads: Array<CostHead> = [];
      let rateAnalysisService = new RateAnalysisService();

      rateAnalysisService.getCostHeadsFromRateAnalysis(costHeadsRateAnalysis, categoriesRateAnalysis, workItemsRateAnalysis,
        rateItemsRateAnalysis, unitsRateAnalysis, notesRateAnalysis, buildingCostHeads);
      logger.info('success in  convertCostHeadsFromRateAnalysisToCostControl.');
      callback(null, buildingCostHeads);
    }).catch(function(e:any) {
      logger.error(' Promise failed for convertCostHeadsFromRateAnalysisToCostControl ! :' +JSON.stringify(e));
    });
  }

  createPromise(url: string) {
      return new CCPromise(function(resolve : any, reject : any){
        logger.info('createPromise has been hit for : '+url);
        let rateAnalysisService = new RateAnalysisService();
        rateAnalysisService.getApiCall(url, (error : any, data: any) => {
          if(error) {
            console.log('Error in createPromise get data from rate analysis: '+JSON.stringify(error));
            reject(error);
          } else {
            console.log('createPromise data from rate analysis success.');
            resolve(data);
          }
        });
      }).catch(function(e:any) {
        logger.error('Promise failed for individual ! url:'+url+ ':\n error :' +JSON.stringify(e));
      });
   }

  getCostHeadsFromRateAnalysis(costHeadsRateAnalysis: any, categoriesRateAnalysis: any,
                               workItemsRateAnalysis: any, rateItemsRateAnalysis: any,
                               unitsRateAnalysis: any, notesRateAnalysis: any, buildingCostHeads: Array<CostHead>) {
    logger.info('getCostHeadsFromRateAnalysis has been hit.');
    for (let costHeadIndex = 0; costHeadIndex < costHeadsRateAnalysis.length; costHeadIndex++) {

      let costHead = new CostHead();
      costHead.name = costHeadsRateAnalysis[costHeadIndex].C2;
      costHead.rateAnalysisId = costHeadsRateAnalysis[costHeadIndex].C1;

      let categoriesRateAnalysisSQL = 'SELECT Category.C1 AS rateAnalysisId, Category.C2 AS name' +
        ' FROM ? AS Category where Category.C3 = ' + costHead.rateAnalysisId;

      let categoriesByCostHead = alasql(categoriesRateAnalysisSQL, [categoriesRateAnalysis]);
      let buildingCategories: Array<Category> = new Array<Category>();

      if(categoriesByCostHead.length === 0 ) {
        this.getWorkItemsWithoutCategoryFromRateAnalysis(costHead.rateAnalysisId, workItemsRateAnalysis,
          rateItemsRateAnalysis, unitsRateAnalysis, notesRateAnalysis, buildingCategories);
      } else {
        this.getCategoriesFromRateAnalysis(categoriesByCostHead, workItemsRateAnalysis,
          rateItemsRateAnalysis, unitsRateAnalysis, notesRateAnalysis, buildingCategories);
      }

      costHead.categories = buildingCategories;
      costHead.thumbRuleRate = config.get(Constants.THUMBRULE_RATE);
      buildingCostHeads.push(costHead);
    }
  }

  getCategoriesFromRateAnalysis(categoriesByCostHead: any, workItemsRateAnalysis: any,
                                rateItemsRateAnalysis: any, unitsRateAnalysis: any,
                                notesRateAnalysis: any, buildingCategories: Array<Category>) {

    logger.info('getCategoriesFromRateAnalysis has been hit.');

    for (let categoryIndex = 0; categoryIndex < categoriesByCostHead.length; categoryIndex++) {

      let category = new Category(categoriesByCostHead[categoryIndex].name, categoriesByCostHead[categoryIndex].rateAnalysisId);

      let workItemsRateAnalysisSQL = 'SELECT workItem.C2 AS rateAnalysisId, workItem.C3 AS name' +
        ' FROM ? AS workItem where workItem.C4 = ' + categoriesByCostHead[categoryIndex].rateAnalysisId;

      let workItemsByCategory = alasql(workItemsRateAnalysisSQL, [workItemsRateAnalysis]);
      let buildingWorkItems: Array<WorkItem> = new Array<WorkItem>();

      this.getWorkItemsFromRateAnalysis(workItemsByCategory, rateItemsRateAnalysis,
        unitsRateAnalysis, notesRateAnalysis, buildingWorkItems);

      category.workItems = buildingWorkItems;
      buildingCategories.push(category);
    }
  }

  getWorkItemsWithoutCategoryFromRateAnalysis( costHeadRateAnalysisId: number, workItemsRateAnalysis: any,
                                 rateItemsRateAnalysis: any, unitsRateAnalysis: any,
                                 notesRateAnalysis: any, buildingCategories: Array<Category>) {

      logger.info('getWorkItemsWithoutCategoryFromRateAnalysis has been hit.');

      let workItemsWithoutCategoriesRateAnalysisSQL = 'SELECT workItem.C2 AS rateAnalysisId, workItem.C3 AS name' +
        ' FROM ? AS workItem where NOT workItem.C4 AND workItem.C1 = '+costHeadRateAnalysisId;
      let workItemsWithoutCategories = alasql(workItemsWithoutCategoriesRateAnalysisSQL, [workItemsRateAnalysis]);

      let buildingWorkItems: Array<WorkItem> = new Array<WorkItem>();
      let category = new Category('default', 0);

      this.getWorkItemsFromRateAnalysis(workItemsWithoutCategories, rateItemsRateAnalysis,
        unitsRateAnalysis, notesRateAnalysis, buildingWorkItems);

      category.workItems = buildingWorkItems;
      buildingCategories.push(category);
  }

  getWorkItemsFromRateAnalysis(workItemsByCategory: any, rateItemsRateAnalysis: any,
                                        unitsRateAnalysis: any, notesRateAnalysis: any, buildingWorkItems: Array<WorkItem>) {

    logger.info('getWorkItemsFromRateAnalysis has been hit.');

    for (let workItemIndex = 0; workItemIndex < workItemsByCategory.length; workItemIndex++) {

      let workItem = new WorkItem(workItemsByCategory[workItemIndex].name,
        workItemsByCategory[workItemIndex].rateAnalysisId);

      let rateItemsRateAnalysisSQL = 'SELECT rateItem.C2 AS item, rateItem.C12 AS rateAnalysisId, rateItem.C6 AS type,' +
        'ROUND(rateItem.C7,2) AS quantity, ROUND(rateItem.C3,2) AS rate, unit.C2 AS unit,' +
        'ROUND(rateItem.C3 * rateItem.C7,2) AS totalAmount, rateItem.C5 AS totalQuantity ' +
        'FROM ? AS rateItem JOIN ? AS unit ON unit.C1 = rateItem.C9 where rateItem.C1 = '
        + workItemsByCategory[workItemIndex].rateAnalysisId;
      let rateItemsByWorkItem = alasql(rateItemsRateAnalysisSQL, [rateItemsRateAnalysis, unitsRateAnalysis]);

      //TODO : Remove HardCoding for notes API
      let notesRateAnalysisSQL = 'SELECT notes.C2 AS notes, notes.C3 AS imageURL FROM ? AS notes where notes.C1 = 49';
      //+ rateItemsByWorkItem[notesIndex].notesId;
      let notesList = alasql(notesRateAnalysisSQL, [notesRateAnalysis]);

      workItem.rate.rateItems = rateItemsByWorkItem;
      workItem.rate.quantity = rateItemsByWorkItem[0].totalQuantity;
      workItem.rate.notes = notesList[0].notes;
      workItem.rate.imageURL = notesList[0].imageURL;

      //Query for System rate quantity should be One

      let rateItemsRateAnalysisSQLForQuantityOne = 'SELECT item, rateAnalysisId, type, ROUND(quantity / totalQuantity,2) AS quantity,'+
        'rate, unit, ROUND(quantity / totalQuantity * rate,2) AS totalAmount, ROUND(totalQuantity / totalQuantity,2) AS totalQuantity FROM ?';
      let rateItemsByWorkItemForQuantityOne = alasql(rateItemsRateAnalysisSQLForQuantityOne, [rateItemsByWorkItem]);

      workItem.systemRate.rateItems = rateItemsByWorkItemForQuantityOne;
      workItem.systemRate.quantity = rateItemsByWorkItemForQuantityOne[0].totalQuantity;
      workItem.systemRate.notes = notesList[0].notes;
      workItem.systemRate.imageURL = notesList[0].imageURL;

      buildingWorkItems.push(workItem);
    }
  }
}



Object.seal(RateAnalysisService);
export = RateAnalysisService;
