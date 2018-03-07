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
import ClonedCostHead = require('../dataaccess/model/project/building/ClonedCostHead');
import ClonedWorkItem = require('../dataaccess/model/project/building/ClonedWorkItem');
import CostHead = require('../dataaccess/model/project/building/CostHead');
import WorkItem = require('../dataaccess/model/project/building/WorkItem');
import RateAnalysisService = require('./RateAnalysisService');
import Category = require('../dataaccess/model/project/building/Category');
let config = require('config');
let log4js = require('log4js');
import alasql = require('alasql');
import ClonedCategory = require('../dataaccess/model/project/building/ClonedCategory');
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
    logger.info('Project service, addWorkitem has been hit');
    this.buildingRepository.findById(buildingId, (error, building:Building) => {
      if (error) {
        callback(error, null);
      } else {
        let costHeadList = building.costHeads;
        let categoryList: Category[];
        let WorkItemList: WorkItem[];
        let inActiveWorkItems= [];

        for (let index = 0; index < costHeadList.length; index++) {
          if (costHeadId === costHeadList[index].rateAnalysisId) {
            categoryList = costHeadList[index].categories;
            for (let categoryIndex = 0; categoryIndex < categoryList.length; categoryIndex++) {
              if (categoryId === categoryList[categoryIndex].rateAnalysisId) {
                WorkItemList = categoryList[categoryIndex].workItems;
                for (let checkWorkItem of WorkItemList) {
                  if(checkWorkItem.active === false) {
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

        let clonedCostHeadArray : Array<ClonedCostHead> = [];

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
        }
        building.costHeads = clonedCostHeadArray;
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
setWorkItemStatus( buildingId:string, costHeadId:number, categoryId:number, workItemId:number,
                   workItemActiveStatus : boolean, user: User,
                                callback: (error: any, result: any) => void) {
    logger.info('Project service, update Workitem has been hit');
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
                    WorkItemList[workitemIndex].active = workItemActiveStatus;
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
              callback(null, {data: WorkItemList, access_token: this.authInterceptor.issueTokenWithUid(user)});
            }
          });
        } else {
          callback(error, null);
        }
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
        'costHeads.$.thumbRuleRate.saleableArea.sqmt' : rate / config.get('SqureMeter')
      } };
    } else if(costPerUnit === 'saleableArea' && costInUnit === 'sqmt') {
      newData = { $set : {
        'costHeads.$.thumbRuleRate.saleableArea.sqmt' : rate,
        'costHeads.$.thumbRuleRate.saleableArea.sqft' : rate * config.get('SqureMeter')
      } };
    } else if(costPerUnit === 'slabArea' && costInUnit === 'sqft') {
      newData = { $set : {
        'costHeads.$.thumbRuleRate.slabArea.sqft' : rate,
        'costHeads.$.thumbRuleRate.slabArea.sqmt' : rate / config.get('SqureMeter')
      } };
    } else if(costPerUnit === 'slabArea' && costInUnit === 'sqmt') {
      newData = { $set : {
        'costHeads.$.thumbRuleRate.slabArea.sqmt' : rate,
        'costHeads.$.thumbRuleRate.slabArea.sqft' : rate * config.get('SqureMeter')
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

  //getInActiveCategoryFromDatabase
  getAllCategoriesByCostHeadId(projectId:string, buildingId:string, costHeadId:string, user:User,
                               callback:(error: any, result: any)=> void) {

    this.buildingRepository.findById(buildingId, (error, building) => {
      logger.info('Project service, getAllCategoriesByCostHeadId has been hit');
      if (error) {
        callback(error, null);
      } else {
        let costHeadList = building.costHeads;
        let categoryList : Array<Category>=[];

        for(let costHeadIndex=0; costHeadIndex<costHeadList.length; costHeadIndex++) {
          if(parseInt(costHeadId) === costHeadList[costHeadIndex].rateAnalysisId) {
            for(let categoryIndex=0; categoryIndex<costHeadList[costHeadIndex].categories.length; categoryIndex++) {
              if(costHeadList[costHeadIndex].categories[categoryIndex].active === false) {
                categoryList.push(costHeadList[costHeadIndex].categories[categoryIndex]);
              }
            }
          }
        }
        callback(null, {data: categoryList, access_token: this.authInterceptor.issueTokenWithUid(user)});
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

  updateCategoryStatus(projectId:string, buildingId:string, costHeadId:string, categoryId:number ,
                                categoryActiveStatus:boolean, user:User, callback:(error: any, result: any)=> void) {

    this.buildingRepository.findById(buildingId, (error, building:Building) => {
      logger.info('Project service, updateCategoryStatus has been hit');
      if (error) {
        callback(error, null);
      } else {
        let costHeadList = building.costHeads;
        let categoryList : any = [];
        let categoryIndex;

        for(let index=0; index<costHeadList.length; index++) {
          if(parseInt(costHeadId) === costHeadList[index].rateAnalysisId) {
            categoryList = costHeadList[index].categories;
            categoryIndex=index;
            for(let categoryIndex=0; categoryIndex<categoryList.length; categoryIndex++) {
              if(categoryList[categoryIndex].rateAnalysisId === categoryId) {
                categoryList[categoryIndex].active=categoryActiveStatus;
              }
            }
          }
        }

        let query = {'_id' : buildingId, 'costHeads.rateAnalysisId' : parseInt(costHeadId)};
        let newData = {'$set' : {'costHeads.$.categories' : categoryList }};

        this.buildingRepository.findOneAndUpdate(query, newData,{new: true}, (error, dataList) => {
          if (error) {
            callback(error, null);
          } else {
            callback(null, {data: dataList, access_token: this.authInterceptor.issueTokenWithUid(user)});
          }
        });
      }
    });
  }

  getCategory(projectId:string, buildingId:string, costHeadId:number, user:User, callback:(error: any, result: any)=> void) {
    logger.info('Project service, getCategory has been hit');
    this.buildingRepository.findById(buildingId, (error, building:Building) => {
      if (error) {
        callback(error, null);
      } else {
        let categories :Array<Category>=[];
        for(let index = 0; building.costHeads.length > index; index++) {
          if(building.costHeads[index].rateAnalysisId === costHeadId) {
            for (let categoryIndex = 0; categoryIndex < building.costHeads[index].categories.length; categoryIndex++) {
              if (building.costHeads[index].categories[categoryIndex].active === true) {
                categories.push(building.costHeads[index].categories[categoryIndex]);
                if (building.costHeads[index].categories[categoryIndex].workItems.length !== 0 ||
                  building.costHeads[index].categories[categoryIndex].workItems!==undefined) {
                  let workitems = building.costHeads[index].categories[categoryIndex].workItems;
                  for (let workitemsIndex = 0; workitemsIndex < workitems.length; workitemsIndex++) {
                    let workitem = workitems[workitemsIndex];
                    if (workitem.quantity.total !== null && workitem.rate.total !== null
                      && workitem.quantity.total !== 0 && workitem.rate.total !== 0) {
                      building.costHeads[index].categories[categoryIndex].amount = parseFloat((workitem.quantity.total *
                        workitem.rate.total + building.costHeads[index].categories[categoryIndex].amount).toFixed(2));
                    } else {
                      building.costHeads[index].categories[categoryIndex].amount = 0;
                      building.costHeads[index].categories[categoryIndex].amount = 0;
                      break;
                    }
                  }
                }
              }
            }
          }
        }
        callback(null, {data: categories, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  syncBuildingWithRateAnalysisData(projectId:string, buildingId:string, user: User, callback: (error:any, result:any)=> void) {
    let rateAnalysisServices: RateAnalysisService = new RateAnalysisService();
    rateAnalysisServices.getAllDataFromRateAnalysis((error, rateAnalysisData) => {
      if (error) {
        callback(error, null);
      } else {

        let query = {'_id' : buildingId };
        let newData = { $set: { 'costHeads': rateAnalysisData }};

        this.buildingRepository.findOneAndUpdate(query, newData,{new: true}, (error, building) => {
          logger.info('Project service, getAllDataFromRateAnalysis has been hit');
          if (error) {
            callback(error, null);
          } else {
            callback(null, {data: building, access_token: this.authInterceptor.issueTokenWithUid(user)});
          }
        });
      }
    });
  }
}

Object.seal(ProjectService);
export = ProjectService;
