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
import ScenarioService = require("../services/scenario.service");
import ComplexityService = require("../services/complexity.service");
import CapabilityService = require("../services/capability.service");
import RoleService = require("../services/role.service");
import CNextMessages = require("../shared/cnext-messages");


export function retrieve(req: express.Request, res: express.Response, next: any) {
  try {
    var industryService = new IndustryService();
    var params = {};
    industryService.retrieveAll(params, (error, result) => {
      if (error) {
        next({
          reason: 'Error In Retriving',//Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
          message: CNextMessages.MSG_NOT_FOUND_ANY_RECORD_OF_INDUSTRY,
          actual_error: error,
          stackTrace: new Error(),
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
  } catch (e) {
    next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 500
    });
  }
}
export function create(req: express.Request, res: express.Response, next: any) { //todo code should be review be Sudhakar
  try {
    let newIndustry: IndustryModel = <IndustryModel>req.body;
    let industryService = new IndustryService();
    industryService.create(newIndustry, (error, result) => {
      if (error) {
        next(error);
      }
      else {
        res.status(200).send({
          "status": Messages.STATUS_SUCCESS,
          "data": {
            "reason": "Data inserted Successfully in Industry",
            "code": newIndustry.code,
            "name": newIndustry.name,
            "roles": newIndustry.roles,
            "_id": result._id,
          }
        });
      }
    });
  } catch (e) {
    next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 500
    });
  }
}

export function getReleventIndustryList(req: express.Request, res: express.Response, next: any) {
  try {
    var rolesparam = req.query.roles;
    var industryName = req.query.industryName;
    let industryService = new IndustryService();
    industryService.getReleventIndustryList(rolesparam, industryName, (error: any, response: any) => {
      if (error) {
        next(error);
      } else {
        res.send({
          'status': 'success',
          'data': response,
        });
      }
    });
  } catch (e) {
    next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 500
    });
  }
}
