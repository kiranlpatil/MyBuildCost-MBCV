import {Component, OnInit} from "@angular/core";
import Capabilities = protractor.Capabilities;

@Component({
  moduleId: module.id,
  selector: 'cn-candidate-capability-portrait',
  templateUrl: 'candidate-capability-portrait.component.html',
  styleUrls: ['candidate-capability-portrait.component.css'],
})

export class CandidateCapabilityPortrait implements OnInit {

  private candidate: any;
  private capabilities: Capabilities[] = new Array(0);

  ngOnInit(): void {
    this.candidate = {
      "jobTitle": "Sr. Software Engineer",
      "isVisible": true,
      "location": {
        "city": "Pune",
        "state": "Maharashtra",
        "country": "India"
      },
      "isSubmitted": true,
      "aboutMyself": "Working is passion",
      "certifications": [
        {
          "remark": "",
          "name": "Software Testing",
          "issuedBy": "Master Minds Academy",
          "year": 2013
        }
      ],
      "awards": [],
      "industry": {
        "name": "IT",
        "code": "2",
        "roles": [
          {
            "code": "10001",
            "name": "Project/ Program/ Contracts/ Client Management",
            "_id": "59770cf87dd3dc312799b8e5",
            "default_complexities": [],
            "capabilities": []
          },
          {
            "code": "10028",
            "name": "UI / UX",
            "_id": "59770cf87dd3dc312799b8e4",
            "default_complexities": [
              {
                "code": "10001",
                "name": "Project/ Program/ Contracts/ Client Management  (Common Complexities)",
                "_id": "5966102c137b03c8796c2d9b",
                "complexities": [
                  {
                    "code": "110",
                    "name": "Team Size",
                    "_id": "5966102c137b03c8796c2dba",
                    "questionForCandidate": "",
                    "answer": ""
                  },
                  {
                    "code": "120",
                    "name": "Requirements and Scope",
                    "_id": "5966102c137b03c8796c2db5",
                    "questionForCandidate": "",
                    "answer": ""
                  },
                  {
                    "code": "130",
                    "name": "Technology",
                    "_id": "5966102c137b03c8796c2db0",
                    "questionForCandidate": "",
                    "answer": ""
                  }
                ]
              }
            ],
            "capabilities": [
              {
                "isPrimary": true,
                "code": "10032",
                "name": "UI Development",
                "_id": "5966102c137b03c8796c2bd7",
                "complexities": [
                  {
                    "code": "110",
                    "name": "Team Size",
                    "_id": "5966102c137b03c8796c2dba",
                    "questionForCandidate": "",
                    "answer": ""
                  },
                  {
                    "code": "120",
                    "name": "Requirements and Scope",
                    "_id": "5966102c137b03c8796c2db5",
                    "questionForCandidate": "",
                    "answer": ""
                  },
                  {
                    "code": "130",
                    "name": "Technology",
                    "_id": "5966102c137b03c8796c2db0",
                    "questionForCandidate": "",
                    "answer": ""
                  }
                ]
              },
              {
                "isPrimary": true,
                "code": "10033",
                "name": "UX Consulting",
                "_id": "5966102c137b03c8796c2bc7",
                "complexities": [
                  {
                    "code": "110",
                    "name": "Team Size",
                    "_id": "5966102c137b03c8796c2dba",
                    "questionForCandidate": "",
                    "answer": ""
                  },
                  {
                    "code": "120",
                    "name": "Requirements and Scope",
                    "_id": "5966102c137b03c8796c2db5",
                    "questionForCandidate": "",
                    "answer": ""
                  },
                  {
                    "code": "130",
                    "name": "Technology",
                    "_id": "5966102c137b03c8796c2db0",
                    "questionForCandidate": "",
                    "answer": ""
                  }
                ]
              }, {
                "isPrimary": true,
                "code": "10032",
                "name": "UI Development",
                "_id": "5966102c137b03c8796c2bd7",
                "complexities": [
                  {
                    "code": "110",
                    "name": "Team Size",
                    "_id": "5966102c137b03c8796c2dba",
                    "questionForCandidate": "",
                    "answer": ""
                  },
                  {
                    "code": "120",
                    "name": "Requirements and Scope",
                    "_id": "5966102c137b03c8796c2db5",
                    "questionForCandidate": "",
                    "answer": ""
                  },
                  {
                    "code": "130",
                    "name": "Technology",
                    "_id": "5966102c137b03c8796c2db0",
                    "questionForCandidate": "",
                    "answer": ""
                  }
                ]
              },
              {
                "isPrimary": true,
                "code": "10033",
                "name": "UX Consulting1",
                "_id": "5966102c137b03c8796c2bc7",
                "complexities": [
                  {
                    "code": "110",
                    "name": "Team Size",
                    "_id": "5966102c137b03c8796c2dba",
                    "questionForCandidate": "",
                    "answer": ""
                  },
                  {
                    "code": "120",
                    "name": "Requirements and Scope",
                    "_id": "5966102c137b03c8796c2db5",
                    "questionForCandidate": "",
                    "answer": ""
                  },
                  {
                    "code": "130",
                    "name": "Technology",
                    "_id": "5966102c137b03c8796c2db0",
                    "questionForCandidate": "",
                    "answer": ""
                  }
                ]
              }, {
                "isPrimary": true,
                "code": "10032",
                "name": "UI Development1",
                "_id": "5966102c137b03c8796c2bd7",
                "complexities": [
                  {
                    "code": "110",
                    "name": "Team Size",
                    "_id": "5966102c137b03c8796c2dba",
                    "questionForCandidate": "",
                    "answer": ""
                  },
                  {
                    "code": "120",
                    "name": "Requirements and Scope",
                    "_id": "5966102c137b03c8796c2db5",
                    "questionForCandidate": "",
                    "answer": ""
                  },
                  {
                    "code": "130",
                    "name": "Technology",
                    "_id": "5966102c137b03c8796c2db0",
                    "questionForCandidate": "",
                    "answer": ""
                  }
                ]
              },
              {
                "isPrimary": true,
                "code": "10033",
                "name": "UX Consulting2",
                "_id": "5966102c137b03c8796c2bc7",
                "complexities": [
                  {
                    "code": "110",
                    "name": "Team Size",
                    "_id": "5966102c137b03c8796c2dba",
                    "questionForCandidate": "",
                    "answer": ""
                  },
                  {
                    "code": "120",
                    "name": "Requirements and Scope",
                    "_id": "5966102c137b03c8796c2db5",
                    "questionForCandidate": "",
                    "answer": ""
                  },
                  {
                    "code": "130",
                    "name": "Technology",
                    "_id": "5966102c137b03c8796c2db0",
                    "questionForCandidate": "",
                    "answer": ""
                  }
                ]
              }
            ]
          },
          {
            "code": "90002",
            "name": "IT Support",
            "_id": "59770cf87dd3dc312799b8e3",
            "default_complexities": [],
            "capabilities": []
          }
        ]
      },
      "interestedIndustries": [
        "None"
      ],
      "academics": [
        {
          "schoolName": "",
          "board": "Pune University",
          "yearOfPassing": 2014,
          "specialization": "Master of Computer Science"
        }
      ],
      "professionalDetails": {
        "education": "Graduate",
        "experience": "3 Year",
        "currentSalary": "3 Lacs",
        "noticePeriod": "1-2 Months",
        "relocate": "Yes",
        "industryExposure": "MNC / Global",
        "currentCompany": "TCS"
      },
      "employmentHistory": [
        {
          "companyName": "TPL",
          "designation": "Software Engineer",
          "remarks": "",
          "to": {
            "month": "March",
            "year": 2015
          },
          "from": {
            "month": "January",
            "year": 2014
          }
        }
      ],
      "proficiencies": [
        "JavaScript",
        "Angularjs",
        "Angular 2",
        "Angular 4"
      ],
      "lockedOn": "2017-10-22T10:09:08.371Z",
      "isCompleted": true,
      "basicInformation": {
        "first_name": "rahul",
        "last_name": "rahul",
        "mobile_number": 6564654656,
        "email": "rahul@gmail.com",
        "password": "Admin@123",
        "current_theme": "container-fluid light-theme",
        "isCandidate": true,
        "notifications": [],
        "otp": 186845,
        "isActivated": true,
        "temp_mobile": 0,
        "picture": "/assets/framework/images/dashboard/default-profile.png"
      }
    };
    for (let role of this.candidate.industry.roles) {
      for (let capability of role.capabilities) {
        this.capabilities.push(capability);
      }
    }
  }


}
