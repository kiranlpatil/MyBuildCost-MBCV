import * as express from 'express';
import ProjectService = require('./../services/ProjectService');
import Project = require('../dataaccess/mongoose/Project');
import Building = require('../dataaccess/mongoose/Building');
import Response = require('../interceptor/response/Response');
import CostControllException = require('../exception/CostControllException');
import CostHead = require('../dataaccess/model/project/building/CostHead');
import Rate = require('../dataaccess/model/project/building/Rate');
import WorkItem = require('../dataaccess/model/project/building/WorkItem');
let config = require('config');
let log4js = require('log4js');
let logger=log4js.getLogger('Project Controller');


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

      let defaultRates = config.get('rate.default');
      data.rates = defaultRates;

      let projectService = new ProjectService();
      projectService.createProject( data, user,(error, result) => {
        if(error) {
          next(error);
        } else {
          logger.info(result._doc.name+' project is created ');
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
      let buildingDetails = <Building> req.body;
      let projectService = new ProjectService();
      projectService.updateBuildingById( buildingId, buildingDetails, user, (error, result) => {
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

  cloneBuildingById(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Project controller, cloneBuilding has been hit');
      let user = req.user;
      let buildingId = req.params.buildingId;
      let buildingDetails = <Building> req.body;
      let projectService = new ProjectService();
      projectService.cloneBuildingDetails( buildingId, buildingDetails, user, (error, result) => {
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

  getInActiveWorkItems(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('getInActiveWorkItems has been hit');
      let user = req.user;
      let projectId = req.params.projectId;
      let buildingId = req.params.buildingId;
      let costHeadId : number = parseInt(req.params.costHeadId);
      let categoryId : number = parseInt(req.params.categoryId);
      let projectService = new ProjectService();
      projectService.getInActiveWorkItems( projectId, buildingId, costHeadId, categoryId, user, (error, result) => {
        if(error
        ) {
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

  updateRate(req: express.Request, res: express.Response, next: any): void {
    try {
      let user = req.user;
      let projectId = req.params.projectId;
      let buildingId = req.params.buildingId;
      let costHeadId =parseInt(req.params.costHeadId);
      let categoryId =parseInt(req.params.categoryId);
      let workItemId =parseInt(req.params.workItemId);
      let rate : Rate = <Rate> req.body;
      let projectService = new ProjectService();
      console.log(' workitemId => '+ workItemId);
      projectService.updateRate( projectId, buildingId, costHeadId,categoryId ,workItemId, rate, user, (error, result) => {
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

  updateRateOfProjectCostHeads(req: express.Request, res: express.Response, next: any): void {
    try {
      let user = req.user;
      let projectId = req.params.projectId;
      let costHeadId =parseInt(req.params.costHeadId);
      let categoryId =parseInt(req.params.categoryId);
      let workItemId =parseInt(req.params.workItemId);
      let rate : Rate = <Rate> req.body;
      let projectService = new ProjectService();
      console.log(' workitemId => '+ workItemId);
      projectService.updateRateOfProjectCostHeads( projectId, costHeadId,categoryId ,workItemId, rate, user, (error, result) => {
        if(error) {
          next(error);
        } else {
          logger.info('Get Rate Success');
          logger.debug('Getting Rate of Project ID : '+projectId);
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  deleteQuantityByName(req: express.Request, res: express.Response, next: any): void {
  try {
    logger.info('Project controller, deleteQuantity has been hit');
    let user = req.user;
    let projectId = req.params.projectId;
    let buildingId = req.params.buildingId;
    let costHeadId = req.params.costHeadId;
    let categoryId = req.params.categoryId;
    let workItemId = req.params.workItemId;
    let item = req.body.item;
    let projectservice = new ProjectService();
    projectservice.deleteQuantityByName( projectId, buildingId, costHeadId, categoryId, workItemId, item, user, (error, result) => {
      if (error) {
        next(error);
      } else {
        logger.info('Delete Quantity ' + result);
           logger.debug('Deleted Quantity of Project ID : '+projectId+', Building ID : '+buildingId+
             ', CostHead : '+costHeadId+', Workitem : '+workItemId+', Item : '+item);
        next(new Response(200, result));
      }
    });
  }catch(e) {
    next(new CostControllException(e.message,e.stack));
  }
  }

  deleteQuantityOfProjectCostHeadsByName(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Project controller, deleteQuantity has been hit');
      let user = req.user;
      let projectId = req.params.projectId;
      let costHeadId = req.params.costHeadId;
      let categoryId = req.params.categoryId;
      let workItemId = req.params.workItemId;
      let item = req.body.item;
      let projectservice = new ProjectService();
      projectservice.deleteQuantityOfProjectCostHeadsByName( projectId, costHeadId, categoryId, workItemId, item,
        user, (error, result) => {
        if (error) {
          next(error);
        } else {
          logger.info('Delete Quantity ' + result);
          logger.debug('Deleted Quantity of Project ID : '+projectId+', CostHead : '+costHeadId+', ' +
            'Workitem : '+workItemId+', Item : '+item);
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

  setWorkItemStatus(req: express.Request, res: express.Response, next: any): void {
    logger.info('Project controller, update WorkItem has been hit');
    try {
      let user = req.user;
      let projectId = req.params.projectId;
      let buildingId = req.params.buildingId;
      let costHeadId = parseInt(req.params.costHeadId);
      let categoryId = parseInt(req.params.categoryId);
      let workItemId = parseInt(req.params.workItemId);
      let workItemActiveStatus = req.params.activeStatus === 'true' ? true : false;
      let projectService: ProjectService = new ProjectService();
      projectService.setWorkItemStatus( buildingId, costHeadId, categoryId,workItemId, workItemActiveStatus, user,(error, result) => {
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

 // Update WorkItem Status Of Project CostHeads
  updateWorkItemStatusOfProjectCostHeads(req: express.Request, res: express.Response, next: any): void {
    logger.info('Project controller, Update WorkItem Status Of Project Cost Heads has been hit');
    try {
      let user = req.user;
      let projectId = req.params.projectId;
      let costHeadId = parseInt(req.params.costHeadId);
      let categoryId = parseInt(req.params.categoryId);
      let workItemId = parseInt(req.params.workItemId);
      let workItemActiveStatus = req.params.activeStatus === 'true' ? true : false;
      let projectService: ProjectService = new ProjectService();
      projectService.updateWorkItemStatusOfProjectCostHeads( projectId, costHeadId, categoryId,workItemId,
        workItemActiveStatus, user,(error, result) => {
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

  addCostHeadBuilding(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Project controller, addCostHeadBuilding has been hit');
      let user = req.user;
      let buildingId = req.params.buildingId;
      let costHeadDetails = <CostHead> req.body;
      let projectService = new ProjectService();
      let query = {$push: { costHead : costHeadDetails}};
      projectService.updateBuildingById( buildingId, query, user, (error, result) => {
        if(error) {
          next(error);
        } else {
          logger.info('Add CostHead Building success');
          logger.debug('Added CostHead for Building ID : '+buildingId);
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  updateQuantity(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Project controller, updateQuantity has been hit');
      let user = req.user;
      let projectId = req.params.projectId;
      let buildingId = req.params.buildingId;
      let costHeadId = req.params.costHeadId;
      let categoryId =req.params.categoryId;
      let workItemId = req.params.workItemId;
      let quantity = req.body.item;
      let projectService = new ProjectService();
      projectService.updateQuantity( projectId, buildingId, costHeadId, categoryId, workItemId, quantity, user, (error, result) => {
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

  updateQuantityOfProjectCostHeads(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Project controller, updateQuantity has been hit');
      let user = req.user;
      let projectId = req.params.projectId;
      let costHeadId = parseInt(req.params.costHeadId);
      let categoryId = parseInt(req.params.categoryId);
      let workItemId = parseInt(req.params.workItemId);
      let quantity = req.body.item;
      let projectService = new ProjectService();
      projectService.updateQuantityOfProjectCostHeads( projectId, costHeadId, categoryId, workItemId, quantity, user, (error, result) => {
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

  getWorkitemList(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('getWorkitemList has been hit');
      let user = req.user;
      let projectId = req.params.projectId;
      let buildingId = req.params.buildingId;
      let costHeadId = req.params.costHeadId;
      let categoryId = parseInt(req.params.categoryId);
      let projectService = new ProjectService();
      projectService.getWorkitemList(projectId, buildingId, costHeadId, categoryId, user, (error, result) => {
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
  getActiveCategories(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Project controller, Get Active Categories has been hit');
      let user = req.user;
      let projectId = req.params.projectId;
      let buildingId = req.params.buildingId;
      let costHeadId = parseInt(req.params.costHeadId);
      let projectService = new ProjectService();
      projectService.getActiveCategories(projectId, buildingId, costHeadId, user, (error, result) => {
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
}
export  = ProjectController;
