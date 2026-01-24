import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataStorage {
  constructor(private httpClient: HttpClient) { }
 private REST_API_SERVER = "http://localhost:3000/api";

public inviaRichiesta(method:string, resource:string, params:any={}): Observable<any> | undefined {
    resource = this.REST_API_SERVER + resource;
    switch(method.toLowerCase()){
      case "get":
        return this.httpClient.get(resource, { params: params, withCredentials: true });
      case "delete":
        return this.httpClient.delete(resource, { body: params, withCredentials: true });
      case "post":
        return this.httpClient.post(resource, params, { withCredentials: true }); // <- qui
      case "patch":
        return this.httpClient.patch(resource, params, { withCredentials: true });
      default:
        return undefined;
    }
}

}
