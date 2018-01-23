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

class ProjectService {
  APP_NAME: string;
  company_name: string;
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
        let projectId = res._id;
        let newData =  {$push: { project: projectId }};
        let query = {_id : user._id};
        this.userService.findOneAndUpdate(query, newData, {new :true},(err, resp) => {
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

  getProject( projectId : any, user: User, callback: (error: any, result: any) => void) {
    let query = { _id: projectId};
    let populate = {path : 'building', select: ['name' , 'totalSlabArea',]};
    //let populate = {path : 'building'};
    this.projectRepository.findAndPopulate(query, populate, (error, result) => {
      if(error) {
        callback(error, null);
      } else {
        callback(null,{ data: result, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  updateProjectDetails( projectDetails: Project, user: User, callback:(error: any, result:any) => void) {
    let query = { _id : projectDetails._id };
    delete projectDetails._id;

    this.projectRepository.findOneAndUpdate(query, projectDetails, {new: true}, (error, result) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, {data: result, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  addBuilding(projectId : any, buildingDetail : Building, user: User, callback:(error: any, result: any)=> void) {
    this.buildingRepository.create(buildingDetail, (error, result)=> {
      if(error) {
        callback(error, null);
      } else {
        let query = {_id : projectId };
        let newData = { $push: {building : result._id}};
        this.projectRepository.findOneAndUpdate(query, newData, {new : true}, (error, status)=> {
          if(error) {
            callback(error, null);
          } else {
            callback(null, {data: result, access_token: this.authInterceptor.issueTokenWithUid(user)});
          }
        });
      }
    });
  }

  updateBuilding( buildingId, buildingDetail, user, callback:(error: any, result: any)=> void) {
    let query = { _id : buildingId };
    //delete buildingDetail._id;
    this.buildingRepository.findOneAndUpdate(query, buildingDetail,{new: true}, (error, result) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, {data: result, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  cloneBuildingDetails( buildingId, buildingDetail, user, callback:(error: any, result: any)=> void) {
    let query = { _id : buildingId };
    //delete buildingDetail._id;
    this.buildingRepository.findById(buildingId, (error, result) => {
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
                let workItemList = costHead.workitem;
                let resultWorkItemList = resultCostHead.workitem;

                for(let workItem of workItemList) {
                  for(let resultWorkItem in resultWorkItemList) {
                    if(workItem.name === resultWorkItem) {
                      if(!workItem.active) {
                        delete resultWorkItemList[resultWorkItem];
                      }
                    }
                  }
                }
                clonedCostHead.workitem = resultWorkItemList;
              } else {
                clonedCostHead.workitem = resultCostHead.workitem;
              }
              clonedCostHeadDetails.push(clonedCostHead);
            }
          }
        }

        let updateBuildingCostHeads = {'costHead' : clonedCostHeadDetails};
        this.buildingRepository.findOneAndUpdate(query, updateBuildingCostHeads,{new: true}, (error, result) => {
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
    this.buildingRepository.findById(buildingId, (error, result) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, {data: result, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  getInActiveCostHead(projectId: string, buildingId: string, user: User, callback:(error: any, result: any)=> void) {
    this.buildingRepository.findById(buildingId, (error, result) => {
      if (error) {
        callback(error, null);
      } else {
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
    this.buildingRepository.findById(buildingId, (error, result) => {
      if (error) {
        callback(error, null);
      } else {
        let clonedBuilding = result.costHead;
        let building = new BuildingModel();
        building.name = result.name;
        building.totalSlabArea = result.totalSlabArea;
        building.totalCarperAreaOfUnit = result.totalCarperAreaOfUnit;
        building.totalSaleableAreaOfUnit = result.totalSaleableAreaOfUnit;
        building.totalParkingAreaOfUnit = result.totalParkingAreaOfUnit;
        building.noOfOneBHK = result.noOfOneBHK;
        building.noOfTwoBHK = result.noOfTwoBHK;
        building.noOfThreeBHK = result.noOfThreeBHK;
        building.noOfSlab = result.noOfSlab;
        building.noOfLift = result.noOfLift;

        let clonedCostHeadArray : Array<ClonedCostHead> = [];

        for(let costHeadIndex = 0; costHeadIndex < clonedBuilding.length; costHeadIndex++) {

          let clonedCostHead = new ClonedCostHead;
          clonedCostHead.name = clonedBuilding[costHeadIndex].name;
          clonedCostHead.rateAnalysisId = clonedBuilding[costHeadIndex].rateAnalysisId;
          clonedCostHead.active = clonedBuilding[costHeadIndex].active;

          let clonedWorkItemArray : Array<ClonedWorkItem> = [];
          let workItemsArray = clonedBuilding[costHeadIndex].workitem;

          for(let key in  workItemsArray) {
            let clonedWorkItem = new ClonedWorkItem();
            clonedWorkItem.name = workItemsArray[key].name;
            clonedWorkItem.rateAnalysisId = workItemsArray[key].rateAnalysisId;
            clonedWorkItem.quantity = workItemsArray[key].quantity;
            clonedWorkItem.rate = workItemsArray[key].rate;
            clonedWorkItem.active = true;
            clonedWorkItemArray.push(clonedWorkItem);
          }
          clonedCostHead.workitem = clonedWorkItemArray;
          clonedCostHeadArray.push(clonedCostHead);
        }
        building.costHead = clonedCostHeadArray;
        callback(null, {data: building, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  deleteBuilding(projectId, buildingId, user, callback:(error: any, result: any)=> void) {
    let popBuildingId = buildingId;
    this.buildingRepository.delete(buildingId, (error, result)=> {
      if(error) {
        callback(error, null);
      } else {
        let query = {_id: projectId};
        let newData = { $pull: {building : popBuildingId}};
        this.projectRepository.findOneAndUpdate(query, newData, {new: true}, (error, status)=> {
          if(error) {
            callback(error, null);
          } else {
            callback(null, {data: status, access_token: this.authInterceptor.issueTokenWithUid(user)});
          }
        });
      }
    });
  }

  getQuantity(projectId, buildingId, costhead, workitem, user, callback:(error: any, result: any)=> void) {
    this.buildingRepository.findById(buildingId, (error, building:Building) => {
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

  getRate(projectId, buildingId, costhead, workitem, user, callback:(error: any, result: any)=> void) {
    this.buildingRepository.findById(buildingId, (error, building:Building) => {
      if (error) {
        callback(error, null);
      } else {
        let rate: Rate;
        for(let index = 0; building.costHead.length > index; index++) {
          if(building.costHead[index].name === costhead) {
            rate = building.costHead[index].workitem[workitem].rate;
          }
        }
        if(rate.total === null) {
          for(let index = 0; rate.item.length > index; index ++) {
            rate.total = rate.item[index].totalAmount + rate.total;
          }
        }
        callback(null, {data: rate, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  deleteQuantity(projectId, buildingId, costhead, workitem, item, user, callback:(error: any, result: any)=> void) {
    this.buildingRepository.findById(buildingId, (error, building:Building) => {
      if (error) {
        callback(error, null);
      } else {
        let quantity: Quantity;
        for(let index = 0; building.costHead.length > index; index++) {
          if(building.costHead[index].name === costhead) {
            quantity =  building.costHead[index].workitem[workitem].quantity;
          }
        }
        for(let index = 0; quantity.item.length > index; index ++) {
          if(quantity.item[index].item  === item) {
           quantity.item.splice(index,1);
          }
        }
        let query = { _id : buildingId };
        this.buildingRepository.findOneAndUpdate(query, building,{new: true}, (error, building) => {
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
    });
  }

  deleteWorkitem(projectId, buildingId, costhead, workitem, user, callback:(error: any, result: any)=> void) {
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

  getReportCostHeadDetails( buildingId : string, costHead : string, user: User,
                            callback: (error: any, result: any) => void) {
    this.buildingRepository.findById(buildingId, (error, result) => {
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
      if(err) {
        callback(err, null);
      } else {
        callback(null, {data: response, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  createQuantity(projectId, buildingId, costhead, workitem, quantity, user, callback:(error: any, result: any)=> void) {
    this.buildingRepository.findById(buildingId, (error, building:Building) => {
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
                  }else {
                    exist = false;
                  }
                }
            }
            if(exist) {
              callback(new CostControllException(errorMessage, errorMessage), null);
            }else {
              quantityArray.push(quantity);
              let query = { _id : buildingId };
              this.buildingRepository.findOneAndUpdate(query, building,{new: true}, (error, building) => {
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

  updateQuantity(projectId, buildingId, costhead, workitem, quantity, user, callback:(error: any, result: any)=> void) {
    this.buildingRepository.findById(buildingId, (error, building:Building) => {
      if (error) {
        callback(error, null);
      } else {
        for(let index = 0; building.costHead.length > index; index++) {
          if(building.costHead[index].name === costhead) {
            let quantityArray :Quantity = building.costHead[index].workitem[workitem].quantity;
            quantityArray.item = quantity;
            if(quantityArray.total === null) {
              quantityArray.total = 0;
            }
            for(let itemIndex =0; quantityArray.item.length >  itemIndex; itemIndex++) {
              quantityArray.total = quantityArray.item[itemIndex].quantity + quantityArray.total;
            }
            let query = { _id : buildingId };
            this.buildingRepository.findOneAndUpdate(query, building,{new: true}, (error, building) => {
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
    });
  }
}

Object.seal(ProjectService);
export = ProjectService;
