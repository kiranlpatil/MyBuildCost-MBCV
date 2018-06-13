import SubscriptionService = require('../services/SubscriptionService');
import Response = require('../interceptor/response/Response');
import * as express from "express";
import CostControllException = require('../exception/CostControllException');

let config = require('config');
var log4js = require('log4js');
var logger=log4js.getLogger('Subscription Controller');
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
}

export = SubscriptionController;
