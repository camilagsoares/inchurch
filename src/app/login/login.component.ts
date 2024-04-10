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

  constructor(private authService: AuthService, private router: Router) { }

  login(): void {
    this.authService.login(this.username, this.password).subscribe(
      response => {
        this.userData = response.user;
        this.loggedIn = true;
        this.clearFields(); // Limpa os campos do formulário

        // Exibir mensagem de sucesso (você pode usar um serviço de mensagens para isso)
        alert('Login bem-sucedido!');

        // Redirecionar para a home ("/")
        this.router.navigate(['/']);
      },
      error => {
        console.error(error);
      }
    );
  }

  clearFields(): void {
    this.username = '';
    this.password = '';
  }
}
