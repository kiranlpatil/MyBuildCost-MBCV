import * as express from "express";
import AuthInterceptor = require('../interceptor/auth.interceptor');
import Messages = require('../shared/messages');
import CandidateService = require('../services/candidate.service');
import RecruiterModel = require('../dataaccess/model/recruiter.model');
import RecruiterService = require('../services/recruiter.service');
import JobProfileModel = require('../dataaccess/model/jobprofile.model');
import CNextMessages = require('../shared/cnext-messages');
import SearchService = require('../search/services/search.service');
import CandidateInfoSearch = require('../dataaccess/model/candidate-info-search');
import CandidateModel = require('../dataaccess/model/candidate.model');
import UserService = require('../services/user.service');
import CandidateSearchService = require('../services/candidate-search.service');
import IJobProfile = require("../dataaccess/mongoose/job-profile");
import UsageTrackingService = require('../services/usage-tracking.service');

export function create(req: express.Request, res: express.Response, next: any) {
  try {

    let newUser: RecruiterModel = <RecruiterModel>req.body;
    let recruiterService = new RecruiterService();
    recruiterService.createUser(newUser, (error, result) => {
      if (error) {
        if (error === Messages.MSG_ERROR_CHECK_EMAIL_PRESENT) {
          next({
            reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
            message: Messages.MSG_ERROR_VERIFY_ACCOUNT,
            stackTrace: new Error(),
            code: 400
          });
        } else if (error === Messages.MSG_ERROR_CHECK_MOBILE_PRESENT) {
          next({
            reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
            message: Messages.MSG_ERROR_REGISTRATION_MOBILE_NUMBER,
            stackTrace: new Error(),
            code: 400
          });
        } else {
          next({
            reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
            message: Messages.MSG_ERROR_USER_WITH_EMAIL_PRESENT,
            stackTrace: new Error(),
            code: 400
          });
        }
      }
      else {
        let auth: AuthInterceptor = new AuthInterceptor();
        let token = auth.issueTokenWithUid(result);
        res.status(200).send({
          'status': Messages.STATUS_SUCCESS,
          'data': {
            'reason': Messages.MSG_SUCCESS_REGISTRATION,
            '_id': result.userId,
            'company_name': result.company_name,
            'current_theme': result.current_theme,
            'email': result.email,
            'isRecruitingForself': result.isRecruitingForself,
            'mobile_number': result.mobile_number,
            'isCandidate': result.iscandidate
          },
          access_token: token
        });
      }
    });
  } catch (e) {
    next({reason: e.message, message: e.message, stackTrace: new Error(), code: 500});
  }
}

export function postJob(req: express.Request, res: express.Response, next: any) {
  try {
    var newJob: JobProfileModel = <JobProfileModel>req.body.postedJobs;
    var recruiterService = new RecruiterService();
    var userId = req.params.id;
    if (newJob._id !== undefined && newJob._id !== null && newJob._id !== '') {

      let currentDate = Number(new Date());
      let expiringDate = Number(new Date(newJob.expiringDate));
      let daysRemainingForExpiring = Math.round(Number(new Date(expiringDate - currentDate)) / (1000 * 60 * 60 * 24));
      newJob.daysRemainingForExpiring = daysRemainingForExpiring;
      if (daysRemainingForExpiring <= 0) {
        newJob.isJobPostExpired = true;

      } else {
        newJob.isJobPostExpired = false;
      }


      recruiterService.updateJob(userId, newJob, (err, result) => {
        if (err) {
          next({
            reason: Messages.MSG_ERROR_UPDATE_JOB,
            message: Messages.MSG_ERROR_UPDATE_JOB,
            stackTrace: new Error(),
            actualError: err,
            code: 403
          });
        } else {
          recruiterService.updateUsageTrackingData(result, newJob, (error) => {
            if (error) {
              next({
                reason: Messages.MSG_ERROR_UPDATING_USAGE_DETAIL,
                message: Messages.MSG_ERROR_UPDATING_USAGE_DETAIL,
                stackTrace: new Error(),
                actualError: err,
                code: 500
              });
            } else {
              res.status(200).send({
                'status': Messages.STATUS_SUCCESS,
                'data': result
              });
            }
          });
        }
      });
    } else {
      recruiterService.addJob(userId, newJob, (err: any, result: any) => {
        if (err) {
          next({
            reason: Messages.MSG_ERROR_CREATE_JOB,
            message: Messages.MSG_ERROR_CREATE_JOB,
            stackTrace: new Error(),
            actualError: err,
            code: 403
          });
        } else {
          recruiterService.updateUsageTrackingData(result, newJob, (error) => {
            if (error) {
              next({
                reason: Messages.MSG_ERROR_UPDATING_USAGE_DETAIL,
                message: Messages.MSG_ERROR_UPDATING_USAGE_DETAIL,
                stackTrace: new Error(),
                actualError: err,
                code: 500
              });
            } else {
              res.status(200).send({
                'status': Messages.STATUS_SUCCESS,
                'data': result
              });
            }
          });
        }
      });
    }

  } catch (e) {
    next({reason: e.message, message: e.message, stackTrace: new Error(), code: 500});
  }
}

