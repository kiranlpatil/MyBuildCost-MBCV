import Messages=require('../../../shared/messages');


class ProjectInterceptor {
  public static validateProjectId(projectId: string, callback: (error: any, result: any) => void) {
    if ((projectId === undefined) || (projectId === '')) {
      callback(null, false);
    } else callback(null, true);
  }

  public static validateIds(projectId: string, buildingId: string, callback: (error: any, result: any) => void) {
    if ((projectId === undefined || buildingId === undefined) || (projectId === '' || buildingId === '')) {
      callback(null, false);
    } else callback(null, true);
  }

  public static validateCostHeadIds(projectId: string, buildingId: string, costHeadId: string, callback: (error: any, result: any) => void) {
    if ((projectId === undefined || buildingId === undefined || costHeadId === undefined) || (projectId === '' || buildingId === '' || costHeadId === '')) {
      callback(null, false);
    } else callback(null, true);
  }

  public static validateProjectCostHeadIds(projectId: string, costHeadId: number, callback: (error: any, result: any) => void) {
    if ((projectId === undefined || costHeadId === undefined) || (projectId === '' || costHeadId === null)) {
      callback(null, false);
    } else callback(null, true);
  }

  public static validateIdsForUpdateRate(projectId: string, buildingId: string, costHeadId: number, categoryId: number,
                                         workItemId: number, callback: (error: any, result: any) => void) {
    if ((projectId === undefined || buildingId === undefined || costHeadId === undefined || categoryId === undefined ||
        workItemId === undefined) || (projectId === '' || buildingId === '' || costHeadId === null || categoryId === null ||
        workItemId === null)) {
      callback(null, false);
    } else callback(null, true);
  }

  public static validateCategoryIds(projectId: string, buildingId: string, costHeadId: number, categoryId: number,
                                    activeStatus: number, callback: (error: any, result: any) => void) {
    if ((projectId === undefined || buildingId === undefined || costHeadId === undefined || categoryId === undefined ||
        activeStatus === undefined) || (projectId === '' || buildingId === '' || costHeadId === null || categoryId === null
        || activeStatus === null)) {
      callback(null, false);
    } else callback(null, true);
  }

  createProject(req: any, res: any, next: any) {
    if ((req.body.name === undefined) || (req.body.region === undefined) || (req.body.plotArea === undefined) || (req.body.plotPeriphery === undefined) ||
      (req.body.podiumArea === undefined) || (req.body.openSpace === undefined) || (req.body.slabArea === undefined) || (req.body.poolCapacity === undefined) ||
      (req.body.projectDuration === undefined) ||(req.body.activeStatus === undefined) ||
      (req.body.name === '') || (req.body.region === '') || (req.body.plotArea === '') ||
      (req.body.plotPeriphery === '') || (req.body.podiumArea === '') || (req.body.openSpace === '') ||
      (req.body.slabArea === '') || (req.body.poolCapacity === '') || (req.body.projectDuration === '') ||(req.body.activeStatus === '')) {
      next({
        reason: Messages.MSG_ERROR_EMPTY_FIELD,
        message: Messages.MSG_ERROR_EMPTY_FIELD,
        stackTrace: new Error(),
        code: 400
      });
    }
    next();
  }

