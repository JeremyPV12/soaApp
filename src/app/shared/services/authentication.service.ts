import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { XMLParser } from 'fast-xml-parser';
import { Login, LoginResponse, Register } from '../interface/login.interface';
import { BehaviorSubject, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private url = 'http://localhost:5003/CustomerAuthService.svc'

  private profile ?: LoginResponse
  private profileSubject = new BehaviorSubject<LoginResponse|null>(null)

  constructor(private http : HttpClient) 
  {
    const profileData = localStorage.getItem('profile');
    if (profileData) {
      this.profile = JSON.parse(profileData);
    }
  }

  get profileData (){
    if (this.profile == undefined) {
      return undefined;
    }
    return {...this.profile}
  }
  
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
      }),
      tap((x) => this.processLogin(x['s:Envelope']['s:Body']['LoginResponse']['LoginResult']))
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


  private processLogin(data : LoginResponse){
    this.profileSubject.next(data);
    localStorage.setItem('profile',JSON.stringify(data))
  }

  logOut():void{
    this.profile = undefined;
    localStorage.removeItem('profile')
    this.profileSubject.next(null);
  }


}
