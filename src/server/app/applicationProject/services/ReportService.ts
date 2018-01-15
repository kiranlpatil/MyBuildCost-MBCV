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
import EstimateReport = require("../dataaccess/model/EstimateReport");
import WorkItem = require("../dataaccess/model/WorkItem");
import ThumbRule = require("../dataaccess/model/ThumbRule");
import Estimated = require("../dataaccess/model/Estimated");

class ReportService {
  APP_NAME: string;
  company_name: string;
  private projectRepository: ProjectRepository;
  private buildingRepository: BuildingRepository;
  private authInterceptor: AuthInterceptor;
  private userService : UserService;

  private category:any=[];
  private reportThumbrule:any = [];

  constructor() {
    this.projectRepository = new ProjectRepository();
    this.buildingRepository = new BuildingRepository();
    this.APP_NAME = ProjectAsset.APP_NAME;
    this.authInterceptor = new AuthInterceptor();
    this.userService = new UserService();
    //this.categoryDetails = new categoryDetails();
  }

  getReport( projectId : any,reportType : string, projectRate : string, areaType : string,  user: User,
             callback: (error: any, result: any) => void) {
    let query = { _id: projectId};
    let populate = {path : 'building'};
    this.projectRepository.findAndPopulate(query, populate, (error, result) => {
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
          let costHeadArray : CostHead = buildings[index].costHead;
          for (let costHeadIndex = 0; costHeadIndex < costHeadArray.length; costHeadIndex++) {
              let thumbRule: ThumbRuleReport = new ThumbRuleReport();
              let estimateReport: EstimateReport = new EstimateReport();
              thumbRule.name = costHeadArray[costHeadIndex].name;
            estimateReport.name = costHeadArray[costHeadIndex].name;
              if (areaType === 'slabArea') {
                thumbRuleReport.area = buildings[index].totalSlabArea;
                estimatedReport.area = buildings[index].totalSlabArea;
                buildingReport.area = buildings[index].totalSlabArea;
                if (projectRate === 'sqft') {
                  thumbRule.rate = costHeadArray[costHeadIndex].thumbRuleRate.slabArea.sqft;
                } else {
                  thumbRule.rate = costHeadArray[costHeadIndex].thumbRuleRate.slabArea.sqmt;
                }
              } else {
                thumbRuleReport.area = buildings[index].totalSaleableAreaOfUnit;
                estimatedReport.area = buildings[index].totalSaleableAreaOfUnit;
                buildingReport.area = buildings[index].totalSaleableAreaOfUnit;
                if (projectRate === 'sqft') {
                  thumbRule.rate = costHeadArray[costHeadIndex].thumbRuleRate.saleableArea.sqft;
                } else {
                  thumbRule.rate = costHeadArray[costHeadIndex].thumbRuleRate.saleableArea.sqmt;
                }
              }
              let workItem: WorkItem = costHeadArray[costHeadIndex].workitem;
              for(let key in workItem) {
                if(workItem[key].quantity.total !== null && workItem[key].rate.total !== null) {
                  estimateReport.rate = workItem[key].rate.total + estimateReport.rate;
                  estimateReport.total = workItem[key].quantity.total + estimateReport.total;
                }
              }
              estimatedReport.totalEstimatedCost = estimateReport.total + estimatedReport.totalEstimatedCost;
              estimatedReport.totalRate = estimatedReport.totalRate + estimateReport.rate;
              estimatedReport.estimatedCost.push(estimateReport);
              thumbRule.amount = thumbRuleReport.area * thumbRule.rate;
              thumbRule.costHeadActive = costHeadArray[costHeadIndex].active;
              thumbRuleReport.thumbRuleReport.push(thumbRule);
              thumbRuleReport.totalRate = thumbRuleReport.totalRate + thumbRule.rate;
              thumbRuleReport.totalBudgetedCost = thumbRuleReport.totalBudgetedCost + thumbRule.amount;
              buildingReport.estimated = estimatedReport;
              buildingReport.thumbRule = thumbRuleReport;
            }
          report.push(buildingReport);
        }

        callback(null,{ data: report, access_token: this.authInterceptor.issueTokenWithUid(user)});
      }
    });
  }
}

Object.seal(ReportService);
export = ReportService;

