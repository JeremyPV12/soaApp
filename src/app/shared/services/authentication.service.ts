import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { XMLParser } from 'fast-xml-parser';
import { Login, Register } from '../interface/login.interface';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private url = 'http://localhost:5003/CustomerAuthService.svc'

  constructor(private http : HttpClient) { }
  
  getData(data : Login){
    const headers = new HttpHeaders({
      'Content-Type': 'text/xml',
      'SOAPAction': '"http://tempuri.org/ICustomerAuthServiceSOAP/Login"'
    });
    const xmlBody = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://tempuri.org/">
        <soapenv:Header/>
        <soapenv:Body>
          <tns:Login>
            <tns:request>
               <tns:Email>${data.email}</tns:Email>
               <tns:Password>${data.password}</tns:Password>
            </tns:request>
          </tns:Login>
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


  register(data: Register){
    const headers = new HttpHeaders({
      'Content-Type': 'text/xml',
      'SOAPAction': '"http://tempuri.org/ICustomerAuthServiceSOAP/Register"'
    });

    const xmlBody = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://tempuri.org/">
        <soapenv:Header/>
        <soapenv:Body>
          <tns:Register>
            <tns:request>
              <tns:FirstName>${data.name}</tns:FirstName>
              <tns:LastName>${data.lastName}</tns:LastName>
              <tns:Email>${data.email}</tns:Email>
              <tns:Password>${data.password}</tns:Password>
              <tns:Phone>${data.phone}</tns:Phone>
            </tns:request>
          </tns:Register>
        </soapenv:Body>
      </soapenv:Envelope>`;

    return this.http.post(this.url,xmlBody,{
      headers,
      responseType : 'text'
    }).pipe(
      map ( x => {
        const parser = new XMLParser();
        const json = parser.parse(x)
        return json
      })
    )
  }


}