export function updateDetails(req: express.Request, res: express.Response, next: any) {
  try {
    var newRecruiter: RecruiterModel = <RecruiterModel>req.body;
    var params = req.query;
    delete params.access_token;
    var userId: string = req.params.id;
    var auth: AuthInterceptor = new AuthInterceptor();
    var recruiterService = new RecruiterService();
    recruiterService.updateDetails(userId, newRecruiter, (error, result) => {
      if (error) {
        next(error);
      } else {
        res.send({
          'status': 'success',
          'data': result
        });
      }
    });
  } catch (e) {
    next({reason: e.message, message: e.message, stackTrace: new Error(), code: 500});
  }
}

export function getRecruiterDetails(req: express.Request, res: express.Response, next: any) {
  try {
    let recruiterService = new RecruiterService();
    let userService = new UserService();
    recruiterService.retrieve({'_id': req.params.id}, (error: any, result: any) => {
      if (error) {
        next({
          reason: CNextMessages.PROBLEM_IN_RETRIEVE_JOB_PROFILE,
          message: CNextMessages.PROBLEM_IN_RETRIEVE_JOB_PROFILE,
          stackTrace: new Error(),
          code: 401
        });
      } else {
        userService.retrieve({'_id': result[0].userId}, (error: any, userDetails: any) => {
          if (error) {
            next({
              reason: CNextMessages.PROBLEM_IN_RETRIEVE_JOB_PROFILE,
              message: CNextMessages.PROBLEM_IN_RETRIEVE_JOB_PROFILE,
              stackTrace: new Error(),
              code: 401
            });
          } else {
            let _details = userDetails[0];
            delete _details['password'];
            delete _details['isActivated'];
            delete _details['otp'];
            delete _details['isAdmin'];
            delete _details['guide_tour'];
            res.send({
              'status': 'success',
              'data': result[0],
              'metadata': _details
            });
          }

        });
      }
    });
  } catch (e) {
    next({reason: e.message, message: e.message, stackTrace: new Error(), code: 500});
  }
}

export function retrieve(req: express.Request, res: express.Response, next: any) {
  try {
    let recruiterService = new RecruiterService();
    recruiterService.getJobsByRecruiterIdAndItsCount(req.params.id, (error: any, result: any) => {
      if (error) {
        next({
          reason: CNextMessages.PROBLEM_IN_RETRIEVE_JOB_PROFILE,
          message: CNextMessages.PROBLEM_IN_RETRIEVE_JOB_PROFILE,
          stackTrace: new Error(),
          code: 401
        });
      } else {
        if (result) {
          res.status(200).send({
            'status': Messages.STATUS_SUCCESS,
            'data': result,
            'jobCountModel': result.jobCountModel
          });
        } else { //todo reviewed by Rahul and then remove this todo
          res.status(500).send({
            'status': Messages.MSG_ERROR_INVALID_ID,
          });
        }
      }
    });


  } catch (e) {
    next({reason: e.message, message: e.message, stackTrace: new Error(), code: 500});
  }
}

export function getFilterList(req: express.Request, res: express.Response, next: any) {
  __dirname = './';
  let filepath = 'recruiter-filter-list.json';
  try {
    res.sendFile(filepath, {root: __dirname});
  } catch (e) {
    next({reason: e.message, message: e.message, stackTrace: new Error(), code: 500});
  }
}

export function getList(req: express.Request, res: express.Response, next: any) {
  console.log('Remove this code');
}

