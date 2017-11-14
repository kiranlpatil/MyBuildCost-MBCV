let config = require('config');
import CNextMessages = require('../shared/cnext-messages');
import ProjectAsset = require('../shared/projectasset');
import EmployeeHistoryRepository = require('../dataaccess/repository/employee-history.repository');
import ProfessionalDetailsRepository = require('../dataaccess/repository/professional-details.repository');
import AcademicsRepository = require('../dataaccess/repository/academics.repository');
class AcademicService {
  APP_NAME: string;
  private academicsRepository: AcademicsRepository;
  constructor() {
    this.academicsRepository = new AcademicsRepository();
    this.APP_NAME = ProjectAsset.APP_NAME;
  }

  retrieve(field: any, callback: (error: any, result: any) => void) {
    this.academicsRepository.retrieveAll({}, callback);
  }

  create(item: any, callback: (error: any, result: any) => void) {
    this.academicsRepository.create(item, (err, res) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, res);
      }
    });
  }

  retrieveByMultiIds(item: any, callback: (error: any, result: any) => void) {
    this.academicsRepository.retrieveByMultiIds(item, {}, callback);
  }

}

Object.seal(AcademicService);
export = AcademicService;
