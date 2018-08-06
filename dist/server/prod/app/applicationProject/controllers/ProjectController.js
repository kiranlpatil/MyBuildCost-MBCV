"use strict";
var ProjectService = require("./../services/ProjectService");
var Response = require("../interceptor/response/Response");
var CostControllException = require("../exception/CostControllException");
var WorkItem = require("../dataaccess/model/project/building/WorkItem");
var config = require('config');
var log4js = require('log4js');
var logger = log4js.getLogger('Project Controller');
var ProjectController = (function () {
    function ProjectController() {
        this._projectService = new ProjectService();
    }
    ProjectController.prototype.createProject = function (req, res, next) {
        try {
            logger.info('Project controller create has been hit');
            var data = req.body;
            var user = req.user;
            var projectService = new ProjectService();
            projectService.createProject(data, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info(' project is created ');
                    next(new Response(200, result));
                }
            });
        }
        catch (e) {
            logger.error(e);
            next(new CostControllException(e.message, e.stack));
        }
    };
    ProjectController.prototype.getProjectById = function (req, res, next) {
        try {
            logger.info('Project controller getProject has been hit');
            var projectService = new ProjectService();
            var user = req.user;
            var projectId_1 = req.params.projectId;
            projectService.getProjectById(projectId_1, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Getting project ' + result.data[0].name);
                    logger.debug('Getting project Project ID : ' + projectId_1 + ', Project Name : ' + result.data[0].name);
                    next(new Response(200, result));
                }
            });
        }
        catch (e) {
            next(new CostControllException(e.message, e.stack));
        }
    };
    ProjectController.prototype.updateProjectById = function (req, res, next) {
        try {
            logger.info('Project controller, updateProjectDetails has been hit');
            var projectDetails = req.body;
            projectDetails['_id'] = req.params.projectId;
            var user = req.user;
            var projectService = new ProjectService();
            projectService.updateProjectById(projectDetails, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Update project ' + result.data.name);
                    logger.debug('Updated Project Name : ' + result.data.name);
                    next(new Response(200, result));
                }
            });
        }
        catch (e) {
            next(new CostControllException(e.message, e.stack));
        }
    };
    ProjectController.prototype.updateProjectStatus = function (req, res, next) {
        try {
            logger.info('Project controller Update Project status has been hit');
            var user = req.user;
            var projectId_2 = req.params.projectId;
            var activeStatus = req.params.activeStatus;
            var projectService = new ProjectService();
            projectService.updateProjectStatus(projectId_2, user, activeStatus, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.debug('Getting project Project ID : ' + projectId_2);
                    next(new Response(200, result));
                }
            });
        }
        catch (e) {
            next(new CostControllException(e.message, e.stack));
        }
    };
    ProjectController.prototype.updateProjectNameById = function (req, res, next) {
        try {
            logger.info('Project controller Update Project Name has been hit');
            var user = req.user;
            var projectId_3 = req.params.projectId;
            var name_1 = req.body.name;
            var projectService = new ProjectService();
            projectService.updateProjectNameById(projectId_3, name_1, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.debug('Getting project Project ID : ' + projectId_3);
                    next(new Response(200, result));
                }
            });
        }
        catch (e) {
            next(new CostControllException(e.message, e.stack));
        }
    };
    ProjectController.prototype.getInActiveProjectCostHeads = function (req, res, next) {
        try {
            logger.info('Project controller, getInActiveCostHead has been hit');
            var user = req.user;
            var projectId = req.params.projectId;
            var projectService = new ProjectService();
            projectService.getInActiveProjectCostHeads(projectId, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Get InActive CostHead success');
                    next(new Response(200, result));
                }
            });
        }
        catch (e) {
            next(new CostControllException(e.message, e.stack));
        }
    };
    ProjectController.prototype.setProjectCostHeadStatus = function (req, res, next) {
        logger.info('Project controller, setProjectCostHeadStatus has been hit');
        try {
            var projectService = new ProjectService();
            var user = req.user;
            var projectId_4 = req.params.projectId;
            var costHeadId_1 = parseInt(req.params.costHeadId);
            var costHeadActiveStatus_1 = req.params.activeStatus;
            projectService.setProjectCostHeadStatus(projectId_4, costHeadId_1, costHeadActiveStatus_1, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Update setProjectCostHeadStatus success ');
                    logger.debug('setProjectCostHeadStatus for Project ID : ' + projectId_4 +
                        ', CostHead : ' + costHeadId_1 + ', costHeadActiveStatus : ' + costHeadActiveStatus_1);
                    next(new Response(200, result));
                }
            });
        }
        catch (e) {
            next(new CostControllException(e.message, e.stack));
        }
    };
    ProjectController.prototype.createBuilding = function (req, res, next) {
        try {
            logger.info('Project controller, addBuilding has been hit');
            var user = req.user;
            var projectId = req.params.projectId;
            var buildingDetails = req.body;
            var projectService = new ProjectService();
            projectService.createBuilding(projectId, buildingDetails, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Add Building ' + result.data._doc.name);
                    logger.debug('Added Building Name : ' + result.data._doc.name);
                    next(new Response(200, result));
                }
            });
        }
        catch (e) {
            next(new CostControllException(e.message, e.stack));
        }
    };
    ProjectController.prototype.updateBuildingById = function (req, res, next) {
        try {
            logger.info('Project controller, updateBuilding has been hit');
            var user = req.user;
            var buildingId = req.params.buildingId;
            var projectId = req.params.projectId;
            var buildingDetails = req.body;
            var projectService = new ProjectService();
            projectService.updateBuildingById(projectId, buildingId, buildingDetails, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Update Building ' + result.data._doc.name);
                    logger.debug('Updated Building Name : ' + result.data._doc.name);
                    next(new Response(200, result));
                }
            });
        }
        catch (e) {
            next(new CostControllException(e.message, e.stack));
        }
    };
    ProjectController.prototype.cloneBuilding = function (req, res, next) {
        try {
            logger.info('Project controller, cloneBuilding has been hit');
            var user = req.user;
            var buildingId = req.params.buildingId;
            var projectId = req.params.projectId;
            var buildingDetails = req.body;
            var projectService = new ProjectService();
            projectService.cloneBuildingDetails(projectId, buildingId, buildingDetails, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Clone Building ' + result.data.name);
                    logger.debug('Cloned Building Name : ' + result.data.name);
                    next(new Response(200, result));
                }
            });
        }
        catch (e) {
            next(new CostControllException(e.message, e.stack));
        }
    };
    ProjectController.prototype.getBuildingById = function (req, res, next) {
        try {
            logger.info('Project controller, getBuilding has been hit');
            var user = req.user;
            var projectId = req.params.projectId;
            var buildingId = req.params.buildingId;
            var projectService = new ProjectService();
            projectService.getBuildingById(projectId, buildingId, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Get Building ' + result.data.name);
                    logger.debug('Get Building Name : ' + result.data.name);
                    next(new Response(200, result));
                }
            });
        }
        catch (e) {
            next(new CostControllException(e.message, e.stack));
        }
    };
    ProjectController.prototype.getBuildingByIdForClone = function (req, res, next) {
        try {
            logger.info('Project controller, getBuildingDetailsForClone has been hit');
            var user = req.user;
            var projectId_5 = req.params.projectId;
            var buildingId_1 = req.params.buildingId;
            var projectService = new ProjectService();
            projectService.getBuildingByIdForClone(projectId_5, buildingId_1, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Get Building details for clone ' + result.data.name);
                    logger.debug(result.data.name + ' Building details for clone ...ProjectID : ' + projectId_5 + ', BuildingID : ' + buildingId_1);
                    next(new Response(200, result));
                }
            });
        }
        catch (e) {
            next(new CostControllException(e.message, e.stack));
        }
    };
    ProjectController.prototype.getInActiveCostHead = function (req, res, next) {
        try {
            logger.info('Project controller, getInActiveCostHead has been hit');
            var user = req.user;
            var projectId = req.params.projectId;
            var buildingId = req.params.buildingId;
            var projectService = new ProjectService();
            projectService.getInActiveCostHead(projectId, buildingId, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Get InActive CostHead success');
                    next(new Response(200, result));
                }
            });
        }
        catch (e) {
            next(new CostControllException(e.message, e.stack));
        }
    };
    ProjectController.prototype.getInActiveWorkItemsOfBuildingCostHeads = function (req, res, next) {
        try {
            logger.info('getInActiveWorkItems has been hit');
            var user = req.user;
            var projectId = req.params.projectId;
            var buildingId = req.params.buildingId;
            var costHeadId = parseInt(req.params.costHeadId);
            var categoryId = parseInt(req.params.categoryId);
            var projectService = new ProjectService();
            projectService.getInActiveWorkItemsOfBuildingCostHeads(projectId, buildingId, costHeadId, categoryId, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Get InActive WorkItem success');
                    next(new Response(200, result));
                }
            });
        }
        catch (e) {
            next(new CostControllException(e.message, e.stack));
        }
    };
    ProjectController.prototype.getInActiveWorkItemsOfProjectCostHeads = function (req, res, next) {
        try {
            logger.info('Project Controller, Get In-Active WorkItems Of Project Cost Heads has been hit');
            var user = req.user;
            var projectId = req.params.projectId;
            var costHeadId = parseInt(req.params.costHeadId);
            var categoryId = parseInt(req.params.categoryId);
            var projectService = new ProjectService();
            projectService.getInActiveWorkItemsOfProjectCostHeads(projectId, costHeadId, categoryId, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Get In-Active WorkItems Of Project Cost Heads success');
                    next(new Response(200, result));
                }
            });
        }
        catch (e) {
            next(new CostControllException(e.message, e.stack));
        }
    };
    ProjectController.prototype.deleteBuildingById = function (req, res, next) {
        logger.info('Project controller, deleteBuilding has been hit');
        try {
            var user = req.user;
            var projectId = req.params.projectId;
            var buildingId = req.params.buildingId;
            var projectService = new ProjectService();
            projectService.deleteBuildingById(projectId, buildingId, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Building Delete from ' + result.data.name + ' project');
                    logger.debug('Building Deleted from ' + result.data.name + ' project');
                    next(new Response(200, result));
                }
            });
        }
        catch (e) {
            next(new CostControllException(e.message, e.stack));
        }
    };
    ProjectController.prototype.getRate = function (req, res, next) {
        try {
            logger.info('Project controller, getRate has been hit');
            var user = req.user;
            var projectId_6 = req.params.projectId;
            var buildingId_2 = req.params.buildingId;
            var costHeadId = parseInt(req.params.costHeadId);
            var categoryId = parseInt(req.params.categoryId);
            var workItemId = parseInt(req.params.workItemId);
            var projectService = new ProjectService();
            console.log(' workitemId => ' + workItemId);
            projectService.getRate(projectId_6, buildingId_2, costHeadId, categoryId, workItemId, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Get Rate Success');
                    logger.debug('Getting Rate of Project ID : ' + projectId_6 + ' Building ID : ' + buildingId_2);
                    next(new Response(200, result));
                }
            });
        }
        catch (e) {
            next(new CostControllException(e.message, e.stack));
        }
    };
    ProjectController.prototype.updateRateOfBuildingCostHeads = function (req, res, next) {
        try {
            var user = req.user;
            var projectId_7 = req.params.projectId;
            var buildingId_3 = req.params.buildingId;
            var costHeadId = parseInt(req.params.costHeadId);
            var categoryId = parseInt(req.params.categoryId);
            var workItemId = parseInt(req.params.workItemId);
            var ccWorkItemId = parseInt(req.params.ccWorkItemId);
            var rate = req.body;
            var projectService = new ProjectService();
            console.log(' workitemId => ' + workItemId);
            projectService.updateRateOfBuildingCostHeads(projectId_7, buildingId_3, costHeadId, categoryId, workItemId, ccWorkItemId, rate, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Get Rate Success');
                    logger.debug('Getting Rate of Project ID : ' + projectId_7 + ' Building ID : ' + buildingId_3);
                    next(new Response(200, result));
                }
            });
        }
        catch (e) {
            next(new CostControllException(e.message, e.stack));
        }
    };
    ProjectController.prototype.updateDirectRateOfBuildingWorkItems = function (req, res, next) {
        try {
            logger.info('Project controller, update DirectRate Of Building WorkItems has been hit');
            var user = req.user;
            var projectId = req.params.projectId;
            var buildingId = req.params.buildingId;
            var costHeadId = parseInt(req.params.costHeadId);
            var categoryId = parseInt(req.params.categoryId);
            var workItemId = parseInt(req.params.workItemId);
            var ccWorkItemId = parseInt(req.params.ccWorkItemId);
            var directRate = req.body.directRate;
            var projectService = new ProjectService();
            projectService.updateDirectRateOfBuildingWorkItems(projectId, buildingId, costHeadId, categoryId, workItemId, ccWorkItemId, directRate, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('update DirectRate Of Building WorkItems success');
                    next(new Response(200, result));
                }
            });
        }
        catch (e) {
            next(new CostControllException(e.message, e.stack));
        }
    };
    ProjectController.prototype.updateRateOfProjectCostHeads = function (req, res, next) {
        try {
            logger.info('Project Controller, Update rate of project cost heads has been hit');
            var user = req.user;
            var projectId_8 = req.params.projectId;
            var costHeadId = parseInt(req.params.costHeadId);
            var categoryId = parseInt(req.params.categoryId);
            var workItemId = parseInt(req.params.workItemId);
            var ccWorkItemId = parseInt(req.params.ccWorkItemId);
            var rate = req.body;
            var projectService = new ProjectService();
            projectService.updateRateOfProjectCostHeads(projectId_8, costHeadId, categoryId, workItemId, ccWorkItemId, rate, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Update rate of project cost heads Success');
                    logger.debug('Update rate of project cost heads of Project ID : ' + projectId_8);
                    next(new Response(200, result));
                }
            });
        }
        catch (e) {
            next(new CostControllException(e.message, e.stack));
        }
    };
    ProjectController.prototype.updateDirectRateOfProjectWorkItems = function (req, res, next) {
        try {
            logger.info('Project Controller,update DirectRate Of Project WorkItems has been hit');
            var user = req.user;
            var projectId_9 = req.params.projectId;
            var costHeadId = parseInt(req.params.costHeadId);
            var categoryId = parseInt(req.params.categoryId);
            var workItemId = parseInt(req.params.workItemId);
            var ccWorkItemId = parseInt(req.params.ccWorkItemId);
            var directRate = req.body.directRate;
            var projectService = new ProjectService();
            projectService.updateDirectRateOfProjectWorkItems(projectId_9, costHeadId, categoryId, workItemId, ccWorkItemId, directRate, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('update DirectRate Of Project WorkItems Success');
                    logger.debug('update DirectRate Of Project WorkItems of Project ID : ' + projectId_9);
                    next(new Response(200, result));
                }
            });
        }
        catch (e) {
            next(new CostControllException(e.message, e.stack));
        }
    };
    ProjectController.prototype.deleteQuantityOfBuildingCostHeadsByName = function (req, res, next) {
        try {
            logger.info('Project controller, deleteQuantity has been hit');
            var user = req.user;
            var projectId_10 = req.params.projectId;
            var buildingId_4 = req.params.buildingId;
            var costHeadId_2 = parseInt(req.params.costHeadId);
            var categoryId = parseInt(req.params.categoryId);
            var workItemId_1 = parseInt(req.params.workItemId);
            var ccWorkItemId = parseInt(req.params.ccWorkItemId);
            var itemName_1 = req.body.item.name;
            var projectservice = new ProjectService();
            projectservice.deleteQuantityOfBuildingCostHeadsByName(projectId_10, buildingId_4, costHeadId_2, categoryId, workItemId_1, ccWorkItemId, itemName_1, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Delete Quantity ' + result);
                    logger.debug('Deleted Quantity of Project ID : ' + projectId_10 + ', Building ID : ' + buildingId_4 +
                        ', CostHead : ' + costHeadId_2 + ', Workitem : ' + workItemId_1 + ', Item : ' + itemName_1);
                    next(new Response(200, result));
                }
            });
        }
        catch (e) {
            next(new CostControllException(e.message, e.stack));
        }
    };
    ProjectController.prototype.deleteQuantityOfProjectCostHeadsByName = function (req, res, next) {
        try {
            logger.info('Project controller, Delete Quantity Of Project Cost Heads By Name has been hit');
            var user = req.user;
            var projectId_11 = req.params.projectId;
            var costHeadId_3 = parseInt(req.params.costHeadId);
            var categoryId = parseInt(req.params.categoryId);
            var workItemId_2 = parseInt(req.params.workItemId);
            var itemName_2 = req.body.item.name;
            var projectService = new ProjectService();
            projectService.deleteQuantityOfProjectCostHeadsByName(projectId_11, costHeadId_3, categoryId, workItemId_2, itemName_2, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Delete Quantity Of Project Cost Heads By Name ' + result);
                    logger.debug('Delete Quantity Of Project Cost Heads By Name of Project ID : ' + projectId_11 + ', CostHead : ' + costHeadId_3 + ', ' +
                        'Workitem : ' + workItemId_2 + ', Item : ' + itemName_2);
                    next(new Response(200, result));
                }
            });
        }
        catch (e) {
            next(new CostControllException(e.message, e.stack));
        }
    };
    ProjectController.prototype.deleteWorkitem = function (req, res, next) {
        try {
            logger.info('Project controller, deleteWorkitem has been hit');
            var user = req.user;
            var projectId_12 = req.params.projectId;
            var buildingId_5 = req.params.buildingId;
            var costHeadId_4 = parseInt(req.params.costHeadId);
            var categoryId_1 = parseInt(req.params.categoryId);
            var workItemId_3 = parseInt(req.params.workItemId);
            var projectService = new ProjectService();
            console.log(' workitem => ' + workItemId_3);
            projectService.deleteWorkitem(projectId_12, buildingId_5, costHeadId_4, categoryId_1, workItemId_3, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Delete work item ' + result.data);
                    logger.debug('Deleted  work item of Project ID : ' + projectId_12 + ', Building ID : ' + buildingId_5 +
                        ', CostHead : ' + costHeadId_4 + ', Category : ' + categoryId_1 + ', Workitem : ' + workItemId_3);
                    next(new Response(200, result));
                }
            });
        }
        catch (e) {
            next(new CostControllException(e.message, e.stack));
        }
    };
    ProjectController.prototype.setCostHeadStatus = function (req, res, next) {
        logger.info('Project controller, updateBuildingCostHead has been hit');
        try {
            var projectService = new ProjectService();
            var user = req.user;
            var projectId_13 = req.params.projectId;
            var buildingId_6 = req.params.buildingId;
            var costHeadId_5 = parseInt(req.params.costHeadId);
            var costHeadActiveStatus_2 = req.params.activeStatus;
            projectService.setCostHeadStatus(buildingId_6, costHeadId_5, costHeadActiveStatus_2, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Update Building CostHead Details success ');
                    logger.debug('updateBuildingCostHead for Project ID : ' + projectId_13 + ', Building ID : ' + buildingId_6 +
                        ', CostHead : ' + costHeadId_5 + ', costHeadActiveStatus : ' + costHeadActiveStatus_2);
                    next(new Response(200, result));
                }
            });
        }
        catch (e) {
            next(new CostControllException(e.message, e.stack));
        }
    };
    ProjectController.prototype.updateWorkItemStatusOfBuildingCostHeads = function (req, res, next) {
        logger.info('Project controller, update WorkItem has been hit');
        try {
            var user = req.user;
            var body = req.body;
            var projectId_14 = req.params.projectId;
            var buildingId_7 = req.params.buildingId;
            var costHeadId_6 = parseInt(req.params.costHeadId);
            var categoryId = parseInt(req.params.categoryId);
            var workItemRAId = parseInt(req.params.workItemRAId);
            var workItemId = parseInt(req.params.workItemId);
            var workItemActiveStatus_1 = JSON.parse(req.params.activeStatus);
            var projectService = new ProjectService();
            projectService.updateWorkItemStatusOfBuildingCostHeads(buildingId_7, costHeadId_6, categoryId, workItemRAId, workItemId, workItemActiveStatus_1, body, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Update workItem Details success ');
                    logger.debug('update WorkItem for Project ID : ' + projectId_14 + ', Building ID : ' + buildingId_7 +
                        ', CostHead : ' + costHeadId_6 + ', workItemActiveStatus : ' + workItemActiveStatus_1);
                    next(new Response(200, result));
                }
            });
        }
        catch (e) {
            next(new CostControllException(e.message, e.stack));
        }
    };
    ProjectController.prototype.updateWorkItemStatusOfProjectCostHeads = function (req, res, next) {
        logger.info('Project controller, Update WorkItem Status Of Project Cost Heads has been hit');
        try {
            var user = req.user;
            var body = req.body;
            var projectId_15 = req.params.projectId;
            var costHeadId_7 = parseInt(req.params.costHeadId);
            var categoryId = parseInt(req.params.categoryId);
            var workItemId = parseInt(req.params.workItemId);
            var ccWorkItemId = parseInt(req.params.ccWorkItemId);
            var workItemActiveStatus_2 = JSON.parse(req.params.activeStatus);
            var projectService = new ProjectService();
            projectService.updateWorkItemStatusOfProjectCostHeads(projectId_15, costHeadId_7, categoryId, workItemId, ccWorkItemId, workItemActiveStatus_2, body, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Update WorkItem Status Of Project Cost Heads success ');
                    logger.debug('Update WorkItem Status Of Project Cost Heads for Project ID : ' + projectId_15 + ' CostHead : ' + costHeadId_7 + ', ' +
                        'workItemActiveStatus : ' + workItemActiveStatus_2);
                    next(new Response(200, result));
                }
            });
        }
        catch (e) {
            next(new CostControllException(e.message, e.stack));
        }
    };
    ProjectController.prototype.updateBudgetedCostForCostHead = function (req, res, next) {
        try {
            var projectService = new ProjectService();
            var user = req.user;
            var projectId = req.params.projectId;
            var buildingId = req.params.buildingId;
            var costHeadBudgetedAmount = req.body;
            projectService.updateBudgetedCostForCostHead(buildingId, costHeadBudgetedAmount, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    next(new Response(200, result));
                }
            });
        }
        catch (e) {
            next(new CostControllException(e.message, e.stack));
        }
    };
    ProjectController.prototype.updateBudgetedCostForProjectCostHead = function (req, res, next) {
        try {
            var projectService = new ProjectService();
            var user = req.user;
            var projectId = req.params.projectId;
            var costHeadBudgetedAmount = req.body;
            projectService.updateBudgetedCostForProjectCostHead(projectId, costHeadBudgetedAmount, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    next(new Response(200, result));
                }
            });
        }
        catch (e) {
            next(new CostControllException(e.message, e.stack));
        }
    };
    ProjectController.prototype.updateQuantityOfBuildingCostHeads = function (req, res, next) {
        try {
            logger.info('Project controller, updateQuantity has been hit');
            var user = req.user;
            var projectId = req.params.projectId;
            var buildingId = req.params.buildingId;
            var costHeadId = parseInt(req.params.costHeadId);
            var categoryId = parseInt(req.params.categoryId);
            var workItemId = parseInt(req.params.workItemId);
            var ccWorkItemId = parseInt(req.params.ccWorkItemId);
            var quantityDetails = req.body.item;
            var projectService = new ProjectService();
            projectService.updateQuantityOfBuildingCostHeads(projectId, buildingId, costHeadId, categoryId, workItemId, ccWorkItemId, quantityDetails, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Update Quantity success');
                    next(new Response(200, result));
                }
            });
        }
        catch (e) {
            next(new CostControllException(e.message, e.stack));
        }
    };
    ProjectController.prototype.updateDirectQuantityOfBuildingWorkItems = function (req, res, next) {
        try {
            logger.info('Project controller, updateDirectQuantityOfBuildingCostHeads has been hit');
            var user = req.user;
            var projectId = req.params.projectId;
            var buildingId = req.params.buildingId;
            var costHeadId = parseInt(req.params.costHeadId);
            var categoryId = parseInt(req.params.categoryId);
            var workItemId = parseInt(req.params.workItemId);
            var ccWorkItemId = parseInt(req.params.ccWorkItemId);
            var directQuantity = req.body.directQuantity;
            var projectService = new ProjectService();
            projectService.updateDirectQuantityOfBuildingWorkItems(projectId, buildingId, costHeadId, categoryId, workItemId, ccWorkItemId, directQuantity, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('updateDirectQuantityOfBuildingCostHeads success');
                    next(new Response(200, result));
                }
            });
        }
        catch (e) {
            next(new CostControllException(e.message, e.stack));
        }
    };
    ProjectController.prototype.updateDirectQuantityOfProjectWorkItems = function (req, res, next) {
        try {
            logger.info('Project controller, updateDirectQuantityOfBuildingCostHeads has been hit');
            var user = req.user;
            var projectId = req.params.projectId;
            var costHeadId = parseInt(req.params.costHeadId);
            var categoryId = parseInt(req.params.categoryId);
            var workItemId = parseInt(req.params.workItemId);
            var ccWorkItemId = parseInt(req.params.ccWorkItemId);
            var directQuantity = req.body.directQuantity;
            var projectService = new ProjectService();
            projectService.updateDirectQuantityOfProjectWorkItems(projectId, costHeadId, categoryId, workItemId, ccWorkItemId, directQuantity, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('updateDirectQuantityOfProjectWorkItems success');
                    next(new Response(200, result));
                }
            });
        }
        catch (e) {
            next(new CostControllException(e.message, e.stack));
        }
    };
    ProjectController.prototype.updateQuantityDetailsOfBuilding = function (req, res, next) {
        try {
            logger.info('Project controller, update DirectQuantity Of BuildingQuantityItems has been hit');
            var user = req.user;
            var projectId = req.params.projectId;
            var buildingId = req.params.buildingId;
            var costHeadId = parseInt(req.params.costHeadId);
            var categoryId = parseInt(req.params.categoryId);
            var workItemId = parseInt(req.params.workItemId);
            var ccWorkItemId = parseInt(req.params.ccWorkItemId);
            var quantityDetailsObj = req.body.item;
            var projectService = new ProjectService();
            projectService.updateQuantityDetailsOfBuilding(projectId, buildingId, costHeadId, categoryId, workItemId, ccWorkItemId, quantityDetailsObj, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('update DirectQuantity Of BuildingQuantityItems success');
                    next(new Response(200, result));
                }
            });
        }
        catch (e) {
            next(new CostControllException(e.message, e.stack));
        }
    };
    ProjectController.prototype.updateQuantityDetailsOfProject = function (req, res, next) {
        try {
            logger.info('Project controller, update DirectQuantity Of BuildingQuantityItems has been hit');
            var user = req.user;
            var projectId = req.params.projectId;
            var costHeadId = parseInt(req.params.costHeadId);
            var categoryId = parseInt(req.params.categoryId);
            var workItemId = parseInt(req.params.workItemId);
            var ccWorkItemId = parseInt(req.params.ccWorkItemId);
            var quantityDetailsObj = req.body.item;
            var projectService = new ProjectService();
            projectService.updateQuantityDetailsOfProject(projectId, costHeadId, categoryId, workItemId, ccWorkItemId, quantityDetailsObj, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('update DirectQuantity Of BuildingQuantityItems success');
                    next(new Response(200, result));
                }
            });
        }
        catch (e) {
            next(new CostControllException(e.message, e.stack));
        }
    };
    ProjectController.prototype.updateQuantityOfProjectCostHeads = function (req, res, next) {
        try {
            logger.info('Project controller, Update Quantity Of Project Cost Heads has been hit');
            var user = req.user;
            var projectId = req.params.projectId;
            var costHeadId = parseInt(req.params.costHeadId);
            var categoryId = parseInt(req.params.categoryId);
            var workItemId = parseInt(req.params.workItemId);
            var ccWorkItemId = parseInt(req.params.ccWorkItemId);
            var quantityDetails = req.body.item;
            var projectService = new ProjectService();
            projectService.updateQuantityOfProjectCostHeads(projectId, costHeadId, categoryId, workItemId, ccWorkItemId, quantityDetails, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Update Quantity Of Project Cost Heads success');
                    next(new Response(200, result));
                }
            });
        }
        catch (e) {
            next(new CostControllException(e.message, e.stack));
        }
    };
    ProjectController.prototype.getInActiveCategoriesByCostHeadId = function (req, res, next) {
        try {
            logger.info('Project controller, getCategoryByCostHeadId has been hit');
            var user = req.user;
            var projectId_16 = req.params.projectId;
            var buildingId_8 = req.params.buildingId;
            var costHeadId = req.params.costHeadId;
            var projectService = new ProjectService();
            projectService.getInActiveCategoriesByCostHeadId(projectId_16, buildingId_8, costHeadId, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Get Category By CostHeadId success');
                    logger.debug('Get Category By CostHeadId of Project ID : ' + projectId_16 + ' Building ID : ' + buildingId_8);
                    next(new Response(200, result));
                }
            });
        }
        catch (e) {
            next(new CostControllException(e.message, e.stack));
        }
    };
    ProjectController.prototype.getWorkItemListOfBuildingCategory = function (req, res, next) {
        try {
            logger.info('getWorkitemList has been hit');
            var user = req.user;
            var projectId = req.params.projectId;
            var buildingId = req.params.buildingId;
            var costHeadId = parseInt(req.params.costHeadId);
            var categoryId = parseInt(req.params.categoryId);
            var projectService = new ProjectService();
            projectService.getWorkItemListOfBuildingCategory(projectId, buildingId, costHeadId, categoryId, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    next(new Response(200, result));
                }
            });
        }
        catch (e) {
            next(new CostControllException(e.message, e.stack));
        }
    };
    ProjectController.prototype.getWorkItemListOfProjectCategory = function (req, res, next) {
        try {
            logger.info('getWorkitemListOfProjectCostHead has been hit');
            var user = req.user;
            var projectId = req.params.projectId;
            var costHeadId = parseInt(req.params.costHeadId);
            var categoryId = parseInt(req.params.categoryId);
            var projectService = new ProjectService();
            projectService.getWorkItemListOfProjectCategory(projectId, costHeadId, categoryId, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    next(new Response(200, result));
                }
            });
        }
        catch (e) {
            next(new CostControllException(e.message, e.stack));
        }
    };
    ProjectController.prototype.addWorkitem = function (req, res, next) {
        try {
            logger.info('addWorkitem has been hit');
            var user = req.user;
            var projectId = req.params.projectId;
            var buildingId = req.params.buildingId;
            var costHeadId = parseInt(req.params.costHeadId);
            var categoryId = parseInt(req.params.categoryId);
            var workItem = new WorkItem(req.body.name, req.body.rateAnalysisId);
            var projectService = new ProjectService();
            projectService.addWorkitem(projectId, buildingId, costHeadId, categoryId, workItem, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    next(new Response(200, result));
                }
            });
        }
        catch (e) {
            next(new CostControllException(e.message, e.stack));
        }
    };
    ProjectController.prototype.addCategoryByCostHeadId = function (req, res, next) {
        try {
            logger.info('Project controller, addCategoryByCostHeadId has been hit');
            var user = req.user;
            var projectId_17 = req.params.projectId;
            var buildingId_9 = req.params.buildingId;
            var costHeadId = req.params.costHeadId;
            var categoryDetails = req.body;
            var projectService = new ProjectService();
            projectService.addCategoryByCostHeadId(projectId_17, buildingId_9, costHeadId, categoryDetails, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Get Quantity success');
                    logger.debug('Getting Quantity of Project ID : ' + projectId_17 + ' Building ID : ' + buildingId_9);
                    next(new Response(200, result));
                }
            });
        }
        catch (e) {
            next(new CostControllException(e.message, e.stack));
        }
    };
    ProjectController.prototype.getCategoriesOfBuildingCostHead = function (req, res, next) {
        try {
            logger.info('Project controller, Get Active Categories has been hit');
            var user = req.user;
            var projectId = req.params.projectId;
            var buildingId = req.params.buildingId;
            var costHeadId = parseInt(req.params.costHeadId);
            var projectService = new ProjectService();
            projectService.getCategoriesOfBuildingCostHead(projectId, buildingId, costHeadId, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    next(new Response(200, result));
                }
            });
        }
        catch (e) {
            next(new CostControllException(e.message, e.stack));
        }
    };
    ProjectController.prototype.getCategoriesOfProjectCostHead = function (req, res, next) {
        try {
            logger.info('Project controller, Get Project CostHead Categories has been hit');
            var user = req.user;
            var projectId = req.params.projectId;
            var costHeadId = parseInt(req.params.costHeadId);
            var projectService = new ProjectService();
            projectService.getCategoriesOfProjectCostHead(projectId, costHeadId, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    next(new Response(200, result));
                }
            });
        }
        catch (e) {
            next(new CostControllException(e.message, e.stack));
        }
    };
    ProjectController.prototype.getCostHeadDetailsOfBuilding = function (req, res, next) {
        try {
            logger.info('Project controller, Get Project CostHead Categories has been hit');
            var user = req.user;
            var projectId = req.params.projectId;
            var buildingId = req.params.buildingId;
            var costHeadId = parseInt(req.params.costHeadId);
            var projectService = new ProjectService();
            projectService.getCostHeadDetailsOfBuilding(projectId, buildingId, costHeadId, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    next(new Response(200, result));
                }
            });
        }
        catch (e) {
            next(new CostControllException(e.message, e.stack));
        }
    };
    ProjectController.prototype.updateCategoryStatus = function (req, res, next) {
        try {
            logger.info('Project controller, update Category Status has been hit');
            var user = req.user;
            var projectId_18 = req.params.projectId;
            var buildingId_10 = req.params.buildingId;
            var costHeadId = parseFloat(req.params.costHeadId);
            var categoryId = parseFloat(req.params.categoryId);
            var categoryActiveStatus = req.params.activeStatus === 'true' ? true : false;
            var projectService = new ProjectService();
            projectService.updateCategoryStatus(projectId_18, buildingId_10, costHeadId, categoryId, categoryActiveStatus, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Update Category Status success');
                    logger.debug('Update Category Status success of Project ID : ' + projectId_18 + ' Building ID : ' + buildingId_10);
                    next(new Response(200, result));
                }
            });
        }
        catch (e) {
            next(new CostControllException(e.message, e.stack));
        }
    };
    ProjectController.prototype.syncProjectWithRateAnalysisData = function (req, res, next) {
        try {
            logger.info('Project controller, syncBuildingWithRateAnalysisData has been hit');
            var user = req.user;
            var projectId_19 = req.params.projectId;
            var buildingId_11 = req.params.buildingId;
            var projectService = new ProjectService();
            projectService.syncProjectWithRateAnalysisData(projectId_19, buildingId_11, user, function (error, result) {
                if (error) {
                    logger.error('syncProjectWithRateAnalysisData failure');
                    next(error);
                }
                else {
                    logger.info('syncProjectWithRateAnalysisData success');
                    logger.debug('Getting syncProjectWithRateAnalysisData of Project ID : ' + projectId_19 + ' Building ID : ' + buildingId_11);
                    next(new Response(200, result));
                }
            });
        }
        catch (e) {
            next(new CostControllException(e.message, e.stack));
        }
    };
    ProjectController.prototype.getBuildingRateItemsByOriginalName = function (req, res, next) {
        try {
            logger.info('Project controller, getBuildingRateItemsByOriginalName has been hit');
            var user = req.user;
            var projectId_20 = req.params.projectId;
            var buildingId_12 = req.params.buildingId;
            var originalRateItemName = req.body.originalRateItemName;
            var projectService = new ProjectService();
            projectService.getBuildingRateItemsByOriginalName(projectId_20, buildingId_12, originalRateItemName, user, function (error, result) {
                if (error) {
                    logger.error('getBuildingRateItemsByOriginalName failure');
                    next(error);
                }
                else {
                    logger.info('getBuildingRateItemsByOriginalName success');
                    logger.debug('Getting getBuildingRateItemsByOriginalName of Project ID : ' + projectId_20 + ' Building ID : ' + buildingId_12);
                    next(new Response(200, result));
                }
            });
        }
        catch (e) {
            next(new CostControllException(e.message, e.stack));
        }
    };
    ProjectController.prototype.getProjectRateItemsByOriginalName = function (req, res, next) {
        try {
            logger.info('Project controller, getProjectRateItemsByName has been hit');
            var user = req.user;
            var projectId_21 = req.params.projectId;
            var originalRateItemName = req.body.originalRateItemName;
            var projectService = new ProjectService();
            projectService.getProjectRateItemsByOriginalName(projectId_21, originalRateItemName, user, function (error, result) {
                if (error) {
                    logger.error('getProjectRateItemsByOriginalName failure');
                    next(error);
                }
                else {
                    logger.info('getProjectRateItemsByOriginalName success');
                    logger.debug('Getting getProjectRateItemsByOriginalName of Project ID : ' + projectId_21);
                    next(new Response(200, result));
                }
            });
        }
        catch (e) {
            next(new CostControllException(e.message, e.stack));
        }
    };
    ProjectController.prototype.addAttachmentToBuildingWorkItem = function (req, res, next) {
        try {
            var projectService = new ProjectService();
            var projectId = req.params.projectId;
            var buildingId = req.params.buildingId;
            var costHeadId = parseInt(req.params.costHeadId);
            var categoryId = parseInt(req.params.categoryId);
            var workItemId = parseInt(req.params.workItemId);
            var ccWorkItemId = parseInt(req.params.ccWorkItemId);
            var fileData = req;
            projectService.addAttachmentToWorkItem(projectId, buildingId, costHeadId, categoryId, workItemId, ccWorkItemId, fileData, function (error, response) {
                if (error) {
                    next(error);
                }
                else {
                    res.status(200).send({ response: response });
                }
            });
        }
        catch (e) {
            next({
                reason: e.message,
                message: e.message,
                stackTrace: e,
                code: 403
            });
        }
    };
    ProjectController.prototype.getPresentFilesForBuildingWorkItem = function (req, res, next) {
        try {
            var projectService = new ProjectService();
            var projectId = req.params.projectId;
            var buildingId = req.params.buildingId;
            var costHeadId = parseInt(req.params.costHeadId);
            var categoryId = parseInt(req.params.categoryId);
            var workItemId = parseInt(req.params.workItemId);
            var ccWorkItemId = parseInt(req.params.ccWorkItemId);
            projectService.getPresentFilesForBuildingWorkItem(projectId, buildingId, costHeadId, categoryId, workItemId, ccWorkItemId, function (error, response) {
                if (error) {
                    next(error);
                }
                else {
                    res.status(200).send({ response: response });
                }
            });
        }
        catch (e) {
            next({
                reason: e.message,
                message: e.message,
                stackTrace: e,
                code: 403
            });
        }
    };
    ProjectController.prototype.removeAttachmentOfBuildingWorkItem = function (req, res, next) {
        try {
            var projectService = new ProjectService();
            var projectId = req.params.projectId;
            var buildingId = req.params.buildingId;
            var costHeadId = parseInt(req.params.costHeadId);
            var categoryId = parseInt(req.params.categoryId);
            var workItemId = parseInt(req.params.workItemId);
            var ccWorkItemId = parseInt(req.params.ccWorkItemId);
            var assignedFileName = req.body.assignedFileName;
            projectService.removeAttachmentOfBuildingWorkItem(projectId, buildingId, costHeadId, categoryId, workItemId, ccWorkItemId, assignedFileName, function (error, response) {
                if (error) {
                    next(error);
                }
                else {
                    res.status(200).send({ response: response });
                }
            });
        }
        catch (e) {
            next({
                reason: e.message,
                message: e.message,
                stackTrace: e,
                code: 403
            });
        }
    };
    ProjectController.prototype.addAttachmentToProjectWorkItem = function (req, res, next) {
        try {
            var projectService = new ProjectService();
            var projectId = req.params.projectId;
            var costHeadId = parseInt(req.params.costHeadId);
            var categoryId = parseInt(req.params.categoryId);
            var workItemId = parseInt(req.params.workItemId);
            var ccWorkItemId = parseInt(req.params.ccWorkItemId);
            var fileData = req;
            projectService.addAttachmentToProjectWorkItem(projectId, costHeadId, categoryId, workItemId, ccWorkItemId, fileData, function (error, response) {
                if (error) {
                    next(error);
                }
                else {
                    res.status(200).send({ response: response });
                }
            });
        }
        catch (e) {
            next({
                reason: e.message,
                message: e.message,
                stackTrace: e,
                code: 403
            });
        }
    };
    ProjectController.prototype.getPresentFilesForProjectWorkItem = function (req, res, next) {
        try {
            var projectService = new ProjectService();
            var projectId = req.params.projectId;
            var costHeadId = parseInt(req.params.costHeadId);
            var categoryId = parseInt(req.params.categoryId);
            var workItemId = parseInt(req.params.workItemId);
            var ccWorkItemId = parseInt(req.params.ccWorkItemId);
            projectService.getPresentFilesForProjectWorkItem(projectId, costHeadId, categoryId, workItemId, ccWorkItemId, function (error, response) {
                if (error) {
                    next(error);
                }
                else {
                    res.status(200).send({ response: response });
                }
            });
        }
        catch (e) {
            next({
                reason: e.message,
                message: e.message,
                stackTrace: e,
                code: 403
            });
        }
    };
    ProjectController.prototype.removeAttachmentOfProjectWorkItem = function (req, res, next) {
        try {
            var projectService = new ProjectService();
            var projectId = req.params.projectId;
            var costHeadId = parseInt(req.params.costHeadId);
            var categoryId = parseInt(req.params.categoryId);
            var workItemId = parseInt(req.params.workItemId);
            var ccWorkItemId = parseInt(req.params.ccWorkItemId);
            var assignedFileName = req.body.assignedFileName;
            projectService.removeAttachmentOfProjectWorkItem(projectId, costHeadId, categoryId, workItemId, ccWorkItemId, assignedFileName, function (error, response) {
                if (error) {
                    next(error);
                }
                else {
                    res.status(200).send({ response: response });
                }
            });
        }
        catch (e) {
            next({
                reason: e.message,
                message: e.message,
                stackTrace: e,
                code: 403
            });
        }
    };
    return ProjectController;
}());
module.exports = ProjectController;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHBsaWNhdGlvblByb2plY3QvY29udHJvbGxlcnMvUHJvamVjdENvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLDZEQUFnRTtBQUdoRSwyREFBOEQ7QUFDOUQsMEVBQTZFO0FBRzdFLHdFQUEyRTtBQUMzRSxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDL0IsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLElBQUksTUFBTSxHQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUdsRDtJQUdFO1FBQ0UsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO0lBRTlDLENBQUM7SUFFRCx5Q0FBYSxHQUFiLFVBQWMsR0FBb0IsRUFBRSxHQUFxQixFQUFFLElBQVM7UUFDbEUsSUFBSSxDQUFDO1lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO1lBQ3RELElBQUksSUFBSSxHQUFhLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFDOUIsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztZQUVwQixJQUFJLGNBQWMsR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO1lBQzFDLGNBQWMsQ0FBQyxhQUFhLENBQUUsSUFBSSxFQUFFLElBQUksRUFBQyxVQUFDLEtBQUssRUFBRSxNQUFNO2dCQUNyRCxFQUFFLENBQUEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUNULElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDZCxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNOLE1BQU0sQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQztvQkFDcEMsSUFBSSxDQUFDLElBQUksUUFBUSxDQUFDLEdBQUcsRUFBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNqQyxDQUFDO1lBQ0gsQ0FB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SUFBSSxDQUFDLENBQUM7b0JBQ04sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBQyxRQUFRLFVBQUEsRUFBQyxDQUFDLENBQUM7Z0JBQ25DLENBQUM7WUFDSCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1gsSUFBSSxDQUFDO2dCQUNILE1BQU0sRUFBRSxDQUFDLENBQUMsT0FBTztnQkFDakIsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPO2dCQUNsQixVQUFVLEVBQUUsQ0FBQztnQkFDYixJQUFJLEVBQUUsR0FBRzthQUNWLENBQUMsQ0FBQztRQUNMLENBQUM7SUFDSCxDQUFDO0lBQ0gsd0JBQUM7QUFBRCxDQXZ3Q0EsQUF1d0NDLElBQUE7QUFDRCxpQkFBVSxpQkFBaUIsQ0FBQyIsImZpbGUiOiJhcHAvYXBwbGljYXRpb25Qcm9qZWN0L2NvbnRyb2xsZXJzL1Byb2plY3RDb250cm9sbGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZXhwcmVzcyBmcm9tICdleHByZXNzJztcclxuaW1wb3J0IFByb2plY3RTZXJ2aWNlID0gcmVxdWlyZSgnLi8uLi9zZXJ2aWNlcy9Qcm9qZWN0U2VydmljZScpO1xyXG5pbXBvcnQgUHJvamVjdCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9uZ29vc2UvUHJvamVjdCcpO1xyXG5pbXBvcnQgQnVpbGRpbmcgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vbmdvb3NlL0J1aWxkaW5nJyk7XHJcbmltcG9ydCBSZXNwb25zZSA9IHJlcXVpcmUoJy4uL2ludGVyY2VwdG9yL3Jlc3BvbnNlL1Jlc3BvbnNlJyk7XHJcbmltcG9ydCBDb3N0Q29udHJvbGxFeGNlcHRpb24gPSByZXF1aXJlKCcuLi9leGNlcHRpb24vQ29zdENvbnRyb2xsRXhjZXB0aW9uJyk7XHJcbmltcG9ydCBDb3N0SGVhZCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9idWlsZGluZy9Db3N0SGVhZCcpO1xyXG5pbXBvcnQgUmF0ZSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9idWlsZGluZy9SYXRlJyk7XHJcbmltcG9ydCBXb3JrSXRlbSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9idWlsZGluZy9Xb3JrSXRlbScpO1xyXG5sZXQgY29uZmlnID0gcmVxdWlyZSgnY29uZmlnJyk7XHJcbmxldCBsb2c0anMgPSByZXF1aXJlKCdsb2c0anMnKTtcclxubGV0IGxvZ2dlcj1sb2c0anMuZ2V0TG9nZ2VyKCdQcm9qZWN0IENvbnRyb2xsZXInKTtcclxuXHJcblxyXG5jbGFzcyBQcm9qZWN0Q29udHJvbGxlciB7XHJcbiAgcHJpdmF0ZSBfcHJvamVjdFNlcnZpY2UgOiBQcm9qZWN0U2VydmljZTtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLl9wcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG5cclxuICB9XHJcblxyXG4gIGNyZWF0ZVByb2plY3QocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBjb250cm9sbGVyIGNyZWF0ZSBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbGV0IGRhdGEgPSAgPFByb2plY3Q+cmVxLmJvZHk7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcblxyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgcHJvamVjdFNlcnZpY2UuY3JlYXRlUHJvamVjdCggZGF0YSwgdXNlciwoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbG9nZ2VyLmluZm8oJyBwcm9qZWN0IGlzIGNyZWF0ZWQgJyk7XHJcbiAgICAgICAgICBuZXh0KG5ldyBSZXNwb25zZSgyMDAscmVzdWx0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2ggKGUpICB7XHJcbiAgICAgIGxvZ2dlci5lcnJvcihlKTtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXRQcm9qZWN0QnlJZChyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IGNvbnRyb2xsZXIgZ2V0UHJvamVjdCBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbGV0IHByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBwcm9qZWN0SWQgPSAgcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLmdldFByb2plY3RCeUlkKHByb2plY3RJZCwgdXNlciwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdHZXR0aW5nIHByb2plY3QgJytyZXN1bHQuZGF0YVswXS5uYW1lKTtcclxuICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnR2V0dGluZyBwcm9qZWN0IFByb2plY3QgSUQgOiAnK3Byb2plY3RJZCsnLCBQcm9qZWN0IE5hbWUgOiAnK3Jlc3VsdC5kYXRhWzBdLm5hbWUpO1xyXG4gICAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLHJlc3VsdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB1cGRhdGVQcm9qZWN0QnlJZChyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IGNvbnRyb2xsZXIsIHVwZGF0ZVByb2plY3REZXRhaWxzIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBsZXQgcHJvamVjdERldGFpbHMgPSA8UHJvamVjdD5yZXEuYm9keTtcclxuICAgICAgcHJvamVjdERldGFpbHNbJ19pZCddID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgICBwcm9qZWN0U2VydmljZS51cGRhdGVQcm9qZWN0QnlJZCggcHJvamVjdERldGFpbHMsIHVzZXIsIChlcnJvciwgcmVzdWx0KT0+IHtcclxuICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdVcGRhdGUgcHJvamVjdCAnK3Jlc3VsdC5kYXRhLm5hbWUpO1xyXG4gICAgICAgICAgbG9nZ2VyLmRlYnVnKCdVcGRhdGVkIFByb2plY3QgTmFtZSA6ICcrcmVzdWx0LmRhdGEubmFtZSk7XHJcbiAgICAgICAgICBuZXh0KG5ldyBSZXNwb25zZSgyMDAscmVzdWx0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICBuZXh0KG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oZS5tZXNzYWdlLGUuc3RhY2spKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHVwZGF0ZVByb2plY3RTdGF0dXMocmVxOmV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OmFueSl7XHJcbiAgICB0cnkge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBjb250cm9sbGVyIFVwZGF0ZSBQcm9qZWN0IHN0YXR1cyBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHByb2plY3RJZCA9ICByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgICAgdmFyIGFjdGl2ZVN0YXR1cyA9IHJlcS5wYXJhbXMuYWN0aXZlU3RhdHVzO1xyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgcHJvamVjdFNlcnZpY2UudXBkYXRlUHJvamVjdFN0YXR1cyhwcm9qZWN0SWQsIHVzZXIsYWN0aXZlU3RhdHVzLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbG9nZ2VyLmRlYnVnKCdHZXR0aW5nIHByb2plY3QgUHJvamVjdCBJRCA6ICcrcHJvamVjdElkKTtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdXBkYXRlUHJvamVjdE5hbWVCeUlkKHJlcTpleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDphbnkpe1xyXG4gICAgdHJ5IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3QgY29udHJvbGxlciBVcGRhdGUgUHJvamVjdCBOYW1lIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcHJvamVjdElkID0gIHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBsZXQgbmFtZSA9IHJlcS5ib2R5Lm5hbWU7XHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgICBwcm9qZWN0U2VydmljZS51cGRhdGVQcm9qZWN0TmFtZUJ5SWQocHJvamVjdElkLCBuYW1lLCB1c2VyLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbG9nZ2VyLmRlYnVnKCdHZXR0aW5nIHByb2plY3QgUHJvamVjdCBJRCA6ICcrcHJvamVjdElkKTtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0SW5BY3RpdmVQcm9qZWN0Q29zdEhlYWRzKHJlcTpleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBjb250cm9sbGVyLCBnZXRJbkFjdGl2ZUNvc3RIZWFkIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgICBwcm9qZWN0U2VydmljZS5nZXRJbkFjdGl2ZVByb2plY3RDb3N0SGVhZHMoIHByb2plY3RJZCwgdXNlciwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnR2V0IEluQWN0aXZlIENvc3RIZWFkIHN1Y2Nlc3MnKTtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCwgcmVzdWx0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSwgZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc2V0UHJvamVjdENvc3RIZWFkU3RhdHVzKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3QgY29udHJvbGxlciwgc2V0UHJvamVjdENvc3RIZWFkU3RhdHVzIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgdHJ5IHtcclxuICAgICAgbGV0IHByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBwcm9qZWN0SWQgPSAgcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIGxldCBjb3N0SGVhZElkID0gIHBhcnNlSW50KHJlcS5wYXJhbXMuY29zdEhlYWRJZCk7XHJcbiAgICAgIGxldCBjb3N0SGVhZEFjdGl2ZVN0YXR1cyA9IHJlcS5wYXJhbXMuYWN0aXZlU3RhdHVzO1xyXG5cclxuICAgICAgcHJvamVjdFNlcnZpY2Uuc2V0UHJvamVjdENvc3RIZWFkU3RhdHVzKCBwcm9qZWN0SWQsIGNvc3RIZWFkSWQsIGNvc3RIZWFkQWN0aXZlU3RhdHVzLCB1c2VyLChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnVXBkYXRlIHNldFByb2plY3RDb3N0SGVhZFN0YXR1cyBzdWNjZXNzICcpO1xyXG4gICAgICAgICAgbG9nZ2VyLmRlYnVnKCdzZXRQcm9qZWN0Q29zdEhlYWRTdGF0dXMgZm9yIFByb2plY3QgSUQgOiAnK3Byb2plY3RJZCtcclxuICAgICAgICAgICAgJywgQ29zdEhlYWQgOiAnK2Nvc3RIZWFkSWQrJywgY29zdEhlYWRBY3RpdmVTdGF0dXMgOiAnK2Nvc3RIZWFkQWN0aXZlU3RhdHVzKTtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY3JlYXRlQnVpbGRpbmcocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBjb250cm9sbGVyLCBhZGRCdWlsZGluZyBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBsZXQgYnVpbGRpbmdEZXRhaWxzID0gPEJ1aWxkaW5nPiByZXEuYm9keTtcclxuXHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgICBwcm9qZWN0U2VydmljZS5jcmVhdGVCdWlsZGluZyggcHJvamVjdElkLCBidWlsZGluZ0RldGFpbHMsIHVzZXIsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnQWRkIEJ1aWxkaW5nICcrcmVzdWx0LmRhdGEuX2RvYy5uYW1lKTtcclxuICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnQWRkZWQgQnVpbGRpbmcgTmFtZSA6ICcrcmVzdWx0LmRhdGEuX2RvYy5uYW1lKTtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdXBkYXRlQnVpbGRpbmdCeUlkKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3QgY29udHJvbGxlciwgdXBkYXRlQnVpbGRpbmcgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgICBsZXQgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIGxldCBidWlsZGluZ0RldGFpbHMgPSA8QnVpbGRpbmc+IHJlcS5ib2R5O1xyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgcHJvamVjdFNlcnZpY2UudXBkYXRlQnVpbGRpbmdCeUlkKCBwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIGJ1aWxkaW5nRGV0YWlscywgdXNlciwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdVcGRhdGUgQnVpbGRpbmcgJytyZXN1bHQuZGF0YS5fZG9jLm5hbWUpO1xyXG4gICAgICAgICAgbG9nZ2VyLmRlYnVnKCdVcGRhdGVkIEJ1aWxkaW5nIE5hbWUgOiAnK3Jlc3VsdC5kYXRhLl9kb2MubmFtZSk7XHJcbiAgICAgICAgICBuZXh0KG5ldyBSZXNwb25zZSgyMDAscmVzdWx0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICBuZXh0KG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oZS5tZXNzYWdlLGUuc3RhY2spKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNsb25lQnVpbGRpbmcocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBjb250cm9sbGVyLCBjbG9uZUJ1aWxkaW5nIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgICAgbGV0IHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBsZXQgYnVpbGRpbmdEZXRhaWxzID0gPEJ1aWxkaW5nPiByZXEuYm9keTtcclxuICAgICAgbGV0IHByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLmNsb25lQnVpbGRpbmdEZXRhaWxzKHByb2plY3RJZCwgYnVpbGRpbmdJZCwgYnVpbGRpbmdEZXRhaWxzLCB1c2VyLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbG9nZ2VyLmluZm8oJ0Nsb25lIEJ1aWxkaW5nICcrcmVzdWx0LmRhdGEubmFtZSk7XHJcbiAgICAgICAgICBsb2dnZXIuZGVidWcoJ0Nsb25lZCBCdWlsZGluZyBOYW1lIDogJytyZXN1bHQuZGF0YS5uYW1lKTtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0QnVpbGRpbmdCeUlkKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3QgY29udHJvbGxlciwgZ2V0QnVpbGRpbmcgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgICAgbGV0IGJ1aWxkaW5nSWQgPSByZXEucGFyYW1zLmJ1aWxkaW5nSWQ7XHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgICBwcm9qZWN0U2VydmljZS5nZXRCdWlsZGluZ0J5SWQoIHByb2plY3RJZCwgYnVpbGRpbmdJZCwgdXNlciwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdHZXQgQnVpbGRpbmcgJytyZXN1bHQuZGF0YS5uYW1lKTtcclxuICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnR2V0IEJ1aWxkaW5nIE5hbWUgOiAnK3Jlc3VsdC5kYXRhLm5hbWUpO1xyXG4gICAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLHJlc3VsdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXRCdWlsZGluZ0J5SWRGb3JDbG9uZShyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IGNvbnRyb2xsZXIsIGdldEJ1aWxkaW5nRGV0YWlsc0ZvckNsb25lIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIGxldCBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgcHJvamVjdFNlcnZpY2UuZ2V0QnVpbGRpbmdCeUlkRm9yQ2xvbmUoIHByb2plY3RJZCwgYnVpbGRpbmdJZCwgdXNlciwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdHZXQgQnVpbGRpbmcgZGV0YWlscyBmb3IgY2xvbmUgJytyZXN1bHQuZGF0YS5uYW1lKTtcclxuICAgICAgICAgIGxvZ2dlci5kZWJ1ZyhyZXN1bHQuZGF0YS5uYW1lKycgQnVpbGRpbmcgZGV0YWlscyBmb3IgY2xvbmUgLi4uUHJvamVjdElEIDogJytwcm9qZWN0SWQrJywgQnVpbGRpbmdJRCA6ICcrYnVpbGRpbmdJZCk7XHJcbiAgICAgICAgICBuZXh0KG5ldyBSZXNwb25zZSgyMDAscmVzdWx0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICBuZXh0KG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oZS5tZXNzYWdlLGUuc3RhY2spKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldEluQWN0aXZlQ29zdEhlYWQocmVxOmV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IGNvbnRyb2xsZXIsIGdldEluQWN0aXZlQ29zdEhlYWQgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgICAgbGV0IGJ1aWxkaW5nSWQgPSByZXEucGFyYW1zLmJ1aWxkaW5nSWQ7XHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgICBwcm9qZWN0U2VydmljZS5nZXRJbkFjdGl2ZUNvc3RIZWFkKCBwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIHVzZXIsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbG9nZ2VyLmluZm8oJ0dldCBJbkFjdGl2ZSBDb3N0SGVhZCBzdWNjZXNzJyk7XHJcbiAgICAgICAgICBuZXh0KG5ldyBSZXNwb25zZSgyMDAsIHJlc3VsdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsIGUuc3RhY2spKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldEluQWN0aXZlV29ya0l0ZW1zT2ZCdWlsZGluZ0Nvc3RIZWFkcyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdnZXRJbkFjdGl2ZVdvcmtJdGVtcyBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBsZXQgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgICAgbGV0IGNvc3RIZWFkSWQgOiBudW1iZXIgPSBwYXJzZUludChyZXEucGFyYW1zLmNvc3RIZWFkSWQpO1xyXG4gICAgICBsZXQgY2F0ZWdvcnlJZCA6IG51bWJlciA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY2F0ZWdvcnlJZCk7XHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgICBwcm9qZWN0U2VydmljZS5nZXRJbkFjdGl2ZVdvcmtJdGVtc09mQnVpbGRpbmdDb3N0SGVhZHMoIHByb2plY3RJZCwgYnVpbGRpbmdJZCwgY29zdEhlYWRJZCwgY2F0ZWdvcnlJZCwgdXNlciwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdHZXQgSW5BY3RpdmUgV29ya0l0ZW0gc3VjY2VzcycpO1xyXG4gICAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLHJlc3VsdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBHZXQgSW4gQWN0aXZlIFdvcmtJdGVtcyBPZiBQcm9qZWN0IENvc3QgSGVhZHNcclxuICBnZXRJbkFjdGl2ZVdvcmtJdGVtc09mUHJvamVjdENvc3RIZWFkcyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IENvbnRyb2xsZXIsIEdldCBJbi1BY3RpdmUgV29ya0l0ZW1zIE9mIFByb2plY3QgQ29zdCBIZWFkcyBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBsZXQgY29zdEhlYWRJZCA6IG51bWJlciA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY29zdEhlYWRJZCk7XHJcbiAgICAgIGxldCBjYXRlZ29yeUlkIDogbnVtYmVyID0gcGFyc2VJbnQocmVxLnBhcmFtcy5jYXRlZ29yeUlkKTtcclxuICAgICAgbGV0IHByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLmdldEluQWN0aXZlV29ya0l0ZW1zT2ZQcm9qZWN0Q29zdEhlYWRzKCBwcm9qZWN0SWQsIGNvc3RIZWFkSWQsIGNhdGVnb3J5SWQsIHVzZXIsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYoZXJyb3JcclxuICAgICAgICApIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnR2V0IEluLUFjdGl2ZSBXb3JrSXRlbXMgT2YgUHJvamVjdCBDb3N0IEhlYWRzIHN1Y2Nlc3MnKTtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZGVsZXRlQnVpbGRpbmdCeUlkKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3QgY29udHJvbGxlciwgZGVsZXRlQnVpbGRpbmcgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIGxldCBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgcHJvamVjdFNlcnZpY2UuZGVsZXRlQnVpbGRpbmdCeUlkKCBwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIHVzZXIsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnQnVpbGRpbmcgRGVsZXRlIGZyb20gJytyZXN1bHQuZGF0YS5uYW1lKyAnIHByb2plY3QnKTtcclxuICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnQnVpbGRpbmcgRGVsZXRlZCBmcm9tICcrcmVzdWx0LmRhdGEubmFtZSsgJyBwcm9qZWN0Jyk7XHJcbiAgICAgICAgICBuZXh0KG5ldyBSZXNwb25zZSgyMDAscmVzdWx0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICBuZXh0KG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oZS5tZXNzYWdlLGUuc3RhY2spKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldFJhdGUocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBjb250cm9sbGVyLCBnZXRSYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIGxldCBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgICBsZXQgY29zdEhlYWRJZCA9cGFyc2VJbnQocmVxLnBhcmFtcy5jb3N0SGVhZElkKTtcclxuICAgICAgbGV0IGNhdGVnb3J5SWQgPXBhcnNlSW50KHJlcS5wYXJhbXMuY2F0ZWdvcnlJZCk7XHJcbiAgICAgIGxldCB3b3JrSXRlbUlkID1wYXJzZUludChyZXEucGFyYW1zLndvcmtJdGVtSWQpO1xyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgY29uc29sZS5sb2coJyB3b3JraXRlbUlkID0+ICcrIHdvcmtJdGVtSWQpO1xyXG4gICAgICBwcm9qZWN0U2VydmljZS5nZXRSYXRlKCBwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIGNvc3RIZWFkSWQsIGNhdGVnb3J5SWQsIHdvcmtJdGVtSWQsIHVzZXIsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnR2V0IFJhdGUgU3VjY2VzcycpO1xyXG4gICAgICAgICAgbG9nZ2VyLmRlYnVnKCdHZXR0aW5nIFJhdGUgb2YgUHJvamVjdCBJRCA6ICcrcHJvamVjdElkKycgQnVpbGRpbmcgSUQgOiAnK2J1aWxkaW5nSWQpO1xyXG4gICAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLHJlc3VsdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB1cGRhdGVSYXRlT2ZCdWlsZGluZ0Nvc3RIZWFkcyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgICAgbGV0IGJ1aWxkaW5nSWQgPSByZXEucGFyYW1zLmJ1aWxkaW5nSWQ7XHJcbiAgICAgIGxldCBjb3N0SGVhZElkID1wYXJzZUludChyZXEucGFyYW1zLmNvc3RIZWFkSWQpO1xyXG4gICAgICBsZXQgY2F0ZWdvcnlJZCA9cGFyc2VJbnQocmVxLnBhcmFtcy5jYXRlZ29yeUlkKTtcclxuICAgICAgbGV0IHdvcmtJdGVtSWQgPXBhcnNlSW50KHJlcS5wYXJhbXMud29ya0l0ZW1JZCk7XHJcbiAgICAgIGxldCBjY1dvcmtJdGVtSWQgPXBhcnNlSW50KHJlcS5wYXJhbXMuY2NXb3JrSXRlbUlkKTtcclxuICAgICAgbGV0IHJhdGUgOiBSYXRlID0gPFJhdGU+IHJlcS5ib2R5O1xyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgY29uc29sZS5sb2coJyB3b3JraXRlbUlkID0+ICcrIHdvcmtJdGVtSWQpO1xyXG4gICAgICBwcm9qZWN0U2VydmljZS51cGRhdGVSYXRlT2ZCdWlsZGluZ0Nvc3RIZWFkcyggcHJvamVjdElkLCBidWlsZGluZ0lkLCBjb3N0SGVhZElkLGNhdGVnb3J5SWQgLFxyXG4gICAgICAgIHdvcmtJdGVtSWQsIGNjV29ya0l0ZW1JZCwgcmF0ZSwgdXNlciwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdHZXQgUmF0ZSBTdWNjZXNzJyk7XHJcbiAgICAgICAgICBsb2dnZXIuZGVidWcoJ0dldHRpbmcgUmF0ZSBvZiBQcm9qZWN0IElEIDogJytwcm9qZWN0SWQrJyBCdWlsZGluZyBJRCA6ICcrYnVpbGRpbmdJZCk7XHJcbiAgICAgICAgICBuZXh0KG5ldyBSZXNwb25zZSgyMDAscmVzdWx0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICBuZXh0KG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oZS5tZXNzYWdlLGUuc3RhY2spKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vVXBkYXRlIERpcmVjdCBSYXRlIG9mIEJ1aWxkaW5nIENvc3RoZWFkc1xyXG4gIHVwZGF0ZURpcmVjdFJhdGVPZkJ1aWxkaW5nV29ya0l0ZW1zKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3QgY29udHJvbGxlciwgdXBkYXRlIERpcmVjdFJhdGUgT2YgQnVpbGRpbmcgV29ya0l0ZW1zIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIGxldCBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgICBsZXQgY29zdEhlYWRJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY29zdEhlYWRJZCk7XHJcbiAgICAgIGxldCBjYXRlZ29yeUlkID0gcGFyc2VJbnQocmVxLnBhcmFtcy5jYXRlZ29yeUlkKTtcclxuICAgICAgbGV0IHdvcmtJdGVtSWQgPSBwYXJzZUludChyZXEucGFyYW1zLndvcmtJdGVtSWQpO1xyXG4gICAgICBsZXQgY2NXb3JrSXRlbUlkID0gcGFyc2VJbnQocmVxLnBhcmFtcy5jY1dvcmtJdGVtSWQpO1xyXG4gICAgICBsZXQgZGlyZWN0UmF0ZSA9IHJlcS5ib2R5LmRpcmVjdFJhdGU7XHJcblxyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgcHJvamVjdFNlcnZpY2UudXBkYXRlRGlyZWN0UmF0ZU9mQnVpbGRpbmdXb3JrSXRlbXMoIHByb2plY3RJZCwgYnVpbGRpbmdJZCwgY29zdEhlYWRJZCxcclxuICAgICAgICBjYXRlZ29yeUlkLCB3b3JrSXRlbUlkLCBjY1dvcmtJdGVtSWQsIGRpcmVjdFJhdGUsIHVzZXIsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxvZ2dlci5pbmZvKCd1cGRhdGUgRGlyZWN0UmF0ZSBPZiBCdWlsZGluZyBXb3JrSXRlbXMgc3VjY2VzcycpO1xyXG4gICAgICAgICAgICBuZXh0KG5ldyBSZXNwb25zZSgyMDAscmVzdWx0KSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcblxyXG4gIC8vVXBkYXRlIHJhdGUgb2YgcHJvamVjdCBjb3N0IGhlYWRzXHJcbiAgdXBkYXRlUmF0ZU9mUHJvamVjdENvc3RIZWFkcyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IENvbnRyb2xsZXIsIFVwZGF0ZSByYXRlIG9mIHByb2plY3QgY29zdCBoZWFkcyBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBsZXQgY29zdEhlYWRJZCA9cGFyc2VJbnQocmVxLnBhcmFtcy5jb3N0SGVhZElkKTtcclxuICAgICAgbGV0IGNhdGVnb3J5SWQgPXBhcnNlSW50KHJlcS5wYXJhbXMuY2F0ZWdvcnlJZCk7XHJcbiAgICAgIGxldCB3b3JrSXRlbUlkID1wYXJzZUludChyZXEucGFyYW1zLndvcmtJdGVtSWQpO1xyXG4gICAgICBsZXQgY2NXb3JrSXRlbUlkID1wYXJzZUludChyZXEucGFyYW1zLmNjV29ya0l0ZW1JZCk7XHJcbiAgICAgIGxldCByYXRlIDogUmF0ZSA9IDxSYXRlPiByZXEuYm9keTtcclxuICAgICAgbGV0IHByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLnVwZGF0ZVJhdGVPZlByb2plY3RDb3N0SGVhZHMoIHByb2plY3RJZCwgY29zdEhlYWRJZCxjYXRlZ29yeUlkICx3b3JrSXRlbUlkLFxyXG4gICAgICAgIGNjV29ya0l0ZW1JZCwgcmF0ZSwgdXNlciwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdVcGRhdGUgcmF0ZSBvZiBwcm9qZWN0IGNvc3QgaGVhZHMgU3VjY2VzcycpO1xyXG4gICAgICAgICAgbG9nZ2VyLmRlYnVnKCdVcGRhdGUgcmF0ZSBvZiBwcm9qZWN0IGNvc3QgaGVhZHMgb2YgUHJvamVjdCBJRCA6ICcrcHJvamVjdElkKTtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy9VcGRhdGUgRGlyZWN0IFJhdGUgb2YgUHJvamVjdCBjb3N0aGVhZHNcclxuXHJcbiAgdXBkYXRlRGlyZWN0UmF0ZU9mUHJvamVjdFdvcmtJdGVtcyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IENvbnRyb2xsZXIsdXBkYXRlIERpcmVjdFJhdGUgT2YgUHJvamVjdCBXb3JrSXRlbXMgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBwcm9qZWN0SWQgPSAgcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIGxldCBjb3N0SGVhZElkID0gcGFyc2VJbnQocmVxLnBhcmFtcy5jb3N0SGVhZElkKTtcclxuICAgICAgbGV0IGNhdGVnb3J5SWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNhdGVnb3J5SWQpO1xyXG4gICAgICBsZXQgd29ya0l0ZW1JZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMud29ya0l0ZW1JZCk7XHJcbiAgICAgIGxldCBjY1dvcmtJdGVtSWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNjV29ya0l0ZW1JZCk7XHJcbiAgICAgIGxldCBkaXJlY3RSYXRlID0gcmVxLmJvZHkuZGlyZWN0UmF0ZTtcclxuXHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgICBwcm9qZWN0U2VydmljZS51cGRhdGVEaXJlY3RSYXRlT2ZQcm9qZWN0V29ya0l0ZW1zKCBwcm9qZWN0SWQsIGNvc3RIZWFkSWQsY2F0ZWdvcnlJZCAsd29ya0l0ZW1JZCxcclxuICAgICAgICBjY1dvcmtJdGVtSWQsIGRpcmVjdFJhdGUsIHVzZXIsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygndXBkYXRlIERpcmVjdFJhdGUgT2YgUHJvamVjdCBXb3JrSXRlbXMgU3VjY2VzcycpO1xyXG4gICAgICAgICAgbG9nZ2VyLmRlYnVnKCd1cGRhdGUgRGlyZWN0UmF0ZSBPZiBQcm9qZWN0IFdvcmtJdGVtcyBvZiBQcm9qZWN0IElEIDogJytwcm9qZWN0SWQpO1xyXG4gICAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLHJlc3VsdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBkZWxldGVRdWFudGl0eU9mQnVpbGRpbmdDb3N0SGVhZHNCeU5hbWUocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgdHJ5IHtcclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IGNvbnRyb2xsZXIsIGRlbGV0ZVF1YW50aXR5IGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgIGxldCBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgIGxldCBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgbGV0IGNvc3RIZWFkSWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNvc3RIZWFkSWQpO1xyXG4gICAgbGV0IGNhdGVnb3J5SWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNhdGVnb3J5SWQpO1xyXG4gICAgbGV0IHdvcmtJdGVtSWQgPSBwYXJzZUludChyZXEucGFyYW1zLndvcmtJdGVtSWQpO1xyXG4gICAgbGV0IGNjV29ya0l0ZW1JZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY2NXb3JrSXRlbUlkKTtcclxuICAgIGxldCBpdGVtTmFtZSA9IHJlcS5ib2R5Lml0ZW0ubmFtZTtcclxuXHJcbiAgICBsZXQgcHJvamVjdHNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgIHByb2plY3RzZXJ2aWNlLmRlbGV0ZVF1YW50aXR5T2ZCdWlsZGluZ0Nvc3RIZWFkc0J5TmFtZSggcHJvamVjdElkLCBidWlsZGluZ0lkLCBjb3N0SGVhZElkLFxyXG4gICAgICBjYXRlZ29yeUlkLCB3b3JrSXRlbUlkLCBjY1dvcmtJdGVtSWQsIGl0ZW1OYW1lLCB1c2VyLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsb2dnZXIuaW5mbygnRGVsZXRlIFF1YW50aXR5ICcgKyByZXN1bHQpO1xyXG4gICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnRGVsZXRlZCBRdWFudGl0eSBvZiBQcm9qZWN0IElEIDogJytwcm9qZWN0SWQrJywgQnVpbGRpbmcgSUQgOiAnK2J1aWxkaW5nSWQrXHJcbiAgICAgICAgICAgICAnLCBDb3N0SGVhZCA6ICcrY29zdEhlYWRJZCsnLCBXb3JraXRlbSA6ICcrd29ya0l0ZW1JZCsnLCBJdGVtIDogJytpdGVtTmFtZSk7XHJcbiAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLCByZXN1bHQpKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfWNhdGNoKGUpIHtcclxuICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gIH1cclxuICB9XHJcblxyXG4gIC8vRGVsZXRlIFF1YW50aXR5IE9mIFByb2plY3QgQ29zdCBIZWFkcyBCeSBOYW1lXHJcbiAgZGVsZXRlUXVhbnRpdHlPZlByb2plY3RDb3N0SGVhZHNCeU5hbWUocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBjb250cm9sbGVyLCBEZWxldGUgUXVhbnRpdHkgT2YgUHJvamVjdCBDb3N0IEhlYWRzIEJ5IE5hbWUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgICAgbGV0IGNvc3RIZWFkSWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNvc3RIZWFkSWQpO1xyXG4gICAgICBsZXQgY2F0ZWdvcnlJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY2F0ZWdvcnlJZCk7XHJcbiAgICAgIGxldCB3b3JrSXRlbUlkID0gcGFyc2VJbnQocmVxLnBhcmFtcy53b3JrSXRlbUlkKTtcclxuICAgICAgbGV0IGl0ZW1OYW1lID0gcmVxLmJvZHkuaXRlbS5uYW1lO1xyXG5cclxuICAgICAgbGV0IHByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLmRlbGV0ZVF1YW50aXR5T2ZQcm9qZWN0Q29zdEhlYWRzQnlOYW1lKCBwcm9qZWN0SWQsIGNvc3RIZWFkSWQsIGNhdGVnb3J5SWQsIHdvcmtJdGVtSWQsIGl0ZW1OYW1lLFxyXG4gICAgICAgIHVzZXIsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbG9nZ2VyLmluZm8oJ0RlbGV0ZSBRdWFudGl0eSBPZiBQcm9qZWN0IENvc3QgSGVhZHMgQnkgTmFtZSAnICsgcmVzdWx0KTtcclxuICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnRGVsZXRlIFF1YW50aXR5IE9mIFByb2plY3QgQ29zdCBIZWFkcyBCeSBOYW1lIG9mIFByb2plY3QgSUQgOiAnK3Byb2plY3RJZCsnLCBDb3N0SGVhZCA6ICcrY29zdEhlYWRJZCsnLCAnICtcclxuICAgICAgICAgICAgJ1dvcmtpdGVtIDogJyt3b3JrSXRlbUlkKycsIEl0ZW0gOiAnK2l0ZW1OYW1lKTtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCwgcmVzdWx0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1jYXRjaChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZGVsZXRlV29ya2l0ZW0ocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBjb250cm9sbGVyLCBkZWxldGVXb3JraXRlbSBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBsZXQgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgICAgbGV0IGNvc3RIZWFkSWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNvc3RIZWFkSWQpO1xyXG4gICAgICBsZXQgY2F0ZWdvcnlJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY2F0ZWdvcnlJZCk7XHJcbiAgICAgIGxldCB3b3JrSXRlbUlkID0gcGFyc2VJbnQocmVxLnBhcmFtcy53b3JrSXRlbUlkKTtcclxuICAgICAgbGV0IHByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcbiAgICAgIGNvbnNvbGUubG9nKCcgd29ya2l0ZW0gPT4gJysgd29ya0l0ZW1JZCk7XHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLmRlbGV0ZVdvcmtpdGVtKCBwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIGNvc3RIZWFkSWQsIGNhdGVnb3J5SWQsIHdvcmtJdGVtSWQsIHVzZXIsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnRGVsZXRlIHdvcmsgaXRlbSAnK3Jlc3VsdC5kYXRhKTtcclxuICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnRGVsZXRlZCAgd29yayBpdGVtIG9mIFByb2plY3QgSUQgOiAnK3Byb2plY3RJZCsnLCBCdWlsZGluZyBJRCA6ICcrYnVpbGRpbmdJZCtcclxuICAgICAgICAgICAgJywgQ29zdEhlYWQgOiAnK2Nvc3RIZWFkSWQrJywgQ2F0ZWdvcnkgOiAnK2NhdGVnb3J5SWQrJywgV29ya2l0ZW0gOiAnK3dvcmtJdGVtSWQpO1xyXG4gICAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLHJlc3VsdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZXRDb3N0SGVhZFN0YXR1cyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IGNvbnRyb2xsZXIsIHVwZGF0ZUJ1aWxkaW5nQ29zdEhlYWQgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHByb2plY3RJZCA9ICByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgICAgbGV0IGJ1aWxkaW5nSWQgPSAgcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgICBsZXQgY29zdEhlYWRJZCA9ICBwYXJzZUludChyZXEucGFyYW1zLmNvc3RIZWFkSWQpO1xyXG4gICAgICBsZXQgY29zdEhlYWRBY3RpdmVTdGF0dXMgPSByZXEucGFyYW1zLmFjdGl2ZVN0YXR1cztcclxuXHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLnNldENvc3RIZWFkU3RhdHVzKCBidWlsZGluZ0lkLCBjb3N0SGVhZElkLCBjb3N0SGVhZEFjdGl2ZVN0YXR1cywgdXNlciwoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbG9nZ2VyLmluZm8oJ1VwZGF0ZSBCdWlsZGluZyBDb3N0SGVhZCBEZXRhaWxzIHN1Y2Nlc3MgJyk7XHJcbiAgICAgICAgICBsb2dnZXIuZGVidWcoJ3VwZGF0ZUJ1aWxkaW5nQ29zdEhlYWQgZm9yIFByb2plY3QgSUQgOiAnK3Byb2plY3RJZCsnLCBCdWlsZGluZyBJRCA6ICcrYnVpbGRpbmdJZCtcclxuICAgICAgICAgICAgJywgQ29zdEhlYWQgOiAnK2Nvc3RIZWFkSWQrJywgY29zdEhlYWRBY3RpdmVTdGF0dXMgOiAnK2Nvc3RIZWFkQWN0aXZlU3RhdHVzKTtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdXBkYXRlV29ya0l0ZW1TdGF0dXNPZkJ1aWxkaW5nQ29zdEhlYWRzKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3QgY29udHJvbGxlciwgdXBkYXRlIFdvcmtJdGVtIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgdHJ5IHtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IGJvZHkgPSByZXEuYm9keTtcclxuICAgICAgbGV0IHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBsZXQgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgICAgbGV0IGNvc3RIZWFkSWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNvc3RIZWFkSWQpO1xyXG4gICAgICBsZXQgY2F0ZWdvcnlJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY2F0ZWdvcnlJZCk7XHJcbiAgICAgIGxldCB3b3JrSXRlbVJBSWQgPSBwYXJzZUludChyZXEucGFyYW1zLndvcmtJdGVtUkFJZCk7XHJcbiAgICAgIGxldCB3b3JrSXRlbUlkID0gcGFyc2VJbnQocmVxLnBhcmFtcy53b3JrSXRlbUlkKTtcclxuICAgICAgbGV0IHdvcmtJdGVtQWN0aXZlU3RhdHVzID0gSlNPTi5wYXJzZShyZXEucGFyYW1zLmFjdGl2ZVN0YXR1cyk7XHJcblxyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2U6IFByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLnVwZGF0ZVdvcmtJdGVtU3RhdHVzT2ZCdWlsZGluZ0Nvc3RIZWFkcyggYnVpbGRpbmdJZCwgY29zdEhlYWRJZCwgY2F0ZWdvcnlJZCxcclxuICAgICAgICB3b3JrSXRlbVJBSWQsIHdvcmtJdGVtSWQsIHdvcmtJdGVtQWN0aXZlU3RhdHVzLCBib2R5LCB1c2VyLChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnVXBkYXRlIHdvcmtJdGVtIERldGFpbHMgc3VjY2VzcyAnKTtcclxuICAgICAgICAgIGxvZ2dlci5kZWJ1ZygndXBkYXRlIFdvcmtJdGVtIGZvciBQcm9qZWN0IElEIDogJytwcm9qZWN0SWQrJywgQnVpbGRpbmcgSUQgOiAnK2J1aWxkaW5nSWQrXHJcbiAgICAgICAgICAgICcsIENvc3RIZWFkIDogJytjb3N0SGVhZElkKycsIHdvcmtJdGVtQWN0aXZlU3RhdHVzIDogJyt3b3JrSXRlbUFjdGl2ZVN0YXR1cyk7XHJcbiAgICAgICAgICBuZXh0KG5ldyBSZXNwb25zZSgyMDAscmVzdWx0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICBuZXh0KG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oZS5tZXNzYWdlLGUuc3RhY2spKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gLy8gVXBkYXRlIFdvcmtJdGVtIFN0YXR1cyBPZiBQcm9qZWN0IENvc3RIZWFkc1xyXG4gIHVwZGF0ZVdvcmtJdGVtU3RhdHVzT2ZQcm9qZWN0Q29zdEhlYWRzKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3QgY29udHJvbGxlciwgVXBkYXRlIFdvcmtJdGVtIFN0YXR1cyBPZiBQcm9qZWN0IENvc3QgSGVhZHMgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgYm9keSA9IHJlcS5ib2R5O1xyXG4gICAgICBsZXQgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIGxldCBjb3N0SGVhZElkID0gcGFyc2VJbnQocmVxLnBhcmFtcy5jb3N0SGVhZElkKTtcclxuICAgICAgbGV0IGNhdGVnb3J5SWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNhdGVnb3J5SWQpO1xyXG4gICAgICBsZXQgd29ya0l0ZW1JZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMud29ya0l0ZW1JZCk7XHJcbiAgICAgIGxldCBjY1dvcmtJdGVtSWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNjV29ya0l0ZW1JZCk7XHJcbiAgICAgIGxldCB3b3JrSXRlbUFjdGl2ZVN0YXR1cyA9IEpTT04ucGFyc2UocmVxLnBhcmFtcy5hY3RpdmVTdGF0dXMpO1xyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2U6IFByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLnVwZGF0ZVdvcmtJdGVtU3RhdHVzT2ZQcm9qZWN0Q29zdEhlYWRzKCBwcm9qZWN0SWQsIGNvc3RIZWFkSWQsIGNhdGVnb3J5SWQsIHdvcmtJdGVtSWQsXHJcbiAgICAgICAgY2NXb3JrSXRlbUlkLCB3b3JrSXRlbUFjdGl2ZVN0YXR1cywgYm9keSwgdXNlciwoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbG9nZ2VyLmluZm8oJ1VwZGF0ZSBXb3JrSXRlbSBTdGF0dXMgT2YgUHJvamVjdCBDb3N0IEhlYWRzIHN1Y2Nlc3MgJyk7XHJcbiAgICAgICAgICBsb2dnZXIuZGVidWcoJ1VwZGF0ZSBXb3JrSXRlbSBTdGF0dXMgT2YgUHJvamVjdCBDb3N0IEhlYWRzIGZvciBQcm9qZWN0IElEIDogJytwcm9qZWN0SWQrJyBDb3N0SGVhZCA6ICcrY29zdEhlYWRJZCsnLCAnICtcclxuICAgICAgICAgICAgJ3dvcmtJdGVtQWN0aXZlU3RhdHVzIDogJyt3b3JrSXRlbUFjdGl2ZVN0YXR1cyk7XHJcbiAgICAgICAgICBuZXh0KG5ldyBSZXNwb25zZSgyMDAscmVzdWx0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICBuZXh0KG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oZS5tZXNzYWdlLGUuc3RhY2spKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHVwZGF0ZUJ1ZGdldGVkQ29zdEZvckNvc3RIZWFkKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbGV0IHByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBwcm9qZWN0SWQgPSAgcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIGxldCBidWlsZGluZ0lkID0gIHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgICAgbGV0IGNvc3RIZWFkQnVkZ2V0ZWRBbW91bnQgPSAgcmVxLmJvZHk7XHJcblxyXG4gICAgICBwcm9qZWN0U2VydmljZS51cGRhdGVCdWRnZXRlZENvc3RGb3JDb3N0SGVhZCggYnVpbGRpbmdJZCwgY29zdEhlYWRCdWRnZXRlZEFtb3VudCwgdXNlciwoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLHJlc3VsdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB1cGRhdGVCdWRnZXRlZENvc3RGb3JQcm9qZWN0Q29zdEhlYWQocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHByb2plY3RJZCA9ICByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgICAgbGV0IGNvc3RIZWFkQnVkZ2V0ZWRBbW91bnQgPSAgcmVxLmJvZHk7XHJcblxyXG4gICAgICBwcm9qZWN0U2VydmljZS51cGRhdGVCdWRnZXRlZENvc3RGb3JQcm9qZWN0Q29zdEhlYWQoIHByb2plY3RJZCwgY29zdEhlYWRCdWRnZXRlZEFtb3VudCwgdXNlciwoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLHJlc3VsdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB1cGRhdGVRdWFudGl0eU9mQnVpbGRpbmdDb3N0SGVhZHMocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBjb250cm9sbGVyLCB1cGRhdGVRdWFudGl0eSBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBsZXQgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgICAgbGV0IGNvc3RIZWFkSWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNvc3RIZWFkSWQpO1xyXG4gICAgICBsZXQgY2F0ZWdvcnlJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY2F0ZWdvcnlJZCk7XHJcbiAgICAgIGxldCB3b3JrSXRlbUlkID0gcGFyc2VJbnQocmVxLnBhcmFtcy53b3JrSXRlbUlkKTtcclxuICAgICAgbGV0IGNjV29ya0l0ZW1JZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY2NXb3JrSXRlbUlkKTtcclxuICAgICAgbGV0IHF1YW50aXR5RGV0YWlscyA9IHJlcS5ib2R5Lml0ZW07XHJcblxyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgcHJvamVjdFNlcnZpY2UudXBkYXRlUXVhbnRpdHlPZkJ1aWxkaW5nQ29zdEhlYWRzKCBwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIGNvc3RIZWFkSWQsXHJcbiAgICAgICAgY2F0ZWdvcnlJZCwgd29ya0l0ZW1JZCwgY2NXb3JrSXRlbUlkLCBxdWFudGl0eURldGFpbHMsIHVzZXIsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnVXBkYXRlIFF1YW50aXR5IHN1Y2Nlc3MnKTtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG4gIHVwZGF0ZURpcmVjdFF1YW50aXR5T2ZCdWlsZGluZ1dvcmtJdGVtcyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IGNvbnRyb2xsZXIsIHVwZGF0ZURpcmVjdFF1YW50aXR5T2ZCdWlsZGluZ0Nvc3RIZWFkcyBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBsZXQgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgICAgbGV0IGNvc3RIZWFkSWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNvc3RIZWFkSWQpO1xyXG4gICAgICBsZXQgY2F0ZWdvcnlJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY2F0ZWdvcnlJZCk7XHJcbiAgICAgIGxldCB3b3JrSXRlbUlkID0gcGFyc2VJbnQocmVxLnBhcmFtcy53b3JrSXRlbUlkKTtcclxuICAgICAgbGV0IGNjV29ya0l0ZW1JZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY2NXb3JrSXRlbUlkKTtcclxuICAgICAgbGV0IGRpcmVjdFF1YW50aXR5ID0gcmVxLmJvZHkuZGlyZWN0UXVhbnRpdHk7XHJcblxyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgcHJvamVjdFNlcnZpY2UudXBkYXRlRGlyZWN0UXVhbnRpdHlPZkJ1aWxkaW5nV29ya0l0ZW1zKCBwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIGNvc3RIZWFkSWQsXHJcbiAgICAgICAgY2F0ZWdvcnlJZCwgd29ya0l0ZW1JZCwgY2NXb3JrSXRlbUlkLCBkaXJlY3RRdWFudGl0eSwgdXNlciwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCd1cGRhdGVEaXJlY3RRdWFudGl0eU9mQnVpbGRpbmdDb3N0SGVhZHMgc3VjY2VzcycpO1xyXG4gICAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLHJlc3VsdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB1cGRhdGVEaXJlY3RRdWFudGl0eU9mUHJvamVjdFdvcmtJdGVtcyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IGNvbnRyb2xsZXIsIHVwZGF0ZURpcmVjdFF1YW50aXR5T2ZCdWlsZGluZ0Nvc3RIZWFkcyBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBsZXQgY29zdEhlYWRJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY29zdEhlYWRJZCk7XHJcbiAgICAgIGxldCBjYXRlZ29yeUlkID0gcGFyc2VJbnQocmVxLnBhcmFtcy5jYXRlZ29yeUlkKTtcclxuICAgICAgbGV0IHdvcmtJdGVtSWQgPSBwYXJzZUludChyZXEucGFyYW1zLndvcmtJdGVtSWQpO1xyXG4gICAgICBsZXQgY2NXb3JrSXRlbUlkID0gcGFyc2VJbnQocmVxLnBhcmFtcy5jY1dvcmtJdGVtSWQpO1xyXG4gICAgICBsZXQgZGlyZWN0UXVhbnRpdHkgPSByZXEuYm9keS5kaXJlY3RRdWFudGl0eTtcclxuXHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgICBwcm9qZWN0U2VydmljZS51cGRhdGVEaXJlY3RRdWFudGl0eU9mUHJvamVjdFdvcmtJdGVtcyggcHJvamVjdElkLCBjb3N0SGVhZElkLFxyXG4gICAgICAgIGNhdGVnb3J5SWQsIHdvcmtJdGVtSWQsIGNjV29ya0l0ZW1JZCwgZGlyZWN0UXVhbnRpdHksIHVzZXIsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxvZ2dlci5pbmZvKCd1cGRhdGVEaXJlY3RRdWFudGl0eU9mUHJvamVjdFdvcmtJdGVtcyBzdWNjZXNzJyk7XHJcbiAgICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICBuZXh0KG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oZS5tZXNzYWdlLGUuc3RhY2spKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHVwZGF0ZVF1YW50aXR5RGV0YWlsc09mQnVpbGRpbmcocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBjb250cm9sbGVyLCB1cGRhdGUgRGlyZWN0UXVhbnRpdHkgT2YgQnVpbGRpbmdRdWFudGl0eUl0ZW1zIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIGxldCBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgICBsZXQgY29zdEhlYWRJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY29zdEhlYWRJZCk7XHJcbiAgICAgIGxldCBjYXRlZ29yeUlkID0gcGFyc2VJbnQocmVxLnBhcmFtcy5jYXRlZ29yeUlkKTtcclxuICAgICAgbGV0IHdvcmtJdGVtSWQgPSBwYXJzZUludChyZXEucGFyYW1zLndvcmtJdGVtSWQpO1xyXG4gICAgICBsZXQgY2NXb3JrSXRlbUlkID0gcGFyc2VJbnQocmVxLnBhcmFtcy5jY1dvcmtJdGVtSWQpO1xyXG4gICAgICBsZXQgcXVhbnRpdHlEZXRhaWxzT2JqID0gcmVxLmJvZHkuaXRlbTtcclxuXHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgICBwcm9qZWN0U2VydmljZS51cGRhdGVRdWFudGl0eURldGFpbHNPZkJ1aWxkaW5nKCBwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIGNvc3RIZWFkSWQsXHJcbiAgICAgICAgY2F0ZWdvcnlJZCwgd29ya0l0ZW1JZCwgY2NXb3JrSXRlbUlkLCBxdWFudGl0eURldGFpbHNPYmosIHVzZXIsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxvZ2dlci5pbmZvKCd1cGRhdGUgRGlyZWN0UXVhbnRpdHkgT2YgQnVpbGRpbmdRdWFudGl0eUl0ZW1zIHN1Y2Nlc3MnKTtcclxuICAgICAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLHJlc3VsdCkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdXBkYXRlUXVhbnRpdHlEZXRhaWxzT2ZQcm9qZWN0KHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3QgY29udHJvbGxlciwgdXBkYXRlIERpcmVjdFF1YW50aXR5IE9mIEJ1aWxkaW5nUXVhbnRpdHlJdGVtcyBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBsZXQgY29zdEhlYWRJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY29zdEhlYWRJZCk7XHJcbiAgICAgIGxldCBjYXRlZ29yeUlkID0gcGFyc2VJbnQocmVxLnBhcmFtcy5jYXRlZ29yeUlkKTtcclxuICAgICAgbGV0IHdvcmtJdGVtSWQgPSBwYXJzZUludChyZXEucGFyYW1zLndvcmtJdGVtSWQpO1xyXG4gICAgICBsZXQgY2NXb3JrSXRlbUlkID0gcGFyc2VJbnQocmVxLnBhcmFtcy5jY1dvcmtJdGVtSWQpO1xyXG4gICAgICBsZXQgcXVhbnRpdHlEZXRhaWxzT2JqID0gcmVxLmJvZHkuaXRlbTtcclxuXHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgICBwcm9qZWN0U2VydmljZS51cGRhdGVRdWFudGl0eURldGFpbHNPZlByb2plY3QoIHByb2plY3RJZCwgY29zdEhlYWRJZCxcclxuICAgICAgICBjYXRlZ29yeUlkLCB3b3JrSXRlbUlkLCBjY1dvcmtJdGVtSWQsIHF1YW50aXR5RGV0YWlsc09iaiwgdXNlciwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbG9nZ2VyLmluZm8oJ3VwZGF0ZSBEaXJlY3RRdWFudGl0eSBPZiBCdWlsZGluZ1F1YW50aXR5SXRlbXMgc3VjY2VzcycpO1xyXG4gICAgICAgICAgICBuZXh0KG5ldyBSZXNwb25zZSgyMDAscmVzdWx0KSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvL1VwZGF0ZSBRdWFudGl0eSBPZiBQcm9qZWN0IENvc3QgSGVhZHNcclxuICB1cGRhdGVRdWFudGl0eU9mUHJvamVjdENvc3RIZWFkcyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IGNvbnRyb2xsZXIsIFVwZGF0ZSBRdWFudGl0eSBPZiBQcm9qZWN0IENvc3QgSGVhZHMgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgICAgbGV0IGNvc3RIZWFkSWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNvc3RIZWFkSWQpO1xyXG4gICAgICBsZXQgY2F0ZWdvcnlJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY2F0ZWdvcnlJZCk7XHJcbiAgICAgIGxldCB3b3JrSXRlbUlkID0gcGFyc2VJbnQocmVxLnBhcmFtcy53b3JrSXRlbUlkKTtcclxuICAgICAgbGV0IGNjV29ya0l0ZW1JZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY2NXb3JrSXRlbUlkKTtcclxuICAgICAgbGV0IHF1YW50aXR5RGV0YWlscyA9IHJlcS5ib2R5Lml0ZW07XHJcblxyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgcHJvamVjdFNlcnZpY2UudXBkYXRlUXVhbnRpdHlPZlByb2plY3RDb3N0SGVhZHMoIHByb2plY3RJZCwgY29zdEhlYWRJZCxcclxuICAgICAgICBjYXRlZ29yeUlkLCB3b3JrSXRlbUlkLCBjY1dvcmtJdGVtSWQsIHF1YW50aXR5RGV0YWlscywgdXNlciwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdVcGRhdGUgUXVhbnRpdHkgT2YgUHJvamVjdCBDb3N0IEhlYWRzIHN1Y2Nlc3MnKTtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG4gIC8vR2V0IEluLUFjdGl2ZSBDYXRlZ29yaWVzIEZyb20gRGF0YWJhc2VcclxuICBnZXRJbkFjdGl2ZUNhdGVnb3JpZXNCeUNvc3RIZWFkSWQocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBjb250cm9sbGVyLCBnZXRDYXRlZ29yeUJ5Q29zdEhlYWRJZCBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBsZXQgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgICAgbGV0IGNvc3RIZWFkSWQgPSByZXEucGFyYW1zLmNvc3RIZWFkSWQ7XHJcblxyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuXHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLmdldEluQWN0aXZlQ2F0ZWdvcmllc0J5Q29zdEhlYWRJZChwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIGNvc3RIZWFkSWQsIHVzZXIsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnR2V0IENhdGVnb3J5IEJ5IENvc3RIZWFkSWQgc3VjY2VzcycpO1xyXG4gICAgICAgICAgbG9nZ2VyLmRlYnVnKCdHZXQgQ2F0ZWdvcnkgQnkgQ29zdEhlYWRJZCBvZiBQcm9qZWN0IElEIDogJytwcm9qZWN0SWQrJyBCdWlsZGluZyBJRCA6ICcrYnVpbGRpbmdJZCk7XHJcbiAgICAgICAgICBuZXh0KG5ldyBSZXNwb25zZSgyMDAscmVzdWx0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICBuZXh0KG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oZS5tZXNzYWdlLGUuc3RhY2spKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldFdvcmtJdGVtTGlzdE9mQnVpbGRpbmdDYXRlZ29yeShyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdnZXRXb3JraXRlbUxpc3QgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgICAgbGV0IGJ1aWxkaW5nSWQgPSByZXEucGFyYW1zLmJ1aWxkaW5nSWQ7XHJcbiAgICAgIGxldCBjb3N0SGVhZElkID0gcGFyc2VJbnQocmVxLnBhcmFtcy5jb3N0SGVhZElkKTtcclxuICAgICAgbGV0IGNhdGVnb3J5SWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNhdGVnb3J5SWQpO1xyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgcHJvamVjdFNlcnZpY2UuZ2V0V29ya0l0ZW1MaXN0T2ZCdWlsZGluZ0NhdGVnb3J5KHByb2plY3RJZCwgYnVpbGRpbmdJZCwgY29zdEhlYWRJZCwgY2F0ZWdvcnlJZCwgdXNlciwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy9HZXQgd29ya2l0ZW1zIGZvciBwZXJ0aWN1bGFyIGNhdGVnb3J5IG9mIHByb2plY3QgY29zdCBoZWFkXHJcbiAgZ2V0V29ya0l0ZW1MaXN0T2ZQcm9qZWN0Q2F0ZWdvcnkocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsb2dnZXIuaW5mbygnZ2V0V29ya2l0ZW1MaXN0T2ZQcm9qZWN0Q29zdEhlYWQgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgICAgbGV0IGNvc3RIZWFkSWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNvc3RIZWFkSWQpO1xyXG4gICAgICBsZXQgY2F0ZWdvcnlJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY2F0ZWdvcnlJZCk7XHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgICBwcm9qZWN0U2VydmljZS5nZXRXb3JrSXRlbUxpc3RPZlByb2plY3RDYXRlZ29yeShwcm9qZWN0SWQsIGNvc3RIZWFkSWQsIGNhdGVnb3J5SWQsIHVzZXIsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBuZXh0KG5ldyBSZXNwb25zZSgyMDAscmVzdWx0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICBuZXh0KG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oZS5tZXNzYWdlLGUuc3RhY2spKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFkZFdvcmtpdGVtKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ2FkZFdvcmtpdGVtIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIGxldCBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgICBsZXQgY29zdEhlYWRJZCA6IG51bWJlciA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY29zdEhlYWRJZCk7XHJcbiAgICAgIGxldCBjYXRlZ29yeUlkIDogbnVtYmVyID0gcGFyc2VJbnQocmVxLnBhcmFtcy5jYXRlZ29yeUlkKTtcclxuICAgICAgbGV0IHdvcmtJdGVtOiBXb3JrSXRlbSA9IG5ldyBXb3JrSXRlbShyZXEuYm9keS5uYW1lLCByZXEuYm9keS5yYXRlQW5hbHlzaXNJZCk7XHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgICBwcm9qZWN0U2VydmljZS5hZGRXb3JraXRlbSggcHJvamVjdElkLCBidWlsZGluZ0lkLCBjb3N0SGVhZElkLCBjYXRlZ29yeUlkLCB3b3JrSXRlbSwgdXNlciwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZihlcnJvclxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYWRkQ2F0ZWdvcnlCeUNvc3RIZWFkSWQocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBjb250cm9sbGVyLCBhZGRDYXRlZ29yeUJ5Q29zdEhlYWRJZCBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBsZXQgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgICAgbGV0IGNvc3RIZWFkSWQgPSByZXEucGFyYW1zLmNvc3RIZWFkSWQ7XHJcbiAgICAgIGxldCBjYXRlZ29yeURldGFpbHMgPSByZXEuYm9keTtcclxuXHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG5cclxuICAgICAgcHJvamVjdFNlcnZpY2UuYWRkQ2F0ZWdvcnlCeUNvc3RIZWFkSWQocHJvamVjdElkLCBidWlsZGluZ0lkLCBjb3N0SGVhZElkLCBjYXRlZ29yeURldGFpbHMsIHVzZXIsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnR2V0IFF1YW50aXR5IHN1Y2Nlc3MnKTtcclxuICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnR2V0dGluZyBRdWFudGl0eSBvZiBQcm9qZWN0IElEIDogJytwcm9qZWN0SWQrJyBCdWlsZGluZyBJRCA6ICcrYnVpbGRpbmdJZCk7XHJcbiAgICAgICAgICBuZXh0KG5ldyBSZXNwb25zZSgyMDAscmVzdWx0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICBuZXh0KG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oZS5tZXNzYWdlLGUuc3RhY2spKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vR2V0IGFjdGl2ZSBjYXRlZ29yaWVzIGZyb20gZGF0YWJhc2VcclxuICBnZXRDYXRlZ29yaWVzT2ZCdWlsZGluZ0Nvc3RIZWFkKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3QgY29udHJvbGxlciwgR2V0IEFjdGl2ZSBDYXRlZ29yaWVzIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIGxldCBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgICBsZXQgY29zdEhlYWRJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY29zdEhlYWRJZCk7XHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgICBwcm9qZWN0U2VydmljZS5nZXRDYXRlZ29yaWVzT2ZCdWlsZGluZ0Nvc3RIZWFkKHByb2plY3RJZCwgYnVpbGRpbmdJZCwgY29zdEhlYWRJZCwgdXNlciwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy9HZXQgY2F0ZWdvcmllcyBvZiBwcm9qZWN0Q29zdEhlYWRzIGZyb20gZGF0YWJhc2VcclxuICBnZXRDYXRlZ29yaWVzT2ZQcm9qZWN0Q29zdEhlYWQocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBjb250cm9sbGVyLCBHZXQgUHJvamVjdCBDb3N0SGVhZCBDYXRlZ29yaWVzIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIGxldCBjb3N0SGVhZElkID0gcGFyc2VJbnQocmVxLnBhcmFtcy5jb3N0SGVhZElkKTtcclxuICAgICAgbGV0IHByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLmdldENhdGVnb3JpZXNPZlByb2plY3RDb3N0SGVhZChwcm9qZWN0SWQsIGNvc3RIZWFkSWQsIHVzZXIsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBuZXh0KG5ldyBSZXNwb25zZSgyMDAscmVzdWx0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICBuZXh0KG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oZS5tZXNzYWdlLGUuc3RhY2spKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldENvc3RIZWFkRGV0YWlsc09mQnVpbGRpbmcocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBjb250cm9sbGVyLCBHZXQgUHJvamVjdCBDb3N0SGVhZCBDYXRlZ29yaWVzIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIGxldCBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgICBsZXQgY29zdEhlYWRJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY29zdEhlYWRJZCk7XHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgICBwcm9qZWN0U2VydmljZS5nZXRDb3N0SGVhZERldGFpbHNPZkJ1aWxkaW5nKHByb2plY3RJZCwgYnVpbGRpbmdJZCwgY29zdEhlYWRJZCwgdXNlciwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy9VcGRhdGUgc3RhdHVzICggdHJ1ZS9mYWxzZSApIG9mIGNhdGVnb3J5XHJcbiAgdXBkYXRlQ2F0ZWdvcnlTdGF0dXMocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBjb250cm9sbGVyLCB1cGRhdGUgQ2F0ZWdvcnkgU3RhdHVzIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIGxldCBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgICBsZXQgY29zdEhlYWRJZCA9IHBhcnNlRmxvYXQocmVxLnBhcmFtcy5jb3N0SGVhZElkKTtcclxuICAgICAgbGV0IGNhdGVnb3J5SWQgPXBhcnNlRmxvYXQocmVxLnBhcmFtcy5jYXRlZ29yeUlkKTtcclxuICAgICAgbGV0IGNhdGVnb3J5QWN0aXZlU3RhdHVzID0gcmVxLnBhcmFtcy5hY3RpdmVTdGF0dXMgPT09ICd0cnVlJyA/IHRydWUgOiBmYWxzZTtcclxuXHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG5cclxuICAgICAgcHJvamVjdFNlcnZpY2UudXBkYXRlQ2F0ZWdvcnlTdGF0dXMoIHByb2plY3RJZCwgYnVpbGRpbmdJZCwgY29zdEhlYWRJZCwgY2F0ZWdvcnlJZCwgY2F0ZWdvcnlBY3RpdmVTdGF0dXMsXHJcbiAgICAgICAgdXNlciwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbG9nZ2VyLmluZm8oJ1VwZGF0ZSBDYXRlZ29yeSBTdGF0dXMgc3VjY2VzcycpO1xyXG4gICAgICAgICAgICBsb2dnZXIuZGVidWcoJ1VwZGF0ZSBDYXRlZ29yeSBTdGF0dXMgc3VjY2VzcyBvZiBQcm9qZWN0IElEIDogJytwcm9qZWN0SWQrJyBCdWlsZGluZyBJRCA6ICcrYnVpbGRpbmdJZCk7XHJcbiAgICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICBuZXh0KG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oZS5tZXNzYWdlLGUuc3RhY2spKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHN5bmNQcm9qZWN0V2l0aFJhdGVBbmFseXNpc0RhdGEocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBjb250cm9sbGVyLCBzeW5jQnVpbGRpbmdXaXRoUmF0ZUFuYWx5c2lzRGF0YSBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBsZXQgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuXHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG5cclxuICAgICAgcHJvamVjdFNlcnZpY2Uuc3luY1Byb2plY3RXaXRoUmF0ZUFuYWx5c2lzRGF0YSggcHJvamVjdElkLCBidWlsZGluZ0lkLCB1c2VyLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBsb2dnZXIuZXJyb3IoJ3N5bmNQcm9qZWN0V2l0aFJhdGVBbmFseXNpc0RhdGEgZmFpbHVyZScpO1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdzeW5jUHJvamVjdFdpdGhSYXRlQW5hbHlzaXNEYXRhIHN1Y2Nlc3MnKTtcclxuICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnR2V0dGluZyBzeW5jUHJvamVjdFdpdGhSYXRlQW5hbHlzaXNEYXRhIG9mIFByb2plY3QgSUQgOiAnK3Byb2plY3RJZCsnIEJ1aWxkaW5nIElEIDogJytidWlsZGluZ0lkKTtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBuZXh0KG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oZS5tZXNzYWdlLGUuc3RhY2spKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldEJ1aWxkaW5nUmF0ZUl0ZW1zQnlPcmlnaW5hbE5hbWUocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBjb250cm9sbGVyLCBnZXRCdWlsZGluZ1JhdGVJdGVtc0J5T3JpZ2luYWxOYW1lIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIGxldCBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgICBsZXQgb3JpZ2luYWxSYXRlSXRlbU5hbWUgPSByZXEuYm9keS5vcmlnaW5hbFJhdGVJdGVtTmFtZTtcclxuICAgICAgbGV0IHByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcblxyXG4gICAgICBwcm9qZWN0U2VydmljZS5nZXRCdWlsZGluZ1JhdGVJdGVtc0J5T3JpZ2luYWxOYW1lKCBwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIG9yaWdpbmFsUmF0ZUl0ZW1OYW1lLCB1c2VyLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBsb2dnZXIuZXJyb3IoJ2dldEJ1aWxkaW5nUmF0ZUl0ZW1zQnlPcmlnaW5hbE5hbWUgZmFpbHVyZScpO1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdnZXRCdWlsZGluZ1JhdGVJdGVtc0J5T3JpZ2luYWxOYW1lIHN1Y2Nlc3MnKTtcclxuICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnR2V0dGluZyBnZXRCdWlsZGluZ1JhdGVJdGVtc0J5T3JpZ2luYWxOYW1lIG9mIFByb2plY3QgSUQgOiAnK3Byb2plY3RJZCsnIEJ1aWxkaW5nIElEIDogJytidWlsZGluZ0lkKTtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBuZXh0KG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oZS5tZXNzYWdlLGUuc3RhY2spKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldFByb2plY3RSYXRlSXRlbXNCeU9yaWdpbmFsTmFtZShyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IGNvbnRyb2xsZXIsIGdldFByb2plY3RSYXRlSXRlbXNCeU5hbWUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgICAgbGV0IG9yaWdpbmFsUmF0ZUl0ZW1OYW1lID0gcmVxLmJvZHkub3JpZ2luYWxSYXRlSXRlbU5hbWU7XHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG5cclxuICAgICAgcHJvamVjdFNlcnZpY2UuZ2V0UHJvamVjdFJhdGVJdGVtc0J5T3JpZ2luYWxOYW1lKCBwcm9qZWN0SWQsIG9yaWdpbmFsUmF0ZUl0ZW1OYW1lLCB1c2VyLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBsb2dnZXIuZXJyb3IoJ2dldFByb2plY3RSYXRlSXRlbXNCeU9yaWdpbmFsTmFtZSBmYWlsdXJlJyk7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbG9nZ2VyLmluZm8oJ2dldFByb2plY3RSYXRlSXRlbXNCeU9yaWdpbmFsTmFtZSBzdWNjZXNzJyk7XHJcbiAgICAgICAgICBsb2dnZXIuZGVidWcoJ0dldHRpbmcgZ2V0UHJvamVjdFJhdGVJdGVtc0J5T3JpZ2luYWxOYW1lIG9mIFByb2plY3QgSUQgOiAnK3Byb2plY3RJZCk7XHJcbiAgICAgICAgICBuZXh0KG5ldyBSZXNwb25zZSgyMDAscmVzdWx0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhZGRBdHRhY2htZW50VG9CdWlsZGluZ1dvcmtJdGVtKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGV4cHJlc3MuTmV4dEZ1bmN0aW9uKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgdmFyIHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICB2YXIgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgICAgbGV0IGNvc3RIZWFkSWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNvc3RIZWFkSWQpO1xyXG4gICAgICBsZXQgY2F0ZWdvcnlJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY2F0ZWdvcnlJZCk7XHJcbiAgICAgIGxldCB3b3JrSXRlbUlkID0gcGFyc2VJbnQocmVxLnBhcmFtcy53b3JrSXRlbUlkKTtcclxuICAgICAgbGV0IGNjV29ya0l0ZW1JZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY2NXb3JrSXRlbUlkKTtcclxuICAgICAgbGV0IGZpbGVEYXRhID0gcmVxO1xyXG4gICAgICBwcm9qZWN0U2VydmljZS5hZGRBdHRhY2htZW50VG9Xb3JrSXRlbSggcHJvamVjdElkLCBidWlsZGluZ0lkICxjb3N0SGVhZElkLCBjYXRlZ29yeUlkLCB3b3JrSXRlbUlkLFxyXG4gICAgICAgIGNjV29ya0l0ZW1JZCwgZmlsZURhdGEgLChlcnJvciwgcmVzcG9uc2UpID0+IHtcclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZCh7cmVzcG9uc2V9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBuZXh0KHtcclxuICAgICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgc3RhY2tUcmFjZTogZSxcclxuICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXRQcmVzZW50RmlsZXNGb3JCdWlsZGluZ1dvcmtJdGVtKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGV4cHJlc3MuTmV4dEZ1bmN0aW9uKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgdmFyIHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICB2YXIgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgICAgbGV0IGNvc3RIZWFkSWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNvc3RIZWFkSWQpO1xyXG4gICAgICBsZXQgY2F0ZWdvcnlJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY2F0ZWdvcnlJZCk7XHJcbiAgICAgIGxldCB3b3JrSXRlbUlkID0gcGFyc2VJbnQocmVxLnBhcmFtcy53b3JrSXRlbUlkKTtcclxuICAgICAgbGV0IGNjV29ya0l0ZW1JZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY2NXb3JrSXRlbUlkKTtcclxuICAgICAgcHJvamVjdFNlcnZpY2UuZ2V0UHJlc2VudEZpbGVzRm9yQnVpbGRpbmdXb3JrSXRlbShwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIGNvc3RIZWFkSWQsIGNhdGVnb3J5SWQsXHJcbiAgICAgICAgd29ya0l0ZW1JZCwgY2NXb3JrSXRlbUlkLChlcnJvciwgcmVzcG9uc2UpID0+IHtcclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZCh7cmVzcG9uc2V9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBuZXh0KHtcclxuICAgICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgc3RhY2tUcmFjZTogZSxcclxuICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJlbW92ZUF0dGFjaG1lbnRPZkJ1aWxkaW5nV29ya0l0ZW0ocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogZXhwcmVzcy5OZXh0RnVuY3Rpb24pIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgICB2YXIgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIHZhciBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgICBsZXQgY29zdEhlYWRJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY29zdEhlYWRJZCk7XHJcbiAgICAgIGxldCBjYXRlZ29yeUlkID0gcGFyc2VJbnQocmVxLnBhcmFtcy5jYXRlZ29yeUlkKTtcclxuICAgICAgbGV0IHdvcmtJdGVtSWQgPSBwYXJzZUludChyZXEucGFyYW1zLndvcmtJdGVtSWQpO1xyXG4gICAgICBsZXQgY2NXb3JrSXRlbUlkID0gcGFyc2VJbnQocmVxLnBhcmFtcy5jY1dvcmtJdGVtSWQpO1xyXG4gICAgICBsZXQgYXNzaWduZWRGaWxlTmFtZSA9IHJlcS5ib2R5LmFzc2lnbmVkRmlsZU5hbWU7XHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLnJlbW92ZUF0dGFjaG1lbnRPZkJ1aWxkaW5nV29ya0l0ZW0ocHJvamVjdElkLCBidWlsZGluZ0lkLCBjb3N0SGVhZElkLFxyXG4gICAgICAgIGNhdGVnb3J5SWQsIHdvcmtJdGVtSWQsIGNjV29ya0l0ZW1JZCwgYXNzaWduZWRGaWxlTmFtZSwoZXJyb3IsIHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoe3Jlc3BvbnNlfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgbmV4dCh7XHJcbiAgICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICAgIHN0YWNrVHJhY2U6IGUsXHJcbiAgICAgICAgY29kZTogNDAzXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYWRkQXR0YWNobWVudFRvUHJvamVjdFdvcmtJdGVtKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGV4cHJlc3MuTmV4dEZ1bmN0aW9uKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgdmFyIHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBsZXQgY29zdEhlYWRJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY29zdEhlYWRJZCk7XHJcbiAgICAgIGxldCBjYXRlZ29yeUlkID0gcGFyc2VJbnQocmVxLnBhcmFtcy5jYXRlZ29yeUlkKTtcclxuICAgICAgbGV0IHdvcmtJdGVtSWQgPSBwYXJzZUludChyZXEucGFyYW1zLndvcmtJdGVtSWQpO1xyXG4gICAgICBsZXQgY2NXb3JrSXRlbUlkID0gcGFyc2VJbnQocmVxLnBhcmFtcy5jY1dvcmtJdGVtSWQpO1xyXG4gICAgICBsZXQgZmlsZURhdGEgPSByZXE7XHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLmFkZEF0dGFjaG1lbnRUb1Byb2plY3RXb3JrSXRlbSggcHJvamVjdElkLCBjb3N0SGVhZElkLCBjYXRlZ29yeUlkLFxyXG4gICAgICAgIHdvcmtJdGVtSWQsIGNjV29ya0l0ZW1JZCwgZmlsZURhdGEgLChlcnJvciwgcmVzcG9uc2UpID0+IHtcclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZCh7cmVzcG9uc2V9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBuZXh0KHtcclxuICAgICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgc3RhY2tUcmFjZTogZSxcclxuICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGdldFByZXNlbnRGaWxlc0ZvclByb2plY3RXb3JrSXRlbShyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBleHByZXNzLk5leHRGdW5jdGlvbikge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbGV0IHByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcbiAgICAgIHZhciBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgICAgbGV0IGNvc3RIZWFkSWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNvc3RIZWFkSWQpO1xyXG4gICAgICBsZXQgY2F0ZWdvcnlJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY2F0ZWdvcnlJZCk7XHJcbiAgICAgIGxldCB3b3JrSXRlbUlkID0gcGFyc2VJbnQocmVxLnBhcmFtcy53b3JrSXRlbUlkKTtcclxuICAgICAgbGV0IGNjV29ya0l0ZW1JZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY2NXb3JrSXRlbUlkKTtcclxuICAgICAgcHJvamVjdFNlcnZpY2UuZ2V0UHJlc2VudEZpbGVzRm9yUHJvamVjdFdvcmtJdGVtKHByb2plY3RJZCwgY29zdEhlYWRJZCwgY2F0ZWdvcnlJZCxcclxuICAgICAgICB3b3JrSXRlbUlkLCBjY1dvcmtJdGVtSWQsIChlcnJvciwgcmVzcG9uc2UpID0+IHtcclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZCh7cmVzcG9uc2V9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBuZXh0KHtcclxuICAgICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgc3RhY2tUcmFjZTogZSxcclxuICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJlbW92ZUF0dGFjaG1lbnRPZlByb2plY3RXb3JrSXRlbShyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBleHByZXNzLk5leHRGdW5jdGlvbikge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbGV0IHByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcbiAgICAgIHZhciBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgICAgbGV0IGNvc3RIZWFkSWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNvc3RIZWFkSWQpO1xyXG4gICAgICBsZXQgY2F0ZWdvcnlJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY2F0ZWdvcnlJZCk7XHJcbiAgICAgIGxldCB3b3JrSXRlbUlkID0gcGFyc2VJbnQocmVxLnBhcmFtcy53b3JrSXRlbUlkKTtcclxuICAgICAgbGV0IGNjV29ya0l0ZW1JZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY2NXb3JrSXRlbUlkKTtcclxuICAgICAgbGV0IGFzc2lnbmVkRmlsZU5hbWUgPSByZXEuYm9keS5hc3NpZ25lZEZpbGVOYW1lO1xyXG4gICAgICBwcm9qZWN0U2VydmljZS5yZW1vdmVBdHRhY2htZW50T2ZQcm9qZWN0V29ya0l0ZW0ocHJvamVjdElkLGNvc3RIZWFkSWQsIGNhdGVnb3J5SWQsXHJcbiAgICAgICAgd29ya0l0ZW1JZCwgY2NXb3JrSXRlbUlkLCBhc3NpZ25lZEZpbGVOYW1lLChlcnJvciwgcmVzcG9uc2UpID0+IHtcclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZCh7cmVzcG9uc2V9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBuZXh0KHtcclxuICAgICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgc3RhY2tUcmFjZTogZSxcclxuICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbmV4cG9ydCAgPSBQcm9qZWN0Q29udHJvbGxlcjtcclxuIl19
