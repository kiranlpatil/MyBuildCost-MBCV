import express= require('express');
import Messages = require('../shared/messages');
import UsageTrackingService = require('../services/usage-tracking.service');
import {UsageTracking} from "../dataaccess/model/usage-tracking.model";

export class UsageTrackingController {

  constructor() {
  }

  create(req: express.Request, res: express.Response, next: any) {
    try {
      let usageTrackingService = new UsageTrackingService();
      let usageTrackingModel: UsageTracking = req.body.usageTrackingData;
      usageTrackingModel.timestamp = new Date();
      console.log("usageData: " + JSON.stringify(usageTrackingModel));
      usageTrackingService.create(usageTrackingModel, (error, result) => {
        if (error) {
          next({
            reason: Messages.MSG_ERROR_UPDATING_USAGE_DETAIL,//Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
            message: Messages.MSG_ERROR_UPDATING_USAGE_DETAIL,
            stackTrace: new Error(),
            actualError: error,
            code: 500
          });
        } else {
          res.send({
            'status': 'success',
          });
        }
      });
    } catch (e) {
      next({
        reason: e.message,
        message: e.message,
        stackTrace: new Error(),
        code: 500
      });
    }
  }

}
