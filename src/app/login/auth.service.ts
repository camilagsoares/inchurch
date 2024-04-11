import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string = ''; 

  constructor(private http: HttpClient) {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      this.token = storedToken;
    }
  }
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>('https://dummyjson.com/auth/login', {
      username: username,
      password: password,
      expiresInMins: 30
    });
  }

  setToken(token: string): void {
    this.token = token; 
    localStorage.setItem('token', token); 
  }

  getToken(): string {
    return this.token; 
  }

  isLoggedIn(): boolean {
    return !!this.token;
  }

  logout(): void {
    localStorage.removeItem('token');
    this.token = '';
  }

  getUserData(): Observable<any> {
    return this.http.get<any>('https://dummyjson.com/auth/me', {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });
  }
}
