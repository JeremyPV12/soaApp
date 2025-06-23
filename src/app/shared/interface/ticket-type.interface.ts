export interface TicketType {
  Id: number;
  EventId: number;
  Name: string;
  Price: number;
  Quantity: number;
  Description: string;
}

export interface TicketTypeListResponse {
  TotalCount: number;
  PageNumber: number;
  PageSize: number;
  TotalPages: number;
  Items: {
    TicketTypeResponse: TicketType[];
  };
}
