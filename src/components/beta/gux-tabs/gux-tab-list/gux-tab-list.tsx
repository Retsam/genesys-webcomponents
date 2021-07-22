import {
  Component,
  Element,
  h,
  Host,
  JSX,
  Listen,
  Method,
  State
} from '@stencil/core';

@Component({
  styleUrl: 'gux-tab-list.less',
  tag: 'gux-tab-list',
  shadow: true
})
export class GuxTabList {
  @Element()
  root: HTMLElement;

  @State()
  focused: number = 0;

  @State()
  tabTriggers: HTMLGuxTabTriggerElement[] = [];

  @Listen('keyup')
  onKeyup(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowLeft':
        this.focusPanel(
          this.focused ? this.focused - 1 : this.tabTriggers.length - 1
        );
        break;
      case 'ArrowRight':
        this.focusPanel((this.focused + 1) % this.tabTriggers.length);
        break;
    }
  }

  @Listen('keydown')
  onKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Home':
        event.preventDefault();
        this.focusPanel(0);
        break;
      case 'End':
        event.preventDefault();
        this.focusPanel(this.tabTriggers.length - 1);
        break;
    }
  }

  @Method()
  async guxSetActive(activePanelId: string): Promise<void> {
    this.tabTriggers.forEach((tabTrigger, index) => {
      const active = tabTrigger.panelId === activePanelId;

      tabTrigger.guxSetActive(active);

      if (active) {
        this.focused = index;
      }
    });
  }

  private focusPanel(index: number): void {
    this.focused = index;
    this.tabTriggers[this.focused].guxFocus();
  }

  private onSlotchange(): void {
    this.tabTriggers = this.root.shadowRoot
      .querySelector('slot')
      .assignedElements() as HTMLGuxTabTriggerElement[];
  }

  render(): JSX.Element {
    return (
      <Host role="tablist">
        <slot onSlotchange={this.onSlotchange.bind(this)}></slot>
      </Host>
    );
  }
}
