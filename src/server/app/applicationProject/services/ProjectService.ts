import ProjectRepository = require('../dataaccess/repository/ProjectRepository');
import BuildingRepository = require('../dataaccess/repository/BuildingRepository');
import Messages = require('../shared/messages');
import UserService = require('./../../framework/services/UserService');
import ProjectAsset = require('../../framework/shared/projectasset');
import User = require('../../framework/dataaccess/mongoose/user');
import Project = require('../dataaccess/mongoose/Project');
import Building = require('../dataaccess/mongoose/Building');
import AuthInterceptor = require('../../framework/interceptor/auth.interceptor');
import CostControllException = require('../exception/CostControllException');
import Quantity = require('../dataaccess/model/Quantity');
import Rate = require('../dataaccess/model/Rate');

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
        this.userService.findOneAndUpdate(user._id, newData, {new :true},(err, resp) => {
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

  getBuilding(projectId : string, buildingId : string, user: User, callback:(error: any, result: any)=> void) {
    this.buildingRepository.findById(buildingId, (error, result) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, {data: result, access_token: this.authInterceptor.issueTokenWithUid(user)});
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

  deleteBuildingCostHead( buildingId : string, costHead : string, user: User,
                            callback: (error: any, result: any) => void) {
    let query = {'_id' : buildingId, 'costHead.name' : costHead};
    let newData = { $set : {'costHead.$.active' : false}};
    this.buildingRepository.findOneAndUpdate(query, newData, {new: true},(err, response) => {
      if(err) {
        callback(err, null);
      } else {
        callback(null, {data: response, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }
}

Object.seal(ProjectService);
export = ProjectService;
