import express = require('express');
import ReportController = require('./../controllers/ReportController');
import AuthInterceptor = require('./../../framework/interceptor/auth.interceptor');
import LoggerInterceptor = require('./../../framework/interceptor/LoggerInterceptor');
import { Inject } from 'typescript-ioc';
import RequestInterceptor = require('../interceptor/request/RequestInterceptor');
import ResponseInterceptor = require('../interceptor/response/ResponseInterceptor');

var router = express.Router();

class ReportRoutes {
  private _reportController: ReportController;
  private authInterceptor: AuthInterceptor;
  private loggerInterceptor: LoggerInterceptor;
  @Inject
  private _requestInterceptor: RequestInterceptor;
  @Inject
  private _responseInterceptor: ResponseInterceptor;

  constructor () {
    this._reportController = new ReportController();
    this.authInterceptor = new AuthInterceptor();
  }
  get routes () : express.Router {

    var controller = this._reportController;

    //Provide all buildings in a Project with thumbrule and estimate report with particular area and unit.
    router.get('/:reportType/project/:projectId/rate/:costingUnit/area/:costingArea', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
      controller.getProject, this._responseInterceptor.exit);

    //Provide all costheads from rate analysis
    router.get('/costHeads', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
      controller.getRateAnalysisCostHeads, this._responseInterceptor.exit);

    //Provide all workitems from rate analysis
    router.get('/workItems', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
      controller.getRateAnalysisWorkItems, this._responseInterceptor.exit);
    return router;
  }
}

Object.seal(ReportRoutes);
export = ReportRoutes;
