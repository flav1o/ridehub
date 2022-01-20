import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/auth/token.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  constructor(
    private router: Router,
    private userToken: TokenService
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      if(!localStorage.getItem('authToken')) 
        this.router.navigate(['/login'])
      
      //TODO: REDIRECT TO HOME PAGE
      if(localStorage.getItem('authToken')) {
        const token : string = localStorage.getItem('authToken')
        this.userToken.decodeToken(token); 
        
        this.router.navigate(['/login']);   
      } 
    }, 2000);
  }
  
}
