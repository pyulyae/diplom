import { Injectable } from '@angular/core';
import {ApiService} from "../api.service";
import {Observable} from "rxjs";
import {HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  constructor(private apiService: ApiService) { }

  getLanguages(): Observable<any> {
    return this.apiService.get("languages");
  }

  saveLanguage(name: string): Observable<any> {
    return this.apiService.post("languages", {name: name});
  }

  getLanguageById(id: number): Observable<any> {
    return this.apiService.get(`languages/${id}`);
  }

  getLanguageByName(name: string): Observable<any> {
    let httpParams = new HttpParams();
    httpParams.append("name", name);
    return this.apiService.get("languages", {params: httpParams});
  }
}
