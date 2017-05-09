import {  Component,Input,EventEmitter,Output  } from '@angular/core';
import {JobPosterModel} from "../model/jobPoster";
import {QCardsortBy} from "../model/q-cardview-sortby";


@Component({
  moduleId: module.id,
  selector: 'cn-job-lister',
  templateUrl: 'job-lister.component.html',
  styleUrls: ['job-lister.component.css']
})

export class JobListerComponent {
  @Input() jobListInput: any[] = new Array(0);
  public jobList:JobPosterModel[] = new Array(0);
  public jobListToCheck:JobPosterModel[] = new Array(0);
  private toggle:boolean=false;
  private qCardModel:QCardsortBy=new QCardsortBy();
  @Output() jobEventEmitter : EventEmitter<any> =new EventEmitter();

  constructor() {
    this.qCardModel.name='Date';
  }

  ngOnChanges(changes: any) {
    if (changes.jobListInput != undefined && changes.jobListInput.length > 0) {debugger
      this.jobListInput = changes.jobListInput;
    }

  }

  sortBy(){
    this.toggleFormat();
  }

  onJobClikecd(item : any){debugger
    this.jobEventEmitter.emit(item);
  }
  get format() {
    return this.toggle ? this.qCardModel.name :"Date";
  }

  toggleFormat() {
    this.toggle = true;
  }

}
