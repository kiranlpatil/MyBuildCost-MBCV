import * as express from "express";
import * as multiparty from "multiparty";
import {MailChimpMailerService} from "../services/mailchimp-mailer.service";
import AuthInterceptor = require('../interceptor/auth.interceptor');
import SendMailService = require('../services/mailer.service');
import UserModel = require('../dataaccess/model/user.model');
import UserService = require('../services/user.service');
import RecruiterService = require('../services/recruiter.service');
import Messages = require('../shared/messages');
import ResponseService = require('../shared/response.service');
import CandidateService = require('../services/candidate.service');
import adminController= require('./admin.controller');
import RecruiterModel = require('../dataaccess/model/recruiter.model');
import IRecruiter = require("../dataaccess/mongoose/recruiter");

let config = require('config');
let path = require('path');
let bcrypt = require('bcrypt');

export function login(req: express.Request, res: express.Response, next: any) {
  try {
    let userService = new UserService();
    let params = req.body;
    delete params.access_token;
    userService.retrieve({"email": params.email}, (error, result) => {
      if (error) {
        next(error);
      } else if (result.length > 0 && result[0].isActivated === true) {
        bcrypt.compare(params.password, result[0].password, (err: any, isSame: any) => {
          if (err) {
            next({
              reason: Messages.MSG_ERROR_RSN_INVALID_REGISTRATION_STATUS,
              message: Messages.MSG_ERROR_VERIFY_CANDIDATE_ACCOUNT,
              stackTrace: new Error(),
              actualError: err,
              code: 400
            });
          } else {
            if (isSame) {
              let auth = new AuthInterceptor();
              let token = auth.issueTokenWithUid(result[0]);
              if (result[0].isAdmin) {
                adminController.sendLoginInfoToAdmin(result[0].email, req.connection.remoteAddress, params.latitude, params.longitude,next);
                res.status(200).send({
                  "status": Messages.STATUS_SUCCESS,
                  "data": {
                    "email": result[0].email,
                    "first_name": result[0].first_name,
                    "_id": result[0]._id,
                    "current_theme": result[0].current_theme,
                    "end_user_id": result[0]._id,
                    "picture": result[0].picture,
                    "mobile_number": result[0].mobile_number,
                    "isCandidate": result[0].isCandidate,
                    "isAdmin": result[0].isAdmin
                  },
                  access_token: token
                });
              } else {
                if (result[0].isCandidate === false) {
                  let recruiterService = new RecruiterService();

                  recruiterService.retrieve({"userId": result[0]._id}, (error : Error, recruiter : IRecruiter[]) => {
                    if (error) {
                      next(error);
                    }
                    else {
                      res.status(200).send({
                        "status": Messages.STATUS_SUCCESS,
                        "data": {
                          "email": result[0].email,
                          "_id": result[0]._id,
                          "end_user_id": recruiter[0]._id,
                          "current_theme": result[0].current_theme,
                          "picture": result[0].picture,
                          "company_headquarter_country": recruiter[0].company_headquarter_country,
                          "company_name": recruiter[0].company_name,
                          "setOfDocuments": recruiter[0].setOfDocuments,
                          "company_size": recruiter[0].company_size,
                          "isRecruitingForself": recruiter[0].isRecruitingForself,
                          "mobile_number": result[0].mobile_number,
                          "isCandidate": result[0].isCandidate,
                          "isAdmin": result[0].isAdmin
                        },
                        access_token: token
                      });
                    }
                  });
                }
                else {
                  let candidateService = new CandidateService();
                  candidateService.retrieve({"userId": result[0]._id}, (error, candidate) => {
                    if (error) {
                      next(error);
                    }
                    else {
                      var data: any = {
                        "status": Messages.STATUS_SUCCESS,
                        "data": {
                          "first_name": result[0].first_name,
                          "last_name": result[0].last_name,
                          "email": result[0].email,
                          "_id": result[0]._id,
                          "end_user_id": candidate[0]._id,
                          "current_theme": result[0].current_theme,
                          "picture": result[0].picture,
                          "mobile_number": result[0].mobile_number,
                          "isCandidate": result[0].isCandidate,
                          "isAdmin": result[0].isAdmin,
                          "isCompleted": candidate[0].isCompleted,
                          "isSubmitted": candidate[0].isSubmitted,
                          "guide_tour": result[0].guide_tour
                        },
                        access_token: token
                      }
                      if (params.recruiterReferenceId) {
                        let candidateService = new CandidateService();
                        candidateService.updateRecruitersMyCandidateList(candidate[0]._id,
                          {
                            'first_name': result[0].first_name,
                            'email': result[0].email,
                            'mobile_number': result[0].mobile_number,
                            'recruiterReferenceId': params.recruiterReferenceId,
                            'login': true
                          },
                          (err: Error, status: string) => {
                            if (err) {
                              next(error);
                            } else {
                              res.status(200).send(data);
                            }
                          });
                      } else {
                        res.status(200).send(data);
                      }
                    }
                  });
                }
              }
            } else {
              next({
                reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
                message: Messages.MSG_ERROR_WRONG_PASSWORD,
                stackTrace: new Error(),
                code: 400
              });
            }
          }
        });
      }
      else if (result.length > 0 && result[0].isActivated === false) {
        bcrypt.compare(params.password, result[0].password, (err: any, isPassSame: any) => {
          if (err) {
            next({
              reason: Messages.MSG_ERROR_RSN_INVALID_REGISTRATION_STATUS,
              message: Messages.MSG_ERROR_VERIFY_CANDIDATE_ACCOUNT,
              stackTrace: new Error(),
              code: 400
            });
          } else {
            if (isPassSame) {
              if (result[0].isCandidate === true) {
                next({
                  reason: Messages.MSG_ERROR_RSN_INVALID_REGISTRATION_STATUS,
                  message: Messages.MSG_ERROR_VERIFY_CANDIDATE_ACCOUNT,
                  stackTrace: new Error(),
                  code: 400
                });
              } else {
                next({
                  reason: Messages.MSG_ERROR_RSN_INVALID_REGISTRATION_STATUS,
                  message: Messages.MSG_ERROR_VERIFY_ACCOUNT,
                  stackTrace: new Error(),
                  code: 400
                });
              }
            } else {
              next({
                reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
                message: Messages.MSG_ERROR_WRONG_PASSWORD,
                stackTrace: new Error(),
                code: 400
              });
            }
          }
        });
      }
      else {
        next({
          reason: Messages.MSG_ERROR_RSN_USER_NOT_FOUND,
          message: Messages.MSG_ERROR_USER_NOT_PRESENT,
          stackTrace: new Error(),
          code: 400
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
export function generateOtp(req: express.Request, res: express.Response, next: any) {
  try {
    let userService = new UserService();
    let user = req.user;
    let params = req.body;  //mobile_number(new)

    let Data = {
      new_mobile_number: params.mobile_number,
      old_mobile_number: user.mobile_number,
      _id: user._id
    };
    userService.generateOtp(Data, (error, result) => {
      if (error) {
        if (error == Messages.MSG_ERROR_CHECK_MOBILE_PRESENT) {
          next({
            reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
            message: Messages.MSG_ERROR_REGISTRATION_MOBILE_NUMBER,
            stackTrace: new Error(),
            code: 400
          });
        }
        else {
          next(error);
        }
      }
      else if (result.length > 0) {
        res.status(200).send({
          "status": Messages.STATUS_SUCCESS,
          "data": {
            "message": Messages.MSG_SUCCESS_OTP
          }
        });
      }
      else {
        next({
          reason: Messages.MSG_ERROR_RSN_USER_NOT_FOUND,
          message: Messages.MSG_ERROR_RSN_USER_NOT_FOUND,
          stackTrace: new Error(),
          code: 400
        });
      }
    });
  }
  catch (e) {
    next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 403
    });

  }
}
export function verificationMail(req: express.Request, res: express.Response, next: any) {
  try {
    let userService = new UserService();
    let user = req.user;
    let params = req.body;
    userService.sendVerificationMail(params, (error, result) => {
      if (error) {
        next({
          reason: Messages.MSG_ERROR_RSN_WHILE_CONTACTING,
          message: Messages.MSG_ERROR_WHILE_CONTACTING,
          stackTrace: new Error(),
          code: 400
        });
      }
      else {
        res.status(200).send({
          "status": Messages.STATUS_SUCCESS,
          "data": {"message": Messages.MSG_SUCCESS_EMAIL_REGISTRATION}
        });
      }
    });
  }
  catch (e) {
    next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 403
    });

  }
}
export function recruiterVerificationMail(req: express.Request, res: express.Response, next: any) {
  try {
    let userService = new UserService();
    let user = req.user;
    let params = req.body;
    userService.sendRecruiterVerificationMail(params, (error, result) => {
      if (error) {
        next({
          reason: Messages.MSG_ERROR_RSN_WHILE_CONTACTING,
          message: Messages.MSG_ERROR_WHILE_CONTACTING,
          stackTrace: new Error(),
          code: 400
        });
      }
      else {
        res.status(200).send({
          "status": Messages.STATUS_SUCCESS,
          "data": {"message": Messages.MSG_SUCCESS_EMAIL_REGISTRATION}
        });
      }
    });
  }
  catch (e) {
    next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 403
    });

  }
}
export function mail(req: express.Request, res: express.Response, next: any) {
  try {
    let userService = new UserService();
    let params = req.body;
    userService.sendMail(params, (error, result) => {
      if (error) {
        next({
          reason: Messages.MSG_ERROR_RSN_WHILE_CONTACTING,
          message: Messages.MSG_ERROR_WHILE_CONTACTING,
          stackTrace: new Error(),
          code: 400
        });
      }
      else {
        res.status(200).send({
          "status": Messages.STATUS_SUCCESS,
          "data": {"message": Messages.MSG_SUCCESS_SUBMITTED}
        });
      }
    });
  }
  catch (e) {
    next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 403
    });

  }
}
export function create(req: express.Request, res: express.Response, next: any) {
  try {
    let newUser: UserModel = <UserModel>req.body;
    let userService = new UserService();
    // newUser.isActivated=true;
    userService.createUser(newUser, (error, result) => {
      if (error) {

        if (error == Messages.MSG_ERROR_CHECK_EMAIL_PRESENT) {
          next({
            reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
            message: Messages.MSG_ERROR_VERIFY_ACCOUNT,
            stackTrace: new Error(),
            code: 400
          });
        }
        else if (error == Messages.MSG_ERROR_CHECK_MOBILE_PRESENT) {
          next({
            reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
            message: Messages.MSG_ERROR_REGISTRATION_MOBILE_NUMBER,
            stackTrace: new Error(),
            code: 400
          });
        }
        else {
          next({
            reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
            message: Messages.MSG_ERROR_USER_WITH_EMAIL_PRESENT,
            stackTrace: new Error(),
            code: 400
          });
        }
      }
      else {
        let auth: AuthInterceptor = new AuthInterceptor();
        let token = auth.issueTokenWithUid(result);
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
  } catch (e) {
    next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 403
    });
  }
}

export function forgotPassword(req: express.Request, res: express.Response, next: any) {
  try {
    let userService = new UserService();
    let params = req.body;   //email

    /* let linkq =req.url;
     let fullUrl = app.get("/api/address",  userController.getAddress);req.protocol + '://' + req.get('host') + req.originalUrl;
     console.log(fullUrl);*/
    userService.forgotPassword(params, (error, result) => {

      if (error) {
        if (error == Messages.MSG_ERROR_CHECK_INACTIVE_ACCOUNT) {
          next({
            reason: Messages.MSG_ERROR_USER_NOT_ACTIVATED,
            message: Messages.MSG_ERROR_ACCOUNT_STATUS,
            stackTrace: new Error(),
            code: 400
          });
        }
        else if (error == Messages.MSG_ERROR_CHECK_INVALID_ACCOUNT) {
          next({
            reason: Messages.MSG_ERROR_RSN_USER_NOT_FOUND,
            message: Messages.MSG_ERROR_USER_NOT_FOUND,
            stackTrace: new Error(),
            code: 400
          });
        }
      }
      else {
        res.status(200).send({
          "status": Messages.STATUS_SUCCESS,
          "data": {"message": Messages.MSG_SUCCESS_EMAIL_FORGOT_PASSWORD}
        });
      }
    });
  }
  catch (e) {
    next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 403
    });
  }
}

