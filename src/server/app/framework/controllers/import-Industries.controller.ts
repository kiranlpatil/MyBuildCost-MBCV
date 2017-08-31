/**
 * Created by techprime002 on 7/11/2017.
 */
import * as express from 'express';
import fs = require('fs');
import AuthInterceptor = require('../interceptor/auth.interceptor');
import Messages = require('../shared/messages');
import ImportIndustryService = require('../services/import-industries.service');
let importIndustriesService = new ImportIndustryService();

//http://localhost:8080/api/readxlsx

export function readXlsx(req: express.Request, res: express.Response) {
  var filepath = './src/server/app/framework/public/config/NewIndustryDataExcel.xlsx';
  importIndustriesService.readXlsx(filepath, (error, result) => {
    if (error) {
      console.log('crt role error', error);
      res.send({
        'error': error.message
      });
    } else {
      importIndustriesService.create(result, (error, result) => {
        if (error) {
          console.log('crt role error', error);
          res.send({
            'error': error.message
          });
      } else {
          var auth:AuthInterceptor = new AuthInterceptor();
          var token = auth.issueTokenWithUid(result);
          res.status(200).send({
            'status': Messages.STATUS_SUCCESS,
            'data': {
              'reason': 'Data inserted Successfully in Industry',
              'code': 200,
              'result': result,
            },
            access_token: token
          });
      }
      });
    }
  });
}

export function writeXlsx() {
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
    {
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
    }
  ];
  var csv = json2csv({ data: myCars, fields: fields, fieldNames: fieldNames, unwindPath: ['roles', 'roles.default_complexities','roles.default_complexities.complexities','roles.default_complexities.complexities.scenarios'] });

  fs.writeFile('E://test32.csv', csv, function(err:any) {
    if (err) throw err;
    console.log('file saved');
  });
}
