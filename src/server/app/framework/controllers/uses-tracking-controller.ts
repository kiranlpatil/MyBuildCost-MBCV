import express= require('express');
import {Actions} from '../shared/sharedconstants';
let usestracking = require('uses-tracking');

class UsesTrackingController {
  usesTrackingController: any;

  constructor() {
  }

  create(req: express.Request, res: express.Response,next:any) {
    try {
      let uses_data = {
        recruiterId: req.params.recruiterId,
        candidateId: req.params.candidateId,
        jobProfileId: req.params.jobProfileId,
        timestamp: new Date(),
        action: Actions.DEFAULT_VALUE
      };
      if (req.params.action.toString() === 'add') {
        uses_data.action = Actions.ADDED_IN_TO_COMPARE_VIEW_BY_RECRUITER;
      } else {
        uses_data.action = Actions.REMOVED_FROM_COMPARE_VIEW_BY_RECRUITER;
      }
      let obj: any = new usestracking.MyController();
      this.usesTrackingController = obj._controller;
      this.usesTrackingController.create(uses_data);
      res.send({
        'status': 'success',
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

export = UsesTrackingController;
