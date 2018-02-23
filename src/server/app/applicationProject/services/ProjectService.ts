import ProjectRepository = require('../dataaccess/repository/ProjectRepository');
import BuildingRepository = require('../dataaccess/repository/BuildingRepository');
import Messages = require('../shared/messages');
import UserService = require('./../../framework/services/UserService');
import ProjectAsset = require('../../framework/shared/projectasset');
import User = require('../../framework/dataaccess/mongoose/user');
import Project = require('../dataaccess/mongoose/Project');
import Building = require('../dataaccess/mongoose/Building');
import BuildingModel = require('../dataaccess/model/Building');
import AuthInterceptor = require('../../framework/interceptor/auth.interceptor');
import CostControllException = require('../exception/CostControllException');
import Quantity = require('../dataaccess/model/Quantity');
import Rate = require('../dataaccess/model/Rate');
import ClonedCostHead = require('../dataaccess/model/ClonedCostHead');
import ClonedWorkItem = require('../dataaccess/model/ClonedWorkItem');
import CostHead = require('../dataaccess/model/CostHead');
import WorkItem = require('../dataaccess/model/WorkItem');
import Item = require('../dataaccess/model/Item');
import RateAnalysisService = require('./RateAnalysisService');
import QuantityItem = require('../dataaccess/model/QuantityItem');
import SubCategory = require('../dataaccess/model/SubCategory');
let config = require('config');
var log4js = require('log4js');
import alasql = require('alasql');
import ClonedSubcategory = require('../dataaccess/model/ClonedSubcategory');
var logger=log4js.getLogger('Project service');

class ProjectService {
  APP_NAME: string;
  company_name: string;
  costHeadId: number;
  subCategoryId: number;
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

