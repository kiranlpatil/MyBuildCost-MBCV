import express = require('express');
import RateAnalysisController = require('./../controllers/RateAnalysisController');
import AuthInterceptor = require('./../../framework/interceptor/auth.interceptor');
import LoggerInterceptor = require('./../../framework/interceptor/LoggerInterceptor');
import { Inject } from 'typescript-ioc';
import RequestInterceptor = require('../interceptor/request/RequestInterceptor');
import ResponseInterceptor = require('../interceptor/response/ResponseInterceptor');
var router = express.Router();

class RateAnalysisRoutes {
  private _rateAnalysisController: RateAnalysisController;
  private authInterceptor: AuthInterceptor;
  private loggerInterceptor: LoggerInterceptor;
  @Inject
  private _requestInterceptor: RequestInterceptor;
  @Inject
  private _responseInterceptor: ResponseInterceptor;

  constructor () {
    this._rateAnalysisController = new RateAnalysisController();
    this.authInterceptor = new AuthInterceptor();
  }
  get routes () : express.Router {

    var controller = this._rateAnalysisController;
     //Provide all costheads from RateAnalysis
    router.get('/costHeads', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
      controller.getRateAnalysisCostHeads, this._responseInterceptor.exit);

    //Provide all workitems from RateAnalysis
    router.get('/workItems', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
      controller.getRateAnalysisWorkItems, this._responseInterceptor.exit);

    //Provide workitems from RateAnalysis by costheadId
    router.get('/costHead/:costHeadId/workItems', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
      controller.getRateAnalysisWorkItemsByCostHeadId, this._responseInterceptor.exit);

    //Retrive rate from RateAnalysis for workitem
    router.get('/costHead/:costHeadId/workItem/:workItemId', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
      controller.getRate, this._responseInterceptor.exit);

    router.get('/regions', controller.getAllRegionNames, this._responseInterceptor.exit);

    router.get('/allData/:regionName', controller.getAllDataForDropdown, this._responseInterceptor.exit);

    router.get('/sync', controller.SyncRateAnalysis);
    return router;
  }
}

Object.seal(RateAnalysisRoutes);
export = RateAnalysisRoutes;
