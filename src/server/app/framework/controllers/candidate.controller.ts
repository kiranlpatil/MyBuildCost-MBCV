import * as express from "express";
import * as mongoose from "mongoose";
import AuthInterceptor = require('../interceptor/auth.interceptor');
import Messages = require('../shared/messages');
import CandidateModel = require('../dataaccess/model/candidate.model');
import CandidateService = require('../services/candidate.service');
import UserService = require('../services/user.service');
import SearchService = require('../search/services/search.service');
import CandidateInfoSearch = require('../dataaccess/model/candidate-info-search');
import { MailChimpMailerService } from '../services/mailchimp-mailer.service';
import CandidateSearchService = require("../services/candidate-search.service");
import {CandidateDetailsWithJobMatching} from "../dataaccess/model/candidatedetailswithjobmatching";
import CandidateClassModel = require("../dataaccess/model/candidate-class.model");
import {UtilityFunction} from "../uitility/utility-function";


export function create(req: express.Request, res: express.Response, next: any) {
  try {
    let newUser: CandidateModel = <CandidateModel>req.body;
    let candidateService = new CandidateService();
    candidateService.createUser(newUser, (error, result) => {
      if (error) {
        if (error == Messages.MSG_ERROR_CHECK_EMAIL_PRESENT) {
          next({
            reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
            message: Messages.MSG_ERROR_VERIFY_ACCOUNT,
            stackTrace: new Error(),
            code: 400
          });
        }
        else if (error == Messages.MSG_ERROR_CHECK_MOBILE_PRESENT) {
          next({
            reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
            message: Messages.MSG_ERROR_REGISTRATION_MOBILE_NUMBER,
            stackTrace: new Error(),
            code: 400
          });
        }
        else {
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
          },
          access_token: token
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


export function updateDetails(req: express.Request, res: express.Response, next: any) {
  try {
    let updatedCandidate: CandidateModel = <CandidateModel>req.body;
    let params = req.query;
    delete params.access_token;
    let userId: string = req.params.id;
    let auth: AuthInterceptor = new AuthInterceptor();
    let isEditingProfile: boolean=false;

    /*let userService = new UserService();
     let query = {"_id": userId};
     let updateData = {"location": updatedCandidate.professionalDetails.location};*/
    let candidateService = new CandidateService();
    let mailChimpMailerService = new MailChimpMailerService();


    candidateService.get(userId, (error, result) => {
      if (error) {
        next(error);
      } else {
        updatedCandidate.lastUpdateAt=new Date().toISOString();
        if (result && result.isSubmitted) {
          isEditingProfile = true;
        }
    candidateService.update(userId, updatedCandidate, (error, result) => {
      if (error) {
        next(error);
      } else {
        candidateService.retrieve(result._id, (error, result) => {
          if (error) {
            next({
              reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
              message: Messages.MSG_ERROR_WRONG_TOKEN,
              stackTrace: new Error(),
              code: 400
            });
          } else {
            if(!isEditingProfile && updatedCandidate.isSubmitted) {
                mailChimpMailerService.onCandidatePofileSubmitted(req.body.basicInformation);}
            res.send({
              'status': 'success',
              'data': result
            });
          }
        });
      }
    });
    /*userService.findOneAndUpdate(query, updateData, {new: true}, (error, result) => {
     if (error) {
     next(error);
     } else {
     res.send({
     "status": "Success",
     "data": {"data": result}
     });
     }
     });*/

      }
    });
  }
  catch (e) {
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
    let candidateId: string = req.params.id;
    let candidateService = new CandidateService();
    candidateService.getCapabilityValueKeyMatrix(candidateId, (error, result) => {
      if (error) {
        next(error);
      }
      else {
          res.send({
            'status': 'success',
            'data': result,
          });
      }
    });
  }
  catch (e) {
   next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 500
    });
  }
}


export function retrieve(req: express.Request, res: express.Response, next: any) { //todo authentication is remaining
  try {
    let userService = new UserService();
    let candidateService = new CandidateService();
    let params = req.params.id;
    let candidateId = req.params.candidateId;
    let recruiterUserId = req.user._id;
    if (candidateId) {
      candidateService.findById(candidateId, (error, resu) => {
        if (error) {
          next({
            reason: 'User Not Available',//Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
            message: 'User is not available',//Messages.MSG_ERROR_WRONG_TOKEN,
            stackTrace: new Error(),
            code: 401
          });
        }
        else {
          userService.findById(resu.userId, (error, result) => {
            if (error) {
              next({
                reason: 'User Not Available',//Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
                message: 'User is not available',//Messages.MSG_ERROR_WRONG_TOKEN,
                stackTrace: new Error(),
                code: 401
              })
            } else {
              candidateService.checkIsCarted(resu.userId,recruiterUserId, (err, isCarted) => {
                if(err) {
                  next(err);
                } else {
                      if(!isCarted && (!req.user.isCandidate || !req.user.isAdmin)) {
                        result.last_name = UtilityFunction.valueHide(result.last_name);
                      }
                  res.send({
                    'status': 'success',
                    'data': resu,
                    'metadata': result
                  });
                }
              });
            }

          });
        }
      });
    } else {
      userService.findById(params, (error, result) => {
        if (error) {
          next({
            reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
            message: Messages.MSG_ERROR_WRONG_TOKEN,
            stackTrace: new Error(),
            code: 401
          });
        }
        else {
          if (result.length <= 0) {
            next({
              reason: 'User Not Available',//Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
              message: 'User is not available',//Messages.MSG_ERROR_WRONG_TOKEN,
              stackTrace: new Error(),
              code: 401
            });
          } else {
            candidateService.retrieve({'userId': new mongoose.Types.ObjectId(result._id)}, (error, resu) => {
              if (error) {
                next({
                  reason: 'User Not Available',//Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
                  message: 'User is not available',//Messages.MSG_ERROR_WRONG_TOKEN,
                  stackTrace: new Error(),
                  code: 401
                });
              }
              else {
                res.send({
                  'status': 'success',
                  'data': resu,
                  'metadata': result
                });
              }
            });
          }
        }
      });
    }

  }
  catch (e) {
   next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 403
    });
  }
}

export function get(req: express.Request, res: express.Response, next: any) { //todo authentication is remaining
  try {
    let candidateService = new CandidateService();
    let candidateId = req.params.id;
    let recruiterUserId = req.user._id;
    if (req.user.isCandidate || req.user.isAdmin) {
      candidateService.get(candidateId, (error, result) => {
        if (error) {
          next(error);
        }
        else {
          res.send({
            'status': 'success',
            'data': result
          });
        }
      });
    } else {
      candidateService.maskCandidateDetails(candidateId, recruiterUserId, (error, candidateDetails) => {
        res.send({
          'status': 'success',
          'data': candidateDetails
        });
      });
    }
  }
  catch (e) {
   next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 403
    });
  }
}

