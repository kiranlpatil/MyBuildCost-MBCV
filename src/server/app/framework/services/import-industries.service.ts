import IndustryRepository = require('../dataaccess/repository/import-industries.repository');
/**
 * Created by techprime002 on 7/11/2017.
 */
var xlsxj = require('xlsx-to-json');
import CNextMessages = require('../shared/cnext-messages');
import ProjectAsset = require('../shared/projectasset');
import ImportIndustriesModel = require('../dataaccess/model/industry-class.model');
import IndustryService = require('./industry.service');
import RoleService = require('./role.service');
import CapabilityService = require('./capability.service');
import ComplexityService = require('./complexity.service');

let RolesService = new RoleService();
let CapabilitiesService = new CapabilityService();
let ComplexitiesService = new ComplexityService();

class ImportIndustryService {
  APP_NAME: string;
  private importIndustriesRepository: IndustryRepository;

  constructor() {
    this.importIndustriesRepository = new IndustryRepository();
    this.APP_NAME = ProjectAsset.APP_NAME;
  }

  create(item: any, callback: (error: any, result: any) => void) {

    let industryService : IndustryService;
    industryService = new IndustryService();
    industryService.create(item,(errinCreate: any, response: any) => {
      if (errinCreate) {
        callback(new Error(CNextMessages.PROBLEM_IN_CREATING_INDUSTRY), null);
      } else {
        if (response.length === 0) {
          callback('Empty Response', null);
        } else {
          callback(null, response);
          //this.importIndustriesRepository.findOneAndUpdate({'_id': response[0]._id}, item, {new: true}, callback);
        }
      }
    });
  }

  readXlsx(filePath:string, callback:(error:any, result:any) => void) {
    xlsxj({
      input: filePath,
      output: null
    }, function (err:any, result:any) {
      let isSend : boolean =false;
      if (err) {
        console.error(err);
        callback(err, null);
      } else {
        var rolesArray:any = [];

        for (let i = 0; i < result.length-1; i++) {
          if(result[i].area_of_work_code == ''){
            if(result[i].area_of_work_code == '' && result[i].capability =='' && result[i].complexity=='') {
            }else {
              console.log(' role name '+i+result[i].area_of_work);
              if(!isSend) {
                isSend=true;
                callback(new Error('Code is not given for area of work - '+result[i].area_of_work),null);
              }
            }
          }
          rolesArray = RolesService.addRole(result[i], rolesArray);
        }

        for (let i = 0; i < rolesArray.length; i++) {
          var capabilities: any = [];
          for (let j = 1; j < result.length; j++) {
            var currentRow = result[j];
            if (rolesArray[i].name === currentRow.area_of_work) {
              if(result[j].capability_code == '') {
                if(result[j].area_of_work == '' && result[j].capability =='' && result[j].complexity=='') {
                }else {
                  console.log(' role name '+i+result[i].area_of_work);
                  if(!isSend) {
                    isSend=true;
                    callback(new Error('Code is not given for capability - '+result[j].capability),null);
                  }
                }
              }
              capabilities = CapabilitiesService.addCapabilities(result[j], capabilities);
            } else {
              rolesArray[i].capabilities = capabilities;
            }
          }
        }

        for (let i = 0; i < rolesArray.length; i++) {
          for (let capIndex = 0; capIndex < rolesArray[i].capabilities.length; capIndex++) {
            let complexities:any = [];
            for (let j = 0; j < result.length; j++) {
              let currentRow = result[j];
              if (rolesArray[i].capabilities[capIndex].name === currentRow.capability) {
                if(result[j].complexity_code == '') {
                  if(result[j].area_of_work == '' && result[j].capability =='' && result[j].complexity=='') {
                  }else {
                    console.log(' role name '+i+result[i].area_of_work);
                    if(!isSend) {
                      isSend=true;
                      callback(new Error('Code is not given for complexity - '+result[j].complexity),null);
                    }
                  }
                }
                complexities = ComplexitiesService.addComplexities(result[j], complexities);
              }
            }
            rolesArray[i].capabilities[capIndex].complexities = complexities;
          }
        }

        for (let i = 0; i < rolesArray.length; i++) {
          rolesArray[i].default_complexities = new Array(0);
          let temp = new Array(0);
          for (let c in rolesArray[i].capabilities) {
            //if(rolesArray[i].name == 'IT Support'){
            if (rolesArray[i].capabilities[c].code.startsWith('d')) {
              let tempCode = rolesArray[i].capabilities[c].code.split("d")[1];
              rolesArray[i].capabilities[c].code = tempCode;
              rolesArray[i].default_complexities.push(rolesArray[i].capabilities[c]);
              temp.push(c);
            }
            //}
          }

          if (temp.length > 0) {
            for (let t = temp.length - 1; t >= 0; t--) {
              rolesArray[i].capabilities.splice(temp[t], 1);
            }
          }


          if (rolesArray[i].name === '') {
            rolesArray.splice(i, 1);
          }
        }

        /*for (let i = 0; i < rolesArray.length; i++) {
         rolesArray[i].default_complexities = new Array(0);
          if (rolesArray[i].capabilities[0].name.startsWith('Default')) {
            rolesArray[i].default_complexities.push(rolesArray[i].capabilities[0]);
            rolesArray[i].capabilities.shift();
          }
          if (rolesArray[i].name === '') {
            rolesArray.splice(i, 1);
          }
         }*/

        let industry = new ImportIndustriesModel(result[0].industry, result[0].code,result[0].sort_order,rolesArray);
        if(!isSend) {
          callback(null, industry);
        }
      }
    });
  }
}

Object.seal(ImportIndustryService);
export = ImportIndustryService;
