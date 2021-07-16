import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  JSX,
  Prop
} from '@stencil/core';

@Component({
  styleUrl: 'gux-basic-tab.less',
  tag: 'gux-basic-tab'
})
export class GuxBasicTab {
  @Element()
  /**
   * unique id for the tab
   */
  @Prop()
  tabId: string;

  /**
   * indicates whether or not the tab is active
   */
  @Prop() active: boolean = false;

  /**
   * indicates the gux-icon to display on the left side of the tab (similar to a favicon in the browser)
   */
  @Prop() tabIconName: string;

  @Prop() tooltip: string = '';

  @Event()
  private internaltabactive: EventEmitter<void>;

  private selectTab(): void {
    this.internaltabactive.emit();
  }

  render(): JSX.Element {
    return [
      <button
        class={{
          'gux-basic-tab': true,
          'gux-active': this.active
        }}
        type="button"
        onClick={() => this.selectTab()}
        role="button"
      >
        {/* need to find another way to calculate the width before text overflow */}
        <gux-tooltip-title tooltip={this.tooltip} tabWidth={113}>
          <slot name="title" />
          <slot name="icon" />
        </gux-tooltip-title>
      </button>
    ];
  }
}
