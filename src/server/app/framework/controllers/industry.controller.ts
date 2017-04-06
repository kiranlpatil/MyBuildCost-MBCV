import * as express from "express";
import * as multiparty from "multiparty";
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
import ScenarioService = require("../services/scenario.service");
import ComplexityService = require("../services/complexity.service");
import CapabilityService = require("../services/capability.service");
import RoleService = require("../services/role.service");
import CNextMessages = require("../shared/cnext-messages");


export function retrieve(req:express.Request, res:express.Response, next:any) {
  try {
    var industryService = new IndustryService();
    var params = {};
    industryService.retrieveAll(params, (error, result) => {
      if (error) {
        next({
          reason: 'Error In Retriving',//Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
          message: CNextMessages.MSG_NOT_FOUND_ANY_RECORD_OF_INDUSTRY,
          code: 401
        });
      }
      else {
        res.send({
          "status": "success",
          "data": result
        });
      }
    });
  }
  catch (e) {
    res.status(403).send({message: e.message});
  }
}
export function create(req:express.Request, res:express.Response, next:any) { //todo code should be review be Sudhakar
  try {
    let newIndustry:IndustryModel = <IndustryModel>req.body;
    let industryService = new IndustryService();
      industryService.create(newIndustry, (error, result) => {
        if (error) {
          console.log("crt role error", error);
        }
        else {
          var auth:AuthInterceptor = new AuthInterceptor();
          var token = auth.issueTokenWithUid(newIndustry);
          res.status(200).send({
              "status": Messages.STATUS_SUCCESS,
              "data": {
                "reason": "Data inserted Successfully in Industry",
                "code_name": newIndustry.code_name,
                "name": newIndustry.name,
                "roles": newIndustry.roles,
                "_id": result._id,
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
