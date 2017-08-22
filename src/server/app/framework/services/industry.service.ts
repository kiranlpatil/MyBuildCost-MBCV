var config = require('config');
import CNextMessages = require("../shared/cnext-messages");
import ProjectAsset = require("../shared/projectasset");
import IndustryRepository = require("../dataaccess/repository/industry.repository");
import IndustryModel = require("../dataaccess/model/industry.model");
class IndustryService {
  private industryRepository: IndustryRepository;
  APP_NAME: string;

  constructor() {
    this.industryRepository = new IndustryRepository();
    this.APP_NAME = ProjectAsset.APP_NAME;
  }

  retrieveAll(field: any, callback: (error: any, result: any) => void) {
    this.industryRepository.retriveIndustriesWithSortedOrder({roles: 0,proficiencies: 0}, callback);
  }

  retrieve(field: any, callback: (error: any, result: any) => void) {
    this.industryRepository.retrieve(field, callback);
  }

  findByName(field: any, callback: (error: any, result: any) => void) {
    this.industryRepository.findByName(field, callback);
  }

  pushIntoArray(name: any, value: string, callback: (error: any, result: any) => void) {
    this.industryRepository.pushElementInArray(value, callback);
  }

  create(item: any, callback: (error: any, result: any) => void) {

    this.industryRepository.findByName(item.name, (errinCreate: any, response: any) => {
      if (errinCreate) {
        callback(new Error(CNextMessages.PROBLEM_IN_CREATING_INDUSTRY), null);
      } else {
        if (response.length == 0) {
          this.industryRepository.create(item, (err, res) => {
            if (err) {
              callback(new Error(CNextMessages.PROBLEM_IN_CREATING_INDUSTRY), null);
            }
            else {
              callback(null, res);
            }
          });
        } else {
          this.industryRepository.findOneAndUpdate({'_id': response[0]._id}, item, {new: true}, callback);
        }
      }
    });
  }
  getReleventIndustryList(data: any,industryName: string, callback: (error: any, result: any) => void) {

    //let query = { roles: { $elemMatch: {"name":{$in: JSON.parse(data)}}}};
    let query = { "roles.code": {$in :JSON.parse(data)}};
    this.industryRepository.retrieve(query, (err, res) => {
      if (err) {
        callback(err, null);
      } else {
        var industries:any[] = new Array(0);
        if(res.length > 0) {
          for (let item of res) {
            if(industryName !== item.name) {
              var obj = {name: item.name};
              industries.push(obj);
            }
          }
          callback(null, industries);
        } else {
          var industries:any[] = new Array(0);
          callback(null, industries);
        }
      }
    });

  }
}

Object.seal(IndustryService);
export = IndustryService;
