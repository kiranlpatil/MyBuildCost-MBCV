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
    ProjectInterceptor.prototype.updateBudgetedCostForCostHead = function (req, res, next) {
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
                    if ((req.body.budgetedCostAmount === undefined) || (req.body.buildingArea === undefined) || (req.body.costHead === undefined) ||
                        (req.body.costIn === undefined) || (req.body.costPer === undefined) ||
                        (req.body.budgetedCostAmount === '') || (req.body.buildingArea === '') || (req.body.costHead === '') ||
                        (req.body.costIn === '') || (req.body.costPer === '')) {
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
    ProjectInterceptor.prototype.getActiveCategories = function (req, res, next) {
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
    ProjectInterceptor.prototype.setWorkItemStatus = function (req, res, next) {
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
    ProjectInterceptor.prototype.getInActiveWorkItems = function (req, res, next) {
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
    ProjectInterceptor.prototype.updateQuantity = function (req, res, next) {
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
    ProjectInterceptor.prototype.deleteQuantityByName = function (req, res, next) {
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
    ProjectInterceptor.prototype.updateRate = function (req, res, next) {
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHBsaWNhdGlvblByb2plY3QvaW50ZXJjZXB0b3IvcmVxdWVzdC92YWxpZGF0aW9uL1Byb2plY3RJbnRlcmNlcHRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsbURBQW9EO0FBR3BEO0lBc0NFO0lBQ0EsQ0FBQztJQXRDYSxvQ0FBaUIsR0FBL0IsVUFBZ0MsU0FBaUIsRUFBRyxRQUEyQztRQUM3RixFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsS0FBSyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEQsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN4QixDQUFDO1FBQUMsSUFBSTtZQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVhLDhCQUFXLEdBQXpCLFVBQTBCLFNBQWlCLEVBQUUsVUFBa0IsRUFBRSxRQUEyQztRQUMxRyxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsS0FBSyxTQUFTLElBQUksVUFBVSxLQUFLLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxLQUFLLEVBQUUsSUFBSSxVQUFVLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JHLFFBQVEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDeEIsQ0FBQztRQUFDLElBQUk7WUFBQyxRQUFRLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFVyxzQ0FBbUIsR0FBakMsVUFBa0MsU0FBaUIsRUFBRSxVQUFrQixFQUFFLFVBQWtCLEVBQUUsUUFBMkM7UUFDeEksRUFBRSxDQUFBLENBQUMsQ0FBQyxTQUFTLEtBQUssU0FBUyxJQUFJLFVBQVUsS0FBSyxTQUFTLElBQUksVUFBVSxLQUFLLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxLQUFLLEVBQUUsSUFBSSxVQUFVLEtBQUssRUFBRSxJQUFJ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LFFBQVEsQ0FBQyxxQkFBcUI7d0JBQ3ZDLFVBQVUsRUFBRSxJQUFJLEtBQUssRUFBRTt3QkFDdkIsSUFBSSxFQUFFLEdBQUc7cUJBQ1YsQ0FBQyxDQUFDO2dCQUNMLENBQUM7Z0JBQ0QsSUFBSSxFQUFFLENBQUM7WUFDVCxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBR0gseUJBQUM7QUFBRCxDQW5xQkEsQUFtcUJDLElBQUE7QUFBQSxpQkFBUyxrQkFBa0IsQ0FBQyIsImZpbGUiOiJhcHAvYXBwbGljYXRpb25Qcm9qZWN0L2ludGVyY2VwdG9yL3JlcXVlc3QvdmFsaWRhdGlvbi9Qcm9qZWN0SW50ZXJjZXB0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTWVzc2FnZXM9cmVxdWlyZSgnLi4vLi4vLi4vc2hhcmVkL21lc3NhZ2VzJyk7XHJcblxyXG5cclxuY2xhc3MgUHJvamVjdEludGVyY2VwdG9yIHtcclxuICBwdWJsaWMgc3RhdGljIHZhbGlkYXRlUHJvamVjdElkKHByb2plY3RJZDogc3RyaW5nLCAgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgaWYgKChwcm9qZWN0SWQgPT09IHVuZGVmaW5lZCkgfHwgKHByb2plY3RJZCA9PT0gJycpKSB7XHJcbiAgICAgIGNhbGxiYWNrKG51bGwsIGZhbHNlKTtcclxuICAgIH0gZWxzZSBjYWxsYmFjayhudWxsLCB0cnVlKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgdmFsaWRhdGVJZHMocHJvamVjdElkOiBzdHJpbmcsIGJ1aWxkaW5nSWQ6IHN0cmluZywgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgaWYgKChwcm9qZWN0SWQgPT09IHVuZGVmaW5lZCB8fCBidWlsZGluZ0lkID09PSB1bmRlZmluZWQpIHx8IChwcm9qZWN0SWQgPT09ICcnIHx8IGJ1aWxkaW5nSWQgPT09ICcnKSkge1xyXG4gICAgICBjYWxsYmFjayhudWxsLCBmYWxzZSk7XHJcbiAgICB9IGVsc2UgY2FsbGJhY2sobnVsbCwgdHJ1ZSk7XHJcbiAgfVxyXG5cclxucHVibGljIHN0YXRpYyB2YWxpZGF0ZUNvc3RIZWFkSWRzKHByb2plY3RJZDogc3RyaW5nLCBidWlsZGluZ0lkOiBzdHJpbmcsIGNvc3RIZWFkSWQ6IHN0cmluZywgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG5pZigocHJvamVjdElkID09PSB1bmRlZmluZWQgfHwgYnVpbGRpbmdJZCA9PT0gdW5kZWZpbmVkIHx8IGNvc3RIZWFkSWQgPT09IHVuZGVmaW5lZCkgfHwgKHByb2plY3RJZCA9PT0gJycgfHwgYnVpbGRpbmdJZCA9PT0gJycgfHwgY29zdEhlYWRJZCA9PT0gJycpKSB7XHJcbiAgICAgIGNhbGxiYWNrKG51bGwsIGZhbHNlKTtcclxuICAgIH0gZWxzZSBjYWxsYmFjayhudWxsLCB0cnVlKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgdmFsaWRhdGVJZHNGb3JVcGRhdGVSYXRlKHByb2plY3RJZDogc3RyaW5nLCBidWlsZGluZ0lkOiBzdHJpbmcsIGNvc3RIZWFkSWQ6IG51bWJlciwgY2F0ZWdvcnlJZDogbnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdvcmtJdGVtSWQ6IG51bWJlciwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgaWYoKHByb2plY3RJZCA9PT0gdW5kZWZpbmVkIHx8IGJ1aWxkaW5nSWQgPT09IHVuZGVmaW5lZCB8fCBjb3N0SGVhZElkID09PSB1bmRlZmluZWQgfHwgY2F0ZWdvcnlJZCA9PT0gdW5kZWZpbmVkIHx8XHJcbiAgICAgICAgd29ya0l0ZW1JZCA9PT0gdW5kZWZpbmVkKSB8fCAocHJvamVjdElkID09PSAnJyB8fCBidWlsZGluZ0lkID09PSAnJyB8fCBjb3N0SGVhZElkID09PSBudWxsIHx8IGNhdGVnb3J5SWQgPT09IG51bGwgfHxcclxuICAgICAgICB3b3JrSXRlbUlkID09PSBudWxsKSkge1xyXG4gICAgICBjYWxsYmFjayhudWxsLCBmYWxzZSk7XHJcbiAgICB9IGVsc2UgY2FsbGJhY2sobnVsbCwgdHJ1ZSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc3RhdGljIHZhbGlkYXRlQ2F0ZWdvcnlJZHMocHJvamVjdElkOiBzdHJpbmcsIGJ1aWxkaW5nSWQ6IHN0cmluZywgY29zdEhlYWRJZDogbnVtYmVyLCBjYXRlZ29yeUlkOiBudW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZVN0YXR1czogbnVtYmVyLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBpZigocHJvamVjdElkID09PSB1bmRlZmluZWQgfHwgYnVpbGRpbmdJZCA9PT0gdW5kZWZpbmVkIHx8IGNvc3RIZWFkSWQgPT09IHVuZGVmaW5lZCB8fCBjYXRlZ29yeUlkID09PSB1bmRlZmluZWQgfHxcclxuICAgICAgICBhY3RpdmVTdGF0dXMgPT09IHVuZGVmaW5lZCkgfHwgKHByb2plY3RJZCA9PT0gJycgfHwgYnVpbGRpbmdJZCA9PT0gJycgfHwgY29zdEhlYWRJZCA9PT0gbnVsbCB8fCBjYXRlZ29yeUlkID09PSBudWxsXHJcbiAgICAgICAgfHwgYWN0aXZlU3RhdHVzID09PSBudWxsKSkge1xyXG4gICAgICBjYWxsYmFjayhudWxsLCBmYWxzZSk7XHJcbiAgICB9IGVsc2UgY2FsbGJhY2sobnVsbCwgdHJ1ZSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgfVxyXG5cclxuICBjcmVhdGVQcm9qZWN0KHJlcTogYW55LCByZXM6IGFueSwgbmV4dDogYW55KSB7XHJcbmlmICgocmVxLmJvZHkubmFtZSA9PT0gdW5kZWZpbmVkKSB8fCAocmVxLmJvZHkucmVnaW9uID09PSB1bmRlZmluZWQpIHx8IChyZXEuYm9keS5wbG90QXJlYSA9PT0gdW5kZWZpbmVkKSB8fCAocmVxLmJvZHkucGxvdFBlcmlwaGVyeSA9PT0gdW5kZWZpbmVkKSB8fFxyXG4gICAgKHJlcS5ib2R5LnBvZGl1bUFyZWEgPT09IHVuZGVmaW5lZCkgfHwgKHJlcS5ib2R5Lm9wZW5TcGFjZSA9PT0gdW5kZWZpbmVkKSB8fCAocmVxLmJvZHkuc2xhYkFyZWEgPT09IHVuZGVmaW5lZCkgfHwgKHJlcS5ib2R5LnBvb2xDYXBhY2l0eSA9PT0gdW5kZWZpbmVkKSB8fFxyXG4gICAgICAocmVxLmJvZHkucHJvamVjdER1cmF0aW9uID09PSB1bmRlZmluZWQpIHx8IChyZXEuYm9keS50b3RhbE51bU9mQnVpbGRpbmdzID09PSB1bmRlZmluZWQpIHx8XHJcbiAgKHJlcS5ib2R5Lm5hbWUgPT09ICcnKSB8fCAocmVxLmJvZHkucmVnaW9uID09PSAnJykgfHwgKHJlcS5ib2R5LnBsb3RBcmVhID09PSAnJykgfHxcclxuICAocmVxLmJvZHkucGxvdFBlcmlwaGVyeSA9PT0gJycpIHx8IChyZXEuYm9keS5wb2RpdW1BcmVhID09PSAnJykgfHwgKHJlcS5ib2R5Lm9wZW5TcGFjZSA9PT0gJycpIHx8XHJcbiAgKHJlcS5ib2R5LnNsYWJBcmVhID09PSAnJykgfHwgKHJlcS5ib2R5LnBvb2xDYXBhY2l0eSA9PT0gJycpIHx8IChyZXEuYm9keS5wcm9qZWN0RHVyYXRpb24gPT09ICcnKSB8fFxyXG4gIChyZXEuYm9keS50b3RhbE51bU9mQnVpbGRpbmdzID09PSAnJykpIHtcclxuICAgICAgbmV4dCh7XHJcbiAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIG5leHQoKTtcclxuICB9XHJcblxyXG4gIGdldFByb2plY3RCeUlkKHJlcTogYW55LCByZXM6IGFueSwgbmV4dDogYW55KSB7XHJcbiAgICB2YXIgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICBQcm9qZWN0SW50ZXJjZXB0b3IudmFsaWRhdGVQcm9qZWN0SWQocHJvamVjdElkLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAocmVzdWx0ID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBuZXh0KCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlUHJvamVjdEJ5SWQocmVxOiBhbnksIHJlczogYW55LCBuZXh0OiBhbnkpIHtcclxuICAgIHZhciBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgIFByb2plY3RJbnRlcmNlcHRvci52YWxpZGF0ZVByb2plY3RJZChwcm9qZWN0SWQsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmICgocmVxLmJvZHkubmFtZSA9PT0gdW5kZWZpbmVkKSB8fCAocmVxLmJvZHkucmVnaW9uID09PSB1bmRlZmluZWQpIHx8IChyZXEuYm9keS5wbG90QXJlYSA9PT0gdW5kZWZpbmVkKSB8fFxyXG4gICAgICAgICAgICAocmVxLmJvZHkucGxvdFBlcmlwaGVyeSA9PT0gdW5kZWZpbmVkKSB8fCAocmVxLmJvZHkucG9kaXVtQXJlYSA9PT0gdW5kZWZpbmVkKSB8fCAocmVxLmJvZHkub3BlblNwYWNlID09PSB1bmRlZmluZWQpIHx8XHJcbiAgICAgICAgICAgIChyZXEuYm9keS5zbGFiQXJlYSA9PT0gdW5kZWZpbmVkKSB8fCAocmVxLmJvZHkucG9vbENhcGFjaXR5ID09PSB1bmRlZmluZWQpIHx8IChyZXEuYm9keS5wcm9qZWN0RHVyYXRpb24gPT09IHVuZGVmaW5lZCkgfHxcclxuICAgICAgICAgICAgKHJlcS5ib2R5LnRvdGFsTnVtT2ZCdWlsZGluZ3MgPT09IHVuZGVmaW5lZCkgfHwgKHJlcS5ib2R5Lm5hbWUgPT09ICcnKSB8fCAocmVxLmJvZHkucmVnaW9uID09PSAnJykgfHwgKHJlcS5ib2R5LnBsb3RBcmVhID09PSAnJykgfHxcclxuICAgICAgICAgICAgKHJlcS5ib2R5LnBsb3RQZXJpcGhlcnkgPT09ICcnKSB8fCAocmVxLmJvZHkucG9kaXVtQXJlYSA9PT0gJycpIHx8IChyZXEuYm9keS5vcGVuU3BhY2UgPT09ICcnKSB8fFxyXG4gICAgICAgICAgICAocmVxLmJvZHkuc2xhYkFyZWEgPT09ICcnKSB8fCAocmVxLmJvZHkucG9vbENhcGFjaXR5ID09PSB1bmRlZmluZWQpIHx8IChyZXEuYm9keS5wcm9qZWN0RHVyYXRpb24gPT09ICcnKSB8fCAocmVxLmJvZHkudG90YWxOdW1PZkJ1aWxkaW5ncyA9PT0gJycpKSB7XHJcbiAgICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5leHQoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBjcmVhdGVCdWlsZGluZyhyZXE6IGFueSwgcmVzOiBhbnksIG5leHQ6IGFueSkge1xyXG4gICAgdmFyIHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgUHJvamVjdEludGVyY2VwdG9yLnZhbGlkYXRlUHJvamVjdElkKHByb2plY3RJZCwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKChyZXEuYm9keS5uYW1lID09PSB1bmRlZmluZWQpIHx8IChyZXEuYm9keS50b3RhbFNsYWJBcmVhID09PSB1bmRlZmluZWQpIHx8IChyZXEuYm9keS50b3RhbENhcnBldEFyZWFPZlVuaXQgPT09IHVuZGVmaW5lZCkgfHxcclxuICAgICAgICAgICAgKHJlcS5ib2R5LnRvdGFsU2FsZWFibGVBcmVhT2ZVbml0ID09PSB1bmRlZmluZWQpIHx8IChyZXEuYm9keS5wbGludGhBcmVhID09PSB1bmRlZmluZWQpIHx8IChyZXEuYm9keS50b3RhbE51bU9mRmxvb3JzID09PSB1bmRlZmluZWQpIHx8XHJcbiAgICAgICAgICAgIChyZXEuYm9keS5udW1PZlBhcmtpbmdGbG9vcnMgPT09IHVuZGVmaW5lZCkgfHwgKHJlcS5ib2R5LmNhcnBldEFyZWFPZlBhcmtpbmcgPT09IHVuZGVmaW5lZCkgfHwocmVxLmJvZHkubmFtZSA9PT0gJycpIHx8XHJcbiAgICAgICAgICAgIChyZXEuYm9keS50b3RhbFNsYWJBcmVhID09PSAnJykgfHwgKHJlcS5ib2R5LnRvdGFsQ2FycGV0QXJlYU9mVW5pdCA9PT0gJycpIHx8IChyZXEuYm9keS50b3RhbFNhbGVhYmxlQXJlYU9mVW5pdCA9PT0gJycpIHx8XHJcbiAgICAgICAgICAgIChyZXEuYm9keS5wbGludGhBcmVhID09PSAnJykgfHwgKHJlcS5ib2R5LnRvdGFsTnVtT2ZGbG9vcnMgPT09ICcnKSB8fCAocmVxLmJvZHkubnVtT2ZQYXJraW5nRmxvb3JzID09PSAnJykgfHwgKHJlcS5ib2R5LmNhcnBldEFyZWFPZlBhcmtpbmcgPT09ICcnKSkge1xyXG4gICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBuZXh0KCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0QnVpbGRpbmdCeUlkKHJlcTogYW55LCByZXM6IGFueSwgbmV4dDogYW55KSB7XHJcbiAgICB2YXIgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICB2YXIgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgIFByb2plY3RJbnRlcmNlcHRvci52YWxpZGF0ZUlkcyhwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5leHQoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVCdWlsZGluZ0J5SWQocmVxOiBhbnksIHJlczogYW55LCBuZXh0OiBhbnkpIHtcclxuICAgIHZhciBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgIHZhciBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgUHJvamVjdEludGVyY2VwdG9yLnZhbGlkYXRlSWRzKHByb2plY3RJZCwgYnVpbGRpbmdJZCwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKChyZXEuYm9keS5uYW1lID09PSB1bmRlZmluZWQpIHx8IChyZXEuYm9keS50b3RhbFNsYWJBcmVhID09PSB1bmRlZmluZWQpIHx8IChyZXEuYm9keS50b3RhbENhcnBldEFyZWFPZlVuaXQgPT09IHVuZGVmaW5lZCkgfHwgKHJlcS5ib2R5LnRvdGFsU2FsZWFibGVBcmVhT2ZVbml0ID09PSB1bmRlZmluZWQpIHx8XHJcbiAgICAgICAgICAgICAgKHJlcS5ib2R5LnBsaW50aEFyZWEgPT09IHVuZGVmaW5lZCkgfHwgKHJlcS5ib2R5LnRvdGFsTnVtT2ZGbG9vcnMgPT09IHVuZGVmaW5lZCkgfHwgKHJlcS5ib2R5Lm51bU9mUGFya2luZ0Zsb29ycyA9PT0gdW5kZWZpbmVkKSB8fCAocmVxLmJvZHkuY2FycGV0QXJlYU9mUGFya2luZyA9PT0gdW5kZWZpbmVkKSB8fFxyXG4gICAgICAgICAgICAocmVxLmJvZHkubmFtZSA9PT0gJycpIHx8IChyZXEuYm9keS50b3RhbFNsYWJBcmVhID09PSAnJykgfHwgKHJlcS5ib2R5LnRvdGFsQ2FycGV0QXJlYU9mVW5pdCA9PT0gJycpIHx8IChyZXEuYm9keS50b3RhbFNhbGVhYmxlQXJlYU9mVW5pdCA9PT0gJycpIHx8XHJcbiAgICAgICAgICAgIChyZXEuYm9keS5wbGludGhBcmVhID09PSAnJykgfHwgKHJlcS5ib2R5LnRvdGFsTnVtT2ZGbG9vcnMgPT09ICcnKSB8fCAocmVxLmJvZHkubnVtT2ZQYXJraW5nRmxvb3JzID09PSAnJykgfHwgKHJlcS5ib2R5LmNhcnBldEFyZWFPZlBhcmtpbmcgPT09ICcnKSkge1xyXG4gICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBuZXh0KCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZGVsZXRlQnVpbGRpbmdCeUlkKHJlcTogYW55LCByZXM6IGFueSwgbmV4dDogYW55KSB7XHJcbiAgICB2YXIgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICB2YXIgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgIFByb2plY3RJbnRlcmNlcHRvci52YWxpZGF0ZUlkcyhwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5leHQoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRCdWlsZGluZ0J5SWRGb3JDbG9uZShyZXE6IGFueSwgcmVzOiBhbnksIG5leHQ6IGFueSkge1xyXG4gICAgdmFyIHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgdmFyIGJ1aWxkaW5nSWQgPSByZXEucGFyYW1zLmJ1aWxkaW5nSWQ7XHJcbiAgICBQcm9qZWN0SW50ZXJjZXB0b3IudmFsaWRhdGVJZHMocHJvamVjdElkLCBidWlsZGluZ0lkLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAocmVzdWx0ID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBuZXh0KCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc2V0Q29zdEhlYWRTdGF0dXMocmVxOiBhbnksIHJlczogYW55LCBuZXh0OiBhbnkpIHtcclxuICAgIHZhciBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgIHZhciBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgdmFyIGNvc3RIZWFkSWQgPSByZXEucGFyYW1zLmNvc3RIZWFkSWQ7XHJcbiAgICBQcm9qZWN0SW50ZXJjZXB0b3IudmFsaWRhdGVDb3N0SGVhZElkcyhwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIGNvc3RIZWFkSWQsICAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAocmVzdWx0ID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpZigocmVxLnBhcmFtcy5hY3RpdmVTdGF0dXMgPT09IHVuZGVmaW5lZCkgfHwgKHJlcS5wYXJhbXMuYWN0aXZlU3RhdHVzID09PSAnJykgKSB7XHJcbiAgICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5leHQoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRJbkFjdGl2ZUNvc3RIZWFkKHJlcTogYW55LCByZXM6IGFueSwgbmV4dDogYW55KSB7XHJcbiAgICB2YXIgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICB2YXIgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgIFByb2plY3RJbnRlcmNlcHRvci52YWxpZGF0ZUlkcyhwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5leHQoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVCdWRnZXRlZENvc3RGb3JDb3N0SGVhZChyZXE6IGFueSwgcmVzOiBhbnksIG5leHQ6IGFueSkge1xyXG4gICAgdmFyIHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgdmFyIGJ1aWxkaW5nSWQgPSByZXEucGFyYW1zLmJ1aWxkaW5nSWQ7XHJcbiAgICBQcm9qZWN0SW50ZXJjZXB0b3IudmFsaWRhdGVJZHMocHJvamVjdElkLCBidWlsZGluZ0lkLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAocmVzdWx0ID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpZiAoKHJlcS5ib2R5LmJ1ZGdldGVkQ29zdEFtb3VudCA9PT0gdW5kZWZpbmVkKSB8fCAocmVxLmJvZHkuYnVpbGRpbmdBcmVhID09PSB1bmRlZmluZWQpIHx8IChyZXEuYm9keS5jb3N0SGVhZCA9PT0gdW5kZWZpbmVkKSB8fFxyXG4gICAgICAgICAgICAocmVxLmJvZHkuY29zdEluID09PSB1bmRlZmluZWQpIHx8IChyZXEuYm9keS5jb3N0UGVyID09PSB1bmRlZmluZWQpIHx8XHJcbiAgICAgICAgICAgIChyZXEuYm9keS5idWRnZXRlZENvc3RBbW91bnQgPT09ICcnKSB8fCAocmVxLmJvZHkuYnVpbGRpbmdBcmVhID09PSAnJykgfHwgKHJlcS5ib2R5LmNvc3RIZWFkID09PSAnJykgfHxcclxuICAgICAgICAgICAgKHJlcS5ib2R5LmNvc3RJbiA9PT0gJycpIHx8IChyZXEuYm9keS5jb3N0UGVyID09PSAnJykpIHtcclxuICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgbmV4dCgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldEFjdGl2ZUNhdGVnb3JpZXMocmVxOiBhbnksIHJlczogYW55LCBuZXh0OiBhbnkpIHtcclxuICAgIHZhciBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgIHZhciBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgdmFyIGNvc3RIZWFkSWQgPSByZXEucGFyYW1zLmNvc3RIZWFkSWQ7XHJcbiAgICBQcm9qZWN0SW50ZXJjZXB0b3IudmFsaWRhdGVDb3N0SGVhZElkcyhwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIGNvc3RIZWFkSWQsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5leHQoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRJbkFjdGl2ZUNhdGVnb3JpZXNCeUNvc3RIZWFkSWQocmVxOiBhbnksIHJlczogYW55LCBuZXh0OiBhbnkpIHtcclxuICAgIHZhciBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgIHZhciBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgdmFyIGNvc3RIZWFkSWQgPSByZXEucGFyYW1zLmNvc3RIZWFkSWQ7XHJcbiAgICBQcm9qZWN0SW50ZXJjZXB0b3IudmFsaWRhdGVDb3N0SGVhZElkcyhwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIGNvc3RIZWFkSWQsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5leHQoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRBbGxDYXRlZ29yaWVzQnlDb3N0SGVhZElkKHJlcTogYW55LCByZXM6IGFueSwgbmV4dDogYW55KSB7XHJcbiAgICB2YXIgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICB2YXIgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgIHZhciBjb3N0SGVhZElkID0gcmVxLnBhcmFtcy5jb3N0SGVhZElkO1xyXG4gICAgUHJvamVjdEludGVyY2VwdG9yLnZhbGlkYXRlQ29zdEhlYWRJZHMocHJvamVjdElkLCBidWlsZGluZ0lkLCBjb3N0SGVhZElkLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAocmVzdWx0ID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBuZXh0KCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlQ2F0ZWdvcnlTdGF0dXMocmVxOiBhbnksIHJlczogYW55LCBuZXh0OiBhbnkpIHtcclxuICAgIHZhciBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgIHZhciBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgdmFyIGNvc3RIZWFkSWQgPSByZXEucGFyYW1zLmNvc3RIZWFkSWQ7XHJcbiAgICB2YXIgY2F0ZWdvcnlJZCA9IHJlcS5wYXJhbXMuY2F0ZWdvcnlJZDtcclxuICAgIHZhciBhY3RpdmVTdGF0dXMgPSByZXEucGFyYW1zLmFjdGl2ZVN0YXR1cztcclxuICAgIFByb2plY3RJbnRlcmNlcHRvci52YWxpZGF0ZUNhdGVnb3J5SWRzKHByb2plY3RJZCwgYnVpbGRpbmdJZCwgY29zdEhlYWRJZCwgY2F0ZWdvcnlJZCwgYWN0aXZlU3RhdHVzLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAocmVzdWx0ID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBuZXh0KCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgYWRkQ2F0ZWdvcnlCeUNvc3RIZWFkSWQocmVxOiBhbnksIHJlczogYW55LCBuZXh0OiBhbnkpIHtcclxuICAgIHZhciBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgIHZhciBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgdmFyIGNvc3RIZWFkSWQgPSByZXEucGFyYW1zLmNvc3RIZWFkSWQ7XHJcbiAgICBQcm9qZWN0SW50ZXJjZXB0b3IudmFsaWRhdGVDb3N0SGVhZElkcyhwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIGNvc3RIZWFkSWQsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmICgocmVxLmJvZHkuY2F0ZWdvcnkgPT09IHVuZGVmaW5lZCkgfHwgKHJlcS5ib2R5LmNhdGVnb3J5SWQgPT09IHVuZGVmaW5lZCkgfHxcclxuICAgICAgICAgICAgKHJlcS5ib2R5LmNhdGVnb3J5ID09PSAnJykgfHwgKHJlcS5ib2R5LmNhdGVnb3J5SWQgPT09ICcnKSkge1xyXG4gICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBuZXh0KCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZGVsZXRlQ2F0ZWdvcnlGcm9tQ29zdEhlYWQocmVxOiBhbnksIHJlczogYW55LCBuZXh0OiBhbnkpIHtcclxuICAgIHZhciBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgIHZhciBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgdmFyIGNvc3RIZWFkSWQgPSByZXEucGFyYW1zLmNvc3RIZWFkSWQ7XHJcbiAgICBQcm9qZWN0SW50ZXJjZXB0b3IudmFsaWRhdGVDb3N0SGVhZElkcyhwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIGNvc3RIZWFkSWQsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmICgocmVxLmJvZHkubmFtZSA9PT0gdW5kZWZpbmVkKSB8fCAocmVxLmJvZHkucmF0ZUFuYWx5c2lzSWQgPT09IHVuZGVmaW5lZCkgfHxcclxuICAgICAgICAgICAgKHJlcS5ib2R5Lm5hbWUgPT09ICcnKSB8fCAocmVxLmJvZHkucmF0ZUFuYWx5c2lzSWQgPT09ICcnKSkge1xyXG4gICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBuZXh0KCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc2V0V29ya0l0ZW1TdGF0dXMocmVxOiBhbnksIHJlczogYW55LCBuZXh0OiBhbnkpIHtcclxuICAgIHZhciBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgIHZhciBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgdmFyIGNvc3RIZWFkSWQgPSByZXEucGFyYW1zLmNvc3RIZWFkSWQ7XHJcbiAgICBQcm9qZWN0SW50ZXJjZXB0b3IudmFsaWRhdGVDb3N0SGVhZElkcyhwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIGNvc3RIZWFkSWQsICAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAocmVzdWx0ID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmKCAocmVxLnBhcmFtcy53b3JrSXRlbUlkID09PSB1bmRlZmluZWQpIHx8IChyZXEucGFyYW1zLndvcmtJdGVtSWQgPT09ICcnKSB8fFxyXG4gICAgICAgIChyZXEucGFyYW1zLmFjdGl2ZVN0YXR1cyA9PT0gdW5kZWZpbmVkKSB8fCAocmVxLnBhcmFtcy5hY3RpdmVTdGF0dXMgPT09ICcnKSkge1xyXG4gICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBuZXh0KCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0SW5BY3RpdmVXb3JrSXRlbXMocmVxOiBhbnksIHJlczogYW55LCBuZXh0OiBhbnkpIHtcclxuICAgIHZhciBwcm9qZWN0SWQgPSByZXEucGFyYW1zLnByb2plY3RJZDtcclxuICAgIHZhciBidWlsZGluZ0lkID0gcmVxLnBhcmFtcy5idWlsZGluZ0lkO1xyXG4gICAgdmFyIGNvc3RIZWFkSWQgPSByZXEucGFyYW1zLmNvc3RIZWFkSWQ7XHJcbiAgICBQcm9qZWN0SW50ZXJjZXB0b3IudmFsaWRhdGVDb3N0SGVhZElkcyhwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIGNvc3RIZWFkSWQsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmICgocmVxLnBhcmFtcy5jYXRlZ29yeUlkID09PSB1bmRlZmluZWQpIHx8IChyZXEucGFyYW1zLmNhdGVnb3J5SWQgPT09ICcnKSkge1xyXG4gICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBuZXh0KCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0UmF0ZShyZXE6IGFueSwgcmVzOiBhbnksIG5leHQ6IGFueSkge1xyXG4gICAgdmFyIHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgdmFyIGJ1aWxkaW5nSWQgPSByZXEucGFyYW1zLmJ1aWxkaW5nSWQ7XHJcbiAgICB2YXIgY29zdEhlYWRJZCA9IHJlcS5wYXJhbXMuY29zdEhlYWRJZDtcclxuICAgIFByb2plY3RJbnRlcmNlcHRvci52YWxpZGF0ZUNvc3RIZWFkSWRzKHByb2plY3RJZCwgYnVpbGRpbmdJZCwgY29zdEhlYWRJZCwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKChyZXEucGFyYW1zLmNhdGVnb3J5SWQgPT09IHVuZGVmaW5lZCkgfHwgKHJlcS5wYXJhbXMud29ya0l0ZW1JZCA9PT0gdW5kZWZpbmVkKSB8fFxyXG4gICAgICAgICAgICAocmVxLnBhcmFtcy5jYXRlZ29yeUlkID09PSAnJykgfHwgKHJlcS5wYXJhbXMud29ya0l0ZW1JZCA9PT0gJycpKSB7XHJcbiAgICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5leHQoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVRdWFudGl0eShyZXE6IGFueSwgcmVzOiBhbnksIG5leHQ6IGFueSkge1xyXG4gICAgdmFyIHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgdmFyIGJ1aWxkaW5nSWQgPSByZXEucGFyYW1zLmJ1aWxkaW5nSWQ7XHJcbiAgICB2YXIgY29zdEhlYWRJZCA9IHJlcS5wYXJhbXMuY29zdEhlYWRJZDtcclxuICAgIFByb2plY3RJbnRlcmNlcHRvci52YWxpZGF0ZUNvc3RIZWFkSWRzKHByb2plY3RJZCwgYnVpbGRpbmdJZCwgY29zdEhlYWRJZCwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKChyZXEucGFyYW1zLmNhdGVnb3J5SWQgPT09IHVuZGVmaW5lZCkgfHwgKHJlcS5wYXJhbXMud29ya0l0ZW1JZCA9PT0gdW5kZWZpbmVkKSB8fCAocmVxLmJvZHkuaXRlbSA9PT0gdW5kZWZpbmVkKSB8fFxyXG4gICAgICAgICAgICAocmVxLnBhcmFtcy5jYXRlZ29yeUlkID09PSAnJykgfHwgKHJlcS5wYXJhbXMud29ya0l0ZW1JZCA9PT0gJycpIHx8IChyZXEuYm9keS5pdGVtID09PSAnJykpIHtcclxuICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgbmV4dCgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGRlbGV0ZVF1YW50aXR5QnlOYW1lKHJlcTogYW55LCByZXM6IGFueSwgbmV4dDogYW55KSB7XHJcbiAgICB2YXIgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICB2YXIgYnVpbGRpbmdJZCA9IHJlcS5wYXJhbXMuYnVpbGRpbmdJZDtcclxuICAgIHZhciBjb3N0SGVhZElkID0gcmVxLnBhcmFtcy5jb3N0SGVhZElkO1xyXG4gICAgUHJvamVjdEludGVyY2VwdG9yLnZhbGlkYXRlQ29zdEhlYWRJZHMocHJvamVjdElkLCBidWlsZGluZ0lkLCBjb3N0SGVhZElkLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAocmVzdWx0ID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpZiAoKHJlcS5wYXJhbXMuY2F0ZWdvcnlJZCA9PT0gdW5kZWZpbmVkKSB8fCAocmVxLnBhcmFtcy53b3JrSXRlbUlkID09PSB1bmRlZmluZWQpIHx8IChyZXEuYm9keS5pdGVtID09PSB1bmRlZmluZWQpIHx8XHJcbiAgICAgICAgICAgIChyZXEucGFyYW1zLmNhdGVnb3J5SWQgPT09ICcnKSB8fCAocmVxLnBhcmFtcy53b3JrSXRlbUlkID09PSAnJykgfHwgKHJlcS5ib2R5Lml0ZW0gPT09ICcnKSkge1xyXG4gICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBuZXh0KCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlUmF0ZShyZXE6IGFueSwgcmVzOiBhbnksIG5leHQ6IGFueSkge1xyXG4gICAgdmFyIHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgdmFyIGJ1aWxkaW5nSWQgPSByZXEucGFyYW1zLmJ1aWxkaW5nSWQ7XHJcbiAgICB2YXIgY29zdEhlYWRJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY29zdEhlYWRJZCk7XHJcbiAgICB2YXIgY2F0ZWdvcnlJZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMuY2F0ZWdvcnlJZCk7XHJcbiAgICB2YXIgd29ya0l0ZW1JZCA9IHBhcnNlSW50KHJlcS5wYXJhbXMud29ya0l0ZW1JZCk7XHJcbiAgICBQcm9qZWN0SW50ZXJjZXB0b3IudmFsaWRhdGVJZHNGb3JVcGRhdGVSYXRlKHByb2plY3RJZCwgYnVpbGRpbmdJZCwgY29zdEhlYWRJZCwgY2F0ZWdvcnlJZCwgd29ya0l0ZW1JZCwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKChyZXEucGFyYW1zLmNhdGVnb3J5SWQgPT09IHVuZGVmaW5lZCkgfHwgKHJlcS5wYXJhbXMud29ya0l0ZW1JZCA9PT0gdW5kZWZpbmVkKSB8fChyZXEuYm9keS5xdWFudGl0eSAgPT09IHVuZGVmaW5lZCkgIHx8XHJcbiAgICAgICAgICAgIChyZXEuYm9keS5yYXRlSXRlbXMgPT09IHVuZGVmaW5lZCkgIHx8IChyZXEuYm9keS50b3RhbCAgPT09IHVuZGVmaW5lZCkgfHwgKHJlcS5ib2R5LnVuaXQgPT09IHVuZGVmaW5lZCkgfHxcclxuICAgICAgICAgICAgKHJlcS5wYXJhbXMuY2F0ZWdvcnlJZCA9PT0gJycpIHx8IChyZXEucGFyYW1zLndvcmtJdGVtSWQgPT09ICcnKSB8fCAocmVxLmJvZHkucXVhbnRpdHkgID09PSAnJykgfHxcclxuICAgICAgICAgICAgKHJlcS5ib2R5LnJhdGVJdGVtcyA9PT0gJycpICB8fCAocmVxLmJvZHkudG90YWwgID09PSAnJykgfHwgKHJlcS5ib2R5LnVuaXQgPT09ICcnKSkge1xyXG4gICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9FTVBUWV9GSUVMRCxcclxuICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBuZXh0KCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc3luY1Byb2plY3RXaXRoUmF0ZUFuYWx5c2lzRGF0YShyZXE6IGFueSwgcmVzOiBhbnksIG5leHQ6IGFueSkge1xyXG4gICAgdmFyIHByb2plY3RJZCA9IHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgdmFyIGJ1aWxkaW5nSWQgPSByZXEucGFyYW1zLmJ1aWxkaW5nSWQ7XHJcbiAgICBQcm9qZWN0SW50ZXJjZXB0b3IudmFsaWRhdGVJZHMocHJvamVjdElkLCBidWlsZGluZ0lkLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAocmVzdWx0ID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0VNUFRZX0ZJRUxELFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRU1QVFlfRklFTEQsXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBuZXh0KCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcblxyXG59ZXhwb3J0ID0gUHJvamVjdEludGVyY2VwdG9yO1xyXG4iXX0=
