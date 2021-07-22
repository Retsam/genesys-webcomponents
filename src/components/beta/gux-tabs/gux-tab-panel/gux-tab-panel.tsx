import { Component, h, JSX, Method, Prop, State } from '@stencil/core';

@Component({
  styleUrl: 'gux-tab-panel.less',
  tag: 'gux-tab-panel',
  shadow: true
})
export class GuxTabPanel {
  @Prop()
  triggerId: string;

  @Prop()
  panelId: string;

  @State()
  active: boolean = false;

  @Method()
  async guxSetActive(active: boolean): Promise<void> {
    this.active = active;
  }

  render(): JSX.Element {
    return (
      <div
        id={this.panelId}
        role="tabpanel"
        aria-labelledby={this.triggerId}
        tabIndex={0}
        hidden={!this.active}
      >
        <slot></slot>
      </div>
    );
  }
}
