import * as express from 'express';
import * as multiparty from 'multiparty';
import { MailChimpMailerService } from '../services/mailchimp-mailer.service';
import AuthInterceptor = require('../interceptor/auth.interceptor');
import SendMailService = require('../services/mailer.service');
import UserModel = require('../dataaccess/model/UserModel');
import UserService = require('../services/UserService');
import Messages = require('../shared/messages');
import ResponseService = require('../shared/response.service');


let config = require('config');
let path = require('path');
let bcrypt = require('bcrypt');

class UserController {
  private _authInterceptor : AuthInterceptor;
  private _sendMailService : SendMailService;
  private _userService : UserService;
  private _responseService : ResponseService;

  constructor() {
    this._authInterceptor = new AuthInterceptor();
    this._sendMailService = new SendMailService();
    this._userService = new UserService();
    this._responseService = new ResponseService();
  }

  create(req: express.Request, res: express.Response, next: any): void {
    try {

      let data = req.body;
      let userService = new UserService();
      let auth: AuthInterceptor = new AuthInterceptor();
      userService.createUser(data, (error, result) => {
        if(error) {
          next({
            reason: Messages.MSG_ERROR_REGISTRATION,
            message: Messages.MSG_ERROR_REGISTRATION,
            stackTrace: new Error(),
            code: 400
          });
          /*res.status(400).send({'error':error.message,'message':error.message });*/
        } else {
          let token = auth.issueTokenWithUid(result);
          res.send({
            'data': result,
            access_token: token
          });
        }
      });
    } catch (e)  {
      console.log(e);
      res.send({'error': 'error in your request'});
    }
  }

  login(req: express.Request, res: express.Response, next: any) {
    try {
      let userService = new UserService();
      let params = req.body;
      delete params.access_token;
      userService.login(params, (error, result)=> {
        if(error) {
          next(error);
        } else {
          res.status(200).send(result);
        }
      });
    } catch (e) {
      res.send(e);
    }
  }

