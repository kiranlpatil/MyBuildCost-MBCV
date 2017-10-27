import * as express from "express";
import AuthInterceptor = require('../interceptor/auth.interceptor');
import Messages = require('../shared/messages');
import ResponseService = require('../shared/response.service');
import RoleModel = require('../dataaccess/model/role.model');
import RoleService = require('../services/role.service');
import IndustryService = require('../services/industry.service');
import CapabilityService = require('../services/capability.service');
import ComplexityService = require('../services/complexity.service');
import ScenarioService = require('../services/scenario.service');


export function retrieve(req: express.Request, res: express.Response, next: any) {  // todo find better solution
  try {
    var complexityService = new ComplexityService();
    var params = req.params.id;
    var rolesparam = req.query.roles;
    var capabilityparam = req.query.capability;
    let item: any = {
      'code': params,
      'roles': JSON.parse(rolesparam),
      'capabilities': JSON.parse(capabilityparam)
    };
    console.time('getComplexity');
    complexityService.findByName(item, (error, result) => {
      if (error) {
        next({
          reason: 'Error In Retriving',//Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
          message: Messages.MSG_ERROR_WRONG_TOKEN,
          stackTrace: new Error(),
          code: 401
        });
      } else {
        console.timeEnd('getComplexity');
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
      code: 500
    });
  }
}

