import ProjectRepository = require('../dataaccess/repository/ProjectRepository');
import BuildingRepository = require('../dataaccess/repository/BuildingRepository');
import UserService = require('./../../framework/services/UserService');
import ProjectAsset = require('../../framework/shared/projectasset');
import User = require('../../framework/dataaccess/mongoose/user');
import Building = require('../dataaccess/mongoose/Building');
import BuildingReport = require('../dataaccess/model/project/reports/BuildingReport');
import ThumbRuleReport = require('../dataaccess/model/project/reports/ThumbRuleReport');
import AuthInterceptor = require('../../framework/interceptor/auth.interceptor');
import CostHead = require('../dataaccess/mongoose/CostHead');
import EstimateReport = require('../dataaccess/model/project/reports/EstimateReport');
import ProjectReport = require('../dataaccess/model/project/reports/ProjectReport');
import ThumbRule = require('../dataaccess/model/project/building/ThumbRule');
import Estimate = require('../dataaccess/model/project/building/Estimate');
import RateAnalysisService = require('./RateAnalysisService');
import Category = require('../dataaccess/model/project/building/Category');
import alasql = require('alasql');
import Constants = require('../shared/constants');
import ProjectService = require('./ProjectService');
import CentralizedRate = require('../dataaccess/model/project/CentralizedRate');
import MaterialDetailDTO = require("../dataaccess/dto/project/MaterialDetailDTO");
import WorkItem = require("../dataaccess/model/project/building/WorkItem");
import {QuantityDetails} from "../../../../client/app/build-info/framework/model/quantity-details";
import MaterialTakeOffFlatDetailsDTO = require("../dataaccess/dto/Report/MaterialTakeOffFlatDetailsDTO");
import MaterialTakeOffFiltersListDTO = require("../dataaccess/dto/Report/MaterialTakeOffFiltersListDTO");
let config = require('config');
var log4js = require('log4js');
var logger=log4js.getLogger('Report Service');

class ReportService {
  APP_NAME: string;
  company_name: string;
  private projectRepository: ProjectRepository;
  private buildingRepository: BuildingRepository;
  private authInterceptor: AuthInterceptor;
  private userService : UserService;
  private rateAnalysisService : RateAnalysisService;
  private projectService : ProjectService;

  constructor() {
    this.projectRepository = new ProjectRepository();
    this.buildingRepository = new BuildingRepository();
    this.APP_NAME = ProjectAsset.APP_NAME;
    this.authInterceptor = new AuthInterceptor();
    this.userService = new UserService();
    this.rateAnalysisService = new RateAnalysisService();
  }

