import {Component, Input} from "@angular/core";
import {JobCompareService} from "./job-compare-view.service";

@Component({
  moduleId: module.id,
  selector: 'cn-job-compare-view',
  templateUrl: 'job-compare-view.component.html',
  styleUrls: ['job-compare-view.component.css']
})

export class JobCompareViewComponent {
  @Input() candiadteId: string;
  @Input() jobId: string;

  private recruiterId: string;
  private data: any;

  constructor(private jobCompareService: JobCompareService) {
  }


  ngOnInit() {
    /*  this.data = {
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
     "_id": "59396c30060676644500ab72",
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
     "specialization": "SSC",
     "yearOfPassing": 1961,
     "board": "Sanskar Vidyalaya",
     "schoolName": "Well, I grew up in Cincinnati. As a child, I originally wanted to be a fireman, then later became interested in dinosaurs. I excelled in the sciences from early on, placing first in my fourth-grade science fair. ",
     "_id": "59396c30060676644500ab73"
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
     ]
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
     ]
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
     ]
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
     "year": 1958,
     "issuedBy": "SEED",
     "name": "JAVA",
     "remark": "Well, I grew up in Cincinnati. As a child, I originally wanted to be a fireman, then later became interested in dinosaurs. I excelled in the sciences from early on, placing first in my fourth-grade science fair. ",
     "_id": "59396c30060676644500ab74"
     }
     ],
     "isVisible": true,
     "isCompleted": true
     }*/
  }

  ngOnChanges(changes: any) {
    if (changes.candiadteId != undefined && changes.candiadteId.currentValue != undefined) {
      this.candiadteId = changes.candiadteId.currentValue;
    }
    if (changes.jobId != undefined && changes.jobId.currentValue != undefined) {
      this.recruiterId = changes.jobId.currentValue;
    }
    if (this.candiadteId != undefined && this.recruiterId != undefined) {
      this.getCompareDetail(this.candiadteId, this.recruiterId);
    }
  }

  getCompareDetail(candidateId: string, recruiterId: string) {
    this.jobCompareService.getCompareDetail(candidateId, recruiterId)
      .subscribe(
        data => this.OnCompareSuccess(data),
        error => console.log(error));
  }

  OnCompareSuccess(data: any) {
    this.data = data.data;
  }

}
