import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  JSX,
  Prop,
  State
} from '@stencil/core';

import { eventIsFrom } from '../../../../utils/dom/event-is-from';

@Component({
  styleUrl: 'gux-basic-tab.less',
  tag: 'gux-basic-tab'
})
export class GuxTabBeta {
  private tabName: string;

  @Element()
  private root: HTMLElement;
  /**
   * unique id for the tab
   */
  @Prop() tabId: string;

  /**
   * indicates whether or not the tab is selected
   */
  @Prop() active: boolean = false;

  /**
   * indicates the gux-icon to display on the left side of the tab (similar to a favicon in the browser)
   */
  @Prop() tabIconName: string;

  @Prop() iconOnly: boolean;

  // @Element()
  // private root: HTMLElement;

  @State() private showTooltip: boolean = true;

  @Event()
  private internaltabselected: EventEmitter<void>;

  private selectTab(e: MouseEvent): void {
    if (eventIsFrom('.tab-dropdown-container', e)) {
      return;
    }

    this.internaltabselected.emit();
  }

  componentWillLoad() {
    this.tabName = this.root.querySelector('span[slot="title"]').innerHTML;
    this.checkForTooltipHideOrShow();
  }

  private checkForTooltipHideOrShow() {
    const clientWidth = this.root.clientWidth;
    // console.log(clientWidth, 'clientWidth')
    if (clientWidth < 158 && !this.iconOnly) {
      this.showTooltip = false;
    }
  }

  private renderTooltip() {
    if (this.showTooltip) {
      return <gux-tooltip>{this.tabName}</gux-tooltip>;
    }
  }

  render(): JSX.Element {
    return (
      <Host>
        <button
          class={`gux-basic-tab ${this.active ? 'selected' : ''}`}
          type="button"
          onClick={e => this.selectTab(e)}
          role="button"
        >
          {this.tabIconName ? (
            <div class="tab-icon-container">
              <gux-icon
                icon-name={this.tabIconName}
                decorative={true}
              ></gux-icon>
            </div>
          ) : null}
          <span class={`tab-title ${this.iconOnly ? 'gux-hidden' : ''}`}>
            <slot name="title" />
          </span>
        </button>
        {this.renderTooltip()}
      </Host>
    );
  }
}
