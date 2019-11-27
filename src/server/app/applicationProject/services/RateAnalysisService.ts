import UserService = require('./../../framework/services/UserService');
import ProjectAsset = require('../../framework/shared/projectasset');
import User = require('../../framework/dataaccess/mongoose/user');
import AuthInterceptor = require('../../framework/interceptor/auth.interceptor');
import CostControllException = require('../exception/CostControllException');
import WorkItem = require('../dataaccess/model/project/building/WorkItem');
import alasql = require('alasql');
import Rate = require('../dataaccess/model/project/building/Rate');
import CostHead = require('../dataaccess/model/project/building/CostHead');
import Category = require('../dataaccess/model/project/building/Category');
import Quantity = require('../dataaccess/model/project/building/Quantity');

import Constants = require('../shared/constants');
import RateAnalysisRepository = require('../dataaccess/repository/RateAnalysisRepository');
import RateAnalysis = require('../dataaccess/model/RateAnalysis/RateAnalysis');
import { AttachmentDetailsModel } from '../dataaccess/model/project/building/AttachmentDetails';
import messages  = require('../../applicationProject/shared/messages');
import RACategory = require('../dataaccess/model/RateAnalysis/RACategory');
import RAWorkItem = require('../dataaccess/model/RateAnalysis/RAWorkItem');
import RACostHead = require('../dataaccess/model/RateAnalysis/RACostHead');
import SavedRateRepository = require('../dataaccess/repository/SavedRateRepository');
import RASavedRate = require('../dataaccess/model/RateAnalysis/RASavedRate');
import BuildingRepository = require('../dataaccess/repository/BuildingRepository');
import UserRepository = require('../../framework/dataaccess/repository/UserRepository');
import ProjectRepository = require('../dataaccess/repository/ProjectRepository');
import { ProjectService } from './ProjectService';
import ConfigWorkItem = require('../dataaccess/model/project/building/ConfigWorkItem');
import ItemGstRepository = require('../dataaccess/repository/ItemGstRepository');
import RateItem = require('../dataaccess/model/project/building/RateItem');
import ItemGst = require('../dataaccess/model/RateAnalysis/ItemGst');
//var ProjectService = require('./ProjectService');
let request = require('request');
let config = require('config');
var log4js = require('log4js');
var logger = log4js.getLogger('Rate Analysis Service');
const Json2csvParser = require('json2csv').Parser;
var fs = require('fs');
let path = require('path');
let xlsxj = require('xlsx-to-json');
let CCPromise = require('promise/lib/es6-extensions');

class RateAnalysisService {
  APP_NAME: string;
  company_name: string;
  private authInterceptor: AuthInterceptor;
  private userService: UserService;
  private rateAnalysisRepository: RateAnalysisRepository;
  private buildingRepository: BuildingRepository;
  private savedRateRepository : SavedRateRepository;
  private userRepository : UserRepository;
  private projectRepository :ProjectRepository;
  private projectService : ProjectService;
  private itemGstRepository : ItemGstRepository;

  constructor() {
    this.APP_NAME = ProjectAsset.APP_NAME;
    this.authInterceptor = new AuthInterceptor();
    this.userService = new UserService();
    this.rateAnalysisRepository = new RateAnalysisRepository();
    this.savedRateRepository = new SavedRateRepository();
    this.buildingRepository = new BuildingRepository();
    this.userRepository = new UserRepository();
    this.projectRepository = new ProjectRepository();
    this.projectService = new ProjectService();
    this.itemGstRepository = new ItemGstRepository();
  }

  getCostHeads(url: string, user: User, callback: (error: any, result: any) => void) {
    logger.info('Rate Analysis Service, getCostHeads has been hit');
    request.get({url: url}, function (error: any, response: any, body: any) {
      if (error || (!error && response.statusCode !== 200) ) {
        if(!error && response.statusCode !== 200) {
          callback('Get cost Heads response NOT FOUND', null);
        }
        callback(error, null);
      } else if (!error && response) {
        console.log('RESPONSE JSON : ' + JSON.stringify(JSON.parse(body)));
        let res = JSON.parse(body);
        callback(null, res);
      }
    });
  }

  getWorkItems(url: string, user: User, callback: (error: any, result: any) => void) {
    logger.info('Rate Analysis Service, getWorkItems has been hit');
    request.get({url: url}, function (error: any, response: any, body: any) {
      if (error || (!error && response.statusCode !== 200)) {
        if(!error && response.statusCode !== 200) {
          callback('Get work items response NOT FOUND', null);
        }
        callback(error, null);
      } else if (!error && response) {
        let res = JSON.parse(body);
        callback(null, res);
      }
    });
  }

  getWorkItemsByCostHeadId(url: string, costHeadId: string, user: User, callback: (error: any, result: any) => void) {
    logger.info('Rate Analysis Service, getWorkItemsByCostHeadId has been hit');
    let workItems: Array<WorkItem> = [];
    request.get({url: url}, function (error: any, response: any, body: any) {
      if (error || (!error && response.statusCode !== 200)) {
        if(!error && response.statusCode !== 200) {
          callback('Get work items by cost Head NOT FOUND', null);
        }
        callback(error, null);
      } else if (!error && response) {
        let res = JSON.parse(body);
        if (res) {

          for (let workitem of res.SubItemType) {
            if (parseInt(costHeadId) === workitem.C3) {
              let workitemDetails = new WorkItem(workitem.C2, workitem.C1);
              workItems.push(workitemDetails);
            }
          }
        }
        callback(null, workItems);
      }
    });
  }

  getApiCall(url: string, callback: (error: any, response: any) => void) {
    logger.info('getApiCall for rateAnalysis has bee hit for url : ' + url);
    request.get({url: url}, function (error: any, response: any, body: any) {
      if (error) {
        callback(new CostControllException(error.message, error.stack), null);
      } else if (!error && response) {
        try {
          if (response.statusCode === 200) {
            let res = JSON.parse(body);
            callback(null, res);
          } else {
            let error = new Error();
            error.message = 'Unable to make a get request for url : ' + url;
            callback(error, null);
          }
        } catch (err) {
          logger.error('Promise failed for individual ! url:' + url + ':\n error :' + JSON.stringify(err.message));
        }
      }
    });
  }

  getRate(workItemId: number, callback: (error: any, data: any) => void) {
    let url = config.get('rateAnalysisAPI.unit');
    this.getApiCall(url, (error, unitData) => {
      if (error) {
        callback(error, null);
      } else {
        unitData = unitData['UOM'];
        url = config.get('rateAnalysisAPI.rate');
        this.getApiCall(url, (error, data) => {
          if (error) {
            callback(error, null);
          } else {
            let rate = data['RateAnalysisData'];
            let sql = 'SELECT rate.C5 AS quantity, unit.C2 As unit FROM ? AS rate JOIN ? AS unit on unit.C1 =  rate.C8 and' +
              ' rate.C1 = ' + workItemId;
            let sql2 = 'SELECT rate.C1 AS rateAnalysisId, rate.C2 AS itemName,ROUND(rate.C7,2) AS quantity,ROUND(rate.C3,2) AS rate,' +
              ' ROUND(rate.C3*rate.C7,2) AS totalAmount, rate.C6 type, unit.C2 As unit FROM ? AS rate JOIN ? AS unit ON unit.C1 = rate.C9' +
              '  WHERE rate.C1 = ' + workItemId;
            let sql3 = 'SELECT ROUND(SUM(rate.C3*rate.C7) / SUM(rate.C7),2) AS total  FROM ? AS rate JOIN ? AS unit ON unit.C1 = rate.C9' +
              '  WHERE rate.C1 = ' + workItemId;
            let quantityAndUnit = alasql(sql, [rate, unitData]);
            let rateResult: Rate = new Rate();
            let totalrateFromRateAnalysis = alasql(sql3, [rate, unitData]);
            rateResult.quantity = quantityAndUnit[0].quantity;
            rateResult.unit = quantityAndUnit[0].unit;
            rateResult.rateFromRateAnalysis = parseFloat((totalrateFromRateAnalysis[0].total).toFixed(2));
            rate = alasql(sql2, [rate, unitData]);
            rateResult.rateItems = rate;
            callback(null, rateResult);
          }

        });
      }
    });
  }

  //TODO : Delete API's related to workitems add, deleet, get list.
  getWorkitemList(costHeadId: number, categoryId: number, callback: (error: any, data: any) => void) {
    let url = config.get('rateAnalysisAPI.workitem');
    this.getApiCall(url, (error, workitem) => {
      if (error) {
        callback(error, null);
      } else {
        let sql: string = 'SELECT C2 AS rateAnalysisId, C3 AS name FROM ? WHERE C1 = ' + costHeadId + ' and C4 = ' + categoryId;
        if (categoryId === 0) {
          sql = 'SELECT C2 AS rateAnalysisId, C3 AS name FROM ? WHERE C1 = ' + costHeadId;
        }
        workitem = workitem['Items'];
        let workitemList = alasql(sql, [workitem]);
        callback(null, workitemList);
      }
    });
  }