export function notifications(req: express.Request, res: express.Response, next: any) {
  try {
    let user = req.user;
    let auth: AuthInterceptor = new AuthInterceptor();
    let token = auth.issueTokenWithUid(user);

    //retrieve notification for a particular user
    let params = {_id: user._id};
    let userService = new UserService();

    userService.retrieve(params, (error, result) => {
      if (error) {
        next(error);
      }
      else if (result.length > 0) {
        let token = auth.issueTokenWithUid(user);
        res.send({
          "status": "success",
          "data": result[0].notifications,
          access_token: token
        });
      }
    });
  } catch (e) {
    next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 403
    });
  }
}

export function pushNotifications(req: express.Request, res: express.Response, next: any) {
  try {
    let user = req.user;
    let body_data = req.body;
    let auth: AuthInterceptor = new AuthInterceptor();
    let token = auth.issueTokenWithUid(user);

    //retrieve notification for a particular user
    let params = {_id: user._id};
    let userService = new UserService();
    let data = {$push: {notifications: body_data}};

    userService.findOneAndUpdate(params, data, {new: true}, (error, result) => {
      if (error) {
        next(error);
      }
      else {
        let token = auth.issueTokenWithUid(user);
        res.send({
          "status": "Success",
          "data": result.notifications,

        });
      }
    });
  } catch (e) {
    next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 403
    });
  }
}

