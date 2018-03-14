import ProjectRepository = require('../dataaccess/repository/ProjectRepository');
import BuildingRepository = require('../dataaccess/repository/BuildingRepository');
import UserService = require('./../../framework/services/UserService');
import ProjectAsset = require('../../framework/shared/projectasset');
import User = require('../../framework/dataaccess/mongoose/user');
import Project = require('../dataaccess/mongoose/Project');
import Building = require('../dataaccess/mongoose/Building');
import BuildingModel = require('../dataaccess/model/project/building/Building');
import AuthInterceptor = require('../../framework/interceptor/auth.interceptor');
import CostControllException = require('../exception/CostControllException');
import Quantity = require('../dataaccess/model/project/building/Quantity');
import Rate = require('../dataaccess/model/project/building/Rate');
import CostHead = require('../dataaccess/model/project/building/CostHead');
import WorkItem = require('../dataaccess/model/project/building/WorkItem');
import RateAnalysisService = require('./RateAnalysisService');
import Category = require('../dataaccess/model/project/building/Category');
let config = require('config');
let log4js = require('log4js');
import alasql = require('alasql');
import BudgetCostRates = require('../dataaccess/model/project/reports/BudgetCostRates');
import ThumbRuleRate = require('../dataaccess/model/project/reports/ThumbRuleRate');
import Constants = require('../../applicationProject/shared/constants');
let logger=log4js.getLogger('Project service');

class ProjectService {
  APP_NAME: string;
  company_name: string;
  costHeadId: number;
  categoryId: number;
  workItemId: number;
  private projectRepository: ProjectRepository;
  private buildingRepository: BuildingRepository;
  private authInterceptor: AuthInterceptor;
  private userService : UserService;

  constructor() {
    this.projectRepository = new ProjectRepository();
    this.buildingRepository = new BuildingRepository();
    this.APP_NAME = ProjectAsset.APP_NAME;
    this.authInterceptor = new AuthInterceptor();
    this.userService = new UserService();
  }

  createProject(data: Project, user : User, callback: (error: any, result: any) => void) {
    if(!user._id) {
      callback(new CostControllException('UserId Not Found',null), null);
    }

    this.projectRepository.create(data, (err, res) => {
      if (err) {
        callback(err, null);
      } else {
        logger.info('Project service, create has been hit');
        logger.debug('Project ID : '+res._id);
        logger.debug('Project Name : '+res.name);
        let projectId = res._id;
        let newData =  {$push: { project: projectId }};
        let query = {_id : user._id};
        this.userService.findOneAndUpdate(query, newData, {new :true},(err, resp) => {
          logger.info('Project service, findOneAndUpdate has been hit');
          if(err) {
            callback(err, null);
          } else {
            delete res.category;
            delete res.rate;
            callback(null, res);
          }
        });
      }
    });
  }

