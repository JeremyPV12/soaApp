// shared/services/ticket-type.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { XMLParser } from 'fast-xml-parser';
import { map, catchError } from 'rxjs';
import {
  TicketType,
  TicketTypeListResponse,
} from '../interface/ticket-type.interface';

@Injectable({
  providedIn: 'root',
})
export class TicketTypeService {
  private url = 'http://localhost:5003/TicketTypeService.svc';
  private parser = new XMLParser({
    ignoreAttributes: false,
    isArray: (name, jpath, isLeaf) => false,
  });

  constructor(private http: HttpClient) {}

  private processResponse(xml: string): any {
    const json = this.parser.parse(xml);
    const envelope = json['s:Envelope'];
    const body = envelope?.['s:Body'];
    const response =
      body?.['GetAllResponse']?.['GetAllResult'] || body?.['GetAllResult'];

    if (response?.Items?.TicketTypeResponse) {
      return {
        ...response,
        TicketTypes: response.Items.TicketTypeResponse,
      };
    }
    return response || {};
  }

  getAllTicketTypes(
    page: number = 1,
    pageSize: number = 10,
    search: string = ''
  ) {
    const headers = new HttpHeaders({
      'Content-Type': 'text/xml',
      SOAPAction: '"http://tempuri.org/ITicketTypeServiceSOAP/GetAll"',
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
          console.error('Error en getAllTicketTypes:', error);
          throw error;
        })
      );
  }

  getTicketTypeById(id: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'text/xml',
      SOAPAction: '"http://tempuri.org/ITicketTypeServiceSOAP/GetById"',
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
          console.error('Error en getTicketTypeById:', error);
          throw error;
        })
      );
  }

  createTicketType(ticketType: TicketType) {
    const headers = new HttpHeaders({
      'Content-Type': 'text/xml',
      SOAPAction: '"http://tempuri.org/ITicketTypeServiceSOAP/Add"',
    });

    const xmlBody = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://tempuri.org/">
      <soapenv:Header/>
      <soapenv:Body>
        <tns:Add>
          <tns:request>
            <tns:EventId>${ticketType.EventId}</tns:EventId>
            <tns:Name>${ticketType.Name}</tns:Name>
            <tns:Price>${ticketType.Price}</tns:Price>
            <tns:Quantity>${ticketType.Quantity}</tns:Quantity>
            <tns:Description>${ticketType.Description}</tns:Description>
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
          console.error('Error en createTicketType:', error);
          throw error;
        })
      );
  }

  updateTicketType(ticketType: TicketType) {
    const headers = new HttpHeaders({
      'Content-Type': 'text/xml',
      SOAPAction: '"http://tempuri.org/ITicketTypeServiceSOAP/Update"',
    });

    const xmlBody = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://tempuri.org/">
      <soapenv:Header/>
      <soapenv:Body>
        <tns:Update>
          <tns:id>${ticketType.Id}</tns:id>
          <tns:request>
            <tns:EventId>${ticketType.EventId}</tns:EventId>
            <tns:Name>${ticketType.Name}</tns:Name>
            <tns:Price>${ticketType.Price}</tns:Price>
            <tns:Quantity>${ticketType.Quantity}</tns:Quantity>
            <tns:Description>${ticketType.Description}</tns:Description>
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
          console.error('Error en updateTicketType:', error);
          throw error;
        })
      );
  }

  deleteTicketType(id: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'text/xml',
      SOAPAction: '"http://tempuri.org/ITicketTypeServiceSOAP/Delete"',
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
          console.error('Error en deleteTicketType:', error);
          throw error;
        })
      );
  }
}