  create(data: any, user : User, callback: (error: any, result: any) => void) {
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

  getProject( projectId : string, user: User, callback: (error: any, result: any) => void) {
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

  updateProjectDetails( projectDetails: Project, user: User, callback:(error: any, result:any) => void) {
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

  addBuilding(projectId : string, buildingDetail : Building, user: User, callback:(error: any, result: any)=> void) {
    this.buildingRepository.create(buildingDetail, (error, result)=> {
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

  updateBuilding( buildingId:string, buildingDetail:any, user:User, callback:(error: any, result: any)=> void) {
    logger.info('Project service, updateBuilding has been hit');
    let query = { _id : buildingId };
    this.buildingRepository.findOneAndUpdate(query, buildingDetail,{new: true}, (error, result) => {
      logger.info('Project service, findOneAndUpdate has been hit');
      if (error) {
        callback(error, null);
      } else {
        callback(null, {data: result, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  cloneBuildingDetails( buildingId:string, buildingDetail:any, user:User, callback:(error: any, result: any)=> void) {
    logger.info('Project service, cloneBuildingDetails has been hit');
    let query = { _id : buildingId };
    this.buildingRepository.findById(buildingId, (error, result) => {
      logger.info('Project service, findById has been hit');
      if (error) {
        callback(error, null);
      } else {
        let clonedCostHeadDetails :Array<CostHead>=[];
        let costHeads =buildingDetail.costHeads;
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

                let subcategoryList = costHead.subCategory;
                let resultSubCategoryList = resultCostHead.subCategories;

                for(let resultSubcategoryIndex=0; resultSubcategoryIndex<resultSubCategoryList.length; resultSubcategoryIndex++) {
                  for(let subcategoryIndex=0 ; subcategoryIndex<subcategoryList.length; subcategoryIndex++) {
                    if(subcategoryList[subcategoryIndex].name === resultSubCategoryList[resultSubcategoryIndex].name) {
                      if(!subcategoryList[subcategoryIndex].active) {
                        resultSubCategoryList.splice(resultSubcategoryIndex,1);
                      } else {
                        let resultWorkitemList = resultSubCategoryList[resultSubcategoryIndex].workItems;
                        let workItemList = subcategoryList[subcategoryIndex].workItems;

                        for(let resultWorkitemIndex=0;  resultWorkitemIndex < resultWorkitemList.length; resultWorkitemIndex++){
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
                clonedCostHead.subCategories = resultCostHead.subCategories;
              } else {
                clonedCostHead.subCategories = resultCostHead.subCategories;
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

  getBuilding(projectId : string, buildingId : string, user: User, callback:(error: any, result: any)=> void) {
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
        let inactiveCostHead=[];
        for(let costHeadItem of response) {
          if(!costHeadItem.active) {
            inactiveCostHead.push(costHeadItem);
          }
        }
        callback(null,{data:inactiveCostHead, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  getClonedBuilding(projectId : string, buildingId : string, user: User, callback:(error: any, result: any)=> void) {
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
          let clonedSubcategoryArray : Array<ClonedSubcategory> = [];
          let subCategoryArray = clonedBuilding[costHeadIndex].subCategories;

          for(let subCategoryIndex=0; subCategoryIndex<subCategoryArray.length; subCategoryIndex++) {
            let clonedSubcategory = new ClonedSubcategory();
            clonedSubcategory.name = subCategoryArray[subCategoryIndex].name;
            clonedSubcategory.rateAnalysisId = subCategoryArray[subCategoryIndex].rateAnalysisId;
            clonedSubcategory.amount = subCategoryArray[subCategoryIndex].amount;
            clonedSubcategory.active = true;

            let workitemArray = subCategoryArray[subCategoryIndex].workItems;
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
            clonedSubcategory.workItems = clonedWorkItemArray;
            clonedSubcategoryArray.push(clonedSubcategory);
          }
          clonedCostHead.subCategories = clonedSubcategoryArray;
          clonedCostHeadArray.push(clonedCostHead);
        }
        building.costHeads = clonedCostHeadArray;
        callback(null, {data: building, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  deleteBuilding(projectId:string, buildingId:string, user:User, callback:(error: any, result: any)=> void) {
    logger.info('Project service, deleteBuilding has been hit');
    let popBuildingId = buildingId;
    this.buildingRepository.delete(buildingId, (error, result)=> {
      if(error) {
        callback(error, null);
      } else {
        let query = {_id: projectId};
        let newData = { $pull: {building : popBuildingId}};
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

  getQuantity(projectId:string, buildingId:string, costhead: string, workItem : any, user : User, callback:(error: any, result: any)=> void) {
    logger.info('Project service, getQuantity has been hit');
    this.buildingRepository.findById(buildingId, (error, building:Building) => {
      if (error) {
        callback(error, null);
      } else {
        let quantity: Quantity;
        for(let index = 0; building.costHeads.length > index; index++) {
         if(building.costHeads[index].name === costhead) {
           quantity = building.costHeads[index].workitem[workItem].quantity;
         }
        }
        if(quantity.total === null) {
          for(let index = 0; quantity.items.length > index; index ++) {
            quantity.total = quantity.items[index].quantity + quantity.total;
          }
        }
        callback(null, {data: quantity, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  getRate(projectId:string, buildingId:string, costheadId:number,subcategoryId:number, workitemId:number, user : User,
          callback:(error: any, result: any)=> void) {
    logger.info('Project service, getRate has been hit');

    let rateAnalysisServices: RateAnalysisService = new RateAnalysisService();
    rateAnalysisServices.getRate(workitemId, (error, rateData) => {
      if (error) {
        callback(error, null);
      } else {
        let rate :Rate = new Rate();
        rate.items = rateData;
        callback(null, {data: rateData, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  updateRate(projectId:string, buildingId:string, costheadId:number,subcategoryId:number,
             workitemId:number, rate :Rate, user : User, callback:(error: any, result: any)=> void) {
    logger.info('Project service, updateRate has been hit');
    this.buildingRepository.findById(buildingId, (error, building:Building) => {
      logger.info('Project service, findById has been hit');
      if (error) {
        callback(error, null);
      } else {
        let rateAnalysisId: number;
        for(let index = 0; building.costHeads.length > index; index++) {
          if(building.costHeads[index].rateAnalysisId === costheadId) {
            for(let indexSubcategory = 0; building.costHeads[index].subCategories.length > indexSubcategory; indexSubcategory++) {
              if (building.costHeads[index].subCategories[indexSubcategory].rateAnalysisId === subcategoryId) {
                for(let indexWorkitem = 0; building.costHeads[index].subCategories[indexSubcategory].workItems.length >
                indexWorkitem; indexWorkitem++) {
                  if (building.costHeads[index].subCategories[indexSubcategory].workItems[indexWorkitem].rateAnalysisId === workitemId) {
                    building.costHeads[index].subCategories[indexSubcategory].workItems[indexWorkitem].rate=rate;
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

  deleteQuantity(projectId:string, buildingId:string, costheadId:string, subcategoryId:string,
                 workitemId:string, user:User, item:string, callback:(error: any, result: any)=> void) {
    logger.info('Project service, deleteQuantity has been hit');
    this.buildingRepository.findById(buildingId, (error, building:Building) => {
      if (error
      ) {
        callback(error, null);
      } else {
        let quantity: Quantity;
         this.costHeadId = parseInt(costheadId);
          this.subCategoryId = parseInt(subcategoryId);
          this.workItemId = parseInt(workitemId);

          for(let index = 0; building.costHeads.length > index; index++) {
            if (building.costHeads[index].rateAnalysisId === this.costHeadId) {
              for (let index1 = 0; building.costHeads[index].subCategories.length > index1; index1++) {
                if (building.costHeads[index].subCategories[index1].rateAnalysisId === this.subCategoryId) {
                  for (let index2 = 0; building.costHeads[index].subCategories[index1].workItems.length > index2; index2++) {
                    if (building.costHeads[index].subCategories[index1].workItems[index2].rateAnalysisId === this.workItemId) {
                      quantity = building.costHeads[index].subCategories[index1].workItems[index2].quantity;
                    }
                  }
                }
              }
            }
          }

        for(let index = 0; quantity.items.length > index; index ++) {
          if(quantity.items[index].item  === item) {
            quantity.items.splice(index,1);
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
                for (let index1 = 0; building.costHeads[index].subCategories.length > index1; index1++) {
                  if (building.costHeads[index].subCategories[index1].rateAnalysisId === this.subCategoryId) {
                    for (let index2 = 0; building.costHeads[index].subCategories[index1].workItems.length > index2; index2++) {
                      if (building.costHeads[index].subCategories[index1].workItems[index2].rateAnalysisId === this.workItemId) {
                        quantity = building.costHeads[index].subCategories[index1].workItems[index2].quantity;
                      }
                    }
                  }
                }
              }
            }

            if(quantity.total) {
              if(quantity.items.length !== 0) {
                for(let index = 0; quantity.items.length > index; index ++) {
                  quantity.total = quantity.items[index].quantity + quantity.total;
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

  deleteWorkitem(projectId:string, buildingId:string, costheadId:number, subcategoryId:number, workitemId:number, user:User,
                 callback:(error: any, result: any)=> void) {
    logger.info('Project service, delete Workitem has been hit');
    this.buildingRepository.findById(buildingId, (error, building:Building) => {
      if (error) {
        callback(error, null);
      } else {
        let costHeadList = building.costHeads;
        let subCategoryList: SubCategory[];
        let WorkItemList: WorkItem[];
        var flag = 0;

        for (let index = 0; index < costHeadList.length; index++) {
          if (costheadId === costHeadList[index].rateAnalysisId) {
            subCategoryList = costHeadList[index].subCategories;
            for (let subcategoryIndex = 0; subcategoryIndex < subCategoryList.length; subcategoryIndex++) {
              if (subcategoryId === subCategoryList[subcategoryIndex].rateAnalysisId) {
                WorkItemList = subCategoryList[subcategoryIndex].workItems;
                for (let workitemIndex = 0; workitemIndex < WorkItemList.length; workitemIndex++) {
                  if (workitemId === WorkItemList[workitemIndex].rateAnalysisId) {
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

  getReportCostHeadDetails( buildingId : string, costHead : string, user: User,callback: (error: any, result: any) => void) {
    this.buildingRepository.findById(buildingId, (error, result) => {
      logger.info('Project service, findById has been hit');
      if (error) {
        callback(error, null);
      } else {

        let response = result.costHeads;
        let costHeadItem: any;
        for(let costHeadItems of response) {
          if(costHeadItems.name === costHead) {
            costHeadItem = costHeadItems.workItems;
          }
        }
        callback(null, {data: costHeadItem, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  updateBuildingCostHeadStatus( buildingId : string, costHeadId : number, costHeadActiveStatus : string, user: User,
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

  createQuantity(projectId : string, buildingId : string, costhead : string, workitem : any, quantity :any, user : User,
                 callback:(error: any, result: any)=> void) {
    this.buildingRepository.findById(buildingId, (error, building:Building) => {
      logger.info('Project service, findById has been hit');
      if (error) {
        callback(error, null);
      } else {
        for(let index = 0; building.costHeads.length > index; index++) {
          if(building.costHeads[index].name === costhead) {
            let quantityArray :Array<Quantity> = building.costHeads[index].workItems[workitem].quantity.items;
            let exist = false;
            let errorMessage ;
            for(let quantityIndex = 0; quantityArray.length > quantityIndex; quantityIndex++ ) {
              if(quantityArray[quantityIndex].items === quantity.item ) {
                exist = true;
                errorMessage = 'Quantity name already exist. ';
                if(quantityArray[quantityIndex].remarks === quantity.remarks ) {
                  exist = true;
                  errorMessage = errorMessage + 'same remarks is also exist with quantity name.';
                } else {
                  exist = false;
                }
              }
            }
            if(exist) {
              callback(new CostControllException(errorMessage, errorMessage), null);
            } else {
              quantityArray.push(quantity);
              let query = { _id : buildingId };
              this.buildingRepository.findOneAndUpdate(query, building,{new: true}, (error, building) => {
                logger.info('Project service, findOneAndUpdate has been hit');
                if (error) {
                  callback(error, null);
                } else {
                  let quantity: Quantity;
                  for(let index = 0; building.costHead.length > index; index++){
                    if(building.costHead[index].name === costhead) {
                      quantity = building.costHead[index].workitem[workitem].quantity;
                    }
                  }
                  if(quantity.total === null) {
                    for(let index = 0; quantity.items.length > index; index ++) {
                      quantity.total = quantity.items[index].quantity + quantity.total;
                    }
                  }
                  callback(null, {data: quantity, access_token: this.authInterceptor.issueTokenWithUid(user)});
                }
              });
            }
          }
        }
      }
    });
  }

  updateQuantity(projectId:string, buildingId:string, costheadId:string, subcategoryId:string, workitemId:string,
                 quantity:any, user:User, callback:(error: any, result: any)=> void) {
    logger.info('Project service, updateQuantity has been hit');
    this.buildingRepository.findById(buildingId, (error, building) => {
      if (error) {
        callback(error, null);
      } else {
        let costHeadList = building.costHeads;
        let quantityArray  : Quantity;
        for (let index = 0; index < costHeadList.length; index++) {
          if (parseInt(costheadId) === costHeadList[index].rateAnalysisId) {
            for (let index1 = 0; index1 < costHeadList[index].subCategories.length; index1++) {
              if (parseInt(subcategoryId) === costHeadList[index].subCategories[index1].rateAnalysisId) {
                for (let index2 = 0; index2 < costHeadList[index].subCategories[index1].workItems.length; index2++) {
                  if (parseInt(workitemId) === costHeadList[index].subCategories[index1].workItems[index2].rateAnalysisId) {
                    quantityArray  = costHeadList[index].subCategories[index1].workItems[index2].quantity;
                    quantityArray.items = quantity;
                    quantityArray.total = 0;
                    for (let itemIndex = 0; quantityArray.items.length > itemIndex; itemIndex++) {
                      quantityArray.total = quantityArray.items[itemIndex].quantity + quantityArray.total;
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
                if (parseInt(costheadId) === costHeadList[index].rateAnalysisId) {
                  for (let index1 = 0; index1 < costHeadList[index].subCategories.length; index1++) {
                    if (parseInt(subcategoryId) === costHeadList[index].subCategories[index1].rateAnalysisId) {
                      for (let index2 = 0; index2 < costHeadList[index].subCategories[index1].workItems.length; index2++) {
                        if (parseInt(workitemId) === costHeadList[index].subCategories[index1].workItems[index2].rateAnalysisId) {
                          quantity  = costHeadList[index].subCategories[index1].workItems[index2].quantity;
                        }
                      }
                    }
                  }
                }
              }
              if (quantity.total === null) {
                for (let index = 0; index < quantity.items.length; index++) {
                  quantity.total = quantity.items[index].quantity + quantity.total;
                }
              }
              callback(null, {data: quantity, access_token: this.authInterceptor.issueTokenWithUid(user)});
            }
          });
        }
    });
  }

  getAllSubcategoriesByCostHeadId(projectId:string, buildingId:string, costheadId:string, user:User,
                                  callback:(error: any, result: any)=> void) {
    let rateAnalysisServices : RateAnalysisService = new RateAnalysisService();
    let url = config.get('rateAnalysisAPI.subCategories');
    rateAnalysisServices.getApiCall(url, (error, subCategories)=> {
      if(error) {
        callback(error, null);
      } else {
        let costHead = parseInt(costheadId);
        let subCategoriesList  =  subCategories.SubItemType;
        let sqlQuery = 'SELECT subCategoriesList.C1 AS rateAnalysisId, subCategoriesList.C2 AS subCategory ' +
          'FROM ? AS subCategoriesList WHERE subCategoriesList.C3 = '+ costHead;
        subCategoriesList = alasql(sqlQuery, [subCategoriesList]);
        callback(null, {data: subCategoriesList, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  getWorkitemList(projectId:string, buildingId:string, costheadId:number, subCategoryId:number, user:User,
                  callback:(error: any, result: any)=> void) {
    logger.info('Project service, getWorkitemList has been hit');
    let rateAnalysisServices : RateAnalysisService = new RateAnalysisService();
    rateAnalysisServices.getWorkitemList(costheadId, subCategoryId, (error, workitemList)=> {
      if(error) {
        callback(error, null);
      }else {
        callback(null, {data: workitemList, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  addWorkitem(projectId:string, buildingId:string, costheadId:number, subCategoryId:number, workitem: WorkItem,
              user:User, callback:(error: any, result: any)=> void) {
    logger.info('Project service, addWorkitem has been hit');
    this.buildingRepository.findById(buildingId, (error, building:Building) => {
      if (error) {
        callback(error, null);
      } else {
        let responseWorkitem : Array<WorkItem>= null;
        for(let index = 0; building.costHeads.length > index; index++) {
          if(building.costHeads[index].rateAnalysisId === costheadId) {
            let subCategory = building.costHeads[index].subCategories;
            for(let subCategoryIndex = 0; subCategory.length > subCategoryIndex; subCategoryIndex++) {
              if(subCategory[subCategoryIndex].rateAnalysisId === subCategoryId) {
                subCategory[subCategoryIndex].workItems.push(workitem);
                responseWorkitem = subCategory[subCategoryIndex].workItems;
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

  addSubcategoryToCostHead(projectId:string, buildingId:string, costheadId:string, subcategoryObject : any, user:User,
    callback:(error: any, result: any)=> void) {

    let subCategoryObj : SubCategory = new SubCategory(subcategoryObject.subCategory, subcategoryObject.subCategoryId);

    let query = {'_id' : buildingId, 'costHeads.rateAnalysisId' : parseInt(costheadId)};
    let newData = { $push: { 'costHeads.$.subCategories': subCategoryObj }};

    this.buildingRepository.findOneAndUpdate(query, newData,{new: true}, (error, building) => {
      logger.info('Project service, addSubcategoryToCostHead has been hit');
      if (error) {
        callback(error, null);
      } else {
        callback(null, {data: building, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  deleteSubcategoryFromCostHead(projectId:string, buildingId:string, costheadId:string, subcategoryObject : any, user:User,
                           callback:(error: any, result: any)=> void) {

    this.buildingRepository.findById(buildingId, (error, building) => {
      logger.info('Project service, deleteSubcategoryFromCostHead has been hit');
      if (error) {
        callback(error, null);
      } else {
        let costHeadList = building.costHeads;
        let subCategoryList : any = [];

        for(let index=0; index<costHeadList.length; index++) {
          if(parseInt(costheadId) === costHeadList[index].rateAnalysisId) {
            subCategoryList = costHeadList[index].subCategories;
            for(let subcategoryIndex=0; subcategoryIndex<subCategoryList.length; subcategoryIndex++) {
              if(subCategoryList[subcategoryIndex].rateAnalysisId === subcategoryObject.rateAnalysisId) {
                subCategoryList.splice(subcategoryIndex, 1);
              }
            }
          }
        }

        let query = {'_id' : buildingId, 'costHeads.rateAnalysisId' : parseInt(costheadId)};
        let newData = {'$set' : {'costHeads.$.subCategories' : subCategoryList }};

        this.buildingRepository.findOneAndUpdate(query, newData,{new: true}, (error, dataList) => {
          logger.info('Project service, deleteSubcategoryFromCostHead has been hit');
          if (error) {
            callback(error, null);
          } else {
            callback(null, {data: dataList, access_token: this.authInterceptor.issueTokenWithUid(user)});
          }
        });
      }
    });
  }

  getSubcategory(projectId:string, buildingId:string, costheadId:number, user:User, callback:(error: any, result: any)=> void) {
    logger.info('Project service, getSubcategory has been hit');
    this.buildingRepository.findById(buildingId, (error, building:Building) => {
      if (error) {
        callback(error, null);
      } else {
        let subCategories :Array<SubCategory> = null;
        for(let index = 0; building.costHeads.length > index; index++) {
          if(building.costHeads[index].rateAnalysisId === costheadId) {
            subCategories = building.costHeads[index].subCategories;
            let workitems = subCategories;
            for(let subcategoryIndex = 0 ; subcategoryIndex < subCategories.length; subcategoryIndex ++) {
              let workitems = subCategories[subcategoryIndex].workItems;
              for(let workitemsIndex = 0; workitemsIndex < workitems.length; workitemsIndex ++) {
                  let workitem = workitems[workitemsIndex];
                if(workitem.quantity.total !== null && workitem.rate.total !== null
                  && workitem.quantity.total !== 0 && workitem.rate.total !== 0) {
                  subCategories[subcategoryIndex].amount = parseFloat((workitem.quantity.total * workitem.rate.total
                    + subCategories[subcategoryIndex].amount).toFixed(2));
                } else {
                  subCategories[subcategoryIndex].amount=0;
                  break;
                }
              }
            }
          }
        }
        callback(null, {data: subCategories, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }
}

Object.seal(ProjectService);
export = ProjectService;
