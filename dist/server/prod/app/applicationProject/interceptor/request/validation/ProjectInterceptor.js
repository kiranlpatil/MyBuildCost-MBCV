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
    ProjectInterceptor.prototype.getProjectRateItemsByOriginalName = function (req, res, next) {
        var projectId = req.params.projectId;
        var originalRateItemName = req.body.originalRateItemName;
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
                    if ((originalRateItemName === undefined) || (originalRateItemName === '')) {
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
    ProjectInterceptor.prototype.cloneBuilding = function (req, res, next) {
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
    ProjectInterceptor.prototype.getWorkItemListOfProjectCategory = function (req, res, next) {
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
    ProjectInterceptor.prototype.getWorkItemListOfBuildingCategory = function (req, res, next) {
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
        var quantityDetails = req.body.item;
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
                    if ((req.params.categoryId === undefined) || (req.params.workItemId === undefined) || (quantityDetails === undefined) ||
                        (quantityDetails.name === undefined) || (quantityDetails.name === '') ||
                        (req.params.categoryId === '') || (req.params.workItemId === '') || (quantityDetails === '')) {
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
    ProjectInterceptor.prototype.updateDirectQuantityOfBuildingCostHeads = function (req, res, next) {
        var projectId = req.params.projectId;
        var buildingId = req.params.buildingId;
        var costHeadId = req.params.costHeadId;
        var directQuantity = req.body.directQuantity;
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
                    if ((req.params.categoryId === undefined) || (req.params.workItemId === undefined) || (directQuantity === undefined) ||
                        (req.params.categoryId === '') || (req.params.workItemId === '') || (directQuantity === '')) {
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
    ProjectInterceptor.prototype.updateDirectQuantityOfProjectWorkItems = function (req, res, next) {
        var projectId = req.params.projectId;
        var costHeadId = req.params.costHeadId;
        var directQuantity = req.body.directQuantity;
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
                    if ((req.params.categoryId === undefined) || (req.params.workItemId === undefined) || (directQuantity === undefined) ||
                        (req.params.categoryId === '') || (req.params.workItemId === '') || (directQuantity === '')) {
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
        var quantityDetails = req.body.item;
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
                    if ((categoryId === undefined) || (workItemId === undefined) || (quantityDetails === undefined) ||
                        (categoryId === null) || (workItemId === null) || (quantityDetails === '')) {
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
        var itemName = req.body.item.name;
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
                    if ((req.params.categoryId === undefined) || (req.params.workItemId === undefined) || (itemName === undefined) ||
                        (req.params.categoryId === '') || (req.params.workItemId === '') || (itemName === '')) {
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
        var itemName = req.body.item;
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
                    if ((categoryId === undefined) || (workItemId === undefined) || (itemName === undefined) ||
                        (categoryId === null) || (workItemId === null) || (itemName === '')) {
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
    ProjectInterceptor.prototype.updateDirectRateOfBuildingWorkItems = function (req, res, next) {
        var projectId = req.params.projectId;
        var buildingId = req.params.buildingId;
        var costHeadId = req.params.costHeadId;
        var categoryId = parseInt(req.params.categoryId);
        var workItemId = parseInt(req.params.workItemId);
        var directRate = req.body.directRate;
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
                    if ((categoryId === undefined) || (workItemId === undefined) || (directRate === undefined) ||
                        (categoryId === null) || (workItemId === null) || (directRate === '')) {
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
    ProjectInterceptor.prototype.updateDirectRateOfProjectWorkItems = function (req, res, next) {
        var projectId = req.params.projectId;
        var costHeadId = req.params.costHeadId;
        var categoryId = parseInt(req.params.categoryId);
        var workItemId = parseInt(req.params.workItemId);
        var directRate = req.body.directRate;
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
                    if ((categoryId === undefined) || (workItemId === undefined) || (directRate === undefined) ||
                        (categoryId === null) || (workItemId === null) || (directRate === '')) {
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
    ProjectInterceptor.prototype.getBuildingRateItemsByOriginalName = function (req, res, next) {
        var projectId = req.params.projectId;
        var buildingId = req.params.buildingId;
        var originalRateItemName = req.body.originalRateItemName;
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
                    if ((originalRateItemName === undefined) || (originalRateItemName === '')) {
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
    ProjectInterceptor.prototype.addAttachmentToBuildingWorkItem = function (req, res, next) {
        var projectId = req.params.projectId;
        var buildingId = req.params.buildingId;
        var costHeadId = req.params.costHeadId;
        var categoryId = req.params.categoryId;
        var workItemId = req.params.workItemId;
        var fileName = req;
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
                    if ((categoryId === undefined) || (categoryId === '') ||
                        (workItemId === undefined) || (workItemId === '') || (fileName === undefined) || (fileName === '')) {
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
    ProjectInterceptor.prototype.checkPresentFilesForBuildingWorkItem = function (req, res, next) {
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
    ProjectInterceptor.prototype.addAttachmentToProjectWorkItem = function (req, res, next) {
        var projectId = req.params.projectId;
        var costHeadId = req.params.costHeadId;
        var categoryId = req.params.categoryId;
        var workItemId = req.params.workItemId;
        var fileName = req;
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
                    if ((categoryId === undefined) || (categoryId === '') ||
                        (workItemId === undefined) || (workItemId === '') || (fileName === undefined) || (fileName === '')) {
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
    ProjectInterceptor.prototype.checkPresentFilesForProjectWorkItem = function (req, res, next) {
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
                    if ((categoryId === undefined) || (workItemId === undefined) ||
                        (categoryId === null) || (workItemId === null)) {
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
    return ProjectInterceptor;
}());
module.exports = ProjectInterceptor;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHBsaWNhdGlvblByb2plY3QvaW50ZXJjZXB0b3IvcmVxdWVzdC92YWxpZGF0aW9uL1Byb2plY3RJbnRlcmNlcHRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsbURBQW9EO0FBR3BEO0lBQUE7SUF1d0NBLENBQUM7SUF0d0NlLG9DQUFpQixHQUEvQixVQUFnQyxTQUFpQixFQUFFLFFBQTJDO1FBQzVGLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxLQUFLLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwRCxRQUFRLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3hCLENBQUM7UUFBQyxJQUFJO1lBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRWEsOEJBQVcsR0FBekIsVUFBMEIsU0FBaUIsRUFBRSxVQUFrQixFQUFFLFFBQTJDO1FBQzFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxLQUFLLFNBQVMsSUFBSSxVQUFVLEtBQUssU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLEtBQUssRUFBRSxJQUFJLFVBQVUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckcsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN4QixDQUFDO1FBQUMsSUFBSTtZQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVhLHNDQUFtQixHQUFqQyxVQUFrQyxTQUFpQixFQUFFLFVBQWtCLEVBQUUsVUFBa0IsRUFBRSxRQUEyQztRQUN0SSxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsS0FBSyxTQUFTLElBQUksVUFBVSxLQUFLLFNBQVMsSUFBSSxVQUFVLEtBQUssU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLEtBQUssRUFBRSxJQUFJLFVBQVUsS0FBSyxFQUFFLElB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LENBQUMsQ0FBQztnQkFDVixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDZCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04sRUFBRSxDQUFDLENBQUMsTUFBTSxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ3JCLElBQUksQ0FBQzt3QkFDSCxNQUFNLEVBQUUsUUFBUSxDQUFDLHFCQUFxQjt3QkFDdEMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxxQkFBcUI7d0JBQ3ZDLFVBQVUsRUFBRSxJQUFJLEtBQUssRUFBRTt3QkFDdkIsSUFBSSxFQUFFLEdBQUc7cUJBQ1YsQ0FBQyxDQUFDO2dCQUNMLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ04sRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLEtBQUssU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLEtBQUssU0FBUyxDQUFDO3dCQUMxRCxDQUFDLFVBQVUsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ2pELElBQUksQ0FBQzs0QkFDSCxNQUFNLEVBQUUsUUFBUSxDQUFDLHFCQUFxQjs0QkFDdEMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxxQkFBcUI7NEJBQ3ZDLFVBQVUsRUFBRSxJQUFJLEtBQUssRUFBRTs0QkFDdkIsSUFBSSxFQUFFLEdBQUc7eUJBQ1YsQ0FBQyxDQUFDO29CQUNMLENBQUM7Z0JBQ0gsQ0FBQztnQkFDRCxJQUFJLEVBQUUsQ0FBQztZQUNULENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFSCx5QkFBQztBQUFELENBdndDQSxBQXV3Q0MsSUFBQTtBQUFBLGlCQUFTLGtCQUFrQixDQUFDIiwiZmlsZSI6ImFwcC9hcHBsaWNhdGlvblByb2plY3QvaW50ZXJjZXB0b3IvcmVxdWVzdC92YWxpZGF0aW9uL1Byb2plY3RJbnRlcmNlcHRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBNZXNzYWdlcz1yZXF1aXJlKCcuLi8uLi8uLi9zaGFyZWQvbWVzc2FnZXMnKTtcclxuXHJcblxyXG5jbGFzcyBQcm9qZWN0SW50ZXJjZXB0b3Ige1xyXG4gIHB1YmxpYyBzdGF0aWMgdmFsaWRhdGVQcm9qZWN0SWQocHJvamVjdElkOiBzdHJpbmcsIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGlmICgocHJvamVjdElkID09PSB1bmRlZmluZWQpIHx8IChwcm9qZWN0SWQgPT09ICcnKSkge1xyXG4gICAgICBjYWxsYmFjayhudWxsLCBmYWxzZSk7XHJcbiAgICB9IGVsc2UgY2FsbGJhY2sobnVsbCwgdHJ1ZSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc3RhdGljIHZhbGlkYXRlSWRzKHByb2plY3RJZDogc3RyaW5nLCBidWlsZGluZ0lkOiBzdHJpbmcsIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGlmICgocHJvamVjdElkID09PSB1bmRlZmluZWQgfHwgYnVpbGRpbmdJZCA9PT0gdW5kZWZpbmVkKSB8fCAocHJvamVjdElkID09PSAnJyB8fCBidWlsZGluZ0lkID09PSAnJykpIHtcclxuICAgICAgY2FsbGJhY2sobnVsbCwgZmFsc2UpO1xyXG4gICAgfSBlbHNlIGNhbGxiYWNrKG51bGwsIHRydWUpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHN0YXRpYyB2YWxpZGF0ZUNvc3RIZWFkSWRzKHByb2plY3RJZDogc3RyaW5nLCBidWlsZGluZ0lkOiBzdHJpbmcsIGNvc3RIZWFkSWQ6IHN0cmluZywgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgaWYgKChwcm9qZWN0SWQgPT09IHVuZGVmaW5lZCB8fCBidWlsZGluZ0lkID09PSB1bmRlZmluZWQgfHwgY29zdEhlYWRJZCA9PT0gdW5kZWZpbmVkKSB8fCAocHJvamVjdElkID09PSAnJyB8fCBidWlsZGluZ0lkID09PSAnJyB8fCBjb3N0SGVhZElkID09PSAnJykpIHtcclxuICAgICAgY2FsbGJhY2sobnVsbCwgZmFsc2UpO1xyXG4gICAgfSBlbHNlIGNhbGxiYWNrKG51bGwsIHRydWUpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHN0YXRpYyB2YWxpZGF0ZVByb2plY3RDb3N0SGVhZElkcyhwcm9qZWN0SWQ6IHN0cmluZywgY29zdEhlYWRJZDogbnVtYmVyLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBpZiAoKHByb2plY3RJZCA9PT0gdW5kZWZpbmVkIHx8IGNvc3RIZWFkSWQgPT09IHVuZGVmaW5lZCkgfHwgKHByb2plY3RJZCA9PT0gJycgfHwgY29zdEhlYWRJZCA9PT0gbnVsbCkpIHtcclxuICAgICAgY2FsbGJhY2sobnVsbCwgZmFsc2UpO1xyXG4gICAgfSBlbHNlIGNhbGxiYWNrKG51bGwsIHRydWUpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHN0YXRpYyB2YWxpZGF0ZUlkc0ZvclVwZGF0ZVJhdGUocHJvamVjdElkOiBzdHJpbmcsIGJ1aWxkaW5nSWQ6IHN0cmluZywgY29zdEhlYWRJZDogbnVtYmVyLCBjYXRlZ29yeUlkOiBudW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd29ya0l0ZW1JZDogbnVtYmVyLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBpZiAoKHByb2plY3RJZCA9PT0gdW5kZWZpbmVkIHx8IGJ1aWxkaW5nSWQgPT09IHVuZGVmaW5lZCB8fCBjb3N0SGVhZElkID09PSB1bmRlZmluZWQgfHwgY2F0ZWdvcnlJZCA9PT0gdW5kZWZpbmVkIHx8XHJcbiAgICAgICAgd29ya0l0ZW1JZCA9PT0gdW5kZWZpbmVkKSB8fCAocHJvamVjdElkID09PSAnJyB8fCBidWlsZGluZ0lkID09PSAnJyB8fCBjb3N0SGVhZElkID09PSBudWxsIHx8IGNhdGVnb3J5SWQgPT09IG51bGwgfHxcclxuICAgICAgICB3b3JrSXRlbUlkID09PSBudWxsKSkge1xyXG4gICAgICBjYWxsYmFjayhudWxsLCBmYWxzZSk7XHJcbiAgICB9IGVsc2UgY2FsbGJhY2sobnVsbCwgdHJ1ZSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc3RhdGljIHZhbGlkYXRlQ2F0ZWdvcnlJZHMocHJvamVjdElkOiBzdHJpbmcsIGJ1aWxkaW5nSWQ6IHN0cmluZywgY29zdEhlYWRJZDogbnVtYmVyLCBjYXRlZ29yeUlkOiBudW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZVN0YXR1czogbnVtYmVyLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBpZiAoKHByb2plY3RJZCA9PT0gdW5kZWZpbmVkIHx8IGJ1aWxkaW5nSWQgPT09IHVuZGVmaW5lZCB8fCBjb3N0SGVhZElkID09PSB1bmRlZmluZWQgfHwgY2F0ZWdvcnlJZCA9PT0gdW5kZWZpbmVkIHx8XHJcbiAgICAgICAgYWN0aXZlU3RhdHVzID09PSB1bmRlZmluZWQpIHx8IChwcm9qZWN0SWQgPT09ICcnIHx8IGJ1aWxkaW5nSWQgPT09ICcnIHx8IGNvc3RIZWFkSWQgPT09IG51bGwgfHwgY2F0ZWdvcnlJZCA9PT0gbnVsbFxyXG4gICAgICAgIHx8IGFjdGl2ZVN0YXR1cyA9PT0gbnVsbCkpIHtcclxuICAgICAgY2FsbGJhY2sobnVsbCwgZmFsc2UpO1xyXG4gICAgfSBlbHNlIGNhbGxiYWNrKG51bGwsIHRydWUpO1xyXG4gIH1cclxuXHJcbiAgY3JlYXRlUHJvamVjdChyZXE6IGFueSwgcmVzOiBhbnksIG5leHQ6IGFueSkge1xyXG4gICAgaWYgKChyZXEuYm9keS5uYW1lID09PSB1bmRlZmluZWQpIHx8IChyZXEuYm9keS5yZWdpb24gPT09IHVuZGVmaW5lZCkgfHwgKHJlcS5ib2R5LnBsb3RBcmVhID09PSB1bmRlZmluZWQpIHx8IChyZXEuYm9keS5wbG90UGVyaXBoZXJ5ID09PSB1bmRlZmluZWQpIHx8XHJcbiAgICAgIChyZXEuYm9keS5wb2RpdW1BcmVhID09PSB1bmRlZmluZWQpIHx8IChyZXEuYm9keS5vcGVuU3BhY2UgPT09IHVuZGVmaW5lZCkgfHwgKHJlcS5ib2R5LnNsYWJBcmVhID09PSB1bmRlZmluZWQpIHx8IChyZXEuYm9keS5wb29sQ2FwYWNpdHkgPT09IHVuZGVmaW5lZCkgfHxcclxuICAgICAgKHJlcS5ib2R5LnByb2plY3REdXJhdGlvbiA9PT0gdW5kZWZpbmVkKSB8fCAocmVxLmJvZHkudG90YWxOdW1PZkJ1aWxkaW5ncyA9PT0gdW5kZWZpbmVkKSB8fFxyXG4gICAgICAocmVxLmJvZHkubmFtZSA9PT0gJycpIHx8IChyZXEuYm9keS5yZWdpb24gPT09ICcnKSB8fCAocmVxLmJvZHkucGxvdEFyZWEgPT09ICcnKSB8fFxyXG4gICAgICAocmVxLmJvZHkucGxvdFBlcmlwaGVyeSA9PT0gJycpIHx8IChyZXEuYm9keS5wb2RpdW1BcmVhID09PSAnJykgfHwgKHJlcS5ib2R5Lm9wZW5TcGFjZSA9PT0gJycpIHx8XHJcbiAgICAgIChyZXEuYm9keS5zbGFiQXJlYSA9PT0gJycpIHx8IChyZXEuYm9keS5wb29sQ2FwYWNpdHkgPT09ICcnKSB8fCAocmVxLmJvZHkucHJvamVjdER1cmF0aW9uID09PSAnJykgfHxcclxuICAgICAgKHJlcS5ib2R5LnRvdGFsTnVtT2ZCdWlsZGluZ3MgPT09ICcnKSkge1xyXG4gICAgICBuZXh0KHtcclxuICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgY29kZTogNDAwXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgbmV4dCgpO1xyXG4gIH1cclxuXHJcbiAgZ2V0UHJvamVjdEJ5SWQocmVxOiBhbnksIHJlczogYW55LCBuZXh0OiBhbnkpIHtcclxuICAgIHZhciBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgIFByb2plY3RJbnRlcmNlcHRvci52YWxpZGF0ZVByb2plY3RJZChwcm9qZWN0SWQsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5leHQoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRQcm9qZWN0UmF0ZUl0ZW1zQnlPcmlnaW5hbE5hbWUocmVxOiBhbnksIHJlczogYW55LCBuZXh0OiBhbnkpIHtcclxuICAgIHZhciBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgIHZhciBvcmlnaW5hbFJhdGVJdGVtTmFtZSA9IHJlcS5ib2R5Lm9yaWdpbmFsUmF0ZUl0ZW1OYW1lO1xyXG4gICAgUHJvamVjdEludGVyY2VwdG9yLnZhbGlkYXRlUHJvamVjdElkKHByb2plY3RJZCwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKChvcmlnaW5hbFJhdGVJdGVtTmFtZSA9PT0gdW5kZWZpbmVkKSB8fCAob3JpZ2luYWxSYXRlSXRlbU5hbWUgPT09ICcnKSkge1xyXG4gICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBuZXh0KCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlUHJvamVjdEJ5SWQocmVxOiBhbnksIHJlczogYW55LCBuZXh0OiBhbnkpIHtcclxuICAgIHZhciBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgIFByb2plY3RJbnRlcmNlcHRvci52YWxpZGF0ZVByb2plY3RJZChwcm9qZWN0SWQsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmICgocmVxLmJvZHkubmFtZSA9PT0gdW5kZWZpbmVkKSB8fCAocmVxLmJvZHkucmVnaW9uID09PSB1bmRlZmluZWQpIHx8IChyZXEuYm9keS5wbG90QXJlYSA9PT0gdW5kZWZpbmVkKSB8fFxyXG4gICAgICAgICAgICAocmVxLmJvZHkucGxvdFBlcmlwaGVyeSA9PT0gdW5kZWZpbmVkKSB8fCAocmVxLmJvZHkucG9kaXVtQXJlYSA9PT0gdW5kZWZpbmVkKSB8fCAocmVxLmJvZHkub3BlblNwYWNlID09PSB1bmRlZmluZWQpIHx8XHJcbiAgICAgICAgICAgIChyZXEuYm9keS5zbGFiQXJlYSA9PT0gdW5kZWZpbmVkKSB8fCAocmVxLmJvZHkucG9vbENhcGFjaXR5ID09PSB1bmRlZmluZWQpIHx8IChyZXEuYm9keS5wcm9qZWN0RHVyYXRpb24gPT09IHVuZGVmaW5lZCkgfHxcclxuICAgICAgICAgICAgKHJlcS5ib2R5LnRvdGFsTnVtT2ZCdWlsZGluZ3MgPT09IHVuZGVmaW5lZCkgfHwgKHJlcS5ib2R5Lm5hbWUgPT09ICcnKSB8fCAocmVxLmJvZHkucmVnaW9uID09PSAnJykgfHwgKHJlcS5ib2R5LnBsb3RBcmVhID09PSAnJykgfHxcclxuICAgICAgICAgICAgKHJlcS5ib2R5LnBsb3RQZXJpcGhlcnkgPT09ICcnKSB8fCAocmVxLmJvZHkucG9kaXVtQXJlYSA9PT0gJycpIHx8IChyZXEuYm9keS5vcGVuU3BhY2UgPT09ICcnKSB8fFxyXG4gICAgICAgICAgICAocmVxLmJvZHkuc2xhYkFyZWEgPT09ICcnKSB8fCAocmVxLmJvZHkucG9vbENhcGFjaXR5ID09PSB1bmRlZmluZWQpIHx8IChyZXEuYm9keS5wcm9qZWN0RHVyYXRpb24gPT09ICcnKSB8fCAocmVxLmJvZHkudG90YWxOdW1PZkJ1aWxkaW5ncyA9PT0gJycpKSB7XHJcbiAgICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5leHQoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBjcmVhdGVCdWlsZGluZyhyZXE6IGFueSwgcmVzOiBhbnksIG5leHQ6IGFueSkge1xyXG4gICAgdmFyIHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgUHJvamVjdEludGVyY2VwdG9yLnZhbGlkYXRlUHJvamVjdElkKHByb2plY3RJZCwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKChyZXEuYm9keS5uYW1lID09PSB1bmRlZmluZWQpIHx8IChyZXEuYm9keS50b3RhbFNsYWJBcmVhID09PSB1bmRlZmluZWQpIHx8IChyZXEuYm9keS50b3RhbENhcnBldEFyZWFPZlVuaXQgPT09IHVuZGVmaW5lZCkgfHxcclxuICAgICAgICAgICAgKHJlcS5ib2R5LnRvdGFsU2FsZWFibGVBcmVhT2ZVbml0ID09PSB1bmRlZmluZWQpIHx8IChyZXEuYm9keS5wbGludGhBcmVhID09PSB1bmRlZmluZWQpIHx8IChyZXEuYm9keS50b3RhbE51bU9mRmxvb3JzID09PSB1bmRlZmluZWQpIHx8XHJcbiAgICAgICAgICAgIChyZXEuYm9keS5udW1PZlBhcmtpbmdGbG9vcnMgPT09IHVuZGVmaW5lZCkgfHwgKHJlcS5ib2R5LmNhcnBldEFyZWFPZlBhcmtpbmcgPT09IHVuZGVmaW5lZCkgfHwgKHJlcS5ib2R5Lm5hbWUgPT09ICcnKSB8fFxyXG4gICAgICAgICAgICAocmVxLmJvZHkudG90YWxTbGFiQXJlYSA9PT0gJycpIHx8IChyZXEuYm9keS50b3RhbENhcnBldEFyZWFPZlVuaXQgPT09ICcnKSB8fCAocmVxLmJvZHkudG90YWxTYWxlYWJsZUFyZWFPZlVuaXQgPT09ICcnKSB8fFxyXG4gICAgICAgICAgICAocmVxLmJvZHkucGxpbnRoQXJlYSA9PT0gJycpIHx8IChyZXEuYm9keS50b3RhbE51bU9mRmxvb3JzID09PSAnJykgfHwgKHJlcS5ib2R5Lm51bU9mUGFya2luZ0Zsb29ycyA9PT0gJycpIHx8IChyZXEuYm9keS5jYXJwZXRBcmVhT2ZQYXJraW5nID09PSAnJykpIHtcclxuICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgbmV4dCgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldEJ1aWxkaW5nQnlJZChyZXE6IGFueSwgcmVzOiBhbnksIG5leHQ6IGFueSkge1xyXG4gICAgdmFyIHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgdmFyIGJ1aWxkaW5nSWQgPSByZXEucGFyYW1zLmJ1aWxkaW5nSWQ7XHJcbiAgICBQcm9qZWN0SW50ZXJjZXB0b3IudmFsaWRhdGVJZHMocHJvamVjdElkLCBidWlsZGluZ0lkLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAocmVzdWx0ID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBuZXh0KCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlQnVpbGRpbmdCeUlkKHJlcTogYW55LCByZXM6IGFueSwgbmV4dDogYW55KSB7XHJcbiAgICB2YXIgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICB2YXIgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgIFByb2plY3RJbnRlcmNlcHRvci52YWxpZGF0ZUlkcyhwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmICgocmVxLmJvZHkubmFtZSA9PT0gdW5kZWZpbmVkKSB8fCAocmVxLmJvZHkudG90YWxTbGFiQXJlYSA9PT0gdW5kZWZpbmVkKSB8fCAocmVxLmJvZHkudG90YWxDYXJwZXRBcmVhT2ZVbml0ID09PSB1bmRlZmluZWQpIHx8IChyZXEuYm9keS50b3RhbFNhbGVhYmxlQXJlYU9mVW5pdCA9PT0gdW5kZWZpbmVkKSB8fFxyXG4gICAgICAgICAgICAocmVxLmJvZHkucGxpbnRoQXJlYSA9PT0gdW5kZWZpbmVkKSB8fCAocmVxLmJvZHkudG90YWxOdW1PZkZsb29ycyA9PT0gdW5kZWZpbmVkKSB8fCAocmVxLmJvZHkubnVtT2ZQYXJraW5nRmxvb3JzID09PSB1bmRlZmluZWQpIHx8IChyZXEuYm9keS5jYXJwZXRBcmVhT2ZQYXJraW5nID09PSB1bmRlZmluZWQpIHx8XHJcbiAgICAgICAgICAgIChyZXEuYm9keS5uYW1lID09PSAnJykgfHwgKHJlcS5ib2R5LnRvdGFsU2xhYkFyZWEgPT09ICcnKSB8fCAocmVxLmJvZHkudG90YWxDYXJwZXRBcmVhT2ZVbml0ID09PSAnJykgfHwgKHJlcS5ib2R5LnRvdGFsU2FsZWFibGVBcmVhT2ZVbml0ID09PSAnJykgfHxcclxuICAgICAgICAgICAgKHJlcS5ib2R5LnBsaW50aEFyZWEgPT09ICcnKSB8fCAocmVxLmJvZHkudG90YWxOdW1PZkZsb29ycyA9PT0gJycpIHx8IChyZXEuYm9keS5udW1PZlBhcmtpbmdGbG9vcnMgPT09ICcnKSB8fCAocmVxLmJvZHkuY2FycGV0QXJlYU9mUGFya2luZyA9PT0gJycpKSB7XHJcbiAgICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5leHQoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBkZWxldGVCdWlsZGluZ0J5SWQocmVxOiBhbnksIHJlczogYW55LCBuZXh0OiBhbnkpIHtcclxuICAgIHZhciBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgIHZhciBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgUHJvamVjdEludGVyY2VwdG9yLnZhbGlkYXRlSWRzKHByb2plY3RJZCwgYnVpbGRpbmdJZCwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbmV4dCgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldEJ1aWxkaW5nQnlJZEZvckNsb25lKHJlcTogYW55LCByZXM6IGFueSwgbmV4dDogYW55KSB7XHJcbiAgICB2YXIgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICB2YXIgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgIFByb2plY3RJbnRlcmNlcHRvci52YWxpZGF0ZUlkcyhwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5leHQoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBjbG9uZUJ1aWxkaW5nKHJlcTogYW55LCByZXM6IGFueSwgbmV4dDogYW55KSB7XHJcbiAgICB2YXIgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICB2YXIgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgIFByb2plY3RJbnRlcmNlcHRvci52YWxpZGF0ZUlkcyhwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmICgocmVxLmJvZHkubmFtZSA9PT0gdW5kZWZpbmVkKSB8fCAocmVxLmJvZHkudG90YWxTbGFiQXJlYSA9PT0gdW5kZWZpbmVkKSB8fCAocmVxLmJvZHkudG90YWxDYXJwZXRBcmVhT2ZVbml0ID09PSB1bmRlZmluZWQpIHx8IChyZXEuYm9keS50b3RhbFNhbGVhYmxlQXJlYU9mVW5pdCA9PT0gdW5kZWZpbmVkKSB8fFxyXG4gICAgICAgICAgICAgKHJlcS5ib2R5LnBsaW50aEFyZWEgPT09IHVuZGVmaW5lZCkgfHwgKHJlcS5ib2R5LnRvdGFsTnVtT2ZGbG9vcnMgPT09IHVuZGVmaW5lZCkgfHwgKHJlcS5ib2R5Lm51bU9mUGFya2luZ0Zsb29ycyA9PT0gdW5kZWZpbmVkKSB8fCAocmVxLmJvZHkuY2FycGV0QXJlYU9mUGFya2luZyA9PT0gdW5kZWZpbmVkKSB8fFxyXG4gICAgICAgICAgICAocmVxLmJvZHkubmFtZSA9PT0gJycpIHx8IChyZXEuYm9keS50b3RhbFNsYWJBcmVhID09PSAnJykgfHwgKHJlcS5ib2R5LnRvdGFsQ2FycGV0QXJlYU9mVW5pdCA9PT0gJycpIHx8IChyZXEuYm9keS50b3RhbFNhbGVhYmxlQXJlYU9mVW5pdCA9PT0gJycpIHx8XHJcbiAgICAgICAgICAgIChyZXEuYm9keS5wbGludGhBcmVhID09PSAnJykgfHwgKHJlcS5ib2R5LnRvdGFsTnVtT2ZGbG9vcnMgPT09ICcnKSB8fCAocmVxLmJvZHkubnVtT2ZQYXJraW5nRmxvb3JzID09PSAnJykgfHwgKHJlcS5ib2R5LmNhcnBldEFyZWFPZlBhcmtpbmcgPT09ICcnKSkge1xyXG4gICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBuZXh0KCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0Q2F0ZWdvcmllc09mUHJvamVjdENvc3RIZWFkKHJlcTogYW55LCByZXM6IGFueSwgbmV4dDogYW55KSB7XHJcbiAgICB2YXIgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICB2YXIgY29zdEhlYWRJZCA9IHJlcS5wYXJhbXMuY29zdEhlYWRJZDtcclxuICAgIFByb2plY3RJbnRlcmNlcHRvci52YWxpZGF0ZVByb2plY3RDb3N0SGVhZElkcyhwcm9qZWN0SWQsIGNvc3RIZWFkSWQsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5leHQoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRXb3JrSXRlbUxpc3RPZlByb2plY3RDYXRlZ29yeShyZXE6IGFueSwgcmVzOiBhbnksIG5leHQ6IGFueSkge1xyXG4gICAgdmFyIHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgdmFyIGNvc3RIZWFkSWQgPSByZXEucGFyYW1zLmNvc3RIZWFkSWQ7XHJcbiAgICBQcm9qZWN0SW50ZXJjZXB0b3IudmFsaWRhdGVQcm9qZWN0Q29zdEhlYWRJZHMocHJvamVjdElkLCBjb3N0SGVhZElkLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAocmVzdWx0ID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpZiAoKHJlcS5wYXJhbXMuY2F0ZWdvcnlJZCA9PT0gdW5kZWZpbmVkKSB8fCAocmVxLnBhcmFtcy5jYXRlZ29yeUlkID09PSAnJykpIHtcclxuICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgbmV4dCgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHNldENvc3RIZWFkU3RhdHVzKHJlcTogYW55LCByZXM6IGFueSwgbmV4dDogYW55KSB7XHJcbiAgICB2YXIgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICB2YXIgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgIHZhciBjb3N0SGVhZElkID0gcmVxLnBhcmFtcy5jb3N0SGVhZElkO1xyXG4gICAgUHJvamVjdEludGVyY2VwdG9yLnZhbGlkYXRlQ29zdEhlYWRJZHMocHJvamVjdElkLCBidWlsZGluZ0lkLCBjb3N0SGVhZElkLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAocmVzdWx0ID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpZiAoKHJlcS5wYXJhbXMuYWN0aXZlU3RhdHVzID09PSB1bmRlZmluZWQpIHx8IChyZXEucGFyYW1zLmFjdGl2ZVN0YXR1cyA9PT0gJycpKSB7XHJcbiAgICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5leHQoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRJbkFjdGl2ZUNvc3RIZWFkKHJlcTogYW55LCByZXM6IGFueSwgbmV4dDogYW55KSB7XHJcbiAgICB2YXIgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICB2YXIgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgIFByb2plY3RJbnRlcmNlcHRvci52YWxpZGF0ZUlkcyhwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5leHQoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVCdWRnZXRlZENvc3RGb3JCdWlsZGluZ0Nvc3RIZWFkKHJlcTogYW55LCByZXM6IGFueSwgbmV4dDogYW55KSB7XHJcbiAgICB2YXIgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICB2YXIgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgIFByb2plY3RJbnRlcmNlcHRvci52YWxpZGF0ZUlkcyhwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmICgocmVxLmJvZHkuYnVkZ2V0ZWRDb3N0QW1vdW50ID09PSB1bmRlZmluZWQpIHx8IChyZXEuYm9keS5jb3N0SGVhZCA9PT0gdW5kZWZpbmVkKSB8fFxyXG4gICAgICAgICAgICAocmVxLmJvZHkuYnVkZ2V0ZWRDb3N0QW1vdW50ID09PSAnJykgfHwgKHJlcS5ib2R5LmNvc3RIZWFkID09PSAnJykpIHtcclxuICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgbmV4dCgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZUJ1ZGdldGVkQ29zdEZvclByb2plY3RDb3N0SGVhZChyZXE6IGFueSwgcmVzOiBhbnksIG5leHQ6IGFueSkge1xyXG4gICAgdmFyIHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgaWYgKChwcm9qZWN0SWQgPT09IHVuZGVmaW5lZCkgfHwgKHByb2plY3RJZCA9PT0gJycpIHx8IChyZXEuYm9keS5idWRnZXRlZENvc3RBbW91bnQgPT09IHVuZGVmaW5lZCkgfHxcclxuICAgICAgKHJlcS5ib2R5LmNvc3RIZWFkID09PSB1bmRlZmluZWQpIHx8IChyZXEuYm9keS5idWRnZXRlZENvc3RBbW91bnQgPT09ICcnKSB8fCAocmVxLmJvZHkuY29zdEhlYWQgPT09ICcnKSkge1xyXG4gICAgICBuZXh0KHtcclxuICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgY29kZTogNDAwXHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbmV4dCgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0Q2F0ZWdvcmllc09mQnVpbGRpbmdDb3N0SGVhZChyZXE6IGFueSwgcmVzOiBhbnksIG5leHQ6IGFueSkge1xyXG4gICAgdmFyIHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgdmFyIGJ1aWxkaW5nSWQgPSByZXEucGFyYW1zLmJ1aWxkaW5nSWQ7XHJcbiAgICB2YXIgY29zdEhlYWRJZCA9IHJlcS5wYXJhbXMuY29zdEhlYWRJZDtcclxuICAgIFByb2plY3RJbnRlcmNlcHRvci52YWxpZGF0ZUNvc3RIZWFkSWRzKHByb2plY3RJZCwgYnVpbGRpbmdJZCwgY29zdEhlYWRJZCwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbmV4dCgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldEluQWN0aXZlQ2F0ZWdvcmllc0J5Q29zdEhlYWRJZChyZXE6IGFueSwgcmVzOiBhbnksIG5leHQ6IGFueSkge1xyXG4gICAgdmFyIHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgdmFyIGJ1aWxkaW5nSWQgPSByZXEucGFyYW1zLmJ1aWxkaW5nSWQ7XHJcbiAgICB2YXIgY29zdEhlYWRJZCA9IHJlcS5wYXJhbXMuY29zdEhlYWRJZDtcclxuICAgIFByb2plY3RJbnRlcmNlcHRvci52YWxpZGF0ZUNvc3RIZWFkSWRzKHByb2plY3RJZCwgYnVpbGRpbmdJZCwgY29zdEhlYWRJZCwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbmV4dCgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldEFsbENhdGVnb3JpZXNCeUNvc3RIZWFkSWQocmVxOiBhbnksIHJlczogYW55LCBuZXh0OiBhbnkpIHtcclxuICAgIHZhciBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgIHZhciBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgdmFyIGNvc3RIZWFkSWQgPSByZXEucGFyYW1zLmNvc3RIZWFkSWQ7XHJcbiAgICBQcm9qZWN0SW50ZXJjZXB0b3IudmFsaWRhdGVDb3N0SGVhZElkcyhwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIGNvc3RIZWFkSWQsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5leHQoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVDYXRlZ29yeVN0YXR1cyhyZXE6IGFueSwgcmVzOiBhbnksIG5leHQ6IGFueSkge1xyXG4gICAgdmFyIHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgdmFyIGJ1aWxkaW5nSWQgPSByZXEucGFyYW1zLmJ1aWxkaW5nSWQ7XHJcbiAgICB2YXIgY29zdEhlYWRJZCA9IHJlcS5wYXJhbXMuY29zdEhlYWRJZDtcclxuICAgIHZhciBjYXRlZ29yeUlkID0gcmVxLnBhcmFtcy5jYXRlZ29yeUlkO1xyXG4gICAgdmFyIGFjdGl2ZVN0YXR1cyA9IHJlcS5wYXJhbXMuYWN0aXZlU3RhdHVzO1xyXG4gICAgUHJvamVjdEludGVyY2VwdG9yLnZhbGlkYXRlQ2F0ZWdvcnlJZHMocHJvamVjdElkLCBidWlsZGluZ0lkLCBjb3N0SGVhZElkLCBjYXRlZ29yeUlkLCBhY3RpdmVTdGF0dXMsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5leHQoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBhZGRDYXRlZ29yeUJ5Q29zdEhlYWRJZChyZXE6IGFueSwgcmVzOiBhbnksIG5leHQ6IGFueSkge1xyXG4gICAgdmFyIHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgdmFyIGJ1aWxkaW5nSWQgPSByZXEucGFyYW1zLmJ1aWxkaW5nSWQ7XHJcbiAgICB2YXIgY29zdEhlYWRJZCA9IHJlcS5wYXJhbXMuY29zdEhlYWRJZDtcclxuICAgIFByb2plY3RJbnRlcmNlcHRvci52YWxpZGF0ZUNvc3RIZWFkSWRzKHByb2plY3RJZCwgYnVpbGRpbmdJZCwgY29zdEhlYWRJZCwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKChyZXEuYm9keS5jYXRlZ29yeSA9PT0gdW5kZWZpbmVkKSB8fCAocmVxLmJvZHkuY2F0ZWdvcnlJZCA9PT0gdW5kZWZpbmVkKSB8fFxyXG4gICAgICAgICAgICAocmVxLmJvZHkuY2F0ZWdvcnkgPT09ICcnKSB8fCAocmVxLmJvZHkuY2F0ZWdvcnlJZCA9PT0gJycpKSB7XHJcbiAgICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5leHQoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBkZWxldGVDYXRlZ29yeUZyb21Db3N0SGVhZChyZXE6IGFueSwgcmVzOiBhbnksIG5leHQ6IGFueSkge1xyXG4gICAgdmFyIHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgdmFyIGJ1aWxkaW5nSWQgPSByZXEucGFyYW1zLmJ1aWxkaW5nSWQ7XHJcbiAgICB2YXIgY29zdEhlYWRJZCA9IHJlcS5wYXJhbXMuY29zdEhlYWRJZDtcclxuICAgIFByb2plY3RJbnRlcmNlcHRvci52YWxpZGF0ZUNvc3RIZWFkSWRzKHByb2plY3RJZCwgYnVpbGRpbmdJZCwgY29zdEhlYWRJZCwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKChyZXEuYm9keS5uYW1lID09PSB1bmRlZmluZWQpIHx8IChyZXEuYm9keS5yYXRlQW5hbHlzaXNJZCA9PT0gdW5kZWZpbmVkKSB8fFxyXG4gICAgICAgICAgICAocmVxLmJvZHkubmFtZSA9PT0gJycpIHx8IChyZXEuYm9keS5yYXRlQW5hbHlzaXNJZCA9PT0gJycpKSB7XHJcbiAgICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5leHQoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVXb3JrSXRlbVN0YXR1c09mQnVpbGRpbmdDb3N0SGVhZHMocmVxOiBhbnksIHJlczogYW55LCBuZXh0OiBhbnkpIHtcclxuICAgIHZhciBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgIHZhciBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgdmFyIGNvc3RIZWFkSWQgPSByZXEucGFyYW1zLmNvc3RIZWFkSWQ7XHJcbiAgICBQcm9qZWN0SW50ZXJjZXB0b3IudmFsaWRhdGVDb3N0SGVhZElkcyhwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIGNvc3RIZWFkSWQsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmICgocmVxLnBhcmFtcy53b3JrSXRlbUlkID09PSB1bmRlZmluZWQpIHx8IChyZXEucGFyYW1zLndvcmtJdGVtSWQgPT09ICcnKSB8fFxyXG4gICAgICAgICAgICAocmVxLnBhcmFtcy5hY3RpdmVTdGF0dXMgPT09IHVuZGVmaW5lZCkgfHwgKHJlcS5wYXJhbXMuYWN0aXZlU3RhdHVzID09PSAnJykpIHtcclxuICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgbmV4dCgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZVdvcmtJdGVtU3RhdHVzT2ZQcm9qZWN0Q29zdEhlYWRzKHJlcTogYW55LCByZXM6IGFueSwgbmV4dDogYW55KSB7XHJcbiAgICB2YXIgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICB2YXIgY29zdEhlYWRJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY29zdEhlYWRJZCk7XHJcbiAgICB2YXIgY2F0ZWdvcnlJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY2F0ZWdvcnkpO1xyXG4gICAgdmFyIHdvcmtJdGVtSWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNvc3RIZWFkSWQpO1xyXG4gICAgUHJvamVjdEludGVyY2VwdG9yLnZhbGlkYXRlUHJvamVjdENvc3RIZWFkSWRzKHByb2plY3RJZCwgY29zdEhlYWRJZCwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKChjYXRlZ29yeUlkID09PSB1bmRlZmluZWQpIHx8IChjYXRlZ29yeUlkID09PSBudWxsKSB8fFxyXG4gICAgICAgICAgICAod29ya0l0ZW1JZCA9PT0gdW5kZWZpbmVkKSB8fCAod29ya0l0ZW1JZCA9PT0gbnVsbCkgfHxcclxuICAgICAgICAgICAgKHJlcS5wYXJhbXMuYWN0aXZlU3RhdHVzID09PSB1bmRlZmluZWQpIHx8IChyZXEucGFyYW1zLmFjdGl2ZVN0YXR1cyA9PT0gJycpKSB7XHJcbiAgICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5leHQoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRJbkFjdGl2ZVdvcmtJdGVtc09mQnVpbGRpbmdDb3N0SGVhZHMocmVxOiBhbnksIHJlczogYW55LCBuZXh0OiBhbnkpIHtcclxuICAgIHZhciBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgIHZhciBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgdmFyIGNvc3RIZWFkSWQgPSByZXEucGFyYW1zLmNvc3RIZWFkSWQ7XHJcbiAgICBQcm9qZWN0SW50ZXJjZXB0b3IudmFsaWRhdGVDb3N0SGVhZElkcyhwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIGNvc3RIZWFkSWQsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmICgocmVxLnBhcmFtcy5jYXRlZ29yeUlkID09PSB1bmRlZmluZWQpIHx8IChyZXEucGFyYW1zLmNhdGVnb3J5SWQgPT09ICcnKSkge1xyXG4gICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBuZXh0KCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0V29ya0l0ZW1MaXN0T2ZCdWlsZGluZ0NhdGVnb3J5KHJlcTogYW55LCByZXM6IGFueSwgbmV4dDogYW55KSB7XHJcbiAgICB2YXIgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICB2YXIgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgIHZhciBjb3N0SGVhZElkID0gcmVxLnBhcmFtcy5jb3N0SGVhZElkO1xyXG4gICAgUHJvamVjdEludGVyY2VwdG9yLnZhbGlkYXRlQ29zdEhlYWRJZHMocHJvamVjdElkLCBidWlsZGluZ0lkLCBjb3N0SGVhZElkLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAocmVzdWx0ID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpZiAoKHJlcS5wYXJhbXMuY2F0ZWdvcnlJZCA9PT0gdW5kZWZpbmVkKSB8fCAocmVxLnBhcmFtcy5jYXRlZ29yeUlkID09PSAnJykpIHtcclxuICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgbmV4dCgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldEluQWN0aXZlV29ya0l0ZW1zT2ZQcm9qZWN0Q29zdEhlYWRzKHJlcTogYW55LCByZXM6IGFueSwgbmV4dDogYW55KSB7XHJcbiAgICB2YXIgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICB2YXIgY29zdEhlYWRJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY29zdEhlYWRJZCk7XHJcbiAgICBsZXQgY2F0ZWdvcnlJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY2F0ZWdvcnlJZCk7XHJcbiAgICBQcm9qZWN0SW50ZXJjZXB0b3IudmFsaWRhdGVQcm9qZWN0Q29zdEhlYWRJZHMocHJvamVjdElkLCBjb3N0SGVhZElkLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAocmVzdWx0ID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpZiAoKGNhdGVnb3J5SWQgPT09IHVuZGVmaW5lZCkgfHwgKGNhdGVnb3J5SWQgPT09IG51bGwpKSB7XHJcbiAgICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5leHQoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRSYXRlKHJlcTogYW55LCByZXM6IGFueSwgbmV4dDogYW55KSB7XHJcbiAgICB2YXIgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICB2YXIgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgIHZhciBjb3N0SGVhZElkID0gcmVxLnBhcmFtcy5jb3N0SGVhZElkO1xyXG4gICAgUHJvamVjdEludGVyY2VwdG9yLnZhbGlkYXRlQ29zdEhlYWRJZHMocHJvamVjdElkLCBidWlsZGluZ0lkLCBjb3N0SGVhZElkLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAocmVzdWx0ID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpZiAoKHJlcS5wYXJhbXMuY2F0ZWdvcnlJZCA9PT0gdW5kZWZpbmVkKSB8fCAocmVxLnBhcmFtcy53b3JrSXRlbUlkID09PSB1bmRlZmluZWQpIHx8XHJcbiAgICAgICAgICAgIChyZXEucGFyYW1zLmNhdGVnb3J5SWQgPT09ICcnKSB8fCAocmVxLnBhcmFtcy53b3JrSXRlbUlkID09PSAnJykpIHtcclxuICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgbmV4dCgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZVF1YW50aXR5T2ZCdWlsZGluZ0Nvc3RIZWFkcyhyZXE6IGFueSwgcmVzOiBhbnksIG5leHQ6IGFueSkge1xyXG4gICAgdmFyIHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgdmFyIGJ1aWxkaW5nSWQgPSByZXEucGFyYW1zLmJ1aWxkaW5nSWQ7XHJcbiAgICB2YXIgY29zdEhlYWRJZCA9IHJlcS5wYXJhbXMuY29zdEhlYWRJZDtcclxuICAgIHZhciBxdWFudGl0eURldGFpbHMgPSByZXEuYm9keS5pdGVtO1xyXG4gICAgUHJvamVjdEludGVyY2VwdG9yLnZhbGlkYXRlQ29zdEhlYWRJZHMocHJvamVjdElkLCBidWlsZGluZ0lkLCBjb3N0SGVhZElkLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAocmVzdWx0ID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpZiAoKHJlcS5wYXJhbXMuY2F0ZWdvcnlJZCA9PT0gdW5kZWZpbmVkKSB8fCAocmVxLnBhcmFtcy53b3JrSXRlbUlkID09PSB1bmRlZmluZWQpIHx8IChxdWFudGl0eURldGFpbHMgPT09IHVuZGVmaW5lZCkgfHxcclxuICAgICAgICAgICAgKHF1YW50aXR5RGV0YWlscy5uYW1lID09PSB1bmRlZmluZWQpIHx8IChxdWFudGl0eURldGFpbHMubmFtZSA9PT0gJycpIHx8XHJcbiAgICAgICAgICAgIChyZXEucGFyYW1zLmNhdGVnb3J5SWQgPT09ICcnKSB8fCAocmVxLnBhcmFtcy53b3JrSXRlbUlkID09PSAnJykgfHwgKHF1YW50aXR5RGV0YWlscyA9PT0gJycpKSB7XHJcbiAgICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5leHQoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVEaXJlY3RRdWFudGl0eU9mQnVpbGRpbmdDb3N0SGVhZHMocmVxOiBhbnksIHJlczogYW55LCBuZXh0OiBhbnkpIHtcclxuICAgIHZhciBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgIHZhciBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgdmFyIGNvc3RIZWFkSWQgPSByZXEucGFyYW1zLmNvc3RIZWFkSWQ7XHJcbiAgICB2YXIgZGlyZWN0UXVhbnRpdHkgPSByZXEuYm9keS5kaXJlY3RRdWFudGl0eTtcclxuICAgIFByb2plY3RJbnRlcmNlcHRvci52YWxpZGF0ZUNvc3RIZWFkSWRzKHByb2plY3RJZCwgYnVpbGRpbmdJZCwgY29zdEhlYWRJZCwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKChyZXEucGFyYW1zLmNhdGVnb3J5SWQgPT09IHVuZGVmaW5lZCkgfHwgKHJlcS5wYXJhbXMud29ya0l0ZW1JZCA9PT0gdW5kZWZpbmVkKSB8fCAoZGlyZWN0UXVhbnRpdHkgPT09IHVuZGVmaW5lZCkgfHxcclxuICAgICAgICAgICAgKHJlcS5wYXJhbXMuY2F0ZWdvcnlJZCA9PT0gJycpIHx8IChyZXEucGFyYW1zLndvcmtJdGVtSWQgPT09ICcnKSB8fCAoZGlyZWN0UXVhbnRpdHkgPT09ICcnKSkge1xyXG4gICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBuZXh0KCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlRGlyZWN0UXVhbnRpdHlPZlByb2plY3RXb3JrSXRlbXMocmVxOiBhbnksIHJlczogYW55LCBuZXh0OiBhbnkpIHtcclxuICAgIHZhciBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgIHZhciBjb3N0SGVhZElkID0gcmVxLnBhcmFtcy5jb3N0SGVhZElkO1xyXG4gICAgdmFyIGRpcmVjdFF1YW50aXR5ID0gcmVxLmJvZHkuZGlyZWN0UXVhbnRpdHk7XHJcbiAgICBQcm9qZWN0SW50ZXJjZXB0b3IudmFsaWRhdGVQcm9qZWN0Q29zdEhlYWRJZHMocHJvamVjdElkLCBjb3N0SGVhZElkLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAocmVzdWx0ID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpZiAoKHJlcS5wYXJhbXMuY2F0ZWdvcnlJZCA9PT0gdW5kZWZpbmVkKSB8fCAocmVxLnBhcmFtcy53b3JrSXRlbUlkID09PSB1bmRlZmluZWQpIHx8IChkaXJlY3RRdWFudGl0eSA9PT0gdW5kZWZpbmVkKSB8fFxyXG4gICAgICAgICAgICAocmVxLnBhcmFtcy5jYXRlZ29yeUlkID09PSAnJykgfHwgKHJlcS5wYXJhbXMud29ya0l0ZW1JZCA9PT0gJycpIHx8IChkaXJlY3RRdWFudGl0eSA9PT0gJycpKSB7XHJcbiAgICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5leHQoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVRdWFudGl0eU9mUHJvamVjdENvc3RIZWFkcyhyZXE6IGFueSwgcmVzOiBhbnksIG5leHQ6IGFueSkge1xyXG4gICAgdmFyIHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgdmFyIGNvc3RIZWFkSWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNvc3RIZWFkSWQpO1xyXG4gICAgdmFyIGNhdGVnb3J5SWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNhdGVnb3J5SWQpO1xyXG4gICAgdmFyIHdvcmtJdGVtSWQgPSBwYXJzZUludChyZXEucGFyYW1zLndvcmtJdGVtSWQpO1xyXG4gICAgdmFyIHF1YW50aXR5RGV0YWlscyA9IHJlcS5ib2R5Lml0ZW07XHJcbiAgICBQcm9qZWN0SW50ZXJjZXB0b3IudmFsaWRhdGVQcm9qZWN0Q29zdEhlYWRJZHMocHJvamVjdElkLCBjb3N0SGVhZElkLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAocmVzdWx0ID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpZiAoKGNhdGVnb3J5SWQgPT09IHVuZGVmaW5lZCkgfHwgKHdvcmtJdGVtSWQgPT09IHVuZGVmaW5lZCkgfHwgKHF1YW50aXR5RGV0YWlscyA9PT0gdW5kZWZpbmVkKSB8fFxyXG4gICAgICAgICAgICAoY2F0ZWdvcnlJZCA9PT0gbnVsbCkgfHwgKHdvcmtJdGVtSWQgPT09IG51bGwpIHx8IChxdWFudGl0eURldGFpbHMgPT09ICcnKSkge1xyXG4gICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBuZXh0KCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZGVsZXRlUXVhbnRpdHlPZkJ1aWxkaW5nQ29zdEhlYWRzQnlOYW1lKHJlcTogYW55LCByZXM6IGFueSwgbmV4dDogYW55KSB7XHJcbiAgICB2YXIgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICB2YXIgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgIHZhciBjb3N0SGVhZElkID0gcmVxLnBhcmFtcy5jb3N0SGVhZElkO1xyXG4gICAgdmFyIGl0ZW1OYW1lID0gcmVxLmJvZHkuaXRlbS5uYW1lO1xyXG4gICAgUHJvamVjdEludGVyY2VwdG9yLnZhbGlkYXRlQ29zdEhlYWRJZHMocHJvamVjdElkLCBidWlsZGluZ0lkLCBjb3N0SGVhZElkLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAocmVzdWx0ID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpZiAoKHJlcS5wYXJhbXMuY2F0ZWdvcnlJZCA9PT0gdW5kZWZpbmVkKSB8fCAocmVxLnBhcmFtcy53b3JrSXRlbUlkID09PSB1bmRlZmluZWQpIHx8IChpdGVtTmFtZSA9PT0gdW5kZWZpbmVkKSB8fFxyXG4gICAgICAgICAgICAocmVxLnBhcmFtcy5jYXRlZ29yeUlkID09PSAnJykgfHwgKHJlcS5wYXJhbXMud29ya0l0ZW1JZCA9PT0gJycpIHx8IChpdGVtTmFtZSA9PT0gJycpKSB7XHJcbiAgICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5leHQoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBkZWxldGVRdWFudGl0eU9mUHJvamVjdENvc3RIZWFkc0J5TmFtZShyZXE6IGFueSwgcmVzOiBhbnksIG5leHQ6IGFueSkge1xyXG4gICAgdmFyIHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgdmFyIGNvc3RIZWFkSWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNvc3RIZWFkSWQpO1xyXG4gICAgdmFyIGNhdGVnb3J5SWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNvc3RIZWFkSWQpO1xyXG4gICAgdmFyIHdvcmtJdGVtSWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNvc3RIZWFkSWQpO1xyXG4gICAgdmFyIGl0ZW1OYW1lID0gcmVxLmJvZHkuaXRlbTtcclxuXHJcbiAgICBQcm9qZWN0SW50ZXJjZXB0b3IudmFsaWRhdGVQcm9qZWN0Q29zdEhlYWRJZHMocHJvamVjdElkLCBjb3N0SGVhZElkLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAocmVzdWx0ID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpZiAoKGNhdGVnb3J5SWQgPT09IHVuZGVmaW5lZCkgfHwgKHdvcmtJdGVtSWQgPT09IHVuZGVmaW5lZCkgfHwgKGl0ZW1OYW1lID09PSB1bmRlZmluZWQpIHx8XHJcbiAgICAgICAgICAgIChjYXRlZ29yeUlkID09PSBudWxsKSB8fCAod29ya0l0ZW1JZCA9PT0gbnVsbCkgfHwgKGl0ZW1OYW1lID09PSAnJykpIHtcclxuICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgbmV4dCgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZURpcmVjdFJhdGVPZkJ1aWxkaW5nV29ya0l0ZW1zKHJlcTogYW55LCByZXM6IGFueSwgbmV4dDogYW55KSB7XHJcbiAgICB2YXIgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICB2YXIgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgIHZhciBjb3N0SGVhZElkID0gcmVxLnBhcmFtcy5jb3N0SGVhZElkO1xyXG4gICAgdmFyIGNhdGVnb3J5SWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNhdGVnb3J5SWQpO1xyXG4gICAgdmFyIHdvcmtJdGVtSWQgPSBwYXJzZUludChyZXEucGFyYW1zLndvcmtJdGVtSWQpO1xyXG4gICAgdmFyIGRpcmVjdFJhdGUgPSByZXEuYm9keS5kaXJlY3RSYXRlO1xyXG5cclxuICAgIFByb2plY3RJbnRlcmNlcHRvci52YWxpZGF0ZUNvc3RIZWFkSWRzKHByb2plY3RJZCwgYnVpbGRpbmdJZCwgY29zdEhlYWRJZCwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKChjYXRlZ29yeUlkID09PSB1bmRlZmluZWQpIHx8ICh3b3JrSXRlbUlkID09PSB1bmRlZmluZWQpIHx8IChkaXJlY3RSYXRlID09PSB1bmRlZmluZWQpIHx8XHJcbiAgICAgICAgICAgIChjYXRlZ29yeUlkID09PSBudWxsKSB8fCAod29ya0l0ZW1JZCA9PT0gbnVsbCkgfHwgKGRpcmVjdFJhdGUgPT09ICcnKSkge1xyXG4gICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBuZXh0KCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlUmF0ZU9mQnVpbGRpbmdDb3N0SGVhZHMocmVxOiBhbnksIHJlczogYW55LCBuZXh0OiBhbnkpIHtcclxuICAgIHZhciBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgIHZhciBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgdmFyIGNvc3RIZWFkSWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNvc3RIZWFkSWQpO1xyXG4gICAgdmFyIGNhdGVnb3J5SWQgPSBwYXJzZUludChyZXEucGFyYW1zLmNhdGVnb3J5SWQpO1xyXG4gICAgdmFyIHdvcmtJdGVtSWQgPSBwYXJzZUludChyZXEucGFyYW1zLndvcmtJdGVtSWQpO1xyXG4gICAgUHJvamVjdEludGVyY2VwdG9yLnZhbGlkYXRlSWRzRm9yVXBkYXRlUmF0ZShwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIGNvc3RIZWFkSWQsIGNhdGVnb3J5SWQsIHdvcmtJdGVtSWQsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmICgocmVxLnBhcmFtcy5jYXRlZ29yeUlkID09PSB1bmRlZmluZWQpIHx8IChyZXEucGFyYW1zLndvcmtJdGVtSWQgPT09IHVuZGVmaW5lZCkgfHwgKHJlcS5ib2R5LnF1YW50aXR5ID09PSB1bmRlZmluZWQpIHx8XHJcbiAgICAgICAgICAgIChyZXEuYm9keS5yYXRlSXRlbXMgPT09IHVuZGVmaW5lZCkgfHwgKHJlcS5ib2R5LnRvdGFsID09PSB1bmRlZmluZWQpIHx8IChyZXEuYm9keS51bml0ID09PSB1bmRlZmluZWQpIHx8XHJcbiAgICAgICAgICAgIChyZXEucGFyYW1zLmNhdGVnb3J5SWQgPT09ICcnKSB8fCAocmVxLnBhcmFtcy53b3JrSXRlbUlkID09PSAnJykgfHwgKHJlcS5ib2R5LnF1YW50aXR5ID09PSAnJykgfHxcclxuICAgICAgICAgICAgKHJlcS5ib2R5LnJhdGVJdGVtcyA9PT0gJycpIHx8IChyZXEuYm9keS50b3RhbCA9PT0gJycpIHx8IChyZXEuYm9keS51bml0ID09PSAnJykpIHtcclxuICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgbmV4dCgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZVJhdGVPZlByb2plY3RDb3N0SGVhZHMocmVxOiBhbnksIHJlczogYW55LCBuZXh0OiBhbnkpIHtcclxuICAgIHZhciBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgIHZhciBjb3N0SGVhZElkID0gcGFyc2VJbnQocmVxLnBhcmFtcy5jb3N0SGVhZElkKTtcclxuICAgIHZhciBjYXRlZ29yeUlkID0gcGFyc2VJbnQocmVxLnBhcmFtcy5jYXRlZ29yeUlkKTtcclxuICAgIHZhciB3b3JrSXRlbUlkID0gcGFyc2VJbnQocmVxLnBhcmFtcy53b3JrSXRlbUlkKTtcclxuICAgIFByb2plY3RJbnRlcmNlcHRvci52YWxpZGF0ZVByb2plY3RDb3N0SGVhZElkcyhwcm9qZWN0SWQsIGNvc3RIZWFkSWQsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmICgoY2F0ZWdvcnlJZCA9PT0gdW5kZWZpbmVkKSB8fCAod29ya0l0ZW1JZCA9PT0gdW5kZWZpbmVkKSB8fCAocmVxLmJvZHkucXVhbnRpdHkgPT09IHVuZGVmaW5lZCkgfHxcclxuICAgICAgICAgICAgKHJlcS5ib2R5LnJhdGVJdGVtcyA9PT0gdW5kZWZpbmVkKSB8fCAocmVxLmJvZHkudG90YWwgPT09IHVuZGVmaW5lZCkgfHwgKHJlcS5ib2R5LnVuaXQgPT09IHVuZGVmaW5lZCkgfHxcclxuICAgICAgICAgICAgKGNhdGVnb3J5SWQgPT09IG51bGwpIHx8ICh3b3JrSXRlbUlkID09PSBudWxsKSB8fCAocmVxLmJvZHkucXVhbnRpdHkgPT09ICcnKSB8fFxyXG4gICAgICAgICAgICAocmVxLmJvZHkucmF0ZUl0ZW1zID09PSAnJykgfHwgKHJlcS5ib2R5LnRvdGFsID09PSAnJykgfHwgKHJlcS5ib2R5LnVuaXQgPT09ICcnKSkge1xyXG4gICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBuZXh0KCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlRGlyZWN0UmF0ZU9mUHJvamVjdFdvcmtJdGVtcyhyZXE6IGFueSwgcmVzOiBhbnksIG5leHQ6IGFueSkge1xyXG4gICAgdmFyIHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgdmFyIGNvc3RIZWFkSWQgPSByZXEucGFyYW1zLmNvc3RIZWFkSWQ7XHJcbiAgICB2YXIgY2F0ZWdvcnlJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY2F0ZWdvcnlJZCk7XHJcbiAgICB2YXIgd29ya0l0ZW1JZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMud29ya0l0ZW1JZCk7XHJcbiAgICB2YXIgZGlyZWN0UmF0ZSA9IHJlcS5ib2R5LmRpcmVjdFJhdGU7XHJcblxyXG4gICAgUHJvamVjdEludGVyY2VwdG9yLnZhbGlkYXRlUHJvamVjdENvc3RIZWFkSWRzKHByb2plY3RJZCwgY29zdEhlYWRJZCwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKChjYXRlZ29yeUlkID09PSB1bmRlZmluZWQpIHx8ICh3b3JrSXRlbUlkID09PSB1bmRlZmluZWQpIHx8IChkaXJlY3RSYXRlID09PSB1bmRlZmluZWQpIHx8XHJcbiAgICAgICAgICAgIChjYXRlZ29yeUlkID09PSBudWxsKSB8fCAod29ya0l0ZW1JZCA9PT0gbnVsbCkgfHwgKGRpcmVjdFJhdGUgPT09ICcnKSkge1xyXG4gICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBuZXh0KCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc3luY1Byb2plY3RXaXRoUmF0ZUFuYWx5c2lzRGF0YShyZXE6IGFueSwgcmVzOiBhbnksIG5leHQ6IGFueSkge1xyXG4gICAgdmFyIHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgdmFyIGJ1aWxkaW5nSWQgPSByZXEucGFyYW1zLmJ1aWxkaW5nSWQ7XHJcbiAgICBQcm9qZWN0SW50ZXJjZXB0b3IudmFsaWRhdGVJZHMocHJvamVjdElkLCBidWlsZGluZ0lkLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAocmVzdWx0ID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBuZXh0KCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0QnVpbGRpbmdSYXRlSXRlbXNCeU9yaWdpbmFsTmFtZShyZXE6IGFueSwgcmVzOiBhbnksIG5leHQ6IGFueSkge1xyXG4gICAgdmFyIHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgdmFyIGJ1aWxkaW5nSWQgPSByZXEucGFyYW1zLmJ1aWxkaW5nSWQ7XHJcbiAgICB2YXIgb3JpZ2luYWxSYXRlSXRlbU5hbWUgPSByZXEuYm9keS5vcmlnaW5hbFJhdGVJdGVtTmFtZTtcclxuICAgIFByb2plY3RJbnRlcmNlcHRvci52YWxpZGF0ZUlkcyhwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmICgob3JpZ2luYWxSYXRlSXRlbU5hbWUgPT09IHVuZGVmaW5lZCkgfHwgKG9yaWdpbmFsUmF0ZUl0ZW1OYW1lID09PSAnJykpIHtcclxuICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgbmV4dCgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGFkZEF0dGFjaG1lbnRUb0J1aWxkaW5nV29ya0l0ZW0ocmVxOiBhbnksIHJlczogYW55LCBuZXh0OiBhbnkpIHtcclxuICAgIHZhciBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgIHZhciBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgdmFyIGNvc3RIZWFkSWQgPSByZXEucGFyYW1zLmNvc3RIZWFkSWQ7XHJcbiAgICB2YXIgY2F0ZWdvcnlJZCA9IHJlcS5wYXJhbXMuY2F0ZWdvcnlJZDtcclxuICAgIHZhciB3b3JrSXRlbUlkID0gcmVxLnBhcmFtcy53b3JrSXRlbUlkO1xyXG4gICAgdmFyIGZpbGVOYW1lID0gcmVxO1xyXG5cclxuICAgIFByb2plY3RJbnRlcmNlcHRvci52YWxpZGF0ZUNvc3RIZWFkSWRzKHByb2plY3RJZCwgYnVpbGRpbmdJZCwgY29zdEhlYWRJZCwgIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmKCAoY2F0ZWdvcnlJZCA9PT0gdW5kZWZpbmVkKSB8fCAoY2F0ZWdvcnlJZCA9PT0gJycpIHx8XHJcbiAgICAgICAgICAgICh3b3JrSXRlbUlkID09PSB1bmRlZmluZWQpIHx8ICh3b3JrSXRlbUlkID09PSAnJykgfHwgKGZpbGVOYW1lID09PSB1bmRlZmluZWQpIHx8IChmaWxlTmFtZSA9PT0gJycpKSB7XHJcbiAgICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5leHQoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgIH1cclxuICBjaGVja1ByZXNlbnRGaWxlc0ZvckJ1aWxkaW5nV29ya0l0ZW0ocmVxOiBhbnksIHJlczogYW55LCBuZXh0OiBhbnkpIHtcclxuICAgIHZhciBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgIHZhciBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgdmFyIGNvc3RIZWFkSWQgPSByZXEucGFyYW1zLmNvc3RIZWFkSWQ7XHJcbiAgICBQcm9qZWN0SW50ZXJjZXB0b3IudmFsaWRhdGVDb3N0SGVhZElkcyhwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIGNvc3RIZWFkSWQsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmICgocmVxLnBhcmFtcy5jYXRlZ29yeUlkID09PSB1bmRlZmluZWQpIHx8IChyZXEucGFyYW1zLndvcmtJdGVtSWQgPT09IHVuZGVmaW5lZCkgfHxcclxuICAgICAgICAgICAgKHJlcS5wYXJhbXMuY2F0ZWdvcnlJZCA9PT0gJycpIHx8IChyZXEucGFyYW1zLndvcmtJdGVtSWQgPT09ICcnKSkge1xyXG4gICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBuZXh0KCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuICBhZGRBdHRhY2htZW50VG9Qcm9qZWN0V29ya0l0ZW0ocmVxOiBhbnksIHJlczogYW55LCBuZXh0OiBhbnkpIHtcclxuICAgIHZhciBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgIHZhciBjb3N0SGVhZElkID0gcmVxLnBhcmFtcy5jb3N0SGVhZElkO1xyXG4gICAgdmFyIGNhdGVnb3J5SWQgPSByZXEucGFyYW1zLmNhdGVnb3J5SWQ7XHJcbiAgICB2YXIgd29ya0l0ZW1JZCA9IHJlcS5wYXJhbXMud29ya0l0ZW1JZDtcclxuICAgIHZhciBmaWxlTmFtZSA9IHJlcTtcclxuXHJcbiAgICBQcm9qZWN0SW50ZXJjZXB0b3IudmFsaWRhdGVQcm9qZWN0Q29zdEhlYWRJZHMocHJvamVjdElkLGNvc3RIZWFkSWQsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmKCAoY2F0ZWdvcnlJZCA9PT0gdW5kZWZpbmVkKSB8fCAoY2F0ZWdvcnlJZCA9PT0gJycpIHx8XHJcbiAgICAgICAgICAgICh3b3JrSXRlbUlkID09PSB1bmRlZmluZWQpIHx8ICh3b3JrSXRlbUlkID09PSAnJykgfHwgKGZpbGVOYW1lID09PSB1bmRlZmluZWQpIHx8IChmaWxlTmFtZSA9PT0gJycpKSB7XHJcbiAgICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5leHQoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG4gIGNoZWNrUHJlc2VudEZpbGVzRm9yUHJvamVjdFdvcmtJdGVtKHJlcTogYW55LCByZXM6IGFueSwgbmV4dDogYW55KSB7XHJcbiAgICB2YXIgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICB2YXIgY29zdEhlYWRJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY29zdEhlYWRJZCk7XHJcbiAgICB2YXIgY2F0ZWdvcnlJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY2F0ZWdvcnlJZCk7XHJcbiAgICB2YXIgd29ya0l0ZW1JZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMud29ya0l0ZW1JZCk7XHJcbiAgICBQcm9qZWN0SW50ZXJjZXB0b3IudmFsaWRhdGVQcm9qZWN0Q29zdEhlYWRJZHMocHJvamVjdElkLCBjb3N0SGVhZElkLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAocmVzdWx0ID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpZiAoKGNhdGVnb3J5SWQgPT09IHVuZGVmaW5lZCkgfHwgKHdvcmtJdGVtSWQgPT09IHVuZGVmaW5lZCkgfHxcclxuICAgICAgICAgICAgKGNhdGVnb3J5SWQgPT09IG51bGwpIHx8ICh3b3JrSXRlbUlkID09PSBudWxsKSkge1xyXG4gICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBuZXh0KCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbn1leHBvcnQgPSBQcm9qZWN0SW50ZXJjZXB0b3I7XHJcbiJdfQ==
