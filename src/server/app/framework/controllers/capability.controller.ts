import * as express from "express";
import AuthInterceptor = require('../interceptor/auth.interceptor');
import Messages = require('../shared/messages');
import ResponseService = require('../shared/response.service');
import RoleModel = require('../dataaccess/model/role.model');
import RoleService = require('../services/role.service');
import IndustryService = require('../services/industry.service');
import CapabilityService = require('../services/capability.service');


export function retrieve(req: express.Request, res: express.Response, next: any) {
  try {
    let capabilityService = new CapabilityService();
    let rolesparam = req.query.roles;
    let item: any = {
      code: req.params.id,
      roles: JSON.parse(rolesparam)
    };
    console.time('getCapability');
    capabilityService.findByName(item, (error, result) => {
      if (error) {
        next({
          reason: 'Error In Retriving',//Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
          message: Messages.MSG_ERROR_WRONG_TOKEN,
          stackTrace: new Error(),
          code: 401
        });
      }
      else {
        console.timeEnd('getCapability');
        res.send({
          'status': 'success',
          'data': result
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

