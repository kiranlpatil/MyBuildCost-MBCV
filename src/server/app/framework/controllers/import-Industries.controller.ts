/**
 * Created by techprime002 on 7/11/2017.
 */
import * as express from 'express';
import fs = require('fs');
import AuthInterceptor = require('../interceptor/auth.interceptor');
import Messages = require('../shared/messages');
import ImportIndustryService = require('../services/import-industries.service');
let importIndustriesService = new ImportIndustryService();

//http://localhost:8080/api/readxlsx

export function readXlsx(req: express.Request, res: express.Response) {
  var filepath = './src/server/app/framework/public/config/NewIndustryDataExcel.xlsx';
  var isFileExist=fs.existsSync(filepath);
  if(!isFileExist) {
    res.send({
      'error': Messages.MSG_ERROR_INCORRECT_INDUSTRY_NAME
    });
  } else {
  importIndustriesService.readXlsx(filepath, (error, result) => {
    if (error) {
      console.log('crt role error', error);
      res.send({
        'error': error.message
      });
    } else {
      importIndustriesService.create(result, (error, result) => {
        if (error) {
          console.log('crt role error', error);
          res.send({
            'error': error.message
          });
      } else {
          res.status(200).send({
            'status': Messages.STATUS_SUCCESS,
            'data': {
              'reason': 'Data inserted Successfully in Industry',
              'code': 200,
              'result': result,
            }
          });
      }
      });
    }
  });
  }
}
