import * as express from "express";
import AuthInterceptor = require('../interceptor/auth.interceptor');
import Messages = require('../shared/messages');
import UserService = require('../services/user.service');
import CandidateService = require('../services/candidate.service');
import AdminService = require('../services/admin.service');
import UserModel = require('../dataaccess/model/user.model');
import ExportService = require("../services/export.service");
let config = require('config');
let request = require('request');

export function create(req: express.Request, res: express.Response, next: any) {
  try {
    let newUser: UserModel = <UserModel>req.body;
    newUser.isAdmin = true;
    newUser.first_name = 'Admin';
    newUser.email = 'support@jobmosis.com';
    newUser.mobile_number = 8669601616;
    newUser.isActivated = true;
    newUser.password = '$2a$10$5SBFt0BpQPp/15N5J38nZuh2zMSL1gbFmnEe4xRLIltlQn56bNcZq';
    let userService = new UserService();
    userService.createUser(newUser, (error, result) => {
      if (error) {
        if (error === Messages.MSG_ERROR_CHECK_EMAIL_PRESENT) {
          next({
            reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
            message: Messages.MSG_ERROR_VERIFY_ACCOUNT,
            stackTrace: new Error(),
            code: 403
          });
        } else if (error === Messages.MSG_ERROR_CHECK_MOBILE_PRESENT) {
          next({
            reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
            message: Messages.MSG_ERROR_REGISTRATION_MOBILE_NUMBER,
            stackTrace: new Error(),
            code: 403
          });
        } else {
          next({
            reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
            message: Messages.MSG_ERROR_USER_WITH_EMAIL_PRESENT,
            stackTrace: new Error(),
            code: 403
          });
        }
      } else {
        let auth: AuthInterceptor = new AuthInterceptor();
        let token = auth.issueTokenWithUid(result);
        res.status(200).send({
          'status': Messages.STATUS_SUCCESS,
          'data': {
            'reason': Messages.MSG_SUCCESS_REGISTRATION,
            'first_name': newUser.first_name,
            'email': newUser.email,
            'mobile_number': newUser.mobile_number,
            '_id': result._id,
            'picture': ''
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

export function getCountOfUsers(req: express.Request, res: express.Response, next: any) {
  try {
    let adminService = new AdminService();
    let params = {};
    if (req.user.isAdmin) {
      adminService.getCountOfUsers(params, (error, result) => {
        if (error) {
          next({
            reason: Messages.MSG_ERROR_RETRIEVING_USERS_COUNT,//Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
            message: Messages.MSG_ERROR_RETRIEVING_USERS_COUNT,
            stackTrace: new Error(),
            code: 403
          });
        } else {
          res.status(200).send({
            'status': 'success',
            'data': result
          });
        }
      });
    } else {
      next({
          reason: Messages.MSG_ERROR_UNAUTHORIZED_USER,
          message: Messages.MSG_ERROR_UNAUTHORIZED_USER,
          stackTrace: new Error(),
          code: 401
        }
      );
    }
  } catch (e) {
    next({
      reason: e.message,
      message: e.message,
      stackTrace: new Error(),
      code: 403
    });
  }
}

export function getCandidateDetailsByInitial(req: express.Request, res: express.Response, next: any) {
  try {
    let adminService = new AdminService();
    let initial = req.params.initial;

    if (req.user.isAdmin) {
      adminService.getCandidateDetails(initial, (error, result) => {
        if (error) {
          next({
            reason: Messages.MSG_ERROR_RETRIEVING_USER,//Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
            message: Messages.MSG_ERROR_RETRIEVING_USER,
            stackTrace: new Error(),
            code: 403
          });
        } else {
          res.status(200).send({
            'status': 'success',
            'data': result
          });
        }
      });
    } else {
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
      code: 403
    });
  }
}

export function getRecruiterDetailsByInitial(req: express.Request, res: express.Response, next: any) {
  try {
    let adminService = new AdminService();
    let initial = req.params.initial;

    if (req.user.isAdmin) {
      adminService.getRecruiterDetails(initial, (error, result) => {
        if (error) {
          next({
            reason: Messages.MSG_ERROR_RETRIEVING_USER,//Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
            message: Messages.MSG_ERROR_RETRIEVING_USER,
            stackTrace: new Error(),
            code: 403
          });
        } else {
          res.status(200).send({
            'status': 'success',
            'data': result
          });
        }
      });
    } else {
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
      code: 403
    });
  }
}

export function exportCandidateDetails(req: express.Request, res: express.Response, next: any) {
  try {
    let adminService = new AdminService();
    if (req.user.isAdmin) {
      adminService.exportCandidateDetails((err, result) => {
        if (err) {
          next({
            reason: Messages.MSG_ERROR_CREATING_EXCEL,
            message: Messages.MSG_ERROR_CREATING_EXCEL,
            stackTrace: err,
            code: 500
          });
        } else {
          res.status(200).send({
            'path': result,
            'status': 'success'
          });
        }
      });
    }
    else {
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

export function exportRecruiterDetails(req: express.Request, res: express.Response, next: any) {
  try {
    let adminService = new AdminService();
    if (req.user.isAdmin) {
      adminService.exportRecruiterDetails((err, result) => {
        if (err) {
          next({
            reason: Messages.MSG_ERROR_CREATING_EXCEL,
            message: Messages.MSG_ERROR_CREATING_EXCEL,
            stackTrace: err,
            code: 500
          });
        } else {
          res.status(200).send({
            'path': result,
            'status': 'success'
          });
        }
      });
    } else {
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

export function exportUsageDetails(req: express.Request, res: express.Response, next: any) {
  try {
    let exportService = new ExportService();
    if (req.user.isAdmin) {
      exportService.exportUsageTrackingCollection((error, result) => {
        if (error) {
          next({
            reason: Messages.MSG_ERROR_RETRIEVING_USAGE_DETAIL,
            message: Messages.MSG_ERROR_RETRIEVING_USAGE_DETAIL,
            stackTrace: error,
            code: 500
          });
        } else {
          res.status(200).send({
            'path': result,
            'status': 'success'
          });
        }
      });
    } else {
      next({
          reason: Messages.MSG_ERROR_UNAUTHORIZED_USER,
          message: Messages.MSG_ERROR_UNAUTHORIZED_USER,
          stackTrace: new Error(),
          code: 401
        }
      );
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

export function exportKeySkills(req: express.Request, res: express.Response, next: any) {
  try {
    let exportService = new ExportService();
    if (req.user.isAdmin) {
      exportService.exportKeySkillsCollection((error, result) => {
        if (error) {
          next({
            reason: Messages.MSG_ERROR_RETRIEVING_KEY_SKILLS,
            message: Messages.MSG_ERROR_RETRIEVING_KEY_SKILLS,
            stackTrace: error,
            code: 500
          });
        } else {
          res.status(200).send({
            'path': result,
            'status': 'success'
          });
        }
      });
    } else {
      next({
          reason: Messages.MSG_ERROR_UNAUTHORIZED_USER,
          message: Messages.MSG_ERROR_UNAUTHORIZED_USER,
          stackTrace: new Error(),
          code: 401
        }
      );
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

export function updateDetailOfUser(req: express.Request, res: express.Response, next: any) {
  try {
    let newUserData: UserModel = <UserModel>req.body;
    let params = req.query;
    delete params.access_token;
    let user = req.user;
    let _id: string = user._id;
    let auth: AuthInterceptor = new AuthInterceptor();
    let adminService = new AdminService();
    let userService = new UserService();

    adminService.updateUser(newUserData.user_id, newUserData, (error, result) => {
      if (error) {
        next(error);
      } else {
        userService.retrieve(_id, (error, resu) => {
          if (error) {
            next({
              reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
              message: Messages.MSG_ERROR_WRONG_TOKEN,
              stackTrace: new Error(),
              code: 401
            });
          } else {
            let token = auth.issueTokenWithUid(resu[0]);
            res.send({
              'status': 'success',
              'data': {
                'updateUser': result,
                'first_name': resu[0].first_name,
                'email': resu[0].email,
                'mobile_number': resu[0].mobile_number,
                '_id': resu[0].userId,
                'current_theme': resu[0].current_theme
              },
              access_token: token
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
      code: 500
    });
  }
}

export function sendLoginInfoToAdmin(email: any, ip: any, latitude: any, longitude: any, next: any) {
  try {
    let params: any = {email: undefined, ip: undefined, location: undefined};
    let address: any;
    params.ip = ip;
    params.email = email;
    let adminService = new AdminService();
    request('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&sensor=true', function (error: any, response: any, body: any) {
      if (!error || response.statusCode == 200) {
        if (response.statusCode == 200) {
          address = JSON.parse(body).results[0].formatted_address;
          params.location = address;
        }
        adminService.sendAdminLoginInfoMail(params, (error, result) => {
          if (error) {
            next(error);
          }
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
