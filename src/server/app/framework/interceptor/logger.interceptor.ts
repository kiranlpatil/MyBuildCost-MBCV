import LoggerService = require('../shared/logger/LoggerService');
let logger = require('../shared/logger/logger');

export function logDetail(req: any, res: any, next: any) {
  let _loggerService: LoggerService = new LoggerService("API ENTRY");//TODO remove password from parm
  let tempBody = Object.assign({}, req.body);
  if(tempBody && tempBody.password) {
    tempBody.password='XXX';
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