export function updateNotifications(req: express.Request, res: express.Response, next: any) {
  try {
    let user = req.user;
    let body_data = req.body;
    let auth: AuthInterceptor = new AuthInterceptor();
    let token = auth.issueTokenWithUid(user);

    let params = {_id: user._id};
    let userService = new UserService();
    let data = {is_read: true};

    userService.findAndUpdateNotification(params, data, {new: true}, (error, result) => {
      if (error) {
        next(error);
      }
      else {
        let token = auth.issueTokenWithUid(user);
        res.send({
          "status": "Success",
          "data": result.notifications,

        });
      }
    });
  } catch (e) {
    next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 403
    });
  }
}

export function updateDetails(req: express.Request, res: express.Response, next: any) {
  try {
    let newUserData: UserModel = <UserModel>req.body;
    let params = req.query;
    delete params.access_token;
    let user = req.user;
    let _id: string = user._id;

    let auth: AuthInterceptor = new AuthInterceptor();
    let userService = new UserService();
    userService.update(_id, newUserData, (error, result) => {
      if (error) {
        next(error);
      }
      else {
        userService.retrieve(_id, (error, result) => {
          if (error) {
            next({
              reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
              message: Messages.MSG_ERROR_WRONG_TOKEN,
              stackTrace: new Error(),
              code: 400
            });
          }
          else {
            res.send({
              "status": "success",
              "data": {
                "first_name": result[0].first_name,
                "last_name": result[0].last_name,
                "email": result[0].email,
                "mobile_number": result[0].mobile_number,
                "picture": result[0].picture,
                "_id": result[0].userId,
                "current_theme": result[0].current_theme
              }
            });
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
      code: 403
    });
  }
}

export function updateRecruiterAccountDetails(req: express.Request, res: express.Response, next: any) {
  try {
    let newUserData: RecruiterModel = <RecruiterModel>req.body;
    let user = req.user;
    let _id: string = user._id;
    let auth: AuthInterceptor = new AuthInterceptor();
    let recruiterService = new RecruiterService();
    recruiterService.updateDetails(_id, newUserData, (error, result) => {
      if (error) {
        next(error);
      } else {
        res.send({
          'status': 'Success'
        });
      }
    });
  } catch (e) {
    next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 403
    });
  }
}
export function updateProfileField(req: express.Request, res: express.Response, next: any) {
  try {
    //let newUserData: UserModel = <UserModel>req.body;

    let params = req.query;
    delete params.access_token;
    let user = req.user;
    let _id: string = user._id;
    let fName: string = req.params.fname;
    if (fName == 'guide_tour') {
      var data = {'guide_tour': req.body};
    }
    let auth: AuthInterceptor = new AuthInterceptor();
    let userService = new UserService();
    userService.update(_id, data, (error, result) => {
      if (error) {
        next(error);
      }
      else {
        userService.retrieve(_id, (error, result) => {
          if (error) {
            next({
              reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
              message: Messages.MSG_ERROR_WRONG_TOKEN,
              stackTrace: new Error(),
              code: 400
            });
          }
          else {
            res.send({
              "status": "success",
              "data": {
                "first_name": result[0].first_name,
                "last_name": result[0].last_name,
                "email": result[0].email,
                "_id": result[0].userId,
                "guide_tour": result[0].guide_tour
              }
            });
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
      code: 403
    });
  }
}

export function retrieve(req: express.Request, res: express.Response, next: any) {
  try {
    let userService = new UserService();
    let params = req.params.id;
    delete params.access_token;
    let user = req.user;
    let auth: AuthInterceptor = new AuthInterceptor();

    let token = auth.issueTokenWithUid(user);
        res.send({
          "status": "success",
          "data": {
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "mobile_number": user.mobile_number,
            "picture": user.picture,
            "social_profile_picture": user.social_profile_picture,
            "_id": user.userId,
            "current_theme": user.current_theme
          },
          access_token: token
        });
  }catch (e) {
    next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 403
    });  }
}
export function resetPassword(req: express.Request, res: express.Response, next: any) {
  try {
    let user = req.user;
    let params = req.body;   //new_password
    delete params.access_token;
    let userService = new UserService();
    const saltRounds = 10;
    bcrypt.hash(req.body.new_password, saltRounds, (err: any, hash: any) => {
      if (err) {
        next({
          reason: 'Error in creating hash using bcrypt',
          message: 'Error in creating hash using bcrypt',
          stackTrace: new Error(),
          code: 403
        });
      } else {
        let updateData = {'password': hash};
        let query = {"_id": user._id, "password": req.user.password};
        userService.findOneAndUpdate(query, updateData, {new: true}, (error, result) => {
          if (error) {
            next(error);
          } else {
            res.send({
              'status': 'Success',
              'data': {'message': 'Password changed successfully'}
            });
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
      code: 403
    });
  }
}

export function changePassword(req: express.Request, res: express.Response, next: any) {
  try {
    let user = req.user;
    let params = req.query;
    delete params.access_token;
    let auth: AuthInterceptor = new AuthInterceptor();
    let userService = new UserService();
    bcrypt.compare(req.body.current_password, user.password, (err: any, isSame: any) => {
      if (err) {
        next({
          reason: Messages.MSG_ERROR_RSN_INVALID_REGISTRATION_STATUS,
          message: Messages.MSG_ERROR_VERIFY_CANDIDATE_ACCOUNT,
          stackTrace: new Error(),
          code: 400
        });
      } else {
        if (isSame) {

          if (req.body.current_password === req.body.new_password) {
            next({
              reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
              message: Messages.MSG_ERROR_SAME_NEW_PASSWORD,
              stackTrace: new Error(),
              code: 400
            });
          } else {

            let new_password: any;
            const saltRounds = 10;
            bcrypt.hash(req.body.new_password, saltRounds, (err: any, hash: any) => {
              // Store hash in your password DB.
              if (err) {
                next({
                  reason: Messages.MSG_ERROR_RSN_INVALID_REGISTRATION_STATUS,
                  message: Messages.MSG_ERROR_BCRYPT_CREATION,
                  stackTrace: new Error(),
                  code: 400
                });
              }
              else {
                new_password = hash;
                let query = {"_id": req.user._id};
                let updateData = {"password": new_password};
                userService.findOneAndUpdate(query, updateData, {new: true}, (error, result) => {
                  if (error) {
                    next(error);
                  }
                  else {
                    let token = auth.issueTokenWithUid(user);
                    res.send({
                      "status": "Success",
                      "data": {"message": Messages.MSG_SUCCESS_PASSWORD_CHANGE},
                      access_token: token
                    });
                  }
                });
              }
            });
          }
        } else {
          next({
            reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
            message: Messages.MSG_ERROR_WRONG_CURRENT_PASSWORD,
            stackTrace: new Error(),
            code: 400
          });
        }
      }
    });
  }
  catch (e) {
    next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 403
    });
  }
}

export function changeMobileNumber(req: express.Request, res: express.Response, next: any) {

  try {
    let user = req.user;

    let params = req.body;
    let auth: AuthInterceptor = new AuthInterceptor();
    let userService = new UserService();

    let query = {"mobile_number": params.new_mobile_number, "isActivated": true};

    userService.retrieve(query, (error, result) => {
      if (error) {
        next(error);
      }
      else if (result.length > 0) {
        next({
          reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
          message: Messages.MSG_ERROR_REGISTRATION_MOBILE_NUMBER,
          stackTrace: new Error(),
          code: 400
        });

      }
      else {
        let Data = {
          current_mobile_number: user.mobile_number,
          _id: user._id,
          new_mobile_number: params.new_mobile_number
        };
        userService.changeMobileNumber(Data, (error, result) => {
          if (error) {
            next({
              reason: Messages.MSG_ERROR_RSN_WHILE_CONTACTING,
              message: Messages.MSG_ERROR_WHILE_CONTACTING,
              stackTrace: new Error(),
              code: 400
            });
          }
          else {
            res.status(200).send({
              "status": Messages.STATUS_SUCCESS,
              "data": {
                "message": Messages.MSG_SUCCESS_OTP_CHANGE_MOBILE_NUMBER
              }
            });
          }
        });
      }
    });
  } catch (e) {
    next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 403
    });
  }
}

export function changeEmailId(req: express.Request, res: express.Response, next: any) {

  try {
    let user = req.user;
    let params = req.query;
    delete params.access_token;
    let auth: AuthInterceptor = new AuthInterceptor();
    let userService = new UserService();


    let query = {"email": req.body.new_email};

    userService.retrieve(query, (error, result) => {

      if (error) {
        next(error);
      }
      else if (result.length > 0 && result[0].isActivated === true) {
        next({
          reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
          message: Messages.MSG_ERROR_REGISTRATION,
          stackTrace: new Error(),
          code: 400
        });

      }
      else if (result.length > 0 && result[0].isActivated === false) {
        next({
          reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
          message: Messages.MSG_ERROR_ACCOUNT_STATUS,
          stackTrace: new Error(),
          code: 400
        });

      }

      else {

        let emailId = {
          current_email: req.body.current_email,
          new_email: req.body.new_email
        };

        userService.SendChangeMailVerification(emailId, (error, result) => {
          if (error) {
            if (error === Messages.MSG_ERROR_CHECK_EMAIL_ACCOUNT) {
              next({
                reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
                message: Messages.MSG_ERROR_EMAIL_ACTIVE_NOW,
                stackTrace: new Error(),
                code: 400
              });
            }
            else {
              next({
                reason: Messages.MSG_ERROR_RSN_WHILE_CONTACTING,
                message: Messages.MSG_ERROR_WHILE_CONTACTING,
                stackTrace: new Error(),
                code: 400
              });

            }
          }
          else {
            res.status(200).send({
              "status": Messages.STATUS_SUCCESS,
              "data": {"message": Messages.MSG_SUCCESS_EMAIL_CHANGE_EMAILID}
            });
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
      code: 403
    });
  }
}

export function verifyMobileNumber(req: express.Request, res: express.Response, next: any) {
  try {

    let user = req.user;

    let params = req.body; //otp
    let userService = new UserService();
    let query = {"_id": user._id};
    let updateData = {"mobile_number": user.temp_mobile, "temp_mobile": user.mobile_number};
    if (user.otp === params.otp) {
      userService.findOneAndUpdate(query, updateData, {new: true}, (error, result) => {
        if (error) {
          next(error);
        }
        else {
          res.send({
            "status": "Success",
            "data": {"message": "User Account verified successfully"}
          });
        }
      });
    }
    else {
      next({
        reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
        message: Messages.MSG_ERROR_WRONG_OTP,
        stackTrace: new Error(),
        code: 400
      });
    }

  }
  catch (e) {
    next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 403
    });
  }
}

export function verifyOtp(req: express.Request, res: express.Response, next: any) {
  try {

    let user = req.user;

    let params = req.body; //OTP
    //  delete params.access_token;
    let userService = new UserService();
    let mailChimpMailerService = new MailChimpMailerService();

    let query = {"_id": user._id, "isActivated": false};
    let updateData = {"isActivated": true, "activation_date" : new Date()};
    if (user.otp === params.otp) {
      userService.findOneAndUpdate(query, updateData, {new: true}, (error, result) => {
        if (error) {
          next(error);
        }
        else {
          res.send({
            "status": "Success",
            "data": {"message": "User Account verified successfully"}
          });
          mailChimpMailerService.onCandidateSignSuccess(result);

        }
      });
    }
    else {
      next({
        reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
        message: Messages.MSG_ERROR_WRONG_OTP,
        stackTrace: new Error(),
        code: 400
      });
    }

  }
  catch (e) {
    next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 403
    });
  }
}


export function verifyAccount(req: express.Request, res: express.Response, next: any) {
  try {

    let user = req.user;
    let params = req.query;
    delete params.access_token;
    let userService = new UserService();

    let query = {"_id": user._id, "isActivated": false};
    let updateData = {"isActivated": true};
    userService.findOneAndUpdate(query, updateData, {new: true}, (error, result) => {
      if (error) {
        next(error);
      }
      else {

        res.send({
          "status": "Success",
          "data": {"message": "User Account verified successfully"}
        });
      }

    });
  }
  catch (e) {
    next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 403
    });
  }
}

export function verifyChangedEmailId(req: express.Request, res: express.Response, next: any) {
  try {
    let user = req.user;
    let params = req.query;
    delete params.access_token;
    let userService = new UserService();

    let query = {"_id": user._id};
    let updateData = {"email": user.temp_email, "temp_email": user.email};
    userService.findOneAndUpdate(query, updateData, {new: true}, (error, result) => {
      if (error) {
        next(error);
      }
      else {

        res.send({
          "status": "Success",
          "data": {"message": "User Account verified successfully"}
        });
      }

    });
  }
  catch (e) {
    next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 403
    });
  }
}

