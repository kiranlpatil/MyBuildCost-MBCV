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
    router.get('/costHeads', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
      controller.getRateAnalysisCostHeads, this._responseInterceptor.exit);

    router.get('/workItems', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
      controller.getRateAnalysisWorkItems, this._responseInterceptor.exit);

    router.get('/costHead/:id/workItems', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
      controller.getRateAnalysisWorkItemsByCostHeadId, this._responseInterceptor.exit);

    router.get('/costHead/:costHeadId/workItem/:workitemId', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
      controller.getRate, this._responseInterceptor.exit);
    return router;
  }
}

Object.seal(RateAnalysisRoutes);
export = RateAnalysisRoutes;
