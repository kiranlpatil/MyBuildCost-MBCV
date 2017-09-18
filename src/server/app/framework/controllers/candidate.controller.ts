import * as express from "express";
import * as mongoose from "mongoose";
import AuthInterceptor = require('../interceptor/auth.interceptor');
import Messages = require('../shared/messages');
import CandidateModel = require('../dataaccess/model/candidate.model');
import CandidateService = require('../services/candidate.service');
import UserService = require('../services/user.service');
import RecruiterService = require('../services/recruiter.service');
import SearchService = require('../search/services/search.service');
import CandidateInfoSearch = require("../dataaccess/model/candidate-info-search");


export function create(req: express.Request, res: express.Response, next: any) {
  try {
    console.log('USer is', req.body);
    let newUser: CandidateModel = <CandidateModel>req.body;
    console.log('USer is', newUser);
    let candidateService = new CandidateService();
    candidateService.createUser(newUser, (error, result) => {
      if (error) {
        console.log('crt user error', error);
        if (error == Messages.MSG_ERROR_CHECK_EMAIL_PRESENT) {
          next({
            reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
            message: Messages.MSG_ERROR_VERIFY_ACCOUNT,
            code: 403
          });
        }
        else if (error == Messages.MSG_ERROR_CHECK_MOBILE_PRESENT) {
          next({
            reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
            message: Messages.MSG_ERROR_REGISTRATION_MOBILE_NUMBER,
            code: 403
          });
        }
        else {
          next({
            reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
            message: Messages.MSG_ERROR_USER_WITH_EMAIL_PRESENT,
            code: 403
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
  }
  catch (e) {
    res.status(403).send({'status': Messages.STATUS_ERROR, 'error_message': e.message});
  }
}


export function updateDetails(req: express.Request, res: express.Response, next: any) {
  try {
    let updatedCandidate: CandidateModel = <CandidateModel>req.body;
    let params = req.query;
    delete params.access_token;
    let userId: string = req.params.id;
    let auth: AuthInterceptor = new AuthInterceptor();

    /*let userService = new UserService();
     let query = {"_id": userId};
     let updateData = {"location": updatedCandidate.professionalDetails.location};*/
    let candidateService = new CandidateService();
    candidateService.update(userId, updatedCandidate, (error, result) => {
      if (error) {
        next(error);
      } else {
        candidateService.retrieve(result._id, (error, result) => {
          if (error) {
            next({
              reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
              message: Messages.MSG_ERROR_WRONG_TOKEN,
              code: 401
            });
          } else {
            let token = auth.issueTokenWithUid(result[0]);
            res.send({
              'status': 'success',
              'data': result,
              access_token: token
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
  catch (e) {
    res.status(403).send({message: e.message});
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
    res.status(403).send({message: e.message});
  }
}


export function retrieve(req: express.Request, res: express.Response, next: any) { //todo authentication is remaining
  try {
    let userService = new UserService();
    let candidateService = new CandidateService();
    let params = req.params.id;
    let candidateId = req.params.candidateId;
    if (candidateId) {
      candidateService.findById(candidateId, (error, resu) => {
        if (error) {
          next({
            reason: 'User Not Available',//Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
            message: 'User is not available',//Messages.MSG_ERROR_WRONG_TOKEN,
            code: 401
          })
        }
        else {
          userService.findById(resu.userId, (error, result) => {
            if (error) {
              next({
                reason: 'User Not Available',//Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
                message: 'User is not available',//Messages.MSG_ERROR_WRONG_TOKEN,
                code: 401
              })
            } else {
              res.send({
                'status': 'success',
                'data': resu,
                'metadata': result
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
            code: 401
          });
        }
        else {
          if (result.length <= 0) {
            next({
              reason: 'User Not Available',//Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
              message: 'User is not available',//Messages.MSG_ERROR_WRONG_TOKEN,
              code: 401
            });
          } else {
            candidateService.retrieve({'userId': new mongoose.Types.ObjectId(result._id)}, (error, resu) => {
              if (error) {
                next({
                  reason: 'User Not Available',//Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
                  message: 'User is not available',//Messages.MSG_ERROR_WRONG_TOKEN,
                  code: 401
                })
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
    res.status(403).send({message: e.message});
  }
}

export function get(req: express.Request, res: express.Response, next: any) { //todo authentication is remaining
  try {
    let candidateService = new CandidateService();
    let candidateId = req.params.id;
    /* if (String(req.user._id) === String(candidateId)) {*/
      candidateService.get(candidateId, (error, result) => {
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
    /* } else {
      next({
        reason: Messages.MSG_ERROR_IF_USER_ID_INVALID_FROM_URL_PARAMETER,
        message: Messages.MSG_ERROR_IF_USER_ID_INVALID_FROM_URL_PARAMETER,
        code: 401
      });
     }*/
  }
  catch (e) {
    res.status(403).send({message: e.message});
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
    res.status(403).send({message: e.message});
  }
}


export function getList(req: express.Request, res: express.Response, next: any) {
  try {
    let candidateId: string = req.params.id;
    let listName: string = req.params.listName;
    let candidateService = new CandidateService();
    candidateService.findById(candidateId, (error: any, response: CandidateModel) => {
      if (error) {
        next({
          reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
          message: Messages.MSG_ERROR_VERIFY_ACCOUNT,
          code: 403
        });
      } else {
        let isFound : boolean= false;
        for (let list of response.job_list) {
          if (listName === list.name) {
            isFound= true;
            let data: any = {
              listName: listName,
              ids: list.ids,
              candidate: response
            };
            candidateService.getList(data, (err, result) => {
              if (err) {
                next({
                  reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
                  message: Messages.MSG_ERROR_VERIFY_ACCOUNT,
                  code: 403
                });
              } else {
                res.send({
                  'status': 'success',
                  'data': result,
                });
              }
            });
            break;
          }
        }
        if(!isFound) {
          let result : any=[];
          res.send({
            'status': 'success',
            'data': result,
          });
        }
      }
    });
  } catch (e) {
    res.status(403).send({message: e.message});
  }
}
