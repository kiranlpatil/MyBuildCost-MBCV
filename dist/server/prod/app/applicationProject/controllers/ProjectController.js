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
            var projectId_2 = req.params.projectId;
            var buildingId_1 = req.params.buildingId;
            var projectService = new ProjectService();
            projectService.getBuildingByIdForClone(projectId_2, buildingId_1, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Get Building details for clone ' + result.data.name);
                    logger.debug(result.data.name + ' Building details for clone ...ProjectID : ' + projectId_2 + ', BuildingID : ' + buildingId_1);
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
            var projectId_3 = req.params.projectId;
            var buildingId_2 = req.params.buildingId;
            var costHeadId = parseInt(req.params.costHeadId);
            var categoryId = parseInt(req.params.categoryId);
            var workItemId = parseInt(req.params.workItemId);
            var projectService = new ProjectService();
            console.log(' workitemId => ' + workItemId);
            projectService.getRate(projectId_3, buildingId_2, costHeadId, categoryId, workItemId, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Get Rate Success');
                    logger.debug('Getting Rate of Project ID : ' + projectId_3 + ' Building ID : ' + buildingId_2);
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
            var projectId_4 = req.params.projectId;
            var buildingId_3 = req.params.buildingId;
            var costHeadId = parseInt(req.params.costHeadId);
            var categoryId = parseInt(req.params.categoryId);
            var workItemId = parseInt(req.params.workItemId);
            var rate = req.body;
            var projectService = new ProjectService();
            console.log(' workitemId => ' + workItemId);
            projectService.updateRateOfBuildingCostHeads(projectId_4, buildingId_3, costHeadId, categoryId, workItemId, rate, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Get Rate Success');
                    logger.debug('Getting Rate of Project ID : ' + projectId_4 + ' Building ID : ' + buildingId_3);
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
            var projectId_5 = req.params.projectId;
            var costHeadId = parseInt(req.params.costHeadId);
            var categoryId = parseInt(req.params.categoryId);
            var workItemId = parseInt(req.params.workItemId);
            var rate = req.body;
            var projectService = new ProjectService();
            projectService.updateRateOfProjectCostHeads(projectId_5, costHeadId, categoryId, workItemId, rate, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Update rate of project cost heads Success');
                    logger.debug('Update rate of project cost heads of Project ID : ' + projectId_5);
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
            var projectId_6 = req.params.projectId;
            var costHeadId = parseInt(req.params.costHeadId);
            var categoryId = parseInt(req.params.categoryId);
            var workItemId = parseInt(req.params.workItemId);
            var directRate = req.body.directRate;
            var projectService = new ProjectService();
            projectService.updateDirectRateOfProjectWorkItems(projectId_6, costHeadId, categoryId, workItemId, directRate, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('update DirectRate Of Project WorkItems Success');
                    logger.debug('update DirectRate Of Project WorkItems of Project ID : ' + projectId_6);
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
            var projectId_7 = req.params.projectId;
            var buildingId_4 = req.params.buildingId;
            var costHeadId_1 = parseInt(req.params.costHeadId);
            var categoryId = parseInt(req.params.categoryId);
            var workItemId_1 = parseInt(req.params.workItemId);
            var itemName_1 = req.body.item.name;
            var projectservice = new ProjectService();
            projectservice.deleteQuantityOfBuildingCostHeadsByName(projectId_7, buildingId_4, costHeadId_1, categoryId, workItemId_1, itemName_1, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Delete Quantity ' + result);
                    logger.debug('Deleted Quantity of Project ID : ' + projectId_7 + ', Building ID : ' + buildingId_4 +
                        ', CostHead : ' + costHeadId_1 + ', Workitem : ' + workItemId_1 + ', Item : ' + itemName_1);
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
            var projectId_8 = req.params.projectId;
            var costHeadId_2 = parseInt(req.params.costHeadId);
            var categoryId = parseInt(req.params.categoryId);
            var workItemId_2 = parseInt(req.params.workItemId);
            var itemName_2 = req.body.item.name;
            var projectService = new ProjectService();
            projectService.deleteQuantityOfProjectCostHeadsByName(projectId_8, costHeadId_2, categoryId, workItemId_2, itemName_2, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Delete Quantity Of Project Cost Heads By Name ' + result);
                    logger.debug('Delete Quantity Of Project Cost Heads By Name of Project ID : ' + projectId_8 + ', CostHead : ' + costHeadId_2 + ', ' +
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
            var projectId_9 = req.params.projectId;
            var buildingId_5 = req.params.buildingId;
            var costHeadId_3 = parseInt(req.params.costHeadId);
            var categoryId_1 = parseInt(req.params.categoryId);
            var workItemId_3 = parseInt(req.params.workItemId);
            var projectService = new ProjectService();
            console.log(' workitem => ' + workItemId_3);
            projectService.deleteWorkitem(projectId_9, buildingId_5, costHeadId_3, categoryId_1, workItemId_3, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Delete work item ' + result.data);
                    logger.debug('Deleted  work item of Project ID : ' + projectId_9 + ', Building ID : ' + buildingId_5 +
                        ', CostHead : ' + costHeadId_3 + ', Category : ' + categoryId_1 + ', Workitem : ' + workItemId_3);
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
            var projectId_10 = req.params.projectId;
            var buildingId_6 = req.params.buildingId;
            var costHeadId_4 = parseInt(req.params.costHeadId);
            var costHeadActiveStatus_1 = req.params.activeStatus;
            projectService.setCostHeadStatus(buildingId_6, costHeadId_4, costHeadActiveStatus_1, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Update Building CostHead Details success ');
                    logger.debug('updateBuildingCostHead for Project ID : ' + projectId_10 + ', Building ID : ' + buildingId_6 +
                        ', CostHead : ' + costHeadId_4 + ', costHeadActiveStatus : ' + costHeadActiveStatus_1);
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
            var projectId_11 = req.params.projectId;
            var buildingId_7 = req.params.buildingId;
            var costHeadId_5 = parseInt(req.params.costHeadId);
            var categoryId = parseInt(req.params.categoryId);
            var workItemId = parseInt(req.params.workItemId);
            var workItemActiveStatus_1 = req.params.activeStatus === 'true' ? true : false;
            var projectService = new ProjectService();
            projectService.updateWorkItemStatusOfBuildingCostHeads(buildingId_7, costHeadId_5, categoryId, workItemId, workItemActiveStatus_1, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Update workItem Details success ');
                    logger.debug('update WorkItem for Project ID : ' + projectId_11 + ', Building ID : ' + buildingId_7 +
                        ', CostHead : ' + costHeadId_5 + ', workItemActiveStatus : ' + workItemActiveStatus_1);
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
            var projectId_12 = req.params.projectId;
            var costHeadId_6 = parseInt(req.params.costHeadId);
            var categoryId = parseInt(req.params.categoryId);
            var workItemId = parseInt(req.params.workItemId);
            var workItemActiveStatus_2 = req.params.activeStatus === 'true' ? true : false;
            var projectService = new ProjectService();
            projectService.updateWorkItemStatusOfProjectCostHeads(projectId_12, costHeadId_6, categoryId, workItemId, workItemActiveStatus_2, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Update WorkItem Status Of Project Cost Heads success ');
                    logger.debug('Update WorkItem Status Of Project Cost Heads for Project ID : ' + projectId_12 + ' CostHead : ' + costHeadId_6 + ', ' +
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
            var projectId_13 = req.params.projectId;
            var buildingId_9 = req.params.buildingId;
            var costHeadId = req.params.costHeadId;
            var projectService = new ProjectService();
            projectService.getInActiveCategoriesByCostHeadId(projectId_13, buildingId_9, costHeadId, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Get Category By CostHeadId success');
                    logger.debug('Get Category By CostHeadId of Project ID : ' + projectId_13 + ' Building ID : ' + buildingId_9);
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
            var projectId_14 = req.params.projectId;
            var buildingId_10 = req.params.buildingId;
            var costHeadId = req.params.costHeadId;
            var categoryDetails = req.body;
            var projectService = new ProjectService();
            projectService.addCategoryByCostHeadId(projectId_14, buildingId_10, costHeadId, categoryDetails, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Get Quantity success');
                    logger.debug('Getting Quantity of Project ID : ' + projectId_14 + ' Building ID : ' + buildingId_10);
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
    ProjectController.prototype.updateCategoryStatus = function (req, res, next) {
        try {
            logger.info('Project controller, update Category Status has been hit');
            var user = req.user;
            var projectId_15 = req.params.projectId;
            var buildingId_11 = req.params.buildingId;
            var costHeadId = parseFloat(req.params.costHeadId);
            var categoryId = parseFloat(req.params.categoryId);
            var categoryActiveStatus = req.params.activeStatus === 'true' ? true : false;
            var projectService = new ProjectService();
            projectService.updateCategoryStatus(projectId_15, buildingId_11, costHeadId, categoryId, categoryActiveStatus, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Update Category Status success');
                    logger.debug('Update Category Status success of Project ID : ' + projectId_15 + ' Building ID : ' + buildingId_11);
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
            var projectId_16 = req.params.projectId;
            var buildingId_12 = req.params.buildingId;
            var projectService = new ProjectService();
            projectService.syncProjectWithRateAnalysisData(projectId_16, buildingId_12, user, function (error, result) {
                if (error) {
                    logger.error('syncProjectWithRateAnalysisData failure');
                    next(error);
                }
                else {
                    logger.info('syncProjectWithRateAnalysisData success');
                    logger.debug('Getting syncProjectWithRateAnalysisData of Project ID : ' + projectId_16 + ' Building ID : ' + buildingId_12);
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
            var projectId_17 = req.params.projectId;
            var buildingId_13 = req.params.buildingId;
            var originalRateItemName = req.params.originalRateItemName;
            var projectService = new ProjectService();
            projectService.getBuildingRateItemsByOriginalName(projectId_17, buildingId_13, originalRateItemName, user, function (error, result) {
                if (error) {
                    logger.error('getBuildingRateItemsByOriginalName failure');
                    next(error);
                }
                else {
                    logger.info('getBuildingRateItemsByOriginalName success');
                    logger.debug('Getting getBuildingRateItemsByOriginalName of Project ID : ' + projectId_17 + ' Building ID : ' + buildingId_13);
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
            var projectId_18 = req.params.projectId;
            var originalRateItemName = req.params.originalRateItemName;
            var projectService = new ProjectService();
            projectService.getProjectRateItemsByOriginalName(projectId_18, originalRateItemName, user, function (error, result) {
                if (error) {
                    logger.error('getProjectRateItemsByOriginalName failure');
                    next(error);
                }
                else {
                    logger.info('getProjectRateItemsByOriginalName success');
                    logger.debug('Getting getProjectRateItemsByOriginalName of Project ID : ' + projectId_18);
                    next(new Response(200, result));
                }
            });
        }
        catch (e) {
            next(new CostControllException(e.message, e.stack));
        }
    };
    return ProjectController;
}());
module.exports = ProjectController;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHBsaWNhdGlvblByb2plY3QvY29udHJvbGxlcnMvUHJvamVjdENvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLDZEQUFnRTtBQUdoRSwyREFBOEQ7QUFDOUQsMEVBQTZFO0FBRzdFLHdFQUEyRTtBQUMzRSxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDL0IsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLElBQUksTUFBTSxHQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUdsRDtJQUdFO1FBQ0UsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO0lBRTlDLENBQUM7SUFFRCx5Q0FBYSxHQUFiLFVBQWMsR0FBb0IsRUFBRSxHQUFxQixFQUFFLElBQVM7UUFDbEUsSUFBSSxDQUFDO1lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO1lBQ3RELElBQUksSUFBSSxHQUFhLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFDOUIsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztZQUVwQixJQUFJLFlBQVksR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQzlDLElBQUksQ0FBQyxLQUFLLEdBQUcsWUFBWSxDQUFDO1lBRTFCLElBQUksY0FBYyxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7WUFDMUMsY0FBYyxDQUFDLGFBQWEsQ0FBRSxJQUFJLEVBQUUsSUFBSSxFQUFDLFVBQUMsS0FBSyxFQUFFLE1BQU07Z0JBQ3JELEVBQUUsQ0FBQSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ1QsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNkLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ04sTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENB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QWMsR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO1lBRTFDLGNBQWMsQ0FBQyxpQ0FBaUMsQ0FBRSxZQUFTLEVBQUUsb0JBQW9CLEVBQUUsSUFBSSxFQUFFLFVBQUMsS0FBSyxFQUFFLE1BQU07Z0JBQ3JHLEVBQUUsQ0FBQSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ1QsTUFBTSxDQUFDLEtBQUssQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO29CQUMxRCxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2QsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDTixNQUFNLENBQUMsSUFBSSxDQUFDLDJDQUEyQyxDQUFDLENBQUM7b0JBQ3pELE1BQU0sQ0FBQyxLQUFLLENBQUMsNERBQTRELEdBQUMsWUFBUyxDQUFDLENBQUM7b0JBQ3JGLElBQUksQ0FBQyxJQUFJLFFBQVEsQ0FBQyxHQUFHLEVBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDakMsQ0FBQztZQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDWCxJQUFJLENBQUMsSUFBSSxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3JELENBQUM7SUFDSCxDQUFDO0lBSUgsd0JBQUM7QUFBRCxDQXA5QkEsQUFvOUJDLElBQUE7QUFDRCxpQkFBVSxpQkFBaUIsQ0FBQyIsImZpbGUiOiJhcHAvYXBwbGljYXRpb25Qcm9qZWN0L2NvbnRyb2xsZXJzL1Byb2plY3RDb250cm9sbGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZXhwcmVzcyBmcm9tICdleHByZXNzJztcclxuaW1wb3J0IFByb2plY3RTZXJ2aWNlID0gcmVxdWlyZSgnLi8uLi9zZXJ2aWNlcy9Qcm9qZWN0U2VydmljZScpO1xyXG5pbXBvcnQgUHJvamVjdCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9uZ29vc2UvUHJvamVjdCcpO1xyXG5pbXBvcnQgQnVpbGRpbmcgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vbmdvb3NlL0J1aWxkaW5nJyk7XHJcbmltcG9ydCBSZXNwb25zZSA9IHJlcXVpcmUoJy4uL2ludGVyY2VwdG9yL3Jlc3BvbnNlL1Jlc3BvbnNlJyk7XHJcbmltcG9ydCBDb3N0Q29udHJvbGxFeGNlcHRpb24gPSByZXF1aXJlKCcuLi9leGNlcHRpb24vQ29zdENvbnRyb2xsRXhjZXB0aW9uJyk7XHJcbmltcG9ydCBDb3N0SGVhZCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9idWlsZGluZy9Db3N0SGVhZCcpO1xyXG5pbXBvcnQgUmF0ZSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9idWlsZGluZy9SYXRlJyk7XHJcbmltcG9ydCBXb3JrSXRlbSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9idWlsZGluZy9Xb3JrSXRlbScpO1xyXG5sZXQgY29uZmlnID0gcmVxdWlyZSgnY29uZmlnJyk7XHJcbmxldCBsb2c0anMgPSByZXF1aXJlKCdsb2c0anMnKTtcclxubGV0IGxvZ2dlcj1sb2c0anMuZ2V0TG9nZ2VyKCdQcm9qZWN0IENvbnRyb2xsZXInKTtcclxuXHJcblxyXG5jbGFzcyBQcm9qZWN0Q29udHJvbGxlciB7XHJcbiAgcHJpdmF0ZSBfcHJvamVjdFNlcnZpY2UgOiBQcm9qZWN0U2VydmljZTtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLl9wcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG5cclxuICB9XHJcblxyXG4gIGNyZWF0ZVByb2plY3QocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBjb250cm9sbGVyIGNyZWF0ZSBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbGV0IGRhdGEgPSAgPFByb2plY3Q+cmVxLmJvZHk7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcblxyXG4gICAgICBsZXQgZGVmYXVsdFJhdGVzID0gY29uZmlnLmdldCgncmF0ZS5kZWZhdWx0Jyk7XHJcbiAgICAgIGRhdGEucmF0ZXMgPSBkZWZhdWx0UmF0ZXM7XHJcblxyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgcHJvamVjdFNlcnZpY2UuY3JlYXRlUHJvamVjdCggZGF0YSwgdXNlciwoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbG9nZ2VyLmluZm8ocmVzdWx0Ll9kb2MubmFtZSsnIHByb2plY3QgaXMgY3JlYXRlZCAnKTtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaCAoZSkgIHtcclxuICAgICAgbG9nZ2VyLmVycm9yKGUpO1xyXG4gICAgICBuZXh0KG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oZS5tZXNzYWdlLGUuc3RhY2spKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldFByb2plY3RCeUlkKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3QgY29udHJvbGxlciBnZXRQcm9qZWN0IGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHByb2plY3RJZCA9ICByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgICAgcHJvamVjdFNlcnZpY2UuZ2V0UHJvamVjdEJ5SWQocHJvamVjdElkLCB1c2VyLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbG9nZ2VyLmluZm8oJ0dldHRpbmcgcHJvamVjdCAnK3Jlc3VsdC5kYXRhWzBdLm5hbWUpO1xyXG4gICAgICAgICAgbG9nZ2VyLmRlYnVnKCdHZXR0aW5nIHByb2plY3QgUHJvamVjdCBJRCA6ICcrcHJvamVjdElkKycsIFByb2plY3QgTmFtZSA6ICcrcmVzdWx0LmRhdGFbMF0ubmFtZSk7XHJcbiAgICAgICAgICBuZXh0KG5ldyBSZXNwb25zZSgyMDAscmVzdWx0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICBuZXh0KG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oZS5tZXNzYWdlLGUuc3RhY2spKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHVwZGF0ZVByb2plY3RCeUlkKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3QgY29udHJvbGxlciwgdXBkYXRlUHJvamVjdERldGFpbHMgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGxldCBwcm9qZWN0RGV0YWlscyA9IDxQcm9qZWN0PnJlcS5ib2R5O1xyXG4gICAgICBwcm9qZWN0RGV0YWlsc1snX2lkJ10gPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLnVwZGF0ZVByb2plY3RCeUlkKCBwcm9qZWN0RGV0YWlscywgdXNlciwgKGVycm9yLCByZXN1bHQpPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbG9nZ2VyLmluZm8oJ1VwZGF0ZSBwcm9qZWN0ICcrcmVzdWx0LmRhdGEubmFtZSk7XHJcbiAgICAgICAgICBsb2dnZXIuZGVidWcoJ1VwZGF0ZWQgUHJvamVjdCBOYW1lIDogJytyZXN1bHQuZGF0YS5uYW1lKTtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY3JlYXRlQnVpbGRpbmcocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBjb250cm9sbGVyLCBhZGRCdWlsZGluZyBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBsZXQgYnVpbGRpbmdEZXRhaWxzID0gPEJ1aWxkaW5nPiByZXEuYm9keTtcclxuXHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgICBwcm9qZWN0U2VydmljZS5jcmVhdGVCdWlsZGluZyggcHJvamVjdElkLCBidWlsZGluZ0RldGFpbHMsIHVzZXIsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnQWRkIEJ1aWxkaW5nICcrcmVzdWx0LmRhdGEuX2RvYy5uYW1lKTtcclxuICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnQWRkZWQgQnVpbGRpbmcgTmFtZSA6ICcrcmVzdWx0LmRhdGEuX2RvYy5uYW1lKTtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdXBkYXRlQnVpbGRpbmdCeUlkKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3QgY29udHJvbGxlciwgdXBkYXRlQnVpbGRpbmcgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgICBsZXQgYnVpbGRpbmdEZXRhaWxzID0gPEJ1aWxkaW5nPiByZXEuYm9keTtcclxuICAgICAgbGV0IHByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLnVwZGF0ZUJ1aWxkaW5nQnlJZCggYnVpbGRpbmdJZCwgYnVpbGRpbmdEZXRhaWxzLCB1c2VyLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbG9nZ2VyLmluZm8oJ1VwZGF0ZSBCdWlsZGluZyAnK3Jlc3VsdC5kYXRhLl9kb2MubmFtZSk7XHJcbiAgICAgICAgICBsb2dnZXIuZGVidWcoJ1VwZGF0ZWQgQnVpbGRpbmcgTmFtZSA6ICcrcmVzdWx0LmRhdGEuX2RvYy5uYW1lKTtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY2xvbmVCdWlsZGluZ0J5SWQocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBjb250cm9sbGVyLCBjbG9uZUJ1aWxkaW5nIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgICAgbGV0IGJ1aWxkaW5nRGV0YWlscyA9IDxCdWlsZGluZz4gcmVxLmJvZHk7XHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgICBwcm9qZWN0U2VydmljZS5jbG9uZUJ1aWxkaW5nRGV0YWlscyggYnVpbGRpbmdJZCwgYnVpbGRpbmdEZXRhaWxzLCB1c2VyLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbG9nZ2VyLmluZm8oJ0Nsb25lIEJ1aWxkaW5nICcrcmVzdWx0LmRhdGEubmFtZSk7XHJcbiAgICAgICAgICBsb2dnZXIuZGVidWcoJ0Nsb25lZCBCdWlsZGluZyBOYW1lIDogJytyZXN1bHQuZGF0YS5uYW1lKTtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0QnVpbGRpbmdCeUlkKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3QgY29udHJvbGxlciwgZ2V0QnVpbGRpbmcgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgICAgbGV0IGJ1aWxkaW5nSWQgPSByZXEucGFyYW1zLmJ1aWxkaW5nSWQ7XHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgICBwcm9qZWN0U2VydmljZS5nZXRCdWlsZGluZ0J5SWQoIHByb2plY3RJZCwgYnVpbGRpbmdJZCwgdXNlciwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdHZXQgQnVpbGRpbmcgJytyZXN1bHQuZGF0YS5uYW1lKTtcclxuICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnR2V0IEJ1aWxkaW5nIE5hbWUgOiAnK3Jlc3VsdC5kYXRhLm5hbWUpO1xyXG4gICAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLHJlc3VsdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXRCdWlsZGluZ0J5SWRGb3JDbG9uZShyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IGNvbnRyb2xsZXIsIGdldEJ1aWxkaW5nRGV0YWlsc0ZvckNsb25lIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIGxldCBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgcHJvamVjdFNlcnZpY2UuZ2V0QnVpbGRpbmdCeUlkRm9yQ2xvbmUoIHByb2plY3RJZCwgYnVpbGRpbmdJZCwgdXNlciwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdHZXQgQnVpbGRpbmcgZGV0YWlscyBmb3IgY2xvbmUgJytyZXN1bHQuZGF0YS5uYW1lKTtcclxuICAgICAgICAgIGxvZ2dlci5kZWJ1ZyhyZXN1bHQuZGF0YS5uYW1lKycgQnVpbGRpbmcgZGV0YWlscyBmb3IgY2xvbmUgLi4uUHJvamVjdElEIDogJytwcm9qZWN0SWQrJywgQnVpbGRpbmdJRCA6ICcrYnVpbGRpbmdJZCk7XHJcbiAgICAgICAgICBuZXh0KG5ldyBSZXNwb25zZSgyMDAscmVzdWx0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICBuZXh0KG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oZS5tZXNzYWdlLGUuc3RhY2spKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldEluQWN0aXZlQ29zdEhlYWQocmVxOmV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IGNvbnRyb2xsZXIsIGdldEluQWN0aXZlQ29zdEhlYWQgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgICAgbGV0IGJ1aWxkaW5nSWQgPSByZXEucGFyYW1zLmJ1aWxkaW5nSWQ7XHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgICBwcm9qZWN0U2VydmljZS5nZXRJbkFjdGl2ZUNvc3RIZWFkKCBwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIHVzZXIsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbG9nZ2VyLmluZm8oJ0dldCBJbkFjdGl2ZSBDb3N0SGVhZCBzdWNjZXNzJyk7XHJcbiAgICAgICAgICBuZXh0KG5ldyBSZXNwb25zZSgyMDAsIHJlc3VsdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsIGUuc3RhY2spKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldEluQWN0aXZlV29ya0l0ZW1zT2ZCdWlsZGluZ0Nvc3RIZWFkcyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdnZXRJbkFjdGl2ZVdvcmtJdGVtcyBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBsZXQgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgICAgbGV0IGNvc3RIZWFkSWQgOiBudW1iZXIgPSBwYXJzZUludChyZXEucGFyYW1zLmNvc3RIZWFkSWQpO1xyXG4gICAgICBsZXQgY2F0ZWdvcnlJZCA6IG51bWJlciA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY2F0ZWdvcnlJZCk7XHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgICBwcm9qZWN0U2VydmljZS5nZXRJbkFjdGl2ZVdvcmtJdGVtc09mQnVpbGRpbmdDb3N0SGVhZHMoIHByb2plY3RJZCwgYnVpbGRpbmdJZCwgY29zdEhlYWRJZCwgY2F0ZWdvcnlJZCwgdXNlciwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdHZXQgSW5BY3RpdmUgV29ya0l0ZW0gc3VjY2VzcycpO1xyXG4gICAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLHJlc3VsdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBHZXQgSW4gQWN0aXZlIFdvcmtJdGVtcyBPZiBQcm9qZWN0IENvc3QgSGVhZHNcclxuICBnZXRJbkFjdGl2ZVdvcmtJdGVtc09mUHJvamVjdENvc3RIZWFkcyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IENvbnRyb2xsZXIsIEdldCBJbi1BY3RpdmUgV29ya0l0ZW1zIE9mIFByb2plY3QgQ29zdCBIZWFkcyBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBsZXQgY29zdEhlYWRJZCA6IG51bWJlciA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY29zdEhlYWRJZCk7XHJcbiAgICAgIGxldCBjYXRlZ29yeUlkIDogbnVtYmVyID0gcGFyc2VJbnQocmVxLnBhcmFtcy5jYXRlZ29yeUlkKTtcclxuICAgICAgbGV0IHByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLmdldEluQWN0aXZlV29ya0l0ZW1zT2ZQcm9qZWN0Q29zdEhlYWRzKCBwcm9qZWN0SWQsIGNvc3RIZWFkSWQsIGNhdGVnb3J5SWQsIHVzZXIsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYoZXJyb3JcclxuICAgICAgICApIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnR2V0IEluLUFjdGl2ZSBXb3JrSXRlbXMgT2YgUHJvamVjdCBDb3N0IEhlYWRzIHN1Y2Nlc3MnKTtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZGVsZXRlQnVpbGRpbmdCeUlkKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3QgY29udHJvbGxlciwgZGVsZXRlQnVpbGRpbmcgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIGxldCBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgcHJvamVjdFNlcnZpY2UuZGVsZXRlQnVpbGRpbmdCeUlkKCBwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIHVzZXIsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnQnVpbGRpbmcgRGVsZXRlIGZyb20gJytyZXN1bHQuZGF0YS5uYW1lKyAnIHByb2plY3QnKTtcclxuICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnQnVpbGRpbmcgRGVsZXRlZCBmcm9tICcrcmVzdWx0LmRhdGEubmFtZSsgJyBwcm9qZWN0Jyk7XHJcbiAgICAgICAgICBuZXh0KG5ldyBSZXNwb25zZSgyMDAscmVzdWx0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICBuZXh0KG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oZS5tZXNzYWdlLGUuc3RhY2spKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldFJhdGUocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBjb250cm9sbGVyLCBnZXRSYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIGxldCBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgICBsZXQgY29zdEhlYWRJZCA9cGFyc2VJbnQocmVxLnBhcmFtcy5jb3N0SGVhZElkKTtcclxuICAgICAgbGV0IGNhdGVnb3J5SWQgPXBhcnNlSW50KHJlcS5wYXJhbXMuY2F0ZWdvcnlJZCk7XHJcbiAgICAgIGxldCB3b3JrSXRlbUlkID1wYXJzZUludChyZXEucGFyYW1zLndvcmtJdGVtSWQpO1xyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgY29uc29sZS5sb2coJyB3b3JraXRlbUlkID0+ICcrIHdvcmtJdGVtSWQpO1xyXG4gICAgICBwcm9qZWN0U2VydmljZS5nZXRSYXRlKCBwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIGNvc3RIZWFkSWQsIGNhdGVnb3J5SWQsIHdvcmtJdGVtSWQsIHVzZXIsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnR2V0IFJhdGUgU3VjY2VzcycpO1xyXG4gICAgICAgICAgbG9nZ2VyLmRlYnVnKCdHZXR0aW5nIFJhdGUgb2YgUHJvamVjdCBJRCA6ICcrcHJvamVjdElkKycgQnVpbGRpbmcgSUQgOiAnK2J1aWxkaW5nSWQpO1xyXG4gICAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLHJlc3VsdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB1cGRhdGVSYXRlT2ZCdWlsZGluZ0Nvc3RIZWFkcyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgICAgbGV0IGJ1aWxkaW5nSWQgPSByZXEucGFyYW1zLmJ1aWxkaW5nSWQ7XHJcbiAgICAgIGxldCBjb3N0SGVhZElkID1wYXJzZUludChyZXEucGFyYW1zLmNvc3RIZWFkSWQpO1xyXG4gICAgICBsZXQgY2F0ZWdvcnlJZCA9cGFyc2VJbnQocmVxLnBhcmFtcy5jYXRlZ29yeUlkKTtcclxuICAgICAgbGV0IHdvcmtJdGVtSWQgPXBhcnNlSW50KHJlcS5wYXJhbXMud29ya0l0ZW1JZCk7XHJcbiAgICAgIGxldCByYXRlIDogUmF0ZSA9IDxSYXRlPiByZXEuYm9keTtcclxuICAgICAgbGV0IHByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcbiAgICAgIGNvbnNvbGUubG9nKCcgd29ya2l0ZW1JZCA9PiAnKyB3b3JrSXRlbUlkKTtcclxuICAgICAgcHJvamVjdFNlcnZpY2UudXBkYXRlUmF0ZU9mQnVpbGRpbmdDb3N0SGVhZHMoIHByb2plY3RJZCwgYnVpbGRpbmdJZCwgY29zdEhlYWRJZCxjYXRlZ29yeUlkICxcclxuICAgICAgICB3b3JrSXRlbUlkLCByYXRlLCB1c2VyLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbG9nZ2VyLmluZm8oJ0dldCBSYXRlIFN1Y2Nlc3MnKTtcclxuICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnR2V0dGluZyBSYXRlIG9mIFByb2plY3QgSUQgOiAnK3Byb2plY3RJZCsnIEJ1aWxkaW5nIElEIDogJytidWlsZGluZ0lkKTtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy9VcGRhdGUgRGlyZWN0IFJhdGUgb2YgQnVpbGRpbmcgQ29zdGhlYWRzXHJcbiAgdXBkYXRlRGlyZWN0UmF0ZU9mQnVpbGRpbmdXb3JrSXRlbXMocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBjb250cm9sbGVyLCB1cGRhdGUgRGlyZWN0UmF0ZSBPZiBCdWlsZGluZyBXb3JrSXRlbXMgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgICAgbGV0IGJ1aWxkaW5nSWQgPSByZXEucGFyYW1zLmJ1aWxkaW5nSWQ7XHJcbiAgICAgIGxldCBjb3N0SGVhZElkID0gcGFyc2VJbnQocmVxLnBhcmFtcy5jb3N0SGVhZElkKTtcclxuICAgICAgbGV0IGNhdGVnb3J5SWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNhdGVnb3J5SWQpO1xyXG4gICAgICBsZXQgd29ya0l0ZW1JZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMud29ya0l0ZW1JZCk7XHJcbiAgICAgIGxldCBkaXJlY3RSYXRlID0gcmVxLmJvZHkuZGlyZWN0UmF0ZTtcclxuXHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgICBwcm9qZWN0U2VydmljZS51cGRhdGVEaXJlY3RSYXRlT2ZCdWlsZGluZ1dvcmtJdGVtcyggcHJvamVjdElkLCBidWlsZGluZ0lkLCBjb3N0SGVhZElkLFxyXG4gICAgICAgIGNhdGVnb3J5SWQsIHdvcmtJdGVtSWQsIGRpcmVjdFJhdGUsIHVzZXIsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxvZ2dlci5pbmZvKCd1cGRhdGUgRGlyZWN0UmF0ZSBPZiBCdWlsZGluZyBXb3JrSXRlbXMgc3VjY2VzcycpO1xyXG4gICAgICAgICAgICBuZXh0KG5ldyBSZXNwb25zZSgyMDAscmVzdWx0KSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcblxyXG4gIC8vVXBkYXRlIHJhdGUgb2YgcHJvamVjdCBjb3N0IGhlYWRzXHJcbiAgdXBkYXRlUmF0ZU9mUHJvamVjdENvc3RIZWFkcyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IENvbnRyb2xsZXIsIFVwZGF0ZSByYXRlIG9mIHByb2plY3QgY29zdCBoZWFkcyBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBsZXQgY29zdEhlYWRJZCA9cGFyc2VJbnQocmVxLnBhcmFtcy5jb3N0SGVhZElkKTtcclxuICAgICAgbGV0IGNhdGVnb3J5SWQgPXBhcnNlSW50KHJlcS5wYXJhbXMuY2F0ZWdvcnlJZCk7XHJcbiAgICAgIGxldCB3b3JrSXRlbUlkID1wYXJzZUludChyZXEucGFyYW1zLndvcmtJdGVtSWQpO1xyXG4gICAgICBsZXQgcmF0ZSA6IFJhdGUgPSA8UmF0ZT4gcmVxLmJvZHk7XHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgICBwcm9qZWN0U2VydmljZS51cGRhdGVSYXRlT2ZQcm9qZWN0Q29zdEhlYWRzKCBwcm9qZWN0SWQsIGNvc3RIZWFkSWQsY2F0ZWdvcnlJZCAsd29ya0l0ZW1JZCwgcmF0ZSwgdXNlciwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdVcGRhdGUgcmF0ZSBvZiBwcm9qZWN0IGNvc3QgaGVhZHMgU3VjY2VzcycpO1xyXG4gICAgICAgICAgbG9nZ2VyLmRlYnVnKCdVcGRhdGUgcmF0ZSBvZiBwcm9qZWN0IGNvc3QgaGVhZHMgb2YgUHJvamVjdCBJRCA6ICcrcHJvamVjdElkKTtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy9VcGRhdGUgRGlyZWN0IFJhdGUgb2YgUHJvamVjdCBjb3N0aGVhZHNcclxuXHJcbiAgdXBkYXRlRGlyZWN0UmF0ZU9mUHJvamVjdFdvcmtJdGVtcyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IENvbnRyb2xsZXIsdXBkYXRlIERpcmVjdFJhdGUgT2YgUHJvamVjdCBXb3JrSXRlbXMgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBwcm9qZWN0SWQgPSAgcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIGxldCBjb3N0SGVhZElkID0gcGFyc2VJbnQocmVxLnBhcmFtcy5jb3N0SGVhZElkKTtcclxuICAgICAgbGV0IGNhdGVnb3J5SWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNhdGVnb3J5SWQpO1xyXG4gICAgICBsZXQgd29ya0l0ZW1JZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMud29ya0l0ZW1JZCk7XHJcbiAgICAgIGxldCBkaXJlY3RSYXRlID0gcmVxLmJvZHkuZGlyZWN0UmF0ZTtcclxuXHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgICBwcm9qZWN0U2VydmljZS51cGRhdGVEaXJlY3RSYXRlT2ZQcm9qZWN0V29ya0l0ZW1zKCBwcm9qZWN0SWQsIGNvc3RIZWFkSWQsY2F0ZWdvcnlJZCAsd29ya0l0ZW1JZCxcclxuICAgICAgICBkaXJlY3RSYXRlLCB1c2VyLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbG9nZ2VyLmluZm8oJ3VwZGF0ZSBEaXJlY3RSYXRlIE9mIFByb2plY3QgV29ya0l0ZW1zIFN1Y2Nlc3MnKTtcclxuICAgICAgICAgIGxvZ2dlci5kZWJ1ZygndXBkYXRlIERpcmVjdFJhdGUgT2YgUHJvamVjdCBXb3JrSXRlbXMgb2YgUHJvamVjdCBJRCA6ICcrcHJvamVjdElkKTtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZGVsZXRlUXVhbnRpdHlPZkJ1aWxkaW5nQ29zdEhlYWRzQnlOYW1lKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gIHRyeSB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBjb250cm9sbGVyLCBkZWxldGVRdWFudGl0eSBoYXMgYmVlbiBoaXQnKTtcclxuICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICBsZXQgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICBsZXQgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgIGxldCBjb3N0SGVhZElkID0gcGFyc2VJbnQocmVxLnBhcmFtcy5jb3N0SGVhZElkKTtcclxuICAgIGxldCBjYXRlZ29yeUlkID0gcGFyc2VJbnQocmVxLnBhcmFtcy5jYXRlZ29yeUlkKTtcclxuICAgIGxldCB3b3JrSXRlbUlkID0gcGFyc2VJbnQocmVxLnBhcmFtcy53b3JrSXRlbUlkKTtcclxuICAgIGxldCBpdGVtTmFtZSA9IHJlcS5ib2R5Lml0ZW0ubmFtZTtcclxuXHJcbiAgICBsZXQgcHJvamVjdHNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgIHByb2plY3RzZXJ2aWNlLmRlbGV0ZVF1YW50aXR5T2ZCdWlsZGluZ0Nvc3RIZWFkc0J5TmFtZSggcHJvamVjdElkLCBidWlsZGluZ0lkLCBjb3N0SGVhZElkLFxyXG4gICAgICBjYXRlZ29yeUlkLCB3b3JrSXRlbUlkLCBpdGVtTmFtZSwgdXNlciwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbG9nZ2VyLmluZm8oJ0RlbGV0ZSBRdWFudGl0eSAnICsgcmVzdWx0KTtcclxuICAgICAgICAgICBsb2dnZXIuZGVidWcoJ0RlbGV0ZWQgUXVhbnRpdHkgb2YgUHJvamVjdCBJRCA6ICcrcHJvamVjdElkKycsIEJ1aWxkaW5nIElEIDogJytidWlsZGluZ0lkK1xyXG4gICAgICAgICAgICAgJywgQ29zdEhlYWQgOiAnK2Nvc3RIZWFkSWQrJywgV29ya2l0ZW0gOiAnK3dvcmtJdGVtSWQrJywgSXRlbSA6ICcraXRlbU5hbWUpO1xyXG4gICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCwgcmVzdWx0KSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1jYXRjaChlKSB7XHJcbiAgICBuZXh0KG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oZS5tZXNzYWdlLGUuc3RhY2spKTtcclxuICB9XHJcbiAgfVxyXG5cclxuICAvL0RlbGV0ZSBRdWFudGl0eSBPZiBQcm9qZWN0IENvc3QgSGVhZHMgQnkgTmFtZVxyXG4gIGRlbGV0ZVF1YW50aXR5T2ZQcm9qZWN0Q29zdEhlYWRzQnlOYW1lKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3QgY29udHJvbGxlciwgRGVsZXRlIFF1YW50aXR5IE9mIFByb2plY3QgQ29zdCBIZWFkcyBCeSBOYW1lIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIGxldCBjb3N0SGVhZElkID0gcGFyc2VJbnQocmVxLnBhcmFtcy5jb3N0SGVhZElkKTtcclxuICAgICAgbGV0IGNhdGVnb3J5SWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNhdGVnb3J5SWQpO1xyXG4gICAgICBsZXQgd29ya0l0ZW1JZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMud29ya0l0ZW1JZCk7XHJcbiAgICAgIGxldCBpdGVtTmFtZSA9IHJlcS5ib2R5Lml0ZW0ubmFtZTtcclxuXHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgICBwcm9qZWN0U2VydmljZS5kZWxldGVRdWFudGl0eU9mUHJvamVjdENvc3RIZWFkc0J5TmFtZSggcHJvamVjdElkLCBjb3N0SGVhZElkLCBjYXRlZ29yeUlkLCB3b3JrSXRlbUlkLCBpdGVtTmFtZSxcclxuICAgICAgICB1c2VyLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdEZWxldGUgUXVhbnRpdHkgT2YgUHJvamVjdCBDb3N0IEhlYWRzIEJ5IE5hbWUgJyArIHJlc3VsdCk7XHJcbiAgICAgICAgICBsb2dnZXIuZGVidWcoJ0RlbGV0ZSBRdWFudGl0eSBPZiBQcm9qZWN0IENvc3QgSGVhZHMgQnkgTmFtZSBvZiBQcm9qZWN0IElEIDogJytwcm9qZWN0SWQrJywgQ29zdEhlYWQgOiAnK2Nvc3RIZWFkSWQrJywgJyArXHJcbiAgICAgICAgICAgICdXb3JraXRlbSA6ICcrd29ya0l0ZW1JZCsnLCBJdGVtIDogJytpdGVtTmFtZSk7XHJcbiAgICAgICAgICBuZXh0KG5ldyBSZXNwb25zZSgyMDAsIHJlc3VsdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9Y2F0Y2goZSkge1xyXG4gICAgICBuZXh0KG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oZS5tZXNzYWdlLGUuc3RhY2spKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGRlbGV0ZVdvcmtpdGVtKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3QgY29udHJvbGxlciwgZGVsZXRlV29ya2l0ZW0gaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgICAgbGV0IGJ1aWxkaW5nSWQgPSByZXEucGFyYW1zLmJ1aWxkaW5nSWQ7XHJcbiAgICAgIGxldCBjb3N0SGVhZElkID0gcGFyc2VJbnQocmVxLnBhcmFtcy5jb3N0SGVhZElkKTtcclxuICAgICAgbGV0IGNhdGVnb3J5SWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNhdGVnb3J5SWQpO1xyXG4gICAgICBsZXQgd29ya0l0ZW1JZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMud29ya0l0ZW1JZCk7XHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgICBjb25zb2xlLmxvZygnIHdvcmtpdGVtID0+ICcrIHdvcmtJdGVtSWQpO1xyXG4gICAgICBwcm9qZWN0U2VydmljZS5kZWxldGVXb3JraXRlbSggcHJvamVjdElkLCBidWlsZGluZ0lkLCBjb3N0SGVhZElkLCBjYXRlZ29yeUlkLCB3b3JrSXRlbUlkLCB1c2VyLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbG9nZ2VyLmluZm8oJ0RlbGV0ZSB3b3JrIGl0ZW0gJytyZXN1bHQuZGF0YSk7XHJcbiAgICAgICAgICBsb2dnZXIuZGVidWcoJ0RlbGV0ZWQgIHdvcmsgaXRlbSBvZiBQcm9qZWN0IElEIDogJytwcm9qZWN0SWQrJywgQnVpbGRpbmcgSUQgOiAnK2J1aWxkaW5nSWQrXHJcbiAgICAgICAgICAgICcsIENvc3RIZWFkIDogJytjb3N0SGVhZElkKycsIENhdGVnb3J5IDogJytjYXRlZ29yeUlkKycsIFdvcmtpdGVtIDogJyt3b3JrSXRlbUlkKTtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc2V0Q29zdEhlYWRTdGF0dXMocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBjb250cm9sbGVyLCB1cGRhdGVCdWlsZGluZ0Nvc3RIZWFkIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgdHJ5IHtcclxuICAgICAgbGV0IHByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBwcm9qZWN0SWQgPSAgcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIGxldCBidWlsZGluZ0lkID0gIHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgICAgbGV0IGNvc3RIZWFkSWQgPSAgcGFyc2VJbnQocmVxLnBhcmFtcy5jb3N0SGVhZElkKTtcclxuICAgICAgbGV0IGNvc3RIZWFkQWN0aXZlU3RhdHVzID0gcmVxLnBhcmFtcy5hY3RpdmVTdGF0dXM7XHJcblxyXG4gICAgICBwcm9qZWN0U2VydmljZS5zZXRDb3N0SGVhZFN0YXR1cyggYnVpbGRpbmdJZCwgY29zdEhlYWRJZCwgY29zdEhlYWRBY3RpdmVTdGF0dXMsIHVzZXIsKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdVcGRhdGUgQnVpbGRpbmcgQ29zdEhlYWQgRGV0YWlscyBzdWNjZXNzICcpO1xyXG4gICAgICAgICAgbG9nZ2VyLmRlYnVnKCd1cGRhdGVCdWlsZGluZ0Nvc3RIZWFkIGZvciBQcm9qZWN0IElEIDogJytwcm9qZWN0SWQrJywgQnVpbGRpbmcgSUQgOiAnK2J1aWxkaW5nSWQrXHJcbiAgICAgICAgICAgICcsIENvc3RIZWFkIDogJytjb3N0SGVhZElkKycsIGNvc3RIZWFkQWN0aXZlU3RhdHVzIDogJytjb3N0SGVhZEFjdGl2ZVN0YXR1cyk7XHJcbiAgICAgICAgICBuZXh0KG5ldyBSZXNwb25zZSgyMDAscmVzdWx0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICBuZXh0KG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oZS5tZXNzYWdlLGUuc3RhY2spKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHVwZGF0ZVdvcmtJdGVtU3RhdHVzT2ZCdWlsZGluZ0Nvc3RIZWFkcyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IGNvbnRyb2xsZXIsIHVwZGF0ZSBXb3JrSXRlbSBoYXMgYmVlbiBoaXQnKTtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgICAgbGV0IGJ1aWxkaW5nSWQgPSByZXEucGFyYW1zLmJ1aWxkaW5nSWQ7XHJcbiAgICAgIGxldCBjb3N0SGVhZElkID0gcGFyc2VJbnQocmVxLnBhcmFtcy5jb3N0SGVhZElkKTtcclxuICAgICAgbGV0IGNhdGVnb3J5SWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNhdGVnb3J5SWQpO1xyXG4gICAgICBsZXQgd29ya0l0ZW1JZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMud29ya0l0ZW1JZCk7XHJcbiAgICAgIGxldCB3b3JrSXRlbUFjdGl2ZVN0YXR1cyA9IHJlcS5wYXJhbXMuYWN0aXZlU3RhdHVzID09PSAndHJ1ZScgPyB0cnVlIDogZmFsc2U7XHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZTogUHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgcHJvamVjdFNlcnZpY2UudXBkYXRlV29ya0l0ZW1TdGF0dXNPZkJ1aWxkaW5nQ29zdEhlYWRzKCBidWlsZGluZ0lkLCBjb3N0SGVhZElkLCBjYXRlZ29yeUlkLHdvcmtJdGVtSWQsIHdvcmtJdGVtQWN0aXZlU3RhdHVzLCB1c2VyLChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnVXBkYXRlIHdvcmtJdGVtIERldGFpbHMgc3VjY2VzcyAnKTtcclxuICAgICAgICAgIGxvZ2dlci5kZWJ1ZygndXBkYXRlIFdvcmtJdGVtIGZvciBQcm9qZWN0IElEIDogJytwcm9qZWN0SWQrJywgQnVpbGRpbmcgSUQgOiAnK2J1aWxkaW5nSWQrXHJcbiAgICAgICAgICAgICcsIENvc3RIZWFkIDogJytjb3N0SGVhZElkKycsIHdvcmtJdGVtQWN0aXZlU3RhdHVzIDogJyt3b3JrSXRlbUFjdGl2ZVN0YXR1cyk7XHJcbiAgICAgICAgICBuZXh0KG5ldyBSZXNwb25zZSgyMDAscmVzdWx0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICBuZXh0KG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oZS5tZXNzYWdlLGUuc3RhY2spKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gLy8gVXBkYXRlIFdvcmtJdGVtIFN0YXR1cyBPZiBQcm9qZWN0IENvc3RIZWFkc1xyXG4gIHVwZGF0ZVdvcmtJdGVtU3RhdHVzT2ZQcm9qZWN0Q29zdEhlYWRzKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3QgY29udHJvbGxlciwgVXBkYXRlIFdvcmtJdGVtIFN0YXR1cyBPZiBQcm9qZWN0IENvc3QgSGVhZHMgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIGxldCBjb3N0SGVhZElkID0gcGFyc2VJbnQocmVxLnBhcmFtcy5jb3N0SGVhZElkKTtcclxuICAgICAgbGV0IGNhdGVnb3J5SWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNhdGVnb3J5SWQpO1xyXG4gICAgICBsZXQgd29ya0l0ZW1JZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMud29ya0l0ZW1JZCk7XHJcbiAgICAgIGxldCB3b3JrSXRlbUFjdGl2ZVN0YXR1cyA9IHJlcS5wYXJhbXMuYWN0aXZlU3RhdHVzID09PSAndHJ1ZScgPyB0cnVlIDogZmFsc2U7XHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZTogUHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgcHJvamVjdFNlcnZpY2UudXBkYXRlV29ya0l0ZW1TdGF0dXNPZlByb2plY3RDb3N0SGVhZHMoIHByb2plY3RJZCwgY29zdEhlYWRJZCwgY2F0ZWdvcnlJZCx3b3JrSXRlbUlkLFxyXG4gICAgICAgIHdvcmtJdGVtQWN0aXZlU3RhdHVzLCB1c2VyLChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnVXBkYXRlIFdvcmtJdGVtIFN0YXR1cyBPZiBQcm9qZWN0IENvc3QgSGVhZHMgc3VjY2VzcyAnKTtcclxuICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnVXBkYXRlIFdvcmtJdGVtIFN0YXR1cyBPZiBQcm9qZWN0IENvc3QgSGVhZHMgZm9yIFByb2plY3QgSUQgOiAnK3Byb2plY3RJZCsnIENvc3RIZWFkIDogJytjb3N0SGVhZElkKycsICcgK1xyXG4gICAgICAgICAgICAnd29ya0l0ZW1BY3RpdmVTdGF0dXMgOiAnK3dvcmtJdGVtQWN0aXZlU3RhdHVzKTtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdXBkYXRlQnVkZ2V0ZWRDb3N0Rm9yQ29zdEhlYWQocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHByb2plY3RJZCA9ICByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgICAgbGV0IGJ1aWxkaW5nSWQgPSAgcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgICBsZXQgY29zdEhlYWRCdWRnZXRlZEFtb3VudCA9ICByZXEuYm9keTtcclxuXHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLnVwZGF0ZUJ1ZGdldGVkQ29zdEZvckNvc3RIZWFkKCBidWlsZGluZ0lkLCBjb3N0SGVhZEJ1ZGdldGVkQW1vdW50LCB1c2VyLChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBuZXh0KG5ldyBSZXNwb25zZSgyMDAscmVzdWx0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICBuZXh0KG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oZS5tZXNzYWdlLGUuc3RhY2spKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHVwZGF0ZUJ1ZGdldGVkQ29zdEZvclByb2plY3RDb3N0SGVhZChyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcHJvamVjdElkID0gIHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBsZXQgY29zdEhlYWRCdWRnZXRlZEFtb3VudCA9ICByZXEuYm9keTtcclxuXHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLnVwZGF0ZUJ1ZGdldGVkQ29zdEZvclByb2plY3RDb3N0SGVhZCggcHJvamVjdElkLCBjb3N0SGVhZEJ1ZGdldGVkQW1vdW50LCB1c2VyLChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBuZXh0KG5ldyBSZXNwb25zZSgyMDAscmVzdWx0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICBuZXh0KG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oZS5tZXNzYWdlLGUuc3RhY2spKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFkZENvc3RIZWFkQnVpbGRpbmcocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBjb250cm9sbGVyLCBhZGRDb3N0SGVhZEJ1aWxkaW5nIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgICAgbGV0IGNvc3RIZWFkRGV0YWlscyA9IDxDb3N0SGVhZD4gcmVxLmJvZHk7XHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgICBsZXQgcXVlcnkgPSB7JHB1c2g6IHsgY29zdEhlYWQgOiBjb3N0SGVhZERldGFpbHN9fTtcclxuICAgICAgcHJvamVjdFNlcnZpY2UudXBkYXRlQnVpbGRpbmdCeUlkKCBidWlsZGluZ0lkLCBxdWVyeSwgdXNlciwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdBZGQgQ29zdEhlYWQgQnVpbGRpbmcgc3VjY2VzcycpO1xyXG4gICAgICAgICAgbG9nZ2VyLmRlYnVnKCdBZGRlZCBDb3N0SGVhZCBmb3IgQnVpbGRpbmcgSUQgOiAnK2J1aWxkaW5nSWQpO1xyXG4gICAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLHJlc3VsdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB1cGRhdGVRdWFudGl0eU9mQnVpbGRpbmdDb3N0SGVhZHMocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBjb250cm9sbGVyLCB1cGRhdGVRdWFudGl0eSBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBsZXQgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgICAgbGV0IGNvc3RIZWFkSWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNvc3RIZWFkSWQpO1xyXG4gICAgICBsZXQgY2F0ZWdvcnlJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY2F0ZWdvcnlJZCk7XHJcbiAgICAgIGxldCB3b3JrSXRlbUlkID0gcGFyc2VJbnQocmVxLnBhcmFtcy53b3JrSXRlbUlkKTtcclxuICAgICAgbGV0IHF1YW50aXR5RGV0YWlscyA9IHJlcS5ib2R5Lml0ZW07XHJcblxyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgcHJvamVjdFNlcnZpY2UudXBkYXRlUXVhbnRpdHlPZkJ1aWxkaW5nQ29zdEhlYWRzKCBwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIGNvc3RIZWFkSWQsXHJcbiAgICAgICAgY2F0ZWdvcnlJZCwgd29ya0l0ZW1JZCwgcXVhbnRpdHlEZXRhaWxzLCB1c2VyLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbG9nZ2VyLmluZm8oJ1VwZGF0ZSBRdWFudGl0eSBzdWNjZXNzJyk7XHJcbiAgICAgICAgICBuZXh0KG5ldyBSZXNwb25zZSgyMDAscmVzdWx0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICBuZXh0KG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oZS5tZXNzYWdlLGUuc3RhY2spKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHVwZGF0ZURpcmVjdFF1YW50aXR5T2ZCdWlsZGluZ1dvcmtJdGVtcyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IGNvbnRyb2xsZXIsIHVwZGF0ZURpcmVjdFF1YW50aXR5T2ZCdWlsZGluZ0Nvc3RIZWFkcyBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBsZXQgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgICAgbGV0IGNvc3RIZWFkSWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNvc3RIZWFkSWQpO1xyXG4gICAgICBsZXQgY2F0ZWdvcnlJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY2F0ZWdvcnlJZCk7XHJcbiAgICAgIGxldCB3b3JrSXRlbUlkID0gcGFyc2VJbnQocmVxLnBhcmFtcy53b3JrSXRlbUlkKTtcclxuICAgICAgbGV0IGRpcmVjdFF1YW50aXR5ID0gcmVxLmJvZHkuZGlyZWN0UXVhbnRpdHk7XHJcblxyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgcHJvamVjdFNlcnZpY2UudXBkYXRlRGlyZWN0UXVhbnRpdHlPZkJ1aWxkaW5nV29ya0l0ZW1zKCBwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIGNvc3RIZWFkSWQsXHJcbiAgICAgICAgY2F0ZWdvcnlJZCwgd29ya0l0ZW1JZCwgZGlyZWN0UXVhbnRpdHksIHVzZXIsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygndXBkYXRlRGlyZWN0UXVhbnRpdHlPZkJ1aWxkaW5nQ29zdEhlYWRzIHN1Y2Nlc3MnKTtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdXBkYXRlRGlyZWN0UXVhbnRpdHlPZlByb2plY3RXb3JrSXRlbXMocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBjb250cm9sbGVyLCB1cGRhdGVEaXJlY3RRdWFudGl0eU9mQnVpbGRpbmdDb3N0SGVhZHMgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgICAgbGV0IGNvc3RIZWFkSWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNvc3RIZWFkSWQpO1xyXG4gICAgICBsZXQgY2F0ZWdvcnlJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY2F0ZWdvcnlJZCk7XHJcbiAgICAgIGxldCB3b3JrSXRlbUlkID0gcGFyc2VJbnQocmVxLnBhcmFtcy53b3JrSXRlbUlkKTtcclxuICAgICAgbGV0IGRpcmVjdFF1YW50aXR5ID0gcmVxLmJvZHkuZGlyZWN0UXVhbnRpdHk7XHJcblxyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgcHJvamVjdFNlcnZpY2UudXBkYXRlRGlyZWN0UXVhbnRpdHlPZlByb2plY3RXb3JrSXRlbXMoIHByb2plY3RJZCwgY29zdEhlYWRJZCxcclxuICAgICAgICBjYXRlZ29yeUlkLCB3b3JrSXRlbUlkLCBkaXJlY3RRdWFudGl0eSwgdXNlciwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbG9nZ2VyLmluZm8oJ3VwZGF0ZURpcmVjdFF1YW50aXR5T2ZQcm9qZWN0V29ya0l0ZW1zIHN1Y2Nlc3MnKTtcclxuICAgICAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLHJlc3VsdCkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy9VcGRhdGUgUXVhbnRpdHkgT2YgUHJvamVjdCBDb3N0IEhlYWRzXHJcbiAgdXBkYXRlUXVhbnRpdHlPZlByb2plY3RDb3N0SGVhZHMocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBjb250cm9sbGVyLCBVcGRhdGUgUXVhbnRpdHkgT2YgUHJvamVjdCBDb3N0IEhlYWRzIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIGxldCBjb3N0SGVhZElkID0gcGFyc2VJbnQocmVxLnBhcmFtcy5jb3N0SGVhZElkKTtcclxuICAgICAgbGV0IGNhdGVnb3J5SWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNhdGVnb3J5SWQpO1xyXG4gICAgICBsZXQgd29ya0l0ZW1JZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMud29ya0l0ZW1JZCk7XHJcbiAgICAgIGxldCBxdWFudGl0eURldGFpbHMgPSByZXEuYm9keS5pdGVtO1xyXG5cclxuICAgICAgbGV0IHByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLnVwZGF0ZVF1YW50aXR5T2ZQcm9qZWN0Q29zdEhlYWRzKCBwcm9qZWN0SWQsIGNvc3RIZWFkSWQsXHJcbiAgICAgICAgY2F0ZWdvcnlJZCwgd29ya0l0ZW1JZCwgcXVhbnRpdHlEZXRhaWxzLCB1c2VyLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbG9nZ2VyLmluZm8oJ1VwZGF0ZSBRdWFudGl0eSBPZiBQcm9qZWN0IENvc3QgSGVhZHMgc3VjY2VzcycpO1xyXG4gICAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLHJlc3VsdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgLy9HZXQgSW4tQWN0aXZlIENhdGVnb3JpZXMgRnJvbSBEYXRhYmFzZVxyXG4gIGdldEluQWN0aXZlQ2F0ZWdvcmllc0J5Q29zdEhlYWRJZChyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IGNvbnRyb2xsZXIsIGdldENhdGVnb3J5QnlDb3N0SGVhZElkIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIGxldCBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgICBsZXQgY29zdEhlYWRJZCA9IHJlcS5wYXJhbXMuY29zdEhlYWRJZDtcclxuXHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG5cclxuICAgICAgcHJvamVjdFNlcnZpY2UuZ2V0SW5BY3RpdmVDYXRlZ29yaWVzQnlDb3N0SGVhZElkKHByb2plY3RJZCwgYnVpbGRpbmdJZCwgY29zdEhlYWRJZCwgdXNlciwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdHZXQgQ2F0ZWdvcnkgQnkgQ29zdEhlYWRJZCBzdWNjZXNzJyk7XHJcbiAgICAgICAgICBsb2dnZXIuZGVidWcoJ0dldCBDYXRlZ29yeSBCeSBDb3N0SGVhZElkIG9mIFByb2plY3QgSUQgOiAnK3Byb2plY3RJZCsnIEJ1aWxkaW5nIElEIDogJytidWlsZGluZ0lkKTtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0V29ya0l0ZW1MaXN0T2ZCdWlsZGluZ0NhdGVnb3J5KHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ2dldFdvcmtpdGVtTGlzdCBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBsZXQgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgICAgbGV0IGNvc3RIZWFkSWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNvc3RIZWFkSWQpO1xyXG4gICAgICBsZXQgY2F0ZWdvcnlJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY2F0ZWdvcnlJZCk7XHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgICBwcm9qZWN0U2VydmljZS5nZXRXb3JrSXRlbUxpc3RPZkJ1aWxkaW5nQ2F0ZWdvcnkocHJvamVjdElkLCBidWlsZGluZ0lkLCBjb3N0SGVhZElkLCBjYXRlZ29yeUlkLCB1c2VyLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLHJlc3VsdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvL0dldCB3b3JraXRlbXMgZm9yIHBlcnRpY3VsYXIgY2F0ZWdvcnkgb2YgcHJvamVjdCBjb3N0IGhlYWRcclxuICBnZXRXb3JrSXRlbUxpc3RPZlByb2plY3RDYXRlZ29yeShyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdnZXRXb3JraXRlbUxpc3RPZlByb2plY3RDb3N0SGVhZCBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBsZXQgY29zdEhlYWRJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY29zdEhlYWRJZCk7XHJcbiAgICAgIGxldCBjYXRlZ29yeUlkID0gcGFyc2VJbnQocmVxLnBhcmFtcy5jYXRlZ29yeUlkKTtcclxuICAgICAgbGV0IHByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLmdldFdvcmtJdGVtTGlzdE9mUHJvamVjdENhdGVnb3J5KHByb2plY3RJZCwgY29zdEhlYWRJZCwgY2F0ZWdvcnlJZCwgdXNlciwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYWRkV29ya2l0ZW0ocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsb2dnZXIuaW5mbygnYWRkV29ya2l0ZW0gaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgICAgbGV0IGJ1aWxkaW5nSWQgPSByZXEucGFyYW1zLmJ1aWxkaW5nSWQ7XHJcbiAgICAgIGxldCBjb3N0SGVhZElkIDogbnVtYmVyID0gcGFyc2VJbnQocmVxLnBhcmFtcy5jb3N0SGVhZElkKTtcclxuICAgICAgbGV0IGNhdGVnb3J5SWQgOiBudW1iZXIgPSBwYXJzZUludChyZXEucGFyYW1zLmNhdGVnb3J5SWQpO1xyXG4gICAgICBsZXQgd29ya0l0ZW06IFdvcmtJdGVtID0gbmV3IFdvcmtJdGVtKHJlcS5ib2R5Lm5hbWUsIHJlcS5ib2R5LnJhdGVBbmFseXNpc0lkKTtcclxuICAgICAgbGV0IHByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLmFkZFdvcmtpdGVtKCBwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIGNvc3RIZWFkSWQsIGNhdGVnb3J5SWQsIHdvcmtJdGVtLCB1c2VyLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLHJlc3VsdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhZGRDYXRlZ29yeUJ5Q29zdEhlYWRJZChyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IGNvbnRyb2xsZXIsIGFkZENhdGVnb3J5QnlDb3N0SGVhZElkIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIGxldCBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgICBsZXQgY29zdEhlYWRJZCA9IHJlcS5wYXJhbXMuY29zdEhlYWRJZDtcclxuICAgICAgbGV0IGNhdGVnb3J5RGV0YWlscyA9IHJlcS5ib2R5O1xyXG5cclxuICAgICAgbGV0IHByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcblxyXG4gICAgICBwcm9qZWN0U2VydmljZS5hZGRDYXRlZ29yeUJ5Q29zdEhlYWRJZChwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIGNvc3RIZWFkSWQsIGNhdGVnb3J5RGV0YWlscywgdXNlciwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdHZXQgUXVhbnRpdHkgc3VjY2VzcycpO1xyXG4gICAgICAgICAgbG9nZ2VyLmRlYnVnKCdHZXR0aW5nIFF1YW50aXR5IG9mIFByb2plY3QgSUQgOiAnK3Byb2plY3RJZCsnIEJ1aWxkaW5nIElEIDogJytidWlsZGluZ0lkKTtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy9HZXQgYWN0aXZlIGNhdGVnb3JpZXMgZnJvbSBkYXRhYmFzZVxyXG4gIGdldENhdGVnb3JpZXNPZkJ1aWxkaW5nQ29zdEhlYWQocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBjb250cm9sbGVyLCBHZXQgQWN0aXZlIENhdGVnb3JpZXMgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgICAgbGV0IGJ1aWxkaW5nSWQgPSByZXEucGFyYW1zLmJ1aWxkaW5nSWQ7XHJcbiAgICAgIGxldCBjb3N0SGVhZElkID0gcGFyc2VJbnQocmVxLnBhcmFtcy5jb3N0SGVhZElkKTtcclxuICAgICAgbGV0IHByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLmdldENhdGVnb3JpZXNPZkJ1aWxkaW5nQ29zdEhlYWQocHJvamVjdElkLCBidWlsZGluZ0lkLCBjb3N0SGVhZElkLCB1c2VyLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLHJlc3VsdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvL0dldCBjYXRlZ29yaWVzIG9mIHByb2plY3RDb3N0SGVhZHMgZnJvbSBkYXRhYmFzZVxyXG4gIGdldENhdGVnb3JpZXNPZlByb2plY3RDb3N0SGVhZChyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IGNvbnRyb2xsZXIsIEdldCBQcm9qZWN0IENvc3RIZWFkIENhdGVnb3JpZXMgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgICAgbGV0IGNvc3RIZWFkSWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNvc3RIZWFkSWQpO1xyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgcHJvamVjdFNlcnZpY2UuZ2V0Q2F0ZWdvcmllc09mUHJvamVjdENvc3RIZWFkKHByb2plY3RJZCwgY29zdEhlYWRJZCwgdXNlciwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy9VcGRhdGUgc3RhdHVzICggdHJ1ZS9mYWxzZSApIG9mIGNhdGVnb3J5XHJcbiAgdXBkYXRlQ2F0ZWdvcnlTdGF0dXMocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBjb250cm9sbGVyLCB1cGRhdGUgQ2F0ZWdvcnkgU3RhdHVzIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIGxldCBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgICBsZXQgY29zdEhlYWRJZCA9IHBhcnNlRmxvYXQocmVxLnBhcmFtcy5jb3N0SGVhZElkKTtcclxuICAgICAgbGV0IGNhdGVnb3J5SWQgPXBhcnNlRmxvYXQocmVxLnBhcmFtcy5jYXRlZ29yeUlkKTtcclxuICAgICAgbGV0IGNhdGVnb3J5QWN0aXZlU3RhdHVzID0gcmVxLnBhcmFtcy5hY3RpdmVTdGF0dXMgPT09ICd0cnVlJyA/IHRydWUgOiBmYWxzZTtcclxuXHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG5cclxuICAgICAgcHJvamVjdFNlcnZpY2UudXBkYXRlQ2F0ZWdvcnlTdGF0dXMoIHByb2plY3RJZCwgYnVpbGRpbmdJZCwgY29zdEhlYWRJZCwgY2F0ZWdvcnlJZCwgY2F0ZWdvcnlBY3RpdmVTdGF0dXMsXHJcbiAgICAgICAgdXNlciwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbG9nZ2VyLmluZm8oJ1VwZGF0ZSBDYXRlZ29yeSBTdGF0dXMgc3VjY2VzcycpO1xyXG4gICAgICAgICAgICBsb2dnZXIuZGVidWcoJ1VwZGF0ZSBDYXRlZ29yeSBTdGF0dXMgc3VjY2VzcyBvZiBQcm9qZWN0IElEIDogJytwcm9qZWN0SWQrJyBCdWlsZGluZyBJRCA6ICcrYnVpbGRpbmdJZCk7XHJcbiAgICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICBuZXh0KG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oZS5tZXNzYWdlLGUuc3RhY2spKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHN5bmNQcm9qZWN0V2l0aFJhdGVBbmFseXNpc0RhdGEocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBjb250cm9sbGVyLCBzeW5jQnVpbGRpbmdXaXRoUmF0ZUFuYWx5c2lzRGF0YSBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBsZXQgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuXHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG5cclxuICAgICAgcHJvamVjdFNlcnZpY2Uuc3luY1Byb2plY3RXaXRoUmF0ZUFuYWx5c2lzRGF0YSggcHJvamVjdElkLCBidWlsZGluZ0lkLCB1c2VyLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBsb2dnZXIuZXJyb3IoJ3N5bmNQcm9qZWN0V2l0aFJhdGVBbmFseXNpc0RhdGEgZmFpbHVyZScpO1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdzeW5jUHJvamVjdFdpdGhSYXRlQW5hbHlzaXNEYXRhIHN1Y2Nlc3MnKTtcclxuICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnR2V0dGluZyBzeW5jUHJvamVjdFdpdGhSYXRlQW5hbHlzaXNEYXRhIG9mIFByb2plY3QgSUQgOiAnK3Byb2plY3RJZCsnIEJ1aWxkaW5nIElEIDogJytidWlsZGluZ0lkKTtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBuZXh0KG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oZS5tZXNzYWdlLGUuc3RhY2spKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldEJ1aWxkaW5nUmF0ZUl0ZW1zQnlPcmlnaW5hbE5hbWUocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBjb250cm9sbGVyLCBnZXRCdWlsZGluZ1JhdGVJdGVtc0J5T3JpZ2luYWxOYW1lIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIGxldCBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgICBsZXQgb3JpZ2luYWxSYXRlSXRlbU5hbWUgPSByZXEucGFyYW1zLm9yaWdpbmFsUmF0ZUl0ZW1OYW1lO1xyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuXHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLmdldEJ1aWxkaW5nUmF0ZUl0ZW1zQnlPcmlnaW5hbE5hbWUoIHByb2plY3RJZCwgYnVpbGRpbmdJZCwgb3JpZ2luYWxSYXRlSXRlbU5hbWUsIHVzZXIsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIGxvZ2dlci5lcnJvcignZ2V0QnVpbGRpbmdSYXRlSXRlbXNCeU9yaWdpbmFsTmFtZSBmYWlsdXJlJyk7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbG9nZ2VyLmluZm8oJ2dldEJ1aWxkaW5nUmF0ZUl0ZW1zQnlPcmlnaW5hbE5hbWUgc3VjY2VzcycpO1xyXG4gICAgICAgICAgbG9nZ2VyLmRlYnVnKCdHZXR0aW5nIGdldEJ1aWxkaW5nUmF0ZUl0ZW1zQnlPcmlnaW5hbE5hbWUgb2YgUHJvamVjdCBJRCA6ICcrcHJvamVjdElkKycgQnVpbGRpbmcgSUQgOiAnK2J1aWxkaW5nSWQpO1xyXG4gICAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLHJlc3VsdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0UHJvamVjdFJhdGVJdGVtc0J5T3JpZ2luYWxOYW1lKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3QgY29udHJvbGxlciwgZ2V0UHJvamVjdFJhdGVJdGVtc0J5TmFtZSBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBsZXQgb3JpZ2luYWxSYXRlSXRlbU5hbWUgPSByZXEucGFyYW1zLm9yaWdpbmFsUmF0ZUl0ZW1OYW1lO1xyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuXHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLmdldFByb2plY3RSYXRlSXRlbXNCeU9yaWdpbmFsTmFtZSggcHJvamVjdElkLCBvcmlnaW5hbFJhdGVJdGVtTmFtZSwgdXNlciwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgbG9nZ2VyLmVycm9yKCdnZXRQcm9qZWN0UmF0ZUl0ZW1zQnlPcmlnaW5hbE5hbWUgZmFpbHVyZScpO1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdnZXRQcm9qZWN0UmF0ZUl0ZW1zQnlPcmlnaW5hbE5hbWUgc3VjY2VzcycpO1xyXG4gICAgICAgICAgbG9nZ2VyLmRlYnVnKCdHZXR0aW5nIGdldFByb2plY3RSYXRlSXRlbXNCeU9yaWdpbmFsTmFtZSBvZiBQcm9qZWN0IElEIDogJytwcm9qZWN0SWQpO1xyXG4gICAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLHJlc3VsdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG5cclxufVxyXG5leHBvcnQgID0gUHJvamVjdENvbnRyb2xsZXI7XHJcbiJdfQ==
