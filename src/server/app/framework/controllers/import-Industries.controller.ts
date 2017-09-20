import * as express from 'express';
import fs = require('fs');
import Messages = require('../shared/messages');
import ImportIndustryService = require('../services/import-industries.service');
let importIndustriesService = new ImportIndustryService();
let config = require('config');

export class ImportIndustryController {

 readXlsx(req: express.Request, res: express.Response) {
  let filePath = config.get('TplSeed.filePathForMasterDataExcel');
  console.log(filePath);
  let isFileExist=fs.existsSync(filePath);
  if(!isFileExist) {
    res.status(403).send({
      error: Messages.MSG_ERROR_INCORRECT_INDUSTRY_NAME
    });
  } else {
  importIndustriesService.readXlsx(filePath, (error, result) => {
    if (error) {
      res.status(403).send({
        error : error.message
      });
    } else {
      importIndustriesService.create(result, (error, result) => {
        if (error) {
          res.send({
            error: error.message
          });
      } else {
          res.status(200).send({
            status: Messages.STATUS_SUCCESS,
            data: {
              reason: Messages.MSG_SUCCESS_INDUSTRY_DATA_INSERTION,
              result: result,
            }
          });
      }
      });
    }
  });
  }
}
}
