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
    this.loading = true;

    this.authService.login(this.username, this.password).subscribe(
      response => {
        const token = response.token; 
        this.authService.setToken(token);
        this.loggedIn = true;
        this.clearFields();

        this.authService.getUserData().subscribe(
          userData => {
            this.userData = userData;
            this.loading = false; 
            if (this.userData && this.userData.username && this.userData.email) {
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
            this.loading = false; 
          }
        );

        // this.router.navigate(['/']);
      },
      error => {
        console.error(error);
        this.loading = false;
      }
    );
  }

  clearFields(): void {
    this.username = '';
    this.password = '';
  }
}