  getProjectById( projectId : string, user: User, callback: (error: any, result: any) => void) {
    let query = { _id: projectId};
    let populate = {path : 'building', select: ['name' , 'totalSlabArea',]};
    this.projectRepository.findAndPopulate(query, populate, (error, result) => {
      logger.info('Project service, findAndPopulate has been hit');
      logger.debug('Project Name : '+result[0].name);
      if(error) {
        callback(error, null);
      } else {
        callback(null,{ data: result, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  getProjectAndBuildingDetails( projectId : string, buildingId: string, callback: (error: any, result: any) => void) {
    let query = { _id: projectId};
    let populate = {path : 'buildings'};
    this.projectRepository.findAndPopulate(query, populate, (error, result) => {
      logger.info('Project service, findAndPopulate has been hit');
      logger.debug('Project Name : '+result[0].name);
      if(error) {
        callback(error, null);
      } else {
        callback(null,{ data: result });
      }
    });
  }

  updateProjectById( projectDetails: Project, user: User, callback:(error: any, result:any) => void) {
    logger.info('Project service, updateProjectDetails has been hit');
    let query = { _id : projectDetails._id };
    delete projectDetails._id;

    this.projectRepository.findOneAndUpdate(query, projectDetails, {new: true}, (error, result) => {
      logger.info('Project service, findOneAndUpdate has been hit');
      if (error) {
        callback(error, null);
      } else {
        callback(null, {data: result, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  createBuilding(projectId : string, buildingDetails : Building, user: User, callback:(error: any, result: any)=> void) {
    this.buildingRepository.create(buildingDetails, (error, result)=> {
      logger.info('Project service, create has been hit');
      if(error) {
        callback(error, null);
      } else {
        let query = {_id : projectId };
        let newData = { $push: {buildings : result._id}};
        this.projectRepository.findOneAndUpdate(query, newData, {new : true}, (error, status)=> {
          logger.info('Project service, findOneAndUpdate has been hit');
          if(error) {
            callback(error, null);
          } else {
            callback(null, {data: result, access_token: this.authInterceptor.issueTokenWithUid(user)});
          }
        });
      }
    });
  }

  updateBuildingById( buildingId:string, buildingDetails:any, user:User, callback:(error: any, result: any)=> void) {
    logger.info('Project service, updateBuilding has been hit');
    let query = { _id : buildingId };
    this.buildingRepository.findOneAndUpdate(query, buildingDetails,{new: true}, (error, result) => {
      logger.info('Project service, findOneAndUpdate has been hit');
      if (error) {
        callback(error, null);
      } else {
        callback(null, {data: result, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  cloneBuildingDetails( buildingId:string, buildingDetails:any, user:User, callback:(error: any, result: any)=> void) {
    logger.info('Project service, cloneBuildingDetails has been hit');
    let query = { _id : buildingId };
    this.buildingRepository.findById(buildingId, (error, result) => {
      logger.info('Project service, findById has been hit');
      if (error) {
        callback(error, null);
      } else {
        let clonedCostHeadDetails :Array<CostHead>=[];
        let costHeads =buildingDetails.costHeads;
        let resultCostHeads = result.costHeads;
        for(let costHead of costHeads) {
          for(let resultCostHead of resultCostHeads) {
            if(costHead.name === resultCostHead.name) {
              let clonedCostHead = new CostHead;
              clonedCostHead.name = resultCostHead.name;
              clonedCostHead.rateAnalysisId = resultCostHead.rateAnalysisId;
              clonedCostHead.active = costHead.active;
              clonedCostHead.thumbRuleRate = resultCostHead.thumbRuleRate;

              if(costHead.active) {

                let categoryList = costHead.category;
                let resultCategoryList = resultCostHead.categories;
                for(let resultCategoryIndex=0; resultCategoryIndex<resultCategoryList.length; resultCategoryIndex++) {
                  for(let categoryIndex=0 ; categoryIndex<categoryList.length; categoryIndex++) {
                    if(categoryList[categoryIndex].name === resultCategoryList[resultCategoryIndex].name) {
                      if(!categoryList[categoryIndex].active) {
                        resultCategoryList.splice(resultCategoryIndex,1);
                      } else {
                        let resultWorkitemList = resultCategoryList[resultCategoryIndex].workItems;
                        let workItemList = categoryList[categoryIndex].workItems;

                        for(let resultWorkitemIndex=0;  resultWorkitemIndex < resultWorkitemList.length; resultWorkitemIndex++) {
                          for(let workitemIndex=0;  workitemIndex < workItemList.length; workitemIndex++) {
                            if(!workItemList[workitemIndex].active) {
                              resultWorkitemList.splice(resultWorkitemIndex, 1);
                            }
                          }
                        }
                      }
                    }
                  }
                }
                clonedCostHead.categories = resultCostHead.categories;
              } else {
                clonedCostHead.categories = resultCostHead.categories;
              }
                clonedCostHeadDetails.push(clonedCostHead);
            }
          }
        }

        let updateBuildingCostHeads = {'costHeads' : clonedCostHeadDetails};
        this.buildingRepository.findOneAndUpdate(query, updateBuildingCostHeads,{new: true}, (error, result) => {
          logger.info('Project service, findOneAndUpdate has been hit');
          if (error) {
            callback(error, null);
          } else {
            callback(null, {data: result, access_token: this.authInterceptor.issueTokenWithUid(user)});
          }
        });
      }
    });
  }

  getBuildingById(projectId : string, buildingId : string, user: User, callback:(error: any, result: any)=> void) {
    logger.info('Project service, getBuilding has been hit');
    this.buildingRepository.findById(buildingId, (error, result) => {
      logger.info('Project service, findById has been hit');
      if (error) {
        callback(error, null);
      } else {
        callback(null, {data: result, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  getInActiveCostHead(projectId: string, buildingId: string, user: User, callback:(error: any, result: any)=> void) {
    logger.info('Project service, getInActiveCostHead has been hit');
    this.buildingRepository.findById(buildingId, (error, result) => {
      if (error) {
        callback(error, null);
      } else {
        logger.info('Project service, findById has been hit');
        logger.debug('getting InActive CostHead for Building Name : '+result.name);
        let response = result.costHeads;
        let inActiveCostHead=[];
        for(let costHeadItem of response) {
          if(!costHeadItem.active) {
            inActiveCostHead.push(costHeadItem);
          }
        }
        callback(null,{data:inActiveCostHead, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  getInActiveWorkItems(projectId:string, buildingId:string, costHeadId:number, categoryId:number,
                       user:User, callback:(error: any, result: any)=> void) {
    logger.info('Project service, add Workitem has been hit');
    this.buildingRepository.findById(buildingId, (error, building:Building) => {
      if (error) {
        callback(error, null);
      } else {
        let costHeadList = building.costHeads;
        let categoryList: Category[];
        let workItemList: WorkItem[];
        let inActiveWorkItems = [];

        for (let index = 0; index < costHeadList.length; index++) {
          if (costHeadId === costHeadList[index].rateAnalysisId) {
            categoryList = costHeadList[index].categories;
            for (let subCategoryIndex = 0; subCategoryIndex < categoryList.length; subCategoryIndex++) {
              if (categoryId === categoryList[subCategoryIndex].rateAnalysisId) {
                workItemList = categoryList[subCategoryIndex].workItems;
                for (let checkWorkItem of workItemList) {
                  if(!checkWorkItem.active) {
                    inActiveWorkItems.push(checkWorkItem);
                  }
                }
              }
            }
          }
        }
        callback(null,{data:inActiveWorkItems, access_token: this.authInterceptor.issueTokenWithUid(user)});
        }
    });
  }

  // Get In Active WorkItems Of Project Cost Heads
  getInActiveWorkItemsOfProjectCostHeads(projectId:string, costHeadId:number, categoryId:number,
                                         user:User, callback:(error: any, result: any)=> void) {
    logger.info('Project service, Get In-Active WorkItems Of Project Cost Heads has been hit');
    this.projectRepository.findById(projectId, (error, project:Project) => {
      if (error) {
        callback(error, null);
      } else {
        let costHeadList = project.projectCostHeads;
        let categoryList: Category[];
        let workItemList: WorkItem[];
        let inActiveWorkItems = [];

        for (let costHead of costHeadList) {
          if (costHeadId === costHead.rateAnalysisId) {
            categoryList = costHead.categories;
            for (let category of categoryList) {
              if (categoryId === category.rateAnalysisId) {
                workItemList = category.workItems;
                for (let checkWorkItem of workItemList) {
                  if(!checkWorkItem.active) {
                    inActiveWorkItems.push(checkWorkItem);
                  }
                }
              }
            }
          }
        }
        callback(null,{data:inActiveWorkItems, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  getBuildingByIdForClone(projectId : string, buildingId : string, user: User, callback:(error: any, result: any)=> void) {
    logger.info('Project service, getClonedBuilding has been hit');
    this.buildingRepository.findById(buildingId, (error, result) => {
      logger.info('Project service, findById has been hit');
      if (error) {
        callback(error, null);
      } else {
        let clonedBuilding = result.costHeads;
        let building = new BuildingModel();
        building.name = result.name;
        building.totalSlabArea = result.totalSlabArea;
        building.totalCarpetAreaOfUnit = result.totalCarpetAreaOfUnit;
        building.totalSaleableAreaOfUnit = result.totalSaleableAreaOfUnit;
        building.plinthArea = result.plinthArea;
        building.totalNumOfFloors = result.totalNumOfFloors;
        building.numOfParkingFloors = result.numOfParkingFloors;
        building.carpetAreaOfParking = result.carpetAreaOfParking;
        building.numOfOneBHK = result.numOfOneBHK;
        building.numOfTwoBHK = result.numOfTwoBHK;
        building.numOfThreeBHK = result.numOfThreeBHK;
        building.numOfFourBHK = result.numOfFourBHK;
        building.numOfFiveBHK = result.numOfFiveBHK;
        building.numOfLifts = result.numOfLifts;

        /*let clonedCostHeadArray : Array<ClonedCostHead> = [];

        for(let costHeadIndex = 0; costHeadIndex < clonedBuilding.length; costHeadIndex++) {

          let clonedCostHead = new ClonedCostHead;
          clonedCostHead.name = clonedBuilding[costHeadIndex].name;
          clonedCostHead.rateAnalysisId = clonedBuilding[costHeadIndex].rateAnalysisId;
          clonedCostHead.active = clonedBuilding[costHeadIndex].active;
          clonedCostHead.budgetedCostAmount = clonedBuilding[costHeadIndex].budgetedCostAmount;

          let clonedWorkItemArray : Array<ClonedWorkItem> = [];
          let clonedCategoryArray : Array<ClonedCategory> = [];
          let categoryArray = clonedBuilding[costHeadIndex].categories;

          for(let categoryIndex=0; categoryIndex<categoryArray.length; categoryIndex++) {
            let clonedCategory = new ClonedCategory();
            clonedCategory.name = categoryArray[categoryIndex].name;
            clonedCategory.rateAnalysisId = categoryArray[categoryIndex].rateAnalysisId;
            clonedCategory.amount = categoryArray[categoryIndex].amount;
            clonedCategory.active = true;

            let workitemArray = categoryArray[categoryIndex].workItems;
            for(let workitemIndex=0; workitemIndex< workitemArray.length; workitemIndex++) {
              let clonedWorkItem = new ClonedWorkItem();
              clonedWorkItem.name = workitemArray[workitemIndex].name;
              clonedWorkItem.rateAnalysisId =  workitemArray[workitemIndex].rateAnalysisId;
              clonedWorkItem.unit =  workitemArray[workitemIndex].unit;
              clonedWorkItem.amount = workitemArray[workitemIndex].amount;
              clonedWorkItem.rate = workitemArray[workitemIndex].rate;
              clonedWorkItem.quantity = workitemArray[workitemIndex].quantity;
              clonedWorkItemArray.push(clonedWorkItem);
            }
            clonedCategory.workItems = clonedWorkItemArray;
            clonedCategoryArray.push(clonedCategory);
          }
          clonedCostHead.categories = clonedCategoryArray;
          clonedCostHeadArray.push(clonedCostHead);
        }*/
        building.costHeads = result.costHeads;
        callback(null, {data: building, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  deleteBuildingById(projectId:string, buildingId:string, user:User, callback:(error: any, result: any)=> void) {
    logger.info('Project service, deleteBuilding has been hit');
    let popBuildingId = buildingId;
    this.buildingRepository.delete(buildingId, (error, result)=> {
      if(error) {
        callback(error, null);
      } else {
        let query = {_id: projectId};
        let newData = { $pull: {buildings : popBuildingId}};
        this.projectRepository.findOneAndUpdate(query, newData, {new: true}, (error, status)=> {
          logger.info('Project service, findOneAndUpdate has been hit');
          if(error) {
            callback(error, null);
          } else {
            callback(null, {data: status, access_token: this.authInterceptor.issueTokenWithUid(user)});
          }
        });
      }
    });
  }

  getRate(projectId:string, buildingId:string, costHeadId:number,categoryId:number, workItemId:number, user : User,
          callback:(error: any, result: any)=> void) {
    logger.info('Project service, getRate has been hit');

    let rateAnalysisServices: RateAnalysisService = new RateAnalysisService();
    rateAnalysisServices.getRate(workItemId, (error, rateData) => {
      if (error) {
        callback(error, null);
      } else {
        let rate :Rate = new Rate();
        rate.rateItems = rateData;
        callback(null, {data: rateData, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  updateRate(projectId:string, buildingId:string, costHeadId:number,categoryId:number,
             workItemId:number, rate :Rate, user : User, callback:(error: any, result: any)=> void) {
    logger.info('Project service, updateRate has been hit');
    this.buildingRepository.findById(buildingId, (error, building:Building) => {
      logger.info('Project service, findById has been hit');
      if (error) {
        callback(error, null);
      } else {
        let rateAnalysisId: number;
        for(let index = 0; building.costHeads.length > index; index++) {
          if(building.costHeads[index].rateAnalysisId === costHeadId) {
            for(let indexCategory = 0; building.costHeads[index].categories.length > indexCategory; indexCategory++) {
              if (building.costHeads[index].categories[indexCategory].rateAnalysisId === categoryId) {
                for(let indexWorkitem = 0; building.costHeads[index].categories[indexCategory].workItems.length >
                indexWorkitem; indexWorkitem++) {
                  if (building.costHeads[index].categories[indexCategory].workItems[indexWorkitem].rateAnalysisId === workItemId) {
                    building.costHeads[index].categories[indexCategory].workItems[indexWorkitem].rate=rate;
                  }
                }
              }
            }
          }
        }
        let query = {'_id' : buildingId};
        let newData = { $set : {'costHeads' : building.costHeads}};
        this.buildingRepository.findOneAndUpdate(query, newData,{new: true}, (error, result) => {
          if (error) {
            callback(error, null);
          } else {
            callback(null, {data: rate, access_token: this.authInterceptor.issueTokenWithUid(user)});
          }
        });
      }
    });
  }

  //Update rate of project cost heads
  updateRateOfProjectCostHeads(projectId:string, costHeadId:number,categoryId:number,
             workItemId:number, rate :Rate, user : User, callback:(error: any, result: any)=> void) {
    logger.info('Project service, updateRate has been hit');
    this.projectRepository.findById(projectId, (error, project : Project) => {
      logger.info('Project service, findById has been hit');
      if (error) {
        callback(error, null);
      } else {
        let projectCostHeads = project.projectCostHeads;
        for(let index = 0; projectCostHeads.length > index; index++) {
          if(projectCostHeads[index].rateAnalysisId === costHeadId) {
            for(let indexCategory = 0; projectCostHeads[index].categories.length > indexCategory; indexCategory++) {
              if (projectCostHeads[index].categories[indexCategory].rateAnalysisId === categoryId) {
                for(let indexWorkitem = 0; projectCostHeads[index].categories[indexCategory].workItems.length >
                indexWorkitem; indexWorkitem++) {
                  if (projectCostHeads[index].categories[indexCategory].workItems[indexWorkitem].rateAnalysisId === workItemId) {
                    projectCostHeads[index].categories[indexCategory].workItems[indexWorkitem].rate=rate;
                  }
                }
              }
            }
          }
        }
        let query = {'_id' : projectId};
        let newData = { $set : {'projectCostHeads' : projectCostHeads}};
        this.projectRepository.findOneAndUpdate(query, newData,{new: true}, (error, result) => {
          if (error) {
            callback(error, null);
          } else {
            callback(null, {data: 'success', access_token: this.authInterceptor.issueTokenWithUid(user)});
          }
        });
      }
    });
  }

  deleteQuantityByName(projectId:string, buildingId:string, costHeadId:string, categoryId:string,
                 workItemId:string, item:string, user:User, callback:(error: any, result: any)=> void) {
    logger.info('Project service, deleteQuantity has been hit');
    this.buildingRepository.findById(buildingId, (error, building:Building) => {
      if (error
      ) {
        callback(error, null);
      } else {
        let quantity: Quantity;
         this.costHeadId = parseInt(costHeadId);
          this.categoryId = parseInt(categoryId);
          this.workItemId = parseInt(workItemId);

          for(let index = 0; building.costHeads.length > index; index++) {
            if (building.costHeads[index].rateAnalysisId === this.costHeadId) {
              for (let index1 = 0; building.costHeads[index].categories.length > index1; index1++) {
                if (building.costHeads[index].categories[index1].rateAnalysisId === this.categoryId) {
                  for (let index2 = 0; building.costHeads[index].categories[index1].workItems.length > index2; index2++) {
                    if (building.costHeads[index].categories[index1].workItems[index2].rateAnalysisId === this.workItemId) {
                      quantity = building.costHeads[index].categories[index1].workItems[index2].quantity;
                    }
                  }
                }
              }
            }
          }

        for(let index = 0; quantity.quantityItems.length > index; index ++) {
          if(quantity.quantityItems[index].item  === item) {
            quantity.quantityItems.splice(index,1);
          }
        }

        let query = { _id : buildingId };
        this.buildingRepository.findOneAndUpdate(query, building,{new: true}, (error, building) => {
          logger.info('Project service, findOneAndUpdate has been hit');
          if (error) {
            callback(error, null);
          } else {
            let quantity: Quantity;

            for(let index = 0; building.costHeads.length > index; index++) {
              if (building.costHeads[index].rateAnalysisId === this.costHeadId) {
                for (let index1 = 0; building.costHeads[index].categories.length > index1; index1++) {
                  if (building.costHeads[index].categories[index1].rateAnalysisId === this.categoryId) {
                    for (let index2 = 0; building.costHeads[index].categories[index1].workItems.length > index2; index2++) {
                      if (building.costHeads[index].categories[index1].workItems[index2].rateAnalysisId === this.workItemId) {
                        quantity = building.costHeads[index].categories[index1].workItems[index2].quantity;
                      }
                    }
                  }
                }
              }
            }

            if(quantity.total) {
              if(quantity.quantityItems.length !== 0) {
                for(let index = 0; quantity.quantityItems.length > index; index ++) {
                  quantity.total = quantity.quantityItems[index].quantity + quantity.total;
                }
              }else {
                quantity.total = 0;
              }
            }
            callback(null, {data: quantity, access_token: this.authInterceptor.issueTokenWithUid(user)});
          }
        });
      }
    });
  }

  deleteQuantityOfProjectCostHeadsByName(projectId:string, costHeadId:string, categoryId:string,
                       workItemId:string, item:string, user:User, callback:(error: any, result: any)=> void) {
    logger.info('Project service, deleteQuantity has been hit');
    this.projectRepository.findById(projectId, (error, project : Project) => {
      if (error
      ) {
        callback(error, null);
      } else {
        let quantity: Quantity;
        this.costHeadId = parseInt(costHeadId);
        this.categoryId = parseInt(categoryId);
        this.workItemId = parseInt(workItemId);

        for(let index = 0; project.projectCostHeads.length > index; index++) {
          if (project.projectCostHeads[index].rateAnalysisId === this.costHeadId) {
            for (let index1 = 0; project.projectCostHeads[index].categories.length > index1; index1++) {
              if (project.projectCostHeads[index].categories[index1].rateAnalysisId === this.categoryId) {
                for (let index2 = 0; project.projectCostHeads[index].categories[index1].workItems.length > index2; index2++) {
                  if (project.projectCostHeads[index].categories[index1].workItems[index2].rateAnalysisId === this.workItemId) {
                    quantity = project.projectCostHeads[index].categories[index1].workItems[index2].quantity;
                  }
                }
              }
            }
          }
        }

        for(let index = 0; quantity.quantityItems.length > index; index ++) {
          if(quantity.quantityItems[index].item  === item) {
            quantity.quantityItems.splice(index,1);
          }
        }

        let query = { _id : projectId };
        this.projectRepository.findOneAndUpdate(query, project,{new: true}, (error, project : Project) => {
          logger.info('Project service, findOneAndUpdate has been hit');
          if (error) {
            callback(error, null);
          } else {
            let quantity: Quantity;

            for(let index = 0; project.projectCostHeads.length > index; index++) {
              if (project.projectCostHeads[index].rateAnalysisId === this.costHeadId) {
                for (let index1 = 0; project.projectCostHeads[index].categories.length > index1; index1++) {
                  if (project.projectCostHeads[index].categories[index1].rateAnalysisId === this.categoryId) {
                    for (let index2 = 0; project.projectCostHeads[index].categories[index1].workItems.length > index2; index2++) {
                      if (project.projectCostHeads[index].categories[index1].workItems[index2].rateAnalysisId === this.workItemId) {
                        quantity = project.projectCostHeads[index].categories[index1].workItems[index2].quantity;
                      }
                    }
                  }
                }
              }
            }

            if(quantity.total) {
              if(quantity.quantityItems.length !== 0) {
                for(let index = 0; quantity.quantityItems.length > index; index ++) {
                  quantity.total = quantity.quantityItems[index].quantity + quantity.total;
                }
              }else {
                quantity.total = 0;
              }
            }
            callback(null, {data: 'success', access_token: this.authInterceptor.issueTokenWithUid(user)});
          }
        });
      }
    });
  }

  deleteWorkitem(projectId:string, buildingId:string, costHeadId:number, categoryId:number, workItemId:number, user:User,
                 callback:(error: any, result: any)=> void) {
    logger.info('Project service, delete Workitem has been hit');
    this.buildingRepository.findById(buildingId, (error, building:Building) => {
      if (error) {
        callback(error, null);
      } else {
        let costHeadList = building.costHeads;
        let categoryList: Category[];
        let WorkItemList: WorkItem[];
        var flag = 0;

        for (let index = 0; index < costHeadList.length; index++) {
          if (costHeadId === costHeadList[index].rateAnalysisId) {
            categoryList = costHeadList[index].categories;
            for (let categoryIndex = 0; categoryIndex < categoryList.length; categoryIndex++) {
              if (categoryId === categoryList[categoryIndex].rateAnalysisId) {
                WorkItemList = categoryList[categoryIndex].workItems;
                for (let workitemIndex = 0; workitemIndex < WorkItemList.length; workitemIndex++) {
                  if (workItemId === WorkItemList[workitemIndex].rateAnalysisId) {
                    flag = 1;
                    WorkItemList.splice(workitemIndex, 1);
                  }
                }
              }
            }
          }
        }

        if(flag === 1) {
          let query = {_id: buildingId};
          this.buildingRepository.findOneAndUpdate(query, building, {new: true}, (error, WorkItemList) => {
            logger.info('Project service, findOneAndUpdate has been hit');
            if (error) {
              callback(error, null);
            } else {
              let message = 'WorkItem deleted.';
              callback(null, {data: WorkItemList, access_token: this.authInterceptor.issueTokenWithUid(user)});
            }
          });
        } else {
          callback(error, null);
        }
      }
    });
  }

  setCostHeadStatus( buildingId : string, costHeadId : number, costHeadActiveStatus : string, user: User,
                          callback: (error: any, result: any) => void) {
    let query = {'_id' : buildingId, 'costHeads.rateAnalysisId' : costHeadId};
    let activeStatus = JSON.parse(costHeadActiveStatus);
    let newData = { $set : {'costHeads.$.active' : activeStatus}};
    this.buildingRepository.findOneAndUpdate(query, newData, {new: true},(err, response) => {
      logger.info('Project service, findOneAndUpdate has been hit');
      if(err) {
        callback(err, null);
      } else {
        callback(null, {data: response, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  setWorkItemStatus( buildingId:string, costHeadId:number, categoryId:number, workItemId:number, workItemActiveStatus : boolean,
                   user: User, callback: (error: any, result: any) => void) {
    logger.info('Project service, update Workitem has been hit');
    this.buildingRepository.findById(buildingId, (error, building:Building) => {
      if (error) {
        callback(error, null);
      } else {
        let costHeadList = building.costHeads;
        let categoryList: Category[];
        let workItemList: WorkItem[];
        let isWorkItemUpdated : boolean = false;

        for (let index = 0; index < costHeadList.length; index++) {
          if (costHeadId === costHeadList[index].rateAnalysisId) {
            categoryList = costHeadList[index].categories;
            for (let subCategoryIndex = 0; subCategoryIndex < categoryList.length; subCategoryIndex++) {
              if (categoryId === categoryList[subCategoryIndex].rateAnalysisId) {
                workItemList = categoryList[subCategoryIndex].workItems;
                for (let workItemIndex = 0; workItemIndex < workItemList.length; workItemIndex++) {
                  if (workItemId === workItemList[workItemIndex].rateAnalysisId) {
                    isWorkItemUpdated = true;
                    workItemList[workItemIndex].active = workItemActiveStatus;
                  }
                }
              }
            }
          }
        }

        if(isWorkItemUpdated) {
          let query = {_id: buildingId};
          this.buildingRepository.findOneAndUpdate(query, building, {new: true}, (error, response) => {
            logger.info('Project service, findOneAndUpdate has been hit');
            if (error) {
              callback(error, null);
            } else {
              callback(null, {data: workItemList, access_token: this.authInterceptor.issueTokenWithUid(user)});
            }
          });
        } else {
          callback(error, null);
        }
      }
    });
  }

  // Update WorkItem Status Of Project CostHeads
  updateWorkItemStatusOfProjectCostHeads(projectId:string, costHeadId:number, categoryId:number, workItemId:number,
                                         workItemActiveStatus : boolean, user: User, callback: (error: any, result: any) => void) {
    logger.info('Project service, Update WorkItem Status Of Project Cost Heads has been hit');
    this.projectRepository.findById(projectId, (error, project:Project) => {
      if (error) {
        callback(error, null);
      } else {
        let costHeadList = project.projectCostHeads;
        let categoryList: Category[];
        let workItemList:  Array<WorkItem>= new Array<WorkItem>();
        let updatedWorkItemList: Array<WorkItem>= new Array<WorkItem>();

        for (let costHead of costHeadList) {
          if (costHeadId === costHead.rateAnalysisId) {
            categoryList = costHead.categories;
            for (let category of categoryList) {
              if (categoryId === category.rateAnalysisId) {
                workItemList = category.workItems;
                for (let workItem of workItemList) {
                  if (workItemId === workItem.rateAnalysisId) {
                    workItem.active = workItemActiveStatus;
                    updatedWorkItemList.push(workItem);
                  }
                }
              }
            }
          }
        }

          let query = {_id: projectId};
          this.projectRepository.findOneAndUpdate(query, project, {new: true}, (error, response) => {
            logger.info('Project service, Update WorkItem Status Of Project Cost Heads ,findOneAndUpdate has been hit');
            if (error) {
              callback(error, null);
            } else {
              callback(null, {data: updatedWorkItemList, access_token: this.authInterceptor.issueTokenWithUid(user)});
            }
          });
      }
    });
  }

  updateBudgetedCostForCostHead( buildingId : string, costHeadBudgetedAmount : any, user: User,
                                 callback: (error: any, result: any) => void) {
    logger.info('Project service, updateBudgetedCostForCostHead has been hit');
    let query = {'_id' : buildingId, 'costHeads.name' : costHeadBudgetedAmount.costHead};
    let costInUnit = costHeadBudgetedAmount.costIn;
    let costPerUnit = costHeadBudgetedAmount.costPer;
    let rate = 0;
    let newData;
    rate = costHeadBudgetedAmount.budgetedCostAmount / costHeadBudgetedAmount.buildingArea;

    if(costPerUnit === 'saleableArea' && costInUnit === 'sqft') {
      newData = { $set : {
        'costHeads.$.thumbRuleRate.saleableArea.sqft' : rate,
        'costHeads.$.thumbRuleRate.saleableArea.sqmt' : rate / config.get(Constants.SQUARE_METER)
      } };
    } else if(costPerUnit === 'saleableArea' && costInUnit === 'sqmt') {
      newData = { $set : {
        'costHeads.$.thumbRuleRate.saleableArea.sqmt' : rate,
        'costHeads.$.thumbRuleRate.saleableArea.sqft' : rate * config.get(Constants.SQUARE_METER)
      } };
    } else if(costPerUnit === 'slabArea' && costInUnit === 'sqft') {
      newData = { $set : {
        'costHeads.$.thumbRuleRate.slabArea.sqft' : rate,
        'costHeads.$.thumbRuleRate.slabArea.sqmt' : rate / config.get(Constants.SQUARE_METER)
      } };
    } else if(costPerUnit === 'slabArea' && costInUnit === 'sqmt') {
      newData = { $set : {
        'costHeads.$.thumbRuleRate.slabArea.sqmt' : rate,
        'costHeads.$.thumbRuleRate.slabArea.sqft' : rate * config.get(Constants.SQUARE_METER)
      } };
    }

    this.buildingRepository.findOneAndUpdate(query, newData, {new:true},(err, response) => {
      logger.info('Project service, findOneAndUpdate has been hit');
      if(err) {
        callback(err, null);
      } else {
        callback(null, {data: response, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  updateQuantity(projectId:string, buildingId:string, costHeadId:string, categoryId:string, workItemId:string,
                 quantity:any, user:User, callback:(error: any, result: any)=> void) {
    logger.info('Project service, updateQuantity has been hit');
    this.buildingRepository.findById(buildingId, (error, building) => {
      if (error) {
        callback(error, null);
      } else {
        let costHeadList = building.costHeads;
        let quantityArray  : Quantity;
        for (let index = 0; index < costHeadList.length; index++) {
          if (parseInt(costHeadId) === costHeadList[index].rateAnalysisId) {
            for (let index1 = 0; index1 < costHeadList[index].categories.length; index1++) {
              if (parseInt(categoryId) === costHeadList[index].categories[index1].rateAnalysisId) {
                for (let index2 = 0; index2 < costHeadList[index].categories[index1].workItems.length; index2++) {
                  if (parseInt(workItemId) === costHeadList[index].categories[index1].workItems[index2].rateAnalysisId) {
                    quantityArray  = costHeadList[index].categories[index1].workItems[index2].quantity;
                    quantityArray.quantityItems = quantity;
                    quantityArray.total = 0;
                    for (let itemIndex = 0; quantityArray.quantityItems.length > itemIndex; itemIndex++) {
                      quantityArray.total = quantityArray.quantityItems[itemIndex].quantity + quantityArray.total;
                    }
                  }
                }
              }
            }
          }
        }

          let query = {_id: buildingId};
          this.buildingRepository.findOneAndUpdate(query, building, {new: true}, (error, building) => {
            logger.info('Project service, findOneAndUpdate has been hit');
            if (error) {
              callback(error, null);
            } else {
              let costHeadList = building.costHeads;
              let quantity  : Quantity;
              for (let index = 0; index < costHeadList.length; index++) {
                if (parseInt(costHeadId) === costHeadList[index].rateAnalysisId) {
                  for (let index1 = 0; index1 < costHeadList[index].categories.length; index1++) {
                    if (parseInt(categoryId) === costHeadList[index].categories[index1].rateAnalysisId) {
                      for (let index2 = 0; index2 < costHeadList[index].categories[index1].workItems.length; index2++) {
                        if (parseInt(workItemId) === costHeadList[index].categories[index1].workItems[index2].rateAnalysisId) {
                          quantity  = costHeadList[index].categories[index1].workItems[index2].quantity;
                        }
                      }
                    }
                  }
                }
              }
              if (quantity.total === null) {
                for (let index = 0; index < quantity.quantityItems.length; index++) {
                  quantity.total = quantity.quantityItems[index].quantity + quantity.total;
                }
              }
              callback(null, {data: quantity, access_token: this.authInterceptor.issueTokenWithUid(user)});
            }
          });
        }
    });
  }

  updateQuantityOfProjectCostHeads(projectId:string, costHeadId:number, categoryId:number, workItemId:number,
                 quantity: any, user:User, callback:(error: any, result: any)=> void) {
    logger.info('Project service, updateQuantity has been hit');
    this.projectRepository.findById(projectId, (error, project) => {
      if (error) {
        callback(error, null);
      } else {
        let costHeadList = project.projectCostHeads;
        let quantityArray  : Quantity;
        for (let index = 0; index < costHeadList.length; index++) {
          if (costHeadId === costHeadList[index].rateAnalysisId) {
            for (let index1 = 0; index1 < costHeadList[index].categories.length; index1++) {
              if (categoryId === costHeadList[index].categories[index1].rateAnalysisId) {
                for (let index2 = 0; index2 < costHeadList[index].categories[index1].workItems.length; index2++) {
                  if (workItemId === costHeadList[index].categories[index1].workItems[index2].rateAnalysisId) {
                    quantityArray  = costHeadList[index].categories[index1].workItems[index2].quantity;
                    quantityArray.quantityItems = quantityArray.quantityItems.concat(quantity);
                    quantityArray.total = 0;
                    for (let itemIndex = 0; quantityArray.quantityItems.length > itemIndex; itemIndex++) {
                      quantityArray.total = quantityArray.quantityItems[itemIndex].quantity + quantityArray.total;
                    }
                  }
                }
              }
            }
          }
        }

        let query = {_id: projectId};
        this.projectRepository.findOneAndUpdate(query, project, {new: true}, (error, project) => {
          logger.info('Project service, findOneAndUpdate has been hit');
          if (error) {
            callback(error, null);
          } else {
            let costHeadList = project.projectCostHeads;
            let quantity  : Quantity;
            for (let index = 0; index < costHeadList.length; index++) {
              if (costHeadId === costHeadList[index].rateAnalysisId) {
                for (let index1 = 0; index1 < costHeadList[index].categories.length; index1++) {
                  if (categoryId === costHeadList[index].categories[index1].rateAnalysisId) {
                    for (let index2 = 0; index2 < costHeadList[index].categories[index1].workItems.length; index2++) {
                      if (workItemId === costHeadList[index].categories[index1].workItems[index2].rateAnalysisId) {
                        quantity  = costHeadList[index].categories[index1].workItems[index2].quantity;
                      }
                    }
                  }
                }
              }
            }
            if (quantity.total === null) {
              for (let index = 0; index < quantity.quantityItems.length; index++) {
                quantity.total = quantity.quantityItems[index].quantity + quantity.total;
              }
            }
            callback(null, {data: 'success', access_token: this.authInterceptor.issueTokenWithUid(user)});
          }
        });
      }
    });
  }

  //Get In-Active Categories From Database
  getInActiveCategoriesByCostHeadId(projectId:string, buildingId:string, costHeadId:string, user:User,
                                    callback:(error: any, result: any)=> void) {

    this.buildingRepository.findById(buildingId, (error, building) => {
      logger.info('Project service, Get In-Active Categories By Cost Head Id has been hit');
      if (error) {
        callback(error, null);
      } else {
        let costHeads = building.costHeads;
        let categories : Array<Category>= new Array<Category>();

        for(let costHeadIndex = 0; costHeadIndex<costHeads.length; costHeadIndex++) {
          if(parseInt(costHeadId) === costHeads[costHeadIndex].rateAnalysisId) {
            let categoriesList = costHeads[costHeadIndex].categories;
            for(let categoryIndex = 0; categoryIndex < categoriesList.length; categoryIndex++) {
              if(categoriesList[categoryIndex].active === false) {
                categories.push(categoriesList[categoryIndex]);
              }
            }
          }
        }
        callback(null, {data: categories, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  getWorkitemList(projectId:string, buildingId:string, costHeadId:number, categoryId:number, user:User,
                  callback:(error: any, result: any)=> void) {
    logger.info('Project service, getWorkitemList has been hit');
    let rateAnalysisServices : RateAnalysisService = new RateAnalysisService();
    rateAnalysisServices.getWorkitemList(costHeadId, categoryId, (error, workitemList)=> {
      if(error) {
        callback(error, null);
      }else {
        callback(null, {data: workitemList, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  addWorkitem(projectId:string, buildingId:string, costHeadId:number, categoryId:number, workItem: WorkItem,
              user:User, callback:(error: any, result: any)=> void) {
    logger.info('Project service, addWorkitem has been hit');
    this.buildingRepository.findById(buildingId, (error, building:Building) => {
      if (error) {
        callback(error, null);
      } else {
        let responseWorkitem : Array<WorkItem>= null;
        for(let index = 0; building.costHeads.length > index; index++) {
          if(building.costHeads[index].rateAnalysisId === costHeadId) {
            let category = building.costHeads[index].categories;
            for(let categoryIndex = 0; category.length > categoryIndex; categoryIndex++) {
              if(category[categoryIndex].rateAnalysisId === categoryId) {
                category[categoryIndex].workItems.push(workItem);
                responseWorkitem = category[categoryIndex].workItems;
              }
            }
            let query = { _id : buildingId };
            let newData = { $set : {'costHeads' : building.costHeads}};
            this.buildingRepository.findOneAndUpdate(query, newData,{new: true}, (error, building) => {
              logger.info('Project service, findOneAndUpdate has been hit');
              if (error) {
                callback(error, null);
              } else {
                callback(null, {data: responseWorkitem, access_token: this.authInterceptor.issueTokenWithUid(user)});
              }
            });
          }
        }
      }
    });
  }

  addCategoryByCostHeadId(projectId:string, buildingId:string, costHeadId:string, categoryDetails : any, user:User,
                          callback:(error: any, result: any)=> void) {

    let categoryObj : Category = new Category(categoryDetails.category, categoryDetails.categoryId);

    let query = {'_id' : buildingId, 'costHeads.rateAnalysisId' : parseInt(costHeadId)};
    let newData = { $push: { 'costHeads.$.categories': categoryObj }};

    this.buildingRepository.findOneAndUpdate(query, newData,{new: true}, (error, building) => {
      logger.info('Project service, addCategoryByCostHeadId has been hit');
      if (error) {
        callback(error, null);
      } else {
        callback(null, {data: building, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  //Update status ( true/false ) of category
  updateCategoryStatus(projectId:string, buildingId:string, costHeadId:number, categoryId:number ,
                                categoryActiveStatus:boolean, user:User, callback:(error: any, result: any)=> void) {

   this.buildingRepository.findById(buildingId, (error, building:Building) => {
      logger.info('Project service, update Category Status has been hit');
      if (error) {
        callback(error, null);
      } else {
        let costHeads = building.costHeads;
        let categories : Array<Category>= new Array<Category>();
        let updatedCategories : Array<Category>= new Array<Category>();
        let index : number;

        for(let costHeadIndex=0; costHeadIndex<costHeads.length; costHeadIndex++) {
          if(costHeadId === costHeads[costHeadIndex].rateAnalysisId) {
            categories = costHeads[costHeadIndex].categories;
            for(let categoryIndex = 0; categoryIndex<categories.length; categoryIndex++) {
              if(categories[categoryIndex].rateAnalysisId === categoryId) {
                categories[categoryIndex].active = categoryActiveStatus;
                updatedCategories.push(categories[categoryIndex]);
              }
            }
          }
        }

        let query = {'_id' : buildingId, 'costHeads.rateAnalysisId' : costHeadId};
        let newData = {'$set' : {'costHeads.$.categories' : categories }};

        this.buildingRepository.findOneAndUpdate(query, newData,{new: true}, (error, building) => {
          if (error) {
            callback(error, null);
          } else {
            callback(null, {data: updatedCategories, access_token: this.authInterceptor.issueTokenWithUid(user)});
          }
        });
      }
    });
  }

  //Get active categories from database
  getActiveCategories(projectId:string, buildingId:string, costHeadId:number, user:User, callback:(error: any, result: any)=> void) {
    logger.info('Project service, Get Active Categories has been hit');
    this.buildingRepository.findById(buildingId, (error, building:Building) => {
      if (error) {
        callback(error, null);
      } else {
        let categories :Array<Category> = new Array<Category>();

        for(let costHeadIndex = 0; building.costHeads.length > costHeadIndex; costHeadIndex++) {
          if(building.costHeads[costHeadIndex].rateAnalysisId === costHeadId) {
            for (let categoryIndex = 0; categoryIndex < building.costHeads[costHeadIndex].categories.length; categoryIndex++) {
                if (building.costHeads[costHeadIndex].categories[categoryIndex].active === true) {
                  let workItems : Array<WorkItem> = new Array<WorkItem>();
                  let category = building.costHeads[costHeadIndex].categories[categoryIndex];
                  for(let workitemIndex = 0; workitemIndex < category.workItems.length; workitemIndex ++ ) {
                    if(category.workItems[workitemIndex].active) {
                      workItems.push(category.workItems[workitemIndex]);
                      for(let workItemsIndex1=0; workItemsIndex1 < workItems.length; workItemsIndex1++ ) {
                        let currentWorkItem = workItems[workItemsIndex1];

                        if (currentWorkItem.quantity.total !== null && currentWorkItem.rate.total !== null
                          && currentWorkItem.quantity.total !== 0 && currentWorkItem.rate.total !== 0) {
                          building.costHeads[costHeadIndex].categories[categoryIndex].amount = parseFloat((currentWorkItem.quantity.total *
                            currentWorkItem.rate.total + building.costHeads[costHeadIndex].categories[categoryIndex].amount).toFixed(2));
                        } else {
                          building.costHeads[costHeadIndex].categories[categoryIndex].amount = 0;
                          building.costHeads[costHeadIndex].categories[categoryIndex].amount = 0;
                          break;
                        }
                      }
                    }
                  }
                  category.workItems = workItems;
                  categories.push(category);
              }
            }
          }
        }
        callback(null, {data: categories, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  //Get categories of projectCostHeads from database
  getCategoriesOfProjectCostHead(projectId:string, costHeadId:number, user:User, callback:(error: any, result: any)=> void) {
    logger.info('Project service, Get Project CostHead Categories has been hit');
    this.projectRepository.findById(projectId, (error, project:Project) => {
      if (error) {
        callback(error, null);
      } else {
        let categories :Array<Category> = new Array<Category>();
        let projectCostHeads = project.projectCostHeads;

        for(let costHead of projectCostHeads) {
          if(costHead.rateAnalysisId === costHeadId) {
            for (let singleCategory of costHead.categories) {
              let categoryData = singleCategory;
              if (categoryData.active === true) {
                let workItems : Array<WorkItem> = new Array<WorkItem>();
                let category = categoryData;
                for(let workItem of category.workItems) {
                  let workItemData = workItem;
                  if(workItemData.active) {
                    workItems.push(workItemData);
                    for(let singleWorkItem of workItems) {
                      if (singleWorkItem.quantity.total !== null && singleWorkItem.rate.total !== null
                        && singleWorkItem.quantity.total !== 0 && singleWorkItem.rate.total !== 0) {
                        categoryData.amount =
                          parseFloat((singleWorkItem.quantity.total *
                            singleWorkItem.rate.total +
                            categoryData.amount).toFixed(2));
                      } else {
                        categoryData.amount = 0;
                        categoryData.amount = 0;
                        break;
                      }
                    }
                  }
                }
                category.workItems = workItems;
                categories.push(category);
              }
            }
          }
        }
        callback(null, {data: categories, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  syncProjectWithRateAnalysisData(projectId:string, buildingId:string, user: User, callback: (error:any, result:any)=> void) {

    this.getProjectAndBuildingDetails(projectId, buildingId,(error, projectAndBuildingDetails) => {
      if (error) {
        callback(error, null);
      } else {

        let projectData = projectAndBuildingDetails.data[0];
        let buildings = projectAndBuildingDetails.data[0].buildings;
        let buildingData: any;

        for(let building of buildings) {
          if(building._id == buildingId) {
            buildingData = building;
            break;
          }
        }

        if(projectData.projectCostHeads.length > 0 ) {

          this.updateCostHeadsForBuildingAndProject(callback, projectData, buildingData, buildingId, projectId);

        } else {

          let syncBuildingCostHeadsPromise = this.updateBudgetRatesForBuildingCostHeads(Constants.BUILDING,
            buildingId, projectData, buildingData);
          let syncProjectCostHeadsPromise = this.updateBudgetRatesForProjectCostHeads(Constants.AMENITIES,
            projectId, projectData, buildingData);

          Promise.all([
            syncBuildingCostHeadsPromise,
            syncProjectCostHeadsPromise
          ]).then(function(data: Array<any>) {
            let buildingCostHeadsData = data[0];
            let projectCostHeadsData = data[1];
            callback(null, {status:200});
          })
            .catch(() => { logger.info(' Promise failed!');});
        }
        }
    });
  }

  updateCostHeadsForBuildingAndProject(callback: (error: any, result: any) => void,
                                       projectData: any, buildingData: any, buildingId: string, projectId: string) {

    let rateAnalysisService = new RateAnalysisService();
    let buildingRepository = new BuildingRepository();
    let projectRepository = new ProjectRepository();

    rateAnalysisService.convertCostHeadsFromRateAnalysisToCostControl(Constants.BUILDING,
      (error: any, buildingCostHeadsData: any) => {
        if (error) {
          logger.err('Error in promise : ' + error);
          callback(error, null);
        } else {

          let projectService = new ProjectService();
          let data = projectService.calculateBudgetCostForBuilding(buildingCostHeadsData, projectData, buildingData);
          let queryForBuilding = {'_id': buildingId};
          let updateCostHead = {$set: {'costHeads': data}};
          buildingRepository.findOneAndUpdate(queryForBuilding, updateCostHead, {new: true}, (error: any, response: any) => {
            logger.info('Project service, getAllDataFromRateAnalysis has been hit');
            if (error) {
              logger.err('Error in Update buildingCostHeadsData  : ' + error);
              callback(error, null);
            } else {
              let projectCostHeads = projectService.calculateBudgetCostForCommonAmmenities(
                projectData.projectCostHeads,projectData, buildingData);
              let queryForProject = {'_id': projectId};
              let updateProjectCostHead = {$set: {'projectCostHeads': projectCostHeads}};
              projectRepository.findOneAndUpdate(queryForProject, updateProjectCostHead, {new: true},
                (error: any, response: any) => {
                  logger.info('Project service, getAllDataFromRateAnalysis has been hit');
                  if (error) {
                    logger.err('Error in Update buildingCostHeadsData  : ' + error);
                    callback(error, null);
                  } else {
                    callback(null, response);
                  }
                });
            }
          });
        }
      });
  }

  updateBudgetRatesForBuildingCostHeads(entity: string, buildingId:string, projectDetails : Project, buildingDetails : Building) {
    return new Promise(function(resolve, reject) {
      let rateAnalysisService = new RateAnalysisService();
      let buildingRepository = new BuildingRepository();
      rateAnalysisService.convertCostHeadsFromRateAnalysisToCostControl(entity, (error: any, buildingCostHeadsData: any) => {
        if (error) {
          logger.err('Error in promise : ' + error);
          reject(error);
        } else {

          let projectService = new ProjectService();
          let buildingCostHeads = projectService.calculateBudgetCostForBuilding(buildingCostHeadsData, projectDetails, buildingDetails);
          let query = {'_id': buildingId};
          let newData = {$set: {'costHeads': buildingCostHeads}};
          buildingRepository.findOneAndUpdate(query, newData, {new: true}, (error:any, response:any) => {
            logger.info('Project service, getAllDataFromRateAnalysis has been hit');
            if (error) {
              logger.err('Error in Update buildingCostHeadsData  : '+error);
              reject(error);
            } else {
              resolve('Done');
            }
          });
        }
      });
    });
  }

  updateBudgetRatesForProjectCostHeads(entity: string, projectId:string, projectDetails : Project, buildingDetails : Building) {
    return new Promise(function(resolve, reject){
      let rateAnalysisService = new RateAnalysisService();
      let projectRepository = new ProjectRepository();
      rateAnalysisService.convertCostHeadsFromRateAnalysisToCostControl(entity, (error : any, projectCostHeadsData: any) => {
        if(error) {
          logger.err('Error in promise : ' + error);
          reject(error);
        } else {
            let projectService = new ProjectService();
            let projectCostHeads = projectService.calculateBudgetCostForCommonAmmenities(projectCostHeadsData, projectDetails, buildingDetails);
            let query = {'_id': projectId};
            let newData = {$set: {'projectCostHeads': projectCostHeads}};
            projectRepository.findOneAndUpdate(query, newData, {new: true}, (error: any, response: any) => {
              logger.info('Project service, getAllDataFromRateAnalysis has been hit');
              if (error) {
                logger.err('Error in Update buildingCostHeadsData  : '+error);
                reject(error);
              } else {
                resolve('Done');
              }
            });
          }
      });
    });
  }

  calculateBudgetCostForBuilding(costHeadsRateAnalysis: any, projectDetails : Project, buildingDetails : any) {
    let costHeads:Array<CostHead> = new Array<CostHead>();
    let budgetedCostAmount: number;
    let calculateBudgtedCost : string;

    for(let costHead of costHeadsRateAnalysis) {

      let budgetCostFormulae:string;

      switch(costHead.name) {

          case Constants.RCC_BAND_OR_PATLI : {
            budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
            calculateBudgtedCost = budgetCostFormulae.replace(Constants.SLAB_AREA, projectDetails.slabArea);
            budgetedCostAmount = eval(calculateBudgtedCost);
            this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
            break;
          }
          case Constants.EXTERNAL_PLASTER : {
            budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
            calculateBudgtedCost = budgetCostFormulae.replace(Constants.CARPET_AREA, buildingDetails.totalCarpetAreaOfUnit);
            budgetedCostAmount = eval(calculateBudgtedCost);
            this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
            break;
          }
          case Constants.FABRICATION : {
            budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
            calculateBudgtedCost = budgetCostFormulae.replace(Constants.CARPET_AREA, buildingDetails.totalCarpetAreaOfUnit);
            budgetedCostAmount = eval(calculateBudgtedCost);
            this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
            break;
          }
          case Constants.POINTING : {
            budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
            calculateBudgtedCost = budgetCostFormulae.replace(Constants.CARPET_AREA, buildingDetails.totalCarpetAreaOfUnit);
            budgetedCostAmount = eval(calculateBudgtedCost);
            this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
            break;
          }
          case Constants.KITCHEN_OTTA : {
            budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
            calculateBudgtedCost = budgetCostFormulae.replace(Constants.NUM_OF_ONE_BHK, buildingDetails.numOfOneBHK)
              .replace(Constants.NUM_OF_TWO_BHK, buildingDetails.numOfTwoBHK)
              .replace(Constants.NUM_OF_THREE_BHK, buildingDetails.numOfThreeBHK)
              .replace(Constants.NUM_OF_FOUR_BHK, buildingDetails.numOfFourBHK)
              .replace(Constants.NUM_OF_FIVE_BHK, buildingDetails.numOfFiveBHK);
            budgetedCostAmount = eval(calculateBudgtedCost);

            this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
            break;
          }
          case Constants.SOLING : {
            budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
            calculateBudgtedCost = budgetCostFormulae.replace(Constants.PLINTH_AREA, buildingDetails.plinthArea);
            budgetedCostAmount = eval(calculateBudgtedCost);
            this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
            break;
          }
          case Constants.MASONRY : {
            budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
            calculateBudgtedCost = budgetCostFormulae.replace(Constants.CARPET_AREA, buildingDetails.totalCarpetAreaOfUnit);
            budgetedCostAmount = eval(calculateBudgtedCost);
            this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
            break;
          }
          case Constants.INTERNAL_PLASTER : {
            budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
            calculateBudgtedCost = budgetCostFormulae.replace(Constants.CARPET_AREA, buildingDetails.totalCarpetAreaOfUnit);
            budgetedCostAmount = eval(calculateBudgtedCost);
            this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
            break;
          }
          case Constants.GYPSUM_OR_POP_PLASTER : {
            budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
            calculateBudgtedCost = budgetCostFormulae.replace(Constants.CARPET_AREA, buildingDetails.totalCarpetAreaOfUnit);
            budgetedCostAmount = eval(calculateBudgtedCost);
            this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
            break;
          }
          default : {
            break;
          }
        }

    }
    return costHeads;
  }

  calculateBudgetCostForCommonAmmenities(costHeadsRateAnalysis: any, projectDetails : Project, buildingDetails : any) {
    let costHeads:Array<CostHead> = new Array<CostHead>();
    let budgetedCostAmount: number;
    let budgetCostFormulae:string;
    let calculateBudgtedCost :string;

    let calculateProjectData = 'SELECT SUM(building.totalCarpetAreaOfUnit) AS totalCarpetArea, ' +
      'SUM(building.totalSlabArea) AS totalSlabAreaProject,' +
      'SUM(building.totalSaleableAreaOfUnit) AS totalSaleableArea  FROM ? AS building';
    let projectData = alasql(calculateProjectData, [projectDetails.buildings]);
    let totalSlabAreaOfProject : number = projectData[0].totalSlabAreaProject;
    let totalSaleableAreaOfProject : number = projectData[0].totalSaleableArea;
    let totalCarpetAreaOfProject : number = projectData[0].totalCarpetArea;

    for(let costHead of costHeadsRateAnalysis) {

      switch(costHead.name) {

          case Constants.SAFETY_MEASURES : {
            budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
            calculateBudgtedCost = budgetCostFormulae.replace(Constants.CARPET_AREA, totalCarpetAreaOfProject);
            budgetedCostAmount = eval(calculateBudgtedCost);
            this.calculateThumbRuleReportForProjectCostHead(budgetedCostAmount, costHead, projectDetails, costHeads);
            break;
          }
          default : {
            break;
          }
      }

    }
    return costHeads;
  }

  private calculateThumbRuleReportForCostHead(budgetedCostAmount: number, costHeadFromRateAnalysis: any,
                                              buildingData: any, costHeads: Array<CostHead>) {
    if (budgetedCostAmount) {
      let costHead: CostHead = costHeadFromRateAnalysis;
      costHead.budgetedCostAmount = budgetedCostAmount;
      let thumbRuleRate = new ThumbRuleRate();

      thumbRuleRate.saleableArea = this.calculateThumbRuleRateForArea(budgetedCostAmount, buildingData.totalSaleableAreaOfUnit);
      thumbRuleRate.slabArea = this.calculateThumbRuleRateForArea(budgetedCostAmount, buildingData.totalSlabArea);
      thumbRuleRate.carpetArea = this.calculateThumbRuleRateForArea(budgetedCostAmount, buildingData.totalCarpetAreaOfUnit);

      costHead.thumbRuleRate = thumbRuleRate;
      costHeads.push(costHead);
    }
  }

  private calculateThumbRuleReportForProjectCostHead(budgetedCostAmount: number, costHeadFromRateAnalysis: any,
                                              projectDetails: any, costHeads: Array<CostHead>) {
    if (budgetedCostAmount) {
      let calculateProjectData = 'SELECT SUM(building.totalCarpetAreaOfUnit) AS totalCarpetArea, ' +
        'SUM(building.totalSlabArea) AS totalSlabAreaProject,' +
        'SUM(building.totalSaleableAreaOfUnit) AS totalSaleableArea  FROM ? AS building';
      let projectData = alasql(calculateProjectData, [projectDetails.buildings]);
      let totalSlabAreaOfProject : number = projectData[0].totalSlabAreaProject;
      let totalSaleableAreaOfProject : number = projectData[0].totalSaleableArea;
      let totalCarpetAreaOfProject : number = projectData[0].totalCarpetArea;

      let costHead: CostHead = costHeadFromRateAnalysis;
      costHead.budgetedCostAmount = budgetedCostAmount;
      let thumbRuleRate = new ThumbRuleRate();

      thumbRuleRate.saleableArea = this.calculateThumbRuleRateForArea(budgetedCostAmount, totalSaleableAreaOfProject);
      thumbRuleRate.slabArea = this.calculateThumbRuleRateForArea(budgetedCostAmount, totalSlabAreaOfProject);
      thumbRuleRate.carpetArea = this.calculateThumbRuleRateForArea(budgetedCostAmount, totalCarpetAreaOfProject);

      costHead.thumbRuleRate = thumbRuleRate;
      costHeads.push(costHead);
    }
  }

  private calculateThumbRuleRateForArea(budgetedCostAmount: number, area: number) {
    let budgetCostRates = new BudgetCostRates();
    budgetCostRates.sqft = (budgetedCostAmount / area);
    budgetCostRates.sqmt = (budgetCostRates.sqft * config.get(Constants.SQUARE_METER));
    return budgetCostRates;
  }}

Object.seal(ProjectService);
export = ProjectService;
