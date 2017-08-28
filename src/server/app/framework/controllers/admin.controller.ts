/**
 * Created by techprime002 on 8/28/2017.
 */
/**
 * Created by techprime002 on 7/11/2017.
 */
import * as express from 'express';
import fs = require('fs');
import AuthInterceptor = require('../interceptor/auth.interceptor');
import Messages = require('../shared/messages');
import ImportIndustryService = require('../services/import-industries.service');
import UserService = require("../services/user.service");
import AdminService = require("../services/admin.service");
let importIndustriesService = new ImportIndustryService();

export function getAllUser(req: express.Request, res: express.Response, next: any) {
  try {
    var userService = new UserService();
    var adminService = new AdminService();
    var params = {};
    userService.retrieveAll(params, (error, result) => {
      if (error) {
        next({
          reason: 'Error In Retrieving',//Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
          message: "error in create excel",
          code: 403
        });
      } else {
        adminService.seperateUsers(result,(error, resp) => {
          if (error) {
            next({
              reason: 'Error In Retrieving',//Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
              message: "error in create excel",
              code: 403
            });
          }else {
            adminService.createXlsx(resp, (err, respo)=> {
              if (err) {
                next({
                  reason: 'Error In Retrieving',//Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
                  message: "error in create excel",
                  code: 403
                });
              }
              else {
                res.status(200).send({
                  'status': 'success',
                  'data': resp
                });
              }
            });
          }

        });
/*

*/
      }
    });
  }
  catch (e) {
    res.status(403).send({message: e.message});
  }
};

