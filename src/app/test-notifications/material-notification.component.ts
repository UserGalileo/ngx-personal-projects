import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { interval, timer } from 'rxjs';
import { takeUntil, map, startWith } from 'rxjs/operators';
import { Disposable, NotificationConfig } from 'ngx-custom-notifications';

/**
 * Notification Example
 */
@Component({
  selector: 'app-material-notification',
  template: `
    <div class="toast">
      <div class="text">{{ title }}</div>
      <div class="action" (click)="dispose.emit('I was disposed')">Dispose</div>
      <div class="progress" [style.width.%]="percentage"></div>
    </div>
  `,
  styles: [`
    .toast {
      	font-family: 'Roboto', sans-serif;
        display: flex;
        position: relative;
        flex-wrap: wrap;
        min-width: 200px;
        margin: 12px;
        padding: 20px 24px;
        border-radius: 2px;
        font-size: 14px;
        color: #FFF;
        background: #323232;
        box-shadow: 0px 3px 2px rgba(0, 0, 0, 0.2);
        animation: fadeInUp .3s;
    }
    .toast .text {
        display: inline-flex;
        vertical-align: middle;
        flex-grow: 1;
        margin-right: 10px;
    }
    .toast .action {
        color: #ffab40;
        cursor: pointer;
        transition: color 0.3s ease;
        text-transform: uppercase;
        text-decoration: none;
    }
    .progress {
      height: 3px;
      background: #1dcaff;
      position: absolute;
      bottom: 0;
      left: 0;
      -webkit-transition: width .2s ease-out;
      -moz-transition: width .2s ease-out;
      -o-transition: width .2s ease-out;
      transition: width .2s ease-out;
    }
    @media screen and (max-width: 560px){
      .toast {
        margin: 0;
        border-radius: 0;
      }
    }
    @keyframes fadeInUp {
      0% {
          opacity: 0;
          transform: translateY(50px);
      }
      100% {
          opacity: 1;
          transform: translateY(0);
      }
    }
  `],
})
export class MaterialNotificationComponent implements OnInit, Disposable<string> {

  /**
   * From 'Disposable'
   */
  dispose = new EventEmitter<string>();
  @Input() config: NotificationConfig;
  /**
   * Other
   */
  @Input() title: string;
  public percentage = 0;

  ngOnInit() {
    if (this.config.duration) {
      const every = 250;
      // Update the progress bar every 'every' milliseconds
      interval(every).pipe(
        // Automagically ubsubscribe when the duration time arrives
        takeUntil(timer(this.config.duration)),
        // Transform to percentage
        map(v => 100 - ((v + 2) * every / this.config.duration * 100)),
        // Always start from 100%
        startWith(100),
      ).subscribe(p => this.percentage = p);
    }
  }
}


