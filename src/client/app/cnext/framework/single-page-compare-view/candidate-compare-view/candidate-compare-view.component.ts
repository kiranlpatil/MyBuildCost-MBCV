import {Component, OnInit,Input} from "@angular/core";
import {Router} from "@angular/router";
import {NavigationRoutes, LocalStorage} from "../../../../framework/shared/constants";
import {LocalStorageService} from "../../../../framework/shared/localstorage.service";
import {Candidate} from "../../model/candidate";
import {CandidateProfileService} from "../../candidate-profile/candidate-profile.service";
import {CandidateCompareService} from "./candidate-compare-view.service";
import {RecruiterDashboardService} from "../../recruiter-dashboard/recruiter-dashboard.service";


@Component({
  moduleId: module.id,
  selector: 'cn-candidate-compare-view',
  templateUrl: 'candidate-compare-view.component.html',
  styleUrls: ['candidate-compare-view.component.css']
})

export class CandidateCompareViewComponent implements OnInit {
@Input() jobId:string;
  private candidateId:string;
  private recruiterId:string;
  /*private candidate:Candidate = new Candidate();*/
  private recruiter:any;
  private data:any;
  constructor(private _router:Router,private candiadteCompareService:CandidateCompareService,private recruiterDashboardService: RecruiterDashboardService) {
  }

