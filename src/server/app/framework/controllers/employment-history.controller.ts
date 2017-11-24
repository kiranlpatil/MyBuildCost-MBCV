import * as express from "express";
import AuthInterceptor = require("../interceptor/auth.interceptor");
import SendMailService = require("../services/mailer.service");
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


export function create(req: express.Request, res: express.Response, next: any) {
  /*try {
   let newUser: UserModel = <UserModel>req.body;
   let userService = new UserService();
   userService.createUser(newUser, (error, result) => {
   if (error) {
   console.log("crt user error",error);

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
   else{
   next({
   reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
   message: Messages.MSG_ERROR_USER_WITH_EMAIL_PRESENT,
   code: 403
   });
   }
   }
   else {
   let auth: AuthInterceptor = new AuthInterceptor();
   let token = auth.issueTokenWithUid(newUser);
   res.status(200).send({
   "status": Messages.STATUS_SUCCESS,
   "data": {
   "reason": Messages.MSG_SUCCESS_REGISTRATION,
   "first_name": newUser.first_name,
   "last_name": newUser.last_name,
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
  next({      reason: e.message,      message: e.message,      stackTrace: new Error(),      code: 500    });
   }*/
}

