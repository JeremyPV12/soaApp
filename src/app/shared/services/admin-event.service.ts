import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { XMLParser } from 'fast-xml-parser';
import { map, catchError } from 'rxjs';
import { Event } from '../interface/event.interface';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private url = 'http://localhost:5003/EventService.svc';
  private parser = new XMLParser({
    ignoreAttributes: false,
    isArray: (name, jpath, isLeaf) => false,
  });

  constructor(private http: HttpClient) {}

  private processResponse(xml: string): any {
    const json = this.parser.parse(xml);
    // console.log('Respuesta completa:', json); // Para depuración

    // Extrae la respuesta según la estructura SOAP
    const envelope = json['s:Envelope'];
    const body = envelope?.['s:Body'];
    const response =
      body?.['GetAllResponse']?.['GetAllResult'] || body?.['GetAllResult'];

    // Si la respuesta tiene Items.EventResponse, lo normalizamos
    if (response?.Items?.EventResponse) {
      return {
        ...response,
        Events: response.Items.EventResponse,
      };
    }
    return response || {};
  }

  getAllEvents(page: number = 1, pageSize: number = 10, search: string = '') {
    const headers = new HttpHeaders({
      'Content-Type': 'text/xml',
      SOAPAction: '"http://tempuri.org/IEventServiceSOAP/GetAll"',
    });

    const xmlBody = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://tempuri.org/">
        <soapenv:Header/>
        <soapenv:Body>
          <tns:GetAll>
            <tns:query>
              <tns:Search>${search}</tns:Search>
              <tns:PageNumber>${page}</tns:PageNumber>
              <tns:PageSize>${pageSize}</tns:PageSize>
            </tns:query>
          </tns:GetAll>
        </soapenv:Body>
      </soapenv:Envelope>`;

    return this.http
      .post(this.url, xmlBody, {
        headers,
        responseType: 'text',
      })
      .pipe(
        map((x) => this.processResponse(x)),
        catchError((error) => {
          console.error('Error en getAllEvents:', error);
          throw error;
        })
      );
  }

  getEventById(id: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'text/xml',
      SOAPAction: '"http://tempuri.org/IEventServiceSOAP/GetById"',
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

    return this.http
      .post(this.url, xmlBody, {
        headers,
        responseType: 'text',
      })
      .pipe(
        map((x) => {
          const json = this.parser.parse(x);
          console.log('Respuesta GetById:', json);

          // Extraer la respuesta según la estructura SOAP
          const response =
            json['s:Envelope']?.['s:Body']?.['GetByIdResponse']?.[
              'GetByIdResult'
            ];

          if (!response) {
            throw new Error('Formato de respuesta SOAP inválido');
          }

          return response;
        }),
        catchError((error) => {
          console.error('Error en getEventById:', error);
          throw error;
        })
      );
  }

  createEvent(event: Event) {
    const headers = new HttpHeaders({
      'Content-Type': 'text/xml',
      SOAPAction: '"http://tempuri.org/IEventServiceSOAP/Add"',
    });

    const xmlBody = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://tempuri.org/">
      <soapenv:Header/>
      <soapenv:Body>
        <tns:Add>
          <tns:request>
            <tns:Name>${event.Name}</tns:Name>
            <tns:Description>${event.Description}</tns:Description>
            <tns:Date>${event.Date}</tns:Date>
            <tns:Location>${event.Location}</tns:Location>
            <tns:ImageUrl>${event.ImageUrl || 'default.jpg'}</tns:ImageUrl>
            <tns:Status>${event.Status || 'active'}</tns:Status>
          </tns:request>
        </tns:Add>
      </soapenv:Body>
    </soapenv:Envelope>`;

    return this.http
      .post(this.url, xmlBody, {
        headers,
        responseType: 'text',
      })
      .pipe(
        map((x) => {
          const json = this.parser.parse(x);
          return json['s:Envelope']?.['s:Body']?.['AddResponse']?.['AddResult'];
        }),
        catchError((error) => {
          console.error('Error en createEvent:', error);
          throw error;
        })
      );
  }

  updateEvent(event: Event) {
    const headers = new HttpHeaders({
      'Content-Type': 'text/xml',
      SOAPAction: '"http://tempuri.org/IEventServiceSOAP/Update"',
    });

    const xmlBody = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://tempuri.org/">
      <soapenv:Header/>
      <soapenv:Body>
        <tns:Update>
          <tns:id>${event.Id}</tns:id>
          <tns:request>
            <tns:Name>${event.Name}</tns:Name>
            <tns:Description>${event.Description}</tns:Description>
            <tns:Date>${event.Date}</tns:Date>
            <tns:Location>${event.Location}</tns:Location>
            <tns:ImageUrl>${event.ImageUrl || 'default.jpg'}</tns:ImageUrl>
            <tns:Status>${event.Status || 'active'}</tns:Status>
          </tns:request>
        </tns:Update>
      </soapenv:Body>
    </soapenv:Envelope>`;

    return this.http
      .post(this.url, xmlBody, {
        headers,
        responseType: 'text',
      })
      .pipe(
        map((x) => {
          const json = this.parser.parse(x);
          return json['s:Envelope']?.['s:Body']?.['UpdateResponse']?.[
            'UpdateResult'
          ];
        }),
        catchError((error) => {
          console.error('Error en updateEvent:', error);
          throw error;
        })
      );
  }

  deleteEvent(id: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'text/xml',
      SOAPAction: '"http://tempuri.org/IEventServiceSOAP/Delete"',
    });

    const xmlBody = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://tempuri.org/">
        <soapenv:Header/>
        <soapenv:Body>
          <tns:Delete>
            <tns:id>${id}</tns:id>
          </tns:Delete>
        </soapenv:Body>
      </soapenv:Envelope>`;

    return this.http
      .post(this.url, xmlBody, {
        headers,
        responseType: 'text',
      })
      .pipe(
        map((x) => this.processResponse(x)),
        catchError((error) => {
          console.error('Error en deleteEvent:', error);
          throw error;
        })
      );
  }

  cancelEventById(id: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'text/xml',
      SOAPAction: '"http://tempuri.org/IEventServiceSOAP/CancelEvent"',
    });

    const xmlBody = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://tempuri.org/">
      <soapenv:Header/>
      <soapenv:Body>
        <tns:CancelEvent>
          <tns:eventId>${id}</tns:eventId>
        </tns:CancelEvent>
      </soapenv:Body>
    </soapenv:Envelope>`;

    return this.http
      .post(this.url, xmlBody, {
        headers,
        responseType: 'text',
      })
      .pipe(
        map((x) => {
          const json = this.parser.parse(x);
          // console.log('Respuesta Cancel event:', json);

          // Verificar si la respuesta es válida aunque no tenga contenido
          const envelope = json['s:Envelope'];
          const body = envelope?.['s:Body'];
          const response = body?.['CancelEventResponse'];

          // Si existe la respuesta, consideramos que fue exitoso
          if (response !== undefined) {
            return { success: true };
          }

          throw new Error('Formato de respuesta SOAP inválido');
        }),
        catchError((error) => {
          console.error('Error en CancelEventResponse:', error);
          throw error;
        })
      );
  }
}
