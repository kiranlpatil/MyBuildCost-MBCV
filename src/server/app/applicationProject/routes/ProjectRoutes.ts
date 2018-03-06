import express = require('express');
import ProjectController = require('./../controllers/ProjectController');
import AuthInterceptor = require('./../../framework/interceptor/auth.interceptor');
import LoggerInterceptor = require('./../../framework/interceptor/LoggerInterceptor');
import { Inject } from 'typescript-ioc';
import RequestInterceptor = require('../interceptor/request/RequestInterceptor');
import ResponseInterceptor = require('../interceptor/response/ResponseInterceptor');
import ProjectInterceptor = require('../interceptor/request/validation/ProjectInterceptor');

var router = express.Router();

class ProjectRoutes {
  private _projectController: ProjectController;
  private authInterceptor: AuthInterceptor;
  private _projectInterceptor : ProjectInterceptor;
  private loggerInterceptor: LoggerInterceptor;
  @Inject
  private _requestInterceptor: RequestInterceptor;
  @Inject
  private _responseInterceptor: ResponseInterceptor;

  constructor () {
    this._projectController = new ProjectController();
    this.authInterceptor = new AuthInterceptor();
    this._projectInterceptor = new ProjectInterceptor();
  }

  get routes () : express.Router {

    var controller = this._projectController;
    var interceptor = this._projectInterceptor;

    /*.....Project-Routes.....*/

    //Create new project
    router.post('/',this.authInterceptor.requiresAuth, this._requestInterceptor.intercept, interceptor.createProject,
    controller.createProject, this._responseInterceptor.exit);
    //Retrive details of project
    router.get('/:projectId', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
        interceptor.getProjectById, controller.getProjectById, this._responseInterceptor.exit);
    //Update project details
    router.put('/:projectId', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
      interceptor.updateProjectById, controller.updateProjectById, this._responseInterceptor.exit);


/*.....Building-Routes.....*/

   //Create new building
    router.post('/:projectId/building', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
      interceptor.createBuilding, controller.createBuilding, this._responseInterceptor.exit);
    //Retrive details of building
    router.get('/:projectId/building/:buildingId', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
      interceptor.getBuildingById, controller.getBuildingById, this._responseInterceptor.exit);
    //Update building details
    router.put('/:projectId/building/:buildingId',this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
     interceptor.updateBuildingById, controller.updateBuildingById, this._responseInterceptor.exit);
    //Delete a building
    router.delete('/:projectId/building/:buildingId', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
     interceptor.deleteBuildingById, controller.deleteBuildingById, this._responseInterceptor.exit);

    /*Building- Routes: Building Clone*/

    //Retrive details of building for cloning
    router.get('/:projectId/building/:buildingId/clone', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
     interceptor.getBuildingByIdForClone, controller.getBuildingByIdForClone, this._responseInterceptor.exit);
    //Update details of cloned building
    router.put('/:projectId/building/:buildingId/clone',this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
      controller.cloneBuildingById, this._responseInterceptor.exit);

     /*Building- Routes: CostHead*/

    //Add and remove a costhead by setting status of costhead to true and false
    router.put('/:projectId/building/:buildingId/costhead/:costHeadId/activeStatus/:activeStatus', this.authInterceptor.requiresAuth,
this._requestInterceptor.intercept, interceptor.setCostHeadStatus, controller.setCostHeadStatus, this._responseInterceptor.exit);
    //Retrive list of inactive costheads
    router.get('/:projectId/building/:buildingId/costhead', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
      interceptor.getInActiveCostHead, controller.getInActiveCostHead, this._responseInterceptor.exit);
    //Add new costhead in building
    router.put('/building/:buildingId/costhead', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
      controller.addCostHeadBuilding, this._responseInterceptor.exit);
    //Update budgeted cost for costhead
    router.put('/:projectId/building/:buildingId/costhead',this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
     interceptor.updateBudgetedCostForCostHead, controller.updateBudgetedCostForCostHead, this._responseInterceptor.exit);

    /*Building- Routes: SubCategory*/

    //Retrive subcategories for particular costhead
    router.get('/:projectId/building/:buildingId/costhead/:costHeadId/subcategory', this.authInterceptor.requiresAuth,
      this._requestInterceptor.intercept, interceptor.getSubCategory, controller.getSubCategory, this._responseInterceptor.exit);
    //Provide list of subcategories from RateAnalysis
    router.get('/:projectId/building/:buildingId/costhead/:costHeadId/subcategorylist', this.authInterceptor.requiresAuth,this._requestInterceptor.intercept,
      interceptor.getAllSubCategoriesByCostHeadId, controller.getAllSubCategoriesByCostHeadId, this._responseInterceptor.exit);
    //Add subcategory to costhead
    router.post('/:projectId/building/:buildingId/costhead/:costHeadId/subcategory', this.authInterceptor.requiresAuth,
    this._requestInterceptor.intercept,interceptor.addSubCategoryByCostHeadId, controller.addSubCategoryByCostHeadId, this._responseInterceptor.exit);
    //Delete subcategory from costhead
    router.put('/:projectId/building/:buildingId/costhead/:costHeadId/subcategory', this.authInterceptor.requiresAuth,
      this._requestInterceptor.intercept, interceptor.deleteSubcategoryFromCostHead, controller.deleteSubcategoryFromCostHead, this._responseInterceptor.exit);

    /*Building- Routes: WorkItem*/
    ///Add and remove a costhead by setting status of workitems to true and false
    router.put('/:projectId/building/:buildingId/costhead/:costHeadId/subcategory/:subCategoryId/workitem/:workItemId/activeStatus/:activeStatus', this.authInterceptor.requiresAuth,
      this._requestInterceptor.intercept, interceptor.setWorkItemStatus, controller.setWorkItemStatus, this._responseInterceptor.exit);

    //Retrive list of inactive workitems
    router.get('/:projectId/building/:buildingId/costhead/:costHeadId/subcategory/:subCategoryId/workitem',
      this.authInterceptor.requiresAuth, this._requestInterceptor.intercept, interceptor.getInactiveWorkItems, controller.getInactiveWorkItems,  this._responseInterceptor.exit);

    //Provide workitemlist for particular subcategory-----delete API
    router.get('/:projectId/building/:buildingId/costhead/:costHeadId/subcategory/:subCategoryId/workitemlist',
    this.authInterceptor.requiresAuth, this._requestInterceptor.intercept, controller.getWorkitemList,  this._responseInterceptor.exit);
    //Add worktitem to subcategory-----delete API
    router.post('/:projectId/building/:buildingId/costhead/:costHeadId/subcategory/:subCategoryId/workitem',
      this.authInterceptor.requiresAuth, this._requestInterceptor.intercept, controller.addWorkitem,
      this._responseInterceptor.exit);
    //Delete workitem from subcategory-----delete API
    router.delete('/:projectId/building/:buildingId/costhead/:costHeadId/subcategory/:subCategoryId/workitem/:workItemId',
this.authInterceptor.requiresAuth, this._requestInterceptor.intercept, controller.deleteWorkitem, this._responseInterceptor.exit);

    /*Building- Routes: Quantity*/

    //Add quantityitem in quantity
    router.put('/:projectId/building/:buildingId/costhead/:costHeadId/subcategory/:subCategoryId/workitem/:workItemId/quantity',
      this.authInterceptor.requiresAuth, this._requestInterceptor.intercept, interceptor.updateQuantity, controller.updateQuantity, this._responseInterceptor.exit);
    //Delete quantityitem from  quantity
    router.post('/:projectId/building/:buildingId/costhead/:costHeadId/subcategory/:subCategoryId/workitem/:workItemId/quantity/item',
      this.authInterceptor.requiresAuth, this._requestInterceptor.intercept, interceptor.deleteQuantityByName, controller.deleteQuantityByName, this._responseInterceptor.exit);

    /*Building- Routes: Rate*/

    //Retrive rate from RateAnalysis for workitem
    router.get('/:projectId/building/:buildingId/rate/costhead/:costHeadId/subcategory/:subCategoryId/workitem/:workItemId',
      this.authInterceptor.requiresAuth, this._requestInterceptor.intercept, interceptor.getRate, controller.getRate, this._responseInterceptor.exit);
    //Update rate of workitem
    router.put('/:projectId/building/:buildingId/rate/costhead/:costHeadId/subcategory/:subCategoryId/workitem/:workItemId',
      this.authInterceptor.requiresAuth, this._requestInterceptor.intercept, interceptor.updateRate, controller.updateRate, this._responseInterceptor.exit);

    /*Building- Routes: Rate Analysis Communication*/

    //sync building with rate Analysis data
    router.get('/:projectId/building/:buildingId/syncRateAnalysis',
      this.authInterceptor.requiresAuth, this._requestInterceptor.intercept, controller.syncBuildingWithRateAnalysisData, this._responseInterceptor.exit);
    return router;
  }
}

Object.seal(ProjectRoutes);
export = ProjectRoutes;
