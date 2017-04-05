import * as express from "express";
import AuthInterceptor = require("../interceptor/auth.interceptor");
import Messages = require("../shared/messages");
import ResponseService = require("../shared/response.service");
import RoleModel = require("../dataaccess/model/role.model");
import RoleService = require("../services/role.service");
import IndustryService = require("../services/industry.service");
import * as mongoose from "mongoose";
import CapabilityService = require("../services/capability.service");


export function retrieve(req:express.Request, res:express.Response, next:any) {
  try {
    var capabilityService = new CapabilityService();
    var rolesparam = req.query.roles;
    let item:any={
      name : req.params.id,
      roles :JSON.parse(rolesparam)
    }
    capabilityService.findByName(item, (error, result) => {
      if (error) {
        next({
          reason: 'Error In Retriving',//Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
          message: Messages.MSG_ERROR_WRONG_TOKEN,
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