  getReport( projectId : any, reportType : string, rateUnit : string, areaType : string,  user: User,
             callback: (error: any, result: any) => void) {

    logger.info('Report Service, getReport has been hit');
    let query = { _id: projectId};
    let populate = {path : 'buildings'};
    this.projectRepository.findAndPopulate(query, populate, (error, result) => {
      logger.info('Report Service, findAndPopulate has been hit');
      if(error) {
        callback(error, null);
      } else {
        let buildings = result[0].buildings;
        var typeOfArea: string;
        let choice = areaType;
        switch (choice) {
          case Constants.SLAB_AREA:
          {
            typeOfArea = Constants.TOTAL_SLAB_AREA;
            break;
          }

          case Constants.SALEABLE_AREA:
          {
            typeOfArea = Constants.TOTAL_SALEABLE_AREA;
            break;
          }

          case  Constants.CARPET_AREA :
          {
            typeOfArea = Constants.TOTAL_CARPET_AREA;
            break;
          }
          default :  callback(error,null);
        }

        let totalArea = alasql('VALUE OF SELECT ROUND(SUM('+typeOfArea+'),2) FROM ?',[buildings]);
        let projectReport : ProjectReport = new ProjectReport();

        projectReport.buildings = this.generateReportByCostHeads(buildings, typeOfArea, rateUnit);

        let projectCostHeads = result[0].projectCostHeads;
        let projectRates = result[0].rates;
        if(projectCostHeads!== null) {
          projectReport.commonAmenities = this.generateReportForProjectCostHeads(projectCostHeads, projectRates, totalArea, rateUnit);
        } else {
          callback(null,error);
        }
        callback(null,{ data: projectReport, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  generateReportByCostHeads( buildings:  Array<Building> , typeOfArea: string, rateUnit: string) {

    let buildingsReport : Array<BuildingReport> = new Array<BuildingReport>();
    for (let building of buildings) {
      let buildingReport = new BuildingReport;
      buildingReport.name = building.name;
      buildingReport._id = building._id;
      buildingReport.area = building[typeOfArea];

      let thumbRule  = new ThumbRule();
      let estimate  = new Estimate();
      let thumbRuleReports = new Array<ThumbRuleReport>();
      let estimatedReports = new Array<EstimateReport>();


      this.getThumbRuleAndEstimatedReport(building, buildingReport, thumbRuleReports, estimatedReports, rateUnit);

      let totalRates = alasql('SELECT ROUND(SUM(amount),2) AS totalAmount, ROUND(SUM(rate),2) AS totalRate FROM ?',[thumbRuleReports]);
      thumbRule.totalRate = totalRates[0].totalRate;
      if(rateUnit === Constants.SQUREMETER_UNIT) {
        thumbRule.totalRate =  parseFloat((thumbRule.totalRate * config.get(Constants.SQUARE_METER)).toFixed(2));
      }
      thumbRule.totalBudgetedCost = totalRates[0].totalAmount;
      thumbRule.thumbRuleReports = thumbRuleReports;

      let totalEstimatedRates = alasql('SELECT ROUND(SUM(total),2) AS totalAmount, ROUND(SUM(rate),2) AS totalRate FROM ?',[estimatedReports]);
      estimate.totalRate = totalEstimatedRates[0].totalRate;
      if(rateUnit === Constants.SQUREMETER_UNIT) {
        estimate.totalRate =  parseFloat((estimate.totalRate * config.get(Constants.SQUARE_METER)).toFixed(2));
      }
      estimate.totalEstimatedCost = totalEstimatedRates[0].totalAmount;
      estimate.estimatedCosts = estimatedReports;

      buildingReport.thumbRule = thumbRule;
      buildingReport.estimate = estimate;
      buildingsReport.push(buildingReport);
    }
    return(buildingsReport);
  }


  getThumbRuleAndEstimatedReport(building :Building, buildingReport: BuildingReport,
                                 thumbRuleReports: ThumbRuleReport[], estimatedReports: EstimateReport[], rateUnit:string) {

    for (let costHead of building.costHeads) {

      if(costHead.active) {
        //ThumbRule Report
        let thumbRuleReport = new ThumbRuleReport();
        thumbRuleReport.name = costHead.name;
        thumbRuleReport.rateAnalysisId = costHead.rateAnalysisId;
        thumbRuleReport.amount = parseFloat((costHead.budgetedCostAmount).toFixed(Constants.NUMBER_OF_FRACTION_DIGIT));
        thumbRuleReport.costHeadActive = costHead.active;
        thumbRuleReport.rate = parseFloat((thumbRuleReport.amount / buildingReport.area).toFixed(2));
        if(rateUnit === Constants.SQUREMETER_UNIT) {
          thumbRuleReport.rate = parseFloat((thumbRuleReport.rate * config.get(Constants.SQUARE_METER)).toFixed(2));
        }
        thumbRuleReports.push(thumbRuleReport);

        //Estimated cost Report
        let estimateReport = new EstimateReport();
        estimateReport = this.getEstimatedReport(building.rates, costHead, buildingReport.area, rateUnit);
        estimatedReports.push(estimateReport);
      }
    }
  }

  getEstimatedReport(centralizedRates:Array<CentralizedRate>, costHead: any, area:number, rateUnit:string) {

    let estimateReport = new EstimateReport();
    estimateReport.name = costHead.name;
    estimateReport.rateAnalysisId = costHead.rateAnalysisId;

    let costHeadCategories: Array<Category> = costHead.categories;
    let projectService : ProjectService = new ProjectService();
    let categoriesObj = projectService.getCategoriesListWithCentralizedRates(costHeadCategories, centralizedRates);
    estimateReport.total = categoriesObj.categoriesAmount;
    estimateReport.rate = parseFloat((estimateReport.total / area).toFixed(2));
    if(rateUnit === Constants.SQUREMETER_UNIT) {
      estimateReport.rate = parseFloat((estimateReport.rate * config.get(Constants.SQUARE_METER)).toFixed(2));
    }
    return estimateReport;
  }

  generateReportForProjectCostHeads(projectCostHeads:  Array<CostHead>, projectRates: Array<CentralizedRate>, totalArea: number,
                                     rateUnit: string) {
    let commonAmenitiesReport : Array<BuildingReport> = new Array<BuildingReport>();
      let projectReport = new BuildingReport;
      projectReport.name = Constants.AMENITIES;
      projectReport.area = totalArea;

      let thumbRule  = new ThumbRule();
      let estimate  = new Estimate();
      let thumbRuleReports = new Array<ThumbRuleReport>();
      let estimatedReports = new Array<EstimateReport>();


      this.getThumbRuleAndEstimatedReportForProjectCostHead(projectCostHeads, projectRates,
        projectReport, thumbRuleReports, estimatedReports, totalArea, rateUnit);

      let totalRates = alasql('SELECT SUM(amount) AS totalAmount, SUM(rate) AS totalRate FROM ?',[thumbRuleReports]);
      thumbRule.totalRate = totalRates[0].totalRate;
      if(rateUnit === Constants.SQUREMETER_UNIT) {
        thumbRule.totalRate =  parseFloat((thumbRule.totalRate * config.get(Constants.SQUARE_METER)).toFixed(2));
      }
      thumbRule.totalBudgetedCost = totalRates[0].totalAmount;
      thumbRule.thumbRuleReports = thumbRuleReports;

      let totalEstimatedRates = alasql('SELECT SUM(total) AS totalAmount, SUM(rate) AS totalRate FROM ?',[estimatedReports]);
      estimate.totalRate = totalEstimatedRates[0].totalRate;
      if(rateUnit === Constants.SQUREMETER_UNIT) {
        estimate.totalRate =  parseFloat((estimate.totalRate * config.get(Constants.SQUARE_METER)).toFixed(2));
      }
      estimate.totalEstimatedCost = totalEstimatedRates[0].totalAmount;
      estimate.estimatedCosts = estimatedReports;

      projectReport.thumbRule = thumbRule;
      projectReport.estimate = estimate;
    commonAmenitiesReport.push(projectReport);
    return(commonAmenitiesReport);
  }

  getThumbRuleAndEstimatedReportForProjectCostHead(projectCostHead: Array<CostHead>, projectRates: Array<CentralizedRate>, projectReport: BuildingReport, thumbRuleReports: ThumbRuleReport[],
                                                   estimatedReports: EstimateReport[], totalArea:number, rateUnit:string) {
  for (let costHead  of projectCostHead) {
    if (costHead.active) {
      //ThumbRule Report
      let thumbRuleReport = new ThumbRuleReport();
      thumbRuleReport.name = costHead.name;
      thumbRuleReport.rateAnalysisId = costHead.rateAnalysisId;
      thumbRuleReport.amount = costHead.budgetedCostAmount;
      thumbRuleReport.costHeadActive = costHead.active;
      thumbRuleReport.rate = parseFloat((costHead.budgetedCostAmount / totalArea).toFixed(2));
      if (rateUnit === Constants.SQUREMETER_UNIT) {
        thumbRuleReport.rate = parseFloat((thumbRuleReport.rate * config.get(Constants.SQUARE_METER)).toFixed(2));
      }
      thumbRuleReports.push(thumbRuleReport);

      //Estimated cost Report
      let estimateReport = new EstimateReport();
      estimateReport = this.getEstimatedReport(projectRates, costHead, totalArea, rateUnit);
      estimatedReports.push(estimateReport);
    }
   }
  }


  getCostHeads(  url: string , user: User,callback: (error: any, result: any) => void) {
    logger.info('Report Service, getCostHeads has been hit');
    this.rateAnalysisService.getCostHeads( url, user,(error, result) => {
      if(error) {
        console.log('error : '+JSON.stringify(error));
        callback(error, null);
      } else {
        callback(null,{ data: result, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  getWorkItems( url: string , user: User, callback: (error: any, result: any) => void) {
    logger.info('Report Service, getWorkItems has been hit');
    this.rateAnalysisService.getWorkItems( url, user,(error, result) => {
      if(error) {
        console.log('error : '+JSON.stringify(error));
        callback(error, null);
      } else {
        callback(null,{ data: result, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  getMaterialDetails( projectId : any, user: User,
                      callback: (error: any, result: any) => void) {

    logger.info('Report Service, getMaterialDetails has been hit');
    let query = { _id: projectId};
    let populate = {path : 'buildings'};
    this.projectRepository.findAndPopulate(query, populate, (error, result) => {
      logger.info('Report Service, findAndPopulate has been hit');
      if(error) {
        callback(error, null);
      } else {
        callback(null, this.getBuildingMaterialDetails(result[0].buildings));
      }
    });
  }

  getBuildingMaterialDetails(buildings : Array<Building>): Array<MaterialTakeOffFlatDetailsDTO> {
    let materialTakeOffFlatDetailsArray : Array<MaterialTakeOffFlatDetailsDTO>= new Array<MaterialTakeOffFlatDetailsDTO>();
    let buildingName: string;
    for(let building: Building of buildings) {
      buildingName = building.name;
      this.addMaterialDTOForActiveCostHeadInDTOArray(building, buildingName, materialTakeOffFlatDetailsArray);

    }
    return materialTakeOffFlatDetailsArray;
  }

  getMaterialFilters( projectId : any, user: User,
                      callback: (error: any, result: any) => void) {

    logger.info('Report Service, getMaterialFilters has been hit');
    let query = { _id: projectId};
    let populate = {path : 'buildings'};
    this.projectRepository.findAndPopulate(query, populate, (error, result) => {
      logger.info('Report Service, findAndPopulate has been hit');
      if(error) {
        callback(error, null);
      } else {
        callback(null, this.getMaterialTakeOffFilterObject(result[0].buildings));
      }
    });
  }

  private getMaterialTakeOffFilterObject(buildings: Array<Building>) {
    let materialTakeOffFlatDetailsArray: Array<MaterialTakeOffFlatDetailsDTO> = this.getBuildingMaterialDetails(buildings);
    let column: string = 'buildingName';
    let buildingList: Array<string> = this.getDistinctArrayOfStringFromAlasql(column, materialTakeOffFlatDetailsArray);
    column = 'costHeadName';
    let costHeadList: Array<string> = this.getDistinctArrayOfStringFromAlasql(column, materialTakeOffFlatDetailsArray);
    column = 'materialName';
    let materialList: Array<string> = this.getDistinctArrayOfStringFromAlasql(column, materialTakeOffFlatDetailsArray);
    let materialTakeOffFiltersObject: MaterialTakeOffFiltersListDTO = new MaterialTakeOffFiltersListDTO(buildingList, costHeadList, materialList);
    return materialTakeOffFiltersObject;
  }

  private getDistinctArrayOfStringFromAlasql(column: string, materialTakeOffFlatDetailsArray: Array<MaterialTakeOffFlatDetailsDTO>) {
    let sqlQuery: string = 'SELECT DISTINCT flatData.' + column + ' FROM ? AS flatData';
    let distinctObjectArray = alasql(sqlQuery, [materialTakeOffFlatDetailsArray]);
    let distinctNameStringArray: Array<string> = new Array<string>();
    for(let distinctObject of distinctObjectArray) {
      distinctNameStringArray.push(distinctObject[column]);
    }
    return distinctNameStringArray;
  }

  private addMaterialDTOForActiveCostHeadInDTOArray(building: Building, buildingName: string,
                                                    materialTakeOffFlatDetailsArray: Array<MaterialTakeOffFlatDetailsDTO>) {
    let costHeadName;
    for (let costHead: CostHead of building.costHeads) {
      if (costHead.active) {
        costHeadName = costHead.name;
        this.addMaterialDTOForActiveCategoryInDTOArray(costHead, buildingName, costHeadName, materialTakeOffFlatDetailsArray);
      }
    }
  }

  private addMaterialDTOForActiveCategoryInDTOArray(costHead: CostHead, buildingName: string, costHeadName: string,
                                                    materialTakeOffFlatDetailsArray: Array<MaterialTakeOffFlatDetailsDTO>) {
    let categoryName: string;
    for (let category: Category of costHead.categories) {
      if (category.active) {
        categoryName = category.name;
        this.addMaterialDTOForActiveWorkitemInDTOArray(category, buildingName, costHeadName, categoryName, materialTakeOffFlatDetailsArray);
      }
    }
  }

  private addMaterialDTOForActiveWorkitemInDTOArray(category: Category, buildingName: string, costHeadName: string,
                      categoryName: string, materialTakeOffFlatDetailsArray: Array<MaterialTakeOffFlatDetailsDTO>) {
    let workItemName: string;
    for (let workItem: WorkItem of category.workItems) {
      if (workItem.active) {
        workItemName = workItem.name;
        this.createMaterialDTOObjectForEstimatedQuantityAndRate(workItem, buildingName, costHeadName, categoryName,
          workItemName, materialTakeOffFlatDetailsArray);
      }
    }
  }

  private createMaterialDTOObjectForEstimatedQuantityAndRate(workItem: WorkItem, buildingName: string, costHeadName: string,
                  categoryName : string, workItemName: string, materialTakeOffFlatDetailsArray: Array<MaterialTakeOffFlatDetailsDTO>) {
    let quantityName: string;
    if (workItem.quantity.isEstimated && workItem.rate.isEstimated) {
      for (let quantity: QuantityDetails of workItem.quantity.quantityItemDetails) {
        quantityName = quantity.name;
        for (let rateItem of workItem.rate.rateItems) {
          let materialTakeOffFlatDetailDTO = new MaterialTakeOffFlatDetailsDTO(buildingName, costHeadName, categoryName,
            workItemName, rateItem.itemName, quantityName, rateItem.quantity, rateItem.unit);
          materialTakeOffFlatDetailsArray.push(materialTakeOffFlatDetailDTO);
        }
      }
    }
  }

}

Object.seal(ReportService);
export = ReportService;

