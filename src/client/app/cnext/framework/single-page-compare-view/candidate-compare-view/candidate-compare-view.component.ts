import {Component, Input, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {AppSettings, LocalStorage} from "../../../../framework/shared/constants";
import {LocalStorageService} from "../../../../framework/shared/localstorage.service";
import {CandidateCompareService} from "./candidate-compare-view.service";
import {RecruiterDashboardService} from "../../recruiter-dashboard/recruiter-dashboard.service";


@Component({
  moduleId: module.id,
  selector: 'cn-candidate-compare-view',
  templateUrl: 'candidate-compare-view.component.html',
  styleUrls: ['candidate-compare-view.component.css']
})

export class CandidateCompareViewComponent implements OnInit {
  @Input() jobId: string;
  private candidateId: string;
  private recruiterId: string;
  /*private candidate:Candidate = new Candidate();*/
  private recruiter: any;
  private data: any;

  constructor(private _router: Router, private candidateCompareService: CandidateCompareService, private recruiterDashboardService: RecruiterDashboardService) {
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

    /* this.data={
     "_id": "59352c6edf2fcd693c7c82f4",
     "userId": "59352c6ddf2fcd693c7c82f3",
     "jobTitle": "Software Engineer",
     "aboutMyself": "xyz",
     "lockedOn": "2017-09-06T02:10:12.496Z",
     "job_list": [],
     "proficiencies": [
     "ABC",
     "C",
     "javascript",
     "java",
     "angular 2",
     "ABC ALGOL"
     ],
     "employmentHistory": [],
     "professionalDetails": {
     "education": "Graduate",
     "experience": "4 year",
     "currentSalary": "7 Lakh",
     "noticePeriod": "Immediate",
     "relocate": "Yes"
     },
     "academics": [],
     "location": {
     "city": "West Palm Beach",
     "state": "Florida",
     "country": "United States"
     },
     "industry": {
     "name": "IT",
     "roles": [
     {
     "name": "Project/ Program/ Contracts/ Client Management",
     "_id": "5938b5c4c2be7e6a1537dce7",
     "default_complexities": [],
     "capabilities": [
     {
     "isPrimary": true,
     "name": "Client Expectation Management",
     "_id": "5938b5c4c2be7e6a1537dcfa",
     "complexities": [
     {
     "name": "Nature of Interactions",
     "_id": "5938b5c4c2be7e6a1537dcfd",
     "scenarios": [
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c82f2",
     "name": "Amicable",
     "code": "10002.120.10"
     },
     {
     "isChecked": true,
     "_id": "59352b61df2fcd693c7c82f1",
     "name": "Aggressive",
     "code": "10002.120.20"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c82f0",
     "name": "Hostile",
     "code": "10002.120.30"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c82ef",
     "name": "Not Applicable",
     "code": "10002.120.0"
     }
     ],
     "match": "exact"
     },
     {
     "name": "Level of Client involvement needed",
     "_id": "5938b5c4c2be7e6a1537dcfc",
     "scenarios": [
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c82ed",
     "name": "High dependency on client",
     "code": "10002.130.10"
     },
     {
     "isChecked": true,
     "_id": "59352b61df2fcd693c7c82ec",
     "name": "Moderate dependency on client",
     "code": "10002.130.20"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c82eb",
     "name": "Minimal dependency on client",
     "code": "10002.130.30"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c82ea",
     "name": "Not Applicable",
     "code": "10002.130.0"
     }
     ],
     "match": "exact"
     },
     {
     "name": "Independence in managing change",
     "_id": "5938b5c4c2be7e6a1537dcfb",
     "scenarios": [
     {
     "isChecked": true,
     "_id": "59352b61df2fcd693c7c82e8",
     "name": "Handle moderate changes to the project / program with support of senior management",
     "code": "10002.140.10"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c82e7",
     "name": "Independently handle moderate changes to the project / program without any escalations to senior management",
     "code": "10002.140.20"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c82e6",
     "name": "Independently handle disruptive changes to the project / program without causing escalations to senior management",
     "code": "10002.140.30"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c82e5",
     "name": "Not Applicable",
     "code": "10002.140.0"
     }
     ],
     "match": "above"
     }
     ]
     },
     {
     "isPrimary": true,
     "name": "People Management",
     "_id": "5938b5c4c2be7e6a1537dcf5",
     "complexities": [
     {
     "name": "Project Skill Availability",
     "_id": "5938b5c4c2be7e6a1537dcf9",
     "scenarios": [
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c82e2",
     "name": "All skills are adequately available",
     "code": "10003.120.10"
     },
     {
     "isChecked": true,
     "_id": "59352b61df2fcd693c7c82e1",
     "name": "Manage with some skill gaps",
     "code": "10003.120.20"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c82e0",
     "name": "Manage with large skill gaps",
     "code": "10003.120.30"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c82df",
     "name": "Not Applicable",
     "code": "10003.120.0"
     }
     ],
     "match": "exact"
     },
     {
     "name": "Degree of Resource Churn handled",
     "_id": "5938b5c4c2be7e6a1537dcf8",
     "scenarios": [
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c82dd",
     "name": "Reasonable",
     "code": "10003.130.10"
     },
     {
     "isChecked": true,
     "_id": "59352b61df2fcd693c7c82dc",
     "name": "Frequent",
     "code": "10003.130.20"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c82db",
     "name": "Disruptive",
     "code": "10003.130.30"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c82da",
     "name": "Not Applicable",
     "code": "10003.130.0"
     }
     ],
     "match": "exact"
     },
     {
     "name": "Team diversity handled (culture, age, behaviours)",
     "_id": "5938b5c4c2be7e6a1537dcf7",
     "scenarios": [
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c82d8",
     "name": "Homogeneous Team composition",
     "code": "10003.140.10"
     },
     {
     "isChecked": true,
     "_id": "59352b61df2fcd693c7c82d7",
     "name": "Mixed Team composition",
     "code": "10003.140.20"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c82d6",
     "name": "Highly Diverse Team composition",
     "code": "10003.140.30"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c82d5",
     "name": "Not Applicable",
     "code": "10003.140.0"
     }
     ],
     "match": "exact"
     },
     {
     "name": "Work Environment handled",
     "_id": "5938b5c4c2be7e6a1537dcf6",
     "scenarios": [
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c82d3",
     "name": "Comfortable",
     "code": "10003.150.10"
     },
     {
     "isChecked": true,
     "_id": "59352b61df2fcd693c7c82d2",
     "name": "Extra Efforts",
     "code": "10003.150.20"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c82d1",
     "name": "Highly demanding",
     "code": "10003.150.30"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c82d0",
     "name": "Not Applicable",
     "code": "10003.150.0"
     }
     ],
     "match": "exact"
     }
     ]
     },
     {
     "isPrimary": true,
     "name": "Project Transitions",
     "_id": "5938b5c4c2be7e6a1537dcf2",
     "complexities": [
     {
     "name": "Max no of projects transitioned in parallel",
     "_id": "5938b5c4c2be7e6a1537dcf4",
     "scenarios": [
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c82cd",
     "name": "Single",
     "code": "10004.120.10"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c82cc",
     "name": "2 - 5",
     "code": "10004.120.20"
     },
     {
     "isChecked": true,
     "_id": "59352b61df2fcd693c7c82cb",
     "name": "More than 5",
     "code": "10004.120.30"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c82ca",
     "name": "Not Applicable",
     "code": "10004.120.0"
     }
     ],
     "match": "exact"
     },
     {
     "name": "Nature of Transition Received",
     "_id": "5938b5c4c2be7e6a1537dcf3",
     "scenarios": [
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c82c8",
     "name": "Single team - colocated",
     "code": "10004.130.10"
     },
     {
     "isChecked": true,
     "_id": "59352b61df2fcd693c7c82c7",
     "name": "Single team - different location",
     "code": "10004.130.20"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c82c6",
     "name": "Multiple teams - colocated",
     "code": "10004.130.30"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c82c5",
     "name": "Not Applicable",
     "code": "10004.130.0"
     }
     ],
     "match": "exact"
     }
     ]
     },
     {
     "isPrimary": true,
     "name": "Project Profitability",
     "_id": "5938b5c4c2be7e6a1537dcef",
     "complexities": [
     {
     "name": "Increase margins by deploying higher roles & services",
     "_id": "5938b5c4c2be7e6a1537dcf1",
     "scenarios": [
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c82bc",
     "name": "Upto 5% increase in margin",
     "code": "10006.120.10"
     },
     {
     "isChecked": true,
     "_id": "59352b61df2fcd693c7c82bb",
     "name": "5 to 10% increase in margin",
     "code": "10006.120.20"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c82ba",
     "name": "Above 10% increase in margins",
     "code": "10006.120.30"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c82b9",
     "name": "Not Applicable",
     "code": "10006.120.0"
     }
     ],
     "match": "missing"
     },
     {
     "name": "Increase profitability through Vendor Negotiations",
     "_id": "5938b5c4c2be7e6a1537dcf0",
     "scenarios": [
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c82b7",
     "name": "Upto 5% reduction in cost",
     "code": "10006.130.10"
     },
     {
     "isChecked": true,
     "_id": "59352b61df2fcd693c7c82b6",
     "name": "5 to 10% reduction in cost",
     "code": "10006.130.20"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c82b5",
     "name": "Above 10% reduction in costs",
     "code": "10006.130.30"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c82b4",
     "name": "Not Applicable",
     "code": "10006.130.0"
     }
     ],
     "match": "missing"
     }
     ]
     },
     {
     "isPrimary": true,
     "name": "Onsite Coordination",
     "_id": "5938b5c4c2be7e6a1537dcea",
     "complexities": [
     {
     "name": "Nature of Interactions",
     "_id": "5938b5c4c2be7e6a1537dcee",
     "scenarios": [
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c82b1",
     "name": "Amicable",
     "code": "10007.120.10"
     },
     {
     "isChecked": true,
     "_id": "59352b61df2fcd693c7c82b0",
     "name": "Aggressive",
     "code": "10007.120.20"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c82af",
     "name": "Hostile",
     "code": "10007.120.30"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c82ae",
     "name": "Not Applicable",
     "code": "10007.120.0"
     }
     ],
     "match": "missing"
     },
     {
     "name": "Level of Technical Involvement",
     "_id": "5938b5c4c2be7e6a1537dced",
     "scenarios": [
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c82ac",
     "name": "Minimal",
     "code": "10007.130.10"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c82ab",
     "name": "Moderate",
     "code": "10007.130.20"
     },
     {
     "isChecked": true,
     "_id": "59352b61df2fcd693c7c82aa",
     "name": "Hands-On",
     "code": "10007.130.30"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c82a9",
     "name": "Not Applicable",
     "code": "10007.130.0"
     }
     ],
     "match": "missing"
     },
     {
     "name": "Involvement in Requirement Gathering & Design",
     "_id": "5938b5c4c2be7e6a1537dcec",
     "scenarios": [
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c82a7",
     "name": "Module Level",
     "code": "10007.140.10"
     },
     {
     "isChecked": true,
     "_id": "59352b61df2fcd693c7c82a6",
     "name": "System Level",
     "code": "10007.140.20"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c82a5",
     "name": "Solution Level",
     "code": "10007.140.30"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c82a4",
     "name": "Not Applicable",
     "code": "10007.140.0"
     }
     ],
     "match": "missing"
     },
     {
     "name": "Involvement in UAT Support & Deployment",
     "_id": "5938b5c4c2be7e6a1537dceb",
     "scenarios": [
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c82a2",
     "name": "Coordination only",
     "code": "10007.150.10"
     },
     {
     "isChecked": true,
     "_id": "59352b61df2fcd693c7c82a1",
     "name": "Participates in UAT / deployment with limited ownership",
     "code": "10007.150.20"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c82a0",
     "name": "Independently Responsble for UAT / deployment",
     "code": "10007.150.30"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c829f",
     "name": "Not Applicable",
     "code": "10007.150.0"
     }
     ],
     "match": "missing"
     }
     ]
     },
     {
     "isPrimary": true,
     "name": "Client Contract Management",
     "_id": "5938b5c4c2be7e6a1537dce8",
     "complexities": [
     {
     "name": "Exposure to Contract compliances",
     "_id": "5938b5c4c2be7e6a1537dce9",
     "scenarios": [
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c827c",
     "name": "No involvement in contract compliances & audits",
     "code": "10010.120.10"
     },
     {
     "isChecked": true,
     "_id": "59352b61df2fcd693c7c827b",
     "name": "Handle document complaince audits",
     "code": "10010.120.20"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c827a",
     "name": "Handle complex and detailed compliance audits",
     "code": "10010.120.30"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c8279",
     "name": "Not Applicable",
     "code": "10010.120.0"
     }
     ],
     "match": "exact"
     }
     ]
     },
     {
     "isPrimary": true,
     "name": "Vendor Contract Management",
     "_id": "5938b2b9f115cb1b1387bdc0",
     "complexities": [
     {
     "name": "Enforcement of contract non-compliances",
     "_id": "5938b2b9f115cb1b1387bdc1",
     "scenarios": [
     {
     "isChecked": true,
     "_id": "59352b61df2fcd693c7c8276",
     "name": "Handing over to Legal team for enforcement of contract voilations",
     "code": "10011.120.10"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c8275",
     "name": "Independent handling of contract non-compliances with minimal involvement of Legal team",
     "code": "10011.120.20"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c8274",
     "name": "",
     "code": "10011.120.30"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c8273",
     "name": "Not Applicable",
     "code": "10011.120.0"
     }
     ],
     "match": "missing"
     }
     ]
     }
     ]
     },
     {
     "name": "IT Security",
     "_id": "5938b5c4c2be7e6a1537dce4",
     "default_complexities": [],
     "capabilities": [
     {
     "isPrimary": true,
     "name": "Proactive Vigilance",
     "_id": "5938b5c4c2be7e6a1537dce5",
     "complexities": [
     {
     "name": "Degree of Ownership",
     "_id": "5938b5c4c2be7e6a1537dce6",
     "scenarios": [
     {
     "isChecked": true,
     "_id": "59352b61df2fcd693c7c822b",
     "name": "Collation of upcoming security threats and coordinate for fixes",
     "code": "10016.110.10"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c822a",
     "name": "Provide solutions for fixes for potential threats",
     "code": "10016.110.20"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c8229",
     "name": "Architectural & Design decisions for migration to more secure systems / envronments",
     "code": "10016.110.30"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c8228",
     "name": "Not Applicable",
     "code": "10016.110.0"
     }
     ],
     "match": "missing"
     }
     ]
     }
     ]
     },
     {
     "name": "UI / UX",
     "_id": "5938b5c4c2be7e6a1537dcdd",
     "default_complexities": [],
     "capabilities": [
     {
     "isPrimary": true,
     "name": "UI Design",
     "_id": "5938b5c4c2be7e6a1537dcde",
     "complexities": [
     {
     "name": "Level of constraints imposed by Wireframe designer",
     "_id": "5938b5c4c2be7e6a1537dce3",
     "scenarios": [
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c8159",
     "name": "Free hand to design the UI",
     "code": "10031.120.10"
     },
     {
     "isChecked": true,
     "_id": "59352b61df2fcd693c7c8158",
     "name": "Design the UI within constraints and limitations posed by the Wireframe designer",
     "code": "10031.120.20"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c8157",
     "name": "",
     "code": "10031.120.30"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c8156",
     "name": "Not Applicable",
     "code": "10031.120.0"
     }
     ],
     "match": "missing"
     },
     {
     "name": "Tool Expertise",
     "_id": "5938b5c4c2be7e6a1537dce2",
     "scenarios": [
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c8154",
     "name": "Work with some guidance",
     "code": "10031.130.10"
     },
     {
     "isChecked": true,
     "_id": "59352b61df2fcd693c7c8153",
     "name": "Independent work with reasonable speed",
     "code": "10031.130.20"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c8152",
     "name": "High expertise, high speed of work",
     "code": "10031.130.30"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c8151",
     "name": "Not Applicable",
     "code": "10031.130.0"
     }
     ],
     "match": "missing"
     },
     {
     "name": "No of UI Design tools / products handled",
     "_id": "5938b5c4c2be7e6a1537dce1",
     "scenarios": [
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c814f",
     "name": "None",
     "code": "10031.140.10"
     },
     {
     "isChecked": true,
     "_id": "59352b61df2fcd693c7c814e",
     "name": "Single Tool",
     "code": "10031.140.20"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c814d",
     "name": "Multiple Tools",
     "code": "10031.140.30"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c814c",
     "name": "Not Applicable",
     "code": "10031.140.0"
     }
     ],
     "match": "missing"
     },
     {
     "name": "Type of devices in a single wireframe",
     "_id": "5938b5c4c2be7e6a1537dce0",
     "scenarios": [
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c814a",
     "name": "Desktop",
     "code": "10031.150.10"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c8149",
     "name": "Handheld",
     "code": "10031.150.20"
     },
     {
     "isChecked": true,
     "_id": "59352b61df2fcd693c7c8148",
     "name": "Desktop + Handheld",
     "code": "10031.150.30"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c8147",
     "name": "Not Applicable",
     "code": "10031.150.0"
     }
     ],
     "match": "missing"
     },
     {
     "name": "Logo Design",
     "_id": "5938b5c4c2be7e6a1537dcdf",
     "scenarios": [
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c8145",
     "name": "Build around Visual Impact",
     "code": "10031.160.10"
     },
     {
     "isChecked": true,
     "_id": "59352b61df2fcd693c7c8144",
     "name": "Build around Business Concept",
     "code": "10031.160.20"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c8143",
     "name": "Build around Emotions",
     "code": "10031.160.30"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c8142",
     "name": "Not Applicable",
     "code": "10031.160.0"
     }
     ],
     "match": "missing"
     }
     ]
     }
     ]
     },
     {
     "name": "Testing",
     "_id": "5938b2b9f115cb1b1387bdad",
     "default_complexities": [],
     "capabilities": [
     {
     "isPrimary": true,
     "name": "Functional Testing",
     "_id": "5938b2b9f115cb1b1387bdba",
     "complexities": [
     {
     "name": "Test Recording & Report",
     "_id": "5938b2b9f115cb1b1387bdbd",
     "scenarios": [
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c8104",
     "name": "Manual",
     "code": "10035.120.10"
     },
     {
     "isChecked": true,
     "_id": "59352b61df2fcd693c7c8103",
     "name": "Using given test recording tool",
     "code": "10035.120.20"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c8102",
     "name": "Setup and configure the test recording tool",
     "code": "10035.120.30"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c8101",
     "name": "Not Applicable",
     "code": "10035.120.0"
     }
     ],
     "match": "extra"
     },
     {
     "name": "Phase of Testing involved",
     "_id": "5938b2b9f115cb1b1387bdbc",
     "scenarios": [
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c80ff",
     "name": "SIT (System & Integration Testing)",
     "code": "10035.130.10"
     },
     {
     "isChecked": true,
     "_id": "59352b61df2fcd693c7c80fe",
     "name": "UAT (User Acceptance Testing)",
     "code": "10035.130.20"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c80fd",
     "name": "Pre-Production",
     "code": "10035.130.30"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c80fc",
     "name": "Not Applicable",
     "code": "10035.130.0"
     }
     ],
     "match": "extra"
     },
     {
     "name": "Test Data Setup",
     "_id": "5938b2b9f115cb1b1387bdbb",
     "scenarios": [
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c80fa",
     "name": "Use Readymade test data",
     "code": "10035.140.10"
     },
     {
     "isChecked": true,
     "_id": "59352b61df2fcd693c7c80f9",
     "name": "Use the application or database procedures to create test data",
     "code": "10035.140.20"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c80f8",
     "name": "Masking of Production data (Data obfuscation)",
     "code": "10035.140.30"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c80f7",
     "name": "Not Applicable",
     "code": "10035.140.0"
     }
     ],
     "match": "extra"
     }
     ]
     },
     {
     "isPrimary": true,
     "name": "Test Case Design",
     "_id": "5938b2b9f115cb1b1387bdb4",
     "complexities": [
     {
     "name": "Regression",
     "_id": "5938b2b9f115cb1b1387bdb9",
     "scenarios": [
     {
     "isChecked": true,
     "_id": "59352b61df2fcd693c7c80f4",
     "name": "Identify scenarios for regression testing based on impact of a given requirement",
     "code": "10036.120.10"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c80f3",
     "name": "Review the Regression test pack with Business users and get signoff for the same",
     "code": "10036.120.20"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c80f2",
     "name": "",
     "code": "10036.120.30"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c80f1",
     "name": "Not Applicable",
     "code": "10036.120.0"
     }
     ],
     "match": "extra"
     },
     {
     "name": "Scenario complexity",
     "_id": "5938b2b9f115cb1b1387bdb8",
     "scenarios": [
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c80ef",
     "name": "Involves test cases with upto 25 steps",
     "code": "10036.130.10"
     },
     {
     "isChecked": true,
     "_id": "59352b61df2fcd693c7c80ee",
     "name": "Involves test cases with steps between 25 to 50",
     "code": "10036.130.20"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c80ed",
     "name": "Involves test cases with more than 50 steps",
     "code": "10036.130.30"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c80ec",
     "name": "Not Applicable",
     "code": "10036.130.0"
     }
     ],
     "match": "extra"
     },
     {
     "name": "Application Interfaces",
     "_id": "5938b2b9f115cb1b1387bdb7",
     "scenarios": [
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c80ea",
     "name": "Single system, no external interfaces",
     "code": "10036.140.10"
     },
     {
     "isChecked": true,
     "_id": "59352b61df2fcd693c7c80e9",
     "name": "Testing across two systems",
     "code": "10036.140.20"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c80e8",
     "name": "Testing across interfaces with multiple systems",
     "code": "10036.140.30"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c80e7",
     "name": "Not Applicable",
     "code": "10036.140.0"
     }
     ],
     "match": "extra"
     },
     {
     "name": "Review Participation",
     "_id": "5938b2b9f115cb1b1387bdb6",
     "scenarios": [
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c80e5",
     "name": "Participation in reviews conducted within Testing team",
     "code": "10036.150.10"
     },
     {
     "isChecked": true,
     "_id": "59352b61df2fcd693c7c80e4",
     "name": "Participate in review forums where requirements are being framed by Business owners",
     "code": "10036.150.20"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c80e3",
     "name": "",
     "code": "10036.150.30"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c80e2",
     "name": "Not Applicable",
     "code": "10036.150.0"
     }
     ],
     "match": "extra"
     },
     {
     "name": "Participation in Shift Left Testing",
     "_id": "5938b2b9f115cb1b1387bdb5",
     "scenarios": [
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c80e0",
     "name": "Traditional Shift Left Testing",
     "code": "10036.160.10"
     },
     {
     "isChecked": true,
     "_id": "59352b61df2fcd693c7c80df",
     "name": "Agile / DevOps Shift Left testing",
     "code": "10036.160.20"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c80de",
     "name": "",
     "code": "10036.160.30"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c80dd",
     "name": "Not Applicable",
     "code": "10036.160.0"
     }
     ],
     "match": "extra"
     }
     ]
     },
     {
     "isPrimary": true,
     "name": "Test Project Management",
     "_id": "5938b2b9f115cb1b1387bdae",
     "complexities": [
     {
     "name": "Estimation of Testing Efforts",
     "_id": "5938b2b9f115cb1b1387bdb3",
     "scenarios": [
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c80c5",
     "name": "Stable Requirements & Scope",
     "code": "10038.120.10"
     },
     {
     "isChecked": true,
     "_id": "59352b61df2fcd693c7c80c4",
     "name": "Changing Requirements & Scope",
     "code": "10038.120.20"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c80c3",
     "name": "Volatile Requirements & Scope",
     "code": "10038.120.30"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c80c2",
     "name": "Not Applicable",
     "code": "10038.120.0"
     }
     ],
     "match": "extra"
     },
     {
     "name": "Technology",
     "_id": "5938b2b9f115cb1b1387bdb2",
     "scenarios": [
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c80c0",
     "name": "Legacy / Stable",
     "code": "10038.130.10"
     },
     {
     "isChecked": true,
     "_id": "59352b61df2fcd693c7c80bf",
     "name": "Emerging Technologies",
     "code": "10038.130.20"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c80be",
     "name": "Mix of Legacy & Emerging",
     "code": "10038.130.30"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c80bd",
     "name": "Not Applicable",
     "code": "10038.130.0"
     }
     ],
     "match": "extra"
     },
     {
     "name": "Application / Platform Complexity",
     "_id": "5938b2b9f115cb1b1387bdb1",
     "scenarios": [
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c80bb",
     "name": "Simple to understand & Implement",
     "code": "10038.140.10"
     },
     {
     "isChecked": true,
     "_id": "59352b61df2fcd693c7c80ba",
     "name": "Average as per industry norms",
     "code": "10038.140.20"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c80b9",
     "name": "Complex to understand the functionality, technology & Business Logic",
     "code": "10038.140.30"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c80b8",
     "name": "Not Applicable",
     "code": "10038.140.0"
     }
     ],
     "match": "extra"
     },
     {
     "name": "Project Team Location",
     "_id": "5938b2b9f115cb1b1387bdb0",
     "scenarios": [
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c80b6",
     "name": "Single / Co-located",
     "code": "10038.150.10"
     },
     {
     "isChecked": true,
     "_id": "59352b61df2fcd693c7c80b5",
     "name": "Multi-location within country / region",
     "code": "10038.150.20"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c80b4",
     "name": "Global locations",
     "code": "10038.150.30"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c80b3",
     "name": "Not Applicable",
     "code": "10038.150.0"
     }
     ],
     "match": "extra"
     },
     {
     "name": "Implementation Complexity handled",
     "_id": "5938b2b9f115cb1b1387bdaf",
     "scenarios": [
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c80b1",
     "name": "Single system implementation",
     "code": "10038.160.10"
     },
     {
     "isChecked": true,
     "_id": "59352b61df2fcd693c7c80b0",
     "name": "Small scale System Integration",
     "code": "10038.160.20"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c80af",
     "name": "Large Scale Integration",
     "code": "10038.160.30"
     },
     {
     "isChecked": false,
     "_id": "59352b61df2fcd693c7c80ae",
     "name": "Not Applicable",
     "code": "10038.160.0"
     }
     ],
     "match": "extra"
     }
     ]
     }
     ]
     }
     ]
     },
     "awards": [],
     "interestedIndustries": [
     "ABC",
     "PQR",
     "XYZ"
     ],
     "certifications": [],
     "isVisible": true,
     "isCompleted": false,
     "experienceMatch": "above",
     "salaryMatch": "above",
     "educationMatch": "above",
     "releaseMatch": "exact",
     "interestedIndustryMatch": [],
     "proficienciesMatch": [
     "javascript",
     "angular 2",
     "java",
     "ABC"
     ]
     }*/
    /*app.get("/api/candidate/:candidateId/matchresult/:jobId",candidateController.metchResult);
     http://localhost:8080/api/candidate/59352c6edf2fcd693c7c82f4/matchresult/59353128df2fcd693c7c8391*/
  }

  ngOnChanges(changes: any) {
    if (changes.jobId != undefined && changes.jobId.currentValue != undefined) {
      this.jobId = changes.jobId.currentValue;
      this.candidateId = LocalStorageService.getLocalValue(LocalStorage.END_USER_ID);
      /*this.recruiterId = LocalStorageService.getLocalValue(LocalStorage.CURRENT_JOB_POSTED_ID);*/
      this.recruiterId = this.jobId;
      this.getCompareDetail(this.candidateId, this.recruiterId);
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

  getCompareDetail(candidateId: string, recruiterId: string) {
    this.candidateCompareService.getCompareDetail(candidateId, recruiterId)
      .subscribe(
        data => this.OnCompareSuccess(data),
        error => console.log(error));
  }

  OnCompareSuccess(data: any) {
    console.log('data after compare  ', data)
    this.data = data.data;
  }

  getImagePath(imagePath: string) {
    if (imagePath != undefined) {
      return AppSettings.IP + imagePath.substring(4).replace('"', '');
    }
    return null;
  }


}
