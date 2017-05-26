import * as express from "express";
import AuthInterceptor = require("../interceptor/auth.interceptor");
import Messages = require("../shared/messages");
import CandidateModel = require("../dataaccess/model/candidate.model");
import CandidateService = require("../services/candidate.service");
import UserService = require("../services/user.service");
import * as mongoose from "mongoose";
import RecruiterService = require("../services/recruiter.service");


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
    console.log("candidate" + userId);
    console.log("updated candidate" + JSON.stringify(updatedCandidate));
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
            console.log("--------------------------------------------", JSON.stringify(result));
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


export function retrieve(req:express.Request, res:express.Response, next:any) { //todo authentication is remaining
  try {
    var userService = new UserService();
    var candidateService = new CandidateService();
    let params = req.params.id;
    let candidateId = req.params.candidateId;
    if (candidateId) {
      candidateService.findById(candidateId, (error, resu) => {
        if (error) {
          next({
            reason: "User Not Available",//Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
            message: 'User is not available',//Messages.MSG_ERROR_WRONG_TOKEN,
            code: 401
          })
        }
        else {
          userService.findById(resu.userId, (error, result) => {
            if (error) {
              next({
                reason: "User Not Available",//Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
                message: 'User is not available',//Messages.MSG_ERROR_WRONG_TOKEN,
                code: 401
              })
            } else {
              res.send({
                "status": "success",
                "data": resu,
                "metadata": result
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
              reason: "User Not Available",//Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
              message: 'User is not available',//Messages.MSG_ERROR_WRONG_TOKEN,
              code: 401
            })
          } else {
            candidateService.retrieve({"userId": new mongoose.Types.ObjectId(result._id)}, (error, resu) => {
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
                  "metadata": result
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


export function getList(req:express.Request, res:express.Response, next:any) {
  try {
    let candidateId : string = req.params.id;
    let listName : string= req.params.listName;
    let candidateService = new CandidateService();
    let recruiterService = new RecruiterService();
    candidateService.findById(candidateId,(error :any, response: CandidateModel)=>{
      if(error){
        next({
          reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
          message: Messages.MSG_ERROR_VERIFY_ACCOUNT,
          code: 403
        });
      }else{
        for(let list of response.job_list){
          if(listName===list.name){
            let data :any ={
              listName : listName,
              ids : list.ids,
              candidate :response
            };
            candidateService.getList(data, (err,result)=>{
              if(err){
                next({
                  reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
                  message: Messages.MSG_ERROR_VERIFY_ACCOUNT,
                  code: 403
                });
              }else{
                res.send({
                  "status": "success",
                  "data": result,
                });
              }
            });
            break;
          }
        }
      }
    });
  } catch (e) {
    res.status(403).send({message: e.message});
  }
}