export function getIndustry(req: express.Request, res: express.Response, next: any) {
  __dirname = './';
  let filepath = "industry.json";
  try {
    res.sendFile(filepath, {root: __dirname});
  }
  catch (e) {
    next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 403
    });
  }
}

export function getCompanySize(req: express.Request, res: express.Response, next: any) {
  __dirname = './';
  let filepath = "company-size.json";
  try {
    res.sendFile(filepath, {root: __dirname});
  }
  catch (e) {
    next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 403
    });
  }
}

export function getAddress(req: express.Request, res: express.Response, next: any) {
  __dirname = './';
  let filepath = "address.json";
  try {
    res.sendFile(filepath, {root: __dirname});
  }
  catch (e) {
    next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 403
    });
  }
}
export function getRealocation(req: express.Request, res: express.Response, next: any) {

  __dirname = './';
  let filepath = "realocation.json";
  try {
    res.sendFile(filepath, {root: __dirname});
  }
  catch (e) {
    next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 403
    });
  }
}
export function getEducation(req: express.Request, res: express.Response, next: any) {
  __dirname = './';
  let filepath = "education.json";
  try {
    res.sendFile(filepath, {root: __dirname});
  }
  catch (e) {
    next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 403
    });
  }
}


export function getCloseJobReasons(req: express.Request, res: express.Response, next: any) {
  __dirname = './';
  let filepath = "closeJob.json";
  try {
    res.sendFile(filepath, {root: __dirname});
  }
  catch (e) {
    next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 403
    });
  }
}


