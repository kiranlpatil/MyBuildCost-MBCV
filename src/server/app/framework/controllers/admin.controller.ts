/**
 * Created by techprime002 on 8/28/2017.
 */
/**
 * Created by techprime002 on 7/11/2017.
 */
import * as express from 'express';
import fs = require('fs');
import AuthInterceptor = require('../interceptor/auth.interceptor');
import Messages = require('../shared/messages');
import ImportIndustryService = require('../services/import-industries.service');
import UserService = require("../services/user.service");
import AdminService = require("../services/admin.service");
import CandidateModel = require("../dataaccess/model/candidate.model");
import UserModel = require("../dataaccess/model/user.model");
let importIndustriesService = new ImportIndustryService();


export function create(req: express.Request, res: express.Response, next: any) {
  try {
    var newUser: UserModel = <UserModel>req.body;
    newUser.isAdmin=true;
    newUser.first_name='Admin';
    newUser.email='admin@jobmosis.com';
    newUser.mobile_number=8669601616;
    newUser.isActivated=true;
    newUser.password='$2a$10$5SBFt0BpQPp/15N5J38nZuh2zMSL1gbFmnEe4xRLIltlQn56bNcZq';
    var userService = new UserService();
    // newUser.isActivated=true;
    userService.createUser(newUser, (error, result) => {
      if (error) {
        console.log("crt user error", error);

        if (error == Messages.MSG_ERROR_CHECK_EMAIL_PRESENT) {
          next({
            reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
            message: Messages.MSG_ERROR_VERIFY_ACCOUNT,
            code: 403
          });
        }
        else if (error == Messages.MSG_ERROR_CHECK_MOBILE_PRESENT) {
          next({
            reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
            message: Messages.MSG_ERROR_REGISTRATION_MOBILE_NUMBER,
            code: 403
          });
        }
        else {
          next({
            reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
            message: Messages.MSG_ERROR_USER_WITH_EMAIL_PRESENT,
            code: 403
          });
        }
      }
      else {
        var auth: AuthInterceptor = new AuthInterceptor();
        console.log('result',JSON.stringify(result));
        var token = auth.issueTokenWithUid(result);
        res.status(200).send({
          "status": Messages.STATUS_SUCCESS,
          "data": {
            "reason": Messages.MSG_SUCCESS_REGISTRATION,
            "first_name": newUser.first_name,
            "email": newUser.email,
            "mobile_number": newUser.mobile_number,
            "_id": result._id,
            "picture": ""
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


export function getAllUser(req: express.Request, res: express.Response, next: any) {
  try {
    var userService = new UserService();
    var adminService = new AdminService();
    var params = {};
    userService.retrieveAll(params, (error, result) => {
      if (error) {
        next({
          reason: 'Error In Retrieving',//Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
          message: "error in create excel",
          code: 403
        });
      } else {
        adminService.seperateUsers(result,(error, resp) => {
          if (error) {
            next({
              reason: 'Error In Retrieving',//Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
              message: "error in create excel",
              code: 403
            });
          }else {
            adminService.createXlsx(resp, (err, respo)=> {
              if (err) {
                next({
                  reason: 'Error In Retrieving',//Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
                  message: "error in create excel",
                  code: 403
                });
              }
              else {
                res.status(200).send({
                  'status': 'success',
                  'data': resp
                });
              }
            });
          }

        });
      }
    });
  }
  catch (e) {
    res.status(403).send({message: e.message});
  }
};
