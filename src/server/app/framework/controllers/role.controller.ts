import * as express from "express";
import AuthInterceptor = require("../interceptor/auth.interceptor");
import Messages = require("../shared/messages");
import ResponseService = require("../shared/response.service");
import RoleModel = require("../dataaccess/model/role.model");
import RoleService = require("../services/role.service");
import IndustryService = require("../services/industry.service");
import * as mongoose from "mongoose";


export function retrieve(req:express.Request, res:express.Response, next:any) {
  try {
    var roleService = new RoleService();
    var industryService = new IndustryService();
    var params = req.params.id;
    console.log("Params json" + params);
    industryService.findByName(params, (error, result) => {
      if (error) {
        next({
          reason: 'Error In Retriving',//Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
          message: "Error in Retriving",
          code: 403
        });
      }
      else if (result.length <= 0) {
        res.status(403).send({message: "No records in Industry"});
      }
      else {
        console.log("Result" + JSON.stringify(result));
        let ids:string[] = new Array(0);
        for (let role of result[0].roles) {
          ids.push(new mongoose.Types.ObjectId(role));
        }
        console.log("roles id" + ids);
        roleService.retrieveByMultiIds(ids, (error, result) => {
          if (error) {
            next({
              reason: 'Error In Retriving',//Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
              message: Messages.MSG_ERROR_WRONG_TOKEN,
              code: 401
            });
          }
          else {
            console.log("Data " + JSON.stringify(result));
            //  var token = auth.issueTokenWithUid(user);
            res.send({
              "status": "success",
              "data": result
            });

          }
        });
      }
    })
  }
  catch (e) {
    res.status(403).send({message: e.message});
  }
}

