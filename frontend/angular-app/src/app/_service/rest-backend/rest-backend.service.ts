import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SignupRequest } from './typeModel/signup-request.type'; 
import { LoginRequest } from './typeModel/login-request.type';
import { IdeaRequest } from './typeModel/idea-request.type';
import{CommentRequest} from './typeModel/comment-request.type';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestBackendService {

  

  url = "http://localhost:3000" 
  constructor(private http: HttpClient) {}
 

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  private createParams(page: number, limit: number) {
    return new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
  }





  
  signup(signupRequest: SignupRequest){
    const url = `${this.url}/signup`; 
    return this.http.post(url, signupRequest, this.httpOptions)
  }

  
  addComment(commentRequest: CommentRequest){ 
    const url = `${this.url}/idea/${commentRequest.IdeaId}/comments`;
    return this.http.post<CommentRequest>(url, commentRequest, this.httpOptions);
    
  }

  login(loginRequest: LoginRequest){
    const url = `${this.url}/login`; 
    return this.http.post(url, loginRequest, this.httpOptions)
  }

  createIdea(ideaRequest: IdeaRequest){
    const url = `${this.url}/idea`; 
    return this.http.post(url, ideaRequest, this.httpOptions)
  }
 

  getIdea(page: number, limit: number){
    const url = `${this.url}/idea`; 
    let params = this.createParams(page, limit);
    return this.http.get<IdeaRequest[]>(url, {params})
  }


  getPersonalIdea(page: number, limit: number, user: string){
    const url = `${this.url}/idea/user/${user}`; 
    let params = new HttpParams()
    .set('page', page.toString())
    .set('limit', limit.toString())
    .set('user', user);
    return this.http.get<IdeaRequest[]>(url, {params})
  }


  isUsernameValid(username: string){
    const url = `${this.url}/idea/user/${username}/exists`; 
    return this.http.get<{value:boolean}>(url);
  }


  getComments( page: number, limit: number,id: number){
    const url = `${this.url}/idea/${id}/comments`; 
    let params = this.createParams(page, limit);
    return this.http.get<CommentRequest[]>(url, {params})
  }


  likeIdea(id: number,) {
    const url = `${this.url}/idea/${id}/like`;
    return this.http.post<IdeaRequest>(url, {id}, this.httpOptions);
  }


  dislikeIdea(id: number,) {
    const url = `${this.url}/idea/${id}/dislike`;
    return this.http.post<IdeaRequest>(url, {id}, this.httpOptions);
  }


  likeComment(id: number, idIdea: number) {
    const url = `${this.url}/idea/${idIdea}/comment/${id}/like`;
    return this.http.post<CommentRequest>(url, {}, this.httpOptions);
  }


  deleteIdea(id:number)
  {
    const url=`${this.url}/idea/${id}`
    return this.http.delete(url, this.httpOptions);
  }


  getIdeaMostPopular(page: number, limit: number){
    const url = `${this.url}/ideaMostPopular`; 
    let params = this.createParams(page, limit);
    return this.http.get<IdeaRequest[]>(url, {params})
  }


  getIdeaMostUnpopular(page: number, limit: number){
    const url = `${this.url}/ideaMostUnpopular`; 
    let params = this.createParams(page, limit);
    return this.http.get<IdeaRequest[]>(url, {params})
  }


  getIdeaMostControversial(page: number, limit: number){
    const url = `${this.url}/ideaMostControversial`; 
    let params = this.createParams(page, limit);
    return this.http.get<IdeaRequest[]>(url, {params})
  }


  getIdeaById(id: number) {
    const url = `${this.url}/idea/${id}`;
    return this.http.get<IdeaRequest>(url);
  }


  getNumberOfComments(id: number) {
    const url = `${this.url}/idea/${id}/comments/count`;
    return this.http.get<{count: number}>(url);
  }


  updateIdea(idIdeaUpdate: number, title: string, description: string) {
    const url = `${this.url}/idea/${idIdeaUpdate}`; 
    let params = new HttpParams()
      .set('title', title)
      .set('description', description)
      .set('id', idIdeaUpdate.toString());

    return this.http.put(url, {}, { params: params, ...this.httpOptions });
  }

 

}
