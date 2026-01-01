
import { 
  Weather, 
  CreateWeatherRequest, 
  LoginRequest, 
  AuthResponse 
} from '../types';

const BASE_URL = 'http://localhost:3000';

class ApiClient {
  private token: string | null = localStorage.getItem('skywatch_token');

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('skywatch_token', token);
    } else {
      localStorage.removeItem('skywatch_token');
    }
  }

  getToken() {
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers = new Headers(options.headers || {});
    if (this.token) {
      headers.set('Authorization', `Bearer ${this.token}`);
    }
    headers.set('Content-Type', 'application/json');

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed: ${response.status}`);
    }

    if (response.status === 204) return {} as T;
    return response.json();
  }

  // Auth
  async login(data: LoginRequest): Promise<AuthResponse> {
    const res = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(res.token);
    return res;
  }

  async register(data: LoginRequest): Promise<void> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Weather
  async getAllWeather(): Promise<Weather[]> {
    return this.request<Weather[]>('/weather');
  }

  async createWeather(data: CreateWeatherRequest): Promise<Weather> {
    return this.request<Weather>('/weather', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateWeather(id: string, data: CreateWeatherRequest): Promise<Weather> {
    return this.request<Weather>(`/weather/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getWeatherById(id: string): Promise<Weather> {
    return this.request<Weather>(`/weather/${id}`);
  }

  async deleteWeather(id: string): Promise<void> {
    return this.request(`/weather/${id}`, {
      method: 'DELETE',
    });
  }

  async getLatestWeatherByCity(cityName: string): Promise<Weather> {
    return this.request<Weather>(`/weather/latest/${cityName}`);
  }
}

export const api = new ApiClient();
