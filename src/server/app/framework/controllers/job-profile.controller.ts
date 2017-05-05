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
           "industry": result.industry
          }
        });
      }

    });
  }
  catch (e) {
    res.status(403).send({message: e.message});
  }
}



