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

let request = require('request');
let config = require('config');
var log4js = require('log4js');
var logger = log4js.getLogger('Rate Analysis Service');

let CCPromise = require('promise/lib/es6-extensions');

class RateAnalysisService {
  APP_NAME: string;
  company_name: string;
  private authInterceptor: AuthInterceptor;
  private userService: UserService;
  private rateAnalysisRepository: RateAnalysisRepository;

  constructor() {
    this.APP_NAME = ProjectAsset.APP_NAME;
    this.authInterceptor = new AuthInterceptor();
    this.userService = new UserService();
    this.rateAnalysisRepository = new RateAnalysisRepository();
  }

  getCostHeads(url: string, user: User, callback: (error: any, result: any) => void) {
    logger.info('Rate Analysis Service, getCostHeads has been hit');
    request.get({url: url}, function (error: any, response: any, body: any) {
      if (error) {
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
      if (error) {
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
      if (error) {
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
        let res = JSON.parse(body);
        callback(null, res);
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

  convertCostHeadsFromRateAnalysisToCostControl(entity: string, callback: (error: any, data: any) => void) {
    logger.info('convertCostHeadsFromRateAnalysisToCostControl has been hit');

    let costHeadURL = config.get(Constants.RATE_ANALYSIS_API + entity + Constants.RATE_ANALYSIS_COSTHEADS);
    let costHeadRateAnalysisPromise = this.createPromise(costHeadURL);
    logger.info('costHeadRateAnalysisPromise for has been hit');

    let categoryURL = config.get(Constants.RATE_ANALYSIS_API + entity + Constants.RATE_ANALYSIS_CATEGORIES);
    let categoryRateAnalysisPromise = this.createPromise(categoryURL);
    logger.info('categoryRateAnalysisPromise for has been hit');

    let workItemURL = config.get(Constants.RATE_ANALYSIS_API + entity + Constants.RATE_ANALYSIS_WORKITEMS);
    let workItemRateAnalysisPromise = this.createPromise(workItemURL);
    logger.info('workItemRateAnalysisPromise for has been hit');

    let rateItemURL = config.get(Constants.RATE_ANALYSIS_API + entity + Constants.RATE_ANALYSIS_RATE);
    let rateItemRateAnalysisPromise = this.createPromise(rateItemURL);
    logger.info('rateItemRateAnalysisPromise for has been hit');

    let rateAnalysisNotesURL = config.get(Constants.RATE_ANALYSIS_API + entity + Constants.RATE_ANALYSIS_NOTES);
    let notesRateAnalysisPromise = this.createPromise(rateAnalysisNotesURL);
    logger.info('notesRateAnalysisPromise for has been hit');

    let allUnitsFromRateAnalysisURL = config.get(Constants.RATE_ANALYSIS_API + entity + Constants.RATE_ANALYSIS_UNIT);
    let unitsRateAnalysisPromise = this.createPromise(allUnitsFromRateAnalysisURL);
    logger.info('unitsRateAnalysisPromise for has been hit');

    logger.info('calling Promise.all');
    CCPromise.all([
      costHeadRateAnalysisPromise,
      categoryRateAnalysisPromise,
      workItemRateAnalysisPromise,
      rateItemRateAnalysisPromise,
      notesRateAnalysisPromise,
      unitsRateAnalysisPromise
    ]).then(function (data: Array<any>) {
      logger.info('convertCostHeadsFromRateAnalysisToCostControl Promise.all API is success.');
      let costHeadsRateAnalysis = data[0][Constants.RATE_ANALYSIS_ITEM_TYPE];
      let categoriesRateAnalysis = data[1][Constants.RATE_ANALYSIS_SUBITEM_TYPE];
      let workItemsRateAnalysis = data[2][Constants.RATE_ANALYSIS_ITEMS];
      let rateItemsRateAnalysis = data[3][Constants.RATE_ANALYSIS_DATA];
      let notesRateAnalysis = data[4][Constants.RATE_ANALYSIS_DATA];
      let unitsRateAnalysis = data[5][Constants.RATE_ANALYSIS_UOM];

      let buildingCostHeads: Array<CostHead> = [];
      let rateAnalysisService = new RateAnalysisService();

      rateAnalysisService.getCostHeadsFromRateAnalysis(costHeadsRateAnalysis, categoriesRateAnalysis, workItemsRateAnalysis,
        rateItemsRateAnalysis, unitsRateAnalysis, notesRateAnalysis, buildingCostHeads);
      logger.info('success in  convertCostHeadsFromRateAnalysisToCostControl.');
      callback(null, {
        'buildingCostHeads': buildingCostHeads,
        'rates': rateItemsRateAnalysis,
        'units': unitsRateAnalysis
      });
    }).catch(function (e: any) {
      logger.error(' Promise failed for convertCostHeadsFromRateAnalysisToCostControl ! :' + JSON.stringify(e.message));
      CCPromise.reject(e.message);
    });
  }

  createPromise(url: string) {
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
    }).catch(function (e: any) {
      logger.error('Promise failed for individual ! url:' + url + ':\n error :' + JSON.stringify(e.message));
      CCPromise.reject(e.message);
    });
  }

  getCostHeadsFromRateAnalysis(costHeadsRateAnalysis: any, categoriesRateAnalysis: any,
                               workItemsRateAnalysis: any, rateItemsRateAnalysis: any,
                               unitsRateAnalysis: any, notesRateAnalysis: any,
                               buildingCostHeads: Array<CostHead>) {
    logger.info('getCostHeadsFromRateAnalysis has been hit.');
    //let budgetCostHeads = config.get('budgetedCostFormulae');
    for (let costHeadIndex = 0; costHeadIndex < costHeadsRateAnalysis.length; costHeadIndex++) {

    if(config.has('budgetedCostFormulae.'+ costHeadsRateAnalysis[costHeadIndex].C2)) {
      let costHead = new CostHead();
      costHead.name = costHeadsRateAnalysis[costHeadIndex].C2;
      let configCostHeads = config.get('configCostHeads');
      let categories = new Array<Category>();

        if (configCostHeads.length > 0) {
          let isCostHeadExistSQL = 'SELECT * FROM ? AS workitems WHERE TRIM(workitems.name)= ?';
          let costHeadExistArray = alasql(isCostHeadExistSQL,[configCostHeads, costHead.name]);
          if(costHeadExistArray.length !== 0 ) {
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
            rateItemsRateAnalysis, unitsRateAnalysis, notesRateAnalysis, buildingCategories, categories);
        } else {
          this.getCategoriesFromRateAnalysis(categoriesByCostHead, workItemsRateAnalysis,
            rateItemsRateAnalysis, unitsRateAnalysis, notesRateAnalysis, buildingCategories, categories);
        }

        costHead.categories = buildingCategories;
        costHead.thumbRuleRate = config.get(Constants.THUMBRULE_RATE);
        buildingCostHeads.push(costHead);
      } else {
        console.log('CostHead Unavaialabel : '+costHeadsRateAnalysis[costHeadIndex].C2);
      }
    }
  }

  getCategoriesFromRateAnalysis(categoriesByCostHead: any, workItemsRateAnalysis: any,
                                rateItemsRateAnalysis: any, unitsRateAnalysis: any,
                                notesRateAnalysis: any, buildingCategories: Array<Category>, configCategories: Array<Category>) {

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

      let workItemsRateAnalysisSQL = 'SELECT workItem.C2 AS rateAnalysisId, workItem.C3 AS name' +
        ' FROM ? AS workItem where workItem.C4 = ' + categoriesByCostHead[categoryIndex].rateAnalysisId;

      let workItemsByCategory = alasql(workItemsRateAnalysisSQL, [workItemsRateAnalysis]);
      let buildingWorkItems: Array<WorkItem> = new Array<WorkItem>();

      this.getWorkItemsFromRateAnalysis(workItemsByCategory, rateItemsRateAnalysis,
        unitsRateAnalysis, notesRateAnalysis, buildingWorkItems, configWorkItems);

      category.workItems = buildingWorkItems;
      buildingCategories.push(category);
    }

    if(configCategories.length > 0) {

      for(let configCategoryIndex=0; configCategoryIndex < configCategories.length; configCategoryIndex++) {
        let isCategoryExistsSQL = 'SELECT * FROM ? AS workitems WHERE TRIM(workitems.name)= ?';
        let categoryExistsArray = alasql(isCategoryExistsSQL,[categoriesByCostHead, configCategories[configCategoryIndex].name]);
        if(categoryExistsArray.length === 0) {
          let configCat = new Category(configCategories[configCategoryIndex].name, configCategories[configCategoryIndex].rateAnalysisId);
          configCat.workItems = this.getWorkitemsForConfigCategory(configCategories[configCategoryIndex].workItems);
          buildingCategories.push(configCat);
        }
      }
    }
  }

  getWorkitemsForConfigCategory(configWorkitems:any) {
    let workItemsList = new Array<WorkItem>();
    for(let workitemIndex=0; workitemIndex < configWorkitems.length; workitemIndex++) {
      let configWorkitem = this.convertConfigorkitem(configWorkitems[workitemIndex]);
      workItemsList.push(configWorkitem);
    }
    return workItemsList;
  }

  getWorkItemsWithoutCategoryFromRateAnalysis(costHeadRateAnalysisId: number, workItemsRateAnalysis: any,
                                              rateItemsRateAnalysis: any, unitsRateAnalysis: any,
                                              notesRateAnalysis: any, buildingCategories: Array<Category>,
                                              configCategories: Array<Category>) {

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
      unitsRateAnalysis, notesRateAnalysis, buildingWorkItems, configWorkItems);

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
                               unitsRateAnalysis: any, notesRateAnalysis: any,
                               buildingWorkItems: Array<WorkItem>, configWorkItems: Array<any>) {

    logger.info('getWorkItemsFromRateAnalysis has been hit.');
    for (let categoryWorkitem of workItemsByCategory) {
        let workItem = this.getRateAnalysis(categoryWorkitem, configWorkItems, rateItemsRateAnalysis,
          unitsRateAnalysis, notesRateAnalysis);
        if(workItem) {
          buildingWorkItems.push(workItem);
        }
    }
    for(let configWorkItem of configWorkItems) {
      let isWorkItemExistSQL = 'SELECT * FROM ? AS workitems WHERE TRIM(workitems.name)= ?';
      let workItemExistArray = alasql(isWorkItemExistSQL,[workItemsByCategory, configWorkItem.name]);
      if(workItemExistArray.length === 0 && configWorkItem.rateAnalysisId) {
        let workitem = this.convertConfigorkitem(configWorkItem);
        buildingWorkItems.push(workitem);
      }
    }
  }

  convertConfigorkitem(configWorkItem : any) {

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

    if(!configWorkItem.isRateAnalysis) {
      workItem.rate.total = configWorkItem.directRate;
      workItem.rate.unit = configWorkItem.directRatePerUnit;
      workItem.rate.isEstimated = true;
    }

    return workItem;
  }

  getRateAnalysis(categoryWorkitem: WorkItem, configWorkItems: Array<any>, rateItemsRateAnalysis: any,
                            unitsRateAnalysis: any, notesRateAnalysis: any) {

    let isWorkItemExistSQL = 'SELECT * FROM ? AS workitems WHERE TRIM(workitems.name)= ?';
    let workItemExistArray = alasql(isWorkItemExistSQL,[configWorkItems, categoryWorkitem.name]);

    if(workItemExistArray.length !== 0) {

      let  workItem = new WorkItem(categoryWorkitem.name, categoryWorkitem.rateAnalysisId);

      if(categoryWorkitem.active!==undefined && categoryWorkitem.active!==null) {
        workItem = categoryWorkitem;
      }

      workItem.unit = workItemExistArray[0].measurementUnit;
      workItem.isMeasurementSheet = workItemExistArray[0].isMeasurementSheet;
      workItem.isRateAnalysis = workItemExistArray[0].isRateAnalysis;
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

      if (rateItemsByWorkItem && rateItemsByWorkItem.length > 0) {
        let notesRateAnalysisSQL = 'SELECT notes.C2 AS notes, notes.C3 AS imageURL FROM ? AS notes where notes.C1 = '+
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
      workItem.rate.imageURL =imageURL;

      //System rate

      workItem.systemRate.rateItems = rateItemsByWorkItem;
      workItem.systemRate.notes = notes;
      workItem.systemRate.imageURL = imageURL;
      return workItem;
    }
    return null;
  }

  SyncRateAnalysis() {
    let rateAnalysisService = new RateAnalysisService();
    this.convertCostHeadsFromRateAnalysisToCostControl(Constants.BUILDING, (error: any, buildingData: any)=> {
      if(error) {
        logger.error('RateAnalysis Sync Failed.');
      } else {
        this.convertCostHeadsFromRateAnalysisToCostControl(Constants.BUILDING, (error: any, projectData: any)=> {
          if (error) {
            logger.error('RateAnalysis Sync Failed.');
          } else {
            let buildingCostHeads = JSON.parse(JSON.stringify(buildingData.buildingCostHeads));
            let projectCostHeads = JSON.parse(JSON.stringify(projectData.buildingCostHeads));
            let configCostHeads = config.get('configCostHeads');
            let configProjectCostHeads = config.get('configProjectCostHeads');
            let fixedCostConfigProjectCostHeads = config.get('fixedCostConfigProjectCostHeads');
            this.convertConfigCostHeads(configCostHeads, buildingCostHeads);
            this.convertConfigCostHeads(configProjectCostHeads, projectCostHeads);
            this.convertConfigCostHeads(fixedCostConfigProjectCostHeads, projectCostHeads);
            buildingCostHeads = alasql('SELECT * FROM ? ORDER BY priorityId', [buildingCostHeads]);
            projectCostHeads = alasql('SELECT * FROM ? ORDER BY priorityId', [projectCostHeads]);
            let buildingRates = this.getRates(buildingData, buildingCostHeads);
            let projectRates = this.getRates(projectData, projectCostHeads);
            let rateAnalysis = new RateAnalysis(buildingCostHeads, buildingRates, projectCostHeads, projectRates);
            this.saveRateAnalysis(rateAnalysis);
          }
        });
      }
    });
  }

  convertConfigCostHeads(configCostHeads: Array<any>, costHeadsData: Array<CostHead>) {

    for (let configCostHead of configCostHeads) {

      let costHeadExistSQL = 'SELECT * FROM ? AS costHeads WHERE costHeads.name= ?';
      let costHeadExistArray = alasql(costHeadExistSQL,[costHeadsData,configCostHead.name]);

      if(costHeadExistArray.length === 0 && configCostHead.rateAnalysisId) {
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

  saveRateAnalysis(rateAnalysis: RateAnalysis) {
    logger.info('saveRateAnalysis is been hit');
    let query = {};
    this.rateAnalysisRepository.retrieve({}, (error:any, rateAnalysisArray: Array<RateAnalysis>) => {
      if(error) {
        logger.error('Unable to retrive synced RateAnalysis');
      } else {
        if(rateAnalysisArray.length >0) {
          query = { _id : rateAnalysisArray[0]._id};
          let update = {$set: {
            'projectCostHeads': rateAnalysis.projectCostHeads,
            'projectRates': rateAnalysis.projectRates,
            'buildingCostHeads': rateAnalysis.buildingCostHeads,
            'buildingRates': rateAnalysis.buildingRates
          }};
          this.rateAnalysisRepository.findOneAndUpdate(query, update,{new: true},(error: any, rateAnalysisArray: RateAnalysis) => {
            if(error) {
              logger.error('saveRateAnalysis failed => ' + error.message);
            }else {
              logger.info('Updated RateAnalysis.');
            }
          });
        }else {
          this.rateAnalysisRepository.create(rateAnalysis, (error: any, result: RateAnalysis) => {
            if(error) {
              logger.error('saveRateAnalysis failed => ' + error.message);
            }else {
              logger.info('Saved RateAnalysis.');
            }
          });
        }
      }
    });
  }

  getCostControlRateAnalysis(query: any, projection: any, callback: (error: any, rateAnalysis: RateAnalysis) => void) {
    this.rateAnalysisRepository.retrieveWithProjection(query, projection,(error: any, rateAnalysisArray: Array<RateAnalysis>) => {
      if(error) {
        callback(error, null);
      } else {
        if(rateAnalysisArray.length === 0) {
          logger.error('ContControl RateAnalysis not found.');
          callback('ContControl RateAnalysis not found.', null);
        }else {
          callback(null, rateAnalysisArray[0]);
        }
      }
    });
  }

  getAggregateData(query: any, callback:(error:any, aggregateData: any) =>void) {
    this.rateAnalysisRepository.aggregate(query,callback);
  }
}


Object.seal(RateAnalysisService);
export = RateAnalysisService;
