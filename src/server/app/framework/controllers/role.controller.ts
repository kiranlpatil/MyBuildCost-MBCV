import * as express from "express";
import AuthInterceptor = require("../interceptor/auth.interceptor");
import Messages = require("../shared/messages");
import ResponseService = require("../shared/response.service");
import RoleModel = require("../dataaccess/model/role.model");
import RoleService = require("../services/role.service");
import IndustryService = require("../services/industry.service");


export function retrieve(req: express.Request, res: express.Response, next: any) {
  try {
    let roleService = new RoleService();
    let industryService = new IndustryService();
    let params = req.params.id;
    console.time('GetRole');
    roleService.findByName(params, (error, result) => {
      if (error) {
        next({
          reason: 'Error In Retriving',//Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
          message: "Error in Retriving",
          stackTrace: new Error(),
          code: 403
        });
      }
      else if (result.length <= 0) {
        res.status(403).send({message: "No records in Industry"});
      }
      else {
        console.timeEnd('GetRole');
        res.send({
          "status": "success",
          "data": result
        });
      }
    });
  }
  catch (e) {
    next({reason: e.message, message: e.message, stackTrace: new Error(), code: 500});
  }
}

