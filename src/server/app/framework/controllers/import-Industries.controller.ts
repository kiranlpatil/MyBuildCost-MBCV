/**
 * Created by techprime002 on 7/11/2017.
 */
import * as express from "express";
import AuthInterceptor = require("../interceptor/auth.interceptor");
import ImportIndustriesModel = require("../dataaccess/model/industry-class.model");
import Messages = require("../shared/messages");
//import IndustryClassModel = require("../dataaccess/model/industry-class.model");
import RoleClassModel = require("../dataaccess/model/role-class.model");
import CapabilityClassModel = require("../dataaccess/model/capability-class.model");
import ComplexityClassModel = require("../dataaccess/model/complexity-class.model");
import ScenarioClassModel = require("../dataaccess/model/scenario-class.model");
import ImportIndustryService = require("../services/import-industries.service");
import DefaultComplexityModel = require("../dataaccess/model/default-complexity.model");
/*var Excel = require('exceljs');
 var workbook = new Excel.Workbook();*/
var xlsxj = require("xlsx-to-json");
let importIndustriesService = new ImportIndustryService();
//http://localhost:8080/api/readxlsx

export function readXlsx(req: express.Request, res: express.Response) {
  var filepath = "./src/server/app/framework/public/config/NewIndustryDataExcel.xlsx";
  var rolesArray:any=[];
  xlsxj({
    input: filepath,
    output: "output.json"
  }, function(err:any, result:any) {
    if(err) {
      console.error(err);
    }else {
      console.log(result.length);
      var compareRow:any = [];
      for (let i = 0; i < result.length; i++) {
        compareRow = addRole(result[i], compareRow)
      }
      let j:number;
      for (let i = 0; i < compareRow.length; i++) {
        var compareCapabilities:any = [];
        for (j = 1; j < result.length; j++) {
          var currentRow = result[j];
          if (compareRow[i].name == currentRow.area_of_work) {
            compareCapabilities = addCapabilities(result[j], compareCapabilities)
          }
          else {
            compareRow[i].capabilities = compareCapabilities;
          }
        }
      }
      for (let i = 0; i < compareRow.length; i++) {
        for (let capIndex = 0; capIndex < compareRow[i].capabilities.length; capIndex++) {
          let complexities:any = [];
          for (let j = 0; j < result.length; j++) {
            let currentRow = result[j];
            if (compareRow[i].capabilities[capIndex].name == currentRow.capability) {
              complexities = addComplexities(result[j], complexities);
            }
          }
          compareRow[i].capabilities[capIndex].complexities = complexities;
        }
      }
      for(let i=0;i<compareRow.length;i++){
        var capabilityObject:any;
        compareRow[i].default_complexities=new Array(0);
        capabilityObject=compareRow[i].capabilities[0];
        var input=compareRow[i].capabilities[0].name;
        var fields = input.split('-');
        var name = fields[0];
        if(name=="Default"){
          compareRow[i].default_complexities.push(capabilityObject);
          compareRow[i].capabilities.shift();
        }
      }


      let industry : ImportIndustriesModel;
      industry= new ImportIndustriesModel();
      industry.name=result[0].industry;
      industry.roles=compareRow;
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
              "code": industry,
              "result": result,
            },
            access_token: token
          });
        }
      });
      }
  });
}

function addRole(newRow:any,row:any){
   let i:number;
   if(row.length!=0){
   for(i=0;i<row.length;i++){
     if(newRow.area_of_work==row[i].name){
       //addCapabilities(newRow)
     }
     else {
       if(i==(row.length-1)){
       var role= new RoleClassModel();
       role.name=newRow.area_of_work;
       role.code=newRow.area_of_work_code;
       role.sort_order=newRow.area_of_work_display_sequence;
         row.push(role);
       }
     }
   }
     return row;
   }

  else {
    var role= new RoleClassModel();
    role.name=newRow.area_of_work;
     role.code=newRow.area_of_work_code;
     role.sort_order=newRow.area_of_work_display_sequence;
     row.push(role);
     return row;
  }
}

