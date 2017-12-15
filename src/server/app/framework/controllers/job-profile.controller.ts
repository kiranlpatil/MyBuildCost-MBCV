import * as express from "express";
import {UsageTracking} from "../dataaccess/model/usage-tracking.model";
import {ConstVariables, Actions} from "../shared/sharedconstants";
import Messages = require('../shared/messages');
import JobProfileModel = require('../dataaccess/model/jobprofile.model');
import JobProfileService = require('../services/jobprofile.service');
import CNextMessages = require('../shared/cnext-messages');
import SearchService = require('../search/services/search.service');
import RecruiterService = require('../services/recruiter.service');
import IJobProfile = require('../dataaccess/mongoose/job-profile');
import UsageTrackingService = require("../services/usage-tracking.service");


export function searchCandidatesByJobProfile(req: express.Request, res: express.Response, next: any) {
  try {
    let jobProfile: JobProfileModel = <JobProfileModel>req.body;
    let jobProfileService: JobProfileService = new JobProfileService();
    jobProfileService.searchCandidatesByJobProfile(jobProfile, (error, result) => {
      if (error) {
        next({
          reason: 'No candidates are present for this Job Profile',//Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
          message: 'No candidates are present for this Job Profile',
          stackTrace: new Error(),
          code: 401
        });
      } else {
        res.send({
          'status': 'success',
          'data': result
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

export function retrieve(req: express.Request, res: express.Response, next: any) {
  try {
    var jobProfileService = new JobProfileService();
    jobProfileService.retrieveByJobId(req.params.id, (error, result: IJobProfile) => {
      if (error) {
        next({
          reason: CNextMessages.PROBLEM_IN_RETRIEVE_JOB_PROFILE,
          message: CNextMessages.PROBLEM_IN_RETRIEVE_JOB_PROFILE,
          stackTrace: new Error(),
          code: 401
        });
      } else {
        let currentDate = Number(new Date());
        let expiringDate = Number(new Date(result.expiringDate));
        let daysRemainingForExpiring = Math.round(Number(new Date(expiringDate - currentDate)) / (1000 * 60 * 60 * 24));
        result.daysRemainingForExpiring = daysRemainingForExpiring;
        if (daysRemainingForExpiring <= 0) {
          result.isJobPostExpired = true;

        } else {
          result.isJobPostExpired = false;

        }
        res.status(200).send({result});
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

export function getCapabilityMatrix(req: express.Request, res: express.Response, next: any) {
  try {
    var jobProfileService = new JobProfileService();
    jobProfileService.getCapabilityValueKeyMatrix(req.params.id, (error, result) => {
      if (error) {
        next({
          reason: CNextMessages.PROBLEM_IN_RETRIEVE_JOB_PROFILE,
          message: CNextMessages.PROBLEM_IN_RETRIEVE_JOB_PROFILE,
          stackTrace: new Error(),
          code: 500
        });
      } else {
        res.status(200).send({
          'data': result
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

export function update(req: express.Request, res: express.Response, next: any) {
  try {

    let jobProfileService = new JobProfileService();
    let data = {
      'recruiterId': req.params.recruiterId,
      'profileId': req.params.profileId,
      'listName': req.params.listName,
      'candidateId': req.params.candidateId,
      'action': req.params.action
    };

    jobProfileService.update(data, (err, result) => {
      if (err) {
        next({
          reason: 'unable to update the jobprofile',
          message: 'unable to update the jobprofile',
          stackTrace: new Error(),
          code: 403
        });
      } else {
        res.status(200).send({
          'status': Messages.STATUS_SUCCESS,
          'data': result
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

export function apply(req: express.Request, res: express.Response, next: any) {
  try {
    let jobProfileService = new JobProfileService();
    let data = {
      'candidateId': req.params.id,
      'profileId': req.params.profileId,
      'action': req.params.action,
      'listName': req.params.listName
    };
    jobProfileService.applyJob(data, (err, result) => {
      if (err) {
        next({
          reason: 'unable to apply the jobprofile',
          message: 'unable to apply the jobprofile',
          stackTrace: new Error(),
          code: 403
        });
      } else {
        res.status(200).send({
          'status': Messages.STATUS_SUCCESS,
          'data': result
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

export function metchResultForJob(req: express.Request, res: express.Response, next: any) {
  try {
    let searchService = new SearchService();
    let jobId = req.params.jobId;
    let candidateId = req.params.candidateId;
    searchService.getMatchingResult(candidateId, jobId, false, (error: any, result: any) => {
      if (error) {
        next({
          reason: 'Problem in Search Matching Result',//Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
          message: 'Problem in Search Matching Result',//Messages.MSG_ERROR_WRONG_TOKEN,
          stackTrace: new Error(),
          code: 401
        });
      } else {
        res.send({
          'status': 'success',
          'data': result,
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

export function getQCardDetails(req: express.Request, res: express.Response, next: any) {
  try {
    let jobProfileService = new JobProfileService();
    let data = {
      'jobId': req.params.id,
      'candidateIds': req.body.candidateIds
    };
    /*jobProfileService.getQCardDetails(data, (error: Error, result: any) => {
     if (error) {
     next(error);
     } else {
     res.status(200).send(result);
     }
     });*/
  } catch (e) {
    next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 500
    });
  }
}

export function cloneJob(req: express.Request, res: express.Response, next: any) {
  try {
    var newJobTitle = req.query.newJobTitle;
    var jobProfileService = new JobProfileService();
    jobProfileService.retrieveByJobId(req.params.id, (error: any, originalJob: IJobProfile) => { //todo use
      if (error) {
        next({
          reason: CNextMessages.PROBLEM_IN_RETRIEVE_JOB_PROFILE,
          message: CNextMessages.PROBLEM_IN_RETRIEVE_JOB_PROFILE,
          stackTrace: new Error(),
          code: 401
        });
      } else {
        let oldId: any = originalJob._id;
        let newJob: any = originalJob;
        delete newJob["_id"];
        newJob.jobTitle = newJobTitle;
        newJob.education='';
        newJob.isJobPosted = false;
        newJob.isJobShared = false;
        newJob.sharedLink = '';
        newJob.postingDate = new Date();
        newJob.candidate_list = [];
        newJob.isJobPostClosed = false;
        newJob.jobCloseReason = null;

        newJob.expiringDate = new Date((new Date().getTime() + ConstVariables.JOB__EXPIRIY_PERIOD));
        var recruiterService = new RecruiterService();
        recruiterService.addCloneJob(oldId, newJob, (err, job) => {
          if (err) {
            next({
              reason: err,
              message: err.message,
              stackTrace: new Error(),
              code: 403
            });
          } else {
            let usageTrackingService = new UsageTrackingService();
            usageTrackingService.customCreate(newJob.recruiterId, req.params.id, '',
              Actions.CLONED_JOB_POST_BY_RECRUITER, (err: Error) => {
              if (err) {
                next({
                  reason: Messages.MSG_ERROR_UPDATING_USAGE_DETAIL,
                  message: Messages.MSG_ERROR_UPDATING_USAGE_DETAIL,
                  stackTrace: new Error(),
                  actualError: err,
                  code: 500
                });
              }
            });
            res.status(200).send({
              'status': Messages.STATUS_SUCCESS,
              'data': job._id
            });
          }
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

