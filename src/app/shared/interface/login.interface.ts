export interface Login {
  email: string;
  password: string;
}

export interface Register {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginResponse {
  Id: number;
  Email: string;
  FistName: string;
  LastName: string;
  Token: string;
}

export interface AdminLoginResponse {
  Id: number;
  Email: string;
  FirstName: string;
  LastName: string;
  Token: string;
  Role: string;
}
