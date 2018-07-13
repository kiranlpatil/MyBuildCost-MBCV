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

class SubscriptionController {
  private  _subscriptionService : SubscriptionService;

  constructor() {
    this._subscriptionService = new SubscriptionService();
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

  successPayuMoney(req: express.Request, res: express.Response, next: any): void {
    try {
      console.log('payment success : '+ JSON.stringify(req.body));
      let pkgName = req.body.productinfo;
      let redirectUrl = 'http://5d477bbb.ngrok.io/about';
      res.render(redirectUrl);
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

}

export = SubscriptionController;
