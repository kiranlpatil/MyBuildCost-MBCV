import * as express from 'express';
import ProjectService = require('./../services/ProjectService');
import Project = require('../dataaccess/mongoose/Project');
import Building = require('../dataaccess/mongoose/Building');
let config = require('config');

class ProjectController {
  private _projectService : ProjectService;

  constructor() {
    this._projectService = new ProjectService();
  }

  create(req: express.Request, res: express.Response, next: any): void {
    try {

      let data = req.body;
      let projectService = new ProjectService();
      projectService.create(data, (error, result) => {
        if(error) {
          res.send({'error': error.message});
        } else {
          res.send({'success': result});
        }
      });
    } catch (e)  {
      console.log(e);
      res.send({'error': 'error in your request'});
    }
  }


  getProject(req: express.Request, res: express.Response, next: any): void {
    try {
      let projectService = new ProjectService();
      let user = req.user;
      let projectId =  req.params.id;
      projectService.getProject(projectId, user, (error, result) => {
          if(error) {
            next(error);
          } else {
            res.send(result);
          }
      });
    } catch(e) {
      console.log(e);
      res.send({'error': 'error in your request'});
    }
  }

  updateProjectDetails(req: express.Request, res: express.Response, next: any): void {
    try {
      let projectDetail = <Project>req.body;
      projectDetail['_id'] = req.params.id;
      let user = req.user;
      let projectService = new ProjectService();
      projectService.updateProjectDetails(projectDetail, user, (error, result)=> {
        if(error) {
          next(error);
        } else {
          res.send(result);
        }
      });
    } catch(e) {
      console.log(e);
      res.send({'error': 'error in your request'});
    }
  }

  addBuilding(req: express.Request, res: express.Response, next: any): void {
    try {
      let user = req.user;
      let projectId = req.params.id;
      let buildingDetails = <Building> req.body;
      let projectService = new ProjectService();
      projectService.addBuilding(projectId, buildingDetails, user, (error, result) => {
        if(error) {
          next(error);
        } else {
          res.send(result);
        }
      });
    } catch(e) {
      console.log(e);
      res.send({'error': 'error in your request'});
    }
  }

  updateBuilding(req: express.Request, res: express.Response, next: any): void{
    try {
      let user = req.user;
      let projectId = req.params.id;
      let buildingDetails = <Building> req.body;
      let projectService = new ProjectService();
      projectService.updateBuilding(projectId, buildingDetails, user, (error, result) => {
        if(error) {
          next(error);
        } else {
          res.send(result);
        }
      });
    } catch(e) {
      console.log(e);
      res.send({'error': 'error in your request'});
    }
  }

  getBuilding(req: express.Request, res: express.Response, next: any): void{
    try {
      let user = req.user;
      let projectId = req.params.id;
      let buildingId = req.params.buildingid;
      let projectService = new ProjectService();
      projectService.getBuilding(projectId, buildingId, user, (error, result) => {
        if(error) {
          next(error);
        } else {
          res.send(result);
        }
      });
    } catch(e) {
      console.log(e);
      res.send({'error': 'error in your request'});
    }
  }

  deleteBuilding(req: express.Request, res: express.Response, next: any): void{
    try {
      let user = req.user;
      let projectId = req.params.id;
      let buildingId = req.params.buildingid;
      let projectService = new ProjectService();
      projectService.deleteBuilding(projectId, buildingId, user, (error, result) => {
        if(error) {
          next(error);
        } else {
          res.send(result);
        }
      });
    } catch(e) {
      console.log(e);
      res.send({'error': 'error in your request'});
    }
  }
}
export  = ProjectController;
