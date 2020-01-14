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
import alasql = require('alasql');
import BudgetCostRates = require('../dataaccess/model/project/reports/BudgetCostRates');
import ThumbRuleRate = require('../dataaccess/model/project/reports/ThumbRuleRate');
import Constants = require('../../applicationProject/shared/constants');
import QuantityDetails = require('../dataaccess/model/project/building/QuantityDetails');
import RateItem = require('../dataaccess/model/project/building/RateItem');
import CategoriesListWithRatesDTO = require('../dataaccess/dto/project/CategoriesListWithRatesDTO');
import CentralizedRate = require('../dataaccess/model/project/CentralizedRate');
import messages  = require('../../applicationProject/shared/messages');
import { CommonService } from '../../applicationProject/shared/CommonService';
import WorkItemListWithRatesDTO = require('../dataaccess/dto/project/WorkItemListWithRatesDTO');
import * as path from 'path';
import UserRepository = require('../../framework/dataaccess/repository/UserRepository');
import ProjectModel = require('../dataaccess/model/project/Project');
import UserSubscription = require('../dataaccess/model/project/Subscription/UserSubscription');
import * as multiparty from 'multiparty';
import { AttachmentDetailsModel } from '../dataaccess/model/project/building/AttachmentDetails';
let config = require('config');
let log4js = require('log4js');
import * as mongoose from 'mongoose';
import RateAnalysis = require('../dataaccess/model/RateAnalysis/RateAnalysis');
import SteelQuantityItems = require('../dataaccess/model/project/building/SteelQuantityItems');
import ItemGstRepository = require('../dataaccess/repository/ItemGstRepository');
import ItemGst = require('../dataaccess/model/RateAnalysis/ItemGst');
let xlsxj = require('xlsx-to-json');

//import RateItemsAnalysisData = require("../dataaccess/model/project/building/RateItemsAnalysisData");

let CCPromise = require('promise/lib/es6-extensions');
let logger=log4js.getLogger('Project service');
const fs = require('fs');
let ObjectId = mongoose.Types.ObjectId;
export class ProjectService {
  APP_NAME: string;
  company_name: string;
  costHeadId: number;
  categoryId: number;
  workItemId: number;
  showHideAddItemButton: boolean = true;
  private projectRepository: ProjectRepository;
  private buildingRepository: BuildingRepository;
  private authInterceptor: AuthInterceptor;
  private userService: UserService;
  private commonService: CommonService;
  private itemGstRepository: ItemGstRepository;
  private userRepository: UserRepository;


  constructor() {
    this.projectRepository = new ProjectRepository();
    this.buildingRepository = new BuildingRepository();
    this.APP_NAME = ProjectAsset.APP_NAME;
    this.authInterceptor = new AuthInterceptor();
    this.userService = new UserService();
    this.commonService = new CommonService();
    this.itemGstRepository = new ItemGstRepository();
    this.userRepository = new UserRepository();
  }

