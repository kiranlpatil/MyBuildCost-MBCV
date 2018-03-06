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
import SubCategory = require('../dataaccess/model/project/building/SubCategory');

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

  getWorkitemList(costHeadId: number,subCategoryId: number, callback:(error: any, data:any) => void) {
    let url = config.get('rateAnalysisAPI.workitem');
    this.getApiCall(url, (error, workitem) => {
      if(error) {
        callback(error, null);
      }else {
        let sql: string = 'SELECT C2 AS rateAnalysisId, C3 AS name FROM ? WHERE C1 = '+ costHeadId+' and C4 = '+ subCategoryId;
        if(subCategoryId === 0) {
          sql = 'SELECT C2 AS rateAnalysisId, C3 AS name FROM ? WHERE C1 = '+ costHeadId;
        }
        workitem = workitem['Items'];
        let workitemList = alasql(sql, [workitem]);
        callback(null, workitemList);
      }
    });
  }

  getAllDataFromRateAnalysis(callback:(error: any, data:any)=> void) {

    let costHeadURL = config.get('rateAnalysisAPI.costHeads');
    let promiseCostHead = this.createPromise(costHeadURL);

    let categoryURL = config.get('rateAnalysisAPI.subCategories');
    let promiseCategory = this.createPromise(categoryURL);

    let workItemURL = config.get('rateAnalysisAPI.workItems');
    let promiseWorkItem = this.createPromise(workItemURL);

    let rateItemURL = config.get('rateAnalysisAPI.rate');
    let promiseRateItem = this.createPromise(rateItemURL);

    let rateAnalysisNotesURL = config.get('rateAnalysisAPI.rateAnalysisNotes');
    let promiseRateAnalysisNotes = this.createPromise(rateAnalysisNotesURL); //promise name change

    let allUnitsFromRateAnalysisURL = config.get('rateAnalysisAPI.unit');
    let promiseRateAnalysisUnits = this.createPromise(allUnitsFromRateAnalysisURL);

    Promise.all([
      promiseCostHead,
      promiseCategory,
      promiseWorkItem,
      promiseRateItem,
      promiseRateAnalysisNotes,
      promiseRateAnalysisUnits
    ]).then(function(data: Array<any>) {

      let costHeadsRateAnalysis = data[0]['ItemType'];
      let categoriesRateAnalysis = data[1]['SubItemType'];
      let workItemsRateAnalysis = data[2]['Items'];
      let rateItemsRateAnalysis = data[3]['RateAnalysisData'];
      let notesRateAnalysis = data[4]['RateAnalysisData'];
      let unitsRateAnalysis = data[5]['UOM'];

      let buildingCostHeads: Array<CostHead> = [];

      for(let costHeadIndex = 0 ; costHeadIndex < costHeadsRateAnalysis.length; costHeadIndex++) {

        let costHead = new CostHead();
        costHead.name = costHeadsRateAnalysis[costHeadIndex].C2;
        costHead.rateAnalysisId = costHeadsRateAnalysis[costHeadIndex].C1;

        let categoriesRateAnalysisSQL = 'SELECT Category.C1 AS rateAnalysisId, Category.C2 AS name' +
          ' FROM ? AS Category where Category.C3 = '+costHead.rateAnalysisId;

        let categoriesByCostHead = alasql(categoriesRateAnalysisSQL, [categoriesRateAnalysis]);
        let buildingCategories: Array<SubCategory> = [];

        for(let categoryIndex=0; categoryIndex < categoriesByCostHead.length; categoryIndex++) {

          let category = new SubCategory(categoriesByCostHead[categoryIndex].name, categoriesByCostHead[categoryIndex].rateAnalysisId);

          let workItemsRateAnalysisSQL = 'SELECT workItem.C2 AS rateAnalysisId, workItem.C3 AS name' +
            ' FROM ? AS workItem where workItem.C4 = '+categoriesByCostHead[categoryIndex].rateAnalysisId;

          let workItemsByCategory = alasql(workItemsRateAnalysisSQL, [workItemsRateAnalysis]);
          let buildingWorkItems : Array<WorkItem> = [];

          for(let workItemIndex = 0; workItemIndex < workItemsByCategory.length; workItemIndex++) {

            let workItem = new WorkItem(workItemsByCategory[workItemIndex].name,
               workItemsByCategory[workItemIndex].rateAnalysisId);

            let rateItemsRateAnalysisSQL = 'SELECT rateItem.C2 AS item, rateItem.C12 AS rateAnalysisId, rateItem.C6 AS type,' +
               'ROUND(rateItem.C7,2) AS quantity, ROUND(rateItem.C3,2) AS rate, unit.C2 AS unit,' +
               'ROUND(rateItem.C3 * rateItem.C7,2) AS totalAmount, rateItem.C5 AS totalQuantity ' +
               'FROM ? AS rateItem JOIN ? AS unit ON unit.C1 = rateItem.C9 where rateItem.C1 = '
               + workItemsByCategory[workItemIndex].rateAnalysisId;
            let rateItemsByWorkItem =  alasql(rateItemsRateAnalysisSQL, [rateItemsRateAnalysis, unitsRateAnalysis]);

            let notesRateAnalysisSQL = 'SELECT notes.C2 AS notes, notes.C3 AS imageURL FROM ? AS notes where notes.C1 = 49';
            //+ rateItemsByWorkItem[notesIndex].notesId;
            let notesList = alasql(notesRateAnalysisSQL, [notesRateAnalysis]);

            workItem.rate.rateItems = rateItemsByWorkItem;
            workItem.rate.quantity = rateItemsByWorkItem[0].totalQuantity;
            workItem.rate.notes = notesList[0].notes;
            workItem.rate.imageURL = notesList[0].imageURL;

            workItem.systemRate.rateItems = rateItemsByWorkItem;
            workItem.systemRate.quantity = rateItemsByWorkItem[0].totalQuantity;
            workItem.systemRate.notes = notesList[0].notes;
            workItem.systemRate.imageURL = notesList[0].imageURL;

            workItem.active = true;
            buildingWorkItems.push(workItem);
          }
          category.workItems = buildingWorkItems;
          category.active = true;
          buildingCategories.push(category);
        }
        costHead.subCategories = buildingCategories;
        costHead.thumbRuleRate = config.get('thumbRuleRate');
        costHead.active = true;
        buildingCostHeads.push(costHead);
      }
      callback(null, buildingCostHeads);
    });
  }

  createPromise(url: string) {
      return new Promise(function(resolve, reject){
        let rateAnalysisService = new RateAnalysisService();
        rateAnalysisService.getApiCall(url, (error : any, data: any) => {
          if(error) {
            console.log('Error in promise : '+error);
            reject(error);
          } else {
            console.log('data from rate analysis : '+data);
            resolve(data);
          }
        });
      });
   }
}



Object.seal(RateAnalysisService);
export = RateAnalysisService;
