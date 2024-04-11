import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username: string = '';
  password: string = '';
  userData: any;
  loggedIn: boolean = false;
  loading: boolean = false; 

  constructor(private authService: AuthService, private router: Router) { }

    login(): void {
    this.loading = true; // Define a flag para indicar que está carregando

    this.authService.login(this.username, this.password).subscribe(
      response => {
        const token = response.token; // Obtenha o token de acesso
        this.authService.setToken(token); // Armazene o token
        this.loggedIn = true;
        this.clearFields();

        // Chame o método para obter os dados do usuário após o login
        this.authService.getUserData().subscribe(
          userData => {
            this.userData = userData;
            // Exiba os dados do usuário na tela como quiser
            this.loading = false; // Define a flag para indicar que terminou de carregar
            if (this.userData && this.userData.username && this.userData.email) {
              // Exibe os dados do usuário em um alert
              alert(`Bem vindo (a): ${this.userData.firstName} ${this.userData.lastName}`);
              setTimeout(() => {
                this.router.navigate(['/']);
              }, 1000);
            } else {
              console.log('Erro ao obter os dados do usuário.');
            }
          },
          error => {
            console.error(error);
            this.loading = false; // Define a flag para indicar que terminou de carregar
          }
        );

        // this.router.navigate(['/']);
      },
      error => {
        console.error(error);
        this.loading = false; // Define a flag para indicar que terminou de carregar
      }
    );
  }

  clearFields(): void {
    this.username = '';
    this.password = '';
  }
}