function addCapabilities(newRow:any,compareCapabilities:any){
  let i:number;
  if(compareCapabilities.length!=0){
    for(i=0;i<compareCapabilities.length;i++){
      if(newRow.capability==compareCapabilities[i].name){
        //addCapabilities(newRow,compareCapabilities)
      }
      else {
        if(i==(compareCapabilities.length-1)){
          var capabilities= new CapabilityClassModel();
            capabilities.name=newRow.capability;
            capabilities.code=newRow.capability_code;
            capabilities.sort_order=newRow.capability_display_sequence;
            compareCapabilities.push(capabilities);

        }
      }
    }
    return compareCapabilities;
  }
  else {
    var capabilities= new CapabilityClassModel();
    capabilities.name=newRow.capability;
    capabilities.code=newRow.capability_code;
    capabilities.sort_order=newRow.capability_display_sequence;
    compareCapabilities.push(capabilities);

    return compareCapabilities;
  }
}

function addComplexities(newRow:any,compareComplexities:any){
  let i:number;
  //console.log(compareCapabilities);
  if(compareComplexities.length!=0){
    for(i=0;i<compareComplexities.length;i++){
      if(newRow.complexity==compareComplexities[i].name){
        //addCapabilities(newRow,compareCapabilities)
      }
      else {
        if(i==(compareComplexities.length-1)){
          var complexities= new ComplexityClassModel();
          complexities.name=newRow.complexity;
          complexities.code=newRow.complexity_code;
          complexities.question=newRow.complexity_question_for_participant;
          let scenarios : ScenarioClassModel[] = new Array(0);
          for(let sceIndex : number =0 ;sceIndex<5; sceIndex++){
            let sceName = 'Scenario'+(sceIndex+1).toString();
            let s1 : ScenarioClassModel = new ScenarioClassModel();
            s1.name=newRow[sceName];
            s1.code=((sceIndex+1)*10).toString();
            if(s1.name!==""){
            scenarios.push(s1);}
          }
          let s : ScenarioClassModel = new ScenarioClassModel();
          s.name='Not Applicable';
          s.code=""+0;
          complexities.scenarios=scenarios;
          compareComplexities.push(complexities);
        }
      }
    }
    return compareComplexities;
  }

  else {
    var complexities= new ComplexityClassModel();
    complexities.name=newRow.complexity;
    complexities.code=newRow.complexity_code;
    complexities.question=newRow.complexity_question_for_participant;
    let scenarios : ScenarioClassModel[] = new Array(0);
    for(let sceIndex : number =0 ;sceIndex<5; sceIndex++){
      let sceName = 'Scenario'+(sceIndex+1).toString();
      let s1 : ScenarioClassModel = new ScenarioClassModel();
      s1.name=newRow[sceName];
      s1.code=((sceIndex+1)*10).toString();
      if(s1.name!==""){
        scenarios.push(s1);}
    }
    let s : ScenarioClassModel = new ScenarioClassModel();
    s.name='Not Applicable';
    s.code=""+0;
    complexities.scenarios=scenarios;
    compareComplexities.push(complexities);
    return compareComplexities;
  }
}

export function create(req: express.Request, res: express.Response, next: any) {
  try {
    let newImportIndustry: ImportIndustriesModel = <ImportIndustriesModel>req.body;
    let importIndustriesService = new ImportIndustryService();
    importIndustriesService.create(newImportIndustry, (error, result) => {
      if (error) {
        console.log("crt role error", error);
      }
      else {
        var auth: AuthInterceptor = new AuthInterceptor();
        var token = auth.issueTokenWithUid(newImportIndustry);
        res.status(200).send({
          "status": Messages.STATUS_SUCCESS,
          "data": {
            "reason": "Data inserted Successfully in Industry",
            "code": newImportIndustry,
            "result": result,
          },
          access_token: token
        });
      }
    });
  }
  catch (e) {
    res.status(403).send({"status": Messages.STATUS_ERROR, "error_message": e.message});
  }
}


