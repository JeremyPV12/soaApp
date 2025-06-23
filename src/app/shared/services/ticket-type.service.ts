import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { XMLParser } from 'fast-xml-parser';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketTypeService {

  private url = 'http://localhost:5003/TicketTypeService.svc'

  constructor(private http : HttpClient) { }
  
  getAllTickets(){
    const headers = new HttpHeaders({
      'Content-Type': 'text/xml',
      'SOAPAction': '"http://tempuri.org/ITicketTypeServiceSOAP/GetAll"'
    });

    const xmlBody = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://tempuri.org/">
      <soapenv:Header/>
      <soapenv:Body>
        <tns:GetAll>
          <tns:query>
            <tns:PageNumber>1</tns:PageNumber>
            <tns:PageSize>10</tns:PageSize>
          </tns:query>
        </tns:GetAll>
      </soapenv:Body>
    </soapenv:Envelope>
      `;
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


  getCustomerById(){
    const headers = new HttpHeaders({
      'Content-Type': 'text/xml',
      'SOAPAction': '"http://tempuri.org/ITicketTypeServiceSOAP/GetAll"'
    });
  }

}
