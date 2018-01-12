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
import CostHead = require("../dataaccess/mongoose/CostHead");

class ReportService {
  APP_NAME: string;
  company_name: string;
  private projectRepository: ProjectRepository;
  private buildingRepository: BuildingRepository;
  private authInterceptor: AuthInterceptor;
  private userService : UserService;

  category:any=[];
  reportThumbrule:any = [];

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
        /*let buildings = result[0].building;
        let costHad = result[0].costHead;

        for(let costHead of costHad) {
          let catDetails : ThumbRuleReport = new ThumbRuleReport();
          catDetails.name = costHead.name;
            catDetails.rate = costHead[reportType][areaType][projectRate];
          this.category.push(catDetails);
        }

        for(let building of buildings) {
          let buildingReport : BuildingReport = new BuildingReport();
          buildingReport.name = building.name;
          if(areaType === 'slabArea') {
            buildingReport.area = building.totalSlabArea;
          } else {
            buildingReport.area = building.totalSaleableAreaOfUnit;
          }
          buildingReport.costHead = this.category;
          this.reportThumbrule.push(buildingReport);
        }*/
        let buildings = result[0].building;
        let costHeadArray = result[0].costHead;
        let costHead = [];
        /*for(let index = 0; index < costHeadArray.length; index++) {
          costHead.push({name: costHeadArray[index].name, active: costHeadArray[index].active});
        }*/
        let report : Array<BuildingReport> = [];
        for(let index = 0; index < buildings.length; index++) {
          let buildingReport = new BuildingReport;
          buildingReport.name = buildings[index].name;
          /*buildingReport.costHead = costHead;*/

          for(let costHeadIndex = 0; costHeadIndex < costHeadArray.length; costHeadIndex++) {
            let thumbRule: ThumbRuleReport = new ThumbRuleReport();
            thumbRule.name = costHeadArray[costHeadIndex].name;
            if(areaType === 'slabArea') {
              buildingReport.area = buildings[index].totalSlabArea;
              if(projectRate === 'sqft') {
                thumbRule.rate = costHeadArray[costHeadIndex].thumbRuleRate.slabArea.sqft;
              } else {
                thumbRule.rate = costHeadArray[costHeadIndex].thumbRuleRate.slabArea.sqmt;
              }
            } else {
              buildingReport.area = buildings[index].totalSaleableAreaOfUnit;
              if(projectRate === 'sqft') {
                thumbRule.rate = costHeadArray[costHeadIndex].thumbRuleRate.saleableArea.sqft;
              } else {
                thumbRule.rate = costHeadArray[costHeadIndex].thumbRuleRate.saleableArea.sqmt;
              }
            }
            thumbRule.amount = buildingReport.area * thumbRule.rate;
            thumbRule.costHeadActive = costHeadArray[costHeadIndex].active;
            buildingReport.thumbRuleReport.push(thumbRule);
          }
          report.push(buildingReport);
        }

        callback(null,{ data: report, access_token: this.authInterceptor.issueTokenWithUid(user)});
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
}

Object.seal(ReportService);
export = ReportService;
