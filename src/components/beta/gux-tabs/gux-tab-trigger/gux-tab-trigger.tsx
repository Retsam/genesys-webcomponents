import {
  Component,
  Event,
  EventEmitter,
  h,
  Host,
  Listen,
  Method,
  Prop,
  State
} from '@stencil/core';

@Component({
  styleUrl: 'gux-tab-trigger.less',
  tag: 'gux-tab-trigger',
  shadow: true
})
export class GuxTabTrigger {
  private buttonElement: HTMLButtonElement;

  @Prop()
  triggerId: string;

  @Prop()
  panelId: string;

  @State()
  active: boolean = false;

  @Listen('click')
  onClick() {
    if (!this.active) {
      this.internalactivatetabpanel.emit(this.panelId);
    }
  }

  @Event()
  internalactivatetabpanel: EventEmitter<string>;

  @Method()
  async guxSetActive(active: boolean): Promise<void> {
    this.active = active;
  }

  @Method()
  async guxFocus(): Promise<void> {
    this.buttonElement.focus();
  }

  render() {
    return (
      <Host>
        <button
          type="button"
          id={this.triggerId}
          role="tab"
          aria-controls={this.panelId}
          aria-selected={this.active.toString()}
          tabIndex={this.active ? 0 : -1}
          ref={el => (this.buttonElement = el)}
        >
          <slot></slot>
        </button>
      </Host>
    );
  }
}
