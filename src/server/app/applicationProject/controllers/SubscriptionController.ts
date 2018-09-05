import SubscriptionService = require('../services/SubscriptionService');
import Response = require('../interceptor/response/Response');
import * as express from "express";
let config = require('config');
var hashKey = require('js-sha512');
let payumoney = require('payumoney-node');
var log4js = require('log4js');
var logger=log4js.getLogger('Subscription Controller');
import CostControllException = require('../exception/CostControllException');
import { PayUMoneyModel } from '../../framework/dataaccess/model/PayUMoneyModel';
import UserService = require('../../framework/services/UserService');

class SubscriptionController {
  private  _subscriptionService : SubscriptionService;
  private _userService : UserService;

  constructor() {
    this._subscriptionService = new SubscriptionService();
    this._userService = new UserService();
  }

  addSubscriptionPackage(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Subscription Controller, addSubscriptionPackage has been hit');
      let subscriptionPackage = req.body.package;
      let user = req.user;
      let subscriptionService: SubscriptionService = new SubscriptionService();
      subscriptionService.addSubscriptionPackage( subscriptionPackage,(error, result) => {
        if(error) {
          next(error);
        } else {
          logger.info('Create Subscription  success');
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  getBaseSubscriptionPackageList(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Subscription Controller, getSubscriptionPackageList has been hit');
      let subscriptionService: SubscriptionService = new SubscriptionService();
      subscriptionService.getBaseSubscriptionPackageList( (error, result) => {
        if(error) {
          next(error);
        } else {
          logger.info('Get base Subscription package list success');
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  getSubscriptionPackageByName(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Subscription  Controller, getSubscriptionPackageByName has been hit');
      let packageName: any;
      let packageType : any;
      if(req.body.basePackageName !== undefined) {
        packageName = req.body.basePackageName;
        packageType = 'BasePackage';
      } else {
        packageName = req.body.addOnPackageName;
        packageType = 'AddOnPackage';
      }
      let subscriptionService: SubscriptionService = new SubscriptionService();
      subscriptionService.getSubscriptionPackageByName( packageName, packageType, (error, result) => {
        if(error) {
          next(error);
        } else {
          logger.info('Get Subscription success');
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  generatePayUMoneyTransacction(req: express.Request, res: express.Response, next: any): void {
    try {
      let paymentBody = req.body;
      let subscriptionService: SubscriptionService = new SubscriptionService();
      subscriptionService.makePayUMoneyPayment(paymentBody,(error, result) => {
        if(error) {
          next(error);
        } else {
          logger.info('Get Subscription success');
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  successPayment(req: express.Request, res: express.Response, next: any): void {
    try {
      console.log('payment success : '+ JSON.stringify(req.body));
      let pkgName = req.body.productinfo;
      let redirectUrl = config.get('application.browser.IP') +'package-details/payment/'+pkgName+'/success';
      res.redirect(redirectUrl);
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  failurePayment(req: express.Request, res: express.Response, next: any): void {
    try {
      let body = req.body;
      console.log('payment failed : '+ JSON.stringify(body));
      res.redirect(config.get('application.browser.IP') +'package-details/payment/failure');
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  makePayUMoneyPayment(req: express.Request, res: express.Response, next: any): void {
    try {
      let paymentBody = req.body;
      let subscriptionService: SubscriptionService = new SubscriptionService();
      subscriptionService.makeRAPayment(paymentBody,(error, result) => {
        if(error) {
          next(error);
        } else {
          logger.info('Get Subscription success');
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  successRateAnalysisPayment(req: express.Request, res: express.Response, next: any): void {
    try {
      let userId = req.params.userId;
      let deviceType = req.params.deviceType;
      let userService = new UserService();
      userService.updateSubscriptionDetails(userId,(error, result)=> {
        if(error) {
          next(error);
        } else {
          if(deviceType === 'mobile') {
            console.log('Success Done');
          } else {
            res.redirect(config.get('application.browser.rateAnalysisIP') +'payment/success');
          }
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  failureRateAnalysisPayment(req: express.Request, res: express.Response, next: any): void {
    try {
      let body = req.body;
      let userId = req.params.userId;
      let deviceType = req.params.deviceType;
      let paymentStatus = 'failure';
      let userService = new UserService();
      userService.updatePaymentStatus(userId, paymentStatus,(error, result)=> {
        if(error) {
          next(error);
        } else {
          if(deviceType === 'mobile') {
            console.log('Failure Done');
          } else {
            res.redirect(config.get('application.browser.rateAnalysisIP') + 'payment/failure');
          }
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  resetPaymentStatus(req: express.Request, res: express.Response, next: any): void {
    try {
      let body = req.body;
      let userId = req.params.userId;
      let userService = new UserService();
      let paymentStatus = '';
      userService.updatePaymentStatus(userId, paymentStatus, (error, result)=> {
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

export = SubscriptionController;
