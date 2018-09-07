import UsageTrackingService = require('../services/UsageTrackingService');
import Response = require('../interceptor/response/Response');
import UsageTracking = require('../../applicationProject/dataaccess/model/Users/UsageTracking');
import * as express from 'express';
var log4js = require('log4js');
var logger=log4js.getLogger('Subscription Controller');
import CostControllException = require('../exception/CostControllException');

class UsageTrackingController {
  private  _usageTrackingService : UsageTrackingService;

  constructor() {
    this._usageTrackingService = new UsageTrackingService();
  }

  addUserDeviceDetails(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Subscription Controller, addSubscriptionPackage has been hit');
      let deviceDetails = req.body;

      let userDeviceDetails = new UsageTracking();
      userDeviceDetails.userId = deviceDetails.userId;
      userDeviceDetails.deviceId = deviceDetails.deviceId;
      userDeviceDetails.browser = deviceDetails.browser;
      userDeviceDetails.deviceOS = deviceDetails.os;
      userDeviceDetails.isDesktop = deviceDetails.isDesktop;
      userDeviceDetails.isMobile = deviceDetails.isMobile;
      userDeviceDetails.platform = deviceDetails.platform;
      userDeviceDetails.appType = deviceDetails.appType;
      userDeviceDetails.mobileNumber = deviceDetails.mobileNumber;
      userDeviceDetails.email = deviceDetails.email;

      let usageTrackingService: UsageTrackingService = new UsageTrackingService();
      usageTrackingService.addUserDeviceDetails( userDeviceDetails,(error, result) => {
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

}

export = UsageTrackingController;