export function getCompareDetailsOfCandidate(req: express.Request, res: express.Response, next: any) {

  try {
    let searchService = new SearchService();
    let params = req.query;
    let jobId = req.params.jobId;
    let recruiterId = req.params.id;
    let candidateId: string[] = JSON.parse(params.candidateId);
    searchService.getMultiCompareResult(candidateId, jobId, recruiterId, false, (error: any, result: any) => {
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
    next({reason: e.message, message: e.message, stackTrace: new Error(), code: 500});
  }

}

export function getCandidatesByName(req: express.Request, res: express.Response, next: any) {
  try {
    let userService = new UserService();
    let candidateService = new CandidateService();
    let candidateSearchService = new CandidateSearchService();
    let userName = req.params.searchvalue;
    let query: any;
    let searchValueArray: string[] = userName.split(" ");
    let included: any = {
      '_id': 1
    };
    if (searchValueArray.length > 1) {
      let exp1 = eval('/^' + searchValueArray[0] + '/i');
      let exp2 = eval('/^' + searchValueArray[1] + '/i');
      let searchString1: string = exp1.toString().replace(/'/g, "");
      let searchString2: string = exp2.toString().replace(/'/g, "");
      query = {
        'isCandidate': true,
        $or: [{
          'first_name': {$regex: eval(searchString1)},
          'last_name': {$regex: eval(searchString2)}
        }, {'first_name': {$regex: eval(searchString2)}, 'last_name': {$regex: eval(searchString1)}}]
      };
    } else {
      let exp = eval('/^' + searchValueArray[0] + '/i');
      let searchString: string = exp.toString().replace(/'/g, "");

      query = {
        'isCandidate': true,
        $or: [{'first_name': {$regex: eval(searchString)}}, {'last_name': {$regex: eval(searchString)}}]
      };
    }
    userService.retrieveWithLimit(query, included, (error: any, result: any) => {
      if (error) {
        next({
          reason: 'Problem in Search user details',
          message: 'Problem in Search user details',
          stackTrace: new Error(),
          code: 401
        });
      } else {
        var candidateId: string[] = new Array(0);
        for (let obj of result) {
          candidateId.push(obj._id);
        }
        candidateSearchService.getCandidateInfo(candidateId, (error: any, candidateInfo: CandidateModel[]) => {
          if (error) {
            next({
              reason: 'Problem in Search user details',
              message: 'Problem in Search user details',
              stackTrace: new Error(),
              code: 401
            });
          } else {
            let searchArray: CandidateInfoSearch[] = candidateSearchService.buidResultOnCandidateSearch(candidateInfo);
            res.send({
              'status': 'success',
              'data': searchArray,
            });
          }
        });
      }
    });

  } catch (e) {
    next({reason: e.message, message: e.message, stackTrace: new Error(), code: 500});
  }

}

export function notifyRecruiter(req: express.Request, res: express.Response, next: any) {
  try {

    let recruiterService = new RecruiterService();
    let params = req.body;
    recruiterService.notifyRecruiter(params, (error, result) => {
      if (error) {
        next({
          reason: Messages.MSG_ERROR_RSN_WHILE_CONTACTING,
          message: Messages.MSG_ERROR_WHILE_CONTACTING,
          stackTrace: new Error(),
          code: 403
        });
      } else {
        res.status(200).send({
          'status': Messages.STATUS_SUCCESS,
          'data': {'message': Messages.MSG_SUCCESS_EMAIL}
        });
      }
    });
  } catch (e) {
    next({reason: e.message, message: e.message, stackTrace: new Error(), code: 500});

  }
}

export function responseToRecruiter(req: express.Request, res: express.Response, next: any) {
  try {
    let recruiterService = new RecruiterService();
    let user = req.user;
    let params = req.body;
    recruiterService.sendMailToRecruiter(user, params, (error, result) => {
      if (error) {
        next({
          reason: Messages.MSG_ERROR_RSN_WHILE_CONTACTING,
          message: Messages.MSG_ERROR_WHILE_CONTACTING,
          stackTrace: new Error(),
          code: 403
        });
      } else {
        res.status(200).send({
          'status': Messages.STATUS_SUCCESS,
          'data': {'message': Messages.MSG_SUCCESS_EMAIL}
        });
      }
    });
  } catch (e) {
    next({reason: e.message, message: e.message, stackTrace: new Error(), code: 500});

  }
}


