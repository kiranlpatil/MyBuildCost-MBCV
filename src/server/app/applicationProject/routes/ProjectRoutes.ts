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
    var validator = this._projectInterceptor;

    /*.....Project-Routes.....*/

    //Create new project
    router.post('/',this.authInterceptor.requiresAuth, this._requestInterceptor.intercept, validator.createProject,
    controller.createProject, this._responseInterceptor.exit);

    //update projectStatus
    router.put('/:projectId/activeStatus/:activeStatus', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
      validator.updateProjectStatus, controller.updateProjectStatus, this._responseInterceptor.exit);

    //Retrive details of project
    router.get('/:projectId', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
        validator.getProjectById, controller.getProjectById, this._responseInterceptor.exit);
    //Update project details
    router.put('/:projectId', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
      validator.updateProjectById, controller.updateProjectById, this._responseInterceptor.exit);

    //Update project Name
    router.put('/:projectId/projectName', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
      validator.updateProjectNameById, controller.updateProjectNameById, this._responseInterceptor.exit);

    //Fetch rateItem names having same original name
    router.put('/:projectId/rates/rateItem', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
      validator.getProjectRateItemsByOriginalName, controller.getProjectRateItemsByOriginalName, this._responseInterceptor.exit);

    router.get('/:projectId/costhead', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
      controller.getInActiveProjectCostHeads, this._responseInterceptor.exit);

    router.put('/:projectId/costhead/:costHeadId/activeStatus/:activeStatus', this.authInterceptor.requiresAuth,
      this._requestInterceptor.intercept, controller.setProjectCostHeadStatus, this._responseInterceptor.exit);

    /*Project- Routes: Category*/

    //Retrive details of particular costhead from Project
    router.get('/:projectId/costhead/:costHeadId', this.authInterceptor.requiresAuth,
      this._requestInterceptor.intercept, validator.getCategoriesOfProjectCostHead, controller.getCategoriesOfProjectCostHead,
      this._responseInterceptor.exit);

    //Retrive categories for particular costhead
    router.get('/:projectId/costhead/:costHeadId/category', this.authInterceptor.requiresAuth,
      this._requestInterceptor.intercept, validator.getCategoriesOfProjectCostHead, controller.getCategoriesOfProjectCostHead,
      this._responseInterceptor.exit);

    /*Project- Routes: WorkItem*/

    //Provide workitemlist for particular category
    router.get('/:projectId/costhead/:costHeadId/category/:categoryId/workitemlist', this.authInterceptor.requiresAuth,
      this._requestInterceptor.intercept, validator.getWorkItemListOfProjectCategory,
      controller.getWorkItemListOfProjectCategory,  this._responseInterceptor.exit);


    ///Add and remove a costhead by setting status of workitems to true and false
    router.put('/:projectId/costhead/:costHeadId/category/:categoryId/workitem/:workItemId/activestatus/:activeStatus',
      this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
      validator.updateWorkItemStatusOfProjectCostHeads, controller.updateWorkItemStatusOfProjectCostHeads,
      this._responseInterceptor.exit);

    //Retrieve list of inactive workitems
    router.get('/:projectId/costhead/:costHeadId/category/:categoryId/workitem',
      this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
      validator.getInActiveWorkItemsOfProjectCostHeads, controller.getInActiveWorkItemsOfProjectCostHeads,
      this._responseInterceptor.exit);

    /*Project- Routes: Quantity*/

    //Add quantityitem in quantity
    router.put('/:projectId/costhead/:costHeadId/category/:categoryId/workitem/:workItemId/quantity',
      this.authInterceptor.requiresAuth, this._requestInterceptor.intercept, validator.updateQuantityOfProjectCostHeads,
      controller.updateQuantityOfProjectCostHeads, this._responseInterceptor.exit);

    //ToDo : delete api after testing
    //Delete quantityitem from  quantity    //delete this API
    router.put('/:projectId/costhead/:costHeadId/category/:categoryId/workitem/:workItemId/quantity/item',
      this.authInterceptor.requiresAuth, this._requestInterceptor.intercept, validator.deleteQuantityOfProjectCostHeadsByName,
      controller.deleteQuantityOfProjectCostHeadsByName, this._responseInterceptor.exit);

    //update direct quantity and floor name of Project
    router.put('/:projectId/costhead/:costHeadId/category/:categoryId/workitem/:workItemId/directQuantity/quantityItemDetails',
      this.authInterceptor.requiresAuth, this._requestInterceptor.intercept, validator.updateQuantityOfProjectCostHeads,
      controller.updateQuantityDetailsOfProject, this._responseInterceptor.exit);

    /*Project- Routes: Rate*/

    //Update rate of workitem
    router.put('/:projectId/rate/costhead/:costHeadId/category/:categoryId/workitem/:workItemId',
      this.authInterceptor.requiresAuth, this._requestInterceptor.intercept, validator.updateRateOfProjectCostHeads,
      controller.updateRateOfProjectCostHeads, this._responseInterceptor.exit);

    //Update DirectRate  of workItem
    router.put('/:projectId/costhead/:costHeadId/category/:categoryId/workitem/:workItemId/direct/rate',
      this.authInterceptor.requiresAuth, this._requestInterceptor.intercept, validator.updateDirectRateOfProjectWorkItems,
      controller.updateDirectRateOfProjectWorkItems, this._responseInterceptor.exit);

    /* Attachment Routes */

    //update file in workItem
    router.put('/:projectId/costhead/:costHeadId/category/:categoryId/workitem/:workItemId/uploadFile',
      this.authInterceptor.requiresAuth, this._requestInterceptor.intercept, validator.addAttachmentToProjectWorkItem,
      controller.addAttachmentToProjectWorkItem, this._responseInterceptor.exit);

    //Retrive all present files from workItem
    router.get('/:projectId/costhead/:costHeadId/category/:categoryId/workitem/:workItemId/fileNameList',
      this.authInterceptor.requiresAuth, this._requestInterceptor.intercept, validator.checkPresentFilesForProjectWorkItem,
      controller.getPresentFilesForProjectWorkItem, this._responseInterceptor.exit);

    //remove attached file from workItem
    router.put('/:projectId/costhead/:costHeadId/category/:categoryId/workitem/:workItemId/deleteFile',
      this.authInterceptor.requiresAuth, validator.checkPresentFilesForProjectWorkItem,
      controller.removeAttachmentOfProjectWorkItem, this._responseInterceptor.exit);




    /*.....Building-Routes.....*/

   //Create new building
    router.post('/:projectId/building', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
      validator.createBuilding, controller.createBuilding, this._responseInterceptor.exit);

    //Retrive details of building
    router.get('/:projectId/building/:buildingId', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
      validator.getBuildingById, controller.getBuildingById, this._responseInterceptor.exit);

    //Update building details
    router.put('/:projectId/building/:buildingId',this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
     validator.updateBuildingById, controller.updateBuildingById, this._responseInterceptor.exit);

    //Delete a building
    router.delete('/:projectId/building/:buildingId', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
     validator.deleteBuildingById, controller.deleteBuildingById, this._responseInterceptor.exit);

    //Fetch rateItem names having same original name
    router.put('/:projectId/building/:buildingId/rates/rateItem', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
     validator.getBuildingRateItemsByOriginalName, controller.getBuildingRateItemsByOriginalName, this._responseInterceptor.exit);

    /*Building- Routes: Building Clone*/

    //Retrive details of building for cloning
    router.get('/:projectId/building/:buildingId/clone', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
     validator.getBuildingByIdForClone, controller.getBuildingByIdForClone, this._responseInterceptor.exit);

    //Update details of cloned building
    router.put('/:projectId/building/:buildingId/clone',this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
      validator.cloneBuilding,controller.cloneBuilding, this._responseInterceptor.exit);

     /*Building- Routes: CostHead*/

    //Add and remove a costhead by setting status of costhead to true and false
    router.put('/:projectId/building/:buildingId/costhead/:costHeadId/activeStatus/:activeStatus', this.authInterceptor.requiresAuth,
this._requestInterceptor.intercept, validator.setCostHeadStatus, controller.setCostHeadStatus, this._responseInterceptor.exit);

    //Retrive list of inactive costheads
    router.get('/:projectId/building/:buildingId/costhead', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
      validator.getInActiveCostHead, controller.getInActiveCostHead, this._responseInterceptor.exit);

    //Retrive details of particular costhead from Project
    router.get('/:projectId/building/:buildingId/costhead/:costHeadId', this.authInterceptor.requiresAuth,
      this._requestInterceptor.intercept, validator.getCategoriesOfBuildingCostHead, controller.getCostHeadDetailsOfBuilding,
      this._responseInterceptor.exit);

    //Update budgeted cost for costhead
    router.put('/:projectId/building/:buildingId/costhead',this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
     validator.updateBudgetedCostForBuildingCostHead, controller.updateBudgetedCostForCostHead, this._responseInterceptor.exit);

    router.put('/:projectId/costhead/budgetedCost',this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
      validator.updateBudgetedCostForProjectCostHead, controller.updateBudgetedCostForProjectCostHead, this._responseInterceptor.exit);

    /*Building- Routes: Category*/

    //Retrive categories for particular costhead
    router.get('/:projectId/building/:buildingId/costhead/:costHeadId/category', this.authInterceptor.requiresAuth,
      this._requestInterceptor.intercept, validator.getCategoriesOfBuildingCostHead, controller.getCategoriesOfBuildingCostHead, this._responseInterceptor.exit);

    //Provide list of categories from Database
    router.get('/:projectId/building/:buildingId/costhead/:costHeadId/categorylist', this.authInterceptor.requiresAuth,
      this._requestInterceptor.intercept, validator.getInActiveCategoriesByCostHeadId, controller.getInActiveCategoriesByCostHeadId,
      this._responseInterceptor.exit);

    //Add category to costhead
    router.post('/:projectId/building/:buildingId/costhead/:costHeadId/category', this.authInterceptor.requiresAuth,
    this._requestInterceptor.intercept,validator.addCategoryByCostHeadId, controller.addCategoryByCostHeadId,
      this._responseInterceptor.exit);

    ////Add and remove a category by setting status of category to true and false
    router.put('/:projectId/building/:buildingId/costhead/:costHeadId/category/:categoryId/activeStatus/:activeStatus',
      this.authInterceptor.requiresAuth, this._requestInterceptor.intercept, validator.updateCategoryStatus,controller.updateCategoryStatus,
      this._responseInterceptor.exit);

    /*Building- Routes: WorkItem*/
    ///Add and remove a costhead by setting status of workitems to true and false
    router.put('/:projectId/building/:buildingId/costhead/:costHeadId/category/:categoryId/workitem/:workItemId/activeStatus/:activeStatus', this.authInterceptor.requiresAuth,
      this._requestInterceptor.intercept, validator.updateWorkItemStatusOfBuildingCostHeads, controller.updateWorkItemStatusOfBuildingCostHeads, this._responseInterceptor.exit);

    //Retrieve list of inactive workitems
    router.get('/:projectId/building/:buildingId/costhead/:costHeadId/category/:categoryId/workitem',
      this.authInterceptor.requiresAuth, this._requestInterceptor.intercept, validator.getInActiveWorkItemsOfBuildingCostHeads,
      controller.getInActiveWorkItemsOfBuildingCostHeads,  this._responseInterceptor.exit);

    //Provide workitemlist for particular category
    router.get('/:projectId/building/:buildingId/costhead/:costHeadId/category/:categoryId/workitemlist',
    this.authInterceptor.requiresAuth, this._requestInterceptor.intercept, validator.getWorkItemListOfBuildingCategory,
      controller.getWorkItemListOfBuildingCategory,  this._responseInterceptor.exit);

    //Add worktitem to category-----delete API
    router.post('/:projectId/building/:buildingId/costhead/:costHeadId/category/:categoryId/workitem',
      this.authInterceptor.requiresAuth, this._requestInterceptor.intercept, controller.addWorkitem,
      this._responseInterceptor.exit);

    //Delete workitem from category-----delete API
    router.delete('/:projectId/building/:buildingId/costhead/:costHeadId/category/:categoryId/workitem/:workItemId',
this.authInterceptor.requiresAuth, this._requestInterceptor.intercept, controller.deleteWorkitem, this._responseInterceptor.exit);

    /*Building- Routes: Quantity*/

    //Add quantityitem in quantity
    router.put('/:projectId/building/:buildingId/costhead/:costHeadId/category/:categoryId/workitem/:workItemId/quantity',
      this.authInterceptor.requiresAuth, this._requestInterceptor.intercept, validator.updateQuantityOfBuildingCostHeads,
      controller.updateQuantityOfBuildingCostHeads, this._responseInterceptor.exit);

    //update direct quantity Building
    router.put('/:projectId/building/:buildingId/costhead/:costHeadId/category/:categoryId/workitem/:workItemId/direct/quantity',
      this.authInterceptor.requiresAuth, this._requestInterceptor.intercept, validator.updateDirectQuantityOfBuildingCostHeads,
      controller.updateDirectQuantityOfBuildingWorkItems, this._responseInterceptor.exit);

    //update direct quantity Project
    router.put('/:projectId/costhead/:costHeadId/category/:categoryId/workitem/:workItemId/direct/quantity',
      this.authInterceptor.requiresAuth, this._requestInterceptor.intercept, validator.updateDirectQuantityOfProjectWorkItems,
      controller.updateDirectQuantityOfProjectWorkItems, this._responseInterceptor.exit);

    //update direct quantity and floor name of quantity Details
    router.put('/:projectId/building/:buildingId/costhead/:costHeadId/category/:categoryId/workitem/:workItemId/directQuantity/quantityItemDetails',
      this.authInterceptor.requiresAuth, this._requestInterceptor.intercept, validator.updateQuantityOfBuildingCostHeads,
      controller.updateQuantityDetailsOfBuilding, this._responseInterceptor.exit);


    //Delete quantityitem from  quantity
    router.put('/:projectId/building/:buildingId/costhead/:costHeadId/category/:categoryId/workitem/:workItemId/quantity/item',
      this.authInterceptor.requiresAuth, this._requestInterceptor.intercept, validator.deleteQuantityOfBuildingCostHeadsByName,
      controller.deleteQuantityOfBuildingCostHeadsByName, this._responseInterceptor.exit);

    /*Building- Routes: Rate*/

    //Retrive rate from RateAnalysis for workitem  -- delete this API
    router.get('/:projectId/building/:buildingId/rate/costhead/:costHeadId/category/:categoryId/workitem/:workItemId',
      this.authInterceptor.requiresAuth, this._requestInterceptor.intercept, validator.getRate, controller.getRate, this._responseInterceptor.exit);
    //Update rate of workitem
    router.put('/:projectId/building/:buildingId/rate/costhead/:costHeadId/category/:categoryId/workitem/:workItemId',
      this.authInterceptor.requiresAuth, this._requestInterceptor.intercept, validator.updateRateOfBuildingCostHeads,
      controller.updateRateOfBuildingCostHeads, this._responseInterceptor.exit);

    //Update DirectRate  of workItem
    router.put('/:projectId/building/:buildingId/costhead/:costHeadId/category/:categoryId/workitem/:workItemId/direct/rate',
      this.authInterceptor.requiresAuth, this._requestInterceptor.intercept, validator.updateDirectRateOfBuildingWorkItems,
      controller.updateDirectRateOfBuildingWorkItems, this._responseInterceptor.exit);


    /*Building- Routes: Rate Analysis Communication*/

    //sync building with rate Analysis data
    router.get('/:projectId/building/:buildingId/syncWithRateAnalysis', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
      validator.syncProjectWithRateAnalysisData, controller.syncProjectWithRateAnalysisData, this._responseInterceptor.exit);

    /* Attachment Routes */

    //update file in workItem
    router.put('/:projectId/building/:buildingId/costhead/:costHeadId/category/:categoryId/workitem/:workItemId/uploadFile',
      this.authInterceptor.requiresAuth, this._requestInterceptor.intercept, validator.addAttachmentToBuildingWorkItem,
      controller.addAttachmentToBuildingWorkItem, this._responseInterceptor.exit);

    //Retrive all present files from workItem
    router.get('/:projectId/building/:buildingId/costhead/:costHeadId/category/:categoryId/workitem/:workItemId/fileNameList',
      this.authInterceptor.requiresAuth, this._requestInterceptor.intercept, validator.checkPresentFilesForBuildingWorkItem,
      controller.getPresentFilesForBuildingWorkItem, this._responseInterceptor.exit);

    //remove attached file from workItem
    router.put('/:projectId/building/:buildingId/costhead/:costHeadId/category/:categoryId/workitem/:workItemId/deleteFile',
      this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,validator.checkPresentFilesForBuildingWorkItem,
      controller.removeAttachmentOfBuildingWorkItem,this._responseInterceptor.exit);


    return router;
  }
}

Object.seal(ProjectRoutes);
export = ProjectRoutes;
