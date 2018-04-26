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
            var defaultRates = config.get('rate.default');
            data.rates = defaultRates;
            var projectService = new ProjectService();
            projectService.createProject(data, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info(result._doc.name + ' project is created ');
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
            var projectId_2 = req.params.projectId;
            var costHeadId_1 = parseInt(req.params.costHeadId);
            var costHeadActiveStatus_1 = req.params.activeStatus;
            projectService.setProjectCostHeadStatus(projectId_2, costHeadId_1, costHeadActiveStatus_1, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Update setProjectCostHeadStatus success ');
                    logger.debug('setProjectCostHeadStatus for Project ID : ' + projectId_2 +
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
            var buildingDetails = req.body;
            var projectService = new ProjectService();
            projectService.updateBuildingById(buildingId, buildingDetails, user, function (error, result) {
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
    ProjectController.prototype.cloneBuildingById = function (req, res, next) {
        try {
            logger.info('Project controller, cloneBuilding has been hit');
            var user = req.user;
            var buildingId = req.params.buildingId;
            var buildingDetails = req.body;
            var projectService = new ProjectService();
            projectService.cloneBuildingDetails(buildingId, buildingDetails, user, function (error, result) {
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
            var projectId_3 = req.params.projectId;
            var buildingId_1 = req.params.buildingId;
            var projectService = new ProjectService();
            projectService.getBuildingByIdForClone(projectId_3, buildingId_1, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Get Building details for clone ' + result.data.name);
                    logger.debug(result.data.name + ' Building details for clone ...ProjectID : ' + projectId_3 + ', BuildingID : ' + buildingId_1);
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
            var projectId_4 = req.params.projectId;
            var buildingId_2 = req.params.buildingId;
            var costHeadId = parseInt(req.params.costHeadId);
            var categoryId = parseInt(req.params.categoryId);
            var workItemId = parseInt(req.params.workItemId);
            var projectService = new ProjectService();
            console.log(' workitemId => ' + workItemId);
            projectService.getRate(projectId_4, buildingId_2, costHeadId, categoryId, workItemId, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Get Rate Success');
                    logger.debug('Getting Rate of Project ID : ' + projectId_4 + ' Building ID : ' + buildingId_2);
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
            var projectId_5 = req.params.projectId;
            var buildingId_3 = req.params.buildingId;
            var costHeadId = parseInt(req.params.costHeadId);
            var categoryId = parseInt(req.params.categoryId);
            var workItemId = parseInt(req.params.workItemId);
            var rate = req.body;
            var projectService = new ProjectService();
            console.log(' workitemId => ' + workItemId);
            projectService.updateRateOfBuildingCostHeads(projectId_5, buildingId_3, costHeadId, categoryId, workItemId, rate, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Get Rate Success');
                    logger.debug('Getting Rate of Project ID : ' + projectId_5 + ' Building ID : ' + buildingId_3);
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
            var directRate = req.body.directRate;
            var projectService = new ProjectService();
            projectService.updateDirectRateOfBuildingWorkItems(projectId, buildingId, costHeadId, categoryId, workItemId, directRate, user, function (error, result) {
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
            var projectId_6 = req.params.projectId;
            var costHeadId = parseInt(req.params.costHeadId);
            var categoryId = parseInt(req.params.categoryId);
            var workItemId = parseInt(req.params.workItemId);
            var rate = req.body;
            var projectService = new ProjectService();
            projectService.updateRateOfProjectCostHeads(projectId_6, costHeadId, categoryId, workItemId, rate, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Update rate of project cost heads Success');
                    logger.debug('Update rate of project cost heads of Project ID : ' + projectId_6);
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
            var projectId_7 = req.params.projectId;
            var costHeadId = parseInt(req.params.costHeadId);
            var categoryId = parseInt(req.params.categoryId);
            var workItemId = parseInt(req.params.workItemId);
            var directRate = req.body.directRate;
            var projectService = new ProjectService();
            projectService.updateDirectRateOfProjectWorkItems(projectId_7, costHeadId, categoryId, workItemId, directRate, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('update DirectRate Of Project WorkItems Success');
                    logger.debug('update DirectRate Of Project WorkItems of Project ID : ' + projectId_7);
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
            var projectId_8 = req.params.projectId;
            var buildingId_4 = req.params.buildingId;
            var costHeadId_2 = parseInt(req.params.costHeadId);
            var categoryId = parseInt(req.params.categoryId);
            var workItemId_1 = parseInt(req.params.workItemId);
            var itemName_1 = req.body.item.name;
            var projectservice = new ProjectService();
            projectservice.deleteQuantityOfBuildingCostHeadsByName(projectId_8, buildingId_4, costHeadId_2, categoryId, workItemId_1, itemName_1, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Delete Quantity ' + result);
                    logger.debug('Deleted Quantity of Project ID : ' + projectId_8 + ', Building ID : ' + buildingId_4 +
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
            var projectId_9 = req.params.projectId;
            var costHeadId_3 = parseInt(req.params.costHeadId);
            var categoryId = parseInt(req.params.categoryId);
            var workItemId_2 = parseInt(req.params.workItemId);
            var itemName_2 = req.body.item.name;
            var projectService = new ProjectService();
            projectService.deleteQuantityOfProjectCostHeadsByName(projectId_9, costHeadId_3, categoryId, workItemId_2, itemName_2, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Delete Quantity Of Project Cost Heads By Name ' + result);
                    logger.debug('Delete Quantity Of Project Cost Heads By Name of Project ID : ' + projectId_9 + ', CostHead : ' + costHeadId_3 + ', ' +
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
            var projectId_10 = req.params.projectId;
            var buildingId_5 = req.params.buildingId;
            var costHeadId_4 = parseInt(req.params.costHeadId);
            var categoryId_1 = parseInt(req.params.categoryId);
            var workItemId_3 = parseInt(req.params.workItemId);
            var projectService = new ProjectService();
            console.log(' workitem => ' + workItemId_3);
            projectService.deleteWorkitem(projectId_10, buildingId_5, costHeadId_4, categoryId_1, workItemId_3, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Delete work item ' + result.data);
                    logger.debug('Deleted  work item of Project ID : ' + projectId_10 + ', Building ID : ' + buildingId_5 +
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
            var projectId_11 = req.params.projectId;
            var buildingId_6 = req.params.buildingId;
            var costHeadId_5 = parseInt(req.params.costHeadId);
            var costHeadActiveStatus_2 = req.params.activeStatus;
            projectService.setCostHeadStatus(buildingId_6, costHeadId_5, costHeadActiveStatus_2, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Update Building CostHead Details success ');
                    logger.debug('updateBuildingCostHead for Project ID : ' + projectId_11 + ', Building ID : ' + buildingId_6 +
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
            var projectId_12 = req.params.projectId;
            var buildingId_7 = req.params.buildingId;
            var costHeadId_6 = parseInt(req.params.costHeadId);
            var categoryId = parseInt(req.params.categoryId);
            var workItemId = parseInt(req.params.workItemId);
            var workItemActiveStatus_1 = req.params.activeStatus === 'true' ? true : false;
            var projectService = new ProjectService();
            projectService.updateWorkItemStatusOfBuildingCostHeads(buildingId_7, costHeadId_6, categoryId, workItemId, workItemActiveStatus_1, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Update workItem Details success ');
                    logger.debug('update WorkItem for Project ID : ' + projectId_12 + ', Building ID : ' + buildingId_7 +
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
            var projectId_13 = req.params.projectId;
            var costHeadId_7 = parseInt(req.params.costHeadId);
            var categoryId = parseInt(req.params.categoryId);
            var workItemId = parseInt(req.params.workItemId);
            var workItemActiveStatus_2 = req.params.activeStatus === 'true' ? true : false;
            var projectService = new ProjectService();
            projectService.updateWorkItemStatusOfProjectCostHeads(projectId_13, costHeadId_7, categoryId, workItemId, workItemActiveStatus_2, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Update WorkItem Status Of Project Cost Heads success ');
                    logger.debug('Update WorkItem Status Of Project Cost Heads for Project ID : ' + projectId_13 + ' CostHead : ' + costHeadId_7 + ', ' +
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
    ProjectController.prototype.addCostHeadBuilding = function (req, res, next) {
        try {
            logger.info('Project controller, addCostHeadBuilding has been hit');
            var user = req.user;
            var buildingId_8 = req.params.buildingId;
            var costHeadDetails = req.body;
            var projectService = new ProjectService();
            var query = { $push: { costHead: costHeadDetails } };
            projectService.updateBuildingById(buildingId_8, query, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Add CostHead Building success');
                    logger.debug('Added CostHead for Building ID : ' + buildingId_8);
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
            var quantityDetails = req.body.item;
            var projectService = new ProjectService();
            projectService.updateQuantityOfBuildingCostHeads(projectId, buildingId, costHeadId, categoryId, workItemId, quantityDetails, user, function (error, result) {
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
            var directQuantity = req.body.directQuantity;
            var projectService = new ProjectService();
            projectService.updateDirectQuantityOfBuildingWorkItems(projectId, buildingId, costHeadId, categoryId, workItemId, directQuantity, user, function (error, result) {
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
            var directQuantity = req.body.directQuantity;
            var projectService = new ProjectService();
            projectService.updateDirectQuantityOfProjectWorkItems(projectId, costHeadId, categoryId, workItemId, directQuantity, user, function (error, result) {
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
    ProjectController.prototype.updateQuantityOfProjectCostHeads = function (req, res, next) {
        try {
            logger.info('Project controller, Update Quantity Of Project Cost Heads has been hit');
            var user = req.user;
            var projectId = req.params.projectId;
            var costHeadId = parseInt(req.params.costHeadId);
            var categoryId = parseInt(req.params.categoryId);
            var workItemId = parseInt(req.params.workItemId);
            var quantityDetails = req.body.item;
            var projectService = new ProjectService();
            projectService.updateQuantityOfProjectCostHeads(projectId, costHeadId, categoryId, workItemId, quantityDetails, user, function (error, result) {
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
            var projectId_14 = req.params.projectId;
            var buildingId_9 = req.params.buildingId;
            var costHeadId = req.params.costHeadId;
            var projectService = new ProjectService();
            projectService.getInActiveCategoriesByCostHeadId(projectId_14, buildingId_9, costHeadId, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Get Category By CostHeadId success');
                    logger.debug('Get Category By CostHeadId of Project ID : ' + projectId_14 + ' Building ID : ' + buildingId_9);
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
            var projectId_15 = req.params.projectId;
            var buildingId_10 = req.params.buildingId;
            var costHeadId = req.params.costHeadId;
            var categoryDetails = req.body;
            var projectService = new ProjectService();
            projectService.addCategoryByCostHeadId(projectId_15, buildingId_10, costHeadId, categoryDetails, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Get Quantity success');
                    logger.debug('Getting Quantity of Project ID : ' + projectId_15 + ' Building ID : ' + buildingId_10);
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
            var projectId_16 = req.params.projectId;
            var buildingId_11 = req.params.buildingId;
            var costHeadId = parseFloat(req.params.costHeadId);
            var categoryId = parseFloat(req.params.categoryId);
            var categoryActiveStatus = req.params.activeStatus === 'true' ? true : false;
            var projectService = new ProjectService();
            projectService.updateCategoryStatus(projectId_16, buildingId_11, costHeadId, categoryId, categoryActiveStatus, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Update Category Status success');
                    logger.debug('Update Category Status success of Project ID : ' + projectId_16 + ' Building ID : ' + buildingId_11);
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
            var projectId_17 = req.params.projectId;
            var buildingId_12 = req.params.buildingId;
            var projectService = new ProjectService();
            projectService.syncProjectWithRateAnalysisData(projectId_17, buildingId_12, user, function (error, result) {
                if (error) {
                    logger.error('syncProjectWithRateAnalysisData failure');
                    next(error);
                }
                else {
                    logger.info('syncProjectWithRateAnalysisData success');
                    logger.debug('Getting syncProjectWithRateAnalysisData of Project ID : ' + projectId_17 + ' Building ID : ' + buildingId_12);
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
            var projectId_18 = req.params.projectId;
            var buildingId_13 = req.params.buildingId;
            var originalRateItemName = req.params.originalRateItemName;
            var projectService = new ProjectService();
            projectService.getBuildingRateItemsByOriginalName(projectId_18, buildingId_13, originalRateItemName, user, function (error, result) {
                if (error) {
                    logger.error('getBuildingRateItemsByOriginalName failure');
                    next(error);
                }
                else {
                    logger.info('getBuildingRateItemsByOriginalName success');
                    logger.debug('Getting getBuildingRateItemsByOriginalName of Project ID : ' + projectId_18 + ' Building ID : ' + buildingId_13);
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
            var projectId_19 = req.params.projectId;
            var originalRateItemName = req.params.originalRateItemName;
            var projectService = new ProjectService();
            projectService.getProjectRateItemsByOriginalName(projectId_19, originalRateItemName, user, function (error, result) {
                if (error) {
                    logger.error('getProjectRateItemsByOriginalName failure');
                    next(error);
                }
                else {
                    logger.info('getProjectRateItemsByOriginalName success');
                    logger.debug('Getting getProjectRateItemsByOriginalName of Project ID : ' + projectId_19);
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
            var fileData = req;
            projectService.addAttachmentToWorkItem(projectId, buildingId, costHeadId, categoryId, workItemId, fileData, function (error, response) {
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
            projectService.getPresentFilesForBuildingWorkItem(projectId, buildingId, costHeadId, categoryId, workItemId, function (error, response) {
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
            var assignedFileName = req.body.assignedFileName;
            projectService.removeAttachmentOfBuildingWorkItem(projectId, buildingId, costHeadId, categoryId, workItemId, assignedFileName, function (error, response) {
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
            var fileData = req;
            projectService.addAttachmentToProjectWorkItem(projectId, costHeadId, categoryId, workItemId, fileData, function (error, response) {
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
            projectService.getPresentFilesForProjectWorkItem(projectId, costHeadId, categoryId, workItemId, function (error, response) {
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
            var assignedFileName = req.body.assignedFileName;
            projectService.removeAttachmentOfProjectWorkItem(projectId, costHeadId, categoryId, workItemId, assignedFileName, function (error, response) {
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHBsaWNhdGlvblByb2plY3QvY29udHJvbGxlcnMvUHJvamVjdENvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLDZEQUFnRTtBQUdoRSwyREFBOEQ7QUFDOUQsMEVBQTZFO0FBRzdFLHdFQUEyRTtBQUMzRSxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDL0IsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLElBQUksTUFBTSxHQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUdsRDtJQUdFO1FBQ0UsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO0lBRTlDLENBQUM7SUFFRCx5Q0FBYSxHQUFiLFVBQWMsR0FBb0IsRUFBRSxHQUFxQixFQUFFLElBQVM7UUFDbEUsSUFBSSxDQUFDO1lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO1lBQ3RELElBQUksSUFBSSxHQUFhLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFDOUIsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztZQUVwQixJQUFJLFlBQVksR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQzlDLElBQUksQ0FBQyxLQUFLLEdBQUcsWUFBWSxDQUFDO1lBRTFCLElBQUksY0FBYyxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7WUFDMUMsY0FBYyxDQUFDLGFBQWEsQ0FBRSxJQUFJLEVBQUUsSUFBSSxFQUFDLFVBQUMsS0FBSyxFQUFFLE1BQU07Z0JBQ3JELEVBQUUsQ0FBQSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ1QsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNkLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ04sTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENB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Z0IsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDO1lBQ2pELGNBQWMsQ0FBQyxpQ0FBaUMsQ0FBQyxTQUFTLEVBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUMsZ0JBQWdCLEVBQUMsVUFBQyxLQUFLLEVBQUUsUUFBUTtnQkFDN0gsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDVixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2QsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDTixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLFFBQVEsVUFBQSxFQUFDLENBQUMsQ0FBQztnQkFDbkMsQ0FBQztZQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDWCxJQUFJLENBQUM7Z0JBQ0gsTUFBTSxFQUFFLENBQUMsQ0FBQyxPQUFPO2dCQUNqQixPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU87Z0JBQ2xCLFVBQVUsRUFBRSxDQUFDO2dCQUNiLElBQUksRUFBRSxHQUFHO2FBQ1YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztJQUNILENBQUM7SUFDSCx3QkFBQztBQUFELENBcnFDQSxBQXFxQ0MsSUFBQTtBQUNELGlCQUFVLGlCQUFpQixDQUFDIiwiZmlsZSI6ImFwcC9hcHBsaWNhdGlvblByb2plY3QvY29udHJvbGxlcnMvUHJvamVjdENvbnRyb2xsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xyXG5pbXBvcnQgUHJvamVjdFNlcnZpY2UgPSByZXF1aXJlKCcuLy4uL3NlcnZpY2VzL1Byb2plY3RTZXJ2aWNlJyk7XHJcbmltcG9ydCBQcm9qZWN0ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb25nb29zZS9Qcm9qZWN0Jyk7XHJcbmltcG9ydCBCdWlsZGluZyA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9uZ29vc2UvQnVpbGRpbmcnKTtcclxuaW1wb3J0IFJlc3BvbnNlID0gcmVxdWlyZSgnLi4vaW50ZXJjZXB0b3IvcmVzcG9uc2UvUmVzcG9uc2UnKTtcclxuaW1wb3J0IENvc3RDb250cm9sbEV4Y2VwdGlvbiA9IHJlcXVpcmUoJy4uL2V4Y2VwdGlvbi9Db3N0Q29udHJvbGxFeGNlcHRpb24nKTtcclxuaW1wb3J0IENvc3RIZWFkID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L2J1aWxkaW5nL0Nvc3RIZWFkJyk7XHJcbmltcG9ydCBSYXRlID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L2J1aWxkaW5nL1JhdGUnKTtcclxuaW1wb3J0IFdvcmtJdGVtID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L2J1aWxkaW5nL1dvcmtJdGVtJyk7XHJcbmxldCBjb25maWcgPSByZXF1aXJlKCdjb25maWcnKTtcclxubGV0IGxvZzRqcyA9IHJlcXVpcmUoJ2xvZzRqcycpO1xyXG5sZXQgbG9nZ2VyPWxvZzRqcy5nZXRMb2dnZXIoJ1Byb2plY3QgQ29udHJvbGxlcicpO1xyXG5cclxuXHJcbmNsYXNzIFByb2plY3RDb250cm9sbGVyIHtcclxuICBwcml2YXRlIF9wcm9qZWN0U2VydmljZSA6IFByb2plY3RTZXJ2aWNlO1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuX3Byb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcblxyXG4gIH1cclxuXHJcbiAgY3JlYXRlUHJvamVjdChyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IGNvbnRyb2xsZXIgY3JlYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBsZXQgZGF0YSA9ICA8UHJvamVjdD5yZXEuYm9keTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuXHJcbiAgICAgIGxldCBkZWZhdWx0UmF0ZXMgPSBjb25maWcuZ2V0KCdyYXRlLmRlZmF1bHQnKTtcclxuICAgICAgZGF0YS5yYXRlcyA9IGRlZmF1bHRSYXRlcztcclxuXHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgICBwcm9qZWN0U2VydmljZS5jcmVhdGVQcm9qZWN0KCBkYXRhLCB1c2VyLChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbyhyZXN1bHQuX2RvYy5uYW1lKycgcHJvamVjdCBpcyBjcmVhdGVkICcpO1xyXG4gICAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLHJlc3VsdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoIChlKSAge1xyXG4gICAgICBsb2dnZXIuZXJyb3IoZSk7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0UHJvamVjdEJ5SWQocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBjb250cm9sbGVyIGdldFByb2plY3QgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcHJvamVjdElkID0gIHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBwcm9qZWN0U2VydmljZS5nZXRQcm9qZWN0QnlJZChwcm9qZWN0SWQsIHVzZXIsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnR2V0dGluZyBwcm9qZWN0ICcrcmVzdWx0LmRhdGFbMF0ubmFtZSk7XHJcbiAgICAgICAgICBsb2dnZXIuZGVidWcoJ0dldHRpbmcgcHJvamVjdCBQcm9qZWN0IElEIDogJytwcm9qZWN0SWQrJywgUHJvamVjdCBOYW1lIDogJytyZXN1bHQuZGF0YVswXS5uYW1lKTtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdXBkYXRlUHJvamVjdEJ5SWQocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBjb250cm9sbGVyLCB1cGRhdGVQcm9qZWN0RGV0YWlscyBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbGV0IHByb2plY3REZXRhaWxzID0gPFByb2plY3Q+cmVxLmJvZHk7XHJcbiAgICAgIHByb2plY3REZXRhaWxzWydfaWQnXSA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgcHJvamVjdFNlcnZpY2UudXBkYXRlUHJvamVjdEJ5SWQoIHByb2plY3REZXRhaWxzLCB1c2VyLCAoZXJyb3IsIHJlc3VsdCk9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnVXBkYXRlIHByb2plY3QgJytyZXN1bHQuZGF0YS5uYW1lKTtcclxuICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnVXBkYXRlZCBQcm9qZWN0IE5hbWUgOiAnK3Jlc3VsdC5kYXRhLm5hbWUpO1xyXG4gICAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLHJlc3VsdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXRJbkFjdGl2ZVByb2plY3RDb3N0SGVhZHMocmVxOmV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IGNvbnRyb2xsZXIsIGdldEluQWN0aXZlQ29zdEhlYWQgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgICAgbGV0IHByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLmdldEluQWN0aXZlUHJvamVjdENvc3RIZWFkcyggcHJvamVjdElkLCB1c2VyLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdHZXQgSW5BY3RpdmUgQ29zdEhlYWQgc3VjY2VzcycpO1xyXG4gICAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLCByZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBuZXh0KG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oZS5tZXNzYWdlLCBlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZXRQcm9qZWN0Q29zdEhlYWRTdGF0dXMocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBjb250cm9sbGVyLCBzZXRQcm9qZWN0Q29zdEhlYWRTdGF0dXMgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHByb2plY3RJZCA9ICByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgICAgbGV0IGNvc3RIZWFkSWQgPSAgcGFyc2VJbnQocmVxLnBhcmFtcy5jb3N0SGVhZElkKTtcclxuICAgICAgbGV0IGNvc3RIZWFkQWN0aXZlU3RhdHVzID0gcmVxLnBhcmFtcy5hY3RpdmVTdGF0dXM7XHJcblxyXG4gICAgICBwcm9qZWN0U2VydmljZS5zZXRQcm9qZWN0Q29zdEhlYWRTdGF0dXMoIHByb2plY3RJZCwgY29zdEhlYWRJZCwgY29zdEhlYWRBY3RpdmVTdGF0dXMsIHVzZXIsKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdVcGRhdGUgc2V0UHJvamVjdENvc3RIZWFkU3RhdHVzIHN1Y2Nlc3MgJyk7XHJcbiAgICAgICAgICBsb2dnZXIuZGVidWcoJ3NldFByb2plY3RDb3N0SGVhZFN0YXR1cyBmb3IgUHJvamVjdCBJRCA6ICcrcHJvamVjdElkK1xyXG4gICAgICAgICAgICAnLCBDb3N0SGVhZCA6ICcrY29zdEhlYWRJZCsnLCBjb3N0SGVhZEFjdGl2ZVN0YXR1cyA6ICcrY29zdEhlYWRBY3RpdmVTdGF0dXMpO1xyXG4gICAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLHJlc3VsdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjcmVhdGVCdWlsZGluZyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IGNvbnRyb2xsZXIsIGFkZEJ1aWxkaW5nIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIGxldCBidWlsZGluZ0RldGFpbHMgPSA8QnVpbGRpbmc+IHJlcS5ib2R5O1xyXG5cclxuICAgICAgbGV0IHByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLmNyZWF0ZUJ1aWxkaW5nKCBwcm9qZWN0SWQsIGJ1aWxkaW5nRGV0YWlscywgdXNlciwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdBZGQgQnVpbGRpbmcgJytyZXN1bHQuZGF0YS5fZG9jLm5hbWUpO1xyXG4gICAgICAgICAgbG9nZ2VyLmRlYnVnKCdBZGRlZCBCdWlsZGluZyBOYW1lIDogJytyZXN1bHQuZGF0YS5fZG9jLm5hbWUpO1xyXG4gICAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLHJlc3VsdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB1cGRhdGVCdWlsZGluZ0J5SWQocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBjb250cm9sbGVyLCB1cGRhdGVCdWlsZGluZyBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IGJ1aWxkaW5nSWQgPSByZXEucGFyYW1zLmJ1aWxkaW5nSWQ7XHJcbiAgICAgIGxldCBidWlsZGluZ0RldGFpbHMgPSA8QnVpbGRpbmc+IHJlcS5ib2R5O1xyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgcHJvamVjdFNlcnZpY2UudXBkYXRlQnVpbGRpbmdCeUlkKCBidWlsZGluZ0lkLCBidWlsZGluZ0RldGFpbHMsIHVzZXIsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnVXBkYXRlIEJ1aWxkaW5nICcrcmVzdWx0LmRhdGEuX2RvYy5uYW1lKTtcclxuICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnVXBkYXRlZCBCdWlsZGluZyBOYW1lIDogJytyZXN1bHQuZGF0YS5fZG9jLm5hbWUpO1xyXG4gICAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLHJlc3VsdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjbG9uZUJ1aWxkaW5nQnlJZChyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IGNvbnRyb2xsZXIsIGNsb25lQnVpbGRpbmcgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgICBsZXQgYnVpbGRpbmdEZXRhaWxzID0gPEJ1aWxkaW5nPiByZXEuYm9keTtcclxuICAgICAgbGV0IHByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLmNsb25lQnVpbGRpbmdEZXRhaWxzKCBidWlsZGluZ0lkLCBidWlsZGluZ0RldGFpbHMsIHVzZXIsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnQ2xvbmUgQnVpbGRpbmcgJytyZXN1bHQuZGF0YS5uYW1lKTtcclxuICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnQ2xvbmVkIEJ1aWxkaW5nIE5hbWUgOiAnK3Jlc3VsdC5kYXRhLm5hbWUpO1xyXG4gICAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLHJlc3VsdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXRCdWlsZGluZ0J5SWQocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBjb250cm9sbGVyLCBnZXRCdWlsZGluZyBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBsZXQgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgICAgbGV0IHByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLmdldEJ1aWxkaW5nQnlJZCggcHJvamVjdElkLCBidWlsZGluZ0lkLCB1c2VyLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbG9nZ2VyLmluZm8oJ0dldCBCdWlsZGluZyAnK3Jlc3VsdC5kYXRhLm5hbWUpO1xyXG4gICAgICAgICAgbG9nZ2VyLmRlYnVnKCdHZXQgQnVpbGRpbmcgTmFtZSA6ICcrcmVzdWx0LmRhdGEubmFtZSk7XHJcbiAgICAgICAgICBuZXh0KG5ldyBSZXNwb25zZSgyMDAscmVzdWx0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICBuZXh0KG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oZS5tZXNzYWdlLGUuc3RhY2spKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldEJ1aWxkaW5nQnlJZEZvckNsb25lKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3QgY29udHJvbGxlciwgZ2V0QnVpbGRpbmdEZXRhaWxzRm9yQ2xvbmUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgICAgbGV0IGJ1aWxkaW5nSWQgPSByZXEucGFyYW1zLmJ1aWxkaW5nSWQ7XHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgICBwcm9qZWN0U2VydmljZS5nZXRCdWlsZGluZ0J5SWRGb3JDbG9uZSggcHJvamVjdElkLCBidWlsZGluZ0lkLCB1c2VyLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbG9nZ2VyLmluZm8oJ0dldCBCdWlsZGluZyBkZXRhaWxzIGZvciBjbG9uZSAnK3Jlc3VsdC5kYXRhLm5hbWUpO1xyXG4gICAgICAgICAgbG9nZ2VyLmRlYnVnKHJlc3VsdC5kYXRhLm5hbWUrJyBCdWlsZGluZyBkZXRhaWxzIGZvciBjbG9uZSAuLi5Qcm9qZWN0SUQgOiAnK3Byb2plY3RJZCsnLCBCdWlsZGluZ0lEIDogJytidWlsZGluZ0lkKTtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0SW5BY3RpdmVDb3N0SGVhZChyZXE6ZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3QgY29udHJvbGxlciwgZ2V0SW5BY3RpdmVDb3N0SGVhZCBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBsZXQgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgICAgbGV0IHByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLmdldEluQWN0aXZlQ29zdEhlYWQoIHByb2plY3RJZCwgYnVpbGRpbmdJZCwgdXNlciwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnR2V0IEluQWN0aXZlIENvc3RIZWFkIHN1Y2Nlc3MnKTtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCwgcmVzdWx0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSwgZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0SW5BY3RpdmVXb3JrSXRlbXNPZkJ1aWxkaW5nQ29zdEhlYWRzKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ2dldEluQWN0aXZlV29ya0l0ZW1zIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIGxldCBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgICBsZXQgY29zdEhlYWRJZCA6IG51bWJlciA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY29zdEhlYWRJZCk7XHJcbiAgICAgIGxldCBjYXRlZ29yeUlkIDogbnVtYmVyID0gcGFyc2VJbnQocmVxLnBhcmFtcy5jYXRlZ29yeUlkKTtcclxuICAgICAgbGV0IHByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLmdldEluQWN0aXZlV29ya0l0ZW1zT2ZCdWlsZGluZ0Nvc3RIZWFkcyggcHJvamVjdElkLCBidWlsZGluZ0lkLCBjb3N0SGVhZElkLCBjYXRlZ29yeUlkLCB1c2VyLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbG9nZ2VyLmluZm8oJ0dldCBJbkFjdGl2ZSBXb3JrSXRlbSBzdWNjZXNzJyk7XHJcbiAgICAgICAgICBuZXh0KG5ldyBSZXNwb25zZSgyMDAscmVzdWx0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICBuZXh0KG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oZS5tZXNzYWdlLGUuc3RhY2spKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIEdldCBJbiBBY3RpdmUgV29ya0l0ZW1zIE9mIFByb2plY3QgQ29zdCBIZWFkc1xyXG4gIGdldEluQWN0aXZlV29ya0l0ZW1zT2ZQcm9qZWN0Q29zdEhlYWRzKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3QgQ29udHJvbGxlciwgR2V0IEluLUFjdGl2ZSBXb3JrSXRlbXMgT2YgUHJvamVjdCBDb3N0IEhlYWRzIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIGxldCBjb3N0SGVhZElkIDogbnVtYmVyID0gcGFyc2VJbnQocmVxLnBhcmFtcy5jb3N0SGVhZElkKTtcclxuICAgICAgbGV0IGNhdGVnb3J5SWQgOiBudW1iZXIgPSBwYXJzZUludChyZXEucGFyYW1zLmNhdGVnb3J5SWQpO1xyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgcHJvamVjdFNlcnZpY2UuZ2V0SW5BY3RpdmVXb3JrSXRlbXNPZlByb2plY3RDb3N0SGVhZHMoIHByb2plY3RJZCwgY29zdEhlYWRJZCwgY2F0ZWdvcnlJZCwgdXNlciwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZihlcnJvclxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdHZXQgSW4tQWN0aXZlIFdvcmtJdGVtcyBPZiBQcm9qZWN0IENvc3QgSGVhZHMgc3VjY2VzcycpO1xyXG4gICAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLHJlc3VsdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBkZWxldGVCdWlsZGluZ0J5SWQocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBjb250cm9sbGVyLCBkZWxldGVCdWlsZGluZyBoYXMgYmVlbiBoaXQnKTtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgICAgbGV0IGJ1aWxkaW5nSWQgPSByZXEucGFyYW1zLmJ1aWxkaW5nSWQ7XHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgICBwcm9qZWN0U2VydmljZS5kZWxldGVCdWlsZGluZ0J5SWQoIHByb2plY3RJZCwgYnVpbGRpbmdJZCwgdXNlciwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdCdWlsZGluZyBEZWxldGUgZnJvbSAnK3Jlc3VsdC5kYXRhLm5hbWUrICcgcHJvamVjdCcpO1xyXG4gICAgICAgICAgbG9nZ2VyLmRlYnVnKCdCdWlsZGluZyBEZWxldGVkIGZyb20gJytyZXN1bHQuZGF0YS5uYW1lKyAnIHByb2plY3QnKTtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0UmF0ZShyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IGNvbnRyb2xsZXIsIGdldFJhdGUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgICAgbGV0IGJ1aWxkaW5nSWQgPSByZXEucGFyYW1zLmJ1aWxkaW5nSWQ7XHJcbiAgICAgIGxldCBjb3N0SGVhZElkID1wYXJzZUludChyZXEucGFyYW1zLmNvc3RIZWFkSWQpO1xyXG4gICAgICBsZXQgY2F0ZWdvcnlJZCA9cGFyc2VJbnQocmVxLnBhcmFtcy5jYXRlZ29yeUlkKTtcclxuICAgICAgbGV0IHdvcmtJdGVtSWQgPXBhcnNlSW50KHJlcS5wYXJhbXMud29ya0l0ZW1JZCk7XHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgICBjb25zb2xlLmxvZygnIHdvcmtpdGVtSWQgPT4gJysgd29ya0l0ZW1JZCk7XHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLmdldFJhdGUoIHByb2plY3RJZCwgYnVpbGRpbmdJZCwgY29zdEhlYWRJZCwgY2F0ZWdvcnlJZCwgd29ya0l0ZW1JZCwgdXNlciwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdHZXQgUmF0ZSBTdWNjZXNzJyk7XHJcbiAgICAgICAgICBsb2dnZXIuZGVidWcoJ0dldHRpbmcgUmF0ZSBvZiBQcm9qZWN0IElEIDogJytwcm9qZWN0SWQrJyBCdWlsZGluZyBJRCA6ICcrYnVpbGRpbmdJZCk7XHJcbiAgICAgICAgICBuZXh0KG5ldyBSZXNwb25zZSgyMDAscmVzdWx0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICBuZXh0KG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oZS5tZXNzYWdlLGUuc3RhY2spKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHVwZGF0ZVJhdGVPZkJ1aWxkaW5nQ29zdEhlYWRzKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBsZXQgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgICAgbGV0IGNvc3RIZWFkSWQgPXBhcnNlSW50KHJlcS5wYXJhbXMuY29zdEhlYWRJZCk7XHJcbiAgICAgIGxldCBjYXRlZ29yeUlkID1wYXJzZUludChyZXEucGFyYW1zLmNhdGVnb3J5SWQpO1xyXG4gICAgICBsZXQgd29ya0l0ZW1JZCA9cGFyc2VJbnQocmVxLnBhcmFtcy53b3JrSXRlbUlkKTtcclxuICAgICAgbGV0IHJhdGUgOiBSYXRlID0gPFJhdGU+IHJlcS5ib2R5O1xyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgY29uc29sZS5sb2coJyB3b3JraXRlbUlkID0+ICcrIHdvcmtJdGVtSWQpO1xyXG4gICAgICBwcm9qZWN0U2VydmljZS51cGRhdGVSYXRlT2ZCdWlsZGluZ0Nvc3RIZWFkcyggcHJvamVjdElkLCBidWlsZGluZ0lkLCBjb3N0SGVhZElkLGNhdGVnb3J5SWQgLFxyXG4gICAgICAgIHdvcmtJdGVtSWQsIHJhdGUsIHVzZXIsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnR2V0IFJhdGUgU3VjY2VzcycpO1xyXG4gICAgICAgICAgbG9nZ2VyLmRlYnVnKCdHZXR0aW5nIFJhdGUgb2YgUHJvamVjdCBJRCA6ICcrcHJvamVjdElkKycgQnVpbGRpbmcgSUQgOiAnK2J1aWxkaW5nSWQpO1xyXG4gICAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLHJlc3VsdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvL1VwZGF0ZSBEaXJlY3QgUmF0ZSBvZiBCdWlsZGluZyBDb3N0aGVhZHNcclxuICB1cGRhdGVEaXJlY3RSYXRlT2ZCdWlsZGluZ1dvcmtJdGVtcyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IGNvbnRyb2xsZXIsIHVwZGF0ZSBEaXJlY3RSYXRlIE9mIEJ1aWxkaW5nIFdvcmtJdGVtcyBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBsZXQgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgICAgbGV0IGNvc3RIZWFkSWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNvc3RIZWFkSWQpO1xyXG4gICAgICBsZXQgY2F0ZWdvcnlJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY2F0ZWdvcnlJZCk7XHJcbiAgICAgIGxldCB3b3JrSXRlbUlkID0gcGFyc2VJbnQocmVxLnBhcmFtcy53b3JrSXRlbUlkKTtcclxuICAgICAgbGV0IGRpcmVjdFJhdGUgPSByZXEuYm9keS5kaXJlY3RSYXRlO1xyXG5cclxuICAgICAgbGV0IHByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLnVwZGF0ZURpcmVjdFJhdGVPZkJ1aWxkaW5nV29ya0l0ZW1zKCBwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIGNvc3RIZWFkSWQsXHJcbiAgICAgICAgY2F0ZWdvcnlJZCwgd29ya0l0ZW1JZCwgZGlyZWN0UmF0ZSwgdXNlciwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbG9nZ2VyLmluZm8oJ3VwZGF0ZSBEaXJlY3RSYXRlIE9mIEJ1aWxkaW5nIFdvcmtJdGVtcyBzdWNjZXNzJyk7XHJcbiAgICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICBuZXh0KG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oZS5tZXNzYWdlLGUuc3RhY2spKTtcclxuICAgIH1cclxuICB9XHJcblxyXG5cclxuXHJcbiAgLy9VcGRhdGUgcmF0ZSBvZiBwcm9qZWN0IGNvc3QgaGVhZHNcclxuICB1cGRhdGVSYXRlT2ZQcm9qZWN0Q29zdEhlYWRzKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3QgQ29udHJvbGxlciwgVXBkYXRlIHJhdGUgb2YgcHJvamVjdCBjb3N0IGhlYWRzIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIGxldCBjb3N0SGVhZElkID1wYXJzZUludChyZXEucGFyYW1zLmNvc3RIZWFkSWQpO1xyXG4gICAgICBsZXQgY2F0ZWdvcnlJZCA9cGFyc2VJbnQocmVxLnBhcmFtcy5jYXRlZ29yeUlkKTtcclxuICAgICAgbGV0IHdvcmtJdGVtSWQgPXBhcnNlSW50KHJlcS5wYXJhbXMud29ya0l0ZW1JZCk7XHJcbiAgICAgIGxldCByYXRlIDogUmF0ZSA9IDxSYXRlPiByZXEuYm9keTtcclxuICAgICAgbGV0IHByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLnVwZGF0ZVJhdGVPZlByb2plY3RDb3N0SGVhZHMoIHByb2plY3RJZCwgY29zdEhlYWRJZCxjYXRlZ29yeUlkICx3b3JrSXRlbUlkLCByYXRlLCB1c2VyLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbG9nZ2VyLmluZm8oJ1VwZGF0ZSByYXRlIG9mIHByb2plY3QgY29zdCBoZWFkcyBTdWNjZXNzJyk7XHJcbiAgICAgICAgICBsb2dnZXIuZGVidWcoJ1VwZGF0ZSByYXRlIG9mIHByb2plY3QgY29zdCBoZWFkcyBvZiBQcm9qZWN0IElEIDogJytwcm9qZWN0SWQpO1xyXG4gICAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLHJlc3VsdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvL1VwZGF0ZSBEaXJlY3QgUmF0ZSBvZiBQcm9qZWN0IGNvc3RoZWFkc1xyXG5cclxuICB1cGRhdGVEaXJlY3RSYXRlT2ZQcm9qZWN0V29ya0l0ZW1zKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3QgQ29udHJvbGxlcix1cGRhdGUgRGlyZWN0UmF0ZSBPZiBQcm9qZWN0IFdvcmtJdGVtcyBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHByb2plY3RJZCA9ICByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgICAgbGV0IGNvc3RIZWFkSWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNvc3RIZWFkSWQpO1xyXG4gICAgICBsZXQgY2F0ZWdvcnlJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY2F0ZWdvcnlJZCk7XHJcbiAgICAgIGxldCB3b3JrSXRlbUlkID0gcGFyc2VJbnQocmVxLnBhcmFtcy53b3JrSXRlbUlkKTtcclxuICAgICAgbGV0IGRpcmVjdFJhdGUgPSByZXEuYm9keS5kaXJlY3RSYXRlO1xyXG5cclxuICAgICAgbGV0IHByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLnVwZGF0ZURpcmVjdFJhdGVPZlByb2plY3RXb3JrSXRlbXMoIHByb2plY3RJZCwgY29zdEhlYWRJZCxjYXRlZ29yeUlkICx3b3JrSXRlbUlkLFxyXG4gICAgICAgIGRpcmVjdFJhdGUsIHVzZXIsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygndXBkYXRlIERpcmVjdFJhdGUgT2YgUHJvamVjdCBXb3JrSXRlbXMgU3VjY2VzcycpO1xyXG4gICAgICAgICAgbG9nZ2VyLmRlYnVnKCd1cGRhdGUgRGlyZWN0UmF0ZSBPZiBQcm9qZWN0IFdvcmtJdGVtcyBvZiBQcm9qZWN0IElEIDogJytwcm9qZWN0SWQpO1xyXG4gICAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLHJlc3VsdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBkZWxldGVRdWFudGl0eU9mQnVpbGRpbmdDb3N0SGVhZHNCeU5hbWUocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgdHJ5IHtcclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IGNvbnRyb2xsZXIsIGRlbGV0ZVF1YW50aXR5IGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgIGxldCBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgIGxldCBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgbGV0IGNvc3RIZWFkSWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNvc3RIZWFkSWQpO1xyXG4gICAgbGV0IGNhdGVnb3J5SWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNhdGVnb3J5SWQpO1xyXG4gICAgbGV0IHdvcmtJdGVtSWQgPSBwYXJzZUludChyZXEucGFyYW1zLndvcmtJdGVtSWQpO1xyXG4gICAgbGV0IGl0ZW1OYW1lID0gcmVxLmJvZHkuaXRlbS5uYW1lO1xyXG5cclxuICAgIGxldCBwcm9qZWN0c2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgcHJvamVjdHNlcnZpY2UuZGVsZXRlUXVhbnRpdHlPZkJ1aWxkaW5nQ29zdEhlYWRzQnlOYW1lKCBwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIGNvc3RIZWFkSWQsXHJcbiAgICAgIGNhdGVnb3J5SWQsIHdvcmtJdGVtSWQsIGl0ZW1OYW1lLCB1c2VyLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsb2dnZXIuaW5mbygnRGVsZXRlIFF1YW50aXR5ICcgKyByZXN1bHQpO1xyXG4gICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnRGVsZXRlZCBRdWFudGl0eSBvZiBQcm9qZWN0IElEIDogJytwcm9qZWN0SWQrJywgQnVpbGRpbmcgSUQgOiAnK2J1aWxkaW5nSWQrXHJcbiAgICAgICAgICAgICAnLCBDb3N0SGVhZCA6ICcrY29zdEhlYWRJZCsnLCBXb3JraXRlbSA6ICcrd29ya0l0ZW1JZCsnLCBJdGVtIDogJytpdGVtTmFtZSk7XHJcbiAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLCByZXN1bHQpKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfWNhdGNoKGUpIHtcclxuICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gIH1cclxuICB9XHJcblxyXG4gIC8vRGVsZXRlIFF1YW50aXR5IE9mIFByb2plY3QgQ29zdCBIZWFkcyBCeSBOYW1lXHJcbiAgZGVsZXRlUXVhbnRpdHlPZlByb2plY3RDb3N0SGVhZHNCeU5hbWUocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBjb250cm9sbGVyLCBEZWxldGUgUXVhbnRpdHkgT2YgUHJvamVjdCBDb3N0IEhlYWRzIEJ5IE5hbWUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgICAgbGV0IGNvc3RIZWFkSWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNvc3RIZWFkSWQpO1xyXG4gICAgICBsZXQgY2F0ZWdvcnlJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY2F0ZWdvcnlJZCk7XHJcbiAgICAgIGxldCB3b3JrSXRlbUlkID0gcGFyc2VJbnQocmVxLnBhcmFtcy53b3JrSXRlbUlkKTtcclxuICAgICAgbGV0IGl0ZW1OYW1lID0gcmVxLmJvZHkuaXRlbS5uYW1lO1xyXG5cclxuICAgICAgbGV0IHByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLmRlbGV0ZVF1YW50aXR5T2ZQcm9qZWN0Q29zdEhlYWRzQnlOYW1lKCBwcm9qZWN0SWQsIGNvc3RIZWFkSWQsIGNhdGVnb3J5SWQsIHdvcmtJdGVtSWQsIGl0ZW1OYW1lLFxyXG4gICAgICAgIHVzZXIsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbG9nZ2VyLmluZm8oJ0RlbGV0ZSBRdWFudGl0eSBPZiBQcm9qZWN0IENvc3QgSGVhZHMgQnkgTmFtZSAnICsgcmVzdWx0KTtcclxuICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnRGVsZXRlIFF1YW50aXR5IE9mIFByb2plY3QgQ29zdCBIZWFkcyBCeSBOYW1lIG9mIFByb2plY3QgSUQgOiAnK3Byb2plY3RJZCsnLCBDb3N0SGVhZCA6ICcrY29zdEhlYWRJZCsnLCAnICtcclxuICAgICAgICAgICAgJ1dvcmtpdGVtIDogJyt3b3JrSXRlbUlkKycsIEl0ZW0gOiAnK2l0ZW1OYW1lKTtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCwgcmVzdWx0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1jYXRjaChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZGVsZXRlV29ya2l0ZW0ocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBjb250cm9sbGVyLCBkZWxldGVXb3JraXRlbSBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBsZXQgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgICAgbGV0IGNvc3RIZWFkSWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNvc3RIZWFkSWQpO1xyXG4gICAgICBsZXQgY2F0ZWdvcnlJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY2F0ZWdvcnlJZCk7XHJcbiAgICAgIGxldCB3b3JrSXRlbUlkID0gcGFyc2VJbnQocmVxLnBhcmFtcy53b3JrSXRlbUlkKTtcclxuICAgICAgbGV0IHByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcbiAgICAgIGNvbnNvbGUubG9nKCcgd29ya2l0ZW0gPT4gJysgd29ya0l0ZW1JZCk7XHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLmRlbGV0ZVdvcmtpdGVtKCBwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIGNvc3RIZWFkSWQsIGNhdGVnb3J5SWQsIHdvcmtJdGVtSWQsIHVzZXIsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnRGVsZXRlIHdvcmsgaXRlbSAnK3Jlc3VsdC5kYXRhKTtcclxuICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnRGVsZXRlZCAgd29yayBpdGVtIG9mIFByb2plY3QgSUQgOiAnK3Byb2plY3RJZCsnLCBCdWlsZGluZyBJRCA6ICcrYnVpbGRpbmdJZCtcclxuICAgICAgICAgICAgJywgQ29zdEhlYWQgOiAnK2Nvc3RIZWFkSWQrJywgQ2F0ZWdvcnkgOiAnK2NhdGVnb3J5SWQrJywgV29ya2l0ZW0gOiAnK3dvcmtJdGVtSWQpO1xyXG4gICAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLHJlc3VsdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZXRDb3N0SGVhZFN0YXR1cyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IGNvbnRyb2xsZXIsIHVwZGF0ZUJ1aWxkaW5nQ29zdEhlYWQgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHByb2plY3RJZCA9ICByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgICAgbGV0IGJ1aWxkaW5nSWQgPSAgcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgICBsZXQgY29zdEhlYWRJZCA9ICBwYXJzZUludChyZXEucGFyYW1zLmNvc3RIZWFkSWQpO1xyXG4gICAgICBsZXQgY29zdEhlYWRBY3RpdmVTdGF0dXMgPSByZXEucGFyYW1zLmFjdGl2ZVN0YXR1cztcclxuXHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLnNldENvc3RIZWFkU3RhdHVzKCBidWlsZGluZ0lkLCBjb3N0SGVhZElkLCBjb3N0SGVhZEFjdGl2ZVN0YXR1cywgdXNlciwoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbG9nZ2VyLmluZm8oJ1VwZGF0ZSBCdWlsZGluZyBDb3N0SGVhZCBEZXRhaWxzIHN1Y2Nlc3MgJyk7XHJcbiAgICAgICAgICBsb2dnZXIuZGVidWcoJ3VwZGF0ZUJ1aWxkaW5nQ29zdEhlYWQgZm9yIFByb2plY3QgSUQgOiAnK3Byb2plY3RJZCsnLCBCdWlsZGluZyBJRCA6ICcrYnVpbGRpbmdJZCtcclxuICAgICAgICAgICAgJywgQ29zdEhlYWQgOiAnK2Nvc3RIZWFkSWQrJywgY29zdEhlYWRBY3RpdmVTdGF0dXMgOiAnK2Nvc3RIZWFkQWN0aXZlU3RhdHVzKTtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdXBkYXRlV29ya0l0ZW1TdGF0dXNPZkJ1aWxkaW5nQ29zdEhlYWRzKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3QgY29udHJvbGxlciwgdXBkYXRlIFdvcmtJdGVtIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgdHJ5IHtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBsZXQgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgICAgbGV0IGNvc3RIZWFkSWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNvc3RIZWFkSWQpO1xyXG4gICAgICBsZXQgY2F0ZWdvcnlJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY2F0ZWdvcnlJZCk7XHJcbiAgICAgIGxldCB3b3JrSXRlbUlkID0gcGFyc2VJbnQocmVxLnBhcmFtcy53b3JrSXRlbUlkKTtcclxuICAgICAgbGV0IHdvcmtJdGVtQWN0aXZlU3RhdHVzID0gcmVxLnBhcmFtcy5hY3RpdmVTdGF0dXMgPT09ICd0cnVlJyA/IHRydWUgOiBmYWxzZTtcclxuICAgICAgbGV0IHByb2plY3RTZXJ2aWNlOiBQcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgICBwcm9qZWN0U2VydmljZS51cGRhdGVXb3JrSXRlbVN0YXR1c09mQnVpbGRpbmdDb3N0SGVhZHMoIGJ1aWxkaW5nSWQsIGNvc3RIZWFkSWQsIGNhdGVnb3J5SWQsd29ya0l0ZW1JZCwgd29ya0l0ZW1BY3RpdmVTdGF0dXMsIHVzZXIsKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdVcGRhdGUgd29ya0l0ZW0gRGV0YWlscyBzdWNjZXNzICcpO1xyXG4gICAgICAgICAgbG9nZ2VyLmRlYnVnKCd1cGRhdGUgV29ya0l0ZW0gZm9yIFByb2plY3QgSUQgOiAnK3Byb2plY3RJZCsnLCBCdWlsZGluZyBJRCA6ICcrYnVpbGRpbmdJZCtcclxuICAgICAgICAgICAgJywgQ29zdEhlYWQgOiAnK2Nvc3RIZWFkSWQrJywgd29ya0l0ZW1BY3RpdmVTdGF0dXMgOiAnK3dvcmtJdGVtQWN0aXZlU3RhdHVzKTtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAvLyBVcGRhdGUgV29ya0l0ZW0gU3RhdHVzIE9mIFByb2plY3QgQ29zdEhlYWRzXHJcbiAgdXBkYXRlV29ya0l0ZW1TdGF0dXNPZlByb2plY3RDb3N0SGVhZHMocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBjb250cm9sbGVyLCBVcGRhdGUgV29ya0l0ZW0gU3RhdHVzIE9mIFByb2plY3QgQ29zdCBIZWFkcyBoYXMgYmVlbiBoaXQnKTtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgICAgbGV0IGNvc3RIZWFkSWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNvc3RIZWFkSWQpO1xyXG4gICAgICBsZXQgY2F0ZWdvcnlJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY2F0ZWdvcnlJZCk7XHJcbiAgICAgIGxldCB3b3JrSXRlbUlkID0gcGFyc2VJbnQocmVxLnBhcmFtcy53b3JrSXRlbUlkKTtcclxuICAgICAgbGV0IHdvcmtJdGVtQWN0aXZlU3RhdHVzID0gcmVxLnBhcmFtcy5hY3RpdmVTdGF0dXMgPT09ICd0cnVlJyA/IHRydWUgOiBmYWxzZTtcclxuICAgICAgbGV0IHByb2plY3RTZXJ2aWNlOiBQcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgICBwcm9qZWN0U2VydmljZS51cGRhdGVXb3JrSXRlbVN0YXR1c09mUHJvamVjdENvc3RIZWFkcyggcHJvamVjdElkLCBjb3N0SGVhZElkLCBjYXRlZ29yeUlkLHdvcmtJdGVtSWQsXHJcbiAgICAgICAgd29ya0l0ZW1BY3RpdmVTdGF0dXMsIHVzZXIsKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdVcGRhdGUgV29ya0l0ZW0gU3RhdHVzIE9mIFByb2plY3QgQ29zdCBIZWFkcyBzdWNjZXNzICcpO1xyXG4gICAgICAgICAgbG9nZ2VyLmRlYnVnKCdVcGRhdGUgV29ya0l0ZW0gU3RhdHVzIE9mIFByb2plY3QgQ29zdCBIZWFkcyBmb3IgUHJvamVjdCBJRCA6ICcrcHJvamVjdElkKycgQ29zdEhlYWQgOiAnK2Nvc3RIZWFkSWQrJywgJyArXHJcbiAgICAgICAgICAgICd3b3JrSXRlbUFjdGl2ZVN0YXR1cyA6ICcrd29ya0l0ZW1BY3RpdmVTdGF0dXMpO1xyXG4gICAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLHJlc3VsdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB1cGRhdGVCdWRnZXRlZENvc3RGb3JDb3N0SGVhZChyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcHJvamVjdElkID0gIHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBsZXQgYnVpbGRpbmdJZCA9ICByZXEucGFyYW1zLmJ1aWxkaW5nSWQ7XHJcbiAgICAgIGxldCBjb3N0SGVhZEJ1ZGdldGVkQW1vdW50ID0gIHJlcS5ib2R5O1xyXG5cclxuICAgICAgcHJvamVjdFNlcnZpY2UudXBkYXRlQnVkZ2V0ZWRDb3N0Rm9yQ29zdEhlYWQoIGJ1aWxkaW5nSWQsIGNvc3RIZWFkQnVkZ2V0ZWRBbW91bnQsIHVzZXIsKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdXBkYXRlQnVkZ2V0ZWRDb3N0Rm9yUHJvamVjdENvc3RIZWFkKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbGV0IHByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBwcm9qZWN0SWQgPSAgcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIGxldCBjb3N0SGVhZEJ1ZGdldGVkQW1vdW50ID0gIHJlcS5ib2R5O1xyXG5cclxuICAgICAgcHJvamVjdFNlcnZpY2UudXBkYXRlQnVkZ2V0ZWRDb3N0Rm9yUHJvamVjdENvc3RIZWFkKCBwcm9qZWN0SWQsIGNvc3RIZWFkQnVkZ2V0ZWRBbW91bnQsIHVzZXIsKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYWRkQ29zdEhlYWRCdWlsZGluZyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IGNvbnRyb2xsZXIsIGFkZENvc3RIZWFkQnVpbGRpbmcgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgICBsZXQgY29zdEhlYWREZXRhaWxzID0gPENvc3RIZWFkPiByZXEuYm9keTtcclxuICAgICAgbGV0IHByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcbiAgICAgIGxldCBxdWVyeSA9IHskcHVzaDogeyBjb3N0SGVhZCA6IGNvc3RIZWFkRGV0YWlsc319O1xyXG4gICAgICBwcm9qZWN0U2VydmljZS51cGRhdGVCdWlsZGluZ0J5SWQoIGJ1aWxkaW5nSWQsIHF1ZXJ5LCB1c2VyLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbG9nZ2VyLmluZm8oJ0FkZCBDb3N0SGVhZCBCdWlsZGluZyBzdWNjZXNzJyk7XHJcbiAgICAgICAgICBsb2dnZXIuZGVidWcoJ0FkZGVkIENvc3RIZWFkIGZvciBCdWlsZGluZyBJRCA6ICcrYnVpbGRpbmdJZCk7XHJcbiAgICAgICAgICBuZXh0KG5ldyBSZXNwb25zZSgyMDAscmVzdWx0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICBuZXh0KG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oZS5tZXNzYWdlLGUuc3RhY2spKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHVwZGF0ZVF1YW50aXR5T2ZCdWlsZGluZ0Nvc3RIZWFkcyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IGNvbnRyb2xsZXIsIHVwZGF0ZVF1YW50aXR5IGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIGxldCBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgICBsZXQgY29zdEhlYWRJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY29zdEhlYWRJZCk7XHJcbiAgICAgIGxldCBjYXRlZ29yeUlkID0gcGFyc2VJbnQocmVxLnBhcmFtcy5jYXRlZ29yeUlkKTtcclxuICAgICAgbGV0IHdvcmtJdGVtSWQgPSBwYXJzZUludChyZXEucGFyYW1zLndvcmtJdGVtSWQpO1xyXG4gICAgICBsZXQgcXVhbnRpdHlEZXRhaWxzID0gcmVxLmJvZHkuaXRlbTtcclxuXHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgICBwcm9qZWN0U2VydmljZS51cGRhdGVRdWFudGl0eU9mQnVpbGRpbmdDb3N0SGVhZHMoIHByb2plY3RJZCwgYnVpbGRpbmdJZCwgY29zdEhlYWRJZCxcclxuICAgICAgICBjYXRlZ29yeUlkLCB3b3JrSXRlbUlkLCBxdWFudGl0eURldGFpbHMsIHVzZXIsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnVXBkYXRlIFF1YW50aXR5IHN1Y2Nlc3MnKTtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdXBkYXRlRGlyZWN0UXVhbnRpdHlPZkJ1aWxkaW5nV29ya0l0ZW1zKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3QgY29udHJvbGxlciwgdXBkYXRlRGlyZWN0UXVhbnRpdHlPZkJ1aWxkaW5nQ29zdEhlYWRzIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIGxldCBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgICBsZXQgY29zdEhlYWRJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY29zdEhlYWRJZCk7XHJcbiAgICAgIGxldCBjYXRlZ29yeUlkID0gcGFyc2VJbnQocmVxLnBhcmFtcy5jYXRlZ29yeUlkKTtcclxuICAgICAgbGV0IHdvcmtJdGVtSWQgPSBwYXJzZUludChyZXEucGFyYW1zLndvcmtJdGVtSWQpO1xyXG4gICAgICBsZXQgZGlyZWN0UXVhbnRpdHkgPSByZXEuYm9keS5kaXJlY3RRdWFudGl0eTtcclxuXHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgICBwcm9qZWN0U2VydmljZS51cGRhdGVEaXJlY3RRdWFudGl0eU9mQnVpbGRpbmdXb3JrSXRlbXMoIHByb2plY3RJZCwgYnVpbGRpbmdJZCwgY29zdEhlYWRJZCxcclxuICAgICAgICBjYXRlZ29yeUlkLCB3b3JrSXRlbUlkLCBkaXJlY3RRdWFudGl0eSwgdXNlciwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCd1cGRhdGVEaXJlY3RRdWFudGl0eU9mQnVpbGRpbmdDb3N0SGVhZHMgc3VjY2VzcycpO1xyXG4gICAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLHJlc3VsdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB1cGRhdGVEaXJlY3RRdWFudGl0eU9mUHJvamVjdFdvcmtJdGVtcyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IGNvbnRyb2xsZXIsIHVwZGF0ZURpcmVjdFF1YW50aXR5T2ZCdWlsZGluZ0Nvc3RIZWFkcyBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBsZXQgY29zdEhlYWRJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY29zdEhlYWRJZCk7XHJcbiAgICAgIGxldCBjYXRlZ29yeUlkID0gcGFyc2VJbnQocmVxLnBhcmFtcy5jYXRlZ29yeUlkKTtcclxuICAgICAgbGV0IHdvcmtJdGVtSWQgPSBwYXJzZUludChyZXEucGFyYW1zLndvcmtJdGVtSWQpO1xyXG4gICAgICBsZXQgZGlyZWN0UXVhbnRpdHkgPSByZXEuYm9keS5kaXJlY3RRdWFudGl0eTtcclxuXHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgICBwcm9qZWN0U2VydmljZS51cGRhdGVEaXJlY3RRdWFudGl0eU9mUHJvamVjdFdvcmtJdGVtcyggcHJvamVjdElkLCBjb3N0SGVhZElkLFxyXG4gICAgICAgIGNhdGVnb3J5SWQsIHdvcmtJdGVtSWQsIGRpcmVjdFF1YW50aXR5LCB1c2VyLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsb2dnZXIuaW5mbygndXBkYXRlRGlyZWN0UXVhbnRpdHlPZlByb2plY3RXb3JrSXRlbXMgc3VjY2VzcycpO1xyXG4gICAgICAgICAgICBuZXh0KG5ldyBSZXNwb25zZSgyMDAscmVzdWx0KSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvL1VwZGF0ZSBRdWFudGl0eSBPZiBQcm9qZWN0IENvc3QgSGVhZHNcclxuICB1cGRhdGVRdWFudGl0eU9mUHJvamVjdENvc3RIZWFkcyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IGNvbnRyb2xsZXIsIFVwZGF0ZSBRdWFudGl0eSBPZiBQcm9qZWN0IENvc3QgSGVhZHMgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgICAgbGV0IGNvc3RIZWFkSWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNvc3RIZWFkSWQpO1xyXG4gICAgICBsZXQgY2F0ZWdvcnlJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY2F0ZWdvcnlJZCk7XHJcbiAgICAgIGxldCB3b3JrSXRlbUlkID0gcGFyc2VJbnQocmVxLnBhcmFtcy53b3JrSXRlbUlkKTtcclxuICAgICAgbGV0IHF1YW50aXR5RGV0YWlscyA9IHJlcS5ib2R5Lml0ZW07XHJcblxyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgcHJvamVjdFNlcnZpY2UudXBkYXRlUXVhbnRpdHlPZlByb2plY3RDb3N0SGVhZHMoIHByb2plY3RJZCwgY29zdEhlYWRJZCxcclxuICAgICAgICBjYXRlZ29yeUlkLCB3b3JrSXRlbUlkLCBxdWFudGl0eURldGFpbHMsIHVzZXIsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnVXBkYXRlIFF1YW50aXR5IE9mIFByb2plY3QgQ29zdCBIZWFkcyBzdWNjZXNzJyk7XHJcbiAgICAgICAgICBuZXh0KG5ldyBSZXNwb25zZSgyMDAscmVzdWx0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICBuZXh0KG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oZS5tZXNzYWdlLGUuc3RhY2spKTtcclxuICAgIH1cclxuICB9XHJcblxyXG5cclxuICAvL0dldCBJbi1BY3RpdmUgQ2F0ZWdvcmllcyBGcm9tIERhdGFiYXNlXHJcbiAgZ2V0SW5BY3RpdmVDYXRlZ29yaWVzQnlDb3N0SGVhZElkKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3QgY29udHJvbGxlciwgZ2V0Q2F0ZWdvcnlCeUNvc3RIZWFkSWQgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgICAgbGV0IGJ1aWxkaW5nSWQgPSByZXEucGFyYW1zLmJ1aWxkaW5nSWQ7XHJcbiAgICAgIGxldCBjb3N0SGVhZElkID0gcmVxLnBhcmFtcy5jb3N0SGVhZElkO1xyXG5cclxuICAgICAgbGV0IHByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcblxyXG4gICAgICBwcm9qZWN0U2VydmljZS5nZXRJbkFjdGl2ZUNhdGVnb3JpZXNCeUNvc3RIZWFkSWQocHJvamVjdElkLCBidWlsZGluZ0lkLCBjb3N0SGVhZElkLCB1c2VyLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbG9nZ2VyLmluZm8oJ0dldCBDYXRlZ29yeSBCeSBDb3N0SGVhZElkIHN1Y2Nlc3MnKTtcclxuICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnR2V0IENhdGVnb3J5IEJ5IENvc3RIZWFkSWQgb2YgUHJvamVjdCBJRCA6ICcrcHJvamVjdElkKycgQnVpbGRpbmcgSUQgOiAnK2J1aWxkaW5nSWQpO1xyXG4gICAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLHJlc3VsdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXRXb3JrSXRlbUxpc3RPZkJ1aWxkaW5nQ2F0ZWdvcnkocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsb2dnZXIuaW5mbygnZ2V0V29ya2l0ZW1MaXN0IGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIGxldCBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgICBsZXQgY29zdEhlYWRJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY29zdEhlYWRJZCk7XHJcbiAgICAgIGxldCBjYXRlZ29yeUlkID0gcGFyc2VJbnQocmVxLnBhcmFtcy5jYXRlZ29yeUlkKTtcclxuICAgICAgbGV0IHByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLmdldFdvcmtJdGVtTGlzdE9mQnVpbGRpbmdDYXRlZ29yeShwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIGNvc3RIZWFkSWQsIGNhdGVnb3J5SWQsIHVzZXIsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBuZXh0KG5ldyBSZXNwb25zZSgyMDAscmVzdWx0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICBuZXh0KG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oZS5tZXNzYWdlLGUuc3RhY2spKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vR2V0IHdvcmtpdGVtcyBmb3IgcGVydGljdWxhciBjYXRlZ29yeSBvZiBwcm9qZWN0IGNvc3QgaGVhZFxyXG4gIGdldFdvcmtJdGVtTGlzdE9mUHJvamVjdENhdGVnb3J5KHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ2dldFdvcmtpdGVtTGlzdE9mUHJvamVjdENvc3RIZWFkIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIGxldCBjb3N0SGVhZElkID0gcGFyc2VJbnQocmVxLnBhcmFtcy5jb3N0SGVhZElkKTtcclxuICAgICAgbGV0IGNhdGVnb3J5SWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNhdGVnb3J5SWQpO1xyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgcHJvamVjdFNlcnZpY2UuZ2V0V29ya0l0ZW1MaXN0T2ZQcm9qZWN0Q2F0ZWdvcnkocHJvamVjdElkLCBjb3N0SGVhZElkLCBjYXRlZ29yeUlkLCB1c2VyLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLHJlc3VsdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhZGRXb3JraXRlbShyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdhZGRXb3JraXRlbSBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBsZXQgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgICAgbGV0IGNvc3RIZWFkSWQgOiBudW1iZXIgPSBwYXJzZUludChyZXEucGFyYW1zLmNvc3RIZWFkSWQpO1xyXG4gICAgICBsZXQgY2F0ZWdvcnlJZCA6IG51bWJlciA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY2F0ZWdvcnlJZCk7XHJcbiAgICAgIGxldCB3b3JrSXRlbTogV29ya0l0ZW0gPSBuZXcgV29ya0l0ZW0ocmVxLmJvZHkubmFtZSwgcmVxLmJvZHkucmF0ZUFuYWx5c2lzSWQpO1xyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgcHJvamVjdFNlcnZpY2UuYWRkV29ya2l0ZW0oIHByb2plY3RJZCwgYnVpbGRpbmdJZCwgY29zdEhlYWRJZCwgY2F0ZWdvcnlJZCwgd29ya0l0ZW0sIHVzZXIsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYoZXJyb3JcclxuICAgICAgICApIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBuZXh0KG5ldyBSZXNwb25zZSgyMDAscmVzdWx0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICBuZXh0KG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oZS5tZXNzYWdlLGUuc3RhY2spKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFkZENhdGVnb3J5QnlDb3N0SGVhZElkKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3QgY29udHJvbGxlciwgYWRkQ2F0ZWdvcnlCeUNvc3RIZWFkSWQgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgICAgbGV0IGJ1aWxkaW5nSWQgPSByZXEucGFyYW1zLmJ1aWxkaW5nSWQ7XHJcbiAgICAgIGxldCBjb3N0SGVhZElkID0gcmVxLnBhcmFtcy5jb3N0SGVhZElkO1xyXG4gICAgICBsZXQgY2F0ZWdvcnlEZXRhaWxzID0gcmVxLmJvZHk7XHJcblxyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuXHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLmFkZENhdGVnb3J5QnlDb3N0SGVhZElkKHByb2plY3RJZCwgYnVpbGRpbmdJZCwgY29zdEhlYWRJZCwgY2F0ZWdvcnlEZXRhaWxzLCB1c2VyLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbG9nZ2VyLmluZm8oJ0dldCBRdWFudGl0eSBzdWNjZXNzJyk7XHJcbiAgICAgICAgICBsb2dnZXIuZGVidWcoJ0dldHRpbmcgUXVhbnRpdHkgb2YgUHJvamVjdCBJRCA6ICcrcHJvamVjdElkKycgQnVpbGRpbmcgSUQgOiAnK2J1aWxkaW5nSWQpO1xyXG4gICAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLHJlc3VsdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvL0dldCBhY3RpdmUgY2F0ZWdvcmllcyBmcm9tIGRhdGFiYXNlXHJcbiAgZ2V0Q2F0ZWdvcmllc09mQnVpbGRpbmdDb3N0SGVhZChyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IGNvbnRyb2xsZXIsIEdldCBBY3RpdmUgQ2F0ZWdvcmllcyBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBsZXQgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgICAgbGV0IGNvc3RIZWFkSWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNvc3RIZWFkSWQpO1xyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgcHJvamVjdFNlcnZpY2UuZ2V0Q2F0ZWdvcmllc09mQnVpbGRpbmdDb3N0SGVhZChwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIGNvc3RIZWFkSWQsIHVzZXIsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBuZXh0KG5ldyBSZXNwb25zZSgyMDAscmVzdWx0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICBuZXh0KG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oZS5tZXNzYWdlLGUuc3RhY2spKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vR2V0IGNhdGVnb3JpZXMgb2YgcHJvamVjdENvc3RIZWFkcyBmcm9tIGRhdGFiYXNlXHJcbiAgZ2V0Q2F0ZWdvcmllc09mUHJvamVjdENvc3RIZWFkKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3QgY29udHJvbGxlciwgR2V0IFByb2plY3QgQ29zdEhlYWQgQ2F0ZWdvcmllcyBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBsZXQgY29zdEhlYWRJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY29zdEhlYWRJZCk7XHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgICBwcm9qZWN0U2VydmljZS5nZXRDYXRlZ29yaWVzT2ZQcm9qZWN0Q29zdEhlYWQocHJvamVjdElkLCBjb3N0SGVhZElkLCB1c2VyLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLHJlc3VsdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXRDb3N0SGVhZERldGFpbHNPZkJ1aWxkaW5nKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3QgY29udHJvbGxlciwgR2V0IFByb2plY3QgQ29zdEhlYWQgQ2F0ZWdvcmllcyBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBsZXQgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgICAgbGV0IGNvc3RIZWFkSWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNvc3RIZWFkSWQpO1xyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgcHJvamVjdFNlcnZpY2UuZ2V0Q29zdEhlYWREZXRhaWxzT2ZCdWlsZGluZyhwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIGNvc3RIZWFkSWQsIHVzZXIsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBuZXh0KG5ldyBSZXNwb25zZSgyMDAscmVzdWx0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICBuZXh0KG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oZS5tZXNzYWdlLGUuc3RhY2spKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vVXBkYXRlIHN0YXR1cyAoIHRydWUvZmFsc2UgKSBvZiBjYXRlZ29yeVxyXG4gIHVwZGF0ZUNhdGVnb3J5U3RhdHVzKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3QgY29udHJvbGxlciwgdXBkYXRlIENhdGVnb3J5IFN0YXR1cyBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBsZXQgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgICAgbGV0IGNvc3RIZWFkSWQgPSBwYXJzZUZsb2F0KHJlcS5wYXJhbXMuY29zdEhlYWRJZCk7XHJcbiAgICAgIGxldCBjYXRlZ29yeUlkID1wYXJzZUZsb2F0KHJlcS5wYXJhbXMuY2F0ZWdvcnlJZCk7XHJcbiAgICAgIGxldCBjYXRlZ29yeUFjdGl2ZVN0YXR1cyA9IHJlcS5wYXJhbXMuYWN0aXZlU3RhdHVzID09PSAndHJ1ZScgPyB0cnVlIDogZmFsc2U7XHJcblxyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuXHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLnVwZGF0ZUNhdGVnb3J5U3RhdHVzKCBwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIGNvc3RIZWFkSWQsIGNhdGVnb3J5SWQsIGNhdGVnb3J5QWN0aXZlU3RhdHVzLFxyXG4gICAgICAgIHVzZXIsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxvZ2dlci5pbmZvKCdVcGRhdGUgQ2F0ZWdvcnkgU3RhdHVzIHN1Y2Nlc3MnKTtcclxuICAgICAgICAgICAgbG9nZ2VyLmRlYnVnKCdVcGRhdGUgQ2F0ZWdvcnkgU3RhdHVzIHN1Y2Nlc3Mgb2YgUHJvamVjdCBJRCA6ICcrcHJvamVjdElkKycgQnVpbGRpbmcgSUQgOiAnK2J1aWxkaW5nSWQpO1xyXG4gICAgICAgICAgICBuZXh0KG5ldyBSZXNwb25zZSgyMDAscmVzdWx0KSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzeW5jUHJvamVjdFdpdGhSYXRlQW5hbHlzaXNEYXRhKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3QgY29udHJvbGxlciwgc3luY0J1aWxkaW5nV2l0aFJhdGVBbmFseXNpc0RhdGEgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgICAgbGV0IGJ1aWxkaW5nSWQgPSByZXEucGFyYW1zLmJ1aWxkaW5nSWQ7XHJcblxyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuXHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLnN5bmNQcm9qZWN0V2l0aFJhdGVBbmFseXNpc0RhdGEoIHByb2plY3RJZCwgYnVpbGRpbmdJZCwgdXNlciwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgbG9nZ2VyLmVycm9yKCdzeW5jUHJvamVjdFdpdGhSYXRlQW5hbHlzaXNEYXRhIGZhaWx1cmUnKTtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnc3luY1Byb2plY3RXaXRoUmF0ZUFuYWx5c2lzRGF0YSBzdWNjZXNzJyk7XHJcbiAgICAgICAgICBsb2dnZXIuZGVidWcoJ0dldHRpbmcgc3luY1Byb2plY3RXaXRoUmF0ZUFuYWx5c2lzRGF0YSBvZiBQcm9qZWN0IElEIDogJytwcm9qZWN0SWQrJyBCdWlsZGluZyBJRCA6ICcrYnVpbGRpbmdJZCk7XHJcbiAgICAgICAgICBuZXh0KG5ldyBSZXNwb25zZSgyMDAscmVzdWx0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXRCdWlsZGluZ1JhdGVJdGVtc0J5T3JpZ2luYWxOYW1lKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3QgY29udHJvbGxlciwgZ2V0QnVpbGRpbmdSYXRlSXRlbXNCeU9yaWdpbmFsTmFtZSBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBsZXQgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgICAgbGV0IG9yaWdpbmFsUmF0ZUl0ZW1OYW1lID0gcmVxLnBhcmFtcy5vcmlnaW5hbFJhdGVJdGVtTmFtZTtcclxuICAgICAgbGV0IHByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcblxyXG4gICAgICBwcm9qZWN0U2VydmljZS5nZXRCdWlsZGluZ1JhdGVJdGVtc0J5T3JpZ2luYWxOYW1lKCBwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIG9yaWdpbmFsUmF0ZUl0ZW1OYW1lLCB1c2VyLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBsb2dnZXIuZXJyb3IoJ2dldEJ1aWxkaW5nUmF0ZUl0ZW1zQnlPcmlnaW5hbE5hbWUgZmFpbHVyZScpO1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdnZXRCdWlsZGluZ1JhdGVJdGVtc0J5T3JpZ2luYWxOYW1lIHN1Y2Nlc3MnKTtcclxuICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnR2V0dGluZyBnZXRCdWlsZGluZ1JhdGVJdGVtc0J5T3JpZ2luYWxOYW1lIG9mIFByb2plY3QgSUQgOiAnK3Byb2plY3RJZCsnIEJ1aWxkaW5nIElEIDogJytidWlsZGluZ0lkKTtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBuZXh0KG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oZS5tZXNzYWdlLGUuc3RhY2spKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldFByb2plY3RSYXRlSXRlbXNCeU9yaWdpbmFsTmFtZShyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IGNvbnRyb2xsZXIsIGdldFByb2plY3RSYXRlSXRlbXNCeU5hbWUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgICAgbGV0IG9yaWdpbmFsUmF0ZUl0ZW1OYW1lID0gcmVxLnBhcmFtcy5vcmlnaW5hbFJhdGVJdGVtTmFtZTtcclxuICAgICAgbGV0IHByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcblxyXG4gICAgICBwcm9qZWN0U2VydmljZS5nZXRQcm9qZWN0UmF0ZUl0ZW1zQnlPcmlnaW5hbE5hbWUoIHByb2plY3RJZCwgb3JpZ2luYWxSYXRlSXRlbU5hbWUsIHVzZXIsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIGxvZ2dlci5lcnJvcignZ2V0UHJvamVjdFJhdGVJdGVtc0J5T3JpZ2luYWxOYW1lIGZhaWx1cmUnKTtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnZ2V0UHJvamVjdFJhdGVJdGVtc0J5T3JpZ2luYWxOYW1lIHN1Y2Nlc3MnKTtcclxuICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnR2V0dGluZyBnZXRQcm9qZWN0UmF0ZUl0ZW1zQnlPcmlnaW5hbE5hbWUgb2YgUHJvamVjdCBJRCA6ICcrcHJvamVjdElkKTtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBuZXh0KG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oZS5tZXNzYWdlLGUuc3RhY2spKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFkZEF0dGFjaG1lbnRUb0J1aWxkaW5nV29ya0l0ZW0ocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogZXhwcmVzcy5OZXh0RnVuY3Rpb24pIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgICB2YXIgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIHZhciBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgICBsZXQgY29zdEhlYWRJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY29zdEhlYWRJZCk7XHJcbiAgICAgIGxldCBjYXRlZ29yeUlkID0gcGFyc2VJbnQocmVxLnBhcmFtcy5jYXRlZ29yeUlkKTtcclxuICAgICAgbGV0IHdvcmtJdGVtSWQgPSBwYXJzZUludChyZXEucGFyYW1zLndvcmtJdGVtSWQpO1xyXG4gICAgICBsZXQgZmlsZURhdGEgPSByZXE7XHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLmFkZEF0dGFjaG1lbnRUb1dvcmtJdGVtKCBwcm9qZWN0SWQsIGJ1aWxkaW5nSWQgLGNvc3RIZWFkSWQsIGNhdGVnb3J5SWQsIHdvcmtJdGVtSWQsZmlsZURhdGEgLChlcnJvciwgcmVzcG9uc2UpID0+IHtcclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZCh7cmVzcG9uc2V9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBuZXh0KHtcclxuICAgICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgc3RhY2tUcmFjZTogZSxcclxuICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXRQcmVzZW50RmlsZXNGb3JCdWlsZGluZ1dvcmtJdGVtKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGV4cHJlc3MuTmV4dEZ1bmN0aW9uKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgdmFyIHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICB2YXIgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgICAgbGV0IGNvc3RIZWFkSWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNvc3RIZWFkSWQpO1xyXG4gICAgICBsZXQgY2F0ZWdvcnlJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY2F0ZWdvcnlJZCk7XHJcbiAgICAgIGxldCB3b3JrSXRlbUlkID0gcGFyc2VJbnQocmVxLnBhcmFtcy53b3JrSXRlbUlkKTtcclxuICAgICAgcHJvamVjdFNlcnZpY2UuZ2V0UHJlc2VudEZpbGVzRm9yQnVpbGRpbmdXb3JrSXRlbShwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIGNvc3RIZWFkSWQsIGNhdGVnb3J5SWQsIHdvcmtJdGVtSWQsIChlcnJvciwgcmVzcG9uc2UpID0+IHtcclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZCh7cmVzcG9uc2V9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBuZXh0KHtcclxuICAgICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgc3RhY2tUcmFjZTogZSxcclxuICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJlbW92ZUF0dGFjaG1lbnRPZkJ1aWxkaW5nV29ya0l0ZW0ocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogZXhwcmVzcy5OZXh0RnVuY3Rpb24pIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgICB2YXIgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIHZhciBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgICBsZXQgY29zdEhlYWRJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY29zdEhlYWRJZCk7XHJcbiAgICAgIGxldCBjYXRlZ29yeUlkID0gcGFyc2VJbnQocmVxLnBhcmFtcy5jYXRlZ29yeUlkKTtcclxuICAgICAgbGV0IHdvcmtJdGVtSWQgPSBwYXJzZUludChyZXEucGFyYW1zLndvcmtJdGVtSWQpO1xyXG4gICAgICBsZXQgYXNzaWduZWRGaWxlTmFtZSA9IHJlcS5ib2R5LmFzc2lnbmVkRmlsZU5hbWU7XHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLnJlbW92ZUF0dGFjaG1lbnRPZkJ1aWxkaW5nV29ya0l0ZW0ocHJvamVjdElkLCBidWlsZGluZ0lkLCBjb3N0SGVhZElkLCBjYXRlZ29yeUlkLCB3b3JrSXRlbUlkLFxyXG4gICAgICAgIGFzc2lnbmVkRmlsZU5hbWUsKGVycm9yLCByZXNwb25zZSkgPT4ge1xyXG4gICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtyZXNwb25zZX0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIG5leHQoe1xyXG4gICAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgICBzdGFja1RyYWNlOiBlLFxyXG4gICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFkZEF0dGFjaG1lbnRUb1Byb2plY3RXb3JrSXRlbShyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBleHByZXNzLk5leHRGdW5jdGlvbikge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbGV0IHByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcbiAgICAgIHZhciBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgICAgbGV0IGNvc3RIZWFkSWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNvc3RIZWFkSWQpO1xyXG4gICAgICBsZXQgY2F0ZWdvcnlJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY2F0ZWdvcnlJZCk7XHJcbiAgICAgIGxldCB3b3JrSXRlbUlkID0gcGFyc2VJbnQocmVxLnBhcmFtcy53b3JrSXRlbUlkKTtcclxuICAgICAgbGV0IGZpbGVEYXRhID0gcmVxO1xyXG4gICAgICBwcm9qZWN0U2VydmljZS5hZGRBdHRhY2htZW50VG9Qcm9qZWN0V29ya0l0ZW0oIHByb2plY3RJZCwgY29zdEhlYWRJZCwgY2F0ZWdvcnlJZCwgd29ya0l0ZW1JZCxmaWxlRGF0YSAsKGVycm9yLCByZXNwb25zZSkgPT4ge1xyXG4gICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtyZXNwb25zZX0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIG5leHQoe1xyXG4gICAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgICBzdGFja1RyYWNlOiBlLFxyXG4gICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcbiAgZ2V0UHJlc2VudEZpbGVzRm9yUHJvamVjdFdvcmtJdGVtKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGV4cHJlc3MuTmV4dEZ1bmN0aW9uKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgdmFyIHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBsZXQgY29zdEhlYWRJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY29zdEhlYWRJZCk7XHJcbiAgICAgIGxldCBjYXRlZ29yeUlkID0gcGFyc2VJbnQocmVxLnBhcmFtcy5jYXRlZ29yeUlkKTtcclxuICAgICAgbGV0IHdvcmtJdGVtSWQgPSBwYXJzZUludChyZXEucGFyYW1zLndvcmtJdGVtSWQpO1xyXG4gICAgICBwcm9qZWN0U2VydmljZS5nZXRQcmVzZW50RmlsZXNGb3JQcm9qZWN0V29ya0l0ZW0ocHJvamVjdElkLCBjb3N0SGVhZElkLCBjYXRlZ29yeUlkLCB3b3JrSXRlbUlkLCAoZXJyb3IsIHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoe3Jlc3BvbnNlfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgbmV4dCh7XHJcbiAgICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICAgIHN0YWNrVHJhY2U6IGUsXHJcbiAgICAgICAgY29kZTogNDAzXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuICByZW1vdmVBdHRhY2htZW50T2ZQcm9qZWN0V29ya0l0ZW0ocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogZXhwcmVzcy5OZXh0RnVuY3Rpb24pIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgICB2YXIgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIGxldCBjb3N0SGVhZElkID0gcGFyc2VJbnQocmVxLnBhcmFtcy5jb3N0SGVhZElkKTtcclxuICAgICAgbGV0IGNhdGVnb3J5SWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNhdGVnb3J5SWQpO1xyXG4gICAgICBsZXQgd29ya0l0ZW1JZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMud29ya0l0ZW1JZCk7XHJcbiAgICAgIGxldCBhc3NpZ25lZEZpbGVOYW1lID0gcmVxLmJvZHkuYXNzaWduZWRGaWxlTmFtZTtcclxuICAgICAgcHJvamVjdFNlcnZpY2UucmVtb3ZlQXR0YWNobWVudE9mUHJvamVjdFdvcmtJdGVtKHByb2plY3RJZCxjb3N0SGVhZElkLCBjYXRlZ29yeUlkLCB3b3JrSXRlbUlkLGFzc2lnbmVkRmlsZU5hbWUsKGVycm9yLCByZXNwb25zZSkgPT4ge1xyXG4gICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtyZXNwb25zZX0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIG5leHQoe1xyXG4gICAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgICBzdGFja1RyYWNlOiBlLFxyXG4gICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuZXhwb3J0ICA9IFByb2plY3RDb250cm9sbGVyO1xyXG4iXX0=