export function getExperience(req: express.Request, res: express.Response, next: any) {
  __dirname = './';
  let filepath = "experienceList.json";
  try {
    res.sendFile(filepath, {root: __dirname});
  }
  catch (e) {
    next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 403
    });
  }
}
export function getCurrentSalary(req: express.Request, res: express.Response, next: any) {
  __dirname = './';
  let filepath = "currentsalaryList.json";
  try {
    res.sendFile(filepath, {root: __dirname});
  }
  catch (e) {
    next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 403
    });
  }
}

export function getNoticePeriod(req: express.Request, res: express.Response, next: any) {
  __dirname = './';
  let filepath = "noticeperiodList.json";
  try {
    res.sendFile(filepath, {root: __dirname});
  }
  catch (e) {
    next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 403
    });
  }
}

export function getIndustryExposure(req: express.Request, res: express.Response, next: any) {
  __dirname = './';
  let filepath = "industryexposureList.json";
  try {
    res.sendFile(filepath, {root: __dirname});
  }
  catch (e) {
    next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 403
    });
  }
}

export function getSearchedCandidate(req: express.Request, res: express.Response, next: any) {
  __dirname = './';
  let filepath = "candidate.json";
  try {
    res.sendFile(filepath, {root: __dirname});
  }
  catch (e) {
    next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 403
    });
  }

}


