import { Component } from '@angular/core';
import { TokenService } from './services/auth/token.service';
import { ComponentTogglerService } from './services/component-toggler.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'web-ridehub';

  constructor(
    public componentToggler: ComponentTogglerService,
    private _verifyLogin: TokenService
    ) {}

  ngOnInit(): void {
    this._verifyLogin.verifyLogin();
  }
}