  sendOtp(req: express.Request, res: express.Response, next: any) {
    try {
      let userService = new UserService();
      let user = req.user;
      let params = req.body;  //mobile_number(new)
      userService.sendOtp(params, user, (error, result)=> {
        if(error) {
          res.send(error);
        } else {
          res.status(200).send(result);
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

  verifyOtp(req: express.Request, res: express.Response, next: any) {
    try {

      let user = req.user;
      let params = req.body;
      let userService = new UserService();
      userService.verifyOtp(params, user, (error, result)=> {
        if(error) {
          next(error);
        } else {
          res.send(result);
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

  forgotPassword(req: express.Request, res: express.Response, next: any) {
    try {
      let userService = new UserService();
      let params = req.body;   //email

      userService.forgotPassword(params, (error: any, result: any) => {

        if (error) {
          if (error.message === Messages.MSG_ERROR_CHECK_INACTIVE_ACCOUNT) {
            next({
              reason: Messages.MSG_ERROR_USER_NOT_ACTIVATED,
              message: Messages.MSG_ERROR_ACCOUNT_STATUS,
              stackTrace: new Error(),
              code: 400
            });
          } else if (error.message === Messages.MSG_ERROR_USER_NOT_FOUND) {
            next({
              reason: Messages.MSG_ERROR_RSN_USER_NOT_FOUND,
              message: Messages.MSG_ERROR_USER_NOT_FOUND,
              stackTrace: new Error(),
              code: 400
            });
          }
        } else {
          res.status(200).send({
            'status': Messages.STATUS_SUCCESS,
            'data': {'message': Messages.MSG_SUCCESS_EMAIL_FORGOT_PASSWORD}
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

  resetPassword(req: express.Request, res: express.Response, next: any) {
    try {
      let user = req.user;
      let params = req.body;   //new_password
      delete params.access_token;
      let userService = new UserService();
      userService.resetPassword(params, user, (err: any, result: any) => {
        if(err) {
          next(err, null);
        } else {
          res.send(result);
        }
      });
      /*bcrypt.hash(req.body.new_password, saltRounds, (err: any, hash: any) => {
        if (err) {
          next({
            reason: 'Error in creating hash using bcrypt',
            message: 'Error in creating hash using bcrypt',
            stackTrace: new Error(),
            code: 403
          });
        } else {
          let updateData = {'password': hash};
          let query = {
            '_id': user._id,
            'password': req.user.password
          };
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
      });*/

    } catch (e) {
      next({
        reason: e.message,
        message: e.message,
        stackTrace: new Error(),
        code: 403
      });
    }
  }

  updateDetails(req: express.Request, res: express.Response, next: any) {
    try {
      let newUserData: UserModel = <UserModel>req.body;
      let params = req.query;
      let user = req.user;
      delete params.access_token;

      let userService = new UserService();
      userService.updateDetails(newUserData, user, (error, result)=> {
        if(error) {
          next(error);
        } else {
          res.send(result);
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

  retrieve(req: express.Request, res: express.Response, next: any) {
    try {
      let userService = new UserService();
      let params = req.params.id;
      delete params.access_token;
      let user = req.user;
      //var userServices = new UserService();
      userService.getUserById(user, (err, result)=> {
        if(err) {
          res.send(err);
        } else {
          res.send(result);
        }
      });
    } catch (e) {
      res.send(e);
      /*next({
        reason: e.message,
        message: e.message,
        stackTrace: new Error(),
        code: 403
      });*/
    }
  }

  changeEmailId(req: express.Request, res: express.Response, next: any) {

    try {
      let user = req.user;
      let params = req.query;
      delete params.access_token;
      var data = {
        current_email: req.body.current_email,
        new_email: req.body.new_email
      };
      let userService = new UserService();

      userService.changeEmailId(data, user, (error, result) => {
        if(error) {
          next(error);
        } else {
          res.send(result);
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

  verifyChangedEmailId(req: express.Request, res: express.Response, next: any) {
    try {
      let user = req.user;
      let params = req.query;
      delete params.access_token;
      let userService = new UserService();

      userService.verifyChangedEmailId(user, (error, result)=> {
        if(error) {
          next(error);
        } else {
          res.send(result);
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

  checkForLimitationOfBuilding(req:express.Request,res:express.Response,next:any) {
    try {
      let user = req.user;
      let projectId = req.params.projectId;
      let userId =req.params.userId;
      let projectService = new UserService();
      projectService.getUserForCheckingBuilding(userId,projectId,user,(error:any,result:any) => {
        if(error) {
          next(error);
        }else {
          res.send(result);
          }
      });
    } catch (e) {
      next({
        reason:e.message,
        message:e.message,
        stackTrace: new Error()
      });
    }
  }

  changeMobileNumber(req: express.Request, res: express.Response, next: any) {

    try {
      let user = req.user;
      let params = req.body;
      let auth: AuthInterceptor = new AuthInterceptor();
      let userService = new UserService();

      let query = {'mobile_number': params.new_mobile_number, 'isActivated': true};

      userService.retrieve(query, (error, result) => {
        if (error) {
          next(error);
        } else if (result.length > 0) {
          next({
            reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
            message: Messages.MSG_ERROR_REGISTRATION_MOBILE_NUMBER,
            stackTrace: new Error(),
            code: 400
          });
        } else {
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
            } else {
              res.status(200).send({
                'status': Messages.STATUS_SUCCESS,
                'data': {
                  'message': Messages.MSG_SUCCESS_OTP_CHANGE_MOBILE_NUMBER
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

  verifyMobileNumber(req: express.Request, res: express.Response, next: any) {
    try {

      let user = req.user;
      let params = req.body;
      let userService = new UserService();
      userService.verifyMobileNumber(params, user, (error, result)=> {
        if(error) {
          next(error);
        } else {
          res.send(result);
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

  changePassword(req: express.Request, res: express.Response, next: any) {
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
                } else {
                  new_password = hash;
                  let query = {'_id': req.user._id};
                  let updateData = {'password': new_password};
                  userService.findOneAndUpdate(query, updateData, {new: true}, (error, result) => {
                    if (error) {
                      next(error);
                    } else {
                      let token = auth.issueTokenWithUid(user);
                      res.send({
                        'status': 'Success',
                        'data': {'message': Messages.MSG_SUCCESS_PASSWORD_CHANGE},
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
    } catch (e) {
      next({
        reason: e.message,
        message: e.message,
        stackTrace: new Error(),
        code: 403
      });
    }
  }

  sendMail(req: express.Request, res: express.Response, next: any) {
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
        } else {
          res.status(200).send({
            'status': Messages.STATUS_SUCCESS,
            'data': {'message': Messages.MSG_SUCCESS_SUBMITTED}
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

  updatePicture(req: express.Request, res: express.Response, next: any): void {
    __dirname = path.resolve() + config.get('application.profilePath');
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
        path = config.get('application.profilePathForClient') + originalFilename.replace(/"/g, '');

        userService.UploadImage(path, originalFilename, function (err: any, tempath: any) {
          if (err) {
            next(err);
          } else {
            let mypath = tempath;
            try {
              let user = req.user;
              let query = {'_id': user._id};

              userService.findById(user._id, (error, result) => {
                if (error) {
                  next(error);
                } else {
                  userService.findOneAndUpdate(query, {picture: mypath}, {new: true}, (error, response) => {
                    if (error) {
                      next(error);
                    } else {
                      let auth: AuthInterceptor = new AuthInterceptor();
                      let token = auth.issueTokenWithUid(result);
                      res.status(200).send({access_token: token, data: response});
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
        });
      }

    });
  }

  getProjects(req: express.Request, res: express.Response, next: any): void{
    try {
      let user = req.user;
      let userService  = new UserService();
      userService.getProjects(user, (error, result)=>{
        if(error) {
          next(error);
        } else {
          res.send(result);
        }
      });
    } catch(e) {
      next({
        reason: e.message,
        message: e.message,
        stackTrace: new Error(),
        code: 403
      });
    }
  }

  getProjectSubscription(req: express.Request, res: express.Response, next: any): void {
    try {
      let user = req.user;
      let projectId =  req.params.projectId;
      let userService  = new UserService();
      userService.getProjectSubscription(user, projectId,(error, result)=> {
        if(error) {
          next(error);
        } else {
          res.send(result);
        }
      });
    } catch(e) {
      next({
        reason: e.message,
        message: e.message,
        stackTrace: new Error(),
        code: 403
      });
    }
  }

  updateSubscription(req: express.Request, res: express.Response, next: any): void {
    try {
      let user = req.user;
      let projectId = req.params.projectId;
      let packageName = req.body.packageName;
      let costForBuildingPurchased =req.body.totalBilled;
      let numberOfBuildingsPurchased = req.body.numOfPurchasedBuildings;

      let userService = new UserService();
      userService.updateSubscription(user,projectId, packageName,costForBuildingPurchased,numberOfBuildingsPurchased,(error, result)=> {
        if(error) {
          next(error);
        }else {
          res.send(result);
        }
      });
    }catch(e) {
      next({
        reason: e.message,
        message: e.message,
        stackTrace: new  Error(),
        code: 403
      });
    }
  }
  assignPremiumPackage(req: express.Request, res: express.Response, next: any): void {
    try {
      let user = req.user;
      let userId =req.params.userId;
      let cost =req.body.totalBilled;
      let userService = new UserService();
      userService.assignPremiumPackage(user,userId,cost,(error, result)=> {
        if(error) {
          next(error);
        }else {
          res.send(result);
        }
      });
    }catch(e) {
      next({
        reason: e.message,
        message: e.message,
        stackTrace: new  Error(),
        code: 403
      });
    }
  }

/*
  assignUserSubscriptionPackage(req: express.Request, res: express.Response, next: any): void {
    try {
      let user = req.user;
      let projectId =  req.params.projectId;
      let userService  = new UserService();
      userService.getProjectSubscription(user, projectId,(error, result)=> {
        if(error) {
          next(error);
        } else {
          res.send(result);
        }
      });
    } catch(e) {
      next({
        reason: e.message,
        message: e.message,
        stackTrace: new Error(),
        code: 403
      });
    }
  }
*/


  getAdvertisingBanner(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      __dirname = './';
      let filepath = 'banners.json';
      res.sendFile(filepath, {root: __dirname});
    } catch (e) {
      next({
        reason: e.message,
        message: e.message,
        stackTrace: e,
        code: 403
      });
    }
  }

  sendProjectExpiryMails(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      let userService  = new UserService();
      userService.sendProjectExpiryWarningMails((error, result)=> {
        if(error) {
          next(error);
        } else {
          res.send(result);
        }
    });
    } catch (e) {
      next({
        reason: e.message,
        message: e.message,
        stackTrace: e,
        code: 403
      });
    }
  }

}
export  = UserController;
