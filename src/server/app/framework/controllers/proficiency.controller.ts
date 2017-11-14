import * as express from "express";
import Messages = require("../shared/messages");
import IndustryService = require("../services/industry.service");
import CNextMessages = require("../shared/cnext-messages");
import ProficiencyModel = require("../dataaccess/model/proficiency.model");
import ProficiencyService = require("../services/proficiency.service");
import AuthInterceptor = require("../interceptor/auth.interceptor");

export function create(req: express.Request, res: express.Response, next: any) {
  try{
    if (req.user.isAdmin) {
      let proficiencyModel: ProficiencyModel = <ProficiencyModel>req.body;
      let proficiencyService = new ProficiencyService();
      proficiencyService.create(proficiencyModel, (error, result) => {
        if (error) {
          next(error);
        } else {
          res.status(200).send({
            "status": "success",
          });
        }

      });
    }else {
      next({
        reason: Messages.MSG_ERROR_UNAUTHORIZED_USER,
        message: Messages.MSG_ERROR_UNAUTHORIZED_USER,
        stackTrace: new Error(),
        code: 401
      });
    }
  } catch (e) {
    next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 500
    });
  }
}

export function retrieve(req: express.Request, res: express.Response, next: any) {
  try {
    let proficiencyService = new ProficiencyService();
    let params = req.params.id;
    proficiencyService.retrieve(params, (error, result) => {
      if (error) {
        next({
          reason: 'Error In Proficiency  Retriving',
          message: CNextMessages.PROFICIENCY_NOT_RETRIVED,
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
  }
  catch (e) {
    next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 500
    });
  }
}

export function update(req: express.Request, res: express.Response, next: any) {


  try {
    let proficiencyService = new ProficiencyService();
    let params = req.params.id;
    proficiencyService.pushIntoArray(req.query.proficiency, (error, result) => {
      if (error) {
        next({
          reason: 'Error In Proficiency Updation',
          message: CNextMessages.PROFICIENCY_NOT_UPDATED,
          stackTrace: new Error(),
          code: 401
        });
      }
      else {
        res.send({
          "status": "success",
          "data": {
            "message": "succesfully inserted proficiency into master data"
          }
        });
      }
    });
  }
  catch (e) {
    next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 500
    });
  }
}
