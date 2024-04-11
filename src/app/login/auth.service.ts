import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string = ''; // Armazene o token aqui

  constructor(private http: HttpClient) {
    // Recupera o token do localStorage ao inicializar o serviço, se existir
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
    this.token = token; // Defina o token após o login
    localStorage.setItem('token', token); 
  }

  getToken(): string {
    return this.token; // Obtenha o token
  }

  isLoggedIn(): boolean {
    // Verifica se o token está presente e não está vazio
    return !!this.token;
  }

  logout(): void {
    // Remove o token do localStorage e do serviço
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
