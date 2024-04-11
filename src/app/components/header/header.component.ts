import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/login/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  
  constructor(private authService: AuthService) { }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout(): void {
    this.authService.logout();
    // Outras ações de logout, como redirecionar para a página de login
  }

  ngOnInit(): void {
  }

}
