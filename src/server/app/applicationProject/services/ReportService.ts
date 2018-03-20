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
        if (areaType === Constants.SLAB_AREA) {
            var typeOfArea = Constants.TOTAL_SLAB_AREA;
          } else if (areaType === Constants.SALEABLE_AREA) {
            typeOfArea = Constants.TOTAL_SALEABLE_AREA;
          } else if (areaType === Constants.CARPET_AREA) {
            typeOfArea = Constants.TOTAL_CARPET_AREA;
          }
        let totalArea = alasql('VALUE OF SELECT SUM('+typeOfArea+') FROM ?',[buildings]);
        let projectCostHeads = result[0].projectCostHeads;
        let projectReport : ProjectReport = new ProjectReport();
        let buildingReport : Array<BuildingReport> = new Array<BuildingReport>();
        this.generateReportByCostHeads( 'buildingReport', buildings, areaType, rateUnit, buildingReport);
        projectReport.buildings = buildingReport;
        let commonAmenitiesReport : Array<BuildingReport> = new Array<BuildingReport>();
        this.generateReportForProjectCostHeads('commonAmenitiesReport',projectCostHeads ,totalArea,
          areaType, rateUnit, commonAmenitiesReport);
        projectReport.commonAmenities = commonAmenitiesReport;
        callback(null,{ data: projectReport, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  generateReportByCostHeads( reportType : string, buildings:  Array<Building> , areaType: string, rateUnit: string,
                             report: Array<BuildingReport>) {
    for (let building of buildings) {
      let buildingAreaType: string;
      let reportUnitType: string;

      if(areaType === 'slabArea') {
        buildingAreaType = 'totalSlabArea';
      } else if(areaType === 'saleableArea') {
        buildingAreaType = 'totalSaleableAreaOfUnit';
      } else if(areaType === 'carpetArea') {
        buildingAreaType = 'totalCarpetAreaOfUnit';
      }

      let buildingReport = new BuildingReport;
      buildingReport.name = building.name;
      buildingReport._id = building._id;
      buildingReport.area = building[buildingAreaType];

      let thumbRule  = new ThumbRule();
      let estimate  = new Estimate();
      let thumbRuleReports = new Array<ThumbRuleReport>();
      let estimatedReports = new Array<EstimateReport>();


      this.getThumbRuleAndEstimatedReport(building, buildingReport, thumbRuleReports, estimatedReports, rateUnit);

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

      buildingReport.thumbRule = thumbRule;
      buildingReport.estimate = estimate;
      report.push(buildingReport);
    }
  }


  getThumbRuleAndEstimatedReport(building :Building, buildingReport: BuildingReport,
                                 thumbRuleReports: ThumbRuleReport[], estimatedReports: EstimateReport[], rateUnit:string) {

    for (let costHead of building.costHeads) {

      if(costHead.active) {
        //ThumbRule Report
        let thumbRuleReport = new ThumbRuleReport();
        thumbRuleReport.name = costHead.name;
        thumbRuleReport.rateAnalysisId = costHead.rateAnalysisId;
        thumbRuleReport.amount = costHead.budgetedCostAmount;
        thumbRuleReport.costHeadActive = costHead.active;
        thumbRuleReport.rate = parseFloat((costHead.budgetedCostAmount / buildingReport.area).toFixed(2));
        if(rateUnit === Constants.SQUREMETER_UNIT) {
          thumbRuleReport.rate = parseFloat((thumbRuleReport.rate * config.get(Constants.SQUARE_METER)).toFixed(2));
        }
        thumbRuleReports.push(thumbRuleReport);

        //Estimated cost Report
        let estimateReport = new EstimateReport();
        estimateReport.name = costHead.name;
        estimateReport.rateAnalysisId = costHead.rateAnalysisId;

        let costHeadCategories: Array<Category> = costHead.categories;
        for (let category of costHeadCategories) {
          let workItemList = category.workItems;
          if (workItemList.length !== 0) {
            for (let workItem of workItemList) {
              if (workItem.quantity.total !== null && workItem.rate.total !== null
                && workItem.quantity.total !== 0 && workItem.rate.total !== 0) {
                estimateReport.total = parseFloat((workItem.quantity.total * workItem.rate.total + estimateReport.total).toFixed(2));
                estimateReport.rate = parseFloat((estimateReport.total / buildingReport.area).toFixed(2));
              }
            }
          }
        }
        if(rateUnit === Constants.SQUREMETER_UNIT) {
          estimateReport.rate = parseFloat((estimateReport.rate * config.get(Constants.SQUARE_METER)).toFixed(2));
        }
        estimatedReports.push(estimateReport);
      }
      }
  }

  generateReportForProjectCostHeads( reportType : string, projectCostHeads:  Array<CostHead>, totalArea: number,
                                   areaType: string, rateUnit: string, report: Array<BuildingReport>) {

      let projectCostHeadArray: Array<CostHead> = projectCostHeads;
      let projectReport = new BuildingReport;
       for (let projectCostHeadIndex in projectCostHeadArray) {

         let thumbRule: ThumbRule = new ThumbRule();
         let estimate : Estimate = new Estimate();

         if (projectCostHeadArray[projectCostHeadIndex].active) {

          let thumbRuleReport: ThumbRuleReport = new ThumbRuleReport();
          let estimateReport: EstimateReport = new EstimateReport();

           estimateReport.name = projectCostHeadArray[projectCostHeadIndex].name;
           estimateReport.rateAnalysisId = projectCostHeadArray[projectCostHeadIndex].rateAnalysisId;

          let categoryArray : Array<Category> = projectCostHeadArray[projectCostHeadIndex].categories;
          for (let categoryIndex in categoryArray) {
            if (categoryArray[categoryIndex].active) {
              let workItemArray = categoryArray[categoryIndex].workItems;
              if (workItemArray.length !== 0) {
                for (let workItemIndex in workItemArray) {
                  if (workItemArray[workItemIndex].active) {
                    if (workItemArray[workItemIndex].quantity.total !== null && workItemArray[workItemIndex].rate.total !== null
                      && workItemArray[workItemIndex].quantity.total !== 0 && workItemArray[workItemIndex].rate.total !== 0) {
                      estimateReport.total = parseFloat((workItemArray[workItemIndex].quantity.total *
                        workItemArray[workItemIndex].rate.total + estimateReport.total).toFixed(2));
                      estimateReport.rate = parseFloat((estimateReport.total / totalArea).toFixed(2));
                    }
                  }
                }
              }
            }
          }
          estimate.totalEstimatedCost = parseFloat((estimateReport.total + estimate.totalEstimatedCost).toFixed(2));
          estimate.totalRate = parseFloat((estimate.totalRate + estimateReport.rate).toFixed(2));
          estimate.estimatedCosts.push(estimateReport);

           thumbRuleReport.name = projectCostHeadArray[projectCostHeadIndex].name;
           thumbRuleReport.rateAnalysisId = projectCostHeadArray[projectCostHeadIndex].rateAnalysisId;
           thumbRuleReport.amount = parseFloat((projectCostHeadArray[projectCostHeadIndex].budgetedCostAmount).toFixed(2));

            if (rateUnit === Constants.SQUREFEET_UNIT) {
              thumbRuleReport.rate =  parseFloat((thumbRuleReport.amount/totalArea).toFixed(2));
            } else  {
              thumbRule.area = thumbRuleReport.amount * config.get(Constants.SQUARE_METER);
              thumbRuleReport.rate = parseFloat((thumbRuleReport.amount/thumbRule.area).toFixed(2));
            }
          thumbRule.totalRate = parseFloat((thumbRule.totalRate + thumbRuleReport.rate).toFixed(2));
          thumbRule.totalBudgetedCost = parseFloat((thumbRule.totalBudgetedCost + thumbRuleReport.amount).toFixed(2));
          thumbRule.thumbRuleReports.push(thumbRuleReport);
          projectReport.thumbRule = thumbRule;
          projectReport.estimate = estimate;
        }
      }
      report.push(projectReport);
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

}

Object.seal(ReportService);
export = ReportService;