  createProject(data: Project, user: User, callback: (error: any, result: any) => void) {
    if (!user._id) {
      callback(new CostControllException('UserId Not Found', null), null);
    }

    this.userService.checkForValidSubscription(user._id, (err, resp) => {
      if (err) {
        callback(err, null);
      } else {
        if (resp.subscription) {
          if (resp.subscription.validity === 15 &&
            resp.subscription.purchased.length === 1) {
            let prefix = 'Trial Project ';
            let projectName = prefix.concat(data.name);
            data.name = projectName;
          }
          this.projectRepository.create(data, (err, res) => {
            if (err) {
              callback(err, null);
            } else {
              logger.info('Project service, create has been hit');
              logger.debug('Project ID : ' + res._id);
              logger.debug('Project Name : ' + res.name);
              let projectId = res._id;

              this.userService.findById(user._id, (err, resp) => {
                logger.info('Project service, findOneAndUpdate has been hit');
                if (err) {
                  callback(err, null);
                } else {

                  let subscriptionPackageList = resp.subscription;
                  for (let subscription of subscriptionPackageList) {
                    if (subscription.projectId.length === 0) {
                      subscription.projectId.push(projectId);
                    }
                  }

                  let newData = {
                    $push: {project: projectId},
                    $set: {subscription: subscriptionPackageList}
                  };

                  let query = {_id: user._id};
                  this.userService.findOneAndUpdate(query, newData, {new: true}, (err, resp) => {
                    logger.info('Project service, findOneAndUpdate has been hit');
                    if (err) {
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
          });
        }
      }
    });
  }

  getProjectById(projectId: string, user: User, callback: (error: any, result: any) => void) {
    let query = {_id: projectId};
    let populate = {path: 'building', select: ['name', 'totalSlabArea',]};
    this.projectRepository.findAndPopulate(query, populate, (error, result) => {
      logger.info('Project service, findAndPopulate has been hit');
      logger.debug('Project Name : ' + result[0].name);
      if (error) {
        callback(error, null);
      } else {
        callback(null, {data: result, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  getProjectAndBuildingDetails(projectId: string, callback: (error: any, result: any) => void) {
    logger.info('Project service, getProjectAndBuildingDetails for sync with rateAnalysis has been hit');
    let query = {_id: projectId};
    let populate = {path: 'buildings'};
    this.projectRepository.findAndPopulate(query, populate, (error, result) => {
      logger.info('Project service, findAndPopulate has been hit');
      if (error) {
        logger.error('Project service, getProjectAndBuildingDetails findAndPopulate failed ' + JSON.stringify(error));
        callback(error, null);
      } else {
        logger.debug('getProjectAndBuildingDetails success.');
        callback(null, {data: result});
      }
    });
  }

  updateProjectById(projectDetails: Project, user: User, callback: (error: any, result: any) => void) {
    logger.info('Project service, updateProjectDetails has been hit');
    let query = {_id: projectDetails._id};
    let buildingId = '';
    this.getProjectAndBuildingDetails(projectDetails._id, (error, projectAndBuildingDetails) => {
      if (error) {
        logger.error('Project service, getProjectAndBuildingDetails failed');
        callback(error, null);
      } else {

        logger.info('Project service, syncProjectWithRateAnalysisData.');
        let projectData = projectAndBuildingDetails.data[0];
        let buildings = projectAndBuildingDetails.data[0].buildings;
        let buildingData: Building;
        let isBudgetCostCalculationRequired: boolean = true;
        delete projectDetails._id;
        projectDetails.projectCostHeads = projectData.projectCostHeads;
        projectDetails.buildings = projectData.buildings;


        if (projectDetails.openSpace === projectData.openSpace &&
          projectDetails.plotArea === projectData.plotArea &&
          projectDetails.plotPeriphery === projectData.plotPeriphery &&
          projectDetails.podiumArea === projectData.podiumArea &&
          projectDetails.poolCapacity === projectData.poolCapacity &&
          projectDetails.projectDuration === projectData.projectDuration &&
          projectDetails.slabArea === projectData.slabArea) {
          isBudgetCostCalculationRequired = false;
        }
        if (isBudgetCostCalculationRequired) {
          projectDetails.projectCostHeads = this.calculateBudgetCostForCommonAmmenities(projectData.projectCostHeads, projectDetails);
        }

        this.projectRepository.findOneAndUpdate(query, projectDetails, {new: true}, (error, result) => {
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

  updateProjectStatus(projectId: string, user: User, activeStatus: string, callback: (error: any, result: any) => void) {
    let query = {'_id': projectId};
    let status = JSON.parse(activeStatus);
    let newData = {$set: {'activeStatus': activeStatus}};
    this.projectRepository.findOneAndUpdate(query, newData, {new: true}, (err, response) => {
      logger.info('Project service, findOneAndUpdate has been hit');
      if (err) {
        callback(err, null);
      } else {
        callback(null, {data: 'success', access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  updateProjectNameById(projectId: string, name: string, user: User, callback: (error: any, result: any) => void) {
    let query = {'_id': projectId};
    let newData = {$set: {'name': name}};
    this.projectRepository.findOneAndUpdate(query, newData, {new: true}, (err, response) => {
      logger.info('Project service, findOneAndUpdate has been hit');
      if (err) {
        callback(err, null);
      } else {
        callback(null, {data: response.name, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  createBuilding(projectId: string, buildingDetails: Building, user: User, callback: (error: any, result: any) => void) {

    logger.info('Report Service, getMaterialFilters has been hit');
    let query = {_id: projectId};
    let populate = {path: 'buildings', select: ['name']};
    this.projectRepository.findAndPopulate(query, populate, (error, result) => {
      logger.info('Report Service, findAndPopulate has been hit');
      if (error) {
        callback(error, null);
      } else {
        let buildingName = buildingDetails.name;

        let building: Array<Building> = result[0].buildings.filter(
          function (building: any) {
            return building.name === buildingName;
          });

        if (building.length === 0) {
          this.buildingRepository.create(buildingDetails, (error, result) => {
            logger.info('Project service, create has been hit');
            if (error) {
              callback(error, null);
            } else {
              let query = {_id: projectId};
              let newData = {$push: {buildings: result._id}};
              this.projectRepository.findOneAndUpdate(query, newData, {new: true}, (error, status) => {
                logger.info('Project service, findOneAndUpdate has been hit');
                if (error) {
                  callback(error, null);
                } else {
                  callback(null, {data: result});
                }
              });
            }
          });

        } else {
          let error = new Error();
          error.message = messages.MSG_ERROR_BUILDING_NAME_ALREADY_EXIST;
          callback(error, null);
        }


      }
    });
  }

  updateBuildingById(projectId: string, buildingId: string, buildingDetails: any, user: User,
                     callback: (error: any, result: any) => void) {
    logger.info('Project service, updateBuilding has been hit');
    let query = {_id: buildingId};
    let projection = {'costHeads': 1};
    this.buildingRepository.findByIdWithProjection(buildingId, projection, (error, result) => {
      logger.info('Project service, findOneAndUpdate has been hit');
      if (error) {
        callback(error, null);
      } else {
        this.getProjectAndBuildingDetails(projectId, (error, projectAndBuildingDetails) => {
          if (error) {
            logger.error('Project service, getProjectAndBuildingDetails failed');
            callback(error, null);
          } else {

            let projectData = projectAndBuildingDetails.data[0];
            let buildings: Array<Building> = projectAndBuildingDetails.data[0].buildings;
            let isBuildingNameExits: boolean = false;
            let isCostHeadCalculationRequired: boolean = true;
            for (let building of buildings) {
              if ((building.name === buildingDetails.name) && (building._id.toString() !== buildingId)) {
                isBuildingNameExits = true;
              }
              if (building._id.toString() === buildingId) {
                if (building.numOfOneBHK === buildingDetails.numOfOneBHK &&
                  building.numOfTwoBHK === buildingDetails.numOfTwoBHK &&
                  building.numOfThreeBHK === buildingDetails.numOfThreeBHK &&
                  building.numOfFourBHK === buildingDetails.numOfFourBHK &&
                  building.numOfFiveBHK === buildingDetails.numOfFiveBHK &&
                  building.totalCarpetAreaOfUnit === buildingDetails.totalCarpetAreaOfUnit &&
                  building.numOfParkingFloors === buildingDetails.numOfParkingFloors &&
                  building.totalNumOfFloors === buildingDetails.totalNumOfFloors &&
                  building.plinthArea === buildingDetails.plinthArea &&
                  building.totalSaleableAreaOfUnit === buildingDetails.totalSaleableAreaOfUnit &&
                  building.totalSlabArea === buildingDetails.totalSlabArea &&
                  building.numOfLifts === buildingDetails.numOfLifts &&
                  building.carpetAreaOfParking === buildingDetails.carpetAreaOfParking) {
                  isCostHeadCalculationRequired = false;
                }
              }
            }
            if (!isBuildingNameExits) {
              if (isCostHeadCalculationRequired) {
                buildingDetails.costHeads = this.calculateBudgetCostForBuilding(result.costHeads, buildingDetails, projectData);
              } else {
                buildingDetails.costHeads = result.costHeads;
              }
              this.buildingRepository.findOneAndUpdate(query, buildingDetails, {new: true}, (error, result) => {
                logger.info('Project service, findOneAndUpdate has been hit');
                if (error) {
                  callback(error, null);
                } else {

                  /* this.getProjectAndBuildingDetails(projectId, buildingId, (error, projectAndBuildingDetails) => {
                 if (error) {
                   logger.error('Project service, getProjectAndBuildingDetails failed');
                   callback(error, null);
                 } else {
   */

                  logger.info('Project service, syncProjectWithRateAnalysisData.');
                  let projectCostHeads = this.calculateBudgetCostForCommonAmmenities(projectData.projectCostHeads, projectData);
                  let queryForProject = {'_id': projectId};
                  let updateProjectCostHead = {$set: {'projectCostHeads': projectCostHeads}};

                  logger.info('Calling update project Costheads has been hit');
                  this.projectRepository.findOneAndUpdate(queryForProject, updateProjectCostHead, {new: true},
                    (error: any, response: any) => {
                      if (error) {
                        logger.error('Error update project Costheads : ' + JSON.stringify(error));
                        callback(error, null);
                      } else {
                        logger.debug('Update project Costheads success');
                        callback(null, {data: result, access_token: this.authInterceptor.issueTokenWithUid(user)});
                      }
                    });
                  /* }
                 });*/
                }
              });
            } else {
              let error = new Error();
              error.message = messages.MSG_ERROR_BUILDING_NAME_ALREADY_EXIST;
              callback(error, null);
            }
          }
        });
      }
    });
  }

  getInActiveProjectCostHeads(projectId: string, user: User, callback: (error: any, result: any) => void) {
    logger.info('Project service, getInActiveCostHead has been hit');
    this.projectRepository.findById(projectId, (error, result) => {
      if (error) {
        callback(error, null);
      } else {
        logger.info('Project service, findById has been hit');
        logger.debug('getting InActive CostHead for Project Name : ' + result.name);
        let response = result.projectCostHeads;
        let inActiveCostHead = [];
        for (let costHeadItem of response) {
          if (!costHeadItem.active) {
            inActiveCostHead.push(costHeadItem);
          }
        }
        callback(null, {data: inActiveCostHead, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  setProjectCostHeadStatus(projectId: string, costHeadId: number, costHeadActiveStatus: string, user: User,
                           callback: (error: any, result: any) => void) {
    let query = {'_id': projectId, 'projectCostHeads.rateAnalysisId': costHeadId};
    let activeStatus = JSON.parse(costHeadActiveStatus);
    let newData = {$set: {'projectCostHeads.$.active': activeStatus}};
    this.projectRepository.findOneAndUpdate(query, newData, {new: true}, (err, response) => {
      logger.info('Project service, findOneAndUpdate has been hit');
      if (err) {
        callback(err, null);
      } else {
        callback(null, {data: 'success', access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }


  cloneBuildingDetails(projectId: string, buildingId: string, oldBuildingDetails: Building, user: User,
                       callback: (error: Error, result: any) => void) {
    logger.info('Project service, cloneBuildingDetails has been hit');

    let query = {_id: projectId};
    let populate = {path: 'buildings', select: ['name']};
    this.projectRepository.findAndPopulate(query, populate, (error, result) => {
      logger.info('Report Service, findAndPopulate has been hit');
      if (error) {
        callback(error, null);
      } else {
        let buildingName = oldBuildingDetails.name;

        let building: Array<Building> = result[0].buildings.filter(
          function (building: any) {
            return building.name === buildingName;
          });

        if (building.length === 0) {

          this.buildingRepository.findById(buildingId, (error, building) => {
            logger.info('Project service, findById has been hit');
            if (error) {
              callback(error, null);
            } else {
              let costHeads: CostHead[] = building.costHeads;
              let rateAnalysisData;
              if (oldBuildingDetails.cloneItems && oldBuildingDetails.cloneItems.indexOf(Constants.RATE_ANALYSIS_CLONE) === -1) {
                let rateAnalysisService: RateAnalysisService = new RateAnalysisService();
                let costControlRegion = config.get('costControlRegionCode');
                let query = [
                  {
                    $match: {'region': costControlRegion}
                  }, {
                    $project: {'buildingCostHeads.categories.workItems': 1}
                  },
                  {$unwind: '$buildingCostHeads'},
                  {$unwind: '$buildingCostHeads.categories'},
                  {$unwind: '$buildingCostHeads.categories.workItems'},
                  {
                    $project: {_id: 0, workItem: '$buildingCostHeads.categories.workItems'}
                  }
                ];
                rateAnalysisService.getAggregateData(query, (error, workItemAggregateData) => {
                  if (error) {
                    callback(error, null);
                  } else {
                    let regionName = config.get('costControlRegionCode');
                    let aggregateQuery = {'region': regionName};
                    rateAnalysisService.getCostControlRateAnalysis('cloneBuilding', aggregateQuery,
                      {'buildingRates': 1}, (err: any, data: any) => {
                        if (err) {
                          callback(error, null);
                        } else {
                          this.getRatesAndCostHeads(projectId, oldBuildingDetails, building, costHeads, workItemAggregateData, user,
                            data.buildingRates, callback);
                        }
                      });
                  }
                });
              } else {
                this.getRatesAndCostHeads(projectId, oldBuildingDetails, building, costHeads, null, user,
                  null, callback);
              }
            }
          });
        } else {
          let error = new Error();
          error.message = messages.MSG_ERROR_BUILDING_NAME_ALREADY_EXIST;
          callback(error, null);
        }
      }
    });


  }

  getRatesAndCostHeads(projectId: string, oldBuildingDetails: Building, building: Building, costHeads: CostHead[], workItemAggregateData: any,
                       user: User, centralizedRates: any, callback: (error: Error, result: Building) => void) {
    this.getProjectAndBuildingDetails(projectId, (error, projectAndBuildingDetails) => {
      if (error) {
        logger.error('Project service, getRatesAndCostHeads failed');
        callback(error, null);
      } else {
        let projectData = projectAndBuildingDetails.data[0];
        oldBuildingDetails.costHeads = this.calculateBudgetCostForBuilding(building.costHeads, oldBuildingDetails, projectData, true);
        this.cloneCostHeads(costHeads, oldBuildingDetails, workItemAggregateData);
        if (oldBuildingDetails.cloneItems.indexOf(Constants.RATE_ANALYSIS_CLONE) === -1) {
          //oldBuildingDetails.rates=this.getCentralizedRates(rateAnalysisData, oldBuildingDetails.costHeads);
          oldBuildingDetails.rates = centralizedRates;
        } else {
          oldBuildingDetails.rates = building.rates;
        }
        this.createBuilding(projectId, oldBuildingDetails, user, (error, res) => {
          if (error) {
            callback(error, null);
          } else {
            callback(null, res);
          }
        });
      }
    });
  }

  cloneCostHeads(costHeads: any[], oldBuildingDetails: Building, rateAnalysisData: any) {
    let isClone: boolean = (oldBuildingDetails.cloneItems && oldBuildingDetails.cloneItems.indexOf(Constants.COST_HEAD_CLONE) !== -1);
    for (let costHeadIndex in costHeads) {
      if (parseInt(costHeadIndex) < costHeads.length) {
        let costHead = costHeads[costHeadIndex];
        if (!isClone) {
          costHead.active = false;
        }
        costHeads[costHeadIndex] = this.cloneCategory(costHead.categories, oldBuildingDetails.cloneItems, rateAnalysisData);
      }
    }
    return costHeads;
  }

  cloneCategory(categories: Category[], cloneItems: string[], rateAnalysisData: any) {
    for (let categoryIndex in categories) {
      let category = categories[categoryIndex];
      categories[categoryIndex].workItems = this.cloneWorkItems(category.workItems, cloneItems, rateAnalysisData);
    }
    return categories;
  }

  cloneWorkItems(workItems: WorkItem[], cloneItems: string[], rateAnalysisData: any) {
    let isClone: boolean = (cloneItems && cloneItems.indexOf(Constants.WORK_ITEM_CLONE) !== -1);
    for (let workItemIndex in workItems) {
      let workItem = workItems[workItemIndex];
      if (!isClone) {
        workItem.active = false;
      }
      this.cloneRate(workItem, cloneItems, rateAnalysisData);
      this.cloneQuantity(workItem, cloneItems);
    }
    return workItems;
  }

  cloneRate(workItem: WorkItem, cloneItems: string[], rateAnalysisData: any) {
    let isClone: boolean = cloneItems && cloneItems.indexOf(Constants.RATE_ANALYSIS_CLONE) !== -1;
    let rateAnalysisService: RateAnalysisService = new RateAnalysisService();
    let configWorkItems = new Array<WorkItem>();
    if (!isClone) {
      /*workItem = rateAnalysisService.getRateAnalysis(workItem, configWorkItems, rateAnalysisData.rates,
        rateAnalysisData.units, rateAnalysisData.notes);*/
      workItem = this.clonedWorkitemWithRateAnalysis(workItem, rateAnalysisData);
    }
  }

  cloneQuantity(workItem: WorkItem, cloneItems: string[]) {
    let isClone: boolean = (cloneItems && cloneItems.indexOf(Constants.QUANTITY_CLONE) !== -1);
    if (!isClone) {
      workItem.quantity.quantityItemDetails = [];
      workItem.quantity.isDirectQuantity = false;
      workItem.quantity.isEstimated = false;
      workItem.quantity.total = 0;
    }
    return workItem;
  }


  getBuildingById(projectId: string, buildingId: string, user: User, callback: (error: any, result: any) => void) {
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

  getBuildingRateItemsByOriginalName(projectId: string, buildingId: string, originalRateItemName: string, user: User,
                                     callback: (error: any, result: any) => void) {
    let projection = {'rates': 1, _id: 0};
    this.buildingRepository.findByIdWithProjection(buildingId, projection, (error, building) => {
      logger.info('Project Service, getBuildingRateItemsByOriginalName has been hit');
      if (error) {
        callback(error, null);
      } else {
        let buildingRateItemsArray = building.rates;
        let centralizedRateItemsArray = this.getRateItemsArray(buildingRateItemsArray, originalRateItemName);
        callback(null, {data: centralizedRateItemsArray, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  getRateItemsArray(originalRateItemsArray: Array<CentralizedRate>, originalRateItemName: string) {

    let centralizedRateItemsArray: Array<CentralizedRate>;
    centralizedRateItemsArray = alasql('SELECT * FROM ? where TRIM(originalItemName) = ?', [originalRateItemsArray, originalRateItemName]);
    return centralizedRateItemsArray;
  }

  getProjectRateItemsByOriginalName(projectId: string, originalRateItemName: string, user: User,
                                    callback: (error: any, result: any) => void) {
    let projection = {'rates': 1, _id: 0};
    this.projectRepository.findByIdWithProjection(projectId, projection, (error, project) => {
      logger.info('Project Service, getProjectRateItemsByOriginalName has been hit');
      if (error) {
        callback(error, null);
      } else {
        let projectRateItemsArray = project.rates;
        let centralizedRateItemsArray = this.getRateItemsArray(projectRateItemsArray, originalRateItemName);
        callback(null, {data: centralizedRateItemsArray, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  getInActiveCostHead(projectId: string, buildingId: string, user: User, callback: (error: any, result: any) => void) {
    logger.info('Project service, getInActiveCostHead has been hit');
    this.buildingRepository.findById(buildingId, (error, result) => {
      if (error) {
        callback(error, null);
      } else {
        logger.info('Project service, findById has been hit');
        logger.debug('getting InActive CostHead for Building Name : ' + result.name);
        let response = result.costHeads;
        let inActiveCostHead = [];
        for (let costHeadItem of response) {
          if (!costHeadItem.active) {
            inActiveCostHead.push(costHeadItem);
          }
        }
        callback(null, {data: inActiveCostHead, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  getInActiveWorkItemsOfBuildingCostHeads(projectId: string, buildingId: string, costHeadId: number, categoryId: number,
                                          user: User, callback: (error: any, result: any) => void) {
    logger.info('Project service, add Workitem has been hit');
    this.buildingRepository.findById(buildingId, (error, building: Building) => {
      if (error) {
        callback(error, null);
      } else {
        let costHeadList = building.costHeads;
        let inActiveWorkItems: Array<WorkItem> = new Array<WorkItem>();
        let workItems: Array<WorkItem> = new Array<WorkItem>();

        for (let costHeadData of costHeadList) {
          if (costHeadId === costHeadData.rateAnalysisId) {
            for (let categoryData of costHeadData.categories) {
              if (categoryId === categoryData.rateAnalysisId) {
                for (let workItemData of categoryData.workItems) {
                  if (workItemData.workItemId === 1) {
                    inActiveWorkItems.push(workItemData);
                  }
                }
              }
            }
          }
        }

        let abc = this.getWorkItemListWithCentralizedRates(inActiveWorkItems, building.rates, false);
        let abcd = this.getWorkItemListWithCentralizedRates(inActiveWorkItems, building.rates, true);
        workItems = abc.workItems.concat(abcd.workItems);

        callback(null, {
          data: workItems,
          access_token: this.authInterceptor.issueTokenWithUid(user)
        });
      }
    });
  }

  // Get In Active WorkItems Of Project Cost Heads
  getInActiveWorkItemsOfProjectCostHeads(projectId: string, costHeadId: number, categoryId: number,
                                         user: User, callback: (error: any, result: any) => void) {
    logger.info('Project service, Get In-Active WorkItems Of Project Cost Heads has been hit');
    this.projectRepository.findById(projectId, (error, project: Project) => {
      if (error) {
        callback(error, null);
      } else {
        let costHeadList = project.projectCostHeads;
        let inActiveWorkItems: Array<WorkItem> = new Array<WorkItem>();

        for (let costHeadData of costHeadList) {
          if (costHeadId === costHeadData.rateAnalysisId) {
            for (let categoryData of costHeadData.categories) {
              if (categoryId === categoryData.rateAnalysisId) {
                for (let workItemData of categoryData.workItems) {
                  if (workItemData.workItemId === 1) {
                    inActiveWorkItems.push(workItemData);
                  }
                }
              }
            }
          }
        }
        let workitemsList = [];
        let inActiveWorkitems = this.getWorkItemListWithCentralizedRates(inActiveWorkItems, project.rates, false);
        let activeWorkitems = this.getWorkItemListWithCentralizedRates(inActiveWorkItems, project.rates, true);
        workitemsList = inActiveWorkitems.workItems.concat(activeWorkitems.workItems);

        callback(null, {
          data: workitemsList,
          access_token: this.authInterceptor.issueTokenWithUid(user)
        });
      }
    });
  }

  getBuildingByIdForClone(projectId: string, buildingId: string, user: User, callback: (error: any, result: any) => void) {
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

        callback(null, {data: building, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  deleteBuildingById(projectId: string, buildingId: string, user: User, callback: (error: any, result: any) => void) {
    logger.info('Project service, deleteBuilding has been hit');
    let popBuildingId = buildingId;
    this.buildingRepository.delete(buildingId, (error, result) => {
      if (error) {
        callback(error, null);
      } else {
        let query = {_id: projectId};
        let newData = {$pull: {buildings: popBuildingId}};
        this.projectRepository.findOneAndUpdate(query, newData, {new: true}, (error, status) => {
          logger.info('Project service, findOneAndUpdate has been hit');
          if (error) {
            callback(error, null);
          } else {
            callback(null, {data: status});
          }
        });
      }
    });
  }

  getRate(projectId: string, buildingId: string, costHeadId: number, categoryId: number, workItemId: number, user: User,
          callback: (error: any, result: any) => void) {
    logger.info('Project service, getRate has been hit');

    let rateAnalysisServices: RateAnalysisService = new RateAnalysisService();
    rateAnalysisServices.getRate(workItemId, (error, rateData) => {
      if (error) {
        callback(error, null);
      } else {
        let rate: Rate = new Rate();
        rate.rateItems = rateData;
        callback(null, {data: rateData, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  updateRateOfBuildingCostHeads(projectId: string, buildingId: string, costHeadId: number,
                                categoryId: number, workItemId: number, ccWorkItemId: number,
                                rate: Rate, user: User, callback: (error: any, result: any) => void) {
    logger.info('Project service, updateRateOfBuildingCostHeads has been hit');
    rate.isEstimated = true;
    let query = {_id: buildingId};
    let updateQuery = {$set: {'costHeads.$[costHead].categories.$[category].workItems.$[workItem].rate': rate}};

    let arrayFilter = [
      {'costHead.rateAnalysisId': costHeadId},
      {'category.rateAnalysisId': categoryId},
      {
        'workItem.rateAnalysisId': workItemId,
        'workItem.workItemId': ccWorkItemId
      }
    ];
    this.buildingRepository.findOneAndUpdate(query, updateQuery, {
      arrayFilters: arrayFilter,
      new: true
    }, (error, result) => {
      if (error) {
        callback(error, null);
      } else {
        if (result) {
          console.log('building CostHeads Updated');

          let rateItems = rate.rateItems;
          let centralizedRates = result.rates;
          let promiseArrayForUpdateBuildingCentralizedRates = [];

          for (let rate of rateItems) {

            let rateObjectExistSQL = 'SELECT * FROM ? AS rates WHERE rates.itemName= ?';
            let rateExistArray = alasql(rateObjectExistSQL, [centralizedRates, rate.itemName]);
            if (rateExistArray.length > 0) {
              if ((rateExistArray[0].rate !== rate.rate) || (rateExistArray[0].gst !== rate.gst)) {
                //update rate of rateItem
                let updateRatePromise = this.updateCentralizedRateForBuilding(buildingId, rate.itemName, rate.rate, rate.gst);
                promiseArrayForUpdateBuildingCentralizedRates.push(updateRatePromise);
              }
            } else {
              //create new rateItem
              let rateItem: CentralizedRate = new CentralizedRate(rate.itemName, rate.originalItemName, rate.rate, rate.gst);
              let addNewRateItemPromise = this.addNewCentralizedRateForBuilding(buildingId, rateItem);
              promiseArrayForUpdateBuildingCentralizedRates.push(addNewRateItemPromise);
            }
          }

          if (promiseArrayForUpdateBuildingCentralizedRates.length !== 0) {
            CCPromise.all(promiseArrayForUpdateBuildingCentralizedRates).then(function (data: Array<any>) {

              console.log('Rates Array updated : ' + JSON.stringify(centralizedRates));
              callback(null, {'data': 'success'});

            }).catch(function (e: any) {
              logger.error(' Promise failed for convertCostHeadsFromRateAnalysisToCostControl ! :' + JSON.stringify(e.message));
              CCPromise.reject(e.message);
            });
          } else {
            callback(null, {'data': 'success'});
          }
        }
      }
    });
  }

  //Update Direct Rate of building costheads
  updateDirectRateOfBuildingWorkItems(projectId: string, buildingId: string, costHeadId: number, categoryId: number, workItemId: number,
                                      ccWorkItemId: number, directRate: number, user: User, callback: (error: any, result: any) => void) {

    logger.info('Project service, updateDirectRateOfBuildingWorkItems has been hit');
    let query = {_id: buildingId};
    let updateQuery = {
      $set: {
        'costHeads.$[costHead].categories.$[category].workItems.$[workItem].rate.total': directRate,
        'costHeads.$[costHead].categories.$[category].workItems.$[workItem].rate.rateItems': [],
        'costHeads.$[costHead].categories.$[category].workItems.$[workItem].isDirectRate': true
      }
    };

    let arrayFilter = [
      {'costHead.rateAnalysisId': costHeadId},
      {'category.rateAnalysisId': categoryId},
      {'workItem.rateAnalysisId': workItemId, 'workItem.workItemId': ccWorkItemId}
    ];
    this.buildingRepository.findOneAndUpdate(query, updateQuery, {
      arrayFilters: arrayFilter,
      new: true
    }, (error, building) => {
      logger.info('Project service, findOneAndUpdate has been hit');
      if (error) {
        callback(error, null);
      } else {
        callback(null, {data: 'success', access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  updateDirectRate(costHeadList: Array<CostHead>, costHeadId: number, categoryId: number,
                   workItemId: number, directRate: number) {
    let rate: Rate;
    for (let costHead of costHeadList) {
      if (costHeadId === costHead.rateAnalysisId) {
        let categoriesOfCostHead = costHead.categories;
        for (let categoryData of categoriesOfCostHead) {
          if (categoryId === categoryData.rateAnalysisId) {
            for (let workItemData of categoryData.workItems) {
              if (workItemId === workItemData.rateAnalysisId) {
                rate = workItemData.rate;
                rate.total = directRate;
                rate.rateItems = [];
                workItemData.isDirectRate = true;
              }
            }
          }
        }
      }
    }
  }

//Update rate of project cost heads
  updateRateOfProjectCostHeads(projectId: string, costHeadId: number, categoryId: number, workItemId: number,
                               ccWorkItemId: number, rate: Rate, user: User, callback: (error: any, result: any) => void) {
    logger.info('Project service, Update rate of project cost heads has been hit');
    rate.isEstimated = true;
    let query = {_id: projectId};
    let updateQuery = {
      $set: {
        'projectCostHeads.$[costHead].categories.$[category].workItems.$[workItem].rate': rate
      }
    };

    let arrayFilter = [
      {'costHead.rateAnalysisId': costHeadId},
      {'category.rateAnalysisId': categoryId},
      {'workItem.rateAnalysisId': workItemId, 'workItem.workItemId': ccWorkItemId}
    ];
    this.projectRepository.findOneAndUpdate(query, updateQuery, {
      arrayFilters: arrayFilter,
      new: true
    }, (error, result) => {
      if (error) {
        callback(error, null);
      } else {

        let rateItems = rate.rateItems;
        let centralizedRatesOfProjects = result.rates;
        let promiseArrayForProjectCentralizedRates = [];

        for (let rate of rateItems) {

          let rateObjectExistSQL = 'SELECT * FROM ? AS rates WHERE rates.itemName= ?';
          let rateExistArray = alasql(rateObjectExistSQL, [centralizedRatesOfProjects, rate.itemName]);
          if (rateExistArray.length > 0) {
            if ((rateExistArray[0].rate !== rate.rate) || (rateExistArray[0].gst !== rate.gst)) {
              //update rate of rateItem
              let updateRateOfProjectPromise = this.updateCentralizedRateForProject(projectId, rate.itemName, rate.rate, rate.gst);
              promiseArrayForProjectCentralizedRates.push(updateRateOfProjectPromise);
            }
          } else {
            //create new rateItem
            let rateItem: CentralizedRate = new CentralizedRate(rate.itemName, rate.originalItemName, rate.rate, rate.gst);
            let addNewRateOfProjectPromise = this.addNewCentralizedRateForProject(projectId, rateItem);
            promiseArrayForProjectCentralizedRates.push(addNewRateOfProjectPromise);
          }
        }

        if (promiseArrayForProjectCentralizedRates.length !== 0) {

          CCPromise.all(promiseArrayForProjectCentralizedRates).then(function (data: Array<any>) {

            console.log('Rates Array updated : ' + JSON.stringify(centralizedRatesOfProjects));
            callback(null, {'data': 'success'});

          }).catch(function (e: any) {
            logger.error(' Promise failed for convertCostHeadsFromRateAnalysisToCostControl ! :' + JSON.stringify(e.message));
            let errorObj = new Error();
            errorObj.message = e;
            callback(errorObj, null);
          });

        } else {
          callback(null, {'data': 'success'});
        }
      }
    });
  }

  //Update Direct Rates of Project Costheads
  updateDirectRateOfProjectWorkItems(projectId: string, costHeadId: number, categoryId: number, workItemId: number,
                                     ccWorkItemId: number, directRate: number, user: User, callback: (error: any, result: any) => void) {

    logger.info('Project service, updateDirectRateOfProjectWorkItems has been hit');
    let query = {_id: projectId};
    let updateQuery = {
      $set: {
        'projectCostHeads.$[costHead].categories.$[category].workItems.$[workItem].rate.total': directRate,
        'projectCostHeads.$[costHead].categories.$[category].workItems.$[workItem].rate.rateItems': [],
        'projectCostHeads.$[costHead].categories.$[category].workItems.$[workItem].isDirectRate': true
      }
    };

    let arrayFilter = [
      {'costHead.rateAnalysisId': costHeadId},
      {'category.rateAnalysisId': categoryId},
      {'workItem.rateAnalysisId': workItemId, 'workItem.workItemId': ccWorkItemId}
    ];
    this.projectRepository.findOneAndUpdate(query, updateQuery, {
      arrayFilters: arrayFilter,
      new: true
    }, (error, building) => {
      logger.info('Project service, findOneAndUpdate has been hit');
      if (error) {
        callback(error, null);
      } else {
        callback(null, {data: 'success', access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  deleteQuantityOfBuildingCostHeadsByName(projectId: string, buildingId: string, costHeadId: number, categoryId: number,
                                          workItemId: number, ccWorkItemId: number, itemName: string, user: User, callback: (error: any, result: any) => void) {
    logger.info('Project service, deleteQuantity has been hit');
    let query = {_id: buildingId};
    let projection = {
      costHeads: {
        $elemMatch: {
          rateAnalysisId: costHeadId, categories: {
            $elemMatch: {
              rateAnalysisId: categoryId, workItems: {
                $elemMatch: {rateAnalysisId: workItemId, workItemId: ccWorkItemId}
              }
            }
          }
        }
      }
    };
    this.buildingRepository.retrieveWithProjection(query, projection, (error, building: Building) => {
      if (error) {
        callback(error, null);
      } else {
        let quantityItems: Array<QuantityDetails>;
        let updatedWorkItem: WorkItem = new WorkItem();
        for (let costHead of building[0].costHeads) {
          if (costHead.rateAnalysisId === costHeadId) {
            for (let category of costHead.categories) {
              if (category.rateAnalysisId === categoryId) {
                for (let workItem of category.workItems) {
                  if (workItem.rateAnalysisId === workItemId && workItem.workItemId === ccWorkItemId) {
                    quantityItems = workItem.quantity.quantityItemDetails;
                    for (let quantityIndex = 0; quantityIndex < quantityItems.length; quantityIndex++) {
                      if (quantityItems[quantityIndex].name === itemName) {
                        quantityItems.splice(quantityIndex, 1);
                      }
                    }
                    workItem.quantity.total = alasql('VALUE OF SELECT ROUND(SUM(total),2) FROM ?', [quantityItems]);
                    updatedWorkItem = workItem;
                    break;
                  }
                }
                break;
              }
            }
          }
        }

        let query = {_id: buildingId};
        let updateQuery = {$set: {'costHeads.$[costHead].categories.$[category].workItems.$[workItem]': updatedWorkItem}};
        let arrayFilter = [
          {'costHead.rateAnalysisId': costHeadId},
          {'category.rateAnalysisId': categoryId},
          {'workItem.rateAnalysisId': workItemId, 'workItem.workItemId': ccWorkItemId}
        ];
        this.buildingRepository.findOneAndUpdate(query, updateQuery, {
          arrayFilters: arrayFilter,
          new: true
        }, (error, building) => {
          logger.info('Project service, findOneAndUpdate has been hit');
          if (error) {
            callback(error, null);
          } else {
            callback(null, {data: 'success', access_token: this.authInterceptor.issueTokenWithUid(user)});
          }
        });
      }
    });
  }

  //Delete Quantity Of Project Cost Heads By Name
  deleteQuantityOfProjectCostHeadsByName(projectId: string, costHeadId: number, categoryId: number,
                                         workItemId: number, itemName: string, user: User, callback: (error: any, result: any) => void) {
    logger.info('Project service, deleteQuantity has been hit');
    let query = {_id: projectId};
    let projection = {
      projectCostHeads: {
        $elemMatch: {
          rateAnalysisId: costHeadId, categories: {
            $elemMatch: {
              rateAnalysisId: categoryId, workItems: {
                $elemMatch: {rateAnalysisId: workItemId}
              }
            }
          }
        }
      }
    };
    this.projectRepository.retrieveWithProjection(query, projection, (error, project: Project) => {
      if (error) {
        callback(error, null);
      } else {
        let quantityItems: Array<QuantityDetails>;
        let updatedWorkItem: WorkItem = new WorkItem();
        for (let costHead of project[0].projectCostHeads) {
          if (costHead.rateAnalysisId === costHeadId) {
            for (let category of costHead.categories) {
              if (category.rateAnalysisId === categoryId) {
                for (let workItem of category.workItems) {
                  if (workItem.rateAnalysisId === workItemId) {
                    quantityItems = workItem.quantity.quantityItemDetails;
                    for (let quantityIndex = 0; quantityIndex < quantityItems.length; quantityIndex++) {
                      if (quantityItems[quantityIndex].name === itemName) {
                        quantityItems.splice(quantityIndex, 1);
                      }
                    }
                    workItem.quantity.total = alasql('VALUE OF SELECT ROUND(SUM(total),2) FROM ?', [quantityItems]);
                    updatedWorkItem = workItem;
                    break;
                  }
                }
              }
              break;
            }
          }
        }

        let query = {_id: projectId};
        let updateQuery = {$set: {'projectCostHeads.$[costHead].categories.$[category].workItems.$[workItem]': updatedWorkItem}};
        let arrayFilter = [
          {'costHead.rateAnalysisId': costHeadId},
          {'category.rateAnalysisId': categoryId},
          {'workItem.rateAnalysisId': workItemId}
        ]
        this.projectRepository.findOneAndUpdate(query, updateQuery, {
          arrayFilters: arrayFilter,
          new: true
        }, (error, project) => {
          logger.info('Project service, findOneAndUpdate has been hit');
          if (error) {
            callback(error, null);
          } else {
            callback(null, {data: 'success', access_token: this.authInterceptor.issueTokenWithUid(user)});
          }
        });
      }
    });
  }

  deleteWorkitem(projectId: string, buildingId: string, costHeadId: number, categoryId: number, workItemId: number, user: User,
                 callback: (error: any, result: any) => void) {
    logger.info('Project service, delete Workitem has been hit');
    this.buildingRepository.findById(buildingId, (error, building: Building) => {
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

        if (flag === 1) {
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

  setCostHeadStatus(buildingId: string, costHeadId: number, costHeadActiveStatus: string, user: User,
                    callback: (error: any, result: any) => void) {
    let query = {'_id': buildingId, 'costHeads.rateAnalysisId': costHeadId};
    let activeStatus = JSON.parse(costHeadActiveStatus);
    let newData = {$set: {'costHeads.$.active': activeStatus}};
    this.buildingRepository.findOneAndUpdate(query, newData, {new: true}, (err, response) => {
      logger.info('Project service, findOneAndUpdate has been hit');
      if (err) {
        callback(err, null);
      } else {
        callback(null, {data: 'success', access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  updateWorkItemStatusOfBuildingCostHeads(buildingId: string, costHeadId: number, categoryId: number, workItemRAId: number,
                                          workItemId: number, workItemActiveStatus: boolean, workItem: any, user: User,
                                          callback: (error: any, result: any) => void) {
    logger.info('Project service, update Workitem has been hit');
    let query = {_id: buildingId};
    let newWorkItem = workItem;
    if (workItemActiveStatus) {
      // activate workitem
      this.checkDuplicatesOfWorkItem(buildingId, costHeadId, categoryId, workItemRAId, (error, response) => {
        if (error) {
          callback(error, null);
        } else {
          let arrayFilter;
          let updateQuery;
          if (response.active) {
            newWorkItem.workItemId = response.workItemId + 1;
            let quantityObj = new Quantity();
            newWorkItem.quantity = quantityObj;
            newWorkItem.name = newWorkItem.workItemId + '-' + newWorkItem.name;
            newWorkItem.active = true;
            newWorkItem.amount = 0;
            updateQuery = {$push: {'costHeads.$[costHead].categories.$[category].workItems': newWorkItem}};
            arrayFilter = [
              {'costHead.rateAnalysisId': costHeadId},
              {'category.rateAnalysisId': categoryId}
            ];
          } else {
            updateQuery = {$set: {'costHeads.$[costHead].categories.$[category].workItems.$[workItem].active': workItemActiveStatus}};
            if (!response.active && response.workItemId > 1) {
              arrayFilter = [
                {'costHead.rateAnalysisId': costHeadId},
                {'category.rateAnalysisId': categoryId},
                {
                  'workItem.rateAnalysisId': workItemRAId,
                  'workItem.workItemId': response.workItemId
                }
              ];
            } else {
              arrayFilter = [
                {'costHead.rateAnalysisId': costHeadId},
                {'category.rateAnalysisId': categoryId},
                {
                  'workItem.rateAnalysisId': workItemRAId,
                  'workItem.workItemId': workItemId
                }
              ];
            }
          }

          this.buildingRepository.findOneAndUpdate(query, updateQuery, {
            arrayFilters: arrayFilter,
            new: true
          }, (error, response) => {
            logger.info('Project service, findOneAndUpdate has been hit');
            if (error) {
              callback(error, null);
            } else {
              callback(null, {data: 'success', access_token: this.authInterceptor.issueTokenWithUid(user)});
            }
          });
        }
      });

    } else {
      //deactivate workitem
      let updateQuery = {$set: {'costHeads.$[costHead].categories.$[category].workItems.$[workItem].active': workItemActiveStatus}};
      let arrayFilter = [
        {'costHead.rateAnalysisId': costHeadId},
        {'category.rateAnalysisId': categoryId},
        {
          'workItem.rateAnalysisId': workItemRAId,
          'workItem.workItemId': workItemId
        }
      ];

      this.buildingRepository.findOneAndUpdate(query, updateQuery, {
        arrayFilters: arrayFilter,
        new: true
      }, (error, response) => {
        logger.info('Project service, findOneAndUpdate has been hit');
        if (error) {
          callback(error, null);
        } else {
          callback(null, {data: 'success', access_token: this.authInterceptor.issueTokenWithUid(user)});
        }
      });
    }

  }

  checkDuplicatesOfWorkItem(buildingId: string, costHeadId: number, categoryId: number,
                            workItemRAId: number, callback: (error: any, response: any) => void) {

    let query = [
      {$match: {'_id': ObjectId(buildingId), 'costHeads.rateAnalysisId': costHeadId}},
      {$unwind: '$costHeads'},
      {$unwind: '$costHeads.categories'},
      {$unwind: '$costHeads.categories.workItems'},
      {$match: {'costHeads.categories.workItems.rateAnalysisId': workItemRAId}},
      {$project: {'costHeads.categories.workItems': 1}}
    ];

    console.log('costHeadId : ' + costHeadId + ' categoryId : ' + categoryId + ' workItemRAId : ' + workItemRAId);

    this.buildingRepository.aggregate(query, (error, result) => {
      if (error) {
        console.log('error : ' + JSON.stringify(error));
        callback(error, null);
      } else {
        console.log('Data : ' + JSON.stringify(result));
        let isDuplicateSQL = 'SELECT MAX(workItemList.costHeads.categories.workItems.workItemId) AS maxWorkItemId ' +
          'from ? AS workItemList';
        let isDuplicateSQLDetail = alasql(isDuplicateSQL, [result]);

        let getWorkItemSQL = 'SELECT * FROM ? AS AggregationWorkItems WHERE AggregationWorkItems.costHeads.categories.workItems.workItemId = ?';
        let isWorkItemDetail = alasql(getWorkItemSQL, [result, isDuplicateSQLDetail[0].maxWorkItemId]);

        console.log('isWorkItemDetail : ' + JSON.stringify(isWorkItemDetail[0].costHeads.categories.workItems));
        callback(null, isWorkItemDetail[0].costHeads.categories.workItems);
      }
    });
  }

  // Update WorkItem Status Of Project CostHeads
  updateWorkItemStatusOfProjectCostHeads(projectId: string, costHeadId: number, categoryId: number,
                                         workItemId: number, ccWorkItemId: number, workItemActiveStatus: boolean,
                                         workItem: WorkItem, user: User, callback: (error: any, result: any) => void) {
    logger.info('Project service, Update WorkItem Status Of Project Cost Heads has been hit');
    let query = {_id: projectId};
    let newWorkItem = workItem;
    let updateQuery: any;
    let arrayFilter;
    if (workItemActiveStatus) {
      this.checkDuplicatesOfProjectWorkItem(projectId, costHeadId, categoryId, workItemId, ccWorkItemId, (error, response) => {
        if (error) {
          console.log('error : ' + JSON.stringify(error));
          callback(error, null);
        } else {
          if (response.active) {
            newWorkItem.workItemId = response.workItemId + 1;
            let quantityObj = new Quantity();
            newWorkItem.quantity = quantityObj;
            newWorkItem.amount = 0;
            newWorkItem.name = newWorkItem.workItemId + '-' + newWorkItem.name;
            newWorkItem.active = true;
            updateQuery = {$push: {'projectCostHeads.$[costHead].categories.$[category].workItems': newWorkItem}};
            arrayFilter = [
              {'costHead.rateAnalysisId': costHeadId},
              {'category.rateAnalysisId': categoryId}
            ];
          } else {
            updateQuery = {$set: {'projectCostHeads.$[costHead].categories.$[category].workItems.$[workItem].active': workItemActiveStatus}};
            if (!response.active && response.workItemId > 1) {
              arrayFilter = [
                {'costHead.rateAnalysisId': costHeadId},
                {'category.rateAnalysisId': categoryId},
                {
                  'workItem.rateAnalysisId': workItemId,
                  'workItem.workItemId': response.workItemId
                }
              ];
            } else {
              arrayFilter = [
                {'costHead.rateAnalysisId': costHeadId},
                {'category.rateAnalysisId': categoryId},
                {'workItem.rateAnalysisId': workItemId, 'workItem.workItemId': ccWorkItemId}
              ];
            }
          }

          this.projectRepository.findOneAndUpdate(query, updateQuery, {
            arrayFilters: arrayFilter,
            new: true
          }, (error, response) => {
            logger.info('Project service, Update WorkItem Status Of Project Cost Heads ,findOneAndUpdate has been hit');
            if (error) {
              callback(error, null);
            } else {
              callback(null, {data: 'success', access_token: this.authInterceptor.issueTokenWithUid(user)});
            }
          });
        }
      });
    } else {
      updateQuery = {$set: {'projectCostHeads.$[costHead].categories.$[category].workItems.$[workItem].active': workItemActiveStatus}};
      arrayFilter = [
        {'costHead.rateAnalysisId': costHeadId},
        {'category.rateAnalysisId': categoryId},
        {'workItem.rateAnalysisId': workItemId, 'workItem.workItemId': ccWorkItemId}
      ];
      this.projectRepository.findOneAndUpdate(query, updateQuery, {
        arrayFilters: arrayFilter,
        new: true
      }, (error, response) => {
        logger.info('Project service, Update WorkItem Status Of Project Cost Heads ,findOneAndUpdate has been hit');
        if (error) {
          callback(error, null);
        } else {
          callback(null, {data: 'success', access_token: this.authInterceptor.issueTokenWithUid(user)});
        }
      });
    }
  }

  checkDuplicatesOfProjectWorkItem(projectId: string, costHeadId: number, categoryId: number,
                                   workItemRAId: number, ccWorkItemId: number, callback: (error: any, response: any) => void) {

    let query = [
      {$match: {'_id': ObjectId(projectId), 'projectCostHeads.rateAnalysisId': costHeadId}},
      {$unwind: '$projectCostHeads'},
      {$unwind: '$projectCostHeads.categories'},
      {$unwind: '$projectCostHeads.categories.workItems'},
      {$match: {'projectCostHeads.categories.workItems.rateAnalysisId': workItemRAId}},
      {$project: {'projectCostHeads.categories.workItems': 1}}
    ];

    console.log('costHeadId : ' + costHeadId + ' categoryId : ' + categoryId + ' workItemRAId : ' + workItemRAId);

    this.projectRepository.aggregate(query, (error, result) => {
      if (error) {
        console.log('error : ' + JSON.stringify(error));
        callback(error, null);
      } else {
        console.log('Data : ' + JSON.stringify(result));
        let isDuplicateSQL = 'SELECT MAX(workItemList.projectCostHeads.categories.workItems.workItemId) AS maxWorkItemId ' +
          'from ? AS workItemList';
        let isDuplicateSQLDetail = alasql(isDuplicateSQL, [result]);

        let getWorkItemSQL = 'SELECT * FROM ? AS AggregationWorkItems WHERE AggregationWorkItems.projectCostHeads.categories.workItems.workItemId = ?';
        let isWorkItemDetail = alasql(getWorkItemSQL, [result, isDuplicateSQLDetail[0].maxWorkItemId]);

        console.log('isWorkItemDetail : ' + JSON.stringify(isWorkItemDetail[0].projectCostHeads.categories.workItems));
        callback(null, isWorkItemDetail[0].projectCostHeads.categories.workItems);
      }
    });
  }

  updateWorkItemNameOfBuildingCostHeads(buildingId: string, costHeadId: number, categoryId: number,
                                        workItemId: number, ccWorkItemId: number, body: any, user: User,
                                        callback: (error: any, result: any) => void) {
    logger.info('Project service, update Workitem has been hit');

    let query = {_id: buildingId};
    let updateQuery = {$set: {'costHeads.$[costHead].categories.$[category].workItems.$[workItem].name': body.workItemName}};
    let arrayFilter = [
      {'costHead.rateAnalysisId': costHeadId},
      {'category.rateAnalysisId': categoryId},
      {'workItem.rateAnalysisId': workItemId, 'workItem.workItemId': ccWorkItemId}
    ];
    let checkDuplicateName = this.checkIfBuildingWorkItemNameAlreadyExists(buildingId, costHeadId, workItemId,
      body.workItemName, (error, result) => {
        if (error) {
          callback(error, null);
        } else {
          if (result.length === 0) {
            this.buildingRepository.findOneAndUpdate(query, updateQuery, {
              arrayFilters: arrayFilter,
              new: true
            }, (error, response) => {
              logger.info('Project service, findOneAndUpdate has been hit');
              if (error) {
                callback(error, null);
              } else {
                callback(null, {data: 'success', access_token: this.authInterceptor.issueTokenWithUid(user)});
              }
            });
          } else {
            let msg = Constants.MSG_ERROR_DUPLICATE_ITEM + body.workItemName;
            callback(new CostControllException(msg, null), null);
          }
        }
      });
  }

  checkIfBuildingWorkItemNameAlreadyExists(buildingId: string, costHeadId: number, workItemRAId: number,
                                           workItemName: string, callback: (error: any, result: any) => void) {
    let query = [
      {$match: {'_id': ObjectId(buildingId), 'costHeads.rateAnalysisId': costHeadId}},
      {$unwind: '$costHeads'},
      {$unwind: '$costHeads.categories'},
      {$unwind: '$costHeads.categories.workItems'},
      {
        $match: {
          'costHeads.categories.workItems.rateAnalysisId': workItemRAId,
          'costHeads.categories.workItems.name': workItemName
        }
      },
      {$project: {'costHeads.categories.workItems': 1}}
    ];

    this.buildingRepository.aggregate(query, (error, result) => {
      if (error) {
        console.log('error : ' + JSON.stringify(error));
        callback(error, null);
      } else {
        console.log('Data : ' + JSON.stringify(result));
        callback(null, result);
      }
    });
  }

  updateBudgetedCostForCostHead(buildingId: string, costHeadBudgetedAmount: any, user: User,
                                callback: (error: any, result: any) => void) {
    logger.info('Project service, updateBudgetedCostForCostHead has been hit');
    let query = {'_id': buildingId, 'costHeads.name': costHeadBudgetedAmount.costHead};

    let newData = {
      $set: {
        'costHeads.$.budgetedCostAmount': costHeadBudgetedAmount.budgetedCostAmount,
      }
    };

    this.buildingRepository.findOneAndUpdate(query, newData, {new: true}, (err, response) => {
      logger.info('Project service, findOneAndUpdate has been hit');
      if (err) {
        callback(err, null);
      } else {
        callback(null, {data: response, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  updateBudgetedCostForProjectCostHead(projectId: string, costHeadBudgetedAmount: any, user: User,
                                       callback: (error: any, result: any) => void) {
    logger.info('Project service, updateBudgetedCostForCostHead has been hit');
    let query = {'_id': projectId, 'projectCostHeads.name': costHeadBudgetedAmount.costHead};

    let newData = {
      $set: {
        'projectCostHeads.$.budgetedCostAmount': costHeadBudgetedAmount.budgetedCostAmount,
      }
    };

    this.projectRepository.findOneAndUpdate(query, newData, {new: true}, (err, response) => {
      logger.info('Project service, findOneAndUpdate has been hit');
      if (err) {
        callback(err, null);
      } else {
        callback(null, {data: response, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }


  updateQuantityOfBuildingCostHeads(projectId: string, buildingId: string, costHeadId: number, categoryId: number,
                                    workItemId: number, ccWorkItemId: number, quantityDetail: QuantityDetails,
                                    user: User, callback: (error: any, result: any) => void) {
    logger.info('Project service, updateQuantityOfBuildingCostHeads has been hit');

    let query = [
      {$match: {'_id': ObjectId(buildingId), 'costHeads.rateAnalysisId': costHeadId}},
      {$unwind: '$costHeads'},
      {$project: {'costHeads': 1}},
      {$unwind: '$costHeads.categories'},
      {$match: {'costHeads.categories.rateAnalysisId': categoryId}},
      {$project: {'costHeads.categories.workItems': 1}},
      {$unwind: '$costHeads.categories.workItems'},
      {
        $match: {
          'costHeads.categories.workItems.rateAnalysisId': workItemId,
          'costHeads.categories.workItems.workItemId': ccWorkItemId
        }
      },
      {$project: {'costHeads.categories.workItems.quantity': 1}},
    ];

    this.buildingRepository.aggregate(query, (error, result) => {
      if (error) {
        callback(error, null);
      } else {
        if (result.length > 0) {
          let quantity = result[0].costHeads.categories.workItems.quantity;
          quantity.isEstimated = true;
          if (quantity.isDirectQuantity === true) {
            quantity.isDirectQuantity = false;
          }
          this.updateQuantityItemsOfWorkItem(quantity, quantityDetail);

          let query = {_id: buildingId};
          let updateQuery = {$set: {'costHeads.$[costHead].categories.$[category].workItems.$[workItem].quantity': quantity}};
          let arrayFilter = [
            {'costHead.rateAnalysisId': costHeadId},
            {'category.rateAnalysisId': categoryId},
            {'workItem.rateAnalysisId': workItemId, 'workItem.workItemId': ccWorkItemId}
          ];
          this.buildingRepository.findOneAndUpdate(query, updateQuery, {
            arrayFilters: arrayFilter,
            new: true
          }, (error, building) => {
            logger.info('Project service, findOneAndUpdate has been hit');
            if (error) {
              callback(error, null);
            } else {
              callback(null, {data: 'success', access_token: this.authInterceptor.issueTokenWithUid(user)});
            }
          });
        } else {
          let error = new Error();
          error.message = messages.MSG_ERROR_EMPTY_RESPONSE;
          callback(error, null);
        }
      }
    });
  }

  updateDirectQuantityOfBuildingWorkItems(projectId: string, buildingId: string, costHeadId: number, categoryId: number, workItemId: number,
                                          ccWorkItemId: number, directQuantity: number, user: User, callback: (error: any, result: any) => void) {
    logger.info('Project service, updateDirectQuantityOfBuildingCostHeads has been hit');
    let projection = {costHeads: 1};
    let query = {_id: buildingId};
    let updateQuery = {
      $set: {
        'costHeads.$[costHead].categories.$[category].workItems.$[workItem].quantity.isEstimated': true,
        'costHeads.$[costHead].categories.$[category].workItems.$[workItem].quantity.isDirectQuantity': true,
        'costHeads.$[costHead].categories.$[category].workItems.$[workItem].quantity.total': directQuantity,
        'costHeads.$[costHead].categories.$[category].workItems.$[workItem].quantity.quantityItemDetails': [],
      }
    };

    let arrayFilter = [
      {'costHead.rateAnalysisId': costHeadId},
      {'category.rateAnalysisId': categoryId},
      {'workItem.rateAnalysisId': workItemId, 'workItem.workItemId': ccWorkItemId}
    ];
    this.buildingRepository.findOneAndUpdate(query, updateQuery, {
      arrayFilters: arrayFilter,
      new: true
    }, (error, building) => {
      logger.info('Project service, findOneAndUpdate has been hit');
      if (error) {
        callback(error, null);
      } else {
        callback(null, {data: 'success', access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  updateDirectQuantityOfProjectWorkItems(projectId: string, costHeadId: number, categoryId: number, workItemId: number,
                                         ccWorkItemId: number, directQuantity: number, user: User, callback: (error: any, result: any) => void) {
    logger.info('Project service, updateDirectQuantityOfProjectWorkItems has been hit');
    let query = {_id: projectId};
    let updateQuery = {
      $set: {
        'projectCostHeads.$[costHead].categories.$[category].workItems.$[workItem].quantity.isEstimated': true,
        'projectCostHeads.$[costHead].categories.$[category].workItems.$[workItem].quantity.isDirectQuantity': true,
        'projectCostHeads.$[costHead].categories.$[category].workItems.$[workItem].quantity.total': directQuantity,
        'projectCostHeads.$[costHead].categories.$[category].workItems.$[workItem].quantity.quantityItemDetails': []
      }
    };

    let arrayFilter = [
      {'costHead.rateAnalysisId': costHeadId},
      {'category.rateAnalysisId': categoryId},
      {'workItem.rateAnalysisId': workItemId, 'workItem.workItemId': ccWorkItemId}
    ];
    this.projectRepository.findOneAndUpdate(query, updateQuery, {
      arrayFilters: arrayFilter,
      new: true
    }, (error, building) => {
      logger.info('Project service, findOneAndUpdate has been hit');
      if (error) {
        callback(error, null);
      } else {
        callback(null, {data: 'success', access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  updateQuantityDetailsOfProject(projectId: string, costHeadId: number, categoryId: number,
                                 workItemId: number, ccWorkItemId: number, quantityDetailsObj: QuantityDetails,
                                 user: User, callback: (error: any, result: any) => void) {
    let query = [
      {$match: {'_id': ObjectId(projectId), 'projectCostHeads.rateAnalysisId': costHeadId}},
      {$unwind: '$projectCostHeads'},
      {$project: {'projectCostHeads': 1}},
      {$unwind: '$projectCostHeads.categories'},
      {$match: {'projectCostHeads.categories.rateAnalysisId': categoryId}},
      {$project: {'projectCostHeads.categories.workItems': 1}},
      {$unwind: '$projectCostHeads.categories.workItems'},
      {
        $match: {
          'projectCostHeads.categories.workItems.rateAnalysisId': workItemId,
          'projectCostHeads.categories.workItems.workItemId': ccWorkItemId
        }
      },
      {$project: {'projectCostHeads.categories.workItems.quantity': 1}},
    ];

    this.projectRepository.aggregate(query, (error, result) => {
      if (error) {
        callback(error, null);
      } else {
        if (result.length > 0) {
          let quantity = result[0].projectCostHeads.categories.workItems.quantity;
          this.updateQuantityDetails(quantity, quantityDetailsObj);

          let query = {_id: projectId};
          let updateQuery = {$set: {'projectCostHeads.$[costHead].categories.$[category].workItems.$[workItem].quantity': quantity}};
          let arrayFilter = [
            {'costHead.rateAnalysisId': costHeadId},
            {'category.rateAnalysisId': categoryId},
            {'workItem.rateAnalysisId': workItemId, 'workItem.workItemId': ccWorkItemId}
          ];
          this.projectRepository.findOneAndUpdate(query, updateQuery, {
            arrayFilters: arrayFilter,
            new: true
          }, (error, building) => {
            logger.info('Project service, findOneAndUpdate has been hit');
            if (error) {
              callback(error, null);
            } else {
              callback(null, {
                data: quantityDetailsObj,
                status: 'success',
                access_token: this.authInterceptor.issueTokenWithUid(user)
              });
            }
          });
        } else {
          let error = new Error();
          error.message = messages.MSG_ERROR_EMPTY_RESPONSE;
          callback(error, null);
        }
      }
    });
  }

  updateWorkitemNameOfProjectCostHeads(projectId: string, costHeadId: number, categoryId: number,
                                       workItemId: number, ccWorkItemId: number, workItemName: string,
                                       user: User, callback: (error: any, result: any) => void) {
    let query = {_id: projectId};

    this.checkIfProjectWorkItemNameAlreadyExists(projectId, costHeadId, workItemId,
      workItemName, (error, result) => {
        if (error) {
          callback(error, null);
        } else {
          if (result.length === 0) {
            let updateQuery = {$set: {'projectCostHeads.$[costHead].categories.$[category].workItems.$[workItem].name': workItemName}};
            let arrayFilter = [
              {'costHead.rateAnalysisId': costHeadId},
              {'category.rateAnalysisId': categoryId},
              {'workItem.rateAnalysisId': workItemId, 'workItem.workItemId': ccWorkItemId}
            ];
            this.projectRepository.findOneAndUpdate(query, updateQuery, {
              arrayFilters: arrayFilter,
              new: true
            }, (error, building) => {
              logger.info('Project service, findOneAndUpdate has been hit');
              if (error) {
                callback(error, null);
              } else {
                callback(null, {data: 'success', access_token: this.authInterceptor.issueTokenWithUid(user)});
              }
            });
          } else {
            let msg = Constants.MSG_ERROR_DUPLICATE_ITEM + workItemName;
            callback(new CostControllException(msg, null), null);
          }
        }
      });
  }

  checkIfProjectWorkItemNameAlreadyExists(projectId: string, costHeadId: number, workItemRAId: number,
                                          workItemName: string, callback: (error: any, result: any) => void) {
    let query = [
      {$match: {'_id': ObjectId(projectId), 'projectCostHeads.rateAnalysisId': costHeadId}},
      {$unwind: '$projectCostHeads'},
      {$unwind: '$projectCostHeads.categories'},
      {$unwind: '$projectCostHeads.categories.workItems'},
      {
        $match: {
          'projectCostHeads.categories.workItems.rateAnalysisId': workItemRAId,
          'projectCostHeads.categories.workItems.name': workItemName
        }
      },
      {$project: {'projectCostHeads.categories.workItems': 1}}
    ];

    this.projectRepository.aggregate(query, (error, result) => {
      if (error) {
        console.log('error : ' + JSON.stringify(error));
        callback(error, null);
      } else {
        console.log('Data : ' + JSON.stringify(result));
        callback(null, result);
      }
    });
  }

  updateQuantityDetailsOfBuilding(projectId: string, buildingId: string, costHeadId: number, categoryId: number,
                                  workItemId: number, ccWorkItemId: number, quantityDetailsObj: QuantityDetails,
                                  user: User, callback: (error: any, result: any) => void) {
    let query = [
      {$match: {'_id': ObjectId(buildingId), 'costHeads.rateAnalysisId': costHeadId}},
      {$unwind: '$costHeads'},
      {$project: {'costHeads': 1}},
      {$unwind: '$costHeads.categories'},
      {$match: {'costHeads.categories.rateAnalysisId': categoryId}},
      {$project: {'costHeads.categories.workItems': 1}},
      {$unwind: '$costHeads.categories.workItems'},
      {
        $match: {
          'costHeads.categories.workItems.rateAnalysisId': workItemId,
          'costHeads.categories.workItems.workItemId': ccWorkItemId
        }
      },
      {$project: {'costHeads.categories.workItems.quantity': 1}},
    ];

    this.buildingRepository.aggregate(query, (error, result) => {
      if (error) {
        callback(error, null);
      } else {
        if (result.length > 0) {
          let quantity = result[0].costHeads.categories.workItems.quantity;
          this.updateQuantityDetails(quantity, quantityDetailsObj);

          let query = {_id: buildingId};
          let updateQuery = {$set: {'costHeads.$[costHead].categories.$[category].workItems.$[workItem].quantity': quantity}};
          let arrayFilter = [
            {'costHead.rateAnalysisId': costHeadId},
            {'category.rateAnalysisId': categoryId},
            {
              'workItem.rateAnalysisId': workItemId,
              'workItem.workItemId': ccWorkItemId,
            }
          ];
          this.buildingRepository.findOneAndUpdate(query, updateQuery, {
            arrayFilters: arrayFilter,
            new: true
          }, (error, building) => {
            logger.info('Project service, findOneAndUpdate has been hit');
            if (error) {
              callback(error, null);
            } else {
              callback(null, {
                data: quantityDetailsObj,
                status: 'success',
                access_token: this.authInterceptor.issueTokenWithUid(user)
              });
            }
          });
        } else {
          let error = new Error();
          error.message = messages.MSG_ERROR_EMPTY_RESPONSE;
          callback(error, null);
        }
      }
    });
  }

  updateQuantityDetails(quantity: Quantity, quantityDetailsObj: QuantityDetails) {
    quantity.isEstimated = true;
    quantity.isDirectQuantity = false;
    let quantityDetails = quantity.quantityItemDetails;
    let current_date = new Date();
    let newQuantityId = current_date.getUTCMilliseconds();

    if (quantityDetails.length === 0) {
      quantityDetailsObj.id = newQuantityId;
      quantityDetailsObj.isDirectQuantity = false;
      quantityDetails.push(quantityDetailsObj);
      quantity.total = alasql('VALUE OF SELECT SUM(total) FROM ?', [quantityDetails]);
    } else {
      let isDefaultExistsSQL = 'SELECT name from ? AS quantityDetails where quantityDetails.name="default"';
      let isDefaultExistsQuantityDetail = alasql(isDefaultExistsSQL, [quantityDetails]);

      if (isDefaultExistsQuantityDetail.length > 0) {
        quantity.quantityItemDetails = [];
        quantityDetailsObj.id = newQuantityId;
        quantityDetailsObj.isDirectQuantity = false;
        quantity.quantityItemDetails.push(quantityDetailsObj);
        quantity.total = alasql('VALUE OF SELECT SUM(total) FROM ?', [quantity.quantityItemDetails]);
      } else {
        if (quantityDetailsObj.name !== 'default') {
          let isItemAlreadyExistSQL = 'SELECT id from ? AS quantityDetails where quantityDetails.id=' + quantityDetailsObj.id + '';
          let isItemAlreadyExists = alasql(isItemAlreadyExistSQL, [quantityDetails]);

          if (isItemAlreadyExists.length > 0) {
            for (let quantityIndex = 0; quantityIndex < quantityDetails.length; quantityIndex++) {
              if (quantityDetails[quantityIndex].id === quantityDetailsObj.id) {
                quantityDetails[quantityIndex].name = quantityDetailsObj.name;
                if (quantityDetailsObj.quantityItems.length === 0 && quantityDetailsObj.steelQuantityItems.steelQuantityItem.length === 0) {
                  quantityDetails[quantityIndex].quantityItems = [];
                  quantityDetails[quantityIndex].steelQuantityItems = new SteelQuantityItems();
                  quantityDetails[quantityIndex].isDirectQuantity = true;
                } else if (quantityDetailsObj.quantityItems.length !== 0 || quantityDetailsObj.steelQuantityItems.steelQuantityItem.length !== 0) {
                  quantityDetails[quantityIndex].quantityItems = quantityDetailsObj.quantityItems;
                  quantityDetails[quantityIndex].steelQuantityItems = quantityDetailsObj.steelQuantityItems;
                  quantityDetails[quantityIndex].isDirectQuantity = false;
                }
                quantityDetails[quantityIndex].total = quantityDetailsObj.total;
              }
            }
            quantity.total = alasql('VALUE OF SELECT SUM(total) FROM ?', [quantityDetails]);
          } else {
            quantityDetailsObj.id = newQuantityId;
            quantityDetailsObj.isDirectQuantity = false;
            quantity.quantityItemDetails.push(quantityDetailsObj);
            quantity.total = alasql('VALUE OF SELECT SUM(total) FROM ?', [quantity.quantityItemDetails]);
          }
        }
      }
    }
  }

  updateQuantityItemsOfWorkItem(quantity: Quantity, quantityDetail: QuantityDetails) {

    quantity.isEstimated = true;
    let current_date = new Date();
    let quantityId = current_date.getUTCMilliseconds();

    if (quantity.quantityItemDetails.length === 0) {
      if (quantityDetail.id === undefined) {
        quantityDetail.id = quantityId;
        //quantityDetail.total = alasql('VALUE OF SELECT ROUND(SUM(quantity),2) FROM ?', [quantityDetail.quantityItems]);
        quantity.quantityItemDetails.push(quantityDetail);
      } else {
        //quantityDetail.total = alasql('VALUE OF SELECT ROUND(SUM(quantity),2) FROM ?', [quantityDetail.quantityItems]);
        quantity.quantityItemDetails.push(quantityDetail);
      }
    } else {

      let isDefaultExistsSQL = 'SELECT name from ? AS quantityDetails where quantityDetails.name="default"';
      let isDefaultExistsQuantityDetail = alasql(isDefaultExistsSQL, [quantity.quantityItemDetails]);

      if (isDefaultExistsQuantityDetail.length > 0) {
        quantityDetail.id = quantityId;
        quantity.isDirectQuantity = false;
        quantity.quantityItemDetails = [];
        //  quantityDetail.total = alasql('VALUE OF SELECT ROUND(SUM(quantity),2) FROM ?', [quantityDetail.quantityItems]);
        quantity.quantityItemDetails.push(quantityDetail);

      } else {
        if (quantityDetail.name !== 'default') {
          let isItemAlreadyExistSQL = 'SELECT id from ? AS quantityDetails where quantityDetails.id=' + quantityDetail.id + '';
          let isItemAlreadyExists = alasql(isItemAlreadyExistSQL, [quantity.quantityItemDetails]);

          if (isItemAlreadyExists.length > 0) {
            for (let quantityIndex = 0; quantityIndex < quantity.quantityItemDetails.length; quantityIndex++) {
              if (quantity.quantityItemDetails[quantityIndex].id === quantityDetail.id) {
                quantity.quantityItemDetails[quantityIndex].isDirectQuantity = false;
                if (quantityDetail.steelQuantityItems) {
                  quantity.quantityItemDetails[quantityIndex].steelQuantityItems = quantityDetail.steelQuantityItems;
                  quantity.quantityItemDetails[quantityIndex].total = quantityDetail.total;
                } else {
                  quantity.quantityItemDetails[quantityIndex].quantityItems = quantityDetail.quantityItems;
                  quantity.quantityItemDetails[quantityIndex].total = quantityDetail.total;
                }
              }
            }
          } else {
            quantityDetail.id = quantityId;
            quantityDetail.isDirectQuantity = false;
            // quantityDetail.total = alasql('VALUE OF SELECT ROUND(SUM(quantity),2) FROM ?', [quantityDetail.quantityItems]);
            quantity.quantityItemDetails.push(quantityDetail);
          }
        } else {
          quantity.quantityItemDetails = [];
          //   console.log('quantity : '+JSON.stringify(quantity));
          quantityDetail.id = quantityId;
          quantityDetail.isDirectQuantity = false;
          // quantityDetail.total = alasql('VALUE OF SELECT ROUND(SUM(quantity),2) FROM ?', [quantityDetail.quantityItems]);
          //  console.log(quantity.quantityItemDetails);
          quantity.quantityItemDetails.push(quantityDetail);
        }
      }
    }
    quantity.total = alasql('VALUE OF SELECT ROUND(SUM(total),2) FROM ?', [quantity.quantityItemDetails]);
  }

//Update Quantity Of Project Cost Heads
  updateQuantityOfProjectCostHeads(projectId: string, costHeadId: number, categoryId: number, workItemId: number, ccWorkItemId: number,
                                   quantityDetails: QuantityDetails, user: User, callback: (error: any, result: any) => void) {
    logger.info('Project service, Update Quantity Of Project Cost Heads has been hit');
    let query = {_id: projectId};
    let projection = {
      projectCostHeads: {
        $elemMatch: {
          rateAnalysisId: costHeadId, categories: {
            $elemMatch: {
              rateAnalysisId: categoryId, workItems: {
                $elemMatch: {rateAnalysisId: workItemId, workItemId: ccWorkItemId}
              }
            }
          }
        }
      }
    };
    this.projectRepository.retrieveWithProjection(query, projection, (error, project) => {
      if (error) {
        callback(error, null);
      } else {
        let costHeadList = project[0].projectCostHeads;
        let quantity: Quantity;
        for (let costHead of costHeadList) {
          if (costHeadId === costHead.rateAnalysisId) {
            let categoriesOfCostHead = costHead.categories;
            for (let categoryData of categoriesOfCostHead) {
              if (categoryId === categoryData.rateAnalysisId) {
                let workItemsOfCategory = categoryData.workItems;
                for (let workItemData of workItemsOfCategory) {
                  if (workItemId === workItemData.rateAnalysisId && ccWorkItemId === workItemData.workItemId) {
                    quantity = workItemData.quantity;
                    quantity.isEstimated = true;
                    this.updateQuantityItemsOfWorkItem(quantity, quantityDetails);
                    break;
                  }
                }
                break;
              }
            }
          }
        }

        let query = {_id: projectId};
        let updateQuery = {$set: {'projectCostHeads.$[costHead].categories.$[category].workItems.$[workItem].quantity': quantity}};
        let arrayFilter = [
          {'costHead.rateAnalysisId': costHeadId},
          {'category.rateAnalysisId': categoryId},
          {'workItem.rateAnalysisId': workItemId, 'workItem.workItemId': ccWorkItemId}
        ];
        this.projectRepository.findOneAndUpdate(query, updateQuery, {
          arrayFilters: arrayFilter,
          new: true
        }, (error, project) => {
          logger.info('Project service, findOneAndUpdate has been hit');
          if (error) {
            callback(error, null);
          } else {
            callback(null, {data: 'success', access_token: this.authInterceptor.issueTokenWithUid(user)});
          }
        });
      }
    });
  }

  //Get In-Active Categories From Database
  getInActiveCategoriesByCostHeadId(projectId: string, buildingId: string, costHeadId: string, user: User,
                                    callback: (error: any, result: any) => void) {

    this.buildingRepository.findById(buildingId, (error, building) => {
      logger.info('Project service, Get In-Active Categories By Cost Head Id has been hit');
      if (error) {
        callback(error, null);
      } else {
        let costHeads = building.costHeads;
        let categories: Array<Category> = new Array<Category>();
        for (let costHeadIndex = 0; costHeadIndex < costHeads.length; costHeadIndex++) {
          if (parseInt(costHeadId) === costHeads[costHeadIndex].rateAnalysisId) {
            let categoriesList = costHeads[costHeadIndex].categories;
            for (let categoryIndex = 0; categoryIndex < categoriesList.length; categoryIndex++) {
              if (categoriesList[categoryIndex].active === false) {
                categories.push(categoriesList[categoryIndex]);
              }
            }
          }
        }
        callback(null, {data: categories, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  getWorkItemListOfBuildingCategory(projectId: string, buildingId: string, costHeadId: number, categoryId: number, user: User,
                                    callback: (error: any, result: any) => void) {
    logger.info('Project service, getWorkItemListOfBuildingCategory has been hit');

    let query = [
      {$match: {'_id': ObjectId(buildingId), 'costHeads.rateAnalysisId': costHeadId}},
      {$unwind: '$costHeads'},
      {$project: {'costHeads': 1, 'rates': 1}},
      {$unwind: '$costHeads.categories'},
      {$match: {'costHeads.categories.rateAnalysisId': categoryId}},
      {$project: {'costHeads.categories.workItems': 1, 'rates': 1}}
    ];

    this.buildingRepository.aggregate(query, (error, result) => {
      logger.info('Project service, Get workitems for specific category has been hit');
      if (error) {
        callback(error, null);
      } else {
        if (result.length > 0) {
          let workItemsOfBuildingCategory = result[0].costHeads.categories.workItems;
          let workItemsListWithBuildingRates = this.getWorkItemListWithCentralizedRates(workItemsOfBuildingCategory, result[0].rates, true);
          let workItemsListAndShowHideAddItemButton = {
            workItems: workItemsListWithBuildingRates.workItems,
            showHideAddButton: workItemsListWithBuildingRates.showHideAddItemButton
          };
          callback(null, {
            data: workItemsListAndShowHideAddItemButton,
            access_token: this.authInterceptor.issueTokenWithUid(user)
          });
        } else {
          let error = new Error();
          error.message = messages.MSG_ERROR_EMPTY_RESPONSE;
          callback(error, null);
        }
      }
    });
  }

  getWorkItemListOfProjectCategory(projectId: string, costHeadId: number, categoryId: number, user: User,
                                   callback: (error: any, result: any) => void) {
    logger.info('Project service, getWorkItemListOfProjectCategory has been hit');

    let query = [
      {$match: {'_id': ObjectId(projectId), 'projectCostHeads.rateAnalysisId': costHeadId}},
      {$unwind: '$projectCostHeads'},
      {$project: {'projectCostHeads': 1, 'rates': 1}},
      {$unwind: '$projectCostHeads.categories'},
      {$match: {'projectCostHeads.categories.rateAnalysisId': categoryId}},
      {$project: {'projectCostHeads.categories.workItems': 1, 'rates': 1}}
    ];

    this.projectRepository.aggregate(query, (error, result) => {
      logger.info('Project service, Get workitems By Cost Head & category Id has been hit');
      if (error) {
        callback(error, null);
      } else {
        if (result.length > 0) {
          let workItemsOfCategory = result[0].projectCostHeads.categories.workItems;
          let workItemsListWithRates = this.getWorkItemListWithCentralizedRates(workItemsOfCategory, result[0].rates, true);
          let workItemsListAndShowHideAddItemButton = {
            workItems: workItemsListWithRates.workItems,
            showHideAddButton: workItemsListWithRates.showHideAddItemButton
          };
          callback(null, {
            data: workItemsListAndShowHideAddItemButton,
            access_token: this.authInterceptor.issueTokenWithUid(user)
          });
        } else {
          let error = new Error();
          error.message = messages.MSG_ERROR_EMPTY_RESPONSE;
          callback(error, null);
        }
      }
    });
  }

  getWorkItemListWithCentralizedRates(workItemsOfCategory: Array<WorkItem>, centralizedRates: Array<any>, isWorkItemActive: boolean) {

    let workItemsListWithRates: WorkItemListWithRatesDTO = new WorkItemListWithRatesDTO();
    for (let workItemData of workItemsOfCategory) {
      if (workItemData.active === isWorkItemActive) {
        let workItem: WorkItem = workItemData;
        let rateItemsOfWorkItem = workItemData.rate.rateItems;
        workItem.rate.rateItems = this.getRatesFromCentralizedrates(rateItemsOfWorkItem, centralizedRates);

        let arrayOfRateItems = workItem.rate.rateItems;
        for (let rateItemIndex = 0; rateItemIndex < arrayOfRateItems.length; rateItemIndex++) {
          arrayOfRateItems[rateItemIndex].rateWithGst = (arrayOfRateItems[rateItemIndex].rate * arrayOfRateItems[rateItemIndex].gst) / 100;
          arrayOfRateItems[rateItemIndex].totalRate = arrayOfRateItems[rateItemIndex].rate + arrayOfRateItems[rateItemIndex].rateWithGst;
          arrayOfRateItems[rateItemIndex].totalAmount = (arrayOfRateItems[rateItemIndex].totalRate * arrayOfRateItems[rateItemIndex].quantity);
          arrayOfRateItems[rateItemIndex].gstComponent = arrayOfRateItems[rateItemIndex].totalAmount - (arrayOfRateItems[rateItemIndex].rate * arrayOfRateItems[rateItemIndex].quantity);
        }
        let totalOfAllRateItems = alasql('VALUE OF SELECT SUM(totalAmount) FROM ?', [arrayOfRateItems]);
        let totalByUnit = totalOfAllRateItems / workItem.rate.quantity;
        if (!workItem.isDirectRate) {
          workItem.rate.total = this.totalRateByUnit(workItem, totalByUnit);
        }
        let quantityItems = workItem.quantity.quantityItemDetails;

        if (!workItem.quantity.isDirectQuantity) {
          workItem.quantity.total = alasql('VALUE OF SELECT ROUND(SUM(total),2) FROM ?', [quantityItems]);
        }

        if (workItem.rate.isEstimated || workItem.quantity.isEstimated) {
          if (!workItem.isDirectRate) {
            let quantity = this.changeQuantityByWorkItemUnit(workItem.quantity.total, workItem.unit, workItem.rate.unit);
            let gstComponentTotal = alasql('VALUE OF SELECT ROUND(SUM(gstComponent),2) FROM ?', [workItem.rate.rateItems]);
            workItem.gstComponent = (quantity * gstComponentTotal) / workItem.rate.quantity;
            7
            workItem.totalRate = alasql('VALUE OF SELECT ROUND(SUM(totalRate),2) FROM ?', [workItem.rate.rateItems]);
            workItem.amount = this.commonService.decimalConversion(workItem.rate.total * workItem.quantity.total);
          } else {
            workItem.rateWithGst = (workItem.rate.total * workItem.gst) / 100;
            workItem.totalRate = workItem.rate.total + workItem.rateWithGst;
            workItem.amount = workItem.totalRate * workItem.quantity.total;
            workItem.gstComponent = workItem.amount - (workItem.rate.total * workItem.quantity.total);
            workItem.amount = this.commonService.decimalConversion(workItem.amount);
          }
          workItemsListWithRates.workItemsAmount = workItemsListWithRates.workItemsAmount + workItem.amount;
          workItemsListWithRates.gstComponent = workItemsListWithRates.gstComponent + workItem.gstComponent;
        }
        workItemsListWithRates.workItems.push(workItem);
      } else {
        workItemsListWithRates.showHideAddItemButton = false;
      }
    }
    return workItemsListWithRates;
  }

  totalRateByUnit(workItem: WorkItem, totalByUnit: number) {
    if (workItem.unit === 'Sqm' && workItem.rate.unit !== 'Sqm') {
      workItem.rate.total = totalByUnit * 10.764;
    } else if (workItem.unit === 'Rm' && workItem.rate.unit !== 'Rm') {
      workItem.rate.total = totalByUnit * 3.28;
    } else if (workItem.unit === 'cum' && workItem.rate.unit !== 'cum') {
      workItem.rate.total = totalByUnit * 35.28;
    } else {
      workItem.rate.total = totalByUnit;
    }
    return workItem.rate.total;
  }

  changeQuantityByWorkItemUnit(quantity: number, workItemUnit: string, rateUnit: string) {
    let quantityTotal: number = 0;
    if (workItemUnit === 'Sqm' && rateUnit !== 'Sqm') {
      quantityTotal = quantity * 10.764;
    } else if (workItemUnit === 'Rm' && rateUnit !== 'Rm') {
      quantityTotal = quantity * 3.28;
    } else if (workItemUnit === 'cum' && rateUnit !== 'cum') {
      quantityTotal = quantity * 35.28;
    } else {
      quantityTotal = quantity;
    }
    return quantityTotal;
  }

  getRatesFromCentralizedrates(rateItemsOfWorkItem: Array<RateItem>, centralizedRates: Array<any>) {
    let rateItemsSQL = 'SELECT rateItem.itemName, rateItem.originalItemName, rateItem.rateAnalysisId, rateItem.type,' +
      'rateItem.quantity, centralizedRates.gst, centralizedRates.rate, rateItem.unit, rateItem.totalAmount, rateItem.totalQuantity ' +
      'FROM ? AS rateItem JOIN ? AS centralizedRates ON rateItem.itemName = centralizedRates.itemName';
    let rateItemsForWorkItem = alasql(rateItemsSQL, [rateItemsOfWorkItem, centralizedRates]);
    return rateItemsForWorkItem;
  }

  addWorkitem(projectId: string, buildingId: string, costHeadId: number, categoryId: number, workItem: WorkItem,
              user: User, callback: (error: any, result: any) => void) {
    logger.info('Project service, addWorkitem has been hit');
    this.buildingRepository.findById(buildingId, (error, building: Building) => {
      if (error) {
        callback(error, null);
      } else {
        let responseWorkitem: Array<WorkItem> = null;
        for (let index = 0; building.costHeads.length > index; index++) {
          if (building.costHeads[index].rateAnalysisId === costHeadId) {
            let category = building.costHeads[index].categories;
            for (let categoryIndex = 0; category.length > categoryIndex; categoryIndex++) {
              if (category[categoryIndex].rateAnalysisId === categoryId) {
                category[categoryIndex].workItems.push(workItem);
                responseWorkitem = category[categoryIndex].workItems;
              }
            }
            let query = {_id: buildingId};
            let newData = {$set: {'costHeads': building.costHeads}};
            this.buildingRepository.findOneAndUpdate(query, newData, {new: true}, (error, building) => {
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

  addCategoryByCostHeadId(projectId: string, buildingId: string, costHeadId: string, categoryDetails: any, user: User,
                          callback: (error: any, result: any) => void) {

    let categoryObj: Category = new Category(categoryDetails.category, categoryDetails.categoryId);

    let query = {'_id': buildingId, 'costHeads.rateAnalysisId': parseInt(costHeadId)};
    let newData = {$push: {'costHeads.$.categories': categoryObj}};

    this.buildingRepository.findOneAndUpdate(query, newData, {new: true}, (error, building) => {
      logger.info('Project service, addCategoryByCostHeadId has been hit');
      if (error) {
        callback(error, null);
      } else {
        callback(null, {data: building, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  //Update status ( true/false ) of category
  updateCategoryStatus(projectId: string, buildingId: string, costHeadId: number, categoryId: number,
                       categoryActiveStatus: boolean, user: User, callback: (error: any, result: any) => void) {

    this.buildingRepository.findById(buildingId, (error, building: Building) => {
      logger.info('Project service, update Category Status has been hit');
      if (error) {
        callback(error, null);
      } else {
        let costHeads = building.costHeads;
        let categories: Array<Category> = new Array<Category>();
        let updatedCategories: Array<Category> = new Array<Category>();
        let index: number;

        for (let costHeadIndex = 0; costHeadIndex < costHeads.length; costHeadIndex++) {
          if (costHeadId === costHeads[costHeadIndex].rateAnalysisId) {
            categories = costHeads[costHeadIndex].categories;
            for (let categoryIndex = 0; categoryIndex < categories.length; categoryIndex++) {
              if (categories[categoryIndex].rateAnalysisId === categoryId) {
                categories[categoryIndex].active = categoryActiveStatus;
                updatedCategories.push(categories[categoryIndex]);
              }
            }
          }
        }

        let query = {'_id': buildingId, 'costHeads.rateAnalysisId': costHeadId};
        let newData = {'$set': {'costHeads.$.categories': categories}};

        this.buildingRepository.findOneAndUpdate(query, newData, {new: true}, (error, building) => {
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
  getCategoriesOfBuildingCostHead(projectId: string, buildingId: string, costHeadId: number, user: User,
                                  callback: (error: any, result: any) => void) {
    logger.info('Project service, Get Active Categories has been hit');
    this.buildingRepository.findById(buildingId, (error, building: Building) => {
      if (error) {
        callback(error, null);
      } else {
        let buildingCostHeads = building.costHeads;
        let categoriesListWithCentralizedRates: CategoriesListWithRatesDTO;

        for (let costHeadData of buildingCostHeads) {
          if (costHeadData.rateAnalysisId === costHeadId) {
            categoriesListWithCentralizedRates = this.getCategoriesListWithCentralizedRates(costHeadData.categories, building.rates);
            break;
          }
        }
        callback(null, {
          data: categoriesListWithCentralizedRates,
          access_token: this.authInterceptor.issueTokenWithUid(user)
        });
      }
    });
  }

  //Get categories of projectCostHeads from database
  getCategoriesOfProjectCostHead(projectId: string, costHeadId: number, user: User, callback: (error: any, result: any) => void) {

    logger.info('Project service, Get Project CostHead Categories has been hit');
    this.projectRepository.findById(projectId, (error, project: Project) => {
      if (error) {
        callback(error, null);
      } else {
        let projectCostHeads = project.projectCostHeads;
        let categoriesListWithCentralizedRates: CategoriesListWithRatesDTO;

        for (let costHeadData of projectCostHeads) {
          if (costHeadData.rateAnalysisId === costHeadId) {
            categoriesListWithCentralizedRates = this.getCategoriesListWithCentralizedRates(costHeadData.categories, project.rates);
            break;
          }
        }
        callback(null, {
          data: categoriesListWithCentralizedRates,
          access_token: this.authInterceptor.issueTokenWithUid(user)
        });
      }
    });
  }

  getCostHeadDetailsOfBuilding(projectId: string, buildingId: string, costHeadId: number,
                               user: User, callback: (error: any, result: any) => void) {

    logger.info('Project service, Get Project CostHead Categories has been hit');
    let query = [
      {$match: {'_id': ObjectId(buildingId)}},
      {$project: {'costHeads': 1, 'rates': 1}},
      {$unwind: '$costHeads'},
      {$match: {'costHeads.rateAnalysisId': costHeadId}},
      {$project: {'costHeads': 1, '_id': 0, 'rates': 1}}
    ];
    this.buildingRepository.aggregate(query, (error, result) => {
      logger.info('Project service, Get workitems for specific category has been hit');
      if (error) {
        callback(error, null);
      } else {
        if (result.length > 0) {
          let data = result[0].costHeads;
          let categoriesListWithCentralizedRates = this.getCategoriesListWithCentralizedRates(data.categories, result[0].rates);
          callback(null, {data: data, access_token: this.authInterceptor.issueTokenWithUid(user)});
        } else {
          let error = new Error();
          error.message = messages.MSG_ERROR_EMPTY_RESPONSE;
          callback(error, null);
        }
      }
    });
  }

  //Get category list with centralized rate
  getCategoriesListWithCentralizedRates(categoriesOfCostHead: Array<Category>, centralizedRates: Array<CentralizedRate>) {
    let categoriesTotalAmount = 0;
    let totalgstComponent = 0;

    let categoriesListWithRates: CategoriesListWithRatesDTO = new CategoriesListWithRatesDTO;

    for (let categoryData of categoriesOfCostHead) {
      let workItems = this.getWorkItemListWithCentralizedRates(categoryData.workItems, centralizedRates, true);

      categoryData.amount = workItems.workItemsAmount;
      categoriesTotalAmount = categoriesTotalAmount + workItems.workItemsAmount;
      totalgstComponent = totalgstComponent + workItems.gstComponent;
      //delete categoryData.workItems;
      categoriesListWithRates.categories.push(categoryData);
    }

    if (categoriesTotalAmount !== 0) {
      categoriesListWithRates.categoriesAmount = categoriesTotalAmount;
    }

    if (totalgstComponent !== 0) {
      categoriesListWithRates.totalGstComponent = totalgstComponent;
    }
    return categoriesListWithRates;
  }

  syncProjectWithRateAnalysisData(projectId: string, buildingId: string, user: User, callback: (error: any, result: any) => void) {
    logger.info('Project service, syncProjectWithRateAnalysisData has been hit');
    this.getProjectAndBuildingDetails(projectId, (error, projectAndBuildingDetails) => {
      if (error) {
        logger.error('Project service, getProjectAndBuildingDetails failed');
        callback(error, null);
      } else {
        logger.info('Project service, syncProjectWithRateAnalysisData.');
        let projectData = projectAndBuildingDetails.data[0];
        let buildings = projectAndBuildingDetails.data[0].buildings;
        let buildingData: any;

        for (let building of buildings) {
          if (building._id == buildingId) {
            buildingData = building;
            break;
          }
        }

        if (projectData.projectCostHeads.length > 0) {
          logger.info('Project service, syncWithRateAnalysisData building Only.');
          this.updateCostHeadsForBuildingAndProject(callback, projectData, buildingData, buildingId, projectId);
        } else {
          logger.info('Project service, calling promise for syncProjectWithRateAnalysisData for Project and Building.');
          let syncBuildingCostHeadsPromise = this.updateBudgetRatesForBuildingCostHeads(Constants.BUILDING,
            buildingId, projectData, buildingData);
          let syncProjectCostHeadsPromise = this.updateBudgetRatesForProjectCostHeads(Constants.AMENITIES,
            projectId, projectData, buildingData);

          CCPromise.all([
            syncBuildingCostHeadsPromise,
            syncProjectCostHeadsPromise
          ]).then(function (data: Array<any>) {
            logger.info('Promise for syncProjectWithRateAnalysisData for Project and Building success');
            let buildingCostHeadsData = data[0];
            let projectCostHeadsData = data[1];
            callback(null, {status: 200});
          }).catch(function (e: any) {
            logger.error(' Promise failed for syncProjectWithRateAnalysisData ! :' + JSON.stringify(e.message));
            CCPromise.reject(e.message);
          });
        }
      }
    });
  }

  updateCostHeadsForBuildingAndProject(callback: (error: any, result: any) => void,
                                       projectData: any, buildingData: any, buildingId: string, projectId: string) {

    logger.info('updateCostHeadsForBuildingAndProject has been hit');
    let rateAnalysisService = new RateAnalysisService();
    let buildingRepository = new BuildingRepository();
    let projectRepository = new ProjectRepository();
    let query = {'region': config.get('costControlRegionCode')};
    rateAnalysisService.getCostControlRateAnalysis('addBuilding', query, {}, (error: any, rateAnalysis: RateAnalysis) => {
      if (error) {
        logger.error('Error in updateCostHeadsForBuildingAndProject : convertCostHeadsFromRateAnalysisToCostControl : '
          + JSON.stringify(error));
        callback(error, null);
      } else {
        logger.info('GetAllDataFromRateAnalysis success');
        let buildingCostHeads = rateAnalysis.buildingCostHeads;
        let projectService = new ProjectService();
        buildingCostHeads = projectService.calculateBudgetCostForBuilding(buildingCostHeads, buildingData, projectData);
        let queryForBuilding = {'_id': buildingId};
        let updateCostHead = {$set: {'costHeads': buildingCostHeads, 'rates': rateAnalysis.buildingRates}};

        buildingRepository.findOneAndUpdate(queryForBuilding, updateCostHead, {new: true}, (error: any, response: any) => {
          if (error) {
            logger.error('Error in Update convertCostHeadsFromRateAnalysisToCostControl buildingCostHeadsData  : '
              + JSON.stringify(error));
            callback(error, null);
          } else {
            logger.info('UpdateBuildingCostHead success');
            let projectCostHeads = projectService.calculateBudgetCostForCommonAmmenities(
              projectData.projectCostHeads, projectData);
            let queryForProject = {'_id': projectId};
            let updateProjectCostHead = {$set: {'projectCostHeads': projectCostHeads}};
            logger.info('Calling update project Costheads has been hit');
            projectRepository.findOneAndUpdate(queryForProject, updateProjectCostHead, {new: true},
              (error: any, response: any) => {
                if (error) {
                  logger.error('Error update project Costheads : ' + JSON.stringify(error));
                  callback(error, null);
                } else {
                  logger.debug('Update project Costheads success');
                  callback(null, response);
                }
              });
          }
        });
      }
    });
  }

  updateBudgetRatesForBuildingCostHeads(entity: string, buildingId: string, projectDetails: Project, buildingDetails: Building) {
    return new CCPromise(function (resolve: any, reject: any) {
      let rateAnalysisService = new RateAnalysisService();
      let projectService = new ProjectService();
      let buildingRepository = new BuildingRepository();
      logger.info('Inside updateBudgetRatesForBuildingCostHeads promise.');
      let query = {'region': config.get('costControlRegionCode')};
      rateAnalysisService.getCostControlRateAnalysis('buildingCostHeads', query, {}, (error: any, rateAnalysis: RateAnalysis) => {
        if (error) {
          logger.error('Error in promise updateBudgetRatesForBuildingCostHeads : ' + JSON.stringify(error));
          reject(error);
        } else {
          logger.info('Inside updateBudgetRatesForBuildingCostHeads success');
          let projectService = new ProjectService();
          let buildingCostHeads = rateAnalysis.buildingCostHeads;

          buildingCostHeads = projectService.calculateBudgetCostForBuilding(buildingCostHeads, buildingDetails, projectDetails);

          let query = {'_id': buildingId};
          let newData = {$set: {'costHeads': buildingCostHeads, 'rates': rateAnalysis.buildingRates}};
          buildingRepository.findOneAndUpdate(query, newData, {new: true}, (error: any, response: any) => {
            logger.info('Project service, getAllDataFromRateAnalysis has been hit');
            if (error) {
              logger.error('Error in Update buildingCostHeadsData  : ' + JSON.stringify(error));
              reject(error);
            } else {
              logger.debug('Updated buildingCostHeadsData');
              resolve('Done');
            }
          });
        }
      });
    }).catch(function (e: any) {
      logger.error('Error in updateBudgetRatesForBuildingCostHeads :' + JSON.stringify(e.message));
      CCPromise.reject(e.message);
    });
  }

  getRates(result: any, costHeads: Array<CostHead>) {
    let getRatesListSQL = 'SELECT * FROM ? AS q WHERE q.C4 IN (SELECT t.rateAnalysisId ' +
      'FROM ? AS t)';
    let rateItems = alasql(getRatesListSQL, [result.rates, costHeads]);

    let rateItemsRateAnalysisSQL = 'SELECT rateItem.C2 AS itemName, rateItem.C2 AS originalItemName,' +
      'rateItem.C12 AS rateAnalysisId, rateItem.C6 AS type,' +
      'ROUND(rateItem.C7,2) AS quantity, ROUND(rateItem.C3,2) AS rate, unit.C2 AS unit,' +
      'ROUND(rateItem.C3 * rateItem.C7,2) AS totalAmount, rateItem.C5 AS totalQuantity ' +
      'FROM ? AS rateItem JOIN ? AS unit ON unit.C1 = rateItem.C9';

    let rateItemsList = alasql(rateItemsRateAnalysisSQL, [rateItems, result.units]);

    let distinctItemsSQL = 'select DISTINCT itemName,originalItemName,rate FROM ?';
    var distinctRates = alasql(distinctItemsSQL, [rateItemsList]);

    return distinctRates;
  }

  getCentralizedRates(result: any, costHeads: Array<CostHead>) {

    let getRatesListSQL = 'SELECT * FROM ? AS q WHERE q.C4 IN (SELECT t.rateAnalysisId ' +
      'FROM ? AS t)';
    let rateItems = alasql(getRatesListSQL, [result.rates, costHeads]);

    let rateItemsRateAnalysisSQL = 'SELECT rateItem.C2 AS itemName, rateItem.C2 AS originalItemName,' +
      'rateItem.C12 AS rateAnalysisId, rateItem.C6 AS type,' +
      'ROUND(rateItem.C7,2) AS quantity, ROUND(rateItem.C3,2) AS rate, unit.C2 AS unit,' +
      'ROUND(rateItem.C3 * rateItem.C7,2) AS totalAmount, rateItem.C5 AS totalQuantity ' +
      'FROM ? AS rateItem JOIN ? AS unit ON unit.C1 = rateItem.C9';

    let rateItemsList = alasql(rateItemsRateAnalysisSQL, [rateItems, result.units]);

    let distinctItemsSQL = 'select DISTINCT itemName,originalItemName,rate FROM ?';
    var distinctRates = alasql(distinctItemsSQL, [rateItemsList]);

    return distinctRates;
  }


  convertConfigCostHeads(configCostHeads: Array<any>, costHeadsData: Array<CostHead>) {

    for (let configCostHead of configCostHeads) {

      let costHead: CostHead = new CostHead();
      costHead.name = configCostHead.name;
      costHead.priorityId = configCostHead.priorityId;
      costHead.rateAnalysisId = configCostHead.rateAnalysisId;
      let categoriesList = new Array<Category>();

      for (let configCategory of configCostHead.categories) {

        let category: Category = new Category(configCategory.name, configCategory.rateAnalysisId);
        let workItemsList: Array<WorkItem> = new Array<WorkItem>();

        for (let configWorkItem of configCategory.workItems) {

          let workItem: WorkItem = new WorkItem(configWorkItem.name, configWorkItem.rateAnalysisId);
          workItem.isDirectRate = true;
          workItem.unit = configWorkItem.measurementUnit;
          workItem.isMeasurementSheet = configWorkItem.isMeasurementSheet;
          workItem.isRateAnalysis = configWorkItem.isRateAnalysis;
          workItem.rateAnalysisPerUnit = configWorkItem.rateAnalysisPerUnit;
          workItem.isItemBreakdownRequired = configWorkItem.isItemBreakdownRequired;
          workItem.length = configWorkItem.length;
          workItem.breadthOrWidth = configWorkItem.breadthOrWidth;
          workItem.height = configWorkItem.height;

          if (configWorkItem.directRate !== null) {
            workItem.rate.total = configWorkItem.directRate;
          } else {
            workItem.rate.total = 0;
          }
          workItem.rate.isEstimated = true;
          workItemsList.push(workItem);
        }
        category.workItems = workItemsList;
        categoriesList.push(category);
      }

      costHead.categories = categoriesList;
      costHead.thumbRuleRate = config.get(Constants.THUMBRULE_RATE);
      costHeadsData.push(costHead);
    }
    return costHeadsData;
  }

  updateBudgetRatesForProjectCostHeads(entity: string, projectId: string, projectDetails: Project, buildingDetails: Building) {
    return new CCPromise(function (resolve: any, reject: any) {
      let rateAnalysisService = new RateAnalysisService();
      let projectRepository = new ProjectRepository();
      logger.info('Inside updateBudgetRatesForProjectCostHeads promise.');
      let query = {'region': config.get('costControlRegionCode')};
      rateAnalysisService.getCostControlRateAnalysis('projectCostHeads', query, {}, (error: any, rateAnalysis: RateAnalysis) => {
        if (error) {
          logger.error('Error in updateBudgetRatesForProjectCostHeads promise : ' + JSON.stringify(error));
          reject(error);
        } else {

          let projectService = new ProjectService();
          let projectCostHeads = rateAnalysis.projectCostHeads;
          projectCostHeads = projectService.calculateBudgetCostForCommonAmmenities(
            projectCostHeads, projectDetails);

          let query = {'_id': projectId};
          let newData = {$set: {'projectCostHeads': projectCostHeads, 'rates': rateAnalysis.projectRates}};

          projectRepository.findOneAndUpdate(query, newData, {new: true}, (error: any, response: any) => {
            logger.info('Project service, getAllDataFromRateAnalysis has been hit');
            if (error) {
              logger.error('Error in Update buildingCostHeadsData  : ' + JSON.stringify(error));
              reject(error);
            } else {
              logger.debug('Updated projectCostHeads');
              resolve('Done');
            }
          });
        }
      });
    }).catch(function (e: any) {
      logger.error('Error in updateBudgetRatesForProjectCostHeads :' + JSON.stringify(e.message));
      CCPromise.reject(e.message);
    });
  }

  calculateBudgetCostForBuilding(costHeadsRateAnalysis: any, buildingDetails: any, projectDetails: any, flag?: boolean) {
    logger.info('Project service, calculateBudgetCostForBuilding has been hit');
    let costHeads: Array<CostHead> = new Array<CostHead>();
    let budgetedCostAmount: number;
    let calculateBudgtedCost: string;

    for (let costHead of costHeadsRateAnalysis) {

      let budgetCostFormulae: string;

      switch (costHead.name) {

        case Constants.RCC : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          if (flag) {
            calculateBudgtedCost = costHead.budgetedCostAmount;
          } else {
            calculateBudgtedCost = budgetCostFormulae.replace(Constants.SLAB_AREA, buildingDetails.totalSlabArea);
          }
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
          break;
        }
        case Constants.EXTERNAL_PLASTER : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          if (flag) {
            calculateBudgtedCost = costHead.budgetedCostAmount;
          } else {
            calculateBudgtedCost = budgetCostFormulae.replace(Constants.CARPET_AREA, buildingDetails.totalCarpetAreaOfUnit);
          }
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
          break;
        }
        case Constants.FABRICATION : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          if (flag) {
            calculateBudgtedCost = costHead.budgetedCostAmount;
          } else {
            calculateBudgtedCost = budgetCostFormulae.replace(Constants.CARPET_AREA, buildingDetails.totalCarpetAreaOfUnit);
          }
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
          break;
        }
        case Constants.PAINTING : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          if (flag) {
            calculateBudgtedCost = costHead.budgetedCostAmount;
          } else {
            calculateBudgtedCost = budgetCostFormulae.replace(Constants.CARPET_AREA, buildingDetails.totalCarpetAreaOfUnit);
          }
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
          break;
        }
        case Constants.KITCHEN_PLATFORMS : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          if (flag) {
            calculateBudgtedCost = costHead.budgetedCostAmount;
          } else {
            calculateBudgtedCost = budgetCostFormulae.replace(Constants.NUM_OF_ONE_BHK, buildingDetails.numOfOneBHK)
              .replace(Constants.NUM_OF_TWO_BHK, buildingDetails.numOfTwoBHK)
              .replace(Constants.NUM_OF_THREE_BHK, buildingDetails.numOfThreeBHK)
              .replace(Constants.NUM_OF_FOUR_BHK, buildingDetails.numOfFourBHK)
              .replace(Constants.NUM_OF_FIVE_BHK, buildingDetails.numOfFiveBHK);
          }
          budgetedCostAmount = eval(calculateBudgtedCost);

          this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
          break;
        }
        case Constants.SOLING : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          if (flag) {
            calculateBudgtedCost = costHead.budgetedCostAmount;
          } else {
            calculateBudgtedCost = budgetCostFormulae.replace(Constants.PLINTH_AREA, buildingDetails.plinthArea);
          }
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
          break;
        }
        case Constants.MASONRY : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          if (flag) {
            calculateBudgtedCost = costHead.budgetedCostAmount;
          } else {
            calculateBudgtedCost = budgetCostFormulae.replace(Constants.CARPET_AREA, buildingDetails.totalCarpetAreaOfUnit);
          }
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
          break;
        }
        case Constants.INTERNAL_PLASTER : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          if (flag) {
            calculateBudgtedCost = costHead.budgetedCostAmount;
          } else {
            calculateBudgtedCost = budgetCostFormulae.replace(Constants.CARPET_AREA, buildingDetails.totalCarpetAreaOfUnit);
          }
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
          break;
        }
        case Constants.GYPSUM_PUNNING : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          if (flag) {
            calculateBudgtedCost = costHead.budgetedCostAmount;
          } else {
            calculateBudgtedCost = budgetCostFormulae.replace(Constants.CARPET_AREA, buildingDetails.totalCarpetAreaOfUnit);
          }
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
          break;
        }
        case Constants.WATER_PROOFING : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          if (flag) {
            calculateBudgtedCost = costHead.budgetedCostAmount;
          } else {
            calculateBudgtedCost = budgetCostFormulae.replace(Constants.CARPET_AREA, buildingDetails.totalCarpetAreaOfUnit);
          }
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
          break;
        }
        case Constants.DEWATERING : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          if (flag) {
            calculateBudgtedCost = costHead.budgetedCostAmount;
          } else {
            calculateBudgtedCost = budgetCostFormulae.replace(Constants.SALEABLE_AREA, buildingDetails.totalSaleableAreaOfUnit);
          }
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
          break;
        }
        case Constants.GARBAGE_CHUTE : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          if (flag) {
            calculateBudgtedCost = costHead.budgetedCostAmount;
          } else {
            calculateBudgtedCost = budgetCostFormulae.replace(Constants.NUM_OF_FLOORS, buildingDetails.totalNumOfFloors)
              .replace(Constants.NUM_OF_PARKING_FLOORS, buildingDetails.numOfParkingFloors);
          }
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
          break;
        }
        case Constants.LIFT : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + 'Lift').toString();
          if (flag) {
            calculateBudgtedCost = costHead.budgetedCostAmount;
          } else {
            calculateBudgtedCost = budgetCostFormulae.replace(Constants.NUM_OF_FLOORS, buildingDetails.totalNumOfFloors)
              .replace(Constants.NUM_OF_LIFTS, buildingDetails.numOfLifts);
          }
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
          break;
        }
        case Constants.DOORS_WITH_FRAMES : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          if (flag) {
            calculateBudgtedCost = costHead.budgetedCostAmount;
          } else {
            calculateBudgtedCost = budgetCostFormulae.replace(Constants.NUM_OF_ONE_BHK, buildingDetails.numOfOneBHK)
              .replace(Constants.NUM_OF_TWO_BHK, buildingDetails.numOfTwoBHK)
              .replace(Constants.NUM_OF_THREE_BHK, buildingDetails.numOfThreeBHK)
              .replace(Constants.NUM_OF_FOUR_BHK, buildingDetails.numOfFourBHK)
              .replace(Constants.NUM_OF_FIVE_BHK, buildingDetails.numOfFiveBHK)
              .replace(Constants.NUM_OF_ONE_BHK, buildingDetails.numOfOneBHK)
              .replace(Constants.NUM_OF_TWO_BHK, buildingDetails.numOfTwoBHK)
              .replace(Constants.NUM_OF_THREE_BHK, buildingDetails.numOfThreeBHK)
              .replace(Constants.NUM_OF_FOUR_BHK, buildingDetails.numOfFourBHK)
              .replace(Constants.NUM_OF_FIVE_BHK, buildingDetails.numOfFiveBHK);
          }
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
          break;
        }
        case Constants.EXCAVATION : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          if (flag) {
            calculateBudgtedCost = costHead.budgetedCostAmount;
          } else {
            calculateBudgtedCost = budgetCostFormulae.replace(Constants.PLINTH_AREA, buildingDetails.plinthArea);
          }
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
          break;
        }
        case Constants.BACKFILLING_PLINTH : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          if (flag) {
            calculateBudgtedCost = costHead.budgetedCostAmount;
          } else {
            calculateBudgtedCost = budgetCostFormulae.replace(Constants.PLINTH_AREA, buildingDetails.plinthArea);
          }
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
          break;
        }
        case Constants.FLOORING_SKIRTING_DADO_WALL_TILING : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          if (flag) {
            calculateBudgtedCost = costHead.budgetedCostAmount;
          } else {
            calculateBudgtedCost = budgetCostFormulae.replace(Constants.CARPET_AREA, buildingDetails.totalCarpetAreaOfUnit);
          }
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
          break;
        }
        case Constants.WINDOWS_SILLS_OR_JAMBS : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          if (flag) {
            calculateBudgtedCost = costHead.budgetedCostAmount;
          } else {
            calculateBudgtedCost = budgetCostFormulae.replace(Constants.CARPET_AREA, buildingDetails.totalCarpetAreaOfUnit);
          }
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
          break;
        }
        case Constants.STAIRCASE_TREADS_AND_RISERS : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          if (flag) {
            calculateBudgtedCost = costHead.budgetedCostAmount;
          } else {
            calculateBudgtedCost = budgetCostFormulae.replace(Constants.CARPET_AREA, buildingDetails.totalCarpetAreaOfUnit);
          }
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
          break;
        }

        case Constants.DOORS_WITH_FRAMES_AND_HARDWARE : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          if (flag) {
            calculateBudgtedCost = costHead.budgetedCostAmount;
          } else {
            calculateBudgtedCost = budgetCostFormulae.replace(Constants.NUM_OF_ONE_BHK, buildingDetails.numOfOneBHK)
              .replace(Constants.NUM_OF_TWO_BHK, buildingDetails.numOfTwoBHK)
              .replace(Constants.NUM_OF_THREE_BHK, buildingDetails.numOfThreeBHK)
              .replace(Constants.NUM_OF_FOUR_BHK, buildingDetails.numOfFourBHK)
              .replace(Constants.NUM_OF_FIVE_BHK, buildingDetails.numOfFiveBHK);
          }
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
          break;
        }
        case Constants.WINDOWS_AND_GLASS_DOORS : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          if (flag) {
            calculateBudgtedCost = costHead.budgetedCostAmount;
          } else {
            calculateBudgtedCost = budgetCostFormulae.replace(Constants.CARPET_AREA, buildingDetails.totalCarpetAreaOfUnit);
          }
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
          break;
        }
        case Constants.ELECTRIFICATION : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          if (flag) {
            calculateBudgtedCost = costHead.budgetedCostAmount;
          } else {
            calculateBudgtedCost = budgetCostFormulae.replace(Constants.CARPET_AREA, buildingDetails.totalCarpetAreaOfUnit);
          }
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
          break;
        }
        /*  case Constants.PLUMBING : {
            budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
            calculateBudgtedCost = budgetCostFormulae.replace(Constants.NUM_OF_ONE_BHK, buildingDetails.numOfOneBHK)
              .replace(Constants.NUM_OF_TWO_BHK, buildingDetails.numOfTwoBHK)
              .replace(Constants.NUM_OF_THREE_BHK, buildingDetails.numOfThreeBHK)
              .replace(Constants.NUM_OF_FOUR_BHK, buildingDetails.numOfFourBHK)
              .replace(Constants.NUM_OF_FIVE_BHK, buildingDetails.numOfFiveBHK)
              .replace(Constants.NUM_OF_ONE_BHK, buildingDetails.numOfOneBHK)
              .replace(Constants.NUM_OF_TWO_BHK, buildingDetails.numOfTwoBHK)
              .replace(Constants.NUM_OF_THREE_BHK, buildingDetails.numOfThreeBHK)
              .replace(Constants.NUM_OF_FOUR_BHK, buildingDetails.numOfFourBHK)
              .replace(Constants.NUM_OF_FIVE_BHK, buildingDetails.numOfFiveBHK);
            budgetedCostAmount = eval(calculateBudgtedCost);
            this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
            break;
          }*/
        case Constants.ELECTRICAL_LIGHT_FITTINGS_IN_COMMON_AREAS_OF_BUILDINGS : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          if (flag) {
            calculateBudgtedCost = costHead.budgetedCostAmount;
          } else {
            calculateBudgtedCost = budgetCostFormulae.replace(Constants.CARPET_AREA_OF_PARKING, buildingDetails.carpetAreaOfParking)
              .replace(Constants.PLOT_PERIPHERY_LENGTH, projectDetails.plotPeriphery)
              .replace(Constants.NUM_OF_FLOORS, buildingDetails.totalNumOfFloors);
          }
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
          break;
        }
        case Constants.PEST_CONTROL : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          if (flag) {
            calculateBudgtedCost = costHead.budgetedCostAmount;
          } else {
            calculateBudgtedCost = budgetCostFormulae.replace(Constants.CARPET_AREA, buildingDetails.totalCarpetAreaOfUnit);
          }
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
          break;
        }
        case Constants.SOLAR_WATER_HEATING_SYSTEM : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          if (flag) {
            calculateBudgtedCost = costHead.budgetedCostAmount;
          } else {
            calculateBudgtedCost = budgetCostFormulae.replace(Constants.CARPET_AREA, buildingDetails.totalCarpetAreaOfUnit);
          }
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
          break;
        }
        case Constants.SKY_LOUNGE_ON_TOP_TERRACE : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          if (flag) {
            calculateBudgtedCost = costHead.budgetedCostAmount;
          } else {
            calculateBudgtedCost = budgetCostFormulae.replace(Constants.SLAB_AREA, buildingDetails.totalSlabArea)
              .replace(Constants.NUM_OF_FLOORS, buildingDetails.totalNumOfFloors)
              .replace(Constants.NUM_OF_PARKING_FLOORS, buildingDetails.numOfParkingFloors);
          }
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
          break;
        }
        case Constants.SAFETY_AND_SECURITY_AUTOMATION : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          if (flag) {
            calculateBudgtedCost = costHead.budgetedCostAmount;
          } else {
            calculateBudgtedCost = budgetCostFormulae.replace(Constants.NUM_OF_ONE_BHK, buildingDetails.numOfOneBHK)
              .replace(Constants.NUM_OF_TWO_BHK, buildingDetails.numOfTwoBHK)
              .replace(Constants.NUM_OF_THREE_BHK, buildingDetails.numOfThreeBHK)
              .replace(Constants.NUM_OF_FOUR_BHK, buildingDetails.numOfFourBHK)
              .replace(Constants.NUM_OF_FIVE_BHK, buildingDetails.numOfFiveBHK);
          }
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
          break;
        }
        case Constants.SHOWER_ENCLOSURES : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          if (flag) {
            calculateBudgtedCost = costHead.budgetedCostAmount;
          } else {
            calculateBudgtedCost = budgetCostFormulae.replace(Constants.NUM_OF_ONE_BHK, buildingDetails.numOfOneBHK)
              .replace(Constants.NUM_OF_TWO_BHK, buildingDetails.numOfTwoBHK)
              .replace(Constants.NUM_OF_THREE_BHK, buildingDetails.numOfThreeBHK)
              .replace(Constants.NUM_OF_FOUR_BHK, buildingDetails.numOfFourBHK)
              .replace(Constants.NUM_OF_FIVE_BHK, buildingDetails.numOfFiveBHK);
          }
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
          break;
        }
        case Constants.FALSE_CEILING : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          if (flag) {
            calculateBudgtedCost = costHead.budgetedCostAmount;
          } else {
            calculateBudgtedCost = budgetCostFormulae.replace(Constants.NUM_OF_ONE_BHK, buildingDetails.numOfOneBHK)
              .replace(Constants.NUM_OF_TWO_BHK, buildingDetails.numOfTwoBHK)
              .replace(Constants.NUM_OF_THREE_BHK, buildingDetails.numOfThreeBHK)
              .replace(Constants.NUM_OF_FOUR_BHK, buildingDetails.numOfFourBHK)
              .replace(Constants.NUM_OF_FIVE_BHK, buildingDetails.numOfFiveBHK);
          }
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
          break;
        }
        case Constants.SPECIAL_ELEVATIONAL_FEATURES : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + 'Special elevational features').toString();
          if (flag) {
            calculateBudgtedCost = costHead.budgetedCostAmount;
          } else {
            calculateBudgtedCost = budgetCostFormulae.replace(Constants.CARPET_AREA, buildingDetails.totalCarpetAreaOfUnit);
          }
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
          break;
        }
        case Constants.BOARDS_AND_SIGNAGES_INSIDE_BUILDING : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          if (flag) {
            calculateBudgtedCost = costHead.budgetedCostAmount;
          } else {
            calculateBudgtedCost = budgetCostFormulae.replace(Constants.NUM_OF_ONE_BHK, buildingDetails.numOfOneBHK)
              .replace(Constants.NUM_OF_TWO_BHK, buildingDetails.numOfTwoBHK)
              .replace(Constants.NUM_OF_THREE_BHK, buildingDetails.numOfThreeBHK)
              .replace(Constants.NUM_OF_FOUR_BHK, buildingDetails.numOfFourBHK)
              .replace(Constants.NUM_OF_FIVE_BHK, buildingDetails.numOfFiveBHK)
              .replace(Constants.NUM_OF_FLOORS, buildingDetails.totalNumOfFloors);
          }
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
          break;
        }
        case Constants.INTERNAL_PLUMBING_WITH_VERTICAL_LINES : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          if (flag) {
            calculateBudgtedCost = costHead.budgetedCostAmount;
          } else {
            calculateBudgtedCost = budgetCostFormulae.replace(Constants.NUM_OF_ONE_BHK, buildingDetails.numOfOneBHK)
              .replace(Constants.NUM_OF_TWO_BHK, buildingDetails.numOfTwoBHK)
              .replace(Constants.NUM_OF_THREE_BHK, buildingDetails.numOfThreeBHK)
              .replace(Constants.NUM_OF_FOUR_BHK, buildingDetails.numOfFourBHK)
              .replace(Constants.NUM_OF_FIVE_BHK, buildingDetails.numOfFiveBHK)
              .replace(Constants.NUM_OF_ONE_BHK, buildingDetails.numOfOneBHK)
              .replace(Constants.NUM_OF_TWO_BHK, buildingDetails.numOfTwoBHK)
              .replace(Constants.NUM_OF_THREE_BHK, buildingDetails.numOfThreeBHK)
              .replace(Constants.NUM_OF_FOUR_BHK, buildingDetails.numOfFourBHK)
              .replace(Constants.NUM_OF_FIVE_BHK, buildingDetails.numOfFiveBHK);
          }
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
          break;
        }
        case Constants.WINDOWS_SLIDING_DOORS : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          if (flag) {
            calculateBudgtedCost = costHead.budgetedCostAmount;
          } else {
            calculateBudgtedCost = budgetCostFormulae.replace(Constants.CARPET_AREA, buildingDetails.totalCarpetAreaOfUnit);
          }
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForCostHead(budgetedCostAmount, costHead, buildingDetails, costHeads);
          break;
        }
        case Constants.ROOFING : {
          budgetedCostAmount = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name);
          if (flag) {
            budgetedCostAmount = costHead.budgetedCostAmount;
          }
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

  calculateBudgetCostForCommonAmmenities(costHeadsRateAnalysis: any, projectDetails: Project) {
    logger.info('Project service, calculateBudgetCostForCommonAmmenities has been hit');

    let costHeads: Array<CostHead> = new Array<CostHead>();
    let budgetedCostAmount: number;
    let budgetCostFormulae: string;
    let calculateBudgtedCost: string;

    let calculateProjectData = 'SELECT ROUND(SUM(building.totalCarpetAreaOfUnit),2) AS totalCarpetArea, ' +
      'ROUND(SUM(building.totalSlabArea),2) AS totalSlabAreaProject,' +
      'ROUND(SUM(building.numOfOneBHK),2) AS totalNumberOfOneBHK,' +
      'ROUND(SUM(building.numOfTwoBHK),2) AS totalNumberOfTwoBHK,' +
      'ROUND(SUM(building.numOfThreeBHK),2) AS totalNumberOfThreeBHK,' +
      'ROUND(SUM(building.numOfFourBHK),2) AS totalNumberOfFourBHK,' +
      'ROUND(SUM(building.numOfFiveBHK),2) AS totalNumberOfFiveBHK,' +
      'ROUND(SUM(building.totalNumOfFloors),2) AS totalNumberOfFloors,' +
      'ROUND(SUM(building.carpetAreaOfParking),2) AS totalCarpetAreaOfParking,' +
      'ROUND(SUM(building.totalSaleableAreaOfUnit),2) AS totalSaleableArea  FROM ? AS building';
    let projectData = alasql(calculateProjectData, [projectDetails.buildings]);
    let totalSlabAreaOfProject: number = projectData[0].totalSlabAreaProject;
    let totalSaleableAreaOfProject: number = projectData[0].totalSaleableArea;
    let totalCarpetAreaOfProject: number = projectData[0].totalCarpetArea;
    let totalCarpetAreaOfParking: number = projectData[0].totalCarpetAreaOfParking;
    let totalNumberOfOneBHKInProject: number = projectData[0].totalNumberOfOneBHK;
    let totalNumberOfTwoBHKInProject: number = projectData[0].totalNumberOfTwoBHK;
    let totalNumberOfThreeBHKInProject: number = projectData[0].totalNumberOfThreeBHK;
    let totalNumberOfFourBHKInProject: number = projectData[0].totalNumberOfFourBHK;
    let totalNumberOfFiveBHKInProject: number = projectData[0].totalNumberOfFiveBHK;
    let totalNumberOfFloorsProject: number = projectData[0].totalNumberOfFloors;

    for (let costHead of costHeadsRateAnalysis) {

      switch (costHead.name) {

        case Constants.SAFETY_MEASURES : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          calculateBudgtedCost = budgetCostFormulae.replace(Constants.TOTAL_CARPET_AREA, totalCarpetAreaOfProject);
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForProjectCostHead(budgetedCostAmount, costHead, projectDetails, costHeads);
          break;
        }
        case Constants.CLUB_HOUSE : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          calculateBudgtedCost = budgetCostFormulae.replace(Constants.TOTAL_SLAB_AREA_OF_CLUB_HOUSE, projectDetails.slabArea);
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForProjectCostHead(budgetedCostAmount, costHead, projectDetails, costHeads);
          break;
        }
        case Constants.SWIMMING_POOL : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          calculateBudgtedCost = budgetCostFormulae.replace(Constants.SWIMMING_POOL_CAPACITY, projectDetails.poolCapacity);
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForProjectCostHead(budgetedCostAmount, costHead, projectDetails, costHeads);
          break;
        }
        case Constants.CHILDREN_PLAY_AREA : {
          this.setFixedBudgetedCost(budgetedCostAmount, costHead, projectDetails, costHeads);
          break;
        }
        case Constants.GYM : {
          this.setFixedBudgetedCost(budgetedCostAmount, costHead, projectDetails, costHeads);
          break;
        }
        case Constants.D_G_SET_BACKUP : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          calculateBudgtedCost = budgetCostFormulae.replace(Constants.TOTAL_CARPET_AREA, totalCarpetAreaOfProject);
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForProjectCostHead(budgetedCostAmount, costHead, projectDetails, costHeads);
          break;
        }
        case Constants.PODIUM : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          calculateBudgtedCost = budgetCostFormulae.replace(Constants.PODIUM_AREA, projectDetails.podiumArea);
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForProjectCostHead(budgetedCostAmount, costHead, projectDetails, costHeads);
          break;
        }
        case Constants.LANDSCAPING_OF_OPEN_SPACES : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          calculateBudgtedCost = budgetCostFormulae.replace(Constants.OPEN_SPACE, projectDetails.openSpace).replace(Constants.PLOT_PERIPHERY_LENGTH, projectDetails.plotPeriphery);
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForProjectCostHead(budgetedCostAmount, costHead, projectDetails, costHeads);
          break;
        }
        case Constants.RAIN_WATER_HARVESTING : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          calculateBudgtedCost = budgetCostFormulae.replace(Constants.PLOT_AREA, projectDetails.plotArea);
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForProjectCostHead(budgetedCostAmount, costHead, projectDetails, costHeads);
          break;
        }
        case Constants.BOARDS_AND_SIGNAGES_IN_COMMON_AREAS : {
          this.setFixedBudgetedCost(budgetedCostAmount, costHead, projectDetails, costHeads);
          break;
        }
        case Constants.ELECTRICAL_LIGHT_FITTINGS_IN_COMMON_AREAS_OF_PROJECT : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          calculateBudgtedCost = budgetCostFormulae.replace(Constants.PLOT_PERIPHERY_LENGTH, projectDetails.plotPeriphery).replace(Constants.OPEN_SPACE, projectDetails.openSpace);
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForProjectCostHead(budgetedCostAmount, costHead, projectDetails, costHeads);
          break;
        }
        case Constants.SITE_DEV_ELECTRICAL_INFRASTRUCTURE : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          calculateBudgtedCost = budgetCostFormulae.replace(Constants.NUM_OF_ONE_BHK, totalNumberOfOneBHKInProject)
            .replace(Constants.NUM_OF_TWO_BHK, totalNumberOfTwoBHKInProject).replace(Constants.NUM_OF_THREE_BHK, totalNumberOfThreeBHKInProject)
            .replace(Constants.NUM_OF_FOUR_BHK, totalNumberOfFourBHKInProject).replace(Constants.NUM_OF_FIVE_BHK, totalNumberOfFiveBHKInProject);
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForProjectCostHead(budgetedCostAmount, costHead, projectDetails, costHeads);
          break;
        }
        case Constants.SITE_DEV_PLUMBING_AND_DRAINAGE_SYSTEM : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          calculateBudgtedCost = budgetCostFormulae.replace(Constants.TOTAL_CARPET_AREA, totalCarpetAreaOfProject);
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForProjectCostHead(budgetedCostAmount, costHead, projectDetails, costHeads);
          break;
        }
        case Constants.SITE_DEV_BACKFILLING : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          calculateBudgtedCost = budgetCostFormulae.replace(Constants.PLOT_AREA, projectDetails.plotArea);
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForProjectCostHead(budgetedCostAmount, costHead, projectDetails, costHeads);
          break;
        }
        case Constants.SITE_DEV_ROAD_WORK : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          calculateBudgtedCost = budgetCostFormulae.replace(Constants.PLOT_AREA, projectDetails.plotArea);
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForProjectCostHead(budgetedCostAmount, costHead, projectDetails, costHeads);
          break;
        }
        /*  case Constants.KERBING : {    // ToDo : waiting for indrajeet's ans
            /!*budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
            calculateBudgtedCost = budgetCostFormulae.replace(Constants.SWIMMING_POOL_CAPACITY, projectDetails.poolCapacity);
            budgetedCostAmount = eval(calculateBudgtedCost);*!/
            budgetedCostAmount = 1;
            this.calculateThumbRuleReportForProjectCostHead(budgetedCostAmount, costHead, projectDetails, costHeads);
            break;
          }*/
        case Constants.PROJECT_ENTRANCE_GATE : {
          this.setFixedBudgetedCost(budgetedCostAmount, costHead, projectDetails, costHeads);
          break;
        }
        case Constants.COMPOUND_WALL : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          calculateBudgtedCost = budgetCostFormulae.replace(Constants.PLOT_PERIPHERY_LENGTH, projectDetails.plotPeriphery);
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForProjectCostHead(budgetedCostAmount, costHead, projectDetails, costHeads);
          break;
        }
        case Constants.CAR_PARK_SYSTEMS : {   // ToDo : waiting for indrajeet's ans
          /*budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          calculateBudgtedCost = budgetCostFormulae.replace(Constants.SWIMMING_POOL_CAPACITY, projectDetails.poolCapacity);
          budgetedCostAmount = eval(calculateBudgtedCost);*/
          budgetedCostAmount = 0;
          this.calculateThumbRuleReportForProjectCostHead(budgetedCostAmount, costHead, projectDetails, costHeads);
          break;
        }
        case Constants.CAR_PARK_MARKING_PARKING_ACCESSORIES : {      // ToDo : waiting for indrajeet's ans
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          calculateBudgtedCost = budgetCostFormulae.replace(Constants.CARPET_AREA_OF_PARKING, totalCarpetAreaOfParking);
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForProjectCostHead(budgetedCostAmount, costHead, projectDetails, costHeads);
          break;
        }
        case Constants.CLEANING_AND_SHIFTING_OF_DEBRIS : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          calculateBudgtedCost = budgetCostFormulae.replace(Constants.TOTAL_CARPET_AREA, totalCarpetAreaOfProject);
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForProjectCostHead(budgetedCostAmount, costHead, projectDetails, costHeads);
          break;
        }
        case Constants.ELECTRICITY_AND_DIESEL_CHARGES : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          calculateBudgtedCost = budgetCostFormulae.replace(Constants.TOTAL_CARPET_AREA, totalCarpetAreaOfProject)
            .replace(Constants.TARGETED_PROJECT_COMPLETION_PERIOD, projectDetails.projectDuration);
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForProjectCostHead(budgetedCostAmount, costHead, projectDetails, costHeads);
          break;
        }
        case Constants.MATERIAL_TESTING : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          calculateBudgtedCost = budgetCostFormulae.replace(Constants.TOTAL_CARPET_AREA, totalCarpetAreaOfProject);
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForProjectCostHead(budgetedCostAmount, costHead, projectDetails, costHeads);
          break;
        }
        case Constants.DEPARTMENTAL_LABOUR : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          calculateBudgtedCost = budgetCostFormulae.replace(Constants.PLOT_AREA, projectDetails.plotArea)
            .replace(Constants.TARGETED_PROJECT_COMPLETION_PERIOD, projectDetails.projectDuration);
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForProjectCostHead(budgetedCostAmount, costHead, projectDetails, costHeads);
          break;
        }
        case Constants.CLEANING_OF_UNITS_BEFORE_POSSESSION : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          calculateBudgtedCost = budgetCostFormulae.replace(Constants.TOTAL_CARPET_AREA, totalCarpetAreaOfProject);
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForProjectCostHead(budgetedCostAmount, costHead, projectDetails, costHeads);
          break;
        }
        case Constants.SAMPLE_FLAT : {
          this.setFixedBudgetedCost(budgetedCostAmount, costHead, projectDetails, costHeads);
          break;
        }
        case Constants.LABOUR_CAMP : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          calculateBudgtedCost = budgetCostFormulae.replace(Constants.TOTAL_CARPET_AREA, totalCarpetAreaOfProject);
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForProjectCostHead(budgetedCostAmount, costHead, projectDetails, costHeads);
          break;
        }
        case Constants.SITE_PREPARATION_TEMPORARY_FENCING : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          calculateBudgtedCost = budgetCostFormulae.replace(Constants.PLOT_PERIPHERY_LENGTH, projectDetails.plotPeriphery);
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForProjectCostHead(budgetedCostAmount, costHead, projectDetails, costHeads);
          break;
        }
        case Constants.SITE_PREPARATION_TEMPORARY_STRUCTURES_STORES : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          calculateBudgtedCost = budgetCostFormulae.replace(Constants.SALEABLE_AREA, totalSaleableAreaOfProject);
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForProjectCostHead(budgetedCostAmount, costHead, projectDetails, costHeads);
          break;
        }
        case Constants.TEMPORARY_ELECTRIFICATION : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          calculateBudgtedCost = budgetCostFormulae.replace(Constants.TOTAL_CARPET_AREA, totalCarpetAreaOfProject);
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForProjectCostHead(budgetedCostAmount, costHead, projectDetails, costHeads);
          break;
        }
        case Constants.TEMPORARY_PLUMBING_AND_DRAINAGE : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          calculateBudgtedCost = budgetCostFormulae.replace(Constants.SALEABLE_AREA, totalSaleableAreaOfProject);
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForProjectCostHead(budgetedCostAmount, costHead, projectDetails, costHeads);
          break;
        }
        case Constants.SITE_SALES_OFFICE : {
          this.setFixedBudgetedCost(budgetedCostAmount, costHead, projectDetails, costHeads);
          break;
        }
        case Constants.SOCIETY_OFFICE_WITH_FURNITURE : {
          this.setFixedBudgetedCost(budgetedCostAmount, costHead, projectDetails, costHeads);
          break;
        }
        case Constants.WATER_CHARGES : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          calculateBudgtedCost = budgetCostFormulae.replace(Constants.TOTAL_CARPET_AREA, totalCarpetAreaOfProject)
            .replace(Constants.TARGETED_PROJECT_COMPLETION_PERIOD, projectDetails.projectDuration);
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForProjectCostHead(budgetedCostAmount, costHead, projectDetails, costHeads);
          break;
        }
        case Constants.REPAIRS_MAINTENANCE_CHARGES_IN_DEFECT_LIABILITY_PERIOD_OF_5_YEARS : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          calculateBudgtedCost = budgetCostFormulae.replace(Constants.TOTAL_CARPET_AREA, totalCarpetAreaOfProject);
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForProjectCostHead(budgetedCostAmount, costHead, projectDetails, costHeads);
          break;
        }
        case Constants.PROFFESSIONAL_FEES : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          calculateBudgtedCost = budgetCostFormulae.replace(Constants.TOTAL_CARPET_AREA, totalCarpetAreaOfProject);
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForProjectCostHead(budgetedCostAmount, costHead, projectDetails, costHeads);
          break;
        }
        case Constants.SALES_AND_MARKETING : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          calculateBudgtedCost = budgetCostFormulae.replace(Constants.TOTAL_CARPET_AREA, totalCarpetAreaOfProject);
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForProjectCostHead(budgetedCostAmount, costHead, projectDetails, costHeads);
          break;
        }
        case Constants.FINANCE_COST : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          calculateBudgtedCost = budgetCostFormulae.replace(Constants.TOTAL_CARPET_AREA, totalCarpetAreaOfProject);
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForProjectCostHead(budgetedCostAmount, costHead, projectDetails, costHeads);
          break;
        }
        case Constants.ADMINISTRATIVE_CHARGES : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          calculateBudgtedCost = budgetCostFormulae.replace(Constants.TOTAL_CARPET_AREA, totalCarpetAreaOfProject);
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForProjectCostHead(budgetedCostAmount, costHead, projectDetails, costHeads);
          break;
        }
        case Constants.LOCAL_BODY_PROJECT_SANCTIONING_CHARGES : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          calculateBudgtedCost = budgetCostFormulae.replace(Constants.TOTAL_CARPET_AREA, totalCarpetAreaOfProject);
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForProjectCostHead(budgetedCostAmount, costHead, projectDetails, costHeads);
          break;
        }
        case Constants.SITE_SECURITY : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          calculateBudgtedCost = budgetCostFormulae.replace(Constants.PLOT_AREA, projectDetails.plotArea)
            .replace(Constants.TARGETED_PROJECT_COMPLETION_PERIOD, projectDetails.projectDuration);
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForProjectCostHead(budgetedCostAmount, costHead, projectDetails, costHeads);
          break;
        }
        case Constants.GAMES_AND_SPORTS : {
          this.setFixedBudgetedCost(budgetedCostAmount, costHead, projectDetails, costHeads);
          break;
        }
        case Constants.SAFETY_AND_SECURITY_PROJECT : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          calculateBudgtedCost = budgetCostFormulae.replace(Constants.PLOT_AREA, projectDetails.plotArea);
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForProjectCostHead(budgetedCostAmount, costHead, projectDetails, costHeads);
          break;
        }
        case Constants.MACHINERY_TOOLS_SCAFFOLDING : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          calculateBudgtedCost = budgetCostFormulae.replace(Constants.PLOT_AREA, projectDetails.plotArea);
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForProjectCostHead(budgetedCostAmount, costHead, projectDetails, costHeads);
          break;
        }
        case Constants.FIRE_FIGHTING_SYSTEM : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          calculateBudgtedCost = budgetCostFormulae.replace(Constants.NUM_OF_FLOORS, totalNumberOfFloorsProject);
          budgetedCostAmount = eval(calculateBudgtedCost);
          this.calculateThumbRuleReportForProjectCostHead(budgetedCostAmount, costHead, projectDetails, costHeads);
          break;
        }
        case Constants.PIPED_GAS_SYSTEM : {
          budgetCostFormulae = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name).toString();
          calculateBudgtedCost = budgetCostFormulae.replace(Constants.NUM_OF_ONE_BHK, totalNumberOfOneBHKInProject)
            .replace(Constants.NUM_OF_TWO_BHK, totalNumberOfTwoBHKInProject)
            .replace(Constants.NUM_OF_THREE_BHK, totalNumberOfThreeBHKInProject)
            .replace(Constants.NUM_OF_FOUR_BHK, totalNumberOfFourBHKInProject)
            .replace(Constants.NUM_OF_FIVE_BHK, totalNumberOfFiveBHKInProject);
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

  setFixedBudgetedCost(budgetedCostAmount: number, costHead: any, projectDetails: Project, costHeads: Array<CostHead>) {
    budgetedCostAmount = config.get(Constants.BUDGETED_COST_FORMULAE + costHead.name);
    this.calculateThumbRuleReportForProjectCostHead(budgetedCostAmount, costHead, projectDetails, costHeads);
  }

  addNewCentralizedRateForBuilding(buildingId: string, rateItem: any) {
    return new CCPromise(function (resolve: any, reject: any) {
      logger.info('createPromiseForAddingNewRateItem has been hit for buildingId: ' + buildingId + ', rateItem : ' + rateItem);

      let buildingRepository = new BuildingRepository();
      let queryAddNewRateItem = {'_id': buildingId};
      let addNewRateRateData = {$push: {'rates': rateItem}};
      buildingRepository.findOneAndUpdate(queryAddNewRateItem, addNewRateRateData, {new: true}, (error: Error, result: Building) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    }).catch(function (e: any) {
      logger.error('Promise failed for individual createPromiseForAddingNewRateItem! error :' + JSON.stringify(e.message));
      CCPromise.reject(e.message);
    });
  }

  updateCentralizedRateForBuilding(buildingId: string, rateItem: string, rateItemRate: number, rateItemGst: number) {
    return new CCPromise(function (resolve: any, reject: any) {
      logger.info('createPromiseForRateUpdate has been hit for buildingId : ' + buildingId + ', rateItem : ' + rateItem);
      //update rate
      let buildingRepository = new BuildingRepository();
      let queryUpdateRate = {'_id': buildingId, 'rates.itemName': rateItem};
      let updateRate = {$set: {'rates.$.rate': rateItemRate, 'rates.$.gst': rateItemGst}};
      buildingRepository.findOneAndUpdate(queryUpdateRate, updateRate, {new: true}, (error: Error, result: Building) => {
        if (error) {
          reject(error);
        } else {
          console.log('Rate Updated');
          resolve(result);
        }
      });
    }).catch(function (e: any) {
      logger.error('Promise failed for individual createPromiseForRateUpdate ! Error: ' + JSON.stringify(e.message));
      CCPromise.reject(e.message);
    });
  }

  addNewCentralizedRateForProject(projectId: string, rateItem: any) {
    return new CCPromise(function (resolve: any, reject: any) {
      logger.info('createPromiseForAddingNewRateItemInProjectRates has been hit for projectId : ' + projectId + ', rateItem : ' + rateItem);

      let projectRepository = new ProjectRepository();
      let addNewRateItemQueryProject = {'_id': projectId};
      let addNewRateRateDataProject = {$push: {'rates': rateItem}};
      projectRepository.findOneAndUpdate(addNewRateItemQueryProject, addNewRateRateDataProject,
        {new: true}, (error: Error, result: Building) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
    }).catch(function (e: any) {
      logger.error('Promise failed for individual createPromiseForAddingNewRateItemInProjectRates ! error :' + JSON.stringify(e.message));
      CCPromise.reject(e.message);
    });
  }

  updateCentralizedRateForProject(projectId: string, rateItem: string, rateItemRate: number, rateItemGst: number) {
    return new CCPromise(function (resolve: any, reject: any) {
      logger.info('createPromiseForRateUpdateOfProjectRates has been hit for projectId : ' + projectId + ', rateItem : ' + rateItem);
      //update rate
      let projectRepository = new ProjectRepository();
      let queryUpdateRateForProject = {'_id': projectId, 'rates.itemName': rateItem};
      let updateRateForProject = {$set: {'rates.$.rate': rateItemRate, 'rates.$.gst': rateItemGst}};
      projectRepository.findOneAndUpdate(queryUpdateRateForProject, updateRateForProject, {new: true}, (error: Error, result: Project) => {
        if (error) {
          reject(error);
        } else {
          console.log('Rate Updated for Project rates');
          resolve(result);
        }
      });
    }).catch(function (e: any) {
      logger.error('Promise failed for individual createPromiseForRateUpdateOfProjectRates ! Error: ' + JSON.stringify(e.message));
      CCPromise.reject(e.message);
    });
  }

  addAttachmentToWorkItem(projectId: string, buildingId: string, costHeadId: number, categoryId: number,
                          workItemId: number, ccWorkItemId: number, fileData: any, callback: (error: any, result: any) => void) {

    this.addAttachment(fileData, (error: any, attachmentObject: AttachmentDetailsModel) => {
      if (error) {
        callback(error, null);
      } else {
        let projection = {costHeads: 1};
        this.buildingRepository.findByIdWithProjection(buildingId, projection, (error, building) => {
          if (error) {
            callback(error, null);
          } else {
            let costHeadList = building.costHeads;
            let costHeads = this.uploadFile(costHeadList, costHeadId, categoryId, workItemId, ccWorkItemId, attachmentObject);
            let query = {_id: buildingId};
            let updateData = {$set: {'costHeads': costHeads}};
            this.buildingRepository.findOneAndUpdate(query, updateData, {new: true}, (error, response) => {
              if (error) {
                callback(error, null);
              } else {
                callback(null, {data: 'success'});
              }
            });
          }
        });
      }
    });
  }

  addAttachment(fileData: any, callback: (error: any, result: any) => void) {
    __dirname = path.resolve() + config.get('application.attachmentPath');
    let form = new multiparty.Form({uploadDir: __dirname});
    form.parse(fileData, (err: Error, fields: any, files: any) => {
      if (err) {
        callback(err, null);
      } else {

        let file_path = files.file[0].path;
        let assignedFileName = file_path.substr(files.file[0].path.lastIndexOf('\/') + 1);
        logger.info('Attached assigned fileName : ' + assignedFileName);

        let attachmentObject: AttachmentDetailsModel = new AttachmentDetailsModel();
        attachmentObject.fileName = files.file[0].originalFilename;
        attachmentObject.assignedFileName = assignedFileName;
        callback(null, attachmentObject);
      }
    });
  }

  uploadFile(costHeadList: Array<CostHead>, costHeadId: number, categoryId: number, workItemId: number,
             ccWorkItemId: number, attachmentObject: AttachmentDetailsModel) {
    let costHead = costHeadList.filter(function (currentCostHead: CostHead) {
      return currentCostHead.rateAnalysisId === costHeadId;
    });
    let categories = costHead[0].categories;
    let category = categories.filter(function (currentCategory: Category) {
      return currentCategory.rateAnalysisId === categoryId;
    });
    let workItems = category[0].workItems;
    let workItem = workItems.filter(function (currentWorkItem: WorkItem) {
      if (currentWorkItem.rateAnalysisId === workItemId && currentWorkItem.workItemId === ccWorkItemId) {
        currentWorkItem.attachmentDetails.push(attachmentObject);
      }
      return;
    });
    return costHeadList;
  }

  getPresentFilesForBuildingWorkItem(projectId: string, buildingId: string, costHeadId: number, categoryId: number,
                                     workItemId: number, ccWorkItemId: number, callback: (error: any, result: any) => void) {
    logger.info('Project service, getPresentFilesForBuildingWorkItem has been hit');
    let projection = {costHeads: 1};
    this.buildingRepository.findByIdWithProjection(buildingId, projection, (error, building) => {
      if (error) {
        callback(error, null);
      } else {
        let costHeadList = building.costHeads;
        let attachmentList = this.getPresentFiles(costHeadList, costHeadId, categoryId, workItemId, ccWorkItemId);
        callback(null, {data: attachmentList});
      }
    });
  }

  getPresentFiles(costHeadList: Array<CostHead>, costHeadId: number, categoryId: number, workItemId: number, ccWorkItemId: number) {

    let attachmentList = new Array<AttachmentDetailsModel>();
    let costHead = costHeadList.filter(function (currentCostHead: CostHead) {
      return currentCostHead.rateAnalysisId === costHeadId;
    });
    let categories = costHead[0].categories;
    let category = categories.filter(function (currentCategory: Category) {
      return currentCategory.rateAnalysisId === categoryId;
    });
    let workItems = category[0].workItems;
    let workItem = workItems.filter(function (currentWorkItem: WorkItem) {
      return (currentWorkItem.rateAnalysisId === workItemId && currentWorkItem.workItemId === ccWorkItemId);
    });
    attachmentList = workItem[0].attachmentDetails;
    return attachmentList;
  }

  removeAttachmentOfBuildingWorkItem(projectId: string, buildingId: string, costHeadId: number, categoryId: number, workItemId: number,
                                     ccWorkItemId: number, assignedFileName: any, callback: (error: any, result: any) => void) {
    logger.info('Project service, removeAttachmentOfBuildingWorkItem has been hit');
    let projection = {costHeads: 1};
    this.buildingRepository.findByIdWithProjection(buildingId, projection, (error, building) => {
      if (error) {
        callback(error, null);
      } else {
        let costHeadList = building.costHeads;
        this.deleteFile(costHeadList, costHeadId, categoryId, workItemId, ccWorkItemId, assignedFileName);

        let query = {_id: buildingId};
        let data = {$set: {'costHeads': building.costHeads}};
        this.buildingRepository.findOneAndUpdate(query, data, {new: true}, (error, building) => {
          logger.info('Project service, findOneAndUpdate has been hit');
          if (error) {
            callback(error, null);
          } else {
            fs.unlink('.' + config.get('application.attachmentPath') + '/' + assignedFileName, (err: Error) => {
              if (err) {
                callback(error, null);
              } else {
                callback(null, {data: 'success'});
              }
            });
          }
        });
      }
    });
  }


  deleteFile(costHeadList: any, costHeadId: number, categoryId: number, workItemId: number, ccWorkItemId: number, assignedFileName: any) {

    let costHead = costHeadList.filter(function (currentCostHead: CostHead) {
      return currentCostHead.rateAnalysisId === costHeadId;
    });
    let categories = costHead[0].categories;
    let category = categories.filter(function (currentCategory: Category) {
      return currentCategory.rateAnalysisId === categoryId;
    });
    let workItems = category[0].workItems;
    let workItem = workItems.filter(function (currentWorkItem: WorkItem) {
      if (currentWorkItem.rateAnalysisId === workItemId && currentWorkItem.workItemId === ccWorkItemId) {
        let attachmentList = currentWorkItem.attachmentDetails;
        for (let fileIndex in attachmentList) {
          if (attachmentList[fileIndex].assignedFileName === assignedFileName) {
            attachmentList.splice(parseInt(fileIndex), 1);
            break;
          }
        }
      }
      return;
    });
  }

  addAttachmentToProjectWorkItem(projectId: string, costHeadId: number, categoryId: number, workItemId: number,
                                 ccWorkItemId: number, fileData: any, callback: (error: any, result: any) => void) {
    this.addAttachment(fileData, (error: any, attachmentObject: AttachmentDetailsModel) => {
      if (error) {
        callback(error, null);
      } else {
        let projection = {projectCostHeads: 1};
        this.projectRepository.findByIdWithProjection(projectId, projection, (error, project) => {
          if (error) {
            callback(error, null);
          } else {
            let costHeadList = project.projectCostHeads;
            let projectCostHeads = this.uploadFile(costHeadList, costHeadId, categoryId, workItemId, ccWorkItemId, attachmentObject);
            let query = {_id: projectId};
            let updateData = {$set: {'projectCostHeads': projectCostHeads}};
            this.projectRepository.findOneAndUpdate(query, updateData, {new: true}, (error, response) => {
              if (error) {
                callback(error, null);
              } else {
                callback(null, {data: 'success'});
              }
            });
          }
        });
      }
    });
  }

  getPresentFilesForProjectWorkItem(projectId: string, costHeadId: number, categoryId: number, workItemId: number,
                                    ccWorkItemId: number, callback: (error: any, result: any) => void) {
    logger.info('Project service, getPresentFilesForProjectWorkItem has been hit');
    let projection = {projectCostHeads: 1};
    this.projectRepository.findByIdWithProjection(projectId, projection, (error, project) => {
      if (error) {
        callback(error, null);
      } else {
        let costHeadList = project.projectCostHeads;
        let attachmentList = this.getPresentFiles(costHeadList, costHeadId, categoryId, workItemId, ccWorkItemId);
        callback(null, {data: attachmentList});
      }
    });
  }

  removeAttachmentOfProjectWorkItem(projectId: string, costHeadId: number, categoryId: number, workItemId: number,
                                    ccWorkItemId: number, assignedFileName: any, callback: (error: any, result: any) => void) {
    logger.info('Project service, removeAttachmentOfProjectWorkItem has been hit');
    let projection = {projectCostHeads: 1};
    this.projectRepository.findByIdWithProjection(projectId, projection, (error, project) => {
      if (error) {
        callback(error, null);
      } else {
        let costHeadList = project.projectCostHeads;
        this.deleteFile(costHeadList, costHeadId, categoryId, workItemId, ccWorkItemId, assignedFileName);

        let query = {_id: projectId};
        let data = {$set: {'projectCostHeads': project.projectCostHeads}};
        this.projectRepository.findOneAndUpdate(query, data, {new: true}, (error, project) => {
          logger.info('Project service, findOneAndUpdate has been hit');
          if (error) {
            callback(error, null);
          } else {
            fs.unlink('.' + config.get('application.attachmentPath') + '/' + assignedFileName, (err: Error) => {
              if (err) {
                callback(error, null);
              }
            });
            callback(null, {data: 'success'});
          }
        });
      }
    });
  }

  removeImageOfProject(projectId: string, imageName: string, callback: (error: any, result: any) => void) {
    let query = {'_id': projectId};
    let updateData = {$unset: {projectImage: ''}};
    this.projectRepository.findOneAndUpdate(query, updateData, {}, (error, response) => {
      if (error) {
        callback(error, null);
      } else {
        fs.unlink('.' + config.get('application.profilePath') + '/' + imageName, (err: Error) => {
          if (err) {
            logger.error(err);
          }
        });
        callback(null, true);
      }
    });
  }

  updateProjectImage(projectId: string, imageName: string, oldImageName: string, callback: (error: any, result: any) => void) {
    let query = {'_id': projectId};
    let updateData = {$set: {projectImage: imageName}};
    this.projectRepository.findOneAndUpdate(query, updateData, {}, (error, response) => {
      if (error) {
        callback(error, null);
      } else {
        if (oldImageName && oldImageName !== 'newUser') {
          fs.unlink('.' + config.get('application.profilePath') + '/' + oldImageName, (err: Error) => {
            if (err) {
              logger.error(err);
            }
          });
        }
        callback(null, true);
      }
    });
  }

  UploadImage(tempPath: any, fileName: any, cb: any) {
    let targetpath = fileName;
    fs.rename(tempPath, targetpath, function (err: any) {
      cb(null, tempPath);
    });
  }

  importGstData(callback: (error: any, result: any) => void) {
    logger.info('Project service, exportGstData has been hit');
    let fileNameOfGstItems = path.resolve() + config.get('application.exportFilePathServer')
      + config.get('application.exportedFileNames.gstItems');

    let readGstItemsFromFile = this.readGstItemsFromFile(fileNameOfGstItems);
    readGstItemsFromFile.then(function (arrayOfItemGst: Array<ItemGst>) {
      if (arrayOfItemGst.length > 0) {
        let projectService = new ProjectService();
        projectService.saveGstData(arrayOfItemGst, (error: any, result: any) => {
          if (error) {
            console.log('Error : ' + JSON.stringify(error));
            callback(error, null);
          } else {
            console.log('Result : ' + JSON.stringify(result));
            callback(null, result);
          }
        });
      }
    });

  }

  readGstItemsFromFile(pathOfFile: string) {
    return new CCPromise(function (resolve: any, reject: any) {
      xlsxj({
        input: pathOfFile,
        output: null
      }, (err: any, result: any) => {
        if (err) {
          reject(err);
        } else {
          if (result.length > 0) {
            resolve(result);
          }
        }
      });
    }).catch(function (e: any) {
      logger.error('creating Promise for file read has been hit : ' + pathOfFile + ':\n error :' + JSON.stringify(e.message));
      CCPromise.reject(e.message);
    });
  }

  saveGstData(arrayOfItemGst: Array<ItemGst>, callback: (error: any, result: any) => void) {
    this.itemGstRepository.insertMany(arrayOfItemGst, (err: any, response: any) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, response);
      }
    });
  }

  private calculateThumbRuleReportForCostHead(budgetedCostAmount: number, costHeadFromRateAnalysis: any,
                                              buildingData: any, costHeads: Array<CostHead>) {
    if (budgetedCostAmount >= 0) {
      logger.info('Project service, calculateThumbRuleReportForCostHead has been hit');

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
    if (budgetedCostAmount >= 0) {
      logger.info('Project service, calculateThumbRuleReportForProjectCostHead has been hit');

      let calculateProjectData = 'SELECT ROUND(SUM(building.totalCarpetAreaOfUnit),2) AS totalCarpetArea, ' +
        'ROUND(SUM(building.totalSlabArea),2) AS totalSlabAreaProject,' +
        'ROUND(SUM(building.totalSaleableAreaOfUnit),2) AS totalSaleableArea  FROM ? AS building';
      let projectData = alasql(calculateProjectData, [projectDetails.buildings]);
      let totalSlabAreaOfProject: number = projectData[0].totalSlabAreaProject;
      let totalSaleableAreaOfProject: number = projectData[0].totalSaleableArea;
      let totalCarpetAreaOfProject: number = projectData[0].totalCarpetArea;

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
    logger.info('Project service, calculateThumbRuleRateForArea has been hit');
    let budgetCostRates = new BudgetCostRates();
    budgetCostRates.sqft = (budgetedCostAmount / area);
    budgetCostRates.sqmt = (budgetCostRates.sqft * config.get(Constants.SQUARE_METER));
    return budgetCostRates;
  }

  private clonedWorkitemWithRateAnalysis(workItem: WorkItem, workItemAggregateData: any) {

    for (let aggregateData of workItemAggregateData) {
      if (workItem.rateAnalysisId === aggregateData.workItem.rateAnalysisId) {
        workItem.rate = aggregateData.workItem.rate;
        break;
      }
    }
  }

  //Update GST of building workitems
  updateGstOfBuildingWorkItems(projectId: string, buildingId: string, costHeadId: number, categoryId: number, workItemId: number,
                               ccWorkItemId: number, gst: number, user: User, callback: (error: any, result: any) => void) {
    logger.info('Project service, updateGstOfBuildingWorkItems has been hit');
    let query = {_id: buildingId};
    let updateQuery = {$set: {'costHeads.$[costHead].categories.$[category].workItems.$[workItem].gst': gst}};
    let arrayFilter = [
      {'costHead.rateAnalysisId': costHeadId},
      {'category.rateAnalysisId': categoryId},
      {'workItem.rateAnalysisId': workItemId, 'workItem.workItemId': ccWorkItemId}
    ];
    this.buildingRepository.findOneAndUpdate(query, updateQuery, {
      arrayFilters: arrayFilter,
      new: true
    }, (error, building) => {
      logger.info('Project service, findOneAndUpdate has been hit');
      if (error) {
        callback(error, null);
      } else {
        callback(null, {data: 'success', access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  updateGstOfProjectWorkItems(projectId: string, costHeadId: number, categoryId: number, workItemId: number,
                              ccWorkItemId: number, gst: number, user: User, callback: (error: any, result: any) => void) {
    logger.info('Project service, updateGstOfProjectWorkItems has been hit');
    let query = {_id: projectId};
    let updateQuery = {$set: {'projectCostHeads.$[costHead].categories.$[category].workItems.$[workItem].gst': gst}};

    let arrayFilter = [
      {'costHead.rateAnalysisId': costHeadId},
      {'category.rateAnalysisId': categoryId},
      {'workItem.rateAnalysisId': workItemId, 'workItem.workItemId': ccWorkItemId}
    ];
    this.projectRepository.findOneAndUpdate(query, updateQuery, {
      arrayFilters: arrayFilter,
      new: true
    }, (error, building) => {
      logger.info('Project service, findOneAndUpdate has been hit');
      if (error) {
        callback(error, null);
      } else {
        callback(null, {data: 'success', access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  copyProject(sourceEmail: string, destEmail: string, oldProjectName: string, newProjectName: string, buildingArray: Array<any>, callback: (error: any, result: any) => void) {
    let query = {'email': sourceEmail,'typeOfApp':{$exists:false}};
    this.userRepository.retrieve(query, (error, users) => {
      logger.info('RateAnalysis service, find User has been hit');
      if (error) {
        callback(error, null);
      } else if (users.length > 0) {
        let arrayOfProjectId = this.getArrayOfProjectId(users);
        let query = {_id: {$in: arrayOfProjectId}};
        this.projectRepository.find(query, (error, projects) => {
          if (error) {
            callback(error, null);
          } else if (projects.length > 0) {
            let project = projects.filter(function (project: any) {
              if (project.name == oldProjectName) {
                return project;
              }
            });
            if (project.length > 0) {
              let buildings = project[0].buildings;
              let query = {_id: {$in: buildings}};
              this.buildingRepository.find(query, (error, buildingData) => {
                if (error) {
                  callback(error, null);
                } else if (buildingData.length > 0) {
                  let arrayOfBuildingDetails = new Array();
                  let newBuildingName = "";
                  if(buildingArray.length > 0) {
                    for (let buildingName of buildingArray) {
                      let building = buildingData.filter(function (building: any) {
                        if (building.name == buildingName) {
                          return building;
                        }
                      });
                      if(building.length > 0) {
                        let buildingDetails = this.createCopyOfBuilding(building[0], newBuildingName);
                        arrayOfBuildingDetails.push(buildingDetails);
                      }
                      else{
                        callback(null,"Building not found");
                      }
                    }
                  }else{
                    for (let building of buildingData) {
                    let buildingDetails = this.createCopyOfBuilding(building, newBuildingName);
                    arrayOfBuildingDetails.push(buildingDetails);
                    }
                  }
                  let arrayOfNewBuldingId = new Array();
                    this.buildingRepository.insertMany(arrayOfBuildingDetails, (error, result) => {
                      if (error) {
                        callback(error, null);
                      } else if (result.length > 0) {
                        for (let building of result) {
                          arrayOfNewBuldingId.push(building._id);
                        }
                        let projectDetails = this.createCopyOfProject(project[0], arrayOfNewBuldingId, newProjectName);
                        this.createCopyOfProjectAndSubscription(projectDetails, users, project, destEmail, (error: any, result: any) => {
                          if (error) {
                            callback(error, null);
                          } else {
                            callback(null, result);
                          }
                        });
                      }
                    });
                } else {
                  let arrayOfNewBuildingId = null;
                  let projectDetails = this.createCopyOfProject(project[0], arrayOfNewBuildingId, newProjectName);
                  this.createCopyOfProjectAndSubscription(projectDetails, users, project, destEmail, (error: any, result: any) => {
                    if (error) {
                      callback(error, null);
                    } else {
                      callback(null, Constants.PROJECT_COPIED_SUCCESSFULLY);
                    }
                  });
                }
              });
            } else {
              callback(null, Constants.PROJECT_NOT_FOUND);
            }
          }
        });
      } else {
        callback(null, Constants.SOURCE_USER_NOT_FOUND);
      }
    });
  }

  createCopyOfProjectAndSubscription(projectDetails: any, users: any, project: any, destEmail: any, callback: (error: any, result: any) => void) {
    this.projectRepository.create(projectDetails, (error, res) => {
      if (error) {
        callback(error, null);
      } else {
        let projectSubscription = users[0].subscription;
        let project_Id = project[0]._id;
        for (let subscription of projectSubscription) {
          if (subscription.projectId[0].equals(project_Id)) {
            let copyOfSubscription = this.createCopyOfSubscription(res._id, subscription);
            let updateQuery = {'email': destEmail,'typeOfApp':{$exists:false}};
            let newData = {
              $push: {
                'project': res._id,
                'subscription': copyOfSubscription
              }
            };
            this.userRepository.findOneAndUpdate(updateQuery, newData, {new: true}, (err, response) => {
              if (err) {
                callback(err, null);
              } else {
                if (response !== null) {
                  callback(null,Constants.PROJECT_COPIED_SUCCESSFULLY);
                } else {
                  callback(null,Constants.DEST_USER_NOT_FOUND);
                }
              }
            });
          }
        }
      }
    });
  }

  createCopyOfBuilding(building: any, newBuildingName: any) {
    let buildings = new BuildingModel();
    if (newBuildingName.trim() !== "") {
      buildings.name = newBuildingName;
    } else {
      buildings.name = building.name;
    }
    buildings.totalSlabArea = building.totalSlabArea;
    buildings.totalCarpetAreaOfUnit = building.totalCarpetAreaOfUnit;
    buildings.totalSaleableAreaOfUnit = building.totalSaleableAreaOfUnit;
    buildings.plinthArea = building.plinthArea;
    buildings.totalNumOfFloors = building.totalNumOfFloors;
    buildings.numOfParkingFloors = building.numOfParkingFloors;
    buildings.carpetAreaOfParking = building.carpetAreaOfParking;
    buildings.numOfOneBHK = building.numOfOneBHK;
    buildings.numOfTwoBHK = building.numOfTwoBHK;
    buildings.numOfThreeBHK = building.numOfThreeBHK;
    buildings.numOfFourBHK = building.numOfFourBHK;
    buildings.numOfFiveBHK = building.numOfFiveBHK;
    buildings.numOfLifts = building.numOfLifts;
    buildings.costHeads = building.costHeads;
    buildings.rates = building.rates;
    return buildings;
  }

  createCopyOfProject(project: any, arrayOfNewBuldingId: any, projectname: any) {
    let projects = new ProjectModel();
    let emptyArray: Array<any> = new Array();
    if (projectname.trim() !== "") {
      projects.name = projectname;
    } else {
      projects.name = project.name;
    }
    projects.region = project.region;
    projects.plotArea = project.plotArea;
    projects.plotPeriphery = project.plotPeriphery;
    projects.podiumArea = project.podiumArea;
    projects.openSpace = project.openSpace;
    projects.slabArea = project.slabArea;
    projects.poolCapacity = project.poolCapacity;
    projects.projectDuration = project.projectDuration;
    projects.activeStatus = project.activeStatus;
    projects.rates = project.rates;
    projects.projectCostHeads = project.projectCostHeads;
    if (arrayOfNewBuldingId != null) {
      projects.buildings = arrayOfNewBuldingId;
    } else {
      projects.buildings = emptyArray;
    }
    return projects;
  }

  createCopyOfSubscription(projectId: any, sub: any) {
    let id: Array<any> = new Array();
    id.push(projectId);
    let subscription = new UserSubscription();
    subscription.activationDate = sub.activationDate;
    subscription.numOfBuildings = sub.numOfBuildings;
    subscription.numOfProjects = sub.numOfProjects;
    subscription.validity = sub.validity;
    subscription.projectId = id;
    subscription.purchased = sub.purchased;
    return subscription;
  }

  getArrayOfProjectId(user: any) {
    let projectSubscription = user[0].subscription;
    let projectId = 'SEARCH /projectId FROM ?';
    let arrayOfProject = alasql(projectId, [projectSubscription]);
    let projects = 'SEARCH // FROM ?';
    let arrayOfProjectId = alasql(projects, [arrayOfProject]);
    return arrayOfProjectId;
  }

  copyBuilding(sourceEmail: string, destEmail: string, sourceProjectName: string, destProjectName: string, oldBuildingName: string, newBuildingName: string, callback: (error: any, result: any) => void) {
    this.getProject(sourceEmail,(error:any,projects:any) => {
    if(error){
      callback(error,null);
    }else {
      if (projects == Constants.USER_NOT_FOUND) {
        callback(null, Constants.SOURCE_USER_NOT_FOUND);
      } else if (projects.length > 0) {
        let sourceProject = projects.filter(function (project: any) {
          if (project.name == sourceProjectName) {
            return project;
          }
        });
        if (sourceProject.length > 0) {
          let buildings = sourceProject[0].buildings;
          let query = {_id: {$in: buildings}};
          this.buildingRepository.find(query, (error, buildingData) => {
            if (error) {
              callback(error, null);
            } else if (buildingData.length > 0) {
              let building = buildingData.filter(function (building: any) {
                if (building.name == oldBuildingName) {
                  return building;
                }
              });
              if (building.length > 0) {
                this.getProject(destEmail, (error, projects) => {
                  if (error) {
                    callback(error, null);
                  } else if (projects == Constants.USER_NOT_FOUND) {
                    callback(null, Constants.DEST_USER_NOT_FOUND);
                  } else if (projects.length > 0) {
                    let destProject = projects.filter(function (project: any) {
                      if (project.name == destProjectName) {
                        return project;
                      }
                    });
                    if (destProject.length > 0) {
                      let copyOfBuilding: any = this.createCopyOfBuilding(building[0], newBuildingName);
                      this.buildingRepository.create(copyOfBuilding, (error, result) => {
                        if (error) {
                          callback(error, null);
                        } else {
                          let count = destProject[0].buildings.length;
                          if (count < 5) {
                            let query = {'_id': destProject[0]._id};
                            let newData = {$push: {buildings: result._id}};
                            this.projectRepository.findOneAndUpdate(query, newData, {new: true}, (error, result) => {
                              if (error) {
                                callback(error, null);
                              } else {
                                callback(null, Constants.BUILDING_COPIED_SUCCESSFULLY)
                              }
                            });
                          } else {
                            callback(null, Constants.GET_SUBSCRIPTION_FOR_BUILDING);
                          }
                        }
                      });
                    } else {
                      callback(null, Constants.DEST_PROJECT_NOT_FOUND);
                    }
                  }
                });
              } else {
                callback(null, Constants.SOURCE_BUILDING_NOT_FOUND);
              }
            }
          });
        } else {
          callback(null, Constants.SOURCE_PROJECT_NOT_FOUND);
        }
      }else {
        callback(null, Constants.PROJECT_NOT_FOUND);
      }
    }
        });
  }

  getProject(email: any, callback: (error: any, result: any) => void) {
    let query = {'email': email};
    this.userRepository.retrieve(query, (error, users) => {
      logger.info('RateAnalysis service, find User has been hit');
      if (error) {
        callback(error, null);
      }else if (users.length > 0) {
        let arrayOfProjectId = this.getArrayOfProjectId(users);
        let query = {_id: {$in: arrayOfProjectId}};
        this.projectRepository.find(query, (error, projects) => {
          if (error) {
            callback(error, null);
          }else{
            callback(null,projects);
          }
        });
      }else{
        return callback(null,Constants.USER_NOT_FOUND);
      }
    });
  }
}

/*Object.seal(ProjectService);
export = ProjectService;*/
