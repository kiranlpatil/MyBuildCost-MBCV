import * as express from "express";
import * as multiparty from "multiparty";
import AuthInterceptor = require("../interceptor/auth.interceptor");
import SendMailService = require("../services/sendmail.service");
import UserModel = require("../dataaccess/model/user.model");
import Messages = require("../shared/messages");
import ResponseService = require("../shared/response.service");
import CandidateModel = require("../dataaccess/model/candidate.model");
import CandidateService = require("../services/candidate.service");
import IndustryService = require("../services/industry.service");
import IndustryModel = require("../dataaccess/model/industry.model");
import RoleModel = require("../dataaccess/model/role.model");
import CapabilityModel = require("../dataaccess/model/capability.model");
import ComplexityModel = require("../dataaccess/model/complexity.model");
import ScenarioModel = require("../dataaccess/model/scenario.model");
import ScenarioService = require("../services/scenario.service");
import ComplexityService = require("../services/complexity.service");
import CapabilityService = require("../services/capability.service");
import RoleService = require("../services/role.service");


export function retrieve(req:express.Request, res:express.Response, next:any) {
  try {
    var industryService = new IndustryService();
    var params = {};
    industryService.retrieve(params, (error, result) => {
      if (error) {
        next({
          reason: 'Error In Retriving',//Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
          message: Messages.MSG_ERROR_WRONG_TOKEN,
          code: 401
        });
      }
      else {
        console.log("Data " + JSON.stringify(result));
        //  var token = auth.issueTokenWithUid(user);
        res.send({
          "status": "success",
          "data": result
        });

      }
    });
  }
  catch (e) {
    res.status(403).send({message: e.message});
  }
}
export function create(req:express.Request, res:express.Response, next:any) { //todo code should be review be Sudhakar
  try {
    let newIndustry:IndustryModel = <IndustryModel>req.body;
    let newRole:RoleModel = <RoleModel>req.body.roles;
    let scenarioService:ScenarioService = new ScenarioService();
    let complexityService:ComplexityService = new ComplexityService();
    let capabilityService:CapabilityService = new CapabilityService();
    let roleService:RoleService = new RoleService();
    let industryService = new IndustryService();
    let rolesId: string[]=new Array(0);
    for (let index1 = 0; index1 < newRole.length; index1++) {
      let capabilityIds:string[] = new Array(0);
      for (let index2 = 0; index2 < newRole[index1].capabilities.length; index2++) {
        let complexityIds:string[] = new Array(0);
        for (let index = 0; index < newRole[index1].capabilities[index2].complexities.length; index++) {
          let ids:string[] = new Array(0);
          for (let i = 0; i < newRole[index1].capabilities[index2].complexities[index].scenarios.length; i++) {
            scenarioService.create(newRole[index1].capabilities[index2].complexities[index].scenarios[i], (error, result) => {
              if (error) {
                console.log("crt complexity error", error);
              }
              else {
                ids.push(result._id);
              }
            });
          }
          setTimeout(function () {
            newRole[index1].capabilities[index2].complexities[index].scenarios = ids;
            complexityService.create(newRole[index1].capabilities[index2].complexities[index], (error, result) => {
              if (error) {
                console.log("crt complexity error", error);
              }
              else {
                complexityIds.push(result._id);
              }
            });
          }, 200);
        }
        setTimeout(function () {
          newRole[index1].capabilities[index2].complexities = complexityIds;
          console.log("----------------------------------------------------");
          console.log("cap" + complexityIds);
          capabilityService.create(newRole[index1].capabilities[index2], (error, result) => {
            if (error) {
              console.log("crt complexity error", error);
            }
            else {
              capabilityIds.push(result._id);
            }
          });
        }, 300);
      }
      setTimeout(function () {
        newRole[index1].capabilities = capabilityIds;
        roleService.create(newRole[index1], (error, result) => {
          if (error) {
            console.log("crt role error", error);
          }
          else {
            rolesId.push(result._id);
          }
        });
      }, 400);
    }
    setTimeout(function () {
      newIndustry.roles = rolesId;
      console.log("Roles")
      industryService.create(newIndustry, (error, result) => {
        if (error) {
          console.log("crt role error", error);
        }
        else {
          var auth:AuthInterceptor = new AuthInterceptor();
          var token = auth.issueTokenWithUid(newIndustry);
          res.status(200).send({
              "status": Messages.STATUS_SUCCESS,
              "data": {
                "reason": "Data inserted Successfully in Industry",
                "code_name": newIndustry.code_name,
                "name": newIndustry.name,
                "roles": newIndustry.roles,
                "_id": result._id,
              },
              access_token: token
            });
          console.log("industry inserted");
        }
      });
    }, 4000);
  }
  catch (e) {
    res.status(403).send({"status": Messages.STATUS_ERROR, "error_message": e.message});
  }
}
