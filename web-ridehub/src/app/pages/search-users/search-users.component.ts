import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/users/user';
import { GetUsersService } from 'src/app/services/users/get-users.service';

@Component({
  selector: 'app-search-users',
  templateUrl: './search-users.component.html',
  styleUrls: ['./search-users.component.scss']
})
export class SearchUsersComponent implements OnInit {

  constructor(
    private getUserService: GetUsersService,
    private _router: Router
  ) { }

  newcomers: User[] = [];
  searchedUsers: User[] = [];

  ngOnInit(): void {
    this.getUserService.getNewComers().subscribe(
      data => {
        this.newcomers.push(...data);
      },
      error => console.log(error)
    );
  }

  openProfile(userID: number): void {
    this._router.navigate([`/profile/${userID}`]);
  }

  searchUser(name: string) {
    if (name.length <= 2) {
      this.searchedUsers = [];
      return;
    }
    
    if (name.length <= 3) return;

    this.getUserService.searchByName(name).subscribe(
      data => {
        this.searchedUsers = [];
        this.searchedUsers.push(...data)
      },
      error => console.log(error)
    );
  }
};
