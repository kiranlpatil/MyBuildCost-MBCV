import express = require('express');
import { Inject } from 'typescript-ioc';
import UsageTrackingController = require('./../controllers/UsageTrackingController');
import AuthInterceptor = require('./../../framework/interceptor/auth.interceptor');
import LoggerInterceptor = require('./../../framework/interceptor/LoggerInterceptor');
import RequestInterceptor = require('../interceptor/request/RequestInterceptor');
import ResponseInterceptor = require('../interceptor/response/ResponseInterceptor');

var router = express.Router();

class SubscriptionRoutes {
  private _usageTrackingController: UsageTrackingController;
  private authInterceptor: AuthInterceptor;
  private loggerInterceptor: LoggerInterceptor;
  @Inject
  private _requestInterceptor: RequestInterceptor;
  @Inject
  private _responseInterceptor: ResponseInterceptor;

  constructor () {
    this._usageTrackingController = new UsageTrackingController();
    this.authInterceptor = new AuthInterceptor();
  }
  get routes () : express.Router {

    var controller = this._usageTrackingController;

    router.post('/track', this.authInterceptor.requiresAuth, controller.addUserDeviceDetails, this._responseInterceptor.exit);

    return router;
  }
}

Object.seal(SubscriptionRoutes);
export = SubscriptionRoutes;
