import * as express from 'express';
import Messages = require('../shared/messages');
import JobProfileModel = require('../dataaccess/model/jobprofile.model');
import JobProfileService = require('../services/jobprofile.service');
import CNextMessages = require('../shared/cnext-messages');
import SearchService = require('../search/services/search.service');
import { UsageTracking } from '../dataaccess/model/usage-tracking';
import {Actions, ConstVariables} from '../shared/sharedconstants';
import RecruiterService = require('../services/recruiter.service');
let usestracking = require('uses-tracking');


export function searchCandidatesByJobProfile(req: express.Request, res: express.Response, next: any) {
  try {
    let jobProfile: JobProfileModel = <JobProfileModel>req.body;
    let jobProfileService: JobProfileService = new JobProfileService();
    jobProfileService.searchCandidatesByJobProfile(jobProfile, (error, result) => {
      if (error) {
        next({
          reason: 'No candidates are present for this Job Profile',//Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
          message: Messages.MSG_ERROR_WRONG_TOKEN,
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
    res.status(403).send({message: e.message});
  }

}

export function retrieve(req: express.Request, res: express.Response, next: any) {
  try {
    var jobProfileService = new JobProfileService();
    let data = {
      'postedJob': req.params.id
    };
    jobProfileService.retrieve(data, (error, result) => {
      if (error) {
        next({
          reason: CNextMessages.PROBLEM_IN_RETRIEVE_JOB_PROFILE,
          message: CNextMessages.PROBLEM_IN_RETRIEVE_JOB_PROFILE,
          code: 401
        });
      } else {
        let currentDate = Number(new Date());
        let expiringDate = Number(new Date(result.postedJobs[0].expiringDate));
        let daysRemainingForExpiring = Math.round(Number(new Date(expiringDate - currentDate))/(1000*60*60*24));
        result.postedJobs[0].daysRemainingForExpiring = daysRemainingForExpiring;
        if (daysRemainingForExpiring <= 0) {
          result.postedJobs[0].isJobPostExpired=true;

        } else{
          result.postedJobs[0].isJobPostExpired=false;

        }
        res.status(200).send({
          'data': {
            'industry': result
          }
        });
      }


    });
  } catch (e) {
    res.status(403).send({message: e.message});
  }
}

export function getCapabilityMatrix(req: express.Request, res: express.Response, next: any) {
  try {
    var jobProfileService = new JobProfileService();
    let data = {
      'postedJob': req.params.id
    };
    jobProfileService.getCapabilityValueKeyMatrix(req.params.id, (error, result) => {
      if (error) {
        next({
          reason: CNextMessages.PROBLEM_IN_RETRIEVE_JOB_PROFILE,
          message: CNextMessages.PROBLEM_IN_RETRIEVE_JOB_PROFILE,
          code: 401
        });
      } else {
        res.status(200).send({
          'data': result
        });
      }

    });
  } catch (e) {
    res.status(403).send({message: e.message});
  }
}


export function update(req: express.Request, res: express.Response, next: any) {
  try {

    var jobProfileService = new JobProfileService();
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
          reason: Messages.MSG_ERROR_RSN_USER_NOT_FOUND,
          message: Messages.MSG_ERROR_RSN_USER_NOT_FOUND,
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
    res.status(403).send({message: e.message});
  }
}

export function apply(req: express.Request, res: express.Response, next: any) {
  try {
    var jobProfileService = new JobProfileService();
    let data = {
      'candidateId': req.params.id,
      'profileId': req.params.profileId,
      'action': req.params.action,
      'listName': req.params.listName
    };
    jobProfileService.applyJob(data, (err, result) => {
      if (err) {
        next({
          reason: Messages.MSG_ERROR_RSN_USER_NOT_FOUND,
          message: Messages.MSG_ERROR_RSN_USER_NOT_FOUND,
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
    res.status(403).send({message: e.message});
  }

}

export function metchResultForJob(req: express.Request, res: express.Response, next: any) {
  try {
    var searchService = new SearchService();
    let jobId = req.params.jobId;
    let candidateId = req.params.candidateId;
    searchService.getMatchingResult(candidateId, jobId, false,(error: any, result: any) => {
      if (error) {
        next({
          reason: 'Problem in Search Matching Result',//Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
          message: 'Problem in Search Matching Result',//Messages.MSG_ERROR_WRONG_TOKEN,
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
    res.status(403).send({message: e.message});
  }
}
export function createUsesTracking(req: express.Request, res: express.Response) {
  try {
    let data : UsageTracking;
    data = req.body;
    data.timestamp = new Date();
    let obj: any = new usestracking.MyController();
    obj._controller.create(data);
    res.send({
      'status': 'success',
    });
  } catch (e) {
    res.status(403).send({message: e.message});
  }
}

export function getQCardDetails(req: express.Request, res: express.Response, next: any) {
  try {
    var jobProfileService = new JobProfileService();
    let data = {
      'jobId': req.params.id,
      'candidateIds': req.body.candidateIds
    };
    jobProfileService.getQCardDetails(data, (error: Error, result: any) => {
      if (error) {
        res.status(304).send(error);
      } else {
        res.status(200).send(result);
      }
    });
  } catch (e) {
    res.status(403).send({message: e.message});
  }
}
export function cloneJob(req: express.Request, res: express.Response, next: any) {
  try {
    var newJobTitle = req.query.newJobTitle;
    var jobProfileService = new JobProfileService();
    let data = {
      'postedJob':req.params.id
    };
    jobProfileService.retrieve(data, (error, result) => {
      if (error) {
        next({
          reason: CNextMessages.PROBLEM_IN_RETRIEVE_JOB_PROFILE,
          message: CNextMessages.PROBLEM_IN_RETRIEVE_JOB_PROFILE,
          code: 401
        });
      } else {
        var newJob:any=result.postedJobs[0];

        delete newJob._id;
        newJob.jobTitle=newJobTitle;
        newJob.isJobPosted=false;
        newJob.isJobShared=false;
        newJob.sharedLink='';
        newJob.postingDate = new Date();
        newJob.candidate_list=[];
        newJob.isJobPostClosed = false;
        newJob.jobCloseReason = null;

        newJob.expiringDate = new Date((new Date().getTime() + ConstVariables.JOB__EXPIRIY_PERIOD));
        var recruiterService = new RecruiterService();
        recruiterService.addCloneJob( result.userId, newJob, (err, result) => {
            if (err) {
              next({
                reason:err,
                message: err.message,
                code: 403
              });
            } else {
              res.status(200).send({
                'status': Messages.STATUS_SUCCESS,
                'data': result.postedJobs[0]._id
              });
            }
          });
      }

    });
  } catch (e) {
    res.status(403).send({message: e.message});
  }
}

