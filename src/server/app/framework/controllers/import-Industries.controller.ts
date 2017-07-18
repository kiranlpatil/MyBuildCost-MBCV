/**
 * Created by techprime002 on 7/11/2017.
 */
import * as express from "express";
import AuthInterceptor = require("../interceptor/auth.interceptor");
import ImportIndustriesModel = require("../dataaccess/model/industry-class.model");
import Messages = require("../shared/messages");
import RoleClassModel = require("../dataaccess/model/role-class.model");
import CapabilityClassModel = require("../dataaccess/model/capability-class.model");
import ComplexityClassModel = require("../dataaccess/model/complexity-class.model");
import ScenarioClassModel = require("../dataaccess/model/scenario-class.model");
import ImportIndustryService = require("../services/import-industries.service");
import DefaultComplexityModel = require("../dataaccess/model/default-complexity.model");
var xlsxj = require("xlsx-to-json");
let importIndustriesService = new ImportIndustryService();
//http://localhost:8080/api/readxlsx

export function readXlsx(req: express.Request, res: express.Response) {
  var filepath = "./src/server/app/framework/public/config/NewIndustryDataExcel.xlsx";
  var rolesArray:any=[];
  xlsxj({
    input: filepath,
    output: null
  }, function(err:any, result:any) {
    if(err) {
      console.error(err);
    }else {
      var rolesArray:any = [];

      for (let i = 0; i < result.length; i++) {
        rolesArray = addRole(result[i], rolesArray)
      }

      for (let i = 0; i < rolesArray.length; i++) {
        var capabilities:any = [];
        for (let j = 1; j < result.length; j++) {
          var currentRow = result[j];
          if (rolesArray[i].name == currentRow.area_of_work) {
            capabilities = addCapabilities(result[j], capabilities)
          }
          else {
            rolesArray[i].capabilities = capabilities;
          }
        }
      }

      for (let i = 0; i < rolesArray.length; i++) {
      for (let capIndex = 0; capIndex < rolesArray[i].capabilities.length; capIndex++) {
          let complexities:any = [];
          for (let j = 0; j < result.length; j++) {
            let currentRow = result[j];
            if (rolesArray[i].capabilities[capIndex].name == currentRow.capability) {
              complexities = addComplexities(result[j], complexities);
            }
          }
        rolesArray[i].capabilities[capIndex].complexities = complexities;
        }
      }

      for(let i=0;i<rolesArray.length;i++){
        rolesArray[i].default_complexities=new Array(0);
        if(rolesArray[i].capabilities[0].name.startsWith("Default")){
          rolesArray[i].default_complexities.push(rolesArray[i].capabilities[0]);
          rolesArray[i].capabilities.shift();
        }
        if(rolesArray[i].name==""){
          rolesArray.splice(i,1);
        }
      }

      let industry = new ImportIndustriesModel(result[0].industry,rolesArray);

      importIndustriesService.create(industry, (error, result) => {
        if (error) {
          console.log("crt role error", error);
        }
        else {
          var auth: AuthInterceptor = new AuthInterceptor();
          var token = auth.issueTokenWithUid(industry);
          res.status(200).send({
            "status": Messages.STATUS_SUCCESS,
            "data": {
              "reason": "Data inserted Successfully in Industry",
              "code": 200,
              "result": result,
            },
            access_token: token
          });
        }
      });
      }
  });
}

function addRole(currentRow:any,roles:any){
   if(roles.length!=0){
   for(let i=0;i<roles.length;i++){
     if(currentRow.area_of_work==roles[i].name){
       return roles;
     }
     else {
       if(i==(roles.length-1)){
       let newRole = new RoleClassModel(currentRow);
         roles.push(newRole);
       }
     }
   }
   return roles;
   }
  else {
     let newRole = new RoleClassModel(currentRow);
     roles.push(newRole);
    return roles;
  }
}

function addCapabilities(currentRow:any,capabilities:any){
  if(capabilities.length!=0){
    for(let i=0;i<capabilities.length;i++){
      if(currentRow.capability==capabilities[i].name){
        //addCapabilities(currentRow,capabilities)
      }
      else {
        if(i==(capabilities.length-1)){
          var newCapability= new CapabilityClassModel(currentRow);
          capabilities.push(newCapability);
        }
      }
    }
    return capabilities;
  }
  else {
    var newCapability= new CapabilityClassModel(currentRow);
    capabilities.push(newCapability);
    return capabilities;
  }
}

function addComplexities(currentRow:any,complexities:any){
  if(complexities.length!=0){
    for(let i=0;i<complexities.length;i++){
      if(currentRow.complexity==complexities[i].name){
      }
      else {
        if(i==(complexities.length-1)){
          var newComplexity= new ComplexityClassModel(currentRow);
          let scenarios : ScenarioClassModel[] = new Array(0);
          for(let sceIndex : number =0 ;sceIndex<5; sceIndex++){
            let sceName = 'Scenario'+(sceIndex+1).toString();
            let newScenario : ScenarioClassModel = new ScenarioClassModel(currentRow[sceName],((sceIndex+1)*10).toString());
            if(newScenario.name!==""){
            scenarios.push(newScenario);}
          }
          let s : ScenarioClassModel = new ScenarioClassModel('Not Applicable',""+0);
          scenarios.push(s);
          newComplexity.scenarios=scenarios;
          complexities.push(newComplexity);
        }
      }
    }
    return complexities;
  }
  else {
    var newComplexity= new ComplexityClassModel(currentRow);
    let scenarios : ScenarioClassModel[] = new Array(0);
    for(let sceIndex : number =0 ;sceIndex<5; sceIndex++){
      let sceName = 'Scenario'+(sceIndex+1).toString();
      let newScenario : ScenarioClassModel = new ScenarioClassModel(currentRow[sceName],((sceIndex+1)*10).toString());
      if(newScenario.name!==""){
        scenarios.push(newScenario);}
    }
    let s : ScenarioClassModel = new ScenarioClassModel('Not Applicable',""+0);
    scenarios.push(s);
    newComplexity.scenarios=scenarios;
    complexities.push(newComplexity);
    return complexities;
  }
}
