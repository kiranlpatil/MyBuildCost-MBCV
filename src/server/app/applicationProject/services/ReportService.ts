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
import WorkItem = require('../dataaccess/model/project/building/WorkItem');
import MaterialTakeOffFlatDetailsDTO = require('../dataaccess/dto/Report/MaterialTakeOffFlatDetailsDTO');
import MaterialTakeOffFiltersListDTO = require('../dataaccess/dto/Report/MaterialTakeOffFiltersListDTO');
import MaterialTakeOffReport = require('../dataaccess/model/project/reports/MaterialTakeOffReport');
import MaterialTakeOffTableView = require('../dataaccess/model/project/reports/MaterialTakeOffTableView');
import MaterialTakeOffSecondaryView = require('../dataaccess/model/project/reports/MaterialTakeOffSecondaryView');
import MaterialTakeOffTableViewContent = require('../dataaccess/model/project/reports/MaterialTakeOffTableViewContent');
import MaterialTakeOffTableViewSubContent = require('../dataaccess/model/project/reports/MaterialTakeOffTableViewSubContent');
import MaterialTakeOffTableViewHeaders = require('../dataaccess/model/project/reports/MaterialTakeOffTableViewHeaders');
import MaterialTakeOffTableViewFooter = require('../dataaccess/model/project/reports/MaterialTakeOffTableViewFooter');
import CostControllException = require('../exception/CostControllException');
import MaterialTakeOffView = require('../dataaccess/model/project/reports/MaterialTakeOffView');
import { AddCostHeadButton } from '../dataaccess/model/project/reports/showHideCostHeadButton';

let config = require('config');
var log4js = require('log4js');
var logger=log4js.getLogger('Report Service');

