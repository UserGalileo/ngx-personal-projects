import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { NotificationService, NotificationPosition } from 'ngx-custom-notifications';
import { MaterialNotificationComponent } from './material-notification.component';

@Component({
  selector: 'app-test-notifications',
  template: `
    <input #time type="text" placeholder="Time in seconds">
    <button (click)="onClick(time.value)">Create!</button>
  `,
})
export class TestNotificationsComponent  {

  constructor(private notification: NotificationService) {}

  /**
   * Do some magic
   */
  onClick(time) {
    this.showNotification('Top right!', time, NotificationPosition.TOP_RIGHT).pipe(
      switchMap(() => this.showNotification('Bottom right!', time, NotificationPosition.BOTTOM_RIGHT)),
      switchMap(() => this.showNotification('Top left!', time, NotificationPosition.TOP_LEFT)),
      switchMap(() => this.showNotification('Bottom left!', time, NotificationPosition.BOTTOM_LEFT)),
      switchMap(() => this.showNotification('Top!', time, NotificationPosition.TOP)),
      switchMap(() => this.showNotification('Bottom!', time, NotificationPosition.BOTTOM)),
    ).subscribe(() => console.log('All closed!'));
  }

  /**
   * Create a new notification and return its onDispose observable
   */
  showNotification(title: string, time: number, position: NotificationPosition): Observable<any> {
    return this.notification.show({
      component: MaterialNotificationComponent,
      position: position,
      duration: +time * 1000,
      data: {
        title,
      }
    }).onDispose;
  }
}
