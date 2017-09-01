import * as express from "express";
import * as multiparty from "multiparty";
import AuthInterceptor = require("../interceptor/auth.interceptor");
import SendMailService = require("../services/sendmail.service");
import UserModel = require("../dataaccess/model/user.model");
import UserService = require("../services/user.service");
import RecruiterService = require("../services/recruiter.service");
import Messages = require("../shared/messages");
import ResponseService = require("../shared/response.service");
import CandidateService = require("../services/candidate.service");
var bcrypt = require('bcrypt');

export function login(req: express.Request, res: express.Response, next: any) {
  try {

    var userService = new UserService();
    var params = req.body;
    delete params.access_token;
    userService.retrieve({"email": params.email}, (error, result) => {
      if (error) {
        next(error);
      }

      else if (result.length > 0 && result[0].isActivated === true) {
        bcrypt.compare(params.password, result[0].password, (err : any, isSame : any)=> {
          if(err) {
            next({
              reason: Messages.MSG_ERROR_RSN_INVALID_REGISTRATION_STATUS,
              message: Messages.MSG_ERROR_VERIFY_CANDIDATE_ACCOUNT,
              code: 403
            });
          }else {
            if(isSame){
              var auth = new AuthInterceptor();
              var token = auth.issueTokenWithUid(result[0]);
              if(result[0].isAdmin){
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
              }else{
                if (result[0].isCandidate === false) {
                  var recruiterService = new RecruiterService();

                  recruiterService.retrieve({"userId": result[0]._id}, (error, recruiter) => {
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
                  var candidateService = new CandidateService();
                  candidateService.retrieve({"userId": result[0]._id}, (error, candidate) => {
                    if (error) {
                      next(error);
                    }
                    else {
                      res.status(200).send({
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
                          "guide_tour": result[0].guide_tour
                        },
                        access_token: token
                      });
                    }
                  });
                }
              }
            }else{
              next({
                reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
                message: Messages.MSG_ERROR_WRONG_PASSWORD,
                code: 403
              });
            }
          }
        });
      }
      else if (result.length > 0 && result[0].isActivated === false) {
        bcrypt.compare(params.password, result[0].password, (err : any, isPassSame : any)=> {
          if(err) {
            next({
              reason: Messages.MSG_ERROR_RSN_INVALID_REGISTRATION_STATUS,
              message: Messages.MSG_ERROR_VERIFY_CANDIDATE_ACCOUNT,
              code: 403
            });
          }else {
            if(isPassSame) {
              if(result[0].isCandidate === true) {
                next({
                  reason: Messages.MSG_ERROR_RSN_INVALID_REGISTRATION_STATUS,
                  message: Messages.MSG_ERROR_VERIFY_CANDIDATE_ACCOUNT,
                  code: 403
                });
              } else {
                next({
                  reason: Messages.MSG_ERROR_RSN_INVALID_REGISTRATION_STATUS,
                  message: Messages.MSG_ERROR_VERIFY_ACCOUNT,
                  code: 403
                });
              }
            }else {
              next({
                reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
                message: Messages.MSG_ERROR_WRONG_PASSWORD,
                code: 403
              });
            }
          }
        });
      }
      else {
        next({
          reason: Messages.MSG_ERROR_RSN_USER_NOT_FOUND,
          message: Messages.MSG_ERROR_USER_NOT_PRESENT,
          code: 403
        });
      }
    });
  }
  catch (e) {
    res.status(403).send({message: e.message});
  }
};

export function generateOtp(req: express.Request, res: express.Response, next: any) {
  try {
    var userService = new UserService();
    var user = req.user;
    var params = req.body;  //mobile_number(new)

    var Data = {
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
            code: 403
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
        res.status(401).send({
          "status": Messages.STATUS_ERROR,
          "data": {
            "message": Messages.MSG_ERROR_RSN_USER_NOT_FOUND
          }
        });
      }
    });
  }
  catch (e) {
    res.status(403).send({message: e.message});

  }
}
export function verificationMail(req: express.Request, res: express.Response, next: any) {
  try {
    var userService = new UserService();
    var user = req.user;
    var params = req.body;
    userService.sendVerificationMail(params, (error, result) => {
      if (error) {
        next({
          reason: Messages.MSG_ERROR_RSN_WHILE_CONTACTING,
          message: Messages.MSG_ERROR_WHILE_CONTACTING,
          code: 403
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
    res.status(403).send({message: e.message});

  }
}
export function recruiterVerificationMail(req: express.Request, res: express.Response, next: any) {
  try {
    var userService = new UserService();
    var user = req.user;
    var params = req.body;
    userService.sendRecruiterVerificationMail(params, (error, result) => {
      if (error) {
        next({
          reason: Messages.MSG_ERROR_RSN_WHILE_CONTACTING,
          message: Messages.MSG_ERROR_WHILE_CONTACTING,
          code: 403
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
    res.status(403).send({message: e.message});

  }
}
export function mail(req: express.Request, res: express.Response, next: any) {
  try {
    var userService = new UserService();
    var params = req.body;
    userService.sendMail(params, (error, result) => {
      if (error) {
        next({
          reason: Messages.MSG_ERROR_RSN_WHILE_CONTACTING,
          message: Messages.MSG_ERROR_WHILE_CONTACTING,
          code: 403
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
    res.status(403).send({message: e.message});

  }
}
export function create(req: express.Request, res: express.Response, next: any) {
  try {
    var newUser: UserModel = <UserModel>req.body;
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
    res.status(403).send({"status": Messages.STATUS_ERROR, "error_message": e.message});
  }
}

export function forgotPassword(req: express.Request, res: express.Response, next: any) {
  try {
    var userService = new UserService();
    var params = req.body;   //email

    /* var linkq =req.url;
     var fullUrl = app.get("/api/address",  userController.getAddress);req.protocol + '://' + req.get('host') + req.originalUrl;
     console.log(fullUrl);*/
    userService.forgotPassword(params, (error, result) => {

      if (error) {
        if (error == Messages.MSG_ERROR_CHECK_INACTIVE_ACCOUNT) {
          next({
            reason: Messages.MSG_ERROR_USER_NOT_ACTIVATED,
            message: Messages.MSG_ERROR_ACCOUNT_STATUS,
            code: 403
          });
        }
        else if (error == Messages.MSG_ERROR_CHECK_INVALID_ACCOUNT) {
          next({
            reason: Messages.MSG_ERROR_RSN_USER_NOT_FOUND,
            message: Messages.MSG_ERROR_USER_NOT_FOUND,
            code: 403
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
    res.status(403).send({message: e.message});
  }
}

export function notifications(req: express.Request, res: express.Response, next: any) {
  try {
    var user = req.user;
    var auth: AuthInterceptor = new AuthInterceptor();
    var token = auth.issueTokenWithUid(user);

    //retrieve notification for a particular user
    var params = {_id: user._id};
    var userService = new UserService();

    userService.retrieve(params, (error, result) => {
      if (error) {
        next(error);
      }
      else if (result.length > 0) {
        var token = auth.issueTokenWithUid(user);
        res.send({
          "status": "success",
          "data": result[0].notifications,
          access_token: token
        });
      }
    });
  }
  catch (e) {

    res.status(403).send({message: e.message});
  }
}

export function pushNotifications(req: express.Request, res: express.Response, next: any) {
  try {
    var user = req.user;
    var body_data = req.body;
    var auth: AuthInterceptor = new AuthInterceptor();
    var token = auth.issueTokenWithUid(user);

    //retrieve notification for a particular user
    var params = {_id: user._id};
    var userService = new UserService();
    var data = {$push: {notifications: body_data}};

    userService.findOneAndUpdate(params, data, {new: true}, (error, result) => {
      if (error) {
        next(error);
      }
      else {
        var token = auth.issueTokenWithUid(user);
        res.send({
          "status": "Success",
          "data": result.notifications,

        });
      }
    });
  }
  catch (e) {

    res.status(403).send({message: e.message});
  }
}

export function updateNotifications(req: express.Request, res: express.Response, next: any) {
  try {
    var user = req.user;
    var body_data = req.body;
    console.log('Notification id :' + JSON.stringify(body_data));
    var auth: AuthInterceptor = new AuthInterceptor();
    var token = auth.issueTokenWithUid(user);

    var params = {_id: user._id};
    var userService = new UserService();
    var data = {is_read: true};

    userService.findAndUpdateNotification(params, data, {new: true}, (error, result) => {
      if (error) {
        next(error);
      }
      else {
        var token = auth.issueTokenWithUid(user);
        res.send({
          "status": "Success",
          "data": result.notifications,

        });
      }
    });
  }
  catch (e) {

    res.status(403).send({message: e.message});
  }
}

export function updateDetails(req: express.Request, res: express.Response, next: any) {
  try {
    var newUserData: UserModel = <UserModel>req.body;
    var params = req.query;
    delete params.access_token;
    var user = req.user;
    var _id: string = user._id;

    var auth: AuthInterceptor = new AuthInterceptor();
    var userService = new UserService();
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
              code: 401
            });
          }
          else {
            var token = auth.issueTokenWithUid(user);
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
              },
              access_token: token
            });
          }
        });
      }
    });
  }
  catch (e) {
    res.status(403).send({message: e.message});
  }
}

export function updateProfileField(req:express.Request, res:express.Response, next:any) {
  try {
    //var newUserData: UserModel = <UserModel>req.body;

    var params = req.query;
    delete params.access_token;
    var user = req.user;
    var _id:string = user._id;
    var fName:string = req.params.fname;
    if (fName == 'guide_tour') {
      var data = {'guide_tour': req.body};
    }
    var auth:AuthInterceptor = new AuthInterceptor();
    var userService = new UserService();
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
              code: 401
            });
          }
          else {
            var token = auth.issueTokenWithUid(user);
            res.send({
              "status": "success",
              "data": {
                "first_name": result[0].first_name,
                "last_name": result[0].last_name,
                "email": result[0].email,
                "_id": result[0].userId,
                "guide_tour": result[0].guide_tour
              },
              access_token: token
            });
          }
        });
      }
    });
  }
  catch (e) {
    res.status(403).send({message: e.message});
  }
}

export function retrieve(req: express.Request, res: express.Response, next: any) {
  try {
    var userService = new UserService();
    var params = req.query;
    delete params.access_token;
    var user = req.user;
    var auth: AuthInterceptor = new AuthInterceptor();

    userService.retrieve(params, (error, result) => {
      if (error) {
        next({
          reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
          message: Messages.MSG_ERROR_WRONG_TOKEN,
          code: 401
        });

      }
      else {
        var token = auth.issueTokenWithUid(user);
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

      }
    });
  }
  catch (e) {
    res.status(403).send({message: e.message});
  }
}
export function resetPassword(req: express.Request, res: express.Response, next: any) {
  try {
    var user = req.user;
    var params = req.body;   //new_password
    delete params.access_token;
    var userService = new UserService();
    const saltRounds = 10;
    bcrypt.hash(req.body.new_password, saltRounds, (err:any, hash:any) =>{
      if(err) {
        res.status(403).send({message: 'Error in creating hash using bcrypt'});
      } else {
        var updateData = {'password': hash};
        var query = {"_id": user._id, "password": req.user.password };
        userService.findOneAndUpdate(query, updateData, {new: true}, (error, result) => {
          if (error) {
            next(error);
          }else {
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
    res.status(403).send({message: e.message});
  }
}

export function changePassword(req: express.Request, res: express.Response, next: any) {
  try {
    var user = req.user;
    var params = req.query;
    delete params.access_token;
    var auth: AuthInterceptor = new AuthInterceptor();
    var userService = new UserService();
    bcrypt.compare(req.body.current_password,user.password , (err : any, isSame : any)=> {
      if(err) {
        next({
          reason: Messages.MSG_ERROR_RSN_INVALID_REGISTRATION_STATUS,
          message: Messages.MSG_ERROR_VERIFY_CANDIDATE_ACCOUNT,
          code: 403
        });
      }else {
        if(isSame) {

          var new_password:any;
          const saltRounds = 10;
          bcrypt.hash(req.body.new_password, saltRounds, (err:any, hash:any) => {
            // Store hash in your password DB.
            if(err) {
              console.log('Error in creating hash using bcrypt');
          }
          else {
              new_password = hash;
          var query = {"_id": req.user._id};
          var updateData = {"password": new_password};
          userService.findOneAndUpdate(query, updateData, {new: true}, (error, result) => {
            if (error) {
              next(error);
            }
            else {
              var token = auth.issueTokenWithUid(user);
              res.send({
                "status": "Success",
                "data": {"message": "Password changed successfully"},
                access_token: token
              });
            }
          });
            }
        });
        } else {
          next({
            reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
            message: Messages.MSG_ERROR_WRONG_CURRENT_PASSWORD,
            code: 401
          });
        }
      }});
  }
  catch (e) {
    res.status(403).send({message: e.message});
  }
}

export function changeMobileNumber(req: express.Request, res: express.Response, next: any) {

  try {
    var user = req.user;

    var params = req.body;
    var auth: AuthInterceptor = new AuthInterceptor();
    var userService = new UserService();

    var query = {"mobile_number": params.new_mobile_number, "isActivated": true};

    userService.retrieve(query, (error, result) => {
      if (error) {
        next(error);
      }
      else if (result.length > 0) {
        next({
          reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
          message: Messages.MSG_ERROR_REGISTRATION_MOBILE_NUMBER,
          code: 403
        });

      }
      else {
        var Data = {
          current_mobile_number: user.mobile_number,
          _id: user._id,
          new_mobile_number: params.new_mobile_number
        };
        userService.changeMobileNumber(Data, (error, result) => {
          if (error) {
            next({
              reason: Messages.MSG_ERROR_RSN_WHILE_CONTACTING,
              message: Messages.MSG_ERROR_WHILE_CONTACTING,
              code: 403
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
  }

  catch (e) {
    res.status(403).send({message: e.message});
  }
}


export function changeEmailId(req: express.Request, res: express.Response, next: any) {

  try {
    var user = req.user;
    var params = req.query;
    delete params.access_token;
    var auth: AuthInterceptor = new AuthInterceptor();
    var userService = new UserService();


    var query = {"email": req.body.new_email};

    userService.retrieve(query, (error, result) => {

      if (error) {
        next(error);
      }
      else if (result.length > 0 && result[0].isActivated === true) {
        next({
          reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
          message: Messages.MSG_ERROR_REGISTRATION,
          code: 403
        });

      }
      else if (result.length > 0 && result[0].isActivated === false) {
        next({
          reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
          message: Messages.MSG_ERROR_ACCOUNT_STATUS,
          code: 403
        });

      }

      else {

        var emailId = {
          current_email: req.body.current_email,
          new_email: req.body.new_email
        };

        userService.SendChangeMailVerification(emailId, (error, result) => {
          if (error) {
            if (error === Messages.MSG_ERROR_CHECK_EMAIL_ACCOUNT) {
              next({
                reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
                message: Messages.MSG_ERROR_EMAIL_ACTIVE_NOW,
                code: 403
              });
            }
            else {
              next({
                reason: Messages.MSG_ERROR_RSN_WHILE_CONTACTING,
                message: Messages.MSG_ERROR_WHILE_CONTACTING,
                code: 403
              });

            }
          }
          else {
            console.log("email change success");
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
    res.status(403).send({message: e.message});
  }
}

export function verifyMobileNumber(req: express.Request, res: express.Response, next: any) {
  try {

    let user = req.user;

    var params = req.body; //otp
    var userService = new UserService();
    var query = {"_id": user._id};
    var updateData = {"mobile_number": user.temp_mobile, "temp_mobile": user.mobile_number};
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
        code: 403
      });
    }

  }
  catch (e) {
    res.status(403).send({message: e.message});
  }
}

export function verifyOtp(req: express.Request, res: express.Response, next: any) {
  try {

    let user = req.user;

    var params = req.body; //OTP
    //  delete params.access_token;
    var userService = new UserService();
    var query = {"_id": user._id, "isActivated": false};
    var updateData = {"isActivated": true};
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
        code: 403
      });
    }

  }
  catch (e) {
    res.status(403).send({message: e.message});
  }
}


export function verifyAccount(req: express.Request, res: express.Response, next: any) {
  try {

    let user = req.user;
    var params = req.query;
    delete params.access_token;
    var userService = new UserService();

    var query = {"_id": user._id, "isActivated": false};
    var updateData = {"isActivated": true};
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
    res.status(403).send({message: e.message});
  }
}

export function verifyChangedEmailId(req: express.Request, res: express.Response, next: any) {
  try {
    console.log("Changemailverification hit");
    var user = req.user;
    var params = req.query;
    delete params.access_token;
    var userService = new UserService();

    var query = {"_id": user._id};
    var updateData = {"email": user.temp_email, "temp_email": user.email};
    userService.findOneAndUpdate(query, updateData, {new: true}, (error, result) => {
      if (error) {
        console.log("Changemailverification hit error", error);
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
    res.status(403).send({message: e.message});
  }
}

export function getIndustry(req: express.Request, res: express.Response) {
  __dirname = './';
  var filepath = "industry.json";
  try {
    res.sendFile(filepath, {root: __dirname});
  }
  catch (e) {
    res.status(403).send({message: e.message});
  }
}

export function getCompanySize(req: express.Request, res: express.Response) {
  __dirname = './';
  var filepath = "company-size.json";
  try {
    res.sendFile(filepath, {root: __dirname});
  }
  catch (e) {
    res.status(403).send({message: e.message});
  }
}

export function getAddress(req: express.Request, res: express.Response) {
  __dirname = './';
  var filepath = "address.json";
  try {
    res.sendFile(filepath, {root: __dirname});
  }
  catch (e) {
    res.status(403).send({message: e.message});
  }
}
export function getRealocation(req: express.Request, res: express.Response) {

  __dirname = './';
  var filepath = "realocation.json";
  try {
    res.sendFile(filepath, {root: __dirname});
  }
  catch (e) {
    res.status(403).send({message: e.message});
  }
}
export function getEducation(req: express.Request, res: express.Response) {
  __dirname = './';
  var filepath = "education.json";
  try {
    res.sendFile(filepath, {root: __dirname});
  }
  catch (e) {
    res.status(403).send({message: e.message});
  }
}

export function getExperience(req: express.Request, res: express.Response) {
  __dirname = './';
  var filepath = "experienceList.json";
  try {
    res.sendFile(filepath, {root: __dirname});
  }
  catch (e) {
    res.status(403).send({message: e.message});
  }
}
export function getCurrentSalary(req: express.Request, res: express.Response) {
  __dirname = './';
  var filepath = "currentsalaryList.json";
  try {
    res.sendFile(filepath, {root: __dirname});
  }
  catch (e) {
    res.status(403).send({message: e.message});
  }
}

export function getNoticePeriod(req: express.Request, res: express.Response) {
  __dirname = './';
  var filepath = "noticeperiodList.json";
  try {
    res.sendFile(filepath, {root: __dirname});
  }
  catch (e) {
    res.status(403).send({message: e.message});
  }
}

export function getIndustryExposure(req: express.Request, res: express.Response) {
  __dirname = './';
  var filepath = "industryexposureList.json";
  try {
    res.sendFile(filepath, {root: __dirname});
  }
  catch (e) {
    res.status(403).send({message: e.message});
  }
}

export function getSearchedCandidate(req: express.Request, res: express.Response) {
  __dirname = './';
  var filepath = "candidate.json";
  try {
    res.sendFile(filepath, {root: __dirname});
  }
  catch (e) {
    res.status(403).send({message: e.message});
  }

}


export function getCountries(req: express.Request, res: express.Response) {
  __dirname = './';
  var filepath = "country.json";
  try {
    res.sendFile(filepath, {root: __dirname});
  }
  catch (e) {
    res.status(403).send({message: e.message});
  }
}
export function getIndiaStates(req: express.Request, res: express.Response) {
  __dirname = './';
  var filepath = "indiaStates.json";
  try {
    res.sendFile(filepath, {root: __dirname});
  }
  catch (e) {
    res.status(403).send({message: e.message});
  }
}




export function getFunction(req: express.Request, res: express.Response) {
  __dirname = './';
  var filepath = "function.json";
  try {
    res.sendFile(filepath, {root: __dirname});
  }
  catch (e) {
    res.status(403).send({message: e.message});
  }
}
export function getRole(req: express.Request, res: express.Response) {
  __dirname = './';
  var filepath = "roles.json";
  try {
    res.sendFile(filepath, {root: __dirname});
  }
  catch (e) {
    res.status(403).send({message: e.message});
  }
}
export function getProficiency(req: express.Request, res: express.Response) {
  __dirname = './';
  var filepath = "proficiency.json";
  try {
    res.sendFile(filepath, {root: __dirname});
  }
  catch (e) {
    res.status(403).send({message: e.message});
  }
}

export function getDomain(req: express.Request, res: express.Response) {
  __dirname = './';
  var filepath = "domain.json";
  try {
    res.sendFile(filepath, {root: __dirname});
  }
  catch (e) {
    res.status(403).send({message: e.message});
  }
}


export function getCapability(req: express.Request, res: express.Response) {
  __dirname = './';
  var filepath = "capability.json";
  try {
    res.sendFile(filepath, {root: __dirname});
  }
  catch (e) {
    res.status(403).send({message: e.message});
  }
}

export function getComplexity(req: express.Request, res: express.Response) {
  __dirname = './';
  var filepath = "complexity.json";
  try {
    res.sendFile(filepath, {root: __dirname});
  }
  catch (e) {
    res.status(403).send({message: e.message});
  }
}

export function fblogin(req: express.Request, res: express.Response, next: any) {
  try {
    var userService = new UserService();
    var params = req.user;
    var auth = new AuthInterceptor();
    userService.retrieve(params, (error, result) => {
      if (error) {
        next(error);
      }
      else if (result.length > 0) {
        var token = auth.issueTokenWithUid(result[0]);
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
          code: 403
        });
      }
    });
  }
  catch (e) {
    res.status(403).send({message: e.message});

  }
}
export function googlelogin(req: express.Request, res: express.Response, next: any) {
  try {
    var userService = new UserService();
    var params = req.user;
    console.log("params in google login", params);
    var auth = new AuthInterceptor();
    userService.retrieve(params, (error, result) => {
      if (error) {
        next(error);
      }
      else if (result.length > 0) {
        console.log("result sent to frnt aftr g+login");
        var token = auth.issueTokenWithUid(result[0]);
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
          code: 403
        });
      }
    });
  }
  catch (e) {
    res.status(403).send({message: e.message});

  }
}
/*export function getGoogleToken(req : express.Request, res: express.Response, next: any) {
 var token = JSON.stringify(req.body.token);

 var url = 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token='+token;
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
  __dirname = 'src/server/app/framework/public/profileimage';
  var form = new multiparty.Form({uploadDir: __dirname});
  form.parse(req, (err: Error, fields: any, files: any) => {
    if (err) {
      next({
        reason: Messages.MSG_ERROR_RSN_DIRECTORY_NOT_FOUND,
        message: Messages.MSG_ERROR_DIRECTORY_NOT_FOUND,
        code: 401
      });
    } else {
      var path = JSON.stringify(files.file[0].path);
      var image_path = files.file[0].path;
      var originalFilename = JSON.stringify(image_path.substr(files.file[0].path.lastIndexOf('/') + 1));
      var userService = new UserService();

      userService.UploadImage(path, originalFilename, function (err: any, tempath: any) {
        if (err) {
          next(err);
        }
        else {
          var mypath = tempath;

          try {
            var user = req.user;
            var query = {"_id": user._id};

            userService.findById(user._id, (error, result) => {
              if (error) {
                res.status(403).send({message: error});
              }
              else {
                if (!result.isCandidate) {
                  let recruiterService: RecruiterService = new RecruiterService();
                  let query1 = {"userId": result._id};
                  recruiterService.findOneAndUpdate(query1, {company_logo: mypath}, {new: true}, (error, response1) => {
                    if (error) {
                      res.status(403).send({message: error});
                    }
                    else {
                      console.log("-----------------------------------------------------------");
                      console.log("updated");
                      userService.findOneAndUpdate(query, {picture: mypath}, {new: true}, (error, response) => {
                        if (error) {
                          res.status(403).send({message: error});
                        }
                        else {
                          var auth: AuthInterceptor = new AuthInterceptor();
                          var token = auth.issueTokenWithUid(response);
                          res.status(200).send({access_token: token, data: response});
                        }
                      });

                    }
                  });

                } else {
                  userService.findOneAndUpdate(query, {picture: mypath}, {new: true}, (error, response) => {
                    if (error) {
                      res.status(403).send({message: error});
                    }
                    else {
                      var auth: AuthInterceptor = new AuthInterceptor();
                      var token = auth.issueTokenWithUid(response);
                      res.status(200).send({access_token: token, data: response});
                    }
                  });
                }


              }
            });
          }
          catch (e) {
            res.status(403).send({message: e.message});
          }
        }
      });
    }

  });
}


export function updateCompanyDetails(req: express.Request, res: express.Response, next: any): void {

  console.log("UpdatePicture user Controller is been hit req ");
  var userService = new UserService();
  var user = req.user;
  var query = {"_id": user._id};
  /*userService.findOneAndUpdate(query, {picture: mypath}, {new: true}, (error, result) => {
   if (error) {
   res.status(403).send({message: error});
   }
   else{
   var auth:AuthInterceptor = new AuthInterceptor();
   var token = auth.issueTokenWithUid(result);
   res.status(200).send({access_token: token, data: result});
   }
   });*/
}

export function uploaddocuments(req: express.Request, res: express.Response, next: any): void {
  __dirname = 'src/server/app/framework/public/uploaded-document';

  var form = new multiparty.Form({uploadDir: __dirname});
  console.log("updatedocuments user Controller is been hit req ", req);
  form.parse(req, (err: Error, fields: any, files: any) => {
    if (err) {
      next({
        reason: Messages.MSG_ERROR_RSN_DIRECTORY_NOT_FOUND,
        message: Messages.MSG_ERROR_DIRECTORY_NOT_FOUND,
        code: 401
      });
    } else {
      console.log("fields of doc upload:" + fields);
      console.log("files of doc upload:" + files);

      var path = JSON.stringify(files.file[0].path);
      console.log("Path url of doc upload:" + path);
      var document_path = files.file[0].path;
      console.log("Document path of doc upload:" + document_path);
      var originalFilename = JSON.stringify(document_path.substr(files.file[0].path.lastIndexOf('/') + 1));
      console.log("Original FileName of doc upload:" + originalFilename);

      res.status(200).send({
        "status": Messages.STATUS_SUCCESS,
        "data": {
          "document": document_path
        }
      });

      /*   var userService = new UserService();
       userService.UploadDocuments(path, originalFilename, function (err:any, tempath:any) {
       if (err) {
       console.log("Err message of uploaddocument is:",err);
       next(err);
       }
       else {
       var mypath = tempath;
       try {
       var user = req.user;
       var query = {"_id": user._id};
       userService.findOneAndUpdate(query, {document1: mypath}, {new: true}, (error, result) => {
       if (error) {
       res.status(403).send({message: error});
       }
       else{
       var auth:AuthInterceptor = new AuthInterceptor();
       var token = auth.issueTokenWithUid(result);
       res.status(200).send({access_token: token, data: result});
       }
       });
       }
       catch (e) {
       res.status(403).send({message: e.message});
       }
       }
       });*/
    }

  });


}

export function profilecreate(req: express.Request, res: express.Response) {
  try {

    console.log("In profile create");
  }
  catch (e) {
    res.status(403).send({message: e.message});
  }
}


export function professionaldata(req: express.Request, res: express.Response) {
  try {

    var newUser = req.body;
    console.log("newUser", JSON.stringify(newUser));

  }
  catch (e) {
    res.status(403).send({"status": Messages.STATUS_ERROR, "error_message": e.message});
  }

}

export function employmentdata(req: express.Request, res: express.Response) {
  try {

    var newUser = req.body;
    console.log("newUser", JSON.stringify(newUser));

  }
  catch (e) {
    res.status(403).send({"status": Messages.STATUS_ERROR, "error_message": e.message});
  }

}


export function changeTheme(req: express.Request, res: express.Response, next: any): void {
  try {
    var user = req.user;
    var params = req.query;
    delete params.access_token;
    var auth: AuthInterceptor = new AuthInterceptor();
    var userService = new UserService();
    var query = {"_id": req.user.id};
    var updateData = {"current_theme": req.body.current_theme};
    userService.findOneAndUpdate(query, updateData, {new: true}, (error, result) => {
      if (error) {
        next(error);
      }
      else {
        var token = auth.issueTokenWithUid(user);

        res.send({
          access_token: token, data: result
        });
      }
    });
  }
  catch (e) {
    res.status(403).send({message: e.message});
  }


}
