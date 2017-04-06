import * as express from "express";
import Messages = require("../shared/messages");
import IndustryService = require("../services/industry.service");
import * as mongoose from "mongoose";
import CNextMessages = require("../shared/cnext-messages");



export function retrieve(req:express.Request, res:express.Response, next:any) {
  try {
    var industryService = new IndustryService();
    var params = req.params.id;
    industryService.findByName(params, (error, result) => {
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
          "data": result[0].proficiencies
        });
      }
    });
  }
  catch (e) {
    res.status(403).send({message: e.message});
  }
}

export function update(req:express.Request, res:express.Response, next:any) {
  try {
    var industryService = new IndustryService();
    var params = req.params.id;
    industryService.pushIntoArray(params,req.query.proficiency, (error, result) => {
      if (error) {
        next({
          reason: 'Error In Retriving',//Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
          message: CNextMessages.MSG_NOT_FOUND_ANY_RECORD_OF_INDUSTRY,
          code: 401
        });
      }
      else {
        //  var token = auth.issueTokenWithUid(user);
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
    res.status(403).send({message: e.message});
  }
}
