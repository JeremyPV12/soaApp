export interface Order {
    Items : Data[],
    PaymentMethod : string
    customerID : number
}

export interface Data {
    Quantity : number,
    ticketType : string
}

export interface OrderResponse {
  Id: number;
  CustomerId: number;
  OrderDate: string; 
  TotalAmount: number;
  Status: string
  PaymentMethod: string
  TransactionId: string 
}