import { Injectable } from '@angular/core';
import {ApiService} from "../api.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ClassificationService {

  constructor(private apiService: ApiService) { }

  getClassifications(): Observable<any> {
    return this.apiService.get("classifications");
  }

  updateClassification(id: number, name: string): Observable<any> {
    return this.apiService.put("classifications", {entityId: id, name: name});
  }

  saveClassification(name: string): Observable<any> {
    return this.apiService.post("classifications", {name: name});
  }

  getClassificationById(id: number): Observable<any> {
    return this.apiService.get(`classifications/${id}`);
  }

  deleteClassification(id: number): Observable<any> {
    return this.apiService.delete(`classifications/${id}`);
  }

  getClassificationByName(name: string): Observable<any> {
    return this.apiService.get(`classifications/${name}`);
  }

}
