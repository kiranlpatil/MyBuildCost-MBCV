import ProjectRepository = require('../dataaccess/repository/ProjectRepository');
import BuildingRepository = require('../dataaccess/repository/BuildingRepository');
import Messages = require('../shared/messages');
import UserService = require('./../../framework/services/UserService');
import ProjectAsset = require('../../framework/shared/projectasset');
import User = require('../../framework/dataaccess/mongoose/user');
import Project = require('../dataaccess/mongoose/Project');
import Building = require('../dataaccess/mongoose/Building');
import BuildingReport = require('../dataaccess/model/BuildingReport');
import ThumbRuleReport = require('../dataaccess/model/ThumbRuleReport');
import AuthInterceptor = require('../../framework/interceptor/auth.interceptor');
import CostControllException = require('../exception/CostControllException');
import CostHead = require('../dataaccess/mongoose/CostHead');
import EstimateReport = require('../dataaccess/model/EstimateReport');
import WorkItem = require('../dataaccess/model/WorkItem');
import ThumbRule = require('../dataaccess/model/ThumbRule');
import Estimated = require('../dataaccess/model/Estimated');
import RateAnalysisService = require('./RateAnalysisService');
import SubCategory = require("../dataaccess/model/SubCategory");
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

  private category:any=[];
  private reportThumbrule:any = [];

  constructor() {
    this.projectRepository = new ProjectRepository();
    this.buildingRepository = new BuildingRepository();
    this.APP_NAME = ProjectAsset.APP_NAME;
    this.authInterceptor = new AuthInterceptor();
    this.userService = new UserService();
    this.rateAnalysisService = new RateAnalysisService();
    //this.categoryDetails = new categoryDetails();
  }

  getReport( projectId : any,reportType : string, projectRate : string, areaType : string,  user: User,
             callback: (error: any, result: any) => void) {

    logger.info('Report Service, getReport has been hit');
    let query = { _id: projectId};
    let populate = {path : 'building'};
    this.projectRepository.findAndPopulate(query, populate, (error, result) => {
      logger.info('Report Service, findAndPopulate has been hit');
      if(error) {
        callback(error, null);
      } else {
        let buildings = result[0].building;
        let costHead = [];
        let report : Array<BuildingReport> = [];
        for(let index = 0; index < buildings.length; index++) {
          let buildingReport = new BuildingReport;
          let thumbRuleReport: ThumbRule = new ThumbRule();
          let estimatedReport: Estimated = new Estimated();
          buildingReport.name = buildings[index].name;
          buildingReport._id = buildings[index]._id;
          if (areaType === 'slabArea') {
            if(projectRate==='sqmt'){
              buildingReport.area = (parseFloat(buildings[index].totalSlabArea)*config.get('SqureMeter')).toFixed(2);
            } else {
              buildingReport.area = (parseFloat(buildings[index].totalSlabArea)).toFixed(2);
            }
          } else {
            if(projectRate==='sqmt'){
              buildingReport.area = (parseFloat(buildings[index].totalSaleableAreaOfUnit)*config.get('SqureMeter')).toFixed(2);
            } else {
              buildingReport.area = (parseFloat(buildings[index].totalSaleableAreaOfUnit)).toFixed(2);
            }
          }
          let costHeadArray : any = buildings[index].costHead;
          for (let costHeadIndex = 0; costHeadIndex < costHeadArray.length; costHeadIndex++) {

            if(costHeadArray[costHeadIndex].active === true) {

              let thumbRule: ThumbRuleReport = new ThumbRuleReport();
              let estimateReport: EstimateReport = new EstimateReport();
              thumbRule.name = costHeadArray[costHeadIndex].name;
              estimateReport.name = costHeadArray[costHeadIndex].name;
              thumbRule.rateAnalysisId = costHeadArray[costHeadIndex].rateAnalysisId;
              estimateReport.rateAnalysisId = costHeadArray[costHeadIndex].rateAnalysisId;
              if (areaType === 'slabArea') {
                thumbRuleReport.area = parseFloat(buildings[index].totalSlabArea).toFixed(2);
                estimatedReport.area = parseFloat(buildings[index].totalSlabArea).toFixed(2);
                if (projectRate === 'sqft') {
                  thumbRule.rate = parseFloat(costHeadArray[costHeadIndex].thumbRuleRate.slabArea.sqft).toFixed(2);
                } else {
                  thumbRule.rate = parseFloat(costHeadArray[costHeadIndex].thumbRuleRate.slabArea.sqmt).toFixed(2);
                  thumbRuleReport.area = (parseFloat(buildings[index].totalSlabArea)*config.get('SqureMeter')).toFixed(2);
                  estimatedReport.area = (parseFloat(buildings[index].totalSlabArea)*config.get('SqureMeter')).toFixed(2);
                }
              } else {
                thumbRuleReport.area = parseFloat(buildings[index].totalSaleableAreaOfUnit).toFixed(2);
                estimatedReport.area = parseFloat(buildings[index].totalSaleableAreaOfUnit).toFixed(2);
                if (projectRate === 'sqft') {
                  thumbRule.rate = parseFloat(costHeadArray[costHeadIndex].thumbRuleRate.saleableArea.sqft).toFixed(2);
                } else {
                  thumbRule.rate =parseFloat( costHeadArray[costHeadIndex].thumbRuleRate.saleableArea.sqmt).toFixed(2);
                  thumbRuleReport.area = (parseFloat(buildings[index].totalSaleableAreaOfUnit)*config.get('SqureMeter')).toFixed(2);
                  estimatedReport.area = (parseFloat(buildings[index].totalSaleableAreaOfUnit)*config.get('SqureMeter')).toFixed(2);
                }
              }
              let subCategory: Array<SubCategory> = costHeadArray[costHeadIndex].subCategory;
              if(subCategory.length !== 0) {

                for(let subCategoryKey in subCategory) {
                  let workItem = subCategory[subCategoryKey].workitem;
                  if(workItem.length !== 0) {
                    for (let key in workItem) {
                      if (workItem[key].quantity.total !== null && workItem[key].rate.total !== null
                        && workItem[key].quantity.total !== 0 && workItem[key].rate.total !== 0) {
                        estimateReport.total = (parseFloat(workItem[key].quantity.total)
                          * parseFloat(workItem[key].rate.total)
                          + parseFloat(estimateReport.total)).toFixed(2);
                        let estimatedRate = parseFloat(estimateReport.total) / parseFloat(buildingReport.area);
                        estimateReport.rate = estimatedRate.toFixed(2);
                      } else {
                        estimateReport.total = 0.0;
                        estimateReport.rate = 0.0;
                        break;
                      }
                    }
                  } else {
                    estimateReport.total = 0.0;
                    estimateReport.rate = 0.0;
                    break;
                  }
                }

              }
              estimatedReport.totalEstimatedCost = parseFloat(estimateReport.total)
                +parseFloat( estimatedReport.totalEstimatedCost);
              estimatedReport.totalEstimatedCost=estimatedReport.totalEstimatedCost.toFixed(2);
              estimatedReport.totalRate = parseFloat( estimatedReport.totalRate) + parseFloat(estimateReport.rate);
              estimatedReport.totalRate=estimatedReport.totalRate.toFixed(2);
              estimatedReport.estimatedCost.push(estimateReport);
              if( costHeadArray[costHeadIndex].budgetedCostAmount === 0 ||
                costHeadArray[costHeadIndex].budgetedCostAmount === undefined ) {
                thumbRule.amount = parseFloat(thumbRuleReport.area )* parseFloat(thumbRule.rate);
                thumbRule.amount=thumbRule.amount.toFixed(2);
              } else {
                thumbRule.amount =  parseFloat(costHeadArray[costHeadIndex].budgetedCostAmount);
                thumbRule.amount=thumbRule.amount.toFixed(2);
              }
              thumbRule.costHeadActive = costHeadArray[costHeadIndex].active;
              thumbRuleReport.thumbRuleReport.push(thumbRule);
              thumbRuleReport.totalRate = parseFloat(thumbRuleReport.totalRate) + parseFloat(thumbRule.rate);
              thumbRuleReport.totalRate=thumbRuleReport.totalRate.toFixed(2);
              thumbRuleReport.totalBudgetedCost = parseFloat(thumbRuleReport.totalBudgetedCost)+ parseFloat(thumbRule.amount);
              thumbRuleReport.totalBudgetedCost.toFixed(2);
              buildingReport.estimated = estimatedReport;
              buildingReport.thumbRule = thumbRuleReport;

            }
          }

         /* if(projectRate === 'sqmt') {
            buildingReport.estimated.totalRate = parseFloat(buildingReport.estimated.totalRate)*config.get('SqureMeter');
            buildingReport.estimated.totalRate=buildingReport.estimated.totalRate.toFixed(2);
          }*/
          report.push(buildingReport);
        }

        callback(null,{ data: report, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  getCostHeads( user: User, url: string ,callback: (error: any, result: any) => void) {
    logger.info('Report Service, getCostHeads has been hit');
    this.rateAnalysisService.getCostHeads(user, url,(error, result) => {
      if(error) {
        console.log('error : '+JSON.stringify(error));
        callback(error, null);
      } else {
        callback(null,{ data: result, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }

  getWorkItems( user: User, url: string ,callback: (error: any, result: any) => void) {
    logger.info('Report Service, getWorkItems has been hit');
    this.rateAnalysisService.getWorkItems( user, url,(error, result) => {
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

