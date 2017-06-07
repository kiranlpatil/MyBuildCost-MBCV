import * as express from "express";
import * as multiparty from "multiparty";
import AuthInterceptor = require("../interceptor/auth.interceptor");
import SendMailService = require("../services/sendmail.service");
import UserModel = require("../dataaccess/model/user.model");
import Messages = require("../shared/messages");
import ResponseService = require("../shared/response.service");
import CandidateService = require("../services/candidate.service");
import IndustryService = require("../services/industry.service");
import IndustryModel = require("../dataaccess/model/industry.model");
import RoleModel = require("../dataaccess/model/role.model");
import CapabilityModel = require("../dataaccess/model/capability.model");
import ComplexityModel = require("../dataaccess/model/complexity.model");
import ScenarioModel = require("../dataaccess/model/scenario.model");
import JobProfileModel = require("../dataaccess/model/jobprofile.model");
import JobProfileService = require("../services/jobprofile.service");
import * as mongoose from "mongoose";
import RecruiterService = require("../services/recruiter.service");
import CNextMessages = require("../shared/cnext-messages");
import SearchService = require("../search/services/search.service");



export function searchCandidatesByJobProfile (req : express.Request,res :express.Response, next : any){
  try{
    let jobProfile:JobProfileModel = <JobProfileModel>req.body;
    let jobProfileService : JobProfileService= new JobProfileService();
    jobProfileService.searchCandidatesByJobProfile(jobProfile,(error,result)=>{
      if(error){
        next({
          reason: 'No candidates are present for this Job Profile',//Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
          message: Messages.MSG_ERROR_WRONG_TOKEN,
          code: 401
        });
      }else {
        res.send({
          "status": "success",
          "data": result
        });
      }
    });

  }catch(e){

  }

}

export function retrieve(req: express.Request, res: express.Response, next: any) {
  try {
    var jobProfileService = new JobProfileService();
    let data = {
      "postedJob": req.params.id
    };
    jobProfileService.retrieve(data, (error, result) => {
      if (error) {
        next({
          reason: CNextMessages.PROBLEM_IN_RETRIEVE_JOB_PROFILE,
          message: CNextMessages.PROBLEM_IN_RETRIEVE_JOB_PROFILE,
          code: 401
        });
      }else{
        res.status(200).send({
          "data": {
           "industry": result
          }
        });
      }

    });
  }
  catch (e) {
    res.status(403).send({message: e.message});
  }
}

export function update(req: express.Request, res: express.Response, next: any) {
  try {

    var jobProfileService = new JobProfileService();
    let data ={
      "recruiterId": req.params.recruiterId,
      "profileId": req.params.profileId,
      "listName": req.params.listName,
      "candidateId": req.params.candidateId,
      "action":req.params.action
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
          "status": Messages.STATUS_SUCCESS,
          "data": result
        });
      }
    });
  }
  catch (e) {
    res.status(403).send({message: e.message});
  }
}

export function apply(req : express.Request, res : express.Response, next :any){
  try {
    var jobProfileService = new JobProfileService();
    let data = {
      "candidateId": req.params.id,
      "profileId": req.params.profileId,
      "action": req.params.action,
      "listName": req.params.listName
    };
    jobProfileService.applyJob(data,(err, result)=>{
        if(err){
          next({
            reason: Messages.MSG_ERROR_RSN_USER_NOT_FOUND,
            message: Messages.MSG_ERROR_RSN_USER_NOT_FOUND,
            code: 403
          });
        }else {
          res.status(200).send({
            "status": Messages.STATUS_SUCCESS,
            "data": result
          });
        }
    });

  }catch (e){
    res.status(403).send({message: e.message});
  }

  }

export function metchResultForJob(req:express.Request, res:express.Response, next:any) {
  try {
    var searchService = new SearchService();
    let jobId = req.params.jobId;
    let candidateId = req.params.candidateId;
    searchService.getMatchingResult(candidateId,jobId,  (error: any, result: any) => {
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



export function getQCardDetails(req: express.Request, res: express.Response, next: any) {
  try {
    var jobProfileService = new JobProfileService();
    let data = {
      "jobId": req.params.id,
      "candidateIds": req.body.candidateIds
    };
    jobProfileService.getQCardDetails(data, (error : Error,result : any)=>{
      if(error){
        res.status(304).send(error);
      }else{
        res.status(200).send(result);
      }
    });
  }
  catch (e) {
    res.status(403).send({message: e.message});
  }
}
