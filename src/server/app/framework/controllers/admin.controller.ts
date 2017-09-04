import * as express from 'express';
import AuthInterceptor = require('../interceptor/auth.interceptor');
import Messages = require('../shared/messages');
import UserService = require('../services/user.service');
import AdminService = require('../services/admin.service');
import UserModel = require('../dataaccess/model/user.model');
var request = require('request');



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
    userService.createUser(newUser, (error, result) => {
      if (error) {
        console.log('crt user error', error);

        if (error === Messages.MSG_ERROR_CHECK_EMAIL_PRESENT) {
          next({
            reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
            message: Messages.MSG_ERROR_VERIFY_ACCOUNT,
            code: 403
          });
        } else if (error === Messages.MSG_ERROR_CHECK_MOBILE_PRESENT) {
          next({
            reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
            message: Messages.MSG_ERROR_REGISTRATION_MOBILE_NUMBER,
            code: 403
          });
        } else {
          next({
            reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
            message: Messages.MSG_ERROR_USER_WITH_EMAIL_PRESENT,
            code: 403
          });
        }
      } else {
        var auth: AuthInterceptor = new AuthInterceptor();
        console.log('result',JSON.stringify(result));
        var token = auth.issueTokenWithUid(result);
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
    res.status(403).send({'status': Messages.STATUS_ERROR, 'error_message': e.message});
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
          message: 'error in create excel',
          code: 403
        });
      } else {
        adminService.seperateUsers(result,(error, resp) => {
          if (error) {
            next({
              reason: 'Error In Retrieving',//Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
              message: 'error in create excel',
              code: 403
            });
          }else {
            adminService.createXlsx(resp, (err, respo)=> {
              if (err) {
                next({
                  reason: 'Error In Retrieving',//Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
                  message: 'error in create excel',
                  code: 403
                });
              } else {
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
  } catch (e) {
    res.status(403).send({message: e.message});
  }
}
export function updateDetailOfUser(req: express.Request, res: express.Response, next: any) {
  try {
    var newUserData: UserModel = <UserModel>req.body;
    var params = req.query;
    delete params.access_token;
    var user = req.user;
    var _id: string = user._id;
    var auth: AuthInterceptor = new AuthInterceptor();
    var adminService = new AdminService();
    var userService = new UserService();

    adminService.updateUser(newUserData.user_id, newUserData, (error, result) => {
      if (error) {
        next(error);
      } else {
        userService.retrieve(_id, (error, resu) => {
          if (error) {
            next({
              reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
              message: Messages.MSG_ERROR_WRONG_TOKEN,
              code: 401
            });
          } else {
            var token = auth.issueTokenWithUid(resu[0]);
            res.send({
              'status': 'success',
              'data': {
                'updateUser':result,
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
    res.status(403).send({message: e.message});
  }
}
export function adminLoginInfoMail(req: express.Request, res: express.Response, next: any) {
  try {
    var address:any;
    req.body.ip=req.connection.remoteAddress;
    var adminService = new AdminService();
    request('http://maps.googleapis.com/maps/api/geocode/json?latlng='+req.body.lattitude+','+req.body.longitude+'&sensor=true', function (error:any, response:any, body:any) {
      if (!error || response.statusCode == 200) {
        if(response.statusCode == 200) {
          address = JSON.parse(body).results[0].formatted_address;
          req.body.address = address;
        }
        var params = req.body;
        adminService.sendAdminLoginInfoMail(params, (error, result) => {
          if (error) {
            next({
              reason: Messages.MSG_ERROR_RSN_WHILE_CONTACTING,
              message: Messages.MSG_ERROR_WHILE_CONTACTING,
              code: 403
            });
          } else {
            res.status(200).send({
              'status': Messages.STATUS_SUCCESS,
              'data': {'message': Messages.MSG_SUCCESS_SUBMITTED}
            });
          }
        });
      }
    });
  } catch (e) {
    res.status(403).send({message: e.message});
  }
}