export function writeXlsx() {
  /*  var json2xls = require('json2xls');
   var jsonArr =[
   {
   "carModel":"Audi",
   "price":0,
   "colors":"blue"
   },
   {
   "carModel":"Audi",
   "price":0,
   "colors":"green"
   },
   {
   "carModel":"Audi",
   "price":0,
   "colors":"yellow"
   },
   {
   "carModel":"BMW",
   "price":15000,
   "colors":"red"
   },
   {
   "carModel":"BMW",
   "price":15000,
   "colors":"blue"
   },
   {
   "carModel":"Mercedes",
   "price":20000,
   "colors":"yellow"
   },
   {
   "carModel":"Porsche",
   "price":30000,
   "colors":"green"
   },
   {
   "carModel":"Porsche",
   "price":30000,
   "colors":"teal"
   },
   {
   "carModel":"Porsche",
   "price":30000,
   "colors":"aqua"
   }
   ];

   var xls = json2xls(jsonArr);
   fs.writeFileSync('E://logexcelfile.xlsx', xls, 'binary');*/
  var json2csv = require("json2csv");
  var fs = require('fs');
  var fields = ['name', 'code', 'sort_order','roles.name','roles.code','roles.sort_order','roles.default_complexities.name',
    'roles.default_complexities.code','roles.default_complexities.sort_order',
    'roles.default_complexities.complexities.name','roles.default_complexities.complexities.code','roles.default_complexities.complexities.complexities_sort_order',
    'roles.default_complexities.complexities.scenarios.scenarios_name','roles.default_complexities.complexities.scenarios.scenarios_code'];
  var fieldNames = ['name', 'code', 'sort_order','rolesName','rolesode','rolessort_order','rolesdefault_complexities.name',
    'rolesdefault_complexitiescode','rolesdefault_complexitiessort_order',
    'rolesdefault_complexitiescomplexitiesname','roles.default_complexitiescomplexitiescode','rolesdefault_complexitiescomplexities.complexities_sort_order',
    'roles.default_complexitiescomplexitiesscenariosscenarios_name','rolesdefault_complexitiescomplexitiesscenariosscenarios_code'];

  var myCars = [
    /*{
     "car": "Audi",
     "price": 10000,
     "color": "blue"
     }, {
     "car": "BMW",
     "price": 20000,
     "color": "black"
     }, {
     "car": "Porsche",
     "price": 30000,
     "color": "green"
     }*/
    /*{
      "name" : "IT",
      "code" : "4",
      "sort_order" : 1,
      "roles" : [
        {
          "name" : "Project/ Program/ Contracts/ Client Management",
          "code" : "10001",
          "sort_order" : 1,
          "default_complexities" : [
            {
              "name" : "Default-Essentials of Project / Program Management",
              "code" : "90001",
              "sort_order" : 1,
              "complexities" : [
                {
                  "name" : "Team Size",
                  "code" : "100001",
                  "sort_order" : 1,
                  "complexities_questionForCandidate" : "What is the maximum team size that you have managed?",
                  "complexities_questionForRecruiter" : "What is the expected Team Size to be handled by the candidate?",
                  "complexities_questionHeaderForCandidate" : "",
                  "complexities_questionHeaderForRecruiter" : "What are your expectations about the candidate's experience in the area of",
                  "scenarios" : [
                    {
                      "scenarios_name" : "Upto 10 members",
                      "scenarios_code" : "10"
                    },
                    {
                      "scenarios_name" : "10 - 50 members",
                      "scenarios_code" : "20"
                    },
                    {
                      "scenarios_name" : "50 - 200 members",
                      "scenarios_code" : "30"
                    },
                    {
                      "scenarios_name" : "Above 200 members",
                      "scenarios_code" : "40"
                    },
                    {
                      "scenarios_name" : "Not Applicable",
                      "scenarios_code" : "0"
                    }
                  ]
                },
                {
                  "name" : "Requirements & Scope",
                  "code" : "100002",
                  "sort_order" : 2,
                  "questionForCandidate" : "The nature of the requirement and  scope of your project/program is:",
                  "questionForRecruiter" : "How frequently do the requirements and scope change for the project/program?",
                  "questionHeaderForCandidate" : "Tell us about your experience in the area of",
                  "questionHeaderForRecruiter" : "What are your expectations about the candidate's experience in the area of",
                  "scenarios" : [
                    {
                      "scenarios_name" : "Stable Requirements & Scope leaving sufficient time to plan",
                      "scenarios_code" : "10"
                    },
                    {
                      "scenarios_name" : "Frequent changess to project Requirements & Scope",
                      "scenarios_code" : "20"
                    },
                    {
                      "scenarios_name" : "Volatile / Ad-hoc changes to the scope and requirements",
                      "scenarios_code" : "30"
                    },
                    {
                      "scenarios_name" : "Not Applicable",
                      "scenarios_code" : "0"
                    }
                  ]
                },
                {
                  "name" : "Technology",
                  "code" : "100003",
                  "sort_order" : 3,
                  "questionForCandidate" : "Describe the nature of technology  you have worked on:",
                  "questionForRecruiter" : "What is the nature of technologies that the candidate is expected to handle?",
                  "questionHeaderForCandidate" : "Tell us about your experience in the area of",
                  "questionHeaderForRecruiter" : "What are your expectations about the candidate's experience in the area of",
                  "scenarios" : [
                    {
                      "scenarios_name" : "Legacy / Stable",
                      "scenarios_code" : "10"
                    },
                    {
                      "scenarios_name" : "Emerging Technologies",
                      "scenarios_code" : "20"
                    },
                    {
                      "scenarios_name" : "Mix of Legacy & Emerging",
                      "scenarios_code" : "30"
                    },
                    {
                      "scenarios_name": "Not Applicable",
                      "scenarios_code": "0"
                    }
                  ]
                },
                {
                  "name" : "Application / Platform Complexity",
                  "code" : "100004",
                  "sort_order" : 4,
                  "questionForCandidate" : "How do you describe the complexity of the Application /Platform that you work on?",
                  "questionForRecruiter" : "Describe the complexity of the Application /Platform that the candidate is expected to handle",
                  "questionHeaderForCandidate" : "Tell us about your experience in the area of",
                  "questionHeaderForRecruiter" : "What are your expectations about the candidate's experience in the area of",
                  "scenarios" : [
                    {
                      "scenarios_name" : "Simple to understand & Implement",
                      "scenarios_code" : "10"
                    },
                    {
                      "scenarios_name" : "Average as per industry norms",
                      "scenarios_code" : "20"
                    },
                    {
                      "scenarios_name" : "Complex to understand the functionality, technology & Business Logic",
                      "scenarios_code" : "30"
                    },
                    {
                      "scenarios_name" : "Not Applicable",
                      "scenarios_code" : "0"
                    }
                  ]
                },
                {
                  "name" : "No of projects handled in parallel",
                  "code" : "100005",
                  "sort_order" : 5,
                  "questionForCandidate" : "How many projects have you managed in parallel?",
                  "questionForRecruiter" : "No of Projects expected to be managed in parallel",
                  "questionHeaderForCandidate" : "Tell us about your experience in the area of",
                  "questionHeaderForRecruiter" : "What are your expectations about the candidate's experience in the area of",
                  "scenarios" : [
                    {
                      "scenarios_name" : "Single",
                      "scenarios_code" : "10"
                    },
                    {
                      "scenarios_name" : "2 - 5",
                      "scenarios_code" : "20"
                    },
                    {
                      "scenarios_name" : "More than 5",
                      "scenarios_code" : "30"
                    },
                    {
                      "scenarios_name" : "Not Applicable",
                      "scenarios_code" : "0"
                    }
                  ]
                },
                {
                  "name" : "Project Team Location",
                  "code" : "100006",
                  "sort_order" : 6,
                  "questionForCandidate" : "Have you handled teams across locations?",
                  "questionForRecruiter" : "Are you expecting the candidate to handle teams across multiple locations?",
                  "questionHeaderForCandidate" : "Tell us about your experience in the area of",
                  "questionHeaderForRecruiter" : "What are your expectations about the candidate's experience in the area of",
                  "scenarios" : [
                    {
                      "scenarios_name" : "Single / Co-located teams",
                      "scenarios_code" : "10"
                    },
                    {
                      "scenarios_name" : "Teams at multiple locations within country / region",
                      "scenarios_code" : "20"
                    },
                    {
                      "scenarios_name" : "Teams across Global locations",
                      "scenarios_code" : "30"
                    },
                    {
                      "scenarios_name" : "Not Applicable",
                      "scenarios_code" : "0"
                    }
                  ]
                },
                {
                  "name" : "Implementation Complexity handled",
                  "code" : "100007",
                  "sort_order" : 7,
                  "questionForCandidate" : "What type of system implementations have you handled?",
                  "questionForRecruiter" : "What is the Implementation complexity involved in the role?",
                  "questionHeaderForCandidate" : "Tell us about your experience in the area of",
                  "questionHeaderForRecruiter" : "What are your expectations about the candidate's experience in the area of",
                  "scenarios" : [
                    {
                      "scenarios_name" : "Single system implementation",
                      "scenarios_code" : "10"
                    },
                    {
                      "scenarios_name" : "Small scale System Integration",
                      "scenarios_code" : "20"
                    },
                    {
                      "scenarios_name" : "Large Scale Integration",
                      "scenarios_code" : "30"
                    },
                    {
                      "scenarios_name" : "Not Applicable",
                      "scenarios_code" : "0"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }*/
  ];
  var csv = json2csv({ data: myCars, fields: fields, fieldNames: fieldNames, unwindPath: ['roles', 'roles.default_complexities','roles.default_complexities.complexities','roles.default_complexities.complexities.scenarios'] });

  fs.writeFile('E://test32.csv', csv, function(err:any) {
    if (err) throw err;
    console.log('file saved');
  });
}