class ReportService {
  APP_NAME: string;
  company_name: string;
  costHeadsList: Array<AddCostHeadButton> =  new Array<AddCostHeadButton>();
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
         totalArea =totalOfArea * config.get(Constants.SQUARE_METER);
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
        projectReport.showHideCostHeadButtons = this.costHeadsList;
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
        buildingReport.area =  building[typeOfArea] * config.get(Constants.SQUARE_METER);
      } else {
        buildingReport.area = building[typeOfArea];
      }
      let thumbRule  = new ThumbRule();
      let estimate  = new Estimate();
      let thumbRuleReports = new Array<ThumbRuleReport>();
      let estimatedReports = new Array<EstimateReport>();


      this.getThumbRuleAndEstimatedReport(building, buildingReport, thumbRuleReports,
        estimatedReports, rateUnit);

      let totalRates = alasql('SELECT ROUND(SUM(amount),2) AS totalAmount, ROUND(SUM(rate),2) AS totalRate FROM ?',[thumbRuleReports]);
      thumbRule.totalRate = totalRates[0].totalRate;
      thumbRule.totalBudgetedCost = Math.round(totalRates[0].totalAmount);
      thumbRule.thumbRuleReports = thumbRuleReports;

      let totalEstimatedRates = alasql('SELECT ROUND(SUM(total),2) AS totalAmount, ROUND(SUM(rate),2) AS totalRate FROM ?',
        [estimatedReports]);
      estimate.totalRate = totalEstimatedRates[0].totalRate;
      estimate.totalEstimatedCost = totalEstimatedRates[0].totalAmount;
      estimate.estimatedCosts = estimatedReports;

      buildingReport.thumbRule = thumbRule;
      buildingReport.estimate = estimate;
      buildingsReport.push(buildingReport);
    }
    console.log('SHow Hide List : '+JSON.stringify(this.costHeadsList));
    return(buildingsReport);
  }


  getThumbRuleAndEstimatedReport(building :Building, buildingReport: BuildingReport,
                                 thumbRuleReports: ThumbRuleReport[], estimatedReports: EstimateReport[],
                                 rateUnit:string) {

    let costHeadButtonForBuilding = new AddCostHeadButton();
    costHeadButtonForBuilding.buildingName = building.name;
    for (let costHead of building.costHeads) {

      if(costHead.active) {
        //ThumbRule Report
        let thumbRuleReport = new ThumbRuleReport();
        thumbRuleReport.name = costHead.name;
        thumbRuleReport.rateAnalysisId = costHead.rateAnalysisId;
        thumbRuleReport.amount = Math.round(costHead.budgetedCostAmount);
        thumbRuleReport.costHeadActive = costHead.active;
        thumbRuleReport.rate = thumbRuleReport.amount / buildingReport.area;
        thumbRuleReports.push(thumbRuleReport);

        //Estimated cost Report
        let estimateReport = new EstimateReport();
        estimateReport = this.getEstimatedReport(building.rates, costHead, buildingReport.area, rateUnit);
        estimatedReports.push(estimateReport);
      } else {
        costHeadButtonForBuilding.showHideAddCostHeadButton = false;
      }
    }
    this.costHeadsList.push(costHeadButtonForBuilding);
  }

  getEstimatedReport(centralizedRates:Array<CentralizedRate>, costHead: any, area:number, rateUnit:string) {

    let estimateReport = new EstimateReport();
    estimateReport.name = costHead.name;
    estimateReport.rateAnalysisId = costHead.rateAnalysisId;

    let costHeadCategories: Array<Category> = costHead.categories;
    let projectService : ProjectService = new ProjectService();
    let categoriesObj = projectService.getCategoriesListWithCentralizedRates(costHeadCategories, centralizedRates);
    estimateReport.total = categoriesObj.categoriesAmount;
    estimateReport.rate = estimateReport.total / area;
    return estimateReport;
  }

  getEstimatedReportForNonCategories(thumbRuleReport: ThumbRuleReport) {
    let estimateReport = new EstimateReport();
    estimateReport.name = thumbRuleReport.name;
    estimateReport.rateAnalysisId = thumbRuleReport.rateAnalysisId;
    estimateReport.total = thumbRuleReport.amount;
    estimateReport.disableCostHeadView = true;
    estimateReport.rate = thumbRuleReport.rate;
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
      thumbRule.totalBudgetedCost = Math.round(totalRates[0].totalAmount);
      thumbRule.thumbRuleReports = thumbRuleReports;

    let totalEstimatedRates = alasql('SELECT ROUND(SUM(total),2) AS totalAmount, ROUND(SUM(rate),2) AS totalRate FROM ?',
      [estimatedReports]);
      estimate.totalRate = totalEstimatedRates[0].totalRate;
      estimate.totalEstimatedCost = totalEstimatedRates[0].totalAmount;
      estimate.estimatedCosts = estimatedReports;

      projectReport.thumbRule = thumbRule;
      projectReport.estimate = estimate;
    commonAmenitiesReport.push(projectReport);
    console.log('SHow Hide List : '+JSON.stringify(this.costHeadsList));
    return(commonAmenitiesReport);
  }

  getThumbRuleAndEstimatedReportForProjectCostHead(projectCostHead: Array<CostHead>, projectRates: Array<CentralizedRate>,
                                                   projectReport: BuildingReport, thumbRuleReports: ThumbRuleReport[],
                                                   estimatedReports: EstimateReport[], totalArea:number, rateUnit:string) {

    let costHeadButtonForBuilding = new AddCostHeadButton();
    costHeadButtonForBuilding.buildingName = projectReport.name;

    for (let costHead  of projectCostHead) {
    if (costHead.active) {
      //ThumbRule Report
      let thumbRuleReport = new ThumbRuleReport();
      thumbRuleReport.name = costHead.name;
      thumbRuleReport.rateAnalysisId = costHead.rateAnalysisId;
      thumbRuleReport.amount = Math.round(costHead.budgetedCostAmount);
      thumbRuleReport.costHeadActive = costHead.active;
      thumbRuleReport.rate = thumbRuleReport.amount / totalArea;
      thumbRuleReports.push(thumbRuleReport);

      //Estimated cost Report
      let estimateReport = new EstimateReport();
      if(costHead.categories.length > 0) {
        estimateReport = this.getEstimatedReport(projectRates, costHead, totalArea, rateUnit);
      } else {
        estimateReport = this.getEstimatedReportForNonCategories(thumbRuleReport);
      }

      estimatedReports.push(estimateReport);
    }else {
      costHeadButtonForBuilding.showHideAddCostHeadButton=false;
    }
   }this.costHeadsList.push(costHeadButtonForBuilding);
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
    if(building !== Constants.STR_ALL_BUILDING) {
      populate = {path : 'buildings', match:{name: building}};
    }
    this.projectRepository.findAndPopulate(query, populate, (error, result) => {
      logger.info('Report Service, findAndPopulate has been hit');
      if(error) {
        callback(error, null);
      } else {
        if(result[0].buildings.length === 0) {
          callback(new CostControllException('Unable to find Building',null), null);
        }
        let materialTakeOffFlatDetailsArray: Array<MaterialTakeOffFlatDetailsDTO> = this.getBuildingMaterialDetails(result[0].buildings);
        let materialReportRowData =
          this.getMaterialDataFromFlatDetailsArray(elementWiseReport, element, building, materialTakeOffFlatDetailsArray);
        if(materialReportRowData.length>0 && materialReportRowData[0].header !== undefined) {
          let materialTakeOffReport: MaterialTakeOffReport = new MaterialTakeOffReport( null, null, null);
          materialTakeOffReport.secondaryView = {};
          this.populateMaterialTakeOffReportFromRowData(materialReportRowData, materialTakeOffReport, elementWiseReport, building);
          this.calculateTotalOfMaterialTakeReport(materialTakeOffReport, elementWiseReport, building);
          let responseData = {};
          responseData[element]= materialTakeOffReport;
          callback(null, responseData);
        }else {
          callback(new CostControllException(Constants.MESSAGE_FOR_COSTHEADS_MISSING_COST_ESTIMATION + element , null), null);
        }
      }
    });
  }

  calculateTotalOfMaterialTakeReport(materialTakeOffReport : any, elementWiseReport : string, building : string) {

    let reportTotal = 0;
    let recordUnit;

        let secondaryViewMaterialData = materialTakeOffReport.secondaryView;
    for (let secondaryViewData of Object.keys(secondaryViewMaterialData)) {

      //content
      let contentTotal = 0;
      let table = secondaryViewMaterialData[secondaryViewData].table;

      for (let content of Object.keys(table.content)) {
        if (Object.keys(table.content[content].subContent).length > 0) {
          table.content[content].columnTwo = 0;
          let tableSubContent = table.content[content].subContent;
          for (let subContent of Object.keys(tableSubContent)) {   // Sub content


            if (Object.keys(tableSubContent[subContent].subContent).length > 0) {
              tableSubContent[subContent].columnTwo = 0;
              for (let innerSubContent of Object.keys(tableSubContent[subContent].subContent)) {
                // inner Sub content
                tableSubContent[subContent].columnTwo =
                  (parseFloat(tableSubContent[subContent].columnTwo) +
                    parseFloat(tableSubContent[subContent].subContent[innerSubContent].columnTwo)
                  ).toFixed(Constants.NUMBER_OF_FRACTION_DIGIT);
              }
            }


            tableSubContent[subContent].columnTwo =
              Math.ceil(tableSubContent[subContent].columnTwo);
            table.content[content].columnTwo = (parseFloat(table.content[content].columnTwo) +
              parseFloat(tableSubContent[subContent].columnTwo)).toFixed(Constants.NUMBER_OF_FRACTION_DIGIT);
          }
          table.content[content].columnTwo = Math.ceil(table.content[content].columnTwo);
          contentTotal = contentTotal + table.content[content].columnTwo;
        }

        //footer
        table.footer.columnTwo = contentTotal;
        secondaryViewMaterialData[secondaryViewData].title = contentTotal + ' ' + table.footer.columnThree;
      }

      reportTotal = reportTotal + contentTotal;
      recordUnit = table.footer.columnThree;

      if (elementWiseReport === Constants.STR_MATERIAL && building === Constants.STR_ALL_BUILDING) {
        materialTakeOffReport.subTitle.columnTwo = reportTotal;
        materialTakeOffReport.subTitle.columnThree = recordUnit;
        materialTakeOffReport.subTitle.columnOne = ': ' + reportTotal + ' ' + materialTakeOffReport.subTitle.columnThree;
      }
    }
  }

  private populateMaterialTakeOffReportFromRowData(materialReportRowData: any, materialTakeOffReport: MaterialTakeOffReport,
                                                   elementWiseReport: string, building: string) {
    for (let record of materialReportRowData) {
      if (materialTakeOffReport.secondaryView[record.header] === undefined ||
        materialTakeOffReport.secondaryView[record.header] === null) {
        materialTakeOffReport.title = building;
        if(materialTakeOffReport.subTitle === null || materialTakeOffReport.subTitle === undefined){
          let materialTakeOffReportSubTitle: MaterialTakeOffView = new MaterialTakeOffView('', 0, '');
          materialTakeOffReport.subTitle = materialTakeOffReportSubTitle;
        }

        /*}*/
        materialTakeOffReport.secondaryView[record.header] = {};
      }
      let materialTakeOffSecondaryView: MaterialTakeOffSecondaryView = materialTakeOffReport.secondaryView[record.header];
      if(materialTakeOffSecondaryView.table === undefined || materialTakeOffSecondaryView.table === null) {
        materialTakeOffSecondaryView.table = new MaterialTakeOffTableView(null, null, null);
      }
      let table: MaterialTakeOffTableView = materialTakeOffSecondaryView.table;
      if(table.content === null) {
        table.content = {};
      }

      if(table.header === null) {
        let columnOne: string = 'Item';
        let columnTwo: string = 'Quantity';
        let columnThree: string =  'Unit';
        if(elementWiseReport === Constants.STR_COSTHEAD && building === Constants.STR_ALL_BUILDING) {
          columnOne = 'Building';
        }
        table.header = new MaterialTakeOffTableViewHeaders(columnOne, columnTwo, columnThree);
      }

      let materialTakeOffTableViewSubContent = null;
      if (record.subValue && record.subValue !== 'default' && record.subValue !== 'Direct') {
        materialTakeOffTableViewSubContent =
          new MaterialTakeOffTableViewSubContent(record.subValue, record.Total, record.unit);
      }

      if(table.content[record.costHeadName] === undefined || table.content[record.costHeadName] === null) {
        table.content[record.costHeadName] = new MaterialTakeOffTableViewContent(record.costHeadName, 0, record.unit, {});
      }


      if(table.content[record.costHeadName].subContent[record.rowValue] === undefined ||
        table.content[record.costHeadName].subContent[record.rowValue] === null) {
        table.content[record.costHeadName].subContent[record.rowValue] =
          new MaterialTakeOffTableViewContent(record.rowValue, 0, record.unit, {});
      }

      let tableViewSubContent: MaterialTakeOffTableViewContent = table.content[record.costHeadName].subContent[record.rowValue];
      tableViewSubContent.columnTwo = tableViewSubContent.columnTwo + record.Total;   // update total

      let tableViewContent: MaterialTakeOffTableViewContent = table.content[record.costHeadName];
      tableViewContent.columnTwo = tableViewContent.columnTwo + record.Total;   // update total

      if(materialTakeOffTableViewSubContent) {
        materialTakeOffTableViewSubContent.columnTwo = parseFloat(
          materialTakeOffTableViewSubContent.columnTwo).toFixed(Constants.NUMBER_OF_FRACTION_DIGIT);
        tableViewContent.subContent[record.rowValue].subContent[record.subValue] = materialTakeOffTableViewSubContent;
      }

      ///

      /*let materialTakeOffTableViewSubContent = null;
      if (record.subValue && record.subValue !== 'default' && record.subValue !== 'Direct') {
        materialTakeOffTableViewSubContent =
          new MaterialTakeOffTableViewSubContent(record.subValue, record.Total, record.unit);
      }

      if(table.content[record.rowValue] === undefined || table.content[record.rowValue] === null) {
        table.content[record.rowValue] = new MaterialTakeOffTableViewContent(record.rowValue, 0, record.unit, {});
      }

      let tableViewContent: MaterialTakeOffTableViewContent = table.content[record.rowValue];
      tableViewContent.columnTwo = tableViewContent.columnTwo + record.Total;   // update total

      if(materialTakeOffTableViewSubContent) {
        materialTakeOffTableViewSubContent.columnTwo = parseFloat(
          materialTakeOffTableViewSubContent.columnTwo).toFixed(Constants.NUMBER_OF_FRACTION_DIGIT);
        tableViewContent.subContent[record.subValue] = materialTakeOffTableViewSubContent;
      }*/
      ///

      let materialTakeOffTableViewFooter: MaterialTakeOffTableViewFooter = null;
      if(table.footer === undefined || table.footer === null) {
        table.footer =
          new MaterialTakeOffTableViewFooter('Total', 0, record.unit);
      }
    }
  }

  private getMaterialDataFromFlatDetailsArray(elementWiseReport: string, element: string, building: string,
                                              materialTakeOffFlatDetailsArray: Array<MaterialTakeOffFlatDetailsDTO>) {
    let sqlQuery: string;
    switch(elementWiseReport) {
      case Constants.STR_COSTHEAD:
        sqlQuery = this.alasqlQueryForMaterialTakeOffDataCostHeadWise(building);
        break;
      case Constants.STR_MATERIAL:
        sqlQuery = this.alasqlQueryForMaterialTakeOffDataMaterialWise(building);
        break;
    }
    let materialReportRowData = alasql(sqlQuery, [materialTakeOffFlatDetailsArray,element]);
    return materialReportRowData;
  }

  private alasqlQueryForMaterialTakeOffDataMaterialWise(building: string) {
    let select: string = Constants.STR_EMPTY;
    let from: string = Constants.ALASQL_FROM;
    let where: string = Constants.STR_EMPTY;
    let groupBy: string = Constants.ALASQL_GROUP_BY_MATERIAL_TAKEOFF_MATERIAL_WISE;
    let orderBy: string = Constants.ALASQL_ORDER_BY_MATERIAL_TAKEOFF_MATERIAL_WISE;
    let sqlQuery: string;
    if (building !== Constants.STR_ALL_BUILDING) {
      select = Constants.ALASQL_SELECT_MATERIAL_TAKEOFF_MATERIAL_WISE + Constants.STR_COMMA_SPACE +
        Constants.ALASQL_SELECT_QUANTITY_NAME_AS;
      where = Constants.ALASQL_WHERE_MATERIAL_NAME_EQUALS_TO  +
        Constants.STR_AND + Constants.ALASQL_SELECT_BUILDING_NAME + building + Constants.STR_DOUBLE_INVERTED_COMMA;
    } else {
      select = Constants.ALASQL_SELECT_MATERIAL_TAKEOFF_MATERIAL_WISE ;
      where = Constants.ALASQL_WHERE_MATERIAL_NAME_EQUALS_TO ;
    }
    where = where + Constants.ALASQL_AND_MATERIAL_NOT_LABOUR;
    sqlQuery = select + from + where + groupBy + orderBy;
    return sqlQuery;
  }

  private alasqlQueryForMaterialTakeOffDataCostHeadWise(building: string) {
    let select: string = Constants.STR_EMPTY;
    let from: string = Constants.ALASQL_FROM;
    let where: string = Constants.STR_EMPTY;
    let groupBy: string = Constants.STR_EMPTY;
    let orderBy: string = Constants.STR_EMPTY;
    let sqlQuery: string;
    if (building !== Constants.STR_ALL_BUILDING) {
      select = Constants.ALASQL_SELECT_MATERIAL_TAKEOFF_COSTHEAD_WISE + Constants.STR_COMMA_SPACE +
        Constants.ALASQL_SELECT_QUANTITY_NAME_AS;
      where = Constants.ALASQL_WHERE_COSTHEAD_NAME_EQUALS_TO
        + Constants.STR_AND + Constants.ALASQL_SELECT_BUILDING_NAME + building + Constants.STR_DOUBLE_INVERTED_COMMA;
      groupBy = Constants.ALASQL_GROUP_MATERIAL_WORKITEM_QUANTITY_MATERIAL_TAKEOFF_COSTHEAD_WISE;
      orderBy = Constants.ALASQL_ORDER_BY_MATERIAL_WORKITEM_COSTHEAD_WISE;
    } else {
      select = Constants.ALASQL_SELECT_MATERIAL_TAKEOFF_COSTHEAD_WISE_FOR_ALL_BUILDINGS;
      where = Constants.ALASQL_WHERE_COSTHEAD_NAME_EQUALS_TO;
      groupBy = Constants.ALASQL_GROUP_MATERIAL_BUILDING_QUANTITY_MATERIAL_TAKEOFF_COSTHEAD_WISE_FOR_ALL_BUILDINGS;
      orderBy = Constants.ALASQL_ORDER_BY_MATERIAL_BUILDING_MATERIAL_TAKEOFF_COSTHEAD_WISE;
    }
    where = where + Constants.ALASQL_AND_MATERIAL_NOT_LABOUR;
    sqlQuery = select + from + where + groupBy + orderBy;
    return sqlQuery;
  }

  private getMaterialTakeOffFilterObject(buildings: Array<Building>) {
    let materialTakeOffFlatDetailsArray: Array<MaterialTakeOffFlatDetailsDTO> = this.getBuildingMaterialDetails(buildings);
    let column: string = Constants.STR_BUILDING_NAME;
    let buildingList: Array<string> = this.getDistinctArrayOfStringFromAlasql(column, materialTakeOffFlatDetailsArray);
    column = Constants.STR_COSTHEAD_NAME;
    let costHeadList: Array<string> = this.getDistinctArrayOfStringFromAlasql(column, materialTakeOffFlatDetailsArray);
    column = Constants.STR_Material_NAME;
    let materialList: Array<string> = this.getDistinctArrayOfStringFromAlasql(column, materialTakeOffFlatDetailsArray,
      Constants.ALASQL_MATERIAL_NOT_LABOUR);
    let materialTakeOffFiltersObject: MaterialTakeOffFiltersListDTO = new MaterialTakeOffFiltersListDTO(buildingList, costHeadList,
      materialList);
    return materialTakeOffFiltersObject;
  }

  private getDistinctArrayOfStringFromAlasql(column: string, materialTakeOffFlatDetailsArray: Array<MaterialTakeOffFlatDetailsDTO>,
                                             notLikeOptional?: string) {
    let sqlQuery: string = 'SELECT DISTINCT flatData.' + column + ' FROM ? AS flatData';
    let where = ' where '+ notLikeOptional;
    if(notLikeOptional) {
      sqlQuery = sqlQuery + where;
    }
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
    for (let category of costHead.categories) {
      if (category.active) {
        categoryName = category.name;
        this.addMaterialDTOForActiveWorkitemInDTOArray(category, buildingName, costHeadName, categoryName, materialTakeOffFlatDetailsArray);
      }
    }
  }

  private addMaterialDTOForActiveWorkitemInDTOArray(category: Category, buildingName: string, costHeadName: string,
                      categoryName: string, materialTakeOffFlatDetailsArray: Array<MaterialTakeOffFlatDetailsDTO>) {
    let workItemName: string;
    for (let workItem of category.workItems) {
      if (workItem.active) {
        workItemName = workItem.name;
        this.addEstimatedQuantityAndRateMaterialItemInDTOArray(workItem, buildingName, costHeadName, categoryName,
          workItemName, materialTakeOffFlatDetailsArray);
      }
    }
  }

  private addEstimatedQuantityAndRateMaterialItemInDTOArray(workItem: WorkItem, buildingName: string, costHeadName: string,
                  categoryName : string, workItemName: string, materialTakeOffFlatDetailsArray: Array<MaterialTakeOffFlatDetailsDTO>) {
    let quantityName: string;
    if(workItem.quantity.isDirectQuantity && workItem.rate.isEstimated) {
      quantityName = Constants.STR_DIRECT;
      this.createAndAddMaterialDTOObjectInDTOArray(workItem, buildingName, costHeadName, categoryName, workItemName, quantityName,
        materialTakeOffFlatDetailsArray, workItem.quantity.total);
    } else if (workItem.quantity.isEstimated && workItem.rate.isEstimated) {
      for (let quantity of workItem.quantity.quantityItemDetails) {
        quantityName = quantity.name;
        this.createAndAddMaterialDTOObjectInDTOArray(workItem, buildingName, costHeadName, categoryName, workItemName, quantityName,
          materialTakeOffFlatDetailsArray, quantity.total);
      }
    }
  }

  private createAndAddMaterialDTOObjectInDTOArray(workItem: WorkItem, buildingName: string, costHeadName: string, categoryName: string,
                  workItemName: string, quantityName: string, materialTakeOffFlatDetailsArray: Array<MaterialTakeOffFlatDetailsDTO>,
                                                  quantity: number) {
    for (let rateItem of workItem.rate.rateItems) {
      let materialTakeOffFlatDetailDTO = new MaterialTakeOffFlatDetailsDTO(buildingName, costHeadName, categoryName,
        workItemName, rateItem.itemName, quantityName, (quantity / workItem.rate.quantity) * rateItem.quantity,
        rateItem.unit);
      materialTakeOffFlatDetailsArray.push(materialTakeOffFlatDetailDTO);
    }
  }
}

Object.seal(ReportService);
export = ReportService;

