import * as express from "express";
import AuthInterceptor = require("../interceptor/auth.interceptor");
import SendMailService = require("../services/sendmail.service");
import UserModel = require("../dataaccess/model/user.model");
import Messages = require("../shared/messages");
import ResponseService = require("../shared/response.service");
import CandidateModel = require("../dataaccess/model/candidate.model");
import CandidateService = require("../services/candidate.service");
import EmployeeHistoryService = require("../services/employee-history.service");
import ProfessionalDetailsService = require("../services/professional-details.service");
import AcademicService = require("../services/academics.service");
import RecruiterModel = require("../dataaccess/model/recruiter.model");
import RecruiterService = require("../services/recruiter.service");
import JobProfileModel = require("../dataaccess/model/jobprofile.model");
import UserService = require("../services/user.service");
import JobProfileService = require("../services/jobprofile.service");


export function create(req:express.Request, res:express.Response, next:any) {
  try {

    var newUser:RecruiterModel = <RecruiterModel>req.body;
    var recruiterService = new RecruiterService();
    recruiterService.createUser(newUser, (error, result) => {
      if (error) {
        console.log("crt user error", error);
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
        var auth:AuthInterceptor = new AuthInterceptor();
        var token = auth.issueTokenWithUid(newUser);
        res.status(200).send({
          "status": Messages.STATUS_SUCCESS,
          "data": {
            "reason": Messages.MSG_SUCCESS_REGISTRATION,
            "_id": result.userId,
          },
          access_token: token
        });
      }
    });
  }
  catch (e) {
    res.status(403).send({"status": Messages.STATUS_ERROR, "error_message": e.message});
  }
}


export function postJob(req:express.Request, res:express.Response, next:any) {
  try {
    var newJob:JobProfileModel = <JobProfileModel>req.body;
    console.log(newJob);
    var recruiterService = new RecruiterService();
    var userId = req.params.id;
    recruiterService.update(userId,newJob, (err, result)=> {
      if (err) {
        next({
          reason: Messages.MSG_ERROR_RSN_USER_NOT_FOUND,
          message: Messages.MSG_ERROR_RSN_USER_NOT_FOUND,
          code: 403
        });
      } else {
        res.status(200).send({
          "status": Messages.STATUS_SUCCESS,
          "data": {
            "_id": userId,
          }
        });
      }
    });
  }
  catch (e) {
    res.status(403).send({message: e.message});
  }
}

export function updateDetails(req:express.Request, res:express.Response, next:any) {
  try {
    var newRecruiter:RecruiterModel = <RecruiterModel>req.body;
    var params = req.query;
    delete params.access_token;
    var userId:string = req.params.id;
    console.log("updated recruiter" + JSON.stringify(newRecruiter));
    var auth:AuthInterceptor = new AuthInterceptor();
    var recruiterService = new RecruiterService();
    recruiterService.updateDetails(userId, newRecruiter, (error, result) => {
      if (error) {
        next(error);
      }
      else {
            var token = auth.issueTokenWithUid(newRecruiter);
            res.send({
              "status": "success",
              "data": result,
              access_token: token
            });
          }
    });
  }
  catch (e) {
    res.status(403).send({message: e.message});
  }
}

