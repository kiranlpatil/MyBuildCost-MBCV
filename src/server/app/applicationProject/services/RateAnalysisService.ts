import UserService = require('./../../framework/services/UserService');
import ProjectAsset = require('../../framework/shared/projectasset');
import User = require('../../framework/dataaccess/mongoose/user');
import AuthInterceptor = require('../../framework/interceptor/auth.interceptor');
import CostControllException = require('../exception/CostControllException');
import WorkItem = require('../dataaccess/model/WorkItem');
let request = require('request');
let config = require('config');
import alasql = require('alasql');

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
            let sql2 = 'SELECT rate.C1 AS rateAnalysisId, rate.C2 AS item,rate.C5 AS quantity,rate.C3 AS rate,' +
              ' rate.C3*rate.C5 AS totalAmount, rate.C6 type, unit.C2 As unit FROM ? AS rate JOIN ? AS unit ON unit.C1 = rate.C9' +
              '  WHERE rate.C1 = '+ workitemId;
            rate = alasql(sql2, [rate, unitData])
            callback(null, rate);
          }
        });
      }
    });
  }
}

Object.seal(RateAnalysisService);
export = RateAnalysisService;