  convertCostHeadsFromRateAnalysisToCostControl(entity: string, region: any, configCostHeads: Array<CostHead>,
                                                callback: (error: any, data: any) => void) {
    logger.info('convertCostHeadsFromRateAnalysisToCostControl has been hit');

    let costHeadURL = config.get(Constants.RATE_ANALYSIS_API + entity + Constants.RATE_ANALYSIS_COSTHEADS)
      + region.RegionId + config.get(Constants.RATE_ANALYSIS_API + Constants.RATE_ANALYSIS_API_ENDPOINT);
    let costHeadRateAnalysisPromise = this.createPromise(costHeadURL);
    logger.info('costHeadRateAnalysisPromise for has been hit');

    let categoryURL = config.get(Constants.RATE_ANALYSIS_API + entity + Constants.RATE_ANALYSIS_CATEGORIES)
      + region.RegionId + config.get(Constants.RATE_ANALYSIS_API + Constants.RATE_ANALYSIS_API_ENDPOINT);
    let categoryRateAnalysisPromise = this.createPromise(categoryURL);
    logger.info('categoryRateAnalysisPromise for has been hit');

    let workItemURL = config.get(Constants.RATE_ANALYSIS_API + entity + Constants.RATE_ANALYSIS_WORKITEMS)
      + region.RegionId + config.get(Constants.RATE_ANALYSIS_API + Constants.RATE_ANALYSIS_API_ENDPOINT);
    let workItemRateAnalysisPromise = this.createPromise(workItemURL);
    logger.info('workItemRateAnalysisPromise for has been hit');

    let rateItemURL = config.get(Constants.RATE_ANALYSIS_API + entity + Constants.RATE_ANALYSIS_RATE)
      + region.RegionId + config.get(Constants.RATE_ANALYSIS_API + Constants.RATE_ANALYSIS_API_ENDPOINT);
    let rateItemRateAnalysisPromise = this.createPromise(rateItemURL);
    logger.info('rateItemRateAnalysisPromise for has been hit');

    let rateAnalysisNotesURL = config.get(Constants.RATE_ANALYSIS_API + entity + Constants.RATE_ANALYSIS_NOTES)
      + region.RegionId + config.get(Constants.RATE_ANALYSIS_API + Constants.RATE_ANALYSIS_API_ENDPOINT);
    let notesRateAnalysisPromise = this.createPromise(rateAnalysisNotesURL);
    logger.info('notesRateAnalysisPromise for has been hit');

    let allUnitsFromRateAnalysisURL = config.get(Constants.RATE_ANALYSIS_API + entity + Constants.RATE_ANALYSIS_UNIT)
      + region.RegionId + config.get(Constants.RATE_ANALYSIS_API + Constants.RATE_ANALYSIS_API_ENDPOINT);
    let unitsRateAnalysisPromise = this.createPromise(allUnitsFromRateAnalysisURL);
    logger.info('unitsRateAnalysisPromise for has been hit');

    let contractorAddOnsFromRateAnalysisURL = config.get(Constants.RATE_ANALYSIS_API + Constants.START_POINT)
      + config.get(Constants.RATE_ANALYSIS_API + Constants.RATE_ANALYSIS_CONTRACTOR_ADD_ONS)
      + config.get(Constants.RATE_ANALYSIS_API + Constants.RA_CONTRACTOR_API_ENDPOINT);
    let contractorAddOnsFromRateAnalysisPromise = this.createPromise(contractorAddOnsFromRateAnalysisURL);
    logger.info('contractorAddOnsFromRateAnalysisPromise for has been hit');

    let rateAnalysisRegionResultFromRateAnalysisURL = config.get(Constants.RATE_ANALYSIS_API + Constants.START_POINT)
      + config.get(Constants.RATE_ANALYSIS_API + Constants.RA_REGION_RESULT)
      + region.RegionId + config.get(Constants.RATE_ANALYSIS_API + Constants.RATE_ANALYSIS_API_ENDPOINT);
    let rateAnalysisRegionFromRateAnalysisPromise = this.createPromise(rateAnalysisRegionResultFromRateAnalysisURL);
    logger.info('contractorAddOnsFromRateAnalysisPromise for has been hit');

    let contractorAddOnResultURL = 'http://mobileapiv4.buildinfo.co.in/RAContractorAddons/RAContractorAddonsResult?' +
      'DeviceId=2fc85276aee45b7a&mobilenumber=8928520179&regionID=1&NeedFullData=y&AppCode=RA';
    let contractorAddOnResultPromise = this.createPromise(contractorAddOnResultURL);

    logger.info('calling Promise.all');
    CCPromise.all([
      costHeadRateAnalysisPromise,
      categoryRateAnalysisPromise,
      workItemRateAnalysisPromise,
      rateItemRateAnalysisPromise,
      notesRateAnalysisPromise,
      unitsRateAnalysisPromise,
      contractorAddOnsFromRateAnalysisPromise,
      contractorAddOnResultPromise
    ]).then(function (data: Array<any>) {
      logger.info('convertCostHeadsFromRateAnalysisToCostControl Promise.all API is success.');

      if(data[0][Constants.RATE_ANALYSIS_ITEM_TYPE] && data[1][Constants.RATE_ANALYSIS_SUBITEM_TYPE] &&
        data[2][Constants.RATE_ANALYSIS_ITEMS] && data[3][Constants.RATE_ANALYSIS_DATA] &&
        data[4][Constants.RATE_ANALYSIS_DATA] && data[5][Constants.RATE_ANALYSIS_UOM] &&
        data[6][Constants.CONTRACTING_ADD_ONS] && data[7][Constants.RATEANALYSIS_ADD_ON_DATA]) {

        let costHeadsRateAnalysis = data[0][Constants.RATE_ANALYSIS_ITEM_TYPE];
        let categoriesRateAnalysis = data[1][Constants.RATE_ANALYSIS_SUBITEM_TYPE];
        let workItemsRateAnalysis = data[2][Constants.RATE_ANALYSIS_ITEMS];
        let rateItemsRateAnalysis = data[3][Constants.RATE_ANALYSIS_DATA];
        let notesRateAnalysis = data[4][Constants.RATE_ANALYSIS_DATA];
        let unitsRateAnalysis = data[5][Constants.RATE_ANALYSIS_UOM];
        let contractingAddOns = data[6][Constants.CONTRACTING_ADD_ONS];
        let contractorAddOnResult = data[7][Constants.RATEANALYSIS_ADD_ON_DATA];

        let buildingCostHeads: Array<CostHead> = [];
        let rateAnalysisService = new RateAnalysisService();

        rateAnalysisService.getCostHeadsFromRateAnalysis(configCostHeads, costHeadsRateAnalysis, categoriesRateAnalysis, workItemsRateAnalysis,
          rateItemsRateAnalysis, unitsRateAnalysis, notesRateAnalysis, contractingAddOns, contractorAddOnResult, buildingCostHeads);
        logger.info('success in  convertCostHeadsFromRateAnalysisToCostControl.');
        callback(null, {
          'buildingCostHeads': buildingCostHeads,
          'rates': rateItemsRateAnalysis,
          'units': unitsRateAnalysis
        });

      }
    }).catch(function (e: any) {
      logger.error(' Promise failed for convertCostHeadsFromRateAnalysisToCostControl ! :' + JSON.stringify(e.message));
      CCPromise.reject(e.message);
    });
  }

  createPromise(url: string, region ?: any) {
    return new CCPromise(function (resolve: any, reject: any) {
      logger.info('createPromise has been hit for : ' + url);
      let rateAnalysisService = new RateAnalysisService();
      rateAnalysisService.getApiCall(url, (error: any, data: any) => {
        if (error) {
          console.log('Error in createPromise get data from rate analysis: ' + JSON.stringify(error));
          reject(error);
        } else {
          console.log('createPromise data from rate analysis success.');
          resolve(data);
        }
      });
    }).catch(() => this.sendEmailForSynchFailed(url, region));
    /*catch(function (e: any) {
      logger.error('Promise failed for individual ! url:' + url + ':\n error :' + JSON.stringify(e.message));
      CCPromise.reject(e.message);
    });*/
  }

  getCostHeadsFromRateAnalysis(configCostHeads: any, costHeadsRateAnalysis: any, categoriesRateAnalysis: any,
                               workItemsRateAnalysis: any, rateItemsRateAnalysis: any,
                               unitsRateAnalysis: any, notesRateAnalysis: any,
                               contractingAddOns: any, contractorAddOnResult: any,
                               buildingCostHeads: Array<CostHead>) {
    logger.info('getCostHeadsFromRateAnalysis has been hit.');
    //let budgetCostHeads = config.get('budgetedCostFormulae');
    for (let costHeadIndex = 0; costHeadIndex < costHeadsRateAnalysis.length; costHeadIndex++) {

      if (config.has('budgetedCostFormulae.' + costHeadsRateAnalysis[costHeadIndex].C2)) {
        let costHead = new CostHead();
        costHead.name = costHeadsRateAnalysis[costHeadIndex].C2;
        let categories = new Array<Category>();

        if (configCostHeads.length > 0) {
          let isCostHeadExistSQL = 'SELECT * FROM ? AS workitems WHERE TRIM(workitems.name)= ?';
          let costHeadExistArray = alasql(isCostHeadExistSQL, [configCostHeads, costHead.name]);
          if (costHeadExistArray.length !== 0) {
            costHead.priorityId = costHeadExistArray[0].priorityId;
            categories = costHeadExistArray[0].categories;
          }
        }
        costHead.rateAnalysisId = costHeadsRateAnalysis[costHeadIndex].C1;

        let categoriesRateAnalysisSQL = 'SELECT Category.C1 AS rateAnalysisId, Category.C2 AS name' +
          ' FROM ? AS Category where Category.C3 = ' + costHead.rateAnalysisId;

        let categoriesByCostHead = alasql(categoriesRateAnalysisSQL, [categoriesRateAnalysis]);
        let buildingCategories: Array<Category> = new Array<Category>();

        if (categoriesByCostHead.length === 0) {
          this.getWorkItemsWithoutCategoryFromRateAnalysis(costHead.rateAnalysisId, workItemsRateAnalysis,
            rateItemsRateAnalysis, unitsRateAnalysis, notesRateAnalysis,
            contractingAddOns, contractorAddOnResult, buildingCategories, categories);
        } else {
          this.getCategoriesFromRateAnalysis(categoriesByCostHead, workItemsRateAnalysis,
            rateItemsRateAnalysis, unitsRateAnalysis, notesRateAnalysis,
            contractingAddOns, contractorAddOnResult, buildingCategories, categories);
        }

        costHead.categories = buildingCategories;
        costHead.thumbRuleRate = config.get(Constants.THUMBRULE_RATE);
        buildingCostHeads.push(costHead);
      } else {
        console.log('CostHead Unavailaable : ' + costHeadsRateAnalysis[costHeadIndex].C2);
      }
    }
  }

  getCategoriesFromRateAnalysis(categoriesByCostHead: any, workItemsRateAnalysis: any,
                                rateItemsRateAnalysis: any, unitsRateAnalysis: any,
                                notesRateAnalysis: any, contractingAddOns: any, contractorAddOnResult: any,
                                buildingCategories: Array<Category>, configCategories: Array<Category>) {

    logger.info('getCategoriesFromRateAnalysis has been hit.');

    for (let categoryIndex = 0; categoryIndex < categoriesByCostHead.length; categoryIndex++) {

      let category = new Category(categoriesByCostHead[categoryIndex].name, categoriesByCostHead[categoryIndex].rateAnalysisId);
      let configWorkItems = new Array<WorkItem>();

      if (configCategories.length > 0) {
        for (let configCategory of configCategories) {
          if (configCategory.name === categoriesByCostHead[categoryIndex].name) {
            configWorkItems = configCategory.workItems;
          }
        }
      }

      let workItemsRateAnalysisSQL = 'SELECT workItem.C2 AS rateAnalysisId, TRIM(workItem.C3) AS name' +
        ' FROM ? AS workItem where workItem.C4 = ' + categoriesByCostHead[categoryIndex].rateAnalysisId;

      let workItemsByCategory = alasql(workItemsRateAnalysisSQL, [workItemsRateAnalysis]);
      let buildingWorkItems: Array<WorkItem> = new Array<WorkItem>();

      this.getWorkItemsFromRateAnalysis(workItemsByCategory, rateItemsRateAnalysis,
        unitsRateAnalysis, notesRateAnalysis, contractingAddOns,
        contractorAddOnResult, buildingWorkItems, configWorkItems, workItemsRateAnalysis);

      category.workItems = buildingWorkItems;
      if (category.workItems.length !== 0) {
        buildingCategories.push(category);
      }
    }

    if (configCategories.length > 0) {

      for (let configCategoryIndex = 0; configCategoryIndex < configCategories.length; configCategoryIndex++) {
        let isCategoryExistsSQL = 'SELECT * FROM ? AS workitems WHERE TRIM(workitems.name)= ?';
        let categoryExistsArray = alasql(isCategoryExistsSQL, [categoriesByCostHead, configCategories[configCategoryIndex].name]);
        if (categoryExistsArray.length === 0) {
          let configCat = new Category(configCategories[configCategoryIndex].name, configCategories[configCategoryIndex].rateAnalysisId);
          configCat.workItems = this.getWorkitemsForConfigCategory(configCategories[configCategoryIndex].workItems);
          if (configCat.workItems.length !== 0) {
            buildingCategories.push(configCat);
          }
        }
      }
    }
  }

  getWorkitemsForConfigCategory(configWorkitems: any) {
    let workItemsList = new Array<WorkItem>();
    for (let workitemIndex = 0; workitemIndex < configWorkitems.length; workitemIndex++) {
      let configWorkitem = this.convertConfigorkitem(configWorkitems[workitemIndex]);
      workItemsList.push(configWorkitem);
    }
    return workItemsList;
  }

