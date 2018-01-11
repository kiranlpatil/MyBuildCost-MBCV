import * as express from 'express';
import ReportService = require('./../services/ReportService');
import Project = require('../dataaccess/mongoose/Project');
import Building = require('../dataaccess/mongoose/Building');
import Response = require('../interceptor/response/Response');
import CostControllException = require('../exception/CostControllException');
//import config from "../../../../../tools/config";
let config = require('config');

class ReportController {
  private _reportService : ReportService;

  constructor() {
    this._reportService = new ReportService();
  }

  getProject(req: express.Request, res: express.Response, next: any): void {
    try {
      console.log('Inside Report Routes');
      let reportService = new ReportService();
      let user = req.user;
      let projectId =  req.params.id;
      let reportType =  req.params.type;
      let projectRate =  req.params.rate;
      let projectArea =  req.params.area;

      console.log('User : '+JSON.stringify(user));
      console.log('reportType : '+reportType);
      console.log('projectId : '+projectId);
      console.log('projectRate : '+projectRate);
      console.log('projectArea : '+projectArea);
      reportService.getReport(projectId, reportType, projectRate, projectArea,  user, (error, result) => {
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

  getBuildingCostHeadDetails(req: express.Request, res: express.Response, next: any): void {
    try {
      let reportService = new ReportService();
      let user = req.user;
      let buildingId =  req.params.buildingId;
      let costHead =  req.params.costHead;

      reportService.getReportCostHeadDetails(buildingId, costHead,  user, (error, result) => {
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
export  = ReportController;
