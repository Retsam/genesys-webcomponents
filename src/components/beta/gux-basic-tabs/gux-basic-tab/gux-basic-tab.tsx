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

@Component({
  styleUrl: 'gux-basic-tab.less',
  tag: 'gux-basic-tab'
})
export class GuxBasicTab {
  private titleName: string;

  @Element()
  private root: HTMLElement;

  @State() private showTooltip: boolean = true;

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

  @Prop() iconOnly: boolean;

  @Event()
  private internaltabactive: EventEmitter<void>;

  private selectTab(e): void {
    this.internaltabactive.emit(e);
  }

  componentWillLoad() {
    this.titleName = this.root.querySelector('[slot="title"]').innerHTML;
    this.checkForTooltipHideOrShow();
  }

  private checkForTooltipHideOrShow() {
    const clientWidth = this.root.clientWidth;
    // console.log(clientWidth, 'clientWidth')
    if (clientWidth < 113 && !this.iconOnly) {
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
        <slot name="icon" />
        <span
          class={{
            'tab-title': true,
            'gux-hidden': this.iconOnly
          }}
        >
          <slot name="title" />
        </span>
      </button>,
      this.renderTooltip()
    ];
  }

  private renderTooltip() {
    if (this.showTooltip) {
      return <gux-tooltip>{this.titleName}</gux-tooltip>;
    }
  }
}
