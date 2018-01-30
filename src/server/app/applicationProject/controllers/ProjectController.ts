import * as express from 'express';
import ProjectService = require('./../services/ProjectService');
import Project = require('../dataaccess/mongoose/Project');
import Building = require('../dataaccess/mongoose/Building');
import Response = require('../interceptor/response/Response');
import CostControllException = require('../exception/CostControllException');
import CostHead = require('../dataaccess/model/CostHead');
import QuantityItem = require('../dataaccess/model/QuantityItem');
import Quantity = require('../dataaccess/model/Quantity');
import Rate = require('../dataaccess/model/Rate');
let config = require('config');
var log4js = require('log4js');
var logger=log4js.getLogger('Project Controller');


class ProjectController {
  private _projectService : ProjectService;

  constructor() {
    this._projectService = new ProjectService();

  }

  create(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Project controller create has been hit');
      let data =  <Project>req.body;
      let user = req.user;

      let defaultCategory = config.get('category.default');
      let defaultRates = config.get('rate.default');
      data.costHead = defaultCategory;
      data.rate = defaultRates;

      let projectService = new ProjectService();
      projectService.create(data, user,(error, result) => {
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


  getProject(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Project controller getProject has been hit');
      let projectService = new ProjectService();
      let user = req.user;
      let projectId =  req.params.id;
      projectService.getProject(projectId, user, (error, result) => {
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

  updateProjectDetails(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Project controller, updateProjectDetails has been hit');
      let projectDetail = <Project>req.body;
      projectDetail['_id'] = req.params.id;
      let user = req.user;
      let projectService = new ProjectService();
      projectService.updateProjectDetails(projectDetail, user, (error, result)=> {
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

  addBuilding(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Project controller, addBuilding has been hit');
      let user = req.user;
      let projectId = req.params.id;
      let buildingDetails = <Building> req.body;

      let defaultCategory = config.get('category.default');
      buildingDetails.costHead = defaultCategory;

      let projectService = new ProjectService();
      projectService.addBuilding(projectId, buildingDetails, user, (error, result) => {
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

  updateBuilding(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Project controller, updateBuilding has been hit');
      let user = req.user;
      //let projectId = req.params.id;
      let buildingId = req.params.buildingid;
      let buildingDetails = <Building> req.body;
      let projectService = new ProjectService();
      projectService.updateBuilding( buildingId, buildingDetails, user, (error, result) => {
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
      //let projectId = req.params.id;
      let buildingId = req.params.buildingid;
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

  getBuilding(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Project controller, getBuilding has been hit');
      let user = req.user;
      let projectId = req.params.id;
      let buildingId = req.params.buildingid;
      let projectService = new ProjectService();
      projectService.getBuilding(projectId, buildingId, user, (error, result) => {
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

  getBuildingDetailsForClone(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Project controller, getBuildingDetailsForClone has been hit');
      let user = req.user;
      let projectId = req.params.id;
      let buildingId = req.params.buildingid;
      let projectService = new ProjectService();
      projectService.getClonedBuilding(projectId, buildingId, user, (error, result) => {
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
      let projectId = req.params.id;
      let buildingId = req.params.buildingid;
      let projectService = new ProjectService();
      projectService.getInActiveCostHead(projectId, buildingId, user, (error, result) => {
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
  deleteBuilding(req: express.Request, res: express.Response, next: any): void {
    logger.info('Project controller, deleteBuilding has been hit');
    try {
      let user = req.user;
      let projectId = req.params.id;
      let buildingId = req.params.buildingid;
      let projectService = new ProjectService();
      projectService.deleteBuilding(projectId, buildingId, user, (error, result) => {
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

  getQuantity(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Project controller, getQuantity has been hit');
      let user = req.user;
      let projectId = req.params.id;
      let buildingId = req.params.buildingid;
      let costhead = req.params.costhead;
      let workitem = req.params.workitem;
      let projectService = new ProjectService();
      console.log(' workitem => '+ workitem);
      projectService.getQuantity(projectId, buildingId, costhead, workitem, user, (error, result) => {
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

  getRate(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Project controller, getRate has been hit');
      let user = req.user;
      let projectId = req.params.id;
      let buildingId = req.params.buildingid;
      let costhead = req.params.costhead;
      let workitem = req.params.workitem;
      let projectService = new ProjectService();
      console.log(' workitem => '+ workitem);
      projectService.getRate(projectId, buildingId, costhead, workitem, user, (error, result) => {
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
      let projectId = req.params.id;
      let buildingId = req.params.buildingid;
      let costhead = req.params.costhead;
      let workitem = req.params.workitem;
      let rate : Rate = <Rate> req.body.data;
      let projectService = new ProjectService();
      console.log(' workitem => '+ workitem);
      projectService.updateRate(projectId, buildingId, costhead, workitem, rate, user, (error, result) => {
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

  deleteQuantity(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Project controller, deleteQuantity has been hit');
      let user = req.user;
      let projectId = req.params.id;
      let buildingId = req.params.buildingid;
      let costhead = req.params.costhead;
      let workitem = req.params.workitem;
      let item = req.params.item;
      let projectService = new ProjectService();
      console.log(' workitem => '+ workitem);
      projectService.deleteQuantity(projectId, buildingId, costhead, workitem, item, user, (error, result) => {
        if(error) {
          next(error);
        } else {
          logger.info('Delete Quantity '+result);
          logger.debug('Deleted Quantity of Project ID : '+projectId+', Building ID : '+buildingId+
            ', CostHead : '+costhead+', Workitem : '+workitem+', Item : '+item);
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  deleteWorkitem(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Project controller, deleteWorkitem has been hit');
      let user = req.user;
      let projectId = req.params.id;
      let buildingId = req.params.buildingid;
      let costhead = req.params.costhead;
      let workitem = req.params.workitem;
      let projectService = new ProjectService();
      console.log(' workitem => '+ workitem);
      projectService.deleteWorkitem(projectId, buildingId, costhead, workitem, user, (error, result) => {
        if(error) {
          next(error);
        } else {
          logger.info('Delete work item '+result.data);
          logger.debug('Deleted  work item of Project ID : '+projectId+', Building ID : '+buildingId+
            ', CostHead : '+costhead+', Workitem : '+workitem);
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  getBuildingCostHeadDetails(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Project controller, deleteWorkitem has been hit');
      let projectService = new ProjectService();
      let user = req.user;
      let projectId =  req.params.id;
      let buildingId =  req.params.buildingid;
      let costHead =  req.params.costhead;

      projectService.getReportCostHeadDetails(buildingId, costHead,  user, (error, result) => {
        if(error) {
          next(error);
        } else {
          logger.info('Get Report Cost Head Details success');
          logger.debug('Get Report Cost Head Details for Building ID : '+buildingId+
            ', CostHead : '+costHead);
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  updateBuildingCostHead(req: express.Request, res: express.Response, next: any): void {
    logger.info('Project controller, updateBuildingCostHead has been hit');
    try {
      let projectService = new ProjectService();
      let user = req.user;
      let projectId =  req.params.id;
      let buildingId =  req.params.buildingid;
      let costHead =  req.params.costhead;
      let costHeadValue =  req.params.value;

      projectService.updateBuildingCostHead(buildingId, costHead, costHeadValue, user,(error, result) => {
        if(error) {
          next(error);
        } else {
          logger.info('Update Building CostHead Details success ');
          logger.debug('updateBuildingCostHead for Project ID : '+projectId+', Building ID : '+buildingId+
            ', CostHead : '+costHead);
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
      let projectId =  req.params.id;
      let buildingId =  req.params.buildingid;
      let costHead =  req.params.costhead;
      let costHeadBudgetedAmountEdited =  req.body;

      projectService.updateBudgetedCostForCostHead(buildingId, costHead, costHeadBudgetedAmountEdited, user,(error, result) => {
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
      let buildingId = req.params.buildingid;
      let costHeadDetails = <CostHead> req.body;
      let projectService = new ProjectService();
      let query = {$push: { costHead : costHeadDetails}};
      projectService.updateBuilding( buildingId, query, user, (error, result) => {
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

  createQuantity(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Project controller, createQuantity has been hit');
      let user = req.user;
      let projectId = req.params.id;
      let buildingId = req.params.buildingid;
      let costhead = req.params.costhead;
      let workitem = req.params.workitem;
      let quantity = <QuantityItem> req.body;
      let projectService = new ProjectService();
      projectService.createQuantity(projectId, buildingId, costhead, workitem, quantity, user, (error, result) => {
        if(error) {
          next(error);
        } else {
          logger.info('Create Quantity '+result);
          logger.debug('Quantity Created for Project ID : '+projectId+', Building ID : '+buildingId+
            ', CostHead : '+costhead+', Workitem : '+workitem+', Quantity : '+quantity);
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
      let projectId = req.params.id;
      let buildingId = req.params.buildingid;
      let costhead = req.params.costhead;
      let workitem = req.params.workitem;
      let quantity = req.body as Array<QuantityItem>;
      let projectService = new ProjectService();
      projectService.updateQuantity(projectId, buildingId, costhead, workitem, quantity, user, (error, result) => {
        if(error) {
          next(error);
        } else {
          logger.info('Update Quantity success');
          logger.debug('Quantity Updated for Project ID : '+projectId+', Building ID : '+buildingId+
            ', CostHead : '+costhead+', Workitem : '+workitem+', Quantity : '+quantity);
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  getSubcategoryByCostHeadId(req: express.Request, res: express.Response, next: any): void {
    try {
      logger.info('Project controller, getSubcategoryByCostHeadId has been hit');
      let user = req.user;
      let projectId = req.params.id;
      let buildingId = req.params.buildingid;
      let costhead = req.params.costheadId;

      let projectService = new ProjectService();

      projectService.getAllSubcategoriesByCostHeadId(projectId, buildingId, costhead, user, (error, result) => {
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

}
export  = ProjectController;
