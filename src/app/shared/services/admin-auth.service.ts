import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { XMLParser } from 'fast-xml-parser';
import { Login } from '../interface/login.interface';
import { BehaviorSubject, catchError, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthService {
  private url = 'http://localhost:5003/UserAuthService.svc';
  private adminProfile?: any;
  private adminProfileSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {
    const adminData = localStorage.getItem('adminProfile');
    if (adminData) {
      this.adminProfile = JSON.parse(adminData);
      this.adminProfileSubject.next(this.adminProfile);
    }
  }

  get adminData() {
    if (this.adminProfile == undefined) return undefined;
    return { ...this.adminProfile };
  }

  login(data: Login) {
    const headers = new HttpHeaders({
      'Content-Type': 'text/xml',
      SOAPAction: '"http://tempuri.org/IUserAuthServiceSOAP/Login"',
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

    return this.http
      .post(this.url, xmlBody, {
        headers,
        responseType: 'text',
      })
      .pipe(
        map((x) => {
          const parser = new XMLParser({
            ignoreAttributes: false,
            isArray: (name, jpath, isLeaf) => false,
          });
          const jsonObj = parser.parse(x);
          console.log('Respuesta completa:', jsonObj);

          // Acceso CORRECTO a la respuesta según lo que muestras en consola
          const response =
            jsonObj['s:Envelope']?.['s:Body']?.['LoginResponse']?.[
              'LoginResult'
            ];

          if (!response) {
            throw new Error('Formato de respuesta SOAP inválido');
          }

          // Verificar si el usuario tiene rol de Admin
          if (response.Role !== 'Admin') {
            throw new Error('No tienes permisos de administrador');
          }

          return response;
        }),
        tap((response) => {
          this.processAdminLogin(response);
        }),
        catchError((error) => {
          console.error('Error en la petición:', error);
          throw error;
        })
      );
  }

  private processAdminLogin(data: any) {
    // Verifica que la respuesta contenga los datos esperados
    if (!data || !data.Token) {
      throw new Error(
        'Credenciales inválidas o respuesta del servidor incompleta'
      );
    }

    this.adminProfile = {
      Id: data.Id,
      Email: data.Email,
      FirstName: data.FirstName,
      LastName: data.LastName,
      Token: data.Token,
      Role: data.Role,
    };

    localStorage.setItem('adminProfile', JSON.stringify(this.adminProfile));
    this.adminProfileSubject.next(this.adminProfile);
  }

  logout(): void {
    this.adminProfile = undefined;
    localStorage.removeItem('adminProfile');
    this.adminProfileSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.adminProfile?.Token && this.adminProfile?.Role === 'Admin';
  }

  isAdmin(): boolean {
    return this.adminProfile?.Role === 'Admin';
  }
}
