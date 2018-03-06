import * as express from 'express';
import ReportService = require('./../services/ReportService');
import Project = require('../dataaccess/mongoose/Project');
import Building = require('../dataaccess/mongoose/Building');
import Response = require('../interceptor/response/Response');
import CostControllException = require('../exception/CostControllException');
//import config from "../../../../../tools/config";
let config = require('config');
var log4js = require('log4js');
var logger=log4js.getLogger('Report Controller');

class ReportController {
  private _reportService : ReportService;

  constructor() {
    this._reportService = new ReportService();
  }

  getProject(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Report Controller, getProject has been hit');
      let reportService = new ReportService();
      let user = req.user;
      let projectId =  req.params.projectId;
      let categoryId =  req.params.projectId;
      let reportType =  req.params.reportType;
      let rateUnit =  req.params.costingUnit;
      let areaType =  req.params.costingArea;

      reportService.getReport( projectId, reportType, rateUnit, areaType,  user, (error, result) => {
        if(error) {
          next(error);
        } else {
          logger.info('Get Project success');
          logger.debug('Getting Project for Project ID : '+projectId+', Report Type : '+reportType+
            ', Rate Unit : '+rateUnit+', Project Area : '+areaType);
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  getRateAnalysisCostHeads(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Report Controller, getRateAnalysisCostHeads has been hit');
      let reportService = new ReportService();
      let url = config.get('rateAnalysisAPI.costHeads');
      let user = req.user;

      reportService.getCostHeads( url, user,(error, result) => {
        if(error) {
          next(error);
        } else {
          logger.info('Get Rate Analysis CostHeads success');
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  getRateAnalysisWorkItems(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Report Controller, getRateAnalysisWorkItems has been hit');
      let reportService = new ReportService();
      let user = req.user;
      let url = config.get('rateAnalysisAPI.workItems');
      console.log('URL : '+url);

      reportService.getWorkItems( url, user, (error, result) => {
        if(error) {
          next(error);
        } else {
          logger.info('Get Rate Analysis WorkItems success');
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

}
export  = ReportController;
