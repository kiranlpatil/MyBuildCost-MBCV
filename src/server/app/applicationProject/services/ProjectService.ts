import ProjectRepository = require('../dataaccess/repository/ProjectRepository');
import BuildingRepository = require('../dataaccess/repository/BuildingRepository');
import Messages = require('../shared/messages');
import ProjectAsset = require('../../framework/shared/projectasset');
import User = require('../../framework/dataaccess/mongoose/user');
import Project = require('../dataaccess/mongoose/Project');
import AuthInterceptor = require('../../framework/interceptor/auth.interceptor');
import {isNullOrUndefined} from "util";
class ProjectService {
  APP_NAME: string;
  company_name: string;
  private projectRepository: ProjectRepository;
  private buildingRepository: BuildingRepository;
  private authInterceptor: AuthInterceptor;

  constructor() {
    this.projectRepository = new ProjectRepository();
    this.buildingRepository = new BuildingRepository();
    this.APP_NAME = ProjectAsset.APP_NAME;
    this.authInterceptor = new AuthInterceptor();
  }

  create(data: any, callback: (error: any, result: any) => void) {
    //console.log('data : '+JSON.stringify(data));
    const promise = new Promise((resolve, reject) => {
      if(data) {
        if((data.building !== null) && (data.building !== undefined)) {
          this.buildingRepository.insertMany(data.building, (err, result) => {
            if(err) {
              reject(err);
            } else {
              let buildingIds = [];
              for(var i = 0; i < result.length; i++) {
                buildingIds.push(result[i]._id);
              }
              data.building = buildingIds;
              resolve(data);
            }
          });
        } else {
          data.building = [];
          resolve(data);
        }
      }
    });
    promise.then((res) => {
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

  getProject(projectId: any, user: User, callback: (error: any, result: any) => void) {
    let query = { _id: projectId};
    let populate = {path : 'building'};
    this.projectRepository.findAndPopulate(query, populate, (error, result) =>{
      if(error) {
        callback(error, null);
      } else {
        callback(null,{ data: result, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  updateProjectDetails( projectDetails: Project, user: User, callback:(error: any, result:any) => void) {
    let query = { _id : projectDetails._id };
    delete projectDetails._id;

    this.projectRepository.findOneAndUpdate(query, projectDetails, {new: true}, (error, result) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, {data: result, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  addBuilding(projectId, buildingDetail, user, callback:(error: any, result: any)=> void) {
    this.buildingRepository.create(buildingDetail, (error, result)=> {
      if(error) {
        callback(error, null);
      } else {
        let query = {_id: projectId};
        let newData = { $push: {building : result._id}};
        this.projectRepository.findOneAndUpdate(query, newData, {new : true}, (error, status)=>{
          if(error) {
            callback(error, null);
          } else {
            callback(null, {data: result, access_token: this.authInterceptor.issueTokenWithUid(user)});
          }
        });
      }
    });
  }

  updateBuilding(projectId, buildingDetail, user, callback:(error: any, result: any)=> void) {
    let query = {_id : buildingDetail._id};
    delete buildingDetail._id;
    this.buildingRepository.findOneAndUpdate(query, buildingDetail,{new: true}, (error, result) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, {data: result, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  getBuilding(projectId, buildingId, user, callback:(error: any, result: any)=> void) {
    this.buildingRepository.findById(buildingId, (error, result) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, {data: result, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  deleteBuilding(projectId, buildingId, user, callback:(error: any, result: any)=> void) {
    let popBuildingId = buildingId;
    this.buildingRepository.delete(buildingId, (error, result)=>{
      if(error) {
        callback(error, null);
      } else {
        let query = {_id: projectId};
        let newData = { $pop: {building : popBuildingId}};
        this.projectRepository.findOneAndUpdate(query, newData, {}, (error, status)=>{
          if(error) {
            callback(error, null);
          } else {
            callback(null, {data: status, access_token: this.authInterceptor.issueTokenWithUid(user)});
          }
        });
      }
    });
  }
}

Object.seal(ProjectService);
export = ProjectService;
