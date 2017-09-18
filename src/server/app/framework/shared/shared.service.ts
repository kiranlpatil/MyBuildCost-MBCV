var Messages = require('./messages');
var logger = require('./logger/logger');
import UserService = require('../services/user.service');

export function logHandler(err: any, req: any, res: any, next: any) {
  if (err.code) {
    logger.info(err);
    console.log('***Client error = ', err);
  } else {
    console.log('***Server error = ', err);
    logger.info(err);
  }
  next(err);
};


export function errorHandler(err: any, req: any, res: any, next: any) {
  if (err.code) {
    logger.info(err);
    console.log('Error Handler');
    next(err);
  } else {
    var errObject = {
      'status': Messages.STATUS_ERROR,
      'error': {
        'reason': 'Internal Server ',
        'message': 'Internal Server ',
        'code': 500
      }
    };
    var responseObject = JSON.stringify(errObject);
    logger.info(responseObject);
    res.status(500).send(responseObject);

  }
};

export function clientHandler(err: any, req: any, res: any, next: any) {
  console.log('Client Handler');
  var errObject = {
    status: Messages.STATUS_ERROR,
    error: err
  };
  var responseObject = JSON.stringify(errObject);
  logger.info(responseObject);
  mailToAdmin(err);
  console.log('responseObject in client errorHandler:', responseObject);
  res.status(err.code).send(responseObject);
};

function mailToAdmin(errorInfo:any) {
  console.log('mail the errorrs Handler');
  var userService = new UserService();
  userService.sendMailOnError(errorInfo, (error:any, result:any) => {
    if (error) {
      logger.error( Messages.MSG_ERROR_WHILE_CONTACTING);
    }
  });

};
