import * as express from 'express';
import Response = require('../interceptor/response/Response');
import CostControllException = require('../exception/CostControllException');
import RateAnalysisService = require('../services/RateAnalysisService');
let config = require('config');
var log4js = require('log4js');
var logger=log4js.getLogger('Rate Analysis Controller');

class RateAnalysisController {
  private _rateAnalysisService: RateAnalysisService;

  constructor() {
    this._rateAnalysisService = new RateAnalysisService();
  }

  getRateAnalysisCostHeads(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Rate Analysis Controller, getRateAnalysisCostHeads has been hit');
      let rateAnalysisService = new RateAnalysisService();
      let url = config.get('rateAnalysisAPI.costHeads');
      let user = req.user;
      rateAnalysisService.getCostHeads(url, user, (error, result) => {
        if (error) {
          next(error);
        } else {
          logger.info('Get Rate Analysis CostHeads success');
          next(new Response(200, result));
        }
      });
    } catch (e) {
      next(new CostControllException(e.message, e.stack));
    }
  }

  getRateAnalysisWorkItems(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Rate Analysis Controller, getRateAnalysisWorkItems has been hit');
      let rateAnalysisService = new RateAnalysisService();
      let user = req.user;
      let url = config.get('rateAnalysisAPI.workItems');

      rateAnalysisService.getWorkItems(url, user, (error, result) => {
        if (error) {
          next(error);
        } else {
          logger.info('Get Rate Analysis Work Items success');
          next(new Response(200, result));
        }
      });
    } catch (e) {
      next(new CostControllException(e.message, e.stack));
    }
  }

  getRateAnalysisWorkItemsByCostHeadId(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Rate Analysis Controller, getRateAnalysisWorkItemsByCostHeadId has been hit');
      let rateAnalysisService = new RateAnalysisService();
      let user = req.user;
      let costHeadId = req.params.costHeadId;
      let url = config.get('rateAnalysisAPI.workItems');

      rateAnalysisService.getWorkItemsByCostHeadId( url, costHeadId, user, (error, result) => {
        if(error) {
          next(error);
        } else {
          logger.info('Get Rate Analysis Work Items By Cost HeadId success');
          logger.debug('CostHead ID : '+costHeadId);
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
      let workItemId = req.params.workItemId;

      rateAnalysisService.getRate(workItemId,(error, result) => {
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

  SyncRateAnalysis(req: express.Request, res: express.Response, next: any): void {
    try {
      let rateAnalysisService = new RateAnalysisService();

      rateAnalysisService.syncAllRegions();
          /*next(new Response(200,'done'));*/
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  getAllRegionNames(req: express.Request, res: express.Response, next: any): void {
    try {
      let rateAnalysisService = new RateAnalysisService();
      rateAnalysisService.getAllRegionNames((error, result) => {
        if (error) {
          next(error);
        } else {
          next(new Response(200, result));
        }
      });
    } catch (e) {
      next(new CostControllException(e.message, e.stack));
    }

  }

  getAllDataForDropdown(req: express.Request, res: express.Response, next: any): void {
    try {
      let region = req.params.regionName;
      let rateAnalysisService = new RateAnalysisService();
      rateAnalysisService.getAllDataForDropdown(region,(error, result) => {
        if (error) {
          next(error);
        } else {
          next(new Response(200, result));
        }
      });
    } catch (e) {
      next(new CostControllException(e.message, e.stack));
    }

  }
}

export  = RateAnalysisController;