  getWorkItemsWithoutCategoryFromRateAnalysis(costHeadRateAnalysisId: number, workItemsRateAnalysis: any,
                                              rateItemsRateAnalysis: any, unitsRateAnalysis: any,
                                              notesRateAnalysis: any, contractingAddOns: any, contractorAddOnResult: any,
                                              buildingCategories: Array<Category>, configCategories: Array<Category>) {

    logger.info('getWorkItemsWithoutCategoryFromRateAnalysis has been hit.');

    let workItemsWithoutCategoriesRateAnalysisSQL = 'SELECT workItem.C2 AS rateAnalysisId, workItem.C3 AS name' +
      ' FROM ? AS workItem where NOT workItem.C4 AND workItem.C1 = ' + costHeadRateAnalysisId;
    let workItemsWithoutCategories = alasql(workItemsWithoutCategoriesRateAnalysisSQL, [workItemsRateAnalysis]);

    let buildingWorkItems: Array<WorkItem> = new Array<WorkItem>();
    let category = new Category('Work Items', 0);
    let configWorkItems = new Array<WorkItem>();

    if (configCategories.length > 0) {
      for (let configCategory of configCategories) {
        if (configCategory.name === 'Work Items') {
          configWorkItems = configCategory.workItems;
        }
      }
    }

    this.getWorkItemsFromRateAnalysis(workItemsWithoutCategories, rateItemsRateAnalysis,
      unitsRateAnalysis, notesRateAnalysis, contractingAddOns, contractorAddOnResult,
      buildingWorkItems, configWorkItems, workItemsRateAnalysis);

    category.workItems = buildingWorkItems;
    buildingCategories.push(category);
  }

  syncRateitemFromRateAnalysis(entity: string, buildingDetails: any, callback: (error: any, data: any) => void) {

    let rateItemURL = config.get(Constants.RATE_ANALYSIS_API + entity + Constants.RATE_ANALYSIS_RATE);
    let rateItemRateAnalysisPromise = this.createPromise(rateItemURL);
    logger.info('rateItemRateAnalysisPromise for has been hit');

    let rateAnalysisNotesURL = config.get(Constants.RATE_ANALYSIS_API + entity + Constants.RATE_ANALYSIS_NOTES);
    let notesRateAnalysisPromise = this.createPromise(rateAnalysisNotesURL);
    logger.info('notesRateAnalysisPromise for has been hit');

    let allUnitsFromRateAnalysisURL = config.get(Constants.RATE_ANALYSIS_API + entity + Constants.RATE_ANALYSIS_UNIT);
    let unitsRateAnalysisPromise = this.createPromise(allUnitsFromRateAnalysisURL);
    logger.info('unitsRateAnalysisPromise for has been hit');

    let costHeadURL = config.get(Constants.RATE_ANALYSIS_API + entity + Constants.RATE_ANALYSIS_COSTHEADS);
    let costHeadRateAnalysisPromise = this.createPromise(costHeadURL);
    logger.info('costHeadRateAnalysisPromise for has been hit');

    CCPromise.all([
      rateItemRateAnalysisPromise,
      notesRateAnalysisPromise,
      unitsRateAnalysisPromise,
      costHeadRateAnalysisPromise
    ]).then(function (data: Array<any>) {
      logger.info('convertCostHeadsFromRateAnalysisToCostControl Promise.all API is success.');
      logger.info('success in  convertCostHeadsFromRateAnalysisToCostControl.');
      callback(null, data);
    }).catch(function (e: any) {
      logger.error(' Promise failed for convertCostHeadsFromRateAnalysisToCostControl ! :' + e.message);
      CCPromise.reject(e.message);
    });

  }

  getWorkItemsFromRateAnalysis(workItemsByCategory: any, rateItemsRateAnalysis: any,
                               unitsRateAnalysis: any, notesRateAnalysis: any, contractingAddOns: any, contractorAddOnResult: any,
                               buildingWorkItems: Array<WorkItem>, configWorkItems: Array<any>, workItemsRateAnalysis: any) {

    logger.info('getWorkItemsFromRateAnalysis has been hit.');
    for (let categoryWorkitem of workItemsByCategory) {
      let workItem = this.getRateAnalysis(categoryWorkitem, configWorkItems, rateItemsRateAnalysis,
        unitsRateAnalysis, notesRateAnalysis, contractingAddOns, contractorAddOnResult, workItemsRateAnalysis);
      if (workItem) {
        buildingWorkItems.push(workItem);
      }
    }
    for (let configWorkItem of configWorkItems) {
      let isWorkItemExistSQL = 'SELECT * FROM ? AS workitems WHERE TRIM(workitems.name)= ?';
      let workItemExistArray = alasql(isWorkItemExistSQL, [workItemsByCategory, configWorkItem.name]);
      if (workItemExistArray.length === 0 && configWorkItem.rateAnalysisId) {
        let workitem = this.convertConfigorkitem(configWorkItem);
        buildingWorkItems.push(workitem);
      }
    }
  }

