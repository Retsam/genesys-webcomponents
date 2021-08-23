import {
  Component,
  Event,
  EventEmitter,
  h,
  JSX,
  Method,
  Prop,
  State,
  Watch
} from '@stencil/core';

@Component({
  styleUrl: 'gux-tab-panel-beta.less',
  tag: 'gux-tab-panel-beta'
})
export class GuxTabPanelBeta {
  @Prop()
  name: string;

  @State()
  active: boolean = false;

  @Method()
  async guxSetActive(active: boolean): Promise<void> {
    this.active = active;
  }

  @Event()
  guxactivepanelchange: EventEmitter<string>;

  @Watch('active')
  watchActivePanel() {
    if (this.active === true) {
      this.guxactivepanelchange.emit(this.name);
    }
  }

  render(): JSX.Element {
    return (
      <div
        id={`${this.name}-panel`}
        role="tabpanel"
        aria-labelledby={`${this.name}-tab`}
        tabIndex={0}
        hidden={!this.active}
      >
        <slot></slot>
      </div>
    );
  }
}
