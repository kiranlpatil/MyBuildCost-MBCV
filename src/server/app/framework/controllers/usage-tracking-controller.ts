import express= require('express');
import Messages = require('../shared/messages');
import UsageTrackingService = require('../services/usage-tracking.service');
import UsageTrackingModel = require("../dataaccess/mongoose/usage-tracking.interface");

export class UsageTrackingController {

  create(req: express.Request, res: express.Response, next: express.NextFunction) {
    let usageTrackingService = new UsageTrackingService();
    let usageData: UsageTrackingModel = <UsageTrackingModel>req.body.usageTrackingData;
    usageTrackingService.create(usageData, (error, status) => {
      if (error) {
        next({
          reason: Messages.MSG_ERROR_UPDATING_USAGE_DETAIL,
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
  }

}
