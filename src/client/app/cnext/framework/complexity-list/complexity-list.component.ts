import {Response, Http} from '@angular/http';
import {Component} from '@angular/core';
import {Complexity} from "../model/complexity";
import {ComplexityService} from "../complexity.service";



@Component({
  moduleId: module.id,
  selector: 'cn-complexity-list',
  templateUrl: 'complexity-list.component.html',
  styleUrls: ['complexity-list.component.css']
})

export class ComplexityListComponent {
  private complexities: Complexity[];
  private selectedComplexity=new Array();
  private isComplexityShow : boolean =false;

  constructor( private http:Http,
                private complexityService: ComplexityService) {
    complexityService.showTest$.subscribe(
      data=>{
          this.isComplexityShow=data;
      }
    );
    this.http.get("complexity")
      .map((res: Response) => res.json())
      .subscribe(
        data => {
          this.complexities = data.complexity;
        },
        err => console.error(err),
        () => console.log()
      );
  }

  selectOption(newVal:any){
    if (newVal.target.checked) {
      for (let i = 0; i < this.selectedComplexity.length; i++) {
        if (this.selectedComplexity[i].name === newVal.currentTarget.children[0].innerHTML) {
          if (i > -1) {
            this.selectedComplexity.splice(i, 1);
          }
        }
      }
      let currentComplexity=new Complexity();
      currentComplexity.name=newVal.currentTarget.children[0].innerHTML;
      currentComplexity.scenario=newVal.target.value
      if(newVal.target.value !== "none") {
        this.selectedComplexity.push(currentComplexity);
      }
    }
  }
}
