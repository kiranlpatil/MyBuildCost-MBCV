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
    router.post('/',this.authInterceptor.requiresAuth, this._requestInterceptor.intercept, controller.create,
      this._responseInterceptor.exit);
    router.get('/:id', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept, controller.getProject,
      this._responseInterceptor.exit);
    router.put('/:id', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
      controller.updateProjectDetails, this._responseInterceptor.exit);
    router.post('/:id/building', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
      controller.addBuilding, this._responseInterceptor.exit);
    router.put('/:id/building/:buildingid',this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
      controller.updateBuilding, this._responseInterceptor.exit);
    router.get('/:id/building/:buildingid', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
      controller.getBuilding, this._responseInterceptor.exit);
    router.get('/:id/building/:buildingid/costhead', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
      controller.getInActiveCostHead, this._responseInterceptor.exit);
    router.get('/:id/building/:buildingid/clone', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
      controller.getBuildingDetailsForClone, this._responseInterceptor.exit);
    router.put('/:id/building/:buildingid/clone',this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
      controller.cloneBuilding, this._responseInterceptor.exit);
    router.delete('/:id/building/:buildingid', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
      controller.deleteBuilding, this._responseInterceptor.exit);
    router.get('/:id/building/:buildingid/quantity/costhead/:costhead/workitem/:workitem', this.authInterceptor.requiresAuth,
      this._requestInterceptor.intercept, controller.getQuantity, this._responseInterceptor.exit);
    router.get('/:id/building/:buildingid/rate/costhead/:costhead/workitem/:workitem', this.authInterceptor.requiresAuth,
      this._requestInterceptor.intercept, controller.getRate, this._responseInterceptor.exit);
    router.delete('/:id/building/:buildingid/quantity/costhead/:costhead/workitem/:workitem/item/:item', this.authInterceptor.requiresAuth,
      this._requestInterceptor.intercept, controller.deleteQuantity, this._responseInterceptor.exit);
    router.delete('/:id/building/:buildingid/costhead/:costhead/workitem/:workitem', this.authInterceptor.requiresAuth,
      this._requestInterceptor.intercept, controller.deleteWorkitem, this._responseInterceptor.exit);
    router.get('/:id/building/:buildingid/costhead/:costhead', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
      controller.getBuildingCostHeadDetails, this._responseInterceptor.exit);
    router.put('/:id/building/:buildingid/costhead/:costhead', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
      controller.deleteBuildingCostHead, this._responseInterceptor.exit);
    router.put('/building/:buildingid/costhead', this.authInterceptor.requiresAuth, this._requestInterceptor.intercept,
      controller.addCostHeadBuilding, this._responseInterceptor.exit);
    router.post('/:id/building/:buildingid/costhead/:costhead/workitem/:workitem/quantity', this.authInterceptor.requiresAuth,
      this._requestInterceptor.intercept, controller.createQuantity, this._responseInterceptor.exit);
    router.put('/:id/building/:buildingid/costhead/:costhead/workitem/:workitem/quantity', this.authInterceptor.requiresAuth,
      this._requestInterceptor.intercept, controller.updateQuantity, this._responseInterceptor.exit);
    return router;
  }
}

Object.seal(ProjectRoutes);
export = ProjectRoutes;
