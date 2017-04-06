import * as fs from 'fs';
var config = require('config');
import CNextMessages = require("../shared/cnext-messages");
import ProjectAsset = require("../shared/projectasset");
import EmployeeHistoryRepository = require("../dataaccess/repository/employee-history.repository");
class EmployeeHistoryService {
  private employeeHistoryRepository : EmployeeHistoryRepository;
  APP_NAME:string;

  constructor() {
    this.employeeHistoryRepository = new EmployeeHistoryRepository();
    this.APP_NAME = ProjectAsset.APP_NAME;
  }

  retrieve(field:any, callback:(error:any, result:any) => void) {
  }

  create(item:any, callback:(error:any, result:any) => void) {
    this.employeeHistoryRepository.create(item, (err, res) => {
      if (err) {
        callback(err, null);
      }
      else {
        callback(null, res);
      }
    });
  }

  retrieveByMultiIds(item:any, callback:(error:any, result:any) => void) {
    this.employeeHistoryRepository.retrieveByMultiIds(item,{ }, callback);
  }

}

Object.seal(EmployeeHistoryService);
export = EmployeeHistoryService;
