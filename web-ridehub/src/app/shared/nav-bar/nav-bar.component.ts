import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  constructor(
    private _userData: UserDataService,
    private _router: Router
    ) { }

  ngOnInit(): void {
    
  }

  redirectProfile(): void {
    this._router.navigate([`/profile/${this._userData.user.id_utilizador}`])
  }

}
