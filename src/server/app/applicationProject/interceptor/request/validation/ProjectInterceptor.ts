import Messages=require('../../../shared/messages');


class ProjectInterceptor {
  public static validateProjectId(projectId: string,  callback: (error: any, result: any) => void) {
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
if((projectId === undefined || buildingId === undefined || costHeadId === undefined) || (projectId === '' || buildingId === '' || costHeadId === '')) {
      callback(null, false);
    } else callback(null, true);
  }

  public static validateIdsForUpdateRate(projectId: string, buildingId: string, costHeadId: number, categoryId: number,
                                         workItemId: number, callback: (error: any, result: any) => void) {
    if((projectId === undefined || buildingId === undefined || costHeadId === undefined || categoryId === undefined ||
        workItemId === undefined) || (projectId === '' || buildingId === '' || costHeadId === null || categoryId === null ||
        workItemId === null)) {
      callback(null, false);
    } else callback(null, true);
  }

  public static validateCategoryIds(projectId: string, buildingId: string, costHeadId: number, categoryId: number,
                                    activeStatus: number, callback: (error: any, result: any) => void) {
    if((projectId === undefined || buildingId === undefined || costHeadId === undefined || categoryId === undefined ||
        activeStatus === undefined) || (projectId === '' || buildingId === '' || costHeadId === null || categoryId === null
        || activeStatus === null)) {
      callback(null, false);
    } else callback(null, true);
  }


  constructor() {
  }

  createProject(req: any, res: any, next: any) {
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
            (req.body.numOfParkingFloors === undefined) || (req.body.carpetAreaOfParking === undefined) ||(req.body.name === '') ||
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

  setCostHeadStatus(req: any, res: any, next: any) {
    var projectId = req.params.projectId;
    var buildingId = req.params.buildingId;
    var costHeadId = req.params.costHeadId;
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
          if((req.params.activeStatus === undefined) || (req.params.activeStatus === '') ) {
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

  updateBudgetedCostForCostHead(req: any, res: any, next: any) {
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
  }

  getCategory(req: any, res: any, next: any) {
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

  getCategoryByCostHeadId(req: any, res: any, next: any) {
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

  setCategoryStatus(req: any, res: any, next: any) {
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

  setWorkItemStatus(req: any, res: any, next: any) {
    var projectId = req.params.projectId;
    var buildingId = req.params.buildingId;
    var costHeadId = req.params.costHeadId;
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
      if( (req.params.workItemId === undefined) || (req.params.workItemId === '') ||
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

  getInActiveWorkItems(req: any, res: any, next: any) {
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

  updateQuantity(req: any, res: any, next: any) {
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
  }

  deleteQuantityByName(req: any, res: any, next: any) {
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
  }

  updateRate(req: any, res: any, next: any) {
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
          if ((req.params.categoryId === undefined) || (req.params.workItemId === undefined) ||(req.body.quantity  === undefined)  ||
            (req.body.rateItems === undefined)  || (req.body.total  === undefined) || (req.body.unit === undefined) ||
            (req.params.categoryId === '') || (req.params.workItemId === '') || (req.body.quantity  === '') ||
            (req.body.rateItems === '')  || (req.body.total  === '') || (req.body.unit === '')) {
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
