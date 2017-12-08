import * as express from "express";
import {RecruiterCandidatesListsService} from "../../../../client/app/cnext/framework/candidate-lists.service";
import {RecruiterCandidatesService} from "../services/recruiter-candidates.service";
import Messages = require("../shared/messages");

export class RecruiterCandidatesController {

  getSummary(req: express.Request, response: express.Response, next: express.NextFunction) {
    let recruiterId: number = req.params.id;
    let fromDate: string = req.query.from;
    let toDate: string = req.query.to;
    let recruiterCandidatesService = new RecruiterCandidatesService();
    recruiterCandidatesService.getSummary(recruiterId, fromDate, toDate, (error: Error, data: any) => {
      if (error) {
        next({
          reason: Messages.MSG_ERROR_CREATING_EXCEL,
          message: Messages.MSG_ERROR_CREATING_EXCEL,
          stackTrace: error,
          code: 500
        });
      } else {
        let summary = recruiterCandidatesService.sortData(data);
        response.status(200).send({
          'data': summary,
          'status': 'success'
        });
      }
    });
  }
}
