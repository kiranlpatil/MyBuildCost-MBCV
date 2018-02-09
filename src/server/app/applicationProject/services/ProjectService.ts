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
    /*let category = data.category;
    for(let i=0; i< category.length; i++){
      //console.log('category '+i+' : '+JSON.stringify(category[i]));
      let item = category[i].item;
      for(let j=0; j<item.length; j++){
        //console.log('item '+j+' : '+JSON.stringify(item[j]));
        let itemDetails = item[j];
        itemDetails.amount = itemDetails.qty * itemDetails.rate;
      }
    }*/

    this.projectRepository.create(data, (err, res) => {
      if (err) {
        callback(err, null);
      } else {
        logger.info('Project service, create has been hit');
        logger.debug('Project ID : '+res._id);
        logger.debug('Project Name : '+res._doc.name);
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
    //let populate = {path : 'building'};
    this.projectRepository.findAndPopulate(query, populate, (error, result) => {
      logger.info('Project service, findAndPopulate has been hit');
      logger.debug('Project Name : '+result[0]._doc.name);
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
        let newData = { $push: {building : result._id}};
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
    //delete buildingDetail._id;
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
    //delete buildingDetail._id;
    this.buildingRepository.findById(buildingId, (error, result) => {
      logger.info('Project service, findById has been hit');
      if (error) {
        callback(error, null);
      } else {
        let clonedCostHeadDetails :Array<CostHead>=[];
        let costHeads =buildingDetail.costHead;
        let resultCostHeads = result.costHead;
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
                let resultSubCategoryList = resultCostHead.subCategory;

                for(let resultSubcategoryIndex=0; resultSubcategoryIndex<resultSubCategoryList.length; resultSubcategoryIndex++) {
                  for(let subcategoryIndex=0 ; subcategoryIndex<subcategoryList.length; subcategoryIndex++) {
                    if(subcategoryList[subcategoryIndex].name === resultSubCategoryList[resultSubcategoryIndex].name) {
                      if(!subcategoryList[subcategoryIndex].active) {
                        resultSubCategoryList.splice(resultSubcategoryIndex,1);
                      } else {
                        let resultWorkitemList = resultSubCategoryList[resultSubcategoryIndex].workitem;
                        let workItemList = subcategoryList[subcategoryIndex].workitem;

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
                clonedCostHead.subCategory = resultCostHead.subCategory;
              } else {
                clonedCostHead.subCategory = resultCostHead.subCategory;
              }
                clonedCostHeadDetails.push(clonedCostHead);
            }
          }
        }

        let updateBuildingCostHeads = {'costHead' : clonedCostHeadDetails};
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
        let response = result.costHead;
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
        let clonedBuilding = result.costHead;
        let building = new BuildingModel();
        building.name = result.name;
        building.totalSlabArea = result.totalSlabArea;
        building.totalCarperAreaOfUnit = result.totalCarperAreaOfUnit;
        building.totalSaleableAreaOfUnit = result.totalSaleableAreaOfUnit;
        building.plinthArea = result.plinthArea;
        building.totalNoOfFloors = result.totalNoOfFloors;
        building.noOfParkingFloors = result.noOfParkingFloors;
        building.carpetAreaOfParking = result.carpetAreaOfParking;
        building.noOfOneBHK = result.noOfOneBHK;
        building.noOfTwoBHK = result.noOfTwoBHK;
        building.noOfThreeBHK = result.noOfThreeBHK;
        building.noOfFourBHK = result.noOfFourBHK;
        building.noOfFiveBHK = result.noOfFiveBHK;
        building.noOfLift = result.noOfLift;

        let clonedCostHeadArray : Array<ClonedCostHead> = [];

        for(let costHeadIndex = 0; costHeadIndex < clonedBuilding.length; costHeadIndex++) {

          let clonedCostHead = new ClonedCostHead;
          clonedCostHead.name = clonedBuilding[costHeadIndex].name;
          clonedCostHead.rateAnalysisId = clonedBuilding[costHeadIndex].rateAnalysisId;
          clonedCostHead.active = clonedBuilding[costHeadIndex].active;
          clonedCostHead.budgetedCostAmount = clonedBuilding[costHeadIndex].budgetedCostAmount;

          let clonedWorkItemArray : Array<ClonedWorkItem> = [];
          let clonedSubcategoryArray : Array<ClonedSubcategory> = [];
          let subCategoryArray = clonedBuilding[costHeadIndex].subCategory;

          for(let subCategoryIndex=0; subCategoryIndex<subCategoryArray.length; subCategoryIndex++) {
            let clonedSubcategory = new ClonedSubcategory();
            clonedSubcategory.name = subCategoryArray[subCategoryIndex].name;
            clonedSubcategory.rateAnalysisId = subCategoryArray[subCategoryIndex].rateAnalysisId;
            clonedSubcategory.amount = subCategoryArray[subCategoryIndex].amount;
            clonedSubcategory.active = true;

            let workitemArray = subCategoryArray[subCategoryIndex].workitem;
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
            clonedSubcategory.workitem = clonedWorkItemArray;
            clonedSubcategoryArray.push(clonedSubcategory);
          }
          clonedCostHead.subCategory = clonedSubcategoryArray;
          clonedCostHeadArray.push(clonedCostHead);
        }
        building.costHead = clonedCostHeadArray;
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

  getQuantity(projectId:string, buildingId:string, costhead: CostHead, workitem, user, callback:(error: any, result: any)=> void) {
    logger.info('Project service, getQuantity has been hit');
    this.buildingRepository.findById(buildingId, (error, building:Building) => {
      if (error) {
        callback(error, null);
      } else {
        let quantity: Quantity;
        for(let index = 0; building.costHead.length > index; index++) {
         if(building.costHead[index].name === costhead) {
           quantity = building.costHead[index].workitem[workitem].quantity;
         }
        }
        if(quantity.total === null) {
          for(let index = 0; quantity.item.length > index; index ++) {
            quantity.total = quantity.item[index].quantity + quantity.total;
          }
        }
        callback(null, {data: quantity, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  getRate(projectId:string, buildingId:string, costheadId:number,subcategoryId:number, workitemId:number, user,
          callback:(error: any, result: any)=> void) {
    logger.info('Project service, getRate has been hit');

    let rateAnalysisServices: RateAnalysisService = new RateAnalysisService();
    rateAnalysisServices.getRate(workitemId, (error, rateData) => {
      if (error) {
        callback(error, null);
      } else {
        let rate :Rate = new Rate()
        rate.item = rateData;
        /*for (let index = 0; rate.item.length > index; index++) {
          rate.total = rate.item[index].totalAmount + rate.total;
        }*/
        callback(null, {data: rateData, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  updateRate(projectId:string, buildingId:string, costheadId:number,subcategoryId:number, workitemId:number, rate :Rate, user, callback:(error: any, result: any)=> void) {
    logger.info('Project service, updateRate has been hit');
    this.buildingRepository.findById(buildingId, (error, building:Building) => {
      logger.info('Project service, findById has been hit');
      if (error) {
        callback(error, null);
      } else {
        //let rate: Rate;
        let rateAnalysisId: number;
        for(let index = 0; building.costHead.length > index; index++) {
          if(building.costHead[index].rateAnalysisId === costheadId) {
            for(let indexSubcategory = 0; building.costHead[index].subCategory.length > indexSubcategory; indexSubcategory++) {
              if (building.costHead[index].subCategory[indexSubcategory].rateAnalysisId === subcategoryId) {
                for(let indexWorkitem = 0; building.costHead[index].subCategory[indexSubcategory].workitem.length > indexWorkitem
                  ; indexWorkitem++) {
                  if (building.costHead[index].subCategory[indexSubcategory].workitem[indexWorkitem].rateAnalysisId === workitemId) {
                    building.costHead[index].subCategory[indexSubcategory].workitem[indexWorkitem].rate=rate;
                  }
                }
              }
            }
          }
        }
        let query = {'_id' : buildingId};
        let newData = { $set : {'costHead' : building.costHead}};
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

  deleteQuantity(projectId:string, buildingId:string, costheadId:string, subcategoryId:string, workitemId:string, user:User, item:string, callback:(error: any, result: any)=> void) {
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
              for(let index = 0; building.costHead.length > index; index++) {
                if (building.costHead[index].rateAnalysisId === this.costHeadId) {
                  for (let index1 = 0; building.costHead[index].subCategory.length > index1; index1++) {
                    if (building.costHead[index].subCategory[index1].rateAnalysisId === this.subCategoryId) {
                      for (let index2 = 0; building.costHead[index].subCategory[index1].workitem.length > index2; index2++) {
                        if (building.costHead[index].subCategory[index1].workitem[index2].rateAnalysisId === this.workItemId) {
                          quantity = building.costHead[index].subCategory[index1].workitem[index2].quantity;
                        }
                      }
                    }
                  }
                }
              }
        for(let index = 0; quantity.item.length > index; index ++) {
          if(quantity.item[index].item  === item) {
            quantity.item.splice(index,1);
          }
        }
        let query = { _id : buildingId };
        this.buildingRepository.findOneAndUpdate(query, building,{new: true}, (error, building) => {
          logger.info('Project service, findOneAndUpdate has been hit');
          if (error) {
            callback(error, null);
          } else {
            let quantity: Quantity;
            for(let index = 0; building.costHead.length > index; index++) {
              if (building.costHead[index].rateAnalysisId === this.costHeadId) {
                for (let index1 = 0; building.costHead[index].subCategory.length > index1; index1++) {
                  if (building.costHead[index].subCategory[index1].rateAnalysisId === this.subCategoryId) {
                    for (let index2 = 0; building.costHead[index].subCategory[index1].workitem.length > index2; index2++) {
                      if (building.costHead[index].subCategory[index1].workitem[index2].rateAnalysisId === this.workItemId) {
                        quantity = building.costHead[index].subCategory[index1].workitem[index2].quantity;
                      }
                    }
                  }
                }
              }
            }
            if(quantity.total === null) {
              for(let index = 0; quantity.item.length > index; index ++) {
                quantity.total = quantity.item[index].quantity + quantity.total;
              }
            }
            callback(null, {data: quantity, access_token: this.authInterceptor.issueTokenWithUid(user)});
          }
        });
      }
    });
  }
  deleteWorkitem(projectId:string, buildingId:string, costhead:string, workitem:WorkItem, user:User,
                 callback:(error: any, result: any)=> void) {
    logger.info('Project service, deleteWorkitem has been hit');
    this.buildingRepository.findById(buildingId, (error, building:Building) => {
      if (error) {
        callback(error, null);
      } else {
        for(let index = 0; building.costHead.length > index; index++) {
          if(building.costHead[index].name === costhead) {
            delete building.costHead[index].workitem[workitem];
          }
        }
        let query = { _id : buildingId };
        this.buildingRepository.findOneAndUpdate(query, building,{new: true}, (error, building) => {
          logger.info('Project service, findOneAndUpdate has been hit');
          if (error) {
            callback(error, null);
          } else {
            let message = workitem + ' deleted.';
            callback(null, {data: message, access_token: this.authInterceptor.issueTokenWithUid(user)});
          }
        });
      }
    });
  }

  getReportCostHeadDetails( buildingId : string, costHead : string, user: User,callback: (error: any, result: any) => void) {
    this.buildingRepository.findById(buildingId, (error, result) => {
      logger.info('Project service, findById has been hit');
      if (error) {
        callback(error, null);
      } else {

        let response = result.costHead;
        let costHeadItem;
        for(let costHeadItems of response) {
          if(costHeadItems.name === costHead) {
            costHeadItem = costHeadItems.workitem;
          }
        }
        callback(null, {data: costHeadItem, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  updateBuildingCostHead( buildingId : string, costHead : string, costHeadValue : string, user: User,
                          callback: (error: any, result: any) => void) {
    let query = {'_id' : buildingId, 'costHead.name' : costHead};
    let value = JSON.parse(costHeadValue);
    let newData = { $set : {'costHead.$.active' : value}};
    this.buildingRepository.findOneAndUpdate(query, newData, {new: true},(err, response) => {
      logger.info('Project service, findOneAndUpdate has been hit');
      if(err) {
        callback(err, null);
      } else {
        callback(null, {data: response, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  updateBudgetedCostForCostHead( buildingId : string, costHead : string, costHeadBudgetedAmountEdited : any, user: User,
                                 callback: (error: any, result: any) => void) {
    logger.info('Project service, updateBudgetedCostForCostHead has been hit');
    let query = {'_id' : buildingId, 'costHead.name' : costHead};
    let costInUnit = costHeadBudgetedAmountEdited.costIn;
    let costPerUnit = costHeadBudgetedAmountEdited.costPer;
    let rate = 0;
    let newData;
    rate = costHeadBudgetedAmountEdited.budgetedCostAmount / costHeadBudgetedAmountEdited.buildingArea;

    if(costPerUnit === 'saleableArea' && costInUnit === 'sqft') {
      newData = { $set : {
        'costHead.$.thumbRuleRate.saleableArea.sqft' : rate,
        'costHead.$.thumbRuleRate.saleableArea.sqmt' : rate * config.get('SqureMeter')
      } };
    } else if(costPerUnit === 'saleableArea' && costInUnit === 'sqmt') {
      newData = { $set : {
        'costHead.$.thumbRuleRate.saleableArea.sqmt' : rate,
        'costHead.$.thumbRuleRate.saleableArea.sqft' : rate / config.get('SqureMeter')
      } };
    } else if(costPerUnit === 'slabArea' && costInUnit === 'sqft') {
      newData = { $set : {
        'costHead.$.thumbRuleRate.slabArea.sqft' : rate,
        'costHead.$.thumbRuleRate.slabArea.sqmt' : rate * config.get('SqureMeter')
      } };
    } else if(costPerUnit === 'slabArea' && costInUnit === 'sqmt') {
      newData = { $set : {
        'costHead.$.thumbRuleRate.slabArea.sqmt' : rate,
        'costHead.$.thumbRuleRate.slabArea.sqft' : rate / config.get('SqureMeter')
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
        for(let index = 0; building.costHead.length > index; index++) {
          if(building.costHead[index].name === costhead) {
            let quantityArray :Quantity = building.costHead[index].workitem[workitem].quantity.item;
            let exist = false;
            let errorMessage ;
            for(let quantityIndex = 0; quantityArray.length > quantityIndex; quantityIndex++ ) {
              if(quantityArray[quantityIndex].item === quantity.item ) {
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
                    for(let index = 0; quantity.item.length > index; index ++) {
                      quantity.total = quantity.item[index].quantity + quantity.total;
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

  updateQuantity(projectId:string, buildingId:string, costheadId:string, subcategoryId:string, workitemId:string, quantity:any, user:User, callback:(error: any, result: any)=> void) {
    logger.info('Project service, updateQuantity has been hit');
    this.buildingRepository.findById(buildingId, (error, building) => {
      if (error) {
        callback(error, null);
      } else {
        let costHeadList = building.costHead;
        let quantityArray  : Quantity;
        for (let index = 0; index < costHeadList.length; index++) {
          if (parseInt(costheadId) === costHeadList[index].rateAnalysisId) {
            for (let index1 = 0; index1 < costHeadList[index].subCategory.length; index1++) {
              if (parseInt(subcategoryId) === costHeadList[index].subCategory[index1].rateAnalysisId) {
                for (let index2 = 0; index2 < costHeadList[index].subCategory[index1].workitem.length; index2++) {
                  if (parseInt(workitemId) === costHeadList[index].subCategory[index1].workitem[index2].rateAnalysisId) {
                    quantityArray  = costHeadList[index].subCategory[index1].workitem[index2].quantity;
                    quantityArray.item = quantity;
                    quantityArray.total = 0;
                    for (let itemIndex = 0; quantityArray.item.length > itemIndex; itemIndex++) {
                      quantityArray.total = quantityArray.item[itemIndex].quantity + quantityArray.total;
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
              let costHeadList = building.costHead;
              let quantity  : Quantity;
              for (let index = 0; index < costHeadList.length; index++) {
                if (parseInt(costheadId) === costHeadList[index].rateAnalysisId) {
                  for (let index1 = 0; index1 < costHeadList[index].subCategory.length; index1++) {
                    if (parseInt(subcategoryId) === costHeadList[index].subCategory[index1].rateAnalysisId) {
                      for (let index2 = 0; index2 < costHeadList[index].subCategory[index1].workitem.length; index2++) {
                        if (parseInt(workitemId) === costHeadList[index].subCategory[index1].workitem[index2].rateAnalysisId) {
                          quantity  = costHeadList[index].subCategory[index1].workitem[index2].quantity;
                        }
                      }
                    }
                  }
                }
              }
              if (quantity.total === null) {
                for (let index = 0; index < quantity.item.length; index++) {
                  quantity.total = quantity.item[index].quantity + quantity.total;
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
        for(let index = 0; building.costHead.length > index; index++) {
          if(building.costHead[index].rateAnalysisId === costheadId) {
            let subCategory = building.costHead[index].subCategory;
            for(let subCategoryIndex = 0; subCategory.length > subCategoryIndex; subCategoryIndex++) {
              if(subCategory[subCategoryIndex].rateAnalysisId === subCategoryId) {
                subCategory[subCategoryIndex].workitem.push(workitem);
                responseWorkitem = subCategory[subCategoryIndex].workitem;
              }
            }
            let query = { _id : buildingId };
            let newData = { $set : {'costHead' : building.costHead}};
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

    let query = {'_id' : buildingId, 'costHead.rateAnalysisId' : parseInt(costheadId)};
    let newData = { $push: { 'costHead.$.subCategory': subCategoryObj }};

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
        let costHeadList = building.costHead;
        let subCategoryList : any = [];

        for(let index=0; index<costHeadList.length; index++) {
          if(parseInt(costheadId) === costHeadList[index].rateAnalysisId) {
            subCategoryList = costHeadList[index].subCategory;
            for(let subcategoryIndex=0; subcategoryIndex<subCategoryList.length; subcategoryIndex++) {
              if(subCategoryList[subcategoryIndex].rateAnalysisId === subcategoryObject.rateAnalysisId) {
                subCategoryList.splice(subcategoryIndex, 1);
              }
            }
          }
        }

        let query = {'_id' : buildingId, 'costHead.rateAnalysisId' : parseInt(costheadId)};
        let newData = {'$set' : {'costHead.$.subCategory' : subCategoryList }};

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

  deleteQuantity(projectId:string, buildingId:string, costheadId:string, subcategoryId:string, workitemId:string, user:User, item:string, callback:(error: any, result: any)=> void) {
   this.buildingRepository.findById(buildingId, (error, building) => {
     if (error) {
       callback(error, null);
     } else {
       let costHeadList = building.costHead;
       let quantity: Quantity;
       let itemList: any [];
       for (let index = 0; index < costHeadList.length; index++) {
         if (parseInt(costheadId) === costHeadList[index].rateAnalysisId) {
           for (let index1 = 0; index1 < costHeadList[index].subCategory.length; index1++) {
             if (parseInt(subcategoryId) === costHeadList[index].subCategory[index1].rateAnalysisId) {
               for (let index2 = 0; index2 < costHeadList[index].subCategory[index1].workitem.length; index2++) {
                 if (parseInt(workitemId) === costHeadList[index].subCategory[index1].workitem[index2].rateAnalysisId) {
                   quantity = costHeadList[index].subCategory[index1].workitem[index2].quantity;
                 }
               }
             }
           }
         }
       }
       for (let index = 0; quantity.item.length > index; index++) {
         if (quantity.item[index].item === item) {
           quantity.item.splice(index, 1);
         }
       }
       /* let query = {'_id': buildingId, 'costHead.rateAnalysisId': parseInt(costheadId)};
        let newData = {'$set': {'costHead.$.subCategory.$.workitem.$.quantity': quantity}};*/
       let query = { _id : buildingId };
       this.buildingRepository.findOneAndUpdate(query, building, {new: true}, (error, building) => {
         logger.info('Project service, deleteQuantityFromWorkitem has been hit');
         if (error) {
           callback(error, null);
         } else {
           let costHeadList = building.costHead;
           let quantity: Quantity;
           let itemList: any [];
           for (let index = 0; index < costHeadList.length; index++) {
             if (parseInt(costheadId) === costHeadList[index].rateAnalysisId) {
               for (let index1 = 0; index1 < costHeadList[index].subCategory.length; index1++) {
                 if (parseInt(subcategoryId) === costHeadList[index].subCategory[index1].rateAnalysisId) {
                   for (let index2 = 0; index2 < costHeadList[index].subCategory[index1].workitem.length; index2++) {
                     if (parseInt(workitemId) === costHeadList[index].subCategory[index1].workitem[index2].rateAnalysisId) {
                       quantity = costHeadList[index].subCategory[index1].workitem[index2].quantity;
                     }
                   }
                 }
               }
             }
           }
           if (quantity.total === null) {
             for (let index = 0; quantity.item.length > index; index++) {
               quantity.total = quantity.item[index].quantity + quantity.total;
             }
           }
           callback(null, {data: quantity, access_token: this.authInterceptor.issueTokenWithUid(user)});
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
        let subCategory :Array<SubCategory> = null;
        for(let index = 0; building.costHead.length > index; index++) {
          if(building.costHead[index].rateAnalysisId === costheadId) {
            subCategory = building.costHead[index].subCategory;
          }
        }
        callback(null, {data: subCategory, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }
}

Object.seal(ProjectService);
export = ProjectService;
