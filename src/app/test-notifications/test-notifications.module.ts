import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationModule } from 'ngx-custom-notifications';
import { MaterialNotificationComponent } from './material-notification.component';
import { TestNotificationsComponent } from './test-notifications.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: TestNotificationsComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NotificationModule,
  ],
  declarations: [
    TestNotificationsComponent,
    MaterialNotificationComponent
  ],
  entryComponents: [ MaterialNotificationComponent ],
})
export class TestNotificationsModule { }
