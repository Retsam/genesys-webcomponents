import { Component, h, JSX, Method, Prop, State } from '@stencil/core';

@Component({
  styleUrl: 'gux-basic-tab-panel.less',
  tag: 'gux-basic-tab-panel'
})
export class GuxBasicTabPanel {
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
