import { Component } from '@angular/core';

@Component({
  selector: 'app-welcome',
  template: `
    <h2>Projects: </h2>
    <hr>
    <button [routerLink]="'/notifications'">Custom Notifications</button>
  `
})
export class WelcomeComponent {}
