import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {TagContentType} from "@angular/compiler";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private static API_NAME = 'api/v1';
  public static API = ApiService.API_NAME + '/';

  constructor(private http: HttpClient) {
  }

  get(url: string, options?: Object): Observable<any> {
    return this.http.get(ApiService.API + url, options);
  }

  post(url: string, body: any, options?: Object): Observable<any> {
    return this.http.post(ApiService.API + url, body, options);
  }

  put(url: string, body: any, options?: Object): Observable<any> {
    return this.http.put(ApiService.API + url, body, options);
  }

  delete(url: string, options?: Object): Observable<any> {
    return this.http.delete(ApiService.API + url, options);
  }

  patch(url: string, body: any, options?: Object): Observable<any> {
    return this.http.patch(ApiService.API + url, body, options);
  }

  getFile(url: string, httpParams?: HttpParams) {
    const headers = {
      'Accept': 'application/octet-stream'
    }

    return this.http.get(ApiService.API + url, {
      headers: new HttpHeaders(headers),
      observe: 'response',
      responseType: 'blob'
    }).pipe(map(response =>
    this.downloadFile(response)));
  }

  private downloadFile(data: HttpResponse<Blob>) {
    let resultFileName: string = '';
    let resultType;
    resultType = data.headers.get('content-type')?.split(';')[0];
    let contDisposition = data.headers.get('content-disposition');
    if (contDisposition) {
      resultFileName = this.getFileNameByContentDisposition(contDisposition);
    }

    /* resp.body.blob()*/
    let blob = new Blob([data.body!], {type: resultType});
    let a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = resultFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }


  private getFileNameByContentDisposition(contentDisposition: string): string {
    let regex = /filename[^;=\n]*=(UTF-8(['"]*))?(.*)/;
    let matches = regex.exec(contentDisposition);
    let filename: string = '';
    if (matches != null && matches[3]) {
      filename = matches[3].replace(/['"]/g, '');
    }
    return decodeURI(filename);
  }
}
