import * as express from 'express';
import ProjectService = require('./../services/ProjectService');
import Project = require('../dataaccess/mongoose/Project');
import Building = require('../dataaccess/mongoose/Building');
import Response = require('../interceptor/response/Response');
import CostControllException = require('../exception/CostControllException');
import CostHead = require('../dataaccess/model/CostHead');
import QuantityItem = require('../dataaccess/model/QuantityItem');
import Quantity = require('../dataaccess/model/Quantity');
let config = require('config');

class ProjectController {
  private _projectService : ProjectService;

  constructor() {
    this._projectService = new ProjectService();
  }

  create(req: express.Request, res: express.Response, next: any): void {
    try {
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
          next(new Response(200,result));
        }
      });
    } catch (e)  {
      next(new CostControllException(e.message,e.stack));
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
            next(new Response(200,result));
          }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
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
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  addBuilding(req: express.Request, res: express.Response, next: any): void {
    try {
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
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  updateBuilding(req: express.Request, res: express.Response, next: any): void {
    try {
      let user = req.user;
      //let projectId = req.params.id;
      let buildingId = req.params.buildingid;
      let buildingDetails = <Building> req.body;
      let projectService = new ProjectService();
      projectService.updateBuilding( buildingId, buildingDetails, user, (error, result) => {
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

  cloneBuilding(req: express.Request, res: express.Response, next: any): void {
    try {
      let user = req.user;
      //let projectId = req.params.id;
      let buildingId = req.params.buildingid;
      let buildingDetails = <Building> req.body;
      let projectService = new ProjectService();
      projectService.cloneBuildingDetails( buildingId, buildingDetails, user, (error, result) => {
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

  getBuilding(req: express.Request, res: express.Response, next: any): void {
    try {
      let user = req.user;
      let projectId = req.params.id;
      let buildingId = req.params.buildingid;
      let projectService = new ProjectService();
      projectService.getBuilding(projectId, buildingId, user, (error, result) => {
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

  getBuildingDetailsForClone(req: express.Request, res: express.Response, next: any): void {
    try {
      let user = req.user;
      let projectId = req.params.id;
      let buildingId = req.params.buildingid;
      let projectService = new ProjectService();
      projectService.getClonedBuilding(projectId, buildingId, user, (error, result) => {
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

  getInActiveCostHead(req:express.Request, res: express.Response, next: any): void {
    try {
      let user = req.user;
      let projectId = req.params.id;
      let buildingId = req.params.buildingid;
      let projectService = new ProjectService();
      projectService.getInActiveCostHead(projectId, buildingId, user, (error, result) => {
        if (error) {
          next(error);
        } else {
          next(new Response(200, result));
        }
      });
    } catch (e) {
      next(new CostControllException(e.message, e.stack));
    }
  }
  deleteBuilding(req: express.Request, res: express.Response, next: any): void {
    try {
      let user = req.user;
      let projectId = req.params.id;
      let buildingId = req.params.buildingid;
      let projectService = new ProjectService();
      projectService.deleteBuilding(projectId, buildingId, user, (error, result) => {
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

  getQuantity(req: express.Request, res: express.Response, next: any): void {
    try {
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
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  getRate(req: express.Request, res: express.Response, next: any): void {
    try {
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
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  deleteQuantity(req: express.Request, res: express.Response, next: any): void {
    try {
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
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  deleteWorkitem(req: express.Request, res: express.Response, next: any): void {
    try {
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
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  getBuildingCostHeadDetails(req: express.Request, res: express.Response, next: any): void {
    try {
      let projectService = new ProjectService();
      let user = req.user;
      let projectId =  req.params.id;
      let buildingId =  req.params.buildingid;
      let costHead =  req.params.costhead;

      projectService.getReportCostHeadDetails(buildingId, costHead,  user, (error, result) => {
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

  updateBuildingCostHead(req: express.Request, res: express.Response, next: any): void {
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
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  addCostHeadBuilding(req: express.Request, res: express.Response, next: any): void {
    try {
      let user = req.user;
      let buildingId = req.params.buildingid;
      let costHeadDetails = <CostHead> req.body;
      let projectService = new ProjectService();
      let query = {$push: { costHead : costHeadDetails}};
      projectService.updateBuilding( buildingId, query, user, (error, result) => {
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

  createQuantity(req: express.Request, res: express.Response, next: any): void {
    try {
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
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }

  updateQuantity(req: express.Request, res: express.Response, next: any): void {
    try {
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
          next(new Response(200,result));
        }
      });
    } catch(e) {
      next(new CostControllException(e.message,e.stack));
    }
  }
}
export  = ProjectController;
