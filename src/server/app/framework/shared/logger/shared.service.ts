import LoggerService = require("./LoggerService");

var Messages = require('../messages');
var logger = require('./logger');
import UserService = require('../../services/user.service');


export function errorHandler(err: any, req: any, res: any, next: any) {
  let _loggerService: LoggerService = new LoggerService('errorHandler');
  if (err.code) {
    var errObject = {
      status: Messages.STATUS_ERROR,
      error: err
    };
    var responseObject = JSON.stringify(errObject);
    _loggerService.logError(err);
    mailToAdmin(err);
    console.log('responseObject in client errorHandler:', responseObject);
    res.status(err.code).send(responseObject);
  } else {
    var errorObject:any = {
      'status': Messages.STATUS_ERROR,
      'error': {
        'reason': 'Internal Server ',
        'message': 'Internal Server ',
        'code': 500
      }
    };
    mailToAdmin(err);
    var responseObject = JSON.stringify(errorObject);
    _loggerService.logError(err);
    res.status(500).send(responseObject);
  }
}


export function mailToAdmin(errorInfo:any) {
  var userService = new UserService();
  userService.sendMailOnError(errorInfo, (error:any, result:any) => {
    if (error) {
      logger.error( Messages.MSG_ERROR_WHILE_CONTACTING);
    }
  });

}
