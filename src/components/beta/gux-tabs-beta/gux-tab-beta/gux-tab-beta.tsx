import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  JSX,
  Prop
} from '@stencil/core';

import { eventIsFrom } from '../../../../utils/dom/event-is-from';

@Component({
  styleUrl: 'gux-tab-beta.less',
  tag: 'gux-tab-beta'
})
export class GuxTabBeta {
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

  @Element()
  private root: HTMLElement;

  @Event()
  private internaltabselected: EventEmitter<void>;

  private selectTab(e: MouseEvent): void {
    if (eventIsFrom('.tab-dropdown-container', e)) {
      return;
    }

    this.internaltabselected.emit();
  }

  render(): JSX.Element {
    return (
      <Host>
        <button
          class={`gux-tab-beta ${this.active ? 'selected' : ''}`}
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
          <span class="tab-title">
            <slot name="title" />
          </span>
        </button>
        <gux-tooltip>test tooltip</gux-tooltip>
      </Host>
    );
  }
}
