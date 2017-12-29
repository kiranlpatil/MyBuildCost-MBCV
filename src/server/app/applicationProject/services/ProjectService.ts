import ProjectRepository = require('../dataaccess/repository/ProjectRepository');
import BuildingRepository = require('../dataaccess/repository/BuildingRepository');
import Messages = require('../shared/messages');
import ProjectAsset = require('../../framework/shared/projectasset');
class ProjectService {
  APP_NAME: string;
  company_name: string;
  private projectRepository: ProjectRepository;
  private buildingRepository: BuildingRepository;

  constructor() {
    this.projectRepository = new ProjectRepository();
    this.buildingRepository = new BuildingRepository();
    this.APP_NAME = ProjectAsset.APP_NAME;
  }

  create(data: any, callback: (error: any, result: any) => void) {
    //console.log('data : '+JSON.stringify(data));
    const promise = new Promise((resolve, reject) => {
      if(data) {
        if(data.building !== null) {
          this.buildingRepository.insertMany(data.building, (err, result) => {
            if(err) {
              reject(err);
            } else {
              let buildingIds = [];
              for(var i = 0; i < result.length; i++) {
                buildingIds.push(result[i]._id);
              }
              data.building = buildingIds;
              console.log('Resolved Building IDs:'+ JSON.stringify(data));
              resolve(data);
            }
          });
        } else {
          data.building = [];
          console.log('Resolved Empty Buildings:'+ JSON.stringify(data));
          resolve(data);
        }
      }
    });
    promise.then((res) => {
      console.log('Resolved :'+ JSON.stringify(res));
      this.projectRepository.create(res, (err, res) => {
        if (err) {
          callback(err, null);
        } else {
          callback(null, res);
        }
      });
    });
    promise.catch((err) => {
      console.log('Rejected:'+ JSON.stringify(err));
      callback(err, null);
    });
  }
}

Object.seal(ProjectService);
export = ProjectService;
