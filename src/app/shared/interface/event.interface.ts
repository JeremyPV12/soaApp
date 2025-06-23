export interface Event {
  Id: number;
  Name: string;
  Description: string;
  Date: string;
  Location: string;
  ImageUrl: string;
  Status: string;
}

export interface EventResponse {
  Id: number;
  Name: string;
  Description: string;
  Date: string;
  Location: string;
  ImageUrl: string;
  Status: string;
}

export interface EventListResponse {
  Items: {
    EventResponse: EventResponse[];
  };
  TotalCount: number;
  PageNumber: number;
  PageSize: number;
  TotalPages: number;
}
