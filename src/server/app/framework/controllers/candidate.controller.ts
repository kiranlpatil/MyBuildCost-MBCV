import * as express from "express";
import * as multiparty from "multiparty";
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
import UserService = require("../services/user.service");
import * as mongoose from "mongoose";



export function create(req:express.Request, res:express.Response, next:any) {
  try {

    var newUser:CandidateModel = <CandidateModel>req.body;
    var candidateService = new CandidateService();
    candidateService.createUser(newUser, (error, result) => {
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


export function updateDetails(req:express.Request, res:express.Response, next:any) {
  try {
    var updatedCandidate:CandidateModel = <CandidateModel>req.body;
    var params = req.query;
    delete params.access_token;
    var userId:string = req.params.id;
    console.log("candidate" + updatedCandidate);
    var auth:AuthInterceptor = new AuthInterceptor();
    var candidateService = new CandidateService();
    candidateService.update(userId, updatedCandidate, (error, result) => {
      if (error) {
        next(error);
      }
      else {
        candidateService.retrieve(result._id, (error, result) => {
          if (error) {
            next({
              reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
              message: Messages.MSG_ERROR_WRONG_TOKEN,
              code: 401
            });
          }
          else {
            var token = auth.issueTokenWithUid(updatedCandidate);
            res.send({
              "status": "success",
              "data": {},
              access_token: token
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


export function retrieve(req: express.Request, res: express.Response, next: any) { //todo authentication is remaining
  try {
    var userService = new UserService();
    var candidateService = new CandidateService();
    let params =req.params.id;
   // delete params.access_token;
//    var user = req.user;
    console.log("Id"+params);
    var auth: AuthInterceptor = new AuthInterceptor();

    userService.findById(params, (error, result) => {
      if (error) {
        next({
          reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
          message: Messages.MSG_ERROR_WRONG_TOKEN,
          code: 401
        });
      }
      else {
        if(result.length<=0){
          next({
            reason: "User Not Available",//Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
            message: 'User is not available',//Messages.MSG_ERROR_WRONG_TOKEN,
            code: 401
          })
        }else{
          console.log("User  Id"+new mongoose.Types.ObjectId(result._id));
          candidateService.retrieve({"userId":new mongoose.Types.ObjectId(result._id)}, (error, resu) => {
            console.log("Data of Candidate"+JSON.stringify(resu));
            if (error) {
              next({
                reason: "User Not Available",//Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
                message: 'User is not available',//Messages.MSG_ERROR_WRONG_TOKEN,
                code: 401
              })
            }
            else {
              res.send({
                "status": "success",
                "data": resu,
              });
            }
          });
        }
      }
    });
  }
  catch (e) {
    res.status(403).send({message: e.message});
  }
}
