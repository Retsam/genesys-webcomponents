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
  styleUrl: 'gux-tab-beta.less',
  tag: 'gux-tab-beta'
})
export class GuxTabBeta {
  private buttonElement: HTMLButtonElement;

  @Prop()
  name: string;

  @State()
  active: boolean = false;

  @Prop() guxDisabled: boolean = false;

  @Prop() iconOnly: boolean = false;

  @Listen('click')
  onClick() {
    if (!this.active && !this.guxDisabled) {
      this.internalactivatetabpanel.emit(this.name);
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
          'gux-tab': true,
          'gux-active': this.active
        }}
        type="button"
        disabled={this.guxDisabled}
        id={`${this.name}-tab`}
        role="tab"
        aria-controls={`${this.name}-panel`}
        aria-selected={this.active.toString()}
        tabIndex={this.active ? 0 : -1}
        ref={el => (this.buttonElement = el)}
      >
        <gux-tooltip-title tab-width={122}>
          <slot />
        </gux-tooltip-title>
      </button>
    );
  }
}
