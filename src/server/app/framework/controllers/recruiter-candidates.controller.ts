import * as express from "express";
import {RecruiterCandidatesService} from "../services/recruiter-candidates.service";
import Messages = require("../shared/messages");
import RecruiterCandidatesModel = require("../dataaccess/model/recruiter-candidate.model");
import RecruiterCandidates = require("../dataaccess/mongoose/recruiter-candidates");
import ExportService = require("../services/export.service");

export class RecruiterCandidatesController {

  getSummary(req: express.Request, response: express.Response, next: express.NextFunction) {
    let recruiterCandidatesModel: RecruiterCandidatesModel = new RecruiterCandidatesModel();
    recruiterCandidatesModel.recruiterId = req.params.id;
    recruiterCandidatesModel.fromDate = req.query.from;
    recruiterCandidatesModel.toDate = req.query.to;
    recruiterCandidatesModel.source = req.query.source;

    let recruiterCandidatesService = new RecruiterCandidatesService();
    recruiterCandidatesService.getSummary(recruiterCandidatesModel,
      (error: Error, data: RecruiterCandidatesModel[]) => {
        if (error) {
          next({
            reason: Messages.MSG_ERROR_FETCHING_MANAGED_CANDIDATES,
            message: Messages.MSG_ERROR_FETCHING_MANAGED_CANDIDATES,
            stackTrace: error,
            code: 400
          });
        } else {
          let summary = recruiterCandidatesService.sortSummaryData(data);
          response.status(200).send({
            'summary': summary,
            'status': 'success'
          });
        }
      });
  }
}
