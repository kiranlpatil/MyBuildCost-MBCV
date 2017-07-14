import IndustryRepository = require("../dataaccess/repository/import-industries.repository");
/**
 * Created by techprime002 on 7/11/2017.
 */
var config = require('config');
import CNextMessages = require("../shared/cnext-messages");
import ProjectAsset = require("../shared/projectasset");
import ImportIndustriesModel = require("../dataaccess/model/industry-class.model");
import IndustryService = require("./industry.service");
class ImportIndustryService {
  private importIndustriesRepository: IndustryRepository;
  APP_NAME: string;

  constructor() {
    this.importIndustriesRepository = new IndustryRepository();
    this.APP_NAME = ProjectAsset.APP_NAME;
  }

  create(item: any, callback: (error: any, result: any) => void) {

    let industryService : IndustryService;
    industryService = new IndustryService();
    industryService.create(item,(errinCreate: any, response: any) => {
      if (errinCreate) {
        callback(new Error(CNextMessages.PROBLEM_IN_CREATING_INDUSTRY), null);
      } else {
        if (response.length == 0) {
          console.log('response'+JSON.stringify(response));
          callback(null, response);
        } else {
          callback('Empty response', null);
          //this.importIndustriesRepository.findOneAndUpdate({'_id': response[0]._id}, item, {new: true}, callback);
        }
      }
    });
  }
}

Object.seal(ImportIndustryService);
export = ImportIndustryService;