export function getCountries(req: express.Request, res: express.Response, next: any) {
  __dirname = './';
  let filepath = "country.json";
  try {
    res.sendFile(filepath, {root: __dirname});
  }
  catch (e) {
    next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 403
    });
  }
}
export function getIndiaStates(req: express.Request, res: express.Response, next: any) {
  __dirname = './';
  let filepath = "indiaStates.json";
  try {
    res.sendFile(filepath, {root: __dirname});
  }
  catch (e) {
    next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 403
    });
  }
}


export function getFunction(req: express.Request, res: express.Response, next: any) {
  __dirname = './';
  let filepath = "function.json";
  try {
    res.sendFile(filepath, {root: __dirname});
  }
  catch (e) {
    next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 403
    });
  }
}
export function getRole(req: express.Request, res: express.Response, next: any) {
  __dirname = './';
  let filepath = "roles.json";
  try {
    res.sendFile(filepath, {root: __dirname});
  }
  catch (e) {
    next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 403
    });
  }
}
export function getProficiency(req: express.Request, res: express.Response, next: any) {
  __dirname = './';
  let filepath = "proficiency.json";
  try {
    res.sendFile(filepath, {root: __dirname});
  }
  catch (e) {
    next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 403
    });
  }
}

export function getDomain(req: express.Request, res: express.Response, next: any) {
  __dirname = './';
  let filepath = "domain.json";
  try {
    res.sendFile(filepath, {root: __dirname});
  }
  catch (e) {
    next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 403
    });
  }
}


