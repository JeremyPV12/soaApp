import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../interface/order.interface';
import { map } from 'rxjs';
import { XMLParser } from 'fast-xml-parser';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private url = 'http://localhost:5003/OrderService.svc'

  constructor(private http : HttpClient) { }

  addOrder(data : Order){
    const headers = new HttpHeaders({
      'Content-Type': 'text/xml',
      'SOAPAction': '"http://tempuri.org/IOrderServiceSOAP/Add"'
    });

    let orderItemsXml = '';
    for (const item of data.Items) {
    orderItemsXml += `
      <tns:OrderItemRequest>
        <tns:TicketTypeId>${item.ticketType}</tns:TicketTypeId>
        <tns:Quantity>${item.Quantity}</tns:Quantity>
      </tns:OrderItemRequest>`;
    }

    const xmlBody = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://tempuri.org/">
      <soapenv:Header/>
      <soapenv:Body>
        <tns:Add>
           <tns:request>
              <tns:CustomerId>${data.customerID}</tns:CustomerId>
              <tns:PaymentMethod>${data.PaymentMethod}</tns:PaymentMethod>
              <tns:TransactionId>1005</tns:TransactionId>
              <tns:Items>
                  
                 ${orderItemsXml}

              </tns:Items>
           </tns:request>
        </tns:Add>
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

  getCustomerById(id : number){
    const headers = new HttpHeaders({
      'Content-Type': 'text/xml',
      'SOAPAction': '"http://tempuri.org/IOrderServiceSOAP/GetByCustomerId"'
    });

    const xmlBody = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://tempuri.org/">
        <soapenv:Header/>
        <soapenv:Body>
          <tns:GetByCustomerId>
           <tns:customerId>${id}</tns:customerId>
          </tns:GetByCustomerId>
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

}
