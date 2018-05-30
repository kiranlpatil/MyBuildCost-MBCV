import log4js = require('log4js');
let logger = log4js.getLogger('RequestInterceptor');
import { Singleton, Inject, AutoWired } from 'typescript-ioc';
import * as express from 'express';

@Singleton
class RequestInterceptor {
  constructor() {
  }
  intercept(req:express.Request, res: express.Response, next: any) {
   logger.info('URL => ' +req.baseUrl);
   logger.info('Body => ' + JSON.stringify(req.body));
   logger.info('Params => ' + JSON.stringify(req.params));
   next();
  }
}
export = RequestInterceptor;