export function getCapability(req: express.Request, res: express.Response, next: any) {
  __dirname = './';
  let filepath = "capability.json";
  try {
    res.sendFile(filepath, {root: __dirname});
  }
  catch (e) {
    next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 403
    });
  }
}

export function getComplexity(req: express.Request, res: express.Response, next: any) {
  __dirname = './';
  let filepath = "complexity.json";
  try {
    res.sendFile(filepath, {root: __dirname});
  }
  catch (e) {
    next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 403
    });
  }
}

export function fblogin(req: express.Request, res: express.Response, next: any) {
  try {
    let userService = new UserService();
    let params = req.user;
    let auth = new AuthInterceptor();
    userService.retrieve(params, (error, result) => {
      if (error) {
        next(error);
      }
      else if (result.length > 0) {
        let token = auth.issueTokenWithUid(result[0]);
        res.status(200).send({
          "status": Messages.STATUS_SUCCESS,
          "isSocialLogin": true,
          "data": {
            "first_name": result[0].first_name,
            "last_name": result[0].last_name,
            "email": result[0].email,
            "mobile_number": result[0].mobile_number,
            "picture": result[0].picture,
            "_id": result[0]._id,
            "current_theme": result[0].current_theme
          },
          access_token: token
        });
      }
      else {
        next({
          reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
          message: Messages.MSG_ERROR_INVALID_CREDENTIALS,
          stackTrace: new Error(),
          code: 400
        });
      }
    });
  }
  catch (e) {
    next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 403
    });

  }
}
export function googlelogin(req: express.Request, res: express.Response, next: any) {
  try {
    let userService = new UserService();
    let params = req.user;
    let auth = new AuthInterceptor();
    userService.retrieve(params, (error, result) => {
      if (error) {
        next(error);
      }
      else if (result.length > 0) {
        let token = auth.issueTokenWithUid(result[0]);
        res.status(200).send({
          "status": Messages.STATUS_SUCCESS,
          "isSocialLogin": true,
          "data": {
            "first_name": result[0].first_name,
            "last_name": result[0].last_name,
            "email": result[0].email,
            "mobile_number": result[0].mobile_number,
            "social_profile_picture": result[0].social_profile_picture,
            "current_theme": result[0].current_theme,
            "_id": result[0]._id
          },
          access_token: token
        });
      }
      else {
        next({
          reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
          message: Messages.MSG_ERROR_INVALID_CREDENTIALS,
          stackTrace: new Error(),
          code: 400
        });
      }
    });
  }
  catch (e) {
    next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 403
    });

  }
}
/*export function getGoogleToken(req : express.Request, res: express.Response, next: any) {
 let token = JSON.stringify(req.body.token);

 let url = 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token='+token;
 console.log('url : '+token);
 request(url, function( error:any , response:any , body:any ) {
 if(error){
 console.log('error :'+error);
 //res.send(error);
 }
 else if (body) {
 console.log('body :'+JSON.stringify(body));
 //res.send(body);
 }
 });
 // res.send(token);
 }*/