  checkIfFreeVersion(workItem: any, liteWorkItemsList: Array<any>) {
    let isWorkItemExistSQL = 'SELECT * FROM ? AS liteWorkitems WHERE TRIM(liteWorkitems.ItemName)= ?';
    let workItemExistArray = alasql(isWorkItemExistSQL, [liteWorkItemsList, workItem.name]);
    if(workItemExistArray.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  convertConfigorkitem(configWorkItem: any) {

    let workItem = new WorkItem(configWorkItem.name, configWorkItem.rateAnalysisId);
    workItem.isDirectRate = !configWorkItem.isRateAnalysis;
    workItem.isRateAnalysis = configWorkItem.isRateAnalysis;
    workItem.isMeasurementSheet = configWorkItem.isMeasurementSheet;
    workItem.isSteelWorkItem = configWorkItem.isSteelWorkItem;
    workItem.rateAnalysisPerUnit = configWorkItem.rateAnalysisPerUnit;
    workItem.rateAnalysisUnit = configWorkItem.rateAnalysisUnit;
    workItem.isItemBreakdownRequired = configWorkItem.isItemBreakdownRequired;
    workItem.length = configWorkItem.length;
    workItem.breadthOrWidth = configWorkItem.breadthOrWidth;
    workItem.height = configWorkItem.height;
    workItem.unit = configWorkItem.measurementUnit;

    if (!configWorkItem.isRateAnalysis) {
      workItem.rate.total = configWorkItem.directRate;
      workItem.rate.unit = configWorkItem.directRatePerUnit;
      workItem.rate.isEstimated = true;
    } else {
      logger.error('WorkItem error for rateAnalysis : ' + configWorkItem.name);
    }

    return workItem;
  }

  getRateAnalysis(categoryWorkitem: WorkItem, configWorkItems: Array<any>, rateItemsRateAnalysis: any,
                  unitsRateAnalysis: any, notesRateAnalysis: any, contractingAddOns: any,
                  contractorAddOnResult: any, workItemsRateAnalysis: any) {

    let isWorkItemExistSQL = 'SELECT * FROM ? AS workitems WHERE TRIM(workitems.name)= ?';
    let workItemExistArray = alasql(isWorkItemExistSQL, [configWorkItems, categoryWorkitem.name]);

    if (workItemExistArray.length !== 0) {

      let workItem = new WorkItem(categoryWorkitem.name, categoryWorkitem.rateAnalysisId);

      if (categoryWorkitem.active !== undefined && categoryWorkitem.active !== null) {
        workItem = categoryWorkitem;
      }

      workItem.contractingAddOns = this.getContractingAddOns(categoryWorkitem.rateAnalysisId,
        rateItemsRateAnalysis, contractingAddOns, contractorAddOnResult);

      workItem.unit = workItemExistArray[0].measurementUnit;
      workItem.isMeasurementSheet = workItemExistArray[0].isMeasurementSheet;
      workItem.isRateAnalysis = workItemExistArray[0].isRateAnalysis;
      workItem.isSteelWorkItem = workItemExistArray[0].isSteelWorkItem;
      workItem.rateAnalysisPerUnit = workItemExistArray[0].rateAnalysisPerUnit;
      workItem.isItemBreakdownRequired = workItemExistArray[0].isItemBreakdownRequired;
      workItem.length = workItemExistArray[0].length;
      workItem.breadthOrWidth = workItemExistArray[0].breadthOrWidth;
      workItem.height = workItemExistArray[0].height;

      let rateItemsRateAnalysisSQL = 'SELECT rateItem.C2 AS itemName, rateItem.C2 AS originalItemName,' +
        'rateItem.C12 AS rateAnalysisId, rateItem.C6 AS type,' +
        'ROUND(rateItem.C7,2) AS quantity, ROUND(rateItem.C3,2) AS rate, unit.C2 AS unit,' +
        'ROUND(rateItem.C3 * rateItem.C7,2) AS totalAmount, rateItem.C5 AS totalQuantity, rateItem.C13 AS notesRateAnalysisId  ' +
        'FROM ? AS rateItem JOIN ? AS unit ON unit.C1 = rateItem.C9 where rateItem.C1 = '
        + categoryWorkitem.rateAnalysisId;
      let rateItemsByWorkItem = alasql(rateItemsRateAnalysisSQL, [rateItemsRateAnalysis, unitsRateAnalysis]);
      let notes = '';
      let imageURL = '';
      workItem.rate.rateItems = rateItemsByWorkItem;
      workItem.rate.unit = workItemExistArray[0].rateAnalysisUnit;

      if (rateItemsByWorkItem && rateItemsByWorkItem.length > 0) {
        let notesRateAnalysisSQL = 'SELECT notes.C2 AS notes, notes.C3 AS imageURL FROM ? AS notes where notes.C1 = ' +
          rateItemsByWorkItem[0].notesRateAnalysisId;
        let notesList = alasql(notesRateAnalysisSQL, [notesRateAnalysis]);
        notes = notesList[0].notes;
        imageURL = notesList[0].imageURL;

        workItem.rate.quantity = rateItemsByWorkItem[0].totalQuantity;
        workItem.systemRate.quantity = rateItemsByWorkItem[0].totalQuantity;
      } else {
        workItem.rate.quantity = 1;
        workItem.systemRate.quantity = 1;
      }
      workItem.rate.isEstimated = true;
      workItem.rate.notes = notes;
      workItem.rate.imageURL = imageURL;

      //System rate

      workItem.systemRate.unit = workItem.rate.unit;
      workItem.systemRate.rateItems = rateItemsByWorkItem;
      workItem.systemRate.notes = notes;
      workItem.systemRate.imageURL = imageURL;
      return workItem;
    } else {
      logger.error('Workitem not found in configuration : ' + categoryWorkitem.name);
    }
    return null;
  }

  getContractingAddOns(workitemRateAnalysisId: number, rateItemsRateAnalysis: any,
                       contractingAddOns: any, contractorAddOnResult: any) {
    let getQuery = 'SELECT workItems.C13 AS workItemId from ? ' +
      'AS workItems where workItems.C1 = ' + workitemRateAnalysisId;
    let workItemIdList = alasql(getQuery, [rateItemsRateAnalysis]);

    if(workItemIdList.length !== 0) {
      console.log('workItemId : '+JSON.stringify(workItemIdList[0].workItemId));
      let workItemId = workItemIdList[0].workItemId;

      let getCOntractingAddOnsForWorkItemQuery = 'SELECT RAContractorAddonsResult.C2 AS contractorAddOnId from ? ' +
        'AS RAContractorAddonsResult where RAContractorAddonsResult.C1 = ' + workItemId;
      let contractorAddOns = alasql(getCOntractingAddOnsForWorkItemQuery, [contractorAddOnResult]);

      let getContractingAddOnsResultForWorkItemQuery = 'SELECT q.C1 AS id, q.C2 AS name, q.C3 AS unit, q.C4 AS rate ' +
        'FROM ? AS q WHERE q.C1 IN (SELECT t.contractorAddOnId FROM ? AS t)';
      let contractorAddOnsForWorkItem = alasql(getContractingAddOnsResultForWorkItemQuery, [contractingAddOns, contractorAddOns]);
      console.log('contractorAddOnsForWorkItem : ' + contractorAddOnsForWorkItem);
      return contractorAddOnsForWorkItem;
    } else {
      logger.error('Contractor AddOn not available for workitemRateAnalysisId : '+workitemRateAnalysisId);
      return null;
    }
  }

  syncAllRegions() {

    let regionObj = {
      'RegionId' : 1,
      'RegionCode' : 'MH',
      'Region' : 'Maharashtra Pune'
    };
    this.SyncRateAnalysis(regionObj);

    /*this.getAllregionsFromRateAnalysis((error, response) => {
      if (error) {
        console.log('error : ' + JSON.stringify(error));
      } else {
        console.log('response : ' + JSON.stringify(response));
        for (let region of response) {
          this.SyncRateAnalysis(region);
        }
      }
    });*/
  }

  SyncRateAnalysis(region: any) {
    let rateAnalysisService = new RateAnalysisService();
    let query = {'appType': 'configCostHeads'};
    this.rateAnalysisRepository.retrieve(query, (error: any, rateAnalysisArray: Array<RateAnalysis>) => {
      if (error) {
        logger.error('Unable to retrive synced RateAnalysis');
      } else {
        let configData = rateAnalysisArray[0];
        let configCostHeads = configData.buildingCostHeads;
        let configProjectCostHeads = configData.projectCostHeads;
        let fixedCostConfigProjectCostHeads = configData.fixedAmountCostHeads;
        this.convertCostHeadsFromRateAnalysisToCostControl(Constants.BUILDING, region,
          configCostHeads, (error: any, costHeadsData: any) => {
          if (error) {
            logger.error('RateAnalysis Sync Failed.');
          } else {
            if(costHeadsData) {
              let buildingCostHeads = JSON.parse(JSON.stringify(costHeadsData.buildingCostHeads));
              let projectCostHeads = JSON.parse(JSON.stringify(costHeadsData.buildingCostHeads));
              this.convertConfigCostHeads(configCostHeads, buildingCostHeads);
              this.convertConfigCostHeads(configProjectCostHeads, projectCostHeads);
              this.convertConfigCostHeads(fixedCostConfigProjectCostHeads, projectCostHeads);
              buildingCostHeads = alasql('SELECT * FROM ? ORDER BY priorityId', [buildingCostHeads]);
              projectCostHeads = alasql('SELECT * FROM ? ORDER BY priorityId', [projectCostHeads]);
              let buildingRates = this.getRates(costHeadsData, buildingCostHeads);
              let projectRates = this.getRates(costHeadsData, projectCostHeads);
              let rateAnalysis = new RateAnalysis(buildingCostHeads, buildingRates, projectCostHeads, projectRates);
              rateAnalysis.appType = 'MyBuildCost';
              this.saveRateAnalysis(rateAnalysis, region);
            }
          }
        });
      }
    });
  }

  convertConfigCostHeads(configCostHeads: Array<any>, costHeadsData: Array<CostHead>) {

    for (let configCostHead of configCostHeads) {

      let costHeadExistSQL = 'SELECT * FROM ? AS costHeads WHERE costHeads.name= ?';
      let costHeadExistArray = alasql(costHeadExistSQL, [costHeadsData, configCostHead.name]);

      if (costHeadExistArray.length === 0 && configCostHead.rateAnalysisId) {
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
            workItem.isSteelWorkItem = configWorkItem.isSteelWorkItem;
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
    }
    return costHeadsData;
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

  saveRateAnalysis(rateAnalysis: RateAnalysis, region: any) {
    logger.info('saveRateAnalysis is been hit : ' + region.Region);
    let query = {'region': region.Region};
    rateAnalysis.region = region.Region;
    logger.info('Updating RateAnalysis for ' + region.Region);
    this.rateAnalysisRepository.retrieve({'region': region.Region}, (error: any, rateAnalysisArray: Array<RateAnalysis>) => {
      if (error) {
        logger.error('Unable to retrive synced RateAnalysis');
      } else {
        if (rateAnalysisArray.length > 0) {
          query = {'region': region.Region};
          let update = {
            $set: {
              'projectCostHeads': rateAnalysis.projectCostHeads,
              'projectRates': rateAnalysis.projectRates,
              'buildingCostHeads': rateAnalysis.buildingCostHeads,
              'buildingRates': rateAnalysis.buildingRates,
              'appType': rateAnalysis.appType
            }
          };
          this.rateAnalysisRepository.findOneAndUpdate(query, update, {new: true}, (error: any, rateAnalysisArray: RateAnalysis) => {
            if (error) {
              logger.error('saveRateAnalysis failed => ' + error.message);
            } else {
              logger.info('Updated RateAnalysis for region :'+region.Region);
            }
          });
        } else {
          this.rateAnalysisRepository.create(rateAnalysis, (error: any, result: RateAnalysis) => {
            if (error) {
              logger.error('saveRateAnalysis failed => ' + error.message);
            } else {
              logger.info('Saved RateAnalysis for region : '+region.Region);
            }
          });
        }
      }
    });
  }

  getCostControlRateAnalysis(type:String , query: any, projection: any, callback: (error: any, rateAnalysis: RateAnalysis) => void) {
    this.rateAnalysisRepository.retrieveWithProjection(query, projection, (error: any, rateAnalysisArray: Array<RateAnalysis>) => {
      if (error) {
        callback(error, null);
      } else {
        if (rateAnalysisArray.length === 0) {
          logger.error('ContControl RateAnalysis not found.');
          callback('ContControl RateAnalysis not found.', null);
        } else {
          let rateAnalysisData = rateAnalysisArray[0];
          if (type === 'cloneBuilding') {
            callback(null, rateAnalysisArray[0]);
          } else {
            this.itemGstRepository.retrieve({}, (error: any, res: any) => {
              if (error) {
                logger.error('Unable to retrive  Saved Rate');
              } else {
                if (res.length > 0) {
                  let arrayOfItemGst = res;
                  let arrayOfCostHeadItemGst = arrayOfItemGst.filter(function(itemGst: ItemGst){ return itemGst.type === 'costHead'; });
                  let arrayOfWorkItemGst = arrayOfItemGst.filter(function(itemGst: ItemGst){ return itemGst.type === 'workItem'; });
                  let arrayOfRateItemGst = arrayOfItemGst.filter(function(itemGst: ItemGst){ return itemGst.type === 'rateItem'; });
                  let rateAnalysisService = new RateAnalysisService();
                  switch (type) {
                    case 'projectCostHeads':
                            let arrayOfProjectCostHeads = rateAnalysisData.projectCostHeads;
                            rateAnalysisService.getCostHeadWithGst(arrayOfCostHeadItemGst,arrayOfProjectCostHeads);
                            rateAnalysisService.getItemWithGst(arrayOfProjectCostHeads,arrayOfWorkItemGst,arrayOfRateItemGst);
                      break;
                    case 'buildingCostHeads':
                    case 'addBuilding':
                            rateAnalysisService.getItemWithGst(rateAnalysisData.buildingCostHeads,arrayOfWorkItemGst,arrayOfRateItemGst);
                      break;
                  }
                }
              }
              callback(null, rateAnalysisArray[0]);
            });
          }
        }
      }
    });
  }

  getItemWithGst(arrayOfCostHeads:Array<any>, arrayOfWorkItemGst:Array<any>, arrayOfRateItemGst: Array<any>) {
      let rateAnalysisService = new RateAnalysisService();
      let getWorkItemSQL = 'SEARCH /categories/workItems FROM ?';
      let arrayOfWorkItem = alasql(getWorkItemSQL, [arrayOfCostHeads]);
      rateAnalysisService.getWorkItemWithGst(arrayOfWorkItemGst, arrayOfWorkItem);
      let getRateItemSQL = 'SEARCH ///rateItems FROM ?';
      let arrayOfRateItem = alasql(getRateItemSQL,[arrayOfWorkItem]);
      rateAnalysisService.getRateItemWithGst(arrayOfRateItemGst, arrayOfRateItem);
  }

  getCostHeadWithGst(arrayOfCostHeadItemGst: Array<any>, arrayOfProjectCostHeads: any) {
    for (let itemGst of arrayOfCostHeadItemGst) {
      let getCostHeadSQL = 'SEARCH / WHERE(name = "' + itemGst.itemName + '")  SET (gst = '+itemGst.value+')FROM ?';
      let isCostHeadDetail = alasql(getCostHeadSQL, [arrayOfProjectCostHeads]);
    }
  }

  getWorkItemWithGst(arrayOfWorkItemGst: Array<any>,  arrayOfWorkItem: any) {
    for(let itemGst of arrayOfWorkItemGst) {
      let getWorkItemSQL = 'SEARCH // WHERE(name = ?) SET (gst = '+itemGst.value+') FROM ?';
      let isProjectWorkItemDetail = alasql(getWorkItemSQL, [itemGst.itemName,arrayOfWorkItem]);
      if (isProjectWorkItemDetail.length > 0) {
      } else {
        console.log('Project WorkItem is not present' + itemGst.itemName);
      }
    }
  }

  getRateItemWithGst(arrayOfRateItemGst: Array<any>,  arrayOfRateItem: any) {
    for(let itemGst of arrayOfRateItemGst) {
      let getRateItemSQL = 'SEARCH // WHERE(itemName = ?) SET (gst = '+itemGst.value+')FROM ?';
      let isRateItemDetail = alasql(getRateItemSQL, [itemGst.itemName,arrayOfRateItem]);
      if (isRateItemDetail.length > 0) {
      } else {
        console.log('RateItem is not present' + itemGst.itemName);
      }
    }
  }

  getAggregateData(query: any, callback: (error: any, aggregateData: any) => void) {
    this.rateAnalysisRepository.aggregate(query, callback);
  }

  getAllregionsFromRateAnalysis(callback: (error: any, result: any) => void) {
    logger.info('Rate Analysis Service, getCostHeads has been hit');
    let regionListFromRateAnalysis: Array<any>;
    let url = config.get('rateAnalysisAPI.getAllregions');
    request.get({url: url}, function (error: any, response: any, body: any) {
      if (error) {
        logger.error('Error for getting all regions.');
        logger.error(JSON.stringify(error));
        callback(error, null);
      } else if (!error && response) {
        if (response.statusCode === 200) {
          let resp = JSON.parse(body);
          regionListFromRateAnalysis = resp['Regions'];
          console.log('regionListFromRateAnalysis : ' + JSON.stringify(regionListFromRateAnalysis));
          callback(null, regionListFromRateAnalysis);
        } else {
          console.log('regionListFromRateAnalysis : NOT FOUND. Internal server error!');
          callback('regionListFromRateAnalysis : NOT FOUND. Internal server error!', null);
        }
      }
    });
  }

  getAllRegionNames(callback: (error: any, result: Array<any>) => void) {
    let query = [
      {$match: {'appType': 'RateAnalysis'}},
      {$unwind: '$region'},
      {$project: {'region': 1, _id: 0}}
    ];
    this.rateAnalysisRepository.aggregate(query, (error, result) => {
      if (error) {
        callback(error, null);
      } else {
        if (result.length > 0) {
          callback(error, result);
        } else {
          let error = new Error();
          error.message = messages.MSG_ERROR_REGIONS_ARE_NOT_PRESENT;
          callback(error, null);
        }
      }
    });
  }

  getAllDataForDropdown(regionName: string, callback: (error: any, result: Array<any>) => void) {
    let query = {region: regionName};
    let projection = {'buildingCostHeads': 1};
    this.rateAnalysisRepository.retrieveWithProjection(query, projection, (error, result) => {
      if (error) {
        callback(error, null);
      } else {
        let costHeadData = result[0].buildingCostHeads;
        let buildingCostHeads: Array<RACostHead> = [];
        if(costHeadData.length > 0) {
            for (let costHeadIndex = 0; costHeadIndex < costHeadData.length; costHeadIndex++) {
             let costHead = new RACostHead();
             costHead.name = costHeadData[costHeadIndex].name;
             costHead.rateAnalysisId = costHeadData[costHeadIndex].rateAnalysisId;
             let buildingCategories: Array<RACategory> = new Array<RACategory>();
             this.getCategories(costHeadData[costHeadIndex].categories, buildingCategories);
             costHead.categories = buildingCategories;
             if(costHead.categories.length > 0) {
               buildingCostHeads.push(costHead);
             }
           }
          callback(null, buildingCostHeads);
        } else {
          let error = new Error();
          error.message = messages.MSG_ERROR_REGIONS_ARE_NOT_PRESENT;
          callback(error, null);
        }
      }
    });
  }

  getCategories(categoriesData: Array<Category>, buildingCategories: any) {
    if (categoriesData.length > 0) {
      for (let categoryIndex = 0; categoryIndex < categoriesData.length; categoryIndex++) {
        let category = new RACategory(categoriesData[categoryIndex].name, categoriesData[categoryIndex].rateAnalysisId);
        let buildingWorkItems: Array<RAWorkItem> = new Array<RAWorkItem>();
        this.getWorkItemsForRA(categoriesData[categoryIndex].workItems, buildingWorkItems);
        category.workItems = buildingWorkItems;
        if(category.workItems.length > 0) {
          buildingCategories.push(category);
        }
      }
    }
  }

  getWorkItemsForRA(workItemsData: Array<WorkItem>, buildingWorkItems: any) {
    if (workItemsData.length > 0) {
      for (let workItemIndex = 0; workItemIndex < workItemsData.length; workItemIndex++) {
        let workItem = new RAWorkItem(workItemsData[workItemIndex].name, workItemsData[workItemIndex].rateAnalysisId);
        workItem.rate = workItemsData[workItemIndex].rate;
        workItem.unit = workItemsData[workItemIndex].unit;
        workItem.isFree = workItemsData[workItemIndex].isFree;
        workItem.contractingAddOns = workItemsData[workItemIndex].contractingAddOns;
        if(workItem.rate.rateItems.length > 0) {
          buildingWorkItems.push(workItem);
        }
      }
    }
  }

  saveRateForWorkItem(userId: string, workItemName: string, workItemId: number, regionName: string, rate:any, contractorAddOns: any,
                      callback:(error: any, result: Array<any>) => void) {
    let query = {'userId': userId};
    this.savedRateRepository.retrieve(query, (error: any, savedRateArray: Array<RASavedRate>) => {
      if (error) {
        logger.error('Unable to retrive  Saved Rate');
      } else {
        if (savedRateArray.length > 0) {
          let workItemListOfUser = savedRateArray[0].workItemList;
            let isWorkItemExistSQL = 'SELECT * FROM ? AS workitems WHERE workitems.rateAnalysisId= '+
              workItemId +' AND workitems.regionName = "'+ regionName +'"';
            let workItemExistArray = alasql(isWorkItemExistSQL, [workItemListOfUser]);
            if(workItemExistArray.length !== 0) {
              for (let workItem of workItemListOfUser) {
                if (workItem.rateAnalysisId === workItemId && workItem.regionName === regionName) {
                  workItem.rate = rate;
                  workItem.contractingAddOns = contractorAddOns;
                }
              }
            } else {
              let raWorkItem = new RAWorkItem(workItemName, workItemId);
              raWorkItem.regionName = regionName;
              raWorkItem.rate = rate;
              raWorkItem.contractingAddOns = contractorAddOns;
              workItemListOfUser.push(raWorkItem);
            }
          let query =  {'userId': userId};
          let updateQuery = {$set:
              {'workItemList':workItemListOfUser},
          };
          this.savedRateRepository.findOneAndUpdate(query, updateQuery,{new: true}, (error, result) => {
            if (error) {
              callback(error, null);
            } else {
              callback(null,result);
            }
          });
        } else {
          let raSavedRate = new RASavedRate();
          raSavedRate.userId = userId;
          let raWorkItem = new RAWorkItem(workItemName, workItemId);
          raWorkItem.regionName = regionName;
          raWorkItem.rate = rate;
          raWorkItem.contractingAddOns = contractorAddOns;
          raSavedRate.workItemList.push(raWorkItem);
          this.savedRateRepository.create(raSavedRate, (error: any, result: Array<RASavedRate>) => {
            if (error) {
              callback(error, null);
              logger.error('saveRate failed => ' + error.message);
            } else {
              callback(null,result);
              logger.info('Saved Rate : '+userId);
            }
          });
        }
      }
    });
  }

  getSavedRateForWorkItem(userId:string, regionName: string, workItemId: number, callback: (error: any, result: RAWorkItem) => void) {
    let query = [
      {$match: {'userId': userId}},
      {$project: {'workItemList': 1}},
      {$unwind: '$workItemList'},
      {$match: {'workItemList.rateAnalysisId': workItemId, 'workItemList.regionName': regionName}},
      {$project: {'workItemList': 1, '_id': 0}}
    ];
    this.savedRateRepository.aggregate(query, (error, result: any) => {
      if (error) {
        callback(error, null);
      } else {
        if(result.length > 0) {
          let workItem = new RAWorkItem();
          workItem.rate = result[0].workItemList.rate;
          workItem.contractingAddOns = result[0].workItemList.contractingAddOns;
          callback(null, workItem);
        } else {
          callback(null, null);
        }
      }
    });
  }

  syncAllRateAnalysisRegions() {
    this.getAllregionsFromRateAnalysis((error, response) => {
      if (error) {
        console.log('error : ' + JSON.stringify(error));
      } else {
        console.log('response : ' + JSON.stringify(response));
        response.reduce((promiseArray:any, arrayItem:any) => {
          return promiseArray.then(() =>  {
            return this.createPromiseTosynchRegionFromRateAnalysis(arrayItem);
          });
          }, CCPromise.resolve());
      }
    });
  }

  createPromiseTosynchRegionFromRateAnalysis(region: any) {
    return new CCPromise(function (resolve: any, reject: any) {
      let rateAnalysisService = new RateAnalysisService();
      rateAnalysisService.synchRegionForRateAnalysis(region, (error:any, result:any) => {
        if(error) {
          reject(error);
        } else if(result) {
          let rateAnalysis = new RateAnalysis(result, null, null, null);
          rateAnalysis.appType = 'RateAnalysis';
          rateAnalysisService.saveRateAnalysis(rateAnalysis, region);
          resolve();
        }
      });
      //CCPromise.resolve();
    }).catch(function (e: any) {
      CCPromise.reject(e.message);
    });
  }

  synchRegionForRateAnalysis(region: any, callback : (error:any, result:any) => void) {
    logger.info('synchRegionForRateAnalysis for has been hit');
    let entity = Constants.BUILDING;
    let costHeadURL = config.get(Constants.RATE_ANALYSIS_API + entity + Constants.RATE_ANALYSIS_COSTHEADS)
      + region.RegionId + config.get(Constants.RATE_ANALYSIS_API + Constants.RATE_ANALYSIS_API_ENDPOINT);
    let costHeadRateAnalysisPromise = this.createPromise(costHeadURL, region);
    logger.info('costHeadRateAnalysisPromise for has been hit');

    let categoryURL = config.get(Constants.RATE_ANALYSIS_API + entity + Constants.RATE_ANALYSIS_CATEGORIES)
      + region.RegionId + config.get(Constants.RATE_ANALYSIS_API + Constants.RATE_ANALYSIS_API_ENDPOINT);
    let categoryRateAnalysisPromise = this.createPromise(categoryURL, region);
    logger.info('categoryRateAnalysisPromise for has been hit');

    let workItemURL = config.get(Constants.RATE_ANALYSIS_API + entity + Constants.RATE_ANALYSIS_WORKITEMS)
      + region.RegionId + config.get(Constants.RATE_ANALYSIS_API + Constants.RATE_ANALYSIS_API_ENDPOINT);
    let workItemRateAnalysisPromise = this.createPromise(workItemURL, region);
    logger.info('workItemRateAnalysisPromise for has been hit');

    let rateItemURL = config.get(Constants.RATE_ANALYSIS_API + entity + Constants.RATE_ANALYSIS_RATE)
      + region.RegionId + config.get(Constants.RATE_ANALYSIS_API + Constants.RATE_ANALYSIS_API_ENDPOINT);
    let rateItemRateAnalysisPromise = this.createPromise(rateItemURL, region);
    logger.info('rateItemRateAnalysisPromise for has been hit');

    let rateAnalysisNotesURL = config.get(Constants.RATE_ANALYSIS_API + entity + Constants.RATE_ANALYSIS_NOTES)
      + region.RegionId + config.get(Constants.RATE_ANALYSIS_API + Constants.RATE_ANALYSIS_API_ENDPOINT);
    let notesRateAnalysisPromise = this.createPromise(rateAnalysisNotesURL, region);
    logger.info('notesRateAnalysisPromise for has been hit');

    let allUnitsFromRateAnalysisURL = config.get(Constants.RATE_ANALYSIS_API + entity + Constants.RATE_ANALYSIS_UNIT)
      + region.RegionId + config.get(Constants.RATE_ANALYSIS_API + Constants.RATE_ANALYSIS_API_ENDPOINT);
    let unitsRateAnalysisPromise = this.createPromise(allUnitsFromRateAnalysisURL, region);
    logger.info('unitsRateAnalysisPromise for has been hit');

    let contractorAddOnsFromRateAnalysisURL = config.get(Constants.RATE_ANALYSIS_API + Constants.START_POINT)
      + config.get(Constants.RATE_ANALYSIS_API + Constants.RATE_ANALYSIS_CONTRACTOR_ADD_ONS)
      + config.get(Constants.RATE_ANALYSIS_API + Constants.RA_CONTRACTOR_API_ENDPOINT);
    let contractorAddOnsFromRateAnalysisPromise = this.createPromise(contractorAddOnsFromRateAnalysisURL, region);
    logger.info('contractorAddOnsFromRateAnalysisPromise for has been hit');

    let rateAnalysisRegionResultFromRateAnalysisURL = config.get(Constants.RATE_ANALYSIS_API + Constants.START_POINT)
      + config.get(Constants.RATE_ANALYSIS_API + Constants.RA_REGION_RESULT)
      + region.RegionId + config.get(Constants.RATE_ANALYSIS_API + Constants.RATE_ANALYSIS_API_ENDPOINT);
    let rateAnalysisRegionFromRateAnalysisPromise = this.createPromise(rateAnalysisRegionResultFromRateAnalysisURL, region);
    logger.info('contractorAddOnsFromRateAnalysisPromise for has been hit');

    let contractorAddOnResultURL = 'http://mobileapiv4.buildinfo.co.in/RAContractorAddons/RAContractorAddonsResult?' +
      'DeviceId=2fc85276aee45b7a&mobilenumber=8928520179&regionID='+ region.RegionId +'&NeedFullData=y&AppCode=RA';
    let contractorAddOnResultPromise = this.createPromise(contractorAddOnResultURL, region);

    let liteVersionWorkItemsURL = config.get('rateAnalysisAPI.liteVersionItems');
    let liteVersionWorkItemsPromise = this.createPromise(liteVersionWorkItemsURL);

    logger.info('calling Promise.all');
    CCPromise.all([
      costHeadRateAnalysisPromise,
      categoryRateAnalysisPromise,
      workItemRateAnalysisPromise,
      rateItemRateAnalysisPromise,
      notesRateAnalysisPromise,
      unitsRateAnalysisPromise,
      contractorAddOnsFromRateAnalysisPromise,
      contractorAddOnResultPromise,
      liteVersionWorkItemsPromise
    ]).then(function (data: Array<any>) {
      logger.info(' Promise.all API is success.');

      if(data[0][Constants.RATE_ANALYSIS_ITEM_TYPE] && data[1][Constants.RATE_ANALYSIS_SUBITEM_TYPE] &&
        data[2][Constants.RATE_ANALYSIS_ITEMS] && data[3][Constants.RATE_ANALYSIS_DATA] &&
        data[4][Constants.RATE_ANALYSIS_DATA] && data[5][Constants.RATE_ANALYSIS_UOM] &&
        data[6][Constants.CONTRACTING_ADD_ONS] && data[7][Constants.RATEANALYSIS_ADD_ON_DATA] &&
        data[8][Constants.RATE_ANALYSIS_ITEMS]) {

        let costHeadsRateAnalysis = data[0][Constants.RATE_ANALYSIS_ITEM_TYPE];
        let categoriesRateAnalysis = data[1][Constants.RATE_ANALYSIS_SUBITEM_TYPE];
        let workItemsRateAnalysis = data[2][Constants.RATE_ANALYSIS_ITEMS];
        let rateItemsRateAnalysis = data[3][Constants.RATE_ANALYSIS_DATA];
        let notesRateAnalysis = data[4][Constants.RATE_ANALYSIS_DATA];
        let unitsRateAnalysis = data[5][Constants.RATE_ANALYSIS_UOM];
        let contractingAddOns = data[6][Constants.CONTRACTING_ADD_ONS];
        let contractorAddOnResult = data[7][Constants.RATEANALYSIS_ADD_ON_DATA];
        let freeRAWorkitemsList = data[8][Constants.RATE_ANALYSIS_ITEMS];

        let rateAnalysisCostHeads: Array<CostHead> = [];
        let rateAnalysisService = new RateAnalysisService();

        rateAnalysisService.convertCostHeadsForRateAnalysis(costHeadsRateAnalysis, categoriesRateAnalysis, workItemsRateAnalysis,
          rateItemsRateAnalysis, unitsRateAnalysis, notesRateAnalysis,
          contractingAddOns, contractorAddOnResult, rateAnalysisCostHeads, region, freeRAWorkitemsList);
        logger.info('success in  convertCostHeadsFromRateAnalysisToCostControl.');

        console.log('Suceessfully feteched data for : '+region.Region);
        callback(null, rateAnalysisCostHeads);
        //CCPromise.resolve('Success');
      }
    }).catch(function (e: any) {
      logger.error(' Promise failed for ! :' + JSON.stringify(e.message));
      CCPromise.reject(e.message);
    });
  }

  convertCostHeadsForRateAnalysis(costHeadsRateAnalysis:any, categoriesRateAnalysis:any, workItemsRateAnalysis:any,
                                  rateItemsRateAnalysis:any, unitsRateAnalysis:any, notesRateAnalysis:any,
                                  contractingAddOns:any, contractorAddOnResult:any, buildingCostHeads:any, region:any,
                                  freeRAWorkitemsList: Array<any>) {
    console.log('Rate analysis for conversion');
    for (let costHeadIndex = 0; costHeadIndex < costHeadsRateAnalysis.length; costHeadIndex++) {

        let costHead = new RACostHead();
        costHead.name = costHeadsRateAnalysis[costHeadIndex].C2;

        costHead.rateAnalysisId = costHeadsRateAnalysis[costHeadIndex].C1;

        let categoriesRateAnalysisSQL = 'SELECT Category.C1 AS rateAnalysisId, Category.C2 AS name' +
          ' FROM ? AS Category where Category.C3 = ' + costHead.rateAnalysisId;

        let categoriesByCostHead = alasql(categoriesRateAnalysisSQL, [categoriesRateAnalysis]);
        let raCategories: Array<RACategory> = new Array<RACategory>();

        if (categoriesByCostHead.length === 0) {
          this.getWorkItemsWithoutCategoryForRateAnalysis(costHead.rateAnalysisId, workItemsRateAnalysis,
            rateItemsRateAnalysis, unitsRateAnalysis, notesRateAnalysis,
            contractingAddOns, contractorAddOnResult, raCategories, region, freeRAWorkitemsList);
        } else {
          this.getCategoriesForRateAnalysis(categoriesByCostHead, workItemsRateAnalysis,
            rateItemsRateAnalysis, unitsRateAnalysis, notesRateAnalysis,
            contractingAddOns, contractorAddOnResult, raCategories, region, freeRAWorkitemsList);
        }

        costHead.categories = raCategories;
        buildingCostHeads.push(costHead);
    }
  }

  getWorkItemsWithoutCategoryForRateAnalysis(costHeadRateAnalysisId: number, workItemsRateAnalysis : any,
        rateItemsRateAnalysis: any, unitsRateAnalysis: any, notesRateAnalysis: any,
        contractingAddOns: any, contractorAddOnResult: any, buildingCategories: Array<RACategory>, region:any,
                                             freeRAWorkitemsList: Array<any>) {
    logger.info('getWorkItemsWithoutCategoryForRateAnalysis has been hit.');

    let workItemsWithoutCategoriesRateAnalysisSQL = 'SELECT workItem.C2 AS rateAnalysisId, workItem.C3 AS name' +
      ' FROM ? AS workItem where NOT workItem.C4 AND workItem.C1 = ' + costHeadRateAnalysisId;
    let workItemsWithoutCategories = alasql(workItemsWithoutCategoriesRateAnalysisSQL, [workItemsRateAnalysis]);

    let buildingWorkItems: Array<WorkItem> = new Array<WorkItem>();
    let category = new RACategory('Work Items', 0);

    this.getWorkItemsForRateAnalysis(workItemsWithoutCategories, rateItemsRateAnalysis,
      unitsRateAnalysis, notesRateAnalysis, contractingAddOns, contractorAddOnResult,
      buildingWorkItems, workItemsRateAnalysis, region, freeRAWorkitemsList);

    category.workItems = buildingWorkItems;
    buildingCategories.push(category);
  }

  getWorkItemsForRateAnalysis(workItemsByCategory: any, rateItemsRateAnalysis: any,
                               unitsRateAnalysis: any, notesRateAnalysis: any, contractingAddOns: any, contractorAddOnResult: any,
                               buildingWorkItems: Array<RAWorkItem>, workItemsRateAnalysis: any,
                               region:any, freeRAWorkitemsList: Array<any>) {

    logger.info('getWorkItemsFromRateAnalysis has been hit.');
    for (let categoryWorkitem of workItemsByCategory) {
      let workItem = this.getRatesForRateAnalysis(categoryWorkitem, rateItemsRateAnalysis, unitsRateAnalysis,
        notesRateAnalysis, contractingAddOns, contractorAddOnResult, workItemsRateAnalysis, region, freeRAWorkitemsList);
      if (workItem) {
        buildingWorkItems.push(workItem);
      }
    }
  }

  getRatesForRateAnalysis(categoryWorkitem: RAWorkItem, rateItemsRateAnalysis: any,
                  unitsRateAnalysis: any, notesRateAnalysis: any, contractingAddOns: any,
                  contractorAddOnResult: any, workItemsRateAnalysis: any, region:any, freeRAWorkitemsList: Array<any>) {

    if (categoryWorkitem.name && categoryWorkitem.rateAnalysisId) {

      let workItem = new RAWorkItem(categoryWorkitem.name, categoryWorkitem.rateAnalysisId);

      workItem.contractingAddOns = this.getContractingAddOns(categoryWorkitem.rateAnalysisId,
        rateItemsRateAnalysis, contractingAddOns, contractorAddOnResult);

      workItem.regionName = region.Region;

      let rateItemsRateAnalysisSQL = 'SELECT rateItem.C2 AS itemName, rateItem.C2 AS originalItemName,' +
        'rateItem.C12 AS rateAnalysisId, rateItem.C6 AS type,' +
        'ROUND(rateItem.C7,2) AS quantity, ROUND(rateItem.C3,2) AS rate, unit.C2 AS unit, rateItem.C8 AS workItemUnitId,' +
        'ROUND(rateItem.C3 * rateItem.C7,2) AS totalAmount, rateItem.C5 AS totalQuantity, rateItem.C13 AS notesRateAnalysisId  ' +
        'FROM ? AS rateItem JOIN ? AS unit ON unit.C1 = rateItem.C9 where rateItem.C1 = '
        + categoryWorkitem.rateAnalysisId;
      let rateItemsByWorkItem = alasql(rateItemsRateAnalysisSQL, [rateItemsRateAnalysis, unitsRateAnalysis]);
      let notes = '';
      let imageURL = '';
      workItem.rate.rateItems = rateItemsByWorkItem;
      workItem.isFree = this.checkIfFreeVersion(workItem, freeRAWorkitemsList);

      if (rateItemsByWorkItem && rateItemsByWorkItem.length > 0) {

        let getWorkItemUnitSQL = 'SELECT units.C2 AS rateQuantityUnit FROM ? AS units WHERE units.C1 = '
          +rateItemsByWorkItem[0].workItemUnitId;
        let workItemRateQuantityUnit = alasql(getWorkItemUnitSQL, [unitsRateAnalysis]);
        workItem.rate.unit = workItemRateQuantityUnit[0].rateQuantityUnit;

        let notesRateAnalysisSQL = 'SELECT notes.C2 AS notes, notes.C3 AS imageURL FROM ? AS notes where notes.C1 = ' +
          rateItemsByWorkItem[0].notesRateAnalysisId;
        let notesList = alasql(notesRateAnalysisSQL, [notesRateAnalysis]);
        notes = notesList[0].notes;
        imageURL = notesList[0].imageURL;

        workItem.rate.quantity = rateItemsByWorkItem[0].totalQuantity;
      } else {
        logger.error('rateItemsByWorkItem not available for workitem : ' + workItem.name);
        workItem.rate.quantity = 1;
      }
      workItem.rate.notes = notes;
      workItem.rate.imageURL = imageURL;

      return workItem;
    }
    return null;
  }

  getCategoriesForRateAnalysis(categoriesByCostHead: any, workItemsRateAnalysis: any,
                                rateItemsRateAnalysis: any, unitsRateAnalysis: any,
                                notesRateAnalysis: any, contractingAddOns: any, contractorAddOnResult: any,
                                buildingCategories: Array<RACategory>, region:any, freeRAWorkitemsList: Array<any>) {

    logger.info('getCategoriesFromRateAnalysis has been hit.');

    for (let categoryIndex = 0; categoryIndex < categoriesByCostHead.length; categoryIndex++) {

      let category = new RACategory(categoriesByCostHead[categoryIndex].name, categoriesByCostHead[categoryIndex].rateAnalysisId);

      let workItemsRateAnalysisSQL = 'SELECT workItem.C2 AS rateAnalysisId, TRIM(workItem.C3) AS name' +
        ' FROM ? AS workItem where workItem.C4 = ' + categoriesByCostHead[categoryIndex].rateAnalysisId;

      let workItemsByCategory = alasql(workItemsRateAnalysisSQL, [workItemsRateAnalysis]);
      let buildingWorkItems: Array<RAWorkItem> = new Array<RAWorkItem>();

      this.getWorkItemsForRateAnalysis(workItemsByCategory, rateItemsRateAnalysis,
        unitsRateAnalysis, notesRateAnalysis, contractingAddOns,
        contractorAddOnResult, buildingWorkItems, workItemsRateAnalysis,
        region, freeRAWorkitemsList);

      category.workItems = buildingWorkItems;
      if (category.workItems.length !== 0) {
        buildingCategories.push(category);
      }
    }

  }

  sendEmailForSynchFailed(url: any, region: any) {
    if(region !== undefined) {
        setTimeout(() => {
          console.log('failed region call : '+ JSON.stringify(region));
          console.log(' 5 minutes Timer fixed to synch failed region !!!');
          this.createPromiseTosynchRegionFromRateAnalysis(region);
          console.log(JSON.stringify(region.Region));
        }, 300000);
    }
    let tempError: any = new Object();
    tempError.reason = 'Unable to make a get request for url from BuildInfo Server';
    tempError.code = 500;
    tempError.message = 'syncAllRateAnalysisRegions is failed';
    tempError.stack = 'syncAllRateAnalysisRegions is failed for url : '+ url;
    let userService = new UserService();
    userService.sendMailOnError(tempError, (error:any, result:any) => {
      if (error) {
        logger.error( messages.MSG_ERROR_WHILE_CONTACTING);
      }
    });
  }

  exportDataToCSV(callback : (error:any, res:any)=> void) {
    this.writeBuildingCostHeads();
    this.writeProjectCostHeads();
    this.writeFixedAmountCostHeads();
  }

  writeBuildingCostHeads() {
    const dataList = config.get('configCostHeads');
    const fields = ['name', 'priorityId', 'rateAnalysisId', 'categories.name', 'categories.rateAnalysisId',
      'categories.workItems.name','categories.workItems.rateAnalysisId','categories.workItems.isMeasurementSheet',
      'categories.workItems.measurementUnit','categories.workItems.isRateAnalysis','categories.workItems.rateAnalysisPerUnit',
      'categories.workItems.rateAnalysisUnit','categories.workItems.directRate','categories.workItems.directRatePerUnit',
      'categories.workItems.isItemBreakdownRequired','categories.workItems.length','categories.workItems.breadthOrWidth',
      'categories.workItems.height'];

    const json2csvParser = new Json2csvParser({ fields , unwind: ['categories','categories.workItems']});
    const csvData = json2csvParser.parse(dataList);
    let fileName = path.resolve() + config.get('application.exportFilePathServer')
      + config.get('application.exportedFileNames.buildingCostHeads');
    this.writeExcelFile(fileName, csvData,(err: any, response: any) => {
      if (err) {
        console.log('Error ');
      } else {
        console.log('Success ');
      }
    });
  }

  writeProjectCostHeads() {
    const dataList = config.get('configProjectCostHeads');
    const fields = ['name', 'priorityId', 'rateAnalysisId', 'categories.name', 'categories.rateAnalysisId',
      'categories.workItems.name','categories.workItems.rateAnalysisId','categories.workItems.isMeasurementSheet',
      'categories.workItems.measurementUnit','categories.workItems.isRateAnalysis','categories.workItems.rateAnalysisPerUnit',
      'categories.workItems.rateAnalysisUnit','categories.workItems.directRate','categories.workItems.directRatePerUnit',
      'categories.workItems.isItemBreakdownRequired','categories.workItems.length','categories.workItems.breadthOrWidth',
      'categories.workItems.height'];

    const json2csvParser = new Json2csvParser({ fields , unwind: ['categories','categories.workItems']});
    const csvData = json2csvParser.parse(dataList);
    let fileName = path.resolve() + config.get('application.exportFilePathServer')
      + config.get('application.exportedFileNames.projectCostHeads');
    this.writeExcelFile(fileName, csvData,(err: any, response: any) => {
      if (err) {
        console.log('Error ');
      } else {
        console.log('Success ');
      }
    });
  }

  writeFixedAmountCostHeads() {
    const dataList = config.get('fixedCostConfigProjectCostHeads');
    const fields = ['name', 'priorityId', 'rateAnalysisId'];
    const json2csvParser = new Json2csvParser({ fields });
    const csvData = json2csvParser.parse(dataList);
    let fileName = path.resolve() + config.get('application.exportFilePathServer')
      + config.get('application.exportedFileNames.fixedAmountCostHeads');
    this.writeExcelFile(fileName, csvData,(err: any, response: any) => {
      if (err) {
        console.log('Error ');
      } else {
        console.log('Success ');
      }
    });
  }

  writeExcelFile(fileName: string, data : any, callback : (error:any, result:any)=> void) {

    fs.writeFile(fileName, data, 'utf-8', function (err: any, response: any) {
      if (err) {
        console.log('Error ');
        callback(err, null);
      } else {
        console.log('Success ');
        callback(null, { messge : 'Successfully created files' });
      }
    });
  }

  readFromExcel(callback : (error:any, res:any)=> void) {

    let fileNameForProjectCostHeads = path.resolve() + config.get('application.exportFilePathServer')
      + config.get('application.exportedFileNames.projectCostHeads');
    let fileNameForBuildingCostHeads = path.resolve() + config.get('application.exportFilePathServer')
      + config.get('application.exportedFileNames.buildingCostHeads');
    let fileNameForFixedAmountCostHeads = path.resolve() + config.get('application.exportFilePathServer')
      + config.get('application.exportedFileNames.fixedAmountCostHeads');

    let createPromiseForReadingProjectCostHead = this.createPromiseToReadFile(fileNameForProjectCostHeads);
    let createPromiseForReadingBuildingCostHead = this.createPromiseToReadFile(fileNameForBuildingCostHeads);
    let createPromiseForReadingFixedAmountCostHead = this.createPromiseToReadFile(fileNameForFixedAmountCostHeads);

    CCPromise.all([
      createPromiseForReadingBuildingCostHead,
      createPromiseForReadingProjectCostHead,
      createPromiseForReadingFixedAmountCostHead
    ]).then(function (data: Array<any>) {
      logger.info('convertCostHeadsFromRateAnalysisToCostControl Promise.all API is success.');

      if(data.length > 0) {

        let buildingCostHeads = data[0];
        let projectCostHeads = data[1];
        let fixedAmountCostHeads = data[2];

        let rateAnalysisModel = new RateAnalysis(buildingCostHeads,  null, projectCostHeads, null);
        rateAnalysisModel.fixedAmountCostHeads = fixedAmountCostHeads;
        let rateAnalysisService = new RateAnalysisService();
        rateAnalysisService.saveConfigData(rateAnalysisModel, (error:any, result:any)=> {
          if(error) {
            console.log('Error : '+JSON.stringify(error));
            callback(error, null);
          } else {
            console.log('Result : '+JSON.stringify(result));
            callback(null, result);
          }
        });
      }
    }).catch(function (e: any) {
      logger.error(' Promise failed for readFromExcel :' + JSON.stringify(e.message));
      CCPromise.reject(e.message);
    });
  }

  createPromiseToReadFile(filePath: string) {
    return new CCPromise(function (resolve: any, reject: any) {
      logger.info('creating Promise for file read has been hit : ' + filePath);
      xlsxj({
        input: filePath,
        output: null
      }, (err: any, result: any) => {
        if (err) {
          reject(err);
        } else {
          if(result.length > 0) {
            let rateAnalysisService = new RateAnalysisService();
            resolve(rateAnalysisService.convertJSON(result));
          }
        }
      });
    }).catch(function (e: any) {
      logger.error('creating Promise for file read has been hit : ' + filePath + ':\n error :' + JSON.stringify(e.message));
      CCPromise.reject(e.message);
    });
  }

  convertJSON(costHeadList: Array<any>) {
    let costheadsList = new Array<any>();
    let getAllDistinctCostHeads = 'select DISTINCT name from ?';
    let distinctCostHeadList = alasql(getAllDistinctCostHeads, [costHeadList]);

    for(let costHead of distinctCostHeadList) {
      if(costHead.name !== null && costHead.name !== '') {
          let costHeadDetailsSQL = 'SELECT * FROM ? WHERE name = ?';
          let costHeadArray = alasql(costHeadDetailsSQL, [costHeadList, costHead.name]);
          if(costHeadArray.length > 0) {
            let costHead = costHeadArray[0];
            let costheadObj = new CostHead();
            costheadObj.name = costHead.name;
            if(costHead.rateAnalysisId) {
              costheadObj.rateAnalysisId = parseInt(costHead.rateAnalysisId);
            }
            costheadObj.priorityId = parseInt(costHead.priorityId);
            costheadObj.categories = this.getDistinctCategories(costHeadArray, costHead.name);
            costheadsList.push(costheadObj);
          }
        }
      }
    return costheadsList;
  }

  getDistinctCategories(distinctCostHeadList: Array<any>, costheadName : string) {
    let categoriesList = new Array<any>();
    let getAllDistinctCategories = 'select DISTINCT categoryName from ?';
    let distinctCategoriesList = alasql(getAllDistinctCategories, [distinctCostHeadList]);

    for(let category of distinctCategoriesList) {
      if(category.categoryName !== null && category.categoryName !== '') {
        let getCategoryObjectSQL = 'SELECT * from ? where categoryName = ?';
        let categoryObjects = alasql(getCategoryObjectSQL,[distinctCostHeadList, category.categoryName]);

        if(categoryObjects.length > 0) {
          let categoryObj = categoryObjects[0];
          let categoryId: number;
          if(parseInt(categoryObj.categoryRateAnalysisId)) {
            categoryId = parseInt(categoryObj.categoryRateAnalysisId);
          }
          let categoryObject = new Category(categoryObj.categoryName, categoryId);
          categoryObject.workItems = this.getDistinctWorkItems(distinctCostHeadList, categoryObj.categoryName);
          categoriesList.push(categoryObject);
        }
      }
    }
    return categoriesList;
  }

  getDistinctWorkItems(categoryList: Array<any>, categoryName: string) {
    let workItemsList = new Array<any>();

    let getWorkitemObjectSQL = 'SELECT * from ? where categoryName = ?';
    let configWorkItemList = alasql(getWorkitemObjectSQL, [categoryList, categoryName]);

    for(let configWorkItem of configWorkItemList) {
      if(configWorkItem.workItemName !== null && configWorkItem.workItemName !== '') {
        let workItemId: number;
        if(parseInt(configWorkItem.WorkItemRateAnalysisId)) {
          workItemId = parseInt(configWorkItem.WorkItemRateAnalysisId);
        }
        let workItemObj = new ConfigWorkItem(configWorkItem.workItemName, workItemId);
        workItemObj.isRateAnalysis = (configWorkItem.isRateAnalysis.toUpperCase() === 'TRUE');
        if(configWorkItem.directRate) {
          workItemObj.directRate = parseInt(configWorkItem.directRate);
        } else {
          workItemObj.directRate = 0;
        }
        workItemObj.directRatePerUnit = configWorkItem.directRatePerUnit;
        workItemObj.isMeasurementSheet = (configWorkItem.isMeasurementSheet.toUpperCase() === 'TRUE');
        workItemObj.measurementUnit = configWorkItem.measurementUnit;
        let rateAnalysisPerUnit : number = 0;
        if(configWorkItem.rateAnalysisPerUnit) {
          workItemObj.rateAnalysisPerUnit = rateAnalysisPerUnit;
        }
        workItemObj.rateAnalysisUnit = configWorkItem.rateAnalysisUnit;
        workItemObj.isItemBreakdownRequired = (configWorkItem.isItemBreakdownRequired.toUpperCase() === 'TRUE');
        if(!workItemObj.isItemBreakdownRequired) {
          workItemObj.length = false;
          workItemObj.breadthOrWidth = false;
          workItemObj.height = false;
        } else {
          workItemObj.length = (configWorkItem.length.toUpperCase() === 'TRUE');
          workItemObj.breadthOrWidth = (configWorkItem.breadthOrWidth.toUpperCase() === 'TRUE');
          workItemObj.height = (configWorkItem.height.toUpperCase() === 'TRUE');
        }
        workItemsList.push(workItemObj);
      }
    }
    return workItemsList;
  }

  saveConfigData(rateAnalysisModel: RateAnalysis, callback :(error:any, result: any) => void) {
    let query = { appType: 'configCostHeads' };
    this.rateAnalysisRepository.retrieve(query, (error, result) => {
      if (error) {
        callback(error, null);
      } else {
        if(result.length > 0) {
          let query = { _id: result[0]._id };
          this.rateAnalysisRepository.findOneAndUpdate(query, rateAnalysisModel, {},(error:any, result:any)=> {
            if(error) {
              callback(error, null);
            } else {
              callback(null, result);
            }
          });
        } else {
          rateAnalysisModel.appType = 'configCostHeads';
          this.rateAnalysisRepository.create(rateAnalysisModel, (err: any, response:any)=> {
            if(err) {
              callback(err, null);
            } else {
              callback(null, response);
            }
          });
        }
      }
    });
  }

  syncNewDataForAllUsers() {
    this.getAllLatestCostHeadsFromRateAnalysis((error: any, success: any) => {
      if (error) {
        console.log('Failed for buildings');
      } else if (success) {
        console.log('Done for all buildings');
      }
    });
  }

  getAllLatestCostHeadsFromRateAnalysis(callback: (error: any, result: any) => void) {
    let query = [
      {$match: {appType: 'MyBuildCost'}},
      {$project: {'buildingCostHeads': 1, 'buildingRates': 1, 'projectCostHeads': 1, 'projectRates': 1}}
    ];
    this.rateAnalysisRepository.aggregate(query, (error: any, rateAnalysisArray: any) => {
      if (error) {
        logger.error('Unable to retrive synced RateAnalysis');
      } else {
        if (rateAnalysisArray.length !== 0) {
          let rateAnalysisCostHeads = rateAnalysisArray[0].buildingCostHeads;
          let rateAnalysisRates = rateAnalysisArray[0].buildingRates;
          let rateAnalysisProjectCostHeads = rateAnalysisArray[0].projectCostHeads;
          let rateAnalysisProjectRates = rateAnalysisArray[0].projectRates;

          let findAllUsers = {};
          let populateQuery = {path: 'project', select: ['name', 'project']};
          this.userRepository.findAndPopulate(findAllUsers, populateQuery, (error:any, userList : any)=> {
            if(error) {
              logger.error('Error : ' + JSON.stringify(error));
            } else {
              if (userList.length !== 0) {
                for (let user of userList) {
                  if (user.project.length !== 0) {
                    for (let project of user.project) {
                      let projectId = project._id;
                      let query = projectId;
                      let populate = {path: 'buildings'};
                      this.projectRepository.findAndPopulate(query, populate, (error, projectData) => {
                        if (error) {
                          logger.error('Error : ' + JSON.stringify(error));
                        } else {
                          let buildingArray = projectData[0].buildings;
                          let projectCostHeads = projectData[0].projectCostHeads;
                          let projectRates = projectData[0].rates;

                          let newProjectCostHeads = this.synchCostHedsWithLatestRateAnalysis(projectCostHeads, rateAnalysisProjectCostHeads);
                          let projectCostHeadsWithBudgetedCost = this.projectService.calculateBudgetCostForCommonAmmenities(newProjectCostHeads, projectData[0]);
                          let newRates = this.synchRatesWithLatestRateAnalysis(projectRates, rateAnalysisProjectRates);
                          this.updateCostHeadsAndCentralizedRatesOfProject(projectId,projectCostHeadsWithBudgetedCost, newRates);

                          if(buildingArray.length !==0) {
                            for(let buildingId of buildingArray) {
                              this.buildingRepository.findById(buildingId,(error: any, buildingData: any) => {
                                if (error) {
                                  logger.error('Error : ' + JSON.stringify(error));
                                } else {
                                  let costHeadList = buildingData.costHeads;
                                  let buildingRates = buildingData.rates;
                                  let newCostHeads = this.synchCostHedsWithLatestRateAnalysis(costHeadList, rateAnalysisCostHeads);
                                  let costHeadsWithBudgetedCost = this.projectService.calculateBudgetCostForBuilding(newCostHeads, buildingData, projectData[0]);
                                  let newRates = this.synchRatesWithLatestRateAnalysis(buildingRates, rateAnalysisRates);
                                  this.updateCostHeadsAndCentralizedRatesOfBuilding(buildingId,costHeadsWithBudgetedCost, newRates);
                                }
                              });
                            }
                          }
                        }
                      });
                    }
                  }
                }
              }
            }
          });
        }
      }
    });
  }

  synchCostHedsWithLatestRateAnalysis(costHeadsList: any, rateAnalysisCostHeads: any) {
    for (let costHead of rateAnalysisCostHeads) {
      let buildingCostHead = this.getFilterData(costHead.name, costHeadsList);
      if (buildingCostHead !== null) {
        let rateAnalysisCostHead = this.getFilterData(costHead.name, rateAnalysisCostHeads);
        buildingCostHead[0].priorityId = rateAnalysisCostHead[0].priorityId;
        this.checkCategoryExist(buildingCostHead[0].categories, rateAnalysisCostHead[0].categories);
      } else {
        costHeadsList.push(costHead);
        logger.info(costHead.name);
      }
    }
    return costHeadsList;
  }

  checkCategoryExist(buildingCategories: any, rateAnalysisCategories: any) {
    if (rateAnalysisCategories.length !== 0) {
      if (buildingCategories.length === 0) {
        for (let category of rateAnalysisCategories) {
          buildingCategories.push(category);
        }
      } else {
        for (let category of rateAnalysisCategories) {
          let buildingCategory = this.getFilterData(category.name, buildingCategories);
          if (buildingCategory !== null) {
            let rateAnalysisCategory = this.getFilterData(category.name, rateAnalysisCategories);
            this.checkWorkItemExist(buildingCategory[0].workItems, rateAnalysisCategory[0].workItems);
          } else {
            buildingCategories.push(category);
            logger.info(category.name);
          }
        }
      }
    }
  }

  checkWorkItemExist(buildingWorkItems: any, rateAnalysisWorkItems: any) {
    if (rateAnalysisWorkItems.length !== 0) {
      if (buildingWorkItems.length === 0) {
        for (let workItem of rateAnalysisWorkItems) {
          buildingWorkItems.push(workItem);
        }
      } else {
        for (let workItem of rateAnalysisWorkItems) {
          let buildingWorkItem = this.getFilterData(workItem.name, buildingWorkItems);
          if (buildingWorkItem !== null) {
            let rateAnalysisWorkItem = this.getFilterData(workItem.name, rateAnalysisWorkItems);
            buildingWorkItem[0].unit = rateAnalysisWorkItem[0].unit;
            this.checkRateItemExist(buildingWorkItem[0].rate, rateAnalysisWorkItem[0].rate);
            this.checkRateItemExist(buildingWorkItem[0].systemRate, rateAnalysisWorkItem[0].systemRate);
          } else {
            buildingWorkItems.push(workItem);
            logger.info(workItem.name);
          }
        }
      }
    }
  }

  checkRateItemExist(buildingRate: any, rateAnalysisRate: any) {
    if (rateAnalysisRate.rateItems.length !== 0) {
      if (buildingRate.rateItems.length === 0) {
        for (let rateItem of rateAnalysisRate.rateItems) {
          buildingRate.rateItems.push(rateItem);
        }
      }else {
        if(buildingRate.unit !== rateAnalysisRate.unit) {
          buildingRate.unit = rateAnalysisRate.unit;
        }
      }
    }
  }

  getFilterData(element: string, arrayOfElement: any) {
    const elementObject = arrayOfElement.filter(
      function (elementObj: any) {
        if ((elementObj.name).trim() === element) {
          return elementObj.name === element;
        } else {
          return null;
        }
      });
    if (elementObject.length !== 0) {
      return elementObject;
    } else {
      return null;
    }
  }


  synchRatesWithLatestRateAnalysis(buildingRateArray: any, rateAnalysisRates: any) {
    for (let rate of rateAnalysisRates) {
      let buildingCostHead = this.getFilterRateData(rate.itemName, buildingRateArray);
      if (buildingCostHead === null) {
        buildingRateArray.push(rate);
        console.log(rate.itemName);
      }
    }
    return buildingRateArray;
  }

  getFilterRateData(element: string, arrayOfElement: any) {
    const elementObject = arrayOfElement.filter(
      function (elementObj: any) {
        if (elementObj.itemName === element) {
          return elementObj.itemName === element;
        } else {
          return null;
        }
      });
    if (elementObject.length !== 0) {
      return elementObject;
    } else {
      return null;
    }
  }

  updateCostHeadsAndCentralizedRatesOfBuilding(buildingId: string, costHeadList: Array<CostHead>, centralizedRates: Array<any>) {
    let query = {'_id': buildingId};
    let newData = {$set: {'costHeads': costHeadList, 'rates': centralizedRates}};
    this.buildingRepository.findOneAndUpdate(query, newData, {new: true}, (err, response) => {
    });
  }

  updateCostHeadsAndCentralizedRatesOfProject(projectId: string, projectCostHeads:Array<CostHead>, centralizedRates: Array<any>) {
    let query = {'_id': projectId};
    let newData = {$set: {'projectCostHeads': projectCostHeads, 'rates': centralizedRates}};
    this.projectRepository.findOneAndUpdate(query, newData, {new: true}, (err, response) => {
    });
  }
}

Object.seal(RateAnalysisService);
export = RateAnalysisService;
