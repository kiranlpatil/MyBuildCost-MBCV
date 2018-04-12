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
import MaterialDetailDTO = require('../dataaccess/dto/project/MaterialDetailDTO');
import WorkItem = require('../dataaccess/model/project/building/WorkItem');
import {QuantityDetails} from '../../../../client/app/build-info/framework/model/quantity-details';
import MaterialTakeOffFlatDetailsDTO = require('../dataaccess/dto/Report/MaterialTakeOffFlatDetailsDTO');
import MaterialTakeOffFiltersListDTO = require('../dataaccess/dto/Report/MaterialTakeOffFiltersListDTO');
import {element} from 'protractor';
import MaterialTakeOffReport = require('../dataaccess/model/project/reports/MaterialTakeOffReport');
import MaterialTakeOffTableView = require("../dataaccess/model/project/reports/MaterialTakeOffTableView");
import MaterialTakeOffSecondaryView = require("../dataaccess/model/project/reports/MaterialTakeOffSecondaryView");
import MaterialTakeOffTableViewContent = require("../dataaccess/model/project/reports/MaterialTakeOffTableViewContent");
import MaterialTakeOffTableViewSubContent = require("../dataaccess/model/project/reports/MaterialTakeOffTableViewSubContent");
import MaterialTakeOffTableViewHeaders = require("../dataaccess/model/project/reports/MaterialTakeOffTableViewHeaders");
import MaterialTakeOffTableViewFooter = require("../dataaccess/model/project/reports/MaterialTakeOffTableViewFooter");
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
        let totalArea: number;
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
         let totalOfArea = alasql('VALUE OF SELECT ROUND(SUM('+typeOfArea+'),2) FROM ?',[buildings]);
        if(rateUnit === Constants.SQUREMETER_UNIT) {
         totalArea = Math.round(totalOfArea * config.get(Constants.SQUARE_METER));
        } else {
          totalArea = totalOfArea;
        }
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
      if(rateUnit === Constants.SQUREMETER_UNIT) {
        buildingReport.area =  Math.round( building[typeOfArea] * config.get(Constants.SQUARE_METER));
      } else {
        buildingReport.area = building[typeOfArea];
      }
      let thumbRule  = new ThumbRule();
      let estimate  = new Estimate();
      let thumbRuleReports = new Array<ThumbRuleReport>();
      let estimatedReports = new Array<EstimateReport>();


      this.getThumbRuleAndEstimatedReport(building, buildingReport, thumbRuleReports, estimatedReports, rateUnit);

      let totalRates = alasql('SELECT ROUND(SUM(amount),2) AS totalAmount, ROUND(SUM(rate),2) AS totalRate FROM ?',[thumbRuleReports]);
      thumbRule.totalRate = totalRates[0].totalRate;
    /*  if(rateUnit === Constants.SQUREMETER_UNIT) {
        thumbRule.totalRate =  parseFloat((thumbRule.totalRate * config.get(Constants.SQUARE_METER)).toFixed(2));
      }*/
      thumbRule.totalBudgetedCost = Math.round(totalRates[0].totalAmount);
      thumbRule.thumbRuleReports = thumbRuleReports;

      let totalEstimatedRates = alasql('SELECT ROUND(SUM(total),2) AS totalAmount, ROUND(SUM(rate),2) AS totalRate FROM ?',[estimatedReports]);
      estimate.totalRate = totalEstimatedRates[0].totalRate;
    /*  if(rateUnit === Constants.SQUREMETER_UNIT) {
        estimate.totalRate =  parseFloat((estimate.totalRate * config.get(Constants.SQUARE_METER)).toFixed(2));
      }*/
      estimate.totalEstimatedCost = Math.round(totalEstimatedRates[0].totalAmount);
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
        thumbRuleReport.amount = Math.round(costHead.budgetedCostAmount);
        thumbRuleReport.costHeadActive = costHead.active;
        thumbRuleReport.rate = parseFloat((thumbRuleReport.amount / buildingReport.area).toFixed(2));
   /*     if(rateUnit === Constants.SQUREMETER_UNIT) {
          thumbRuleReport.rate = parseFloat((thumbRuleReport.rate * config.get(Constants.SQUARE_METER)).toFixed(2));
        }*/
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
   /* if(rateUnit === Constants.SQUREMETER_UNIT) {
      estimateReport.rate = parseFloat((estimateReport.rate * config.get(Constants.SQUARE_METER)).toFixed(2));
    }*/
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

    let totalRates = alasql('SELECT ROUND(SUM(amount),2) AS totalAmount, ROUND(SUM(rate),2) AS totalRate FROM ?',[thumbRuleReports]);
      thumbRule.totalRate = totalRates[0].totalRate;
     /* if(rateUnit === Constants.SQUREMETER_UNIT) {
        thumbRule.totalRate =  parseFloat((thumbRule.totalRate * config.get(Constants.SQUARE_METER)).toFixed(2));
      }*/
      thumbRule.totalBudgetedCost = Math.round(totalRates[0].totalAmount);
      thumbRule.thumbRuleReports = thumbRuleReports;

    let totalEstimatedRates = alasql('SELECT ROUND(SUM(total),2) AS totalAmount, ROUND(SUM(rate),2) AS totalRate FROM ?',[estimatedReports]);
      estimate.totalRate = totalEstimatedRates[0].totalRate;
     /* if(rateUnit === Constants.SQUREMETER_UNIT) {
        estimate.totalRate =  parseFloat((estimate.totalRate * config.get(Constants.SQUARE_METER)).toFixed(2));
      }*/
      estimate.totalEstimatedCost =  Math.round(totalEstimatedRates[0].totalAmount);
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
      thumbRuleReport.amount = Math.round(costHead.budgetedCostAmount);
      thumbRuleReport.costHeadActive = costHead.active;
      thumbRuleReport.rate = parseFloat((thumbRuleReport.amount / totalArea).toFixed(2));
     /* if (rateUnit === Constants.SQUREMETER_UNIT) {
        thumbRuleReport.rate = parseFloat((thumbRuleReport.rate * config.get(Constants.SQUARE_METER)).toFixed(2));
      }*/
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

  getMaterialTakeOffReport( projectId : any, building: string, elementWiseReport: string, element: string, user: User,
                            callback: (error: any, result: any) => void) {

    logger.info('Report Service, getMaterialTakeOffReport has been hit');
    let query = { _id: projectId};
    let populate = {path : 'buildings'};
    this.projectRepository.findAndPopulate(query, populate, (error, result) => {
      logger.info('Report Service, findAndPopulate has been hit');
      if(error) {
        callback(error, null);
      } else {
        let materialTakeOffFlatDetailsArray: Array<MaterialTakeOffFlatDetailsDTO> = this.getBuildingMaterialDetails(result[0].buildings);
        let materialReportRowData =
          this.getMaterialDataFromFlatDetailsArray(elementWiseReport, element, building, materialTakeOffFlatDetailsArray);
        let materialTakeOffReport: MaterialTakeOffReport = new MaterialTakeOffReport(null, null);
        materialTakeOffReport.secondaryView = {};
          for(let record of materialReportRowData ) {
            if(materialTakeOffReport.secondaryView[record.header] !== undefined &&
              materialTakeOffReport.secondaryView[record.header] !== null) {         // check if material is in map
               let materialTakeOffSecondaryView : MaterialTakeOffSecondaryView =
                 materialTakeOffReport.secondaryView[record.header];
               let table : MaterialTakeOffTableView = materialTakeOffSecondaryView.table;
               if(table.content[record.rowValue] !== undefined && table.content[record.rowValue] !== null) {
                 let  tableViewContent: MaterialTakeOffTableViewContent = table.content[record.rowValue];
                 tableViewContent.columnTwo = tableViewContent.columnTwo + record.Total;   // update total
                 if(record.subValue){
                   tableViewContent.subContent[record.subValue] =
                     new MaterialTakeOffTableViewSubContent(record.subValue, record.Total, record.unit);
                 }
               }else {
                 let subContentMap = {};
                 if(record.subValue) {
                   let materialTakeOffTableViewSubContent =
                     new MaterialTakeOffTableViewSubContent(record.subValue, record.Total, record.unit);
                   subContentMap[record.subValue]= materialTakeOffTableViewSubContent;
                 }
                 let  tableViewContent: MaterialTakeOffTableViewContent =
                   new MaterialTakeOffTableViewContent(record.rowValue, record.Total, record.unit, subContentMap);
                  table.content[record.rowValue] = tableViewContent;
               }
               table.footer.columnTwo = table.footer.columnTwo + record.Total;
              materialTakeOffSecondaryView.header = table.footer.columnTwo + ' ' + record.unit;
            }else {
              let subContentMap = {};
              if(record.subValue) {
                let materialTakeOffTableViewSubContent =  new MaterialTakeOffTableViewSubContent(record.subValue, record.Total, 'BAG');
                subContentMap[record.subValue] = materialTakeOffTableViewSubContent;
              }
              let  tableViewContent: MaterialTakeOffTableViewContent =
                new MaterialTakeOffTableViewContent(record.rowValue, record.Total, record.unit, subContentMap);
              let tableViewContentMap = {};
              tableViewContentMap[record.rowValue] = tableViewContent;
              let materialTakeOffTableViewHeader: MaterialTakeOffTableViewHeaders =
                new MaterialTakeOffTableViewHeaders('Item', 'Quantity', 'Unit');
              let materialTakeOffTableViewFooter : MaterialTakeOffTableViewFooter =
                new MaterialTakeOffTableViewFooter('Total', record.Total, record.unit);
              let table : MaterialTakeOffTableView =
                new MaterialTakeOffTableView(materialTakeOffTableViewHeader, tableViewContentMap, materialTakeOffTableViewFooter);
              let materialTakeOffSecondaryView: MaterialTakeOffSecondaryView =
                new MaterialTakeOffSecondaryView(materialTakeOffTableViewFooter.columnTwo +' '+ materialTakeOffTableViewFooter.columnThree,
                  table);
              materialTakeOffReport.header = building;
              materialTakeOffReport.secondaryView[record.header] =  materialTakeOffSecondaryView;
            }
          }
        let responseData = {};
        responseData[element]= materialTakeOffReport;
        callback(null, responseData);
      }
    });
  }

  private getMaterialDataFromFlatDetailsArray(elementWiseReport: string, element: string, building: string, materialTakeOffFlatDetailsArray: Array<MaterialTakeOffFlatDetailsDTO>) {
    let sqlQuery: string;
    switch(elementWiseReport) {
      case 'costHead':
        sqlQuery = this.alasqlQueryForMaterialTakeOffDataCostHeadWise(building, element);
        break;
      case 'material':
        sqlQuery = this.alasqlQueryForMaterialTakeOffDataMaterialWise(building, element);
        break;
    }
    let materialReportRowData = alasql(sqlQuery, [materialTakeOffFlatDetailsArray]);
    return materialReportRowData;
  }

  private alasqlQueryForMaterialTakeOffDataMaterialWise(building: string, element: string) {
    let select: string = Constants.STR_EMPTY;
    let from: string = Constants.ALASQL_FROM;
    let where: string = Constants.STR_EMPTY;
    let groupBy: string = Constants.ALASQL_GROUP_BY_MATERIAL_TAKEOFF_MATERIAL_WISE;
    let orderBy: string = Constants.ALASQL_ORDER_BY_MATERIAL_TAKEOFF_MATERIAL_WISE;
    let sqlQuery: string;
    if (building !== Constants.STR_ALL_BUILDING) {
      select = Constants.ALASQL_SELECT_MATERIAL_TAKEOFF_MATERIAL_WISE + Constants.STR_COMMA_SPACE +
        Constants.ALASQL_SELECT_QUANTITY_NAME_AS;
      where = Constants.ALASQL_WHERE_MATERIAL_NAME_EQUALS_TO + element + Constants.STR_DOUBLE_INVERTED_COMMA +
        Constants.STR_AND + Constants.ALASQL_SELECT_BUILDING_NAME + building + Constants.STR_DOUBLE_INVERTED_COMMA;
    } else {
      select = Constants.ALASQL_SELECT_MATERIAL_TAKEOFF_MATERIAL_WISE ;
      where = Constants.ALASQL_WHERE_MATERIAL_NAME_EQUALS_TO + element + Constants.STR_DOUBLE_INVERTED_COMMA;
    }
    sqlQuery = select + from + where + groupBy + orderBy;
    return sqlQuery;
  }

  private alasqlQueryForMaterialTakeOffDataCostHeadWise(building: string, element: string) {
    let select: string = '';
    let from: string = ' FROM ? ';
    let where: string = '';
    let groupBy: string = '';
    let orderBy: string = '';
    let sqlQuery: string;
    if (building !== 'All Buildings') {
      select = 'SELECT materialName AS header, workItemName AS rowValue, quantityName AS subValue, SUM(quantity) AS Total, unit ';
      where = 'WHERE costHeadName = "' + element + '" AND buildingName = "' + building + '" ';
      groupBy = 'GROUP BY materialName,workItemName, quantityName, unit ';
      orderBy = 'ORDER BY materialName,workItemName ';
    } else {
      select = 'SELECT materialName AS header, buildingName AS rowValue, SUM(quantity) AS Total, unit ';
      where = 'WHERE costHeadName = "' + element + '" ';
      groupBy = 'GROUP BY materialName, buildingName, quantityName, unit ';
      orderBy = 'ORDER BY materialName, buildingName ';
    }
    sqlQuery = select + from + where + groupBy + orderBy;
    return sqlQuery;
  }

  private getMaterialTakeOffFilterObject(buildings: Array<Building>) {
    let materialTakeOffFlatDetailsArray: Array<MaterialTakeOffFlatDetailsDTO> = this.getBuildingMaterialDetails(buildings);
    let column: string = 'buildingName';
    let buildingList: Array<string> = this.getDistinctArrayOfStringFromAlasql(column, materialTakeOffFlatDetailsArray);
    column = 'costHeadName';
    let costHeadList: Array<string> = this.getDistinctArrayOfStringFromAlasql(column, materialTakeOffFlatDetailsArray);
    column = 'materialName';
    let materialList: Array<string> = this.getDistinctArrayOfStringFromAlasql(column, materialTakeOffFlatDetailsArray);
    let materialTakeOffFiltersObject: MaterialTakeOffFiltersListDTO = new MaterialTakeOffFiltersListDTO(buildingList, costHeadList,
      materialList);
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

