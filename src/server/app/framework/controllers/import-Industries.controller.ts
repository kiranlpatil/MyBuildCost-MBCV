import * as express from "express";
import fs = require('fs');
import Messages = require('../shared/messages');
import ImportIndustryService = require('../services/import-industries.service');
let importIndustriesService = new ImportIndustryService();
let config = require('config');

export class ImportIndustryController {

  readXlsx(req: express.Request, res: express.Response, next: any) {
    try {
      let filePath = config.get('TplSeed.filePathForMasterDataExcel');
      console.log(filePath);
      let isFileExist = fs.existsSync(filePath);
      if (!isFileExist) {
        next({
          reason: Messages.MSG_ERROR_INCORRECT_INDUSTRY_NAME,
          message: Messages.MSG_ERROR_INCORRECT_INDUSTRY_NAME,
          stackTrace: new Error(),
          code: 403
        });
      } else {
        importIndustriesService.readXlsx(filePath, (error, result) => {
          if (error) {
            next(error);
          } else {
            importIndustriesService.create(result, (error, result) => {
              if (error) {
                next(error);
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
    } catch (e) {
      next({
        reason: e.message,
        message: e.message,
        stackTrace: new Error(),
        code: 500
      });
    }
  }
}
