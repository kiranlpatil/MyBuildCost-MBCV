import * as express from 'express';
import * as multiparty from 'multiparty';
//import ProjectService = require('./../services/ProjectService');
import Project = require('../dataaccess/mongoose/Project');
import Building = require('../dataaccess/mongoose/Building');
import Response = require('../interceptor/response/Response');
import CostControllException = require('../exception/CostControllException');
import CostHead = require('../dataaccess/model/project/building/CostHead');
import Rate = require('../dataaccess/model/project/building/Rate');
import WorkItem = require('../dataaccess/model/project/building/WorkItem');
import { ProjectService } from '../services/ProjectService';
let config = require('config');
let log4js = require('log4js');
let logger=log4js.getLogger('Project Controller');
let path = require('path');
var fs = require('fs');

class ProjectController {
  private _projectService : ProjectService;

  constructor() {
    this._projectService = new ProjectService();

  }

  createProject(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Project controller create has been hit');
      let data =  <Project>req.body;
      let user = req.user;

      let projectService = new ProjectService();
      projectService.createProject( data, user,(error, result) => {
        if(error) {
          next(error);
        } else {
          logger.info(' project is created ');
          next(new Response(200,result));
        }
      });
    } catch (e)  {
      logger.error(e);
      next(new CostControllException(e.message,e.stack));
    }
  }

  getProjectById(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Project controller getProject has been hit');
      let projectService = new ProjectService();
      let user = req.user;
      let projectId =  req.params.projectId;
      projectService.getProjectById(projectId, user, (error, result) => {
        if(error) {
          next(error);
        } else {
          logger.info('Getting project '+result.data[0].name);
          logger.debug('Getting project Project ID : '+projectId+', Project Name : '+result.data[0].name);
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  updateProjectById(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Project controller, updateProjectDetails has been hit');
      let projectDetails = <Project>req.body;
      projectDetails['_id'] = req.params.projectId;
      let user = req.user;
      let projectService = new ProjectService();
      projectService.updateProjectById( projectDetails, user, (error, result)=> {
        if(error) {
          next(error);
        } else {
          logger.info('Update project '+result.data.name);
          logger.debug('Updated Project Name : '+result.data.name);
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  updateProjectStatus(req:express.Request, res: express.Response, next:any){
    try {
      logger.info('Project controller Update Project status has been hit');
      let user = req.user;
      let projectId =  req.params.projectId;
      var activeStatus = req.params.activeStatus;
      let projectService = new ProjectService();
      projectService.updateProjectStatus(projectId, user,activeStatus, (error, result) => {
        if(error) {
          next(error);
        } else {
          logger.debug('Getting project Project ID : '+projectId);
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  updateProjectNameById(req:express.Request, res: express.Response, next:any){
    try {
      logger.info('Project controller Update Project Name has been hit');
      let user = req.user;
      let projectId =  req.params.projectId;
      let name = req.body.name;
      let projectService = new ProjectService();
      projectService.updateProjectNameById(projectId, name, user, (error, result) => {
        if(error) {
          next(error);
        } else {
          logger.debug('Getting project Project ID : '+projectId);
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  getInActiveProjectCostHeads(req:express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Project controller, getInActiveCostHead has been hit');
      let user = req.user;
      let projectId = req.params.projectId;
      let projectService = new ProjectService();
      projectService.getInActiveProjectCostHeads( projectId, user, (error, result) => {
        if (error) {
          next(error);
        } else {
          logger.info('Get InActive CostHead success');
          next(new Response(200, result));
        }
      });
    } catch (e) {
      next(new CostControllException(e.message, e.stack));
    }
  }

  setProjectCostHeadStatus(req: express.Request, res: express.Response, next: any): void {
    logger.info('Project controller, setProjectCostHeadStatus has been hit');
    try {
      let projectService = new ProjectService();
      let user = req.user;
      let projectId =  req.params.projectId;
      let costHeadId =  parseInt(req.params.costHeadId);
      let costHeadActiveStatus = req.params.activeStatus;

      projectService.setProjectCostHeadStatus( projectId, costHeadId, costHeadActiveStatus, user,(error, result) => {
        if(error) {
          next(error);
        } else {
          logger.info('Update setProjectCostHeadStatus success ');
          logger.debug('setProjectCostHeadStatus for Project ID : '+projectId+
            ', CostHead : '+costHeadId+', costHeadActiveStatus : '+costHeadActiveStatus);
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  createBuilding(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Project controller, addBuilding has been hit');
      let user = req.user;
      let projectId = req.params.projectId;
      let buildingDetails = <Building> req.body;

      let projectService = new ProjectService();
      projectService.createBuilding( projectId, buildingDetails, user, (error, result) => {
        if(error) {
          next(error);
        } else {
          logger.info('Add Building '+result.data._doc.name);
          logger.debug('Added Building Name : '+result.data._doc.name);
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  updateBuildingById(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Project controller, updateBuilding has been hit');
      let user = req.user;
      let buildingId = req.params.buildingId;
      let projectId = req.params.projectId;
      let buildingDetails = <Building> req.body;
      let projectService = new ProjectService();
      projectService.updateBuildingById( projectId, buildingId, buildingDetails, user, (error, result) => {
        if(error) {
          next(error);
        } else {
          logger.info('Update Building '+result.data._doc.name);
          logger.debug('Updated Building Name : '+result.data._doc.name);
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  cloneBuilding(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Project controller, cloneBuilding has been hit');
      let user = req.user;
      let buildingId = req.params.buildingId;
      let projectId = req.params.projectId;
      let buildingDetails = <Building> req.body;
      let projectService = new ProjectService();
      projectService.cloneBuildingDetails(projectId, buildingId, buildingDetails, user, (error, result) => {
        if(error) {
          next(error);
        } else {
          logger.info('Clone Building '+result.data.name);
          logger.debug('Cloned Building Name : '+result.data.name);
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  getBuildingById(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Project controller, getBuilding has been hit');
      let user = req.user;
      let projectId = req.params.projectId;
      let buildingId = req.params.buildingId;
      let projectService = new ProjectService();
      projectService.getBuildingById( projectId, buildingId, user, (error, result) => {
        if(error) {
          next(error);
        } else {
          logger.info('Get Building '+result.data.name);
          logger.debug('Get Building Name : '+result.data.name);
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  getBuildingByIdForClone(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Project controller, getBuildingDetailsForClone has been hit');
      let user = req.user;
      let projectId = req.params.projectId;
      let buildingId = req.params.buildingId;
      let projectService = new ProjectService();
      projectService.getBuildingByIdForClone( projectId, buildingId, user, (error, result) => {
        if(error) {
          next(error);
        } else {
          logger.info('Get Building details for clone '+result.data.name);
          logger.debug(result.data.name+' Building details for clone ...ProjectID : '+projectId+', BuildingID : '+buildingId);
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  getInActiveCostHead(req:express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Project controller, getInActiveCostHead has been hit');
      let user = req.user;
      let projectId = req.params.projectId;
      let buildingId = req.params.buildingId;
      let projectService = new ProjectService();
      projectService.getInActiveCostHead( projectId, buildingId, user, (error, result) => {
        if (error) {
          next(error);
        } else {
          logger.info('Get InActive CostHead success');
          next(new Response(200, result));
        }
      });
    } catch (e) {
      next(new CostControllException(e.message, e.stack));
    }
  }

  getInActiveWorkItemsOfBuildingCostHeads(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('getInActiveWorkItems has been hit');
      let user = req.user;
      let projectId = req.params.projectId;
      let buildingId = req.params.buildingId;
      let costHeadId : number = parseInt(req.params.costHeadId);
      let categoryId : number = parseInt(req.params.categoryId);
      let projectService = new ProjectService();
      projectService.getInActiveWorkItemsOfBuildingCostHeads( projectId, buildingId, costHeadId, categoryId, user, (error, result) => {
        if(error) {
          next(error);
        } else {
          logger.info('Get InActive WorkItem success');
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  // Get In Active WorkItems Of Project Cost Heads
  getInActiveWorkItemsOfProjectCostHeads(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Project Controller, Get In-Active WorkItems Of Project Cost Heads has been hit');
      let user = req.user;
      let projectId = req.params.projectId;
      let costHeadId : number = parseInt(req.params.costHeadId);
      let categoryId : number = parseInt(req.params.categoryId);
      let projectService = new ProjectService();
      projectService.getInActiveWorkItemsOfProjectCostHeads( projectId, costHeadId, categoryId, user, (error, result) => {
        if(error
        ) {
          next(error);
        } else {
          logger.info('Get In-Active WorkItems Of Project Cost Heads success');
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  deleteBuildingById(req: express.Request, res: express.Response, next: any): void {
    logger.info('Project controller, deleteBuilding has been hit');
    try {
      let user = req.user;
      let projectId = req.params.projectId;
      let buildingId = req.params.buildingId;
      let projectService = new ProjectService();
      projectService.deleteBuildingById( projectId, buildingId, user, (error, result) => {
        if(error) {
          next(error);
        } else {
          logger.info('Building Delete from '+result.data.name+ ' project');
          logger.debug('Building Deleted from '+result.data.name+ ' project');
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  getRate(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Project controller, getRate has been hit');
      let user = req.user;
      let projectId = req.params.projectId;
      let buildingId = req.params.buildingId;
      let costHeadId =parseInt(req.params.costHeadId);
      let categoryId =parseInt(req.params.categoryId);
      let workItemId =parseInt(req.params.workItemId);
      let projectService = new ProjectService();
      console.log(' workitemId => '+ workItemId);
      projectService.getRate( projectId, buildingId, costHeadId, categoryId, workItemId, user, (error, result) => {
        if(error) {
          next(error);
        } else {
          logger.info('Get Rate Success');
          logger.debug('Getting Rate of Project ID : '+projectId+' Building ID : '+buildingId);
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  updateRateOfBuildingCostHeads(req: express.Request, res: express.Response, next: any): void {
    try {
      let user = req.user;
      let projectId = req.params.projectId;
      let buildingId = req.params.buildingId;
      let costHeadId =parseInt(req.params.costHeadId);
      let categoryId =parseInt(req.params.categoryId);
      let workItemId =parseInt(req.params.workItemId);
      let ccWorkItemId =parseInt(req.params.ccWorkItemId);
      let rate : Rate = <Rate> req.body;
      let projectService = new ProjectService();
      console.log(' workitemId => '+ workItemId);
      projectService.updateRateOfBuildingCostHeads( projectId, buildingId, costHeadId,categoryId ,
        workItemId, ccWorkItemId, rate, user, (error, result) => {
        if(error) {
          next(error);
        } else {
          logger.info('Get Rate Success');
          logger.debug('Getting Rate of Project ID : '+projectId+' Building ID : '+buildingId);
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  //Update Direct Rate of Building Costheads
  updateDirectRateOfBuildingWorkItems(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Project controller, update DirectRate Of Building WorkItems has been hit');
      let user = req.user;
      let projectId = req.params.projectId;
      let buildingId = req.params.buildingId;
      let costHeadId = parseInt(req.params.costHeadId);
      let categoryId = parseInt(req.params.categoryId);
      let workItemId = parseInt(req.params.workItemId);
      let ccWorkItemId = parseInt(req.params.ccWorkItemId);
      let directRate = req.body.directRate;

      let projectService = new ProjectService();
      projectService.updateDirectRateOfBuildingWorkItems( projectId, buildingId, costHeadId,
        categoryId, workItemId, ccWorkItemId, directRate, user, (error, result) => {
          if(error) {
            next(error);
          } else {
            logger.info('update DirectRate Of Building WorkItems success');
            next(new Response(200,result));
          }
        });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }



  //Update rate of project cost heads
  updateRateOfProjectCostHeads(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Project Controller, Update rate of project cost heads has been hit');
      let user = req.user;
      let projectId = req.params.projectId;
      let costHeadId =parseInt(req.params.costHeadId);
      let categoryId =parseInt(req.params.categoryId);
      let workItemId =parseInt(req.params.workItemId);
      let ccWorkItemId =parseInt(req.params.ccWorkItemId);
      let rate : Rate = <Rate> req.body;
      let projectService = new ProjectService();
      projectService.updateRateOfProjectCostHeads( projectId, costHeadId,categoryId ,workItemId,
        ccWorkItemId, rate, user, (error, result) => {
        if(error) {
          next(error);
        } else {
          logger.info('Update rate of project cost heads Success');
          logger.debug('Update rate of project cost heads of Project ID : '+projectId);
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  //Update Direct Rate of Project costheads

  updateDirectRateOfProjectWorkItems(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Project Controller,update DirectRate Of Project WorkItems has been hit');
      let user = req.user;
      let projectId =  req.params.projectId;
      let costHeadId = parseInt(req.params.costHeadId);
      let categoryId = parseInt(req.params.categoryId);
      let workItemId = parseInt(req.params.workItemId);
      let ccWorkItemId = parseInt(req.params.ccWorkItemId);
      let directRate = req.body.directRate;

      let projectService = new ProjectService();
      projectService.updateDirectRateOfProjectWorkItems( projectId, costHeadId,categoryId ,workItemId,
        ccWorkItemId, directRate, user, (error, result) => {
        if(error) {
          next(error);
        } else {
          logger.info('update DirectRate Of Project WorkItems Success');
          logger.debug('update DirectRate Of Project WorkItems of Project ID : '+projectId);
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  deleteQuantityOfBuildingCostHeadsByName(req: express.Request, res: express.Response, next: any): void {
  try {
    logger.info('Project controller, deleteQuantity has been hit');
    let user = req.user;
    let projectId = req.params.projectId;
    let buildingId = req.params.buildingId;
    let costHeadId = parseInt(req.params.costHeadId);
    let categoryId = parseInt(req.params.categoryId);
    let workItemId = parseInt(req.params.workItemId);
    let ccWorkItemId = parseInt(req.params.ccWorkItemId);
    let itemName = req.body.item.name;

    let projectservice = new ProjectService();
    projectservice.deleteQuantityOfBuildingCostHeadsByName( projectId, buildingId, costHeadId,
      categoryId, workItemId, ccWorkItemId, itemName, user, (error, result) => {
      if (error) {
        next(error);
      } else {
        logger.info('Delete Quantity ' + result);
           logger.debug('Deleted Quantity of Project ID : '+projectId+', Building ID : '+buildingId+
             ', CostHead : '+costHeadId+', Workitem : '+workItemId+', Item : '+itemName);
        next(new Response(200, result));
      }
    });
  }catch(e) {
    next(new CostControllException(e.message,e.stack));
  }
  }

  //Delete Quantity Of Project Cost Heads By Name
  deleteQuantityOfProjectCostHeadsByName(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Project controller, Delete Quantity Of Project Cost Heads By Name has been hit');
      let user = req.user;
      let projectId = req.params.projectId;
      let costHeadId = parseInt(req.params.costHeadId);
      let categoryId = parseInt(req.params.categoryId);
      let workItemId = parseInt(req.params.workItemId);
      let itemName = req.body.item.name;

      let projectService = new ProjectService();
      projectService.deleteQuantityOfProjectCostHeadsByName( projectId, costHeadId, categoryId, workItemId, itemName,
        user, (error, result) => {
        if (error) {
          next(error);
        } else {
          logger.info('Delete Quantity Of Project Cost Heads By Name ' + result);
          logger.debug('Delete Quantity Of Project Cost Heads By Name of Project ID : '+projectId+', CostHead : '+costHeadId+', ' +
            'Workitem : '+workItemId+', Item : '+itemName);
          next(new Response(200, result));
        }
      });
    }catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  deleteWorkitem(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Project controller, deleteWorkitem has been hit');
      let user = req.user;
      let projectId = req.params.projectId;
      let buildingId = req.params.buildingId;
      let costHeadId = parseInt(req.params.costHeadId);
      let categoryId = parseInt(req.params.categoryId);
      let workItemId = parseInt(req.params.workItemId);
      let projectService = new ProjectService();
      console.log(' workitem => '+ workItemId);
      projectService.deleteWorkitem( projectId, buildingId, costHeadId, categoryId, workItemId, user, (error, result) => {
        if(error) {
          next(error);
        } else {
          logger.info('Delete work item '+result.data);
          logger.debug('Deleted  work item of Project ID : '+projectId+', Building ID : '+buildingId+
            ', CostHead : '+costHeadId+', Category : '+categoryId+', Workitem : '+workItemId);
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  setCostHeadStatus(req: express.Request, res: express.Response, next: any): void {
    logger.info('Project controller, updateBuildingCostHead has been hit');
    try {
      let projectService = new ProjectService();
      let user = req.user;
      let projectId =  req.params.projectId;
      let buildingId =  req.params.buildingId;
      let costHeadId =  parseInt(req.params.costHeadId);
      let costHeadActiveStatus = req.params.activeStatus;

      projectService.setCostHeadStatus( buildingId, costHeadId, costHeadActiveStatus, user,(error, result) => {
        if(error) {
          next(error);
        } else {
          logger.info('Update Building CostHead Details success ');
          logger.debug('updateBuildingCostHead for Project ID : '+projectId+', Building ID : '+buildingId+
            ', CostHead : '+costHeadId+', costHeadActiveStatus : '+costHeadActiveStatus);
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  updateWorkItemStatusOfBuildingCostHeads(req: express.Request, res: express.Response, next: any): void {
    logger.info('Project controller, update WorkItem has been hit');
    try {
      let user = req.user;
      let body = req.body;
      let projectId = req.params.projectId;
      let buildingId = req.params.buildingId;
      let costHeadId = parseInt(req.params.costHeadId);
      let categoryId = parseInt(req.params.categoryId);
      let workItemRAId = parseInt(req.params.workItemRAId);
      let workItemId = parseInt(req.params.workItemId);
      let workItemActiveStatus = JSON.parse(req.params.activeStatus);

      let projectService: ProjectService = new ProjectService();
      projectService.updateWorkItemStatusOfBuildingCostHeads( buildingId, costHeadId, categoryId,
        workItemRAId, workItemId, workItemActiveStatus, body, user,(error, result) => {
        if(error) {
          next(error);
        } else {
          logger.info('Update workItem Details success ');
          logger.debug('update WorkItem for Project ID : '+projectId+', Building ID : '+buildingId+
            ', CostHead : '+costHeadId+', workItemActiveStatus : '+workItemActiveStatus);
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  updateWorkItemNameOfBuildingCostHeads(req: express.Request, res: express.Response, next: any): void {
    logger.info('Project controller, update WorkItem has been hit');
    try {
      let user = req.user;
      let body = req.body;
      let projectId = req.params.projectId;
      let buildingId = req.params.buildingId;
      let costHeadId = parseInt(req.params.costHeadId);
      let categoryId = parseInt(req.params.categoryId);
      let workItemId = parseInt(req.params.workItemId);
      let ccWorkItemId = parseInt(req.params.ccWorkItemId);

      let projectService: ProjectService = new ProjectService();
      projectService.updateWorkItemNameOfBuildingCostHeads( buildingId, costHeadId, categoryId,
        workItemId, ccWorkItemId, body, user,(error, result) => {
          if(error) {
            next(error);
          } else {
            logger.info('Update workItem Details success ');
            logger.debug('update WorkItem for Project ID : '+projectId+', Building ID : '+buildingId+
              ', CostHead : '+costHeadId);
            next(new Response(200,result));
          }
        });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

 // Update WorkItem Status Of Project CostHeads
  updateWorkItemStatusOfProjectCostHeads(req: express.Request, res: express.Response, next: any): void {
    logger.info('Project controller, Update WorkItem Status Of Project Cost Heads has been hit');
    try {
      let user = req.user;
      let body = req.body;
      let projectId = req.params.projectId;
      let costHeadId = parseInt(req.params.costHeadId);
      let categoryId = parseInt(req.params.categoryId);
      let workItemId = parseInt(req.params.workItemId);
      let ccWorkItemId = parseInt(req.params.ccWorkItemId);
      let workItemActiveStatus = JSON.parse(req.params.activeStatus);
      let projectService: ProjectService = new ProjectService();
      projectService.updateWorkItemStatusOfProjectCostHeads( projectId, costHeadId, categoryId, workItemId,
        ccWorkItemId, workItemActiveStatus, body, user,(error, result) => {
        if(error) {
          next(error);
        } else {
          logger.info('Update WorkItem Status Of Project Cost Heads success ');
          logger.debug('Update WorkItem Status Of Project Cost Heads for Project ID : '+projectId+' CostHead : '+costHeadId+', ' +
            'workItemActiveStatus : '+workItemActiveStatus);
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  updateBudgetedCostForCostHead(req: express.Request, res: express.Response, next: any): void {
    try {
      let projectService = new ProjectService();
      let user = req.user;
      let projectId =  req.params.projectId;
      let buildingId =  req.params.buildingId;
      let costHeadBudgetedAmount =  req.body;

      projectService.updateBudgetedCostForCostHead( buildingId, costHeadBudgetedAmount, user,(error, result) => {
        if(error) {
          next(error);
        } else {
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  updateBudgetedCostForProjectCostHead(req: express.Request, res: express.Response, next: any): void {
    try {
      let projectService = new ProjectService();
      let user = req.user;
      let projectId =  req.params.projectId;
      let costHeadBudgetedAmount =  req.body;

      projectService.updateBudgetedCostForProjectCostHead( projectId, costHeadBudgetedAmount, user,(error, result) => {
        if(error) {
          next(error);
        } else {
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  updateQuantityOfBuildingCostHeads(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Project controller, updateQuantity has been hit');
      let user = req.user;
      let projectId = req.params.projectId;
      let buildingId = req.params.buildingId;
      let costHeadId = parseInt(req.params.costHeadId);
      let categoryId = parseInt(req.params.categoryId);
      let workItemId = parseInt(req.params.workItemId);
      let ccWorkItemId = parseInt(req.params.ccWorkItemId);
      let quantityDetails = req.body.item;

      let projectService = new ProjectService();
      projectService.updateQuantityOfBuildingCostHeads( projectId, buildingId, costHeadId,
        categoryId, workItemId, ccWorkItemId, quantityDetails, user, (error, result) => {
        if(error) {
          next(error);
        } else {
          logger.info('Update Quantity success');
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }


  updateDirectQuantityOfBuildingWorkItems(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Project controller, updateDirectQuantityOfBuildingCostHeads has been hit');
      let user = req.user;
      let projectId = req.params.projectId;
      let buildingId = req.params.buildingId;
      let costHeadId = parseInt(req.params.costHeadId);
      let categoryId = parseInt(req.params.categoryId);
      let workItemId = parseInt(req.params.workItemId);
      let ccWorkItemId = parseInt(req.params.ccWorkItemId);
      let directQuantity = req.body.directQuantity;

      let projectService = new ProjectService();
      projectService.updateDirectQuantityOfBuildingWorkItems( projectId, buildingId, costHeadId,
        categoryId, workItemId, ccWorkItemId, directQuantity, user, (error, result) => {
        if(error) {
          next(error);
        } else {
          logger.info('updateDirectQuantityOfBuildingCostHeads success');
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  updateDirectQuantityOfProjectWorkItems(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Project controller, updateDirectQuantityOfBuildingCostHeads has been hit');
      let user = req.user;
      let projectId = req.params.projectId;
      let costHeadId = parseInt(req.params.costHeadId);
      let categoryId = parseInt(req.params.categoryId);
      let workItemId = parseInt(req.params.workItemId);
      let ccWorkItemId = parseInt(req.params.ccWorkItemId);
      let directQuantity = req.body.directQuantity;

      let projectService = new ProjectService();
      projectService.updateDirectQuantityOfProjectWorkItems( projectId, costHeadId,
        categoryId, workItemId, ccWorkItemId, directQuantity, user, (error, result) => {
          if(error) {
            next(error);
          } else {
            logger.info('updateDirectQuantityOfProjectWorkItems success');
            next(new Response(200,result));
          }
        });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  updateQuantityDetailsOfBuilding(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Project controller, update DirectQuantity Of BuildingQuantityItems has been hit');
      let user = req.user;
      let projectId = req.params.projectId;
      let buildingId = req.params.buildingId;
      let costHeadId = parseInt(req.params.costHeadId);
      let categoryId = parseInt(req.params.categoryId);
      let workItemId = parseInt(req.params.workItemId);
      let ccWorkItemId = parseInt(req.params.ccWorkItemId);
      let quantityDetailsObj = req.body.item;

      let projectService = new ProjectService();
      projectService.updateQuantityDetailsOfBuilding( projectId, buildingId, costHeadId,
        categoryId, workItemId, ccWorkItemId, quantityDetailsObj, user, (error, result) => {
          if(error) {
            next(error);
          } else {
            logger.info('update DirectQuantity Of BuildingQuantityItems success');
            next(new Response(200,result));
          }
        });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  updateQuantityDetailsOfProject(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Project controller, update DirectQuantity Of BuildingQuantityItems has been hit');
      let user = req.user;
      let projectId = req.params.projectId;
      let costHeadId = parseInt(req.params.costHeadId);
      let categoryId = parseInt(req.params.categoryId);
      let workItemId = parseInt(req.params.workItemId);
      let ccWorkItemId = parseInt(req.params.ccWorkItemId);
      let workItemName = req.body.workItemName;

      let projectService = new ProjectService();
      projectService.updateWorkitemNameOfProjectCostHeads( projectId, costHeadId,
        categoryId, workItemId, ccWorkItemId, workItemName, user, (error, result) => {
          if(error) {
            next(error);
          } else {
            logger.info('update DirectQuantity Of BuildingQuantityItems success');
            next(new Response(200,result));
          }
        });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  updateWorkItemNameOfProjectCostHead(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Project controller, update DirectQuantity Of BuildingQuantityItems has been hit');
      let user = req.user;
      let projectId = req.params.projectId;
      let costHeadId = parseInt(req.params.costHeadId);
      let categoryId = parseInt(req.params.categoryId);
      let workItemId = parseInt(req.params.workItemId);
      let ccWorkItemId = parseInt(req.params.ccWorkItemId);
      let quantityDetailsObj = req.body.item;

      let projectService = new ProjectService();
      projectService.updateQuantityDetailsOfProject( projectId, costHeadId,
        categoryId, workItemId, ccWorkItemId, quantityDetailsObj, user, (error, result) => {
          if(error) {
            next(error);
          } else {
            logger.info('update DirectQuantity Of BuildingQuantityItems success');
            next(new Response(200,result));
          }
        });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  //Update Quantity Of Project Cost Heads
  updateQuantityOfProjectCostHeads(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Project controller, Update Quantity Of Project Cost Heads has been hit');
      let user = req.user;
      let projectId = req.params.projectId;
      let costHeadId = parseInt(req.params.costHeadId);
      let categoryId = parseInt(req.params.categoryId);
      let workItemId = parseInt(req.params.workItemId);
      let ccWorkItemId = parseInt(req.params.ccWorkItemId);
      let quantityDetails = req.body.item;

      let projectService = new ProjectService();
      projectService.updateQuantityOfProjectCostHeads( projectId, costHeadId,
        categoryId, workItemId, ccWorkItemId, quantityDetails, user, (error, result) => {
        if(error) {
          next(error);
        } else {
          logger.info('Update Quantity Of Project Cost Heads success');
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }


  //Get In-Active Categories From Database
  getInActiveCategoriesByCostHeadId(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Project controller, getCategoryByCostHeadId has been hit');
      let user = req.user;
      let projectId = req.params.projectId;
      let buildingId = req.params.buildingId;
      let costHeadId = req.params.costHeadId;

      let projectService = new ProjectService();

      projectService.getInActiveCategoriesByCostHeadId(projectId, buildingId, costHeadId, user, (error, result) => {
        if(error) {
          next(error);
        } else {
          logger.info('Get Category By CostHeadId success');
          logger.debug('Get Category By CostHeadId of Project ID : '+projectId+' Building ID : '+buildingId);
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  getWorkItemListOfBuildingCategory(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('getWorkitemList has been hit');
      let user = req.user;
      let projectId = req.params.projectId;
      let buildingId = req.params.buildingId;
      let costHeadId = parseInt(req.params.costHeadId);
      let categoryId = parseInt(req.params.categoryId);
      let projectService = new ProjectService();
      projectService.getWorkItemListOfBuildingCategory(projectId, buildingId, costHeadId, categoryId, user, (error, result) => {
        if(error) {
          next(error);
        } else {
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  //Get workitems for perticular category of project cost head
  getWorkItemListOfProjectCategory(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('getWorkitemListOfProjectCostHead has been hit');
      let user = req.user;
      let projectId = req.params.projectId;
      let costHeadId = parseInt(req.params.costHeadId);
      let categoryId = parseInt(req.params.categoryId);
      let projectService = new ProjectService();
      projectService.getWorkItemListOfProjectCategory(projectId, costHeadId, categoryId, user, (error, result) => {
        if(error) {
          next(error);
        } else {
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  addWorkitem(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('addWorkitem has been hit');
      let user = req.user;
      let projectId = req.params.projectId;
      let buildingId = req.params.buildingId;
      let costHeadId : number = parseInt(req.params.costHeadId);
      let categoryId : number = parseInt(req.params.categoryId);
      let workItem: WorkItem = new WorkItem(req.body.name, req.body.rateAnalysisId);
      let projectService = new ProjectService();
      projectService.addWorkitem( projectId, buildingId, costHeadId, categoryId, workItem, user, (error, result) => {
        if(error
        ) {
          next(error);
        } else {
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  addCategoryByCostHeadId(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Project controller, addCategoryByCostHeadId has been hit');
      let user = req.user;
      let projectId = req.params.projectId;
      let buildingId = req.params.buildingId;
      let costHeadId = req.params.costHeadId;
      let categoryDetails = req.body;

      let projectService = new ProjectService();

      projectService.addCategoryByCostHeadId(projectId, buildingId, costHeadId, categoryDetails, user, (error, result) => {
        if(error) {
          next(error);
        } else {
          logger.info('Get Quantity success');
          logger.debug('Getting Quantity of Project ID : '+projectId+' Building ID : '+buildingId);
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  //Get active categories from database
  getCategoriesOfBuildingCostHead(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Project controller, Get Active Categories has been hit');
      let user = req.user;
      let projectId = req.params.projectId;
      let buildingId = req.params.buildingId;
      let costHeadId = parseInt(req.params.costHeadId);
      let projectService = new ProjectService();
      projectService.getCategoriesOfBuildingCostHead(projectId, buildingId, costHeadId, user, (error, result) => {
        if(error) {
          next(error);
        } else {
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  //Get categories of projectCostHeads from database
  getCategoriesOfProjectCostHead(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Project controller, Get Project CostHead Categories has been hit');
      let user = req.user;
      let projectId = req.params.projectId;
      let costHeadId = parseInt(req.params.costHeadId);
      let projectService = new ProjectService();
      projectService.getCategoriesOfProjectCostHead(projectId, costHeadId, user, (error, result) => {
        if(error) {
          next(error);
        } else {
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  getCostHeadDetailsOfBuilding(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Project controller, Get Project CostHead Categories has been hit');
      let user = req.user;
      let projectId = req.params.projectId;
      let buildingId = req.params.buildingId;
      let costHeadId = parseInt(req.params.costHeadId);
      let projectService = new ProjectService();
      projectService.getCostHeadDetailsOfBuilding(projectId, buildingId, costHeadId, user, (error, result) => {
        if(error) {
          next(error);
        } else {
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  //Update status ( true/false ) of category
  updateCategoryStatus(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Project controller, update Category Status has been hit');
      let user = req.user;
      let projectId = req.params.projectId;
      let buildingId = req.params.buildingId;
      let costHeadId = parseFloat(req.params.costHeadId);
      let categoryId =parseFloat(req.params.categoryId);
      let categoryActiveStatus = req.params.activeStatus === 'true' ? true : false;

      let projectService = new ProjectService();

      projectService.updateCategoryStatus( projectId, buildingId, costHeadId, categoryId, categoryActiveStatus,
        user, (error, result) => {
          if(error) {
            next(error);
          } else {
            logger.info('Update Category Status success');
            logger.debug('Update Category Status success of Project ID : '+projectId+' Building ID : '+buildingId);
            next(new Response(200,result));
          }
        });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  syncProjectWithRateAnalysisData(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Project controller, syncBuildingWithRateAnalysisData has been hit');
      let user = req.user;
      let projectId = req.params.projectId;
      let buildingId = req.params.buildingId;

      let projectService = new ProjectService();

      projectService.syncProjectWithRateAnalysisData( projectId, buildingId, user, (error, result) => {
        if(error) {
          logger.error('syncProjectWithRateAnalysisData failure');
          next(error);
        } else {
          logger.info('syncProjectWithRateAnalysisData success');
          logger.debug('Getting syncProjectWithRateAnalysisData of Project ID : '+projectId+' Building ID : '+buildingId);
          next(new Response(200,result));
        }
      });
    } catch (e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  getBuildingRateItemsByOriginalName(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Project controller, getBuildingRateItemsByOriginalName has been hit');
      let user = req.user;
      let projectId = req.params.projectId;
      let buildingId = req.params.buildingId;
      let originalRateItemName = req.body.originalRateItemName;
      let projectService = new ProjectService();

      projectService.getBuildingRateItemsByOriginalName( projectId, buildingId, originalRateItemName, user, (error, result) => {
        if(error) {
          logger.error('getBuildingRateItemsByOriginalName failure');
          next(error);
        } else {
          logger.info('getBuildingRateItemsByOriginalName success');
          logger.debug('Getting getBuildingRateItemsByOriginalName of Project ID : '+projectId+' Building ID : '+buildingId);
          next(new Response(200,result));
        }
      });
    } catch (e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  getProjectRateItemsByOriginalName(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Project controller, getProjectRateItemsByName has been hit');
      let user = req.user;
      let projectId = req.params.projectId;
      let originalRateItemName = req.body.originalRateItemName;
      let projectService = new ProjectService();

      projectService.getProjectRateItemsByOriginalName( projectId, originalRateItemName, user, (error, result) => {
        if(error) {
          logger.error('getProjectRateItemsByOriginalName failure');
          next(error);
        } else {
          logger.info('getProjectRateItemsByOriginalName success');
          logger.debug('Getting getProjectRateItemsByOriginalName of Project ID : '+projectId);
          next(new Response(200,result));
        }
      });
    } catch (e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  addAttachmentToBuildingWorkItem(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      let projectService = new ProjectService();
      var projectId = req.params.projectId;
      var buildingId = req.params.buildingId;
      let costHeadId = parseInt(req.params.costHeadId);
      let categoryId = parseInt(req.params.categoryId);
      let workItemId = parseInt(req.params.workItemId);
      let ccWorkItemId = parseInt(req.params.ccWorkItemId);
      let fileData = req;
      projectService.addAttachmentToWorkItem( projectId, buildingId ,costHeadId, categoryId, workItemId,
        ccWorkItemId, fileData ,(error, response) => {
        if (error) {
          next(error);
        } else {
          res.status(200).send({response});
        }
      });
    } catch (e) {
      next({
        reason: e.message,
        message: e.message,
        stackTrace: e,
        code: 403
      });
    }
  }
  getImageURl(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      __dirname = path.resolve() + config.get('application.profilePath');
      let form = new multiparty.Form({uploadDir: __dirname});
      form.parse(req, (err: Error, fields: any, files: any) => {
        if (err) {
          next({
            reason: 'Error in project ImageParsing',
            message:'Error in project ImageParsing',
            stackTrace: new Error(),
            actualError: err,
            code: 403
          });
        } else {
          let path = JSON.stringify(files.file[0].path);
          let image_path = files.file[0].path;
          let originalFilename = JSON.stringify(image_path.substr(files.file[0].path.lastIndexOf('/') + 1));
          let projectService = new ProjectService();
          path = config.get('application.profilePathForClient') + originalFilename.replace(/"/g, '');

          projectService.UploadImage(path, originalFilename, function (err: any, tempath: any) {
            if (err) {
              next(err);
            } else {

              let projectService = new ProjectService();
              var projectId = req.params.projectId;
              var imageName = req.params.imageName;
              if(projectId !== 'newUser') {
              projectService.updateProjectImage( projectId ,tempath,imageName,(error, response) => {
                if (error) {
                  next(error);
                } else {
                  res.status(200).send({ tempath });
                }
              });
              }else {
                res.status(200).send({ tempath });
              }
            }
          });
        }

      });
    } catch (e) {
      next({
        reason: e.message,
        message: e.message,
        stackTrace: e,
        code: 403
      });
    }
  }
  removeProjectImage(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      let projectService = new ProjectService();
      var projectId = req.params.projectId;
      var imageName = req.params.imageName;
      projectService.removeImageOfProject( projectId ,imageName,(error, response) => {
          if (error) {
            next(error);
          } else {
            res.status(200).send({response});
          }
        });
    } catch (e) {
      next({
        reason: e.message,
        message: e.message,
        stackTrace: e,
        code: 403
      });
    }
  }
  getPresentFilesForBuildingWorkItem(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      let projectService = new ProjectService();
      var projectId = req.params.projectId;
      var buildingId = req.params.buildingId;
      let costHeadId = parseInt(req.params.costHeadId);
      let categoryId = parseInt(req.params.categoryId);
      let workItemId = parseInt(req.params.workItemId);
      let ccWorkItemId = parseInt(req.params.ccWorkItemId);
      projectService.getPresentFilesForBuildingWorkItem(projectId, buildingId, costHeadId, categoryId,
        workItemId, ccWorkItemId,(error, response) => {
        if (error) {
          next(error);
        } else {
          res.status(200).send({response});
        }
      });
    } catch (e) {
      next({
        reason: e.message,
        message: e.message,
        stackTrace: e,
        code: 403
      });
    }
  }
  removeAttachmentOfBuildingWorkItem(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      let projectService = new ProjectService();
      var projectId = req.params.projectId;
      var buildingId = req.params.buildingId;
      let costHeadId = parseInt(req.params.costHeadId);
      let categoryId = parseInt(req.params.categoryId);
      let workItemId = parseInt(req.params.workItemId);
      let ccWorkItemId = parseInt(req.params.ccWorkItemId);
      let assignedFileName = req.body.assignedFileName;
      projectService.removeAttachmentOfBuildingWorkItem(projectId, buildingId, costHeadId,
        categoryId, workItemId, ccWorkItemId, assignedFileName,(error, response) => {
        if (error) {
          next(error);
        } else {
          res.status(200).send({response});
        }
      });
    } catch (e) {
      next({
        reason: e.message,
        message: e.message,
        stackTrace: e,
        code: 403
      });
    }
  }

  addAttachmentToProjectWorkItem(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      let projectService = new ProjectService();
      var projectId = req.params.projectId;
      let costHeadId = parseInt(req.params.costHeadId);
      let categoryId = parseInt(req.params.categoryId);
      let workItemId = parseInt(req.params.workItemId);
      let ccWorkItemId = parseInt(req.params.ccWorkItemId);
      let fileData = req;
      projectService.addAttachmentToProjectWorkItem( projectId, costHeadId, categoryId,
        workItemId, ccWorkItemId, fileData ,(error, response) => {
        if (error) {
          next(error);
        } else {
          res.status(200).send({response});
        }
      });
    } catch (e) {
      next({
        reason: e.message,
        message: e.message,
        stackTrace: e,
        code: 403
      });
    }
  }
  getPresentFilesForProjectWorkItem(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      let projectService = new ProjectService();
      var projectId = req.params.projectId;
      let costHeadId = parseInt(req.params.costHeadId);
      let categoryId = parseInt(req.params.categoryId);
      let workItemId = parseInt(req.params.workItemId);
      let ccWorkItemId = parseInt(req.params.ccWorkItemId);
      projectService.getPresentFilesForProjectWorkItem(projectId, costHeadId, categoryId,
        workItemId, ccWorkItemId, (error, response) => {
        if (error) {
          next(error);
        } else {
          res.status(200).send({response});
        }
      });
    } catch (e) {
      next({
        reason: e.message,
        message: e.message,
        stackTrace: e,
        code: 403
      });
    }
  }
  removeAttachmentOfProjectWorkItem(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      let projectService = new ProjectService();
      var projectId = req.params.projectId;
      let costHeadId = parseInt(req.params.costHeadId);
      let categoryId = parseInt(req.params.categoryId);
      let workItemId = parseInt(req.params.workItemId);
      let ccWorkItemId = parseInt(req.params.ccWorkItemId);
      let assignedFileName = req.body.assignedFileName;
      projectService.removeAttachmentOfProjectWorkItem(projectId,costHeadId, categoryId,
        workItemId, ccWorkItemId, assignedFileName,(error, response) => {
        if (error) {
          next(error);
        } else {
          res.status(200).send({response});
        }
      });
    } catch (e) {
      next({
        reason: e.message,
        message: e.message,
        stackTrace: e,
        code: 403
      });
    }
  }
}
export  = ProjectController;
