import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private httpClient : HttpClient) { }
  private urlSer : string;

  public setURL(url : string) {
    this.urlSer = url;
  }

  public getData() {
    return this.httpClient.get(this.urlSer);
  }

}
