import * as express from "express";
import AuthInterceptor = require("../interceptor/auth.interceptor");
import SendMailService = require("../services/sendmail.service");
import UserModel = require("../dataaccess/model/user.model");
import Messages = require("../shared/messages");
import ResponseService = require("../shared/response.service");
import CandidateModel = require("../dataaccess/model/candidate.model");
import CandidateService = require("../services/candidate.service");
import IndustryService = require("../services/industry.service");
import IndustryModel = require("../dataaccess/model/industry.model");
import RoleModel = require("../dataaccess/model/role.model");
import CapabilityModel = require("../dataaccess/model/capability.model");
import ComplexityModel = require("../dataaccess/model/complexity.model");
import ScenarioModel = require("../dataaccess/model/scenario.model");


export function retrieve(req: express.Request, res: express.Response, next: any) {
  try {
    let industryService = new IndustryService();
    let params = {};
    industryService.retrieve(params, (error, result) => {
      if (error) {
        next({
          reason: 'Error In Retriving',//Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
          message: Messages.MSG_ERROR_WRONG_TOKEN,
          code: 401
        });

      }
      else {
        //  let token = auth.issueTokenWithUid(user);
        res.send({
          "status": "success",
          "data": {
            "Success": "Amit"//user.first_name,
          }//,
          //access_token: token
        });

      }
    });

  }
  catch (e) {
    next({reason: e.message, message: e.message, stackTrace: new Error(), code: 500});
  }
}
export function create(req: express.Request, res: express.Response, next: any) {
  try {
    let newIndustry: IndustryModel = <IndustryModel>req.body;
    let newRole: RoleModel = <RoleModel>req.body.roles;
    let newCapability: CapabilityModel = <CapabilityModel>req.body.roles[0].capabilities;
    let newComplexity: ComplexityModel = <ComplexityModel>req.body.roles[0].capabilities[0].complexities;
    let newScenario: ScenarioModel = <ScenarioModel>req.body.roles[0].capabilities[0].complexities[0].scenarios;

    let industryService = new IndustryService();
    industryService.create(newIndustry, (error, result) => {
      if (error) {
        next(error);
      }
      else {
        let auth: AuthInterceptor = new AuthInterceptor();
        res.status(200).send({
          "status": Messages.STATUS_SUCCESS,
          "data": {
            "reason": Messages.MSG_SUCCESS_REGISTRATION,
            "code_name": newIndustry.code,
            "name": newIndustry.name,
            "roles": newIndustry.roles,
            "_id": result._id,
          }
        });
      }
    });
  }
  catch (e) {
    next({reason: e.message, message: e.message, stackTrace: new Error(), code: 500});
  }
}