export function metchResult(req: express.Request, res: express.Response, next: any) {
  try {
    let searchService = new SearchService();
    let jobId = req.params.jobId;
    let candidateId = req.params.candidateId;
    searchService.getMatchingResult(candidateId, jobId, true, (error: any, result: any) => {
      if (error) {
        next({
          reason: 'Problem in Search Matching Result',//Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
          message: 'Problem in Search Matching Result',//Messages.MSG_ERROR_WRONG_TOKEN,
          stackTrace: new Error(),
          code: 401
        });
      }
      else {
        res.send({
          'status': 'success',
          'data': result,
        });

      }
    });

  }
  catch (e) {
   next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 403
    });
  }
}


export function getList(req: express.Request, res: express.Response, next: any) {
console.log('Remove this code');
}

export function updateField(req:express.Request, res:express.Response, next:any) {
  let candidateService = new CandidateService();
  try {
    let value: number = req.query.value;
    let data:any = {$max: {'profile_update_tracking': Number(value)}};
    let userId:string = req.params.id;
    candidateService.updateField(userId, data, (error:any, result:any) => {
      if (error) {
        next({
          reason: Messages.MSG_ERROR_FAILED_TO_UPDATE_CANDIDATE_FIELD,
          message: Messages.MSG_ERROR_FAILED_TO_UPDATE_CANDIDATE_FIELD,
          stackTrace: new Error(),
          code: 403
        });
      } else {
        res.send({
          'status': 'success',
          'data': result,
        });
      }
    });
  }
  catch (e) {
    next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 500
    });
  }

}
