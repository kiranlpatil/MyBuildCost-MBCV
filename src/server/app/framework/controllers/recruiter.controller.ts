import * as express from "express";
import * as mongoose from "mongoose";
import {Recruiter} from "../dataaccess/model/recruiter-final.model";
import AuthInterceptor = require('../interceptor/auth.interceptor');
import Messages = require('../shared/messages');
import CandidateService = require('../services/candidate.service');
import RecruiterModel = require('../dataaccess/model/recruiter.model');
import RecruiterService = require('../services/recruiter.service');
import JobProfileModel = require('../dataaccess/model/jobprofile.model');
import CNextMessages = require('../shared/cnext-messages');
import SearchService = require("../search/services/search.service");
import CandidateInfoSearch = require("../dataaccess/model/candidate-info-search");
import CandidateModel = require("../dataaccess/model/candidate.model");
import UserService = require("../services/user.service");
import CandidateSearchService = require("../services/candidate-search.service");


export function create(req: express.Request, res: express.Response, next: any) {
  try {

    var newUser: RecruiterModel = <RecruiterModel>req.body;
    var recruiterService = new RecruiterService();
    recruiterService.createUser(newUser, (error, result) => {
      if (error) {
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
        var auth: AuthInterceptor = new AuthInterceptor();
        var token = auth.issueTokenWithUid(result);
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
  }
  catch (e) {
    res.status(403).send({'status': Messages.STATUS_ERROR, 'error_message': e.message});
  }
}


export function postJob(req: express.Request, res: express.Response, next: any) {
  try {
    var newJob: JobProfileModel = <JobProfileModel>req.body;
    var recruiterService = new RecruiterService();
    var userId = req.params.id;
    if (newJob.postedJobs._id !== undefined && newJob.postedJobs._id !== null && newJob.postedJobs._id !== '') {

      let currentDate  = Number(new Date());
      let expiringDate  = Number(new Date(newJob.postedJobs.expiringDate));
      let daysRemainingForExpiring = Math.round(Number(new Date(expiringDate - currentDate))/(1000*60*60*24));
      newJob.postedJobs.daysRemainingForExpiring=daysRemainingForExpiring;
      if (daysRemainingForExpiring <= 0) {
        newJob.postedJobs.isJobPostExpired=true;

      } else {
        newJob.postedJobs.isJobPostExpired = false;
      }
      recruiterService.updateJob(userId, newJob, (err, result) => {
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
    }
    else {
      recruiterService.addJob(userId, newJob, (err, result) => {
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
    }

  }
  catch (e) {
    res.status(403).send({message: e.message});
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
      }else {
        var token = auth.issueTokenWithUid(newRecruiter);
        res.send({
          'status': 'success',
          'data': result,
          access_token: token
        });
      }
    });
  }
  catch (e) {
    res.status(403).send({message: e.message});
  }
}

export function retrieve(req: express.Request, res: express.Response, next: any) {
  try {
    var recruiterService = new RecruiterService();
    let data = {
      'userId': new mongoose.Types.ObjectId(req.params.id)
    };
    recruiterService.retrieve(data, (error: any, result: Recruiter[]) => {
      if (error) {
        next({
          reason: CNextMessages.PROBLEM_IN_RETRIEVE_JOB_PROFILE,
          message: CNextMessages.PROBLEM_IN_RETRIEVE_JOB_PROFILE,
          code: 401
        });
      } else {
        if (result[0]) {
          res.status(200).send({
            'status': Messages.STATUS_SUCCESS,
            'data': result,
            'jobCountModel': result[0].jobCountModel
          });
        } else {

          let currentDate = Number(new Date());
          let expiringDate = Number(new Date(result[0].postedJobs[0].expiringDate));
          let daysRemainingForExpiring = Math.round(Number(new Date(expiringDate - currentDate))/(1000*60*60*24));
          result[0].postedJobs[0].daysRemainingForExpiring=daysRemainingForExpiring;
          if (daysRemainingForExpiring <= 0) {
            result[0].postedJobs[0].isJobPostExpired=true;

          } else{
            result[0].postedJobs[0].isJobPostExpired=false;

          }

          res.status(200).send({
            'status': Messages.STATUS_SUCCESS,
            'data': result
          });
        }
      }

    });


  }catch (e) {
    res.status(403).send({message: e.message});
  }
}

export function getFilterList(req: express.Request, res: express.Response) {
  __dirname = './';
  var filepath = 'recruiter-filter-list.json';
  try {
    res.sendFile(filepath, {root: __dirname});
  }
  catch (e) {
    res.status(403).send({message: e.message});
  }
}


export function getList(req: express.Request, res: express.Response, next: any) {
  try {
    let data: any = {
      'jobProfileId': req.params.id,
      'listName': req.params.listName
    };
    let recruiterService = new RecruiterService();
    recruiterService.getCandidateList(data, (error: any, response: any) => {
      if (error) {
        next({
          reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
          message: Messages.MSG_ERROR_VERIFY_ACCOUNT,
          code: 403
        });
      } else {
        res.send({
          'status': 'success',
          'data': response,
        });
      }
    });
  } catch (e) {
    res.status(403).send({message: e.message});
  }
}

export function getCompareDetailsOfCandidate(req: express.Request, res: express.Response, next: any) {

  try {
    var searchService = new SearchService();
    var params = req.query;
    let jobId = req.params.jobId;
    let recruiterId = req.params.id;
    let candidateId: string[] = JSON.parse(params.candidateId);
    searchService.getMultiCompareResult(candidateId, jobId,recruiterId, false, (error: any, result: any) => {
      if (error) {
        next({
          reason: "Problem in Search Matching Result",//Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
          message: 'Problem in Search Matching Result',//Messages.MSG_ERROR_WRONG_TOKEN,
          code: 401
        })
      }
      else {
        res.send({
          "status": "success",
          "data": result,
        });

      }
    });

  }
  catch (e) {
    res.status(403).send({message: e.message});
  }

}

export function getCandidatesByName(req:express.Request, res:express.Response, next:any) {
  try {
    let userService = new UserService();
    let candidateService = new CandidateService();
    let candidateSearchService = new CandidateSearchService();
    var userName = req.params.searchvalue;
    var query:any;
    var searchValueArray:string[] = userName.split(" ");
    if (searchValueArray.length > 1) {
      var exp1 = eval('/^' + searchValueArray[0] + '/i');
      var exp2 = eval('/^' + searchValueArray[1] + '/i');
      var searchString1:string = exp1.toString().replace(/'/g, "");
      var searchString2:string = exp2.toString().replace(/'/g, "");
      query = {
        'isCandidate': true,
        $or: [{
          'first_name': {$regex: eval(searchString1)},
          'last_name': {$regex: eval(searchString2)}
        }, {'first_name': {$regex: eval(searchString2)}, 'last_name': {$regex: eval(searchString1)}}]
      };
    } else {
      var exp = eval('/^' + searchValueArray[0] + '/i');
      var searchString:string = exp.toString().replace(/'/g, "");

      query = {
        'isCandidate': true,
        $or: [{'first_name': {$regex: eval(searchString)}}, {'last_name': {$regex: eval(searchString)}}]
      };
    }
    userService.retrieve(query, (error:any, result:any) => {
      if (error) {
        next({
          reason: 'Problem in Search user details',
          message: 'Problem in Search user details',
          code: 401
        });
      }
      else {
        var candidateId:string[] = new Array(0);
        for (let obj of result) {
          candidateId.push(obj._id);
        }
        candidateSearchService.getCandidateInfo(candidateId, (error:any, candidateInfo:CandidateModel[]) => {
          if (error) {
            next({
              reason: 'Problem in Search user details',
              message: 'Problem in Search user details',
              code: 401
            });
          } else {
            var searchArray:CandidateInfoSearch[] = candidateSearchService.buidResultOnCandidateSearch(candidateInfo);
            res.send({
              'status': 'success',
              'data': searchArray,
            });
          }
        });
      }
    });

  }
  catch (e) {
    res.status(403).send({message: e.message});
  }

}

export function requestToAdvisor(req:express.Request, res:express.Response, next:any) {
  try {

    let recruiterService = new RecruiterService();
    var params = req.body;
    recruiterService.sendMailToAdvisor(params, (error, result) => {
      if (error) {
        console.log("Error : " + error);
        next({
          reason: Messages.MSG_ERROR_RSN_WHILE_CONTACTING,
          message: Messages.MSG_ERROR_WHILE_CONTACTING,
          code: 403
        });
      }
      else {
        res.status(200).send({
          "status": Messages.STATUS_SUCCESS,
          "data": {"message": Messages.MSG_SUCCESS_EMAIL}
        });
      }
    });
  }
  catch (e) {
    res.status(403).send({message: e.message});

  }
};

export function responseToRecruiter(req:express.Request, res:express.Response, next:any) {
  try {
    let recruiterService = new RecruiterService();
    let user=req.user;
    var params = req.body;
    recruiterService.sendMailToRecruiter(user,params, (error, result) => {
      if (error) {
        console.log("Error : " + error);
        next({
          reason: Messages.MSG_ERROR_RSN_WHILE_CONTACTING,
          message: Messages.MSG_ERROR_WHILE_CONTACTING,
          code: 403
        });
      }
      else {
        res.status(200).send({
          "status": Messages.STATUS_SUCCESS,
          "data": {"message": Messages.MSG_SUCCESS_EMAIL}
        });
      }
    });
  }
  catch (e) {
    res.status(403).send({message: e.message});

  }
};


