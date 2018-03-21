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
    ProjectController.prototype.deleteQuantityOfBuildingCostHeadsByName = function (req, res, next) {
        try {
            logger.info('Project controller, deleteQuantity has been hit');
            var user = req.user;
            var projectId_6 = req.params.projectId;
            var buildingId_4 = req.params.buildingId;
            var costHeadId_1 = req.params.costHeadId;
            var categoryId = req.params.categoryId;
            var workItemId_1 = req.params.workItemId;
            var item_1 = req.body.item;
            var projectservice = new ProjectService();
            projectservice.deleteQuantityOfBuildingCostHeadsByName(projectId_6, buildingId_4, costHeadId_1, categoryId, workItemId_1, item_1, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Delete Quantity ' + result);
                    logger.debug('Deleted Quantity of Project ID : ' + projectId_6 + ', Building ID : ' + buildingId_4 +
                        ', CostHead : ' + costHeadId_1 + ', Workitem : ' + workItemId_1 + ', Item : ' + item_1);
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
            var projectId_7 = req.params.projectId;
            var costHeadId_2 = req.params.costHeadId;
            var categoryId = req.params.categoryId;
            var workItemId_2 = req.params.workItemId;
            var item_2 = req.body.item;
            var projectservice = new ProjectService();
            projectservice.deleteQuantityOfProjectCostHeadsByName(projectId_7, costHeadId_2, categoryId, workItemId_2, item_2, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Delete Quantity Of Project Cost Heads By Name ' + result);
                    logger.debug('Delete Quantity Of Project Cost Heads By Name of Project ID : ' + projectId_7 + ', CostHead : ' + costHeadId_2 + ', ' +
                        'Workitem : ' + workItemId_2 + ', Item : ' + item_2);
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
            var projectId_8 = req.params.projectId;
            var buildingId_5 = req.params.buildingId;
            var costHeadId_3 = parseInt(req.params.costHeadId);
            var categoryId_1 = parseInt(req.params.categoryId);
            var workItemId_3 = parseInt(req.params.workItemId);
            var projectService = new ProjectService();
            console.log(' workitem => ' + workItemId_3);
            projectService.deleteWorkitem(projectId_8, buildingId_5, costHeadId_3, categoryId_1, workItemId_3, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Delete work item ' + result.data);
                    logger.debug('Deleted  work item of Project ID : ' + projectId_8 + ', Building ID : ' + buildingId_5 +
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
            var projectId_9 = req.params.projectId;
            var buildingId_6 = req.params.buildingId;
            var costHeadId_4 = parseInt(req.params.costHeadId);
            var costHeadActiveStatus_1 = req.params.activeStatus;
            projectService.setCostHeadStatus(buildingId_6, costHeadId_4, costHeadActiveStatus_1, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Update Building CostHead Details success ');
                    logger.debug('updateBuildingCostHead for Project ID : ' + projectId_9 + ', Building ID : ' + buildingId_6 +
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
            var projectId_10 = req.params.projectId;
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
                    logger.debug('update WorkItem for Project ID : ' + projectId_10 + ', Building ID : ' + buildingId_7 +
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
            var projectId_11 = req.params.projectId;
            var costHeadId_6 = parseInt(req.params.costHeadId);
            var categoryId = parseInt(req.params.categoryId);
            var workItemId = parseInt(req.params.workItemId);
            var workItemActiveStatus_2 = req.params.activeStatus === 'true' ? true : false;
            var projectService = new ProjectService();
            projectService.updateWorkItemStatusOfProjectCostHeads(projectId_11, costHeadId_6, categoryId, workItemId, workItemActiveStatus_2, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Update WorkItem Status Of Project Cost Heads success ');
                    logger.debug('Update WorkItem Status Of Project Cost Heads for Project ID : ' + projectId_11 + ' CostHead : ' + costHeadId_6 + ', ' +
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
            var quantityItems = req.body.item;
            var projectService = new ProjectService();
            projectService.updateQuantityOfBuildingCostHeads(projectId, buildingId, costHeadId, categoryId, workItemId, quantityItems, user, function (error, result) {
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
    ProjectController.prototype.updateQuantityOfProjectCostHeads = function (req, res, next) {
        try {
            logger.info('Project controller, Update Quantity Of Project Cost Heads has been hit');
            var user = req.user;
            var projectId = req.params.projectId;
            var costHeadId = parseInt(req.params.costHeadId);
            var categoryId = parseInt(req.params.categoryId);
            var workItemId = parseInt(req.params.workItemId);
            var quantityItems = req.body.item;
            var projectService = new ProjectService();
            projectService.updateQuantityOfProjectCostHeads(projectId, costHeadId, categoryId, workItemId, quantityItems, user, function (error, result) {
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
            var projectId_12 = req.params.projectId;
            var buildingId_9 = req.params.buildingId;
            var costHeadId = req.params.costHeadId;
            var projectService = new ProjectService();
            projectService.getInActiveCategoriesByCostHeadId(projectId_12, buildingId_9, costHeadId, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Get Category By CostHeadId success');
                    logger.debug('Get Category By CostHeadId of Project ID : ' + projectId_12 + ' Building ID : ' + buildingId_9);
                    next(new Response(200, result));
                }
            });
        }
        catch (e) {
            next(new CostControllException(e.message, e.stack));
        }
    };
    ProjectController.prototype.getWorkitemList = function (req, res, next) {
        try {
            logger.info('getWorkitemList has been hit');
            var user = req.user;
            var projectId = req.params.projectId;
            var buildingId = req.params.buildingId;
            var costHeadId = req.params.costHeadId;
            var categoryId = parseInt(req.params.categoryId);
            var projectService = new ProjectService();
            projectService.getWorkitemList(projectId, buildingId, costHeadId, categoryId, user, function (error, result) {
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
            var projectId_13 = req.params.projectId;
            var buildingId_10 = req.params.buildingId;
            var costHeadId = req.params.costHeadId;
            var categoryDetails = req.body;
            var projectService = new ProjectService();
            projectService.addCategoryByCostHeadId(projectId_13, buildingId_10, costHeadId, categoryDetails, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Get Quantity success');
                    logger.debug('Getting Quantity of Project ID : ' + projectId_13 + ' Building ID : ' + buildingId_10);
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
            var projectId_14 = req.params.projectId;
            var buildingId_11 = req.params.buildingId;
            var costHeadId = parseFloat(req.params.costHeadId);
            var categoryId = parseFloat(req.params.categoryId);
            var categoryActiveStatus = req.params.activeStatus === 'true' ? true : false;
            var projectService = new ProjectService();
            projectService.updateCategoryStatus(projectId_14, buildingId_11, costHeadId, categoryId, categoryActiveStatus, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    logger.info('Update Category Status success');
                    logger.debug('Update Category Status success of Project ID : ' + projectId_14 + ' Building ID : ' + buildingId_11);
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
            var projectId_15 = req.params.projectId;
            var buildingId_12 = req.params.buildingId;
            var projectService = new ProjectService();
            projectService.syncProjectWithRateAnalysisData(projectId_15, buildingId_12, user, function (error, result) {
                if (error) {
                    logger.error('syncProjectWithRateAnalysisData failure');
                    next(error);
                }
                else {
                    logger.info('syncProjectWithRateAnalysisData success');
                    logger.debug('Getting syncProjectWithRateAnalysisData of Project ID : ' + projectId_15 + ' Building ID : ' + buildingId_12);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHBsaWNhdGlvblByb2plY3QvY29udHJvbGxlcnMvUHJvamVjdENvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLDZEQUFnRTtBQUdoRSwyREFBOEQ7QUFDOUQsMEVBQTZFO0FBRzdFLHdFQUEyRTtBQUMzRSxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDL0IsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLElBQUksTUFBTSxHQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUdsRDtJQUdFO1FBQ0UsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO0lBRTlDLENBQUM7SUFFRCx5Q0FBYSxHQUFiLFVBQWMsR0FBb0IsRUFBRSxHQUFxQixFQUFFLElBQVM7UUFDbEUsSUFBSSxDQUFDO1lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO1lBQ3RELElBQUksSUFBSSxHQUFhLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFDOUIsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztZQUVwQixJQUFJLFlBQVksR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQzlDLElBQUksQ0FBQyxLQUFLLEdBQUcsWUFBWSxDQUFDO1lBRTFCLElBQUksY0FBYyxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7WUFDMUMsY0FBYyxDQUFDLGFBQWEsQ0FBRSxJQUFJLEVBQUUsSUFBSSxFQUFDLFVBQUMsS0FBSyxFQUFFLE1BQU07Z0JBQ3JELEVBQUUsQ0FBQSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ1QsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNkLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ04sTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksR0FBQyxzQkFBc0IsQ0FBQyxDQUFDO29CQUNyRCxJQUFJLENBQUMsSUFBSSxRQUFRLENBQUMsR0FBRyxFQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2pDLENBQUM7WUFDSCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBRSxDQUFDO1lBQ1osTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoQixJQUFJLENBQUMsSUFBSSxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3JELENBQUM7SUFDSCxDQUFDO0lBRUQsMENBQWMsR0FBZCxVQUFlLEdBQW9CLEVBQUUsR0FBcUIsRUFBRSxJQUFTO1FBQ25FLElBQUksQ0FBQztZQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsNENBQTRDLENBQUMsQ0FBQztZQUMxRCxJQUFJLGNBQWMsR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO1lBQzFDLElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFDcEIsSUFBSSxXQUFTLEdBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7WUFDdEMsY0FBYyxDQUFDLGNBQWMsQ0FBQyxXQUFTLEVBQUUsSUFBSSxFQUFFLFVBQUMsS0FBSyxFQUFFLE1BQU07Z0JBQzNELEVBQUUsQ0FBQSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ1QsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNkLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ04sTUFBTSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsR0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNwRCxNQUFNLENBQUMsS0FBSyxDQUFDLCtCQUErQixHQUFDLFdBQVMsR0FBQyxtQkFBbUIsR0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNoRyxJQUFJLENBQUMsSUFBSSxRQUFRLENBQUMsR0FBRyxFQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2pDLENBQUM7WUFDSCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFBQyxLQUFLLENBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1YsSUFBSSxDQUFDLElBQUkscUJBQXFCLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNyRCxDQUFDO0lBQ0gsQ0FBQztJQUVELDZDQUFpQixHQUFqQixVQUFrQixHQUFvQixFQUFFLEdBQXFCLEVBQUUsSUFBUztRQUN0RSxJQUFJLENBQUM7WUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLHVEQUF1RCxDQUFDLENBQUM7WUFDckUsSUFBSSxjQUFjLEdBQVksR0FBRyxDQUFDLElBQUksQ0FBQztZQUN2QyxjQUFjLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7WUFDN0MsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztZQUNwQixJQUFJLGNBQWMsR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO1lBQzFDLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLFVBQUMsS0FBSyxFQUFFLE1BQU07Z0JBQ3BFLEVBQUUsQ0FBQSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ1QsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNkLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ04sTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsR0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNoRCxNQUFNLENBQUMsS0FBSyxDQUFDLHlCQUF5QixHQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ3pELElBQUksQ0FBQyxJQUFJLFFBQVEsQ0FBQyxHQUFHLEVBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDakMsQ0FBQztZQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUFDLEtBQUssQ0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDVixJQUFJLENBQUMsSUFBSSxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3JELENBQUM7SUFDSCxDQUFDO0lBRUQsMENBQWMsR0FBZCxVQUFlLEdBQW9CLEVBQUUsR0FBcUIsRUFBRSxJQUFTO1FBQ25FLElBQUksQ0FBQztZQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsOENBQThDLENBQUMsQ0FBQztZQUM1RCxJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO1lBQ3BCLElBQUksU0FBUyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDO1lBQ3JDLElBQUksZUFBZSxHQUFjLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFFMUMsSUFBSSxjQUFjLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQztZQUMxQyxjQUFjLENBQUMsY0FBYyxDQUFFLFNBQVMsRUFBRSxlQUFlLEVBQUUsSUFBSSxFQUFFLFVBQUMsS0FBSyxFQUFFLE1BQU07Z0JBQzdFLEVBQUUsQ0FBQSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ1QsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNkLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ04sTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLEdBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ25ELE1BQU0sQ0FBQyxLQUFLLENBQUMsd0JBQXdCLEdBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQzdELElBQUksQ0FBQyxJQUFJLFFBQVEsQ0FBQyxHQUFHLEVBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDakMsQ0FBQztZQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUFDLEtBQUssQ0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDVixJQUFJLENBQUMsSUFBSSxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3JELENBQUM7SUFDSCxDQUFDO0lBRUQsOENBQWtCLEdBQWxCLFVBQW1CLEdBQW9CLEVBQUUsR0FBcUIsRUFBRSxJQUFTO1FBQ3ZFLElBQUksQ0FBQztZQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsaURBQWlELENBQUMsQ0FBQztZQUMvRCxJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO1lBQ3BCLElBQUksVUFBVSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDO1lBQ3ZDLElBQUksZUFBZSxHQUFjLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFDMUMsSUFBSSxjQUFjLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQztZQUMxQyxjQUFjLENBQUMsa0JBQWtCLENBQUUsVUFBVSxFQUFFLGVBQWUsRUFBRSxJQUFJLEVBQUUsVUFBQyxLQUFLLEVBQUUsTUFBTTtnQkFDbEYsRUFBRSxDQUFBLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDVCxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2QsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDTixNQUFNLENBQUMsSUFBSSxDQUFDLGtCQUFrQixHQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUN0RCxNQUFNLENBQUMsS0FBSyxDQUFDLDBCQUEwQixHQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUMvRCxJQUFJLENBQUMsSUFBSSxRQUFRLENBQUMsR0FBRyxFQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2pDLENBQUM7WUFDSCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFBQyxLQUFLLENBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1YsSUFBSSxDQUFDLElBQUkscUJBQXFCLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNyRCxDQUFDO0lBQ0gsQ0FBQztJQUVELDZDQUFpQixHQUFqQixVQUFrQixHQUFvQixFQUFFLEdBQXFCLEVBQUUsSUFBUztRQUN0RSxJQUFJLENBQUM7WUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLGdEQUFnRCxDQUFDLENBQUM7WUFDOUQsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztZQUNwQixJQUFJLFVBQVUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQztZQUN2QyxJQUFJLGVBQWUsR0FBYyxHQUFHLENBQUMsSUFBSSxDQUFDO1lBQzFDLElBQUksY0FBYyxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7WUFDMUMsY0FBYyxDQUFDLG9CQUFvQixDQUFFLFVBQVUsRUFBRSxlQUFlLEVBQUUsSUFBSSxFQUFFLFVBQUMsS0FBSyxFQUFFLE1BQU07Z0JBQ3BGLEVBQUUsQ0FBQSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ1QsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNkLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ04sTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsR0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNoRCxNQUFNLENBQUMsS0FBSyxDQUFDLHlCQUF5QixHQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ3pELElBQUksQ0FBQyxJQUFJLFFBQVEsQ0FBQyxHQUFHLEVBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDakMsQ0FBQztZQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUFDLEtBQUssQ0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDVixJQUFJLENBQUMsSUFBSSxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3JELENBQUM7SUFDSCxDQUFDO0lBRUQsMkNBQWUsR0FBZixVQUFnQixHQUFvQixFQUFFLEdBQXFCLEVBQUUsSUFBUztRQUNwRSxJQUFJLENBQUM7WUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLDhDQUE4QyxDQUFDLENBQUM7WUFDNUQsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztZQUNwQixJQUFJLFNBQVMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztZQUNyQyxJQUFJLFVBQVUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQztZQUN2QyxJQUFJLGNBQWMsR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO1lBQzFDLGNBQWMsQ0FBQyxlQUFlLENBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsVUFBQyxLQUFLLEVBQUUsTUFBTTtnQkFDekUsRUFBRSxDQUFBLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDVCxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2QsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDTixNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsR0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUM5QyxNQUFNLENBQUMsS0FBSyxDQUFDLHNCQUFzQixHQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ3RELElBQUksQ0FBQyxJQUFJLFFBQVEsQ0FBQyxHQUFHLEVBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDakMsQ0FBQztZQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUFDLEtBQUssQ0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDVixJQUFJLENBQUMsSUFBSSxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3JELENBQUM7SUFDSCxDQUFDO0lBRUQsbURBQXVCLEdBQXZCLFVBQXdCLEdBQW9CLEVBQUUsR0FBcUIsRUFBRSxJQUFTO1FBQzVFLElBQUksQ0FBQztZQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsNkRBQTZELENBQUMsQ0FBQztZQUMzRSxJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO1lBQ3BCLElBQUksV0FBUyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDO1lBQ3JDLElBQUksWUFBVSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDO1lBQ3ZDLElBQUksY0FBYyxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7WUFDMUMsY0FBYyxDQUFDLHVCQUF1QixDQUFFLFdBQVMsRUFBRSxZQUFVLEVBQUUsSUFBSSxFQUFFLFVBQUMsS0FBSyxFQUFFLE1BQU07Z0JBQ2pGLEVBQUUsQ0FBQSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ1QsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNkLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ04sTUFBTSxDQUFDLElBQUksQ0FBQyxpQ0FBaUMsR0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNoRSxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFDLDZDQUE2QyxHQUFDLFdBQVMsR0FBQyxpQkFBaUIsR0FBQyxZQUFVLENBQUMsQ0FBQztvQkFDcEgsSUFBSSxDQUFDLElBQUksUUFBUSxDQUFDLEdBQUcsRUFBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNqQyxDQUFDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBQUMsS0FBSyxDQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNWLElBQUksQ0FBQyxJQUFJLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDckQsQ0FBQztJQUNILENBQUM7SUFFRCwrQ0FBbUIsR0FBbkIsVUFBb0IsR0FBbUIsRUFBRSxHQUFxQixFQUFFLElBQVM7UUFDdkUsSUFBSSxDQUFDO1lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxzREFBc0QsQ0FBQyxDQUFDO1lBQ3BFLElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFDcEIsSUFBSSxTQUFTLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7WUFDckMsSUFBSSxVQUFVLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7WUFDdkMsSUFBSSxjQUFjLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQztZQUMxQyxjQUFjLENBQUMsbUJBQW1CLENBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsVUFBQyxLQUFLLEVBQUUsTUFBTTtnQkFDN0UsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDVixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2QsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDTixNQUFNLENBQUMsSUFBSSxDQUFDLCtCQUErQixDQUFDLENBQUM7b0JBQzdDLElBQUksQ0FBQyxJQUFJLFFBQVEsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDbEMsQ0FBQztZQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDWCxJQUFJLENBQUMsSUFBSSxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3RELENBQUM7SUFDSCxDQUFDO0lBRUQsbUVBQXVDLEdBQXZDLFVBQXdDLEdBQW9CLEVBQUUsR0FBcUIsRUFBRSxJQUFTO1FBQzVGLElBQUksQ0FBQztZQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsbUNBQW1DLENBQUMsQ0FBQztZQUNqRCxJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO1lBQ3BCLElBQUksU0FBUyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDO1lBQ3JDLElBQUksVUFBVSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDO1lBQ3ZDLElBQUksVUFBVSxHQUFZLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzFELElBQUksVUFBVSxHQUFZLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzFELElBQUksY0FBYyxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7WUFDMUMsY0FBYyxDQUFDLHVDQUF1QyxDQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsVUFBQyxLQUFLLEVBQUUsTUFBTTtnQkFDekgsRUFBRSxDQUFBLENBQUMsS0FDSCxDQUFDLENBQUMsQ0FBQztvQkFDRCxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2QsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDTixNQUFNLENBQUMsSUFBSSxDQUFDLCtCQUErQixDQUFDLENBQUM7b0JBQzdDLElBQUksQ0FBQyxJQUFJLFFBQVEsQ0FBQyxHQUFHLEVBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDakMsQ0FBQztZQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUFDLEtBQUssQ0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDVixJQUFJLENBQUMsSUFBSSxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3JELENBQUM7SUFDSCxDQUFDO0lBR0Qsa0VBQXNDLEdBQXRDLFVBQXVDLEdBQW9CLEVBQUUsR0FBcUIsRUFBRSxJQUFTO1FBQzNGLElBQUksQ0FBQztZQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0ZBQWdGLENBQUMsQ0FBQztZQUM5RixJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO1lBQ3BCLElBQUksU0FBUyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDO1lBQ3JDLElBQUksVUFBVSxHQUFZLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzFELElBQUksVUFBVSxHQUFZLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzFELElBQUksY0FBYyxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7WUFDMUMsY0FBYyxDQUFDLHNDQUFzQyxDQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxVQUFDLEtBQUssRUFBRSxNQUFNO2dCQUM1RyxFQUFFLENBQUEsQ0FBQyxLQUNILENBQUMsQ0FBQyxDQUFDO29CQUNELElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDZCxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNOLE1BQU0sQ0FBQyxJQUFJLENBQUMsdURBQXVELENBQUMsQ0FBQztvQkFDckUsSUFBSSxDQUFDLElBQUksUUFBUSxDQUFDLEdBQUcsRUFBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNqQyxDQUFDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBQUMsS0FBSyxDQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNWLElBQUksQ0FBQyxJQUFJLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDckQsQ0FBQztJQUNILENBQUM7SUFFRCw4Q0FBa0IsR0FBbEIsVUFBbUIsR0FBb0IsRUFBRSxHQUFxQixFQUFFLElBQVM7UUFDdkUsTUFBTSxDQUFDLElBQUksQ0FBQyxpREFBaUQsQ0FBQyxDQUFDO1FBQy9ELElBQUksQ0FBQztZQUNILElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFDcEIsSUFBSSxTQUFTLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7WUFDckMsSUFBSSxVQUFVLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7WUFDdkMsSUFBSSxjQUFjLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQztZQUMxQyxjQUFjLENBQUMsa0JBQWtCLENBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsVUFBQyxLQUFLLEVBQUUsTUFBTTtnQkFDNUUsRUFBRSxDQUFBLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDVCxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2QsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDTixNQUFNLENBQUMsSUFBSSxDQUFDLHVCQUF1QixHQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFFLFVBQVUsQ0FBQyxDQUFDO29CQUNsRSxNQUFNLENBQUMsS0FBSyxDQUFDLHdCQUF3QixHQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFFLFVBQVUsQ0FBQyxDQUFDO29CQUNwRSxJQUFJLENBQUMsSUFBSSxRQUFRLENBQUMsR0FBRyxFQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2pDLENBQUM7WUFDSCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFBQyxLQUFLLENBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1YsSUFBSSxDQUFDLElBQUkscUJBQXFCLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNyRCxDQUFDO0lBQ0gsQ0FBQztJQUVELG1DQUFPLEdBQVAsVUFBUSxHQUFvQixFQUFFLEdBQXFCLEVBQUUsSUFBUztRQUM1RCxJQUFJLENBQUM7WUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLDBDQUEwQyxDQUFDLENBQUM7WUFDeEQsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztZQUNwQixJQUFJLFdBQVMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztZQUNyQyxJQUFJLFlBQVUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQztZQUN2QyxJQUFJLFVBQVUsR0FBRSxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNoRCxJQUFJLFVBQVUsR0FBRSxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNoRCxJQUFJLFVBQVUsR0FBRSxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNoRCxJQUFJLGNBQWMsR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO1lBQzFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEdBQUUsVUFBVSxDQUFDLENBQUM7WUFDM0MsY0FBYyxDQUFDLE9BQU8sQ0FBRSxXQUFTLEVBQUUsWUFBVSxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxVQUFDLEtBQUssRUFBRSxNQUFNO2dCQUNyRyxFQUFFLENBQUEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUNULElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDZCxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNOLE1BQU0sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztvQkFDaEMsTUFBTSxDQUFDLEtBQUssQ0FBQywrQkFBK0IsR0FBQyxXQUFTLEdBQUMsaUJBQWlCLEdBQUMsWUFBVSxDQUFDLENBQUM7b0JBQ3JGLElBQUksQ0FBQyxJQUFJLFFBQVEsQ0FBQyxHQUFHLEVBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDakMsQ0FBQztZQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUFDLEtBQUssQ0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDVixJQUFJLENBQUMsSUFBSSxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3JELENBQUM7SUFDSCxDQUFDO0lBRUQseURBQTZCLEdBQTdCLFVBQThCLEdBQW9CLEVBQUUsR0FBcUIsRUFBRSxJQUFTO1FBQ2xGLElBQUksQ0FBQztZQUNILElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFDcEIsSUFBSSxXQUFTLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7WUFDckMsSUFBSSxZQUFVLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7WUFDdkMsSUFBSSxVQUFVLEdBQUUsUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDaEQsSUFBSSxVQUFVLEdBQUUsUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDaEQsSUFBSSxVQUFVLEdBQUUsUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDaEQsSUFBSSxJQUFJLEdBQWlCLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFDbEMsSUFBSSxjQUFjLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQztZQUMxQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixHQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQzNDLGNBQWMsQ0FBQyw2QkFBNkIsQ0FBRSxXQUFTLEVBQUUsWUFBVSxFQUFFLFVBQVUsRUFBQyxVQUFVLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsVUFBQyxLQUFLLEVBQUUsTUFBTTtnQkFDaEksRUFBRSxDQUFBLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDVCxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2QsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDTixNQUFNLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7b0JBQ2hDLE1BQU0sQ0FBQyxLQUFLLENBQUMsK0JBQStCLEdBQUMsV0FBUyxHQUFDLGlCQUFpQixHQUFDLFlBQVUsQ0FBQyxDQUFDO29CQUNyRixJQUFJLENBQUMsSUFBSSxRQUFRLENBQUMsR0FBRyxFQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2pDLENBQUM7WUFDSCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFBQyxLQUFLLENBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1YsSUFBSSxDQUFDLElBQUkscUJBQXFCLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNyRCxDQUFDO0lBQ0gsQ0FBQztJQUdELHdEQUE0QixHQUE1QixVQUE2QixHQUFvQixFQUFFLEdBQXFCLEVBQUUsSUFBUztRQUNqRixJQUFJLENBQUM7WUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLG9FQUFvRSxDQUFDLENBQUM7WUFDbEYsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztZQUNwQixJQUFJLFdBQVMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztZQUNyQyxJQUFJLFVBQVUsR0FBRSxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNoRCxJQUFJLFVBQVUsR0FBRSxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNoRCxJQUFJLFVBQVUsR0FBRSxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNoRCxJQUFJLElBQUksR0FBaUIsR0FBRyxDQUFDLElBQUksQ0FBQztZQUNsQyxJQUFJLGNBQWMsR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO1lBQzFDLGNBQWMsQ0FBQyw0QkFBNEIsQ0FBRSxXQUFTLEVBQUUsVUFBVSxFQUFDLFVBQVUsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxVQUFDLEtBQUssRUFBRSxNQUFNO2dCQUNuSCxFQUFFLENBQUEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUNULElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDZCxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNOLE1BQU0sQ0FBQyxJQUFJLENBQUMsMkNBQTJDLENBQUMsQ0FBQztvQkFDekQsTUFBTSxDQUFDLEtBQUssQ0FBQyxvREFBb0QsR0FBQyxXQUFTLENBQUMsQ0FBQztvQkFDN0UsSUFBSSxDQUFDLElBQUksUUFBUSxDQUFDLEdBQUcsRUFBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNqQyxDQUFDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBQUMsS0FBSyxDQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNWLElBQUksQ0FBQyxJQUFJLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDckQsQ0FBQztJQUNILENBQUM7SUFFRCxtRUFBdUMsR0FBdkMsVUFBd0MsR0FBb0IsRUFBRSxHQUFxQixFQUFFLElBQVM7UUFDOUYsSUFBSSxDQUFDO1lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxpREFBaUQsQ0FBQyxDQUFDO1lBQy9ELElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFDcEIsSUFBSSxXQUFTLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7WUFDckMsSUFBSSxZQUFVLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7WUFDdkMsSUFBSSxZQUFVLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7WUFDdkMsSUFBSSxVQUFVLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7WUFDdkMsSUFBSSxZQUFVLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7WUFDdkMsSUFBSSxNQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDekIsSUFBSSxjQUFjLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQztZQUMxQyxjQUFjLENBQUMsdUNBQXVDLENBQUUsV0FBUyxFQUFFLFlBQVUsRUFBRSxZQUFVLEVBQUUsVUFBVSxFQUFFLFlBQVUsRUFBRSxNQUFJLEVBQUUsSUFBSSxFQUFFLFVBQUMsS0FBSyxFQUFFLE1BQU07Z0JBQzNJLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ1YsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNkLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ04sTUFBTSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxNQUFNLENBQUMsQ0FBQztvQkFDdEMsTUFBTSxDQUFDLEtBQUssQ0FBQyxtQ0FBbUMsR0FBQyxXQUFTLEdBQUMsa0JBQWtCLEdBQUMsWUFBVTt3QkFDdEYsZUFBZSxHQUFDLFlBQVUsR0FBQyxlQUFlLEdBQUMsWUFBVSxHQUFDLFdBQVcsR0FBQyxNQUFJLENBQUMsQ0FBQztvQkFDN0UsSUFBSSxDQUFDLElBQUksUUFBUSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNsQyxDQUFDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBQUEsS0FBSyxDQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNULElBQUksQ0FBQyxJQUFJLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDckQsQ0FBQztJQUNELENBQUM7SUFHRCxrRUFBc0MsR0FBdEMsVUFBdUMsR0FBb0IsRUFBRSxHQUFxQixFQUFFLElBQVM7UUFDM0YsSUFBSSxDQUFDO1lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxnRkFBZ0YsQ0FBQyxDQUFDO1lBQzlGLElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFDcEIsSUFBSSxXQUFTLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7WUFDckMsSUFBSSxZQUFVLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7WUFDdkMsSUFBSSxVQUFVLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7WUFDdkMsSUFBSSxZQUFVLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7WUFDdkMsSUFBSSxNQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDekIsSUFBSSxjQUFjLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQztZQUMxQyxjQUFjLENBQUMsc0NBQXNDLENBQUUsV0FBUyxFQUFFLFlBQVUsRUFBRSxVQUFVLEVBQUUsWUFBVSxFQUFFLE1BQUksRUFDeEcsSUFBSSxFQUFFLFVBQUMsS0FBSyxFQUFFLE1BQU07Z0JBQ3BCLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ1YsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNkLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ04sTUFBTSxDQUFDLElBQUksQ0FBQyxnREFBZ0QsR0FBRyxNQUFNLENBQUMsQ0FBQztvQkFDdkUsTUFBTSxDQUFDLEtBQUssQ0FBQyxnRUFBZ0UsR0FBQyxXQUFTLEdBQUMsZUFBZSxHQUFDLFlBQVUsR0FBQyxJQUFJO3dCQUNySCxhQUFhLEdBQUMsWUFBVSxHQUFDLFdBQVcsR0FBQyxNQUFJLENBQUMsQ0FBQztvQkFDN0MsSUFBSSxDQUFDLElBQUksUUFBUSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNsQyxDQUFDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBQUEsS0FBSyxDQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNULElBQUksQ0FBQyxJQUFJLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDckQsQ0FBQztJQUNILENBQUM7SUFFRCwwQ0FBYyxHQUFkLFVBQWUsR0FBb0IsRUFBRSxHQUFxQixFQUFFLElBQVM7UUFDbkUsSUFBSSxDQUFDO1lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxpREFBaUQsQ0FBQyxDQUFDO1lBQy9ELElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFDcEIsSUFBSSxXQUFTLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7WUFDckMsSUFBSSxZQUFVLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7WUFDdkMsSUFBSSxZQUFVLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDakQsSUFBSSxZQUFVLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDakQsSUFBSSxZQUFVLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDakQsSUFBSSxjQUFjLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQztZQUMxQyxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsR0FBRSxZQUFVLENBQUMsQ0FBQztZQUN6QyxjQUFjLENBQUMsY0FBYyxDQUFFLFdBQVMsRUFBRSxZQUFVLEVBQUUsWUFBVSxFQUFFLFlBQVUsRUFBRSxZQUFVLEVBQUUsSUFBSSxFQUFFLFVBQUMsS0FBSyxFQUFFLE1BQU07Z0JBQzVHLEVBQUUsQ0FBQSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ1QsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNkLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ04sTUFBTSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsR0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQzdDLE1BQU0sQ0FBQyxLQUFLLENBQUMscUNBQXFDLEdBQUMsV0FBUyxHQUFDLGtCQUFrQixHQUFDLFlBQVU7d0JBQ3hGLGVBQWUsR0FBQyxZQUFVLEdBQUMsZUFBZSxHQUFDLFlBQVUsR0FBQyxlQUFlLEdBQUMsWUFBVSxDQUFDLENBQUM7b0JBQ3BGLElBQUksQ0FBQyxJQUFJLFFBQVEsQ0FBQyxHQUFHLEVBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDakMsQ0FBQztZQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUFDLEtBQUssQ0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDVixJQUFJLENBQUMsSUFBSSxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3JELENBQUM7SUFDSCxDQUFDO0lBRUQsNkNBQWlCLEdBQWpCLFVBQWtCLEdBQW9CLEVBQUUsR0FBcUIsRUFBRSxJQUFTO1FBQ3RFLE1BQU0sQ0FBQyxJQUFJLENBQUMseURBQXlELENBQUMsQ0FBQztRQUN2RSxJQUFJLENBQUM7WUFDSCxJQUFJLGNBQWMsR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO1lBQzFDLElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFDcEIsSUFBSSxXQUFTLEdBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7WUFDdEMsSUFBSSxZQUFVLEdBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7WUFDeEMsSUFBSSxZQUFVLEdBQUksUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDbEQsSUFBSSxzQkFBb0IsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQztZQUVuRCxjQUFjLENBQUMsaUJBQWlCLENBQUUsWUFBVSxFQUFFLFlBQVUsRUFBRSxzQkFBb0IsRUFBRSxJQUFJLEVBQUMsVUFBQyxLQUFLLEVBQUUsTUFBTTtnQkFDakcsRUFBRSxDQUFBLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDVCxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2QsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDTixNQUFNLENBQUMsSUFBSSxDQUFDLDJDQUEyQyxDQUFDLENBQUM7b0JBQ3pELE1BQU0sQ0FBQyxLQUFLLENBQUMsMENBQTBDLEdBQUMsV0FBUyxHQUFDLGtCQUFrQixHQUFDLFlBQVU7d0JBQzdGLGVBQWUsR0FBQyxZQUFVLEdBQUMsMkJBQTJCLEdBQUMsc0JBQW9CLENBQUMsQ0FBQztvQkFDL0UsSUFBSSxDQUFDLElBQUksUUFBUSxDQUFDLEdBQUcsRUFBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNqQyxDQUFDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBQUMsS0FBSyxDQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNWLElBQUksQ0FBQyxJQUFJLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDckQsQ0FBQztJQUNILENBQUM7SUFFRCxtRUFBdUMsR0FBdkMsVUFBd0MsR0FBb0IsRUFBRSxHQUFxQixFQUFFLElBQVM7UUFDNUYsTUFBTSxDQUFDLElBQUksQ0FBQyxrREFBa0QsQ0FBQyxDQUFDO1FBQ2hFLElBQUksQ0FBQztZQUNILElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFDcEIsSUFBSSxZQUFTLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7WUFDckMsSUFBSSxZQUFVLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7WUFDdkMsSUFBSSxZQUFVLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDakQsSUFBSSxVQUFVLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDakQsSUFBSSxVQUFVLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDakQsSUFBSSxzQkFBb0IsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLFlBQVksS0FBSyxNQUFNLEdBQUcsSUFBSSxHQUFHLEtBQUssQ0FBQztZQUM3RSxJQUFJLGNBQWMsR0FBbUIsSUFBSSxjQUFjLEVBQUUsQ0FBQztZQUMxRCxjQUFjLENBQUMsdUNBQXVDLENBQUUsWUFBVSxFQUFFLFlBQVUsRUFBRSxVQUFVLEVBQUMsVUFBVSxFQUFFLHNCQUFvQixFQUFFLElBQUksRUFBQyxVQUFDLEtBQUssRUFBRSxNQUFNO2dCQUM5SSxFQUFFLENBQUEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUNULElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDZCxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNOLE1BQU0sQ0FBQyxJQUFJLENBQUMsa0NBQWtDLENBQUMsQ0FBQztvQkFDaEQsTUFBTSxDQUFDLEtBQUssQ0FBQyxtQ0FBbUMsR0FBQyxZQUFTLEdBQUMsa0JBQWtCLEdBQUMsWUFBVTt3QkFDdEYsZUFBZSxHQUFDLFlBQVUsR0FBQywyQkFBMkIsR0FBQyxzQkFBb0IsQ0FBQyxDQUFDO29CQUMvRSxJQUFJLENBQUMsSUFBSSxRQUFRLENBQUMsR0FBRyxFQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2pDLENBQUM7WUFDSCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFBQyxLQUFLLENBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1YsSUFBSSxDQUFDLElBQUkscUJBQXFCLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNyRCxDQUFDO0lBQ0gsQ0FBQztJQUdELGtFQUFzQyxHQUF0QyxVQUF1QyxHQUFvQixFQUFFLEdBQXFCLEVBQUUsSUFBUztRQUMzRixNQUFNLENBQUMsSUFBSSxDQUFDLCtFQUErRSxDQUFDLENBQUM7UUFDN0YsSUFBSSxDQUFDO1lBQ0gsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztZQUNwQixJQUFJLFlBQVMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztZQUNyQyxJQUFJLFlBQVUsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNqRCxJQUFJLFVBQVUsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNqRCxJQUFJLFVBQVUsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNqRCxJQUFJLHNCQUFvQixHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsWUFBWSxLQUFLLE1BQU0sR0FBRyxJQUFJLEdBQUcsS0FBSyxDQUFDO1lBQzdFLElBQUksY0FBYyxHQUFtQixJQUFJLGNBQWMsRUFBRSxDQUFDO1lBQzFELGNBQWMsQ0FBQyxzQ0FBc0MsQ0FBRSxZQUFTLEVBQUUsWUFBVSxFQUFFLFVBQVUsRUFBQyxVQUFVLEVBQ2pHLHNCQUFvQixFQUFFLElBQUksRUFBQyxVQUFDLEtBQUssRUFBRSxNQUFNO2dCQUN6QyxFQUFFLENBQUEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUNULElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDZCxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNOLE1BQU0sQ0FBQyxJQUFJLENBQUMsdURBQXVELENBQUMsQ0FBQztvQkFDckUsTUFBTSxDQUFDLEtBQUssQ0FBQyxnRUFBZ0UsR0FBQyxZQUFTLEdBQUMsY0FBYyxHQUFDLFlBQVUsR0FBQyxJQUFJO3dCQUNwSCx5QkFBeUIsR0FBQyxzQkFBb0IsQ0FBQyxDQUFDO29CQUNsRCxJQUFJLENBQUMsSUFBSSxRQUFRLENBQUMsR0FBRyxFQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2pDLENBQUM7WUFDSCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFBQyxLQUFLLENBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1YsSUFBSSxDQUFDLElBQUkscUJBQXFCLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNyRCxDQUFDO0lBQ0gsQ0FBQztJQUVELHlEQUE2QixHQUE3QixVQUE4QixHQUFvQixFQUFFLEdBQXFCLEVBQUUsSUFBUztRQUNsRixJQUFJLENBQUM7WUFDSCxJQUFJLGNBQWMsR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO1lBQzFDLElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFDcEIsSUFBSSxTQUFTLEdBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7WUFDdEMsSUFBSSxVQUFVLEdBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7WUFDeEMsSUFBSSxzQkFBc0IsR0FBSSxHQUFHLENBQUMsSUFBSSxDQUFDO1lBRXZDLGNBQWMsQ0FBQyw2QkFBNkIsQ0FBRSxVQUFVLEVBQUUsc0JBQXNCLEVBQUUsSUFBSSxFQUFDLFVBQUMsS0FBSyxFQUFFLE1BQU07Z0JBQ25HLEVBQUUsQ0FBQSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ1QsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNkLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ04sSUFBSSxDQUFDLElBQUksUUFBUSxDQUFDLEdBQUcsRUFBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNqQyxDQUFDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBQUMsS0FBSyxDQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNWLElBQUksQ0FBQyxJQUFJLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDckQsQ0FBQztJQUNILENBQUM7SUFFRCxnRUFBb0MsR0FBcEMsVUFBcUMsR0FBb0IsRUFBRSxHQUFxQixFQUFFLElBQVM7UUFDekYsSUFBSSxDQUFDO1lBQ0gsSUFBSSxjQUFjLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQztZQUMxQyxJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO1lBQ3BCLElBQUksU0FBUyxHQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDO1lBQ3RDLElBQUksc0JBQXNCLEdBQUksR0FBRyxDQUFDLElBQUksQ0FBQztZQUV2QyxjQUFjLENBQUMsb0NBQW9DLENBQUUsU0FBUyxFQUFFLHNCQUFzQixFQUFFLElBQUksRUFBQyxVQUFDLEtBQUssRUFBRSxNQUFNO2dCQUN6RyxFQUFFLENBQUEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUNULElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDZCxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNOLElBQUksQ0FBQyxJQUFJLFFBQVEsQ0FBQyxHQUFHLEVBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDakMsQ0FBQztZQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUFDLEtBQUssQ0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDVixJQUFJLENBQUMsSUFBSSxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3JELENBQUM7SUFDSCxDQUFDO0lBRUQsK0NBQW1CLEdBQW5CLFVBQW9CLEdBQW9CLEVBQUUsR0FBcUIsRUFBRSxJQUFTO1FBQ3hFLElBQUksQ0FBQztZQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsc0RBQXNELENBQUMsQ0FBQztZQUNwRSxJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO1lBQ3BCLElBQUksWUFBVSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDO1lBQ3ZDLElBQUksZUFBZSxHQUFjLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFDMUMsSUFBSSxjQUFjLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQztZQUMxQyxJQUFJLEtBQUssR0FBRyxFQUFDLEtBQUssRUFBRSxFQUFFLFFBQVEsRUFBRyxlQUFlLEVBQUMsRUFBQyxDQUFDO1lBQ25ELGNBQWMsQ0FBQyxrQkFBa0IsQ0FBRSxZQUFVLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxVQUFDLEtBQUssRUFBRSxNQUFNO2dCQUN4RSxFQUFFLENBQUEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUNULElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDZCxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNOLE1BQU0sQ0FBQyxJQUFJLENBQUMsK0JBQStCLENBQUMsQ0FBQztvQkFDN0MsTUFBTSxDQUFDLEtBQUssQ0FBQyxtQ0FBbUMsR0FBQyxZQUFVLENBQUMsQ0FBQztvQkFDN0QsSUFBSSxDQUFDLElBQUksUUFBUSxDQUFDLEdBQUcsRUFBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNqQyxDQUFDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBQUMsS0FBSyxDQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNWLElBQUksQ0FBQyxJQUFJLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDckQsQ0FBQztJQUNILENBQUM7SUFFRCw2REFBaUMsR0FBakMsVUFBa0MsR0FBb0IsRUFBRSxHQUFxQixFQUFFLElBQVM7UUFDdEYsSUFBSSxDQUFDO1lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxpREFBaUQsQ0FBQyxDQUFDO1lBQy9ELElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFDcEIsSUFBSSxTQUFTLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7WUFDckMsSUFBSSxVQUFVLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7WUFDdkMsSUFBSSxVQUFVLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDakQsSUFBSSxVQUFVLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDakQsSUFBSSxVQUFVLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDakQsSUFBSSxhQUFhLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDbEMsSUFBSSxjQUFjLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQztZQUMxQyxjQUFjLENBQUMsaUNBQWlDLENBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLFVBQUMsS0FBSyxFQUFFLE1BQU07Z0JBQzlJLEVBQUUsQ0FBQSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ1QsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNkLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ04sTUFBTSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO29CQUN2QyxJQUFJLENBQUMsSUFBSSxRQUFRLENBQUMsR0FBRyxFQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2pDLENBQUM7WUFDSCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFBQyxLQUFLLENBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1YsSUFBSSxDQUFDLElBQUkscUJBQXFCLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNyRCxDQUFDO0lBQ0gsQ0FBQztJQUdELDREQUFnQyxHQUFoQyxVQUFpQyxHQUFvQixFQUFFLEdBQXFCLEVBQUUsSUFBUztRQUNyRixJQUFJLENBQUM7WUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLHdFQUF3RSxDQUFDLENBQUM7WUFDdEYsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztZQUNwQixJQUFJLFNBQVMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztZQUNyQyxJQUFJLFVBQVUsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNqRCxJQUFJLFVBQVUsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNqRCxJQUFJLFVBQVUsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNqRCxJQUFJLGFBQWEsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUNsQyxJQUFJLGNBQWMsR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO1lBQzFDLGNBQWMsQ0FBQyxnQ0FBZ0MsQ0FBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBRSxVQUFDLEtBQUssRUFBRSxNQUFNO2dCQUNqSSxFQUFFLENBQUEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUNULElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDZCxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNOLE1BQU0sQ0FBQyxJQUFJLENBQUMsK0NBQStDLENBQUMsQ0FBQztvQkFDN0QsSUFBSSxDQUFDLElBQUksUUFBUSxDQUFDLEdBQUcsRUFBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNqQyxDQUFDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBQUMsS0FBSyxDQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNWLElBQUksQ0FBQyxJQUFJLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDckQsQ0FBQztJQUNILENBQUM7SUFJRCw2REFBaUMsR0FBakMsVUFBa0MsR0FBb0IsRUFBRSxHQUFxQixFQUFFLElBQVM7UUFDdEYsSUFBSSxDQUFDO1lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQywwREFBMEQsQ0FBQyxDQUFDO1lBQ3hFLElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFDcEIsSUFBSSxZQUFTLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7WUFDckMsSUFBSSxZQUFVLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7WUFDdkMsSUFBSSxVQUFVLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7WUFFdkMsSUFBSSxjQUFjLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQztZQUUxQyxjQUFjLENBQUMsaUNBQWlDLENBQUMsWUFBUyxFQUFFLFlBQVUsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLFVBQUMsS0FBSyxFQUFFLE1BQU07Z0JBQ3RHLEVBQUUsQ0FBQSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ1QsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNkLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ04sTUFBTSxDQUFDLElBQUksQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO29CQUNsRCxNQUFNLENBQUMsS0FBSyxDQUFDLDZDQUE2QyxHQUFDLFlBQVMsR0FBQyxpQkFBaUIsR0FBQyxZQUFVLENBQUMsQ0FBQztvQkFDbkcsSUFBSSxDQUFDLElBQUksUUFBUSxDQUFDLEdBQUcsRUFBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNqQyxDQUFDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBQUMsS0FBSyxDQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNWLElBQUksQ0FBQyxJQUFJLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDckQsQ0FBQztJQUNILENBQUM7SUFFRCwyQ0FBZSxHQUFmLFVBQWdCLEdBQW9CLEVBQUUsR0FBcUIsRUFBRSxJQUFTO1FBQ3BFLElBQUksQ0FBQztZQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsOEJBQThCLENBQUMsQ0FBQztZQUM1QyxJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO1lBQ3BCLElBQUksU0FBUyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDO1lBQ3JDLElBQUksVUFBVSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDO1lBQ3ZDLElBQUksVUFBVSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDO1lBQ3ZDLElBQUksVUFBVSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ2pELElBQUksY0FBYyxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7WUFDMUMsY0FBYyxDQUFDLGVBQWUsQ0FBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLFVBQUMsS0FBSyxFQUFFLE1BQU07Z0JBQ2hHLEVBQUUsQ0FBQSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ1QsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNkLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ04sSUFBSSxDQUFDLElBQUksUUFBUSxDQUFDLEdBQUcsRUFBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNqQyxDQUFDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBQUMsS0FBSyxDQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNWLElBQUksQ0FBQyxJQUFJLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDckQsQ0FBQztJQUNILENBQUM7SUFFRCx1Q0FBVyxHQUFYLFVBQVksR0FBb0IsRUFBRSxHQUFxQixFQUFFLElBQVM7UUFDaEUsSUFBSSxDQUFDO1lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1lBQ3hDLElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFDcEIsSUFBSSxTQUFTLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7WUFDckMsSUFBSSxVQUFVLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7WUFDdkMsSUFBSSxVQUFVLEdBQVksUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDMUQsSUFBSSxVQUFVLEdBQVksUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDMUQsSUFBSSxRQUFRLEdBQWEsSUFBSSxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUM5RSxJQUFJLGNBQWMsR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO1lBQzFDLGNBQWMsQ0FBQyxXQUFXLENBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsVUFBQyxLQUFLLEVBQUUsTUFBTTtnQkFDdkcsRUFBRSxDQUFBLENBQUMsS0FDSCxDQUFDLENBQUMsQ0FBQztvQkFDRCxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2QsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDTixJQUFJLENBQUMsSUFBSSxRQUFRLENBQUMsR0FBRyxFQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2pDLENBQUM7WUFDSCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFBQyxLQUFLLENBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1YsSUFBSSxDQUFDLElBQUkscUJBQXFCLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNyRCxDQUFDO0lBQ0gsQ0FBQztJQUVELG1EQUF1QixHQUF2QixVQUF3QixHQUFvQixFQUFFLEdBQXFCLEVBQUUsSUFBUztRQUM1RSxJQUFJLENBQUM7WUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLDBEQUEwRCxDQUFDLENBQUM7WUFDeEUsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztZQUNwQixJQUFJLFlBQVMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztZQUNyQyxJQUFJLGFBQVUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQztZQUN2QyxJQUFJLFVBQVUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQztZQUN2QyxJQUFJLGVBQWUsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO1lBRS9CLElBQUksY0FBYyxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7WUFFMUMsY0FBYyxDQUFDLHVCQUF1QixDQUFDLFlBQVMsRUFBRSxhQUFVLEVBQUUsVUFBVSxFQUFFLGVBQWUsRUFBRSxJQUFJLEVBQUUsVUFBQyxLQUFLLEVBQUUsTUFBTTtnQkFDN0csRUFBRSxDQUFBLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDVCxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2QsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDTixNQUFNLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUM7b0JBQ3BDLE1BQU0sQ0FBQyxLQUFLLENBQUMsbUNBQW1DLEdBQUMsWUFBUyxHQUFDLGlCQUFpQixHQUFDLGFBQVUsQ0FBQyxDQUFDO29CQUN6RixJQUFJLENBQUMsSUFBSSxRQUFRLENBQUMsR0FBRyxFQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2pDLENBQUM7WUFDSCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFBQyxLQUFLLENBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1YsSUFBSSxDQUFDLElBQUkscUJBQXFCLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNyRCxDQUFDO0lBQ0gsQ0FBQztJQUdELDJEQUErQixHQUEvQixVQUFnQyxHQUFvQixFQUFFLEdBQXFCLEVBQUUsSUFBUztRQUNwRixJQUFJLENBQUM7WUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLHdEQUF3RCxDQUFDLENBQUM7WUFDdEUsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztZQUNwQixJQUFJLFNBQVMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztZQUNyQyxJQUFJLFVBQVUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQztZQUN2QyxJQUFJLFVBQVUsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNqRCxJQUFJLGNBQWMsR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO1lBQzFDLGNBQWMsQ0FBQywrQkFBK0IsQ0FBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsVUFBQyxLQUFLLEVBQUUsTUFBTTtnQkFDcEcsRUFBRSxDQUFBLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDVCxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2QsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDTixJQUFJLENBQUMsSUFBSSxRQUFRLENBQUMsR0FBRyxFQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2pDLENBQUM7WUFDSCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFBQyxLQUFLLENBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1YsSUFBSSxDQUFDLElBQUkscUJBQXFCLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNyRCxDQUFDO0lBQ0gsQ0FBQztJQUdELDBEQUE4QixHQUE5QixVQUErQixHQUFvQixFQUFFLEdBQXFCLEVBQUUsSUFBUztRQUNuRixJQUFJLENBQUM7WUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLGtFQUFrRSxDQUFDLENBQUM7WUFDaEYsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztZQUNwQixJQUFJLFNBQVMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztZQUNyQyxJQUFJLFVBQVUsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNqRCxJQUFJLGNBQWMsR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO1lBQzFDLGNBQWMsQ0FBQyw4QkFBOEIsQ0FBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxVQUFDLEtBQUssRUFBRSxNQUFNO2dCQUN2RixFQUFFLENBQUEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUNULElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDZCxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNOLElBQUksQ0FBQyxJQUFJLFFBQVEsQ0FBQyxHQUFHLEVBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDakMsQ0FBQztZQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUFDLEtBQUssQ0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDVixJQUFJLENBQUMsSUFBSSxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3JELENBQUM7SUFDSCxDQUFDO0lBR0QsZ0RBQW9CLEdBQXBCLFVBQXFCLEdBQW9CLEVBQUUsR0FBcUIsRUFBRSxJQUFTO1FBQ3pFLElBQUksQ0FBQztZQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMseURBQXlELENBQUMsQ0FBQztZQUN2RSxJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO1lBQ3BCLElBQUksWUFBUyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDO1lBQ3JDLElBQUksYUFBVSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDO1lBQ3ZDLElBQUksVUFBVSxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ25ELElBQUksVUFBVSxHQUFFLFVBQVUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ2xELElBQUksb0JBQW9CLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxZQUFZLEtBQUssTUFBTSxHQUFHLElBQUksR0FBRyxLQUFLLENBQUM7WUFFN0UsSUFBSSxjQUFjLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQztZQUUxQyxjQUFjLENBQUMsb0JBQW9CLENBQUUsWUFBUyxFQUFFLGFBQVUsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLG9CQUFvQixFQUN0RyxJQUFJLEVBQUUsVUFBQyxLQUFLLEVBQUUsTUFBTTtnQkFDbEIsRUFBRSxDQUFBLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDVCxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2QsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDTixNQUFNLENBQUMsSUFBSSxDQUFDLGdDQUFnQyxDQUFDLENBQUM7b0JBQzlDLE1BQU0sQ0FBQyxLQUFLLENBQUMsaURBQWlELEdBQUMsWUFBUyxHQUFDLGlCQUFpQixHQUFDLGFBQVUsQ0FBQyxDQUFDO29CQUN2RyxJQUFJLENBQUMsSUFBSSxRQUFRLENBQUMsR0FBRyxFQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2pDLENBQUM7WUFDSCxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUM7UUFBQyxLQUFLLENBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1YsSUFBSSxDQUFDLElBQUkscUJBQXFCLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNyRCxDQUFDO0lBQ0gsQ0FBQztJQUVELDJEQUErQixHQUEvQixVQUFnQyxHQUFvQixFQUFFLEdBQXFCLEVBQUUsSUFBUztRQUNwRixJQUFJLENBQUM7WUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLG1FQUFtRSxDQUFDLENBQUM7WUFDakYsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztZQUNwQixJQUFJLFlBQVMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztZQUNyQyxJQUFJLGFBQVUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQztZQUV2QyxJQUFJLGNBQWMsR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO1lBRTFDLGNBQWMsQ0FBQywrQkFBK0IsQ0FBRSxZQUFTLEVBQUUsYUFBVSxFQUFFLElBQUksRUFBRSxVQUFDLEtBQUssRUFBRSxNQUFNO2dCQUN6RixFQUFFLENBQUEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUNULE1BQU0sQ0FBQyxLQUFLLENBQUMseUNBQXlDLENBQUMsQ0FBQztvQkFDeEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNkLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ04sTUFBTSxDQUFDLElBQUksQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFDO29CQUN2RCxNQUFNLENBQUMsS0FBSyxDQUFDLDBEQUEwRCxHQUFDLFlBQVMsR0FBQyxpQkFBaUIsR0FBQyxhQUFVLENBQUMsQ0FBQztvQkFDaEgsSUFBSSxDQUFDLElBQUksUUFBUSxDQUFDLEdBQUcsRUFBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNqQyxDQUFDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNYLElBQUksQ0FBQyxJQUFJLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDckQsQ0FBQztJQUNILENBQUM7SUFDSCx3QkFBQztBQUFELENBMXhCQSxBQTB4QkMsSUFBQTtBQUNELGlCQUFVLGlCQUFpQixDQUFDIiwiZmlsZSI6ImFwcC9hcHBsaWNhdGlvblByb2plY3QvY29udHJvbGxlcnMvUHJvamVjdENvbnRyb2xsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xyXG5pbXBvcnQgUHJvamVjdFNlcnZpY2UgPSByZXF1aXJlKCcuLy4uL3NlcnZpY2VzL1Byb2plY3RTZXJ2aWNlJyk7XHJcbmltcG9ydCBQcm9qZWN0ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb25nb29zZS9Qcm9qZWN0Jyk7XHJcbmltcG9ydCBCdWlsZGluZyA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9uZ29vc2UvQnVpbGRpbmcnKTtcclxuaW1wb3J0IFJlc3BvbnNlID0gcmVxdWlyZSgnLi4vaW50ZXJjZXB0b3IvcmVzcG9uc2UvUmVzcG9uc2UnKTtcclxuaW1wb3J0IENvc3RDb250cm9sbEV4Y2VwdGlvbiA9IHJlcXVpcmUoJy4uL2V4Y2VwdGlvbi9Db3N0Q29udHJvbGxFeGNlcHRpb24nKTtcclxuaW1wb3J0IENvc3RIZWFkID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L2J1aWxkaW5nL0Nvc3RIZWFkJyk7XHJcbmltcG9ydCBSYXRlID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L2J1aWxkaW5nL1JhdGUnKTtcclxuaW1wb3J0IFdvcmtJdGVtID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L2J1aWxkaW5nL1dvcmtJdGVtJyk7XHJcbmxldCBjb25maWcgPSByZXF1aXJlKCdjb25maWcnKTtcclxubGV0IGxvZzRqcyA9IHJlcXVpcmUoJ2xvZzRqcycpO1xyXG5sZXQgbG9nZ2VyPWxvZzRqcy5nZXRMb2dnZXIoJ1Byb2plY3QgQ29udHJvbGxlcicpO1xyXG5cclxuXHJcbmNsYXNzIFByb2plY3RDb250cm9sbGVyIHtcclxuICBwcml2YXRlIF9wcm9qZWN0U2VydmljZSA6IFByb2plY3RTZXJ2aWNlO1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuX3Byb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcblxyXG4gIH1cclxuXHJcbiAgY3JlYXRlUHJvamVjdChyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IGNvbnRyb2xsZXIgY3JlYXRlIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBsZXQgZGF0YSA9ICA8UHJvamVjdD5yZXEuYm9keTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuXHJcbiAgICAgIGxldCBkZWZhdWx0UmF0ZXMgPSBjb25maWcuZ2V0KCdyYXRlLmRlZmF1bHQnKTtcclxuICAgICAgZGF0YS5yYXRlcyA9IGRlZmF1bHRSYXRlcztcclxuXHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgICBwcm9qZWN0U2VydmljZS5jcmVhdGVQcm9qZWN0KCBkYXRhLCB1c2VyLChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbyhyZXN1bHQuX2RvYy5uYW1lKycgcHJvamVjdCBpcyBjcmVhdGVkICcpO1xyXG4gICAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLHJlc3VsdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoIChlKSAge1xyXG4gICAgICBsb2dnZXIuZXJyb3IoZSk7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0UHJvamVjdEJ5SWQocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBjb250cm9sbGVyIGdldFByb2plY3QgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcHJvamVjdElkID0gIHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBwcm9qZWN0U2VydmljZS5nZXRQcm9qZWN0QnlJZChwcm9qZWN0SWQsIHVzZXIsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnR2V0dGluZyBwcm9qZWN0ICcrcmVzdWx0LmRhdGFbMF0ubmFtZSk7XHJcbiAgICAgICAgICBsb2dnZXIuZGVidWcoJ0dldHRpbmcgcHJvamVjdCBQcm9qZWN0IElEIDogJytwcm9qZWN0SWQrJywgUHJvamVjdCBOYW1lIDogJytyZXN1bHQuZGF0YVswXS5uYW1lKTtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdXBkYXRlUHJvamVjdEJ5SWQocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBjb250cm9sbGVyLCB1cGRhdGVQcm9qZWN0RGV0YWlscyBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbGV0IHByb2plY3REZXRhaWxzID0gPFByb2plY3Q+cmVxLmJvZHk7XHJcbiAgICAgIHByb2plY3REZXRhaWxzWydfaWQnXSA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgcHJvamVjdFNlcnZpY2UudXBkYXRlUHJvamVjdEJ5SWQoIHByb2plY3REZXRhaWxzLCB1c2VyLCAoZXJyb3IsIHJlc3VsdCk9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnVXBkYXRlIHByb2plY3QgJytyZXN1bHQuZGF0YS5uYW1lKTtcclxuICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnVXBkYXRlZCBQcm9qZWN0IE5hbWUgOiAnK3Jlc3VsdC5kYXRhLm5hbWUpO1xyXG4gICAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLHJlc3VsdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjcmVhdGVCdWlsZGluZyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IGNvbnRyb2xsZXIsIGFkZEJ1aWxkaW5nIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIGxldCBidWlsZGluZ0RldGFpbHMgPSA8QnVpbGRpbmc+IHJlcS5ib2R5O1xyXG5cclxuICAgICAgbGV0IHByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLmNyZWF0ZUJ1aWxkaW5nKCBwcm9qZWN0SWQsIGJ1aWxkaW5nRGV0YWlscywgdXNlciwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdBZGQgQnVpbGRpbmcgJytyZXN1bHQuZGF0YS5fZG9jLm5hbWUpO1xyXG4gICAgICAgICAgbG9nZ2VyLmRlYnVnKCdBZGRlZCBCdWlsZGluZyBOYW1lIDogJytyZXN1bHQuZGF0YS5fZG9jLm5hbWUpO1xyXG4gICAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLHJlc3VsdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB1cGRhdGVCdWlsZGluZ0J5SWQocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBjb250cm9sbGVyLCB1cGRhdGVCdWlsZGluZyBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IGJ1aWxkaW5nSWQgPSByZXEucGFyYW1zLmJ1aWxkaW5nSWQ7XHJcbiAgICAgIGxldCBidWlsZGluZ0RldGFpbHMgPSA8QnVpbGRpbmc+IHJlcS5ib2R5O1xyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgcHJvamVjdFNlcnZpY2UudXBkYXRlQnVpbGRpbmdCeUlkKCBidWlsZGluZ0lkLCBidWlsZGluZ0RldGFpbHMsIHVzZXIsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnVXBkYXRlIEJ1aWxkaW5nICcrcmVzdWx0LmRhdGEuX2RvYy5uYW1lKTtcclxuICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnVXBkYXRlZCBCdWlsZGluZyBOYW1lIDogJytyZXN1bHQuZGF0YS5fZG9jLm5hbWUpO1xyXG4gICAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLHJlc3VsdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjbG9uZUJ1aWxkaW5nQnlJZChyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IGNvbnRyb2xsZXIsIGNsb25lQnVpbGRpbmcgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgICBsZXQgYnVpbGRpbmdEZXRhaWxzID0gPEJ1aWxkaW5nPiByZXEuYm9keTtcclxuICAgICAgbGV0IHByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLmNsb25lQnVpbGRpbmdEZXRhaWxzKCBidWlsZGluZ0lkLCBidWlsZGluZ0RldGFpbHMsIHVzZXIsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnQ2xvbmUgQnVpbGRpbmcgJytyZXN1bHQuZGF0YS5uYW1lKTtcclxuICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnQ2xvbmVkIEJ1aWxkaW5nIE5hbWUgOiAnK3Jlc3VsdC5kYXRhLm5hbWUpO1xyXG4gICAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLHJlc3VsdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXRCdWlsZGluZ0J5SWQocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBjb250cm9sbGVyLCBnZXRCdWlsZGluZyBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBsZXQgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgICAgbGV0IHByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLmdldEJ1aWxkaW5nQnlJZCggcHJvamVjdElkLCBidWlsZGluZ0lkLCB1c2VyLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbG9nZ2VyLmluZm8oJ0dldCBCdWlsZGluZyAnK3Jlc3VsdC5kYXRhLm5hbWUpO1xyXG4gICAgICAgICAgbG9nZ2VyLmRlYnVnKCdHZXQgQnVpbGRpbmcgTmFtZSA6ICcrcmVzdWx0LmRhdGEubmFtZSk7XHJcbiAgICAgICAgICBuZXh0KG5ldyBSZXNwb25zZSgyMDAscmVzdWx0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICBuZXh0KG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oZS5tZXNzYWdlLGUuc3RhY2spKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldEJ1aWxkaW5nQnlJZEZvckNsb25lKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3QgY29udHJvbGxlciwgZ2V0QnVpbGRpbmdEZXRhaWxzRm9yQ2xvbmUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgICAgbGV0IGJ1aWxkaW5nSWQgPSByZXEucGFyYW1zLmJ1aWxkaW5nSWQ7XHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgICBwcm9qZWN0U2VydmljZS5nZXRCdWlsZGluZ0J5SWRGb3JDbG9uZSggcHJvamVjdElkLCBidWlsZGluZ0lkLCB1c2VyLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbG9nZ2VyLmluZm8oJ0dldCBCdWlsZGluZyBkZXRhaWxzIGZvciBjbG9uZSAnK3Jlc3VsdC5kYXRhLm5hbWUpO1xyXG4gICAgICAgICAgbG9nZ2VyLmRlYnVnKHJlc3VsdC5kYXRhLm5hbWUrJyBCdWlsZGluZyBkZXRhaWxzIGZvciBjbG9uZSAuLi5Qcm9qZWN0SUQgOiAnK3Byb2plY3RJZCsnLCBCdWlsZGluZ0lEIDogJytidWlsZGluZ0lkKTtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0SW5BY3RpdmVDb3N0SGVhZChyZXE6ZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3QgY29udHJvbGxlciwgZ2V0SW5BY3RpdmVDb3N0SGVhZCBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBsZXQgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgICAgbGV0IHByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLmdldEluQWN0aXZlQ29zdEhlYWQoIHByb2plY3RJZCwgYnVpbGRpbmdJZCwgdXNlciwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnR2V0IEluQWN0aXZlIENvc3RIZWFkIHN1Y2Nlc3MnKTtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCwgcmVzdWx0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSwgZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0SW5BY3RpdmVXb3JrSXRlbXNPZkJ1aWxkaW5nQ29zdEhlYWRzKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ2dldEluQWN0aXZlV29ya0l0ZW1zIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIGxldCBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgICBsZXQgY29zdEhlYWRJZCA6IG51bWJlciA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY29zdEhlYWRJZCk7XHJcbiAgICAgIGxldCBjYXRlZ29yeUlkIDogbnVtYmVyID0gcGFyc2VJbnQocmVxLnBhcmFtcy5jYXRlZ29yeUlkKTtcclxuICAgICAgbGV0IHByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLmdldEluQWN0aXZlV29ya0l0ZW1zT2ZCdWlsZGluZ0Nvc3RIZWFkcyggcHJvamVjdElkLCBidWlsZGluZ0lkLCBjb3N0SGVhZElkLCBjYXRlZ29yeUlkLCB1c2VyLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbG9nZ2VyLmluZm8oJ0dldCBJbkFjdGl2ZSBXb3JrSXRlbSBzdWNjZXNzJyk7XHJcbiAgICAgICAgICBuZXh0KG5ldyBSZXNwb25zZSgyMDAscmVzdWx0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICBuZXh0KG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oZS5tZXNzYWdlLGUuc3RhY2spKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIEdldCBJbiBBY3RpdmUgV29ya0l0ZW1zIE9mIFByb2plY3QgQ29zdCBIZWFkc1xyXG4gIGdldEluQWN0aXZlV29ya0l0ZW1zT2ZQcm9qZWN0Q29zdEhlYWRzKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3QgQ29udHJvbGxlciwgR2V0IEluLUFjdGl2ZSBXb3JrSXRlbXMgT2YgUHJvamVjdCBDb3N0IEhlYWRzIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIGxldCBjb3N0SGVhZElkIDogbnVtYmVyID0gcGFyc2VJbnQocmVxLnBhcmFtcy5jb3N0SGVhZElkKTtcclxuICAgICAgbGV0IGNhdGVnb3J5SWQgOiBudW1iZXIgPSBwYXJzZUludChyZXEucGFyYW1zLmNhdGVnb3J5SWQpO1xyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgcHJvamVjdFNlcnZpY2UuZ2V0SW5BY3RpdmVXb3JrSXRlbXNPZlByb2plY3RDb3N0SGVhZHMoIHByb2plY3RJZCwgY29zdEhlYWRJZCwgY2F0ZWdvcnlJZCwgdXNlciwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZihlcnJvclxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdHZXQgSW4tQWN0aXZlIFdvcmtJdGVtcyBPZiBQcm9qZWN0IENvc3QgSGVhZHMgc3VjY2VzcycpO1xyXG4gICAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLHJlc3VsdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBkZWxldGVCdWlsZGluZ0J5SWQocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBjb250cm9sbGVyLCBkZWxldGVCdWlsZGluZyBoYXMgYmVlbiBoaXQnKTtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgICAgbGV0IGJ1aWxkaW5nSWQgPSByZXEucGFyYW1zLmJ1aWxkaW5nSWQ7XHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgICBwcm9qZWN0U2VydmljZS5kZWxldGVCdWlsZGluZ0J5SWQoIHByb2plY3RJZCwgYnVpbGRpbmdJZCwgdXNlciwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdCdWlsZGluZyBEZWxldGUgZnJvbSAnK3Jlc3VsdC5kYXRhLm5hbWUrICcgcHJvamVjdCcpO1xyXG4gICAgICAgICAgbG9nZ2VyLmRlYnVnKCdCdWlsZGluZyBEZWxldGVkIGZyb20gJytyZXN1bHQuZGF0YS5uYW1lKyAnIHByb2plY3QnKTtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0UmF0ZShyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IGNvbnRyb2xsZXIsIGdldFJhdGUgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgICAgbGV0IGJ1aWxkaW5nSWQgPSByZXEucGFyYW1zLmJ1aWxkaW5nSWQ7XHJcbiAgICAgIGxldCBjb3N0SGVhZElkID1wYXJzZUludChyZXEucGFyYW1zLmNvc3RIZWFkSWQpO1xyXG4gICAgICBsZXQgY2F0ZWdvcnlJZCA9cGFyc2VJbnQocmVxLnBhcmFtcy5jYXRlZ29yeUlkKTtcclxuICAgICAgbGV0IHdvcmtJdGVtSWQgPXBhcnNlSW50KHJlcS5wYXJhbXMud29ya0l0ZW1JZCk7XHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgICBjb25zb2xlLmxvZygnIHdvcmtpdGVtSWQgPT4gJysgd29ya0l0ZW1JZCk7XHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLmdldFJhdGUoIHByb2plY3RJZCwgYnVpbGRpbmdJZCwgY29zdEhlYWRJZCwgY2F0ZWdvcnlJZCwgd29ya0l0ZW1JZCwgdXNlciwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdHZXQgUmF0ZSBTdWNjZXNzJyk7XHJcbiAgICAgICAgICBsb2dnZXIuZGVidWcoJ0dldHRpbmcgUmF0ZSBvZiBQcm9qZWN0IElEIDogJytwcm9qZWN0SWQrJyBCdWlsZGluZyBJRCA6ICcrYnVpbGRpbmdJZCk7XHJcbiAgICAgICAgICBuZXh0KG5ldyBSZXNwb25zZSgyMDAscmVzdWx0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICBuZXh0KG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oZS5tZXNzYWdlLGUuc3RhY2spKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHVwZGF0ZVJhdGVPZkJ1aWxkaW5nQ29zdEhlYWRzKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBsZXQgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgICAgbGV0IGNvc3RIZWFkSWQgPXBhcnNlSW50KHJlcS5wYXJhbXMuY29zdEhlYWRJZCk7XHJcbiAgICAgIGxldCBjYXRlZ29yeUlkID1wYXJzZUludChyZXEucGFyYW1zLmNhdGVnb3J5SWQpO1xyXG4gICAgICBsZXQgd29ya0l0ZW1JZCA9cGFyc2VJbnQocmVxLnBhcmFtcy53b3JrSXRlbUlkKTtcclxuICAgICAgbGV0IHJhdGUgOiBSYXRlID0gPFJhdGU+IHJlcS5ib2R5O1xyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgY29uc29sZS5sb2coJyB3b3JraXRlbUlkID0+ICcrIHdvcmtJdGVtSWQpO1xyXG4gICAgICBwcm9qZWN0U2VydmljZS51cGRhdGVSYXRlT2ZCdWlsZGluZ0Nvc3RIZWFkcyggcHJvamVjdElkLCBidWlsZGluZ0lkLCBjb3N0SGVhZElkLGNhdGVnb3J5SWQgLHdvcmtJdGVtSWQsIHJhdGUsIHVzZXIsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnR2V0IFJhdGUgU3VjY2VzcycpO1xyXG4gICAgICAgICAgbG9nZ2VyLmRlYnVnKCdHZXR0aW5nIFJhdGUgb2YgUHJvamVjdCBJRCA6ICcrcHJvamVjdElkKycgQnVpbGRpbmcgSUQgOiAnK2J1aWxkaW5nSWQpO1xyXG4gICAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLHJlc3VsdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvL1VwZGF0ZSByYXRlIG9mIHByb2plY3QgY29zdCBoZWFkc1xyXG4gIHVwZGF0ZVJhdGVPZlByb2plY3RDb3N0SGVhZHMocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBDb250cm9sbGVyLCBVcGRhdGUgcmF0ZSBvZiBwcm9qZWN0IGNvc3QgaGVhZHMgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgICAgbGV0IGNvc3RIZWFkSWQgPXBhcnNlSW50KHJlcS5wYXJhbXMuY29zdEhlYWRJZCk7XHJcbiAgICAgIGxldCBjYXRlZ29yeUlkID1wYXJzZUludChyZXEucGFyYW1zLmNhdGVnb3J5SWQpO1xyXG4gICAgICBsZXQgd29ya0l0ZW1JZCA9cGFyc2VJbnQocmVxLnBhcmFtcy53b3JrSXRlbUlkKTtcclxuICAgICAgbGV0IHJhdGUgOiBSYXRlID0gPFJhdGU+IHJlcS5ib2R5O1xyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgcHJvamVjdFNlcnZpY2UudXBkYXRlUmF0ZU9mUHJvamVjdENvc3RIZWFkcyggcHJvamVjdElkLCBjb3N0SGVhZElkLGNhdGVnb3J5SWQgLHdvcmtJdGVtSWQsIHJhdGUsIHVzZXIsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnVXBkYXRlIHJhdGUgb2YgcHJvamVjdCBjb3N0IGhlYWRzIFN1Y2Nlc3MnKTtcclxuICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnVXBkYXRlIHJhdGUgb2YgcHJvamVjdCBjb3N0IGhlYWRzIG9mIFByb2plY3QgSUQgOiAnK3Byb2plY3RJZCk7XHJcbiAgICAgICAgICBuZXh0KG5ldyBSZXNwb25zZSgyMDAscmVzdWx0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICBuZXh0KG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oZS5tZXNzYWdlLGUuc3RhY2spKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGRlbGV0ZVF1YW50aXR5T2ZCdWlsZGluZ0Nvc3RIZWFkc0J5TmFtZShyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICB0cnkge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3QgY29udHJvbGxlciwgZGVsZXRlUXVhbnRpdHkgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgbGV0IHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgbGV0IGJ1aWxkaW5nSWQgPSByZXEucGFyYW1zLmJ1aWxkaW5nSWQ7XHJcbiAgICBsZXQgY29zdEhlYWRJZCA9IHJlcS5wYXJhbXMuY29zdEhlYWRJZDtcclxuICAgIGxldCBjYXRlZ29yeUlkID0gcmVxLnBhcmFtcy5jYXRlZ29yeUlkO1xyXG4gICAgbGV0IHdvcmtJdGVtSWQgPSByZXEucGFyYW1zLndvcmtJdGVtSWQ7XHJcbiAgICBsZXQgaXRlbSA9IHJlcS5ib2R5Lml0ZW07XHJcbiAgICBsZXQgcHJvamVjdHNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgIHByb2plY3RzZXJ2aWNlLmRlbGV0ZVF1YW50aXR5T2ZCdWlsZGluZ0Nvc3RIZWFkc0J5TmFtZSggcHJvamVjdElkLCBidWlsZGluZ0lkLCBjb3N0SGVhZElkLCBjYXRlZ29yeUlkLCB3b3JrSXRlbUlkLCBpdGVtLCB1c2VyLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsb2dnZXIuaW5mbygnRGVsZXRlIFF1YW50aXR5ICcgKyByZXN1bHQpO1xyXG4gICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnRGVsZXRlZCBRdWFudGl0eSBvZiBQcm9qZWN0IElEIDogJytwcm9qZWN0SWQrJywgQnVpbGRpbmcgSUQgOiAnK2J1aWxkaW5nSWQrXHJcbiAgICAgICAgICAgICAnLCBDb3N0SGVhZCA6ICcrY29zdEhlYWRJZCsnLCBXb3JraXRlbSA6ICcrd29ya0l0ZW1JZCsnLCBJdGVtIDogJytpdGVtKTtcclxuICAgICAgICBuZXh0KG5ldyBSZXNwb25zZSgyMDAsIHJlc3VsdCkpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9Y2F0Y2goZSkge1xyXG4gICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgfVxyXG4gIH1cclxuXHJcbiAgLy9EZWxldGUgUXVhbnRpdHkgT2YgUHJvamVjdCBDb3N0IEhlYWRzIEJ5IE5hbWVcclxuICBkZWxldGVRdWFudGl0eU9mUHJvamVjdENvc3RIZWFkc0J5TmFtZShyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IGNvbnRyb2xsZXIsIERlbGV0ZSBRdWFudGl0eSBPZiBQcm9qZWN0IENvc3QgSGVhZHMgQnkgTmFtZSBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBsZXQgY29zdEhlYWRJZCA9IHJlcS5wYXJhbXMuY29zdEhlYWRJZDtcclxuICAgICAgbGV0IGNhdGVnb3J5SWQgPSByZXEucGFyYW1zLmNhdGVnb3J5SWQ7XHJcbiAgICAgIGxldCB3b3JrSXRlbUlkID0gcmVxLnBhcmFtcy53b3JrSXRlbUlkO1xyXG4gICAgICBsZXQgaXRlbSA9IHJlcS5ib2R5Lml0ZW07XHJcbiAgICAgIGxldCBwcm9qZWN0c2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgICBwcm9qZWN0c2VydmljZS5kZWxldGVRdWFudGl0eU9mUHJvamVjdENvc3RIZWFkc0J5TmFtZSggcHJvamVjdElkLCBjb3N0SGVhZElkLCBjYXRlZ29yeUlkLCB3b3JrSXRlbUlkLCBpdGVtLFxyXG4gICAgICAgIHVzZXIsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbG9nZ2VyLmluZm8oJ0RlbGV0ZSBRdWFudGl0eSBPZiBQcm9qZWN0IENvc3QgSGVhZHMgQnkgTmFtZSAnICsgcmVzdWx0KTtcclxuICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnRGVsZXRlIFF1YW50aXR5IE9mIFByb2plY3QgQ29zdCBIZWFkcyBCeSBOYW1lIG9mIFByb2plY3QgSUQgOiAnK3Byb2plY3RJZCsnLCBDb3N0SGVhZCA6ICcrY29zdEhlYWRJZCsnLCAnICtcclxuICAgICAgICAgICAgJ1dvcmtpdGVtIDogJyt3b3JrSXRlbUlkKycsIEl0ZW0gOiAnK2l0ZW0pO1xyXG4gICAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLCByZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfWNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBkZWxldGVXb3JraXRlbShyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IGNvbnRyb2xsZXIsIGRlbGV0ZVdvcmtpdGVtIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIGxldCBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgICBsZXQgY29zdEhlYWRJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY29zdEhlYWRJZCk7XHJcbiAgICAgIGxldCBjYXRlZ29yeUlkID0gcGFyc2VJbnQocmVxLnBhcmFtcy5jYXRlZ29yeUlkKTtcclxuICAgICAgbGV0IHdvcmtJdGVtSWQgPSBwYXJzZUludChyZXEucGFyYW1zLndvcmtJdGVtSWQpO1xyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgY29uc29sZS5sb2coJyB3b3JraXRlbSA9PiAnKyB3b3JrSXRlbUlkKTtcclxuICAgICAgcHJvamVjdFNlcnZpY2UuZGVsZXRlV29ya2l0ZW0oIHByb2plY3RJZCwgYnVpbGRpbmdJZCwgY29zdEhlYWRJZCwgY2F0ZWdvcnlJZCwgd29ya0l0ZW1JZCwgdXNlciwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdEZWxldGUgd29yayBpdGVtICcrcmVzdWx0LmRhdGEpO1xyXG4gICAgICAgICAgbG9nZ2VyLmRlYnVnKCdEZWxldGVkICB3b3JrIGl0ZW0gb2YgUHJvamVjdCBJRCA6ICcrcHJvamVjdElkKycsIEJ1aWxkaW5nIElEIDogJytidWlsZGluZ0lkK1xyXG4gICAgICAgICAgICAnLCBDb3N0SGVhZCA6ICcrY29zdEhlYWRJZCsnLCBDYXRlZ29yeSA6ICcrY2F0ZWdvcnlJZCsnLCBXb3JraXRlbSA6ICcrd29ya0l0ZW1JZCk7XHJcbiAgICAgICAgICBuZXh0KG5ldyBSZXNwb25zZSgyMDAscmVzdWx0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICBuZXh0KG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oZS5tZXNzYWdlLGUuc3RhY2spKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNldENvc3RIZWFkU3RhdHVzKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgbG9nZ2VyLmluZm8oJ1Byb2plY3QgY29udHJvbGxlciwgdXBkYXRlQnVpbGRpbmdDb3N0SGVhZCBoYXMgYmVlbiBoaXQnKTtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcHJvamVjdElkID0gIHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBsZXQgYnVpbGRpbmdJZCA9ICByZXEucGFyYW1zLmJ1aWxkaW5nSWQ7XHJcbiAgICAgIGxldCBjb3N0SGVhZElkID0gIHBhcnNlSW50KHJlcS5wYXJhbXMuY29zdEhlYWRJZCk7XHJcbiAgICAgIGxldCBjb3N0SGVhZEFjdGl2ZVN0YXR1cyA9IHJlcS5wYXJhbXMuYWN0aXZlU3RhdHVzO1xyXG5cclxuICAgICAgcHJvamVjdFNlcnZpY2Uuc2V0Q29zdEhlYWRTdGF0dXMoIGJ1aWxkaW5nSWQsIGNvc3RIZWFkSWQsIGNvc3RIZWFkQWN0aXZlU3RhdHVzLCB1c2VyLChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnVXBkYXRlIEJ1aWxkaW5nIENvc3RIZWFkIERldGFpbHMgc3VjY2VzcyAnKTtcclxuICAgICAgICAgIGxvZ2dlci5kZWJ1ZygndXBkYXRlQnVpbGRpbmdDb3N0SGVhZCBmb3IgUHJvamVjdCBJRCA6ICcrcHJvamVjdElkKycsIEJ1aWxkaW5nIElEIDogJytidWlsZGluZ0lkK1xyXG4gICAgICAgICAgICAnLCBDb3N0SGVhZCA6ICcrY29zdEhlYWRJZCsnLCBjb3N0SGVhZEFjdGl2ZVN0YXR1cyA6ICcrY29zdEhlYWRBY3RpdmVTdGF0dXMpO1xyXG4gICAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLHJlc3VsdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB1cGRhdGVXb3JrSXRlbVN0YXR1c09mQnVpbGRpbmdDb3N0SGVhZHMocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBjb250cm9sbGVyLCB1cGRhdGUgV29ya0l0ZW0gaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIGxldCBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgICBsZXQgY29zdEhlYWRJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY29zdEhlYWRJZCk7XHJcbiAgICAgIGxldCBjYXRlZ29yeUlkID0gcGFyc2VJbnQocmVxLnBhcmFtcy5jYXRlZ29yeUlkKTtcclxuICAgICAgbGV0IHdvcmtJdGVtSWQgPSBwYXJzZUludChyZXEucGFyYW1zLndvcmtJdGVtSWQpO1xyXG4gICAgICBsZXQgd29ya0l0ZW1BY3RpdmVTdGF0dXMgPSByZXEucGFyYW1zLmFjdGl2ZVN0YXR1cyA9PT0gJ3RydWUnID8gdHJ1ZSA6IGZhbHNlO1xyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2U6IFByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLnVwZGF0ZVdvcmtJdGVtU3RhdHVzT2ZCdWlsZGluZ0Nvc3RIZWFkcyggYnVpbGRpbmdJZCwgY29zdEhlYWRJZCwgY2F0ZWdvcnlJZCx3b3JrSXRlbUlkLCB3b3JrSXRlbUFjdGl2ZVN0YXR1cywgdXNlciwoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbG9nZ2VyLmluZm8oJ1VwZGF0ZSB3b3JrSXRlbSBEZXRhaWxzIHN1Y2Nlc3MgJyk7XHJcbiAgICAgICAgICBsb2dnZXIuZGVidWcoJ3VwZGF0ZSBXb3JrSXRlbSBmb3IgUHJvamVjdCBJRCA6ICcrcHJvamVjdElkKycsIEJ1aWxkaW5nIElEIDogJytidWlsZGluZ0lkK1xyXG4gICAgICAgICAgICAnLCBDb3N0SGVhZCA6ICcrY29zdEhlYWRJZCsnLCB3b3JrSXRlbUFjdGl2ZVN0YXR1cyA6ICcrd29ya0l0ZW1BY3RpdmVTdGF0dXMpO1xyXG4gICAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLHJlc3VsdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuIC8vIFVwZGF0ZSBXb3JrSXRlbSBTdGF0dXMgT2YgUHJvamVjdCBDb3N0SGVhZHNcclxuICB1cGRhdGVXb3JrSXRlbVN0YXR1c09mUHJvamVjdENvc3RIZWFkcyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IGNvbnRyb2xsZXIsIFVwZGF0ZSBXb3JrSXRlbSBTdGF0dXMgT2YgUHJvamVjdCBDb3N0IEhlYWRzIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgdHJ5IHtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBsZXQgY29zdEhlYWRJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY29zdEhlYWRJZCk7XHJcbiAgICAgIGxldCBjYXRlZ29yeUlkID0gcGFyc2VJbnQocmVxLnBhcmFtcy5jYXRlZ29yeUlkKTtcclxuICAgICAgbGV0IHdvcmtJdGVtSWQgPSBwYXJzZUludChyZXEucGFyYW1zLndvcmtJdGVtSWQpO1xyXG4gICAgICBsZXQgd29ya0l0ZW1BY3RpdmVTdGF0dXMgPSByZXEucGFyYW1zLmFjdGl2ZVN0YXR1cyA9PT0gJ3RydWUnID8gdHJ1ZSA6IGZhbHNlO1xyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2U6IFByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLnVwZGF0ZVdvcmtJdGVtU3RhdHVzT2ZQcm9qZWN0Q29zdEhlYWRzKCBwcm9qZWN0SWQsIGNvc3RIZWFkSWQsIGNhdGVnb3J5SWQsd29ya0l0ZW1JZCxcclxuICAgICAgICB3b3JrSXRlbUFjdGl2ZVN0YXR1cywgdXNlciwoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbG9nZ2VyLmluZm8oJ1VwZGF0ZSBXb3JrSXRlbSBTdGF0dXMgT2YgUHJvamVjdCBDb3N0IEhlYWRzIHN1Y2Nlc3MgJyk7XHJcbiAgICAgICAgICBsb2dnZXIuZGVidWcoJ1VwZGF0ZSBXb3JrSXRlbSBTdGF0dXMgT2YgUHJvamVjdCBDb3N0IEhlYWRzIGZvciBQcm9qZWN0IElEIDogJytwcm9qZWN0SWQrJyBDb3N0SGVhZCA6ICcrY29zdEhlYWRJZCsnLCAnICtcclxuICAgICAgICAgICAgJ3dvcmtJdGVtQWN0aXZlU3RhdHVzIDogJyt3b3JrSXRlbUFjdGl2ZVN0YXR1cyk7XHJcbiAgICAgICAgICBuZXh0KG5ldyBSZXNwb25zZSgyMDAscmVzdWx0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICBuZXh0KG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oZS5tZXNzYWdlLGUuc3RhY2spKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHVwZGF0ZUJ1ZGdldGVkQ29zdEZvckNvc3RIZWFkKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbGV0IHByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBwcm9qZWN0SWQgPSAgcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIGxldCBidWlsZGluZ0lkID0gIHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgICAgbGV0IGNvc3RIZWFkQnVkZ2V0ZWRBbW91bnQgPSAgcmVxLmJvZHk7XHJcblxyXG4gICAgICBwcm9qZWN0U2VydmljZS51cGRhdGVCdWRnZXRlZENvc3RGb3JDb3N0SGVhZCggYnVpbGRpbmdJZCwgY29zdEhlYWRCdWRnZXRlZEFtb3VudCwgdXNlciwoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLHJlc3VsdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB1cGRhdGVCdWRnZXRlZENvc3RGb3JQcm9qZWN0Q29zdEhlYWQocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHByb2plY3RJZCA9ICByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgICAgbGV0IGNvc3RIZWFkQnVkZ2V0ZWRBbW91bnQgPSAgcmVxLmJvZHk7XHJcblxyXG4gICAgICBwcm9qZWN0U2VydmljZS51cGRhdGVCdWRnZXRlZENvc3RGb3JQcm9qZWN0Q29zdEhlYWQoIHByb2plY3RJZCwgY29zdEhlYWRCdWRnZXRlZEFtb3VudCwgdXNlciwoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLHJlc3VsdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhZGRDb3N0SGVhZEJ1aWxkaW5nKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3QgY29udHJvbGxlciwgYWRkQ29zdEhlYWRCdWlsZGluZyBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IGJ1aWxkaW5nSWQgPSByZXEucGFyYW1zLmJ1aWxkaW5nSWQ7XHJcbiAgICAgIGxldCBjb3N0SGVhZERldGFpbHMgPSA8Q29zdEhlYWQ+IHJlcS5ib2R5O1xyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuICAgICAgbGV0IHF1ZXJ5ID0geyRwdXNoOiB7IGNvc3RIZWFkIDogY29zdEhlYWREZXRhaWxzfX07XHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLnVwZGF0ZUJ1aWxkaW5nQnlJZCggYnVpbGRpbmdJZCwgcXVlcnksIHVzZXIsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnQWRkIENvc3RIZWFkIEJ1aWxkaW5nIHN1Y2Nlc3MnKTtcclxuICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnQWRkZWQgQ29zdEhlYWQgZm9yIEJ1aWxkaW5nIElEIDogJytidWlsZGluZ0lkKTtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdXBkYXRlUXVhbnRpdHlPZkJ1aWxkaW5nQ29zdEhlYWRzKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3QgY29udHJvbGxlciwgdXBkYXRlUXVhbnRpdHkgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgICAgbGV0IGJ1aWxkaW5nSWQgPSByZXEucGFyYW1zLmJ1aWxkaW5nSWQ7XHJcbiAgICAgIGxldCBjb3N0SGVhZElkID0gcGFyc2VJbnQocmVxLnBhcmFtcy5jb3N0SGVhZElkKTtcclxuICAgICAgbGV0IGNhdGVnb3J5SWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNhdGVnb3J5SWQpO1xyXG4gICAgICBsZXQgd29ya0l0ZW1JZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMud29ya0l0ZW1JZCk7XHJcbiAgICAgIGxldCBxdWFudGl0eUl0ZW1zID0gcmVxLmJvZHkuaXRlbTtcclxuICAgICAgbGV0IHByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLnVwZGF0ZVF1YW50aXR5T2ZCdWlsZGluZ0Nvc3RIZWFkcyggcHJvamVjdElkLCBidWlsZGluZ0lkLCBjb3N0SGVhZElkLCBjYXRlZ29yeUlkLCB3b3JrSXRlbUlkLCBxdWFudGl0eUl0ZW1zLCB1c2VyLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbG9nZ2VyLmluZm8oJ1VwZGF0ZSBRdWFudGl0eSBzdWNjZXNzJyk7XHJcbiAgICAgICAgICBuZXh0KG5ldyBSZXNwb25zZSgyMDAscmVzdWx0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICBuZXh0KG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oZS5tZXNzYWdlLGUuc3RhY2spKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vVXBkYXRlIFF1YW50aXR5IE9mIFByb2plY3QgQ29zdCBIZWFkc1xyXG4gIHVwZGF0ZVF1YW50aXR5T2ZQcm9qZWN0Q29zdEhlYWRzKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3QgY29udHJvbGxlciwgVXBkYXRlIFF1YW50aXR5IE9mIFByb2plY3QgQ29zdCBIZWFkcyBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBsZXQgY29zdEhlYWRJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY29zdEhlYWRJZCk7XHJcbiAgICAgIGxldCBjYXRlZ29yeUlkID0gcGFyc2VJbnQocmVxLnBhcmFtcy5jYXRlZ29yeUlkKTtcclxuICAgICAgbGV0IHdvcmtJdGVtSWQgPSBwYXJzZUludChyZXEucGFyYW1zLndvcmtJdGVtSWQpO1xyXG4gICAgICBsZXQgcXVhbnRpdHlJdGVtcyA9IHJlcS5ib2R5Lml0ZW07XHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgICBwcm9qZWN0U2VydmljZS51cGRhdGVRdWFudGl0eU9mUHJvamVjdENvc3RIZWFkcyggcHJvamVjdElkLCBjb3N0SGVhZElkLCBjYXRlZ29yeUlkLCB3b3JrSXRlbUlkLCBxdWFudGl0eUl0ZW1zLCB1c2VyLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbG9nZ2VyLmluZm8oJ1VwZGF0ZSBRdWFudGl0eSBPZiBQcm9qZWN0IENvc3QgSGVhZHMgc3VjY2VzcycpO1xyXG4gICAgICAgICAgbmV4dChuZXcgUmVzcG9uc2UoMjAwLHJlc3VsdCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgLy9HZXQgSW4tQWN0aXZlIENhdGVnb3JpZXMgRnJvbSBEYXRhYmFzZVxyXG4gIGdldEluQWN0aXZlQ2F0ZWdvcmllc0J5Q29zdEhlYWRJZChyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxvZ2dlci5pbmZvKCdQcm9qZWN0IGNvbnRyb2xsZXIsIGdldENhdGVnb3J5QnlDb3N0SGVhZElkIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIGxldCBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgICBsZXQgY29zdEhlYWRJZCA9IHJlcS5wYXJhbXMuY29zdEhlYWRJZDtcclxuXHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG5cclxuICAgICAgcHJvamVjdFNlcnZpY2UuZ2V0SW5BY3RpdmVDYXRlZ29yaWVzQnlDb3N0SGVhZElkKHByb2plY3RJZCwgYnVpbGRpbmdJZCwgY29zdEhlYWRJZCwgdXNlciwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdHZXQgQ2F0ZWdvcnkgQnkgQ29zdEhlYWRJZCBzdWNjZXNzJyk7XHJcbiAgICAgICAgICBsb2dnZXIuZGVidWcoJ0dldCBDYXRlZ29yeSBCeSBDb3N0SGVhZElkIG9mIFByb2plY3QgSUQgOiAnK3Byb2plY3RJZCsnIEJ1aWxkaW5nIElEIDogJytidWlsZGluZ0lkKTtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0V29ya2l0ZW1MaXN0KHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ2dldFdvcmtpdGVtTGlzdCBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBsZXQgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgICAgbGV0IGNvc3RIZWFkSWQgPSByZXEucGFyYW1zLmNvc3RIZWFkSWQ7XHJcbiAgICAgIGxldCBjYXRlZ29yeUlkID0gcGFyc2VJbnQocmVxLnBhcmFtcy5jYXRlZ29yeUlkKTtcclxuICAgICAgbGV0IHByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLmdldFdvcmtpdGVtTGlzdChwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIGNvc3RIZWFkSWQsIGNhdGVnb3J5SWQsIHVzZXIsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBuZXh0KG5ldyBSZXNwb25zZSgyMDAscmVzdWx0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICBuZXh0KG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oZS5tZXNzYWdlLGUuc3RhY2spKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFkZFdvcmtpdGVtKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ2FkZFdvcmtpdGVtIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIGxldCBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgICBsZXQgY29zdEhlYWRJZCA6IG51bWJlciA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY29zdEhlYWRJZCk7XHJcbiAgICAgIGxldCBjYXRlZ29yeUlkIDogbnVtYmVyID0gcGFyc2VJbnQocmVxLnBhcmFtcy5jYXRlZ29yeUlkKTtcclxuICAgICAgbGV0IHdvcmtJdGVtOiBXb3JrSXRlbSA9IG5ldyBXb3JrSXRlbShyZXEuYm9keS5uYW1lLCByZXEuYm9keS5yYXRlQW5hbHlzaXNJZCk7XHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgICBwcm9qZWN0U2VydmljZS5hZGRXb3JraXRlbSggcHJvamVjdElkLCBidWlsZGluZ0lkLCBjb3N0SGVhZElkLCBjYXRlZ29yeUlkLCB3b3JrSXRlbSwgdXNlciwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZihlcnJvclxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYWRkQ2F0ZWdvcnlCeUNvc3RIZWFkSWQocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBjb250cm9sbGVyLCBhZGRDYXRlZ29yeUJ5Q29zdEhlYWRJZCBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBsZXQgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgICAgbGV0IGNvc3RIZWFkSWQgPSByZXEucGFyYW1zLmNvc3RIZWFkSWQ7XHJcbiAgICAgIGxldCBjYXRlZ29yeURldGFpbHMgPSByZXEuYm9keTtcclxuXHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG5cclxuICAgICAgcHJvamVjdFNlcnZpY2UuYWRkQ2F0ZWdvcnlCeUNvc3RIZWFkSWQocHJvamVjdElkLCBidWlsZGluZ0lkLCBjb3N0SGVhZElkLCBjYXRlZ29yeURldGFpbHMsIHVzZXIsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnR2V0IFF1YW50aXR5IHN1Y2Nlc3MnKTtcclxuICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnR2V0dGluZyBRdWFudGl0eSBvZiBQcm9qZWN0IElEIDogJytwcm9qZWN0SWQrJyBCdWlsZGluZyBJRCA6ICcrYnVpbGRpbmdJZCk7XHJcbiAgICAgICAgICBuZXh0KG5ldyBSZXNwb25zZSgyMDAscmVzdWx0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICBuZXh0KG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oZS5tZXNzYWdlLGUuc3RhY2spKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vR2V0IGFjdGl2ZSBjYXRlZ29yaWVzIGZyb20gZGF0YWJhc2VcclxuICBnZXRDYXRlZ29yaWVzT2ZCdWlsZGluZ0Nvc3RIZWFkKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3QgY29udHJvbGxlciwgR2V0IEFjdGl2ZSBDYXRlZ29yaWVzIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIGxldCBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgICBsZXQgY29zdEhlYWRJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY29zdEhlYWRJZCk7XHJcbiAgICAgIGxldCBwcm9qZWN0U2VydmljZSA9IG5ldyBQcm9qZWN0U2VydmljZSgpO1xyXG4gICAgICBwcm9qZWN0U2VydmljZS5nZXRDYXRlZ29yaWVzT2ZCdWlsZGluZ0Nvc3RIZWFkKHByb2plY3RJZCwgYnVpbGRpbmdJZCwgY29zdEhlYWRJZCwgdXNlciwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIG5leHQobmV3IFJlc3BvbnNlKDIwMCxyZXN1bHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQobmV3IENvc3RDb250cm9sbEV4Y2VwdGlvbihlLm1lc3NhZ2UsZS5zdGFjaykpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy9HZXQgY2F0ZWdvcmllcyBvZiBwcm9qZWN0Q29zdEhlYWRzIGZyb20gZGF0YWJhc2VcclxuICBnZXRDYXRlZ29yaWVzT2ZQcm9qZWN0Q29zdEhlYWQocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsb2dnZXIuaW5mbygnUHJvamVjdCBjb250cm9sbGVyLCBHZXQgUHJvamVjdCBDb3N0SGVhZCBDYXRlZ29yaWVzIGhhcyBiZWVuIGhpdCcpO1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIGxldCBjb3N0SGVhZElkID0gcGFyc2VJbnQocmVxLnBhcmFtcy5jb3N0SGVhZElkKTtcclxuICAgICAgbGV0IHByb2plY3RTZXJ2aWNlID0gbmV3IFByb2plY3RTZXJ2aWNlKCk7XHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLmdldENhdGVnb3JpZXNPZlByb2plY3RDb3N0SGVhZChwcm9qZWN0SWQsIGNvc3RIZWFkSWQsIHVzZXIsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBuZXh0KG5ldyBSZXNwb25zZSgyMDAscmVzdWx0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICBuZXh0KG5ldyBDb3N0Q29udHJvbGxFeGNlcHRpb24oZS5tZXNzYWdlLGUuc3RhY2spKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vVXBkYXRlIHN0YXR1cyAoIHRydWUvZmFsc2UgKSBvZiBjYXRlZ29yeVxyXG4gIHVwZGF0ZUNhdGVnb3J5U3RhdHVzKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3QgY29udHJvbGxlciwgdXBkYXRlIENhdGVnb3J5IFN0YXR1cyBoYXMgYmVlbiBoaXQnKTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBsZXQgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgICAgbGV0IGNvc3RIZWFkSWQgPSBwYXJzZUZsb2F0KHJlcS5wYXJhbXMuY29zdEhlYWRJZCk7XHJcbiAgICAgIGxldCBjYXRlZ29yeUlkID1wYXJzZUZsb2F0KHJlcS5wYXJhbXMuY2F0ZWdvcnlJZCk7XHJcbiAgICAgIGxldCBjYXRlZ29yeUFjdGl2ZVN0YXR1cyA9IHJlcS5wYXJhbXMuYWN0aXZlU3RhdHVzID09PSAndHJ1ZScgPyB0cnVlIDogZmFsc2U7XHJcblxyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuXHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLnVwZGF0ZUNhdGVnb3J5U3RhdHVzKCBwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIGNvc3RIZWFkSWQsIGNhdGVnb3J5SWQsIGNhdGVnb3J5QWN0aXZlU3RhdHVzLFxyXG4gICAgICAgIHVzZXIsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxvZ2dlci5pbmZvKCdVcGRhdGUgQ2F0ZWdvcnkgU3RhdHVzIHN1Y2Nlc3MnKTtcclxuICAgICAgICAgICAgbG9nZ2VyLmRlYnVnKCdVcGRhdGUgQ2F0ZWdvcnkgU3RhdHVzIHN1Y2Nlc3Mgb2YgUHJvamVjdCBJRCA6ICcrcHJvamVjdElkKycgQnVpbGRpbmcgSUQgOiAnK2J1aWxkaW5nSWQpO1xyXG4gICAgICAgICAgICBuZXh0KG5ldyBSZXNwb25zZSgyMDAscmVzdWx0KSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzeW5jUHJvamVjdFdpdGhSYXRlQW5hbHlzaXNEYXRhKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbG9nZ2VyLmluZm8oJ1Byb2plY3QgY29udHJvbGxlciwgc3luY0J1aWxkaW5nV2l0aFJhdGVBbmFseXNpc0RhdGEgaGFzIGJlZW4gaGl0Jyk7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgICAgbGV0IGJ1aWxkaW5nSWQgPSByZXEucGFyYW1zLmJ1aWxkaW5nSWQ7XHJcblxyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgUHJvamVjdFNlcnZpY2UoKTtcclxuXHJcbiAgICAgIHByb2plY3RTZXJ2aWNlLnN5bmNQcm9qZWN0V2l0aFJhdGVBbmFseXNpc0RhdGEoIHByb2plY3RJZCwgYnVpbGRpbmdJZCwgdXNlciwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgbG9nZ2VyLmVycm9yKCdzeW5jUHJvamVjdFdpdGhSYXRlQW5hbHlzaXNEYXRhIGZhaWx1cmUnKTtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnc3luY1Byb2plY3RXaXRoUmF0ZUFuYWx5c2lzRGF0YSBzdWNjZXNzJyk7XHJcbiAgICAgICAgICBsb2dnZXIuZGVidWcoJ0dldHRpbmcgc3luY1Byb2plY3RXaXRoUmF0ZUFuYWx5c2lzRGF0YSBvZiBQcm9qZWN0IElEIDogJytwcm9qZWN0SWQrJyBCdWlsZGluZyBJRCA6ICcrYnVpbGRpbmdJZCk7XHJcbiAgICAgICAgICBuZXh0KG5ldyBSZXNwb25zZSgyMDAscmVzdWx0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgbmV4dChuZXcgQ29zdENvbnRyb2xsRXhjZXB0aW9uKGUubWVzc2FnZSxlLnN0YWNrKSk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbmV4cG9ydCAgPSBQcm9qZWN0Q29udHJvbGxlcjtcclxuIl19
