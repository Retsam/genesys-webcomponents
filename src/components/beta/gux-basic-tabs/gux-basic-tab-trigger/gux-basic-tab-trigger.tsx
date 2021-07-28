import {
  Component,
  Event,
  EventEmitter,
  h,
  Listen,
  Method,
  Prop,
  State
} from '@stencil/core';

@Component({
  styleUrl: 'gux-basic-tab-trigger.less',
  tag: 'gux-basic-tab-trigger'
})
export class GuxBasicTabTrigger {
  private buttonElement: HTMLButtonElement;

  @Prop()
  triggerId: string;

  @Prop()
  panelId: string;

  @State()
  active: boolean = false;

  @Prop() guxDisabled: boolean = false;

  @Prop() tooltip: string = '';

  @Listen('click')
  onClick() {
    if (!this.active && !this.guxDisabled) {
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
      <button
        class={{
          'gux-disabled': this.guxDisabled,
          'gux-basic-tab': true,
          'gux-active': this.active
        }}
        type="button"
        disabled={this.guxDisabled}
        id={this.triggerId}
        role="tab"
        aria-controls={this.panelId}
        aria-selected={this.active.toString()}
        tabIndex={this.active ? 0 : -1}
        ref={el => (this.buttonElement = el)}
      >
        <gux-tooltip-title tooltip={this.tooltip} tabWidth={113}>
          <slot name="icon" />
          <slot name="title" />
        </gux-tooltip-title>
      </button>
    );
  }
}
