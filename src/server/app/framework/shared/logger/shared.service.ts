import LoggerService = require('./LoggerService');

let Messages = require('../messages');
let logger = require('./logger');
import UserService = require('../../services/UserService');


export function errorHandler(err: any, req: any, res: any, next: any) {
  let _loggerService: LoggerService = new LoggerService('errorHandler');
  if (err.code && err.code !== 'ECONNABORTED') {
    let errObject = {
      status: Messages.STATUS_ERROR,
      error: err
    };
    let responseObject = JSON.stringify(errObject);
    _loggerService.logError(err);
    if(err.code !== 400 && err.code !==401) {
      mailToAdmin(err);
    }
    res.status(err.code).send(responseObject);
  } else if(err.code === 'ECONNABORTED') {
    let errorObject:any = {
      'status': Messages.STATUS_ERROR,
      'error': {
        'reason': 'Internal Server ',
        'message': 'Internal Server ',
        'code': 500
      }};
    err.reason='Request is aborted by user';
    mailToAdmin(err);
    let responseObject = JSON.stringify(errorObject);
    _loggerService.logError(err);
    res.status(500).send(responseObject);
  } else {
    let errorObject:any = {
      'status': Messages.STATUS_ERROR,
      'error': {
        'reason': 'Internal Server ',
        'message': 'Internal Server ',
        'code': 500
      }
    };
    mailToAdmin(err);
    let responseObject = JSON.stringify(errorObject);
    _loggerService.logError(err);
    res.status(500).send(responseObject);
  }
}


export function mailToAdmin(errorInfo:any) {
  let userService = new UserService();
  userService.sendMailOnError(errorInfo, (error:any, result:any) => {
    if (error) {
      logger.error( Messages.MSG_ERROR_WHILE_CONTACTING);
    }
  });
}
