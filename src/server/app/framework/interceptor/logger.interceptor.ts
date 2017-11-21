import LoggerService = require('../shared/logger/LoggerService');
let logger = require('../shared/logger/logger');

export function logDetail(req: any, res: any, next: any) {
  let _loggerService: LoggerService = new LoggerService("API ENTRY");//TODO remove password from parm
  let tempBody = Object.assign({}, req.body);
  if(tempBody && tempBody.password) {
    tempBody.password='XXX';
   }
   if(tempBody && tempBody.new_password) {
     tempBody.new_password='XXX';
   }
   if(tempBody && tempBody.confirm_password) {
     tempBody.confirm_password='XXX';
   }
    let loggerObject = {
      'method': req.originalMethod,
      'url':req.originalUrl,
      'body':tempBody,
      'params':req.params,
      'query':req.query,
      'inTime':new Date()
    };
    let responseObject = JSON.stringify(loggerObject);
  _loggerService.logInfo(responseObject);
  next();
}


