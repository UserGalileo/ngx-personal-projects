import { Type, EventEmitter, ComponentRef } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Returned by the show() method of NotificationService
 */
export interface NotificationRef {
  onDispose: Observable<any>;
  dispose: () => void;
  componentRef?: ComponentRef<any>;
}
/**
 * Each notification can have its own configuration
 */
export interface NotificationConfig {
  component: Type<Disposable<any>>;
  data?: Object;
  position?: NotificationPosition;
  duration?: number;
}
/**
 * Components contained in the toast should implement this interface
 */
export interface Disposable<T> {
  dispose: EventEmitter<T>;
  config?: NotificationConfig;
}
/**
 * Possible notification positions
 */
export enum NotificationPosition {
  TOP = 'top',
  TOP_RIGHT = 'top-right',
  TOP_LEFT = 'top-left',
  BOTTOM = 'bottom',
  BOTTOM_RIGHT = 'bottom-right',
  BOTTOM_LEFT = 'bottom-left',
}