export function updatePicture(req: express.Request, res: express.Response, next: any): void {
  __dirname = path.resolve() + config.get('TplSeed.profilePath');
  let form = new multiparty.Form({uploadDir: __dirname});
  form.parse(req, (err: Error, fields: any, files: any) => {
    if (err) {
      next({
        reason: Messages.MSG_ERROR_RSN_DIRECTORY_NOT_FOUND,
        message: Messages.MSG_ERROR_DIRECTORY_NOT_FOUND,
        stackTrace: new Error(),
        actualError: err,
        code: 403
      });
    } else {
      let path = JSON.stringify(files.file[0].path);
      let image_path = files.file[0].path;
      let originalFilename = JSON.stringify(image_path.substr(files.file[0].path.lastIndexOf('/') + 1));
      let userService = new UserService();
      path=config.get('TplSeed.profilePathForClient')+originalFilename.replace(/"/g,'');

      userService.UploadImage(path, originalFilename, function (err: any, tempath: any) {
        if (err) {
          next(err);
        }
        else {
          let mypath = tempath;

          try {
            let user = req.user;
            let query = {"_id": user._id};

            userService.findById(user._id, (error, result) => {
              if (error) {
                next(error);
              }
              else {
                if (!result.isCandidate) {
                  let recruiterService: RecruiterService = new RecruiterService();
                  let query1 = {"userId": result._id};
                  recruiterService.findOneAndUpdate(query1, {company_logo: mypath}, {new: true}, (error, response1) => {
                    if (error) {
                      next(error);
                    }
                    else {
                      userService.findOneAndUpdate(query, {picture: mypath}, {new: true}, (error, response) => {
                        if (error) {
                          next(error);
                        }
                        else {
                          let auth: AuthInterceptor = new AuthInterceptor();
                          let token = auth.issueTokenWithUid(result);
                          res.status(200).send({access_token: token, data: response});
                        }
                      });

                    }
                  });

                } else {
                  userService.findOneAndUpdate(query, {picture: mypath}, {new: true}, (error, response) => {
                    if (error) {
                      next(error);
                    }
                    else {
                      let auth: AuthInterceptor = new AuthInterceptor();
                      let token = auth.issueTokenWithUid(result);
                      res.status(200).send({access_token: token, data: response});
                    }
                  });
                }


              }
            });
          }
          catch (e) {
            next({
              reason: e.message,
              message: e.message,
              stackTrace: new Error(),
              code: 403
            });
          }
        }
      });
    }

  });
}


export function updateCompanyDetails(req: express.Request, res: express.Response, next: any): void {

  let userService = new UserService();
  let user = req.user;
  let query = {"_id": user._id};
  /*userService.findOneAndUpdate(query, {picture: mypath}, {new: true}, (error, result) => {
   if (error) {
   res.status(403).send({message: error});
   }
   else{
   let auth:AuthInterceptor = new AuthInterceptor();
   let token = auth.issueTokenWithUid(result);
   res.status(200).send({access_token: token, data: result});
   }
   });*/
}

export function uploaddocuments(req: express.Request, res: express.Response, next: any): void {
  __dirname = 'src/server/app/framework/public/uploaded-document';

  let form = new multiparty.Form({uploadDir: __dirname});
  form.parse(req, (err: Error, fields: any, files: any) => {
    if (err) {
      next({
        reason: Messages.MSG_ERROR_RSN_DIRECTORY_NOT_FOUND,
        message: Messages.MSG_ERROR_DIRECTORY_NOT_FOUND,
        stackTrace: new Error(),
        code: 403
      });
    } else {
      let path = JSON.stringify(files.file[0].path);
      let document_path = files.file[0].path;
      let originalFilename = JSON.stringify(document_path.substr(files.file[0].path.lastIndexOf('/') + 1));

      res.status(200).send({
        "status": Messages.STATUS_SUCCESS,
        "data": {
          "document": document_path
        }
      });

      /*   let userService = new UserService();
       userService.UploadDocuments(path, originalFilename, function (err:any, tempath:any) {
       if (err) {
       console.log("Err message of uploaddocument is:",err);
       next(err);
       }
       else {
       let mypath = tempath;
       try {
       let user = req.user;
       let query = {"_id": user._id};
       userService.findOneAndUpdate(query, {document1: mypath}, {new: true}, (error, result) => {
       if (error) {
       res.status(403).send({message: error});
       }
       else{
       let auth:AuthInterceptor = new AuthInterceptor();
       let token = auth.issueTokenWithUid(result);
       res.status(200).send({access_token: token, data: result});
       }
       });
       }
       catch (e) {
       next({
       reason: e.message,
       message: e.message,
       stackTrace:new Error(),
       code: 403
       });
       }
       }
       });*/
    }

  });


}

export function profilecreate(req: express.Request, res: express.Response, next: any) {
  try {

  } catch (e) {
    next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 403
    });
  }
}


export function professionaldata(req: express.Request, res: express.Response, next: any) {
  try {

    let newUser = req.body;

  } catch (e) {
    next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 403
    });
  }

}

export function employmentdata(req: express.Request, res: express.Response, next: any) {
  try {

    let newUser = req.body;

  } catch (e) {
    next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 403
    });
  }

}


export function changeTheme(req: express.Request, res: express.Response, next: any): void {
  try {
    let user = req.user;
    let params = req.query;
    delete params.access_token;
    let auth: AuthInterceptor = new AuthInterceptor();
    let userService = new UserService();
    let query = {"_id": req.user.id};
    let updateData = {"current_theme": req.body.current_theme};
    userService.findOneAndUpdate(query, updateData, {new: true}, (error, result) => {
      if (error) {
        next(error);
      }
      else {
        let token = auth.issueTokenWithUid(user);

        res.send({
          access_token: token, data: result
        });
      }
    });
  } catch (e) {
    next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 403
    });
  }


}

export function getUserFeedback(req: express.Request, res: express.Response, next: any) {
  __dirname = './';
  let filepath = "feedbackForCandidate.json";
  try {
    res.sendFile(filepath, {root: __dirname});
  }
  catch (e) {
    next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 403
    });
  }
}

export function getUserRegistrationStatus(req: express.Request, res: express.Response, next: any) {
  try {
    let userService = new UserService();
    let query = {'mobile_number': req.params.mobileNo};
    userService.getUserRegistrationStatus(query, (error, result) => {
      if (error) {
        next(error);
      } else {
        let data: any = {'recruiterId': req.query.recruiterId, 'mobileNo': req.params.mobileNo};
        let recruiterService = new RecruiterService();
        recruiterService.notifyRecruiter(data, result, (error, notifyResponse) => {
          if (error) {
            next({
              reason: Messages.MSG_ERROR_RSN_WHILE_CONTACTING,
              message: Messages.MSG_ERROR_WHILE_CONTACTING,
              stackTrace: new Error(),
              code: 403
            });
          } else {
            res.status(200).send(result);
          }
        });
      }
    });
  } catch (e) {
    next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 403
    });
  }

}
