import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  EmbeddedViewRef,
  Inject,
  Injectable,
  Injector,
  Renderer2,
  RendererFactory2
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { Disposable, NotificationConfig, NotificationPosition, NotificationRef } from './notification.models';

/** @dynamic */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private _renderer: Renderer2;
  private _containerRefs: { [key in NotificationPosition]?: ComponentRef<any> } = {};

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private rendererFactory: RendererFactory2,
    private appRef: ApplicationRef,
    private injector: Injector,
    @Inject(DOCUMENT) private document: Document
  ) {
    /**
     * Services cannot inject Renderer2, we need to create one.
     */
    this._renderer = rendererFactory.createRenderer(null, null);
  }

  /**
   * Used to create/show a Notification.
   */
  show(config: NotificationConfig): NotificationRef {
    // Do the Angular-thing
    const componentRef = this.componentFactoryResolver
      .resolveComponentFactory(config.component)
      .create(this.injector);
    // Notify Angular about this component
    this.appRef.attachView(componentRef.hostView);
    // Get its DOM element
    const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    // Bind inputs and outputs
    if (config.data) {
      for (let input of Object.keys(config.data)) {
        componentRef.instance[input] = config.data[input];
      }
    }
    componentRef.instance.config = config;
    // If a duration is set, dispose the notif. after that time (ms)
    if (config.duration) {
      timer(config.duration).subscribe(() => this.dispose(componentRef));
    }
    const onDispose = componentRef.instance.dispose.pipe(take(1));
    onDispose.subscribe(() => this.dispose(componentRef));
    // Append DOM element to the right container
    this.appendInContainer(domElem, config.position);
    return {
      onDispose,
      dispose: () => this.dispose(componentRef),
      componentRef
    };
  }

  /**
   * Disposes a notification and removes it from DOM & Angular tree.
   */
  private dispose(componentRef: ComponentRef<Disposable<any>>) {
    // Destroy for Angular
    this.appRef.detachView(componentRef.hostView);
    // Destroy from DOM
    componentRef.destroy();
  }

  /**
   * Create an HTML container for a given position.
   */
  private createContainer(position: NotificationPosition = NotificationPosition.TOP_RIGHT) {

    const containerRef = this._renderer.createElement('div');
    this._renderer.addClass(containerRef, 'notifications-container');
    this._renderer.setStyle(containerRef, 'position', 'fixed');
    this._renderer.setStyle(containerRef, 'z-index', '999999');

    if (
      position === NotificationPosition.TOP ||
      position === NotificationPosition.TOP_RIGHT ||
      position === NotificationPosition.TOP_LEFT
    ) {
      this._renderer.setStyle(containerRef, 'top', '0');
    }
    if (
      position === NotificationPosition.BOTTOM ||
      position === NotificationPosition.BOTTOM_RIGHT ||
      position === NotificationPosition.BOTTOM_LEFT
    ) {
      this._renderer.setStyle(containerRef, 'bottom', '0');
    }
    if (
      position === NotificationPosition.TOP_LEFT ||
      position === NotificationPosition.TOP ||
      position === NotificationPosition.BOTTOM_LEFT ||
      position === NotificationPosition.BOTTOM
    ) {
      this._renderer.setStyle(containerRef, 'left', '0');
    }
    if (
      position === NotificationPosition.TOP_RIGHT ||
      position === NotificationPosition.BOTTOM_RIGHT
    ) {
      this._renderer.setStyle(containerRef, 'right', '0');
    }
    if (
      position === NotificationPosition.TOP ||
      position === NotificationPosition.BOTTOM
    ) {
      this._renderer.setStyle(containerRef, 'width', '100%');
    }

    this._renderer.appendChild(this.document.body, containerRef);
    this._containerRefs[position] = containerRef;
  }

  /**
   * Given an element and a position, it appends the element on the right container.
   */
  private appendInContainer(
    elem: HTMLElement,
    position: NotificationPosition = NotificationPosition.TOP_RIGHT) {
    // We create a container only when at least one notif. requires it
    if (!this._containerRefs[position]) this.createContainer(position);
    this._renderer.appendChild(this._containerRefs[position], elem);
  }
}