  ngOnInit() {
    /*this.recruiter={
      "_id": "591dbf7c391ea4b93e398db6",
      "company_name": "Persistent System ltd.",
      "company_size": "400-500",
      "userId": "591dbf7c391ea4b93e398db5",
      "about_company": "Our Core Values\nBe a trusted partner for our customers\nWin as a team\nDemonstrate integrity, responsibility and quality in everything you do\nBe Persistent",
      "postedJobs": [
        {
          "postingDate": "2017-05-18T17:06:46.403Z",
          "salary": "6 Lakh",
          "salaryMatch": "above",
          "experience": "14 year",
          "experienceMatch": "below",
          "education": "Graduate",
          "educationMatch": "exact",
          "department": "Healthcare",
          "hiringManager": "Swapnil Khandelwal",
          "jobTitle": "Sr. Software Developer",
          "_id": "591dd4df391ea4b93e39ad7f",
          "industry": {
            "name": "IT",
            "roles": [
              {
                "name": "Project/ Program/ Contracts/ Client Management",
                "_id": "591dd4df391ea4b93e39ad8b",
                "capabilities": [
                  {
                    "isPrimary": true,
                    "name": "Project And Program Delivery",
                    "_id": "591dd4df391ea4b93e39ad90",
                    "complexities": [
                      {
                        "name": "Team Size",
                        "_id": "591dd4df391ea4b93e39ad99",
                        "scenarios": [
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e398442",
                            "code": "1.1.1",
                            "name": "Upto 10"
                          },
                          {
                            "isChecked": true,
                            "_id": "591dbbdf391ea4b93e398441",
                            "code": "1.1.2",
                            "name": "10 - 50"
                          },
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e398440",
                            "code": "1.1.3",
                            "name": "50 - 200"
                          },
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e39843f",
                            "code": "1.1.0",
                            "name": "Not Applicable"
                          }
                        ],
                        "match": "above"
                      },
                      {
                        "name": "Business Criticality",
                        "_id": "591dd4df391ea4b93e39ad98",
                        "scenarios": [
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e39843d",
                            "code": "1.2.1",
                            "name": "Low"
                          },
                          {
                            "isChecked": true,
                            "_id": "591dbbdf391ea4b93e39843c",
                            "code": "1.2.2",
                            "name": "Normal"
                          },
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e39843b",
                            "code": "1.2.3",
                            "name": "Mission Critical / High Visibility"
                          },
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e39843a",
                            "code": "1.2.0",
                            "name": "Not Applicable"
                          }
                        ],
                        "match": "above"
                      },
                      {
                        "name": "Requirements And Scope",
                        "_id": "591dd4df391ea4b93e39ad97",
                        "scenarios": [
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e398438",
                            "code": "1.3.1",
                            "name": "Stable"
                          },
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e398437",
                            "code": "1.3.2",
                            "name": "Changing"
                          },
                          {
                            "isChecked": true,
                            "_id": "591dbbdf391ea4b93e398436",
                            "code": "1.3.3",
                            "name": "Volatile"
                          },
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e398435",
                            "code": "1.3.0",
                            "name": "Not Applicable"
                          }
                        ],
                        "match": "below"
                      },
                      {
                        "name": "Technology",
                        "_id": "591dd4df391ea4b93e39ad96",
                        "scenarios": [
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e398433",
                            "code": "1.4.1",
                            "name": "Legacy / Stable"
                          },
                          {
                            "isChecked": true,
                            "_id": "591dbbdf391ea4b93e398432",
                            "code": "1.4.2",
                            "name": "Emerging / unknown"
                          },
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e398431",
                            "code": "1.4.3",
                            "name": "Mix of Legacy And Emerging"
                          },
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e398430",
                            "code": "1.4.0",
                            "name": "Not Applicable"
                          }
                        ],
                        "match": "exact"
                      },
                      {
                        "name": "Application / Platform Complexity",
                        "_id": "591dd4df391ea4b93e39ad95",
                        "scenarios": [
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e39842e",
                            "code": "1.5.1",
                            "name": "Simple to understand And Implement"
                          },
                          {
                            "isChecked": true,
                            "_id": "591dbbdf391ea4b93e39842d",
                            "code": "1.5.2",
                            "name": "Average as per industry norms"
                          },
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e39842c",
                            "code": "1.5.3",
                            "name": "Complex to understand the functionality, technology And Business Logic"
                          },
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e39842b",
                            "code": "1.5.0",
                            "name": "Not Applicable"
                          }
                        ],
                        "match": "above"
                      },
                      {
                        "name": "3rd Party Vendor involvement",
                        "_id": "591dd4df391ea4b93e39ad94",
                        "scenarios": [
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e398429",
                            "code": "1.6.1",
                            "name": "None"
                          },
                          {
                            "isChecked": true,
                            "_id": "591dbbdf391ea4b93e398428",
                            "code": "1.6.2",
                            "name": "1 - 2 vendors"
                          },
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e398427",
                            "code": "1.6.3",
                            "name": "Multi vendor"
                          },
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e398426",
                            "code": "1.6.0",
                            "name": "Not Applicable"
                          }
                        ],
                        "match": "above"
                      },
                      {
                        "name": "No of projects handled in parallel",
                        "_id": "591dd4df391ea4b93e39ad93",
                        "scenarios": [
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e398424",
                            "code": "1.7.1",
                            "name": "Single"
                          },
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e398423",
                            "code": "1.7.2",
                            "name": "2 - 5"
                          },
                          {
                            "isChecked": true,
                            "_id": "591dbbdf391ea4b93e398422",
                            "code": "1.7.3",
                            "name": "More than 5"
                          },
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e398421",
                            "code": "1.7.0",
                            "name": "Not Applicable"
                          }
                        ],
                        "match": "below"
                      },
                      {
                        "name": "Project Team Location",
                        "_id": "591dd4df391ea4b93e39ad92",
                        "scenarios": [
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e39841f",
                            "code": "1.8.1",
                            "name": "Single / Co-located"
                          },
                          {
                            "isChecked": true,
                            "_id": "591dbbdf391ea4b93e39841e",
                            "code": "1.8.2",
                            "name": "Multi-location within country / region"
                          },
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e39841d",
                            "code": "1.8.3",
                            "name": "Global locations"
                          },
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e39841c",
                            "code": "1.8.0",
                            "name": "Not Applicable"
                          }
                        ],
                        "match": "below"
                      },
                      {
                        "name": "Implementation Complexity handled",
                        "_id": "591dd4df391ea4b93e39ad91",
                        "scenarios": [
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e39841a",
                            "code": "1.9.1",
                            "name": "Single system implementation"
                          },
                          {
                            "isChecked": true,
                            "_id": "591dbbdf391ea4b93e398419",
                            "code": "1.9.2",
                            "name": "Small scale System Integration"
                          },
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e398418",
                            "code": "1.9.3",
                            "name": "Large Scale Integration"
                          },
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e398417",
                            "code": "1.9.0",
                            "name": "Not Applicable"
                          }
                        ],
                        "match": "missing"
                      }
                    ]
                  },
                  {
                    "isPrimary": true,
                    "name": "Client Expectation Management",
                    "_id": "591dd4df391ea4b93e39ad8c",
                    "complexities": [
                      {
                        "name": "Nature of Interactions",
                        "_id": "591dd4df391ea4b93e39ad8f",
                        "scenarios": [
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e398414",
                            "code": "2.1.1",
                            "name": "Amicable"
                          },
                          {
                            "isChecked": true,
                            "_id": "591dbbdf391ea4b93e398413",
                            "code": "2.1.2",
                            "name": "Aggressive"
                          },
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e398412",
                            "code": "2.1.3",
                            "name": "Hostile"
                          },
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e398411",
                            "code": "2.1.0",
                            "name": "Not Applicable"
                          }
                        ],
                        "match": "below"
                      },
                      {
                        "name": "Level of Customer Compliances",
                        "_id": "591dd4df391ea4b93e39ad8e",
                        "scenarios": [
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e39840f",
                            "code": "2.2.1",
                            "name": "Low"
                          },
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e39840e",
                            "code": "2.2.2",
                            "name": "Moderate"
                          },
                          {
                            "isChecked": true,
                            "_id": "591dbbdf391ea4b93e39840d",
                            "code": "2.2.3",
                            "name": "High penalty"
                          },
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e39840c",
                            "code": "2.2.0",
                            "name": "Not Applicable"
                          }
                        ],
                        "match": "above"
                      },
                      {
                        "name": "Level of Client involvement needed",
                        "_id": "591dd4df391ea4b93e39ad8d",
                        "scenarios": [
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e39840a",
                            "code": "2.3.1",
                            "name": "High dependency on client"
                          },
                          {
                            "isChecked": true,
                            "_id": "591dbbdf391ea4b93e398409",
                            "code": "2.3.2",
                            "name": "Moderate dependency on client"
                          },
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e398408",
                            "code": "2.3.3",
                            "name": "Minimal dependency on client"
                          },
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e398407",
                            "code": "2.3.0",
                            "name": "Not Applicable"
                          }
                        ],
                        "match": "missing"
                      }
                    ]
                  }
                ]
              },
              {
                "name": "Programming",
                "_id": "591dd4df391ea4b93e39ad81",
                "capabilities": [
                  {
                    "isPrimary": true,
                    "name": "Code Build And Release",
                    "_id": "591dd4df391ea4b93e39ad88",
                    "complexities": [
                      {
                        "name": "Application / Product Build",
                        "_id": "591dd4df391ea4b93e39ad8a",
                        "scenarios": [
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e3983ee",
                            "code": "4.1.1",
                            "name": "Simple"
                          },
                          {
                            "isChecked": true,
                            "_id": "591dbbdf391ea4b93e3983ed",
                            "code": "4.1.2",
                            "name": "Medium"
                          },
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e3983ec",
                            "code": "4.1.3",
                            "name": "Complex"
                          },
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e3983eb",
                            "code": "4.1.0",
                            "name": "Not Applicable"
                          }
                        ],
                        "match": "missing"
                      },
                      {
                        "name": "Application / Product Deployment",
                        "_id": "591dd4df391ea4b93e39ad89",
                        "scenarios": [
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e3983e9",
                            "code": "4.2.1",
                            "name": "Simple"
                          },
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e3983e8",
                            "code": "4.2.2",
                            "name": "Medium"
                          },
                          {
                            "isChecked": true,
                            "_id": "591dbbdf391ea4b93e3983e7",
                            "code": "4.2.3",
                            "name": "Complex"
                          },
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e3983e6",
                            "code": "4.2.0",
                            "name": "Not Applicable"
                          }
                        ],
                        "match": "above"
                      }
                    ]
                  },
                  {
                    "isPrimary": true,
                    "name": "Coding",
                    "_id": "591dd4df391ea4b93e39ad82",
                    "complexities": [
                      {
                        "name": "Debugging",
                        "_id": "591dd4df391ea4b93e39ad87",
                        "scenarios": [
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e3983d8",
                            "code": "6.1.1",
                            "name": "Simple"
                          },
                          {
                            "isChecked": true,
                            "_id": "591dbbdf391ea4b93e3983d7",
                            "code": "6.1.2",
                            "name": "Medium"
                          },
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e3983d6",
                            "code": "6.1.3",
                            "name": "Complex"
                          },
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e3983d5",
                            "code": "6.1.0",
                            "name": "Not Applicable"
                          }
                        ],
                        "match": "below"
                      },
                      {
                        "name": "Routines / Subroutines",
                        "_id": "591dd4df391ea4b93e39ad86",
                        "scenarios": [
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e3983d3",
                            "code": "6.2.1",
                            "name": "Simple"
                          },
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e3983d2",
                            "code": "6.2.2",
                            "name": "Medium"
                          },
                          {
                            "isChecked": true,
                            "_id": "591dbbdf391ea4b93e3983d1",
                            "code": "6.2.3",
                            "name": "Complex"
                          },
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e3983d0",
                            "code": "6.2.0",
                            "name": "Not Applicable"
                          }
                        ],
                        "match": "below"
                      },
                      {
                        "name": "Error Handling",
                        "_id": "591dd4df391ea4b93e39ad85",
                        "scenarios": [
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e3983ce",
                            "code": "6.3.1",
                            "name": "Simple"
                          },
                          {
                            "isChecked": true,
                            "_id": "591dbbdf391ea4b93e3983cd",
                            "code": "6.3.2",
                            "name": "Medium"
                          },
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e3983cc",
                            "code": "6.3.3",
                            "name": "Complex"
                          },
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e3983cb",
                            "code": "6.3.0",
                            "name": "Not Applicable"
                          }
                        ],
                        "match": "below"
                      },
                      {
                        "name": "Code Performance And Optimization",
                        "_id": "591dd4df391ea4b93e39ad84",
                        "scenarios": [
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e3983c9",
                            "code": "6.4.1",
                            "name": "Simple"
                          },
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e3983c8",
                            "code": "6.4.2",
                            "name": "Medium"
                          },
                          {
                            "isChecked": true,
                            "_id": "591dbbdf391ea4b93e3983c7",
                            "code": "6.4.3",
                            "name": "Complex"
                          },
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e3983c6",
                            "code": "6.4.0",
                            "name": "Not Applicable"
                          }
                        ],
                        "match": "exact"
                      },
                      {
                        "name": "Design Standards",
                        "_id": "591dd4df391ea4b93e39ad83",
                        "scenarios": [
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e3983c4",
                            "code": "6.5.1",
                            "name": "Simple"
                          },
                          {
                            "isChecked": true,
                            "_id": "591dbbdf391ea4b93e3983c3",
                            "code": "6.5.2",
                            "name": "Medium"
                          },
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e3983c2",
                            "code": "6.5.3",
                            "name": "Complex"
                          },
                          {
                            "isChecked": false,
                            "_id": "591dbbdf391ea4b93e3983c1",
                            "code": "6.5.0",
                            "name": "Not Applicable"
                          }
                        ],
                        "match": "exact"
                      }
                    ]
                  }
                ]
              },
              {
                "name": "Tech Lead",
                "_id": "591dd4df391ea4b93e39ad80",
                "capabilities": []
              }
            ]
          },
          "interestedIndustries": [
            "IT",
            "Education"
          ],
          "interestedIndustryMatch": [
            "exact",
            "missing"
          ],
          "additionalProficiencies": [
            "C--",
            "node",
            "df",
            "javascript 3"
          ],
          "proficiencies": [
            "C",
            "C++",
            "java",
            "javascript"
          ],
          "proficienciesMatch": [
            "exact",
            "missing",
            "exact",
            "missing"
          ],
          "location": {
            "country": "India",
            "state": "Maharashtra",
            "city": "Pune"
          }
        }
      ]
    }*/

    this.data={
      "_id": "593959a5060676644500aa1f",
      "userId": "593959a5060676644500aa1e",
      "jobTitle": "Software Engineer",
      "aboutMyself": "Well, I grew up in Cincinnati. As a child, I originally wanted to be a fireman, then later became interested in dinosaurs. I excelled in the sciences from early on, placing first in my fourth-grade science fair. ",
      "lockedOn": "2017-09-06T14:07:40.703Z",
      "job_list": [],
      "proficiencies": [
        "ABC",
        "ABC ALGOL",
        "C",
        "C++",
        "ABSET",
        "ABSYS",
        "Bertrand",
        "BETA",
        "Bistro",
        "BitC",
        "BLISS",
        "C--",
        "Blockly",
        "C#",
        "C/AL",
        "Caché ObjectScript",
        "C Shell",
        "Caml",
        "Cayenne",
        "java",
        "dsdsds",
        "xzcczvv",
        "zcxccvv",
        "xyz",
        "angular"
      ],
      "employmentHistory": [
        {
          "remarks": "Well, I grew up in Cincinnati. As a child, I originally wanted to be a fireman, then later became interested in dinosaurs. I excelled in the sciences from early on, placing first in my fourth-grade science fair. ",
          "designation": "Software Engineer",
          "companyName": "Techprimelab",
          "_id": "59395d92060676644500ab51",
          "to": {
            "year": 1975,
            "month": "February"
          },
          "from": {
            "year": 1970,
            "month": "January"
          }
        }
      ],
      "professionalDetails": {
        "education": "Under Graduate",
        "experience": "1 year",
        "currentSalary": "3 Lac",
        "noticePeriod": "Immediate",
        "relocate": "Yes"
      },
      "academics": [
        {
          "_id": "59395c6d060676644500ab46",
          "schoolName": "Well, I grew up in Cincinnati. As a child, I originally wanted to be a fireman, then later became interested in dinosaurs. I excelled in the sciences from early on, placing first in my fourth-grade science fair. ",
          "board": "Sanskar Vidyalaya",
          "yearOfPassing": 1961,
          "specialization": "SSC"
        },
        {
          "_id": "59395c6d060676644500ab45",
          "schoolName": "Well, I grew up in Cincinnati. As a child, I originally wanted to be a fireman, then later became interested in dinosaurs. I excelled in the sciences from early on, placing first in my fourth-grade science fair. ",
          "board": "Sp College",
          "yearOfPassing": 1958,
          "specialization": "Hsc"
        }
      ],
      "location": {
        "city": "Pune",
        "state": "Maharashtra",
        "country": "India"
      },
      "industry": {
        "name": "IT",
        "roles": [
          {
            "_id": "59395c6d060676644500ab49",
            "name": "Project/ Program/ Contracts/ Client Management",
            "default_complexities": [],
            "capabilities": [
              {
                "_id": "59395c6d060676644500ab4a",
                "name": "Client Expectation Management",
                "isPrimary": true,
                "complexities": [
                  {
                    "_id": "59395c6d060676644500ab4d",
                    "name": "Nature of Interactions",
                    "scenarios": [
                      {
                        "name": "Amicable",
                        "code": "10002.120.10",
                        "_id": "5939596c060676644500a9f9",
                        "isChecked": false
                      },
                      {
                        "name": "Aggressive",
                        "code": "10002.120.20",
                        "_id": "5939596c060676644500a9f8",
                        "isChecked": true
                      },
                      {
                        "name": "Hostile",
                        "code": "10002.120.30",
                        "_id": "5939596c060676644500a9f7",
                        "isChecked": false
                      },
                      {
                        "name": "Not Applicable",
                        "code": "10002.120.0",
                        "_id": "5939596c060676644500a9f6",
                        "isChecked": false
                      }
                    ],
                    "match": "exact"
                  },
                  {
                    "_id": "59395c6d060676644500ab4c",
                    "name": "Level of Client involvement needed",
                    "scenarios": [
                      {
                        "name": "High dependency on client",
                        "code": "10002.130.10",
                        "_id": "5939596c060676644500a9f4",
                        "isChecked": false
                      },
                      {
                        "name": "Moderate dependency on client",
                        "code": "10002.130.20",
                        "_id": "5939596c060676644500a9f3",
                        "isChecked": true
                      },
                      {
                        "name": "Minimal dependency on client",
                        "code": "10002.130.30",
                        "_id": "5939596c060676644500a9f2",
                        "isChecked": false
                      },
                      {
                        "name": "Not Applicable",
                        "code": "10002.130.0",
                        "_id": "5939596c060676644500a9f1",
                        "isChecked": false
                      }
                    ],
                    "match": "missing"
                  },
                  {
                    "_id": "59395c6d060676644500ab4b",
                    "name": "Independence in managing change",
                    "scenarios": [
                      {
                        "name": "Handle moderate changes to the project / program with support of senior management",
                        "code": "10002.140.10",
                        "_id": "5939596c060676644500a9ef",
                        "isChecked": true
                      },
                      {
                        "name": "Independently handle moderate changes to the project / program without any escalations to senior management",
                        "code": "10002.140.20",
                        "_id": "5939596c060676644500a9ee",
                        "isChecked": false
                      },
                      {
                        "name": "Independently handle disruptive changes to the project / program without causing escalations to senior management",
                        "code": "10002.140.30",
                        "_id": "5939596c060676644500a9ed",
                        "isChecked": false
                      },
                      {
                        "name": "Not Applicable",
                        "code": "10002.140.0",
                        "_id": "5939596c060676644500a9ec",
                        "isChecked": false
                      }
                    ],
                    "match": "exact"
                  }
                ]
              }
            ]
          },
          {
            "_id": "59395c6d060676644500ab48",
            "name": "IT Security",
            "default_complexities": [],
            "capabilities": []
          },
          {
            "_id": "59395c6d060676644500ab47",
            "name": "Digital / Social Media Marketing",
            "default_complexities": [],
            "capabilities": []
          }
        ]
      },
      "awards": [
        {
          "_id": "59395c6d060676644500ab4e",
          "remark": "Well, I grew up in Cincinnati. As a child, I originally wanted to be a fireman, then later became interested in dinosaurs. I excelled in the sciences from early on, placing first in my fourth-grade science fair. ",
          "name": "cgr",
          "issuedBy": "hjfdhkhfh",
          "year": 1960
        }
      ],
      "interestedIndustries": [
        "any"
      ],
      "certifications": [
        {
          "_id": "59395c6d060676644500ab50",
          "remark": "Well, I grew up in Cincinnati. As a child, I originally wanted to be a fireman, then later became interested in dinosaurs. I excelled in the sciences from early on, placing first in my fourth-grade science fair. ",
          "name": "JAVA",
          "issuedBy": "SEED",
          "year": 1958
        },
        {
          "_id": "59395c6d060676644500ab4f",
          "remark": "Well, I grew up in Cincinnati. As a child, I originally wanted to be a fireman, then later became interested in dinosaurs. I excelled in the sciences from early on, placing first in my fourth-grade science fair. ",
          "name": "c",
          "issuedBy": "cdac",
          "year": 1957
        }
      ],
      "isVisible": true,
      "isCompleted": true,
      "experienceMatch": "exact",
      "salaryMatch": "above",
      "educationMatch": "exact",
      "releaseMatch": "exact",
      "interestedIndustryMatch": [
        "any"
      ],
      "proficienciesMatch": [
        "ABC",
        "ABC ALGOL",
        "ABSET",
        "ABSYS",
        "Bertrand"
      ]
    }
    /*app.get("/api/candidate/:candidateId/matchresult/:jobId",candidateController.metchResult);


    http://localhost:8080/api/candidate/59352c6edf2fcd693c7c82f4/matchresult/59353128df2fcd693c7c8391*/


  }

  ngOnChanges(changes:any){
    if (changes.jobId !=undefined && changes.jobId.currentValue != undefined  ) {
      this.jobId=changes.jobId.currentValue;
      this.candidateId = LocalStorageService.getLocalValue(LocalStorage.END_USER_ID);
      /*this.recruiterId = LocalStorageService.getLocalValue(LocalStorage.CURRENT_JOB_POSTED_ID);*/
      this.recruiterId=this.jobId;
      this.getCompareDetail(this.candidateId,this.recruiterId);
      this.recruiterDashboardService.getPostedJobDetails(this.jobId)
        .subscribe(
          data => {
            this.OnRecruiterDataSuccess(data.data.industry)
          });
    }
  }


  OnRecruiterDataSuccess(data: any) {
    this.recruiter = data;
  }
  
  getCompareDetail(candidateId:string,recruiterId:string) {
    this.candiadteCompareService.getCompareDetail(candidateId,recruiterId)
      .subscribe(
        data => this.OnCompareSuccess(data),
        error => console.log(error));
  }

  OnCompareSuccess(data:any) {debugger
    console.log('data after compare  ',data)
    this.data=data.data;
  }




}
