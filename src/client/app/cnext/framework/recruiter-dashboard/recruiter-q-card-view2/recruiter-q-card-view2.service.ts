import {Injectable} from "@angular/core";

@Injectable()
export class RecruiteQCardView2Service  {

  /*constructor(private http:Http) {
   super();
   }
   getSearchedcandidate(id:string) {
   let headers = new Headers({'Content-Type': 'application/json'});
   let options = new RequestOptions({headers: headers});
   let url ="/api/recruiter/jobProfile/"+id+"/candidates";
   return this.http.get(url)
   .map(this.extractData)
   .catch(this.handleError);
   }
   getCandidates(id:string):Observable<any> {
   let url:string=API.CANDIDATE_PROFILE+'/'+id;
   return this.http.get(url)
   .map(this.extractData)
   .catch(this.handleError);
   }
   getCandidatesdetails(ids:string[],model:JobPosterModel):Observable<any>{
   for(let item of ids){
   if(item=="undefined"){
   ids.splice(ids.indexOf(item),1);
   }
   }
   let headers = new Headers({'Content-Type': 'application/json'});
   let options = new RequestOptions({headers: headers});
   var body = {
   "candidateIds" : ids
   };
   let url:string=API.CANDIDATE_DETAILS+'/'+model._id+'/'+'candidates'
   return this.http.post(url,body,options)
   .map(this.extractData)
   .catch(this.handleError);
   }*/
}
