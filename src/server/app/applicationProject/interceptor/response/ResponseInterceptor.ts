import CostControllException = require('../../exception/CostControllException');
import { Singleton } from 'typescript-ioc';
import log4js = require('log4js');
import * as express from 'express';
let logger = log4js.getLogger('ResponseInterceptor');

@Singleton
class ResponseInterceptor {
  exit(response: any, req: express.Request, res: express.Response, next: any) {
    if(response instanceof CostControllException) {
      let error = response.errorDetails();
      let data = {
        message : error.message,
        cause : error.cause
      };
      logger.error('Response to URL => '+ req.baseUrl);
      logger.error('Data => '+ JSON.stringify(data));
      if(!error.status) {
        res.status(500).send(data);
      } else {
        res.status(error.status).send(data);
      }
    }else if( response instanceof Error) {
      let data = {
        message : response.message,
        cause : response.stack
      };
      logger.error('Response to URL => '+ req.baseUrl);
      logger.error('Data => '+ JSON.stringify(data));
      res.status(500).send(data);
    }else {
      logger.info('Response to URL => '+ req.baseUrl);
      if(response && response.code && response.code === 401) {
        let data = {
          message: response.message,
          cause: response.stack
        };
        res.status(response.code ).send(response.data);
      }
      res.status(response.status).send(response.data);
    }
  }
}
export = ResponseInterceptor;