  getProjectById(req: any, res: any, next: any) {
    var projectId = req.params.projectId;
    ProjectInterceptor.validateProjectId(projectId, (error, result) => {
      if (error) {
        next(error);
      } else {
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
  }

  getProjectRateItemsByOriginalName(req: any, res: any, next: any) {
    var projectId = req.params.projectId;
    var originalRateItemName = req.body.originalRateItemName;
    ProjectInterceptor.validateProjectId(projectId, (error, result) => {
      if (error) {
        next(error);
      } else {
        if (result === false) {
          next({
            reason: Messages.MSG_ERROR_EMPTY_FIELD,
            message: Messages.MSG_ERROR_EMPTY_FIELD,
            stackTrace: new Error(),
            code: 400
          });
        } else {
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
  }

  updateProjectById(req: any, res: any, next: any) {
    var projectId = req.params.projectId;
    ProjectInterceptor.validateProjectId(projectId, (error, result) => {
      if (error) {
        next(error);
      } else {
        if (result === false) {
          next({
            reason: Messages.MSG_ERROR_EMPTY_FIELD,
            message: Messages.MSG_ERROR_EMPTY_FIELD,
            stackTrace: new Error(),
            code: 400
          });
        } else {
          if ((req.body.name === undefined) || (req.body.region === undefined) || (req.body.plotArea === undefined) ||
            (req.body.plotPeriphery === undefined) || (req.body.podiumArea === undefined) || (req.body.openSpace === undefined) ||
            (req.body.slabArea === undefined) || (req.body.poolCapacity === undefined) || (req.body.projectDuration === undefined) ||
             (req.body.name === '') || (req.body.region === '') || (req.body.plotArea === '') ||
            (req.body.plotPeriphery === '') || (req.body.podiumArea === '') || (req.body.openSpace === '') ||
            (req.body.slabArea === '') || (req.body.poolCapacity === undefined) || (req.body.projectDuration === '')) {
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
  }
  updateProjectNameById(req: any, res: any, next: any) {
    var projectId = req.params.projectId;
    var name = req.body.name;
    ProjectInterceptor.validateProjectId(projectId, (error, result) => {
      if (error) {
        next(error);
      } else {
        if (result === false) {
          next({
            reason: Messages.MSG_ERROR_EMPTY_FIELD,
            message: Messages.MSG_ERROR_EMPTY_FIELD,
            stackTrace: new Error(),
            code: 400
          });
        } else {
          if ((name === undefined) || (name === '')) {
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
  }
  updateProjectStatus(req: any, res: any, next: any) {
    var projectId = req.params.projectId;
    var activeStatus = req.params.activeStatus;
    ProjectInterceptor.validateProjectId(projectId, (error, result) => {
      if (error) {
        next(error);
      } else {
        if (result === false) {
          next({
            reason: Messages.MSG_ERROR_EMPTY_FIELD,
            message: Messages.MSG_ERROR_EMPTY_FIELD,
            stackTrace: new Error(),
            code: 400
          });
        } else {
          if ((activeStatus === undefined) || (activeStatus === '')) {
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
  }

  createBuilding(req: any, res: any, next: any) {
    var projectId = req.params.projectId;
    ProjectInterceptor.validateProjectId(projectId, (error, result) => {
      if (error) {
        next(error);
      } else {
        if (result === false) {
          next({
            reason: Messages.MSG_ERROR_EMPTY_FIELD,
            message: Messages.MSG_ERROR_EMPTY_FIELD,
            stackTrace: new Error(),
            code: 400
          });
        } else {
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
  }

  getBuildingById(req: any, res: any, next: any) {
    var projectId = req.params.projectId;
    var buildingId = req.params.buildingId;
    ProjectInterceptor.validateIds(projectId, buildingId, (error, result) => {
      if (error) {
        next(error);
      } else {
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
  }

  updateBuildingById(req: any, res: any, next: any) {
    var projectId = req.params.projectId;
    var buildingId = req.params.buildingId;
    ProjectInterceptor.validateIds(projectId, buildingId, (error, result) => {
      if (error) {
        next(error);
      } else {
        if (result === false) {
          next({
            reason: Messages.MSG_ERROR_EMPTY_FIELD,
            message: Messages.MSG_ERROR_EMPTY_FIELD,
            stackTrace: new Error(),
            code: 400
          });
        } else {
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
  }

  deleteBuildingById(req: any, res: any, next: any) {
    var projectId = req.params.projectId;
    var buildingId = req.params.buildingId;
    ProjectInterceptor.validateIds(projectId, buildingId, (error, result) => {
      if (error) {
        next(error);
      } else {
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
  }

  getBuildingByIdForClone(req: any, res: any, next: any) {
    var projectId = req.params.projectId;
    var buildingId = req.params.buildingId;
    ProjectInterceptor.validateIds(projectId, buildingId, (error, result) => {
      if (error) {
        next(error);
      } else {
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
  }

  cloneBuilding(req: any, res: any, next: any) {
    var projectId = req.params.projectId;
    var buildingId = req.params.buildingId;
    ProjectInterceptor.validateIds(projectId, buildingId, (error, result) => {
      if (error) {
        next(error);
      } else {
        if (result === false) {
          next({
            reason: Messages.MSG_ERROR_EMPTY_FIELD,
            message: Messages.MSG_ERROR_EMPTY_FIELD,
            stackTrace: new Error(),
            code: 400
          });
        } else {
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
  }

  getCategoriesOfProjectCostHead(req: any, res: any, next: any) {
    var projectId = req.params.projectId;
    var costHeadId = req.params.costHeadId;
    ProjectInterceptor.validateProjectCostHeadIds(projectId, costHeadId, (error, result) => {
      if (error) {
        next(error);
      } else {
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
  }

  getWorkItemListOfProjectCategory(req: any, res: any, next: any) {
    var projectId = req.params.projectId;
    var costHeadId = req.params.costHeadId;
    ProjectInterceptor.validateProjectCostHeadIds(projectId, costHeadId, (error, result) => {
      if (error) {
        next(error);
      } else {
        if (result === false) {
          next({
            reason: Messages.MSG_ERROR_EMPTY_FIELD,
            message: Messages.MSG_ERROR_EMPTY_FIELD,
            stackTrace: new Error(),
            code: 400
          });
        } else {
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
  }

  setCostHeadStatus(req: any, res: any, next: any) {
    var projectId = req.params.projectId;
    var buildingId = req.params.buildingId;
    var costHeadId = req.params.costHeadId;
    ProjectInterceptor.validateCostHeadIds(projectId, buildingId, costHeadId, (error, result) => {
      if (error) {
        next(error);
      } else {
        if (result === false) {
          next({
            reason: Messages.MSG_ERROR_EMPTY_FIELD,
            message: Messages.MSG_ERROR_EMPTY_FIELD,
            stackTrace: new Error(),
            code: 400
          });
        } else {
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
  }

  getInActiveCostHead(req: any, res: any, next: any) {
    var projectId = req.params.projectId;
    var buildingId = req.params.buildingId;
    ProjectInterceptor.validateIds(projectId, buildingId, (error, result) => {
      if (error) {
        next(error);
      } else {
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
  }

  updateBudgetedCostForBuildingCostHead(req: any, res: any, next: any) {
    var projectId = req.params.projectId;
    var buildingId = req.params.buildingId;
    ProjectInterceptor.validateIds(projectId, buildingId, (error, result) => {
      if (error) {
        next(error);
      } else {
        if (result === false) {
          next({
            reason: Messages.MSG_ERROR_EMPTY_FIELD,
            message: Messages.MSG_ERROR_EMPTY_FIELD,
            stackTrace: new Error(),
            code: 400
          });
        } else {
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
  }

  updateBudgetedCostForProjectCostHead(req: any, res: any, next: any) {
    var projectId = req.params.projectId;
    if ((projectId === undefined) || (projectId === '') || (req.body.budgetedCostAmount === undefined) ||
      (req.body.costHead === undefined) || (req.body.budgetedCostAmount === '') || (req.body.costHead === '')) {
      next({
        reason: Messages.MSG_ERROR_EMPTY_FIELD,
        message: Messages.MSG_ERROR_EMPTY_FIELD,
        stackTrace: new Error(),
        code: 400
      });
    } else {
      next();
    }
  }

  getCategoriesOfBuildingCostHead(req: any, res: any, next: any) {
    var projectId = req.params.projectId;
    var buildingId = req.params.buildingId;
    var costHeadId = req.params.costHeadId;
    ProjectInterceptor.validateCostHeadIds(projectId, buildingId, costHeadId, (error, result) => {
      if (error) {
        next(error);
      } else {
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
  }

  getInActiveCategoriesByCostHeadId(req: any, res: any, next: any) {
    var projectId = req.params.projectId;
    var buildingId = req.params.buildingId;
    var costHeadId = req.params.costHeadId;
    ProjectInterceptor.validateCostHeadIds(projectId, buildingId, costHeadId, (error, result) => {
      if (error) {
        next(error);
      } else {
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
  }

  getAllCategoriesByCostHeadId(req: any, res: any, next: any) {
    var projectId = req.params.projectId;
    var buildingId = req.params.buildingId;
    var costHeadId = req.params.costHeadId;
    ProjectInterceptor.validateCostHeadIds(projectId, buildingId, costHeadId, (error, result) => {
      if (error) {
        next(error);
      } else {
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
  }

  updateCategoryStatus(req: any, res: any, next: any) {
    var projectId = req.params.projectId;
    var buildingId = req.params.buildingId;
    var costHeadId = req.params.costHeadId;
    var categoryId = req.params.categoryId;
    var activeStatus = req.params.activeStatus;
    ProjectInterceptor.validateCategoryIds(projectId, buildingId, costHeadId, categoryId, activeStatus, (error, result) => {
      if (error) {
        next(error);
      } else {
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
  }

  addCategoryByCostHeadId(req: any, res: any, next: any) {
    var projectId = req.params.projectId;
    var buildingId = req.params.buildingId;
    var costHeadId = req.params.costHeadId;
    ProjectInterceptor.validateCostHeadIds(projectId, buildingId, costHeadId, (error, result) => {
      if (error) {
        next(error);
      } else {
        if (result === false) {
          next({
            reason: Messages.MSG_ERROR_EMPTY_FIELD,
            message: Messages.MSG_ERROR_EMPTY_FIELD,
            stackTrace: new Error(),
            code: 400
          });
        } else {
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
  }

  deleteCategoryFromCostHead(req: any, res: any, next: any) {
    var projectId = req.params.projectId;
    var buildingId = req.params.buildingId;
    var costHeadId = req.params.costHeadId;
    ProjectInterceptor.validateCostHeadIds(projectId, buildingId, costHeadId, (error, result) => {
      if (error) {
        next(error);
      } else {
        if (result === false) {
          next({
            reason: Messages.MSG_ERROR_EMPTY_FIELD,
            message: Messages.MSG_ERROR_EMPTY_FIELD,
            stackTrace: new Error(),
            code: 400
          });
        } else {
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
  }

  updateWorkItemnameOfBuildingCostHeads(req: any, res: any, next: any) {
    var projectId = req.params.projectId;
    var buildingId = req.params.buildingId;
    var costHeadId = req.params.costHeadId;
    var categoryId = req.params.categoryId;
    var workItemRAId = req.params.workItemId;
    var ccWorkItemId = req.params.ccWorkItemId;
    var workItemName = req.body.workItemName;

    ProjectInterceptor.validateIdsForUpdateRate(projectId, buildingId, costHeadId, categoryId, workItemRAId, (error, result) => {
      if (error) {
        next(error);
      } else {
        if (result === false) {
          next({
            reason: Messages.MSG_ERROR_EMPTY_FIELD,
            message: Messages.MSG_ERROR_EMPTY_FIELD,
            stackTrace: new Error(),
            code: 400
          });
        } else {
          if ((req.params.ccWorkItemId === undefined) || (req.params.ccWorkItemId === '') ||
            (workItemName === undefined) || (workItemName=== '')) {
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
  }

  updateWorkItemStatusOfBuildingCostHeads(req: any, res: any, next: any) {
    var projectId = req.params.projectId;
    var buildingId = req.params.buildingId;
    var costHeadId = req.params.costHeadId;
    var categoryId = req.params.categoryId;
    var workItemRAId = req.params.workItemRAId;
    var ccWorkItemId = req.params.workItemId;
    var activeStatus = req.params.activeStatus;

    ProjectInterceptor.validateIdsForUpdateRate(projectId, buildingId, costHeadId, categoryId, workItemRAId, (error, result) => {
      if (error) {
        next(error);
      } else {
        if (result === false) {
          next({
            reason: Messages.MSG_ERROR_EMPTY_FIELD,
            message: Messages.MSG_ERROR_EMPTY_FIELD,
            stackTrace: new Error(),
            code: 400
          });
        } else {
          if ((ccWorkItemId === undefined) || (ccWorkItemId === '') ||
            (activeStatus === undefined) || (activeStatus=== '')) {
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
  }

  updateWorkItemNameOfBuildingCostHeads(req: any, res: any, next: any) {
    var projectId = req.params.projectId;
    var buildingId = req.params.buildingId;
    var costHeadId = req.params.costHeadId;
    var workItemName = req.body.workItemName;
    ProjectInterceptor.validateCostHeadIds(projectId, buildingId, costHeadId, (error, result) => {
      if (error) {
        next(error);
      } else {
        if (result === false) {
          next({
            reason: Messages.MSG_ERROR_EMPTY_FIELD,
            message: Messages.MSG_ERROR_EMPTY_FIELD,
            stackTrace: new Error(),
            code: 400
          });
        } else {
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
  }

  updateWorkItemStatusOfProjectCostHeads(req: any, res: any, next: any) {
    var projectId = req.params.projectId;
    var costHeadId = parseInt(req.params.costHeadId);
    var categoryId = parseInt(req.params.category);
    var workItemId = parseInt(req.params.costHeadId);
    ProjectInterceptor.validateProjectCostHeadIds(projectId, costHeadId, (error, result) => {
      if (error) {
        next(error);
      } else {
        if (result === false) {
          next({
            reason: Messages.MSG_ERROR_EMPTY_FIELD,
            message: Messages.MSG_ERROR_EMPTY_FIELD,
            stackTrace: new Error(),
            code: 400
          });
        } else {
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
  }

  getInActiveWorkItemsOfBuildingCostHeads(req: any, res: any, next: any) {
    var projectId = req.params.projectId;
    var buildingId = req.params.buildingId;
    var costHeadId = req.params.costHeadId;
    ProjectInterceptor.validateCostHeadIds(projectId, buildingId, costHeadId, (error, result) => {
      if (error) {
        next(error);
      } else {
        if (result === false) {
          next({
            reason: Messages.MSG_ERROR_EMPTY_FIELD,
            message: Messages.MSG_ERROR_EMPTY_FIELD,
            stackTrace: new Error(),
            code: 400
          });
        } else {
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
  }

  getWorkItemListOfBuildingCategory(req: any, res: any, next: any) {
    var projectId = req.params.projectId;
    var buildingId = req.params.buildingId;
    var costHeadId = req.params.costHeadId;
    ProjectInterceptor.validateCostHeadIds(projectId, buildingId, costHeadId, (error, result) => {
      if (error) {
        next(error);
      } else {
        if (result === false) {
          next({
            reason: Messages.MSG_ERROR_EMPTY_FIELD,
            message: Messages.MSG_ERROR_EMPTY_FIELD,
            stackTrace: new Error(),
            code: 400
          });
        } else {
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
  }

  getInActiveWorkItemsOfProjectCostHeads(req: any, res: any, next: any) {
    var projectId = req.params.projectId;
    var costHeadId = parseInt(req.params.costHeadId);
    let categoryId = parseInt(req.params.categoryId);
    ProjectInterceptor.validateProjectCostHeadIds(projectId, costHeadId, (error, result) => {
      if (error) {
        next(error);
      } else {
        if (result === false) {
          next({
            reason: Messages.MSG_ERROR_EMPTY_FIELD,
            message: Messages.MSG_ERROR_EMPTY_FIELD,
            stackTrace: new Error(),
            code: 400
          });
        } else {
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
  }

  getRate(req: any, res: any, next: any) {
    var projectId = req.params.projectId;
    var buildingId = req.params.buildingId;
    var costHeadId = req.params.costHeadId;
    ProjectInterceptor.validateCostHeadIds(projectId, buildingId, costHeadId, (error, result) => {
      if (error) {
        next(error);
      } else {
        if (result === false) {
          next({
            reason: Messages.MSG_ERROR_EMPTY_FIELD,
            message: Messages.MSG_ERROR_EMPTY_FIELD,
            stackTrace: new Error(),
            code: 400
          });
        } else {
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
  }

  updateQuantityOfBuildingCostHeads(req: any, res: any, next: any) {
    var projectId = req.params.projectId;
    var buildingId = req.params.buildingId;
    var costHeadId = req.params.costHeadId;
    var quantityDetails = req.body.item;
    ProjectInterceptor.validateCostHeadIds(projectId, buildingId, costHeadId, (error, result) => {
      if (error) {
        next(error);
      } else {
        if (result === false) {
          next({
            reason: Messages.MSG_ERROR_EMPTY_FIELD,
            message: Messages.MSG_ERROR_EMPTY_FIELD,
            stackTrace: new Error(),
            code: 400
          });
        } else {
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
  }

  updateDirectQuantityOfBuildingCostHeads(req: any, res: any, next: any) {
    var projectId = req.params.projectId;
    var buildingId = req.params.buildingId;
    var costHeadId = req.params.costHeadId;
    var directQuantity = req.body.directQuantity;
    ProjectInterceptor.validateCostHeadIds(projectId, buildingId, costHeadId, (error, result) => {
      if (error) {
        next(error);
      } else {
        if (result === false) {
          next({
            reason: Messages.MSG_ERROR_EMPTY_FIELD,
            message: Messages.MSG_ERROR_EMPTY_FIELD,
            stackTrace: new Error(),
            code: 400
          });
        } else {
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
  }

  updateDirectQuantityOfProjectWorkItems(req: any, res: any, next: any) {
    var projectId = req.params.projectId;
    var costHeadId = req.params.costHeadId;
    var directQuantity = req.body.directQuantity;
    ProjectInterceptor.validateProjectCostHeadIds(projectId, costHeadId, (error, result) => {
      if (error) {
        next(error);
      } else {
        if (result === false) {
          next({
            reason: Messages.MSG_ERROR_EMPTY_FIELD,
            message: Messages.MSG_ERROR_EMPTY_FIELD,
            stackTrace: new Error(),
            code: 400
          });
        } else {
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
  }

  updateWorkItemNameOfProjectCostHeads(req: any, res: any, next: any) {
    var projectId = req.params.projectId;
    var costHeadId = parseInt(req.params.costHeadId);
    var categoryId = parseInt(req.params.categoryId);
    var workItemId = parseInt(req.params.workItemId);
    var workItemName = req.body.workItemName;
    ProjectInterceptor.validateProjectCostHeadIds(projectId, costHeadId, (error, result) => {
      if (error) {
        next(error);
      } else {
        if (result === false) {
          next({
            reason: Messages.MSG_ERROR_EMPTY_FIELD,
            message: Messages.MSG_ERROR_EMPTY_FIELD,
            stackTrace: new Error(),
            code: 400
          });
        } else {
          if ((categoryId === undefined) || (workItemId === undefined) || (workItemName === undefined) ||
            (categoryId === null) || (workItemId === null) || (workItemName === '')) {
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
  }

  updateQuantityOfProjectCostHeads(req: any, res: any, next: any) {
    var projectId = req.params.projectId;
    var costHeadId = parseInt(req.params.costHeadId);
    var categoryId = parseInt(req.params.categoryId);
    var workItemId = parseInt(req.params.workItemId);
    var quantityDetails = req.body.item;
    ProjectInterceptor.validateProjectCostHeadIds(projectId, costHeadId, (error, result) => {
      if (error) {
        next(error);
      } else {
        if (result === false) {
          next({
            reason: Messages.MSG_ERROR_EMPTY_FIELD,
            message: Messages.MSG_ERROR_EMPTY_FIELD,
            stackTrace: new Error(),
            code: 400
          });
        } else {
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
  }

  deleteQuantityOfBuildingCostHeadsByName(req: any, res: any, next: any) {
    var projectId = req.params.projectId;
    var buildingId = req.params.buildingId;
    var costHeadId = req.params.costHeadId;
    var itemName = req.body.item.name;
    ProjectInterceptor.validateCostHeadIds(projectId, buildingId, costHeadId, (error, result) => {
      if (error) {
        next(error);
      } else {
        if (result === false) {
          next({
            reason: Messages.MSG_ERROR_EMPTY_FIELD,
            message: Messages.MSG_ERROR_EMPTY_FIELD,
            stackTrace: new Error(),
            code: 400
          });
        } else {
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
  }

  deleteQuantityOfProjectCostHeadsByName(req: any, res: any, next: any) {
    var projectId = req.params.projectId;
    var costHeadId = parseInt(req.params.costHeadId);
    var categoryId = parseInt(req.params.costHeadId);
    var workItemId = parseInt(req.params.costHeadId);
    var itemName = req.body.item;

    ProjectInterceptor.validateProjectCostHeadIds(projectId, costHeadId, (error, result) => {
      if (error) {
        next(error);
      } else {
        if (result === false) {
          next({
            reason: Messages.MSG_ERROR_EMPTY_FIELD,
            message: Messages.MSG_ERROR_EMPTY_FIELD,
            stackTrace: new Error(),
            code: 400
          });
        } else {
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
  }

  updateDirectRateOfBuildingWorkItems(req: any, res: any, next: any) {
    var projectId = req.params.projectId;
    var buildingId = req.params.buildingId;
    var costHeadId = req.params.costHeadId;
    var categoryId = parseInt(req.params.categoryId);
    var workItemId = parseInt(req.params.workItemId);
    var directRate = req.body.directRate;

    ProjectInterceptor.validateCostHeadIds(projectId, buildingId, costHeadId, (error, result) => {
      if (error) {
        next(error);
      } else {
        if (result === false) {
          next({
            reason: Messages.MSG_ERROR_EMPTY_FIELD,
            message: Messages.MSG_ERROR_EMPTY_FIELD,
            stackTrace: new Error(),
            code: 400
          });
        } else {
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
  }

  updateRateOfBuildingCostHeads(req: any, res: any, next: any) {
    var projectId = req.params.projectId;
    var buildingId = req.params.buildingId;
    var costHeadId = parseInt(req.params.costHeadId);
    var categoryId = parseInt(req.params.categoryId);
    var workItemId = parseInt(req.params.workItemId);
    ProjectInterceptor.validateIdsForUpdateRate(projectId, buildingId, costHeadId, categoryId, workItemId, (error, result) => {
      if (error) {
        next(error);
      } else {
        if (result === false) {
          next({
            reason: Messages.MSG_ERROR_EMPTY_FIELD,
            message: Messages.MSG_ERROR_EMPTY_FIELD,
            stackTrace: new Error(),
            code: 400
          });
        } else {
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
  }

  updateRateOfProjectCostHeads(req: any, res: any, next: any) {
    var projectId = req.params.projectId;
    var costHeadId = parseInt(req.params.costHeadId);
    var categoryId = parseInt(req.params.categoryId);
    var workItemId = parseInt(req.params.workItemId);
    ProjectInterceptor.validateProjectCostHeadIds(projectId, costHeadId, (error, result) => {
      if (error) {
        next(error);
      } else {
        if (result === false) {
          next({
            reason: Messages.MSG_ERROR_EMPTY_FIELD,
            message: Messages.MSG_ERROR_EMPTY_FIELD,
            stackTrace: new Error(),
            code: 400
          });
        } else {
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
  }

  updateDirectRateOfProjectWorkItems(req: any, res: any, next: any) {
    var projectId = req.params.projectId;
    var costHeadId = req.params.costHeadId;
    var categoryId = parseInt(req.params.categoryId);
    var workItemId = parseInt(req.params.workItemId);
    var directRate = req.body.directRate;

    ProjectInterceptor.validateProjectCostHeadIds(projectId, costHeadId, (error, result) => {
      if (error) {
        next(error);
      } else {
        if (result === false) {
          next({
            reason: Messages.MSG_ERROR_EMPTY_FIELD,
            message: Messages.MSG_ERROR_EMPTY_FIELD,
            stackTrace: new Error(),
            code: 400
          });
        } else {
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
  }

  syncProjectWithRateAnalysisData(req: any, res: any, next: any) {
    var projectId = req.params.projectId;
    var buildingId = req.params.buildingId;
    ProjectInterceptor.validateIds(projectId, buildingId, (error, result) => {
      if (error) {
        next(error);
      } else {
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
  }

  getBuildingRateItemsByOriginalName(req: any, res: any, next: any) {
    var projectId = req.params.projectId;
    var buildingId = req.params.buildingId;
    var originalRateItemName = req.body.originalRateItemName;
    ProjectInterceptor.validateIds(projectId, buildingId, (error, result) => {
      if (error) {
        next(error);
      } else {
        if (result === false) {
          next({
            reason: Messages.MSG_ERROR_EMPTY_FIELD,
            message: Messages.MSG_ERROR_EMPTY_FIELD,
            stackTrace: new Error(),
            code: 400
          });
        } else {
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
  }

  addAttachmentToBuildingWorkItem(req: any, res: any, next: any) {
    var projectId = req.params.projectId;
    var buildingId = req.params.buildingId;
    var costHeadId = req.params.costHeadId;
    var categoryId = req.params.categoryId;
    var workItemId = req.params.workItemId;
    var fileName = req;

    ProjectInterceptor.validateCostHeadIds(projectId, buildingId, costHeadId,  (error, result) => {
      if (error) {
        next(error);
      } else {
        if (result === false) {
          next({
            reason: Messages.MSG_ERROR_EMPTY_FIELD,
            message: Messages.MSG_ERROR_EMPTY_FIELD,
            stackTrace: new Error(),
            code: 400
          });
        } else {
          if( (categoryId === undefined) || (categoryId === '') ||
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
   }
  checkPresentFilesForBuildingWorkItem(req: any, res: any, next: any) {
    var projectId = req.params.projectId;
    var buildingId = req.params.buildingId;
    var costHeadId = req.params.costHeadId;
    ProjectInterceptor.validateCostHeadIds(projectId, buildingId, costHeadId, (error, result) => {
      if (error) {
        next(error);
      } else {
        if (result === false) {
          next({
            reason: Messages.MSG_ERROR_EMPTY_FIELD,
            message: Messages.MSG_ERROR_EMPTY_FIELD,
            stackTrace: new Error(),
            code: 400
          });
        } else {
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
  }
  addAttachmentToProjectWorkItem(req: any, res: any, next: any) {
    var projectId = req.params.projectId;
    var costHeadId = req.params.costHeadId;
    var categoryId = req.params.categoryId;
    var workItemId = req.params.workItemId;
    var fileName = req;

    ProjectInterceptor.validateProjectCostHeadIds(projectId,costHeadId, (error, result) => {
      if (error) {
        next(error);
      } else {
        if (result === false) {
          next({
            reason: Messages.MSG_ERROR_EMPTY_FIELD,
            message: Messages.MSG_ERROR_EMPTY_FIELD,
            stackTrace: new Error(),
            code: 400
          });
        } else {
          if( (categoryId === undefined) || (categoryId === '') ||
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
  }
  checkPresentFilesForProjectWorkItem(req: any, res: any, next: any) {
    var projectId = req.params.projectId;
    var costHeadId = parseInt(req.params.costHeadId);
    var categoryId = parseInt(req.params.categoryId);
    var workItemId = parseInt(req.params.workItemId);
    ProjectInterceptor.validateProjectCostHeadIds(projectId, costHeadId, (error, result) => {
      if (error) {
        next(error);
      } else {
        if (result === false) {
          next({
            reason: Messages.MSG_ERROR_EMPTY_FIELD,
            message: Messages.MSG_ERROR_EMPTY_FIELD,
            stackTrace: new Error(),
            code: 400
          });
        } else {
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
  }

  updateGstOfBuildingWorkItems(req: any, res: any, next: any) {
    var projectId = req.params.projectId;
    var buildingId = req.params.buildingId;
    var costHeadId = req.params.costHeadId;
    var categoryId = parseInt(req.params.categoryId);
    var workItemId = parseInt(req.params.workItemId);
    var gst = req.body.gst;

    ProjectInterceptor.validateCostHeadIds(projectId, buildingId, costHeadId, (error, result) => {
      if (error) {
        next(error);
      } else {
        if (result === false) {
          next({
            reason: Messages.MSG_ERROR_EMPTY_FIELD,
            message: Messages.MSG_ERROR_EMPTY_FIELD,
            stackTrace: new Error(),
            code: 400
          });
        } else {
          if ((categoryId === undefined) || (workItemId === undefined) ||
            (categoryId === null) || (workItemId === null) ) {
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
  }

  updateGstOfProjectWorkItems(req: any, res: any, next: any) {
    var projectId = req.params.projectId;
    var costHeadId = req.params.costHeadId;
    var categoryId = parseInt(req.params.categoryId);
    var workItemId = parseInt(req.params.workItemId);
    var gst = req.body.gst;

    ProjectInterceptor.validateProjectCostHeadIds(projectId, costHeadId, (error, result) => {
      if (error) {
        next(error);
      } else {
        if (result === false) {
          next({
            reason: Messages.MSG_ERROR_EMPTY_FIELD,
            message: Messages.MSG_ERROR_EMPTY_FIELD,
            stackTrace: new Error(),
            code: 400
          });
        } else {
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
  }


}export = ProjectInterceptor;
