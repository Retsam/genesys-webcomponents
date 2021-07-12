import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  JSX,
  Prop,
  State
} from '@stencil/core';

import { eventIsFrom } from '../../../../utils/dom/event-is-from';

@Component({
  styleUrl: 'gux-basic-tab.less',
  tag: 'gux-basic-tab'
})
export class GuxBasicTab {
  private tabName: string;

  @Element()
  private root: HTMLElement;
  /**
   * unique id for the tab
   */
  @Prop() tabId: string;

  /**
   * indicates whether or not the tab is active
   */
  @Prop() active: boolean = false;

  /**
   * indicates the gux-icon to display on the left side of the tab (similar to a favicon in the browser)
   */
  @Prop() tabIconName: string;

  @Prop() iconOnly: boolean;

  @State() private showTooltip: boolean = true;

  @Event()
  private internaltabactive: EventEmitter<void>;

  private selectTab(e: MouseEvent): void {
    if (eventIsFrom('.tab-dropdown-container', e)) {
      return;
    }

    this.internaltabactive.emit();
  }

  componentWillLoad() {
    this.tabName = this.root.querySelector('[slot="title"]').innerHTML;
    this.checkForTooltipHideOrShow();
  }

  private checkForTooltipHideOrShow() {
    const clientWidth = this.root.clientWidth;
    // console.log(clientWidth, 'clientWidth')
    if (clientWidth < 113 && !this.root.querySelector('gux-basic-tab-icon')) {
      this.showTooltip = false;
    }
  }

  render(): JSX.Element {
    return [
      <button
        class={{
          'gux-basic-tab': true,
          'gux-active': this.active
        }}
        type="button"
        onClick={e => this.selectTab(e)}
        role="button"
      >
        <slot />
      </button>,
      this.renderTooltip()
    ];
  }

  private renderTooltip() {
    if (this.showTooltip) {
      return <gux-tooltip>{this.tabName}</gux-tooltip>;
    }
  }
}
