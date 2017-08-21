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
