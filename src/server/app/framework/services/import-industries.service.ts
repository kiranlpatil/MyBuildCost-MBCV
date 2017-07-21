import IndustryRepository = require('../dataaccess/repository/import-industries.repository');
/**
 * Created by techprime002 on 7/11/2017.
 */
var config = require('config');
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
  private importIndustriesRepository: IndustryRepository;
  APP_NAME: string;

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
          console.log('response'+JSON.stringify(response));
          callback('Empty Response', null);
        } else {
          console.log('response : '+JSON.stringify(response));
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
      if (err) {
        console.error(err);
        callback(err, null);
      } else {
        var rolesArray:any = [];

        for (let i = 0; i < result.length; i++) {
          rolesArray = RolesService.addRole(result[i], rolesArray);
        }

        for (let i = 0; i < rolesArray.length; i++) {
          var capabilities:any = [];
          for (let j = 1; j < result.length; j++) {
            var currentRow = result[j];
            if (rolesArray[i].name === currentRow.area_of_work) {
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
                complexities = ComplexitiesService.addComplexities(result[j], complexities);
              }
            }
            rolesArray[i].capabilities[capIndex].complexities = complexities;
          }
        }

        for (let i = 0; i < rolesArray.length; i++) {
          rolesArray[i].default_complexities = new Array(0);
          if (rolesArray[i].capabilities[0].name.startsWith('Default')) {
            rolesArray[i].default_complexities.push(rolesArray[i].capabilities[0]);
            rolesArray[i].capabilities.shift();
          }
          if (rolesArray[i].name === '') {
            rolesArray.splice(i, 1);
          }
        }

        let industry = new ImportIndustriesModel(result[0].industry, rolesArray);
        callback(null, industry);
      }
    });
  }
}

Object.seal(ImportIndustryService);
export = ImportIndustryService;
