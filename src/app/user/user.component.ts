import { Component, OnInit } from '@angular/core';
import { AuthService } from '../login/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  loading: boolean = true;

  userData: any;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.loading = true;

    this.authService.getUserData().subscribe(
      (data) => {
        this.userData = data;
        this.loading = false;
      },
      (error) => {
        console.error('Erro ao obter dados do usuário', error);
        this.loading = false;
      }
    );
  }

 
  redirectTo(route: string) {
    this.router.navigate([route]);
  }

}
