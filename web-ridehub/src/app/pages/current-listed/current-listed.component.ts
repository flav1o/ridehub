import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentRidesCard } from 'src/app/interfaces/current-rides/current-rides-card';
import { ComponentTogglerService } from 'src/app/services/component-toggler.service';
import { RidesService } from 'src/app/services/rides/get-rides.service';

@Component({
  selector: 'app-current-listed',
  templateUrl: './current-listed.component.html',
  styleUrls: ['./current-listed.component.scss']
})
export class CurrentListedComponent implements OnInit {

  constructor(
    private _currentRides: RidesService,
    private _componentToggler: ComponentTogglerService,
    private _router: Router
  ) { }

  currentList: Array<CurrentRidesCard> = [];
  oldList: Array<CurrentRidesCard> = this.currentList;
  currentPage: number = 0

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.showCurrentRides();

    setTimeout(() => {
      this._componentToggler.loading = true;
    }, 0);
  }

  showCurrentRides(): void {
    this._currentRides.getCurrentRides(this.currentPage).subscribe(
      data => {
        this._componentToggler.loading = false;
        this.currentList;
        this.currentList.push(...data),
          console.log(this.currentList);
        console.log(this.currentPage);
      },
      error => console.log(error)
    )
  };

  orderBy(orderType: string): void {
    this.currentPage = 0;
    this.currentList = [];

    this._currentRides.orderBy(this.currentPage, orderType).subscribe(
      data => this.currentList.push(...data),
      error => console.log(error)
    );
  }

  searchByWords(word: string): void {
    if (word.length <= 3) {
      this.currentList = this.oldList;
      return;
    }

    this._currentRides.searchByWord(word).subscribe(
      data => {
        this.currentList = [];
        this.currentList = [...data];

        if (this.currentList.length == 0) this.currentList = this.oldList;
      },
      error => console.log(error)
    )
  }

  //Detect if user scrolled to the bottom of the page
  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    const scrollPosition = event.target.documentElement.scrollTop;
    const scrollHeight = event.target.documentElement.scrollHeight - event.target.documentElement.clientHeight;
    const scrolledToBottom = scrollPosition >= scrollHeight;

    if (scrolledToBottom) {
      this.currentPage++;
      this.showCurrentRides();
    }
  }

  openRideCard(card: CurrentRidesCard) {
    this._router.navigate([`ride-lobby/${card.id_viagem}`]);
  }
}
