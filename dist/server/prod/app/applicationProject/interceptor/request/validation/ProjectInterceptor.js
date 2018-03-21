"use strict";
var Messages = require("../../../shared/messages");
var ProjectInterceptor = (function () {
    function ProjectInterceptor() {
    }
    ProjectInterceptor.validateProjectId = function (projectId, callback) {
        if ((projectId === undefined) || (projectId === '')) {
            callback(null, false);
        }
        else
            callback(null, true);
    };
    ProjectInterceptor.validateIds = function (projectId, buildingId, callback) {
        if ((projectId === undefined || buildingId === undefined) || (projectId === '' || buildingId === '')) {
            callback(null, false);
        }
        else
            callback(null, true);
    };
    ProjectInterceptor.validateCostHeadIds = function (projectId, buildingId, costHeadId, callback) {
        if ((projectId === undefined || buildingId === undefined || costHeadId === undefined) || (projectId === '' || buildingId === '' || costHeadId === '')) {
            callback(null, false);
        }
        else
            callback(null, true);
    };
    ProjectInterceptor.validateProjectCostHeadIds = function (projectId, costHeadId, callback) {
        if ((projectId === undefined || costHeadId === undefined) || (projectId === '' || costHeadId === null)) {
            callback(null, false);
        }
        else
            callback(null, true);
    };
    ProjectInterceptor.validateIdsForUpdateRate = function (projectId, buildingId, costHeadId, categoryId, workItemId, callback) {
        if ((projectId === undefined || buildingId === undefined || costHeadId === undefined || categoryId === undefined ||
            workItemId === undefined) || (projectId === '' || buildingId === '' || costHeadId === null || categoryId === null ||
            workItemId === null)) {
            callback(null, false);
        }
        else
            callback(null, true);
    };
    ProjectInterceptor.validateCategoryIds = function (projectId, buildingId, costHeadId, categoryId, activeStatus, callback) {
        if ((projectId === undefined || buildingId === undefined || costHeadId === undefined || categoryId === undefined ||
            activeStatus === undefined) || (projectId === '' || buildingId === '' || costHeadId === null || categoryId === null
            || activeStatus === null)) {
            callback(null, false);
        }
        else
            callback(null, true);
    };
    ProjectInterceptor.prototype.createProject = function (req, res, next) {
        if ((req.body.name === undefined) || (req.body.region === undefined) || (req.body.plotArea === undefined) || (req.body.plotPeriphery === undefined) ||
            (req.body.podiumArea === undefined) || (req.body.openSpace === undefined) || (req.body.slabArea === undefined) || (req.body.poolCapacity === undefined) ||
            (req.body.projectDuration === undefined) || (req.body.totalNumOfBuildings === undefined) ||
            (req.body.name === '') || (req.body.region === '') || (req.body.plotArea === '') ||
            (req.body.plotPeriphery === '') || (req.body.podiumArea === '') || (req.body.openSpace === '') ||
            (req.body.slabArea === '') || (req.body.poolCapacity === '') || (req.body.projectDuration === '') ||
            (req.body.totalNumOfBuildings === '')) {
            next({
                reason: Messages.MSG_ERROR_EMPTY_FIELD,
                message: Messages.MSG_ERROR_EMPTY_FIELD,
                stackTrace: new Error(),
                code: 400
            });
        }
        next();
    };
    ProjectInterceptor.prototype.getProjectById = function (req, res, next) {
        var projectId = req.params.projectId;
        ProjectInterceptor.validateProjectId(projectId, function (error, result) {
            if (error) {
                next(error);
            }
            else {
                if (result === false) {
                    next({
                        reason: Messages.MSG_ERROR_EMPTY_FIELD,
                        message: Messages.MSG_ERROR_EMPTY_FIELD,
                        stackTrace: new Error(),
                        code: 400
                    });
                }
                next();
            }
        });
    };
    ProjectInterceptor.prototype.updateProjectById = function (req, res, next) {
        var projectId = req.params.projectId;
        ProjectInterceptor.validateProjectId(projectId, function (error, result) {
            if (error) {
                next(error);
            }
            else {
                if (result === false) {
                    next({
                        reason: Messages.MSG_ERROR_EMPTY_FIELD,
                        message: Messages.MSG_ERROR_EMPTY_FIELD,
                        stackTrace: new Error(),
                        code: 400
                    });
                }
                else {
                    if ((req.body.name === undefined) || (req.body.region === undefined) || (req.body.plotArea === undefined) ||
                        (req.body.plotPeriphery === undefined) || (req.body.podiumArea === undefined) || (req.body.openSpace === undefined) ||
                        (req.body.slabArea === undefined) || (req.body.poolCapacity === undefined) || (req.body.projectDuration === undefined) ||
                        (req.body.totalNumOfBuildings === undefined) || (req.body.name === '') || (req.body.region === '') || (req.body.plotArea === '') ||
                        (req.body.plotPeriphery === '') || (req.body.podiumArea === '') || (req.body.openSpace === '') ||
                        (req.body.slabArea === '') || (req.body.poolCapacity === undefined) || (req.body.projectDuration === '') || (req.body.totalNumOfBuildings === '')) {
                        next({
                            reason: Messages.MSG_ERROR_EMPTY_FIELD,
                            message: Messages.MSG_ERROR_EMPTY_FIELD,
                            stackTrace: new Error(),
                            code: 400
                        });
                    }
                }
                next();
            }
        });
    };
    ProjectInterceptor.prototype.createBuilding = function (req, res, next) {
        var projectId = req.params.projectId;
        ProjectInterceptor.validateProjectId(projectId, function (error, result) {
            if (error) {
                next(error);
            }
            else {
                if (result === false) {
                    next({
                        reason: Messages.MSG_ERROR_EMPTY_FIELD,
                        message: Messages.MSG_ERROR_EMPTY_FIELD,
                        stackTrace: new Error(),
                        code: 400
                    });
                }
                else {
                    if ((req.body.name === undefined) || (req.body.totalSlabArea === undefined) || (req.body.totalCarpetAreaOfUnit === undefined) ||
                        (req.body.totalSaleableAreaOfUnit === undefined) || (req.body.plinthArea === undefined) || (req.body.totalNumOfFloors === undefined) ||
                        (req.body.numOfParkingFloors === undefined) || (req.body.carpetAreaOfParking === undefined) || (req.body.name === '') ||
                        (req.body.totalSlabArea === '') || (req.body.totalCarpetAreaOfUnit === '') || (req.body.totalSaleableAreaOfUnit === '') ||
                        (req.body.plinthArea === '') || (req.body.totalNumOfFloors === '') || (req.body.numOfParkingFloors === '') || (req.body.carpetAreaOfParking === '')) {
                        next({
                            reason: Messages.MSG_ERROR_EMPTY_FIELD,
                            message: Messages.MSG_ERROR_EMPTY_FIELD,
                            stackTrace: new Error(),
                            code: 400
                        });
                    }
                }
                next();
            }
        });
    };
    ProjectInterceptor.prototype.getBuildingById = function (req, res, next) {
        var projectId = req.params.projectId;
        var buildingId = req.params.buildingId;
        ProjectInterceptor.validateIds(projectId, buildingId, function (error, result) {
            if (error) {
                next(error);
            }
            else {
                if (result === false) {
                    next({
                        reason: Messages.MSG_ERROR_EMPTY_FIELD,
                        message: Messages.MSG_ERROR_EMPTY_FIELD,
                        stackTrace: new Error(),
                        code: 400
                    });
                }
                next();
            }
        });
    };
    ProjectInterceptor.prototype.updateBuildingById = function (req, res, next) {
        var projectId = req.params.projectId;
        var buildingId = req.params.buildingId;
        ProjectInterceptor.validateIds(projectId, buildingId, function (error, result) {
            if (error) {
                next(error);
            }
            else {
                if (result === false) {
                    next({
                        reason: Messages.MSG_ERROR_EMPTY_FIELD,
                        message: Messages.MSG_ERROR_EMPTY_FIELD,
                        stackTrace: new Error(),
                        code: 400
                    });
                }
                else {
                    if ((req.body.name === undefined) || (req.body.totalSlabArea === undefined) || (req.body.totalCarpetAreaOfUnit === undefined) || (req.body.totalSaleableAreaOfUnit === undefined) ||
                        (req.body.plinthArea === undefined) || (req.body.totalNumOfFloors === undefined) || (req.body.numOfParkingFloors === undefined) || (req.body.carpetAreaOfParking === undefined) ||
                        (req.body.name === '') || (req.body.totalSlabArea === '') || (req.body.totalCarpetAreaOfUnit === '') || (req.body.totalSaleableAreaOfUnit === '') ||
                        (req.body.plinthArea === '') || (req.body.totalNumOfFloors === '') || (req.body.numOfParkingFloors === '') || (req.body.carpetAreaOfParking === '')) {
                        next({
                            reason: Messages.MSG_ERROR_EMPTY_FIELD,
                            message: Messages.MSG_ERROR_EMPTY_FIELD,
                            stackTrace: new Error(),
                            code: 400
                        });
                    }
                }
                next();
            }
        });
    };
    ProjectInterceptor.prototype.deleteBuildingById = function (req, res, next) {
        var projectId = req.params.projectId;
        var buildingId = req.params.buildingId;
        ProjectInterceptor.validateIds(projectId, buildingId, function (error, result) {
            if (error) {
                next(error);
            }
            else {
                if (result === false) {
                    next({
                        reason: Messages.MSG_ERROR_EMPTY_FIELD,
                        message: Messages.MSG_ERROR_EMPTY_FIELD,
                        stackTrace: new Error(),
                        code: 400
                    });
                }
                next();
            }
        });
    };
    ProjectInterceptor.prototype.getBuildingByIdForClone = function (req, res, next) {
        var projectId = req.params.projectId;
        var buildingId = req.params.buildingId;
        ProjectInterceptor.validateIds(projectId, buildingId, function (error, result) {
            if (error) {
                next(error);
            }
            else {
                if (result === false) {
                    next({
                        reason: Messages.MSG_ERROR_EMPTY_FIELD,
                        message: Messages.MSG_ERROR_EMPTY_FIELD,
                        stackTrace: new Error(),
                        code: 400
                    });
                }
                next();
            }
        });
    };
    ProjectInterceptor.prototype.getCategoriesOfProjectCostHead = function (req, res, next) {
        var projectId = req.params.projectId;
        var costHeadId = req.params.costHeadId;
        ProjectInterceptor.validateProjectCostHeadIds(projectId, costHeadId, function (error, result) {
            if (error) {
                next(error);
            }
            else {
                if (result === false) {
                    next({
                        reason: Messages.MSG_ERROR_EMPTY_FIELD,
                        message: Messages.MSG_ERROR_EMPTY_FIELD,
                        stackTrace: new Error(),
                        code: 400
                    });
                }
                next();
            }
        });
    };
    ProjectInterceptor.prototype.setCostHeadStatus = function (req, res, next) {
        var projectId = req.params.projectId;
        var buildingId = req.params.buildingId;
        var costHeadId = req.params.costHeadId;
        ProjectInterceptor.validateCostHeadIds(projectId, buildingId, costHeadId, function (error, result) {
            if (error) {
                next(error);
            }
            else {
                if (result === false) {
                    next({
                        reason: Messages.MSG_ERROR_EMPTY_FIELD,
                        message: Messages.MSG_ERROR_EMPTY_FIELD,
                        stackTrace: new Error(),
                        code: 400
                    });
                }
                else {
                    if ((req.params.activeStatus === undefined) || (req.params.activeStatus === '')) {
                        next({
                            reason: Messages.MSG_ERROR_EMPTY_FIELD,
                            message: Messages.MSG_ERROR_EMPTY_FIELD,
                            stackTrace: new Error(),
                            code: 400
                        });
                    }
                }
                next();
            }
        });
    };
    ProjectInterceptor.prototype.getInActiveCostHead = function (req, res, next) {
        var projectId = req.params.projectId;
        var buildingId = req.params.buildingId;
        ProjectInterceptor.validateIds(projectId, buildingId, function (error, result) {
            if (error) {
                next(error);
            }
            else {
                if (result === false) {
                    next({
                        reason: Messages.MSG_ERROR_EMPTY_FIELD,
                        message: Messages.MSG_ERROR_EMPTY_FIELD,
                        stackTrace: new Error(),
                        code: 400
                    });
                }
                next();
            }
        });
    };
    ProjectInterceptor.prototype.updateBudgetedCostForBuildingCostHead = function (req, res, next) {
        var projectId = req.params.projectId;
        var buildingId = req.params.buildingId;
        ProjectInterceptor.validateIds(projectId, buildingId, function (error, result) {
            if (error) {
                next(error);
            }
            else {
                if (result === false) {
                    next({
                        reason: Messages.MSG_ERROR_EMPTY_FIELD,
                        message: Messages.MSG_ERROR_EMPTY_FIELD,
                        stackTrace: new Error(),
                        code: 400
                    });
                }
                else {
                    if ((req.body.budgetedCostAmount === undefined) || (req.body.costHead === undefined) ||
                        (req.body.budgetedCostAmount === '') || (req.body.costHead === '')) {
                        next({
                            reason: Messages.MSG_ERROR_EMPTY_FIELD,
                            message: Messages.MSG_ERROR_EMPTY_FIELD,
                            stackTrace: new Error(),
                            code: 400
                        });
                    }
                }
                next();
            }
        });
    };
    ProjectInterceptor.prototype.updateBudgetedCostForProjectCostHead = function (req, res, next) {
        var projectId = req.params.projectId;
        if ((projectId === undefined) || (projectId === '') || (req.body.budgetedCostAmount === undefined) ||
            (req.body.costHead === undefined) || (req.body.budgetedCostAmount === '') || (req.body.costHead === '')) {
            next({
                reason: Messages.MSG_ERROR_EMPTY_FIELD,
                message: Messages.MSG_ERROR_EMPTY_FIELD,
                stackTrace: new Error(),
                code: 400
            });
        }
        else {
            next();
        }
    };
    ProjectInterceptor.prototype.getCategoriesOfBuildingCostHead = function (req, res, next) {
        var projectId = req.params.projectId;
        var buildingId = req.params.buildingId;
        var costHeadId = req.params.costHeadId;
        ProjectInterceptor.validateCostHeadIds(projectId, buildingId, costHeadId, function (error, result) {
            if (error) {
                next(error);
            }
            else {
                if (result === false) {
                    next({
                        reason: Messages.MSG_ERROR_EMPTY_FIELD,
                        message: Messages.MSG_ERROR_EMPTY_FIELD,
                        stackTrace: new Error(),
                        code: 400
                    });
                }
                next();
            }
        });
    };
    ProjectInterceptor.prototype.getInActiveCategoriesByCostHeadId = function (req, res, next) {
        var projectId = req.params.projectId;
        var buildingId = req.params.buildingId;
        var costHeadId = req.params.costHeadId;
        ProjectInterceptor.validateCostHeadIds(projectId, buildingId, costHeadId, function (error, result) {
            if (error) {
                next(error);
            }
            else {
                if (result === false) {
                    next({
                        reason: Messages.MSG_ERROR_EMPTY_FIELD,
                        message: Messages.MSG_ERROR_EMPTY_FIELD,
                        stackTrace: new Error(),
                        code: 400
                    });
                }
                next();
            }
        });
    };
    ProjectInterceptor.prototype.getAllCategoriesByCostHeadId = function (req, res, next) {
        var projectId = req.params.projectId;
        var buildingId = req.params.buildingId;
        var costHeadId = req.params.costHeadId;
        ProjectInterceptor.validateCostHeadIds(projectId, buildingId, costHeadId, function (error, result) {
            if (error) {
                next(error);
            }
            else {
                if (result === false) {
                    next({
                        reason: Messages.MSG_ERROR_EMPTY_FIELD,
                        message: Messages.MSG_ERROR_EMPTY_FIELD,
                        stackTrace: new Error(),
                        code: 400
                    });
                }
                next();
            }
        });
    };
    ProjectInterceptor.prototype.updateCategoryStatus = function (req, res, next) {
        var projectId = req.params.projectId;
        var buildingId = req.params.buildingId;
        var costHeadId = req.params.costHeadId;
        var categoryId = req.params.categoryId;
        var activeStatus = req.params.activeStatus;
        ProjectInterceptor.validateCategoryIds(projectId, buildingId, costHeadId, categoryId, activeStatus, function (error, result) {
            if (error) {
                next(error);
            }
            else {
                if (result === false) {
                    next({
                        reason: Messages.MSG_ERROR_EMPTY_FIELD,
                        message: Messages.MSG_ERROR_EMPTY_FIELD,
                        stackTrace: new Error(),
                        code: 400
                    });
                }
                next();
            }
        });
    };
    ProjectInterceptor.prototype.addCategoryByCostHeadId = function (req, res, next) {
        var projectId = req.params.projectId;
        var buildingId = req.params.buildingId;
        var costHeadId = req.params.costHeadId;
        ProjectInterceptor.validateCostHeadIds(projectId, buildingId, costHeadId, function (error, result) {
            if (error) {
                next(error);
            }
            else {
                if (result === false) {
                    next({
                        reason: Messages.MSG_ERROR_EMPTY_FIELD,
                        message: Messages.MSG_ERROR_EMPTY_FIELD,
                        stackTrace: new Error(),
                        code: 400
                    });
                }
                else {
                    if ((req.body.category === undefined) || (req.body.categoryId === undefined) ||
                        (req.body.category === '') || (req.body.categoryId === '')) {
                        next({
                            reason: Messages.MSG_ERROR_EMPTY_FIELD,
                            message: Messages.MSG_ERROR_EMPTY_FIELD,
                            stackTrace: new Error(),
                            code: 400
                        });
                    }
                }
                next();
            }
        });
    };
    ProjectInterceptor.prototype.deleteCategoryFromCostHead = function (req, res, next) {
        var projectId = req.params.projectId;
        var buildingId = req.params.buildingId;
        var costHeadId = req.params.costHeadId;
        ProjectInterceptor.validateCostHeadIds(projectId, buildingId, costHeadId, function (error, result) {
            if (error) {
                next(error);
            }
            else {
                if (result === false) {
                    next({
                        reason: Messages.MSG_ERROR_EMPTY_FIELD,
                        message: Messages.MSG_ERROR_EMPTY_FIELD,
                        stackTrace: new Error(),
                        code: 400
                    });
                }
                else {
                    if ((req.body.name === undefined) || (req.body.rateAnalysisId === undefined) ||
                        (req.body.name === '') || (req.body.rateAnalysisId === '')) {
                        next({
                            reason: Messages.MSG_ERROR_EMPTY_FIELD,
                            message: Messages.MSG_ERROR_EMPTY_FIELD,
                            stackTrace: new Error(),
                            code: 400
                        });
                    }
                }
                next();
            }
        });
    };
    ProjectInterceptor.prototype.updateWorkItemStatusOfBuildingCostHeads = function (req, res, next) {
        var projectId = req.params.projectId;
        var buildingId = req.params.buildingId;
        var costHeadId = req.params.costHeadId;
        ProjectInterceptor.validateCostHeadIds(projectId, buildingId, costHeadId, function (error, result) {
            if (error) {
                next(error);
            }
            else {
                if (result === false) {
                    next({
                        reason: Messages.MSG_ERROR_EMPTY_FIELD,
                        message: Messages.MSG_ERROR_EMPTY_FIELD,
                        stackTrace: new Error(),
                        code: 400
                    });
                }
                else {
                    if ((req.params.workItemId === undefined) || (req.params.workItemId === '') ||
                        (req.params.activeStatus === undefined) || (req.params.activeStatus === '')) {
                        next({
                            reason: Messages.MSG_ERROR_EMPTY_FIELD,
                            message: Messages.MSG_ERROR_EMPTY_FIELD,
                            stackTrace: new Error(),
                            code: 400
                        });
                    }
                }
                next();
            }
        });
    };
    ProjectInterceptor.prototype.updateWorkItemStatusOfProjectCostHeads = function (req, res, next) {
        var projectId = req.params.projectId;
        var costHeadId = parseInt(req.params.costHeadId);
        var categoryId = parseInt(req.params.category);
        var workItemId = parseInt(req.params.costHeadId);
        ProjectInterceptor.validateProjectCostHeadIds(projectId, costHeadId, function (error, result) {
            if (error) {
                next(error);
            }
            else {
                if (result === false) {
                    next({
                        reason: Messages.MSG_ERROR_EMPTY_FIELD,
                        message: Messages.MSG_ERROR_EMPTY_FIELD,
                        stackTrace: new Error(),
                        code: 400
                    });
                }
                else {
                    if ((categoryId === undefined) || (categoryId === null) ||
                        (workItemId === undefined) || (workItemId === null) ||
                        (req.params.activeStatus === undefined) || (req.params.activeStatus === '')) {
                        next({
                            reason: Messages.MSG_ERROR_EMPTY_FIELD,
                            message: Messages.MSG_ERROR_EMPTY_FIELD,
                            stackTrace: new Error(),
                            code: 400
                        });
                    }
                }
                next();
            }
        });
    };
    ProjectInterceptor.prototype.getInActiveWorkItemsOfBuildingCostHeads = function (req, res, next) {
        var projectId = req.params.projectId;
        var buildingId = req.params.buildingId;
        var costHeadId = req.params.costHeadId;
        ProjectInterceptor.validateCostHeadIds(projectId, buildingId, costHeadId, function (error, result) {
            if (error) {
                next(error);
            }
            else {
                if (result === false) {
                    next({
                        reason: Messages.MSG_ERROR_EMPTY_FIELD,
                        message: Messages.MSG_ERROR_EMPTY_FIELD,
                        stackTrace: new Error(),
                        code: 400
                    });
                }
                else {
                    if ((req.params.categoryId === undefined) || (req.params.categoryId === '')) {
                        next({
                            reason: Messages.MSG_ERROR_EMPTY_FIELD,
                            message: Messages.MSG_ERROR_EMPTY_FIELD,
                            stackTrace: new Error(),
                            code: 400
                        });
                    }
                }
                next();
            }
        });
    };
    ProjectInterceptor.prototype.getInActiveWorkItemsOfProjectCostHeads = function (req, res, next) {
        var projectId = req.params.projectId;
        var costHeadId = parseInt(req.params.costHeadId);
        var categoryId = parseInt(req.params.categoryId);
        ProjectInterceptor.validateProjectCostHeadIds(projectId, costHeadId, function (error, result) {
            if (error) {
                next(error);
            }
            else {
                if (result === false) {
                    next({
                        reason: Messages.MSG_ERROR_EMPTY_FIELD,
                        message: Messages.MSG_ERROR_EMPTY_FIELD,
                        stackTrace: new Error(),
                        code: 400
                    });
                }
                else {
                    if ((categoryId === undefined) || (categoryId === null)) {
                        next({
                            reason: Messages.MSG_ERROR_EMPTY_FIELD,
                            message: Messages.MSG_ERROR_EMPTY_FIELD,
                            stackTrace: new Error(),
                            code: 400
                        });
                    }
                }
                next();
            }
        });
    };
    ProjectInterceptor.prototype.getRate = function (req, res, next) {
        var projectId = req.params.projectId;
        var buildingId = req.params.buildingId;
        var costHeadId = req.params.costHeadId;
        ProjectInterceptor.validateCostHeadIds(projectId, buildingId, costHeadId, function (error, result) {
            if (error) {
                next(error);
            }
            else {
                if (result === false) {
                    next({
                        reason: Messages.MSG_ERROR_EMPTY_FIELD,
                        message: Messages.MSG_ERROR_EMPTY_FIELD,
                        stackTrace: new Error(),
                        code: 400
                    });
                }
                else {
                    if ((req.params.categoryId === undefined) || (req.params.workItemId === undefined) ||
                        (req.params.categoryId === '') || (req.params.workItemId === '')) {
                        next({
                            reason: Messages.MSG_ERROR_EMPTY_FIELD,
                            message: Messages.MSG_ERROR_EMPTY_FIELD,
                            stackTrace: new Error(),
                            code: 400
                        });
                    }
                }
                next();
            }
        });
    };
    ProjectInterceptor.prototype.updateQuantityOfBuildingCostHeads = function (req, res, next) {
        var projectId = req.params.projectId;
        var buildingId = req.params.buildingId;
        var costHeadId = req.params.costHeadId;
        ProjectInterceptor.validateCostHeadIds(projectId, buildingId, costHeadId, function (error, result) {
            if (error) {
                next(error);
            }
            else {
                if (result === false) {
                    next({
                        reason: Messages.MSG_ERROR_EMPTY_FIELD,
                        message: Messages.MSG_ERROR_EMPTY_FIELD,
                        stackTrace: new Error(),
                        code: 400
                    });
                }
                else {
                    if ((req.params.categoryId === undefined) || (req.params.workItemId === undefined) || (req.body.item === undefined) ||
                        (req.params.categoryId === '') || (req.params.workItemId === '') || (req.body.item === '')) {
                        next({
                            reason: Messages.MSG_ERROR_EMPTY_FIELD,
                            message: Messages.MSG_ERROR_EMPTY_FIELD,
                            stackTrace: new Error(),
                            code: 400
                        });
                    }
                }
                next();
            }
        });
    };
    ProjectInterceptor.prototype.updateQuantityOfProjectCostHeads = function (req, res, next) {
        var projectId = req.params.projectId;
        var costHeadId = parseInt(req.params.costHeadId);
        var categoryId = parseInt(req.params.categoryId);
        var workItemId = parseInt(req.params.workItemId);
        ProjectInterceptor.validateProjectCostHeadIds(projectId, costHeadId, function (error, result) {
            if (error) {
                next(error);
            }
            else {
                if (result === false) {
                    next({
                        reason: Messages.MSG_ERROR_EMPTY_FIELD,
                        message: Messages.MSG_ERROR_EMPTY_FIELD,
                        stackTrace: new Error(),
                        code: 400
                    });
                }
                else {
                    if ((categoryId === undefined) || (workItemId === undefined) || (req.body.item === undefined) ||
                        (categoryId === null) || (workItemId === null) || (req.body.item === '')) {
                        next({
                            reason: Messages.MSG_ERROR_EMPTY_FIELD,
                            message: Messages.MSG_ERROR_EMPTY_FIELD,
                            stackTrace: new Error(),
                            code: 400
                        });
                    }
                }
                next();
            }
        });
    };
    ProjectInterceptor.prototype.deleteQuantityOfBuildingCostHeadsByName = function (req, res, next) {
        var projectId = req.params.projectId;
        var buildingId = req.params.buildingId;
        var costHeadId = req.params.costHeadId;
        ProjectInterceptor.validateCostHeadIds(projectId, buildingId, costHeadId, function (error, result) {
            if (error) {
                next(error);
            }
            else {
                if (result === false) {
                    next({
                        reason: Messages.MSG_ERROR_EMPTY_FIELD,
                        message: Messages.MSG_ERROR_EMPTY_FIELD,
                        stackTrace: new Error(),
                        code: 400
                    });
                }
                else {
                    if ((req.params.categoryId === undefined) || (req.params.workItemId === undefined) || (req.body.item === undefined) ||
                        (req.params.categoryId === '') || (req.params.workItemId === '') || (req.body.item === '')) {
                        next({
                            reason: Messages.MSG_ERROR_EMPTY_FIELD,
                            message: Messages.MSG_ERROR_EMPTY_FIELD,
                            stackTrace: new Error(),
                            code: 400
                        });
                    }
                }
                next();
            }
        });
    };
    ProjectInterceptor.prototype.deleteQuantityOfProjectCostHeadsByName = function (req, res, next) {
        var projectId = req.params.projectId;
        var costHeadId = parseInt(req.params.costHeadId);
        var categoryId = parseInt(req.params.costHeadId);
        var workItemId = parseInt(req.params.costHeadId);
        ProjectInterceptor.validateProjectCostHeadIds(projectId, costHeadId, function (error, result) {
            if (error) {
                next(error);
            }
            else {
                if (result === false) {
                    next({
                        reason: Messages.MSG_ERROR_EMPTY_FIELD,
                        message: Messages.MSG_ERROR_EMPTY_FIELD,
                        stackTrace: new Error(),
                        code: 400
                    });
                }
                else {
                    if ((categoryId === undefined) || (workItemId === undefined) || (req.body.item === undefined) ||
                        (categoryId === null) || (workItemId === null) || (req.body.item === '')) {
                        next({
                            reason: Messages.MSG_ERROR_EMPTY_FIELD,
                            message: Messages.MSG_ERROR_EMPTY_FIELD,
                            stackTrace: new Error(),
                            code: 400
                        });
                    }
                }
                next();
            }
        });
    };
    ProjectInterceptor.prototype.updateRateOfBuildingCostHeads = function (req, res, next) {
        var projectId = req.params.projectId;
        var buildingId = req.params.buildingId;
        var costHeadId = parseInt(req.params.costHeadId);
        var categoryId = parseInt(req.params.categoryId);
        var workItemId = parseInt(req.params.workItemId);
        ProjectInterceptor.validateIdsForUpdateRate(projectId, buildingId, costHeadId, categoryId, workItemId, function (error, result) {
            if (error) {
                next(error);
            }
            else {
                if (result === false) {
                    next({
                        reason: Messages.MSG_ERROR_EMPTY_FIELD,
                        message: Messages.MSG_ERROR_EMPTY_FIELD,
                        stackTrace: new Error(),
                        code: 400
                    });
                }
                else {
                    if ((req.params.categoryId === undefined) || (req.params.workItemId === undefined) || (req.body.quantity === undefined) ||
                        (req.body.rateItems === undefined) || (req.body.total === undefined) || (req.body.unit === undefined) ||
                        (req.params.categoryId === '') || (req.params.workItemId === '') || (req.body.quantity === '') ||
                        (req.body.rateItems === '') || (req.body.total === '') || (req.body.unit === '')) {
                        next({
                            reason: Messages.MSG_ERROR_EMPTY_FIELD,
                            message: Messages.MSG_ERROR_EMPTY_FIELD,
                            stackTrace: new Error(),
                            code: 400
                        });
                    }
                }
                next();
            }
        });
    };
    ProjectInterceptor.prototype.updateRateOfProjectCostHeads = function (req, res, next) {
        var projectId = req.params.projectId;
        var costHeadId = parseInt(req.params.costHeadId);
        var categoryId = parseInt(req.params.categoryId);
        var workItemId = parseInt(req.params.workItemId);
        ProjectInterceptor.validateProjectCostHeadIds(projectId, costHeadId, function (error, result) {
            if (error) {
                next(error);
            }
            else {
                if (result === false) {
                    next({
                        reason: Messages.MSG_ERROR_EMPTY_FIELD,
                        message: Messages.MSG_ERROR_EMPTY_FIELD,
                        stackTrace: new Error(),
                        code: 400
                    });
                }
                else {
                    if ((categoryId === undefined) || (workItemId === undefined) || (req.body.quantity === undefined) ||
                        (req.body.rateItems === undefined) || (req.body.total === undefined) || (req.body.unit === undefined) ||
                        (categoryId === null) || (workItemId === null) || (req.body.quantity === '') ||
                        (req.body.rateItems === '') || (req.body.total === '') || (req.body.unit === '')) {
                        next({
                            reason: Messages.MSG_ERROR_EMPTY_FIELD,
                            message: Messages.MSG_ERROR_EMPTY_FIELD,
                            stackTrace: new Error(),
                            code: 400
                        });
                    }
                }
                next();
            }
        });
    };
    ProjectInterceptor.prototype.syncProjectWithRateAnalysisData = function (req, res, next) {
        var projectId = req.params.projectId;
        var buildingId = req.params.buildingId;
        ProjectInterceptor.validateIds(projectId, buildingId, function (error, result) {
            if (error) {
                next(error);
            }
            else {
                if (result === false) {
                    next({
                        reason: Messages.MSG_ERROR_EMPTY_FIELD,
                        message: Messages.MSG_ERROR_EMPTY_FIELD,
                        stackTrace: new Error(),
                        code: 400
                    });
                }
                next();
            }
        });
    };
    return ProjectInterceptor;
}());
module.exports = ProjectInterceptor;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHBsaWNhdGlvblByb2plY3QvaW50ZXJjZXB0b3IvcmVxdWVzdC92YWxpZGF0aW9uL1Byb2plY3RJbnRlcmNlcHRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsbURBQW9EO0FBR3BEO0lBNENFO0lBQ0EsQ0FBQztJQTVDYSxvQ0FBaUIsR0FBL0IsVUFBZ0MsU0FBaUIsRUFBRyxRQUEyQztRQUM3RixFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsS0FBSyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEQsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN4QixDQUFDO1FBQUMsSUFBSTtZQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVhLDhCQUFXLEdBQXpCLFVBQTBCLFNBQWlCLEVBQUUsVUFBa0IsRUFBRSxRQUEyQztRQUMxRyxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsS0FBSyxTQUFTLElBQUksVUFBVSxLQUFLLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxLQUFLLEVBQUUsSUFBSSxVQUFVLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JHLFFBQVEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDeEIsQ0FBQztRQUFDLElBQUk7WUFBQyxRQUFRLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFVyxzQ0FBbUIsR0FBakMsVUFBa0MsU0FBaUIsRUFBRSxVQUFrQixFQUFFLFVBQWtCLEVBQUUsUUFBMkM7UUFDeEksRUFBRSxDQUFBLENBQUMsQ0FBQyxTQUFTLEtBQUssU0FBUyxJQUFJLFVBQVUsS0FBSyxTQUFTLElBQUksVUFBVSxLQUFLLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxLQUFLLEVBQUUsSUFBSSxVQUFVLEtBQUssRUFBRSxJQUFJ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QUMsQ0FBQyxDQUFDO29CQUNyQixJQUFJLENBQUM7d0JBQ0gsTUFBTSxFQUFFLFFBQVEsQ0FBQyxxQkFBcUI7d0JBQ3RDLE9BQU8sRUFBRSxRQUFRLENBQUMscUJBQXFCO3dCQUN2QyxVQUFVLEVBQUUsSUFBSSxLQUFLLEVBQUU7d0JBQ3ZCLElBQUksRUFBRSxHQUFHO3FCQUNWLENBQUMsQ0FBQztnQkFDTCxDQUFDO2dCQUNELElBQUksRUFBRSxDQUFDO1lBQ1QsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUdILHlCQUFDO0FBQUQsQ0E1MkJBLEFBNDJCQyxJQUFBO0FBQUEsaUJBQVMsa0JBQWtCLENBQUMiLCJmaWxlIjoiYXBwL2FwcGxpY2F0aW9uUHJvamVjdC9pbnRlcmNlcHRvci9yZXF1ZXN0L3ZhbGlkYXRpb24vUHJvamVjdEludGVyY2VwdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE1lc3NhZ2VzPXJlcXVpcmUoJy4uLy4uLy4uL3NoYXJlZC9tZXNzYWdlcycpO1xyXG5cclxuXHJcbmNsYXNzIFByb2plY3RJbnRlcmNlcHRvciB7XHJcbiAgcHVibGljIHN0YXRpYyB2YWxpZGF0ZVByb2plY3RJZChwcm9qZWN0SWQ6IHN0cmluZywgIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGlmICgocHJvamVjdElkID09PSB1bmRlZmluZWQpIHx8IChwcm9qZWN0SWQgPT09ICcnKSkge1xyXG4gICAgICBjYWxsYmFjayhudWxsLCBmYWxzZSk7XHJcbiAgICB9IGVsc2UgY2FsbGJhY2sobnVsbCwgdHJ1ZSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc3RhdGljIHZhbGlkYXRlSWRzKHByb2plY3RJZDogc3RyaW5nLCBidWlsZGluZ0lkOiBzdHJpbmcsIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGlmICgocHJvamVjdElkID09PSB1bmRlZmluZWQgfHwgYnVpbGRpbmdJZCA9PT0gdW5kZWZpbmVkKSB8fCAocHJvamVjdElkID09PSAnJyB8fCBidWlsZGluZ0lkID09PSAnJykpIHtcclxuICAgICAgY2FsbGJhY2sobnVsbCwgZmFsc2UpO1xyXG4gICAgfSBlbHNlIGNhbGxiYWNrKG51bGwsIHRydWUpO1xyXG4gIH1cclxuXHJcbnB1YmxpYyBzdGF0aWMgdmFsaWRhdGVDb3N0SGVhZElkcyhwcm9qZWN0SWQ6IHN0cmluZywgYnVpbGRpbmdJZDogc3RyaW5nLCBjb3N0SGVhZElkOiBzdHJpbmcsIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuaWYoKHByb2plY3RJZCA9PT0gdW5kZWZpbmVkIHx8IGJ1aWxkaW5nSWQgPT09IHVuZGVmaW5lZCB8fCBjb3N0SGVhZElkID09PSB1bmRlZmluZWQpIHx8IChwcm9qZWN0SWQgPT09ICcnIHx8IGJ1aWxkaW5nSWQgPT09ICcnIHx8IGNvc3RIZWFkSWQgPT09ICcnKSkge1xyXG4gICAgICBjYWxsYmFjayhudWxsLCBmYWxzZSk7XHJcbiAgICB9IGVsc2UgY2FsbGJhY2sobnVsbCwgdHJ1ZSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc3RhdGljIHZhbGlkYXRlUHJvamVjdENvc3RIZWFkSWRzKHByb2plY3RJZDogc3RyaW5nLCBjb3N0SGVhZElkOiBudW1iZXIsIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGlmKChwcm9qZWN0SWQgPT09IHVuZGVmaW5lZCB8fCBjb3N0SGVhZElkID09PSB1bmRlZmluZWQpIHx8IChwcm9qZWN0SWQgPT09ICcnIHx8IGNvc3RIZWFkSWQgPT09IG51bGwpKSB7XHJcbiAgICAgIGNhbGxiYWNrKG51bGwsIGZhbHNlKTtcclxuICAgIH0gZWxzZSBjYWxsYmFjayhudWxsLCB0cnVlKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgdmFsaWRhdGVJZHNGb3JVcGRhdGVSYXRlKHByb2plY3RJZDogc3RyaW5nLCBidWlsZGluZ0lkOiBzdHJpbmcsIGNvc3RIZWFkSWQ6IG51bWJlciwgY2F0ZWdvcnlJZDogbnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdvcmtJdGVtSWQ6IG51bWJlciwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgaWYoKHByb2plY3RJZCA9PT0gdW5kZWZpbmVkIHx8IGJ1aWxkaW5nSWQgPT09IHVuZGVmaW5lZCB8fCBjb3N0SGVhZElkID09PSB1bmRlZmluZWQgfHwgY2F0ZWdvcnlJZCA9PT0gdW5kZWZpbmVkIHx8XHJcbiAgICAgICAgd29ya0l0ZW1JZCA9PT0gdW5kZWZpbmVkKSB8fCAocHJvamVjdElkID09PSAnJyB8fCBidWlsZGluZ0lkID09PSAnJyB8fCBjb3N0SGVhZElkID09PSBudWxsIHx8IGNhdGVnb3J5SWQgPT09IG51bGwgfHxcclxuICAgICAgICB3b3JrSXRlbUlkID09PSBudWxsKSkge1xyXG4gICAgICBjYWxsYmFjayhudWxsLCBmYWxzZSk7XHJcbiAgICB9IGVsc2UgY2FsbGJhY2sobnVsbCwgdHJ1ZSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc3RhdGljIHZhbGlkYXRlQ2F0ZWdvcnlJZHMocHJvamVjdElkOiBzdHJpbmcsIGJ1aWxkaW5nSWQ6IHN0cmluZywgY29zdEhlYWRJZDogbnVtYmVyLCBjYXRlZ29yeUlkOiBudW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZVN0YXR1czogbnVtYmVyLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBpZigocHJvamVjdElkID09PSB1bmRlZmluZWQgfHwgYnVpbGRpbmdJZCA9PT0gdW5kZWZpbmVkIHx8IGNvc3RIZWFkSWQgPT09IHVuZGVmaW5lZCB8fCBjYXRlZ29yeUlkID09PSB1bmRlZmluZWQgfHxcclxuICAgICAgICBhY3RpdmVTdGF0dXMgPT09IHVuZGVmaW5lZCkgfHwgKHByb2plY3RJZCA9PT0gJycgfHwgYnVpbGRpbmdJZCA9PT0gJycgfHwgY29zdEhlYWRJZCA9PT0gbnVsbCB8fCBjYXRlZ29yeUlkID09PSBudWxsXHJcbiAgICAgICAgfHwgYWN0aXZlU3RhdHVzID09PSBudWxsKSkge1xyXG4gICAgICBjYWxsYmFjayhudWxsLCBmYWxzZSk7XHJcbiAgICB9IGVsc2UgY2FsbGJhY2sobnVsbCwgdHJ1ZSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgfVxyXG5cclxuICBjcmVhdGVQcm9qZWN0KHJlcTogYW55LCByZXM6IGFueSwgbmV4dDogYW55KSB7XHJcbmlmICgocmVxLmJvZHkubmFtZSA9PT0gdW5kZWZpbmVkKSB8fCAocmVxLmJvZHkucmVnaW9uID09PSB1bmRlZmluZWQpIHx8IChyZXEuYm9keS5wbG90QXJlYSA9PT0gdW5kZWZpbmVkKSB8fCAocmVxLmJvZHkucGxvdFBlcmlwaGVyeSA9PT0gdW5kZWZpbmVkKSB8fFxyXG4gICAgKHJlcS5ib2R5LnBvZGl1bUFyZWEgPT09IHVuZGVmaW5lZCkgfHwgKHJlcS5ib2R5Lm9wZW5TcGFjZSA9PT0gdW5kZWZpbmVkKSB8fCAocmVxLmJvZHkuc2xhYkFyZWEgPT09IHVuZGVmaW5lZCkgfHwgKHJlcS5ib2R5LnBvb2xDYXBhY2l0eSA9PT0gdW5kZWZpbmVkKSB8fFxyXG4gICAgICAocmVxLmJvZHkucHJvamVjdER1cmF0aW9uID09PSB1bmRlZmluZWQpIHx8IChyZXEuYm9keS50b3RhbE51bU9mQnVpbGRpbmdzID09PSB1bmRlZmluZWQpIHx8XHJcbiAgKHJlcS5ib2R5Lm5hbWUgPT09ICcnKSB8fCAocmVxLmJvZHkucmVnaW9uID09PSAnJykgfHwgKHJlcS5ib2R5LnBsb3RBcmVhID09PSAnJykgfHxcclxuICAocmVxLmJvZHkucGxvdFBlcmlwaGVyeSA9PT0gJycpIHx8IChyZXEuYm9keS5wb2RpdW1BcmVhID09PSAnJykgfHwgKHJlcS5ib2R5Lm9wZW5TcGFjZSA9PT0gJycpIHx8XHJcbiAgKHJlcS5ib2R5LnNsYWJBcmVhID09PSAnJykgfHwgKHJlcS5ib2R5LnBvb2xDYXBhY2l0eSA9PT0gJycpIHx8IChyZXEuYm9keS5wcm9qZWN0RHVyYXRpb24gPT09ICcnKSB8fFxyXG4gIChyZXEuYm9keS50b3RhbE51bU9mQnVpbGRpbmdzID09PSAnJykpIHtcclxuICAgICAgbmV4dCh7XHJcbiAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIG5leHQoKTtcclxuICB9XHJcblxyXG4gIGdldFByb2plY3RCeUlkKHJlcTogYW55LCByZXM6IGFueSwgbmV4dDogYW55KSB7XHJcbiAgICB2YXIgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICBQcm9qZWN0SW50ZXJjZXB0b3IudmFsaWRhdGVQcm9qZWN0SWQocHJvamVjdElkLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAocmVzdWx0ID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBuZXh0KCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlUHJvamVjdEJ5SWQocmVxOiBhbnksIHJlczogYW55LCBuZXh0OiBhbnkpIHtcclxuICAgIHZhciBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgIFByb2plY3RJbnRlcmNlcHRvci52YWxpZGF0ZVByb2plY3RJZChwcm9qZWN0SWQsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmICgocmVxLmJvZHkubmFtZSA9PT0gdW5kZWZpbmVkKSB8fCAocmVxLmJvZHkucmVnaW9uID09PSB1bmRlZmluZWQpIHx8IChyZXEuYm9keS5wbG90QXJlYSA9PT0gdW5kZWZpbmVkKSB8fFxyXG4gICAgICAgICAgICAocmVxLmJvZHkucGxvdFBlcmlwaGVyeSA9PT0gdW5kZWZpbmVkKSB8fCAocmVxLmJvZHkucG9kaXVtQXJlYSA9PT0gdW5kZWZpbmVkKSB8fCAocmVxLmJvZHkub3BlblNwYWNlID09PSB1bmRlZmluZWQpIHx8XHJcbiAgICAgICAgICAgIChyZXEuYm9keS5zbGFiQXJlYSA9PT0gdW5kZWZpbmVkKSB8fCAocmVxLmJvZHkucG9vbENhcGFjaXR5ID09PSB1bmRlZmluZWQpIHx8IChyZXEuYm9keS5wcm9qZWN0RHVyYXRpb24gPT09IHVuZGVmaW5lZCkgfHxcclxuICAgICAgICAgICAgKHJlcS5ib2R5LnRvdGFsTnVtT2ZCdWlsZGluZ3MgPT09IHVuZGVmaW5lZCkgfHwgKHJlcS5ib2R5Lm5hbWUgPT09ICcnKSB8fCAocmVxLmJvZHkucmVnaW9uID09PSAnJykgfHwgKHJlcS5ib2R5LnBsb3RBcmVhID09PSAnJykgfHxcclxuICAgICAgICAgICAgKHJlcS5ib2R5LnBsb3RQZXJpcGhlcnkgPT09ICcnKSB8fCAocmVxLmJvZHkucG9kaXVtQXJlYSA9PT0gJycpIHx8IChyZXEuYm9keS5vcGVuU3BhY2UgPT09ICcnKSB8fFxyXG4gICAgICAgICAgICAocmVxLmJvZHkuc2xhYkFyZWEgPT09ICcnKSB8fCAocmVxLmJvZHkucG9vbENhcGFjaXR5ID09PSB1bmRlZmluZWQpIHx8IChyZXEuYm9keS5wcm9qZWN0RHVyYXRpb24gPT09ICcnKSB8fCAocmVxLmJvZHkudG90YWxOdW1PZkJ1aWxkaW5ncyA9PT0gJycpKSB7XHJcbiAgICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5leHQoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBjcmVhdGVCdWlsZGluZyhyZXE6IGFueSwgcmVzOiBhbnksIG5leHQ6IGFueSkge1xyXG4gICAgdmFyIHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgUHJvamVjdEludGVyY2VwdG9yLnZhbGlkYXRlUHJvamVjdElkKHByb2plY3RJZCwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKChyZXEuYm9keS5uYW1lID09PSB1bmRlZmluZWQpIHx8IChyZXEuYm9keS50b3RhbFNsYWJBcmVhID09PSB1bmRlZmluZWQpIHx8IChyZXEuYm9keS50b3RhbENhcnBldEFyZWFPZlVuaXQgPT09IHVuZGVmaW5lZCkgfHxcclxuICAgICAgICAgICAgKHJlcS5ib2R5LnRvdGFsU2FsZWFibGVBcmVhT2ZVbml0ID09PSB1bmRlZmluZWQpIHx8IChyZXEuYm9keS5wbGludGhBcmVhID09PSB1bmRlZmluZWQpIHx8IChyZXEuYm9keS50b3RhbE51bU9mRmxvb3JzID09PSB1bmRlZmluZWQpIHx8XHJcbiAgICAgICAgICAgIChyZXEuYm9keS5udW1PZlBhcmtpbmdGbG9vcnMgPT09IHVuZGVmaW5lZCkgfHwgKHJlcS5ib2R5LmNhcnBldEFyZWFPZlBhcmtpbmcgPT09IHVuZGVmaW5lZCkgfHwocmVxLmJvZHkubmFtZSA9PT0gJycpIHx8XHJcbiAgICAgICAgICAgIChyZXEuYm9keS50b3RhbFNsYWJBcmVhID09PSAnJykgfHwgKHJlcS5ib2R5LnRvdGFsQ2FycGV0QXJlYU9mVW5pdCA9PT0gJycpIHx8IChyZXEuYm9keS50b3RhbFNhbGVhYmxlQXJlYU9mVW5pdCA9PT0gJycpIHx8XHJcbiAgICAgICAgICAgIChyZXEuYm9keS5wbGludGhBcmVhID09PSAnJykgfHwgKHJlcS5ib2R5LnRvdGFsTnVtT2ZGbG9vcnMgPT09ICcnKSB8fCAocmVxLmJvZHkubnVtT2ZQYXJraW5nRmxvb3JzID09PSAnJykgfHwgKHJlcS5ib2R5LmNhcnBldEFyZWFPZlBhcmtpbmcgPT09ICcnKSkge1xyXG4gICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBuZXh0KCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0QnVpbGRpbmdCeUlkKHJlcTogYW55LCByZXM6IGFueSwgbmV4dDogYW55KSB7XHJcbiAgICB2YXIgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICB2YXIgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgIFByb2plY3RJbnRlcmNlcHRvci52YWxpZGF0ZUlkcyhwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5leHQoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVCdWlsZGluZ0J5SWQocmVxOiBhbnksIHJlczogYW55LCBuZXh0OiBhbnkpIHtcclxuICAgIHZhciBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgIHZhciBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgUHJvamVjdEludGVyY2VwdG9yLnZhbGlkYXRlSWRzKHByb2plY3RJZCwgYnVpbGRpbmdJZCwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKChyZXEuYm9keS5uYW1lID09PSB1bmRlZmluZWQpIHx8IChyZXEuYm9keS50b3RhbFNsYWJBcmVhID09PSB1bmRlZmluZWQpIHx8IChyZXEuYm9keS50b3RhbENhcnBldEFyZWFPZlVuaXQgPT09IHVuZGVmaW5lZCkgfHwgKHJlcS5ib2R5LnRvdGFsU2FsZWFibGVBcmVhT2ZVbml0ID09PSB1bmRlZmluZWQpIHx8XHJcbiAgICAgICAgICAgICAgKHJlcS5ib2R5LnBsaW50aEFyZWEgPT09IHVuZGVmaW5lZCkgfHwgKHJlcS5ib2R5LnRvdGFsTnVtT2ZGbG9vcnMgPT09IHVuZGVmaW5lZCkgfHwgKHJlcS5ib2R5Lm51bU9mUGFya2luZ0Zsb29ycyA9PT0gdW5kZWZpbmVkKSB8fCAocmVxLmJvZHkuY2FycGV0QXJlYU9mUGFya2luZyA9PT0gdW5kZWZpbmVkKSB8fFxyXG4gICAgICAgICAgICAocmVxLmJvZHkubmFtZSA9PT0gJycpIHx8IChyZXEuYm9keS50b3RhbFNsYWJBcmVhID09PSAnJykgfHwgKHJlcS5ib2R5LnRvdGFsQ2FycGV0QXJlYU9mVW5pdCA9PT0gJycpIHx8IChyZXEuYm9keS50b3RhbFNhbGVhYmxlQXJlYU9mVW5pdCA9PT0gJycpIHx8XHJcbiAgICAgICAgICAgIChyZXEuYm9keS5wbGludGhBcmVhID09PSAnJykgfHwgKHJlcS5ib2R5LnRvdGFsTnVtT2ZGbG9vcnMgPT09ICcnKSB8fCAocmVxLmJvZHkubnVtT2ZQYXJraW5nRmxvb3JzID09PSAnJykgfHwgKHJlcS5ib2R5LmNhcnBldEFyZWFPZlBhcmtpbmcgPT09ICcnKSkge1xyXG4gICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBuZXh0KCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZGVsZXRlQnVpbGRpbmdCeUlkKHJlcTogYW55LCByZXM6IGFueSwgbmV4dDogYW55KSB7XHJcbiAgICB2YXIgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICB2YXIgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgIFByb2plY3RJbnRlcmNlcHRvci52YWxpZGF0ZUlkcyhwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5leHQoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRCdWlsZGluZ0J5SWRGb3JDbG9uZShyZXE6IGFueSwgcmVzOiBhbnksIG5leHQ6IGFueSkge1xyXG4gICAgdmFyIHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgdmFyIGJ1aWxkaW5nSWQgPSByZXEucGFyYW1zLmJ1aWxkaW5nSWQ7XHJcbiAgICBQcm9qZWN0SW50ZXJjZXB0b3IudmFsaWRhdGVJZHMocHJvamVjdElkLCBidWlsZGluZ0lkLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAocmVzdWx0ID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBuZXh0KCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0Q2F0ZWdvcmllc09mUHJvamVjdENvc3RIZWFkKHJlcTogYW55LCByZXM6IGFueSwgbmV4dDogYW55KSB7XHJcbiAgICB2YXIgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICB2YXIgY29zdEhlYWRJZCA9IHJlcS5wYXJhbXMuY29zdEhlYWRJZDtcclxuICAgIFByb2plY3RJbnRlcmNlcHRvci52YWxpZGF0ZVByb2plY3RDb3N0SGVhZElkcyhwcm9qZWN0SWQsIGNvc3RIZWFkSWQsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5leHQoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzZXRDb3N0SGVhZFN0YXR1cyhyZXE6IGFueSwgcmVzOiBhbnksIG5leHQ6IGFueSkge1xyXG4gICAgdmFyIHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgdmFyIGJ1aWxkaW5nSWQgPSByZXEucGFyYW1zLmJ1aWxkaW5nSWQ7XHJcbiAgICB2YXIgY29zdEhlYWRJZCA9IHJlcS5wYXJhbXMuY29zdEhlYWRJZDtcclxuICAgIFByb2plY3RJbnRlcmNlcHRvci52YWxpZGF0ZUNvc3RIZWFkSWRzKHByb2plY3RJZCwgYnVpbGRpbmdJZCwgY29zdEhlYWRJZCwgIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmKChyZXEucGFyYW1zLmFjdGl2ZVN0YXR1cyA9PT0gdW5kZWZpbmVkKSB8fCAocmVxLnBhcmFtcy5hY3RpdmVTdGF0dXMgPT09ICcnKSApIHtcclxuICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgbmV4dCgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldEluQWN0aXZlQ29zdEhlYWQocmVxOiBhbnksIHJlczogYW55LCBuZXh0OiBhbnkpIHtcclxuICAgIHZhciBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgIHZhciBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgUHJvamVjdEludGVyY2VwdG9yLnZhbGlkYXRlSWRzKHByb2plY3RJZCwgYnVpbGRpbmdJZCwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbmV4dCgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZUJ1ZGdldGVkQ29zdEZvckJ1aWxkaW5nQ29zdEhlYWQocmVxOiBhbnksIHJlczogYW55LCBuZXh0OiBhbnkpIHtcclxuICAgIHZhciBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgIHZhciBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgUHJvamVjdEludGVyY2VwdG9yLnZhbGlkYXRlSWRzKHByb2plY3RJZCwgYnVpbGRpbmdJZCwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKChyZXEuYm9keS5idWRnZXRlZENvc3RBbW91bnQgPT09IHVuZGVmaW5lZCkgfHwgKHJlcS5ib2R5LmNvc3RIZWFkID09PSB1bmRlZmluZWQpIHx8XHJcbiAgICAgICAgICAgIChyZXEuYm9keS5idWRnZXRlZENvc3RBbW91bnQgPT09ICcnKSB8fCAocmVxLmJvZHkuY29zdEhlYWQgPT09ICcnKSkge1xyXG4gICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBuZXh0KCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlQnVkZ2V0ZWRDb3N0Rm9yUHJvamVjdENvc3RIZWFkKHJlcTogYW55LCByZXM6IGFueSwgbmV4dDogYW55KSB7XHJcbiAgICB2YXIgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICBpZiAoKHByb2plY3RJZCA9PT0gdW5kZWZpbmVkKSB8fCAocHJvamVjdElkID09PSAnJykgfHwgKHJlcS5ib2R5LmJ1ZGdldGVkQ29zdEFtb3VudCA9PT0gdW5kZWZpbmVkKSB8fFxyXG4gICAgICAocmVxLmJvZHkuY29zdEhlYWQgPT09IHVuZGVmaW5lZCkgfHwgKHJlcS5ib2R5LmJ1ZGdldGVkQ29zdEFtb3VudCA9PT0gJycpIHx8IChyZXEuYm9keS5jb3N0SGVhZCA9PT0gJycpKSB7XHJcbiAgICAgIG5leHQoe1xyXG4gICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBuZXh0KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXRDYXRlZ29yaWVzT2ZCdWlsZGluZ0Nvc3RIZWFkKHJlcTogYW55LCByZXM6IGFueSwgbmV4dDogYW55KSB7XHJcbiAgICB2YXIgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICB2YXIgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgIHZhciBjb3N0SGVhZElkID0gcmVxLnBhcmFtcy5jb3N0SGVhZElkO1xyXG4gICAgUHJvamVjdEludGVyY2VwdG9yLnZhbGlkYXRlQ29zdEhlYWRJZHMocHJvamVjdElkLCBidWlsZGluZ0lkLCBjb3N0SGVhZElkLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAocmVzdWx0ID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBuZXh0KCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0SW5BY3RpdmVDYXRlZ29yaWVzQnlDb3N0SGVhZElkKHJlcTogYW55LCByZXM6IGFueSwgbmV4dDogYW55KSB7XHJcbiAgICB2YXIgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICB2YXIgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgIHZhciBjb3N0SGVhZElkID0gcmVxLnBhcmFtcy5jb3N0SGVhZElkO1xyXG4gICAgUHJvamVjdEludGVyY2VwdG9yLnZhbGlkYXRlQ29zdEhlYWRJZHMocHJvamVjdElkLCBidWlsZGluZ0lkLCBjb3N0SGVhZElkLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAocmVzdWx0ID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBuZXh0KCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0QWxsQ2F0ZWdvcmllc0J5Q29zdEhlYWRJZChyZXE6IGFueSwgcmVzOiBhbnksIG5leHQ6IGFueSkge1xyXG4gICAgdmFyIHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgdmFyIGJ1aWxkaW5nSWQgPSByZXEucGFyYW1zLmJ1aWxkaW5nSWQ7XHJcbiAgICB2YXIgY29zdEhlYWRJZCA9IHJlcS5wYXJhbXMuY29zdEhlYWRJZDtcclxuICAgIFByb2plY3RJbnRlcmNlcHRvci52YWxpZGF0ZUNvc3RIZWFkSWRzKHByb2plY3RJZCwgYnVpbGRpbmdJZCwgY29zdEhlYWRJZCwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbmV4dCgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZUNhdGVnb3J5U3RhdHVzKHJlcTogYW55LCByZXM6IGFueSwgbmV4dDogYW55KSB7XHJcbiAgICB2YXIgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICB2YXIgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgIHZhciBjb3N0SGVhZElkID0gcmVxLnBhcmFtcy5jb3N0SGVhZElkO1xyXG4gICAgdmFyIGNhdGVnb3J5SWQgPSByZXEucGFyYW1zLmNhdGVnb3J5SWQ7XHJcbiAgICB2YXIgYWN0aXZlU3RhdHVzID0gcmVxLnBhcmFtcy5hY3RpdmVTdGF0dXM7XHJcbiAgICBQcm9qZWN0SW50ZXJjZXB0b3IudmFsaWRhdGVDYXRlZ29yeUlkcyhwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIGNvc3RIZWFkSWQsIGNhdGVnb3J5SWQsIGFjdGl2ZVN0YXR1cywgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbmV4dCgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGFkZENhdGVnb3J5QnlDb3N0SGVhZElkKHJlcTogYW55LCByZXM6IGFueSwgbmV4dDogYW55KSB7XHJcbiAgICB2YXIgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICB2YXIgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgIHZhciBjb3N0SGVhZElkID0gcmVxLnBhcmFtcy5jb3N0SGVhZElkO1xyXG4gICAgUHJvamVjdEludGVyY2VwdG9yLnZhbGlkYXRlQ29zdEhlYWRJZHMocHJvamVjdElkLCBidWlsZGluZ0lkLCBjb3N0SGVhZElkLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAocmVzdWx0ID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpZiAoKHJlcS5ib2R5LmNhdGVnb3J5ID09PSB1bmRlZmluZWQpIHx8IChyZXEuYm9keS5jYXRlZ29yeUlkID09PSB1bmRlZmluZWQpIHx8XHJcbiAgICAgICAgICAgIChyZXEuYm9keS5jYXRlZ29yeSA9PT0gJycpIHx8IChyZXEuYm9keS5jYXRlZ29yeUlkID09PSAnJykpIHtcclxuICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgbmV4dCgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGRlbGV0ZUNhdGVnb3J5RnJvbUNvc3RIZWFkKHJlcTogYW55LCByZXM6IGFueSwgbmV4dDogYW55KSB7XHJcbiAgICB2YXIgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICB2YXIgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgIHZhciBjb3N0SGVhZElkID0gcmVxLnBhcmFtcy5jb3N0SGVhZElkO1xyXG4gICAgUHJvamVjdEludGVyY2VwdG9yLnZhbGlkYXRlQ29zdEhlYWRJZHMocHJvamVjdElkLCBidWlsZGluZ0lkLCBjb3N0SGVhZElkLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAocmVzdWx0ID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpZiAoKHJlcS5ib2R5Lm5hbWUgPT09IHVuZGVmaW5lZCkgfHwgKHJlcS5ib2R5LnJhdGVBbmFseXNpc0lkID09PSB1bmRlZmluZWQpIHx8XHJcbiAgICAgICAgICAgIChyZXEuYm9keS5uYW1lID09PSAnJykgfHwgKHJlcS5ib2R5LnJhdGVBbmFseXNpc0lkID09PSAnJykpIHtcclxuICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgbmV4dCgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZVdvcmtJdGVtU3RhdHVzT2ZCdWlsZGluZ0Nvc3RIZWFkcyhyZXE6IGFueSwgcmVzOiBhbnksIG5leHQ6IGFueSkge1xyXG4gICAgdmFyIHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgdmFyIGJ1aWxkaW5nSWQgPSByZXEucGFyYW1zLmJ1aWxkaW5nSWQ7XHJcbiAgICB2YXIgY29zdEhlYWRJZCA9IHJlcS5wYXJhbXMuY29zdEhlYWRJZDtcclxuICAgIFByb2plY3RJbnRlcmNlcHRvci52YWxpZGF0ZUNvc3RIZWFkSWRzKHByb2plY3RJZCwgYnVpbGRpbmdJZCwgY29zdEhlYWRJZCwgIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgaWYoIChyZXEucGFyYW1zLndvcmtJdGVtSWQgPT09IHVuZGVmaW5lZCkgfHwgKHJlcS5wYXJhbXMud29ya0l0ZW1JZCA9PT0gJycpIHx8XHJcbiAgICAgICAgKHJlcS5wYXJhbXMuYWN0aXZlU3RhdHVzID09PSB1bmRlZmluZWQpIHx8IChyZXEucGFyYW1zLmFjdGl2ZVN0YXR1cyA9PT0gJycpKSB7XHJcbiAgICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5leHQoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVXb3JrSXRlbVN0YXR1c09mUHJvamVjdENvc3RIZWFkcyhyZXE6IGFueSwgcmVzOiBhbnksIG5leHQ6IGFueSkge1xyXG4gICAgdmFyIHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgdmFyIGNvc3RIZWFkSWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNvc3RIZWFkSWQpO1xyXG4gICAgdmFyIGNhdGVnb3J5SWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNhdGVnb3J5KTtcclxuICAgIHZhciB3b3JrSXRlbUlkID0gcGFyc2VJbnQocmVxLnBhcmFtcy5jb3N0SGVhZElkKTtcclxuICAgIFByb2plY3RJbnRlcmNlcHRvci52YWxpZGF0ZVByb2plY3RDb3N0SGVhZElkcyhwcm9qZWN0SWQsIGNvc3RIZWFkSWQsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmKCAoY2F0ZWdvcnlJZCA9PT0gdW5kZWZpbmVkKSB8fCAoY2F0ZWdvcnlJZCA9PT0gbnVsbCkgfHxcclxuICAgICAgICAgICAgICh3b3JrSXRlbUlkID09PSB1bmRlZmluZWQpIHx8ICh3b3JrSXRlbUlkID09PSBudWxsKSB8fFxyXG4gICAgICAgICAgICAocmVxLnBhcmFtcy5hY3RpdmVTdGF0dXMgPT09IHVuZGVmaW5lZCkgfHwgKHJlcS5wYXJhbXMuYWN0aXZlU3RhdHVzID09PSAnJykpIHtcclxuICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgbmV4dCgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldEluQWN0aXZlV29ya0l0ZW1zT2ZCdWlsZGluZ0Nvc3RIZWFkcyhyZXE6IGFueSwgcmVzOiBhbnksIG5leHQ6IGFueSkge1xyXG4gICAgdmFyIHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgdmFyIGJ1aWxkaW5nSWQgPSByZXEucGFyYW1zLmJ1aWxkaW5nSWQ7XHJcbiAgICB2YXIgY29zdEhlYWRJZCA9IHJlcS5wYXJhbXMuY29zdEhlYWRJZDtcclxuICAgIFByb2plY3RJbnRlcmNlcHRvci52YWxpZGF0ZUNvc3RIZWFkSWRzKHByb2plY3RJZCwgYnVpbGRpbmdJZCwgY29zdEhlYWRJZCwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKChyZXEucGFyYW1zLmNhdGVnb3J5SWQgPT09IHVuZGVmaW5lZCkgfHwgKHJlcS5wYXJhbXMuY2F0ZWdvcnlJZCA9PT0gJycpKSB7XHJcbiAgICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5leHQoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRJbkFjdGl2ZVdvcmtJdGVtc09mUHJvamVjdENvc3RIZWFkcyhyZXE6IGFueSwgcmVzOiBhbnksIG5leHQ6IGFueSkge1xyXG4gICAgdmFyIHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgdmFyIGNvc3RIZWFkSWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNvc3RIZWFkSWQpO1xyXG4gICAgbGV0IGNhdGVnb3J5SWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNhdGVnb3J5SWQpO1xyXG4gICAgUHJvamVjdEludGVyY2VwdG9yLnZhbGlkYXRlUHJvamVjdENvc3RIZWFkSWRzKHByb2plY3RJZCwgY29zdEhlYWRJZCwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKChjYXRlZ29yeUlkID09PSB1bmRlZmluZWQpIHx8IChjYXRlZ29yeUlkID09PSBudWxsKSkge1xyXG4gICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBuZXh0KCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0UmF0ZShyZXE6IGFueSwgcmVzOiBhbnksIG5leHQ6IGFueSkge1xyXG4gICAgdmFyIHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgdmFyIGJ1aWxkaW5nSWQgPSByZXEucGFyYW1zLmJ1aWxkaW5nSWQ7XHJcbiAgICB2YXIgY29zdEhlYWRJZCA9IHJlcS5wYXJhbXMuY29zdEhlYWRJZDtcclxuICAgIFByb2plY3RJbnRlcmNlcHRvci52YWxpZGF0ZUNvc3RIZWFkSWRzKHByb2plY3RJZCwgYnVpbGRpbmdJZCwgY29zdEhlYWRJZCwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKChyZXEucGFyYW1zLmNhdGVnb3J5SWQgPT09IHVuZGVmaW5lZCkgfHwgKHJlcS5wYXJhbXMud29ya0l0ZW1JZCA9PT0gdW5kZWZpbmVkKSB8fFxyXG4gICAgICAgICAgICAocmVxLnBhcmFtcy5jYXRlZ29yeUlkID09PSAnJykgfHwgKHJlcS5wYXJhbXMud29ya0l0ZW1JZCA9PT0gJycpKSB7XHJcbiAgICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5leHQoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVRdWFudGl0eU9mQnVpbGRpbmdDb3N0SGVhZHMocmVxOiBhbnksIHJlczogYW55LCBuZXh0OiBhbnkpIHtcclxuICAgIHZhciBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgIHZhciBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgdmFyIGNvc3RIZWFkSWQgPSByZXEucGFyYW1zLmNvc3RIZWFkSWQ7XHJcbiAgICBQcm9qZWN0SW50ZXJjZXB0b3IudmFsaWRhdGVDb3N0SGVhZElkcyhwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIGNvc3RIZWFkSWQsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmICgocmVxLnBhcmFtcy5jYXRlZ29yeUlkID09PSB1bmRlZmluZWQpIHx8IChyZXEucGFyYW1zLndvcmtJdGVtSWQgPT09IHVuZGVmaW5lZCkgfHwgKHJlcS5ib2R5Lml0ZW0gPT09IHVuZGVmaW5lZCkgfHxcclxuICAgICAgICAgICAgKHJlcS5wYXJhbXMuY2F0ZWdvcnlJZCA9PT0gJycpIHx8IChyZXEucGFyYW1zLndvcmtJdGVtSWQgPT09ICcnKSB8fCAocmVxLmJvZHkuaXRlbSA9PT0gJycpKSB7XHJcbiAgICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5leHQoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVRdWFudGl0eU9mUHJvamVjdENvc3RIZWFkcyhyZXE6IGFueSwgcmVzOiBhbnksIG5leHQ6IGFueSkge1xyXG4gICAgdmFyIHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgdmFyIGNvc3RIZWFkSWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNvc3RIZWFkSWQpO1xyXG4gICAgdmFyIGNhdGVnb3J5SWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNhdGVnb3J5SWQpO1xyXG4gICAgdmFyIHdvcmtJdGVtSWQgPSBwYXJzZUludChyZXEucGFyYW1zLndvcmtJdGVtSWQpO1xyXG5cclxuICAgIFByb2plY3RJbnRlcmNlcHRvci52YWxpZGF0ZVByb2plY3RDb3N0SGVhZElkcyhwcm9qZWN0SWQsIGNvc3RIZWFkSWQsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmICgoY2F0ZWdvcnlJZCA9PT0gdW5kZWZpbmVkKSB8fCAod29ya0l0ZW1JZCA9PT0gdW5kZWZpbmVkKSB8fCAocmVxLmJvZHkuaXRlbSA9PT0gdW5kZWZpbmVkKSB8fFxyXG4gICAgICAgICAgICAoY2F0ZWdvcnlJZCA9PT0gbnVsbCkgfHwgKHdvcmtJdGVtSWQgPT09IG51bGwpIHx8IChyZXEuYm9keS5pdGVtID09PSAnJykpIHtcclxuICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgbmV4dCgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGRlbGV0ZVF1YW50aXR5T2ZCdWlsZGluZ0Nvc3RIZWFkc0J5TmFtZShyZXE6IGFueSwgcmVzOiBhbnksIG5leHQ6IGFueSkge1xyXG4gICAgdmFyIHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgdmFyIGJ1aWxkaW5nSWQgPSByZXEucGFyYW1zLmJ1aWxkaW5nSWQ7XHJcbiAgICB2YXIgY29zdEhlYWRJZCA9IHJlcS5wYXJhbXMuY29zdEhlYWRJZDtcclxuICAgIFByb2plY3RJbnRlcmNlcHRvci52YWxpZGF0ZUNvc3RIZWFkSWRzKHByb2plY3RJZCwgYnVpbGRpbmdJZCwgY29zdEhlYWRJZCwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKChyZXEucGFyYW1zLmNhdGVnb3J5SWQgPT09IHVuZGVmaW5lZCkgfHwgKHJlcS5wYXJhbXMud29ya0l0ZW1JZCA9PT0gdW5kZWZpbmVkKSB8fCAocmVxLmJvZHkuaXRlbSA9PT0gdW5kZWZpbmVkKSB8fFxyXG4gICAgICAgICAgICAocmVxLnBhcmFtcy5jYXRlZ29yeUlkID09PSAnJykgfHwgKHJlcS5wYXJhbXMud29ya0l0ZW1JZCA9PT0gJycpIHx8IChyZXEuYm9keS5pdGVtID09PSAnJykpIHtcclxuICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgbmV4dCgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGRlbGV0ZVF1YW50aXR5T2ZQcm9qZWN0Q29zdEhlYWRzQnlOYW1lKHJlcTogYW55LCByZXM6IGFueSwgbmV4dDogYW55KSB7XHJcbiAgICB2YXIgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICB2YXIgY29zdEhlYWRJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY29zdEhlYWRJZCk7XHJcbiAgICB2YXIgY2F0ZWdvcnlJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY29zdEhlYWRJZCk7XHJcbiAgICB2YXIgd29ya0l0ZW1JZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY29zdEhlYWRJZCk7XHJcbiAgICBQcm9qZWN0SW50ZXJjZXB0b3IudmFsaWRhdGVQcm9qZWN0Q29zdEhlYWRJZHMocHJvamVjdElkLCBjb3N0SGVhZElkLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAocmVzdWx0ID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpZiAoKGNhdGVnb3J5SWQgPT09IHVuZGVmaW5lZCkgfHwgKHdvcmtJdGVtSWQgPT09IHVuZGVmaW5lZCkgfHwgKHJlcS5ib2R5Lml0ZW0gPT09IHVuZGVmaW5lZCkgfHxcclxuICAgICAgICAgICAgKGNhdGVnb3J5SWQgPT09IG51bGwpIHx8ICh3b3JrSXRlbUlkID09PSBudWxsKSB8fCAocmVxLmJvZHkuaXRlbSA9PT0gJycpKSB7XHJcbiAgICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5leHQoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVSYXRlT2ZCdWlsZGluZ0Nvc3RIZWFkcyhyZXE6IGFueSwgcmVzOiBhbnksIG5leHQ6IGFueSkge1xyXG4gICAgdmFyIHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgdmFyIGJ1aWxkaW5nSWQgPSByZXEucGFyYW1zLmJ1aWxkaW5nSWQ7XHJcbiAgICB2YXIgY29zdEhlYWRJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY29zdEhlYWRJZCk7XHJcbiAgICB2YXIgY2F0ZWdvcnlJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY2F0ZWdvcnlJZCk7XHJcbiAgICB2YXIgd29ya0l0ZW1JZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMud29ya0l0ZW1JZCk7XHJcbiAgICBQcm9qZWN0SW50ZXJjZXB0b3IudmFsaWRhdGVJZHNGb3JVcGRhdGVSYXRlKHByb2plY3RJZCwgYnVpbGRpbmdJZCwgY29zdEhlYWRJZCwgY2F0ZWdvcnlJZCwgd29ya0l0ZW1JZCwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKChyZXEucGFyYW1zLmNhdGVnb3J5SWQgPT09IHVuZGVmaW5lZCkgfHwgKHJlcS5wYXJhbXMud29ya0l0ZW1JZCA9PT0gdW5kZWZpbmVkKSB8fChyZXEuYm9keS5xdWFudGl0eSAgPT09IHVuZGVmaW5lZCkgIHx8XHJcbiAgICAgICAgICAgIChyZXEuYm9keS5yYXRlSXRlbXMgPT09IHVuZGVmaW5lZCkgIHx8IChyZXEuYm9keS50b3RhbCAgPT09IHVuZGVmaW5lZCkgfHwgKHJlcS5ib2R5LnVuaXQgPT09IHVuZGVmaW5lZCkgfHxcclxuICAgICAgICAgICAgKHJlcS5wYXJhbXMuY2F0ZWdvcnlJZCA9PT0gJycpIHx8IChyZXEucGFyYW1zLndvcmtJdGVtSWQgPT09ICcnKSB8fCAocmVxLmJvZHkucXVhbnRpdHkgID09PSAnJykgfHxcclxuICAgICAgICAgICAgKHJlcS5ib2R5LnJhdGVJdGVtcyA9PT0gJycpICB8fCAocmVxLmJvZHkudG90YWwgID09PSAnJykgfHwgKHJlcS5ib2R5LnVuaXQgPT09ICcnKSkge1xyXG4gICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBuZXh0KCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlUmF0ZU9mUHJvamVjdENvc3RIZWFkcyhyZXE6IGFueSwgcmVzOiBhbnksIG5leHQ6IGFueSkge1xyXG4gICAgdmFyIHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgdmFyIGNvc3RIZWFkSWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNvc3RIZWFkSWQpO1xyXG4gICAgdmFyIGNhdGVnb3J5SWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNhdGVnb3J5SWQpO1xyXG4gICAgdmFyIHdvcmtJdGVtSWQgPSBwYXJzZUludChyZXEucGFyYW1zLndvcmtJdGVtSWQpO1xyXG4gICAgUHJvamVjdEludGVyY2VwdG9yLnZhbGlkYXRlUHJvamVjdENvc3RIZWFkSWRzKHByb2plY3RJZCwgY29zdEhlYWRJZCwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKChjYXRlZ29yeUlkID09PSB1bmRlZmluZWQpIHx8ICh3b3JrSXRlbUlkID09PSB1bmRlZmluZWQpIHx8KHJlcS5ib2R5LnF1YW50aXR5ICA9PT0gdW5kZWZpbmVkKSAgfHxcclxuICAgICAgICAgICAgKHJlcS5ib2R5LnJhdGVJdGVtcyA9PT0gdW5kZWZpbmVkKSAgfHwgKHJlcS5ib2R5LnRvdGFsICA9PT0gdW5kZWZpbmVkKSB8fCAocmVxLmJvZHkudW5pdCA9PT0gdW5kZWZpbmVkKSB8fFxyXG4gICAgICAgICAgICAoY2F0ZWdvcnlJZCA9PT0gbnVsbCkgfHwgKHdvcmtJdGVtSWQgPT09IG51bGwpIHx8IChyZXEuYm9keS5xdWFudGl0eSAgPT09ICcnKSB8fFxyXG4gICAgICAgICAgICAocmVxLmJvZHkucmF0ZUl0ZW1zID09PSAnJykgIHx8IChyZXEuYm9keS50b3RhbCAgPT09ICcnKSB8fCAocmVxLmJvZHkudW5pdCA9PT0gJycpKSB7XHJcbiAgICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5leHQoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzeW5jUHJvamVjdFdpdGhSYXRlQW5hbHlzaXNEYXRhKHJlcTogYW55LCByZXM6IGFueSwgbmV4dDogYW55KSB7XHJcbiAgICB2YXIgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICB2YXIgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgIFByb2plY3RJbnRlcmNlcHRvci52YWxpZGF0ZUlkcyhwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5leHQoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuXHJcbn1leHBvcnQgPSBQcm9qZWN0SW50ZXJjZXB0b3I7XHJcbiJdfQ==
