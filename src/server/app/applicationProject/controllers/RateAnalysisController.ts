import * as express from 'express';
import Response = require('../interceptor/response/Response');
import CostControllException = require('../exception/CostControllException');
import RateAnalysisService = require('../services/RateAnalysisService');
let config = require('config');

class RateAnalysisController {
  private _rateAnalysisService : RateAnalysisService;

  constructor() {
    this._rateAnalysisService = new RateAnalysisService();
  }

  getRateAnalysisCostHeads(req: express.Request, res: express.Response, next: any): void {
    try {
      let rateAnalysisService = new RateAnalysisService();
      let user = req.user;
      let url = config.get('rateAnalysisAPI.costHeads');

      rateAnalysisService.getCostHeads(user, url, (error, result) => {
        if(error) {
          next(error);
        } else {
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  getRateAnalysisWorkItems(req: express.Request, res: express.Response, next: any): void {
    try {
      let rateAnalysisService = new RateAnalysisService();
      let user = req.user;
      let url = config.get('rateAnalysisAPI.workItems');

      rateAnalysisService.getWorkItems(user, url, (error, result) => {
        if(error) {
          next(error);
        } else {
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  getRateAnalysisWorkItemsByCostHeadId(req: express.Request, res: express.Response, next: any): void {
    try {
      let rateAnalysisService = new RateAnalysisService();
      let user = req.user;
      let costHeadId = req.params.id;
      let url = config.get('rateAnalysisAPI.workItems');

      rateAnalysisService.getWorkItemsByCostHeadId(costHeadId, user, url, (error, result) => {
        if(error) {
          next(error);
        } else {
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  getRate(req: express.Request, res: express.Response, next: any): void {
    try {
      let rateAnalysisService = new RateAnalysisService();
      let user = req.user;
      let costHeadId = req.params.costHeadId;
      let workitemId = req.params.workitemId;

      rateAnalysisService.getRate(workitemId,(error, result) => {
        if(error) {
          next(error);
        } else {
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }
}
export  = RateAnalysisController;
