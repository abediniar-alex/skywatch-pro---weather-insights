
export interface Weather {
  id: string;
  cityName: string;
  country: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  fetchedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWeatherRequest {
  cityName: string;
  country: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export enum AuthStatus {
  LOADING = 'LOADING',
  AUTHENTICATED = 'AUTHENTICATED',
  UNAUTHENTICATED = 'UNAUTHENTICATED'
}
