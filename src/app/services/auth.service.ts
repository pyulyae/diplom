import { Injectable } from '@angular/core';
import {ApiService} from "../api.service";
import {Observable} from "rxjs";
import {HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private apiService: ApiService) { }

  resetPassword(mail: string): Observable<any> {
    const formData = new FormData();
    formData.append("mail", mail);
    const headers = new HttpHeaders({'enctype': 'multipart/form-data'});
    return this.apiService.post("authorizations/reset-password", formData, {headers: headers});
  }

  login(login: string, password: string): Observable<any> {
    let body = {
      mail: login,
      password: password,
      surname: "surname",
      name: "name",
      patronymic: "patronymic"
    }
    return this.apiService.post("authorizations/sign-in", body)
  }

  signUp(surname: string, name: string, patronymic: string, mail: string, password: string): Observable<any> {
    let body = {
      surname: surname,
      name: name,
      patronymic: patronymic,
      mail: mail,
      password: password
    };
    return this.apiService.post("authorizations/sign-up", body);
  }

  logout(): Observable<any> {
    return this.apiService.get("authorizations/logout");
  }

  confirmAccount(clientId: number, token: string): Observable<any> {
    const formData = new FormData();
    formData.append("clientId", clientId.toString());
    formData.append("token", token);
    const headers = new HttpHeaders({'enctype': 'multipart/form-data'});
    return this.apiService.post("authorizations/confirm-account", formData, {headers: headers})
  }

  sendToken(clientId: number): Observable<any> {
    const formData = new FormData();
    formData.append("clientId", clientId.toString());
    const headers = new HttpHeaders({'enctype': 'multipart/form-data'});
    return this.apiService.post("authorizations/send-token", formData, {headers: headers})
  }

  getProfile(clientId: string): Observable<any> {
    return this.apiService.get(`me/${clientId}`)
  }

  updateProfile(clientId: string, surname: string, name: string, patronymic: string, mail: string, password: string): Observable<any> {
    let body = {
      entityId: clientId,
      surname: surname,
      name: name,
      patronymic: patronymic,
      mail: mail,
      password: password
    };
    return this.apiService.put("clients", body);
  }


}
