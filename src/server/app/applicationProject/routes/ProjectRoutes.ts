import express = require('express');
import ProjectController = require('./../controllers/ProjectController');
import AuthInterceptor = require('./../../framework/interceptor/auth.interceptor');
import LoggerInterceptor = require('./../../framework/interceptor/LoggerInterceptor');
import { Inject } from 'typescript-ioc';
import RequestInterceptor = require('../interceptor/request/RequestInterceptor');
import ResponseInterceptor = require('../interceptor/response/ResponseInterceptor');

var router = express.Router();

class ProjectRoutes {
  private _projectController: ProjectController;
  private authInterceptor: AuthInterceptor;
  private loggerInterceptor: LoggerInterceptor;
  @Inject
  private _requestInterceptor: RequestInterceptor;
  @Inject
  private _responseInterceptor: ResponseInterceptor;

  constructor () {
    this._projectController = new ProjectController();
    this.authInterceptor = new AuthInterceptor();
  }
  get routes () : express.Router {

    var controller = this._projectController;

    /*.....Project-Routes.....*/

    //Create new project
    router.post('/',this.authInterceptor.requiresAuth, this._requestInterceptor.intercept, controller.create,
      this._responseInterceptor.exit);
    //Retrive details of project
    router.get('/:projectId', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept, controller.getProject,
      this._responseInterceptor.exit);
    //Update project details
    router.put('/:projectId', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
      controller.updateProjectDetails, this._responseInterceptor.exit);



   /*.....Building-Routes.....*/

   //Create new building
    router.post('/:projectId/building', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
      controller.addBuilding, this._responseInterceptor.exit);
    //Retrive details of building
    router.get('/:projectId/building/:buildingId', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
      controller.getBuilding, this._responseInterceptor.exit);
    //Update building details
    router.put('/:projectId/building/:buildingId',this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
      controller.updateBuilding, this._responseInterceptor.exit);
    //Delete a building
    router.delete('/:projectId/building/:buildingId', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
      controller.deleteBuilding, this._responseInterceptor.exit);

    /*Building- Routes: Building Clone*/

    //Retrive details of building for cloning
    router.get('/:projectId/building/:buildingId/clone', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
      controller.getBuildingDetailsForClone, this._responseInterceptor.exit);
    //Update details of cloned building
    router.put('/:projectId/building/:buildingId/clone',this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
      controller.cloneBuilding, this._responseInterceptor.exit);

     /*Building- Routes: CostHead*/

    //Add and remove a costhead by setting status of costhead to true and false
    router.put('/:projectId/building/:buildingId/costhead/:costHeadId/activeStatus/:activeStatus', this.authInterceptor.requiresAuth,
      this._requestInterceptor.intercept, controller.setBuildingCostHeadStatus, this._responseInterceptor.exit);
    //Retrive list of inactive costheads
    router.get('/:projectId/building/:buildingId/costhead', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
      controller.getInActiveCostHead, this._responseInterceptor.exit);
    //Add new costhead in building
    router.put('/building/:buildingId/costhead', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
      controller.addCostHeadBuilding, this._responseInterceptor.exit);
    //Update budgeted cost for costhead
    router.put('/:projectId/building/:buildingId/costhead',this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
      controller.updateBudgetedCostForCostHead, this._responseInterceptor.exit);

    /*Building- Routes: SubCategory*/

    //Retrive subcategories for particular costhead
    router.get('/:projectId/building/:buildingId/costhead/:costHeadId/subcategory', this.authInterceptor.requiresAuth,
      this._requestInterceptor.intercept, controller.getSubcategory, this._responseInterceptor.exit);
    //Provide list of subcategories from RateAnalysis
    router.get('/:projectId/building/:buildingId/costhead/:costHeadId/subcategorylist', this.authInterceptor.requiresAuth,
      this._requestInterceptor.intercept, controller.getSubcategoryByCostHeadId, this._responseInterceptor.exit);
    //Add subcategory to costhead
    router.post('/:projectId/building/:buildingId/costhead/:costHeadId/subcategory', this.authInterceptor.requiresAuth,
      this._requestInterceptor.intercept, controller.addSubcategoryToCostHeadId, this._responseInterceptor.exit);
    //Delete subcategory from costhead
    router.put('/:projectId/building/:buildingId/costhead/:costHeadId/subcategory', this.authInterceptor.requiresAuth,
      this._requestInterceptor.intercept, controller.deleteSubcategoryFromCostHead, this._responseInterceptor.exit);

    /*Building- Routes: WorkItem*/

    //Provide workitemlist for particular subcategory
    router.get('/:projectId/building/:buildingId/costhead/:costHeadId/subcategory/:subCategoryId/workitemlist',
      this.authInterceptor.requiresAuth, this._requestInterceptor.intercept, controller.getWorkitemList,  this._responseInterceptor.exit);
    //Add worktitem to subcategory
    router.post('/:projectId/building/:buildingId/costhead/:costHeadId/subcategory/:subCategoryId/workitem',
      this.authInterceptor.requiresAuth, this._requestInterceptor.intercept, controller.addWorkitem,
      this._responseInterceptor.exit);
    //Delete workitem from subcategory
    router.delete('/:projectId/building/:buildingId/costhead/:costHeadId/subcategory/:subCategoryId/workitem/:workItemId',
      this.authInterceptor.requiresAuth, this._requestInterceptor.intercept, controller.deleteWorkitem, this._responseInterceptor.exit);

    /*Building- Routes: Quantity*/

    //Add quantityitem in quantity
    router.put('/:projectId/building/:buildingId/costhead/:costHeadId/subcategory/:subCategoryId/workitem/:workItemId/quantity',
      this.authInterceptor.requiresAuth, this._requestInterceptor.intercept, controller.updateQuantity, this._responseInterceptor.exit);
    //Delete quantityitem from  quantity
    router.post('/:projectId/building/:buildingId/costhead/:costHeadId/subcategory/:subCategoryId/workitem/:workItemId/quantity/item',
      this.authInterceptor.requiresAuth, this._requestInterceptor.intercept, controller.deleteQuantity, this._responseInterceptor.exit);

    /*Building- Routes: Rate*/

    //Retrive rate from RateAnalysis for workitem
    router.get('/:projectId/building/:buildingId/rate/costhead/:costHeadId/subcategory/:subCategoryId/workitem/:workItemId',
      this.authInterceptor.requiresAuth, this._requestInterceptor.intercept, controller.getRate, this._responseInterceptor.exit);
    //Update rate of workitem
    router.put('/:projectId/building/:buildingId/rate/costhead/:costHeadId/subcategory/:subCategoryId/workitem/:workItemId',
      this.authInterceptor.requiresAuth, this._requestInterceptor.intercept, controller.updateRate, this._responseInterceptor.exit);
    return router;
  }
}

Object.seal(ProjectRoutes);
export = ProjectRoutes;
