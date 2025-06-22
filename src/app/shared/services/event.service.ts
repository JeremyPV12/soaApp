import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { XMLParser } from 'fast-xml-parser';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private url = 'http://localhost:5003/EventService.svc'

  constructor(private http : HttpClient) { }

  getEvents(){
    const headers = new HttpHeaders({
      'Content-Type': 'text/xml',
      'SOAPAction': '"http://tempuri.org/IEventServiceSOAP/GetAll"'
    });

    const xmlBody = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://tempuri.org/">
      <soapenv:Header/>
      <soapenv:Body>
        <tns:GetAll>
          <tns:query>
            <tns:Search></tns:Search>
            <tns:PageNumber>1</tns:PageNumber>
            <tns:PageSize>10</tns:PageSize>
          </tns:query>
        </tns:GetAll>
      </soapenv:Body>
      </soapenv:Envelope>`;

    return this.http.post(this.url, xmlBody, {
          headers,
          responseType: 'text' 
        }).pipe(
          map ( x => {
            const parser = new XMLParser();
            const json = parser.parse(x)
            return json
          })
        )
  }

  getEventById(id  : number){
    const headers = new HttpHeaders({
      'Content-Type': 'text/xml',
      'SOAPAction': '"http://tempuri.org/IEventServiceSOAP/GetById"'
    });

    const xmlBody = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://tempuri.org/">
      <soapenv:Header/>
        <soapenv:Body>
          <tns:GetById>
            <tns:id>${id}</tns:id>
          </tns:GetById>
        </soapenv:Body>
      </soapenv:Envelope>`;
    return this.http.post(this.url, xmlBody, {
          headers,
          responseType: 'text' 
        }).pipe(
          map ( x => {
            const parser = new XMLParser();
            const json = parser.parse(x)
            return json
          })
        )
  }

}
