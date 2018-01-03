import ProjectRepository = require('../dataaccess/repository/ProjectRepository');
import BuildingRepository = require('../dataaccess/repository/BuildingRepository');
import Messages = require('../shared/messages');
import UserService = require('./../../framework/services/UserService');
import ProjectAsset = require('../../framework/shared/projectasset');
import User = require('../../framework/dataaccess/mongoose/user');
import Project = require('../dataaccess/mongoose/Project');
import AuthInterceptor = require('../../framework/interceptor/auth.interceptor');

class ProjectService {
  APP_NAME: string;
  company_name: string;
  private projectRepository: ProjectRepository;
  private buildingRepository: BuildingRepository;
  private authInterceptor: AuthInterceptor;
  private userService : UserService;

  constructor() {
    this.projectRepository = new ProjectRepository();
    this.buildingRepository = new BuildingRepository();
    this.APP_NAME = ProjectAsset.APP_NAME;
    this.authInterceptor = new AuthInterceptor();
    this.userService = new UserService();
  }

  create(data: any, callback: (error: any, result: any) => void) {
    let userId = data.userId;
    let userService = new UserService();

    this.projectRepository.create(data, (err, res) => {
      if (err) {
        callback(err, null);
      } else {
        let projectId = res._id;
        let newData =  {$push: { project: projectId }};
        this.userService.findOneAndUpdate(userId, newData, {new :true},(err, resp) => {
          if(err) {
            callback(err, null);
          } else {
            callback(null, res);
          }
        });
      }
    });
  }

  getProject( projectId : any, user: User, callback: (error: any, result: any) => void) {
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
        let query = {_id : projectId };
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
