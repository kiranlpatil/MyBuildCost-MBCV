import express = require('express');
import SubscriptionController = require('./../controllers/SubscriptionController');
import AuthInterceptor = require('./../../framework/interceptor/auth.interceptor');
import LoggerInterceptor = require('./../../framework/interceptor/LoggerInterceptor');
import { Inject } from 'typescript-ioc';
import RequestInterceptor = require('../interceptor/request/RequestInterceptor');
import ResponseInterceptor = require('../interceptor/response/ResponseInterceptor');
import ReportRequestValidator = require('../interceptor/request/validation/SubscriptionInterceptor');

var router = express.Router();

class SubscriptionRoutes {
  private _subscriptionController: SubscriptionController;
  private authInterceptor: AuthInterceptor;
  private loggerInterceptor: LoggerInterceptor;
  @Inject
  private _requestInterceptor: RequestInterceptor;
  @Inject
  private _responseInterceptor: ResponseInterceptor;
  @Inject
  private reportRequestValidator: ReportRequestValidator;

  constructor () {
    this._subscriptionController = new SubscriptionController();
    this.authInterceptor = new AuthInterceptor();
    this.reportRequestValidator = new ReportRequestValidator();
  }
  get routes () : express.Router {

    var controller = this._subscriptionController;

    //Add Subscription Package
    router.post('/',  controller.addSubscriptionPackage, this._responseInterceptor.exit);

    router.post('/payUMoney',  controller.generatePayUMoneyTransacction, this._responseInterceptor.exit);

    router.post('/payment/success',  controller.successPayment, this._responseInterceptor.exit);

    router.post('/payment/failure',  controller.failurePayment, this._responseInterceptor.exit);

    router.get('/basepackageslist', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
      controller.getBaseSubscriptionPackageList, this._responseInterceptor.exit);

    router.post('/by/name', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
      this.reportRequestValidator.getSubscriptionPackageByName, controller.getSubscriptionPackageByName, this._responseInterceptor.exit);

    // Rate App test API
    router.post('/pay/success',  controller.successPayuMoney, this._responseInterceptor.exit);

    return router;
  }
}

Object.seal(SubscriptionRoutes);
export = SubscriptionRoutes;
