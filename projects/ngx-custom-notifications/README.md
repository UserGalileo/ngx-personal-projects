# Angular Custom Notifications

This library lets you display custom notifications (like Google Material toasts) in your app, using your own components instead of pre-built popups.
It does a simple thing: it takes your components, it displays them on the page and it dismisses them (optionally) after the specified time.

It also lets you bind inputs and outputs very easily, so that you can interact with your components seamlessly.


### Quick links
Coming Soon

### Development notes
This project was built using the native Angular CLI's `ng generate library` command.

### Installing and usage

NB. Coming soon on NPM.
```bash
npm install ngx-custom-notifications --save
```

##### Import the module in your root injector

Providing the global configuration is optional and when used you should only provide the configuration in your root module.

```javascript
import { NotificationModule } from 'ngx-custom-notifications';

@NgModule({
  ...
  imports: [
    ...
    NotificationModule
  ],
  ...
})
```

##### Create a custom component which implements Disposable<T>, where T is the type of the returned value when the notification is dismissed!

This interface forces you to have an EventEmitter property called 'dispose' which you can call from inside the component in order to dispose the notification.
Optionally, you can have a property called 'duration' which will receive the duration of the notification, if you choose to use it. It may be useful if you want to display a progress bar (or a timer) inside the component.

```javascript
@Component({...})
export class MaterialNotification implements Disposable<string> {
  // Mandatory:
  dispose = new EventEmitter<string>();
  // Optional:
  @Input() duration: number;
}
```

Then in your application, use the NotificationService to display the notification:

```javascript
import { MaterialNotificationComponent } from '...';
import { NotificationService, NotificationPosition } from 'ngx-custom-notifications';

@Component({
  selector: '...',
  template: `
    <input #time type="text" placeholder="Time in seconds">
    <button (click)="showNotification(time.value)">Create!</button>
  `,
})
export class AppComponent {

  constructor(private notification: NotificationService) {}

  showNotification(time) {
    this.notification.show({
      component: MaterialNotificationComponent,
      position: NotificationPosition.TOP_RIGHT,
      duration: +time * 1000,
      data: {
        title,
      }
    });
  }
}
```

##### Included typings

The `show()` method accepts a NotificationConfig object which is shaped like this:
```javascript
export interface NotificationConfig {
  component: Type<Disposable<any>>; // Your component class
  data?: Object; // This data will be passed down to the component (like Inputs)
  position?: NotificationPosition; // Described later on
  duration?: number; // Duration in milliseconds
}
```

`NotificationPosition` is an enum with 6 possible values:
```javascript
export enum NotificationPosition {
  TOP = 'top',
  TOP_RIGHT = 'top-right',
  TOP_LEFT = 'top-left',
  BOTTOM = 'bottom',
  BOTTOM_RIGHT = 'bottom-right',
  BOTTOM_LEFT = 'bottom-left',
}
```

The library automatically positions the component in the right spot of your window for you. The default value is `TOP_RIGHT`.

### Managing the notification from the outside

The `show()` method returns a `NotificationRef` object which is shaped like this:

```javascript
export interface NotificationRef {
  onDispose: Observable<any>;
  dispose: () => void;
  componentRef?: ComponentRef<any>;
}
```

So, you can use the `onDispose` observable to know when the notification has been disposed from the inside (who said cascading notifications?), you can dispose it manually form the outside by calling `dispose()` or you can also grab the `componentRef` to have full control over your component (ex. by calling `componentRef.instance` you can access its properties and methods).

This is a private project for academic purposes, feel free to use it as you wish.
