import UserService = require('./../../framework/services/UserService');
import ProjectAsset = require('../../framework/shared/projectasset');
import User = require('../../framework/dataaccess/mongoose/user');
import AuthInterceptor = require('../../framework/interceptor/auth.interceptor');
import CostControllException = require('../exception/CostControllException');
import WorkItem = require('../dataaccess/model/WorkItem');
let request = require('request');
let config = require('config');
var log4js = require('log4js');
var logger=log4js.getLogger('Rate Analysis Service');
import alasql = require('alasql');
import Rate = require('../dataaccess/model/Rate');

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

  getCostHeads(user: User, url: string, callback: (error: any, result: any) => void) {
    logger.info('Rate Analysis Service, getCostHeads has been hit');
    request.get({url: url}, function (error: any, response: any, body: any) {
      if (error) {
        callback(error, null);
      } else if (!error && response.statusCode === 200) {
        console.log('RESPONSE JSON : ' + JSON.stringify(JSON.parse(body)));
        let res = JSON.parse(body);
        callback(null, res);
      }
    });
  }

  getWorkItems(user: User, url: string, callback: (error: any, result: any) => void) {
    logger.info('Rate Analysis Service, getWorkItems has been hit');
    request.get({url: url}, function (error: any, response: any, body: any) {
      if (error) {
        callback(error, null);
      } else if (!error && response.statusCode === 200) {
        let res = JSON.parse(body);
        callback(null, res);
      }
    });
  }

  getWorkItemsByCostHeadId(costHeadId: number, user: User, url: string, callback: (error: any, result: any) => void) {
    logger.info('Rate Analysis Service, getWorkItemsByCostHeadId has been hit');
    let workItems : Array<WorkItem> = [];
    request.get({url: url}, function (error: any, response: any, body: any) {
      if (error) {
        callback(error, null);
      } else if (!error && response.statusCode === 200) {
        let res = JSON.parse(body);
        if(res) {

          for(let workitem of res.SubItemType) {
            let workitemDetails = new WorkItem;
            if(parseInt(costHeadId) === workitem.C3) {
              workitemDetails.name = workitem.C2;
              workitemDetails.rateAnalysisId = workitem.C1;
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
      } else if (!error && response.statusCode === 200) {
        let res = JSON.parse(body);
        /*if(res) {

          for(let workitem of res.SubItemType) {
            let workitemDetails = new WorkItem;
            if(parseInt(costHeadId) === workitem.C3) {
              workitemDetails.name = workitem.C2;
              workitemDetails.rateAnalysisId = workitem.C1;
              workItems.push(workitemDetails);
            }
          }
        }*/
        callback(null, res);
      }
    });
  }

  getRate(workitemId: number, callback:(error: any, data:any) => void) {
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
              ' rate.C1 = '+ workitemId;
            let sql2 = 'SELECT rate.C1 AS rateAnalysisId, rate.C2 AS item,rate.C7 AS quantity,rate.C3 AS rate,' +
              ' rate.C3*rate.C7 AS totalAmount, rate.C6 type, unit.C2 As unit FROM ? AS rate JOIN ? AS unit ON unit.C1 = rate.C9' +
              '  WHERE rate.C1 = '+ workitemId;
            let sql3 = 'SELECT SUM(rate.C3*rate.C7) / SUM(rate.C7) AS total  FROM ? AS rate JOIN ? AS unit ON unit.C1 = rate.C9' +
              '  WHERE rate.C1 = '+ workitemId;
            let quantityAndUnit = alasql(sql, [rate, unitData])
            let rateResult : Rate = new Rate();
            let totalrateFromRateAnalysis = alasql(sql3, [rate, unitData])
            rateResult.quantity = quantityAndUnit[0].quantity;
            rateResult.unit = quantityAndUnit[0].unit;
            rateResult.rateFromRateAnalysis = totalrateFromRateAnalysis[0].total;
            console.log(  rateResult.rateFromRateAnalysis);
            rate = alasql(sql2, [rate, unitData])
            rateResult.item = rate;
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
}



Object.seal(RateAnalysisService);
export = RateAnalysisService;
