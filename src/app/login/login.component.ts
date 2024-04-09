import { Component } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username: string = ''; // Inicialização da propriedade username
  password: string = '';
  userData: any; 

  constructor(private authService: AuthService) { }


  login(): void {
    this.authService.login(this.username, this.password).subscribe(
      response => {
        console.log(response); // Faça algo com o token retornado pela API, como armazená-lo no localStorage
        // Armazena os dados do usuário retornado
        this.userData = response.user; // Supondo que a resposta contenha um objeto de usuário
      },
      error => {
        console.error(error); // Lide com erros de login aqui
      }
    );
  }
}
